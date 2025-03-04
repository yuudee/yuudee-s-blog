---
title: 'VPSにメールサーバ構築してみた(SPF，DKIM，DMARC対応)'
date: '2025/03/04'
read_time : '1h'
image: '/imgs/eyecatch/mail_server.png'
description: 'VPSにメールサーバを構築してみた(SPF，DKIM，DMARC対応)'
category: 'security'
published: true
---

# 概要
今回はさくらのVPS上に自前のメールサーバを構築して，SPFやDKIM，DMARCの設定までしてみたので各種技術の解説とメールサーバ構築手順などをアウトプットもかねて紹介しようと思います．
## 目指すもの
- メールの送受信ができること
- メールクライアント上で送受信が確認できること
- SSL対応すること
- SPF・DKIM，DMARCなどの送信元ドメイン認証技術について理解すること

# 環境について
- サーバ
  - さくらのVPS（ドメイン取得済み）
- 使用ソフトウェア
  - メール転送エージェント(MTA)に`postfix`を使用
  - IMAP/POP3用のソフトウェアとして`dovecot`を使用

# メール認証技術
## SPF (Sender Policy Framework)
![SPF_image](/mail_server/SPF.png)
- SPFとは
  - そのメールが正規のメールサーバから届いたものかを確認するための送信元ドメイン認証技術
  - エンベロープFromに記載されたドメインについてDNSサーバに問い合わる
  - SPFレコードに記載されたIPアドレスと，HELOコマンドで取得した送信元メールサーバのIPアドレスが一致した場合Pass，一致しない場合はFailとなる
- SPFレコードの設定方法
  - DNSのTXTレコードに設定
  - `v=spf1 ip4:192.0.2.1 -all`
  - `~all`は**SoftFail**とも呼ばれ，SPFレコードに記載されていないアドレスのメールも破棄することなく，迷惑メール扱いにする
  - `-all`は**HardFail**とも呼ばれ，SPFレコードに記載されていないアドレスから受信した際は拒否する
- SPFの問題点
  - 悪意を持った攻撃者が自ドメインにSPFレコードを設定していた場合はPassとなってしまう
  - エンベロープFromをもとに認証するため，ヘッダーFromが偽装されていた場合に気づくにくい
    - ヘッダーFromとReceivedヘッダーが違うメールアドレスであることに気づければ・・・？
  - そもそもSPFレコードが設定されていないと認証結果が`none`になってしまう

## DKIM (DomainKeys Identified Mail)
![DKIM_image](/mail_server/DKIM.png)
- DKIMとは
  - そのメールが正規のメールサーバから届いたものかを確認，また内容が改ざんされていないことを確認するための送信元ドメイン認証技術
  - 送信するメールをハッシュ化したものを`送信者の秘密鍵`で暗号化することで作成した署名をメールに付加
  - 受信者はエンベロープFromに記載されたアドレスについてDNSに問い合わせ，DKIMレコードを確認
  - DKIMレコードに記載された`送信者の公開鍵`を用いて署名を検証
  - メールをハッシュ化したものと署名を検証したものが一致すれば正規のユーザから送信されたかつ改ざんされていないことが確認できる
  - ＊公開鍵で復号できたということは相手が対になる秘密鍵を持っているということ
- DKIMレコードの設定方法
  - DNSのTXTレコードに設定
  - 現在はDKIMはRSAにのみ対応している？
  - `v=DKIM1; k=rsa;p=受信者の公開鍵`
- DKIMの問題点
  - SPFの問題点と同様

## DMARC (Domain-based Message Authentication, Reporting and Conformance)
- DMARCとは
  - SPFやDKIMで検証できなかった場合の処理方法を指示し，結果（レポート）を報告できる技術
  - SPFとDKIMではエンベロープFromに記載されたアドレスをもとにDNSに問い合わせていたが，それではヘッダーFromが偽装された場合に対応できなかった(エンベロープFromとヘッダーFromが同一とは限らない)
  - ヘッダーFromのドメインに対してSPFやDKIMによる認証を行い，ヘッダーFromとエンベロープFromが同一であり，かつSPF，DKIMをPassしているかどうかを確認
  - 認証状況に応じてそのメールをどう扱うかを制御する
- DMARCポリシーの設定
  - DNSのTXTレコードに設定
  - `v=DMARC1; p=none; rua=mailto:hoge@example.com`
  - `p=`の挙動
    - `none`：何もしない．認証失敗してもそのまま配信
    - `quarantine`：認証失敗時は迷惑メールなどとして隔離
    - `reject`：認証失敗時は削除
  - `rua`：レポートの送信先

# メールサーバの構築手順
:::message
設定ファイルを編集する際はもしもの時のために編集前にバックアップを取るようにしましょう！
:::

## 事前準備
- DNSの設定
  - 今回はメールサーバはmail.example.comで運用することとします
  - DNSサーバのMXレコードにmail.example.comを記述
    - MXレコードとはそのドメインのメールサーバのドメインを示すものです．
  - またCNAMEレコードとしてエントリ名`mail`に対応するデータとしてそのサーバのIPを設定しておきます．
  - これで`mail.example.com`を名前解決した結果，サーバのIPが返ってくるようになります．
  - 以下のコマンドでDNSの設定が反映されたかを確認できます．
  ```
  host -t mx example.com
  example.com mail is handled by 10 mail.example.com.
  ```
- SSLサーバ証明書の準備
  - Let's encryptで取得済みであることとします．

:::message alert
すでに`example.com`で取得している証明書を`mail.example.com`でも使おうとすると正しく機能しません．(`mail.example.com`は証明書に含まれていないので)
以下のコマンドで証明書の更新を行うようにしましょう．
`sudo certbot certonly --standalone -d example.com -d mail.example.com`
:::

## Postfixの設定
### インストール
```
sudo yum install -y postfix
```
### 基本設定
- `/etc/postfix/main.cf`を開く
- 以下の内容を追記・変更
```
myhostname = mail.example.com
mydomain = mail.example.com
myorigin = $mydomain
inet_interfaces = all
mydestination = $myhostname, localhost.$mydomain, localhost, $mydomain
local_recipient_maps = unix:passwd.byname $alias_maps
home_mailbox = Maildir/
smtpd_banner = $myhostname ESMTP

smtp_tls_security_level = may
smtpd_tls_cert_file = /etc/letsencrypt/live/example.com/fullchain.pem
smtpd_tls_key_file = /etc/letsencrypt/live/example.com/privkey.pem
smtpd_tls_session_cache_database = btree:/var/lib/postfix/smtpd_scache
smtpd_tls_session_cache_timeout = 3600s
smtpd_tls_received_header = yes
smtpd_tls_loglevel = 1

# 追記
# SMTP_AUTH
smtpd_sasl_auth_enable = yes
smtpd_sasl_type = dovecot
smtpd_sasl_path = private/auth
smtpd_recipient_restrictions = permit_mynetworks permit_sasl_authenticated reject_unauth_destination
```
- `/etc/postfix/master.cf`を開く
- 以下の内容を追記・変更
```
submission inet n       -       n       -       -       smtpd

smtps     inet  n       -       n       -       -       smtpd
  -o syslog_name=postfix/smtps
  -o smtpd_tls_wrappermode=yes
  -o smtpd_sasl_auth_enable=yes
# -o smtpd_reject_unlisted_recipient=no
# -o smtpd_client_restrictions=$mua_client_restrictions
# -o smtpd_helo_restrictions=$mua_helo_restrictions
# -o smtpd_sender_restrictions=$mua_sender_restrictions
# -o smtpd_recipient_restrictions=
  -o smtpd_relay_restrictions=permit_sasl_authenticated,reject
# -o milter_macro_daemon_name=ORIGINATING
```
- 記述方法が正しいかを確認
  - これは文法的に正しいかをチェックするだけなので，エラーが出なくても意図しない挙動になる場合があります．
```
sudo postfix check
```
- 起動・自動起動の設定
```
sudo systemctl start postfix
sudo systemctl enable postfix
```
- テストメールを送信
  - この場合の送り主はhoge@mail.example.comになります
  - メールが届いていればOKです．
  - ログなどは`/var/log/maillog`などをみるといいと思います．
```
sendmail -t <<EOL
From:hoge
To: (送り先のメールアドレス)
Subject:test
test
EOL
```

## Dovecotの設定
### インストール
```
sudo yum install -y dovecot
```
### IMAP/POP3の設定
- 今回はPOP3は使わずにIMAPのみを使用します．
- `/etc/dovecot/dovecot.conf`を開く
```
＊pop3を使う場合はここに追記してください
protocols = imap
```
- `/etc/dovecot/conf.d/10-auth.conf`を開く
```
disable_plaintext_auth = no
auth_mechanisms = plain login
```
- `/etc/dovecot/conf.d/10-auth.conf`を開く
```
mail_location = maildir:~/Maildir
```
- `/etc/dovecot/conf.d/10-auth.conf`を開く
:::message alert
以下の`ssl_cert`，`ssl_key`の値の最初の`<`は誤字ではありません！！！！！
これがないと送受信できません．
:::
```
ssl = required
ssl_cert = </etc/letsencrypt/live/example.com/fullchain.pem
ssl_key = </etc/letsencrypt/live/example.com/fullchain.pem
```
- `/etc/dovecot/conf.d/10-master.conf`を開く
```
 # Postfix smtp-auth
  unix_listener /var/spool/postfix/private/auth {
    mode = 0666
    user = postfix
    group = postfix
  }
```
- `/etc/dovecot/conf.d/10-mail.conf`
```
#POP3に関しては今回は使わないので書かなくてもいいです．
service pop3-login {
  inet_listener pop3 {
    port = 0
  }
  inet_listener pop3s {
    port = 995
    ssl = yes
  }
}

service imap-login {
  inet_listener imap {
    port = 0
  }
  inet_listener imaps {
    port = 993
    ssl = yes
  }
}
```
### 起動・自動起動の設定
```
sudo systemctl start dovecot
sudo systemctl enable dovecot
```

## firewallの設定
- SMTPS，IMAPS用のポートを開けます
  - 各サービスがどのポートで待ち受けているかは`/usr/lib/firewalld/services/(サービス名).xml`で確認できます．
```
sudo firewall-cmd --add-service=smtps --permanent
sudo firewall-cmd --add-service=imaps --permanent
sudo firewall-cmd --reload
```
## ユーザの作成
- `hoge`というユーザを作成する場合
 - hoge@mail.example.comというアドレスになります
```
useradd hoge
passwd hoge

mkdir /home/hoge/Maildir
mkdir /home/hoge/Maildir/cur
mkdir /home/hoge/Maildir/new
mkdir /home/hoge/Maildir/tmp
chown -R hoge:hoge /home/hoge/Maildir/*
```

## メールクライアントで送受信を行う方法
- 今回はThenderbirdを使用します．
- 各種入力項目は以下の通り
	- 受信サーバ
	  - プロトコル：IMAP
		- ホスト名：mail.example.com
		- ポート番号：993
		- 接続の保護：SSL/TLS
		- 認証方式：通常のパスワード認証
		- ユーザ名：hoge@mail.example.com
	- 送信サーバ
		- ホスト名：mail.example.com
		- ポート番号：465
		- 接続の保護：SSL/TLS
		- 認証方式：通常のパスワード認証
		- ユーザ名：hoge@mail.example.com


## SPFの設定について
- 以下の内容をDNSのTXTレコードに追記
  - example.comのAレコードに登録されているIPアドレスからのメール送信を許可
  - example.comのMXレコードに登録されているメールサーバからの送信を許可します
  - それ以外は絶対に拒否(HardFail)
  - エントリ名は`@`
```
"v=spf1 a:example.com mx -all"
```

## DKIMの設定について
### インストール
```
sudo yum install -y opendkim
sudo yum install -y opendkim-tools
```
### 鍵ペアの作成
- DNSに登録するための鍵ペアを作成して所有者を変更する
- DKIMキーローテーションの名前は日付でつけることが多い？らしい
- `-D`で出力先の指定，`-d`でドメインの指定，`-s`でファイル名の指定
```
mkdir -p /etc/opendkim/keys/example.com
opendkim-genkey -D /etc/opendkim/keys/example.com/ -d mail.example.com -s 20250222

ls
20250222.private  20250222.txt

sudo chown -R opendkim:opendkim /etc/opendkim/keys/example.com/
```

### DNSに登録
- `20250222.txt`に記載されたかっこの中身をDNSのTXTレコードに記載
  - エントリ名は`20250222._domainkey.mail`にする.

### opendkim.confの修正
```
vim opendkim.conf

Mode    sv
#KeyFile        /etc/opendkim/keys/default.private
KeyTable       /etc/opendkim/KeyTable
SigningTable   refile:/etc/opendkim/SigningTable
ExternalIgnoreList     refile:/etc/opendkim/TrustedHosts
InternalHosts  /refile:/etc/opendkim/TrustedHosts
SoftwareHeader  no
Socket  inet:8891@localhost
```

### keytableの変更
```
sudo vim /etc/opendkim/KeyTable
20250222._domainkey.mail.example.com mail/example.com:20250222:/etc/opendkim/keys/example.com/20250222.private
```

### SigningTableの変更
```
sudo vim /etc/opendkim/SigningTable
*@mail.example.com 20250222._domainkey.mail.example.com
```

### 起動・自動起動
```
systemctl start opendkim
systemctl enable opendkim
```

### postfixの修正
```
vim /etc/postfix/main.cf
smtpd_milters = inet:127.0.0.1:8891
non_smtpd_milters = $smtpd_milters
milter_default_action = accept

postfix check
```

## DMARCの設定について
- 以下の内容をDNSのTXTレコードとして記載
- エントリ名は`_dmarc`
```
v=DMARC1; p=quarantine; rua=mailto:hoge@mail.example.com
```

# おわりに
今回はVPS上に自前のメールサーバを構築する手順について紹介しました．
構築以前にメール周りに技術について勉強して，そのあとに実際にSPFやDKIMの設定などを行いました．
やはり実際に自分で手を動かすのが理解ができますね．

皆さんもぜひやってみてください

いかに参考にさせていただいた本や，サイトなどを紹介しておきます．
- https://www.rem-system.com/mail-postfix02/
- https://baremail.jp/blog/2024/03/25/3739/
- 翔泳社，増井敏克著，メール技術の教科書