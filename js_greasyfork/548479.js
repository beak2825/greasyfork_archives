// ==UserScript==
// @name         애니라이프 MediaSession TMDB (디버그 상세)
// @namespace    http://tampermonkey.net/
// @version      2.46
// @description  anilife.app/watch 전용 — TMDB 검색, 매핑, 포스터, MediaSession 설정 + 세부 로그 강화
// @match        *://anilife.app/watch*
// @match        *://www.anilife.app/watch*
// @icon         https://anilife.app/favicon.ico
// @grant        GM_xmlhttpRequest
// @connect      api.themoviedb.org
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548479/%EC%95%A0%EB%8B%88%EB%9D%BC%EC%9D%B4%ED%94%84%20MediaSession%20TMDB%20%28%EB%94%94%EB%B2%84%EA%B7%B8%20%EC%83%81%EC%84%B8%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548479/%EC%95%A0%EB%8B%88%EB%9D%BC%EC%9D%B4%ED%94%84%20MediaSession%20TMDB%20%28%EB%94%94%EB%B2%84%EA%B7%B8%20%EC%83%81%EC%84%B8%29.meta.js
// ==/UserScript==

(function() {
'use strict';
console.log("%c[Anilife Debug] ✅ 스크립트 로드됨:", "color:#6cf;font-weight:bold;", location.href);

const TMDB_KEY = localStorage.getItem("tmdb-api-v3") || "여기에_직접_API_KEY_입력"; //localStorage.setItem('tmdb-api-v3','키값')
const LANG = "ko-KR";
const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

function debugLog(...args) { console.log("[Anilife Debug]", ...args); }

debugLog("📱 환경:", isMobile ? "모바일" : "데스크탑");
if (!TMDB_KEY || TMDB_KEY.includes("입력")) {
    console.warn("[Anilife Debug] ❌ TMDB 키가 없습니다.");
    return;
}

const useRandomPoster = 0;

// ===== 매핑 =====
const seriesTMDBIdMap = {
    "원펀맨": "63926",
};
const seriesSeasonMap = {
    "나의 히어로 아카데미아 FINAL SEASON": 8,
    "터무니없는 스킬로 이세계 방랑 밥 2": 1,
    "결혼반지 이야기2기": 1,
    "란마1/2 2기": 1,
};
const seriesPosterMap = {
    "나의 히어로 아카데미아 FINAL SEASON": "60H3CpA6PRMG5IEnoZRq4yjOkfo",
    "불멸의 그대에게 3기": "2IIJ9sGdqhXs9k1PvznWbBmPaCY",
    "아르마 짱은 가족이 되고 싶어": "yqZQMMVssLWcYiD9NJm7OupWCl4",
    "스파이×패밀리 3기": "vDGB41PATBLb5GaXTfG1weZ03Xr",
};
const seriesEpisodeMap = {
    "터무니없는 스킬로 이세계 방랑 밥 2": 13,
    "결혼반지 이야기2기": 13,
    "란마1/2 2기": 13,
};
const episodeTitleExcludeRegex = [
    /^에피소드\s*\d+$/i,
    /^제\d+화$/i,
];
// 🏴‍☠️ 원피스 시즌 매핑
const onePieceSeasonMap = [
        { start: 1, end: 61, season: 1 }, { start: 62, end: 77, season: 2 }, { start: 78, end: 91, season: 3 },
        { start: 92, end: 130, season: 4 }, { start: 131, end: 143, season: 5 }, { start: 144, end: 195, season: 6 },
        { start: 196, end: 228, season: 7 }, { start: 229, end: 263, season: 8 }, { start: 264, end: 336, season: 9 },
        { start: 337, end: 381, season: 10 }, { start: 382, end: 407, season: 11 }, { start: 408, end: 421, season: 12 },
        { start: 422, end: 522, season: 13 }, { start: 523, end: 580, season: 14 }, { start: 581, end: 642, season: 15 },
        { start: 643, end: 692, season: 16 }, { start: 693, end: 748, season: 17 }, { start: 749, end: 803, season: 18 },
        { start: 804, end: 877, season: 19 }, { start: 878, end: 891, season: 20 }, { start: 892, end: 1088, season: 21 },
        { start: 1089, end: 9999, season: 22 },
];

let lastBlobUrl = null;
let lastSeriesKey = null;


// ===================== Utility =====================
function gmFetchJSON(url) {
    //debugLog("🌐 TMDB 요청:", url);
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: "GET",
            url,
            onload: res => {
                try {
                    const parsed = JSON.parse(res.responseText);
                    debugLog("📦 TMDB 응답 수신:", parsed?.results?.length ?? "단일 데이터");
                    resolve(parsed);
                } catch (e) {
                    console.error("[Anilife Debug] ❌ TMDB 응답 파싱 실패:", e);
                    reject(e);
                }
            },
            onerror: err => {
                console.error("[Anilife Debug] ❌ TMDB 요청 오류:", err);
                reject(err);
            }
        });
    });
}

function gmFetchBlobUrl(url) {
    //debugLog("🖼️ 포스터 요청:", url);
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: "GET",
            url,
            responseType: "blob",
            onload: res => {
                try {
                    if (lastBlobUrl) URL.revokeObjectURL(lastBlobUrl);
                    const blobUrl = URL.createObjectURL(res.response);
                    lastBlobUrl = blobUrl;
                    debugLog("🖼️ Blob 변환 성공:", blobUrl);
                    resolve(blobUrl);
                } catch(e) {
                    console.error("[Anilife Debug] ❌ Blob 변환 실패:", e);
                    reject(e);
                }
            },
            onerror: err => {
                console.error("[Anilife Debug] ❌ Blob 요청 오류:", err);
                reject(err);
            }
        });
    });
}

function parseWatchInfo() {
    const titleEl = document.querySelector("h2.inline-block.text-sm.font-medium,h1.dh-DkEc,h1");
    const epEl = document.querySelector("span.line-clamp-3.text-sm.font-bold,h3.wed0o5R,h3");
    if (!titleEl || !epEl) return null;

    const seriesTitle = titleEl.textContent.trim();
    const epRaw = epEl.textContent.trim();

    // 🔧 정규식 강화: "1051화", "에피소드 1051", "Watch 1051" 등 다 잡기
    const match = epRaw.match(/(?:에피소드|Episode|Watch)?\s*(\d{1,4})\s*(?:화|part)?/i);
    const episode = match ? parseInt(match[1], 10) : null;

    debugLog("🎬 감지된 시리즈 정보:", { seriesTitle, episode, epRaw });
    return { seriesTitle, episode };
}

function pickPosterFromDetail(detail, seriesTitle) {
    const size = "w154";
    const posters = detail?.images?.posters || [];
    debugLog("🖼️ 포스터 후보 수:", posters.length);

    // ✅ 강제 매핑 우선
    if (seriesPosterMap[seriesTitle]) {
        debugLog("🖼️ 포스터: 강제 매핑 사용");
        return `https://images.weserv.nl/?url=image.tmdb.org/t/p/${size}/${seriesPosterMap[seriesTitle]}.jpg`;
    }

    // ✅ 랜덤 선택 헬퍼
    const pickRandom = arr => arr[Math.floor(Math.random() * arr.length)];

    // ✅ 한글 포스터 선택
    const koPosters = posters.filter(p => p.iso_639_1 === "ko");
    if (koPosters.length > 0) {
        if (useRandomPoster) {
            const selected = pickRandom(koPosters);
            debugLog(`🖼️ 한국어 포스터 (${koPosters.length}개 중 랜덤 선택) → ${selected.file_path}`);
            return `https://images.weserv.nl/?url=image.tmdb.org/t/p/${size}${selected.file_path}`;
        } else {
            debugLog("🖼️ 한국어 포스터 선택 (첫 번째)");
            return `https://images.weserv.nl/?url=image.tmdb.org/t/p/${size}${koPosters[0].file_path}`;
        }
    }

    // ✅ 언어 없는 포스터 선택
    const noLangPosters = posters.filter(p => !p.iso_639_1 || p.iso_639_1 === "xx");
    if (noLangPosters.length > 0) {
        if (useRandomPoster) {
            const selected = pickRandom(noLangPosters);
            debugLog(`🖼️ 언어 없음 포스터 (${noLangPosters.length}개 중 랜덤 선택) → ${selected.file_path}`);
            return `https://images.weserv.nl/?url=image.tmdb.org/t/p/${size}${selected.file_path}`;
        } else {
            debugLog("🖼️ 언어 없음 포스터 선택 (첫 번째)");
            return `https://images.weserv.nl/?url=image.tmdb.org/t/p/${size}${noLangPosters[0].file_path}`;
        }
    }

    // ✅ 포스터 없음
    debugLog("⚠️ 포스터 없음");
    return null;
}

async function tmdbLookup(seriesTitle) {
    const mapped = seriesTMDBIdMap[seriesTitle];
    if (mapped) {
        debugLog("🧩 TMDB ID 매핑 사용:", mapped);
        return gmFetchJSON(`https://api.themoviedb.org/3/tv/${mapped}?api_key=${TMDB_KEY}&language=${LANG}&append_to_response=images&include_image_language=ko,xx`);
    }
    const q = seriesTitle.replace(/(\d+기|파트\s*\d+|\s\d+)$/,"").trim();
    debugLog("🔍 TMDB 검색어:", q);
    const data = await gmFetchJSON(`https://api.themoviedb.org/3/search/tv?api_key=${TMDB_KEY}&language=${LANG}&query=${encodeURIComponent(q)}`);
    if (data.results?.length) {
        debugLog("✅ TMDB 검색 성공:", data.results[0].name);
        return gmFetchJSON(`https://api.themoviedb.org/3/tv/${data.results[0].id}?api_key=${TMDB_KEY}&language=${LANG}&append_to_response=images&include_image_language=ko,xx`);
    }
    debugLog("❌ TMDB 검색 결과 없음");
    return null;
}

async function setMediaSession(mediaTitle, artistText, posterUrl) {
    if (!("mediaSession" in navigator)) return;
    let artworkArr = [];

    async function urlToDataUrl(url) {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        } catch (err) {
            debugLog("⚠️ DataURL 변환 실패:", err);
            return null;
        }
    }

    if (posterUrl) {
        try {
            if (isMobile) {
                debugLog("📱 모바일 환경 - DataURL 변환 시도");
                const dataUrl = await urlToDataUrl(posterUrl);
                if (dataUrl) {
                    artworkArr = [{ src: dataUrl, sizes: "154x138", type: "image/jpeg" }];
                    debugLog("✅ DataURL 변환 성공 (길이:", dataUrl.length, ")");
                } else {
                    debugLog("⚠️ DataURL 변환 실패, 원본 URL fallback");
                    artworkArr = [{ src: posterUrl, sizes: "154x138", type: "image/jpeg" }];
                }
            } else {
                debugLog("💻 데스크탑 환경 - Blob 변환 시도");
                const blobUrl = await gmFetchBlobUrl(posterUrl);
                if (blobUrl) {
                    artworkArr = [{ src: blobUrl, sizes: "154x138", type: "image/jpeg" }];
                } else {
                    artworkArr = [{ src: posterUrl, sizes: "154x138", type: "image/jpeg" }];
                }
            }
        } catch (e) {
            debugLog("⚠️ 포스터 처리 중 오류:", e);
            artworkArr = [{ src: posterUrl, sizes: "154x138", type: "image/jpeg" }];
        }
    }

    navigator.mediaSession.metadata = new MediaMetadata({
        title: mediaTitle,
        artist: artistText,
        album: "루션",
        artwork: artworkArr
    });

    debugLog("🎧 MediaSession 설정 완료:", {
        title: mediaTitle,
        artist: artistText,
        artworkType: artworkArr[0]?.src?.substring(0, 30),
        artworkCount: artworkArr.length
    });
}

async function initOnce(force = false) {
    const info = parseWatchInfo();
    if (!info) return;

    await new Promise(r => setTimeout(r, 500));

    let baseTitle = info.seriesTitle.trim();
    let seasonNum = 1;

    // 매핑 우선 적용
if (seriesSeasonMap[info.seriesTitle]) {
    seasonNum = seriesSeasonMap[info.seriesTitle];
} else if (info.seriesTitle.includes("원피스")) {
    // 🏴‍☠️ 원피스 시즌 자동 매핑 적용
    const map = onePieceSeasonMap.find(m => info.episode >= m.start && info.episode <= m.end);
    seasonNum = map ? map.season : 21; // 기본값 21기
    debugLog("🏴‍☠️ 원피스 시즌 자동 매핑:", { episode: info.episode, seasonNum });
} else {
    // 일반 규칙
    const match = baseTitle.match(/\s*(?:파트\s*)?(\d+)(?:기)?$/);
    if (match) {
        seasonNum = parseInt(match[1], 10);
        baseTitle = baseTitle.replace(/\s*(?:파트\s*)?\d+(?:기)?$/, "").trim();
    }
}

    const seriesKey = `${baseTitle}__${info.episode}`;
    if (!force && seriesKey === lastSeriesKey) return;
    lastSeriesKey = seriesKey;

    debugLog("🚀 처리 시작:", seriesKey);

    // TMDB 조회
    const detail = await tmdbLookup(baseTitle);
    if (!detail) { debugLog("❌ TMDB 데이터 없음"); return; }

    // TMDB에서 에피소드 정보 가져오기
let episodeNum = info.episode;

// "로컬 1화 = TMDB baseEpisode" 규칙 적용
if (seriesEpisodeMap[info.seriesTitle]) {
    const baseEp = seriesEpisodeMap[info.seriesTitle];

    // TMDB화 = baseEpisode + (local - 1)
    episodeNum = baseEp + (info.episode - 1);

    debugLog("🧮 에피소드 변환:", {
        series: info.seriesTitle,
        localEpisode: info.episode,
        baseEpisode: baseEp,
        tmdbEpisode: episodeNum
    });
}
    let episodeDetail = null;

    if (detail.seasons && detail.seasons.length > 0) {
        // 시즌번호 조정
let seasonDetail = detail.seasons.find(s => s.season_number === seasonNum);
if (!seasonDetail) {
    // fallback: 가장 높은 시즌 사용
    seasonDetail = detail.seasons[detail.seasons.length - 1];
}
const seasonId = seasonDetail.season_number;

        try {
            episodeDetail = await gmFetchJSON(
                `https://api.themoviedb.org/3/tv/${detail.id}/season/${seasonId}/episode/${episodeNum}?api_key=${TMDB_KEY}&language=${LANG}`
            );
        } catch (e) {
            debugLog("❌ TMDB 에피소드 조회 실패:", e);
        }
    }

    // 제목 결정
// TMDB 제목이 있으면 TMDB 제목 사용, 없으면 baseTitle
let mediaTitle = detail?.name || detail?.original_name || baseTitle;

// 시즌이 2개 이상일 때만 "1기, 2기" 표시
const totalSeasons = (detail.seasons?.filter(s => s.season_number > 0).length) || 1; // Special 시즌(0) 제외
if (totalSeasons >= 2) {
    mediaTitle += ` ${seasonNum}기`;
}

// 에피소드 번호 추가
mediaTitle += ` | ${episodeNum}화`;

    // 아티스트 결정
let artistText = `${episodeNum}화 | TMDB`;
if (episodeDetail && episodeDetail.name) {
    const epName = episodeDetail.name.trim();
    const isExcluded = episodeTitleExcludeRegex.some(rx => rx.test(epName));
    if (!isExcluded) {
        artistText = `${episodeNum}화 - ${epName} | TMDB`;
    }
}

    // 포스터 결정
    const posterUrl = pickPosterFromDetail(detail, info.seriesTitle.trim());

    await setMediaSession(mediaTitle, artistText, posterUrl);
    document.title = mediaTitle;

    debugLog("🎯 최종 처리 완료:", {
        mediaTitle,
        artistText,
        posterUrl,
        episodeNum,
        seasonNum,
        tmdbId: detail?.id,
    });
}

// ===== 감시 =====
let lastUrl = location.href;
let lastTitleText = null;
let domObserver = null;

function waitForDOMAndInit() {
    if (domObserver) domObserver.disconnect();
    debugLog("🔎 DOM 감시 시작:", location.href);

    domObserver = new MutationObserver(() => {
        const titleEl = document.querySelector("h2.inline-block.text-sm.font-medium,h1.dh-DkEc,h1");
        const epEl = document.querySelector("span.line-clamp-3.text-sm.font-bold,h3.wed0o5R,h3");
        if (!titleEl || !epEl) return;

        const combined = titleEl.textContent.trim() + " " + epEl.textContent.trim();
        if (combined !== lastTitleText) {
            debugLog("🌀 DOM 변경 감지:", combined);
            lastTitleText = combined;
            domObserver.disconnect();
            setTimeout(() => initOnce(true), 300);
        }
    });
    domObserver.observe(document.body, { childList: true, subtree: true });
}

function startUrlWatcher() {
    debugLog("🌍 URL 감시 시작");
    setInterval(() => {
        const currentUrl = location.href;
        if (currentUrl !== lastUrl) {
            debugLog("🔄 URL 변경 감지:", currentUrl);
            lastUrl = currentUrl;
            if (currentUrl.includes("/watch")) waitForDOMAndInit();
        }
    }, 1000);
}

if (location.href.includes("/watch")) waitForDOMAndInit();
startUrlWatcher();

})();
