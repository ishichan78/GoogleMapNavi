<?php
function connectdb4utf8($url, $user, $pass, $db){
    mb_language('uni');
    mb_internal_encoding('utf-8');
    mb_http_input('auto');
    mb_http_output('utf-8');

    $link = mysql_connect($url, $user, $pass) or die('MySQLへの接続に失敗しました。');
    mysql_set_charset('utf8', $link);
    mysql_select_db($db, $link)               or die('データベースに接続できませんでした。');
    return $link;
}
function quote_smart($value){
    // 数値以外に対してクオートつける
    if(!is_numeric($value)){ $value = "'".mysql_real_escape_string($value)."'"; }
    return $value;
}
