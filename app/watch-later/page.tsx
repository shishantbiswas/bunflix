import WatchLater from "@/components/watch-later";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Watch Later - Nextflix",
  description: "Nextflix clone built with Next.js and Tailwind CSS",
};

export default function WatchLaterPage() {
  return <WatchLater />;
}
