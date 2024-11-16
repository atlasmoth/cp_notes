"use client";

export const addToDb = (key: string, value: any) => {
  let notesInMemory = JSON.parse(
    localStorage.getItem("NOTES_APP_ALL_NOTES") || "{}"
  ) as any;
  notesInMemory[key] = value;
  localStorage.setItem("NOTES_APP_ALL_NOTES", JSON.stringify(notesInMemory));
};

export const getFromDb = (key: string) => {
  let notesInMemory = JSON.parse(
    localStorage.getItem("NOTES_APP_ALL_NOTES") || "{}"
  ) as any;
  return notesInMemory[key];
};

export const fetchAllFromDb = () => {
  let notesInMemory = JSON.parse(
    localStorage.getItem("NOTES_APP_ALL_NOTES") || "{}"
  ) as any;
  return Object.values(notesInMemory);
};
