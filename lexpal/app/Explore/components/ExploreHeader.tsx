import React from "react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
interface ExploreHeaderProps {
  onOpenFilters: () => void;
  router: AppRouterInstance;
}



const ExploreHeader: React.FC<ExploreHeaderProps> = ({ onOpenFilters ,router}) => {
  return (
    <header className="flex flex-col gap-2 bg-background-light dark:bg-background-dark p-4 sticky top-0 z-20 border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center gap-2">

        <button
      onClick={() => router.back()}
      className="text-text-primary-light dark:text-text-primary-dark flex size-10 items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-card-dark"
    >
      <span className="material-symbols-outlined text-2xl">
        arrow_back
      </span>
    </button>

        <h1 className="text-text-primary-light dark:text-text-primary-dark text-lg font-bold flex-1">
          Explore Trusted Advocates
        </h1>

        <button
          onClick={onOpenFilters}
          className="text-text-primary-light dark:text-text-primary-dark flex size-10 items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-card-dark"
        >
          <span className="material-symbols-outlined text-2xl">filter_alt</span>
        </button>
      </div>
    </header>
  );
};

export default ExploreHeader;