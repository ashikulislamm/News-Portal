import React from "react";
import { Link } from "react-router-dom";

export const HeroSection = () => {
  return (
    <div className="relative isolate px-6 lg:px-8 hero">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-linear-to-tr from-[#D97706] to-[#D97809] opacity-30 sm:left-[calc(50%-30rem)] sm:w-288.75"
        />
      </div>
      <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
        <div className="hidden sm:mb-8 sm:flex sm:justify-center">
          <div className="relative rounded-full px-3 py-1 text-sm/6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
            Local Stories, Global Perspective.{" "}
            <a
              href="#"
              className="font-semibold"
              style={{ color: "var(--Accent-color)" }}
            >
              <span aria-hidden="true" className="absolute inset-0" />
              Read more <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-semibold tracking-tight lg:text-5xl">
            Discover the News That Matters{" "}
            <span className="font-extrabold text-[var(--color-accent)]">
              Today
            </span>
          </h1>
          <p className="mt-8 text-base font-medium text-pretty text-gray-500 sm:text-xl/8">
            From politics and business to tech and culture, we deliver clean,
            credible coverage to keep you ahead of the curve.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              to="/register"
              href="#"
              className="text-sm/6 font-semibold bg-[var(--color-accent)] text-white px-4 py-2 rounded-lg hover:bg-[var(--color-accent)] transition-all duration-200"
            >
              Get Started
            </Link>
            <a href="#" className="text-sm/6 font-semibold text-gray-900">
              Learn more <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="relative left-[calc(50%+3rem)] aspect-1155/678 w-144.5 -translate-x-1/2 bg-linear-to-tr from-[var(--color-accent)] to-[var(--color-accent)] opacity-30 sm:left-[calc(50%+36rem)] sm:w-288.75"
        />
      </div>
    </div>
  );
};
