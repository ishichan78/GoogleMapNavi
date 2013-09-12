<?php
require_once('../admin/landmarks_dbinfo.php');
require_once('mylib.php');

$center_lat = $_GET['lat'];
$center_lng = $_GET['lng'];
$radius = $_GET['radius'];

$dom = new DOMDocument('1.0');
$node = $dom->createElement('landmarks');
$parnode = $dom->appendChild($node);

$link = connectdb4utf8($url, $user, $pass, $db);
$query = sprintf("SELECT short_address, name, lat, lng, ( 6371000 * acos( cos( radians('%s') ) * cos( radians( lat ) ) * cos( radians( lng ) - radians('%s') ) + sin( radians('%s') ) * sin( radians( lat ) ) ) ) AS distance FROM %s HAVING distance < '%s' ORDER BY distance LIMIT 0 , 20",
    mysql_real_escape_string($center_lat),
    mysql_real_escape_string($center_lng),
    mysql_real_escape_string($center_lat),
    $tbl,
    mysql_real_escape_string($radius));

$result = mysql_query($query);

if(!$result){ die('Invalid query: '.mysql_error()); }

header('Content-type: text/xml');

while($row = @mysql_fetch_assoc($result)){
    $node = $dom->createElement('landmark');
    $newnode = $parnode->appendChild($node);
    $newnode->setAttribute('name', $row['name']);
    $newnode->setAttribute('short_address', $row['short_address']);
    $newnode->setAttribute('lat', $row['lat']);
    $newnode->setAttribute('lng', $row['lng']);
    $newnode->setAttribute('distance', $row['distance']);
}
echo $dom->saveXML();
