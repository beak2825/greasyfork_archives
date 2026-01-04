// ==UserScript==
// @name         YouTube Watch Time Saver (Stable t Parameter)
// @namespace    http://tampermonkey.net/
// @version      7
// @description  Kısayola basıldığında son geçerli zamanı (0 olmaz) URL’ye t=XXs olarak yazar
// @match        https://www.youtube.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/555928/YouTube%20Watch%20Time%20Saver%20%28Stable%20t%20Parameter%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555928/YouTube%20Watch%20Time%20Saver%20%28Stable%20t%20Parameter%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /********************************
     *  AYARLAR
     ********************************/
    const defaultHotkey = "Ctrl+Ş";

    if (!GM_getValue("hotkey")) {
        GM_setValue("hotkey", defaultHotkey);
    }

    function openConfig() {
        const newKey = prompt(
            "Yeni kısayolu girin (örnek: Ctrl+Shift+S, Alt+X, Ctrl+Ş):",
            GM_getValue("hotkey")
        );
        if (newKey && newKey.trim() !== "") {
            GM_setValue("hotkey", newKey.trim());
            alert("Kısayol güncellendi: " + GM_getValue("hotkey"));
        }
    }

    GM_registerMenuCommand("Kısayolu Değiştir", openConfig);

    /********************************
     *  KISAYOL KONTROLÜ
     ********************************/
    function matchesHotkey(event) {
        const hk = GM_getValue("hotkey").toLowerCase();

        const hasCtrl = hk.includes("ctrl");
        const hasAlt = hk.includes("alt");
        const hasShift = hk.includes("shift");

        let keyPart = hk
            .replace("ctrl", "")
            .replace("alt", "")
            .replace("shift", "")
            .replace("+", "")
            .trim();

        if (hasCtrl && !event.ctrlKey) return false;
        if (hasAlt && !event.altKey) return false;
        if (hasShift && !event.shiftKey) return false;

        return event.key.toLowerCase() === keyPart;
    }

    /********************************
     *  ZAMAN CACHE (KRİTİK KISIM)
     ********************************/
    let lastKnownTime = 0;

    document.addEventListener(
        "timeupdate",
        (e) => {
            if (e.target && e.target.tagName === "VIDEO") {
                const t = Math.floor(e.target.currentTime);
                if (t > 0) lastKnownTime = t;
            }
        },
        true
    );

    /********************************
     *  ANA İŞLEV
     ********************************/
    function saveTime() {
        if (lastKnownTime <= 0) return;

        const url = new URL(location.href);
        url.searchParams.set("t", `${lastKnownTime}s`);
        history.replaceState(null, "", url.toString());
    }

    /********************************
     *  KLAVYE DİNLEYİCİSİ
     ********************************/
    document.addEventListener("keydown", (e) => {
        if (!location.href.includes("watch")) return;

        if (matchesHotkey(e)) {
            e.preventDefault();
            saveTime();
        }
    });

})();
