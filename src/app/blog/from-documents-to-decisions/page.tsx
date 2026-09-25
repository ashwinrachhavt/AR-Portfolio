import { Metadata } from "next";
import DecisionLabArticle from "./DecisionLabArticle";

export const metadata: Metadata = {
  title: "From Documents to Decisions | Ashwin Rachha",
  description: "Two interactive investigations into a mortgage file and a bank transaction, with Jev as an experimental decision layer. Exploring how software makes consequential judgments in ambiguous situations.",
  openGraph: {
    title: "From Documents to Decisions",
    description: "Two interactive investigations into a mortgage file and a bank transaction, with Jev as an experimental decision layer.",
    type: "article",
    publishedTime: "2026-09-25T00:00:00Z",
  },
};

export default function Page() {
  return <DecisionLabArticle />;
}
