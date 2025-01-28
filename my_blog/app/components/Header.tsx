import Link from "next/link"

export function Header() {
    return (
        <header>
            <div className="bg-gray-200 text-black p-4">
                <div className="container mx-auto max-w-6xl">
                    <h1 className="text-2xl font-semibold text-center">yuudee&apos;s blog</h1>
                    <p className="text-xs text-center mt-5">
                        備忘録を兼ねた技術ブログのようなものです．誰かのためになれば幸いです．
                    </p>
                </div>
            </div>
            <nav className="bg-gray-200 text-black py-2 border-t border-black">
                <ul className="container mx-auto max-w-6xl flex justify-center items-center gap-8">
                    <li>
                        <Link href="/" className="hover:underline">
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link href="/blogs" className="hover:underline">
                            Blogs All
                        </Link>
                    </li>
                    <li>
                        <Link href="/about" className="hover:underline">
                            About Me
                        </Link>
                    </li>
                    <li>
                        <Link href="/book" className="hover:underline">
                            Book
                        </Link>
                    </li>
                </ul>
            </nav>
        </header>
    )
}
