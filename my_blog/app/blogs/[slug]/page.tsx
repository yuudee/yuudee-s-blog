import { Header } from '@/app/components/Header';
import { Footer } from '@/app/components/Footer';
import PostCard from "@/app/components/PostCard";
import { getPosts } from "@/app/components/GetMarkdownFileAll";

export async function generateStaticParams() {
    return [
        { category: 'security' },  // セキュリティ
        { category: 'self_development' }, // その他記事
        { category: 'AI_ML' }  // AI・機械学習
    ];
}

const CategoryPage = async ({ params }) => {
    const param_slug = await params;
    const { slug } = param_slug;
    const posts = getPosts(slug);
    const categoryName = (slug) => {
        if (slug === 'blogs_all') {
            return 'Blogs ALL';
        } else if (slug === 'security') {
            return 'セキュリティ関連記事';
        } else if (slug === 'ai_ml') {
            return 'AI機械学習関連記事';
        } else if (slug === 'self_development') {
            return 'その他(資格・自己研鑽など)記事';
        } else {
            return `${slug} 記事`;
        }
    };
    const categoryNameText = categoryName(slug);

    return (
        <div className="min-h-screen bg-gray-200">
            <Header />
            <main className="container mx-auto px-4 py-8 max-w-7xl dark:text-black">
                <h1 className="text-3xl font-bold text-center mb-8">{categoryNameText}</h1>
                <div className="grid md:grid-cols-[1fr_100fr_1fr] gap-10 mb-5">
                    <div></div>
                    <div>
                        <div className='bg-white gap-5 rounded'>
                            <div className='bg-white gap-5 rounded'>
                                {posts.length > 0 ? (
                                    <div className='grid md:grid-cols-[1fr_1fr_1fr]'>
                                        {posts.map(post => (
                                            <PostCard
                                                key={post.slug}
                                                title={post.title}
                                                date={post.date}
                                                read_time={post.read_time}
                                                excerpt={post.description}
                                                slug={post.slug}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center text-gray-600 p-4">該当する記事がありません。</p>
                                )}
                            </div>
                        </div>
                    </div>
                    <div></div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default CategoryPage;
