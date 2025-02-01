import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'posts');

export function getAllPosts() {
    const fileNames = fs.readdirSync(postsDirectory);

    const posts = fileNames
        .filter(fileName => fileName.endsWith('.md'))
        .map(fileName => {
            const fullPath = path.join(postsDirectory, fileName);
            const fileContents = fs.readFileSync(fullPath, 'utf8');
            const { data } = matter(fileContents);

            return {
                slug: fileName.replace(/\.md$/, ''),
                title: data.title || 'No Title',   // タイトルがない場合のデフォルト
                date: data.date || '0000-00-00',   // dateがない場合のデフォルト
                category: data.category || 'uncategorized',  // カテゴリがない場合のデフォルト
                description: data.description || 'No Description', // 記事の説明がない場合
            };
        });

    // 日付順（降順）にソート
    const sortedPosts = [...posts].sort((a, b) => (a.date < b.date ? 1 : -1));

    // カテゴリごとに分類してソート
    const categorizedPosts = posts.reduce((acc, post) => {
        const category = post.category
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(post);
        return acc;
    }, {});

    // 各カテゴリ内で日付順にソート（降順）し、最大5件まで取得
    Object.keys(categorizedPosts).forEach(category => {
        categorizedPosts[category] = categorizedPosts[category]
            .sort((a, b) => (a.date < b.date ? 1 : -1))
            .slice(0, 3);
    });

    return {
        sortedPosts: sortedPosts.slice(0, 3), // 最近の記事も最大5件まで
        categorizedPosts,
    };
}
