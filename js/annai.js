/** ページが読み込まれてから実行する */
$(document).ready(function(){
    map                   = createMap();
//    origin  = new google.maps.Marker({'map':map,'icon':'http://maps.gstatic.com/mapfiles/markers2/icon_greenA.png'});
//    dest    = new google.maps.Marker({'map':map,'icon':'http://maps.gstatic.com/mapfiles/markers2/icon_greenB.png'});
    
    infoWindow            = new google.maps.InfoWindow();
    directionsRenderer    = new google.maps.DirectionsRenderer({ 
                                'map':                  map,
                                'panel':                $('#page1')[0],
                            //    'suppressInfoWindows':  true,
                            //    'suppressMarkers':      true
                            });
    route.init();
});

/** イベントハンドラ */
$(function(){
    $("#origin")
            .bind("keydown", function(event){
                if(event.keyCode === $.ui.keyCode.TAB && $(this).data("autocomplete").menu.active){ event.preventDefault(); }
            })
            .autocomplete({
                source: function(request, response){
                    $.getJSON("php/autocomplete_origin.php?name="+request.term, {
                        term: extractLast( request.term )
                    }, response);
                },
                search: function(){
                    var term = extractLast(this.value);
                    if(term.length < 2){ return false; }
                },
                focus: function(){
                    return false;
                },
                select: function(event, ui){
                    var terms = split(this.value);
                    terms.pop();
                    terms.push(ui.item.value);
                    terms.push("");
                    this.value = terms.join("");
                    return false;
                }
            });
    $("#dest")
            .bind("keydown", function(event){
                if(event.keyCode === $.ui.keyCode.TAB && $(this).data("autocomplete").menu.active){ event.preventDefault(); }
            })
            .autocomplete({
                source: function(request, response){
                    $.getJSON("php/autocomplete_name.php?name="+request.term, {
                        term: extractLast( request.term )
                    }, response);
                },
                search: function(){
                    var term = extractLast(this.value);
                    if(term.length < 2){ return false; }
                },
                focus: function(){
                    return false;
                },
                select: function(event, ui){
                    var terms = split(this.value);
                    terms.pop();
                    terms.push(ui.item.value);
                    terms.push("");
                    this.value = terms.join("");
                    return false;
                }
            });
    $('.microtabs').microTabs({selected:0});
    $('#SEARCH').click (function(){ route.start('WALKING'); });
    $('#CHANGE_MARKER_DISPLAY').click(function(){ changeMarkerDisplay(); });
    $('#origin').click (function(){ this.select(0,this.value.length); });
    $('#dest'  ).click (function(){ this.select(0,this.value.length); });
});

function split(val){
    return val.split(/,\s*/);
}
function extractLast(term){
    return split(term).pop();
}

/////////////////////////////////////////////////

var map;
var markers             = [];
//var origin              = null;
//var dest                = null;
var infoWindow          = null;
var directionsRenderer  = null;
var MAX_DIST            = 5000 // m (5km)
var storeID = 0;

/////////////////////////////////////////////////

function changeMarkerDisplay(){ var flag = !markers[0].getVisible()?true:false;for(var i = 0; i < markers.length; i++){ markers[i].setVisible(flag); } }

var route = {
    'init': function(){
        this.search($('#origin')[0])
            .search($('#dest')[0]);
        return this;
    },
    'search': function(addressElm){
        addressElm.name = addressElm.value;
        searchLocation(addressElm);
        return this;
    },
    'start': function(travelMode){
        var request    = {
            'origin':       ($('#origin')[0].name)?$('#origin')[0].name:$('#origin')[0].value,
            'destination':  ($('#dest'  )[0].name)?$('#dest'  )[0].name:$('#dest'  )[0].value,
            'unitSystem':   google.maps.DirectionsUnitSystem.METRIC,
            'travelMode':   travelMode
//            ,'provideRouteAlternatives': true
        };
        var directionService = new google.maps.DirectionsService();
        directionService.route(request, function (result, status) {
            if (status === google.maps.DirectionsStatus.OK) {
                // 遠すぎたら終了
                switch(travelMode){
                    case 'WALKING':
                    if(result.routes[0].legs[0].distance.value > MAX_DIST){ route.start('DRIVING'); break; }
                    $('#NAVILOCATION').append("route.length = "+result.routes.length+"\n");
                    createDescription(result);
                    break;
                    
                    case 'DRIVING':
                    clearLocations();
                    break;
                }
                directionsRenderer.setDirections(result);
                setOriginDest($("#origin")[0].value, $("#dest")[0].value);
            } else {
            //searchWithWebai();
                alert("Directions query failed: " + status);
            }
        });
        return this;
    }
};

/** スタート地点と目的地をフォームと同じのにする */
function setOriginDest(start_address, end_address, result){
    var currentDirections   = result||directionsRenderer.getDirections();
    var leg = currentDirections.routes[0].legs[0];
    leg.start_address   = start_address;
    leg.end_address     = end_address;
    
//    origin.setPosition(leg.start_location);     dest.setPosition(leg.end_location);
//    origin.setVisible(true);                    dest.setVisible(true);
    directionsRenderer.setDirections(currentDirections);
}

/** landmarks DB 内に一致するものがあるか検索 */
function searchLocation(addressElm){
    var address = addressElm.value;
    var searchUrl = 'php/createXML_searchWithAddress.php?address=' + encodeURI(address);
    var EXIST = 1, NOT_EXIST = 0;

    downloadUrl(searchUrl, function(data) {
        var xml = parseXml(data);
        var markerNodes = xml.documentElement.getElementsByTagName("landmark");

        switch(markerNodes.length){
        
            case EXIST:
            var markerNode = markerNodes[0];
            addressElm.value = markerNode.getAttribute('name');
            addressElm.name = new google.maps.LatLng(
                parseFloat(markerNode.getAttribute('lat')),
                parseFloat(markerNode.getAttribute('lng')));
            storeID = markerNode.getAttribute('id');    
            break;
            
            case NOT_EXIST:
            break;
        }
    });
}

/** infowindow markers を削除 */
function clearLocations() {
    infoWindow.close();

    for (var i = 0; i < markers.length; i++) { markers[i].setMap(null); }
    markers.length = 0;
}

/**
 *  DB からルート範囲内のものをクエリーする
 *  RouteBoxer を使って道沿いにあるランドマークを探す
 */
function searchLandmarksNear(result) {
    clearLocations();
    
    var currentDirections   = result||directionsRenderer.getDirections();
    var bounds              = currentDirections.routes[0].bounds;
    var NorthEast           = bounds.getNorthEast();
    var SouthWest           = bounds.getSouthWest();

    var north  = NorthEast.lat();
    var east   = NorthEast.lng();
    var west   = SouthWest.lng();
    var south  = SouthWest.lat();
    
    var searchUrl = 'php/createXML_searchWithStoreID.php?id='+storeID;
//    var searchUrl = 'http://localhost/wordpress/navi/createXML_searchWithStoreID.php?id='+storeID;
//    var searchUrl = 'http://localhost:42960/navi/createXML_searchWithNEWS.php?n=' + (north+0.0001) + '&e=' + (east+0.0005) + '&w=' + (west-0.0005) + '&s=' + (south-0.0001); // 47/sqrt(2)m 補間
//    $("#NAVILOCATION").text("north: " + (north+0.0001) + "\neast: " + east + "\nwest: " + (west-0.0005) + "\nsouth: " + south + "\ndistance: " + getDistance(new google.maps.LatLng((north+0.0001),(east+0.0005)), NorthEast) + "\n");
$("#NAVILOCATION").append(searchUrl);
    downloadUrl(searchUrl, function(data) {
        var xml         = parseXml(data);
        var markerNodes = xml.documentElement.getElementsByTagName("landmark");
        var bounds      = new google.maps.LatLngBounds();
        $("#NAVILOCATION").append(markerNodes.length);

        // RouteBoxer
        var routeboxer = new RouteBoxer();
        var boxes = routeboxer.box(currentDirections.routes[0].overview_path, 0.02);

        for (var i = 0; i < markerNodes.length; i++) {
            var name    = markerNodes[i].getAttribute('name');
            //$("#NAVILOCATION").append(name + "\n");
            if(markers.length >= 10)    break;
            $('#NAVILOCATION').append(markerNodes[i].getAttribute('lat')+'\n');
            if(parseFloat(markerNodes[i].getAttribute('lat')) === 0.000000) continue;
            if(name === $('#origin')[0].value||name === $('#dest')[0].value)   continue;

            var latlng = new google.maps.LatLng(
                parseFloat(markerNodes[i].getAttribute('lat')),
                parseFloat(markerNodes[i].getAttribute('lng')));

            for(var j = 0; j < boxes.length; j++){
                if(true === boxes[j].contains(latlng)){
                    createMarker(latlng, name);
                }
            }
        }
        add_APInstruction(result);
    });
}

/** infowindow と marker 生成 */
function createMarker(latlng, name) {
    var info = "<div align=left>"
             + "<div class='TEXT'>"
//             + "<div>" + name + "</div>"
             + "<div class='TITLE'>" + name + "</div>"
//             + "<div class='ADDRESS'>" + latlng + "</div>"
             + "</div></div>";
    var icon = 'http://maps.google.com/mapfiles/marker' + String.fromCharCode(markers.length+65) + '.png';
    var marker = new google.maps.Marker({
        'map':        map,
        'title':      name,
        'position':   latlng,
        'icon':       icon
    });
    google.maps.event.addListener(marker, 'click', function() {
        infoWindow.setContent(info);
        infoWindow.open(map, marker);
    });
    google.maps.event.addListener(map, 'dragstart', function(){
        infoWindow.close(map, marker);
    });
    markers.push(marker);
}

/** 道路・横断歩道　を渡る案内文に方向転換に関する情報を加える */
function add_turnInstruction(result){
    var i, j;
    var rad, theta, direct;
    var strTail = "";
    var currentDirections   = result||directionsRenderer.getDirections();
    var steps               = currentDirections.routes[0].legs[0].steps;

    for(i = 0; i < steps.length; i++){$("#NAVILOCATION").append(i+": "+steps[i].instructions+"\n\t"+getDistance(steps[i].path[0],steps[i].path[1])+"\n");
        if(steps[i].instructions.match(/を渡る/)){
            if( steps[i].path.length <= 2 ){ continue; }
            // 目的地は・・・の部分を取得する
            if( i === steps.length-1 ){
                strTail                 = steps[i].instructions.match(/(<div.*<\/div>)/img);
                steps[i].instructions   = steps[i].instructions.replace(/<div.*<\/div>/img, '');
            }
            // 方向転換後にわたる
            if(i){
                rad   = getRad(steps[i-1].path[steps[i-1].path.length-2], steps[i].path[0], steps[i].path[1]);
                theta = rad / (Math.PI / 180);
                if( getDistance(steps[i].path[0], steps[i].path[1]) < 7 );
                else if (Math.abs(theta) > 120);
                else if (Math.abs(theta) <= 40){
                    direct = (theta > 0) ? '右':'左';
                    steps[i].instructions = direct + 'から回り込んだ後' + steps[i].instructions;
                    continue;
                }
                else{
                    direct = (theta > 0) ? '右':'左';
                    //if(getDistance());
                    steps[i].instructions = direct + '側に' + steps[i].instructions;
                    continue;
                }
            }
            rad   = getRad(steps[i].path[0], steps[i].path[1], steps[i].path[2]);
            theta = rad / (Math.PI / 180);
            if( getDistance(steps[i].path[1], steps[i].path[2]) < 10 );
            else if (Math.abs(theta) > 160);    // 直進
            else if (Math.abs(theta) <= 40){    // 渡ってから方向転換
                direct = (theta > 0) ? '右':'左';
                steps[i].instructions = steps[i].instructions.match(/(.+)を渡る/)[1] + 'を渡って' + direct + 'に回り込む';
            }
            else{
                direct = (theta > 0) ? '右':'左';
                steps[i].instructions = steps[i].instructions.match(/(.+)を渡る/)[1] + 'を渡って' + direct + 'に曲がる';
            }
            
            // 目的地は・・・の部分を付け加える
            if(i === steps.length-1){ steps[i].instructions += strTail; }
        }
    }
    directionsRenderer.setDirections(currentDirections);
}

/** 内積の計算 */
function innerProduct(latlng1, latlng2){
    return latlng1.lng()*latlng2.lng() + latlng1.lat()*latlng2.lat();
}
/** 外積の計算 */
function outerProduct(latlng1, latlng2){
    return latlng1.lng()*latlng2.lat() - latlng1.lat()*latlng2.lng();
}
/** 平面として考えて角度を求める */
function getRad(latlng1, latlng2, latlng3){
    var vector1 = new google.maps.LatLng(latlng1.lat()-latlng2.lat(), latlng1.lng()-latlng2.lng());
    var vector2 = new google.maps.LatLng(latlng3.lat()-latlng2.lat(), latlng3.lng()-latlng2.lng());
    
    var naiseki = innerProduct(vector1, vector2);
    var gaiseki = outerProduct(vector1, vector2);
    var result  = Math.atan2(gaiseki, naiseki);
    return result;
}

/*
function getRad(latlng1, latlng2, latlng3){
    var rad1 = getRad2(latlng2, latlng1);
    var rad2 = getRad2(latlng2, latlng3);
    return (Math.abs(rad1)-Math.abs(rad2));
}*/
/**
 * @from:   始点
 * @to:     終点
 * @return: 真北を 0度 時計回りに from->to の角度
 */
/*
function getRad2(from, to){
    var x = Math.cos(from.lat())*Math.sin(to.lat()) - Math.sin(from.lat())*Math.cos(to.lat())*Math.cos(to.lng()-from.lng());
    var y = Math.cos(to.lat()) * Math.sin(to.lng()-from.lng());
    return Math.atan2(y, x);// rad
}
*/

/** ルートディスクリプションの無駄になりそうな部分を削除 */
function adjustPath(result){
    var currentDirections   = result||directionsRenderer.getDirections();
    var steps               = currentDirections.routes[0].legs[0].steps;
    var i, flag                = false;

    for(i = 0; i < steps.length; i++){
        if(steps[i].instructions === '道路を渡る'
        || steps[i].instructions === '横断歩道を渡る'
        || steps[i].instructions.match(/^斜め<b>/)){
        
            if('undefined' !== typeof steps[i-1] 
            && 'undefined' !== typeof steps[i+1]) { flag = true; }
            
            shift_step(steps[i], steps[i-1]);
            steps.splice(i--,1);
            
        }else{
            if( true === flag ){
                steps[i-1].path.push(steps[i].path[0]);
                steps[i-1].end_location                 = steps[i].start_location;
                flag = false;
            }
        }
    }
    directionsRenderer.setDirections(currentDirections);
}


/** 現在の step を１個前の step に移行 */
function shift_step(Step, prevStep){
    var i;
    var prevlen     = prevStep.path.length;
    var v           = 50/60; // [m/秒]
    var sec2min     = 1/60;
    var sec2hour    = 1/3600;
    
    for(i = 0; i < Step.path.length-1; i++){
        prevStep.path.push(Step.path[i+1]);
    }
    prevStep.distance.value += Step.distance.value;
    if( prevStep.distance.value < 95 ){
        prevStep.distance.text  = prevStep.distance.value + ' m';
        prevStep.duration.value = prevStep.distance.value / v;
        if      (prevStep.duration.value < 10){ prevStep.duration.text = Math.round(prevStep.duration.value     ) + ' 秒'; }
        else if (prevStep.duration.value < 55){ prevStep.duration.text = Math.round(prevStep.duration.value/10)*10+ ' 秒'; }
        else                                  { prevStep.duration.text = Math.round(prevStep.duration.value * sec2min) + ' 分'; }
    
    }else{
        prevStep.distance.text = Math.round(prevStep.distance.value/100)/10 + ' km';
        prevStep.duration.value = prevStep.distance.value / v;
        if      (prevStep.duration.value < 570) { prevStep.duration.text = Math.round(prevStep.duration.value * sec2min) + ' 分'; }
        else if (prevStep.duration.value < 3300){ prevStep.duration.text = Math.round(prevStep.duration.value * sec2min/10)*10 + ' 分'; }
        else                                    { prevStep.duration.text = Math.round(prevStep.duration.value * sec2hour) + ' 時間'; }
    }
}

/** ルートディスクリプションを書き換える */
function createDescription(result){
    add_turnInstruction (result);
    adjustPath          (result);
    searchLandmarksNear (result);
}

/** アクションポイントを追加 */
function add_APInstruction(result){
    var i;
    var APinfos             = new Array(markers.length);
    var currentDirections   = result||directionsRenderer.getDirections();
    var steps               = currentDirections.routes[0].legs[0].steps;

    for(i = 0; i < markers.length; i++){
        APinfos[i] = getAPinfo(steps, i);
        if(APinfos[i] === null){ continue; }
        APinfos[i].id = i;
        
        $('#NAVILOCATION').append( (i+1) + ': ' + APinfos[i].name   + '\n'
                                +'theta:  '+ APinfos[i].theta       + '\n'
                                +'direct: '+ APinfos[i].direct      + '\n'
                                +'dist:\n'
                                +'  head: '+ APinfos[i].dist.head   + '\n'
                                +'  ver:  '+ APinfos[i].dist.ver    + '\n'
                                +'  par:  '+ APinfos[i].dist.par    + '\n'
                                +'time:\n'
                                +'  current:  '+ APinfos[i].time.current    + '\n'
                                +'  total:'+ APinfos[i].time.total  + '\n'
                                +'s:      '+ APinfos[i].s           + '\n'
                                +'p:      '+ APinfos[i].p           + '\n'
                                +'\n\n');
    }
    // deleteInvalidAP(APinfos, steps);
    APinfos.sort(function(x, y){return (x.time.current-y.time.current);});
    APinfos.sort(function(x, y){return (x.p-y.p);});
    APinfos.sort(function(x, y){return (x.s-y.s);});

    setMarkerIcon(APinfos);

    create_AP_Instructions(APinfos, steps);
    directionsRenderer.setDirections(currentDirections);
}

/////////////////////////////
////////////////////////////
///////////////////////////
/////////////////////////
///////////////////////
//////////////////

function deleteInvalidAP(APinfos, steps){
    var length = steps.length-1;
    for(var i = 0; i < APinfos.length; i++){
        if( true === IsIndoorSentence(steps[APinfos[i].s].instructions)
        &&( APinfos[i].s+1 !== length && true === IsIndoorSentence(APinfos[i+1].instructions) ));// del
    }
}

/** 屋内通路、改札口、エレベーターという記述が入っているかを判定する */
function IsIndoorSentence(instruction){
    if(     instruction.match(/改札口/img)
        ||  instruction.match(/屋内通路/img)
        ||  instruction.match(/エレベーター/img)){  return true; }
    else                                        return false;
}

/** sort前のAPinfosとmarkersの順番が同じであることを使ってマーカーアイコンの番号を指定する */
function setMarkerIcon(APinfos){
    var i, j;
    for(i = 0; i < markers.length; i++){
        markers[APinfos[i].id].setIcon('http://maps.google.com/mapfiles/marker' + String.fromCharCode(i+65) + '.png');
    }
}

/** アクションポイントに関する記述を追加する */
function create_AP_Instructions(APinfos, steps){
    var i           = 0;
    var result      = {'time': 0, 'pre_s': -1};
    var time        = 0;
    var text        = "";
    var strTail     = "";
    
    for(i = 0; i < APinfos.length; i++){
        if(!(result.pre_s === APinfos[i].s || result.pre_s === -1)){
            time = steps[result.pre_s].duration.value-APinfos[i-1].time.total;
            if(time > 0){    
                text = createTimeText(time);
                steps[result.pre_s].instructions += '\nそのまま' + text + 'ほど歩きます';
            }
        }
        result = create_AP_Instruction( APinfos[i], steps, result );
    }
    if( result.pre_s === steps.length-1 ){
        strTail  = steps[result.pre_s].instructions.match(/(<div.*<\/div>)/img) || '';
        steps[result.pre_s].instructions = steps[result.pre_s].instructions.replace(/<div.*<\/div>/img, '');
    }
    if( 'undefined' !== typeof steps[result.pre_s] && 'undefined' !== typeof steps[result.pre_s].duration ){
        time = steps[result.pre_s].duration.value-APinfos[i-1].time.total;
    }
    if(time > 0){
        text = createTimeText(time);
        steps[result.pre_s].instructions += '\nそのまま' + text + 'ほど歩きます' + strTail;
    }
}

/** 四捨五入した表示用の時間を作成 */
function createTimeText(sec){    
    var result = "";
    var sec2min = 1/60;
    var sec2hour = 1/3600;
    
    if      ( sec < 10 ){ result = Math.round(sec) + ' 秒'; }
    else if ( sec < 55 ){ result = Math.round(sec/10)*10 + ' 秒'; }
    else if( sec < 570 ){ result = Math.round(sec * sec2min) + ' 分'; }
    else if( sec < 3300){ result = Math.round(sec * sec2min/10)*10 + ' 分'; }
    else                { result = Math.round(sec * sec2hour) + ' 時間'; }
    return result;
}

/** ルートディスクリプションにアクションポイントを付与する */
function create_AP_Instruction(APinfo, steps, result){
    var dispTime    = '';
    var sec2min     = 1/60;
    var sec2hour    = 1/3600;
    var strTail     = "";
    var step        = steps[APinfo.s];

    // 目的地は・・・を切り取る
    if(APinfo.s === steps.length-1){
        strTail             = step.instructions.match(/(<div.*<\/div>)/img)||'';
        step.instructions   = step.instructions.replace(/<div.*<\/div>/img, '');
    }

    // 同じルート文の中で2つ以上APがあるかどうかで場合分け
    if(result.pre_s === APinfo.s){ dispTime    = '更に';}
    else                  { result.time        = 0;    }
    
    if      (APinfo.time.total - result.time < 5){ dispTime += '<b>';    
    }else if(APinfo.time.total - result.time < 55){ dispTime += Math.round((APinfo.time.total-result.time)/10)*10       + ' 秒ほど歩くと\n<b>';
    }else if(APinfo.time.total - result.time < 570){ dispTime += Math.round((APinfo.time.total-result.time) * sec2min)   + ' 分ほど歩くと\n<b>';
    }else if(APinfo.time.total - result.time < 3300){ dispTime += Math.round((APinfo.time.total-result.time) * sec2min /10)*10 + ' 分ほど歩くと/n<b>';
    }else                                     { dispTime += Math.round((APinfo.time.total-result.time) * sec2hour)  + ' 時間ほど歩くと\n<b>'; }

    result = {'time': APinfo.time.total, 'pre_s': APinfo.s};
    step.instructions += '\n'
                 + dispTime
                 + APinfo.name        + '</b> が '
                 + APinfo.direct      + '側に見えます。'
                 + strTail
                 ;
    return result;
}

/** markers とルートの距離からAP作成 */
function getAPinfo(steps, n){
    var i, j, k;
    var name = markers[n].getTitle();
    var direct, t_time, n_time, dist, distVer, distPar, t_dist;
    var theta1, theta2;
    var dis2sec = 50/60; // [m/秒]
    var result = {'name': name, 'theta': 0, 'direct': '', 'dist': {'head': 0, 'ver': 0, 'par': 0}, 'time': {'total': 0, 'current': 0}, 's': 0, 'p': 0};
    
    for(i = 0; i < steps.length; i++){
        if(steps[i].path.length < 2)    continue;
        
        for(j = 0; j < steps[i].path.length-1; j++){
            theta1 = getRad(markers[n].getPosition(), steps[i].path[j],   steps[i].path[j+1]);
            theta2 = getRad(markers[n].getPosition(), steps[i].path[j+1], steps[i].path[j]  );
            // ランドマークとルートの位置関係判定
            if(theta1 * theta2 >= 0) continue;
            // 3点で鋭角三角形を作るか判定
            if(Math.abs(theta1) > Math.PI/2 || Math.abs(theta2) > Math.PI/2) continue;
            
            // 最近判定
            dist    = getDistance( steps[i].path[j], markers[n].getPosition() );
            if('undefined' !== distVer && distVer < Math.abs(dist*Math.sin(theta1))) continue;

            t_dist = 0;
            if(j){for(k = 0; k < j; k++){ t_dist += getDistance(steps[i].path[k], steps[i].path[k+1]); }}
            
            direct  = (theta1 > 0) ? '右':'左';
            distVer = Math.abs(dist * Math.sin(theta1));
            distPar = Math.abs(dist * Math.cos(theta1));
            n_time  = Math.round( distPar         * dis2sec);
            t_time  = Math.round((t_dist+distPar) * dis2sec);
            result  = {'name': name, 'theta': theta1, 'direct': direct, 'dist': {'head': dist, 'ver': distVer, 'par': distPar}, 'time': {'total': t_time, 'current': n_time}, 's': i, 'p': j};
        }
    }
    if ( result.dist.head === 0){ markers[n].setMap(null);markers.splice(n,1);return null; }
    return result;
}


/** 距離の計算 */
function getDistance( from, to ){
    var earth_r = 6378137; // 地球の半径[m]
    var deg2rad = Math.PI/180;
    var degLat  = (to.lat() - from.lat()) * deg2rad;
    var degLng  = (to.lng() - from.lng()) * deg2rad;
    var distLat = earth_r * degLat;
    var distLng = Math.cos(from.lat()*deg2rad) * earth_r * degLng;
    
    var dist = Math.sqrt(Math.pow(distLng, 2) + Math.pow(distLat, 2));
    
    return dist;
}

/** url に接続できたら callback を実行する*/
function downloadUrl(url, callback) {
  var request = createHttpRequest();

  request.onreadystatechange = function() {
    if (request.readyState == 4 && request.status == 200) {
//      request.onreadystatechange = doNothing;
      callback(request.responseText, request.status);
    }
  };
  request.open('GET', url, true);
  request.send(null);
}

/** xml を解析して扱えるようにする */
function parseXml(str) {
  if (window.ActiveXObject) {
    var doc = new ActiveXObject('Microsoft.XMLDOM');
    doc.loadXML(str);
    return doc;
  } else if (window.DOMParser) {
    return (new DOMParser).parseFromString(str, 'text/xml');
  }
}

function doNothing() {}
