import { NextResponse } from "next/server";
import { z } from "zod";
import { CreateNoteFormSchema } from "@/app/utils/schemas";
import { db } from "@/app/utils/supabase";

export async function POST(request: Request) {
  const body = await request.json();
  try {
    const creator = body.creator;

    const validatedData = CreateNoteFormSchema.parse(body);

    const recordData = {
      ...validatedData,
      creator: creator,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await db
      .from("notes")
      .insert(recordData)
      .select()
      .single();

    if (error) {
      console.error("Error inserting data:", error);
      return NextResponse.json(
        { message: "Error creating record", error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Record created successfully", data },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation error", errors: error.errors },
        { status: 400 }
      );
    }
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  try {
    if (id) {
      const { data, error } = await db
        .from("notes")
        .select()
        .eq("id", id)
        .single();
      if (error) {
        console.error("Error fetching data:", error);
        return NextResponse.json(
          { message: "Error fetching data", error: error.message },
          { status: 500 }
        );
      }
      return NextResponse.json({ message: "Success", data }, { status: 200 });
    }
    const query = db
      .from("notes")
      .select()
      .order("created_at", { ascending: false })
      .limit(20);

    const lastTimestamp = url.searchParams.get("lastTimestamp");
    if (lastTimestamp) {
      query.lt("created_at", lastTimestamp);
    }
    const { data, error } = await query;
    if (error) {
      console.error("Error fetching data:", error);
      return NextResponse.json(
        { message: "Error fetching data", error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json({ message: "Success", data }, { status: 200 });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const validatedData = CreateNoteFormSchema.parse(body);
    const recordData = {
      ...validatedData,
    };

    const { error } = await db
      .from("notes")
      .upsert({ ...recordData, id: body.id })
      .select()
      .single();

    if (error) {
      console.error("Error inserting data:", error);
      return NextResponse.json(
        { message: "Error creating record", error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Record created successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
