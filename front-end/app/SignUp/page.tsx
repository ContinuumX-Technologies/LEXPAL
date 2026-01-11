"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import { stateCityMap } from "../Lawyer-SignUp/signupData";

export default function SignUp() {
  const router = useRouter();
  const server_url = process.env.NEXT_PUBLIC_DEV_SERVER_URL;

  // States
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    state: "",
    city: "",
    password: "",
    confirm_password: ""
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

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

    setSubmitting(true);
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
        setSubmitting(false);
        return;
      }

      router.push("/Dashboard");
    } catch (e) {
      setError("Server error. Try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.root}>
      {/* LEFT: Visual Showcase (White Titanium) */}
      <div className={styles.visualColumn}>
        <div className={styles.titaniumFlow} />

        <div className={styles.visualContent}>
          <h1 className={styles.visualTitle}>
            Join the <br />
            <span>revolution.</span>
          </h1>
          <p className={styles.visualDesc}>
            Create your account to access top-tier legal management tools designed for clarity and precision.
          </p>
        </div>
      </div>

      {/* RIGHT: Functional Form */}
      <div className={styles.formColumn}>
        {/* Nav */}
        <div className={styles.topNav}>
          <a href="/" className={styles.logo}>
            <span className="material-symbols-outlined">balance</span>
            LEXPAL
          </a>
          <a href="/" className={styles.backBtn}>Exit</a>
        </div>

        {/* Form Container */}
        <div className={styles.formContent}>
          <div className={styles.formHeader}>
            <h2 className={styles.heading}>Create Account</h2>
            <p className={styles.subheading}>
              Already a member? <a href="/Login">Log in</a>
            </p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} noValidate>

            {/* Name Row */}
            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <input
                  className={styles.input}
                  name="first_name"
                  type="text"
                  placeholder=" "
                  value={form.first_name}
                  onChange={handleChange}
                  suppressHydrationWarning
                />
                <label className={styles.label}>First Name</label>
              </div>
              <div className={styles.inputGroup}>
                <input
                  className={styles.input}
                  name="last_name"
                  type="text"
                  placeholder=" "
                  value={form.last_name}
                  onChange={handleChange}
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
                type="email"
                placeholder=" "
                value={form.email}
                onChange={handleChange}
                suppressHydrationWarning
              />
              <label className={styles.label}>Email Address</label>
            </div>

            {/* State & City */}
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

            {/* Password */}
            <div className={styles.inputGroup}>
              <div className={styles.passwordWrapper}>
                <input
                  className={styles.input}
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder=" "
                  value={form.password}
                  onChange={handleChange}
                  suppressHydrationWarning
                />
                <label className={styles.label}>Password</label>
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

            {/* Confirm Password */}
            <div className={styles.inputGroup}>
              <div className={styles.passwordWrapper}>
                <input
                  className={styles.input}
                  name="confirm_password"
                  type={showConfirm ? "text" : "password"}
                  placeholder=" "
                  value={form.confirm_password}
                  onChange={handleChange}
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

            {error && <div style={{ color: '#ff453a', marginBottom: 16, fontSize: '14px' }}>{error}</div>}

            <div className={styles.actions}>
              <button type="submit" className={styles.signupBtn} disabled={submitting} suppressHydrationWarning>
                {submitting ? "Creating Account..." : "Sign Up"}
              </button>

              <div className={styles.divider}>
                <span>or</span>
              </div>

              {/* Using the Google Button manually to match style if needed, or keeping component if preferred.
                   For consistency with login, I'm manually styling it here to match the White Titanium look exactly. */}
              <button type="button" className={styles.googleBtn} suppressHydrationWarning>
                <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" /><path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" /><path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" /><path fill="#1976D2" d="M43.611 20.083 43.595 20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" /></svg>
                Sign up with Google
              </button>
            </div>

            <p className={styles.tos}>
              By signing up, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
            </p>

            <div style={{ marginTop: '24px', textAlign: 'center' }}>
              <a href="/Lawyer-SignUp" style={{ color: 'var(--c-text-sec)', fontSize: '13px', textDecoration: 'none', fontWeight: 500 }}>
                Are you a Lawyer? <span style={{ color: 'var(--c-text-main)', fontWeight: 600 }}>Register here &rarr;</span>
              </a>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}