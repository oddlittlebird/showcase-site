import {useEffect, useState} from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

interface PipelineStatus {
  status: 'pass' | 'fail';
  timestamp: string;
}

export default function PipelineStatusBadge(): JSX.Element {
  const statusUrl = useBaseUrl('/doc-detective/pipeline-status.json');
  const [data, setData] = useState<PipelineStatus | null>(null);
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

  const passed = data.status === 'pass';

  return (
    <div className={passed ? styles.pass : styles.fail}>
      <span className={styles.icon}>{passed ? '✓' : '✗'}</span>
      <span>
        {passed ? 'Pipeline test passed' : 'Pipeline test failed'} as of{' '}
        {new Date(data.timestamp).toLocaleString(undefined, {
          dateStyle: 'medium',
          timeStyle: 'short',
        })}
      </span>
    </div>
  );
}
