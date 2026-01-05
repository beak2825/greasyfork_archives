// ==UserScript==
// @name                Live User View Overlay Colors backported RZ
// @namespace           https://greasyfork.org/en/users/5920-rickzabel
// @description         Shows LiveUser current view
// @include             https://www.waze.com/editor*
// @include             https://www.waze.com/*/editor*
// @include             https://editor-beta.waze.com/*
// @version             0.0.8
// @grant               none
// @downloadURL https://update.greasyfork.org/scripts/8927/Live%20User%20View%20Overlay%20Colors%20backported%20RZ.user.js
// @updateURL https://update.greasyfork.org/scripts/8927/Live%20User%20View%20Overlay%20Colors%20backported%20RZ.meta.js
// ==/UserScript==


//---------------------------------------------------------------------------------------
function bootstrap_MapRaidOverlay()
{

    setTimeout(InitMapRaidOverlay, 1000);

    //W.model.liveUsers.users._events.register("add", null, newLiveUser);
    mapLayers = new OpenLayers.Layer.Vector("Live User View Overlay", {
        displayInLayerSwitcher: true,
        uniqueName: "__LiveUserViewOverlay"
    });
    W.map.addLayer(mapLayers);
    mapLayers.setVisibility(true);
}

function AddRaidPolygon(raidLayer,groupPoints,groupColor,groupNumber, editing){

    var mro_Map = W.map;
    var mro_OL = OpenLayers;
    var raidGroupLabel = "";
    var groupName = groupNumber;



    //ranklock
    var EditingColor = groupColor;
    var thisUser = W.loginManager.user;
    var usrRank = thisUser.normalizedLevel;
    var thisUserID = thisUser.id;

    if (usrRank >= 4 || thisUserID == "103267873") {
        if(editing === true){
            EditingColor = "#ff1aff";
            groupColor = "#ff1aff";
        }
    }

    var style = {
        strokeColor: EditingColor,
        strokeOpacity: .8,
        strokeWidth: 3,
        fillColor: groupColor,
        fillOpacity: 0.15,
        label: raidGroupLabel,
        labelOutlineColor: "black",
        labelOutlineWidth: 3,
        fontSize: 14,
        fontColor: EditingColor,
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
    var mro_Map = W.map;

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

    var mro_Map = W.map;
    var mro_OL = OpenLayers;

    if (mro_Map == null) return;
    if (mro_OL == null) return;

    mapLayers.removeAllFeatures();

    for(var i=0;i<W.model.liveUsers.users.models.length;i++) {
        var name = W.model.liveUsers.users.models[i].attributes.name;
        var point = W.model.liveUsers.users.models[i].attributes.viewArea;
        var editing = W.model.liveUsers.users.models[i].attributes.editing;


        //point.left //lon
        //point.right
        //point.top //lat
        //point.bottom

        var rank = W.model.liveUsers.users.models[i].attributes.rank;
        var rankAray = ['#11911D',
                        '#119DB3',
                        '#FF8F1A',
                        '#744112',
                        '#6973B7',
                        '#AE3341'];
        var color = rankAray[rank];

        var viewPoints = [{lon:point.left,lat:point.top},{lon:point.left,lat:point.bottom},{lon:point.right,lat:point.bottom},{lon:point.right,lat:point.top},{lon:point.left,lat:point.top}];

        //AddRaidPolygon(mapLayers,viewPoints,"#F4EB37",name);
        AddRaidPolygon(mapLayers, viewPoints, color, name, editing);
        //console.info('############# userview addded');
    }

    setTimeout(function(){InitMapRaidOverlay()},1000);
    //mro_Map.events.register("moveend", W.map, function(){InitMapRaidOverlay()});
    //mro_Map.events.register("zoomend", W.map, function(){InitMapRaidOverlay()});
    //W.model.liveUsers.users.models[0]._events.register("change:showLayer", null, function(){console.info('change:showLayer');});

}

function newLiveUser() {
    //console.info('########### add');
    //console.info(this);
    for(var i=0;i<this.models.length;i++) {
        var userObj = this.models[i];
        userObj._events.register("change:center", null, function(){console.info('change:center');});
        userObj._events.register("move", null, function(){console.info('move');});
        userObj._events.register("moved", null, function(){console.info('move');});
    }
}

//bootstrap_MapRaidOverlay();
setTimeout(bootstrap_MapRaidOverlay, 3000);