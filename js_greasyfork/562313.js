// ==UserScript==
// @name         WIRED API
// @version      1.0
// @description  WIRED Bot için Greasy Fork Veri ve Güncelleme Yönetimi
// @author       WIRED
// @license      MIT
// ==/UserScript==

/* WIRED API
   Greasy Fork üzerinden versiyon kontrolü ve dinamik veri çekme işlemlerini yönetir.
*/

class WiredAPI {
	constructor() {
		if(location.hostname === 'greasyfork.org' || location.hostname === 'sleazyfork.org') {
			this.host = location.host;
			return;
		}
	}

	static get xmlRequest() {
		return GM_xmlhttpRequest || GM.xmlHttpRequest;
	}

	static getScriptData(id) {
		return new Promise((res, rej) => {
			this.xmlRequest({
				url: `https://greasyfork.org/scripts/${id}.json`,
				onload: response => res(JSON.parse(response.responseText)),
				onerror: err => rej(err)
			});
		});
	}

	static getScriptCode(id, isLibrary = false) {
		const url = `https://greasyfork.org/scripts/${id}/code/userscript` + (isLibrary ? '.js' : '.user.js');
		return new Promise((res, rej) => {
			this.xmlRequest({
				url,
				onload: response => res(response.responseText),
				onerror: err => rej(err)
			});
		});
	}

	static searchScripts(query, page = 1) {
		return new Promise((res, rej) => {
			this.xmlRequest({
				url: `https://greasyfork.org/scripts.json?q=${query}&page=${page}`,
				onload: response => res(JSON.parse(response.responseText)),
				onerror: err => rej([])
			});
		});
	}
}