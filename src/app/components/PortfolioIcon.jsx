export default function PortfolioIcon({ kind = "arrow", className }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {kind === "plus" ? <path d="M12 5v14M5 12h14" /> : kind === "download" ? <><path d="M12 3v12m-5-5 5 5 5-5" /><path d="M5 16v4h14v-4" /></> : <path d="M5 12h14m-6-6 6 6-6 6" />}
    </svg>
  );
}
