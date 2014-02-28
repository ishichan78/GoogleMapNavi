<html>
    <head>
        <title>UPDATE lat and lng</title>
    </head>
    <body>
    <?php
    require_once('landmarks_dbinfo.php');
    require_once('mylib.php');
    $under = $_GET['under'];
    $top   = $under+1;

    // データベースへ接続
    $link = connectdb4utf8($url, $user, $pass, $db);
    
    echo '<p>lat, lng の値を更新します。</p>';
    
    // クエリを送信する
    $sql = 'SELECT id,short_address FROM '.$tbl.' where lat=0.000000 AND '.$under.' < id AND id <= '.$top.';'; // 送信するクエリ
//    $sql = 'SELECT id,short_address FROM '.$tbl.' where '.$under.' < id AND id <= '.$top.';'; // 送信するクエリ
    $result = mysql_query($sql, $link)          or die("クエリの送信に失敗しました。<br />SQL:".$sql);
    
    // 結果セットの行数を取得する
    $rows = mysql_num_rows($result);
    
    // 結果表示用 html 文の生成
    $html = '';
    $i = 1;
    while($row = mysql_fetch_assoc($result)){
        $address = $row['short_address'];
        $req  = 'http://maps.google.com/maps/api/geocode/xml?address='.urlencode($address).'&sensor=false';
        $xml = simplexml_load_file($req) or die('XML parsing error');
        if($xml->status == 'OK'){
            $lat = $xml->result->geometry->location->lat;
            $lng = $xml->result->geometry->location->lng;
            
            $sql = sprintf("UPDATE %s SET lat = %s, lng = %s WHERE id = %s", $tbl, $lat, $lng, $row['id']);
            $result_flag = mysql_query($sql);
            if(!$result_flag){ die('<br/>UPDATE クエリーが失敗しました。'.mysql_error()); }
            // 更新後データの表示用 html
            $html .= '<tr>';
            $html .= '<td>'.$row['id']          .'</td>';
            $html .= '<td>'.$lat                .'</td>';
            $html .= '<td>'.$lng                .'</td>';
            $html .= '<td>'.$address            .'</td>';
            $html .= '</tr>';
        }
        else echo $row['id'].': '.$address.'  '.$xml->status.'<br/>';
        sleep(5);
    }
    // 結果保持用メモリを解放する
    mysql_free_result($result);
    
    // MySQLへの接続を閉じる
    $close_flag = mysql_close($link) or die("MySQL切断に失敗しました。");
    if($close_flag){ print('<p>切断に成功しました。</p>'); }
    
    print("<table width = '600' border = '0'>");
    print("<tr bgcolor='# #ccffcc'>");
    print("<td>id</td>");
    print("<td>lat</td>");
    print("<td>lng</td>");
    print("<td>address</td>");
    print("</tr>");
    print($html);
    print("</table>");
    ?>
    </body>
</html>