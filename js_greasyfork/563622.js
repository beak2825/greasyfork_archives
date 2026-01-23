// ==UserScript==
// @name         DC 갤러리 키워드 글 숨김 + 좌측 투명 패널 개조 (도배 변형 최적화)
// @namespace    http://tampermonkey.net/
// @version      9.9
// @description  같은 IP가 3분 내 키워드(눈속임 변형 포함) 글 2회 이상 작성 시 숨김
// @match        *://gall.dcinside.com/board/lists/*?id=projectnike*
// @match        *://gall.dcinside.com/board/lists?id=projectnike
// @match        *://gall.dcinside.com/board/view/*?id=projectnike*
// @exclude      *://gall.dcinside.com/board/lists/*exception_mode=recommend*
// @exclude      *://gall.dcinside.com/board/view/*exception_mode=recommend*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563622/DC%20%EA%B0%A4%EB%9F%AC%EB%A6%AC%20%ED%82%A4%EC%9B%8C%EB%93%9C%20%EA%B8%80%20%EC%88%A8%EA%B9%80%20%2B%20%EC%A2%8C%EC%B8%A1%20%ED%88%AC%EB%AA%85%20%ED%8C%A8%EB%84%90%20%EA%B0%9C%EC%A1%B0%20%28%EB%8F%84%EB%B0%B0%20%EB%B3%80%ED%98%95%20%EC%B5%9C%EC%A0%81%ED%99%94%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563622/DC%20%EA%B0%A4%EB%9F%AC%EB%A6%AC%20%ED%82%A4%EC%9B%8C%EB%93%9C%20%EA%B8%80%20%EC%88%A8%EA%B9%80%20%2B%20%EC%A2%8C%EC%B8%A1%20%ED%88%AC%EB%AA%85%20%ED%8C%A8%EB%84%90%20%EA%B0%9C%EC%A1%B0%20%28%EB%8F%84%EB%B0%B0%20%EB%B3%80%ED%98%95%20%EC%B5%9C%EC%A0%81%ED%99%94%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const KEYWORDS = ["원신", "라방", "권은비", "신태일", "노드크라이", "콜롬비나", "드크라이"];
    const CHECK_INTERVAL = 2000;
    const TIME_WINDOW = 3 * 60 * 1000;

    const hiddenRecords = {};
    const ipRecentPosts = {};
    const seenPosts = new Set();

    /* ===============================
       키워드 눈속임 도배 대응 (최적화)
       - 글자 사이 한글 제외 최대 2글자 허용
       =============================== */
    function keywordToSpamRegex(keyword) {
        const escaped = [...keyword].map(ch =>
            ch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        );
        return new RegExp(
            escaped.join('[^가-힣]{0,2}'),
            'i'
        );
    }

    /* ===============================
       좌측 투명 패널
       =============================== */
    let panelDiv = document.getElementById('hiddenPanelDiv');
    if (!panelDiv) {
        panelDiv = document.createElement('div');
        panelDiv.id = 'hiddenPanelDiv';
        Object.assign(panelDiv.style, {
            position: 'fixed',
            left: '10px',
            bottom: '10px',
            width: '260px',
            maxHeight: '50vh',
            overflowY: 'auto',
            backgroundColor: 'rgba(30,30,30,0.5)',
            color: '#FFAA33',
            padding: '10px',
            borderRadius: '10px',
            border: '1px solid rgba(255,170,51,0.5)',
            boxShadow: '0 0 8px rgba(0,0,0,0.3)',
            fontFamily: '"Pretendard", "Noto Sans KR", sans-serif',
            fontSize: '13px',
            zIndex: '9999'
        });
        panelDiv.innerHTML = '<strong>⛔ 숨긴 글 없음</strong>';
        document.body.appendChild(panelDiv);
    }

    function recomputePanel() {
        const byIp = {};
        for (const rec of Object.values(hiddenRecords)) {
            const ip = rec.ip || 'unknown';
            if (!byIp[ip]) byIp[ip] = { count: 0, keywords: new Set() };
            byIp[ip].count++;
            rec.keywords.forEach(k => byIp[ip].keywords.add(k));
        }

        if (Object.keys(byIp).length === 0) {
            panelDiv.innerHTML = '<strong>⛔ 숨긴 글 없음</strong>';
            return;
        }

        let html = '<strong>⛔ 숨긴 글 IP별 상세</strong><br>';
        for (const [ip, info] of Object.entries(byIp)) {
            html += `<div style="margin-top:4px;">${ip}: ${info.count}개<br>&nbsp;&nbsp;[${Array.from(info.keywords).join(", ")}]</div>`;
        }
        panelDiv.innerHTML = html;
    }

    /* ===============================
       글 정보 유틸
       =============================== */
    function getRows() {
        return Array.from(document.querySelectorAll('tr[class*="ub-content"], div.writing-list tr'))
            .filter(tr => tr.querySelector('td.gall_writer') && tr.querySelector('td.gall_tit'));
    }

    const getPostId = tr =>
        tr.dataset?.no?.trim()
        || tr.querySelector('td.gall_num')?.innerText?.trim()
        || tr.querySelector('td.gall_tit a[href]')?.href?.match(/[?&]no=(\d+)/)?.[1]
        || `no_unknown::${getIp(tr)}::${getTitle(tr)}`;

    const getIp = tr => tr.querySelector('td.gall_writer')?.dataset?.ip?.trim() || '';
    const getTitle = tr => tr.querySelector('td.gall_tit')?.innerText?.trim() || '';

    function hidePostOnce(postId, tr, ip, matchedKeywords) {
        if (!postId || hiddenRecords[postId]) return;
        if (tr) tr.style.display = 'none';
        hiddenRecords[postId] = { ip, keywords: new Set(matchedKeywords) };
        recomputePanel();
    }

    /* ===============================
       메인 검사 로직
       =============================== */
    function checkPosts() {
        const now = Date.now();
        const rows = getRows();

        for (const tr of rows) {
            const postId = getPostId(tr);
            if (!postId || seenPosts.has(postId)) continue;
            seenPosts.add(postId);

            const ip = getIp(tr);
            if (!ip) continue;

            const title = getTitle(tr);
            const matchedKeywords = [];

            for (const keyword of KEYWORDS) {
                if (keywordToSpamRegex(keyword).test(title)) {
                    matchedKeywords.push(keyword);
                }
            }

            if (matchedKeywords.length === 0) continue;

            if (!ipRecentPosts[ip]) ipRecentPosts[ip] = [];
            ipRecentPosts[ip].push({ time: now, postId, tr, matchedKeywords });

            ipRecentPosts[ip] = ipRecentPosts[ip].filter(x => now - x.time <= TIME_WINDOW);

            const uniquePostCount = new Set(ipRecentPosts[ip].map(x => x.postId)).size;

            if (uniquePostCount >= 2) {
                for (const x of ipRecentPosts[ip]) {
                    hidePostOnce(x.postId, x.tr, ip, x.matchedKeywords);
                }
            }
        }

        for (const ip of Object.keys(ipRecentPosts)) {
            ipRecentPosts[ip] = ipRecentPosts[ip].filter(x => now - x.time <= TIME_WINDOW);
            if (ipRecentPosts[ip].length === 0) delete ipRecentPosts[ip];
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', checkPosts);
    } else {
        checkPosts();
    }

    new MutationObserver(() => setTimeout(checkPosts, 500))
        .observe(document.body, { childList: true, subtree: true });

    setInterval(checkPosts, CHECK_INTERVAL);

})();
