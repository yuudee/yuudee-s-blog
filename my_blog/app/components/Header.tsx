"use client"
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import under_arrow from "../../public/under_arrow.svg"

export function Header() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    return (
        <header>
            <div className="bg-gray-200 text-black p-4">
                <div className="container mx-auto max-w-6xl">
                    <h1 className="text-2xl font-semibold text-center">yuudee&apos;s blog</h1>
                    <p className="text-l text-center mt-5">
                        備忘録を兼ねた技術ブログのようなものです．誰かのためになれば幸いです．
                    </p>
                </div>
            </div>
            <nav className="bg-gray-200 text-black py-2 border-t border-black">
                <ul className="container mx-auto max-w-6xl flex justify-center items-center gap-8 text-xl">
                    <li>
                        <Link href="/" className="hover:underline">
                            Home
                        </Link>
                    </li>
                    <li className="relative"
                        onMouseEnter={() => setIsDropdownOpen(true)}
                        onMouseLeave={() => setIsDropdownOpen(false)}>
                        <Link href="/blogs/blogs_all" className="hover:underline">
                            Blogs All
                        </Link>
                        <div className={`absolute left-0 mt-2 w-40 bg-white shadow-lg border border-gray-300 rounded-md overflow-hidden transition-all duration-300 ease-in-out -m-10 text-sm ${isDropdownOpen ? 'opacity-100 max-h-60' : 'opacity-0 max-h-0'}`}>
                            <ul>
                                <li>
                                    <Link href="/blogs/blogs_all" className="block px-4 py-2 hover:bg-gray-100 text-center">全ての記事</Link>
                                </li>
                                <li>
                                    <Link href="/blogs/security" className="block px-4 py-2 hover:bg-gray-100 text-center">セキュリティ関連</Link>
                                </li>
                                <li>
                                    <Link href="/blogs/ai_ml" className="block px-4 py-2 hover:bg-gray-100 text-center">AI・機械学習関連</Link>
                                </li>
                                <li>
                                    <Link href="/blogs/self_development" className="block px-4 py-2 hover:bg-gray-100 text-center">自己研鑽・資格取得関連</Link>
                                </li>
                            </ul>
                        </div>
                    </li>
                    <li>
                        <Link href="/others/about_me" className="hover:underline">
                            About Me
                        </Link>
                    </li>
                    <li>
                        <Link href="/others/book" className="hover:underline">
                            Book
                        </Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
}
