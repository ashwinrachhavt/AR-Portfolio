---
id: "3b92e262-08a5-8186-942c-ff5559fe4f68"
title: "MCP Is Moving Beyond Sessions. Here’s Why That Matters."
date: "2026-09-22"
description: "Where protocol state belongs, why request boundaries matter, and what to check before migrating an MCP server."
tags: ["AI", "Engineering", "MCP"]
published: true
---

The most interesting question in a protocol change is often the least glamorous one: what does a server need to remember before it can answer the next request?

MCP, the Model Context Protocol, gives AI applications a shared way to discover and use tools and other context. Its move toward self-contained requests interests me because it changes where complexity lives. It asks application developers to make some state explicit instead of hiding it inside a protocol conversation.

**Version note, September 22, 2026:** this article discusses the [current draft transport design](https://modelcontextprotocol.io/specification/draft/basic/transports). The dated [2025-11-25 specification](https://modelcontextprotocol.io/specification/2025-11-25/basic/transports) still describes optional HTTP sessions. A draft is not a promise that every client, SDK, or deployed server already behaves that way. Check the version your clients actually support before changing a working integration.

## A session is not a connection

A network connection is a channel over which bytes move. A protocol session is a relationship spanning interactions. Authentication establishes an identity. Application state records the work being done. These ideas can overlap in an implementation, but they solve different problems.

Consider an assistant reviewing an invoice. It may need an authenticated user, a document ID, and a review record. It does not follow that it also needs a particular server process to remember an earlier handshake before it can inspect that document.

```text
Connection:       How does this request reach the service?
Authentication:   Who is making it?
Authorization:    What may they do right now?
Application state: Which document or review are they working on?
```

The useful design question is not “can we remove all state?” It is “which state does this request depend on, and who owns it?”

## What the earlier HTTP design allowed

Under the 2025-11-25 transport specification, a server can return an `MCP-Session-Id` during initialization. A client that receives it includes that ID on subsequent requests. If the session expires and the server returns the specified not-found response, the client initializes again.

That is a protocol mechanism. It does not require every deployment to store sessions in one worker's memory. A server can make different storage and routing choices. But once correct handling depends on recovering session context, those choices become part of operating the service.

## The cost appears when requests move

Here is a hypothetical deployment with two workers:

```text
Initialization -> worker A -> context in A's memory
Next tool call -> worker B -> no matching local context
```

Sticky routing can keep a client on worker A. Shared storage can make the context available to both workers. Both approaches may be appropriate. Each also creates something to reason about during scaling, restarts, and incident recovery.

The point is not that sessions make production impossible. They add a dependency that is easy to overlook when a local demo has only one process.

Now change the request boundary:

```text
Request -> authenticated identity + required protocol context
        -> durable document/review identifiers
        -> any eligible worker
        -> current permission check
```

The service still has state. Its dependencies are easier to see, test, and recover independently.

## What I like about the draft direction

The current draft describes transport-independent message patterns and per-request context, and explains compatibility with earlier initialization-based revisions. I read that as a useful separation: transport moves messages; the application owns durable work.

My engineering preference is to make a tool request intelligible at its boundary. When I inspect a failure, I want to know what operation was requested, which identity requested it, what resource it addressed, and why it was accepted or denied.

That preference is not proof that one architecture is always faster. It is a claim about what becomes easier to inspect. Throughput, latency, and operating cost still need measurement on the actual workload.

## State still needs an owner

Suppose a tool proposes changing an invoice category, then waits for a human to approve it. Removing protocol sessions does not eliminate the proposed change, approval status, or permission checks.

I would make those explicit application records:

| State | A useful owner | A question to test |
| --- | --- | --- |
| User identity | Authentication layer | Is this identity still valid? |
| Resource access | Authorization layer | Can this user act on this invoice now? |
| Proposed change | Durable application record | Which exact change is being approved? |
| Long-running work | Job/task record | Can a different worker resume or report it? |
| Duplicate submission | Application operation key | Will a retry repeat the side effect? |

These are design suggestions, not fields imposed by MCP. The important property is that approval refers to a specific action, and execution checks current authority. A remembered conversation should not grant permission forever.

## A migration should begin with an inventory

Before removing session-dependent code, list what it currently stores. Separate protocol negotiation from user identity, authorization, pending work, and caches. If you cannot explain where a value will live afterward, the migration is not ready.

Then test the failure paths:

1. Send the next request to a different worker.
2. Restart a worker between proposal and execution.
3. Revoke access while an operation is pending.
4. Retry after the client times out without knowing whether a write succeeded.
5. Connect a client that implements an older protocol revision.

Write down the expected result before running each test. “The second request returned 200” is weaker evidence than “the permitted operation completed once, and the revoked operation did not execute.”

## The product lesson

Infrastructure decisions eventually become user experiences. A fragile request boundary can look like a spinner that never finishes, a tool that forgets what it was doing, or a retry that produces duplicate work.

The draft direction interests me because it encourages a cleaner explanation of that boundary. It does not remove the need for careful application design. It makes that design harder to leave implicit.

That is the kind of simplification I like: fewer hidden prerequisites, clearer ownership, and failure behavior you can describe before a customer discovers it.

## Read the source

- [MCP current draft: transports](https://modelcontextprotocol.io/specification/draft/basic/transports)
- [MCP 2025-11-25: Streamable HTTP and session management](https://modelcontextprotocol.io/specification/2025-11-25/basic/transports)
- [MCP current draft: versioning and compatibility](https://modelcontextprotocol.io/specification/draft/basic/versioning)

For another look at explicit identity and authority, read [Inside Buzz](/blog/3bb2e262-08a5-80aa-b865-e905d51fa752). To explore the work behind my approach, try the [Career Fit Navigator](/fit).
