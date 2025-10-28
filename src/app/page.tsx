'use client';

import TimelineView from '../components/Timeline/TimelineView';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-blue-100 font-sans text-neutral-900 antialiased flex flex-col">
      {/* Header */}
      <header className="border-b border-white/30 bg-white/60 backdrop-blur-md sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white font-semibold shadow-md">
              EP
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">
                Execution Plan
              </h1>
              <p className="text-sm text-neutral-600">
                A structured roadmap from concept to completion
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-sm text-neutral-500 font-medium">
            <span>Last Updated:</span>
            <span className="text-blue-600">Oct 2025</span>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-10 w-full">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-neutral-200 overflow-hidden">
          <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-semibold text-neutral-800 flex items-center gap-2">
              <span className="bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">
                Team Schedule Overview
              </span>
            </h2>
            <span className="text-sm text-neutral-500 font-medium bg-sky-100 px-2 py-1 rounded-md">
              Q3 – 2025
            </span>
          </div>

          <div className="p-4 sm:p-6">
            <TimelineView />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 text-center text-sm text-neutral-600 pb-6">
        <p>
          <span className="bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent font-medium">
            Streamlined Timeline Interface
          </span>{' '}
          · Designed for clarity and project transparency
        </p>
      </footer>
    </div>
  );
}
