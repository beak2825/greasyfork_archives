// ==UserScript==
// @name         随机B站视频
// @description  B站随机视频
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @author       Akias
// @license      MIT
// @icon         https://www.bilibili.com/favicon.ico
// @match        https://www.bilibili.com/video/*
// @run-at       document-start
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/555017/%E9%9A%8F%E6%9C%BAB%E7%AB%99%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/555017/%E9%9A%8F%E6%9C%BAB%E7%AB%99%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

const XOR_CODE = 23442827791579n;
const MASK_CODE = 2251799813685247n;
const MAX_AID = 1n << 51n;
const BASE = 58n;
const data = 'FcwAPNKTMug3GV5Lj7EJnHpWsx4tb8haYeviqBz6rkCy12mUSDQX9RdoZf';
function av2bv(aid) {
	const bytes = ['B', 'V', '1', '0', '0', '0', '0', '0', '0', '0', '0', '0'];
	let bvIndex = bytes.length - 1;
	let tmp = (MAX_AID | BigInt(aid)) ^ XOR_CODE;
	while (tmp > 0) {
		bytes[bvIndex] = data[Number(tmp % BigInt(BASE))];
		tmp = tmp / BASE;
		bvIndex -= 1;
	}
	[bytes[3], bytes[9]] = [bytes[9], bytes[3]];
	[bytes[4], bytes[7]] = [bytes[7], bytes[4]];
	return bytes.join('');
}


const max = Math.log10(Number(MAX_AID)) - 8
async function randbv() {
	while (true) {
		const av = Math.random() < 0.01 ? Math.floor(10 ** 8 * Math.random()) : Math.round(10 ** (Math.random() * max + 8))
		const bv = av2bv(av)
		const res = await fetch('https://api.bilibili.com/x/web-interface/view?bvid=' + bv).then(r => r.json())
		if (res.code === 0) {
			open(`https://www.bilibili.com/video/${bv}/?vd_source=0`, '_self')
			break
		}
	}
}

let i = 0
addEventListener('message', function (ev) {
	if (ev.data.type === 'COLS_RES') i++
	if (i < 2) return
	removeEventListener('message', arguments.callee)

	const flex = document.createElement('div')
	flex.style.flex = 1
	const a = document.createElement('a')
	a.textContent = '随机视频'
	a.addEventListener('click', randbv, { once: true })
	document.querySelector('.video-info-detail-content').append(flex, a)
})