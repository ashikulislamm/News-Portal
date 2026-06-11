import React from "react";

export function NewsCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-200/70 p-5 space-y-4 animate-pulse">
      <div className="h-44 bg-slate-100 rounded-xl" />
      <div className="h-3 bg-slate-200 rounded-full w-1/4" />
      <div className="h-5 bg-slate-200 rounded-full w-5/6" />
      <div className="h-4 bg-slate-200 rounded-full w-full" />
      <div className="flex justify-between items-center pt-2">
        <div className="h-6 w-6 bg-slate-200 rounded-full" />
        <div className="h-3 bg-slate-200 rounded-full w-16" />
      </div>
    </div>
  );
}

export function TrendingCardSkeleton() {
  return (
    <div className="bg-[var(--color-primary)] rounded-2xl shadow-sm overflow-hidden animate-pulse">
      <div className="px-3 pt-3">
        <div className="h-44 w-full bg-slate-700/80 rounded-xl"></div>
      </div>
      <div className="p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-8 w-8 bg-slate-700/80 rounded-full"></div>
          <div className="flex-1">
            <div className="h-4 bg-slate-700/80 rounded mb-1 w-24"></div>
            <div className="h-3 bg-slate-700/80 rounded w-32"></div>
          </div>
        </div>
        <div className="h-6 bg-slate-700/80 rounded mb-2 w-full"></div>
        <div className="h-4 bg-slate-700/80 rounded mb-1 w-full"></div>
        <div className="h-4 bg-slate-700/80 rounded mb-4 w-1/2"></div>
        <div className="h-4 bg-slate-700/80 rounded w-24"></div>
      </div>
    </div>
  );
}

export function NewsDetailsSkeleton() {
  return (
    <div className="max-w-4xl mx-auto p-4 mt-5">
      <div className="animate-pulse space-y-6">
        <div className="w-full h-64 md:h-80 lg:h-96 bg-slate-100 rounded-2xl"></div>
        <div className="space-y-3">
          <div className="h-8 bg-slate-200 rounded-lg w-3/4"></div>
          <div className="h-8 bg-slate-200 rounded-lg w-1/2"></div>
        </div>
        <div className="flex gap-4 items-center py-2 border-y border-slate-100">
          <div className="h-10 w-10 bg-slate-200 rounded-full"></div>
          <div className="space-y-2">
            <div className="h-3 bg-slate-250 rounded w-24"></div>
            <div className="h-3 bg-slate-200 rounded w-48"></div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-4 bg-slate-200 rounded w-full"></div>
          <div className="h-4 bg-slate-200 rounded w-full"></div>
          <div className="h-4 bg-slate-200 rounded w-5/6"></div>
          <div className="h-4 bg-slate-200 rounded w-4/5"></div>
        </div>
      </div>
    </div>
  );
}

export function NewsHeroSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-pulse">
      <div className="lg:col-span-2 h-[450px] bg-slate-100/70 rounded-2xl flex flex-col justify-end p-8 space-y-4">
        <div className="h-4 bg-slate-200 rounded-full w-24" />
        <div className="h-8 bg-slate-200 rounded-full w-5/6" />
        <div className="h-4 bg-slate-200 rounded-full w-1/2" />
      </div>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50">
            <div className="w-20 h-20 bg-slate-200 rounded-lg shrink-0" />
            <div className="flex-1 space-y-2 py-1">
              <div className="h-3 bg-slate-200 rounded-full w-1/4" />
              <div className="h-4 bg-slate-200 rounded-full w-5/6" />
              <div className="h-3 bg-slate-200 rounded-full w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ListLoaderSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-14 bg-slate-50 rounded-xl border border-slate-100" />
      ))}
    </div>
  );
}
