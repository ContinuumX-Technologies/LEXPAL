"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import GoogleButton from "@/UI_components/GoogleButton";

type FormState = {
  email: string;
  password: string;
};

export default function LoginPage() {

  const server_url=process.env.NEXT_PUBLIC_DEV_SERVER_URL;
  const router = useRouter();
  const [form, setForm] = useState<FormState>({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const validate = (): string | null => {
    if (!form.email.trim()) return "Email is required.";
    if (!emailRegex.test(form.email)) return "Enter a valid email address.";
    if (!form.password) return "Password is required.";
    if (form.password.length < 6) return "Password must be at least 6 characters.";
    return null;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch(`${server_url}/api/auth/lawyer-login`, {
        method: "POST",
         credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed. Try again.");
        setSubmitting(false);
        return;
      }

      // set cookie (simple, adjust for HttpOnly via server if needed)
      // document.cookie = `token=${data.token}; path=/; max-age=604800; Secure; SameSite=Lax;`;

      router.push("/Lawyer-Dashboard");
    } catch (err) {
      console.error(err);
      setError("Server error, try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <div className={styles.brandWrap}>
          <div className={styles.logoCircle}>
            <span className={`material-symbols-outlined ${styles.gavel}`}>gavel</span>
          </div>
        </div>

        <h1 className={styles.title}>Welcome Back Advocate,</h1>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <label className={styles.field}>
            <span className={styles.labelText}>Email</span>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className={styles.input}
              autoComplete="email"
            />
          </label>

          <label className={styles.field}>
            <div className={styles.fieldHeader}>
              <span className={styles.labelText}>Password</span>
            </div>

            <div className={styles.passwordRow}>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className={styles.input}
                autoComplete="current-password"
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((s) => !s)}
                className={styles.toggleBtn}
              >
                <span className="material-symbols-outlined">
                  {showPassword ? "visibility" : "visibility_off"}
                </span>
              </button>
            </div>

            <a className={styles.forgot} href="#">
              Forgot Password?
            </a>
          </label>

          {error && <div className={styles.errorBox}>{error}</div>}

          <div className={styles.actions}>
            <button
              type="submit"
              className={styles.primaryBtn}
              disabled={submitting}
            >
              {submitting ? "Logging in..." : "Login"}
            </button>

            <button
              type="button"
              onClick={() => {
                /* If your GoogleButton handles auth, call it here or render it directly. */
              }}
              className={styles.googleWrap}
            >
              <div className={styles.googleIcon} aria-hidden />
              <span>Login with Google</span>
            </button>
            {/* Or use your existing component: <GoogleButton /> */}
          </div>
        </form>

        <div className={styles.bottomNote}>
          <p>
            Don't have an account?{" "}
            <a className={styles.signUpLink} href="#">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}