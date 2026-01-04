"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "./page.module.css";

type LawyerProfile = {
  id: string;
  first_name: string;
  last_name: string;
  experience: number;
  // location: string;
  email: string;
  city: string;
  state: string;
  office_address: string;
  profile_picture: string;
  bar_license: string;
  aor_certified: boolean;
  court_eligibility: {
    district_court: boolean;
    high_court: boolean;
    supreme_court: boolean;
  };
  specialities: string[];
  languages: string[];
  description: string;
  avg_rating: number;
  review_count: number;
};

const LawyerProfilePage: React.FC = () => {
  const server_url = process.env.NEXT_PUBLIC_DEV_SERVER_URL;
  
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [lawyer, setLawyer] = useState<LawyerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);



  //save unsave toggle
  const toggleBookmark = async () => {
    if (saving) return;

    setSaving(true);
    setIsSaved(prev => !prev); // optimistic update

    try {
      if (!isSaved) {
        await fetch(`${server_url}/api/user/saved-lawyers/update/new-save/${id}`, {
          method: "POST",
          credentials: "include"
        });
      } else {
        await fetch(`${server_url}/api/user/saved-lawyers/update/delete-saved-lawyer/${id}`, {
          method: "DELETE",
          credentials: "include"
        });
      }
    } catch (err) {
      // rollback on error
      setIsSaved(prev => !prev);
    } finally {
      setSaving(false);
    }
  };




  useEffect(() => {
    if (!id) return;

    const fetchLawyer = async () => {
      try {
        const res = await fetch(`${server_url}/api/explore/fetch/lawyer/${id}` ,{
          method:"GET",
          credentials:"include"
        });
        if (!res.ok) throw new Error("Failed to fetch lawyer");

        const data: LawyerProfile = await res.json();
        setLawyer(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };


     const checkSaved = async () => {
    const res = await fetch(`${server_url}/api/user/saved-lawyers/fetch/isLawyerSaved/${id}` ,{
          method:"GET",
          credentials:"include"
        });
    const data: { saved: boolean } = await res.json();
    setIsSaved(data.saved);
  };

  checkSaved();

    fetchLawyer();
  }, [id]);




  if (loading) {
    return <p className={styles.loading}>Loading profile...</p>;
  }

  if (!lawyer) {
    return <p className={styles.error}>Lawyer not found</p>;
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>

        {/* Header */}
        <header className={styles.header}>
          <button className={styles.iconButton} onClick={() => router.back()}>
            <span className="material-symbols-outlined">arrow_back</span>
          </button>

          <h1 className={styles.title}>Lawyer Profile</h1>

         <button 
  className={`${styles.iconButton} ${isSaved ? styles.bookmarked : ""}`}
  onClick={toggleBookmark}
>
  <span className="material-symbols-outlined">bookmark</span>
</button>
        </header>

        {/* Profile Overview */}
        <section className={styles.profileSection}>
          <div
            className={styles.profilePic}
            style={{ backgroundImage: `url(${lawyer.profile_picture})` }}
          />
          <div className={styles.profileInfo}>
            <p className={styles.name}>
              {lawyer.first_name} {lawyer.last_name}
            </p>
            <p className={styles.experience}>
              {lawyer.experience} Years Experience
            </p>
            <p className={styles.location}>{lawyer.city}, {lawyer.state}</p>
          </div>
        </section>

        {/* Contact */}
        <section className={styles.infoCard}>
          <div className={styles.contactBlock}>
            <div className={styles.infoRow}>
              <span className="material-symbols-outlined">mail</span>
              <span>{lawyer.email}</span>
            </div>

            <div className={styles.infoRow}>
              <span className="material-symbols-outlined">location_on</span>
              <div className={styles.mapBlock}>
                <span>{lawyer.office_address}</span>
                <a href="#" className={styles.mapButton}>
                  <span className="material-symbols-outlined">map</span>
                  <span>View on Google Maps</span>
                </a>
              </div >
            </div>
          </div>

          <hr className={styles.divider} />

          {/* Badges */}
          <div className={styles.badgesRow}>
            <div className={styles.badgeBlue}>
              <span className="material-symbols-outlined">badge</span>
              <span>Bar ID: {lawyer.bar_license}</span>
            </div>

            {lawyer.aor_certified && (
              <div className={styles.badgeTeal}>
                <span className="material-symbols-outlined">verified</span>
                <span>AOR Certified</span>
              </div>
            )}
          </div>

          <hr className={styles.divider} />

          {/* Courts */}
          <div className={styles.courtsGrid}>
            {lawyer.court_eligibility.district_court && (
              <div className={styles.courtCard}>
                <span className="material-symbols-outlined">gavel</span>
                <p>District Court</p>
              </div>
            )}

            {lawyer.court_eligibility.high_court && (
              <div className={styles.courtCard}>
                <span className="material-symbols-outlined">balance</span>
                <p>High Court</p>
              </div>
            )}

            {lawyer.court_eligibility.supreme_court && (
              <div className={styles.courtCard}>
                <span className="material-symbols-outlined">account_balance</span>
                <p>Supreme Court</p>
              </div>
            )}
          </div>
        </section>

        {/* Specializations */}
        <section className={styles.detailSection}>
          <h3>Specialization Areas</h3>
          <div className={styles.chipContainer}>
            {lawyer.specialities.map(s => (
              <span key={s} className={styles.chip}>{s}</span>
            ))}
          </div>
        </section>

        {/* Languages */}
        <section className={styles.detailSection}>
          <h3>Languages</h3>
          <div className={styles.chipContainer}>
            {lawyer.languages.map(l => (
              <span key={l} className={styles.chip}>{l}</span>
            ))}
          </div>
        </section>

        {/* About */}
        <section className={styles.detailSection}>
          <h3>About</h3>
          <p>{lawyer.description}</p>
        </section>

        {/* Rating */}
        <section className={styles.ratingCard}>
          <span className="material-symbols-outlined">star</span>
          <p className={styles.ratingValue}>{lawyer.avg_rating}</p>
          <p className={styles.ratingCount}>
            ({lawyer.review_count} reviews)
          </p>
        </section>
      </main>

      <footer className={styles.footer}>
        <button className={styles.bookButton} onClick={()=>{router.push(`/User-Chat/${id}`)}}>Chat</button>
      </footer>
    </div>
  );
};

export default LawyerProfilePage;