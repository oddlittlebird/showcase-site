import {useEffect, useState} from 'react';
import type {ReactNode} from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

interface Status {
  status: 'pass' | 'fail' | 'unknown';
  timestamp: string;
}

interface StatusBadgeProps {
  /** Path to the status JSON file, relative to the site base URL, e.g. '/doc-detective/pipeline-status.json' */
  statusFile: string;
  /** Label describing what the status refers to, e.g. 'Pipeline test' */
  label: string;
}

export default function StatusBadge({statusFile, label}: StatusBadgeProps): ReactNode {
  const statusUrl = useBaseUrl(statusFile);
  const [data, setData] = useState<Status | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`${statusUrl}?v=${Date.now()}`)
      .then((res) => {
        if (!res.ok) throw new Error('not found');
        return res.json();
      })
      .then(setData)
      .catch(() => setError(true));
  }, [statusUrl]);

  if (error) {
    return <span className={styles.badge}>Status unavailable</span>;
  }

  if (!data) {
    return <span className={styles.badge}>Loading latest result…</span>;
  }

  if (data.status === 'unknown') {
    return <span className={styles.badge}>No result yet</span>;
  }

  const passed = data.status === 'pass';

  return (
    <div className={passed ? styles.pass : styles.fail}>
      <span className={styles.icon}>{passed ? '✓' : '✗'}</span>
      <span>
        {passed ? `${label} passed` : `${label} failed`} as of{' '}
        {new Date(data.timestamp).toLocaleString(undefined, {
          dateStyle: 'medium',
          timeStyle: 'short',
        })}
      </span>
    </div>
  );
}
