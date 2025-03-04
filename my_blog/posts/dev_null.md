---
title: '/dev/nullって結局何？'
date: '2025/02/07'
read_time : '10m'
image: '/imgs/eyecatch/dev_null.png'
description: 'Linux触っててよく見る/dev/nullについて'
category: 'security'
published: true
---


# はじめに

Linuxを触っているとコマンドの実行例などで `/dev/null` という文字列をよく見ると思います．

私自身この記事を書くまではなんか魔法のコマンド程度に考えていましたが，勉強する機会があったので記事にしてみたいと思います．

# /dev/nullとは何なのか？

結論から言うと `/dev/null` とは `何でも吸い込んで何も返さないファイル` という性質であり

まさにブラックホール的なファイルです．

実際に `echo "hello" > /dev/null` を実行してみます．

これは `/dev/null` に `Hello` という文字列を書き込むというコマンドです．

```python
echo "hello" > /dev/null
cat /dev/null

<何も表示されない>
```

このように書きこんだはずなのに何も表示されません．

通常であれば以下のような動作をするはずです．

```python
echo "Hello" > hoge
cat hoge

Hello
```

このことからまさに`何でも吸い込んで何も返さないファイル` という性質がわかるかと思います．

# いつ使うのか？

何も格納しない`/dev/null` ですがいったいいつ使うのでしょうか？

よく使われる場面としては標準出力や標準エラーなどを破棄するときに使われます．

おそらく`/dev/null` が使われる場面の多くで `2>` や `1>` などと一緒に使われることが多いと思います．

使い方としては `command 1> /dev/null` や`command 1> /dev/null` などのように用いられます．

これらは標準出力，標準エラー出力を表しており，フィルターのような役割を果たしています．

`command 1> /dev/null` ：標準出力を `/dev/null` に吐き出して標準エラーのみを表示

`command 2> /dev/null` ：標準エラーを `/dev/null` に吐き出して標準出力のみを表示

実際に試してみました．

以下のようなディレクトリ構造があるとします．

```python
.
├── [drwx------ root     root    ]  test_dir
│   ├── [-rwx------ root     root    ]  test_file
│   ├── [-rwx------ root     root    ]  test_file1
│   ├── [-rwx------ root     root    ]  test_file2
│   └── [-rwx------ root     root    ]  test_file3
└── [drwxrwxrwx alma     alma    ]  test_dir_noroot
    ├── [-rwxrwxrwx alma     alma    ]  test_file
    ├── [-rwxrwxrwx alma     alma    ]  test_file1
    ├── [-rwxrwxrwx alma     alma    ]  test_file2
    └── [-rwxrwxrwx alma     alma    ]  test_file3
```

ここでは `test_dir` にはrootのみ権限が， `test_dir_noroot`には非rootユーザでも権限があります．　

これらディレクトリからfindコマンドで「test_」というファイル名を検索してみます．

```python
find ./ -name "test_*"

find: ‘./test_dir’: Permission denied
./test_dir_noroot/test_file3
./test_dir_noroot/test_file2
./test_dir_noroot/test_file1
./test_dir_noroot/test_file
```

このように `find: ‘test_dir/*’: Permission denied` というエラーメッセージが出力されます．

ここでいうPermmision deniedが標準エラー出力，各ディレクトリまでの相対パスが標準出力を表します．

ここで標準エラー出力のみを表示させたいときに`command 1> /dev/null` を使います．

```jsx
find ./ -name "test_*" 1> /dev/null

find: ‘./test_dir’: Permission denied
```

このように標準エラー出力のみが表示されました．

また標準出力のみを表示させたいときは`command 2> /dev/null` を使います．

```jsx
find ./ -name "test_*" 2> /dev/null

./test_dir_noroot
./test_dir_noroot/test_file3
./test_dir_noroot/test_file2
./test_dir_noroot/test_file1
./test_dir_noroot/test_file
./test_dir
```

このように標準出力のみを表示することができています．

ちなみに以下のような書き方をすれば標準出力先と標準エラー出力先を分けて書き込むことができます．

```jsx
find ./ -name "test_*" 2> ./error.log 1>./output.log

cat output.log
./test_dir_noroot
./test_dir_noroot/test_file3
./test_dir_noroot/test_file2
./test_dir_noroot/test_file1
./test_dir_noroot/test_file
./test_dir

cat  error.log
find: ‘./test_dir’: Permission denied
```

# さいごに

今回はよく見るけど何かはあまり知らなかった `/dev/null` についてまとめてみました．

シェル書く時とかにもよくつかわれるみたいなので活用していきたいです．