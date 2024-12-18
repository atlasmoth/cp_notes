"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { useParams } from "next/navigation";
import { Note } from "../utils/schemas";
import { MdDownload } from "react-icons/md";
import { getFromDb } from "../utils/storage";

export default function ReviewNote() {
  const [note, setNote] = useState<Note | null>(null);

  const { noteId } = useParams<{ noteId: string }>();

  useEffect(() => {
    const fetchData = async () => {
      const res = getFromDb(noteId);

      setNote(res);
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
                <p>Review note</p>
              </div>
            </div>
          </div>
        </div>
      </header>
      {!note ? (
        <p className="py-12 text-center pt-[200px]">Loading...</p>
      ) : (
        <section className="main-section verify-section">
          <div className="container">
            <div className="border-y-[#ffffff1a] py-3 mt-5">
              <p className="font-normal text-xl capitalize">{note?.title}</p>
            </div>
            <div className="border-y-[#ffffff1a] py-3 ">
              <p className="font-light text-sm text-[rgba(255,255,255,0.8)]">
                {note?.description}
              </p>
            </div>

            <div className="gallery mb-5">
              {note.images.map((t) => (
                <div key={t} className="relative">
                  <a
                    href={t}
                    target="_blank"
                    className="absolute right-0 p-1 bg-[rgba(0,0,0,0.6)] rounded-md mr-2 mt-2 cursor-pointer"
                  >
                    <MdDownload color="rgba(255,255,255,0.8)" />
                  </a>
                  <img
                    src={t}
                    alt="Incident image"
                    className="rounded-lg object-cover max-h-[100%] w-[100%] h-[200px]"
                  />
                </div>
              ))}
            </div>

            <Link href={`/edit/${note.id}`}>
              <button className="connect-wallet">Edit note</button>
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}
