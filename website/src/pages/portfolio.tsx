import type {ReactNode} from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';


interface SampleProps {
  href: string;
  title: string;
  description?: string;
}

function Sample({href, title, description}: SampleProps) {
  return (
    <li>
      <a href={href} target="_blank" rel="noopener noreferrer">{title}</a>
      {description && <span style={{color: 'var(--ifm-color-emphasis-700)', fontSize: '0.875rem'}}> — {description}</span>}
    </li>
  );
}

export default function Portfolio(): ReactNode {
  const base = useBaseUrl('/portfolio/');

  return (
    <Layout
      title="Portfolio"
      description="Technical writing samples by Diana Payton.">
      <main className="container margin-vert--lg">
        <h1 style={{fontSize: '3rem'}}>Portfolio</h1>
        <p>Selected work samples. Each link opens the original document.</p>

        <Heading as="h2">How-to guides</Heading>
        <ul>
          <Sample href={`${base}Add a query variable _ Grafana Labs.pdf`} title="Add a query variable" description="Grafana Labs" />
          <Sample href={`${base}Value mappings _ Grafana Labs.pdf`} title="Value mappings" description="Grafana Labs" />
          <Sample href={`${base}Find HTML Selector _ Macrometa.pdf`} title="Find HTML Selector" description="Macrometa" />
          <Sample href={`${base}Manage Click Interaction Policies _ Macrometa.pdf`} title="Manage Click Interaction Policies" description="Macrometa" />
        </ul>

        <Heading as="h2">Integration guides</Heading>
        <ul>
          <Sample href={`${base}Integrate Fingerprint as First Party _ Macrometa.pdf`} title="Integrate Fingerprint as First Party" description="Macrometa" />
        </ul>

        <Heading as="h2">Tutorials</Heading>
        <ul>
          <Sample href={`${base}cockroachdb-tutorial.md`} title="CockroachDB tutorial" />
        </ul>

        <Heading as="h2">API reference sample</Heading>
        <p>
          A sample OpenAPI 3.1 specification for a fictional Garden Companion API, rendered with{' '}
          <a href="https://scalar.com" target="_blank" rel="noopener noreferrer">Scalar</a>.
          The server is not real — requests made with the Try It feature will fail.
          Use the example responses to explore the spec.
        </p>
        <ul>
          <Sample href="/showcase-site/api" title="Garden Companion API" description="OpenAPI 3.1 sample" />
        </ul>
      </main>
    </Layout>
  );
}
