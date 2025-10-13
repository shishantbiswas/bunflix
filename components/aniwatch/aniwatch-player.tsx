"use server";
import { redirect } from "next/navigation";
import Player from "./art-player";

export default async function AniwatchPlayer({
  episodeId,
  ep,
  lang,
}: {
  episodeId: string;
  ep: string;
  lang: "en" | "jp";
}) {
  if (!ep) return;

  const server = await fetchAniwatchEpisodeServer(episodeId, ep);
  if (server.data.dub.length === 0 && lang === "en") {
    redirect(`/error?err=${encodeURIComponent("No Dub Available")}`);
  }

  if (
    server.data.sub.length === 0 &&
    server.data.raw.length === 0 &&
    lang === "jp"
  ) {
    redirect(`/anime/${episodeId}?ep=${ep}&lang=en&num=1`);
  }

  const srcData = await getAniwatchEpisodeSrcWithBackoff(
    episodeId,
    ep,
    lang === "en"
      ? server.data.dub[0].serverName
      : !server.data.sub[0]
      ? server.data.raw[0].serverName
      : server.data.sub[0].serverName,
    lang === "en" ? "dub" : !server.data.sub[0] ? "raw" : "sub"
  );

  if (srcData.data.sources.length === 0) {
    throw new Error("No Source Available");
  }

  if ((!srcData || !srcData.data.sources) && lang === "en") {
    throw new Error("No Dub Available");
  }

  if (srcData.data.sources.length === 0 && lang === "jp") {
    throw new Error("No Sub Available");
  }
  return (
    <Player src={srcData.data.sources[0]?.url} track={srcData.data.tracks} />
  );
}

async function getAniwatchEpisodeSrcWithBackoff(
  id: string,
  ep: string,
  server: string,
  category: string,
  retries: number = 3,
  retryDelayMs: number = 100
): Promise<AniwatchEpisodeSrc> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fetchAniwatchEpisodeSrc(id, ep, server, category);
    } catch (error) {
      if (attempt === retries) {
        throw new Error("Failed to fetch Episode Src after multiple retries");
      }

      const delay = retryDelayMs * Math.pow(2, attempt - 1);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw new Error("Unexpected error while fetching Episode Src");
}

async function fetchAniwatchEpisodeSrc(
  id: string,
  ep: string,
  server: string,
  category: string
) {
  try {
    const response = await fetch(
      `${
        process.env.ANIWATCH_API
      }/api/v2/hianime/episode/sources?animeEpisodeId=${id}?ep=${ep}&server=${
        server ? server : "vidstreaming"
      }&category=${category}`,
      { next: { revalidate: 3600, tags: ["anime"] } }
    );
    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`Fetch failed Episode Sources english`);
  }
}

async function fetchAniwatchEpisodeServer(id: string, ep: string) {
  try {
    const response = await fetch(
      `${process.env.ANIWATCH_API}/api/v2/hianime/episode/servers?animeEpisodeId=${id}?ep=${ep}`,
      { next: { revalidate: 3600, tags: ["anime"] } }
    );
    const data = (await response.json()) as AniwatchServer;

    return data;
  } catch (error) {
    throw new Error(`Fetch failed Episode Sources english`);
  }
}
