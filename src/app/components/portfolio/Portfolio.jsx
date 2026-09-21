import career from "../../../content/resume.json";
import PermissionExplorer from "./PermissionExplorer";
import styles from "../../portfolio.module.css";

function Arrow({ diagonal = false }) {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={diagonal ? "M6 18 18 6M6 6h12v12" : "M4 12h16m-6-6 6 6-6 6"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function CaseStudy({ number, company, title, children, tags }) {
  return <article className={styles.caseStudy}>
    <div className={styles.caseIndex}><span>{number}</span><span>{company}</span></div>
    <div className={styles.caseBody}><h3>{title}</h3>{children}<p className={styles.stack}>{tags}</p></div>
  </article>;
}

export default function Portfolio() {
  return (
    <div className={styles.portfolio}>
      <a className={styles.skipLink} href="#main">Skip to content</a>
      <header className={styles.header}>
        <a href="#main" className={styles.wordmark}>Ashwin Rachha<span className={styles.wordmarkDot}>.</span></a>
        <nav aria-label="Main navigation"><a href="#work">Work</a><a href="#experience">Experience</a><a href="https://medium.com/@ashwin_rachha">Writing</a><a href="#contact" className={styles.navContact}>Let’s talk <Arrow diagonal /></a></nav>
      </header>
      <main id="main">
        <section className={styles.hero} aria-labelledby="hero-title">
          <div className={styles.heroMain}>
            <h1 id="hero-title">AI systems for<br />the <em>real world.</em></h1>
            <p className={styles.heroIntro}>I’m Ashwin, an applied AI engineer. I turn complex financial workflows into products people can use—and systems they can trust.</p>
            <div className={styles.actions}><a className={styles.primaryButton} href="/ashwin-rachha-resume.pdf" download>Download resume <Arrow /></a><a className={styles.textLink} href="#work">Explore my work <Arrow diagonal /></a></div>
          </div>
          <aside className={styles.heroNote} aria-label="My approach">
            <div className={styles.noteTop}><span>A way of working</span><span aria-hidden="true">01—03</span></div>
            <ol className={styles.approach}>
              <li><span>01</span><div><strong>Understand the workflow.</strong><p>The documents, the people, the messy handoffs.</p></div></li>
              <li><span>02</span><div><strong>Build the whole system.</strong><p>Models, APIs, interfaces, and the paths between them.</p></div></li>
              <li><span>03</span><div><strong>Make the boundaries explicit.</strong><p>Permissions, review, and control over what happens next.</p></div></li>
            </ol>
            <a href="#thinking">See an engineering decision <Arrow diagonal /></a>
          </aside>
          <div className={styles.heroFoot}><span>Applied AI · Backend systems · Product ownership</span><span>Loan Labs / Previously Finally</span></div>
        </section>
        <section className={styles.proof} aria-label="Selected outcomes at Finally">
          <p>From my work<br /><strong>at Finally</strong></p>
          <div><strong>50K+</strong><span>transactions processed daily</span></div>
          <div><strong>~80%</strong><span>less manual categorization</span></div>
          <div><strong>4+ months → ~2 weeks</strong><span>first-month close · team outcome</span></div>
        </section>
        <section id="work" className={styles.work} aria-labelledby="work-title">
          <div className={styles.sectionHeading}><h2 id="work-title">Built with purpose.</h2><p>Selected work, from the problem<br />to the engineering decisions.</p></div>
          <CaseStudy number="01" company="Loan Labs · 2026" title="Giving mortgage workflows an agent that can act." tags="LangGraph / Bedrock AgentCore / Rails APIs / Composio">
            <p>Loan files move through disconnected tools, inconsistent document names, and lender-specific requirements. I built Lois to work across those boundaries.</p>
            <div className={styles.caseColumns}><div><h4>What I built</h4><p>An agentic system that classifies documents, applies lender naming templates, and checks policies—with borrower email intake and an in-product conversational interface.</p></div><div><h4>The decision that mattered</h4><p>Permission checks at execution time. Tenant- and owner-scoped access, separate action permissions, and blocked deletes give useful agents explicit limits.</p></div></div>
            <div className={styles.outcome}><span>Delivered</span><p>Lois shipped into internal and pilot workflows.</p></div>
            <a className={styles.textLink} href="#thinking">Explore the permission model <Arrow /></a>
          </CaseStudy>
          <CaseStudy number="02" company="Finally · 2024–2026" title="From a bookkeeping prototype to 50,000+ transactions a day." tags="Python / Django / LangChain / Pinecone / Elasticsearch / Plaid / Teller">
            <p>As Finally’s first AI Product Engineer, I led a three-engineer team taking Classify AI into production. The challenge extended well beyond transaction classification.</p>
            <div className={styles.caseColumns}><div><h4>What I built</h4><p>Retrieval-augmented bookkeeping, reusable bank connections, statement processing, reconciliation, and cash-based underwriting.</p></div><div><h4>The decision that mattered</h4><p>Use enriched transaction history and deterministic merchant matching first; bring in an LLM for lower-confidence cases. Connect the data flow all the way through to accounting.</p></div></div>
            <div className={styles.outcome}><span>Outcome</span><p>~80% less manual categorization. Helped reduce first-month close from 4+ months to ~2 weeks.</p></div>
          </CaseStudy>
          <CaseStudy number="03" company="Virginia Tech · Research" title="Helping students think through a problem, one step at a time." tags="RAG / Guardrails / Django / Next.js / CS Education">
            <p>Gurukul grew from my master’s research into an adaptive environment for learning data structures and algorithms. The focus: guide problem-solving while keeping the student engaged in the reasoning.</p>
            <div className={styles.caseColumns}><div><h4>What I built</h4><p>A learning platform with a code editor, LLM-assisted tutoring, retrieval, and guardrails for structured learning paths.</p></div><div><h4>Research foundation</h4><p>M.S. in Computer Science, Virginia Tech, 4.0 GPA. Related research at IEEE FIE 2024 and IEEE SouthEastCon 2023.</p></div></div>
            <div className={styles.actions}><a className={styles.textLink} href={career.research.thesis}>Read the thesis <Arrow diagonal /></a><a className={styles.textLink} href={career.research.code}>Explore the code <Arrow diagonal /></a></div>
          </CaseStudy>
        </section>
        <section id="thinking" className={styles.thinking} aria-labelledby="thinking-title">
          <div className={styles.thinkingIntro}><span className={styles.sectionLabel}>An engineering decision</span><h2 id="thinking-title">A good agent knows<br />when to <em>stop.</em></h2><p>Discovering a tool is only the beginning. Before acting, an agent needs to check whether that action is still permitted.</p><p>This simplified example illustrates the authorization principles I used at Loan Labs. Change a condition to see what happens.</p></div>
          <PermissionExplorer />
        </section>
        <section id="experience" className={styles.experience} aria-labelledby="experience-title">
          <div className={styles.sectionHeading}><h2 id="experience-title">The path so far.</h2><a className={styles.textLink} href="/ashwin-rachha-resume.pdf">Full resume <Arrow diagonal /></a></div>
          <div className={styles.timeline}>{career.roles.map(role => <div key={role.id} className={styles.timelineRow}><span>{role.dates}</span><h3>{role.company}</h3><p>{role.title}</p></div>)}</div>
          <div className={styles.researchNote}><p><strong>Virginia Tech</strong> · M.S. Computer Science, Thesis · 4.0/4.0</p><p><strong>PICT</strong> · B.E. Computer Science</p></div>
        </section>
        <section className={styles.writing} aria-labelledby="writing-title"><div><span className={styles.sectionLabel}>Notes from the work</span><h2 id="writing-title">Build. Learn. Write it down.</h2></div><p>I write about LLM applications, machine learning, and the engineering behind useful software.</p><a className={styles.textLink} href="https://medium.com/@ashwin_rachha">Read on Medium <Arrow diagonal /></a></section>
        <section id="contact" className={styles.contact} aria-labelledby="contact-title"><div><h2 id="contact-title">Have a hard problem<br /><em>worth building for?</em></h2><p>I’m exploring applied AI, founding AI engineer, and AI product roles. Especially teams building AI-native products and financial software.</p><p className={styles.locations}>Interested in Los Angeles, the Bay Area, and San Diego.</p></div><div className={styles.contactActions}><a className={styles.primaryButton} href={`mailto:${career.email}`}>Let’s start a conversation <Arrow diagonal /></a><a className={styles.textLink} href={career.linkedin}>Connect on LinkedIn <Arrow diagonal /></a><a className={styles.textLink} href={career.github}>Explore GitHub <Arrow diagonal /></a></div></section>
        <section className={styles.resumeChoices} aria-label="Resume versions"><span>A resume for your role</span><a href="/resumes/ashwin-rachha-applied-ai.pdf" download>Applied AI <Arrow /></a><a href="/resumes/ashwin-rachha-ai-product.pdf" download>AI Product <Arrow /></a><a href="/resumes/ashwin-rachha-backend-fintech.pdf" download>Backend & Fintech <Arrow /></a></section>
      </main>
      <footer className={styles.footer}><span>Ashwin Rachha</span><a href={`mailto:${career.email}`}>{career.email}</a><a href="#main">Back to top ↑</a></footer>
    </div>
  );
}
