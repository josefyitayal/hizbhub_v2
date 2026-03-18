import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import Image from "next/image";

export default async function BlogPage() {
    const posts = await getAllPosts();

    return (
        <main className="relative min-h-screen bg-studio mt-20 film-noise overflow-hidden">
            {/* Top studio light */}
            <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-[radial-gradient(circle,rgba(255,255,255,0.12),transparent_65%)] blur-[120px]" />

            <div className="relative max-w-7xl mx-auto px-6 py-20 space-y-20">

                {/* Header */}
                <section className="relative text-center max-w-3xl mx-auto">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_60%)] blur-3xl" />
                    <h1 className="relative text-5xl sm:text-6xl font-bold tracking-tight text-white">
                        Hizbhub Journal
                    </h1>
                    <p className="relative mt-4 text-lg text-white/60 font-light">
                        Ideas, systems, and insights for building sovereign digital communities.
                    </p>

                    {/* Cinematic divider */}
                    <div className="mt-10 cinematic-divider" />
                </section>

                {/* Featured strip */}
                <section className="relative studio-card p-10 overflow-hidden">
                    <div className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-white/10 blur-[120px] rounded-full" />
                    <div className="relative grid md:grid-cols-2 gap-10 items-center">
                        <div className="space-y-4">
                            <p className="text-xs uppercase tracking-[0.3em] text-white/50">Featured</p>
                            <h2 className="text-3xl font-semibold text-white">
                                The Architecture of Digital Sovereignty
                            </h2>
                            <p className="text-white/60 leading-relaxed">
                                Why platforms of the future won’t be social networks — they will be
                                private digital nations.
                            </p>
                            <div className="text-xs font-bold uppercase tracking-[0.25em] text-white/70 flex items-center gap-2">
                                <span>Read Article</span>
                                <span>→</span>
                            </div>
                        </div>
                        <div className="relative h-64 w-full rounded-xl overflow-hidden">
                            <div className="absolute inset-0 bg-black/40 z-10" />
                            <Image
                                src="/group banner placeholder.png"
                                alt="Featured"
                                fill
                                className="object-cover scale-105"
                            />
                        </div>
                    </div>
                </section>

                {/* Blog Grid */}
                <section className="relative">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post) => (
                            <Link key={post.slug} href={`/blog/${post.slug}`}>
                                <article
                                    className="group relative studio-card studio-card-hover p-0 overflow-hidden transition-all duration-500"
                                >
                                    {/* Light physics */}
                                    <div className="absolute -top-24 -left-24 w-48 h-48 bg-white/10 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                                    {/* Image */}
                                    <div className="relative h-52 w-full overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                                        <Image
                                            src={post.frontmatter.thumbnail}
                                            alt={post.frontmatter.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className="relative p-6 space-y-4">
                                        <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.25em] text-white/50">
                                            <span>{post.frontmatter.category}</span>
                                            <span>{post.frontmatter.date}</span>
                                        </div>

                                        <h3 className="text-xl font-semibold text-white leading-tight group-hover:opacity-90 transition-opacity">
                                            {post.frontmatter.title}
                                        </h3>

                                        <p className="text-sm text-white/60 leading-relaxed line-clamp-3">
                                            {post.frontmatter.excerpt ?? "Exploring the deeper systems behind digital communities and creator economies."}
                                        </p>

                                        {/* Action */}
                                        <div className="pt-4 text-[10px] uppercase tracking-[0.3em] text-white/50 flex items-center gap-2 group-hover:text-white transition-colors">
                                            <span>Read</span>
                                            <span>→</span>
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Bottom atmospheric section */}
                <section className="relative text-center py-24">
                    <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.08),transparent_65%)] blur-3xl" />
                    <p className="relative text-xs uppercase tracking-[0.4em] text-white/40 mb-4">
                        Knowledge is Infrastructure
                    </p>
                    <h3 className="relative text-3xl font-semibold text-white">
                        This is not a blog. It’s a knowledge system.
                    </h3>
                </section>

            </div>
        </main>
    );
}
