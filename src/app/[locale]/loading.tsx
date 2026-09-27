import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-950 pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 animate-pulse">
      {/* Hero Skeleton */}
      <div className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto">
        <div className="h-6 w-48 bg-slate-800/80 rounded-full" />
        <div className="h-14 w-full bg-slate-800/60 rounded-2xl" />
        <div className="h-6 w-3/4 bg-slate-800/40 rounded-xl" />
        <div className="flex gap-4 pt-4">
          <div className="h-12 w-44 bg-blue-600/30 rounded-xl" />
          <div className="h-12 w-40 bg-slate-800/60 rounded-xl" />
        </div>
      </div>

      {/* Grid Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-12">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-64 rounded-2xl bg-slate-900/60 border border-slate-800/60 p-6 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-slate-800" />
            <div className="h-5 w-3/4 bg-slate-800 rounded" />
            <div className="h-4 w-full bg-slate-800/60 rounded" />
            <div className="h-4 w-5/6 bg-slate-800/40 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
