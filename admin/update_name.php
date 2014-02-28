<html>
    <head>
        <title>UPDATE short_address</title>
    </head>
    <body>
    <?php
    require_once('landmarks_dbinfo.php');
    require_once('mylib.php');
    
    $sql = 'SELECT id,name FROM '.$tbl.' WHERE id = 76;'; // 送信するクエリ
    
    
    // データベースへ接続
    $link = connectdb4utf8($url, $user, $pass, $db);
    
    print('<p>name の値を更新します。</p>');
    
    // クエリを送信する
    $result = mysql_query($sql, $link)          or die("クエリの送信に失敗しました。<br />SQL:".$sql);
    
    // 結果セットの行数を取得する
    $rows = mysql_num_rows($result);
    
    // 結果表示用 html 文の生成
    $html = '';
    while($row = mysql_fetch_assoc($result)){
        // アップデートクエリ生成
        $sql = sprintf("UPDATE %s SET name = %s WHERE id = %s", $tbl, quote_smart($row['name']), quote_smart($row['id']));
        $result_flag = mysql_query($sql);
        if(!$result_flag){ die('<br/>UPDATE クエリーが失敗しました。'.mysql_error()); }
        // 更新後データの表示用 html
        $html .= '<tr>';
        $html .= '<td>'.$row['id']          .'</td>';
        $html .= '<td>'.$row['name']        .'</td>';
        $html .= '<td>'.$row['full_address'].'</td>';
        $html .= '</tr>';
    }
    // 結果保持用メモリを解放する
    mysql_free_result($result);
    
    // MySQLへの接続を閉じる
    $close_flag = mysql_close($link) or die("MySQL接続に失敗しました。");
    if($close_flag){ print('<p>切断に成功しました。</p>'); }
    
    print("<table width = '600' border = '0'>");
    print("<tr bgcolor='# #ccffcc'>");
    print("<td>id</td>");
    print("<td>name</td>");
    print("</tr>");
    print($html);
    print("</table>");
    ?>
    </body>
</html>