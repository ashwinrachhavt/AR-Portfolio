"use client";

import { useState } from "react";
import styles from "../../portfolio.module.css";

export default function PermissionExplorer() {
  const [action, setAction] = useState("rename");
  const [permission, setPermission] = useState(true);
  const [sameTenant, setSameTenant] = useState(true);
  const [revoked, setRevoked] = useState(false);
  const reason = !sameTenant
    ? "The connection belongs to another tenant. Its tools cannot be used."
    : action === "delete"
      ? "Delete actions are blocked, even when other permissions are enabled."
      : !permission
        ? "This connection has not granted the permission required for this action."
        : revoked
          ? "Access was revoked after tool discovery. The execution-time check blocks the stale tool reference."
          : "The tenant matches and the required permission is still valid at execution time.";
  const allowed = sameTenant && action !== "delete" && permission && !revoked;
  return <div className={styles.explorer}>
    <div className={styles.explorerHeader}><strong>Before the agent acts</strong><span>Illustrative example</span></div>
    <label className={styles.selectLabel} htmlFor="agent-action">Requested action</label>
    <select id="agent-action" value={action} onChange={event => setAction(event.target.value)}><option value="rename">Rename a loan document</option><option value="send">Send a borrower email</option><option value="delete">Delete a document</option></select>
    <div className={styles.checks}>
      <label><input type="checkbox" checked={sameTenant} onChange={event => setSameTenant(event.target.checked)} /><span>Connection belongs to this tenant</span></label>
      <label><input type="checkbox" checked={permission} onChange={event => setPermission(event.target.checked)} /><span>{action === "send" ? "Send" : "Write"} permission granted</span></label>
      <label><input type="checkbox" checked={revoked} onChange={event => setRevoked(event.target.checked)} /><span>Access revoked after tool discovery</span></label>
    </div>
    <div className={`${styles.decision} ${allowed ? styles.allowed : styles.blocked}`} role="status" aria-live="polite" aria-atomic="true"><strong>{allowed ? "Allowed by these checks" : "Action blocked"}</strong><p>{reason}</p></div>
    <p className={styles.explorerFoot}>Local simulation. No documents, accounts, or external actions are involved. The full system also checks ownership and reviewed tool allowlists.</p>
  </div>;
}
