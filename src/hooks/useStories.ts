import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  type QueryConstraint,
} from "firebase/firestore";
import { db } from "../firebase";
import type { Story } from "../types/story";

export function useStories(maxCount?: number) {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const constraints: QueryConstraint[] = [orderBy("createdAt", "desc")];
        if (maxCount) constraints.push(limit(maxCount));
        const q = query(collection(db, "stories"), ...constraints);
        const snapshot = await getDocs(q);
        if (cancelled) return;
        setStories(
          snapshot.docs.map(
            (doc) => ({ id: doc.id, ...doc.data() }) as Story,
          ),
        );
        setError(null);
      } catch (err) {
        if (!cancelled) setError(err as Error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [maxCount]);

  return { stories, loading, error };
}
