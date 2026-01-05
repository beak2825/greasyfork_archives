// ==UserScript==
// @id             IITC_DX_CHAT_PLUGIN
// @name           IITC_DX_CHAT_PLUGIN
// @version        0.0.02.11
// @namespace      IITC_DX_CHAT_PLUGIN
// @description    0.0.02.11 Integrate Dx CHAT PLugins
// @include        https://www.ingress.com/intel*
// @include        http://www.ingress.com/intel*
// @match          https://www.ingress.com/intel*
// @match          http://www.ingress.com/intel*
// https://greasyfork.org/en/scripts/7778-iitc-dx-portals-plugin
// https://greasyfork.org/scripts/7778-iitc-dx-portals-plugin/code/IITC_DX_PORTALS_PLUGIN.user.js
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/7777/IITC_DX_CHAT_PLUGIN.user.js
// @updateURL https://update.greasyfork.org/scripts/7777/IITC_DX_CHAT_PLUGIN.meta.js
// ==/UserScript==

function wrapper() {
	// in case IITC is not available yet, define the base plugin object
	if (typeof window.plugin !== "function") {
		window.plugin = function() {
		};
	}
	// base context for plugin
	window.plugin.dxchatplugin = function() {
	};
	var self = window.plugin.dxchatplugin;
	/**
	 * Will not display logs
	 * @type Boolean
	 */
	var hideLogs = false;

	/**
	 * eavesdrop
	 * @type Boolean|Boolean|Boolean
	 */
	var dxUrl = 'http://ingress.dennesabing.com/intel';
	// setup function called by IITC
	self.setup = function init() {
		window.MAX_IDLE_TIME = 60 * 60;
		$('#chatcontrols a').eq(2).trigger('click');
		$('#chatcontrols a').eq(0).trigger('click');
	};

	//<editor-fold defaultstate="collapsed" desc="ARTIFACTS/SHARDS">

	//<editor-fold defaultstate="collapsed" desc="DxFunctions">
	window.getMapZoomTileParameters = function(zoom) {
		var level = window.TILE_PARAMS.ZOOM_TO_LEVEL[zoom] || 0;  // default to level 0 (all portals) if not in array
		var maxTilesPerEdge = window.TILE_PARAMS.TILES_PER_EDGE[window.TILE_PARAMS.TILES_PER_EDGE.length - 1];
		return {
			level: level,
			maxLevel: window.TILE_PARAMS.ZOOM_TO_LEVEL[zoom] || 0, // for reference, for log purposes, etc
			tilesPerEdge: window.TILE_PARAMS.TILES_PER_EDGE[zoom] || maxTilesPerEdge,
			minLinkLength: window.TILE_PARAMS.ZOOM_TO_LINK_LENGTH[zoom] || 0,
			hasPortals: zoom >= window.TILE_PARAMS.ZOOM_TO_LINK_LENGTH.length, // no portals returned at all when link length limits things
			zoom: 15  // include the zoom level, for reference
		};
	};

	/**
	 * Return query parameter by name
	 * @param {type} name
	 * @returns {String}
	 */
	window.getParameterByName = function(name) {
		name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
		var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
				results = regex.exec(location.search);
		return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	};

	window.getDavaoBounds = function()
	{
		/**
		 * Davao
		 */
		return new L.LatLngBounds(clampLatLng({lat: 6.962212, lng: 125.190582}), clampLatLng({lat: 7.282103, lng: 125.7639317}));
	};

	window.getMindanaoBounds = function()
	{
		/**
		 * Mindanao
		 */
		return new L.LatLngBounds(clampLatLng({lat: 5.348052, lng: 118.998413}), clampLatLng({lat: 10.217625, lng: 128.171997}));
	};

	window.getPhBounds = function()
	{
		return new L.LatLngBounds(clampLatLng({lat: -0.7250783020332547, lng: 111.11572265625}), clampLatLng({lat: 19.993998469485504, lng: 134.5166015625}));
	};

	window.getChatBounds = function()
	{
		return window.getPhBounds();
	};

	window.portalUpdate = function(staleTileCount)
	{
	};
	window.dxlog = function(msg)
	{
	};
	//</editor-fold>

	//<editor-fold defaultstate="collapsed" desc="window.chat.renderMsg">
		window.chat.renderMsg = function(msg, nick, time, team, msgToPlayer, systemNarrowcast) {
		if (hideLogs)
		{
		return '';
		}
		if (msg.search('Philippines') < 1)
		{
		return '';
		}
		var channel = chat.tabToChannel(chat.getActive());
		if (msg.indexOf('destroyed') < 0 && msg.indexOf('created') < 0 && msg.indexOf('linked') < 0 && msg.indexOf('captured') < 0 && channel == 'all')
		{
		return '';
		}
		var ta = unixTimeToHHmm(time);
		var tb = unixTimeToDateTimeString(time, true);
		//add <small> tags around the milliseconds
		tb = (tb.slice(0, 19) + '<small class="milliseconds">' + tb.slice(19) + '</small>').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
		
		// help cursor via ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œ#chat timeÃƒÂ¢Ã¢â€šÂ¬Ã¯Â¿Â½
		var t = '<time title="' + tb + '" data-timestamp="' + time + '">' + ta + '</time>';
		if (msgToPlayer)
		{
			t = '<div class="pl_nudge_date">' + t + '</div><div class="pl_nudge_pointy_spacer"></div>';
		}
		if (systemNarrowcast)
		{
			msg = '<div class="system_narrowcast">' + msg + '</div>';
		}
		var color = COLORS[team];
		if (nick === window.PLAYER.nickname)
			color = '#fd6';    //highlight things said/done by the player in a unique colour (similar to @player mentions from others in the chat text itself)
		var s = 'style="cursor:pointer; color:' + color + '"';
		var i = ['<span class="invisep">&lt;</span>', '<span class="invisep">&gt;</span>'];
		return '<tr><td>' + t + '</td><td>' + i[0] + '<mark class="nickname" ' + s + '>' + nick + '</mark>' + i[1] + '</td><td>' + msg + '</td></tr>';
		};
	//</editor-fold>


	window.MapDataRequest.prototype.refresh = function()
	{
		this.refreshStartTime = new Date().getTime();
		this.debugTiles.reset();
		this.resetRenderQueue();
		this.tileErrorCount = {};
		this.queuedTiles = {};

		var bounds = clampLatLngBounds(map.getBounds());

		/**
		 * Davao
		 */
		// var bounds = window.getDavaoBounds();
		/**
		 * Mindanao
		 */
		// var bounds = getMindanaoBounds();
		var mapZoom = map.getZoom();
		var dataZoom = getDataZoomForMapZoom(mapZoom);
		var tileParams = getMapZoomTileParameters(dataZoom);
		var x1 = lngToTile(bounds.getWest(), tileParams);
		var x2 = lngToTile(bounds.getEast(), tileParams);
		var y1 = latToTile(bounds.getNorth(), tileParams);
		var y2 = latToTile(bounds.getSouth(), tileParams);
		var dataBounds = L.latLngBounds([
			[tileToLat(y2 + 1, tileParams), tileToLng(x1, tileParams)],
			[tileToLat(y1, tileParams), tileToLng(x2 + 1, tileParams)]
		]);
		this.fetchedDataParams = {bounds: dataBounds, mapZoom: mapZoom, dataZoom: dataZoom};


		window.runHooks('mapDataRefreshStart', {bounds: bounds, mapZoom: mapZoom, dataZoom: dataZoom, minPortalLevel: tileParams.level, tileBounds: dataBounds});

		console.log('Dx: mapDataRefreshStart');
		this.render.startRenderPass(tileParams.level, dataBounds);

		/// Remove Oct 11, 2015
		// this.render.processGameEntities(artifact.getArtifactEntities());

		var logMessage = 'requesting data tiles at zoom ' + dataZoom;
		if (tileParams.level != tileParams.maxLevel) {
			logMessage += ' (L' + tileParams.level + '+ portals - could have done L' + tileParams.maxLevel + '+';
		} else {
			logMessage += ' (L' + tileParams.level + '+ portals';
		}
		logMessage += ', ' + tileParams.tilesPerEdge + ' tiles per global edge), map zoom is ' + mapZoom;
		this.cachedTileCount = 0;
		this.requestedTileCount = 0;
		this.successTileCount = 0;
		this.failedTileCount = 0;
		this.staleTileCount = 0;

		var tilesToFetchDistance = {};
		var mapCenterPoint = map.project(map.getCenter(), mapZoom);
		console.log('Dx: mapCenterPoint - ' + mapCenterPoint);
		for (var y = y1; y <= y2; y++) {
			for (var x = x1; x <= x2; x++) {
				var tile_id = pointToTileId(tileParams, x, y);
				var latNorth = tileToLat(y, tileParams);
				var latSouth = tileToLat(y + 1, tileParams);
				var lngWest = tileToLng(x, tileParams);
				var lngEast = tileToLng(x + 1, tileParams);

				this.debugTiles.create(tile_id, [[latSouth, lngWest], [latNorth, lngEast]]);
				//if (this.cache && this.cache.isFresh(tile_id)) {
				// data is fresh in the cache - just render it
				//	this.pushRenderQueue(tile_id, this.cache.get(tile_id), 'cache-fresh');
				//	this.cachedTileCount += 1;
				//} else {
				var latCenter = (latNorth + latSouth) / 2;
				var lngCenter = (lngEast + lngWest) / 2;
				var tileLatLng = L.latLng(latCenter, lngCenter);
				// console.log('Dx: ' + latCenter + ' ' + lngCenter);

				var tilePoint = map.project(tileLatLng, mapZoom);

				var delta = mapCenterPoint.subtract(tilePoint);
				var distanceSquared = delta.x * delta.x + delta.y * delta.y;

				tilesToFetchDistance[tile_id] = distanceSquared;
				this.requestedTileCount += 1;
				//	}
			}
		}
		var tilesToFetch = Object.keys(tilesToFetchDistance);
		tilesToFetch.sort(function(a, b) {
			return tilesToFetchDistance[a] - tilesToFetchDistance[b];
		});

		for (var i in tilesToFetch) {
			var qk = tilesToFetch[i];

			this.queuedTiles[qk] = qk;
		}



		this.setStatus('loading', undefined, -1);
		window.runHooks('requestFinished', {success: true});
		console.log('Dx: done request preparation (cleared out-of-bounds and invalid for zoom, and rendered cached data)');
		if (Object.keys(this.queuedTiles).length > 0) {
			this.delayProcessRequestQueue(this.DOWNLOAD_DELAY, true);
		} else {
			this.delayProcessRequestQueue(0, true);
		}
	}


	window.MapDataRequest.prototype.processRenderQueue = function() {
		var drawEntityLimit = this.RENDER_BATCH_SIZE;
		while (drawEntityLimit > 0 && this.renderQueue.length > 0) {
			var current = this.renderQueue[0];

			if (current.deleted.length > 0) {
				var deleteThisPass = current.deleted.splice(0, drawEntityLimit);
				drawEntityLimit -= deleteThisPass.length;
				this.render.processDeletedGameEntityGuids(deleteThisPass);
			}

			if (drawEntityLimit > 0 && current.entities.length > 0) {
				var drawThisPass = current.entities.splice(0, drawEntityLimit);
				drawEntityLimit -= drawThisPass.length;
				this.render.processGameEntities(drawThisPass);
			}

			if (current.deleted.length == 0 && current.entities.length == 0) {
				this.renderQueue.splice(0, 1);
				this.debugTiles.setState(current.id, current.status);
			}
		}
		if (this.renderQueue.length > 0) {
			this.startQueueTimer(this.RENDER_PAUSE);
		} else if (Object.keys(this.queuedTiles).length == 0) {

			this.render.endRenderPass();

			var endTime = new Date().getTime();
			var duration = (endTime - this.refreshStartTime) / 1000;

			console.log('finished requesting data! (took ' + duration + ' seconds to complete)');

			window.runHooks('mapDataRefreshEnd', {});

			var longStatus = 'Tiles: ' + this.cachedTileCount + ' cached, ' +
					this.successTileCount + ' loaded, ' +
					(this.staleTileCount ? this.staleTileCount + ' stale, ' : '') +
					(this.failedTileCount ? this.failedTileCount + ' failed, ' : '') +
					'in ' + duration + ' seconds';

			// refresh timer based on time to run this pass, with a minimum of REFRESH seconds
			var minRefresh = map.getZoom() > 12 ? this.REFRESH_CLOSE : this.REFRESH_FAR;
			var refreshTimer = Math.max(minRefresh, duration * this.FETCH_TO_REFRESH_FACTOR);
			this.refreshOnTimeout(refreshTimer);
			window.portalUpdate(this.staleTileCount);
			this.setStatus(this.failedTileCount ? 'errors' : this.staleTileCount ? 'out of date' : 'done', longStatus);
		}
	};
	// Change Zoom on this functions
	// window.getDataZoomForMapZoom
	// window.getMapZoomTileParameters
	window.Render.prototype.processGameEntities = function(entities) {

		for (var i in entities) {
			var ent = entities[i];
			if (ent[2][0] == 'r' && !(ent[0] in this.deletedGuid)) {
				this.createFieldEntity(ent);
			}
		}

		for (var i in entities) {
			var ent = entities[i];

			if (ent[2][0] == 'e' && !(ent[0] in this.deletedGuid)) {
				this.createLinkEntity(ent);
			}
		}

		for (var i in entities) {
			var ent = entities[i];

			if (ent[2][0] == 'p' && !(ent[0] in this.deletedGuid)) {
				console.log('Dx: ' + ent[0]);
				window.portalDetail.request(ent[0]);
				this.createPortalEntity(ent);
			}
		}
	};
	window.isIdle = function() {
		return false;
	};
	window.setupIdle = function() {
	};

//<editor-fold defaultstate="collapsed" desc="CHAT SCRAPER">

	/**
	 * Capture CHATS
	 * @param {type} markup
	 * @param {type} json
	 * @param {type} time
	 * @returns {Boolean}
	 */
	window.chatCaptured = function(markup, json, time)
	{
		if (json[2].plext.plextType == 'PLAYER_GENERATED')
		{
			$.ajax({
				xhrFields: {
					withCredentials: false
				},
				type: "POST",
				url: dxUrl + '/getPlextsComm.php',
				data: {
					action: 'chat',
					nick: json[2].plext.markup[0][1].plain,
					team: json[2].plext.team === 'RESISTANCE' ? TEAM_RES : TEAM_ENL,
					time: time,
					title: json[2].plext.text,
					lat: 1,
					lng: 1
				}
			});
			return false;
		}
	};
	//</editor-fold>

	window.chat.writeDataToHash = function(newData, storageHash, isPublicChannel, isOlderMsgs) {
		$.each(newData.result, function(ind, json) {
			if (json[0] in storageHash.data)
				return true;

			var isSecureMessage = false;
			var msgToPlayer = false;

			var time = json[1];
			var team = json[2].plext.team === 'RESISTANCE' ? TEAM_RES : TEAM_ENL;
			var auto = json[2].plext.plextType !== 'PLAYER_GENERATED';
			var systemNarrowcast = json[2].plext.plextType === 'SYSTEM_NARROWCAST';
			if (storageHash.oldestTimestamp === -1 || storageHash.oldestTimestamp > time)
				storageHash.oldestTimestamp = time;
			if (storageHash.newestTimestamp === -1 || storageHash.newestTimestamp < time)
				storageHash.newestTimestamp = time;
			var msg = '', nick = '';
			$.each(json[2].plext.markup, function(ind, markup) {
				switch (markup[0]) {
					case 'SENDER':
						nick = markup[1].plain.slice(0, -2); // cut ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œ: ÃƒÂ¢Ã¢â€šÂ¬Ã¯Â¿Â½ at end
						break;

					case 'PLAYER':
						nick = markup[1].plain;
						team = markup[1].team === 'RESISTANCE' ? TEAM_RES : TEAM_ENL;
						window.playerSave(nick, team);
						if (ind > 0)
							msg += nick;
						break;

					case 'TEXT':
						msg += $('<div/>').text(markup[1].plain).html().autoLink();
						window.chatCaptured(markup, json, time);
						break;

					case 'AT_PLAYER':
						var thisToPlayer = (markup[1].plain == ('@' + window.PLAYER.nickname));
						var spanClass = thisToPlayer ? "pl_nudge_me" : (markup[1].team + " pl_nudge_player");
						var atPlayerName = markup[1].plain.replace(/^@/, "");
						msg += $('<div/>').html($('<span/>')
								.attr('class', spanClass)
								.attr('onclick', "window.chat.nicknameClicked(event, '" + atPlayerName + "')")
								.text(markup[1].plain)).html();
						msgToPlayer = msgToPlayer || thisToPlayer;
						// window.chatCaptured(markup, json, time);
						break;

					case 'PORTAL':
						var latlng = [markup[1].latE6 / 1E6, markup[1].lngE6 / 1E6];
						var perma = '/intel?ll=' + latlng[0] + ',' + latlng[1] + '&z=17&pll=' + latlng[0] + ',' + latlng[1];
						var js = 'window.selectPortalByLatLng(' + latlng[0] + ', ' + latlng[1] + ');return false';

						msg += '<a onclick="' + js + '"'
								+ ' title="' + markup[1].address + '"'
								+ ' href="' + perma + '" class="help">'
								+ window.chat.getChatPortalName(markup[1])
								+ '</a>';
						break;

					case 'SECURE':
						isSecureMessage = true;
						break;

					default:
						msg += $('<div/>').text(markup[0] + ':<' + markup[1].plain + '>').html();
						break;
				}
			});
			if (!auto && !(isPublicChannel === false) && isSecureMessage)
				msg = '<span style="color: #f88; background-color: #500;">[faction]</span> ' + msg;
			if (!auto && !(isPublicChannel === true) && (!isSecureMessage))
				msg = '<span style="color: #ff6; background-color: #550">[public]</span> ' + msg;
			storageHash.data[json[0]] = [json[1], auto, chat.renderMsg(msg, nick, time, team, msgToPlayer, systemNarrowcast), nick];
		});
	};

	window.chat.genPostData = function(channel, storageHash, getOlderMsgs) {
		if (typeof channel !== 'string')
			throw ('API changed: isFaction flag now a channel string - all, faction, alerts');
		var b = window.getChatBounds();
		if (!chat._oldBBox)
			chat._oldBBox = b;
		var CHAT_BOUNDINGBOX_SAME_FACTOR = 0.1;
		if (!(b.pad(CHAT_BOUNDINGBOX_SAME_FACTOR).contains(chat._oldBBox) && chat._oldBBox.pad(CHAT_BOUNDINGBOX_SAME_FACTOR).contains(b))) {
			$('#chat > div').data('needsClearing', true);
			chat._faction.data = {};
			chat._faction.oldestTimestamp = -1;
			chat._faction.newestTimestamp = -1;

			chat._public.data = {};
			chat._public.oldestTimestamp = -1;
			chat._public.newestTimestamp = -1;

			chat._alerts.data = {};
			chat._alerts.oldestTimestamp = -1;
			chat._alerts.newestTimestamp = -1;
			chat._oldBBox = b;
		}
		var ne = b.getNorthEast();
		var sw = b.getSouthWest();
		var data = {
			minLatE6: Math.round(sw.lat * 1E6),
			minLngE6: Math.round(sw.lng * 1E6),
			maxLatE6: Math.round(ne.lat * 1E6),
			maxLngE6: Math.round(ne.lng * 1E6),
			minTimestampMs: -1,
			maxTimestampMs: -1,
			tab: channel,
		};
		if (getOlderMsgs) {
		} else {
			var min = storageHash.newestTimestamp;
			$.extend(data, {minTimestampMs: min});
			if (min > -1)
				$.extend(data, {ascendingTimestampOrder: true});
		}
		return data;
	};

	window.outOfDateUserPrompt = function()
	{
		if (!window.blockOutOfDateRequests) {
			window.location.reload();
		}
	};
	//</editor-fold>

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