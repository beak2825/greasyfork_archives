// ==UserScript==
// @name         소프트콘 실청자 계산기
// @description  숲 시청자에 피모비율 적용 및 정렬
// @namespace    https://tampermonkey.net/
// @version      1.0.0
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=viewership.softc.one
// @match        *://viewership.softc.one/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554107/%EC%86%8C%ED%94%84%ED%8A%B8%EC%BD%98%20%EC%8B%A4%EC%B2%AD%EC%9E%90%20%EA%B3%84%EC%82%B0%EA%B8%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/554107/%EC%86%8C%ED%94%84%ED%8A%B8%EC%BD%98%20%EC%8B%A4%EC%B2%AD%EC%9E%90%20%EA%B3%84%EC%82%B0%EA%B8%B0.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const OFFICIAL_PC = 35;
    const OFFICIAL_MOBILE = 65;
    const AFREECA_SELECTOR = 'a[href^="/channel/afreeca/"]';
    const MARK_ATTR = 'data-realviewers-marked';
    let obs = null;
    let cooldown = false;

    const parseIntStrict = (txt) => (txt || '').replace(/[^0-9]/g, '') * 1 || 0;
    const extractTwoPercents = (txt) => {
        const m = txt.match(/(\d+)\s*%/g);
        return m?.length >= 2 ? m.map(v => parseInt(v)).slice(0, 2) : null;
    };
    const calcRealTotal = (total, pcPct, mobilePct) => {
        const realMobile = total * (mobilePct / 100);
        const estPC = realMobile * (OFFICIAL_PC / OFFICIAL_MOBILE);
        return Math.round(realMobile + estPC);
    };

    const findLiveRankingContainer = () => {
        const headers = Array.from(document.querySelectorAll('h2, h3, h4'));
        for (const h of headers) {
            if (/실시간\s*방송/i.test(h.textContent)) {
                const next = h.nextElementSibling;
                if (next && next.querySelector('a[href^="/channel/"]')) return next;
            }
        }
        return document.querySelector('div.text-sm.font-medium.flex.flex-col.gap-2.justify-center');
    };

    const processCard = (a) => {
        if (!a) return;

        const wrap = a.querySelector('.flex.flex-col.pr-2.leading-none.gap-1');
        if (!wrap) return;

        const viewerDiv = wrap.querySelector('div.font-bold, div.text-right');
        if (!viewerDiv) return;

        // 🛠 이미 "(숫자)" 또는 "(숫자 명)" 같은 실청자 부분 제거
        let text = viewerDiv.textContent
        .replace(/\(\s*\d[\d,]*\s*명?\s*\)/g, '') // 괄호 안 숫자+명 전체 제거
        .replace(/[^\d,]/g, '')                   // 숫자와 , 외 전부 제거
        .trim();

        const total = parseIntStrict(text);
        if (!total) return;

        let score = total;

        if (a.matches(AFREECA_SELECTOR)) {
            const divs = wrap.querySelectorAll('div');
            let ratioDiv = null;
            for (const d of divs) {
                if (d.querySelectorAll('svg').length >= 2 && d.textContent.includes('%')) {
                    ratioDiv = d;
                    break;
                }
            }
            if (ratioDiv) {
                const perc = extractTwoPercents(ratioDiv.textContent);
                if (perc) {
                    // 이미 변환된 경우(→ 표시 있음)는 스킵
                    if (viewerDiv.textContent.includes('→')) return;

                    const [pc, mobile] = perc;
                    const real = calcRealTotal(total, pc, mobile);
                    score = real;

                    // 중복 삽입 방지
                    if (!viewerDiv.hasAttribute('data-realviewer-added')) {
                        const spanNode = viewerDiv.querySelector('span'); // '명' span
                        if (!spanNode) return;

                        // 기존 숫자 추출
                        const origText = viewerDiv.childNodes[0]?.textContent.trim() || '';

                        // 기존 내용 제거
                        viewerDiv.textContent = '';

                        // 흐릿한 원본 시청자수 + 화살표
                        const oldSpan = document.createElement('span');
                        oldSpan.className = 'text-xs opacity-70';
                        oldSpan.textContent = `${origText} →`;

                        // 실청자수 (강조)
                        const realText = document.createTextNode(` ${real.toLocaleString()}`);

                        // 명(span) 복제
                        const newSpan = spanNode.cloneNode(true);

                        viewerDiv.appendChild(oldSpan);
                        viewerDiv.appendChild(realText);
                        viewerDiv.appendChild(newSpan);

                        viewerDiv.setAttribute('data-realviewer-added', '1');
                    }
                }
            }
        }

        a.dataset.realScore = score;
    };
    const restartObserver = () => {
        if (cooldown) return;
        cooldown = true;
        setTimeout(() => {
            if (obs) obs.observe(document.body, { childList: true, subtree: true });
            cooldown = false;
        }, 1000);
    };

    const scanAndSort = () => {
        const container = findLiveRankingContainer();
        if (!container) return;

        if (obs) obs.disconnect();

        const cards = Array.from(container.querySelectorAll('a[href^="/channel/"]'));
        if (!cards.length) {
            restartObserver();
            return;
        }

        console.log(`🟢 [scanAndSort] 실행됨, 카드 수: ${cards.length}`);

        // 실청자 계산
        cards.forEach(processCard);

        // 카드 점수 로그
        cards.forEach(a => {
            const ch = a.querySelector('.font-bold')?.textContent?.trim().slice(0, 10) || '(이름없음)';
            const score = a.dataset.realScore || '(없음)';
            const type = a.matches(AFREECA_SELECTOR) ? 'Afreeca' : 'Chi';
            console.log(`  🔸 ${type}: ${ch} → ${score}`);
        });

        // 정렬
        const sorted = cards.sort((a, b) => {
            const va = parseInt(a.dataset.realScore || 0);
            const vb = parseInt(b.dataset.realScore || 0);
            return vb - va;
        });

        const moreBtn = container.querySelector('button.font-bold.flex.justify-center');
        if (moreBtn) moreBtn.remove();

        sorted.forEach((el, i) => {
            const rankDiv = el.querySelector('div.w-3.text-center');
            if (rankDiv) rankDiv.textContent = (i + 1).toString();
            container.appendChild(el);
        });

        if (moreBtn) container.appendChild(moreBtn);

        console.log('✅ [scanAndSort] 정렬 완료');
        restartObserver();
    };

    obs = new MutationObserver((mutations) => {
        const added = mutations.flatMap(m => Array.from(m.addedNodes)).filter(n => n.nodeType === 1);
        if (added.length) {
            console.log(`⚙️ [MutationObserver] 감지됨 → ${added.length} nodes`);
            if (scanAndSort._raf) cancelAnimationFrame(scanAndSort._raf);
            scanAndSort._raf = requestAnimationFrame(scanAndSort);
        }
    });

    obs.observe(document.body, { childList: true, subtree: true });
    console.log('🧩 [Softcon Debug] MutationObserver 등록 완료');
    setTimeout(scanAndSort, 1500);
})();

