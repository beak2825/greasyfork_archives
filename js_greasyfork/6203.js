// ==UserScript==
// @name          WaniKani Timeline (rfindley)
// @namespace     https://www.wanikani.com
// @description   This is the WaniKani Customizer Chrome Extension Timeline ported to UserScript
// @version       5.0.5
// @include       https://www.wanikani.com/
// @include       https://www.wanikani.com/dashboard
// @include       https://www.wanikani.com/settings/account
// @run-at        document-end
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/6203/WaniKani%20Timeline%20%28rfindley%29.user.js
// @updateURL https://update.greasyfork.org/scripts/6203/WaniKani%20Timeline%20%28rfindley%29.meta.js
// ==/UserScript==

/*jslint browser: true, plusplus: true*/
/*global $, console, alert */

/*
There are several versions of this script floating around.  For now, I am not
listing it publicly, because I intend to make some very significant additions,
hopefully in the not-too-distant future.

Almost all of this code is from Kyle Coburn's WaniKani Customizer extension.
Special thanks to Takuya Kobayashi for converting it to a script, and adding some features.
Some graphical enhancements, and additional info in the hover-popup by Robin Findley.
*/

(function () {
    'use strict';
    var tRes, counted, api_calls, api_colors, curr_date, start_time, gHours, graphH, styleCss,
        xOff, vOff, max_hours, times, pastReviews, firstReview, tFrac, page_width, options = {};
    options['12_hours_i'] = true; // 'true' to display times in 12-hour AM/PM mode
    options['rel_near_time'] = false; // 'true' to show items within 90 minutes as relative time.
    options['zeropad_hours'] = false; // 'true' to pad hours with zeros as needed.
    options['current_burn_arrows'] = true; // 'true' to show arrows above reviews containing current-level and burnable items.
    counted = 0;
    api_calls = ['radicals', 'kanji', 'vocabulary/1,2,3,4,5,6,7,8,9,10', 'vocabulary/11,12,13,14,15,16,17,18,19,20', 'vocabulary/21,22,23,24,25,26,27,28,29,30', 'vocabulary/31,32,33,34,35,36,37,38,39,40', 'vocabulary/41,42,43,44,45,46,47,48,49,50'];
    api_colors = ['#0096e7', '#ee00a1', '#9800e8'];
    curr_date = new Date();
    start_time = curr_date.getTime() / 1000;
    gHours = 36;
    graphH = 88;
    xOff = 18;
    vOff = 16;
    max_hours = 168;
    // Helpers
    function pluralize(noun, amount) {
        return amount + ' ' + (amount !== 1 ? noun + 's' : noun);
    }
    function fuzzyMins(minutes) {
        var seconds;
        if (minutes < 1 && minutes > 0) {
            seconds = Math.round(minutes * 60);
            return pluralize('second', seconds);
        }
        minutes = Math.round(minutes);
        return pluralize('min', minutes);
    }
    // Draw
    function drawArrow(ctx, time, color, tFrac) {
        var x = xOff + (time+0.5) * tFrac, y = graphH+2, w = Math.min(tFrac,12)/2;
        ctx.fillStyle = color;
        ctx.strokeStyle = 'rgba(0,0,0,1)';
        ctx.beginPath();
        ctx.moveTo(x,y);
        ctx.lineTo(x-w,y+10);
        ctx.lineTo(x+w,y+10);
        ctx.closePath();
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.stroke();
    }
    function drawBarRect(ctx, xo, yo, bw, bh, color) {
        ctx.fillStyle = color;
        ctx.fillRect(xo, yo, bw, bh);
    }
    function drawBar(ctx, time, height, hOff, color, tFrac) {
        var bx = xOff + time * tFrac, by = graphH - height - hOff;
        ctx.fillStyle = color;
        ctx.fillRect(bx, by, tFrac, height);
    }
    function drawCanvas(clear) {
        var totalCount, maxCount, graphTimeScale, ti, time, counts, total, ctx,
            gTip, pidx, canvasJQ, idx, rCount, showTime, minDiff, tDisplay, tDate, hours, mins, suffix, tText, currentType,
            hrsFrac, gOff, height, count, i, width, hOff, xP,
            canvas = document.getElementById('c-timeline');
        if (canvas.getContext) {
            totalCount = 0;
            maxCount = 3;
            graphTimeScale = 60 * 60 * (gHours - 0.1);
            if (gHours === 0) {
                if (pastReviews) {
                    for (ti = 0; ti < 3; ++ti) {
                        totalCount += pastReviews[ti];
                    }
                    maxCount = totalCount;
                }
            } else {
                for (time = 0; time < times.length; time++) {
                    if (time * 60 * tRes < graphTimeScale) {
                        counts = times[time];
                        if (counts) {
                            total = 0;
                            for (ti = 0; ti < 3; ++ti) {
                                total += counts[ti];
                            }
                            if (total > maxCount) {
                                maxCount = total;
                            }
                            totalCount += total;
                        }
                    }
                }
            }
            if (totalCount === 0) {
                maxCount = 0;
            }
            $('#g-timereviews').text(totalCount);
            tFrac = tRes * (page_width - xOff) / 60 / gHours;
            ctx = canvas.getContext("2d");
            if (clear) {
                ctx.clearRect(0, 0, page_width, graphH);
                page_width = $('.span12 header').width();
            } else {
                gTip = $('#graph-tip');
                canvasJQ = $('#c-timeline');
                canvas.addEventListener('mousemove', function (event) {
                    if (gHours === 0) {
                        return;
                    }
                    //~ idx = Math.floor((event.offsetX - xOff) / tFrac) + 1;
                    idx = Math.floor(((event.pageX - canvasJQ.offset().left) - xOff) / tFrac) + 1;
                    if (idx !== pidx) {
                        counts = times[idx];
                        if (counts) {
                            gTip.show();
                            rCount = counts[0] + counts[1] + counts[2];
                            showTime = counts[4] * 1000;
                            minDiff = (showTime - new Date().getTime()) / 1000 / 60;
                            if (minDiff < 0) {
                                tDisplay = fuzzyMins(-minDiff) + ' ago';
                            } else if (minDiff < 90 && options['rel_near_time']==true) {
                                tDisplay = fuzzyMins(minDiff);
                            } else {
                                tDate = new Date(showTime);
                                hours = tDate.getHours();
                                mins = tDate.getMinutes();
                                suffix = '';
                                if (options['12_hours_i']) {
                                    suffix = ' ' + (hours < 12 ? 'am' : 'pm');
                                    hours %= 12;
                                    if (hours === 0) {
                                        hours = 12;
                                    }
                                }
                                if (hours < 10 && options['zeropad_hours']==true) {
                                    hours = '0' + hours;
                                }
                                if (mins < 10) {
                                    mins = '0' + mins;
                                }
                                tDisplay = hours + ':' + mins + suffix;
                                if (new Date().getDate() == tDate.getDate()) {
                                	tDisplay = 'Today ' + tDisplay;
                                } else {
                                    tDisplay = 'SunMonTueWedThuFriSat'.substr(tDate.getDay()*3, 3) + ' ' + tDisplay;
                                }
                                if (minDiff < 90) tDisplay += ' (' + fuzzyMins(minDiff) + ')';
                            }
                            tText = tDisplay + '<div class="total">' + pluralize('review', rCount) + '</div>';
                            tText += '<div class="radical">' + pluralize('radical', counts[0]) + '</div>';
                            tText += '<div class="kanji">' + counts[1] + ' kanji</div>';
                            tText += '<div class="vocab">' + counts[2] + ' vocabulary</div>';
                            currentType = counts[3];
                            if (currentType) {
                                tText += '<div class="flags">' + (currentType === -1 ? 'current level' : 'burning') + '</div>';
                            }
                            gTip.html(tText);
                            gTip.css({
                                left: canvasJQ.position().left + idx * tFrac + xOff,
                                top: event.pageY - gTip.height() - 6
                            });
                        } else {
                            gTip.hide();
                        }
                        pidx = idx;
                    } else {
                        gTip.css('top', event.pageY - gTip.height() - 6);
                    }
                }, false);
                canvasJQ.mouseleave(function (event) {
                    gTip.hide();
                    pidx = null;
                });
            }
            canvas.width = page_width;
            hrsFrac = gHours / 3;
            ctx.lineWidth = tFrac / 20;
            ctx.strokeStyle = "#ffffff";
            ctx.textBaseline = 'top';
            ctx.textAlign = 'right';
            ctx.font = '12px sans-serif';
            ctx.fillStyle = '#e4e4e4';
            if (gHours !== 0) {
                ctx.fillRect(0, Math.floor((vOff + graphH) * 0.5), page_width, 1);
            }
            ctx.fillRect(0, vOff - 1, page_width, 1);
            ctx.fillStyle = '#d4d4d4';
            ctx.fillRect(0, graphH, page_width, 1);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, graphH + 1, page_width, 1);
            ctx.fillStyle = '#505050';
            ctx.textAlign = 'right';
            ctx.fillText(maxCount, xOff - 4, vOff + 1);
            ctx.fillStyle = '#d4d4d4';
            ctx.fillRect(xOff - 2, 0, 1, graphH);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(xOff - 1, 0, 1, graphH);
            if (gHours === 0) {
                if (pastReviews) {
                    gOff = xOff;
                    height = graphH - vOff;
                    for (ti = 0; ti < 3; ++ti) {
                        count = pastReviews[ti];
                        if (count > 0) {
                            width = Math.ceil(count / maxCount * (page_width - xOff));
                            drawBarRect(ctx, gOff, vOff, width, height, api_colors[ti]);
                            gOff += width;
                        }
                    }
                }
            } else {
                for (i = 1; i < 4; ++i) {
                    xP = Math.floor(i / 3 * (page_width - 2));
                    if (i === 3) {
                        xP += 1;
                    } else if (page_width > 1100) {
                        --xP;
                    }
                    ctx.fillStyle = '#e4e4e4';
                    ctx.fillRect(xP, 0, 1, graphH);
                    ctx.fillStyle = '#505050';
                    ctx.fillText(String(hrsFrac * i), xP - 2, 0);
                }
                for (time = 0; time < times.length; time++) {
                    counts = times[time];
                    if (counts) {
                        hOff = 0;
                        currentType = counts[3];
                        if (currentType) {
                            if (options['current_burn_arrows']==true) {
		                        drawArrow(ctx, time - 1, 'rgba(' + (currentType === -1 ? '255, 255, 255' : '0, 0, 0') + ', 1)', tFrac);
                            }
                            drawBar(ctx, time - 1, graphH - vOff, 0, 'rgba(' + (currentType === -1 ? '255, 255, 255, 1' : '0, 0, 0, 0.33') + ')', tFrac);
                        }
                        for (ti = 0; ti < 3; ++ti) {
                            count = counts[ti];
                            if (count > 0) {
                                height = Math.ceil(count / maxCount * (graphH - vOff));
                                drawBar(ctx, time - 1, height, hOff, api_colors[ti], tFrac);
                                hOff += height;
                            }
                        }
                    }
                }
            }
        }
    }
    function initCanvas() {
        var reviewHours = Math.ceil(firstReview / 60 / 60 / 6) * 6;
        if (reviewHours > gHours) {
            gHours = reviewHours;
            $('#g-timeframe').text(gHours);
        }
        if (firstReview > 3 * 60 * 60) {
            $('#g-range').attr('min', reviewHours);
        }
        $('#r-timeline').show();
        $('section.review-status').css('border-top', '1px solid #fff');
        drawCanvas();
    }
    // Load data
    function addData(data) {
        var itemIdx, response, myLevel, firstItem, typeIdx, maxSeconds, item, stats, availableAt, tDiff, timeIdx, timeTable;
        response = data.requested_information;
        if (response) {
            if (response.general) {
                response = response.general;
            }
            myLevel = data.user_information.level;
            firstItem = response[0];
            typeIdx = firstItem.kana ? 2 : firstItem.important_reading ? 1 : 0;
            maxSeconds = 60 * 60 * max_hours;
            for (itemIdx = 0; itemIdx < response.length; itemIdx++) {
                item = response[itemIdx];
                stats = item.user_specific;
                if (stats && !stats.burned) {
                    availableAt = stats.available_date;
                    tDiff = availableAt - start_time;
                    if (tDiff < maxSeconds) {
                        if (tDiff < firstReview) {
                            firstReview = tDiff;
                        }
                        timeIdx = tDiff < 1 ? -1 : Math.round(tDiff / 60 / tRes) + 1;
                        if (tDiff < 0) {
                            if (!pastReviews) {
                                pastReviews = [0, 0, 0, 0, availableAt];
                            }
                            timeTable = pastReviews;
                        } else {
                            timeTable = times[timeIdx];
                        }
                        if (!timeTable) {
                            times[timeIdx] = [0, 0, 0, 0, availableAt];
                            timeTable = times[timeIdx];
                        } else if (availableAt < timeTable[4]) {
                            timeTable[4] = availableAt;
                        }
                        ++timeTable[typeIdx]; // add item to r0/k1/v2 bin
                        if (timeTable[3] !== -1) { // change to give current level priority
                            if (typeIdx < 2 && item.level === myLevel && stats.srs === 'apprentice') {
                                timeTable[3] = -1;
                            } else if (stats.srs === 'enlighten') {
                                timeTable[3] = -2;
                            }
                        }
                    }
                }
            }
            if (++counted === api_calls.length && times && times.length > 0) {
                localStorage.setItem('reviewCache', JSON.stringify(times));
                localStorage.setItem('pastCache', JSON.stringify(pastReviews));
                localStorage.setItem('cacheExpiration', curr_date.getTime());
                initCanvas();
            }
        }
    }
    function insertTimeline() {
        var apiKey, cacheExpires, ext, idx, counts;
        apiKey = localStorage.getItem('apiKey');
        if (apiKey && apiKey.length === 32) {
            $('section.review-status').before('<section id="r-timeline" style="display: none;"><h4>Reviews Timeline</h4><a class="help">?</a><form id="graph-form"><label><span id="g-timereviews"></span> reviews <span id="g-timeframe">in ' + gHours + ' hours</span> <input id="g-range" type="range" min="0" max="' + max_hours + '" value="' + gHours + '" step="6" name="g-ranged"></label></form><div id="graph-tip" style="display: none;"></div><canvas id="c-timeline" height="' + graphH+10 + '"></canvas></section>');
            try {
                times = JSON.parse(localStorage.getItem('reviewCache'));
                pastReviews = JSON.parse(localStorage.getItem('pastCache'));
            } catch (ignore) {}
            if (times && pastReviews) {
                cacheExpires = localStorage.getItem('cacheExpiration');
                if (cacheExpires && curr_date - cacheExpires > 60 * 60 * 1000) {
                    times = null;
                }
            }
            if (!times || !pastReviews || times.length === 0) {
                times = null;
                pastReviews = null;
                localStorage.setItem('reviewCache', null);
                localStorage.setItem('pastCache', null);
                times = [];
                firstReview = Number.MAX_VALUE;
                for (ext = 0; ext < api_calls.length; ext++) {
                    $.ajax({
                        type: 'get',
                        url: '/api/v1.2/user/' + apiKey + '/' + api_calls[ext],
                        success: addData
                    });
                }
            } else {
                for (idx = 0; idx < times.length; idx++) {
                    counts = times[idx];
                    if (counts) {
                        firstReview = counts[4] - start_time;
                        break;
                    }
                }
                setTimeout(initCanvas, 0);
            }
            $('a.help').click(function () {
                alert('Reviews Timeline - Displays your upcoming reviews\nY-axis: Number of reviews\nX-axis: Time (scale set by the slider)\n\nThe number in the upper left shows the maximum number of reviews in a single bar. White-backed bars indicate that review group contains radicals/kanji necessary for advancing your current level.');
            });
            $('#g-range').change(function () {
                gHours = $(this).val();
                if (gHours < 6) {
                    gHours = pastReviews ? 0 : 3;
                }
                $('#g-timeframe').text(gHours === 0 ? 'right now' : 'in ' + gHours + ' hours');
                drawCanvas(true);
            });
        } else {
            alert('Hang on! We\'re grabbing your API key for the Reviews Timeline. We should only need to do this once.');
            document.location.pathname = '/settings/account';
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
    styleCss = '\n' +
        '#graph-tip {\n' +
        '    padding: 4px 8px 8px 8px;\n' +
        '    position: absolute;\n' +
        '    color: #eeeeee;\n' +
        '    background-color: rgba(0,0,0,0.5);\n' +
        '    border-radius: 4px;\n' +
        '    pointer-events: none;\n' +
        '    font-weight: bold;\n' +
        '}\n' +
        '#graph-tip div {padding:0px 8px; font-family:"Open Sans","Helvetica Neue",Helvetica,Arial,sans-serif; font-size:13px;}\n' +
        '#graph-tip .total {color:#000000; background-color:#efefef; background-image:linear-gradient(to bottom, #efefef, #cfcfcf);}\n' +
        '#graph-tip .radical {padding-left:16px; background-color:#0096e7; background-image:linear-gradient(to bottom, #0af, #0093dd);}\n' +
        '#graph-tip .kanji {padding-left:16px; background-color:#ee00a1; background-image:linear-gradient(to bottom, #f0a, #dd0093);}\n' +
        '#graph-tip .vocab {padding-left:16px; background-color:#9800e8; background-image:linear-gradient(to bottom, #a0f, #9300dd);}\n' +
        '#graph-tip .flags {margin-top:8px; text-align:center; font-style:italic; color:#000000; background-color:#ffff88; background-image:linear-gradient(to bottom, #ffffaa, #eeee77);}\n' +
        'section#r-timeline {\n' +
        '    overflow: hidden;\n' +
        '    margin-bottom: 0px;\n' +
        '    border-bottom: 1px solid #d4d4d4;\n' +
        '    height: 125px;\n' +
        '    padding-bottom: 15px;\n' +
        '}\n' +
        'form#graph-form {\n' +
        '    float: right;\n' +
        '    margin-bottom: 0px;\n' +
        '    min-width: 50%;\n' +
        '    text-align: right;\n' +
        '}\n' +
        'section#r-timeline h4 {\n' +
        '    clear: none;\n' +
        '    float: left;\n' +
        '    height: 20px;\n' +
        '    margin-top: 0px;\n' +
        '    margin-bottom: 4px;\n' +
        '    font-weight: normal;\n' +
        '    margin-right: 12px;\n' +
        '}\n' +
        'a.help {\n' +
        '    font-weight: bold;\n' +
        '    color: rgba(0, 0, 0, 0.1);\n' +
        '    font-size: 1.2em;\n' +
        '    line-height: 0px;\n' +
        '}\n' +
        'a.help:hover {\n' +
        '    text-decoration: none;\n' +
        '    cursor: help;\n' +
        '    color: rgba(0, 0, 0, 0.5);\n' +
        '}\n' +
        '@media (max-width: 767px) {\n' +
        '    section#r-timeline h4 {\n' +
        '        display: none;\n' +
        '    }\n' +
        '}\n' +
        '.dashboard section.review-status ul li time {\n' +
        '    white-space: nowrap;\n' +
        '    overflow-x: hidden;\n' +
        '    height: 1.5em;\n' +
        '    margin-bottom: 0;\n' +
        '}\n';
    if (document.location.pathname === "/settings/account") {
        (function () {
            var apiKey, alreadySaved;
            apiKey = $('#user_api_key').attr('value');
            if (apiKey) {
                alreadySaved = localStorage.getItem('apiKey');
                localStorage.setItem('apiKey', apiKey);
                if (!alreadySaved) {
                    document.location.pathname = '/dashboard';
                }
            }
        }());
    } else {
        page_width = $('.span12 header').width();
        if (page_width) {
            tRes = Math.round(1 / (page_width / 1170 / 15));
            insertTimeline();
        }
        addStyle(styleCss);
    }
}());
