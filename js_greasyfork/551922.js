// ==UserScript==
// @name         WaniKani Review Summary Unauthorized Fork
// @namespace    rwesterhof
// @version      0.10.3
// @description  Fork of rwesterhof's script which adds a review summary tile to the dashboard
// @include      /^https:\/\/(www|preview)\.wanikani\.com(\/(#)?dashboard)?(\/)?$/
// @match        https://preview.wanikani.com/subjects/review*
// @match        https://www.wanikani.com/subjects/review*
// @require      https://greasyfork.org/scripts/410909-wanikani-review-cache/code/Wanikani:%20Review%20Cache.js?version=1183366
// @run-at       document-end
// @grant        none
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/551922/WaniKani%20Review%20Summary%20Unauthorized%20Fork.user.js
// @updateURL https://update.greasyfork.org/scripts/551922/WaniKani%20Review%20Summary%20Unauthorized%20Fork.meta.js
// ==/UserScript==

;(function() {
    'use strict';
    /* global wkof, review_cache */

    var SCRIPT_ID = 'wk_reviewSummary';
    var msInDay = 24 * 60 * 60 * 1000; // milliseconds in day

    /*-------------------------------------------------------------------------------------------------------------------------------*/

   // Temporary measure to allow the review cache script to load on the review page to track reviews while the /reviews endpoint is unavailable
   if (/^https:\/\/(www|preview)\.wanikani\.com(\/(#)?dashboard)?(\/)?$/.test(window.location.href)) {

       // Make sure WKOF is installed
       if (!window.wkof) {
           let response = confirm('WaniKani Review Summary requires WaniKani Open Framework.\n Click "OK" to be forwarded to installation instructions.');

           if (response) {
               window.location.href = 'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
           }

           return;
       }

    /*-------------------------------------------------------------------------------------------------------------------------------*/

       wkof.include('Menu,Settings,ItemData');
       wkof.ready('Menu,Settings')
           .then(load_settings)
           .then(install_menu)
           .then(add_css)
           .then(createPanel)
           .then(wkof.ready('ItemData').then(fetch_and_update));
   }
    /*-------------------------------------------------------------------------------------------------------------------------------*/

    var CACHE_VERSION = '0.2';
    var RS_CACHE_KEY = 'wk_rs_cache';
    var LS_CACHE_KEY = 'wk_ls_cache'; // future expandable to lesson summary
    function retrieveFromCache(cacheKey) {
        var cached_json = localStorage.getItem(cacheKey);
        if (cached_json) {
            var cached = JSON.parse(cached_json);
            if (cached.version == CACHE_VERSION) {
                return cached;
            }
        }
        return;
    }

    function storeInCache(cacheKey, itemBreakdown) {
        // cache the results for next page load
        var json = { version: CACHE_VERSION, itemBreakdown: itemBreakdown, currentTs: new Date().getTime() };
        localStorage.setItem(cacheKey, JSON.stringify(json));
    }

    /*-------------------------------------------------------------------------------------------------------------------------------*/

    const STAGE_DIVS = [ '', 'Apprentice I', 'Apprentice II', 'Apprentice III', 'Apprentice IV', 'Apprentice',
                             'Guru I', 'Guru II', 'Guru',
                             'Master', 'Enlightened', 'Burned'
                       ];
    function createPanel() {
        let rowIndex = wkof.settings.wk_reviewSummary.widgetRow - 1;
        let columnIndex = wkof.settings.wk_reviewSummary.widgetColumn - 1;

        let dashboardContent = document.querySelector('.dashboard__content');
        let rows = dashboardContent.querySelectorAll('.dashboard__row');
        let row = rowIndex < rows.length ? rows[rowIndex] : rows[rows.length - 1];

        let columns = row.querySelectorAll('.dashboard__widget');
        let reviewSummaryDiv = columnIndex < columns.length ? columns[columnIndex] : columns[columns.length - 1];

        // first the access tile with the percentage
        var reviewSummaryTile = document.createElement("div");
        reviewSummaryTile.id="reviewSummaryTile";
        reviewSummaryTile.innerHTML =
            "<span id='rs_tile_span_header'>Review Summary</span><p></p>"
          + "<a id='rs_tile_windowlink' title='Open review summary' onclick='wk_rs_displayReviewSummary();'><span id='rs_tile_span_percentage'></span></a>"
          + "<a id='rs_tile_percentageToggle' title='Show/Hide percentage' onclick='wk_rs_togglePercentage(0);'>"
          + "<svg id='rs_tile_icon_percentage_down' class='wk-icon wk-icon--chevron-down hidden' viewBox='0 0 512 512' aria-hidden='true' style='color:var(--color-character-text);'><use href='#wk-icon__chevron-down'></use></svg>"
          + "<svg id='rs_tile_icon_percentage_up' class='wk-icon wk-icon--chevron-up hidden' viewBox='0 0 512 512' aria-hidden='true' style='color:var(--color-character-text);'><use href='#wk-icon__chevron-up'></use></svg>"
          + "</a>";
        reviewSummaryDiv.append(reviewSummaryTile);

        // then the detail window
        var reviewSummaryWindow = document.createElement("div");
        reviewSummaryWindow.id="reviewSummaryWindow";
        reviewSummaryWindow.classList.add("reviewSummaryWindow");
        reviewSummaryWindow.classList.add("hidden");
        reviewSummaryWindow.setAttribute("onclick", "wk_rs_fireClickEvent();");
        reviewSummaryWindow.innerHTML =
            "<span id='rs_window_span_header'>Review Summary Details</span>"
          + "<button id='rs_window_button_close' onclick='wk_rs_hideReviewSummary();' title='Close window' class='rs_iconButton'>"
          + "<svg class='wk-icon wk-icon--cross' viewBox='0 0 384 512' aria-hidden='true'><use href='#wk-icon__cross'></use></svg>"
          + "</button><p></p>"
          + "<span id='rs_window_span_percentage'></span>"
          + "<div id='rs_window_div_tablist' class='rs_window_tablist'>"
            + "<button id='rs_window_button_tab_all' class='rs_window_button_tab' onclick='wk_rs_showTab([true, true]);'>All</button>"
            + "<button id='rs_window_button_tab_incorrect' class='rs_window_button_tab' onclick='wk_rs_showTab([true, false]);'>Incorrect</button>"
            + "<button id='rs_window_button_tab_correct' class='rs_window_button_tab' onclick='wk_rs_showTab([false, true]);'>Correct</button>"
          + "</div>";
        reviewSummaryDiv.append(reviewSummaryWindow);
        var reviewSummaryDivIncorrect = document.createElement("div");
        reviewSummaryDivIncorrect.id=('rs_window_div_correct_0');
        reviewSummaryDivIncorrect.classList.add('rs_window_div_items');
        reviewSummaryDivIncorrect.innerHTML = "<span id='rs_window_span_count_incorrect'></span>";
        reviewSummaryWindow.append(reviewSummaryDivIncorrect);
        var reviewSummaryDivCorrect = document.createElement("div");
        reviewSummaryDivCorrect.id=('rs_window_div_correct_1');
        reviewSummaryDivCorrect.classList.add('rs_window_div_items');
        reviewSummaryDivCorrect.innerHTML = "<span id='rs_window_span_count_correct'></span>";
        reviewSummaryWindow.append(reviewSummaryDivCorrect);

        for (var stage = 1; stage < STAGE_DIVS.length; stage++) {
            var stageDiv = document.createElement("div");
            stageDiv.id=('rs_window_div_correct_0_' + stage);
            stageDiv.classList.add('rs_window_div_items_stage');
            stageDiv.innerHTML = "<span class='rs_window_div_items_stage_span'>" + STAGE_DIVS[stage]  + "</span>";
            reviewSummaryDivIncorrect.append(stageDiv);

            stageDiv = document.createElement("div");
            stageDiv.id=('rs_window_div_correct_1_' + stage);
            stageDiv.classList.add('rs_window_div_items_stage');
            stageDiv.innerHTML = "<span class='rs_window_div_items_stage_span'>" + STAGE_DIVS[stage]  + "</span>";
            reviewSummaryDivCorrect.append(stageDiv);
        }
    }

    function applyVisibility(setting, panel) {
        if (setting) {
            panel.classList.remove('hidden');
        }
        else {
            panel.classList.add('hidden');
        }
    }
    window.wk_rs_displayReviewSummary=function() {
        applyVisibility(true, document.getElementById("reviewSummaryWindow"));
        var computedWidth = getComputedStyle(document.getElementById("reviewSummaryWindow")).width;
        var nrOfCells = 25;
        if (computedWidth.endsWith('px')) {
            nrOfCells = Math.floor((computedWidth.slice(0, -2) - 24) / 28);
        }
        else if(computedWidth.endsWith('em')) {
            // best effort guess
            nrOfCells = Math.floor(((parseFloat(computedWidth.slice(0.-2)) * 16) - 24) / 28);
        }
        // else stick with default
        [...document.querySelectorAll(".rs_window_div_items_stage_span")].forEach(span => { span.style["grid-column"]="1 / span " + nrOfCells });
    }
    window.wk_rs_hideReviewSummary=function() { applyVisibility(false, document.getElementById("reviewSummaryWindow")); }
    window.wk_rs_displayDetails=function(div) { applyVisibility(true, div); listenForClicks(div); }

    const DIV_ARRAY = [ 'incorrect', 'correct', 'all' ];
    function showTab(divArray) {
        var buttonClicked = 0;
        for (var index = 0; index < divArray.length; index++) {
            applyVisibility(divArray[index], document.getElementById("rs_window_div_correct_" + index));
            if (divArray[index]) { buttonClicked += (index+1); }
        }
        for (var i = 0; i < DIV_ARRAY.length; i++) {
            document.getElementById('rs_window_button_tab_' + DIV_ARRAY[i]).classList.remove("active");
        }
        document.getElementById('rs_window_button_tab_' + DIV_ARRAY[buttonClicked-1]).classList.add("active");
    }
    window.wk_rs_showTab=showTab;

    function togglePercentage(mode) {
        // mode can be 0 or 1 or it can be true or false, which we convert to 0 (false) and 1 (true) by forcing int conversion via calculations
        var chevrons = [ document.getElementById('rs_tile_icon_percentage_down'),
                         document.getElementById('rs_tile_icon_percentage_up') ];
        // remove all hiddens (prevent duplicate hidden classes)
        applyVisibility(1, chevrons[0]);
        applyVisibility(1, chevrons[1]);
        // hide the one we don't need
        applyVisibility(0, chevrons[((1-mode))]);
        document.getElementById('rs_tile_percentageToggle').onclick=function() { wk_rs_togglePercentage(((1-mode))); };
        applyVisibility(((0+mode)), document.getElementById('rs_tile_span_percentage'));
    }
    window.wk_rs_togglePercentage= togglePercentage;

    function fireClickEvent() {
        // fires a custom event to signal cockpit loaded
        const event = document.createEvent('Event');
        event.initEvent("review-summary-clicked", true, true);
        document.getElementById("reviewSummaryWindow").dispatchEvent(event);
    }
    window.wk_rs_fireClickEvent=fireClickEvent;

    function listenForClicks(div) {
        document.getElementById("reviewSummaryWindow").addEventListener('review-summary-clicked', { div: div, handleEvent:function(event) { closeOnClick(event, div) } }, { once: true });
    }

    // eventlistener that moves the graph button to the heatmap once it is loaded
    function closeOnClick(event, div) {
        applyVisibility(false, div);
    }

    /*-------------------------------------------------------------------------------------------------------------------------------*/

    async function fetch_and_update() {
        var cached = retrieveFromCache(RS_CACHE_KEY);
        console.log("Found " + (cached ? cached.itemBreakdown.counts[2] : 0) + " reviews in cache");
        var startAtTs = null;
        if (cached) {
            startAtTs = cached.currentTs;
        }
        // if no cache available, default to 24 hours
        else {
            startAtTs = new Date().getTime() - msInDay;
        }
        var data = await Promise.all([review_cache.get_reviews()]);
        var filteredReviews = data[0].filter(item => item[0] > startAtTs);
        var totalReviewCount = filteredReviews.length;
        console.log("Found " + totalReviewCount + " new reviews since " + startAtTs);
        if (totalReviewCount > 0) {
            // we have reviews since last page load!
            var errorReviews = filteredReviews.filter(item => (item[3]+item[4])>0);
            var errorReviewCount = errorReviews.length;
            var correctReviewCount = totalReviewCount - errorReviewCount;
            var itemBreakdown = { filteredReviews: filteredReviews, percentage: (100 * correctReviewCount / totalReviewCount).toFixed(0) + '%', counts: [ errorReviewCount, correctReviewCount, totalReviewCount ] };
            storeInCache(RS_CACHE_KEY, itemBreakdown);
            togglePercentage((wkof.settings.wk_reviewSummary.showReviewPercentage > '0'));
            display(itemBreakdown);
        }
        else {
            // no reviews since last load, use cached summary
            if (cached) {
                document.getElementById('rs_tile_span_percentage').innerHTML=cached.itemBreakdown.percentage;
                togglePercentage((wkof.settings.wk_reviewSummary.showReviewPercentage == '2'));
                display(cached.itemBreakdown);
            }
            else {
                console.log("No review summary to display");
            }
        }

        // and show
        applyVisibility(true, document.getElementById('reviewSummaryTile'));
    }

    const OBJECT_TYPE_ORDER = { 'radical': 1, 'kanji': 2, 'vocabulary': 3, 'kana_vocabulary': 3 };
    async function display(itemBreakdown) {
        document.getElementById('rs_tile_span_percentage').innerHTML=itemBreakdown.percentage;
        document.getElementById('rs_window_span_percentage').innerHTML=itemBreakdown.percentage;
        document.getElementById('rs_window_span_count_incorrect').innerHTML="Incorrect " + itemBreakdown.counts[0] + "/" + itemBreakdown.counts[2];
        document.getElementById('rs_window_span_count_correct').innerHTML="Correct " + itemBreakdown.counts[1] + "/" + itemBreakdown.counts[2];

        var reviewIds = itemBreakdown.filteredReviews.map(review => review[1]);
        var itemList = await wkof.ItemData.get_index(await wkof.ItemData.get_items('include_hidden'), 'subject_id');
        var svgs = await getSvgs(reviewIds, itemList);

        let nextStage = (review) => {
                let stageAfter = review[2] + (review[3] + review[4] == 0) - Math.ceil((review[3] + review[4]) / 2) * (review[2] < 5 ? 1 : 2);
                return stageAfter < 1 ? 1 : stageAfter;
            }

        var displayItems = itemBreakdown.filteredReviews.map(review =>
            { return { id: review[1],
                       type: itemList[review[1]].object,
                       level: itemList[review[1]].data.level,
                       stage: nextStage(review),
                       correct: (review[3]+review[4]==0),
                       display: getDisplay(review[1], itemList, svgs)
                     }
            });

        displayItems.sort((a, b) => {
            // level before type
            if (wkof.settings.wk_reviewSummary.itemSort == '0') {
                if (a.level != b.level) {
                    return 10000000 * (a.level - b.level);
                }
            }
            if (a.type != b.type) {
               return 1000000 * (OBJECT_TYPE_ORDER[a.type] - OBJECT_TYPE_ORDER[b.type]);
            }
            // level after type
            if (wkof.settings.wk_reviewSummary.itemSort == '1') {
                if (a.level != b.level) {
                    return 10000 * (a.level - b.level);
                }
            }
            return (a.id - b.id);
        });

        // clear previous display
       [...document.querySelectorAll('.rs_window_div_items_stage .rs_item_div')].forEach(node => node.remove());
       [...document.querySelectorAll('.rs_window_div_items_stage')].forEach(div => { div.style.display = 'grid' });

        // incorrect/correct split according to STAGE_DIVS (app1-4, App combined (5), Gur1-2, Gur combined (8), Mas,Enl,Bur)
        for(var answer = 0; answer <= 1; answer++) {
            const useAnswer = answer;
            var answerSplit = displayItems.filter(item => (item.correct == useAnswer));
            for (var stage = 1; stage <= 9; stage++) {
                const useStage = stage;
                var targetList = answerSplit.filter(item => item.stage == useStage);
                if (targetList.length > 0) console.log("Processing " + targetList.length + " for stage " + useStage);
                const targetDiv = document.getElementById('rs_window_div_correct_' + answer + '_' + (stage + Math.floor(stage/5) + Math.floor(stage/7)));
                if ((targetList.length == 0) || (!wkof.settings.wk_reviewSummary.detailStages && (stage < 7))) {
                    targetDiv.style.display='none';
                }
                else {
                    var stageSpan = targetDiv.querySelector(".rs_window_div_items_stage_span");
                    stageSpan.textContent = STAGE_DIVS[(stage + Math.floor(stage/5) + Math.floor(stage/7))] + ' (' + targetList.length + ')';
                    targetList.forEach(item => targetDiv.append(item.display));
                }
            }
            if (!wkof.settings.wk_reviewSummary.detailStages) {
                for (var combinedStage = 5; combinedStage <= 8; combinedStage += 3) {
                    const useCombinedStage = combinedStage;
                    targetList = answerSplit.filter(item => (Math.floor(item.stage/7) + 3*Math.floor(item.stage/5) + 5) == useCombinedStage);
                    const targetDiv = document.getElementById('rs_window_div_correct_' + answer + '_' + combinedStage);
                    if (targetList.length == 0) {
                        targetDiv.style.display='none';
                    }
                    else {
                        console.log("Processing " + targetList.length + " for stage " + useCombinedStage);
                        stageSpan = targetDiv.querySelector(".rs_window_div_items_stage_span");
                        stageSpan.textContent = STAGE_DIVS[combinedStage] + ' (' + targetList.length + ')';
                        targetList.forEach(item => targetDiv.append(item.display));
                    }
                }
            }
            else {
                for (combinedStage = 5; combinedStage <= 8; combinedStage += 3) {
                    const targetDiv = document.getElementById('rs_window_div_correct_' + answer + '_' + combinedStage);
                    targetDiv.style.display='none';
                }
            }
        }

        if (itemBreakdown.counts[0] == 0) {
            applyVisibility(false, document.getElementById('rs_window_button_tab_all'));
            applyVisibility(false, document.getElementById('rs_window_button_tab_incorrect'));
            showTab([false, true]);
        }
        else if (itemBreakdown.counts[1] == 0) {
            applyVisibility(false, document.getElementById('rs_window_button_tab_all'));
            applyVisibility(false, document.getElementById('rs_window_button_tab_correct'));
            showTab([true, false]);
        }
        else {
            showTab([wkof.settings.wk_reviewSummary.initialDisplay < 2, wkof.settings.wk_reviewSummary.initialDisplay != 1]);
        }
    }

    const SUBJECT_TYPE_MAP = { 'radical': 'radical', 'kanji': 'kanji', 'vocabulary': 'vocabulary', 'kana_vocabulary': 'vocabulary' };
    function getDisplay(reviewId, itemList, svgs) {
        let item = itemList[reviewId];
        var itemSize = (item.data.characters ? item.data.characters.length : 1);

        var itemImgLink = document.createElement("div");
        itemImgLink.classList.add("rs_item_div");
        itemImgLink.style["grid-column"]="span " + ((itemSize+1));

        var itemDetailDiv = document.createElement("div");
        itemDetailDiv.id="rs_item_window_" + reviewId;
        itemDetailDiv.classList.add("rs_item_window");
        itemDetailDiv.classList.add("hidden");

        var itemDetailTable = document.createElement("table");
        itemDetailTable.classList.add("rs_item_table");

        var itemDetailRow = document.createElement("tr");
        var itemDetailCell = document.createElement("td");
        itemDetailCell.setAttribute("colspan", "2");
        var itemDetailImg = document.createElement("a");
        itemDetailImg.classList.add("rs_item_table_character");
        itemDetailImg.setAttribute("href", item.data.document_url);
        itemDetailImg.setAttribute("target", "_blank");
        var itemDetailSpan = document.createElement("span");
        itemDetailSpan.classList.add("character-item--" + SUBJECT_TYPE_MAP[item.object]);
        itemDetailSpan.append(item.data.characters || svgs[reviewId].cloneNode(true));
        itemDetailImg.append(itemDetailSpan);
        itemDetailCell.append(itemDetailImg);
        itemDetailRow.append(itemDetailCell);
        itemDetailTable.append(itemDetailRow);

        itemDetailRow = document.createElement("tr");
        itemDetailCell = document.createElement("th");
        itemDetailCell.append('Meanings');
        itemDetailRow.append(itemDetailCell);
        itemDetailCell = document.createElement("td");
        itemDetailCell.append(item.data.meanings.map((i) => i.meaning).join(', '));
        itemDetailRow.append(itemDetailCell);
        itemDetailTable.append(itemDetailRow);

        itemDetailRow = document.createElement("tr");
        itemDetailCell = document.createElement("th");
        itemDetailCell.append('Readings');
        itemDetailRow.append(itemDetailCell);
        itemDetailCell = document.createElement("td");
        itemDetailCell.append(item.data.readings ? item.data.readings.map((i) => i.reading).join('、 ') : '-');
        itemDetailRow.append(itemDetailCell);
        itemDetailTable.append(itemDetailRow);

        itemDetailRow = document.createElement("tr");
        itemDetailCell = document.createElement("th");
        itemDetailCell.append('Level');
        itemDetailRow.append(itemDetailCell);
        itemDetailCell = document.createElement("td");
        itemDetailCell.append(item.data.level);
        itemDetailRow.append(itemDetailCell);
        itemDetailTable.append(itemDetailRow);
        itemDetailDiv.append(itemDetailTable);
        itemImgLink.append(itemDetailDiv);

        var itemImg = document.createElement("a");
        itemImg.classList.add("rs_item_character");
        itemImg.onclick=function() { wk_rs_fireClickEvent(); event.stopPropagation(); wk_rs_displayDetails(itemDetailDiv); };
        var itemSpan = document.createElement("span");
        itemSpan.classList.add("character-item--" + SUBJECT_TYPE_MAP[item.object]);
        itemSpan.append(item.data.characters || svgs[reviewId].cloneNode(true));
        itemImg.append(itemSpan);
        itemImgLink.append(itemImg);

        return itemImgLink;
    }

    // copied from the heatmap script
    async function getSvgs(ids, items_id) {
        const svgs = {};
        const svgPromises = [];
        for (var index in ids) {
            const id = ids[index];
            if (items_id[id].data.characters) { continue; }
            svgPromises.push(
                wkof.load_file(
                        items_id[id].data.character_images.find(
                            (a) => a.content_type == 'image/svg+xml' && a.metadata.inline_styles,
                        ).url,
                    )
                    .then((svg) => {
                        let svgElem = document.createElement('span')
                        svgElem.innerHTML = svg.replace(/<svg /, `<svg class="radical-svg" `)
                        svgs[id] = svgElem.firstChild
                    }),
            )
        }
        await Promise.allSettled(svgPromises);
        return svgs;
    }

    /*-------------------------------------------------------------------------------------------------------------------------------*/

    // Adds the script's CSS to the page
    function add_css() {
        var userStyle = document.createElement('style');
        userStyle.id = "wk_reviewSummary_CSS";
        userStyle.append(
                `#reviewSummaryTile {
                     height: 100%;
                     background-color: #00aaff;
                     width: 100%;
                     text-align: center;
                     padding: var(--spacing-normal);
                     border-radius: var(--border-radius-widget);
                     border: 1px solid var(--color-widget-border);
                 }
                 #reviewSummaryTile i {
                     color: #fff;
                     position: relative;
                     float: right;
                     right: 6px;
                     top: 6px;
                 }
                 #reviewSummaryTile a {
                     cursor: pointer;
                 }
                 #reviewSummaryTile span {
                     color: #fff;
                     font-family: "Open Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
                     font-weight: bold;
                 }
                 #reviewSummaryTile span#rs_tile_span_header {
                     font-size: var(--font-size-large);
                     top: var(--spacing-normal);
                 }
                 #reviewSummaryTile span#rs_tile_span_percentage {
                     font-size: 36px;
                     top: 28px;
                 }
                 .rs_iconButton {
                     cursor:pointer;
                     position: relative;
                     float: right;
                     right: 6px;
                     border: 0px;
                     width: 24px;
                 }
                 #reviewSummaryWindow {
                     position: absolute;
                     z-index: 1;
                     background: #434343;
                     border-radius: 5px;
                     padding: 6px;
                     top: 300px;
                     left: 150px;
                     width: 70%;
                 }
                 .reviewSummaryWindow span {
                     color: #fff;
                     font-family: "Open Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
                     padding: 4px 6px 4px;
                 }
                 #reviewSummaryWindow span#rs_window_span_header {
                     font-size: 18px;
                     font-weight: bold;
                 }
                 #reviewSummaryWindow span#rs_window_span_percentage {
                     font-size: 36px;
                     position: relative;
                     top: 6px;
                 }
                 #rs_tile_windowlink:hover {
                     text-decoration:none;
                 }
                 .reviewSummaryWindow div {
                     position: relative;
                     top: 12px;
                     padding: 6px;
                     margin-bottom: 8px;
                 }
                 div.rs_window_div_items_stage {
                     display: grid;
                     grid-template-columns: min-content;
                 }
                 div.rs_window_div_items_stage span {
                     grid-column: 1 / span 10;
                 }
                 #rs_window_span_count_correct {
                     background: #00aa00;
                 }
                 #rs_window_span_count_incorrect {
                     background: #ff0000;
                 }
                 .rs_window_button_tab {
                     border-style: solid;
                     border-color: #666666;
                     background: #666666;
                     color: #fff;
                 }
                 .rs_window_button_tab:hover {
                     border-color: #888888;
                     color: #fff;
                 }
                 .rs_window_button_tab.active {
                     border-color: #888888;
                     background: #888888;
                     color: #fff;
                 }
                 .rs_iconButton {
                     background: #666666;
                     color: #fff;
                 }
                 .rs_item_div {
                 }
                 .rs_item_table_character {
                     color: #fff;
                     font-size: 32px;
                 }
                 .rs_item_table th {
                     padding-right: 20px;
                 }
                 .rs_item_character {
                     color: #fff;
                     font-size: 24px;
                     padding: 4px;
                     margin-right: 6px;
                     white-space: nowrap;
                 }
                 div.rs_item_window {
                     background: #666666;
                     color: #fff;
                     position: absolute;
                     width: 300px;
                     z-index:2;
                     padding: 12px;
                     left: 16px;
                 }
                 .rs_item_character:hover {
                     text-decoration:none;
                     color: #fff;
                     cursor: pointer;
                 }
                 .rs_item_table_character:hover {
                     text-decoration:none;
                     color: #fff;
                 }
                 a.rs_item_table_character span {
                     display: block;
                     text-align: center;
                     width: 92%;
                     padding: 12px;
                 }
                 .rs_item_character:visited {
                     text-decoration:none;
                 }
                 .rs_item_table_character:visited {
                     text-decoration:none;
                 }
                 .character-item--radical{background-color:#0af;background-image:linear-gradient(to bottom, #0af, #0093dd);border-color:#88d7ff transparent #069 #88d7ff}
                 .character-item--kanji{background-color:#f0a;background-image:linear-gradient(to bottom, #f0a, #dd0093);border-color:#f6c transparent #c08 #f6c}
                 .character-item--vocabulary{background-color:#a0f;background-image:linear-gradient(to bottom, #a0f, #9300dd);border-width:1px 0;border-color:#c655ff transparent #80c #c655ff}
                 .rs_item_character svg.radical-svg {
                     filter: invert(1);
                     width: 24px;
                  }
                 `);
        document.getElementsByTagName('head')[0].append(userStyle);
    }

    /*-------------------------------------------------------------------------------------------------------------------------------*/

    // Load settings and set defaults
    function load_settings() {
        var defaults = {
            showLessonSummary: false,
            showReviewPercentage: '1',
            initialDisplay: '1',
            itemSort: '1',
            detailStages: false,
            widgetRow: 1,
            widgetColumn: 3
        };
        return wkof.Settings.load(SCRIPT_ID, defaults);
    }

    // Installs the options button in the menu
    function install_menu() {
        var config = {
            name: 'wk_reviewSummary_settings',
            submenu: 'Settings',
            title: 'Review Summary',
            on_click: open_settings
        };
        wkof.Menu.insert_script_link(config);
    }

    // Create the options
    function open_settings(items) {
        var config = {
            script_id: SCRIPT_ID,
            title: 'Review Summary Settings',
            on_save: fetch_and_update,
            content: {
                mainPage: {
                    type: 'page',
                    label: 'Settings',
                    hover_tip: 'Settings for the Review Summary',
                    content: {
                        display_group: {
                            type: 'group',
                            label: 'Display',
                            content: {
                                showReviewPercentage: {
                                    type: 'dropdown',
                                    label: 'Show accuracy of last review',
                                    hover_tip: 'Display mode for the accuracy percentage',
                                    default: '1',
                                    content: {
                                        0: 'Never',
                                        1: 'Only when new',
                                        2: 'Always'
                                    }
                                },
                                initialDisplay: {
                                    type: 'dropdown',
                                    label: 'Information to initially display',
                                    hover_tip: 'Only affects which items are initially displayed when opening the summary details. You can still toggle between the views later',
                                    default: '1',
                                    content: {
                                        0: 'All',
                                        1: 'Incorrect items',
                                        2: 'Correct items'
                                    }
                                },
                                itemSort: {
                                    type: 'dropdown',
                                    label: 'Order of displayed items',
                                    hover_tip: 'Affects the order of display of the reviewed items',
                                    default: '1',
                                    content: {
                                        0: 'Stage > Level > Type',
                                        1: 'Stage > Type > Level'
                                    }
                                },
                                detailStages: {
                                    type: 'checkbox',
                                    label: 'Use detailed stages',
                                    hover_tip: 'Separate Guru I from Guru II, etc',
                                    default: false
                                }
                            }
                        },
                        position_group: {
                            type: 'group',
                            label: 'Dashboard Position',
                            content: {
                                widgetRow: {
                                    type: 'number',
                                    label: 'Row',
                                    hover_tip: 'Dashboard row number to place the review tile in, starting from 1',
                                    default: 1
                                },
                                widgetColumn: {
                                    type: 'number',
                                    label: 'Column',
                                    hover_tip: 'Which slot in the dashboard row to use, starting from 1',
                                    default: 3
                                }
                            }
                        }
                    }
                }
            }
        }

        var dialog = new wkof.Settings(config);
        dialog.open();
    }

})();