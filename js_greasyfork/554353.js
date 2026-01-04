// ==UserScript==
// @name         DCInside extension
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  DCInside 개인용 확장스크립트
// @author       You
// @include      http://gall.dcinside.com/*
// @include      https://gall.dcinside.com/*
// @exclude      *://gall.dcinside.com/upload
// @exclude      *://gall.dcinside.com/board/series/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dcinside.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554353/DCInside%20extension.user.js
// @updateURL https://update.greasyfork.org/scripts/554353/DCInside%20extension.meta.js
// ==/UserScript==
(() => {
    // ========================
    // 환경/데이터
    // ========================
    var memo = {
        "203.226": "SK",
        "203.236": "SK",
        "211.234": "SK",
        "211.235": "SK",
        "223.62": "SK",
        "223.39": "SK",
        "223.57": "SK",
        "211.246": "KT",
        "39.7": "KT",
        "110.7": "KT",
        "175.223": "KT",
        "175.252": "KT",
        "61.43": "LG",
        "117.111": "LG",
        "211.36": "LG",
        "106.102": "LG",
        "61.99": "버혐유입",
        "asas070": "줌병신년",
        "tulagi20": "자레드",
        "rofdksqnsdlsh": "연습딸깍",
        "weekle": "눈없새",
        "yahoo1051": "탄커",
        "mfc1234": "우울증",
        "k1fumbpov6e4": "병신",
        "g13131": "FanTaSy",
        "yujin98461": "라이스",
        "7k7k7k": "억화",
        "ispi4981": "시로갤파딱",
        "m1024": "시로갤파딱2",
        "vietviet": "린갤주딱",
        "gogohyut": "히나갤파딱3",
        "wjdwkrrhk12": "히나갤파딱4",
        "zbdltuxljzxl": "마갤파딱",
        "obchang": "칸마갤파딱",
        "stellivegogo": "칸마갤파딱2",
        "zkssk7": "칸마갤파딱3",
        "zksskwpdlfrja": "칸마갤파딱4",
        "8zghghnotbms": "유니갤파딱",
        "52mudwnq1bcp": "유니갤파딱2",
        "gm4k1bxkbhnv": "유니갤파딱4",
        "adc0913": "유니갤파딱5",
        "maroyam": "시로갤파딱3",
        "hwamin1108": "시로갤파딱4",
        "a87ln46grgkd": "타비갤파딱2",
        "aaaf77704field": "타비갤파딱3",
        "kanyusilihihita": "마갤전파딱",
        "rnyang": "리제갤파딱",
        "32f6az34ey8h": "리제갤파딱2",
        "ktpenu84cnlf": "리코갤주딱",
        "mekidofiree": "리제갤파딱4",
        "yukusu2": "리제갤파딱5",
        "ifty3": "리제갤파딱6",
        "juwjte3fj0fn": "타비리제갤주딱",
        "ghl2034423": "마갤전파딱",
        "leftwright": "마갤전파딱",
        "ksadfcvsdafe": "마갤전파딱ks",
        "stellshort123": "마갤파딱5",
        "aj7yt83752xt": "마갤주딱",
        "tabitabi1": "타비갤파딱5",
        "chikhicha": "유니갤주딱",
        "hardware3734": "샤프트",
        "stelivedyd123": "억화",
        "qwer123458": "롤붕이",
        "nigma7747": "타비갤파딱4",
        "jmy020222": "마갤파딱",
        "forth9306": "샤프트",
        "straight6549": "샤프트",
        "dhzkslswk": "개고수",
        "jioogae1202": "마갤전파딱",
        "cluster3830": "자존감",
        "dakmagic": "고수",
        "yumepercentkr": "동물혐오",
        "capital4777": "발악귀",
        "qwertyqwerty11111": "흠",
        "ozone3333": "짤낚시",
        "easy6203": "후지병신",
        "vkekrdyd": "히나갤주딱",
        "gravefriend": "정신병",
        "qoka1272": "되팔렘",
        "jungkanna": "칸마갤주딱",
        "118.235": "KT",
        "bowling1660": "이파리",
        "rapid8869": "방안분",
        "streamers": "통갤주딱",
        "pnodmifhsdb": "북희갤주딱",
        "kankansurren": "북희갤파딱1",
        "un1ucky1": "린갤파딱1",
        "zywb5xc8lryr": "살인스텝",
        "kythrm123": "마갤안분",
        "tkajre0ysr88": "버스갤",
        "lean0073": "키리누커",
        "y6rt6dz7lld8": "나나갤주딱",
        "miner20060710": "스데갤주딱",
        "disyung1230": "시로갤파딱2",
        "flllsplatoon23": "쵸키육수",
        "criminal3627": "고라파덕",
        "swear6201": "분탕",
        "accent3949": "콘서트유입",
        "heir1231": "쥐흔장려",
        "most5278": "리코몬헌쥐흔",
        "qtwre123": "미츠네징징",
        "regret9987": "러너리그저주",
        "corrupt2121": "코스충",
        "meontoday": "굴",
        "orange7934": "굴",
        "peaceful9775": "서치밴",
        "path6402": "씨발년",
        "gogo523": "탈버고",
        "jklee1427": "변호사",
        "distract6803": "작업계",
        "mark2113": "헛소리",
        "strip1340": "탈짱",
        "ambr9uhkse8j": "아리사분탕"
    }

    var me = {
        "crian3511": "나",
        "addict7928": "차소갤",
        "220.118": "나"
    }

    var hidden = {
        "chronic9568": "허세",
        "maple2185": "광고",
        "test9023": "주식"
    }

    const ignoreGallName = ['스트리머', '에스더 대나무숲', '말갈족', '버츄얼 스나'];

    var whiteList = {
    }

    var blackList = {
        'addict7928': ['stellive', 'umamusu'],
        'crian3511': ['whyiblocked', 'singlebungle1472', 'wackgood', 'verticalsue', 'stream_new1', 'ttvvirtual', 'vtubersnipe', 'supbangsong', 'soopvirtualstreamer', 'soopstreaming', 'soopbangsong', 'soopsosopbj', 'arisatree', 'dpqkdeo', 'chzzk']
    }

    const idGenerator = ((nick, uid, isIp = false) => {
        if((nick === 'ㅇㅇ' && uid !== "") || isIp) {
            if (memo[uid]) return {nick: `${memo[uid]}-(${uid})`, color: '#FF0000'};
            if (me[uid]) return {nick: `${me[uid]}-(${uid})`, color: '#0000FF'};
            return {nick: `(${uid})`};
        } else {
            if (memo[uid]) return {nick: `${memo[uid]}-${nick}`, color: '#FF0000'};
            if (me[uid]) return {nick: `${me[uid]}-${nick}`, color: '#0000FF'};
            return {nick: nick};
        }
    })


    // ========================
    // Utils
    // ========================
    const $  = (sel, root = document) => root.querySelector(sel);
    const $$ = (sel, root = document) => root.querySelectorAll(sel);

    const isHidden = (uid) => !!hidden?.[uid];

    function getCurrentPostId() {
        try {
            const url = new URL(location.href);
            const no = url.searchParams.get('no');
            if (no && /^\d+$/.test(no)) return no;
            const m = url.pathname.match(/\/(\d+)(?:[/?#]|$)/);
            return m ? m[1] : null;
        } catch { return null; }
    }

    function extractPostId(str) {
        if (!str) return null;
        const s = String(str);
        const noMatch = s.match(/[?&]no=(\d+)/);
        if (noMatch) return noMatch[1];
        const pathMatch = s.match(/\/(\d+)(?:[/?#]|$)/);
        if (pathMatch) return pathMatch[1];
        return null;
    }

    // 변경 몰아주기 (디바운스)
    let scheduled = false;
    const schedule = (fn) => {
        if (scheduled) return;
        scheduled = true;
        requestAnimationFrame(() => { scheduled = false; fn(); });
    };



    // ========================
    // Handlers
    // ========================


    // 0) 화이트/블랙리스트로 페이지 기능 차단 (기존 f() 상단 로직)
    function handleGallAccessByList(docRoot) {
        if (!docRoot) return;

        // 작성자 id 추출
        const nik = document.getElementsByClassName('user_info')?.[0]?.getElementsByClassName('writer_nikcon')?.[0];
        if (!nik) return;

        const gallogUrl = nik.getAttribute('onclick');
        const urlMatch  = gallogUrl?.match(/['"]([^'"]+)['"]/);
        const url       = urlMatch ? urlMatch[1] : null;
        const idMatch   = url ? url.match(/\/([^\/]+)$/) : null;
        const userId    = idMatch ? idMatch[1] : null;
        if (!userId) return;

        // 현재 페이지의 갤러리 id 추출
        Array.from(document.getElementsByClassName('page_head')).forEach((head) => {
            const aTags = head.getElementsByTagName('a');
            Array.from(aTags).forEach((a) => {
                const href = a.getAttribute('href') || '';
                if (!href.includes('gall')) return;

                const match  = href.match(/\/([^\/?#]+)$/);
                function getGallIdFromUrl() {
                    const url = new URL(location.href);
                    return url.searchParams.get('id'); // 없으면 null
                }

                // 사용 예시
                const gallId = getGallIdFromUrl();
                console.log('gallId:', gallId);

                const wl = whiteList?.[userId];
                const bl = blackList?.[userId];

                // 허용 조건: (화이트리스트에 포함) 또는 (블랙리스트 존재하고 거기에 포함 안됨)
                const allowed =
                      (wl && wl.includes(gallId)) ||
                      (bl && !bl.includes(gallId));

                if (!allowed) {
                    document.querySelectorAll('.gall_listwrap').forEach(el => el.remove());
                    document.querySelectorAll('.list_bottom_btnbox').forEach(el => el.remove());
                    document.querySelectorAll('.cmt_write_box').forEach(el => el.remove());
                    document.querySelectorAll('.view_bottom_btnbox').forEach(el => el.remove());
                    document.querySelectorAll('.btn_write').forEach(el => el.remove());
                }
            });
        });
    }

    // 1) 작성자 닉/아이피 렌더링
    function handleWriters(root) {
        if (!root) return;
        Array.from(root.getElementsByClassName('ub-writer')).forEach(function (e) {
            let nick = e.getAttribute('data-nick');
            let uid  = e.getAttribute('data-uid');

            // 익명(ㅇㅇ) + uid 있으면 uid로 표기
            if (nick === 'ㅇㅇ' && uid !== '') {
                nick = uid;
            }

            // IP 표시
            if (e.getAttribute('data-ip')) {
                const { nick: ipNick, color } = idGenerator(e.getAttribute('data-ip'), e.getAttribute('data-ip'), true);
                const targetEle = e.getElementsByClassName('ip')[0];
                if (targetEle) {
                    targetEle.innerHTML = ipNick;
                    if (color) targetEle.setAttribute('style', `color: ${color}`);
                }
            }

            // UID 표시
            if (e.getAttribute('data-uid')) {
                const { nick: finalNick, color } = idGenerator(e.getAttribute('data-nick'), e.getAttribute('data-uid'));
                const targetEle = e.getElementsByClassName('nickname in')[0];
                if (targetEle) {
                    targetEle.innerHTML = finalNick;
                    if (color) targetEle.setAttribute('style', `color: ${color}`);
                }
            }
        });
    }


    // 2) 차단 목록 숨김 (UI 노출 없이 숨김만 수행)
    function handleBlocklist(root) {
        if (!root) return;
        Array.from(root.getElementsByClassName('ub-writer')).forEach((e) => {
            const uid = e.getAttribute('data-uid');
            if (!uid) return;
            if (isHidden(uid)) {
                const box = e.parentElement;
                // 댓글
                if (box && box.getAttribute('class') === 'cmt_nickbox') {
                    const li = box.parentElement;
                    if (li) li.style.display = 'none';
                } else if (box) {
                    // 글/목록
                    box.style.display = 'none';
                }
            }
        });
    }

    // 3) 멘션 표기 교체 (@닉네임)
    function handleMentions(root) {
        if (!root) return;
        Array.from(root.getElementsByClassName('mention')).forEach(function (mention) {
            const targetId = mention.getAttribute('href')?.match(/\d+/)?.[0];
            const targetReply =
                  document.getElementById('reply_li_' + targetId) ||
                  document.getElementsByClassName('copy_' + targetId)[0];

            if (!mention) return;

            if (targetReply) {
                const e = targetReply?.querySelector('.ub-writer');
                if (!e) return;
                const anonym   = e.querySelectorAll('.nickname.an')[0]?.innerText;
                const dataNick = e.getAttribute('data-nick');
                const dataUid  = e.getAttribute('data-uid');
                const dataIp   = e.getAttribute('data-ip');

                const { nick } = idGenerator(anonym || dataNick, dataUid || dataIp);
                mention.innerText = `@${nick}`;
            } else if (!mention.innerText.includes('[Not Found]')) {
                mention.innerText = mention.innerText + ' [Not Found]';
            }
        });
    }


    // 4) 검색 영역 필터 (.gall_name 숨김)
    function handleSearchArea(root) {
        if (!root) return;
        Array.from(document.getElementsByClassName('gall_name')).forEach((e) => {
            if (ignoreGallName.includes(e.innerText)) {
                e.parentElement.style.display = 'none';
            }
        });
    }

    // 5) 낚시 링크 표시 (.cmt_txtbox 안, a[href] + 플레인 텍스트)
    function handleFishingLinks(root) {
        if (!root) return;
        const curId = getCurrentPostId();
        if (!curId) return;

        // (a) a[href] 한 번만 처리
        root.querySelectorAll('.cmt_txtbox a[href]').forEach(a => {
            if (a.dataset.fishingChecked === '1') return;
            a.dataset.fishingChecked = '1';

            const postId = extractPostId(a.getAttribute('href'));
            if (postId === curId) {
                const t = a.textContent || '';
                if (!/\(낚시\)\s*$/.test(t)) {
                    a.textContent = t.trim() + ' (낚시)';
                }
            }
        });

        // (b) 플레인 텍스트 URL 처리 (a 내부 텍스트 제외)
        const walker = document.createTreeWalker(
            root,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode(node) {
                    if (node.parentElement && node.parentElement.closest('a')) return NodeFilter.FILTER_REJECT;
                    if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
                    if (!node.parentElement?.closest('.cmt_txtbox')) return NodeFilter.FILTER_REJECT; // .cmt_txtbox 한정
                    return NodeFilter.FILTER_ACCEPT;
                }
            }
        );

        const urlRegexNoDup = /(https?:\/\/[^\s]+)(?!\s*\(낚시\))/g;
        let node;
        while ((node = walker.nextNode())) {
            const before = node.nodeValue;
            let changed = false;
            const after = before.replace(urlRegexNoDup, (url) => {
                const pid = extractPostId(url);
                if (pid === curId) {
                    changed = true;
                    return url + ' (낚시)';
                }
                return url;
            });
            if (changed) node.nodeValue = after;
        }
    }


    // ========================
    // Pipeline
    // ========================
    function runPipeline() {
        const boardWriter = $('.gallview_head');
        const boardRoot   = $('.gall_listwrap');
        const commentRoot = $('.view_comment');
        const searchRoot  = $('#kakao_search');

        // 화이트/블랙리스트 게이트
        handleGallAccessByList(document);

        if (boardRoot) {
            handleWriters(boardWriter);
            handleWriters(boardRoot);
            handleBlocklist(boardRoot);      // 차단 숨김 유지
        }
        if (commentRoot) {
            handleWriters(commentRoot);
            handleMentions(commentRoot);
            handleFishingLinks(commentRoot);
            handleBlocklist(commentRoot);    // 차단 숨김 유지
        }
        if (searchRoot) {
            handleSearchArea(searchRoot);
        }
    }

    // ========================
    // Observers (루트별 1개 + 디바운스)
    // ========================
    const config = { childList: true, subtree: true, characterData: true };

    function bindObserver(getRoot) {
        const obs = new MutationObserver((ml) => {
            if (!ml?.length) return;
            schedule(runPipeline);
        });
        const root = getRoot();
        if (root) obs.observe(root, config);
        return { obs, getRoot };
    }

    // ========================
    // Init
    // ========================
    window.onload = function () {
        console.log('Custom Script Loaded');
        runPipeline();                   // 최초 1회 처리

        // 루트별 옵저버
        const obsBoard   = bindObserver(() => $('.wrapGL'));
        const obsComment = bindObserver(() => $('.view_comment'));
        const obsSearch  = bindObserver(() => $('#kakao_search'));

        // 탭 복귀 시 재실행
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) schedule(runPipeline);
        });
    };
})();