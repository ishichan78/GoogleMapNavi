<!DOCTYPE html>
<html>
<head>
<meta http-equiv='Content-Type' content='text/html; charset=UTF-8' />
<title>経緯度取得適正確認</title>

<?php require_once('../header.php'); ?>

</head>

<body>
<div id="HEADER">
<?php require_once('../menu.php'); ?>
</div>  <!-- HEADER END -->

<div id="MAIN">
    <div id="CONTROL">
        <table>
            <tr>
                <td><button class="BUTTON" onclick="setMarkers(0, 20);">1～20</button></td>
                <td><button class="BUTTON" onclick="setMarkers(20, 40);">21～40</button></td>
                <td><button class="BUTTON" onclick="setMarkers(40, 60);">41～60</button></td>
                <td><button class="BUTTON" onclick="setMarkers(60, 80);">61～80</button></td>
                <td><button class="BUTTON" onclick="setMarkers(80, 100);">81～100</button></td>
                <td><button class="BUTTON" onclick="setMarkers(100, 120);">101～120</button></td>
                <td><button class="BUTTON" onclick="setMarkers(120, 140);">121～140</button></td>
                <td><button class="BUTTON" onclick="setMarkers(140, 160);">141～160</button></td>
                <td><button class="BUTTON" onclick="setMarkers(160, 180);">161～180</button></td>
                <td><button class="BUTTON" onclick="setMarkers(180, 200);">181～200</button></td>
                <td><button class="BUTTON" onclick="setMarkers(200, 220);">201～220</button></td>
                <td><button class="BUTTON" onclick="setMarkers(220, 240);">221～240</button></td>
            </tr>
        </table>
    </div>

    <div id="map" align="center" style="width:100%; height:580px; margin-top: 0em"></div>
</div>
<script>
$(document).ready(function(){
map                   = createMap();
infoWindow            = new google.maps.InfoWindow();
map.setCenter(new google.maps.LatLng(34.668083, 135.50096099999996));
map.setZoom(15);
});

function setMarkers(under, above){
clearLocations();
    var searchUrl = '../php/createXML.php?under=' + under + '&above=' + above;
    
    downloadUrl(searchUrl, function(data){
        var xml = parseXml(data);
        var markerNodes = xml.documentElement.getElementsByTagName("landmark");
        
        for( var i = 0; i < markerNodes.length; i++ ){
            var name = markerNodes[i].getAttribute('name');
            var link = markerNodes[i].getAttribute('link');
            var address = markerNodes[i].getAttribute('full_address');
            var latlng = new google.maps.LatLng(
                parseFloat(markerNodes[i].getAttribute('lat')),
                parseFloat(markerNodes[i].getAttribute('lng')));

            createMarker(latlng, name, address, link);
        }
    });
}
</script>
</body>
</html>
