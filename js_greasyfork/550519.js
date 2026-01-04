// ==UserScript==
// @name         Phabricator Auto Fill Summary/Test Plan
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动填充 Summary 和 Test Plan
// @match        https://code.yangqianguan.com/differential/revision/attach/*
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/550519/Phabricator%20Auto%20Fill%20SummaryTest%20Plan.user.js
// @updateURL https://update.greasyfork.org/scripts/550519/Phabricator%20Auto%20Fill%20SummaryTest%20Plan.meta.js
// ==/UserScript==
(function() {
    'use strict';

    const commitMessageURL = "http://127.0.0.1:8899/commit_message";

    GM_xmlhttpRequest({
        method: "GET",
        url: commitMessageURL,
        onload: function(response) {
            const commitMsg = response.responseText;
const lines = commitMsg.split('\n');
        const titleLine = lines[0].trim();
        const titleField = document.querySelector('input[name="title"]');
        if (titleField) titleField.value = titleLine;

        const summaryMatch = commitMsg.match(/Summary:\s*([\s\S]*?)\nTest Plan:/);
            const testPlanMatch = commitMsg.match(/Test Plan:\s*([\s\S]*?)(?:\n[A-Z][a-z]+:|$)/);

            if(summaryMatch) {
                const summaryField = document.querySelector('textarea[name="summary"]');
                if(summaryField) summaryField.value = summaryMatch[1].trim();
            }

            if(testPlanMatch) {
                const testPlanField = document.querySelector('textarea[name="testPlan"]');
                if(testPlanField) testPlanField.value = testPlanMatch[1].trim();
            }
        }
    });
})();