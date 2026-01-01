import React from "react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";



export interface LawyerCardProps {
  id: string;
  first_name: string;
  last_name: string;
  experience: string;
  avg_rating: number;
  review_count: number;
  
  languages: string[];
  specialities: string[];
  /** eligibility = [districtCourt, highCourt, supremeCourt] */
  court_eligibility: [boolean, boolean, boolean];
  profile_picture: string;
  router: AppRouterInstance;
}

const LawyerCard: React.FC<LawyerCardProps> = ({
  id,
  first_name,
  last_name,
  experience,
  avg_rating,
  review_count,
  languages,
  specialities,
  court_eligibility,
  profile_picture,
  router
}) => {
  const active = "text-blue-600 dark:text-blue-300";
  const inactive = "text-gray-500 dark:text-gray-400";

  return (
    <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-md p-4 flex flex-col gap-3">

      <div className="flex items-start gap-4">
        <div
          className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-16 w-16 shrink-0"
          style={{ backgroundImage: `url(${profile_picture})` }}
        />

        <div className="flex flex-1 flex-col">
          <p className="text-text-primary-light dark:text-text-primary-dark text-base font-bold leading-tight">
            {first_name+" "+last_name}
          </p>

          <div className="flex flex-wrap items-center gap-1 mt-2">
            {specialities.map((spec, i) => (
              <span
                key={i}
                className="inline-flex items-center bg-soft-blue/30 text-soft-primary dark:bg-primary/20 dark:text-blue-300 text-xs font-semibold px-2 py-0.5 rounded-full w-fit"
              >
                {spec}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 -mt-1 ml-0">
        <span className="material-symbols-outlined text-text-secondary-light dark:text-text-secondary-dark text-base font-semibold">
          work
        </span>
        <span className="text-text-secondary-light dark:text-text-secondary-dark text-xs font-semibold">
          {experience}
        </span>
      </div>

      <div className="flex items-center gap-2">

        {/* Supreme Court → gavel */}
        <span className={`material-symbols-outlined text-lg ${court_eligibility[0] ? active : inactive}`}>
          gavel
        </span>

        {/* High Court → balance */}
        <span className={`material-symbols-outlined text-lg ${court_eligibility[1] ? active : inactive}`}>
          balance
        </span>

        {/* District Court → account_balance */}
        <span className={`material-symbols-rounded text-lg ${court_eligibility[2] ? active : inactive}`}>
          account_balance
        </span>
      </div>

      <div className="flex items-center gap-1.5 text-text-secondary-light dark:text-text-secondary-dark text-sm">
        <span className="material-symbols-outlined text-soft-primary dark:text-blue-300 text-base">
          language
        </span>
        <span>{languages.join(", ")}</span>
      </div>

      <div className="flex items-center gap-1 text-sm text-text-secondary-light dark:text-text-secondary-dark">
        <span
          className="material-symbols-outlined text-soft-accent dark:text-accent"
          style={{ fontSize: 16 }}
        >
          star
        </span>
        <span className="font-semibold text-text-primary-light dark:text-text-primary-dark">
          {avg_rating}
        </span>
        <span>({review_count} reviews)</span>
      </div>

      <button
      onClick={() => router.push(`/Lawyer-Profile/${id}`)}
      className="w-full bg-normal-blue text-white font-semibold py-2.5 px-3 rounded-lg text-sm hover:bg-primary/90 transition-colors"
    >
      View Profile
    </button>
    </div>
  );
};

export default LawyerCard;