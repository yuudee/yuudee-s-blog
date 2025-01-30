"use client"
import "zenn-content-css"
import { useEffect } from "react";

const ZennEmbed = () => {
    useEffect(() => {
        import("zenn-embed-elements");
    }, []);

    return null;
}

export default ZennEmbed;
