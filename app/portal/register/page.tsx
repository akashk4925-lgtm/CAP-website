"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import styles from "../portal.module.css";

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    college: "",
    rollNumber: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const emailParam = searchParams?.get("email");
    const nameParam = searchParams?.get("name");
    const noticeParam = searchParams?.get("notice");

    if (emailParam || nameParam) {
      setFormData((prev) => ({
        ...prev,
        email: emailParam || prev.email,
        name: nameParam || prev.name,
      }));
    }

    if (noticeParam === "not_registered") {
      setError("This Google account is not yet registered. Please complete your registration below.");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const name = formData.name.trim();
    const email = formData.email.trim().toLowerCase();
    const college = formData.college.trim();
    const rollNumber = formData.rollNumber.trim().toUpperCase();

    if (!name || !email || !college || !rollNumber) {
      setError("Please fill in all required fields (Name, Email, College, and Roll Number).");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/participant/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          college,
          rollNumber,
        }),
      });

      const body = await res.json();
      if (!res.ok) {
        throw new Error(body.error?.message || "Registration failed. Please check your details.");
      }

      router.push("/portal/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Participant Registration</h1>
          <p className={styles.subtitle}>
            Campus Ambassador Program &bull; E-Cell IIT BHU
          </p>
        </div>

        {error && <div className={styles.errorBanner} style={{ marginBottom: 20 }}>{error}</div>}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="name">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              className={styles.input}
              placeholder="e.g. Aarav Sharma"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={loading}
              required
              autoFocus
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              className={styles.input}
              placeholder="e.g. aarav@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={loading}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="college">
              College / University
            </label>
            <input
              id="college"
              type="text"
              className={styles.input}
              placeholder="e.g. IIT BHU or NIT Patna"
              value={formData.college}
              onChange={(e) => setFormData({ ...formData, college: e.target.value })}
              disabled={loading}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="rollNumber">
              Roll Number / Student ID
            </label>
            <input
              id="rollNumber"
              type="text"
              className={styles.input}
              placeholder="e.g. 24EE1001"
              value={formData.rollNumber}
              onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
              disabled={loading}
              required
            />
          </div>

          <button type="submit" className={styles.buttonPrimary} disabled={loading} style={{ marginTop: 8 }}>
            {loading ? "Registering..." : "Complete Registration & Enter →"}
          </button>
        </form>

        <p className={styles.switchText} style={{ marginTop: 24 }}>
          Already registered?{" "}
          <Link href="/portal/login" className={styles.link}>
            Sign in here ↗
          </Link>
        </p>

        <div style={{ marginTop: 20, textAlign: "center" }}>
          <Link href="/" className={styles.link} style={{ fontSize: 12, color: "#64748b" }}>
            ← Back to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function StudentRegisterPage() {
  return (
    <Suspense fallback={<div className={styles.authPage}><div className={styles.card} style={{ textAlign: "center", color: "#94a3b8" }}>Loading registration...</div></div>}>
      <RegisterContent />
    </Suspense>
  );
}
