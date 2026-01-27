// ==UserScript==
// @name               圖集批量隊列下載器
// @name:en            Article Image Queue Downloader
// @name:zh-CN         图集队列批量下载器
// @name:zh-TW         圖集隊列批量下載器
// @version            2026.1.22
// @description        爬圖神器之一，寫真、本子、漫畫，都到我碗裡來! 200+個規則，支援400+個網站，支援推送給Aria2進行下載。
// @description:en     Support for over 400 sites! batch download of images from articles using a queue, Supports pushing to Aria2 for download.
// @description:zh-CN  爬图神器之一，写真、本子、漫画，都到我碗里来! 200+个规则，支援400+个网站，支援推送给Aria2进行下载。
// @description:zh-TW  爬圖神器之一，寫真、本子、漫畫，都到我碗裡來! 200+個規則，支援400+個網站，支援推送給Aria2進行下載。
// @author             德克斯DEX
// @match              *://*/*
// @connect            *
// @icon               data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAtFBMVEVEREAAAABEREBEREAuuaIzqpkvr58yiHgzhnY6kYM7mYI4kog4s6A2tpo0r544ooo2nY40sJw0sp00rZg1sJw0sZ0zsp01sZw0sZw0rZk1sJw1sZw1rZk0sp00rpk1sp01sZs1rpk1rpk0sp01spw1sJ00rZo1rZk1rpo0r5k0sJw0sZ01r5o0sZw0rpk0sp01sZ01sJw1spw1r5k1sp01sZw0sZ01sZw1rpk1sp01sZw1r5pUzpTcAAAAOXRSTlMAAAUGCw8QERIUFxgbHB0hIieqq6yvtLa3vb/AwMHCxMXFxsfIyc3Oz+zt7vDx8fL4+Pn5+vr7/v7AEFI4AAABR0lEQVR42qWT11bDMAxApbhsmm5KKVD2KiUQwpD1///FkZcSmh4e8FOsex3LsgymPy6ISkRyA4FlWMRXomIyQOg/SbyKAmSOE2Ip02UOYxf/DILNjOOEWLnAEAqio0MMAzJjTAZh1p0SrYCIuu0cMZc9JbENXLa1NWGdI1nWeQuXGPzBTdzC8ws52UI5MwchrA/VTOuTEP9fFyTG7E+R9q8JLsbW1UHzU8HHrCuU1fyToDlB43xRqMUgfc+/KA77fZrWSH/47zPlzOcpJxG8u32r/OEg5SRCqO/WTeT3+5oTuP4LxrXnd5F7waZ+wM5c+NVeujMRrDYMYueE+VK5E5r3uzOb7TbvHH7f/1pP/L8nU9u38Nwyy8OZdjfwY+ZnmPinp28y3mglNeERDJYy/9A3GYVS+GMPMB+uyL67/qO68Mb8MurBD7foVTtvIbtnAAAAAElFTkSuQmCC
// @license            MIT
// @namespace          https://greasyfork.org/users/20361
// @grant              unsafeWindow
// @grant              GM_xmlhttpRequest
// @grant              GM_registerMenuCommand
// @grant              GM_unregisterMenuCommand
// @grant              GM_getValue
// @grant              GM_setValue
// @grant              GM_deleteValue
// @grant              GM_listValues
// @grant              GM_addElement
// @grant              GM_getResourceText
// @grant              GM_openInTab
// @run-at             document-end
// @noframes
// @require            https://update.greasyfork.org/scripts/473358/1237031/JSZip.js
// @require            https://unpkg.com/idb@8.0.3/build/umd.js
// @resource           JSZip_code https://unpkg.com/jszip@3.10.1/dist/jszip.min.js
// @resource           CryptoJS_code https://unpkg.com/crypto-js@4.2.0/crypto-js.js
// @downloadURL https://update.greasyfork.org/scripts/555974/%E5%9C%96%E9%9B%86%E6%89%B9%E9%87%8F%E9%9A%8A%E5%88%97%E4%B8%8B%E8%BC%89%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/555974/%E5%9C%96%E9%9B%86%E6%89%B9%E9%87%8F%E9%9A%8A%E5%88%97%E4%B8%8B%E8%BC%89%E5%99%A8.meta.js
// ==/UserScript==

(async (idb) => {

	"use strict";

	// 只在桌面端執行
	if ("ontouchstart" in unsafeWindow) return;

	// 限制在最上層頁框執行
	if (window.self !== window.top) return;

	// 常數宣告
	const Mobile_UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 19_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/19.0.3 Mobile/15E148 Safari/604.1";
	const fragment = new DocumentFragment();
	const JSZip_code = GM_getResourceText("JSZip_code");
	const CryptoJS_code = GM_getResourceText("CryptoJS_code");

	// 變數宣告
	let currentURL = location.href.replace(location.hash, "");
	let isObserveURL = false;
	let isShowConfig = false;
	let comicName = "";
	let siteData = {};
	let _this = {};
	let tempData = {};
	let isDownloading = false;
	let isStopDownload = false;
	let isGeting = false;
	let isOpenUI = false;
	let isEnabledCookie = false;
	let isDownloadVideos = false;
	let idNum = 0;

	// 個別網站的預設設定
	const defaultConfig = {
		articleThread: 1, // 章節最大要求線程數
		imageThread: 2, // 每章圖片最大下載線程數
		retry: 3, // 圖片下載錯誤重試次數
		interval: 3, // 圖片下載錯誤重試間隔秒數
		singleThreadInterval: 0, // 1篇1圖時的要求間隔秒數
		downloadVideo: false // 是否下載影片
	};
	let siteConfig = defaultConfig;

	// 取得腳本設定
	const getConfig = (key = "articleImageDownloadAppConfig") => {
		if (key in localStorage) {
			siteConfig = JSON.parse(localStorage.getItem(key));
		}

		// 全局的預設設定
		const globalConfig = {
			language: GM_getValue("language", "ui"), // 語言
			theme: GM_getValue("theme", "light"), // 主題
			autoOpenPanel: GM_getValue("autoOpenPanel", 0), // 自動打開面板
			min: GM_getValue("min", 0), // 打開面板時為最小化
			editTitle: GM_getValue("editTitle", 0), // 列表標題是否可編輯
			downloadAPI: GM_getValue("downloadAPI", "default"), // 圖片下載方法
			downloadDB: GM_getValue("downloadDB", 1), // 儲存打包下載過的文章連結
			compressedExtension: GM_getValue("compressedExtension", "zip"), // 壓縮檔副檔名
			zipFolder: GM_getValue("zipFolder", 1), // 壓縮檔裡創建資料夾
			zipJson: GM_getValue("zipJson", 0), // 打包時包含json
			onlyJson: GM_getValue("onlyJson", 0), // 不下載圖片只匯出json
			onlyText: GM_getValue("onlyText", 0), // 不下載圖片只匯出txt
			webpToJpg: GM_getValue("webpToJpg", 0), // WEBP轉換為JPG
			avifToJpg: GM_getValue("avifToJpg", 0), // AVIF轉換為JPG
			jpgQuality: GM_getValue("jpgQuality", 95), // JPG格式轉換品質
			nhentaiServ: GM_getValue("nhentaiServ", "auto"), // nhentai圖片伺服器
			hitomiImgType: GM_getValue("hitomiImgType", "avif"), // Hitomi.la 圖片格式
			manhuaguiImgServ: GM_getValue("manhuaguiImgServ", "i"), // ManHuaGui漫畫櫃圖片伺服器
			rpc: GM_getValue("rpc", ""),
			dir: GM_getValue("dir", ""),
			token: GM_getValue("token", "")
		}

		return {
			...defaultConfig,
			...siteConfig,
			...globalConfig
		}
	};

	const config = getConfig();

	const wpMangaParams = {
		homePage: (o) => o.url.h.map(h => `https://${h}/`),
		sort: "comic",
		comicName: [
			".title-manga",
			"#manga-title>h1",
			"h1.main-info-title",
			"main h1[itemprop=name]",
			".post-title>h1",
			"h1.post-title.font-title",
			".info>.head h1.title",
			".infox>.entry-title",
			".main-info .entry-title",
			".seriestuhead>.entry-title",
			".seriestuheader>.entry-title",
			"#title-detail-manga",
			"#item-detail>.title-detail",
			".anime__details__title>h3",
			".animeinfo h1"
		],
		cover: [
			".cover-detail>img",
			".summary_image img",
			".main-info .thumb>img",
			".main-info-left>.img-cover",
			".thumbook>.thumb>img",
			".thumb-block>figure>img",
			"main img[itemprop=image].object-cover",
			".seriestucont .thumb>img",
			".seriestucontent .thumb>img",
			"#item-detail img",
			".detail-info img[alt]",
			".anime__details__pic",
			".animeinfo .imgdesc>img"
		],
		waitEle: [
			".listing-chapters_wrap .li__text>a",
			".listing-chapters_wrap .wp-manga-chapter>a:has(+.chapter-release-date)",
			".listing-chapters_wrap .wp-manga-chapter>.mini-letters>a:has(h4)",
			"#chapterlist a",
			"#chapter-list a",
			".chapter-list a",
			".box-list-chapter a",
			".row-content-chapter a.chapter-name",
			"#list_chapter_id_detail a",
			".list-chapter .chapter>a"
		],
		click: "span.chapter-readmore",
		getLists: () => cl(_this.waitEle, {
			textNode: ".chapternum,.chapter-name",
			sort: "r"
		}),
		getSrcs: {
			target: [
				"#wp-manga-current-chap+div>p>img",
				".wp-manga-chapter-img",
				"#readerarea>img",
				"#readerarea p>img:not([alt='1 2'],[alt='2 2'])",
				"#readerarea img[alt$=jpg]",
				"#readerarea.rdminimal>img",
				"#readerarea .gallery-item img[data-src]",
				".read-content>img[data-src]",
				".read-content>div.page-break>img[data-src]",
				".reading-content>p>img[alt][data-src]",
				".reading-content .blocks-gallery-item img[data-full-url]",
				".reading-detail>.page-chapter>img:not([style])",
				".read-img>img",
				".chapter-img",
				".chapter-image-anchor+img"
			],
			attr: ["data-src", "data-full-url"],
			cdn: 0
		},
		wp: 1
	};

	const ts_reader = {
		getSrcs: (url) => fn.iframe(url, {
			wait: (_, frame) => isFn(frame?.ts_reader_control?.getImages) || isArray(frame?.read_image_list),
		}).then(({
			frame
		}) => {
			if (isFn(frame?.ts_reader_control?.getImages)) {
				return frame.ts_reader_control.getImages();
			}
			if (isArray(frame?.read_image_list)) {
				return frame.read_image_list;
			}
			return [];
		})
	};

	// 網站規則開始
	const ruleData = [{
		siteName: ["小黄书 xChina", "8色人体摄影"],
		homePage: ["https://xchina.fit/", "https://8se.me/"],
		sort: "album",
		info: "只能1線程並且至少間隔1秒，不然會封IP",
		url: {
			h: /xchina|8se\.me/,
			e: ".item.photo,.item.amateur"
		},
		getLists: () => q([".item.photo,.item.amateur"]).map(item => {
			let children = [...q(".text", item).children];
			if (children.length == 3) {
				children = children.slice(0, -1);
			}
			let text = children.map(e => e.innerText).join(" - ");
			text = fn.rs(text, [
				[/\n/g, " - "],
				["Vol. ", "NO."]
			]);
			if (q(".fa-user-circle", item)) {
				text = text.split(" - ").slice(0, -1).join(" - ");
			}
			return {
				cover: q(".img", item).getAttribute("style")?.split("'")?.at(1),
				text,
				url: q("a", item).href
			}
		}),
		getSrcs: (url, item) => ajax.doc(url, {
			referrer: url
		}).then(async dom => {
			let code = findScript(["domain", "videos"], dom);
			if (code) {
				let domain = strVar(code, "domain");
				let videos = strToArray(code, "videos");
				item.dataset.videos = videos.map(e => domain + e.url).join(",");
			}
			const [, album_id] = /id-([^.]+)/.exec(url);
			let [numP] = q(".photo-detail .item:has(>.icon>.fa-image)", dom).innerText.match(/\d+/);
			numP = Number(numP);
			// debug("numP", numP);
			const divimg = q(".photo-items div.img,.amateur-items div.img", dom);
			const thumbSrc = divimg?.getAttribute("style")?.split("'")?.at(1);
			const srcArrFn = (total, photoUrl = "https://img.xchina.io/photos/", mode = 1) => {
				let suffix = ".jpg";
				if (url.includes("/amateur/")) {
					suffix = ".webp";
				} else if (mode === 2) {
					suffix = "_600x0.webp";
				}
				return fn.arr(total, (v, i) => photoUrl + album_id + "/" + String(i + 1).padStart(4, "0") + suffix);
			};
			if (thumbSrc) {
				const OOOI = thumbSrc.endsWith("/0001_600x0.webp") || thumbSrc.endsWith("/0001.webp");
				const [photoUrl] = /^https?:\/\/[^/]+\/[^/]+\//.exec(thumbSrc);
				if (OOOI) {
					// debug("A");
					// 符合條件直接生成所有圖片網址
					return srcArrFn(numP, photoUrl);
				} else {
					// debug("B");
					// 不符合條件用翻頁模式間隔1.5秒
					let max;
					let eles = q([".photo-items div.img"], dom);
					// debug("eles", eles);
					try {
						let pageUrls = q([".pager a[href]"], dom).map(a => a.href);
						// debug("pageUrls", pageUrls);
						let lastUrl = pageUrls.at(-1);
						let [, lastNum] = lastUrl.match(/\/(\d+)\.html$/);
						max = Number(lastNum);
					} catch {
						max = 1;
					}
					// debug("max", max);
					if (max > 1) {
						updateS(item, `${DL.status.s0}：${DL.status.get.s2}`);
						updateP(item, `${DL.progress}：Page1`);
						let fetchNum = 1;
						let nextPage;
						await delay(1500);
						while (nextPage = q(".pager a.current+a:not(.pager-next)", dom)?.href || false) {
							// debug("nextPage", nextPage);
							fetchNum++;
							updateP(item, `${DL.progress}：Page${fetchNum}`);
							dom = await ajax.doc(nextPage, {
								referrer: url
							});
							eles = [...eles, ...q([".photo-items div.img"], dom)];
							await delay(1500);
						}
					}
					// debug("eles", eles);
					let srcs = eles.map(e => e.getAttribute("style").split("'").at(1));
					// debug("srcs", srcs);
					if (url.includes("amateur")) {
						return srcs;
					}
					return srcs.map(e => e.replace("_600x0", "").replace(".webp", ".jpg"));
				}
			} else {
				// debug("C");
				// 沒有頁面元素可以判斷，直接根據ID生成圖片網址，並嘗試讀取首張圖片，讀取成功才返回。
				await delay(1000);
				const srcArr = srcArrFn(numP);
				const [first] = srcArr;
				const check1 = await fn.checkImgStatus(first);
				if (check1.ok) {
					return srcArr;
				} else {
					await delay(1000);
					const testSrc = first.replace("/photos/", "/photos2/");
					const check2 = await fn.checkImgStatus(testSrc);
					if (check2.ok) {
						return srcArr.map(src => src.replace("/photos/", "/photos2/"));
					}
					return [];
				}
			}
		}),
		dv: true
	}, {
		siteName: (o) => o.url.t,
		homePage: ["https://taoo.xyz/", "https://www.hentaiclub.net/"],
		sort: "album",
		info: "绅士会所有水印",
		url: {
			t: ["雪月映画", "绅士会所"],
			e: ".item-img+.item-title"
		},
		getLists: () => q([_this.url.e]).map(t => ({
			cover: q("img", c(".item", t)).dataset?.original || q("img", c(".item", t)).src,
			text: q("img", c(".item", t)).alt,
			url: q("a", t).href
		})),
		getSrcs: {
			target: ".post-item-img",
			attr: "data-original"
		}
	}, {
		siteName: "痞客邦相簿",
		homePage: "https://nagoat.pixnet.net/albums",
		sort: "album",
		url: {
			h: ".pixnet.net",
			u: [/\/albums$/, /\/albums\?page=\d+$/]
		},
		getLists: () => q([".grid:has([data-slot='card-content'])>a"]).map(a => ({
			cover: q("img", a).src,
			text: q("[data-slot='card-title']", a).innerText,
			url: a.href
		})),
		getImageData: (code) => [...code.matchAll(/"item":({[^}]+})/g)].map(([m, o]) => JSON.parse(o).url),
		getSrcs: {
			cb: (dom, url, item) => {
				let code = __next_f(dom);
				let meta = JSON.parse(code.match(/"meta":({[^}]+})/).at(1));
				let max = meta.pageCount;
				if (max > 1) {
					updateS(item, `${DL.status.s0}：${DL.status.get.s1}`);
					updateP(item, `${DL.progress}：1/${max}`);
					let fetchNum = 0;
					let codes = [code];
					let links = fn.arr(max - 1, (v, i) => `${url}?page=${i + 2}`);
					let resArr = links.map(url => ajax.doc(url).then(__next_f).finally(() => {
						fetchNum++;
						updateP(item, `${DL.progress}：${fetchNum}/${max}`);
					}));
					return Promise.all(resArr).then(arr => {
						codes = [code, ...arr];
						return codes.map(_this.getImageData);
					});
				}
				return _this.getImageData(code);
			}
		}
	}, {
		siteName: "爱妹子",
		homePage: "https://xx.knit.bid/sort/new/",
		sort: "album",
		info: "影片要用貓抓下載",
		url: {
			h: "xx.knit.bid",
			e: ".excerpt a[title]:has(.imgbox-img)",
			eu: "/article/"
		},
		getLists: "A",
		getSrcs: {
			target: ".item-image img",
			attr: "data-src",
			links: (dom, url) => {
				let max = Number(q(".current-info", dom)?.innerText?.match(/\d+/g)?.at(1));
				return max > 1 ? fn.arr(max - 1, (v, i) => `${url}page/${i + 2}/`) : [];
			}
		}
	}, {
		siteName: ["爱死美女图片站", "套图最近更新图片", "高清美女图片", "日本美女套图", "丝袜美腿写真", "美女图片排行", "模特图片大全"],
		homePage: (o) => ["/", ...o.url.p.slice(0, -1)].map(p => "https://" + o.url.h + p.replace(/\/$/, "")),
		sort: "album",
		url: {
			h: "www.24tupian.org",
			p: ["/daymeinv", "/meinv", "/nvyou", "/tuimo", "/gaoqing", "/model/", "/Serch"]
		},
		getLists: () => {
			if (lp("/Serch")) {
				return al(".gtps a:has(img)");
			}
			if (lp("/daymeinv")) {
				return q([".zjgx a[title]"]).map(a => ({
					text: a.text,
					url: a.href
				}));
			}
			if (["/meinv", "/nvyou", "/tuimo"].some(p => lp(p))) {
				return al(".lbleft>.lbl>.ll>a");
			}
			return q([".paihan li"]).map(li => ({
				cover: q("img", li).dataset?.original || q("img", li).src,
				text: q("img", li).alt,
				url: q("a~a", li).href
			}));
		},
		getbig: (url) => {
			if (url == "") return "";
			let i = url.lastIndexOf("/");
			let murl = url.substring(i + 1);
			url = url.replace(murl, murl.substring(1));
			return url;
		},
		getSrcs: {
			cb: (dom) => {
				let pid = q("#pid", dom).innerText;
				let num = Number(q(".mores>a", dom).innerText.match(/\d+/)[0]);
				let max = Math.ceil(num / 21);
				let links = fn.arr(max, (v, i) => `/ajaxs.aspx?fun=getmore&id=${pid}&p=${i * 21}`);
				let resArr = links.map(ajax.text);
				return Promise.all(resArr).then(data => {
					let html = data.join("");
					let datas = q(["img[data]"], fn.doc(html)).map(e => e.getAttribute("data"));
					return datas.map(data => "https://big.diercun.com" + _this.getbig(data));
				});
			}
		}
	}, {
		siteName: "cookie微圖坊",
		homePage: "https://www.v2ph.com/",
		sort: "album",
		info: "需註冊登入，下載需填入cookie，詳見特殊說明",
		url: {
			h: ["www.v2ph.com", "www.v2ph.net", "www.v2ph.ru", "www.v2ph.ovh"],
			e: ".albums-list .card a.media-cover:has(img[alt][data-src])",
			cookie: "frontend-authed"
		},
		getLists: "A",
		getSrcs: {
			target: "img.album-photo[data-src]",
			attr: "data-src",
			next: ".pagination>.active+li>a"
		}
	}, {
		siteName: "魅力图",
		homePage: "https://beautypics.org/",
		sort: "album",
		url: {
			h: ["beautypics.org"],
			e: ".elementor-posts a:has(img),.page-content .post"
		},
		getLists: () => {
			if (lp("/instagram")) {
				return q([".page-content .post"]).map(p => ({
					cover: q(".wp-post-image", p).src,
					text: q(".entry-title", p).innerText,
					url: q("a", p).href,
				}));
			}
			return al(".elementor-posts a:has(img),.page-content .post a:has(img[post-id])");
		},
		getSrcs: ".elementor-widget-theme-post-content img:not(.emoji)"
	}, {
		siteName: "美图乐",
		homePage: "https://www.meitu001.cc/",
		sort: "album",
		url: {
			t: "美图乐",
			e: ".list.container .list-item.card .list-img",
			ee: ".album-top.card"
		},
		getLists: "A",
		getSrcs: {
			target: ".content img",
			next: ".page-item:nth-last-child(2)>a:text:下一页"
		}
	}, {
		siteName: "秀色女神",
		homePage: "https://www.xsnvshen.co/album/new/",
		sort: "album",
		url: {
			t: "秀色女神",
			p: ["/album/", /^\/girl\/\d+$/, "/search", "/news/"],
			ee: ".workContentWrapper,#arcbox"
		},
		getLists: () => {
			if (lp("/girl/")) {
				return al(".star-mod-bd a");
			}
			if (lp("/search") || lp("/news/")) {
				return q(["#newspiclist li"]).map(l => ({
					cover: q("img", l).dataset?.original || q("img", l).src,
					text: q(".titlebox", l).innerText,
					url: q("a", l).href
				})).filter(({
					url
				}) => !url.includes("/girl/"));
			}
			return al("#load-img a:has(img)");
		},
		getSrcs: {
			target: "img[id^='imglist'][data-original],#arcbox img",
			attr: "data-original",
			rs: ["thumb_600x900/", ""]
		},
		referer: "url"
	}, {
		siteName: "萌图社",
		homePage: "https://www.446m.com/",
		sort: "album",
		url: {
			t: "萌图社",
			e: "div.item"
		},
		getLists: () => al("div.item", ".item-link-text"),
		getSrcs: {
			target: "span.post-item",
			attr: "data-src"
		}
	}, {
		siteName: "丝袜客",
		homePage: "https://siwake.cc/",
		sort: "album",
		url: {
			t: "丝袜客",
			e: "#main.gallery a:has(+h2)"
		},
		getLists: "A",
		getSrcs: ".Content>a"
	}, {
		siteName: ["美图131", "美女壁纸"],
		homePage: (o) => ["meinv", "shouji/meinv"].map(p => `https://${o.url.h}/${p}/`),
		sort: "album",
		url: {
			h: "www.meitu131.com",
			p: ["/meinv/", "/shouji/", "/search/"],
			e: ".cover-list .cover-info a:has(img[alt])",
			ee: ".contitle-info"
		},
		getLists: "A",
		getSrcs: {
			target: ".work-content img",
			next: "#pages>a:nth-last-of-type(2):text:下一页"
		}
	}, {
		siteName: "米兔妹妹",
		homePage: "https://loxiu.com/",
		sort: "album",
		url: {
			h: ["loxiu.com"],
			e: ".main .img-modbox>a[title]:has(img[alt])",
			eu: "/post/"
		},
		getLists: "A",
		getSrcs: {
			target: ".info-imtg-box>img[alt]",
			pages: ".pagebar>a"
		}
	}, {
		siteName: (o) => o.url.t,
		homePage: ["https://928r.com/", "https://060k.com/"],
		sort: "album",
		url: {
			t: ["美图社", "花瓣美女"],
			e: "#post_list_box .list-img>a:has(img[alt])"
		},
		getLists: "A",
		getSrcs: {
			api: (url) => url + "?page=all",
			target: "#lightgallery img"
		}
	}, {
		siteName: "闺秀网",
		homePage: "https://guixiu.org/",
		sort: "album",
		url: {
			t: "闺秀网",
			e: "#post_list_box .list-img>a:has(img[alt])"
		},
		getLists: "A",
		getSrcs: {
			target: "#lightgallery img",
			pages: "#ipage a[href*=ipage]"
		}
	}, {
		siteName: (o) => o.url.t,
		homePage: ["tuzac", "kkc3", "youfreex"].map(h => `https://www.${h}.com/`),
		sort: "album",
		info: "有水印",
		url: {
			t: ["图宅网", "咔咔西三", "YouFreeX"],
			e: "#content>article>.task>a:has(img)"
		},
		getLists: () => al(null, ".thumbnail-container"),
		getSrcs: {
			cb: (dom, url, item) => {
				let total = Number(q("#auto-play", dom).getAttribute("total"));
				let id = Number(q("#auto-play", dom).getAttribute("data").match(/\d+/));
				updateS(item, `${DL.status.s0}：${DL.status.get.s1}`);
				updateP(item, `${DL.progress}：0/${total}`);
				let fetchNum = 0;
				let resArr = fn.arr(total, (v, i) => ajax.json(`/api/?ac=get_album_images&id=${id}&num=${i + 1}`).then(json => {
					fetchNum++;
					updateP(item, `${DL.progress}：${fetchNum}/${total}`);
					return json.src;
				}));
				return Promise.all(resArr);
			}
		}
	}, {
		siteName: (o) => o.url.t.slice(0, -1),
		homePage: ["https://tukuku.cc/", "https://taotu8.biz/", "https://8881134.xyz/", "https://cosck.cc/"],
		sort: "album",
		url: {
			t: ["图库库", "套图吧", "9b图库", "COS在线套图写真", " - cosck"],
			e: ".gridbit-grid-post a:has(img),.gridsoul-grid-post a:has(img),.mintwp-grid-post a:has(img):not([title*='Permanent Link to Hello world!']),.pb-article a:has(img)",
			ee: "article.post:not(.pb-article)"
		},
		getLists: "A",
		getSrcs: {
			target: ".entry-content img[decoding]",
			attr: "data-src",
			cdn: 0
		}
	}, {
		siteName: "美图316",
		homePage: "https://mt316.com/",
		sort: "album",
		url: {
			t: ["妹子图", "美图316"],
			e: ".m-list-main .u-img>a:has(img[alt][data-original])"
		},
		getLists: "A",
		getSrcs: ".m-list-content img"
	}, {
		siteName: ["找套图", "看套图", "套图"],
		homePage: ["https://www.zhaotaotu.cc/", "https://kantaotu.cc/", "https://taotu.uk/"],
		sort: "album",
		url: {
			t: "Xiuno BBS",
			e: ".card-body>.threadlist .spic>a:has(img)"
		},
		getLists: () => q([_this.url.e]).map(a => ({
			cover: q("img", a).src,
			text: q(".media-body a", c("li", a)).innerText,
			url: a.href
		})),
		getSrcs: ".message>img:not(:first-of-type)"
	}, {
		siteName: (o) => o.url.t,
		homePage: ["zanmm", "rmm8", "xiuwo", "jnmmw", "930tu", "hutu6", "mhgirl", "entuji", "jnmmw", "m5mm", "umeitu"].map((h, i) => `https://www.${h}.${i == 2 ? "net" : "com"}/`),
		sort: "album",
		url: {
			t: ["赞MM网", "RMM吧", "秀窝", "JN美眉网", "930圖片網", "狐图网", "美Girl图集", "恩图集", "JN美眉网", "M5MM", "尤美图库"],
			e: ".main>.boxs>.img a:has(img[alt][data-original]),.li>.img>a:has(img[alt][data-original])",
			eu: ["/photo/", "/img/"]
		},
		getLists: "A",
		getSrcs: {
			target: "#showimg img,.vipimglist img",
			links: (dom, url) => {
				url = url.replace(".html", "");
				let max = Number(q(".c_l>p:nth-of-type(3),.stitle>h1>span", dom)?.innerText?.match(/\d+/));
				return max > 1 ? fn.arr(max - 1, (v, i) => `${url}_${i + 2}.html`) : [];
			}
		}
	}, {
		siteName: ["极品性感美女", "秀人美女网", "秀人集", "美人图"],
		homePage: ["http://a1.876519.xyz/new.html", "https://www.xiu09.top/", "http://q12.xx01.my/top.html", "https://meirentu.cc/"],
		sort: "album",
		url: {
			e: [
				"footer.footer:text:极品性感美女,footer:has(p+p):text:秀人美女网,footer:has(p+p):text:秀人集,footer:has(p+p):text:美人图",
				".related_posts .related_box,.update_area_lists,.list .list,.list~div>.list"
			],
			ee: ".relates,.article-title,.item_title,.news.box"
		},
		getLists: () => {
			if (lp(/search/)) {
				return q([".list .list>.node>p>a,.list~div>.list>.node .title>h2>a"]).map(a => ({
					text: fn.rs(a.innerText, /更新时间：.+/, "").trim(),
					url: a.href
				}));
			}
			return q([".related_posts .related_box a,.update_area_lists a"]).map(a => ({
				cover: q("img", a).dataset?.src || q("img", a).src,
				text: a.title || q(".meta-title", c("li", a)).innerText,
				url: a.href
			}));
		},
		getSrcs: {
			target: ".article-content img[alt],.content p img[alt],.content>p img[alt],.content_left img[alt]",
			pages: ".pagination a[href]:not(.current),.page>a[href]:not(.current)"
		}
	}, {
		siteName: ["新闻吧", "新闻屋", "新娱乐在线", "福建热线", "山东热线", "广西热线", "武汉热线", "天津热线", "云南热线", "甘肃热线", "新闻宝", "四海资讯", "娱乐屋", "娱乐吧"],
		homePage: () => {
			const url = (a, n) => a.map(h => `https://meinv.${h}/web/list/${n}.html`);
			let a = url(["xwbar.com", "xwwu.net", "dv67.com", "fjrx.org", "sdrx.org", "gxrx.org", "whrx.org", "tjrx.org", "ynrx.org", "gsrx.org"], "6400-1");
			let b = url(["xwbzx.com", "shzx.org"], "169-0");
			let c = url(["entwu.com", "yuleba.org"], "96-0");
			return [...a, ...b, ...c];
		},
		sort: "album",
		url: {
			e: [".header>.navMenu,.header>.nav", ".list_imgs a:has(img[alt])", ".copyright"],
		},
		getLists: () => al(_this.url.e.at(1)),
		getSrcs: {
			target: ".main img",
			links: (dom, url) => {
				url = url.slice(0, -6);
				let a = q(".paging>a:not([href])", dom);
				let max = Number((a || q(".page-link", dom))?.innerText?.match(/\d+/));
				return max > 1 ? fn.arr(max - 1, (v, i) => `${url}${i + (a ? 1 : 2)}.html`) : [];
			}
		}
	}, {
		siteName: () => ruleData.find(o => ("hosts" in o)).siteName,
		homePage: () => ruleData.find(o => ("hosts" in o)).hosts.map(h => `https://www.${h}/`),
		sort: "album",
		url: {
			e: ["#index_ajax_list a.thumb-srcbox:has(img.waitpic[alt]):has(.postlist-imagenum)", "#body-header-top", "#footer-boot:text:社"],
			eu: ["/comic", "/novel"]
		},
		getLists: () => al(_this.url.e.at(0)),
		getSrcs: {
			cb: (dom, url) => {
				let code = findScript("chenxing", dom);
				let c = strToObject(code, "chenxing");
				return ajax.doc("/ajax/", {
					headers: {
						"content-type": "application/x-www-form-urlencoded; charset=UTF-8",
						"x-requested-with": "XMLHttpRequest"
					},
					body: `type=all&id=${c.PID}`,
					method: "POST",
					referrer: url
				}).then(d => [...d.images]);
			}
		}
	}, {
		siteName: "悄悄的看2019",
		homePage: "https://qqdk2019.net/",
		sort: "album",
		url: {
			h: ["qqdk2019.net"],
			e: ".blog-masonry>.blog-listing a:has(img[alt])"
		},
		getLists: "A",
		getSrcs: ".blog-details-text>p>img"
	}, {
		siteName: "美图鉴赏",
		homePage: "https://www.lspimg.com/page/1/",
		sort: "album",
		url: {
			h: "www.lspimg.com",
			e: "#masonry .item"
		},
		getLists: "A",
		getSrcs: {
			target: "div[data-src]",
			attr: "data-src"
		}
	}, {
		siteName: "牛C网",
		homePage: "https://rulel.com/sexygirl",
		sort: "album",
		url: {
			t: "NIUC.NET",
			e: [".archive-title:text:美女写真,.archive-title:text:美女寫真,.archive-title:text:Beauty photo,.archive-title:text:Cosplay,.archive-title:text:角色扮演,.archive-title:text:女。相片,.archive-title:text:JAV.PHOTO", ".post-list .post-item"]
		},
		getLists: () => al(_this.url.e.at(1), ".post-title"),
		getSrcs: {
			cb: (dom) => q([".content-warp img"], dom).filter(e => !c("a[href*=android],a[href*=mypikpak],a[href$='app.html'],a[href*='/t.me/']", e)).map(e => e.src).filter(src => !src.includes("/svg"))
		}
	}, {
		siteName: "8E资源站",
		homePage: "https://8ezy.com/",
		sort: "album",
		url: {
			e: [".logo>a[title='8EZY']", ".post.grid a:has(img)"],
			ee: ".article-title"
		},
		getLists: () => al(_this.url.e.at(1)),
		getSrcs: {
			target: ".article-content p>img",
			video: "video>source"
		},
		dv: true
	}, {
		siteName: "91绅士",
		homePage: "https://91shenshi.com/",
		sort: "album",
		url: {
			h: ["91shenshi.com"],
			e: ".grow .grid a:has(img[alt]):has(h2):not(:has(svg))",
			eu: "/posts/"
		},
		getLists: "A",
		getSrcs: ".prose>div:not([class]) img"
	}, {
		siteName: [
			"爱妹子图",
			"爱看写真图",
			"爱看尤物图",
			"爱秀套图",
			"大胆套图",
			"福利美图",
			"福利私房图",
			"肥臀美女",
			"国产美女",
			"国产写真图",
			"高清私房图",
			"高清图库",
			"高清网红图",
			"高清写真图",
			"合集套图",
			"花样套图",
			"精彩美女",
			"经典写真图",
			"精彩网红图",
			"经典套图",
			"经典网红图",
			"精彩图库",
			"娇娇美女",
			"极品私房图",
			"娇娇套图",
			"极品美女图",
			"极品女神图",
			"极品妹子网",
			"精品写真图",
			"巨乳妹子图",
			"免费妹子图",
			"免费私房图",
			"免费写真图",
			"木瓜美女",
			"美色美女",
			"美色套图",
			"模特福利图",
			"模特高清图",
			"模特美女图",
			"模特美女网",
			"模特妹子图",
			"模特摄影图",
			"模特套图",
			"模特图库",
			"模特写真图",
			"妹子美图",
			"女神美图",
			"女神写真",
			"女神写真图",
			"女神写真网",
			"漂亮美图",
			"翘臀妹子图",
			"私房模特网",
			"私房妹子图",
			"私房嫩模图",
			"私房少女图",
			"私房图库",
			"私房网红图",
			"私房写真图",
			"少女套图",
			"私拍套图",
			"私拍写真图",
			"私拍尤物",
			"丝袜妹子图",
			"摄影妹子图",
			"摄影图库",
			"桃花妹子图",
			"偷拍套图",
			"特色美女图",
			"特色套图",
			"特色写真图",
			"网红套图",
			"我看妹子图",
			"我看人体艺术",
			"无圣光妹子图",
			"无圣光图",
			"性感尤物",
			"性感尤物图",
			"喜欢套图",
			"喜欢图库",
			"小姐姐妹子图",
			"小姐姐套图",
			"秀人美女",
			"欣赏美女",
			"欣赏图库",
			"写真美女",
			"写真美女图",
			"写真图库",
			"原创美女图片网",
			"原创美图",
			"原创图库",
			"诱惑美女图",
			"诱惑美女网",
			"诱惑套图",
			"诱惑图库",
			"诱惑写真图",
			"尤物美图",
			"尤物妹妹图",
			"尤物模特网",
			"尤物嫩模图",
			"尤物私房图",
			"尤物图库",
			"亚洲套图",
			"主播妹子图",
			"主播套图",
			"制服套图",
			"自拍妹子图",
			"专题美女",
			"专题套图",
			"美女私房照",
			"看妹图"
		],
		homePage: () => [
			"aimzt",
			"akxzt",
			"akywt",
			"axtaotu",
			"ddtaotu",
			"flmeitu",
			"flsft",
			"ftmeinv",
			"gcmeinv",
			"gcxzt",
			"gqsft",
			"gqtuku",
			"gqwht",
			"gqxzt",
			"hjtaotu",
			"hytaotu",
			"jcmeinv",
			"jdxzt",
			"jcwht",
			"jdtaotu",
			"jdwht",
			"jctuk",
			"jjmeinv",
			"jpsft",
			"jjtaotu",
			"jpmnt",
			"jpnst",
			"jpmzw",
			"jpxzt",
			"jrmzt",
			"mfmzt",
			"mfsft",
			"mfxzt",
			"mgmeinv",
			"msmeinv",
			"mstaotu",
			"mtflt",
			"mtgqt",
			"mtmnt",
			"mtmnw",
			"mtmzt",
			"mtsyt",
			"mttaotu",
			"mttuku",
			"mtxzt",
			"mzmeitu",
			"nsmeitu",
			"nsxiez",
			"nsxzt",
			"nsxzw",
			"plmeitu",
			"qtmzt",
			"sfmtw",
			"sfmzt",
			"sfnmt",
			"sfsnt",
			"sftuku",
			"sfwht",
			"sfxzt",
			"sntaotu",
			"sptaotu",
			"spxzt",
			"spyouwu",
			"swmzt",
			"symzt",
			"sytuk",
			"thmzt",
			"tptaotu",
			"tsmnt",
			"tstaotu",
			"tsxzt",
			"whtaotu",
			"wkmzt",
			"wkrenti",
			"wsgmzt",
			"wsgtu",
			"xgyouwu",
			"xgywt",
			"xhtaotu",
			"xhtuku",
			"xjjmzt",
			"xjjtaotu",
			"xrmeinv",
			"xsmeinv",
			"xstuk",
			"xzmeinv",
			"xzmnt",
			"xztuk",
			"ycmeinv",
			"ycmeitu",
			"yctuk",
			"yhmnt",
			"yhmnw",
			"yhtaotu",
			"yhtuku",
			"yhxzt",
			"ywmeitu",
			"ywmmt",
			"ywmtw",
			"ywnmt",
			"ywsft",
			"ywtuk",
			"yztaotu",
			"zbmzt",
			"zbtaotu",
			"zftaotu",
			"zpmzt",
			"ztmeinv",
			"zttaotu",
			"sfjpg",
			"kmeitu"
		].map((h, i) => `http://www.${h}.${i == 110 ? "cc" : "com"}/`),
		sort: "album",
		info: "不同網域的圖集類型不同，要求分頁太頻繁會403錯誤。",
		url: {
			e: ["body>div.nav", "body>div.img a[title]:has(img):has(+.title),body>div#list a[title]:has(img):has(+.title)", "body>.b"]
		},
		getLists: () => al(_this.url.e.at(1)),
		getSrcs: {
			target: "#picg img",
			links: (dom, url) => {
				url = url.replace(".html", "");
				let max = 1;
				let p = q(".pagelist a[title=Page]", dom);
				if (p) {
					max = Number(p.innerText.match(/\d+/g).at(-1));
				} else {
					let pages = q([".pagelist a"], dom);
					if (pages.length) {
						max = um(pages);
					}
				}
				return max > 1 ? fn.arr(max - 1, (v, i) => `${url}_${i + 2}.html`) : [];
			},
			delay: 1000
		}
	}, {
		siteName: ["Kemono", "Coomer", "nagisa魔物喵", "のり子のサーバー", "HongkongDoll", "Arty亞緹"],
		homePage: ["https://kemono.cr/", "https://coomer.st/", "https://kemono.cr/fantia/user/17148", "https://kemono.cr/discord/server/1328077361069162607", "https://coomer.st/onlyfans/user/hongkongdoll", "https://coomer.st/onlyfans/user/arty42575619"],
		sort: "album",
		url: {
			h: ["kemono.cr", "coomer.st"],
		},
		spa: true,
		page: () => lp("/user/") && lp(4) || lp("/discord/server/") && lp(5),
		observeURL: "head",
		getHeaders: () => ({
			headers: {
				accept: "text/css"
			}
		}),
		api: (url) => ajax.json(url, _this.getHeaders()),
		getLists: async () => {
			if (lp("/discord/server/") && lp(5)) {
				return ajax.json(`/api/v1/discord/server/${lpsa(-2)}`, _this.getHeaders()).then(json => {
					comicName = json.name;
					return json.channels.map(({
						server_id,
						id,
						name
					}) => ({
						mid: server_id,
						cid: id,
						text: name,
						url: `/discord/server/${server_id}/${id}`
					}));
				});
			}
			let yes = confirm("Load all posts?");
			if (yes) {
				return _this.api(`/api/v1${lp()}/profile`).then(async json => {
					comicName = json.name;
					let max = Math.ceil(json.post_count / 50);
					let links = fn.arr(max, (v, i) => i == 0 ? `/api/v1${lp()}/posts` : `/api/v1${lp()}/posts?o=${i * 50}`);
					let posts = [];
					let fetchNum = 0;
					for (let url of links) {
						fetchNum++;
						updateText(listMessage, `${DL.status.get.s1}(${fetchNum}/${links.length})`);
						posts = [...posts, ...await _this.api(url)];
						await delay(1000);
					}
					return posts.map(p => {
						let cover = p.file?.path ? `//img.${location.host}/thumbnail/data${p.file?.path}` : null;
						let text = (p.title + " " + p.published?.replace(/T.+$/, "") + ` id：${p.id}`).trim()
						return {
							cover,
							text,
							url: `${lp()}/post/${p.id}`
						};
					});
				});
			}
			return _this.api(`/api/v1${lp()}/profile`).then(async json => {
				comicName = json.name;
				let o = fn.getUSP("o");
				return _this.api(`/api/v1${lp()}/posts${o ? `?o=${o}` : ""}`).then(posts => posts.map(p => {
					let cover = p.file?.path ? `//img.${location.host}/thumbnail/data${p.file?.path}` : null;
					let text = (p.title + " " + p.published?.replace(/T.+$/, "") + ` id：${p.id}`).trim()
					return {
						cover,
						text,
						url: `${lp()}/post/${p.id}`
					};
				}));
			});
		},
		getSrcs: (url, item) => {
			if (lp("/discord/server/") && lp(5)) {
				let {
					cid
				} = item.dataset;
				return ajax.json(`/api/v1/discord/channel/${cid}`, _this.getHeaders()).then(array => {
					let paths = array.map(e => e.attachments).flat().filter(e => isImage(e.path)).map(e => e.path);
					return paths.map(p => `https://n1.${location.host}/data${p}`);
				});
			}
			return _this.api(`/api/v1${new URL(url).pathname}`).then(json => {
				let {
					previews,
					videos
				} = json;
				let images = previews?.map(e => e.server + "/data" + e.path + "?f=" + e.name) || [];
				videos = videos?.map(e => e.server + "/data" + e.path + "?f=" + e.name) || [];
				if (videos.length) {
					item.dataset.videos = videos.join(",");
				}
				return images;
			});
		},
		dv: true,
		ot: 1
	}, {
		siteName: "Nekohouse",
		homePage: "https://nekohouse.su/",
		sort: "album",
		url: {
			h: ["nekohouse.su"],
			p: /\/user\/\w+$/i
		},
		getLists: async () => {
			comicName = q(".user-header__name span[itemprop=name]").innerText;
			let eles = q([".post-card>a"]);
			let yes = confirm("Load all posts?");
			if (yes) {
				let fetchNum = 0;
				await ajax.doc(lp()).then(async dom => {
					eles = q([".post-card>a"], dom);
					let postCount = Number(q(".paginator>small", dom).innerText.match(/\d+/g).at(-1));
					let max = Math.ceil(postCount / 50);
					if (max > 1) {
						let links = fn.arr(max - 1, (v, i) => `${lp()}?o=${(i + 1) * 50}`);
						for (let url of links) {
							fetchNum++;
							updateText(listMessage, `${DL.status.get.s1}(${fetchNum}/${links.length})`);
							eles = [...eles, ...await ajax.doc(url).then(d => q([".post-card>a"], d))];
							await delay(1000);
						}
					}
				});
			}
			return eles.map(a => ({
				cover: q(".post-card__image", a)?.src || null,
				text: (q(".post-card__header", a)?.innerText + " " + q(".timestamp", a)?.getAttribute("datetime")?.split(" ")?.at(0) + ` id：${a.href.split("/").at(-1)}`).trim(),
				url: a.href
			}));
		},
		getSrcs: {
			cb: (dom, url, item) => {
				let videos = [];
				let urls = q(["a[download]"], dom);
				if (urls.length) {
					for (let url of urls) {
						if (isVideo(url)) {
							videos.push(url);
						}
					}
				}
				if (videos.length) {
					item.dataset.videos = videos.join(",");
				}
				return q(["div.fileThumb[href]"], dom).map(e => location.origin + e.getAttribute("href"));
			}
		},
		dv: true,
		ot: 1
	}, {
		siteName: "Luscious",
		homePage: "https://www.luscious.net/",
		sort: "album",
		url: {
			h: ["www.luscious.net"]
		},
		spa: true,
		page: () => lp() != "/" && !lp(/^\/albums\/[\w-]+_\d+\/$/) && !lh("view=slideshow") && !lp("/blogs/"),
		observeURL: "head",
		getLists: () => al(".album-card-target-wrapper>.album-card-outer-link"),
		api: (id, page) => "https://www.luscious.net/graphql/nobatch/?" + new URLSearchParams({
			operationName: "PictureListInsideAlbum",
			query: "query PictureListInsideAlbum($input:PictureListInput!){picture{list(input:$input){info{total_pages}items{url_to_original url_to_video}}}}",
			variables: JSON.stringify({
				input: {
					filters: [{
						name: "album_id",
						value: String(id)
					}],
					display: "date_newest",
					items_per_page: 50,
					page
				}
			})
		}).toString(),
		getSrcs: async (url, item) => {
			let id = url.match(/\d+/g).at(-1);
			let max = await ajax.json(_this.api(id, 1)).then(json => json.data.picture.list.info.total_pages);
			let resArr = fn.arr(max, (v, i) => {
				return ajax.json(_this.api(id, (i + 1))).then(json => {
					return json.data.picture.list.items.map(e => (e.url_to_video ? {
						video: e.url_to_video
					} : {
						original: e.url_to_original
					}));
				});
			});
			return Promise.all(resArr).then(data => {
				let videos = data.flat().filter(item => item.video).map(e => e.video);
				if (videos.length) {
					item.dataset.videos = videos.join(",");
				}
				return data.flat().filter(item => item.original).map(e => e.original);
			});
		},
		dv: true
	}, {
		siteName: "4KHD",
		homePage: "https://www.4khd.com/",
		sort: "album",
		info: "有水印",
		url: {
			t: "4KHD",
			e: "li.wp-block-post:has(.wp-post-image):has(h2)"
		},
		getLists: () => q([_this.url.e]).map(post => ({
			cover: q(".wp-post-image", post).src.replace("pic.4khd.com", "img.4khd.com"),
			text: q("h2>a", post).text,
			url: q("h2>a", post).href
		})),
		getSrcs: {
			target: ".entry-content>p>a>img",
			pages: ".page-link-box a",
			rs: [
				[/i\d\.wp\.com\//, ""],
				["pic.4khd.com", "img.4khd.com"],
				[/\?.+$/, ""],
				[/\/w\d+-rw\//, "/w2500-h2500-rw/"]
			]
		}
	}, {
		siteName: ["Xasiat", "AVJB"],
		homePage: ["https://www.xasiat.com/albums/", "https://avjb.com/albums/"],
		sort: "album",
		info: "部分地區需要VPN",
		url: {
			e: [".copyright a:text:爱微社区,.copyright a:text:Xasiat", ".list-albums:has(#list_albums_common_albums_list_items) .item a"]
		},
		getLists: () => al(_this.url.e.at(1)),
		getSrcs: {
			target: ".images>a>img",
			attr: "data-original",
			rs: [/\/main\/\d+x\d+\//, "/sources/"]
		}
	}, {
		siteName: "Xiunice.com",
		homePage: "https://xiunice.com/",
		sort: "album",
		info: "有水印",
		url: {
			h: ["xiunice.com"],
			e: ".td-cpt-post",
			ee: ".wp-block-gallery"
		},
		getLists: (s = ".entry-title a") => q([_this.url.e]).map(d => ({
			cover: q(".entry-thumb", d).dataset.imgUrl,
			text: q(s, d).text,
			url: q(s, d).href
		})),
		getSrcs: ".wp-block-gallery img"
	}, {
		siteName: "Cup2D",
		homePage: "https://cup2d.com/",
		sort: "album",
		url: {
			h: ["cup2d.com"],
			e: ".gridshow-grid-post",
		},
		getLists: (s = ".wp-post-image") => q([_this.url.e]).map(d => ({
			cover: q(s, d).dataset?.lazySrc || q(s, d).src,
			text: q(s, d).title || q(s, d).alt,
			url: q("a", d).href
		})),
		getSrcs: ".entry-content>div:not(.separator,.c)>a,.entry-content>a:has(>img[data-lazy-src])"
	}, {
		siteName: ["TUPIC.TOP", "Asian to lick"],
		homePage: ["https://www.tupic.top/last/", "https://asiantolick.com/page/news"],
		sort: "album",
		url: {
			h: ["tupic.top", "www.tupic.top", "asiantolick.com"],
			e: "#container>a:has(img):has(.base_tt)",
			ee: ".gallery_img"
		},
		getLists: () => q([_this.url.e]).map(a => ({
			cover: fn.dCdn(q("img", a).dataset?.src) || q("img", a).getAttribute("lay-src") || q("img", a).src,
			text: q(".base_tt", a).innerText,
			url: a.href
		})),
		getSrcs: {
			target: ".gallery_img",
			attr: "data-src",
			cdn: 0
		}
	}, {
		siteName: "套圖TAOTU.ORG",
		homePage: "https://taotu.org/",
		sort: "album",
		url: {
			h: ["taotu.org"],
			e: "#MainContent_piclist.piclist>div:has(h2):has(>a>img)"
		},
		getLists: () => q([_this.url.e]).map(p => ({
			cover: q("img", p).src,
			text: q("h2", p).innerText,
			url: q("a", p).href
		})),
		getSrcs: "a[data-fancybox=gallery]"
	}, {
		siteName: "Mega Gallery",
		homePage: "https://www.ecy8.com/",
		sort: "album",
		url: {
			h: "www.ecy8.com",
			e: ".wp-block-cover:has(.wp-block-post-title)",
		},
		getLists: () => q([_this.url.e]).map(d => ({
			cover: q("img", d).src,
			text: q("h2>a", d).text,
			url: q("h2>a", d).href
		})),
		getSrcs: ".wp-block-gallery img"
	}, {
		siteName: "Coser Lab",
		homePage: "https://coserlab.io/",
		sort: "album",
		info: "18禁的要登入",
		url: {
			h: ["coserlab.io"],
			e: ".grid-item,.albums-block",
			ee: ".post.card"
		},
		getLists: () => {
			if (lp("/category/")) {
				return q([".albums-block-title a"]).map(a => ({
					cover: q("img", c(".albums-block", a)).dataset?.src || q("img", c(".albums-block", a)).src,
					text: a.innerText,
					url: a.href
				}));
			}
			return al(".grid-item .masonry-block>a:not(:has(img[alt*='广告']))");
		},
		getSrcs: {
			target: "a.glightbox",
			rs: ["-scaled", ""]
		}
	}, {
		siteName: "Mitaku",
		homePage: "https://mitaku.net/",
		sort: "album",
		url: {
			h: ["mitaku.net"],
			e: "#content>.article-container>.post a[title]:has(img)"
		},
		getLists: "A",
		getSrcs: {
			target: "a.msacwl-img-link[data-mfp-src]",
			attr: "data-mfp-src"
		}
	}, {
		siteName: "Cosplaytele",
		homePage: "https://cosplaytele.com/category/cosplay/",
		sort: "album",
		info: "有水印",
		url: {
			h: ["cosplaytele.com"],
			e: "#post-list a[aria-label]:has(img)"
		},
		getLists: "A",
		getSrcs: "figure.gallery-item a"
	}, {
		siteName: "CG Cosplay",
		homePage: "https://cgcosplay.org/",
		sort: "album",
		url: {
			h: ["cgcosplay.org"],
			e: ".sina-bp-grid .sina-bp:has(.sina-bg-thumb):has(.sina-bp-content)",
			ee: ".hfe-page-title"
		},
		getLists: "A",
		getSrcs: ".gallery .gallery-item a:has(>img:not([src$='/banner'])),.elementor-image-gallery>a[data-elementor-open-lightbox]"
	}, {
		siteName: "Everia Club",
		homePage: "https://www.everiaclub.com/",
		sort: "album",
		url: {
			h: ["www.everiaclub.com"],
			e: ".mainleft a:has(img)",
			ee: ".mainleft h1"
		},
		getLists: "A",
		getSrcs: {
			target: ".mainleft img",
			attr: "data-original"
		}
	}, {
		siteName: "EVERIA.CLUB",
		homePage: "https://everia.club/",
		sort: "album",
		url: {
			h: ["everia.club"],
			e: "[id^=post] .thumbnail a",
			ee: ".single-post-title"
		},
		getLists: "A",
		getSrcs: {
			target: ".wp-block-image img",
			attr: "data-lazy-src"
		}
	}, {
		siteName: "HotAsiaGirl",
		homePage: "https://hotgirl.asia/photos/",
		sort: "album",
		url: {
			h: ["hotgirl.asia"],
			e: ".ml-item>a",
			ee: "#mv-info .thumb"
		},
		getLists: "A",
		getSrcs: {
			target: ".galeria_img>img",
			pages: ".pagination a[href]"
		}
	}, {
		siteName: ["AHottie", "Coser", "HotGirl", "SexyGirl", "SexyAsianGirl", "嫩妹图库", "尤物丧志", "秀人图", "亚色图库"],
		homePage: ["ahottie.top", "coser.pics", "hotgirl.lat", "sexygirl.lat", "sexyasiangirl.top", "nenmei.pics", "youwu.im", "xiuren.win", "yase.im"].map(h => `https://${h}/`),
		sort: "album",
		url: {
			e: ["body>.container", "#navbar,nav.flex", "#nav-menu,.my-auto .fa-home", ".grid a:has(img)", "nav[aria-label='Pagination Navigation'],#pagination,div.items-center:text:Page,.grid .relative>a"],
			ee: "#main h1.text-yellow-500,.container article"
		},
		getLists: () => q([_this.url.e.at(3)]).map(a => ({
			cover: q("img", a).src,
			text: q("img", a).alt || q("h2", c("div:has(>div)", a))?.innerText,
			url: a.href
		})),
		getSrcs: {
			target: "img.block",
			links: (dom, url) => {
				let next = q("a[rel=next],.items-center a:last-child:text:Next", dom);
				let max = Number(next?.previousElementSibling?.innerText);
				return max > 1 ? fn.arr(max - 1, (v, i) => `${url}?page=${i + 2}`) : [];
			},
			cdn: 0
		}
	}, {
		siteName: ["Goddess247", "BestGirlSexy", "GirlDreamy", "GirlSweetie", "BestPrettyGirl"],
		homePage: (o) => o.url.h.map(h => `https://${h}/`),
		sort: "album",
		url: {
			h: ["goddess247.com", "bestgirlsexy.com", "girldreamy.com", "girlsweetie.com", "bestprettygirl.com"],
			e: ".elementor-posts-container .elementor-post a:has(img)",
			ee: ".elementor-icon-list-items"
		},
		getLists: "A",
		getSrcs: ".elementor-widget-container p img[alt],.elementor-widget-container img.aligncenter.size-full,.elementor-widget-theme-post-content img"
	}, {
		siteName: "HotGirl World",
		homePage: "https://hotgirl.world/",
		sort: "album",
		info: "有水印",
		url: {
			t: "HotGirl",
			h: "hotgirl",
			e: ".articles-grid__list a:has(img[alt][data-src])"
		},
		getLists: "A",
		getSrcs: {
			target: ".article__image-item img",
			attr: "data-src",
			links: (dom, url) => {
				let max = Number(q(".pagination__total", dom)?.innerText);
				return max > 1 ? fn.arr(max - 1, (v, i) => `${url}?page=${i + 2}`) : [];
			},
			delay: 500
		}
	}, {
		siteName: "G-MH",
		homePage: "https://g-mh.com/",
		sort: "album",
		url: {
			h: ["g-mh.com"],
			e: "#posts-container a:has(img[alt])",
			eu: "/gallery/"
		},
		getLists: "A",
		getSrcs: {
			target: "#article img",
			links: (dom, url) => {
				let pages = q("nav>a:last-child[aria-label=Next]", dom);
				let max = Number(pages?.previousElementSibling?.lastElementChild?.innerText);
				return max > 1 ? fn.arr(max - 1, (v, i) => `${url}page/${i + 2}/`) : [];
			}
		}
	}, {
		siteName: "Erohere",
		homePage: "https://my.erohere.eu/",
		sort: "album",
		url: {
			h: ["my.erohere.eu"],
			e: ".section-title~.grid>a"
		},
		getLists: "A",
		getSrcs: {
			target: ".simple-gallery-item img",
			links: (dom, url) => {
				let pages = q(".pagination", dom);
				if (pages) {
					let max = um(".pagination-numbers>a", dom);
					return fn.arr(max - 1, (v, i) => `${url}${i + 2}/`);
				}
				return [];
			}
		}
	}, {
		siteName: "Hot Girl Pix",
		homePage: "https://www.hotgirlpix.com/",
		sort: "album",
		url: {
			h: "www.hotgirlpix.com",
			e: "article.archive a.postTitleLink:has(img)"
		},
		getLists: "A",
		getSrcs: {
			target: "article img",
			pages: "#singlePostPagination a"
		},
		hide: "#modalAdblock,body~*"
	}, {
		siteName: "Hotgirl.biz",
		homePage: "https://hotgirl.biz/latest-posts/",
		sort: "album",
		url: {
			h: ["hotgirl.biz"],
			e: ".latest-posts a[title]:has(img[data-lazy-src])"
		},
		getLists: "A",
		getSrcs: {
			target: ".entry-content img",
			attr: "data-lazy-src"
		}
	}, {
		siteName: "Căng Cực",
		homePage: "https://cangcuc.com/",
		sort: "album",
		url: {
			h: ["cangcuc.com"],
			e: ".masonry-items>.masonry-item .post-card a:has(img[alt])"
		},
		info: "有水印",
		getLists: "A",
		getSrcs: {
			target: ".post-single .royal_grid a",
			video: ".royal_grid video>source"
		},
		dv: true
	}, {
		siteName: "Gai.vn",
		homePage: "https://www.gai.vn/",
		sort: "album",
		url: {
			h: ["gai.vn", "www.gai.vn"]
		},
		s: "#content>.row>.gai-thumb>a",
		info: "SPA網頁，僅支持Albums不支持Tag",
		spa: true,
		page: () => {
			if (lp() == "/") return false;
			return !!q(_this.s);
		},
		observeURL: "head",
		getLists: () => al(_this.s, ".title-label"),
		getSrcs: {
			target: "a[data-fancybox='slide']",
			links: (dom, url) => {
				let pages = q(".pagination .next-page", dom);
				return pages ? fn.arr(Number(q(".pagination .page-item:has(.next-page)", dom).previousElementSibling.innerText) - 1, (v, i) => url + "-startpic-" + ((i + 1) * 20)) : [];
			}
		}
	}, {
		siteName: "True Pic",
		homePage: "https://truepic.net/picture_collection/",
		sort: "album",
		url: {
			h: ["truepic.net"],
			e: ".av-masonry-container>.type-post,.template-search .type-post"
		},
		getLists: () => {
			if (("s=")) {
				return q([".template-search .type-post"]).map(p => ({
					text: q(".entry-title", p).innerText,
					url: q("a", p).href
				}));
			}
			return q([".av-masonry-container>.type-post"]).map(a => ({
				cover: fn.getBackgroundImage(q(".av-masonry-image-container", a)),
				text: q(".entry-title", a).innerText,
				url: a.href
			}));
		},
		getSrcs: {
			target: ".entry-content p>img",
			pages: ".pagination_split_post a"
		}
	}, {
		siteName: ["Asian Porn Image", "Hentai Cosplay", "Hentai Image"],
		homePage: (o) => o.url.h.map(h => `https://${h}/search/`),
		sort: "album",
		url: {
			h: ["porn-images-xxx.com", "hentai-cosplay-xxx.com", "hentai-img.com"],
			e: "#display_area_image:nth-child(3)>#image-list a:has(img)"
		},
		info: "為了避免跨域問題，僅支持EN語系域名",
		getLists: "A",
		getSrcs: {
			api: (url) => `/story/${url.split("/").at(4)}/`,
			target: "amp-story-page[id='cover'] amp-img,amp-story-page[id^='page'] amp-img",
			attr: "src"
		}
	}, {
		siteName: ["Buon Dua", "Xiutaku", "Kiutaku"],
		homePage: (o) => o.url.h.map(h => `https://${h}/`).slice(1),
		sort: "album",
		url: {
			h: ["buondua.com", "buondua.us", "xiutaku.com", "kiutaku.com"],
			e: ".items-row .item-thumb a",
			ee: ".article-header"
		},
		init: () => {
			for (let e of x(["//div[text()='Sponsored ads']", "//div[div[iframe]]", "//div[ins]", "//body/iframe", "//body/ins"])) e.remove();
		},
		getLists: "A",
		getSrcs: {
			target: ".article-fulltext img",
			links: (dom, url) => {
				let max;
				let end = x("//a[text()='End']", dom);
				isEle(end) ? max = fn.getUSP("page", end.href) : max = q(".pagination-list>span:last-child", dom)?.innerText;
				return Number(max) > 1 ? fn.arr((Number(max) - 1), (v, i) => `${url}?page=${i + 2}`) : [];
			}
		},
		hide: ".mod-ads-auto-title,.mod-ads-auto-container"
	}, {
		siteName: "XiuRenBox",
		homePage: "https://www.xiurenbox.com/",
		sort: "album",
		url: {
			h: "www.xiurenbox.com",
			e: "#posts a:has(img[title][alt])"
		},
		getLists: "A",
		getSrcs: {
			api: (url) => url + "?showall=1",
			target: ".entry-content .wp-block-image img"
		}
	}, {
		siteName: "1Y Beauties",
		homePage: "https://www.1y.is/",
		sort: "album",
		url: {
			h: "www.1y.is",
			e: ".np-grid-entries>.entry-card>a:has(img)"
		},
		getLists: "A",
		getSrcs: {
			target: ".entry-content img",
			pages: ".page-links a"
		}
	}, {
		siteName: (o) => o.url.t,
		homePage: ["https://lootiu.com/", "https://www.kaizty.com/", "https://www.depvailon.com/", "https://thismore.fun/", "https://redseats.org/", "https://us.dongojyousan.com/"],
		sort: "album",
		url: {
			t: ["Lootiu.Com", "Kaizty Photos", "Depvailon.Com", "ThisMore.Fun", "RedSeats.Org", "dongojyousan.com"],
			e: ".thumb-view a[title]:has(.xld),article:has(.entry-header)",
			eu: ["/gallery", "/articles/", "/photos/", "/view/"]
		},
		getLists: (s = ".thumb-view a[title]:has(.xld)") => {
			if (q(s)) {
				return q([s]).map(a => ({
					cover: q(".xld", a).src,
					text: a.title,
					url: a.href
				}));
			}
			return al("article:has(.entry-header)", ".entry-header");
		},
		getSrcs: {
			target: ".contentme img,.contentme2 img,.video-description img",
			links: (dom, url) => {
				let pages = dom.title.includes("| Page");
				return pages ? fn.arr(Number(dom.title.match(/\d+/g).at(-1)) - 1, (v, i) => `${url}?page=${i + 2}`) : [];
			}
		}
	}, {
		siteName: (o) => o.url.t,
		homePage: ["https://www.hitxhot.org/", "https://cn.looives.com/"],
		sort: "album",
		url: {
			t: ["Hit-x-Hot", "Chinese in beauty"],
			eu: ["/gallerys/", "/view/"],
			e: "div[id^=post]:has(h2)"
		},
		getLists: () => al(null, "h2"),
		getSrcs: {
			target: ".VKSUBTSWA img",
			links: (dom, url) => {
				if (url.includes("/gallerys/")) return u("div[id^=post] a", dom);
				let max = Number(dom.title.match(/【(\d+)P】/)?.at(1));
				return max > 1 ? fn.arr(max - 1, (v, i) => `${url}?page=${i + 2}`) : [];
			}
		}
	}, {
		siteName: "PhimVu Blog",
		homePage: "https://m.phimvuspot.com/search/?page=1",
		sort: "album",
		url: {
			h: "m.phimvuspot.com",
			e: ".blog-posts .blog-post:has(.post-image-wrap):has(.post-info>.post-title)"
		},
		getLists: "A",
		getSrcs: {
			target: ".post-content img",
			links: (dom, url) => {
				let pages = dom.title.includes("| Page");
				return pages ? fn.arr(Number(dom.title.match(/\d+/g).at(-1)) - 1, (v, i) => `${url}?page=${i + 2}`) : [];
			},
			cdn: 0
		}
	}, {
		siteName: (o) => o.url.t,
		homePage: ["", "jvid.", "xiuren.", "bobosocks.", "imiss.", "cosplay."].map(h => `https://${h}girl18.net/`),
		sort: "album",
		url: {
			t: ["Girl 18+ Korean", "JVID Girl 18+", "Xiuren Girl 18+", "BoBoSocks袜啵啵 Girl 18+", "IMISS Girl 18+", "COSPLAY Girl 18+"],
			e: "#index_ajax_list>.i_list>a:has(img[data-original])"
		},
		getLists: () => q([_this.url.e]).map(a => ({
			cover: q("img", a).dataset?.original || q("img", a).src,
			text: q(".meta-title", c("li", a)).innerText,
			url: a.href
		})),
		getSrcs: {
			target: "#image_div img",
			cdn: 0
		}
	}, {
		siteName: ["EPORNER", "用戶上傳的相簿頁面 namaiki"],
		homePage: ["https://www.eporner.com/pics/", "https://www.eporner.com/profile/namaiki/uploaded-pics/"],
		sort: "album",
		url: {
			h: "www.eporner.com",
			p: ["/pics/", "/uploaded-pics/"],
			e: ".photosgrid a[id]"
		},
		getLists: () => al(null, "*:last-child"),
		getSrcs: {
			target: "#container img",
			rs: ["_296x1000", ""]
		}
	}, {
		siteName: "NSFWalbum",
		homePage: "https://nsfwalbum.com/",
		sort: "album",
		url: {
			h: ["nsfwalbum.com"],
			eu: ["/album/", "/models/"]
		},
		waitEle: "figure:has(>.flex-images):has(>.figure-caption)",
		getLists: (s = ".video_name a") => q([_this.waitEle]).map(t => ({
			cover: q("img", t).src,
			text: q(s, t).text,
			url: q(s, t).href
		})),
		getSrcs: {
			cb: (dom, url, item) => {
				let fetchNum = 0;
				let resArr = q([".album .item>a"], dom).map(async (a, i, arr) => {
					let img = q("img", a);
					let src = img.dataset.src ?? img.src;
					if (/imx\.to/.test(src)) {
						return src.replace("/t/", "/i/");
					} else {
						updateS(item, `${DL.status.s0}：${DL.status.get.s1}`);
						updateP(item, `${DL.progress}：0/${arr.length}`);
						await delay(i * 100);
						return ajax.text(a).then(async text => {
							await delay(i * 200);
							let id = a.href.split("/").at(-1);
							text = strSlicer(text, "spirit = ", "))");
							let spirit = fn.run(text);
							let api = `/backend.php?&spirit=${spirit}&photo=${id}`;
							return ajax.json(api).then(json => {
								fetchNum++;
								updateP(item, `${DL.progress}：${fetchNum}/${arr.length}`);
								return json[0];
							});
						});
					}
				});
				return Promise.all(resArr);
			}
		},
		ot: 1
	}, {
		siteName: "GirlsTop.info",
		homePage: "https://en.girlstop.info/",
		sort: "album",
		url: {
			h: "en.girlstop.info",
			e: ".thumbs .thumb",
			ee: "h1.index:text:Search by"
		},
		getLists: (s = ".thumb_name a") => q([_this.url.e]).map(t => ({
			cover: q("source", t).srcset,
			text: q("img", t).alt + " - " + q(s, t).text,
			url: q(s, t).href
		})),
		getSrcs: "a[id^=pic]"
	}, {
		siteName: "Girlsreleased",
		homePage: "https://girlsreleased.com/",
		sort: "album",
		url: {
			h: ["girlsreleased.com"]
		},
		spa: true,
		page: () => !lp("/set/") && lp() != "/sites" && lp() != "/models",
		observeURL: "head",
		getLists: () => q(["div.flex-row.align-middle>div.flex:has(a[data-discover])"]).map(t => {
			let [n, , s, m] = q(["a"], t).map(a => a.innerText);
			let url = q("a", t).href;
			return {
				cover: q("img", t)?.src,
				text: m == n ? `${m} - ${url.split("/").at(-1)} (${s})` : `${m} - ${n} (${s})`,
				url
			}
		}),
		getSrcs: (url, item) => {
			let gid = url.split("/").at(-1);
			return ajax.json(`/api/0.2/set/${gid}`).then(json => {
				let fetchNum = 0;
				let images = json.set.images.map(a => ({
					o: a.at(3),
					t: a.at(4)
				}));
				let total = images.length;
				let resArr = images.map(async ({
					o,
					t
				}, i) => {
					updateS(item, `${DL.status.s0}：${DL.status.get.s1}`);
					updateP(item, `${DL.progress}：0/${total}`);
					if (t.includes("imx.to/u/t/")) {
						fetchNum++;
						updateP(item, `${DL.progress}：${fetchNum}/${total}`);
						return t.replace("/t/", "/i/");
					}
					if (t.includes("imgadult.com")) {
						fetchNum++;
						updateP(item, `${DL.progress}：${fetchNum}/${total}`);
						return t.replace("small-medium/", "big/");
					}
					if (t.includes("pixhost.to")) {
						fetchNum++;
						updateP(item, `${DL.progress}：${fetchNum}/${total}`);
						return t.replace("https://t", "https://img").replace("/thumbs/", "/images/");
					}
					if (t.includes("imagevenue")) {
						if (o.includes("_o.")) {
							fetchNum++;
							updateP(item, `${DL.progress}：${fetchNum}/${total}`);
							return o;
						}
					}
					await delay(200 * i);
					return ajax.getImageHost(o, item).finally(() => {
						fetchNum++;
						updateP(item, `${DL.progress}：${fetchNum}/${total}`);
					});
				});
				return Promise.all(resArr);
			});
		},
		ot: 1
	}, {
		siteName: "URLGalleries",
		homePage: "https://urlgalleries.net/",
		sort: "album",
		url: {
			h: ["urlgalleries.net"],
			e: ".contentbody>table:has(#wtf)"
		},
		getLists: () => q([_this.url.e]).map(t => ({
			cover: q(".gmiddle img", t).src,
			text: q(".ghead a", t).title,
			url: q(".ghead a", t).href
		})),
		getSrcs: {
			api: (url) => url + "&a=10000",
			pages: "#wtf a",
			allPages: true,
			cb: (dom, url, item) => {
				let code = findScript("var IMAGE_URL", dom);
				let IMAGE_URL = strVar(code, "var IMAGE_URL");
				return ajax.getImageHost(IMAGE_URL, item);
			}
		},
		ot: 1,
		hide: "body>.mobilehide"
	}, {
		siteName: "Adult Photo Sets",
		homePage: "https://adultphotosets.best/",
		sort: "album",
		url: {
			h: ["adultphotosets.best"],
			e: "#dle-content>.box>.box_in",
			eu: ".html"
		},
		getLists: () => q([_this.url.e]).map(b => ({
			cover: q(".text img", b)?.dataset?.src || q(".text img", b)?.src || null,
			text: q(".title", b).innerText,
			url: q(".story_tools p>a", b).href
		})).filter(({
			text
		}) => text.includes("images set")),
		getSrcs: {
			pages: ".text a:has(img[data-src][data-maxwidth]),.text a:has(img[border='0'])",
			allPages: true,
			imageHost: true
		},
		ot: 1
	}, {
		siteName: "Redpics",
		homePage: "https://www.redpics.top/",
		sort: "album",
		url: {
			h: ["www.redpics.top"],
			e: ".container>.grid>.card"
		},
		getLists: () => q([_this.url.e]).map(c => ({
			cover: q(".card-image", c)?.src,
			text: q(".card-content p", c).innerText,
			url: q("a", c).href
		})),
		getSrcs: {
			pages: "#extra-content>a,.post-content a",
			allPages: true,
			imageHost: true
		},
		ot: 1
	}, {
		siteName: "X-video",
		homePage: "https://x-video.tube/albums/",
		sort: "album",
		url: {
			h: ["x-video.tube"],
			p: "/albums/",
			e: ".thumbs__list a",
			ee: ".album-view"
		},
		getLists: "A",
		getSrcs: {
			cb: (dom, url) => {
				let total = Number(q(".media-data__list-value", dom).innerText);
				let max = 1;
				if (total > 12) {
					max = Math.ceil(total / 100) + 1;
				}
				let resArr = fn.arr(max, (v, i) => {
					let api = i == 0 ? url + "?mode=async&function=get_block&block_id=album_view_album_view" : url + "?mode=async&function=get_block&block_id=album_view_album_view&load=more&from=" + i;
					return ajax.doc(api, {
						headers: {
							"x-requested-with": "XMLHttpRequest"
						}
					}).then(d => q(["a[data-fancybox-type]"], d));
				});
				return Promise.all(resArr);
			}
		}
	}, {
		siteName: "PornTrex",
		homePage: "https://www.porntrex.com/albums/",
		sort: "album",
		info: "部分相簿需要登入解鎖，才能取得圖片",
		url: {
			h: "www.porntrex.com",
			p: "/albums/",
			e: "#list_albums_common_albums_list_items a",
			ee: ".images"
		},
		getLists: "A",
		getSrcs: ".images a[data-fancybox-type]"
	}, {
		siteName: ["Thothub", "Thothub", "ThotHD", "X1HUB", "KissJAV", "Javwhores"],
		homePage: ["https://thothub.to/albums/", "https://thothub.vip/albums/", "https://thothd.com/albums/", "https://www.x1hub.com/albums/", "https://kissjav.com/albums/", "https://www.javbangers.com/albums/"],
		sort: "album",
		info: "部分相簿需要登入解鎖，才能取得圖片",
		url: {
			e: ["#list_albums_common_albums_list_items a:has(.title)", "img[alt=Thothub],img[alt=ThotHD],img[alt=X1HUB],img[alt^=KissJAV],img[alt=Javwhores]"],
			p: "/albums/",
			ee: ".images"
		},
		getLists: () => al(_this.url.e.at(0), ".title"),
		getSrcs: {
			target: ".images img",
			attr: "data-original",
			rs: [/main\/\d+x\d+/, "sources"]
		}
	}, {
		siteName: "Erotic Pics",
		homePage: "https://erotic.pics/",
		sort: "album",
		url: {
			h: ["erotic.pics"],
			e: "#masonry>.post a:has(img[post-id])"
		},
		getLists: "A",
		getSrcs: ".entry-content img"
	}, {
		siteName: "EROHD.ICU",
		homePage: "https://erohd.su/",
		sort: "album",
		url: {
			e: [".logo a[title='erohd.icu']", ".items-row .article-title a"]
		},
		getLists: () => {
			if (ls("searchword=")) {
				return q([".search-results .item"]).map(i => ({
					cover: q(".article-intro img", i)?.dataset?.src || q(".article-intro img", i)?.src,
					text: q("a", i).innerText,
					url: q("a", i).href
				}));
			}
			return q([_this.url.e.at(1)]).map(a => ({
				cover: q(".article-intro a:has(img) img", c("article", a))?.dataset?.src || q(".article-intro a:has(img) img", c("article", a))?.src,
				text: a.title,
				url: a.href
			}));
		},
		getSrcs: ".sigFreeThumb a.fancybox-gallery"
	}, {
		siteName: "PornPaw.com",
		homePage: "https://www.pornpaw.com/",
		sort: "album",
		url: {
			h: ["www.pornpaw.com"],
			e: ".row div:has(+a .frame img)",
			eu: "/gallery/"
		},
		getLists: () => q([_this.url.e]).map(d => ({
			cover: q("img", d.nextElementSibling).dataset?.src || q("img", d.nextElementSibling).src,
			text: q("a", d).text,
			url: q("a", d).href
		})),
		getSrcs: {
			target: "img.img",
			rs: ["x160.", "."]
		}
	}, {
		siteName: "Szexképek",
		homePage: "https://szexkepek.net/",
		sort: "album",
		url: {
			h: ["szexkepek.net"],
			e: ["h3.page-header", ".row:has(>.col-xs-6>a>img.gallerythumb)"]
		},
		getLists: () => q([".row:has(h3.page-header)"]).map(r => ({
			cover: q(".gallerythumb", r).src,
			text: q("a", r).text,
			url: q("a", r).href
		})),
		getSrcs: {
			target: "img.gallerythumb",
			rs: ["x160.", "."]
		}
	}, {
		siteName: (o) => o.url.t,
		homePage: ["https://www.asiapornphoto.com/", "https://www.nudedxxx.com/", "https://www.assesphoto.com/"],
		sort: "album",
		url: {
			t: ["Asia Porn Photo", "Nuded Photo", "Asses Photo"],
			e: "#image-container>.image-wrapper:has(>img[alt]):has(>a.overlay)"
		},
		getLists: () => q([_this.url.e]).map(i => ({
			cover: q("img", i).src,
			text: q("img", i).alt,
			url: q(".overlay", i).href
		})),
		getSrcs: ".image-container>.image-wrapper[onclick]>img"
	}, {
		siteName: "PICTOA",
		homePage: "https://www.pictoa.com/",
		sort: "album",
		url: {
			h: "www.pictoa.com",
			e: "main>.title~.wrapper .cover-box>.gallery-link",
			eu: "/albums/"
		},
		getLists: "A",
		getSrcs: {
			target: "#player img",
			pages: ".thumb-nav-img:not(:first-child) a"
		}
	}, {
		siteName: "紳士漫畫",
		homePage: "https://www.wnacg.com/",
		sort: "album-hentai",
		url: {
			t: ["邪惡漫畫", "紳士漫畫"],
			e: ".gallary_item .pic_box a",
			ee: ".btn:text:下拉"
		},
		getLists: "A",
		getSrcs: (url) => {
			let [galleryId] = url.match(/\d+/);
			let dataUrl = `/photos-item-aid-${galleryId}.html`;
			return ajax.text(dataUrl).then(text => {
				let array = strToArray(text, "page_url");
				return array.map(url => fn.rs(url, [
					[/^http:\/\//, "https://"],
					[/^\/\//, "https://"]
				]));
			});
		}
	}, {
		siteName: ["Comics", "Cosplay/Photo"],
		homePage: ["https://pixiv.app/en/comics", "https://pixiv.app/en/comics?classification=photo_cosplay"],
		sort: "album-hentai",
		url: {
			h: ["pixiv.app"],
			e: "main .box-border>.relative>a:has(img[alt])",
			eu: "/comics/"
		},
		getLists: "A",
		getSrcs: {
			cb: (dom) => __next_f(dom).match(/"src":"([^"])+"/g).filter(e => e.includes("/image/")).map(src => src.slice(7, -1))
		}
	}, {
		siteName: "宅男漫画",
		homePage: "https://www.znmh.net/",
		sort: "album-hentai",
		url: {
			t: "宅男漫画",
			e: ".gallery-item",
			eu: "/view/"
		},
		getLists: () => q([".gallery-item"]).map(i => ({
			cover: q("img", i).src,
			text: q(".gallery-title", i).innerText,
			url: i?.getAttribute("onclick")?.split("'")?.at(1) || q("a", i)?.href
		})),
		decrypt: (str) => {
			str = atob(str);
			let images = "";
			for (let i = 0, n = str.length; i < n; i++) {
				images += String.fromCharCode(str.charCodeAt(i) ^ "comicreader2024".charCodeAt(i % 15));
			}
			return JSON.parse(images);
		},
		getSrcs: {
			cb: (dom) => {
				let code = findScript("encodedImages", dom);
				let encodedImages = strVar(code, "encodedImages");
				return _this.decrypt(encodedImages);
			}
		}
	}, {
		siteName: (o) => o.url.t,
		homePage: ["https://www.xxiav.com/", "https://www.177pica.com/"],
		sort: "album-hentai",
		url: {
			t: ["XXIAV寫真館", "177漫畫", "177漫画"],
			e: "#main>.post>.picture-box>.picture-img>a:last-child"
		},
		getLists: "A",
		getSrcs: {
			target: ".single-content img[data-lazy-src]",
			attr: "data-lazy-src",
			links: (dom, url) => {
				let max = um(".page-links>a", dom);
				return max > 1 ? fn.arr(max - 1, (v, i) => `${url}/${i + 2}/`) : [];
			}
		}
	}, {
		siteName: "Xpicvid逆次元",
		homePage: "https://www.xpicvid.com/",
		sort: "album-hentai",
		url: {
			e: [".footer .pull-left:text:逆次元", ".thumb-overlay-albums>a[href^='/moehome']"],
			eu: ["/moehome-", "/moeupup-", "/showinfo-"]
		},
		getLists: () => al(_this.url.e.at(1)),
		getSrcs: {
			api: (url) => url.replace("moehome", "moeupup"),
			target: ".row.thumb-overlay-albums img,.artwork-container .artwork img",
			attr: "data-src"
		}
	}, {
		siteName: (o) => o.url.t,
		homePage: ["https://www.xxiav.com/", "https://www.177pica.com/"],
		sort: "album-hentai",
		url: {
			t: ["XXIAV寫真館", "177漫畫", "177漫画"],
			e: "#main>.post>.picture-box>.picture-img>a:last-child"
		},
		getLists: "A",
		getSrcs: {
			target: ".single-content img[data-lazy-src]",
			attr: "data-lazy-src",
			links: (dom, url) => {
				let max = um(".page-links>a", dom);
				return max > 1 ? fn.arr(max - 1, (v, i) => `${url}/${i + 2}/`) : [];
			}
		}
	}, {
		siteName: (o) => o.url.t,
		homePage: ["https://www.sexphotos.cc/", "https://www.comic18.cc/"],
		sort: "album-hentai",
		url: {
			t: ["18成人貼圖", "comic18"],
			e: "#index_ajax_list .thumb-srcbox:has(img.waitpic[alt])"
		},
		getLists: "A",
		getSrcs: ".article-body img"
	}, {
		siteName: ["ACG漫画网", "Porn-comic"],
		homePage: ["https://acgmhn.com/", "https://porn-comic.com/"],
		sort: "album-hentai",
		info: "有水印，要求分頁太頻繁會429錯誤",
		url: {
			e: [".footer>a:text:ACG漫画网,.footer>a:text:Porn-comic", "#list a.thumb:has(img[alt]),#list a[title]:has(img[alt])"]
		},
		getLists: () => al(_this.url.e.at(1)),
		getSrcs: {
			target: ".manga-page img,.main-picture img",
			next: "#pages>span+a:not(.a1)",
			delay: 1000
		}
	}, {
		siteName: "松鼠症倉庫",
		homePage: "https://ahri8-2025-08-03-c.monster/dnew.php",
		sort: "hentai",
		url: {
			e: ["#logo a:text:松鼠症倉庫,#logo a:text:松鼠症仓库", "#gallery"],
			ee: ".favorite-comic+a:has(.fa-book)"
		},
		getLists: (s = ".image-info a") => q(["#gallery .isotope-item:has(.image-info)"]).map(i => ({
			cover: q("img", i).dataset.src,
			text: q(s, i).text,
			url: q(s, i).href
		})),
		getSrcs: {
			api: (url) => `/readOnline2.php?ID=${fn.getUSP("ID", url)}&host_id=0`,
			cb: (dom) => {
				let code = findScript("Original_Image_List", dom);
				let HTTP_IMAGE = strVar(code, "HTTP_IMAGE")
				let Original_Image_List = strToArray(code, "Original_Image_List")
				return Original_Image_List.map(e => HTTP_IMAGE + e.new_filename + "_w1500." + e.extension);
			}
		}
	}, {
		siteName: "Caitlin.top",
		homePage: "https://caitlin.top/index.php?route=comic/list",
		sort: "hentai",
		url: {
			h: ["caitlin.top"],
			e: "#gallery",
			ee: ".favorite-comic+a:has(.fa-book)"
		},
		getLists: (s = ".image-info a") => q(["#gallery .isotope-item:has(.image-info)"]).map(i => ({
			cover: q("img", i).dataset.src,
			text: q(s, i).text,
			url: q(s, i).href
		})),
		getSrcs: {
			api: (url) => `/index.php?route=comic/readOnline&comic_id=${fn.getUSP("comic_id", url)}&host_id=0`,
			cb: (dom) => {
				let code = findScript("Image_List", dom);
				let Image_List = strToArray(code, "Image_List = [{");
				let IMAGE_SERVER = strToObject(code, "IMAGE_SERVER");
				let image_server_id = numVar(code, "image_server_id");
				let IMAGE_FOLDER = strVar(code, "IMAGE_FOLDER");
				let counter = 0;
				let srcArr = [];
				for (let Image of Image_List) {
					let ext = fn.ex(Image.extension.toLowerCase());
					let src = IMAGE_SERVER[image_server_id][counter] + IMAGE_FOLDER + Image.sort + "." + ext;
					srcArr.push(src);
					counter += 1;
					if (counter >= Object.keys(IMAGE_SERVER[image_server_id]).length) {
						counter = 0;
					}
				}
				return srcArr;
			}
		}
	}, {
		siteName: "18H",
		homePage: "https://18h.mm-cg.com/zh/",
		sort: "hentai",
		url: {
			h: ["18h.mm-cg.com"],
			e: ".posts>.post>a:has(img.thumb)",
			eu: "/18H_content/"
		},
		getLists: () => q([_this.url.e]).map(a => ({
			cover: q("img", a).src,
			text: q("h3>a", c(".post", a)).innerText,
			url: a.href
		})),
		getSrcs: {
			cb: (dom) => {
				let code = findScript("Large_cgurl", dom);
				return code.split('"').filter(e => e.startsWith("http"));
			}
		}
	}, {
		siteName: "淫漫画",
		homePage: "https://www.yinmh.com/new.html",
		sort: "hentai",
		url: {
			t: "淫漫画",
			e: ["input[placeholder$='淫漫画']", ".list_box a[title]"]
		},
		getLists: () => al(_this.url.e.at(1)),
		getSrcs: {
			target: ".left>.image img.lazy",
			attr: "img"
		}
	}, {
		siteName: "18H汉化漫画",
		homePage: "https://18manga.top/",
		sort: "hentai",
		url: {
			t: "18H汉化漫画",
			e: "#posts>.post>.img>a:has(img.thumb)"
		},
		getLists: () => q([_this.url.e]).map(a => ({
			cover: q("img", a).dataset?.src || q("img", a).src,
			text: q("h3>a", c(".post", a)).innerText,
			url: a.href
		})),
		getSrcs: {
			cb: (dom) => {
				let [max] = q("#td-Act+#td-Series", dom).innerText.match(/\d+/);
				let [, dir, , ex] = q("#content-id a", dom).href.match(/^(.+\/)(\d+)(\.\w+)$/);
				return fn.arr(max, (v, i) => dir + (i + 1) + ex);
			}
		}
	}, {
		siteName: "欲漫乐园",
		homePage: "https://www.sexacg.xyz/",
		sort: "hentai",
		url: {
			t: "欲漫乐园",
			e: ".hl-vod-list>.hl-list-item>a[title][data-original]"
		},
		getLists: () => q([_this.url.e]).map(a => ({
			cover: a.dataset.original,
			text: a.title,
			url: a.href
		})),
		getSrcs: {
			api: (url) => `/vodplay-${url.match(/\d+/).at(0)}-1-1/`,
			cb: (dom) => {
				let code = findScript("imglist_string", dom);
				let str = strSlicer(code, "imglist_string = '", '"}]');
				return fn.run(str).map(e => e.url);
			}
		}
	}, {
		siteName: (o) => o.url.t,
		homePage: ["https://naluhd.com/", "https://www.yojila.com/", "https://www.hakuk.com/", "https://www.duteya.com/"],
		sort: "hentai",
		url: {
			t: ["那露漫画", "勇吉拉漫画", "汉库克漫画", "杜牙漫画"],
			e: "posts.posts-item a:has(img[alt][data-src])"
		},
		getLists: () => q(["posts.posts-item"]).map(t => ({
			cover: q("img", t).dataset?.src || q("img", t).src,
			text: q("h2>a", t).text,
			url: q("a", t).href
		})),
		getSrcs: {
			target: ".article-content img",
			attr: "data-src",
			pages: "a.post-page-numbers",
			delay: 1000
		}
	}, {
		siteName: (o) => o.url.t,
		homePage: ["https://www.wgada.com/", "https://1zse.com/", "https://www.bulota.com/", "https://hatazi.com/"],
		sort: "hentai",
		url: {
			t: ["哇嘎哒漫画", "一之涩漫画", "布罗塔漫画", "哈塔兹漫画"],
			e: "#post_container>.post a[title]:has(img[alt])"
		},
		getLists: "A",
		getSrcs: {
			target: "#post_content img",
			links: (dom, url) => {
				let max = um(".pagelist>a,.wp-pagenavi>.pages~a", dom);
				return max > 1 ? fn.arr(max - 1, (v, i) => `${url}/${i + 2}`) : [];
			},
			delay: 1000
		}
	}, {
		siteName: "ACG糖漫画网",
		homePage: "https://acgotang.com/",
		sort: "hentai",
		url: {
			e: [".footer>a:text:ACG糖", ".con-list a.thumb:has(img[alt]),.con-list a[title]:has(img[alt])"]
		},
		getLists: () => al(_this.url.e.at(1)),
		getSrcs: {
			target: ".manga-picture img",
			next: "#pages>span+a:not(.a1)",
			delay: 1000
		}
	}, {
		siteName: "nhentai",
		homePage: "https://nhentai.net/",
		sort: "hentai",
		info: "可以在選項選圖片伺服器，auto會隨機抽取image_cdn_urls的其中一個，逮著一個伺服器操好像會限速。",
		url: {
			h: ["nhentai.net"],
			e: ".gallery",
			ee: "#info-block"
		},
		getLists: () => q([".gallery"]).map(g => ({
			cover: q("img", g).dataset?.src || q("img", g).src,
			text: q(".caption", g).innerText,
			url: q(".cover", g).href
		})),
		getSrcs: {
			cb: (dom) => {
				let code = findScript("window._gallery", dom);
				let a = code.indexOf("JSON");
				let b = code.lastIndexOf(";");
				code = code.slice(a, b);
				let _gallery = fn.run(code);
				code = findScript("image_cdn_urls", dom);
				let image_cdn_urls = strToArray(code, "image_cdn_urls");
				let serv = config.nhentaiServ == "auto" ? arrayOne(image_cdn_urls) : config.nhentaiServ;
				return _gallery.images.pages.map((e, i) => `https://${serv}/galleries/${_gallery.media_id}/${i + 1}.${fn.ex(e.t)}`);
			}
		}
	}, {
		siteName: ["E-Hentai", "ExHentai", "ExHentai鏡像"],
		homePage: ["https://e-hentai.org/", "https://exhentai.org/", "https://ex.fangliding.eu.org/"],
		sort: "hentai",
		info: "1章強制1圖，要求1分頁便下載1張圖，一次性拿完圖片網址再下載的方式，太容易被封IP了，要求下一頁和下載圖片沿用單章單圖間隔，建議至少1，章線程最多2~3比較不會被封",
		url: {
			t: ["E-Hentai", "ExHentai.org"],
			e: [".itg.gltm,.itg.gltc,.itg.glte,.itg.gld", "a:has(.glink)"]
		},
		single: "yes",
		getLists: () => {
			let mini = q(".itg.gltm,.itg.gltc");
			let ex = q(".itg.glte");
			let th = q(".itg.gld");
			return q(["a:has(.glink)"], mini || ex || th).map(a => {
				let node = c("tr", a) || c(".gl1t", a);
				let img = q(".glthumb img", node) || q("img", node);
				return {
					cover: img.dataset?.src || img.src,
					text: a.text,
					url: a.href
				}
			});
		},
		getSrcs: (url, item) => ajax.doc(url).then(dom => ajax.next(url, item, dom, {
			target: "#gdt>a",
			next: ".ptds+td>a",
			delay: Number(config.singleThreadInterval) * 1000
		}).then(pages => ajax.single(url, item, {
			pages,
			target: "#img",
			single: true,
			delay: Number(config.singleThreadInterval) * 1000
		})))
	}, {
		siteName: "Hitomi.la",
		homePage: "https://hitomi.la/",
		sort: "hentai",
		info: "圖片伺服器經常出現503錯誤不耐操，建議線程設定1章2圖10重試6間隔。",
		url: {
			h: ["hitomi.la"],
			e: ".gallery-content",
			ee: "#read-online-button"
		},
		waitEle: ".dj-img-cont",
		getLists: (s = "h1.lillie>a") => q([".gallery-content>div"]).map(e => ({
			cover: q("img", e).dataset.src,
			text: q(s, e).text,
			url: q(s, e).href
		})),
		getSrcs: (url) => fn.iframeVar(`/reader/${url.match(/\d+/g).at(-1)}.html`, "galleryinfo").then(frame => {
			const {
				galleryinfo,
				url_from_url_from_hash,
				our_galleryinfo
			} = frame;
			return galleryinfo.files.map((e, i) => url_from_url_from_hash(galleryinfo.id, our_galleryinfo[i], config.hitomiImgType));
		})
	}, {
		siteName: "Roku Hentai",
		homePage: "https://rokuhentai.com/",
		sort: "hentai",
		info: "經常出現404/429錯誤不耐操，建議線程設定1章1圖10重試6間隔。",
		url: {
			h: ["rokuhentai.com"],
			e: ".mdc-button__label:text:Details"
		},
		getLists: () => q([".mdc-card>a.site-popunder-ad-slot"]).map(a => {
			let text = String(q(".site-manga-card__title--primary", a)?.innerText);
			if (text.charCodeAt() == 55356) {
				text = text.slice(5);
			}
			return {
				cover: fn.getBackgroundImage(q(".mdc-card__media", a)),
				text,
				url: a.href
			}
		}),
		getSrcs: {
			target: ".site-reader__image",
			attr: "data-src"
		}
	}, {
		siteName: ["IMHentai", "nhentai.xxx", "HentaiRox", "HentaiEra", "HentaiZap", "HentaiEnvy", "HentaiFox", "Comic Porn XXX", "AsmHentai", "HentaiClap"],
		homePage: (o) => o.url.h.map(h => `https://${h}/`),
		sort: "hentai",
		url: {
			h: ["imhentai.xxx", "nhentai.xxx", "hentairox.com", "hentaiera.com", "hentaizap.com", "hentaienvy.com", "hentaifox.com", "comicporn.xxx", "asmhentai.com", "hentaiclap.com"],
			e: ".galleries .thumb,.lc_galleries .thumb,.galleries_container .thumb,.ov_item .thumb,.tag_gl .thumb,.box_thumbs .thumb,.ov_item .preview_item,.gallery_item",
			ee: [".gallery_top a:text:Read Online", ".book_page", ".gallery_top>.cover+.info", ".gallery_first"]
		},
		getLists: () => q([_this.url.e]).map(t => {
			let img = q(".inner_thumb img,.th_img img,.image img", t) || q("img", t);
			let cover = img.dataset?.src || img.src;
			let a = q(".gallery_title a,.caption a,a:has(>.caption)", t) || q("a[title]", t) || t.lastElementChild;
			return {
				cover,
				text: a.title || a.text,
				url: a.href
			}
		}),
		getSrcs: (url) => {
			let [gid] = url.match(/\d+/);
			let readUrl = `/view/${gid}/1/`;
			if (["nhentai.xxx", "hentaizap.com", "hentaienvy.com", "hentaifox.com"].some(h => location.host == h)) {
				readUrl = `/g/${gid}/1/`;
			}
			if (location.host == "hentaiclap.com") {
				readUrl = `/read/${gid}/1/`;
			}
			return ajax.doc(url).then(ajax.hentai_t).then(async thumbs => {
				if (location.host == "asmhentai.com") {
					return thumbs.map(t => fn.rs(t.dataset.src, [
						[/-\d+x\d+\./, "."],
						["t.", "."]
					]));
				}
				let src = thumbs.at(0).dataset.src;
				let dir = fn.dir(src);
				let code = await ajax.code(readUrl, "g_th");
				if (location.host == "nhentai.xxx") {
					return Object.entries(strToObject(code, "g_th", 1, 1).fl).map(([i, v]) => `${dir}${i}.${fn.ex(v.split(",").at(0))}`);
				}
				return Object.entries(strToObject(code, "g_th")).map(([i, v]) => `${dir}${i}.${fn.ex(v.split(",").at(0))}`);
			});
		}
	}, {
		siteName: ["Hentai.name"],
		homePage: ["https://www.hentai.name/new/"],
		sort: "hentai",
		url: {
			h: ["www.hentai.name"],
			e: ".gallery",
			ee: "#info-block"
		},
		getLists: () => q([".gallery"]).map(g => ({
			cover: q("img", g).dataset?.src || q("img", g).src,
			text: q(".caption", g).innerText,
			url: q(".cover", g).href
		})),
		getSrcs: {
			target: ".thumb-container img",
			rs: [/_thumb(\.\w+)$/, "$1"]
		}
	}, {
		siteName: ["Fhentai"],
		homePage: ["https://fhentai.net/"],
		sort: "hentai",
		url: {
			h: ["fhentai.net"],
			e: "#trending article a:has(img),#new-upload article a:has(img)"
		},
		getLists: () => q([_this.url.e]).map(a => ({
			cover: q("img", a).dataset?.src || q("img", a).src,
			text: q("h3", a.closest("article")).innerText,
			url: a.href
		})),
		getSrcs: {
			target: ".rounded-md:has(>.grid) img",
			attr: "data-src",
			rs: ["/thumb/", "/raw/"]
		}
	}, {
		siteName: ["HentaiHand", "nHentai"],
		homePage: ["https://hentaihand.com/en/latest", "https://nhentai.com/en/latest"],
		sort: "hentai",
		url: {
			h: ["nhentai.com", "hentaihand.com"]
		},
		spa: true,
		page: () => !lp(/\/xxx$|\/tags$|\/groups$|\/parodies$|\/characters$|\/artists$|\/comic\//),
		observeURL: "head",
		waitEle: "#filter+.row:has(.comic-details),.filters+.row:has(.comic-details)",
		getLists: () => q(["#filter+.row a,.filters+.row a"]).map(a => ({
			cover: fn.getBackgroundImage(q(".image", a)),
			text: q("h6", a).title,
			url: a.href
		})),
		getSrcs: (url) => {
			let comic = url.split("/").at(-1);
			let csrfToken = q("meta[name='csrf-token']").content;
			let xsrfToken = fn.cookie("XSRF-TOKEN");
			return ajax.json(`/api/comics/${comic}/images`, {
				headers: {
					"x-csrf-token": csrfToken,
					"x-requested-with": "XMLHttpRequest",
					"x-xsrf-token": xsrfToken
				}
			}).then(json => json.images.map(e => e.source_url));
		}
	}, {
		siteName: ["HentaiPaw", "エロ漫画SHOW", "Hentai-One", "Hentai-One en", "Hentai-One ch", "Hentai-One kr"],
		homePage: ["https://hentaipaw.com/", "https://eromanga-show.com/", "https://hentai-one.com/", "https://en.hentai-one.com/", "https://ch.hentai-one.com/", "https://kr.hentai-one.com/"],
		sort: "hentai",
		url: {
			h: [/^([a-z]{2}\.)?hentaipaw\.com$/, "eromanga-show.com", /^([a-z]{2}\.)?hentai-one\.com$/]
		},
		s: ".container>.grid>a:has(img[alt])",
		spa: true,
		page: () => !lp(/\/articles\/\d+$|\/tags$|\/parodies$|\/characters$|\/artists$|\/groups$/),
		getLists: () => q([_this.s]).map(a => ({
			cover: q("img", a).src,
			text: q("div[title]", a).title,
			url: a.href
		})),
		getSrcs: {
			api: (url) => `/viewer?articleId=${url.split("/").at(-1)}&page=1`,
			cb: (dom) => {
				let code = __next_f(dom);
				return strToArray(code, '"slides":').map(e => e.src);
			}
		}
	}, {
		siteName: ["3Hentai", "HentaiVox"],
		homePage: ["https://3hentai.net/", "https://hentaivox.com/"],
		sort: "hentai",
		url: {
			h: [/^(\w{2}\.)?3hentai\.net$/, "hentaivox.com"],
			e: ".listing-container,.listing-galleries-container",
			eu: ["/d/", "/view/"],
		},
		getLists: (ma = ".listing-container a.cover:has(img[data-src])", mb = ".listing-galleries-container>.gallery-wrapper .gallery-thumb:has(img[data-src])") => q(ma) ? q([ma]).map(a => ({
			cover: q("img", a).dataset.src,
			text: q(".title", a).innerText,
			url: a.href
		})) : q([mb]).map(a => ({
			cover: q("img", a).dataset.src,
			text: q("a", a.nextElementSibling).innerText,
			url: a.href
		})),
		getSrcs: {
			api: (url) => url + "/1",
			cb: (dom) => {
				let code = findScript("readerPages", dom);
				let jsonCode = strSlicer(code, "readerPages =", "))");
				let json = fn.run(jsonCode);
				let max = json.lastPage;
				let dir = json.baseUriImg.replace("%s", "");
				return fn.arr(max, (v, i) => dir + json.pages[(i + 1)].f);
			}
		}
	}, {
		siteName: "9hentai",
		homePage: "https://9hentai.so/",
		sort: "hentai",
		url: {
			h: ["9hentai.so"],
			eu: ["/g/", "/c/", "/about/", "/tv/"]
		},
		waitEle: "a[title]:has(img[data-src]):has(.book-description)",
		getLists: () => q([_this.waitEle]).map(a => ({
			cover: q("img", a).dataset?.src || q("img", a).src,
			text: q("p", a).innerText,
			url: a.href
		})),
		getSrcs: (url) => {
			let id = url.split("/").at(-2);
			return ajax.json("/api/getBookByID", {
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					id
				}),
				method: "POST"
			}).then(json => {
				let {
					total_page,
					image_server
				} = json.results;
				return fn.arr(total_page, (v, i) => image_server + id + "/" + (i + 1) + ".jpg");
			});
		}
	}, {
		siteName: "HentaiForce",
		homePage: "https://hentaiforce.net/",
		sort: "hentai",
		url: {
			h: ["hentaiforce.net"],
			e: ".listing-galleries-container>.gallery-wrapper .gallery-thumb:has(img[data-src])"
		},
		getLists: () => q([_this.url.e]).map(a => ({
			cover: q("img", a).dataset?.src || q("img", a).src,
			text: q("a", a.nextElementSibling).innerText,
			url: a.href
		})),
		getSrcs: {
			api: (url) => url + "/1",
			cb: (dom) => {
				let code = findScript("readerPages", dom);
				let s = code.indexOf("JSON");
				let e = code.lastIndexOf(";");
				let json = fn.run(code.slice(s, e));
				return fn.arr(json.lastPage).map((v, i) => json.baseUriImg.replace("%c", json.pages[i + 1].l).replace('%s', json.pages[i + 1].f));
			}
		}
	}, {
		siteName: "HentaiRead",
		homePage: "https://hentairead.com/hentai/",
		sort: "hentai",
		url: {
			h: ["hentairead.com"],
			e: ".manga-grid>.manga-item:has(h3>a)",
			ee: "#mangaRating+a:has(svg)"
		},
		getLists: () => {
			let items = q([_this.url.e]);
			if (q(".quick-search-active")) {
				items = q(["#searchMangaResults .manga-grid>.manga-item:has(h3>a)"]);
			}
			return items.map(i => ({
				cover: q("img", i).src,
				text: q("h3>a", i).innerText,
				url: q("h3>a", i).href
			}));
		},
		getSrcs: {
			target: ".chapter-image-item img",
			rs: [
				["hencover.xyz", "henread.xyz"],
				["preview/", ""]
			]
		}
	}, {
		siteName: "Pururin",
		homePage: "https://pururin.me/",
		sort: "hentai",
		url: {
			h: ["pururin.me"],
			e: ".row-gallery>a.card-gallery:has(img[alt])",
			eu: "/gallery/"
		},
		getLists: "A",
		getSrcs: {
			api: (url) => {
				let s = url.split("/");
				return `/read/${s.at(-2)}/01/${s.at(-1)}`;
			},
			cb: (dom) => {
				let ele = q(".img-viewer", dom);
				let svr = ele.dataset.svr;
				let data = JSON.parse(ele.dataset.img);
				return data.images.sort((a, b) => a.page - b.page).map(e => svr + "/" + data.directory + "/" + e.filename);
			}
		}
	}, {
		siteName: "HentaiNexus",
		homePage: "https://hentainexus.com/",
		sort: "hentai",
		url: {
			h: ["hentainexus.com"],
			e: ".columns>.column>a:has(.card-header-title):has(.card-image)"
		},
		getLists: () => q([_this.url.e]).map(a => ({
			cover: q("img", a).src,
			text: q("p", a).innerText,
			url: a.href
		})),
		getSrcs: (url) => {
			url = /read/ + url.split("/").at(-1);
			return fn.iframe(url, {
				wait: (_, frame) => isArray(frame?.pageData),
			}).then(({
				frame
			}) => frame.pageData.map(e => e.image));
		}
	}, {
		siteName: "HentaiFC",
		homePage: "https://hentaifc.com/",
		sort: "hentai",
		url: {
			h: ["hentaifc.com"],
			e: "#book_list .item:has(a img[data-src])"
		},
		getLists: () => q([_this.url.e]).map(i => ({
			cover: q("img", i).dataset?.src || q("img", i).src,
			text: q(".text>h3>a", i).text,
			url: q("a", i).href
		})),
		getSrcs: (url) => {
			url = url + "/c0#page1";
			return fn.iframe(url, {
				hide: true,
				wait: (_, frame) => {
					if (isArray(frame?.ytaw)) {
						let [e] = frame.ytaw;
						if (e?.startsWith("http")) return true;
					}
					return false;
				}
			}).then(({
				frame
			}) => frame?.ytaw || []);
		}
	}, {
		siteName: "TMOHentai",
		homePage: "https://tmohentai.com/",
		sort: "hentai",
		url: {
			h: ["tmohentai.com"],
			e: ".element-thumbnail .type-info+a:has(img[alt]),.table-responsive tr[data-title]",
			eu: ["/contents/"]
		},
		getLists: () => {
			if (ls("view=list")) {
				return q([_this.url.e]).map(t => ({
					cover: q("img", fn.html(t.dataset.content)).src,
					text: t.dataset.title,
					url: q("a", t).href
				}));
			}
			return al(_this.url.e);
		},
		getSrcs: (url) => {
			let s = "div[style*='background']";
			return fn.iframeDoc(url, s).then(dom => {
				let div = q(s, dom);
				let [, src] = div.style.background.split('"');
				let dir = fn.dir(src);
				let max = q([s], dom).length;
				return fn.arr(max, (v, i) => dir + String(i).padStart(3, "0") + ".webp");
			});
		}
	}, {
		siteName: "EAHentai",
		homePage: "https://eahentai.com/home",
		sort: "hentai",
		url: {
			h: ["eahentai.com"],
		},
		spa: true,
		page: () => !lp(/\/a\/|\/characters$|\/parodies$|\/about$/),
		observeURL: "head",
		waitEle: ".gallery-container>.gallery>a:has(img[alt])",
		getLists: () => q([_this.waitEle]).map(a => ({
			cover: q("img", a).src,
			text: q("img", a).alt,
			url: a.href
		})),
		getSrcs: (url) => ajax.json(`/api/image/album/${url.split("/").at(-1)}`).then(json => json[0].images.map(e => "https://i.eahentai.com/file/ea-gallery/" + e.imageUri))
	}, {
		siteName: ["HenTalk", "cc"],
		homePage: ["https://hentalk.pw/", "https://fakku.cc/"],
		sort: "hentai",
		url: {
			h: ["hentalk.pw", "fakku.cc"],
		},
		spa: true,
		page: () => !lp(/\/g\/|\/preferences$/),
		observeURL: "head",
		waitEle: ".grid>.group>a:has(img[alt])",
		getLists: () => q([_this.waitEle]).map(a => ({
			cover: q("img", a).src,
			text: fn.rs(q("img", a).alt, [
				[/^'/, ""],
				[/' cover$/, ""]
			]),
			url: a.href
		})),
		getSrcs: (url) => ajax.json(`${url}/__data.json?x-sveltekit-trailing-slash=1&x-sveltekit-invalidated=001`, {
			referrer: url
		}).then(json => {
			let data = json.nodes[2].data;
			let gallery = data?.[data.find((e) => e?.gallery)?.gallery];
			let slug = data?.[gallery?.hash] || data?.[data.find((e) => e?.hash && e?.id).hash];
			let images = data?.[gallery.images].map((i) => data[i]).map((i) => data[i.filename]);
			return images.map(e => `https://hentalk.pw/image/${slug}/${e}`);
		})
	}, {
		siteName: "Doujins.com",
		homePage: "https://doujins.com/",
		sort: "hentai",
		url: () => {
			if (location.host != "doujins.com") return false;
			return lp(/^\/$|^\/artists\/|^\/top$/) || !lp(/^\/blog/) && ls(/\?x=\d+$/) || ls("words=");
		},
		waitEle: ".thumbnail-doujin>a:has(img)",
		getLists: () => q([_this.waitEle]).map(a => ({
			cover: q("img", a).src,
			text: q(".text", a).innerText,
			url: a.href
		})),
		getSrcs: {
			target: ".swiper-lazy",
			attr: "data-src"
		}
	}, {
		siteName: "HentaiCamp",
		homePage: "https://hentaicamp.com/",
		sort: "hentai",
		url: {
			h: ["hentaicamp.com"]
		},
		spa: true,
		page: () => !lp(/\/hc\/|\/tags$|\/artists$|\/groups$|\/parodies$|\/characters$|\/about$|\/login$/),
		observeURL: "head",
		waitEle: ".new-manga a:has(img[alt])",
		getLists: () => al(".new-manga a:has(img[alt])"),
		getSrcs: (url) => ajax.json(`https://api.hentaicamp.com/api/hc/${url.split("/").at(-1)}/load-more-images?show_all=true`).then(json => json.images.map(e => "https://api.hentaicamp.com/storage/" + e.image_path)),
		hide: "div.fixed"
	}, {
		siteName: "Hentaiser",
		homePage: "https://app.hentaiser.com/",
		sort: "hentai",
		url: {
			h: ["app.hentaiser.com"]
		},
		spa: true,
		page: () => !lp("/book/"),
		observeURL: "head",
		waitEle: "#btBooks,#paginator",
		getLists: () => q(["#booksLatest>.thumb-book,#gridContent .thumb-book"]).map(t => ({
			cover: q("img", t).src,
			text: q(".thumb-book__title", t).innerText,
			url: `/book/${t.dataset.bkGid}`
		})),
		getSrcs: (url) => ajax.json(`https://api.hentaiser.com/1.3/books/${url.split("/").at(-1)}/pages`).then(json => {
			let {
				host,
				pages
			} = json;
			return pages.map(e => host + e);
		})
	}, {
		siteName: (o) => o.url.t,
		homePage: ["https://iimhw.com/", "https://mhmao.com/", "https://mhjia.com/", "https://mhxia.com/", "https://ssmhw.com/"],
		sort: "ero-comic",
		comicName: ".title-list~div .title",
		cover: ".books>.book>img",
		url: {
			t: ["爱漫画网", "漫画猫", "漫画家", "漫画侠", "搜搜漫画网"],
			e: "#list-chapter .list-chapter a"
		},
		nextPage: ["#list-chapter .list-chapter>li", ".pagination>li:nth-last-of-type(2)>a[href]:text:Next", {
			pag: ".pagination"
		}],
		getLists: () => {
			let cos = q(".breadcrumb-container a[title=Cosplay]");
			let one = q(".breadcrumb-container a[title=短篇]");
			let name = q(_this.comicName).textContent;
			return cl(_this.url.e, {
				cb: ({
					text
				}) => {
					if (name == text || cos || one) {
						comicName = "";
						text = name;
					} else if (text.includes(name)) {
						text = `第${text.match(/[\d.]+/)?.at(0)}话`;
					} else {
						text = fn.rs(text, /\s+([\d\.]+)\s+/, "$1");
					}
					return {
						text
					}
				}
			});
		},
		getSrcs: {
			target: ".chapter-content .comic_img",
			attr: "data-original",
			eSrc: ["?"]
		}
	}, {
		siteName: "韩漫屋",
		homePage: "https://www.hmw5.com/",
		sort: "ero-comic",
		comicName: ".book_info h1",
		cover: ".book_info .img-thumbnail ",
		url: {
			t: "韩漫屋",
			p: "/comic",
			e: "#chapterlist+.book_list a"
		},
		nextPage: ["#chapterlist+.book_list>.row>li", ".pagination>li:nth-last-of-type(2)>a[href]:text:Next", {
			pag: ".pagination"
		}],
		getLists: () => {
			let cos = x("//div[@class='title']/a[text()='Cosplay']");
			let one = x("//div[@class='title']/a[text()='短篇']");
			let name = q(_this.comicName).textContent;
			return cl(_this.url.e, {
				cb: ({
					text
				}) => {
					if (name == text || cos || one) {
						comicName = "";
						text = name;
					} else if (text.includes(name)) {
						text = `第${text.match(/[\d.]+/)?.at(0)}话`;
					} else {
						text = fn.rs(text, /\s+([\d\.]+)\s+/, "$1");
					}
					return {
						text
					}
				}
			});
		},
		getSrcs: {
			target: ".font_max>img",
			attr: "data-original",
			eSrc: ["?"]
		}
	}, {
		siteName: "Ninekon",
		homePage: "https://app.ninekon.com/",
		sort: "ero-comic",
		url: {
			h: ["app.ninekon.com"]
		},
		spa: true,
		page: () => lp("/book/") && lp(3),
		observeURL: "nav",
		getLists: () => {
			let mid = lpsa();
			return ajax.json(`https://api.ninekon.com/1.0/books/${mid}`).then(json => {
				comicName = json.title;
				return json.chapters.map(({
					gid,
					ordinal
				}) => ({
					mid,
					cid: gid,
					cover: json.host + json.cover,
					text: `Chapter ${ordinal}`,
					url: `/book/${mid}/chapter/${gid}/pages`
				}));
			});
		},
		getSrcs: (url, item) => {
			let {
				mid,
				cid
			} = item.dataset;
			return ajax.json(`https://api.ninekon.com/1.0/books/${mid}/chapters/${cid}/pages`).then(json => {
				let {
					host,
					pages
				} = json;
				return pages.map(e => host + e);
			});
		}
	}, {
		siteName: "WebtoonRaw",
		homePage: "https://webtoonraw.com/",
		sort: "ero-comic",
		comicName: ".detail_name>h1",
		cover: ".detail_avatar>img",
		url: {
			h: ["webtoonraw.com"],
			p: "/manhwa/"
		},
		getLists: () => cl(".detail_chapterContent .chapter_num>a", {
			sort: "r"
		}),
		getSrcs: {
			cb: (dom) => {
				let code = findScript("slides_p_path", dom);
				return strToArray(code, "slides_p_path").map(p => atob(p));
			}
		}
	}, {
		siteName: "akuma.moe",
		homePage: "https://akuma.moe/",
		sort: "hentai",
		url: {
			h: ["akuma.moe"],
			e: "#posts"
		},
		getLists: (m = "#posts .post-loop .title>a", t = "#posts .post-loop a:has(img[alt])") => q(t) ? q([t]).map(a => ({
			cover: q("img", a).src,
			text: q("img", a).alt,
			url: a.href
		})) : q([m]).map(a => ({
			text: a.text,
			url: a.href
		})),
		getSrcs: {
			cb: (dom, url) => ajax.code(url + "/1", "img_prt").then(code => {
				let img_prt = strVar(code, "img_prt", ",");
				let token = q("meta[name=csrf-token]", dom).content;
				return ajax.json(url, {
					headers: {
						"x-csrf-token": token,
						"x-requested-with": "XMLHttpRequest"
					},
					method: "POST"
				}).then(arr => arr.map(e => img_prt + "/" + e));
			})
		}
	}, {
		siteName: "Yabai!",
		homePage: "https://yabai.si/g",
		sort: "hentai",
		url: {
			h: ["yabai.si"]
		},
		spa: true,
		page: () => lp() == "/g",
		waitEle: "#gallery-filter+ul a:has(img[alt])",
		getLists: () => q([_this.waitEle]).map(a => ({
			cover: q("img", a).src,
			text: q("img", a).alt,
			url: a.href
		})),
		getSrcs: {
			cb: (dom, url) => {
				let pageData = JSON.parse(q("#app", dom).dataset.page);
				let {
					version
				} = pageData;
				let token = decodeURIComponent(fn.cookie("XSRF-TOKEN"));
				let readApi = url + "/read";
				return ajax.json(readApi, {
					headers: {
						"x-inertia": "true",
						"x-inertia-version": version,
						"x-requested-with": "XMLHttpRequest",
						"x-xsrf-token": token
					}
				}).then(json => {
					let {
						code,
						hash,
						head,
						rand,
						root,
						type
					} = json.props.pages.data.list;
					let srcs = [];
					for (let [i, e] of head.entries()) srcs[Number(e) - 1] = `${root}/${code}/${e.padStart(4, "0")}-${hash[i]}-${rand[i]}.${type[i]}`;
					return srcs;
				});
			}
		},
		referer: "url"
	}, {
		siteName: ["Nyahentai", "MoeImg", "Hitomi", "HitomiJP", "HitomiKR"],
		homePage: (o) => o.url.h.map(h => `https://${h}/`),
		sort: "hentai",
		url: {
			h: ["nyaa.fan", "moeimg.fan", "hitomi.si", "hitomi.jp.net", "hitomikr.org"]
		},
		spa: true,
		page: () => ["/post/", "/reader/", "/history", "/comments"].every(p => !lp(p)),
		observeURL: "head",
		s: ".manga-list>.m-item .m-img>a:has(img[alt])",
		init: () => _this.page() ? fn.waitEle(_this.s) : void 0,
		getLists: () => al(_this.s),
		getSrcs: (url) => ajax.json(`/spa/manga/${url.match(/\d+$/).at(0)}/read`).then(json => {
			let {
				chapter_detail: {
					server,
					chapter_content
				},
			} = json;
			let temp = fn.html(chapter_content);
			return q([".chapter-img canvas[data-srcset],.chapter-img img[data-url]"], temp).map(e => server + (e.dataset.srcset || e.dataset.url));
		})
	}, {
		siteName: "拷貝漫畫",
		homePage: "https://www.mangacopy.com/",
		sort: "comic",
		comicName: ".comicParticulars-title-right h6",
		cover: ".comicParticulars-left-img img",
		url: {
			t: ["拷貝漫畫", "拷贝漫画"],
			p: "/comic/",
			e: ["#dnt[value]", ".comicParticulars-title"]
		},
		decrypt: async (raw, key) => {
			const encoder = new TextEncoder();
			const decoder = new TextDecoder();
			const dioKey = encoder.encode(key);
			const header = raw.substring(0, 16);
			const body = raw.substring(16);
			const iv = encoder.encode(header);
			const bodyBytes = new Uint8Array(body.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));
			const cryptoKey = await crypto.subtle.importKey("raw", dioKey, {
				name: "AES-CBC"
			}, false, ["decrypt"]);
			const decryptedBytes = await crypto.subtle.decrypt({
				name: "AES-CBC",
				iv
			}, cryptoKey, bodyBytes);
			return JSON.parse(await decoder.decode(decryptedBytes));
		},
		getLists: () => {
			let mid = lpsa(2);
			let cover = q(_this.cover).dataset.src;
			let code = findScript("#dnt");
			let key = code.split("'").at(1);
			return ajax.json(`/comicdetail/${mid}/chapters`, {
				headers: {
					dnts: q("#dnt").getAttribute("value")
				}
			}).then(json => _this.decrypt(json.results, key)).then(json => json.groups.default.chapters.map(({
				id,
				name
			}) => ({
				cover,
				text: name,
				url: `/comic/${json.build.path_word}/chapter/${id}`
			})));
		},
		getSrcs: {
			cb: (dom) => {
				let code = findScript("contentKey", dom);
				let [, key, , raw] = code.split("'");
				return _this.decrypt(raw, key).then(images => images.map(e => e.url));
			}
		}
	}, {
		siteName: "嗨皮漫画",
		homePage: "https://m.happymh.com/",
		sort: "comic",
		comicName: ".mg-detail .mg-title",
		cover: ".mg-detail mip-img",
		url: {
			h: ["m.happymh.com"],
			p: "/manga/"
		},
		getHeaders: () => ({
			headers: {
				accept: "application/json, text/plain, */*",
				"x-requested-id": new Date().getTime(),
				"x-requested-with": "XMLHttpRequest"
			}
		}),
		getLists: async () => {
			let cover = q(_this.cover).getAttribute("src");
			let page = 1;
			let code = lpsa(2);
			let chapterListData = [];
			const get = () => {
				let params = new URLSearchParams({
					code,
					page,
					order: "desc"
				}).toString();
				updateText(listMessage, "Page" + page);
				return ajax.json("/v2.0/apis/manga/chapterByPage?" + params, _this.getHeaders()).then(json => {
					if (json?.msg === "success") {
						chapterListData = chapterListData.concat(json.data.items);
						if (json?.data?.isEnd == 1 || chapterListData.length >= json?.data?.total) {
							chapterListData = chapterListData.reverse();
						} else {
							page++;
							return get();
						}
					}
				});
			};
			await get();
			return chapterListData.map(({
				chapterName,
				id
			}) => ({
				cover,
				text: chapterName,
				mid: code,
				cid: id,
				url: /mangaread/ + code + "/" + id
			}));
		},
		getSrcs: (url, item) => {
			let {
				mid,
				cid
			} = item.dataset;
			let code = url.split("/").at(-1);
			let params = new URLSearchParams({
				code: mid,
				cid,
				v: "v3.1919111"
			}).toString();
			return ajax.json("/v2.0/apis/manga/reading?" + params, {
				referrer: url,
				..._this.getHeaders()
			}).then(json => {
				let srcs = json.data.scans.map(e => e.url.replace(/\?q=\d+$/, ""));
				if (srcs.length == 2 && ("next_cid" in json.data)) {
					srcs = srcs.slice(0, -1);
				}
				if (srcs.length > 2 && ("next_cid" in json.data)) {
					srcs = srcs.slice(0, -2);
				}
				return srcs;
			});
		}
	}, {
		siteName: "包子漫畫",
		homePage: "https://www.baozimh.com/",
		sort: "comic",
		info: "網站爬太狠會封IP一整天，建議單線程間隔0.5秒，要比較符合一般閱讀漫畫的速度。",
		comicName: ".comics-detail__title",
		cover: ".de-info__box amp-img",
		url: {
			t: "包子漫畫",
			p: "/comic/",
			e: ".pure-g:has(.comics-chapters__item)"
		},
		getLists: () => {
			let mid = lpsa(2);
			let cover = q(_this.cover).getAttribute("src");
			let get = (eles) => eles.map(a => ({
				cover,
				text: a.text,
				url: `/comic/chapter/${mid}/0_${fn.getUSP("chapter_slot", a.href)}.html`
			}));
			let eles;
			let node = q("#chapter-items");
			if (node) {
				eles = q(["#chapter-items a,#chapters_other_list a"]);
			} else {
				eles = q([".section-title+.pure-g a"]).reverse();
			}
			return get(eles);
		},
		getSrcs: {
			target: "amp-img[data-src]",
			attr: "data-src",
			//next: "#next-chapter:text:下一頁",
			next: (dom) => {
				let next = q("#next-chapter", dom);
				return next?.text?.includes("下一頁") ? next.pathname : null;
			},
			delay: 1000
		}
	}, {
		siteName: "漫画柜",
		homePage: "https://www.manhuagui.com/",
		sort: "comic",
		info: "圖片伺服器爬太狠會封IP一整天",
		comicName: ".book-title>h1",
		cover: ".hcover>img",
		url: {
			h: "manhuagui",
			p: "/comic/",
			e: ".chapter"
		},
		json: (dom) => {
			let code = findScript('x6c"]', dom);
			let data = fn.parseCode(code);
			let s = data.indexOf("{");
			let e = data.lastIndexOf("}") + 1;
			data = data.slice(s, e);
			return JSON.parse(data);
		},
		getLists: () => {
			let cover = q(_this.cover).src;
			let node = q(".chapter");
			let hideData = q("#__VIEWSTATE");
			if (hideData) {
				node = fn.html(unsafeWindow.LZString.decompressFromBase64(hideData.value));
			}
			return q(["[id^='chapter-list']"], node).reverse().map(list => {
				let uls = q(["ul"], list);
				return uls.map(ul => {
					let lis = q(["li"], ul).reverse();
					return lis.map(li => ({
						cover,
						text: li.firstElementChild.title,
						url: li.firstElementChild.href
					}));
				});
			}).flat(Infinity);
		},
		getSrcs: {
			cb: (dom) => {
				let {
					files,
					path,
					sl: {
						e,
						m
					}
				} = _this.json(dom);
				return files.map(file => `https://${config.manhuaguiImgServ}.hamreus.com${path}${file}?e=${e}&m=${m}`);
			}
		}
	}, {
		siteName: ["G站漫畫", "包子漫畫"],
		homePage: ["https://godamh.com/", "https://baozimh.org/"],
		sort: "comic",
		comicName: "#info h1",
		cover: "#MangaCard img",
		url: {
			t: ["G站漫畫", "包子漫畫"],
			p: "/manga/",
			e: "button[data-mid]"
		},
		getLists: () => {
			let mid = q("button[data-mid]").dataset.mid;
			let mslug = lpsa(2);
			let cover = q(_this.cover).src;
			return ajax.json(`https://api-get-v3.mgsearcher.com/api/manga/get?mid=${mid}&mode=all`, {
				cache: "no-cache"
			}).then(json => json.data.chapters.map(o => {
				let {
					attributes: {
						slug,
						title
					}
				} = o;
				return {
					cover,
					text: title,
					url: `/manga/${mslug}/${slug}`
				}
			}));
		},
		getSrcs: {
			cb: (dom) => {
				let data = q("#chapterContent", dom);
				let ms = data.dataset.ms;
				let cs = data.dataset.cs;
				return ajax.json(`https://api-get-v3.mgsearcher.com/api/chapter/getinfo?m=${ms}&c=${cs}`, {
					cache: "no-cache"
				}).then(json => {
					let {
						line,
						images
					} = json.data.info.images;
					let host = line === 2 ? "https://f40-1-4.g-mh.online" : "https://t40-1-4.g-mh.online";
					return images.map(e => host + e.url);
				});
			}
		}
	}, {
		siteName: ["动漫屋", "极速漫画"],
		homePage: ["https://www.dm5.com/", "https://www.1kkk.com/"],
		sort: "comic",
		comicName: ".info .title",
		cover: ".cover>img",
		url: {
			t: ["动漫屋", "极速漫画"],
			e: ".detail-list-title"
		},
		getLists: () => cl(".view-win-list a", {
			sort: "r"
		}),
		getSrcs: (url) => ajax.mdoc(url).then(dom => {
			let code = findScript("newImgs", dom);
			let str = fn.parseCode(code);
			return strToArray(str, "newImgs");
		}),
		referer: "url"
	}, {
		siteName: ["Mangabz", "Xmanhua", "yymanhua"],
		homePage: (o) => o.siteName.map(s => `https://www.${s.toLowerCase()}.com/manga-list-0-0-2/`),
		sort: "comic",
		comicName: ".detail-info-title",
		cover: ".detail-info-cover",
		url: {
			h: /mangabz|xmanhua|yymanhua/,
			e: "#chapterlistload"
		},
		getLists: () => cl("#chapterlistload a", {
			sort: "r"
		}),
		getSrcs: (url) => ajax.mdoc(url).then(dom => {
			let code = findScript("newImgs", dom);
			let str = fn.parseCode(code);
			return strToArray(str, "newImgs");
		})
	}, {
		siteName: "我的漫畫",
		homePage: "https://mycomic.com/",
		sort: "comic",
		comicName: ".grow div[data-flux-heading]",
		cover: ".object-cover",
		url: {
			h: ["mycomic.com"],
			p: "/comics/",
			e: "div[x-data*='chapters']"
		},
		getLists: () => {
			let cover = q(_this.cover).src;
			return q(["div[x-data*='chapters']"]).map(e => strToArray(e.getAttribute("x-data"), "chapters")).flat().reverse().map(({
				id,
				title
			}) => ({
				cover,
				text: title,
				url: "/chapters/" + id
			}))
		},
		getSrcs: {
			target: "img.page",
			attr: "data-src"
		}
	}, {
		siteName: "图库漫画",
		homePage: "https://www.tuku.cc/",
		sort: "comic",
		comicName: ".manga-info-wrap h1",
		cover: ".manga-cover>img",
		url: {
			t: "图库漫画",
			p: "/manga-",
			e: ".manga-chapter-wrap"
		},
		getLists: () => cl(".manga-chapter-wrap a"),
		getSrcs: {
			target: ".content img",
			attr: "data-original"
		}
	}, {
		siteName: ["顶漫画", "D漫画"],
		homePage: ["https://www.dingmanhua.com/new", "https://www.dmanhua.com/new"],
		sort: "comic",
		comicName: ".info>h1",
		cover: "img.cover",
		url: {
			h: ["www.dingmanhua.com", "www.dmanhua.com"],
			p: "/comic/"
		},
		getLists: () => {
			let more_e = q(".load-more .button");
			if (more_e) {
				let cover = q(_this.cover).dataset.src;
				let [id] = lpsa().match(/\d+/);
				return ajax.json(`/comic/${id}`, {
					headers: {
						"content-type": "application/json"
					},
					body: "{}",
					method: "POST"
				}).then(json => json.data.chapters.map(({
					chapterName,
					contentId,
					id
				}) => ({
					cover,
					text: chapterName,
					url: `/chapter/${contentId}-${id}.html`
				})).reverse());
			}
			return cl(".chapter-list a", {
				sort: "r"
			});
		},
		getSrcs: {
			cb: (dom) => {
				let code = findScript("pasd", dom);
				let [num] = code.match(/\d+/);
				let [, pasd] = code.match(/pasd[\s="]+([^"]+)/);
				return fn.arr(num, (v, i) => pasd + (i + 1) + ".webp");
			}
		}
	}, {
		siteName: "漫蛙库",
		homePage: "https://www.su7.la/",
		sort: "comic",
		comicName: ".comic-title",
		cover: ".comic-cover",
		url: {
			t: ["漫蛙漫画", "猕猴桃漫画"],
			p: "/comic/"
		},
		getLists: () => cl("a.chapter-item"),
		getSrcs: (url) => {
			let cid = url.split("/").at(-1);
			let params = new URLSearchParams({
				page: 1,
				page_size: 500,
				image_source: localStorage.getItem("comic_image_source") || ""
			}).toString();
			return ajax.json(`/api/comic/image/${cid}?${params}`).then(json => json.data.images.map(e => e.url));
		}
	}, {
		siteName: "奇漫屋",
		homePage: "https://www.mqzjw.com/",
		sort: "comic",
		info: "需要偽裝成手機User-Agent",
		comicName: ".comics-detail__title",
		cover: ".de-info__box img",
		url: {
			h: "www.mqzjw.com",
			p: "/book/"
		},
		decrypt: (data) => {
			const CryptoJS = addCryptoJSLibrary();
			const key = CryptoJS.enc.Utf8.parse("TRHvYbpGlNFoOdLaXrKRYgvdGwGfjnJj");
			const iv = CryptoJS.enc.Utf8.parse("kBKXQIpFYTDOHGLQlRUklPLtNPcBKSve");
			const decrypted = CryptoJS.AES.decrypt(data, key, {
				iv,
				mode: CryptoJS.mode.CBC
			});
			const pic_list = decrypted.toString(CryptoJS.enc.Utf8);
			data = JSON.parse(pic_list);
			return data;
		},
		getLists: () => cl("#chapter-items a"),
		getSrcs: async (url, item) => {
			const {
				Mcpath,
				jQuery: $
			} = unsafeWindow;
			const cid = url.split("/").at(-1);
			let page = 1;
			const datas = [];
			let loop = true;
			let temp = "";
			updateS(item, `${DL.status.s0}：${DL.status.get.s2}`);
			while (loop) {
				updateP(item, `${DL.progress}：Page${page}`);
				await $.getJSON("//" + Mcpath.url + Mcpath.web + "index.php/api/data/pic?callback=?", {
					cid,
					page
				}, (res) => {
					if (res.code == 1) {
						if (temp != res.data) {
							temp = res.data;
						} else if (temp == res.data) {
							loop = false;
							return;
						}
						let data = _this.decrypt(res.data);
						if (data.length > 0) {
							datas.push(data);
							page++;
						} else {
							loop = false;
						}
					} else {
						loop = false;
					}
				});
				await delay(500);
			}
			return datas.flat().map(e => e.img).filter(src => !src.includes("tongzhi"));
		}
	}, {
		siteName: "zero搬运网",
		homePage: "https://zerobyw.github.io/",
		sort: "comic",
		comicName: ".uk-switcher .uk-heading-line",
		cover: ".uk-grid img",
		url: {
			t: "zero搬运网",
			e: ".uk-heading-divider:text:目录"
		},
		getLists: () => cl(".muludiv a[href]"),
		getSrcs: {
			cb: (dom) => {
				let code = findScript("listimg", dom);
				if (!code) return [];
				return strToArray(code, "listimg").map(e => e.file);
			}
		}
	}, {
		siteName: "蚂蚁搬运网",
		homePage: "https://www.antbyw.com/",
		sort: "comic",
		comicName: ".uk-switcher .uk-heading-line",
		cover: ".uk-grid img",
		url: {
			t: "蚂蚁搬运网",
			e: ".uk-heading-divider:text:目录"
		},
		getLists: () => cl(".muludiv a[href]", {
			sort: "r"
		}),
		getSrcs: {
			cb: (dom) => strToArray(findScript("urls", dom), "urls"),
			//next: ".pg .nxt",
			next: (dom) => q(".pg .nxt", dom),
		}
	}, {
		siteName: (o) => o.url.t,
		homePage: () => ["manwamh5", "manhua100", "manhuayu8"].map(h => `https://www.${h}.com/`),
		sort: "comic",
		comicName: ".comics-detail__title,.comic-main .comic-name,.comic-metas>.metas-title",
		cover: ".comics-detail img,.comic-main .comic-thumb,.comic-metas>.metas-image>img",
		url: {
			t: ["漫蛙漫画", "漫画100", "漫画鱼"]
		},
		getLists: () => {
			if (document.title.includes("漫蛙漫画")) {
				return q("#chapter-items") ? cl("#chapter-items a,#chapters_other_list a") : cl(".section-title+.pure-g a", {
					sort: "r"
				});
			}
			return cl(".comic-chapter a,.comic-chapters a");
		},
		getSrcs: (url) => fn.iframe(url, {
			wait: (_, frame) => isArray(frame?.params?.chapter_images),
			timeout: 300000,
		}).then(({
			frame
		}) => {
			let {
				images_domain,
				images_base64,
				chapter_images
			} = frame.params;
			return chapter_images.map(src => {
				if (images_domain) {
					if (images_base64) {
						return images_domain + frame.CMS.base64.encode(src);
					} else if (!["http", "//"].some(k => src.startsWith(k))) {
						return images_domain + src;
					}
				}
				return src;
			});
		})
	}, {
		siteName: (o) => o.url.t,
		homePage: () => ["manhua55", "jiongcy", "ttkmh", "fengchemh", "51manga", "liumanhua", "36mh", "dumanwu", "rumanhua", "qimanwu"].map((h, i) => `https://www.${h}.${i == 9 ? "app" : i < 6 ? "com" : "org"}/`),
		sort: "comic",
		comicName: ".comics-detail__title,.vod-info>.info a,.comicInfo .title,.cy_title>h1,.book-main .book-name",
		cover: ".comics-detail img,.vod-info>.pic>img,.comicInfo img,.cy_info_cover img,.book-main .book-thumb",
		url: {
			t: ["漫画屋", "囧次元", "天天看漫画", "风车漫画", "51漫画", "六漫画", "36漫画", "读漫屋", "如漫画", "奇漫屋"]
		},
		init: () => q(".comicInfo .title")?.firstElementChild?.remove() || void 0,
		getLists: () => {
			if (document.title.includes("漫画屋")) {
				return q("#chapter-items") ? cl("#chapter-items a,#chapters_other_list a") : cl(".section-title+.pure-g a", {
					sort: "r"
				});
			}
			return cl(".episode-box a,#chapterlistload a,.chapter__item a,.cnxh-ul a");
		},
		getSrcs: (url) => fn.iframe(url, {
			wait: (_, frame) => isArray(frame?.params?.images),
			timeout: 300000,
		}).then(({
			frame
		}) => frame?.params?.images?.map(src => {
			if (!["http", "//"].some(k => src.startsWith(k)) && frame.params.source_id == 12) {
				src = "https://img1.baipiaoguai.org" + src;
			}
			return src;
		}) || [])
	}, {
		siteName: (o) => o.url.t,
		homePage: ["http://www.yumanhua.com/", "http://www.rumanhua2.com/", "http://www.dumanwu1.com/"],
		sort: "comic",
		comicName: ".name_mh",
		cover: ".mhcover img",
		url: {
			t: ["漫画客", "如漫画", "读漫屋"]
		},
		getLists: () => {
			let cover = q(_this.cover).dataset.src || q(_this.cover).src;
			let chapters = q([".chapterlistload a"]).map(a => ({
				cover,
				text: a.innerText.trim(),
				url: a.href
			}));
			if (q(".chaplist-more")) {
				let mid = lpsa(1);
				return ajax.json("/morechapter", {
					"headers": {
						"content-type": "application/x-www-form-urlencoded; charset=UTF-8"
					},
					"body": `id=${mid}`,
					"method": "POST"
				}).then(json => {
					let more = json.data.map(({
						chapterid,
						chaptername
					}) => ({
						cover,
						text: chaptername,
						url: `${lp()}${chapterid}.html`
					}));
					chapters = [...chapters, ...more];
					return chapters.reverse();
				});
			}
			return chapters.reverse();
		},
		getSrcs: (url) => fn.iframeEle(url, ".main_img img").then(eles => eles.map(e => e.dataset.src || e.src))
	}, {
		siteName: "爱漫画",
		homePage: "https://www.jingmingbg.com/",
		sort: "comic",
		comicName: ".article-info-item>.title",
		cover: ".cover-show img",
		url: {
			h: "www.jingmingbg.com",
			e: ".cart-tag:text:章节列表"
		},
		getLists: () => cl(".chapter-list a"),
		getSrcs: {
			target: ".chapter-content img",
			attr: "data-original"
		}
	}, {
		siteName: ["杰西漫画", "皮皮漫画"],
		homePage: ["https://www.jiexi8.com/sort/", "https://www.pipimanhua.com/sort/"],
		sort: "comic",
		comicName: ".novel_info_title>h1",
		cover: ".novel_info_main>img",
		url: {
			e: "#footer>footer:has(.fa-flag):text:杰西漫画,#footer>footer:has(.fa-flag):text:皮皮漫画,#footer>footer:has(.fa-flag):text:傑西漫畫,#footer>footer:has(.fa-flag):text:皮皮漫畫",
			p: ["/book/", "/manhua/"]
		},
		getLists: () => cl("#ul_all_chapters a"),
		getSrcs: {
			target: ".comicpage img",
			attr: "data-original"
		}
	}, {
		siteName: "漫画160",
		homePage: "https://www.mh160mh.com/",
		sort: "comic",
		comicName: ".mh-date-info-name a",
		cover: ".mh-date-bgpic img",
		url: {
			t: "漫画160",
			e: ".mh-wm:has(.cy_plist) span:text:章节列表"
		},
		getLists: () => cl(".cy_plist a", {
			sort: "r"
		}),
		getSrcs: (url) => fn.iframe(url, {
			waitVar: ["base64_decode", "f_qTcms_Pic_curUrl_realpic", "qTcms_S_m_murl_e"]
		}).then(({
			frame
		}) => {
			const {
				base64_decode,
				f_qTcms_Pic_curUrl_realpic,
				qTcms_S_m_murl_e
			} = frame;
			return base64_decode(qTcms_S_m_murl_e).split("$qingtiandy$").map(e => f_qTcms_Pic_curUrl_realpic(e));
		})
	}, {
		siteName: ["来漫画", "来漫画"],
		homePage: ["https://www.laimanhua88.com/", "https://www.comemh8.com/"],
		sort: "comic",
		comicName: ".title>h1",
		cover: ".info_cover>.cover>img",
		url: {
			t: "来漫画",
			e: ".plist_bar>h3:text:漫画列表"
		},
		getLists: () => cl(".plist a", {
			sort: "r"
		}),
		getSrcs: (url) => fn.iframe(url, {
			waitVar: ["base64_decode", "getpicdamin", "picTree"]
		}).then(({
			frame
		}) => {
			const {
				base64_decode,
				picTree,
				getpicdamin
			} = frame;
			return base64_decode(picTree).split("$qingtiandy$").map(e => getpicdamin() + e);
		})
	}, {
		siteName: "Rawkuma",
		homePage: "https://rawkuma.net/",
		sort: "comic",
		comicName: "article h1[itemprop]",
		cover: "article img.rounded-lg",
		url: {
			h: ["rawkuma.net"],
			p: "/manga/"
		},
		getLists: () => {
			let url = q("[hx-get]").getAttribute("hx-get");
			let mid = fn.getUSP("manga_id", url);
			return ajax.doc(`/wp-admin/admin-ajax.php?manga_id=${mid}&action=chapter_list`).then(dom => cl("#chapter-list a:has(img)", {
				doc: dom,
				textNode: "span",
				sort: "r",
				cb: () => ({
					mid
				})
			}));
		},
		getSrcs: "[data-image-data] img"
	}, {
		siteName: "MangaRw",
		homePage: "https://mangarw.com/",
		sort: "comic",
		comicName: "h1:has(+h2)",
		cover: "img[alt]",
		url: {
			h: ["mangarw.com"],
			p: "/manga/"
		},
		getLists: () => cl("#chapter-list a", {
			textNode: "h4",
			sort: "r"
		}),
		getSrcs: "#viewer .page-img"
	}, {
		siteName: "漫画 raw",
		homePage: "https://mangaraw.best/",
		sort: "comic",
		comicName: "h1.grow",
		cover: ".cover-frame>img.cover",
		url: {
			e: "img[alt='Manga Raw - 漫画 raw']",
			p: "/raw/"
		},
		getLists: () => cl("#chapterList>ul>a", {
			textNode: ".text-ellipsis",
			sort: "r"
		}),
		getSrcs: "main>div>nav+div>img"
	}, {
		siteName: "cookieKUMARAW",
		homePage: "https://kumaraw.com/",
		sort: "comic",
		info: "需要填入cookie",
		comicName: ".detail_name>h1",
		cover: ".detail_avatar>img",
		url: {
			h: ["kumaraw.com"],
			p: "/manga/"
		},
		getLists: () => cl(".chapter_box a", {
			sort: "r"
		}),
		getSrcs: {
			cb: (dom) => {
				let code = findScript("slides_p_path", dom);
				return strToArray(code, "slides_p_path").map(e => atob(e));
			}
		}
	}, {
		siteName: ["KL", "JF", "KT9", "WeLoMa"],
		homePage: (o) => o.url.h.map(h => `https://${h}/`),
		sort: "comic",
		comicName: ".manga-info>h3",
		cover: "img.thumbnail",
		url: {
			h: ["klz9.com", "jestful.net", "klto9.com", "weloma.art"]
		},
		getLists: () => cl("#list-chapter a,.list-chapters a", {
			textNode: ".chapter-name",
			sort: "r"
		}),
		getSrcs: {
			cb: (dom, url) => {
				let code = findScript("load_image", dom);
				if (!code) return q([".chapter-content img[data-img]"], dom).map(e => atob(e.dataset.img));
				let cid = Number(code.match(/\d+/));
				return ajax.doc(`$/${fn.generateRandomString(30, 1)}.iog?cid=${cid}`, {
					referrer: url
				}).then(d => q(["img[alt^=Page]"], d));
			}
		}
	}, {
		siteName: "Hachiraw",
		homePage: "https://hachiraw.net/",
		sort: "comic",
		comicName: ".BoxBody h1",
		cover: ".BoxBody img",
		url: {
			h: ["hachiraw.net"],
			p: "/manga/"
		},
		getLists: () => cl(".BoxBody a:has(span)", {
			textNode: "span",
			cb: ({
				cover
			}) => ({
				cover: fn.rs(cover, [
					[/i\d\.wp\.com\//, ""],
					["kumaraw.com", "hachiraw.net"],
					[/\?.+$/, ""]
				])
			}),
			sort: "r"
		}),
		getSrcs: {
			target: "#TopPage img",
			attr: "data-original"
		}
	}, {
		siteName: "コミックシーモア",
		homePage: "https://hachiraw.win/",
		sort: "comic",
		comicName: ".entry-title",
		cover: ".wp-block-image img",
		url: {
			h: ["hachiraw.win"],
			p: "/manga-"
		},
		getLists: () => cl(".chaplist a", {
			sort: "r"
		}),
		getSrcs: {
			target: ".wp-block-image>img",
			attr: "data-src"
		}
	}, {
		siteName: ["RawUwU", "Rawdevart"],
		homePage: (o) => o.url.h.map(h => `https://${h}/`),
		sort: "comic",
		url: {
			h: ["rawuwu.net", "rawdevart.art"]
		},
		spa: true,
		page: () => lp(/-c\d+$/),
		observeURL: "head",
		init: () => fn.waitEle([".manga-detail>.manga-title", "#manga-id"]),
		waitEle: [".manga-detail>.manga-title", "#manga-id"],
		getLists: () => {
			comicName = q(".manga-detail>.manga-title").innerText;
			let mid = q("#manga-id").value;
			return ajax.json(`/spa/manga/${mid}`).then(json => json.chapters.map(({
				chapter_number
			}) => ({
				mid,
				cid: chapter_number,
				cover: json.detail.manga_cover_img,
				text: `Chapter ${chapter_number}`,
				url: `/read${lp()}/chapter-${chapter_number}`
			})).reverse());
		},
		getSrcs: (url, item) => {
			let {
				mid,
				cid
			} = item.dataset;
			return ajax.json(`/spa/manga/${mid}/${cid}`).then(json => {
				let {
					chapter_detail: {
						server,
						chapter_content
					}
				} = json;
				let f = fn.html(chapter_content);
				return q([".chapter-img canvas[data-srcset]"], f).map(e => server + e.dataset.srcset);
			});
		}
	}, {
		siteName: ["RawKuro", "ManhuaPlus", "MangaKoma"],
		homePage: ["https://rawkuro.net/home", "https://manhuaplus.org/home", "https://mangakoma.net/"],
		sort: "comic",
		comicName: "article header>h1,.title-detail",
		cover: "figure img,.detail-info img",
		url: {
			h: ["rawkuro.net", "manhuaplus.org", "mangakoma.net"],
			p: "/manga/"
		},
		getLists: () => cl(".chapter>a", {
			sort: "r"
		}),
		getSrcs: {
			cb: (dom) => {
				let code = findScript("CHAPTER_ID", dom);
				let cid = numVar(code, "CHAPTER_ID");
				return ajax.json(`/ajax/image/list/chap/${cid}`, {
					headers: {
						"x-requested-with": "XMLHttpRequest"
					},
					method: "POST"
				}).then(json => {
					let dom = fn.doc(json.html);
					if (q(".separator", dom)) {
						let divs = q([".separator"], dom).sort((a, b) => a.dataset.index - b.dataset.index);
						return divs.map(e => e.firstElementChild.href).filter(e => !e.includes("rawwkuro.jpg"));
					}
					return q([".page-chapter img:not([data-original$='rawwkuro.jpg'])"], dom);
				});
			}
		}
	}, {
		siteName: "GodaComic",
		homePage: "https://manhuascans.org/",
		sort: "comic",
		comicName: "#info h1",
		cover: "#MangaCard img",
		url: {
			h: "manhuascans.org",
			p: "/manga/",
			e: "button[data-mid]"
		},
		getLists: () => {
			let mid = q("button[data-mid]").dataset.mid;
			return ajax.doc(`/manga/get?mid=${mid}&mode=all`, {
				cache: "no-cache"
			}).then(dom => cl("#allchapterlist a", {
				doc: dom,
				cb: ({
					e
				}) => ({
					mid,
					text: e.dataset.ct
				})
			}))
		},
		getSrcs: {
			cb: (dom) => {
				let e = q("#chapterContent", dom);
				let {
					ms,
					cs,
					host
				} = e.dataset;
				return ajax.doc(`${host}/chapter/getcontent?m=${ms}&c=${cs}`, {
					cache: "no-cache"
				}).then(dom => q([".touch-manipulation img"], dom));
			},
			attr: "data-src"
		}
	}, {
		siteName: "MangaTaro",
		homePage: "https://mangataro.org/home",
		sort: "comic",
		url: {
			h: ["mangataro.org"]
		},
		spa: true,
		page: () => lp("/manga/") && lp(3),
		observeURL: "head",
		waitEle: [".manga-page-wrapper h1", ".manga-page-wrapper img[alt^=Cover]"],
		init: () => {
			let loop = setInterval(() => {
				if (!q(".chapter-list>a")) {
					EClick(q("div[data-tab-target='#tab-chapters']"));
				}
			}, 1000);
			setTimeout(() => clearInterval(loop), 5000);
		},
		getLists: () => {
			comicName = q(".manga-page-wrapper h1").innerText;
			return cl(".chapter-list>a", {
				apiCover: ".manga-page-wrapper img[alt^=Cover]",
				textNode: "span.text-sm",
				cb: ({
					e
				}) => {
					let text = "";
					let cs = q("span.text-sm", e);
					let cn = q("span.text-sm+span.text-sm", e);
					text += cs.innerText;
					if (cn) {
						if (!cn.innerText.includes("N/A")) {
							text += (` ${cn.innerText}`);
						}
					}
					return {
						text
					}
				},
				sort: "r"
			});
		},
		getSrcs: {
			target: ".comic-image-container img",
			attr: "data-src"
		}
	}, {
		siteName: "Weeb Central",
		homePage: "https://weebcentral.com/hot-updates",
		sort: "comic",
		comicName: "main section>h1",
		cover: "main section img[alt$=cover]",
		url: {
			h: ["weebcentral.com"],
			p: "/series/"
		},
		getLists: () => ajax.doc(fn.dir() + "full-chapter-list").then(dom => cl("a:has(span)", {
			doc: dom,
			textNode: "span>span",
			sort: "r"
		})),
		getSrcs: {
			api: (url) => url + "/images?reading_style=long_strip",
			target: "section img[alt^=Page]"
		}
	}, {
		siteName: "Project Suki",
		homePage: "https://projectsuki.com/",
		sort: "comic",
		comicName: "h2[itemprop=title]",
		cover: ".img-thumbnail",
		url: {
			h: ["www.projectsuki.com", "projectsuki.com"],
			p: "/book/"
		},
		getLists: () => cl(".table-borderless a[title]", {
			sort: "r"
		}),
		getSrcs: {
			cb: (dom, url) => {
				let [, , , , mid, cid] = url.split("/");
				return ajax.json("/callpage", {
					"body": JSON.stringify({
						bookid: mid,
						chapterid: cid,
						first: true
					}),
					"method": "POST"
				}).then(json => {
					let html = q(".strip-reader", dom).innerHTML;
					html += json.src;
					dom = fn.doc(html);
					return [...dom.images];
				});
			}
		}
	}, {
		siteName: ["BATO.TO", "Mirror announcement", "MangaPark", "Mirror announcement"],
		homePage: ["https://bato.si/", "https://batotomirrors.pages.dev/", "https://mangapark.net/", "https://mangaparkmirrors.pages.dev/"],
		sort: "comic",
		comicName: ".flex-col h3>a",
		cover: ".flex-col img[title]",
		url: {
			e: ["footer>p:last-child:text:BATO.TO,footer>p:last-child:text:MangaPark", "div[data-name='chapter-list']"],
			p: ["/title/"]
		},
		getLists: () => cl("div[data-name='chapter-list'] a:not(:has(*))", {
			sort: "r"
		}),
		ss: ["s01.", "s03.", "s04."],
		sn: ["n00.", "n01.", "n02.", "n03.", "n04.", "n05.", "n06.", "n07.", "n08.", "n09.", "n10.", "n11.", "n12.", "n14.", "n15.", "n16.", "n17.", "n18.", "n19.", "n20.", "n21.", "n22.", "n23.", "n24.", "n25.", "n26.", "n27.", "n28.", "n29.", "n30."],
		getSrcs: {
			cb: (dom) => {
				let imgs = q(["div[data-name='image-item'] img"], dom);
				return q("footer>p:last-child:text:MangaPark") ? imgs.map(e => e.src.replace(/[a-z]+\d+\./, arrayOne(_this.ss))) : imgs.map(e => e.src.replace(/[a-z]+\d+\./, arrayOne(_this.sn)));
			}
		}
	}, {
		siteName: "BATO.TO V3",
		homePage: "https://bato.to/v3x",
		sort: "comic",
		comicName: ".flex-col h3>a",
		cover: ".flex-col img[title]",
		url: {
			e: ["footer>p:last-child:text:BATO.TO", "div[name='chapter-list']"],
			p: ["/title/"]
		},
		getLists: () => cl("div[name='chapter-list']:has([data-hk]) a:not(:has(*)):has(+span),div[name='chapter-list'] astro-slot>div[data-hk]>div>a"),
		sn: ["n00.", "n01.", "n02.", "n03.", "n04.", "n05.", "n06.", "n07.", "n08.", "n09.", "n10.", "n11.", "n12.", "n14.", "n15.", "n16.", "n17.", "n18.", "n19.", "n20.", "n21.", "n22.", "n23.", "n24.", "n25.", "n26.", "n27.", "n28.", "n29.", "n30."],
		getSrcs: {
			cb: (dom) => JSON.parse(JSON.parse(q("astro-island[props*=imageFiles]", dom).getAttribute("props")).imageFiles.find(isString)).map(([, url]) => url.replace(/[a-z]+\d+\./, arrayOne(_this.sn)))
		}
	}, {
		siteName: "BATO.TO V2",
		homePage: "https://bato.to/",
		sort: "comic",
		comicName: ".item-title>a",
		cover: ".detail-set img",
		url: {
			e: [".footer>div>span:text:Bato.To", ".episode-list"],
			p: ["/series/"]
		},
		getLists: () => cl(".episode-list a:has(b)", {
			sort: "r"
		}),
		sn: ["n00.", "n01.", "n02.", "n03.", "n04.", "n05.", "n06.", "n07.", "n08.", "n09.", "n10.", "n11.", "n12.", "n14.", "n15.", "n16.", "n17.", "n18.", "n19.", "n20.", "n21.", "n22.", "n23.", "n24.", "n25.", "n26.", "n27.", "n28.", "n29.", "n30."],
		getSrcs: {
			cb: (dom) => {
				let code = findScript("imgHttps", dom);
				return strToArray(code, "imgHttps").map(src => src.replace(/[a-z]+\d+\./, arrayOne(_this.sn)));
			}
		}
	}, {
		siteName: "MangaDemon",
		homePage: "https://demonicscans.org/",
		sort: "comic",
		comicName: ".big-fat-titles",
		cover: "#manga-page div>img",
		url: {
			h: ["demonicscans.org"],
			p: "/manga/"
		},
		getLists: () => cl("#chapters-list a", {
			textNode: "text",
			sort: "r"
		}),
		getSrcs: ".imgholder:not([src*='free_ads'])"
	}, {
		siteName: "Mangapill",
		homePage: "https://mangapill.com/",
		sort: "comic",
		comicName: ".container h1",
		cover: ".container img.object-cover",
		url: {
			h: ["www.mangapill.com", "mangapill.com"],
			p: "/manga/"
		},
		getLists: () => cl("#chapters a", {
			sort: "r"
		}),
		getSrcs: {
			target: "chapter-page img",
			attr: "data-src"
		}
	}, {
		siteName: "TodayManga",
		homePage: "https://todaymanga.com/",
		sort: "comic",
		comicName: ".serie-title>h1",
		cover: ".serie-img img",
		url: {
			h: ["todaymanga.com"],
			p: "/chapter-list"
		},
		getLists: () => cl(".chapters-list a", {
			sort: "r"
		}),
		getSrcs: {
			target: ".chapter-content>img[data-src]",
			attr: "data-src"
		}
	}, {
		siteName: "Dynasty Reader",
		homePage: "https://dynasty-scans.com/",
		sort: "comic",
		comicName: ".tag-title>b",
		cover: ".thumbnail",
		url: {
			h: ["dynasty-scans.com"],
			p: ["/series/"]
		},
		getLists: () => cl(".chapter-list a:has(+small)"),
		getSrcs: {
			cb: (dom) => {
				let code = findScript("pages", dom);
				return strToArray(code, "pages").map(e => e.image);
			}
		}
	}, {
		siteName: [
			"Kingofshojo",
			"Reset Scans",
			"Flame Scans",
			"Rizz Fables",
			"Leemiau",
			"Manhua Top",
			"ToonClash",
			"MANHUAUS.COM",
			"LHTranslation",
			"MANGAREAD.ORG",
			"ManhuaPlus",
			"TopManhua",
			"Manhwa Clan",
			"Kun Manga",
			"Kissmanga",
			"cookieManhwaZ",
			"ShonenManga",
			"Like Manga",
			"Like Manga",
			"MangaBTT",
			"ZazaManga",
			"ZinManga",
			"Mangago",
			"Aqua Manga",
			"Armageddon",
			"Coffee Manga",
			"MANGA ZIN",
			"Mangasushi",
			"MangaYY",
			"MANGAGG",
			"Sektekomik",
			"Cosmic Scans Indonesia",
			"ManhuaHot",
			"Manhuarm MTL",
			"FREE MANGA TOP"
		],
		info: "ManhwaZ需要填入cookie",
		url: {
			h: [
				"kingofshojo.com",
				"reset-scans.org",
				"flamescans.lol",
				"rizzfables.com",
				"leemiau.com",
				"manhuatop.org",
				"toonclash.com",
				"manhuaus.com",
				"lhtranslation.net",
				"www.mangaread.org",
				"manhuaplus.com",
				"www.topmanhua.fan",
				"manhwaclan.com",
				"kunmanga.com",
				"kissmanga.in",
				"manhwaz.com",
				"www.shonenmangaz.com",
				"likemanga.in",
				"likemanga.ink",
				"manhwabtt.cc",
				"www.zazamanga.com",
				"www.zinmanga.net",
				"mangago.io",
				"aquareader.net",
				"www.silentquill.net",
				"coffeemanga.ink",
				"mangazin.org",
				"mangasushi.org",
				"mangayy.org",
				"mangagg.com",
				"sektekomik.id",
				"lc4.cosmicscans.asia",
				"manhuahot.com",
				"manhuarmmtl.com",
				"freemangatop.com"
			],
			p: ["/"]
		},
		...wpMangaParams,
		...{
			getLists: () => {
				if (location.host == "mangagg.com") {
					if (q(".pagination")) {
						let max = um(".pagination a");
						let resArr = fn.arr(max, (v, i) => ajax.doc(`/comic/${lpsa(-2)}/ajax/chapters/?t=${i + 1}`, {
							"body": null,
							"method": "POST"
						}).then(d => q([_this.waitEle], d)));
						return Promise.all(resArr).then(eles => cl(eles.flat(), {
							textNode: ".chapternum",
							sort: "r"
						}));
					}
				}
				if (location.host == "likemanga.ink") {
					if (q("#nav_list_chapter_id_detail .current")) {
						let mid = q("#title-detail-manga").dataset.manga;
						let max = um("#nav_list_chapter_id_detail a");
						let links = fn.arr(max, (v, i) => `?act=ajax&code=load_list_chapter_modal&manga_id=${mid}&page_num=${i + 1}`);
						let resArr = links.map(ajax.json);
						return Promise.all(resArr).then(jsons => {
							let html = jsons.map(j => j.list_chap).join("");
							let node = fn.html(html);
							return cl("a", {
								doc: node,
								sort: "r"
							});
						});
					}
				}
				return cl(_this.waitEle, {
					textNode: ".chapternum",
					sort: "r"
				});
			}
		}
	}, {
		siteName: ["Eros Scans", "MangaGojo", "Mangakita", "Terco Scans", "Galaxy Manga"],
		url: {
			h: ["erosxsun.xyz", "mangagojo.com", "mangakita.id", "tecnoxmoon.xyz", "galaxymanga.io"],
			p: ["/manga/"]
		},
		...wpMangaParams,
		...ts_reader
	}, {
		siteName: "Asura Scans",
		homePage: "https://asuracomic.net/",
		sort: "comic",
		comicName: "span.text-xl.font-bold",
		cover: "img[alt=poster]:has(+div)",
		url: {
			h: ["asuracomic.net"],
			p: "/series/"
		},
		getLists: () => cl(".scrollbar-thin>div>a", {
			textNode: "h3",
			sort: "r"
		}),
		getSrcs: (url) => fn.iframeDoc(url, "img[alt*='chapter']").then(dom => q(["img[alt*='chapter']"], dom).map(e => e.src)),
		hide: ".w-full:has(+header)"
	}, {
		siteName: "YuKomik",
		homePage: "https://yukomik.com/",
		sort: "comic",
		comicName: "main h1",
		cover: "main img",
		url: {
			h: ["yukomik.com"],
			p: ["/komik/"],
			eu: ["/chapter"]
		},
		getLists: () => cl("h1+div>a", {
			textNode: "p",
			sort: "r"
		}),
		getSrcs: {
			target: ".min-h-screen div[q\\:key] img",
			eSrc: ["/000.jpg", "/997.jpg", "/999.jpg"]
		}
	}, {
		siteName: "ComicK.art",
		homePage: "https://comick.art/home",
		sort: "comic",
		comicName: "div[x-show] h1",
		cover: "div[x-show] img[alt]",
		url: {
			t: "ComicK",
			p: "/comic/"
		},
		waitEle: "tr[\\@mouseenter]",
		getLists: () => {
			const get = (data) => data.map(({
				chap,
				hid,
				lang,
				vol,
				title
			}) => {
				let text = `Ch.${chap}`;
				if (vol) {
					text += String(" Vol " + vol);
				}
				if (title) {
					text += String(" " + title);
				}
				if (l == "settings" || l == "all") {
					text += ` (${lang})`;
				}
				return {
					cover,
					text,
					url: `/comic/${cn}/${hid}-chapter-${chap}-${lang}`
				};
			}).reverse();
			let cn = lpsa();
			let l = q("select[\\@change*='Chapter']").value;
			let cover = q(_this.cover).src;
			let max = q(["nav>a[x-text]"]).length;
			if (!max) {
				return ajax.json("/api/comics/the-demon-king-overrun-by-heroes/chapter-list").then(json => get(json.data));
			}
			let resArr = fn.arr(max, (v, i) => ajax.json(`/api/comics/${cn}/chapter-list?lang=${(l == "settings"|| l == "all") ? "" : l}&page=${i + 1}`));
			return Promise.all(resArr).then(data => {
				data = data.map(e => e.data).flat();
				return get(data);
			})
		},
		getSrcs: {
			cb: (dom) => JSON.parse(q("#sv-data", dom).innerHTML).chapter.images.map(e => e.url)
		}
	}, {
		siteName: "Comix",
		homePage: "https://comix.to/home",
		sort: "comic",
		url: {
			h: ["comix.to"]
		},
		spa: true,
		page: () => lp("/title/") && lp(3),
		observeURL: "head",
		waitEle: [".comic-info>.detail .title", ".comic-info>.poster img"],
		getLists: () => {
			comicName = q(_this.waitEle.at(0)).innerText;
			let cover = q(_this.waitEle.at(1)).src;
			let syncData = JSON.parse(q("#syncData").textContent);
			let filter = (array) => {
				let temp = new Set();
				return array.filter(o => {
					if (temp.has(o.number)) {
						return false;
					} else {
						temp.add(o.number);
						return true;
					}
				}).map(({
					chapter_id,
					number
				}) => ({
					cover,
					text: `Chapter ${number}`,
					url: `${syncData.manga_url}/${chapter_id}-chapter-${number}`
				}));
			};
			return ajax.json(`/api/v2/manga/${syncData.manga_id}/chapters?limit=100&page=1&order[number]=asc`).then(json => {
				if (json.result.pagination.last_page > 1) {
					let pages = Array.from({
						length: json.result.pagination.last_page - 1
					}, (v, i) => ajax.json(`/api/v2/manga/${syncData.manga_id}/chapters?limit=100&page=${i + 2}&order[number]=asc`));
					return Promise.all(pages).then(data => {
						let items = [json, ...data].map(j => j.result.items).flat();
						return filter(items);
					});
				}
				return filter(json.result.items);
			});
		},
		getSrcs: {
			cb: (dom) => {
				let code = findScript('\\"images\\"', dom);
				if (!code) return [];
				code = code.replaceAll("\\", "");
				return strToArray(code, '"images":').map(e => {
					if (isObject(e)) {
						return e.url;
					}
					return e;
				});
			}
		}
	}, {
		siteName: "Atsumaru",
		homePage: "https://atsu.moe/",
		sort: "comic",
		url: {
			h: ["atsu.moe"]
		},
		spa: true,
		page: () => lp("/manga/") && lp(3),
		observeURL: "head",
		waitEle: [".h-12~h1", "aside img.object-cover"],
		getLists: () => {
			let cover = q(_this.waitEle.at(1)).src;
			let mid = lpsa();
			return ajax.json(`/api/manga/info?mangaId=${mid}`).then(json => {
				comicName = json.title;
				return json.chapters.map(({
					title,
					id
				}) => ({
					mid,
					cid: id,
					cover,
					text: title,
					url: `/read/${mid}/${id}`
				}));
			});
		},
		getSrcs: (url, item) => {
			let {
				mid,
				cid,
			} = item.dataset;
			return ajax.json(`/api/read/chapter?mangaId=${mid}&chapterId=${cid}`).then(json => json.readChapter.pages.map(o => o.image));
		}
	}, {
		siteName: "MangaCloud",
		homePage: "https://mangacloud.org/",
		sort: "comic",
		url: {
			h: ["mangacloud.org"]
		},
		spa: true,
		page: () => lp("/comic/") && lp(3),
		observeURL: "head",
		waitEle: [".container h1[title]", ".container img"],
		getLists: () => {
			let cover = q(_this.waitEle.at(1)).src;
			let mid = lpsa();
			return ajax.json(`https://api.mangacloud.org/comic/${mid}`).then(json => {
				comicName = json.data.title;
				return json.data.chapters.map(({
					number,
					id
				}) => ({
					mid,
					cid: id,
					cover,
					text: "Chapter " + number,
					url: `/comic/${mid}/chapter/${id}`
				})).reverse();
			});
		},
		getSrcs: (url, item) => {
			let {
				mid,
				cid,
			} = item.dataset;
			return ajax.json(`https://api.mangacloud.org/chapter/${cid}`).then(json => json.data.images.map(o => `https://pika.mangacloud.org/${mid}/${cid}/${o.id}.${o.f}`));
		}
	}, {
		siteName: "WeebDex",
		homePage: "https://weebdex.org/",
		sort: "comic",
		url: {
			h: ["weebdex.org"]
		},
		spa: true,
		page: () => lp("/title/") && lp(4),
		observeURL: "head",
		waitEle: ["#manga h1", "#manga img.object-cover"],
		getLists: () => {
			comicName = q(_this.waitEle.at(0)).innerText;
			let cover = q(_this.waitEle.at(1)).src;
			let lists = (array) => {
				return array.map(({
					chapter,
					id,
					title,
					volume
				}) => {
					let text;
					if (volume) {
						text = `Volume ${volume} Chapter ${chapter}`;
					} else {
						text = `Chapter ${chapter}`;
					}
					if (title) {
						text += ` - ${title}`;
					}
					if (!chapter) {
						text = "Oneshot";
					}
					return {
						mid,
						cid: id,
						cover,
						text,
						url: `/chapter/${id}`
					};
				});
			};
			let mid = lpsa(2);
			let lang = fn.getUSP("tlang");
			let api = `https://api.weebdex.org/manga/${mid}/chapters?limit=500&order=asc`;
			if (lang) {
				api = `https://api.weebdex.org/manga/${mid}/chapters?limit=500&tlang=${lang}&order=asc`;
			}
			return ajax.json(api).then(json => {
				if (json.total > 500) {
					let max = Math.ceil(json.total / 500);
					let pages = Array.from({
						length: max - 1
					}, (v, i) => {
						api = `https://api.weebdex.org/manga/${mid}/chapters?limit=500&page=${i + 2}&order=asc`;
						if (lang) {
							api = `https://api.weebdex.org/manga/${mid}/chapters?limit=500&page=${i + 2}&tlang=${lang}&order=asc`;
						}
						return ajax.json(api);
					});
					return Promise.all(pages).then(data => lists([json, ...data].map(j => j.data).flat()));
				}
				return lists(json.data);
			});
		},
		getSrcs: (url, item) => ajax.json(`https://api.weebdex.org/chapter/${item.dataset.cid}`).then(json => {
			let {
				id,
				data,
				data_optimized,
				node,
			} = json;
			return (data ?? data_optimized).map(o => `${node}/data/${id}/${o.name}`);
		})
	}, {
		siteName: ["Hive Toon", "Vortex Scans"],
		homePage: ["https://hivetoons.org/", "https://vortexscans.org/"],
		sort: "comic",
		url: {
			h: ["hivetoons.org", "vortexscans.org"]
		},
		spa: true,
		page: () => lp("/series/") && !lp("/chapter-"),
		observeURL: "head",
		waitEle: "article>section img[alt^=Cover]",
		getLists: () => ajax.doc(lp()).then(dom => {
			comicName = q("article>section h1[itemprop=name]", dom).innerText;
			let cover = q(_this.waitEle).src;
			let code = findScript('\\"chapters\\"', dom);
			code = code.replaceAll("\\", "");
			let a = code.indexOf('"chapters"');
			let b = code.indexOf("[", a);
			let c = code.indexOf("],", b) + 1;
			code = code.slice(b, c);
			return JSON.parse(code).map(({
				slug,
				number
			}) => ({
				cover,
				text: `Chapter ${number}`,
				url: `${lp()}/${slug}`
			})).reverse();
		}),
		getSrcs: {
			cb: (dom) => {
				let code = findScript('\\"images\\"', dom);
				if (!code) return [];
				code = code.replaceAll("\\", "");
				return strToArray(code, '"images":').map(e => e.url);
			}
		}
	}, {
		siteName: "Qi Scans",
		homePage: "https://qiscans.org/",
		sort: "comic",
		url: {
			h: ["qiscans.org"]
		},
		spa: true,
		page: () => lp("/series/") && lp(3),
		observeURL: "head",
		waitEle: ["main section h1", ".sticky>.relative img.object-cover"],
		getLists: () => {
			comicName = q("main section h1").innerText;
			let cover = q(_this.waitEle.at(1)).src;
			return ajax.json(`https://api.qiscans.org/api/post/chapters?postSlug=${lpsa()}`).then(array => array.map(({
				slug,
				number
			}) => ({
				cover,
				text: `Chapter ${number}`,
				url: `${lp()}/${slug}`
			})));
		},
		getSrcs: {
			cb: (dom) => {
				let code = __next_f(dom);
				code = strSlicer(code, '"images":[', "]");
				if (!code) return [];
				return JSON.parse("[" + code).map(e => e.url);
			}
		}
	}, {
		siteName: "SetsuScans",
		homePage: "https://manga.saytsu.com/",
		sort: "comic",
		url: {
			h: ["manga.saytsu.com"]
		},
		spa: true,
		page: () => lp("/manga/") && lp(3),
		observeURL: "head",
		waitEle: "img[alt='Cover Image']",
		getLists: () => ajax.json(`https://api.saytsu.com/${lp()}`).then(json => {
			comicName = json.title;
			return json.chapters.sort((a, b) => a.index - b.index).map(({
				slug,
				chapter_number
			}) => ({
				mid: json.slug,
				cid: slug,
				cover: q("img[alt='Cover Image']")?.src,
				text: `Chapter ${chapter_number}`,
				url: `${lp()}/${slug}`
			}));
		}),
		headers: () => ({
			accept: "human/ok"
		}),
		getSrcs: (url, item) => {
			let {
				mid,
				cid
			} = item.dataset;
			return ajax.json(`https://api.saytsu.com//manga/${mid}/${cid}`).then(json => json.full_image_paths.map(path => location.origin + "/" + path));
		}
	}, {
		siteName: ["Flame Comics"],
		homePage: ["https://flamecomics.xyz/"],
		sort: "comic",
		url: {
			h: ["flamecomics.xyz"]
		},
		spa: true,
		page: () => lp("/series/") && lp(3),
		observeURL: "head",
		getLists: () => ajax.doc(lp()).then(dom => {
			comicName = q("main h1", dom).innerText;
			return cl(".mantine-ScrollArea-viewport a", {
				doc: dom,
				apiCover: "main img[alt=Cover]",
				textNode: "p",
				sort: "r"
			});
		}),
		getSrcs: {
			cb: (dom) => {
				let code = q("#__NEXT_DATA__", dom).textContent;
				let json = JSON.parse(code).props.pageProps;
				let cdn = "https://cdn.flamecomics.xyz/uploads/images/series";
				let {
					chapter: {
						series_id,
						images,
						token,
						release_date
					}
				} = json;
				return Object.values(images).map(({
					name
				}) => `${cdn}/${series_id}/${token}/${name}?${release_date}`);
			}
		}
	}, {
		siteName: "ZeroScans",
		homePage: "https://zscans.com/",
		sort: "comic",
		url: {
			h: ["zscans.com"]
		},
		spa: true,
		page: () => lp("/comics/") && lp(3),
		observeURL: "head",
		waitEle: [".v-image__image", ".archive_chapters a"],
		json: (dom) => fn.parseCode(findScript("__ZEROSCANS__", dom)).data.at(0),
		getLists: () => {
			let cover = fn.getBackgroundImage(q(".v-image__image"));
			let url = q(".archive_chapters a").href;
			return ajax.doc(url).then(dom => {
				let json = _this.json(dom);
				comicName = json.current_chapter.comic_name;
				return json.chapter_list.map(({
					id,
					name
				}) => ({
					cover,
					text: `Chapter ${name}`,
					url: `${lp()}/${id}`
				}));
			});
		},
		getSrcs: {
			cb: (dom) => _this.json(dom)?.current_chapter?.high_quality || []
		}
	}, {
		siteName: ["Danke fürs Lesen", "Hachirumi"],
		homePage: ["https://danke.moe/", "https://hachirumi.com/"],
		sort: "comic",
		url: {
			h: ["danke.moe", "hachirumi.com"]
		},
		spa: true,
		page: () => lp("/read/manga/") && lp(5),
		observeURL: "head",
		waitEle: ["article>h1:has(+picture)", ".list-item picture>source:has(+img)"],
		json: (dom) => fn.parseCode(findScript("__ZEROSCANS__", dom)).data.at(0),
		getLists: () => {
			let cover = q(_this.waitEle.at(1)).srcset;
			let mid = lpsa(3);
			return ajax.json(`/api/series/${mid}/`).then(json => {
				comicName = json.title;
				return Object.entries(json.chapters).map(([k, v]) => {
					let text = `Chapter ${k}`;
					if (v.title) {
						text += ` - ${v.title}`;
					}
					return {
						mid,
						cid: k,
						cover,
						text,
						url: `/read/manga/${json.slug}/${k}/1/`
					};
				});
			});
		},
		getSrcs: (url, item) => {
			let {
				mid,
				cid
			} = item.dataset;
			return ajax.json(`/api/series/${mid}/`).then(json => {
				let chapter = json.chapters[cid];
				let [k, images] = Object.entries(chapter.groups).at(0);
				return images.map(p => `/media/manga/${json.slug}/chapters/${chapter.folder}/${k}/${p}`);
			});
		}
	}, {
		siteName: "All Manga",
		homePage: "https://allmanga.to/",
		sort: "comic",
		url: {
			h: ["allmanga.to"]
		},
		spa: true,
		page: () => lp("/manga/") && lp(3),
		observeURL: "head",
		waitEle: ".card .thumbnail-item>img[data-src]",
		getLists: () => {
			let cover = q(_this.waitEle).src;
			let mid = lpsa();
			return ajax.doc(lp()).then(dom => {
				let code = findScript("__NUXT__", dom);
				let data = fn.parseCode(code);
				debug("data", data);
				comicName = data.fetch["manga:0"].manga.name;
				return data.fetch["manga:0"].manga.availableChaptersDetail.sub.map(s => ({
					mid,
					cid: s,
					cover,
					text: `Chapter ${s}`,
					url: `/manga/${mid}/chapter-${s}-sub`
				})).reverse();
			});
		},
		getSrcs: {
			cb: (dom) => {
				let code = findScript("__NUXT__", dom);
				let data = fn.parseCode(code);
				return data.fetch["chapter:0"].chapters[0].pictureUrls.map(o => "https://ytimgf.youtube-anime.com/" + o.url);
			}
		}
	}, {
		siteName: "Kiryuu",
		homePage: "https://kiryuu03.com/",
		sort: "comic",
		comicName: "main h1",
		cover: "div[itemprop=image]>img.object-cover",
		url: {
			t: "Kiryuu",
			p: "/manga/"
		},
		getLists: () => {
			let id = [...document.body.classList].find(c => c.startsWith("postid-")).split("-").at(1);
			return ajax.doc(`/wp-admin/admin-ajax.php?manga_id=${id}&action=chapter_list`).then(dom => cl("#chapter-list>div[data-chapter-number]>a", {
				doc: dom,
				textNode: "span",
				sort: "r"
			}));
		},
		getSrcs: "section[data-image-data]>img"
	}, {
		siteName: "Manga Ball",
		homePage: "https://mangaball.net/",
		sort: "comic",
		comicName: ".comic-detail-card h6",
		cover: "img.featured-cover",
		url: {
			h: ["mangaball.net"],
			p: "/title-detail/",
			e: "#showUploadChapterBtn[data-title-id]"
		},
		api: (body) => ajax.json("/api/v1/chapter/chapter-listing-by-title-id/", {
			headers: {
				"content-type": "application/x-www-form-urlencoded; charset=UTF-8",
				"x-csrf-token": q("meta[name='csrf-token']").content,
				"x-requested-with": "XMLHttpRequest"
			},
			body,
			method: "POST"
		}),
		getLists: () => {
			let cover = q("img.featured-cover").src;
			let titleId = q("#showUploadChapterBtn").dataset.titleId;
			return _this.api(`title_id=${titleId}`).then(json => {
				let lang = prompt(`Select Language：${String(json.ALL_LANGUAGES)}`, json.ALL_LANGUAGES.at(0));
				if (lang) {
					return _this.api(`title_id=${titleId}&lang=${lang}`).then(json => {
						return json.ALL_CHAPTERS.map(({
							number,
							title,
							translations
						}) => ({
							cover,
							text: `${number} - ${title}`,
							url: translations[0].url
						})).reverse();
					});
				}
				return [];
			});
		},
		getSrcs: {
			cb: (dom) => {
				let code = findScript("chapterImages", dom);
				return strToArray(code, "chapterImages");
			}
		}
	}, {
		siteName: ["Dream-Manga", "Manga-Bay"],
		homePage: ["https://dream-manga.com/", "https://manga-bay.org/"],
		sort: "comic",
		info: "Manga-Bay偽裝手機可以免登入",
		comicName: ".page__header h1",
		cover: ".page__poster>img",
		url: {
			h: ["dream-manga.com", "manga-bay.org"],
			p: ".html"
		},
		getLists: () => {
			let cover = q(_this.cover).src;
			let code = findScript("itemListElement");
			return JSON.parse(code).hasPart.itemListElement.map(({
				item
			}) => ({
				cover,
				text: item.name,
				url: item["@id"]
			})).reverse();
		},
		getSrcs: {
			cb: (dom) => {
				let code = findScript("__DATA__", dom);
				let data = strToObject(code, "__DATA__", 1, 1);
				return data.images;
			}
		}
	}, {
		siteName: "MangaMob",
		homePage: "https://mangamob.com/",
		sort: "comic",
		comicName: ".manga-name",
		cover: ".manga-poster>img",
		url: {
			h: "mangamob.com",
			p: "/manga/"
		},
		getLists: () => cl(".chapters-list-ul a", {
			textNode: ".name",
			sort: "r"
		}),
		getSrcs: {
			target: "#chapter-images img",
			attr: "data-src"
		}
	}, {
		siteName: "MangaGeko",
		homePage: "https://www.mgeko.cc/",
		sort: "comic",
		comicName: ".novel-info h1",
		cover: ".cover>img",
		url: {
			h: "www.mgeko.cc",
			p: "/manga/"
		},
		getLists: () => cl(".chapter-list a", {
			textNode: {
				s: ".chapter-number",
				n: "text"
			},
			sort: "r"
		}),
		getSrcs: {
			target: "#chapter-reader img",
			eSrc: ["/credits-mgeko.png"]
		}
	}, {
		siteName: "MangaKatana",
		homePage: "https://mangakatana.com/",
		sort: "comic",
		comicName: ".info>h1",
		cover: ".cover>img",
		url: {
			h: ["mangakatana.com"],
			p: "/manga/"
		},
		getLists: () => cl(".chapters .chapter>a", {
			sort: "r"
		}),
		getSrcs: (url) => fn.iframeEle(url, "#imgs div[id^=page] img").then(eles => eles.map(e => e.dataset.src))
	}, {
		siteName: "Mangakawaii",
		homePage: "https://www.mangakawaii.io/",
		sort: "comic",
		comicName: ".manga-view__header h1",
		cover: ".manga-view__header-image>img",
		url: {
			h: "www.mangakawaii.io",
			p: "/manga/"
		},
		getLists: () => ajax.doc(q("#chapters a")).then(dom => cl(".chapter-pager .dropdown-menu a", {
			doc: dom,
			sort: "r"
		})),
		getSrcs: {
			cb: (dom) => {
				let code = findScript("chapter_slug", dom);
				let pages = strToArray(code, "pages");
				let chapter_server = strVar(code, "chapter_server");
				let oeuvre_slug = strVar(code, "oeuvre_slug");
				let applocale = strVar(code, "applocale");
				let chapter_slug = strVar(code, "chapter_slug");
				return pages.map(({
					page_image,
					page_version
				}) => `https://${chapter_server}.mangakawaii.io/uploads/manga/${oeuvre_slug}/chapters_${applocale}/${chapter_slug}/${page_image}?${page_version}`);
			}
		}
	}, {
		siteName: "MangaFreak",
		homePage: "https://mangafreak.me/",
		sort: "comic",
		comicName: ".manga_series_data>h1",
		cover: ".manga_series_image>img",
		url: {
			t: "MangaFreak",
			p: "/Manga/"
		},
		getLists: () => cl(".manga_series_list a"),
		getSrcs: ".slideshow-container img"
	}, {
		siteName: "Read Manga",
		homePage: "https://readmanga.cc/",
		sort: "comic",
		comicName: "nav+div h1",
		cover: "nav+div img[alt^=Cover]",
		url: {
			h: "readmanga.cc",
			p: "/manga/"
		},
		getLists: () => cl("#chapters a", {
			textNode: "h5",
			sort: "r"
		}),
		getSrcs: "div.justify-center>img[alt][loading=eager]"
	}, {
		siteName: "Manga-Doom",
		homePage: "https://manga-doom.com/",
		sort: "comic",
		comicName: ".content h5.widget-heading:has(+.row)",
		cover: ".content .mobile-img",
		url: {
			h: ["manga-doom.com"],
			e: "#chapter_list"
		},
		getLists: () => {
			let name = q(_this.comicName).textContent;
			return cl("#chapter_list a", {
				textNode: ".val",
				cb: ({
					text
				}) => ({
					text: text.replace(name, "Chapter")
				}),
				sort: "r"
			});
		},
		getSrcs: {
			api: (url) => url + "/all-pages",
			target: ".inner-page img"
		}
	}, {
		siteName: "MangaSail",
		homePage: "https://www.sailmg.com/",
		sort: "comic",
		comicName: ".page-header",
		cover: ".content img[typeof='foaf:Image']",
		url: {
			h: "www.sailmg.com",
			p: "/content/"
		},
		nextPage: [".chlist>tbody>tr", ".pagination>.next>a", {
			pag: ".pagination"
		}],
		getLists: () => {
			let name = q(".page-header").innerText;
			return cl(".chlist>tbody a", {
				cb: ({
					text
				}) => ({
					text: text.replace(name, "Chapter")
				}),
				sort: "r"
			});
		},
		getSrcs: {
			cb: (dom) => {
				let code = findScript('"showmanga":', dom);
				return strToObject(code, '"showmanga":').paths.filter(str => str.startsWith("http"));
			}
		}
	}, {
		siteName: "MangaCherri",
		homePage: "https://mangacherri.com/",
		sort: "comic",
		comicName: ".story-name",
		cover: ".comic-img",
		url: {
			h: "mangacherri.com"
		},
		getLists: () => cl(".chapters-container a", {
			cb: ({
				text
			}) => ({
				text: "Chapter " + text
			}),
			sort: "r"
		}),
		getSrcs: ".reading-container>img"
	}, {
		siteName: (o) => o.url.t,
		homePage: ["https://kaliscan.com/home", "https://mgjinx.com/home", "https://mangabuddy.com/home", "https://mangacute.com/", "https://mangamonk.com/", "https://mangafab.com/", "https://mangasaga.com/", "https://boxmanhwa.com/", "https://mangaxyz.com/", "https://mangapub.com/"],
		sort: "comic",
		comicName: ".detail>.name>h1",
		cover: "#cover img",
		url: {
			t: ["KaliScan", "MGJinx", "MangaBuddy", "MangaCute", "MangaMonk", "MangaFab", "MangaSaga", "BoxManhwa", "MangaXYZ", "MangaPub"],
			e: "#chapter-list"
		},
		init: () => {
			if (location.host == "mangapub.com") {
				return fn.wait(() => ("loadMoreChapters" in unsafeWindow)).then(() => {
					unsafeWindow.loadMoreChapters();
				});
			}
		},
		getLists: () => cl("#chapter-list a", {
			textNode: ".chapter-title",
			sort: "r"
		}),
		getSrcs: {
			cb: (dom) => {
				if (["KaliScan", "MGJinx"].some(t => document.title.includes(t))) {
					let code = findScript("chapterId", dom);
					let chapterId = numVar(code, "chapterId");
					return ajax.doc("/service/backend/chapterServer/?server_id=1&chapter_id=" + chapterId).then(d => q([".chapter-image"], d));
				}
				let code = findScript("var bookId = ", dom);
				if (code) {
					return strVar(code, "indicators", '"').split(",");
				}
				code = findScript("chapImages", dom);
				return code.split("'").at(1).split(",").map(src => fn.rs(src, [
					[new URL(src).host, "sb.mbbcdn.com"],
					["/res/", "/"]
				]));
			},
			attr: "data-src"
		},
		referer: "url"
	}, {
		siteName: ["MangaNato", "MangaNato", "MangaNato", "MangaNato", "Mangabat", "MangaKakalot", "MangaKakalot", "MangaKakalot"],
		homePage: ["https://www.natomanga.com/", "https://www.nelomanga.com/", "https://www.nelomanga.net/", "https://www.manganato.gg/", "https://www.mangabats.com/", "https://www.mangakakalove.com/", "https://www.mangakakalot.gg/", "https://www.mangakakalot.fan/"],
		sort: "comic",
		comicName: ".manga-info-text h1",
		cover: ".manga-info-pic>img",
		url: {
			t: ["MangaNato", "MangaKakalot", "MangaNelo", "Mangabat"],
			p: "/manga/"
		},
		getLists: () => cl(".chapter-list a[title]", {
			sort: "r"
		}),
		getSrcs: {
			cb: (dom) => {
				let code = findScript("chapterImages", dom);
				let cdns = strToArray(code, "cdns");
				let chapterImages = strToArray(code, "chapterImages");
				return chapterImages.map(e => cdns.at(0) + "/" + e);
			}
		},
		referer: "url"
	}, {
		siteName: ["MangaHub.io", "MangaHub.us", "1Manga.co", "MangaReader.site", "MangaNel.me", "OneManga.info", "MangaHere.onl", "MangaOnline.fun", "MangaFox.fun", "MangaToday.fun", "MangaKakalot.fun"],
		homePage: (o) => o.url.h.map(h => `https://${h}/`),
		sort: "comic",
		info: "下載前要先在閱讀頁打開一個章節取得cookie,後續又拿不到圖片就重複操作，無法取得目錄就重新載入頁面。",
		url: {
			h: ["mangahub.io", "mangahub.us", "1manga.co", "mangareader.site", "manganel.me", "onemanga.info", "mangahere.onl", "mangaonline.fun", "mangafox.fun", "mangatoday.fun", "mangakakalot.fun"]
		},
		spa: true,
		page: () => lp("/manga/") && lp(3),
		observeURL: "head",
		waitEle: [".container-fluid h1", ".container-fluid img.manga-thumb"],
		x: () => {
			if (location.host == "mangaonline.fun") return "m02";
			if (location.host == "mangatoday.fun") return "m03";
			if (location.host == "mangahub.us") return "m04";
			if (location.host == "mangafox.fun") return "mf01";
			if (location.host == "mangahere.onl") return "mh01";
			if (location.host == "mangakakalot.fun") return "mn01";
			if (location.host == "onemanga.info") return "mn02";
			if (location.host == "1manga.co") return "mn03";
			if (location.host == "manganel.me") return "mn05";
			if (location.host == "mangareader.site") return "mr01";
			return "m01";
		},
		api: (body) => ajax.json("https://api.mghcdn.com/graphql", {
			headers: {
				"content-type": "application/json",
				"x-mhub-access": fn.cookie("mhub_access")
			},
			body,
			method: "POST"
		}),
		getLists: () => {
			let mslug = lpsa();
			return _this.api(JSON.stringify({
				query: `{manga(x:${_this.x()},slug:"${mslug}"){title,image,chapters{number}}}`
			})).then(json => {
				let {
					image: cover,
					title: mtitle,
					chapters
				} = json.data.manga;
				comicName = mtitle;
				return chapters.map(({
					number
				}) => ({
					mid: mslug,
					cid: number,
					cover: "https://thumb.mghcdn.com/" + cover,
					text: `Chapter ${number}`,
					url: `/chapter/${mslug}/chapter-${number}`
				}));
			});
		},
		getSrcs: (url, item) => {
			let {
				mid,
				cid
			} = item.dataset;
			return _this.api(JSON.stringify({
				query: `{chapter(x:${_this.x()},slug:"${mid}",number:${Number(cid)}){pages}}`
			})).then(json => {
				try {
					let {
						p,
						i: images
					} = JSON.parse(json.data.chapter.pages);
					return images.map(e => `https://imgx.mghcdn.com/${p + e}`);
				} catch (error) {
					console.error(error);
					return [];
				}
			});
		}
	}, {
		siteName: ["MangaHere", "Manga Fox", "Manga Home"],
		homePage: ["https://www.mangahere.cc/latest/", "https://fanfox.net/releases/", "https://www.mangahome.com/latest"],
		sort: "comic",
		info: "有些漫畫會封鎖部分地區IP",
		comicName: ".detail-info-right-title-font,.manga-detail>h1",
		cover: ".detail-info-cover-img,.manga-detail img.detail-cover",
		url: {
			h: ["www.mangahere.cc", "fanfox.net", "mangafox.la", "www.mangahome.com"],
			p: "/manga/"
		},
		getLists: () => cl("#chapterlist a[title],.manga-detailchapter>.detail-chlist a", {
			textNode: "p,.pc-none",
			sort: "r"
		}),
		getSrcs: {
			cb: (dom, url, item) => {
				let code = findScript("newImgs", dom);
				if (code) {
					let str = fn.parseCode(code);
					return strToArray(str, "newImgs");
				}
				code = findScript("imagecount", dom);
				if (!code) return [];
				let imagecount = numVar(code, "imagecount");
				let croot = fn.dir(url);
				let chapterid = numVar(code, "chapterid") || numVar(code, "chapter_id");
				let fetchNum = 0;
				let keyE = q("#dm5_key", dom);
				let key = keyE?.value || "";
				updateS(item, `${DL.status.s0}：${DL.status.get.s1}`);
				updateP(item, `${DL.progress}：0/${imagecount}`);
				let resArr = fn.arr(imagecount, (v, i) => {
					let params = new URLSearchParams({
						cid: chapterid,
						page: i + 1,
						key: key
					});
					let api = `${croot}chapterfun.ashx?${params}`;
					return ajax.text(api).then(r_text => {
						fetchNum++;
						updateP(item, `${DL.progress}：${fetchNum}/${imagecount}`);
						let text = fn.parseCode(r_text);
						let pix = strVar(text, "pix");
						let pvalue = strToArray(text, "pvalue");
						return pix + pvalue[0];
					});
				});
				return Promise.all(resArr);
			}
		}
	}, {
		siteName: ["MangaTown"],
		homePage: ["https://www.mangatown.com/latest/"],
		sort: "comic",
		comicName: ".title-top",
		cover: ".detail_info>img",
		url: {
			h: ["www.mangatown.com"],
			p: "/manga/"
		},
		getLists: () => {
			let cn = q(_this.comicName).innerText;
			return cl(".chapter_content>.chapter_list a", {
				cb: ({
					text
				}) => ({
					text: text.replace(cn, "").trim()
				}),
				sort: "r"
			});
		},
		getSrcs: {
			cb: (dom, url, item) => {
				let [v, t] = ["#viewer .image", "total_pages"]
				if (q(v, dom)) {
					return q([v], dom);
				}
				let code = findScript(t, dom);
				let max = numVar(code, t);
				let pages = fn.arr(max, (v, i) => i == 0 ? url : url + `${i + 1}.html`);
				return ajax.pages(url, item, {
					pages,
					target: "#image"
				});
			}
		}
	}, {
		siteName: "МангаПоиск",
		homePage: "https://mangap.ru/",
		sort: "comic",
		url: {
			h: ["mangap.ru"]
		},
		spa: true,
		page: () => lp("/manga/") && lp(3),
		observeURL: "head",
		waitEle: [".card-header>h1>span+span", "#page-content header+section img[title]"],
		json: (dom) => {
			let pageData = q("#app[data-page]", dom).dataset.page;
			let json = JSON.parse(pageData);
			json = {
				manga: json.props.manga.data,
				chapter: json.props.chapter.data
			};
			return json;
		},
		getLists: () => {
			let cover = q(_this.waitEle.at(1)).src;
			return ajax.doc(lp()).then(dom => {
				return ajax.json(lp() + "?tab=chapters", {
					headers: {
						"content-type": "application/json",
						"x-inertia": "true",
						"x-inertia-partial-component": "Manga/Show",
						"x-inertia-partial-data": "tab,chapters",
						"x-inertia-version": JSON.parse(q("#app[data-page]", dom).getAttribute("data-page")).version,
						"x-requested-with": "XMLHttpRequest",
						"x-xsrf-token": fn.cookie("XSRF-TOKEN")
					}
				}).then(json => {
					return ajax.doc(json.props.chapters.data[0].link).then(dom => {
						let json = _this.json(dom);
						comicName = json.manga.title;
						return ajax.json(`/manga/${lpsa(2)}/chapterSelector/${json.chapter.id}`).then(json => {
							return json.chapters.map(({
								title,
								link
							}) => ({
								cover,
								text: title,
								url: link
							})).reverse();
						});
					});
				});
			});
		},
		getSrcs: {
			cb: (dom) => _this.json(dom).chapter.pages.map(e => e.link)
		}
	}, {
		siteName: "Olympus Scanlation",
		homePage: "https://olympusbiblioteca.com/",
		sort: "comic",
		comicName: "main h1",
		url: {
			h: ["olympusbiblioteca.com"]
		},
		spa: true,
		page: () => lp("/series/") && lp(3),
		observeURL: "head",
		waitEle: ["main h1", "main img.object-cover"],
		json: (dom) => fn.parseCode(findScript("__ZEROSCANS__", dom)).data.at(0),
		getLists: () => {
			let cover = q("main img.object-cover").src;
			let m_id = lpsa().replace("comic-", "");
			const get_json = (id, p) => ajax.json(`https://dashboard.olympusbiblioteca.com/api/series/${id}/chapters?page=${p}&direction=asc&type=comic`);
			const get_c = (json) => json.data.map(({
				id,
				name
			}) => ({
				mid: m_id,
				cid: id,
				cover,
				text: `Capítulo ${name}`,
				url: `/capitulo/${id}/comic-${m_id}`
			}));
			return get_json(m_id, 1).then(json => {
				if (json.meta.last_page > 1) {
					let jsons = [json];
					let resArr = fn.arr(json.meta.last_page - 1, (v, i) => get_json(m_id, i + 2));
					return Promise.all(resArr).then(res => {
						jsons = [...jsons, ...res];
						return jsons.map(j => get_c(j)).flat();
					});
				}
				return get_c(json);
			});
		},
		getSrcs: (url, item) => {
			let {
				mid,
				cid
			} = item.dataset;
			return ajax.json(`/api/capitulo/${mid}/${cid}?type=comic`).then(json => json?.chapter?.pages || []);
		}
	}, {
		siteName: "InManga",
		homePage: "https://inmanga.com/",
		sort: "comic",
		comicName: ".panel-heading>h1",
		cover: ".panel img",
		url: {
			h: ["inmanga.com"],
			p: "/ver/manga/"
		},
		getLists: () => cl("#ChaptersContainer>a.viewed-chapter", {
			textNode: "span",
			sort: "r"
		}),
		getSrcs: (url) => fn.iframe(url, {
			waitEle: "#PageList option",
			wait: (_, frame) => isString(frame?.pageController?._containers?.pageUrl),
		}).then(({
			frame,
			dom
		}) => q(["#PageList option"], dom).map((e, i) => frame.pageController._containers.pageUrl.replace("pageNumber", i).replace("identification", e.value)))
	}, {
		siteName: "AnimeBbg",
		homePage: "https://animebbg.net/",
		sort: "comic",
		url: {
			h: ["animebbg.net"],
			p: "/capitulos"
		},
		nextPage: ["div[data-type=resource_album_link]>.block", ".pageNav-page--current+li>a", {
			pag: ".block-outer--after"
		}],
		getLists: () => {
			comicName = q(".avatar>img").alt;
			return q(["div[data-type=resource_album_link]>.block>.block-container"]).map(i => ({
				cover: q("img", i).src,
				text: q(".structItem-title>a", i).innerText,
				url: q("a", i).href
			}));
		},
		getSrcs: {
			target: ".itemList .js-lbImage",
			attr: "data-src"
		},
		fetch: 0
	}, {
		siteName: "ZonaTMO",
		homePage: "https://zonatmo.com/",
		sort: "comic",
		cover: ".book-thumbnail",
		url: {
			h: ["zonatmo.com"],
			p: "/manga/",
			e: "h1.element-title"
		},
		init: () => fn.wait(() => ("showAllChapters" in unsafeWindow)).then(() => unsafeWindow.showAllChapters()),
		getLists: () => {
			comicName = q("h1.element-title").firstChild.textContent.replace(/\n/g, "").trim();
			let cover = q(".book-thumbnail").src;
			return q(["#chapters .list-group-item[data-index] .list-group-item:first-child a.btn:has(.fa-play)"]).map(a => ({
				cover,
				text: q("a", c(".list-group-item:has(h4)", a)).innerText,
				url: a.href
			})).reverse();
		},
		getSrcs: {
			cb: (dom) => {
				let code = findScript("dirPath", dom);
				let dirPath = strVar(code, "dirPath");
				code = strSlicer(code, "var images =", ")");
				return fn.run(code).map(e => dirPath + e);
			}
		}
	}, {
		siteName: ["LeerCapitulo", "MangaPanda", "MangaReader"],
		url: {
			h: ["www.leercapitulo.co", "www.mangapanda.in", "mangareader.in"],
			p: "/manga/"
		},
		...wpMangaParams,
		...{
			getSrcs: (url) => fn.iframeEle(url, "#page_select option").then(eles => eles.map(e => e.value))
		}
	}, {
		siteName: "NovaManga",
		homePage: "https://novamanga.com/",
		sort: "comic",
		comicName: ".items-center+img[alt^=Cover]+h1",
		cover: "img[alt^=Cover].border",
		url: {
			h: "novamanga.com",
			p: "/series/"
		},
		getLists: () => cl("a.recentCardItem", {
			textNode: "p",
			sort: "r"
		}),
		getSrcs: {
			target: ".content>img[id^=img][data-src]",
			attr: "data-src"
		}
	}, {
		siteName: "Assorted Scans",
		homePage: "https://assortedscans.com/reader/",
		sort: "comic",
		info: "需要解除CSP",
		comicName: "#series-title",
		cover: "#series>img",
		url: {
			h: ["assortedscans.com"],
			p: "/reader/"
		},
		getLists: () => cl("#series-chapters>.chapter>a", {
			sort: "r"
		}),
		getSrcs: {
			target: "#page-image",
			pages: ".dropdown-list:has(.page-details)>li:not(:first-child)>a"
		}
	}, {
		siteName: "BaoTangTruyen",
		homePage: "https://baotangtruyen36.top/",
		sort: "comic",
		url: {
			t: "BaoTangTruyen"
		},
		spa: true,
		page: () => lp("/truyen-tranh/") && lp(3),
		observeURL: "head",
		waitEle: ".rounded>div>.justify-center>img[alt].object-cover",
		ah: "https://api.chilltruyentranh.site",
		getLists: () => {
			let cover = q(_this.waitEle).src;
			let mid = lpsa();
			return ajax.json(`${_this.ah}/comic/${mid}`).then(json => {
				comicName = json.name;
				return json.chapters.map(o => ({
					mid,
					cid: o.slug,
					cover,
					text: o.title,
					url: `/truyen-tranh/${mid}/${o.slug}`
				})).reverse();
			});
		},
		getSrcs: (url, item) => {
			let {
				mid,
				cid
			} = item.dataset;
			return ajax.json(`${_this.ah}/comic/${mid}/${cid}`).then(json => json.images.map(e => _this.ah + e));
		}
	}, {
		siteName: "TruyenSieuHay",
		homePage: "http://truyensieuhay.com/danhsach/index.html?status=0&sort=2",
		sort: "comic",
		comicName: ".info-story>.title>h1",
		cover: ".info_pic img",
		url: {
			h: ["truyensieuhay.com"]
		},
		getLists: () => cl(".list-chap-story a", {
			sort: "r"
		}),
		decrypt: (des, id) => {
			const CryptoJS = addCryptoJSLibrary();
			const key = CryptoJS.enc.Utf8.parse(id.substring(2, id.length - 3).toLowerCase());
			const iv = CryptoJS.enc.Utf8.parse('gqLOHUioQ0QjhuvI');
			return CryptoJS.AES.decrypt(des, key, {
				iv: iv,
				mode: CryptoJS.mode.CBC,
			}).toString(CryptoJS.enc.Utf8);
		},
		getSrcs: {
			cb: (dom) => {
				let bc = q("#btn_report_chap", dom)?.getAttribute("onclick");
				if (!bc) return [];
				let [, sID, , chuc] = bc.split("'");
				return ajax.json("/Service.asmx/getContentChap", {
					headers: {
						"content-type": "application/json; charset=UTF-8",
						"x-requested-with": "XMLHttpRequest"
					},
					body: `{ sID: '${sID}', chuc:'${chuc}' }`,
					method: "POST"
				}).then(json => {
					let {
						id,
						des
					} = JSON.parse(json.d);
					let html = _this.decrypt(des, id);
					let dom = fn.doc(html);
					return [...dom.images];
				});
			}
		}
	}, {
		siteName: "TruyenQQ",
		homePage: "https://truyenqqno.com/",
		sort: "comic",
		comicName: ".book_info h1",
		cover: ".book_info img",
		url: {
			e: "meta[property='og:site_name'][content^=TruyenQQ]",
			p: "/truyen-tranh/"
		},
		getLists: () => cl(".list_chapter a", {
			sort: "r"
		}),
		getSrcs: {
			target: ".chapter_content .page-chapter>img[data-original]",
			attr: "data-original"
		}
	}, {
		siteName: "FoxTruyen",
		homePage: "https://foxtruyen.com/",
		sort: "comic",
		comicName: ".title_tale>h1",
		cover: ".thumbblock>img",
		url: {
			e: "meta[property='og:site_name'][content=FoxTruyen]",
			p: "/truyen-tranh/"
		},
		getLists: () => cl(".list_chap a", {
			sort: "r"
		}),
		getSrcs: ".content_detail_manga>img"
	}, {
		siteName: "TopTruyen",
		homePage: "https://www.toptruyentv12.com/",
		sort: "comic",
		comicName: ".title-manga",
		cover: ".image-info>img.image-comic",
		url: {
			e: "meta[property='og:site_name'][content=TopTruyen]",
			p: "/truyen-tranh/"
		},
		getLists: () => cl("#list-chapter-dt li:not([style])>.chapters>a", {
			sort: "r"
		}),
		getSrcs: ".list-image-detail>[id^=page]>img"
	}, {
		siteName: "NewTruyenTranh",
		homePage: "https://newtruyentranh5.com/",
		sort: "comic",
		comicName: ".title-detail",
		cover: ".avatar>img",
		url: {
			t: "NewTruyenTranh",
			p: "/truyen-tranh/"
		},
		getLists: () => cl("#nt_listchapter .chapter>a", {
			sort: "r"
		}),
		getSrcs: ".reading-detail>.page-chapter>img"
	}, {
		siteName: [
			"Toongod",
			"Toonily",
			"cookieManhwaHub",
			"Manhuascan.us",
			"HiperDEX",
			"ReadManga18",
			"Manga18fx",
			"ManhwaHub",
			"MANYTOON",
			"Ero18x",
			"Manhwa-latino",
			"Manhwa-es",
			"Manga-shi",
			"Manhwa18",
			"MadaraDex",
			"Manhwatoon",
			"MangaDNA"
		],
		info: "ManhwaHub需要瑱入cookie",
		url: {
			h: [
				"www.toongod.org",
				"toonily.com",
				"manhwahub.net",
				"manhuascan.us",
				"hiperdex.com",
				"readmanga18.com",
				"manga18fx.com",
				"manhwahub.me",
				"manytoon.com",
				"ero18x.com",
				"manhwa-latino.com",
				"manhwa-es.com",
				"manga-shi.org",
				"manhwa18.org",
				"madaradex.org",
				"www.manhwatoon.me",
				"mangadna.com"
			],
			p: ["/comic/", "/manga/", "/manhwa", "/webtoon/", "/komik/", "/title/"]
		},
		...wpMangaParams,
		...{
			sort: "ero-comic",
			hide: "#adult_modal,#madaradex-shield-overlay,.modal-backdrop"
		}
	}, {
		siteName: "Temple Scan",
		homePage: "https://templetoons.com/",
		sort: "ero-comic",
		comicName: "main h1[class*=className]",
		url: {
			h: ["templetoons.com"],
			p: "/comic/",
			e: ".grid>a:has(h1):not(:has(span>svg))"
		},
		getLists: () => q([_this.url.e]).map(a => ({
			cover: q("img", a).src,
			text: q("h1", a).innerText,
			url: a.href
		})).reverse(),
		getSrcs: {
			cb: (dom) => {
				let str = __next_f(dom);
				return strToArray(str, '"images":').filter(isImage);
			}
		}
	}, {
		siteName: "KuManga",
		homePage: "https://www.kumanga.com/",
		sort: "ero-comic",
		cover: ".media-sidebar__cover>img",
		url: {
			h: ["www.kumanga.com"],
			p: "/manga/",
			e: ".media-name__main"
		},
		init: () => fn.wait(() => ("load_other_chapters" in unsafeWindow)).then(() => unsafeWindow.load_other_chapters()),
		getLists: () => {
			comicName = q(".media-name__main").firstChild.textContent;
			return cl(".media-chapters-list a", {
				sort: "r"
			});
		},
		getSrcs: {
			cb: (dom) => {
				let leer = q("a#leer", dom);
				if (!leer) return [];
				return fn.iframeEle(leer.href, "div[x-data^=imageGallery] img");
			},
			attr: "data-src"
		}
	}, {
		siteName: "ManhwaWeb",
		homePage: "https://manhwaweb.com/",
		sort: "ero-comic",
		url: () => {
			if (location.host != "manhwaweb.com") return false;
			return lp("/manhwa/") && lp(3);
		},
		getLists: () => {
			let mid = lpsa();
			return ajax.json(`https://manhwawebbackend-production.up.railway.app/manhwa/see/${mid}`).then(json => {
				comicName = json.name_esp;
				return json.chapters.map(({
					chapter,
					link
				}) => ({
					mid,
					cid: chapter,
					cover: json._imagen,
					text: `Capitulo ${chapter}`,
					url: link
				}));
			});
		},
		getSrcs: (url, item) => {
			let {
				mid,
				cid
			} = item.dataset;
			return ajax.json(`https://manhwawebbackend-production.up.railway.app/chapters/see/${mid}-${cid}`).then(json => json.chapter.img);
		}
	}, {
		siteName: ["Mangahub.ru"],
		homePage: ["https://mangahub.ru/"],
		sort: "ero-comic",
		comicName: "#main-container h1,div.h1",
		cover: "img.cover",
		url: {
			h: ["mangahub.ru"],
			p: "/title/"
		},
		getLists: () => ajax.doc(`/title/${lpsa(2)}/chapters`).then(dom => cl(".detail-chapter a:has(span)", {
			doc: dom,
			textNode: "span",
			sort: "r"
		})),
		getSrcs: {
			target: ".reader-viewer-img",
			attr: "data-src"
		}
	}, {
		siteName: "MangaOni",
		homePage: "https://manga-oni.com/",
		sort: "ero-comic",
		comicName: ".post-title>a",
		cover: ".portada>img",
		url: {
			h: ["manga-oni.com"],
			p: ["/manga/", "/manhua/", "/manhwa/"]
		},
		getLists: () => cl("#c_list>a", {
			textNode: "h3",
			sort: "r"
		}),
		getSrcs: (url) => fn.iframe(url, {
			waitVar: ["hojas", "dir"]
		}).then(({
			frame,
		}) => {
			let {
				dir,
				hojas
			} = frame;
			return hojas.map(e => dir + e);
		})
	}, {
		siteName: "M440.in",
		homePage: "https://m440.in/",
		sort: "ero-comic",
		comicName: "#title",
		cover: ".manga-name+img",
		url: {
			h: ["m440.in"],
			p: "/manga/"
		},
		init: () => fn.waitEle("a[data-whatever]").then(() => {
			let pag = q("pag[onclick]");
			if (isEle(pag)) {
				if ("initChapters" in unsafeWindow) {
					let max = pag.innerText.match(/\d+/g).at(-1);
					for (let i = 2; i <= max; i++) {
						unsafeWindow.initChapters(i);
					}
				}
			}
		}),
		getLists: () => {
			let cover = q(".manga-name+img").src;
			return q(["a[data-whatever]+a"]).map(a => ({
				cover,
				text: fn.rs(a.previousSibling.textContent + a.innerText, [
					[/^[\s#]+/, "Capitulo "],
					[/\s?⠇/, ":"]
				]),
				url: a.href
			})).reverse();
		},
		getSrcs: {
			target: "#all img",
			attr: "data-src"
		}
	}, {
		siteName: "HotComics",
		homePage: "https://w1.hotcomics.me/",
		sort: "ero-comic",
		comicName: ".episode-title>span",
		url: {
			t: "HotComics",
			e: ".episode-contents"
		},
		getLists: () => q(["#tab-chapter a[onclick]"]).map(a => {
			let url = a.getAttribute("onclick").split("'").at(1);
			return {
				text: "Episode " + url.split("-").at(-2),
				url
			}
		}),
		getSrcs: "#viewer-img img",
		gmzip: 1
	}, {
		siteName: ["Heytoon", "Webtooni"],
		homePage: ["https://heytoon.net/", "https://webtooni.net/"],
		sort: "ero-comic",
		comicName: "#titleSubWrapper>h1",
		url: {
			t: ["Heytoon", "Webtooni"],
			e: ".episodeListConPC"
		},
		getLists: () => q([".episodeListConPC>a"]).map(a => ({
			cover: q("img", a).dataset?.src || q("img", a)?.src,
			text: q(".comicInfo p", a).innerText,
			url: a.href
		})),
		getSrcs: "#comicContent img"
	}, {
		siteName: "KingsManga",
		homePage: "https://www.kingsmanga.net/",
		sort: "ero-comic",
		url: {
			h: "www.kingsmanga.net",
			p: "/manga/",
			e: ".title-heading-left"
		},
		getLists: () => {
			comicName = q(".title-heading-left").innerText;
			return q([".table-bordered a"]).map(a => ({
				text: fn.rs(a.innerText, [
					["อ่าน ", ""],
					[comicName, "Chapter"]
				]),
				url: a.href
			})).reverse();
		},
		getSrcs: ".post-content img"
	}, {
		siteName: "鸟鸟韩漫",
		homePage: "https://nnhanman8.com/",
		sort: "ero",
		comicName: ".Introduct_Sub h1>font",
		cover: "#Cover img",
		url: {
			t: "鸟鸟韩漫",
			e: "[id^='mh-chapter-list']"
		},
		getLists: () => cl("#list a", {
			sort: "r"
		}),
		getSrcs: {
			target: "img[data-original]",
			attr: "data-original"
		}
	}, {
		siteName: "巴卡漫画",
		homePage: "https://bakamh.com/",
		sort: "ero",
		comicName: "#manga-title>h1",
		cover: ".profile-manga .summary_image img",
		url: {
			t: "巴卡漫画",
			e: ".page-content-listing"
		},
		getLists: () => cl(".listing-chapters_main a", {
			urlAttr: "storage-chapter-url",
			sort: "r"
		}),
		getSrcs: ".reading-content .wp-manga-chapter-img"
	}, {
		siteName: "Xpicvid逆次元",
		homePage: "https://www.xpicvid.com/listinfo-15-0.html",
		sort: "ero",
		info: "日漫、韩漫",
		comicName: ".panel-heading>div[itemprop=name]>h1",
		cover: "#album_photo_cover img",
		url: {
			e: [".footer .pull-left:text:逆次元", "#episode-block"],
			p: "/showinfo-"
		},
		getLists: () => cl(".episode a", {
			textNode: {
				s: ".current_series",
				n: "text"
			},
			sort: "r"
		}),
		getSrcs: {
			target: ".row.thumb-overlay-albums img,.artwork-container .artwork img",
			attr: "data-src"
		}
	}, {
		siteName: "老司機禁漫",
		homePage: "https://laosiji53.org/",
		sort: "ero",
		comicName: ".detail h1",
		cover: ".detail-cover img",
		url: {
			t: "老司機禁漫",
			e: ".nav-item.nav-link.active:text:漫畫章節"
		},
		getLists: () => cl(".nav+.row:not(.comic-list) a", {
			sort: "r"
		}),
		getSrcs: {
			target: "img[data-original]",
			attr: "data-original"
		}
	}, {
		siteName: (o) => o.url.t,
		homePage: ["https://www.ikanmh.xyz/", "https://www.hmkll.com/", "https://akmahua.com/", "https://manhuadashu.xyz/", "https://manhuashijie.xyz/", "https://manhuacang.xyz/", "https://se8.us/", "https://www.aammhh.com/"],
		sort: "ero",
		comicName: ".banner_detail_form>.info>h1,.de-info__box>.comic-title,.book>.info>.txt>h1",
		cover: ".banner_detail_form>.cover>img,.de-info__cover>img,.book>.info>.cover>img",
		url: {
			t: ["漫小肆", "韩漫连连看", "爱看漫画", "漫画大叔", "漫画世界", "漫画仓", "韩漫库", "韩漫之家"]
		},
		getLists: () => cl("#detail-list-select a,.chapter__list-box a,.book-chapter>a"),
		getSrcs: {
			target: ".comiclist img,#cp_img img,#enc_img img,.rd-article-wr img,.images img",
			attr: "data-original",
			next: "#nextPage"
		}
	}, {
		siteName: (o) => o.url.t,
		homePage: () => ["18rouman.org", "rmtt7.com", "atm166.org", "xman8.org", "daniao8.com", "ttjm7.com", "aman8.org", "darenmh.org", "rman8.com", "wumtt.com", "xiaoniao6.org", "long6.org", "jmd8.com/", "jmd8.com"].map(h => `https://${h}/`),
		sort: "ero",
		comicName: ".stui-content__detail>.title,.content_detail .title,.detail-title h1,.hl-detail-content .hl-dc-title,.b586afc9>h1,.module-info-heading>h1,.video-info-header>.page-title",
		cover: ".stui-content__thumb img,.content_thumb>a,.detail-pic>img,.hl-detail-content>.hl-dc-pic>.hl-item-thumb,.ba330>img,.module-info-poster .module-item-pic>img,.module-item-cover>.module-item-pic>img",
		url: {
			t: ["肉肉漫画", "肉漫天堂", "凹凸漫", "X漫", "大鸟禁漫", "天堂禁漫", "A漫", "大人漫画", "肉漫屋", "污漫天堂", "小鸟禁漫", "龙禁漫", "禁漫岛", "H漫"]
		},
		getLists: () => cl(".stui-content__playlist a,#playlistbox .content_playlist a,.episode-list a,#hl-plays-list a,.module-play-list-link,.module-tab~.module-blocklist a"),
		getSrcs: {
			target: "img.lazyload[data-original],center:has(>div>img) img,#main .content img",
			attr: "data-original"
		}
	}, {
		siteName: (o) => o.url.t,
		homePage: () => ["https://mhds8.com/", "https://kxmanhua.com/"],
		sort: "ero",
		comicName: ".gm-vod .title,.anime__details__title>h3",
		cover: ".gm-vod>.img,.anime__details__pic",
		url: {
			t: ["漫畫大濕", "开心看漫画"]
		},
		getLists: () => cl("#dom-source .list>a,.chapter_list a", {
			sort: "r"
		}),
		getSrcs: {
			target: ".gm-read>img,.blog__details__content img",
			attr: "data-original"
		},
		referer: "url"
	}, {
		siteName: ["爱看福利社", "美女图福利社", "美集福利社", "激动社", "47O福利社", "74P福利社", "08G福利社", "79福利社", "59福利社"],
		hosts: ["2kl.net", "meinvtu.xyz", "beautifuls.xyz", "exciteds.xyz", "47o.net", "74p.net", "08g.net", "79011.net", "59669.net"],
		homePage: (o) => o.hosts.map(h => `https://www.${h}/comic/category/kr`),
		sort: "ero",
		info: "日漫、韩漫",
		comicName: ".fk>.bk",
		cover: "#xinxi img",
		url: {
			e: [".fk>.bk+ul a", "#body-header-top", "#footer-boot:text:社"],
			p: "/comic/list/"
		},
		getLists: () => cl(".fk>.bk+ul a"),
		getSrcs: ".image-stack img"
	}, {
		siteName: "Manhwa18",
		homePage: "https://manhwa18.com/",
		sort: "ero",
		comicName: ".series-name>a",
		cover: ".series-cover .content.img-in-ratio",
		url: {
			h: ["manhwa18.com"],
			p: "/manga/"
		},
		getLists: () => {
			let cover = fn.getBackgroundImage(q(_this.cover));
			return q([".list-chapters>a"]).map(a => ({
				cover,
				text: q(".chapter-name", a).innerText,
				url: a.href
			}));
		},
		getSrcs: {
			target: "#chapter-content>img",
			attr: "data-src"
		}
	}, {
		siteName: "ManhwaSusu",
		homePage: "https://manhwasusu.com/",
		sort: "ero",
		comicName: "main h1:not(:has(*))",
		cover: "main img[alt][style]",
		url: {
			h: "manhwasusu.com",
			p: "/read/"
		},
		getLists: () => cl("h1+div.flex>a", {
			textNode: "div>p",
			sort: "r"
		}),
		getSrcs: {
			target: ".min-h-screen .min-h-screen>div[q\\:key]>img",
			attr: "data-src"
		}
	}, {
		siteName: ["Hanman18", "Manga18", "18PornComic"],
		homePage: ["https://hanman18.com/", "https://manga18.club/", "https://18porncomic.com/"],
		sort: "ero",
		comicName: ".detail_name>h1",
		cover: ".detail_avatar>img",
		url: {
			h: ["hanman18.com", "manga18.club", "18porncomic.com"],
			p: ["/manhwa/", "/comic/"]
		},
		getLists: () => cl(".detail_chapterContent a.chapter_num,.detail_chapterContent a.chapter_numclick_hilltop_click", {
			sort: "r"
		}),
		getSrcs: {
			cb: (dom) => {
				let code = findScript("slides_p_path", dom);
				return strToArray(code, "slides_p_path").map(e => atob(e));
			}
		}
	}, {
		siteName: [
			"All Porn Comics",
			"MANGA DISTRICT",
			"ManhwaBuddy",
			"manga18free",
			"Manhwaclub",
			"Hipercool",
			"cookieYaoiscan",
			"Lily Manga",
			"Hentai20",
			"Pornhwaz",
			"ManhwaDen",
			"Mangaforfree.com",
			"Mangaforfree.net"
		],
		info: "Yaoiscan需要填入cookie",
		url: {
			h: [
				"allporncomics.co",
				"mangadistrict.com",
				"manhwabuddy.com",
				"manga18free.com",
				"manhwaclub.net",
				"hiper.cool",
				"yaoiscan.com",
				"lilymanga.net",
				"hentai20.io",
				"www.pornhwaz.com",
				"www.manhwaden.com",
				"mangaforfree.com",
				"mangaforfree.net"
			],
			p: ["/comic/", "/manga/", "/manhwa/", "/webtoon/", "/serie/", "/title/", "/read/", "/gl/"]
		},
		...wpMangaParams,
		...{
			sort: "ero"
		},
		referer: "url"
	}, {
		siteName: ["KumoPoi", "tooncn", "Manhwahentai", "Hentai20"],
		url: {
			h: ["kumopoi.org", "tooncn.net", "manhwahentai.io", "hentai20.online"],
			p: ["/manga/", "/webtoon/"]
		},
		...wpMangaParams,
		...ts_reader,
		...{
			sort: "ero"
		}
	}, {
		siteName: ["LectorManga"],
		url: {
			h: ["mangalector.com"],
			p: ["/manga/"]
		},
		...wpMangaParams,
		...{
			sort: "ero",
			getSrcs: {
				cb: (dom) => {
					let p = q(".reading-content>#arraydata", dom);
					return p ? p.textContent.split(",") : [];
				}
			}
		}
	}, {
		siteName: ["Omega Scans"],
		homePage: ["https://omegascans.org/"],
		sort: "ero",
		url: {
			h: ["omegascans.org"]
		},
		spa: true,
		page: () => lp("/series/") && !lp("/chapter-"),
		observeURL: "head",
		waitEle: "next-route-announcer",
		getLists: () => ajax.doc(lp()).then(dom => {
			comicName = q("section h1", dom).innerText;
			let code = __next_f(dom);
			let id = Number(strSlicer(code, '"series_id":', ",").match(/\d+/));
			return ajax.json(`https://api.omegascans.org/chapter/query?page=1&perPage=1000&series_id=${id}`).then(json => json.data.map(({
				chapter_name,
				chapter_slug,
				chapter_thumbnail
			}) => ({
				cover: chapter_thumbnail,
				text: chapter_name,
				url: `${lh()}/${chapter_slug}`
			})).reverse());
		}),
		getSrcs: {
			target: "#content .container img:not(.rounded)",
			attr: "data-src"
		}
	}, {
		siteName: ["Hentai18", "Hentaifull", "Truyenhentaivn"],
		homePage: ["https://hentai18.net/", "https://hentaifull.net/", "https://truyenhentaivn.icu/"],
		sort: "ero",
		comicName: ".title_content h1",
		cover: ".hentai-cover>img",
		url: {
			h: ["hentai18.net", "hentaifull.net", "truyenhentaivn.icu"],
			p: ["/read-hentai/", "/hentai/"]
		},
		getLists: () => cl("#chapter-list a", {
			sort: "r",
		}),
		getSrcs: {
			target: ".chapter-content img"
		}
	}, {
		siteName: "ManhwaRead",
		homePage: "https://manhwaread.com/",
		sort: "ero",
		comicName: ".manga-titles>h1",
		cover: "#mangaSummary img",
		url: {
			h: ["manhwaread.com"],
			p: "/manhwa/"
		},
		getLists: () => cl("#chaptersList a", {
			textNode: ".chapter-item__name"
		}),
		headers: () => ({
			accept: localStorage.getItem("webp_support") ? "image/webp,image/*" : "image/*",
		}),
		getSrcs: {
			cb: (dom) => {
				let code = findScript("chapterData", dom);
				let chapterData = strToObject(code, "chapterData");
				let {
					data,
					base
				} = chapterData
				return JSON.parse(atob(data)).map(e => base + "/" + e.src);
			}
		}
	}, {
		siteName: ["TooniTube", "Toonily", "BeeHentai"],
		homePage: ["https://toonitube.com/", "https://toonily.me/", "https://beehentai.com/"],
		sort: "ero",
		comicName: ".book-info h1",
		cover: ".img-cover>img",
		url: {
			t: ["TooniTube", "Toonily", "BeeHentai"],
			e: "#chapter-list"
		},
		getLists: () => cl("#chapter-list a", {
			textNode: ".chapter-title",
			sort: "r"
		}),
		getSrcs: {
			target: ".chapter-image>img[data-src]",
			attr: "data-src"
		}
	}, {
		siteName: "DocTruyen3Q",
		homePage: "https://doctruyen3qui19.com/",
		sort: "ero",
		comicName: ".title-manga",
		cover: ".image-info>img.image-comic",
		url: {
			e: "meta[property='og:site_name'][content^=DocTruyen3Q]",
			p: "/truyen-tranh/"
		},
		getLists: () => cl("#list-chapter-dt li:not([style])>.chapters>a", {
			sort: "r"
		}),
		getSrcs: ".list-image-detail>div[id].page-chapter>img"
	}, {
		siteName: "Vinahentai",
		homePage: "https://vinahentai.com/",
		sort: "ero",
		comicName: "section h1",
		cover: "section .flex>img[src*=story-images]",
		url: {
			h: ["www.vinahentai.com", "vinahentai.com"],
			p: "/truyen-hentai/"
		},
		getLists: () => cl("#manga-description-section+div>.relative>div>a", {
			textNode: "span",
			sort: "r"
		}),
		getSrcs: {
			cb: (dom) => {
				let code = findScript("enqueue", dom);
				code = code.replace("window.__reactRouterContext.streamController.enqueue", "JSON.parse").replaceAll(";", "");
				let srcs = fn.run(code).filter(e => {
					if (isString(e)) {
						if (e.includes("/manga-images/")) {
							return true;
						}
					}
					return false;
				})
				return srcs;
			}
		}
	}, {
		siteName: "HentaiVn",
		homePage: "https://www.hentaivnx.com/",
		sort: "ero",
		comicName: ".title-detail",
		cover: ".detail-info img",
		url: {
			t: "HentaiVn",
			p: "/truyen-hentai/"
		},
		getLists: () => cl("#nt_listchapter .chapter>a", {
			sort: "r"
		}),
		getSrcs: {
			target: ".page-chapter img",
			attr: "data-src"
		}
	}];
	// 網站規則結束

	// 工具函數

	// 取得語系
	const getLanguage = () => {
		if (config.language == "ui") {
			switch (navigator.language) {
			case "zh-TW":
			case "zh-HK":
			case "zh-MO":
			case "zh-Hant-TW":
			case "zh-Hant-HK":
			case "zh-Hant-MO":
				return "tw";
			case "zh":
			case "zh-CN":
			case "zh-SG":
			case "zh-MY":
			case "zh-Hans-CN":
			case "zh-Hans-SG":
			case "zh-Hans-MY":
				return "cn";
			default:
				return "en";
			}
		}
		return config.language;
	};

	// 儲存腳本設定
	const saveConfig = (options) => {

		config.language = options[0].value;
		config.theme = options[1].value;
		config.autoOpenPanel = options[2].value;
		config.min = options[3].value;
		config.editTitle = options[4].value;
		config.downloadAPI = options[5].value;
		config.downloadDB = options[6].value;
		config.articleThread = options[7].value;
		config.imageThread = options[8].value;
		config.singleThreadInterval = options[9].value;
		config.retry = options[10].value;
		config.interval = options[11].value;
		config.compressedExtension = options[12].value;
		config.zipFolder = options[13].value;
		config.zipJson = options[14].value;
		config.onlyJson = options[15].value;
		config.onlyText = options[16].value;
		config.webpToJpg = options[17].value;
		config.avifToJpg = options[18].value;
		config.jpgQuality = options[19].value;
		config.nhentaiServ = options[20].value;
		config.hitomiImgType = options[21].value;
		config.manhuaguiImgServ = options[22].value;
		config.rpc = options[23].value;
		config.dir = options[24].value;
		config.token = options[25].value;

		localStorage.setItem("articleImageDownloadAppConfig", JSON.stringify({
			articleThread: config.articleThread,
			imageThread: config.imageThread,
			singleThreadInterval: config.singleThreadInterval,
			retry: config.retry,
			interval: config.interval,
			downloadVideo: config.downloadVideo
		}));

		GM_setValue("language", config.language);
		GM_setValue("theme", config.theme);
		GM_setValue("autoOpenPanel", config.autoOpenPanel);
		GM_setValue("min", config.min);
		GM_setValue("editTitle", config.editTitle);
		GM_setValue("downloadAPI", config.downloadAPI);
		GM_setValue("downloadDB", config.downloadDB);
		GM_setValue("compressedExtension", config.compressedExtension);
		GM_setValue("zipFolder", config.zipFolder);
		GM_setValue("zipJson", config.zipJson);
		GM_setValue("onlyJson", config.onlyJson);
		GM_setValue("onlyText", config.onlyText);
		GM_setValue("webpToJpg", config.webpToJpg);
		GM_setValue("avifToJpg", config.avifToJpg);
		GM_setValue("jpgQuality", config.jpgQuality);
		GM_setValue("nhentaiServ", config.nhentaiServ);
		GM_setValue("hitomiImgType", config.hitomiImgType);
		GM_setValue("manhuaguiImgServ", config.manhuaguiImgServ);
		GM_setValue("rpc", config.rpc);
		GM_setValue("dir", config.dir);
		GM_setValue("token", config.token);

		queue.run();

		GM_unregisterMenuCommand(gMenuA);
		GM_unregisterMenuCommand(gMenuB);
		gMenuA = GM_registerMenuCommand("💬 Greasy Fork " + i18n[getLanguage()].feedback, () => GM_openInTab("https://greasyfork.org/scripts/555974/feedback"));
		gMenuB = GM_registerMenuCommand(i18n[getLanguage()].openUI, createUI);
		// debug("儲存設定", config);
	};

	// UI填入設定的值
	const setConfig = (options) => {
		options[0].value = config.language;
		options[1].value = config.theme;
		options[2].value = config.autoOpenPanel;
		options[3].value = config.min;
		options[4].value = config.editTitle;
		options[5].value = config.downloadAPI;
		options[6].value = config.downloadDB;
		options[7].value = config.articleThread;
		options[8].value = config.imageThread;
		options[9].value = config.singleThreadInterval;
		options[10].value = config.retry;
		options[11].value = config.interval;
		options[12].value = config.compressedExtension;
		options[13].value = config.zipFolder;
		options[14].value = config.zipJson;
		options[15].value = config.onlyJson;
		options[16].value = config.onlyText;
		options[17].value = config.webpToJpg;
		options[18].value = config.avifToJpg;
		options[19].value = config.jpgQuality;
		options[20].value = config.nhentaiServ;
		options[21].value = config.hitomiImgType;
		options[22].value = config.manhuaguiImgServ;
		options[23].value = config.rpc;
		options[24].value = config.dir;
		options[25].value = config.token;
	};

	// 腳本設定恢復為預設值
	const setDefault = () => {
		const yes = confirm(DL.confirm.a);
		if (yes) {
			for (const key of GM_listValues()) GM_deleteValue(key);
			localStorage.removeItem("articleImageDownloadAppConfig");
			location.reload();
			return;
		}
	};

	const resetWebsiteSettings = () => {
		const yes = confirm(DL.confirm.s);
		if (yes) {
			localStorage.removeItem("articleImageDownloadAppConfig");
			location.reload();
			return;
		}
	};

	const resetGlobalSettings = () => {
		const yes = confirm(DL.confirm.g);
		if (yes) {
			for (const key of GM_listValues()) GM_deleteValue(key);
			location.reload();
			return;
		}
	};

	// idb封裝IndexedDB的再簡化封裝的類
	class IDBCache {
		constructor(dbName = "articleImageDownloadDB", object = "history") {
			this.dbName = dbName;
			this.object = object;
			this.dbPromise = idb.openDB(dbName, 1, {
				upgrade(db) {
					db.createObjectStore(object);
				}
			});
		}
		async get(key = "urls") {
			return (await this.dbPromise).get(this.object, key);
		}
		async set(val, key = "urls") {
			return (await this.dbPromise).put(this.object, val, key);
		}
		async clear() {
			return (await this.dbPromise).clear(this.object);
		}
	}
	// 創建記錄下載歷史的IndexedDB實例
	const DH = new IDBCache();
	//await DH.clear();

	// 取得下載歷史
	const getDB = async (key = "articleImageDownloadDB") => {
		const data = await DH.get();
		if (key in localStorage && !data) {
			const old = localStorage.getItem(key);
			await DH.set(JSON.parse(old));
			const _new = await DH.get();
			return new Set(_new);
		}
		if (data) {
			return new Set(data);
		}
		return new Set();
	};
	const db = await getDB();

	// 儲存下載歷史
	const saveDB = async () => {
		try {
			await DH.set([...db]);
		} catch {
			db.clear();
			await DH.clear();
		}
	};

	// 清除下載歷史
	const clearDB = async () => {
		const yes = confirm(DL.confirm.h);
		if (yes) {
			db.clear();
			localStorage.removeItem("articleImageDownloadDB");
			await DH.clear();
		}
	};

	// 主控台列出紀錄
	const debug = (str, obj = "", title = "debug") => console.log(`%c[AIQD_APP 圖集隊列下載器] ${title}:`, "color: #eee;background-color: rgb(82, 82, 122);", str, obj);

	// 延遲
	const delay = (time) => new Promise(resolve => setTimeout(resolve, time));

	// 判斷物件類型
	const getType = (object) => Object.prototype.toString.call(object).replace("[object ", "")?.replace("]", "");
	const isString = str => getType(str) === "String";
	const isNumber = num => getType(num) === "Number";
	const isBoolean = b => getType(b) === "Boolean";
	const isRegExp = reg => getType(reg) === "RegExp";
	const isObject = obj => getType(obj) === "Object";
	const isArray = arr => getType(arr) === "Array";
	const isSet = set => getType(set) === "Set";
	const isFn = fn => getType(fn).endsWith("Function");
	const isPromise = p => getType(p) === "Promise";
	const isBlob = b => getType(b) === "Blob";
	const isArrayBuffer = b => getType(b) === "ArrayBuffer";
	const isEle = e => getType(e).endsWith("Element") || getType(e) === "DocumentFragment";
	const isImage = (src) => {
		src = String(src);
		if (src.includes("/")) {
			src = src.split("/").at(-1);
		}
		return /\.(png|jpe?g|webp|avif|gif|svg|ico|bmp|tiff?|jfif|heif|heic|raw|cr2|nef|arw|dng)/i.test(src);
	};
	const isVideo = (src) => {
		src = String(src);
		if (src.includes("/")) {
			src = src.split("/").at(-1);
		}
		return /\.(mp4|avi|mkv|mov|wmv|flv|webm|mpeg|mpg|3gp|m4v|ts|vob|ogv|rm|rmvb|m2ts|mxf|asf|swf)/i.test(src);
	};
	const isURL = (url) => {
		if ("canParse" in URL) {
			return URL.canParse(url);
		}
		try {
			new URL(url);
			return true;
		} catch {
			return false;
		}
	};

	const urlFn = (p, u) => {
		if (isNumber(p)) {
			return u.split("/").length == p;
		}
		if (isString(p)) {
			return u.includes(p);
		}
		if (isRegExp(p)) {
			return p.test(u);
		}
		return u;
	};

	const lh = (p) => urlFn(p, location.href);

	const lp = (p) => urlFn(p, location.pathname);

	const lpsa = (a = -1) => location.pathname.split("/").at(a);

	const ls = (p) => urlFn(p, location.search);

	// 返回元素CSS
	const q = (selector, node = document) => {
		if (isArray(selector)) {
			if (String(selector).includes(":text:")) {
				const selectors = selector.join(",").split(",");
				return selectors.map(s => {
					if (s.includes(":text:")) {
						try {
							const [textSelector, containsText] = s.split(":text:");
							const elements = [...node.querySelectorAll(textSelector)];
							return elements.filter(e => e.outerHTML.includes(containsText));
						} catch (error) {
							console.log("CSS陣列選擇器錯誤\n", error);
							return [];
						}
					} else {
						return [...node.querySelectorAll(s)];
					}
				}).flat();
			} else {
				return [...node.querySelectorAll(selector.join(","))];
			}
		}
		let containsText;
		if (selector.includes(":text:") && selector.includes(",")) {
			const selectors = selector.split(",");
			const elements = selectors.map(s => q(s, node)).filter(Boolean);
			return elements.length ? elements.at(0) : null;
		} else if (selector.includes(":text:")) {
			[selector, containsText] = selector.split(":text:");
		}
		const element = node.querySelector(selector);
		if (containsText && element) {
			if (!element.outerHTML.includes(containsText)) {
				return null;
			}
		}
		return element;
	};

	// 返回最近的父元素
	const c = (selector, node) => node.closest(selector);

	// 返回A元素的網址陣列
	const u = (selector, node = document) => [...new Set(q([selector], node)?.map(a => a?.href))]?.filter(Boolean).filter(e => !String(e).includes("javascript")) || [];

	// 取多個連結文字中的最大數字
	const um = (selector, node = document) => {
		let arr;
		if (isArray(selector)) {
			arr = selector;
		} else {
			arr = q([selector], node);
		}
		return arr.map(a => Number(a.innerText.replaceAll(".", ""))).filter(Boolean).sort((a, b) => a - b).at(-1);
	};

	// 返回元素XPath
	const x = (selector, contextNode = null, dom = document) => {
		if (isArray(selector)) {
			selector = selector.join("|");
			const nodes = [];
			const results = dom.evaluate(selector, (contextNode || document), null, XPathResult.ANY_TYPE, null);
			let node = null;
			while (node = results.iterateNext()) nodes.push(node);
			return nodes;
		}
		return dom.evaluate(selector, (contextNode || document), null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	};

	// 取得常見的放置圖片網址的屬性
	const getImgAttr = (img, attr = null) => {
		if (!isEle(img)) return null;
		let src = null;
		let a;
		for (a of attr || ["img", "original", "data-echo", "data-lazy-src", "data-original-src", "data-original", "data-src"]) {
			if (img.hasAttribute(a)) {
				src = img.getAttribute(a);
				break;
			}
		}
		a = null;
		return src;
	};

	// 泛用取得文章列表函式
	const al = (s = null, n = null) => q([s || _this.url.e]).map(a => {
		if (a.closest(".pagetual_pageBar")) return null;
		try {
			return {
				cover: getImgAttr(q("img", a)) || q("img", a).src,
				text: fn.rs(String(n ? (q(n, a)?.title || q(n, a)?.textContent) : (a?.ariaLabel || a?.title || q("img", a)?.alt || q("img", a)?.title)).trim(), [
					["Permanent Link to ", ""],
					[/\s–\s\d+\spics$/, ""],
					[/<font[^>]+>|<\/font>/g, ""],
					[/<strong>|<\/strong>/g, ""],
				]),
				url: a?.href || q("a", a)?.href
			};
		} catch (error) {
			debug("錯誤A", a);
			console.error(error);
			return null;
		}
	});

	// 泛用取得漫畫目錄列表函式
	const cl = (target, details = {}) => {
		let {
			doc,
			apiCover,
			node,
			textNode,
			urlNode,
			urlAttr,
			sort,
			cb
		} = details;
		let dom = document;
		if ("doc" in details) {
			dom = doc;
		}
		let cover;
		if (isString(apiCover || _this.cover) || isArray(apiCover || _this.cover)) {
			let s = apiCover || _this.cover;
			if (isArray(s)) {
				s = s.join(",");
			}
			let e = q(s, apiCover ? dom : document);
			if (e) {
				cover = e.dataset?.setbg || e.dataset?.lazySrc || e.dataset?.original || e.dataset?.src || e.getAttribute("src");
			}
		}
		let chapters = [];
		let eles = [];
		if ("node" in details) {
			dom = q(node, dom);
		}
		if (isArray(target)) {
			if (isEle(target.at(0))) {
				eles = target;
			} else {
				eles = q([target], dom);
			}
		} else {
			eles = q([target], dom);
		}
		if ("wp" in _this) {
			eles = eles.filter(e => !e.closest(".popular-content"));
		}
		chapters = eles.map(e => {
			let text, url;
			text = e.dataset?.title || e.innerText;
			if ("textNode" in details) {
				if (isObject(textNode)) {
					let {
						s,
						n
					} = textNode;
					if (n == "text") {
						let node = q(s, e);
						text = [...node.childNodes].find(n => n.nodeName == "#text").textContent;
					} else {
						let node = q(s, e);
						if (node) {
							if (n) {
								node = q(n, node);
							}
							text = node.textContent;
						}
					}
				} else if (textNode == "text") {
					text = [...e.childNodes].find(n => n.nodeName == "#text").textContent;
				} else {
					let node = q(textNode, e);
					if (node) {
						text = node.textContent;
					}
				}
			}
			if (e.tagName == "OPTION") {
				url = e.value;
			} else if ("urlNode" in details) {
				if ("urlAttr" in details) {
					url = q(urlNode, e).getAttribute(urlAttr);
				} else {
					url = q(urlNode, e).href;
				}
			} else if (e.tagName == "A") {
				if ("urlAttr" in details) {
					url = e.getAttribute(urlAttr);
				} else {
					url = e.href;
				}
			}
			text = fn.rs(text.trim(), [
				[/^[#\s]+/, ""]
			]);
			text = text.charAt(0).toUpperCase() + text.slice(1);
			let object = cover ? {
				cover,
				text,
				url
			} : {
				text,
				url
			};
			if ("cb" in details) {
				let cbObject = cb({
					e,
					cover,
					text,
					url
				});
				object = {
					...object,
					...cbObject
				};
			}
			return object;
		});
		let temp = new Set();
		chapters = chapters.filter(o => {
			if (temp.has(o.url)) {
				return false;
			} else {
				temp.add(o.url);
				return true;
			}
		});
		if (sort == "r") {
			chapters = chapters.reverse();
		}
		return chapters;
	};

	// 創建元素
	const createElement = (tag, attr = null, css = null) => {
		const element = document.createElement(tag);
		if (isObject(attr)) {
			if ("dataset" in attr) {
				Object.assign(element.dataset, {
					...attr.dataset
				});
				delete attr.dataset;
			}
			Object.assign(element, {
				...attr
			});
		}
		if (isObject(css)) {
			Object.assign(element.style, {
				...css
			});
		}
		return element;
	};

	// 添加元素
	const addElement = (node, tag, attr = null, css = null) => {
		const element = createElement(tag, attr, css);
		node.append(element);
		return element;
	};

	// 創建style至document.head
	const css = (str, id = null) => {
		if (document.getElementById(id)) return;
		addElement(document.head, "style", {
			type: "text/css",
			id: id ? id : "",
			innerHTML: str
		});
	};

	// 搜尋腳本返回代碼字串
	const findScript = (searchValue, dom = document) => [...dom.scripts]?.find(script => {
		if (isString(searchValue)) {
			return script.textContent.includes(searchValue);
		} else if (isRegExp(searchValue)) {
			return script.textContent.search(searchValue) > -1;
		} else if (isArray(searchValue)) {
			return searchValue.every(k => {
				if (isString(k)) {
					return script.textContent.includes(k);
				} else if (isRegExp(k)) {
					return script.textContent.search(k) > -1;
				}
			});
		}
	})?.textContent;

	const __next_f = (dom = document) => [...dom.scripts].filter(script => ["self.__next_f.push", '"'].every(str => script.textContent.includes(str))).map(script => {
		let code = script.textContent;
		let s_index = code.indexOf('"') + 1;
		let e_index = code.lastIndexOf('"');
		return code.slice(s_index, e_index);
	}).join("").replaceAll("\n", "").replaceAll("\\", "");

	// 切割字串
	const strSlicer = (str, startText, endText) => {
		let a = str.indexOf(startText);
		if (a < 0) return null;
		let startIndex = a + startText.length;
		let endIndex = str.indexOf(endText, startIndex);
		return str.slice(startIndex, endIndex + endText.length);
	};

	// 從字串取得變數物件字串並轉為物件
	const strToObject = (str, key, mode = 1, last = 0) => {
		let a = str.indexOf(key);
		let b = str.indexOf("{", a);
		let c;
		if (last) {
			c = str.lastIndexOf("}") + 1;
		} else {
			c = str.indexOf("}", b) + 1;
		}
		str = str.slice(b, c);
		if (mode == 2) {
			str = str.slice(1, -1).replaceAll("\n", "").replaceAll("'", "").replaceAll('"', "");
			let arr = str.split(",");
			let arr_arr = arr.map(e => {
				try {
					let [k, v] = e.split(":");
					return [k.trim(), v.trim()];
				} catch {
					return null;
				}
			});
			arr_arr = arr_arr.filter(Boolean);
			return Object.fromEntries(arr_arr);
		} else {
			return fn.run(str);
		}
	};

	// 從字串取得變數陣列字串並轉為陣列
	const strToArray = (str, key, last = 0) => {
		let a = str.indexOf(key);
		let b = str.indexOf("[", a);
		let c;
		if (last) {
			c = str.lastIndexOf("]") + 1;
		} else {
			c = str.indexOf("]", b) + 1;
		}
		str = str.slice(b, c);
		return fn.run(str);
	};

	// 從字串取得變數字串
	const strVar = (str, key, end = ";") => {
		let a = str.indexOf(key);
		if (a < 0) return null;
		let b = str.indexOf("=", a);
		let c = str.indexOf(end, b);
		if (end == '"' || end == "'" || end == "`") {
			c = str.indexOf(end, c + 1);
		}
		str = str.slice(b + 1, c).replaceAll("'", "").replaceAll('"', "").replaceAll("`", "").trim();
		return String(str);
	};

	// 從字串取得變數數字
	const numVar = (str, key, end = ";") => {
		let a = str.indexOf(key);
		if (a < 0) return null;
		let b = str.indexOf("=", a);
		let c = str.indexOf(end, b);
		str = str.slice(b + 1, c);
		return Number(str);
	};

	// 隨機抽取陣列中的其中一個
	const arrayOne = (array) => array.at(Math.floor(Math.random() * array.length));

	// 隱藏html和body的y滾動條
	const hidePageScrollbarY = () => css("html,body{overflow-y:hidden !important}#pagetual-sideController{display:none}", "overflowYHidden");

	// 元素添加事件監聽器
	const addEL = (element, eventType, listener) => element.addEventListener(eventType, listener, true);

	// 阻止元素事件預設行為和禁止事件冒泡
	const cancelDefault = (event) => {
		event.preventDefault();
		event.stopPropagation();
	};

	// 取得事件的元素座標
	const getXY = (event) => ({
		x: event.clientX,
		y: event.clientY
	});

	// 更新元素的文字節點的文字
	const updateText = (element, str) => (element.firstChild.textContent = str);
	const updateT = (str) => updateText(uiTitle, str);
	const updateS = (item, str) => updateText(item.children[8], str);
	const updateP = (item, str) => updateText(item.children[9], str);

	// 更新列表的索引文字
	const updateIndex = () => {
		for (const [index, item] of [...articleList.children].entries()) {
			if (item.classList.contains("toolbar")) continue;
			updateText(item.firstElementChild, index - 1);
		}
	};

	// 注入JSZip依賴庫
	const addJSZipLibrary = () => {
		if ("gmzip" in _this) return null;
		if (unsafeWindow?.JSZip?.version !== "3.10.1") {
			GM_addElement(document.body, "script", {
				textContent: JSZip_code
			});
		}
		return unsafeWindow?.JSZip;
	};

	// 注入CryptoJS依賴庫
	const addCryptoJSLibrary = () => {
		if (!("CryptoJS" in unsafeWindow)) {
			GM_addElement(document.body, "script", {
				textContent: CryptoJS_code
			});
		}
		return unsafeWindow.CryptoJS;
	};

	// 下載儲存
	const saveData = (blob, fileName) => {
		const href = URL.createObjectURL(blob);
		const a = createElement("a", {
			href,
			download: fileName
		});
		EClick(a);
		setTimeout(() => {
			blob = null;
			URL.revokeObjectURL(href);
		}, 4000);
	};

	// 模擬點擊
	const EClick = (element) => {
		if (!isEle(element)) return;
		const event = new MouseEvent("click", {
			bubbles: true,
			cancelable: true,
			view: unsafeWindow
		});
		element.dispatchEvent(event);
	};

	//取得參照頁
	const getReferer = (src, item) => {
		let referer;
		if (isString(siteData.referer) && siteData.referer == "url") {
			referer = item.dataset.url;
		} else if (/vipr\.im|imagetwist\.com|imgspice\.com/.test(src) || siteData.referer == "src") {
			referer = src;
		} else if (/\.sinaimg\./.test(src)) {
			referer = "https://weibo.com/";
		} else if (/imgtaxi\.com/.test(src)) {
			referer = "https://imgtaxi.com/";
		} else if (/saint2\.su/.test(src)) {
			referer = "https://saint2.su/";
		} else if (/imhentai\.xxx/.test(src)) {
			referer = "https://imhentai.xxx/";
		} else if (/mitaku\.net/.test(src)) {
			referer = "https://mitaku.net/";
		} else if (isString(siteData.referer) || siteData.referer == "") {
			referer = siteData.referer;
		} else {
			referer = location.origin + "/";
		}
		return referer;
	};

	// 取得cookie
	const getCookie = () => {
		if (isEnabledCookie && inputCookie.value != "") {
			return inputCookie.value;
		}
		return "";
	};

	const windowKey = () => debug("window的有效屬性\n", Object.fromEntries(Object.entries(unsafeWindow).filter(arr => !!arr[1])));

	const clearSetTimeout = () => {
		let endTid = unsafeWindow.setTimeout(() => {});
		for (let i = 0; i <= endTid; i++) {
			unsafeWindow.clearTimeout(i);
		}
		debug("已清除setTimeout");
	};

	const clearSetInterval = () => {
		let endIid = unsafeWindow.setInterval(() => {});
		for (let i = 0; i <= endIid; i++) {
			unsafeWindow.clearInterval(i);
		}
		debug("已清除clearInterval");
	};

	const getDate = (t = "Current time") => {
		const date = new Date();
		return `${t}：${date.getHours()}h:${date.getMinutes()}m:${date.getSeconds()}s:${date.getMilliseconds()}ms`;
	};

	const fetchDOM = () => {
		debug(getDate("開始要求"));
		ajax.doc(lh()).then(dom => {
			debug(getDate("要求結束"));
			debug("當前頁面的DOM\n", dom);
		});
	};

	const fetchElement = () => {
		let css = prompt("輸入CSS選擇器", ".entry-content img");
		if (!css) return;
		debug(getDate("開始要求"));
		ajax.doc(lh()).then(dom => {
			debug(getDate("要求結束"));
			debug("當前頁面的元素\n", q(css, dom));
		});
	};

	const fetchElementArray = () => {
		let css = prompt("輸入CSS選擇器", ".entry-content img");
		if (!css) return;
		debug(getDate("開始要求"));
		ajax.doc(lh()).then(dom => {
			debug(getDate("要求結束"));
			debug("當前頁面的元素陣列\n", q([css], dom));
		});
	};

	const svg = {
		a: '<svg class="icon" fill="currentColor" viewBox="0 0 1024 1024"><path d="M429.4 959c-12 0-24.1-3.2-35.1-9.7-26.7-15.8-39.3-46.6-31.4-76.6l61.7-233.2-278.2-46.6c-26.2-4.4-47-22.9-54.5-48.3s0.1-52.3 19.7-70.1L539 85.4c22.9-20.8 56-23.9 82.3-7.6 26.3 16.3 38.3 47.2 29.9 77l-59.6 211.4 279 46.7c25.8 4.3 46.6 22.5 54.3 47.6s0.7 51.8-18.3 69.8l-430 409.6c-13.2 12.6-30.1 19.1-47.2 19.1zM204.6 511.4l257.9 43.2c19 3.2 35.9 14.3 46.3 30.5 10.4 16.2 13.6 36.1 8.7 54.8l-48.3 182.7 344.3-327.9-260.3-43.6c-19.2-3.2-36.2-14.5-46.6-31-10.4-16.4-13.4-36.6-8.1-55.3l45.8-162.5-339.7 309.1z" fill="#333333"></path></svg>',
		x: '<svg class="icon" fill="currentColor" viewBox="0 0 1024 1024"><path d="M842.947 778.117l-266.1-266.104 266.1-266.13c8.675-8.674 13.447-20.208 13.439-32.478-0.009-12.232-4.773-23.715-13.415-32.332-8.655-8.678-20.15-13.45-32.385-13.457-12.286 0-23.808 4.771-32.474 13.434L512.019 447.144 245.882 181.05c-8.663-8.663-20.175-13.434-32.416-13.434-12.24 0-23.752 4.77-32.414 13.432-8.66 8.637-13.43 20.125-13.438 32.357-0.008 12.27 4.764 23.804 13.438 32.477l266.135 266.13L181.05 778.118c-8.664 8.663-13.436 20.173-13.436 32.415 0 12.24 4.773 23.753 13.438 32.418 8.662 8.663 20.173 13.432 32.413 13.432 12.24 0 23.754-4.77 32.416-13.432L512.015 576.85l266.102 266.1c8.663 8.664 20.186 13.433 32.443 13.433 12.265-0.008 23.749-4.771 32.369-13.412 17.887-17.89 17.893-46.98 0.018-64.854z"></path></svg>',
		minus: '<svg class="icon" fill="currentColor" viewBox="0 0 1024 1024"><path d="M832 464H192a48 48 0 1 0 0 96h640a48 48 0 1 0 0-96z" fill=""></path></svg>',
		maximize: '<svg class="icon" fill="currentColor" viewBox="0 0 1024 1024"><path d="M836.224 917.333333h-644.266667a85.589333 85.589333 0 0 1-85.333333-85.333333V187.733333a85.589333 85.589333 0 0 1 85.333333-85.333333h644.266667a85.589333 85.589333 0 0 1 85.333333 85.333333v644.266667a91.690667 91.690667 0 0 1-85.333333 85.333333zM191.957333 170.666667a22.869333 22.869333 0 0 0-21.333333 21.333333v644.266667a22.869333 22.869333 0 0 0 21.333333 21.333333h644.266667a22.869333 22.869333 0 0 0 21.333333-21.333333V192a22.869333 22.869333 0 0 0-21.333333-21.333333z"></path></svg>',
		move: '<svg class="icon" fill="currentColor" viewBox="0 0 1024 1024"><path d="M512 938.666667l-170.666667-170.666667h341.333334l-170.666667 170.666667z m0-853.333334l170.666667 170.666667H341.333333l170.666667-170.666667z m0 512a85.333333 85.333333 0 1 1 0-170.666666 85.333333 85.333333 0 0 1 0 170.666666zM85.333333 512l170.666667-170.666667v341.333334l-170.666667-170.666667z m853.333334 0l-170.666667 170.666667V341.333333l170.666667 170.666667z"></path></svg>',
		download: '<svg class="icon" fill="currentColor" viewBox="0 0 1024 1024"><path d="M168 660.032a16 16 0 0 1 16 14.72v133.248h659.008v-132.032a16 16 0 0 1 16-16h64a16 16 0 0 1 16 16v164.032a64 64 0 0 1-62.72 64H152a64 64 0 0 1-64-62.72v-165.312a16 16 0 0 1 16-16h64z m379.648-564.8a16 16 0 0 1 14.72 15.168v364.352l128.64-127.68a16 16 0 0 1 19.2-2.56l3.328 2.56 45.248 45.312 1.408 1.536a16 16 0 0 1-1.408 21.12L538.24 634.048l-0.192-0.192-9.344 9.472a16 16 0 0 1-18.944 2.752l-3.392-2.56-126.72-120.768a16 16 0 0 1-0.192-0.192L268.224 416.512a16 16 0 0 1-0.64-22.528l43.648-46.848a16 16 0 0 1 22.656-0.832l132.48 124.8V111.168l0.128-1.216a16 16 0 0 1 15.104-14.72z"></path></svg>',
		link: '<svg class="icon" fill="currentColor" viewBox="0 0 1024 1024"><path d="M853.333333 469.333333a42.666667 42.666667 0 0 0-42.666666 42.666667v256a42.666667 42.666667 0 0 1-42.666667 42.666667H256a42.666667 42.666667 0 0 1-42.666667-42.666667V256a42.666667 42.666667 0 0 1 42.666667-42.666667h256a42.666667 42.666667 0 0 0 0-85.333333H256a128 128 0 0 0-128 128v512a128 128 0 0 0 128 128h512a128 128 0 0 0 128-128v-256a42.666667 42.666667 0 0 0-42.666667-42.666667z" fill="#231F20"></path><path d="M682.666667 213.333333h67.413333l-268.373333 267.946667a42.666667 42.666667 0 0 0 0 60.586667 42.666667 42.666667 0 0 0 60.586666 0L810.666667 273.92V341.333333a42.666667 42.666667 0 0 0 42.666666 42.666667 42.666667 42.666667 0 0 0 42.666667-42.666667V170.666667a42.666667 42.666667 0 0 0-42.666667-42.666667h-170.666666a42.666667 42.666667 0 0 0 0 85.333333z" fill="#231F20"></path></svg>',
		noCover: 'data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0xMjggODMyVjUxMmg2NHYxNDYuNzUybDE5Mi0xOTJMNzQ5LjI0OCA4MzJIODMyVjE5Mkg1MTJWMTI4aDMyMGE2NCA2NCAwIDAgMSA2NCA2NHY2NDBhNjQgNjQgMCAwIDEtNjQgNjRIMTkyYTY0IDY0IDAgMCAxLTY0LTY0eiBtMjU2LTI3NC43NTJsLTE5MiAxOTJWODMyaDQ2Ni43NTJMMzg0IDU1Ny4yNDh6IiBmaWxsPSIjMDAwMDAwIiBmaWxsLW9wYWNpdHk9Ii44NSI+PC9wYXRoPjxwYXRoIGQ9Ik03NjggMzg0YTEyOCAxMjggMCAxIDEtMjU2IDAgMTI4IDEyOCAwIDAgMSAyNTYgMHogbS02NCAwYTY0IDY0IDAgMSAwLTEyOCAwIDY0IDY0IDAgMCAwIDEyOCAwek00MDIuMDQ4IDM1NS44NGwtNDUuMjQ4IDQ1LjE4NC05MC40OTYtOTAuNDk2LTkwLjQ5NiA5MC40OTYtNDUuMzEyLTQ1LjI0OCA5MC41Ni05MC40OTYtOTAuNTYtOTAuNDk2IDQ1LjMxMi00NS4yNDhMMjY2LjI0IDIyMC4wMzJsOTAuNDk2LTkwLjQ5NiA0NS4yNDggNDUuMjQ4LTkwLjQ5NiA5MC40OTYgOTAuNDk2IDkwLjQ5NnoiIGZpbGw9IiMwMDAwMDAiIGZpbGwtb3BhY2l0eT0iLjg1Ij48L3BhdGg+PC9zdmc+'
	};

	const i18n = {
		tw: {
			nav: {
				s1: "網站列表",
				s2: "我的收藏",
				s3: {
					c: "章節列表",
					a: "圖集列表"
				},
				s4: "下載隊列",
				s5: "已完成項",
				s6: "選項設定",
				s7: "特殊說明",
				s8: "開發工具",
				info: {
					s1: "ℹ️點擊標題可修改漫畫名稱",
					s2: "ℹ️按住Shift再鼠標懸停則選取",
					s3: "ℹ️按住Ctrl再鼠標懸停則取消選取",
					s4: "ℹ️列表項拖動可進行排序",
					s5: "ℹ️點擊側邊欄返回列表頂部"
				}
			},
			list: {
				btn: {
					s1: "載入列表",
					s2: "清空列表",
					s3: "補充序號",
					s4: "反轉排序",
					s5: "全部選取",
					s6: "取消全選",
					s7: "開始下載",
					s8: "停止下載",
					s9: "清空完成",
					s10: "略歷選取",
					s11: "排除歷史"
				},
				msg: {
					s1: "等待載入列表",
					s2: "列表載入中",
					s3: "列表已載入",
					s4: "取得列表發生錯誤",
					s5: "與下載和已完成的任務全部重複",
					s6: "列表已清空",
					s7: "返回的是空的陣列"
				},
				info: {
					s1: "總共",
					s2: "個規則",
					s3: "個網站",
					s4: "備註"
				},
				input: {
					s1: "下載影片"
				}
			},
			settings: {
				s0: "語言",
				s1: "主題",
				s2: "匹配到規則時自動載入UI面板",
				s3: "UI面板初始為迷你模式",
				s4: "列表標題可編輯",
				s5: "下載方法",
				s6: "IndexedDB儲存下載過的章節連結",
				s7: "章節最大要求線程數",
				s8: "每章節最大下載線程數",
				s9: "僅為單線程下載時則間隔(秒)",
				s10: "下載錯誤重試次數",
				s11: "下載錯誤重試間隔(秒)",
				s12: "壓縮檔副檔名",
				s13: "壓縮檔裡創建資料夾",
				s14: "壓縮打包時包含JSON",
				s15: "不下載僅匯出JSON",
				s16: "不下載僅匯出TEXT",
				s17: "WEBP轉換為JPG",
				s18: "AVIF轉換為JPG",
				s19: "JPG格式轉換品質",
				s20: "nhentai 圖片伺服器",
				s21: "Hitomi.la 圖片格式",
				s22: "ManHuaGui 漫畫櫃圖片伺服器",
				s23: "Aria2 RPC 位址",
				s24: "Aria2 下載路徑",
				info: {
					s1: "ℹ️標記※為全局設定",
					s2: "ℹ️腳本性質為爬蟲，請用戶謹慎使用，把持好爬取的力度。",
					s3: "ℹ️重新載入UI面板才會生效",
					s4: "ℹ️重新載入列表才會生效，會有卡頓感，最小化拖曳時很明顯。",
					s5: "ℹ️Fetch API和XHR需禁用同源策略Same Origin Policy改為跨網域資源共享Cross-Origin Resource Sharing",
					s6: "ℹ️詳見特殊說明",
					s7: "ℹ️網域不同數據不互通",
					s8: "",
					s9: "ℹ️建議設定為1線程並且設定間隔，無縫連續要求可能會被封IP。",
					s10: "ℹ️會占用大量電腦效能，請依電腦規格評估開多少章節線程合適。",
					s11: "ℹ️同上"
				},
				option: {
					s1: "瀏覽器UI",
					s2: "繁體中文",
					s3: "簡體中文",
					s4: "英文",
					s5: "淺色",
					s6: "深色",
					s7: "預設",
					s8: "啟用",
					s9: "停用"
				},
				btn: {
					s1: "重置所有設定",
					s2: "重置全局設定",
					s3: "重置網站設定",
					s4: "清除下載歷史"
				}
			},
			title: {
				s0: "無題",
				s1: "最小化",
				s2: "最大化",
				s3: "關閉",
				s4: "拖動排序",
				s5: "下載此項",
				s6: "新分頁開啟",
				s7: "你瞅啥標題"
			},
			status: {
				s0: "狀態",
				s1: "挑選中",
				s2: "下載過",
				s3: "排隊中",
				s4: "取得圖片的參數錯誤",
				s5: "沒有圖片網址",
				s6: "圖片格式轉換中",
				s7: "壓縮打包中",
				s8: "已完成",
				s9: "已完成但部分錯誤",
				s10: "已完成但等待",
				s11: "JSON已匯出",
				s12: "TEXT已匯出",
				s13: "JSON&TEXT已匯出",
				s14: "倒數",
				get: {
					s1: "取得分頁中",
					s2: "取得下一頁中",
					s3: "取得圖片網址中",
					s4: "下載圖片中",
					s5: "下載影片中"
				}
			},
			progress: "進度",
			sec: "秒",
			p: "張",
			error: "錯誤",
			uerror: "未知錯誤",
			confirm: {
				a: "確定要重置所有設定嗎？\n將會重新載入頁面",
				s: "確定要重置網站設定嗎？\n將會重新載入頁面",
				g: "確定要重置全局設定嗎？\n將會重新載入頁面",
				c: "尚有任務下載中，確定要關閉面板嗎？\n會停止所有下載任務",
				stop: "確定要停止下載嗎？\n會清除下載隊列",
				h: "確定要清除下載歷史紀錄嗎？"
			},
			alert: {
				s1: "取得資料中請稍後再試",
				s2: "沒有可用的規則",
				s3: "SPA非規則可匹配的頁面",
				s4: "請在選項設定裡填入Aria2 RPC位址和下載路徑",
				s5: "Aria2模式不支援此網站"
			},
			task: "任務",
			openUI: "🖥️ 載入UI面板",
			sort: {
				a: "寫真",
				h: "本子",
				e: "エロ漫",
				c: "漫畫"
			},
			edit: {
				s1: "編輯收藏",
				s2: "匯出",
				s3: "匯入",
				s4: "儲存",
				s5: "取消",
				s6: "編輯收藏的格式",
				s7: "分類,網站名稱,網站網址",
				s8: "恢復預設"
			},
			feedback: "反饋"
		},
		cn: {
			nav: {
				s1: "网站列表",
				s2: "我的收藏",
				s3: {
					c: "章节列表",
					a: "图集列表"
				},
				s4: "下载队列",
				s5: "已完成项",
				s6: "选项设置",
				s7: "特殊说明",
				s8: "开发工具",
				info: {
					s1: "ℹ️点击标题可修改漫画名称",
					s2: "ℹ️按住Shift再鼠标悬停则选取",
					s3: "ℹ️按住Ctrl再鼠标悬停则取消选取",
					s4: "ℹ️列表项拖动可进行排序",
					s5: "ℹ️点击侧边栏返回列表顶部"
				}
			},
			list: {
				btn: {
					s1: "加载列表",
					s2: "清空列表",
					s3: "补充序号",
					s4: "反转排序",
					s5: "全部选取",
					s6: "取消全选",
					s7: "开始下载",
					s8: "停止下载",
					s9: "清空完成",
					s10: "略历选取",
					s11: "排除历史"
				},
				msg: {
					s1: "等待加载列表",
					s2: "列表加载中",
					s3: "列表已加载",
					s4: "取得列表发生错误",
					s5: "与下载和已完成的任务全部重复",
					s6: "列表已清空",
					s7: "返回的是空的数组"
				},
				info: {
					s1: "总共",
					s2: "个规则",
					s3: "个网站",
					s4: "备注"
				},
				input: {
					s1: "下载视频"
				}
			},
			settings: {
				s0: "语言",
				s1: "主题",
				s2: "匹配到规则时自动加载UI面板",
				s3: "UI面板初始为迷你模式",
				s4: "列表标题可编辑",
				s5: "下载方法",
				s6: "IndexedDB保存下载过的章节链接",
				s7: "章节最大请求线程数",
				s8: "每章节最大下载线程数",
				s9: "仅为单线程下载时则间隔(秒)",
				s10: "下载错误重试次数",
				s11: "下载错误重试间隔(秒)",
				s12: "压缩档扩展名",
				s13: "压缩档里创建文件夹",
				s14: "压缩打包时包含JSON",
				s15: "不下载仅导出JSON",
				s16: "不下载仅导出TEXT",
				s17: "WEBP转换为JPG",
				s18: "AVIF转换为JPG",
				s19: "JPG格式转换品质",
				s20: "nhentai 图片服务器",
				s21: "Hitomi.la 图片格式",
				s22: "ManHuaGui 漫画柜图片服务器",
				s23: "Aria2 RPC 地址",
				s24: "Aria2 下载路径",
				info: {
					s1: "ℹ️标记※为全局设定",
					s2: "ℹ️脚本性质为爬虫，请用户谨慎使用，把持好爬取的力度。",
					s3: "ℹ️重新加载UI面板才会生效",
					s4: "ℹ️重新加载列表才会生效，会有卡顿感，最小化拖曳时很明显。",
					s5: "ℹ️Fetch API和XHR需禁用同源策略Same Origin Policy改为跨域名资源共享Cross-Origin Resource Sharing",
					s6: "ℹ️详见特殊说明",
					s7: "ℹ️域名不同数据不互通",
					s8: "",
					s9: "ℹ️建议设定为1线程并且设定间隔，无缝连续请求可能会被封IP。",
					s10: "ℹ️会占用大量电脑效能，请依电脑规格评估开多少章节线程合适。",
					s11: "ℹ️同上"
				},
				option: {
					s1: "浏览器UI",
					s2: "繁体中文",
					s3: "简体中文",
					s4: "英文",
					s5: "浅色",
					s6: "深色",
					s7: "预设",
					s8: "启用",
					s9: "停用"
				},
				btn: {
					s1: "重置所有设定",
					s2: "重置全局设定",
					s3: "重置网站设定",
					s4: "清除下载历史"
				}
			},
			title: {
				s0: "无题",
				s1: "最小化",
				s2: "最大化",
				s3: "关闭",
				s4: "拖动排序",
				s5: "下载此项",
				s6: "新标签开启",
				s7: "你瞅啥标题"
			},
			status: {
				s0: "状态",
				s1: "挑选中",
				s2: "下载过",
				s3: "排队中",
				s4: "取得图片的参数错误",
				s5: "没有图片网址",
				s6: "图片格式转换中",
				s7: "压缩打包中",
				s8: "已完成",
				s9: "已完成但部分错误",
				s10: "已完成但等待",
				s11: "JSON已导出",
				s12: "TEXT已导出",
				s13: "JSON&TEXT已导出",
				s14: "倒数",
				get: {
					s1: "取得分页中",
					s2: "取得下一页中",
					s3: "取得图片网址中",
					s4: "下载图片中",
					s5: "下载视频中"
				}
			},
			progress: "进度",
			sec: "秒",
			p: "张",
			error: "错误",
			uerror: "未知错误",
			confirm: {
				a: "确定要重置所有设定吗？\n将会重新加载页面",
				s: "确定要重置网站设定吗？\n将会重新加载页面",
				g: "确定要重置全局设定吗？\n将会重新加载页面",
				c: "尚有任务下载中，确定要关闭面板吗？\n会停止所有下载任务",
				stop: "确定要停止下载吗？\n会清除下载队列",
				h: "确定要清除下载历史纪录吗？"
			},
			alert: {
				s1: "取得资料中请稍后再试",
				s2: "没有可用的规则",
				s3: "SPA非规则可匹配的页面",
				s4: "请在选项设置里填入Aria2 RPC地址和下载路径",
				s5: "Aria2模式不支援此网站"
			},
			task: "任务",
			openUI: "🖥️ 加载UI面板",
			sort: {
				a: "写真",
				h: "本子",
				e: "エロ漫",
				c: "漫画"
			},
			edit: {
				s1: "编辑收藏",
				s2: "导出",
				s3: "导入",
				s4: "保存",
				s5: "取消",
				s6: "编辑收藏的格式",
				s7: "分类,网站名称,网站网址",
				s8: "恢复默认"
			},
			feedback: "反馈"
		},
		en: {
			nav: {
				s1: "Website List",
				s2: "Favorites",
				s3: {
					c: "Chapter List",
					a: "Article List"
				},
				s4: "Tasks",
				s5: "Completed",
				s6: "Settings",
				s7: "Help",
				s8: "Dev-tools",
				info: {
					s1: "ℹ️Click title to edit the comic name.",
					s2: "ℹ️Hold down the Shift key and hover the mouse over the selection.",
					s3: "ℹ️Hold down the Ctrl key and hover the mouse over the selection to cancel.",
					s4: "ℹ️List items can be dragged and sorted.",
					s5: "ℹ️Click the sidebar to return to top of list."
				}
			},
			list: {
				btn: {
					s1: "Load list",
					s2: "Clear list",
					s3: "Add serial",
					s4: "Reverse sort",
					s5: "Select All",
					s6: "Cancel Select All",
					s7: "Download",
					s8: "Stop downloading",
					s9: "Clear complete",
					s10: "Select non-history",
					s11: "Excluding history"
				},
				msg: {
					s1: "Waiting list to load",
					s2: "List loading",
					s3: "List has been loaded",
					s4: "An error occurred while retrieving the List.",
					s5: "Repeat all downloaded and completed tasks",
					s6: "The List has been cleared.",
					s7: "Returns an empty array."
				},
				info: {
					s1: "Total",
					s2: " rules",
					s3: " websites",
					s4: "Remark"
				},
				input: {
					s1: "Download videos"
				}
			},
			settings: {
				s0: "Language",
				s1: "Themp",
				s2: "Panel will auto open when a rule is matched",
				s3: "Panel is initially in mini mode",
				s4: "List title is editable",
				s5: "Download method",
				s6: "IndexedDB save links to downloaded chapter",
				s7: "Maximum threads for chapter",
				s8: "Maximum download threads for per chapter",
				s9: "When only a single-thread interval(sec)",
				s10: "download error retry count",
				s11: "download error retry interval(sec)",
				s12: "Compressed file extension",
				s13: "Create a folder in compressed file",
				s14: "Include JSON when compressing and packaging",
				s15: "Export only JSON without download",
				s16: "Export only text without download",
				s17: "Convert WEBP to JPG",
				s18: "Convert AVIF to JPG",
				s19: "Convert quality",
				s20: "nhentai image server",
				s21: "Hitomi.la image format",
				s22: "ManHuaGui image server",
				s23: "Aria2 RPC Address",
				s24: "Aria2 Download Dir",
				info: {
					s1: "ℹ️The ※ mark indicates a global setting.",
					s2: "",
					s3: "ℹ️Panel will only take effect after reloading.",
					s4: "ℹ️List will only take effect after reloading.",
					s5: "ℹ️Same-origin policy needs to be disabled for Fetch API and XHR.",
					s6: "ℹ️See details in the help.",
					s7: "ℹ️Data cannot be shared between different domains.",
					s8: "",
					s9: "ℹ️It is recommended to set it to 1 thread and set an interval.",
					s10: "ℹ️It will consume a lot of computer performance.",
					s11: "ℹ️Same as above"
				},
				option: {
					s1: "Browser UI",
					s2: "Traditional Chinese",
					s3: "Simplified Chinese",
					s4: "English",
					s5: "Light",
					s6: "Dark",
					s7: "Default",
					s8: "Enabled",
					s9: "Disabled"
				},
				btn: {
					s1: "Reset all settings",
					s2: "Reset global settings",
					s3: "Reset website settings",
					s4: "Clear download history"
				}
			},
			title: {
				s0: "Untitled",
				s1: "minimize",
				s2: "maximize",
				s3: "close",
				s4: "Drag and drop sorting",
				s5: "Download this item",
				s6: "Open link in new tab",
				s7: "Untitled"
			},
			status: {
				s0: "Status",
				s1: "Selecting",
				s2: "Downloaded",
				s3: "In queue",
				s4: "Incorrect image parameters were retrieved.",
				s5: "No image URL",
				s6: "In conversion",
				s7: "Compression",
				s8: "Completed",
				s9: "Some errors",
				s10: "Wait countdown",
				s11: "JSON exported",
				s12: "TEXT exported",
				s13: "JSON&TEXT exported",
				s14: "Countdown",
				get: {
					s1: "Get pagination",
					s2: "Go to next page",
					s3: "Get image URLs",
					s4: "Download images",
					s5: "Download videos"
				}
			},
			progress: "Progress",
			sec: " Sec",
			p: "P",
			error: "Error",
			uerror: "Unknown error",
			confirm: {
				a: "Are you sure you want to reset all settings? \nThe page will reload.",
				s: "Are you sure you want to reset your website settings? \nThe page will reload.",
				g: "Are you sure you want to reset global settings? \nThe page will reload.",
				c: "There are still tasks downloading. Are you sure you want to close the panel?\nAll download tasks will be stopped.",
				stop: "Are you sure you want to stop the download? \nThis will clear the download queue.",
				h: "Are you sure you want to clear your download history?"
			},
			alert: {
				s1: "Please try again later while retrieving data.",
				s2: "No rules are available.",
				s3: "SPA Pages that cannot be matched by rules",
				s4: "Please enter Aria2 RPC & Download dir in settings.",
				s5: "Aria2 mode does not support this website."
			},
			task: "Task",
			openUI: "🖥️ Open panel",
			sort: {
				a: "Album",
				h: "Hentai",
				e: "Ero Manga",
				c: "Comic"
			},
			edit: {
				s1: "Edit Favorites",
				s2: "Export",
				s3: "Import",
				s4: "Save",
				s5: "Cancel",
				s6: "Format for editing favorites",
				s7: "Category, Website Name, Website URL",
				s8: "Restore default"
			},
			feedback: "Feedback"
		}
	};

	// 迷你模式跑出視口時回到預設位置
	const viewportObserver = new IntersectionObserver((entries) => {
		for (const entry of entries) {
			if (entry.isIntersecting && isMinMode) {
				main.removeAttribute("style");
			} else if (isMinMode) {
				main.removeAttribute("style");
			}
		}
	}, {
		threshold: [0, 0.5]
	});

	// 圖片元素觀察者，圖片進入可視範圍時把data-src屬性寫入src
	const imagesObserver = new IntersectionObserver((entries, observer) => {
		for (let entry of entries) {
			if (entry.isIntersecting) {
				observer.unobserve(entry.target);
				if (entry.target.dataset?.src) {
					setTimeout(() => (entry.target.src = entry.target.dataset.src), 100);
				}
			}
		}
	});

	// 取得漫畫名稱
	const getComicName = () => {
		if ("comicName" in siteData && comicName == "") {
			let s = _this.comicName;
			if (isArray(s)) {
				s = s.join(",");
			}
			let e = q(s);
			if (!isEle(e)) return;
			comicName = [...e.childNodes].find(n => {
				if (n.nodeName == "#text") {
					if (n.textContent.match(/[^\n\t\s]+/) != null) {
						return true;
					}
				}
				return false;
			})?.textContent?.replace(/\n/g, "")?.trim();
			comicName = fn.deleteStr(String(comicName));
			comicName = fn.rs(comicName, [
				["(Official)", ""],
				["«Hitokiri»", ""],
				["MANGA", ""],
				["Manhwa", ""],
				[/^Komik/, ""],
				[/《/g, ""],
				[/》/g, ""]
			]).trim();
		}
	};

	// 迷你模式變數宣告
	let isMinMode = false;

	// 拖曳變數宣告
	let isDragging = false;
	let isMouseDown = false;
	let startX, startY, startLeft, startTop;

	// UI裡的元素變數提升， 便於其他函式調用。
	let DL, main, uiTitle, listMessage, articleList, downloadList, completedList, inputCookie, defaultFavor;

	// 創建UI
	const createUI = async () => {
		if (isOpenUI && q("#DownloadAppUIRoot")) return;
		if ("page" in siteData && "spa" in siteData) {
			if (!_this.page()) return;
		}
		isOpenUI = true;
		await mainInit();
		css("#DownloadAppUIRoot{overflow: clip !important;display: initial !important;position: fixed !important;z-index: 2147483647 !important}", "DownloadAppUIRootCSS");

		// 優先執行
		if ("init" in siteData) {
			await _this.init();
		}

		// 等待元素
		if ("waitEle" in siteData) {
			let s = _this.waitEle;
			if (isArray(s) && "wp" in siteData) {
				s = s.join(",");
			}
			debug("等待元素中：", s);
			await fn.waitEle(s);
			debug("等待元素結束：", s);
		}

		// 點擊元素
		if ("click" in siteData) {
			EClick(q(_this.click));
		}

		// 取得語言
		DL = i18n[getLanguage()];

		// 創建UI影子根元素
		const shadowElement = createElement("div", {
			id: "DownloadAppUIRoot"
		});
		document.body.after(shadowElement);

		// 根元素掛載Shadow DOM
		const shadow = shadowElement.attachShadow({
			mode: "closed"
		});

		hidePageScrollbarY();

		// UI內部的CSS樣式
		addElement(shadow, "style", {
			type: "text/css",
			innerHTML: `
a {
    text-decoration: none;
    color: #1770c6;
}
a.cookie {
    color: #65a961;
}
.downloaded {
    color: #1770c6;
}
#downloading-list .index,
#downloading-list .input,
#downloading-list .move,
#downloading-list .single-download,
#downloading-list .single-aria2-download,
#completed-list .index,
#completed-list .input,
#completed-list .move,
#completed-list .single-download,
#completed-list .single-aria2-download {
    display: none;
}
table tr {
    border-top: 1px solid #000;
}
table th,
table td {
    padding: 6px 13px;
    border: 1px solid #000;
}
table tr:nth-child(2n) {
    background-color: #f6f8fa;
}
#sites,
#help {
    user-select: text;
}
#sites .button {
    user-select: none;
}
#sites,
#favors {
    position: relative;
    height: max-content;
}
#sites .toolbar,
#favors .toolbar {
    position: absolute;
    top: -50px;
    width: 100%;
}
#content:has(#sites:not(.hide)),
#content:has(#favors:not(.hide)) {
    overflow: hidden;
}
#sites-row,
#favors-row{
    height: calc(100vh - 90px);
    margin-top: 50px;
    overflow: auto;
}
#edit-row {
    height: calc(100vh - 50px);
    padding: 10px;
    overflow: auto;
}
#main {
    font-size: 18px;
    line-height: 24px;
    font-family: Microsoft YaHei, Segoe UI, Roboto, Helvetica Neue, Arial,
        Noto Sans, sans-serif;
    font-weight: 500;
    text-align: left;
    user-select: none;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    margin: 0px;
    padding: 0px;
    outline: none;
    border: none;
    position: fixed;
    opacity: 1;
    z-index: 2147483647;
    color: #000;
    background-color: #fff;
}
#main.min {
    width: 184px;
    height: 36px;
    top: unset;
    bottom: 16px;
    left: unset;
    right: 16px;
}
#main.dark {
    filter: invert(100%);
}
#main.dark .cover-image:not([src^="data"]),
#main.dark #popup-image:not([src^="data"]),
#main.dark .info-image {
    filter: invert(100%);
}
.info-image {
    max-width: 1600px;
}
#head {
    text-align: center;
    display: flex;
    height: 36px;
    line-height: 36px;
    background-color: #b5cece;
}
#head-title {
    font-size: 16px;
    width: calc(100% - 74px);
}
#head-title.min {
    width: 110px;
    cursor: move;
}
.head-button {
    width: 36px;
    cursor: pointer;
    &:hover {
        color: #0080ff;
        background-color: rgba(170, 170, 170, 0.8);
    }
}
svg.icon {
    width: 24px;
    height: 24px;
    margin-top: 6px;
}
#contentr {
    position: relative;
    height: 100%;
}
#main-sidebar {
    background-color: #ddd;
    width: 200px;
    margin: 36px 0 0 0;
    padding: 20px 0 0 0;
    position: fixed;
    top: 0;
    bottom: 0;
    float: none;
}
#sidebar-menu {
    padding: 0;
}
.nav-item {
    list-style: none;
    height: 36px;
    line-height: 36px;
    margin: 0 4px 0 0;
    padding: 0 0 0 20px;
    cursor: pointer;
}
.nav-item.active {
    border-radius: 0 20px 20px 0;
    color: #5b5bfa;
    background-color: #ccc;
}
.nav-item .number {
    font-size: 14px;
    float: right;
    color: #fff;
    background: #1790e6;
    margin: 6px 12px 0 0;
    padding: 0 16px;
    border-radius: 10px;
    height: 24px;
    line-height: 24px;
}
.nav-info,
.row:not(.tip) span.row-info {
    font-size: 12px;
    padding-left: 10px;
}
.site-info {
    font-size: 12px;
    vertical-align: text-bottom;
}
.row:not(.tip) div.row-info,
#help div.row-info {
    font-size: 12px;
}
#content {
    background-color: #fbfbfb;
    margin: 0 0 0 200px;
    height: calc(100vh - 36px);
    overflow: hidden auto;
}
details,
#settings {
    font-size: 16px;
}
.tab {
    min-width: 800px;
}
.row {
    display: flex;
    padding: 10px 0 10px 10px;
    border-top: 1px solid #ddd;
    align-items: center;
}
.row.toolbar.cookie {
    padding: 4px 0 4px 4px;
}
.row:nth-of-type(odd) {
    background-color: #eee;
}
.row:last-child {
    border-bottom: 1px solid #ddd;
}
.toolbar {
    font-size: 14px;
}
.button,
.counter {
    margin: 0 10px 0 0;
}
span.index {
    text-align: center;
    width: 40px;
}
span.input,
span.cover,
.open-link {
    align-content: center;
}
span.input,
span.cover,
span.move,
.single-download,
.single-aria2-download,
.open-link {
    text-align: center;
    width: 36px;
    height: 36px;
}
span.name,
span.status,
span.progress {
    padding: 0 10px;
}
span.status,
span.progress {
    font-size: 14px;
    width: 200px;
}
span.name {
    width: calc(100% - 550px);
    min-width: 540px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}
#article-chapter-list span.name {
    width: calc(100% - 506px);
}
span.move {
    cursor: move;
}
.li-btn,
.button,
.single-download,
.single-aria2-download {
    cursor: pointer;
}
.item .cover-image {
    width: auto;
    height: auto;
    max-height: 36px;
    max-width: 36px;
    cursor: wait;
}
#popup-mask {
    text-align: center;
    width: 400px;
    height: 400px;
    position: fixed;
    top: calc((100% - 400px) / 2);
    left: calc((100% - 400px) / 2);
    background-color: transparent;
    z-index: 2147483647;
}
#popup-image {
    width: auto;
    height: 100%;
    min-height: 100%;
    max-height: 100%;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: 0px 5px 5px -10px #5e5e5e;
}
#preview {
    display: flex;
    align-items: center;
    justify-content: center;
}
#preview .cover-image {
    width: auto;
    height: auto;
    max-height: 200px;
    max-width: 200px;
}
.input-text {
    width: 100%;
    height: 28px;
    max-width: 1000px;
}
.row.item input[type="checkbox"] {
    width: 20px;
    height: 20px;
    vertical-align: sub;
}
.setting-key,
.setting-value {
    position: relative;
    width: 100%;
    padding-right: 6px;
    padding-left: 6px;
}
.setting-key {
    flex: 0 0 50%;
    max-width: 50%;
}
.setting-value {
    flex: 0 0 50%;
    max-width: 50%;
}
.form-control {
    display: block;
    width: calc(100% - 30px);
    height: 36px;
    padding: 6px 12px;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.5;
    color: #495057;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid #ced4da;
    border-radius: 4px;
    box-shadow: inset 0 0 0 transparent;
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}
.form-input {
    display: block;
    width: calc(100% - 56px);
    height: 22px;
    padding: 6px 12px;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.5;
    color: #495057;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid #ced4da;
    border-radius: 4px;
    box-shadow: inset 0 0 0 transparent;
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}
select {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23555555%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E") !important;
    background-repeat: no-repeat, repeat !important;
    background-position: right 0.7em top 50%, 0 0 !important;
    background-size: 0.65em auto, 100% !important;
    border: none;
    border-radius: 0;
    padding: 0 0 0 0.35em;
}
#dev-tools {
    line-height: 32px;
    padding: 0 40px 0 0;
    cursor: auto;
}
#dev-tools li {
    background-color: silver;
    padding: 0 10px;
    margin: 10px 0;
    width: fit-content;
    border-radius: 8px;
}
#dev-tools li:last-of-type {
    padding: 0 10px 2px 10px;
}
#dev-tools pre {
    padding: 16px;
    margin: 10px 0;
    overflow: auto;
    color: #1f2328;
    background-color: #e6e8ea;
    border-radius: 6px;
    user-select: text;
    cursor: text;
}
#dev-tools .tab {
    cursor: pointer;
    background-color: #eee;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    padding: 4px 10px;
    color: #333;
    border-bottom: 3px solid rgb(90, 100, 80);
    overflow: hidden;
}
#dev-tools .tab.active {
    background-color: #fff;
    color: rgb(51, 51, 51);
    font-weight: bold;
    border-bottom: 3px solid rgb(255, 111, 97);
}
#dev-tools .tab.active::before {
    content: "⭐";
    font-size: 1em;
    padding-right: 2px;
}
#head-title:not(.min) ~ #maximize,
#head-title.min ~ #minus,
#article-chapter-list .progress,
#favors-row>ul>li:not(:has(>ul[id]>li)),
.hide {
    display: none;
}
            `
		});

		// 嘗試取得漫畫名稱
		getComicName();

		const ca = (str) => fn.rs(str, [
			["章節", "文章"],
			["章节", "文章"],
			["chapter", "article"]
		]);

		// UI的基本HTML
		main = addElement(fragment, "div", {
			id: "main",
			innerHTML: `
<div id="contentr">
    <div id="head">
        <div id="head-title">${comicName || DL.title.s0}</div>
        <div id="minus" class="head-button" title="${DL.title.s1}">${svg.minus}</div>
        <div id="maximize" class="head-button" title="${DL.title.s2}">${svg.maximize}</div>
        <div id="x" class="head-button" title="${DL.title.s3}">${svg.x}</div>
    </div>
    <aside id="main-sidebar">
        <section id="sidebar">
            <ul id="sidebar-menu">
                <li class="nav-item" data-index="1">${DL.nav.s1}</li>
                <li class="nav-item" data-index="2">${DL.nav.s2}</li>
                <li class="nav-item active" data-index="3">${(siteData?.sort == "comic" || siteData?.sort == "ero" || siteData?.sort == "ero-comic") ? DL.nav.s3.c : DL.nav.s3.a}<span id="list-number" class="number">0</span></li>
                <li class="nav-item" data-index="4">${DL.nav.s4}<span id="downloading-number" class="number">0</span></li>
                <li class="nav-item" data-index="5">${DL.nav.s5}<span id="completed-number" class="number">0</span></li>
                <li class="nav-item" data-index="6">${DL.nav.s6}</li>
                <li class="nav-item" data-index="7">${DL.nav.s7}</li>
                <li class="nav-item" data-index="8">${DL.nav.s8}</li>
            </ul>
        </section>
        <div class="nav-info edit">${DL.nav.info.s1}</div>
        <div class="nav-info">${DL.nav.info.s2}</div>
        <div class="nav-info">${DL.nav.info.s3}</div>
        <div class="nav-info">${DL.nav.info.s4}</div>
        <div class="nav-info">${DL.nav.info.s5}</div>
        <div id="preview"></div>
    </aside>
    <div id="content">
        <div id="sites" class="tab hide" data-index="1" data-name="網站列表">
            <div class="row toolbar">
                <button class="button sv" data-i="1">${DL.sort.a}</button>
                <button class="button sv" data-i="2">${DL.sort.a} + ${DL.sort.h}</button>
                <button class="button sv" data-i="3">${DL.sort.h}</button>
                <button class="button sv" data-i="4">${DL.sort.e}</button>
                <button class="button sv" data-i="5">${DL.sort.e} + ${DL.sort.c}</button>
                <button class="button sv" data-i="6">${DL.sort.c}</button>
                <span id="sites-total"></span>
            </div>
        </div>
        <div id="favors" class="tab hide" data-index="2" data-name="我的收藏">
            <div class="row toolbar">
                <button class="button fsv" data-i="1">${DL.sort.a}</button>
                <button class="button fsv" data-i="2">${DL.sort.a} + ${DL.sort.h}</button>
                <button class="button fsv" data-i="3">${DL.sort.h}</button>
                <button class="button fsv" data-i="4">${DL.sort.e}</button>
                <button class="button fsv" data-i="5">${DL.sort.e} + ${DL.sort.c}</button>
                <button class="button fsv" data-i="6">${DL.sort.c}</button>
                <button id="edit-favors" class="button" >${DL.edit.s1}</button>
            </div>
        </div>
        <div id="article-chapter-list" class="tab" data-index="3" data-name="圖集列表">
            <div class="row toolbar">
                <button id="load-list" class="button">${DL.list.btn.s1}</button>
				<button id="clear-list-history" class="button">${DL.list.btn.s11}</button>
                <button id="clear-list" class="button">${DL.list.btn.s2}</button>
                <button id="add-numbre" class="button">${DL.list.btn.s3}</button>
                <button id="reverse-sort" class="button">${DL.list.btn.s4}</button>
                <button id="select-all" class="button">${DL.list.btn.s5}</button>
                <button id="select-non-history" class="button">${DL.list.btn.s10}</button>
                <button id="unselect-all" class="button">${DL.list.btn.s6}</button>
                <button id="list-download" class="button">${DL.list.btn.s7}</button>
                <button id="aria2-download" class="button">Aria2</button>
                <input type="checkbox" id="input-download-videos" class="hide"><span id="input-text-download-videos" class="hide" style="padding: 0 6px;">${DL.list.input.s1}</span>
                <input type="checkbox" id="input-cookie"><span style="padding: 0 6px;">Set cookie</span>| ${DL.status.s0}：
                <span id="list-message">${DL.list.msg.s1}</span>
            </div>
            <div class="row toolbar cookie hide"><input id="input-cookie-value" style="width: calc(100% - 14px);"></div>
        </div>
        <div id="downloading-list" class="tab hide" data-index="4" data-name="下載隊列">
            <div class="row toolbar">
                <button id="stop-downloading" class="button">${DL.list.btn.s8}</button>
            </div>
        </div>
        <div id="completed-list" class="tab hide" data-index="5" data-name="已完成項">
            <div class="row toolbar">
                <button id="clear-history" class="button">${DL.list.btn.s9}</button>
            </div>
        </div>
        <div id="settings" class="tab hide" data-index="6" data-name="選項設定">
            <div class="row toolbar">
                <span class="row-info">${DL.settings.info.s1}</span>
                <span class="row-info">${DL.settings.info.s2}</span>
            </div>
             ${[
				 /*0*/`※ ${DL.settings.s0}<div class="row-info">${DL.settings.info.s3}</div>`,
				 /*1*/`※ ${DL.settings.s1}`,
				 /*2*/`※ ${DL.settings.s2}`,
				 /*3*/`※ ${DL.settings.s3}`,
				 /*4*/`※ ${DL.settings.s4}<div class="row-info">${DL.settings.info.s4}</div>`,
				 /*5*/`※ ${DL.settings.s5}<div class="row-info">${DL.settings.info.s5}</div><div class="row-info">${DL.settings.info.s6}</div>`,
				 /*6*/`※ ${(siteData?.sort == "comic" || siteData?.sort == "ero") ? DL.settings.s6 : ca(DL.settings.s6)}<div class="row-info">${DL.settings.info.s7}</div><button id="clear-download-history" class="button">${DL.settings.btn.s4}</button>`,
				 /*7*/(siteData?.sort == "comic" || siteData?.sort == "ero") ? DL.settings.s7 : ca(DL.settings.s7),
				 /*8*/(siteData?.sort == "comic" || siteData?.sort == "ero") ? DL.settings.s8 : ca(DL.settings.s8),
				 /*9*/DL.settings.s9,
				 /*10*/DL.settings.s10,
				 /*11*/DL.settings.s11,
				 /*12*/`※ ${DL.settings.s12}`,
				 /*13*/`※ ${DL.settings.s13}`,
				 /*14*/`※ ${DL.settings.s14}`,
				 /*15*/`※ ${DL.settings.s15}<div class="row-info">${DL.settings.info.s9}</div>`,
				 /*16*/`※ ${DL.settings.s16}<div class="row-info">${DL.settings.info.s11}</div>`,
				 /*17*/`※ ${DL.settings.s17}<div class="row-info">${(siteData?.sort == "comic" || siteData?.sort == "ero") ? DL.settings.info.s10 : ca(DL.settings.info.s10)}</div>`,
				 /*18*/`※ ${DL.settings.s18}<div class="row-info">${DL.settings.info.s11}</div>`,
				 /*19*/`※ ${DL.settings.s19}`,
				 /*20*/`※ ${DL.settings.s20}`,
				 /*21*/`※ ${DL.settings.s21}`,
				 /*22*/`※ ${DL.settings.s22}`,
			 ].map((str, i) => `<div class="row" data-index="${i}"><div class="setting-key"><span>${str}</span></div><div class="setting-value"><select class="form-control"></select></div></div>`).join("")}
             <div class="row" data-index="23">
                 <div class="setting-key">
                     <span>※ ${DL.settings.s23}</span>
                     <div class="row-info">ℹ️<a href="https://github.com/htyxyt/Aria2-SuperLazyPackage" target="_blank">Aria2-SuperLazyPackage</a></div>
                     <div class="row-info">ℹ️<a href="https://chromewebstore.google.com/detail/aria2-explorer/mpkodccbngfoacfalldjimigbofkhgjn" target="_blank">Aria2 Explorer</a></div>
                     <div class="row-info">${DL.settings.info.s9}</div>
                 </div>
                 <div class="setting-value"><input id="rpc" class="form-input" placeholder="http://127.0.0.1:6800/jsonrpc"></div>
             </div>
             <div class="row" data-index="24">
                 <div class="setting-key"><span>※ ${DL.settings.s24}</span></div>
                 <div class="setting-value"><input id="dir" class="form-input" placeholder="D:\\Downloads"></div>
             </div>
             <div class="row" data-index="25">
                 <div class="setting-key"><span>※ Aria2 token</span></div>
                 <div class="setting-value"><input id="token" class="form-input"></div>
             </div>
             <div class="row tip">
                 <button id="reset-settings" class="button">${DL.settings.btn.s1}</button>
                 <button id="reset-global-settings" class="button">${DL.settings.btn.s2}</button>
                 <button id="reset-website-settings" class="button">${DL.settings.btn.s3}</button>
             </div>
        </div>
        <div id="help" class="tab hide" data-index="7" data-name="特殊說明">
            <div>
                <ul>
                    <li>
                        <span>瀏覽器設定</span>
                        <p>1.先設定好要儲存的位置</p>
                        <p>2.關閉下載前詢問儲存位置</p>
                        <p>3.網站設定允許自動下載</p>
                        <p><img src="https://i3.wp.com/s3.bmp.ovh/imgs/2025/11/25/aa699727c427d955.webp" class="info-image"></p>
                        <p><img src="https://i3.wp.com/s3.bmp.ovh/imgs/2025/11/25/0f083a1695ae8155.webp" class="info-image"></p>
                        <p><img src="https://i3.wp.com/s3.bmp.ovh/imgs/2025/11/25/b3c628e037e22623.webp" class="info-image"></p>
                    </li>
                    <li>
                        <span>取得Cloudflare Clearance Cookie說明</span>
                        <p>1.F12開啟開發者工具</p>
                        <p>2.選擇開發者工具的網路分頁</p>
                        <p>3.勾選停用快取</p>
                        <p>4.選擇篩選圖片</p>
                        <p>5.F5重新載入網頁</p>
                        <p>6.圖片列表選擇一張網站的圖片</p>
                        <p>7.選擇標頭標籤</p>
                        <p>8.找cf_clearance開頭的Cookie</p>
                        <p>9.複製Cookie</p>
                        <p>10.圖集、章節列表勾選Set cookie</p>
                        <p>11.填入cookie</p>
                        <p>12.點擊開始下載</p>
                        <p><img src="https://i3.wp.com/s3.bmp.ovh/imgs/2025/12/03/50120785c94493ef.webp" class="info-image"></p>
                        <p><img src="https://i3.wp.com/s3.bmp.ovh/imgs/2025/12/03/3135b19d2e5720a3.webp" class="info-image"></p>
                    </li>
                    <li>
                        <span>Header Editor Lite 修改讓Fetch API和XHR可以跨網域要求</span>
                        <div class="row-info">ℹ️Header Editor Lite 修改圖片伺服器(網域)的回應標頭</div>
                        <div class="row-info">ℹ️例如：小黃書</div>
                        <div class="row-info">ℹ️網域：img.xchina.io</div>
                        <div class="row-info">ℹ️標頭名稱：access-control-allow-origin</div>
                        <div class="row-info">ℹ️標頭內容；*</div>
                        <div class="row-info">ℹ️其實沒事別瞎折騰，下載方法用預設比較省心，遇到要驗證Referer的一樣會被擋下，要再另外修改要求標頭。</div>
                        <div class="row-info">ℹ️懶人全局跨域，比對類型只選要求方法，選GET即可，下載圖片時開啟，不用的時候關閉。</div>
                        <div><p><img src="https://i3.wp.com/s3.bmp.ovh/imgs/2025/11/20/21ca304d7433a535.webp" class="info-image"></p></div>
                        <div><p><img src="https://i3.wp.com/s3.bmp.ovh/imgs/2025/11/22/d65eb77c57ddc522.webp" class="info-image"></p></div>
                        <div><p><img src="https://i3.wp.com/s3.bmp.ovh/imgs/2025/11/21/c3543a2d9081268d.webp" class="info-image"></p></div>
                    </li>
                </ul>
            </div>
        </div>
        <div id="dev-tools" class="tab hide" data-index="8" data-name="開發工具">
            <div>
                <ul>
                    <li id="clear-setInterval" class="li-btn">清除setInterval</li>
                    <li id="clear-setTimeout" class="li-btn">清除setTimeout</li>
                    <li id="window-key" class="li-btn">主控台列出當前頁面window的有效屬性</li>
                    <li id="dev-dom" class="li-btn">主控台列出Fetch當前頁面的DOM</li>
                    <li id="dev-element" class="li-btn">主控台列出Fetch當前頁面的DOM元素</li>
                    <li id="dev-element-array" class="li-btn">主控台列出Fetch當前頁面的DOM元素陣列</li>
                    <li id="replace-dom" class="li-btn">用Fetch的DOM替換掉當前的DOM html</li>
                    <li>備忘筆記
                    <div style="margin-top: 4px;">
                        <span class="tab active" data-i="1">腳本規則</span>
                        <span class="tab" data-i="2">腳本函式</span>
                        <span class="tab" data-i="3">javaScript</span>
                        <span class="tab" data-i="4">CSS</span>
                        <span class="tab" data-i="5">XPath</span>
                    </div>
<pre data-i="1">
/**
  * init()、getLists()、getSrcs(url, item)
  * getSrcs{next: (dom) => ,links: (dom, url) => ,cb: (dom, url, item) => }
  * 可以用_this調用匹配到的規則本身的屬性。
  * 例如：_this.decrypt(raw, key)
*/
const ruleData = [{
    // Type > String | Array [String] | Function
    siteName: "",
    // Type > String | Array [String] | Function
    homePage: "",
    sort: "album album-hentai hentai ero ero-comic comic",
    info: "",
    // CSS selector
    comicName: "",
    // CSS selector
    cover: "",
    url: {
        // document.title
        // Type > String | Regex | Array [String, Regex]
        t: "",
        // location.href
        // Type > String | Regex | Array [String, Regex]
        u: "",
        // location.host
        // Type > String | Regex | Array [String, Regex]
        h: "",
        // location.pathname
        // Type > String | Regex | Array [String, Regex]
        p: "",
        // location.search
        // Type > String | Regex | Array [String, Regex]
        s: "",
        // Includes elements
        // Type > String | Array [String]
        e: "",
        // Excluded URL partial string
        // Type > String | Array [String]
        eu: "",
        // Excluded elements
        // Type > String | Array [String]
        ee: ""
    },
    // Type > Function | AsyncFunction
    // return Boolean
    url: () => ,
    // Type > Boolean
    spa: true,
    // Type > Function
    // return Boolean
    page: () => Boolean,
    // Type > String
    observeURL: "head nav loop",
    // Type > Function | AsyncFunction
    init: () => {
        ...code
    },
    // Wait element CSS selector
    // Type > String | Array [String]
    waitEle: ".dj-img-cont",
    waitEle: [".cover", ".title"],
    // Type > Function | AsyncFunction
    // return Array
    getLists: async () => {
        /** SPA
          * comicName = q(".infox h1")?.innerText || await ajax.json(api).then(json => json.title);
          * let cover = q(".infox img")?.src;
        */
        return [...{
            text,
            url
        }];
        return [...{
            cover,
            text,
            url
        }];
        // SPA api mid cid
        return [...{
            mid,
            cid,
            cover,
            text,
            url
        }];
    },
    // CSS selector
    // Type > String
    getSrcs: ".entry-content img",
    // Type > Object
    getSrcs: {
        // Type > Function
        // return URL String
        api: (url) => url + "?showall=1",
        // CSS selector
        // Type > String
        target: ".entry-content img",
        // Attribute
        // Type > String | Array
        attr: "data-src",
        attr: ["data-src", "data-original"],
        // CSS selector
        // Type > String
        next: "#next-page",
        // Type > Function | AsyncFunction
        // return URL String | HTMLAnchorElement | null | undefined
        next: (dom) => {
            // example 1
            return dom.querySelector("#next-page");

            // example 2
            let next = dom.querySelector("#next-page")?.getAttribute("_href");
            if (isString(next)) {
                return !next.startsWith("javascript") ? next : null;
            }
            return null;
        },
        // HTMLAnchorElement CSS selector
        // Type > String
        pages: ".page-link a",
        // Type > Function | AsyncFunction
        // return Array
        links: (dom, url) => {
            return [...Remaining article pagination links];
        },
        // Type > Boolean
        // target or cb not include article first page.
        allPages: true,
        // Type > Function | AsyncFunction
        // return Array
        // Do not use target
        cb: (dom, url, item) => {
            Same as getSrcs(url, item)
        },
        // To initiate an AJAX call after a specified delay
        // Default 200ms
        // Type > Number
        delay: 200,
        // Image URL replace string
        // url.replace(a, b)
        // Type > Array
        rs: [a, b],
        rs: [
            [a, b],
            [c, d],
            [e, f]
        ],
        // Exclude src
        // Type > Array
        eSrc: ["/ad/", "/icon/", ".svg"],
        // Image URL remove image CDN
        // Type > Number
        cdn: 0
    },
    // Type > Function | AsyncFunction
    // return Array
    getSrcs: (url, item) => {
        return [...Image URL];
        return Promise.resolve([...Image URL]);
        return Promise.all([...Promise.resolve(Image URL)]);
        return Promise.all([...Promise.resolve([...Image URL])]);
    },
    // Type > Function
    // return Object
    // Request headers for downloading
    headers: () => ({
        accept: "human/ok"
    }),
    // Type > String
    // GM_xmlhttpRequest | Fetch API
    // referer for downloading
    // "url" Article page URL
    // "src" Image URL
    // "" no-referer
    referer: "",
    // Aria2 mode cannot be used
    single: "yes",
    // The website has videos for download.
    dv: true
}];
</pre>
<pre class="hide" data-i="2">
// 內置封裝好的函式
// 主控台列出訊息
debug(str, obj)

// 延遲
delay(ms)

/**
  * 原生CSS不支持選字串故實現了:text:，取元素的outerHTML做判斷。
  * 舉例：.page-item:nth-last-child(2)>a:text:下一页
  * 盡量用精確的CSS，雖然沒XPath好用，但也夠用了。
*/

// 返回元素
q(selector, node) // CSS
x(selector, node) // XPath

// 返回元素陣列
q([selector], node) // CSS
x([selector], node) // XPath

// 返回網址陣列，去重複，不包含javascript字串
u(selector, node) // CSS

// 搜尋腳本返回代碼字串
findScript(key, dom)

// 切割字串
strSlicer(str, startText, endText)

// 從字串取得變數物件字串並轉為物件
strToObject(str, key, mode = 1, last = 0)

// 從字串取得變數陣列字串並轉為陣列
strToArray(str, key, last = 0)

// 從字串取得變數字串
strVar(str, key, end = ";")

// 從字串取得變數數字
numVar(str, key, end = ";")

// 產生隨機字串
// mode: 0 數字,1 英數
fn.generateRandomString(length, mode = 0)

// 隨機抽取陣列中的其中一個
arrayOne(array)

// 等待元素
fn.waitEle(css, node)

// 函式式等待
fn.wait(() => ("jQuery" in window), num = 300)

// 取得網址的查詢參數
fn.getUSP("page", url)

// 字串轉DOM
fn.doc(str)

// 字串轉node
fn.html(str)

// 執行代碼字串
fn.run(code)

// 創建陣列 Array.from({length}, (v, i) => i)
// fn.arr(num, (v, i) => )

// 取得元素的背景圖片
fn.getBackgroundImage(e)

// 確認圖片狀態
fn.checkImgStatus(src)
// 返回
{ok, src, width, heightt}

// 取得document.cookie的值
fn.cookie(key)

// Iframe 不能跨域

// 框架載入網頁
fn.iframe(url, {
    srcdoc,
    loadTime,
    timeout,
    wait,
    waitEle,
    waitVar,
    cb,
    hide
})
// 返回
{frame, dom}

// 框架載入網頁等待變數屬性返回frame
fn.iframeVar(url, key)

// 框架載入網頁等待元素返回DOM
fn.iframeDoc(url, css)

// 框架載入網頁等待元素返回元素陣列
fn.iframeEle(url, css)

// 判斷類型
// Object.prototype.toString.call(object)
isFn(f)
isSet(s)
isEle(e)
isBlob(b)
isURL(url)
isArray(a)
isObject(o)
isString(s)
isNumber(n)
isRegExp(r)
isBoolean(b)
isPromise(p)
isArrayBuffer(ab)
debug("類型", getType(object))

<a href="https://developer.mozilla.org/zh-TW/docs/Web/API/Fetch_API">MDN Fetch API 文檔</a>
<a href="https://developer.mozilla.org/en-US/docs/Glossary/Forbidden_request_header">MDN 禁止修改的要求標頭 文檔</a>
// AJAX 不能跨域
// 內置封裝好的Fetch API
// 用於規則getSrcs: {cb: (dom, url, item) => }
// 或者用於規則getSrcs: (url, item) =>

// 返回字串
ajax.text(url, details = {})

// 返回JSON
ajax.json(url, details = {})

// 返回blob
ajax.blob(url, details = {})

// 返回ArrayBuffer
ajax.ab(url, details = {})

// 返回DOM
ajax.doc(url, details = {})

// 同網域返回代碼字串
ajax.code(url, key)

// 將下一頁的元素翻到當前頁面，一路翻到底，只能在規則getLists: () => {}中使用，主要用在漫畫目錄頁也有分頁的情況。
ajax.nextPage(target, next, {
    pag,
    delay
})

// 翻頁返回目標元素陣列
ajax.next(url, item, dom, {
    target,
    next,
    delay
})

// 要求所有網址返回目標元素陣列
ajax.pages(url, item, {
    pages,
    target,
    delay
})

// 要求所有網址並取得圖片網址並下載為blob, 主要用於一頁一張圖的情況。
ajax.single(url, item, {
    pages,
    target,
    attr,
    single, // true 限單線程
    delay
})

<a href="https://www.tampermonkey.net/documentation.php#api:GM_xmlhttpRequest">Tampermonkey GM_xmlhttpRequest 文檔</a>
// 封裝 GM_xmlhttpRequest
ajax.gm(url, details = {})

// 要求移動端的DOM
ajax.mdoc(url, details = {})
</pre>
<pre class="hide" data-i="3">
// javaScript
document.title // 文檔標題

location.protocol // 協議
location.origin // 含協議的網域
location.host // 網域
location.hostname // 網域
location.pathname // 路徑
location.search // 查詢
location.href // 完整網址

length // 長度

// 運算式與運算子
<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators">MDN Expressions and operators 文檔</a>

<a href="https://developer.mozilla.org/en-US/docs/Web/API/Element">MDN Element 文檔</a>
// 元素
e.remove() // 移除
e.closest(css) // 往上找最近的元素
e.innerText // 元素css渲染後的字串
e.textContent // 元素無渲染的字串
e.getAttribute("")  // 取元素屬性
e.childNodes // 所有子節點
e.children // 所有子元素
e.parentNode // 父節點
e.parentElement // 父元素
e.firstChild // 第一個子節點
e.firstElementChild // 第一個子元素
e.lastChild // 最後一個子節點
e.lastElementChild // 最後一個子元素
e.nextSibling // 下一個節點
e.nextElementSibling // 下一個元素
e.previousSibling // 上一個節點
e.previousElementSibling // 上一個元素

<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String">MDN String 文檔</a>
// 字串
String(object) // 物件轉字串
str.replace("a", "b") // 替換字串
str.replaceAll("a", "b") // 替換全部字串
str.trim() // 字串去前後空白
str.match(/reg/) // 正規表達式匹配字串
/reg/.exec(str) // 正規表達式匹配字串
str.split("/") // 字串切割成陣列
str.slice(0, 1) // 字串切割
str.startsWith(text) // 字串開頭包含
str.endsWith(text) // 字串結尾包含
str.includes(text) // 字串包含
str.indexOf("a") // 搜索索引
str.search(/reg/) // 正規表達式搜索索引
str.lastIndexOf("z") // 搜索字串所在位置的最後索引
str.toUpperCase() // 字串轉大寫
str.toLowerCase() // 字串轉小寫
/reg/.test(str) // 正規表達式判斷

<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number">MDN Number 文檔</a>
// 數字
Number(object) // 物件轉數字

<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math">MDN Math 文檔</a>
Math.ceil(total / 33) // 無條件進位

<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array">MDN Array 文檔</a>
// 陣列
arr.at(0) // 取陣列索引的元素，不改變長度 arr[0]
arr.shift() // 移除並返回陣列的第一個，會改變長度
arr.pop() // 移除並返回陣列的最後一個，會改變長度
arr.unshift(e)  // 陣列添加元素至開頭
arr.push(e)  // 陣列添加元素至末端
arr.join("/") // 陣列合併成字串
arr.indexOf(object)  // 搜索陣列裡物件的索引
arr.includes(object) // 陣列包含
arr.slice(0, 1) // 陣列切割
arr.flat() // 合併陣列裡的多個陣列
arr.reverse() // 反轉陣列
arr.with(index, value) // 替換元素返回新的陣列
arr_a.concat(arr_b) // 陣列合併
[...arr_a, ...arr_b] // 陣列合併
arr.entries() // 陣列拆成索引和值 [a, b, c] > [[0, a], [1, b], [2, c]]
arr.forEach((e, i, a) => ()) // 疊代
arr.map((e, i, a) => ) // 疊代加工
arr.filter((e, i, a) => ) // 疊代篩選
arr.find((e, i, a) => ) // 疊代找符合條件的第一個元素
arr.findIndex((e, i, a) => ) // 疊代找符合條件的第一個索引
arr.findLast((e, i, a) => ) // 疊代往回找符合條件的第一個元素
arr.findLastIndex((e, i, a) => ) // 疊代往回找符合條件的第一個索引
arr.every((e, i, a) => ) // 疊代判斷全部符合條件
arr.some((e, i, a) => ) // 疊代判斷其中之一符合條件
arr.sort((a, b) => a - b) // 排序

<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object">MDN Object 文檔</a>
// 物件
Object.keys(object) // 物件取key變陣列 [key]
Object.values(object) // 物件取value變陣列 [value]
Object.entries(object) // 物件轉陣列{key: value} > [[key, value]]
Object.fromEntries(array) // 陣列轉物件[[key, value]] > {key: value}

<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements">MDN Statements and declarations 文檔</a>
// 迴圈
for (let i = 0, n = arr.length; i < n; i++) cb(arr[i]);
for (let e of arr) cb(e);
for (let [i, e] of arr.entries()) cb(i, e);
while(true) {}
break; // 跳出
continue; // 跳過
try {} catch (e) {} // 嘗試

<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise">MDN Promise 文檔</a>
// Promise
new Promise((resolve, reject) => )
then() // 解決
catch() // 拒絕
finally() // 不論解決拒絕
Promise.all(iterable) // 等待全解決
Promise.race(iterable) // 一個解決或拒絕

// 方法
atob("") // 解碼Base64
JSON.parse(str) // json字串轉物件
JSON.stringify(object) // 物件轉json字串
decodeURIComponent() //URI解碼
encodeURIComponent() //URI編碼
</pre>
<pre class="hide" data-i="4">
<a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors">MDN CSS selectors 文檔</a>
<a href="https://www.runoob.com/cssref/css-selectors.html">菜鸟教程 CSS 选择器文檔</a>
// CSS
*:first-child // 不同標籤的第一個元素
a:first-of-type // 同標籤的第一個元素
*:last-child // 不同標籤的最後一個元素
a:last-of-type // 同標籤的最後一個元素
*:nth-child(n) // 不同標籤的第幾個元素
a:nth-of-type(n) // 同標籤第幾個元素
*:nth-last-child(n) // 不同標籤最後往前的第幾個元素
a:nth-last-of-type(n) // 同標籤最後往前的第幾個元素
*:nth-child(n+1):nth-child(-n+999) // 第幾個到第幾個元素
.item:nth-of-type(odd) // 奇數
.item:nth-of-type(even) // 偶數
*:not(css) // 元素不包含id,class,[屬性],:偽類
*:has(css) // 元素包含子元素
*:not(:has(css)) 元素不包含子元素
css+css // 相鄰的元素
css~css // 之後的元素
!important // 優先級
</pre>
<pre class="hide" data-i="5">
<a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors">MDN XPath 文檔</a>
<a href="https://www.w3schools.com/xml/xpath_syntax.asp">W3Schools XPath Syntax 文檔</a>
<a href="https://www.w3schools.com/xml/xpath_axes.asp">W3Schools XPath Axes 文檔</a>
<a href="https://www.w3schools.com/xml/xpath_operators.asp">W3Schools XPath Operators 文檔</a>
/* 雖冷門但好用，但又難以入門。 */
/* XPath */
/* 元素文字 */
//a[text()='下一話']

/* 元素包含文字 */
//a[contains(text(),'下一話')]

/* 元素包含完整屬性 */
//a[@class='next-page']

/* 元素包含部分屬性 */
//a[contains(@class,'next')]

/* 元素屬性開頭包含 */
//a[starts-with(@href,'/read/')]

/* 元素不包含屬性 */
//a[not(@class)]

/* 元素包含子元素 */
//a[[div[img]]]

/* 父元素 */
//a/parent::li

/* 元素之後 */
//a/parent::li/following-sibling::li[1]/a

/* 元素之前 */
//a/parent::li/preceding-sibling::li[1]/a
</pre>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</div>
            `
		});

		// 深色模式添加類名
		if (config.theme == "dark") {
			main.classList.add("dark");
		}

		const isCatalog = ["ero", "ero-comic", "comic"].some(s => _this.sort == s);

		// 不是目錄類型隱藏編輯標題說明
		if (!isCatalog) {
			q(".nav-info.edit", main).classList.add("hide");
		}

		// 網站列表頂部的分類按鈕添加定位功能
		const sites = q("#sites", main);
		sites.append(createSitesTemplet(main));
		const sitesRow = q("#sites-row", sites);
		for (const button of q([".button.sv"], sites)) {
			addEL(button, "click", (event) => {
				const i = event.target.dataset.i;
				const offsetTop = q(["ul[id]"], sites).find(u => u.dataset.i == i).offsetTop;
				sitesRow.scrollTop = i == 1 ? 0 : offsetTop - 42;
			});
		}

		// 預設的我的收藏
		defaultFavor = `/* ${DL.edit.s6} */
/* ${DL.edit.s7} */
/* ${DL.sort.a} */
album,Everia Club,https://www.everiaclub.com/
/* ${DL.sort.a} + ${DL.sort.h} */
album-hentai,紳士漫畫,https://www.wnacg.com/
/* ${DL.sort.h} */
hentai,IMHentai,https://imhentai.xxx/
/* ${DL.sort.e} */
ero,巴卡漫画,https://bakamh.com/
/* ${DL.sort.e} + ${DL.sort.c} */
ero-comic,HiperDEX,https://hiperdex.com/
/* ${DL.sort.c} */
comic,拷貝漫畫,https://www.mangacopy.com/`;

		// 我的收藏頂部的分類按鈕添加定位功能
		const favors = q("#favors", main);
		favors.append(createFavorsTemplet());
		const favorsRow = q("#favors-row", favors);
		for (const button of q([".button.fsv"], favors)) {
			addEL(button, "click", (event) => {
				if (q("#edit-row", favors)) return;
				const i = event.target.dataset.i;
				const offsetTop = q(["ul[id]"], favors).find(u => u.dataset.i == i).offsetTop;
				favorsRow.scrollTop = i == 1 ? 0 : offsetTop - 42;
			});
		}

		// 編輯收藏按鈕的事件監聽器
		addEL(q("#edit-favors", main), "click", (event) => {
			cancelDefault(event);
			q("#favors-row", favors).remove();
			q(".toolbar", favors).classList.add("hide");
			createEditTextarea();
		});

		// select類型的選項
		const controls = q([".form-control"], main);
		// input類型的選項
		const inputs = q([".form-input"], main);
		// 選項集合
		const options = [...controls, ...inputs];

		controls[1].id = "color-themes";

		// 語言選項
		for (const [t, v] of [
				[DL.settings.option.s1, "ui"],
				[DL.settings.option.s2, "tw"],
				[DL.settings.option.s3, "cn"],
				[DL.settings.option.s4, "en"]
			]) controls[0].append(new Option(t, v));

		// 主題選項
		for (const [t, v] of [
				[DL.settings.option.s5, "light"],
				[DL.settings.option.s6, "dark"]
			]) controls[1].append(new Option(t, v));

		// 下載方法選項
		for (const [t, v] of [
				[DL.settings.option.s7, "default"],
				["Fetch API", "fetch"],
				["XMLHttpRequest", "xhr"]
			]) controls[5].append(new Option(t, v));

		// 壓縮檔副檔名選項
		for (const v of ["zip", "cbz"]) controls[12].append(new Option(v, v));
		// nhentai 圖片伺服器選項
		for (const v of ["auto", "i.nhentai.net", "i1.nhentai.net", "i2.nhentai.net", "i3.nhentai.net", "i4.nhentai.net", "i5.nhentai.net", "i6.nhentai.net", "i7.nhentai.net", "i8.nhentai.net", "i9.nhentai.net"]) controls[20].append(new Option(v, v));
		// Hitomi.la 圖片格式選項
		for (const v of ["avif", "webp"]) controls[21].append(new Option(v, v));
		// ManHuaGui 漫畫櫃圖片伺服器選項
		for (const v of ["i", "eu", "eu1", "eu2", "us", "us1", "us2", "us3"]) controls[22].append(new Option(v, v));

		// 啟用、禁用選項
		for (const [t, v] of [
				[DL.settings.option.s8, 1],
				[DL.settings.option.s9, 0]
			]) {
			controls[2].append(new Option(t, v));
			controls[3].append(new Option(t, v));
			controls[4].append(new Option(t, v));
			controls[6].append(new Option(t, v));
			controls[13].append(new Option(t, v));
			controls[14].append(new Option(t, v));
			controls[15].append(new Option(t, v));
			controls[16].append(new Option(t, v));
			controls[17].append(new Option(t, v));
			controls[18].append(new Option(t, v));
		}

		// 章節最大要求線程數選項
		for (let i = 1; i <= 8; i++) controls[7].append(new Option(i, i));
		// 每章節最大下載線程數選項
		for (let i = 1; i <= 16; i++) controls[8].append(new Option(i, i));
		// 僅為單線程下載時則間隔(秒)選項
		for (let i = 0; i <= 9; i++) controls[9].append(new Option(i == 0 ? 0 : "0." + i, i == 0 ? 0 : "0." + i));
		for (let i = 1; i <= 600; i++) controls[9].append(new Option(i, i));
		// 下載錯誤重試次數選項
		for (let i = 1; i <= 100; i++) controls[10].append(new Option(i, i));
		// 下載錯誤重試間隔(秒)選項
		for (let i = 1; i <= 600; i++) controls[11].append(new Option(i, i));
		// JPG格式轉換品質選項
		for (let i = 10; i <= 100; i++) controls[19].append(i == 100 ? new Option(1, i) : new Option("0." + i, i));

		// 填入儲存的選項的值
		setConfig(options);

		// 選項發生變化即儲存事件監聽器
		for (const control of controls) {
			addEL(control, "change", () => saveConfig(options));
		}
		for (const input of inputs) {
			addEL(input, "input", () => saveConfig(options));
		}

		// 清除下載歷史按鈕事件監聽器
		addEL(q("#clear-download-history", main), "click", clearDB);
		// 重置所有設定按鈕事件監聽器
		addEL(q("#reset-settings", main), "click", setDefault);
		// 重置全局設定按鈕事件監聽器
		addEL(q("#reset-global-settings", main), "click", resetGlobalSettings);
		// 重置網站設定按鈕事件監聽器
		addEL(q("#reset-website-settings", main), "click", resetWebsiteSettings);

		const tabs = q([".tab[data-index]"], main);
		uiTitle = q("#head-title", main);
		viewportObserver.observe(uiTitle);
		listMessage = q("#list-message", main);
		articleList = q("#article-chapter-list", main);
		downloadList = q("#downloading-list", main);
		completedList = q("#completed-list", main);
		inputCookie = q("#input-cookie-value", main);
		const inputDownloadVideos = q("#input-download-videos", main);
		const inputTextDownloadVideos = q("#input-text-download-videos", main);

		if ("dv" in _this) {
			inputDownloadVideos.classList.remove("hide");
			inputTextDownloadVideos.classList.remove("hide");
			inputDownloadVideos.checked = config.downloadVideo;
			isDownloadVideos = config.downloadVideo;
			addEL(inputDownloadVideos, "change", (event) => {
				cancelDefault(event);
				config.downloadVideo = event.target.checked;
				isDownloadVideos = event.target.checked;
				saveConfig([...controls, ...inputs]);
			});
		}

		const preview = q("#preview", main);
		const popupMask = addElement(main, "div", {
			id: "popup-mask",
			className: "hide"
		});
		const popupImage = addElement(popupMask, "img", {
			id: "popup-image",
			src: svg.noCover,
			onload: () => {
				if (popupImage.width >= 402) {
					let num = (popupImage.width - 400) / 2;
					popupImage.style.marginLeft = `-${num}px`;
				} else {
					popupImage.style.marginLeft = "";
				}
			}
		});

		const listNumber = q("#list-number", main);
		const downloadingNumber = q("#downloading-number", main);
		const completedNumber = q("#completed-number", main);
		const navItems = q([".nav-item[data-index]"], main);

		new MutationObserver((mutations) => {
			let mutation;
			for (mutation of mutations) {
				if (mutation.type === "childList" && (mutation.addedNodes.length || mutation.removedNodes.length) && mutation.target?.classList?.contains("tab")) {
					updateText(listNumber, articleList.children.length - 2);
					updateText(downloadingNumber, downloadList.children.length - 1);
					updateText(completedNumber, completedList.children.length - 1);
					if (isMinMode) {
						updateT(`${DL.task}：${(downloadList.children.length - 1)}`);
					}
				}
				if (mutation.type === "childList" && mutation.addedNodes.length && mutation.target.id == "article-chapter-list") {
					updateIndex();
				}
				if (mutation.type === "childList" && mutation.addedNodes.length && mutation.target.id == "downloading-list") {
					updateIndex();
				}
				if (downloadList.children.length == 1) {
					isDownloading = false;
				}
				//console.log(mutation);
			}
			mutation = null;
		}).observe(main, {
			childList: true,
			subtree: true
		});

		addEL(q("#main-sidebar", main), "click", () => setTimeout(() => (q("#content", main).scrollTop = 0), 20));

		const tab_toggle = (event) => {
			cancelDefault(event);
			let e;
			for (e of navItems) e.classList.remove("active");
			for (e of tabs) e.classList.add("hide");
			event.target.classList.add("active");
			tabs.find(r => r.dataset.index == event.target.dataset.index).classList.remove("hide");
			if (event.target.dataset.index == 3) {
				for (e of q([".nav-info"], main)) e.classList.remove("hide");
				if (!isCatalog) {
					q(".nav-info.edit", main).classList.add("hide");
				}
			} else {
				for (e of q([".nav-info"], main)) e.classList.add("hide");
			}
		};

		for (const item of q([".nav-item[data-index]"], main)) {
			addEL(item, "click", tab_toggle);
		}

		const dev_tab_toggle = (event) => {
			cancelDefault(event);
			let e;
			let li = event.target.closest("li");
			let tabs = q([".tab"], li);
			let ps = q(["pre"], li);
			for (e of tabs) e.classList.remove("active");
			for (e of ps) e.classList.add("hide");
			event.target.classList.add("active");
			ps.find(r => r.dataset.i == event.target.dataset.i).classList.remove("hide");
		};

		for (const item of q(["#dev-tools .tab"], main)) {
			addEL(item, "click", dev_tab_toggle);
		}

		const removeList = () => {
			const eles = q(["#article-chapter-list .item"], main);
			for (const e of eles) e.remove();
			return eles;
		}

		// 點擊標題修改漫畫名稱
		addEL(uiTitle, "click", (event) => {
			if (isCatalog && !isMinMode) {
				cancelDefault(event);
				const str = prompt("Comic name", uiTitle.innerText);
				if (str) {
					comicName = str;
					uiTitle.innerText = str;
					for (const item of q([".item"], articleList)) item.dataset.comicName = str;
				}
			}
		});

		// 最小化按鈕事件監聽器
		const minusButton = q("#minus", main);
		addEL(minusButton, "click", (event) => {
			cancelDefault(event);
			main.removeAttribute("style");
			for (let e of q(["#main-sidebar", "#content"], main)) e.classList.add("hide");
			main.classList.add("min");
			uiTitle.classList.add("min");
			q("#overflowYHidden")?.remove();
			updateT("任務：" + (downloadList.children.length - 1 || "0"));
			isMinMode = true;
		});
		if (config.min == 1) {
			EClick(minusButton);
		}

		// 最大化按鈕事件監聽器
		addEL(q("#maximize", main), "click", (event) => {
			cancelDefault(event);
			let e;
			main.removeAttribute("style");
			for (e of q(["#main-sidebar", "#content"], main)) e.classList.remove("hide");
			for (e of q(["#main", "#head-title"], shadow)) e.classList.remove("min");
			hidePageScrollbarY();
			updateT(comicName ? comicName : DL.title.s7);
			isMinMode = false;
		});

		const close = (event) => {
			cancelDefault(event);
			let yes = true;
			if (isDownloading) {
				yes = confirm(DL.confirm.c);
				if (!yes) return yes;
			}
			q("#overflowYHidden")?.remove();
			shadowElement.remove();
			document.removeEventListener("mousemove", moveEvent);
			document.removeEventListener("mouseup", upEvent);
			viewportObserver.disconnect();
			isStopDownload = true;
			queue.clear();
			isOpenUI = false;
			return yes;
		};

		// 關閉UI按鈕事件監聽器
		addEL(q("#x", main), "click", close);

		// 載入列表按鈕事件監聽器
		addEL(q("#load-list", main), "click", async (event) => {
			cancelDefault(event);

			if (isGeting) {
				return alert(DL.alert.s1);
			}
			if (!("getLists" in siteData) && !("getSrcs" in siteData)) {
				return alert(DL.alert.s2);
			}

			isGeting = true;

			if ("page" in siteData && "spa" in siteData) {
				if (!_this.page()) {
					isGeting = false;
					return alert(DL.alert.s3);
				}
				if ("waitEle" in siteData) {
					await fn.waitEle(_this.waitEle);
				}
			}
			// 執行規則CSS取得漫畫名稱
			getComicName();
			// 接下來在取得列表的過程中，如果是需要api要求，並且漫畫名稱在api的json,則可在取得函式中修改comicName變數。

			// 暫存下載列表和已完成的文章連結
			const set = new Set();
			let e;
			if (downloadList.children.length > 1) {
				for (e of q([".item"], downloadList)) set.add(e.dataset.url);
			}
			if (completedList.children.length > 1) {
				for (e of q([".item"], completedList)) set.add(e.dataset.url);
			}

			// 目錄頁翻頁
			if ("nextPage" in siteData) {
				await ajax.nextPage(..._this.nextPage);
			}

			// 開始取得列表
			updateText(listMessage, DL.list.msg.s2);
			let lists = [];
			try {
				if (isString(_this.getLists) && _this?.getLists === "A") {
					lists = al();
				} else {
					lists = await _this.getLists();
				}
			} catch (error) {
				isGeting = false;
				console.error("取得章節列表發生錯誤", error);
				return updateText(listMessage, DL.list.msg.s4);
			}
			// 篩除無效
			lists = lists.filter(Boolean);
			let isRepeat = false;
			if (set.size) {
				// 比對暫存連結篩除在下載隊列和已完成裡已有的任務
				lists = lists.filter(e => {
					if (set.has(e.url)) {
						isRepeat = true;
						return false;
					} else {
						return true;
					}
				});
			}
			// 篩除重複連結
			let urlTemp = new Set();
			lists = lists.filter(o => {
				if (urlTemp.has(o.url)) {
					return false;
				} else {
					urlTemp.add(o.url);
					return true;
				}
			});
			// debug("lists", lists);

			// 空列表則返回
			if (!lists.length) {
				isGeting = false;
				return updateText(listMessage, isRepeat ? DL.list.msg.s5 : DL.list.msg.s7);
			}

			// 更新標題
			updateT(comicName ? comicName : DL.title.s7);

			// 創建列表元素
			let has;
			const str = lists.map(({
				mid,
				cid,
				cover,
				text,
				url
			}, index) => {
				("ot" in siteData) ? (text = fn.replaceStr(String(text))) : (text = fn.deleteStr(String(text)));
				url = complementUrl(url);
				has = db.has(url.replace(location.origin, "")) || db.has(url);
				return `
<div class="row item" data-url="${url}" data-comic-name="${comicName ? comicName : "none"}" data-name="${text}" data-mid="${mid ? mid : "none"}" data-cid="${(cid || cid == 0) ? cid : "none"}" draggable="true">
    <span class="index">${index + 1}</span>
    <span class="input"><input type="checkbox"></span>
    <span class="cover"><img class="cover-image" src="${svg.noCover}" data-src="${cover ? cover : ""}"></span>
    <span class="name">${config.editTitle == 1 ? '<input type="text" class="input-text">' : text}</span>
    <span class="move" title="${DL.title.s4}">${svg.move}</span>
    <span class="single-download" title="${DL.title.s5}">${svg.download}</span>
	<span class="single-aria2-download" title="Aria2 ${DL.title.s5}">${svg.a}</span>
    <span class="open-link" title="${DL.title.s6}"><a href="${url}" target="_blank">${svg.link}</a></span>
    <span class="${has ? "status downloaded" : "status"}">${DL.status.s0}：${has ? DL.status.s2 : DL.status.s1}</span>
    <span class="progress">${DL.progress}：0/0</span>
</div>
                `;
			}).join("");
			has = null;
			const temp = fn.html(str);

			if (config.editTitle == 1) {
				// 將章節名稱傳入input的value
				for (const input of q([".input-text"], temp)) {
					const item = input.closest(".item");
					input.value = item.dataset.name;
					// 輸入框獲得焦點時列表項不能拖動
					addEL(input, "focus", () => (item.draggable = false));
					// 輸入框失去焦點時列表項可以拖動
					addEL(input, "blur", () => (item.draggable = true));
				}
			}

			imagesObserver.disconnect();
			// 預覽圖像鼠標懸停事件監聽器，鼠標懸停時在左側側邊攔顯示200px大小的圖片，彈窗遮罩顯示400px大小的圖片
			for (const image of q([".cover-image"], temp)) {
				image.onmouseenter = () => {
					const src = image.dataset.src || image.src;
					if (isCatalog || !src || src.startsWith("data:image/svg")) return;
					preview.innerHTML = "";
					preview.append(image.cloneNode());
					popupMask.classList.remove("hide");
					popupImage.src = src;
				}
				image.onmouseleave = () => {
					preview.innerHTML = "";
					popupMask.classList.add("hide");
					popupImage.style.marginLeft = "";
				}
				imagesObserver.observe(image);
			}

			// 下載單個任務按鈕事件監聽器
			for (const button of q([".single-download"], temp)) {
				button.onmouseenter = () => {
					const image = q(".cover-image", c(".item", button));
					const src = image.dataset.src || image.src;
					if (isCatalog || !src || src.startsWith("data:image/svg")) return;
					preview.innerHTML = "";
					preview.append(image.cloneNode());
					popupMask.classList.remove("hide");
					popupImage.src = src;
				}
				button.onmouseleave = () => {
					preview.innerHTML = "";
					popupMask.classList.add("hide");
					popupImage.style.marginLeft = "";
				}
				addEL(button, "click", (event) => {
					isStopDownload = false;
					isDownloading = true;
					const item = event.target.closest(".item");
					if (config.editTitle == 1) {
						item.dataset.name = item.children[3].firstElementChild.value;
						item.children[3].innerHTML = item.children[3].firstElementChild.value;
						updateS(item, `${DL.status.s0}：${DL.status.s3}`);
					} else {
						updateS(item, `${DL.status.s0}：${DL.status.s3}`);
					}
					downloadList.append(item);
					queue.add(item);
				});
			}

			// Aria2 下載單個任務按鈕事件監聽器
			for (const button of q([".single-aria2-download"], temp)) {
				button.onmouseenter = () => {
					const image = q(".cover-image", c(".item", button));
					const src = image.dataset.src || image.src;
					if (isCatalog || !src || src.startsWith("data:image/svg")) return;
					preview.innerHTML = "";
					preview.append(image.cloneNode());
					popupMask.classList.remove("hide");
					popupImage.src = src;
				}
				button.onmouseleave = () => {
					preview.innerHTML = "";
					popupMask.classList.add("hide");
					popupImage.style.marginLeft = "";
				}
				addEL(button, "click", (event) => {
					if (!config.rpc || !config.dir) return alert(DL.alert.s4);
					if (
						"single" in _this ||
						String(_this?.siteName).includes("小黄书")
					) return alert(DL.alert.s5);
					isStopDownload = false;
					isDownloading = true;
					const item = event.target.closest(".item");
					item.dataset.aria2 = true;
					if (config.editTitle == 1) {
						item.dataset.name = item.children[3].firstElementChild.value;
						item.children[3].innerHTML = item.children[3].firstElementChild.value;
						updateS(item, `${DL.status.s0}：${DL.status.s3}`);
					} else {
						updateS(item, `${DL.status.s0}：${DL.status.s3}`);
					}
					downloadList.append(item);
					queue.add(item);
				});
			}

			for (const item of q([".item"], temp)) {
				// 列表項鼠標懸停事件監聽器，按住Shift選取，按住Ctrl取消選取
				addEL(item, "mouseenter", (event) => {
					if (event.shiftKey && !event.ctrlKey) {
						item.children[1].firstElementChild.checked = true;
					}
					if (event.ctrlKey && !event.shiftKey) {
						item.children[1].firstElementChild.checked = false;
					}
				});
				// 列表拖動排序事件監聽器
				addEL(item, "dragstart", (event) => {
					const dragEle = event.target.closest(".item");
					const list = event.target.closest(".tab");
					const index = [...list.children].indexOf(dragEle);
					event.dataTransfer.setData("text/plain", index);
				});
				addEL(item, "drop", (event) => {
					const oldIndex = event.dataTransfer.getData("text/plain");
					const dropEle = event.target.closest(".item");
					const list = event.target.closest(".tab");
					const nodes = [...list.children];
					const newIndex = nodes.indexOf(dropEle);
					const dragEle = nodes.at(oldIndex);
					if (newIndex < oldIndex) {
						dropEle.before(dragEle);
					} else if (newIndex > oldIndex) {
						dropEle.after(dragEle);
					}
				});
				addEL(item, "dragenter", cancelDefault);
				addEL(item, "dragover", cancelDefault);
			}

			removeList();
			articleList.append(temp);

			updateText(listMessage, DL.list.msg.s3);

			isGeting = false;
		});

		// 排除歷史按鈕事件監聽器
		addEL(q("#clear-list-history", main), "click", (event) => {
			cancelDefault(event);
			if (articleList.children.length > 1) {
				for (const e of q(["#article-chapter-list .item:has(.downloaded)"], main)) e.remove();
				updateIndex();
			}
		});

		// 清空列表按鈕事件監聽器
		addEL(q("#clear-list", main), "click", (event) => {
			cancelDefault(event);
			if (articleList.children.length > 1) {
				removeList();
				updateText(listMessage, DL.list.msg.s6);
			}
		});

		// 反轉排序按鈕事件監聽器
		addEL(q("#reverse-sort", main), "click", (event) => {
			cancelDefault(event);
			if (articleList.children.length > 1) {
				fragment.append(...removeList().reverse());
				articleList.append(fragment);
			}
		});

		// 全部選取按鈕事件監聽器
		addEL(q("#select-all", main), "click", (event) => {
			cancelDefault(event);
			if (articleList.children.length > 1) {
				for (const e of q([".input input"], articleList)) e.checked = true;
			}
		});

		// 略過歷史紀錄進行選取按鈕事件監聽器
		addEL(q("#select-non-history", main), "click", (event) => {
			cancelDefault(event);
			if (articleList.children.length > 1) {
				let e;
				for (e of q([".input input"], articleList)) e.checked = false;
				for (e of q([".item:not(:has(.downloaded)) .input input"], articleList)) e.checked = true;
			}
		});

		// 取消全選按鈕事件監聽器
		addEL(q("#unselect-all", main), "click", (event) => {
			cancelDefault(event);
			if (articleList.children.length > 1) {
				for (const e of q([".input input"], articleList)) e.checked = false;
			}
		});

		// 補充序號按鈕事件監聽器
		addEL(q("#add-numbre", main), "click", (event) => {
			cancelDefault(event);
			if (articleList.children.length > 1 && config.editTitle == 1) {
				const digits = String((articleList.children.length - 1)).length;
				let str;
				for (const [i, item] of q([".item"], articleList).entries()) {
					if (item.classList.contains("isadd")) break;
					item.classList.add("isadd");
					str = String(i + 1).padStart(digits, "0") + " - " + item.children[3].firstElementChild.value;
					item.dataset.name = str;
					item.children[3].firstElementChild.value = str;
				}
			} else if (articleList.children.length > 1) {
				const digits = String((articleList.children.length - 1)).length;
				let str;
				for (const [i, item] of q([".item"], articleList).entries()) {
					if (item.classList.contains("isadd")) break;
					item.classList.add("isadd");
					str = String(i + 1).padStart(digits, "0") + " - " + item.dataset.name;
					item.dataset.name = str;
					updateText(item.children[3], str);
				}
			}
		});

		// 開始下載按鈕事件監聽器
		addEL(q("#list-download", main), "click", (event) => {
			cancelDefault(event);
			if (articleList.children.length > 1) {
				let items = [...articleList.children].filter(e => e.classList.contains("item") && e?.children[1]?.firstElementChild?.checked);
				if (config.editTitle == 1) {
					items = items.map(e => {
						e.dataset.name = e.children[3].firstElementChild.value;
						e.children[3].innerHTML = e.children[3].firstElementChild.value;
						updateS(e, `${DL.status.s0}：${DL.status.s3}`);
						return e;
					});
				} else {
					items = items.map(e => {
						updateS(e, `${DL.status.s0}：${DL.status.s3}`);
						return e;
					});
				}
				if (items.length) {
					isStopDownload = false;
					isDownloading = true;
					downloadList.append(...items);
					queue.add(items);
				}
			}
		});

		// Aria2下載按鈕事件監聽器
		addEL(q("#aria2-download", main), "click", async (event) => {
			cancelDefault(event);
			if (articleList.children.length > 1) {
				if (!config.rpc || !config.dir) return alert(DL.alert.s4);
				if (
					"single" in _this ||
					String(_this?.siteName).includes("小黄书")
				) return alert(DL.alert.s5);

				isStopDownload = false;
				let items = [...articleList.children].filter(e => e.classList.contains("item") && e?.children[1]?.firstElementChild?.checked);
				if (config.editTitle == 1) {
					items = items.map(e => {
						e.dataset.name = e.children[3].firstElementChild.value;
						e.children[3].innerHTML = e.children[3].firstElementChild.value;
						updateS(e, `${DL.status.s0}：${DL.status.s3}`);
						return e;
					});
				} else {
					items = items.map(e => {
						updateS(e, `${DL.status.s0}：${DL.status.s3}`);
						return e;
					});
				}
				if (items.length) {
					for (const item of items) {
						item.dataset.aria2 = true;
					}
					isStopDownload = false;
					isDownloading = true;
					downloadList.append(...items);
					queue.add(items);
				}
			}
		});

		// 輸入cookie
		addEL(q("#input-cookie", main), "change", (event) => {
			cancelDefault(event);
			isEnabledCookie = event.target.checked;
			if (event.target.checked) {
				q(".toolbar.cookie", main).classList.remove("hide");
			} else {
				q(".toolbar.cookie", main).classList.add("hide");
			}
		});

		// 停止下載按鈕事件監聽器
		addEL(q("#stop-downloading", main), "click", (event) => {
			cancelDefault(event);
			if (downloadList.children.length > 1) {
				const yes = confirm(DL.confirm.stop);
				if (yes) {
					isStopDownload = true;
					for (const item of q([".item"], downloadList)) {
						item.dataset.stop = true;
						item.remove();
					}
					queue.clear();
				}
			}
		});

		// 清空歷史按鈕事件監聽器
		addEL(q("#clear-history", main), "click", (event) => {
			cancelDefault(event);
			if (completedList.children.length > 1) {
				for (const e of q([".item"], completedList)) {
					e.remove();
				}
			}
		});

		// 主題切換事件監聽器
		addEL(q("#color-themes", main), "change", (event) => {
			cancelDefault(event);
			main.classList.toggle("dark");
		});

		const moveEvent = (event) => {
			if (!isMouseDown) return;
			if (!isMinMode) return;
			cancelDefault(event);
			const obj = getXY(event);
			isDragging = true;
			const dx = obj.x - startX;
			const dy = obj.y - startY;
			main.style.top = (startTop + dy) + "px";
			main.style.bottom = "unset";
			main.style.left = (startLeft + dx) + "px";
			main.style.right = "unset";
		};

		const upEvent = () => {
			isMouseDown = false;
			setTimeout(() => (isDragging = false), 100);
		};

		// 最小化標題可拖曳整個元素事件監聽器
		addEL(main, "mousedown", (event) => {
			if (!isMinMode) return;
			const obj = getXY(event);
			isMouseDown = true;
			startX = obj.x;
			startY = obj.y;
			startLeft = main.offsetLeft;
			startTop = main.offsetTop;
		});
		addEL(document, "mousemove", moveEvent);
		addEL(document, "mouseup", upEvent);

		// 開發工具事件監聽器
		addEL(q("#replace-dom", main), "click", async (event) => {
			let yes = await close(event);
			if (!yes) return;
			debug(getDate("開始要求"));
			ajax.doc(lh()).then(dom => {
				debug(getDate("要求結束"));
				let newDocumentElement = document.importNode(dom.documentElement, true);
				let oldDocumentElement = document.documentElement;
				document.replaceChild(newDocumentElement, oldDocumentElement);
				createUI();
				debug("HTML已替換");
			});
		});
		addEL(q("#window-key", main), "click", windowKey);
		addEL(q("#clear-setTimeout", main), "click", clearSetTimeout);
		addEL(q("#clear-setInterval", main), "click", clearSetInterval);
		addEL(q("#dev-dom", main), "click", fetchDOM);
		addEL(q("#dev-element", main), "click", fetchElement);
		addEL(q("#dev-element-array", main), "click", fetchElementArray);

		shadow.append(fragment);

	};

	// 創建網站列表模板
	const createSitesTemplet = (main) => {
		const templet = fn.html(`
<div id="sites-row">
    <ul style="padding: 0 20px 0 40px;">
        <li>
            ${DL.list.info.s4}：<span class="site-info">網站有Cloudflare的會很難爬，每過段時間就要重新驗證。</span>
        </li>
        <li>
            <span>${DL.sort.a}</span>
            <ul id="album-list" data-i="1"></ul>
        </li>
        <li>
            <span>${DL.sort.a} + ${DL.sort.h}</span>
            <ul id="album-hentai-list" data-i="2"></ul>
        </li>
        <li>
            <span>${DL.sort.h}</span>
            <ul id="hentai-list" data-i="3"></ul>
        </li>
        <li>
            <span>${DL.sort.e}</span>
            <ul id="ero-list" data-i="4"></ul>
        </li>
        <li>
            <span>${DL.sort.e} + ${DL.sort.c}</span>
            <ul id="ero-comic-list" data-i="5"></ul>
        </li>
        <li>
            <span>${DL.sort.c}</span>
            <ul id="comic-list" data-i="6"></ul>
        </li>
    </ul>
</div>
        `);

		const albumHentaiList = q("#album-hentai-list", templet);
		const albumList = q("#album-list", templet);
		const hentaiList = q("#hentai-list", templet);
		const eroList = q("#ero-list", templet);
		const eroComicList = q("#ero-comic-list", templet);
		const comicList = q("#comic-list", templet);

		let data;
		for (let i = 0, n = ruleData.length; i < n; i++) {
			data = ruleData[i];
			let {
				siteName,
				homePage,
				sort,
				info
			} = data;

			let li = createElement("li");

			if (isString(siteName) && isString(homePage)) {
				addElement(li, "a", {
					innerText: siteName.startsWith("cookie") ? siteName.replace("cookie", "") : siteName,
					className: siteName.startsWith("cookie") ? "cookie" : "",
					href: homePage,
					target: "_blank"
				});
			} else if (isArray(siteName) && isArray(homePage) && siteName.length == homePage.length || isFn(siteName) || isFn(homePage)) {
				if (isFn(siteName)) {
					siteName = siteName(data);
				}
				if (isFn(homePage)) {
					homePage = homePage(data);
				}
				if (!isArray(siteName) && !isArray(homePage) || isArray(siteName) && isArray(homePage) && siteName.length != homePage.length) {
					li = null;
					continue;
				}
				for (let s = 0, t = siteName.length; s < t; s++) {
					if (s != 0) {
						addElement(li, "span", {
							innerText: "、"
						});
					}
					addElement(li, "a", {
						innerText: siteName[s].startsWith("cookie") ? siteName[s].replace("cookie", "") : siteName[s],
						className: siteName[s].startsWith("cookie") ? "cookie" : "",
						href: homePage[s],
						target: "_blank"
					});
				}
			} else {
				li = null;
				continue;
			}

			if (!!info && isString(info)) {
				addElement(li, "span", {
					className: "site-info",
					innerText: `（${info}）`
				});
			}

			if (sort == "album-hentai") {
				albumHentaiList.append(li);
			} else if (sort == "album") {
				albumList.append(li);
			} else if (sort == "hentai") {
				hentaiList.append(li);
			} else if (sort == "ero") {
				eroList.append(li);
			} else if (sort == "ero-comic") {
				eroComicList.append(li);
			} else if (sort == "comic") {
				comicList.append(li);
			}

		}
		q("#sites #sites-total", main).innerText = `${DL.list.info.s1}：${ruleData.length}${DL.list.info.s2}、${new Set(u("a", templet).map(s => new URL(s).host)).size}${DL.list.info.s3}`;
		return templet;
	};

	// 創建網站收藏列表模板
	const createFavorsTemplet = () => {
		const templet = fn.html(`
<div id="favors-row">
    <ul style="padding: 0 20px 0 40px;">
        <li>
            <span>${DL.sort.a}</span>
            <ul id="album-list" data-i="1"></ul>
        </li>
        <li>
            <span>${DL.sort.a} + ${DL.sort.h}</span>
            <ul id="album-hentai-list" data-i="2"></ul>
        </li>
        <li>
            <span>${DL.sort.h}</span>
            <ul id="hentai-list" data-i="3"></ul>
        </li>
        <li>
            <span>${DL.sort.e}</span>
            <ul id="ero-list" data-i="4"></ul>
        </li>
        <li>
            <span>${DL.sort.e} + ${DL.sort.c}</span>
            <ul id="ero-comic-list" data-i="5"></ul>
        </li>
        <li>
            <span>${DL.sort.c}</span>
            <ul id="comic-list" data-i="6"></ul>
        </li>
    </ul>
</div>
        `);

		const albumHentaiList = q("#album-hentai-list", templet);
		const albumList = q("#album-list", templet);
		const hentaiList = q("#hentai-list", templet);
		const eroList = q("#ero-list", templet);
		const eroComicList = q("#ero-comic-list", templet);
		const comicList = q("#comic-list", templet);

		const favorData = GM_getValue("favorData", defaultFavor);
		const favorDataArray = favorData.split("\n").filter(Boolean);

		for (const favor of favorDataArray) {

			if (
				String(favor)?.trim()?.startsWith("//") ||
				String(favor)?.trim()?.startsWith("/*") ||
				String(favor)?.match(/,/g)?.length != 2
			) {
				continue;
			}

			try {
				const li = createElement("li");

				let [sort, name, href] = favor.split(",");
				sort = String(sort).trim();
				name = String(name).trim();
				href = String(href).trim();

				addElement(li, "a", {
					href,
					innerText: name,
					target: "_blank"
				});

				if (sort == "album-hentai") {
					albumHentaiList.append(li);
				} else if (sort == "album") {
					albumList.append(li);
				} else if (sort == "hentai") {
					hentaiList.append(li);
				} else if (sort == "ero") {
					eroList.append(li);
				} else if (sort == "ero-comic") {
					eroComicList.append(li);
				} else if (sort == "comic") {
					comicList.append(li);
				}

			} catch (error) {
				console.error(error);
			}
		}

		return templet;
	};

	// 創建編輯收藏
	const createEditTextarea = () => {
		const favors = q("#favors", main);

		const edit = createElement("div", {
			id: "edit-row"
		});

		const textarea = addElement(edit, "textarea", {
			id: "editFavorTextarea"
		}, {
			cssText: "width: calc(100% - 10px); height: calc(100% - 44px);"
		});

		const div = addElement(edit, "div", {
			id: "edit-buttons"
		});

		const favorData = GM_getValue("favorData", defaultFavor);
		textarea.value = favorData.replace(/(\n)(\s+)/g, "$1");

		for (const [id, innerText, onclick] of [
				["editFavorExportBtn", DL.edit.s2, (event) => {
					cancelDefault(event);
					const blob = new Blob([textarea.value], {
						type: "text/plain"
					});
					const date = new Date();
					const time = [
						date.getFullYear(),
						date.getMonth() + 1,
						date.getDate(),
						date.getHours(),
						date.getMinutes()
					].map(e => String(e).padStart(2, "0")).join("-");
					saveData(blob, `ArticleImageQueueDownloaderFavoriteSites [${time}].txt`);
				}],
				["editFavorImportBtn", DL.edit.s3, (event) => {
					cancelDefault(event);
					const input = addElement(edit, "input", {
						type: "file",
						accept: ".txt",
						acceptCharset: "utf-8",
						onchange: () => {
							if (input.value !== input.initialValue) {
								const [file] = input.files;
								if (!file) {
									return;
								}
								const reader = new FileReader();
								reader.onloadend = (event) => {
									input.remove();
									textarea.value = event.target.result;
								};
								reader.readAsText(file, "utf-8");
							}
						}
					}, {
						display: "none"
					});
					input.initialValue = input.value;
					input.click();
				}],
				["editFavorSaveBtn", DL.edit.s4, (event) => {
					cancelDefault(event);
					GM_setValue("favorData", textarea.value);
					edit.remove();
					q(".toolbar", favors).classList.remove("hide");
					q("#favors", main).append(createFavorsTemplet());
				}],
				["editFavorCloseBtn", DL.edit.s5, (event) => {
					cancelDefault(event);
					edit.remove();
					q(".toolbar", favors).classList.remove("hide");
					q("#favors", main).append(createFavorsTemplet());
				}],
				["defaultFavorBtn", DL.edit.s8, (event) => {
					cancelDefault(event);
					textarea.value = defaultFavor;
				}]
			]) {
			addElement(div, "button", {
				id,
				className: "button",
				innerText,
				onclick
			});
		}

		favors.append(edit);
	};

	const fn = {
		checkUrl: (details = {}) => {
			let s;
			if ("comicName" in tempData) {
				s = tempData.comicName;
				if (isArray(s)) {
					s = s.join(",");
				}
				if (!q(s)) return false;
			}
			if ("cover" in tempData) {
				s = tempData.cover;
				if (isArray(s)) {
					s = s.join(",");
				}
				if (!q(s)) return false;
			}
			const {
				eu: e_url,
				u: url,
				h: hosts,
				p: pathname,
				s: search,
				e: elements,
				ee: exclude_elements,
				t: title,
				cookie
			} = details;
			if ("cookie" in details) {
				if (!document.cookie.includes(cookie)) return false;
			}
			if ("eu" in details) {
				if (isArray(e_url)) {
					if (e_url.some(p => lh(p))) return false;
				} else {
					if (lh(e_url)) return false;
				}
			}
			if ("ee" in details) {
				if (isArray(exclude_elements)) {
					if (exclude_elements.some(selector => !!q(selector))) return false;
				} else if (isString(exclude_elements)) {
					if (q(exclude_elements)) return false;
				}
			}
			let checkU = true;
			let checkH = true;
			let checkP = true;
			let checkS = true;
			let checkE = true;
			let checkT = true;
			if ("h" in details) {
				if (isArray(hosts)) {
					checkH = hosts.some(h => {
						if (isRegExp(h)) {
							return h.test(location.host);
						} else if (isString(h)) {
							return h === location.host;
						}
						return false;
					});
				} else if (isRegExp(hosts)) {
					checkH = hosts.test(location.host);
				} else if (isString(hosts)) {
					checkH = location.host.includes(hosts);
				}
				if (!checkH) return false;
			}
			if ("u" in details) {
				if (isArray(url)) {
					checkU = url.some(u => {
						if (isString(u) || isRegExp(u)) {
							return lh(u);
						}
						return false;
					});
				} else if (isString(url) || isRegExp(url)) {
					checkU = lh(url);
				}
				if (!checkU) return false;
			}
			if ("t" in details) {
				if (isArray(title)) {
					checkT = title.some(t => {
						if (isString(t)) {
							return document.title.includes(t);
						} else if (isRegExp(t)) {
							return t.test(document.title);
						}
						return false;
					});
				} else if (isString(title)) {
					checkT = document.title.includes(title);
				} else if (isRegExp(title)) {
					checkT = title.test(document.title);
				}
				if (!checkT) return false;
			}
			if ("e" in details) {
				if (isArray(elements)) {
					checkE = elements.every(selector => q(selector));
				} else if (isString(elements)) {
					checkE = !!q(elements);
				}
				if (!checkE) return false;
			}
			if ("p" in details) {
				if (isArray(pathname)) {
					checkH = pathname.some(p => {
						if (isString(p) || isRegExp(p)) {
							return lp(p);
						}
						return false;
					});
				} else if (isString(pathname) || isRegExp(pathname)) {
					checkP = lp(pathname);
				}
				if (!checkP) return false;
			}
			if ("s" in details) {
				if (isString(search) || isRegExp(search)) {
					checkS = ls(search);
				}
				if (!checkS) return false;
			}
			return checkU && checkH && checkP && checkS && checkE && checkT;
		},
		cookie: (key) => {
			try {
				let cookie_object = {
					...Object.fromEntries(document.cookie.replace(/\s/g, "").split(";").map(e => e.split("=")))
				};
				if (key in cookie_object) {
					return Reflect.get(cookie_object, key);
				}
			} catch (error) {
				console.error(error);
				return "";
			}
		},
		wait: (callback, num = 300) => {
			if (!isFn(callback)) return;
			let loopNum = 0;
			return new Promise(resolve => {
				const loopFn = async () => {
					let check = await callback(document, unsafeWindow);
					if (check) {
						resolve(true);
						return;
					}
					if (loopNum >= num) {
						debug("fn.wait()函式判斷達循環上限。", String(callback));
						resolve(false);
						return;
					}
					if (!check) {
						loopNum += 1;
						await delay(200);
						return loopFn();
					}
				};
				loopFn();
			});
		},
		waitEle: (selector, dom = document) => new Promise(resolve => {
			let element;
			if (!("waitEle" in _this)) {
				debug("等待元素中：", selector);
			}
			const loop = setInterval(() => {
				if (isArray(selector)) {
					if (selector.every(s => isEle(q(s, dom)))) {
						if (!("waitEle" in _this)) {
							debug("等待元素結束：", selector);
						}
						clearInterval(loop);
						element = q(selector, dom);
						resolve(element);
					}
				} else {
					element = q(selector, dom);
					if (element) {
						if (!("waitEle" in _this)) {
							debug("等待元素結束：", selector);
						}
						clearInterval(loop);
						resolve(element);
					}
				}
			}, 200);
		}),
		getUSP: (p, s = "s") => {
			if (s === "s") {
				return new URLSearchParams(location.search).get(p);
			}
			if (String(s)?.trim()?.startsWith("http")) {
				return new URL(s).searchParams.get(p);
			}
			if (String(s)?.trim()?.startsWith("?")) {
				new URLSearchParams(s).get(p);
			}
			return "";
		},
		doc: (str) => new DOMParser().parseFromString(str, "text/html"),
		html: (str) => createElement("template", {
			innerHTML: str
		}).content,
		run: (code) => new Function(`"use strict";return (${code})`)(),
		parseCode: str => {
			let s = str.indexOf("(");
			let e = str.lastIndexOf(")") + 1;
			str = str.slice(s, e);
			return fn.run(str);
		},
		arr: (num, cb = null) => isFn(cb) ? Array.from({
			length: Number(num)
		}, cb) : Array.from({
			length: Number(num)
		}),
		checkImgStatus: (src) => new Promise(resolve => {
			const temp = new Image();
			if ("referrerpolicy" in siteData) {
				temp.setAttribute("referrerpolicy", siteData.referrerpolicy);
			}
			temp.onload = () => {
				resolve({
					ok: true,
					src: src,
					width: temp.width,
					height: temp.height
				});
			};
			temp.onerror = () => {
				resolve({
					ok: false,
					src: src
				});
			};
			temp.src = src;
		}),
		getBackgroundImage: (ele) => {
			if (!isEle(ele)) return null;
			let backgroundImage = getComputedStyle(ele).getPropertyValue("background-image");
			if (backgroundImage != "none" && backgroundImage?.startsWith("url")) {
				return backgroundImage.slice(5, -2).trim();
			}
			return null;
		},
		rs: (e, a, b) => {
			if (!isString(e)) return e;
			if (isArray(a)) {
				for (let p of a) e = e.replace(...p);
				return e;
			}
			return e.replace(a, b);
		},
		replaceStr: (str) => fn.rs(str, [
			[/\n/g, " "],
			[/\t/g, " "],
			[/　/g, " "],
			[/:/g, "："],
			[/\*/g, "＊"],
			[/\?/g, "？"],
			[/"/g, "“"],
			[/</g, "《"],
			[/>/g, "》"],
			[/\|/g, "｜"],
			[/\//g, "／"],
			[/\\/g, "＼"],
			[/\s{2,10000}/g, " "],
		]).trim().replaceAll("&ldquo;", "“").replaceAll("&rdquo;", "”"),
		deleteStr: (str) => {
			str = fn.rs(str.trim(), [
				[/[\s-]+\([Page\s\d\/]+\)|[\/\s]?[\(\[［（【“]\d+[\w\s\\\/\.\+-／]+[\)\]］）】”]|\s?\d+p[\+\s]+\d+v|\s?\d+p\+?\d+v|\s?\d+P|\(\d\)/gi, ""],
				[/\d+枚(まとめ)?/, ""],
				[/^[🌶\s]+/, ""],
				[" - 4KHD", ""],
				[/ - Mitaku$/, ""]
			]);
			str = fn.replaceStr(str);
			return str;
		},
		dCdn: (src) => {
			if (!isString(src) || !src) return src;
			src = fn.rs(src, [
				["https://wsrv.nl/?url=", ""],
				[/i\d\.wp\.com\//, ""],
				[/\?.+$/, ""],
				[/\??&.+$/, ""]
			]);
			return src;
		},
		ex: (k) => {
			const object = {
				j: "jpg",
				jpg: "jpg",
				p: "png",
				png: "png",
				g: "gif",
				gif: "gif",
				w: "webp",
				webp: "webp",
				a: "avif",
				avif: "avif",
				t: "tif",
				tif: "tif",
				b: "bmp",
				bmp: "bmp"
			};
			return object[k];
		},
		dir: (url = location.pathname) => {
			if (!url?.includes("/")) return "";
			if (isURL(url) && url?.startsWith("http")) {
				let obj = new URL(url);
				url = obj.origin + obj.pathname;
			}
			let index = url.lastIndexOf("/") + 1;
			url = url.slice(0, index);
			return url;
		},
		generateRandomString: (num, mode = 0) => {
			let characters;
			if (mode === 0) {
				characters = "0123456789";
			} else {
				characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
			}
			let string = "";
			let charactersLength = characters.length;
			for (let i = 0; i < num; i++) {
				string += characters.charAt(Math.floor(Math.random() * charactersLength));
			}
			return string;
		},
		// 取得圖片方法模組化
		getSrcs: (articleUrl, details, item) => {
			let {
				api,
				target,
				video,
				cb,
				attr,
				next,
				pages,
				allPages,
				imageHost,
				links,
				delay: delayTime,
				cdn,
				rs,
				eSrc
			} = details;
			let eles = [];
			if (isFn(api)) {
				articleUrl = api(articleUrl);
			}
			if (isArray(target)) {
				target = target.join(",");
			}
			return ajax.doc(articleUrl).then(async dom => {
				if ("video" in details) {
					let videos = q([video], dom).map(e => e.src).filter(Boolean);
					if (videos.length) {
						item.dataset.videos = videos.join(",");
					}
				}
				if (allPages !== true) {
					if (isString(target)) {
						eles = q([target], dom);
					} else if (isFn(cb)) {
						eles = await cb(dom, articleUrl, item);
					}
				}
				if ("stop" in item.dataset) return [];
				// 文章沒有分頁導覽，用翻頁模式。
				if ("next" in details) {
					await delay(delayTime || 200);
					if ("stop" in item.dataset) return [];
					updateS(item, `${DL.status.s0}：${DL.status.get.s2}`);
					updateP(item, `${DL.progress}：Page1`);
					let fetchNum = 1;
					let nextPage;
					if (isFn(next)) {
						nextPage = await next(dom) || false;
						if ("stop" in item.dataset) return [];
					} else {
						nextPage = q(next, dom) || false;
					}
					while (nextPage) {
						if ("stop" in item.dataset) return [];
						fetchNum++;
						updateP(item, `${DL.progress}：Page${fetchNum}`);
						dom = await ajax.doc(nextPage, {
							referrer: articleUrl
						});
						if ("stop" in item.dataset) return [];
						if (isString(target)) {
							eles = [...eles, ...q([target], dom)];
						} else if (isFn(cb)) {
							eles = [...eles, ...await cb(dom, articleUrl, item)];
						}
						if (isFn(next)) {
							nextPage = await next(dom) || false;
							if ("stop" in item.dataset) return [];
						} else {
							nextPage = q(next, dom) || false;
						}
						if ("stop" in item.dataset) return [];
						await delay(delayTime || 200);
					}
				}
				// 文章有所有分頁元素，直接並行要求所有分頁。
				if ("pages" in details) {
					await delay(delayTime || 200);
					if ("stop" in item.dataset) return [];
					pages = u(pages, dom);
					if (pages.length) {
						let fetchNum = 0;
						updateS(item, `${DL.status.s0}：${DL.status.get.s1}`);
						updateP(item, `${DL.progress}：0/${pages.length}`);
						const resArr = pages.map(async (a, i) => {
							await delay(i * (delayTime || 200));
							if ("stop" in item.dataset) return [];
							if ("imageHost" in details) {
								return ajax.getImageHost(a, item).finally(() => {
									if ("stop" in item.dataset) return;
									fetchNum++;
									updateP(item, `${DL.progress}：${fetchNum}/${pages.length}`);
								});
							}
							return ajax.doc(a, {
								referrer: articleUrl
							}).then(d => {
								if ("stop" in item.dataset) return [];
								if (isString(target)) {
									return q([target], d);
								} else if (isFn(cb)) {
									return cb(d, articleUrl, item);
								}
								return [];
							}).finally(() => {
								fetchNum++;
								updateP(item, `${DL.progress}：${fetchNum}/${pages.length}`);
							});
						});
						await Promise.all(resArr).then(data => (eles = [...eles, ...data]));
						if ("stop" in item.dataset) return [];
					}
				}
				// 文章只有部分分頁元素，創建出除第一頁之外的所有分頁連結，再並行要求所有分頁。
				if ("links" in details) {
					await delay(delayTime || 200);
					if ("stop" in item.dataset) return [];
					links = await links(dom, articleUrl);
					if ("stop" in item.dataset) return [];
					if (links.length) {
						let fetchNum = 0;
						updateS(item, `${DL.status.s0}：${DL.status.get.s1}`);
						updateP(item, `${DL.progress}：0/${links.length}`);
						const resArr = links.map(async (url, i) => {
							await delay(i * (delayTime || 200));
							if ("stop" in item.dataset) return [];
							if ("imageHost" in details) {
								return ajax.getImageHost(url, item).finally(() => {
									if ("stop" in item.dataset) return;
									fetchNum++;
									updateP(item, `${DL.progress}：${fetchNum}/${links.length}`);
								});
							}
							return ajax.doc(url, {
								referrer: articleUrl
							}).then(d => {
								if ("stop" in item.dataset) return [];
								if (isString(target)) {
									return q([target], d);
								} else if (isFn(cb)) {
									return cb(d, articleUrl, item);
								}
								return [];
							}).finally(() => {
								fetchNum++;
								updateP(item, `${DL.progress}：${fetchNum}/${links.length}`);
							});
						});
						await Promise.all(resArr).then(data => (eles = [...eles, ...data]));
						if ("stop" in item.dataset) return [];
					}
				}
				if ("stop" in item.dataset) return [];
				eles = eles.flat(Infinity);
				let srcs = eles.map(e => {
					let src;
					if (isString(e)) {
						src = e;
					} else if (isEle(e)) {
						if ("attr" in details) {
							src = (isArray(attr) ? getImgAttr(e, attr) : e.getAttribute(attr)) || (e.tagName == "A" ? e.href : e.src);
						} else {
							src = e.tagName == "A" ? e.href : e.src;
						}
					}
					if ("rs" in details && isString(src)) {
						if (isArray(rs.at(0))) {
							src = fn.rs(src, rs);
						} else {
							src = fn.rs(src, ...rs);
						}
					}
					if ("cdn" in details && isString(src)) {
						if (cdn == 0) {
							src = fn.dCdn(src);
						}
					}
					return fn.rs(String(src), [
						[/\n/g, ""],
						[/\t/g, ""]
					]).trim();
				});
				if ("eSrc" in details) {
					srcs = srcs.filter(src => eSrc.every(e => !src.includes(e)));
				}
				return srcs;
			});
		},
		iframe: (url, details = {}) => new Promise((resolve, reject) => {
			const {
				srcdoc,
				loadTime,
				timeout,
				wait,
				waitEle,
				waitVar,
				cb,
				hide
			} = details;
			const iframe = addElement(document.body, "iframe", {
				id: `ArticleImageQueueDownloaderIframe-id${(idNum++)}`,
				name: "ArticleImageQueueDownloader-iframe",
				sandbox: "allow-same-origin allow-scripts allow-popups allow-forms"
			}, {
				display: ("hide" in details) ? "none" : ""
			});
			const tid = setTimeout(() => resolve({
				dom: null,
				frame: null
			}), ("timeout" in details && isNumber(timeout)) ? timeout : 60000);
			const call = async () => {
				clearTimeout(tid);
				await delay(("loadTime" in details && isNumber(loadTime)) ? loadTime : 1000);
				const frame = iframe.contentWindow;
				const dom = iframe.contentDocument || iframe.contentWindow.document;
				//dom.body.scrollTop = 9999999;
				//dom.documentElement.scrollTop = 9999999;
				if ("wait" in details && isFn(wait)) {
					await fn.wait(() => wait(dom, frame));
				}
				if ("waitEle" in details && (isString(waitEle) || isArray(waitEle))) {
					await fn.waitEle(waitEle, dom);
				}
				if ("waitVar" in details) {
					await new Promise(end => {
						const loop = setInterval(() => {
							let check;
							if (isString(waitVar)) {
								check = (waitVar in frame);
							} else if (isArray(waitVar)) {
								check = waitVar.every(k => (k in frame));
							}
							if (check) {
								clearInterval(loop);
								end();
							}
						}, 100);
					});
				}
				if ("cb" in details && isFn(cb)) {
					await cb(dom, frame);
				}
				resolve({
					dom,
					frame
				});
				setTimeout(() => iframe.remove(), 1000);
			};
			iframe.onload = () => call();
			iframe.error = reject;
			if ("srcdoc" in details) {
				iframe.srcdoc = srcdoc;
			} else {
				iframe.src = url;
			}
		}),
		iframeVar: (url, key, loadTime = 1000) => fn.iframe(url, {
			waitVar: key,
			loadTime,
			hide: true
		}).then(o => o.frame),
		iframeDoc: (url, selector, timeout = 60000) => fn.iframe(url, {
			waitEle: selector,
			loadTime: 200,
			timeout
		}).then(o => o.dom),
		iframeEle: (url, selector, timeout = 60000) => fn.iframe(url, {
			waitEle: selector,
			loadTime: 200,
			timeout
		}).then(o => q([selector], o.dom)),
		convertImage: async (blob, type = "image/jpeg", quality = 0.95) => {
			const img = new Image();
			await new Promise((resolve, reject) => {
				img.onload = resolve;
				img.onerror = reject;
				img.src = URL.createObjectURL(blob);
			});
			const canvas = new OffscreenCanvas(img.naturalWidth, img.naturalHeight);
			canvas.getContext("2d").drawImage(img, 0, 0);
			URL.revokeObjectURL(img.src);
			blob = null;
			return canvas.convertToBlob({
				type,
				quality
			});
		},
	};

	const ajax = {
		fetch: async (url, details = {}) => {
			let request;
			while (true) {
				try {
					request = await fetch(url, {
						...details
					});
				} catch (error) {
					console.error(`ajax.fetch Error：\n`, error);
				}
				if (request?.ok) {
					break;
				} else {
					await delay(5000);
				}
			}
			return request;
		},
		text: (url, details = {}) => ajax.fetch(url, details).then(res => res.text()),
		json: (url, details = {}) => ajax.fetch(url, details).then(res => res.json()),
		blob: (url, details = {}) => ajax.fetch(url, details).then(res => res.blob()),
		ab: (url, details = {}) => ajax.fetch(url, details).then(res => res.arrayBuffer()),
		doc: (url, details = {}) => ajax.ab(url, details).then(buffer => {
			const decoder = new TextDecoder(document.characterSet || document.charset || document.inputEncoding);
			const htmlText = decoder.decode(buffer);
			return fn.doc(htmlText);
		}),
		code: (url, key) => ajax.doc(url).then(dom => findScript(key, dom)),
		nextPage: async (target, next, details = {}) => {
			let {
				pag,
				delay: delayTime
			} = details;
			if (!target || !next) return;
			let dom = document;
			updateText(listMessage, `${DL.status.get.s2}...`);
			let nextPage;
			if (isFn(next)) {
				nextPage = await next(dom) || false;
			} else {
				nextPage = q(next) || false;
			}
			if (!nextPage) return;
			let fetchNum = 1;
			while (nextPage) {
				fetchNum++;
				updateText(listMessage, `${DL.status.get.s2}(Page${fetchNum})`);
				dom = await ajax.doc(nextPage);
				fragment.append(...q([target], dom));
				let pos = q([target]).at(-1);
				pos.after(fragment);
				if (pag) {
					let c = q([pag]);
					let n = q([pag], dom);
					if (c.length == n.length) {
						for (let [i, e] of c.entries()) {
							e.innerHTML = n[i].innerHTML;
						}
					}
				}
				if (isFn(next)) {
					nextPage = next(dom) || false;
				} else {
					nextPage = q(next, dom) || false;
				}
				await delay(delayTime || 200);
			}
		},
		next: async (url, item, dom, details = {}) => {
			let {
				target,
				next,
				delay: delayTime,
			} = details;
			let fetchNum = 1;
			let nextPage;
			if (isFn(next)) {
				nextPage = await next(dom) || false;
			} else {
				nextPage = q(next, dom) || false;
			}
			let eles = q([target], dom);
			await delay(delayTime || 200);
			updateS(item, `${DL.status.s0}：${DL.status.get.s2}`);
			updateP(item, `${DL.progress}：Page1`);
			while (nextPage) {
				fetchNum++;
				updateP(item, `${DL.progress}：Page${fetchNum}`);
				dom = await ajax.doc(nextPage, {
					referrer: url
				});
				eles = [...eles, ...q([target], dom)];
				if (isFn(next)) {
					nextPage = next(dom) || false;
				} else {
					nextPage = q(next, dom) || false;
				}
				await delay(delayTime || 200);
			}
			return eles;
		},
		pages: async (url, item, details = {}) => {
			let {
				pages,
				target,
				delay: delayTime
			} = details;
			updateS(item, `${DL.status.s0}：${DL.status.get.s1}`);
			updateP(item, `${DL.progress}：0/${pages.length}`);
			let fetchNum = 0;
			await delay(delayTime || 200);
			let resArr = pages.map(async (a, i) => {
				await delay(i * (delayTime || 200));
				return ajax.doc(a, {
					referrer: url
				}).then(d => q([target], d)).finally(() => {
					fetchNum++;
					updateP(item, `${DL.progress}：${fetchNum}/${pages.length}`);
				});
			});
			return Promise.all(resArr).then(arr => arr.flat());
		},
		single: async (url, item, details = {}) => {
			let {
				pages,
				target,
				attr,
				single,
				delay: delayTime,
			} = details;
			updateS(item, `${DL.status.s0}：${DL.status.get.s4}`);
			updateP(item, `${DL.progress}：0/${pages.length}`);
			await delay(delayTime || 200);
			let downloaded = 0;
			let resArr = [];
			for (let page of pages) {
				let res = ajax.doc(page, {
					referrer: url
				}).then(dom => {
					let src = ("attr" in details) ? q(target, dom)?.getAttribute(attr) : q(target, dom)?.src;
					if (!src) return null;
					if (!isEnabledCookie && config.downloadAPI == "xhr") {
						return XHR_Download(src, item).finally(() => {
							downloaded++;
							updateP(item, `${DL.progress}：${downloaded}/${pages.length}`);
						});
					} else if (!isEnabledCookie && config.downloadAPI == "fetch") {
						return Fetch_API_Download(src, item).finally(() => {
							downloaded++;
							updateP(item `${DL.progress}：${downloaded}/${pages.length}`);
						});
					}
					return GM_XHR_Download(src, item).finally(() => {
						downloaded++;
						updateP(item, `${DL.progress}：${downloaded}/${pages.length}`);
					});
				});
				if (single === true) {
					await res;
				}
				resArr.push(res);
				await delay(delayTime || 200);
			}
			return resArr;
		},
		hentai_t: (dom) => {
			let _token = q('meta[name="csrf-token"]', dom)?.getAttribute("content");
			let server = q("#load_server", dom)?.value;
			let u_id = q("#gallery_id", dom)?.value;
			let g_id = q("#load_id", dom)?.value;
			let g_ch = q("#gallery_ch", dom)?.value;
			let img_dir = q("#load_dir", dom)?.value;
			let total_pages = q("#load_pages", dom)?.value;
			let t_pages = q("#t_pages", dom)?.value;
			let id = q("#load_id", dom)?.value || q("#gallery_id", dom)?.value;
			let dir = q("#load_dir", dom)?.value;
			let api = "/inc/thumbs_loader.php";
			if (location.host == "hentaifox.com") {
				api = "/includes/thumbs_loader.php";
			}
			if (location.host == "nhentai.xxx") {
				api = "/modules/thumbs_loader.php";
			}
			return ajax.text(api, {
				headers: {
					"x-csrf-token": _token,
					"content-type": "application/x-www-form-urlencoded; charset=UTF-8",
					"x-requested-with": "XMLHttpRequest"
				},
				body: `_token=${_token}&server=${server}&id=${id}&dir=${dir}&u_id=${u_id}&g_id=${g_id}&g_ch=${g_ch}&img_dir=${img_dir}&visible=0&visible_pages=0&total_pages=${total_pages}&t_pages=${t_pages}&type=2`,
				method: "POST"
			}).then(text => {
				let dom;
				try {
					let json = JSON.parse(text);
					dom = fn.doc(json.html);
				} catch {
					dom = fn.doc(text);
				}
				return [...dom.images];
			});
		},
		gm: (url, details = {}) => new Promise((resolve) => {
			GM_xmlhttpRequest({
				method: "GET",
				responseType: "text",
				...details,
				url,
				onload: (data) => {
					if (data.status > 400) {
						debug(`\najax.gm()連線錯誤碼：${data.status}\n`, url);
					}
					resolve(data.response);
				},
				onerror: (error) => {
					console.error("fn.xhr()ERROR", error);
					if (details.responseType == "document") {
						resolve(fn.doc("fn.xhr()ERROR"));
					} else if (details.responseType == "json") {
						resolve({
							error: "fn.xhr()ERROR"
						});
					} else {
						resolve("fn.xhr()ERROR");
					}
				}
			});
		}),
		mdoc: (url) => ajax.gm(url, {
			headers: {
				"User-Agent": Mobile_UA
			},
			responseType: "arraybuffer"
		}).then(buffer => {
			const decoder = new TextDecoder(document.characterSet || document.charset || document.inputEncoding);
			const htmlText = decoder.decode(buffer);
			return fn.doc(htmlText);
		}),
		getImageHost: (url, item) => {
			if ("stop" in item.dataset) return [];
			if (url.includes("imx.to")) {
				return ajax.gm(url, {
					headers: {
						"accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
						"content-type": "application/x-www-form-urlencoded",
						"referer": url
					},
					responseType: "document",
					data: "imgContinue=Continue+to+image+...+",
					method: "POST"
				}).then(dom => {
					if ("stop" in item.dataset) return [];
					let img = q("img.centred", dom);
					return img ? [img.src] : null;
				});
			}
			if (url.includes("imagebam")) {
				return ajax.gm(url, {
					headers: {
						"referrer": url,
						"referrerPolicy": "strict-origin-when-cross-origin"
					},
					responseType: "document"
				}).then(dom => {
					if ("stop" in item.dataset) return [];
					let img = q("img.main-image", dom);
					return img ? [img.src] : null;
				});
			}
			if (url.includes("postimg")) {
				return ajax.gm(url, {
					responseType: "document"
				}).then(dom => {
					if ("stop" in item.dataset) return [];
					let a = q("a#download", dom);
					return a ? a.href : null;
				});
			}
			return ajax.gm(url, {
				responseType: "document"
			}).then(dom => {
				if ("stop" in item.dataset) return [];
				let img = q("#imgpreview,#image,.pic.img.img-responsive,#imageid,#img.image-content,#main-image,.image.img-fluid,img.pic[alt][title]", dom);
				return img ? [img.src] : null;
			});
		}
	};

	// 補全網址
	const complementUrl = (url) => {
		url = url.replace(/[\n\t\r]/g, "").trim();
		// 補上協議
		if (url.startsWith("//")) {
			url = location.protocol + url;
		}
		// 補上含協議的網域
		if (/^\/[^/]+/.test(url)) {
			url = location.origin + url;
		}
		// 補上含協議的網域
		if (!/^(https?:|blob:|data:)/.test(url) && /^\w+/i.test(url)) {
			url = location.origin + "/" + url;
		}
		if (!url.includes("?")) {
			url = decodeURIComponent(url);
		}
		return url;
	};

	const getEx = (url) => {
		try {
			const p = new URL(url).pathname;
			return p.includes(".") ? p.split(".").at(-1) : "jpg";
		} catch {
			return "jpg";
		}
	};

	// 執行任務
	const executeTheTask = async (item) => {

		if ("stop" in item.dataset) return;

		// 先取得圖片網址
		updateS(item, `${DL.status.s0}：${DL.status.get.s3}`);

		const url = item.dataset.url;
		const itemComicName = item.dataset.comicName == "none" ? null : item.dataset.comicName;

		const {
			getSrcs: params
		} = _this;

		let srcs;
		if (isString(params)) {
			srcs = await ajax.doc(url).then(dom => q([params], dom).map(e => e.tagName == "A" ? e.href : e.src));
		} else if (isObject(params)) {
			srcs = await fn.getSrcs(url, params, item);
		} else if (isFn(params)) {
			srcs = await params(url, item);
		} else {
			return updateS(item, `${DL.status.s0}：${DL.status.s4}`);
		}

		if ("stop" in item.dataset) return;

		// 合併陣列
		srcs = srcs.flat(Infinity);
		// 去除重複和無效
		srcs = [...new Set(srcs)].filter(Boolean);
		//debug("圖片網址", srcs);

		let videos = [];
		if ("videos" in item.dataset) {
			videos = item.dataset.videos.split(",");
		}

		if (!srcs.length && !videos.length) {
			return updateS(item, `${DL.status.s0}：${DL.status.s5}`);
		}

		srcs = await Promise.all(srcs);
		if ("stop" in item.dataset) return;
		srcs = srcs.map(src => isBlob(src) ? src : complementUrl(src));

		let errorNum = 0;
		const waitingFoTheCountdown = async () => {
			if (Number(config.articleThread) == 1 && Number(config.imageThread) == 1 && Number(config.singleThreadInterval) > 0) {
				let interval = Number(config.singleThreadInterval);
				let countdownNum = interval;
				if (interval < 1) {
					interval = 1;
					countdownNum = 1;
				}
				updateS(item, `${DL.status.s0}：${DL.status.s10}${countdownNum}${DL.sec}`);
				updateP(item, `${DL.status.s14}：${countdownNum}${DL.sec}`);
				for (let i = 1; i <= interval; i++) {
					await delay(1000);
					updateP(item, `${DL.status.s14}：${countdownNum-=1}${DL.sec}`);
					if ("stop" in item.dataset) return;
				}
				if ("stop" in item.dataset) return;
				if (config.onlyJson == 1) {
					updateS(item, `${DL.status.s0}：${DL.status.s11}`);
					updateP(item, `${DL.progress}：${DL.status.s8}`);
				}
				if (config.onlyText == 1) {
					updateS(item, `${DL.status.s0}：${DL.status.s12}`);
					updateP(item, `${DL.progress}：${DL.status.s8}`);
				}
				if (config.onlyJson == 1 && config.onlyText == 1) {
					return updateS(item, `${DL.status.s0}：${DL.status.s13}`);
				}
				if (config.onlyJson == 1 || config.onlyText == 1) {
					return;
				}
				updateS(item, errorNum > 0 ? `${DL.status.s0}：${DL.status.s9}` : `${DL.status.s0}：${DL.status.s8}`);
				updateP(item, errorNum > 0 ? `${DL.error}：${errorNum}${DL.p}` : `${DL.progress}：${DL.status.s8}`);
				return;
			} else {
				if ("stop" in item.dataset) return;
				if (config.onlyJson == 1) {
					updateS(item, `${DL.status.s0}：${DL.status.s11}`);
					updateP(item, `${DL.progress}：${DL.status.s8}`);
				}
				if (config.onlyText == 1) {
					updateS(item, `${DL.status.s0}：${DL.status.s12}`);
					updateP(item, `${DL.progress}：${DL.status.s8}`);
				}
				if (config.onlyJson == 1 && config.onlyText == 1) {
					updateS(item, `${DL.status.s0}：${DL.status.s13}`);
					return delay(1000);
				}
				if (config.onlyJson == 1 || config.onlyText == 1) {
					return delay(1000);
				}
				updateS(item, errorNum > 0 ? `${DL.status.s0}：${DL.status.s9}` : `${DL.status.s0}：${DL.status.s8}`);
				updateP(item, errorNum > 0 ? `${DL.error}：${errorNum}${DL.p}` : `${DL.progress}：${DL.status.s8}`);
				return delay(1000);
			}
		};

		// 創建JSON
		const json = () => {
			const object = {
				siteTitle: document.title,
				url
			};
			if (itemComicName) {
				if (_this.sort == "comic" || _this.sort == "ero" || _this.sort == "ero-comic") {
					Reflect.set(object, "comicName", itemComicName);
					Reflect.set(object, "chapterName", item.dataset.name);
				} else {
					Reflect.set(object, "userName", itemComicName);
					Reflect.set(object, "postName", item.dataset.name);
				}
			} else {
				Reflect.set(object, "articleTitle", item.dataset.name);
			}
			Reflect.set(object, "total", srcs.length);
			Reflect.set(object, "images", srcs.map(decodeURIComponent));
			if ("videos" in item.dataset) {
				Reflect.set(object, "total", `${srcs.length}P + ${videos.length}V`);
				Reflect.set(object, "videos", videos);
			}
			return object;
		};

		// 匯出JSON
		if (!("single" in _this) && config.onlyJson == 1) {
			if ("stop" in item.dataset) return;
			const fileName = itemComicName ? `${itemComicName} - ${item.dataset.name}.json` : `${item.dataset.name}.json`;
			const blob = new Blob([JSON.stringify(json(), null, 4)], {
				type: "application/json"
			});
			saveData(blob, fileName);
		}

		// 匯出TEXT
		if (!("single" in _this) && config.onlyText == 1) {
			if ("stop" in item.dataset) return;
			let fileName = itemComicName ? `${itemComicName} - ${item.dataset.name}[${srcs.length}P].txt` : `${item.dataset.name}[${srcs.length}P].txt`;
			if ("videos" in item.dataset) {
				fileName = itemComicName ? `${itemComicName} - ${item.dataset.name}[${srcs.length}P + ${videos.length}V].txt` : `${item.dataset.name}[${srcs.length}P + ${videos.length}V].txt`;
			}
			const blob = new Blob([(videos?.length ? [...srcs, ...videos] : srcs).join("\n")], {
				type: "text/plain",
				endings: "native"
			});
			saveData(blob, fileName);
		}

		if (!("single" in _this) && (config.onlyJson == 1 || config.onlyText == 1)) return waitingFoTheCountdown();

		// 開始下載圖片
		updateS(item, `${DL.status.s0}：${DL.status.get.s4}`);
		updateP(item, `${DL.progress}：0/${srcs.length}`);

		const promiseBlobArray = [];
		let downloaded = 0;
		const executing = new Set();
		for (const src of srcs) {
			if ("stop" in item.dataset) return;
			if (isBlob(src)) {
				promiseBlobArray.push(src);
				continue;
			}
			let promiseBlob;
			let sameOrigin = false;
			try {
				if (isURL(src)) {
					if (location.hostname === new URL(src).hostname) {
						sameOrigin = true;
					}
				}
			} catch (error) {
				console.error(error);
			}
			if (!isEnabledCookie && config.downloadAPI == "xhr") {
				promiseBlob = XHR_Download(src, item).finally(() => {
					downloaded++;
					updateP(item, `${DL.progress}：${downloaded}/${srcs.length}`);
					executing.delete(promiseBlob);
				});
			} else if (
				!isEnabledCookie &&
				(
					config.downloadAPI == "fetch" ||
					sameOrigin && siteData.fetch != 0 ||
					src.startsWith("data:") ||
					src.startsWith("blob:") ||
					siteData.fetch == 1 ||
					src.includes(".wp.com/")
				)
			) {
				promiseBlob = Fetch_API_Download(src, item).finally(() => {
					downloaded++;
					updateP(item, `${DL.progress}：${downloaded}/${srcs.length}`);
					executing.delete(promiseBlob);
				});
			} else {
				promiseBlob = GM_XHR_Download(src, item).finally(() => {
					downloaded++;
					updateP(item, `${DL.progress}：${downloaded}/${srcs.length}`);
					executing.delete(promiseBlob);
				});
			}
			executing.add(promiseBlob);
			promiseBlobArray.push(promiseBlob);
			if (executing.size >= Number(config.imageThread)) {
				await Promise.race(executing);
				if ("stop" in item.dataset) return;
			}
			if (Number(config.articleThread) == 1 && Number(config.imageThread) == 1 && Number(config.singleThreadInterval) > 0) {
				await delay(Number(config.singleThreadInterval) * 1000);
				if ("stop" in item.dataset) return;
			}
		}
		if ("videos" in item.dataset && isDownloadVideos) {
			await Promise.all(promiseBlobArray);
			downloaded = 0;
			updateS(item, `${DL.status.s0}：${DL.status.get.s5}`);
			updateP(item, `${DL.progress}：${downloaded}/${videos.length}`);
			for (const src of videos) {
				if ("stop" in item.dataset) return;
				let promiseBlob;
				let sameOrigin = false;
				try {
					if (isURL(src)) {
						if (location.hostname === new URL(src).hostname) {
							sameOrigin = true;
						}
					}
				} catch (error) {
					console.error(error);
				}
				if (!isEnabledCookie && config.downloadAPI == "xhr") {
					promiseBlob = XHR_Download(src, item).finally(() => {
						downloaded++;
						updateP(item, `${DL.progress}：${downloaded}/${videos.length}`);
						executing.delete(promiseBlob);
					});
				} else if (
					!isEnabledCookie &&
					(
						config.downloadAPI == "fetch" ||
						sameOrigin && siteData.fetch != 0 ||
						siteData.fetch == 1 ||
						src.includes(".wp.com/")
					)
				) {
					promiseBlob = Fetch_API_Download(src, item).finally(() => {
						downloaded++;
						updateP(item, `${DL.progress}：${downloaded}/${videos.length}`);
						executing.delete(promiseBlob);
					});
				} else {
					promiseBlob = GM_XHR_Download(src, item).finally(() => {
						downloaded++;
						updateP(item, `${DL.progress}：${downloaded}/${videos.length}`);
						executing.delete(promiseBlob);
					});
				}
				executing.add(promiseBlob);
				promiseBlobArray.push(promiseBlob);
				if (executing.size >= Number(config.imageThread)) {
					await Promise.race(executing);
					if ("stop" in item.dataset) return;
				}
				if (Number(config.articleThread) == 1 && Number(config.imageThread) == 1 && Number(config.singleThreadInterval) > 0) {
					await delay(Number(config.singleThreadInterval) * 1000);
					if ("stop" in item.dataset) return;
				}
			}
		}
		if ("stop" in item.dataset) return;
		return Promise.all(promiseBlobArray).then(async blobs => {
			if ("stop" in item.dataset) return;

			// 圖片格式轉換
			let isConvert = false;
			let conversion = [];
			if (config.webpToJpg == 1 || config.avifToJpg == 1) {
				updateS(item, `${DL.status.s0}：${DL.status.s6}`);
				updateP(item, `${DL.progress}：0/${srcs.length}`);
				// 延遲一下不然立即轉換會卡dom渲染，進度0會來不及渲染出來就卡住了。
				await delay(200);
				let complete = 0;
				for (let [i, blob] of blobs.entries()) {
					if ("stop" in item.dataset) return;
					if (config.webpToJpg == 1) {
						// WEBP轉JPG
						if (blob.type.includes("webp") || srcs[i].includes(".webp") && !blob.type.includes("jpg") && !blob.type.includes("text")) {
							blob = await fn.convertImage(blob, "image/jpeg", Number(config.jpgQuality));
							complete++;
							updateP(item, `${DL.progress}：${complete}/${srcs.length}`);
							conversion.push(blob);
							isConvert = true;
							continue;
						}
					}
					if (config.avifToJpg == 1) {
						// WEBP轉JPG
						if (blob.type.includes("avif") || srcs[i].includes(".avif") && !blob.type.includes("jpg") && !blob.type.includes("text")) {
							blob = await fn.convertImage(blob, "image/jpeg", Number(config.jpgQuality));
							complete++;
							updateP(item, `${DL.progress}：${complete}/${srcs.length}`);
							conversion.push(blob);
							isConvert = true;
							continue;
						}
					}
					complete++;
					conversion.push(blob);
				}
				if ("stop" in item.dataset) return;
				blobs = await Promise.all(conversion);
			}
			if ("stop" in item.dataset) return;

			//debug("blobs", {url,name: item.dataset.name,blobs});

			const total = blobs.length;
			let zName = `${itemComicName ? itemComicName + " - " + item.dataset.name : item.dataset.name} ${isConvert ? "[toJPG]" : ""}[${total}P]`;
			if ("videos" in item.dataset && isDownloadVideos) {
				zName = `${itemComicName ? itemComicName + " - " + item.dataset.name : item.dataset.name} ${isConvert ? "[toJPG]" : ""}[${srcs.length}P + ${videos.length}V]`;
			}
			// 創建JSZip實例
			const _JSZip = addJSZipLibrary() || JSZip;
			const zip = new _JSZip();
			let zipFolder;
			if (config.zipFolder == 1) {
				zipFolder = zip.folder(zName);
			}
			// ZIP添加JSON
			if (config.zipJson == 1) {
				const fileName = itemComicName ? `${itemComicName} - ${item.dataset.name}.json` : `${item.dataset.name}.json`;
				const blob = new Blob([JSON.stringify(json(), null, 4)], {
					type: "application/json"
				});
				(zipFolder ?? zip).file(fileName, blob, {
					binary: true
				});
			}

			// 開始打包
			let imageCount = 0;
			let videoCount = 0;
			for (let i = 0; i < total; i++) {
				const type = blobs[i].type;
				let ex = "jpg";
				let isError = false;
				if (type.startsWith("image") || type.startsWith("video")) {
					[ex] = type.split("/")[1].match(/\w+/);
				}
				if (type.includes("octet-stream") && srcs[i].includes(".")) {
					ex = srcs[i].replace(/\?.+$/, "").split(".").at(-1);
				}
				if (type == "text/plain") {
					ex = "txt";
					isError = true;
					errorNum++;
				}
				if (type == "text/html") {
					ex = "html";
					isError = true;
					errorNum++;
				}
				const fileName = `${String(type.startsWith("video") ? videoCount += 1 : imageCount += 1).padStart(String(total).length, "0")}${isError ? "_error" : ""}.${ex}`;
				(zipFolder ?? zip).file(fileName, blobs[i], {
					binary: true
				});
			}
			updateS(item, `${DL.status.s0}：${DL.status.s7}`);
			return zip.generateAsync({
				type: "blob"
			}, (metadata) => {
				updateP(item, `${DL.progress}：${metadata.percent.toFixed(2)} %`);
			}).then(async zipBlob => {
				if ("stop" in item.dataset) {
					for (let blob of blobs) {
						blob = null;
					}
					blobs = null;
					conversion = null;
					return;
				}
				zName = `${itemComicName ? itemComicName + " - " + item.dataset.name : item.dataset.name} ${isConvert ? "[toJPG]" : ""}[${total}P]${errorNum ? `[${errorNum}error]` : ""}`;
				if ("videos" in item.dataset && isDownloadVideos) {
					zName = `${itemComicName ? itemComicName + " - " + item.dataset.name : item.dataset.name} ${isConvert ? "[toJPG]" : ""}[${srcs.length}P + ${videos.length}V]${errorNum ? `[${errorNum}error]` : ""}`;
				}
				saveData(zipBlob, `${zName}.${config.compressedExtension}`);

				for (let blob of blobs) {
					blob = null;
				}
				blobs = null;
				conversion = null;

				// 儲存下載連結
				if (config.downloadDB == 1) {
					db.add(url.replace(location.origin, ""));
					await saveDB();
				}

				return waitingFoTheCountdown();
			});
		});
	};

	// 取得圖片網址後推送給Aria2下載
	const aria2ExecuteTheTask = async (item) => {

		if ("stop" in item.dataset) return;

		let interval = Number(config.singleThreadInterval);

		updateS(item, `${DL.status.s0}：${DL.status.get.s3}`);

		const url = item.dataset.url;
		const itemComicName = item.dataset.comicName == "none" ? null : item.dataset.comicName;

		const {
			getSrcs: params
		} = _this;

		let srcs;
		if (isString(params)) {
			srcs = await ajax.doc(url).then(dom => q([params], dom).map(e => e.tagName == "A" ? e.href : e.src));
		} else if (isObject(params)) {
			srcs = await fn.getSrcs(url, params, item);
		} else if (isFn(params)) {
			srcs = await params(url, item);
		} else {
			updateS(item, `${DL.status.s0}：${DL.status.s4}`);
			return completedList.append(item);
		}

		if ("stop" in item.dataset) return;

		srcs = srcs.flat(Infinity);
		srcs = [...new Set(srcs)].filter(Boolean);
		//debug("圖片網址", srcs);

		let videos = [];
		if ("videos" in item.dataset) {
			videos = item.dataset.videos.split(",");
		}

		if (!srcs.length && !videos.length) {
			updateS(item, `${DL.status.s0}：${DL.status.s5}`);
			return completedList.append(item);
		}

		srcs = await Promise.all(srcs);
		srcs = srcs.map(e => isBlob(e) ? e : complementUrl(e));
		srcs = srcs.filter(e => isString(e));

		if ("stop" in item.dataset) return;

		let dir;

		if (itemComicName) {
			dir = `${config.dir}\\${itemComicName}\\${item.dataset.name}`;
		} else {
			dir = `${config.dir}\\${item.dataset.name}`;
		}

		if (srcs.length) {
			let srcParams = srcs.map((src, i, arr) => {
				let headers = {
					"Referer": getReferer(src, item),
					"User-Agent": navigator.userAgent
				};
				if (isEnabledCookie && inputCookie.value != "") {
					Reflect.set(headers, "Cookie", inputCookie.value);
				}
				if ("headers" in _this) {
					headers = {
						...headers,
						..._this.headers()
					};
				}
				let header = Object.entries(headers).map(([k, v]) => `${k}:${v}`);
				return {
					jsonrpc: "2.0",
					method: "aria2.addUri",
					id: "aria2_push_" + fn.generateRandomString(16, 1),
					params: [
						`token:${config.token}`,
						[src],
						{
							header,
							dir,
							out: `${String(i + 1).padStart(String(arr.length).length, "0")}.${getEx(src)}`
						}
					]
				};
			});
			//debug("srcParams", srcParams);
			ajax.gm(config.rpc, {
				headers: {
					"Accept": "application/json",
					"content-type": "application/json"
				},
				responseType: "json",
				data: JSON.stringify(srcParams),
				method: "POST"
			});
		}

		videos = videos.filter(e => isString(e));
		if (videos.length) {
			let videoParams = videos.map((src, i, arr) => {
				let headers = {
					"Referer": getReferer(src, item),
					"User-Agent": navigator.userAgent
				};
				if (isEnabledCookie && inputCookie.value != "") {
					Reflect.set(headers, "Cookie", inputCookie.value);
				}
				if ("headers" in _this) {
					headers = {
						...headers,
						..._this.headers()
					};
				}
				let header = Object.entries(headers).map(([k, v]) => `${k}:${v}`);
				return {
					jsonrpc: "2.0",
					method: "aria2.addUri",
					id: "aria2_push_" + fn.generateRandomString(16, 1),
					params: [
						`token:${config.token}`,
						[src],
						{
							header,
							dir,
							out: `${String(i + 1).padStart(String(arr.length).length, "0")}.${getEx(src)}`
						}
					]
				};
			});
			//debug("videoParams", videoParams);
			ajax.gm(config.rpc, {
				headers: {
					"Accept": "application/json",
					"content-type": "application/json"
				},
				responseType: "json",
				data: JSON.stringify(videoParams),
				method: "POST"
			});
		}

		if (config.downloadDB == 1) {
			db.add(url.replace(location.origin, ""));
			await saveDB();
		}

		const waitingFoTheCountdown = async () => {
			let countdownNum = interval;
			if (interval < 3) {
				interval = 3;
				countdownNum = 3;
			}
			updateS(item, `${DL.status.s0}：${DL.status.s10}${countdownNum}${DL.sec}`);
			updateP(item, `${DL.status.s14}：${countdownNum}${DL.sec}`);
			for (let i = 1; i <= interval; i++) {
				await delay(1000);
				updateP(item, `${DL.status.s14}：${countdownNum-=1}${DL.sec}`);
				if ("stop" in item.dataset) return;
			}
			if ("stop" in item.dataset) return;
			updateS(item, `${DL.status.s0}：Aria2`);
			updateP(item, `${DL.progress}：Push`);
			completedList.append(item);
		};
		return waitingFoTheCountdown();
	};

	// 隊列下載的類
	class ArticleImageDownloadQueue {
		constructor() {
			this.taskPool = [];
			this.executing = new Set();
		}
		add(tasks) {
			if (isArray(tasks)) {
				for (const task of tasks) {
					this.taskPool.push(task);
					this.run();
				}
			} else {
				this.taskPool.push(tasks);
				this.run();
			}
		}
		run() {
			if (!isStopDownload && this.executing.size < Number(config.articleThread) && this.taskPool.length > 0) {
				const task = this.taskPool.shift();
				if ("stop" in task.dataset) return;
				const promise = ("aria2" in task.dataset ? aria2ExecuteTheTask(task) : executeTheTask(task)).catch((error) => {
					updateS(task, `${DL.status.s0}：${DL.uerror}`);
					updateP(task, `${DL.progress}：${DL.uerror}`);
					console.error("AIQD_APP 未知的錯誤", error);
				}).finally(() => {
					this.executing.delete(promise);
					this.run();
					if (!("stop" in task.dataset)) {
						completedList.append(task);
					}
				});
				this.executing.add(promise);
				this.run();
			}
		}
		clear() {
			this.taskPool = [];
			this.executing.clear();
			isDownloading = false;
		}
	}
	// 創建隊列實例
	const queue = new ArticleImageDownloadQueue();

	// GM_xmlhttpRequest下載圖片
	const GM_XHR_Download = async (src, item) => {
		let ok = false;
		let errorNum = 0;
		let request;
		let headers = {};
		if ("headers" in _this) {
			headers = _this.headers();
		}
		while (true) {
			request = await new Promise(resolve => {
				GM_xmlhttpRequest({
					method: "GET",
					url: src,
					responseType: "blob",
					headers: {
						"Accept": "*/*",
						"Referer": getReferer(src, item),
						"User-Agent": navigator.userAgent,
						...headers
					},
					cookie: getCookie(),
					onload: (data) => {
						ok = true;
						// debug("GM_xmlhttpRequest", data.response);
						resolve(data.response);
					},
					onerror: (error) => {
						errorNum++;
						resolve(new Blob([src + "\n\n" + String(error)], {
							type: "text/plain",
							endings: "native"
						}));
						console.error("GM_XHR_Download() Error：\n", error);
					}
				});
			});
			if (!("stop" in item.dataset) && !isStopDownload && !ok && errorNum <= Number(config.retry)) {
				await delay(Number(config.interval) * 1000);
			}
			if ("stop" in item.dataset || isStopDownload || ok || errorNum > Number(config.retry)) {
				break;
			}
		}
		return request;
	};

	// Fetch API下載圖片
	const Fetch_API_Download = async (src, item) => {
		let ok = false;
		let isFailedToFetch = false;
		let errorNum = 0;
		let is404 = false;
		let request;
		let headers = {};
		if ("headers" in _this) {
			headers = _this.headers();
		}
		while (true) {
			request = await new Promise(resolve => {
				fetch(src, {
					headers: {
						accept: "*/*",
						...headers
					},
					referrer: getReferer(src, item),
					referrerPolicy: "strict-origin-when-cross-origin",
					cache: "force-cache",
					credentials: "same-origin"
				}).then(res => {
					// debug("res", res);
					if (res.ok) {
						ok = true;
						resolve(res.blob());
					} else {
						errorNum++;
						resolve(new Blob([src], {
							type: "text/plain",
							endings: "native"
						}));
						console.error("Fetch_API_Download() Error：\n", res);
						if (res.status == 404) {
							is404 = true;
						}
					}
				}).catch(error => {
					if (String(error).includes("Failed to fetch")) {
						//debug("Fetch_API_Download()錯誤，改用GM_XHR_Download()");
						isFailedToFetch = true;
						resolve(GM_XHR_Download(src, item));
					} else {
						console.error("Fetch_API_Download() Error：\n", error);
						errorNum++;
						resolve(new Blob([src + "\n\n" + String(error)], {
							type: "text/plain",
							endings: "native"
						}));
					}
				});
			});
			if (!("stop" in item.dataset) && !isStopDownload && !is404 && !isFailedToFetch && !ok && errorNum <= Number(config.retry)) {
				await delay(Number(config.interval) * 1000);
				// debug("Fetch_API_Download", blob);
			}
			if ("stop" in item.dataset || isStopDownload || is404 || isFailedToFetch || ok || errorNum > Number(config.retry)) {
				break;
			}
		}
		return request;
	};

	// XMLHttpRequest下載圖片
	const XHR_Download = async (src, item) => {
		let ok = false;
		let errorNum = 0;
		let request;
		while (true) {
			request = await new Promise(resolve => {
				const xhr = new XMLHttpRequest();
				xhr.open("GET", src);
				xhr.setRequestHeader("accept", "*/*");
				if ("headers" in _this) {
					for (let [header, value] of Object.entries(_this.headers())) xhr.setRequestHeader(header, value);
				}
				xhr.responseType = "blob";
				xhr.onload = () => {
					ok = true;
					// debug("XHR_Download", xhr.response);
					resolve(xhr.response);
				};
				xhr.onerror = (error) => {
					errorNum++;
					resolve(new Blob([src + "\n\n" + String(error)], {
						type: "text/plain",
						endings: "native"
					}));
					console.error("XHR_Download() Error：\n", error);
				};
				xhr.send();
			});
			if (!("stop" in item.dataset) && !isStopDownload && !ok && errorNum <= Number(config.retry)) {
				await delay(Number(config.interval) * 1000);
			}
			if ("stop" in item.dataset || isStopDownload || ok || errorNum > Number(config.retry)) {
				break;
			}
		}
		return request;
	};

	const historyEvent = event => {
		const url = event.target.location.href;
		setTimeout(() => {
			if (currentURL !== url.replace(new URL(url).hash, "")) {
				currentURL = url;
				mainInit();
			}
		}, 200);
	};

	const historyObserver = () => {
		unsafeWindow.addEventListener("popstate", historyEvent);
	};

	const headUrlObserver = async () => {
		const config = {
			attributes: false,
			childList: true,
			characterData: true,
			subtree: true
		};
		const callback = (mutations) => {
			let mutation;
			for (mutation of mutations) {
				if (
					mutation.type === "childList" && mutation.target.tagName === "TITLE" ||
					mutation.type === "childList" && !!mutation.addedNodes.length && [...mutation.addedNodes].some(e => e.tagName === "TITLE") ||
					mutation.type === "characterData" && mutation.target?.parentNode?.tagName === "TITLE"
				) {
					if (currentURL !== document.URL) {
						currentURL = document.URL;
						mainInit();
						return (mutation = null);
					}
				}
			}
		};
		const observer = new MutationObserver(callback);
		observer.observe(document.head, config);
		historyObserver();
	};

	const navUrlEvent = event => {
		const url = event.destination.url.replace(new URL(event.destination.url).hash, "");
		const c_host = new URL(currentURL).host;
		const e_host = new URL(url).host;
		if (event.downloadRequest !== null || c_host !== e_host || url.startsWith("blob") || url.startsWith("data")) return;
		if (currentURL !== url) {
			currentURL = document.URL;
			mainInit();
		}
	};

	const navUrlObserver = () => {
		//Firefox、Safari尚未支持Navigation API
		unsafeWindow.navigation.addEventListener("navigate", navUrlEvent);
		historyObserver();
	};

	const loopUrlObserver = () => {
		setInterval(() => {
			const url = document.URL.replace(new URL(document.URL).hash, "");
			if (currentURL !== url) {
				currentURL = url;
				mainInit();
			}
		}, 500);
	};

	const mainInit = async () => {
		// 遍歷規則
		let check;
		let data;
		for (let i = 0, n = ruleData.length; i < n; i++) {
			data = ruleData[i];
			tempData = data;
			check = false;
			try {
				if ("url" in data) {
					const url = data.url;
					if (isObject(url)) {
						check = fn.checkUrl(url);
					} else if (isFn(url)) {
						check = await url();
					}
				}
				if (check) {
					siteData = data;
					_this = data;
					break;
				}
			} catch (error) {
				console.error("文章圖片下載應用規則出錯\n", error);
				debug("文章圖片下載應用規則出錯", data);
				debug("出錯之前的規則", ruleData[i - 1]);
				return;
			}
		}
		if (check) {
			if (!isShowConfig) {
				isShowConfig = true;
				debug("匹配到的數據", siteData);
				debug("設定", config);
			}
			if ("hide" in siteData && (isString(siteData.hide) || isArray(siteData.hide))) {
				let str = siteData.hide;
				if (isArray(str)) {
					str = str.join(",");
				}
				str += "{display:none!important;}";
				css(str, "ArticleImageQueueDownloaderHide");
			}
			if ("observeURL" in siteData && siteData.observeURL === "head" && !isObserveURL) {
				isObserveURL = true;
				headUrlObserver();
			}
			if ("observeURL" in siteData && siteData.observeURL === "nav" && !isObserveURL) {
				isObserveURL = true;
				if ("navigation" in unsafeWindow) {
					navUrlObserver();
				} else {
					loopUrlObserver();
				}
			}
			if ("observeURL" in siteData && siteData.observeURL === "loop" && !isObserveURL) {
				isObserveURL = true;
				loopUrlObserver();
			}
			if (!isOpenUI && config.autoOpenPanel == 1) {
				createUI();
			}
		}
	};

	mainInit();

	let gMenuA = GM_registerMenuCommand("💬 Greasy Fork " + i18n[getLanguage()].feedback, () => GM_openInTab("https://greasyfork.org/scripts/555974/feedback"));
	let gMenuB = GM_registerMenuCommand(i18n[getLanguage()].openUI, createUI);

})(idb);