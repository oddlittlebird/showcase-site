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
          I'm a technical documentation leader with an M.A. in Writing (Professional and Technical Writing) 15+ years of experience building documentation
          functions from the ground up. I specialize in transforming fragmented tribal knowledge
          into scalable, sustainable systems. I help teams navigate the shift to
          AI-assisted workflows to produce documentation that's useful to human and agents.
        </p>
        <p>
          My career spans industries from electron miscosropy (Thermo Fisher Scientific) to observability (Grafana). I've led teams, modernized legacy systems, and built documentation cultures where
          none existed. I've migrated sites from PDFs to Docs-Like-Code, written and tested API
          and SDK documentation, and coached writers and engineers on why documentation matters
          and how to create docs that help users solve their problems.
        </p>
        <p>
          The through line in all of it: the tools are the easy part. I can train people on tools. The hard part is getting
          people to care — and building processes they'll actually follow. Getting stakeholder buy-in is the secret sauce.
        </p>

        <h2>What I do now</h2>
        <p>
          Through <a href="https://hackmamba.io">Hackmamba</a>, I work with companies to design and build bespoke documentation systems. That includes auditing
          existing processes, architecting information systems, coaching embedded writers, and
          building the pipelines and processes that keep documentation accurate as products evolve.
        </p>

        <h2>On the side</h2>
        <p>
          I run <a href="https://www.youtube.com/channel/UCdzER3fTHLN8mseLA_wtntg/">Technical
          Writing Uncensored</a> — a YouTube channel for technical writers navigating the AI era.
        </p>
        <p>
          On LinkedIn, I write about documentation systems, tooling, industry happenings, and career development.
        </p>
        <p>I coach technical writers who want to learn how to present their skills and their professional selves the best way possible.</p>

        <h2>Connect</h2>
        <SocialCards />
      </main>
    </Layout>
  );
}

