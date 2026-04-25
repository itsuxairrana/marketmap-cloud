import { Suspense } from 'react';
import ResultsContent from './results-content';

export const dynamic = 'force-dynamic';

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4">Loading your marketing plan...</p>
        </div>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  );
}
