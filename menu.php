<?php
    require_once('admin/root.php');
    print("<div id='HEADER'>");
    print("<div id='menu'>");
    print("    <ul class='menu'>");
    print("        <li><a href='/wordpress' class='parent'> <span>Home</span></a></li>");
    print("        <li><a href='".$ROOT_DIR."'>             <span>案内図</span></a></li>");
    print("        <li><a href='".$ROOT_DIR."DBtable'>      <span>データベース</span></a></li>");
    print("        <li><a href='".$ROOT_DIR."location'>     <span>店舗の位置確認</span></a></li>");
    print("        <li><a href='".$ROOT_DIR."geocode'>      <span>geocode</span></a></li>");
    print("        <li><a href='/phpMyAdmin'>               <span>phpMyAdmin</span></a></li>");
    print("    </ul>");
    print("</div><!-- menu end -->");
    print("</div><!-- HEADER end -->");
