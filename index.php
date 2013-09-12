<!DOCTYPE html>
<html dir="ltr">
<head>
<meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
<title>案内図</title>

<?php require_once('header.php'); ?>

</head>
<body style='overflow: auto;'>
<div id='CONTAINER'>

<?php require_once('menu.php'); ?>

<br/>
<div id="MAIN" style="width: 1200px; height: 500px; padding: 0px 30px">
    <div id="CONTROL">
        <label style="color: White" for="origin">現在地:</label><input onblur="route.search(document.getElementById('origin'));" class="form" id="origin" type="textbox" name=""  value="なんば駅" />
        <label style="color: White" for="dest"  >目的地:</label><input onblur="route.search(document.getElementById('dest'  ));" class="form" id="dest"   type="textbox" name=""  value="" />
        <input id="SEARCH"  type="button" value="ルート検索" />
        <input id="CHANGE_MARKER_DISPLAY"type='button' value='マーカー表示切り替え'/>
    </div>

    <div id="map" style=" top:1%; float:left; width:64%; height: 100%"></div>
    <div id="NAVIGATION_TAB"style="float:right; width: 35%;">
        <div class="microtabs">
            <div class="micro">
                <a href="">ナビ</a>
                <div id="page1" style="height:422px"></div>
            </div>
            <div class="micro">
                <a href="">　　　</a>
                <div id="page2" style="overflow: hidden;height:422px">
                    <textarea id="NAVILOCATION" style="width:100%; height:inherit"></textarea>
                </div>
            </div>
        </div>
    </div>  <!-- NAVIGATION_TAB END -->
</div>  <!-- MAIN END -->
</div>  <!-- CONTAINER END -->
</body>
</html>
