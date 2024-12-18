"use client";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Note } from "../utils/schemas";
import { FaArrowRightLong } from "react-icons/fa6";
import { fetchAllFromDb } from "../utils/storage";
import { redirect } from "next/navigation";

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    const tempNotes = fetchAllFromDb() as Note[];

    if (!tempNotes || tempNotes.length < 1) {
      redirect("/create");
    } else {
      setNotes(tempNotes);
    }
  }, []);

  return (
    <main>
      <header className="other-header">
        <div className="container">
          <nav className="other-header-nav flex  items-center justify-between">
            <Link href={"/"}>
              {" "}
              <h1 className="text-xl">Notes App</h1>
            </Link>
            <Link href={"/create"} className="underline">
              {" "}
              <p>Add note</p>
            </Link>
          </nav>
        </div>
        <div className="black-line">
          <div className="main-black-line"></div>
          <div className="container">
            <div className="witness-list-items">
              <div className="witness-list-item active">
                <p>All notes</p>
              </div>
            </div>
          </div>
        </div>
      </header>
      <section>
        <div className="container pt-10">
          {notes.map((r) => (
            <Link href={`/notes/${r.id}`} key={r.id}>
              <div className="pb-5 mb-5 border-b border-b-[rgba(255,255,255,0.2)]">
                <div className="flex items-center">
                  <p className="flex-1 mr-4"> {r.title}</p>
                  <FaArrowRightLong color="#fff" size={14} />
                </div>
                <p className="my-2 text-sm">
                  {new Date(r.created_at).toLocaleDateString(undefined, {
                    weekday: "long",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour12: true,
                    hour: "numeric",
                    minute: "numeric",
                  })}
                </p>
                <p className="text-sm text-[rgba(255,255,255,0.8)]">
                  {r.description.slice(0, 150)}...
                </p>
                <div className="mini-gallery my-2">
                  {r.images.map((t) => (
                    <div key={t} className="relative">
                      <img
                        src={t}
                        alt="Incident image"
                        className="rounded-lg object-cover max-h-[100%] w-[100%] h-[70px]"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
