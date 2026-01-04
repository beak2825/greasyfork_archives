// ==UserScript==
// @name         아카라이브 마비모 깡계 판독기
// @namespace    https://arca.live
// @version      2.0.0
// @description  댓글/게시글 목록 깡계 판정. 공지 제외. 목록은 글번호(ID) 옆, 댓글은 닉 옆에 소형 배지. 깡!/체크 폭 고정 동일.
// @match        https://arca.live/b/mabimobile*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      arca.live
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557780/%EC%95%84%EC%B9%B4%EB%9D%BC%EC%9D%B4%EB%B8%8C%20%EB%A7%88%EB%B9%84%EB%AA%A8%20%EA%B9%A1%EA%B3%84%20%ED%8C%90%EB%8F%85%EA%B8%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/557780/%EC%95%84%EC%B9%B4%EB%9D%BC%EC%9D%B4%EB%B8%8C%20%EB%A7%88%EB%B9%84%EB%AA%A8%20%EA%B9%A1%EA%B3%84%20%ED%8C%90%EB%8F%85%EA%B8%B0.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const POST_LIMIT          = 10;
    const DURATION_LIMIT_DAYS = 14;
    const GAP_LIMIT_DAYS      = 90;

    const MS_PER_DAY   = 24 * 60 * 60 * 1000;
    const GAP_LIMIT_MS = GAP_LIMIT_DAYS * MS_PER_DAY;

    const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
    const CACHE_KEY    = 'kk_mabi_profile_cache_v9';

    function loadCache() {
        try { return JSON.parse(GM_getValue(CACHE_KEY, '{}')); }
        catch (_) { return {}; }
    }
    function saveCache(v) {
        try { GM_setValue(CACHE_KEY, JSON.stringify(v)); } catch (_) {}
    }

    const persistentCache = loadCache();
    const memoryCache     = new Map();

    // ===== DOM SEARCH =====

    function getUserInfoElements() {
        const comments = document.querySelectorAll(
            '.article-comment .list-area .info-row .user-info'
        );
        const list = document.querySelectorAll(
            '.article-list .list-table .vrow-bottom .vcol.col-author .user-info'
        );
        const s = new Set(), out = [];
        comments.forEach(el => { if (!s.has(el)) { s.add(el); out.push(el); } });
        list.forEach(el => { if (!s.has(el)) { s.add(el); out.push(el); } });
        return out;
    }

    function getProfileUrl(ui) {
        const a = ui.querySelector('a[href^="/u/@"]');
        if (a) return new URL(a.getAttribute('href'), location.origin).href;

        const df = ui.querySelector('[data-filter]');
        if (!df) return null;
        const v = df.getAttribute('data-filter');
        if (!v) return null;

        return location.origin + '/u/@' + encodeURIComponent(v);
    }

    function getNickFilter(ui) {
        const df = ui.querySelector('[data-filter]');
        if (df) {
            const v = df.getAttribute('data-filter');
            if (v) return v;
        }
        const a = ui.querySelector('a[href^="/u/@"]');
        if (a) return (a.getAttribute('data-filter') || a.textContent || '').trim();
        return (ui.textContent || '').trim();
    }

    function hasBadgeIn(el) { return !!el.querySelector('.kk-result-badge'); }

    // ===== BADGE RENDERING =====

    function makeBadge(result) {
        const bd = document.createElement('span');
        bd.className = 'kk-result-badge';

        const PAD_X     = 3;
        const FONT_SIZE = 9;
        const MIN_WIDTH = 26;   // 깡!/체크 동일 폭, 짧게

        bd.style.display = 'inline-flex';
        bd.style.alignSelf = 'center';
        bd.style.height = 'auto';
        bd.style.lineHeight = '1';
        bd.style.boxSizing = 'border-box';
        bd.style.marginLeft = '4px';
        bd.style.padding = '1px ' + PAD_X + 'px';
        bd.style.borderRadius = '3px';
        bd.style.fontSize = FONT_SIZE + 'px';
        bd.style.border = '1px solid';
        bd.style.whiteSpace = 'nowrap';
        bd.style.verticalAlign = 'middle';
        bd.style.justifyContent = 'center';
        bd.style.background = 'transparent';
        bd.style.minWidth = MIN_WIDTH + 'px';

        let text  = '';
        let color = '#777';
        let border = '#ccc';

        if (!result || result.error) {
            text  = 'ERR';
            color = '#CE0018';
            border = '#CE0018';
        } else if (result.isGgang) {
            text  = '깡!';
            color = '#CE0018';
            border = '#CE0018';
            bd.style.fontWeight = 'bold';
        } else {
            text  = '✓';
        }

        bd.textContent = text;
        bd.style.color = color;
        bd.style.borderColor = border;

        if (result && result.isGgang && Array.isArray(result.reasons) && result.reasons.length) {
            bd.title = result.reasons.join(',');
        }

        return bd;
    }

    // 댓글: 닉네임 옆, 목록: 글번호(ID) 옆
    function attachResultToAll(profileUrl, result) {
        getUserInfoElements().forEach(ui => {
            if (ui.closest('a.vrow.column.notice')) return;

            const url = getProfileUrl(ui);
            if (!url || url !== profileUrl) return;

            const row       = ui.closest('a.vrow.column[href^="/b/mabimobile/"]');
            const isList    = !!row;
            const isComment = !!ui.closest('.article-comment');

            if (isList && row && hasBadgeIn(row)) return;
            if (isComment && hasBadgeIn(ui)) return;

            const badge = makeBadge(result);

            if (!result || result.error) {
                if (isList && row) {
                    const idCell = row.querySelector('.vrow-top .vcol.col-id');
                    if (!idCell) return;
                    idCell.appendChild(badge);
                } else if (isComment) {
                    const link = ui.querySelector('a[href^="/u/@"]');
                    if (link) link.after(badge);
                    else ui.appendChild(badge);
                }
                return;
            }

            if (result.isGgang) {
                if (isList && row) {
                    const idCell = row.querySelector('.vrow-top .vcol.col-id');
                    if (!idCell) return;
                    idCell.appendChild(badge);
                } else if (isComment) {
                    const link = ui.querySelector('a[href^="/u/@"]');
                    if (link) link.after(badge);
                    else ui.appendChild(badge);
                }
                return;
            }

            // 비깡
            if (isList && row) {
                const idCell = row.querySelector('.vrow-top .vcol.col-id');
                if (!idCell) return;
                idCell.appendChild(badge);
            } else if (isComment) {
                const link = ui.querySelector('a[href^="/u/@"]');
                if (link) link.after(badge);
                else ui.appendChild(badge);
            }
        });
    }

    // ===== PROFILE PARSE =====

    function analyzeProfileDoc(doc) {
        const block = Array.from(doc.querySelectorAll('.card-block'))
            .find(x => x.textContent.includes('최근 작성글'));

        if (!block) return { profileBigGap:false, postsMabiProf:0, spanDaysProf:0 };

        let inSec = false;
        const posts = [];

        for (let n = block.firstElementChild; n; n = n.nextElementSibling) {
            if (n.tagName === 'H5') {
                if (n.textContent.includes('최근 작성글')) { inSec = true; continue; }
                if (inSec) break;
            }
            if (!inSec) continue;
            if (n.tagName === 'HR') break;
            if (!n.classList.contains('user-recent')) continue;

            const tEl = n.querySelector('.col-date time');
            if (!tEl) continue;
            const t = Date.parse(tEl.getAttribute('datetime'));
            if (isNaN(t)) continue;

            const isMabi = !!n.querySelector('.col-title a[href^="/b/mabimobile/"]');
            posts.push({ t, isMabi });
        }

        const m = posts.filter(p => p.isMabi).map(p => p.t);
        const postsMabiProf = m.length;

        let spanDaysProf = 0;
        if (m.length >= 2) {
            const min = Math.min(...m);
            const max = Math.max(...m);
            spanDaysProf = Math.floor((max - min) / MS_PER_DAY);
        }

        let profileBigGap = false;
        if (posts.length) {
            const newest = Math.max(...posts.map(p => p.t));
            if (Date.now() - newest >= GAP_LIMIT_MS) profileBigGap = true;
        }

        return { profileBigGap, postsMabiProf, spanDaysProf };
    }

    // ===== SEARCH PARSE =====

    function fetchSearchStats(nick, done) {
        if (!nick) { done({ error:true }); return; }
        const url = 'https://arca.live/b/mabimobile?target=all&keyword=' + encodeURIComponent(nick);

        GM_xmlhttpRequest({
            method:'GET',
            url,
            onload: res => {
                if (res.status !== 200) { done({ error:true }); return; }

                try {
                    const doc = new DOMParser().parseFromString(res.responseText, 'text/html');
                    const rows = doc.querySelectorAll('a.vrow.column[href^="/b/mabimobile/"]');
                    const times = [];

                    rows.forEach(r => {
                        const dfEl = r.querySelector('.vrow-bottom .vcol.col-author .user-info [data-filter]');
                        let ok = false;

                        if (dfEl) {
                            if ((dfEl.getAttribute('data-filter') || '') === nick) ok = true;
                        } else {
                            const ui = r.querySelector('.vrow-bottom .vcol.col-author .user-info');
                            if (ui) {
                                const txt = ui.textContent.trim().replace(/\s+/g,'');
                                if (txt === nick.replace(/\s+/g,'')) ok = true;
                            }
                        }
                        if (!ok) return;

                        const tEl = r.querySelector('.vrow-bottom .vcol.col-time time');
                        if (!tEl) return;

                        const t = Date.parse(tEl.getAttribute('datetime'));
                        if (!isNaN(t)) times.push(t);
                    });

                    if (!times.length) { done({ postsMabi:0, spanDays:0 }); return; }

                    const min = Math.min(...times);
                    const max = Math.max(...times);
                    const spanDays = Math.floor((max - min) / MS_PER_DAY);

                    done({ postsMabi: times.length, spanDays });
                } catch(e) {
                    done({ error:true });
                }
            },
            onerror: () => done({ error:true })
        });
    }

    // ===== 판정 =====

    function buildResult(posts, spanDays, hasC, allowA) {
        const reasons = [];
        let isGgang = false;

        const condA = allowA && posts <= POST_LIMIT;
        const condB = posts > 0 && posts <= POST_LIMIT && spanDays < DURATION_LIMIT_DAYS;

        if (condA || condB) {
            if (condA) reasons.push('글 10↓');
            if (condB) reasons.push('활동 2주 미만');
            isGgang = true;
        } else if (hasC) {
            reasons.push('공백 3개월');
            isGgang = true;
        }
        return { isGgang, postsMabi:posts, spanDays, reasons };
    }

    // ===== PROFILE + SEARCH =====

    function fetchResultFor(item) {
        const profileUrl = item.profileUrl;
        const nick       = item.nickFilter;

        if (!profileUrl) return;

        const mem = memoryCache.get(profileUrl);
        if (mem) { attachResultToAll(profileUrl, mem); return; }

        const saved = persistentCache[profileUrl];
        if (saved && Date.now() - saved.ts < CACHE_TTL_MS) {
            memoryCache.set(profileUrl, saved.result);
            attachResultToAll(profileUrl, saved.result);
            return;
        }

        function save(result) {
            memoryCache.set(profileUrl, result);
            persistentCache[profileUrl] = { ts: Date.now(), result };
            saveCache(persistentCache);
            attachResultToAll(profileUrl, result);
        }

        function useSearchOnly() {
            fetchSearchStats(nick, info => {
                if (info.error) {
                    save({ error:true, isGgang:false, postsMabi:0, spanDays:0, reasons:[] });
                    return;
                }
                save(buildResult(info.postsMabi, info.spanDays, false, false));
            });
        }

        GM_xmlhttpRequest({
            method:'GET',
            url: profileUrl,
            onload: res => {
                if (res.status !== 200) { useSearchOnly(); return; }

                let prof;
                try {
                    const doc = new DOMParser().parseFromString(res.responseText, 'text/html');
                    prof = analyzeProfileDoc(doc);
                } catch(e) {
                    useSearchOnly();
                    return;
                }

                const hasC = prof.profileBigGap;
                const pm   = prof.postsMabiProf;
                const ps   = prof.spanDaysProf;

                if (hasC) {
                    save(buildResult(pm, ps, true, true));
                    return;
                }
                if (pm > POST_LIMIT && ps >= DURATION_LIMIT_DAYS) {
                    save({ isGgang:false, postsMabi:pm, spanDays:ps, reasons:[] });
                    return;
                }
                if (!nick) {
                    save({ error:true, isGgang:false, postsMabi:pm, spanDays:ps, reasons:[] });
                    return;
                }

                fetchSearchStats(nick, info => {
                    if (info.error) {
                        save({ error:true, isGgang:false, postsMabi:pm, spanDays:ps, reasons:[] });
                        return;
                    }

                    const postsCombined = Math.max(pm, info.postsMabi);
                    const spanForAB     = info.spanDays;

                    save(buildResult(postsCombined, spanForAB, false, true));
                });
            },
            onerror: () => useSearchOnly()
        });
    }

    // ===== RUN =====

    function scanAndFetch() {
        const seen = new Set();
        getUserInfoElements().forEach(ui => {
            if (ui.closest('a.vrow.column.notice')) return;

            const profileUrl = getProfileUrl(ui);
            const nickFilter = getNickFilter(ui);
            if (!profileUrl || !nickFilter) return;
            if (seen.has(profileUrl)) return;
            seen.add(profileUrl);

            const saved = persistentCache[profileUrl];
            if (saved && Date.now() - saved.ts < CACHE_TTL_MS) {
                memoryCache.set(profileUrl, saved.result);
                attachResultToAll(profileUrl, saved.result);
            } else {
                fetchResultFor({ profileUrl, nickFilter });
            }
        });
    }

    function init() {
        scanAndFetch();
        setInterval(scanAndFetch, 3000);
    }

    if (document.readyState === 'loading')
        document.addEventListener('DOMContentLoaded', init);
    else
        init();

})();
