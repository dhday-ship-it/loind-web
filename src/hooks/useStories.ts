import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import type { Story } from "../types/story";

export function useStories(maxCount?: number) {
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
  }, [maxCount]);

  return { stories, loading, error };
}
