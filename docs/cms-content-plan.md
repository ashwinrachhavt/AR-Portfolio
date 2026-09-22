# Writing hub and subscriptions

## Selected approach

The owner selected one combined website release with the existing Notion editor, explicit Markdown publication from local notes, and Substack for email. The portfolio combines reviewed local articles, original Notion writing, and recent public external posts. Medium is connected. The owner supplied the verified Substack profile https://substack.com/@ashwinrachha. Its linked subdomain redirected both /feed and /embed back to the profile when checked, so the portfolio uses a direct subscription link and does not import a Substack feed. Hashnode still awaits its blog URL. This avoids a CMS migration and a second mailing list.

If replacing the editor is the goal, Ghost provides writing, RSS, newsletters, and member management together. Use Ghost's own publication frontend for membership features; its official documentation does not support those features in a completely headless setup. Sanity is a better fit for a custom dashboard containing posts, projects, and other structured material, with a separate email subscription service.

## Current publication workflow

Notion remains the CMS for entries in the configured database with `Status` set to `Blogs`. An approved Markdown edition in `src/content/writing/` overrides the Notion article with the same ID in both the article route and writing index. MCP and Buzz now use reviewed local editions under their existing IDs and URLs. Editing those Notion pages does not replace the local editions.

Use Node.js 22.18 or later and pnpm. The [README publication walkthrough](../README.md#publish-from-obsidian-or-notion) includes the required frontmatter and commands:

```bash
pnpm content:import "/absolute/path/to/approved-note.md" --publish
pnpm content:notion <published-blog-page-id> --publish
pnpm content:build
```

The first command reads only the named file, allowing a reviewed Obsidian note to be published without scanning a private vault. The second uses `.env` Notion credentials and verifies that the page already belongs to the published blog database before creating a snapshot. Neither command changes Notion. Imports require explicit `--publish`, refuse duplicate IDs, and create a source file plus the generated `src/content/published-writing.json` catalog. Review and commit both, then deploy. Edit an existing local source explicitly for subsequent revisions; importing does not overwrite it.

Publication metadata accepts only `id`, `title`, `date`, `description`, `tags`, and `published: true`. IDs contain lowercase letters, digits, and hyphens; dates use valid `YYYY-MM-DD` values. The parser accepts JSON-style quoted strings and tag arrays, not arbitrary YAML. Sources over 200 KB, empty bodies, unresolved wikilinks, private attachment links, expiring signed media URLs, and recognized credential patterns are rejected. Publish approved attachments to durable public HTTPS URLs or site paths before importing. These checks support editorial review; they do not certify every sentence or link as public.

The complete catalog is validated before creating an imported source. Output is replaced atomically, and a failed catalog write rolls back the newly imported file. `pnpm content:build` and `pnpm build` regenerate the catalog from reviewed sources. Changes reach visitors through a build and deployment. Local editions remain available when the Notion index cannot be loaded.

This is a one-way publication connection, not automatic or bidirectional synchronization. No user's local vault was accessed, and no Obsidian plugin or additional CMS has been installed. The [combined release record](releases/2026-09-22-combined-website.md) describes the full website scope and its limits.

## Content model and future archive work

- One work record: title, summary, topics, publication date, canonical URL, source, public/approved status, and optional body for owned original writing.
- Publication records link the same work to its Medium, Substack, Hashnode, and portfolio copies. Match known canonical URLs and source IDs; allow manual grouping instead of merging unrelated posts with similar titles.
- Refresh configured public sources into persistent storage. Preserve the last successful import during upstream failures and track source health. Imported HTML must be sanitized before any rendering.
- Use RSS or a supported API for recent external posts. Import older archives separately from owner-provided exports; RSS is not guaranteed to contain the full history or full text.
- Original portfolio articles remain readable locally. External entries show an excerpt and link to their original publication unless an owned full-text copy is deliberately imported.
- Keep private notes, subscriber details, recruiter correspondence, and authorization notes out of public feeds and public agent context. Only explicitly approved public content can be used by the portfolio agent.

## Feeds and subscribers

Implemented locally:

- `/rss.xml` contains public portfolio posts from reviewed local editions and the Notion archive, with local editions taking precedence for matching IDs.
- `/feed.xml` combines originals with configured external sources and is advertised in page metadata.
- `/blog` supports search, topic filters, source filters, and source labels. External posts open their original URLs. No imported HTML is rendered.
- Feed output contains titles, excerpts, tags, dates, absolute links, and stable IDs. Routes revalidate every five minutes; parsed external feeds are cached per source for one hour. A failed source cannot break the Notion archive. Failed fetches are not cached as successful empty responses.
- `SITE_URL` overrides the default public origin `https://ashwinrachha.vercel.app` when moving domains.
- `SUBSTACK_PUBLICATION_URL` enables that publication's RSS import and official embedded email signup, plus a direct subscribe link. It must be the publication's HTTPS origin, not an account profile or article URL.
- `SUBSTACK_PROFILE_URL` selects the profile subscription destination when no publication is configured. The default is the verified owner profile https://substack.com/@ashwinrachha.
- `HASHNODE_PUBLICATION_URL` enables that blog's `/rss.xml` feed.

Configure optional publication URLs in `.env` locally and in Vercel production before deployment. Do not enter placeholder publication URLs. Without a working publication URL, the signup section links to the verified Substack profile instead of displaying an iframe. Email addresses are handled on Substack, not stored by this app.

Invitations appear on the homepage, writing hub, and article pages. Visitors can choose “Skip, keep reading”; dismissal persists during the browsing session when session storage is available. If storage is unavailable, the current invitation still dismisses. All articles remain readable without signup. A page view does not identify a visitor or add them to a mailing list. The app tracks signup-link opens and skips, not email addresses or confirmed subscriptions.

The current aggregator deduplicates exact source IDs and normalized article URLs (tracking parameters removed). It does not guess that matching titles are the same article. Cross-platform grouping and a permanent historical archive remain future work; RSS imports cover only what each current feed exposes.

Optional future work: separate RSS endpoints for individual external sources.

Email subscribers belong to the chosen newsletter provider. Use its signup/confirmation flow, unsubscribe handling, and audience management. RSS readers follow feeds without registering email addresses. Do not silently transfer subscribers between platforms or automatically send imported historical posts as new emails. Publishing a newsletter remains an explicit editorial action.

## Information still needed

- Hashnode blog URL, if the owner wants to connect one.
- A working Substack publication feed/embed URL for embedded signup and post imports. Profile subscriptions are already linked; do not configure the redirecting subdomain as a feed.

No CMS migration, subscriber collection, or newsletter send has been performed. Historical production baseline, September 21, 2026: Medium's public feed was fetched successfully; https://ashwinrachha.vercel.app/blog and both feeds returned HTTP 200 on deployment `dpl_G8b3nSfVE4ineD2p8ArsGvwiAYxp`. That deployment contained 21 combined RSS entries and 11 portfolio entries. Those counts are observations from that release, not fixed archive limits or confirmation of the combined website release's deployment.

## Validation

The combined release passes 73 automated tests plus `pnpm lint`, `pnpm typecheck`, and `pnpm build`. Publication tests cover metadata and disclosure boundaries, duplicate IDs across different filenames, local article precedence, and rollback when writing the generated catalog fails. Browser checks cover article navigation, mobile layout, newsletter skip persistence, and dismissal when session storage fails. The actual Obsidian vault has not been tested.

The earlier writing-hub checks parsed generated XML with 11 original and 21 combined posts, each with unique IDs, and confirmed 10 Medium results under the source filter, external links, local article links, search, and no horizontal overflow at 390px width. Substack profile and publication configuration are unit-tested. The owner profile and Subscribe button were verified publicly; feed/embed redirects were checked. No end-to-end email enrollment was performed and no test subscription was sent.

## Official references

- [Medium RSS and paywall limitations](https://help.medium.com/hc/en-us/articles/214874118-Using-RSS-feeds-of-profiles-publications-and-topics)
- [Substack RSS](https://support.substack.com/hc/en-us/articles/360038239391-Is-there-an-RSS-feed-for-my-publication)
- [Substack signup embed](https://support.substack.com/hc/en-us/articles/360041759232-Can-I-embed-a-signup-form-for-my-Substack-publication)
- [Ghost newsletters](https://ghost.org/help/delivering-emails/)
- [Ghost headless limitations](https://docs.ghost.org/jamstack/)
- [Sanity Next.js integration](https://www.sanity.io/nextjs-cms)
