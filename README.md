This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

Use pnpm for this project. Add these values to an ignored `.env` file in the project root:

```dotenv
NOTION_API_KEY=your-notion-integration-secret
NOTION_DATABASE_ID=your-command-center-database-id
```

Share the Command Center database with that integration. The blog lists all entries whose `Status` select is `Blogs`; article requests are restricted to that group. Keep credentials out of Git. Configure both variables in the hosting environment as well when deploying.

The blog index and articles render on the server and are prerendered at build time, so both Notion variables must be available during the build. Successful Notion responses and rendered pages are cached for five minutes, then refreshed in the background on demand. A failed background refresh retains the last successful version. New or edited posts become visible after a successful refresh; removing a post can take up to the cache refresh window. Article links prefetch on hover, focus, or touch, respecting the browser's data-saving preference. Search and topic filters run locally on a small list of public fields.

Run `pnpm lint`, `pnpm typecheck`, and `pnpm build` to validate the app. On Node 24+, `node --test src/lib/*.test.mjs` also checks Notion access boundaries, pagination, nested content, metadata, and filtering.

Then run the development server:

```bash
pnpm dev --port 3000
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
