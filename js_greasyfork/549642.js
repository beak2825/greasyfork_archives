// ==UserScript==
// @name         TikTok 定邀抓取与样品回填（合并版）
// @namespace    http://tampermonkey.net/
// @version      12.0.0
// @description  新增 GMV、履约率、视频播放回显
// @match        https://affiliate.tiktok.com/product/sample-request?shop_region=*
// @match        *://*.tiktok.com/product/sample-request*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @connect      seller-th.tiktok.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/lz-string/1.5.0/lz-string.min.js
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/549642/TikTok%20%E5%AE%9A%E9%82%80%E6%8A%93%E5%8F%96%E4%B8%8E%E6%A0%B7%E5%93%81%E5%9B%9E%E5%A1%AB%EF%BC%88%E5%90%88%E5%B9%B6%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/549642/TikTok%20%E5%AE%9A%E9%82%80%E6%8A%93%E5%8F%96%E4%B8%8E%E6%A0%B7%E5%93%81%E5%9B%9E%E5%A1%AB%EF%BC%88%E5%90%88%E5%B9%B6%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
	'use strict';

	const pageWindow = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
	const fetch = (...args) => {
		const targetFetch = pageWindow.fetch || window.fetch;
		if (typeof targetFetch !== 'function') {
			throw new Error('fetch is not supported in the page context');
		}
		return targetFetch.apply(pageWindow, args);
	};

	// ================= 通用配置 =================
	const STORAGE_KEY = 'tt_aff_invitation_cache_v1';
	const BASE_HOST = 'https://affiliate.tiktok.com';
	const AID_FOR_THIS_API = '4331';
	const OEC_SELLER_ID = '7496000925492218350';
	const SHOP_REGION = (new URL(location.href).searchParams.get('shop_region')) || 'TH';
	const PAGE_SIZE = 100;
	let DEBUG = false; // 可通过菜单开关
	let DETAIL_LOG = false; // 详情抓取日志开关
	const dbg = (...args) => { if (DEBUG) console.log('[合并][DEBUG]', ...args); };

	// ================= 页面类型 =================
	const isAffiliate = location.hostname.includes('affiliate.tiktok.com');

	// ================= 样式 =================
	GM_addStyle(`
		.invitation-name-tag { color: #D92911; font-size: 12px; font-weight: bold; margin-left: 12px; white-space: nowrap; align-self: center; }
		.tm-fixed-btn { position: fixed; z-index: 999999; right: 20px; padding: 10px 20px; font-size: 14px; background: #111827; color: #fff; border: 1px solid #374151; border-radius: 6px; cursor: pointer; box-shadow: 0 2px 5px rgba(0,0,0,0.15); }
		.tm-fixed-btn:hover { background: #0d1526; }
		.tm-fixed-btn:disabled { background: #3f3f46; color: #cbd5e1; cursor: not-allowed; }
		.tm-ec-btn { margin-left: 8px; padding: 2px 6px; font-size: 12px; background: #1f2937; color: #fff; border: 1px solid #374151; border-radius: 4px; cursor: pointer; }
		.tm-ec-btn[disabled] { opacity: 0.6; cursor: not-allowed; }
		.tm-ec-level { color: #D92911; font-size: 12px; font-weight: bold; margin-left: 0; white-space: nowrap; }
		.tm-ec-inline { display: inline-flex; align-items: baseline; gap: 10px; margin-left: 0; white-space: nowrap; vertical-align: baseline; overflow: visible !important; max-width: none !important; flex-wrap: nowrap !important; }
		/* 确保父容器不截断内容 */
		.tm-ec-inline * { overflow: visible !important; }
		td .tm-ec-inline, th .tm-ec-inline { max-width: none !important; width: auto !important; min-width: auto !important; }
		/* 确保表格单元格包含 .tm-ec-inline 时不截断 */
		tr:has(.tm-ec-inline) td, tr:has(.tm-ec-inline) th { overflow: visible !important; }
		.arco-table-tr:has(.tm-ec-inline) .arco-table-td { overflow: visible !important; text-overflow: clip !important; }
		/* 如果表格单元格有固定宽度，尝试调整 */
		.arco-table-td:has(.tm-ec-inline) { min-width: max-content !important; }
		/* 修复父容器宽度限制问题 - 针对包含 tm-ec-inline 的容器 */
		div[data-e2e="24ee33ed-b8cc-3e07"]:has(.tm-ec-inline) { width: auto !important; min-width: max-content !important; max-width: none !important; overflow: visible !important; }
		/* 或者直接覆盖所有包含历史按钮的父容器 */
		div:has(.tm-history-btn) { overflow: visible !important; }
		div:has(.tm-ec-inline) { overflow: visible !important; }
		.tm-ec-link-btn { display: inline-flex; align-items: center; height: 18px; line-height: 18px; padding: 0 8px; font-size: 12px; background: #0ea5e9; color: #fff; border: 1px solid #0369a1; border-radius: 3px; cursor: pointer; vertical-align: baseline; white-space: nowrap; box-sizing: border-box; overflow: visible; max-width: none; }
		.tm-ec-link-btn[disabled] { opacity: 0.6; cursor: not-allowed; }
		.tm-history-btn { display: inline-flex !important; align-items: center; height: 18px; line-height: 18px; padding: 0 8px; font-size: 12px; background: #10b981; color: #fff; border: 1px solid #059669; border-radius: 3px; cursor: pointer; vertical-align: baseline; white-space: nowrap; box-sizing: border-box; overflow: visible; max-width: none !important; margin-left: 4px; visibility: visible !important; opacity: 1 !important; flex-shrink: 0 !important; }
		.tm-history-btn:hover { background: #059669; }
		.tm-history-btn[disabled] { opacity: 0.6; cursor: not-allowed; }
		.tm-history-panel { position: fixed; top: 0; right: -550px; width: 550px; height: 100vh; background: #fff; box-shadow: -2px 0 8px rgba(0,0,0,0.15); z-index: 999998; transition: right 0.3s ease; overflow-y: auto; border-left: 1px solid #e5e7eb; }
		.tm-history-panel.visible { right: 0; }
		.tm-history-panel-header { padding: 16px; background: #f9fafb; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; z-index: 10; }
		.tm-history-panel-title { font-weight: 600; font-size: 16px; color: #111827; }
		.tm-history-panel-actions { display: flex; gap: 8px; }
		.tm-history-panel-btn { background: none; border: none; cursor: pointer; padding: 4px 8px; color: #6b7280; font-size: 14px; border-radius: 4px; }
		.tm-history-panel-btn:hover { background: #e5e7eb; color: #111827; }
		.tm-history-panel-content { padding: 16px; }
		.tm-history-panel.collapsed .tm-history-panel-content { display: none; }
		.tm-history-loading, .tm-history-error { padding: 20px; text-align: center; color: #6b7280; }
		.tm-history-error { color: #dc2626; }
		.tm-history-creator-info { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid #e5e7eb; }
		.tm-history-avatar { width: 48px; height: 48px; border-radius: 50%; object-fit: cover; }
		.tm-history-creator-details h3 { margin: 0; font-size: 16px; font-weight: 600; color: #111827; }
		.tm-history-creator-details p { margin: 4px 0 0 0; font-size: 14px; color: #6b7280; }
		.tm-history-metrics { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
		.tm-history-metric { padding: 12px; background: #f9fafb; border-radius: 6px; }
		.tm-history-metric-label { font-size: 12px; color: #6b7280; margin-bottom: 4px; }
		.tm-history-metric-value { font-size: 18px; font-weight: 600; color: #111827; }
		/* 历史数据按钮区域样式 - 两行布局 */
		/* 第一行：历史数据按钮 + creator按钮 + EC信息 + 定邀名称 */
		/* 第二行：GMV | 履约率 | 观看 */
		.tm-ec-inline:has(.creator-metrics-row) {
			flex-wrap: wrap !important;
			align-items: flex-start !important;
			overflow: visible !important;
			max-width: none !important;
			margin-top: 8px !important;
		}
		/* 严格按照顺序：[历史数据] [creator] [EC: xxx] [定邀名称] */
		.tm-ec-inline:has(.creator-metrics-row) > .tm-history-btn { order: 1 !important; }
		.tm-ec-inline:has(.creator-metrics-row) > .tm-ec-link-btn { order: 2 !important; }
		.tm-ec-inline:has(.creator-metrics-row) > .tm-ec-level { order: 3 !important; }
		.tm-ec-inline:has(.creator-metrics-row) > .invitation-name-only { order: 4 !important; }
		/* 第一行的元素保持在同一行 */
		.tm-ec-inline:has(.creator-metrics-row) > .tm-history-btn,
		.tm-ec-inline:has(.creator-metrics-row) > .tm-ec-link-btn,
		.tm-ec-inline:has(.creator-metrics-row) > .tm-ec-level,
		.tm-ec-inline:has(.creator-metrics-row) > .invitation-name-only {
			flex-shrink: 0 !important;
			flex-basis: auto !important;
		}
		/* 定邀名称（第一行，仅名称） */
		.invitation-name-only {
			display: inline-flex;
			align-items: center;
			margin-left: 4px;
			color: #D92911;
			font-size: 12px;
			font-weight: bold;
			white-space: nowrap;
			flex-shrink: 0 !important;
		}
		/* 达人数据行（第二行） */
		.creator-metrics-row {
			display: inline-flex;
			align-items: center;
			gap: 8px;
			margin-top: 6px;
			margin-left: 0;
			padding: 0;
			flex-wrap: nowrap !important;
			white-space: nowrap !important;
			overflow: visible !important;
			width: fit-content;
			min-width: 0;
			flex: 0 0 100%;
			order: 10;
			box-sizing: border-box;
			line-height: 1.4;
		}
		.creator-metrics-row > span { white-space: nowrap !important; flex-shrink: 0 !important; }
	`);

	// ================= 工具：Cookie/参数/压缩存储 =================
	function getCookie(name) {
		const target = name + '=';
		const parts = document.cookie.split(';');
		for (let i = 0; i < parts.length; i++) {
			const s = parts[i].trim();
			if (s.startsWith(target)) return decodeURIComponent(s.slice(target.length));
		}
		return '';
	}
	function buildSearchString(obj) {
		const usp = new URLSearchParams();
		for (const [k, v] of Object.entries(obj)) {
			usp.append(k, String(v));
		}
		return usp.toString();
	}

	function getBaseParameters() {
		const params = {
			aid: AID_FOR_THIS_API,
			app_name: 'i18n_ecom_alliance',
			device_id: '0',
			device_platform: 'web',
			cookie_enabled: navigator.cookieEnabled,
			screen_width: screen.width,
			screen_height: screen.height,
			user_language: navigator.language,
			browser_language: navigator.language,
			browser_platform: navigator.platform,
			browser_name: navigator.appCodeName,
			browser_version: navigator.appVersion,
			browser_online: navigator.onLine,
			timezone_name: Intl.DateTimeFormat().resolvedOptions().timeZone,
			shop_region: SHOP_REGION
		};
		const svwebid = getCookie('s_v_web_id');
		const msToken = getCookie('msToken');
		if (svwebid) params.fp = svwebid;
		if (msToken) params.msToken = msToken;
		if (OEC_SELLER_ID) params.oec_seller_id = OEC_SELLER_ID;
		return params;
	}
	async function saveCompressed(key, obj) {
		const json = JSON.stringify(obj);
		const compressed = (typeof LZString !== 'undefined' && LZString?.compressToUTF16) ? LZString.compressToUTF16(json) : json;
		if (typeof GM !== 'undefined' && typeof GM.setValue === 'function') return GM.setValue(key, compressed);
		if (typeof GM_setValue === 'function') return GM_setValue(key, compressed);
		localStorage.setItem(key, compressed);
	}
	async function loadCompressed(key) {
		let raw = '';
		if (typeof GM !== 'undefined' && typeof GM.getValue === 'function') raw = await GM.getValue(key, '');
		else if (typeof GM_getValue === 'function') raw = GM_getValue(key, '');
		else raw = localStorage.getItem(key) || '';
		if (!raw) return null;
		let jsonStr = raw;
		if (typeof LZString !== 'undefined' && LZString?.decompressFromUTF16) { const maybe = LZString.decompressFromUTF16(raw); if (maybe) jsonStr = maybe; }
		try { return JSON.parse(jsonStr); } catch { return null; }
	}

	// ================= X-Bogus 加密实现 =================
	class XBogusUtils {
		constructor(ua = '') {
			this.array = new Array(123).fill(null);
			this.array[48] = 0; this.array[49] = 1; this.array[50] = 2; this.array[51] = 3;
			this.array[52] = 4; this.array[53] = 5; this.array[54] = 6; this.array[55] = 7;
			this.array[56] = 8; this.array[57] = 9;
			this.array[97] = 10; this.array[98] = 11; this.array[99] = 12; this.array[100] = 13;
			this.array[101] = 14; this.array[102] = 15;
			this.character = 'Dkdpgh4ZKsQB80/Mfvw36XI1R25-WUAlEi7NLboqYTOPuzmFjJnryx9HVGcaStCe=';
			this.ua_key = new Uint8Array([0, 1, 12]);
			this.user_agent = ua || navigator.userAgent;
		}

		md5_str_to_array(e) {
			if (e.length > 32) return e.split('').map(ch => ch.charCodeAt(0));
			const t = [];
			for (let r = 0; r < e.length; r += 2) {
				t.push((this.array[e.charCodeAt(r)] << 4) | this.array[e.charCodeAt(r + 1)]);
			}
			return t;
		}

		async md5(e) {
			const s = (typeof e === 'string') ? e : e.toString();
			return CryptoJS.MD5(s).toString();
		}

		async md5_encrypt(e) {
			const t = await this.md5(this.md5_str_to_array(await this.md5(e)));
			return this.md5_str_to_array(t);
		}

		encoding_conversion(e, t, r, n, a, o, i, s, l, c, u, d, f, p, m, h, g, F, A) {
			return String.fromCharCode(...[e, u, t, d, r, f, n, p, a, m, o, h, i, g, s, F, l, A, c]);
		}

		encoding_conversion2(e, t, r) {
			return String.fromCharCode(e) + String.fromCharCode(t) + r;
		}

		rc4_encrypt(keyBytes, dataBytes) {
			let r = Array.from({ length: 256 }, (_, t) => t);
			let n = 0;
			for (let t = 0; t < 256; t++) {
				n = (n + r[t] + keyBytes[t % keyBytes.length]) % 256;
				[r[t], r[n]] = [r[n], r[t]];
			}
			const a = new Uint8Array(dataBytes.length);
			let o = 0;
			n = 0;
			for (let e = 0; e < dataBytes.length; e++) {
				o = (o + 1) % 256;
				n = (n + r[o]) % 256;
				[r[o], r[n]] = [r[n], r[o]];
				a[e] = dataBytes[e] ^ r[(r[o] + r[n]) % 256];
			}
			return a;
		}

		calculation(e, t, r) {
			let n = ((255 & e) << 16) | ((255 & t) << 8) | r;
			return this.character[(16515072 & n) >> 18] +
				this.character[(258048 & n) >> 12] +
				this.character[(4032 & n) >> 6] +
				this.character[63 & n];
		}

		async getXBogus(queryString) {
			const t = this.md5_str_to_array(await this.md5(btoa(String.fromCharCode(...this.rc4_encrypt(this.ua_key, new TextEncoder().encode(this.user_agent))))));
			const r = this.md5_str_to_array(await this.md5(this.md5_str_to_array('d41d8cd98f00b204e9800998ecf8427e')));
			const n = await this.md5_encrypt(queryString);
			const a = Math.floor(Date.now() / 1e3);
			const o = [64, 0.00390625, 1, 12, n[14], n[15], r[14], r[15], t[14], t[15], (a >> 24) & 255, (a >> 16) & 255, (a >> 8) & 255, 255 & a, 32, 0, 190, 144];
			let i = o[0];
			for (let e = 1; e < o.length; e++) {
				const t = o[e];
				if (typeof t === 'number') i ^= t;
			}
			o.push(i);
			const s = [];
			const l = [];
			for (let e = 0; e < o.length; e += 2) {
				s.push(o[e]);
				if (e + 1 < o.length) l.push(o[e + 1]);
			}
			const c = [...s, ...l];
			const u = this.encoding_conversion2(2, 255, String.fromCharCode(...this.rc4_encrypt(new Uint8Array([255]), new TextEncoder().encode(this.encoding_conversion(...c)))));
			let d = '';
			for (let e = 0; e < u.length; e += 3) {
				d += this.calculation(u.charCodeAt(e), u.charCodeAt(e + 1), u.charCodeAt(e + 2));
			}
			const withXBogus = `${queryString}&X-Bogus=${d}`;
			return [withXBogus, d, this.user_agent];
		}
	}

	// ================= X-Gnarly 加密实现 =================
	const XGnarlyEncode = (() => {
		const o = [4294967295, 138, 1498001188, 211147047, 253, /\s*\(\)\s*{\s*\[\s*native\s+code\s*]\s*}\s*$/, 203, 288, 9, 1196819126, 3212677781, 135, 263, 193, 58, 18, 244, 2931180889, 240, 173, 268, 2157053261, 261, 175, 14, 5, 171, 270, 156, 258, 13, 15, 3732962506, 185, 169, 2, 6, 132, 162, 200, 3, 160, 217618912, 62, 2517678443, 44, 164, 4, 96, 183, 2903579748, 3863347763, 119, 181, 10, 190, 8, 2654435769, 259, 104, 230, 128, 2633865432, 225, 1, 257, 143, 179, 16, 600974999, 185100057, 32, 188, 53, 2718276124, 177, 196, 4294967296, 147, 117, 17, 49, 7, 28, 12, 266, 216, 11, 0, 45, 166, 247, 1451689750];
		const i = [o[44], o[74], o[10], o[62], o[42], o[17], o[2], o[21], o[3], o[70], o[50], o[32], o[0] & Date.now(), Math.floor(o[77] * Math.random()), Math.floor(o[77] * Math.random()), Math.floor(o[77] * Math.random())];
		let s = o[88];
		const l = [o[9], o[69], o[51], o[92]];

		function c(e) {
			const buf = new ArrayBuffer(e < 65025 ? 2 : 4);
			const dv = new DataView(buf);
			if (e < 65025) dv.setUint16(0, e, false);
			else dv.setUint32(0, e, false);
			return new Uint8Array(buf);
		}

		function rotl(e, t) {
			return ((e << t) | (e >>> (32 - t))) >>> 0;
		}

		function roundAdd(x, a, b, c, d) {
			x[a] = ((x[a] ?? 0) + (x[b] ?? 0)) >>> 0;
			x[d] = rotl(((x[d] ?? 0) ^ (x[a] ?? 0)) >>> 0, 16) >>> 0;
			x[c] = ((x[c] ?? 0) + (x[d] ?? 0)) >>> 0;
			x[b] = rotl(((x[b] ?? 0) ^ (x[c] ?? 0)) >>> 0, 12) >>> 0;
			x[a] = ((x[a] ?? 0) + (x[b] ?? 0)) >>> 0;
			x[d] = rotl(((x[d] ?? 0) ^ (x[a] ?? 0)) >>> 0, 8) >>> 0;
			x[c] = ((x[c] ?? 0) + (x[d] ?? 0)) >>> 0;
			x[b] = rotl(((x[b] ?? 0) ^ (x[c] ?? 0)) >>> 0, 7) >>> 0;
		}

		function incCounter(x) {
			x[12] = (((x[12] ?? 0) + 1) & 0xffffffff) >>> 0;
		}

		function chachaLikeCore(state, rounds) {
			let r = state.slice();
			for (let iter = 0; iter < rounds;) {
				roundAdd(r, 0, 4, 8, 12);
				roundAdd(r, 1, 5, 9, 13);
				roundAdd(r, 2, 6, 10, 14);
				roundAdd(r, 3, 7, 11, 15);
				if (++iter >= rounds) break;
				roundAdd(r, 0, 5, 10, 15);
				roundAdd(r, 1, 6, 11, 12);
				roundAdd(r, 2, 7, 12, 13);
				roundAdd(r, 3, 4, 13, 14);
			}
			for (let t = 0; t < 16; ++t) {
				r[t] = ((r[t] ?? 0) + (state[t] ?? 0)) >>> 0;
			}
			return r;
		}

		function streamXor(key, rounds, out) {
			let n = key.slice();
			let a = 0;
			for (; a + 16 < out.length; a += 16) {
				const e = chachaLikeCore(n, rounds);
				incCounter(n);
				for (let t = 0; t < 16; ++t) {
					out[a + t] = ((out[a + t] ?? 0) ^ (e[t] ?? 0)) >>> 0;
				}
			}
			const rem = out.length - a;
			const e2 = chachaLikeCore(n, rounds);
			for (let t = 0; t < rem; ++t) {
				out[a + t] = ((out[a + t] ?? 0) ^ (e2[t] ?? 0)) >>> 0;
			}
		}

		function toWordsLE(bytes) {
			const n = Math.floor(bytes.length / 4);
			const a = bytes.length % 4;
			const outLen = Math.floor((bytes.length + 3) / 4);
			const words = Array(outLen).fill(0);
			let s = 0;
			for (s = 0; s < n; ++s) {
				const e = 4 * s;
				words[s] = (bytes[e]) | (bytes[e + 1] << 8) | (bytes[e + 2] << 16) | (bytes[e + 3] << 24);
			}
			if (a > 0) {
				words[s] = 0;
				for (let e = 0; e < a; ++e) {
					words[s] |= (bytes[4 * s + e] << (8 * e));
				}
			}
			return words;
		}

		function wordsToBytesLE(words, origLen) {
			const out = new Array(origLen).fill(0);
			const n = Math.floor(origLen / 4);
			const a = origLen % 4;
			for (let s = 0; s < n; ++s) {
				const v = words[s] ?? 0;
				const e = 4 * s;
				out[e] = v & 255;
				out[e + 1] = (v >>> 8) & 255;
				out[e + 2] = (v >>> 16) & 255;
				out[e + 3] = (v >>> 24) & 255;
			}
			if (a > 0) {
				const v = words[n] ?? 0;
				for (let e = 0; e < a; ++e) {
					out[4 * n + e] = (v >>> (8 * e)) & 255;
				}
			}
			return out;
		}

		function md5hex(str) {
			return CryptoJS.MD5(str).toString();
		}

		return function XGnarlyEncode({ queryString, body, userAgent }) {
			const p = {};
			p[1] = 1;
			p[2] = 0;
			p[3] = md5hex(queryString || '');
			p[4] = md5hex(body || '');
			p[5] = md5hex(userAgent || '');
			const h = Date.now();
			p[6] = Math.floor(h / 1000);
			p[7] = 1245783967;
			p[8] = (1000 * h) % 2147483648;
			p[9] = '5.1.0';
			p[0] = p[6] ^ p[7] ^ p[8] ^ p[1] ^ p[2];

			const g = [Object.keys(p).length];
			for (const [k, v] of Object.entries(p)) {
				g.push(parseInt(k, 10));
				let rBytes, lenBytes;
				if (typeof v === 'number') {
					rBytes = c(v);
					lenBytes = c(rBytes.length);
				} else {
					rBytes = new TextEncoder().encode(v);
					lenBytes = c(rBytes.length);
				}
				g.push(...lenBytes, ...rBytes);
			}

			let F = '';
			for (let e = 0; e < g.length; e++) {
				F += String.fromCharCode(g[e]);
			}

			const A = [];
			const vbytes = [];
			let _ = 0;
			for (let e = 0; e < 12; e++) {
				const rand = Math.floor(4294967296 * (function () {
					const r = chachaLikeCore(i, 8);
					const nIdx = s & 15;
					const aIdx = (s + 8) & 15;
					const t = r[nIdx];
					const e2 = ((r[aIdx] & 4294965248) >>> 11);
					if (s === 7) {
						incCounter(i);
						s = 0;
					} else {
						++s;
					}
					return (t + 4294967296 * e2) / 9007199254740992;
				})());
				A.push(rand);
				_ = ((_ + (rand & 15)) & 15) >>> 0;
				const t = rand & 255;
				const r = (rand >>> 8) & 255;
				const n = (rand >>> 16) & 255;
				const a = (rand >>> 24) & 255;
				vbytes.push(t, r, n, a);
			}
			_ += 5;

			function rc4Encrypt(keyByte, str) {
				const keyArr = new Uint8Array([keyByte]);
				const data = new TextEncoder().encode(str);
				let r = Array.from({ length: 256 }, (_, t) => t);
				let n = 0;
				for (let t = 0; t < 256; t++) {
					n = (n + r[t] + keyArr[t % keyArr.length]) % 256;
					[r[t], r[n]] = [r[n], r[t]];
				}
				const a = new Uint8Array(data.length);
				let o2 = 0;
				n = 0;
				for (let e = 0; e < data.length; e++) {
					o2 = (o2 + 1) % 256;
					n = (n + r[o2]) % 256;
					[r[o2], r[n]] = [r[n], r[o2]];
					a[e] = data[e] ^ r[(r[o2] + r[n]) % 256];
				}
				return a;
			}

			const header = String.fromCharCode(
				l[0], vbytes[0], l[1], vbytes[1], l[2], vbytes[2], l[3], vbytes[3],
				A[0] & 255, (A[0] >>> 8) & 255, (A[0] >>> 16) & 255, (A[0] >>> 24) & 255
			);

			const part = String.fromCharCode(2) + String.fromCharCode(255) + String.fromCharCode(...rc4Encrypt(255, header + (function toStream() {
				const arr = [];
				for (let e = 0; e < F.length; ++e) {
					arr.push(F.charCodeAt(e));
				}
				const n = Math.floor(arr.length / 4);
				const a = arr.length % 4;
				const outLen = Math.floor((arr.length + 3) / 4);
				const words = Array(outLen).fill(0);
				for (let s = 0; s < n; ++s) {
					const e = 4 * s;
					words[s] = arr[e] | (arr[e + 1] << 8) | (arr[e + 2] << 16) | (arr[e + 3] << 24);
				}
				if (a > 0) {
					let s2 = n;
					words[s2] = 0;
					for (let e = 0; e < a; ++e) {
						words[s2] |= (arr[4 * s2 + e] << (8 * e));
					}
				}
				streamXor(i, _, words);
				return String.fromCharCode.apply(String, wordsToBytesLE(words, arr.length));
			})()));

			const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
			let out = '';
			for (let idx = 0; idx < part.length; idx += 3) {
				const a0 = part.charCodeAt(idx);
				const a1 = part.charCodeAt(idx + 1);
				const a2 = part.charCodeAt(idx + 2);
				out += chars[(a0 & 0xfc) >> 2];
				out += chars[((a0 & 0x03) << 4) | ((a1 & 0xf0) >> 4)];
				out += isNaN(a1) ? '' : chars[((a1 & 0x0f) << 2) | ((a2 & 0xc0) >> 6)];
				out += isNaN(a2) ? '' : chars[a2 & 0x3f];
			}
			return out;
		};
	})();

	// ================= 获取签名查询字符串 =================
	async function getSignedQuery(params, bodyObj) {
		const merged = { ...getBaseParameters(), ...params };
		const qs = buildSearchString(merged);
		const xb = new XBogusUtils(navigator.userAgent);
		const [withXBogus, , ua] = await xb.getXBogus(qs);
		const bodyStr = bodyObj ? JSON.stringify(bodyObj) : '';
		const xgnarly = XGnarlyEncode({ queryString: qs, body: bodyStr, userAgent: ua });
		return `${withXBogus}&X-Gnarly=${xgnarly}`;
	}

	// ================= 抓取：search 分页 + detail 并发 =================
	async function callSearch(cur_page, page_size, status = 1) {
		const endpoint = '/api/v1/oec/affiliate/seller/invitation_group/search';
		const queryParams = { aid: AID_FOR_THIS_API, oec_seller_id: OEC_SELLER_ID };
		const body = { page_size, cur_page, invitation_group_status: status, search_params: { filter_accept_status: 3, query_items: [] } };
		const signed = await getSignedQuery(queryParams, body);
		const url = `${BASE_HOST}${endpoint}?${signed}`;
		const resp = await fetch(url, { method: 'POST', headers: { 'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/json' }, body: JSON.stringify(body), credentials: 'include' });
		const text = await resp.text();
		try { return JSON.parse(text); } catch { return { code: -1, raw: text }; }
	}
	// ================= Detail 请求函数 =================
	async function callDetail(invitation_group_id) {
		const endpoint = '/api/v1/oec/affiliate/seller/invitation_group/detail';
		const queryParams = { aid: AID_FOR_THIS_API, oec_seller_id: OEC_SELLER_ID };
		const body = { invitation_group_id: String(invitation_group_id) };
		const signed = await getSignedQuery(queryParams, body);
		const url = `${BASE_HOST}${endpoint}?${signed}`;

		dbg('detail fetch ->', { id: invitation_group_id, url, body });
		if (DETAIL_LOG) console.log('[合并][DETAIL] fetch ->', { id: invitation_group_id, url, body });
		console.log('[Detail请求] 发起请求:', { id: invitation_group_id, url, body });

		const resp = await fetch(url, {
			method: 'POST',
			headers: {
				'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(body),
			credentials: 'include'
		});

		const text = await resp.text();
		try {
			return JSON.parse(text);
		} catch {
			return { code: -1, raw: text };
		}
	}
	async function fetchAllInvitations() {
		const result = [];

		// 获取状态1的定邀
		console.log('[合并] 开始获取状态1的定邀...');
		let hasMore = true; let curPage = 1;
		while (hasMore) {
			const pageData = await callSearch(curPage, PAGE_SIZE, 1);
			const list = pageData?.data?.invitation_list || [];
			result.push(...list); hasMore = !!pageData?.data?.has_more; curPage += 1;
			console.log(`[合并] 状态1 页 ${curPage-1} 获取 ${list.length} 条，has_more=${hasMore}`);
		}

		// 获取状态2的定邀
		console.log('[合并] 开始获取状态2的定邀...');
		hasMore = true; curPage = 1;
		while (hasMore) {
			const pageData = await callSearch(curPage, PAGE_SIZE, 2);
			const list = pageData?.data?.invitation_list || [];
			result.push(...list); hasMore = !!pageData?.data?.has_more; curPage += 1;
			console.log(`[合并] 状态2 页 ${curPage-1} 获取 ${list.length} 条，has_more=${hasMore}`);
		}

		console.log(`[合并] 总共获取 ${result.length} 条定邀（状态1+状态2）`);
		return result;
	}
	async function fetchAllDetailsBatched(ids, concurrency = 8) {
		const out = []; let idx = 0;
		let done = 0; const total = ids.length;
		async function worker() { while (idx < ids.length) { const my = idx++; const id = ids[my]; try { const detail = await callDetail(id); if (detail?.data?.invitation) out.push(detail.data.invitation); if (DETAIL_LOG) console.log('[合并][DETAIL] ok ->', id); } catch (e) { console.warn('[合并] 详情失败', id, e); } finally { done++; if (done % 20 === 0 || done === total) { dbg(`detail progress: ${done}/${total}`); if (DETAIL_LOG) console.log(`[合并][DETAIL] progress: ${done}/${total}`); } } } }
		await Promise.all(Array.from({ length: Math.min(concurrency, Math.max(1, ids.length)) }, () => worker()));
		return out;
	}
	function buildCache(invitationDetails) {
		const invitations = {};
		for (const inv of invitationDetails) {
			const id = inv?.id; if (!id) continue; const name = inv?.name ?? '';
			const productIds = Array.from(new Set((inv?.product_list || []).map(p => String(p?.product_id || '')).filter(Boolean)));
			const creatorIds = Array.from(new Set((inv?.creator_id_list || []).map(c => String(c?.base_info?.creator_id || c?.base_info?.creator_oec_id || '')).filter(Boolean)));
			invitations[id] = { id, name, productIds, creatorIds };
		}
		return { version: 1, updatedAt: Date.now(), invitations };
	}

	// ================= 回填逻辑 =================
	const GROUP_LIST_API_PATH = '/api/v1/affiliate/sample/group/list';
	const APPLY_LIST_API_PATH = '/api/v1/affiliate/sample/apply/list';
	let invitationCache = null; let groupCreatorMap = {}; let isExpanding = false;
	// EC 查询临时缓存（按 handle 缓存）
	const ecInfoCache = Object.create(null);
	const ecFetchPromises = new Map();

	// ================= EC 查询：工具与请求 =================
	function extractHandleFromText(text){ if(!text) return ''; // 仅匹配 ASCII 的 tiktok handle
		const m = text.match(/@([A-Za-z0-9._-]{3,32})/); return m ? m[1] : ''; }
	function findHandleInRow(row){ if(!row) return ''; // 优先查找带 @ 的用户名
		const walker = document.createTreeWalker(row, NodeFilter.SHOW_TEXT, null);
		let best=''; while(walker.nextNode()){ const t=(walker.currentNode.nodeValue||'').trim(); if(!t) continue; const h = extractHandleFromText(t); if(h && h.length>best.length) best=h; }
		return best; }
	function buildAligned7DWindow(){
		// 计算上一个周一到当前周一的 7 天窗口（与示例 2025-09-08 -> 2025-09-15 一致）
		const now = new Date();
		const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
		// 获取本周一（周一=1）。在 JS 中周日=0，周一=1
		const day = today.getDay();
		const mondayThisWeek = new Date(today.getTime() - ((day + 6) % 7) * 24*60*60*1000);
		const mondayLastWeek = new Date(mondayThisWeek.getTime() - 7*24*60*60*1000);
		function toDateYMD(d){ return d.toISOString().slice(0,10); }
		const tzOffsetSeconds = SHOP_REGION==='TH' ? 25200 : (-new Date().getTimezoneOffset()*60);
		return { start: toDateYMD(mondayLastWeek), end: toDateYMD(mondayThisWeek), timezone_offset: tzOffsetSeconds, scenario: 4, granularity: '7D', with_previous_period: false };
	}
function buildAligned7DWindowWithOffset(weeksBack){
	const now = new Date();
	const base = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7*weeksBack);
	const day = base.getDay();
	const mondayThisWeek = new Date(base.getTime() - ((day + 6) % 7) * 24*60*60*1000);
	const mondayLastWeek = new Date(mondayThisWeek.getTime() - 7*24*60*60*1000);
	function toDateYMD(d){ return d.toISOString().slice(0,10); }
	const tzOffsetSeconds = SHOP_REGION==='TH' ? 25200 : (-new Date().getTimezoneOffset()*60);
	return { start: toDateYMD(mondayLastWeek), end: toDateYMD(mondayThisWeek), timezone_offset: tzOffsetSeconds, scenario: 4, granularity: '7D', with_previous_period: false };
}
	async function fetchCreatorIdByHandle(handle){
		const cleanHandle = String(handle||'').replace(/^@+/, '').trim();
		if(!cleanHandle){ throw new Error('缺少 handle'); }
		if(ecInfoCache[cleanHandle]?.creatorId){ return ecInfoCache[cleanHandle].creatorId; }
		const endpoint = '/api/v2/insights/affiliate/seller/creator/filter_list';
		const queryParams = { aid: AID_FOR_THIS_API, oec_seller_id: OEC_SELLER_ID, user_language: 'en' };
 		async function requestByWindow(td){
			// 仅修改 time_descriptor，其余结构保持不变
			const body = { request: { requests: [ { time_descriptor: td, filter: { creator_handle: cleanHandle }, list_control: { rules: [ { field: 'SELLER_CREATOR_FILTER_LIST_REVENUE', direction: 2 } ], pagination: { size: 50, page: 0 } }, stats_types: [1,2] } ] }, version: 2 };
			const signed = await getSignedQuery(queryParams, body);
			const url = `${BASE_HOST}${endpoint}?${signed}`;
			console.log('[EC][handle->id] request =', { method:'POST', url, headers:{ 'Accept':'application/json, text/plain, */*', 'Content-Type':'application/json' }, referrer: `${BASE_HOST}/data/creator-analysis?shop_region=${encodeURIComponent(SHOP_REGION)}`, referrerPolicy: 'strict-origin-when-cross-origin', credentials: 'include', body });
			const ref = `${BASE_HOST}/data/creator-analysis?shop_region=${encodeURIComponent(SHOP_REGION)}`;
			const resp = await fetch(url, { method: 'POST', headers: { 'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/json' }, referrer: ref, referrerPolicy: 'strict-origin-when-cross-origin', body: JSON.stringify(body), credentials: 'include' });
			const text = await resp.text();
			console.log('[EC][handle->id] status =', resp.status);
			console.log('[EC][handle->id] resp =', text);
			let id = '';
			try {
				const json = JSON.parse(text);
				const seg = json?.data?.segments?.[0];
				const timed = seg?.timed_lists?.[0];
				id = String(timed?.stats?.[0]?.id || '');
			} catch {}
			return id;
		}
		// 窗口1：end=昨日00:00，start=向前80天；若未命中，再查窗口2：end=窗口1的start，start=再向前80天
		const today = new Date();
		const end1 = new Date(today.getFullYear(), today.getMonth(), today.getDate()); // 今日00:00
		end1.setDate(end1.getDate() - 1); // 昨日00:00
		function toYMD(d){ return d.toISOString().slice(0,10); }
		const tzOffsetSeconds = SHOP_REGION==='TH' ? 25200 : (-new Date().getTimezoneOffset()*60);
		const start1Date = new Date(end1.getTime() - 80*24*60*60*1000);
		const td1 = { start: toYMD(start1Date), end: toYMD(end1), timezone_offset: tzOffsetSeconds, scenario: 1, granularity: '', with_previous_period: false };
		let id = await requestByWindow(td1);
		if(!id){ const end2 = start1Date; const start2Date = new Date(end2.getTime() - 80*24*60*60*1000); const td2 = { start: toYMD(start2Date), end: toYMD(end2), timezone_offset: tzOffsetSeconds, scenario: 1, granularity: '', with_previous_period: false }; id = await requestByWindow(td2); }
		if(!id){ throw new Error('未查询到该 handle 的 ID'); }
		ecInfoCache[cleanHandle] = ecInfoCache[cleanHandle] || {};
		ecInfoCache[cleanHandle].creatorId = id;
		return id;
	}
	async function fetchEcInfoByCreatorId(creatorId){
		const id = String(creatorId||'').trim();
		if(!id) throw new Error('缺少 creatorId');
		// 命中缓存（反向：通过 creatorId 搜索）
		for(const [h, v] of Object.entries(ecInfoCache)){ if(v.creatorId === id && v.ecLevel){ return v.ecLevel; } }
		const endpoint = '/api/v2/insights/affiliate/seller/creator_analytics/creator/info';
		const queryParams = { aid: AID_FOR_THIS_API, oec_seller_id: OEC_SELLER_ID, user_language: 'en' };
		const body = { request: { filter: { creator_id: id } }, version: 2 };
		const signed = await getSignedQuery(queryParams, body);
		const url = `${BASE_HOST}${endpoint}?${signed}`;
		console.log('[EC][id->ec] request =', { method:'POST', url, headers:{ 'Accept':'application/json, text/plain, */*', 'Content-Type':'application/json' }, referrer: `${BASE_HOST}/data/creator-analysis?creator_id=${encodeURIComponent(id)}&shop_region=${encodeURIComponent(SHOP_REGION)}`, referrerPolicy: 'strict-origin-when-cross-origin', credentials: 'include', body });
		const resp = await fetch(url, { method: 'POST', headers: { 'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/json' }, body: JSON.stringify(body), credentials: 'include' });
		const text = await resp.text();
		console.log('[EC][id->ec] status =', resp.status);
		console.log('[EC][id->ec] resp =', text);
		let level = '';
		try { const json = JSON.parse(text); level = String(json?.data?.stats?.ec_level || ''); } catch {}
		if(!level) throw new Error('未获取到 EC 信息');
		// 写回缓存
		for(const [h, v] of Object.entries(ecInfoCache)){ if(v.creatorId === id){ v.ecLevel = level; } }
		return level;
	}
	function renderEcLevelTag(container, ecLevel){
		if(!container) return;
		const holder = container.querySelector('.tm-ec-inline') || (function(){ const d=document.createElement('span'); d.className='tm-ec-inline'; container.appendChild(d); return d; })();
		const el = holder.querySelector('.tm-ec-level') || (function(){
			const s=document.createElement('span');
			s.className='tm-ec-level';
			// 确保插入在历史数据按钮之后，creator按钮之后
			const historyBtn = holder.querySelector('.tm-history-btn');
			const creatorBtn = holder.querySelector('.tm-ec-link-btn');
			const insertAfter = creatorBtn || historyBtn;
			if (insertAfter && insertAfter.nextSibling) {
				holder.insertBefore(s, insertAfter.nextSibling);
			} else {
				holder.appendChild(s);
			}
			return s;
		})();
		el.textContent = `EC: ${ecLevel}`;
		// 确保顺序：历史数据(1) -> creator(2) -> EC(3) -> 定邀名称(4)
		reorderEcInlineElements(holder);
	}
	function ensureCreatorAnalysisLink(container, creatorId){
		if(!container) return;
		const holder = container.querySelector('.tm-ec-inline') || (function(){ const d=document.createElement('span'); d.className='tm-ec-inline'; container.appendChild(d); return d; })();

		// 先在整个行范围内检查是否已存在 creator 按钮（避免重复注入）
		let targetRow = null;
		if (container.nodeName === 'TR' || container.closest('tr.arco-table-tr')) {
			targetRow = container.nodeName === 'TR' ? container : container.closest('tr.arco-table-tr');
		}

		if (targetRow) {
			const existingBtn = targetRow.querySelector('.tm-ec-link-btn');
			if (existingBtn) {
				// 如果已存在按钮，更新 creatorId 并返回
				if(creatorId) existingBtn.dataset.creatorId=creatorId;
				return;
			}
		}

		// 再次检查 holder 内是否已存在（双重检查）
		let btn = holder.querySelector('.tm-ec-link-btn');
		if (btn) {
			// 如果已存在，更新 creatorId 并返回
			if(creatorId) btn.dataset.creatorId=creatorId;
			return;
		}

		// 创建新按钮
		btn = document.createElement('button');
		btn.type='button';
		btn.className='tm-ec-link-btn';
		btn.textContent='creator';
		if(creatorId) btn.dataset.creatorId=creatorId;

		// 确保插入在历史数据按钮之后
		const historyBtn = holder.querySelector('.tm-history-btn');
		if (historyBtn && historyBtn.nextSibling) {
			holder.insertBefore(btn, historyBtn.nextSibling);
		} else {
			holder.appendChild(btn);
		}

		if(!btn._bound){
			btn.addEventListener('click',()=>{
				const id=btn.dataset.creatorId||'';
				if(!id){ alert('缺少 creator_id'); return; }
				const url=`${BASE_HOST}/data/creator-analysis?creator_id=${encodeURIComponent(id)}&shop_region=${encodeURIComponent(SHOP_REGION)}`;
				window.open(url,'_blank','noopener,noreferrer');
			});
			btn._bound=true;
		}
		// 确保顺序：历史数据(1) -> creator(2) -> EC(3) -> 定邀名称(4)
		reorderEcInlineElements(holder);
	}
	// 重新排序 .tm-ec-inline 容器内的元素，确保顺序：[历史数据] [creator] [EC: xxx] [定邀名称]
	function reorderEcInlineElements(holder) {
		if (!holder || !holder.classList.contains('tm-ec-inline')) return;

		const historyBtn = holder.querySelector('.tm-history-btn');
		const creatorBtn = holder.querySelector('.tm-ec-link-btn');
		const ecLevel = holder.querySelector('.tm-ec-level');
		const invitationName = holder.querySelector('.invitation-name-only');
		const metricsRow = holder.querySelector('.creator-metrics-row');

		// 按顺序重新插入
		const ordered = [historyBtn, creatorBtn, ecLevel, invitationName].filter(Boolean);

		// 先移除所有元素（除了 metricsRow）
		ordered.forEach(el => {
			if (el.parentNode === holder) {
				holder.removeChild(el);
			}
		});

		// 按顺序重新插入
		ordered.forEach(el => {
			holder.appendChild(el);
		});

		// metricsRow 始终在最后
		if (metricsRow && metricsRow.parentNode === holder) {
			holder.removeChild(metricsRow);
			holder.appendChild(metricsRow);
		}
	}
	async function fetchAndRenderEcInfo(container, handle, { silent = false, force = false } = {}) {
		const cleanHandle = String(handle || '').replace(/^@+/, '').trim();
		if (!cleanHandle) return '';
		ecInfoCache[cleanHandle] = ecInfoCache[cleanHandle] || {};
		const cacheEntry = ecInfoCache[cleanHandle];
		if (!force && cacheEntry.creatorId && cacheEntry.ecLevel) {
			if (container && cacheEntry.creatorId) ensureCreatorAnalysisLink(container, cacheEntry.creatorId);
			if (container && cacheEntry.ecLevel) renderEcLevelTag(container, cacheEntry.ecLevel);
			return cacheEntry.ecLevel;
		}
		if (!force && ecFetchPromises.has(cleanHandle)) {
			try {
				const level = await ecFetchPromises.get(cleanHandle);
				if (container && cacheEntry.creatorId) ensureCreatorAnalysisLink(container, cacheEntry.creatorId);
				if (container && cacheEntry.ecLevel) renderEcLevelTag(container, cacheEntry.ecLevel);
				return level;
			} catch (err) {
				if (!silent) throw err;
				console.warn('[EC] 查询队列失败', cleanHandle, err);
				return '';
			}
		}
		const runner = (async () => {
			let creatorId = cacheEntry.creatorId;
			let level = cacheEntry.ecLevel;
			try {
				if (!creatorId || force) {
					creatorId = await fetchCreatorIdByHandle(cleanHandle);
					cacheEntry.creatorId = creatorId;
				}
				if (container && creatorId) ensureCreatorAnalysisLink(container, creatorId);
				if (!level || force) {
					level = await fetchEcInfoByCreatorId(creatorId);
					cacheEntry.ecLevel = level;
				}
				if (container && level) renderEcLevelTag(container, level);
				return level;
			} catch (err) {
				if (!silent) throw err;
				console.warn('[EC] 自动查询失败', cleanHandle, err);
				throw err;
			} finally {
				ecFetchPromises.delete(cleanHandle);
			}
		})();
		ecFetchPromises.set(cleanHandle, runner);
		try {
			return await runner;
		} catch (err) {
			if (!silent) throw err;
			return '';
		}
	}
	// ================= 历史数据面板 =================
	function ensureHistoryPanel() {
		let panel = document.getElementById('tm-history-panel');
		if (!panel) {
			panel = document.createElement('div');
			panel.id = 'tm-history-panel';
			panel.className = 'tm-history-panel';
			panel.innerHTML = `
				<div class="tm-history-panel-header">
					<div class="tm-history-panel-title">历史数据</div>
					<div class="tm-history-panel-actions">
						<button class="tm-history-panel-btn" id="tm-history-collapse">−</button>
						<button class="tm-history-panel-btn" id="tm-history-close">×</button>
					</div>
				</div>
				<div class="tm-history-panel-content">
					<div class="tm-history-loading">加载中...</div>
				</div>
			`;
			document.body.appendChild(panel);

			// 折叠/展开按钮
			const collapseBtn = panel.querySelector('#tm-history-collapse');
			if (collapseBtn) {
				collapseBtn.addEventListener('click', () => {
					panel.classList.toggle('collapsed');
					collapseBtn.textContent = panel.classList.contains('collapsed') ? '+' : '−';
				});
			}

			// 关闭按钮
			const closeBtn = panel.querySelector('#tm-history-close');
			if (closeBtn) {
				closeBtn.addEventListener('click', () => {
					panel.classList.remove('visible');
				});
			}
		}
		return panel;
	}
	async function renderHistoryData(panel, data, creatorNickName, dateRange, sampleGroupData, sampleDetails) {
		const content = panel.querySelector('.tm-history-panel-content');
		if (!content) return;

		// 查找数据（API 返回的数据结构：data.data.table）
		let creatorData = null;
		if (data) {
			const tableData = data?.data?.table || [];
			if (Array.isArray(tableData) && tableData.length > 0) {
				creatorData = tableData[0];
			}

			// 兼容其他可能的数据结构
			if (!creatorData) {
				const listData = data?.data?.list || data?.data?.data?.list || data?.list || [];
				if (Array.isArray(listData) && listData.length > 0) {
					creatorData = listData[0];
				}
			}
		}

		// 提取数据字段（数据直接在 creatorData 中，不在 metrics 下）
		const avatar = creatorData?.tt_account_avatar_icon || '';
		const nickName = creatorData?.creator_nick_name || creatorNickName || '未知';
		const userName = creatorData?.creator_user_name || creatorNickName || '';

		// 数值字段需要转换为数字
		const videoCnt = parseFloat(creatorData?.total_video_cnt || 0);
		const spuCnt = parseFloat(creatorData?.total_spu_cnt || 0);
		const roi2Value = parseFloat(creatorData?.onsite_roi2_shopping_value || 0);
		const roi2Sku = parseFloat(creatorData?.onsite_roi2_shopping_sku || 0);
		const showCnt = parseFloat(creatorData?.roi2_show_cnt || 0);
		const clickCnt = parseFloat(creatorData?.roi2_click_cnt || 0);
		// 处理点击率：根据实际返回数据，roi2_ctr 返回的是字符串格式的百分比值（如 "1.12" 表示 1.12%）
		// 或者 "0.00" 表示 0.00%，直接使用，不需要乘以 100
		const ctrRaw = creatorData?.roi2_ctr || '0.00';
		const ctrValue = parseFloat(ctrRaw);
		const ctr = !isNaN(ctrValue) ? ctrValue.toFixed(2) + '%' : '0.00%';
		const aov = parseFloat(creatorData?.onsite_roi2_shopping_sku_aov || 0);

		// 格式化数值
		function formatNumber(num) {
			if (typeof num !== 'number' || isNaN(num)) return '0';
			if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
			if (num >= 1000) return (num / 1000).toFixed(2) + 'K';
			return num.toLocaleString('zh-CN', { maximumFractionDigits: 2 });
		}

		// 格式化金额（保留2位小数）
		function formatCurrency(num) {
			if (typeof num !== 'number' || isNaN(num)) return '0.00';
			return num.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
		}

		// 格式化日期时间戳
		function formatTimestamp(ts) {
			if (!ts) return '未知';
			const date = new Date(parseInt(ts));
			if (isNaN(date.getTime())) return '未知';
			const y = date.getFullYear();
			const m = String(date.getMonth() + 1).padStart(2, '0');
			const d = String(date.getDate()).padStart(2, '0');
			const h = String(date.getHours()).padStart(2, '0');
			const min = String(date.getMinutes()).padStart(2, '0');
			return `${y}-${m}-${d} ${h}:${min}`;
		}

		// 格式化日期范围显示
		const periodText = dateRange ? `时间周期：${dateRange.start} 至 ${dateRange.end}` : '时间周期：过去30天';

		// 状态映射函数
		function getStatusText(currStatus, reviewStatus) {
			// 优先使用 curr_status
			const statusMap = {
				40: '进行中',
				30: '已发送',
				10: '待审核',
				52: '已过期',
				53: '未履约',
				100: '已完成',
				56: '已取消'
			};

			if (statusMap[currStatus]) {
				return statusMap[currStatus];
			}

			// 如果没有 curr_status，使用 review_status
			if (reviewStatus === 10) return '已审核';
			if (reviewStatus === 0) return '待审核';

			return `状态${currStatus || reviewStatus || '未知'}`;
		}

		function getStatusColor(currStatus, reviewStatus) {
			const status = currStatus || reviewStatus;
			if (status === 100) return '#10b981'; // 已完成 - 绿色
			if (status === 40) return '#3b82f6'; // 进行中 - 蓝色
			if (status === 30) return '#8b5cf6'; // 已发送 - 紫色
			if (status === 10) return '#f59e0b'; // 待审核 - 橙色
			if (status === 52) return '#6b7280'; // 已过期 - 灰色
			if (status === 53) return '#f97316'; // 未履约 - 橙红色
			if (status === 56) return '#ef4444'; // 已取消 - 红色
			return '#6b7280'; // 默认灰色
		}

		// 处理申样记录数据
		let sampleSection = '';
		if (sampleGroupData && sampleGroupData.code === 0 && sampleGroupData.agg_info && sampleGroupData.agg_info.length > 0) {
			const group = sampleGroupData.agg_info[0];
			const creatorInfo = group?.apply_group?.creator_info || {};
			const applyCount = group?.apply_group?.apply_count || 0;
			const applyIds = group?.apply_group?.apply_ids || [];
			const creatorAvatar = creatorInfo?.avatar_url || '';
			const creatorName = creatorInfo?.name || creatorNickName || '';
			const creatorNick = creatorInfo?.nick_name || '';
			const creatorId = String(creatorInfo?.creator_id || '');

			// 确保定邀缓存已加载（用于匹配定邀名称）
			await loadCacheIfNeeded();

			// 统计各状态数量
			let statusCounts = {
				40: 0, // 进行中
				30: 0, // 已发送
				10: 0, // 待审核
				52: 0, // 已过期
				53: 0, // 未履约
				100: 0, // 已完成
				56: 0  // 已取消
			};

			// 获取申样详情
			let sampleDetailsHtml = '';
			if (sampleDetails && sampleDetails.code === 0 && sampleDetails.apply_infos && sampleDetails.apply_infos.length > 0) {
				// 先统计状态
				sampleDetails.apply_infos.forEach((apply) => {
					const currStatus = apply.curr_status || 0;
					if (statusCounts.hasOwnProperty(currStatus)) {
						statusCounts[currStatus]++;
					}
				});

				sampleDetailsHtml = '<div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #e5e7eb;">';
				sampleDetailsHtml += '<div style="font-weight: 600; margin-bottom: 12px; color: #111827; font-size: 14px;">申样详情：</div>';
				sampleDetailsHtml += '<div style="max-height: calc(100vh - 400px); overflow-y: auto;">';

				sampleDetails.apply_infos.forEach((apply, idx) => {
					const productTitle = apply.product_title || '未知产品';
					const skuDesc = apply.sku_desc || '';
					const skuImage = apply.sku_image || '';
					const createTime = formatTimestamp(apply.create_time);
					const reviewStatus = apply.review_status || 0;
					const currStatus = apply.curr_status || 0;
					const commissionRateRaw = apply.commission_rate || '0';
					// 修复佣金显示：1000 应该显示为 10%
					const commissionRate = commissionRateRaw !== '0' ? (parseFloat(commissionRateRaw) / 100).toFixed(2) + '%' : '';
					const mainOrderId = apply.main_order_id || '';
					const productId = apply.product_id || '';
					const applyId = apply.apply_id || '';
					const sourceType = apply.source_type !== undefined ? apply.source_type : null;
					const fulfillmentExpireTime = apply.fulfillment_expire_time ? formatTimestamp(apply.fulfillment_expire_time) : '';
					const overdue = apply.overdue || false;

					// 匹配定邀名称
					const invitationName = creatorId && productId ? findMatchedInvitation(creatorId, productId) : null;

					const statusText = getStatusText(currStatus, reviewStatus);
					const statusColor = getStatusColor(currStatus, reviewStatus);
					const sourceTypeText = sourceType === 0 ? '公开申样' : sourceType === 1 ? '定向申样' : '';
					const statsElementId = `tm-apply-performance-stats-${applyId}`;
					const hasValidOrderId = mainOrderId && mainOrderId !== '0';

					sampleDetailsHtml += `
						<div style="padding: 10px 12px; margin-bottom: 8px; background: #fff; border-radius: 6px; border: 1px solid #e5e7eb;">
							<div style="display: flex; gap: 12px; align-items: flex-start;">
								<!-- 左侧：产品图片 -->
								<div style="flex-shrink: 0;">
									${skuImage ? `
										<img src="${skuImage}" alt="${productTitle}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px; border: 1px solid #e5e7eb;" onerror="this.style.display='none'">
									` : `
										<div style="width: 60px; height: 60px; background: #f3f4f6; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #9ca3af; font-size: 10px; border: 1px solid #e5e7eb;">无图</div>
									`}
								</div>

								<!-- 中间：产品信息 -->
								<div style="flex: 1; display: flex; flex-direction: column; gap: 6px; min-width: 0;">
									<div style="font-weight: 600; font-size: 13px; color: #111827; line-height: 1.3; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${idx + 1}. ${productTitle}</div>

									<!-- 定邀名称（如果有） -->
									${invitationName ? `
										<div style="margin-top: 2px;">
											<span style="color: #D92911; font-size: 12px; font-weight: bold;">定邀: ${invitationName}</span>
										</div>
									` : ''}

									<!-- 第一行：SKU和佣金 -->
									<div style="display: flex; flex-wrap: wrap; gap: 12px; font-size: 11px; align-items: center;">
										${skuDesc ? `<div style="white-space: nowrap;"><span style="color: #6b7280;">SKU:</span> <span style="color: #111827; font-weight: 500;">${skuDesc}</span></div>` : ''}
										${commissionRate ? `
											<div style="white-space: nowrap;"><span style="color: #6b7280;">佣金:</span> <span style="color: #111827; font-weight: 600;">${commissionRate}</span></div>
										` : ''}
										${sourceTypeText ? `
											<div style="white-space: nowrap;">
												<span style="color: #6b7280;">类型:</span>
												<span style="color: ${sourceType === 0 ? '#10b981' : '#3b82f6'}; font-weight: 600; padding: 2px 6px; background: ${sourceType === 0 ? '#10b98115' : '#3b82f615'}; border-radius: 3px; border: 1px solid ${sourceType === 0 ? '#10b98140' : '#3b82f640'};">
													${sourceTypeText}
												</span>
											</div>
										` : ''}
									</div>

									<!-- 第二行：产品ID和申样时间 -->
									<div style="display: flex; flex-wrap: wrap; gap: 12px; font-size: 11px; align-items: center;">
										${productId ? `<div style="white-space: nowrap;"><span style="color: #6b7280;">产品:</span> <span style="color: #111827; font-weight: 500; font-family: monospace; font-size: 10px;">${productId}</span></div>` : ''}
										<div style="white-space: nowrap;"><span style="color: #6b7280;">申样时间:</span> <span style="color: #111827;">${createTime}</span></div>
									</div>

									<!-- 第三行：履约过期时间和样品订单 -->
									<div style="display: flex; flex-wrap: wrap; gap: 12px; font-size: 11px; align-items: center;">
										${fulfillmentExpireTime ? `<div style="white-space: nowrap;"><span style="color: #6b7280;">履约过期:</span> <span style="color: #111827;">${fulfillmentExpireTime}</span></div>` : ''}
										${hasValidOrderId ? `<div style="white-space: nowrap;"><span style="color: #6b7280;">样品订单:</span> <span style="color: #111827; font-weight: 500; font-family: monospace; font-size: 10px;">${mainOrderId}</span></div>` : ''}
									</div>
								</div>

								<!-- 右侧：状态和操作信息 -->
								<div style="flex-shrink: 0; display: flex; flex-direction: column; gap: 6px; align-items: flex-end; min-width: 100px;">
									<div style="padding: 4px 10px; background: ${statusColor}15; color: ${statusColor}; border-radius: 4px; font-size: 11px; font-weight: 600; border: 1px solid ${statusColor}40; white-space: nowrap;">
										${statusText}
									</div>

									${overdue ? `
										<div style="font-size: 10px; color: #ef4444; padding: 2px 6px; background: #ef444415; border-radius: 3px; white-space: nowrap;">
											已逾期
										</div>
									` : ''}
								</div>
							</div>

							${hasValidOrderId ? `
								<div id="${statsElementId}" style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #e5e7eb;">
									<div style="color: #6b7280; font-size: 11px;">履约内容统计（加载中...）</div>
								</div>
							` : ''}
						</div>
					`;
				});

				sampleDetailsHtml += '</div></div>';
			}

			sampleSection = `
				<div style="margin-top: 24px; padding: 20px; background: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb;">
					<div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
						${creatorAvatar ? `
							<img src="${creatorAvatar}" alt="${creatorName}" style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover; border: 2px solid #e5e7eb;" onerror="this.style.display='none'">
						` : `
							<div style="width: 48px; height: 48px; background: #e5e7eb; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #6b7280; font-size: 20px; border: 2px solid #e5e7eb;">👤</div>
						`}
						<div>
							<div style="font-weight: 600; font-size: 16px; color: #111827;">申样记录</div>
							${creatorNick ? `<div style="font-size: 12px; color: #6b7280; margin-top: 2px;">${creatorNick}</div>` : ''}
						</div>
					</div>
					<div style="margin-bottom: 12px; padding: 12px; background: #fff; border-radius: 6px; border: 1px solid #e5e7eb;">
						<div style="margin-bottom: 8px;">
							<span style="color: #6b7280; font-size: 14px;">总申请数: </span>
							<span style="font-weight: 600; color: #111827; font-size: 16px;">${applyCount}</span>
						</div>
						${sampleDetails && sampleDetails.code === 0 && sampleDetails.apply_infos && sampleDetails.apply_infos.length > 0 ? `
							<div style="display: flex; flex-wrap: wrap; gap: 12px; font-size: 12px; padding-top: 8px; border-top: 1px solid #e5e7eb;">
								${statusCounts[100] > 0 ? `<div><span style="color: #6b7280;">已完成:</span> <span style="color: #10b981; font-weight: 600;">${statusCounts[100]}</span></div>` : ''}
								${statusCounts[40] > 0 ? `<div><span style="color: #6b7280;">进行中:</span> <span style="color: #3b82f6; font-weight: 600;">${statusCounts[40]}</span></div>` : ''}
								${statusCounts[30] > 0 ? `<div><span style="color: #6b7280;">已发送:</span> <span style="color: #8b5cf6; font-weight: 600;">${statusCounts[30]}</span></div>` : ''}
								${statusCounts[10] > 0 ? `<div><span style="color: #6b7280;">待审核:</span> <span style="color: #f59e0b; font-weight: 600;">${statusCounts[10]}</span></div>` : ''}
								${statusCounts[52] > 0 ? `<div><span style="color: #6b7280;">已过期:</span> <span style="color: #6b7280; font-weight: 600;">${statusCounts[52]}</span></div>` : ''}
								${statusCounts[53] > 0 ? `<div><span style="color: #6b7280;">未履约:</span> <span style="color: #f97316; font-weight: 600;">${statusCounts[53]}</span></div>` : ''}
								${statusCounts[56] > 0 ? `<div><span style="color: #6b7280;">已取消:</span> <span style="color: #ef4444; font-weight: 600;">${statusCounts[56]}</span></div>` : ''}
							</div>
						` : ''}
					</div>
					${sampleDetails && sampleDetails.code === 0 && sampleDetails.apply_infos && sampleDetails.apply_infos.length > 0 ? `
						<div id="tm-performance-stats" style="margin-bottom: 12px; padding: 12px; background: #fff; border-radius: 6px; border: 1px solid #e5e7eb;">
							<div style="color: #6b7280; font-size: 12px; margin-bottom: 8px;">履约内容统计（加载中...）</div>
						</div>
					` : ''}
					${sampleDetailsHtml}
				</div>
			`;
		} else if (sampleGroupData && sampleGroupData.code !== 0) {
			sampleSection = `
				<div style="margin-top: 24px; padding: 16px; background: #fef2f2; border-radius: 8px; border: 1px solid #fecaca;">
					<div style="font-weight: 600; font-size: 16px; margin-bottom: 8px; color: #991b1b;">申样记录</div>
					<div style="color: #991b1b; font-size: 14px;">暂无申样记录或查询失败</div>
				</div>
			`;
		}

		content.innerHTML = `
			<div class="tm-history-creator-info">
				${avatar ? `<img src="${avatar}" alt="${nickName}" class="tm-history-avatar" onerror="this.style.display='none'">` : '<div class="tm-history-avatar" style="background: #e5e7eb; display: flex; align-items: center; justify-content: center; color: #6b7280; font-size: 20px;">👤</div>'}
				<div class="tm-history-creator-details">
					<h3>${nickName}</h3>
					${userName ? `<p>@${userName}</p>` : ''}
				</div>
			</div>
			${creatorData ? `
				<div style="padding: 12px; background: #f0f9ff; border-radius: 6px; margin-bottom: 16px; font-size: 13px; color: #0369a1;">
					${periodText}
				</div>
				<div class="tm-history-metrics">
					<div class="tm-history-metric">
						<div class="tm-history-metric-label">周期内发布总视频数</div>
						<div class="tm-history-metric-value">${formatNumber(videoCnt)}</div>
					</div>
					<div class="tm-history-metric">
						<div class="tm-history-metric-label">加橱窗 SKU 数</div>
						<div class="tm-history-metric-value">${formatNumber(spuCnt)}</div>
					</div>
					<div class="tm-history-metric">
						<div class="tm-history-metric-label">周期内总收入</div>
						<div class="tm-history-metric-value">${formatCurrency(roi2Value)}</div>
					</div>
					<div class="tm-history-metric">
						<div class="tm-history-metric-label">周期内总订单</div>
						<div class="tm-history-metric-value">${formatNumber(roi2Sku)}</div>
					</div>
					<div class="tm-history-metric">
						<div class="tm-history-metric-label">周期内总曝光</div>
						<div class="tm-history-metric-value">${formatNumber(showCnt)}</div>
					</div>
					<div class="tm-history-metric">
						<div class="tm-history-metric-label">周期内总点击</div>
						<div class="tm-history-metric-value">${formatNumber(clickCnt)}</div>
					</div>
					<div class="tm-history-metric">
						<div class="tm-history-metric-label">周期内客单价</div>
						<div class="tm-history-metric-value">${formatCurrency(aov)}</div>
					</div>
					<div class="tm-history-metric">
						<div class="tm-history-metric-label">周期内点击率</div>
						<div class="tm-history-metric-value">${ctr}</div>
					</div>
				</div>
			` : '<div style="padding: 16px; background: #fef2f2; border-radius: 6px; color: #991b1b;">历史数据加载失败或暂无数据</div>'}
			${sampleSection}
		`;

		// 更新面板标题
		const title = panel.querySelector('.tm-history-panel-title');
		if (title) title.textContent = `历史数据 - ${nickName}`;
	}
	async function showCreatorHistory(creatorNickName) {
		if (!creatorNickName) {
			alert('缺少达人昵称');
			return;
		}

		const panel = ensureHistoryPanel();
		const content = panel.querySelector('.tm-history-panel-content');

		// 显示面板
		panel.classList.add('visible');
		panel.classList.remove('collapsed');
		const collapseBtn = panel.querySelector('#tm-history-collapse');
		if (collapseBtn) collapseBtn.textContent = '−';

		// 显示加载状态
		if (content) {
			content.innerHTML = '<div class="tm-history-loading">加载中...</div>';
		}

		try {
			// 计算日期范围用于显示
			const today = new Date();
			const endDate = new Date(today);
			endDate.setHours(0, 0, 0, 0);
			const startDate = new Date(today);
			startDate.setDate(startDate.getDate() - 30);
			startDate.setHours(0, 0, 0, 0);

			function formatDate(d) {
				const y = d.getFullYear();
				const m = String(d.getMonth() + 1).padStart(2, '0');
				const day = String(d.getDate()).padStart(2, '0');
				return `${y}-${m}-${day}`;
			}

			const dateRange = {
				start: formatDate(startDate),
				end: formatDate(endDate)
			};

			// 并行获取历史数据和申样记录
			const [historyData, sampleData] = await Promise.allSettled([
				fetchCreatorHistoryData(creatorNickName),
				fetchSampleGroupList(creatorNickName)
			]);

			const historyResult = historyData.status === 'fulfilled' ? historyData.value : null;
			const sampleGroupResult = sampleData.status === 'fulfilled' ? sampleData.value : null;

			// 获取申样详情（如果有组）
			let sampleDetails = null;
			if (sampleGroupResult && sampleGroupResult.code === 0 && sampleGroupResult.agg_info && sampleGroupResult.agg_info.length > 0) {
				const group = sampleGroupResult.agg_info[0];
				const groupId = group?.apply_group?.group_id;
				const groupType = group?.apply_group?.group_id_type || 1;
				if (groupId) {
					try {
						const detailResult = await fetchSampleApplyList(groupId, groupType);
						if (detailResult && detailResult.code === 0) {
							sampleDetails = detailResult;
						}
					} catch (e) {
						console.warn('[历史数据] 获取申样详情失败:', e);
					}
				}
			}

			await renderHistoryData(panel, historyResult, creatorNickName, dateRange, sampleGroupResult, sampleDetails);

			// 异步加载总体履约内容统计
			if (sampleDetails && sampleDetails.code === 0 && sampleDetails.apply_infos && sampleDetails.apply_infos.length > 0) {
				fetchAllPerformanceStats(sampleDetails.apply_infos).then(stats => {
					const statsElement = panel.querySelector('#tm-performance-stats');
					if (statsElement) {
						const formatNumber = (num) => {
							if (typeof num !== 'number' || isNaN(num)) return '0';
							if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
							if (num >= 1000) return (num / 1000).toFixed(2) + 'K';
							return num.toLocaleString('zh-CN');
						};

						statsElement.innerHTML = `
							<div style="color: #111827; font-weight: 600; font-size: 14px; margin-bottom: 10px;">履约内容统计</div>
							<div style="display: flex; flex-direction: column; gap: 6px; font-size: 12px;">
								<div style="padding-bottom: 8px; border-bottom: 1px solid #e5e7eb;">
									<span style="color: #6b7280;">总履约内容数:</span> <span style="color: #111827; font-weight: 600;">${stats.totalContentCount}</span>
									<span style="color: #6b7280; margin-left: 12px;">短视频:</span> <span style="color: #3b82f6; font-weight: 600;">${stats.videoCount}</span>
									<span style="color: #6b7280; margin-left: 12px;">直播:</span> <span style="color: #8b5cf6; font-weight: 600;">${stats.liveCount}</span>
								</div>
								<div style="padding-top: 8px; display: flex; flex-direction: column; gap: 4px;">
									<div><span style="color: #6b7280;">短视频总播放:</span> <span style="color: #111827; font-weight: 600;">${formatNumber(stats.videoTotalViews)}</span> <span style="color: #6b7280; margin-left: 12px;">总出单:</span> <span style="color: #111827; font-weight: 600;">${formatNumber(stats.videoTotalOrders)}</span></div>
									<div><span style="color: #6b7280;">直播总播放:</span> <span style="color: #111827; font-weight: 600;">${formatNumber(stats.liveTotalViews)}</span> <span style="color: #6b7280; margin-left: 12px;">总出单:</span> <span style="color: #111827; font-weight: 600;">${formatNumber(stats.liveTotalOrders)}</span></div>
								</div>
							</div>
						`;
					}
				}).catch(e => {
					console.error('[履约统计] 加载失败:', e);
					const statsElement = panel.querySelector('#tm-performance-stats');
					if (statsElement) {
						statsElement.innerHTML = `
							<div style="color: #991b1b; font-size: 12px;">履约内容统计加载失败</div>
						`;
					}
				});

				// 异步加载每个申请的履约内容统计
				sampleDetails.apply_infos.forEach((apply) => {
					const applyId = apply.apply_id || '';
					const mainOrderId = apply.main_order_id || '';

					// 只查询main_order_id不为0的申请
					if (applyId && mainOrderId && mainOrderId !== '0') {
						fetchSingleApplyPerformanceStats(applyId).then(stats => {
							const statsElementId = `tm-apply-performance-stats-${applyId}`;
							const statsElement = panel.querySelector(`#${statsElementId}`);
							if (statsElement) {
								const formatNumber = (num) => {
									if (typeof num !== 'number' || isNaN(num)) return '0';
									if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
									if (num >= 1000) return (num / 1000).toFixed(2) + 'K';
									return num.toLocaleString('zh-CN');
								};

								statsElement.innerHTML = `
									<div style="color: #111827; font-weight: 600; font-size: 12px; margin-bottom: 6px;">履约内容统计</div>
									<div style="display: flex; flex-direction: column; gap: 4px; font-size: 11px;">
										<div style="padding-bottom: 6px; border-bottom: 1px solid #e5e7eb;">
											<span style="color: #6b7280;">总履约内容数:</span> <span style="color: #111827; font-weight: 600;">${stats.totalContentCount}</span>
											<span style="color: #6b7280; margin-left: 10px;">短视频:</span> <span style="color: #3b82f6; font-weight: 600;">${stats.videoCount}</span>
											<span style="color: #6b7280; margin-left: 10px;">直播:</span> <span style="color: #8b5cf6; font-weight: 600;">${stats.liveCount}</span>
										</div>
										<div style="padding-top: 6px; display: flex; flex-direction: column; gap: 3px;">
											<div><span style="color: #6b7280;">短视频总播放:</span> <span style="color: #111827; font-weight: 600;">${formatNumber(stats.videoTotalViews)}</span> <span style="color: #6b7280; margin-left: 10px;">总出单:</span> <span style="color: #111827; font-weight: 600;">${formatNumber(stats.videoTotalOrders)}</span></div>
											<div><span style="color: #6b7280;">直播总播放:</span> <span style="color: #111827; font-weight: 600;">${formatNumber(stats.liveTotalViews)}</span> <span style="color: #6b7280; margin-left: 10px;">总出单:</span> <span style="color: #111827; font-weight: 600;">${formatNumber(stats.liveTotalOrders)}</span></div>
										</div>
									</div>
								`;
							}
						}).catch(e => {
							console.error(`[履约统计] 单个申请加载失败 (applyId: ${applyId}):`, e);
							const statsElementId = `tm-apply-performance-stats-${applyId}`;
							const statsElement = panel.querySelector(`#${statsElementId}`);
							if (statsElement) {
								statsElement.innerHTML = `
									<div style="color: #991b1b; font-size: 11px;">履约内容统计加载失败</div>
								`;
							}
						});
					}
				});
			}
		} catch (e) {
			console.error('[历史数据] 加载失败:', e);
			if (content) {
				content.innerHTML = `<div class="tm-history-error">加载失败: ${e.message || String(e)}</div>`;
			}
		}
	}
	function ensureHistoryButton(container, creatorNickName) {
		if (!container) return;

		// 首先在整个行范围内检查是否已存在历史数据按钮（避免重复注入）
		let targetRow = null;
		if (container.nodeName === 'TR' || container.closest('tr.arco-table-tr')) {
			targetRow = container.nodeName === 'TR' ? container : container.closest('tr.arco-table-tr');
		}

		if (targetRow) {
			const existingBtn = targetRow.querySelector('.tm-history-btn');
			if (existingBtn) {
				// 如果已存在按钮，更新昵称数据并返回
				if (creatorNickName) existingBtn.dataset.creatorNickName = creatorNickName;
				return;
			}
		}

		// 查找 .tm-ec-inline 容器（可能在不同层级）
		let holder = null;
		// 首先在 container 内查找
		holder = container.querySelector('.tm-ec-inline');
		// 如果没找到，尝试在 container 的父元素或子元素中查找
		if (!holder) {
			if (container.classList && container.classList.contains('tm-ec-inline')) {
				holder = container;
			} else {
				holder = container.parentElement?.querySelector('.tm-ec-inline') ||
				         container.querySelector('.tm-ec-inline') ||
				         (container.querySelector ? null : document.querySelector('.tm-ec-inline'));
			}
		}
		// 如果还是没找到，尝试通过查找 creator 按钮来定位
		if (!holder) {
			const creatorBtn = container.querySelector('.tm-ec-link-btn');
			if (creatorBtn && creatorBtn.parentElement && creatorBtn.parentElement.classList.contains('tm-ec-inline')) {
				holder = creatorBtn.parentElement;
			}
		}

		if (!holder) {
			console.warn('[历史数据] 未找到 .tm-ec-inline 容器');
			return;
		}

		// 再次检查 holder 内是否已存在历史数据按钮（双重检查）
		let historyBtn = holder.querySelector('.tm-history-btn');
		if (historyBtn) {
			// 更新按钮的昵称数据
			if (creatorNickName) historyBtn.dataset.creatorNickName = creatorNickName;
			return;
		}

		// 创建历史数据按钮
		historyBtn = document.createElement('button');
		historyBtn.type = 'button';
		historyBtn.className = 'tm-history-btn';
		historyBtn.textContent = '历史数据';
		if (creatorNickName) historyBtn.dataset.creatorNickName = creatorNickName;

		// 确保历史数据按钮是第一个元素
		const firstChild = holder.firstChild;
		if (firstChild) {
			holder.insertBefore(historyBtn, firstChild);
		} else {
			holder.appendChild(historyBtn);
		}

		historyBtn.addEventListener('click', async (e) => {
			const self = e.currentTarget;
			if (self.disabled) return;

			const nickName = self.dataset.creatorNickName || '';
			if (!nickName) {
				// 尝试从附近元素获取昵称
				const row = self.closest('tr.arco-table-tr');
				if (row) {
					const nameEl = row.querySelector('div[data-e2e="d24ea79a-0cbc-ea5a"].text-neutral-text2.truncate');
					if (nameEl && nameEl.textContent) {
						const extracted = findHandleInRow(row) || nameEl.textContent.trim();
						self.dataset.creatorNickName = extracted.replace(/^@+/, '').trim();
						await showCreatorHistory(self.dataset.creatorNickName);
						return;
					}
				}
				alert('缺少达人昵称');
				return;
			}

			self.disabled = true;
			const originalText = self.textContent;
			self.textContent = '加载中...';

			try {
				await showCreatorHistory(nickName);
			} catch (err) {
				console.error('[历史数据] 显示失败:', err);
			} finally {
				self.disabled = false;
				self.textContent = originalText;
			}
		});

		// 重新排序以确保正确顺序
		reorderEcInlineElements(holder);

		console.log('[历史数据] 按钮已添加到容器:', holder, '昵称:', creatorNickName);

		// 修复父容器的宽度限制问题
		fixParentContainerWidth(holder);
	}

	// 修复包含 .tm-ec-inline 的父容器宽度限制
	function fixParentContainerWidth(holder) {
		if (!holder) return;

		// 向上查找，找到可能有宽度限制的父容器
		let current = holder.parentElement;
		const maxDepth = 5; // 最多向上查找5层
		let depth = 0;

		while (current && depth < maxDepth) {
			// 检查是否是那个有固定宽度的容器
			if (current.hasAttribute && current.hasAttribute('data-e2e')) {
				const e2e = current.getAttribute('data-e2e');
				if (e2e === '24ee33ed-b8cc-3e07') {
					// 移除固定宽度限制
					current.style.width = 'auto';
					current.style.minWidth = 'max-content';
					current.style.maxWidth = 'none';
					current.style.overflow = 'visible';
					console.log('[历史数据] 修复父容器宽度:', current);
					break;
				}
			}

			// 检查是否有固定宽度且可能截断内容
			const computedStyle = window.getComputedStyle(current);
			const width = computedStyle.width;
			if (width && width !== 'auto' && !width.includes('calc') && parseFloat(width) < 200) {
				// 如果有固定宽度且小于200px，可能有问题
				const overflow = computedStyle.overflow;
				if (overflow === 'hidden' || overflow === 'clip') {
					current.style.overflow = 'visible';
					current.style.width = 'auto';
					current.style.minWidth = 'max-content';
					console.log('[历史数据] 修复可能的宽度限制:', current, '原宽度:', width);
				}
			}

			current = current.parentElement;
			depth++;
		}
	}
	function injectEcButtonForRow(targetRow, handle, creatorNameHint){ try { if(!targetRow) return; const anchor = targetRow.querySelector('div[data-e2e="d24ea79a-0cbc-ea5a"].text-neutral-text2.truncate'); if(!anchor) return; // afterend 方式紧邻右侧
		// 先创建 holder（若不存在）并插入到 anchor 后
		let holder = anchor.parentElement?.querySelector(':scope > .tm-ec-inline');
		if(!holder){ holder=document.createElement('span'); holder.className='tm-ec-inline'; anchor.insertAdjacentElement('afterend', holder); }
		// 强制与昵称左对齐：让 holder 继承锚点父容器的文本对齐与baseline
		holder.style.marginLeft='0';
		// 解析 handle：优先使用主行用户名（@handle 所在元素），其次入参，最后昵称/文本
		let useHandle = '';
		const usernameEl = targetRow.querySelector('div[data-e2e="3400f272-24ac-3b76"] .truncate, div[data-e2e="3400f272-24ac-3b76"].truncate');
		if (usernameEl && usernameEl.textContent) useHandle = String(usernameEl.textContent).trim();
		if (!useHandle) useHandle = String(handle||'').trim();
		if (!useHandle) useHandle = String(creatorNameHint||'').trim();
		if (!useHandle) useHandle = findHandleInRow(targetRow);
		useHandle = useHandle.replace(/^@+/, '').trim();
		if(!useHandle){ console.warn('[EC][手动] 未找到 handle，将跳过该行'); return; }

		// 添加历史数据按钮
		ensureHistoryButton(holder || holder.parentElement || anchor.parentElement || targetRow, useHandle);

		// 自动查询EC信息（不显示手动按钮）
		if (useHandle) {
			fetchAndRenderEcInfo(holder || holder.parentElement || anchor.parentElement || targetRow, useHandle, { silent: true }).catch(()=>{});
		}
	} catch(e) { console.warn('[EC][手动] 注入失败:', e); } }

	async function loadCacheIfNeeded() { if (invitationCache) return; invitationCache = await loadCompressed(STORAGE_KEY); if (!invitationCache) invitationCache = { invitations: {} }; }
	function processGroupListResponse(responseText) { try { const listData = JSON.parse(responseText); if (!listData || !Array.isArray(listData.agg_info)) return; listData.agg_info.forEach(item => { const groupId = item.apply_group?.group_id; const creatorId = item.apply_group?.creator_info?.creator_id; const handle = `@${item.apply_group?.creator_info?.name}`; if (groupId && creatorId && handle) groupCreatorMap[groupId] = { creatorId, handle }; }); } catch (e) { console.error('[合并] 解析达人分组列表失败:', e); } }

	// 处理 In-progress（tab=40）列表响应：直接在记录行 Order ID 右侧渲染定邀名称
	async function processInProgressListResponse(responseText) {
		try {
			const data = JSON.parse(responseText);
			const agg = Array.isArray(data?.agg_info) ? data.agg_info : [];
			if (agg.length === 0) return;
			await loadCacheIfNeeded();
			for (const entry of agg) {
				const info = entry?.apply_deatil?.apply_info || entry?.apply_detail?.apply_info || null;
				const creator = entry?.apply_deatil?.creator_info || entry?.apply_detail?.creator_info || null;
				if (!info || !creator) continue;
				const productId = String(info.product_id || '');
				const orderId = String(info.main_order_id || '');
				const creatorId = String(creator.creator_id || '');
				const nickName = String(creator.nick_name || '');
				const creatorName = String(creator.name || '');
				if (!productId || !creatorId || !nickName || !orderId) continue;
				const invitationName = findMatchedInvitation(creatorId, productId);
				if (invitationName) {
					renderInvitationNameNearOrder(nickName, orderId, invitationName, creatorName);
				}
				// 注入历史数据按钮（EC信息自动查询）
				try {
					let targetRow = null;
					const rows = document.querySelectorAll('tr.arco-table-tr');
					for (const row of rows) { if (row.textContent && row.textContent.includes(nickName)) { targetRow = row; break; } }
					if (targetRow) {
						injectEcButtonForRow(targetRow, creatorName, creatorName);
					}
				} catch {}
			}
		} catch (e) {
			console.error('[合并] 解析 In-progress 列表失败:', e);
		}
	}

	// 在包含 nick_name 的记录行内，定位“Order ID: <orderId>”的元素，并在其右侧插入定邀名称
	function renderInvitationNameNearOrder(nickName, orderId, invitationName, creatorNameHint) {
		let attempts = 0; const maxAttempts = 40; const interval = 500;
		const timer = setInterval(() => {
			attempts++;
			// 找到包含 nick_name 的行（不依赖不稳定的 data-e2e 值）
			let targetRow = null;
			const rows = document.querySelectorAll('tr.arco-table-tr');
			for (const row of rows) {
				if (row.textContent && row.textContent.includes(nickName)) { targetRow = row; break; }
			}
			if (!targetRow) { if (attempts > maxAttempts) clearInterval(timer); return; }

			// 在该行内寻找包含“Order ID:”且匹配 orderId 的元素
			const allSpans = targetRow.querySelectorAll('span, div');
			let orderSpan = null;
			for (const el of allSpans) {
				const txt = (el.textContent || '').trim();
				if (!txt) continue;
				if (txt.startsWith('Order ID:')) {
					const digits = txt.replace(/\D+/g, '');
					if (digits && (orderId.startsWith(digits) || digits.startsWith(orderId))) { orderSpan = el; break; }
				}
			}
			if (!orderSpan) { if (attempts > maxAttempts) clearInterval(timer); return; }

			// 若尚未插入，则在其右侧添加标记
			if (!orderSpan.parentElement.querySelector('.invitation-name-tag')) {
				const tag = document.createElement('span');
				tag.className = 'invitation-name-tag';
				tag.textContent = invitationName;
				orderSpan.insertAdjacentElement('afterend', tag);
			}
			// 不再在定邀name后注入手动EC按钮
			clearInterval(timer);
		}, interval);
	}

	// ================= 在历史数据按钮区域渲染定邀信息和达人数据 (用于 Ready to Ship/Shipped/Completed/In-progress/Canceled 状态) =================
	/**
	 * 在历史数据按钮区域渲染定邀信息和达人数据
	 * 第一行：历史数据按钮 + creator按钮 + EC信息 + 定邀名称（如果有）
	 * 第二行：GMV | 履约率 | 观看（Ready to Ship 状态不显示）
	 * @param {Object} params - 参数对象
	 * @param {string} params.creatorHandle - 达人handle (如 @userqio61ibb45)
	 * @param {string} params.creatorNick - 达人昵称 (用于辅助定位)
	 * @param {string} params.productId - 产品ID
	 * @param {string} params.productTitle - 产品标题 (用于辅助匹配)
	 * @param {string} params.skuImage - 产品图片URL (用于辅助匹配)
	 * @param {string} params.invitationName - 定邀名称（可选）
	 * @param {string} params.gmv - GMV值
	 * @param {string} params.fulfillmentRate - 履约率
	 * @param {string} params.contentVideoViews - 内容视频观看数
	 * @param {number} params.tab - 状态标签 (20=Ready to Ship, 30=Shipped, 40=In-progress, 100=Completed, 56=Canceled)
	 */
	function renderInvitationBelowCommission({ creatorHandle, creatorNick, productId, productTitle, skuImage, invitationName, gmv, fulfillmentRate, contentVideoViews, tab }) {
		let attempts = 0;
		const maxAttempts = 40;
		const interval = 500;

		const timer = setInterval(() => {
			attempts++;

			try {
				// 1. 找到所有包含该达人handle的行（可能有多行）
				const allRows = document.querySelectorAll('tr.arco-table-tr');
				const candidateRows = [];

				for (const row of allRows) {
					const handleEl = row.querySelector('div[data-e2e="3400f272-24ac-3b76"]');
					if (handleEl && handleEl.textContent.trim() === creatorHandle) {
						candidateRows.push(row);
					}
				}

				if (candidateRows.length === 0) {
					if (attempts > maxAttempts) {
						console.warn('[定邀回显] 未找到达人行:', creatorHandle);
						clearInterval(timer);
					}
					return;
				}

				dbg(`[定邀回显] 找到 ${candidateRows.length} 个匹配达人的行`);

				// 2. 在这些候选行中，找到匹配产品的那一行
				let targetRow = null;

				if (candidateRows.length === 1) {
					// 只有一行，直接使用
					targetRow = candidateRows[0];
				} else {
					// 多行时，通过产品标题或图片进行二次匹配
					for (const row of candidateRows) {
						// 方法1: 通过产品标题匹配
						const titleEl = row.querySelector('span[data-e2e="5810fc19-8066-252a"]');
						if (titleEl) {
							const titleText = titleEl.textContent.trim();
							// 使用产品标题的前30个字符进行匹配（避免完全匹配失败）
							const productTitlePrefix = productTitle.substring(0, 30);
							if (titleText.includes(productTitlePrefix) || productTitlePrefix.includes(titleText.substring(0, 30))) {
								targetRow = row;
								dbg('[定邀回显] 通过产品标题匹配成功');
								break;
							}
						}

						// 方法2: 通过产品图片URL匹配（如果标题匹配失败）
						if (!targetRow && skuImage) {
							const imgEl = row.querySelector('img.arco-image-img');
							if (imgEl && imgEl.src) {
								// 提取图片URL的关键部分（去掉参数）
								const extractImageKey = (url) => {
									try {
										const urlObj = new URL(url);
										return urlObj.pathname;
									} catch {
										return url;
									}
								};

								const apiImageKey = extractImageKey(skuImage);
								const domImageKey = extractImageKey(imgEl.src);

								if (apiImageKey === domImageKey) {
									targetRow = row;
									dbg('[定邀回显] 通过产品图片匹配成功');
									break;
								}
							}
						}
					}

					// 如果还是没找到，使用第一个（降级策略）
					if (!targetRow) {
						console.warn('[定邀回显] 无法精确匹配产品，使用第一个匹配的行');
						targetRow = candidateRows[0];
					}
				}

				// 3. 在目标行中找到 .tm-ec-inline 容器（历史数据按钮所在容器）
				let ecInlineContainer = targetRow.querySelector('.tm-ec-inline');
				if (!ecInlineContainer) {
					if (attempts > maxAttempts) {
						console.warn('[定邀回显] 未找到 .tm-ec-inline 容器:', creatorHandle);
						clearInterval(timer);
					}
					return;
				}

				// 4. 检查是否已经插入过（避免重复）
				const uniqueClass = `creator-metrics-${productId.replace(/\D/g, '')}`;
				if (ecInlineContainer.querySelector(`.${uniqueClass}`)) {
					dbg('[定邀回显] 该产品的信息已存在，跳过');
					clearInterval(timer);
					return;
				}

				// 5. 第一行：定邀名称（如果有，放在第一行）
				if (invitationName) {
					const invitationNameOnly = document.createElement('span');
					invitationNameOnly.className = `invitation-name-only ${uniqueClass}`;
					invitationNameOnly.textContent = invitationName;
					invitationNameOnly.title = `定邀: ${invitationName}\n产品ID: ${productId}`;
					// 确保插入在 EC 级别之后，但在 metricsRow 之前
					const ecLevel = ecInlineContainer.querySelector('.tm-ec-level');
					if (ecLevel && ecLevel.nextSibling) {
						ecInlineContainer.insertBefore(invitationNameOnly, ecLevel.nextSibling);
					} else {
						ecInlineContainer.appendChild(invitationNameOnly);
					}
				}

				// 6. 第二行：达人数据（GMV | 履约率 | 观看），Ready to Ship(20) 状态不显示
				if (tab !== 20) {
					const metricsRow = document.createElement('span');
					metricsRow.className = `creator-metrics-row ${uniqueClass}`;

					// 构建达人数据文本
					const metricsParts = [];
					if (gmv) metricsParts.push(`GMV: ${gmv}`);
					if (fulfillmentRate) metricsParts.push(`履约率: ${fulfillmentRate}`);
					if (contentVideoViews) metricsParts.push(`观看: ${contentVideoViews}`);

					if (metricsParts.length > 0) {
						// 添加分隔符和数据
						metricsParts.forEach((part, index) => {
							if (index > 0) {
								const separator = document.createElement('span');
								separator.textContent = ' | ';
								separator.style.cssText = 'color: #d1d5db; font-size: 11px; white-space: nowrap; flex-shrink: 0; margin: 0 2px;';
								metricsRow.appendChild(separator);
							}

							const dataSpan = document.createElement('span');
							dataSpan.textContent = part;

							// 根据内容类型设置不同的颜色
							let textColor = '#6b7280'; // 默认灰色
							if (part.startsWith('GMV:')) {
								textColor = '#059669'; // 绿色，表示金额
							} else if (part.startsWith('履约率:')) {
								textColor = '#2563eb'; // 蓝色，表示百分比
							} else if (part.startsWith('观看:')) {
								textColor = '#dc2626'; // 红色，表示观看数
							}

							dataSpan.style.cssText = `font-size: 11px; color: ${textColor}; font-weight: 500; white-space: nowrap; flex-shrink: 0;`;
							metricsRow.appendChild(dataSpan);
						});

						metricsRow.title = `产品ID: ${productId}${gmv ? `\nGMV: ${gmv}` : ''}${fulfillmentRate ? `\n履约率: ${fulfillmentRate}` : ''}${contentVideoViews ? `\n观看: ${contentVideoViews}` : ''}`;

						// 插入到 .tm-ec-inline 容器的末尾（确保在第二行）
						ecInlineContainer.appendChild(metricsRow);
					}
				}

				// 重新排序以确保正确顺序
				reorderEcInlineElements(ecInlineContainer);

				console.log('[定邀回显] ✅ 渲染成功:', {
					creatorHandle,
					productTitle: productTitle.substring(0, 30) + '...',
					invitationName
				});

				clearInterval(timer);

			} catch (e) {
				console.error('[定邀回显] 渲染过程出错:', e);
				if (attempts > maxAttempts) clearInterval(timer);
			}

		}, interval);
	}

	// ================= 处理 Ready to Ship/Shipped/In-progress/Completed/Canceled 状态的响应 =================
	/**
	 * 处理 Ready to Ship(20)/Shipped(30)/In-progress(40)/Completed(100)/Canceled(56) 状态的响应
	 * @param {string} responseText - API 响应文本
	 * @param {number} tab - 状态标签 (20/30/40/100/56)
	 */
	async function processShippedCompletedInProgressResponse(responseText, tab) {
		try {
			const data = JSON.parse(responseText);
			const aggInfo = Array.isArray(data?.agg_info) ? data.agg_info : [];

			if (aggInfo.length === 0) {
				dbg(`[定邀回显][Tab=${tab}] 无数据`);
				return;
			}

			console.log(`[定邀回显][Tab=${tab}] 开始处理 ${aggInfo.length} 条记录`);

			await loadCacheIfNeeded();

			for (const entry of aggInfo) {
				try {
					// 1. 提取达人信息（支持多种数据结构）
					let creatorInfo = entry?.apply_group?.creator_info;

					// 如果 apply_group 中没有，尝试从 apply_detail/apply_deatil 中获取
					if (!creatorInfo) {
						const applyDetail = entry?.apply_detail || entry?.apply_deatil;
						creatorInfo = applyDetail?.creator_info;
					}

					if (!creatorInfo) {
						console.warn('[定邀回显] 缺少 creator_info', entry);
						continue;
					}

					const creatorId = String(creatorInfo.creator_id || '');
					const creatorHandle = String(creatorInfo.name || '').trim();
					const creatorNick = String(creatorInfo.nick_name || '').trim();
					// 提取达人数据字段
					const gmv = String(creatorInfo.gmv || '').trim();
					const fulfillmentRate = String(creatorInfo.fulfillment_rate || '').trim();
					const contentVideoViews = String(creatorInfo.content_video_views || '').trim();

					if (!creatorId || !creatorHandle) {
						console.warn('[定邀回显] 缺少 creatorId 或 handle', creatorInfo);
						continue;
					}

					// 2. 提取产品信息（注意字段可能是 apply_detail 或 apply_deatil）
					const applyDetail = entry?.apply_detail || entry?.apply_deatil;
					const applyInfo = applyDetail?.apply_info;

					if (!applyInfo) {
						console.warn('[定邀回显] 缺少 apply_info', entry);
						continue;
					}

					const productId = String(applyInfo.product_id || '');
					const productTitle = String(applyInfo.product_title || '').trim();
					const skuImage = String(applyInfo.sku_image || '').trim();

					if (!productId) {
						console.warn('[定邀回显] 缺少 productId', applyInfo);
						continue;
					}

					// 3. 匹配定邀名称（可选）
					const invitationName = findMatchedInvitation(creatorId, productId);

					if (invitationName) {
						console.log(`[定邀回显] 匹配成功: ${invitationName}`, {
							creatorHandle,
							productId,
							productTitle: productTitle.substring(0, 30)
						});
					} else {
						dbg(`[定邀回显] 未匹配到定邀: creator=${creatorId}, product=${productId}，但会显示达人数据`);
					}

					// 4. 渲染定邀名称和达人数据（无论是否有定邀名称，都会显示达人数据，但 Ready to Ship 状态只显示定邀名称）
					renderInvitationBelowCommission({
						creatorHandle: creatorHandle.startsWith('@') ? creatorHandle : `@${creatorHandle}`,
						creatorNick,
						productId,
						productTitle,
						skuImage,
						invitationName: invitationName || null, // 可能为 null
						gmv,
						fulfillmentRate,
						contentVideoViews,
						tab // 传递 tab 参数
					});

					// 5. 注入历史数据按钮和EC信息
					try {
						let targetRow = null;
						const rows = document.querySelectorAll('tr.arco-table-tr');
						for (const row of rows) {
							const handleEl = row.querySelector('div[data-e2e="3400f272-24ac-3b76"]');
							if (handleEl && handleEl.textContent.trim() === (creatorHandle.startsWith('@') ? creatorHandle : `@${creatorHandle}`)) {
								targetRow = row;
								break;
							}
						}
						if (targetRow) {
							injectEcButtonForRow(targetRow, creatorHandle, creatorNick);
						}
					} catch (e) {
						console.warn('[定邀回显] 注入EC按钮失败:', e);
					}

				} catch (e) {
					console.error('[定邀回显] 处理单条记录失败:', e, entry);
				}
			}

			console.log(`[定邀回显][Tab=${tab}] 处理完成`);

		} catch (e) {
			console.error(`[定邀回显][Tab=${tab}] 处理响应失败:`, e);
		}
	}

	async function processApplyListResponse(responseText, requestUrl) {
		try {
			await loadCacheIfNeeded();
			let applyData = null;
			try {
				applyData = JSON.parse(responseText);
			} catch (err) {
				console.warn('[合并] 样品申请响应解析失败:', err);
				return;
			}
			const urlObj = safeParseURL(requestUrl);
			const groupId = urlObj?.searchParams?.get('group_id') || '';
			let creatorInfo = groupCreatorMap[groupId];
			if (!creatorInfo || !creatorInfo.creatorId) {
				const fallback = extractCreatorInfoFromApplyData(applyData);
				if (fallback.creatorId) {
					creatorInfo = fallback;
					if (groupId) {
						groupCreatorMap[groupId] = creatorInfo;
					}
				}
			}
			if (!creatorInfo || !creatorInfo.creatorId) return;
			const applyInfos = Array.isArray(applyData.apply_infos) ? applyData.apply_infos : [];
			if (!applyInfos.length) return;
			for (const product of applyInfos) {
				const productIdRaw = product?.product_id ?? product?.id;
				const productId = productIdRaw ? String(productIdRaw) : '';
				if (!productId) continue;
				let creatorIdForProduct = String(creatorInfo.creatorId || '');
				let handleForProduct = creatorInfo.handle || '';
				if (!creatorIdForProduct || !handleForProduct || handleForProduct.length < 2) {
					const derived = extractCreatorInfoFromApplyProduct(product, creatorInfo.handle || '');
					if (derived.creatorId) creatorIdForProduct = String(derived.creatorId);
					if (derived.handle) handleForProduct = derived.handle;
				}
				const matchName = findMatchedInvitation(creatorIdForProduct, productId);
				if (matchName) {
					const nameHint = product?.creator_nick_name || product?.creator_name || handleForProduct.replace(/^@/, '');
					renderTags(handleForProduct, productId, matchName, nameHint);
				}
			}
		} catch (e) {
			console.error('[合并] 处理样品申请详情并匹配时出错:', e);
		}
	}
	function findMatchedInvitation(creatorId, productId) { const map = invitationCache?.invitations || {}; for (const invId in map) { const inv = map[invId]; if (!inv) continue; const hasProduct = Array.isArray(inv.productIds) && inv.productIds.includes(String(productId)); const hasCreator = Array.isArray(inv.creatorIds) && inv.creatorIds.includes(String(creatorId)); if (hasProduct && hasCreator) return inv.name; } return null; }
	function safeParseURL(urlString) { try { return new URL(urlString, location.origin); } catch { return null; } }
	function normalizeHandleText(value) { if (!value) return ''; const text = String(value).trim(); if (!text) return ''; return text.startsWith('@') ? text : `@${text}`; }
	function selectCreatorInfo(candidate, fallbackNickName = '') {
		if (!candidate || typeof candidate !== 'object') return { creatorId: '', handle: fallbackNickName ? fallbackNickName : '' };
		const creatorId = candidate.creator_id || candidate.creatorId || candidate.creator_oec_id || candidate.creator_oecid || candidate.id || candidate.creator_uid || candidate.tt_oec_uid;
		let handle = candidate.creator_handle || candidate.creator_user_name || candidate.user_name || candidate.username || candidate.name || candidate.creator_name;
		if (!handle && candidate.base_info) {
			const base = candidate.base_info;
			const baseId = base.creator_id || base.creatorId || base.creator_oec_id;
			handle = handle || base.creator_handle || base.creator_user_name || base.name;
			if (!creatorId && baseId) {
				return { creatorId: String(baseId), handle: normalizeHandleText(handle || fallbackNickName) || (fallbackNickName || '') };
			}
		}
		const nick = candidate.nick_name || candidate.creator_nick_name || candidate.display_name || fallbackNickName;
		return {
			creatorId: creatorId ? String(creatorId) : '',
			handle: normalizeHandleText(handle) || (nick ? String(nick) : '')
		};
	}
	function extractCreatorInfoFromApplyData(applyData) {
		if (!applyData || typeof applyData !== 'object') return { creatorId: '', handle: '' };
		const candidates = [
			applyData.apply_group?.creator_info,
			applyData.creator_info,
			Array.isArray(applyData.apply_infos) && applyData.apply_infos.length ? applyData.apply_infos[0].creator_info : null,
			Array.isArray(applyData.apply_infos) && applyData.apply_infos.length ? applyData.apply_infos[0].creator : null,
			Array.isArray(applyData.apply_infos) && applyData.apply_infos.length ? applyData.apply_infos[0] : null
		];
		for (const candidate of candidates) {
			const info = selectCreatorInfo(candidate);
			if (info.creatorId) return info;
		}
		return { creatorId: '', handle: '' };
	}
	function extractCreatorInfoFromApplyProduct(product, fallbackHandle = '') {
		if (!product || typeof product !== 'object') return { creatorId: '', handle: fallbackHandle };
		const candidates = [
			product.creator_info,
			product.creator,
			product.base_info,
			product.creator_base_info,
			product
		];
		for (const candidate of candidates) {
			const info = selectCreatorInfo(candidate, product.creator_nick_name || product.creator_name || fallbackHandle);
			if (info.creatorId) return info;
		}
		return { creatorId: '', handle: fallbackHandle };
	}
	function renderTags(handle, productId, invitationName, creatorNameHint = '') {
		let attempts = 0; const maxAttempts = 40; const interval = 500;
		const targetHandle = String(handle || '').trim();
		const targetName = String(creatorNameHint || '').trim();
		const id = setInterval(() => {
			attempts++;
			let creatorRow = null;
			const rows = document.querySelectorAll('tr.arco-table-tr');
			for (const row of rows) {
				const text = row.textContent || '';
				if (!text) continue;
				if (targetHandle && text.includes(targetHandle)) {
					creatorRow = row;
					if (row.classList.contains('arco-table-row-expanded')) break;
				}
				if (!creatorRow && targetName && text.includes(targetName)) {
					creatorRow = row;
				}
			}
			if (!creatorRow) { if (attempts > maxAttempts) clearInterval(id); return; }
			let expandContentRow = creatorRow.nextElementSibling;
			if (!expandContentRow || !expandContentRow.classList.contains('arco-table-expand-content')) { if (attempts > maxAttempts) clearInterval(id); return; }
			let productDiv = findProductDivById(expandContentRow, productId);
			if (!productDiv) { if (attempts > maxAttempts) clearInterval(id); return; }
			if (!productDiv.querySelector('.invitation-name-tag')) {
				const tag = document.createElement('span');
				tag.className = 'invitation-name-tag';
				tag.textContent = invitationName;
				const msgBtn = productDiv.querySelector('button[data-tid="m4b_button"], button.arco-btn-icon-only');
				if (msgBtn && msgBtn.parentElement) msgBtn.insertAdjacentElement('afterend', tag);
				else productDiv.appendChild(tag);
			}
			// 不再在定邀名称后注入手动EC按钮
			clearInterval(id);
		}, interval);
	}
	function findProductDivById(expandContentRow, productId) { if (!expandContentRow || !productId) return null; const idPrefixes = buildIdPrefixes(productId); const candidates = expandContentRow.querySelectorAll('div[data-e2e="3a7ad23a-8136-80f2"]'); for (const container of candidates) { const typo = container.querySelector('div.arco-typography'); if (!typo) continue; const digits = extractDigits(typo.textContent || ''); if (!digits) continue; if (idPrefixes.some(prefix => digits.startsWith(prefix))) return container; } const allTypos = expandContentRow.querySelectorAll('div.arco-typography'); for (const el of allTypos) { const digits = extractDigits(el.textContent || ''); if (!digits) continue; if (idPrefixes.some(prefix => digits.startsWith(prefix))) return el.closest('div[data-e2e]') || el.parentElement || el; } const allDivs = expandContentRow.querySelectorAll('div'); for (const el of allDivs) { const digits = extractDigits(el.textContent || ''); if (!digits) continue; if (idPrefixes.some(prefix => digits.startsWith(prefix))) return el.closest('div[data-e2e]') || el; } return null; }
	function extractDigits(text) { return (text || '').replace(/\D+/g, ''); }
	function buildIdPrefixes(fullId) { const id = String(fullId).replace(/\D+/g, ''); const lengths = [18,17,16,15,14,13,12,10,8,6]; const set = new Set([id]); lengths.forEach(len => { if (id.length >= len) set.add(id.slice(0, len)); }); return Array.from(set); }
	async function processAndExpandRows() { if (isExpanding) return; const icons = document.querySelectorAll('img[data-e2e="1d3438e3-7ab1-0af5"].rotate-180:not([data-expansion-triggered])'); if (icons.length === 0) { alert('没有找到新的可展开项。'); return; } const controlButton = document.getElementById('tm-aff-expand'); if (controlButton) controlButton.disabled = true; isExpanding = true; for (let i=0;i<icons.length;i++){ const icon=icons[i]; if (controlButton) controlButton.innerText=`展开中... (${i+1}/${icons.length})`; icon.dataset.expansionTriggered='true'; icon.click(); if((i+1)%10===0&&(i+1)<icons.length) await new Promise(r=>setTimeout(r,1500)); else await new Promise(r=>setTimeout(r,300)); } isExpanding=false; if (controlButton) controlButton.innerText='全部分批展开'; if (controlButton) controlButton.disabled=false; }

	// ================= 注入按钮（仅 affiliate 页显示抓取相关） =================
	function addBtn(id, text, bottom, handler){ if (document.getElementById(id)) return; const btn=document.createElement('button'); btn.id=id; btn.textContent=text; Object.assign(btn.style,{ bottom: `${bottom}px` }); btn.className='tm-fixed-btn'; btn.onclick=handler; document.body.appendChild(btn); }
	function injectAffiliateButtons(){
		// 创建按钮容器，横向排列
		const container = document.createElement('div');
		container.id = 'tm-aff-buttons-container';
		container.style.cssText = 'position: fixed; bottom: 20px; right: 20px; z-index: 999999; display: flex; gap: 8px; flex-direction: row;';

		const btn1 = document.createElement('button');
		btn1.id = 'tm-aff-pull';
		btn1.textContent = '拉取全部信息';
		btn1.className = 'tm-fixed-btn';
		btn1.onclick = runAllFetchWithProgress;
		btn1.style.cssText = 'position: relative; bottom: auto; right: auto;';

		const btn2 = document.createElement('button');
		btn2.id = 'tm-aff-expand';
		btn2.textContent = '全部分批展开';
		btn2.className = 'tm-fixed-btn';
		btn2.onclick = processAndExpandRows;
		btn2.style.cssText = 'position: relative; bottom: auto; right: auto;';

		const btn3 = document.createElement('button');
		btn3.id = 'tm-aff-import-har';
		btn3.textContent = '导入 HAR 文件';
		btn3.className = 'tm-fixed-btn';
		btn3.onclick = importHarFile;
		btn3.style.cssText = 'position: relative; bottom: auto; right: auto;';

		container.appendChild(btn1);
		container.appendChild(btn2);
		container.appendChild(btn3);
		document.body.appendChild(container);
	}

	async function exportCache(){ try { const cache = await loadCompressed(STORAGE_KEY); if (!cache) { alert('没有缓存'); return; } const blob=new Blob([JSON.stringify(cache)],{type:'application/json;charset=utf-8'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=`invitation_cache_${new Date().toISOString().slice(0,19).replace(/[:T]/g,'-')}.json`; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url); alert('缓存导出完成'); } catch(e){ console.error('导出失败',e); alert('导出失败'); } }

	// ================= HAR 文件导入与解析 =================
	async function parseHarFile(harContent) {
		try {
			const har = typeof harContent === 'string' ? JSON.parse(harContent) : harContent;
			if (!har || !har.log || !Array.isArray(har.log.entries)) {
				throw new Error('无效的 HAR 文件格式');
			}

			const detailEndpoint = '/api/v1/oec/affiliate/seller/invitation_group/detail';
			const invitations = [];
			const processedIds = new Set();

			console.log('[HAR] 开始解析 HAR 文件，共', har.log.entries.length, '个请求');

			for (const entry of har.log.entries) {
				try {
					const requestUrl = entry.request?.url || '';
					const response = entry.response || {};

					// 检查是否是 detail API 请求
					if (!requestUrl.includes(detailEndpoint)) continue;

					// 检查响应状态
					if (response.status !== 200) {
						console.warn('[HAR] 跳过非200响应:', response.status, requestUrl);
						continue;
					}

					// 提取响应内容
					let responseText = '';
					const content = response.content || {};

					// 工具函数：将 base64 解码为 UTF-8 字符串
					function base64ToUtf8(base64Str) {
						try {
							// 修复 base64 字符串（处理 base64url 格式）
							const fixedStr = base64Str.replace(/-/g, '+').replace(/_/g, '/');
							// 添加必要的 padding
							const padding = (4 - (fixedStr.length % 4)) % 4;
							const paddedStr = fixedStr + '='.repeat(padding);

							// 使用 atob 解码为二进制字符串
							const binaryStr = atob(paddedStr);

							// 将二进制字符串转换为 UTF-8
							const bytes = new Uint8Array(binaryStr.length);
							for (let i = 0; i < binaryStr.length; i++) {
								bytes[i] = binaryStr.charCodeAt(i);
							}

							// 使用 TextDecoder 解码为 UTF-8 字符串
							const decoder = new TextDecoder('utf-8');
							return decoder.decode(bytes);
						} catch (e) {
							console.warn('[HAR] base64 转 UTF-8 失败，尝试直接解码:', e);
							// 降级方案：直接使用 atob
							try {
								return atob(base64Str.replace(/-/g, '+').replace(/_/g, '/'));
							} catch (e2) {
								throw new Error('无法解码 base64: ' + e2.message);
							}
						}
					}

					// 尝试多种方式获取响应文本
					if (content.text) {
						responseText = content.text;
						// HAR 文件可能使用 base64 编码
						if (content.encoding === 'base64' || content.encoding === 'base64url') {
							try {
								responseText = base64ToUtf8(responseText);
							} catch (e) {
								console.warn('[HAR] base64 解码失败，尝试直接使用:', e);
							}
						}
					} else if (content.mimeType?.includes('json')) {
						// 尝试从其他字段获取
						responseText = content.text || '';
					}

					// 如果仍然没有内容，尝试从 response.body 获取（某些 HAR 格式）
					if (!responseText && response.body) {
						responseText = typeof response.body === 'string' ? response.body : JSON.stringify(response.body);
					}

					if (!responseText || (typeof responseText === 'string' && responseText.trim().length === 0)) {
						console.warn('[HAR] 未找到响应内容，跳过该条目');
						continue;
					}

					// 解析 JSON 响应
					let responseData;
					try {
						responseData = JSON.parse(responseText);
					} catch (e) {
						console.warn('[HAR] JSON 解析失败:', e);
						continue;
					}

					// 提取 invitation 对象
					const invitation = responseData?.data?.invitation;
					if (!invitation) {
						console.warn('[HAR] 响应中未找到 invitation 数据');
						continue;
					}

					// 检查是否已处理过（避免重复）
					const invitationId = invitation?.id;
					if (!invitationId) {
						console.warn('[HAR] invitation 缺少 id');
						continue;
					}

					if (processedIds.has(invitationId)) {
						console.log('[HAR] 跳过重复的 invitation:', invitationId);
						continue;
					}

					processedIds.add(invitationId);
					invitations.push(invitation);
					console.log('[HAR] 成功解析 invitation:', invitationId, invitation?.name || '');

				} catch (e) {
					console.warn('[HAR] 处理条目时出错:', e);
					continue;
				}
			}

			console.log('[HAR] 解析完成，共提取', invitations.length, '个 invitation');
			return invitations;

		} catch (e) {
			console.error('[HAR] 解析 HAR 文件失败:', e);
			throw e;
		}
	}

	async function importHarFile() {
		try {
			// 创建文件输入元素
			const input = document.createElement('input');
			input.type = 'file';
			input.accept = '.har,application/json';
			input.style.display = 'none';

			input.addEventListener('change', async (e) => {
				const file = e.target.files[0];
				if (!file) return;

				const btn = document.getElementById('tm-aff-import-har');
				if (btn) {
					btn.disabled = true;
					btn.textContent = '解析中...';
				}

				try {
					console.log('[HAR] 开始读取文件:', file.name, '大小:', file.size);

					// 读取文件内容
					const text = await new Promise((resolve, reject) => {
						const reader = new FileReader();
						reader.onload = (e) => resolve(e.target.result);
						reader.onerror = reject;
						reader.readAsText(file);
					});

					console.log('[HAR] 文件读取完成，开始解析...');
					if (btn) btn.textContent = '解析中...';

					// 解析 HAR 文件
					const invitations = await parseHarFile(text);

					if (invitations.length === 0) {
						alert('HAR 文件中未找到有效的 detail 响应数据\n\n请确保 HAR 文件包含以下 API 的响应：\n/api/v1/oec/affiliate/seller/invitation_group/detail');
						if (btn) {
							btn.disabled = false;
							btn.textContent = '导入 HAR 文件';
						}
						return;
					}

					if (btn) btn.textContent = '合并缓存中...';

					// 加载现有缓存
					await loadCacheIfNeeded();
					const existingCache = invitationCache || { invitations: {} };

					// 构建新的缓存数据
					const newCache = buildCache(invitations);

					// 合并缓存：新数据覆盖旧数据
					const mergedInvitations = {
						...existingCache.invitations,
						...newCache.invitations
					};

					const finalCache = {
						version: 1,
						updatedAt: Date.now(),
						invitations: mergedInvitations
					};

					if (btn) btn.textContent = '保存中...';

					// 保存合并后的缓存
					await saveCompressed(STORAGE_KEY, finalCache);
					invitationCache = finalCache;

					const addedCount = invitations.length;
					const totalCount = Object.keys(mergedInvitations).length;
					alert(`HAR 导入完成！\n新增: ${addedCount} 个定邀\n总计: ${totalCount} 个定邀`);

					console.log('[HAR] 导入完成，新增', addedCount, '个，总计', totalCount, '个');

				} catch (e) {
					console.error('[HAR] 导入失败:', e);
					alert('导入失败: ' + (e.message || String(e)));
				} finally {
					if (btn) {
						btn.disabled = false;
						btn.textContent = '导入 HAR 文件';
					}
					// 清理输入元素
					input.value = '';
				}
			});

			// 触发文件选择
			document.body.appendChild(input);
			input.click();
			document.body.removeChild(input);

		} catch (e) {
			console.error('[HAR] 文件选择失败:', e);
			alert('文件选择失败: ' + (e.message || String(e)));
		}
	}

	// ================= 站内广告请求 =================
	async function fetchAdsVideoList() {
		try {
			const url = 'https://seller-th.tiktok.com/oec_ads/shopping/v1/oec/stat/post_video_list?locale=en&language=en&oec_seller_id=7496000925492218350&aadvid=7457858571813011457&bc_id=7439948159649890320';
			const csrfToken = getCookie('csrftoken') || getCookie('tt_csrf_token') || '';

			// 构建请求体（可以从当前页面日期动态计算，这里使用示例日期）
			const today = new Date();
			const endDate = new Date(today);
			const startDate = new Date(today);
			startDate.setDate(startDate.getDate() - 7); // 默认查询最近7天

			function formatDate(d) {
				const y = d.getFullYear();
				const m = String(d.getMonth() + 1).padStart(2, '0');
				const day = String(d.getDate()).padStart(2, '0');
				return `${y}-${m}-${day}`;
			}

			const body = {
				common_req: {
					st: formatDate(startDate),
					et: formatDate(endDate),
					page: 1,
					page_size: 20,
					sort_stat: 'item_post_time',
					sort_order: 1,
					filters: [],
					dimensions: ['item_id', 'spu_id', 'pre_item_id'],
					metrics: [
						'creator_nick_name',
						'tt_account_avatar_icon',
						'creator_user_name',
						'item_post_time',
						'user_item_authorization_status',
						'user_item_authorization_type',
						'product_name',
						'product_picture',
						'product_status',
						'has_spu_anchor',
						'material_name',
						'video_poster_url',
						'video_material_thumbnail',
						'onsite_roi2_shopping_value',
						'onsite_roi2_shopping_sku',
						'roi2_show_cnt',
						'roi2_click_cnt',
						'onsite_shopping_sku_cvr',
						'play_2s_rate',
						'play_6s_rate',
						'is_cross_attribution',
						'roi2_ctr',
						'identity_authorized_shop_id',
						'identity_bc_id',
						'identity_bc_asset_id',
						'identity_type',
						'tt_user_id',
						'video_bi_appeal_info',
						'ads_video_scenario',
						'pre_review_status'
					]
				}
			};

			const headers = {
				'accept': 'application/json, text/plain, */*',
				'accept-language': 'th',
				'content-type': 'application/json; charset=UTF-8',
				'priority': 'u=1, i',
				'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
				'sec-ch-ua-mobile': '?0',
				'sec-ch-ua-platform': '"macOS"',
				'sec-fetch-dest': 'empty',
				'sec-fetch-mode': 'cors',
				'sec-fetch-site': 'same-origin'
			};

			if (csrfToken) {
				headers['x-csrftoken'] = csrfToken;
			}

			console.log('[站内广告] 开始请求...');
			console.log('[站内广告] URL:', url);
			console.log('[站内广告] Headers:', headers);
			console.log('[站内广告] Body:', JSON.stringify(body, null, 2));

			// 使用 GM_xmlhttpRequest 绕过 CORS 限制
			const hasGM = (typeof GM_xmlhttpRequest === 'function') || (typeof GM !== 'undefined' && typeof GM.xmlHttpRequest === 'function');

			if (hasGM) {
				return new Promise((resolve, reject) => {
					const req = (typeof GM_xmlhttpRequest === 'function') ? GM_xmlhttpRequest : GM.xmlHttpRequest;
					req({
						method: 'POST',
						url: url,
						headers: headers,
						data: JSON.stringify(body),
						responseType: 'text',
						onload: (res) => {
							console.log('[站内广告] 响应状态:', res.status, res.statusText || '');
							// 处理响应头（可能是字符串或对象）
							let responseHeadersObj = {};
							if (res.responseHeaders) {
								if (typeof res.responseHeaders === 'string') {
									const lines = res.responseHeaders.split('\r\n');
									for (const line of lines) {
										const colonIdx = line.indexOf(':');
										if (colonIdx > 0) {
											const key = line.slice(0, colonIdx).trim().toLowerCase();
											const value = line.slice(colonIdx + 1).trim();
											responseHeadersObj[key] = value;
										}
									}
								} else {
									responseHeadersObj = res.responseHeaders;
								}
							}
							console.log('[站内广告] 响应头:', responseHeadersObj);

							const text = res.responseText || '';
							try {
								const jsonData = JSON.parse(text);
								console.log('[站内广告] 响应数据 (格式化):', JSON.stringify(jsonData, null, 2));
								console.log('[站内广告] 响应数据 (对象):', jsonData);

								// 如果响应包含数据，也单独打印关键信息
								if (jsonData.data) {
									console.log('[站内广告] 数据部分:', jsonData.data);
								}
								if (jsonData.list) {
									console.log('[站内广告] 列表数据:', jsonData.list);
									console.log('[站内广告] 列表数量:', Array.isArray(jsonData.list) ? jsonData.list.length : 'N/A');
								}

								resolve(jsonData);
							} catch (e) {
								console.log('[站内广告] 响应文本 (无法解析为JSON):', text);
								console.error('[站内广告] JSON解析失败:', e);
								resolve({ raw: text, parseError: e.message });
							}
						},
						onerror: (err) => {
							console.error('[站内广告] 请求错误:', err);
							reject(err);
						},
						ontimeout: (err) => {
							console.error('[站内广告] 请求超时:', err);
							reject(err);
						}
					});
				});
			} else {
				// 降级使用 fetch（可能失败）
				const resp = await fetch(url, {
					method: 'POST',
					headers: headers,
					body: JSON.stringify(body),
					mode: 'cors',
					credentials: 'include',
					referrer: 'https://seller-th.tiktok.com/ads-creation/manage-analyze?origin=SC_ads_tab_button_PC&btm_pre_unit_params=%7B%22btm_origin%22%3A%22sidebar_menu_Ads+Creation-SEA-REST%22%7D&shop_region=TH&type=product',
					referrerPolicy: 'strict-origin-when-cross-origin'
				});

				const text = await resp.text();
				console.log('[站内广告] 响应状态:', resp.status, resp.statusText);
				console.log('[站内广告] 响应头:', Object.fromEntries(resp.headers.entries()));

				try {
					const jsonData = JSON.parse(text);
					console.log('[站内广告] 响应数据 (格式化):', JSON.stringify(jsonData, null, 2));
					console.log('[站内广告] 响应数据 (对象):', jsonData);

					// 如果响应包含数据，也单独打印关键信息
					if (jsonData.data) {
						console.log('[站内广告] 数据部分:', jsonData.data);
					}
					if (jsonData.list) {
						console.log('[站内广告] 列表数据:', jsonData.list);
						console.log('[站内广告] 列表数量:', Array.isArray(jsonData.list) ? jsonData.list.length : 'N/A');
					}

					return jsonData;
				} catch (e) {
					console.log('[站内广告] 响应文本 (无法解析为JSON):', text);
					console.error('[站内广告] JSON解析失败:', e);
					return { raw: text, parseError: e.message };
				}
			}

		} catch (e) {
			console.error('[站内广告] 请求失败:', e);
			throw e;
		}
	}

	// ================= 样品申请搜索API =================
	async function fetchSampleGroupList(creatorHandle) {
		try {
			const endpoint = '/api/v1/affiliate/sample/group/list';
			const baseParams = getBaseParameters();
			const queryParams = { ...baseParams };
			const body = {
				tab: 0,
				cur_page: 1,
				page_size: 50,
				search_params: [{
					search_key: 1,
					search_type: 2,
					value: creatorHandle.replace(/^@+/, '')
				}],
				order_params: []
			};

			const signed = await getSignedQuery(queryParams, body);
			const url = `${BASE_HOST}${endpoint}?${signed}`;

			console.log('[样品申请] 搜索组列表:', creatorHandle);

			const resp = await fetch(url, {
				method: 'POST',
				headers: {
					'Accept': 'application/json, text/plain, */*',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(body),
				credentials: 'include'
			});

			const text = await resp.text();
			try {
				return JSON.parse(text);
			} catch {
				return { code: -1, raw: text };
			}
		} catch (e) {
			console.error('[样品申请] 搜索组列表失败:', e);
			throw e;
		}
	}

	// ================= 样品申请详情API =================
	async function fetchSampleApplyList(groupId, groupType = 1) {
		try {
			const endpoint = '/api/v1/affiliate/sample/apply/list';
			const baseParams = getBaseParameters();
			const queryParams = {
				...baseParams,
				tab: 0,
				group_id: groupId,
				group_type: groupType,
				cur_page: 1,
				page_size: 20
			};

			const signed = await getSignedQuery(queryParams, null);
			const url = `${BASE_HOST}${endpoint}?${signed}`;

			console.log('[样品申请] 获取详情列表:', groupId);

			const resp = await fetch(url, {
				method: 'GET',
				headers: {
					'Accept': 'application/json, text/plain, */*'
				},
				credentials: 'include'
			});

			const text = await resp.text();
			try {
				return JSON.parse(text);
			} catch {
				return { code: -1, raw: text };
			}
		} catch (e) {
			console.error('[样品申请] 获取详情列表失败:', e);
			throw e;
		}
	}

	// ================= 申样履约记录API =================
	async function fetchSamplePerformance(applyId, contentType, size = 20, offset = 0) {
		try {
			const endpoint = '/api/v1/affiliate/sample/performance';
			const baseParams = getBaseParameters();
			const queryParams = {
				...baseParams,
				apply_id: String(applyId),
				content_type: contentType, // 1=直播, 2=短视频
				size: size,
				offset: offset
			};

			const signed = await getSignedQuery(queryParams, null);
			const url = `${BASE_HOST}${endpoint}?${signed}`;

			console.log('[履约记录] 查询:', { applyId, contentType });

			const resp = await fetch(url, {
				method: 'GET',
				headers: {
					'Accept': 'application/json, text/plain, */*'
				},
				credentials: 'include'
			});

			const text = await resp.text();
			try {
				return JSON.parse(text);
			} catch {
				return { code: -1, raw: text };
			}
		} catch (e) {
			console.error('[履约记录] 查询失败:', e);
			throw e;
		}
	}

	// ================= 获取某个申请的所有履约内容（处理分页）=================
	async function fetchAllPerformanceContents(applyId, contentType, skipFirstPage = false) {
		const allContents = [];
		let offset = skipFirstPage ? 20 : 0; // 如果跳过第一页，从第二页开始
		const size = 20;
		let hasMore = true;

		while (hasMore) {
			const result = await fetchSamplePerformance(applyId, contentType, size, offset);
			if (result && result.code === 0 && result.data) {
				const contents = result.data.contents || [];
				allContents.push(...contents);
				hasMore = result.data.has_more === true;
				offset += size;
			} else {
				hasMore = false;
			}
		}

		return allContents;
	}

	// ================= 批量查询履约内容并统计 =================
	async function fetchAllPerformanceStats(applyInfos) {
		const stats = {
			totalContentCount: 0,
			videoCount: 0,
			liveCount: 0,
			videoTotalViews: 0,
			videoTotalOrders: 0,
			liveTotalViews: 0,
			liveTotalOrders: 0
		};

		// 筛选出main_order_id不为0的申请
		const validApplies = applyInfos.filter(apply => {
			const mainOrderId = apply.main_order_id || '';
			return mainOrderId && mainOrderId !== '0';
		});

		if (validApplies.length === 0) {
			return stats;
		}

		console.log(`[履约统计] 开始查询 ${validApplies.length} 个有效申请的履约内容`);

		// 并发查询所有申请的履约内容
		const promises = [];
		for (const apply of validApplies) {
			const applyId = apply.apply_id || '';
			if (!applyId) continue;

			// 查询短视频（content_type=2）
			promises.push(
				(async () => {
					// 先获取第一页以获取总数和第一页内容
					const firstPageResult = await fetchSamplePerformance(applyId, 2, 20, 0);
					if (firstPageResult && firstPageResult.code === 0 && firstPageResult.data) {
						const totalVideoCount = firstPageResult.data.total_video_count || 0;
						const firstPageContents = firstPageResult.data.contents || [];
						// 获取剩余页面的内容以统计播放量和出单数
						const remainingContents = await fetchAllPerformanceContents(applyId, 2, true);
						const allContents = [...firstPageContents, ...remainingContents];
						return { applyId, contentType: 2, totalCount: totalVideoCount, contents: allContents };
					}
					return { applyId, contentType: 2, totalCount: 0, contents: [] };
				})()
			);

			// 查询直播（content_type=1）
			promises.push(
				(async () => {
					// 先获取第一页以获取总数和第一页内容
					const firstPageResult = await fetchSamplePerformance(applyId, 1, 20, 0);
					if (firstPageResult && firstPageResult.code === 0 && firstPageResult.data) {
						const totalLiveCount = firstPageResult.data.total_live_count || 0;
						const firstPageContents = firstPageResult.data.contents || [];
						// 获取剩余页面的内容以统计播放量和出单数
						const remainingContents = await fetchAllPerformanceContents(applyId, 1, true);
						const allContents = [...firstPageContents, ...remainingContents];
						return { applyId, contentType: 1, totalCount: totalLiveCount, contents: allContents };
					}
					return { applyId, contentType: 1, totalCount: 0, contents: [] };
				})()
			);
		}

		const results = await Promise.allSettled(promises);

		// 统计结果
		for (const result of results) {
			if (result.status === 'fulfilled') {
				const { contentType, totalCount, contents } = result.value;

				if (contentType === 2) {
					// 短视频
					stats.videoCount += totalCount;
					contents.forEach(content => {
						stats.videoTotalViews += parseInt(content.view_num || 0);
						stats.videoTotalOrders += parseInt(content.paid_order_num || 0);
					});
				} else if (contentType === 1) {
					// 直播
					stats.liveCount += totalCount;
					contents.forEach(content => {
						stats.liveTotalViews += parseInt(content.view_num || 0);
						stats.liveTotalOrders += parseInt(content.paid_order_num || 0);
					});
				}
			}
		}

		stats.totalContentCount = stats.videoCount + stats.liveCount;

		console.log('[履约统计] 统计完成:', stats);
		return stats;
	}

	// ================= 获取单个申请的履约内容统计 =================
	async function fetchSingleApplyPerformanceStats(applyId) {
		const stats = {
			totalContentCount: 0,
			videoCount: 0,
			liveCount: 0,
			videoTotalViews: 0,
			videoTotalOrders: 0,
			liveTotalViews: 0,
			liveTotalOrders: 0
		};

		if (!applyId) {
			return stats;
		}

		try {
			// 查询短视频（content_type=2）
			const firstPageVideoResult = await fetchSamplePerformance(applyId, 2, 20, 0);
			if (firstPageVideoResult && firstPageVideoResult.code === 0 && firstPageVideoResult.data) {
				const totalVideoCount = firstPageVideoResult.data.total_video_count || 0;
				const firstPageVideoContents = firstPageVideoResult.data.contents || [];
				const remainingVideoContents = await fetchAllPerformanceContents(applyId, 2, true);
				const allVideoContents = [...firstPageVideoContents, ...remainingVideoContents];

				stats.videoCount = totalVideoCount;
				allVideoContents.forEach(content => {
					stats.videoTotalViews += parseInt(content.view_num || 0);
					stats.videoTotalOrders += parseInt(content.paid_order_num || 0);
				});
			}

			// 查询直播（content_type=1）
			const firstPageLiveResult = await fetchSamplePerformance(applyId, 1, 20, 0);
			if (firstPageLiveResult && firstPageLiveResult.code === 0 && firstPageLiveResult.data) {
				const totalLiveCount = firstPageLiveResult.data.total_live_count || 0;
				const firstPageLiveContents = firstPageLiveResult.data.contents || [];
				const remainingLiveContents = await fetchAllPerformanceContents(applyId, 1, true);
				const allLiveContents = [...firstPageLiveContents, ...remainingLiveContents];

				stats.liveCount = totalLiveCount;
				allLiveContents.forEach(content => {
					stats.liveTotalViews += parseInt(content.view_num || 0);
					stats.liveTotalOrders += parseInt(content.paid_order_num || 0);
				});
			}

			stats.totalContentCount = stats.videoCount + stats.liveCount;
		} catch (e) {
			console.error(`[履约统计] 单个申请查询失败 (applyId: ${applyId}):`, e);
		}

		return stats;
	}

	// ================= 站内广告达人数据搜索请求 =================
	async function fetchCreatorHistoryData(creatorNickName) {
		try {
			const url = 'https://seller-th.tiktok.com/oec_ads/shopping/v1/oec/stat/post_creator_list?locale=en&language=en&oec_seller_id=7496000925492218350&aadvid=7457858571813011457&bc_id=7439948159649890320';
			const csrfToken = getCookie('csrftoken') || getCookie('tt_csrf_token') || '';

			// 构建请求体（默认查询过去一个月）
			const today = new Date();
			const endDate = new Date(today);
			// 结束日期设置为今天
			endDate.setHours(0, 0, 0, 0);

			const startDate = new Date(today);
			// 开始日期设置为30天前
			startDate.setDate(startDate.getDate() - 30);
			startDate.setHours(0, 0, 0, 0);

			function formatDate(d) {
				const y = d.getFullYear();
				const m = String(d.getMonth() + 1).padStart(2, '0');
				const day = String(d.getDate()).padStart(2, '0');
				return `${y}-${m}-${day}`;
			}

			const body = {
				common_req: {
					st: formatDate(startDate),
					et: formatDate(endDate),
					page: 1,
					page_size: 20,
					sort_stat: 'onsite_roi2_shopping_value',
					sort_order: 1,
					filters: [{
						field: 'creator_user_name',
						filter_type: 0,
						in_field_values: [creatorNickName]
					}],
					dimensions: ['author_id'],
					metrics: [
						'creator_nick_name',
						'tt_account_avatar_icon',
						'creator_user_name',
						'total_video_cnt',
						'total_spu_cnt',
						'onsite_roi2_shopping_value',
						'onsite_roi2_shopping_sku',
						'roi2_show_cnt',
						'roi2_click_cnt',
						'onsite_roi2_shopping_sku_aov',
						'roi2_ctr',
						'is_using_aca',
						'tt_oec_uid',
						'is_official_market_account'
					]
				}
			};

			const headers = {
				'accept': 'application/json, text/plain, */*',
				'accept-language': 'th',
				'content-type': 'application/json; charset=UTF-8',
				'priority': 'u=1, i',
				'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
				'sec-ch-ua-mobile': '?0',
				'sec-ch-ua-platform': '"macOS"',
				'sec-fetch-dest': 'empty',
				'sec-fetch-mode': 'cors',
				'sec-fetch-site': 'same-origin'
			};

			if (csrfToken) {
				headers['x-csrftoken'] = csrfToken;
			}

			// 参考文档中的 referrer
			const referrer = 'https://seller-th.tiktok.com/ads-creation/manage-analyze?origin=SC_ads_tab_button_PC&btm_pre_unit_params=%7B%22btm_origin%22%3A%22sidebar_menu_homepage_sidebar_ads%22%7D&reporting_type=creator';

			console.log('[站内广告-达人] 开始请求:', creatorNickName);
			console.log('[站内广告-达人] 日期范围:', formatDate(startDate), '到', formatDate(endDate));
			console.log('[站内广告-达人] 请求体:', JSON.stringify(body, null, 2));
			console.log('[站内广告-达人] CSRF Token:', csrfToken ? '已获取' : '未获取');

			// 使用 GM_xmlhttpRequest 绕过 CORS 限制
			const hasGM = (typeof GM_xmlhttpRequest === 'function') || (typeof GM !== 'undefined' && typeof GM.xmlHttpRequest === 'function');

			if (hasGM) {
				return new Promise((resolve, reject) => {
					const req = (typeof GM_xmlhttpRequest === 'function') ? GM_xmlhttpRequest : GM.xmlHttpRequest;
					req({
						method: 'POST',
						url: url,
						headers: headers,
						data: JSON.stringify(body),
						responseType: 'text',
						referrer: referrer,
						onload: (res) => {
							const text = res.responseText || '';
							console.log('[站内广告-达人] 响应状态:', res.status);
							console.log('[站内广告-达人] 响应文本:', text.substring(0, 500));

							try {
								const jsonData = JSON.parse(text);
								console.log('[站内广告-达人] 响应数据:', jsonData);

								// 检查是否有错误
								if (jsonData.code !== 0 && jsonData.code !== undefined) {
									console.error('[站内广告-达人] API 返回错误:', jsonData);
									reject(new Error(jsonData.msg || 'API 返回错误: ' + JSON.stringify(jsonData)));
									return;
								}

								resolve(jsonData);
							} catch (e) {
								console.error('[站内广告-达人] JSON解析失败:', e, text);
								reject(new Error('JSON解析失败: ' + e.message));
							}
						},
						onerror: (err) => {
							console.error('[站内广告-达人] 请求错误:', err);
							reject(err);
						},
						ontimeout: (err) => {
							console.error('[站内广告-达人] 请求超时:', err);
							reject(err);
						}
					});
				});
			} else {
				// 降级使用 fetch（可能失败）
				const resp = await fetch(url, {
					method: 'POST',
					headers: headers,
					body: JSON.stringify(body),
					mode: 'cors',
					credentials: 'include',
					referrer: referrer,
					referrerPolicy: 'strict-origin-when-cross-origin'
				});

				const text = await resp.text();
				console.log('[站内广告-达人] 响应状态:', resp.status);
				console.log('[站内广告-达人] 响应文本:', text.substring(0, 500));

				try {
					const jsonData = JSON.parse(text);
					console.log('[站内广告-达人] 响应数据:', jsonData);

					// 检查是否有错误
					if (jsonData.code !== 0 && jsonData.code !== undefined) {
						console.error('[站内广告-达人] API 返回错误:', jsonData);
						throw new Error(jsonData.msg || 'API 返回错误: ' + JSON.stringify(jsonData));
					}

					return jsonData;
				} catch (e) {
					console.error('[站内广告-达人] JSON解析失败:', e);
					throw new Error('JSON解析失败: ' + e.message);
				}
			}

		} catch (e) {
			console.error('[站内广告-达人] 请求失败:', e);
			throw e;
		}
	}

	// ================= 测试函数：验证加密流程 =================
	// 使用新的加密实现测试 detail 请求
	async function testDetailRequest(testId) {
		const id = testId || '7559896927240947457';
		console.log('========================================');
		console.log('[测试] 开始请求 detail，ID:', id);
		console.log('[测试] 时间戳:', new Date().toISOString());
		console.log('[测试] 使用新的加密实现（X-Bogus & X-Gnarly）');
		console.log('========================================');

		try {
			// 使用 callDetail 函数（已集成新的加密实现）
			const endpoint = '/api/v1/oec/affiliate/seller/invitation_group/detail';
			const queryParams = { aid: AID_FOR_THIS_API, oec_seller_id: OEC_SELLER_ID };
			const body = { invitation_group_id: String(id) };

			console.log('[测试] 请求参数:');
			console.log('  - endpoint:', endpoint);
			console.log('  - queryParams:', queryParams);
			console.log('  - body:', body);

			// 获取签名后的 URL（使用新的加密实现）
			const signed = await getSignedQuery(queryParams, body);
			const url = `${BASE_HOST}${endpoint}?${signed}`;

			console.log('[测试] 加密后的 URL:');
			console.log('  - 完整 URL:', url);
			console.log('  - URL 长度:', url.length);

			// 解析 URL 参数以便查看 X-Bogus 和 X-Gnarly
			try {
				const urlObj = new URL(url);
				const params = urlObj.searchParams;
				console.log('[测试] URL 参数详情:');
				for (const [key, value] of params.entries()) {
					if (key === 'X-Bogus' || key === 'X-Gnarly') {
						console.log(`  - ${key}: ${value.substring(0, 50)}... (长度: ${value.length})`);
					} else {
						console.log(`  - ${key}: ${value}`);
					}
				}
			} catch (e) {
				console.warn('[测试] URL 解析失败:', e);
			}

			console.log('----------------------------------------');
			console.log('[测试] 发送请求（使用 callDetail 函数）...');

			// 调用实际的请求函数（使用新的加密实现）
			const result = await callDetail(id);

			console.log('----------------------------------------');
			console.log('[测试] 请求完成！');
			console.log('[测试] 响应状态码（如果可获取）:', result.code);

			if (result?.data?.invitation) {
				console.log('[测试] ✅ 请求成功！');
				console.log('[测试] 定邀名称:', result.data.invitation.name);
				console.log('[测试] 定邀ID:', result.data.invitation.id);
				console.log('[测试] 产品数量:', result.data.invitation.product_list?.length || 0);
				console.log('[测试] 达人数量:', result.data.invitation.creator_id_list?.length || 0);
				console.log('[测试] 加密实现验证通过 ✅');
			} else if (result?.code !== 0) {
				console.warn('[测试] ❌ API 返回错误');
				console.warn('[测试] 错误码:', result.code);
				console.warn('[测试] 错误信息:', result.msg || result.message || '未知错误');
				if (result.raw) {
					console.warn('[测试] 原始响应:', result.raw.substring(0, 500));
				}
			} else {
				console.warn('[测试] ⚠️ 响应格式异常，未找到 invitation 数据');
			}

			console.log('[测试] 完整响应对象:', result);
			console.log('========================================');

			return result;
		} catch (e) {
			console.error('========================================');
			console.error('[测试] ❌ 请求失败:', e);
			console.error('[测试] 错误类型:', e.constructor.name);
			console.error('[测试] 错误信息:', e.message);
			if (e.stack) {
				console.error('[测试] 错误堆栈:', e.stack);
			}
			console.error('========================================');
			throw e;
		}
	}

	// 暴露到全局作用域，方便在控制台调用
	if (typeof pageWindow !== 'undefined') {
		try {
			pageWindow.fetchAdsVideoList = fetchAdsVideoList;
			pageWindow.fetchCreatorHistoryData = fetchCreatorHistoryData;
			pageWindow.testDetailRequest = testDetailRequest;
			pageWindow.testDetail = () => testDetailRequest('7559896927240947457');
		} catch (err) {
			console.warn('[合并] 全局函数暴露到页面失败:', err);
		}
		if (pageWindow !== window) {
		window.fetchAdsVideoList = fetchAdsVideoList;
		window.fetchCreatorHistoryData = fetchCreatorHistoryData;
		window.testDetailRequest = testDetailRequest;
		window.testDetail = () => testDetailRequest('7559896927240947457');
		}
		console.log('[站内广告] 函数已暴露到全局，可在控制台使用: fetchAdsVideoList(), fetchCreatorHistoryData()');
		console.log('[测试] 测试函数已暴露到全局，可在控制台使用: testDetailRequest(id) 或 testDetail()');
	}

	async function runAllFetch(){ try { console.log('[合并] 开始拉取'); const list=await fetchAllInvitations(); const details=await fetchAllDetailsBatched(list.map(i=>i.id),8); const cache=buildCache(details); await saveCompressed(STORAGE_KEY, cache); alert(`定邀拉取完成：列表 ${list.length}，详情 ${details.length}`); } catch(e){ console.error('[合并] 拉取失败',e); alert('拉取失败，请看控制台'); } }
	async function runAllFetchWithProgress(){ const btn=document.getElementById('tm-aff-pull')||document.getElementById('control-button'); try { if(btn) btn.disabled=true; if(btn) btn.textContent='拉取中...'; console.log('[合并] 开始拉取'); let totalList=0; let totalDetails=0; const list = []; let hasMore = true; let curPage = 1; while(hasMore){ const pageData = await callSearch(curPage, PAGE_SIZE, 1); const list1 = pageData?.data?.invitation_list || []; list.push(...list1); hasMore = !!pageData?.data?.has_more; if(btn) btn.textContent=`拉取列表(状态1) 第${curPage}页 累计${list.length}`; curPage += 1; } hasMore = true; curPage = 1; while(hasMore){ const pageData = await callSearch(curPage, PAGE_SIZE, 2); const list2 = pageData?.data?.invitation_list || []; list.push(...list2); hasMore = !!pageData?.data?.has_more; if(btn) btn.textContent=`拉取列表(状态2) 第${curPage}页 累计${list.length}`; curPage += 1; } totalList = list.length; if(btn) btn.textContent=`抓取详情 0/${totalList}`; const ids = list.map(i=>i.id); const out=[]; let done=0; const concurrency=8; let idx=0; async function worker(){ while(idx<ids.length){ const my=idx++; const id=ids[my]; try{ const detail=await callDetail(id); if(detail?.data?.invitation) out.push(detail.data.invitation); }catch(e){ console.warn('[合并] 详情失败', id, e); } finally{ done++; if(btn) btn.textContent=`抓取详情 ${done}/${totalList}`; } } } await Promise.all(Array.from({length: Math.min(concurrency, Math.max(1, ids.length))}, ()=>worker())); totalDetails = out.length; const cache=buildCache(out); await saveCompressed(STORAGE_KEY, cache); if(btn) btn.textContent='拉取完成'; alert(`定邀拉取完成：列表 ${totalList}，详情 ${totalDetails}`); } catch(e){ console.error('[合并] 拉取失败',e); alert('拉取失败，请看控制台'); } finally { const btn2=document.getElementById('tm-aff-pull'); if(btn2){ btn2.disabled=false; btn2.textContent='拉取全部信息'; } } }

	// ================= 网络拦截：用于回填 =================
	(function setupFetchInterception(){
		const originalPageFetch = pageWindow.fetch ? pageWindow.fetch.bind(pageWindow) : null;
		if (!originalPageFetch) return;
		const patchedFetch = async function(...args){
			const requestInfo = args[0];
			const requestOptions = args[1] || {};

			// 尝试提取请求体中的参数（用于判断 tab 状态）
			let requestBody = null;
			if (requestOptions.body) {
				try {
					requestBody = typeof requestOptions.body === 'string' ? JSON.parse(requestOptions.body) : requestOptions.body;
				} catch(e) {
					// 解析失败，忽略
				}
			}

			const response = await originalPageFetch(...args);
			try {
				const url = response?.url || (requestInfo instanceof (pageWindow.Request || Request) ? requestInfo.url : (requestInfo && requestInfo.url) || requestInfo);
				if (typeof url === 'string') {
					if (url.includes(GROUP_LIST_API_PATH)) {
						const tab = requestBody?.tab; // 从请求体提取 tab 参数

						response.clone().text().then(text => {
							// 原有的通用处理
							processGroupListResponse(text);

							// 根据 tab 值分流处理
							if (tab === 30 || tab === 40 || tab === 100 || tab === 56) {
								// Shipped(30)/In-progress(40)/Completed(100)/Canceled(56) 的新处理逻辑
								dbg(`[拦截] 检测到 tab=${tab}，使用新的定邀回显逻辑`);
								processShippedCompletedInProgressResponse(text, tab);
							} else {
								// Ready to Ship(20) 和其他状态使用 To Review 的处理逻辑（在 Order ID 右侧显示定邀名称）
								processInProgressListResponse(text);
							}
						});
					} else if (url.includes(APPLY_LIST_API_PATH)) {
						response.clone().text().then(text => processApplyListResponse(text, url));
					}
				}
			} catch (err) {
				console.warn('[合并] fetch 拦截处理失败:', err);
			}
			return response;
		};
		pageWindow.fetch = patchedFetch;
		if (pageWindow !== window) {
			window.fetch = (...args) => pageWindow.fetch(...args);
		}
	})();
	function patchXHRInterception(targetWindow){
		const XHR = targetWindow?.XMLHttpRequest;
		if (!XHR) return;
		const proto = XHR.prototype;
		if (proto.__tmPatched) return;
		const originalOpen = proto.open;
		proto.open = function(method, url){
			try { this._requestURL = url; } catch {}
			return originalOpen.apply(this, arguments);
		};
		const originalSend = proto.send;
		proto.send = function(body){
			// 保存请求体用于后续分析
			try { this._requestBody = body; } catch {}

			this.addEventListener('load', () => {
				try {
					const url = this.responseURL || this._requestURL || '';
					if (typeof url === 'string') {
						if (url.includes(GROUP_LIST_API_PATH)) {
							// 尝试从请求体提取 tab 参数
							let tab = null;
							if (this._requestBody) {
								try {
									const bodyObj = typeof this._requestBody === 'string' ? JSON.parse(this._requestBody) : this._requestBody;
									tab = bodyObj?.tab;
								} catch(e) {
									// 解析失败，忽略
								}
							}

							// 原有的通用处理
							processGroupListResponse(this.responseText);

							// 根据 tab 值分流处理
							if (tab === 30 || tab === 40 || tab === 100 || tab === 56) {
								// Shipped(30)/In-progress(40)/Completed(100)/Canceled(56) 的新处理逻辑
								dbg(`[XHR拦截] 检测到 tab=${tab}，使用新的定邀回显逻辑`);
								processShippedCompletedInProgressResponse(this.responseText, tab);
							} else {
								// Ready to Ship(20) 和其他状态使用 To Review 的处理逻辑（在 Order ID 右侧显示定邀名称）
								processInProgressListResponse(this.responseText);
							}
						} else if (url.includes(APPLY_LIST_API_PATH)) {
							processApplyListResponse(this.responseText, url);
						}
					}
				} catch (err) {
					console.warn('[合并] XHR 拦截处理失败:', err);
				}
			});
			return originalSend.apply(this, arguments);
		};
		proto.__tmPatched = true;
	}
	patchXHRInterception(pageWindow);
	if (pageWindow !== window) {
		patchXHRInterception(window);
	}

	function initialize(){ if (isAffiliate) { injectAffiliateButtons(); } ensureHistoryPanel(); GM_registerMenuCommand('分批展开全部', processAndExpandRows, 'e'); GM_registerMenuCommand('导出缓存JSON', exportCache, 'x'); GM_registerMenuCommand('导入 HAR 文件', importHarFile, 'h'); GM_registerMenuCommand('站内广告请求', async () => { try { console.log('[站内广告] 通过菜单触发请求'); await fetchAdsVideoList(); } catch(e){ console.error('[站内广告] 请求执行失败:', e); alert('请求失败，请查看控制台'); } }, 'a'); GM_registerMenuCommand('测试 Detail 请求 (7559896927240947457)', async () => { try { console.log('[测试] 通过菜单触发测试请求'); await testDetailRequest('7559896927240947457'); alert('测试请求完成，请查看控制台输出'); } catch(e){ console.error('[测试] 请求执行失败:', e); alert('测试请求失败，请查看控制台'); } }, 't'); GM_registerMenuCommand(`切换调试日志（当前: ${DEBUG?'开':'关'}）`, () => { DEBUG = !DEBUG; alert(`调试日志已${DEBUG?'开启':'关闭'}`); }, 'd'); GM_registerMenuCommand(`切换详情日志（当前: ${DETAIL_LOG?'开':'关'}）`, () => { DETAIL_LOG = !DETAIL_LOG; alert(`详情日志已${DETAIL_LOG?'开启':'关闭'}`); }, 'l'); }
	// 首屏与动态渲染：扫描并注入 EC 按钮和历史数据按钮（不自动查询）
	function scanAndInjectAllRows(){ try { const rows = document.querySelectorAll('tr.arco-table-tr'); for(const row of rows){ const anchor = row.querySelector('div[data-e2e="d24ea79a-0cbc-ea5a"].text-neutral-text2.truncate'); if(!anchor) continue; const nameText = (anchor.textContent||'').trim(); if(!nameText) continue;
			// 检查该行是否已经注入过历史数据按钮（避免重复注入）
			const hasHistoryBtn = row.querySelector('.tm-history-btn');
			if(hasHistoryBtn) continue; // 如果已存在，跳过

			// 若未注入过则执行
			if(!(anchor.parentElement?.querySelector(':scope > .tm-ec-inline'))){ const h = findHandleInRow(row) || nameText; const cleanH = h.replace(/^@+/, '').trim(); if(cleanH){ injectEcButtonForRow(row, h, h); } }
		}
	} catch(e){ console.warn('[EC][scan] 扫描失败', e); } }
	let mo=null;
	function startObserver(){ try { if(mo) return; mo=new MutationObserver((muts)=>{ for(const m of muts){ if(m.addedNodes&&m.addedNodes.length){ scanAndInjectAllRows(); break; } } }); mo.observe(document.body,{ childList:true, subtree:true }); } catch(e){} }
	if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', ()=>{ initialize(); scanAndInjectAllRows(); startObserver(); }); } else { initialize(); scanAndInjectAllRows(); startObserver(); }

})();