// ==UserScript==
// @name         DartConnect – Automaické otevírání zápasů
// @namespace    http://tampermonkey.net/
// @version      11.0
// @license      MIT
// @author       LM
// @description  Otevírá pouze skutečně nové zápasy (nikdy dříve neotevřené)
// @match        https://tv.dartconnect.com/event/*/state/all*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561875/DartConnect%20%E2%80%93%20Automaick%C3%A9%20otev%C3%ADr%C3%A1n%C3%AD%20z%C3%A1pas%C5%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/561875/DartConnect%20%E2%80%93%20Automaick%C3%A9%20otev%C3%ADr%C3%A1n%C3%AD%20z%C3%A1pas%C5%AF.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log("🎯 DartConnect STATE watchdog FINAL loaded");

    const EVENT_ID = location.pathname.split("/")[2];
    const SNAP_KEY = "dartconnect_snapshot_" + EVENT_ID;
    const OPENED_KEY = "dartconnect_opened_" + EVENT_ID;

    function getJSON() {
        const pre = document.querySelector("pre");
        if (!pre) return null;
        try {
            return JSON.parse(pre.textContent);
        } catch {
            return null;
        }
    }

    function fingerprint(m) {
        return [
            m.sk || "null",
            m.hc || "",
            m.ac || "",
            m.bns || "",
            m.tmi || ""
        ].join("|");
    }

    function openLive(m, delay = 0) {
    if (!m.sk) return;

    const url = `https://tv.dartconnect.com/live/${m.sk}/M/${EVENT_ID}`;

    setTimeout(() => {
        console.log("🖱️ Middle-click open:", url);

        const a = document.createElement("a");
        a.href = url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.style.display = "none";
        document.body.appendChild(a);

        const evtDown = new MouseEvent("mousedown", {
            bubbles: true,
            cancelable: true,
            view: window,
            button: 1
        });

        const evtUp = new MouseEvent("mouseup", {
            bubbles: true,
            cancelable: true,
            view: window,
            button: 1
        });

        const evtClick = new MouseEvent("auxclick", {
            bubbles: true,
            cancelable: true,
            view: window,
            button: 1
        });

        a.dispatchEvent(evtDown);
        a.dispatchEvent(evtUp);
        a.dispatchEvent(evtClick);

        // fallback kdyby browser middle-click ignoroval
        setTimeout(() => {
            if (!a.isConnected) return;
            a.click();
        }, 50);

        setTimeout(() => a.remove(), 1000);

    }, delay);
}

    function check() {
        const json = getJSON();
        const live = json?.states?.matches_live?.data;
        if (!Array.isArray(live)) return reload();

        const SNAPSHOT = JSON.parse(localStorage.getItem(SNAP_KEY) || "[]");
        const OPENED = new Set(JSON.parse(localStorage.getItem(OPENED_KEY) || "[]"));

        const CURRENT = live.map(fingerprint);

        let openedNow = 0;
        const newlyOpened = [];

        for (let i = 0; i < live.length; i++) {
            const key = CURRENT[i];
            const m = live[i];

            const isNewOnPage = key !== SNAPSHOT[i];
            const neverOpened = !OPENED.has(key);

            if (isNewOnPage && neverOpened && m.sk) {
                openLive(m, openedNow * 700);
                openedNow++;
                newlyOpened.push(key);
            }
        }

        // uložíme nový snapshot
        localStorage.setItem(SNAP_KEY, JSON.stringify(CURRENT));

        // rozšíříme seznam otevřených
        if (newlyOpened.length) {
            const merged = new Set([...OPENED, ...newlyOpened]);
            localStorage.setItem(OPENED_KEY, JSON.stringify([...merged]));
        }

        reload();
    }

    function reload() {
        setTimeout(() => location.reload(), 30000);
    }

    setTimeout(check, 800);
})();
