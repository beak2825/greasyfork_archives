// ==UserScript==
// @id             iitc-plugin-viennagis
// @name           IITC plugin: ViennaGIS map tiles
// @category       Map Tiles
// @version        0.1.0.20141013.0000
// @namespace      https://github.com/jonatkins/ingress-intel-total-conversion
// @description    [austria-2014-10-13-000000] Add the ViennaGIS map tiles as an optional layer.
// @include        https://www.ingress.com/intel*
// @include        http://www.ingress.com/intel*
// @match          https://www.ingress.com/intel*
// @match          http://www.ingress.com/intel*
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/5866/IITC%20plugin%3A%20ViennaGIS%20map%20tiles.user.js
// @updateURL https://update.greasyfork.org/scripts/5866/IITC%20plugin%3A%20ViennaGIS%20map%20tiles.meta.js
// ==/UserScript==


function wrapper(plugin_info) {
// ensure plugin framework is there, even if iitc is not yet loaded
if(typeof window.plugin !== 'function') window.plugin = function() {};

//PLUGIN AUTHORS: writing a plugin outside of the IITC build environment? if so, delete these lines!!
//(leaving them in place might break the 'About IITC' page or break update checks)
plugin_info.buildName = 'austria';
plugin_info.dateTimeVersion = '20141013.0000';
plugin_info.pluginId = 'basemap-viennagis';
//END PLUGIN AUTHORS NOTE



// PLUGIN START ////////////////////////////////////////////////////////


// use own namespace for plugin
window.plugin.mapTileViennaGIS = function() {};

window.plugin.mapTileViennaGIS.setup = function() {

  var gisTypes = {
    'lb': { name: "Luftbild", style: 'farbe' },
    'fmzk': { name: "MZK Fl&auml;chen", style: 'pastell' },
    'flwbplmzk': { name: "Fl&auml;chenwidmungs- und Bebauungsplan", style: 'rot' }
  };
  var gisSubdomains = [ 'maps', 'maps1','maps2', 'maps3', 'maps4' ];
  var gisTileUrlPrefix = window.location.protocol !== 'https:' ? 'http://{s}.wien.gv.at' : 'https://{s}.wien.gv.at';
  var gisOpt = {attribution: 'Datenquelle: Stadt Wien – data.wien.gv.at', maxNativeZoom: 19, maxZoom: 21, subdomains: gisSubdomains};

  $.each(gisTypes, function(type,data) {
    gisOpt['type'] = type;
    gisOpt['style'] = data.style;
    var gisMap = new L.TileLayer(gisTileUrlPrefix+'/wmts/{type}/{style}/google3857/{z}/{y}/{x}.jpeg', gisOpt);
    layerChooser.addBaseLayer(gisMap, 'ViennaGIS '+data.name);

  });
  
  var beschriftungMap = new L.TileLayer(gisTileUrlPrefix+'/wmts/beschriftung/normal/google3857/{z}/{y}/{x}.png', gisOpt);
  window.addLayerGroup('ViennaGIS Beschriftung', beschriftungMap, true);
};

var setup =  window.plugin.mapTileViennaGIS.setup;

// PLUGIN END //////////////////////////////////////////////////////////


setup.info = plugin_info; //add the script info data to the function as a property
if(!window.bootPlugins) window.bootPlugins = [];
window.bootPlugins.push(setup);
// if IITC has already booted, immediately run the 'setup' function
if(window.iitcLoaded && typeof setup === 'function') setup();
} // wrapper end
// inject code into site context
var script = document.createElement('script');
var info = {};
if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) info.script = { version: GM_info.script.version, name: GM_info.script.name, description: GM_info.script.description };
script.appendChild(document.createTextNode('('+ wrapper +')('+JSON.stringify(info)+');'));
(document.body || document.head || document.documentElement).appendChild(script);


