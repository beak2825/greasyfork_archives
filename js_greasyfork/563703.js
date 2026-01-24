// ==UserScript==
// @name        [루시퍼홍] 아실 지도에 실거래수 표시하기
// @namespace   Violentmonkey Scripts
// @match       https://asil.kr/asil/*
// @grant       GM_info
// @grant       none
// @version     1.3
// @description 2026. 1. 23. 아실 지도 마커에 최근 3개월 매매/전세 실거래수를 표시

// @downloadURL https://update.greasyfork.org/scripts/563703/%5B%EB%A3%A8%EC%8B%9C%ED%8D%BC%ED%99%8D%5D%20%EC%95%84%EC%8B%A4%20%EC%A7%80%EB%8F%84%EC%97%90%20%EC%8B%A4%EA%B1%B0%EB%9E%98%EC%88%98%20%ED%91%9C%EC%8B%9C%ED%95%98%EA%B8%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/563703/%5B%EB%A3%A8%EC%8B%9C%ED%8D%BC%ED%99%8D%5D%20%EC%95%84%EC%8B%A4%20%EC%A7%80%EB%8F%84%EC%97%90%20%EC%8B%A4%EA%B1%B0%EB%9E%98%EC%88%98%20%ED%91%9C%EC%8B%9C%ED%95%98%EA%B8%B0.meta.js
// ==/UserScript==

/* ===============================
 * 0) 업데이트 팝업 (기존 유지)
 * =============================== */
(function () {
  'use strict';

  // GM_info가 없을 수도 있어 안전 처리
  const info = (typeof GM_info !== "undefined" && GM_info && GM_info.script) ? GM_info : null;
  if (!info) return;

  const currentVersion = info.script.version;
  const scriptName = info.script.name;
  console.log(scriptName + ' ' + "currentVersion: " + currentVersion);

  const updateUrl = info.script.updateURL;
  const cafeUrl = 'https://cafe.naver.com/wecando7/11668161';
  const popupDismissKey = 'scriptUpdatePopupDismissed';
  const dismissDuration = 24 * 60 * 60 * 1000; // 24시간

  function getKoreanTime() {
    const now = new Date();
    const utcNow = now.getTime() + (now.getTimezoneOffset() * 60000);
    return new Date(utcNow + (9 * 60 * 60 * 1000));
  }

  function formatDateTo24Hour(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  fetch(`${updateUrl}?_=${Date.now()}`)
    .then(r => r.text())
    .then(meta => {
      const latestVersionMatch = meta.match(/@version\s+([^\s]+)/);
      if (!latestVersionMatch) return;

      const latestVersion = latestVersionMatch[1];
      console.log(scriptName + ' ' + "latestVersion: " + latestVersion);

      if (currentVersion !== latestVersion) {
        if (!shouldDismissPopup()) showUpdatePopup(latestVersion);
      }
    })
    .catch(err => console.error('Failed to fetch the latest version information:', err));

  function shouldDismissPopup() {
    const lastDismissTime = localStorage.getItem(popupDismissKey);
    if (!lastDismissTime) return false;
    const timeSinceDismiss = getKoreanTime().getTime() - new Date(lastDismissTime).getTime();
    return timeSinceDismiss < dismissDuration;
  }

  function dismissPopup() {
    const koreanTime = getKoreanTime();
    const formattedTime = formatDateTo24Hour(koreanTime);
    localStorage.setItem(popupDismissKey, formattedTime);
  }

  function showUpdatePopup(latestVersion) {
    const popup = document.createElement('div');
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.padding = '20px';
    popup.style.backgroundColor = 'white';
    popup.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
    popup.style.zIndex = '10000';

    const message = document.createElement('p');
    message.innerHTML = `${scriptName} (${latestVersion}) 버젼 업데이트가 있습니다. 확인하시겠습니까?<br><br>(닫기 버튼을 누르실 경우 24시간 동안 다시 알림이 뜨지 않습니다)<br><br>`;
    popup.appendChild(message);

    const confirmButton = document.createElement('button');
    confirmButton.textContent = '확인';
    confirmButton.style.marginRight = '10px';
    confirmButton.onclick = () => {
      window.open(cafeUrl, '_blank');
      document.body.removeChild(popup);
    };
    popup.appendChild(confirmButton);

    const closeButton = document.createElement('button');
    closeButton.textContent = '닫기';
    closeButton.onclick = () => {
      dismissPopup();
      document.body.removeChild(popup);
    };
    popup.appendChild(closeButton);

    document.body.appendChild(popup);
  }
})();

/* ===============================
 * 1) 설정
 * =============================== */
const MIN_ZOOM = 16;
const DEBUG_COUNT = false;     // ✅ 성능 위해 기본 false
const COUNT_LOG_LIMIT = 30;    // DEBUG_COUNT=true 일 때만 사용

/* ===============================
 * 2) 줌 레벨 체크
 * =============================== */
function isZoomLevelEnough(minZoom = MIN_ZOOM) {
  const m = window.map;
  if (!m || typeof m.getZoom !== "function") return false;
  return m.getZoom() >= minZoom;
}

/* ===============================
 * 3) 최근 3개월(월 단위) yyyymm set
 * =============================== */
function getLast3MonthsSet(baseDate = new Date()) {
  const set = new Set();
  for (let i = 0; i < 3; i++) {
    const d = new Date(baseDate.getFullYear(), baseDate.getMonth() - i, 1);
    const yyyymm = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}`;
    set.add(yyyymm);
  }
  return set;
}

/* ===============================
 * 4) 최근 3개월 거래 건수 계산
 *   - reg_gbn: "0"=전세, "1"/"2"=매매 (현 로직)
 * =============================== */
function countLast3MonthsDealJeonse(valArray, baseDate = new Date(), debug = DEBUG_COUNT) {
  const targetMonths = getLast3MonthsSet(baseDate);

  let dealCount = 0;
  let jeonseCount = 0;

  const regStats = new Map();
  let totalTrades = 0;
  let logged = 0;

  if (debug) {
    console.groupCollapsed(
      `[DEBUG] countLast3MonthsDealJeonse() start | months=${Array.from(targetMonths).join(",")}`
    );
    console.log("valArray type:", Array.isArray(valArray) ? "array" : typeof valArray, "len:", valArray?.length);
  }

  (valArray || []).forEach(monthBlock => {
    const yyyymm = String(monthBlock?.yyyymm ?? "").trim();
    if (!targetMonths.has(yyyymm)) return;

    (monthBlock?.val || []).forEach(dayBlock => {
      const day = String(dayBlock?.day ?? "").trim();
      const trades = dayBlock?.val;
      if (!Array.isArray(trades)) return;

      trades.forEach((t, idx) => {
        totalTrades += 1;

        const rawReg = t?.reg_gbn;
        const reg = String(rawReg ?? "").trim();

        regStats.set(reg, (regStats.get(reg) || 0) + 1);

        let cls = "SKIP";
        if (reg === "0") {
          jeonseCount += 1;
          cls = "JEONSE";
        } else if (reg === "1" || reg === "2") {
          dealCount += 1;
          cls = "DEAL";
        }

        if (debug && logged < COUNT_LOG_LIMIT) {
          logged += 1;
          console.log(
            `[${yyyymm}-${String(day).padStart(2, "0")}] #${idx} reg_gbn(raw)=`,
            rawReg,
            `-> reg="${reg}" => ${cls}`,
            { type: t?.type, floor: t?.floor, jw_gbn: t?.jw_gbn, money: t?.money, rent: t?.rent }
          );
        }
      });
    });
  });

  if (debug) {
    console.log("totalTrades(in last3months):", totalTrades);
    console.log("reg_gbn stats:", Object.fromEntries(regStats.entries()));
    console.log("RESULT => dealCount:", dealCount, "jeonseCount:", jeonseCount);
    console.groupEnd();
  }

  return { dealCount, jeonseCount };
}

/* =========================================================
 * 5) ✅ 시도코드 탐색 로직 (UI/지도 기반 시도 감지 제거)
 *    - 목적: aptId마다 전국 순회를 최대한 피함
 *    - 규칙:
 *      (1) 첫 aptId로 primary 시도를 전국 순회로 1번만 확보
 *      (2) 이후 대부분 primary로 1회만 요청
 *      (3) 실패 단지만 boundary 후보(발견된 인접 시도) 우선 시도
 *      (4) 그래도 실패하면 primary 인접 스파이럴(±1,±2...)로 “새 후보” 발굴
 *      (5) 최후에 전국 전체(아주 드물게)
 * ========================================================= */

// 전국 시도코드(사용자가 준 option 순서)
const ASIL_SIDO_CODES = [
  "11","41","26","27","28","29","30","31","36","42","43","44","45","46","47","48","50"
];

// 전역(지역 단위) 캐시
let __primarySidoCode = null;                 // 처음 성공한 대표 시도
const __boundarySidoCandidates = [];          // 경계에서 성공한 시도들(발견 순서 유지)
const __aptSidoCache = new Map();             // aptId -> sido (경계 단지 고정용)

// primary 기준 인접 스파이럴(±1,±2...)
function buildAdjacentSpiral(centerCode) {
  const idx0 = ASIL_SIDO_CODES.indexOf(centerCode);
  if (idx0 < 0) return [...ASIL_SIDO_CODES];

  const out = [];
  for (let step = 1; step < ASIL_SIDO_CODES.length; step++) {
    const left  = (idx0 - step + ASIL_SIDO_CODES.length) % ASIL_SIDO_CODES.length;
    const right = (idx0 + step) % ASIL_SIDO_CODES.length;
    out.push(ASIL_SIDO_CODES[left], ASIL_SIDO_CODES[right]);
  }
  return Array.from(new Set(out));
}

function buildAsilUrlWithSido(aptId, sido, start = 0, count = 50) {
  const params = new URLSearchParams({
    sido: String(sido),
    dealmode: "12",
    building: "apt",
    seq: String(aptId),
    m2: "0",
    py: "",
    py_type: "",
    isPyQuery: "false",
    year: "9999",
    u: "null",
    start: String(start),
    count: String(count),
    dong_name: "",
    order: ""
  });
  return `https://asil.kr/app/data/apt_price_m2_mjw_newver_6.jsp?${params.toString()}`;
}


function isValidValArray(valArray) {
  return Array.isArray(valArray) && valArray.length > 0;
}

async function fetchWithSido(aptId, sido, start = 0, count = 50) {
  const url = buildAsilUrlWithSido(aptId, sido, start, count);

  const res = await fetch(url, {
    method: "GET",
    mode: "cors",
    credentials: "include",
    headers: { accept: "*/*" }
  });

  if (!res.ok) return { ok: false, status: res.status, sido, json: null, reason: "http" };

  let json;
  try { json = await res.json(); }
  catch { return { ok: false, status: res.status, sido, json: null, reason: "json" }; }

  const valArray = json?.[0]?.val;
  if (!isValidValArray(valArray)) {
    return { ok: false, status: res.status, sido, json, reason: "empty_val" };
  }
  return { ok: true, status: res.status, sido, json, reason: "ok" };
}

function countTradesInValArray(valArray) {
  let n = 0;
  for (const monthBlock of (valArray || [])) {
    for (const dayBlock of (monthBlock?.val || [])) {
      const trades = dayBlock?.val;
      if (Array.isArray(trades)) n += trades.length;
    }
  }
  return n;
}


async function fetchCountsPaged(aptId, sido) {
  const PAGE = 50;
  const MAX_PAGES = 200;        // 안전장치(무한루프 방지)
  const baseDate = new Date();

  let dealCount = 0;
  let jeonseCount = 0;

  let loggedOver50 = false;
  let loggedOver100 = false;

  let start = 0;

  for (let pageNo = 0; pageNo < MAX_PAGES; pageNo++) {
    const r = await fetchWithSido(aptId, sido, start, PAGE);
    if (!r.ok) break;

    const valArray = r.json?.[0]?.val;
    if (!isValidValArray(valArray)) break;

    // ✅ 이번 페이지 전체 거래 수(응답에 들어있는 전체, 최근3개월 필터 아님)
    const totalInThisPage = countTradesInValArray(valArray);
    if (totalInThisPage <= 0) break;

    // ✅ 이번 페이지에서 “최근 3개월”만 집계
    const { dealCount: d, jeonseCount: j } =
      countLast3MonthsDealJeonse(valArray, baseDate, false);

    dealCount += d;
    jeonseCount += j;

    const totalRecent = dealCount + jeonseCount;

    // ✅ 누적 50/100 초과 로그(각 1회)
    if (!loggedOver50 && totalRecent > 50) {
      loggedOver50 = true;
      console.log("[실거래][누적 50 초과]", `apt=${aptId}`, `sido=${sido}`, `total=${totalRecent}`, `start=${start}`, `pageNo=${pageNo}`);
    }
    if (!loggedOver100 && totalRecent > 100) {
      loggedOver100 = true;
      console.log("[실거래][누적 100 초과]", `apt=${aptId}`, `sido=${sido}`, `total=${totalRecent}`, `start=${start}`, `pageNo=${pageNo}`);
    }

    // ✅ 3개월 범위가 끝났으면 종료
    // (현재 페이지에 3개월보다 과거가 섞이기 시작하면 다음은 더 과거일 확률이 큼)
    const needMore = shouldFetchMoreForRecent3Months(valArray, baseDate);
    if (!needMore) break;

    // ✅ 핵심: start를 “50 고정”이 아니라 “실제 받은 개수”만큼 증가
    start += totalInThisPage;
  }

  return { dealCount, jeonseCount };
}



function getOldestYyyymmInValArray(valArray) {
  let oldest = null;
  for (const m of (valArray || [])) {
    const ym = String(m?.yyyymm ?? "").trim();
    if (!/^\d{6}$/.test(ym)) continue;
    if (!oldest || ym < oldest) oldest = ym; // 문자열 비교로 OK (yyyymm)
  }
  return oldest; // 예: "202111"
}

function shouldFetchMoreForRecent3Months(valArray, baseDate = new Date()) {
  const months = Array.from(getLast3MonthsSet(baseDate)); // 예: ["202601","202512","202511"]
  months.sort(); // 오름차순: ["202511","202512","202601"]
  const oldestTarget = months[0];

  const oldestInPage = getOldestYyyymmInValArray(valArray);
  if (!oldestInPage) return false;

  // 페이지에 이미 3개월보다 과거가 섞여 있으면, 이후 페이지는 더 과거 → 추가탐색 불필요
  if (oldestInPage < oldestTarget) return false;

  // 페이지의 최하단이 아직도 최근3개월 범위 안이면, 3개월 데이터가 다음 페이지에도 있을 수 있음
  return true;
}



// ✅ 첫 aptId로 primary를 1회만 확보(전국 순회는 여기서만)
async function ensurePrimarySidoByFirstApt(aptId) {
  if (__primarySidoCode) return __primarySidoCode;

  for (const code of ASIL_SIDO_CODES) {
    const r = await fetchWithSido(aptId, code);
    if (r.ok) {
      __primarySidoCode = code;
      __aptSidoCache.set(String(aptId), code);
      console.log("[실거래] primary sido 확정:", __primarySidoCode, "by apt:", aptId);
      return code;
    }
  }

  console.warn("[실거래] primary sido를 확정하지 못함. apt:", aptId);
  return null;
}

// ✅ aptId에 대한 “최소 탐색” 기반 sido 결정
async function resolveSidoForApt(aptId) {
  const id = String(aptId);

  // (0) apt별 캐시가 있으면 즉시
  if (__aptSidoCache.has(id)) return __aptSidoCache.get(id);

  // (1) primary 확보(첫 apt에서만 전국 순회)
  const primary = await ensurePrimarySidoByFirstApt(id);
  if (!primary) return null;

  // (2) 대부분은 primary 1회로 끝
  {
    const r = await fetchWithSido(id, primary);
    if (r.ok) {
      __aptSidoCache.set(id, primary);
      return primary;
    }
  }

  // (3) 이미 발견된 boundary 후보 우선
  for (const cand of __boundarySidoCandidates) {
    const r = await fetchWithSido(id, cand);
    if (r.ok) {
      __aptSidoCache.set(id, cand);
      return cand;
    }
  }

  // (4) primary 인접 스파이럴로 “새 후보 발굴”
  const spiral = buildAdjacentSpiral(primary);
  for (const cand of spiral) {
    if (cand === primary) continue;
    if (__boundarySidoCandidates.includes(cand)) continue;

    const r = await fetchWithSido(id, cand);
    if (r.ok) {
      __boundarySidoCandidates.push(cand);  // ✅ 새 후보 등록 → 이후 경계단지 공용으로 빨라짐
      __aptSidoCache.set(id, cand);
      console.log("[실거래] boundary 후보 발견:", cand, "by apt:", id, "candidates:", __boundarySidoCandidates);
      return cand;
    }
  }

  // (5) 최후: 전국 전체(드물게)
  for (const cand of ASIL_SIDO_CODES) {
    if (cand === primary) continue;
    if (__boundarySidoCandidates.includes(cand)) continue;

    const r = await fetchWithSido(id, cand);
    if (r.ok) {
      __boundarySidoCandidates.push(cand);
      __aptSidoCache.set(id, cand);
      console.log("[실거래] 전국 순회로 boundary 후보 발견:", cand, "by apt:", id);
      return cand;
    }
  }

  console.warn("[실거래] sido 탐색 실패(모든 시도 실패). apt:", id);
  return null;
}

/* ===============================
 * 6) apt 거래수 캐시/중복방지
 * =============================== */
const tradeCountCache = new Map();     // aptId -> { dealCount, jeonseCount, ts }
const tradeCountInFlight = new Set();  // aptId 진행중 표시

async function fetchDealJeonseCountLast3Months(aptId) {
  const cached = tradeCountCache.get(aptId);
  if (cached && (Date.now() - cached.ts) < 10 * 60 * 1000) {
    return { dealCount: cached.dealCount, jeonseCount: cached.jeonseCount };
  }

  if (tradeCountInFlight.has(aptId)) return null;
  tradeCountInFlight.add(aptId);

  try {
    const id = String(aptId);
    const sido = await resolveSidoForApt(id);
    if (!sido) return null;

    const { dealCount, jeonseCount } = await fetchCountsPaged(id, sido);

    tradeCountCache.set(id, { dealCount, jeonseCount, ts: Date.now() });
    return { dealCount, jeonseCount };
  } catch (e) {
    console.warn("[실거래] fetchDealJeonseCountLast3Months 예외:", aptId, e);
    return null;
  } finally {
    tradeCountInFlight.delete(aptId);
  }
}


/* ===============================
 * 7) UI 뱃지 적용(파란/빨간 원 2개)
 * =============================== */
function onDealJeonseCount(aptId, dealCount, jeonseCount) {
  const el = document.getElementById(`apt${aptId}`) || document.getElementById(String(aptId));
  if (!el) return;

  let badgeWrap = el.querySelector(".hongbu-trade-badgewrap");
  if (!badgeWrap) {
    badgeWrap = document.createElement("div");
    badgeWrap.className = "hongbu-trade-badgewrap";
    badgeWrap.style.cssText = `
      position:absolute;
      right:0;
      bottom:100%;
      transform: translateY(2px);
      z-index:9999;
      display:flex;
      gap:2px;
      pointer-events:none;
      align-items:center;
    `;

    const cs = getComputedStyle(el);
    if (cs.position === "static") el.style.position = "relative";
    el.appendChild(badgeWrap);

    badgeWrap.innerHTML = `
      <div class="hongbu-badge hongbu-badge-deal"></div>
      <div class="hongbu-badge hongbu-badge-jeonse"></div>
    `;
  }

  const dealEl = badgeWrap.querySelector(".hongbu-badge-deal");
  const jeonseEl = badgeWrap.querySelector(".hongbu-badge-jeonse");

  const common = `
    width:20px; height:20px;
    border-radius:50%;
    display:flex; align-items:center; justify-content:center;
    color:#fff;
    font-size:12px;
    font-weight:700;
    line-height:1;
    box-shadow:0 1px 2px rgba(0,0,0,.25);
  `;

  if (dealEl) {
    dealEl.style.cssText = common + `background:#1677ff;`;
    dealEl.textContent = String(dealCount ?? 0);
    dealEl.title = `최근 3개월 매매 ${dealCount ?? 0}건`;
  }

  if (jeonseEl) {
    jeonseEl.style.cssText = common + `background:#ff4d4f;`;
    jeonseEl.textContent = String(jeonseCount ?? 0);
    jeonseEl.title = `최근 3개월 전세 ${jeonseCount ?? 0}건`;
  }
}

/* ===============================
 * 8) 줌<16이면 뱃지 제거
 * =============================== */
function removeAllTradeBadges() {
  document.querySelectorAll(".hongbu-trade-badgewrap").forEach(b => b.remove());
}

/* ===============================
 * 9) 디바운스(연속 추가시 폭주 방지)
 * =============================== */
const pendingAptIds = new Set();
let debounceTimer = null;

function scheduleTradeFetch(aptId) {
  pendingAptIds.add(String(aptId));
  clearTimeout(debounceTimer);

  debounceTimer = setTimeout(async () => {
    if (!isZoomLevelEnough(MIN_ZOOM)) return;

    const ids = Array.from(pendingAptIds);
    pendingAptIds.clear();

    // 순차 실행(동시 fetch 제한)
    for (const id of ids) {
      try {
        const r = await fetchDealJeonseCountLast3Months(id);
        if (!r) continue;
        onDealJeonseCount(id, r.dealCount, r.jeonseCount);
      } catch (e) {
        console.warn("[실거래] fetch 실패:", id, e);
      }
    }
  }, 250);
}

/* ===============================
 * 10) apt 엘리먼트 처리
 * =============================== */
function handleAptElement(el) {
  const rawId = (el.id || "").trim().replace(/[\r\n]/g, "");
  if (!rawId.startsWith("apt")) return;

  const aptId = rawId.replace(/^apt/, "").trim();
  if (!aptId) return;

  if (!isZoomLevelEnough(MIN_ZOOM)) return;

  // (기존 로직 유지)
  const yearBtnCheck = document.getElementById("yearBtn");
  const yearSelectCheck = !!yearBtnCheck?.classList.contains("pink-background");

  if (yearSelectCheck) {
    if (typeof updateBackgroundImage === "function") updateBackgroundImage();
  } else {
    // enableEditing(aptId);
    // updateT2FromIndexedDB(aptId);
  }

  scheduleTradeFetch(aptId);
}

/* ===============================
 * 11) MutationObserver 초기화
 * =============================== */
function initMutationObserver() {
  const observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList" || !mutation.addedNodes?.length) continue;

      for (const node of mutation.addedNodes) {
        if (node.nodeType !== 1) continue;

        if (node.id && String(node.id).startsWith("apt")) {
          handleAptElement(node);
        } else {
          node.querySelectorAll?.('[id^="apt"]').forEach(handleAptElement);
        }
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
  return observer;
}

/* ===============================
 * 12) 줌 변경 시 처리
 * =============================== */
function initZoomListener() {
  const m = window.map;
  if (!m) return;

  if (window.naver?.maps?.Event?.addListener && typeof m.getZoom === "function") {
    window.naver.maps.Event.addListener(m, "zoom_changed", () => {
      if (!isZoomLevelEnough(MIN_ZOOM)) {
        removeAllTradeBadges();
        return;
      }
      document.querySelectorAll('[id^="apt"]').forEach(el => handleAptElement(el));
    });
  } else {
    let lastZoom = null;
    setInterval(() => {
      if (!window.map || typeof map.getZoom !== "function") return;
      const z = map.getZoom();
      if (z === lastZoom) return;
      lastZoom = z;

      if (!isZoomLevelEnough(MIN_ZOOM)) {
        removeAllTradeBadges();
        return;
      }
      document.querySelectorAll('[id^="apt"]').forEach(el => handleAptElement(el));
    }, 500);
  }
}

/* ===============================
 * 13) 시작
 * =============================== */
(function boot() {
  initMutationObserver();
  initZoomListener();
})();

/* 중개 버튼 OFF */

function turnOffMemberPinIfOn() {
  const btn = document.querySelector("#memberBtn");
  if (!btn) return;

  // ON 상태면 OFF로
  if (btn.classList.contains("on")) {
    console.log("[중개] 초기 로드 → 중개사무소 표시 OFF");
    btn.click(); // clickMemberPin() 호출과 동일
  }
   /*오피스텔 숨기기 */
    setDanji('1')
}
setTimeout(turnOffMemberPinIfOn, 1000);

