"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "../portal.module.css";

export default function StudentRegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    college: "",
    rollNumber: "",
    branch: "",
    year: "1st Year",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim() || !formData.email.trim() || !formData.college.trim() || !formData.rollNumber.trim()) {
      setError("Please complete all required fields (Name, Email, College, and Roll Number).");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/participant/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
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
      <div className={styles.card} style={{ maxWidth: 540 }}>
        <div className={styles.header}>
          <div className={styles.badge}>✦</div>
          <h1 className={styles.title}>Ambassador Registration</h1>
          <p className={styles.subtitle}>
            Join the Campus Ambassador Program (CAP) initiative for E-Cell IIT BHU.
          </p>
        </div>

        {error && <div className={styles.errorBanner}>{error}</div>}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="name">
                Full Name *
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
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="email">
                Email Address *
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
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="college">
                College / University *
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
                Roll Number / Student ID *
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
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="branch">
                Department / Branch
              </label>
              <input
                id="branch"
                type="text"
                className={styles.input}
                placeholder="e.g. Electrical Engineering"
                value={formData.branch}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                disabled={loading}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="year">
                Year of Study
              </label>
              <select
                id="year"
                className={styles.select}
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                disabled={loading}
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
                <option value="Postgraduate">Postgraduate</option>
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="phone">
              Contact Phone (Optional)
            </label>
            <input
              id="phone"
              type="tel"
              className={styles.input}
              placeholder="e.g. +91 98765 43210"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              disabled={loading}
            />
          </div>

          <button type="submit" className={styles.buttonPrimary} disabled={loading} style={{ marginTop: 8 }}>
            {loading ? "Registering..." : "Complete Registration & Enter →"}
          </button>
        </form>

        <p className={styles.switchText}>
          Already registered?{" "}
          <Link href="/portal/login" className={styles.link}>
            Sign in here ↗
          </Link>
        </p>

        <div style={{ marginTop: 20, textAlign: "center" }}>
          <Link href="/" className={styles.link} style={{ fontSize: 12, color: "#9ca3af" }}>
            ← Back to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
}

