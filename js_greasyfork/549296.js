// ==UserScript==
// @name         Copy Release RTF Button
// @namespace    my script
// @version      1.0.0
// @description  Copies the name and link of the release version in Azure Devops
// @author       me
// @match        https://dev.azure.com/applieddatacorp/*/_releaseProgress?*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549296/Copy%20Release%20RTF%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/549296/Copy%20Release%20RTF%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var executeCount = 0;
    var autoAddInterval = setInterval(addCopyBtn, 1000);
    var copyLinkHtml = '<div class="_1n1uewfl _nz6rewfl rtf_copy_button">' +
	'<div aria-haspopup="true">' +
		'<div role="presentation">' +
			'<button aria-label="Vote options: No one has voted for this issue yet." aria-expanded="false" class="v67syn-0 dLVCis css-13rzeaj" data-testid="issue-field-voters.ui.button.styled-button" tabindex="0" type="button">' +
				'<span class="css-178ag6o">' +
					'<span class="_1e0c1txw _4cvr1h6o">' +
						'<span class="_1e0c1txw">' +
							'<span data-vc="icon-undefined" aria-hidden="true" class="css-1afrefi" style="--icon-primary-color: currentColor; --icon-secondary-color: var(--ds-surface, #FFFFFF);">' +
								'<svg width="24" height="24" viewBox="0 0 24 24" focusable="false" role="presentation">' +
									'<g fill="currentColor" fill-rule="evenodd">' +
										'<path d="M12.856 5.457l-.937.92a1.002 1.002 0 0 0 0 1.437 1.047 1.047 0 0 0 1.463 0l.984-.966c.967-.95 2.542-1.135 3.602-.288a2.54 2.54 0 0 1 .203 3.81l-2.903 2.852a2.646 2.646 0 0 1-3.696 0l-1.11-1.09L9 13.57l1.108 1.089c1.822 1.788 4.802 1.788 6.622 0l2.905-2.852a4.558 4.558 0 0 0-.357-6.82c-1.893-1.517-4.695-1.226-6.422.47">' +
										'</path>' +
										'<path d="M11.144 19.543l.937-.92a1.002 1.002 0 0 0 0-1.437 1.047 1.047 0 0 0-1.462 0l-.985.966c-.967.95-2.542 1.135-3.602.288a2.54 2.54 0 0 1-.203-3.81l2.903-2.852a2.646 2.646 0 0 1 3.696 0l1.11 1.09L15 11.43l-1.108-1.089c-1.822-1.788-4.802-1.788-6.622 0l-2.905 2.852a4.558 4.558 0 0 0 .357 6.82c1.893 1.517 4.695 1.226 6.422-.47">' +
										'</path>' +
									'</g>' +
								'</svg>' +
							'</span>' +
						'</span>' +
						'<span data-testid="issue-field-voters.ui.icon.counter" class="_1ul9z6xq" style="--_1pcaown: 0;">' +
							'<span style="white-space: pre;">' +
							'</span>' +
						'</span>' +
					'</span>' +
				'</span>' +
			'</button>' +
		'</div>' +
	'</div>' +
'</div>';

    function addCopyBtn(){
        //simple handle
        if(executeCount++ > 1) {
            clearInterval(autoAddInterval);
        }
        if(document.querySelector('#vss_3 > div > div > div.vss-PivotBar--bar-two-line.bottom-border > div.vss-PivotBar--bar.tall > div.vss-PivotBar--right > div.ms-CommandBar.root_278ff396.vss-PivotBar--commandBar > div > div.ms-CommandBar-primaryCommands.primaryCommands_278ff396 > div:nth-child(6) > div') != null) return;
        let groupContainer = document.querySelector('#vss_3 > div > div > div.vss-PivotBar--bar-two-line.bottom-border > div.vss-PivotBar--bar.tall > div.vss-PivotBar--right > div.ms-CommandBar.root_278ff396.vss-PivotBar--commandBar > div > div.ms-CommandBar-primaryCommands.primaryCommands_278ff396');
        //clone node
        let copyBtnDiv = document.createElement("div");
        copyBtnDiv.innerHTML = copyLinkHtml;
        copyBtnDiv.onclick = function(){
            let currentReleaseNumber = document.querySelectorAll('body > div.full-size > div > div > div.project-header.flex-row.flex-noshrink > div > div.flex-row.flex-grow.region-header > div.flex-row.flex-grow.scroll-hidden.bolt-breadcrumb-with-items > div > div > div:nth-child(7) > div > a > div.bolt-breadcrumb-item-text-container')[0];
            let currentReleaseNumberText = currentReleaseNumber.innerText;
            let currentReleaseProject = document.querySelectorAll('body > div.full-size > div > div > div.project-header.flex-row.flex-noshrink > div > div.flex-row.flex-grow.region-header > div.flex-row.flex-grow.scroll-hidden.bolt-breadcrumb-with-items > div > div > div:nth-child(6) > div.bolt-breadcrumb-item > a > div.bolt-breadcrumb-item-text-container > span')[0];
            let currentReleaseProjectText = currentReleaseProject.innerText.split("-")[0];
            let linkName = currentReleaseProjectText + "/" + currentReleaseNumberText;
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