import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import HomepageHero from '@site/src/components/HomepageHero';

export default function Home(): ReactNode {
  return (
    <Layout
      title="Diana Payton"
      description="Documentation systems consultant and technical writer. I help teams build processes that produce documentation agents can trust — not just access.">
      <HomepageHero />
      <section style={{padding: '3rem 0'}}>
        <div className="container">
          <h2>What is this site?</h2>
          <p>
            This site is a working documentation pipeline. It's not a static collection of samples —
            every change goes through automated quality checks before it ships.
          </p>
          <p>
            It demonstrates what a production-ready documentation system looks like: one that catches
            problems early, scales with a growing team, and produces content that works for both human
            readers and AI agents.
          </p>
          <h3>The workflow</h3>
          <p>Each pull request runs four automated checks:</p>
          <ul>
            <li><strong>Style</strong> — Vale enforces writing standards using custom rules</li>
            <li><strong>Spelling</strong> — codespell scans all source files for errors</li>
            <li><strong>Links</strong> — Lychee flags broken links before they reach production</li>
            <li><strong>Accuracy</strong> — Doc Detective tests that documented steps still match the product</li>
          </ul>
          <p>
            The pipeline also includes Claude Code skills — agentic workflows that automate
            repetitive tasks like starting the dev server, running checks, and scaffolding new posts.
          </p>
          <p>
            The site also includes an <Link to="/showcase-site/api">API reference sample</Link> built
            with OpenAPI 3.1 and a <a href="/showcase-site/llms.txt">llms.txt</a> file that structures
            content for AI agents.
          </p>
          <p>
            <Link to="/docs/intro">See how the pipeline works →</Link>
          </p>
        </div>
      </section>
    </Layout>
  );
}
