# Writing hub and subscriptions

## Selected approach

The owner selected the existing Notion editor and Substack for email. The portfolio combines original Notion writing with recent public external posts. Medium is connected. The owner supplied the verified Substack profile https://substack.com/@ashwinrachha. Its linked subdomain currently redirects both /feed and /embed back to the profile, so the portfolio uses a direct subscription link and does not import a Substack feed. Hashnode still awaits its blog URL. This avoids a CMS migration and a second mailing list.

If replacing the editor is the goal, Ghost provides writing, RSS, newsletters, and member management together. Use Ghost's own publication frontend for membership features; its official documentation does not support those features in a completely headless setup. Sanity is a better fit for a custom dashboard containing posts, projects, and other structured material, with a separate email subscription service.

## Content model and future archive work

- One work record: title, summary, topics, publication date, canonical URL, source, public/approved status, and optional body for owned original writing.
- Publication records link the same work to its Medium, Substack, Hashnode, and portfolio copies. Match known canonical URLs and source IDs; allow manual grouping instead of merging unrelated posts with similar titles.
- Refresh configured public sources into persistent storage. Preserve the last successful import during upstream failures and track source health. Imported HTML must be sanitized before any rendering.
- Use RSS or a supported API for recent external posts. Import older archives separately from owner-provided exports; RSS is not guaranteed to contain the full history or full text.
- Original portfolio articles remain readable locally. External entries show an excerpt and link to their original publication unless an owned full-text copy is deliberately imported.
- Keep private notes, subscriber details, recruiter correspondence, and authorization notes out of public feeds and public agent context. Only explicitly approved public content can be used by the portfolio agent.

## Feeds and subscribers

Implemented locally:

- `/rss.xml` contains the Notion-backed public portfolio posts.
- `/feed.xml` combines originals with configured external sources and is advertised in page metadata.
- `/blog` supports search, topic filters, source filters, and source labels. External posts open their original URLs. No imported HTML is rendered.
- Feed output contains titles, excerpts, tags, dates, absolute links, and stable IDs. Routes revalidate every five minutes; parsed external feeds are cached per source for one hour. A failed source cannot break the Notion archive. Failed fetches are not cached as successful empty responses.
- `SITE_URL` overrides the default public origin `https://ashwinrachha.vercel.app` when moving domains.
- `SUBSTACK_PUBLICATION_URL` enables that publication's RSS import and official embedded email signup, plus a direct subscribe link. It must be the publication's HTTPS origin, not an account profile or article URL.
- `SUBSTACK_PROFILE_URL` selects the profile subscription destination when no publication is configured. The default is the verified owner profile https://substack.com/@ashwinrachha.
- `HASHNODE_PUBLICATION_URL` enables that blog's `/rss.xml` feed.

Configure those two optional URLs in `.env` locally and in Vercel production before deployment. Do not enter placeholder publication URLs. Without a working publication URL, the signup section links to the verified Substack profile instead of displaying an iframe. Email addresses are handled on Substack, not stored by this app.

The current aggregator deduplicates exact source IDs and normalized article URLs (tracking parameters removed). It does not guess that matching titles are the same article. Cross-platform grouping and a permanent historical archive remain future work; RSS imports cover only what each current feed exposes.

Optional future work: separate RSS endpoints for individual external sources.

Email subscribers belong to the chosen newsletter provider. Use its signup/confirmation flow, unsubscribe handling, and audience management. RSS readers follow feeds without registering email addresses. Do not silently transfer subscribers between platforms or automatically send imported historical posts as new emails. Publishing a newsletter remains an explicit editorial action.

## Information still needed

- Hashnode blog URL, if the owner wants to connect one.
- A working Substack publication feed/embed URL for embedded signup and post imports. Profile subscriptions are already linked; do not configure the redirecting subdomain as a feed.

No CMS migration, subscriber collection, or newsletter send has been performed. Medium's public feed was fetched successfully. Deployed to production on 2026-09-21: https://ashwinrachha.vercel.app/blog. Deployment dpl_G8b3nSfVE4ineD2p8ArsGvwiAYxp is Ready; both feeds and the public blog returned HTTP 200. Combined RSS contains 21 entries; portfolio RSS contains 11.

## Validation

Ten regression tests passed; `pnpm lint`, `pnpm typecheck`, and `pnpm build` passed. Generated XML parses with 11 original posts and 21 combined posts, each with unique IDs. Browser checks confirmed 10 Medium results under the source filter, external links, local article links, search, and no horizontal overflow at 390px width. Substack profile and publication configuration are unit-tested. The owner profile and Subscribe button were verified publicly; feed/embed redirects were checked. No end-to-end email enrollment was performed. No test subscription was sent.

## Official references

- [Medium RSS and paywall limitations](https://help.medium.com/hc/en-us/articles/214874118-Using-RSS-feeds-of-profiles-publications-and-topics)
- [Substack RSS](https://support.substack.com/hc/en-us/articles/360038239391-Is-there-an-RSS-feed-for-my-publication)
- [Substack signup embed](https://support.substack.com/hc/en-us/articles/360041759232-Can-I-embed-a-signup-form-for-my-Substack-publication)
- [Ghost newsletters](https://ghost.org/help/delivering-emails/)
- [Ghost headless limitations](https://docs.ghost.org/jamstack/)
- [Sanity Next.js integration](https://www.sanity.io/nextjs-cms)
