"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import GoogleButton from "@/UI_components/GoogleButton";
import { stateCityMap } from "../Lawyer-SignUp/signupData";

export default function SignUp() {
  const router = useRouter();
  const server_url=process.env.NEXT_PUBLIC_DEV_SERVER_URL;

  //password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Form states
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    state:"",
    city:"",
    password: "",
    confirm_password: ""
  });

  const [error, setError] = useState("");

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Simple frontend validation
  const validate = () => {
    const nameRegex = /^[A-Za-z]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!nameRegex.test(form.first_name.trim())) return "First name must contain only letters.";
    if (!nameRegex.test(form.last_name.trim())) return "Last name must contain only letters.";
    if (!emailRegex.test(form.email)) return "Enter a valid email address.";
     if (!form.state) return "Select your state.";
    if (!form.city) return "Select your city.";
    if (form.password.length < 6) return "Password must be at least 6 characters.";
    if (form.password !== form.confirm_password) return "Passwords do not match.";

    return "";
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) return setError(err);

    setError("");

    try {
      const res = await fetch(`${server_url}/api/auth/user-signup`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong.");
        return;
      }

      // document.cookie = `token=${data.token}; path=/; max-age=604800;`;

      router.push("/Dashboard");

    } catch (e) {
      setError("Server error. Try again.");
    }
  };

  return (
    <div className={styles.signupWrapper}>
      <div className={styles.signupCard}>

        <button className={styles.closeBtn}>
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className={styles.signupHeader}>
          <div className={styles.signupIcon}>
            <span className={`material-symbols-outlined ${styles.gavelIcon}`}>
              gavel
            </span>
          </div>
          <h1 className={styles.signupTitle}>Create Your Account</h1>
          <p className={styles.signupSubtitle}>Get started with Lexpal</p>
        </div>

        <div className={styles.signupForm}>
          <div className={styles.row}>
            <label className={styles.inputGroup}>
              <p className={styles.inputLabel}>First Name</p>
              <input
                name="first_name"
                type="text"
                value={form.first_name}
                onChange={handleChange}
                placeholder="Enter your first name"
              />
            </label>

            <label className={styles.inputGroup}>
              <p className={styles.inputLabel}>Last Name</p>
              <input
                name="last_name"
                type="text"
                value={form.last_name}
                onChange={handleChange}
                placeholder="Enter your last name"
              />
            </label>
          </div>
           {/* email */}
          <label className={styles.inputGroup}>
            <p className={styles.inputLabel}>Email</p>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email address"
            />
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

          {/* Error message */}
          {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
        </div>


         {/* signup button */}
        <button className={styles.signupBtn} onClick={handleSubmit}>
          Sign Up
        </button>

        {/* text space */}
        <div className={styles.divider}>
          <hr />
          <p>OR</p>
          <hr />
        </div>

         {/* signup with google button */}
      <GoogleButton />


         {/* redirect to login link */}
        <p className={styles.loginLink}>
          Already have an account? <a href="#">Log In</a>
        </p>

        <p className={styles.tos}>
          By signing up, you agree to our <a href="#">Terms of Service</a> and{" "}
          <a href="#">Privacy Policy</a>.
        </p>

      </div>
    </div>
  );
}