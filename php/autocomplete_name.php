<?php
require_once('../admin/landmarks_dbinfo.php');
require_once('../php/mylib.php');

$name = $_GET['name'];
if($name) $name = "%".$name."%";


$link   = connectdb4utf8($url, $user, $pass, $db);
$query  = sprintf("SELECT name FROM %s where name LIKE '%s'", $tbl, mysql_real_escape_string($name));

$result = mysql_query($query);
if(!$result){ die('Invalid query: '.mysql_error()); }

echo '[';
while($row = mysql_fetch_assoc($result)){
    echo '"'.$row['name'].'",';
}
echo ']';
