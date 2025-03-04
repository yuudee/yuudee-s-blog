import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';
import 'zenn-content-css';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { ShareLink } from '../../components/ShareLink';
import X_logo from '../../../public/imgs/X_logo.png';
import Image from "next/image";
import ZennEmbed from '@/app/components/ZennEmbed';
import Markdown_to_Html from '@/app/components/MarkdownToHtmlZenn';

export async function generateMetadata({ params }) {
    const BASE_URL = "https://yuudee.net"; // ここに本番のドメインを設定
    const { slug } = params;
    const filePath = path.join(process.cwd(), "posts", `${slug}.md`);
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data } = matter(fileContents);

    // data.image が相対パスの場合、絶対パスに変換
    const imageUrl = data.image.startsWith("http")
        ? data.image
        : `${BASE_URL}${data.image}`;

    return {
        title: `${data.title} | yuudee's blog`,
        description: data.description,
        openGraph: {
            title: data.title,
            description: data.description,
            images: [{ url: imageUrl }],
            url: `https://yuudee.net/posts/${slug}`,
        },
    };
}

const PostPage = async ({ params }) => {
    const { slug } = await params;
    const filePath = path.join(process.cwd(), 'others', `${slug}.md`);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    const title = data.title;
    const date = data.date;
    const read_time = data.read_time;

    return (
        <div className='bg-gray-200'>
            <ZennEmbed />
            <Header />
            <div className="flex flex-col text-center mt-10 mb-10 dark:text-black">
                <h1 className='text-black text-3xl font-bold mb-5 mt-3 '>{title}</h1>
                <p className="text-center">Published：{date}　　ReadTime：{read_time}</p>
                <div className='flex justify-center items-center gap-5 mt-8'>
                    <ShareLink url={`${process.env.BASE_URL}/others/${slug}`} />
                    <div className='mt-2.5 hover:transform hover:duration-500 hover:scale-110 cursor-pointer'>
                        <a href={`https://twitter.com/intent/tweet?text=&url=https://yuudee.net/others/${slug}`}>
                            <Image alt="sns_icon" className='w-7 h-7' src={X_logo} />
                        </a>
                    </div>
                </div>
            </div>
            <Markdown_to_Html MarkdownText={content} />
            <Footer />
        </div>
    );
};

export default PostPage;