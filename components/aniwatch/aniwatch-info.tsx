import {
  fetchAniwatchEpisode,
  fetchAniwatchEpisodeSrcDub,
  fetchAniwatchId,
} from "@/data/fetch-data";
import { BadgePlus, SquareArrowOutUpRight } from "lucide-react";
import Link from "next/link";

export async function AniwatchInfo({
  id,
  ep,
}: {
  id: string;
  ep: string;
}) {
  const data: aniwatchInfo = await fetchAniwatchId(id);
  const episode: aniwatchEpisodeData = await fetchAniwatchEpisode(id);
  const src: aniwatchEpisodeSrc = await fetchAniwatchEpisodeSrcDub(
    ep ? id : episode.episodes[0].episodeId,
    ep
  );

  return (
    <div className="bg-black/60 min-h-screen p-4">
      <div>
        <img
          className="-z-10 fixed top-0 size-full object-cover blur-2xl "
          src={data.anime.info.poster}
          alt={data.anime.info.name}
        />
        <div className=" lg:flex ">
          <img
            className="w-full lg:w-fit rounded-md h-[400px] object-cover"
            src={data.anime.info.poster}
            alt={data.anime.info.name}
          />
          <div className=" lg:mt-0 mt-6 lg:px-4">
            <h1 className=" my-2 text-4xl font-semibold">
              {data.anime.info.name}
            </h1>
            <p className=" leading-6 text-[18px]">
              {data.anime.info.description}
            </p>
            <div className=" my-4 flex flex-col xl:flex-row gap-2 opacity-70">
              <p className=" flex gap-2">
                {data.anime.moreInfo.studios}
                <span className=" hidden xl:block">|</span>
              </p>
              <p className=" flex gap-2">
                {data.anime.moreInfo.duration}
                <span className=" hidden xl:block">|</span>
              </p>
              <p className=" flex gap-2">
                {data.anime.moreInfo.status}
                <span className=" hidden xl:block">|</span>
              </p>
              <p className=" flex gap-2">
                {data.anime.moreInfo.japanese}
                <span className=" hidden xl:block">|</span>
              </p>
              <p className=" flex gap-2">
                Sub : {data.anime.info.stats.episodes.sub}
                <span className=" hidden xl:block">|</span>
              </p>
              <p className=" flex gap-2">
                Dub : {data.anime.info.stats.episodes.dub || "Not Available"}
                <span className=" hidden xl:block">|</span>
              </p>
            </div>
          
          </div>

          <div>
            <h1 className="text-3xl font-semibold py-4">Episode </h1>
            <div className="flex items-center mb-6">
              <ul className="h-[500px] w-[300px] bg-slate-500 overflow-y-scroll rounded-lg scrollbar-hide">
                {episode.episodes.map((episode, index) => (
                  <Link
                    key={episode.episodeId}
                    href={`/animeWatch/en/${episode.episodeId}&episode=${episode.number}`}
                    >
                    <li
                      style={{
                        backgroundColor:
                          index % 2 === 0 ? "#334155" : "#1e293b",
                      }}
                      className="px-4 py-2 bg-slate-700"
                    >
                      {episode.number}. {episode.title}
                    </li>
                  </Link>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div id="season">
        <h1 className="font-semibold my-4 text-4xl">Seasons</h1>
        <div className=" mt-4 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {data.seasons.map((e) => (
            <div
              key={e.id}
              className=" p-4 rounded-lg bg-black/30 flex flex-col items-center justify-between"
            >
              <div>
                <img
                  className=" h-[250px] rounded-l w-full object-cover "
                  src={e.poster}
                  alt={e.title}
                />
                <p className=" opacity-65 leading-6 my-2 font-bold text-2xl">
                  {e.title}
                </p>
                <p className=" opacity-65">{e.name}</p>
              </div>
              <Link className=" w-full" href={`/anime/${e.id}`}>
                <button className=" rounded-lg py-1 bg-white/90 flex items-center justify-center gap-2 transition-all  text-black font-semibold w-full mt-8">
                  More Info <SquareArrowOutUpRight size={15} />
                </button>
              </Link>
            </div>
          ))}
        </div>
        {data.seasons.length == 0 && <p>No Seasons Found !</p>}
      </div>
    </div>
  );
}
