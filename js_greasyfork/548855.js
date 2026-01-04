// ==UserScript==
// @name         うりぼーネット 拡張機能 専門GP/GPA計算
// @namespace    http://tampermonkey.net/
// @version      2025-09-08
// @description  tmp
// @author       You
// @match        https://kym22-web.ofc.kobe-u.ac.jp/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548855/%E3%81%86%E3%82%8A%E3%81%BC%E3%83%BC%E3%83%8D%E3%83%83%E3%83%88%20%E6%8B%A1%E5%BC%B5%E6%A9%9F%E8%83%BD%20%E5%B0%82%E9%96%80GPGPA%E8%A8%88%E7%AE%97.user.js
// @updateURL https://update.greasyfork.org/scripts/548855/%E3%81%86%E3%82%8A%E3%81%BC%E3%83%BC%E3%83%8D%E3%83%83%E3%83%88%20%E6%8B%A1%E5%BC%B5%E6%A9%9F%E8%83%BD%20%E5%B0%82%E9%96%80GPGPA%E8%A8%88%E7%AE%97.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const calc = () => {
        try {
            const table = document.getElementById("auto-table-4");
            const majors = [...table.rows].filter(row => row.children[1].textContent === "専門科目");
            const num = majors.map(major => Number(major.children[7].textContent)).reduce((a, b) => a + b);
            const gp = majors.map(major => Number(major.children[11].textContent)).reduce((a, b) => a + b);
            const gpa = gp / num;
            alert(`
                専門科目数：${num}
                専門ＧＰ：　${gp.toFixed(1)}
                専門ＧＰＡ：${gpa.toFixed(2)}
            `);
        } catch (e) {
            alert(e);
        }
    };

    window.onload = () => {
        const header = document.getElementById("page-header");
        console.log(header.textContent);
        if (!header.textContent.includes("単位修得状況照会")) {
            return;
        }
        const button = document.createElement("button");
        button.textContent = "専門GP/GPAを計算する";
        button.style.position = "fixed";
        button.style.top = "20px";
        button.style.right = "20px";
        button.style.zIndex = "9999";
        button.onclick = calc;
        document.body.appendChild(button);
    };
})();
