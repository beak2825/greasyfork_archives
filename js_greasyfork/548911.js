// ==UserScript==
// @name         Tenhou3 Score Pane + Korean translations
// @namespace    https://example.local/
// @version      1.2.5
// @description  Tenhou score pane with safe Korean translation of yaku/text (Tampermonkey userscript) — hand 증가 문제 보정 적용
// @author       ChatGPT
// @match        *://tenhou.net/0*
// @match        *://tenhou.net/3*
// @match        *://ron2.jp/3*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.min.js
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/548911/Tenhou3%20Score%20Pane%20%2B%20Korean%20translations.user.js
// @updateURL https://update.greasyfork.org/scripts/548911/Tenhou3%20Score%20Pane%20%2B%20Korean%20translations.meta.js
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

        "滿貫": "만관",
        "跳滿": "하네만",
        "倍滿": "배만",
        "三倍滿": "삼배만",
        "数え役滿": "헤아림 역만",
        "役滿": "역만",

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
        // 필요한 항목 더 추가...
    };

    // ---- 안전한 번역 유틸 (텍스트 노드만 교체, 태그는 보존) ----
    function escapeRegExp(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
    function translateString(s) {
        if (!s || typeof s !== 'string') return s;
        const keys = Object.keys(TRANSLATIONS).sort((a,b) => b.length - a.length);
        for (let k of keys) {
            try { s = s.replace(new RegExp(escapeRegExp(k), 'g'), TRANSLATIONS[k]); } catch(e) {}
        }
        return s;
    }
    function translateHtml(html) {
        if (!html || typeof html !== 'string') return html;
        const container = document.createElement('div');
        container.innerHTML = html;
        const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null, false);
        let node = walker.nextNode();
        while (node) { node.nodeValue = translateString(node.nodeValue); node = walker.nextNode(); }
        return container.innerHTML;
    }

    // --- CSS ---
    const css = `#azpspane { position: absolute; top: 10px; height: 95%; right: 0; border: 1px solid #444; }
#azpspane > div.hands { overflow-y: scroll; padding: 0 20px; position: absolute; bottom: 0; right: 0; top: 20px; left: 0; z-index:20; }
#azpspane > canvas { position: absolute; top: 10px; padding: 0 20px; }
#azpspane > div.hands > div { border-bottom: 1px solid #AAA; padding-bottom: 1em; }
#azpspane .hidden { display: none; }
#azpspane > div >  div:nth-child(2) { background-color: #111; }
#azpspane table { margin-top: 0.5em; padding-top: 0.5em; border-collapse: collapse; }
#azpspane tr:nth-child(2n+0) { background-color: #111; }
#azpspane tr:nth-child(2n+1) { background-color: #000; }
#azpspane table td { padding: 0 0.2em; }
.azpsscores td { text-align: right; }
.azpsscores td:nth-child(1), .azpsscores td:nth-child(2) { text-align: center; }
#azpspane canvas { width: 100%; }
#azpspane .chart { backgroundColor: #111; }
#azpspane button.azpsreset { position: fixed; top: 0; margin: 2px; font-size: 12px; }
#azpspane button.azpsreset:hover { background-color: red; color: white; }
.azpsgrey { color: grey; }
.azpsicons { font-family: icons2, sans-serif; }
.azpsplus { color: #8F8; }
.azpsminus { color: #F88; }`;

    const styleEl = document.createElement('style');
    styleEl.textContent = css;
    document.head.appendChild(styleEl);

    // --- 기존 로직 포팅 ---
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

    // 새로운 플래그: 현재 처리중인 '결과'에 대해 핸드가 이미 할당됐는지 표시
    let handAssignedForCurrentResult = false;
    let lastAssignedHandName = null;

    function resetGraphData() {
        graphData = {
            data: {
                datasets: [{
                    borderColor: "#A00", data: [], fill: false, label: 'A'
                }, {
                    borderColor: "#22F", data: [], fill: false, label: 'B'
                }, {
                    borderColor: "#3F3", data: [], fill: false, label: 'C'
                }, {
                    borderColor: "#FF3", borderWidth: 6, data: [], fill: false, label: 'D'
                }],
                labels: [0]
            },
            options: {
                elements: { line: { borderWidth: 3, cubicInterpolationMode: 'monotone', lineTension:0, spanGaps:true, steppedLine:true }},
                layout: { padding: { bottom:0, left:0, right:10, top:0 }},
                legend: { labels: { boxWidth:20, fontColor:'#EEE' }},
                scales: { xAxes:[{ ticks:{ display:false }}], yAxes:[{ ticks:{ callback: function(value){ return '' + value/1000 + 'k'; }}}]},
                title: { display:true, padding:0, position:'bottom', text:'ApplySci Tenhou Score Pane' }
            },
            type: 'line'
        };
    }

    function getGamePane() {
        if (isT4 === undefined) isT4 = window.location.pathname.substring(0,2) === '/4';
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
        if (isT4) gamePane.css('transform' ,'translateX(0)');
        else {
            gamePane.css({'margin-left':10,'left':0}).next().css('left',0);
            $.find('.tbc.ts0:not(.bblink)').forEach(function(el){ $(el).parent().css('z-index',50); });
        }
    }

    function scorePaneInit() {
        allowNewHands = true;
        isParlour = false;
        $('#' + paneID)
            .append($('<button>').addClass('azpsreset').click(resetPane).text('reset score pane'))
            .append($('<div>').addClass('hands').append($('<h3>').text('The ApplySci Score Pane').attr('id','azps_start')));
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
        if (isT4) {
            const players = $('.bbg5', node);
            const me = players.eq(players.length - 1);
            if (players.length === 3 && graphData.data.datasets.length === 4) graphData.data.datasets.splice(2,1);
            if (me.length) playerName = me.children('span:eq(1)').text();
            for (let i=0;i<players.length;i++) graphData.data.datasets[i].label = players.eq(i).children('span:last').text();
        } else {
            let player = $('#sc00', node);
            if (player.length) {
                if ($('#sc03', node).length === 0 && graphData.data.datasets.length === 4) graphData.data.datasets.splice(2,1);
                playerName = player.children('span:last').text();
                graphData.data.datasets[graphData.data.datasets.length - 1].label = decodeURIComponent(playerName);
                for (let i=1;i<4;i++) {
                    player = $('#sc0'+i, node);
                    if (player.length > 0) graphData.data.datasets[3-i].label = player.children('span:last').text();
                }
            }
        }
    }

    // ---------- 변경된 부분: getHandName (한 결과당 1회만 증가) ----------
    function getHandName(/* optional node */) {
        // 이미 이 '결과 처리 흐름'에서 핸드 할당이 됐으면 같은 이름 반환
        if (handAssignedForCurrentResult && lastAssignedHandName) {
            previousHandName = thisHandName;
            thisHandName = lastAssignedHandName;
            return lastAssignedHandName;
        }
        // 새 결과로 간주 -> 증가시키고 플래그 설정
        previousHandName = thisHandName;
        const handName = 'Hand ' + (handNum++);
        thisHandName = handName;
        lastAssignedHandName = handName;
        handAssignedForCurrentResult = true;
        return handName;
    }
    // ---------------------------------------------------------------------

    // safer showResult: 텍스트 노드만 번역 후 DOM 삽입
    function showResult(texts, handName, node, hide) {
        try { texts = translateHtml(String(texts)); } catch(e){ console.error('translateHtml failed', e); }
        let newEl = $('<div>').html(texts);
        if (hide) newEl.addClass('hidden');
        $('div.hands', scorePane()).prepend(newEl).prop('scrollTop',0);
        if (node !== null) {
            if (isT4) {
                let tiles = document.createElement('canvas');
                newEl.prepend(tiles);
                if (typeof getHandImageT4 === 'function') getHandImageT4(node, tiles);
            } else {
                // T3 image handling skipped
            }
        }
        newEl.prepend($('<h2>').text(handName).attr('id', 'azps_' + handName.replace(' ', '_')));
        return newEl;
    }

    function getVal(node) { return node.nodeValue || node.innerText; }

    function appendNodes(fromDom) {
        let toString = '';
        fromDom.childNodes.forEach(function(node){ toString += getVal(node) + ' '; });
        return toString;
    }

    function riichiHonba(node) {
        return '<span class=azpsicons>' + $("tr:first td:first", node)[0].innerText + '</span>';
    }

    function chartOneScore(player, totalScore, score) {
        if (graphData.data.datasets[player].data.length === 0) graphData.data.datasets[player].data.push(totalScore);
        graphData.data.datasets[player].data.push(totalScore + parseFloat(score));
    }

    function checkParlour(node, nNodes) {
        let brCount = 0;
        for (let i=0;i<nNodes;i++) if (node.childNodes[i].tagName !== undefined && node.childNodes[i].tagName.toUpperCase() === 'BR') brCount++;
        return brCount > 1;
    }

    function deShuugify(txt) { return txt.replace(/^([-+0-9]+).*$/,'$1🔴'); }
    const doubleZero = '<span style="font-size:85%;opacity:0.75;">00</span>';

    function getOneScore(node, player) {
        let nNodes = node.childNodes.length;
        if (nNodes === 0) return '';
        let isBystander, totalLine = '', totalScore, deltaScore, totalShuugi, deltaShuugi;
        isParlour = checkParlour(node, nNodes);
        [0,2].forEach(function(idx){ totalLine += '<td>' + getVal(node.childNodes[idx]) + '</td>'; });
        totalLine += '<td>';
        if (isT4) {
            isBystander = (isParlour && nNodes === 7) || nNodes == 5;
            if (isParlour) {
                totalScore = parseFloat(getVal(node.childNodes[4]))/100;
                totalShuugi = deShuugify(getVal(node.childNodes[isBystander ? 6 : 7]));
                totalLine += totalScore + doubleZero + '</td><td>' + totalShuugi;
                deltaScore = isBystander ? 0 : node.childNodes[5].innerHTML.slice(0,-2);
                deltaShuugi = isBystander || node.childNodes.length < 9 ? 0 : deShuugify(getVal(node.childNodes[8]));
            } else {
                totalScore = parseFloat(getVal(node.childNodes[4]))/100;
                totalLine += totalScore + doubleZero;
                deltaScore = isBystander ? 0 : node.childNodes[5].innerHTML.slice(0,-2);
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
        chartOneScore(player, 100*totalScore, 100*parseFloat(deltaScore));
        return totalLine + '</td></tr>';
    }

    function scoreTableT3(node) {
        let totalLine = '<table class=azpsscores>';
        isMultipleRon = false;
        for (let i=0;i<4;i++){
            let elem = $('#sc0' + i, node);
            if (elem.length) totalLine += getOneScore(elem[0], 3 - i);
        }
        return totalLine + '</table>';
    }

    function scoreTableT4(node) {
        let players = $('.bbg5', node);
        let table = '<table class=azpsscores>';
        isMultipleRon = thisHandName === previousHandName;
        for (let i=0;i<players.length;i++) table += getOneScore(players.eq(i)[0], i);
        return table + '</table>';
    }

    function getT4ScoreTable(node) { return $('table .bbg5', node).parents('table:first'); }

    // 유국(무승부) 결과 처리: 핸드 플래그 초기화 후 getHandName 호출
    function showExhaustiveDraw(node) {
        scorePane();
        rememberPlayerName(node);
        // 시작마다 '이번 결과' 플래그 초기화 -> getHandName은 최초 호출 때만 증가시킴
        handAssignedForCurrentResult = false;
        lastAssignedHandName = null;

        let outcome;
        let block = '<h3>Draw ';
        if (isT4) {
            outcome = $('table', node);
            block += riichiHonba(getT4ScoreTable(node)) + '</h3>' + scoreTableT4(outcome);
        } else {
            outcome = node.childNodes[0].childNodes[1];
            block += riichiHonba(outcome) + '</h3>' + scoreTableT3(outcome);
        }
        let handName = getHandName();
        graphData.data.labels.push(handName);
        showResult(block, handName, null, false);
    }

    function yakuLine(yaku, han) {
        let nHanElements = han.childNodes === undefined ? 0 : han.childNodes.length;
        let hanString;
        if (nHanElements < 2) hanString = getVal(han);
        else hanString = getVal(han.childNodes[0]).trimLeft() + ' ' + getVal(han.childNodes[1]);
        if (nHanElements > 2) hanString += ' ' + getVal(han.childNodes[2]) + '🔴';
        return '<tr' + ((hanString.length > 0 && hanString[0] === '0') ? ' class=azpsgrey' : '') + '><td>' + yaku + '</td><td>' + hanString + '</td></tr>';
    }

    function isLogReplay() { return false; }



    // --- insertWinTableIntoDOM 함수 교체 ---
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
        let node = newNode.children[0];

        // 이전에 있던 handNum-- 보정 제거 (중복 방지는 handAssignedForCurrentResult로 처리함)
        timeOfLastWin = Date.now();

        totalLine = appendNodes(node.children[0]) + '<br>' + riichiHonba(node.childNodes[2]);
        totalLine += '<table>';
        let yakuTable = $("tr:not(:has(table))", node.childNodes[1]);
        nYaku = yakuTable.length;
        yakuTable.each(function(){ totalLine += yakuLine(getVal(this.childNodes[0]), this.childNodes[1]); });
        totalLine += '</table>';
        totalLine += scoreTableT3(node.childNodes[2]);
        insertWinTableIntoDOM(node, totalLine, nYaku);
    }

    function winTableT4(node) {
        let totalLine, nYaku;
        if ($('.yk,.ym', node).length === 0) return;

        // 결과 처리 시작 전 플래그 초기화(한 결과당 1회 증가 보장)
        handAssignedForCurrentResult = false;
        lastAssignedHandName = null;

        // 점수 테이블 가져오기
        let scoreTable = getT4ScoreTable(node);

        // 헤더 (부/판 + 리치본바)
        totalLine = appendNodes($('div.s0 > div:eq(1)', node)[0]) + '<br>' + riichiHonba(scoreTable);

        // Yaku 리스트
        totalLine += '<table>';
        let yakuNames = $('.yk', node);
        let yakuHans  = $('.hn', node);
        nYaku = yakuNames.length;
        for (let i = 0; i < nYaku; i++) {
            totalLine += yakuLine($(yakuNames[i]).text(), yakuHans[i]);
        }
        totalLine += '</table>';

        // 점수 출력
        totalLine += scoreTableT4(scoreTable);

        // 삽입
        insertWinTableIntoDOM(node, totalLine, nYaku);

        // 기록용 타임스탬프
        timeOfLastWin = Date.now();
    }

    function handleWin(node) {
        scorePane();
        rememberPlayerName(node);

        // 결과 처리 시작 전 플래그 초기화 (한 결과에 대해 getHandName이 최초 호출 시에만 handNum 증가)
        handAssignedForCurrentResult = false;
        lastAssignedHandName = null;

        if (isT4) winTableT4(node); else winTableT3(node);
    }

    function hasWon() { console.log('winner, winner, chicken dinner'); }

    function resetBetweenGames() {
        playerName = null;
        handNum = 1;
        handAssignedForCurrentResult = false;
        lastAssignedHandName = null;
        resetGraphData();
    }

    function curryClickChart(chart, labels) {
        return function clickChart(evt){
            evt.stopPropagation(); evt.preventDefault();
            const activeXPoints = chart.getElementsAtXAxis(evt);
            let handNumber = activeXPoints[0]._index;
            let id;
            if (handNumber === 0) id = 'azps_start'; else id = 'azps_' + labels[handNumber].replace(' ', '_');
            document.getElementById(id).scrollIntoView();
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
        let winner;
        if (isT4) winner = $('.bbg5:first')[0].childNodes[0].nodeValue;
        else winner = $('table > tbody > tr > td:first', node)[0].childNodes[0].nodeValue;
        let isWinner = winner === playerName;
        if (isWinner && $('div.tbc.bgb:contains(Exit)').length + $('button:contains(Exit)').length === 0) hasWon();
    }

    function handleEnd(node) {
        scorePane();
        allowNewHands = false;
        scoreChart();
        resetBetweenGames();
        checkWinner();
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
        needles.some(function(needle){ if (haystack.substr(0, needle.length) === needle) { found = true; return true; }});
        return found;
    }

    function checkNode(oneNode) {
        let testText = oneNode.innerText;
        if (typeof testText === 'undefined' || testText === null) return;
        if ($('#' + paneID).length && ( $('#pane1', oneNode).length || (isT4 && oneNode.className.includes('s0') && testText.includes('Online:')) )) {
            return removePane();
        }
        if (!allowNewHands) return;
        if (oneNode.className.includes(isT4 ? 'nopp' : 'tbc') && testText.length > 10) {
            if (stringStartsWith(testText, ['Start', '對局', 'Début', 'Bắt đầu'])) return handleStart(oneNode);
            if (stringStartsWith(testText, ['終局','End', 'Fin', 'Koniec'])) return handleEnd(oneNode);
            if (stringStartsWith(testText, ['Redeal', '流局', 'Ryuukyoku', 'Rejouer', 'Ván hoà', 'Powtórka'])) return showExhaustiveDraw(oneNode);
        }
        try {
            if (oneNode.childNodes[0].childNodes[0].id === 'total' || (isT4 && testText.length > 20 && oneNode.className.includes('nopp') ) ) {
                return handleWin(oneNode);
            }
        } catch (e) {}
        if (oneNode.className === 'tbc' && $('button', oneNode).length && $('table', oneNode).length === 1 && !isT4 && $('#sc00', oneNode).length && testText.includes('') && testText.includes('')) {
            if (stringStartsWith(testText, ['觀戰', 'Redeal: ', 'Torpillage: ', 'Ván hoà: ', 'Powtórka (', 'Kyuushu kyuuhai', 'Kyūshu kyūhai', 'Suukaikan', 'Sūkaikan', 'Suufon renda', 'Sūfon renda', 'Sanchahou', 'Sanchahō', 'Suucha riichi', 'Sūcha riichi'])) {
                return showAbortiveDraw(oneNode);
            }
        }
    }

    function onMutate(mutations) {
        mutationObserver.disconnect();
        mutations.forEach(function(oneMutation){
            if (oneMutation.addedNodes.length) {
                oneMutation.addedNodes.forEach(function(node){
                    try { if (node.childNodes.length) checkNode(node); } catch(e) { console.log(e); }
                });
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
