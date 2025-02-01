import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'posts');

interface Post {
    slug: string;
    title: string;
    date: string;
    category: string;
    description: string;
    read_time: string;
    published: boolean;
}

// 🔹 記事を取得（カテゴリ指定可能）
export function getPosts(category: string) {
    const fileNames = fs.readdirSync(postsDirectory);

    const posts: Post[] = fileNames
        .filter(fileName => fileName.endsWith('.md'))
        .map(fileName => {
            const fullPath = path.join(postsDirectory, fileName);
            const fileContents = fs.readFileSync(fullPath, 'utf8');
            const { data } = matter(fileContents);

            return {
                slug: fileName.replace(/\.md$/, ''),
                title: data.title || 'No Title',
                date: data.date || '1970-01-01',
                category: data.category || 'uncategorized',
                description: data.description || '',
                read_time: data.read_time || 'N/A',
                published: data.published !== false,
            };
        })
        .filter(post => post.published) // `published: false` を除外
        .filter(post => !category || category === 'blogs_all' || post.category === category)
        .sort((a, b) => (a.date < b.date ? 1 : -1)); // 日付降順ソート

    return posts;
}
