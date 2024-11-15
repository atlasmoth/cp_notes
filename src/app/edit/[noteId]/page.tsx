"use client";

import dynamic from "next/dynamic";
import Loading from "@/app/components/Loading";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import { Note } from "@/app/utils/schemas";
import Link from "next/link";

const EditNote = dynamic(() => import("@/app/components/EditNote"), {
  ssr: false,
  loading: Loading,
});

export default function Home() {
  const [note, setNote] = useState<Note | null>(null);

  const { noteId } = useParams<{ noteId: string }>();

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`/api/notes?id=${noteId}`, {
        headers: { "Content-Type": "application/json" },
      });
      setNote(res.data.data);
    };
    fetchData().catch((e) => {
      toast.error(e.message);
    });
  }, []);

  return (
    <main>
      <header className="other-header">
        <div className="container">
          <nav className="other-header-nav">
            <Link href={"/"}>
              {" "}
              <h1 className="text-xl">Notes App</h1>
            </Link>
          </nav>
        </div>
        <div className="black-line">
          <div className="main-black-line"></div>
          <div className="container">
            <div className="witness-list-items">
              <div className="witness-list-item active">
                <p>Edit note</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {!note ? <Loading /> : <EditNote note={note!} />}
    </main>
  );
}
