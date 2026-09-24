"use client";

import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import Link from "next/link";
import { approvedCitation, assistantStarters } from "../../lib/assistant.mjs";
import styles from "./assistant.module.css";

function Icon({ name }) {
  const paths = {
    send: <path d="M12 19V5m-6 6 6-6 6 6" />,
    reset: <><path d="M4 10a8 8 0 1 1 1 7M4 4v6h6" /></>,
    work: <><rect x="4" y="4" width="6" height="6" rx="1.5" /><rect x="14" y="4" width="6" height="6" rx="1.5" /><rect x="4" y="14" width="6" height="6" rx="1.5" /><path d="M14 17h6m-3-3v6" /></>,
    learn: <><path d="M12 6c-3-2-6-2-9-1v14c3-1 6-1 9 1 3-2 6-2 9-1V5c-3-1-6-1-9 1v14" /></>,
    idea: <><circle cx="12" cy="7" r="3" /><path d="M12 10v7m-7-3v3h14v-3" /><circle cx="5" cy="20" r="1.5" /><circle cx="19" cy="20" r="1.5" /></>,
    arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
    stop: <rect x="6" y="6" width="12" height="12" rx="2" />,
  };
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

export default function AssistantPanel({ mode, messages, records = [], busy, error, send, cancel, reset, semantic, progress, enableSemantic, stopSemantic, onUseSources }) {
  const [draft, setDraft] = useState("");
  const [lastQuestion, setLastQuestion] = useState("");
  const input = useRef(null);
  const transcript = useRef(null);
  const help = useRef(null);
  const follow = useRef(true);
  const isEve = mode === "eve";

  useEffect(() => {
    const focus = () => { input.current?.focus(); input.current?.select(); };
    function keyboard(event) {
      if (event.isComposing || event.repeat) return;
      const editing = event.target instanceof HTMLElement && (event.target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(event.target.tagName));
      if (((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") || (event.key === "/" && !editing && !event.metaKey && !event.ctrlKey && !event.altKey)) { event.preventDefault(); focus(); }
      if (event.key === "Escape" && help.current?.open) { help.current.open = false; help.current.querySelector("summary")?.focus(); }
    }
    const anchorFocus = () => { if (window.location.hash === "#assistant-question") focus(); };
    window.addEventListener("keydown", keyboard); window.addEventListener("hashchange", anchorFocus); anchorFocus();
    return () => { window.removeEventListener("keydown", keyboard); window.removeEventListener("hashchange", anchorFocus); };
  }, []);

  useEffect(() => {
    const element = transcript.current;
    if (!follow.current || !element) return;
    const articles = element.querySelectorAll("article");
    const question = articles[articles.length - 2];
    if (mode === "sources" && !busy && question && messages.at(-1)?.role === "assistant") {
      element.scrollTop += question.getBoundingClientRect().top - element.getBoundingClientRect().top - 24;
    } else element.scrollTop = element.scrollHeight;
  }, [messages, busy, mode]);

  function submit(value) {
    const question = value.trim();
    if (!question || busy || !send || question.length > 300) return;
    follow.current = true; setLastQuestion(question); setDraft("");
    void send(question);
    input.current?.focus({ preventScroll: true });
  }

  return <section id="assistant" className={styles.panel} aria-labelledby="assistant-title">
    <header className={styles.header}>
      <span className={styles.monogram} aria-hidden="true">ar<span /></span>
      <div className={styles.identity}><h2 id="assistant-title">Ashwin’s assistant</h2><p><span className={styles.dot} />{isEve ? "Local AI · Grounded in my work" : mode === "loading" ? "Getting ready…" : "My work, writing & collected ideas"}</p></div>
      <button className={styles.iconButton} type="button" aria-label="New conversation" title="New conversation" disabled={busy || !messages.length} onClick={() => { reset?.(); setDraft(""); setLastQuestion(""); input.current?.focus({ preventScroll: true }); }}><Icon name="reset" /></button>
    </header>

    <div className={styles.transcript} ref={transcript} tabIndex={0} role="region" aria-label="Assistant conversation" onScroll={() => { const element = transcript.current; follow.current = element.scrollHeight - element.scrollTop - element.clientHeight < 60; }}>
      {!messages.length ? <div className={styles.welcome}>
        <div className={styles.motif} aria-hidden="true"><span /><span /><span /><i /></div>
        <p className={styles.welcomeLabel}>A little of what I’ve learned.</p>
        <h3>What are you<br />curious about?</h3>
        <p>Explore Ashwin’s work, borrow an idea, or find a reference for something you’re building.</p>
      </div> : messages.map(message => <article key={message.id} className={message.role === "user" ? styles.question : styles.answer}>
        <span className={styles.srOnly}>{message.role === "user" ? "You" : "Assistant"}: </span>
        {message.role === "user" ? <p>{message.text}</p> : <><div className={styles.prose}><Markdown allowedElements={["p", "strong", "em", "ul", "ol", "li", "code", "pre", "blockquote", "a"]} unwrapDisallowed components={{ a: ({ href, children }) => approvedCitation(href, records) ? <a href={href} target="_blank" rel="noopener" title="Open source in a new tab">{children}<span aria-hidden="true"> ↗</span></a> : <span>{children}</span> }}>{message.text}</Markdown></div>
          {message.sources?.length > 0 && <ol className={styles.sources}>{message.sources.map((source, index) => <li key={source.id}>
            <a href={`/knowledge/${source.id}`} target="_blank" rel="noopener" title="Open source in a new tab"><span className={styles.sourceNumber}>{index + 1}</span><span>{source.title}</span><span aria-hidden="true">↗</span></a>
            <blockquote>{source.excerpt}</blockquote><small>{source.match === "semantic" ? "Related meaning · " : ""}{source.sourceTitle}</small>
          </li>)}</ol>}
        </>}
      </article>)}
      {busy && <p className={styles.thinking}>{isEve ? "Reading the sources" : mode === "loading" ? "Preparing the assistant" : "Finding useful passages"}<span aria-hidden="true">…</span></p>}
    </div>
    <span className={styles.srOnly} role="status">{busy ? "Working on your question." : messages.length ? "Reply ready in the conversation." : "Ready for a question."}</span>

    <div className={styles.composerArea}>
      {error && <div role="alert" className={styles.error}><p>{error}</p><div><button type="button" disabled={busy || !lastQuestion} onClick={() => submit(lastQuestion)}>Try again</button>{onUseSources && <button type="button" disabled={busy} onClick={onUseSources}>Search the sources</button>}</div></div>}
      <form className={styles.composer} onSubmit={event => { event.preventDefault(); submit(draft); }}>
        <label className={styles.srOnly} htmlFor="assistant-question">Ask about Ashwin’s work, writing, or ideas</label>
        <textarea ref={input} id="assistant-question" rows={1} maxLength={300} value={draft} onChange={event => setDraft(event.target.value)} placeholder="Bring a question or an idea…" aria-describedby="assistant-mode" onKeyDown={event => { if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); submit(draft); } }} />
        {busy && cancel ? <button className={styles.send} type="button" onClick={() => void cancel()} aria-label="Stop response" title="Stop response"><Icon name="stop" /></button> : <button className={styles.send} type="submit" disabled={busy || !draft.trim()} aria-label="Send question" title="Send question (Enter)"><Icon name="send" /></button>}
      </form>
      {!messages.length && <div className={styles.starters} role="group" aria-label="Suggested questions">{assistantStarters.map(starter => <button type="button" key={starter.label} disabled={busy} onClick={() => submit(starter.question)} title={starter.question}><Icon name={starter.icon} /><span>{starter.label}</span></button>)}</div>}
      <div className={styles.footnote}>
        <p id="assistant-mode">{isEve ? "Local AI · Check the linked sources" : "Source search · No generated answers"}</p>
        <details className={styles.help} ref={help}><summary aria-label="How the assistant works and keyboard shortcuts"><span aria-hidden="true">⌘ K</span><span className={styles.helpLabel}>How it works</span></summary>
          <div className={styles.helpContent}><strong>{isEve ? "Answers with a reading trail." : "Useful passages, straight from the source."}</strong><p>{isEve ? "Eve reads Ashwin’s approved work and notes using a model on this computer. AI can make mistakes; follow its citations." : "Each question searches Ashwin’s public collection independently. These are retrieved passages, not an AI-written answer. Questions stay on your device."}</p><dl><div><dt>Focus the question</dt><dd><kbd>⌘/Ctrl K</kbd> or <kbd>/</kbd></dd></div><div><dt>Send / new line</dt><dd><kbd>Enter</kbd> / <kbd>Shift Enter</kbd></dd></div></dl>
            {!isEve && mode !== "loading" && <div className={styles.semantic}><p>Search by meaning with a small, free model downloaded from Hugging Face. The first load can take a minute.</p><button type="button" onClick={semantic === "ready" || semantic === "loading" ? stopSemantic : enableSemantic}>{semantic === "ready" ? "Turn off meaning search" : semantic === "loading" ? "Cancel download" : "Enable meaning search"}</button>{progress && <p role="status">{progress}</p>}</div>}
            <Link href="/knowledge/about">About the sources <span aria-hidden="true">↗</span></Link>
          </div>
        </details>
      </div>
    </div>
  </section>;
}
