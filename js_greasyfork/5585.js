// ==UserScript==
// @name          WaniKani Timeline
// @namespace     https://www.wanikani.com
// @description   This UserScript is a descendant of the WaniKani Customizer Chrome Extension Timeline
// @version       0.1.5
// @include       https://www.wanikani.com/
// @include       https://www.wanikani.com/dashboard
// @include       https://www.wanikani.com/account
// @run-at        document-end
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/5585/WaniKani%20Timeline.user.js
// @updateURL https://update.greasyfork.org/scripts/5585/WaniKani%20Timeline.meta.js
// ==/UserScript==

/*jslint browser: true, plusplus: true*/
/*global $, console, alert, confirm */

/*
rev 0.1.0:
Almost all of this code is by Kyle Coburn aka kiko on WakiKani.
It has been reformatted slightly and some minor changes made.
rev 0.1.1: added a few more options
for classic style: enable only fuzzy_time_mode_past, fuzzy_time_mode_near, and optionally twelve_hour_mode
rev 0.1.2:
change to fix server timeouts on higher level vocabulary
change to prevent always reloading data when no current reviews
increased max display time to 7-days
changed data storage format. now stores number and type of current and burning items. (for more display options later)
added a last updated time (works with 'WaniKani Real Times')
added a basic loading and error indicator
added 'wkt_username_' prefix to localStorage keys (for multiple WK account support)
added a reload button
added invalid API key detection. forget bad key. get new on refresh.
rev 0.1.3:
changed cacheTime format to seconds. Please click 'R' reload button once after upgrade! (if time stuck 'Just now')
removed timestamp from timeTable format. now just calculate from cacheTime.
added current/burn total visible counter tooltip on slider label
changed default hours to 24
changed default vocab levels/request limit to 10
added a faint line between adjacent bars
removed current/burn full-bar backgrounds
added proportional RKV-specific current/burn marks
triangle markers morph towards rectangles as they get very small to improve visibility
don't draw offscreen graph bars (minor performance improvement)
reverse tooltip when it would collide with browser right edge
hardcode tRes time step to 15-minutes (WK-native interval)
update graph while dragging scale bar
automatically resize when needed on window resize event
retry failed data requests on most errors (limit: twice). reduce timeout load issues.
added request url marking to error display (title tag)
last updated time 'WaniKani Real Times'-like behavior now integrated
changed to clock-based time tic marks
added hover highlight
added green elapsed time highlight marker
changed options.fuzzy_time_mode_past default to false
added extended type display to tooltip (option flag to disable it)
added summary tooltip left of graph
changed tooltip tracking behavior (option flag to restore classic behavior)
now show time tooltips for intervals with no reviews
changed fuzzyMins from '-x mins' to 'x mins ago'
rev 0.1.4:
added 'hour_offset' option for people who want to offset from their system timezone
changed 'current level' text in tooltip to 'current'. better length matching.
rev 0.1.5:
minor tooltip bugfix
*/

(function () {
    'use strict';
    var localStoragePrefix, ajaxCompletedCount, apiCalls, apiColors, startTime, timeZero, gHours, nextIdx,
        graphH, canvasH, xOff, vOff, maxHours, times, pastReviews, cacheTime, tFrac, options = {};
    /* ### CONFIG OPTIONS ### */
    options.hour_offset = 0; // offset displayed hours. Range: integer -23 to +23. (0 is your system timezone.)
    // options.twelve_hour_mode = true; // enable 12-hour AM/PM mode
    // options.fuzzy_time_mode_past = true; // enable '-x mins' mode for items now available
    // options.fuzzy_time_mode_near = true; // enable 'x mins' mode for upcoming items: now < time < now+90min
    options.fuzzy_time_paren = true; // append (x mins) to time for items: time < now+90min
    options.show_weekday = true; // show weekday prefix
    options.enable_arrows = true; // enable indicator arrows
    options.enable_extended_info = true; // show RKV breakdown in tooltips
    // options.classic_tooltip_tracking = true; // enable old style tooltip positioning
    /* ### END CONFIG ### */

    apiColors = ['#0096E7', '#EE00A1', '#9800E8'];
    startTime = Math.floor(Date.now() / 1000); // in seconds
    timeZero = Math.ceil(startTime / 900); // get offset for next 15-minute time (from startTime for new data)
    gHours = 24;
    graphH = 88;
    canvasH = graphH + 15;
    xOff = 18;
    vOff = 16;
    maxHours = 24 * 7;

    function strNumSeq(min, max) {
        var i, str = '';
        for (i = min; i <= max; i++) {
            if (str) {
                str += ',';
            }
            str += i;
        }
        return str;
    }
    function addSplitVocab(level) {
        var segCnt, segLen, min, max,
            vocabRequestLevelSplitSize = 10; // maximum number of levels per vocab API request
        segCnt = Math.ceil(level / vocabRequestLevelSplitSize);
        segLen = Math.ceil(level / segCnt);
        for (min = 1; min <= level; min += segLen) {
            max = min + segLen - 1;
            if (max > level) {
                max = level;
            }
            apiCalls.push('vocabulary/' + strNumSeq(min, max));
        }
    }
    function getDashboardLevel() {
        var match, levelStr = $('section.progression h3').html();
        if (levelStr) {
            match = levelStr.match(/Level (\d+) /);
            if (match && match.length === 2) {
                return parseInt(match[1], 10);
            }
        }
        return null;
    }
    function genListApiCalls() {
        var level;
        apiCalls = ['radicals', 'kanji'];
        level = getDashboardLevel();
        if (level && 0 < level && level < 100) { // allow for level expansion
            addSplitVocab(level);
        } else { // if unknown level fail to no-split
            apiCalls.push('vocabulary');
        }
    }
    function getPageUser() {
        var match, profileUrl = $('ul.nav a:contains("Profile")').prop('href');
        if (profileUrl) {
            match = profileUrl.match('[^/]*$');
            if (match && match.length === 1) {
                return match[0];
            }
        }
        return ''; // blank if error
    }
    function debounce(func, wait) {
        var timeout;
        return function () {
            var context = this,
                args = arguments;
            function later() {
                timeout = null;
                func.apply(context, args);
            }
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    function pluralize(noun, amount) {
        return amount + ' ' + (amount === 1 ? noun : noun + 's');
    }
    function pluralizeN(noun, amount) {
        return amount === 1 ? noun : noun + 's';
    }
    // using round() instead of floor() means it only shows '1 min' for ~30 sec, but otherwise feels more 'right' in this case
    function fuzzyMins(minutes) {
        var seconds, negativeStr;
        negativeStr = (minutes < 0) ? ' ago' : '';
        minutes = Math.abs(minutes);
        if (minutes < 1) {
            seconds = Math.round(minutes * 60);
            return pluralize('sec', seconds) + negativeStr;
        }
        minutes = Math.round(minutes);
        return pluralize('min', minutes) + negativeStr;
    }
    function getTimeAgoStr(time) {
        function fmt(unit, val) {
            return (val === 0) ? '' : (pluralize(unit, val) + ' ');
        }
        var timeMin = Math.floor((Date.now() - time) / 60000),
            day = fmt('day', Math.floor(timeMin / (24 * 60))),
            hrs = fmt('hour', Math.floor((timeMin % (24 * 60)) / 60)),
            min = fmt('minute', timeMin % 60);
        if (timeMin >= 24 * 60) { // gt 1 day
            return day + hrs + "ago";
        }
        if (timeMin >= 1) { // gt 1 min
            return hrs + min + "ago";
        }
        return "Just now";
    }
    function drawCurrentBarBase(ctx, bx, by, width, height, color) {
        if (width <= 0) {
            return;
        }
        ctx.fillStyle = color;
        ctx.fillRect(bx, by, width, height);
    }
    function drawCurrentBarMark(ctx, bx, by, width, height, markColor) {
        var offX, offY;
        if (width <= 0) {
            return;
        }
        offX = 0;
        offY = height / 3;
        ctx.fillStyle = markColor;
        ctx.fillRect(bx + offX, by + offY, width - 2 * offX, height - 2 * offY);
    }
    function drawCurrentBars(ctx, maxCount, canvasW) {
        var type, width, typeWidth,
            gOff = xOff,
            height = graphH - vOff,
            pixelPerCount = (canvasW - xOff) / maxCount;
        for (type = 0; type < 3; ++type) {
            // total base bar
            typeWidth = pixelPerCount * pastReviews[type][0];
            drawCurrentBarBase(ctx, gOff, vOff, typeWidth, height, apiColors[type]); // total
            // current
            width = pixelPerCount * pastReviews[type][1];
            drawCurrentBarMark(ctx, gOff, vOff, width, height, '#FFFFFF'); // current
            // burn
            width = pixelPerCount * pastReviews[type][2];
            drawCurrentBarMark(ctx, gOff + typeWidth - width, vOff, width, height, '#000000'); // burn
            gOff += typeWidth;
        }
    }
    function drawArrow(ctx, color, bx, tFrac) {
        var topY = 3 + graphH,
            halfWidthX = tFrac / 2,
            cenX = bx + halfWidthX,
            trapX; // trapezoid factor
        if (halfWidthX > 9) { // limit arrow width
            halfWidthX = 9;
        }
        if (halfWidthX > 2) {
            trapX = 0;
        } else if (halfWidthX > 1) {
            trapX = 0.75 * (2 - halfWidthX) * halfWidthX;
        } else {
            trapX = 0.75 * halfWidthX;
        }
        // console.log('trapX', halfWidthX, trapX, trapX / halfWidthX);
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(cenX + trapX, topY);
        ctx.lineTo(cenX - trapX, topY);
        ctx.lineTo(cenX - halfWidthX, topY + 10);
        ctx.lineTo(cenX + halfWidthX, topY + 10);
        ctx.fill();
    }
    function drawFutureBarBase(ctx, bx, hOff, width, height, color) {
        var by, sepX;
        if (height <= 0) {
            return;
        }
        by = graphH - height - hOff;
        sepX = width * 0.1; // bar separation
        if (sepX > 1) {
            sepX = 1;
        }
        ctx.fillStyle = color;
        ctx.fillRect(bx + 0.5 * sepX, by, width - sepX, height);
    }
    function drawFutureBarMark(ctx, bx, hOff, width, height, color) {
        var by, offX, offY;
        if (height <= 0) {
            return;
        }
        by = graphH - height - hOff;
        offX = width / 3;
        offY = height * 0.1;
        if (offY > 1) { // upper limit
            offY = 1;
        }
        if (height <= 2) { // zero when small
            offY = 0;
        }
        ctx.fillStyle = color;
        ctx.fillRect(bx + offX, by + offY, width - 2 * offX, height - 2 * offY);
    }
    function drawFutureBars(ctx, maxCount) {
        var timeIdx, counts, type, hOff, height, bx, typeHeight,
            pixelPerCount = (graphH - vOff) / maxCount;
        for (timeIdx = 0; timeIdx < 4 * gHours && timeIdx < times.length; timeIdx++) {
            counts = times[timeIdx];
            if (counts) {
                bx = xOff + timeIdx * tFrac;
                hOff = 0;
                for (type = 0; type < 3; ++type) {
                    // total base bar
                    typeHeight = pixelPerCount * counts[type][0];
                    drawFutureBarBase(ctx, bx, hOff, tFrac, typeHeight, apiColors[type]); // total
                    // current
                    height = pixelPerCount * counts[type][1];
                    drawFutureBarMark(ctx, bx, hOff, tFrac, height, '#FFFFFF'); // current
                    // burn
                    height = pixelPerCount * counts[type][2];
                    drawFutureBarMark(ctx, bx, hOff + typeHeight - height, tFrac, height, '#000000'); // burn
                    hOff += typeHeight;
                }
                if (options.enable_arrows) {
                    if (counts[0][1] || counts[1][1] || counts[2][1]) {
                        drawArrow(ctx, '#FF0000', bx, tFrac); // current
                    } else if (counts[0][2] || counts[1][2] || counts[2][2]) {
                        drawArrow(ctx, '#A0A0A0', bx, tFrac); // burn
                    }
                }
            }
        }
    }
    function genDateStr(tDate) {
        var hours, mins, suffix, weekdayText,
            weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        hours = tDate.getHours();
        mins = tDate.getMinutes();
        suffix = '';
        if (options.twelve_hour_mode) {
            suffix = ' ' + (hours < 12 ? 'am' : 'pm');
            hours %= 12;
            if (hours === 0) {
                hours = 12;
            }
        } else { // don't zero-pad hours in 12-hour-mode
            if (hours < 10) {
                hours = '0' + hours;
            }
        }
        if (mins < 10) {
            mins = '0' + mins;
        }
        weekdayText = '';
        if (options.show_weekday) {
            weekdayText = weekday[tDate.getDay()] + ' ';
        }
        return weekdayText + hours + ':' + mins + suffix;
    }
    function genTypeCountHtml(counts, category) {
        var count, type, str = '';
        if (!options.enable_extended_info) {
            return '';
        }
        for (type = 0; type < 3; type++) {
            if (counts[type][0]) { // if any of this type
                count = counts[type][category];
                str += '<td><span class="wktTooltipTypeCount" style="color: ' + apiColors[type] + '">' + (count > 0 ? count : '&nbsp;') + '</span></td>';
            }
        }
        return str;
    }
    function setTooltipHtml(elem, timeIdx) {
        var reviewCount, currentCount, burnCount, showTime, minDiff, tDisplay, tText, fuzzyExtra, counts,
            totalCounts, type, cat;
        if (gHours === 0) {
            counts = pastReviews;
            tDisplay = '<span class="wktSummary">Summary</span>';
        } else {
            if (timeIdx >= 0) {
                counts = times[timeIdx];
                showTime = new Date(1000 * (timeZero + timeIdx) * 900);
                minDiff = (showTime - Date.now()) / (1000 * 60);
                if (options.fuzzy_time_mode_past && minDiff < 0) {
                    tDisplay = fuzzyMins(minDiff);
                } else if (options.fuzzy_time_mode_near && 0 <= minDiff && minDiff < 90) {
                    tDisplay = fuzzyMins(minDiff);
                } else {
                    fuzzyExtra = '';
                    if (options.fuzzy_time_paren && minDiff < 90) {
                        fuzzyExtra = '&nbsp;&nbsp;(' + fuzzyMins(minDiff) + ')';
                    }
                    if (options.hour_offset) {
                        showTime.setHours(showTime.getHours() + options.hour_offset);
                    }
                    tDisplay = genDateStr(showTime) + fuzzyExtra;
                }
                if (minDiff <= 0) {
                    tDisplay = '<span class="wktPastTime">' + tDisplay + '</span>';
                }
            } else {
                totalCounts = [];
                totalCounts[0] = [0, 0, 0];
                totalCounts[1] = [0, 0, 0];
                totalCounts[2] = [0, 0, 0];
                for (timeIdx = 0; timeIdx < 4 * gHours && timeIdx < times.length; timeIdx++) {
                    counts = times[timeIdx];
                    if (counts) {
                        for (type = 0; type < 3; type++) {
                            for (cat = 0; cat < 3; cat++) {
                                totalCounts[type][cat] += counts[type][cat];
                            }
                        }
                    }
                }
                counts = totalCounts;
                tDisplay = '<span class="wktSummary">Summary</span>';
            }
        }
        if (counts) {
            reviewCount  = counts[0][0] + counts[1][0] + counts[2][0];
            currentCount = counts[0][1] + counts[1][1] + counts[2][1];
            burnCount    = counts[0][2] + counts[1][2] + counts[2][2];
            tText = tDisplay + '<table><tr><td class="wktTooltipCount">' + reviewCount + '</td><td class="wktTooltipLabel">' + pluralizeN('review', reviewCount) + '</td>' + genTypeCountHtml(counts, 0) + '</tr>';
            if (currentCount) {
                tText += '<tr><td class="wktTooltipCount">' + currentCount + '</td><td class="wktTooltipLabel"><em>current</em></td>' + genTypeCountHtml(counts, 1) + '</tr>';
            }
            if (burnCount) {
                tText += '<tr><td class="wktTooltipCount">' + burnCount + '</td><td class="wktTooltipLabel"><em>burning</em></td>' + genTypeCountHtml(counts, 2) + '</tr>';
            }
            tText += '</table>';
            elem.html(tText);
            if (options.enable_extended_info) {
                // brute force first/last corner rounding...
                elem.find('tr').each(function (index, element) {
                    var span = $(element).find('.wktTooltipTypeCount');
                    span.first().addClass('wktTooltipTypeFirst');
                    span.last().addClass('wktTooltipTypeLast');
                });
            }
        } else {
            elem.html(tDisplay);
        }
    }
    function updateTooltipPos(gTip, event, barW, graphLeft, idx) {
        var leftPosX, tooltipW, rightMargin;
        if (options.classic_tooltip_tracking) {
            leftPosX = graphLeft + (idx + 1) * barW;
            tooltipW = gTip.outerWidth();
            rightMargin = $(window).width() - leftPosX - tooltipW;
            gTip.css({
                'left': (rightMargin > 5) ? leftPosX : (leftPosX - tooltipW - barW),
                'top': event.pageY - gTip.height() - 6
            });
        } else {
            leftPosX = event.pageX + 10;
            tooltipW = gTip.outerWidth();
            rightMargin = $(window).width() - leftPosX - tooltipW;
            gTip.css({
                'left': (rightMargin > 5) ? leftPosX : (leftPosX - tooltipW - 15),
                'top': event.pageY + 10
            });
        }
    }
    function initTooltip() {
        var gTip, highlight, canvasJQ, prevIdx = null;
        gTip = $('#wktTooltip');
        highlight = $('#wktTooltipHighlight');
        canvasJQ = $('#wktCanvas');
        canvasJQ.mousemove(function (event) {
            var xPos, yPos, barW, idx, graphLeft, graphTop;
            graphLeft = canvasJQ.offset().left + xOff;
            graphTop = canvasJQ.offset().top + vOff;
            xPos = event.pageX - graphLeft;
            yPos = event.pageY - graphTop;
            if (yPos < 0) { // ignore mouse in top margin
                if (prevIdx !== null) {
                    canvasJQ.mouseleave();
                }
                return;
            }
            if (xPos < 0) {
                barW = xOff;
                idx = -1;
            } else {
                if (gHours === 0) { // no normal tooltip for past reviews
                    if (prevIdx !== null) {
                        canvasJQ.mouseleave();
                    }
                    return;
                }
                barW = tFrac;
                idx = Math.floor(xPos / barW);
            }
            if (idx !== prevIdx) {
                setTooltipHtml(gTip, idx);
                updateTooltipPos(gTip, event, barW, graphLeft, idx);
                highlight.css({
                    'left': graphLeft + idx * barW,
                    'top': graphTop,
                    'height': graphH - vOff,
                    'width': barW
                });
                gTip.show();
                highlight.show();
                prevIdx = idx;
            } else {
                updateTooltipPos(gTip, event, barW, graphLeft, idx);
            }
        });
        canvasJQ.mouseleave(function () {
            gTip.hide();
            highlight.hide();
            prevIdx = null;
        });
    }
    function drawTimeMark(ctx, canvasW, timeIdx) {
        var str, textHalfWidth, isTic, textClipped, hour,
            xP = Math.floor(xOff + (timeIdx + 0.5) * tFrac),
            date = new Date(1000 * (timeZero + timeIdx) * 900);
        if (options.hour_offset) {
            date.setHours(date.getHours() + options.hour_offset);
        }
        hour = date.getHours();
        if (gHours <= 6) {
            isTic = true;
        } else if (gHours <= 24) {
            isTic = hour % 3 === 0;
        } else if (gHours <= 48) {
            isTic = hour % 6 === 0;
        } else if (gHours <= 96) {
            if (hour % 2) { return; }
            isTic = hour % 12 === 0;
        } else {
            if (hour % 3) { return; }
            isTic = hour === 0;
        }
        // draw line
        ctx.fillStyle = isTic ? '#CCCCCC' : '#E4E4E4';
        ctx.fillRect(xP, vOff, 1, graphH - vOff);
        if (isTic) {
            // draw tic mark
            ctx.fillStyle = '#A0A0A0';
            ctx.fillRect(xP, vOff - 4, 1, 4);

            str = genDateStr(date);
            textHalfWidth = ctx.measureText(str).width / 2;
            // console.log('offset', xP - textHalfWidth, canvasW - (xP + textHalfWidth));
            textClipped = xP - textHalfWidth <= 0 || xP + textHalfWidth >= canvasW;
            if (!textClipped) { // don't draw if text would be clipped
                // draw text
                ctx.fillStyle = '#505050';
                ctx.fillText(str, xP, 0);
            }
        }
    }
    function getNextIndex() {
        var timeNow = Math.floor(Date.now() / 1000); // in seconds
        return Math.ceil(timeNow / 900) - timeZero;
    }
    function drawCanvas() {
        var ctx, canvasW, counts, columnRevCnt, timeIdx,
            canvas = document.getElementById('wktCanvas'),
            reviewCount = 0, currentCount = 0, burnCount = 0, maxCount = 1;
        // console.log('drawCanvas');
        if (!canvas.getContext) {
            return;
        }
        canvasW = $('.span12 header').width();
        tFrac = (canvasW - xOff) / (4 * gHours); // pixels per column
        canvas.width = canvasW; // has side effect of clear
        ctx = canvas.getContext('2d');

        // calculate totals
        if (gHours === 0) {
            counts = pastReviews;
            if (counts) {
                reviewCount  = counts[0][0] + counts[1][0] + counts[2][0];
                currentCount = counts[0][1] + counts[1][1] + counts[2][1];
                burnCount    = counts[0][2] + counts[1][2] + counts[2][2];
                maxCount = reviewCount;
            }
        } else {
            for (timeIdx = 0; timeIdx < 4 * gHours && timeIdx < times.length; timeIdx++) {
                counts = times[timeIdx];
                if (counts) {
                    columnRevCnt  = counts[0][0] + counts[1][0] + counts[2][0];
                    currentCount += counts[0][1] + counts[1][1] + counts[2][1];
                    burnCount    += counts[0][2] + counts[1][2] + counts[2][2];
                    reviewCount  += columnRevCnt;
                    if (columnRevCnt > maxCount) {
                        maxCount = columnRevCnt;
                    }
                }
            }
            maxCount = Math.ceil(maxCount / 2) * 2; // round up to nearest even number
        }
        $('#wktRangeLabelReviewCount').text(pluralize('review', reviewCount));
        $('#wktRangeLabel').prop('title', 'Current ' + currentCount + '   Burn ' + burnCount);

        // text config general
        ctx.textBaseline = 'top';
        ctx.textAlign = 'right';
        ctx.font = '12px sans-serif';
        // text maxCount (left)
        ctx.fillStyle = '#505050';
        ctx.fillText(maxCount, xOff - 4, vOff + 1);
        // line v-right
        ctx.fillStyle = '#E4E4E4';
        ctx.fillRect(canvasW - 1, vOff, 1, graphH - vOff);
        if (gHours !== 0) {
            // line h-top
            ctx.fillStyle = '#E4E4E4';
            ctx.fillRect(0, vOff - 1, canvasW, 1);
            // line h-center 
            ctx.fillStyle = '#E4E4E4';
            ctx.fillRect(0, Math.floor((vOff + graphH) * 0.5), canvasW, 1);
            // text maxCount-half (left)
            ctx.fillStyle = '#505050';
            ctx.fillText(maxCount / 2, xOff - 4, Math.floor((vOff + graphH) * 0.5) + 2);
            // lines vertical
            ctx.textAlign = 'center';
            timeIdx = Math.ceil(timeZero / 4) * 4 - timeZero; // next hour
            for (0; timeIdx < 4 * gHours; timeIdx += 4) {
                drawTimeMark(ctx, canvasW, timeIdx);
            }
        }
        // line v-left
        ctx.fillStyle = '#D4D4D4';
        ctx.fillRect(xOff - 2, vOff, 1, graphH - vOff);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(xOff - 1, vOff, 1, graphH - vOff);
        // line h-bottom
        ctx.fillStyle = '#D4D4D4';
        ctx.fillRect(0, graphH, canvasW, 1);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, graphH + 1, canvasW, 1);

        if (gHours === 0) {
            drawCurrentBars(ctx, maxCount, canvasW);
        } else {
            nextIdx = getNextIndex();
            if (nextIdx > 0) {
                // elapsed back highlight
                ctx.fillStyle = 'rgba(0,255,0,0.1)';
                ctx.fillRect(xOff, vOff, tFrac * nextIdx, graphH - vOff);
            }
            drawFutureBars(ctx, maxCount);
            if (nextIdx > 0) {
                // elapsed bar
                ctx.fillStyle = '#00FF00';
                ctx.fillRect(Math.floor(xOff + tFrac * nextIdx), vOff - 4, 1, graphH - vOff + 9);
            }
        }
    }
    function triggerInputDraw() {
        gHours = null; // to trigger change detection
        $('#wktRange').trigger('input'); // triggers drawCanvas()
    }
    function initUpdateElapsed() {
        setInterval(function () {
            if (getNextIndex() > nextIdx) {
                triggerInputDraw();
            }
        }, 30 * 1000);
    }
    function initUpdateTime() {
        var isoString, utcString, date, elem;
        date = new Date(1000 * cacheTime);
        isoString = date.toISOString();
        utcString = isoString.replace(/(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}:\d{2})\.\d{3}Z/, '$1 $2 UTC');
        elem = $('#wktCacheTime');
        elem.prop('title', 'Updated: ' + utcString);
        elem.html(getTimeAgoStr(date));
        setInterval(function () {
            elem.html(getTimeAgoStr(date));
        }, 30 * 1000);
    }
    function bindEventSlider() {
        var drawCanvasDebounce = debounce(drawCanvas, 50);
        function onSliderInput() {
            var newVal = Number($(this).val());
            if (gHours === newVal) {
                return;
            }
            // console.log('input fired', gHours, newVal);
            gHours = newVal;
            if (gHours < 6) {
                gHours = pastReviews ? 0 : 3;
            }
            $('#wktRangeLabelTimeframe').text(gHours === 0 ? 'right now' : 'in ' + gHours + ' hours');
            drawCanvasDebounce();
        }
        $('#wktRange').on('input', onSliderInput);
    }
    function bindEventResize() {
        function onResizeEvent() {
            // console.log('onResizeEvent');
            if ($('#wktCanvas').width() !== $('.span12 header').width()) { // check if canvas actually needs resize
                triggerInputDraw(); // triggers drawCanvas()
            }
        }
        $(window).resize(debounce(onResizeEvent, 250));
    }
    function getFirstReviewSliderHours() {
        var idx;
        for (idx = 0; idx < times.length; idx++) {
            if (times[idx]) {
                return Math.ceil((idx + 1) / (4 * 6)) * 6;
            }
        }
        return 0;
    }
    function initCanvas() {
        var reviewHours = getFirstReviewSliderHours();
        if (reviewHours > gHours) {
            gHours = reviewHours;
        }
        timeZero = Math.ceil(cacheTime / 900); // get offset for next 15-minute time (from cacheTime for old or new data)
        initTooltip();
        initUpdateTime();
        bindEventSlider();
        bindEventResize();
        $('#wktLoading').hide();
        $('#wktSection').show();
        $('#wktRange').val(gHours); // set slider
        triggerInputDraw(); // triggers drawCanvas()
        initUpdateElapsed();
    }
    function appendError(newError) {
        var error = $('#wktLoadingError').html();
        if (!error) {
            error = 'Error: ';
        } else {
            error += ', ';
        }
        error += newError;
        $('#wktLoadingError').html(error);
    }
    function appendErrorTitle(error, title) {
        appendError('<span title="' + title + '">' + error + '</span>');
    }
    // Load data
    function addData(data) {
        var typeIdx, itemIdx, timeIdx, response, myLevel, item, stats, timeTable;
        response = data.requested_information;
        if (!response) {
            if (data.error) {
                if (data.error.code === 'user_not_found') {
                    appendErrorTitle('badApiKey', this.urlTag);
                    localStorage.removeItem(localStoragePrefix + 'apiKey'); // remove invalid key
                    return;
                }
            }
            appendErrorTitle('badResponse', this.urlTag);
            return;
        }
        if (response.general) {
            response = response.general;
        }
        myLevel = data.user_information.level;
        typeIdx = response[0].kana ? 2 : response[0].important_reading ? 1 : 0; // determine RKV type
        for (itemIdx = 0; itemIdx < response.length; itemIdx++) {
            item = response[itemIdx];
            stats = item.user_specific;
            if (stats && !stats.burned) {
                timeIdx = Math.round(stats.available_date / 900) - timeZero; // should be evenly divisible by 900
                if (timeIdx < maxHours * 4) { // if next review time is before graph limit
                    if (timeIdx < 0) {
                        if (!pastReviews) {
                            pastReviews = []; // init object
                        }
                        timeTable = pastReviews;
                    } else {
                        if (!times) {
                            times = []; // init object
                        }
                        if (!times[timeIdx]) {
                            times[timeIdx] = []; // init object
                        }
                        timeTable = times[timeIdx];
                    }
                    if (!timeTable[0]) {
                        timeTable[0] = [0, 0, 0]; // 0:radical   [0:total, 1:current, 2:burn]
                        timeTable[1] = [0, 0, 0]; // 1:kanji
                        timeTable[2] = [0, 0, 0]; // 2:vocab
                    }
                    timeTable[typeIdx][0]++; // add item to r0/k1/v2 bin total
                    if (typeIdx < 2 && item.level === myLevel && stats.srs === 'apprentice') {
                        timeTable[typeIdx][1]++; // increment current
                    } else if (stats.srs === 'enlighten') {
                        timeTable[typeIdx][2]++; // increment burn
                    }
                }
            }
        }
        ajaxCompletedCount++;
        if (ajaxCompletedCount === apiCalls.length && times && times.length > 0) {
            cacheTime = startTime;
            localStorage.setItem(localStoragePrefix + 'reviewCache', JSON.stringify(times));
            localStorage.setItem(localStoragePrefix + 'pastCache', JSON.stringify(pastReviews));
            localStorage.setItem(localStoragePrefix + 'cacheTime', cacheTime);
            initCanvas();
        } else {
            $('#wktLoadingCount').html(ajaxCompletedCount + '/' + apiCalls.length);
            if (ajaxCompletedCount >= apiCalls.length) {
                appendError('noData'); // all request completed, none contained usable data
            }
        }
    }
    function ajaxError(xhr, textStatus, thrownError) {
        appendErrorTitle(thrownError, this.urlTag);
        // console.log('ajaxError', this);
        if (this.retry > 0) { // retry remaining
            this.retry--;
            $.ajax(this);
        }
    }
    function getNewData(apiKey) {
        var ext;
        localStorage.setItem(localStoragePrefix + 'reviewCache', null);
        localStorage.setItem(localStoragePrefix + 'pastCache', null);
        times = null;
        pastReviews = null;
        ajaxCompletedCount = 0;
        genListApiCalls();
        $('#wktLoadingCount').html(ajaxCompletedCount + '/' + apiCalls.length);
        for (ext = 0; ext < apiCalls.length; ext++) {
            $.ajax({
                type: 'get',
                url: '/api/v1.4/user/' + apiKey + '/' + apiCalls[ext],
                urlTag: apiCalls[ext],
                success: addData,
                error: ajaxError,
                retry: 2
            });
        }
    }
    function insertTimeline() {
        var apiKey;
        apiKey = localStorage.getItem(localStoragePrefix + 'apiKey');
        if (!apiKey || apiKey.length !== 32) {
            alert('Hang on! We\'re grabbing your API key for the Reviews Timeline. We should only need to do this once.');
            document.location.pathname = '/account';
            return;
        }
        $('section.review-status').before('<div id="wktLoading">Reviews Timeline Loading: <span id="wktLoadingCount"></span> <span id="wktLoadingError"></span></div><section id="wktSection"><h4>Reviews Timeline</h4><a id="wktHelp">?</a> <a id="wktReload" title="reload (clear timeline cache)">R</a> <time id="wktCacheTime"></time><form id="wktForm"><label><span id="wktRangeLabel"><span id="wktRangeLabelReviewCount"></span> <span id="wktRangeLabelTimeframe"></span> </span><input id="wktRange" type="range" min="0" max="' + maxHours + '" step="6"></label></form><div id="wktTooltipHighlight"></div><div id="wktTooltip"></div><canvas id="wktCanvas" height="' + canvasH + '"></canvas></section>');
        $('#wktHelp').click(function () {
            alert('Reviews Timeline - Displays your upcoming reviews\nY-axis: Number of reviews\nX-axis: Time (scale set by the slider)\n\nWhite markings and red arrows indicate radicals/kanji necessary for advancing your current level.\nBlack markings and grey arrows indicate burnable items.\n\nThe time display indicates how long ago the Timeline was updated.\nIt will download new data when this exceeds 1-hour and you refresh the page.');
        });
        $('#wktReload').click(function () {
            if (confirm('Reviews Timeline: Reload Confirmation\n\nClick OK to clear the cache and refresh the page.\n\nWarning:\nExcessive API requests may be blocked by the server.') === true) {
                localStorage.removeItem(localStoragePrefix + 'reviewCache');
                document.location.reload();
            }
        });
        try { // JSON.parse will throw SyntaxError on error
            cacheTime = Number(localStorage.getItem(localStoragePrefix + 'cacheTime'));
            times = JSON.parse(localStorage.getItem(localStoragePrefix + 'reviewCache'));
            pastReviews = JSON.parse(localStorage.getItem(localStoragePrefix + 'pastCache'));
        } catch (ignore) {}
        if (times && (!cacheTime || startTime - cacheTime >= 3600)) { // reload if gt 1-hour old data
            times = null;
        }
        if (!times || times.length === 0) { // load new data
            getNewData(apiKey);
        } else { // using cached data
            setTimeout(initCanvas, 0);
        }
    }
    // from: https://gist.githubusercontent.com/arantius/3123124/raw/grant-none-shim.js
    function addStyle(aCss) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (head) {
            style = document.createElement('style');
            style.setAttribute('type', 'text/css');
            style.textContent = aCss;
            head.appendChild(style);
            return style;
        }
        return null;
    }
    function insertGlobalCss() {
        addStyle('\n' +
            'span#wktLoadingError {\n' +
            '    color: red;\n' +
            '}\n' +
            'div#wktTooltipHighlight {\n' +
            '    position: absolute;\n' +
            '    background-color: rgba(0,0,0,0.1);\n' +
            '    pointer-events: none;\n' +
            '    display: none;\n' + // initial
            '}\n' +
            'div#wktTooltip {\n' +
            '    padding: 2px 8px;\n' +
            '    position: absolute;\n' +
            '    color: #EEEEEE;\n' +
            '    background-color: rgba(0,0,0,0.6);\n' +
            '    border-radius: 4px;\n' +
            '    pointer-events: none;\n' +
            '    font-weight: bold;\n' +
            '    white-space: nowrap;\n' +
            '    display: none;\n' + // initial
            '}\n' +
            'div#wktTooltip .wktPastTime {\n' +
            '    color: #FFFFFF;\n' +
            '    text-shadow: 0 0 1px #00FF00;\n' +
            '}\n' +
            'div#wktTooltip .wktSummary {\n' +
            '    color: #FFFFFF;\n' +
            '    text-shadow: 0 0 1px #FF0000;\n' +
            '}\n' +
            'div#wktTooltip td {\n' +
            '    padding: 0;\n' +
            '}\n' +
            'div#wktTooltip td.wktTooltipCount {\n' +
            '    padding-right: 5px;\n' +
            '    text-align: right;\n' +
            '}\n' +
            'div#wktTooltip .wktTooltipTypeCount {\n' +
            '    padding: 0 0.25em;\n' +
            '    background-color: rgba(255,255,255,0.75);\n' +
            '    display: block;\n' +
            '    text-align: center;\n' +
            '    line-height: 1;\n' +
            '}\n' +
            'div#wktTooltip .wktTooltipTypeFirst {\n' +
            '    border-top-left-radius: 4px;\n' +
            '    border-bottom-left-radius: 4px;\n' +
            '    margin-left: 10px;\n' +
            '}\n' +
            'div#wktTooltip .wktTooltipTypeLast {\n' +
            '    border-top-right-radius: 4px;\n' +
            '    border-bottom-right-radius: 4px;\n' +
            '}\n' +
            'section#wktSection {\n' +
            '    overflow: hidden;\n' +
            '    margin-bottom: 0px;\n' +
            '    height: ' + (options.enable_arrows ? '130' : '117') + 'px;\n' +
            '    display: none;\n' + // initial
            '}\n' +
            'form#wktForm {\n' +
            '    float: right;\n' +
            '    margin-bottom: 0px;\n' +
            '    margin-right: 1px;\n' +
            '    min-width: 50%;\n' +
            '    text-align: right;\n' +
            '}\n' +
            'section#wktSection h4 {\n' +
            '    clear: none;\n' +
            '    float: left;\n' +
            '    height: 20px;\n' +
            '    margin-top: 0px;\n' +
            '    margin-bottom: 4px;\n' +
            '    font-weight: normal;\n' +
            '    margin-right: 12px;\n' +
            '}\n' +
            'a#wktHelp, a#wktReload {\n' +
            '    font-weight: bold;\n' +
            '    color: rgba(0, 0, 0, 0.1);\n' +
            '    font-size: 1.2em;\n' +
            '    line-height: 0px;\n' +
            '}\n' +
            'a#wktHelp:hover, a#wktReload:hover {\n' +
            '    text-decoration: none;\n' +
            '    cursor: help;\n' +
            '    color: rgba(0, 0, 0, 0.5);\n' +
            '}\n' +
            '@media (max-width: 767px) {\n' +
            '    section#wktSection h4 {\n' +
            '        display: none;\n' +
            '    }\n' +
            '}\n');
    }
    function updateApiKey() {
        var apiKey, alreadySaved;
        apiKey = $('input[placeholder="Key has not been generated"]').val();
        if (apiKey) {
            alreadySaved = localStorage.getItem(localStoragePrefix + 'apiKey');
            localStorage.setItem(localStoragePrefix + 'apiKey', apiKey);
            console.log('WaniKani Timeline Updated API Key: ' + apiKey);
            if (!alreadySaved) {
                document.location.pathname = '/dashboard';
            }
        }
    }
    function init() {
        var username = getPageUser();
        if (!username) {
            console.log('WaniKani Timeline: failed to get username. probably not logged in. abort.');
            return;
        }
        localStoragePrefix = 'wkt_' + username + '_';
        if (document.location.pathname === '/account') {
            updateApiKey();
        } else {
            insertGlobalCss();
            insertTimeline();
        }
    }
    init();
    console.log('WaniKani Timeline: script load end');
}());
