"use client";

import dynamic from "next/dynamic";
import Loading from "../components/Loading";

const CreateNote = dynamic(() => import("../components/CreateNote"), {
  ssr: false,
  loading: Loading,
});

export default function Home() {
  return <CreateNote />;
}
