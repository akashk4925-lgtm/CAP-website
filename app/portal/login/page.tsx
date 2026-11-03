"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import styles from "../portal.module.css";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const notice = searchParams?.get("notice");
  const errParam = searchParams?.get("error");

  useEffect(() => {
    // Check if already authenticated
    async function checkExisting() {
      try {
        const res = await fetch("/api/participant/me");
        const data = await res.json();
        if (data.authenticated) {
          router.replace("/portal/dashboard");
        }
      } catch {
        // Not logged in
      }
    }
    void checkExisting();
  }, [router]);

  const handleLogin = async () => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      setError("Please enter your valid registered email address.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/participant/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail }),
      });

      const body = await res.json();
      if (!res.ok) {
        throw new Error(body.error?.message || "Failed to log in.");
      }

      router.push("/portal/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed. Please check your registered email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.card}>
        {/* Header matching Admin Portal */}
        <div className={styles.header}>
          <h1 className={styles.title}>Participant Portal</h1>
          <p className={styles.subtitle}>
            Campus Ambassador Program &bull; E-Cell IIT BHU
          </p>
        </div>

        {/* Status & Notice Banners */}
        {notice === "signed_out" && (
          <div className={styles.noticeSuccess}>
            You have successfully signed out.
          </div>
        )}

        {errParam === "oauth_not_configured" && (
          <div className={styles.noticeWarning}>
            <strong style={{ display: "block", marginBottom: 4, fontWeight: 700 }}>OAuth Notice</strong>
            Google OAuth is not configured in local environment. Please sign in with your registered email below.
          </div>
        )}

        {errParam === "rate_limited" && (
          <div className={styles.noticeWarning}>
            Too many attempts. Please wait a few moments before trying again.
          </div>
        )}

        {error && <div className={styles.errorBanner} style={{ marginBottom: 20 }}>{error}</div>}

        {/* Google Sign-In Button (Identical to Admin Login) */}
        <div>
          <a href="/api/auth/google?portal=participant" className={styles.googleBtn}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              className={styles.googleLogo}
              style={{ width: 20, height: 20, minWidth: 20, minHeight: 20, display: "inline-block", verticalAlign: "middle" }}
            >
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Sign in with Google
          </a>
        </div>

        {/* Divider */}
        <div className={styles.divider}>Or enter with registered email</div>

        {/* Email Only Login Form */}
        <form
          className={styles.form}
          onSubmit={(e) => {
            e.preventDefault();
            void handleLogin();
          }}
        >
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="email">
              Registered Email Address
            </label>
            <input
              id="email"
              type="email"
              className={styles.input}
              placeholder="e.g. student@iitbhu.ac.in or name@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              autoFocus
              required
            />
          </div>

          <button type="submit" className={styles.buttonPrimary} disabled={loading}>
            {loading ? "Authenticating..." : "Enter Portal →"}
          </button>
        </form>

        <p className={styles.switchText} style={{ marginTop: 24 }}>
          Not registered yet?{" "}
          <Link href="/portal/register" className={styles.link}>
            Register as Ambassador ↗
          </Link>
        </p>

        <div style={{ marginTop: 24, textAlign: "center" }}>
          <Link href="/" className={styles.link} style={{ fontSize: 12, color: "#64748b" }}>
            ← Back to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function StudentLoginPage() {
  return (
    <Suspense fallback={<div className={styles.authPage}><div className={styles.card} style={{ textAlign: "center", color: "#94a3b8" }}>Loading portal...</div></div>}>
      <LoginContent />
    </Suspense>
  );
}
