#GoogleMapNavi

## what's this?
**Google Map Javascript API**を使用したナビゲーションWebアプリです。
食べログ各飲食店情報のページから交通手段に書かれた人手の案内文をもとに
ナビゲーションに表示する案内文を修正し，地図にも反映するように
改良しています

## Usage
admin以下のファイルとMySQLデータベースを適当に作成してください

* ###root.php

    <?php
        $ROOT_DIR = "THIS_SITE_ROOT_URL"

* ###landmarks\_dbinfo.php

    <?php
        $url = 'localhost';
        $user = 'root'; // MySQL user
        $pass = 'password' // MySQLL passwd
        $db = 'landmarks'; // landmark DB
        $tbl = 'namba' // Table Name

* ###食べログDBのフィールド
1. id
2. link 店舗情報ページのURL
3. name 店舗名
4. full\_address 住所
5. short\_address 簡易版住所
6. lat 軽度
7. lng 緯度
8. description 案内文
9. dummy blank
