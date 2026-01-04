// ==UserScript==
// @name         Enhanced HKG
// @namespace    https://hkgolden.com/
// @version      1.0.4.2
// @description  Enhanced experience. Additional features and bug fixes.
// @author       雷喵
// @icon         data:image/svg+xml;utf8,<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><g fill="%23ffc931"><ellipse cx="8" cy="8" rx="8" ry="8"/><rect x="8" width="8" height="8"/></g><g fill="%23f9f9f9"><rect x="8" y="4" width="6" height="2"/><rect x="10" y="2" width="2" height="6"/></g><rect x="10" y="4" width="2" height="2" fill="%23ffc931"/></svg>
// @match        *://forum.hkgolden.com/*
// @match        *://forumd.hkgolden.com/*
// @match        *://m.hkgolden.com/*
// @match        *://md.hkgolden.com/*
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.deleteValue
// @grant        GM.listValues
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/558079/Enhanced%20HKG.user.js
// @updateURL https://update.greasyfork.org/scripts/558079/Enhanced%20HKG.meta.js
// ==/UserScript==
/* eslint-disable dot-notation */
/* global exportFunction, cloneInto */
const FORCE_LOG = false;
const PAGE_WINDOW = unsafeWindow || window;
const IS_GREASEMONKEY = (GM.info.scriptHandler === "Greasemonkey");
const ORIGIN = PAGE_WINDOW.location.origin;
const HOSTNAME = PAGE_WINDOW.location.hostname;
const SVG_NS = "http://www.w3.org/2000/svg";
const XLINK_NS = "http://www.w3.org/1999/xlink";
const ICON_SVG = '<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><g fill="#ffc931"><ellipse cx="8" cy="8" rx="8" ry="8"/><rect x="8" width="8" height="8"/></g><g fill="#f9f9f9"><rect x="8" y="4" width="6" height="2"/><rect x="10" y="2" width="2" height="6"/></g><rect x="10" y="4" width="2" height="2" fill="#ffc931"/></svg>';
const HKG_COLOR = "#FFC931";// rgb(255, 201, 49)
const IS_NEW_DESKTOP_FORUM = HOSTNAME.startsWith("forum.");
const IS_OLD_DESKTOP_FORUM = HOSTNAME.startsWith("forumd.");
const IS_NEW_MOBILE_FORUM = HOSTNAME.startsWith("m.");
const IS_OLD_MOBILE_FORUM = HOSTNAME.startsWith("md.");
const IS_DESKTOP = IS_NEW_DESKTOP_FORUM || IS_OLD_DESKTOP_FORUM;
const IS_MOBILE = IS_NEW_MOBILE_FORUM || IS_OLD_MOBILE_FORUM;
const TEXT_ENCODER = new TextEncoder();
const TEXT_LIMIT = 2500;
const TEXT_INTERVAL = 500;
const SCRIPT_HOST = "https://greasyfork.org/scripts/558079";
const FAVICON_URL_PREFIX = "https://t0.gstatic.com/faviconV2?client=SOCIAL&fallback_opts=TYPE,SIZE,URL&type=FAVICON&size=32&url=";// https://www.google.com/s2/favicons?sz=32&domain=
const FAVICON_URLS = {
	"youtube": FAVICON_URL_PREFIX + "https://youtube.com",
	"twitter": FAVICON_URL_PREFIX + "https://twitter.com",
	"instagram": FAVICON_URL_PREFIX + "https://instagram.com",
	"threads": FAVICON_URL_PREFIX + "https://threads.com",
	"facebook": FAVICON_URL_PREFIX + "https://facebook.com",
	"streamable": FAVICON_URL_PREFIX + "https://streamable.com",
	"vimeo": FAVICON_URL_PREFIX + "https://vimeo.com",
	"dailymotion": FAVICON_URL_PREFIX + "https://dailymotion.com",
	"niconico": FAVICON_URL_PREFIX + "https://nicovideo.jp",
	"bilibili": FAVICON_URL_PREFIX + "https://bilibili.com",
	"tiktok": FAVICON_URL_PREFIX + "https://tiktok.com",
	"twitch": FAVICON_URL_PREFIX + "https://twitch.tv",
	"reddit": FAVICON_URL_PREFIX + "https://reddit.com",
	"steam": FAVICON_URL_PREFIX + "https://steampowered.com"
};

const RESOURCES = {
	"hkg_icon_js": {src:"https://forum.hkgolden.com/assets/font/iconfont_20230328.js", as:"script"},
	//"marked_js": {src:"https://cdn.jsdelivr.net/npm/marked/lib/marked.umd.js", as:"script"},
	//"twitter_js": {src:"https://platform.twitter.com/widgets.js", as:"script"},
	//"instagram_js": {src:"https://www.instagram.com/embed.js", as:"script"},
	//"threads_js": {src:"https://www.threads.net/embed.js", as:"script"},
	//"facebook_js": {src:"https://connect.facebook.net/zh_HK/sdk.js#xfbml=1&version=v24.0", as:"script"},
	//"dailymotion_js": {src:"https://geo.dailymotion.com/player.js", as:"script"},
	//"tiktok_js": {src:"https://www.tiktok.com/embed.js", as:"script"},
	//"twitch_js": {src:"https://embed.twitch.tv/embed/v1.js", as:"script"},
	//"reddit_js": {src:"https://embed.reddit.com/widgets.js", as:"script"},
	"youtube_favicon": {src:FAVICON_URLS["youtube"], as:"image"},
	"twitter_favicon": {src:FAVICON_URLS["twitter"], as:"image"},
	"instagram_favicon": {src:FAVICON_URLS["instagram"], as:"image"},
	"threads_favicon": {src:FAVICON_URLS["threads"], as:"image"},
	"facebook_favicon": {src:FAVICON_URLS["facebook"], as:"image"},
	"streamable_favicon": {src:FAVICON_URLS["streamable"], as:"image"},
	"vimeo_favicon": {src:FAVICON_URLS["vimeo"], as:"image"},
	"dailymotion_favicon": {src:FAVICON_URLS["dailymotion"], as:"image"},
	"niconico_favicon": {src:FAVICON_URLS["niconico"], as:"image"},
	"bilibili_favicon": {src:FAVICON_URLS["bilibili"], as:"image"},
	"tiktok_favicon": {src:FAVICON_URLS["tiktok"], as:"image"},
	"twitch_favicon": {src:FAVICON_URLS["twitch"], as:"image"},
	"reddit_favicon": {src:FAVICON_URLS["reddit"], as:"image"},
	"steam_favicon": {src:FAVICON_URLS["steam"], as:"image"}
};

const CHANNELS = {
	// 推薦
	"BW": {name:"吹水台", symbol:"#channel-BW"},
	"HT": {name:"高登熱", symbol:"#channel-HT"},
	"NW": {name:"最新", symbol:"#channel-NW"},
	"CA": {name:"時事台", symbol:"#channel-CA"},
	"ET": {name:"娛樂台", symbol:"#channel-ET"},
	"SP": {name:"體育台", symbol:"#channel-SP"},
	"FN": {name:"財經台", symbol:"#channel-FN"},
	"ST": {name:"學術台", symbol:"#channel-ST"},
	"SY": {name:"講故台", symbol:"#channel-SY"},
	"EP": {name:"創意台", symbol:"#channel-EP"},
	"SN": {name:"超自然台", symbol:"#channel-SN"},
	"JS": {name:"優惠台", symbol:"#channel-JS"},
	// 科技
	"HW": {name:"硬件台", symbol:"#channel-HW"},
	"IN": {name:"電訊台", symbol:"#channel-IN"},
	"SW": {name:"軟件台", symbol:"#channel-SW"},
	"MP": {name:"手機台", symbol:"#channel-MP"},
	"AP": {name:"Apps台", symbol:"#channel-AP"},
	"BC": {name:"Crypto台", symbol:"#blockchain"},
	"AI": {name:"AI技術台", symbol:"#channel-AI"},
	// 消閒
	"GM": {name:"遊戲台", symbol:"#channel-GM"},
	"ED": {name:"飲食台", symbol:"#channel-ED"},
	"TR": {name:"旅遊台", symbol:"#channel-TR"},
	"CO": {name:"潮流台", symbol:"#channel-CO"},
	"AN": {name:"動漫台", symbol:"#channel-AN"},
	"TO": {name:"玩具台", symbol:"#channel-TO"},
	"MU": {name:"音樂台", symbol:"#channel-MU"},
	"VI": {name:"影視台", symbol:"#channel-VI"},
	"DC": {name:"攝影台", symbol:"#channel-DC"},
	"TS": {name:"汽車台", symbol:"#channel-TS"},
	// 生活
	"WK": {name:"上班台", symbol:"#channel-WK"},
	"LV": {name:"感情台", symbol:"#channel-LV"},
	"SC": {name:"校園台", symbol:"#channel-SC"},
	"BB": {name:"親子台", symbol:"#channel-BB"},
	"PT": {name:"寵物台", symbol:"#channel-PT"},
	"HC": {name:"健康台", symbol:"#channel-HC"},
	// 其他
	"MB": {name:"站務台", symbol:"#channel-MB"},
	"RA": {name:"電台", symbol:"#channel-RA"},
	"AC": {name:"活動台", symbol:"#channel-AC"},
	"BS": {name:"買賣台", symbol:"#channel-BS"},
	"JT": {name:"直播台", symbol:"#channel-JT"},
	"AU": {name:"成人台", symbol:"#channel-AU"},
	"OP": {name:"考古台", symbol:"#channel-OP"},
	// 會員
	"REWIND": {name:"回帶", symbol:"#tape"},
	"BOOKMARKS": {name:"留名", symbol:"#bookmark2"},
	"MESSAGE": {name:"訊息", symbol:"#message2"},
	"FOLLOW": {name:"追蹤", symbol:"#follow"},
	"HISTORY": {name:"起底", symbol:"#history"}
};

const OPTIONS = {
	"custom_channel_list": {raw:"BW|HT|REWIND|BOOKMARKS|MESSAGE|FOLLOW|HISTORY", id:"ehkg-options-custom-channel-list"},
	"custom_css": {raw:"div.btnYT{display:none!important;}", id:"ehkg-options-custom-css"},
	"embed_quoted": {raw:2, id:"ehkg-options-embed-quoted"},
	"embed_youtube": {raw:1, id:"ehkg-options-embed-youtube"},
	"embed_twitter": {raw:1, id:"ehkg-options-embed-twitter"},
	"embed_instagram": {raw:1, id:"ehkg-options-embed-instagram"},
	"embed_threads": {raw:1, id:"ehkg-options-embed-threads"},
	"embed_facebook": {raw:1, id:"ehkg-options-embed-facebook"},
	"embed_streamable": {raw:1, id:"ehkg-options-embed-streamable"},
	"embed_vimeo": {raw:1, id:"ehkg-options-embed-vimeo"},
	"embed_dailymotion": {raw:1, id:"ehkg-options-embed-dailymotion"},
	"embed_niconico": {raw:1, id:"ehkg-options-embed-niconico"},
	"embed_bilibili": {raw:1, id:"ehkg-options-embed-bilibili"},
	"embed_tiktok": {raw:1, id:"ehkg-options-embed-tiktok"},
	"embed_twitch": {raw:1, id:"ehkg-options-embed-twitch"},
	"embed_reddit": {raw:1, id:"ehkg-options-embed-reddit"},
	"embed_steam": {raw:1, id:"ehkg-options-embed-steam"},
	"improve_rendering": {raw:1, id:"ehkg-options-improve-rendering"},
	"disable_svg_animation": {raw:1, id:"ehkg-options-disable-svg-animation"},
	"convert_hkg_url": {raw:1, id:"ehkg-options-convert-hkg-url"},
	"text_counter": {raw:1, id:"ehkg-options-text-counter"},
	"avatar_list": {raw:1, id:"ehkg-options-avatar-list"},
	"auto_hide_ui": {raw:0, id:"ehkg-options-auto-hide-ui"},
	"developer_mode": {raw:0, id:"ehkg-options-developer-mode"}
	// 0=永不, 1=自動, 2=手動
	// 0=關閉, 1=啟用
};

const SELECTORS = {};

const INTERSECTION_OBSERVER = new IntersectionObserver((entries) => {
	for (const entry of entries) {
		if (entry.isIntersecting) {
			INTERSECTION_OBSERVER.unobserve(entry.target);
			setTimeout(() => {
				entry.target.dataset.ehkgRendered = true;
			}, 200);
		}
	}
}, {root:null, rootMargin:"0px", threshold:0});

const CUSTOM_CHANNEL_TEMPLATE = document.createElement("div");
{
	let template = CUSTOM_CHANNEL_TEMPLATE;
	template.className = "ehkg-custom-channel";
	let svg = document.createElementNS(SVG_NS, "svg");
	let use = document.createElementNS(SVG_NS, "use");
	use.setAttribute("class", "ehkg-use");
	svg.append(use);
	let span = document.createElement("span");
	template.append(svg, span);
}
const EMBED_BUTTON_TEMPLATE = document.createElement("div");
{
	let template = EMBED_BUTTON_TEMPLATE;
	template.className = "ehkg-embed-button";
	let img = document.createElement("img");
	let span = document.createElement("span");
	span.textContent = "顯示內嵌";
	template.append(img, span);
}
const EMBED_CONTAINER_TEMPLATE = document.createElement("div");
{
	let template = EMBED_CONTAINER_TEMPLATE;
	template.className = "ehkg-embed-container";
}
const EMBED_LOADER_TEMPLATE = document.createElement("div");
{
	let template = EMBED_LOADER_TEMPLATE;
	template.className = "ehkg-embed-loader";
	let img = document.createElement("img");
	template.append(img);
}
const EMBED_IFRAME_TEMPLATE = PAGE_WINDOW.document.createElement("iframe");
{
	let template = EMBED_IFRAME_TEMPLATE;
	template.className = "ehkg-embed-iframe";
	template.dataset.ehkgEmbed = "none";
	template.setAttribute("frameborder", 0);
	template.setAttribute("scrolling", "no");
	template.setAttribute("allowfullscreen", true);
	template.setAttribute("allowTransparency", true);
	template.setAttribute("allow", "fullscreen; accelerometer; gyroscope; clipboard-write; encrypted-media; picture-in-picture; web-share;");
	template.setAttribute("preload", "none");
	//template.setAttribute("loading", "lazy");
	template.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
}
const TEXT_COUNTER_TEMPLATE = document.createElement("div");
{
	let template = TEXT_COUNTER_TEMPLATE;
	template.className = "ehkg-counter-container";
	let digitLabel = document.createElement("div");
	digitLabel.className = "ehkg-counter-digit";
	let countedLabel = document.createElement("div");
	countedLabel.className = "ehkg-counter-counted";
	let infoLabel = document.createElement("div");
	infoLabel.className = "ehkg-counter-info";
	infoLabel.textContent = "Printable ASCII 佔 1 字元，其他文字或符號佔 2 - 4 字元。\n網頁版 FormData 每一新行佔原本 2 字元的雙倍 4 字元。";
	digitLabel.append(countedLabel);
	template.append(digitLabel, infoLabel);
}
const AVATAR_BUTTON_TEMPLATE = document.createElement("div");
{
	let template = AVATAR_BUTTON_TEMPLATE;
	template.className = "ehkg-avatar-button";
	template.textContent = "顯示頭像列表";
}
const AVATAR_LIST_TEMPLATE = document.createElement("div");
{
	let template = AVATAR_LIST_TEMPLATE;
	template.className = "ehkg-avatar-container";
	let list = document.createElement("div");
	list.className = "ehkg-avatar-list";
	let bar = document.createElement("div");
	bar.className = "ehkg-avatar-bar";
	let refreshButton = document.createElement("div");
	refreshButton.className = "ehkg-avatar-refresh";
	refreshButton.textContent = "統計";
	let infoLabel = document.createElement("div");
	infoLabel.className = "ehkg-avatar-info";
	infoLabel.append(document.createElement("span"));
	infoLabel.append(document.createElement("span"));
	infoLabel.firstChild.textContent = "收藏了 ? / ? 個";
	infoLabel.lastChild.textContent = "（持有 ? 個）";
	bar.append(refreshButton);
	bar.append(infoLabel);
	let loader = document.createElement("div");
	loader.className = "ehkg-avatar-loader";
	loader.textContent = "載入中…";
	template.append(list, bar, loader);
}
const AVATAR_FRAME_TEMPLATE = document.createElement("div");
{
	let template = AVATAR_FRAME_TEMPLATE;
	template.className = "ehkg-avatar-frame";
	template.style.visibility = "hidden";
	let img = document.createElement("img");
	img.className = "ehkg-avatar-image";
	template.append(img);
}

function log(...args) {
	if (FORCE_LOG || OPTIONS["developer_mode"].value) {
		console.log(...args);
	}
}

function delay(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

async function loadOptions() {
	for (const key in OPTIONS) {
		if (Object.hasOwn(OPTIONS, key)) {
			OPTIONS[key].value = await GM.getValue(key, OPTIONS[key].raw);
		}
	}
	await cleanOptions();
	//OPTIONS["developer_mode"].value = 1;
	log("Options are loaded.");
}

async function saveOptions() {
	for (const key in OPTIONS) {
		if (Object.hasOwn(OPTIONS, key)) {
			await GM.setValue(key, OPTIONS[key].value);
		}
	}
	log("Options are saved.");
}

async function resetOptions() {
	await clearOptions();
	for (const key in OPTIONS) {
		if (Object.hasOwn(OPTIONS, key)) {
			await GM.setValue(key, OPTIONS[key].raw);
		}
	}
	log("Options are reset.");
}

async function cleanOptions() {
	const keys = await GM.listValues();
	for (const key of keys) {
		if (!OPTIONS[key]) {
			await GM.deleteValue(key);
		}
	}
	log("Options are cleaned.");
}

async function clearOptions() {
	const keys = await GM.listValues();
	for (const key of keys) {
		await GM.deleteValue(key);
	}
	log("Options are cleared.");
}

function refreshOptions(reset) {
	for (const key in OPTIONS) {
		if (Object.hasOwn(OPTIONS, key)) {
			let element = document.querySelector("#" + OPTIONS[key].id) || {localName: null};
			switch (element.localName) {
				case "textarea":
					element.value = reset ? OPTIONS[key].raw : OPTIONS[key].value;
					break;
				case "select":
					element.selectedIndex = reset ? OPTIONS[key].raw : OPTIONS[key].value;
					break;
				default:
					log("Unable to refresh '" + key + "' option.");
			}
		}
	}
	document.querySelector("#ehkg-options-select-custom-channel").selectedIndex = 0;
	document.querySelector("#ehkg-options-json").value = "";
	log("Options are refreshed.");
}

function reflectOptions() {
	for (const key in OPTIONS) {
		if (Object.hasOwn(OPTIONS, key)) {
			let element = document.querySelector("#" + OPTIONS[key].id) || {localName: null};
			switch (element.localName) {
				case "textarea":
					OPTIONS[key].value = element.value.trim();
					break;
				case "select":
					OPTIONS[key].value = element.selectedIndex;
					break;
				default:
					log("Unable to reflect '" + key + "' option.");
			}
		}
	}
	log("Options are reflected.");
}

function applyOptions() {
	setupCustomChannelList(document.querySelector("#ehkg-custom-channel-list"));
	document.querySelector("#ehkg-custom-css").textContent = OPTIONS["custom_css"].value;
	document.querySelector("#ehkg-bubble").classList.toggle("ehkg-developer", OPTIONS["developer_mode"].value);
}

function importOptions(json) {
	let input = JSON.parse(json);
	for (const key in OPTIONS) {
		if (Object.hasOwn(OPTIONS, key) && Object.hasOwn(input, key)) {
			let element = document.querySelector("#" + OPTIONS[key].id);
			switch (element.localName) {
				case "textarea":
					element.value = input[key];
					break;
				case "select":
					element.selectedIndex = input[key];
					break;
			}
		}
	}
	log("Options are imported.");
}

function exportOptions() {
	let output = {};
	for (const key in OPTIONS) {
		if (Object.hasOwn(OPTIONS, key)) {
			let element = document.querySelector("#" + OPTIONS[key].id);
			switch (element.localName) {
				case "textarea":
					output[key] = element.value.trim();
					break;
				case "select":
					output[key] = element.selectedIndex;
					break;
			}
		}
	}
	log("Options are exported.");
	return JSON.stringify(output);
}

async function getStorage() {
	const storage = {};
	const keys = await GM.listValues();
	for (const key of keys) {
		storage[key] = await GM.getValue(key);
	}
	return storage;
}

function injectCSS() {
	let css = "";
	// Global
	css += ":root{";
	css += "--ehkg-hkg-yellow: #FFC931;";
	css += "--ehkg-hkg-hover-yellow: rgb(255,217,110);";
	css += "--ehkg-hkg-yellow-shade1: #E5B42C;";
	css += "--ehkg-hkg-yellow-shade2: #CCA027;";
	css += "--ehkg-hkg-yellow-shade3: #B28C22;";
	css += "--ehkg-hkg-yellow-shade4: #99781D;";
	css += "--ehkg-hkg-yellow-shade5: #7F6418;";
	css += "--ehkg-hkg-yellow-shade6: #665013;";
	css += "--ehkg-hkg-yellow-shade7: #4c3C0E;";
	css += "--ehkg-hkg-yellow-shade8: #332809;";
	css += "--ehkg-hkg-yellow-shade9: #191404;";
	css += "--ehkg-hkg-yellow-tint1: #FFCE45;";
	css += "--ehkg-hkg-yellow-tint2: #FFD35A;";
	css += "--ehkg-hkg-yellow-tint3: #FFD96E;";
	css += "--ehkg-hkg-yellow-tint4: #FFDE83;";
	css += "--ehkg-hkg-yellow-tint5: #FFE498;";
	css += "--ehkg-hkg-yellow-tint6: #FFE9AC;";
	css += "--ehkg-hkg-yellow-tint7: #FFEEC1;";
	css += "--ehkg-hkg-yellow-tint8: #FFF4D5;";
	css += "--ehkg-hkg-yellow-tint9: #FFF9EA;";
	css += "--ehkg-grey50: #FAFAFA;";
	css += "--ehkg-grey100: #F5F5F5;";
	css += "--ehkg-grey200: #EEEEEE;";
	css += "--ehkg-grey300: #E0E0E0;";
	css += "--ehkg-grey400: #BDBDBD;";
	css += "--ehkg-grey500: #9E9E9E;";
	css += "--ehkg-grey600: #757575;";
	css += "--ehkg-grey700: #616161;";
	css += "--ehkg-grey800: #424242;";
	css += "--ehkg-grey900: #212121;";
	css += "--ehkg-text-white: rgb(255,255,255,0.9);";
	css += "--ehkg-text-black: rgb(0,0,0,0.9);";
	css += "--ehkg-font-family: 'Roboto', 'PingFang TC', 'Helvetica Neue', 'Microsoft JhengHei', 'Heiti TC', 'SimHei', 'Arial Unicode MS', 'Arial', 'sans-serif', 'MingLIU_HKSCS';";
	css += "--ehkg-single-yellow-box-shadow: 0 0 0 2px var(--ehkg-hkg-yellow);";
	css += "--ehkg-double-yellow-box-shadow: 0 0 0 2px var(--ehkg-hkg-yellow), 0 0 0 6px rgba(from var(--ehkg-hkg-yellow) r g b / 0.33);";
	css += "--ehkg-loading-background-under: repeating-linear-gradient(135deg,rgba(0,0,0,0.2) 0 25%,rgba(0,0,0,0.33) 25% 50%,rgba(0,0,0,0.2) 50% 75%,rgba(0,0,0,0.33) 75% 100%);";
	css += "--ehkg-loading-background-cover: repeating-linear-gradient(135deg,rgba(0,0,0,0.8) 0 25%,rgba(0,0,0,0.66) 25% 50%,rgba(0,0,0,0.8) 50% 75%,rgba(0,0,0,0.66) 75% 100%);";
	css += "--ehkg-loading-background-size: 128px 128px;";
	css += "--ehkg-loading-animation: ehkg-loading 2s infinite linear;";
	css += "--ehkg-box-shadow-2dp: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.12);";
	css += "--ehkg-box-shadow-3dp: 0 3px 4px 0 rgba(0, 0, 0, 0.14), 0 3px 3px -2px rgba(0, 0, 0, 0.2), 0 1px 8px 0 rgba(0, 0, 0, 0.12);";
	css += "--ehkg-box-shadow-4dp: 0 4px 5px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(0, 0, 0, 0.12), 0 2px 4px -1px rgba(0, 0, 0, 0.2);";
	css += "--ehkg-box-shadow-6dp: 0 6px 10px 0 rgba(0, 0, 0, 0.14), 0 1px 18px 0 rgba(0, 0, 0, 0.12), 0 3px 5px -1px rgba(0, 0, 0, 0.2);";
	css += "--ehkg-box-shadow-8dp: 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12), 0 5px 5px -3px rgba(0, 0, 0, 0.2);";
	css += "--ehkg-box-shadow-16dp: 0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2);";
	css += "--ehkg-box-shadow-24dp: 0 9px 46px 8px rgba(0, 0, 0, 0.14), 0 11px 15px -7px rgba(0, 0, 0, 0.12), 0 24px 38px 3px rgba(0, 0, 0, 0.2);";
	css += "--ehkg-box-shadow-2dp-half: 0 2px 2px 0 rgba(0, 0, 0, 0.07), 0 3px 1px -2px rgba(0, 0, 0, 0.1), 0 1px 5px 0 rgba(0, 0, 0, 0.06);";
	css += "--ehkg-box-shadow-3dp-half: 0 3px 4px 0 rgba(0, 0, 0, 0.07), 0 3px 3px -2px rgba(0, 0, 0, 0.1), 0 1px 8px 0 rgba(0, 0, 0, 0.06);";
	css += "--ehkg-box-shadow-4dp-half: 0 4px 5px 0 rgba(0, 0, 0, 0.07), 0 1px 10px 0 rgba(0, 0, 0, 0.06), 0 2px 4px -1px rgba(0, 0, 0, 0.1);";
	css += "--ehkg-box-shadow-6dp-half: 0 6px 10px 0 rgba(0, 0, 0, 0.07), 0 1px 18px 0 rgba(0, 0, 0, 0.06), 0 3px 5px -1px rgba(0, 0, 0, 0.1);";
	css += "--ehkg-box-shadow-8dp-half: 0 8px 10px 1px rgba(0, 0, 0, 0.07), 0 3px 14px 2px rgba(0, 0, 0, 0.06), 0 5px 5px -3px rgba(0, 0, 0, 0.1);";
	css += "--ehkg-box-shadow-16dp-half: 0 16px 24px 2px rgba(0, 0, 0, 0.07), 0 6px 30px 5px rgba(0, 0, 0, 0.06), 0 8px 10px -5px rgba(0, 0, 0, 0.1);";
	css += "--ehkg-box-shadow-24dp-half: 0 9px 46px 8px rgba(0, 0, 0, 0.07), 0 11px 15px -7px rgba(0, 0, 0, 0.06), 0 24px 38px 3px rgba(0, 0, 0, 0.1);";
	css += "--ehkg-drop-shadow-2dp: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.12)) drop-shadow(0 3px 1px rgba(0, 0, 0, 0.14)) drop-shadow(0 1px 5px rgba(0, 0, 0, 0.12)) drop-shadow(0 -1px 2px rgba(0, 0, 0, 0.1));";
	css += "--ehkg-drop-shadow-3dp: drop-shadow(0 3px 4px rgba(0, 0, 0, 0.12)) drop-shadow(0 3px 3px rgba(0, 0, 0, 0.14)) drop-shadow(0 1px 8px rgba(0, 0, 0, 0.12)) drop-shadow(0 -2px 2px rgba(0, 0, 0, 0.1));";
	css += "--ehkg-drop-shadow-4dp: drop-shadow(0 4px 5px rgba(0, 0, 0, 0.12)) drop-shadow(0 1px 10px rgba(0, 0, 0, 0.14)) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.12)) drop-shadow(0 -1px 3px rgba(0, 0, 0, 0.1));";
	css += "--ehkg-drop-shadow-6dp: drop-shadow(0 6px 10px rgba(0, 0, 0, 0.12)) drop-shadow(0 1px 18px rgba(0, 0, 0, 0.14)) drop-shadow(0 3px 5px rgba(0, 0, 0, 0.12)) drop-shadow(0 -2px 3px rgba(0, 0, 0, 0.1));";
	css += "--ehkg-drop-shadow-8dp: drop-shadow(0 8px 10px rgba(0, 0, 0, 0.12)) drop-shadow(0 3px 14px rgba(0, 0, 0, 0.14)) drop-shadow(0 5px 5px rgba(0, 0, 0, 0.12)) drop-shadow(0 -2px 4px rgba(0, 0, 0, 0.1));";
	css += "--ehkg-drop-shadow-16dp: drop-shadow(0 16px 24px rgba(0, 0, 0, 0.12)) drop-shadow(0 6px 30px rgba(0, 0, 0, 0.14)) drop-shadow(0 8px 10px rgba(0, 0, 0, 0.12)) drop-shadow(0 -3px 4px rgba(0, 0, 0, 0.1));";
	css += "--ehkg-drop-shadow-24dp: drop-shadow(0 9px 46px rgba(0, 0, 0, 0.12)) drop-shadow(0 11px 15px rgba(0, 0, 0, 0.14)) drop-shadow(0 24px 38px rgba(0, 0, 0, 0.12)) drop-shadow(0 -3px 5px rgba(0, 0, 0, 0.1));";
	css += "--ehkg-drop-shadow-2dp-half: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.06)) drop-shadow(0 3px 1px rgba(0, 0, 0, 0.07)) drop-shadow(0 1px 5px rgba(0, 0, 0, 0.06)) drop-shadow(0 -1px 2px rgba(0, 0, 0, 0.05));";
	css += "--ehkg-drop-shadow-3dp-half: drop-shadow(0 3px 4px rgba(0, 0, 0, 0.06)) drop-shadow(0 3px 3px rgba(0, 0, 0, 0.07)) drop-shadow(0 1px 8px rgba(0, 0, 0, 0.06)) drop-shadow(0 -2px 2px rgba(0, 0, 0, 0.05));";
	css += "--ehkg-drop-shadow-4dp-half: drop-shadow(0 4px 5px rgba(0, 0, 0, 0.06)) drop-shadow(0 1px 10px rgba(0, 0, 0, 0.07)) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.06)) drop-shadow(0 -1px 3px rgba(0, 0, 0, 0.05));";
	css += "--ehkg-drop-shadow-6dp-half: drop-shadow(0 6px 10px rgba(0, 0, 0, 0.06)) drop-shadow(0 1px 18px rgba(0, 0, 0, 0.07)) drop-shadow(0 3px 5px rgba(0, 0, 0, 0.06)) drop-shadow(0 -2px 3px rgba(0, 0, 0, 0.05));";
	css += "--ehkg-drop-shadow-8dp-half: drop-shadow(0 8px 10px rgba(0, 0, 0, 0.06)) drop-shadow(0 3px 14px rgba(0, 0, 0, 0.07)) drop-shadow(0 5px 5px rgba(0, 0, 0, 0.06)) drop-shadow(0 -2px 4px rgba(0, 0, 0, 0.05));";
	css += "--ehkg-drop-shadow-16dp-half: drop-shadow(0 16px 24px rgba(0, 0, 0, 0.06)) drop-shadow(0 6px 30px rgba(0, 0, 0, 0.07)) drop-shadow(0 8px 10px rgba(0, 0, 0, 0.06)) drop-shadow(0 -3px 4px rgba(0, 0, 0, 0.05));";
	css += "--ehkg-drop-shadow-24dp-half: drop-shadow(0 9px 46px rgba(0, 0, 0, 0.06)) drop-shadow(0 11px 15px rgba(0, 0, 0, 0.07)) drop-shadow(0 24px 38px rgba(0, 0, 0, 0.06)) drop-shadow(0 -3px 5px rgba(0, 0, 0, 0.05));";
	css += "--ehkg-ease-in-sine: cubic-bezier(0.12, 0, 0.39, 0);";
	css += "--ehkg-ease-in-quad: cubic-bezier(0.11, 0, 0.5, 0);";
	css += "--ehkg-ease-in-cubic: cubic-bezier(0.32, 0, 0.67, 0);";
	css += "--ehkg-ease-in-back: cubic-bezier(0.36, 0, 0.66, -0.56);";
	css += "--ehkg-ease-out-sine: cubic-bezier(0.61, 1, 0.88, 1);";
	css += "--ehkg-ease-out-quad: cubic-bezier(0.5, 1, 0.89, 1);";
	css += "--ehkg-ease-out-cubic: cubic-bezier(0.33, 1, 0.68, 1);";
	css += "--ehkg-ease-out-back: cubic-bezier(0.34, 1.56, 0.64, 1);";
	css += "--ehkg-ease-in-out-sine: cubic-bezier(0.37, 0, 0.63, 1);";
	css += "--ehkg-ease-in-out-quad: cubic-bezier(0.45, 0, 0.55, 1);";
	css += "--ehkg-ease-in-out-cubic: cubic-bezier(0.65, 0, 0.35, 1);";
	css += "--ehkg-ease-in-out-back: cubic-bezier(0.68, -0.6, 0.32, 1.6);";
	css += "--ehkg-fade-duration: 0.15s;";
	css += "--ehkg-fadein-transition:opacity var(--ehkg-fade-duration) var(--ehkg-ease-out-sine), transform var(--ehkg-fade-duration) var(--ehkg-ease-out-back); visibility 0s linear 0s;";
	css += "--ehkg-fadeout-transition:opacity var(--ehkg-fade-duration) var(--ehkg-ease-in-sine), transform var(--ehkg-fade-duration) var(--ehkg-ease-in-out-quad), visibility 0s linear var(--ehkg-fade-duration);";// display 0s linear 0.1s allow-discrete;
	css += "--ehkg-dynamic-height: 100vh;"
	css += "}";
	css += "@supports (height: 100dvh){:root{--ehkg-dynamic-height: 100dvh;}}";
	css += "@keyframes ehkg-loading{0%{background-position:0 0;}100%{background-position:128px 0;}}";
	css += ".ehkg-hidden{visibility:hidden; display:none;}";
	css += ".ehkg-invisible{visibility:hidden; pointer-events:none;}";
	css += ".ehkg-rendered, [data-ehkg-rendered]{content-visibility:auto;}";
	//css += ".ehkg-markdown p{margin: 0;}";
	//css += ".ehkg-markdown blockquote{white-space: pre-line;}";
	//css += ".ehkg-markdown ul{white-space: normal;}";
	// Bubble
	css += ".ehkg-bubble{position:fixed; z-index:3000; left:0px; bottom:0px; user-select:none;}";
	css += ".ehkg-bubble-button{display:flex; justify-content:center; align-content:center; align-items:center; box-sizing:border-box; width:56px; height:56px; cursor:pointer;}";
	css += ".ehkg-bubble-button-image{width:32px; height:32px; background-size:32px; background-position:center; background-repeat:no-repeat; background-image:url(\'data:image/svg+xml;utf8," + ICON_SVG.replaceAll("#", "%23") + "'); cursor:pointer; filter:drop-shadow(0px 0px 6px rgba(from var(--ehkg-hkg-yellow) r g b / 0.33)) var(--ehkg-drop-shadow-8dp-half); transform-origin:center; transition:transform 0.2s var(--ehkg-ease-out-back), filter 0.2s var(--ehkg-ease-in-out-back);}";
	css += ".ehkg-bubble:has(.ehkg-popup:not(.ehkg-invisible)) .ehkg-bubble-button-image{filter:drop-shadow(0px 0px 8px rgba(from var(--ehkg-hkg-yellow) r g b / 1));}";
	css += "@media (hover:hover){.ehkg-bubble-button:hover .ehkg-bubble-button-image{filter:drop-shadow(0px 0px 8px rgba(from var(--ehkg-hkg-yellow) r g b / 0.66)); transform:scale3d(1.5,1.5,1);}}";
	css += "@media (hover:hover){.ehkg-bubble-button:active .ehkg-bubble-button-image{filter:drop-shadow(0px 0px 8px rgba(from var(--ehkg-hkg-yellow) r g b / 0.66)); transform:scale3d(1.25,1.25,1);}}";
	css += "@media (hover:none){.ehkg-bubble-button:active .ehkg-bubble-button-image{filter:drop-shadow(0px 0px 8px rgba(from var(--ehkg-hkg-yellow) r g b / 0.66)); transform:scale3d(1.25,1.25,1);}}";
	css += ".ehkg-popup{position:absolute; left:52px; bottom:52px; box-sizing:border-box; border-radius:8px 8px 8px 0; padding:0; box-shadow:var(--ehkg-double-yellow-box-shadow), var(--ehkg-box-shadow-16dp-half); background-color:#FFF; color:var(--ehkg-grey900); font-family:var(--ehkg-font-family); font-size:12px; font-weight:normal; line-height:1; cursor:default; transform-origin:bottom left; transition:var(--ehkg-fadein-transition); color-scheme:light;}";
	css += ".ehkg-popup.ehkg-invisible{opacity:0; transform:scale3d(0.5,0.5,1) translate3d(-6px,+6px,0px); transition:var(--ehkg-fadeout-transition);}";
	css += ".ehkg-popup-tab{box-sizing:border-box; border-radius:inherit; overflow:hidden;}";
	css += ".ehkg-popup-content{display:flex; flex-direction:column; gap:4px; box-sizing:border-box; max-height:calc(var(--ehkg-dynamic-height) - 180px); padding:4px; overflow-y:auto; overflow-x:hidden; scrollbar-width:thin; scrollbar-color:var(--ehkg-grey400) var(--ehkg-grey100);}";
	css += ".ehkg-popup-footer{display:flex; justify-content:flex-end; align-content:center; align-items:center; gap:4px; position:absolute; bottom:-36px; right:4px; margin-top:4px;}";
	css += ".ehkg-popup-footer-button{display:flex; justify-content:center; align-content:center; align-items:center; width:46px; height:26px; box-shadow: var(--ehkg-box-shadow-16dp-half); border-radius:4px; background-color:var(--ehkg-grey700); color:var(--ehkg-grey200); cursor:pointer;}";
	css += ".ehkg-popup-footer-button:hover{background-color:var(--ehkg-grey800);}";
	css += ".ehkg-popup-section{display:flex; flex-direction:column; gap:4px; box-sizing:border-box; border-radius:4px; padding:4px; background-color:var(--ehkg-grey100);}";
	css += ".ehkg-popup-section-title{display:flex; justify-content:flex-start; align-content:center; align-items:center; box-sizing:border-box; height:24px; padding:0 4px; color:var(--ehkg-grey700); font-size:14px;}";
	css += ".ehkg-custom-channel-list{display:flex; flex-direction:column; gap:4px;}";
	css += ".ehkg-custom-channel{display:flex; justify-content:flex-start; align-content:center; align-items:center; box-sizing:border-box; height:36px; border-radius:4px; padding:0 12px; background-color:var(--ehkg-hkg-yellow-tint9); color:var(--ehkg-hkg-yellow-shade5); font-size:14px; line-height:1; cursor:pointer;}";
	css += ".ehkg-custom-channel:hover{background-color:var(--ehkg-hkg-yellow-tint8);}";
	css += ".ehkg-custom-channel>svg{width:16px; height:16px; margin-right:8px; fill:var(--ehkg-hkg-yellow-shade5);}";
	css += ".ehkg-options-row{display:flex; flex-wrap:nowrap; justify-content:space-between; align-content:center; align-items:center; box-sizing:border-box; height:26px; padding:2px; border-radius:2px; background-color:var(--ehkg-grey200);}";
	css += ".ehkg-options-row:hover{background-color:var(--ehkg-grey300);}";
	css += ".ehkg-options-label{display:flex; flex-wrap:nowrap; justify-content:flex-start; align-content:center; align-items:center; box-sizing:border-box; padding:0 6px; line-height:1;}";
	css += ".ehkg-options-label>img{width:16px; height:16px; margin-right:6px;}";
	css += ".ehkg-options-value{display:flex; flex-wrap:nowrap; justify-content:flex-end; align-content:center; align-items:center;}";
	css += ".ehkg-options-select{box-sizing:border-box; height:22px; outline:none; border-radius:2px; border:1px solid var(--ehkg-grey400); background-color:#FFF; color:var(--ehkg-grey900); font-family:var(--ehkg-font-family); font-size:12px; scrollbar-width:thin; cursor:pointer; user-select:none; color-scheme:light;}";
	css += ".ehkg-options-select>option{font-size:14px;}";
	css += ".ehkg-options-textarea{word-break:break-all; box-sizing:border-box; padding:4px; outline:none; border-radius:2px; border:1px solid var(--ehkg-grey400); background-color:#FFF; color:var(--ehkg-grey900); font-family:'Consolas', 'Courier New', monospace; font-size:13px; line-height:1.2; resize:none; scrollbar-width:thin; color-scheme:light;}";
	css += ".ehkg-options-button{display:flex; justify-content:center; align-content:center; align-items:center; flex-grow:1; box-sizing:border-box; border-radius:2px; height:26px; padding:4px; background-color:var(--ehkg-grey300); color:var(--ehkg-grey800); font-family:var(--ehkg-font-family); font-size:12px; line-height:1; cursor:pointer;}";
	css += ".ehkg-options-button:hover{background-color:var(--ehkg-grey400);}";
	css += ".ehkg-options-columns-row{display:flex; justify-content:center; align-content:center; align-items:center; gap:4px; box-sizing:border-box;}";
	//css += ".ehkg-developer #ehkg-clear-options{display:flex !important;}";
	// Embed
	css += "a:has(+.ehkg-embed-button:hover),a:has(+.ehkg-embed-container:hover){box-shadow:var(--ehkg-double-yellow-box-shadow); border-radius:2px;}";
	css += ".ehkg-embed-button{display:flex; justify-content:center; align-content:center; align-items:center; box-sizing:border-box; border-radius:4px; border:0; width:128px; height:32px; margin:6px 0; padding:6px 12px; box-shadow:var(--ehkg-box-shadow-2dp); background-color:rgba(0,0,0,0.66); color:var(--ehkg-text-white); font-family:var(--ehkg-font-family); font-size:14px; line-height:1; cursor:pointer; user-select:none;}";
	css += ".ehkg-embed-button:hover{background-color:rgba(0,0,0,0.8);}";
	css += ".ehkg-embed-button>img{display:block; width:16px; height:16px; margin-right:8px;}";
	css += "a:hover+.ehkg-embed-button{box-shadow:var(--ehkg-double-yellow-box-shadow);}";
	css += ".ehkg-embed-container{display:block; width:fit-content; box-sizing:border-box; max-width:100%; margin:6px 0; padding:0;}";
	css += ".ehkg-embed-iframe{display:block; box-sizing:border-box; border:none; margin:0; max-width:100%; height:0px;}";
	css += ".ehkg-embed-iframe[data-ehkg-embed=\"facebook\"]{outline:1px solid #dddfe2 !important; outline-offset:-1px !important;}";
	css += ".ehkg-embed-loading-iframe{position:fixed; top:0; left:0; visibility:hidden; pointer-events:none;}";
	css += "a:hover+.ehkg-embed-container>iframe{box-shadow:var(--ehkg-double-yellow-box-shadow);}";
	css += ".ehkg-embed-loader{display: flex; justify-content:center; align-content:center; align-items:center; width:160px; height:90px; border-radius:4px; background:var(--ehkg-loading-background-under); background-size:var(--ehkg-loading-background-size); animation:var(--ehkg-loading-animation); user-select:none;}";
	css += ".ehkg-embed-loader>img{display:block; width:32px; height:32px;}";
	css += "a:hover+.ehkg-embed-container>.ehkg-embed-loader{box-shadow:var(--ehkg-double-yellow-box-shadow);}";
	// Text Counter
	css += ".ehkg-counter-container{display:flex; justify-content:flex-start; align-items:center; align-content:center; box-sizing:border-box; width:fit-content; max-width:100%; min-height:40px; margin:4px 0; padding:2px; border-radius:4px; box-shadow:var(--ehkg-box-shadow-2dp); background-color:rgba(0,0,0,0.66); color:var(--ehkg-text-white); font-family:var(--ehkg-font-family); line-height:1; user-select:none;}";
	css += ".ehkg-counter-digit{position:relative; display:flex; justify-content:flex-start; align-items:center; align-content:center; flex-shrink:0; width:80px; height:36px; border-radius:2px; background-color:rgba(0,0,0,0.66); font-size:16px;}";
	css += ".ehkg-counter-digit:after{position:absolute; bottom:4px; right:4px; color:rgb(255,255,255,0.66); font-size:10px; content:'/ " + TEXT_LIMIT + "';}";
	css += ".ehkg-counter-counted{display:flex; justify-content:center; align-items:center; align-content:center; width:52px; height:16px; font-size:16px;}";
	css += ".ehkg-counter-counted.exceeded{color:#FF5D5D;}";
	css += ".ehkg-counter-info{box-sizing:border-box; margin:0 6px; color:rgba(255,255,255,0.66); font-size:12px; line-height:1.2; text-wrap:nowrap; white-space:pre; overflow-x:auto;}";
	// Avatar List
	css += ".ehkg-avatar-button{display:flex; justify-content:center; align-content:center; align-items:center; box-sizing:border-box; height:64px; margin:6px 0; border-radius:4px; box-shadow:var(--ehkg-box-shadow-2dp); background-color:rgba(0,0,0,0.66); color:var(--ehkg-text-white); font-family:var(--ehkg-font-family); font-size:14px; line-height:1; user-select:none; cursor:pointer;}";
	css += ".ehkg-avatar-button:hover{background-color:rgba(0,0,0,0.8);}";
	css += ".ehkg-avatar-container{color-scheme:dark; position:relative; box-sizing:border-box; margin:6px 0; padding:4px; border-radius:4px; box-shadow:var(--ehkg-box-shadow-2dp); background-color:rgb(0,0,0,0.66); color:var(--ehkg-text-white); font-family:var(--ehkg-font-family); line-height:1; user-select:none;}";
	css += ".ehkg-avatar-list{display:flex; flex-wrap:wrap; justify-content:flex-start; align-items:center; align-content:flex-start; gap:6px; box-sizing:border-box; height:282px; padding:18px; overflow-y:scroll; scrollbar-width:thin;}";
	css += ".ehkg-avatar-frame{position:relative; z-index:0; box-sizing:border-box; padding:2px; cursor:zoom-in;}";
	css += ".ehkg-avatar-frame:hover{z-index:1; background-color:rgb(255,255,255,0.66); transform:scale3d(2,2,1);}";
	css += ".ehkg-avatar-frame.ehkg-using{outline:2px solid var(--ehkg-hkg-yellow); outline-offset:-2px;}";
	css += ".ehkg-avatar-image{display:block; width:32px; height:32px; opacity:0.2; image-rendering:pixelated;}";
	css += ".ehkg-avatar-frame:hover>.ehkg-avatar-image{opacity:1 !important;}";
	css += ".ehkg-avatar-frame.ehkg-owned>.ehkg-avatar-image{opacity:1 !important;}";
	css += ".ehkg-avatar-bar{display:flex; justify-content:flex-start; align-content:center; align-items:stretch; gap:4px; margin-top:4px; font-size:14px; user-select:none;}";
	css += ".ehkg-avatar-refresh{display:flex; justify-content:center; align-content:center; align-items:center; flex-shrink:0; width:60px; min-height:32px; border-radius:4px; background-color:rgba(0,0,0,0.66); color:var(--ehkg-hkg-yellow); cursor:pointer;}";
	css += ".ehkg-avatar-refresh:hover{background-color:rgba(0,0,0,0.8);}";
	css += ".ehkg-avatar-info{display:flex; justify-content:flex-start; align-content:center; align-items:center; flex-grow:1; flex-wrap:wrap; box-sizing:border-box; border-radius:4px; padding:8px 8px; background-color:rgba(0,0,0,0.66); color:var(--ehkg-text-white);}";
	css += ".ehkg-avatar-loader{position:absolute; top:0; bottom:0; left:0; right:0; z-index:10; display:flex; justify-content:center; align-content:center; align-items:center; border-radius:inherit; color:var(--ehkg-text-white); font-size:16px; line-height:1; background:var(--ehkg-loading-background-cover); background-size:var(--ehkg-loading-background-size); animation:var(--ehkg-loading-animation);}";
	// Platform
	if (IS_NEW_DESKTOP_FORUM || IS_NEW_MOBILE_FORUM) {
		css += "@media (hover: none){.ehkg-bubble{z-index:1290 !important; bottom:48px !important;}}";// +48px
		css += "#threadModal{z-index:1280 !important;}";
		css += "div[data-role]:has(>div:only-child:empty){display:none!important;}";
	}
	if (IS_OLD_MOBILE_FORUM) {
		css += "@media (hover: none){.ehkg-bubble{z-index:1000 !important; bottom:46px !important;}}";// +46px
	}
	// Extra
	css += "symbol#channel-AI>path{fill:unset;}";
	// Inject
	let style = document.createElement("style");
	style.id = "ehkg-css";
	style.textContent = css;
	document.head.append(style);
	let customStyle = document.createElement("style");
	customStyle.id = "ehkg-custom-css";
	customStyle.textContent = OPTIONS["custom_css"].value;
	document.head.append(customStyle);
}

function setupBubble() {
	// Bubble
	let bubble = document.createElement("div");
	bubble.id = "ehkg-bubble";
	bubble.className = "ehkg-bubble";
	bubble.classList.toggle("ehkg-developer", OPTIONS["developer_mode"].value);
	let button = document.createElement("div");
	button.className = "ehkg-bubble-button";
	button.title = "Enhanced HKG";
	bubble.append(button);
	let buttonImage = document.createElement("div");
	buttonImage.className = "ehkg-bubble-button-image";
	button.append(buttonImage);
	// Popup
	let popup = document.createElement("div");
	popup.id = "ehkg-popup";
	popup.className = "ehkg-popup";
	popup.classList.toggle("ehkg-invisible", sessionStorage.getItem("ehkg-popup") !== "true");
	bubble.append(popup);
	button.addEventListener("click", (event) => {
		popup.classList.toggle("ehkg-invisible");
		saveSession();
	});
	// Tab
	let tabSession = sessionStorage.getItem("ehkg-popup-tab");
	let mainTab = document.createElement("div");
	mainTab.id = "ehkg-popup-main";
	mainTab.className = "ehkg-popup-tab";
	mainTab.classList.toggle("ehkg-hidden", tabSession !== null ? tabSession !== "main" : false);
	mainTab.style.cssText = "width:146px;";// +8px +10px
	let optionsTab = document.createElement("div");
	optionsTab.id = "ehkg-popup-options";
	optionsTab.className = "ehkg-popup-tab";
	optionsTab.classList.toggle("ehkg-hidden", tabSession !== null ? tabSession !== "options" : true);
	optionsTab.style.cssText = "width:274px;"; // +8px +10px
	popup.append(mainTab, optionsTab);
	// Main Tab
	{
		let content = document.createElement("div");
		content.className = "ehkg-popup-content";
		let footer = document.createElement("div");
		footer.className = "ehkg-popup-footer";
		let channelList = document.createElement("div");
		channelList.id = "ehkg-custom-channel-list";
		channelList.className = "ehkg-custom-channel-list";
		let optionsButton = document.createElement("div");
		optionsButton.className = "ehkg-popup-footer-button";
		optionsButton.textContent = "設定";
		optionsButton.addEventListener("click", (event) => {
			refreshOptions(false);
			mainTab.classList.toggle("ehkg-hidden", true);
			optionsTab.classList.toggle("ehkg-hidden", false);
			saveSession();
		});
		content.append(channelList);
		footer.append(optionsButton);
		mainTab.append(content, footer);
		setupCustomChannelList(channelList);
	}
	// Options Tab
	{
		let content = document.createElement("div");
		content.className = "ehkg-popup-content";
		let footer = document.createElement("div");
		footer.className = "ehkg-popup-footer";
		let backButton = document.createElement("div");
		backButton.className = "ehkg-popup-footer-button";
		backButton.textContent = "返回";
		backButton.addEventListener("click", (event) => {
			mainTab.classList.toggle("ehkg-hidden", false);
			optionsTab.classList.toggle("ehkg-hidden", true);
			saveSession();
		});
		let resetButton = document.createElement("div");
		resetButton.className = "ehkg-popup-footer-button";
		resetButton.textContent = "重設";
		resetButton.addEventListener("click", (event) => {
			refreshOptions(true);
		});
		let saveButton = document.createElement("div");
		saveButton.className = "ehkg-popup-footer-button";
		saveButton.textContent = "儲存";
		saveButton.addEventListener("click", (event) => {
			reflectOptions();
			applyOptions();
			saveOptions();
		});
		footer.append(backButton, resetButton, saveButton);
		optionsTab.append(content, footer);
		// Channel
		let channelSection = document.createElement("div");
		{
			let section = channelSection;
			section.className = "ehkg-popup-section";
			let titleLabel = document.createElement("div");
			titleLabel.className = "ehkg-popup-section-title";
			titleLabel.textContent = "自選台";
			section.append(titleLabel);
			let textArea = document.createElement("textarea");
			textArea.id = "ehkg-options-custom-channel-list";
			textArea.className = "ehkg-options-textarea";
			textArea.style.cssText = "height:60px;";
			textArea.spellcheck = false;
			textArea.placeholder = "ID|ID|ID...";
			section.append(textArea);
			let selectionBox = document.createElement("select");
			selectionBox.id = "ehkg-options-select-custom-channel";
			selectionBox.className = "ehkg-options-select";
			selectionBox.style.cssText = "flex-grow:1; height:26px;";
			let option = document.createElement("option");
			option.disabled = true;
			option.value = "";
			option.textContent = "選台";
			selectionBox.append(option);
			for (const key in CHANNELS) {
				if (Object.hasOwn(CHANNELS, key)) {
					let option = document.createElement("option");
					option.value = key;
					option.textContent = CHANNELS[key].name + " # " + key;
					selectionBox.append(option);
				}
			}
			let addButton = document.createElement("div");
			addButton.className = "ehkg-options-button";
			addButton.style.cssText = "flex-grow:0; width:60px;";
			addButton.textContent = "追台";
			addButton.addEventListener("click", (event) => {
				if (!selectionBox.value) {
					return;
				}
				let length = textArea.value.length;
				let start = textArea.selectionStart;
				let end = textArea.selectionEnd;
				let hasPrefix = (start > 0 && textArea.value.charAt(start - 1) === "|");
				let hasPostfix = (end < length && textArea.value.charAt(end) === "|");
				let prefix = (start > 0 && !hasPrefix) ? "|" : "";
				let postfix = (end < length && !hasPostfix) ? "|" : "";
				textArea.setRangeText(prefix + selectionBox.value + postfix, start, end, "end");
				textArea.focus();
			});
			let columnsRow = document.createElement("div");
			columnsRow.className = "ehkg-options-columns-row";
			columnsRow.append(selectionBox, addButton);
			section.append(columnsRow);
		}
		content.append(channelSection);
		// CSS
		let cssSection = document.createElement("div");
		{
			let section = cssSection;
			section.className = "ehkg-popup-section";
			let titleLabel = document.createElement("div");
			titleLabel.className = "ehkg-popup-section-title";
			titleLabel.textContent = "自訂 CSS";
			section.append(titleLabel);
			let textArea = document.createElement("textarea");
			textArea.id = "ehkg-options-custom-css";
			textArea.className = "ehkg-options-textarea";
			textArea.style.cssText = "height:120px;";
			textArea.spellcheck = false;
			textArea.placeholder = "CSS";
			section.append(textArea);
		}
		content.append(cssSection);
		// Embed
		let embedSection = document.createElement("div");
		{
			let section = embedSection;
			section.className = "ehkg-popup-section";
			let titleLabel = document.createElement("div");
			titleLabel.className = "ehkg-popup-section-title";
			titleLabel.textContent = "內嵌";
			section.append(titleLabel);
			section.append(generateOptionsSelectionRow("ehkg-options-embed-quoted", null, "載入引用", ["永不", "自動", "手動"]));
			section.append(generateOptionsSelectionRow("ehkg-options-embed-youtube", FAVICON_URLS["youtube"], "YouTube", ["永不", "自動", "手動"]));
			section.append(generateOptionsSelectionRow("ehkg-options-embed-twitter", FAVICON_URLS["twitter"], "Twitter", ["永不", "自動", "手動"]));
			section.append(generateOptionsSelectionRow("ehkg-options-embed-instagram", FAVICON_URLS["instagram"], "Instagram", ["永不", "自動", "手動"]));
			section.append(generateOptionsSelectionRow("ehkg-options-embed-threads", FAVICON_URLS["threads"], "Threads", ["永不", "自動", "手動"]));
			section.append(generateOptionsSelectionRow("ehkg-options-embed-facebook", FAVICON_URLS["facebook"], "Facebook", ["永不", "自動", "手動"]));
			section.append(generateOptionsSelectionRow("ehkg-options-embed-streamable", FAVICON_URLS["streamable"], "Streamable", ["永不", "自動", "手動"]));
			section.append(generateOptionsSelectionRow("ehkg-options-embed-vimeo", FAVICON_URLS["vimeo"], "Vimeo", ["永不", "自動", "手動"]));
			section.append(generateOptionsSelectionRow("ehkg-options-embed-dailymotion", FAVICON_URLS["dailymotion"], "Dailymotion", ["永不", "自動", "手動"]));
			section.append(generateOptionsSelectionRow("ehkg-options-embed-niconico", FAVICON_URLS["niconico"], "NicoNico", ["永不", "自動", "手動"]));
			section.append(generateOptionsSelectionRow("ehkg-options-embed-bilibili", FAVICON_URLS["bilibili"], "BiliBili", ["永不", "自動", "手動"]));
			section.append(generateOptionsSelectionRow("ehkg-options-embed-tiktok", FAVICON_URLS["tiktok"], "TikTok", ["永不", "自動", "手動"]));
			section.append(generateOptionsSelectionRow("ehkg-options-embed-twitch", FAVICON_URLS["twitch"], "Twitch", ["永不", "自動", "手動"]));
			section.append(generateOptionsSelectionRow("ehkg-options-embed-reddit", FAVICON_URLS["reddit"], "Reddit", ["永不", "自動", "手動"]));
			section.append(generateOptionsSelectionRow("ehkg-options-embed-steam", FAVICON_URLS["steam"], "Steam", ["永不", "自動", "手動"]));
		}
		content.append(embedSection);
		// Other
		let otherSection = document.createElement("div");
		{
			let section = otherSection;
			section.className = "ehkg-popup-section";
			let titleLabel = document.createElement("div");
			titleLabel.className = "ehkg-popup-section-title";
			titleLabel.textContent = "其他";
			section.append(titleLabel);
			section.append(generateOptionsSelectionRow("ehkg-options-improve-rendering", null, "改善渲染效能", ["關閉", "啟用"]));
			section.append(generateOptionsSelectionRow("ehkg-options-disable-svg-animation", null, "停用 SVG 動畫", ["關閉", "啟用"]));
			section.append(generateOptionsSelectionRow("ehkg-options-convert-hkg-url", null, "新舊網址轉換", ["關閉", "啟用"]));
			section.append(generateOptionsSelectionRow("ehkg-options-text-counter", null, "準確字數計算", ["關閉", "啟用"]));
			section.append(generateOptionsSelectionRow("ehkg-options-avatar-list", null, "頭像列表", ["關閉", "啟用"]));
		}
		content.append(otherSection);
		// Script
		let scriptSection = document.createElement("div");
		{
			let section = scriptSection;
			section.className = "ehkg-popup-section";
			let titleLabel = document.createElement("div");
			titleLabel.className = "ehkg-popup-section-title";
			titleLabel.textContent = "腳本";
			section.append(titleLabel);
			section.append(generateOptionsSelectionRow("ehkg-options-auto-hide-ui", null, "永遠自動縮小控制介面", ["關閉", "啟用"]));
			section.append(generateOptionsSelectionRow("ehkg-options-developer-mode", null, "開發者模式", ["關閉", "啟用"]));
		}
		content.append(scriptSection);
		// JSON
		let jsonSection = document.createElement("div");
		{
			let section = jsonSection;
			section.className = "ehkg-popup-section";
			let titleLabel = document.createElement("div");
			titleLabel.className = "ehkg-popup-section-title";
			titleLabel.textContent = "匯入 / 匯出";
			section.append(titleLabel);
			let textArea = document.createElement("textarea");
			textArea.id = "ehkg-options-json";
			textArea.className = "ehkg-options-textarea";
			textArea.style.cssText = "height:60px;";
			textArea.spellcheck = false;
			textArea.placeholder = "JSON";
			section.append(textArea);
			let importButton = document.createElement("div");
			importButton.className = "ehkg-options-button";
			importButton.textContent = "匯入";
			importButton.addEventListener("click", (event) => {
				try {
					if (textArea.value) {
						importOptions(textArea.value);
						alert("已匯入設定。\n如要套用設定請儲存。");
					} else {
						alert("請貼上 JSON 以供匯入。");
					}
				} catch (error) {
					alert("無法匯入因 JSON 格式有誤。");
				}
			});
			let exportButton = document.createElement("div");
			exportButton.className = "ehkg-options-button";
			exportButton.textContent = "匯出";
			exportButton.addEventListener("click", (event) => {
				textArea.value = exportOptions();
				setTimeout(() => {
					alert("已匯出設定。\n可以保存 JSON 以供匯入。");
				}, 0);
			});
			let copyButton = document.createElement("div");
			copyButton.className = "ehkg-options-button";
			copyButton.textContent = "複製";
			copyButton.addEventListener("click", async (event) => {
				try {
					await PAGE_WINDOW.navigator.clipboard.writeText(textArea.value);
					alert("已複製到剪貼簿。");
				} catch (error) {
					alert("無法複製到剪貼簿。");
				}
			});
			let cleanButton = document.createElement("div");
			cleanButton.className = "ehkg-options-button";
			cleanButton.textContent = "清空";
			cleanButton.addEventListener("click", (event) => {
				textArea.value = "";
			});
			let columnsRow = document.createElement("div");
			columnsRow.className = "ehkg-options-columns-row";
			columnsRow.append(importButton, exportButton, copyButton, cleanButton);
			section.append(columnsRow);
			let clearButton = document.createElement("div");
			clearButton.className = "ehkg-options-button";
			clearButton.textContent = "清除腳本資料";
			clearButton.addEventListener("click", (event) => {
				if (confirm("確定要清除腳本資料？\n清除後建議重新整理頁面。")) {
					clearOptions();
				}
			});
			section.append(clearButton);
		}
		content.append(jsonSection);
		// About
		let aboutSection = document.createElement("div");
		{
			let section = aboutSection;
			section.className = "ehkg-popup-section";
			let titleLabel = document.createElement("div");
			titleLabel.className = "ehkg-popup-section-title";
			titleLabel.textContent = "關於";
			section.append(titleLabel);
			let versionLabel = document.createElement("div");
			versionLabel.style.cssText = "padding:4px 8px; white-space:pre; line-height:1.5;";
			versionLabel.style.whiteSpace = "pre";
			versionLabel.textContent = "版本 " + GM.info.script.name + " " + GM.info.script.version;
			versionLabel.textContent += "\n管理器 " + GM.info.scriptHandler + " " + GM.info.version;
			if (GM.info.userAgentData) {// Tampermonkey
				let userAgentData = GM.info.userAgentData;
				versionLabel.textContent += "\n瀏覽器 " + (userAgentData.brands && userAgentData.brands[0] ? userAgentData.brands[0].brand + " " + userAgentData.brands[0].version : "Unknown");
				versionLabel.textContent += "\n系統環境 " + userAgentData.platform + (userAgentData.architecture ? " " + userAgentData.architecture + " " + userAgentData.bitness + "-bit" : "") + (userAgentData.mobile ? " Mobile" : "");
			} else if (GM.info.platform) {// Violentmonkey
				let platform = GM.info.platform;
				versionLabel.textContent += "\n瀏覽器 " + platform.browserName + " " + platform.browserVersion;
				versionLabel.textContent += "\n系統環境 " + (platform.os?.charAt(0).toUpperCase() + platform.os?.slice(1)) + " " + platform.arch + (platform.mobile ? " Mobile" : "");
			}
			section.append(versionLabel);
			let updateButton = document.createElement("div");
			updateButton.className = "ehkg-options-button";
			updateButton.textContent = "檢查更新";
			updateButton.addEventListener("click", () => {
				PAGE_WINDOW.open(SCRIPT_HOST, "_blank", "noopener, noreferrer");
			});
			section.append(updateButton);
		}
		content.append(aboutSection);
	}
	document.body.append(bubble);
	refreshOptions(false);
	document.addEventListener("touchstart", (event) => {
		if (!bubble.contains(event.target)) {
			popup.classList.toggle("ehkg-invisible", true);
			saveSession();
		}
	});
	document.addEventListener("mousedown", (event) => {
		if (OPTIONS["auto_hide_ui"].value) {
			if (!bubble.contains(event.target)) {
				popup.classList.toggle("ehkg-invisible", true);
				saveSession();
			}
		}
	});
}

function generateOptionsSelectionRow(id, iconUrl, text, values) {
	let row = document.createElement("div");
	row.className = "ehkg-options-row";
	let labelCol = document.createElement("div");
	labelCol.className = "ehkg-options-label";
	if (iconUrl) {
		let icon = document.createElement("img");
		icon.src = iconUrl;
		labelCol.append(icon);
	}
	labelCol.append(text);
	let valueCol = document.createElement("div");
	valueCol.className = "ehkg-options-value";
	let selectionBox = document.createElement("select");
	selectionBox.id = id;
	selectionBox.className = "ehkg-options-select";
	for (let i = 0; i < values.length; ++i) {
		let option = document.createElement("option");
		option.value = i;
		option.textContent = values[i];
		selectionBox.append(option);
	}
	valueCol.append(selectionBox);
	row.append(labelCol, valueCol);
	return row;
}

function setupCustomChannelList(list) {
	list.replaceChildren();
	let channelIds = OPTIONS["custom_channel_list"].value?.toUpperCase().replace(/^\|+|\|+$/g, "").split("|");
	for (const channelId of channelIds) {
		let button = generateCustomChannelButton(channelId.trim());
		if (button) {
			list.append(button);
		}
	}
	if (list.childElementCount === 0) {
		list.append(generateCustomChannelButton("BW"));
	}
}

function generateCustomChannelButton(channelId) {
	let channel = CHANNELS[channelId];
	if (channel) {
		let button = CUSTOM_CHANNEL_TEMPLATE.cloneNode(true);
		button.querySelector("use").setAttribute("href", channel.symbol);
		button.querySelector("use").setAttributeNS(XLINK_NS, "xlink:href", channel.symbol);
		button.querySelector("span").textContent = channel.name;
		button.addEventListener("click", (event) => {
			navigateToChannel(channelId);
			if (IS_MOBILE || OPTIONS["auto_hide_ui"].value) {
				document.querySelector("#ehkg-popup").classList.toggle("ehkg-invisible", true);
				saveSession();
			}
		});
		return button;
	}
	return null;
}

function navigateToChannel(id) {
	if (IS_NEW_DESKTOP_FORUM || IS_NEW_MOBILE_FORUM) {
		let channel = CHANNELS[id];
		let officalButton = document.querySelector("use[*|href='" + channel.symbol + "']:not(.ehkg-use)")?.parentNode;// svg
		if (officalButton) {
			officalButton.dispatchEvent(new Event("click", {bubbles: true}));
			return true;
		} else {
			switch (id) {
				case "REWIND":
					PAGE_WINDOW.location.href = "/rewind";
					return true;
				case "BOOKMARKS":
					PAGE_WINDOW.location.href = "/bookmarks";
					return true;
				case "MESSAGE":
					PAGE_WINDOW.location.href = "/message";
					return true;
				case "FOLLOW":
					PAGE_WINDOW.location.href = "/user/" + retrieveUserId() + "/follow";
					return true;
				case "HISTORY":
					PAGE_WINDOW.location.href = "/user/" + retrieveUserId() + "/posthistory";
					return true;
				default:
					PAGE_WINDOW.location.href = "/channel/" + id;
					return true;
			}
		}
	} else {
		switch (id) {
			case "REWIND":
				PAGE_WINDOW.location.href = IS_OLD_DESKTOP_FORUM ? "/ProfilePage.aspx?userid=" + retrieveUserId() + "&type=rewind" : "/rewind.aspx";
				return true;
			case "BOOKMARKS":
				PAGE_WINDOW.location.href = IS_OLD_DESKTOP_FORUM ? "/ProfilePage.aspx?userid=" + retrieveUserId() + "&type=bookmark" : "/ViewBookmark.aspx";
				return true;
			case "MESSAGE":
				PAGE_WINDOW.location.href = IS_OLD_DESKTOP_FORUM ? "/ProfilePage.aspx?userid=" + retrieveUserId() + "&type=pm" : "/pmlist.aspx";
				return true;
			case "FOLLOW":
				PAGE_WINDOW.location.href = IS_OLD_DESKTOP_FORUM ? "/ProfilePage.aspx?userid=" + retrieveUserId() + "&type=follow" : "/followlist.aspx";
				return true;
			case "HISTORY":
				PAGE_WINDOW.location.href = IS_OLD_DESKTOP_FORUM ? "/ProfilePage.aspx?userid=" + retrieveUserId() + "&type=history" : "/history.aspx";
				return true;
			default:
				PAGE_WINDOW.location.href = "/topics.aspx?type=" + id;
				return true;
		}
	}
	return false;
}

function handleAnchor(anchor, manual) {
	let target = anchor.getAttribute("target");
	if ((target !== "_blank" && target !== "blank") || anchor.textContent.length === 0) {
		return;
	}
	// Convert
	if (OPTIONS["convert_hkg_url"].value) {
		if (convertNavigation(anchor)) {
			return;
		}
	}
	// Embed
	let isQuoted = anchor.parentNode?.tagName === "BLOCKQUOTE" || anchor.parentNode?.parentNode?.tagName === "BLOCKQUOTE";
	let embedQuoted = OPTIONS["embed_quoted"].value;
	if (isQuoted && !embedQuoted) {
		return;
	}
	let href = anchor.getAttribute("href")?.replace(/\/+$/, "");// || "";
	let matched = null;
	let mode;
	let skipQuoted = (isQuoted && embedQuoted !== 1);
	if (mode = OPTIONS["embed_youtube"].value) {
		let type = "youtube";
		let delay = (!manual && (mode === 2 || skipQuoted));
		// YouTube Video (watch)
		if (matched = /^https?:\/\/(www\.|m\.)?youtube\.com\/watch\?v=.+/.exec(href)) {
			if (delay) {
				attachEmbedButton(anchor, type);
				return;
			}
			let timeMatched = /(\?|&)t=\d+/.exec(matched[0]);
			let time = timeMatched ? "?start=" + timeMatched[0].slice(3) : "";
			let src = "https://www.youtube.com/embed/" + /v=[^&]+/.exec(matched[0])[0].slice(2) + time;
			let cssText = "width:640px; height:auto; aspect-ratio:16/9;";
			attachEmbedContent(anchor, type, src, cssText);
			return;
		}
		// YouTube Video (shorten)
		if (matched = /^https?:\/\/youtu\.be\/.+/.exec(href)) {
			if (delay) {
				attachEmbedButton(anchor, type);
				return;
			}
			let timeMatched = /(\?|&)t=\d+/.exec(matched[0]);
			let time = timeMatched ? "?start=" + timeMatched[0].slice(3) : "";
			let src = "https://www.youtube.com/embed/" + /.be\/[^\?]+/.exec(matched[0])[0].slice(4) + time;
			let cssText = "width:640px; height:auto; aspect-ratio:16/9;";
			attachEmbedContent(anchor, type, src, cssText);
			return;
		}
		// YouTube Short
		if (matched = /^https?:\/\/(www\.|m\.)?youtube\.com\/shorts\/.+/.exec(href)) {
			if (delay) {
				attachEmbedButton(anchor, type);
				return;
			}
			let timeMatched = /(\?|&)t=\d+/.exec(matched[0]);
			let time = timeMatched ? "?start=" + timeMatched[0].slice(3) : "";
			let src = "https://www.youtube.com/embed/" + /\/shorts\/[^\?]+/.exec(matched[0])[0].slice(8) + time;
			let cssText = "width:360px; height:auto; aspect-ratio:9/16;";// calc(min(640px,100%)/16*9)
			attachEmbedContent(anchor, type, src, cssText);
			return;
		}
		// YouTube Live
		if (matched = /^https?:\/\/(www\.|m\.)?youtube\.com\/live\/.+/.exec(href)) {
			if (delay) {
				attachEmbedButton(anchor, type);
				return;
			}
			let timeMatched = /(\?|&)t=\d+/.exec(matched[0]);
			let time = timeMatched ? "?start=" + timeMatched[0].slice(3) : "";
			let src = "https://www.youtube.com/embed/" + /\/live\/[^\?]+/.exec(matched[0])[0].slice(6) + time;
			let cssText = "width:640px; height:auto; aspect-ratio:16/9;";
			attachEmbedContent(anchor, type, src, cssText);
			return;
		}
	}
	if (mode = OPTIONS["embed_twitter"].value) {
		let type = "twitter";
		let delay = (!manual && (mode === 2 || skipQuoted));
		// Twitter Tweet
		if (matched = /^https?:\/\/(www\.)?(x|twitter)\.com\/[^\/]+\/status\/\d+/.exec(href)) {
			if (delay) {
				attachEmbedButton(anchor, type);
				return;
			}
			let src = "https://platform.twitter.com/embed/Tweet.html?id=" + /\/status\/\d+/.exec(matched[0])[0].slice(8) + "&dnt=true&frame=false&hideCard=false&hideThread=false&lang=zh-tw&theme=dark";
			let cssText = "width:550px; border-radius:12px;";
			attachEmbedContent(anchor, type, src, cssText, true);
			return;
		}
	}
	if (mode = OPTIONS["embed_instagram"].value) {
		let type = "instagram";
		let delay = (!manual && (mode === 2 || skipQuoted));
		// Instagram Post
		if (matched = /^https?:\/\/(www\.)?instagram\.com\/p\/[^\/]+/.exec(href)) {
			if (delay) {
				attachEmbedButton(anchor, type);
				return;
			}
			let src = "https://www.instagram.com/p/" + /\/p\/[^\/]+/.exec(matched[0])[0].slice(3) + "/embed/captioned/";
			let cssText = "width:542px; border-radius:3px; border:1px solid rgb(219, 219, 219); background-color:#FFF;";
			attachEmbedContent(anchor, type, src, cssText, true);
			return;
		}
		// Instagram Reel
		if (matched = /^https?:\/\/(www\.)?instagram\.com\/reels?\/[^\/]+/.exec(href)) {
			if (delay) {
				attachEmbedButton(anchor, type);
				return;
			}
			let src = "https://www.instagram.com/reel/" + /[^\/]+$/.exec(matched[0])[0] + "/embed/captioned/";
			let cssText = "width:542px; border-radius:3px; border:1px solid rgb(219, 219, 219); background-color:#FFF;";
			attachEmbedContent(anchor, type, src, cssText, true);
			return;
		}
	}
	if (mode = OPTIONS["embed_threads"].value) {
		let type = "threads";
		let delay = (!manual && (mode === 2 || skipQuoted));
		// Threads Post
		if (matched = /^https?:\/\/(www\.)?threads\.com\/@[^\/]+\/post\/[^\?]+/.exec(href)) {
			if (delay) {
				attachEmbedButton(anchor, type);
				return;
			}
			let src = "https://www.threads.com/" + /@[^\/]+\/post\/[^\?]+/.exec(matched[0])[0] + "/embed/";
			let cssText = "width:540px; border-radius:12px;";
			attachEmbedContent(anchor, type, src, cssText, true);
			return;
		}
	}
	if (mode = OPTIONS["embed_facebook"].value) {
		let type = "facebook";
		let delay = (!manual && (mode === 2 || skipQuoted));
		// Facebook Page Post
		if (matched = /^https?:\/\/(www\.)?facebook\.com\/permalink\.php\?story_fbid=[^&]+&id=\d+/.exec(href)) {
			if (delay) {
				attachEmbedButton(anchor, type);
				return;
			}
			let channel = "https://staticxx.facebook.com/x/connect/xd_arbiter/?version=46#&origin=" + encodeURIComponent(ORIGIN) + "&relation=parent.parent";
			let src = "https://web.facebook.com/plugins/post.php?href=" + encodeURIComponent(matched[0]) + "&channel=" + encodeURIComponent(channel) + "&sdk=joey&locale=zh_HK&width=500";
			let cssText = "width:500px; border-radius:3px; background-color:#FFF; outline:1px solid #dddfe2; outline-offset:-1px;";
			attachEmbedContent(anchor, type, src, cssText, true);
			return;
		}
		// Facebook User Post
		if (matched = /^https?:\/\/(www\.)?facebook\.com\/[^\/]+\/posts\/[\d\w]+/.exec(href)) {
			if (delay) {
				attachEmbedButton(anchor, type);
				return;
			}
			let channel = "https://staticxx.facebook.com/x/connect/xd_arbiter/?version=46#&origin=" + encodeURIComponent(ORIGIN) + "&relation=parent.parent";
			let src = "https://web.facebook.com/plugins/post.php?href=" + encodeURIComponent(matched[0]) + "&channel=" + encodeURIComponent(channel) + "&sdk=joey&locale=zh_HK&width=500";
			let cssText = "width:500px; border-radius:3px; background-color:#FFF; outline:1px solid #dddfe2; outline-offset:-1px;";
			attachEmbedContent(anchor, type, src, cssText, true);
			return;
		}
		// Facebook Photo
		if (matched = /^https?:\/\/(www\.)?facebook\.com\/photo(\.php|\/)?\?fbid=\d+/.exec(href)) {
			if (delay) {
				attachEmbedButton(anchor, type);
				return;
			}
			let channel = "https://staticxx.facebook.com/x/connect/xd_arbiter/?version=46#&origin=" + encodeURIComponent(ORIGIN) + "&relation=parent.parent";
			let src = "https://web.facebook.com/plugins/post.php?href=" + encodeURIComponent(matched[0]) + "&channel=" + encodeURIComponent(channel) + "&sdk=joey&locale=zh_HK&show_text=true&width=500";
			let cssText = "width:500px; border-radius:3px; background-color:#FFF; outline:1px solid #dddfe2; outline-offset:-1px;";
			attachEmbedContent(anchor, type, src, cssText, true);
			return;
		}
		// Facebook Reel
		if (matched = /^https?:\/\/(www\.)?facebook\.com\/reel\/\d+/.exec(href)) {
			if (delay) {
				attachEmbedButton(anchor, type);
				return;
			}
			let channel = "https://staticxx.facebook.com/x/connect/xd_arbiter/?version=46#&origin=" + encodeURIComponent(ORIGIN) + "&relation=parent.parent";
			let src = "https://web.facebook.com/plugins/post.php?href=" + encodeURIComponent(matched[0]) + "&channel=" + encodeURIComponent(channel) + "&sdk=joey&locale=zh_HK&show_text=true&autoplay=false&width=500";
			let cssText = "width:500px; border-radius:3px; background-color:#FFF; outline:1px solid #dddfe2; outline-offset:-1px;";
			attachEmbedContent(anchor, type, src, cssText, true);
			return;
		}
	}
	if (mode = OPTIONS["embed_streamable"].value) {
		let type = "streamable";
		let delay = (!manual && (mode === 2 || skipQuoted));
		// Streamable
		if (matched = /^https?:\/\/(www\.)?streamable\.com\/.+/.exec(href)) {
			if (delay) {
				attachEmbedButton(anchor, type);
				return;
			}
			let timeMatched = /(\?|&)t=\d+/.exec(matched[0]);
			let time = timeMatched ? "&t=" + timeMatched[0].slice(3) : "";
			let src = "https://streamable.com/o/" + /.com\/[\d\w]+/.exec(matched[0])[0].slice(5) + "?autoplay=0" + time;
			let cssText = "width:640px; height:auto; aspect-ratio:16/9;";
			attachEmbedContent(anchor, type, src, cssText);
			return;
		}
	}
	if (mode = OPTIONS["embed_vimeo"].value) {
		let type = "vimeo";
		let delay = (!manual && (mode === 2 || skipQuoted));
		// Vimeo
		if (matched = /^https?:\/\/(www\.)?vimeo\.com\/.+/.exec(href)) {
			if (delay) {
				attachEmbedButton(anchor, type);
				return;
			}
			let timeMatched = /#t=[\d\w\.]+/.exec(matched[0]);
			let time = timeMatched ? timeMatched[0] : "";
			let src = "https://player.vimeo.com/video/" + /.com\/[\d\w]+/.exec(matched[0])[0].slice(5) + "?dnt=0&badge=0&autopause=0&transparent=0" + time;
			let cssText = "width:640px; height:auto; aspect-ratio:16/9;";
			attachEmbedContent(anchor, type, src, cssText);
			return;
		}
	}
	if (mode = OPTIONS["embed_dailymotion"].value) {
		let type = "dailymotion";
		let delay = (!manual && (mode === 2 || skipQuoted));
		// Dailymotion
		if (matched = /^https?:\/\/(www\.)?dailymotion\.com\/video\/.+/.exec(href)) {
			if (delay) {
				attachEmbedButton(anchor, type);
				return;
			}
			let timeMatched = /(\?|&)start=\d+/.exec(matched[0]);
			let time = timeMatched ? "&startTime=" + timeMatched[0].slice(7) : "";
			let src = "https://geo.dailymotion.com/player.html?video=" + /\/video\/[\d\w]+/.exec(matched[0])[0].slice(7) + "&autoplay=false&mute=false" + time;
			let cssText = "width:640px; height:auto; aspect-ratio:16/9;";
			attachEmbedContent(anchor, type, src, cssText);
			return;
		}
	}
	if (mode = OPTIONS["embed_niconico"].value) {
		let type = "niconico";
		let delay = (!manual && (mode === 2 || skipQuoted));
		// NicoNico Video
		if (matched = /^https?:\/\/(www\.)?nicovideo\.jp\/watch\/.+/.exec(href)) {
			if (delay) {
				attachEmbedButton(anchor, type);
				return;
			}
			let timeMatched = /(\?|&)from=[\d\.]+/.exec(matched[0]);
			let time = timeMatched ? "&from=" + timeMatched[0].slice(6) : "";
			let src = "https://embed.nicovideo.jp/watch/" + /\/watch\/[\d\w]+/.exec(matched[0])[0].slice(7) + "?autoplay=0" + time;
			let cssText = "width:640px; height:auto; aspect-ratio:16/9;";
			attachEmbedContent(anchor, type, src, cssText);
			return;
		}
		// NicoNico Live
		if (matched = /^https?:\/\/live\.nicovideo\.jp\/watch\/[\d\w]+/.exec(href)) {
			if (delay) {
				attachEmbedButton(anchor, type);
				return;
			}
			let src = "https://live.nicovideo.jp/embed/" + /\/watch\/[\d\w]+/.exec(matched[0])[0].slice(7);
			let cssText = "width:237px; height:262px;";
			attachEmbedContent(anchor, type, src, cssText);
			return;
		}
	}
	if (mode = OPTIONS["embed_bilibili"].value) {
		let type = "bilibili";
		let delay = (!manual && (mode === 2 || skipQuoted));
		// BiliBili Video
		if (matched = /^https?:\/\/(www\.|m\.)?bilibili\.com\/video\/.+/.exec(href)) {
			if (delay) {
				attachEmbedButton(anchor, type);
				return;
			}
			let id = /\/video\/[\d\w]+/.exec(matched[0])[0].slice(7);
			let timeMatched = /(\?|&)t=\d+/.exec(matched[0]);
			let time = timeMatched ? "&t=" + timeMatched[0].slice(3) : "";
			let src = "https://player.bilibili.com/player.html?" + (/^av\d+$/.test(id) ? "aid=" + id.slice(2) : "bvid=" + id) + "&autoplay=false&preload=none" + time;
			let cssText = "width:640px; height:auto; aspect-ratio:16/9;";
			attachEmbedContent(anchor, type, src, cssText);
			return;
		}
	}
	if (mode = OPTIONS["embed_tiktok"].value) {
		let type = "tiktok";
		let delay = (!manual && (mode === 2 || skipQuoted));
		// TikTok
		if (matched = /^https?:\/\/(www\.)?tiktok\.com\/@[^\/]+\/video\/.+/.exec(href)) {
			if (delay) {
				attachEmbedButton(anchor, type);
				return;
			}
			//let src = "https://www.tiktok.com/embed/v2/" + /\/video\/\d+/.exec(matched[0])[0].slice(7) + "?lang=zh-TW&autoplay=0";
			//let cssText = "width:325px; border-radius:8px";
			let src = "https://www.tiktok.com/player/v1/" + /\/video\/\d+/.exec(matched[0])[0].slice(7) + "?autoplay=0&music_info=1&description=1";
			let cssText = "width:360px; height:auto; aspect-ratio:9/16;";// calc(min(640px,100%)/16*9)
			attachEmbedContent(anchor, type, src, cssText);
			return;
		}
	}
	if (mode = OPTIONS["embed_twitch"].value) {
		let type = "twitch";
		let delay = (!manual && (mode === 2 || skipQuoted));
		// Twitch Channel
		if (matched = /^https?:\/\/(www\.)?twitch\.tv\/[^(videos\/)(collections\/)][\d\w]+$/.exec(href)) {
			if (delay) {
				attachEmbedButton(anchor, type);
				return;
			}
			let src = "https://player.twitch.tv/?channel=" + /\.tv\/[\d\w]+/.exec(matched[0])[0].slice(4) + "&parent=" + HOSTNAME + "&autoplay=false";
			let cssText = "width:640px; height:auto; aspect-ratio:16/9;";
			attachEmbedContent(anchor, type, src, cssText);
			return;
		}
		// Twitch Video
		if (matched = /^https?:\/\/(www\.)?twitch\.tv\/videos\/.+/.exec(href)) {
			if (delay) {
				attachEmbedButton(anchor, type);
				return;
			}
			let timeMatched = /(\?|&)t=[\d\w]+/.exec(matched[0]);
			let time = timeMatched ? "&time=" + timeMatched[0].slice(3) : "";
			let src = "https://player.twitch.tv/?video=v" + /\/videos\/\d+/.exec(matched[0])[0].slice(8) + "&parent=" + HOSTNAME + "&autoplay=false" + time;
			let cssText = "width:640px; height:auto; aspect-ratio:16/9;";
			attachEmbedContent(anchor, type, src, cssText);
			return;
		}
		// Twitch Collection
		if (matched = /^https?:\/\/(www\.)?twitch\.tv\/collections\/.+/.exec(href)) {
			if (delay) {
				attachEmbedButton(anchor, type);
				return;
			}
			let timeMatched = /(\?|&)t=[\d\w]+/.exec(matched[0]);
			let time = timeMatched ? "&time=" + timeMatched[0].slice(3) : "";
			let src = "https://player.twitch.tv/?collection=" + /\/collections\/[^\?]+/.exec(matched[0])[0].slice(13) + "&parent=" + HOSTNAME + "&autoplay=false" + time;
			let cssText = "width:640px; height:auto; aspect-ratio:16/9;";
			attachEmbedContent(anchor, type, src, cssText);
			return;
		}
		// Twitch Clip
		if (matched = /^https?:\/\/(www\.)?twitch\.tv\/[^\/]+\/clip\/[^\/]+/.exec(href)) {
			if (delay) {
				attachEmbedButton(anchor, type);
				return;
			}
			let src = "https://clips.twitch.tv/embed?clip=" + /\/clip\/[^\/]+/.exec(matched[0])[0].slice(6) + "&parent=" + HOSTNAME + "&autoplay=false";
			let cssText = "width:640px; height:auto; aspect-ratio:16/9;";
			attachEmbedContent(anchor, type, src, cssText);
			return;
		}
	}
	if (mode = OPTIONS["embed_reddit"].value) {
		let type = "reddit";
		let delay = (!manual && (mode === 2 || skipQuoted));
		// Reddit Post
		if (matched = /^https?:\/\/(www\.)?reddit\.com\/r\/[^\/]+\/comments\/.+/.exec(href)) {
			if (delay) {
				attachEmbedButton(anchor, type);
				return;
			}
			let src = "https://embed.reddit.com/r/" + /\/r\/.+/.exec(matched[0])[0].slice(3) + "?theme=dark";
			let cssText = "width:640px; border-radius:8px;";
			attachEmbedContent(anchor, type, src, cssText, true);
			return;
		}
	}
	if (mode = OPTIONS["embed_steam"].value) {
		let type = "steam";
		let delay = (!manual && (mode === 2 || skipQuoted));
		// Steam App
		if (matched = /^https?:\/\/store\.steampowered\.com\/(agecheck\/)?app\/\d+/.exec(href)) {
			if (delay) {
				attachEmbedButton(anchor, type);
				return;
			}
			let src = "https://store.steampowered.com/widget/" + /\/app\/\d+/.exec(matched[0])[0].slice(5);
			let cssText = "width:646px; height:190px; border-radius:4px;";
			attachEmbedContent(anchor, type, src, cssText);
			return;
		}
	}
}

function attachEmbedButton(anchor, type) {
	let button = EMBED_BUTTON_TEMPLATE.cloneNode(true);
	button.querySelector("img").src = FAVICON_URLS[type];
	button.addEventListener("click", (event) => {
		event.stopPropagation();
		button.remove();
		handleAnchor(anchor, true);
	});
	anchor.after(button);
}

function attachEmbedContent(anchor, type, src, cssText, dynamic) {
	let startTime = performance.now();
	let container = EMBED_CONTAINER_TEMPLATE.cloneNode(true);
	let loader = EMBED_LOADER_TEMPLATE.cloneNode(true);
	let iframe = EMBED_IFRAME_TEMPLATE.cloneNode(true);
	let reveal = () => {
		loader.remove();
		iframe.classList.remove("ehkg-embed-loading-iframe");
		log("Embedded content is loaded. (" + (performance.now() - startTime).toFixed(1) + " ms)\n" + src);
	};
	loader.querySelector("img").src = FAVICON_URLS[type];
	iframe.dataset.ehkgEmbed = type;
	iframe.src = src;
	iframe.style.cssText = cssText;
	iframe.classList.add("ehkg-embed-loading-iframe");
	iframe.addEventListener("load", (IS_GREASEMONKEY ? exportFunction(reveal, PAGE_WINDOW) : reveal), (IS_GREASEMONKEY ? cloneInto({once: true}, PAGE_WINDOW) : {once: true}));
	container.append(iframe, loader);
	anchor.after(container);
}

function convertNavigation(anchor) {
	let href = anchor.getAttribute("href");
	let navigation = retrieveNavigation(href);
	if (navigation) {
		let des;
		if (IS_NEW_DESKTOP_FORUM || IS_NEW_MOBILE_FORUM) {
			if (navigation.thread) {
				des = "https://" + HOSTNAME + "/thread/" + navigation.thread + (navigation.page ? "/page/" + navigation.page : "");
			} else {
				des = "https://" + HOSTNAME + "/channel/" + navigation.channel + (navigation.page ? "/page/" + navigation.page : "");
			}
		}
		if (IS_OLD_DESKTOP_FORUM || IS_OLD_MOBILE_FORUM) {
			if (navigation.thread) {
				des = "https://" + HOSTNAME + "/view.aspx?message=" + navigation.thread + (navigation.page ? "&page=" + navigation.page : "");
			} else {
				des = "https://" + HOSTNAME + "/topics.aspx?type=" + navigation.channel + (navigation.page ? "&page=" + navigation.page : "");
			}
		}
		anchor.setAttribute("href", des);
		log("Anchor with href '" + href +"' is converted to '" + des + "'.\n", anchor);
		return true;
	}
	return false;
}

function handleSVG(svg) {
	if (OPTIONS["disable_svg_animation"].value) {
		svg.pauseAnimations();
	}
}
var t = 1;
function handleTextArea(textArea) {
	if (!OPTIONS["text_counter"].value) {
		return;
	}
	if (textArea.className?.startsWith("ehkg-")) {
		return;
	}
	if (IS_NEW_DESKTOP_FORUM || IS_NEW_MOBILE_FORUM) {
		if (textArea.id != "replyBody" && textArea.id != "postBody") {
			return;
		}
	}
	if (IS_OLD_DESKTOP_FORUM || IS_OLD_MOBILE_FORUM) {
		if (!(/(post|view)\.aspx/.test(PAGE_WINDOW.location.pathname))) {// view.aspx||post.aspx||SendPM.aspx||sendPM.aspx
			return;
		}
	}
	if (textArea.dataset.ehkgHandled) {
		return;
	} else {
		textArea.dataset.ehkgHandled = "true";
	}
	let counter = TEXT_COUNTER_TEMPLATE.cloneNode(true);
	refreshTextCounter(textArea, counter);
	textArea.after(counter);
	textArea.style.display = "block";
	textArea.addEventListener("input", (event) => {
		refreshTextCounter(textArea, counter);
	});
	if (!textArea.matches("header textarea")) {
		let intervalId = setInterval(() => {
			if (document.body.contains(textArea)) {
				refreshTextCounter(textArea, counter);
			} else {
				clearInterval(intervalId);
				log("Fallback interval '" + intervalId + "' is removed with textarea.\n", textArea);
			}
		}, TEXT_INTERVAL);// Fallback
		log("Fallback interval '" + intervalId + "' is attached to textarea.\n", textArea);
	}
	if (IS_NEW_DESKTOP_FORUM || IS_NEW_MOBILE_FORUM) {
		textArea.style.height = "calc(100% - 48px)";// +8px
		return;
	}
	if (IS_OLD_DESKTOP_FORUM) {
		let previousNode = textArea.previousSibling;
		if (previousNode && previousNode.nodeType === Node.TEXT_NODE && previousNode.nodeValue.trim().length === 0) {
			previousNode.remove();
		}
	}
}

function refreshTextCounter(textarea, counter) {
	let value = textarea.value.trim();
	let rawLength = value.length;
	let nonPrintableASCIICount = value.match(/[^ -~]/g)?.length || 0;
	let newLineCount = value.match(/\n/g)?.length || 0;
	let finalLength = rawLength + nonPrintableASCIICount + (newLineCount * 2);
	let digitLabel = counter.querySelector(".ehkg-counter-counted");
	digitLabel.classList.toggle("exceeded", finalLength > TEXT_LIMIT);
	digitLabel.textContent = finalLength;
}

function handleButton(button) {
	if (OPTIONS["avatar_list"].value) {
		if (IS_NEW_DESKTOP_FORUM || IS_NEW_MOBILE_FORUM) {
			if (button.textContent === "抽新頭像") {
				attachAvatarButton(button.parentNode.parentNode, "after");
			}
		}
	}
}

function attachAvatarButton(element, method) {
	let button = AVATAR_BUTTON_TEMPLATE.cloneNode(true);
	button.addEventListener("click", (event) => {
		attachAvatarList(button, "replaceWith");
	});
	element[method](button);
}

function attachAvatarList(element, method) {
	let startTime = performance.now();
	let container = AVATAR_LIST_TEMPLATE.cloneNode(true);
	let loader = container.querySelector(".ehkg-avatar-loader");
	let list = container.querySelector(".ehkg-avatar-list");
	let refreshButton = container.querySelector(".ehkg-avatar-refresh");
	refreshButton.addEventListener("click", async (event) => {
		if (discoverNextAvatarPageButton()) {
			if (confirm("需要將持有頭像全部顯示才能夠準確統計。\n確定要將持有頭像全部載入？\n（根據所持數量將會花費相應時間）")) {
				loader.classList.toggle("ehkg-hidden", false);
				await discoverAllAvatarPages();
				loader.classList.toggle("ehkg-hidden", true);
			} else {
				return;
			}
		}
		refreshAvatarList(container);
		alert("統計完畢，並已自動標記被系統錯誤重覆顯示的頭像。");
	});
	element[method](container);
	loadAvatarChain(list, 1).then((index) => {
		loader.classList.toggle("ehkg-hidden", true);
		log("All " + (index - 1) + " available avatars are loaded. (" + (performance.now() - startTime).toFixed(1) + " ms)");
	});
}

function loadAvatarChain(list, index, chainedResolve) {
	return new Promise((resolve) => {
		let frame = AVATAR_FRAME_TEMPLATE.cloneNode(true);
		let img = frame.querySelector("img");
		let loadListener, errorListener;
		loadListener = (event) => {
			img.removeEventListener("load", loadListener);
			img.removeEventListener("error", errorListener);
			frame.style.visibility = "visible";
			loadAvatarChain(list, index + 1, chainedResolve ? chainedResolve : resolve);
		};
		errorListener = (event) => {
			img.removeEventListener("load", loadListener);
			img.removeEventListener("error", errorListener);
			frame.remove();
			chainedResolve ? chainedResolve(index) : resolve(index);
		};
		frame.title = "No. " + index;
		frame.dataset.index = index;
		img.src = "https://assets.hkgolden.com/member_icons/" + index + ".gif";
		img.addEventListener("load", loadListener, {once: true});
		img.addEventListener("error", errorListener, {once: true});
		list.append(frame);
	});
}

function discoverNextAvatarPageButton() {
	let buttons = document.querySelectorAll("button");
	for (const button of buttons) {
		if (button.textContent === "顯示更多") {
			return button;
		}
	}
	return null;
}

function discoverAllAvatarPages() {
	return new Promise(async (resolve) => {
		let button;
		do {
			while (button = discoverNextAvatarPageButton()) {
				button.dispatchEvent(new Event("click", {bubbles: true}));
				await delay(250);
			}
			await delay(1000);// Make sure
		} while (button = discoverNextAvatarPageButton());
		resolve();
	});
}

function refreshAvatarList(container) {
	let list = container.querySelector(".ehkg-avatar-list");
	let imgs = document.querySelectorAll("img[alt=\"avatar\"]");
	let collection = {};
	let collected = 0;
	let imgIndex = 0;
	let total = 0;
	for (const img of imgs) {
		let number = /\d+/.exec(img.src);
		let owned = collection[number];
		if (img.parentNode?.nextSibling?.localName === "button") {
			collection.using = number;
			collection[number] = owned ? owned + 1 : 1;
			total += 1;
			continue;
		}
		if ((imgIndex + 1) % 31 == 0) {// Skip the first duplicate avatar on every next page
			img.title = "被重覆顯示\n不會將此頭像納入計算";
			img.parentNode.style.outline = "2px solid #FF0000";
			imgIndex += 1;
			continue;
		}
		collection[number] = owned ? owned + 1 : 1;
		img.parentNode.style.outline = "";
		total += 1;
		imgIndex += 1;
	}
	let frames = list.children;
	for (const frame of frames) {
		let i = frame.dataset.index;
		let owned = collection[i];
		let using = i == collection.using;
		if (owned) {
			++collected;
		}
		frame.title = "No. " + i + (owned ? "\n持有 " + owned + " 個" : "") + (using ? "\n使用中" : "");
		frame.classList.toggle("ehkg-owned", owned ? true : false);
		frame.classList.toggle("ehkg-using", using);
	}
	let infoLabel = container.querySelector(".ehkg-avatar-info");
	infoLabel.firstChild.textContent = "收藏了 " + collected + " / " + list.children.length + " 個";
	infoLabel.lastChild.textContent = "（持有 " + total + " 個）";// imgs.length
}

function handleElement(element) {
	switch (element.localName) {
		case "a":
			handleAnchor(element, false);
			return true;
		case "svg":
			handleSVG(element);
			return true;
		case "textarea":
			handleTextArea(element);
			return true;
		case "button":
			handleButton(element);
			return true;
	}
	if (OPTIONS["improve_rendering"].value) {
		if (element.matches(SELECTORS.intersection)) {
			INTERSECTION_OBSERVER.observe(element);
			return true;
		}
	}
	return false;
}

function handleMessage(event) {
	let iframes = document.querySelectorAll("iframe");
	for (const iframe of iframes) {
		if (iframe.contentWindow === event.source && event.data) {
			let data = event.data;
			let type = iframe.dataset.ehkgEmbed;
			switch (type) {
				case "twitter":
					if (data["twttr.embed"].method == "twttr.private.resize") {// data:{"twttr.embed":{method:"twttr.private.resize",params:[{width:_,height:_,data:{}}]}}
						iframe.style.height = data["twttr.embed"].params[0].height + "px";
					}
					break;
				case "instagram":
					if (/"type":"MEASURE"/.test(data)) {// data:'{"details":{"height":_},"type":"MEASURE"}'
						iframe.style.height = (parseInt(/"height":\d+/.exec(data)[0].slice(9)) + 2) + "px";
					}
					break;
				case "threads":
					if (/^\d+$/.test(data)) {// data:_
						iframe.style.height = data + "px";
					}
					break;
				case "facebook":
					if (/type=resize/.test(data)) {// data:"type=resize&width=_&height=_"
						iframe.style.height = /height=\d+/.exec(data)[0].slice(7) + "px";
					}
					break;
				case "reddit":
					if (/"type":"resize\.embed"/.test(data)) {// data:'{"type":"resize.embed","data":_}'
						iframe.style.height = /"data":\d+/.exec(data)[0].slice(7) + "px";
					}
					break;
				case "tiktok":
					/*if (/"height":\d+/.test(data)) {// data:'{"signalSource":"","width":_,"height":_}'
						iframe.style.height = /"height":\d+/.exec(data)[0].slice(9) + "px";
					}*/
					break;
			}
			log("Message received from " + (type ? "a '" + type + "'" : "an unhandled") + " iframe.\n", {"source":iframe, "data":event.data});
			return;
		}
	}
}

function retrieveUserId() {
	if (IS_NEW_DESKTOP_FORUM || IS_NEW_MOBILE_FORUM) {
		let userInfo = localStorage.getItem("user_info");
		if (userInfo) {
			let matched;
			if (matched = /"userId":\d+/.exec(userInfo)) {
				return parseInt(matched[0].slice(9));
			}
		}
		return null;
	}
	if (IS_OLD_DESKTOP_FORUM) {
		let href = PAGE_WINDOW.location.href;
		let matched;
		if (matched = /ProfilePage\.aspx\?userid=\d+/.exec(href)) {
			return parseInt(matched[0].slice(24));
		}
		let anchor = document.querySelector("a[href^='ProfilePage.aspx?userid=']:not([style])");
		if (anchor && (matched = /ProfilePage\.aspx\?userid=\d+/.exec(anchor.getAttribute("href")))) {
			return parseInt(matched[0].slice(24));
		}
		return null;
	}
	return null;
}

function retrieveNavigation(url) {
	let matched;
	if (/(https?:\/\/)?(forum(d|\d+)?|md?)\.?hkgolden\.com/.test(url)) {
		let path = /\.com.+/.exec(url)[0].slice(4);
		if (/^\/thread\//.test(path)) {// New Thread
			let threadMatched = /^\/thread\/\d+/.exec(path);
			let pageMatched = /\/page\/\d+/.exec(path);
			return {
				thread: threadMatched[0].slice(8),
				page: pageMatched ? pageMatched[0].slice(6) : null
			};
		}
		if (/^\/view.aspx/.test(path)) {// Old Thread
			let threadMatched = /message=\d+/.exec(path);
			let pageMatched = /page=\d+/.exec(path);
			return {
				thread: threadMatched[0].slice(8),
				page: pageMatched ? pageMatched[0].slice(5) : null
			};
		}
		if (/^\/channel\//.test(path)) {// New Channel
			let channelMatched = /^\/channel\/\w+/.exec(path);
			let pageMatched = /\/page\/\d+/.exec(path);
			return {
				channel: channelMatched[0].slice(9),
				page: pageMatched ? pageMatched[0].slice(6) : null
			};
		}
		if (/^\/topics.aspx/.test(path)) {// Old Channel
			let channelMatched = /type=\w+/.exec(path);
			let pageMatched = /page=\d+/.exec(path);
			return {
				channel: channelMatched[0].slice(5),
				page: pageMatched ? pageMatched[0].slice(5) : null
			};
		}
	}
	return null;
}

function saveSession() {
	sessionStorage.setItem("ehkg-popup", !document.querySelector("#ehkg-popup").classList.contains("ehkg-invisible"));
	sessionStorage.setItem("ehkg-popup-tab", !document.querySelector("#ehkg-popup-main").classList.contains("ehkg-hidden") ? "main" : "options");
	log("Session is saved.");
}

async function waitForTag(name) {
	return new Promise((resolve) => {
		if (document[name]) {
			log("<" + name + "> is ready.");
			resolve();
		} else {
			log("<" + name + "> is not ready yet. (waiting)");
			let startTime = performance.now();
			let observer = new MutationObserver(() => {
				if (document[name]) {
					log("<" + name + "> is ready. (" + (performance.now() - startTime).toFixed(1) + " ms)");
					observer.disconnect();
					resolve();
				}
			});
			observer.observe(document.documentElement, {childList: true});
		}
	});
}

async function waitForContent() {
	return new Promise((resolve) => {
		if (document.readyState === "loading") {
			log("Content is not ready yet. (waiting)");
			let startTime = performance.now();
			document.addEventListener("DOMContentLoaded", () => {
				log("Content is ready. (" + (performance.now() - startTime).toFixed(1) + " ms)");
				resolve();
			}, {once: true});
		} else {
			log("Content is ready.");
			resolve();
		}
	});
}

async function preloadResources() {
	let startTime = performance.now();
	let fragment = document.createDocumentFragment();
	let promises = [];
	for (const key in RESOURCES) {
		if (Object.hasOwn(RESOURCES, key)) {
			let resource = RESOURCES[key];
			promises.push(new Promise((resolve) => {
				let startTime = performance.now();
				let link = document.createElement("link");
				link.className = "ehkg-preload";
				link.rel = "preload";
				link.href = resource.src;
				link.as = resource.as;
				link.addEventListener("load", (event) => {
					log("Resource is preloaded as " + resource.as + ". (" + (performance.now() - startTime).toFixed(1) + " ms)\n" + resource.src);
					resolve();
				}, {once: true});
				fragment.append(link);
			}));
		}
	}
	document.head.append(fragment);
	await Promise.all(promises);
	log("All resources are preloaded. (" + (performance.now() - startTime).toFixed(1) + " ms)");
}

function loadExternalScript(src, parent, method) {
	return new Promise((resolve) => {
		let startTime = performance.now();
		let script = document.createElement("script");
		script.className = "ehkg-external";
		script.async = true;
		script.src = src;
		script.addEventListener("load", (event) => {
			log("External script is loaded. (" + (performance.now() - startTime).toFixed(1) + " ms)\n" + src);
			resolve();
		}, {once: true});
		(parent || document.head)[method ? method : "append"](script);
	});
}

async function construct() {
	// Message
	PAGE_WINDOW.addEventListener("message", IS_GREASEMONKEY ? exportFunction(handleMessage, PAGE_WINDOW) : handleMessage);
	// Options
	await loadOptions();
	// Selectors
	if (IS_NEW_DESKTOP_FORUM || IS_NEW_MOBILE_FORUM) {
		SELECTORS.pageContainer = "div[id^='page-']";
		SELECTORS.floorContainer = "div[data-role='reply']";
		SELECTORS.floorContent = "div[data-role='reply'] > :nth-child(2) > span";
		SELECTORS.previewContent = null;
	}
	if (IS_OLD_DESKTOP_FORUM) {
		SELECTORS.pageContainer = null;
		SELECTORS.floorContainer = "table.repliers";
		SELECTORS.floorContent = "div.ContentGrid";
		SELECTORS.previewContent = "span#previewArea";
	}
	if (IS_OLD_MOBILE_FORUM) {
		SELECTORS.pageContainer = null;
		SELECTORS.floorContainer = "div.post";
		SELECTORS.floorContent = "div.post-content2";
		SELECTORS.previewContent = null;
	}
	SELECTORS.basic = "a, svg, textarea, button";
	SELECTORS.intersection = "img, video, iframe, " + SELECTORS.floorContent;
	SELECTORS.all = SELECTORS.basic + ", " + SELECTORS.intersection;
}

async function prepare() {
	// Preload
	preloadResources();
	// CSS
	injectCSS();
}

async function setup() {
	// Script
	if (IS_OLD_DESKTOP_FORUM || IS_OLD_MOBILE_FORUM) {
		loadExternalScript(RESOURCES["hkg_icon_js"].src);
	}
	// Bubble
	setupBubble();
}

async function process() {
	// Bubble
	if (IS_OLD_MOBILE_FORUM) {
		let footer = document.querySelector("#topic-footer, #post-footer");
		if (footer) {
			setTimeout(() => {
				footer.append(document.querySelector("#ehkg-bubble"));
			}, 200);// Delay to avoid being overrided
		}
	}
	// DOM
	let selector = SELECTORS.all;
	let elements = document.querySelectorAll(selector);
	for (const element of elements) {
		handleElement(element);
	}
	let bodyObserver = new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			for (const node of mutation.addedNodes) {
				if (node.nodeType !== 1) {
					continue;
				}
				if (!handleElement(node)) {
					let descendants = node.querySelectorAll(selector);
					for (const descendant of descendants) {
						handleElement(descendant);
					}
				}
			}
		}
	});
	bodyObserver.observe(document.body, {childList: true, subtree: true});
}

function enhanceRenderPipeline(element) {
	//
}

(async function() {
	'use strict';
	console.log("Enhanced HKG started. (readyState: '" + document.readyState + "')");
	let startTime = performance.now();
	// Construct
	await construct();
	// Prepare
	await waitForTag("head");
	await prepare();
	// Setup
	await waitForTag("body");
	await setup();
	// Process
	await waitForContent();
	await process();
	console.log("Enhanced HKG is ready. (" + (performance.now() - startTime).toFixed(1) + " ms)");
	// Log
	if (FORCE_LOG || OPTIONS["developer_mode"].value) {
		console.log("GM Info:", GM.info);
		console.log("Storage:", await getStorage());
		console.log("Options:", OPTIONS);
		console.log("Retrievable User ID:", retrieveUserId());
	}
})();