"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import GoogleButton from "@/UI_components/GoogleButton";
import { stateCityMap, languagesList, specialtiesList } from "./signupData"




export default function LawyerSignUp() {

  const server_url=process.env.NEXT_PUBLIC_DEV_SERVER_URL;
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

  //profile image state
  const [profileImage, setProfileImage] = useState<File | null>(null);

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // CHANGE HANDLER
  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  //IMAGE HANDLER

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setProfileImage(file);
  };

  // MULTISELECT
  const toggleMultiSelect = (field: string, value: string) => {
    const arr = form[field as keyof LawyerForm] as string[];

    if (arr.includes(value)) {
      setForm({ ...form, [field]: arr.filter((v) => v !== value) });
      return;
    }

    // Special rule: specialties max 3
    if (field === "specialties" && arr.length >= 3) return;

    setForm({ ...form, [field]: [...arr, value] });
  };

  // VALIDATION
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

  // SUBMIT
  const handleSubmit = async () => {
    const err = validate();
    if (err) return setError(err);

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

      if (!res.ok) return setError(data.message || "Something went wrong.");

      

      // STEP 2: Upload image
      const imgData = new FormData();
      imgData.append("profile_picture", profileImage as File);

      const imgRes = await fetch(`${server_url}/api/upload/profile-pic`, {
        method: "POST",
        credentials: "include", // ⭐ send JWT cookie
        body: imgData
      });

      const imgDataRes = await imgRes.json();
      if (!imgRes.ok) return setError(imgDataRes.message || "Image upload failed");


      router.push("/Lawyer-Dashboard");
    } catch (err) {
      setError("Server error. Try again.");
    }
  };

  return (
    <div className={styles.signupWrapper}>
      <div className={styles.signupCard}>
        <button className={styles.closeBtn}>
          <span className="material-symbols-outlined">close</span>
        </button>

        {/* HEADER */}
        <div className={styles.signupHeader}>
          <div className={styles.signupIcon}>
            <span className={`material-symbols-outlined ${styles.gavelIcon}`}>
              gavel
            </span>
          </div>
          <h1 className={styles.signupTitle}>Lawyer Registration</h1>
          <p className={styles.signupSubtitle}>Join LexPal Legal Network</p>
        </div>

        <div className={styles.signupForm}>

          {/* NAME */}
          <div className={styles.row}>
            <label className={styles.inputGroup}>
              <p className={styles.inputLabel}>First Name</p>
              <input name="first_name" value={form.first_name} onChange={handleChange} />
            </label>

            <label className={styles.inputGroup}>
              <p className={styles.inputLabel}>Last Name</p>
              <input name="last_name" value={form.last_name} onChange={handleChange} />
            </label>
          </div>

          {/* EMAIL */}
          <label className={styles.inputGroup}>
            <p className={styles.inputLabel}>Email</p>
            <input name="email" value={form.email} onChange={handleChange} />
          </label>

           {/* password input field */}
          <label className={styles.inputGroup}>
            <p className={styles.inputLabel}>Password</p>
            <div className={styles.passwordWrapper}>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
              />

              <button
                type="button"
                className={styles.toggleBtn}
                onClick={() => setShowPassword(!showPassword)}
              >
                <span className="material-symbols-outlined">
                  {showPassword ? "visibility" : "visibility_off"}
                </span>
              </button>
            </div>
          </label>
          {/* confirm password input field */}

          <label className={styles.inputGroup}>
            <p className={styles.inputLabel}>Confirm Password</p>
            <div className={styles.passwordWrapper}>
              <input
                name="confirm_password"
                type={showConfirm ? "text" : "password"}
                value={form.confirm_password}
                onChange={handleChange}
                placeholder="Confirm your password"
              />

              <button
                type="button"
                className={styles.toggleBtn}
                onClick={() => setShowConfirm(!showConfirm)}
              >
                <span className="material-symbols-outlined">
                  {showConfirm ? "visibility" : "visibility_off"}
                </span>
              </button>
            </div>
          </label>


          {/* EXPERIENCE */}
          <label className={styles.inputGroup}>
            <p className={styles.inputLabel}>Years of Experience</p>
            <select name="experience" value={form.experience} onChange={handleChange}>
              <option value="">Select experience</option>
              {["1+", "2+", "3+", "5+", "10+", "15+", "20+", "25+", "30+"].map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>

          {/* STATE */}
          <label className={styles.inputGroup}>
            <p className={styles.inputLabel}>State</p>
            <select
              name="state"
              value={form.state}
              onChange={(e) => {
                setForm({ ...form, state: e.target.value, city: "" });
              }}
            >
              <option value="">Select state</option>
              {Object.keys(stateCityMap).map((st) => (
                <option key={st}>{st}</option>
              ))}
            </select>
          </label>

          {/* CITY */}
          {form.state && (
            <label className={styles.inputGroup}>
              <p className={styles.inputLabel}>City</p>
              <select name="city" value={form.city} onChange={handleChange}>
                <option value="">Select city</option>
                {stateCityMap[form.state].map((city: string) => (
                  <option key={city}>{city}</option>
                ))}
              </select>
            </label>
          )}

          {/* PINCODE */}
          <label className={styles.inputGroup}>
            <p className={styles.inputLabel}>Pincode</p>
            <input
              name="pincode"
              value={form.pincode}
              onChange={(e) => {
                if (e.target.value.length <= 6) {
                  setForm({ ...form, pincode: e.target.value });
                }
              }}
              placeholder="Enter 6 digit pincode"
            />
          </label>

          {/* ADDRESS */}
          <label className={styles.inputGroup}>
            <p className={styles.inputLabel}>Address</p>
            <input name="office_address" value={form.office_address} onChange={handleChange} />
          </label>

          {/* BAR ID */}
          <label className={styles.inputGroup}>
            <p className={styles.inputLabel}>Bar License Number</p>
            <input name="bar_license" value={form.bar_license} onChange={handleChange} />
          </label>

          {/* AOR CERTIFICATION */}
          <label className={styles.inputGroup}>
            <p className={styles.inputLabel}>AOR Certified?</p>
            <select name="AOR_certified" value={form.AOR_certified} onChange={handleChange}>
              <option value="">Select</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </label>

          {/* COURTS MULTISELECT */}
          <div className={styles.multiSelectBox}>
            <p className={styles.inputLabel}>Courts Practicing</p>
            {["District Court", "High Court", "Supreme Court"].map((court) => (
              <label key={court}>
                <input
                  type="checkbox"
                  checked={form.court_eligibility.includes(court)}
                  onChange={() => toggleMultiSelect("court_eligibility", court)}
                />
                {court}
              </label>
            ))}
          </div>

          {/* LANGUAGES MULTISELECT */}
          <div className={styles.multiSelectBox}>
            <p className={styles.inputLabel}>Languages</p>
            {languagesList.map((lang) => (
              <label key={lang}>
                <input
                  type="checkbox"
                  checked={form.languages.includes(lang)}
                  onChange={() => toggleMultiSelect("languages", lang)}
                />
                {lang}
              </label>
            ))}
          </div>

          {/* SPECIALTIES MULTISELECT */}
          <div className={styles.multiSelectBox}>
            <p className={styles.inputLabel}>Specialties (max 3)</p>
            {specialtiesList.map((sp) => (
              <label key={sp}>
                <input
                  type="checkbox"
                  checked={form.specialties.includes(sp)}
                  onChange={() => toggleMultiSelect("specialties", sp)}
                />
                {sp}
              </label>
            ))}
          </div>

          {/*PROFILE PIC*/}

          <label className={styles.inputGroup}>
            <p className={styles.inputLabel}>Profile Picture</p>

            <button
              type="button"
              className={styles.uploadBtn}
              onClick={() => document.getElementById("profilePicInput")?.click()}
            >
              Upload Profile Picture
            </button>

            <input
              id="profilePicInput"
              type="file"
              accept="image/*"
              className={styles.hiddenInput}
              onChange={handleImageChange}
            />

            <p className={styles.selectedFileText}>
              {profileImage ? profileImage.name : "No file selected"}
            </p>
          </label>

          {/* ABOUT */}
          <label className={styles.inputGroup}>
            <p className={styles.inputLabel}>About You</p>
            <textarea
              name="description"
              rows={4}
              value={form.description}
              onChange={handleChange}
              placeholder="Describe your practice, experience, and background..."
            />
          </label>

          {/* ERROR */}
          {error && <p className={styles.error}>{error}</p>}
        </div>

        {/* Submit */}
        <button className={styles.signupBtn} onClick={handleSubmit}>
          Register as Lawyer
        </button>

        {/* <div className={styles.divider}>
          <hr />
          <p>OR</p>
          <hr />
        </div>

        <GoogleButton /> */}

        <p className={styles.loginLink}>
          Already have an account? <a href="#">Log In</a>
        </p>
      </div>
    </div>
  );
}