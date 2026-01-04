// ==UserScript==
// @name         YouTubeShortcuts
// @name:zh-TW   YouTube快捷鍵
// @name:ja      YouTubeショートカット
// @name:en      YouTubeShortcuts
// @name:de      YouTubeTastenkombinationen
// @name:uk      Ярлики YouTube
// @description  使用快捷鍵函式庫為YouTube定義特定的快捷鍵規則，點選導航選項和篩選按鈕。
// @description:zh-TW 使用快捷鍵函式庫為YouTube定義特定的快捷鍵規則，點選導航選項和篩選按鈕。
// @description:ja YouTube用のショートカットライブラリを使用して、特定のショートカットルールを定義し、ナビゲーションオプションやフィルターボタンをクリックします。
// @description:en Uses a shortcut library to define specific shortcut rules for YouTube, clicking navigation options and filter buttons.
// @description:de Verwendet eine Tastenkombinationsbibliothek, um spezifische Tastenkombinationsregeln für YouTube zu definieren, die Navigationsoptionen und Filterknöpfe anklicken.
// @description:uk Використовує бібліотеку ярликів для визначення специфічних правил ярликів для YouTube, клацаючи на опціях навігації та кнопках фільтрів.

// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_info
// @require      https://update.greasyfork.org/scripts/542910/1626268/%E5%BF%AB%E6%8D%B7%E9%8D%B5%E5%87%BD%E5%BC%8F%E5%BA%AB.js
// @version      1.0.0

// @author       Max
// @namespace    https://github.com/Max46656
// @license      MPL2.0
// @downloadURL https://update.greasyfork.org/scripts/552766/YouTubeShortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/552766/YouTubeShortcuts.meta.js
// ==/UserScript==

class YouTubeShortcuts {
    constructor() {
        // 初始化：設定快捷鍵函式庫並定義YouTube規則
        this.shortcutLib = new ShortcutLibrary();
        this.youtubeRules = [
            {
              "ruleName": "首頁",
              "urlPattern": "https://www.youtube.com/.*",
              "selectorType": "css",
              "selector": "#endpoint[href='/']",
              "nthElement": 1,
              "shortcut": "CapsLock+Q",
              "ifLinkOpen": false,
              "isEnabled": true
            },
            {
              "ruleName": "紀錄",
              "urlPattern": "https://www.youtube.com/.*",
              "selectorType": "css",
              "selector": "#endpoint[href='/feed/history']",
              "nthElement": 1,
              "shortcut": "CapsLock+W",
              "ifLinkOpen": false,
              "isEnabled": true
            },
            {
              "ruleName": "最愛影片",
              "urlPattern": "https://www.youtube.com/.*",
              "selectorType": "css",
              "selector": "#endpoint[href='/playlist?list=LL']",
              "nthElement": 1,
              "shortcut": "CapsLock+E",
              "ifLinkOpen": false,
              "isEnabled": true
            },
            {
              "ruleName": "第一選項",
              "urlPattern": "https://www.youtube.com/.*",
              "selectorType": "css",
              "selector": "button.ytChipShapeButtonReset,yt-tab-shape.yt-tab-shape",
              "nthElement": 1,
              "shortcut": "CapsLock+R",
              "ifLinkOpen": false,
              "isEnabled": true
            },
            {
              "ruleName": "第二選項",
              "urlPattern": "https://www.youtube.com/.*",
              "selectorType": "css",
              "selector": "button.ytChipShapeButtonReset,yt-tab-shape.yt-tab-shape",
              "nthElement": 2,
              "shortcut": "CapsLock+A",
              "ifLinkOpen": false,
              "isEnabled": true
            },
            {
              "ruleName": "第三選項",
              "urlPattern": "https://www.youtube.com/.*",
              "selectorType": "css",
              "selector": "button.ytChipShapeButtonReset,yt-tab-shape.yt-tab-shape",
              "nthElement": 3,
              "shortcut": "CapsLock+S",
              "ifLinkOpen": false,
              "isEnabled": true
            },
            {
              "ruleName": "第四選項",
              "urlPattern": "https://www.youtube.com/.*",
              "selectorType": "css",
              "selector": "button.ytChipShapeButtonReset,yt-tab-shape.yt-tab-shape",
              "nthElement": 4,
              "shortcut": "CapsLock+D",
              "ifLinkOpen": false,
              "isEnabled": true
            },
            {
              "ruleName": "第五選項",
              "urlPattern": "https://www.youtube.com/.*",
              "selectorType": "css",
              "selector": "button.ytChipShapeButtonReset,yt-tab-shape.yt-tab-shape",
              "nthElement": 5,
              "shortcut": "CapsLock+F",
              "ifLinkOpen": false,
              "isEnabled": true
            },
            {
              "ruleName": "第六選項",
              "urlPattern": "https://www.youtube.com/.*",
              "selectorType": "css",
              "selector": "button.ytChipShapeButtonReset,yt-tab-shape.yt-tab-shape",
              "nthElement": 6,
              "shortcut": "CapsLock+G",
              "ifLinkOpen": false,
              "isEnabled": true
            },
            {
              "ruleName": "第七選項",
              "urlPattern": "https://www.youtube.com/.*",
              "selectorType": "css",
              "selector": "button.ytChipShapeButtonReset",
              "nthElement": 7,
              "shortcut": "CapsLock+Z",
              "ifLinkOpen": false,
              "isEnabled": true
            },
            {
              "ruleName": "第八選項",
              "urlPattern": "https://www.youtube.com/.*",
              "selectorType": "css",
              "selector": "button.ytChipShapeButtonReset",
              "nthElement": 8,
              "shortcut": "CapsLock+X",
              "ifLinkOpen": false,
              "isEnabled": true
            },
            {
              "ruleName": "第九選項",
              "urlPattern": "https://www.youtube.com/.*",
              "selectorType": "css",
              "selector": "button.ytChipShapeButtonReset",
              "nthElement": 9,
              "shortcut": "CapsLock+C",
              "ifLinkOpen": false,
              "isEnabled": true
            },
            {
              "ruleName": "第十選項",
              "urlPattern": "https://www.youtube.com/.*",
              "selectorType": "css",
              "selector": "button.ytChipShapeButtonReset",
              "nthElement": 10,
              "shortcut": "CapsLock+V",
              "ifLinkOpen": false,
              "isEnabled": true
            },
            {
              "ruleName": "第十一選項",
              "urlPattern": "https://www.youtube.com/.*",
              "selectorType": "css",
              "selector": "button.ytChipShapeButtonReset",
              "nthElement": 11,
              "shortcut": "CapsLock+B",
              "ifLinkOpen": false,
              "isEnabled": true
            }
        ];
        this.init();
    }

    // 初始化YouTube快捷鍵
    // 輸入參數: 無
    // 返回值: void
    init() {
        this.checkAndInsertNavigation();
        this.addYouTubeRules();
    }

    // 檢查並插入缺失的 #endpoint 元素
    // 輸入參數: 無
    // 返回值: void
    checkAndInsertNavigation() {
        const existingNavBar = document.querySelector("#endpoint[href='/']");
        if (!existingNavBar) {
            const navigationBar = document.createElement('div');

            const links = [
                { href: '/', title: 'Home' },
                { href: '/feed/history', title: 'History' },
                { href: '/playlist?list=LL', title: 'Liked videos' }
            ];

            for (const link of links) {
                const anchor = document.createElement('a');
                anchor.id = 'endpoint';
                anchor.className = 'yt-simple-endpoint style-scope ytd-guide-entry-renderer';
                anchor.tabIndex = -1;
                anchor.setAttribute('role', 'link');
                anchor.href = link.href;
                anchor.title = link.title;
                navigationBar.appendChild(anchor);
            }

            navigationBar.style.display = 'none';
            document.body.appendChild(navigationBar);

            console.log(`${GM_info.script.name}: 已插入隱藏的 navigationBar 元素以支援快捷鍵`);
        }
    }

    // 新增YouTube規則（若規則尚未存在）
    // 輸入參數: 無
    // 返回值: void
    addYouTubeRules() {
        const existingRules = this.shortcutLib.getRules();
        const hasYouTubeRules = existingRules.some(rule =>
            this.youtubeRules.some(ytRule =>
                ytRule.ruleName === rule.ruleName &&
                ytRule.urlPattern === rule.urlPattern &&
                ytRule.selector === rule.selector
            )
        );

        if (!hasYouTubeRules) {
            this.youtubeRules.forEach(rule => {
                const success = this.shortcutLib.addRule(rule);
                if (success) {
                    console.log(`${GM_info.script.name}: 成功新增規則 "${rule.ruleName}"`);
                }
            });
        } else {
            console.log(`${GM_info.script.name}: YouTube規則已存在，跳過新增`);
        }
    }
}

// 啟動YouTube快捷鍵
const youtubeShortcuts = new YouTubeShortcuts();
