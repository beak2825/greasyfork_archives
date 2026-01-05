// ==UserScript==
// @name                WME MapRaid Overlay
// @namespace           https://greasyfork.org/users/5252
// @description         Creates polygons for MapRaid groups in a WME "MapRaid Groups" layer
// @include             https://www.waze.com/editor/*
// @include             https://www.waze.com/*/editor/*
// @include             https://editor-beta.waze.com/*
// @version             2.0
// @grant               none
// @license             http://creativecommons.org/licenses/by-nc-sa/3.0/
// @copyright           2014 davielde
// @downloadURL https://update.greasyfork.org/scripts/8565/WME%20MapRaid%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/8565/WME%20MapRaid%20Overlay.meta.js
// ==/UserScript==


function bootstrap_MapRaidOverlay()
{
  var bGreasemonkeyServiceDefined = false;

  try {
    bGreasemonkeyServiceDefined = (typeof Components.interfaces.gmIGreasemonkeyService === "object");
  }
  catch (err) { /* Ignore */ }

  if (typeof unsafeWindow === "undefined" || ! bGreasemonkeyServiceDefined) {
    unsafeWindow    = ( function () {
      var dummyElem = document.createElement('p');
      dummyElem.setAttribute('onclick', 'return window;');
      return dummyElem.onclick();
    }) ();
  }

    /* begin running the code! */
    setTimeout(InitMapRaidOverlay, 1000);
}

function AddRaidPolygon(raidLayer,groupPoints,groupColor,groupNumber){
    
    var mro_Map = unsafeWindow.Waze.map;
    var mro_OL = unsafeWindow.OpenLayers;
    var raidGroupLabel = 'Raid Group ' + groupNumber;
    var groupName = 'RaidGroup' + groupNumber;
    
    var style = {
        strokeColor: groupColor,
        strokeOpacity: .8,
        strokeWidth: 3,
        fillColor: groupColor,
        fillOpacity: 0.15,
        label: raidGroupLabel,
        labelOutlineColor: "black",
        labelOutlineWidth: 3,
        fontSize: 14,
        fontColor: groupColor,
        fontOpacity: .85,
        fontWeight: "bold"  
    };
    
    var attributes = {
        name: groupName,
        number: groupNumber
    };
    
    var pnt= [];
    for(i=0;i<groupPoints.length;i++){
        convPoint = new OpenLayers.Geometry.Point(groupPoints[i].lon,groupPoints[i].lat).transform(new OpenLayers.Projection("EPSG:4326"), mro_Map.getProjectionObject());
        //console.log('MapRaid: ' + JSON.stringify(groupPoints[i]) + ', ' + groupPoints[i].lon + ', ' + groupPoints[i].lat);
        pnt.push(convPoint);
    }
		       
    var ring = new mro_OL.Geometry.LinearRing(pnt);
    var polygon = new mro_OL.Geometry.Polygon([ring]);
    
    var feature = new mro_OL.Feature.Vector(polygon,attributes,style);
    raidLayer.addFeatures([feature]);

}

function CurrentRaidLocation(raid_mapLayer){
    var mro_Map = unsafeWindow.Waze.map;

    for(i=0;i<raid_mapLayer.features.length;i++){
        var raidMapCenter = mro_Map.getCenter();
        var raidCenterPoint = new OpenLayers.Geometry.Point(raidMapCenter.lon,raidMapCenter.lat);
        var raidCenterCheck = raid_mapLayer.features[i].geometry.components[0].containsPoint(raidCenterPoint);
        //console.log('MapRaid: ' + raid_mapLayer.features[i].attributes.number + ': ' + raidCenterCheck);
        if(raidCenterCheck === true){
        	var raidLocationLabel = 'Raid Group ' + raid_mapLayer.features[i].attributes.number + ' - ' + $('.WazeControlLocationInfo').text();
    		setTimeout(function(){$('.WazeControlLocationInfo').text(raidLocationLabel)},200);
        }
    }
}

function InitMapRaidOverlay(){

    var mro_Map = unsafeWindow.Waze.map;
    var mro_OL = unsafeWindow.OpenLayers;

    //create overlay layer and add to WME map
    var mro_mapLayers = mro_Map.getLayersBy("uniqueName","__MapRaidGroups");
    var raid_mapLayer = new mro_OL.Layer.Vector("MapRaid Groups", {
        displayInLayerSwitcher: true,
        uniqueName: "__MapRaidGroups"
    });
    I18n.translations.en.layers.name["__MapRaidGroups"] = "MapRaid Groups";
    mro_Map.addLayer(raid_mapLayer);
    raid_mapLayer.setVisibility(true);
    
    
    //replace groupPoints with custom coordinates, add or remove groups as needed (sample data is from fifteen groups in the Los Angeles, California area)
    var group1Points = [{lon:'-118.95163500000001',lat:'34.027766400000004'},{lon:'-118.800847',lat:'34.171126'},{lon:'-118.76598400000002',lat:'34.504859'},{lon:'-119.350212',lat:'34.466199'},{lon:'-119.25176',lat:'34.120812'},{lon:'-118.95163500000001',lat:'34.027766400000004'}];
    var group2Points = [{lon:'-118.275804',lat:'34.125588'},{lon:'-118.386803',lat:'34.507096'},{lon:'-118.53399999999999',lat:'34.522'},{lon:'-118.76667',lat:'34.504859'},{lon:'-118.800847',lat:'34.171126'},{lon:'-118.275804',lat:'34.125588'}];
    var group3Points = [{lon:'-118.02955600000001',lat:'34.4658066'},{lon:'-118.386803',lat:'34.5048326'},{lon:'-118.275804',lat:'34.1233143'},{lon:'-118.02749600000001',lat:'34.0281928'},{lon:'-118.02955600000001',lat:'34.4658066'}];
    var group4Points = [{lon:'-118.02955600000001',lat:'34.46807100000001'},{lon:'-118.02749600000001',lat:'34.030469'},{lon:'-117.701112',lat:'33.90416400000001'},{lon:'-117.74322500000001',lat:'34.439761'}];
    var group5Points = [{lon:'-117.631988',lat:'33.97867'},{lon:'-117.30673',lat:'33.965632'},{lon:'-117.470935',lat:'34.408408'},{lon:'-117.74322500000001',lat:'34.439761'},{lon:'-117.701112',lat:'33.90416400000001'},{lon:'-117.631988',lat:'33.97867'}];
    var group6Points = [{lon:'-117.470935',lat:'34.408408'},{lon:'-117.30673',lat:'33.965632'},{lon:'-117.296435',lat:'33.94353'},{lon:'-116.77539800000001',lat:'33.926554'},{lon:'-116.68616400000002',lat:'34.320323'},{lon:'-117.470935',lat:'34.408408'}];
    var group7Points = [{lon:'-118.800847',lat:'34.171126'},{lon:'-118.96674120000002',lat:'34.014676800000004'},{lon:'-118.4744162',lat:'33.95603229999999'},{lon:'-118.36386699999998',lat:'33.995038'},{lon:'-118.275804',lat:'34.125588'},{lon:'-118.800847',lat:'34.171126'}];
    var group8Points = [{lon:'-118.3635239',lat:'33.9953229'},{lon:'-118.47510280000002',lat:'33.9560323'},{lon:'-118.4237691',lat:'33.8742609'},{lon:'-118.19134659999999',lat:'33.8757607'},{lon:'-118.17006199999999',lat:'33.9953955'},{lon:'-118.3635239',lat:'33.9953229'}];    
    var group9Points = [{lon:'-118.20087539999999',lat:'34.0953126'},{lon:'-118.2751171',lat:'34.123878399999995'},{lon:'-118.36386699999998',lat:'33.995038'},{lon:'-118.16937540000002',lat:'33.99539550000001'},{lon:'-118.15384149999998',lat:'34.0768304'},{lon:'-118.20087539999999',lat:'34.0953126'}];
    var group10Points = [{lon:'-118.19066',lat:'33.87576070000001'},{lon:'-118.01762600000002',lat:'33.877186'},{lon:'-117.89016700000002',lat:'33.977816'},{lon:'-118.15452600000002',lat:'34.07854'},{lon:'-118.19066',lat:'33.87576070000001'}];
    var group11Points = [{lon:'-118.424112',lat:'33.873976'},{lon:'-118.4408565',lat:'33.7283358'},{lon:'-118.1609698',lat:'33.6743502'},{lon:'-118.0766846',lat:'33.807034'},{lon:'-118.05266300000001',lat:'33.8458175'},{lon:'-118.01762600000002',lat:'33.877186,'},{lon:'-118.424112',lat:'33.873976'}];
    var group12Points = [{lon:'-117.89016700000002',lat:'33.977816'},{lon:'-118.01762600000002',lat:'33.877186'},{lon:'-118.0547048',lat:'33.8426885'},{lon:'-118.13006590000002',lat:'33.7263337'},{lon:'-117.95025030000001',lat:'33.6048915'},{lon:'-117.666316',lat:'33.858438'},{lon:'-117.701112',lat:'33.904734'},{lon:'-117.89016700000002',lat:'33.977816'}];
    var group13Points = [{lon:'-117.95025030000001',lat:'33.6048915'},{lon:'-117.64891640000002',lat:'33.394536300000006'},{lon:'-117.35870399999999',lat:'33.425711'},{lon:'-117.666316',lat:'33.858438'},{lon:'-117.95025030000001',lat:'33.6048915'}];
    var group14Points = [{lon:'-117.30673',lat:'33.965632'},{lon:'-117.631988',lat:'33.97867'},{lon:'-117.701112',lat:'33.90416400000001'},{lon:'-117.35870399999999',lat:'33.425711'},{lon:'-117.132454',lat:'33.451209'},{lon:'-117.30673',lat:'33.965632'}];
    var group15Points = [{lon:'-117.132454',lat:'33.451209'},{lon:'-116.870973',lat:'33.478575'},{lon:'-116.77539800000001',lat:'33.926554'},{lon:'-117.296435',lat:'33.94353'},{lon:'-117.132454',lat:'33.451209'}];

    //adds polygon from coordinates specified above, change hex color as desired
    AddRaidPolygon(raid_mapLayer,group1Points,"#F4EB37",1);
    AddRaidPolygon(raid_mapLayer,group2Points,"#3F5BA9",2);
    AddRaidPolygon(raid_mapLayer,group3Points,"#EE9C96",3);
    AddRaidPolygon(raid_mapLayer,group4Points,"#F4B400",4);
    AddRaidPolygon(raid_mapLayer,group5Points,"#A61B4A",5);
    AddRaidPolygon(raid_mapLayer,group6Points,"#7CCFA9",6);
    AddRaidPolygon(raid_mapLayer,group7Points,"#4186f0",7);
    AddRaidPolygon(raid_mapLayer,group8Points,"#FFDD5E",8);
    AddRaidPolygon(raid_mapLayer,group9Points,"#795046",9);
    AddRaidPolygon(raid_mapLayer,group10Points,"#DB4436",10);
    AddRaidPolygon(raid_mapLayer,group11Points,"#0BA9CC",11);
    AddRaidPolygon(raid_mapLayer,group12Points,"#795046",12);
    AddRaidPolygon(raid_mapLayer,group13Points,"#7CCFA9",13);
    AddRaidPolygon(raid_mapLayer,group14Points,"#7C3592",14);
    AddRaidPolygon(raid_mapLayer,group15Points,"#A61B4A",15);
    
    //obtains current map center location to determine which group label to apply
    setTimeout(function(){CurrentRaidLocation(raid_mapLayer)},3000);
    mro_Map.events.register("moveend", Waze.map, function(){CurrentRaidLocation(raid_mapLayer)});
    mro_Map.events.register("zoomend", Waze.map, function(){CurrentRaidLocation(raid_mapLayer)});
        
}

bootstrap_MapRaidOverlay(); 