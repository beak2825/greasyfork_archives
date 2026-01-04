// ==UserScript==
// @name         Ratuj-Ratatuj – Q/A Extractor
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Витягує пари Q: / A: з текстових логів на сторінці та показує їх у зручному форматі (включно з польськими й українськими літерами).
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558057/Ratuj-Ratatuj%20%E2%80%93%20QA%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/558057/Ratuj-Ratatuj%20%E2%80%93%20QA%20Extractor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Загальний маркер блоку з атрибутами (без прив'язки до конкретної системи)
    var BLOCK_MARKER = "AttributeInfo:1.0'::";

    function addButton() {
        if (!document.body) {
            setTimeout(addButton, 500);
            return;
        }
        if (document.getElementById("ratuj-ratatuj-btn")) return;

        var btn = document.createElement("div");
        btn.id = "ratuj-ratatuj-btn";
        btn.textContent = "Ratuj-Ratatuj";

        var s = btn.style;
        s.position = "fixed";
        s.bottom = "10px";
        s.right = "10px";
        s.background = "black";
        s.color = "white";
        s.padding = "8px 14px";
        s.cursor = "pointer";
        s.fontSize = "13px";
        s.fontWeight = "bold";
        s.borderRadius = "6px";
        s.zIndex = 999999;

        btn.onclick = showCleanQA;
        document.body.appendChild(btn);
    }

    function createBox() {
        var box = document.getElementById("ratuj-ratatuj-box");
        if (box) return box;

        box = document.createElement("div");
        box.id = "ratuj-ratatuj-box";

        var s = box.style;
        s.position = "fixed";
        s.top = "10px";
        s.left = "10px";
        s.width = "420px";
        s.maxHeight = "85vh";
        s.overflow = "auto";
        s.background = "white";
        s.border = "1px solid #ccc";
        s.padding = "10px";
        s.fontFamily = "Arial, sans-serif";
        s.fontSize = "13px";
        s.zIndex = 999998;
        s.whiteSpace = "pre-wrap";

        document.body.appendChild(box);
        return box;
    }

    function getPageText() {
        if (!document.body) return "";
        return document.body.innerText || "";
    }

    // Декодуємо \uXXXX → реальні символи (польська, українська тощо)
    function decodeUnicodeEscapes(str) {
        if (!str) return "";
        return str.replace(/\\u([0-9a-fA-F]{4})/g, function(match, grp) {
            return String.fromCharCode(parseInt(grp, 16));
        });
    }

    function showCleanQA() {
        var text = getPageText();
        var box = createBox();

        var qaList = [];

        // Варіант 1: є блочні маркери
        if (text.indexOf(BLOCK_MARKER) !== -1) {
            var parts = text.split(BLOCK_MARKER);
            for (var i = 1; i < parts.length; i++) {
                var block = parts[i];
                var cut = block.split("$pm_entity::")[0];

                var qMatch = cut.match(/questionString\s*:\s*\"([^"]*)\"/);
                var aMatch = cut.match(/answerString\s*:\s*\"([^"]*)\"/);
                var vMatch = cut.match(/value\s*:\s*\"([^"]*)\"/);

                var q = qMatch ? qMatch[1] : "";
                var a = aMatch ? aMatch[1] : "";

                if (!a && vMatch) {
                    a = vMatch[1];
                }

                if (!q || !a) continue;

                q = decodeUnicodeEscapes(q);
                a = decodeUnicodeEscapes(a);

                qaList.push({ q: q, a: a });
            }
        } else {
            // Варіант 2: загальний пошук по всьому тексту
            var regex = /questionString\s*:\s*\"([^"]*)\"[\s\S]{0,300}?answerString\s*:\s*\"([^"]*)\"/g;
            var m;
            while ((m = regex.exec(text)) !== null) {
                var q2 = decodeUnicodeEscapes(m[1]);
                var a2 = decodeUnicodeEscapes(m[2]);
                if (q2 && a2) {
                    qaList.push({ q: q2, a: a2 });
                }
            }
        }

        if (!qaList.length) {
            box.textContent = "";
            alert("Не знайдено жодної пари questionString / answerString у тексті сторінки.");
            return;
        }

        var lines = [];
        for (var j = 0; j < qaList.length; j++) {
            var qa = qaList[j];
            lines.push("Q: " + qa.q);
            lines.push("A: " + qa.a);
            lines.push("");
        }

        box.textContent = lines.join("\n");
    }

    addButton();
})();
