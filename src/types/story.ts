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
  is_recommended: boolean;
  created_at: string;
}

export type StoryPayload = Omit<Story, "id" | "created_at">;
