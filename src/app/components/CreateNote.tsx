"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MoonLoader } from "react-spinners";
import axios from "axios";
import { MdDelete } from "react-icons/md";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { CreateNoteFormSchema } from "../utils/schemas";
import { useLogin } from "../hooks/useAuth";
import { addToDb } from "../utils/storage";

type FormData = z.infer<typeof CreateNoteFormSchema>;

export default function CreateNote() {
  const { profile, login, logout } = useLogin();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(CreateNoteFormSchema),
    mode: "all",
  });
  const images = watch("images") || [];
  const [loadingImage, setLoadingImage] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: FormData) => {
    if (!profile) return;
    try {
      const recordId = Math.random().toString().slice(-13) + Date.now();
      addToDb(recordId, {
        ...data,
        creator: profile.sub,
        id: recordId,
        created_at: new Date().toISOString(),
        images: data.images || [],
      });
      router.push(`/notes/${recordId}`);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

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
                <p>Add note</p>
              </div>
            </div>
          </div>
        </div>
      </header>
      <section className="main-section verify-section">
        <div className="container pt-10">
          <button
            className="connect-wallet-sec text-sm flex items-center"
            onClick={() => {
              if (!profile) {
                return login();
              }
              logout();
            }}
          >
            {profile ? (
              <span className="mr-2">{profile.name}</span>
            ) : (
              <span className="mr-2">Log in</span>
            )}
          </button>
          <form onSubmit={handleSubmit(onSubmit)}>
            <p className="text-xs mb-2 uppercase text-[rgba(255,255,255,0.6)] mt-5">
              title
            </p>
            <input
              id="title"
              type="text"
              placeholder="Enter title"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-red-300 font-thin text-sm mt-1">
                {errors.title.message}
              </p>
            )}

            <p className="text-xs mb-2 uppercase text-[rgba(255,255,255,0.6)] mt-5">
              Description
            </p>
            <textarea
              placeholder="Enter description"
              rows={7}
              {...register("description")}
            />
            {errors.description && (
              <p className="text-red-300 font-thin text-sm mt-1">
                {errors.description.message}
              </p>
            )}

            <p className="text-xs uppercase text-[rgba(255,255,255,0.6)] mt-5 mb-2">
              Images
            </p>

            <Controller
              control={control}
              name="images"
              render={({ field }) => {
                return (
                  <>
                    {images.length > 0 ? (
                      <div className="gallery mb-5">
                        {images.map((t) => (
                          <div key={t} className="relative">
                            <p
                              className="absolute right-0 p-1 bg-[rgba(0,0,0,0.6)] rounded-md mr-2 mt-2 cursor-pointer"
                              onClick={() => {
                                const filteredImages = images.filter(
                                  (i) => i !== t
                                );
                                field.onChange(filteredImages);
                              }}
                            >
                              <MdDelete color="rgba(255,255,255,0.8)" />
                            </p>
                            <img
                              src={t}
                              alt="Incident image"
                              className="rounded-lg object-cover max-h-[100%] w-[100%] h-[200px]"
                            />
                          </div>
                        ))}
                      </div>
                    ) : null}
                    <div className="relative upload-button">
                      {loadingImage ? (
                        <div className="flex justify-center">
                          <MoonLoader color="#fff" size={40} />
                        </div>
                      ) : (
                        <p className="text-center">Add Image 📸</p>
                      )}

                      <input
                        accept="image/*"
                        onChange={async (e) => {
                          try {
                            setLoadingImage(true);
                            const fileArray = Array.from(
                              e?.target?.files || []
                            );
                            if (fileArray.length < 1) return;
                            const file = fileArray[0];

                            const reader = new FileReader();
                            reader.readAsDataURL(file);
                            reader.onloadend = function () {
                              field.onChange(
                                Array.from(new Set([...images, reader.result]))
                              );
                            };
                          } catch (error) {
                          } finally {
                            setLoadingImage(false);
                          }
                        }}
                        disabled={loadingImage}
                        type="file"
                        className="absolute top-0 bottom-0 left-0 right-0 z-10 mb-0 opacity-0"
                        placeholder="Add image"
                      />
                    </div>
                  </>
                );
              }}
            />

            {errors.images && (
              <p className="text-red-300 font-thin text-sm mt-1">
                {errors.images.message}
              </p>
            )}

            <div className="mt-10"></div>
            {!profile ? (
              <p className="text-red-300 font-thin text-sm mb-2">
                Please log in to add note
              </p>
            ) : null}
            <button className="connect-wallet  mb-12">
              {loading ? "Loading..." : "Continue"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
