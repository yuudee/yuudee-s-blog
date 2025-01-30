module.exports = {
    apps: [
        {
            name: "nextjs-blog",          // Next.jsアプリケーションの名前
            script: "npm",                // npmコマンドを使用
            args: "start",                // Next.jsをnext startで起動
            cwd: "./",                    // プロジェクトのルートディレクトリ
            env: {
                NODE_ENV: "production",    // 本番環境で起動
            },
        },
    ],
};