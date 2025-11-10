import { Hono } from 'hono'

const app = new Hono()
app.get('/', (c) => c.text('Hello Bun!'))

// Proxy route equivalent to the Next.js edge handler in
// app/api/proxy/[...url]/route.ts
app.get('/api/proxy/*', async (c) => {
  // Reconstruct the path segments after /api/proxy/
  const incomingUrl = c.req.url

  const parts = incomingUrl.split('/').slice(5)

  const completeUrl = parts
    .map((part) => (part === 'https:' ? part + '//' : part + '/'))
    .join('')

  const sanitizedUrl = new URL(decodeURIComponent(completeUrl));
  
  if (sanitizedUrl.host === 'thunderstrike77.online') {
    sanitizedUrl.host = 'haildrop77.pro'
  }

  const headers = c.req.header();
  const res = await fetch(sanitizedUrl, {
    method: 'GET',
    cache: 'no-store',
    redirect: 'follow',
    keepalive: true,
    headers: {
      ...headers,
      Referer: "https://megacloud.club/",
    },
  })

  if (!res.ok) {
    return new Response(JSON.stringify({ error: res.status, message: res.statusText }), {
      status: res.status,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (!res.body) {
    return new Response('No body in response', { status: 500 })
  }

  return new Response(res.body, {
    status: res.status,
    headers: {
      'Content-Type': res.headers.get('Content-Type') || 'application/octet-stream',
      'Cache-Control': 'private, max-age=3600',
    },
  })
})

export default { 
  port: 3001, 
  fetch: app.fetch, 
} 
