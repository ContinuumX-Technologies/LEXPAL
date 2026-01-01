"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import ExploreHeader from "./components/ExploreHeader";
import FilterSidebar from "./components/FilterSidebar";
import LawyerCard, { type LawyerCardProps } from "./components/LawyerCard";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
const LIMIT = 6;
const server_url = process.env.NEXT_PUBLIC_DEV_SERVER_URL;

const ExplorePage: React.FC = () => {
  const router = useRouter();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [lawyers, setLawyers] = useState<LawyerCardProps[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const loaderRef = useRef<HTMLDivElement | null>(null);




  // 🔹 Fetch lawyers
  const fetchLawyers = useCallback(async () => {
    
    if (!hasMore || loading) return;

    setLoading(true);

    const params = new URLSearchParams({
      limit: "6"
    });

    if (cursor) {
      params.append("cursor", cursor);
    }

    const res = await fetch(`${server_url}/api/explore/fetch/all-lawyers?${params.toString()}`);
    const data: {
      lawyers: LawyerCardProps[];
      nextCursor: string | null;
      hasMore: boolean;
    } = await res.json();

    setLawyers(prev => [...prev, ...data.lawyers]);
    setCursor(data.nextCursor);
    setHasMore(data.hasMore);
    setLoading(false);
  }, [cursor, hasMore, loading]);




  // 🔹 Initial + paginated fetch
  useEffect(() => {
    fetchLawyers();
  }, [fetchLawyers]);




  // 🔹 Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchLawyers();
        }
      },
      { threshold: 1 }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [fetchLawyers, hasMore, loading]);




  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen w-full relative overflow-x-hidden">
      <div className="max-w-md mx-auto">
        <ExploreHeader onOpenFilters={() => setIsFilterOpen(true)} router={router} />

        {/* Lawyer Cards */}
        <div className="grid grid-cols-1 gap-4 p-4">
          {lawyers.map((l) => (
            <LawyerCard first_name={l.first_name}
              id={l.id}
              last_name={l.last_name}
              experience={l.experience}
              avg_rating={l.avg_rating}
              review_count={l.review_count}
              languages={l.languages}
              specialities={l.specialities}
              court_eligibility={l.court_eligibility}
              profile_picture={l.profile_picture}
              router={router} />
          ))}
        </div>

        {/* Loader trigger */}
        <div ref={loaderRef} className={styles.loader}>
          {loading && <p className="text-center text-sm text-gray-500">Loading more lawyers...</p>}
        </div>
      </div>

      <FilterSidebar open={isFilterOpen} onClose={() => setIsFilterOpen(false)} />
    </div>
  );
};

export default ExplorePage;