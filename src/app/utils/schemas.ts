import { z } from "zod";

export const CreateNoteFormSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z
    .string()
    .min(1, { message: "Description is required" })
    .min(1, { message: "Description must be at least 1 character" }),
  images: z.array(z.string()).optional(),
});

export interface Note {
  id: string;
  title: string;
  description: string;
  images: string[];
  created_at: string;
  version: number;
  creator: string;
}
