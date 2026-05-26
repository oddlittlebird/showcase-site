import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import SocialCards from '@site/src/components/SocialCards';

export default function About(): ReactNode {
  return (
    <Layout
      title="About"
      description="About Diana Payton — documentation systems consultant and technical writer.">
      <main className="container margin-vert--lg">
        <h1 style={{fontSize: '3rem'}}>About</h1>
        <p>
          I'm a technical documentation leader with 15+ years of experience building documentation
          functions from the ground up. I specialize in transforming fragmented tribal knowledge
          into scalable, sustainable systems — and in helping teams navigate the shift to
          AI-assisted and agent-readable documentation.
        </p>
        <p>
          My career spans companies like Grafana Labs, Macrometa, and Thermo Fisher Scientific,
          where I've led teams, modernized legacy systems, and built documentation cultures where
          none existed. I've migrated sites from PDFs to Docs-Like-Code, written and tested API
          and SDK documentation, and coached writers and engineers on what it actually takes to
          make documentation work over time.
        </p>
        <p>
          The through line in all of it: the tools are the easy part. The hard part is getting
          people to care — and building processes they'll actually follow.
        </p>

        <h2>What I do now</h2>
        <p>
          Through <a href="https://hackmamba.io">Hackmamba</a>, I partner with startups and
          engineering teams to design bespoke documentation systems. That includes auditing
          existing processes, architecting information systems, coaching embedded writers, and
          building the pipelines that keep documentation accurate as products evolve.
        </p>
        <p>
          I'm particularly focused on what it means to document for two audiences simultaneously:
          the humans who use your product and the agents that now consume your documentation to
          answer questions and take actions. Most teams are doing neither well. I help fix that.
        </p>

        <h2>On the side</h2>
        <p>
          I run <a href="https://www.youtube.com/channel/UCdzER3fTHLN8mseLA_wtntg/">Technical
          Writing Uncensored</a> — a YouTube channel for technical writers navigating the AI era.
          I write about documentation systems, tooling, and career development, and I coach
          technical writers who want to level up their skills and business sense.
        </p>

        <h2>Connect</h2>
        <SocialCards />
      </main>
    </Layout>
  );
}

