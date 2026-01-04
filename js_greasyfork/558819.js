// ==UserScript==
// @name         DiffChecker Infinite Everything!
// @namespace    https://cqmbo1.github.io
// @version      1.0
// @description  Sets localStorage counters to -Infinity for all features.
// @author       Cqmbo__
// @match        https://www.diffchecker.com/*
// @icon         https://cqmbo1.github.io/assets/cqmbo__32x32.png
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558819/DiffChecker%20Infinite%20Everything%21.user.js
// @updateURL https://update.greasyfork.org/scripts/558819/DiffChecker%20Infinite%20Everything%21.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const library = {
        merge: 10,
        realTime: 5,
        unified: 5,
        collapsed: 5,
        textDiffLevel: 10,
        excelDiffLevel: 10,
        ignoreCaseChanges: 5,
        ignoreWhiteSpace: 5,
        hideUnchangedRows: 5,
        hideUnchangedColumns: 5,
        ignoreStrings: 5,
        syntaxHighlight: 5,
        exportPdf: 5,
        exportXlsx: 5,
        exportRichTextPdf: 5,
        exportDocumentImageDiffPdf: 5,
        exportDocumentImageDiffImage: 5,
        exportImageDiffImage: 5,
        explain: 5,
        excelSortRows: 5,
        excelSortColumns: 5,
        excelNormalizeDatesUS: 5,
        excelNormalizeDatesEU: 5,
        textStats: 4
    };

    function makeKey(feature) {
        const now = new Date();
        const month = now.getMonth();
        const year = now.getFullYear();
        return `${feature}Uses-${month}-${year}`;
    }

    Object.keys(library).forEach(feature => {
        const key = makeKey(feature);
        localStorage.setItem(key, "-Infinity");
    });
})();
