import Image from "next/image";
import MysnsButton from "./components/my_sns";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import profile_img from '../public/imgs/profile.png'
import PostCard from "./components/PostCard";
import { getAllPosts } from "./components/GetMarkdownFile";

export default function Home() {
  const { sortedPosts, categorizedPosts } = getAllPosts();
  return (
    <div className="min-h-screen bg-gray-200">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex justify-center gap-2 mb-8">
          <MysnsButton />
        </div>
        <div className="grid md:grid-cols-[1fr_4fr_1fr] mb-10">
          <div></div>
          <div className="rounded-full rounded-lg border border-black bg-white">
            <div className="flex justify-center items-center mt-10">
              <Image alt="sns_icon" className="w-20 h-20 rounded-full" src={profile_img} />
            </div>
            <div className="w-full flex flex-col justify-center items-center mb-10 dark:text-black">
              <p className="flex justify-center items-center mb-3 text-lg">@yuudee</p>
              <p className="flex justify-center items-center">地方国立大のM2</p>
              <p className="flex justify-center items-center">AIセキュリティに関する研究してます</p>
              <p className="flex justify-center items-center">保有資格：FE・AP・SC(未登録)</p>
              <p className="flex justify-center items-center">セキュリティ・サーバー・ネットワーク・AIなどに興味あります</p>
            </div>
          </div>
          <div></div>
        </div>

        <div className="bg-white grid md:grid-cols-2 gap-10 rounded -ml-10 -mr-10">
          {/* 最近の記事 */}
          <section className="mt-10 ml-7 mr-5">
            <div className="bg-[#4e7ecd] text-white p-3 mb-6 rounded-full">
              <h2 className="text-center text-xl font-semibold">最近の記事</h2>
            </div>
            <div className="list-disc">
              {sortedPosts.map(post => (
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
          </section>

          {/* セキュリティ関連カテゴリ */}
          <section className="mt-10 mr-5 ml-7">
            <div className="bg-[#4e7ecd] text-white p-3 mb-6 rounded-full">
              <h2 className="text-center text-xl font-semibold">ネットワーク・セキュリティ関連記事</h2>
            </div>
            <ul className="list-disc">
              {categorizedPosts.security.map(post => (
                <PostCard
                  key={post.slug}
                  title={post.title}
                  date={post.date}
                  read_time={post.read_time}
                  excerpt={post.description}
                  slug={post.slug}
                />
              ))}
            </ul>
          </section>

          {/* 自己啓発・資格取得カテゴリ */}
          <section className="mt-3 ml-7 mr-5">
            <div className="bg-[#4e7ecd] text-white p-3 mb-4 rounded-full">
              <h2 className="text-center text-xl font-semibold">その他(資格・自己研鑽など)記事</h2>
            </div>
            <ul className="list-disc">
              {categorizedPosts.self_development.map(post => (
                <PostCard
                  key={post.slug}
                  title={post.title}
                  date={post.date}
                  read_time={post.read_time}
                  excerpt={post.description}
                  slug={post.slug}
                />
              ))}
            </ul>
          </section>

          {/* AI / 機械学習カテゴリ */}
          <section className="mt-3 mr-5 mb-10 ml-7">
            <div className="bg-[#4e7ecd] text-white p-3 mb-4 rounded-full">
              <h2 className="text-center text-xl font-semibold">AI・機械学習関連記事</h2>
            </div>
            <ul className="list-disc">
              {categorizedPosts.AI_ML.map(post => (
                <PostCard
                  key={post.slug}
                  title={post.title}
                  date={post.date}
                  read_time={post.read_time}
                  excerpt={post.description}
                  slug={post.slug}
                />
              ))}
            </ul>
          </section>
        </div>
      </main >
      <Footer />
    </div >
  )
}