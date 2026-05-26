import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  const heroBg = useBaseUrl('/img/hero-bg.jpg');
  return (
    <header
      className={clsx('hero hero--primary', styles.heroBanner)}
      style={{backgroundImage: `url(${heroBg})`}}>
      <div className="container" style={{position: 'relative', zIndex: 1}}>
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link className="button button--secondary button--lg" to="/about">
            About me
          </Link>
          <Link className="button button--secondary button--lg" to="/portfolio" style={{marginLeft: '1rem'}}>
            See my work
          </Link>
        </div>
      </div>
    </header>
  );
}

function HomepageContent() {
  return (
    <section className={styles.content}>
      <div className="container">
        <Heading as="h2">What is this site?</Heading>
        <p>
          This is a demonstration site of an end-to-end documentation workflow using tools such as:
        </p>
        <ul>
          <li>Vale</li>
          <li>codespell</li>
          <li>Doc Detective</li>
          <li>Lychee</li>
          <li>Agent skills</li>
        </ul>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="Documentation systems consultant and technical writer. I help teams build processes that produce documentation agents can trust — not just access.">
      <HomepageHeader />
      <main>
        <HomepageContent />
      </main>
    </Layout>
  );
}
