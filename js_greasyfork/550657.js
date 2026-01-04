// ==UserScript==
// @name         【Kevin】Steam 浏览器增强
// @namespace    【Kevin】Steam 浏览器增强
// @author       Kevin
// @description  添加了语言切换、云存档按钮、评测统计按钮、显示中英文名字。更新 Steam 最新页面样式。
// @version      0.6
// @match        https://store.steampowered.com/*
// @match        https://www.togeproductions.com/SteamScout/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steamcommunity.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/550657/%E3%80%90Kevin%E3%80%91Steam%20%E6%B5%8F%E8%A7%88%E5%99%A8%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/550657/%E3%80%90Kevin%E3%80%91Steam%20%E6%B5%8F%E8%A7%88%E5%99%A8%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(function() {
    'use strict';

    // 公共辅助函数
    function getBrowserLanguage() {
        let language = navigator.language || navigator.userLanguage;
        if (!language) {
            language = 'en-US';
        }
        return language;
    }

    // 获取当前游戏ID
    const url = location.href;
    const match = url.match(/app\/(\d+)\//);
    let appId = null;

    if (match) {
        appId = match[1];
    }

    // 当前浏览器语言
    const language = getBrowserLanguage();

    // 检查页面是否为游戏商店页面
    const isAppPage = /^https:\/\/store\.steampowered\.com\/app\//.test(url);

    // 检查是否为SteamScout页面
    const isScoutPage = /^https:\/\/www\.togeproductions\.com\/SteamScout\//.test(url);

    // 功能模块1 & 2: 添加评测统计和云存档按钮
    function addCustomButtons() {
        if (!appId) return;

        const otherSiteInfo = document.querySelector('.apphub_OtherSiteInfo');
        if (!otherSiteInfo) return;

        // 添加CSS样式到页面头部
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            .btn_scout, .btn_cloudsave {
                margin-left: 4px;
            }
        `;
        document.head.appendChild(styleElement);

        // 评测统计按钮
        let reviewText = "💯 Review Scoutv2";
        if (language === "zh-CN") {
            reviewText = "💯 评测统计v2";
        } else if (language === "zh-TW") {
            reviewText = "💯 評測統計v2";
        }
        const scoutUrl = `https://www.togeproductions.com/SteamScout/?appid=${appId}`;
        const reviewButton = document.createElement('a');
        reviewButton.className = "btnv6_blue_hoverfade btn_medium btn_scout";
        reviewButton.href = scoutUrl;
        reviewButton.target = "_blank";
        reviewButton.innerHTML = `<span>${reviewText}</span>`;

        // 云存档按钮
        let cloudSaveText = "🔃 Cloudsave";
        if (language === "zh-CN") {
            cloudSaveText = "🔃 云存档";
        } else if (language === "zh-TW") {
            cloudSaveText = "🔃 雲端存檔";
        }
        const cloudSaveUrl = `https://store.steampowered.com/account/remotestorageapp?appid=${appId}&index=0`;
        const cloudSaveButton = document.createElement('a');
        cloudSaveButton.className = "btnv6_blue_hoverfade btn_medium btn_cloudsave";
        cloudSaveButton.href = cloudSaveUrl;
        cloudSaveButton.target = "_blank";
        cloudSaveButton.innerHTML = `<span>${cloudSaveText}</span>`;

        otherSiteInfo.prepend(cloudSaveButton);
        otherSiteInfo.prepend(reviewButton);
    }

    // 功能模块3: 添加语言切换功能
    function addLanguageSwitcher() {
        let container = null;
        if (isAppPage) {
            const appHubHeader = document.querySelector('.apphub_HomeHeaderContent');
                const langBar = document.createElement('div');
                langBar.style.display = 'flex';
                langBar.style.justifyContent = 'flex-end';
                langBar.style.marginBottom = '10px';
                langBar.style.gap = '2px';
                appHubHeader.parentNode.insertBefore(langBar, appHubHeader.nextSibling);
                container = langBar;
        }

        const add_lang_change_btn = (l_txt, l_URL, l_iso) => {
            let theURL = new URL(window.location);
            theURL.searchParams.set("l", l_URL);
            let ele = document.createElement('div');
            ele.classList.add('app_tag');
            ele.style.display = 'inline-block';
            ele.style.cursor = 'pointer';
            ele.appendChild(document.createTextNode(l_txt));

            if (((new URL(window.location)).searchParams.get("l") == l_URL) || (document.documentElement.lang == l_iso)) {
                ele.style.backgroundColor = "#67c1f5";
                ele.style.color = "#fff";
                ele.style.fontWeight = "bold";
                ele.style.boxShadow = "0 0 3px rgba(103, 193, 245, 0.7)";
                ele.style.cursor = "not-allowed";
            } else {
                ele.style.backgroundColor = "rgba(103, 193, 245, 0.2)";
                ele.style.color = "#67c1f5";
                ele.onclick = () => { window.location = theURL.href; };

                ele.addEventListener('mouseenter', () => {
                    ele.style.backgroundColor = "rgba(103, 193, 245, 0.3)";
                    ele.style.color = "#ffffff";
                });
                ele.addEventListener('mouseleave', () => {
                    ele.style.backgroundColor = "rgba(103, 193, 245, 0.2)";
                    ele.style.color = "#67c1f5";
                });
            }
            container.append(ele);
        };

        const change_all_url_lang = (l_URL) => {
            let nodes = document.querySelectorAll('a[href]');
            for (let node of nodes) {
                let theURL = new URL(node.href);
                let hostmap = ["store.steampowered.com"];
                if (hostmap.includes(theURL.host)) {
                    theURL.searchParams.set("l", l_URL);
                    node.href = theURL.href;
                }
            }
        };

        const change_all_url_lang_to_current_page_lang = () => {
            steam_lang_btn_map.forEach(v => {
                if (document.documentElement.lang == v[2]) {
                    change_all_url_lang(v[1]);
                }
            });
        };

        const hide_es_language_warning = () => {
            let es_language_warning_s = document.getElementsByClassName("es_language_warning");
            if (es_language_warning_s.length > 0) {
                es_language_warning_s[0].style.display = "none";
            }
        };

        let steam_lang_btn_map = [
            ["英", "english", "en"],
            ["简", "schinese", "zh-cn"],
            ["繁", "tchinese", "zh-tw"],
            ["日", "japanese", "ja"],
            ["韩", "korean", "ko"],
            ["法", "french", "fr"],
            ["德", "german", "de"],
            ["俄", "russian", "ru"],
            ["波", "polish", "pl"],
            ["西", "spanish", "es"],
            ["葡", "portuguese", "pt"],
            ["拉", "latam", "es-419"],
            ["巴", "brazilian", "pt-br"]
        ];

        steam_lang_btn_map.forEach(v => {
            add_lang_change_btn(v[0], v[1], v[2]);
        });

        change_all_url_lang_to_current_page_lang();
        hide_es_language_warning();

        const observer = new MutationObserver(() => {
            change_all_url_lang_to_current_page_lang();
            hide_es_language_warning();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 功能模块4: 显示中英文游戏名
    function addDualLanguageTitle() {
        if (!appId) return;

        const mode = window.localStorage.getItem("sen_mode") ?? "c(e)";

        fetch(`https://store.steampowered.com/api/appdetails?appids=${appId}&l=english`)
            .then(async (response) => {
                if (response.ok) {
                    const json = await response.json();
                    const data = json[appId];
                    if (data.success !== true) { return; }

                    let { name: name_en } = data.data;

                    const t = setInterval(() => {
                        const ele_title = document.getElementById("appHubAppName");
                        if (ele_title != null) {
                            clearInterval(t);
                            const ele_path = document.querySelector("div.blockbg>a:last-child");
                            let name_cur = ele_title.textContent
                            if (name_cur.toLowerCase() != name_en.toLowerCase()) {
                                let name_new = "";
                                if (mode === "e(c)") {
                                    name_new = `${name_en} (${name_cur})`;
                                } else {
                                    name_new = `${name_cur} (${name_en})`;
                                }

                                ele_title.textContent = name_new;
                                if (ele_path !== null) {
                                    ele_path.textContent = name_new;
                                }
                            }

                            ele_title.title = "双击快捷搜索";
                            ele_title.addEventListener("dblclick", () => {
                                ShowConfirmDialog(`你想做什么呢？`, "", "复制游戏名", "搜索游戏名")
                                    .done(() => {
                                        const setClipboard = (data) => { GM_setClipboard(data, "text"); }
                                        if (name_cur == name_en) {
                                            setClipboard(name_cur);
                                        } else {
                                            ShowConfirmDialog(`要复制哪个游戏名称？`, "", name_cur, name_en)
                                                .done(() => { setClipboard(name_cur); })
                                                .fail((stats) => {
                                                    if (stats) { setClipboard(name_en); }
                                                });
                                        }
                                    })
                                    .fail((stats) => {
                                        if (stats) {
                                            if (name_cur == name_en) {
                                                window.open(`https://store.steampowered.com/search/?term=${name_cur}`);
                                            } else {
                                                ShowConfirmDialog(`要使用哪个搜索关键词？`, "", name_cur, name_en)
                                                    .done(() => { window.open(`https://store.steampowered.com/search/?term=${name_cur}`); })
                                                    .fail((stats) => {
                                                        if (stats) { window.open(`https://store.steampowered.com/search/?term=${name_en}`); }
                                                    });
                                            }
                                        }
                                    });
                            });
                        }
                    }, 500);
                } else {
                    console.error(response.status);
                }
            })
            .catch((err) => {
                console.error(err);
            });

        GM_registerMenuCommand(`切换名称格式：【${mode === "c(e)" ? "本地化名 (英文名)" : "英文名 (本地化名)"}】`, () => {
            window.localStorage.setItem("sen_mode", mode === "c(e)" ? "e(c)" : "c(e)");
            window.location.reload();
        });
    }

    // 执行所有功能模块
    if (isAppPage) {
        addCustomButtons();
        addDualLanguageTitle();
    } else if (isScoutPage) {
        handleScoutPage();
    }
    addLanguageSwitcher();
})();