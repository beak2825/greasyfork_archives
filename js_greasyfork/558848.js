// ==UserScript==
// @name         Facebook Switch to All comments
// @namespace    https://docs.scriptcat.org/
// @version      0.1.2
// @description  To switch Facebook to All comments
// @author       CY Fung
// @match        https://www.facebook.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=www.facebook.com
// @grant        none
// @run-at       document-start
// @noframes
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558848/Facebook%20Switch%20to%20All%20comments.user.js
// @updateURL https://update.greasyfork.org/scripts/558848/Facebook%20Switch%20to%20All%20comments.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --------------------------------------------------------------------------------------------------------

    const texts = {
        "en": {
            "Most relevant": "Most relevant",
            "Newest": "Newest",
            "All comments": "All comments",
        },
        "es": {  // Spanish
            "Most relevant": "Más relevantes",
            "Newest": "Más recientes",
            "All comments": "Todos los comentarios",
        },
        "fr": {  // French
            "Most relevant": "Plus pertinents",
            "Newest": "Plus récents",
            "All comments": "Tous les commentaires",
        },
        "de": {  // German
            "Most relevant": "Relevanteste",
            "Newest": "Neueste",
            "All comments": "Alle Kommentare",
        },
        "pt": {  // Portuguese (Brazil)
            "Most relevant": "Mais relevantes",
            "Newest": "Mais recentes",
            "All comments": "Todos os comentários",
        },
        "ar": {  // Arabic (right-to-left language)
            "Most relevant": "الأكثر صلة",
            "Newest": "الأحدث",
            "All comments": "جميع التعليقات",
        },
        "hi": {  // Hindi
            "Most relevant": "सबसे प्रासंगिक",
            "Newest": "नवीनतम",
            "All comments": "सभी टिप्पणियाँ",
        },
        "zh-Hans": {  // Chinese (Simplified)
            "Most relevant": "最相关",
            "Newest": "最新",
            "All comments": "所有评论",
        },
        "zh": {  // Chinese (Simplified)
            "Most relevant": "最相关",
            "Newest": "最新",
            "All comments": "所有评论",
        },
        "zh-Hant": {  // Chinese (Traditional)
            "Most relevant": "最相關",
            "Newest": "由新到舊",
            "All comments": "所有留言",
        },
        "zh_TW": {  // Chinese (Traditional)
            "Most relevant": "最相關",
            "Newest": "由新到舊",
            "All comments": "所有留言",
        },
        "zh_HK": {  // Chinese (Traditional)
            "Most relevant": "最相關",
            "Newest": "由新到舊",
            "All comments": "所有留言",
        },
        "ja": {  // Japanese
            "Most relevant": "関連度の高い順",
            "Newest": "新着順",
            "All comments": "すべてのコメント",
        },
        "ko": {  // Korean
            "Most relevant": "관련도순",
            "Newest": "최신순",
            "All comments": "모든 댓글",
        },
        "ru": {  // Russian
            "Most relevant": "Самые релевантные",
            "Newest": "Новые",
            "All comments": "Все комментарии",
        },
        "id": {  // Indonesian
            "Most relevant": "Paling relevan",
            "Newest": "Terbaru",
            "All comments": "Semua komentar",
        },
        "it": {  // Italian
            "Most relevant": "Più rilevanti",
            "Newest": "Più recenti",
            "All comments": "Tutti i commenti",
        },
        "tr": {  // Turkish
            "Most relevant": "En uygun",
            "Newest": "En yeniler",
            "All comments": "Tüm yorumlar",
        },
    }

    const STATE_INITIAL = 0x0100;
    const STATE_FINAL = 0x0300;

    // const SELECTOR_COMMENT_GRAY_BOX = ".xmjcpbm,.xrgxkkn,.xv2q8z8";
    let SELECTOR_COMMENT_GRAY_BOX = "";
    // const SELECTOR_LOADING_AREA = '[style*="--x-animationDelay"]';

    // --------------------------------------------------------------------------------------------------------

    function getElementByXPath(xpath, context = document) {
        return document.evaluate(
            xpath,
            context,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;
    }

    function getElementsByXPath(xpath, context = document) {
        const results = [];
        const query = document.evaluate(
            xpath,
            context,
            null,
            XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
            null
        );

        for (let i = 0; i < query.snapshotLength; i++) {
            results.push(query.snapshotItem(i));
        }

        return results;
    }

    const startMonitor = (c) => {

        const observer = new MutationObserver(c);
        observer.observe(document, { childList: true, subtree: true });

    };

    const getParentWith = (dom, selector) => {
        let p = dom;
        while (p) {
            if (p.querySelector(selector)) return p;
            p = p.parentNode;
        }
        return null;
    };

    const getLangText = () => {
        const lang = document.documentElement.lang;
        const text = texts[lang] || texts["en"];
        return text;
    };

    const setTimeout_ = setTimeout;

    const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    const mFloor = (x, m) => Math.floor(x / m) * m;
    const setTimeoutQ = (e, d) => {
        d = mFloor(d, 10) + mFloor(randInt(2, 8), 2) + mFloor(randInt(24, 48), 2) / 100 + Math.random() * 0.01;
        return setTimeout_(e, d);
    }

    const deferred = () => {
        let resolve;
        let reject;
        const promise = new Promise((res, rej) => {
            resolve = res;
            reject = rej;
        });
        return { promise, resolve, reject };
    };

    // --------------------------------------------------------------------------------------------------------

    const obtainClass = () => {

        const cutClass = (cssText, search) => {
            let idx = cssText.indexOf(search);
            if (idx > 0) {
                let jdx = cssText.lastIndexOf("{", idx);
                if (jdx > 0) {
                    return cssText.substring(0, jdx) || "";
                }
            }
            return "";
        }

        const selfStaticClass = (c) => {
            if (!c) return "";
            const m = c.trim().split(/\s+/);
            const s = m[m.length - 1];
            if (s.includes(":")) return "";
            return s || "";
        }


        const rulesList = [];

        for (const sheet of document.styleSheets) {
            const rules = sheet.cssRules || sheet.rules;
            if (rules.length > 300) {
                rulesList.push(rules);
            }
        }

        if (rulesList.length > 1) {
            rulesList.sort((a, b) => b.length - a.length);
        }

        const targetRules = rulesList[0];

        const listForSELECTOR_COMMENT_GRAY_BOX = new Set();

        if (targetRules && targetRules.length > 300) {

            for (const rule of targetRules) {
                const cssText = rule.cssText;
                let classA = selfStaticClass(cutClass(cssText, "--comment-background"));
                if (classA) {
                    if (/^[\w-]*(\.[\w-]+)+$/.test(classA)) {
                        listForSELECTOR_COMMENT_GRAY_BOX.add(classA);
                    }
                }
                let classB = selfStaticClass(cutClass(cssText, "--comment-bubble"));
                if (classB) {
                    if (/^[\w-]*(\.[\w-]+)+$/.test(classB)) {
                        listForSELECTOR_COMMENT_GRAY_BOX.add(classB);
                    }
                }
            }
        }

        const SELECTOR_COMMENT_GRAY_BOX = [...listForSELECTOR_COMMENT_GRAY_BOX].join(",") || ".NO_SUCH_A_CLASS";

        // console.log(4001, { SELECTOR_COMMENT_GRAY_BOX })

        return { SELECTOR_COMMENT_GRAY_BOX };
    };

    // --------------------------

    let a0013 = STATE_INITIAL;

    setInterval(() => {
        if (a0013 === 0x0F11) {
            a0013 = STATE_INITIAL;
            // console.log(`set a0013 to ${a0013}`);
        }
    }, 350);


    let mDeferred = null;

    let clickWait = null;

    const rp = document.createElement("rp");

    const mutationLoop = async (callback) => {
        try {
            while (true) {
                let r = await callback();
                if (r) return;
                if (!mDeferred) mDeferred = deferred();
                await mDeferred.promise;
            }
        } catch (e) {
            console.error(e);
        }
    }

    let cid2 = 0;
    let cid5 = 0;
    let cidClick = 0;
    let clickHandler = null;
    const makeClickActionOn = (elm) => {
        const q = a0013;
        clickHandler = () => {
            clickHandler = null;
            if (a0013 !== q) return;
            elm.click();
            a0013 |= 1;
            // console.log(`set a0013 to ${a0013}`);
            document.documentElement.appendChild(rp).remove();
        };
        clearTimeout(cidClick);
        cidClick = setTimeoutQ(clickHandler, 80);
    }

    const delayedC2 = () => {

        a0013 = 0x012A;
        // console.log(`set a0013 to ${a0013}`);
        const text = getLangText();

        // requestAnimationFrame(() => {

        if (!SELECTOR_COMMENT_GRAY_BOX) {
            SELECTOR_COMMENT_GRAY_BOX = obtainClass().SELECTOR_COMMENT_GRAY_BOX;
        }

        let divs = getElementsByXPath(`//div[@role="button"]/span[starts-with(normalize-space(.), "${text["Most relevant"]}")]/parent::div`);
        divs = divs.filter((div) => {
            let parentLayout = getParentWith(div, SELECTOR_COMMENT_GRAY_BOX);
            if (!parentLayout) return false;
            return true;
        });

        if (!divs.length || a0013 !== 0x012A) {
            a0013 = 0x0100;
            return;
        }

        divs.forEach(div => {

            a0013 = (0x0200 | 0);
            // console.log(`set a0013 to ${a0013}`);
            const p = clickWait = deferred();
            makeClickActionOn(div);
            setTimeoutQ(() => {
                p.resolve();
            }, 120);
            // console.log("a0013", a0013);
            return true;
        });
        // });
    }

    const delayedC5 = () => {

        a0013 = 0x022A;
        // console.log(`set a0013 to ${a0013}`);
        const text = getLangText();

        // requestAnimationFrame(() => {

        if (!SELECTOR_COMMENT_GRAY_BOX) {
            SELECTOR_COMMENT_GRAY_BOX = obtainClass().SELECTOR_COMMENT_GRAY_BOX;
        }

        let menuitems = getElementsByXPath(`//div[@role="menuitem"]/div//span[starts-with(normalize-space(.), "${text["All comments"]}")]/ancestor::div[@role="menuitem"]`);
        menuitems = menuitems.filter((menuitem) => {
            let parentLayout = getParentWith(menuitem, SELECTOR_COMMENT_GRAY_BOX);
            if (!parentLayout) return false;
            return true;
        });

        if (!menuitems.length || a0013 !== 0x022A) {
            a0013 = 0x0100;
            return;
        }

        menuitems.forEach(menuitem => {

            if (a0013 !== 0x022A) return true;

            a0013 = (STATE_FINAL | 0);
            // console.log(`set a0013 to ${a0013}`);
            const p = clickWait = deferred();
            // console.log("a0013", a0013);
            makeClickActionOn(menuitem);
            setTimeoutQ(() => {
                p.resolve();
            }, 400);
            return true;

        });

        // });
    };

    startMonitor(async (mutations) => {

        if (!mutations || !mutations.length) return;

        if (mDeferred) {
            mDeferred.resolve();
            mDeferred = null;
        }

        if (clickHandler) {
            clearTimeout(cidClick);
            cidClick = setTimeoutQ(clickHandler, 80);
            // cidClick = 0;
        }

        if (a0013 === 0x0120) {
            clearTimeout(cid2);
            cid2 = setTimeoutQ(delayedC2, 40);
            // cid2 = 0;
        }
        else if (a0013 === 0x0220) {
            clearTimeout(cid5);
            cid5 = setTimeoutQ(delayedC5, 40);
            // cid5 = 0;
        } else if (a0013 === (STATE_FINAL | 1)) {
            a0013 = 0x0F10;
            // console.log(`set a0013 to ${a0013}`);
        }

        // let addedCount = 0;
        // for (const mutation of mutations) {
        //     for (const addedNode of mutation.addedNodes) {
        //         if (addedNode instanceof HTMLElement) {
        //             if (addedNode.isConnected === true) {
        //                 addedCount++;
        //             }
        //         }
        //     }
        // }
        // if (addedCount === 0) return;

        // if (clickHandler) {
        //     clearTimeout(cidClick);
        //     cidClick = setTimeoutQ(clickHandler, 80);
        // }

        if (clickWait) {
            await clickWait.promise;
        }

        if (a0013 === 0x0F10) {
            a0013 = 0x0F11;
            // console.log(`set a0013 to ${a0013}`);
        }

        const text = getLangText();
        if (a0013 === 0x0100) {
            const divs = getElementsByXPath(`//div[@role="button"]/span[starts-with(normalize-space(.), "${text["Most relevant"]}")]/parent::div`);
            if (divs.length > 0) {
                a0013 = 0x0120;
                // console.log(`set a0013 to ${a0013}`);
            }
        }

        if (a0013 === 0x0120) {
            clearTimeout(cid2);
            cid2 = setTimeoutQ(delayedC2, 40);
        }

        if (a0013 === (0x0200 | 1)) {
            const menuitems = getElementsByXPath(`//div[@role="menuitem"]/div//span[starts-with(normalize-space(.), "${text["All comments"]}")]/ancestor::div[@role="menuitem"]`);
            if (menuitems.length > 0) {
                a0013 = 0x0220;
                // console.log(`set a0013 to ${a0013}`);
            }
        }

        if (a0013 === 0x0220) {
            clearTimeout(cid5);
            cid5 = setTimeoutQ(delayedC5, 40);
        }

    });
    document.documentElement.appendChild(rp).remove();

})();
