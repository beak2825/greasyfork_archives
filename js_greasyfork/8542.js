// ==UserScript==
// @name                WME Obszar Nalotu
// @namespace           mapraid-poland-2015
// @description         Skrypt wyświetlający obszar nalotu na mapę
// @include             https://www.waze.com/editor/*
// @include             https://www.waze.com/*/editor/*
// @include             https://editor-beta.waze.com/*
// @version             0.6
// @grant               none
// @copyright           2014 davielde, 2015 mousepl
// @downloadURL https://update.greasyfork.org/scripts/8542/WME%20Obszar%20Nalotu.user.js
// @updateURL https://update.greasyfork.org/scripts/8542/WME%20Obszar%20Nalotu.meta.js
// ==/UserScript==


//---------------------------------------------------------------------------------------
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
       // if(raidCenterCheck === true){
       // 	var raidLocationLabel = 'Raid Group ' + raid_mapLayer.features[i].attributes.number + ' - ' + $('.WazeControlLocationInfo').text();
    	//	setTimeout(function(){$('.WazeControlLocationInfo').text(raidLocationLabel);},200);
       // }
    }
}

function InitMapRaidOverlay(){

    var mro_Map = unsafeWindow.Waze.map;
    var mro_OL = unsafeWindow.OpenLayers;

    //if (!mro_Map) return;
	
    //if (!mro_OL) return;

    var mro_mapLayers = mro_Map.getLayersBy("uniqueName","__MegaMapRaid");
        
    var raid_mapLayer = new mro_OL.Layer.Vector("Obszar nalotu", {
        displayInLayerSwitcher: true,
        uniqueName: "__MegaMapRaid"
    });
        
    I18n.translations.en.layers.name["__MegaMapRaid"] = "Obszar nalotu";
    mro_Map.addLayer(raid_mapLayer);
    raid_mapLayer.setVisibility(false);

var Pomorze = [{lon:'18.2180787',lat:'53.4537136'},{lon:'17.8115845',lat:'53.069276900000006'},{lon:'19.0447998',lat:'52.8492299'},{lon:'19.4485474',lat:'53.2586414'},{lon:'18.7784315',lat:'53.5275045'},{lon:'18.2180787',lat:'53.4537136'}];
AddRaidPolygon(raid_mapLayer, Pomorze,"#DB4436","Bydg-Torun");



    
	
    setTimeout(function(){CurrentRaidLocation(raid_mapLayer);},3000);
    mro_Map.events.register("moveend", Waze.map, function(){CurrentRaidLocation(raid_mapLayer);});
    mro_Map.events.register("zoomend", Waze.map, function(){CurrentRaidLocation(raid_mapLayer);});
       
}

bootstrap_MapRaidOverlay(); 
