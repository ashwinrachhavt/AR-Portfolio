# Lois case study

The detailed public story at `/work/loan-labs` is rendered by `src/app/work/LoisStory.jsx`. `src/content/resume.json` remains authoritative for the role, dates, delivery context, and career claims. The component reads all five Loan Labs bullets directly from that file and preserves their anchor IDs for Jev evidence links.

Supporting source: the Loan Labs section of the public profile README, checked against commit `a52c7522c3d1fe07db598a071fab657bf649ee20` on September 24, 2026. Its five Loan Labs claims agree with the canonical résumé. The page links to this immutable version rather than fetching a README during a visitor request.

The architecture figure explains responsibilities; it is explicitly not a deployment topology. Expandable permission scenarios are illustrative explanations of the approved authorization design, not reports of production incidents. Descriptions of why classification, naming, validation, interfaces, and authorization matter are explanatory context. The page adds no customer counts, accuracy, latency, financial outcomes, or deployment claims beyond internal and pilot workflows.

When expanding this story, reconcile new career claims with the résumé first. Private operational material, borrower data, recruiter correspondence, and work-authorization notes are not source material for this page or the public agent. Editing this page does not automatically add new facts to Jev’s approved evidence snapshot.
