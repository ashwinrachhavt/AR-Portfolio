---
id: "3bb2e262-08a5-80aa-b865-e905d51fa752"
title: "Inside Buzz: How One Signed Message Becomes Work by an AI Agent"
date: "2026-09-22"
description: "Follow a message through identity, permissions, an ACP bridge, and agent tools. What Buzz teaches us about building products where people and agents work together."
tags: ["AI", "Product", "Engineering"]
published: true
---

A chat interface makes delegating to an AI agent look simple: mention it, ask for something, wait for a reply. The interesting design work begins behind that interaction. Who asked? Which workspace does the request belong to? What is the agent allowed to read or change? What survives if it crashes?

Buzz is worth studying because it makes identity and coordination part of the workspace itself. This is an architectural reading of the public project, not a claim that I built Buzz or have operated it at scale.

**Source note:** checked against the public repository on September 22, 2026. Buzz is evolving; use its current documentation when deploying it.

## Start with the relay

The [project architecture](https://github.com/block/buzz/blob/main/ARCHITECTURE.md) describes the relay as the authority through which clients read and write. It handles authentication, signature verification, persistence, and distribution to subscribers. Community context matters too: a request must be resolved into the right workspace before it can operate there.

That makes a message more than text on a screen. It is an event attributed to an identity, interpreted inside an authority boundary.

The distinction I care about is simple: **a valid signature establishes who signed an event. It does not establish that the requested action is permitted, sensible, or complete.**

## Follow one request

Imagine a teammate writes, “Review this patch and tell me what could fail.” This is a hypothetical walkthrough; it is not a transcript of a production run.

```text
Person writes a message
  -> signed event reaches the relay
  -> identity, workspace, and access checks
  -> accepted event becomes available to subscribers
  -> buzz-acp receives an eligible mention
  -> ACP prompt reaches an agent process
  -> agent reasons and uses permitted tools
  -> results return to the workspace
```

Each arrow is a place to ask a different question. Was the event accepted? Was it delivered? Did the worker start? Did its tool succeed? Did the person get a useful result?

Treating all of those as “the AI responded” makes failures difficult to diagnose.

## The bridge has a real job

The [buzz-acp documentation](https://github.com/block/buzz/blob/main/crates/buzz-acp/README.md) describes a harness that listens for mentions and connects the relay to agents speaking the Agent Client Protocol over standard input and output. The agent interacts with the workspace through Buzz tools. Agent identities have their own keys and membership.

ACP is the interface between the harness and the agent process here. It is distinct from MCP, which concerns tools and context exposed to an AI application.

The product implication is interesting: the workspace can provide the collaboration setting while the agent runtime provides reasoning. Those responsibilities can evolve separately, provided their interface stays explicit.

## Three things a signature cannot tell you

The [Nostr event format](https://github.com/nostr-protocol/nips/blob/master/01.md) includes an event identifier, public key, timestamp, kind, tags, content, and signature. That structure makes attribution and integrity inspectable. It does not make every downstream statement true.

For a product built around agent work, I would keep three distinctions visible:

| Question | Why it matters |
| --- | --- |
| Is the event authentic? | A changed or forged message must not borrow someone’s identity. |
| Is the action authorized? | A legitimate member can still lack access to a channel, repository, or operation. |
| Did the work actually complete? | An accepted request can outlive a failed worker or a denied tool call. |

These are my design criteria for evaluating such a system. They are not a claim that the current UI exposes every state exactly this way.

## What happens when something breaks?

Consider four failures in our hypothetical patch review.

**The message is modified after signing.** Verification should fail. The product should not turn that into an ordinary agent task.

**The author is real but lacks access.** Identity verification can succeed while authorization fails. “Authenticated” should never be treated as a synonym for “allowed.”

**The agent starts, then loses its process.** The person's request has not magically become a completed review. A useful experience needs a visible failure or recovery state, and retry behavior that does not accidentally duplicate consequential actions.

**A tool returns an error.** The agent should report what it could and could not inspect. A confident summary is not evidence that a repository was read or a test was run.

This is where I would spend time evaluating an agent workspace. A happy-path demo shows that the parts connect. Failure paths show whether people can trust the product while doing actual work.

## Why the interface matters as much as the architecture

A shared event system is an implementation choice. Its value to a teammate depends on what the interface makes understandable.

I want to be able to see who delegated the work, what the agent is doing, which permissions it used, and whether I need to intervene. I also want enough restraint that a normal conversation does not become a wall of infrastructure logs.

There is a product-design problem here: summarize the work without hiding the evidence. The right amount of detail depends on the moment. A person checking progress needs a short status. A person approving a write needs the exact proposed action. A person investigating a failure needs the underlying sequence.

## What I take from Buzz

The [Buzz README](https://github.com/block/buzz) positions agents as participants in a workspace that can include code, reviews, workflows, and other shared activity. That is a richer starting point than treating an agent as a text box with an unusually powerful API key.

My interest is in the question it opens: if people and agents work in the same product, what should they share, and where must their authority remain separate?

The answer will not come from signatures alone. It needs careful permission design, recoverable work, clear feedback, and a product that makes the next action obvious. That combination of engineering and experience is what makes this worth exploring.

## Read the source

- [Buzz repository and product overview](https://github.com/block/buzz)
- [Buzz architecture](https://github.com/block/buzz/blob/main/ARCHITECTURE.md)
- [buzz-acp: relay-to-agent harness](https://github.com/block/buzz/blob/main/crates/buzz-acp/README.md)
- [Nostr NIP-01: events and signatures](https://github.com/nostr-protocol/nips/blob/master/01.md)

Related: [MCP, sessions, and where state belongs](/blog/3b92e262-08a5-8186-942c-ff5559fe4f68). Have a workflow of your own? Try the [AI Workflow Readiness Lab](/tools/workflow-readiness).
