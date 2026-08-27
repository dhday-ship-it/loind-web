export type StoryCategory = "Creative Agency" | "Studio" | "Impact" | string;

export interface Story {
  id: string;
  category: StoryCategory;
  title: string;
  /** 대표 이미지(썸네일). 앨범이 있으면 images[0]와 동일합니다. */
  img: string;
  /** 이미지 앨범 — 상세 팝업에서 슬라이드로 노출됩니다. */
  images: string[];
  text: string;
  summary?: string;
  detail: string;
  link?: string;
  is_recommended: boolean;
  is_home_featured: boolean;
  /** 메인페이지 노출 순서 (작을수록 먼저). is_home_featured=true 인 스토리에만 의미. */
  home_order: number;
  created_at: string;
}

export type StoryPayload = Omit<Story, "id" | "created_at">;

/**
 * 스토리의 이미지 목록을 반환합니다.
 * 앨범(images)이 있으면 그대로, 없으면 대표 이미지(img) 한 장으로 폴백합니다.
 */
export function getStoryImages(story: Pick<Story, "img" | "images">): string[] {
  if (Array.isArray(story.images) && story.images.length > 0) return story.images;
  return story.img ? [story.img] : [];
}
