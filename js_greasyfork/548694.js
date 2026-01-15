// ==UserScript==
// @name        JAV cross-site navigation Linker (Class Refactor)
// @namespace   https://tampermonkey.net/
// @version     2026.01.12
// @description Add Jable.tv link button to JAVDB, JAVBUS, JAVLIBRARY, AV01 and AVJOY pages, and cross-site navigation buttons, plus subtitle site links. Refactored as JableLinker class for maintainability. Adds JAVDB list page previews.
// @author      庄引X@https://x.com/zhuangyin8
// @match       https://javdb.com/*
// @match       https://www.javbus.com/*
// @match       https://javlibrary.com/*
// @match       https://jable.tv/*
// @match       https://avjoy.me/video/*
// @match       https://www.av01.tv/*
// @match       https://sladko.tv/*
// @match       https://missav.ws/*
// @match       https://sukebei.nyaa.si/*
// @match       https://btdig.com/*
// @match       https://btsow.pics/*
// @match       https://yhg007.com/*
// @match       https://haijiao.com/*
// @match       https://subtitlecat.com/*
// @match       https://skrbtso.top/*
// @grant       GM_xmlhttpRequest
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_registerMenuCommand
// @run-at      document-idle
// @connect     jable.tv
// @connect     javdb.com
// @connect     javbus.com
// @connect     avjoy.me
// @connect     av01.tv
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/548694/JAV%20cross-site%20navigation%20Linker%20%28Class%20Refactor%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548694/JAV%20cross-site%20navigation%20Linker%20%28Class%20Refactor%29.meta.js
// ==/UserScript==
class JableLinker {
    constructor() {
        this.SITES = {
            JAVDB: "https://javdb.com",
            JAVBUS: "https://www.javbus.com",
            JAVLIBRARY: "https://javlibrary.com",
            JABLE: "https://jable.tv",
            AVJOY: "https://avjoy.me",
            AV01: "https://www.av01.tv",
            SLADKOTV: "https://sladko.tv",
            MISSAV: "https://missav.ws",
            SUKEBEI: "https://sukebei.nyaa.si",
            BTDIG: "https://btdig.com",
            BTSOW: "https://btsow.pics",
            YHG: "https://yhg007.com",
            HAYAV: "https://hayav.com",
            AVSUBTITLES: "https://avsubtitles.com",
            SUBTITLECAT: "https://subtitlecat.com",
            HAIJIAO: "https://haijiao.com",
            SKRBTSO: "https://skrbtso.top",
        };
        this.SELECTORS = {
            // JAV Site Selectors
            JAVDB_CODE: ".value",
            JAVDB_TITLE: ".title",
            JAVDB_PREVIEW_IMAGES: ".preview-images .tile-item",
            JAVBUS_SAMPLE_BOX: ".sample-box",
            JABLE_TITLE: "h4",
            JAVBUS_TITLE: ".container h3",
            JAVLIBRARY_TITLE: "h3.text",
            AVJOY_TITLE: ".video-title h1",
            AV01_TITLE: "h1.text-white",
            SLADKOTV_TITLE: "h1.video-title ",
            MISSAV_TITLE: ".mt-4 h1",
        };
        this.STYLES = {
            SUKEBEI: `table.torrent-list td:nth-child(4) {white-space: wrap;}.navbar-form .input-group>.form-control {width: 100%;margin-right: 50vw;}
      .container div:has(video),.container div:has(iframe),.ts-im-container,div:has(>.mn-related-container)/*,td:has(img)*/{display:none !important;}
      #navbar > form {position: fixed; top:30px;width: 1vw;}.table {width: 100%;} .torrent-list>tbody>tr>td { white-space: normal; max-width:90vw;}`,
            BTDIG: `.fa-folder-closed:before {content:"\\f07b"}`,
            BTSOW: `.search {position: sticky !important;top: 80px !important;} .form-inline .input-group {width: 100%;} .hidden-xs:not(.tags-box,.text-right,.search,.search-container)/*,.data-list:not(.detail) .size,.data-list:not(.detail) .date*/{ display: none !important;} .q-container {max-width: 50vw !important;margin-left: 0 !important;}`,
            YHG: `.wrapper {margin-left: -50%;} .bobologo{ display: none !important;}`,
            JAVBUS: `.row > #waterfall{ width: 100vw !important; } .container { width: 80vw !important; } .masonry #waterfall{ display: grid; grid-template-columns: repeat(4, 1fr); } .mb20 { display: grid; grid-template-columns: repeat(3, 1fr); } .movie-box { width: auto !important; height: 100% !important; margin: 0 !important; } #waterfall .masonry-brick { position: relative !important; top: 0px !important; left: 0 !important; } .screencap img {width:auto  !important; }.movie-box .photo-frame, .movie-box img { width: 100% !important; height: auto !important; margin: 0 !important;} iframe,.banner728,.banner300,.bcpic2{display:none}
            .navbar-default .navbar-collapse, .navbar-default .navbar-form {display: flex !important;flex: 1;}.navbar-form .input-group {width: 100%;}`,
            JAVDB: `.column {padding: 0; }.buttons:not(:last-child) {margin-bottom: 0rem;}.columns {align-items: center;}.container:not(.is-max-desktop):not(.is-max-widescreen) { max-width: 100vw; } .movie-list .item .video-title { white-space: normal; } .moj-content{display:none}.fancybox-slide--video .fancybox-content,.fancybox-video {height: auto !important;width: auto !important;/*left: 25%;top: 25%;*/}`,
            JAVLIBRARY: `.main > div:not([id]),iframe,#leftmenu > table:last-child,#topbanner11{display:none}`,
            JABLE: `.video-img-box .title,.title{white-space:normal;max-height:auto}.container {max-width: 100% !important;} .right-sidebar {display: contents;max-width: 500px;} .right-sidebar .video-img-box {display:inline-block !important;} .right-sidebar>.gutter-20>.col-lg-12 {flex: 0 0 25% !important;} .justify-content-center,.h5,iframe,.asg-interstitial,.root--ujvuu ,.text-sponsor,.pb-3 .row .col-6:nth-child(2),.right-sidebar .row .col-6:nth-child(1){display:none}.right-sidebar .video-img-box .img-box {min-width: 100%; max-width: 100%;}.plyr--video {width: 80%;margin: auto;}`,
            AV01: `.group:has(> div.overflow-hidden){display:none} .gap-8 > div{grid-column:span 3 / span 3} .max-w-7xl{max-width: 90vw;}.space-y-4 > div{width: 33vw;display: -webkit-box;}`,
            SLADKOTV: `main > .container {max-width: calc(100vw - 60px);}`,
            AVJOY: `.related-video .thumb-overlay,.related-video .content-info {width: 100%;}.container {max-width: 100vw;} .content-right{ width: 100%;}.content-left {;max-width: 70%;margin:0 auto;} .content-right{display: grid;grid: auto-flow /repeat(4, 1fr) ;} .ad-content-bot,.ad-content-side{display:none}`,
            MISSAV: `.sm\\:container {max-width: 100vw !important;}.order-first{width:100vw !important;} .video-player-container {width: 100%;}.xl\\:grid-cols-4 {gap: 10px;}.-mt-6 {width: 80%;height: 80%;margin: 0 auto !important;}.order-last,.order-last >div {max-width: 100% !important;min-width: 100% !important;}.related-videos,.order-last > div  {display: grid;grid-template-columns: repeat(4, 1fr);gap: 10px;}.ad-banner,.advertisement,.ads,.list-none,.space-y-6{display:none !important;}.content-without-search > .flex, .order-last > div >.flex {flex-direction: column;}.ml-6 {margin-left: 0 !important;}.mb-6>div {width:100% !important}.truncate {white-space: normal;}`,
            HAIJIAO: `* {-webkit-user-select:auto;}.containeradvertising,.haslist,.article-handle,.url-box{display:none !important;}.floor_box .article img {max-width: 100% !important;}`,
            SUBTITLECAT: `body + div,{display:none !important;z-index:-9999 !important;}`,
        };
        const commonButtons = {
            javdb: true,
            javbus: true,
            javlibrary: true,
            jable: true,
            av01: true,
            avjoy: true,
            avsubtitles: true,
            subtitlecat: true,
            missav: true,
            sladkotv: true,
            btdig: true,
            btsow: true,
            yhg: true,
            sukbei: true,
            hayav: true,
        };
        this.SITE_CONFIG = {
            [this.SITES.JAVDB]: {
                titleSelector: this.SELECTORS.JAVDB_TITLE,
                codeSelector: this.SELECTORS.JAVDB_CODE,
                style: this.STYLES.JAVDB,
                pathCheck: "/v/",
                buttons: {
                    ...commonButtons,
                    javdb: false
                },
                magnetSelectors: {
                    list: "#magnets-content .item",
                    hashLink: "a",
                    title: ".name",
                    size: ".meta",
                    date: ".time",
                    insertPoint: ".magnet-name", //#magnets-content > div:nth-child(1) > div.magnet-name.column.is-four-fifths > a
                },
            },
            [this.SITES.JAVBUS]: {
                titleSelector: this.SELECTORS.JAVBUS_TITLE,
                style: this.STYLES.JAVBUS,
                pathCheck: /[A-Za-z]+-\d+/,
                buttons: {
                    ...commonButtons,
                    javbus: false
                },
                magnetSelectors: {
                    list: "#magnet-table tr",
                    hashLink: "td:nth-child(1) a",
                    title: "td:nth-child(1) a",
                    size: "td:nth-child(2) a",
                    date: "td:nth-child(3) a",
                    insertPoint: "td",
                },
            },
            [this.SITES.JAVLIBRARY]: {
                titleSelector: this.SELECTORS.JAVLIBRARY_TITLE,
                style: this.STYLES.JAVLIBRARY,
                pathCheck: "/?v=",
                buttons: {
                    ...commonButtons
                },
            },
            // Video Site Configs
            [this.SITES.JABLE]: {
                titleSelector: this.SELECTORS.JABLE_TITLE,
                style: this.STYLES.JABLE,
                pathCheck: "/videos/",
                buttons: {
                    ...commonButtons,
                    jable: false
                },
                isVideoSite: true,
            },
            [this.SITES.AVJOY]: {
                titleSelector: this.SELECTORS.AVJOY_TITLE,
                style: this.STYLES.AVJOY,
                pathCheck: "/video/",
                buttons: {
                    ...commonButtons,
                    avjoy: false
                },
                isVideoSite: true,
            },
            [this.SITES.AV01]: {
                titleSelector: this.SELECTORS.AV01_TITLE,
                style: this.STYLES.AV01,
                pathCheck: "/video/",
                buttons: {
                    ...commonButtons,
                    av01: false
                },
                isVideoSite: true,
            },
            [this.SITES.SLADKOTV]: {
                titleSelector: this.SELECTORS.SLADKOTV_TITLE,
                style: this.STYLES.SLADKOTV,
                pathCheck: "/watch/",
                buttons: {
                    ...commonButtons,
                    sladkotv: false
                },
                isVideoSite: true,
            },
            [this.SITES.MISSAV]: {
                titleSelector: this.SELECTORS.MISSAV_TITLE,
                style: this.STYLES.MISSAV,
                pathCheck: "/cn/",
                buttons: {
                    ...commonButtons,
                    missav: false
                },
                isVideoSite: true,
            },
            // Magnet Site Configs
            [this.SITES.SKRBTSO]: {
                style: this.STYLES.SKRBTSO,
                isMagnetSite: true,
                buttons: {
                    ...commonButtons
                },
                magnetSelectors: {
                    list: ".list-unstyled",
                    hashLink: "li:nth-child(1) > a",
                    title: "li:nth-child(1) > a",
                    size: "li.rrmi > span:nth-child(2)",
                    date: "li.rrmi > span:nth-child(4)",
                    insertPoint: "li:nth-child(1) > a",
                },
                magnetDetailsSelectors: {
                    list: "body > div > div:nth-child(3) > div.col-md-6",
                    hashLink: "#magnet",
                    title: "h3",
                    size: "div:nth-child(2) > div.panel-body > ul > li:nth-child(2)",
                    date: "div:nth-child(2) > div.panel-body > ul > li:nth-child(3)",
                    insertPoint: "h3",
                },
            },
            [this.SITES.SUKEBEI]: {
                style: this.STYLES.SUKEBEI,
                isMagnetSite: true,
                buttons: {
                    ...commonButtons
                },
                magnetSelectors: {
                    list: "tbody tr",
                    hashLink: "td:nth-child(3) a:last-child",
                    title: "td:nth-child(2) a:not(:has(i))",
                    size: "td:nth-child(4)",
                    date: "td:nth-child(5)",
                    insertPoint: "td:nth-child(2) > a",
                },
            },
            [this.SITES.BTDIG]: {
                style: this.STYLES.BTDIG,
                pathCheck: new RegExp("[0-9a-fA-F]{40}"),
                isMagnetSite: true,
                buttons: {
                    ...commonButtons
                },
                magnetSelectors: {
                    list: ".one_result",
                    hashLink: ".torrent_name a",
                    title: ".torrent_name a",
                    size: ".torrent_size",
                    date: ".torrent_age",
                    insertPoint: ".torrent_magnet",
                },
                magnetDetailsSelectors: {
                    list: "table",
                    hashLink: "tbody > tr:nth-child(4) > td:nth-child(2) > div > a",
                    title: "tbody > tr:nth-child(5) > td:nth-child(2)",
                    size: "tbody > tr:nth-child(6) > td:nth-child(2)",
                    date: "tbody > tr:nth-child(7) > td:nth-child(2)",
                    insertPoint: "tbody > tr:nth-child(3) > th:nth-child(2)",
                },
            },
            [this.SITES.BTSOW]: {
                style: this.STYLES.BTSOW,
                isMagnetSite: true,
                buttons: {
                    ...commonButtons
                },
                magnetSelectors: {
                    list: ".data-list .row",
                    hashLink: "a",
                    title: "a",
                    size: ".size",
                    date: ".date",
                    insertPoint: "a",
                },
                magnetDetailsSelectors: {
                    list: "main",
                    hashLink: ".data-list div:nth-child(1) > div.hash",
                    title: ".text-h5",
                    size: ".data-list div:nth-child(3) > div.value",
                    date: ".data-list div:nth-child(4) > div.value",
                    insertPoint: ".text-h5",
                },
            },
            [this.SITES.YHG]: {
                style: this.STYLES.YHG,
                isMagnetSite: true,
                magnetSelectors: {
                    list: ".tbox .ssbox",
                    hashLink: "div.title > h3 > a",
                    title: "div.title > h3 > a",
                    size: "div.sbar > span:nth-child(3) > b",
                    date: "div.sbar > span:nth-child(4) > b",
                    insertPoint: "div.title h3 a",
                },
                magnetDetailsSelectors: {
                    list: "main",
                    hashLink: ".data-list div:nth-child(1) > div.hash",
                    title: ".text-h5",
                    size: ".data-list div:nth-child(3) > div.value",
                    date: ".data-list div:nth-child(4) > div.value",
                    insertPoint: ".text-h5",
                },
            },
            [this.SITES.HAIJIAO]: {
                style: this.STYLES.HAIJIAO,
            },
        };
    }
    // ==================== 2. UTILITY FUNCTIONS ====================
    utils = {
        isIncludes: (domain) => window.location.origin.includes(domain),
        isValidPath: (pathCheck) => typeof pathCheck === "string" ? window.location.href.includes(pathCheck) : window.location.href.match(pathCheck),
        waitForElement: (selector, timeoutMs = 3000) => new Promise((resolve, reject) => {
            const existing = document.querySelector(selector);
            if (existing) return resolve(existing);
            const observer = new MutationObserver(() => {
                const el = document.querySelector(selector);
                if (el) {
                    observer.disconnect();
                    resolve(el);
                }
            });
            observer.observe(document.documentElement, {
                childList: true,
                subtree: true,
            });
            if (timeoutMs > 0) setTimeout(() => {
                observer.disconnect();
                reject(new Error(`waitForElement timeout: ${selector}`));
            }, timeoutMs);
        }),
        moveElementToNextSiblingFirstChild: (selector) => {
            const element = document.querySelector(selector);
            if (!element) {
                console.error("The provided element is invalid.");
                return;
            }
            const nextSibling = element.nextElementSibling;
            if (!nextSibling) {
                console.warn("The element has no next sibling to move to.");
                return;
            }
            nextSibling.insertBefore(element, nextSibling.firstElementChild);
        },
        getCodeFromCurrentSite: (domain, selector) => {
            if (!this.utils.isIncludes(domain)) return null;
            const titleElement = document.querySelector(selector);
            const title = titleElement ? titleElement.textContent.trim() : "";
            let codeMatch = title.match(/[A-Za-z]+-\d+/) || document.title.match(/[A-Za-z]+-\d+/);
            if (codeMatch && codeMatch[0]) return codeMatch[0];
            const lastSegment = decodeURIComponent(window.location.pathname.split("/").filter(Boolean).pop() || "", );
            codeMatch = lastSegment.match(/[A-Za-z]+-\d+/);
            return codeMatch ? codeMatch[0] : null;
        },
        gmFetch: (url, options = {}) => new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url,
                ...options,
                onload: (response) => {
                    if (response.status >= 200 && response.status < 300) {
                        resolve(response);
                    } else {
                        reject(new Error(`Request failed with status ${response.status}`), );
                    }
                },
                onerror: (error) => reject(new Error("Network error during request", {
                    cause: error
                })),
            });
        }),
        NewElement: (tagName = "div", config = {}) => {
            const element = document.createElement(tagName);
            if (config.textContent) element.textContent = config.textContent;
            if (config.className) element.className = config.className;
            if (config.id) element.id = config.id;
            if (config.attributes) Object.entries(config.attributes).forEach(([key, value]) => element.setAttribute(key, value), );
            if (config.events) Object.entries(config.events).forEach(([event, handler]) => element.addEventListener(event, handler), );
            if (config.style) Object.assign(element.style, config.style);
            return element;
        },
    };
    // ==================== 3. DOM & UI MANIPULATION ====================
    dom = {
        injectStyleOnce: (style, idKey) => {
            if (!style || document.getElementById(idKey)) return;
            const styleElement = this.utils.NewElement("style", {
                id: idKey,
                textContent: style,
            });
            document.head.appendChild(styleElement);
        },
        linkButtonDefs: {
            // 其他站点 - 红色/紫色系
            javbus: {
                text: "JAVBUS",
                color: "#e74c3c",
                url: (code) => `${this.SITES.JAVBUS}/${code.replace("DSVR", "3DSVR")}`,
            },
            javlibrary: {
                text: "Javlibrary",
                color: "#6027ae",
                url: (code) => `${this.SITES.JAVLIBRARY}/cn/vl_searchbyid.php?keyword=${code}`,
            },
            hayav: {
                text: "HAYAV",
                color: "#8e44ad",
                url: (code) => `${this.SITES.HAYAV}/search/${code}`,
            },
            avsubtitles: {
                text: "AVSubtitles",
                color: "#e91e63",
                url: (code) => `${this.SITES.AVSUBTITLES}/search_results.php?search=${code}`,
            },
            subtitlecat: {
                text: "SubtitleCat",
                color: "#c0392b",
                url: (code) => `${this.SITES.SUBTITLECAT}/index.php?search=${code}`,
            },
            // isVideoSite - 绿色/蓝色系
            jable: {
                text: "Jable",
                color: "#27ae60",
                url: (code) => `${this.SITES.JABLE}/videos/${code}/`,
            },
            av01: {
                text: "AV01",
                color: "#3498db",
                url: (code) => `${this.SITES.AV01}/cn/search?q=${code}`,
            },
            avjoy: {
                text: "AVJOY",
                color: "#16a085",
                url: (code) => `${this.SITES.AVJOY}/search/videos/${code}`,
            },
            sladkotv: {
                text: "SLADKOTV",
                color: "#2980b9",
                url: (code) => `${this.SITES.SLADKOTV}/search?q=${code}`,
            },
            missav: {
                text: "MISSAV",
                color: "#1abc9c",
                url: (code) => `${this.SITES.MISSAV}/cn/search/${code}`,
            },
            // isMagnetSite - 棕色/灰色系
            btdig: {
                text: "BTDIG",
                color: "#795548",
                url: (code) => `${this.SITES.BTDIG}/search?q=${code}`,
            },
            btsow: {
                text: "BTSOW",
                color: "#607d8b",
                url: (code) => `${this.SITES.BTSOW}/search/${code}`,
            },
            yhg: {
                text: "YHG",
                color: "#506d7b",
                url: (code) => `${this.SITES.YHG}/search-${code}-0-0-1.html`,
            },
            sukbei: {
                text: "SUKEBEI",
                color: "#6c757d",
                url: (code) => `${this.SITES.SUKEBEI}/?f=0&c=0_0&q=${code}`,
            },
        },
        addCopyButtonsToList: (itemSelector, codeElementSelector) => {
            document.querySelectorAll(itemSelector).forEach((item) => {
                // Check if button is already added to this item
                if (item.querySelector(".tm-list-copy-btn")) return;
                const codeElement = item.querySelector(codeElementSelector);
                if (!codeElement) return;
                const textToCopy = codeElement.textContent.trim();
                if (!textToCopy) return;
                const copyButton = this.utils.NewElement("a", {
                    className: "tm-list-copy-btn",
                    attributes: {
                        href: "#",
                        title: "複製番號"
                    },
                    style: {
                        //marginRight: "5px",
                        textDecoration: "none",
                        fontSize: "1em",
                        verticalAlign: "middle",
                    },
                    events: {
                        click: async (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const button = e.currentTarget;
                            if (!button) return;
                            try {
                                await navigator.clipboard.writeText(textToCopy);
                                const originalText = button.textContent;
                                button.textContent = "✅";
                                setTimeout(() => {
                                    if (button && button.parentNode) {
                                        button.textContent = originalText;
                                    }
                                }, 2000);
                            } catch (err) {
                                console.error("JableLinker: Copy failed:", err);
                            }
                        },
                    },
                });
                copyButton.textContent = "📋";
                codeElement.insertAdjacentElement("afterbegin", copyButton);
            });
        },
        initBtdigFilesCollapse: () => {
            const getIndent = el => parseFloat(el.style.paddingLeft || '0');
            // 获取 fa 行后连续的 span / br
            const getFollowingMetaNodes = el => {
                const nodes = [];
                let n = el.nextSibling;
                while (n && n.nodeType === 1 && (n.tagName === 'SPAN' || n.tagName === 'BR')) {
                    nodes.push(n);
                    n = n.nextSibling;
                }
                return nodes;
            };
            // 获取文件夹下所有子节点
            const getChildren = folder => {
                const indent = getIndent(folder);
                const children = [];
                let node = folder.nextSibling;
                while (node) {
                    if (node.nodeType !== 1) {
                        node = node.nextSibling;
                        continue;
                    }
                    if (node.classList?.contains('fa')) {
                        if (getIndent(node) <= indent) break;
                        children.push(node, ...getFollowingMetaNodes(node));
                    }
                    node = node.nextSibling;
                }
                return children;
            };
            // 折叠文件夹
            const collapse = folder => {
                folder.classList.remove('fa-folder-open');
                folder.classList.add('fa-folder-closed');
                getChildren(folder).forEach(el => el.style.display = 'none');
            };
            // 展开文件夹（只展开直属层）
            const expand = folder => {
                folder.classList.remove('fa-folder-closed');
                folder.classList.add('fa-folder-open');
                const indent = getIndent(folder);
                let node = folder.nextSibling;
                while (node) {
                    if (node.nodeType !== 1) {
                        node = node.nextSibling;
                        continue;
                    }
                    if (node.classList?.contains('fa')) {
                        const nodeIndent = getIndent(node);
                        if (nodeIndent <= indent) break;
                        if (nodeIndent === indent + 1) {
                            node.style.display = '';
                            getFollowingMetaNodes(node).forEach(n => n.style.display = '');
                        }
                    }
                    node = node.nextSibling;
                }
            };
            // 递归展开所有子文件夹
            const expandAll = folder => {
                expand(folder);
                const childrenFolders = getChildren(folder).filter(el => el.classList?.contains('fa-folder-closed'));
                childrenFolders.forEach(f => expandAll(f));
            };
            // 递归折叠所有子文件夹
            const collapseAll = folder => {
                collapse(folder);
                const childrenFolders = getChildren(folder).filter(el => el.classList?.contains('fa-folder-open'));
                childrenFolders.forEach(f => collapseAll(f));
            };
            // 初始化：所有文件夹折叠 + 点击事件
            const allFolders = document.querySelectorAll('.fa.fa-folder-open');
            allFolders.forEach(folder => {
                folder.style.cursor = 'pointer';
                collapse(folder);
                folder.addEventListener('click', e => {
                    e.stopPropagation();
                    folder.classList.contains('fa-folder-closed') ? expand(folder) : collapse(folder);
                });
            });
            // 创建“展开/折叠所有”按钮
            let expanded = false; // 当前状态
            const btn = document.createElement('button');
            btn.textContent = '展开所有文件夹';
            btn.style.cssText = 'position:fixed;top:10px;right:10px;z-index:999;padding:5px 10px;font-size:14px;';
            btn.addEventListener('click', () => {
                if (!expanded) {
                    allFolders.forEach(folder => expandAll(folder));
                    btn.textContent = '折叠所有文件夹';
                } else {
                    allFolders.forEach(folder => collapseAll(folder));
                    btn.textContent = '展开所有文件夹';
                }
                expanded = !expanded;
            });
            document.body.appendChild(btn);
        },
        //
        addPreviewButtonsToList: (itemSelector, codeElementSelector) => {
            document.querySelectorAll(itemSelector).forEach((item) => {
                if (item.querySelector(".tm-preview-btn")) return;
                const codeElement = item.querySelector(codeElementSelector);
                if (!codeElement) return;
                const detailLinkElement = item.querySelector("a");
                if (!detailLinkElement) return;
                const detailUrl = detailLinkElement.href;
                const previewButton = this.utils.NewElement("a", {
                    className: "tm-preview-btn",
                    attributes: {
                        href: "#",
                        title: "预览详情"
                    },
                    style: {
                        //marginRight: "5px",
                        textDecoration: "none",
                        fontSize: "1em",
                        verticalAlign: "middle",
                    },
                    events: {
                        click: async (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const button = e.currentTarget;
                            if (!button) return;
                            const originalText = button.textContent;
                            try {
                                button.textContent = "⏳";
                                const response = await this.utils.gmFetch(detailUrl);
                                const doc = new DOMParser().parseFromString(response.responseText, "text/html", );
                                const videoDetailElement = doc.querySelector(".video-detail");
                                const stylesheetLink = doc.querySelector('link[rel="stylesheet"][href*="application"]', );
                                if (videoDetailElement /*&& stylesheetLink*/ ) {
                                    // const cssUrl = new URL(stylesheetLink.getAttribute('href'), detailUrl).href;
                                    this.drawer.openWithContent(videoDetailElement, codeElement.textContent.trim() /*, cssUrl*/ , );
                                } else {
                                    console.error("JableLinker: Preview content or stylesheet not found.", );
                                    alert("无法加载预览内容。");
                                }
                            } catch (err) {
                                console.error("JableLinker: Preview failed:", err);
                                const errorMsg = err.message || "未知错误";
                                if (errorMsg.includes("403")) {
                                    alert("加载预览失败: 访问被拒绝 (403)。可能是网站阻止了请求，请尝试直接打开链接。", );
                                } else {
                                    alert(`加载预览失败: ${errorMsg}`);
                                }
                            } finally {
                                if (button && button.parentNode) {
                                    button.textContent = originalText;
                                }
                            }
                        },
                    },
                });
                previewButton.textContent = "👁️";
                codeElement.insertAdjacentElement("afterbegin", previewButton);
            });
        },
        addLinkButtons: async (code, selector, buttonsConfig) => {
            const titleElement = await this.utils.waitForElement(selector).catch(() => document.querySelector(selector));
            if (!code || !titleElement) return;
            const buttonContainer = this.utils.NewElement("div", {
                id: "cross-site-button-container",
                style: {
                    display: "inline-block",
                    zIndex: "10000",
                    position: "fixed",
                    left: "0",
                    top: "45px",
                },
            });
            // JAVDB special handling (async search) - 其他站点色系（红色/紫色系）
            if (buttonsConfig?.javdb) {
                try {
                    const response = await this.utils.gmFetch(`${this.SITES.JAVDB}/search?q=${encodeURIComponent(code)}`, );
                    const doc = new DOMParser().parseFromString(response.responseText, "text/html", );
                    const videoLink = doc.querySelector('a[href*="/v/"]');
                    const url = videoLink ? `${this.SITES.JAVDB}${videoLink.getAttribute("href")}` : `${this.SITES.JAVDB}/search?q=${encodeURIComponent(code)}`;
                    const btn = this.dom.createSingleButton("JAVDB", videoLink ? "#e74c3c" : "#c0392b", url, );
                    buttonContainer.appendChild(btn);
                } catch (error) {
                    console.error("JAVDB search failed:", error);
                    const btn = this.dom.createSingleButton("搜JAVDB", "#c0392b", `${this.SITES.JAVDB}/search?q=${encodeURIComponent(code)}`, );
                    buttonContainer.appendChild(btn);
                }
            }
            // Other sites
            Object.entries(this.dom.linkButtonDefs).forEach(([key, def]) => {
                if (buttonsConfig?.[key]) {
                    const btn = this.dom.createSingleButton(def.text, def.color, def.url(code), );
                    buttonContainer.appendChild(btn);
                }
            });
            titleElement.parentNode.insertBefore(buttonContainer, titleElement /*.nextSibling*/ , );
        },
        createSingleButton: (text, bgColor, url, target = "_self") => {
            return this.utils.NewElement("a", {
                textContent: text,
                attributes: {
                    href: url,
                    target: target
                },
                style: {
                    /*marginRight: "8px",border: "none", borderRadius: "3px",*/
                    padding: "4px 8px",
                    color: "#fff",
                    background: bgColor,
                    cursor: "pointer",
                    textDecoration: "none",
                    fontSize: "14px",
                },
            });
        },
        enhanceMagnetLinks: (config, detail = false) => {
            const processNode = (node) => {
                if (!node || node.__tm_magnet_enhanced__) return;
                const selectors = detail ? config.magnetDetailsSelectors : config.magnetSelectors;
                const hashLinkEl = node.querySelector(selectors.hashLink);
                if (!hashLinkEl) return;
                const hashMatch = hashLinkEl.href ? hashLinkEl.href.match(/[0-9a-fA-F]{40}/) : hashLinkEl.innerText;
                if (!hashMatch) return;
                const hash = hashLinkEl.href ? hashMatch[0].toLowerCase() : hashMatch.toLowerCase();
                //console.log(hash);
                const title = node.querySelector(selectors.title)?.innerText || `magnet-${hash.substring(0, 8)}`;
                const size = node.querySelector(selectors.size)?.innerText || "";
                const date = node.querySelector(selectors.date)?.innerText || "";
                //const magnetUrl = `magnet:?xt=urn:btih:${hash}&dn=${encodeURIComponent(title)}🔞Size=${size}🔞Date=${date}`;
                const magnetUrl = `magnet:?xt=urn:btih:${hash}&dn=${title}🔞Size=${size}🔞Date=${date}`;
                node.querySelector(selectors.title).innerText = magnetUrl;
                const insertPoint = node.querySelector(selectors.insertPoint);
                if (!insertPoint) return;
                const parent = insertPoint.parentElement;
                // Copy button
                const copyBtn = this.utils.NewElement("button", {
                    textContent: "📋",
                    attributes: {
                        title: "Copy Magnet Link"
                    },
                    style: {
                        height: "auto",
                        backgroundColor: "transparent",
                        borderColor: "transparent",
                        //marginRight: "10px",
                        cursor: "pointer",
                    },
                    events: {
                        click: async (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const button = e.currentTarget;
                            if (!button) return;
                            await navigator.clipboard.writeText(decodeURIComponent(magnetUrl), );
                            button.textContent = "✅";
                            setTimeout(() => {
                                if (button && button.parentNode) {
                                    button.textContent = "📋";
                                }
                            }, 2000);
                        },
                    },
                });
                // Preview magnetUrl button
                const previewBtn = this.utils.NewElement("button", {
                    textContent: "👁️",
                    attributes: {
                        title: "Preview Torrent Content"
                    },
                    style: {
                        height: "auto",
                        backgroundColor: "transparent",
                        borderColor: "transparent",
                        //marginRight: "10px",
                        cursor: "pointer",
                    },
                    events: {
                        click: (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const button = e.currentTarget;
                            if (button) {
                                button.textContent = "👀";
                            }
                            this.drawer.open(`https://magnet.pics/m/${hash}`, title);
                        },
                    },
                });
                parent.prepend(copyBtn, previewBtn);
                node.__tm_magnet_enhanced__ = true;
            };
            const run = () => document.querySelectorAll(detail ? config.magnetDetailsSelectors.list : config.magnetSelectors.list, ).forEach(processNode);
            run(); // Initial run
            // Observe for dynamically added nodes
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((m) => {
                    if (m.addedNodes.length) run();
                });
            });
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        },
        // Prevent specific hash fragments (e.g., Fancybox gallery hashes) from modifying the URL
        preventUrlHashChange: (hashRegex, patchHistory = true) => {
            try {
                const baseUrl = window.location.pathname + window.location.search;
                const restore = () => {
                    if (window.location.hash && hashRegex.test(window.location.hash)) {
                        history.replaceState(null, "", baseUrl);
                    }
                };
                // Ensure current URL is clean
                restore();
                // Revert whenever hash changes
                window.addEventListener("hashchange", restore, false);
                if (patchHistory) {
                    const origReplaceState = history.replaceState.bind(history);
                    const origPushState = history.pushState.bind(history);
                    history.replaceState = function(state, title, url) {
                        if (typeof url === "string" && /#/.test(url) && hashRegex.test(url)) {
                            url = url.replace(/#.*$/, "");
                        }
                        return origReplaceState(state, title, url);
                    };
                    history.pushState = function(state, title, url) {
                        if (typeof url === "string" && /#/.test(url) && hashRegex.test(url)) {
                            url = url.replace(/#.*$/, "");
                        }
                        return origPushState(state, title, url);
                    };
                }
            } catch (e) {
                // Silently ignore to avoid breaking the page
            }
        },
        replacePreviewImagesFromJAVBUS: async () => {
            try {
                const code = document.querySelector(this.SELECTORS.JAVDB_CODE)?.textContent.trim();
                if (!code) {
                    console.log("JableLinker: JAVDB code not found for image replacement.", );
                    return;
                }
                const javbusUrl = `${this.SITES.JAVBUS}/${code}`;
                const userCookie = await GM_getValue("javbus_cookie", "");
                const headers = {};
                if (userCookie) {
                    headers["Cookie"] = userCookie;
                }
                const response = await this.utils.gmFetch(javbusUrl, {
                    headers
                });
                const doc = new DOMParser().parseFromString(response.responseText, "text/html", );
                const anchorElements = Array.from(doc.querySelectorAll(this.SELECTORS.JAVBUS_SAMPLE_BOX), );
                const javbusHrefs = anchorElements.map((a) => a.getAttribute("href")).filter(Boolean);
                if (javbusHrefs.length > 0) {
                    if ((javbusHrefs[0] || "").includes("javdb")) {
                        console.log("JableLinker: JAVBUS links back to JAVDB, skipping image replacement.", );
                        return;
                    }
                    const previewImagesContainer = document.querySelector(".preview-images");
                    if (previewImagesContainer) {
                        Array.from(document.querySelectorAll(this.SELECTORS.JAVDB_PREVIEW_IMAGES), ).forEach((item) => item.remove());
                        javbusHrefs.forEach((href) => {
                            const a = this.utils.NewElement("a", {
                                className: "tile-item",
                                attributes: {
                                    href: href,
                                    "data-fancybox": "gallery",
                                    "data-caption": "",
                                },
                            });
                            const img = this.utils.NewElement("img", {
                                attributes: {
                                    src: href,
                                    alt: "",
                                    loading: "lazy",
                                },
                            });
                            a.appendChild(img);
                            previewImagesContainer.appendChild(a);
                        });
                        console.log(`JableLinker: Replaced preview images with ${javbusHrefs.length} items from JAVBUS for code: ${code}`, );
                    }
                } else {
                    console.log(`JableLinker: No preview images found on JAVBUS for code: ${code}`, );
                }
            } catch (error) {
                console.error("JableLinker: Error during replacePreviewImagesFromJAVBUS:", error, );
            }
        },
    };
    // ==================== 4. DRAWER CLASS FOR PREVIEWS ====================
    drawer = (() => {
        let drawerInstance = null;
        const create = (options) => {
            console.log(options);
            const {
                direction = "right",
                    width = "50vw",
                    title = "Preview",
            } = options;
            console.log(options);
            if (drawerInstance) {
                try {
                    document.body.removeChild(drawerInstance.element);
                } catch (e) {}
            }
            const element = this.utils.NewElement("div", {
                style: {
                    position: "fixed",
                    top: "0",
                    [direction]: "0",
                    width,
                    height: "100vh",
                    background: "white",
                    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                    transform: `translateX(${direction === "left" ? "-100%" : "100%"})`,
                    transition: "transform 0.3s ease",
                    zIndex: "9999",
                    overflowY: "auto",
                },
            });
            const header = this.utils.NewElement("div", {
                style: {
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "16px" /* ,borderBottom: '1px solid #eee', position: 'sticky', top: '0', backgroundColor: 'white', zIndex: '1'*/ ,
                },
            });
            const titleEl = this.utils.NewElement("a", {
                textContent: title,
                attributes: {
                    href: options.url
                },
                style: {
                    /* 'font-size': '24px'*/
                    "word-break": "break-all"
                },
            });
            const closeBtn = this.utils.NewElement("button", {
                textContent: "❌",
                style: {
                    background: "none",
                    border: "none",
                    fontSize: "24px",
                    cursor: "pointer",
                    color: "#666",
                },
            });
            const content = this.utils.NewElement("div", {
                style: {
                    padding: "0",
                    height: "calc(100% - 60px)"
                },
            });
            closeBtn.onclick = () => close();
            header.append(titleEl, closeBtn);
            element.append(header, content);
            document.body.appendChild(element);
            drawerInstance = {
                element,
                content
            };
            return drawerInstance;
        };
        const open = (url, title, width, direction) => {
            const instance = create({
                url,
                title,
                width,
                direction
            });
            instance.content.innerHTML = `<iframe width='100%' height='100%' src='${url}' style='display:block;'></iframe>`;
            requestAnimationFrame(
                () => (instance.element.style.transform = "translateX(0)"), );
        };
        const openWithContent = (element, title, cssHref) => {
            const instance = create({
                title
            });
            instance.content.innerHTML = "";
            // if (cssHref) {
            //     const styleLink = this.utils.NewElement('link', {
            //         attributes: { rel: 'stylesheet', href: cssHref }
            //     });
            //     instance.content.appendChild(styleLink);
            // }
            const wrapper = this.utils.NewElement("div", {
                style: {
                    padding: "1em",
                    backgroundColor: "#f5f5f5",
                    color: "#363636"
                },
            });
            element.querySelectorAll("img[src]").forEach((img) => {
                const src = img.getAttribute("src");
                if (src && !src.startsWith("http")) {
                    img.src = new URL(src, `${this.SITES.JAVDB}/`).href;
                }
            });
            wrapper.appendChild(element);
            instance.content.appendChild(wrapper);
            requestAnimationFrame(
                () => (instance.element.style.transform = "translateX(0)"), );
        };
        const close = () => {
            if (!drawerInstance) return;
            const {
                element
            } = drawerInstance;
            const direction = element.style.left === "0px" ? "left" : "right";
            element.style.transform = `translateX(${
        direction === "left" ? "-100%" : "100%"
      })`;
            setTimeout(() => {
                if (drawerInstance && drawerInstance.element === element) {
                    drawerInstance.content.innerHTML = "";
                }
            }, 300);
        };
        return {
            open,
            openWithContent
        };
    })();
    // ==================== NEW SUBTITLES MODULE ====================
    subtitles = {
        _inited: false,
        _state: {
            vttText: null,
            subtitleLabel: null,
            objectUrlsByVideo: new WeakMap(),
            hasLoadedSubtitle: false,
        },
        _isLikelyVtt: (text) => {
            const firstLine = (text || "").split(/\r?\n/)[0]?.trim();
            return firstLine === "WEBVTT" || (firstLine || "").startsWith("WEBVTT");
        },
        _convertSrtToVtt: (srtText) => {
            let text = (srtText || "").replace(/\r\n?/g, "\n");
            text = text.replace(/^\uFEFF/, "");
            text = text.replace(/(\d\d:\d\d:\d\d),(\d\d\d)/g, "$1.$2");
            text = text.replace(/\s+-->\s+/g, " --> ");
            text = text.replace(/\n\d+\n(?=\d\d:\d\d:\d\d\.\d{3}\s+-->)/g, "\n");
            text = text.replace(/\n{3,}/g, "\n\n");
            return "WEBVTT\n\n" + text.trim() + "\n";
        },
        _convertAssToVtt: (assText) => {
            let text = (assText || "").replace(/\r\n?/g, "\n");
            text = text.replace(/^\uFEFF/, "");
            const eventsMatch = text.match(/\[Events\][\s\S]*?(?=\[|$)/);
            if (!eventsMatch) return "WEBVTT\n\n";
            const eventsSection = eventsMatch[0];
            const dialogueLines = eventsSection.match(/^Dialogue:.*$/gm) || [];
            let vttContent = "WEBVTT\n\n";
            dialogueLines.forEach((line) => {
                const parts = line.split(",");
                if (parts.length < 10) return;
                const startTime = parts[1];
                const endTime = parts[2];
                const textContent = parts.slice(9).join(",");
                const formatTime = (timeStr) => {
                    const timeMatch = timeStr.match(/(\d+):(\d{2}):(\d{2})\.(\d{2})/);
                    if (!timeMatch) return timeStr;
                    const [, h, m, s, cs] = timeMatch;
                    return `${h.padStart(2, "0")}:${m.padStart(2, "0")}:${s.padStart(
            2,
            "0",
          )}.${(parseInt(cs) * 10).toString().padStart(3, "0")}`;
                };
                let cleanText = textContent.replace(/\{[^}]*\}/g, "").replace(/\\N/g, "\n").replace(/\\n/g, "\n").replace(/\\h/g, " ").trim();
                if (cleanText) vttContent += `${formatTime(startTime)} --> ${formatTime(
            endTime,
          )}\n${cleanText}\n\n`;
            });
            return vttContent.trim() + "\n";
        },
        _isLikelyAss: (text) => {
            return (
                (text || "").split(/\r?\n/)[0]?.trim() === "[Script Info]" || text.includes("[Events]") || text.includes("Dialogue:"));
        },
        _toVtt: (text) => {
            if (this.subtitles._isLikelyVtt(text)) return text;
            if (this.subtitles._isLikelyAss(text)) return this.subtitles._convertAssToVtt(text);
            return this.subtitles._convertSrtToVtt(text);
        },
        _revokeExistingObjectUrl: (video) => {
            try {
                const url = this.subtitles._state.objectUrlsByVideo.get(video);
                if (url) {
                    URL.revokeObjectURL(url);
                    this.subtitles._state.objectUrlsByVideo.delete(video);
                }
            } catch (_) {}
        },
        _removeExistingLocalTracks: (video) => {
            video.querySelectorAll('track[data-local-subtitle="1"]').forEach((t) => t.remove());
        },
        _attachSubtitleToVideo: (video) => {
            if (!this.subtitles._state.vttText) return;
            this.subtitles._revokeExistingObjectUrl(video);
            this.subtitles._removeExistingLocalTracks(video);
            const blob = new Blob([this.subtitles._state.vttText], {
                type: "text/vtt",
            });
            const url = URL.createObjectURL(blob);
            this.subtitles._state.objectUrlsByVideo.set(video, url);
            const track = this.utils.NewElement("track", {
                attributes: {
                    kind: "subtitles",
                    label: this.subtitles._state.subtitleLabel || "Local Subtitle",
                    srclang: "en",
                    src: url,
                    default: true,
                    "data-local-subtitle": "1",
                },
                events: {
                    load: () => {
                        if (track.track) track.track.mode = "showing";
                    },
                },
            });
            video.appendChild(track);
            try {
                for (const tt of video.textTracks) {
                    tt.mode = tt.label === track.label || tt.language === "en" ? "showing" : "disabled";
                }
            } catch (e) {}
        },
        _attachToAllVideos: () => {
            const videoSelectors = ["video", 'iframe[src*="player"]', 'iframe[src*="video"]', ".video-player video", ".player video", "#player video", ".jwplayer video", ".video-js video", ".plyr video", ];
            let allVideos = [];
            videoSelectors.forEach((selector) => {
                allVideos = allVideos.concat(Array.from(document.querySelectorAll(selector)), );
            });
            const uniqueVideos = [...new Set(allVideos)];
            if (uniqueVideos.length === 0) return;
            let maxWidthVideo = uniqueVideos.reduce(
                (max, vid) => vid.getBoundingClientRect().width > max.getBoundingClientRect().width ? vid : max, uniqueVideos[0], );
            if (maxWidthVideo) this.subtitles._attachSubtitleToVideo(maxWidthVideo);
        },
        _ensureUi: () => {
            if (document.getElementById("tm-add-local-subtitle-btn")) return;
            const container = this.utils.NewElement("div", {
                id: "tm-add-local-subtitle-container",
                style: {
                    position: "fixed",
                    zIndex: "2147483647",
                    bottom: "16px",
                    left: "16px",
                    display: "flex",
                    gap: "8px",
                    alignItems: "center",
                },
            });
            const input = this.utils.NewElement("input", {
                attributes: {
                    type: "file",
                    accept: ".vtt,.srt,.ass,text/vtt,text/plain,.sub",
                },
                style: {
                    display: "none"
                },
            });
            const label = this.utils.NewElement("span", {
                id: "tm-add-local-subtitle-label",
                style: {
                    fontSize: "12px",
                    color: "#fff",
                    textShadow: "0 1px 2px rgba(0,0,0,0.6)",
                },
            });
            const button = this.utils.NewElement("button", {
                id: "tm-add-local-subtitle-btn",
                textContent: "本地字幕",
                attributes: {
                    title: "为页面视频加载本地字幕 (.srt/.vtt/.ass)"
                },
                style: {
                    padding: "6px 10px",
                    fontSize: "12px",
                    color: "#fff",
                    background: "rgba(0,0,0,0.6)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: "6px",
                    cursor: "pointer",
                    backdropFilter: "saturate(150%) blur(6px)",
                    userSelect: "none",
                },
                events: {
                    click: () => input.click()
                },
            });
            const retryButton = this.utils.NewElement("button", {
                id: "tm-retry-subtitle-btn",
                textContent: "重新附加",
                attributes: {
                    title: "重新尝试附加字幕到视频"
                },
                style: {
                    padding: "6px 10px",
                    fontSize: "12px",
                    color: "#fff",
                    background: "rgba(255,165,0,0.8)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: "6px",
                    cursor: "pointer",
                    backdropFilter: "saturate(150%) blur(6px)",
                    userSelect: "none",
                },
                events: {
                    click: () => this.subtitles._attachToAllVideos()
                },
            });
            input.addEventListener("change", async () => {
                const file = input.files?.[0];
                if (!file) return;
                this.subtitles._state.subtitleLabel = file.name;
                try {
                    const text = await file.text();
                    this.subtitles._state.vttText = this.subtitles._toVtt(text);
                    this.subtitles._state.hasLoadedSubtitle = true;
                    label.textContent = file.name;
                    this.subtitles._attachToAllVideos();
                    setTimeout(() => this.subtitles._attachToAllVideos(), 3000);
                } catch (err) {
                    alert("读取字幕文件失败，请重试。");
                } finally {
                    input.value = "";
                }
            });
            container.append(button, retryButton, label, input);
            document.documentElement.appendChild(container);
        },
        _ensureCueStyle: () => {
            if (document.getElementById("tm-local-subtitle-cue-style")) return;
            const style = this.utils.NewElement("style", {
                id: "tm-local-subtitle-cue-style",
                textContent: `\nvideo::cue {\n  -webkit-text-stroke: 2px #000000;\n  text-shadow: 1px 0 0 #000000, -1px 0 0 #000000, 0 1px 0 #000000, 0 -1px 0 #000000, 1px 1px 0 #000000, -1px -1px 0 #000000, 1px -1px 0 #000000, -1px 1px 0 #000000;\n}`,
            });
            document.head.appendChild(style);
        },
        _observeNewVideos: () => {
            const observer = new MutationObserver((mutations) => {
                if (!this.subtitles._state.hasLoadedSubtitle) return;
                for (const m of mutations) {
                    if (m.type === "childList") {
                        m.addedNodes.forEach((node) => {
                            if (node?.nodeType === 1 && (node.nodeName.toLowerCase() === "video" || node.querySelector?.("video"))) {
                                this.subtitles._attachToAllVideos();
                            }
                        });
                    }
                }
            });
            observer.observe(document.documentElement || document.body, {
                childList: true,
                subtree: true,
            });
        },
        init: () => {
            if (this.subtitles._inited) return;
            this.subtitles._inited = true;
            this.subtitles._ensureUi();
            // this.subtitles._ensureCueStyle();
            this.subtitles._observeNewVideos();
        },
    };
    // ==================== 5. SITE HANDLERS ====================
    handlers = {
        handleGenericSite: (siteKey, hooks = {}) => {
            const config = this.SITE_CONFIG[siteKey];
            if (!config) return;
            //所有网站都同一处理
            if (config.style) this.dom.injectStyleOnce(config.style, siteKey.replace(/\./g, "-"));
            const isDetailPage = this.utils.isValidPath(config.pathCheck);
            //针对每一个网站单独操作
            if (siteKey === this.SITES.JAVBUS) {
                if (document.querySelector(".masonry-brick:has(.avatar-box)")) this.utils.moveElementToNextSiblingFirstChild(".masonry-brick:has(.avatar-box)", );
                [...document.querySelectorAll(".photo-frame img")].forEach((img) => {
                    if (img.src.includes("/pics/thumb/")) {
                        img.src = img.src.replace("/pics/thumb/", "/pics/cover/").replace(".jpg", "_b.jpg");
                    }
                });
            } else if (siteKey === this.SITES.JAVDB) {
                if (isDetailPage) {
                    this.dom.replacePreviewImagesFromJAVBUS();
                    // Prevent gallery hash (e.g., #gallery-1) from altering URL on detail pages
                    this.dom.preventUrlHashChange(/#gallery-\d+/, true);
                }
            } else if (siteKey === this.SITES.BTDIG) {
                if (isDetailPage) {
                    this.dom.initBtdigFilesCollapse();
                    //this.dom.enhanceMagnetLinks(config, true);
                }
            }
            if (config.isMagnetSite) {
                this.dom.enhanceMagnetLinks(config);
                if (isDetailPage) {
                    this.dom.enhanceMagnetLinks(config, true);
                }
                return;
            }
            if (config.isVideoSite && isDetailPage) {
                this.subtitles.init();
            }
            // 为JAVDB和JAVBUS详情页面增强磁力链接
            if (config.magnetSelectors && (siteKey === this.SITES.JAVDB || siteKey === this.SITES.JAVBUS)) {
                this.dom.enhanceMagnetLinks(config);
            }
            if (isDetailPage) {
                const code = this.utils.getCodeFromCurrentSite(siteKey, config.titleSelector, );
                if (code) {
                    // console.log(code, config.titleSelector, config.buttons);
                    this.dom.addLinkButtons(code, config.titleSelector, config.buttons);
                }
                // 为JAVDB和JAVBUS详情页面增强磁力链接
                if (config.magnetSelectors && (siteKey === this.SITES.JAVDB || siteKey === this.SITES.JAVBUS)) {
                    this.dom.enhanceMagnetLinks(config);
                }
            } else {
                // On List Page
                if (siteKey === this.SITES.JAVDB) {
                    const run = () => {
                        this.dom.addCopyButtonsToList(".item", ".video-title");
                        this.dom.addPreviewButtonsToList(".item", ".video-title");
                    };
                    run();
                    new MutationObserver(run).observe(document.body, {
                        childList: true,
                        subtree: true,
                    });
                }
                if (siteKey === this.SITES.JAVBUS) {
                    const run = () => this.dom.addCopyButtonsToList(".movie-box",
                        /*'.photo-info span'*/
                        "date", );
                    run();
                    new MutationObserver(run).observe(document.body, {
                        childList: true,
                        subtree: true,
                    });
                }
            }
        },
        setupCookieMenu: () => {
            GM_registerMenuCommand("设置站点与Cookie(多行表格)", async () => {
                // Build modal UI
                const existing = document.getElementById("tm-settings-modal");
                if (existing) existing.remove();
                const overlay = this.utils.NewElement("div", {
                    id: "tm-settings-modal",
                    style: {
                        position: "fixed",
                        inset: "0",
                        background: "rgba(0,0,0,0.45)",
                        zIndex: "2147483647",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    },
                });
                const panel = this.utils.NewElement("div", {
                    style: {
                        width: "min(800px, 96vw)",
                        maxHeight: "80vh",
                        overflow: "auto",
                        background: "#fff",
                        borderRadius: "10px",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                        padding: "16px",
                    },
                });
                const title = this.utils.NewElement("div", {
                    textContent: "站点与Cookie设置",
                    style: {
                        fontSize: "16px",
                        fontWeight: "600",
                        marginBottom: "10px"
                    },
                });
                const table = this.utils.NewElement("table", {
                    style: {
                        width: "100%",
                        borderCollapse: "collapse",
                        fontSize: "13px",
                    },
                });
                const tbody = this.utils.NewElement("tbody");
                const makeRow = (labelText, key, value, placeholder) => {
                    const tr = this.utils.NewElement("tr");
                    const tdLabel = this.utils.NewElement("td", {
                        textContent: labelText,
                        style: {
                            padding: "6px 8px",
                            whiteSpace: "nowrap",
                            verticalAlign: "middle",
                            width: "1%",
                        },
                    });
                    const tdInput = this.utils.NewElement("td", {
                        style: {
                            padding: "6px 8px"
                        },
                    });
                    const input = this.utils.NewElement("input", {
                        attributes: {
                            type: "text",
                            "data-key": key,
                            placeholder: placeholder || "",
                        },
                        style: {
                            width: "100%",
                            padding: "6px 8px",
                            border: "1px solid #ddd",
                            borderRadius: "6px",
                        },
                    });
                    input.value = value || "";
                    tdInput.appendChild(input);
                    tr.append(tdLabel, tdInput);
                    return tr;
                };
                // Load saved overrides in parallel
                const siteEntries = Object.entries(this.SITES);
                const savedPromises = siteEntries.map(([k]) => GM_getValue(`SITES.${k}`, ""), );
                const [savedValues, savedJavdbCookie, savedJavbusCookie] = await Promise.all([
                    Promise.all(savedPromises),
                    GM_getValue("javdb_cookie", ""),
                    GM_getValue("javbus_cookie", ""),
                ]);
                siteEntries.forEach(([key, defVal], idx) => {
                    const val = savedValues[idx] || defVal;
                    tbody.appendChild(makeRow(key, `SITES.${key}`, val, defVal));
                });
                // Cookie rows
                tbody.appendChild(makeRow("JAVDB Cookie", "javdb_cookie", savedJavdbCookie, ""), );
                tbody.appendChild(makeRow("JAVBUS Cookie", "javbus_cookie", savedJavbusCookie, ""), );
                table.appendChild(tbody);
                const actions = this.utils.NewElement("div", {
                    style: {
                        marginTop: "12px",
                        display: "flex",
                        gap: "8px",
                        justifyContent: "flex-end",
                    },
                });
                const btnCancel = this.utils.NewElement("button", {
                    textContent: "取消",
                    style: {
                        padding: "6px 12px",
                        border: "1px solid #ddd",
                        background: "#fff",
                        borderRadius: "6px",
                        cursor: "pointer",
                    },
                });
                const btnSave = this.utils.NewElement("button", {
                    textContent: "保存",
                    style: {
                        padding: "6px 12px",
                        border: "1px solid #1677ff",
                        background: "#1677ff",
                        color: "#fff",
                        borderRadius: "6px",
                        cursor: "pointer",
                    },
                });
                btnCancel.onclick = () => overlay.remove();
                btnSave.onclick = async () => {
                    const inputs = Array.from(tbody.querySelectorAll("input[data-key]"));
                    for (const input of inputs) {
                        const key = input.getAttribute("data-key");
                        const val = (input.value || "").trim();
                        await GM_setValue(key, val);
                        // Update in-memory SITES immediately
                        if (key.startsWith("SITES.")) {
                            const siteKey = key.slice(6);
                            if (this.SITES.hasOwnProperty(siteKey)) this.SITES[siteKey] = val || this.SITES[siteKey];
                        }
                    }
                    overlay.remove();
                    alert("已保存。部分设置可能在下次页面加载后生效。");
                };
                actions.append(btnCancel, btnSave);
                panel.append(title, table, actions);
                overlay.appendChild(panel);
                document.documentElement.appendChild(overlay);
            });
        },
    };
    // ==================== 6. INITIALIZATION ====================
    init() {
        this.handlers.setupCookieMenu();
        const currentSiteKey = Object.keys(this.SITE_CONFIG).find((site) => this.utils.isIncludes(site), );
        if (currentSiteKey) {
            this.handlers.handleGenericSite(currentSiteKey);
        } else {
            console.log("JableLinker: No handler for current site.");
        }
    }
}
// Launch the script
(function() {
    "use strict";
    new JableLinker().init();
})();