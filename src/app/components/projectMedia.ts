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
  // ---- Approved project images ----
  "cash-based-underwriting": {
    pending: false,
    src: "/images/cash_based_underwriting_architecture.png",
    alt: "Cash-based underwriting dashboard at Finally",
    objectFit: "cover",
    objectPosition: "center",
    aspectRatio: "16 / 9",
  },
  "lois-loan-labs": {
    pending: false,
    src: "/images/lois-architecture.png",
    alt: "Lois agentic loan workflow at Loan Labs",
    objectFit: "cover",
    objectPosition: "center 30%",
    aspectRatio: "16 / 9",
  },
  "classify-ai": {
    pending: false,
    src: "/images/classify_ai_architecture.png",
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