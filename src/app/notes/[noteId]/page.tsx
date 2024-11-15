"use client";

import dynamic from "next/dynamic";
import Loading from "@/app/components/Loading";

const ReviewNote = dynamic(() => import("@/app/components/ReviewNote"), {
  ssr: false,
  loading: Loading,
});

export default function Home() {
  return <ReviewNote />;
}
