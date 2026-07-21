import {useEffect, useState} from 'react';
import type {ReactNode} from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

interface HeadingCounts {
  h1: number;
  h2: number;
  h3: number;
  timestamp: string;
}

export default function LlmsHeadingCounts(): ReactNode {
  const url = useBaseUrl('/doc-detective/llms-txt-headings.json');
  const [data, setData] = useState<HeadingCounts | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`${url}?v=${Date.now()}`)
      .then((res) => {
        if (!res.ok) throw new Error('not found');
        return res.json();
      })
      .then(setData)
      .catch(() => setError(true));
  }, [url]);

  if (error) {
    return <span className={styles.unavailable}>Heading counts unavailable</span>;
  }

  if (!data) {
    return <span className={styles.unavailable}>Loading heading counts…</span>;
  }

  const counts = [
    {level: 'H1', count: data.h1},
    {level: 'H2', count: data.h2},
    {level: 'H3', count: data.h3},
  ];

  return (
    <div className={styles.wrapper}>
      <div className={styles.counts}>
        {counts.map(({level, count}) => (
          <div key={level} className={styles.tile}>
            <span className={styles.level}>{level}</span>
            <span className={styles.count}>{count}</span>
          </div>
        ))}
      </div>
      <p className={styles.timestamp}>
        Last counted{' '}
        {new Date(data.timestamp).toLocaleString(undefined, {
          dateStyle: 'medium',
          timeStyle: 'short',
        })}
      </p>
    </div>
  );
}
