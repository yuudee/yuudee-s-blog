import Image from "next/image";
import MysnsButton from "./components/my_sns";
import Link from "next/link"
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import profile_img from '../public/imgs/profile.png'
import PostCard from "./components/PostCard";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-200">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex justify-center gap-2 mb-8">
          <MysnsButton />
        </div>
        <div className="rounded-full rounded-lg">
          <div className="flex justify-center items-center mt-10">
            <Image alt="sns_icon" className="w-20 h-20 rounded-full" src={profile_img} />
          </div>
          <div className="flex flex-col justify-center items-center mb-10">
            <p className="flex justify-center items-center">yuudee</p>
            <p className="flex justify-center items-center">地方国立大のM2</p>
            <p className="flex justify-center items-center">AIセキュリティに関する研究してます</p>
            <p className="flex justify-center items-center">保有資格：FE・AP・SC(未登録)</p>
            <p className="flex justify-center items-center">セキュリティ・サーバー・ネットワーク・AIなどに興味あります</p>
          </div>
        </div>
        <div className="bg-white px-4 py-4 rounded">
          <div className="grid md:grid-cols-2 gap-8">
            <section>
              <div className="bg-[#4e7ecd] text-white p-3 mb-4 rounded-full">
                <h2 className="text-center">最近の記事</h2>
              </div>
              <div>
                <PostCard
                  title="技術ブログの始め方"
                  date="2025-01-28"
                  excerpt="このブログでは、技術ブログの作り方について..."
                  slug="sample"
                />
              </div>
            </section>

            <section>
              <div className="bg-[#4e7ecd] text-white p-3 mb-4 rounded-full">
                <h2 className="text-center">人気の記事</h2>
              </div>
            </section>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mt-8">
            <section>
              <div className="bg-[#4e7ecd] text-white p-3 mb-4 rounded-full">
                <h2 className="text-center">セキュリティ関連記事</h2>
              </div>
            </section>

            <section>
              <div className="bg-[#4e7ecd] text-white p-3 mb-4 rounded-full">
                <h2 className="text-center">機械学習・AI関連記事</h2>
              </div>
            </section>
          </div>
        </div >
      </main >
      <Footer />
    </div >
  )
}