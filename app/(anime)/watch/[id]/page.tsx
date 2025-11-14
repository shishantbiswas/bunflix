import { AniwatchShowInfo } from "@/components/aniwatch/aniwatch-info";
import AniwatchPlayer from "@/components/aniwatch/aniwatch-player";
import EpisodeSelector from "@/components/aniwatch/episode-selector";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export async function generateMetadata({
  params,
  searchParams,
}: PageProps<"/watch/[id]">): Promise<Metadata> {
  const { id } = await params;
  const { num } = await searchParams;

  const data: AniwatchInfo = await fetchAniwatchId(id);

  const title = `${num ? `${num}` : "1"}  - ${data.data?.anime?.info.name}`;
  return {
    title,
    description: data.data.anime?.info.description,
    openGraph: {
      title,
      siteName: "Nextflix",
      type: "video.movie",
      description: data.data.anime.info.description,
      images: data.data.anime.info.poster,
    },
    twitter: {
      title,
      description: data.data.anime.info.description,
      images: data.data.anime.info.poster,
    },
  };
}

export default async function Anime({
  params,
  searchParams,
}: PageProps<"/watch/[id]">) {
  const { id } = await params;
  const { num, ep, lang } = (await searchParams) as unknown as {
    lang: "en" | "jp";
    ep: string;
    num: string;
  };

  const episode: AniwatchEpisodeData = await fetchAniwatchEpisode(id);
  const epNum =
    Number(num || 0) > episode.data.totalEpisodes ? 0 : Number(num || 0) - 1;

  const epId =
    episode.data.episodes[epNum] ||
    episode.data.episodes[epNum - 1] ||
    episode.data.episodes[0];

  if (!ep) {
    redirect(
      `/watch/${epId.episodeId}&lang=${lang || "jp"}&num=${epId.number}`
    );
  }

  const data = await fetchAniwatchId(id);

  return (
    <div className=" min-h-screen space-y-6">
      <div className="flex lg:flex-row flex-col">
        <AniwatchPlayer
          nextEpUrl={episode.data.episodes[epNum + 1]?.episodeId}
          episodeId={id}
          lang={lang}
          ep={ep}
        />
        <EpisodeSelector lang={lang} episode={episode} />
      </div>
      <AniwatchShowInfo
        key={id}
        lang={lang}
        ep={ep}
        currentEpisodeNum={num ? num : episode.data.episodes[0].number}
        data={data}
      />
    </div>
  );
}

async function fetchAniwatchEpisode(seasonId: string) {
  try {
    const response = await fetch(
      `${process.env.ANIWATCH_API}/api/v2/hianime/anime/${seasonId}/episodes`,
      { next: { revalidate: 3600, tags: ["anime"] } }
    );
    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`Fetch failed for Season`);
  }
}

async function fetchAniwatchId(id: string): Promise<AniwatchInfo> {
  try {
    const response = await fetch(
      `${process.env.ANIWATCH_API}/api/v2/hianime/anime/${id}`,
      { next: { revalidate: 3600, tags: ["anime"] } }
    );

    const data: AniwatchInfo = await response.json();

    return data;
  } catch (error) {
    throw new Error(`Failed fetching details for Anime`);
  }
}
