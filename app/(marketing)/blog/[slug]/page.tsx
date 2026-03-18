import { getPostBySlug, getPostSlugs } from "@/lib/posts";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export async function generateStaticParams() {
    const slugs = getPostSlugs();
    return slugs.map((slug) => ({
        slug: slug.replace(/\.md$/, ""),
    }));
}

export default async function PostPage({
    params,
}: {
    params: { slug: string };
}) {
    const { slug } = await params;

    const post = await getPostBySlug(`${slug}.md`);

    if (!post) {
        return <p>Post not found.</p>;
    }

    return (
        <main className="max-w-4xl mx-auto p-6">
            <article className="space-y-8">
                <div className="space-y-4 text-center">
                    <Badge variant="outline">{post.frontmatter.category}</Badge>
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
                        {post.frontmatter.title}
                    </h1>
                    <p className="text-muted-foreground">{post.frontmatter.date}</p>
                </div>

                <div className="relative h-96 w-full">
                    <Image
                        src={post.frontmatter.thumbnail}
                        alt={`${post.frontmatter.title} thumbnail`}
                        width={500}
                        height={500}
                        className="rounded-lg h-full w-full object-cover"
                    />
                </div>

                <div
                    className={cn(
                        '[&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-4',
                        '[&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-3',
                        '[&_h3]:text-lg [&_h3]:font-bold [&_h3]:mb-2',
                        '[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4',
                        '[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4',
                        '[&_li]:mb-1',
                        '[&_blockquote]:border-l-4 [&_blockquote]:border-blue-400 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:mb-4',
                        '[&_pre]:bg-gray-800 [&_pre]:text-white [&_pre]:p-3 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:mb-4',
                        '[&_pre]:shadow-inner',
                        '[&_a]:text-blue-600 [&_a]:underline',
                        '[&_a:hover]:cursor-pointer',
                        '[&_hr]:my-4',
                        '[&_p]:mb-4',
                        '[&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:my-6'
                    )}
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />
            </article>
        </main>
    );
}
