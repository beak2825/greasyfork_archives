// ==UserScript==
// @name         ACME Prototypes Plex Bulk Downloader
// @description  acme-prototypes.com — Adds a download button to Plex desktop.
// @author       acme-prototypes.com
// @version      1.7.5
// @license      MIT
// @grant        GM_download
// @connect      *
// @match        https://app.plex.tv/desktop/
// @include      https://*.*.plex.direct:32400/web/index.html*
// @run-at       document-start
// @namespace    https://acme-prototypes.com/
// @downloadURL https://update.greasyfork.org/scripts/562689/ACME%20Prototypes%20Plex%20Bulk%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/562689/ACME%20Prototypes%20Plex%20Bulk%20Downloader.meta.js
// ==/UserScript==

(function() {
	"use strict";

	const DEBUG = false;
	function dlog(...args) {
		if (!DEBUG) return;
		// eslint-disable-next-line no-console
		console.log("[ACME PLDLR]", ...args);
	}

	function randToken() {
		return Math.random().toString(36).slice(2);
	}

	const domPrefix = `USERJSINJECTED-${randToken()}_`.toLowerCase();

	// Injection points
	const injectionElement     = "button[data-testid=preplay-play]";
	const playlistTitleElement = "div[data-testid=preplay-mainTitle]";
	const injectPosition       = "after";

	const domElementStyle     = "";
	const domElementInnerHTML =
		"<svg style='height:1.5rem; width:1.5rem; margin:0 4px 0 0;'><g><path d='M3,12.3v7a2,2,0,0,0,2,2H19a2,2,0,0,0,2-2v-7' fill='none' stroke='currentcolor' stroke-linecap='round' stroke-linejoin='round' stroke-width='2'></path><g><polyline fill='none' stroke='currentcolor' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' points='7.9 12.3 12 16.3 16.1 12.3'></polyline><line fill='none' stroke='currentcolor' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' x1='12' x2='12' y1='2.7' y2='14.2'></line></g></g></svg>Download";

	function sanitizeName(str) {
		return String(str || "")
			.replace(/[<>:"/\\|?*\x00-\x1F]/g, "_")
			.replace(/\s+/g, " ")
			.trim()
			.slice(0, 180);
	}
	function pad2(n) {
		const v = parseInt(n, 10);
		if (isNaN(v)) return "";
		return String(v).padStart(2, "0");
	}

	const fsUnits = [ "B", "KB", "MB", "GB", "TB" ];
	function makeFilesize(numbytes) {
		let ui = 0;
		numbytes = parseInt(numbytes, 10);
		if (isNaN(numbytes) || numbytes < 0) return "?";
		while (numbytes >= 1024 && ui < fsUnits.length - 1) {
			numbytes /= 1024;
			ui++;
		}
		return ui !== 0 ? `${numbytes.toFixed(2)} ${fsUnits[ui]}` : `${numbytes} ${fsUnits[ui]}`;
	}

	function makeDuration(ms) {
		ms = parseInt(ms, 10);
		if (isNaN(ms) || ms < 0) return "?";
		let h = Math.floor(ms / 3600000);
		let m = Math.floor((ms % 3600000) / 60000);
		let s = Math.floor((ms % 60000) / 1000);
		let ret = [ h, m, s ];
		if (ret[0] === 0) ret.shift();
		for (let i = 1; i < ret.length; i++) ret[i] = String(ret[i]).padStart(2, "0");
		return ret.join(":");
	}

	// -------------------------
	// Server data / API
	// -------------------------
	const serverData = { servers: {}, promise: null };

	serverData.update = function(newData, scope) {
		scope = scope || serverData;
		for (let key in newData) {
			if (!Object.hasOwn(scope, key) || typeof newData[key] !== "object") scope[key] = newData[key];
			else serverData.update(newData[key], scope[key]);
		}
	};

	serverData.updateMediaDirectly = function(clientId, metadataId, newData) {
		serverData.update({ servers: { [clientId]: { mediaData: { [metadataId]: newData } } } });
	};

	function ensureChildren(clientId, parentId) {
		serverData.updateMediaDirectly(clientId, parentId, { children: [] });
	}
	function addChild(clientId, parentId, childId) {
		ensureChildren(clientId, parentId);
		const arr = serverData.servers[clientId].mediaData[parentId].children;
		if (!arr.includes(childId)) arr.push(childId);
	}

	serverData.apiCall = async function(clientId, apiPath) {
		const baseUri = serverData.servers[clientId].baseUri;
		const accessToken = serverData.servers[clientId].accessToken;

		const apiUrl = new URL(`${baseUri}${apiPath}`);
		apiUrl.searchParams.set("X-Plex-Token", accessToken);

		try {
			const response = await fetch(apiUrl.href, { headers: { accept: "application/json" } });
			if (!response.ok) return false;
			return await response.json();
		} catch (e) {
			// Relay fallback
			if (e && e.name === "TypeError" && serverData.servers[clientId].fallbackUri) {
				serverData.servers[clientId].baseUri = serverData.servers[clientId].fallbackUri;
				serverData.servers[clientId].fallbackUri = false;
				return await serverData.apiCall(clientId, apiPath);
			}
			return false;
		}
	};

	serverData.checkServer = async function(clientId) {
		const responseJSON = await serverData.apiCall(clientId, "/media/providers/");
		if (responseJSON === false) return false;
		serverData.servers[clientId].allowsDl = responseJSON.MediaContainer.allowSync;
		return true;
	};

	serverData.load = async function() {
		const serverToken = window.localStorage.getItem("myPlexAccessToken");
		const browserToken = window.localStorage.getItem("clientID");
		if (!serverToken || !browserToken) return false;

		const apiResourceUrl = new URL("https://clients.plex.tv/api/v2/resources");
		apiResourceUrl.searchParams.set("includeHttps", "1");
		apiResourceUrl.searchParams.set("includeRelay", "1");
		apiResourceUrl.searchParams.set("X-Plex-Client-Identifier", browserToken);
		apiResourceUrl.searchParams.set("X-Plex-Token", serverToken);

		let resourceJSON;
		try {
			const response = await fetch(apiResourceUrl.href, { headers: { accept: "application/json" } });
			if (!response.ok) return false;
			resourceJSON = await response.json();
		} catch {
			return false;
		}

		for (let i = 0; i < resourceJSON.length; i++) {
			const server = resourceJSON[i];
			if (server.provides !== "server") continue;
			if (!Object.hasOwn(server, "clientIdentifier") || !Object.hasOwn(server, "accessToken")) continue;

			const clientId = server.clientIdentifier;
			const accessToken = server.accessToken;

			const connection = server.connections.find(c => (!c.local && !c.relay));
			if (!connection || !Object.hasOwn(connection, "uri")) continue;

			serverData.update({
				servers: {
					[clientId]: {
						baseUri: connection.uri,
						accessToken,
						mediaData: {},
						allowsDl: "indeterminate",
					}
				}
			});

			const relay = server.connections.find(c => (!c.local && c.relay));
			if (relay && Object.hasOwn(relay, "uri")) {
				serverData.update({ servers: { [clientId]: { fallbackUri: relay.uri } } });
			}

			serverData.update({ servers: { [clientId]: { check: serverData.checkServer(clientId) } } });
		}

		return true;
	};

	serverData.available = async function() {
		if (!(await serverData.promise)) {
			serverData.promise = serverData.load();
			return await serverData.promise;
		}
		return true;
	};

	// Cache base metadata (store raw titles + ids for folder naming)
	serverData.updateMediaBase = function(clientId, mediaObject, topPromise, previousRecurse) {
		const mediaObjectData = {
			title: mediaObject.title,
			rawTitle: mediaObject.title || "",    // used for filenames + modal label
			index: Object.hasOwn(mediaObject, "index") ? mediaObject.index : 0,
			type: mediaObject.type,
		};

		// ids for later resolving season/show folders
		if (Object.hasOwn(mediaObject, "parentRatingKey")) mediaObjectData.parentId = mediaObject.parentRatingKey;
		if (Object.hasOwn(mediaObject, "grandparentRatingKey")) mediaObjectData.grandparentId = mediaObject.grandparentRatingKey;

		// titles Plex provides
		if (Object.hasOwn(mediaObject, "parentTitle")) mediaObjectData.parentTitle = mediaObject.parentTitle;
		if (Object.hasOwn(mediaObject, "grandparentTitle")) mediaObjectData.grandparentTitle = mediaObject.grandparentTitle;

		// year (movies)
		if (Object.hasOwn(mediaObject, "year")) mediaObjectData.year = mediaObject.year;

		// UI-only friendly titles (do NOT use for filenames)
		switch (mediaObject.type) {
			case "episode":
				mediaObjectData.title = `Episode ${mediaObject.index}: ${mediaObject.title}`;
				break;
			case "movie":
				mediaObjectData.title = `${mediaObject.title} (${mediaObject.year})`;
				break;
			case "season": {
				const idx = Object.hasOwn(mediaObject, "index") ? mediaObject.index : 0;
				if (!mediaObjectData.title || !String(mediaObjectData.title).trim()) {
					if (idx === 0) mediaObjectData.title = "Specials";
					else if (idx > 0) mediaObjectData.title = `Season ${idx}`;
					else mediaObjectData.title = "Season";
				}
				break;
			}
		}

		if (previousRecurse) mediaObjectData.promise = topPromise;

		serverData.updateMediaDirectly(clientId, mediaObject.ratingKey, mediaObjectData);

		// Parent relationships
		if (Object.hasOwn(mediaObject, "parentRatingKey")) {
			addChild(clientId, mediaObject.parentRatingKey, mediaObject.ratingKey);
		}
		if (Object.hasOwn(mediaObject, "grandparentRatingKey") && Object.hasOwn(mediaObject, "parentRatingKey")) {
			addChild(clientId, mediaObject.grandparentRatingKey, mediaObject.parentRatingKey);
		}

		// Forced linkage (music + playlist)
		if (previousRecurse && (previousRecurse.type === "artist" || previousRecurse.type === "album" || previousRecurse.type === "playlist")) {
			addChild(clientId, previousRecurse.ratingKey, mediaObject.ratingKey);
		}
	};

	serverData.updateMediaFileInfo = function(clientId, mediaObject, previousRecurse) {
		const part0 = mediaObject?.Media?.[0]?.Part?.[0];
		if (!part0) return;

		const fileInfo = {
			key: part0.key,
			filesize: part0.size,
			filetype: "?",
			resolution: "?",
			runtimeMS: -1,
			viewed: false,
		};

		let filename = part0.file || "";
		filename = filename.replaceAll("/", "\\");
		filename = filename.slice(filename.lastIndexOf("\\") + 1);
		fileInfo.filename = filename;

		if (Object.hasOwn(mediaObject.Media[0], "container")) fileInfo.filetype = mediaObject.Media[0].container;
		else if (Object.hasOwn(part0, "container")) fileInfo.filetype = part0.container;

		if (Object.hasOwn(mediaObject.Media[0], "videoResolution")) {
			fileInfo.resolution = String(mediaObject.Media[0].videoResolution).toUpperCase();
			if ([ "144", "240", "480", "720", "1080" ].includes(fileInfo.resolution)) fileInfo.resolution += "p";
		}

		if (Object.hasOwn(mediaObject.Media[0], "duration")) fileInfo.runtimeMS = mediaObject.Media[0].duration;
		if (Object.hasOwn(mediaObject, "viewCount") && mediaObject.viewCount !== 0) fileInfo.viewed = true;

		// Playlist ordering
		if (previousRecurse && previousRecurse.type === "playlist") {
			fileInfo.playlistTitle = previousRecurse.playlistTitle;
			fileInfo.playlistIndex = previousRecurse.playlistIndexCounter.value;
			previousRecurse.playlistIndexCounter.value++;
		}

		serverData.updateMediaDirectly(clientId, mediaObject.ratingKey, fileInfo);
	};

	serverData.recurseMediaApi = async function(clientId, apiPath, topPromise, previousRecurse) {
		const responseJSON = await serverData.apiCall(clientId, apiPath);
		if (responseJSON === false) return false;

		// Follow Directory redirects
		if (!Object.hasOwn(responseJSON.MediaContainer, "Metadata")) {
			if (Object.hasOwn(responseJSON.MediaContainer, "Directory") && responseJSON.MediaContainer.Directory.length) {
				const nextKey = responseJSON.MediaContainer.Directory[0].key;
				if (nextKey) return await serverData.recurseMediaApi(clientId, nextKey, topPromise, previousRecurse);
			}
			return true;
		}

		// Playlist title: MediaContainer.title is often correct
		if (previousRecurse && previousRecurse.type === "playlist") {
			const t = responseJSON?.MediaContainer?.title;
			if (t && String(t).trim()) {
				const title = String(t).trim();
				serverData.updateMediaDirectly(clientId, previousRecurse.ratingKey, { title, rawTitle: title, type: "playlist" });
				previousRecurse.playlistTitle = title;
			}
		}

		const recursionPromises = [];

		for (let i = 0; i < responseJSON.MediaContainer.Metadata.length; i++) {
			const mediaObject = responseJSON.MediaContainer.Metadata[i];

			serverData.updateMediaBase(clientId, mediaObject, topPromise, previousRecurse);

			if (Object.hasOwn(mediaObject, "Media")) {
				serverData.updateMediaFileInfo(clientId, mediaObject, previousRecurse);
				continue;
			}

			// Force recursion for music
			if (mediaObject.type === "artist" || mediaObject.type === "album") {
				const nextPath = `/library/metadata/${mediaObject.ratingKey}/children`;
				recursionPromises.push(serverData.recurseMediaApi(clientId, nextPath, topPromise, mediaObject));
				continue;
			}

			// Default recursion for TV etc.
			if (Object.hasOwn(mediaObject, "leafCount") || Object.hasOwn(mediaObject, "childCount")) {
				let nextPath = `/library/metadata/${mediaObject.ratingKey}/children`;

				if (
					Object.hasOwn(mediaObject, "childCount") &&
					Object.hasOwn(mediaObject, "leafCount") &&
					(mediaObject.childCount !== mediaObject.leafCount)
				) {
					nextPath = `/library/metadata/${mediaObject.ratingKey}/allLeaves`;
				}

				recursionPromises.push(serverData.recurseMediaApi(clientId, nextPath, topPromise, mediaObject));
			}
		}

		return await Promise.all(recursionPromises);
	};

	serverData.loadMediaData = async function(clientId, metadataId) {
		if (!(await serverData.available())) return false;

		if (!(await serverData.servers[clientId].check)) {
			serverData.servers[clientId].check = serverData.checkServer(clientId);
			if (!(await serverData.servers[clientId].check)) return false;
		}

		const promise = serverData.servers[clientId].mediaData[metadataId].promise;
		return await serverData.recurseMediaApi(clientId, `/library/metadata/${metadataId}`, promise, null);
	};

	serverData.loadPlaylistData = async function(clientId, playlistId, playlistTitle) {
		if (!(await serverData.available())) return false;

		const initialTitle = playlistTitle || `Playlist ${playlistId}`;

		serverData.updateMediaDirectly(clientId, playlistId, {
			title: initialTitle,
			rawTitle: initialTitle,
			index: 0,
			type: "playlist",
			children: [],
		});

		const playlistIndexCounter = { value: 1 };
		const promise = serverData.servers[clientId].mediaData[playlistId].promise;

		const previousRecurse = {
			type: "playlist",
			ratingKey: playlistId,
			playlistTitle: initialTitle,
			playlistIndexCounter,
		};

		return await serverData.recurseMediaApi(clientId, `/playlists/${playlistId}/items`, promise, previousRecurse);
	};

	serverData.mediaAvailable = async function(clientId, metadataId) {
		if (serverData.servers[clientId].mediaData[metadataId].promise) {
			return await serverData.servers[clientId].mediaData[metadataId].promise;
		}
		return false;
	};

	// Fetch real season titles if missing/generic
	async function hydrateSeasonTitles(clientId, seasonIds) {
		const server = serverData.servers[clientId];
		if (!server) return;

		const unique = Array.from(new Set(seasonIds));
		for (const seasonId of unique) {
			const node = server.mediaData[seasonId];
			if (!node) continue;

			const t = node.title ? String(node.title).trim() : "";
			if (t && t !== "Season") continue;

			const resp = await serverData.apiCall(clientId, `/library/metadata/${seasonId}`);
			if (resp === false) continue;

			const meta = resp?.MediaContainer?.Metadata?.[0];
			if (!meta) continue;

			let newTitle = meta.title ? String(meta.title).trim() : "";
			const idx = Object.hasOwn(meta, "index") ? meta.index : node.index;

			if (!newTitle) {
				if (idx === 0) newTitle = "Specials";
				else if (idx > 0) newTitle = `Season ${idx}`;
				else newTitle = "Season";
			}

			serverData.updateMediaDirectly(clientId, seasonId, {
				title: newTitle,
				rawTitle: newTitle,
				index: idx,
				type: meta.type || node.type
			});
		}
	}

	// -------------------------
	// Download (with async wrapper for progress)
	// -------------------------
	const download = {};
	download.frameClass = `${domPrefix}downloadFrame`;
	download.trigger = document.createElement("a");
	download.frames = document.getElementsByClassName(download.frameClass);

	download.cleanUp = function() {
		while (download.frames.length !== 0) download.frames[0].remove();
	};

	download.fromUriIframe = function(uri, filename) {
		const frame = document.createElement("iframe");
		frame.className = download.frameClass;
		frame.name = `USERJSINJECTED-${randToken()}`;
		frame.style = "display: none !important;";
		document.body.append(frame);

		download.trigger.href     = uri;
		download.trigger.target   = frame.name;
		download.trigger.download = filename;
		download.trigger.click();
	};

	download.fromUriAsync = function(uri, nameOrFilename) {
		// GM_download can tell us when a file finishes; iframe cannot.
		if (typeof GM_download === "function" && nameOrFilename && nameOrFilename.includes("/")) {
			return new Promise((resolve) => {
				try {
					GM_download({
						url: uri,
						name: nameOrFilename,
						saveAs: false,
						onload: () => resolve(true),
						onerror: () => resolve(false),
						ontimeout: () => resolve(false)
					});
				} catch {
					download.fromUriIframe(uri, nameOrFilename);
					resolve(true);
				}
			});
		}
		download.fromUriIframe(uri, nameOrFilename);
		return Promise.resolve(true);
	};

	download.makeUri = function(clientId, metadataId) {
		const key         = serverData.servers[clientId].mediaData[metadataId].key;
		const baseUri     = serverData.servers[clientId].baseUri;
		const accessToken = serverData.servers[clientId].accessToken;

		const url = new URL(`${baseUri}${key}`);
		url.searchParams.set("X-Plex-Token", accessToken);
		url.searchParams.set("download", "1");
		return url.href;
	};

	// Display label (shown in modal + progress line)
	function displayNameForLeaf(clientId, leafId, rootId) {
		const n = serverData.servers[clientId].mediaData[leafId];
		if (!n) return "Unknown";

		// Playlist item display
		if (rootId) {
			const root = serverData.servers[clientId].mediaData[rootId];
			if (root && root.type === "playlist") {
				const idx = pad2(n.playlistIndex);
				const artist = sanitizeName(n.grandparentTitle || n.parentTitle || "Unknown Artist");
				const titleOnly = (n.rawTitle || "").trim() || (n.title || "").trim() || "Title";
				return `${idx ? `${idx} - ` : ""}${artist} - ${titleOnly}`;
			}
		}

		if (n.type === "episode") {
			const epNum = (typeof n.index === "number" && n.index > 0) ? `E${pad2(n.index)} - ` : "";
			const t = (n.rawTitle || "").trim() || "Episode";
			return `${epNum}${t}`;
		}

		if (n.type === "track") {
			const trackNo = (typeof n.index === "number" && n.index > 0) ? `${pad2(n.index)}. ` : "";
			const t = (n.rawTitle || "").trim() || "Track";
			return `${trackNo}${t}`;
		}

		if (n.type === "movie") {
			const baseTitle = (n.rawTitle || n.title || "Movie").replace(/\s*\(\d{4}\)\s*$/, "").trim();
			const yearPart = n.year ? ` (${n.year})` : "";
			return `${baseTitle}${yearPart}`;
		}

		return (n.rawTitle || n.title || "Item").trim();
	}

	download.makeNameOrPath = function(clientId, metadataId, rootId) {
		const node = serverData.servers[clientId].mediaData[metadataId];
		const canFolder = (typeof GM_download === "function");
		const orig = node.filename || `plex_${metadataId}`;
		const ext = orig.includes(".") ? orig.slice(orig.lastIndexOf(".")) : "";

		// Flat fallback if folders not possible
		if (!canFolder) return sanitizeName(orig);

		// MOVIE: Movie Title (YYYY)/Movie Title (YYYY).ext
		if (node.type === "movie") {
			const baseTitle = (node.rawTitle || node.title || "Movie").replace(/\s*\(\d{4}\)\s*$/, "").trim();
			const yearPart = node.year ? ` (${node.year})` : "";
			const folder = sanitizeName(`${baseTitle}${yearPart}`);
			const fileBase = sanitizeName(`${baseTitle}${yearPart}${ext}`);
			return `${folder}/${fileBase}`;
		}

		// PLAYLIST: PlaylistName/NN - Artist - Title.ext
		if (rootId) {
			const root = serverData.servers[clientId].mediaData[rootId];
			if (root && root.type === "playlist") {
				const folder = sanitizeName(root.title || "Playlist");
				const idx = pad2(node.playlistIndex);

				const artist = sanitizeName(node.grandparentTitle || node.parentTitle || "Unknown Artist");
				const titleOnly = sanitizeName((node.rawTitle || node.title || "").trim() || (orig.replace(ext, "")));
				const base = `${idx ? `${idx} - ` : ""}${artist} - ${titleOnly}${ext}`;

				return `${folder}/${sanitizeName(base)}`;
			}
		}

		// EPISODE: Show/SeasonName/E01 - EpisodeTitle.ext
		if (node.type === "episode") {
			let showTitle = "";
			if (node.grandparentTitle) showTitle = String(node.grandparentTitle);
			else if (node.grandparentId && serverData.servers[clientId].mediaData[node.grandparentId]?.title) {
				showTitle = String(serverData.servers[clientId].mediaData[node.grandparentId].title);
			}
			if (!showTitle) showTitle = "Show";

			let seasonTitle = "";
			if (node.parentId) {
				const seasonNode = serverData.servers[clientId].mediaData[node.parentId];
				if (seasonNode && seasonNode.title && String(seasonNode.title).trim()) seasonTitle = String(seasonNode.title).trim();
				if ((!seasonTitle || !seasonTitle.trim()) && seasonNode && typeof seasonNode.index === "number") {
					if (seasonNode.index === 0) seasonTitle = "Specials";
					else if (seasonNode.index > 0) seasonTitle = `Season ${seasonNode.index}`;
				}
			}
			if (!seasonTitle && node.parentTitle && /season|special/i.test(String(node.parentTitle))) {
				seasonTitle = String(node.parentTitle);
				if (/special/i.test(seasonTitle)) seasonTitle = "Specials";
			}
			if (!seasonTitle) seasonTitle = "Season";

			const epNum = (typeof node.index === "number" && node.index > 0) ? `E${pad2(node.index)} - ` : "";
			const episodeTitle = sanitizeName((node.rawTitle || "").trim() || "Episode");

			return `${sanitizeName(showTitle)}/${sanitizeName(seasonTitle)}/${epNum}${episodeTitle}${ext}`;
		}

		// MUSIC TRACK: Artist/Album/01. TrackTitle.ext
		if (node.type === "track") {
			const artist = sanitizeName(node.grandparentTitle || "Unknown Artist");
			const album  = sanitizeName(node.parentTitle || "Unknown Album");

			const trackNo = (typeof node.index === "number" && node.index > 0) ? `${pad2(node.index)}. ` : "";
			const trackTitle = sanitizeName((node.rawTitle || "").trim() || "Track");

			return `${artist}/${album}/${trackNo}${trackTitle}${ext}`;
		}

		// Default safe
		return sanitizeName(orig);
	};

	download.fromMediaAsync = async function(clientId, metadataId, rootId) {
		const node = serverData.servers[clientId].mediaData[metadataId];

		if (Object.hasOwn(node, "key")) {
			const uri = download.makeUri(clientId, metadataId);
			const nameOrPath = download.makeNameOrPath(clientId, metadataId, rootId || metadataId);
			await download.fromUriAsync(uri, nameOrPath);
		}

		if (Object.hasOwn(node, "children")) {
			for (let i = 0; i < node.children.length; i++) {
				const childId = node.children[i];
				await download.fromMediaAsync(clientId, childId, rootId || metadataId);
			}
		}
	};

	// -------------------------
	// Modal (Grouped / collapsible) + Select all / Deselect all + Progress
	// -------------------------
	const modal = {};

	modal.documentFragment = document.createDocumentFragment();
	modal.container = document.createElement(`${domPrefix}element`);
	modal.documentFragment.append(modal.container);
	modal.container.id = `${domPrefix}modal_container`;

	modal.stylesheet = `
		${domPrefix}element { display:block; color:#eee; }
		#${domPrefix}modal_container { width:0; height:0; pointer-events:none; transition:opacity .2s; opacity:0; }
		#${domPrefix}modal_container.${domPrefix}open { pointer-events:auto; opacity:1; }
		#${domPrefix}modal_overlay { width:100%; height:100%; position:fixed; top:0; left:0; z-index:99990; display:flex; align-items:center; justify-content:center; background:#0007; }
		#${domPrefix}modal_popup {
			min-width:33%; max-width:90%; min-height:40%; max-height:min(80%, 650px);
			display:flex; flex-direction:column; gap:1em; padding:1em 1.3em; border-radius:14px; background:#3f3f42;
			text-align:center; box-shadow:0 0 10px 1px black; position:relative; transition:top .2s ease-out; top:-15%;
		}
		#${domPrefix}modal_container.${domPrefix}open #${domPrefix}modal_popup { top:-2%; }
		#${domPrefix}modal_title { font-size:16pt; }
		#${domPrefix}modal_scrollbox {
			width:100%; overflow-y:auto; scrollbar-color:#fff8 #fff1; scrollbar-width:thin; background:#0005;
			border-radius:6px; box-shadow:0 0 4px 1px #0003 inset; border-left:2px solid #222; flex:1;
			padding: 10px; box-sizing:border-box;
		}
		#${domPrefix}modal_topx {
			position:absolute; top:1em; right:1em; cursor:pointer; height:1.5em; width:1.5em; border-radius:3px;
			font-size:14pt; color:#fff8; background:transparent; border:none;
		}
		#${domPrefix}modal_topx:hover { background:#fff2; color:#000c; }
		#${domPrefix}modal_topx:hover:active { background:#fff7; }

		#${domPrefix}modal_downloadbutton,
		#${domPrefix}modal_selectall,
		#${domPrefix}modal_deselectall {
			display:inline;
			background:#0008;
			padding:.2em .5em;
			border-radius:4px;
			cursor:pointer;
			color:#eee;
			border:1px solid #5555;
			font-size:14pt;
		}
		#${domPrefix}modal_downloadbutton:not([disabled]):hover,
		#${domPrefix}modal_selectall:not([disabled]):hover,
		#${domPrefix}modal_deselectall:not([disabled]):hover { background:#14161a78; }
		#${domPrefix}modal_downloadbutton[disabled],
		#${domPrefix}modal_selectall[disabled],
		#${domPrefix}modal_deselectall[disabled] { opacity:.5; cursor:default; }

		#${domPrefix}modal_downloaddescription { font-size: 11.5pt; opacity: .9; }

		#${domPrefix}modal_progresswrap { display:none; text-align:left; }
		#${domPrefix}modal_progresswrap .hdr { display:flex; justify-content:space-between; gap:12px; margin-bottom:6px; }
		#${domPrefix}modal_progresswrap .txt { font-size: 11pt; opacity:.9; }
		#${domPrefix}modal_progresswrap .barbg { width:100%; height:10px; background:#0006; border-radius:999px; overflow:hidden; }
		#${domPrefix}modal_progresswrap .barfg { height:100%; width:0%; background:#1394e1; }

		#${domPrefix}modal_group { border: 1px solid #ffffff20; background: #00000018; border-radius: 8px; margin: 0 0 10px 0; overflow: hidden; }
		#${domPrefix}modal_group summary {
			list-style: none; display: flex; align-items: center; gap: 10px; padding: 10px 12px; cursor: pointer;
			user-select: none; background: #00000025; border-bottom: 1px solid #ffffff12; text-align: left;
		}
		#${domPrefix}modal_group summary::-webkit-details-marker { display:none; }
		.${domPrefix}group_title { font-weight: 650; font-size: 12.5pt; flex: 1; }
		.${domPrefix}group_meta { opacity: 0.8; font-size: 10.5pt; white-space: nowrap; }
		.${domPrefix}group_checkbox { height: 1rem; width: 1rem; cursor: pointer; accent-color: #1394e1; }
		.${domPrefix}group_table { width: 100%; border-collapse: collapse; }
		.${domPrefix}group_th, .${domPrefix}group_td { padding: 8px; border-bottom: 1px solid #ffffff10; vertical-align: middle; text-align: center; white-space: nowrap; }
		.${domPrefix}group_th { position: sticky; top: 0; background: #1f1f21; box-shadow: 0 2px 0 #00000055; font-weight: 650; z-index: 2; }
		.${domPrefix}group_td_title, .${domPrefix}group_th_title { text-align: left; white-space: normal; }
		.${domPrefix}row_checkbox { height: 1rem; width: 1rem; cursor: pointer; accent-color: #1394e1; }
		.${domPrefix}row_watched { font-size: 12pt; }
		.${domPrefix}row_muted { opacity: 0.7; }
	`;

	modal.container.innerHTML = `
		<style>${modal.stylesheet}</style>
		<${domPrefix}element id="${domPrefix}modal_overlay">
			<${domPrefix}element id="${domPrefix}modal_popup" role="dialog" aria-modal="true" aria-labelledby="${domPrefix}modal_title" aria-describedby="${domPrefix}modal_downloaddescription">
				<${domPrefix}element id="${domPrefix}modal_title">Download</${domPrefix}element>
				<input type="button" id="${domPrefix}modal_topx" value="&#x2715;" aria-label="close" title="Close" tabindex="0"/>
				<input type="hidden" id="${domPrefix}modal_clientid" tabindex="-1"/>
				<input type="hidden" id="${domPrefix}modal_parentid" tabindex="-1"/>

				<${domPrefix}element id="${domPrefix}modal_scrollbox" aria-label="Grouped download list">
					<${domPrefix}element id="${domPrefix}modal_group_container"></${domPrefix}element>
				</${domPrefix}element>

				<${domPrefix}element id="${domPrefix}modal_downloaddescription"></${domPrefix}element>

				<${domPrefix}element id="${domPrefix}modal_progresswrap">
					<div class="hdr">
						<div id="${domPrefix}modal_progresstext" class="txt">Downloading…</div>
						<div id="${domPrefix}modal_progresscount" class="txt">0/0</div>
					</div>
					<div class="barbg"><div id="${domPrefix}modal_progressbar" class="barfg"></div></div>
				</${domPrefix}element>

				<${domPrefix}element style="display:flex; gap:0.6rem; justify-content:center; flex-wrap:wrap;">
					<input type="button" id="${domPrefix}modal_selectall" value="Select all" tabindex="0"/>
					<input type="button" id="${domPrefix}modal_deselectall" value="Deselect all" tabindex="0"/>
					<input type="button" id="${domPrefix}modal_downloadbutton" value="Download" tabindex="0"/>
				</${domPrefix}element>
			</${domPrefix}element>
		</${domPrefix}element>
	`;

	// Modal element helpers
	modal.getElementByIdSuffix = function(idSuffix) {
		return modal.documentFragment.getElementById(`${domPrefix}${idSuffix}`);
	};

	modal.overlay             = modal.getElementByIdSuffix("modal_overlay");
	modal.popup               = modal.getElementByIdSuffix("modal_popup");
	modal.title               = modal.getElementByIdSuffix("modal_title");
	modal.groupContainer      = modal.getElementByIdSuffix("modal_group_container");
	modal.topX                = modal.getElementByIdSuffix("modal_topx");
	modal.clientId            = modal.getElementByIdSuffix("modal_clientid");
	modal.parentId            = modal.getElementByIdSuffix("modal_parentid");
	modal.downloadDescription = modal.getElementByIdSuffix("modal_downloaddescription");
	modal.downloadButton      = modal.getElementByIdSuffix("modal_downloadbutton");
	modal.selectAllBtn        = modal.getElementByIdSuffix("modal_selectall");
	modal.deselectAllBtn      = modal.getElementByIdSuffix("modal_deselectall");

	modal.progressWrap        = modal.getElementByIdSuffix("modal_progresswrap");
	modal.progressText        = modal.getElementByIdSuffix("modal_progresstext");
	modal.progressCount       = modal.getElementByIdSuffix("modal_progresscount");
	modal.progressBar         = modal.getElementByIdSuffix("modal_progressbar");

	modal.itemCheckboxes = [];
	modal.groupCheckboxes = [];
	modal._checkboxById = {};
	modal.firstTab = modal.topX;
	modal.lastTab  = modal.downloadButton;

	modal.captureKeyPress = function(event) {
		if (!modal.container.classList.contains(`${domPrefix}open`)) return;
		event.stopImmediatePropagation();

		switch (event.key) {
			case "Tab":
				if (!modal.container.contains(document.activeElement)) {
					event.preventDefault();
					modal.firstTab.focus();
					break;
				}
				if (event.shiftKey) {
					if (document.activeElement === modal.firstTab) {
						event.preventDefault();
						modal.lastTab.focus();
					}
				} else {
					if (document.activeElement === modal.lastTab) {
						event.preventDefault();
						modal.firstTab.focus();
					}
				}
				break;
			case "Escape":
				event.preventDefault();
				modal.close();
				break;
			case "Enter":
				event.preventDefault();
				if (modal.container.contains(document.activeElement)) document.activeElement.click();
				break;
		}
	};

	modal.keyUpDetectEscape = function(event) {
		if (event.key === "Escape") modal.close();
	};

	window.addEventListener("keydown", modal.captureKeyPress, { capture: true });

	modal.container.addEventListener("transitionend", function(event) {
		if (event.target !== modal.container) return;
		if (!modal.container.classList.contains(`${domPrefix}open`)) modal.documentFragment.append(modal.container);
	});

	modal.open = function(clientId, metadataId) {
		(async () => {
			const root = serverData.servers?.[clientId]?.mediaData?.[metadataId];
			if (root && root.children && root.children.length) {
				await hydrateSeasonTitles(clientId, root.children.slice());
			}

			modal.populate(clientId, metadataId);

			// default = checked
			for (let cb of modal.itemCheckboxes) cb.checked = true;
			for (let gcb of modal.groupCheckboxes) { gcb.checked = true; gcb.indeterminate = false; }

			modal.checkBoxChange();

			// reset progress UI
			modal.progressWrap.style.display = "none";
			modal.progressText.textContent = "";
			modal.progressCount.textContent = "";
			modal.progressBar.style.width = "0%";

			document.body.append(modal.container);
			window.addEventListener("popstate", modal.close);
			window.addEventListener("keyup", modal.keyUpDetectEscape);

			modal.lastTab.focus();
			modal.container.classList.add(`${domPrefix}open`);
		})();
	};

	modal.close = function() {
		window.removeEventListener("popstate", modal.close);
		window.removeEventListener("keyup", modal.keyUpDetectEscape);
		modal.container.classList.remove(`${domPrefix}open`);
	};

	modal.overlay.addEventListener("click", modal.close);
	modal.popup.addEventListener("click", function(event) { event.stopPropagation(); });
	modal.topX.addEventListener("click", modal.close);

	modal.selectAllBtn.addEventListener("click", function() {
		for (let cb of modal.itemCheckboxes) cb.checked = true;
		for (let gcb of modal.groupCheckboxes) { gcb.checked = true; gcb.indeterminate = false; }
		modal.checkBoxChange();
	});

	modal.deselectAllBtn.addEventListener("click", function() {
		for (let cb of modal.itemCheckboxes) cb.checked = false;
		for (let gcb of modal.groupCheckboxes) { gcb.checked = false; gcb.indeterminate = false; }
		modal.checkBoxChange();
	});

	// Sequential, progress-aware downloader
	modal.downloadChecked = async function() {
		const clientId = modal.clientId.value;
		const rootId = modal.parentId.value;

		const ids = [];
		for (let cb of modal.itemCheckboxes) if (cb.checked) ids.push(cb.value);
		if (!ids.length) return;

		// Show progress UI
		modal.progressWrap.style.display = "block";
		modal.progressCount.textContent = `0/${ids.length}`;
		modal.progressText.textContent = "Starting…";
		modal.progressBar.style.width = "0%";

		// Lock controls during run
		modal.downloadButton.disabled = true;
		modal.selectAllBtn.disabled = true;
		modal.deselectAllBtn.disabled = true;

		let done = 0;
		for (let i = 0; i < ids.length; i++) {
			const id = ids[i];
			const label = displayNameForLeaf(clientId, id, rootId);
			modal.progressText.textContent = `Downloading: ${label}`;
			modal.progressCount.textContent = `${done}/${ids.length}`;
			modal.progressBar.style.width = `${Math.round((done / ids.length) * 100)}%`;

			await download.fromMediaAsync(clientId, id, rootId);

			done++;
			modal.progressCount.textContent = `${done}/${ids.length}`;
			modal.progressBar.style.width = `${Math.round((done / ids.length) * 100)}%`;

			// Small spacing keeps things stable
			// eslint-disable-next-line no-await-in-loop
			await new Promise(r => setTimeout(r, 150));
		}

		modal.progressText.textContent = "Done.";
		modal.progressBar.style.width = "100%";

		// Unlock
		modal.downloadButton.disabled = false;
		modal.selectAllBtn.disabled = false;
		modal.deselectAllBtn.disabled = false;
	};
	modal.downloadButton.addEventListener("click", function() { void modal.downloadChecked(); });

	modal.checkBoxChange = function() {
		let totalFilesize = 0;
		let selectedItems = 0;

		for (let checkbox of modal.itemCheckboxes) {
			if (checkbox.checked) {
				const node = serverData.servers[modal.clientId.value]?.mediaData?.[checkbox.value];
				if (node && typeof node.filesize === "number") totalFilesize += node.filesize;
				selectedItems++;
			}
		}

		modal.downloadDescription.textContent =
			`${selectedItems} file(s) selected. Total size: ${makeFilesize(totalFilesize)}`;
		modal.downloadButton.disabled = (selectedItems === 0);

		// sync group checkbox states
		for (let gcb of modal.groupCheckboxes) {
			const ids = gcb._leafIds || [];
			if (!ids.length) { gcb.checked = false; gcb.indeterminate = false; continue; }

			let checked = 0;
			for (let id of ids) {
				const leafCb = modal._checkboxById[id];
				if (leafCb && leafCb.checked) checked++;
			}

			gcb.indeterminate = (checked > 0 && checked < ids.length);
			gcb.checked = (checked === ids.length);
		}
	};

	// Groups:
	// - Playlist: one group (no album split)
	// - Others: group by immediate children (Seasons/Albums)
	modal.populate = function(clientId, metadataId) {
		while (modal.groupContainer.hasChildNodes()) modal.groupContainer.firstChild.remove();

		modal.itemCheckboxes = [];
		modal.groupCheckboxes = [];
		modal._checkboxById = {};

		const root = serverData.servers[clientId].mediaData[metadataId];
		if (!root) return;

		modal.title.textContent = `Download from ${root.title}`;
		modal.clientId.value = clientId;
		modal.parentId.value = metadataId;

		function gatherLeaves(nodeId, outArr) {
			const node = serverData.servers[clientId].mediaData[nodeId];
			if (!node) return;

			if (Object.hasOwn(node, "key")) { outArr.push(nodeId); return; }

			if (Object.hasOwn(node, "children")) {
				const kids = node.children.slice();
				kids.sort((a, b) => {
					const A = serverData.servers[clientId].mediaData[a];
					const B = serverData.servers[clientId].mediaData[b];
					return (A?.index || 0) - (B?.index || 0);
				});
				for (let kid of kids) gatherLeaves(kid, outArr);
			}
		}
		function sortLeaves(leafIds) {
			leafIds.sort((a, b) => {
				const A = serverData.servers[clientId].mediaData[a];
				const B = serverData.servers[clientId].mediaData[b];
				return (A?.index || 0) - (B?.index || 0);
			});
		}

		const groups = [];

		if (root.type === "playlist") {
			const leafIds = [];
			gatherLeaves(metadataId, leafIds);
			sortLeaves(leafIds);
			if (leafIds.length) groups.push({ groupId: metadataId, title: root.title, leafIds });
		} else if (Object.hasOwn(root, "children")) {
			const childIds = root.children.slice();
			childIds.sort((a, b) => {
				const A = serverData.servers[clientId].mediaData[a];
				const B = serverData.servers[clientId].mediaData[b];
				return (A?.index || 0) - (B?.index || 0);
			});

			for (let childId of childIds) {
				const child = serverData.servers[clientId].mediaData[childId];
				if (!child) continue;

				const leafIds = [];
				gatherLeaves(childId, leafIds);
				sortLeaves(leafIds);
				if (!leafIds.length) continue;

				groups.push({ groupId: childId, title: child.title || "Season", leafIds });
			}
		} else if (Object.hasOwn(root, "key")) {
			groups.push({ groupId: metadataId, title: root.title, leafIds: [metadataId] });
		}

		for (let g of groups) {
			const details = document.createElement("details");
			details.id = `${domPrefix}modal_group`;
			details.open = true;

			const summary = document.createElement("summary");

			const groupCb = document.createElement("input");
			groupCb.type = "checkbox";
			groupCb.className = `${domPrefix}group_checkbox`;
			groupCb.checked = true;
			groupCb._leafIds = g.leafIds.slice();
			modal.groupCheckboxes.push(groupCb);

			const titleSpan = document.createElement("span");
			titleSpan.className = `${domPrefix}group_title`;
			titleSpan.textContent = g.title;

			const metaSpan = document.createElement("span");
			metaSpan.className = `${domPrefix}group_meta`;
			metaSpan.textContent = `${g.leafIds.length} file(s)`;

			groupCb.addEventListener("click", e => e.stopPropagation());
			groupCb.addEventListener("change", function() {
				for (let id of groupCb._leafIds) {
					const leafCb = modal._checkboxById[id];
					if (leafCb) leafCb.checked = groupCb.checked;
				}
				modal.checkBoxChange();
			});

			summary.append(groupCb, titleSpan, metaSpan);
			details.append(summary);

			const table = document.createElement("table");
			table.className = `${domPrefix}group_table`;

			const thead = document.createElement("thead");
			const trh = document.createElement("tr");

			function th(txt, extraClass) {
				const x = document.createElement("th");
				x.className = `${domPrefix}group_th` + (extraClass ? ` ${extraClass}` : "");
				x.textContent = txt;
				return x;
			}

			trh.append(
				th(""),
				th("File", `${domPrefix}group_th_title`),
				th("Watched"),
				th("Runtime"),
				th("Resolution"),
				th("Type"),
				th("Size")
			);
			thead.append(trh);

			const tbody = document.createElement("tbody");

			for (let leafId of g.leafIds) {
				const leaf = serverData.servers[clientId].mediaData[leafId];
				if (!leaf) continue;

				const tr = document.createElement("tr");

				const tdSel = document.createElement("td");
				tdSel.className = `${domPrefix}group_td`;

				const leafCb = document.createElement("input");
				leafCb.type = "checkbox";
				leafCb.className = `${domPrefix}row_checkbox`;
				leafCb.checked = true;
				leafCb.value = leafId;

				modal.itemCheckboxes.push(leafCb);
				modal._checkboxById[leafId] = leafCb;
				leafCb.addEventListener("change", modal.checkBoxChange);
				tdSel.append(leafCb);

				const tdTitle = document.createElement("td");
				tdTitle.className = `${domPrefix}group_td ${domPrefix}group_td_title`;
				// SHOW renamed label here:
				tdTitle.textContent = displayNameForLeaf(clientId, leafId, metadataId);

				const tdWatched = document.createElement("td");
				tdWatched.className = `${domPrefix}group_td ${domPrefix}row_watched`;
				tdWatched.textContent = leaf.viewed ? "\u2713" : "";

				const tdRuntime = document.createElement("td");
				tdRuntime.className = `${domPrefix}group_td`;
				tdRuntime.textContent = makeDuration(leaf.runtimeMS);

				const tdRes = document.createElement("td");
				tdRes.className = `${domPrefix}group_td ${domPrefix}row_muted`;
				tdRes.textContent = leaf.resolution;

				const tdType = document.createElement("td");
				tdType.className = `${domPrefix}group_td ${domPrefix}row_muted`;
				tdType.textContent = (leaf.filetype || "?").toString().toUpperCase();

				const tdSize = document.createElement("td");
				tdSize.className = `${domPrefix}group_td`;
				tdSize.textContent = makeFilesize(leaf.filesize);

				tr.append(tdSel, tdTitle, tdWatched, tdRuntime, tdRes, tdType, tdSize);
				tbody.append(tr);
			}

			table.append(thead, tbody);
			details.append(table);

			modal.groupContainer.append(details);
		}

		modal.checkBoxChange();
	};

	// -------------------------
	// DOM injection (playlist styling fallback)
	// -------------------------
	function modifyDom(injectionPoint, kind, playBtn) {
		let downloadButton;

		if (kind === "playlist") {
			if (playBtn) {
				downloadButton = playBtn.cloneNode(true);
				downloadButton.id = `${domPrefix}DownloadButton`;
				downloadButton.innerHTML = domElementInnerHTML;
				downloadButton.className = playBtn.className;
				downloadButton.style.cssText = playBtn.style.cssText;
			} else {
				downloadButton = document.createElement("button");
				downloadButton.id = `${domPrefix}DownloadButton`;
				downloadButton.type = "button";
				downloadButton.innerHTML = domElementInnerHTML;

				downloadButton.style.cssText = `
					display:inline-flex; align-items:center; justify-content:center;
					user-select:none; white-space:nowrap; touch-action:manipulation;
					cursor:pointer;
					min-height:40px;
					padding:0 var(--size-m);
					border-radius:var(--border-radius-s);
					background-color:var(--color-background-accent);
					color:var(--color-text-on-accent);
					border:none;
					line-height:0;
					transition:all var(--duration-fast);
				`.trim();
			}
			downloadButton.style.marginLeft = "0.75rem";
		} else {
			downloadButton = document.createElement(injectionPoint.tagName);
			downloadButton.id = `${domPrefix}DownloadButton`;
			downloadButton.innerHTML = domElementInnerHTML;
			downloadButton.className = `${domPrefix}element ${injectionPoint.className}`;
			downloadButton.style.cssText = domElementStyle;

			const cs = getComputedStyle(injectionPoint);
			downloadButton.style.font = cs.getPropertyValue("font");
			downloadButton.style.color = cs.getPropertyValue("color");
		}

		downloadButton.style.opacity = 0.5;
		downloadButton.disabled = true;

		switch (injectPosition.toLowerCase()) {
			case "after": injectionPoint.after(downloadButton); break;
			case "before": injectionPoint.before(downloadButton); break;
			default: break;
		}

		return downloadButton;
	}

	async function domCallback(domElement, clientId, metadataId) {
		if (!(await serverData.available())) return false;
		if (!(await serverData.mediaAvailable(clientId, metadataId))) return false;

		domElement.addEventListener("click", function(ev) {
			ev.stopPropagation();
			download.cleanUp();

			(async function() {
				const node = serverData.servers[clientId].mediaData[metadataId];
				if (Object.hasOwn(node, "children")) { modal.open(clientId, metadataId); return; }
				if (Object.hasOwn(node, "key")) { void download.fromMediaAsync(clientId, metadataId, metadataId); return; }

				serverData.servers[clientId].mediaData[metadataId].promise = serverData.loadMediaData(clientId, metadataId);
				await serverData.mediaAvailable(clientId, metadataId);

				const node2 = serverData.servers[clientId].mediaData[metadataId];
				if (Object.hasOwn(node2, "children")) modal.open(clientId, metadataId);
				else if (Object.hasOwn(node2, "key")) { void download.fromMediaAsync(clientId, metadataId, metadataId); }
			})();
		});

		return true;
	}

	// -------------------------
	// URL parsing
	// -------------------------
	const metadataIdRegex = /^\/library\/(?:metadata|collections)\/(\d+)(?:\/.*)?$/;
	const playlistIdRegex = /^\/playlists\/(\d+)(?:\/.*)?$/;
	const clientIdRegex   = /^\/server\/([a-f0-9]{40})\/.+$/;

	function parseUrl() {
		if (!location.hash.startsWith("#!/")) return false;

		const shebang = location.hash.slice(2);
		const hashUrl = new URL(`https://dummy.plex.tv${shebang}`);

		const clientIdMatch = clientIdRegex.exec(hashUrl.pathname);
		if (!clientIdMatch || clientIdMatch.length !== 2) return false;

		const mediaKey = hashUrl.searchParams.get("key");
		if (!mediaKey) return false;

		const pl = playlistIdRegex.exec(mediaKey);
		if (pl && pl.length === 2) return { clientId: clientIdMatch[1], metadataId: pl[1], kind: "playlist" };

		const m = metadataIdRegex.exec(mediaKey);
		if (!m || m.length !== 2) return false;

		return { clientId: clientIdMatch[1], metadataId: m[1], kind: "library" };
	}

	// -------------------------
	// Hash change + observer
	// -------------------------
	async function handleHashChange() {
		const urlIds = parseUrl();
		if (!urlIds) return;

		// Create empty node early
		serverData.updateMediaDirectly(urlIds.clientId, urlIds.metadataId, {});

		// Kick off load if needed
		if (!(await serverData.mediaAvailable(urlIds.clientId, urlIds.metadataId))) {
			let mediaPromise;
			if (urlIds.kind === "playlist") {
				const titleEl = document.querySelector(playlistTitleElement);
				const playlistTitle = titleEl ? titleEl.textContent.trim() : null;
				mediaPromise = serverData.loadPlaylistData(urlIds.clientId, urlIds.metadataId, playlistTitle);
			} else {
				mediaPromise = serverData.loadMediaData(urlIds.clientId, urlIds.metadataId);
			}
			serverData.servers[urlIds.clientId].mediaData[urlIds.metadataId].promise = mediaPromise;
		}

		DOMObserver.observe();
	}

	window.addEventListener("hashchange", handleHashChange);

	const DOMObserver = {};
	DOMObserver.mo = new MutationObserver(async function() {
		const urlIds = parseUrl();
		if (!urlIds) return;

		if (document.getElementById(`${domPrefix}DownloadButton`)) return;

		const playBtn = document.querySelector(injectionElement);
		const injectionPoint = (urlIds.kind === "playlist")
			? document.querySelector(playlistTitleElement)
			: playBtn;

		if (!injectionPoint) return;

		const domElement = modifyDom(injectionPoint, urlIds.kind, playBtn);
		const ok = await domCallback(domElement, urlIds.clientId, urlIds.metadataId);

		if (ok) {
			domElement.disabled = false;
			domElement.style.opacity = 1;
		} else {
			domElement.style.opacity = 0.25;
		}
	});

	DOMObserver.observe = function() {
		try { DOMObserver.mo.observe(document.body, { childList: true, subtree: true }); } catch { /* ignore */ }
	};

	// Boot
	function init() {
		serverData.promise = serverData.load();
		handleHashChange();
		DOMObserver.observe();
	}

	init();
})();
