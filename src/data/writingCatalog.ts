export interface CuratedArticle {
  id: string;
  title: string;
  href: string;
  date: string;
  description: string;
  categories: (
    | "Research"
    | "Work / Projects"
    | "Philosophy"
    | "AI"
    | "Startups"
    | "Personal projects"
    | "Tutorials / Blogs"
    | "Ideas / Insights"
  )[];
  tags: string[];
  sourceName: string;
  external?: boolean;
  isThesis?: boolean;
  interactive?: boolean;
}

export const curatedArticles: CuratedArticle[] = [
  {
    id: "cash-based-underwriting",
    title: "Cash-Based Underwriting: Reconstructing 90-Day Bank Data to Deploy $3M+ in Credit",
    href: "/blog/cash-based-underwriting",
    date: "2026-09-24",
    description:
      "Why traditional credit scores fail fast-growing businesses, and how we modeled daily cash volatility with Z-scores to deploy millions with zero initial defaults.",
    categories: ["Work / Projects", "Tutorials / Blogs", "Fintech" as any, "AI", "Startups"],
    tags: ["Fintech", "Risk Modeling", "Underwriting", "Python"],
    sourceName: "Interactive Technical Deep Dive",
    interactive: true,
  },
  {
    id: "lois-mortgage-agent",
    title: "Lois: Agentic Mortgage Workflows on Amazon Bedrock AgentCore",
    href: "/blog/lois-mortgage-agent",
    date: "2026-09-24",
    description:
      "From fragile Ruby prompts to a typed LangGraph state machine with fail-closed Composio authorization for loan document classification and policy validation.",
    categories: ["Work / Projects", "AI", "Startups", "Tutorials / Blogs"],
    tags: ["LangGraph", "Bedrock AgentCore", "Agentic Systems", "Mortgage Tech"],
    sourceName: "Interactive Technical Deep Dive",
    interactive: true,
  },
  {
    id: "classify-ai",
    title: "Classify AI: Scaling Financial Categorization to 50,000+ Daily Transactions",
    href: "/blog/classify-ai",
    date: "2026-09-24",
    description:
      "How we combined dense vector embeddings (Pinecone) with sparse lexical search (Elasticsearch) to reduce manual bookkeeping categorization by ~80%.",
    categories: ["Work / Projects", "AI", "Tutorials / Blogs"],
    tags: ["Pinecone", "Elasticsearch", "Hybrid RAG", "Django"],
    sourceName: "Interactive Technical Deep Dive",
    interactive: true,
  },
  {
    id: "gurukul-thesis",
    title: "Gurukul: LLM-Enhanced CS Education & Master's Thesis Research",
    href: "/blog/gurukul-thesis",
    date: "2024-05-15",
    description:
      "Master's thesis research at Virginia Tech (4.0/4.0 GPA, 130+ citations). Exploring adaptive CS learning environments with Socratic guardrails and RAG.",
    categories: ["Research", "AI", "Tutorials / Blogs"],
    tags: ["Master's Thesis", "Socratic AI", "CS Education", "Virginia Tech"],
    sourceName: "Master's Thesis Deep Dive",
    isThesis: true,
    interactive: true,
  },
  {
    id: "3b92e262-08a5-8186-942c-ff5559fe4f68",
    title: "MCP Is Moving Beyond Sessions. Here’s Why That Matters.",
    href: "/blog/3b92e262-08a5-8186-942c-ff5559fe4f68",
    date: "2026-09-22",
    description:
      "Where protocol state belongs, why request boundaries matter, and what to check before migrating an MCP server.",
    categories: ["Philosophy", "Ideas / Insights", "AI"],
    tags: ["MCP", "AI Protocols", "Systems Design"],
    sourceName: "Engineering Essay",
  },
  {
    id: "3bb2e262-08a5-80aa-b865-e905d51fa752",
    title: "Inside Buzz: How One Signed Message Becomes Work by an AI Agent",
    href: "/blog/3bb2e262-08a5-80aa-b865-e905d51fa752",
    date: "2026-09-22",
    description:
      "Follow a message through identity, permissions, an ACP bridge, and agent tools. What Buzz teaches us about collaborative human-agent workspaces.",
    categories: ["Ideas / Insights", "AI", "Philosophy"],
    tags: ["Nostr", "Agent Protocols", "Product Design"],
    sourceName: "Systems Analysis",
  },
  {
    id: "from-documents-to-decisions",
    title: "From Documents to Decisions: Exploring Automated Judgment",
    href: "/blog/from-documents-to-decisions",
    date: "2026-09-25",
    description:
      "Two interactive investigations into a mortgage file and a bank transaction, with Jev as an experimental decision layer.",
    categories: ["Work / Projects", "Philosophy", "Ideas / Insights", "AI"],
    tags: ["Decision Systems", "Fintech", "Interactive Lab"],
    sourceName: "Decision Lab Experiment",
    interactive: true,
  },
  {
    id: "ieee-xai-education",
    title: "Explainable AI in Education: Current Trends, Challenges, and Opportunities",
    href: "https://ieeexplore.ieee.org/document/10129712",
    date: "2023-04-14",
    description:
      "Comprehensive research survey on explainability and trust in AI-driven pedagogical systems. Published at IEEE SoutheastCon 2023 with 106+ citations.",
    categories: ["Research", "AI"],
    tags: ["IEEE Publication", "Explainable AI", "Citations: 106+"],
    sourceName: "IEEE SoutheastCon 2023",
    external: true,
  },
  {
    id: "ieee-fie-gurukul",
    title: "LLM-Enhanced Learning Environments for CS: Exploring Data Structures & Algorithms",
    href: "https://ieeexplore.ieee.org/document/10701198",
    date: "2024-10-18",
    description:
      "Empirical study on Socratic guardrails and learning retention for CS students. Published at the 2024 IEEE Frontiers in Education Conference (FIE).",
    categories: ["Research", "AI"],
    tags: ["IEEE FIE 2024", "Empirical Study", "CS Pedagogy"],
    sourceName: "IEEE FIE 2024",
    external: true,
  },
  {
    id: "vt-search-inverted-index",
    title: "VT Search: Inverted Index & Transformers-Based Summarization",
    href: "https://github.com/AshwinRachha/VT-Search",
    date: "2022-12-05",
    description:
      "Distributed web search and summarization engine combining inverted index postings with neural sequence summarization.",
    categories: ["Personal projects", "AI"],
    tags: ["Information Retrieval", "Transformers", "NLP"],
    sourceName: "Open Source Project",
    external: true,
  },
  {
    id: "neuralflow-productivity",
    title: "Neuralflow: Cognitive Task Management & Deep Focus Workflows",
    href: "https://github.com/AshwinRachha",
    date: "2023-08-10",
    description:
      "Full-stack productivity application uniting task execution, focus blocks, and telemetry.",
    categories: ["Personal projects", "Startups"],
    tags: ["Productivity", "Full Stack", "TypeScript"],
    sourceName: "Personal Project",
    external: true,
  },
];
