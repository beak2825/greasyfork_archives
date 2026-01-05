// ==UserScript==
// @name       Categorization Map
// @version    0.21
// @description  enter something useful
// @match      https://s3.amazonaws.com/mturk_bulk/hits*
// @require     http://code.jquery.com/jquery-latest.min.js
// @copyright  2014+, Tjololo
// @namespace https://greasyfork.org/users/710
// @downloadURL https://update.greasyfork.org/scripts/861/Categorization%20Map.user.js
// @updateURL https://update.greasyfork.org/scripts/861/Categorization%20Map.meta.js
// ==/UserScript==

var api = "";

API_js_callback = "https://maps.google.com/maps/api/js?sensor=false&callback=initialize";
if (api != "")
    API_js_callback += "&key="+api;

var script = document.createElement('script');
script.src = API_js_callback;
var head = document.getElementsByTagName("head")[0];
(head || document.body).appendChild(script);

var elem = $("p.ng-scope:last").text();
var addy = elem.split(':')[1];
console.log(addy);
var api = "AIzaSyCZlzXfRd-QhtiVg-FSDue_N4RXNrvSF5E";
var zoomlevel = 20;

var DIVmapa = document.createElement('div');
DIVmapa.id = 'DIVmapa';
DIVmapa.style.border = '2px coral solid';
DIVmapa.style.cursor = 'pointer';
DIVmapa.style.display = '';
DIVmapa.style.height = '75%';
DIVmapa.style.margin = '1';
DIVmapa.style.position = 'fixed';
DIVmapa.style.padding = '1';
DIVmapa.style.left = '1%';
DIVmapa.style.bottom = '1%';
DIVmapa.style.width = '30%';
DIVmapa.style.zIndex = '99';

var DIVinterna = document.createElement('div');
DIVinterna.id = 'DIVinterna';
DIVinterna.style.height = '100%';
DIVinterna.style.width = '100%';
DIVinterna.style.zIndex = '999';

$("div.row").append(DIVmapa);
DIVmapa.appendChild(DIVinterna);

$("[id='Completely Shaded']").text("A - Completely Shaded");
$("[id='Mostly Shaded']").text("S - Mostly Shaded");
$("[id='Mostly Not Shaded']").text("D - Mostly not Shaded");
$("[id='Completely NOT Shaded']").text("F - Completely NOT Shaded");
$("[id='House Not Visible']").text("SPCE - House Not Visible");
$("#guidelines").hide();

var content = document.getElementById("wrapper");
content.tabIndex = "0";
content.focus();

var element = document.getElementById('preview_overlay');
if (element)
    element.parentNode.removeChild(element);

initialize = setTimeout(function () {
    google = unsafeWindow.google;

    var PortoAlegre = new google.maps.LatLng(-30.034176,-51.229212);
    var myOptions = {
        zoom: zoomlevel,
        mapTypeId: google.maps.MapTypeId.SATELLITE
    }

    var map = new google.maps.Map(document.getElementById("DIVinterna"), myOptions);
    var geocoder = new google.maps.Geocoder();

    geocodeAddress(geocoder, map);

    function geocodeAddress(geocoder, resultsMap) {
        var address = addy;
        geocoder.geocode({'address': address}, function(results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                resultsMap.setCenter(results[0].geometry.location);
                resultsMap.setTilt(0);
                var marker = new google.maps.Marker({
                    map: resultsMap,
                    position: results[0].geometry.location
                });
            } else {
                alert('Geocode was not successful for the following reason: ' + status);
            }
        });
    }
}, 500);

document.onkeydown = showkeycode;
function showkeycode(evt){
    var keycode = evt.keyCode;
    switch (keycode) {
        case 65: //a
            $("[id='Completely Shaded']").click();
            document.getElementById("mturk_form").submit();
            break;
        case 83: //s
            $("[id='Mostly Shaded']").click();
            document.getElementById("mturk_form").submit();
            break;
        case 68: //d
            $("[id='Mostly Not Shaded']").click();
            document.getElementById("mturk_form").submit();
            break;
        case 70: //f
            $("[id='Completely NOT Shaded']").click();
            document.getElementById("mturk_form").submit();
            break;
        case 32: //spce
            $("[id='House Not Visible']").click();
            document.getElementById("mturk_form").submit();
            break;
    }
}