"use client";

import { searchHistory } from "@/lib/search-history";
import { useLiveQuery } from "dexie-react-hooks";
import { Trash2Icon } from "lucide-react";
import Link from "@/components/link";

export default function HistoryPage() {
  const history = useLiveQuery(() => searchHistory.searches.toArray());

  return (
    <div className="p-4 pb-24   min-h-screen flex items-center flex-col">
      <h1 className="text-3xl font-bold text-start w-fit">Search History</h1>
      <div className="flex items-center w-full flex-col gap-4 mt-4 max-w-4xl">
        {history?.map((value) => (
          <div className="relative w-full" key={value.id}>
            <Link
              className="w-full "
              href={`/search/${value.type}/${value.term}`}
            >
              <div className="bg-white/10 p-3 w-full rounded-lg flex justify-between items-center">
                <div className=" w-fit flex flex-col">
                  <p className="text-lg">{value.term}</p>
                  <p className="text-sm">{value.type}</p>
                </div>
              </div>
            </Link>
            <button
              onClick={() => {
                searchHistory.searches.delete(value.id);
              }}
              className="absolute top-4 right-2 z-50  p-2 bg-red-500/80 rounded-full"
            >
              <Trash2Icon />
            </button>
          </div>
        ))}
        {history && history.length < 1 && <p>No Search History Found</p>}
      </div>
    </div>
  );
}
