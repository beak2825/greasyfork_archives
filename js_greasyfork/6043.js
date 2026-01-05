// ==UserScript==
// @name                WME Aerial Auto Shifter (London)
// @version             1.50
// @description         This script automatically adjusts the position of satellite imagery within the boundary of Greater London
// @match               https://editor-beta.waze.com/*editor/*
// @match               https://www.waze.com/*editor/*
// @grant               none
// @icon                http://s3.amazonaws.com/uso_ss/icon/176646/large.png?1391605696
// @namespace           https://www.waze.com/forum/viewtopic.php?t=53022
// @author              Timbones
// @contributor         byo
// @contributor         berestovskyy
// @contributor         iainhouse
// @downloadURL https://update.greasyfork.org/scripts/6043/WME%20Aerial%20Auto%20Shifter%20%28London%29.user.js
// @updateURL https://update.greasyfork.org/scripts/6043/WME%20Aerial%20Auto%20Shifter%20%28London%29.meta.js
// ==/UserScript==
/*

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/

(function()
{
    var WM;

    // offsets in metres to shift the aerials
    var autoShiftX = 0, autoShiftY = 0; // was -10
    
    // this is the polygon for Greater London - replace this with a different one
    var autoShiftPolygon = [
      {x:-0.23595, y:51.32592},{x:-0.20758, y:51.32555},{x:-0.20715, y:51.3345},{x:-0.1782, y:51.33402},{x:-0.1786, y:51.32509},
      {x:-0.16423, y:51.32487},{x:-0.16529, y:51.29787},{x:-0.13668, y:51.29743},{x:-0.13727, y:51.28175},{x:-0.10885, y:51.28141},
      {x:-0.10865, y:51.28798},{x:-0.09425, y:51.28773},{x:-0.09392, y:51.29676},{x:-0.07955, y:51.29649},{x:-0.07881, y:51.3145},
      {x:-0.05014, y:51.31402},{x:-0.04971, y:51.32298},{x:-0.03535, y:51.32271},{x:-0.03492, y:51.33174},{x:-0.02045, y:51.33152},
      {x:-0.02074, y:51.32248},{x:-0.00649, y:51.32227},{x:-0.00681, y:51.3133},{x:0.00752, y:51.31307},{x:0.00634, y:51.28606},
      {x:0.02039, y:51.28584},{x:0.02076, y:51.29478},{x:0.03544, y:51.29456},{x:0.03501, y:51.28557},{x:0.09209, y:51.28457},
      {x:0.09327, y:51.31152},{x:0.10763, y:51.31122},{x:0.10805, y:51.32025},{x:0.12241, y:51.31997},{x:0.12326, y:51.33793},
      {x:0.13754, y:51.33767},{x:0.138, y:51.34671},{x:0.15232, y:51.34644},{x:0.15443, y:51.39132},{x:0.16928, y:51.39132},
      {x:0.16955, y:51.40878},{x:0.15524, y:51.4091},{x:0.15609, y:51.42732},{x:0.1705, y:51.42699},{x:0.17089, y:51.43598},
      {x:0.18529, y:51.43583},{x:0.1857, y:51.44464},{x:0.21444, y:51.4442},{x:0.21583, y:51.47116},{x:0.23016, y:51.47088},
      {x:0.23146, y:51.49785},{x:0.24588, y:51.49756},{x:0.24674, y:51.5155},{x:0.27551, y:51.51497},{x:0.27644, y:51.53299},
      {x:0.33402, y:51.53182},{x:0.33536, y:51.55849},{x:0.32102, y:51.55872},{x:0.32143, y:51.56757},{x:0.2926, y:51.56834},
      {x:0.29355, y:51.58618},{x:0.27907, y:51.58658},{x:0.27995, y:51.60451},{x:0.2656, y:51.60481},{x:0.2665, y:51.62279},
      {x:0.25214, y:51.62306},{x:0.25249, y:51.63189},{x:0.25253, y:51.63206},{x:0.18059, y:51.63341},{x:0.18015, y:51.62443},
      {x:0.108, y:51.62572},{x:0.10754, y:51.61675},{x:0.07869, y:51.61732},{x:0.07825, y:51.60827},{x:0.06355, y:51.60851},
      {x:0.06439, y:51.62649},{x:0.03546, y:51.627},{x:0.03628, y:51.64502},{x:-0.00694, y:51.64575},{x:-0.00552, y:51.68166},
      {x:-0.00596, y:51.69034},{x:-0.04001, y:51.69089},{x:-0.04287, y:51.69133},{x:-0.16368, y:51.6932},{x:-0.16383, y:51.69276},
      {x:-0.17794, y:51.69269},{x:-0.1783, y:51.68433},{x:-0.17868, y:51.68434},{x:-0.179, y:51.67553},{x:-0.19838, y:51.67582},
      {x:-0.19843, y:51.67546},{x:-0.22243, y:51.67596},{x:-0.22265, y:51.66715},{x:-0.23719, y:51.66741},{x:-0.23752, y:51.65844},
      {x:-0.25189, y:51.65863},{x:-0.25231, y:51.6497},{x:-0.28118, y:51.65007},{x:-0.28156, y:51.64107},{x:-0.33934, y:51.64187},
      {x:-0.33963, y:51.6329},{x:-0.36855, y:51.63335},{x:-0.36887, y:51.6243},{x:-0.39778, y:51.62474},{x:-0.39806, y:51.61574},
      {x:-0.41276, y:51.61592},{x:-0.41248, y:51.62494},{x:-0.48468, y:51.62592},{x:-0.48438, y:51.6349},{x:-0.51292, y:51.63523},
      {x:-0.51354, y:51.61752},{x:-0.49912, y:51.61739},{x:-0.49941, y:51.60807},{x:-0.51385, y:51.60828},{x:-0.51446, y:51.59057},
      {x:-0.50001, y:51.59041},{x:-0.50059, y:51.57239},{x:-0.48614, y:51.57228},{x:-0.4868, y:51.554},{x:-0.50118, y:51.5541},
      {x:-0.50443, y:51.45561},{x:-0.46129, y:51.45504},{x:-0.46215, y:51.428},{x:-0.41898, y:51.4275},{x:-0.41932, y:51.41845},
      {x:-0.39063, y:51.41809},{x:-0.39121, y:51.40013},{x:-0.34812, y:51.3995},{x:-0.34848, y:51.3905},{x:-0.3197, y:51.39009},
      {x:-0.32073, y:51.36286},{x:-0.33507, y:51.36307},{x:-0.33667, y:51.3184},{x:-0.32258, y:51.3182},{x:-0.32231, y:51.32725},
      {x:-0.2936, y:51.32679},{x:-0.29256, y:51.35382},{x:-0.27823, y:51.35354},{x:-0.2779, y:51.36253},{x:-0.26355, y:51.3623},
      {x:-0.26318, y:51.37133},{x:-0.24859, y:51.37111},{x:-0.24895, y:51.36211},{x:-0.23453, y:51.36193},{x:-0.23595, y:51.32592}
    ];

    var autoShiftFlag;
    
    var wasShifted = null;

    function init()
    {
        // init shortcuts
        if(!(WM = window.Waze.map) || !$('#WazeMap'))
        {
            window.console.log("WME Aerial Auto Shifter "
                + ": waiting for WME...");
            setTimeout(init, 555);
            return;
        }

        // detect any other auto shift scripts
        autoShiftFlag = document.getElementById("WAAS_autoShiftFlag");
        if (autoShiftFlag == null) {
          var autoShiftBox = $(
              '<div style="position:absolute;bottom:35px;left:85px;padding:8px;z-index:800;display:none;border-radius:5px;'
               + 'direction:ltr;background-color:rgba(255,128,0,0.4);color:white;font-weight:bold;cursor:default;" '
               + 'unselectable="on" id="WAAS_autoShiftFlag">'
               + '<span title="London aerials have been corrected by Google, and this script is no longer required">Aerials Auto Shift DISABLED</span>'
               + '</div>'
          );
          $('#WazeMap').append(autoShiftBox);
          autoShiftFlag = document.getElementById("WAAS_autoShiftFlag");
        }

        update();

        WM.events.on({
            zoomend : update,
            moveend : update
        });
        WM.baseLayer.events.on({
            loadend : update,
        });
        
        addBoundaryLayer(autoShiftPolygon);
        
        console.log("WME Aerial Auto Shifter initialised");
    }

    function update()
    {
      // calculate meters per pixel factor of current map
      var point = Waze.map.getCenter().transform(new OpenLayers.Projection("EPSG:900913"),new OpenLayers.Projection("EPSG:4326"));

      // detect original WAS script
      var sx = document.getElementById("WAS_sx");
      var sy = document.getElementById("WAS_sy");
      
      // Apply the shift and opacity
      if (isPointInPoly(autoShiftPolygon, point)) {
      
        if (wasShifted != true) {
          // if original WAS is running, just poke offsets into it
          if (sx != null) {
            if (parseInt(sx.value, 10) == 0 || parseInt(sy.value, 10) == 0) {
              sx.value = autoShiftX;
              sy.value = autoShiftY;
              sx.style.backgroundColor = '#ffb';
              sy.style.backgroundColor = '#ffb';
            }
          }
        
          // set the message to show we've shifted the aerials
          if (autoShiftFlag != null) {
            autoShiftFlag.style.display="block";
          }
        }
         
        var ipu = OpenLayers.INCHES_PER_UNIT;
        var metersPerPixel = WM.getResolution() * ipu['m'] / ipu[WM.getUnits()];

        WM.baseLayer.div.style.left = Math.round(autoShiftX / metersPerPixel) + 'px';
        WM.baseLayer.div.style.top = Math.round(autoShiftY / metersPerPixel) + 'px';
          
        wasShifted = true;
      }

      else if (wasShifted != false) {      
      
        // if original WAS is running, then reset the offsets
        if (sx != null && sx.value == autoShiftX && 
            sy != null && sy.value == autoShiftY) {
             
          sx.value = 0;
          sy.value = 0;
          sx.style.backgroundColor = '#fff';
          sy.style.backgroundColor = '#fff';
        }
        
        // clear the message
        if (autoShiftFlag != null) {
          autoShiftFlag.style.display="none";
        }
        WM.baseLayer.div.style.left = '0px';
        WM.baseLayer.div.style.top = '0px';
        wasShifted = false;
      }
    }

    // copied from http://jsfromhell.com/math/is-point-in-poly
    function isPointInPoly(poly, pt){
      for(var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
          ((poly[i].y <= pt.lat && pt.lat < poly[j].y) || (poly[j].y <= pt.lat && pt.lat < poly[i].y))
          && (pt.lon < (poly[j].x - poly[i].x) * (pt.lat - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x)
          && (c = !c);
      return c;
    }
    
    function addBoundaryLayer(coords) {
        
      // add a new layer for the boundary
      WAAS_boundary = new OL.Layer.Vector("Aerial Auto Shifter", 
        { rendererOptions: { zIndexing: true }, 
          uniqueName: 'auto_shifter' }
      ); 
      WAAS_boundary.setZIndex(-9999);
      WAAS_boundary.alwaysInRange = true;
      WAAS_boundary.displayInLayerSwitcher = false;
      Waze.map.addLayer(WAAS_boundary);
      Waze.map.addControl(new OL.Control.DrawFeature(WAAS_boundary, OL.Handler.Path));
      
      // hack in translation:
      I18n.translations[I18n.locale].layers.name.auto_shifter = "Aerial Auto Shifter"; 
       
      var points = [];
      for (var i in coords) {
        var point = OpenLayers.Layer.SphericalMercator.forwardMercator(coords[i].x, coords[i].y);
        points[i] = new OL.Geometry.Point(point.lon,point.lat);
      }
      var newline = new OL.Geometry.LineString(points);
        
      var style = { 
        strokeColor: "yellow", 
        strokeOpacity: 0.2,
        strokeWidth: 25,
      };
      var lineFeature = new OL.Feature.Vector(newline, {type: "routeArrow"}, style);
      
      // Display new segment
      WAAS_boundary.addFeatures([lineFeature]);
    }
    
    setTimeout(init, 555);
})();