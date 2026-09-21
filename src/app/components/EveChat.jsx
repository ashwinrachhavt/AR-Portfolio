"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Send } from "react-feather";
import { useEveAgent } from "eve/react";
import LoadingDots from "./LoadingDots";

const STARTERS = [
  "What did you build at Loan Labs?",
  "Walk me through Classify AI at Finally.",
  "How do you design permission-safe agent actions?",
  "What roles are you targeting next?",
];

function messageText(message) {
  if (!message?.parts) return "";
  return message.parts
    .filter((part) => part.type === "text" && part.text)
    .map((part) => part.text)
    .join("\n");
}

export default function EveChat() {
  const agent = useEveAgent();
  const [draft, setDraft] = useState("");
  const lastMessageRef = useRef(null);
  const isBusy = agent.status === "submitted" || agent.status === "streaming";
  const isResuming = agent.status === "resuming";

  const messages = useMemo(() => agent.data?.messages ?? [], [agent.data]);

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isBusy]);

  const sendMessage = (value) => {
    const message = value.trim();
    if (!message || isResuming) return;
    void agent.send(message, isBusy ? { turnPolicy: "steer" } : undefined);
    setDraft("");
  };

  return (
    <section id="agents" className="py-16">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <p className="mb-2 text-sm uppercase tracking-[0.2em] text-primary-400">
            Eve agents
          </p>
          <h2 className="mb-3 text-4xl font-bold text-white">Talk to Ashwin</h2>
          <p className="mx-auto max-w-2xl text-[#ADB7BE]">
            A durable Eve agent with tools for Loan Labs, Finally, projects, and
            recruiter-safe metrics. Ask about agentic systems, fintech
            infrastructure, or what I want to build next.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-card/70 shadow-2xl">
          <div className="flex flex-wrap gap-2 border-b border-border px-4 py-3">
            {STARTERS.map((starter) => (
              <button
                key={starter}
                type="button"
                disabled={isResuming}
                onClick={() => sendMessage(starter)}
                className="rounded-full border border-primary-500/40 px-3 py-1 text-xs text-[#ADB7BE] transition hover:border-primary-400 hover:text-white disabled:opacity-50"
              >
                {starter}
              </button>
            ))}
          </div>

          <div className="flex h-[28rem] flex-col gap-5 overflow-y-auto p-6">
            {messages.length === 0 && (
              <div className="flex gap-3">
                <Image
                  src="/images/Ashwin.png"
                  width={44}
                  height={44}
                  alt="Ashwin agent"
                  className="h-11 w-11 rounded-full object-cover"
                />
                <div className="max-w-xl rounded-b-xl rounded-tr-xl bg-white p-5 text-black shadow-lg">
                  <p className="mb-2 text-sm font-medium text-violet-600">
                    Ashwin
                  </p>
                  <p>
                    Hello. I am Ashwin. Ask me about Loan Labs, Lois, Finally,
                    Classify AI, or the agent systems I want to build next.
                  </p>
                </div>
              </div>
            )}

            {messages.map((message, idx) => {
              const text = messageText(message);
              if (!text) return null;
              const isLast = idx === messages.length - 1;

              if (message.role === "user") {
                return (
                  <div
                    key={message.id}
                    ref={isLast ? lastMessageRef : null}
                    className="max-w-xl self-end rounded-b-xl rounded-tl-xl bg-white p-5 text-black shadow-lg"
                  >
                    <p className="mb-2 text-sm font-medium text-violet-600">You</p>
                    <p className="whitespace-pre-wrap">{text}</p>
                  </div>
                );
              }

              return (
                <div
                  key={message.id}
                  ref={isLast ? lastMessageRef : null}
                  className="flex gap-3"
                >
                  <Image
                    src="/images/Ashwin.png"
                    width={44}
                    height={44}
                    alt="Ashwin agent"
                    className="h-11 w-11 rounded-full object-cover"
                  />
                  <div className="max-w-xl rounded-b-xl rounded-tr-xl bg-white p-5 text-black shadow-lg">
                    <p className="mb-2 text-sm font-medium text-violet-600">
                      Ashwin
                    </p>
                    <p className="whitespace-pre-wrap">{text}</p>
                  </div>
                </div>
              );
            })}

            {isBusy && (
              <div ref={lastMessageRef} className="flex gap-3">
                <Image
                  src="/images/Ashwin.png"
                  width={44}
                  height={44}
                  alt="Ashwin agent thinking"
                  className="h-11 w-11 rounded-full object-cover"
                />
                <div className="max-w-xl rounded-b-xl rounded-tr-xl bg-white p-5 text-black shadow-lg">
                  <p className="mb-4 text-sm font-medium text-violet-600">
                    Ashwin
                  </p>
                  <LoadingDots />
                </div>
              </div>
            )}
          </div>

          <form
            className="border-t border-border p-4"
            onSubmit={(event) => {
              event.preventDefault();
              sendMessage(draft);
            }}
          >
            <div className="relative">
              <textarea
                aria-label="chat input"
                value={draft}
                disabled={isResuming}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Ask about Loan Labs, Finally, or agent systems"
                className="h-20 w-full resize-none rounded-2xl border border-slate-700 bg-[#121212] py-4 pl-4 pr-16 text-sm text-white placeholder:text-slate-500 focus:border-violet-500 focus:outline-none focus:ring-4 focus:ring-violet-500/10"
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    sendMessage(draft);
                  }
                }}
              />
              <button
                type="submit"
                aria-label="Send"
                disabled={!draft.trim() || isResuming}
                className="absolute bottom-3 right-3 flex h-11 w-11 items-center justify-center rounded-full bg-violet-600 text-white hover:bg-violet-700 disabled:bg-violet-950 disabled:text-violet-400"
              >
                <Send size={16} />
              </button>
            </div>
            {agent.error ? (
              <p className="mt-2 text-xs text-red-400">
                {agent.error.message || "The agent could not complete that turn."}
              </p>
            ) : null}
          </form>
        </div>
      </div>
    </section>
  );
}
