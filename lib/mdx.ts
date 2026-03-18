// lib/mdx.ts
import fs from 'fs';
import path from 'path';

const postsDirectory = path.join(process.cwd(), 'content/posts');

export async function getPosts() {
    const filenames = fs.readdirSync(postsDirectory);

    const posts = await Promise.all(
        filenames.map(async (filename) => {
            const slug = filename.replace(/\.mdx$/, '');
            const { meta } = await import(`@/blog-contents/${filename}`);
            return {
                slug,
                ...meta,
            };
        })
    );

    return posts;
}
