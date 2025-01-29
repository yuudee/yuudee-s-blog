"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import share_icon from '../../public/imgs/share_icon.svg'

export const ShareLink = ({ url }) => {
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
        <div>
            <div className='mt-4 hover:transform hover:duration-100 hover:scale-110 cursor-pointer'><button onClick={handleCopy} className="button"><Image alt="sns_icon" className='w-7 h-7' src={share_icon} /></button></div>
        </div>
    )
};