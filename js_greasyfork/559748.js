// ==UserScript==
// @name         Universal Dark Mode
// @author       Shayaan Hooda
// @license      MIT
// @namespace    https://tampermonkey.net/
// @version      1.0
// @description  Enable this script for dark mode, supported by most sites. Please give feedback so I can fix :)
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/559748/Universal%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/559748/Universal%20Dark%20Mode.meta.js
// ==/UserScript==

! function() {
    "use strict";
    let e = GM_getValue("sleek_dm_v1.0_" + location.hostname, true),
        t = true,
        n = null;
    const o = window.self !== window.top,
        r = /\p{Extended_Pictographic}|\p{Emoji_Presentation}/u,
        i = new RegExp(r, "gu");

    function a(e) {
        if (!e || "transparent" === e || "" === e) return null;
        const t = e.match(/[\d.]+/g);
        return !t || t.length < 3 ? null : [parseFloat(t[0]), parseFloat(t[1]), parseFloat(t[2]), t.length > 3 ? parseFloat(t[3]) : 1]
    }

    function l(e) {
        let t = e;
        for (; t && t !== document.documentElement;) {
            const e = a(window.getComputedStyle(t).backgroundColor);
            if (e && e[3] >= .1) return .2126 * e[0] + .7152 * e[1] + .0722 * e[2];
            t = t.parentElement
        }
        return 255
    }

    function d(e, t = false) {
        if (e.nodeType === Node.ELEMENT_NODE) {
            const n = e.tagName;
            if (["SCRIPT", "STYLE", "NOSCRIPT", "META", "LINK"].includes(n)) return;
            if (e.classList.contains("sleek-processed")) return;
            if (["INPUT", "TEXTAREA", "SELECT"].includes(n)) return void(t ? e.classList.add("sleek-preserve-input") : function(e) {
                if (e.dataset.sleekHooked) return;
                e.dataset.sleekHooked = "true", s(e), ["focus", "input", "blur"].forEach(t => e.addEventListener(t, () => s(e)))
            }(e));
            if ("SVG" === n && !t) return void(function(e) {
                const t = window.getComputedStyle(e);
                let n = a(t.fill);
                if (n || "none" !== t.fill || (n = a(t.stroke)), n || (n = a(t.color)), n) {
                    const [e, t, o, r] = n;
                    return !(r < .1) && .2126 * e + .7152 * t + .0722 * o > 160
                }
                return false
            }(e) || e.classList.add("sleek-invert-svg-content"));
            if (!t) {
                const n = window.getComputedStyle(e),
                    o = a(n.backgroundColor);
                if (o) {
                    const [r, i, a, l] = o;
                    l > .5 && .2126 * r + .7152 * i + .0722 * a < 100 && (e.classList.add("sleek-preserve"), "none" === n.backgroundImage && e.classList.add("sleek-black-bg"), t = true)
                }
            }
        }
        if (e.nodeType === Node.TEXT_NODE) return void(!t && r.test(e.nodeValue) && function(e) {
            const t = e.nodeValue,
                n = document.createDocumentFragment();
            let o, r = 0;
            i.lastIndex = 0;
            for (; null !== (o = i.exec(t));) {
                o.index > r && n.appendChild(document.createTextNode(t.substring(r, o.index)));
                const e = document.createElement("span");
                e.textContent = o[0], e.className = "sleek-emoji-protect", n.appendChild(e), r = i.lastIndex
            }
            r < t.length && n.appendChild(document.createTextNode(t.substring(r)));
            const a = document.createElement("span");
            a.className = "sleek-processed", a.appendChild(n), e.parentNode.replaceChild(a, e)
        }(e));
        let n = e.firstChild;
        for (; n;) {
            const e = n.nextSibling;
            d(n, t), n = e
        }
    }

    function s(e) {
        e.style.setProperty("background-color", "#121212", "important"), e.style.setProperty("color", "#ffffff", "important"), e.style.setProperty("border", "1px solid rgba(255,255,255,0.2)", "important")
    }

    function c() {
        if (e)
            if (t = function() {
                    if (l(document.documentElement) < 100) return false;
                    const e = [{
                        x: window.innerWidth / 2,
                        y: window.innerHeight / 2
                    }, {
                        x: .2 * window.innerWidth,
                        y: .2 * window.innerHeight
                    }, {
                        x: .8 * window.innerWidth,
                        y: .8 * window.innerHeight
                    }];
                    let t = 0,
                        n = 0;
                    return e.forEach(e => {
                        const o = document.elementFromPoint(e.x, e.y);
                        o && (t += l(o), n++)
                    }), (n ? t / n : 255) >= 100
                }(), t || o) {
                console.log("[Sleek] Light Page Detected - Engaging Dark Mode"),
                    function() {
                        n && n.remove(), n = document.createElement("style");
                        let e = "";
                        e += o ? "html, body { background-color: transparent !important; }" : "html{filter:invert(1) hue-rotate(180deg) contrast(.92)!important;background-color:#fefefe!important;transition:filter .2s}", e += ".sleek-preserve{filter:invert(1) hue-rotate(180deg)!important}.sleek-black-bg{background-color:#000!important;box-shadow:none!important}.sleek-preserve,.sleek-preserve :not(input):not(textarea):not(button){color:#fff!important;text-shadow:none!important}embed,image,img,object,picture,svg,video{filter:invert(1) hue-rotate(180deg) contrast(1.1)!important}.sleek-invert-svg-content,picture img{filter:none!important}.sleek-emoji-protect{filter:invert(1) hue-rotate(180deg)!important;display:inline-block;font-style:normal}input:not(.sleek-preserve-input),select:not(.sleek-preserve-input),textarea:not(.sleek-preserve-input){filter:invert(1) hue-rotate(180deg)!important;background-color:#121212!important;color:#fff!important;border:1px solid rgba(255,255,255,.2)!important;box-shadow:none!important}::placeholder{color:#888!important}::-webkit-scrollbar{width:8px}::-webkit-scrollbar-track{background:#222}::-webkit-scrollbar-thumb{background:#555;border-radius:4px}", n.textContent = e, document.head.appendChild(n)
                    }(), d(document.body);
                new MutationObserver(e => {
                    let t = false;
                    for (const n of e) n.addedNodes.length && (t = true);
                    t && d(document.body)
                }).observe(document.body, {
                    childList: true,
                    subtree: true
                })
            } else console.log("Dark Page Detected - Not changing anything")
    }
    GM_registerMenuCommand("Toggle Dark Mode", () => {
        GM_setValue("sleek_dm_v1.0_" + location.hostname, !e), location.reload()
    }), "loading" === document.readyState ? document.addEventListener("DOMContentLoaded", () => setTimeout(c, 50)) : setTimeout(c, 50)
}();