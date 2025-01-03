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
  if (lang === "en") {

    if (server.data.dub.length === 0) {
      redirect(`/error?err=${encodeURIComponent("No Dub Available")}`)
    }

    const dub: AniwatchEpisodeSrc = await fetchAniwatchEpisodeSrcDub(
      episodeId,
      ep,
      server.data.dub[0].serverName
    );

    return (
      <Player src={dub?.data.sources[0]?.url} track={dub.data.tracks} />
    );
  } else {

    if (server.data.sub.length === 0) {
      redirect(`/anime/${episodeId}?ep=${ep}&lang=en&num=1`)
    }

    const sub: AniwatchEpisodeSrc = await fetchAniwatchEpisodeSrc(
      episodeId,
      ep,
      server.data.sub[0].serverName
    );

    if (sub.data.sources.length === 0) {
      redirect(`/error?err=${encodeURIComponent("No Sub Available")}`)
    }

    return (
      <Player src={sub?.data.sources[0]?.url} track={sub.data.tracks} />
    );
  }
}

async function fetchAniwatchEpisodeSrc(id: string, ep: string, server: string) {
  const response = await fetch(
    `${process.env.ANIWATCH_API}/api/v2/hianime/episode/sources?animeEpisodeId=${id}?ep=${ep}&server=${server ? server : "vidstreaming"
    }`,
    { cache: "force-cache" }
  );

  const data = await response.json();
  return data;
}

async function fetchAniwatchEpisodeSrcDub(
  id: string,
  ep: string,
  server: string
) {
  try {
    const response = await fetch(
      `${process.env.ANIWATCH_API
      }/api/v2/hianime/episode/sources?animeEpisodeId=${id}?ep=${ep}&server=${server ? server : "vidstreaming"
      }&category=dub`,
      { cache: "no-store" }
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
      { cache: "no-store" }
    );
    const data = await response.json() as AniwatchServer;

    return data;
  } catch (error) {
    throw new Error(`Fetch failed Episode Sources english`);
  }
}
