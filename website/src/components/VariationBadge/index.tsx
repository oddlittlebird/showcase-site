import {useEffect, useState} from 'react';
import type {ReactNode} from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

interface Variation {
  variation: number;
  maxVariation: number;
  exceeded: boolean;
  timestamp: string;
}

interface VariationBadgeProps {
  /** Path to the variation JSON file, relative to the site base URL, e.g. '/doc-detective/doodle-variation.json' */
  dataFile: string;
  /** Label describing what's being compared, e.g. 'Doodle screenshot' */
  label: string;
}

export default function VariationBadge({dataFile, label}: VariationBadgeProps): ReactNode {
  const dataUrl = useBaseUrl(dataFile);
  const [data, setData] = useState<Variation | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`${dataUrl}?v=${Date.now()}`)
      .then((res) => {
        if (!res.ok) throw new Error('not found');
        return res.json();
      })
      .then(setData)
      .catch(() => setError(true));
  }, [dataUrl]);

  if (error) {
    return <span className={styles.badge}>Comparison unavailable</span>;
  }

  if (!data) {
    return <span className={styles.badge}>Loading latest comparison…</span>;
  }

  const pct = (data.variation * 100).toFixed(1);
  const maxPct = (data.maxVariation * 100).toFixed(0);

  return (
    <div className={data.exceeded ? styles.warning : styles.within}>
      <span className={styles.icon}>{data.exceeded ? '⚠' : '✓'}</span>
      <span>
        {label}: {pct}% different from the reference image
        {data.exceeded
          ? ` — exceeded the ${maxPct}% threshold, so the reference image was replaced`
          : ` (within the ${maxPct}% threshold)`}
        {' as of '}
        {new Date(data.timestamp).toLocaleString(undefined, {
          dateStyle: 'medium',
          timeStyle: 'short',
        })}
      </span>
    </div>
  );
}
