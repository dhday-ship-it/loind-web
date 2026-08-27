import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import type { Story } from "../types/story";

interface UseStoriesOptions {
  /** true면 메인페이지 노출로 선택된 스토리만 가져옵니다. */
  homeFeatured?: boolean;
}

export function useStories(maxCount?: number, options?: UseStoriesOptions) {
  const homeFeatured = options?.homeFeatured ?? false;
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      let query = supabase
        .from("stories")
        .select("*")
        .order("created_at", { ascending: false });
      if (homeFeatured) query = query.eq("is_home_featured", true);
      if (maxCount) query = query.limit(maxCount);

      const { data, error } = await query;
      if (cancelled) return;

      if (error) {
        setError(new Error(error.message));
      } else {
        setStories((data ?? []) as Story[]);
        setError(null);
      }
      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [maxCount, homeFeatured]);

  return { stories, loading, error };
}
