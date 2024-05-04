import { AniwatchInfo } from "@/components/aniwatch/aniwatch-info";
import AniwatchInfoSkeleton from "@/components/fallback-ui/aniwatch-info-skeleton";
import { fetchAniwatchId } from "@/lib/fetch-data";
import { Suspense } from "react";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const data: aniwatchInfo = await fetchAniwatchId(params.id);

  return {
    title: `${data.anime.info.name} - Nextflix`,
  };
}

export default async function Anime({ params }: { params: { id: string } }) {
  return (
    <>
      <Suspense fallback={<AniwatchInfoSkeleton />}>
        <AniwatchInfo id={params.id} />
      </Suspense>
    </>
  );
}
