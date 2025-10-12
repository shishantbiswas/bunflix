#!/usr/bin/env bun
import * as cheerio from "cheerio";

const mf = [
  "strugglingelevenfallout.com",
  "falsifyprobable.com",
  "protectioncleave.com",
  "wickedsetup.com"
]

import { z } from 'zod';

// Zod schemas
const CookieSchema = z.object({
  name: z.string(),
  value: z.string(),
  domain: z.string(),
  path: z.string(),
  expires: z.date().nullable(),
  maxAge: z.number().int().nullable(),
  secure: z.boolean(),
  httpOnly: z.boolean(),
  sameSite: z.enum(['Strict', 'Lax', 'None'])
});

const FetchOptionsSchema = z.object({
  redirect: z.enum(['follow', 'error', 'manual']).optional().default('follow'),
  maxRedirects: z.number().int().positive().optional().default(20),
  method: z.string().optional(),
  headers: z.record(z.string(), z.string()).or(z.instanceof(Headers)).optional(),
  body: z.union([
    z.string(),
    z.instanceof(Blob),
    z.instanceof(ArrayBuffer),
    z.instanceof(FormData),
    z.instanceof(URLSearchParams),
    z.instanceof(ReadableStream)
  ]).nullable().optional(),
  signal: z.instanceof(AbortSignal).optional(),
  credentials: z.enum(['omit', 'same-origin', 'include']).optional(),
  cache: z.enum(['default', 'no-store', 'reload', 'no-cache', 'force-cache', 'only-if-cached']).optional(),
  mode: z.enum(['cors', 'no-cors', 'same-origin']).optional(),
  referrer: z.string().optional(),
  referrerPolicy: z.enum([
    'no-referrer',
    'no-referrer-when-downgrade',
    'origin',
    'origin-when-cross-origin',
    'same-origin',
    'strict-origin',
    'strict-origin-when-cross-origin',
    'unsafe-url'
  ]).optional(),
  integrity: z.string().optional()
}).passthrough();

type Cookie = z.infer<typeof CookieSchema>;
type FetchOptions = z.infer<typeof FetchOptionsSchema>;

export class FetchWithCookies {
  private cookies: Map<string, Cookie>;

  constructor() {
    this.cookies = new Map();
  }

  // Parse Set-Cookie header with validation
  private parseCookie(setCookieHeader: string, url: string): Cookie {
    const parts = setCookieHeader.split(';').map(p => p.trim());
    const [nameValue] = parts;
    const [name, value] = nameValue.split('=');

    const cookieData = {
      name: name.trim(),
      value: value.trim(),
      domain: new URL(url).hostname,
      path: '/',
      expires: null as Date | null,
      maxAge: null as number | null,
      secure: false,
      httpOnly: false,
      sameSite: 'Lax'
    };

    // Parse attributes
    for (let i = 1; i < parts.length; i++) {
      const [attr, val] = parts[i].split('=').map(s => s?.trim());
      const attrLower = attr.toLowerCase();

      if (attrLower === 'domain') cookieData.domain = val?.replace(/^\./, '') || cookieData.domain;
      else if (attrLower === 'path') cookieData.path = val || cookieData.path;
      else if (attrLower === 'expires') cookieData.expires = new Date(val);
      else if (attrLower === 'max-age') cookieData.maxAge = parseInt(val);
      else if (attrLower === 'secure') cookieData.secure = true;
      else if (attrLower === 'httponly') cookieData.httpOnly = true;
      else if (attrLower === 'samesite') {
        const sameSiteValue = val?.charAt(0).toUpperCase() + val?.slice(1).toLowerCase();
        if (sameSiteValue === 'Strict' || sameSiteValue === 'Lax' || sameSiteValue === 'None') {
          cookieData.sameSite = sameSiteValue;
        }
      }
    }

    // Validate with Zod
    return CookieSchema.parse(cookieData);
  }

  // Check if cookie is expired
  private isExpired(cookie: Cookie): boolean {
    if (cookie.maxAge !== null) {
      return false; // Simplified - would need timestamp tracking
    }
    if (cookie.expires) {
      return new Date() > cookie.expires;
    }
    return false;
  }

  // Get cookies for a URL
  private getCookiesForUrl(url: string): string {
    const urlObj = new URL(url);
    const cookies: string[] = [];

    for (const [key, cookie] of this.cookies) {
      if (this.isExpired(cookie)) {
        this.cookies.delete(key);
        continue;
      }

      // Check domain match
      const cookieDomain = cookie.domain.startsWith('.') ? cookie.domain.slice(1) : cookie.domain;
      if (!urlObj.hostname.endsWith(cookieDomain)) continue;

      // Check path match
      if (!urlObj.pathname.startsWith(cookie.path)) continue;

      // Check secure flag
      if (cookie.secure && urlObj.protocol !== 'https:') continue;

      cookies.push(`${cookie.name}=${cookie.value}`);
    }

    return cookies.join('; ');
  }

  // Store cookies from response
  private storeCookies(response: Response, url: string): void {
    const setCookieHeaders = response.headers.get('set-cookie');
    if (!setCookieHeaders) return;

    // Handle multiple Set-Cookie headers
    const cookies = setCookieHeaders.split(',').map(c => c.trim());

    for (const setCookie of cookies) {
      try {
        const cookie = this.parseCookie(setCookie, url);
        const key = `${cookie.domain}:${cookie.path}:${cookie.name}`;
        this.cookies.set(key, cookie);
      } catch (error) {
        console.warn('Failed to parse cookie:', error);
      }
    }
  }

  // Main fetch function with validation
  async fetch(url: string, options?: FetchOptions): Promise<Response> {
    // Validate options with Zod
    const validatedOptions = FetchOptionsSchema.parse(options ?? {});

    const {
      redirect,
      maxRedirects,
      ...fetchOptions
    } = validatedOptions;

    let currentUrl = url;
    let redirectCount = 0;

    while (true) {
      // Add cookies to request
      const cookieHeader = this.getCookiesForUrl(currentUrl);
      const headers = new Headers(fetchOptions.headers || {});

      if (cookieHeader) {
        headers.set('Cookie', cookieHeader);
      }

      // Make request with manual redirect handling
      const response = await fetch(currentUrl, {
        ...fetchOptions,
        headers,
        redirect: 'manual'
      });

      // Store any cookies from response
      this.storeCookies(response, currentUrl);

      // Handle redirects
      const status = response.status;
      if (status >= 300 && status < 400) {
        if (redirect === 'error') {
          throw new TypeError('Redirect not allowed');
        }

        if (redirect === 'manual') {
          return response;
        }

        // redirect === 'follow'
        if (redirectCount >= maxRedirects) {
          throw new TypeError('Maximum redirect count exceeded');
        }

        const location = response.headers.get('Location');
        if (!location) {
          throw new TypeError('Redirect response missing Location header');
        }

        // Resolve relative URLs
        currentUrl = new URL(location, currentUrl).href;
        redirectCount++;

        // Handle redirect method changes
        if (status === 303 || ((status === 301 || status === 302) && fetchOptions.method === 'POST')) {
          fetchOptions.method = 'GET';
          delete fetchOptions.body;
        }

        continue;
      }

      return response;
    }
  }

  // Clear all cookies
  clearCookies(): void {
    this.cookies.clear();
  }

  // Get all stored cookies (validated)
  getAllCookies(): Cookie[] {
    return Array.from(this.cookies.values());
  }

  // Get cookies for specific domain
  getCookiesByDomain(domain: string): Cookie[] {
    return Array.from(this.cookies.values()).filter(
      cookie => cookie.domain === domain || cookie.domain === `.${domain}`
    );
  }

  // Delete specific cookie
  deleteCookie(name: string, domain?: string, path: string = '/'): boolean {
    for (const [key, cookie] of this.cookies) {
      if (cookie.name === name &&
        (!domain || cookie.domain === domain) &&
        cookie.path === path) {
        this.cookies.delete(key);
        return true;
      }
    }
    return false;
  }

  // Export cookies as JSON (validated)
  exportCookies(): string {
    const cookiesArray = this.getAllCookies();
    return JSON.stringify(cookiesArray, null, 2);
  }

  // Import cookies from JSON (with validation)
  importCookies(jsonString: string): void {
    try {
      const cookiesData = JSON.parse(jsonString);
      const cookiesArray = z.array(CookieSchema).parse(cookiesData);

      for (const cookie of cookiesArray) {
        const key = `${cookie.domain}:${cookie.path}:${cookie.name}`;
        this.cookies.set(key, cookie);
      }
    } catch (error) {
      throw new Error(`Failed to import cookies: ${error}`);
    }
  }
}


async function main() {
  const fetcher = new FetchWithCookies();

  const html = await fetcher.fetch('https://www.2embed.cc/embed/533533');

  const text = await html.text();

  const $ = cheerio.load(text);
  $('script[disable-devtool-auto]').remove();
  $('#gate').remove();
  $('#sbxErr').remove();

  const links = $('#myDropdown a').toArray();

  links.forEach(el => {
    const href = $(el).attr("onclick");
    if (!href) return

    const regex = /https?:\/\/[^\s?#]+(?:\?[^\s#)']+)/g;
    const matches = href.match(regex);

    matches?.forEach((match) => {
      if (match.endsWith("=")) {
        throw new Error("Partial Content Recieved")
      }
    })
  });

  $('script').each((_, el) => {
    const content = $(el).html();
    if (!content) {
      return;
    }
    for (const site of mf) {
      if (content.includes(site)) {
        $(el).remove();
        return;
      }
    }
  });

  const result = $.html();
  return result
}


main().then(console.log).catch(console.error);