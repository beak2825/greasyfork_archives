// ==UserScript==
// @id             IITC_DX_INTEGRATION
// @name           IITC_DX_INTEGRATION
// @version        0.1.7.0
// @namespace      IITC_DX_INTEGRATION
// @description    Integrate Dx Fielding Simulation
// @include        https://www.ingress.com/intel*
// @include        http://www.ingress.com/intel*
// @match          https://www.ingress.com/intel*
// @match          http://www.ingress.com/intel*
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/7582/IITC_DX_INTEGRATION.user.js
// @updateURL https://update.greasyfork.org/scripts/7582/IITC_DX_INTEGRATION.meta.js
// ==/UserScript==


function wrapper() {
	// in case IITC is not available yet, define the base plugin object
	if (typeof window.plugin !== "function") {
		window.plugin = function() {
		};
	}
	// base context for plugin
	window.plugin.dxplugin = function() {
	};
	var self = window.plugin.dxplugin;
	window.plugin.dxplugin.dxMarkers = [];
	window.plugin.dxplugin.dxLayer = null;
	window.plugin.dxplugin.dxPortals = [];
	window.plugin.dxplugin.dxPortalsMarker = [];
	// custom dialog wrapper with more flexibility
	self.import = function importJSON() {
		$('#dxWrapperExport').remove();
		if ($('#dxWrapper').is(':visible'))
		{
			$('#dxWrapper').remove();
			return;
		}
		$('#dxWrapper').remove();
		var wrapper = $('<div id="dxWrapper" style="margin: 10px;padding:5px;"></div>');
		var textarea = $('<textarea style="width:100%;max-width:100%;height: 200px;" id="dxJSONinput"></textarea>');
		var buttonSubmit = $('<input type="button" id="dxJSONinputSubmit" value="Process" style="cursor:pointer;"/>');
		var buttonCancel = $('<input type="button" id="dxJSONinputCancel" value="Cancel" style="cursor:pointer;"/>');
		var buttonDiscard = $('<input type="button" id="dxJSONinputDiscard" value="Discard" style="cursor:pointer;"/>');
		buttonSubmit.click(function() {
			if ($('#dxJSONinput').val() !== '')
			{
				self.processJSON($.parseJSON($('#dxJSONinput').val()));
			}
		});
		buttonDiscard.click(function() {
			self.discard();
		});
		buttonCancel.click(function() {
			self.discard();
			$('#dxWrapper').remove();
		});
		wrapper.append(textarea);
		wrapper.append(buttonSubmit);
		wrapper.append(buttonCancel);
		wrapper.append(buttonDiscard);
		$("#toolbox").append(wrapper);
	};
	//Process submit JSON String
	self.processJSON = function(jsonObject)
	{
		if (jsonObject.markers !== undefined && jsonObject.markers.length > 0)
		{
			self.discard();
			//markers
			window.plugin.dxplugin.dxMarkers = jsonObject.markers;
			//links
			if (jsonObject.links !== '')
			{
				$.each(jsonObject.links, function(i, link) {

					var nodes = self.__explode('_', link);
					var org = self.getPortalData(nodes[0]);
					var dst = self.getPortalData(nodes[1]);
					var latlngs = [
						L.latLng(org.lat, org.lng),
						L.latLng(dst.lat, dst.lng)
					];
					self.add(L.geodesicPolyline(latlngs, self.getPolyOptions()));
				});
			}
		}
	};

	//REturn the Portal DAta
	self.getPortalData = function(id)
	{
		var portal = null;
		$.each(window.plugin.dxplugin.dxMarkers, function(i, marker) {
			var val = self.__explode(':', marker);
			if (val[0] === id)
			{
				portal = {
					id: val[0],
					name: val[1],
					lat: parseFloat(val[2]),
					lng: parseFloat(val[3]),
					value: marker
				};
			}
		});
		return portal;
	};

	// this.createLinkEntity(ent);
	//Add dxObject
	self.add = function(poly)
	{
		if (window.plugin.dxplugin.dxLayer === null)
		{
			window.plugin.dxplugin.dxLayer = L.layerGroup();
			map.addLayer(window.plugin.dxplugin.dxLayer, true);
		}
		window.plugin.dxplugin.dxLayer.addLayer(poly);
	};

	//Remove all dxObjects
	self.discard = function()
	{
		if (window.plugin.dxplugin.dxLayer !== null)
		{
			map.removeLayer(window.plugin.dxplugin.dxLayer);
		}
		window.plugin.dxplugin.dxLayer = null;
	};

	self.getPolyOptions = function()
	{
		var color = '#FFA500';
		var options = {
			opacity: 1,
			weight: 1,
			clickable: false,
			color: color
		};
		return options;
	};

	//When portaldetailsIs updated
	self.portalDetailsUpdated = function(obj)
	{
		self.createPortalActionLink(obj.portalData.latE6, obj.portalData.lngE6, obj.portalData.title);
	};

	//Create links
	self.createPortalActionLink = function(latE6, lngE6, title)
	{
		$('#dxPortalDetailsLink').remove();
		var portalDetailsLink = '<a href="#" onclick="window.plugin.dxplugin.addPortal(' + latE6 + ', ' + lngE6 + ', \'' + title + '\')" title="Add to Dx Portals">Add to Dx</a>';
		if (self.getPortal(latE6, lngE6) !== false)
		{
			portalDetailsLink = '<a href="#" style="color:red !important;" onclick="window.plugin.dxplugin.removePortal(' + latE6 + ', ' + lngE6 + ', \'' + title + '\')" title="Remove from Dx Portals">Remove from Dx</a>';
		}
		$('#portaldetails .linkdetails').append('<aside id="dxPortalDetailsLink">' + portalDetailsLink + '</aside>');
	};

	//Add Portal
	self.addPortal = function(latE6, lngE6, title)
	{
		var id = latE6 + 'x' + lngE6;
		window.plugin.dxplugin.dxPortals[id] = id + ':' + title + ':' + (latE6 / 1E6) + ':' + (lngE6 / 1E6);
		var icon = L.icon({
			iconUrl: 'https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-32.png',
			iconRetinaUrl: 'https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-32.png',
			iconSize: [32, 32],
			iconAnchor: [15, 32]
		});
		var marker = L.marker([(latE6 / 1E6), lngE6 / 1E6], {icon: icon}).bindPopup(title);
		self.add(marker);
		window.plugin.dxplugin.dxPortalsMarker[id] = marker;
		self.createPortalActionLink(latE6, lngE6, title);
		self.updateExport();
		self.export(true);
	};
	//Remove portal
	self.removePortal = function(latE6, lngE6, title)
	{
		var id = latE6 + 'x' + lngE6;
		if (window.plugin.dxplugin.dxPortals.hasOwnProperty(id))
		{
			window.plugin.dxplugin.dxPortals[id] = null;
			window.plugin.dxplugin.dxLayer.removeLayer(window.plugin.dxplugin.dxPortalsMarker[id]);
			window.plugin.dxplugin.dxPortalsMarker[id] = null;
			delete window.plugin.dxplugin.dxPortals[id];
			delete window.plugin.dxplugin.dxPortalsMarker[id];
			self.createPortalActionLink(latE6, lngE6, title);
			self.updateExport();
			self.export(true);
		}
	};

	//Check if portal was already added
	self.getPortal = function(latE6, lngE6)
	{
		var id = latE6 + 'x' + lngE6;
		var ret = false;
		if (window.plugin.dxplugin.dxPortals.hasOwnProperty(id))
		{
			ret = window.plugin.dxplugin.dxPortals[id];
		}
		return ret;
	};

	//Update Export
	self.updateExport = function()
	{
		var portalDatas = [];
		var jsonObject = {};
		for (var key in window.plugin.dxplugin.dxPortals) {
			if (window.plugin.dxplugin.dxPortals.hasOwnProperty(key))
			{
				portalDatas.push(window.plugin.dxplugin.dxPortals[key]);
			}
		}
		jsonObject.markers = portalDatas;
		$('#dxJSONinputExport').val(JSON.stringify(jsonObject));
	};

	//Export selected portals
	self.export = function(update)
	{
		$('#dxWrapper').remove();
		if (update === undefined)
		{
			if ($('#dxWrapperExport').is(':visible'))
			{
				$('#dxWrapperExport').remove();
				return;
			}
		}
		$('#dxWrapperExport').remove();
		var wrapper = $('<div id="dxWrapperExport" style="margin: 10px;padding:5px;"></div>');
		var textarea = $('<textarea style="width:100%;max-width:100%;height: 200px;" id="dxJSONinputExport"></textarea>');
		var buttonClose = $('<input type="button" id="dxJSONinputCloseExport" value="Close" style="cursor:pointer;"/>');
		var buttonRemoveAll = $('<input type="button" id="dxJSONRemoveAllPortals" value="Remove all DxPortals" style="cursor:pointer;"/>');
		buttonClose.click(function() {
			$('#dxWrapperExport').remove();
			return;
		});
		buttonRemoveAll.click(function() {
			for (var id in window.plugin.dxplugin.dxPortals) {
				if (window.plugin.dxplugin.dxPortals.hasOwnProperty(id))
				{
					window.plugin.dxplugin.dxPortals[id] = null;
					window.plugin.dxplugin.dxLayer.removeLayer(window.plugin.dxplugin.dxPortalsMarker[id]);
					window.plugin.dxplugin.dxPortalsMarker[id] = null;
					delete window.plugin.dxplugin.dxPortals[id];
					delete window.plugin.dxplugin.dxPortalsMarker[id];
				}
			}
			self.updateExport();
			self.export(true);
		});
		wrapper.append(textarea);
		wrapper.append(buttonClose);
		wrapper.append(buttonRemoveAll);
		wrapper.append('<br /><br />Copy and Import to <a target="_blank" href="http://ingress.dennesabing.com">Dx Field Simulator</a></a>');
		$("#toolbox").append(wrapper);
		self.updateExport();
	};

	//Self PHP JS Explode
	self.__explode = function(delimiter, string, limit)
	{
		if (arguments.length < 2 || typeof delimiter === 'undefined' || typeof string === 'undefined')
			return null;
		if (delimiter === '' || delimiter === false || delimiter === null)
			return false;
		if (typeof delimiter === 'function' || typeof delimiter === 'object' || typeof string === 'function' || typeof string ===
				'object') {
			return {
				0: ''
			};
		}
		if (delimiter === true)
			delimiter = '1';
		delimiter += '';
		string += '';
		var s = string.split(delimiter);
		if (typeof limit === 'undefined')
			return s;
		if (limit === 0)
			limit = 1;
		if (limit > 0) {
			if (limit >= s.length)
				return s;
			return s.slice(0, limit - 1)
					.concat([s.slice(limit - 1)
								.join(delimiter)
					]);
		}
		if (-limit >= s.length)
			return [];
		s.splice(s.length + limit);
		return s;
	};
	// setup function called by IITC
	self.setup = function init() {
		var linkImport = $("<a onclick=\"window.plugin.dxplugin.import();\" title=\"Import Dx JSON String\">Import DxJSON</a>");
		var linkExport = $("<a onclick=\"window.plugin.dxplugin.export();\" title=\"Export Dx JSON Portals\">Export DxPortals</a>");
		var linkDx = $("<a target=\"_blank\" href=\"http://ingress.dennesabing.com\" title=\"Dx Field Simulator\">DxFieldSim</a>");
		$("#toolbox").append(linkImport);
		$("#toolbox").append(linkExport);
		$("#toolbox").append(linkDx);

		window.addHook('portalDetailsUpdated', function(e) {
			self.portalDetailsUpdated(e);
		});

		delete self.setup;
	};

	// IITC plugin setup
	if (window.iitcLoaded && typeof self.setup === "function") {
		self.setup();
	} else if (window.bootPlugins) {
		window.bootPlugins.push(self.setup);
	} else {
		window.bootPlugins = [self.setup];
	}
}
// inject plugin into page
var script = document.createElement("script");
script.appendChild(document.createTextNode("(" + wrapper + ")();"));
(document.body || document.head || document.documentElement).appendChild(script);