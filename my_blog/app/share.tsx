"use client"

import React, { useState } from 'react';
// import { useRouter } from 'next/navigation';
import Image from 'next/image';
import share_icon from '../imgs/share_icon.svg'
import "../app/globals.css"

const CopyUrlButton = ({ url }) => {
    // ツールチップの表示・非表示を制御するstate
    const [displayTooltip, setDisplayTooltip] = useState(false);

    const handleCopy = async () => {
        // 現在のURLをクリップボードにコピー
        await navigator.clipboard.writeText(url);

        setDisplayTooltip(true);
        setTimeout(() => {
            setDisplayTooltip(false);
        }, 1500); // 2秒後にメッセージを消す
    };

    return (
        <div className="wrap">
            <div className='tooltip' style={{ opacity: displayTooltip ? 1 : 0 }}>URLをコピーしました</div>
            <div className='hover:transform hover:duration-500 hover:scale-110 cursor-pointer mt-2'><button onClick={handleCopy} className="button"><Image alt="sns_icon" className='w-7 h-7' src={share_icon} /></button></div>
        </div>
    )
};

export default CopyUrlButton;