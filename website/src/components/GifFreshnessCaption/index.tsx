import {useEffect, useState} from 'react';
import type {ReactNode} from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';

interface GifUpdated {
  /** UTC calendar date (YYYY-MM-DD) the GIF was last actually replaced. */
  date: string;
}

export default function GifFreshnessCaption(): ReactNode {
  const url = useBaseUrl('/doc-detective/doodle-gif-updated.json');
  const [data, setData] = useState<GifUpdated | null>(null);
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
    return <p>Last-updated date unavailable.</p>;
  }

  if (!data) {
    return <p>Loading…</p>;
  }

  const todayUtc = new Date().toISOString().slice(0, 10);
  const isToday = data.date === todayUtc;

  return isToday ? (
    <p>Animated doodle from {data.date}.</p>
  ) : (
    <p>No animated doodle today — showing the last one, from {data.date}.</p>
  );
}
