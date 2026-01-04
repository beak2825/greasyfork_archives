// ==UserScript==
// @name         Add Jira Copy RTF link
// @namespace    
// @version      1.0.0
// @description  Copies the name, issue key, and url of the current issue in an easy to paste format
// @author       me
// @match        https://upshop-company.atlassian.net/browse/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549293/Add%20Jira%20Copy%20RTF%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/549293/Add%20Jira%20Copy%20RTF%20link.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var executeCount = 0;
    var autoAddInterval = setInterval(addCopyBtn, 1000);
    var copyLinkHtml = '<div id="fakebutton" class="_1o9zidpf">' +
'<div role="presentation">' +
'<button aria-expanded="false" aria-haspopup="true" type="button" class="_mizu194a _1ah31bk5 _ra3xnqa1 _128m1bk5 _1cvmnqa1 _4davt94y _19itglyw _vchhusvi _r06hglyw _80omtlke _2rkosqtm _11c82smr _v5649dqc _189eidpf _1rjc12x7 _1e0c116y _1bsbviql _p12f1osq _kqswh2mm _4cvr1q9y _1bah1h6o _gy1p1b66 _1o9zidpf _4t3iviql _k48p1wq8 _y4tize3t _bozgze3t _y3gn1h6o _s7n4nkob _14mj1kw7 _9v7aze3t _1tv3nqa1 _39yqe4h9 _11fnglyw _18postnw _bfhk1w7a _syaz1gjq _8l3mmuej _aetrb3bt _10531gjq _f8pj1gjq _30l31gjq _9h8h1gjq _irr3166n _1di61dty _4bfu18uv _1hmsglyw _ajmmnqa1 _1a3b18uv _4fprglyw _5goinqa1 _9oik18uv _1bnxglyw _jf4cnqa1 _1nrm18uv _c2waglyw _1iohnqa1" data-testid="share-button.ui.pre-share-view.button">' +
'<span class="_v564g17y _1e0c1txw _16jlidpf _1o9zidpf _1wpz1h6o _1wybidpf _vwz4idpf _uiztglyw">' +
'<span data-testid="share-button.ui.pre-share-view.share-icon" aria-hidden="true" class="_1e0c1o8l _vchhusvi _1o9zidpf _vwz4kb7n _y4ti1igz _bozg1mb9 _12va18uv _jcxd1r8n" style="color: var(--ds-icon, #44546F);">' +
'<svg width="24" height="24" viewBox="0 0 24 24" focusable="false" role="presentation">' +
'<g fill="currentColor" fill-rule="evenodd">' +
'<path d="M12.856 5.457l-.937.92a1.002 1.002 0 0 0 0 1.437 1.047 1.047 0 0 0 1.463 0l.984-.966c.967-.95 2.542-1.135 3.602-.288a2.54 2.54 0 0 1 .203 3.81l-2.903 2.852a2.646 2.646 0 0 1-3.696 0l-1.11-1.09L9 13.57l1.108 1.089c1.822 1.788 4.802 1.788 6.622 0l2.905-2.852a4.558 4.558 0 0 0-.357-6.82c-1.893-1.517-4.695-1.226-6.422.47">' +
'</path>' +
'<path d="M11.144 19.543l.937-.92a1.002 1.002 0 0 0 0-1.437 1.047 1.047 0 0 0-1.462 0l-.985.966c-.967.95-2.542 1.135-3.602.288a2.54 2.54 0 0 1-.203-3.81l2.903-2.852a2.646 2.646 0 0 1 3.696 0l1.11 1.09L15 11.43l-1.108-1.089c-1.822-1.788-4.802-1.788-6.622 0l-2.905 2.852a4.558 4.558 0 0 0 .357 6.82c1.893 1.517 4.695 1.226 6.422-.47">' +
'</path>' +
'</g>' +
'</svg>' +
'</span>' +
'<span class="_ca0qidpf _u5f3idpf _n3tdidpf _19bvidpf _19itidpf _1reo15vq _18m915vq _1bsbt94y _4t3it94y _kqswstnw _ogto7mnp _uiztglyw _o5721q9c">' +
'Share</span>' +
'</span>' +
'</button>' +
'</div>' +
'</div>';





    function addCopyBtn(){
        //simple handle
        if(executeCount++ > 10) {
            clearInterval(autoAddInterval);
        }
        if(document.getElementById('fakebutton') != null) return;
        let groupContainer = document.querySelector('#jira-issue-header-actions > div > div');
        //clone node
        let copyBtnDiv = document.createElement("div");
        copyBtnDiv.innerHTML = copyLinkHtml;
        copyBtnDiv.onclick = function(){
            let currentIssue = document.querySelectorAll('[data-testid="issue.views.issue-base.foundation.summary.heading"]')[0];
            let currentIssueText = currentIssue.innerText;
            let currentIssueKey = window.location.href.split("/").pop();
            let linkName = currentIssueKey + " - " + currentIssueText;
            let linkVal = window.location.href;
            let hrefElem = '<a href="' + linkVal + '">' + linkName + '</a>';

            const blob = new Blob([hrefElem], {type: 'text/html'});
            const clipboardItem = new ClipboardItem({
                "text/html": new Blob([hrefElem], { type: "text/html" }),
                "text/plain": new Blob([hrefElem], { type: "text/plain" })
            })
            alert("Copied to clipboard.");
			navigator.clipboard.write([clipboardItem]);
        }
        groupContainer.appendChild(copyBtnDiv);
    }
})();