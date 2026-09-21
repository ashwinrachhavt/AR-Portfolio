# Resume sources and regeneration

Edit `src/content/resume.json`. All three variants select bullets from the same factual record. Generated Markdown in this folder is for review; edits to it are overwritten on regeneration.

From `AR-Portfolio`:

```sh
uv run --with reportlab==4.4.10 --with pymupdf==1.27.2.3 python scripts/build_resumes.py
```

The renderer produces three US Letter, one-page PDFs in `public/resumes/`, embeds fonts, checks page bounds and extractable text, and checks LinkedIn/GitHub link annotations. It also copies the Applied AI variant to both `public/ashwin-rachha-resume.pdf` and the original `public/ashwin_rachha_resume.pdf` URL.

- Applied AI: default for applied/founding AI roles, agent architecture, retrieval, and permissions.
- AI Product: emphasizes product delivery, team leadership, and workflow outcomes.
- Backend/Fintech: emphasizes bank integrations, APIs, authorization, underwriting, and ML infrastructure.

Source review and LinkedIn drafts live in `../../docs/career/`. The prior PDF was preserved at `../../docs/career/archive/resume-before-2026-09-20.pdf`.

The user explicitly confirmed Finally Feb 2024–Jan 2026 and Loan Labs Jan 2026–Oct 7, 2026. As of September 20, Loan Labs is current, so it reads “Jan 2026–Present.” Revisit this after the anticipated October 7 end date. A contradictory transition paragraph was excluded. Metrics marked “confirm before external use” in Notion were not used.

These PDFs use selectable text and a simple reading order; no specific applicant-tracking system has been tested. Check the application preview after uploading. Keep the canonical facts in the existing Notion career page after reviewing corrections so later CareerOS drafting can reuse them.
