import "./globals.css";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "./components/theme-provider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://ashwinrachha.com"),
  title: {
    default: "Ashwin Rachha | Applied AI Engineer & AI Product Engineer",
    template: "%s | Ashwin Rachha",
  },
  description:
    "Applied AI Engineer building production agentic systems, financial infrastructure, and product workflows. M.S. Computer Science from Virginia Tech (4.0 GPA, 130+ citations).",
  keywords: [
    "Ashwin Rachha",
    "Applied AI Engineer",
    "AI Product Engineer",
    "LangGraph",
    "Amazon Bedrock AgentCore",
    "Cash Based Underwriting",
    "Classify AI",
    "Virginia Tech Computer Science",
    "Gurukul",
    "Fintech Engineering",
    "Full Stack AI",
    "Machine Learning",
    "Claude Code",
    "Codex",
  ],
  authors: [{ name: "Ashwin Rachha", url: "https://ashwinrachha.com" }],
  creator: "Ashwin Rachha",
  publisher: "Ashwin Rachha",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/images/Ashwin.png",
    apple: "/images/Ashwin.png",
  },
  alternates: {
    canonical: "https://ashwinrachha.com",
    types: { "application/rss+xml": "/feed.xml" },
  },
  openGraph: {
    title: "Ashwin Rachha | Applied AI Engineer & AI Product Engineer",
    description:
      "Production agentic AI, cash-based underwriting, and financial infrastructure. Virginia Tech M.S. (4.0 GPA, 130+ citations).",
    url: "https://ashwinrachha.com",
    siteName: "Ashwin Rachha Portfolio",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/Ashwin.png",
        width: 452,
        height: 552,
        alt: "Ashwin Rachha - Applied AI Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ashwin Rachha | Applied AI Engineer",
    description:
      "Applied AI Engineer building production agentic systems, financial infrastructure, and product workflows.",
    images: ["/images/Ashwin.png"],
    creator: "@ashwinrachha",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://ashwinrachha.com/#person",
      name: "Ashwin Rachha",
      url: "https://ashwinrachha.com",
      image: "https://ashwinrachha.com/images/Ashwin.png",
      jobTitle: "Applied AI Engineer / AI Product Engineer",
      worksFor: [
        {
          "@type": "Organization",
          name: "Loan Labs",
        },
        {
          "@type": "Organization",
          name: "Finally",
        },
      ],
      alumniOf: [
        {
          "@type": "CollegeOrUniversity",
          name: "Virginia Tech",
          sameAs: "https://www.vt.edu",
        },
        {
          "@type": "CollegeOrUniversity",
          name: "Pune Institute of Computer Technology",
          sameAs: "https://pict.edu",
        },
      ],
      sameAs: [
        "https://scholar.google.com/citations?user=opsMRzEAAAAJ",
        "https://github.com/AshwinRachha",
        "https://github.com/ashwinrachhavt",
        "https://linkedin.com/in/ashwinrachha",
        "https://medium.com/@ashwin_rachha",
      ],
      knowsAbout: [
        "Artificial Intelligence",
        "Large Language Models",
        "Agentic Systems",
        "LangGraph",
        "Amazon Bedrock",
        "Financial Underwriting",
        "Transaction Classification",
        "Retrieval-Augmented Generation",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://ashwinrachha.com/#website",
      url: "https://ashwinrachha.com",
      name: "Ashwin Rachha Portfolio",
      description: "Interactive portfolio and technical deep dives by Ashwin Rachha",
      publisher: {
        "@id": "https://ashwinrachha.com/#person",
      },
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.className} bg-background text-foreground`}>
        <ThemeProvider>{children}</ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
