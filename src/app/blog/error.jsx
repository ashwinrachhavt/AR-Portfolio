"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import styles from "./blog.module.css";

export default function BlogError({ reset }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return (
    <section className={styles.error} role="alert">
      <p className={styles.eyebrow}>A brief interruption</p>
      <h1>The writing will be back shortly.</h1>
      <p>Something interrupted the connection. Give it another try in a moment.</p>
      <button type="button" disabled={pending} onClick={() => startTransition(() => { router.refresh(); reset(); })}>
        {pending ? "Trying again…" : "Try again"} <span aria-hidden="true">↗</span>
      </button>
    </section>
  );
}
