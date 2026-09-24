"use client";

import { useEffect, useRef, useState } from "react";
import { evidenceReply } from "../../lib/assistant.mjs";

let collection;
const loadCollection = () => collection ||= import("../../lib/knowledge.mjs").then(module => module.knowledge).catch(error => { collection = undefined; throw error; });

export default function useKnowledgeAssistant() {
  const [messages, setMessages] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [semantic, setSemantic] = useState("off");
  const [progress, setProgress] = useState("");
  const worker = useRef(null);
  const ready = useRef(false);
  const pending = useRef(null);
  const timer = useRef(null);
  const turn = useRef(0);
  const locked = useRef(false);

  useEffect(() => () => {
    turn.current++;
    worker.current?.terminate();
    clearTimeout(timer.current);
    pending.current?.resolve(undefined);
  }, []);

  function stopSemantic() {
    worker.current?.terminate(); worker.current = null; ready.current = false;
    clearTimeout(timer.current);
    pending.current?.resolve(undefined); pending.current = null;
    setSemantic("off"); setProgress("");
  }

  async function enableSemantic() {
    stopSemantic(); setSemantic("loading"); setProgress("Loading the on-device search model…");
    let instance;
    const fail = () => {
      if (instance && worker.current !== instance) return;
      stopSemantic(); setSemantic("error"); setProgress("The model couldn’t load. Word search is still available.");
    };
    try {
      instance = new Worker(new URL("../knowledge/semantic.worker.js", import.meta.url), { type: "module" });
      worker.current = instance;
      instance.onmessage = ({ data }) => {
        if (worker.current !== instance) return;
        if (data.type === "progress") setProgress(data.message);
        if (data.type === "ready") { clearTimeout(timer.current); ready.current = true; setSemantic("ready"); setProgress("Meaning search is ready. Questions stay on this device."); }
        if (data.type === "results" && pending.current?.id === data.requestId) { clearTimeout(timer.current); pending.current.resolve(data.scores); pending.current = null; }
        if (data.type === "error") fail();
      };
      instance.onerror = fail;
      timer.current = setTimeout(fail, 120000);
      const records = await loadCollection();
      if (worker.current === instance) instance.postMessage({ type: "init", records });
    } catch { fail(); }
  }

  async function send(question) {
    if (locked.current || !question.trim() || question.length > 300) return;
    locked.current = true;
    const id = ++turn.current;
    setBusy(true); setError("");
    setMessages(items => [...items, { id: `question-${id}`, role: "user", text: question }]);
    try {
      const records = await loadCollection();
      if (id !== turn.current) return;
      const scores = ready.current && worker.current ? await new Promise(resolve => {
        pending.current = { id, resolve };
        worker.current.postMessage({ type: "query", query: question, requestId: id });
        timer.current = setTimeout(() => { stopSemantic(); setSemantic("error"); setProgress("Meaning search took too long. Showing word matches."); }, 15000);
      }) : undefined;
      if (id !== turn.current) return;
      setMessages(items => [...items, { id: `answer-${id}`, role: "assistant", ...evidenceReply(records, question, scores) }]);
    } catch { if (id === turn.current) setError("The notes couldn’t load. Please try your question again."); }
    finally { if (id === turn.current) { locked.current = false; setBusy(false); } }
  }

  function cancel() { turn.current++; locked.current = false; if (pending.current) clearTimeout(timer.current); pending.current?.resolve(undefined); pending.current = null; setBusy(false); }
  function reset() { cancel(); setMessages([]); setError(""); }

  return { messages, busy, error, send, cancel, reset, semantic, progress, enableSemantic, stopSemantic };
}
