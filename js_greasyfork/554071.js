// ==UserScript==
// @name         VNDB:Re — Improved Title Page
// @namespace    Kellen's userstyles
// @version      1.0
// @description  Hybrid layout with a Hero block and two-column structure.
// @author       kln (t.me/kln_lzt)
// @homepageURL  https://github.com/Kellenok/userscipts/
// @supportURL   https://github.com/Kellenok/userscipts/issues
// @match        https://vndb.org/v*
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/554071/VNDB%3ARe%20%E2%80%94%20Improved%20Title%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/554071/VNDB%3ARe%20%E2%80%94%20Improved%20Title%20Page.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === 1. CSS ===
    GM_addStyle(`

        main > article:has(#hero-container) {
            padding: 0;
        }

        /* --- 1. HERO BLOCK --- */
        #hero-container {
            display: flex;
            align-items: flex-start;
            gap: 20px;
            margin-bottom: 1em;
            position: relative;
            overflow: hidden;
            padding: 32px;
        }
        #hero-container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 200px;
            background-size: cover;
            background-position: top;
            -webkit-mask-image: linear-gradient(0deg,rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 300%);
            mask-image: linear-gradient(0deg,rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 300%);
            filter: blur(5px);
            z-index: 1;
            transform: scale(1.2);
        }
        #hero-cover {
            width: 200px;
            flex-shrink: 0;
            display: flex;
            flex-direction: column;
            gap: 15px;
            z-index:2;
        }
        #hero-main {
            flex-grow: 1;
            min-width: 0;
            z-index:2;
        }
        #hero-title-box {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 20px;
            margin-bottom: 1em;
            z-index:2;
        }
        #hero-title-group {
            display: flex;
            flex-direction: column;
            min-width: 0;
        }
        #hero-title-group h1 {
            font-size: 3em !important;
            margin: 0 0 10px 0 !important;
            padding: 0 !important;
            line-height: 1.1;
            color: var(--alttitle);
            z-index:2;
        }
        #hero-title-group h2.alttitle {
            font-size: 1.5em !important;
            margin: 0 0 16px 0 !important;
            color: var(--grayedout);
        }

        /* RATING STYLES */
        #hero-rating-container {
            text-align: center;
            flex-shrink: 0;
        }
        #hero-rating-box {
            display: block;
            color: var(--maintext);
            border-radius: 5px;
            font-size: 2em;
            font-weight: bold;
            line-height: 1;
            min-width: 70px;
        }
        #hero-votes-count {
            display: block;
            margin-top: 0;
            font-size: 0.9em;
        }

        #hero-duration-block {
            margin-top: 24px;
            text-align: center;
        }
        .hero-duration-value {
            display: block;
            color: var(--maintext);
            font-size: 1.5em;
            font-weight: bold;
            line-height: 1.1;
        }
        .hero-duration-info {
            display: block;
            margin-top: 3px;
            font-size: 0.9em;
            color: var(--grayedout);
        }

        .vndesc h2 { display: none; }
        .vndesc p { padding: 0; margin-bottom: 0 !important; }
        #vntags span { margin-left: 0px; margin-right: 15px; }
        #hero-cover > #widget2 { width: 100%; box-sizing: border-box; }

        .vndesc {
            position: relative;
            max-height: 150px;
            overflow: hidden;
            max-width: 60%;
            transition: max-height 0.35s ease-in-out;
            margin-bottom: 0px !important;
        }
        .vndesc.expanded {
            max-height: 2000px;
        }

        .toggle-desc-btn {
            background: none;
            border: none;
            color: var(--link);
            cursor: pointer;
            padding: 4px 0;
            font-weight: bold;
            display: block;
            margin-top: 5px;
            text-align: left;
        }
        .toggle-desc-btn:hover {
            color: var(--link-hover);
        }

        #tagops {margin-top: 24px;}
        /* --- 2. TWO-COLUMN BLOCK --- */
        .column-wrapper {
            display: flex;
            align-items: flex-start;
            gap: 1em;
        }
        #new-left-column {
            width: 250px;
            flex-shrink: 0;
            display: flex;
            flex-direction: column;
        }
        #new-right-column {
            flex-grow: 1;
            min-width: 0;
            display: flex;
            flex-direction: column;
        }
        #new-right-column > article, #new-right-column > nav + article, #new-left-column > article {
          margin-bottom: 1em;
        }
        #new-votes-count {
          color: var(--grayedout);
        }
        #new-left-column table:has(.relations-header) {
          width:100%;
        }

        /* --- 3. GENERAL STYLES AND FIXES --- */
        .vndetails table tr.nostripe { display: none; }
        td[colspan="2"] details > div { padding: 5px 10px 0 10px; }
        .details-table summary {
            display: flex;
            align-items: flex-start;
            gap: 8px;
            list-style: none;
            cursor: pointer;
        }
        .details-table summary::-webkit-details-marker { display: none; }
        .details-table summary::before {
            content: '►';
            font-size: 0.8em;
            transition: transform 0.15s ease-in-out;
            transform-origin: center;
            flex-shrink: 0;
        }
        .details-table details[open] > summary::before { transform: rotate(90deg); }
        #new-left-column .relations .unofficial { display: none; }
        #new-left-column .relations input#unoffrelations:checked ~ dl .unofficial { display: block; }
        div.vnimg { margin: 0; width: 200px; }
        div.vnimg .imghover { width: 200px!important; height: auto!important; }
        div.vnimg .imghover img { width: 200px; height: auto; }
        #tagops { text-align:left; }
        div#vntags { margin:10px 0 0 0; padding:10px 0 0 0; text-align:left; }
        .relations-header {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            margin-bottom: 5px;
        }
        .relations-header .details-key { font-weight: bold; }
        .relations-header label { margin: 0; }
        .relations.linkradio dt { margin-top: 12px; }
        body > nav {z-index: 2;}
        .ivview {z-index:99;}
        td.notes textarea {resize: vertical;}
        .ulistvn table > tr > td:nth-child(1) { width: 40%; }
        .ulistvn table { width: 100%; table-layout: fixed; margin-top: 8px; }
        .ulistvn table select { width: 100%; }
        .ulistvn .vote button {width: 80%;}
    `);

    // === 2. JavaScript ===
    const mainArticle = document.querySelector('main > article:first-of-type');
    if (!mainArticle) return;

    // --- A. Collect elements ---
    const titleH1 = mainArticle.querySelector('h1');
    const altTitleH2 = mainArticle.querySelector('h2.alttitle');
    const vndetailsDiv = mainArticle.querySelector('div.vndetails');
    const voteStatsFooter = document.querySelector('.votestats .votegraph tfoot td');

    if (!titleH1 || !vndetailsDiv) return;

    const coverContainer = vndetailsDiv.querySelector('.vnimg');
    const detailsTable = vndetailsDiv.querySelector('table.stripe');
    const userOptions = detailsTable ? detailsTable.querySelector('#widget2') : null;
    const description = detailsTable ? detailsTable.querySelector('.vndesc') : null;
    const tagOps = mainArticle.querySelector('#tagops');
    const coverImage = coverContainer ? coverContainer.querySelector('img') : null;
    if (!coverContainer || !detailsTable || !userOptions || !description || !coverImage) return;

    detailsTable.classList.add('details-table');
    if (userOptions) userOptions.remove();

    // --- DATA EXTRACTION: Play Time (Run before row manipulation) ---
    let durationTimeDisplay = null;
    let lengthVotesCount = null;
    const playTimeRow = Array.from(detailsTable.querySelectorAll('tbody > tr')).find(row => {
        const keyCell = row.querySelector('td');
        return keyCell && keyCell.textContent.trim() === 'Play time';
    });
    if (playTimeRow) {
        const valueCell = playTimeRow.cells[1];
        if (valueCell) {
            let rawText = valueCell.innerHTML;
            rawText = rawText.replace(/<a[^>]*mylengthvote[^>]*>.*?<\/a>/i, '');
            rawText = rawText.replace(/<span[^>]*small[^>]*>(\d+m)<\/span>/i, '$1');
            const votesMatch = rawText.match(/from\s*<a[^>]*>(\d+)\s+votes<\/a>/i);
            if (votesMatch) { lengthVotesCount = votesMatch[1]; }
            const timeMatch = rawText.match(/(\d+h\s*\d*m)/i);
            if (timeMatch) { durationTimeDisplay = timeMatch[1].replace(/(\d+h)(\d+m)/i, '$1 $2').trim(); }
        }
    }

    // --- B. Process details table (Publisher collapsing and Play Time row manipulation) ---
    let relationsRow = null;
    Array.from(detailsTable.querySelectorAll('tbody > tr')).forEach(row => {
        const keyCell = row.querySelector('td');
        if (!keyCell) return;
        if (keyCell.textContent.trim() === 'Publishers' && keyCell.nextElementSibling && keyCell.nextElementSibling.textContent.trim().length > 100) {
            const valueCell = keyCell.nextElementSibling;
            const originalContent = valueCell.innerHTML;
            const newRow = document.createElement('tr');
            const newCell = document.createElement('td');
            newCell.colSpan = 2; newCell.style.padding = '5px 0';
            const details = document.createElement('details');
            const summary = document.createElement('summary');
            summary.textContent = 'Publishers';
            const contentDiv = document.createElement('div');
            contentDiv.innerHTML = originalContent;
            details.append(summary, contentDiv);
            newCell.appendChild(details);
            newRow.appendChild(newCell);
            row.parentNode.replaceChild(newRow, row);
        }
        if (keyCell.textContent.trim() === 'Relations') { relationsRow = row; }
    });
    if (playTimeRow) {
        const keyCell = playTimeRow.cells[0];
        const valueCell = playTimeRow.cells[1];
        if (keyCell && valueCell) {
            const voteLink = valueCell.querySelector('a.mylengthvote');
            if (voteLink) {
                voteLink.textContent = 'Vote';
                keyCell.appendChild(document.createElement('br'));
                keyCell.appendChild(voteLink);
            }
        }
    }

    // --- C. Create "Hero" block ---
    const heroContainer = document.createElement('article');
    heroContainer.id = 'hero-container';
    heroContainer.style.setProperty('--cover-bg-url', `url(${coverImage.src})`);
    GM_addStyle(`#hero-container::before { background-image: var(--cover-bg-url); }`);
    const heroCover = document.createElement('div'); heroCover.id = 'hero-cover';
    heroCover.append(coverContainer, userOptions);
    const heroMain = document.createElement('div'); heroMain.id = 'hero-main';
    const titleBox = document.createElement('div'); titleBox.id = 'hero-title-box';
    const titleGroup = document.createElement('div'); titleGroup.id = 'hero-title-group';
    titleGroup.appendChild(titleH1);
    if (altTitleH2) titleGroup.appendChild(altTitleH2);
    titleBox.append(titleGroup);
    if (voteStatsFooter) {
        const ratingContainer = document.createElement('div');
        ratingContainer.id = 'hero-rating-container';
        const ratingMatch = voteStatsFooter.textContent.match(/(\d+\.\d+) average/);
        if (ratingMatch) {
            const ratingBox = document.createElement('span');
            ratingBox.id = 'hero-rating-box';
            ratingBox.textContent = ratingMatch[1];
            ratingContainer.appendChild(ratingBox);
            const votesMatch = voteStatsFooter.textContent.match(/(\d+)\s+votes/);
            if (votesMatch) {
                const votesCountSpan = document.createElement('span');
                votesCountSpan.id = 'new-votes-count';
                votesCountSpan.textContent = `(${votesMatch[1]} votes)`;
                ratingContainer.appendChild(votesCountSpan);
            }
            if (durationTimeDisplay) {
                const durationBlock = document.createElement('div');
                durationBlock.id = 'hero-duration-block';
                const durationValueSpan = document.createElement('span');
                durationValueSpan.className = 'hero-duration-value';
                durationValueSpan.textContent = durationTimeDisplay;
                const durationInfoSpan = document.createElement('span');
                durationInfoSpan.className = 'hero-duration-info';
                durationInfoSpan.textContent = `(${lengthVotesCount || 0} votes)`;
                durationBlock.append(durationValueSpan, durationInfoSpan);
                ratingContainer.appendChild(durationBlock);
            }
            titleBox.appendChild(ratingContainer);
        }
    }

    // --- D. Create column wrapper ---
    const columnWrapper = document.createElement('div');
    columnWrapper.className = 'column-wrapper';

    // --- E. Left column (Details and Relations) ---
    const newLeftColumn = document.createElement('div');
    newLeftColumn.id = 'new-left-column';
    const detailsArticle = document.createElement('article');
    if (relationsRow) relationsRow.remove();
    detailsArticle.appendChild(detailsTable);
    newLeftColumn.appendChild(detailsArticle);
    if (relationsRow) {
        const keyCell = relationsRow.cells[0];
        const valueCell = relationsRow.cells[1];
        if (keyCell && valueCell) {
            keyCell.className = valueCell.className;
            const unofficialInput = valueCell.querySelector('input#unoffrelations');
            const unofficialLabel = valueCell.querySelector('label[for="unoffrelations"]');
            const relationsDL = valueCell.querySelector('dl');
            const headerDiv = document.createElement('div'); headerDiv.className = 'relations-header';
            const titleDiv = document.createElement('div'); titleDiv.className = 'details-key';
            titleDiv.textContent = keyCell.textContent.trim();
            headerDiv.appendChild(titleDiv);
            if (unofficialLabel) { headerDiv.appendChild(unofficialLabel); }
            keyCell.textContent = '';
            keyCell.appendChild(headerDiv);
            if (unofficialInput) { keyCell.appendChild(unofficialInput); }
            if (relationsDL) { keyCell.appendChild(relationsDL); }
            keyCell.colSpan = 2;
            valueCell.remove();
        }
        const relationsArticle = document.createElement('article');
        const relationsTable = document.createElement('table'); relationsTable.className = 'stripe';
        const relationsTbody = document.createElement('tbody');
        relationsTbody.appendChild(relationsRow);
        relationsTable.appendChild(relationsTbody);
        relationsArticle.appendChild(relationsTable);
        newLeftColumn.appendChild(relationsArticle);
    }

    // --- F. Right column (Remaining content) ---
    const newRightColumn = document.createElement('div');
    newRightColumn.id = 'new-right-column';
    const remainingBlocks = mainArticle.parentElement.querySelectorAll('main > *');
    remainingBlocks.forEach(block => {
        if (block !== mainArticle) { newRightColumn.appendChild(block); }
    });

    // --- G. Final assembly ---
    if (description) {
        titleGroup.append(description);
    }
    heroMain.append(titleBox);
    if (tagOps) {
        heroMain.append(tagOps);
    }
    heroContainer.append(heroCover, heroMain);
    columnWrapper.append(newLeftColumn, newRightColumn);

    const parentContainer = mainArticle.parentElement;
    mainArticle.remove();
    parentContainer.append(heroContainer, columnWrapper);


    if (description) {
        const maxHeight = 150;
        if (description.scrollHeight > maxHeight) {
            const toggleBtn = document.createElement('button');
            toggleBtn.className = 'toggle-desc-btn';
            toggleBtn.textContent = 'Read more...';
            description.after(toggleBtn);
            toggleBtn.addEventListener('click', () => {
                description.classList.toggle('expanded');
                toggleBtn.textContent = description.classList.contains('expanded') ? 'Show less' : 'Read more...';
            });
        }
    }

})();
