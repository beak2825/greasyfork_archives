// ==UserScript==
// @name         abdullah-abbas Roundabout Editor
// @namespace    https://greasyfork.org/users/30701-justins83-waze
// @version      2025.12.28.16.34
// @description  أداة تعديل الدوارات (تحفظ الإعدادات والمكان)
// @include      https://www.waze.com/editor*
// @include      https://www.waze.com/*/editor*
// @include      https://beta.waze.com/*
// @exclude      https://www.waze.com/user/editor*
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @connect      greasyfork.org
// @author       JustinS83 (Modified by Abdullah Abbas)
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560443/abdullah-abbas%20Roundabout%20Editor.user.js
// @updateURL https://update.greasyfork.org/scripts/560443/abdullah-abbas%20Roundabout%20Editor.meta.js
// ==/UserScript==

/* global W, WazeWrap, OpenLayers, require, $, _, I18n */

(function() {

    var RAUtilWindow = null;
    var UpdateSegmentGeometry, MoveNode, MultiAction;
    var drc_layer;
	let wEvents;

    // إعدادات افتراضية
    var settings = {
        top: "15%",
        left: "25%",
        expanded: true,
        angles: false
    };

    function bootstrap(tries = 1) {
        if (typeof W !== 'undefined' && W.map && W.model && typeof WazeWrap !== 'undefined' && WazeWrap.Ready) {
            init();
        }
        else if (tries < 1000) {
            setTimeout(function () {bootstrap(++tries);}, 200);
        }
    }

    bootstrap();

    function init(){
        injectCss();
        loadSettings(); // استرجاع الإعدادات المحفوظة

        try {
            if(window.require) {
                UpdateSegmentGeometry = require('Waze/Action/UpdateSegmentGeometry');
                MoveNode = require("Waze/Action/MoveNode");
                MultiAction = require("Waze/Action/MultiAction");
            }
        } catch(e) { console.error("AA RA: Modules Error", e); }

        if(W.map.events) wEvents = W.map.events;
	    else wEvents = W.map.getMapEventsListener();

        RAUtilWindow = document.createElement('div');
        RAUtilWindow.id = "RAUtilWindow";
        RAUtilWindow.className = "aa-panel";

        // تطبيق الموقع المحفوظ
        RAUtilWindow.style.top = settings.top;
        RAUtilWindow.style.left = settings.left;

        // --- HTML ---
        var alertsHTML = `
            <div id="header" class="aa-header">
                <span><i class="fa fa-refresh"></i> تعديل الدوار</span>
                <span id="collapser" class="fa fa-minus-square aa-collapse-btn"></span>
            </div>

            <div id="divWrappers" class="aa-content">
                <div class="aa-section">
                    <label class="aa-label">
                        <input type="checkbox" id="chkRARoundaboutAngles"> تفعيل عرض الزوايا
                    </label>
                </div>

                <div class="aa-section aa-border">
                    <div class="aa-sec-title" style="color:#2980b9">الإزاحة (تحريك)</div>
                    <div class="aa-input-wrap">
                        <input type="text" id="shiftAmount" value="1" class="aa-input"> <span>متر</span>
                    </div>

                    <div class="aa-grid-arrows">
                        <div></div>
                        <div id="RAShiftUpBtn" class="aa-btn aa-blue" title="أعلى"><i class="fa fa-arrow-up"></i></div>
                        <div></div>

                        <div id="RAShiftLeftBtn" class="aa-btn aa-blue" title="يسار"><i class="fa fa-arrow-left"></i></div>
                        <div id="RAShiftDownBtn" class="aa-btn aa-blue" title="أسفل"><i class="fa fa-arrow-down"></i></div>
                        <div id="RAShiftRightBtn" class="aa-btn aa-blue" title="يمين"><i class="fa fa-arrow-right"></i></div>
                    </div>
                </div>

                <div class="aa-flex-row">
                    <div class="aa-section aa-border aa-flex-1">
                        <div class="aa-sec-title" style="color:#8e44ad">تدوير</div>
                        <div class="aa-input-wrap">
                            <input type="text" id="rotationAmount" value="5" class="aa-input"> <span>°</span>
                        </div>
                        <div class="aa-flex-center">
                            <div id="RARotateLeftBtn" class="aa-btn aa-purple" title="عكس عقارب الساعة"><i class="fa fa-undo"></i></div>
                            <div id="RARotateRightBtn" class="aa-btn aa-purple" title="مع عقارب الساعة"><i class="fa fa-repeat"></i></div>
                        </div>
                    </div>

                    <div class="aa-section aa-border aa-flex-1">
                        <div class="aa-sec-title" style="color:#27ae60">القطر</div>
                        <div class="aa-flex-center" style="margin-top: 35px;">
                            <div id="diameterChangeDecreaseBtn" class="aa-btn aa-red" title="تصغير"><i class="fa fa-compress"></i></div>
                            <div id="diameterChangeIncreaseBtn" class="aa-btn aa-green" title="تكبير"><i class="fa fa-expand"></i></div>
                        </div>
                    </div>
                </div>

                <div class="aa-section aa-border">
                    <div class="aa-sec-title" style="color:#e67e22">ضبط العقد</div>
                    <div class="aa-nodes-container">
                        <div class="aa-node-box">
                            <div class="aa-node-name">عقدة A</div>
                            <div class="aa-node-btns">
                                <span id="btnMoveANodeIn" class="aa-text-btn aa-orange">إدخال</span>
                                <span id="btnMoveANodeOut" class="aa-text-btn aa-orange">إخراج</span>
                            </div>
                        </div>
                        <div class="aa-sep"></div>
                        <div class="aa-node-box">
                            <div class="aa-node-name">عقدة B</div>
                            <div class="aa-node-btns">
                                <span id="btnMoveBNodeIn" class="aa-text-btn aa-orange">إدخال</span>
                                <span id="btnMoveBNodeOut" class="aa-text-btn aa-orange">إخراج</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        `;

        RAUtilWindow.innerHTML = alertsHTML;
        document.body.appendChild(RAUtilWindow);

        // تطبيق حالة الطي/التوسيع المحفوظة
        if (!settings.expanded) {
            $("#divWrappers").hide();
            $("#collapser").removeClass("fa-minus-square").addClass("fa-plus-square");
        }

        // تطبيق خيار الزوايا المحفوظ
        if (settings.angles) {
            $("#chkRARoundaboutAngles").prop('checked', true);
        }

        bindEvents();
        makeDraggable(RAUtilWindow, document.getElementById('header'));

        W.selectionManager.events.register("selectionchanged", null, checkDisplayTool);

        // تفعيل رسم الزوايا إذا كان محفوظاً
        if(settings.angles){
             wEvents.register("zoomend", null, DrawRoundaboutAngles);
             wEvents.register("moveend", null, DrawRoundaboutAngles);
        }
    }

    // --- إدارة الإعدادات ---
    function loadSettings() {
        var loaded = localStorage.getItem("WME_RAUtil_AA_Settings");
        if (loaded) {
            try {
                settings = $.extend(settings, JSON.parse(loaded));
            } catch(e) { console.log("Error loading settings"); }
        }
    }

    function saveSettings() {
        settings.top = RAUtilWindow.style.top;
        settings.left = RAUtilWindow.style.left;
        settings.expanded = $("#divWrappers").is(":visible");
        settings.angles = $("#chkRARoundaboutAngles").is(":checked");

        localStorage.setItem("WME_RAUtil_AA_Settings", JSON.stringify(settings));
    }

    // --- ربط الأزرار ---
    function bindEvents() {
        $('#RAShiftLeftBtn').click(function(e){ e.stopPropagation(); runLogic('ShiftLong', -$('#shiftAmount').val()); });
        $('#RAShiftRightBtn').click(function(e){ e.stopPropagation(); runLogic('ShiftLong', $('#shiftAmount').val()); });
        $('#RAShiftUpBtn').click(function(e){ e.stopPropagation(); runLogic('ShiftLat', $('#shiftAmount').val()); });
        $('#RAShiftDownBtn').click(function(e){ e.stopPropagation(); runLogic('ShiftLat', -$('#shiftAmount').val()); });

        $('#RARotateLeftBtn').click(function(e){ e.stopPropagation(); runLogic('Rotate', $('#rotationAmount').val()); });
        $('#RARotateRightBtn').click(function(e){ e.stopPropagation(); runLogic('Rotate', -$('#rotationAmount').val()); });

        $('#diameterChangeDecreaseBtn').click(function(e){ e.stopPropagation(); runLogic('Diameter', -1); });
        $('#diameterChangeIncreaseBtn').click(function(e){ e.stopPropagation(); runLogic('Diameter', 1); });

        $('#btnMoveANodeIn').click(function(){moveNodeIn(WazeWrap.getSelectedFeatures()[0].WW.getObjectModel().attributes.id, WazeWrap.getSelectedFeatures()[0].WW.getObjectModel().attributes.fromNodeID);});
        $('#btnMoveANodeOut').click(function(){moveNodeOut(WazeWrap.getSelectedFeatures()[0].WW.getObjectModel().attributes.id, WazeWrap.getSelectedFeatures()[0].WW.getObjectModel().attributes.fromNodeID);});
        $('#btnMoveBNodeIn').click(function(){moveNodeIn(WazeWrap.getSelectedFeatures()[0].WW.getObjectModel().attributes.id, WazeWrap.getSelectedFeatures()[0].WW.getObjectModel().attributes.toNodeID);});
        $('#btnMoveBNodeOut').click(function(){moveNodeOut(WazeWrap.getSelectedFeatures()[0].WW.getObjectModel().attributes.id, WazeWrap.getSelectedFeatures()[0].WW.getObjectModel().attributes.toNodeID);});

        $('#shiftAmount, #rotationAmount').keypress(function(event) {
            if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57))
                event.preventDefault();
        });

        // زر التصغير مع الحفظ
        $('#collapser').click(function(){
            $("#divWrappers").slideToggle("fast", function() {
                saveSettings(); // حفظ الحالة بعد الانتهاء من الحركة
            });
            $(this).toggleClass("fa-minus-square fa-plus-square");
        });

        // خيار الزوايا مع الحفظ
        $("#chkRARoundaboutAngles").click(function(){
            saveSettings();
            if($(this).is(":checked")){
                wEvents.register("zoomend", null, DrawRoundaboutAngles);
                wEvents.register("moveend", null, DrawRoundaboutAngles);
                DrawRoundaboutAngles();
                if(drc_layer) drc_layer.setVisibility(true);
            } else {
                wEvents.unregister("zoomend", null, DrawRoundaboutAngles);
                wEvents.unregister("moveend", null, DrawRoundaboutAngles);
                if(drc_layer) drc_layer.setVisibility(false);
            }
        });
    }

    function runLogic(action, value) {
        var segObj = WazeWrap.getSelectedFeatures()[0];
        if(!segObj) return;

        if(action === 'ShiftLong') {
            var convertedCoords = WazeWrap.Geometry.ConvertTo4326(segObj.WW.getAttributes().geoJSONGeometry.coordinates[0][0], segObj.WW.getAttributes().geoJSONGeometry.coordinates[0][1]);
            var gpsOffset = WazeWrap.Geometry.CalculateLongOffsetGPS(value, convertedCoords.lon, convertedCoords.lat);
            ShiftSegmentsNodesLong(segObj, gpsOffset);
        }
        else if(action === 'ShiftLat') {
            var convertedCoords = WazeWrap.Geometry.ConvertTo4326(segObj.WW.getAttributes().geoJSONGeometry.coordinates[0][0], segObj.WW.getAttributes().geoJSONGeometry.coordinates[0][1]);
            var gpsOffset = WazeWrap.Geometry.CalculateLatOffsetGPS(value, convertedCoords.lon, convertedCoords.lat);
            ShiftSegmentNodesLat(segObj, gpsOffset);
        }
        else if(action === 'Rotate') RotateRA(segObj, value);
        else if(action === 'Diameter') ChangeDiameter(segObj, value);
    }

    function checkDisplayTool(){
        if(WazeWrap.hasSelectedFeatures() && WazeWrap.getSelectedFeatures()[0].WW.getType() === 'segment'){
            var allRA = true;
            for (let i = 0; i < WazeWrap.getSelectedFeatures().length; i++){
                if(!WazeWrap.Model.isRoundaboutSegmentID(WazeWrap.getSelectedFeatures()[i].WW.getObjectModel().attributes.id))
                    allRA = false;
            }
            if(!allRA || WazeWrap.getSelectedFeatures().length === 0)
                $('#RAUtilWindow').css({'visibility': 'hidden'});
            else{
                $('#RAUtilWindow').css({'visibility': 'visible'});
            }
        } else {
            $('#RAUtilWindow').css({'visibility': 'hidden'});
        }
    }

    function ShiftSegmentNodesLat(segObj, latOffset){
        var RASegs = WazeWrap.Model.getAllRoundaboutSegmentsFromObj(segObj);
        var multiaction = new MultiAction();
        for(let i=0; i<RASegs.length; i++){
            segObj = W.model.segments.getObjectById(RASegs[i]);
            var newGeometry = structuredClone(segObj.attributes.geoJSONGeometry);
            for(let j=1; j < newGeometry.coordinates.length-1; j++) newGeometry.coordinates[j][1] += latOffset;
            multiaction.doSubAction(W.model, new UpdateSegmentGeometry(segObj, segObj.attributes.geoJSONGeometry, newGeometry));
            var node = W.model.nodes.objects[segObj.attributes.toNodeID];
            if(segObj.attributes.revDirection) node = W.model.nodes.objects[segObj.attributes.fromNodeID];
            var newNodeGeometry = structuredClone(node.attributes.geoJSONGeometry);
            newNodeGeometry.coordinates[1] += latOffset;
            var connectedSegObjs = {};
            for(var k=0;k<node.attributes.segIDs.length;k++) connectedSegObjs[node.attributes.segIDs[k]] = structuredClone(W.model.segments.getObjectById(node.attributes.segIDs[k]).attributes.geoJSONGeometry);
            multiaction.doSubAction(W.model, new MoveNode(node, node.attributes.geoJSONGeometry, newNodeGeometry, connectedSegObjs, {}));
        }
        W.model.actionManager.add(multiaction);
    }

    function ShiftSegmentsNodesLong(segObj, longOffset){
        var RASegs = WazeWrap.Model.getAllRoundaboutSegmentsFromObj(segObj);
        var multiaction = new MultiAction();
        for(let i=0; i<RASegs.length; i++){
            segObj = W.model.segments.getObjectById(RASegs[i]);
            var newGeometry = structuredClone(segObj.attributes.geoJSONGeometry);
            for(let j=1; j < newGeometry.coordinates.length-1; j++) newGeometry.coordinates[j][0] += longOffset;
            multiaction.doSubAction(W.model, new UpdateSegmentGeometry(segObj, segObj.attributes.geoJSONGeometry, newGeometry));
            var node = W.model.nodes.objects[segObj.attributes.toNodeID];
            if(segObj.attributes.revDirection) node = W.model.nodes.objects[segObj.attributes.fromNodeID];
            var newNodeGeometry = structuredClone(node.attributes.geoJSONGeometry);
            newNodeGeometry.coordinates[0] += longOffset;
            var connectedSegObjs = {};
            for(let k=0;k<node.attributes.segIDs.length;k++) connectedSegObjs[node.attributes.segIDs[k]] = structuredClone(W.model.segments.getObjectById(node.attributes.segIDs[k]).attributes.geoJSONGeometry);
            multiaction.doSubAction(W.model, new MoveNode(node, node.attributes.geoJSONGeometry, newNodeGeometry, connectedSegObjs, {}));
        }
        W.model.actionManager.add(multiaction);
    }

    function RotateRA(segObj, angle){
        var RASegs = WazeWrap.Model.getAllRoundaboutSegmentsFromObj(segObj);
        var raCenter = W.model.junctions.objects[segObj.WW.getAttributes().junctionID].attributes.geoJSONGeometry.coordinates;
        var multiaction = new MultiAction();
        for(let i=0; i<RASegs.length; i++){
            segObj = W.model.segments.getObjectById(RASegs[i]);
            var newGeometry = structuredClone(segObj.attributes.geoJSONGeometry);
            var originalLength = segObj.attributes.geoJSONGeometry.coordinates.length;
            var center = raCenter;
            var segPoints = [];
            for(let j=0; j<originalLength;j++) segPoints.push(new OpenLayers.Geometry.Point(segObj.attributes.geoJSONGeometry.coordinates[j][0], segObj.attributes.geoJSONGeometry.coordinates[j][1]));
            var newPoints = rotatePoints(center, segPoints, angle);
            for(let j=1; j<originalLength-1;j++) newGeometry.coordinates[j] = [newPoints[j].x, newPoints[j].y];
            multiaction.doSubAction(W.model, new UpdateSegmentGeometry(segObj, segObj.attributes.geoJSONGeometry, newGeometry));
            var node = W.model.nodes.objects[segObj.attributes.toNodeID];
            if(segObj.attributes.revDirection) node = W.model.nodes.objects[segObj.attributes.fromNodeID];
            var nodePoints = [];
            var newNodeGeometry = structuredClone(node.attributes.geoJSONGeometry);
            nodePoints.push(new OpenLayers.Geometry.Point(node.attributes.geoJSONGeometry.coordinates[0], node.attributes.geoJSONGeometry.coordinates[1]));
            nodePoints.push(new OpenLayers.Geometry.Point(node.attributes.geoJSONGeometry.coordinates[0], node.attributes.geoJSONGeometry.coordinates[1]));
            var gps = rotatePoints(center, nodePoints, angle);
            newNodeGeometry.coordinates = [gps[0].x, gps[0].y];
            var connectedSegObjs = {};
            for(let k=0;k<node.attributes.segIDs.length;k++) connectedSegObjs[node.attributes.segIDs[k]] = structuredClone(W.model.segments.getObjectById(node.attributes.segIDs[k]).attributes.geoJSONGeometry);
            multiaction.doSubAction(W.model, new MoveNode(node, node.attributes.geoJSONGeometry, newNodeGeometry, connectedSegObjs, {}));
        }
        W.model.actionManager.add(multiaction);
    }

    function ChangeDiameter(segObj, amount){
        var RASegs = WazeWrap.Model.getAllRoundaboutSegmentsFromObj(segObj);
        var raCenter = W.model.junctions.objects[segObj.WW.getAttributes().junctionID].attributes.geoJSONGeometry.coordinates;
        let { lon: centerX, lat: centerY } = WazeWrap.Geometry.ConvertTo900913(raCenter);
        for(let i=0; i<RASegs.length; i++){
            segObj = W.model.segments.getObjectById(RASegs[i]);
            var newGeometry = structuredClone(segObj.attributes.geoJSONGeometry);
            for(let j=1; j < newGeometry.coordinates.length-1; j++){
                let pt = segObj.attributes.geoJSONGeometry.coordinates[j];
                let { lon: pointX, lat: pointY } = WazeWrap.Geometry.ConvertTo900913(pt);
                let h = Math.sqrt(Math.abs(Math.pow(pointX - centerX, 2) + Math.pow(pointY - centerY, 2)));
                let ratio = (h + amount)/h;
                let x = centerX + (pointX - centerX) * ratio;
                let y = centerY + (pointY - centerY) * ratio;
                let { lon: newX, lat: newY } = WazeWrap.Geometry.ConvertTo4326([x, y]);
                newGeometry.coordinates[j] = [newX, newY];
            }
            W.model.actionManager.add(new UpdateSegmentGeometry(segObj, segObj.attributes.geoJSONGeometry, newGeometry));
            var node = W.model.nodes.objects[segObj.attributes.toNodeID];
            if(segObj.attributes.revDirection) node = W.model.nodes.objects[segObj.attributes.fromNodeID];
            var newNodeGeometry = structuredClone(node.attributes.geoJSONGeometry);
            let { lon: pointX, lat: pointY } = WazeWrap.Geometry.ConvertTo900913(newNodeGeometry.coordinates);
            let h = Math.sqrt(Math.abs(Math.pow(pointX - centerX, 2) + Math.pow(pointY - centerY, 2)));
            let ratio = (h + amount)/h;
            let x = centerX + (pointX - centerX) * ratio;
            let y = centerY + (pointY - centerY) * ratio;
            let { lon: newX, lat: newY } = WazeWrap.Geometry.ConvertTo4326([x, y]);
            newNodeGeometry.coordinates = [newX, newY];
            var connectedSegObjs = {};
            for(let j=0;j<node.attributes.segIDs.length;j++) connectedSegObjs[node.attributes.segIDs[j]] = structuredClone(W.model.segments.getObjectById(node.attributes.segIDs[j]).attributes.geoJSONGeometry);
            W.model.actionManager.add(new MoveNode(node, node.attributes.geoJSONGeometry, newNodeGeometry, connectedSegObjs, {}));
        }
        if($("#chkRARoundaboutAngles").is(":checked")) DrawRoundaboutAngles();
    }

    function moveNodeIn(sourceSegID, nodeID){
        let isANode = true;
        let curSeg = W.model.segments.getObjectById(sourceSegID);
        if (curSeg.attributes.geoJSONGeometry.coordinates.length > 2) {
            if(nodeID === curSeg.attributes.toNodeID) isANode = false;
            let node = W.model.nodes.getObjectById(nodeID);
            let currNodePOS = structuredClone(node.attributes.geoJSONGeometry.coordinates);
            let otherSeg;
            let nodeSegs = [...node.attributes.segIDs];
            nodeSegs = _.without(nodeSegs, sourceSegID);
            for(let i=0; i<nodeSegs.length; i++){
                let s = W.model.segments.getObjectById(nodeSegs[i]);
                if(s.attributes.junctionID){ otherSeg = s; break; }
            }
            var multiaction = new MultiAction();
            var newNodeGeometry = { type: 'Point', coordinates: structuredClone(curSeg.attributes.geoJSONGeometry.coordinates[isANode ? 1 : curSeg.attributes.geoJSONGeometry.coordinates.length - 2]) };
            let newSegGeo = structuredClone(curSeg.attributes.geoJSONGeometry);
            newSegGeo.coordinates.splice(isANode ? 1 : newSegGeo.coordinates.length - 2, 1);
            multiaction.doSubAction(W.model, new UpdateSegmentGeometry(curSeg, curSeg.attributes.geoJSONGeometry, newSegGeo));
            var connectedSegObjs = {};
            for(var j=0;j<node.attributes.segIDs.length;j++) connectedSegObjs[node.attributes.segIDs[j]] = structuredClone(W.model.segments.getObjectById(node.attributes.segIDs[j]).attributes.geoJSONGeometry);
            multiaction.doSubAction(W.model, new MoveNode(node, node.attributes.geoJSONGeometry, newNodeGeometry, connectedSegObjs, {}));
            if((otherSeg.attributes.revDirection && !curSeg.attributes.revDirection) || (!otherSeg.attributes.revDirection && curSeg.attributes.revDirection)) isANode = !isANode;
            let newGeo = structuredClone(otherSeg.attributes.geoJSONGeometry);
            newGeo.coordinates.splice(isANode ? -1 : 1, 0, [currNodePOS[0], currNodePOS[1]]);
            multiaction.doSubAction(W.model, new UpdateSegmentGeometry(otherSeg, otherSeg.attributes.geoJSONGeometry, newGeo));
            W.model.actionManager.add(multiaction);
            if($("#chkRARoundaboutAngles").is(":checked")) DrawRoundaboutAngles();
        }
    }

    function moveNodeOut(sourceSegID, nodeID){
        let isANode = true;
        let curSeg = W.model.segments.getObjectById(sourceSegID);
        if(nodeID === curSeg.attributes.toNodeID) isANode = false;
        let node = W.model.nodes.getObjectById(nodeID);
        let currNodePOS = structuredClone(node.attributes.geoJSONGeometry.coordinates);
        let otherSeg;
        let nodeSegs = [...node.attributes.segIDs];
        nodeSegs = _.without(nodeSegs, sourceSegID);
        for(let i=0; i<nodeSegs.length; i++){
            let s = W.model.segments.getObjectById(nodeSegs[i]);
            if(s.attributes.junctionID){ otherSeg = s; break; }
        }
        if(otherSeg.attributes.geoJSONGeometry.coordinates.length > 2){
            let newSegGeo = structuredClone(curSeg.attributes.geoJSONGeometry);
            newSegGeo.coordinates.splice(isANode ? 1 : newSegGeo.coordinates.length - 1, 0, [currNodePOS[0], currNodePOS[1]]);
            var multiaction = new MultiAction();
            multiaction.doSubAction(W.model, new UpdateSegmentGeometry(curSeg, curSeg.attributes.geoJSONGeometry, newSegGeo));
            if((otherSeg.attributes.revDirection && !curSeg.attributes.revDirection) || (!otherSeg.attributes.revDirection && curSeg.attributes.revDirection)) isANode = !isANode;
            var newNodeGeometry = { type: 'Point', coordinates: structuredClone(otherSeg.attributes.geoJSONGeometry.coordinates[isANode ? otherSeg.attributes.geoJSONGeometry.coordinates.length - 2 : 1]) };
            let newGeo = structuredClone(otherSeg.attributes.geoJSONGeometry);
            newGeo.coordinates.splice(isANode ? -2 : 1, 1);
            multiaction.doSubAction(W.model, new UpdateSegmentGeometry(otherSeg, otherSeg.attributes.geoJSONGeometry, newGeo));
            var connectedSegObjs = {};
            for(var j=0; j < node.attributes.segIDs.length;j++) connectedSegObjs[node.attributes.segIDs[j]] = structuredClone(W.model.segments.getObjectById(node.attributes.segIDs[j]).attributes.geoJSONGeometry);
            multiaction.doSubAction(W.model, new MoveNode(node, node.attributes.geoJSONGeometry, newNodeGeometry, connectedSegObjs, {}));
            W.model.actionManager.add(multiaction);
            if($("#chkRARoundaboutAngles").is(":checked")) DrawRoundaboutAngles();
        }
    }

    function rotatePoints(origin, points, angle){
        var lineFeature = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.LineString(points),null,null);
        lineFeature.geometry.rotate(angle, new OpenLayers.Geometry.Point(origin[0], origin[1]));
        return [].concat(lineFeature.geometry.components);
    }

    function DrawRoundaboutAngles(){
        var layers = W.map.getLayersBy("uniqueName","__DrawRoundaboutAngles");
        if(layers.length > 0) drc_layer = layers[0];
        else {
            let drc_style = new OpenLayers.Style({
                fillOpacity: 0.0, strokeOpacity: 1.0, fillColor: "#FF40C0", strokeColor: "${strokeColor}", strokeWidth: 10,
                fontWeight: "bold", pointRadius: 0, label : "${labelText}", fontFamily: "Tahoma, Courier New",
                labelOutlineColor: "#FFFFFF", labelOutlineWidth: 3, fontColor: "${labelColor}", fontSize: "10px"
            });
            drc_layer = new OpenLayers.Layer.Vector("Roundabout Angles", { displayInLayerSwitcher: true, uniqueName: "__DrawRoundaboutAngles", styleMap: new OpenLayers.StyleMap(drc_style) });
            W.map.addLayer(drc_layer);
            drc_layer.setVisibility(true);
        }
        if (drc_layer.visibility == false || W.map.getZoom() < 1) { drc_layer.removeAllFeatures(); return; }

        var rsegments = {};
        for (let iseg in W.model.segments.objects) {
            let isegment = W.model.segments.getObjectById(iseg);
            if (isegment.getOLGeometry() !== null && isegment.attributes.junctionID != undefined) {
                let rsegs = rsegments[isegment.attributes.junctionID];
                if (rsegs == undefined) rsegments[isegment.attributes.junctionID] = rsegs = new Array();
                rsegs.push(isegment);
            }
        }
        var drc_features = [];

        for (let irid in rsegments) {
            let rsegs = rsegments[irid];
            let isegment = rsegs[0];
            let nodes = [];
            let nodes_x = [];
            let nodes_y = [];
            nodes = rsegs.map(seg => seg.attributes.fromNodeID);
            nodes = [...nodes, ...rsegs.map(seg => seg.attributes.toNodeID)];
            nodes = _.uniq(nodes);
            let node_objects = W.model.nodes.getByIds(nodes);
            nodes_x = node_objects.map(n => n.getOLGeometry().x);
            nodes_y = node_objects.map(n => n.getOLGeometry().y);
            let sr_x = 0; let sr_y = 0; let radius = 0; let numNodes = nodes_x.length;
            if (numNodes >= 1) {
                let junction = W.model.junctions.getObjectById(irid);
                sr_x = junction.getOLGeometry().x;
                sr_y = junction.getOLGeometry().y;
                let angles = []; let rr = -1; let r_ix;
                for(let i=0; i<nodes_x.length; i++) {
                    let dx = nodes_x[i] - sr_x; let dy = nodes_y[i] - sr_y;
                    let rr2 = dx*dx + dy*dy;
                    if (rr < rr2) { rr = rr2; r_ix = i; }
                    let angle = Math.atan2(dy, dx);
                    angle = (360.0 + (angle * 180.0 / Math.PI));
                    if (angle < 0.0) angle += 360.0; if (angle > 360.0) angle -= 360.0;
                    angles.push(angle);
                }
                radius = Math.sqrt(rr);
                angles = angles.sort(function(a,b) { return a - b; });
                angles.push( angles[0] + 360.0);
                angles = angles.sort(function(a,b) { return a - b; });
                let drc_color = (numNodes <= 4) ? "#0040FF" : "#002080";
                let drc_point = new OpenLayers.Geometry.Point(sr_x, sr_y );
                let drc_circle = new OpenLayers.Geometry.Polygon.createRegularPolygon( drc_point, radius, 10 * W.map.getZoom() );
                let drc_feature = new OpenLayers.Feature.Vector(drc_circle, {labelText: "", labelColor: "#000000", strokeColor: drc_color, });
                drc_features.push(drc_feature);

                if (numNodes >= 2 && numNodes <= 4 && W.map.getZoom() >= 5) {
                    for(let i=0; i<nodes_x.length; i++) {
                        let ix = nodes_x[i]; let iy = nodes_y[i];
                        let startPt = new OpenLayers.Geometry.Point( sr_x, sr_y );
                        let endPt = new OpenLayers.Geometry.Point( ix, iy );
                        let line = new OpenLayers.Geometry.LineString([startPt, endPt]);
                        let style = {strokeColor:drc_color, strokeWidth:2};
                        drc_features.push(new OpenLayers.Feature.Vector(line, {}, style));
                    }
                    let angles_float = [];
                    for(let i=0; i<angles.length - 1; i++) {
                        let ang = angles[i+1] - angles[i+0];
                        if (ang < 0) ang += 360.0; if (ang < 0) ang += 360.0;
                        if (ang < 135.0) ang = ang - 90.0; else ang = ang - 180.0;
                        angles_float.push( ang );
                    }
                    for(let i=0; i<angles.length - 1; i++) {
                        let arad = (angles[i+0] + angles[i+1]) * 0.5 * Math.PI / 180.0;
                        let ex = sr_x + Math.cos (arad) * radius * 0.5;
                        let ey = sr_y + Math.sin (arad) * radius * 0.5;
                        let angint = Math.round(angles_float[i] * 100)/100;
                        let kolor = "#004000";
                        if (angint <= -15 || angint >= 15) kolor = "#FF0000";
                        else if (angint <= -13 || angint >= 13) kolor = "#FFC000";
                        let pt = new OpenLayers.Geometry.Point(ex, ey);
                        drc_features.push(new OpenLayers.Feature.Vector( pt, {labelText: (angint + "°"), labelColor: kolor } ));
                    }
                } else {
                    for(let i=0; i < nodes_x.length; i++) {
                        let ix = nodes_x[i]; let iy = nodes_y[i];
                        let startPt = new OpenLayers.Geometry.Point( sr_x, sr_y );
                        let endPt = new OpenLayers.Geometry.Point( ix, iy );
                        let line = new OpenLayers.Geometry.LineString([startPt, endPt]);
                        let style = {strokeColor:drc_color, strokeWidth:2};
                        drc_features.push(new OpenLayers.Feature.Vector(line, {}, style));
                    }
                }
                let p1 = new OpenLayers.Geometry.Point( nodes_x[r_ix], nodes_y[r_ix] );
                let p2 = new OpenLayers.Geometry.Point( sr_x, sr_y );
                let line = new OpenLayers.Geometry.LineString([p1, p2]);
                let geo_radius = line.getGeodesicLength(W.map.getProjectionObject());
                let diam = geo_radius * 2.0;
                let center_pt = new OpenLayers.Geometry.Point(sr_x, sr_y);
                drc_features.push(new OpenLayers.Feature.Vector( center_pt, {labelText: (diam.toFixed(0) + "m"), labelColor: "#000000" } ));
            }
        }
        drc_layer.removeAllFeatures();
        drc_layer.addFeatures(drc_features);
    }

    function injectCss() {
        var css = `
            @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&display=swap');

            .aa-panel {
                position: fixed; top: 15%; left: 25%; width: 300px;
                background-color: #fdfdfd;
                border: 1px solid #ccc;
                border-radius: 8px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                font-family: 'Cairo', sans-serif;
                direction: rtl;
                z-index: 9999;
                overflow: hidden;
            }
            .aa-header {
                background: linear-gradient(135deg, #2980b9, #2c3e50);
                color: white; padding: 10px 15px;
                font-weight: bold; border-radius: 8px 8px 0 0;
                cursor: move; display: flex; justify-content: space-between; align-items: center;
            }
            .aa-collapse-btn { cursor: pointer; }
            .aa-content { padding: 10px; }
            .aa-section { margin-bottom: 8px; }
            .aa-border { background: #f9f9f9; border: 1px solid #eee; border-radius: 6px; padding: 8px; text-align: center; }
            .aa-sec-title { font-size: 13px; font-weight: bold; margin-bottom: 5px; border-bottom: 1px solid #e0e0e0; padding-bottom: 3px; }
            .aa-input-wrap { display: flex; justify-content: center; align-items: center; margin-bottom: 5px; }
            .aa-input { width: 40px; text-align: center; border: 1px solid #ccc; border-radius: 4px; padding: 2px; margin-left: 5px; }
            .aa-grid-arrows { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 3px; width: 100px; margin: 0 auto; }
            .aa-flex-row { display: flex; gap: 8px; margin-bottom: 8px; }
            .aa-flex-1 { flex: 1; }
            .aa-flex-center { display: flex; justify-content: space-around; }

            /* الأزرار المحسنة */
            .aa-btn {
                width: 35px; height: 35px;
                border-radius: 50%;
                display: flex; align-items: center; justify-content: center;
                cursor: pointer; color: white;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                transition: transform 0.1s;
                font-size: 16px;
                margin: 0 auto;
            }
            .aa-btn:active { transform: scale(0.95); }
            .aa-blue { background: linear-gradient(#3498db, #2980b9); }
            .aa-purple { background: linear-gradient(#9b59b6, #8e44ad); }
            .aa-green { background: linear-gradient(#2ecc71, #27ae60); }
            .aa-red { background: linear-gradient(#e74c3c, #c0392b); }

            /* أزرار العقد */
            .aa-nodes-container { display: flex; justify-content: space-between; font-size: 12px; }
            .aa-node-box { flex: 1; }
            .aa-node-name { margin-bottom: 3px; font-weight: bold; color: #555; }
            .aa-node-btns { display: flex; justify-content: center; gap: 2px; }
            .aa-text-btn {
                display: inline-block; padding: 2px 8px; border-radius: 12px;
                color: white; font-size: 10px; cursor: pointer;
            }
            .aa-orange { background: #e67e22; }
            .aa-sep { width: 1px; background: #ddd; margin: 0 5px; }
        `;
        $('<style type="text/css">' + css + '</style>').appendTo('head');
    }

    function makeDraggable(elmnt, handle) {
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        handle.onmousedown = dragMouseDown;
        function dragMouseDown(e) { e = e || window.event; if(e.target.id === 'collapser' || e.target.id === 'collapserLink') return; e.preventDefault(); pos3 = e.clientX; pos4 = e.clientY; document.onmouseup = closeDragElement; document.onmousemove = elementDrag; }
        function elementDrag(e) { e = e || window.event; e.preventDefault(); pos1 = pos3 - e.clientX; pos2 = pos4 - e.clientY; pos3 = e.clientX; pos4 = e.clientY; elmnt.style.top = (elmnt.offsetTop - pos2) + "px"; elmnt.style.left = (elmnt.offsetLeft - pos1) + "px"; saveSettings(); }
        function closeDragElement() { document.onmouseup = null; document.onmousemove = null; }
    }

})();