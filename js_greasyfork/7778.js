// ==UserScript==
// @id             IITC_DX_PORTALS_PLUGIN
// @name           IITC_DX_PORTALS_PLUGIN
// @version        0.0.12.27
// @description    0.0.12.27 Integrate Dx Portals PLugins
// @namespace      IITC_DX_PORTALS_PLUGIN
// @include        https://www.ingress.com/intel*
// @include        http://www.ingress.com/intel*
// @match          https://www.ingress.com/intel*
// @match          http://www.ingress.com/intel*
// @include        https://ingress.com/intel*
// @include        http://ingress.com/intel*
// @match          https://ingress.com/intel*
// @match          http://ingress.com/intel*
// https://greasyfork.org/en/scripts/7778-iitc-dx-portals-plugin
// https://greasyfork.org/scripts/7778-iitc-dx-portals-plugin/code/IITC_DX_PORTALS_PLUGIN.user.js
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/7778/IITC_DX_PORTALS_PLUGIN.user.js
// @updateURL https://update.greasyfork.org/scripts/7778/IITC_DX_PORTALS_PLUGIN.meta.js
// ==/UserScript==

function wrapper() {
	// in case IITC is not available yet, define the base plugin object
	if (typeof window.plugin !== "function") {
		window.plugin = function () {
		};
	}
	// base context for plugin
	window.plugin.dxportalsplugin = function () {
	};
	var self = window.plugin.dxportalsplugin;

	/**
	 * LocalSetup
	 * @type Boolean
	 */
	var local = false;

	/**
	 * Enable portal detail scraping
	 * @type Boolean|Boolean|Boolean|Boolean|Boolean
	 */
	var doScrape = true;
	/**
	 * Will scrape actions
	 * @type Boolean
	 */
	var doChatScrape = true;

	/**
	 * Send Artifacts
	 * @type Boolean
	 */
	var doArtifactScrape = true;

	/**
	 * Will not display logs
	 * @type Boolean
	 */
	var hideLogs = false;

	/**
	 * eavesdrop
	 * @type Boolean|Boolean|Boolean
	 */
	var doFactionChatScrape = false;
	var useBounds = true;
	var useNextWindow = true;
	var scrapeDeployed = true;
	var scrapeDestroyed = true;
	var scrapePlayer = false;
	var dxUrl = 'https://simgress.com/intel';
	var checkVirus = true;
	var virusDetection = [];
	var checkGrinding = true;
	var grindingDetection = [];
	var playerSaved = 0;
	var playerUpdated = 0;
	var portalDetailUpdatedCount = 0;
	var portalDetailAddedCount = 0;
	var actionMade = [];
	// setup function called by IITC
	self.setup = function init() {
		window.MAX_IDLE_TIME = 60 * 60;
		if (getParameterByName('doNotChatScrape') == 1)
		{
			doChatScrape = false;
		}
		if (getParameterByName('doNotScrape') == 1)
		{
			doScrape = false;
		}
		if (getParameterByName('doNotUseNextWindow') == 1)
		{
			useNextWindow = false;
		}
		if (local)
		{
			useNextWindow = false;
			useBounds = false;
			hideLogs = false;
			doFactionChatScrape = false;
			doChatScrape = true;
			doScrape = false;
			dxUrl = 'https://sandbox.com/Ingress/intel';
		} else {
			$.ajax({
				type: "POST",
				dataType: 'json',
				data: {restarting: 1},
				url: dxUrl + '/scraper/status.php',
				success: function (data)
				{
					if (data.doScrape !== undefined)
					{
						if (data.doScrape == 0)
						{
							doScrape = false;
						}
					}
					if (data.scrapeDeployed !== undefined)
					{
						if (data.scrapeDeployed == 1)
						{
							scrapeDeployed = true;
						} else {
							scrapeDeployed = false;
						}
					}
					if (data.scrapeDestroyed !== undefined)
					{
						if (data.scrapeDestroyed == 1)
						{
							scrapeDestroyed = true;
						} else {
							scrapeDestroyed = false;
						}
					}
					if (data.scrapePlayer !== undefined)
					{
						if (data.scrapePlayer == 1)
						{
							scrapePlayer = true;
						} else {
							scrapePlayer = false;
						}
					}
					if (data.location !== undefined)
					{
						window.location = data.location;
					}
				}
			});
		}
		if (doChatScrape)
		{
			$('#chatcontrols a').eq(0).trigger('click');
		}
		$('#sidebartoggle').trigger('click');
	};

	//<editor-fold defaultstate="collapsed" desc="ARTIFACTS/SHARDS">
	window.artifact.processResult = function (portals) {
		// portals is an object, keyed from the portal GUID, containing the portal entity array

		if (doArtifactScrape)
		{
			$.ajax({
				type: "POST",
				dataType: 'json',
				data: portals,
				url: dxUrl + '/artifacts.php',
				success: function (data)
				{
				}
			});
		}

		for (var guid in portals) {
			var ent = portals[guid];
			var data = decodeArray.portalSummary(ent);
			// we no longer know the faction for the target portals, and we don't know which fragment numbers are at the portals
			// all we know, from the portal summary data, for each type of artifact, is that each artifact portal is
			// - a target portal or not - no idea for which faction
			// - has one (or more) fragments, or not

			if (!artifact.portalInfo[guid])
				artifact.portalInfo[guid] = {};

			// store the decoded data - needed for lat/lng for layer markers
			artifact.portalInfo[guid]._data = data;

			for (var type in data.artifactBrief.target) {
				if (!artifact.artifactTypes[type])
					artifact.artifactTypes[type] = {};

				if (!artifact.portalInfo[guid][type])
					artifact.portalInfo[guid][type] = {};

				artifact.portalInfo[guid][type].target = TEAM_NONE;  // as we no longer know the team...
			}

			for (var type in data.artifactBrief.fragment) {
				if (!artifact.artifactTypes[type])
					artifact.artifactTypes[type] = {};

				if (!artifact.portalInfo[guid][type])
					artifact.portalInfo[guid][type] = {};

				artifact.portalInfo[guid][type].fragments = true; //as we no longer have a list of the fragments there
			}


			// let's pre-generate the entities needed to render the map - array of [guid, timestamp, ent_array]
			artifact.entities.push([guid, data.timestamp, ent]);
		}
	}
	//</editor-fold>

	//<editor-fold defaultstate="collapsed" desc="DxFunctions">

//	window.getDataZoomForMapZoom = function(zoom) {
//		return 15;
//	};

	window.getMapZoomTileParameters = function (zoom) {
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
	window.getParameterByName = function (name) {
		name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
		var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
				results = regex.exec(location.search);
		return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	};

	window.getDavaoBounds = function ()
	{
		/**
		 * Davao
		 */
		return new L.LatLngBounds(clampLatLng({lat: 6.962212, lng: 125.190582}), clampLatLng({lat: 7.282103, lng: 125.7639317}));
	};

	window.getSouthMindanaoBounds = function ()
	{
		/**
		 * Davao
		 * Z:9 NE: 7.991238, 127.916565 SW: 5.443757, 122.689819
		 */
		return new L.LatLngBounds(clampLatLng({lat: 5.443757, lng: 122.689819}), clampLatLng({lat: 7.991238, lng: 127.916565}));
	};

	window.getMindanaoBounds = function ()
	{
		/**
		 * Mindanao
		 *
		 */
		return new L.LatLngBounds(clampLatLng({lat: 5.348052, lng: 118.998413}), clampLatLng({lat: 10.217625, lng: 128.171997}));
	};

	window.getPhBounds = function ()
	{
		return new L.LatLngBounds(clampLatLng({lat: -0.7250783020332547, lng: 111.11572265625}), clampLatLng({lat: 19.993998469485504, lng: 134.5166015625}));
	};

	window.getVizLuzBounds = function ()
	{
		return new L.LatLngBounds(clampLatLng({lat: -0.7250783020332547, lng: 111.11572265625}), clampLatLng({lat: 19.993998469485504, lng: 134.5166015625}));
	};

	window.getVisayasBounds = function ()
	{
		/**
		 *  18.968637, 134.219971 SW: 9.026153, 113.312988
		 */
		return new L.LatLngBounds(clampLatLng({lat: 9.026153, lng: 113.312988}), clampLatLng({lat: 18.968637, lng: 134.219971}));
	};

	window.getLuzonBounds = function ()
	{
		/**
		 *  18.968637, 134.219971 SW: 9.026153, 113.312988
		 */
		return new L.LatLngBounds(clampLatLng({lat: 9.026153, lng: 113.312988}), clampLatLng({lat: 18.968637, lng: 134.219971}));
	};

	window.portalDetail.request = function (guid)
	{
		if (doScrape)
		{
			window.postAjax('getPortalDetails', {guid: guid},
					function (data, textStatus, jqXHR) {
						$.ajax({
							dataType: "json",
							type: "POST",
							url: dxUrl + '/portalDetail.php',
							data: {
								remoteUpdate: 1,
								portalDetails: 1,
								portalId: guid,
								title: data.result[8],
								lat: data.result[2],
								lng: data.result[3],
								image: data.result[7],
								owner: data.result[16],
								team: (data.result[1] == 'R' ? 1 : (data.result[1] == 'E' ? 2 : 0)),
								level: data.result[4],
								health: data.result[5],
								resonator_count: data.result[6]
							},
							success: function (data) {
								if (data.portalupdated !== undefined)
								{
									portalDetailUpdatedCount = portalDetailUpdatedCount + 1;
									console.log('PortalDetails: PortalDetailUpdatedCount: ' + portalDetailUpdatedCount);
								}
								if (data.portaladded !== undefined)
								{
									portalDetailAddedCount = portalDetailAddedCount + 1;
									console.log('PortalDetails: PortalDetailAddedCount: ' + portalDetailAddedCount);
								}
							}
						});
					}
			);
		}
	};

	window.getChatBounds = function ()
	{
		if (getParameterByName('mindanao') == 1)
		{
			return window.getMindanaoBounds();
		}
		if (getParameterByName('southmindanao') == 1)
		{
			return window.getSouthMindanaoBounds();
		}
		if (getParameterByName('visayas') == 1)
		{
			return window.getVisayasBounds();
		}
		if (getParameterByName('luzon') == 1)
		{
			return window.getLuzonBounds();
		}
		if (getParameterByName('vizluz') == 1)
		{
			return window.getVizLuzBounds();
		}
		return window.getPhBounds();
	};

	window.playerSave = function (nick, team)
	{
		if (scrapePlayer)
		{
			$.ajax({
				dataType: "json",
				type: "POST",
				url: dxUrl + '/playerDetail.php',
				data: {
					intelPlayer: 1,
					ign: nick,
					team: team
				},
				success: function (data)
				{
					if (data.playerupdate !== undefined)
					{
						playerUpdated++;
					}
					if (data.playersave !== undefined)
					{
						playerSaved++;
					}
				}
			});
		}
		return false;
	};

	window.getNextWindow = function (dx)
	{
		if (useNextWindow)
		{
			$.ajax({
				type: "POST",
				url: dxUrl + '/map/scraper.php',
				dataType: 'json',
				data: {
					portalDetailUpdatedCount: portalDetailUpdatedCount,
					portalDetailAddedCount: portalDetailAddedCount,
					location: getParameterByName('scraper'),
					test: getParameterByName('test'),
				},
				success: function (data)
				{
					if (data !== null)
					{
						if (data.refresh !== undefined)
						{
							window.location.reload();
						} else {
							portalDetailUpdatedCount = 0;
							portalDetailAddedCount = 0;
							map.panTo(new L.LatLng(data[0], data[1]));
							map.setZoom(data[5]);
							if ($('#scraperStatus').length == 0)
							{
								$('#updatestatus').prepend('<span class="help" id="scraperStatus">Scraper Status: </span>');
							}
							$('#scraperStatus').text('Scraper Status: ' + getParameterByName('scraper') + ' ' + data[2]);
						}
					} else {
						window.location.reload();
					}
				}
			});
		}
	};

	window.portalUpdate = function (staleTileCount)
	{
		if (doScrape)
		{
			var done = staleTileCount ? 'out of date' : 'done';
			if (done == 'done')
			{
				window.getNextWindow();
			}
		}
	};
	window.dxlog = function (msg)
	{
		// console.log('DX: ' + msg);
	};
	//</editor-fold>

	//<editor-fold defaultstate="collapsed" desc="CHAT SCRAPER">
	/**
	 * Check for virus action
	 * @param {type} markup
	 * @param {type} json
	 * @param {type} time
	 * @returns {undefined}
	 */
	window.checkVirus = function (json, time)
	{
		if (checkVirus && json[2].plext.markup[1][1].plain == ' destroyed a Resonator on ' && json[2].plext.text.search('Philippines') > 0)
		{
			var id = json[2].plext.markup[0][1].plain + '_' + time + '_' + json[2].plext.markup[2][1].latE6 + '_' + json[2].plext.markup[2][1].lngE6;
			if (virusDetection[id] === undefined)
			{
				virusDetection[id] = 0;
			}
			virusDetection[id]++;
			if (virusDetection[id] == 8)
			{
				$.ajax({
					xhrFields: {
						withCredentials: false
					},
					type: "POST",
					url: dxUrl + '/getPlextsComm.php',
					data: {
						action: 'virus',
						nick: json[2].plext.markup[0][1].plain,
						team: json[2].plext.team === 'RESISTANCE' ? TEAM_RES : TEAM_ENL,
						time: time,
						lat: json[2].plext.markup[2][1].latE6,
						lng: json[2].plext.markup[2][1].lngE6,
						title: json[2].plext.markup[2][1].name,
						address: json[2].plext.markup[2][1].address,
					},
					success: function (data)
					{
						if (data.actionFound !== undefined)
						{
							if (actionMade['virus'] === undefined)
							{
								actionMade['virus'] = 0;
							}
							actionMade['virus'] = actionMade['virus']++;
						}
					}
				});
			}
		}
	};

	/**
	 * Check if Grinding Mode
	 * @param {type} json
	 * @param {type} time
	 * @returns {undefined}
	 */
	window.checkGrinding = function (json, time)
	{
		if (checkGrinding && json[2].plext.markup[1][1].plain == ' captured ' && json[2].plext.text.search('Philippines') > 0)
		{
			var id = json[2].plext.markup[2][1].latE6 + '_' + json[2].plext.markup[2][1].lngE6;
			if (grindingDetection[id] === undefined)
			{
				grindingDetection[id] = 0;
			}
			grindingDetection[id]++;
			if (grindingDetection[id] > 10)
			{
				checkGrinding = false;
				$.ajax({
					xhrFields: {
						withCredentials: false
					},
					type: "POST",
					url: dxUrl + '/getPlextsComm.php',
					data: {
						action: 'grinding',
						nick: json[2].plext.markup[0][1].plain,
						team: json[2].plext.team === 'RESISTANCE' ? TEAM_RES : TEAM_ENL,
						time: time,
						lat: json[2].plext.markup[2][1].latE6,
						lng: json[2].plext.markup[2][1].lngE6,
						title: json[2].plext.markup[2][1].name,
						address: json[2].plext.markup[2][1].address,
					},
					success: function ()
					{
						checkGrinding = true;
					}
				});
			}
		}
	};

	/**
	 * Capture CHATS
	 * @param {type} markup
	 * @param {type} json
	 * @param {type} time
	 * @returns {Boolean}
	 */
	window.chatCaptured = function (markup, json, time)
	{
		if (doFactionChatScrape)
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
						lng: 1,
					}
				});
				return false;
			}
		}

		if (doChatScrape === false)
		{
			return false;
		}
		if (markup[1].plain == ' destroyed a Resonator on ' && json[2].plext.text.search('Philippines') > 0 && scrapeDestroyed)
		{
			$.ajax({
				xhrFields: {
					withCredentials: false
				},
				type: "POST",
				url: dxUrl + '/getPlextsComm.php',
				data: {
					action: 'destroyed',
					nick: json[2].plext.markup[0][1].plain,
					team: json[2].plext.team === 'RESISTANCE' ? TEAM_RES : TEAM_ENL,
					time: time,
					lat: json[2].plext.markup[2][1].latE6,
					lng: json[2].plext.markup[2][1].lngE6,
					title: json[2].plext.markup[2][1].name,
					address: json[2].plext.markup[2][1].address,
				},
				success: function (data)
				{
					if (data.actionFound !== undefined)
					{
						if (actionMade['destroyed'] === undefined)
						{
							actionMade['destroyed'] = 0;
						}
						actionMade['destroyed'] = actionMade['destroyed']++;
					}
				}
			});
		}
		if (markup[1].plain == ' destroyed the Link ' && json[2].plext.text.search('Philippines') > 0)
		{
			$.ajax({
				xhrFields: {
					withCredentials: false
				},
				type: "POST",
				url: dxUrl + '/getPlextsComm.php',
				data: {
					action: 'linkdestroyed',
					nick: json[2].plext.markup[0][1].plain,
					team: json[2].plext.team === 'RESISTANCE' ? TEAM_RES : TEAM_ENL,
					time: time,
					lat: json[2].plext.markup[2][1].latE6,
					lng: json[2].plext.markup[2][1].lngE6,
					title: json[2].plext.markup[2][1].name,
					address: json[2].plext.markup[2][1].address,
					lat2: json[2].plext.markup[4][1].latE6,
					lng2: json[2].plext.markup[4][1].lngE6,
					title2: json[2].plext.markup[4][1].name,
					address2: json[2].plext.markup[4][1].address,
				},
				success: function (data)
				{
					if (data.actionFound !== undefined)
					{
						if (actionMade['linkdestroyed'] === undefined)
						{
							actionMade['linkdestroyed'] = 0;
						}
						actionMade['linkdestroyed'] = actionMade['linkdestroyed']++;
					}
				}
			});
		}
		if (markup[1].plain == ' destroyed a Control Field @' && json[2].plext.text.search('Philippines') > 0)
		{
			$.ajax({
				xhrFields: {
					withCredentials: false
				},
				type: "POST",
				url: dxUrl + '/getPlextsComm.php',
				data: {
					action: 'fielddestroyed',
					nick: json[2].plext.markup[0][1].plain,
					team: json[2].plext.team === 'RESISTANCE' ? TEAM_RES : TEAM_ENL,
					time: time,
					lat: json[2].plext.markup[2][1].latE6,
					lng: json[2].plext.markup[2][1].lngE6,
					title: json[2].plext.markup[2][1].name,
					address: json[2].plext.markup[2][1].address,
					mu: json[2].plext.markup[4][1].plain
				},
				success: function (data)
				{
					if (data.actionFound !== undefined)
					{
						if (actionMade['fielddestroyed'] === undefined)
						{
							actionMade['fielddestroyed'] = 0;
						}
						actionMade['fielddestroyed'] = actionMade['fielddestroyed']++;
					}
				}
			});
		}
		if (markup[1].plain == ' deployed a Portal Fracker on ' && json[2].plext.text.search('Philippines') > 0)
		{
			$.ajax({
				xhrFields: {
					withCredentials: false
				},
				type: "POST",
				url: dxUrl + '/getPlextsComm.php',
				data: {
					action: 'deployedfracker',
					nick: json[2].plext.markup[0][1].plain,
					team: json[2].plext.team === 'RESISTANCE' ? TEAM_RES : TEAM_ENL,
					time: time,
					lat: json[2].plext.markup[2][1].latE6,
					lng: json[2].plext.markup[2][1].lngE6,
					title: json[2].plext.markup[2][1].name,
					address: json[2].plext.markup[2][1].address,
				},
				success: function (data)
				{
					if (data.actionFound !== undefined)
					{
						if (actionMade['deployedfracker'] === undefined)
						{
							actionMade['deployedfracker'] = 0;
						}
						actionMade['deployedfracker'] = actionMade['deployedfracker']++;
					}
				}
			});
		}
		if (markup[1].plain == ' deployed a Resonator on ' && json[2].plext.text.search('Philippines') > 0 && scrapeDeployed)
		{
			$.ajax({
				xhrFields: {
					withCredentials: false
				},
				type: "POST",
				url: dxUrl + '/getPlextsComm.php',
				data: {
					action: 'deployed',
					nick: json[2].plext.markup[0][1].plain,
					team: json[2].plext.team === 'RESISTANCE' ? TEAM_RES : TEAM_ENL,
					time: time,
					lat: json[2].plext.markup[2][1].latE6,
					lng: json[2].plext.markup[2][1].lngE6,
					title: json[2].plext.markup[2][1].name,
					address: json[2].plext.markup[2][1].address,
				},
				success: function (data)
				{
					if (data.actionFound !== undefined)
					{
						if (actionMade['deployed'] === undefined)
						{
							actionMade['deployed'] = 0;
						}
						actionMade['deployed'] = actionMade['deployed']++;
					}
				}
			});
		}
		if (markup[1].plain == ' captured ' && json[2].plext.text.search('Philippines') > 0)
		{
			$.ajax({
				xhrFields: {
					withCredentials: false
				},
				type: "POST",
				url: dxUrl + '/getPlextsComm.php',
				data: {
					action: 'captured',
					nick: json[2].plext.markup[0][1].plain,
					team: json[2].plext.team === 'RESISTANCE' ? TEAM_RES : TEAM_ENL,
					time: time,
					lat: json[2].plext.markup[2][1].latE6,
					lng: json[2].plext.markup[2][1].lngE6,
					title: json[2].plext.markup[2][1].name,
					address: json[2].plext.markup[2][1].address,
				},
				success: function (data)
				{
					if (data.actionFound !== undefined)
					{
						if (actionMade['captured'] === undefined)
						{
							actionMade['captured'] = 0;
						}
						actionMade['captured'] = actionMade['captured']++;
					}
				}
			});
		}
		//if (markup[1].plain == ' linked ' && json[2].plext.text.search('Philippines') > 0)
		if (markup[1].plain == ' linked ')
		{
			$.ajax({
				xhrFields: {
					withCredentials: false
				},
				type: "POST",
				url: dxUrl + '/getPlextsComm.php',
				data: {
					action: 'link',
					nick: json[2].plext.markup[0][1].plain,
					team: json[2].plext.team === 'RESISTANCE' ? TEAM_RES : TEAM_ENL,
					time: time,
					lat: json[2].plext.markup[2][1].latE6,
					lng: json[2].plext.markup[2][1].lngE6,
					title: json[2].plext.markup[2][1].name,
					address: json[2].plext.markup[2][1].address,
					lat2: json[2].plext.markup[4][1].latE6,
					lng2: json[2].plext.markup[4][1].lngE6,
					title2: json[2].plext.markup[4][1].name,
					address2: json[2].plext.markup[4][1].address,
				},
				success: function (data)
				{
					if (data.actionFound !== undefined)
					{
						if (actionMade['link'] === undefined)
						{
							actionMade['link'] = 0;
						}
						actionMade['link'] = actionMade['link']++;
					}
				}
			});
		}
		if (markup[1].plain == ' created a Control Field @' && json[2].plext.text.search('Philippines') > 0)
		{
			$.ajax({
				xhrFields: {
					withCredentials: false
				},
				type: "POST",
				url: dxUrl + '/getPlextsComm.php',
				data: {
					action: 'field',
					nick: json[2].plext.markup[0][1].plain,
					team: json[2].plext.team === 'RESISTANCE' ? TEAM_RES : TEAM_ENL,
					time: time,
					lat: json[2].plext.markup[2][1].latE6,
					lng: json[2].plext.markup[2][1].lngE6,
					title: json[2].plext.markup[2][1].name,
					address: json[2].plext.markup[2][1].address,
					mu: json[2].plext.markup[4][1].plain
				},
				success: function (data)
				{
					if (data.actionFound !== undefined)
					{
						if (actionMade['field'] === undefined)
						{
							actionMade['field'] = 0;
						}
						actionMade['field'] = actionMade['field']++;
					}
				}
			});
		}
	};
	//</editor-fold>

	//<editor-fold defaultstate="collapsed" desc="window.chat.renderMsg">
	window.chat.renderMsg = function (msg, nick, time, team, msgToPlayer, systemNarrowcast) {
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

		// help cursor via Ã¢â‚¬Å“#chat timeÃ¢â‚¬ï¿½
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


	window.MapDataRequest.prototype.refresh = function ()
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
		tilesToFetch.sort(function (a, b) {
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


	window.MapDataRequest.prototype.processRenderQueue = function () {
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
	window.Render.prototype.processGameEntities = function (entities) {

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
	window.isIdle = function () {
		return false;
	};
	window.setupIdle = function () {
	}
	window.chat.writeDataToHash = function (newData, storageHash, isPublicChannel, isOlderMsgs) {
		$.each(newData.result, function (ind, json) {
			if (json[0] in storageHash.data)
				return true;

			var isSecureMessage = false;
			var msgToPlayer = false;

			var time = json[1];
			var team = json[2].plext.team === 'RESISTANCE' ? TEAM_RES : TEAM_ENL;
			var auto = json[2].plext.plextType !== 'PLAYER_GENERATED';
			var systemNarrowcast = json[2].plext.plextType === 'SYSTEM_NARROWCAST';
			window.checkVirus(json, time);
			window.checkGrinding(json, time);
			if (storageHash.oldestTimestamp === -1 || storageHash.oldestTimestamp > time)
				storageHash.oldestTimestamp = time;
			if (storageHash.newestTimestamp === -1 || storageHash.newestTimestamp < time)
				storageHash.newestTimestamp = time;
			var msg = '', nick = '';
			$.each(json[2].plext.markup, function (ind, markup) {
				switch (markup[0]) {
					case 'SENDER':
						nick = markup[1].plain.slice(0, -2); // cut Ã¢â‚¬Å“: Ã¢â‚¬ï¿½ at end
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

	window.chat.genPostData = function (channel, storageHash, getOlderMsgs) {
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

	window.outOfDateUserPrompt = function ()
	{
		if (!window.blockOutOfDateRequests) {
			window.location.reload();
		}
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