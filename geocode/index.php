<!DOCTYPE html>
<html dir="ltr">
<head>
<meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
<title>geocode</title>
<link rel='stylesheet' href='../css/control.css'/>
<link rel='stylesheet' href='../css/default.css'/>
<link rel='stylesheet' href='../css/menu.css'/>
<link rel='stylesheet' href='../css/maps.css'/>

<script src='http://maps.googleapis.com/maps/api/js?sensor=false'></script>
<script src='../js/jquery.js'></script>
<script src='../js/mylib.js'></script>
</head>
<body>

<?php include('../menu.php'); ?>
<br/>
<div id="MAIN" style="width: inherit; height: 500px; padding: 0px 30px">
    <div id="CONTROL">
        <input id="address"     type="textbox" value="" />
        <input id="codeAddress" type="button"  value="Geocode" />
        <a id="location" style="background-color"></a>

    </div>
    <div id="map" style=" top:2%; float:left; width:68%; height: 100%"></div>
    <div style="margin:1% 5% 2% -2%;float:right;height:500px;width:25%"><textarea id="info"style="height:inherit"></textarea></div>
</div>  <!-- MAIN END -->
</div>  <!-- CONTAINER END -->

<script>
var map = null;
var geocoder = null;

$(document).ready(function() {
    geocoder = new google.maps.Geocoder();
    map = createMap();
    google.maps.event.addListener(map, 'rightclick', function(event) {
        var location = event.latLng;
        $('#location').text('LatLng = ' + location.lat() + ',' + location.lng());
    });
});

$(function() {
    $('#codeAddress').click(function() {
        var address = $('#address')[0].value;
        geocoder.geocode({'address':address,'language':'ja'}, function(results,status) {
            if (status == google.maps.GeocoderStatus.OK) {
                map.setCenter(results[0].geometry.location);
                $('#info').append(results[0].address_components[0].long_name+'\n'+results[0].address_components[0].short_name+'\n'+results[0].address_components[0].types[0]);
                var marker = new google.maps.Marker({map:map,position:results[0].geometry.location});
                $('#location').text('LatLng = ' + results[0].geometry.location.lat() + ',' + results[0].geometry.location.lng());
            } else {
                alert('Geocode was not successful for the following reason: ' + status);
            }
        });
    });
});
</script>
</body>
</html>
