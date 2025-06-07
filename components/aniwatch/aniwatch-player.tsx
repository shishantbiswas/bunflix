"use server";
import { redirect } from "next/navigation";
import Player from "./art-player";
import Download from "@/app/(anime)/anime/[id]/download";

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

  const {
    data: { dub: serverDub, sub: serverSub, raw: serverRaw },
  } = await fetchAniwatchEpisodeServer(episodeId, ep);
  if (lang === "en") {
    if (serverDub.length === 0) {
      redirect(`/error?err=${encodeURIComponent("No Dub Available")}`);
    }

    const dub: AniwatchEpisodeSrc = await fetchAniwatchEpisodeSrc(
      episodeId,
      ep,
      serverDub[0].serverName,
      "dub",
      serverDub[1].serverName
    );

    return (
      <div className="flex flex-col w-full">
        <Player src={dub?.data.sources[0]?.url} track={dub.data.tracks} />
        <Download src={dub?.data.sources[0]?.url} track={dub.data.tracks} lang="en" />
      </div>);
  } else {
    if (serverSub.length === 0 && serverRaw.length === 0) {
      redirect(`/anime/${episodeId}?ep=${ep}&lang=en&num=1`);
    }

    const sub: AniwatchEpisodeSrc = await fetchAniwatchEpisodeSrc(
      episodeId,
      ep,
      !serverSub[0] ? serverRaw[0].serverName : serverSub[0].serverName,
      !serverSub[0] ? "raw" : "sub",
      !serverSub[1]
        ? serverRaw[1].serverName
          ? serverRaw[1].serverName
          : serverRaw[0].serverName
        : serverSub[1].serverName
          ? serverSub[1].serverName
          : serverSub[0].serverName
    );

    if (sub.data.sources.length === 0) {
      redirect(`/error?err=${encodeURIComponent("No Sub Available")}`);
    }

    return (
      <div className="flex flex-col w-full">
        <Player src={sub?.data.sources[0]?.url} track={sub.data.tracks} />
        <Download src={sub?.data.sources[0]?.url} track={sub.data.tracks} lang="jp" />
      </div>
    );
  }
}

async function fetchAniwatchEpisodeSrc(
  id: string,
  ep: string,
  server: string,
  category: string,
  altServer?: string
) {
  try {
    const response = await fetch(
      `${process.env.ANIWATCH_API
      }/api/v2/hianime/episode/sources?animeEpisodeId=${id}?ep=${ep}&server=${server ? (server === "hd-3" ? altServer : server) : "vidstreaming"
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
