import React from "react";
import styles from "./FilterSidebar.module.css"

interface FilterSidebarProps {
  open: boolean;
  onClose: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ open, onClose }) => {
  return (
    <div
      className={`filter-panel fixed inset-y-0 right-0 w-full max-w-xs bg-background-light dark:bg-background-dark shadow-lg z-30 overflow-y-auto 
      ${styles.filterPanel} ${open ? styles.open : ""}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">Filters</h2>

        <button
          onClick={onClose}
          className="text-text-primary-light dark:text-text-primary-dark flex size-10 items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-card-dark"
        >
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>
      </div>

      {/* Filter Content */}
      <div className="p-4 flex flex-col gap-6">
        {/* ⬇️⬇️ PASTE YOUR FILTER HTML CONTENT HERE EXACTLY AS IT IS ⬇️⬇️ */}
        {/* All experience, eligibility, specialization, languages etc. */}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800 sticky bottom-0 bg-background-light dark:bg-background-dark">
        <button className="w-full bg-normal-blue text-white font-semibold py-3 px-4 rounded-lg hover:bg-primary/90 transition-colors">
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default FilterSidebar;