'use client';

import dynamic from 'next/dynamic'

const PantryPage = dynamic(() => import('./pantry-page'), { ssr: false })

export default function Home() {
  return <PantryPage />;
}
