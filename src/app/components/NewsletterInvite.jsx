"use client";

import { useState, useSyncExternalStore } from "react";
import { track } from "@vercel/analytics";
import styles from "../blog/blog.module.css";

function subscribe(listener) {
  window.addEventListener("writing-invite-change", listener);
  window.addEventListener("storage", listener);
  return () => { window.removeEventListener("writing-invite-change", listener); window.removeEventListener("storage", listener); };
}
function storedDismissal() { try { return sessionStorage.getItem("writing-invite-dismissed") === "yes"; } catch { return false; } }
const serverDismissal = () => false;

export default function NewsletterInvite({ newsletter }) {
  const [dismissed, setDismissed] = useState(false);
  const stored = useSyncExternalStore(subscribe, storedDismissal, serverDismissal);
  if (!newsletter || dismissed || stored) return null;
  return <section className={`${styles.newsletter} ${newsletter.embedUrl ? "" : styles.newsletterSolo}`} aria-labelledby="newsletter-title">
    <div><p className={styles.eyebrow}>A note from the workbench</p><h2 id="newsletter-title">New ideas, in your inbox.</h2>
      <p>Essays and experiments on AI, product design, and bringing ideas to life. Free to read, with or without subscribing.</p>
      <div className={styles.subscribeActions}><a href={newsletter.url} onClick={() => track("newsletter_signup_opened")}>Subscribe free on Substack <span aria-hidden="true">↗</span></a>
        <button type="button" onClick={() => { setDismissed(true); try { sessionStorage.setItem("writing-invite-dismissed", "yes"); window.dispatchEvent(new Event("writing-invite-change")); } catch { /* Optional preference only. */ } track("newsletter_invite_skipped"); }}>Skip, keep reading</button></div>
      <p className={styles.subscribeNote}>Substack handles your email and unsubscribe preferences. Browsing doesn’t add you to a mailing list.</p>
    </div>
    {newsletter.embedUrl && <iframe src={newsletter.embedUrl} title="Subscribe to Ashwin’s Substack newsletter" loading="lazy" width="480" height="320" />}
  </section>;
}
