// ==UserScript==
// @name         UNPAM Auto Isi Kuesioner (Smart Random)
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  Auto isi kuesioner UNPAM (Quasar q-radio, auto-detect skala, random variatif)
// @match        https://my.unpam.ac.id/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/561797/UNPAM%20Auto%20Isi%20Kuesioner%20%28Smart%20Random%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561797/UNPAM%20Auto%20Isi%20Kuesioner%20%28Smart%20Random%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // =========================
    // RANDOM LOGIC PER SKALA
    // =========================
    function randomByScale(labels) {

        // Skala Frekuensi
        if (labels.includes("Selalu")) {
            const r = Math.random();
            if (r < 0.7) return "Selalu";           // 70%
            if (r < 0.9) return "Sering";           // 20%
            if (r < 0.98) return "Kadang-kadang";   // 8%
            return "Tidak Pernah";                  // 2%
        }

        // Skala Kemampuan
        if (labels.includes("Sangat Mampu")) {
            const r = Math.random();
            if (r < 0.7) return "Sangat Mampu";     // 70%
            if (r < 0.9) return "Mampu";            // 20%
            if (r < 0.98) return "Kurang Mampu";    // 8%
            return "Tidak Mampu";                   // 2%
        }

        // Fallback (kalau ada skala aneh)
        return labels[labels.length - 1];
    }

    // =========================
    // ISI KUESIONER
    // =========================
    function isi(doc) {
        const radios = doc.querySelectorAll('div[role="radio"][aria-label]');
        if (!radios.length) return;

        const groups = new Map();

        radios.forEach(r => {
            const parent = r.closest('[role="radiogroup"]');
            if (!parent) return;
            if (!groups.has(parent)) groups.set(parent, []);
            groups.get(parent).push(r);
        });

        groups.forEach(group => {
            const labels = group.map(r => r.getAttribute("aria-label"));
            const jawaban = randomByScale(labels);

            const target = group.find(r =>
                r.getAttribute("aria-label") === jawaban
            );

            if (target && target.getAttribute("aria-checked") !== "true") {
                // delay kecil biar keliatan manusia
                setTimeout(() => target.click(), Math.random() * 400);
            }
        });

        console.log("✅ UNPAM kuesioner terisi (smart random)");
    }

    // =========================
    // SCAN HALAMAN + IFRAME
    // =========================
    function scanAll() {
        isi(document);

        document.querySelectorAll("iframe").forEach(f => {
            try {
                if (f.contentDocument) isi(f.contentDocument);
            } catch (e) {}
        });
    }

    // =========================
    // OBSERVER (POPUP DINAMIS)
    // =========================
    const observer = new MutationObserver(scanAll);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // fallback awal
    setTimeout(scanAll, 2000);

})();
