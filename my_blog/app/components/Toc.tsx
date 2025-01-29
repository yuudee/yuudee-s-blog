'use client'

import { useEffect } from 'react'
import tocbot from 'tocbot'

const Toc = () => {
    useEffect(() => {
        tocbot.init({
            // 目次を表示させる先のクラス名
            tocSelector: '.js-toc',
            // 目次を抽出したい要素のクラス名
            contentSelector: '.toc_content',
            // 目次として抽出する見出しタグ
            headingSelector: 'h1, h2, h3, h4'
        })

        // 不要になったインスタンスを削除
        return () => tocbot.destroy()
    }, [])

    return <nav className="js-toc" />
}

export default Toc;