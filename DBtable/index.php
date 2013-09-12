<html>
<head>
<meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
<title>住所表示</title>

<?php include('../header.php'); ?>

<link href='css/zebra.css' rel='stylesheet'></style>
</head>
<body>
<div id="HEADER">

<?php include('../menu.php'); ?>

</div>  <!-- HEADER END -->

<?php
    require_once('../admin/landmarks_dbinfo.php');
    require_once('../php/mylib.php');
    
    $sql = 'SELECT id,name,full_address,short_address,lat,lng FROM namba'; // 送信するクエリ

    // データベースへ接続
    $link = connectdb4utf8($url, $user, $pass, $db);
    // クエリを送信する
    $result = mysql_query($sql, $link) or die("クエリの送信に失敗しました。<br />SQL:".$sql);
    
    // 結果セットの行数を取得する
    $rows = mysql_num_rows($result);
    
    // 結果表示用 html 文の生成
    $html = '';
    while($row = mysql_fetch_assoc($result)){
        $html .= '<tr>'
                .'<td>'.$row['id'  ]            .'</td>'
                .'<td>'.$row['name']            .'</td>'
                .'<td>'.$row['lat']             .'</td>'
                .'<td>'.$row['lng']             .'</td>'
                .'<td>'.$row['short_address']   .'</td>'
                .'<td>'.$row['full_address']    .'</td>'
                .'</tr>';
    }
    // 結果保持用メモリを解放する
    mysql_free_result($result);
    
    // MySQLへの接続を閉じる
    mysql_close($link) or die("MySQL接続に失敗しました。");
    
    print("<table id='zebraTable' bgcolor='#ffffff' width = '100%' border = '0'>");
    print("<tr bgcolor='# #ccffcc'>");
    print("<td>id</td>");
    print("<td>name</td>");
    print("<td>lat</td>");
    print("<td>lng</td>");
    print("<td width = '350px'>address</td>");
    print("<td>full_address</td>");
    print("</tr>");
    print($html);
    print("</table>");
    ?>
</body>
</html>
