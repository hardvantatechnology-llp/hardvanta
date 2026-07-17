import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Search, Calendar, User, Mail } from "lucide-react";
import { imageSrc } from "@/utils/imageSrc";

export const dynamic = "force-dynamic";

export default async function BlogsPage({ searchParams }) {
  const { prisma } = await import("@/lib/prisma");
  const params = await searchParams;
  const q = (params?.q || "").trim();
  const category = params?.category || "";

  const blogs = await prisma.blog.findMany({
    where: {
      published: true,
      ...(category ? { category } : {}),
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { excerpt: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  const allBlogs = await prisma.blog.findMany({
    where: { published: true },
    select: { category: true },
  });
  const categories = [...new Set(allBlogs.map((b) => b.category))];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-graphite to-obsidian">
      <div className="liquid-blob left-1/4 top-[-15%] h-96 w-96 bg-electric/10" />

      {/* Hero */}
      <div className="relative bg-gradient-to-r from-obsidian via-midnight to-obsidian text-white">
        <div className="container-page py-10">
          <nav className="mb-4 flex items-center gap-1 text-sm text-white/50">
            <Link href="/" className="hover:text-electric-light">Home</Link>
            <ChevronRight size={14} />
            <span className="text-white">Blogs</span>
          </nav>
          <h1 className="text-3xl font-bold sm:text-4xl">Blogs</h1>
          <p className="mt-2 max-w-2xl text-white/60">
            Tutorials, project guides and the latest in robotics &amp; electronics.
          </p>
        </div>
      </div>

      <div className="container-page relative grid grid-cols-1 gap-10 py-10 lg:grid-cols-4">

        {/* Sidebar */}
        <aside className="order-2 lg:order-1 lg:col-span-1">
          {/* Search */}
          <form className="mb-6">
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-white">Search</h3>
            <div className="flex items-center overflow-hidden rounded-lg glass-card">
              <input
                type="text"
                name="q"
                defaultValue={q}
                placeholder="Search blogs..."
                className="w-full bg-transparent px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/30"
              />
              <button type="submit" aria-label="Search blogs" className="bg-gradient-to-r from-electric to-liquid px-3.5 py-2.5 text-white hover:brightness-110 transition-all">
                <Search size={16} />
              </button>
            </div>
          </form>

          {/* Categories */}
          <div className="mb-6">
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-white">Category</h3>
            <ul className="space-y-1.5">
              <li>
                <Link
                  href="/blogs"
                  className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                    !category ? "bg-electric/10 font-semibold text-electric-light" : "text-white/60 hover:bg-white/5"
                  }`}
                >
                  All Posts
                </Link>
              </li>
              {categories.map((c) => (
                <li key={c}>
                  <Link
                    href={`/blogs?category=${encodeURIComponent(c)}`}
                    className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                      category === c ? "bg-electric/10 font-semibold text-electric-light" : "text-white/60 hover:bg-white/5"
                    }`}
                  >
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="rounded-xl glass-card p-5">
            <h3 className="text-sm font-bold text-white">Subscribe to our Newsletter</h3>
            <p className="mt-1 text-xs text-white/60">
              Get promotional offers &amp; discounts straight to your inbox.
            </p>
            <form className="mt-3 flex items-center overflow-hidden rounded-lg glass-card">
              <input
                type="email"
                placeholder="Email address"
                className="w-full bg-transparent px-3 py-2 text-sm text-white outline-none placeholder:text-white/30"
              />
              <button type="submit" className="flex items-center gap-1.5 bg-gradient-to-r from-electric to-liquid px-3 py-2 text-xs font-semibold text-white hover:brightness-110 transition-all">
                <Mail size={14} /> Subscribe
              </button>
            </form>
          </div>
        </aside>

        {/* Blog grid */}
        <div className="order-1 lg:order-2 lg:col-span-3">
          {blogs.length === 0 ? (
            <div className="rounded-xl glass-card py-16 text-center">
              <p className="text-white/60">No blogs found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {blogs.map((b) => (
                <Link
                  key={b.id}
                  href={`/blogs/${b.slug}`}
                  className="group overflow-hidden rounded-xl glass-card transition-shadow hover:shadow-glow-electric"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-obsidian">
                    <Image
                      src={imageSrc(b.coverImage)}
                      alt={b.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-obsidian/90 px-3 py-1 text-xs font-semibold text-white">
                      {b.category}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="line-clamp-2 font-bold text-white group-hover:text-electric-light transition-colors">
                      {b.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-white/60">{b.excerpt}</p>
                    <div className="mt-4 flex items-center gap-4 text-xs text-white/40">
                      <span className="flex items-center gap-1.5">
                        <User size={13} /> {b.author}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar size={13} />
                        {new Date(b.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
