"use client";

import { useEffect, useRef, useState } from "react";
import { workflowBriefSchema, workflowInputSchema, type WorkflowBrief as Brief, type WorkflowInput } from "@/lib/workflow/schema";
import { exampleBrief, exampleInput } from "@/lib/workflow/example";
import WorkflowBrief from "./WorkflowBrief";
import styles from "./workflow.module.css";

const emptyInput: WorkflowInput = { task: "", currentProcess: "", inputs: "", desiredOutput: "", stakes: "moderate", approval: "always" };
const fields = [
  { name: "task", label: "What do you want to accomplish?", placeholder: "For example, turn incoming vendor documents into a reviewable classification.", min: 20, max: 1500, rows: 3 },
  { name: "currentProcess", label: "How does it work today?", placeholder: "Who does the work, what steps do they take, and where does it slow down?", min: 20, max: 1500, rows: 3 },
  { name: "inputs", label: "What goes in?", placeholder: "Documents, messages, databases, tools…", min: 5, max: 1000, rows: 3 },
  { name: "desiredOutput", label: "What should come out?", placeholder: "A recommendation, a draft, a reviewed action…", min: 5, max: 1000, rows: 3 },
] as const;

export default function WorkflowLab() {
  const [input, setInput] = useState<WorkflowInput>(emptyInput);
  const [result, setResult] = useState<{ brief: Brief; input: WorkflowInput; isExample: boolean } | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const request = useRef<AbortController | null>(null);
  const formHeading = useRef<HTMLHeadingElement>(null);

  useEffect(() => () => request.current?.abort(), []);
  useEffect(() => {
    if (result) {
      const heading = document.getElementById("brief-title");
      heading?.focus({ preventScroll: true });
      heading?.closest("article")?.scrollIntoView({ block: "start", behavior: "instant" });
    }
  }, [result]);

  function setField<K extends keyof WorkflowInput>(name: K, value: WorkflowInput[K]) {
    setInput((previous) => ({ ...previous, [name]: value }));
    setFieldErrors((previous) => ({ ...previous, [name]: [] }));
    setError("");
  }

  function showExample() {
    request.current?.abort();
    request.current = null;
    setPending(false);
    setError("");
    setResult({ brief: exampleBrief, input: exampleInput, isExample: true });
  }

  function edit() {
    setResult(null);
    setError("");
    requestAnimationFrame(() => formHeading.current?.focus());
  }

  function cancel() {
    request.current?.abort();
    request.current = null;
    setPending(false);
    setError("Generation canceled. Your workflow is still here.");
  }

  async function generate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = workflowInputSchema.safeParse(input);
    if (!parsed.success) {
      setFieldErrors(parsed.error.flatten().fieldErrors);
      setError("Check the highlighted fields and try again.");
      return;
    }
    request.current?.abort();
    const controller = new AbortController();
    request.current = controller;
    setPending(true);
    setError("");
    setFieldErrors({});
    const timeout = setTimeout(() => controller.abort("timeout"), 50000);
    try {
      const response = await fetch("/api/workflow-readiness", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data), signal: controller.signal,
      });
      const data = await response.json().catch(() => null);
      if (request.current !== controller) return;
      if (!response.ok) {
        if (data?.fieldErrors) setFieldErrors(data.fieldErrors);
        throw new Error(data?.error || "The brief could not be generated. Please try again.");
      }
      const validated = workflowBriefSchema.safeParse(data?.brief);
      if (!validated.success) throw new Error("The response was incomplete. Please try again.");
      setResult({ brief: validated.data, input: parsed.data, isExample: false });
    } catch (failure) {
      if (request.current !== controller) return;
      setError(controller.signal.aborted
        ? "This is taking longer than expected. Your inputs are still here; please try again."
        : failure instanceof TypeError ? "Could not connect. Check your connection and try again."
        : failure instanceof Error ? failure.message : "Could not connect. Please try again.");
    } finally {
      clearTimeout(timeout);
      if (request.current === controller) { setPending(false); request.current = null; }
    }
  }

  if (result) return <WorkflowBrief {...result} onEdit={edit} />;

  return <div className={styles.workspace}>
    <section aria-labelledby="form-title">
      <div className={styles.formHeader}><h2 ref={formHeading} id="form-title" tabIndex={-1}>You bring the workflow.</h2><button type="button" className={styles.textButton} disabled={pending} onClick={() => { setInput(exampleInput); setError(""); setFieldErrors({}); }}>Use an example ↗</button></div>
      <p className={styles.formIntro}>A little context makes a better brief. Describe one task you want to improve.</p>
      <form onSubmit={generate} aria-busy={pending}>
        <fieldset className={styles.fields} disabled={pending}>
          <legend className={styles.visuallyHidden}>Describe your workflow</legend>
          {fields.map((field) => <div key={field.name} className={field.name === "task" || field.name === "currentProcess" ? styles.fullField : styles.field}>
            <label htmlFor={field.name}>{field.label}</label>
            <textarea id={field.name} name={field.name} value={input[field.name]} onChange={(event) => setField(field.name, event.target.value)} placeholder={field.placeholder} rows={field.rows} required minLength={field.min} maxLength={field.max} aria-invalid={Boolean(fieldErrors[field.name]?.length)} aria-describedby={fieldErrors[field.name]?.length ? `${field.name}-error` : undefined} />
            {fieldErrors[field.name]?.length ? <p className={styles.fieldError} id={`${field.name}-error`}>{fieldErrors[field.name][0]}</p> : null}
          </div>)}
          <div className={styles.field}><label htmlFor="stakes">If it gets something wrong…</label><select id="stakes" name="stakes" value={input.stakes} onChange={(event) => setField("stakes", event.target.value as WorkflowInput["stakes"])}>
            <option value="low">Low impact — easy to correct</option><option value="moderate">Moderate — time or money lost</option><option value="high">High — serious consequences</option>
          </select></div>
          <div className={styles.field}><label htmlFor="approval">Where should a person approve?</label><select id="approval" name="approval" value={input.approval} onChange={(event) => setField("approval", event.target.value as WorkflowInput["approval"])}>
            <option value="always">Every result or action</option><option value="exceptions">Exceptions and uncertainty</option><option value="none">No routine approval</option>
          </select></div>
        </fieldset>
        <p className={styles.privacy}>No account needed. On submission, your description is sent to OpenAI to generate the brief. Leave out confidential or personal data.</p>
        {error && <p className={styles.error} role="alert">{error}</p>}
        <div className={styles.submitRow}><button className={styles.primaryButton} type="submit" disabled={pending}>{pending ? <><span className={styles.spinner} aria-hidden="true" /> Drafting your brief…</> : <>Create my brief <span aria-hidden="true">↗</span></>}</button>{pending && <button type="button" className={styles.textButton} onClick={cancel}>Cancel</button>}</div>
        <p className={styles.pendingMessage} role="status">{pending ? "Connecting your workflow, evaluation, and review requirements. You can cancel at any time." : ""}</p>
      </form>
    </section>
    <aside className={styles.preview} aria-labelledby="preview-title">
      <div className={styles.previewHeader}><span>What you’ll leave with</span><span aria-hidden="true">↗</span></div>
      <h2 id="preview-title">A brief you can<br />build from.</h2>
      <p>A practical starting point for a conversation with your team, cofounder, or engineer.</p>
      <ol className={styles.deliverables}><li><span>01</span><div><h3>A system with boundaries</h3><p>Ordinary software, AI-assisted work, and human decisions.</p></div></li><li><span>02</span><div><h3>A map of what’s missing</h3><p>Data, evaluation, observability, and the questions worth asking.</p></div></li><li><span>03</span><div><h3>One next experiment</h3><p>A small test with clear criteria for deciding what comes next.</p></div></li></ol>
      <div className={styles.examplePreview}><p>Example · Vendor document review</p><div><span>Extract</span><span aria-hidden="true">→</span><span>Validate</span><span aria-hidden="true">→</span><span>Review</span></div><button type="button" disabled={pending} onClick={showExample}>Read the example brief <span aria-hidden="true">↗</span></button></div>
      <p className={styles.previewFootnote}>Copy it. Download it. Take it to your team.</p>
    </aside>
  </div>;
}
