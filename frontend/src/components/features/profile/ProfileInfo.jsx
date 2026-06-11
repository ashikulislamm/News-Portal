import React, { useState } from "react";
import {
  EnvelopeIcon,
  PhoneIcon,
  GlobeAltIcon,
  MapPinIcon,
  FolderIcon,
} from "@heroicons/react/24/outline";

// Copy to Clipboard Helper Button
const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-650 hover:bg-slate-50 transition cursor-pointer shrink-0"
      title="Copy to clipboard"
    >
      {copied ? (
        <svg
          className="h-4 w-4 text-emerald-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M5 13l4 4L19 7"
          />
        </svg>
      ) : (
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3"
          />
        </svg>
      )}
    </button>
  );
};

export default function ProfileInfo({ user, postsCount, postsLoading, onNavigateToPosts }) {
  const defaultAvatar = "https://i.pravatar.cc/150?img=1";

  return (
    <div className="space-y-6 text-left">
      {/* Banner styling */}
      <div className="bg-gradient-to-br from-slate-900 via-zinc-900 to-amber-950 rounded-3xl h-44 relative overflow-hidden shadow-lg border border-slate-800">
        <div className="absolute top-[-20%] right-[-10%] w-72 h-72 bg-[var(--color-accent)] opacity-15 rounded-full blur-3xl" />
        <div className="absolute bottom-[-20%] left-[20%] w-72 h-72 bg-amber-500 opacity-10 rounded-full blur-3xl" />
      </div>

      {/* Profile avatar breakout row */}
      <div className="px-8 flex flex-col sm:flex-row items-center sm:items-end gap-5 -mt-12 mb-6">
        <img
          src={user.profileImage || defaultAvatar}
          alt="Avatar"
          className="w-24 h-24 rounded-2xl border-4 border-white object-cover shadow-xl bg-slate-50 z-10 shrink-0 select-none"
        />
        <div className="text-center sm:text-left pb-1">
          <div className="flex flex-col sm:flex-row items-center gap-2.5">
            <h2 className="text-2xl font-black text-slate-900">
              {user.fullName || "Journalist Name"}
            </h2>
            <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-bold text-[var(--color-accent)] ring-1 ring-inset ring-amber-500/20">
              Contributor
            </span>
          </div>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1 select-none">
            Verified News Publisher
          </p>
        </div>
      </div>

      {/* Grid contents */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Biography */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden text-left">
            <span className="absolute top-2 right-6 text-8xl font-serif text-slate-100/85 font-black select-none pointer-events-none">
              “
            </span>
            <div className="relative z-10 space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider select-none">
                Biography
              </h3>
              <p className="text-slate-700 text-sm leading-relaxed font-medium">
                {user.bio ||
                  "No biography provided yet. Head over to Edit Profile to share details about your background, publications, and interests."}
              </p>
            </div>
          </div>

          {/* Quick publications preview */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between select-none">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Publications Brief
              </h3>
              <button
                onClick={onNavigateToPosts}
                className="text-xs font-bold text-[var(--color-accent)] hover:text-amber-700 transition cursor-pointer"
              >
                View Published List
              </button>
            </div>

            <div className="text-center py-6 bg-slate-50/50 rounded-xl border border-slate-100/50">
              <p className="text-xs text-slate-450 font-bold">
                {postsLoading
                  ? "Loading publications count..."
                  : `You have successfully published ${postsCount} news articles online.`}
              </p>
            </div>
          </div>
        </div>

        {/* Right column: Credentials directory */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider select-none">
              Directory Metadata
            </h3>

            <div className="space-y-4">
              {/* Email */}
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 bg-amber-500/10 text-[var(--color-accent)] rounded-lg shrink-0">
                  <EnvelopeIcon className="h-4.5 w-4.5" />
                </div>
                <div className="min-w-0 text-left flex-grow">
                  <p className="text-[9px] text-slate-450 font-bold uppercase tracking-wider select-none">
                    Email Address
                  </p>
                  <p className="text-xs font-bold text-slate-800 break-all mt-0.5">
                    {user.email || "-"}
                  </p>
                </div>
                {user.email && <CopyButton text={user.email} />}
              </div>

              {/* Phone */}
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 bg-amber-500/10 text-[var(--color-accent)] rounded-lg shrink-0">
                  <PhoneIcon className="h-4.5 w-4.5" />
                </div>
                <div className="min-w-0 text-left flex-grow">
                  <p className="text-[9px] text-slate-450 font-bold uppercase tracking-wider select-none">
                    Phone Number
                  </p>
                  <p className="text-xs font-bold text-slate-800 break-all mt-0.5">
                    {user.phone || "-"}
                  </p>
                </div>
                {user.phone && <CopyButton text={user.phone} />}
              </div>

              {/* Country */}
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 bg-amber-500/10 text-[var(--color-accent)] rounded-lg shrink-0">
                  <GlobeAltIcon className="h-4.5 w-4.5" />
                </div>
                <div className="min-w-0 text-left flex-grow">
                  <p className="text-[9px] text-slate-450 font-bold uppercase tracking-wider select-none">
                    Country Location
                  </p>
                  <p className="text-xs font-bold text-slate-800 break-words mt-0.5">
                    {user.country || "-"}
                  </p>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 bg-amber-500/10 text-[var(--color-accent)] rounded-lg shrink-0">
                  <MapPinIcon className="h-4.5 w-4.5" />
                </div>
                <div className="min-w-0 text-left flex-grow">
                  <p className="text-[9px] text-slate-450 font-bold uppercase tracking-wider select-none">
                    Street Address
                  </p>
                  <p className="text-xs font-bold text-slate-800 break-words mt-0.5">
                    {user.address || "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-left">
              <div className="text-slate-400 font-bold text-[9px] uppercase tracking-wider select-none">
                Total Articles
              </div>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {postsCount}
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-left flex flex-col justify-between select-none">
              <div className="text-slate-400 font-bold text-[9px] uppercase tracking-wider">
                Console Status
              </div>
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-bold text-slate-700">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
