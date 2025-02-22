import History from "@/components/history-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "History - Nextflix",
  description: "Nextflix clone built with Next.js and Tailwind CSS",
};

export default function HistoryPage() {
  return <History />;
}
