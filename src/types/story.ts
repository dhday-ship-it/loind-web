import type { Timestamp } from "firebase/firestore";

export type StoryCategory = "Creative Agency" | "Studio" | "Impact" | string;

export interface Story {
  id: string;
  category: StoryCategory;
  title: string;
  img: string;
  text: string;
  summary?: string;
  detail: string;
  link?: string;
  createdAt: Timestamp;
}

export type StoryPayload = Omit<Story, "id" | "createdAt"> & {
  createdAt: Date;
};
