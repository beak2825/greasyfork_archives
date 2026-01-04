// ==UserScript==
// @name        SendToClient
// @namespace   https://greasyfork.org/en/users/1466117
// @description Painlessly send torrents to your bittorrent client.
// @version     3.11
// @author      Mocha, originally by notmarek
// @license     MIT
// @match       *://*.gazellegames.net/torrents.php*
// @match       *://*.gazellegames.net/collections.php*
// @match       *://*.animebytes.tv/*
// @match       *://*.orpheus.network/*
// @match       *://*.passthepopcorn.me/*
// @match       *://*.greatposterwall.com/*
// @match       *://*.redacted.sh/*
// @match       *://*.jpopsuki.eu/to*
// @match       *://*.phoenixproject.app/to*
// @match       *://*.broadcasthe.net/to*
// @match       *://*.broadcasthe.net/series*
// @match       *://*.hdbits.org/browse.php*
// @match       *://*.hdbits.org/film/info?id=*
// @match       *://*.hdbits.org/details.php*
// @match       *://*.hdbits.org/bookmarks*
// @match       *://*.hdbits.org//mytorrents.php*
// @match       *://*.hdbits.org/show.php*
// @match       *://*.nyaa.si/*
// @match       *://*.tv-vault.me/to*
// @match       *://*.brokenstones.is/*
// @match       *://*.alpharatio.cc/*
// @match       *://*.sugoimusic.me/*
// @match       *://*.uhdbits.org/*
// @match       *://*.morethantv.me/*
// @match       *://*.empornium.is/*
// @match       *://*.deepbassnine.com/*
// @match       *://*.secret-cinema.pw/*
// @match       *://*.blutopia.cc/*
// @match       *://*.aither.cc/*
// @match       *://*.desitorrents.tv/*
// @match       *://*.telly.wtf/*
// @match       *://*.torrentleech.org/*
// @match       *://*.www.torrentleech.org/*
// @match       *://*.anilist.co/*
// @match       *://*.karagarga.in/*
// @match       *://beyond-hd.me/torrents/*
// @match       *://beyond-hd.me/library/*
// @match       *://beyond-hd.me/bookmarks/
// @match       *://beyond-hd.me/lists/*
// @match       *://beyond-hd.me/people/*
// @match       *://beyond-hd.me/ratings/
// @exclude     https://animebytes.tv/user.php?id=*
// @require     https://cdn.jsdelivr.net/combine/npm/@violentmonkey/dom@2,npm/@violentmonkey/ui@0.7
// @grant       GM.getValue
// @grant       GM.registerMenuCommand
// @grant       GM.setValue
// @grant       GM.unregisterMenuCommand
// @grant       GM.xmlHttpRequest
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/560368/SendToClient.user.js
// @updateURL https://update.greasyfork.org/scripts/560368/SendToClient.meta.js
// ==/UserScript==

(function () {
'use strict';

// ============================================================================
// INSERTION POINT CONFIGURATION - EDIT THESE FOR NEW SITES
// ============================================================================
const INSERTION_POINTS = {
'animebytes.tv': [
	// Priority order - will try all and insert at each one found
	//{ targetSelector: '#rating', position: 'beforebegin' }, OLD ONE ADD BACK MAYBE
	{ targetSelector: '.sidebar > .box:nth-of-type(2)', position: 'beforebegin' }
	// To add more insertion points for AB, add additional objects to this array:
	// { targetSelector: '.box_franchise', position: 'beforebegin' },
	// { targetSelector: '.box_tags', position: 'beforebegin' },
	// { targetSelector: '#userinfo_minor', position: 'afterend' }
],
'broadcasthe.net': [
	{ targetSelector: '.sidebar > .box:nth-of-type(1)', position: 'afterend' }
],
'gazellegames.net': [
	{ targetSelector: '.sidebar > .box:nth-of-type(1)', position: 'beforebegin' }
],
'phoenixproject.app': [
	{ targetSelector: '.sidebar > .box:nth-of-type(2)', position: 'beforebegin' }
],
'jpopsuki.eu': [
	{ targetSelector: '.sidebar > .box:nth-of-type(2)', position: 'afterend' }
],
'redacted.sh': [
	{ targetSelector: 'div.box.box_image', position: 'afterend' }
],
'orpheus.network': [
	{ targetSelector: 'div.box.box_image', position: 'afterend' }
],
'greatposterwall.com': [
	{ targetSelector: '.SidebarTags', position: 'beforebegin' }
],
'passthepopcorn.me': [
	{ targetSelector: '#movieinfo', position: 'beforebegin' }
],
'hdbits.org': [
	{ targetSelector: '.browsesearch', position: 'afterend' }
],
'nyaa.si': [
	{ targetSelector: '.table-responsive', position: 'afterend' }
],
'alpharatio.cc': [
	{ targetSelector: '#votes', position: 'beforebegin' }
],
'tv-vault.me': [
	{ targetSelector: '.sidebar > .box:nth-of-type(2)', position: 'beforebegin' }
]
};

// ============================================================================
// CLIENT CAPABILITIES
// ============================================================================
const CLIENT_CAPABILITIES = {
qbit: {
	supportsCategories: true,
	supportsTags: false,
	supportsSkipChecking: true,
	supportsStopped: true,
	supportsRootFolder: true
},
deluge: {
	supportsCategories: false,
	supportsTags: true,
	supportsSkipChecking: false,
	supportsStopped: true,
	supportsRootFolder: false
},
flood: {
	supportsCategories: false,
	supportsTags: true,
	supportsSkipChecking: false,
	supportsStopped: true,
	supportsRootFolder: false
},
trans: {
	supportsCategories: false,
	supportsTags: false,
	supportsSkipChecking: false,
	supportsStopped: false,
	supportsRootFolder: false
},
rutorrent: {
	supportsCategories: false,
	supportsTags: true,
	supportsSkipChecking: false,
	supportsStopped: true,
	supportsRootFolder: false
}
};

// ============================================================================
// GLOBAL MENU COMMAND TRACKING
// ============================================================================
let profileMenuCommandId = null;

// ============================================================================
// XFETCH UTILITY
// ============================================================================
const XFetch = {
post: async (url, data, headers = {}) => {
	return new Promise((resolve) => {
	GM.xmlHttpRequest({
		method: 'POST',
		url,
		headers,
		data,
		onload: res => {
		resolve({
			json: async () => JSON.parse(res.responseText),
			text: async () => res.responseText,
			headers: async () => Object.fromEntries(res.responseHeaders.split('\r\n').map(h => h.split(': '))),
			raw: res
		});
		}
	});
	});
},
get: async url => {
	return new Promise((resolve) => {
	GM.xmlHttpRequest({
		method: 'GET',
		url,
		headers: { Accept: 'application/json' },
		onload: res => {
		resolve({
			json: async () => JSON.parse(res.responseText),
			text: async () => res.responseText,
			headers: async () => Object.fromEntries(res.responseHeaders.split('\r\n').map(h => h.split(': '))),
			raw: res
		});
		}
	});
	});
}
};

// ============================================================================
// STORAGE MANAGER
// ============================================================================
const storageManager = {
async getSiteProfile(hostname) {
	const key = `profile_${hostname.replace(/\./g, '_')}`;
	return await GM.getValue(key);
},

async setSiteProfile(hostname, profileId) {
	const key = `profile_${hostname.replace(/\./g, '_')}`;
	await GM.setValue(key, profileId);
},

async getProfile(id) {
	return await GM.getValue(`profile_${id}`);
},

async setProfile(id, profile) {
	await GM.setValue(`profile_${id}`, JSON.stringify(profile));
},

async deleteProfile(id) {
	await GM.setValue(`profile_${id}`, undefined);
},

async getAllProfiles() {
	const profiles = [];
	for (let id = 0; id <= 100; id++) {
	const profile = await this.getProfile(id);
	if (profile) {
		profiles.push({ id, ...JSON.parse(profile) });
	}
	}
	return profiles.sort((a, b) => a.id - b.id);
},

async getNextProfileId() {
	const profiles = await this.getAllProfiles();
	if (profiles.length === 0) return 0;
	return Math.max(...profiles.map(p => p.id)) + 1;
},

async getClient(id) {
	return await GM.getValue(`client_${id}`);
},

async setClient(id, client) {
	await GM.setValue(`client_${id}`, JSON.stringify(client));
},

async deleteClient(id) {
	await GM.setValue(`client_${id}`, undefined);
},

async getAllClients() {
	const clients = [];
	for (let id = 0; id <= 100; id++) {
	const client = await this.getClient(id);
	if (client) {
		clients.push({ id, ...JSON.parse(client) });
	}
	}
	return clients.sort((a, b) => a.id - b.id);
},

async getNextClientId() {
	const clients = await this.getAllClients();
	if (clients.length === 0) return 0;
	return Math.max(...clients.map(c => c.id)) + 1;
}
};

// ============================================================================
// CLIENT CLASS
// ============================================================================
class Client {
constructor(id, name, type, host, username, password) {
	this.id = id;
	this.name = name;
	this.type = type;
	this.host = host;
	this.username = username;
	this.password = password;
}

async testConnection() {
	return await testClient(this.host, this.username, this.password, this.type);
}

async getCategories() {
	if (this.type !== 'qbit') return [];
	return await getCategories(this.host, this.username, this.password);
}
}

// ============================================================================
// PROFILE CLASS
// ============================================================================
class Profile {
constructor(id, name, clientId, saveLocation, category, tags, skipChecking, stopped, rootFolder) {
	this.id = id;
	this.name = name;
	this.clientId = clientId;
	this.saveLocation = saveLocation || '';
	this.category = category || '';
	this.tags = tags || '';
	this.skipChecking = skipChecking || false;
	this.stopped = stopped || false;
	this.rootFolder = rootFolder !== undefined ? rootFolder : true;
}

async getClient() {
	const clientData = await storageManager.getClient(this.clientId);
	if (!clientData) return null;
	const data = JSON.parse(clientData);
	return new Client(this.clientId, data.name, data.type, data.host, data.username, data.password);
}

async addTorrent(torrentUrl) {
	const client = await this.getClient();
	if (!client) {
	throw new Error('Client not found for this profile');
	}
	return await addTorrent(
	torrentUrl,
	client.host,
	client.username,
	client.password,
	client.type,
	this.saveLocation,
	this.category,
	this.tags,
	this.skipChecking,
	this.stopped,
	this.rootFolder
	);
}
}

// ============================================================================
// PROFILE MANAGER
// ============================================================================
const profileManager = {
currentProfile: null,

async init() {
	const hostname = location.hostname;
	let profileId = await storageManager.getSiteProfile(hostname);

	if (profileId === undefined) {
	const profiles = await storageManager.getAllProfiles();
	if (profiles.length > 0) {
		profileId = profiles[0].id;
		await storageManager.setSiteProfile(hostname, profileId);
	}
	}

	if (profileId !== undefined) {
	await this.setCurrentProfile(profileId);
	}
},

async setCurrentProfile(profileId) {
	const profileData = await storageManager.getProfile(profileId);
	if (!profileData) {
	this.currentProfile = null;
	return;
	}
	const data = JSON.parse(profileData);
	this.currentProfile = new Profile(
	profileId,
	data.name,
	data.clientId,
	data.saveLocation,
	data.category,
	data.tags,
	data.skipChecking,
	data.stopped,
	data.rootFolder !== undefined ? data.rootFolder : true
	);

	await storageManager.setSiteProfile(location.hostname, profileId);
	window.dispatchEvent(new CustomEvent('profileChanged', { detail: this.currentProfile }));
	
	await updateProfileMenuCommand();
},

async getAllProfiles() {
	return await storageManager.getAllProfiles();
},

async getProfile(id) {
	const data = await storageManager.getProfile(id);
	if (!data) return null;
	const parsed = JSON.parse(data);
	return new Profile(
	id,
	parsed.name,
	parsed.clientId,
	parsed.saveLocation,
	parsed.category,
	parsed.tags,
	parsed.skipChecking,
	parsed.stopped,
	parsed.rootFolder !== undefined ? parsed.rootFolder : true
	);
}
};

// ============================================================================
// CLIENT MANAGER
// ============================================================================
const clientManager = {
async getAllClients() {
	return await storageManager.getAllClients();
},

async getClient(id) {
	const data = await storageManager.getClient(id);
	if (!data) return null;
	const parsed = JSON.parse(data);
	return new Client(id, parsed.name, parsed.type, parsed.host, parsed.username, parsed.password);
}
};

// END OF PART 1 OF 5
// PART 2 OF 5 - CONTINUE FROM PART 1

// ============================================================================
// TORRENT CLIENT FUNCTIONS
// ============================================================================
const addTorrent = async (torrentUrl, clientUrl, username, password, client, path, category, tags, skipChecking, stopped, rootFolder) => {  // ADD rootFolder PARAMETER
let implementations = {
	qbit: async () => {
		await XFetch.post(`${clientUrl}/api/v2/auth/login`, `username=${username}&password=${password}`, {
			'content-type': 'application/x-www-form-urlencoded'
		});
		let tor_data = new FormData();
		tor_data.append('urls', torrentUrl);
		if (path) tor_data.append('savepath', path);
		if (category) tor_data.append('category', category);
		if (stopped !== undefined) tor_data.append('stopped', stopped);
		if (skipChecking !== undefined) tor_data.append('skip_checking', skipChecking);
		if (rootFolder !== undefined) {
			tor_data.append('contentLayout', rootFolder ? 'Original' : 'NoSubfolder');
		}
		await XFetch.post(`${clientUrl}/api/v2/torrents/add`, tor_data);
	},
	trans: async (session_id = null) => {
	let headers = {
		Authorization: `Basic ${btoa(`${username}:${password}`)}`,
		'Content-Type': 'application/json'
	};
	if (session_id) headers['X-Transmission-Session-Id'] = session_id;
	let res = await XFetch.post(`${clientUrl}/transmission/rpc`, JSON.stringify({
		arguments: { filename: torrentUrl, 'download-dir': path },
		method: 'torrent-add'
	}), headers);
	if (res.raw.status === 409) {
		await implementations.trans((await res.headers())['X-Transmission-Session-Id']);
	}
	},
	flood: async () => {
	await XFetch.post(`${clientUrl}/api/auth/authenticate`, JSON.stringify({ password, username }), {
		'content-type': 'application/json'
	});
	const body = { urls: [torrentUrl], destination: path, start: !stopped };
	if (tags) body.tags = tags.split(',').map(t => t.trim());
	await XFetch.post(`${clientUrl}/api/torrents/add-urls`, JSON.stringify(body), {
		'content-type': 'application/json'
	});
	},
	deluge: async () => {
	await XFetch.post(`${clientUrl}/json`, JSON.stringify({
		method: 'auth.login', params: [password], id: 0
	}), { 'content-type': 'application/json' });

	let res = await XFetch.post(`${clientUrl}/json`, JSON.stringify({
		method: 'web.download_torrent_from_url', params: [torrentUrl], id: 1
	}), { 'content-type': 'application/json' });

	await XFetch.post(`${clientUrl}/json`, JSON.stringify({
		method: 'web.add_torrents',
		params: [[{ path: (await res.json()).result, options: { add_paused: stopped, download_location: path }}]],
		id: 2
	}), { 'content-type': 'application/json' });
	},
	rutorrent: async () => {
	let headers = { Authorization: `Basic ${btoa(`${username}:${password}`)}` };
	const response = await fetch(torrentUrl);
	const data = await response.blob();
	let form = new FormData();
	form.append('torrent_file[]', data, 'sendtoclient.torrent');
	form.append('torrents_start_stopped', stopped ? 'true' : 'false');
	form.append('dir_edit', path);
	if (tags) form.append('label', tags);
	await XFetch.post(`${clientUrl}/rutorrent/php/addtorrent.php?json=1`, form, headers);
	}
};
await implementations[client]();
};

// ============================================================================
// BATCH TORRENT ADDING
// ============================================================================
const addTorrentBatch = async (torrentUrls, clientUrl, username, password, client, path, category, tags, skipChecking, stopped, rootFolder) => {
let implementations = {
	qbit: async () => {
		await XFetch.post(`${clientUrl}/api/v2/auth/login`, `username=${username}&password=${password}`, {
			'content-type': 'application/x-www-form-urlencoded'
		});
		let tor_data = new FormData();
		tor_data.append('urls', torrentUrls.join('\n'));
		if (path) tor_data.append('savepath', path);
		if (category) tor_data.append('category', category);
		if (stopped !== undefined) tor_data.append('stopped', stopped);
		if (skipChecking !== undefined) tor_data.append('skip_checking', skipChecking);
		if (rootFolder !== undefined) {
			tor_data.append('contentLayout', rootFolder ? 'Original' : 'NoSubfolder');
		}
		await XFetch.post(`${clientUrl}/api/v2/torrents/add`, tor_data);
	},
	trans: async () => {
		for (const url of torrentUrls) {
			await addTorrent(url, clientUrl, username, password, 'trans', path, category, tags, skipChecking, stopped, rootFolder);  // ADD rootFolder HERE
		}
	},
	flood: async () => {
		// ... existing code ...
		// No changes needed, just pass through
	},
	deluge: async () => {
		for (const url of torrentUrls) {
			await addTorrent(url, clientUrl, username, password, 'deluge', path, category, tags, skipChecking, stopped, rootFolder);  // ADD rootFolder HERE
		}
	},
	rutorrent: async () => {
		for (const url of torrentUrls) {
			await addTorrent(url, clientUrl, username, password, 'rutorrent', path, category, tags, skipChecking, stopped, rootFolder);  // ADD rootFolder HERE
		}
	}
};

await implementations[client]();
};

async function testClient(clientUrl, username, password, client) {
let clients = {
	trans: async () => {
	let headers = {
		Authorization: `Basic ${btoa(`${username}:${password}`)}`,
		'Content-Type': 'application/json',
		'X-Transmission-Session-Id': null
	};
	let res = await XFetch.post(`${clientUrl}/transmission/rpc`, null, headers);
	return res.raw.status !== 401;
	},
	qbit: async () => {
	let res = await XFetch.post(`${clientUrl}/api/v2/auth/login`, `username=${username}&password=${password}`, {
		'content-type': 'application/x-www-form-urlencoded', cookie: 'SID='
	});
	return (await res.text()) === 'Ok.';
	},
	deluge: async () => {
	let res = await XFetch.post(`${clientUrl}/json`, JSON.stringify({
		method: 'auth.login', params: [password], id: 0
	}), { 'content-type': 'application/json' });
	try {
		return (await res.json()).result === true;
	} catch (e) {
		return false;
	}
	},
	flood: async () => {
	let res = await XFetch.post(`${clientUrl}/api/auth/authenticate`, JSON.stringify({ password, username }), {
		'content-type': 'application/json'
	});
	try {
		return (await res.json()).success === true;
	} catch (e) {
		return false;
	}
	},
	rutorrent: async () => {
	let headers = { Authorization: `Basic ${btoa(`${username}:${password}`)}`, 'Content-Type': 'application/json' };
	let res = await XFetch.post(`${clientUrl}/rutorrent/php/addtorrent.php?json=1`, null, headers);
	return res.raw.status !== 401;
	}
};
return await clients[client]();
}

const getCategories = async (clientUrl, username, password) => {
await XFetch.post(`${clientUrl}/api/v2/auth/login`, `username=${username}&password=${password}`, {
	'content-type': 'application/x-www-form-urlencoded'
});
let res = await XFetch.get(`${clientUrl}/api/v2/torrents/categories`);
try {
	return Object.keys(await res.json());
} catch (_) {
	return [];
}
};

// ============================================================================
// UI STYLES
// ============================================================================
GM_addStyle(`
.stc-profile-container {
	background: #1a1a1a;
	border: 2px solid #444;
	border-radius: 6px;
	padding: 14px;
	margin: 15px 0;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
	isolation: isolate;
	
	/*prevent squish*/		
	min-height: fit-content;
	height: auto !important;
	flex-shrink: 0;
	box-sizing: border-box !important;
}
/*more prevent squish*/
.stc-profile-container * {
	box-sizing: border-box !important;
	flex-shrink: 0;
}

.stc-profile-select,
.stc-button,
.stc-send-all-button {
	min-height: fit-content;
	height: auto !important;
	flex-shrink: 0;
}
.stc-toast {
	position: fixed;
	top: 20px;
	right: 20px;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	color: white;
	padding: 16px 24px;
	border-radius: 8px;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
	z-index: 1000000;
	font-size: 14px;
	font-weight: 500;
	animation: slideInRight 0.3s ease-out;
	display: flex;
	align-items: center;
	gap: 10px;
}
.stc-toast.success {
	background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
}
.stc-toast.error {
	background: linear-gradient(135deg, #eb3349 0%, #f45c43 100%);
}
@keyframes slideInRight {
	from { transform: translateX(400px); opacity: 0; }
	to { transform: translateX(0); opacity: 1; }
}
@keyframes slideOutRight {
	from { transform: translateX(0); opacity: 1; }
	to { transform: translateX(400px); opacity: 0; }
}
.stc-toast.hiding {
	animation: slideOutRight 0.3s ease-in forwards;
}
.stc-modal-profile-selector {
	margin-bottom: 20px;
	padding-bottom: 15px;
	border-bottom: 1px solid #333;
}
.stc-confirm-dialog {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.85);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 1000000;
}
.stc-confirm-content {
	background: #1a1a1a;
	border: 1px solid #444;
	border-radius: 6px;
	padding: 24px;
	max-width: 400px;
	width: 90%;
	color: #fff;
}
.stc-confirm-title {
	font-size: 16px;
	font-weight: bold;
	margin-bottom: 12px;
	color: #fff;
}
.stc-confirm-message {
	font-size: 14px;
	margin-bottom: 20px;
	color: #ccc;
	line-height: 1.5;
}
.stc-confirm-buttons {
	display: flex;
	gap: 10px;
}
.stc-confirm-buttons .stc-btn {
	flex: 1;
}
.stc-profile-header {
	font-weight: bold;
	font-size: 13px;
	color: #fff;
	margin-bottom: 10px;
	text-align: center;
	border-bottom: 1px solid #333;
	padding-bottom: 8px;
}
.stc-profile-select {
	width: 100%;
	padding: 6px;
	background: #2a2a2a;
	color: #fff;
	border: 1px solid #444;
	border-radius: 3px;
	margin-bottom: 8px; !important;
	font-size: 12px;
	display: block; /* This helps ensure margin is respected */
	vertical-align: baseline !important; /* Override the page's vertical-align: middle */
}
.stc-profile-select option {
	background: #2a2a2a !important;
	background-color: #2a2a2a !important;
	color: #fff !important;
}
/* Add extra spacing after the select specifically */
.stc-profile-select + .stc-button-row {
	margin-top: 8px;
}
.stc-button-row {
	display: flex;
	gap: 8px;
	margin-bottom: 8px;
}
.stc-button {
	flex: 1;
	padding: 6px;
	background: #2a5a8f;
	color: #fff;
	border: 1px solid #3a6a9f;
	border-radius: 3px;
	cursor: pointer;
	font-size: 12px;
	text-align: center;
}
.stc-button:hover {
	background: #3a6a9f;
}
.stc-send-all-button {
	width: 100%;
	margin-top: 0;
	background: #2d5a2d !important;
	border-color: #3a9f6a !important;
}
.stc-send-all-button:hover {
	background: #3d6a3d !important;
}
.stc-modal {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.8);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 999999;
}
.stc-modal-content {
	background: #1a1a1a;
	border: 1px solid #444;
	border-radius: 6px;
	padding: 20px;
	max-width: 500px;
	width: 90%;
	max-height: 80vh;
	overflow-y: auto;
	color: #fff;
}
.stc-modal-title {
	font-size: 18px;
	font-weight: bold;
	margin-bottom: 20px;
	text-align: center;
	color: #fff;
}
.stc-form-group {
	margin-bottom: 15px;
}
.stc-form-label {
	display: block;
	margin-bottom: 5px;
	font-size: 13px;
	color: #ccc;
}
.stc-form-input, .stc-form-select {
	width: 100%;
	padding: 8px;
	background: #2a2a2a;
	color: #fff;
	border: 1px solid #444;
	border-radius: 3px;
	font-size: 13px;
	box-sizing: border-box;
}
.stc-form-input:disabled, .stc-form-select:disabled {
	opacity: 0.5;
	cursor: not-allowed;
}
.stc-form-checkbox {
	margin-right: 8px;
}
.stc-button-group {
	display: flex;
	gap: 10px;
	margin-top: 20px;
	flex-wrap: wrap;
}
.stc-btn {
	flex: 1;
	padding: 10px;
	border: none;
	border-radius: 3px;
	cursor: pointer;
	font-size: 13px;
	font-weight: bold;
	min-width: 80px;
}
.stc-btn-primary {
	background: #2a5a8f;
	color: #fff;
}
.stc-btn-primary:hover {
	background: #3a6a9f;
}
.stc-btn-secondary {
	background: #444;
	color: #fff;
}
.stc-btn-secondary:hover {
	background: #555;
}
.stc-btn-danger {
	background: #8f2a2a;
	color: #fff;
}
.stc-btn-danger:hover {
	background: #9f3a3a;
}
.stc-error-message {
	color: #ff6b6b;
	font-size: 12px;
	margin-top: 10px;
	text-align: center;
}
.stc-success-message {
	color: #51cf66;
	font-size: 12px;
	margin-top: 10px;
	text-align: center;
}
.stc-inline-button-group {
	display: flex;
	gap: 8px;
	align-items: flex-end;
}
.stc-inline-button-group > div:first-child {
	flex: 1;
}
.stc-inline-btn {
	padding: 8px 12px;
	background: #444;
	color: #fff;
	border: 1px solid #555;
	border-radius: 3px;
	cursor: pointer;
	font-size: 12px;
	white-space: nowrap;
}
.stc-inline-btn:hover {
	background: #555;
}
.stc-profile-modal {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.8);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 999999;
}
.stc-profile-modal-content {
	background: #1a1a1a;
	border: 2px solid #444;
	border-radius: 6px;
	padding: 20px;
	max-width: 400px;
	width: 90%;
	color: #fff;
}
.stc-profile-modal-title {
	font-size: 16px;
	font-weight: bold;
	margin-bottom: 15px;
	text-align: center;
	color: #fff;
}
.stc-profile-modal-close {
	width: 100%;
	margin-top: 15px;
	padding: 10px;
	background: #444;
	color: #fff;
	border: 1px solid #555;
	border-radius: 3px;
	cursor: pointer;
	font-size: 13px;
	font-weight: bold;
}
.stc-profile-modal-close:hover {
	background: #555;
}
`);

// END OF PART 2 OF 5
// PART 3 OF 5 - CONTINUE FROM PART 2

// ============================================================================
// UI COMPONENTS
// ============================================================================
function createProfileSelector() {
const container = document.createElement('div');
container.className = 'stc-profile-container';

const header = document.createElement('div');
header.className = 'stc-profile-header';
header.textContent = 'SendToClient Profile';

const select = document.createElement('select');
select.className = 'stc-profile-select';
select.id = 'stc-profile-dropdown';

const buttonRow = document.createElement('div');
buttonRow.className = 'stc-button-row';

const editBtn = document.createElement('button');
editBtn.className = 'stc-button';
editBtn.textContent = 'Edit Profile';
editBtn.onclick = () => openProfileModal(profileManager.currentProfile?.id);

const addBtn = document.createElement('button');
addBtn.className = 'stc-button';
addBtn.textContent = 'Add Profile';
addBtn.onclick = () => openProfileModal();

buttonRow.appendChild(editBtn);
buttonRow.appendChild(addBtn);

const sendAllBtn = document.createElement('button');
sendAllBtn.className = 'stc-button stc-send-all-button';
sendAllBtn.textContent = 'Send All Visible';
sendAllBtn.onclick = async () => await sendAllTorrents();

container.appendChild(header);
container.appendChild(select);
container.appendChild(buttonRow);
container.appendChild(sendAllBtn);

return container;
}

async function updateProfileDropdown() {
	const selects = document.querySelectorAll('#stc-profile-dropdown');
	if (selects.length === 0) return;

	const profiles = await profileManager.getAllProfiles();

	selects.forEach(select => {
		select.innerHTML = '';

		profiles.forEach(profile => {
			const option = document.createElement('option');
			option.value = profile.id;
			option.textContent = profile.name;
			if (profileManager.currentProfile && profile.id === profileManager.currentProfile.id) {
				option.selected = true;
			}
			select.appendChild(option);
		});

		select.onchange = async (e) => {
			await profileManager.setCurrentProfile(parseInt(e.target.value));
		};
	});
}

// ADD THIS: Listen for profile changes and update all dropdowns
window.addEventListener('profileChanged', async () => {
	await updateProfileDropdown();
});

// Function to send all torrents
async function sendAllTorrents() {
	if (!profileManager.currentProfile) {
		alert('No profile selected');
		return;
	}

	const client = await profileManager.currentProfile.getClient();
	if (!client) {
		alert('Client not found. Please configure this profile.');
		openProfileModal(profileManager.currentProfile.id);
		return;
	}

	// Collect all torrent URLs from data attributes, filtering out hidden elements
	const urls = [];
	document.querySelectorAll('a.sendtoclient').forEach(btn => {
		// Check if element or any parent is hidden
		let element = btn;
		let isVisible = true;
		
		while (element && element !== document.body) {
			const style = window.getComputedStyle(element);
			if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
				isVisible = false;
				break;
			}
			element = element.parentElement;
		}
		
		if (isVisible) {
			const url = btn.dataset.torrentUrl;
			if (url) {
				urls.push(url);
			}
		}
	});

	if (urls.length === 0) {
		alert('No visible torrents found on this page');
		return;
	}

	if (!confirm(`Send ${urls.length} torrent${urls.length > 1 ? 's' : ''} to ${profileManager.currentProfile.name}?`)) {
		return;
	}

	try {
		await addTorrentBatch(
			urls,
			client.host,
			client.username,
			client.password,
			client.type,
			profileManager.currentProfile.saveLocation,
			profileManager.currentProfile.category,
			profileManager.currentProfile.tags,
			profileManager.currentProfile.skipChecking,
			profileManager.currentProfile.stopped,
			profileManager.currentProfile.rootFolder
		);
		alert(`Successfully sent ${urls.length} torrent${urls.length > 1 ? 's' : ''}!`);
	} catch (error) {
		console.error('Error sending torrents:', error);
		alert('Failed to send some torrents. Check console for details.');
	}
}

// ============================================================================
// TOAST NOTIFICATION
// ============================================================================
function showToast(message, type = 'success') {
	const toast = document.createElement('div');
	toast.className = `stc-toast ${type}`;
	toast.innerHTML = `
		<span>${type === 'success' ? '✓' : '✕'}</span>
		<span>${message}</span>
	`;
	document.body.appendChild(toast);
	
	setTimeout(() => {
		toast.classList.add('hiding');
		setTimeout(() => document.body.removeChild(toast), 300);
	}, 3000);
}

// ============================================================================
// CONFIRM DIALOG
// ============================================================================
function showConfirmDialog(title, message, buttons) {
	return new Promise((resolve) => {
		const dialog = document.createElement('div');
		dialog.className = 'stc-confirm-dialog';
		
		const content = document.createElement('div');
		content.className = 'stc-confirm-content';
		content.onclick = (e) => e.stopPropagation();
		
		content.innerHTML = `
			<div class="stc-confirm-title">${title}</div>
			<div class="stc-confirm-message">${message}</div>
			<div class="stc-confirm-buttons"></div>
		`;
		
		const buttonsContainer = content.querySelector('.stc-confirm-buttons');
		
		buttons.forEach(btn => {
			const button = document.createElement('button');
			button.className = `stc-btn ${btn.className || 'stc-btn-secondary'}`;
			button.textContent = btn.text;
			button.onclick = () => {
				document.body.removeChild(dialog);
				resolve(btn.value);
			};
			buttonsContainer.appendChild(button);
		});
		
		dialog.appendChild(content);
		document.body.appendChild(dialog);
	});
}

// ============================================================================
// PROFILE MODAL - COMPLETELY REPLACE YOUR EXISTING openProfileModal FUNCTION
// ============================================================================
function openProfileModal(profileId = null) {
	let currentProfileId = profileId !== null && profileId !== undefined ? profileId : null;
	let isAddMode = currentProfileId === null;
	let initialState = null;

	const modal = document.createElement('div');
	modal.className = 'stc-modal';

	const content = document.createElement('div');
	content.className = 'stc-modal-content';
	content.onclick = (e) => e.stopPropagation();

	content.innerHTML = `
		<div class="stc-modal-title" id="modal-title">${isAddMode ? 'Add Profile' : 'Edit Profile'}</div>
		<div class="stc-modal-profile-selector">
			<label class="stc-form-label">Select Profile:</label>
			<select class="stc-form-select" id="profile-selector"></select>
		</div>
		<div class="stc-form-group">
			<label class="stc-form-label">Profile Name:</label>
			<input class="stc-form-input" type="text" id="profile-name">
		</div>
		<div class="stc-form-group">
			<label class="stc-form-label">Client:</label>
			<div class="stc-inline-button-group">
				<div><select class="stc-form-select" id="profile-client"></select></div>
				<button class="stc-inline-btn" id="manage-clients-btn">Manage Clients</button>
			</div>
		</div>
		<div class="stc-form-group">
			<label class="stc-form-label">Save Location:</label>
			<input class="stc-form-input" type="text" id="profile-location">
		</div>
		<div class="stc-form-group" id="category-group">
			<label class="stc-form-label">Category:</label>
			<input class="stc-form-input" type="text" id="profile-category">
		</div>
		<div class="stc-form-group" id="tags-group">
			<label class="stc-form-label">Tags:</label>
			<input class="stc-form-input" type="text" id="profile-tags">
		</div>
		<div class="stc-form-group" id="skipChecking-group">
			<label class="stc-form-label">
				<input class="stc-form-checkbox" type="checkbox" id="profile-skipChecking">
				Skip Checking
			</label>
		</div>
		<div class="stc-form-group" id="stopped-group">
			<label class="stc-form-label">
				<input class="stc-form-checkbox" type="checkbox" id="profile-stopped">
				Send to client in Paused State
			</label>
		</div>
		<div class="stc-form-group" id="rootFolder-group">
			<label class="stc-form-label">
				<input class="stc-form-checkbox" type="checkbox" id="profile-rootFolder">
				Create Subfolder
			</label>
		</div>
		<div class="stc-error-message" id="profile-error"></div>
		<div class="stc-button-group">
			<button class="stc-btn stc-btn-primary" id="save-profile-btn">Save</button>
			<button class="stc-btn stc-btn-primary" id="apply-profile-btn">Apply</button>
			<button class="stc-btn stc-btn-secondary" id="cancel-profile-btn">Close</button>
			<button class="stc-btn stc-btn-danger" id="delete-profile-btn" style="display: ${isAddMode ? 'none' : 'block'};">Delete</button>
		</div>
	`;

	modal.appendChild(content);
	document.body.appendChild(modal);

	const profileSelector = content.querySelector('#profile-selector');
	const modalTitle = content.querySelector('#modal-title');
	const clientSelect = content.querySelector('#profile-client');
	const manageBtn = content.querySelector('#manage-clients-btn');
	const saveBtn = content.querySelector('#save-profile-btn');
	const applyBtn = content.querySelector('#apply-profile-btn');
	const cancelBtn = content.querySelector('#cancel-profile-btn');
	const deleteBtn = content.querySelector('#delete-profile-btn');

	// Get current form state
	function getCurrentState() {
		return {
			name: content.querySelector('#profile-name').value.trim(),
			clientId: content.querySelector('#profile-client').value,
			saveLocation: content.querySelector('#profile-location').value.trim(),
			category: content.querySelector('#profile-category').value.trim(),
			tags: content.querySelector('#profile-tags').value.trim(),
			skipChecking: content.querySelector('#profile-skipChecking').checked,
			stopped: content.querySelector('#profile-stopped').checked,
			rootFolder: content.querySelector('#profile-rootFolder').checked
		};
	}

	// Check for unsaved changes
	function hasUnsavedChanges() {
		if (!initialState) return false;
		const current = getCurrentState();
		return JSON.stringify(current) !== JSON.stringify(initialState);
	}

	// Load profile selector dropdown
	async function loadProfileSelector() {
		const profiles = await profileManager.getAllProfiles();
		profileSelector.innerHTML = '';
		
		profiles.forEach(profile => {
			const option = document.createElement('option');
			option.value = profile.id;
			option.textContent = profile.name;
			if (profile.id === currentProfileId) {
				option.selected = true;
			}
			profileSelector.appendChild(option);
		});
		
		const addOption = document.createElement('option');
		addOption.value = 'ADD_NEW';
		addOption.textContent = '+ Add Profile';
		if (isAddMode) {
			addOption.selected = true;
		}
		profileSelector.appendChild(addOption);
	}

	// Load profile data into form
	async function loadProfileIntoForm(profileId) {
		const profile = await profileManager.getProfile(profileId);
		if (!profile) return;

		content.querySelector('#profile-name').value = profile.name;
		content.querySelector('#profile-client').value = profile.clientId;
		content.querySelector('#profile-location').value = profile.saveLocation;
		content.querySelector('#profile-category').value = profile.category;
		content.querySelector('#profile-tags').value = profile.tags;
		content.querySelector('#profile-skipChecking').checked = profile.skipChecking;
		content.querySelector('#profile-stopped').checked = profile.stopped;
		content.querySelector('#profile-rootFolder').checked = profile.rootFolder !== undefined ? profile.rootFolder : true;
		
		updateProfileFieldsVisibility(clientSelect);
		initialState = getCurrentState();
	}

	// Switch to add mode (keeps field values except name)
	function switchToAddMode() {
		isAddMode = true;
		currentProfileId = null;
		modalTitle.textContent = 'Add Profile';
		deleteBtn.style.display = 'none';
		
		content.querySelector('#profile-name').value = '';
		content.querySelector('#profile-rootFolder').checked = true;
		
		initialState = getCurrentState();
	}

	// Switch to edit mode
	async function switchToEditMode(profileId) {
		isAddMode = false;
		currentProfileId = profileId;
		modalTitle.textContent = 'Edit Profile';
		deleteBtn.style.display = 'block';
		
		await loadProfileIntoForm(profileId);
	}

	// Handle profile selector change
	profileSelector.onchange = async () => {
		const selectedValue = profileSelector.value;
		
		if (hasUnsavedChanges()) {
			const result = await showConfirmDialog(
				'Unsaved Changes',
				'You have unsaved changes. What would you like to do?',
				[
					{ text: 'Save Changes', value: 'save', className: 'stc-btn-primary' },
					{ text: 'Discard Changes', value: 'discard', className: 'stc-btn-danger' },
					{ text: 'Cancel', value: 'cancel', className: 'stc-btn-secondary' }
				]
			);
			
			if (result === 'cancel') {
				if (isAddMode) {
					profileSelector.value = 'ADD_NEW';
				} else {
					profileSelector.value = currentProfileId;
				}
				return;
			}
			
			if (result === 'save') {
				const saved = await saveCurrentProfile(false);
				if (!saved) {
					if (isAddMode) {
						profileSelector.value = 'ADD_NEW';
					} else {
						profileSelector.value = currentProfileId;
					}
					return;
				}
			}
		}
		
		if (selectedValue === 'ADD_NEW') {
			switchToAddMode();
		} else {
			await switchToEditMode(parseInt(selectedValue));
		}
	};

	// Handle modal close
	modal.onclick = async (e) => {
		if (e.target === modal) {
			if (hasUnsavedChanges()) {
				const result = await showConfirmDialog(
					'Unsaved Changes',
					'You have unsaved changes. What would you like to do?',
					[
						{ text: 'Save Changes', value: 'save', className: 'stc-btn-primary' },
						{ text: 'Discard Changes', value: 'discard', className: 'stc-btn-danger' },
						{ text: 'Cancel', value: 'cancel', className: 'stc-btn-secondary' }
					]
				);
				
				if (result === 'cancel') return;
				
				if (result === 'save') {
					const saved = await saveCurrentProfile(true);
					if (!saved) return;
				}
			}
			document.body.removeChild(modal);
		}
	};

	// Save current profile
	async function saveCurrentProfile(closeModal) {
		const errorMsg = content.querySelector('#profile-error');
		errorMsg.textContent = '';

		const name = content.querySelector('#profile-name').value.trim();
		const clientId = content.querySelector('#profile-client').value;
		const saveLocation = content.querySelector('#profile-location').value.trim();
		const category = content.querySelector('#profile-category').value.trim();
		const tags = content.querySelector('#profile-tags').value.trim();
		const skipChecking = content.querySelector('#profile-skipChecking').checked;
		const stopped = content.querySelector('#profile-stopped').checked;
		const rootFolder = content.querySelector('#profile-rootFolder').checked;

		if (!name) {
			errorMsg.textContent = 'Profile name is required';
			return false;
		}

		if (!clientId) {
			errorMsg.textContent = 'Please select a client or create one';
			return false;
		}

		const client = await clientManager.getClient(parseInt(clientId));
		if (!client) {
			errorMsg.textContent = 'Selected client does not exist. Please create or select a valid client.';
			return false;
		}

		const id = currentProfileId !== null ? currentProfileId : await storageManager.getNextProfileId();

		await storageManager.setProfile(id, { name, clientId: parseInt(clientId), saveLocation, category, tags, skipChecking, stopped, rootFolder });

		if (isAddMode) {
			currentProfileId = id;
			isAddMode = false;
			modalTitle.textContent = 'Edit Profile';
			deleteBtn.style.display = 'block';
			await loadProfileSelector();
			profileSelector.value = id;
		} else {
			await loadProfileSelector();
			profileSelector.value = id;
		}

		await updateProfileDropdown();

		if (profileManager.currentProfile && profileManager.currentProfile.id === id) {
			await profileManager.setCurrentProfile(id);
		}

		initialState = getCurrentState();

		if (closeModal) {
			document.body.removeChild(modal);
		} else {
			showToast('Profile saved successfully!', 'success');
		}

		return true;
	}

	manageBtn.onclick = () => openClientModal(modal, clientSelect);
	saveBtn.onclick = async () => await saveCurrentProfile(true);
	applyBtn.onclick = async () => await saveCurrentProfile(false);
	
	cancelBtn.onclick = async () => {
		if (hasUnsavedChanges()) {
			const result = await showConfirmDialog(
				'Unsaved Changes',
				'You have unsaved changes. What would you like to do?',
				[
					{ text: 'Save Changes', value: 'save', className: 'stc-btn-primary' },
					{ text: 'Discard Changes', value: 'discard', className: 'stc-btn-danger' },
					{ text: 'Cancel', value: 'cancel', className: 'stc-btn-secondary' }
				]
			);
			
			if (result === 'cancel') return;
			
			if (result === 'save') {
				const saved = await saveCurrentProfile(true);
				if (!saved) return;
				return;
			}
		}
		document.body.removeChild(modal);
	};

	deleteBtn.onclick = async () => {
		if (confirm('Are you sure you want to delete this profile?')) {
			await storageManager.deleteProfile(currentProfileId);
			document.body.removeChild(modal);
			await updateProfileDropdown();
			await profileManager.init();
		}
	};

	// Initialize
	loadClientsIntoSelect(clientSelect).then(async () => {
		clientSelect.onchange = () => updateProfileFieldsVisibility(clientSelect);
		await loadProfileSelector();
		
		if (!isAddMode) {
			await loadProfileIntoForm(currentProfileId);
		} else {
			initialState = getCurrentState();
		}
		
		updateProfileFieldsVisibility(clientSelect);
	});
}

async function loadClientsIntoSelect(selectElement) {
const clients = await clientManager.getAllClients();
selectElement.innerHTML = '';

if (clients.length === 0) {
	selectElement.innerHTML = '<option value="">No clients available</option>';
	return;
}

clients.forEach(client => {
	const option = document.createElement('option');
	option.value = client.id;
	option.textContent = client.name;
	selectElement.appendChild(option);
});
}

function updateProfileFieldsVisibility(clientSelect) {
const clientId = clientSelect.value;
const modal = clientSelect.closest('.stc-modal-content');

if (!clientId) {
	['category-group', 'tags-group', 'skipChecking-group', 'stopped-group', 'rootFolder-group'].forEach(id => {
	modal.querySelector(`#${id}`).style.display = 'none';
	});
	return;
}

clientManager.getClient(parseInt(clientId)).then(client => {
	if (!client) return;

	const caps = CLIENT_CAPABILITIES[client.type];

	modal.querySelector('#category-group').style.display = caps.supportsCategories ? 'block' : 'none';
	modal.querySelector('#profile-category').disabled = !caps.supportsCategories;

	modal.querySelector('#tags-group').style.display = caps.supportsTags ? 'block' : 'none';
	modal.querySelector('#profile-tags').disabled = !caps.supportsTags;

	modal.querySelector('#skipChecking-group').style.display = caps.supportsSkipChecking ? 'block' : 'none';
	modal.querySelector('#profile-skipChecking').disabled = !caps.supportsSkipChecking;

	modal.querySelector('#stopped-group').style.display = caps.supportsStopped ? 'block' : 'none';
	modal.querySelector('#profile-stopped').disabled = !caps.supportsStopped;
	
	modal.querySelector('#rootFolder-group').style.display = caps.supportsRootFolder ? 'block' : 'none';
	modal.querySelector('#profile-rootFolder').disabled = !caps.supportsRootFolder;
});
}

// END OF PART 3 OF 5
// PART 4 OF 5 - CONTINUE FROM PART 3

// ============================================================================
// CLIENT MODAL
// ============================================================================
function openClientModal(parentModal, clientSelectToUpdate) {
const modal = document.createElement('div');
modal.className = 'stc-modal';
modal.onclick = (e) => {
	if (e.target === modal) {
	document.body.removeChild(modal);
	}
};

const content = document.createElement('div');
content.className = 'stc-modal-content';
content.onclick = (e) => e.stopPropagation();

content.innerHTML = `
	<div class="stc-modal-title">Manage Clients</div>
	<div id="client-list" style="margin-bottom: 20px;"></div>
	<button class="stc-btn stc-btn-primary" id="add-client-btn">Add New Client</button>
	<button class="stc-btn stc-btn-secondary" id="close-clients-btn" style="margin-top: 10px;">Close</button>
`;

modal.appendChild(content);
document.body.appendChild(modal);

const listContainer = content.querySelector('#client-list');
const addBtn = content.querySelector('#add-client-btn');
const closeBtn = content.querySelector('#close-clients-btn');

addBtn.onclick = () => openClientEditModal(modal, null, listContainer, clientSelectToUpdate);
closeBtn.onclick = () => document.body.removeChild(modal);

loadClientList(listContainer, modal, clientSelectToUpdate);
}

async function loadClientList(container, parentModal, clientSelectToUpdate) {
container.innerHTML = '';
const clients = await clientManager.getAllClients();

if (clients.length === 0) {
	container.innerHTML = '<div style="text-align: center; color: #999; padding: 20px;">No clients configured</div>';
	return;
}

clients.forEach(client => {
	const item = document.createElement('div');
	item.style.cssText = 'background: #2a2a2a; padding: 10px; margin-bottom: 10px; border-radius: 3px; display: flex; justify-content: space-between; align-items: center;';

	item.innerHTML = `
	<div>
		<strong>${client.name}</strong><br>
		<span style="color: #999; font-size: 11px;">${client.type} - ${client.host}</span>
	</div>
	<div style="display: flex; gap: 5px;">
		<button class="stc-inline-btn edit-client-btn" data-id="${client.id}">Edit</button>
		<button class="stc-inline-btn delete-client-btn" data-id="${client.id}" style="background: #8f2a2a;">Delete</button>
	</div>
	`;

	container.appendChild(item);
});

container.querySelectorAll('.edit-client-btn').forEach(btn => {
	btn.onclick = () => openClientEditModal(parentModal, parseInt(btn.dataset.id), container, clientSelectToUpdate);
});

container.querySelectorAll('.delete-client-btn').forEach(btn => {
	btn.onclick = async () => {
	const clientId = parseInt(btn.dataset.id);
	const client = await clientManager.getClient(clientId);
	if (confirm(`Are you sure you want to delete client "${client.name}"?`)) {
		await storageManager.deleteClient(clientId);
		await loadClientList(container, parentModal, clientSelectToUpdate);
		if (clientSelectToUpdate) await loadClientsIntoSelect(clientSelectToUpdate);
	}
	};
});
}

function openClientEditModal(parentModal, clientId, listContainer, clientSelectToUpdate) {
const isEdit = clientId !== null;
let initialState = null;

const modal = document.createElement('div');
modal.className = 'stc-modal';

// Function to get current form state
function getCurrentState() {
	return {
	name: content.querySelector('#client-name').value.trim(),
	type: typeSelect.value,
	host: content.querySelector('#client-host').value.trim(),
	username: content.querySelector('#client-username').value.trim(),
	password: content.querySelector('#client-password').value.trim()
	};
}

// Function to check if there are unsaved changes
function hasUnsavedChanges() {
	if (!initialState) return false;

	// For add modal, check if any meaningful data has been entered
	if (!isEdit) {
	const current = getCurrentState();
	return current.name !== '' ||
			current.host !== '' ||
			current.username !== '' ||
			current.password !== '';
	}

	// For edit modal, compare with initial state
	const current = getCurrentState();
	return JSON.stringify(current) !== JSON.stringify(initialState);
}

modal.onclick = (e) => {
	if (e.target === modal) {
	if (hasUnsavedChanges()) {
		if (confirm('You have unsaved changes. Are you sure you want to close?')) {
		document.body.removeChild(modal);
		}
	} else {
		document.body.removeChild(modal);
	}
	}
};

const content = document.createElement('div');
content.className = 'stc-modal-content';
content.onclick = (e) => e.stopPropagation();

content.innerHTML = `
	<div class="stc-modal-title">${isEdit ? 'Edit Client' : 'Add Client'}</div>
	<div class="stc-form-group">
	<label class="stc-form-label">Client Name:</label>
	<input class="stc-form-input" type="text" id="client-name">
	</div>
	<div class="stc-form-group">
	<label class="stc-form-label">Client Type:</label>
	<select class="stc-form-select" id="client-type">
		<option value="qbit">qBittorrent</option>
		<option value="deluge">Deluge</option>
		<option value="flood">Flood</option>
		<option value="trans">Transmission</option>
		<option value="rutorrent">ruTorrent</option>
	</select>
	</div>
	<div class="stc-form-group">
	<label class="stc-form-label">Host URL:</label>
	<input class="stc-form-input" type="text" id="client-host" placeholder="https://example.com:8080">
	</div>
	<div class="stc-form-group" id="username-group">
	<label class="stc-form-label">Username:</label>
	<input class="stc-form-input" type="text" id="client-username">
	</div>
	<div class="stc-form-group">
	<label class="stc-form-label">Password:</label>
	<input class="stc-form-input" type="password" id="client-password">
	</div>
	<div class="stc-button-group">
	<button class="stc-btn stc-btn-secondary" id="test-client-btn">Test Connection</button>
	</div>
	<div class="stc-error-message" id="client-error"></div>
	<div class="stc-button-group">
	<button class="stc-btn stc-btn-primary" id="save-client-btn">Save</button>
	<button class="stc-btn stc-btn-secondary" id="cancel-client-btn">Cancel</button>
	</div>
`;

modal.appendChild(content);
document.body.appendChild(modal);

const typeSelect = content.querySelector('#client-type');
const usernameGroup = content.querySelector('#username-group');
const testBtn = content.querySelector('#test-client-btn');
const saveBtn = content.querySelector('#save-client-btn');
const cancelBtn = content.querySelector('#cancel-client-btn');

typeSelect.onchange = () => {
	usernameGroup.style.display = typeSelect.value === 'deluge' ? 'none' : 'block';
};

testBtn.onclick = async () => {
	const host = content.querySelector('#client-host').value.trim();
	const username = content.querySelector('#client-username').value.trim();
	const password = content.querySelector('#client-password').value.trim();
	const type = typeSelect.value;

	if (!host || !password || (!username && type !== 'deluge')) {
	alert('Please fill in all required fields');
	return;
	}

	// Store original button state
	const originalText = testBtn.textContent;
	const originalBg = testBtn.style.background;

	// Disable button during test
	testBtn.disabled = true;
	testBtn.textContent = 'Testing...';

	const result = await testClient(host, username, password, type);

	// Flash green or red
	if (result) {
	testBtn.style.background = '#51cf66';
	testBtn.textContent = 'Success!';
	} else {
	testBtn.style.background = '#ff6b6b';
	testBtn.textContent = 'Failed!';
	}

	// Revert after 2 seconds
	setTimeout(() => {
	testBtn.style.background = originalBg;
	testBtn.textContent = originalText;
	testBtn.disabled = false;
	}, 2000);
};

saveBtn.onclick = async () => await saveClient(modal, clientId, listContainer, clientSelectToUpdate);
cancelBtn.onclick = () => {
	if (hasUnsavedChanges()) {
	if (confirm('You have unsaved changes. Are you sure you want to close?')) {
		document.body.removeChild(modal);
	}
	} else {
	document.body.removeChild(modal);
	}
};

if (isEdit) {
	clientManager.getClient(clientId).then(client => {
	if (client) {
		content.querySelector('#client-name').value = client.name;
		typeSelect.value = client.type;
		content.querySelector('#client-host').value = client.host;
		content.querySelector('#client-username').value = client.username;
		content.querySelector('#client-password').value = client.password;
		typeSelect.onchange();
		// Capture initial state after loading
		initialState = getCurrentState();
	}
	});
} else {
	typeSelect.onchange();
	// Capture initial empty state
	initialState = getCurrentState();
}
}

async function saveClient(modal, clientId, listContainer, clientSelectToUpdate) {
const content = modal.querySelector('.stc-modal-content');
const errorMsg = content.querySelector('#client-error');
errorMsg.textContent = '';

const name = content.querySelector('#client-name').value.trim();
const type = content.querySelector('#client-type').value;
const host = content.querySelector('#client-host').value.trim();
const username = content.querySelector('#client-username').value.trim();
const password = content.querySelector('#client-password').value.trim();

if (!name) {
	errorMsg.textContent = 'Client name is required';
	return;
}
if (!host) {
	errorMsg.textContent = 'Host URL is required';
	return;
}
if (!password) {
	errorMsg.textContent = 'Password is required';
	return;
}
if (type !== 'deluge' && !username) {
	errorMsg.textContent = 'Username is required for this client type';
	return;
}

const id = clientId !== null ? clientId : await storageManager.getNextClientId();

await storageManager.setClient(id, { name, type, host, username, password });

document.body.removeChild(modal);

if (listContainer) {
	const parentModal = listContainer.closest('.stc-modal');
	await loadClientList(listContainer, parentModal, clientSelectToUpdate);
}

if (clientSelectToUpdate) {
	await loadClientsIntoSelect(clientSelectToUpdate);
	clientSelectToUpdate.value = id;
	updateProfileFieldsVisibility(clientSelectToUpdate);
}
}

// END OF PART 4 OF 5
// PART 5 OF 5 - CONTINUE FROM PART 4 (FINAL PART)

// ============================================================================
// BUTTON COMPONENTS
// ============================================================================
const STBTN = ({ torrentUrl }) => {
const btn = document.createElement('a');
btn.href = '#';
btn.className = 'sendtoclient';
btn.textContent = 'ST';
btn.title = `Add to ${profileManager.currentProfile?.name || 'client'}`;
btn.dataset.torrentUrl = torrentUrl; // Store URL for batch collection
btn.onclick = async (e) => {
	e.preventDefault();

	if (!profileManager.currentProfile) {
	alert('No profile selected');
	return;
	}

	const client = await profileManager.currentProfile.getClient();
	if (!client) {
	alert('Client not found. Please configure this profile.');
	openProfileModal(profileManager.currentProfile.id);
	return;
	}

	try {
	await profileManager.currentProfile.addTorrent(torrentUrl);
	btn.textContent = 'Added!';
	btn.onclick = null;
	} catch (error) {
	console.error('Error adding torrent:', error);
	alert('Failed to add torrent. Check console for details.');
	}
};

return btn;
};

const FSTBTN = ({ flLink }) => {
	const btn = document.createElement('a');
	btn.href = '#';
	btn.className = 'sendtoclient';
	btn.textContent = 'FST';
	btn.title = `Freeleechize and add to ${profileManager.currentProfile?.name || 'client'}`;
	
	btn.onclick = async (e) => {
		e.preventDefault();

		if (!confirm('Are you sure you want to use a freeleech token here?')) return;

		if (!profileManager.currentProfile) {
			alert('No profile selected');
			return;
		}

		const client = await profileManager.currentProfile.getClient();
		if (!client) {
			alert('Client not found. Please configure this profile.');
			openProfileModal(profileManager.currentProfile.id);
			return;
		}

		try {
			// Extract the onclick attribute
			const onclickAttr = flLink.getAttribute('onclick');
			
			// Try GazelleGames-style (with FreeleechTorrent function)
			if (onclickAttr) {
				const match = onclickAttr.match(/FreeleechTorrent\((\d+),\s*'([^']+)'\)/);
				
				if (match) {
					// GazelleGames-style: two-step process
					const torrentId = match[1];
					const passKey = match[2];
					
					// Get authkey from page
					let authKey = null;
					const scriptEl = document.createElement('script');
					scriptEl.textContent = `
						window.__stc_authkey = typeof authkey !== 'undefined' ? authkey : null;
					`;
					document.head.appendChild(scriptEl);
					authKey = unsafeWindow.__stc_authkey;
					scriptEl.remove();
					
					if (!authKey) {
						alert('Could not find authkey on page');
						return;
					}
					
					// Step 1: Consume the freeleech token
					const tokenUrl = `${location.origin}/torrents.php?action=download&id=${torrentId}&authkey=${authKey}&torrent_pass=${passKey}&usetoken=1`;
					
					const tokenResponse = await new Promise((resolve, reject) => {
						GM.xmlHttpRequest({
							method: 'GET',
							url: tokenUrl,
							onload: resolve,
							onerror: reject
						});
					});
					
					// Check if token was successfully used
					if (tokenResponse.responseText !== 'success') {
						alert('Failed to use freeleech token: ' + tokenResponse.responseText);
						return;
					}
					
					// Step 2: Use the download URL WITHOUT usetoken
					const downloadUrl = `${location.origin}/torrents.php?action=download&id=${torrentId}&authkey=${authKey}&torrent_pass=${passKey}`;
					
					await profileManager.currentProfile.addTorrent(downloadUrl);
					btn.textContent = 'Added!';
					btn.onclick = null;
					return;
				}
			}
			
			// Fallback: Redacted-style (FL link href is the direct download URL with usetoken=1)
			const flHref = flLink.href;
			if (flHref && flHref !== '#' && flHref.includes('usetoken=1')) {
				// The FL link itself is already the complete freeleech download URL
				await profileManager.currentProfile.addTorrent(flHref);
				btn.textContent = 'Added!';
				btn.onclick = null;
				return;
			}
			
			// If we get here, we couldn't parse either format
			console.error('FL link onclick:', onclickAttr);
			console.error('FL link href:', flHref);
			alert('Could not parse FL link. Check console for details.');
			
		} catch (error) {
			console.error('Error adding freeleech torrent:', error);
			alert('Failed to add torrent. Check console for details.');
		}
	};

	return btn;
};

// ============================================================================
// SITE HANDLERS
// ============================================================================
const handlers = [
{
	name: 'Gazelle',
	matches: ["brokenstones.is", "phoenixproject.app", "gazellegames.net", "animebytes.tv", "orpheus.network", "passthepopcorn.me", "greatposterwall.com", "redacted.sh", "jpopsuki.eu", "tv-vault.me", "sugoimusic.me", "alpharatio.cc", "uhdbits.org", "morethantv.me", "empornium.is", "deepbassnine.com", "broadcasthe.net", "secret-cinema.pw"],
	run: async () => {
		for (const a of Array.from(document.querySelectorAll('a')).filter(a => a.innerText === 'DL' || a.title == 'Download Torrent')) {
			let parent = a.parentElement;
			let torrentUrl = a.href;
			let buttons = Array.from(parent.childNodes).filter(e => e.nodeName !== '#text');
			let fl = Array.from(parent.querySelectorAll('a')).find(a => a.innerText === 'FL');
			
			parent.innerHTML = '';
			
			const fragment = document.createDocumentFragment();
			fragment.appendChild(document.createTextNode('[ '));
			buttons.forEach((e, i) => {
				fragment.appendChild(e);
				if (i < buttons.length - 1) {
					fragment.appendChild(document.createTextNode(' | '));
				}
			});
			fragment.appendChild(document.createTextNode(' | '));
			fragment.appendChild(STBTN({ torrentUrl }));
			
			if (fl) {
				fragment.appendChild(document.createTextNode(' | '));
				fragment.appendChild(FSTBTN({ flLink: fl }));  // Pass the element, not fl.href
			}

			fragment.appendChild(document.createTextNode(' ]'));
			parent.appendChild(fragment);
		}

		window.addEventListener('profileChanged', () => {
			document.querySelectorAll('a.sendtoclient').forEach(e => {
				if (e.textContent === 'FST') {
					e.title = `Freeleechize and add to ${profileManager.currentProfile.name}`;
				} else {
					e.title = `Add to ${profileManager.currentProfile.name}`;
				}
			});
		});
	}
},
{
	name: 'BLU UNIT3D',
	matches: ["blutopia.cc", "aither.cc"],
	run: async () => {
	let rid = await fetch(Array.from(document.querySelectorAll('ul>li>a')).find(e => e.innerText === 'My Profile').href + '/rsskey/edit').then(e => e.text()).then(e => e.replaceAll(/\s/g, '').match(/name="current_rsskey"readonlytype="text"value="(.*?)">/)[1]);
	handlers.find(h => h.name === 'UNIT3D').run(rid);
	}
},
{
	name: 'F3NIX',
	matches: ["beyond-hd.me"],
	run: async (rid = null) => {
	if (!rid) {
		rid = await fetch(location.origin + '/settings/security/rsskey').then(e => e.text()).then(e => e.match(/class="beta-form-main" name="null" value="(.*?)" disabled>/)[1]);
	}
	const appendButton = () => {
		Array.from(document.querySelectorAll('a[title="Download Torrent"]')).forEach(a => {
		let parent = a.parentElement;
		let torrentUrl = `${a.href.replace('/download/', '/torrent/download/')}.${rid}`;
		parent.appendChild(document.createTextNode(' '));
		parent.appendChild(STBTN({ torrentUrl }));
		});
	};
	appendButton();
	let oldPushState = unsafeWindow.history.pushState;
	unsafeWindow.history.pushState = function () {
		console.log('[SendToClient] Detected a soft navigation');
		appendButton();
		return oldPushState.apply(this, arguments);
	};
	}
},
{
	name: 'UNIT3D',
	matches: ["desitorrents.tv", "telly.wtf"],
	run: async (rid = null) => {
	if (!rid) {
		rid = await fetch(Array.from(document.querySelectorAll('ul>li>a')).find(e => e.innerText.includes('My Profile')).href + '/settings/security').then(e => e.text()).then(e => e.match(/ current_rid">(.*?)</)[1]);
	}
	const appendButton = () => {
		Array.from(document.querySelectorAll('a[title="Download"]')).concat(Array.from(document.querySelectorAll('button[title="Download"], button[data-original-title="Download"]')).map(e => e.parentElement)).forEach(a => {
		let parent = a.parentElement;
		let torrentUrl = a.href.replace('/torrents/', '/torrent/') + `.${rid}`;
		parent.appendChild(STBTN({ torrentUrl }));
		});
	};
	appendButton();
	console.log('[SendToClient] Bypassing CSP so we can listen for soft navigations.');
	document.addEventListener('popstate', () => {
		console.log('[SendToClient] Detected a soft navigation');
		appendButton();
	});
	document.addEventListener('securitypolicyviolation', e => {
		const nonce = e.originalPolicy.match(/nonce-(.*?)'/)[1];
		let actualScript = document.createElement('script');
		actualScript.nonce = nonce;
		actualScript.textContent = `
		console.log('[SendToClient] Adding a navigation listener.');
		(() => {
			let oldPushState = history.pushState;
			history.pushState = function pushState() {
			let ret = oldPushState.apply(this, arguments);
			document.dispatchEvent(new Event('popstate'));
			return ret;
			};
		})();
		`;
		document.head.appendChild(actualScript);
		actualScript.remove();
	});
	let triggerScript = document.createElement('script');
	triggerScript.nonce = 'nonce-123';
	triggerScript.textContent = 'window.csp = "csp :(";';
	document.head.appendChild(triggerScript);
	triggerScript.remove();
	}
},
{
	name: 'Karagarga',
	matches: ["karagarga.in"],
	run: async () => {
	if (unsafeWindow.location.href.includes('details.php')) {
		let dl_btn = document.querySelector('a.index');
		let torrent_uri = dl_btn.href;
		const span = document.createElement('span');
		span.appendChild(document.createTextNode('  '));
		span.appendChild(STBTN({ torrentUrl: torrent_uri }));
		dl_btn.insertAdjacentElement('afterend', span);
		return;
	}
	document.querySelectorAll("img[alt='Download']").forEach(e => {
		let parent = e.parentElement;
		let torrent_uri = e.parentElement.href;
		let container = parent.parentElement;
		container.appendChild(STBTN({ torrentUrl: torrent_uri }));
	});
	}
},
{
	name: 'TorrentLeech',
	matches: ["torrentleech.org", "www.torrentleech.org"],
	run: async () => {
	const username = document.querySelector('span.link').getAttribute('onclick').match('/profile/(.*?)/view')[1];
	let rid = await fetch(`/profile/${username}/edit`).then(e => e.text()).then(e => e.replaceAll(/\s/g, '').match(/rss.torrentleech.org\/(.*?)\</)[1]);

	GM_addStyle(`td.td-quick-download { display: flex; }`);

	for (const a of document.querySelectorAll('a.download')) {
		let torrent_uri = a.href.match(/\/download\/(\d*?)\/(.*?)$/);
		torrent_uri = `https://torrentleech.org/rss/download/${torrent_uri[1]}/${rid}/${torrent_uri[2]}`;
		a.parentElement.appendChild(STBTN({ torrentUrl: torrent_uri }));
	}
	}
},
{
	name: 'HDBits',
	matches: ["hdbits.org"],
	run: async () => {
		// Find all download links
		document.querySelectorAll('a.js-download').forEach(downloadLink => {
			const torrentUrl = downloadLink.href;
			
			// Create ST button using the standard component
			const stcBtn = STBTN({ torrentUrl });
			
			// Always add spacing before the ST button to match the page style
			const spacingBefore = document.createTextNode('\u00A0\u00A0');
			
			// Insert spacing and then the ST button after the download link
			downloadLink.parentNode.insertBefore(spacingBefore, downloadLink.nextSibling);
			downloadLink.parentNode.insertBefore(stcBtn, spacingBefore.nextSibling);
		});

		// Update button titles when profile changes
		window.addEventListener('profileChanged', () => {
			document.querySelectorAll('a.sendtoclient').forEach(btn => {
				if (!btn.textContent.includes('Added')) {
					btn.title = `Add to ${profileManager.currentProfile.name}`;
				}
			});
		});
	}
},
{
	name: 'Nyaa',
	matches: ["nyaa.si"],
	run: async () => {
		// Add ST buttons to each torrent row
		document.querySelectorAll('td.text-center').forEach(td => {
			const downloadLink = td.querySelector('a[href^="/download/"]');
			const magnetLink = td.querySelector('a[href^="magnet:"]');
			
			if (downloadLink && magnetLink) {
				const torrentUrl = location.origin + downloadLink.getAttribute('href');
				
				const stcLink = document.createElement('a');
				stcLink.href = '#';
				stcLink.className = 'sendtoclient';
				stcLink.textContent = '⤵️';
				stcLink.title = `Add to ${profileManager.currentProfile?.name || 'client'}`;
				stcLink.dataset.torrentUrl = torrentUrl;
				
				stcLink.onclick = async (e) => {
					e.preventDefault();
					
					if (!profileManager.currentProfile) {
						alert('No profile selected');
						return;
					}
					
					const client = await profileManager.currentProfile.getClient();
					if (!client) {
						alert('Client not found. Please configure this profile.');
						openProfileModal(profileManager.currentProfile.id);
						return;
					}
					
					try {
						await profileManager.currentProfile.addTorrent(torrentUrl);
						stcLink.classList.add('added');
						stcLink.title = 'Added!';
					} catch (error) {
						console.error('Failed to add torrent:', error);
						alert('Failed to add torrent. Check console for details.');
					}
				};
				
				td.appendChild(stcLink);
			}
		});

		// Update button titles when profile changes
		window.addEventListener('profileChanged', () => {
			document.querySelectorAll('a.sendtoclient.hdbits-style').forEach(link => {
				const profileName = profileManager.currentProfile.name;
				if (!link.classList.contains('added')) {
					link.title = `Add to ${profileName}`;
				}
			});
		});
	}
},
{
	name: 'AnilistBytes',
	matches: ["anilist.co"],
	run: async () => {
	unsafeWindow._addTo = async torrentUrl => profileManager.currentProfile.addTorrent(torrentUrl);
	}
}
];

// ============================================================================
// INSERTION LOGIC
// ============================================================================
function insertProfileSelector() {
const hostname = location.hostname;
const configs = INSERTION_POINTS[hostname];

if (!configs || configs.length === 0) return;

let insertionCount = 0;

// Try each configured insertion point
configs.forEach((config, index) => {
	const target = document.querySelector(config.targetSelector);
	if (!target) {
	console.log(`[SendToClient] Insertion point ${index + 1} not found: ${config.targetSelector}`);
	return;
	}

	const profileSelector = createProfileSelector();

	if (config.position === 'beforebegin') {
	target.insertAdjacentElement('beforebegin', profileSelector);
	} else if (config.position === 'afterend') {
	target.insertAdjacentElement('afterend', profileSelector);
	}

	insertionCount++;
	console.log(`[SendToClient] Inserted profile selector at: ${config.targetSelector}`);
});

if (insertionCount > 0) {
	updateProfileDropdown();
} else {
	console.warn(`[SendToClient] No valid insertion points found for ${hostname}`);
}
}

// ============================================================================
// PROFILE SELECTION MODAL
// ============================================================================
// ============================================================================
// PROFILE SELECTION MODAL
// ============================================================================
async function openProfileSelectionModal() {
	const modal = document.createElement('div');
	modal.className = 'stc-profile-modal';
	
	const content = document.createElement('div');
	content.className = 'stc-profile-modal-content';
	content.onclick = (e) => e.stopPropagation();
	
	const title = document.createElement('div');
	title.className = 'stc-profile-modal-title';
	title.textContent = 'Select Profile for Site';
	
	const profileContainer = createProfileSelector();
	profileContainer.style.margin = '0';
	profileContainer.style.padding = '0';
	profileContainer.style.border = 'none';
	profileContainer.style.boxShadow = 'none';
	profileContainer.style.background = 'transparent';
	
	const closeBtn = document.createElement('button');
	closeBtn.className = 'stc-profile-modal-close';
	closeBtn.textContent = 'Close';
	closeBtn.onclick = () => document.body.removeChild(modal);
	
	content.appendChild(title);
	content.appendChild(profileContainer);
	content.appendChild(closeBtn);
	modal.appendChild(content);
	
	// Populate the dropdown from storage
	const modalDropdown = profileContainer.querySelector('#stc-profile-dropdown');
	if (modalDropdown) {
		const profiles = await profileManager.getAllProfiles();
		modalDropdown.innerHTML = '';
		
		profiles.forEach(profile => {
			const option = document.createElement('option');
			option.value = profile.id;
			option.textContent = profile.name;
			if (profileManager.currentProfile && profile.id === profileManager.currentProfile.id) {
				option.selected = true;
			}
			modalDropdown.appendChild(option);
		});
		
		modalDropdown.onchange = async (e) => {
			await profileManager.setCurrentProfile(parseInt(e.target.value));
		};
	}
	
	// Close on background click
	modal.onclick = (e) => {
		if (e.target === modal) {
			document.body.removeChild(modal);
		}
	};
	
	// Close on Escape key
	const escapeHandler = (e) => {
		if (e.key === 'Escape') {
			document.body.removeChild(modal);
			document.removeEventListener('keydown', escapeHandler);
		}
	};
	document.addEventListener('keydown', escapeHandler);
	
	// Clean up event listener when modal is removed
	const observer = new MutationObserver((mutations) => {
		if (!document.body.contains(modal)) {
			document.removeEventListener('keydown', escapeHandler);
			observer.disconnect();
		}
	});
	observer.observe(document.body, { childList: true });
	
	document.body.appendChild(modal);
}

// ============================================================================
// DYNAMIC MENU COMMAND REGISTRATION
// ============================================================================
async function updateProfileMenuCommand() {
	// Unregister old command if it exists
	if (profileMenuCommandId !== null) {
		await GM.unregisterMenuCommand(profileMenuCommandId);
	}
	
	// Get current profile name
	const profileName = profileManager.currentProfile?.name || 'None';
	const commandText = `Active Profile: ${profileName}`;
	
	// Register new command
	profileMenuCommandId = await GM.registerMenuCommand(commandText, async () => {
		await openProfileSelectionModal();  // ADD await here
	});
}

// ============================================================================
// INITIALIZATION
// ============================================================================
const createButtons = async () => {
for (const handler of handlers) {
	const regex = handler.matches.join('|');
	if (unsafeWindow.location.href.match(regex)) {
	handler.run();
	console.log(`%c[SendToClient] Using engine {${handler.name}}`, 'color: #42adf5; font-weight: bold; font-size: 1.5em;');
	return handler.name;
	}
}
};

// Menu commands
GM.registerMenuCommand('Manage Profiles', () => {
	const profileId = profileManager.currentProfile?.id || null;
	openProfileModal(profileId);
});

GM.registerMenuCommand('Manage Clients', () => {
openClientModal(null, null);
});

// Start the script
(async () => {
await profileManager.init();
await updateProfileMenuCommand(); 
insertProfileSelector();
await createButtons();
})();

})();

// END OF PART 5 OF 5 - SCRIPT COMPLETE!