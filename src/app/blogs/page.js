import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Search, Calendar, User } from "lucide-react";
import { imageSrc } from "@/utils/imageSrc";
import BlogNewsletterForm from "@/components/blogs/BlogNewsletterForm";

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
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-brand-silver to-brand-bg">
      <div className="liquid-blob left-1/4 top-[-15%] h-96 w-96 bg-brand-blue/10" />

      {/* Hero */}
      <div className="relative bg-gradient-to-r from-brand-navy via-brand-blue to-brand-navy text-white">
        <div className="container-page py-10">
          <nav className="mb-4 flex items-center gap-1 text-sm text-white/50">
            <Link href="/" className="hover:text-brand-steel">Home</Link>
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
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-brand-text">Search</h3>
            <div className="flex items-center overflow-hidden rounded-lg glass-brand-card">
              <input
                type="text"
                name="q"
                defaultValue={q}
                placeholder="Search blogs..."
                className="w-full bg-transparent px-3 py-2.5 text-sm text-brand-text outline-none placeholder:text-brand-muted"
              />
              <button type="submit" aria-label="Search blogs" className="bg-gradient-to-r from-brand-blue to-brand-navy px-3.5 py-2.5 text-white hover:brightness-110 transition-all">
                <Search size={16} />
              </button>
            </div>
          </form>

          {/* Categories */}
          <div className="mb-6">
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-brand-text">Category</h3>
            <ul className="space-y-1.5">
              <li>
                <Link
                  href="/blogs"
                  className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                    !category ? "bg-brand-blue/10 font-semibold text-brand-blue" : "text-brand-muted hover:bg-brand-silver"
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
                      category === c ? "bg-brand-blue/10 font-semibold text-brand-blue" : "text-brand-muted hover:bg-brand-silver"
                    }`}
                  >
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="rounded-xl glass-brand-card p-5">
            <h3 className="text-sm font-bold text-brand-text">Subscribe to our Newsletter</h3>
            <p className="mt-1 text-xs text-brand-muted">
              Get promotional offers &amp; discounts straight to your inbox.
            </p>
            <BlogNewsletterForm />
          </div>
        </aside>

        {/* Blog grid */}
        <div className="order-1 lg:order-2 lg:col-span-3">
          {blogs.length === 0 ? (
            <div className="rounded-xl glass-brand-card py-16 text-center">
              <p className="text-brand-muted">No blogs found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {blogs.map((b) => (
                <Link
                  key={b.id}
                  href={`/blogs/${b.slug}`}
                  className="group overflow-hidden rounded-xl glass-brand-card transition-shadow hover:shadow-brand-glow"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-brand-silver">
                    <Image
                      src={imageSrc(b.coverImage)}
                      alt={b.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-brand-navy/90 px-3 py-1 text-xs font-semibold text-white">
                      {b.category}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="line-clamp-2 font-bold text-brand-text group-hover:text-brand-blue transition-colors">
                      {b.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-brand-muted">{b.excerpt}</p>
                    <div className="mt-4 flex items-center gap-4 text-xs text-brand-muted">
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
