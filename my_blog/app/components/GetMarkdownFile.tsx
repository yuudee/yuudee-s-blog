import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'posts');

export function getAllPosts() {
    interface Post {
        slug: string;
        title: string;
        date: string;
        category: string;
        description: string;
        read_time: string;
    }

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
            };
        });

    // カテゴリごとに分類（カテゴリがない場合も空の配列を確保）
    const categorizedPosts: Record<string, Post[]> = {
        security: [],
        self_development: [],
        AI_ML: [],
    };

    posts.forEach(post => {
        const category = post.category;
        if (!categorizedPosts[category]) {
            categorizedPosts[category] = [];
        }
        categorizedPosts[category].push(post);
    });

    // 各カテゴリで最大3件取得
    Object.keys(categorizedPosts).forEach(category => {
        categorizedPosts[category] = categorizedPosts[category]
            .sort((a, b) => (a.date < b.date ? 1 : -1))
            .slice(0, 3);
    });

    return {
        sortedPosts: posts.sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 3),
        categorizedPosts,
    };
}
