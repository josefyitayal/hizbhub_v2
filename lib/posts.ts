import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";

const postsDir = path.join(process.cwd(), "blog-contents");

export function getPostSlugs() {
    return fs.readdirSync(postsDir);
}

export async function getPostBySlug(slug: string) {
    const filePath = path.join(postsDir, slug);
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContents);

    const processedContent = await unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkRehype)
        .use(rehypeStringify)
        .process(content);
    const contentHtml = processedContent.toString();

    return {
        slug: slug.replace(/\.md$/, ""),
        frontmatter: data,
        content: contentHtml,
    };
}

export async function getAllPosts() {
    const slugs = getPostSlugs();
    const posts = await Promise.all(
        slugs.map(async (slug) => getPostBySlug(slug))
    );
    return posts.sort((a, b) =>
        new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime()
    );
}
