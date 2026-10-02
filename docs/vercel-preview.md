# Vercel pull request previews

Connect the repository to Vercel using the native Git integration and every pull request will receive a Vercel Preview deployment. Vercel builds the exact pull-request commit, exposes the deployment URL in GitHub, and updates the deployment as new commits are pushed.

## One-time repository setup

1. In Vercel, choose **Add New → Project → Import Git Repository** and select `ashwinrachhavt/AR-Portfolio`.
2. Set the production branch to `main`.
3. Leave **Preview Deployments** enabled for all other branches and pull requests.
4. Configure the project’s Preview environment variables as described below.

Vercel’s native Git integration handles the build and adds the preview URL to the pull request. No Vercel token or GitHub Actions secret needs to be committed to this repository.

## Preview environment variables

The workflow runs `vercel pull --environment=preview`, so Vercel Preview variables are loaded during the build. Configure them in **Vercel → Project Settings → Environment Variables**, with the **Preview** target selected.

For this project, the usual preview values are:

- `NOTION_API_KEY` and `NOTION_DATABASE_ID` for the remote blog archive
- `OPENAI_API_KEY` and `WORKFLOW_LAB_MODEL` for the Workflow Readiness Lab, if live generation is enabled in previews
- `CAREER_FIT_PROVIDER`, `CAREER_FIT_LIVE_ENABLED`, and the provider credential only when testing live Career Fit behavior
- `SITE_URL` set to the preview domain only when a feature needs an absolute URL

Keep secrets in Vercel or GitHub. Do not commit `.env` files or use `NEXT_PUBLIC_` for server-only credentials. The checked-in `.env.example` remains a local reference and is not loaded by the workflow.

## Local verification

Vercel uses the same commands as the project documentation:

```bash
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm build
```
