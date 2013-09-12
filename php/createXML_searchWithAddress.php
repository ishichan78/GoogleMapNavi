<?php
require_once('../admin/landmarks_dbinfo.php');
require_once('mylib.php');

//
$address = $_GET['address'];
//if($address) $address = $address."%";


$dom     = new DOMDocument('1.0');
$node    = $dom->createElement('landmarks');
$parnode = $dom->appendChild($node);
$link = connectdb4utf8($url, $user, $pass, $db);
$query = sprintf("SELECT id, name, lat, lng FROM %s WHERE name LIKE '%s' union select id, name, lat, lng FROM 出発地点リスト WHERE name LIKE '%s' LIMIT 0 , 1",
    $tbl,
   // mysql_real_escape_string($a[ddress),
    mysql_real_escape_string($address),mysql_real_escape_string($address));
$result = mysql_query($query);

$result = mysql_query($query);
if(!$result){ die('Invalid query: '.mysql_error()); }

header('Content-type: text/xml');

while($row = @mysql_fetch_assoc($result)){
    $node = $dom->createElement('landmark');
    $newnode = $parnode->appendChild($node);
    $newnode->setAttribute('id', $row['id']);
    $newnode->setAttribute('name', $row['name']);
  //  $newnode->setAttribute('short_address', $row['short_address']);
    $newnode->setAttribute('lat', $row['lat']);
    $newnode->setAttribute('lng', $row['lng']);
}
echo $dom->saveXML();
