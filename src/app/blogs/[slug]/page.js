import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ChevronRight, Calendar, User } from "lucide-react";
import { imageSrc } from "@/utils/imageSrc";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { prisma } = await import("@/lib/prisma");
  const blog = await prisma.blog.findUnique({ where: { slug } });
  if (!blog || !blog.published) return { title: "Blog — hardvanta" };

  const title = `${blog.title} — hardvanta`;
  const description = blog.excerpt;
  const image = imageSrc(blog.coverImage);

  return {
    title,
    description,
    openGraph: { title, description, images: [image], type: "article" },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export default async function BlogDetailPage({ params }) {
  const { slug } = await params;
  const { prisma } = await import("@/lib/prisma");

  const blog = await prisma.blog.findUnique({ where: { slug } });
  if (!blog || !blog.published) notFound();

  // Fire-and-forget view counter.
  prisma.blog.update({ where: { slug }, data: { views: { increment: 1 } } }).catch(() => {});

  const related = await prisma.blog.findMany({
    where: { published: true, category: blog.category, slug: { not: slug } },
    take: 3,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-graphite to-obsidian">
      <div className="liquid-blob left-1/4 top-[-15%] h-96 w-96 bg-electric/10" />

      <div className="relative bg-gradient-to-r from-obsidian via-midnight to-obsidian text-white">
        <div className="container-page py-8">
          <nav className="flex items-center gap-1 text-sm text-white/50">
            <Link href="/" className="hover:text-electric-light">Home</Link>
            <ChevronRight size={14} />
            <Link href="/blogs" className="hover:text-electric-light">Blogs</Link>
            <ChevronRight size={14} />
            <span className="line-clamp-1 text-white">{blog.title}</span>
          </nav>
        </div>
      </div>

      <div className="container-page relative py-10">
        <div className="mx-auto max-w-3xl">

          <span className="inline-block rounded-full bg-electric/10 px-3 py-1 text-xs font-semibold text-electric-light">
            {blog.category}
          </span>
          <h1 className="mt-3 text-2xl font-bold text-white sm:text-3xl">{blog.title}</h1>

          <div className="mt-3 flex items-center gap-4 text-sm text-white/40">
            <span className="flex items-center gap-1.5">
              <User size={14} /> {blog.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              {new Date(blog.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>

          <div className="relative mt-6 aspect-[16/9] w-full overflow-hidden rounded-xl bg-obsidian">
            <Image
              src={imageSrc(blog.coverImage)}
              alt={blog.title}
              fill
              sizes="768px"
              className="object-cover"
              priority
            />
          </div>

          {/* Content — stored as plain text/markdown-ish paragraphs */}
          <div className="prose-info mt-8 space-y-4 text-sm leading-relaxed text-white/70">
            {blog.content.split("\n").filter(Boolean).map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mx-auto mt-14 max-w-5xl">
            <h2 className="mb-5 text-xl font-bold text-white">More in {blog.category}</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {related.map((b) => (
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
                      sizes="33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="line-clamp-2 text-sm font-bold text-white group-hover:text-electric-light transition-colors">
                      {b.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
