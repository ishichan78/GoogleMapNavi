<?php
require_once('../admin/landmarks_dbinfo.php');
require_once('mylib.php');

$north = $_GET['n'];
$east  = $_GET['e'];
$west  = $_GET['w'];
$south = $_GET['s'];

$dom        = new DOMDocument('1.0');
$node       = $dom->createElement('landmarks');
$parnode    = $dom->appendChild($node);

$link   = connectdb4utf8($url, $user, $pass, $db);
$query  = sprintf("SELECT name, lat, lng FROM %s WHERE ('%s' < lat and lat < '%s') and ('%s' < lng and lng < '%s')",// LIMIT 0 , 50",
    $tbl2,
    mysql_real_escape_string($south),
    mysql_real_escape_string($north),
    mysql_real_escape_string($west),
    mysql_real_escape_string($east));

$result = mysql_query($query);

if(!$result){ die('Invalid query: '.mysql_error()); }

header('Content-type: text/xml');

while($row = @mysql_fetch_assoc($result)){
    $node       = $dom->createElement('landmark');
    $newnode    = $parnode->appendChild($node);
    $newnode->setAttribute('name',          $row['name']);
    $newnode->setAttribute('lat',           $row['lat']);
    $newnode->setAttribute('lng',           $row['lng']);
}
echo $dom->saveXML();
