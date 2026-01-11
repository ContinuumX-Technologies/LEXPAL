"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import { stateCityMap, languagesList, specialtiesList } from "./signupData";

export default function LawyerSignUp() {
  const server_url = process.env.NEXT_PUBLIC_DEV_SERVER_URL;
  const router = useRouter();

  type LawyerForm = {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    confirm_password: string;
    experience: string;
    state: string;
    city: string;
    office_address: string;
    pincode: string;
    bar_license: string;
    AOR_certified: string;
    court_eligibility: string[];
    languages: string[];
    specialties: string[];
    description: string;
  };

  // FORM STATE
  const [form, setForm] = useState<LawyerForm>({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
    experience: "",
    state: "",
    city: "",
    office_address: "",
    pincode: "",
    bar_license: "",
    AOR_certified: "",
    court_eligibility: [],
    languages: [],
    specialties: [],
    description: ""
  });

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // HANDLERS
  useEffect(() => {
    // Add Google Material Icons
    if (!document.querySelector('link[href*="material-symbols"]')) {
      const link = document.createElement("link");
      link.href =
        "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap";
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }

    // Add Inter font
    if (!document.querySelector('link[href*="Inter"]')) {
      const fontLink = document.createElement("link");
      fontLink.href =
        "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap";
      fontLink.rel = "stylesheet";
      document.head.appendChild(fontLink);
    }
  }, []);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setProfileImage(file);
  };

  const toggleMultiSelect = (field: string, value: string) => {
    const arr = form[field as keyof LawyerForm] as string[];
    if (arr.includes(value)) {
      setForm({ ...form, [field]: arr.filter((v) => v !== value) });
      return;
    }
    if (field === "specialties" && arr.length >= 3) return;
    setForm({ ...form, [field]: [...arr, value] });
  };

  const validate = () => {
    const nameRegex = /^[A-Za-z]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!nameRegex.test(form.first_name.trim())) return "First name must contain only letters.";
    if (!nameRegex.test(form.last_name.trim())) return "Last name must contain only letters.";
    if (!emailRegex.test(form.email)) return "Enter a valid email address.";
    if (!form.experience) return "Select years of experience.";
    if (!form.state) return "Select your state.";
    if (!form.city) return "Select your city.";
    if (!form.pincode) return "Pincode is required.";
    if (!/^\d{6}$/.test(form.pincode)) return "Pincode must be exactly 6 digits.";
    if (!form.office_address) return "Enter your address.";
    if (!form.bar_license) return "Enter your Bar License Number.";
    if (!form.AOR_certified) return "Select AOR certification.";
    if (form.court_eligibility.length === 0) return "Select at least one court.";
    if (form.languages.length === 0) return "Select at least one language.";
    if (form.specialties.length === 0) return "Select at least one specialty.";
    if (form.specialties.length > 3) return "You can select max 3 specialties.";
    if (form.password.length < 6) return "Password must be at least 6 characters.";
    if (form.password !== form.confirm_password) return "Passwords do not match.";
    if (!profileImage) return "Profile image is required.";
    if (profileImage.size > 10 * 1024 * 1024) return "Profile image must be under 10MB.";
    if (!profileImage.type.startsWith("image/")) return "Only image files are allowed.";
    return "";
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) return setError(err);

    setSubmitting(true);
    setError("");

    const AOR_booloean = form.AOR_certified == "yes";
    const courtEligibilityObject = {
      district_court: form.court_eligibility.includes("District Court"),
      high_court: form.court_eligibility.includes("High Court"),
      supreme_court: form.court_eligibility.includes("Supreme Court")
    };

    try {
      const res = await fetch(`${server_url}/api/auth/lawyer-signup`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          court_eligibility: courtEligibilityObject,
          AOR_certified: AOR_booloean
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Something went wrong.");
        setSubmitting(false);
        return;
      }

      // Upload image
      const imgData = new FormData();
      imgData.append("profile_picture", profileImage as File);

      const imgRes = await fetch(`${server_url}/api/upload/profile-pic`, {
        method: "POST",
        credentials: "include",
        body: imgData
      });

      const imgDataRes = await imgRes.json();
      if (!imgRes.ok) {
        setError(imgDataRes.message || "Image upload failed");
        setSubmitting(false);
        return;
      }

      router.push("/Lawyer-Dashboard");
    } catch (err) {
      setError("Server error. Try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.root}>
      {/* LEFT: Visual Showcase (Titanium Pro) */}
      <div className={styles.visualColumn}>
        <div className={styles.meshGradient} />

        <div className={styles.visualContent}>
          <h1 className={styles.visualTitle}>
            Designed for <br />
            <span>the elite.</span>
          </h1>
          <p className={styles.visualDesc}>
            Join the exclusive network of legal professionals powering the future of law with AI-driven precision.
          </p>
        </div>
      </div>

      {/* RIGHT: Functional Form */}
      <div className={styles.formColumn}>
        {/* Nav */}
        <div className={styles.topNav}>
          <a href="/" className={styles.logo}>
            <span className="material-symbols-outlined">shield</span>
            LEXPAL PRO
          </a>
          <a href="/" className={styles.backBtn}>Exit Console</a>
        </div>

        {/* Form Container */}
        <div className={styles.formContent}>
          <div className={styles.formHeader}>
            <h2 className={styles.heading}>Advocate Registration.</h2>
            <p className={styles.subheading}>
              Apply for workspace access. <a href="/Lawyer-Login">Sign in</a>
            </p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} noValidate>

            {/* Name Row */}
            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <input
                  className={styles.input}
                  name="first_name"
                  value={form.first_name}
                  onChange={handleChange}
                  placeholder=" "
                  suppressHydrationWarning
                />
                <label className={styles.label}>First Name</label>
              </div>
              <div className={styles.inputGroup}>
                <input
                  className={styles.input}
                  name="last_name"
                  value={form.last_name}
                  onChange={handleChange}
                  placeholder=" "
                  suppressHydrationWarning
                />
                <label className={styles.label}>Last Name</label>
              </div>
            </div>

            {/* Email */}
            <div className={styles.inputGroup}>
              <input
                className={styles.input}
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder=" "
                suppressHydrationWarning
              />
              <label className={styles.label}>Professional Email</label>
            </div>

            {/* Password */}
            <div className={styles.inputGroup}>
              <div className={styles.passwordWrapper}>
                <input
                  className={styles.input}
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  placeholder=" "
                  suppressHydrationWarning
                />
                <label className={styles.label}>Create Password</label>
                <button
                  type="button"
                  className={styles.toggleBtn}
                  onClick={() => setShowPassword(!showPassword)}
                  suppressHydrationWarning
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? "visibility" : "visibility_off"}
                  </span>
                </button>
              </div>
            </div>

            <div className={styles.inputGroup}>
              <div className={styles.passwordWrapper}>
                <input
                  className={styles.input}
                  name="confirm_password"
                  type={showConfirm ? "text" : "password"}
                  value={form.confirm_password}
                  onChange={handleChange}
                  placeholder=" "
                  suppressHydrationWarning
                />
                <label className={styles.label}>Confirm Password</label>
                <button
                  type="button"
                  className={styles.toggleBtn}
                  onClick={() => setShowConfirm(!showConfirm)}
                  suppressHydrationWarning
                >
                  <span className="material-symbols-outlined">
                    {showConfirm ? "visibility" : "visibility_off"}
                  </span>
                </button>
              </div>
            </div>

            {/* Experience */}
            <div className={styles.inputGroup}>
              <select
                className={styles.select}
                name="experience"
                value={form.experience}
                onChange={handleChange}
                suppressHydrationWarning
              >
                <option value=""></option>
                {["1+", "2+", "3+", "5+", "10+", "15+", "20+", "25+", "30+"].map((x) => (
                  <option key={x} value={x}>{x} Years</option>
                ))}
              </select>
              <label className={styles.label}>Experience</label>
            </div>

            {/* Location Row */}
            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <select
                  className={styles.select}
                  name="state"
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value, city: "" })}
                  suppressHydrationWarning
                >
                  <option value=""></option>
                  {Object.keys(stateCityMap).map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
                <label className={styles.label}>State</label>
              </div>
              <div className={styles.inputGroup}>
                <select
                  className={styles.select}
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  disabled={!form.state}
                  suppressHydrationWarning
                >
                  <option value=""></option>
                  {form.state && stateCityMap[form.state].map((city: string) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                <label className={styles.label}>City</label>
              </div>
            </div>

            {/* Pincode */}
            <div className={styles.inputGroup}>
              <input
                className={styles.input}
                name="pincode"
                value={form.pincode}
                onChange={(e) => {
                  if (e.target.value.length <= 6) {
                    setForm({ ...form, pincode: e.target.value });
                  }
                }}
                placeholder=" "
                suppressHydrationWarning
              />
              <label className={styles.label}>Pincode</label>
            </div>

            {/* Address */}
            <div className={styles.inputGroup}>
              <input
                className={styles.input}
                name="office_address"
                value={form.office_address}
                onChange={handleChange}
                placeholder=" "
                suppressHydrationWarning
              />
              <label className={styles.label}>Office Address</label>
            </div>

            {/* Bar License */}
            <div className={styles.inputGroup}>
              <input
                className={styles.input}
                name="bar_license"
                value={form.bar_license}
                onChange={handleChange}
                placeholder=" "
                suppressHydrationWarning
              />
              <label className={styles.label}>Bar License Number</label>
            </div>

            {/* AOR */}
            <div className={styles.inputGroup}>
              <select
                className={styles.select}
                name="AOR_certified"
                value={form.AOR_certified}
                onChange={handleChange}
                suppressHydrationWarning
              >
                <option value=""></option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
              <label className={styles.label}>AOR Certified?</label>
            </div>

            {/* MultiSelects */}
            <div className={styles.multiSelectBox}>
              <div className={styles.multiSelectTitle}>Courts Practicing</div>
              {["District Court", "High Court", "Supreme Court"].map((court) => (
                <label key={court} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={form.court_eligibility.includes(court)}
                    onChange={() => toggleMultiSelect("court_eligibility", court)}
                  />
                  <span>{court}</span>
                </label>
              ))}
            </div>

            <div className={styles.multiSelectBox}>
              <div className={styles.multiSelectTitle}>Languages</div>
              <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {languagesList.map((lang) => (
                  <label key={lang} className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      className={styles.checkbox}
                      checked={form.languages.includes(lang)}
                      onChange={() => toggleMultiSelect("languages", lang)}
                    />
                    <span>{lang}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className={styles.multiSelectBox}>
              <div className={styles.multiSelectTitle}>Specialties (Max 3)</div>
              <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {specialtiesList.map((sp) => (
                  <label key={sp} className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      className={styles.checkbox}
                      checked={form.specialties.includes(sp)}
                      onChange={() => toggleMultiSelect("specialties", sp)}
                    />
                    <span>{sp}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Profile Pic */}
            <div className={styles.inputGroup}>
              <input
                id="profilePicInput"
                type="file"
                accept="image/*"
                className={styles.hiddenInput}
                onChange={handleImageChange}
              />
              <button
                type="button"
                className={styles.uploadBtn}
                onClick={() => document.getElementById("profilePicInput")?.click()}
              >
                <span className="material-symbols-outlined" style={{ marginRight: 8 }}>cloud_upload</span>
                Upload Profile Picture
              </button>
              <div className={styles.fileText}>
                {profileImage ? profileImage.name : "No file selected"}
              </div>
            </div>

            {/* About */}
            <div className={styles.inputGroup}>
              <textarea
                className={styles.textarea}
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder=" "
                suppressHydrationWarning
              />
              <label className={styles.label}>About You</label>
            </div>

            {error && <div style={{ color: '#ff453a', marginBottom: 20, textAlign: 'center' }}>{error}</div>}

            <div className={styles.actions}>
              <button type="submit" className={styles.signupBtn} disabled={submitting} suppressHydrationWarning>
                {submitting ? "Processing..." : "Submit Application"}
              </button>
            </div>

            <div style={{ marginTop: '32px', textAlign: 'center' }}>
              <a href="/SignUp" style={{ color: 'var(--c-text-sec)', fontSize: '13px', textDecoration: 'none', fontWeight: 500 }}>
                Are you a Client? <span style={{ color: 'var(--c-text-main)', fontWeight: 600 }}>Register here &rarr;</span>
              </a>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}