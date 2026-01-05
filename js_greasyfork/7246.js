// ==UserScript==
// @name                Live User View Overlay
// @namespace           com.supermedic.liveuserviewoverlay
// @description         Shows LiveUser current view
// @include             https://www.waze.com/editor/*
// @include             https://www.waze.com/*/editor/*
// @include             https://editor-beta.waze.com/*
// @version             F.S.U
// @grant               none
// @downloadURL https://update.greasyfork.org/scripts/7246/Live%20User%20View%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/7246/Live%20User%20View%20Overlay.meta.js
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
	//Waze.model.liveUsers.users._events.register("add", null, newLiveUser);

}

function AddRaidPolygon(raidLayer,groupPoints,groupColor,groupNumber){

    var mro_Map = unsafeWindow.Waze.map;
    var mro_OL = unsafeWindow.OpenLayers;
    var raidGroupLabel = groupNumber;
    var groupName = groupNumber;

    var style = {
        strokeColor: "black",
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
        name: groupName
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

unsafeWindow.mapLayers = new unsafeWindow.OpenLayers.Layer.Vector("Live User View Overlay", {
													  displayInLayerSwitcher: true,
													  uniqueName: "__LiveUserViewOverlay"
													});
unsafeWindow.Waze.map.addLayer(unsafeWindow.mapLayers);
unsafeWindow.mapLayers.setVisibility(true);
function InitMapRaidOverlay(){

    var mro_Map = unsafeWindow.Waze.map;
    var mro_OL = unsafeWindow.OpenLayers;

    if (mro_Map == null) return;
    if (mro_OL == null) return;

	mapLayers.removeAllFeatures();

	for(var i=0;i<Waze.model.liveUsers.users.models.length;i++) {
		var name = Waze.model.liveUsers.users.models[i].attributes.name;
		var point = Waze.model.liveUsers.users.models[i].attributes.viewArea;
		//point.left //lon
		//point.right
		//point.top //lat
		//point.bottom

		var viewPoints = [{lon:point.left,lat:point.top},{lon:point.left,lat:point.bottom},{lon:point.right,lat:point.bottom},{lon:point.right,lat:point.top},{lon:point.left,lat:point.top}];

		AddRaidPolygon(mapLayers,viewPoints,"#F4EB37",name);
		console.info('############# userview addded');
	}

    setTimeout(function(){InitMapRaidOverlay()},1000);
    //mro_Map.events.register("moveend", Waze.map, function(){InitMapRaidOverlay()});
    //mro_Map.events.register("zoomend", Waze.map, function(){InitMapRaidOverlay()});
	//Waze.model.liveUsers.users.models[0]._events.register("change:showLayer", null, function(){console.info('change:showLayer');});

}

function newLiveUser() {
	console.info('########### add');
	console.info(this);
	for(var i=0;i<this.models.length;i++) {
		var userObj = this.models[i];
		userObj._events.register("change:center", null, function(){console.info('change:center');});
		userObj._events.register("move", null, function(){console.info('move');});
		userObj._events.register("moved", null, function(){console.info('move');});
	}
}

bootstrap_MapRaidOverlay();
