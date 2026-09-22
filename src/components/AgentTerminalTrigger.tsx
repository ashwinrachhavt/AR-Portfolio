// src/components/AgentTerminalTrigger.tsx
"use client";

import { track } from "@vercel/analytics";

/**
 * Example component that tracks a custom event when the button is clicked.
 * Adjust the event name and payload to match your telemetry needs.
 */
export function AgentTerminalTrigger() {
  const executeMission = async () => {
    track("system_diagnostic_run", {
      origin: "terminal_drawer",
      privileged: true,
    });
  };

  return (
    <button onClick={executeMission} type="button" className="px-4 py-2 bg-primary text-primary-foreground rounded">
      Initialize System
    </button>
  );
}
