// ==UserScript==
// @name                WME Polygon
// @namespace           https://greasyfork.org/en/users/7837
// @description         Creates polygons for WME layer
// @include             https://www.waze.com/editor/*
// @include             https://www.waze.com/*/editor/*
// @include             https://editor-beta.waze.com/*
// @version             1.3.5
// @grant               none
// @copyright           2014 mauricioleonardi
// @downloadURL https://update.greasyfork.org/scripts/7134/WME%20Polygon.user.js
// @updateURL https://update.greasyfork.org/scripts/7134/WME%20Polygon.meta.js
// ==/UserScript==


//---------------------------------------------------------------------------------------
function bootstrap_MapOverlay()
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
    setTimeout(InitMapOverlay, 1000);
}

function AddRaidPolygon(raidLayer,groupPoints,groupColor,groupNumber){
    
    var mro_Map = unsafeWindow.Waze.map;
    var mro_OL = unsafeWindow.OpenLayers;
    var raidGroupLabel = 'Polígono ' + groupNumber;
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
        	var raidLocationLabel = 'Polígono ' + raid_mapLayer.features[i].attributes.number + ' - ' + $('.WazeControlLocationInfo').text();
    		setTimeout(function(){$('.WazeControlLocationInfo').text(raidLocationLabel)},200);
        }
    }
}

function InitMapOverlay(){

    var mro_Map = unsafeWindow.Waze.map;
    var mro_OL = unsafeWindow.OpenLayers;

    if (mro_Map == null) return;
    if (mro_OL == null) return;

    var mro_mapLayers = mro_Map.getLayersBy("uniqueName","__MapRaidLAGroups");
        
    var raid_mapLayer = new mro_OL.Layer.Vector("Poligonos", {
        displayInLayerSwitcher: true,
        uniqueName: "__MapRaidLAGroups"
    });
        
    I18n.translations.en.layers.name["__MapRaidLAGroups"] = "Poligonos";
    mro_Map.addLayer(raid_mapLayer);
    raid_mapLayer.setVisibility(true);
    
    
   // coordenadas sentido antihorario
   
   // parque nacional da amazonia


	var group7Points = [{lon:'-56.895447',lat:'-3.862970'},{lon:'-57.194138',lat:'-4.062584'},{lon:'-57.325974',lat:'-4.415924'},{lon:'-57.508621',lat:'-4.688346'},{lon:'-57.312241',lat:'-4.975712'},{lon:'-56.758804',lat:'-4.989393'},{lon:'-56.327591',lat:'-4.663709'},{lon:'-56.213608',lat:'-4.409077'},{lon:'-56.230087',lat:'-4.125595'},{lon:'-55.970535',lat:'-3.872154'},{lon:'-55.960922',lat:'-3.724165'},{lon:'-56.085892',lat:'-3.639197'},{lon:'-56.500626',lat:'-3.684423'}];
	

	
	
	
    AddRaidPolygon(raid_mapLayer,group7Points,"#4186f0",7);
     
    setTimeout(function(){CurrentRaidLocation(raid_mapLayer)},3000);
    mro_Map.events.register("moveend", Waze.map, function(){CurrentRaidLocation(raid_mapLayer)});
    mro_Map.events.register("zoomend", Waze.map, function(){CurrentRaidLocation(raid_mapLayer)});
        
}

bootstrap_MapOverlay(); 