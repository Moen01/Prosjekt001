

'use client';

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { LoginRequest, LoginResponse } from "@lib/types/auth";
import styles from "../../styles/login.module.css";

export default function Login() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const payload: LoginRequest = {
      username: String(formData.get("username") ?? ""),
      password: String(formData.get("password") ?? ""),
    };

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = (await response.json()) as LoginResponse;
        throw new Error(body.message ?? "Unable to login");
      }

      const body = (await response.json()) as LoginResponse;
      router.push(body.redirectPath ?? "/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          autoComplete="off"
          name="username"
          className={styles.input}
          placeholder="Username"
        />
        <input
          type="password"
          autoComplete="off"
          name="password"
          className={styles.input}
          placeholder="Password"
        />
        {error ? <p className={styles.error}>{error}</p> : null}
        <button type="submit" className={styles.button} disabled={isLoading}>
          {isLoading ? "Logging in…" : "Login"}
        </button>
      </form>
    </div>
  );
}
