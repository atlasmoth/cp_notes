"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import axios from "axios";
import { Note } from "../utils/schemas";
import { MdDownload } from "react-icons/md";

export default function ReviewNote() {
  const [loading, setLoading] = useState(false);
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

            <button className="connect-wallet">Edit note</button>
          </div>
        </section>
      )}
    </main>
  );
}
