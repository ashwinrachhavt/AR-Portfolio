"use client";

import { useEffect, useRef, useState } from "react";
import { useEveAgent } from "eve/react";
import { messageText } from "../../lib/assistant.mjs";
import AssistantPanel from "./AssistantPanel";

export default function EveSession({ onUseSources }) {
  const agent = useEveAgent();
  const [records, setRecords] = useState([]);
  const [preparing, setPreparing] = useState(false);
  const [error, setError] = useState("");
  const locked = useRef(false);
  const generation = useRef(0);
  const busy = preparing || ["submitted", "streaming", "resuming"].includes(agent.status);
  const pendingRequestId = (agent.data?.messages || []).flatMap(message => message.parts || []).find(part => part.toolMetadata?.eve?.inputRequest && !part.toolMetadata.eve.inputResponse)?.toolMetadata.eve.inputRequest.requestId;
  const cancelTurn = agent.cancel;
  const messages = (agent.data?.messages || []).map(message => ({ id: message.id, role: message.role, text: messageText(message) })).filter(message => message.text && ["user", "assistant"].includes(message.role));

  useEffect(() => {
    if (!busy) return;
    const timeout = setTimeout(() => {
      void cancelTurn().then(() => setError(pendingRequestId ? "This conversation reached a local limit. Start a new conversation, or search the sources." : "That reply took too long. Try a shorter question, or search the sources.")).catch(() => setError("The assistant couldn’t be stopped. Try Stop again before continuing."));
    }, pendingRequestId ? 0 : 120000);
    return () => clearTimeout(timeout);
  }, [busy, pendingRequestId, cancelTurn]);

  async function send(question) {
    if (busy || locked.current || !question.trim() || question.length > 300) return;
    locked.current = true; setPreparing(true); setError("");
    const current = generation.current;
    try {
      const { knowledge } = await import("../../lib/knowledge.mjs");
      if (current !== generation.current) return;
      setRecords(knowledge); setPreparing(false);
      await agent.send(question);
    } catch { setError("The assistant couldn’t complete that reply. Try again, or search the sources directly."); }
    finally { locked.current = false; setPreparing(false); }
  }
  async function cancel() {
    generation.current++;
    try { if (["submitted", "streaming"].includes(agent.status)) await agent.cancel(); }
    catch { setError("The stop request didn’t reach the assistant. Please try Stop again."); }
  }
  function reset() { generation.current++; agent.reset(); setError(""); }
  return <AssistantPanel mode="eve" messages={messages} records={records} busy={busy} error={error || (agent.error ? "The local assistant is unavailable. You can still search the sources directly." : "")} send={send} cancel={cancel} reset={reset} onUseSources={onUseSources} />;
}
