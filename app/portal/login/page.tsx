"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "../portal.module.css";

type SeedAmbassador = {
  id: string;
  name: string;
  college: string;
  rollNumber: string;
  email: string;
};

export default function StudentLoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [seeds, setSeeds] = useState<SeedAmbassador[]>([]);

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

    // Fetch seed ambassadors for quick switching
    async function loadSeeds() {
      try {
        const res = await fetch("/api/participant/seed-list");
        const data = await res.json();
        if (data.ok && data.participants) {
          setSeeds(data.participants);
        }
      } catch {
        // Ignore seed fetch error
      }
    }
    void loadSeeds();
  }, [router]);

  const handleLogin = async (idToUse?: string) => {
    const id = idToUse || identifier.trim();
    if (!id) {
      setError("Please enter your registered Email, Roll Number, or Participant ID.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/participant/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: id }),
      });

      const body = await res.json();
      if (!res.ok) {
        throw new Error(body.error?.message || "Failed to log in.");
      }

      router.push("/portal/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.badge}>✦</div>
          <h1 className={styles.title}>Ambassador Login</h1>
          <p className={styles.subtitle}>
            Access your mission dashboard, submit task proof, and track your competition rank.
          </p>
        </div>

        {error && <div className={styles.errorBanner}>{error}</div>}

        <form
          className={styles.form}
          onSubmit={(e) => {
            e.preventDefault();
            void handleLogin();
          }}
        >
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="identifier">
              Email, Roll Number, or Participant ID
            </label>
            <input
              id="identifier"
              type="text"
              className={styles.input}
              placeholder="e.g. 24EE1001 or student@iitbhu.ac.in"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              disabled={loading}
              autoFocus
            />
          </div>

          <button type="submit" className={styles.buttonPrimary} disabled={loading}>
            {loading ? "Authenticating..." : "Enter Portal →"}
          </button>
        </form>

        <p className={styles.switchText}>
          Not registered yet?{" "}
          <Link href="/portal/register" className={styles.link}>
            Register as Ambassador ↗
          </Link>
        </p>

        {seeds.length > 0 && (
          <div className={styles.quickSection}>
            <div className={styles.quickTitle}>
              <span>Demo Quick Sign-In</span>
              <small>Click to test persona</small>
            </div>
            <div className={styles.quickGrid}>
              {seeds.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={styles.quickBtn}
                  onClick={() => {
                    setIdentifier(s.rollNumber || s.email);
                    void handleLogin(s.rollNumber || s.email);
                  }}
                  disabled={loading}
                >
                  <strong>{s.name}</strong>
                  <small>{s.college} ({s.rollNumber})</small>
                </button>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginTop: 24, textAlign: "center" }}>
          <Link href="/" className={styles.link} style={{ fontSize: 12, color: "#9ca3af" }}>
            ← Back to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
}

