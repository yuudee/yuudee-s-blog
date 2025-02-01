import { Header } from '@/app/components/Header';
import { Footer } from '@/app/components/Footer';
import PostCard from "@/app/components/PostCard";
import { getPosts } from "@/app/components/GetMarkdownFileAll";

export async function generateStaticParams() {
    return [
        { category: 'security' },  // セキュリティ
        { category: 'self_development' }, // 自己啓発
        { category: 'AI_ML' }  // AI・機械学習
    ];
}

const CategoryPage = async ({ params }) => {
    const param_slug = await params;
    const { slug } = param_slug;
    const categoryName = slug === 'blogs_all' ? '全ての記事' : `${slug} 記事`;
    const posts = getPosts(slug);

    return (
        <div className="min-h-screen bg-gray-200">
            <Header />
            <main className="container mx-auto px-4 py-8 max-w-7xl">
                <h1 className="text-3xl font-bold text-center mb-8">{categoryName}</h1>
                <div className="grid md:grid-cols-2 gap-10">
                    {posts.length > 0 ? (
                        posts.map(post => (
                            <PostCard
                                key={post.slug}
                                title={post.title}
                                date={post.date}
                                read_time={post.read_time}
                                excerpt={post.description}
                                slug={post.slug}
                            />
                        ))
                    ) : (
                        <p className="text-center text-gray-600">該当する記事がありません。</p>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default CategoryPage;
