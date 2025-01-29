"use client"
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import remarkToc from 'remark-toc';
import 'katex/dist/katex.min.css';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import remarkBreaks from 'remark-breaks';
// import Image from "next/image";

const OGPCard = ({ url }) => {
    const [ogpData, setOgpData] = useState(null);

    useEffect(() => {
        const fetchOGP = async () => {
            try {
                const proxyUrl = `https://corsproxy.io/?url=${encodeURIComponent(url)}`;
                const response = await fetch(proxyUrl);
                const html = await response.text();
                const domParser = new DOMParser();
                const dom = domParser.parseFromString(html, 'text/html');
                const ogp = Object.fromEntries(
                    [...dom.head.children]
                        .filter(
                            (element) =>
                                element.tagName === 'META' &&
                                element.getAttribute('property')?.startsWith('og:')
                        )
                        .map((element) => [
                            element.getAttribute('property'),
                            element.getAttribute('content'),
                        ])
                );
                setOgpData(ogp);
                console.log(ogp);
            } catch (error) {
                console.error('Failed to fetch OGP data:', error);
            }
        };

        fetchOGP();
    }, [url]);

    if (!ogpData) {
        return <a href={url}>{url}</a>;
    }

    return (
        <div className='border border-black rounded'>
            <a href={url} target="_blank" rel="noopener noreferrer" className='text-center block'>
                <strong className='block'>{ogpData['og:title'] || 'No title'}</strong>
                {ogpData['og:image'] && (
                    <img
                        src={ogpData['og:image']}
                        alt="OGP"
                        className='mx-auto rounded-lg shadow-lg'
                        style={{ width: '100px', height: 'auto' }}
                    />
                )}
            </a>
        </div>
    );
};

export const Markdown_to_Html = ({ MarkdownText }) => {
    return (
        <ReactMarkdown
            remarkPlugins={[
                remarkBreaks,
                remarkGfm,
                remarkMath,
                [remarkToc, { maxDepth: 3, heading: '目次', tight: true }],
            ]}
            rehypePlugins={[rehypeRaw, rehypeKatex, rehypeSlug]}
            components={{
                code({ inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                        <SyntaxHighlighter
                            style={atomDark}
                            language={match[1]}
                            PreTag="div"
                            {...props}
                        >
                            {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                    ) : (
                        <code className={className} {...props}>
                            {children}
                        </code>
                    );
                },
                a({ href, children }) {
                    return (
                        <div>
                            <OGPCard url={href} />
                            {children}
                        </div>
                    );
                },
                p({ children, ...props }) {
                    return <div {...props}>{children}</div>; {/* <p>を<div>に置き換え */ }
                },
            }}
        >
            {MarkdownText}
        </ReactMarkdown>
    );
};