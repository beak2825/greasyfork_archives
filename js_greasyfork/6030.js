// ==UserScript==
// @name			Private - Czech WMS layers (MajkiiTelini fork)
// @version			2017.04.07.2
// @authorCZ		petrjanik, d2-mac, MajkiiTelini
// @description		Displays layers from Czech WMS services (ŘSD & ČÚZK) in WME
// @include			/^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/.*$/
// @copyright		2013,2014+, Patryk Ściborek, Paweł Pyrczak
// @copyright		WME Street View Availability script
// @run-at			document-end
// @namespace		https://greasyfork.org/cs/users/110192
// @downloadURL https://update.greasyfork.org/scripts/6030/Private%20-%20Czech%20WMS%20layers%20%28MajkiiTelini%20fork%29.user.js
// @updateURL https://update.greasyfork.org/scripts/6030/Private%20-%20Czech%20WMS%20layers%20%28MajkiiTelini%20fork%29.meta.js
// ==/UserScript==

(function() {

	function init(e) {
		if (e && e.user === null) {
			return;
		}
		if (typeof Waze === "undefined" ||
				typeof Waze.loginManager === "undefined") {
			setTimeout(init, 100);
			return;
		}
		if (!Waze.loginManager.hasUser()) {
			Waze.loginManager.events.register("login", null, init);
			Waze.loginManager.events.register("loginStatus", null, init);
			if (!Waze.loginManager.hasUser()) {
				return;
			}
		}

		if (document.getElementById("layer-switcher") === null && document.getElementById("layer-switcher-group_display") === null) {
			setTimeout(init, 200);
			return;
		}

		var epsg900913 = new unsafeWindow.OpenLayers.Projection("EPSG:900913");
		var epsg4326 =	new unsafeWindow.OpenLayers.Projection("EPSG:4326");
		var tileSizeG = new OL.Size(512,512);

		// adresy WMS služeb
		wms_service_rsd ="http://geoportal.rsd.cz/arcgis/services/WMS_ULS/MapServer/WmsServer?"; // ŘSD třídy silnic + popisky
		wms_service_orto = "http://geoportal.cuzk.cz/WMS_ORTOFOTO_PUB/WMService.aspx?"; // ČUZK ortofoto
		wms_service_hranice = "http://geoportal.cuzk.cz/WMS_SPH_PUB/service.svc/get?";	// ČUZK hranice obce, kraje, okresy
		wms_service_inspire = "http://services.cuzk.cz/wms/inspire-ad-wms.asp?"; // ČUZK čísla popisná a orientační + názvy ulic
		wms_service_zabaged = "http://ags.cuzk.cz/arcgis/services/ZABAGED/MapServer/WMSServer?"; // ČUZK Doprava, Lesy, Vodní plochy
		wms_service_katastr = "http://services.cuzk.cz/wms/wms.asp?"; // ČUZK katastr
		wms_service_geonames = "http://geoportal.cuzk.cz/WMS_GEONAMES_PUB/WMService.aspx?"; // ČUZK GeoNames

        //názvy skupin vrstev
        layer_group_1 = "WMS silnice a místa";
        layer_group_2 = "ČÚZK hranice a adresy";

        //názvy vrstev
        layer_rsd = "ŘSD - třídy silnic";
        layer_orto = "ČÚZK - ortofoto";
        layer_stat = "státní hranice";
        layer_kraje = "hranice krajů";
        layer_okresy = "hranice okresů";
        layer_orp = "hranice ORP";
        layer_pou = "hranice OPÚ";
        layer_obce = "hranice obcí";
        layer_katuzemi = "hranice KÚ";
        layer_doprava = "ČÚZK - Doprava";
        layer_lesvoda = "ČÚZK - Lesy a Vodstva";
        layer_zsj = "hranice ZSJ";
        layer_ulice = "názvy ulic";
        layer_budovy = "adresní místa 1a";
        layer_geonames = "GeoNames";
        layer_katastr = "katastrální mapa";
        layer_budovy_b = "adresní místa 1b";
        layer_religiozni = "religiózní místa";
        layer_verejne = "veřejné budovy";
        layer_pamatky = "památky a atrakce";

		var geop_rsd = new OpenLayers.Layer.WMS(
			layer_rsd, wms_service_rsd,
			{
				layers: "13,12,11,10,9,8,7,6,5,4,3,2,1",
				transparent: "true",
				format: "image/png"
			},
			{
				tileSize: tileSizeG,
				isBaseLayer: false,
				visibility: false,
				//transitionEffect: "resize",
				uniqueName: "_rsd",
				epsg900913: epsg900913,
				epsg4326: epsg4326,
				getURL: getUrl4326,
				ConvTo2180: ConvTo2180,
				ep2180: false,
				getFullRequestString: getFullRequestString4326
			}
		);
		var geop_orto = new unsafeWindow.OpenLayers.Layer.WMS(
			layer_orto, wms_service_orto,
			{
				layers: "GR_ORTFOTORGB",
				transparent: "true",
				format: "image/jpeg"
			},
			{
				tileSize: tileSizeG,
				isBaseLayer: false,
				visibility: false,
				transitionEffect: "resize",
				uniqueName: "_orto",
				epsg900913: epsg900913,
				epsg4326: epsg4326,
				getURL: getUrl4326,
				ConvTo2180: ConvTo2180,
				ep2180: false,
				getFullRequestString: getFullRequestString4326
			}
		);
		var geop_stat = new OpenLayers.Layer.WMS(
			layer_stat, wms_service_hranice,
			{
				layers: "GP_SPH_STAT",
				transparent: "true",
				format: "image/png"
			},
			{
				tileSize: tileSizeG,
				isBaseLayer: false,
				visibility: false,
				uniqueName: "_stat",
				epsg900913: epsg900913,
				epsg4326: epsg4326,
				getURL: getUrl4326,
				ConvTo2180: ConvTo2180,
				ep2180: false,
				getFullRequestString: getFullRequestString4326
			}
		);
		var geop_kraje = new OpenLayers.Layer.WMS(
			layer_kraje, wms_service_hranice,
			{
				layers: "GP_SPH_KRAJ",
				transparent: "true",
				format: "image/png"
			},
			{
				tileSize: tileSizeG,
				isBaseLayer: false,
				visibility: false,
				uniqueName: "_kraje",
				epsg900913: epsg900913,
				epsg4326: epsg4326,
				getURL: getUrl4326,
				ConvTo2180: ConvTo2180,
				ep2180: false,
				getFullRequestString: getFullRequestString4326
			}
		);
		var geop_okresy = new OpenLayers.Layer.WMS(
			layer_okresy, wms_service_hranice,
			{
				layers: "GT_SPH_OKRES,GP_SPH_OKRES",
				transparent: "true",
				format: "image/png"
			},
			{
				tileSize: tileSizeG,
				isBaseLayer: false,
				visibility: false,
				uniqueName: "_okresy",
				epsg900913: epsg900913,
				epsg4326: epsg4326,
				getURL: getUrl4326,
				ConvTo2180: ConvTo2180,
				ep2180: false,
				getFullRequestString: getFullRequestString4326
			}
		);
		var geop_orp = new OpenLayers.Layer.WMS(
			layer_orp, wms_service_hranice,
			{
				layers: "GT_SPH_ORP,GP_SPH_ORP",
				transparent: "true",
				format: "image/png"
			},
			{
				tileSize: tileSizeG,
				isBaseLayer: false,
				visibility: false,
				uniqueName: "_orp",
				epsg900913: epsg900913,
				epsg4326: epsg4326,
				getURL: getUrl4326,
				ConvTo2180: ConvTo2180,
				ep2180: false,
				getFullRequestString: getFullRequestString4326
			}
		);
        var geop_pou = new OpenLayers.Layer.WMS(
			layer_pou, wms_service_hranice,
			{
				layers: "GT_SPH_OPU,GP_SPH_OPU",
				transparent: "true",
				format: "image/png"
			},
			{
				tileSize: tileSizeG,
				isBaseLayer: false,
				visibility: false,
				uniqueName: "_pou",
				epsg900913: epsg900913,
				epsg4326: epsg4326,
				getURL: getUrl4326,
				ConvTo2180: ConvTo2180,
				ep2180: false,
				getFullRequestString: getFullRequestString4326
			}
		);
		var geop_obce = new OpenLayers.Layer.WMS(
			layer_obce, wms_service_hranice,
			{
				layers: "GT_SPH_OBEC,GP_SPH_OBEC",
				transparent: "true",
				format: "image/png"
			},
			{
				tileSize: tileSizeG,
				isBaseLayer: false,
				visibility: false,
				uniqueName: "_obce",
				epsg900913: epsg900913,
				epsg4326: epsg4326,
				getURL: getUrl4326,
				ConvTo2180: ConvTo2180,
				ep2180: false,
				getFullRequestString: getFullRequestString4326
			}
		);
		var geop_katuzemi = new OpenLayers.Layer.WMS(
			layer_katuzemi, wms_service_hranice,
			{
				layers: "GT_SPH_KU,GP_SPH_KU",
				transparent: "true",
				format: "image/png"
			},
			{
				tileSize: tileSizeG,
				isBaseLayer: false,
				visibility: false,
				uniqueName: "_katuzemi",
				epsg900913: epsg900913,
				epsg4326: epsg4326,
				getURL: getUrl4326,
				ConvTo2180: ConvTo2180,
				ep2180: false,
				getFullRequestString: getFullRequestString4326
			}
		);
		var geop_doprava = new unsafeWindow.OpenLayers.Layer.WMS(
			layer_doprava, wms_service_zabaged,
			{
				layers: "16,17,66,67,87,88,89,90,92,93,94,95,96,97,98,99,100,101,102,103,104,105,109,110,111,112,114,115,116,117,151",
				transparent: "true",
				format: "image/png",
			},
			{
				tileSize: tileSizeG,
				isBaseLayer: false,
				visibility: false,
				uniqueName: "_doprava",
				epsg900913: epsg900913,
				epsg4326: epsg4326,
				getURL: getUrl4326,
				ConvTo2180: ConvTo2180,
				ep2180: false,
				getFullRequestString: getFullRequestString4326
			}
		);
		var geop_lesvoda = new unsafeWindow.OpenLayers.Layer.WMS(
			layer_lesvoda, wms_service_zabaged,
			{
				layers: "0,1,2,9,53,54,55,56,57,58,113,171,172,173,174,175,176,177,178,179",
				transparent: "true",
				format: "image/png",
			},
			{
				tileSize: tileSizeG,
				isBaseLayer: false,
				visibility: false,
				uniqueName: "_lesvoda",
				epsg900913: epsg900913,
				epsg4326: epsg4326,
				getURL: getUrl4326,
				ConvTo2180: ConvTo2180,
				ep2180: false,
				getFullRequestString: getFullRequestString4326
			}
		);
		var geop_zsj = new OpenLayers.Layer.WMS(
			layer_zsj, wms_service_hranice,
			{
				layers: "GT_SPH_ZSJ,GP_SPH_ZSJ",
				transparent: "true",
				format: "image/png"
			},
			{
				tileSize: tileSizeG,
				isBaseLayer: false,
				visibility: false,
				uniqueName: "_zsj",
				epsg900913: epsg900913,
				epsg4326: epsg4326,
				getURL: getUrl4326,
				ConvTo2180: ConvTo2180,
				ep2180: false,
				getFullRequestString: getFullRequestString4326
			}
		);
		var geop_ulice = new OpenLayers.Layer.WMS(
			layer_ulice, wms_service_inspire,
			{
				layers: "AD.Thoroughfare",
				//		layers: "GT_ULICE",
				transparent: "true",
				format: "image/png"
			},
			{
				tileSize: tileSizeG,
				isBaseLayer: false,
				visibility: false,
				transitionEffect: "resize",
				uniqueName: "_ulice",
				epsg900913: epsg900913,
				epsg4326: epsg4326,
				getURL: getUrl4326,
				ConvTo2180: ConvTo2180,
				ep2180: false,
				getFullRequestString: getFullRequestString4326
			}
		);
		var geop_budovy = new OpenLayers.Layer.WMS(
			layer_budovy, wms_service_inspire,
			{
				layers: "AD.Addresses.Text.AddressNumber,AD.Addresses.ByPrefixNumber.TypOfBuilding.2,AD.Addresses.ByPrefixNumber.TypOfBuilding.1",
				//		layers: "GT_AL016,GB_AL016",
				//		layers: "DEF_BUDOVY",
				transparent: "true",
				format: "image/png"
			},
			{
				tileSize: tileSizeG,
				isBaseLayer: false,
				visibility: false,
				transitionEffect: "resize",
				uniqueName: "_budovy",
				epsg900913: epsg900913,
				epsg4326: epsg4326,
				getURL: getUrl4326,
				ConvTo2180: ConvTo2180,
				ep2180: false,
				getFullRequestString: getFullRequestString4326
			}
		);
		var geop_geonames = new OpenLayers.Layer.WMS(
			layer_geonames, wms_service_geonames,
			{
				layers: "GN1,GN2,GN3,GN14,GN19,GN20,BGN12",
				transparent: "true",
				format: "image/png"
			},
			{
				tileSize: tileSizeG,
				isBaseLayer: false,
				visibility: false,
				transitionEffect: "resize",
				uniqueName: "_geonames",
				epsg900913: epsg900913,
				epsg4326: epsg4326,
				getURL: getUrl4326,
				ConvTo2180: ConvTo2180,
				ep2180: false,
				getFullRequestString: getFullRequestString4326
			}
		);
		var geop_katastr = new OpenLayers.Layer.WMS(
			layer_katastr, wms_service_katastr,
			{
				layers: "hranice_parcel,dalsi_p_mapy,RST_KN",
				transparent: "true",
				format: "image/png"
			},
			{
				tileSize: tileSizeG,
				isBaseLayer: false,
				visibility: false,
				transitionEffect: "resize",
				uniqueName: "_katastr",
				epsg900913: epsg900913,
				epsg4326: epsg4326,
				getURL: getUrl4326,
				ConvTo2180: ConvTo2180,
				ep2180: false,
				getFullRequestString: getFullRequestString4326
			}
		);
        var geop_budovy_b = new OpenLayers.Layer.WMS(
			layer_budovy_b, wms_service_inspire,
			{
				layers: "AD.Addresses.Text.AddressAreaName,AD.Addresses.Text.ThoroughfareName",
				transparent: "true",
				format: "image/png"
			},
			{
				tileSize: tileSizeG,
				isBaseLayer: false,
				visibility: false,
				transitionEffect: "resize",
				uniqueName: "_budovy_b",
				epsg900913: epsg900913,
				epsg4326: epsg4326,
				getURL: getUrl4326,
				ConvTo2180: ConvTo2180,
				ep2180: false,
				getFullRequestString: getFullRequestString4326
			}
		);
        var geop_religiozni = new OpenLayers.Layer.WMS(
			layer_religiozni, wms_service_zabaged,
			{
				layers: "25,170,169,167,168",
				transparent: "true",
				format: "image/png"
			},
			{
				tileSize: tileSizeG,
				isBaseLayer: false,
				visibility: false,
				transitionEffect: "resize",
				uniqueName: "_religiozni",
				epsg900913: epsg900913,
				epsg4326: epsg4326,
				getURL: getUrl4326,
				ConvTo2180: ConvTo2180,
				ep2180: false,
				getFullRequestString: getFullRequestString4326
			}
		);
        var geop_verejne = new OpenLayers.Layer.WMS(
			layer_verejne, wms_service_zabaged,
			{
				layers: "29,44,142,143",
				transparent: "true",
				format: "image/png"
			},
			{
				tileSize: tileSizeG,
				isBaseLayer: false,
				visibility: false,
				transitionEffect: "resize",
				uniqueName: "_verejne",
				epsg900913: epsg900913,
				epsg4326: epsg4326,
				getURL: getUrl4326,
				ConvTo2180: ConvTo2180,
				ep2180: false,
				getFullRequestString: getFullRequestString4326
			}
		);
        var geop_pamatky = new OpenLayers.Layer.WMS(
			layer_pamatky, wms_service_zabaged,
			{
				layers: "32,33,40,148,149,154,155,162,163,164,165,166",
				transparent: "true",
				format: "image/png"
			},
			{
				tileSize: tileSizeG,
				isBaseLayer: false,
				visibility: false,
				transitionEffect: "resize",
				uniqueName: "_pamatky",
				epsg900913: epsg900913,
				epsg4326: epsg4326,
				getURL: getUrl4326,
				ConvTo2180: ConvTo2180,
				ep2180: false,
				getFullRequestString: getFullRequestString4326
			}
		);

		//adding layers to map in different order than adding objects to layer panel
		Waze.map.addLayer(geop_orto);
		Waze.map.addLayer(geop_lesvoda);
		Waze.map.addLayer(geop_doprava);
		Waze.map.addLayer(geop_rsd);
		Waze.map.addLayer(geop_stat);
		Waze.map.addLayer(geop_kraje);
		Waze.map.addLayer(geop_okresy);
        Waze.map.addLayer(geop_orp);
        Waze.map.addLayer(geop_pou);
		Waze.map.addLayer(geop_obce);
		Waze.map.addLayer(geop_katuzemi);
		Waze.map.addLayer(geop_zsj);
		Waze.map.addLayer(geop_ulice);
		Waze.map.addLayer(geop_budovy);
		Waze.map.addLayer(geop_katastr);
		Waze.map.addLayer(geop_geonames);
        Waze.map.addLayer(geop_budovy_b);
        Waze.map.addLayer(geop_religiozni);
        Waze.map.addLayer(geop_verejne);
        Waze.map.addLayer(geop_pamatky);

		var layerGroupWMS1Id = "layer-switcher-group_wms1";
		var layerGroupWMS1 = addLayerTogglerGroup(layerGroupWMS1Id, layer_group_1);
		var togglerChildrenListWMS1 = layerGroupWMS1.getElementsByClassName("children")[0];
		var checkboxWMS1 = document.getElementById(layerGroupWMS1Id);

		addLayerToggler(geop_orto, togglerChildrenListWMS1, checkboxWMS1, "layer-switcher-item_geop_orto", layer_orto);
		addLayerToggler(geop_rsd, togglerChildrenListWMS1, checkboxWMS1, "layer-switcher-item_geop_rsd", layer_rsd);
		addLayerToggler(geop_doprava, togglerChildrenListWMS1, checkboxWMS1, "layer-switcher-item_geop_doprava", layer_doprava);
		addLayerToggler(geop_lesvoda, togglerChildrenListWMS1, checkboxWMS1, "layer-switcher-item_geop_lesvoda", layer_lesvoda);
        addLayerToggler(geop_religiozni, togglerChildrenListWMS1, checkboxWMS1, "layer-switcher-item_geop_religiozni", layer_religiozni);
        addLayerToggler(geop_verejne, togglerChildrenListWMS1, checkboxWMS1, "layer-switcher-item_geop_verejne", layer_verejne);
        addLayerToggler(geop_pamatky, togglerChildrenListWMS1, checkboxWMS1, "layer-switcher-item_geop_pamatky", layer_pamatky);

		var layerGroupWMS2Id = "layer-switcher-group_wms2";
		var layerGroupWMS2 = addLayerTogglerGroup(layerGroupWMS2Id, layer_group_2);
		var togglerChildrenListWMS2 = layerGroupWMS2.getElementsByClassName("children")[0];
		var checkboxWMS2 = document.getElementById(layerGroupWMS2Id);

		addLayerToggler(geop_geonames, togglerChildrenListWMS2, checkboxWMS2, "layer-switcher-item_geop_geonames", layer_geonames);
		addLayerToggler(geop_stat, togglerChildrenListWMS2, checkboxWMS2, "layer-switcher-item_geop_stat", layer_stat);
		addLayerToggler(geop_kraje, togglerChildrenListWMS2, checkboxWMS2, "layer-switcher-item_geop_kraje", layer_kraje);
		addLayerToggler(geop_okresy, togglerChildrenListWMS2, checkboxWMS2, "layer-switcher-item_geop_okresy", layer_okresy);
        addLayerToggler(geop_orp, togglerChildrenListWMS2, checkboxWMS2, "layer-switcher-item_geop_orp", layer_orp);
        addLayerToggler(geop_pou, togglerChildrenListWMS2, checkboxWMS2, "layer-switcher-item_geop_pou", layer_pou);
		addLayerToggler(geop_obce, togglerChildrenListWMS2, checkboxWMS2, "layer-switcher-item_geop_obce", layer_obce);
		addLayerToggler(geop_katuzemi, togglerChildrenListWMS2, checkboxWMS2, "layer-switcher-item_geop_katuzemi", layer_katuzemi);
		addLayerToggler(geop_zsj, togglerChildrenListWMS2, checkboxWMS2, "layer-switcher-item_geop_zsj", layer_zsj);
		addLayerToggler(geop_katastr, togglerChildrenListWMS2, checkboxWMS2, "layer-switcher-item_geop_katastr", layer_katastr);
		addLayerToggler(geop_ulice, togglerChildrenListWMS2, checkboxWMS2, "layer-switcher-item_geop_ulice", layer_ulice);
		addLayerToggler(geop_budovy, togglerChildrenListWMS2, checkboxWMS2, "layer-switcher-item_geop_budovy", layer_budovy);
        addLayerToggler(geop_budovy_b, togglerChildrenListWMS2, checkboxWMS2, "layer-switcher-item_geop_budovy_b", layer_budovy_b);

		OrtoTimer();
	}

	addLayerTogglerGroup = function(layer_switcher_group_item_name, layer_group_visible_name) {
		var LayerGroupsList = document.getElementsByClassName("list-unstyled togglers")[0];
		var group = document.createElement("li");
		group.className = "group";
		var togglerContainer = document.createElement("div");
		togglerContainer.className = "controls-container toggler";
		var checkbox = document.createElement("input");
		checkbox.className = "toggle";
		checkbox.id = layer_switcher_group_item_name;
		checkbox.type = "checkbox";
		var label = document.createElement("label");
		label.htmlFor = checkbox.id;
		var labelText = document.createElement("span");
		labelText.className = "label-text";
		var togglerChildrenList = document.createElement("ul");
		togglerChildrenList.className = "children";
		togglerContainer.appendChild(checkbox);
		labelText.appendChild(document.createTextNode(layer_group_visible_name));
		label.appendChild(labelText);
		togglerContainer.appendChild(label);
		group.appendChild(togglerContainer);
		group.appendChild(togglerChildrenList);
		LayerGroupsList.appendChild(group);
		return group;
	};

	addLayerToggler = function(layer, layer_container, layer_group_checkbox, layer_switcher_item_name, layer_visible_name) {
		var toggler = document.createElement("li");
		toggler.style.display = "none";
		var togglerContainer = document.createElement("div");
		togglerContainer.className = "controls-container toggler";
		var checkbox = document.createElement("input");
		checkbox.type = "checkbox";
		checkbox.id = layer_switcher_item_name;
		checkbox.className = "toggle";
		checkbox.disabled = layer_group_checkbox.checked;
		togglerContainer.appendChild(checkbox);
		var label = document.createElement("label");
		label.htmlFor = checkbox.id;
		var labelText = document.createElement("span");
		labelText.className = "label-text";
		labelText.appendChild(document.createTextNode(layer_visible_name));
		label.appendChild(labelText);
		togglerContainer.appendChild(label);
		toggler.appendChild(togglerContainer);
		layer_container.appendChild(toggler);
		checkbox.addEventListener("click", function(e) {
			layer.setVisibility(e.target.checked);
		});
		layer_group_checkbox.addEventListener("click", function(e) {
			layer.setVisibility(e.target.checked & checkbox.checked);
			checkbox.disabled = !e.target.checked;
			if (getLayerGroupCheck(e.target) || e.target.checked
			) {
				toggler.style.display = "";
			}
			else {
				toggler.style.display = "none";
			}
		});
	};

	getLayerGroupCheck = function(groupCheckbox) {
		var togglerChildrenList = groupCheckbox.parentElement.parentElement.getElementsByClassName("children")[0];
		for (i = 0, len = togglerChildrenList.childNodes.length; i < len; i++) {
			var checkbox = togglerChildrenList.childNodes[i].getElementsByClassName("controls-container toggler")[0].getElementsByClassName("toggle")[0];
			if (checkbox.checked) {
				return true;
			}
		}
		return false;
	};

	getUrl4326 = function (bounds) {
		/* this function is modified Openlayer WMS CLASS part */
		/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
		* full list of contributors). Published under the 2-clause BSD license.
		* See license.txt in the OpenLayers distribution or repository for the
		* full text of the license. */
		bounds = bounds.clone(); // Zrobione dlatego że tranformacja była dziedziczona do parenta i się sypało aż niemiło

		bounds = this.adjustBounds(bounds);

		var imageSize = this.getImageSize(bounds);
		var newParams = {};
		bounds.transform(this.epsg900913,this.epsg4326);
		if (this.ep2180) {
			bounds = bounds.clone();
			a={lat: bounds.bottom , lon: bounds.right};
			b={lat: bounds.top, lon: bounds.left};
			a=this.ConvTo2180(a);
			b=this.ConvTo2180(b);

			bounds.bottom = a.lat;
			bounds.right = a.lon;
			bounds.top = b.lat;
			bounds.left = b.lon;
			//console.log(JSON.stringify(bounds));
		}
		// WMS 1.3 introduced axis order
		var reverseAxisOrder = this.reverseAxisOrder();
		newParams.BBOX = this.encodeBBOX ?
			bounds.toBBOX(null, reverseAxisOrder) :
		bounds.toArray(reverseAxisOrder);
		/*newParams.WIDTH = imageSize.w;*/
		newParams.WIDTH = 742;
		/*newParams.HEIGHT = imageSize.h;*/
		newParams.HEIGHT = 485;
		var requestString = this.getFullRequestString(newParams);
		//this.setZIndex(3);
		//this.map.getLayersBy("uniqueName","satellite_imagery").first().setZIndex(1);
		return requestString;
	};

	ConvTo2180 = function(p) {
		//var D2R = 0.01745329251994329577;
		var D2R = 0.0174532925199433;
		//console.log(" 1 - "+p.toString());
		//p = p.clone();
		//alert(p.toString());

		var mlfn = function(e0, e1, e2, e3, phi) {
			return (e0 * phi - e1 * Math.sin(2 * phi) + e2 * Math.sin(4 * phi) - e3 * Math.sin(6 * phi));
		};

		var contants = {
			a: 6377397.155,
			rf: 299.1528128,
			x0 : 500000,
			y0 : -5300000,
			k0 : 0.9999,
			init : function() {
				var D2R = 0.0174532925199433;
				/*a: 6378137.0,
rf: 298.257222101,
x0 : 500000,
y0 : -5300000,
k0 : 0.9993,
init : function() {
var D2R = 0.01745329251994329577; */
				this.lon0 = 19.0 * D2R;
				this.lat0 = 0 * D2R;
				this.b = ((1.0 - 1.0 / this.rf) * this.a);
				this.ep2 = ((Math.pow(this.a,2) - Math.pow(this.b,2)) / Math.pow(this.b,2));
				this.es = ((Math.pow(this.a,2) - Math.pow(this.b,2)) / Math.pow(this.a,2));
				this.e0 =	(1 - 0.25 * this.es * (1 + this.es / 16 * (3 + 1.25 * this.es)));
				this.e1 = (0.375 * this.es * (1 + 0.25 * this.es * (1 + 0.46875 * this.es)));
				this.e2 = (0.05859375 * this.es * this.es * (1 + 0.75 * this.es));
				this.e3 = (this.es * this.es * this.es * (35 / 3072));
				this.ml0 = this.a * mlfn(this.e0, this.e1, this.e2, this.e3, this.lat0);
			}
		};

		contants.init();

		var lon = p.lon * D2R;
		var lat = p.lat * D2R;

		var a0 = 0;
		var b0 = 0;
		var k0 = 0.9999;
		var lon0 = 19.0 * D2R;
		var lat0 = 0 * D2R;

		var delta_lon = lon - lon0;
		var slon = (delta_lon < 0) ? -1 : 1;
		delta_lon = (Math.abs(delta_lon) < Math.PI) ? delta_lon : (delta_lon - (slon * (Math.PI * 2)));
		var con;
		var x, y;
		var sin_phi = Math.sin(lat);
		var cos_phi = Math.cos(lat);

		var sphere = false;

		if (sphere) {
			var b = cos_phi * Math.sin(delta_lon);
			if ((Math.abs(Math.abs(b) - 1)) < 0.0000000001) {
				return (93);
			}
			else {
				x = 0.5 * a0 * k0 * Math.log((1 + b) / (1 - b));
				con = Math.acos(cos_phi * Math.cos(delta_lon) / Math.sqrt(1 - b * b));
				if (lat < 0) {
					con = -con;
				}
				y = a0 * k0 * (con - lat0);
			}
		}
		else {
			var al = cos_phi * delta_lon;
			var als = Math.pow(al, 2);
			var c = contants.ep2 * Math.pow(cos_phi, 2);
			var tq = Math.tan(lat);
			var t = Math.pow(tq, 2);
			con = 1 - contants.es * Math.pow(sin_phi, 2);
			var n = contants.a / Math.sqrt(con);
			var ml = contants.a * mlfn(contants.e0, contants.e1, contants.e2, contants.e3, lat);
			x = contants.k0 * n * al * (1 + als / 6 * (1 - t + c + als / 20 * (5 - 18 * t + Math.pow(t, 2) + 72 * c - 58 * contants.ep2))) + contants.x0;
			y = contants.k0 * (ml - contants.ml0 + n * tq * (als * (0.5 + als / 24 * (5 - t + 9 * c + 4 * Math.pow(c, 2) + als / 30 * (61 - 58 * t + Math.pow(t, 2) + 600 * c - 330 * contants.ep2))))) + contants.y0;

		}
		//alert(JSON.stringify(contants));
		p.lon = x;
		p.lat = y;

		return p;
	};

	getFullRequestString4326 = function(newParams, altUrl) {
		/* this function is modified Openlayer WMS CLASS part */
		/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
		* full list of contributors). Published under the 2-clause BSD license.
		* See license.txt in the OpenLayers distribution or repository for the
		* full text of the license. */
		var mapProjection = this.map.getProjectionObject();
		var projectionCode = this.projection.getCode();
		var value = (projectionCode == "none") ? null : projectionCode;
		if (parseFloat(this.params.VERSION) >= 1.3) {
			this.params.CRS = value;
		} else {
			if (this.ep2180) {
				this.params.SRS = "EPSG:2180"; //na sztywno najlepiej
			} else {
				this.params.SRS = "EPSG:4326"; //na sztywno najlepiej
			}
		}

		if (typeof this.params.TRANSPARENT == "boolean") {
			newParams.TRANSPARENT = this.params.TRANSPARENT ? "TRUE" : "FALSE";
		}

		return unsafeWindow.OpenLayers.Layer.Grid.prototype.getFullRequestString.apply(
			this, arguments);
	};

	OrtoTimer = function() {
		setTimeout(function(){
			var a = Waze.map.getLayersBy("uniqueName","_orto");
			a[0].setZIndex(200);
            a = Waze.map.getLayersBy("uniqueName","_lesvoda");
			a[0].setZIndex(200);
            a = Waze.map.getLayersBy("uniqueName","_geonames");
			a[0].setZIndex(200);
			OrtoTimer();
		},500);
	};

	init();

})();