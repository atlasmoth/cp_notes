"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MoonLoader } from "react-spinners";
import axios from "axios";
import { MdDelete } from "react-icons/md";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { CreateNoteFormSchema, Note } from "../utils/schemas";

type FormData = z.infer<typeof CreateNoteFormSchema>;

export default function EditNote({ note }: { note: Note }) {
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
    defaultValues: {
      images: note.images,
      title: note.title,
      description: note.description,
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      await axios.put(
        `/api/notes`,
        {
          ...data,
          id: note.id,
          //  add identification method
        },
        { headers: { "Content-Type": "application/json" } }
      );

      setLoading(false);
      console.log("This is getting here");
      router.push(`/notes/${note.id}`);
    } catch (error: any) {
      setLoading(false);
      toast.error(error.message);
    }
  };

  const images = watch("images") || [];
  const [loadingImage, setLoadingImage] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <section className="main-section verify-section">
      <div className="container pt-10">
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
            Images (at most 4)
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
                          const fileArray = Array.from(e?.target?.files || []);
                          if (fileArray.length < 1) return;
                          const file = fileArray[0];
                          const formData = new FormData();
                          formData.append("file", file);
                          formData.append(
                            "upload_preset",
                            process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_PRESET!
                          );
                          const res = await axios.post(
                            `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
                            formData
                          );
                          field.onChange([...images, res.data.secure_url]);
                        } catch (error) {
                        } finally {
                          setLoadingImage(false);
                        }
                      }}
                      disabled={loadingImage || images.length > 3}
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

          <button className="connect-wallet  mb-12">
            {loading ? "Loading..." : "Continue"}
          </button>
        </form>
      </div>
    </section>
  );
}