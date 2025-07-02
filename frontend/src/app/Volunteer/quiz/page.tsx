'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the quiz component with SSR disabled
const AIQuizComponent = dynamic(() => import('@/components/TrashQuiz'), {
  ssr: false,
  loading: () => <p>Loading quiz...</p>,
});

export default function TrashQuizPage() {
  return (
    <main className="min-h-screen bg-gray-100 py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-6 text-green-700">
        Trash Quiz
      </h1>
      <AIQuizComponent />
    </main>
  );
}
