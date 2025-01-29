import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';
import ReactMarkdown from 'react-markdown';
import 'zenn-content-css';
import remarkToc from 'remark-toc'; // remark-tocのインポート
import 'zenn-content-css';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { ShareLink } from '../../components/ShareLink';
import X_logo from '../../../public/imgs/X_logo.png';
import Image from "next/image";
import { Markdown_to_Html } from '@/app/components/MarkdownHtml';
import Toc from '@/app/components/Toc';


const PostPage = async ({ params }) => {
    const { slug } = params;
    const filePath = path.join(process.cwd(), 'posts', `${slug}.md`);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    const title = data.title;
    const date = data.date;
    const read_time = data.read_time;

    console.log(filePath);
    console.log(fileContents);
    console.log(title);

    return (
        <div className='bg-gray-200'>
            <Header />
            <div className='md:grid md:grid-cols-[1fr_4fr_1fr]'>
                <div></div>
                <div className="bg-white px-10 mb-10 mt-10 rounded-lg">
                    <div className="flex flex-col text-center mt-10 mb-10">
                        <h1 className='text-black text-3xl font-bold mb-5 mt-3'>{title}</h1>
                        <p className="text-center">Published：{date}　　ReadTime：{read_time}</p>
                        <div className='flex justify-center items-center gap-5 mt-8'>
                            <ShareLink url={`${process.env.BASE_URL}/posts/${slug}`} />
                            <div className='mt-2.5 hover:transform hover:duration-500 hover:scale-110 cursor-pointer'>
                                <a href={`https://twitter.com/intent/tweet?text=&url=https://yuudee.net/posts/${slug}`}>
                                    <Image alt="sns_icon" className='w-7 h-7' src={X_logo} />
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className='znc toc_content'>
                        <div className='grid grid-cols-[1fr_4fr_1fr]'>
                            <div></div>
                            <div className="top-8 rounded-lg border bg-white p-6 dark:text-black dark:dark:bg-neutral-200bg-">
                                <p className="text-xl mb-3 font-medium ">目次</p>
                                <Toc />
                            </div>
                            <div></div>
                        </div>
                        <Markdown_to_Html MarkdownText={content} />
                    </div>
                </div>
                <div></div>
            </div>
            <Footer />
        </div>
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