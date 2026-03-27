import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight } from "@hugeicons/core-free-icons";
import { Badge } from "@/components/ui/badge";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Hizbhub Blog - Community, Business & Growth Tips",
    description: "Learn how to grow and monetize your community with tips, guides, and insights from Hizbhub.",
};

export default async function BlogPage() {
    const posts = await getAllPosts();

    return (
        <main className="relative min-h-screen bg-background overflow-hidden">
            {/* Background Atmosphere */}
            <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-emerald-500/5 blur-[120px] rounded-full" />
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02] [mask-image:linear-gradient(to_bottom,white,transparent)]" />

            <div className="relative max-w-7xl mx-auto px-6 py-24 space-y-32">

                {/* Header Section */}
                <section className="relative text-center max-w-3xl mx-auto">
                    <Badge variant="outline" className="mb-6 px-4 py-1 border-zinc-800 text-emerald-500 font-medium tracking-widest uppercase text-[10px]">
                        The Journal
                    </Badge>
                    <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-white mb-6">
                        Hizbhub <span className="text-zinc-500">Journal</span>
                    </h1>
                    <p className="text-lg text-zinc-400 font-light leading-relaxed">
                        Systems, architecture, and insights for building <br className="hidden md:block" />
                        sovereign digital communities in the modern era.
                    </p>
                    <div className="mt-12 h-[1px] w-full bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
                </section>

                {/* Featured Post - Large Bento Style */}
                <section className="group relative overflow-hidden rounded-[3rem] border border-zinc-800/50 bg-zinc-900/20 p-8 md:p-12 transition-all duration-500 hover:border-emerald-500/20">
                    {/* Subtle light leak */}
                    <div className="absolute -top-24 -left-24 h-96 w-96 bg-emerald-500/10 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                    <div className="relative grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                                Featured Insight
                            </div>
                            <h2 className="text-3xl md:text-4xl font-semibold text-white tracking-tight leading-tight">
                                The Architecture of <br /> Digital Sovereignty
                            </h2>
                            <p className="text-zinc-400 text-lg leading-relaxed">
                                Why platforms of the future won’t be social networks — they will be
                                private digital nations built on trust and ownership.
                            </p>
                            <button className="group/btn flex items-center gap-2 text-sm font-bold text-white uppercase tracking-[0.2em]">
                                Read Full Article
                                <HugeiconsIcon icon={ArrowRight} className="h-4 w-4 transition-transform group-hover/btn:translate-x-2" />
                            </button>
                        </div>

                        <div className="relative h-80 w-full rounded-[2rem] overflow-hidden border border-zinc-800">
                            <div className="absolute inset-0 bg-zinc-950/20 z-10 group-hover:bg-transparent transition-colors duration-500" />
                            <Image
                                src="/featured-journal.png"
                                alt="Featured"
                                fill
                                className="object-cover transition-transform duration-1000 group-hover:scale-110"
                            />
                        </div>
                    </div>
                </section>

                {/* Article Grid */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post) => (
                        <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
                            <article className="h-full flex flex-col rounded-[2.5rem] border border-zinc-800/60 bg-zinc-950 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:border-zinc-700 hover:shadow-2xl hover:shadow-emerald-500/5">
                                {/* Thumbnail Container */}
                                <div className="relative h-60 w-full overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent z-10 opacity-60" />
                                    <Image
                                        src={post.frontmatter.thumbnail}
                                        alt={post.frontmatter.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                </div>

                                {/* Content Body */}
                                <div className="p-8 flex flex-col flex-1 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">
                                            {post.frontmatter.category}
                                        </span>
                                        <span className="text-[10px] font-medium uppercase tracking-widest text-zinc-500">
                                            {post.frontmatter.date}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-semibold text-white tracking-tight leading-snug group-hover:text-emerald-400 transition-colors">
                                        {post.frontmatter.title}
                                    </h3>

                                    <p className="text-sm text-zinc-500 leading-relaxed flex-1">
                                        {post.frontmatter.excerpt ?? "Exploring the deeper systems behind digital communities and creator economies."}
                                    </p>

                                    <div className="pt-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors">
                                        <span>Explore</span>
                                        <div className="h-[1px] w-4 bg-zinc-700 transition-all group-hover:w-8 group-hover:bg-emerald-500" />
                                    </div>
                                </div>
                            </article>
                        </Link>
                    ))}
                </section>

                {/* Final Branding Section */}
                <section className="relative text-center py-32 overflow-hidden rounded-[3rem] border border-zinc-900 bg-zinc-950/50">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.03),transparent_70%)]" />
                    <p className="relative text-[10px] uppercase tracking-[0.5em] text-emerald-500/60 mb-6 font-bold">
                        Knowledge is Infrastructure
                    </p>
                    <h3 className="relative text-4xl md:text-5xl font-semibold text-white tracking-tight max-w-2xl mx-auto">
                        This is not a blog. <br />
                        <span className="text-zinc-600">It's a knowledge system.</span>
                    </h3>
                </section>

            </div>
        </main>
    );
}
