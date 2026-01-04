// ==UserScript==
// @name         fc2 live update thumbnail
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  FC2 Liveのサムネイル等を自動更新します
// @author       You
// @match        *://live.fc2.com/*/
// @icon         https://www.google.com/s2/favicons?domain=live.fc2.com
// @license      MIT
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/554735/fc2%20live%20update%20thumbnail.user.js
// @updateURL https://update.greasyfork.org/scripts/554735/fc2%20live%20update%20thumbnail.meta.js
// ==/UserScript==

(function() {
	'use strict';
	const wait = 30;
	setInterval(async function() {
		//fc2 live API: https://live.fc2.com/publicApiList/?page=member
		const API = 'https://live.fc2.com/api/memberApi.php';
		function getChannel(id) {
			return new Promise((resolve, reject) => {
				GM_xmlhttpRequest({
					url: `${API}?streamid=${id}&channel=1`,
					onload: function(response) {
						try {
							const data = JSON.parse(response.responseText);
							resolve(data);
						} catch (e) {
							reject(e);
						}
					},
					onerror: function(error) {
						reject(error);
					}
				});
				/*
				GM_xmlhttpRequest({
					method: 'POST',
					url: API,
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					data: `streamid=${id}&channel=1`,
					onload: function(response) {
						try {
							const data = JSON.parse(response.responseText);
							resolve(data);
						} catch (e) {
							reject(e);
						}
					},
					onerror: function(error) {
						reject(error);
					}
				});
				*/
			});
		}
		let id = location.href.split('/')[3];
		let data = await getChannel(id);
		//console.log(data);
		if (data.status === 1) {
			const h2 = document.querySelector('h2.c-pgTit');
			let title = data.data.channel_data.title;
			if (h2.innerHTML !== title) {
				//console.log('update title');
				h2.innerHTML = title;
				const htitle = document.querySelector('title');
				const e = htitle.innerHTML.split(' ');
				e[0] = title;
				htitle.innerHTML = e.join(' ');
			}
			/* getProfile: `${API}?streamid=${id}&profile=1`,
			const name = respjson.data.profile_data.name;
			const headtitle = document.querySelector('title');
			const e = document.querySelector('title').innerHTML.split(' ');
			const prevname = e[1].replace('[').replace(']');
			if (prevname !== name) {
			  e[1] = `[${name}]`;
				headtitle.innerHTML = e.join(' ');
				const pname = document.querySelector('p.c-ctbName');
				pname.innerHTML = name;
			}
			*/
			const js_info = document.querySelector('p.js-info');
			let info = data.data.channel_data.info;
			if (info === '') {
				info = '未記入';
			}
			if (js_info.innerHTML !== info) {
				//console.log('update info');
				js_info.innerHTML = info;
			}
			const tmb = document.getElementsByClassName('m-pgInf_tmb')[0];
			let image = data.data.channel_data.image;
			if (tmb.src !== image) {
				//console.log('update thumbnail');
				tmb.src = image;
			}
		} else {
			console.log('error');
		}
	}, wait*1000);
})();