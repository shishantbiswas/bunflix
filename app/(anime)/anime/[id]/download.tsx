"use client"

import DownloadVideo from "@/actions/download"
import { useShow } from "@/context/show-provider"
import { DownloadIcon } from "lucide-react"
import { useTransition } from "react"

export default function Download({ src, track, lang }: {
  src: string,
  track: {
    file: string;
    kind: string;
    label: string;
    default: boolean;
  }[]; lang: string
}) {
  const englishSub = track.filter((sub) => sub.label === "English")[0]?.file;

  const { show } = useShow()
  const [isPending, startTransition] = useTransition()
  return (
    <button
      disabled={isPending}
      onClick={async () => {
        startTransition(async () => {
          await DownloadVideo(src, show!, lang, englishSub)
        })
      }}
      className="flex w-fit mx-4 items-center px-3 py-1 rounded-full bg-black/10 hover:bg-black/60 gap-2 justify-center">
      <DownloadIcon size={14} />
      {isPending ? "Downloading..." : "Download"}
    </button>
  )
}