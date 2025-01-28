import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';
import ReactMarkdown from 'react-markdown';
import markdownHtml from 'zenn-markdown-html';
import 'zenn-content-css';
import { Header } from '../../components/Header'
import Image from 'next/image';
import { Footer } from '../../components/Footer'

const PostPage = async ({ params }) => {
    const { slug } = params;
    const filePath = path.join(process.cwd(), 'posts', `${slug}.md`);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    const title = data.title; // 記事のタイトル
    const date = data.date //公開日
    const read_time = data.read_time
    const html = markdownHtml(content);

    console.log(filePath);
    console.log(fileContents);
    console.log(title);
    return (
        <div
            // "znc"というクラス名を指定する
            className="znc"
            // htmlを渡す
            dangerouslySetInnerHTML={{
                __html: html,
            }}
        />
    );
};

// export async function generateStaticParams() {
//     const postsDirectory = path.join(process.cwd(), 'posts');
//     const filenames = fs.readdirSync(postsDirectory);
//     console.log(filenames);
//     return filenames.map((filename) => {
//         return {
//             slug: filename.replace(/\.md$/, ''),
//         };
//     });
// }

export default PostPage;