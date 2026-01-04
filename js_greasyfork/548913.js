// ==UserScript==
// @name         Tenhou4 Score Pane + Korean translations
// @namespace    https://example.local/
// @version      1.2.5
// @description  Tenhou score pane with safe Korean translation of yaku/text (Tampermonkey userscript) — spacing & full-score fix
// @author       ChatGPT
// @match        *://tenhou.net/0*
// @match        *://tenhou.net/4*
// @match        *://ron2.jp/3*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.min.js
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/548913/Tenhou4%20Score%20Pane%20%2B%20Korean%20translations.user.js
// @updateURL https://update.greasyfork.org/scripts/548913/Tenhou4%20Score%20Pane%20%2B%20Korean%20translations.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const SCORE_SHOW_DELAY_BASE = 20;       // 기본 지연(ms). 0이면 즉시 표시
    const SCORE_SHOW_DELAY_PER_YAKU = 20;  // 역 한 개당 추가 지연(ms). 0이면 즉시 표시

    /*************************************************************************
     * TRANSLATIONS
     * - 일본어 원문 => 한글 대응을 여기에 추가/수정하세요.
     * - 사이트가 출력하는 정확한 문자열(공백/기호 포함)을 복사해서 키로 넣어야 합니다.
     * - 길이가 긴 키가 우선 치환됩니다.
     **************************************************************************/
    const TRANSLATIONS = {
        "立直": "리치",
        "立直(リーチ)": "리치",
        "ダブル立直": "더블리치",
        "一發": "일발",
        "槍槓": "창깡",
        "嶺上開花": "영상개화",
        "海底撈月": "해저로월",
        "河底撈魚": "하저로어",
        "門前清自摸和": "멘젠쯔모",
        "平和": "핑후",
        "斷么九": "탕야오",
        "一盃口": "이페코",
        "二盃口": "랑페코",
        "七對子": "치또이츠",
        "役牌 白": "역패 백",
        "役牌 發": "역패 발",
        "役牌 中": "역패 중",
        "役牌 自風牌": "역패 자풍패",
        "自風 北": "자풍 북",
        "自風 南": "자풍 남",
        "自風 西": "자풍 서",
        "自風 東": "자풍 동",
        "役牌 場風牌": "역패 장풍패",
        "場風 北": "자풍 북",
        "場風 南": "자풍 남",
        "場風 西": "자풍 서",
        "場風 東": "자풍 동",
        "断么九": "탕야오",
        "混全帯么九": "찬타",
        "混全帶么九": "찬타",
        "混全帶么9": "찬타",
        "混全帯么9": "찬타",
        "一気通貫": "일기통관",
        "三色同順": "삼색동순",
        "三色同刻": "삼색동각",
        "三槓子": "산깡쯔",
        "対々和": "또이또이",
        "三暗刻": "삼암각",
        "小三元": "소삼원",
        "混老頭": "혼노두",
        "純全帯么九": "준찬타",
        "混一色": "혼일색",
        "清一色": "청일색",
        "ドラ": "도라",
        "裏ドラ": "뒷도라",
        "赤ドラ": "아카도라",
        "1氣通貫": "일기통관",
        "一氣通貫": "일기통관",
        /****************************************/
        // 일반 표기
        "満貫": "만관",
        "跳満": "하네만",
        "倍満": "배만",
        "三倍満": "삼배만",
        "数え役満": "헤아림 역만",
        "役満": "역만",

        "符": "부",
        "飜": "판",
        "点": "점",
        "流局": "유국",
        "流局(九種九牌)": "(유국)9종9패",

        "ロン": "론",
        "ツモ": "쯔모",

        "東": "동",
        "南": "남",
        "西": "서",
        "北": "북",
        // 숫자/기본 문자열 예시
        "Hand ": "패 ",
        "Draw": "유국"
    };

    function escapeRegExp(s) {
        return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    function translateString(s) {
        if (!s || typeof s !== 'string') return s;
        const keys = Object.keys(TRANSLATIONS).sort((a, b) => b.length - a.length);
        for (let k of keys) {
            try {
                const re = new RegExp(escapeRegExp(k), 'g');
                s = s.replace(re, TRANSLATIONS[k]);
            } catch (e) {}
        }
        return s;
    }
    function translateHtml(html) {
        if (!html || typeof html !== 'string') return html;
        const container = document.createElement('div');
        container.innerHTML = html;
        const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null, false);
        let node = walker.nextNode();
        while (node) {
            node.nodeValue = translateString(node.nodeValue);
            node = walker.nextNode();
        }
        return container.innerHTML;
    }

    // --- CSS injection (간격 최소화) ---
    const css = `#azpspane {
    position: absolute;
    top: 10px;
    height: 95%;
    right: 0;
    border: 1px solid #444;
    font-family: Arial, sans-serif;
    font-size: 0.9em;
}
#azpspane > div.hands {
    overflow-y: scroll;
    padding: 4px 12px;
    position: absolute;
    bottom: 0;
    right: 0;
    top: 20px;
    left: 0;
    z-index:20;
}
#azpspane > canvas { position: absolute; top: 10px; padding: 0 12px; }
#azpspane > div.hands > div { border-bottom: 1px solid #444; padding: 0.2em 0; margin: 0; line-height: 1.1; }
#azpspane .hidden { display: none; }
#azpspane > div >  div:nth-child(2) { background-color: #111; }
#azpspane table { margin: 0.15em 0; padding: 0; border-collapse: collapse; }
#azpspane h2, #azpspane h3 { margin: 0.12em 0; padding: 0; font-weight: 600; }
#azpspane table td { padding: 0 0.15em; vertical-align: middle; }
.azpsscores td { text-align: right; }
.azpsscores td:nth-child(1), .azpsscores td:nth-child(2) { text-align: center; }
#azpspane canvas.tile-image { display: inline-block; vertical-align: top; max-height: 54px; margin-right: 6px; }
.azpsicons { font-family: icons2, sans-serif; }
.azpsplus { color: #8F8; }
.azpsminus { color: #F88; }
.azpsgrey { color: grey; font-size: 0.95em; }`;
    const styleEl = document.createElement('style');
    styleEl.textContent = css;
    document.head.appendChild(styleEl);

    // --- 기존 로직 (개선 포함) ---
    const $ = window.jQuery;
    let mutationObserver;
    let isT4;
    let isParlour;
    let isMultipleRon;
    let thisHandName = '';
    let previousHandName = 'y';
    let timeOfLastWin = 0;
    let handNum = 1;
    let playerName = null;
    let graphData = {};
    let allowNewHands = true;
    const paneID = 'azpspane';

    // 중복 처리 방지용 WeakSet
    let processedNodes = new WeakSet();

    function resetGraphData() {
        graphData = {
            data: {
                datasets: [{
                    borderColor: "#A00",
                    data: [ ],
                    fill: false,
                    label: 'A'
                }, {
                    borderColor: "#22F",
                    data: [ ],
                    fill: false,
                    label: 'B'
                }, {
                    borderColor: "#3F3",
                    data: [ ],
                    fill: false,
                    label: 'C'
                }, {
                    borderColor: "#FF3",
                    borderWidth: 6,
                    data: [ ],
                    fill: false,
                    label: 'D'
                }],
                labels: [0]
            },
            options: {
                elements: {
                    line: {
                        borderWidth: 3,
                        cubicInterpolationMode: 'monotone',
                        lineTension: 0,
                        spanGaps: true,
                        steppedLine: true
                    }
                },
                layout: { padding: { bottom: 0, left: 0, right: 10, top: 0 } },
                legend: { labels: { boxWidth: 20, fontColor: '#EEE' } },
                scales: {
                    xAxes: [{ ticks: { display: false } }],
                    yAxes: [{ ticks: { callback: function(value) { return '' + value/1000 + 'k'; } } }]
                },
                title: { display: true, padding: 0, position: 'bottom', text: 'ApplySci Tenhou Score Pane' }
            },
            type: 'line'
        };
    }

    function getGamePane() {
        if (isT4 === undefined) {
            isT4 = window.location.pathname.substring(0,2) === '/4';
        }
        if (isT4) return $('div.nosel:lt(2)');
        return $('div.nosel > div.nosel.tbl:first');
    }

    function setToObserve() {
        mutationObserver.observe(document.documentElement, { characterData: true, childList: true, subtree: true });
    }

    function setWidth() {
        let gamePane = getGamePane();
        $('#' + paneID).css({ 'width': Math.floor($('body').width() - gamePane.width() - 10) });
        moveMainPane();
    }

    function moveMainPane() {
        let gamePane = getGamePane();
        if (isT4) {
            gamePane.css('transform' ,'translateX(0)');
        } else {
            gamePane.css({'margin-left': 10, 'left':0}).next().css('left', 0);
            $.find('.tbc.ts0:not(.bblink)').forEach(function bringForward(el) { $(el).parent().css('z-index', 50); });
        }
    }

    function scorePaneInit() {
        allowNewHands = true;
        isParlour = false;
        $('#' + paneID)
            .append($('<button>').addClass('azpsreset').click(resetPane).text('reset score pane'))
            .append($('<div>').addClass('hands').append($('<h3>').text('The ApplySci Score Pane').attr('id', 'azps_start')));
    }

    function scorePane() {
        let pane = $('#' + paneID);
        let fontsize = isT4 ? '0.7em' : '0.4em';
        if (pane.length === 0) {
            pane = $('<div>').prop('id', paneID).css('fontSize', fontsize);
            $('body').append(pane);
            setWidth();
            scorePaneInit();
            resetBetweenGames();
        }
        if (!('data' in graphData)) resetGraphData();
        return pane;
    }

    function resetPane() {
        resetBetweenGames();
        scorePane().empty();
        scorePaneInit();
    }

    function rememberPlayerName(node) {
        if (playerName !== null) return;
        let players;
        if (isT4) {
            players = $('.bbg5', node);
            let me = players.eq(players.length - 1);
            if (players.length === 3 && graphData.data.datasets.length === 4) graphData.data.datasets.splice(2,1);
            if (me.length) playerName = me.children('span:eq(1)').text();
            for (let i=0; i < players.length; i++) {
                let name = players.eq(i).children('span:last').text();
                graphData.data.datasets[i].label = name;
            }
        } else {
            let player = $('#sc00', node);
            if (player.length) {
                if ($('#sc03', node).length === 0 && graphData.data.datasets.length === 4) graphData.data.datasets.splice(2,1);
                playerName = player.children('span:last').text();
                graphData.data.datasets[graphData.data.datasets.length - 1].label = decodeURIComponent(playerName);
                for (let i=1; i<4; i++) {
                    player = $('#sc0'+i, node);
                    if (player.length > 0) {
                        let name = player.children('span:last').text();
                        graphData.data.datasets[3 - i].label = name;
                    }
                }
            }
        }
    }

    function getHandName(node) {
        if (isT4) {
            try {
                let scoreTable = getT4ScoreTable(node);
                if (!scoreTable || scoreTable.length === 0) return false;
                let honbaString = scoreTable.find('td:first')[0].childNodes[1].nodeValue;
                if (honbaString === null) return false;
                let nHonba =  honbaString.trim();
                let hand = $('div.nosel > div.nopp > div.nopp > span.gray:first').eq(0).parent().find('span').slice(0,2).text();
                if (nHonba !== '0') hand += '-' + nHonba;
                handNum++;
                return hand;
            } catch (e) {
                return false;
            }
        } else {
            return 'Hand ' + handNum++;
        }
    }

    // safer showResult: 텍스트 노드만 번역 후 DOM 삽입
    function showResult(texts, handName, node, hide) {
        try {
            texts = translateHtml(String(texts));
        } catch (e) {
            console.error('translateHtml failed', e);
        }

        // handName이 주어졌고 같은 id가 이미 존재하면 중복 삽입하지 않음
        if (handName) {
            const id = 'azps_' + handName.replace(/ /g, '_');
            if (document.getElementById(id)) {
                const existing = document.getElementById(id).parentElement;
                if (existing) {
                    $('div.hands', scorePane()).prepend(existing);
                    return $(existing);
                }
            }
        }

        let newEl = $('<div>').html(texts);
        if (hide) newEl.addClass('hidden');
        $('div.hands', scorePane()).prepend(newEl).prop('scrollTop', 0);

        // only create tile-canvas if getHandImageT4 exists (avoid empty large canvas)
        if (node !== null) {
            if (isT4) {
                if (typeof window.getHandImageT4 === 'function') {
                    let tiles = document.createElement('canvas');
                    tiles.className = 'tile-image';
                    newEl.prepend(tiles);
                    try { window.getHandImageT4(node, tiles); } catch(e) {}
                }
            } else {
                // T3 image handling skipped
            }
        }

        newEl.prepend($('<h2>').text(handName || '').attr('id', 'azps_' + (handName ? handName.replace(/ /g, '_') : Math.random().toString(36).slice(2))));
        return newEl;
    }

    function getVal(node) { return node.nodeValue || node.innerText; }

    function appendNodes(fromDom) {
        let toString = '';
        fromDom.childNodes.forEach(function appendOneNode(node) { toString += getVal(node) + ' '; });
        // trim 연속 공백 및 줄바꿈 제거
        return toString.replace(/\s+/g, ' ').trim();
    }

    function riichiHonba(node) {
        try {
            return '<span class=azpsicons>' + $("tr:first td:first", node)[0].innerText + '</span>';
        } catch (e) {
            return '';
        }
    }

    // doubleZero: 원래대로 작은 '00' span 복구 — T4에서 240 + 00 => 24000 형태로 보이게 함
    const doubleZero = '<span style="font-size:85%;opacity:0.75;">00</span>';

    function chartOneScore(player, totalScore, score) {
        if (graphData.data.datasets[player].data.length === 0) graphData.data.datasets[player].data.push(totalScore);
        graphData.data.datasets[player].data.push(totalScore + parseFloat(score));
    }

    function checkParlour(node, nNodes) {
        let brCount = 0;
        for (let i=0; i < nNodes; i++) {
            if (node.childNodes[i].tagName !== undefined && node.childNodes[i].tagName.toUpperCase() === 'BR') brCount++;
        }
        return brCount > 1;
    }

    function deShuugify(txt) { return txt.replace( /^([-+0-9]+).*$/ , '$1🔴' ); }

    function getOneScore(node, player) {
        let nNodes = node.childNodes.length;
        if (nNodes === 0) return '';
        let isBystander, totalLine = '', totalScore, deltaScore, totalShuugi, deltaShuugi;
        isParlour = checkParlour(node, nNodes);
        [0, 2].forEach(function (idx) { totalLine += '<td>' + getVal(node.childNodes[idx]) + '</td>'; });
        totalLine += '<td>';
        if (isT4) {
            // 기존 로직 유지: tenhou T4는 점수를 '100단위'로 둬서 화면에는 '숫자 + 00'을 붙이는 방식 사용
            isBystander = (isParlour && nNodes === 7) || nNodes == 5;
            if (isParlour) {
                totalScore = parseFloat(getVal(node.childNodes[4])) / 100;
                totalShuugi = deShuugify(getVal(node.childNodes[isBystander ? 6 : 7]));
                totalLine += totalScore + doubleZero + '</td><td>' + totalShuugi;
                deltaScore = isBystander ? 0 : node.childNodes[5].innerHTML.slice(0, -2); // 마지막 '00' 제거
                deltaShuugi = isBystander || node.childNodes.length < 9 ? 0 : deShuugify(getVal(node.childNodes[8]));
            } else {
                totalScore = parseFloat(getVal(node.childNodes[4])) / 100;
                totalLine += totalScore + doubleZero;
                deltaScore = isBystander ? 0 : node.childNodes[5].innerHTML.slice(0, -2);
            }
        } else {
            isBystander = (isParlour && nNodes === 8) || nNodes == 6;
            if (isParlour) {
                totalScore = parseFloat(getVal(node.childNodes[4]));
                totalShuugi = deShuugify(getVal(node.childNodes[isBystander ? 7 : 9]));
                totalLine += totalScore + doubleZero + '</td><td>' + totalShuugi;
                deltaScore = isBystander ? 0 : getVal(node.childNodes[7].childNodes[0]);
                deltaShuugi = isBystander || node.childNodes.length < 11 ? 0 : deShuugify(getVal(node.childNodes[10]));
            } else {
                totalScore = parseFloat(getVal(node.childNodes[4]));
                totalLine += totalScore + doubleZero;
                deltaScore = isBystander ? 0 : getVal(node.childNodes[7].childNodes[0]);
            }
        }
        if (isBystander) {
            totalLine = '<tr>' + totalLine + '</td><td>' + (isParlour ? '</td><td>' : '');
        } else {
            totalLine =  '<tr class="' + (deltaScore > 0 ? 'azpsplus' : 'azpsminus') + '">' + totalLine + '<td>' + deltaScore + doubleZero;
            if (isParlour) totalLine += '</td><td>' + (deltaShuugi === 0 ? '' : deltaShuugi);
        }
        // chart expects raw point values (so multiply appropriately)
        // 기존 코드가 사용하던 방식 유지: graph receives 100*totalScore (so restoring doubleZero doesn't break graph)
        chartOneScore(player, 100*totalScore, 100*parseFloat(deltaScore || 0));
        return totalLine + '</td></tr>';
    }

    function scoreTableT3(node) {
        let totalLine = '<table class=azpsscores>';
        isMultipleRon = false;
        for (let i=0; i<4; i++) {
            let elem = $('#sc0' + i, node);
            if (elem.length) totalLine += getOneScore(elem[0], 3 - i);
        }
        return totalLine + '</table>';
    }

    function scoreTableT4(node) {
        let players = $('.bbg5', node);
        let table = '<table class=azpsscores>';
        isMultipleRon = thisHandName === previousHandName;
        for (let i=0; i < players.length; i++) table += getOneScore(players.eq(i)[0], i);
        return table + '</table>';
    }

    function getT4ScoreTable(node) {
        let t = $('table .bbg5', node).parents('table:first');
        if (!t || t.length === 0) {
            t = $('table', node).first();
        }
        return t;
    }

    function waitForYakuAndScore(node, callback, attempt) {
        attempt = typeof attempt === 'number' ? attempt : 0;
        const MAX_ATTEMPTS = 12;
        const INTERVAL_MS = 80;

        try {
            let yakuPresent = $(node).find('.yk, .ym, .hn').length > 0;
            let scoreTablePresent = getT4ScoreTable(node).length > 0;
            if (yakuPresent && scoreTablePresent) {
                callback();
                return;
            }
        } catch (e) {}

        if (attempt < MAX_ATTEMPTS) {
            setTimeout(function() { waitForYakuAndScore(node, callback, attempt + 1); }, INTERVAL_MS);
        } else {
            try { callback(); } catch (e) { console.error('final callback failed', e); }
        }
    }

    function showExhaustiveDraw(node) {
        scorePane();
        rememberPlayerName(node);
        let outcome, block = '<h3>Draw ';
        if (isT4) {
            outcome = $('table', node);
            let handName = getHandName(node);
            if (handName && !graphData.data.labels.includes(handName)) graphData.data.labels.push(handName);
            block += riichiHonba(getT4ScoreTable(node)) + '</h3>' + scoreTableT4(outcome);
            showResult(block, handName, null, false);
        } else {
            outcome = node.childNodes[0].childNodes[1];
            let handName = getHandName(node);
            if (handName && !graphData.data.labels.includes(handName)) graphData.data.labels.push(handName);
            block += riichiHonba(outcome) + '</h3>' + scoreTableT3(outcome);
            showResult(block, handName, null, false);
        }
    }

    function yakuLine(yaku, han) {
        let nHanElements = han && han.childNodes ? han.childNodes.length : 0;
        let hanString;
        if (nHanElements < 2) hanString = getVal(han);
        else hanString = (getVal(han.childNodes[0]).trimLeft ? getVal(han.childNodes[0]).trimLeft() : getVal(han.childNodes[0]).trim()) + ' ' + getVal(han.childNodes[1]);
        if (nHanElements > 2) hanString += ' ' + getVal(han.childNodes[2]) + '🔴';
        return '<tr' + ((hanString.length > 0 && hanString[0] === '0') ? ' class=azpsgrey' : '') + '><td>' + yaku + '</td><td>' + hanString + '</td></tr>';
    }

    function isLogReplay() { return false; }

    function insertWinTableIntoDOM(node, totalLine, nYaku) {
        // 결과 처리 시작 시 handAssignedForCurrentResult 같은 플래그는 이미 초기화되어 있다고 가정
        let handName = getHandName();
        if (handName !== false) {
            graphData.data.labels.push(handName);
            let scoreDiv = showResult(totalLine, handName, node, true);

            // 지연을 계산해서 보여줌
            const delay = Math.max(0, SCORE_SHOW_DELAY_BASE + (nYaku || 0) * SCORE_SHOW_DELAY_PER_YAKU);
            if (delay === 0) {
                scoreDiv.removeClass('hidden');
            } else {
                setTimeout(() => scoreDiv.removeClass('hidden'), delay);
            }
        }
    }

    function winTableT3(newNode) {
        let totalLine, nYaku;
        let now = Date.now();
        let node = newNode.children[0];
        if (now - timeOfLastWin < 20000 && !isLogReplay()) handNum--;
        timeOfLastWin = now;
        totalLine = appendNodes(node.children[0]) + '<br>' + riichiHonba(node.childNodes[2]);
        totalLine += '<table>';
        let yakuTable = $("tr:not(:has(table))", node.childNodes[1]);
        nYaku = yakuTable.length;
        yakuTable.each(function addYakuLine(row) { totalLine += yakuLine(getVal(this.childNodes[0]), this.childNodes[1]); });
        totalLine += '</table>';
        totalLine += scoreTableT3(node.childNodes[2]);
        insertWinTableIntoDOM(node, totalLine, nYaku);
    }

    function winTableT4(node) {
        if (processedNodes.has(node)) return;
        waitForYakuAndScore(node, function doWinTable() {
            if (processedNodes.has(node)) return;
            try {
                let scoreTable = getT4ScoreTable(node);
                let totalLine = '';
                try {
                    let s0div = $('div.s0 > div:eq(1)', node)[0];
                    if (s0div) totalLine = appendNodes(s0div) + '<br>' + riichiHonba(scoreTable);
                    else totalLine = riichiHonba(scoreTable);
                } catch (e) {
                    totalLine = riichiHonba(scoreTable);
                }

                totalLine += '<table>';
                let yakuNames = $('.yk', node);
                if (yakuNames.length === 0) yakuNames = $('.ym', node);
                let yakuHans  = $('.hn', node);
                let nYaku = yakuNames.length;
                for (let i = 0; i < nYaku; i++) {
                    try {
                        totalLine += yakuLine($(yakuNames[i]).text(), yakuHans[i]);
                    } catch (e) {}
                }
                totalLine += '</table>';
                totalLine += scoreTableT4(scoreTable);
                insertWinTableIntoDOM(node, totalLine, nYaku);
                processedNodes.add(node);
            } catch (e) {
                console.error('winTableT4 failed', e);
            }
        }, 0);
    }

    function handleWin(node) {
        if (processedNodes.has(node)) return;
        scorePane();
        rememberPlayerName(node);
        if (isT4) winTableT4(node); else winTableT3(node);
    }

    function hasWon() { console.log('winner, winner, chicken dinner'); }
    function resetBetweenGames() { playerName = null; handNum = 1; resetGraphData(); processedNodes = new WeakSet(); }

    function curryClickChart(chart, labels) {
        return function clickChart(evt){
            evt.stopPropagation(); evt.preventDefault();
            const activeXPoints = chart.getElementsAtXAxis(evt);
            if (!activeXPoints || !activeXPoints[0]) return false;
            let handNumber = activeXPoints[0]._index;
            let id;
            if (handNumber === 0) id = 'azps_start'; else id = 'azps_' + labels[handNumber].replace(/ /g, '_');
            let el = document.getElementById(id);
            if (el) el.scrollIntoView();
            return false;
        };
    }

    function scoreChart() {
        let pane = $('#'+paneID);
        if ($('canvas.chart', pane).length) return;
        let chartEl = $('<canvas>').addClass('chart');
        pane.prepend(chartEl);
        chartEl.height = Math.ceil(pane.width * 0.6);
        try { Chart.platform.disableCSSInjection = true; } catch(e) {}
        const chart = new Chart(chartEl[0], graphData);
        $('div.hands', pane).css('top', chartEl.offset().top + chartEl.outerHeight(true) + 20);
        chartEl.click(curryClickChart(chart, graphData.data.labels));
    }

    function checkWinner(node) {
        try {
            let winner;
            if (isT4) winner = $('.bbg5:first')[0].childNodes[0].nodeValue;
            else winner = $('table > tbody > tr > td:first', node)[0].childNodes[0].nodeValue;
            let isWinner = winner === playerName;
            if (isWinner && ($('div.tbc.bgb:contains(Exit)').length + $('button:contains(Exit)').length === 0)) hasWon();
        } catch (e) {}
    }

    function handleEnd(node) {
        scorePane();
        allowNewHands = false;
        scoreChart();
        resetBetweenGames();
        checkWinner(node);
    }

    function removePane() {
        $('#' + paneID).remove();
        let gamePane = getGamePane();
        if (isT4) {
            gamePane.css('transform' ,'translateX(' + Math.round(($('body').width() - gamePane.width())/2) + 'px)');
        } else {
            gamePane.css('margin', '0 auto');
        }
        resetBetweenGames();
        allowNewHands = true;
    }

    function showAbortiveDraw(node) { return showExhaustiveDraw(node); }

    function handleStart(node) {
        allowNewHands = true;
        if ($('#' + paneID + ' > div.hands > div').length > 0) return false;
        resetPane(); rememberPlayerName(node);
    }

    function stringStartsWith(haystack, needles) {
        let found = false;
        needles.some(function testOneNeedle(needle) {
            if (haystack.substr(0, needle.length) === needle) { found = true; return true; }
        });
        return found;
    }

    function checkNode(oneNode) {
        let testText = oneNode.innerText;
        if (typeof testText === 'undefined' || testText === null) return;
        if ($('#' + paneID).length && ( $('#pane1', oneNode).length || (isT4 && oneNode.className.includes('s0') && testText.includes('Online:')) )) {
            return removePane();
        }
        if (!allowNewHands) return;

        if (oneNode.className && oneNode.className.includes(isT4 ? 'nopp' : 'tbc') && testText.length > 10) {
            if (stringStartsWith(testText, ['Start', '對局', 'Début', 'Bắt đầu'])) return handleStart(oneNode);
            if (stringStartsWith(testText, ['終局','End', 'Fin', 'Koniec'])) return handleEnd(oneNode);
            if (stringStartsWith(testText, ['Redeal', '流局', 'Ryuukyoku', 'Rejouer', 'Ván hoà', 'Powtórka'])) return showExhaustiveDraw(oneNode);
        }

        try {
            if (oneNode.childNodes && oneNode.childNodes[0] && oneNode.childNodes[0].childNodes && oneNode.childNodes[0].childNodes[0] && oneNode.childNodes[0].childNodes[0].id === 'total') {
                return handleWin(oneNode);
            }
        } catch (e) {}

        try {
            if (isT4) {
                if ($(oneNode).find('.yk, .ym, .hn').length > 0 || $(oneNode).find('.bbg5').length > 0) {
                    return handleWin(oneNode);
                }
                if (oneNode.className && oneNode.className.includes('nopp') && testText.length > 20) {
                    return handleWin(oneNode);
                }
            } else {
                if (oneNode.className === 'tbc' && $('button', oneNode).length && $('table', oneNode).length === 1 && $('#sc00', oneNode).length && testText.includes('') && testText.includes('')) {
                    if (stringStartsWith(testText, ['觀戰', 'Redeal: ', 'Torpillage: ', 'Ván hoà: ', 'Powtórka (', 'Kyuushu kyuuhai', 'Kyūshu kyūhai', 'Suukaikan', 'Sūkaikan', 'Suufon renda', 'Sūfon renda', 'Sanchahou', 'Sanchahō', 'Suucha riichi', 'Sūcha riichi'])) {
                        return showAbortiveDraw(oneNode);
                    }
                }
            }
        } catch (e) {}
    }

    function onMutate(mutations) {
        mutationObserver.disconnect();
        mutations.forEach(function doAMutation(oneMutation) {
            if (oneMutation.addedNodes && oneMutation.addedNodes.length) {
                oneMutation.addedNodes.forEach(function do1node(node) {
                    try { if (node.childNodes && node.childNodes.length) checkNode(node); } catch (e) { console.log(e); }
                });
            }
            if (oneMutation.type === 'characterData' && oneMutation.target && oneMutation.target.parentNode) {
                try { checkNode(oneMutation.target.parentNode); } catch (e) {}
            }
        });
        setToObserve();
    }

    // init
    (function init() {
        try { Chart.platform.disableCSSInjection = true; } catch (e) {}
        getGamePane();
        mutationObserver = new MutationObserver(onMutate);
        setToObserve();
        let timeout;
        $(window).on('resize', function() {
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(setWidth, 1000);
        });
    }());

})();
