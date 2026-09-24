# Native portfolio assistant and local Eve

The homepage contains a native assistant card. Eve is its optional local conversational backend, using the same approved collection for visitor questions and evidence-backed authoring. The public portfolio, lexical search, project panes, and interactive labs work without Eve or an inference account. Browser-local semantic search is a separate opt-in feature; Eve's tools use the shared lexical and relationship retrieval functions.

## What it can help with

- Find related ideas across approved projects, experience, notes, concepts, publications, and references.
- Retrieve evidence and suggest an article outline with claim-to-source mappings.
- Check career wording against `src/content/resume.json`, preserving pilot status and team-outcome attribution.
- Return data-only draft proposals for evidence cards, a comparison table, process steps, or a checklist.

The workflow is search → retrieve → cite. Visitor replies link to `/knowledge/<id>` source notes; those notes preserve original URLs, locators, and source revisions. A stable record ID is not a frozen copy of its content. Retrieved text never becomes an instruction or executable code.

Widget drafts do not automatically render. `propose_widget` validates bounded plain-text data and confirms cited IDs exist in the public corpus. A person still needs to verify that each citation supports its claim, and a developer must add reviewed component code and a content entry before publication. The agent cannot write files, execute code or MDX, browse external pages, send messages, publish, or delegate. Eve's optional default tools are disabled.

## Run locally

The integration was written against the installed `eve@0.63.0`, `ai@7.0.107`, and `@ai-sdk/openai@4.0.71`. Eve is a preview framework; its bundled documentation in `node_modules/eve/docs/` is the authority for this installation.

1. Install project dependencies with `pnpm install`. Build reviewed content with `pnpm content:build`, then `pnpm knowledge:build`. To import the companion repository's reviewed public export, run `pnpm knowledge:import /path/to/ashwinrachhavt/knowledge/public.json`, then rebuild. Never point the importer at a raw Notion export or private notes.
2. Install Ollama if necessary. Run `ollama list` to check your downloaded models. The base weights are `qwen3.5:4b`; downloading them is a separate, explicit step (`ollama pull qwen3.5:4b`) if missing. Create the portfolio-specific model once with `ollama create portfolio-qwen3.5:4b -f config/ollama.Modelfile`. It reuses the weights and pins an 8,192-token context and temperature 0.2. Nothing in the app downloads or starts Ollama automatically.
3. Start Ollama with cloud features disabled, a loopback bind, and at least an 8,192-token context. For a manually managed server:

   ```sh
   OLLAMA_NO_CLOUD=1 OLLAMA_HOST=127.0.0.1:11434 OLLAMA_CONTEXT_LENGTH=8192 ollama serve
   ```

   If Ollama is already running, configure and restart that instance instead of starting a second server. For the macOS application, set the environment variables with `launchctl setenv`, then restart the application. See [Ollama server configuration and cloud controls](https://docs.ollama.com/faq#how-do-i-disable-ollama-cloud-features).

4. Inspect the discovered tools without making a model call, then explicitly enable the local agent:

   ```sh
   pnpm exec eve info
   EVE_LOCAL_ENABLED=1 pnpm dev --hostname 127.0.0.1 --port 3040
   ```

Open `http://127.0.0.1:3040/` to use Eve in the native assistant card. `withEve` starts the agent runtime alongside Next.js only in the development phase. Production builds return the normal Next.js configuration and do not provision or proxy to an Eve service. The UI selects Eve only when `NODE_ENV=development` and `EVE_LOCAL_ENABLED=1`; production deliberately uses source search. No iframe or external chat renderer is used. New conversation clears the local session attachment; it does not delete stored Eve history. Reload starts a new conversation. Stop cancels the durable turn. A two-minute UI deadline requests cancellation; usage-limit prompts are cancelled instead of silently granting more quota.

The default URL is `http://127.0.0.1:11434/v1`. `EVE_OLLAMA_BASE_URL` accepts HTTP(S) URLs on `127.0.0.1`, `localhost`, or `[::1]` only, ending in `/v1`. Credentials, query parameters, and other paths are rejected. `localhost` is converted to the IPv4 loopback literal. `EVE_OLLAMA_MODEL` defaults to `portfolio-qwen3.5:4b` and also permits `qwen3.5:4b`, `qwen3:8b`, or `qwen3:1.7b` (configure their context explicitly); other models require a reviewed allowlist change. Smaller models can be less reliable at tool use.

The agent requests `reasoning: "none"` for this retrieval-focused interface. [Ollama’s compatibility API](https://docs.ollama.com/api/openai-compatibility#setting-the-local-context-size) requires a Modelfile to pin context size; the original running model used 4,096 tokens, so the portfolio alias avoids silent truncation against Eve’s 8,192-token estimate.

The provider uses Ollama's [OpenAI-compatible chat-completions API](https://docs.ollama.com/api/openai-compatibility#local-server-usage) through a direct AI SDK model object. The transport strips authorization headers and rejects redirects. It never uses a Gateway model string, reads a paid provider API key, or selects a fallback model. Without `EVE_LOCAL_ENABLED=1`, model calls fail before any network request. An unavailable local server or missing model is an error, not a reason to switch providers.

Local inference uses the owner's RAM, disk, and electricity; hosting and downloads may have their own costs or quotas. Disable cloud features on the actual Ollama server as shown above. A loopback URL alone cannot determine how someone has configured the service behind it.

## Boundaries and version details

- `agent/channels/eve.ts` uses only `localDev()` and marks sessions private. In Eve 0.63, `localDev()` authorizes requests only in an `eve dev` or `vercel dev` process. It does not verify the caller's network address. Bind with `--host 127.0.0.1`; do not expose the development server through a tunnel or reverse proxy. Production session routes reject access. The framework's health route remains public and performs no model work; the default home route is disabled.
- `defaultTools: false`, `tool: false`, and the absence of connections remove default filesystem, shell, web, write, and delegation capabilities. Only the eight authored read-only tools are available.
- `get_profile`, `get_experience`, and `get_metrics` derive approved facts from the canonical resume. They do not import the older profile module or any recruiter notes. `get_projects` filters the shared public knowledge corpus.
- `search_knowledge`, `get_knowledge`, and `related_knowledge` use the same public-only retrieval functions as the portfolio. Search phrases, IDs, filters, and result limits have strict bounded schemas. Search results carry excerpts; full records are retrieved separately.
- Eve 0.63 requires explicit context metadata for a model outside its Gateway catalog. The agent sets `modelContextWindowTokens: 8192`; configure Ollama for at least this context. Compaction uses the same local model. Sessions have a two-hour timeout and cumulative limits of 32,000 input and 4,000 output tokens; limits are checked between model calls, not precise hard caps on a single response.
- Source-grounded instructions and schema validation reduce mistakes but cannot make a local model a factual verifier. Review generated prose and evidence before committing it. Conversation logs and state under `.eve/` remain local development artifacts and must not be published.

## Verification

```sh
node --experimental-strip-types --test src/lib/eve-local-config.test.mjs
node --experimental-strip-types --test agent/lib/knowledge-tools.test.mjs
pnpm exec eve info --json
pnpm typecheck
pnpm lint
```

The tests cover opt-in behavior, loopback validation, model restrictions, credential stripping, real HTTP redirect rejection, approved career facts, exact metric attribution, shared knowledge retrieval, bounded schemas, and data-only widget drafts. Discovery must report only the authored tools and zero connection/subagent capabilities. Successful discovery verifies configuration and schemas; it does not prove model response quality or a complete running session.

### Native interface verification — 2026-09-23

The native homepage panel completed a real durable Eve session using `search_knowledge`, `get_knowledge`, and a linked source in the response. Stop cancellation returned the conversation to a usable state. The portfolio model alias reuses existing weights and fixes the context-size mismatch found during that test. Model-generated wording still requires checking against sources.

Source search does not call Eve or an inference endpoint. It loads the public snapshot on first use, retrieves up to three distinct passages, and exposes optional on-device semantic search under “How it works.” It does not pretend to generate answers or preserve conversational context. Unknown topics produce a no-evidence message. The browser renders only text and approved local source links from Eve, never reasoning traces, tool payloads, arbitrary URLs, or executable content.
