/** XMLHttpRequest とかを返す関数　これで、テキストファイルを扱える。 */
function createHttpRequest(){
    if(window.ActiveXObject){
        try {
            return new ActiveXObject("Msxml2.XMLHTTP.3.0");
        }catch(e){
            try{
                return new ActiveXObject("Microsoft.XMLHTTP");
            }catch(e2){
                return null;
            }
        }
    }else if(window.XMLHttpRequest){
        return new XMLHttpRequest();
    }else{
        return null;
    }
}

/** XMLファイルにスタイルシートを適用させる関数 docElm に表示 */
function XSLTXML(docElm, xmluri, xsluri){
    var xml, xsl;
    var bIE = (navigator.userAgent.indexOf("Trident")!=-1);
    var request = createHttpRequest();
    
    request.open("GET", xmluri, false);
    request.send("");
    xml     = request.responseXML;
    
    request.open("GET",xsluri,false);
    request.send("");    
    xsl     = request.responseXML;
    
    if(bIE){
        document.getElementById(docElm).innerHTML = xml.transformNode(xsl.documentElement);
    } else {
        var processor = new XSLTProcessor();
        processor.importStylesheet(xsl);
        var element = document.getElementById(docElm);
        var target  = element.childNodes.item(0);
        var newFragment = processor.transformToFragment(xml, document);
        document.getElementById(docElm).innerHTML = "";
        document.getElementById(docElm).appendChild(newFragment,target);
    }
}

/** @time: 秒 */
function _sleep(time){
    var d1 = new Date().getTime();
    var d2 = new Date().getTime();
    while(d2<d1+time*1000){
        d2 = new Date().getTime();
    }
    return;
}

/** map の初期化 */
function createMap(){
    return new google.maps.Map(document.getElementById("map"), {
        'zoom': 4,
        'center': new google.maps.LatLng(37.7408017,138.539803),
        'mapTypeId': google.maps.MapTypeId.ROADMAP,
        'mapTypeControlOptions': { 'style': google.maps.MapTypeControlStyle.DROPDOWN_MENU }
    });
}

/**
 *  マーカーセットクラス
 *  インフォウィンドウのメソッドを使う場合はグローバル変数 'pins' でArrayを宣言
 */
/*
function Pin(option, id, description){
    this.marker         = new google.maps.Marker(option);
    this.infowindow     = new google.maps.InfoWindow({'content': description});
    this.description    = description;
    this.id             = id;
    this.setId          = function(id){ this.id = id; };
    this.setDescription = function(description){ this.description = description; this.infowindow.setContent(description); };
    this.setInfoWindow  = function(map, event, id) {
        google.maps.event.addListener(this.marker, event, function(){
            if(pins){for(i in pins){pins[i].infowindow.close();}}

            pins[id].infowindow = new google.maps.InfoWindow({'content': pins[id].description});
            pins[id].infowindow.open(map, pins[id].marker);
        });
    };
    this.deleteInfoWindow    = function(){ this.infowindow.close(); }
}
function deleteAllInfoWindow(){ if(pins){$(pins).each(function(i){ pins[i].deleteInfoWindow(); })} }
*/

/////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
function isCheckedWayPoint(id){
    if(document.getElementById(id)){
        var waypointTags = document.getElementById(id).getElementsByTagName('input');
        for(var i in waypointTags){
            if(waypointTags[i].checked) return 1;
        }
        return 0;
    }    
}
function clearChecks(){
    if(document.getElementById('waypoints')){
        var waypointTags = document.getElementById('waypoints').getElementsByTagName('input');
        for(var i in waypointTags){
            waypointTags[i].checked = false;
        }
    }
}
function allChecks(){
    if(document.getElementById('waypoints')){
        var waypointTags = document.getElementById('waypoints').getElementsByTagName('input');
        for(var i in waypointTags){
            waypointTags[i].checked = true;
        }
    }
}
function markerDisplay(){
    if(markers[0].marker.getVisible())
        for(i in markers){
            markers[i].marker.setVisible(false);
        }
    else
        for(i in markers){
            markers[i].marker.setVisible(true);
        }
}
//function setInfoWindow(map,html,marker,infowindowlabel){var infowindow=new google.maps.InfoWindow({content:html});google.maps.event.addListener(marker,'click',function(){infowindow.setZIndex(++infowindowlebel);infowindow.open(map,marker);});}

function makeInfoText(pin, content, places, i){
    if(places[i].getElementsByTagName("name").length)         { content = isTitle         (content, places, i); }
    if(places[i].getElementsByTagName("description").length){ content = isDescription(content, places, i); }
    content = "<div class='DOCUMENT'>" + content + "</div>";
    content += "<div class='STREETVIEW'><div id=" + pin.id + "></div></div>";
    content = "<div class='INFOWINDOW'>" + content + "</div>";
    return content
}
function isTitle(html,places,i){
    html += "<div class='TITLE'>";
    var title = places[i].getElementsByTagName("name")[0].firstChild.nodeValue;
    if(places[i].getElementsByTagName("link").length){
        var link = places[i].getElementsByTagName("link")[0].firstChild.nodeValue;
        html += "<a href='"+link+"'>"+title+"</a></div>";
    }
    else html+=title+"</div>";
    return html;
}
function isDescription(html,places,i){
    html += "<div class = 'DESCRIPTION'>";
    html += places[i].getElementsByTagName("description")[0].firstChild.nodeValue;
    html += "</div>";
    return html;
}
*/
//function isImage(html,places,i){html += "<img src='"+places[i].getElementsByTagName("image")[0].firstChild.nodeValue+"'>";}
//function placeMarker(location){var clickedLocation=new google.maps.LatLng(location),marker=new google.maps.Marker({position:location,map:map});map.setCenter(location);}
