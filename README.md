#GoogleMapNavi

## what's this?
**Google Map Javascript API**を使用したナビゲーションWebアプリです。
ナビゲーションに表示する案内文を修正し，地図にも反映するようにしています

## Usage
admin以下のファイルとMySQLデータベースを適当に作成してください

* __root.php__


        <?php
            $ROOT_DIR = "Site's URL"


* __landmarks\_dbinfo.php__


        <?php
            $url = 'localhost';
            $user = 'root'; // MySQL user
            $pass = 'password' // MySQLL passwd
            $db = 'landmarks'; // landmark DB
            $tbl = 'table' // Table Name


* __食べログDBのフィールド__
    1. id
    2. link 店舗情報ページのURL
    3. name 店舗名
    4. full\_address 住所
    5. short\_address 簡易版住所
    6. lat 軽度
    7. lng 緯度
    8. description 案内文
    9. dummy blank
