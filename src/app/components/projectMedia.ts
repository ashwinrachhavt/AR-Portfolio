export type ProjectMedium = {
  src: string;
  alt: string;
  objectFit: "cover" | "contain";
  objectPosition: string;
  aspectRatio: string;
  /** true = Ashwin hasn't uploaded the final asset yet; never substitute */
  pending?: boolean;
};

export const PROJECT_MEDIA: Record<string, ProjectMedium> = {
  // ---- Owner-pending slots (no stock / AI substitutes allowed) ----
  "cash-based-underwriting": {
    pending: true,
    src: "/projects/cash-based-underwriting.png",
    alt: "Cash-based underwriting dashboard at Finally",
    objectFit: "cover",
    objectPosition: "center",
    aspectRatio: "16 / 9",
  },
  "lois-loan-labs": {
    pending: true,
    src: "/projects/lois.png",
    alt: "Lois agentic loan workflow at Loan Labs",
    objectFit: "cover",
    objectPosition: "center 30%", // deliberate framing once uploaded
    aspectRatio: "16 / 9",
  },
  "classify-ai": {
    pending: true,
    src: "/projects/classify-ai.png",
    alt: "Classify AI transaction classification at Finally",
    objectFit: "cover",
    objectPosition: "center",
    aspectRatio: "16 / 9",
  },
  // ---- Legacy projects: keep the ORIGINAL approved images ----
  "gurukul-thesis": {
    src: "/images/projectsAR/4AR.jpg", // existing original — do not replace
    alt: "Gurukul adaptive learning environment",
    objectFit: "cover",
    objectPosition: "center",
    aspectRatio: "16 / 10",
  },
  // ...map remaining legacy projects to their current images unchanged
};