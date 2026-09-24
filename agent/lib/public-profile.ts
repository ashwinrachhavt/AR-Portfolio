import resume from "../../src/content/resume.json" with { type: "json" };

export function getPublicProfile() {
  return {
    name: resume.name,
    asOf: resume.asOf,
    positioning: Object.values(resume.variants).map(({ headline, summary }) => ({ headline, summary })),
    education: resume.education,
    research: resume.research,
    contact: { email: resume.email, linkedin: resume.linkedin, github: resume.github, website: resume.website },
    source: "src/content/resume.json",
  };
}

export function getPublicExperience(company?: string) {
  const needle = company?.trim().toLowerCase();
  return resume.roles
    .filter((role) => !needle || role.company.toLowerCase().includes(needle))
    .map((role) => ({ ...role, source: `src/content/resume.json#roles/${role.id}`, asOf: resume.asOf }));
}

export function getPublicMetrics() {
  const role = resume.roles.find(({ id }) => id === "finally");
  // Complete approved bullets retain team attribution and approximations.
  return ["classify", "close", "underwriting"].flatMap((key) => {
    const evidence = role?.bullets[key as keyof typeof role.bullets];
    return evidence ? [{ evidence, source: `src/content/resume.json#roles/finally/bullets/${key}`, asOf: resume.asOf }] : [];
  });
}
