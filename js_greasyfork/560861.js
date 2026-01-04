// ==UserScript==
// @name         🔄️ Character Switcher Reorder
// @namespace    chk.pop.locale.autouse.combo
// @version      2.2
// @description  Reorder character switcher dropdown into custom groups by name across the whole game; waits until populated; adds separators only if needed; avoids layout flicker
// @match        https://*.popmundo.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560861/%F0%9F%94%84%EF%B8%8F%20Character%20Switcher%20Reorder.user.js
// @updateURL https://update.greasyfork.org/scripts/560861/%F0%9F%94%84%EF%B8%8F%20Character%20Switcher%20Reorder.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const GROUPS = [
        { label: "— main —", names: ["Kitty Buttercup 么", "Keiji クーナ", "Miyu Ouchi", "Ken'ichi Yasui"] },
        { label: "— riize —", names: ["Park Wonbin", "Lee Sohee", "Osaki Shotaro", "Song Eunseok", "Anton Lee", "Jung Sungchan"] },
        { label: "— cortis —", names: ["Martin Edwards", "Keonho Ahn", "James Yufan", "Juhoon Kim"] },
        { label: "— heist —", names: ["Kia Rivera", "Rei Xie", "Tomie Ito 富江", "Kai Kuno", "Juan Guanare", 'Eva Lavender'] },
        { label: "— advanture —", names: ["Koko Koharu", "Ruby Ross", "Nova Xie", "Toi Kuno", "Yuji Iwakura", "Ryu Iwakura", "Yuta Kuno", "XiAn Kuno"] },
        { label: "— pps —", names: ["Ion Grecescu", "Ren Kuno", "Jun Kuno"] },
        { label: "— sugarcubes —", names: ["Yuki Ouchi", "Oko Ouchi", "Olesya Ouchi", "June Ouchi", "Moona Ouchi"] },
        { label: "— sit with us —", names: ["Kiyo Ouchi", "Loli Ouchi", "Ryuichi Ouchi"] },
        { label: "— abyss —", names: ["Hira Ouchi", "Riku Ouchi", "Nada Ouchi", "Rain Ouchi", "Yuji Ouchi"] },
        { label: "— random —", names: ["Nia Ouchi", "Bae Ouchi"] },
    ];

    const ALWAYS_LAST_TEXT = "Go to character selection page";
    const SELECTOR = "select[id*='ucCharacterBar_ddlCurrentCharacter'], select[name*='ucCharacterBar$ddlCurrentCharacter']";

    function makeSeparator(label) {
        const sep = document.createElement("option");
        sep.textContent = label;
        sep.disabled = true;
        sep.style.fontStyle = "italic";
        sep.style.color = "#666";
        return sep;
    }

    function reorder(select) {
        if (!select) return false;

        const opts = Array.from(select.options);
        if (opts.length <= 1) return false;

        const currentValue = select.value;
        const mapByName = new Map(opts.map(o => [o.textContent.trim(), o]));
        const fragment = document.createDocumentFragment();

        GROUPS.forEach(group => {
            const present = group.names.filter(name =>
                Array.from(mapByName.keys()).some(optName => optName.startsWith(name))
            );
            if (present.length > 0) {
                fragment.appendChild(makeSeparator(group.label));
                present.forEach(name => {
                    const opt = opts.find(o => o.textContent.trim().startsWith(name));
                    if (opt) fragment.appendChild(opt);
                });
            }
        });

        const otherOpt = opts.find(o => o.textContent.trim() === ALWAYS_LAST_TEXT);
        if (otherOpt) {
            fragment.appendChild(makeSeparator("— other —"));
            fragment.appendChild(otherOpt);
        }

        opts.forEach(o => {
            if (
                !GROUPS.some(g => g.names.some(name => o.textContent.trim().startsWith(name))) &&
                o.textContent.trim() !== ALWAYS_LAST_TEXT &&
                !o.disabled
            ) {
                fragment.appendChild(o);
            }
        });

        select.style.visibility = "hidden";
        select.innerHTML = "";
        select.appendChild(fragment);
        select.style.visibility = "visible";

        if (select.querySelector(`option[value="${currentValue}"]`)) {
            select.value = currentValue;
        }

        return true;
    }

    function tryReorderOnce() {
        const select = document.querySelector(SELECTOR);
        if (!select) return false;
        return reorder(select);
    }

    function init() {
        const select = document.querySelector(SELECTOR);
        if (!select) {
            let tries = 0;
            const poll = setInterval(() => {
                if (tryReorderOnce()) clearInterval(poll);
                else if (++tries > 40) clearInterval(poll);
            }, 200);
            return;
        }

        let reorderTimeout;
        const observer = new MutationObserver(() => {
            clearTimeout(reorderTimeout);
            reorderTimeout = setTimeout(() => {
                if (reorder(select)) observer.disconnect();
            }, 100);
        });
        observer.observe(select, { childList: true });

        reorder(select);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
