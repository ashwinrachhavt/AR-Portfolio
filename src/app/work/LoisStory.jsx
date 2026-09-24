import Link from "next/link";
import styles from "./story.module.css";

const sections = [
  ["overview", "The problem"],
  ["architecture", "Architecture"],
  ["documents", "Document workflows"],
  ["surfaces", "Product interfaces"],
  ["permissions", "Permissions"],
  ["integrations", "Integrations"],
  ["leadership", "Engineering workflow"],
  ["outcomes", "Delivery & discussion"],
];

const publicProfile = "https://github.com/ashwinrachhavt/ashwinrachhavt/blob/a52c7522c3d1fe07db598a071fab657bf649ee20/README.md#-loan-labs";

export default function LoisStory({ role, email }) {
  return <article className={styles.story}>
    <Link className={styles.backLink} href="/#work">← Selected work</Link>
    <header className={styles.hero}>
      <p className={styles.eyebrow}>{role.company} · Engineering case study</p>
      <h1>Lois<span>From loan documents<br />to agentic workflows.</span></h1>
      <p className={styles.intro}>Mortgage work spans documents, lender requirements, and connected business tools. I built the agent architecture, product interfaces, and permission boundaries that bring those pieces together in LoanOS.</p>
      <dl className={styles.facts}>
        <div><dt>My role</dt><dd>{role.title}</dd></div>
        <div><dt>When</dt><dd>{role.dates}</dd></div>
        <div><dt>Delivery context</dt><dd>{role.context}</dd></div>
      </dl>
    </header>

    <div className={styles.layout}>
      <nav className={styles.contents} aria-label="Lois case study sections">
        <p>Inside the work</p>
        <ol>{sections.map(([id, label], index) => <li key={id}><a href={`#${id}`}><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>{label}</a></li>)}</ol>
      </nav>

      <div className={styles.body}>
        <section id="overview" className={styles.section} aria-labelledby="overview-title">
          <p className={styles.eyebrow}>01 · The problem</p>
          <h2 id="overview-title">A document is only one part of the job.</h2>
          <p>A mortgage document needs to be understood in context: what kind of document it is, how a lender expects it to be named, and which policy requirements apply. That work also needs an entry point for borrowers and a way for the team to initiate actions inside the product.</p>
          <p>My work on Lois connected those concerns. It covered the transition from isolated model calls to an agentic system, Rails APIs for the agent, borrower email intake, a conversational interface, and controlled access to external CRM and document tools.</p>
          <div className={styles.callout}><h3>The engineering throughline</h3><p>Make the workflow useful from intake to action, with explicit limits on whose tools the agent can use and what it can do with them.</p></div>
        </section>

        <section id="architecture" className={styles.section} aria-labelledby="architecture-title">
          <p className={styles.eyebrow}>02 · Architecture</p>
          <h2 id="architecture-title">From one-off calls to a connected system.</h2>
          <p>{role.bullets.architecture}</p>
          <div className={styles.comparison}>
            <div><span>Starting point</span><h3>Individual Ruby LLM calls</h3><p>The model interaction was the unit of work.</p></div>
            <div><span>Re-architected system</span><h3>LangGraph on AgentCore</h3><p>Agent workflows connected document tasks with product interfaces and permission-controlled tools.</p></div>
          </div>
          <figure className={styles.system}>
            <figcaption><strong>How the pieces fit together</strong><span>A conceptual view of responsibilities, not a deployment topology.</span></figcaption>
            <ol>
              <li><span className={styles.step}>01</span><div><h3>Product entry points</h3><p>Borrower email intake · Conversation in LoanOS · Agent-facing Rails APIs</p></div></li>
              <li><span className={styles.step}>02</span><div><h3>Agent workflows</h3><p>LangGraph + Amazon Bedrock AgentCore</p><span>Classify documents · Apply lender naming · Validate policies</span></div></li>
              <li className={styles.boundary}><span className={styles.step}>03</span><div><h3>Authorization at execution</h3><p>Tenant and owner scope · Action permissions · Reviewed tool allowlists · Revocation checks</p></div></li>
              <li><span className={styles.step}>04</span><div><h3>Connected business tools</h3><p>CRM and document integrations through Composio, with delete actions blocked.</p></div></li>
            </ol>
          </figure>
          <details className={styles.detail}>
            <summary>Why the boundaries between these pieces matter</summary>
            <p>Document reasoning, product access, and authorization answer different questions. The agent determines the document task; the Rails APIs connect it to the application; the authorization layer determines whether a requested external action is permitted. Keeping those responsibilities explicit makes the system easier to reason about than treating a model response as sufficient authority to act.</p>
          </details>
        </section>

        <section id="documents" className={styles.section} aria-labelledby="documents-title">
          <p className={styles.eyebrow}>03 · Document workflows</p>
          <h2 id="documents-title">Understand it. Name it. Check it.</h2>
          <p>The document work covered three related capabilities. Each answers a different question about the same loan file.</p>
          <div className={styles.rows}>
            <div><h3>Classification</h3><div><p className={styles.question}>“What kind of document is this?”</p><p>Identify the document type so the workflow can handle it in the right context. This is the understanding step that precedes applying document-specific handling.</p></div></div>
            <div><h3>Lender-specific renaming</h3><div><p className={styles.question}>“How does this lender expect it to be named?”</p><p>Apply naming conventions tied to the lender. The same document task has to account for the destination’s requirements, rather than assume one filename convention fits every workflow.</p></div></div>
            <div><h3>Policy validation</h3><div><p className={styles.question}>“Does it meet the relevant requirements?”</p><p>Check documents against policy requirements. Recognizing a document and validating it are distinct responsibilities: knowing its type does not, by itself, establish that it satisfies a policy.</p></div></div>
          </div>
        </section>

        <section id="surfaces" className={styles.section} aria-labelledby="surfaces-title">
          <p className={styles.eyebrow}>04 · Product interfaces</p>
          <h2 id="surfaces-title">Put the agent where the work happens.</h2>
          <p>{role.bullets.surfaces}</p>
          <div className={styles.cards}>
            <div><h3>Borrower email intake</h3><p>An entry point for loan documents coming from borrowers. It connects the document workflow to the way material arrives.</p></div>
            <div><h3>Conversation in LoanOS</h3><p>An in-product interface for handling loan documents and initiating agent actions, keeping the interaction within the loan workflow.</p></div>
            <div><h3>Agent-facing Rails APIs</h3><p>The application interface for the agent. This work connected the agentic system to the existing Rails product.</p></div>
          </div>
          <details className={styles.detail}>
            <summary>Why this work extended beyond the agent itself</summary>
            <p>An agent needs a usable path into the workflow. Intake provides that path for incoming documents; the conversational interface provides it for users initiating work; APIs provide it for the system. My contribution covered all three surfaces alongside the agent architecture.</p>
          </details>
        </section>

        <section id="permissions" className={styles.section} aria-labelledby="permissions-title">
          <p className={styles.eyebrow}>05 · Permissions</p>
          <h2 id="permissions-title">An available tool is not permission to use it.</h2>
          <p>{role.bullets.permissions}</p>
          <p>Fail-closed authorization means an action needs valid permission to proceed. The checks covered identity and ownership, the kind of action being requested, the tools exposed to the agent, and whether access was still valid when the tool executed.</p>
          <dl className={styles.guards}>
            <div><dt>Tenant and owner scope</dt><dd>Constrain access to the relevant tenant and connection owner. A connected service is not a shared pool of authority across users or tenants.</dd></div>
            <div><dt>Separate action permissions</dt><dd>Write, send, merge, and archive have distinct permissions. Permission for one operation does not automatically grant the others.</dd></div>
            <div><dt>Reviewed tool allowlists</dt><dd>Limit the tools made available for use. An integration’s broader capabilities do not define what the agent is allowed to invoke.</dd></div>
            <div><dt>Execution-time checks</dt><dd>Check access when the action runs, including invalidating access that has been revoked since tool discovery.</dd></div>
            <div><dt>Blocked delete actions</dt><dd>Keep deletion outside the permitted action set across the connected CRM and document workflows.</dd></div>
          </dl>
          <details className={styles.detail}>
            <summary>Walk through an example: access revoked after discovery</summary>
            <p>Imagine the agent discovers a document tool while a connection is authorized. Before the action executes, that access is revoked. A check performed only during discovery would describe an earlier state. The execution-time check invalidates the revoked access, so the earlier discovery cannot authorize the later action.</p>
            <p className={styles.caption}>Illustrative scenario explaining the permission design.</p>
          </details>
          <details className={styles.detail}>
            <summary>Walk through an example: write permission versus sending</summary>
            <p>A connection with write permission should not gain send permission merely because both actions are available from the same provider. Separating write, send, merge, and archive makes the requested operation part of the authorization decision. Delete remains blocked.</p>
            <p className={styles.caption}>Illustrative scenario explaining the action boundaries.</p>
          </details>
        </section>

        <section id="integrations" className={styles.section} aria-labelledby="integrations-title">
          <p className={styles.eyebrow}>06 · Integrations</p>
          <h2 id="integrations-title">Connect the tools. Carry the boundaries with them.</h2>
          <p>{role.bullets.integrations}</p>
          <div className={styles.cards}>
            <div><h3>Documents and files</h3><ul><li>Google Drive</li><li>Box</li><li>OneDrive</li><li>SharePoint</li></ul></div>
            <div><h3>Customer relationships</h3><ul><li>Salesforce</li><li>HubSpot</li><li>Pipedrive</li></ul></div>
            <div><h3>Access controls</h3><p>Composio integrations with scoped ownership, reviewed tool access, individual action permissions, and execution-time authorization.</p></div>
          </div>
          <p>The engineering work included both connectivity and control. A successful connection establishes that a service is available; scoped permissions determine how the agent can use it in a particular workflow.</p>
        </section>

        <section id="leadership" className={styles.section} aria-labelledby="leadership-title">
          <p className={styles.eyebrow}>07 · Engineering workflow</p>
          <h2 id="leadership-title">Give AI-assisted delivery the product context.</h2>
          <p>{role.bullets.leadership}</p>
          <ol className={styles.delivery}>
            <li><h3>Start with product context</h3><p>Connect the work to the requirements and decisions captured in Linear and Notion.</p></li>
            <li><h3>Make the technical approach explicit</h3><p>Link that context to technical specifications so implementation has a concrete engineering direction.</p></li>
            <li><h3>Bring in shared company knowledge</h3><p>Make the wider project context part of the AI-assisted delivery workflow.</p></li>
            <li><h3>Keep senior-engineer review in the loop</h3><p>Pair AI-assisted implementation with code review by senior engineers.</p></li>
          </ol>
          <p>This was a contribution to how the team built software as well as to Lois itself: connecting product intent, implementation context, and engineering review.</p>
        </section>

        <section id="outcomes" className={styles.section} aria-labelledby="outcomes-title">
          <p className={styles.eyebrow}>08 · Delivery & discussion</p>
          <h2 id="outcomes-title">A system for internal and pilot workflows.</h2>
          <p>The work brought together document classification, lender-specific renaming, policy validation, borrower email intake, agent-facing APIs, and conversation in LoanOS. The connected workflows included explicit authorization boundaries for CRM and document tools.</p>
          <div className={styles.callout}><h3>My contribution</h3><p>Agent re-architecture, Rails APIs, email intake, the in-product conversational interface, integration authorization, and an AI-assisted engineering workflow with senior-engineer review.</p></div>
          <h3 className={styles.subheading}>Good places to go deeper</h3>
          <ul className={styles.prompts}>
            <li>Moving an existing product from individual model calls to agent workflows.</li>
            <li>Designing authorization when access can change between tool discovery and execution.</li>
            <li>Connecting agent infrastructure to the interfaces people use every day.</li>
          </ul>
          <div className={styles.actions}>
            <a className={styles.primaryLink} href={`mailto:${email}?subject=Let%E2%80%99s%20talk%20about%20Lois`}>Talk through the engineering ↗</a>
            <Link href="/fit#main">Map this work to your role →</Link>
          </div>
          <aside className={styles.sources} aria-label="Case study sources">
            <h3>Further reading</h3>
            <p><a href="/ashwin_rachha_resume.pdf">Career résumé ↗</a><a href={publicProfile}>Public project summary ↗</a></p>
          </aside>
        </section>
      </div>
    </div>
  </article>;
}
