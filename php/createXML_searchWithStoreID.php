<?php
require_once('../admin/landmarks_dbinfo.php');
require_once('mylib.php');

$id = $_GET['id'];

$dom        = new DOMDocument('1.0');
$node       = $dom->createElement('landmarks');
$parnode    = $dom->appendChild($node);

$link   = connectdb4utf8($url, $user, $pass, $db);
$query  = sprintf("SELECT* FROM %s where storeID = %d AND lat <> 0.00000", $tbl2, $id);

$result = mysql_query($query);

if(!$result){ die('Invalid query: '.mysql_error()); }

header('Content-type: text/xml');

while($row = @mysql_fetch_assoc($result)){
    $node       = $dom->createElement('landmark');
    $newnode    = $parnode->appendChild($node);
    $newnode->setAttribute('name', $row['name']);
    $newnode->setAttribute('lat',  $row['lat']);
    $newnode->setAttribute('lng',  $row['lng']);
}
echo $dom->saveXML();
