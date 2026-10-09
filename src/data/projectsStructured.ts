export interface StructuredProject {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  company: string;
  role: string;
  dates: string;
  category: "Fintech" | "Agentic AI" | "ML Systems" | "EdTech / Research";
  image: string;
  summary: string;
  impact: string;
  metrics: {
    highlight: string;
    label: string;
    details?: string;
  }[];
  outcomes: string[];
  keyFeatures: string[];
  businessValue: string;
  techStack: string[];
  deepDiveUrl?: string;
  githubUrl?: string;
}

export const structuredProjects: StructuredProject[] = [
  {
    id: "lois-loan-labs",
    order: 1,
    title: "Lois — Agentic Mortgage Workflows",
    subtitle: "LangGraph-powered agent system on Amazon Bedrock AgentCore for document processing and lender policy validation",
    company: "Loan Labs",
    role: "Applied AI Engineer",
    dates: "Jan 2026–Present",
    category: "Agentic AI",
    image: "/images/projectsAR/6AR.png",
    summary:
      "Re-architected Lois from legacy one-off Ruby LLM calls into a resilient LangGraph agentic system hosted on Amazon Bedrock AgentCore, automating mortgage document classification, lender-specific renaming, and loan policy validation.",
    impact:
      "Automated mortgage file indexing and validation across pilot workflows, cutting file intake processing time from hours to under two minutes while maintaining strict tenant-scoped fail-closed security.",
    metrics: [
      { highlight: "-85%", label: "DOCUMENT CYCLE TIME", details: "Intake and classification under 2 minutes" },
      { highlight: "7+", label: "CLOUD WORKFLOWS", details: "Google Drive, Box, Salesforce, HubSpot, OneDrive" },
      { highlight: "FSM", label: "DETERMINISTIC AGENT", details: "LangGraph state machine on Bedrock AgentCore" },
    ],
    outcomes: [
      "Transitioned unstructured Ruby LLM scripts into a typed, deterministic LangGraph agentic state machine",
      "Architected fail-closed authorization for Composio tools with granular write/send/merge/archive privileges",
      "Integrated document pipelines across Google Drive, Box, Salesforce, HubSpot, Pipedrive, and SharePoint",
      "Built borrower email intake and conversational in-product agent workflows in LoanOS",
      "Standardized AI delivery with Linear/Notion context linking and automated test-driven reviews",
    ],
    keyFeatures: [
      "LangGraph cyclic agent state machine on Amazon Bedrock AgentCore",
      "Fail-closed Composio authorization layer with explicit tool allowlists",
      "Lender-specific rule engine for intelligent document renaming and schema alignment",
      "Multi-cloud storage connector for synchronized document verification",
      "Borrower conversational intake APIs built with Ruby on Rails and Python",
    ],
    businessValue:
      "Dramatically eliminated manual loan-officer document handling toil, ensuring strict lender compliance and accelerated loan closing velocity.",
    techStack: ["LangGraph", "Amazon Bedrock", "AgentCore Runtime", "Python", "Ruby on Rails", "Composio", "AWS", "Docker"],
    deepDiveUrl: "/blog/lois-mortgage-agent",
    githubUrl: "https://github.com/AshwinRachha",
  },
  {
    id: "classify-ai",
    order: 2,
    title: "Classify AI — 50K+ Daily Transaction Engine",
    subtitle: "Hybrid semantic retrieval and LLM-assisted categorization reducing manual bookkeeping by ~80%",
    company: "Finally",
    role: "AI Product Engineer / Tech Lead",
    dates: "Feb 2024–Jan 2026",
    category: "Fintech",
    image: "/images/projectsAR/2AR.jpg",
    summary:
      "Led a team of three engineers taking Classify AI from early prototype to production. Built a high-throughput transaction classification system processing over 50,000 transactions daily using hybrid retrieval (Pinecone + Elasticsearch) and merchant enrichment.",
    impact:
      "Processed 50,000+ financial transactions daily with ~80% reduction in manual bookkeeper categorization toil, accelerating first-month close cycles from 4+ months down to ~2 weeks.",
    metrics: [
      { highlight: "50K+", label: "TRANSACTIONS / DAY", details: "Continuous real-time ingestion & categorization" },
      { highlight: "~80%", label: "MANUAL TOIL REDUCED", details: "Routine expenses auto-classified with high confidence" },
      { highlight: "4mo → 2wk", label: "FIRST-MONTH CLOSE", details: "Accelerated historical onboarding" },
      { highlight: "3 Eng", label: "TECH LEADERSHIP", details: "Guided 3 engineers from prototype to production" },
    ],
    outcomes: [
      "Built retrieval-augmented categorization combining historical transactions, merchant data, and custom charts of accounts",
      "Scaled Django, Celery, and Redis pipeline to handle asynchronous peaks exceeding 100 transactions per second",
      "Architected automated Plaid/Teller bank ingestion, OCR statement parsing, and QuickBooks reconciliation push",
      "Established W&B telemetry, automated regression suites, and confidence thresholds for human-in-the-loop review",
    ],
    keyFeatures: [
      "Hybrid retrieval: Pinecone dense vector embeddings + Elasticsearch BM25 text match",
      "Merchant token cleaning and semantic normalization pipeline",
      "Custom Chart of Accounts mapping per client tenant",
      "Calibrated confidence thresholding: auto-post vs human bookkeeper review queue",
      "Direct two-way synchronization with QuickBooks Online",
    ],
    businessValue:
      "Enabled Finally to scale bookkeeping customers 10x without linearly scaling bookkeeping headcount, directly boosting gross margins.",
    techStack: ["Python", "Django", "LangChain", "Pinecone", "Elasticsearch", "Redis", "Celery", "PostgreSQL", "W&B"],
    deepDiveUrl: "/blog/classify-ai",
  },
  {
    id: "cash-based-underwriting",
    order: 3,
    title: "Cash-Based Underwriting Engine",
    subtitle: "Real-time credit risk modeling using 90-day bank balance reconstruction and volatility scoring",
    company: "Finally",
    role: "AI Product Engineer / Tech Lead",
    dates: "2024–2025",
    category: "Fintech",
    image: "/images/projectsAR/3AR.jpg",
    summary:
      "Engineered automated cash-based underwriting for Finally's corporate card product, replacing stale traditional credit reports with 90 days of continuous bank transaction data, daily-balance reconstruction, and cash-volatility scoring.",
    impact:
      "Underwrote and deployed $3M+ in corporate credit across 50+ high-growth companies within approximately three months, achieving zero credit defaults during the initial cohort rollout.",
    metrics: [
      { highlight: "$3M+", label: "CREDIT UNDERWRITTEN", details: "Deployed across 50+ businesses in ~3 months" },
      { highlight: "90 Days", label: "HISTORICAL DEPTH", details: "Continuous daily-balance reconstruction" },
      { highlight: "Weekly", label: "RECALCULATION", details: "Automated limit adjustments based on burn volatility" },
      { highlight: "0%", label: "DEFAULT RATE", details: "Zero default during initial rollout period" },
    ],
    outcomes: [
      "Engineered daily-balance reconstruction algorithm handling irregular bank syncs, pendings, and reversals",
      "Built statistical Z-score cash volatility engine to forecast runway and safe debt-service limits",
      "Created automated weekly recalculation pipelines that adjust credit limits with audit logging",
      "Designed early-warning automated triggers for sudden balance drops (>40%) and overdraft alerts",
      "Implemented a secure admin dashboard enabling credit underwriters to inspect decisions and apply manual overrides",
    ],
    keyFeatures: [
      "90-day daily cash balance reconstruction & reconciliation",
      "Z-score burn volatility & runway stress-testing engine",
      "Weekly automated limit recalculation with cron and Celery queues",
      "Comprehensive compliance audit logs and manual override controls",
      "Direct integration with Plaid and Teller normalized bank feeds",
    ],
    businessValue:
      "Unlocked corporate card financing for venture-backed and bootstrapped companies lacking multi-year tax returns, while keeping risk strictly bounded by real liquidity.",
    techStack: ["Python", "Django", "PostgreSQL", "Redis", "Celery", "Plaid", "Teller", "NumPy", "Docker"],
    deepDiveUrl: "/blog/cash-based-underwriting",
  },
  {
    id: "gurukul-thesis",
    order: 4,
    title: "Gurukul — LLM CS Education & Master's Thesis",
    subtitle: "Adaptive learning environment with Socratic guardrails and RAG (Virginia Tech M.S., 130+ citations)",
    company: "Virginia Tech",
    role: "Graduate Researcher / Master's Thesis",
    dates: "2021–2024",
    category: "EdTech / Research",
    image: "/images/projectsAR/1AR.jpg",
    summary:
      "Designed, implemented, and empirically evaluated Gurukul, an adaptive computer-science learning environment incorporating Large Language Models, Retrieval-Augmented Generation, and Socratic guardrails to guide student programming without leaking direct solutions.",
    impact:
      "Formed the core of my Master's Thesis at Virginia Tech (4.0/4.0 GPA), cited 130+ times on Google Scholar, and published in IEEE Frontiers in Education (FIE 2024) and IEEE SoutheastCon 2023.",
    metrics: [
      { highlight: "130+", label: "ACADEMIC CITATIONS", details: "Recognized in AI in Education & CS pedagogy" },
      { highlight: "4.0 / 4.0", label: "M.S. THESIS GPA", details: "Virginia Tech Computer Science" },
      { highlight: "2 Papers", label: "IEEE PUBLICATIONS", details: "IEEE FIE 2024 & IEEE SoutheastCon 2023" },
      { highlight: "3-Tier", label: "SOCRATIC HINTS", details: "Calibrated scaffolding preventing code leakage" },
    ],
    outcomes: [
      "Created AST-based code analysis combined with RAG to diagnose student misconceptions in algorithms",
      "Engineered multi-level hint scaffolding: conceptual guidance, algorithmic direction, and partial pseudocode",
      "Enforced strict guardrails blocking direct answer generation and academic dishonesty",
      "Conducted user study evaluating learning gain and self-efficacy across student cohorts",
    ],
    keyFeatures: [
      "Adaptive Socratic dialogue system with Bloom's taxonomy alignment",
      "Multi-stage hint ladder preventing code completion leakage",
      "Retrieval-augmented instruction grounded in verified course syllabi and test cases",
      "Real-time AST code verification and syntax error diagnostics",
      "Open-source Python & React platform codebase",
    ],
    businessValue:
      "Demonstrated how generative AI can be transformed from a homework-cheating hazard into a rigorous, pedagogically sound personalized tutor.",
    techStack: ["Python", "FastAPI", "Transformers", "LangChain", "React", "Docker", "PyTorch", "AST Engine"],
    deepDiveUrl: "/blog/gurukul-thesis",
    githubUrl: "https://github.com/ashwinrachha786/Gurukul_v2",
  },
  {
    id: "finally-banking-infra",
    order: 5,
    title: "Reusable Banking Infrastructure",
    subtitle: "Encrypted token lifecycle, Plaid/Teller webhooks, and provider-normalized transaction sync",
    company: "Finally",
    role: "AI Product Engineer / Tech Lead",
    dates: "2024–2025",
    category: "Fintech",
    image: "/images/projectsAR/4AR.jpg",
    summary:
      "Architected Finally's core banking integration layer, standardizing account linking, encrypted token storage, background sync webhooks, and normalized transaction feeds across Plaid and Teller.",
    impact:
      "Connected and continuously synchronized thousands of business checking and credit accounts, providing the rock-solid foundation for both Classify AI and Cash-Based Underwriting.",
    metrics: [
      { highlight: "50+", label: "BUSINESSES CONNECTED", details: "Checking and credit accounts", },
      { highlight: "2 Providers", label: "PLAID & TELLER", details: "Unified normalized financial schema" },
      { highlight: "AES-256", label: "TOKEN ENCRYPTION", details: "Zero-knowledge token security architecture" },
    ],
    outcomes: [
      "Built provider-agnostic data normalization schema handling conflicting transaction states and pending items",
      "Implemented encrypted access-token vault with automated rotation and revoked-session invalidation",
      "Designed asynchronous webhook ingestion handling sudden volume spikes during bank settlement windows",
    ],
    keyFeatures: [
      "Unified bank schema abstraction over Plaid and Teller APIs",
      "Encrypted token storage with KMS-backed keys",
      "Idempotent webhook handler with dead-letter queue recovery",
      "Statement PDF retrieval and automated OCR preparation",
    ],
    businessValue:
      "Eliminated single-provider dependency, reduced bank connection drop-offs, and created a unified ledger contract across all Finally fintech products.",
    techStack: ["Python", "Django", "PostgreSQL", "Plaid API", "Teller API", "Redis", "Celery", "AWS KMS"],
    deepDiveUrl: "/work/finally",
  },
  {
    id: "unar-labs-accessibility",
    order: 6,
    title: "Accessibility ML Vision & Speech Platform",
    subtitle: "Computer vision and NLP data pipelines for visually impaired users deployed on GCP",
    company: "UNAR Labs",
    role: "Machine Learning Engineer",
    dates: "Jun 2023–Aug 2023",
    category: "ML Systems",
    image: "/images/projectsAR/5AR.jpg",
    summary:
      "Developed accessibility-focused backend and computer vision pipelines for visually impaired users using OpenCV, PyTorch, Transformers, and FastAPI containerized on GCP.",
    impact:
      "Delivered low-latency image captioning and tactile object detection pipelines, enhancing assistive technology accessibility for visually impaired individuals.",
    metrics: [
      { highlight: "<150ms", label: "PROCESSING LATENCY", details: "Real-time edge & cloud inference" },
    ],
    outcomes: [
      "Engineered automated preprocessing and feature extraction pipelines for document and scene understanding",
      "Containerized PyTorch inference services using Docker on Google Cloud Platform",
      "Integrated Hugging Face Transformer models into high-performance FastAPI asynchronous endpoints",
    ],
    keyFeatures: [
      "OpenCV scene segmentation and contour detection",
      "Transformer-based image captioning and text extraction",
      "Dockerized microservice deployment on GCP",
    ],
    businessValue:
      "Provided critical accessible data infrastructure enabling non-sighted users to interpret complex graphical and spatial documents.",
    techStack: ["Python", "PyTorch", "OpenCV", "Transformers", "FastAPI", "Docker", "GCP", "Hugging Face"],
    deepDiveUrl: "/work/unar",
  },
  {
    id: "outreach-ml-platform",
    order: 7,
    title: "NLP Inference & Triton Serving Platform",
    subtitle: "High-throughput ML platform using PySpark, MLflow, ONNX, and NVIDIA Triton on GKE",
    company: "Outreach",
    role: "ML Platform Engineer Intern",
    dates: "May 2022–Aug 2022",
    category: "ML Systems",
    image: "/images/projectsAR/2AR.jpg",
    summary:
      "Built reusable NLP model serving and deployment infrastructure using PySpark, MLflow, ONNX runtimes, and NVIDIA Triton Inference Server deployed on Google Kubernetes Engine (GKE).",
    impact:
      "Reduced model serving latency to sub-20ms and enabled standardized CI/CD deployment pipelines for enterprise sales intelligence models.",
    metrics: [
      { highlight: "<20ms", label: "INFERENCE LATENCY", details: "Sub-20ms P95 with NVIDIA Triton ONNX engine" },
      { highlight: "GKE", label: "CONTAINER ORCHESTRATION", details: "Auto-scaling microservices architecture" },
    ],
    outcomes: [
      "Built automated PySpark pipelines for large-scale enterprise communication preprocessing",
      "Converted custom NLP Transformer models to ONNX and configured multi-model Triton dynamic batching",
      "Created Go and Python microservices with comprehensive unit tests and automated CI/CD",
    ],
    keyFeatures: [
      "NVIDIA Triton Inference Server with dynamic batching and GPU acceleration",
      "ONNX model optimization and quantization pipelines",
      "Distributed PySpark data processing and MLflow experiment tracking",
      "Go microservice gateway with gRPC communication",
    ],
    businessValue:
      "Standardized ML engineering across the organization, accelerating time-to-market for NLP features from weeks to hours.",
    techStack: ["Python", "Go", "PySpark", "MLflow", "ONNX", "NVIDIA Triton", "Docker", "Kubernetes", "GKE"],
    deepDiveUrl: "/work/outreach",
  },
];
