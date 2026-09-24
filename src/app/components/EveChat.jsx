"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import AssistantPanel from "./AssistantPanel";
import useKnowledgeAssistant from "./useKnowledgeAssistant";

const EveSession = dynamic(() => import("./EveSession"), { loading: () => <AssistantPanel mode="loading" busy messages={[]} /> });

function SourceAssistant() {
  const search = useKnowledgeAssistant();
  return <AssistantPanel mode="sources" {...search} />;
}

export default function EveChat({ enabled = false }) {
  const [useSources, setUseSources] = useState(false);
  return enabled && !useSources ? <EveSession onUseSources={() => setUseSources(true)} /> : <SourceAssistant />;
}
