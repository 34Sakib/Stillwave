'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LibraryPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the continuous audio sanctuary library view
    window.location.replace('/#/library');
  }, [router]);

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#0A2B2A', color: '#A8C7CF', fontFamily: 'sans-serif' }}>
      <p>Entering Stillwave soundscapes library...</p>
    </div>
  );
}
