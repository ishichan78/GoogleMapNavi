<html>
    <head>
        <title>UPDATE short_address</title>
    </head>
    <body>
    <?php
    require_once('landmarks_dbinfo.php');
    require_once('mylib.php');
        
    $sql = 'SELECT id,short_address FROM '.$tbl.';'; // 送信するクエリ
    
    
    // データベースへ接続
    $link = connectdb4utf8($url, $user, $pass, $db);
    
    print('<p>short_address の値を更新します。</p>');
    
    // クエリを送信する
    $result = mysql_query($sql, $link)          or die("クエリの送信に失敗しました。<br />SQL:".$sql);
    
    // 結果セットの行数を取得する
    $rows = mysql_num_rows($result);
    
    // 結果表示用 html 文の生成
    $html = '';
    while($row = mysql_fetch_assoc($result)){
        preg_match("/(大阪府|京都府|北海道|東京都|[一-龠]+[県]){1}([一-龠ぁ-ヶ]+[市区郡町村]){1}([一-龠ぁ-ヶー]+([0-9]+(\-|‐|丁目|丁))*([0-9]+(\-|‐|番地|番))*([0-9]*[号]*))/is", $row['short_address'], $address);
        $address[0] = preg_replace('/曽根崎/', '曾根崎', $address[0]);
        // 文字化け対策
        $address = mb_strimwidth($address[0], 0, 80, '', 'utf-8');
        
        // アップデートクエリ生成
        $sql = sprintf("UPDATE %s SET short_address = %s WHERE id = %s", $tbl, quote_smart($address), quote_smart($row['id']));
        $result_flag = mysql_query($sql);
        if(!$result_flag){ die($row['full_address'].'<br/>'.$address.'<br/>UPDATE クエリーが失敗しました。'.mysql_error()); }
        // 更新後データの表示用 html
        $html .= '<tr>';
        $html .= '<td>'.$row['id']          .'</td>';
        $html .= '<td>'.$address            .'</td>';
        $html .= '<td>'.$row['short_address'].'</td>';
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
    print("<td>address</td>");
    print("<td>full_address</td>");
    print("</tr>");
    print($html);
    print("</table>");
    ?>
    </body>
</html>