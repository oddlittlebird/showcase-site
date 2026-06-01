import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Heading from '@theme/Heading';

import styles from './styles.module.css';

export default function HomepageHero(): ReactNode {
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
