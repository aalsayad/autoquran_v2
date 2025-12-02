"use client";

export type Recitor = {
  id: string;
  name: string;
};

export type Segment = {
  id: string;
  start: number; // in seconds
  end: number; // in seconds
  ayahs: number[]; // array of ayah numbers (e.g., [1, 2] for ayahs 1-2)
};

export type Recitation = {
  id: string;
  title?: string;
  surahId: number;
  surahName: string;
  recitorId: string;
  recitorName: string;
  audioUrl: string;
  uploadedAt: string;
  segments?: Segment[];
};

const RECITORS_KEY = "quran_recitors";
const RECITATIONS_KEY = "quran_recitations";

// Recitors
export function getRecitors(): Recitor[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(RECITORS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveRecitor(recitor: Recitor): void {
  const recitors = getRecitors();
  const exists = recitors.find((r) => r.id === recitor.id);
  if (!exists) {
    recitors.push(recitor);
    localStorage.setItem(RECITORS_KEY, JSON.stringify(recitors));
  }
}

export function getRecitor(id: string): Recitor | undefined {
  return getRecitors().find((r) => r.id === id);
}

// Recitations
export function getRecitations(): Recitation[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(RECITATIONS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveRecitation(recitation: Recitation): void {
  const recitations = getRecitations();
  recitations.push(recitation);
  localStorage.setItem(RECITATIONS_KEY, JSON.stringify(recitations));
}

export function getRecitation(id: string): Recitation | undefined {
  return getRecitations().find((r) => r.id === id);
}

export function deleteRecitation(id: string): void {
  const recitations = getRecitations().filter((r) => r.id !== id);
  localStorage.setItem(RECITATIONS_KEY, JSON.stringify(recitations));
}

export function updateRecitationSegments(id: string, segments: Segment[]): void {
  const recitations = getRecitations();
  const index = recitations.findIndex((r) => r.id === id);
  if (index !== -1) {
    recitations[index].segments = segments;
    localStorage.setItem(RECITATIONS_KEY, JSON.stringify(recitations));
  }
}

