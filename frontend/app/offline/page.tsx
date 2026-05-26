'use client';

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-slate-800 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18.364 5.636a9 9 0 010 12.728M5.636 18.364a9 9 0 010-12.728M12 9v4m0 4h.01"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">You are offline</h1>
        <p className="text-slate-400 mb-6">
          It looks like you have lost your internet connection. Please check your
          network settings and try again.
        </p>
        <button
          onClick={() => typeof window !== 'undefined' && window.location.reload()}
          className="px-6 py-2.5 rounded-lg bg-accent text-white font-medium text-sm hover:bg-emerald-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
