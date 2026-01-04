// ==UserScript==
// @name        유아렐갤 말투 교정기
// @namespace   http://tampermonkey.net/
// @version     1.1
// @description 모바일 페이지 지원
// @author      urlgall
// @match       */mini/board/lists/?id=sandboxurl*
// @match       */mini/board/view/?id=sandboxurl*
// @match       */mini/sandboxurl*
// @grant       none
// @run-at      document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/551269/%EC%9C%A0%EC%95%84%EB%A0%90%EA%B0%A4%20%EB%A7%90%ED%88%AC%20%EA%B5%90%EC%A0%95%EA%B8%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/551269/%EC%9C%A0%EC%95%84%EB%A0%90%EA%B0%A4%20%EB%A7%90%ED%88%AC%20%EA%B5%90%EC%A0%95%EA%B8%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CHO = [
        'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ',
        'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
    ];
    const JUNG = [
        'ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ',
        'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ',
        'ㅣ'
    ];
    const JONG = [
        '', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ',
        'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ',
        'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
    ];

    const H_START = 0xAC00;
    const J_COUNT = 21;
    const L_COUNT = 28;

    function fixText(t) {
        const urlR = /(https?:\/\/[^\s<>]+)/g;
        const tokens = [];
        let lI = 0;

        t.replace(urlR, (match, offset) => {
            const nUT = t.substring(lI, offset);
            if (nUT) tokens.push({ v: nUT });

            tokens.push({ v: match, isU: true });
            lI = offset + match.length;
            return match;
        });

        if (lI < t.length) tokens.push({ v: t.substring(lI) });

        let o = '';
        tokens.forEach(token => {
            if (token.isU) {
                o += token.v;
            } else {
                const cleanedT = token.v.replace(/[.,]/g, '');
                o += a(cleanedT);
            }
        });

        return o;
    }

    function a(t) {
        let o = '';
        let c = -1;
        let j = -1;

        const getCI = (char) => CHO.indexOf(char);
        const getJI = (char) => JUNG.indexOf(char);
        const getLI = (char) => JONG.indexOf(char);

        const compose = (c, j, l = 0) => {
            if (c === -1 || j === -1) return '';
            const code = H_START + (c * J_COUNT * L_COUNT) + (j * L_COUNT) + l;
            return String.fromCharCode(code);
        };

        for (let i = 0; i < t.length; i++) {
            const char = t[i];
            const ci = getCI(char);
            const ji = getJI(char);

            const isJamo = (ci !== -1 || ji !== -1);

            if (!isJamo) {
                if (c !== -1 && j !== -1) {
                    o += compose(c, j);
                } else if (c !== -1) {
                    o += CHO[c];
                }

                o += char;

                c = -1;
                j = -1;
                continue;
            }

            if (c === -1 && ci !== -1) {
                c = ci;

            } else if (c !== -1 && ji !== -1) {
                j = ji;

                const nc = (i + 1 < t.length) ? t[i + 1] : '';
                const nli = getLI(nc);

                const anc = (i + 2 < t.length) ? t[i + 2] : '';
                const anisj = getJI(anc) !== -1;

                if (nli > 0) {
                    if (!anisj) {
                        o += compose(c, j, nli);
                        i++;
                        c = -1;
                        j = -1;
                    } else {
                        o += compose(c, j);
                        c = -1;
                        j = -1;
                    }
                } else {
                    o += compose(c, j);
                    c = -1;
                    j = -1;
                }

            } else {
                if (c !== -1 && j !== -1) {
                    o += compose(c, j);
                    c = -1; j = -1;
                } else if (c !== -1) {
                    o += CHO[c];
                    c = -1;
                }

                if (ci !== -1) {
                    c = ci;
                } else {
                    o += char;
                }
            }
        }

        if (c !== -1 && j !== -1) {
            o += compose(c, j);
        } else if (c !== -1) {
            o += CHO[c];
        }

        return o;
    }

    function fixTitles() {
        const titles = document.querySelectorAll('td.gall_tit a, span.title_subject, span.subjectin, span.tit');

        titles.forEach(el => {
            const origT = el.textContent;
            const fixedT = fixText(origT);
            const isA = el.tagName === 'A';

            if (origT !== fixedT) {
                if (isA) {
                    const keepC = Array.from(el.children);
                    const trimT = fixedT.trimStart();
                    const newTn = document.createTextNode(trimT);

                    el.innerHTML = '';

                    keepC.forEach(child => el.appendChild(child));
                    el.appendChild(newTn);
                } else {
                    el.textContent = fixedT.trim();
                }
            }
        });
    }

    function fixContents() {
        const writes = document.querySelectorAll('div.write_div, div.thum-txtin');
        writes.forEach(div => {
            fixNodes(div);
        });

        const comments = document.querySelectorAll('p.usertxt, p.txt');
        comments.forEach(p => {
             fixNodes(p);
        });
    }

    function fixNodes(el) {
        const w = document.createTreeWalker(
            el,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        let n;
        const updates = [];

        while (n = w.nextNode()) {
            if (n.parentNode && n.parentNode.nodeName !== 'SCRIPT' && n.parentNode.nodeName !== 'STYLE') {
                if (!n.parentNode.classList || (!n.parentNode.classList.contains('korean-fixer-wrapper'))) {
                    updates.push(n);
                }
            }
        }

        updates.forEach(tn => {
            const origT = tn.nodeValue;
            if (!origT.trim()) return;

            const fixedT = fixText(origT);

            if (origT !== fixedT) {
                const parent = tn.parentNode;
                if (!parent) return;

                const newTn = document.createTextNode(fixedT);
                const span = document.createElement('span');
                span.classList.add('korean-fixer-wrapper');

                span.appendChild(newTn);

                parent.replaceChild(span, tn);
            } else {
                tn.nodeValue = origT.trimStart();
            }
        });
    }

    fixTitles();
    fixContents();

    const observer = new MutationObserver((m) => {
        let update = false;
        m.forEach(mutation => {
            if (mutation.type === 'childList') {
                Array.from(mutation.addedNodes).forEach(n => {
                    if (n.nodeType === 1) {
                        if (n.querySelector('td.gall_tit a') || n.querySelector('span.title_subject') || n.querySelector('span.subjectin') || n.querySelector('span.tit') || n.querySelector('div.write_div') || n.querySelector('div.thum-txtin') || n.querySelector('p.usertxt') || n.querySelector('p.txt')) {
                             update = true;
                        }
                    }
                });
            }
        });

        if (update) {
            fixTitles();
            fixContents();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
