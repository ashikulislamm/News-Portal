// src/components/Trending.jsx
import { useEffect, useMemo, useRef, useState } from "react";

const POSTS = [
  {
    id: 1,
    title: "Our first project with React",
    excerpt:
      "Over the past year, Volosoft has undergone many changes! After months of preparation and some hard work, we moved to our new office.",
    date: "Aug 15, 2021",
    read: "16 min read",
    author: { name: "Sofia McGuire", avatar: "https://i.pravatar.cc/50?img=1" },
    image:
      "https://images.unsplash.com/photo-1552581234-26160f608093?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 2,
    title: "We partnered up with Google",
    excerpt:
      "Over the past year, Volosoft has undergone many changes! After months of preparation and some hard work, we moved to our new office.",
    date: "Aug 15, 2021",
    read: "16 min read",
    author: { name: "Roberta Casas", avatar: "https://i.pravatar.cc/50?img=2" },
    image:
      "https://images.unsplash.com/photo-1508385082359-f38ae991e8f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=870&q=80",
  },
  {
    id: 3,
    title: "Our first office",
    excerpt:
      "Over the past year, Volosoft has undergone many changes! After months of preparation and some hard work, we moved to our new office.",
    date: "Aug 15, 2021",
    read: "16 min read",
    author: { name: "Jese Leos", avatar: "https://i.pravatar.cc/50?img=3" },
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=870&q=80",
  },
  {
    id: 1,
    title: "Our first project with React",
    excerpt:
      "Over the past year, Volosoft has undergone many changes! After months of preparation and some hard work, we moved to our new office.",
    date: "Aug 15, 2021",
    read: "16 min read",
    author: { name: "Sofia McGuire", avatar: "https://i.pravatar.cc/50?img=1" },
    image:
      "https://images.unsplash.com/photo-1552581234-26160f608093?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 2,
    title: "We partnered up with Google",
    excerpt:
      "Over the past year, Volosoft has undergone many changes! After months of preparation and some hard work, we moved to our new office.",
    date: "Aug 15, 2021",
    read: "16 min read",
    author: { name: "Roberta Casas", avatar: "https://i.pravatar.cc/50?img=2" },
    image:
      "https://images.unsplash.com/photo-1508385082359-f38ae991e8f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=870&q=80",
  },
  {
    id: 3,
    title: "Our first office",
    excerpt:
      "Over the past year, Volosoft has undergone many changes! After months of preparation and some hard work, we moved to our new office.",
    date: "Aug 15, 2021",
    read: "16 min read",
    author: { name: "Jese Leos", avatar: "https://i.pravatar.cc/50?img=3" },
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=870&q=80",
  },
];

function Card({ post }) {
  return (
    <article className="bg-[var(--color-primary)] text-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="px-3 pt-3">
        <img
          src={post.image}
          alt=""
          className="h-44 w-full object-cover rounded-xl"
          loading="lazy"
        />
      </div>
      <div className="p-5">
        <div className="flex items-center gap-3 mb-3">
          <img
            src={post.author.avatar}
            alt=""
            className="h-8 w-8 rounded-full"
          />
          <div className="text-sm">
            <p className="text-left font-semibold">{post.author.name}</p>
            <p className="text-slate-400">
              {post.date} · {post.read}
            </p>
          </div>
        </div>
        <h3 className="text-xl font-semibold leading-snug mb-2">
          {post.title}
        </h3>
        <p className="text-slate-300/90 leading-relaxed mb-4">{post.excerpt}</p>
        <a href="#" className="text-[var(--color-accent)] hover:text-sky-300 font-medium">
          Read more →
        </a>
      </div>
    </article>
  );
}

export function News() {
  return (
    <section className="py-8">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="[var(--color-text)] text-4xl font-semibold mb-6">
          Explore Latest News
        </h2>

        {/* responsive grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {POSTS.map((post) => (
            <Card key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
