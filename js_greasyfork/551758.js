// ==UserScript==
// @name         DC 갤러리 키워드 글 숨김 + 로고 위 중앙 패널 v9.8
// @namespace    http://tampermonkey.net/
// @version      9.8
// @description  같은 IP가 3분 내 키워드 포함 글 2회 이상 작성하면 숨김, 로고 위 정중앙 투명 패널로 IP/갯수/키워드 표시
// @match        *://gall.dcinside.com/board/lists/*?id=projectnike*
// @match        *://gall.dcinside.com/board/lists?id=projectnike
// @match        *://gall.dcinside.com/board/view/*?id=projectnike*
// @exclude      *://gall.dcinside.com/board/lists/*exception_mode=recommend*
// @exclude      *://gall.dcinside.com/board/view/*exception_mode=recommend*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551758/DC%20%EA%B0%A4%EB%9F%AC%EB%A6%AC%20%ED%82%A4%EC%9B%8C%EB%93%9C%20%EA%B8%80%20%EC%88%A8%EA%B9%80%20%2B%20%EB%A1%9C%EA%B3%A0%20%EC%9C%84%20%EC%A4%91%EC%95%99%20%ED%8C%A8%EB%84%90%20v98.user.js
// @updateURL https://update.greasyfork.org/scripts/551758/DC%20%EA%B0%A4%EB%9F%AC%EB%A6%AC%20%ED%82%A4%EC%9B%8C%EB%93%9C%20%EA%B8%80%20%EC%88%A8%EA%B9%80%20%2B%20%EB%A1%9C%EA%B3%A0%20%EC%9C%84%20%EC%A4%91%EC%95%99%20%ED%8C%A8%EB%84%90%20v98.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const KEYWORDS = ["림버스","붕스","원신","라방","권은비","신태일","노드크라이","콜롬비나","원두순","니케","망"];
    const CHECK_INTERVAL = 2000;
    const TIME_WINDOW = 3 * 60 * 1000;

    const hiddenRecords = {};
    const ipRecentPosts = {};
    const seenPosts = new Set();

    // 로고 위 중앙 패널 생성
    let panelDiv = document.getElementById('hiddenPanelDiv');
    if (!panelDiv) {
        panelDiv = document.createElement('div');
        panelDiv.id = 'hiddenPanelDiv';
        Object.assign(panelDiv.style, {
            position: 'absolute',
            backgroundColor: 'rgba(30,30,30,0.5)',
            color: '#FFAA33',
            padding: '10px',
            borderRadius: '10px',
            border: '1px solid rgba(255,170,51,0.5)',
            boxShadow: '0 0 6px rgba(0,0,0,0.25)',
            fontFamily: '"Pretendard","Noto Sans KR",sans-serif',
            fontSize: '13px',
            zIndex: '9999',
            maxWidth: '95%',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            textAlign: 'center',
            transform: 'translateX(-50%)',
        });
        panelDiv.innerHTML = '<strong>⛔ 숨긴 글 없음</strong>';
        document.body.appendChild(panelDiv);
    }

    // 패널 위치 업데이트 (로고 중앙 위)
    const updatePanelPosition = () => {
        const logo = document.querySelector('.logo_img');
        if (!logo) return;
        const rect = logo.getBoundingClientRect();
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        panelDiv.style.left = `${rect.left + rect.width / 2}px`;
        panelDiv.style.top = `${rect.top + scrollTop - panelDiv.offsetHeight - 10}px`; // 로고 위 10px
    };
    window.addEventListener('scroll', updatePanelPosition);
    window.addEventListener('resize', updatePanelPosition);
    updatePanelPosition();

    // 패널 내용 갱신
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

        let html = '<strong>🚫 숨긴 글 목록</strong><br>';
        for (const [ip, info] of Object.entries(byIp)) {
            html += `
                <div style="margin-top:4px;">
                    <span style="font-weight:bold;">${ip}</span> : ${info.count}개<br>
                    <span style="font-size:12px; opacity:0.8;">
                        [${Array.from(info.keywords).join(", ")}]
                    </span>
                </div>
            `;
        }
        panelDiv.innerHTML = html;
    }

    // 게시글 행 가져오기
    function getRows() {
        return Array.from(document.querySelectorAll('tr[class*="ub-content"], div.writing-list tr'))
            .filter(tr => tr.querySelector('td.gall_writer') && tr.querySelector('td.gall_tit'));
    }

    const getPostId = tr =>
        tr.dataset?.no?.trim() ||
        tr.querySelector('td.gall_num')?.innerText?.trim() ||
        tr.querySelector('td.gall_tit a[href]')?.href?.match(/[?&]no=(\d+)/)?.[1] ||
        `no_unknown::${getIp(tr)}::${getTitle(tr)}`;

    const getIp = tr => tr.querySelector('td.gall_writer')?.dataset?.ip?.trim() || '';
    const getTitle = tr => tr.querySelector('td.gall_tit')?.innerText?.trim() || '';

    function hidePostOnce(postId, tr, ip, matchedKeywords) {
        if (!postId || hiddenRecords[postId]) return;
        if (tr) tr.style.display = 'none';
        hiddenRecords[postId] = { ip, keywords: new Set(matchedKeywords) };
        recomputePanel();
    }

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
            const matchedKeywords = KEYWORDS.filter(k => title.toLowerCase().includes(k.toLowerCase()));
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
