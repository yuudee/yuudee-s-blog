"use client"
import React, { useEffect, useState } from 'react';
import markdownHtml from 'zenn-markdown-html';
import rehypeSlug from 'rehype-slug';
import { rehype } from 'rehype';
import * as tocbot from 'tocbot';  // 修正: tocbotを名前付きインポート
// MarkdownをHTMLに変換する関数
const Markdown_to_Html = ({ MarkdownText }) => {
    const [htmlContent, setHtmlContent] = useState('');

    useEffect(() => {
        const html = markdownHtml(MarkdownText);

        // rehypeSlugを手動で適用
        rehype()
            .data('settings', { fragment: true })
            .use(rehypeSlug)  // rehypeSlugを適用
            .process(html)    // HTMLをrehypeSlugで処理
            .then((file) => {
                setHtmlContent(String(file));  // 結果を状態にセット
            })
            .catch((error) => {
                console.error('Error processing with rehypeSlug:', error);
            });
    }, [MarkdownText]);

    useEffect(() => {
        // htmlContentが設定された後にtocbotを初期化
        if (htmlContent) {
            tocbot.init({
                tocSelector: '#toc',          // TOCを挿入する場所の指定
                contentSelector: '#content',  // コンテンツの見出しを探す対象
                headingSelector: 'h1, h2, h3', // 見出しのセレクタ
                scrollSmooth: true,           // スクロールをスムーズに
                tocScrollOffset: 50,           // スクロールのオフセット調整
            });
        }

        return () => {
            tocbot.destroy(); // コンポーネントのアンマウント時にtoctbotを破棄
        };
    }, [htmlContent]);  // htmlContentが変更されたときのみ再実行

    return (
        <div className="flex flex-col md:grid md:grid-cols-[10fr_70fr_3fr_30fr_3fr] znc toc_content dark:text-black">
            <div></div>
            <div className="order-2 md:order-none bg-white mb-10 pb-10 px-10 rounded-lg">
                <div id="content" dangerouslySetInnerHTML={{ __html: htmlContent }} />
                {/* <div className="mt-10 " dangerouslySetInnerHTML={{ __html: html }} /> */}
                {/* <Markdown_to_Html MarkdownText={content} /> */}
            </div>
            <div></div>
            <div className="order-1 md:order-none">
                <div className="top-8 rounded-lg border bg-white mb-10 p-6">
                    <p className="text-xl mb-3 font-medium">目次</p>
                    <div id="toc"></div>
                </div>
            </div>
            <div></div>
        </div>
    );
};

export default Markdown_to_Html;
