<?php
require_once('../admin/landmarks_dbinfo.php');
require_once('mylib.php');

//
$under = $_GET['under'];
$above = $_GET['above'];

$dom     = new DOMDocument('1.0');
$node    = $dom->createElement('landmarks');
$parnode = $dom->appendChild($node);

$link   = connectdb4utf8($url, $user, $pass, $db);
$query  = sprintf("SELECT name, link, full_address, lat, lng FROM ".$tbl." WHERE ".$under." < id AND id <= ".$above.";");
$result = mysql_query($query);

if(!$result){ die('Invalid query: '.mysql_error()); }

header('Content-type: text/xml');

while($row = @mysql_fetch_assoc($result)){
    $node = $dom->createElement('landmark');
    $newnode = $parnode->appendChild($node);
    $newnode->setAttribute('name', $row['name']);
    $newnode->setAttribute('full_address', $row['full_address']);
    $newnode->setAttribute('lat', $row['lat']);
    $newnode->setAttribute('lng', $row['lng']);
    $newnode->setAttribute('link', $row['link']);
}
echo $dom->saveXML();
