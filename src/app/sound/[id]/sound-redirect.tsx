'use client';

import { useEffect } from 'react';

export function SoundRedirect({ id }: { id: string }) {
  useEffect(() => {
    if (id) {
      window.location.replace(`/#sound=${id}`);
    } else {
      window.location.replace('/#/library');
    }
  }, [id]);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: '#0A2B2A',
        color: '#A8C7CF',
        fontFamily: 'sans-serif',
      }}
    >
      <p>Entering soundscape...</p>
    </div>
  );
}
