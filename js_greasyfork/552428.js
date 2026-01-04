// ==UserScript==
// @name        [루시퍼홍] NAC(New Asil Chart)
// @namespace   Violentmonkey Scripts
// @match       https://asil.kr/app/apt_info.jsp?*
// @grant       none
// @version     1.0
// @author      -
// @description NAC(New Asil Chart)
// @downloadURL https://update.greasyfork.org/scripts/552428/%5B%EB%A3%A8%EC%8B%9C%ED%8D%BC%ED%99%8D%5D%20NAC%28New%20Asil%20Chart%29.user.js
// @updateURL https://update.greasyfork.org/scripts/552428/%5B%EB%A3%A8%EC%8B%9C%ED%8D%BC%ED%99%8D%5D%20NAC%28New%20Asil%20Chart%29.meta.js
// ==/UserScript==




(function () {
  'use strict';

  const currentVersion = GM_info.script.version;
  const scriptName = GM_info.script.name;
  console.log(scriptName + ' ' + "currentVersion: " + currentVersion);
  const updateUrl = GM_info.script.updateURL;
  const cafeUrl = 'https://cafe.naver.com/wecando7/11627519';
  const popupDismissKey = 'scriptUpdatePopupDismissed';
  const dismissDuration = 24 * 60 * 60 * 1000; // 24시간

  // 한국 시간을 가져오는 함수
  function getKoreanTime() {
    const now = new Date();
    const utcNow = now.getTime() + (now.getTimezoneOffset() * 60000); // UTC 시간
    const koreanTime = new Date(utcNow + (9 * 60 * 60 * 1000)); // 한국 시간 (UTC+9)
    return koreanTime;
  }

  // 날짜를 24시간 형식으로 포맷하는 함수
  function formatDateTo24Hour(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  // 최신 버전을 가져오기 위해 메타 파일을 가져옴
  fetch(`${updateUrl}?_=${Date.now()}`)
    .then(response => response.text())
    .then(meta => {
      const latestVersionMatch = meta.match(/@version\s+([^\s]+)/);

      if (latestVersionMatch) {
        const latestVersion = latestVersionMatch[1];
        console.log(scriptName + ' ' + "latestVersion: " + latestVersion);

        if (currentVersion !== latestVersion) {
          if (!shouldDismissPopup()) {
            showUpdatePopup(latestVersion);
          }
        }
      }
    })
    .catch(error => {
      console.error('Failed to fetch the latest version information:', error);
    });

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


(async function () {
  /* ========== 0) 로그 유틸 ========== */
  const TS  = () => new Date().toISOString();
  const log = (...a) => console.log(`[%s][ASIL]`, TS(), ...a);
  const warn= (...a) => console.warn(`[%s][ASIL]`, TS(), ...a);
  const err = (...a) => console.error(`[%s][ASIL]`, TS(), ...a);

  /* ========== 0-1) 안전 삽입 유틸(appendChild 완전 우회) ========== */
  const __asil_insBefore = Node.prototype.insertBefore;
  const __asil_remove    = Element.prototype.remove;
  function asilSafeInsert(parent, node, ref=null){ try { return __asil_insBefore.call(parent, node, ref); } catch(_){} }
  function asilSafeAppend(parent, node){ return asilSafeInsert(parent, node, null); }
  function asilSafeRemove(node){ try { return __asil_remove.call(node); } catch(_){} }

  /* ========== 0-2) 처리중 팝업 유틸(2초 지연 시 노출) ========== */
  window.__asil_loading_token = window.__asil_loading_token ?? 0;
  window.__asil_loading_timer = window.__asil_loading_timer ?? null;

  function __asil_createProcessingPopup(){
    if (document.getElementById('asil-processing-layer')) return;
    const layer = document.createElement('div');
    layer.id = 'asil-processing-layer';
    layer.style.cssText = [
      'position:fixed;inset:0;display:none;align-items:center;justify-content:center;',
      'background:rgba(0,0,0,0.28);z-index:2147483646;'
    ].join('');
    const box = document.createElement('div');
    box.style.cssText = [
      'min-width:220px;max-width:80vw;padding:14px 16px;border-radius:10px;',
      'background:#111827;color:#fff;font-size:14px;box-shadow:0 10px 24px rgba(0,0,0,.25);',
      'display:flex;gap:10px;align-items:center;'
    ].join('');
    const spinner = document.createElement('div');
    spinner.style.cssText = [
      'width:18px;height:18px;border-radius:50%;',
      'border:2px solid rgba(255,255,255,.25);border-top-color:#fff;',
      'animation:asilSpin 0.9s linear infinite;'
    ].join('');
    const text = document.createElement('div');
    text.id = 'asil-processing-text';
    text.textContent = '처리중입니다…';

    const st = document.createElement('style');
    st.textContent = '@keyframes asilSpin{to{transform:rotate(360deg)}}';
    asilSafeAppend(document.head, st);

    box.appendChild(spinner);
    box.appendChild(text);
    layer.appendChild(box);
    asilSafeAppend(document.body, layer);
  }
  function __asil_showProcessing(msg){
    __asil_createProcessingPopup();
    const layer = document.getElementById('asil-processing-layer');
    const text  = document.getElementById('asil-processing-text');
    if (text && msg) text.textContent = msg;
    if (layer) layer.style.display = 'flex';
  }
  function __asil_hideProcessing(){
    const layer = document.getElementById('asil-processing-layer');
    if (layer) layer.style.display = 'none';
  }
  function __asil_startProcessingGuard(msg='처리중입니다…'){
    const my = ++window.__asil_loading_token;
    if (window.__asil_loading_timer) { clearTimeout(window.__asil_loading_timer); window.__asil_loading_timer = null; }
    window.__asil_loading_timer = setTimeout(() => {
      if (my === window.__asil_loading_token) __asil_showProcessing(msg);
    }, 1000);
  }
  function __asil_stopProcessingGuard(){
    window.__asil_loading_token++;
    if (window.__asil_loading_timer) { clearTimeout(window.__asil_loading_timer); window.__asil_loading_timer = null; }
    __asil_hideProcessing();
  }

  /* ========== 0-3) 토글 스냅샷 유틸 ========== */
  // 이 함수가 존재해야 requeryAndRebindByCompareQP에서 ReferenceError가 나지 않습니다.
  window.__asil_toggleSnapshot = function () {
    return {
      individualOn:   !!window.__asil_INDIVIDUAL_ON,
      excludeRenewal: !!window.__asil_EXCLUDE_RENEWAL,
      excludeDirect:  !!window.__asil_EXCLUDE_DIRECT,
    };
  };

  /* ========== 1) CryptoJS 로드 ========== */
  if (typeof CryptoJS === 'undefined') {
    await new Promise((res, rej) => {
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/crypto-js@4.2.0/crypto-js.min.js';
      s.onload = res; s.onerror = rej;
      asilSafeAppend(document.head, s);
    });
    log('CryptoJS loaded');
  }

  /* ========== 1-1) 전역 상태 기본값 ========== */
  window.__asil_INDIVIDUAL_ON       = window.__asil_INDIVIDUAL_ON       ?? false; // 초기 OFF
  window.__asil_EXCLUDE_RENEWAL     = window.__asil_EXCLUDE_RENEWAL     ?? false; // 전세 갱신(U) 제외 (기본 OFF)
  window.__asil_EXCLUDE_DIRECT      = window.__asil_EXCLUDE_DIRECT      ?? false; // 직거래(reg_gbn=1) 제외 (기본 OFF)
  window.__asil_capture_enabled     = window.__asil_capture_enabled     ?? true;  // OFF 복귀 중엔 false
  window.__asil_revert_inflight     = window.__asil_revert_inflight     ?? false;
  window.__asil_lastCompareUrl      = window.__asil_lastCompareUrl      || null;
  window.__asil_lastCompareQP       = window.__asil_lastCompareQP       || null;
  window.__asil_lastGoodCompareUrl  = window.__asil_lastGoodCompareUrl  || null;  // _r 제거, 최신 기간 반영
  window.__asil_initialAppCompareUrl= window.__asil_initialAppCompareUrl|| null;  // 최초 /app/data 경로 스냅샷(있으면 우선 사용)

  /* ========== 2) Secret 관리 + 복호화 ========== */
  const FALLBACK_SECRET = "758369543203661168";
  const SecretCache = new Map();
  let   CURRENT_APT = null;

  function setCurrentApt(apt) { CURRENT_APT = String(apt || ''); }
  function getSecretForApt(apt) { return SecretCache.get(String(apt||'')) || null; }
  function putSecretForApt(apt, secret) { if (secret) SecretCache.set(String(apt||''), String(secret)); }

  // 안전한 키 길이(16/24/32바이트)로 패딩/트림
  function getKey(secret) {
    const raw = CryptoJS.enc.Utf8.parse(String(secret||''));
    const targetLen = raw.sigBytes <= 16 ? 16 : (raw.sigBytes <= 24 ? 24 : 32);
    const out = CryptoJS.lib.WordArray.create(raw.words.slice(0), targetLen);
    out.sigBytes = targetLen; // 부족분은 0 패딩
    return out;
  }

  // 정규식 수정: 따옴표 백레퍼런스 사용
  function extractSecretsFromHtml(html) {
    const secrets = new Set();
    try {
      const re1 = /getKey\s*\(\s*(['"`])([^'"`\r\n]{8,128}?)\1\s*\)/g;
      let m;
      while ((m = re1.exec(html)) !== null) {
        const candidate = (m[2] || '').trim();
        if (candidate) secrets.add(candidate);
      }
      const re2 = /AES\.decrypt\s*\([^,]+,\s*getKey\s*\(\s*(['"`])([^'"`\r\n]{8,128}?)\1\s*\)\s*\)/g;
      while ((m = re2.exec(html)) !== null) {
        const candidate = (m[2] || '').trim();
        if (candidate) secrets.add(candidate);
      }
    } catch(e) { warn('extractSecretsFromHtml failed', e); }
    return [...secrets];
  }

  async function ensureSecretForApt(apt) {
    const key = String(apt || '');
    if (SecretCache.has(key)) return SecretCache.get(key);
    const url = `https://asil.kr/app/price_detail_ver_3_9.jsp?os=pc&user=0&building=apt&apt=${encodeURIComponent(key)}&evt=0m2&year=9999&deal=123`;
    log('[secret fetch]', url);
    try {
      const r = await fetch(url, {
        method: 'GET', mode: 'cors', credentials: 'include',
        headers: { 'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8' }
      });
      const html = await r.text();
      const list = extractSecretsFromHtml(html);
      if (list.length) {
        putSecretForApt(key, list[0]);
        log(`[secret captured][apt=${key}]`, list);
        return list[0];
      } else {
        warn(`[secret not found][apt=${key}] — fallback will be used`);
        return null;
      }
    } catch (e) {
      err('[secret fetch error]', e);
      return null;
    }
  }

  function decryptStr(b64Str) {
    if (!b64Str) return "";
    try {
      const secret = getSecretForApt(CURRENT_APT) || FALLBACK_SECRET;
      return CryptoJS.AES.decrypt(b64Str, getKey(secret), {
        mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7
      }).toString(CryptoJS.enc.Utf8);
    } catch { return ""; }
  }

  function toManwonNumber(str) {
    if (str == null) return null;
    const s = String(str).trim();
    if (!/[억만]/.test(s) && /^[\d,.\s]+$/.test(s)) {
      const n = Number(s.replace(/[^\d.-]/g, ''));
      return Number.isFinite(n) ? n : null;
    }
    if (s.includes('억')) {
      let man = 0;
      const eok = s.match(/(\d+(?:\.\d+)?)\s*억/);
      if (eok) man += Math.round(parseFloat(eok[1]) * 10000);
      const after = s.split('억')[1] || '';
      const manPart = after.match(/(\d[\d,]*)\s*만/);
      if (manPart) man += parseInt(manPart[1].replace(/,/g, ''), 10);
      else {
        const raw = after.replace(/[^\d]/g, '');
        if (raw) man += parseInt(raw, 10);
      }
      return man || null;
    }
    if (s.includes('만')) {
      const m = s.match(/(\d[\d,]*)\s*만/);
      if (m) return parseInt(m[1].replace(/,/g, ''), 10);
    }
    const n = Number(s.replace(/[^\d.-]/g, ''));
    return Number.isFinite(n) ? n : null;
  }

  const fmtDate = (yyyymm, day) =>
    `${yyyymm.slice(0,4)}/${yyyymm.slice(4,6)}/${String(day).padStart(2,'0')}`;

  if (typeof window.setComma !== 'function') {
    window.setComma = x => { try { return Number(x).toLocaleString(); } catch { return x; } };
  }

  /* ========== 3) data_compare 캡처(OFF시 정지) + 초기 회수 ========== */
  (function installCompareCapture(){
    const RE = /\/(?:app\/)?data\/data_compare\.jsp(?:\?|$)/i;

    async function handleCapturedUrl(urlStr){
      try {
        if (!window.__asil_capture_enabled) return; // OFF 복귀중엔 무시
        const u = new URL(urlStr, location.origin);
        // 서버가 모르는 캐시버스터 제거 후 저장
        u.searchParams.delete('_r'); u.searchParams.delete('_asil_revert');

        // 최초 /app/data 경로 스냅샷(OFF 복귀 시 우선 사용)
        if (!window.__asil_initialAppCompareUrl && u.pathname.includes('/app/data/')) {
          window.__asil_initialAppCompareUrl = u.toString();
        }

        window.__asil_lastCompareUrl     = u.toString();
        window.__asil_lastCompareQP      = Object.fromEntries(u.searchParams.entries());
        window.__asil_lastGoodCompareUrl = u.toString(); // 최신 기간/옵션 반영본

        log('[compare 캡처]', window.__asil_lastCompareQP);

        const apt = window.__asil_lastCompareQP?.apt;
        if (apt) {
          await ensureSecretForApt(apt);
          setCurrentApt(apt);
        }
        scheduleRebind('compare-captured');
      } catch(e){ warn('compare 파싱 실패', e); }
    }

    // fetch 훅
    const origFetch = window.fetch;
    if (origFetch && !origFetch.__asil_hooked) {
      window.fetch = function(input, init){
        let url = '';
        try { url = (typeof input==='string') ? input : input?.url || ''; } catch {}
        if (RE.test(url) && window.__asil_capture_enabled) { handleCapturedUrl(url); }
        return origFetch.apply(this, arguments);
      };
      window.fetch.__asil_hooked = true;
    }

    // XHR 훅
    const X = window.XMLHttpRequest?.prototype;
    if (X && !X.open.__asil_hooked) {
      const _open=X.open, _send=X.send;
      X.open=function(m,u){ this.__asil_url=u; return _open.apply(this, arguments); };
      X.send=function(b){
        try{
          if (RE.test(this.__asil_url||'') && window.__asil_capture_enabled) handleCapturedUrl(this.__asil_url);
        }catch{}
        return _send.apply(this, arguments);
      };
      X.open.__asil_hooked = true;
    }

    // script src 훅
    const proto = HTMLScriptElement?.prototype;
    if (proto && !proto.__asil_src_hooked) {
      const desc = Object.getOwnPropertyDescriptor(proto, 'src');
      Object.defineProperty(proto, 'src', {
        set(v){
          try{
            if (window.__asil_capture_enabled && /(?:^|\/)(?:app\/)?data\/data_compare\.jsp(?:\?|$)/i.test(v)) {
              handleCapturedUrl(v);
            }
          }catch{}
          return desc.set.call(this, v);
        },
        get: desc.get, configurable: true, enumerable: desc.enumerable
      });
      proto.__asil_src_hooked = true;
    }

    // Performance API 스캔
    function tryCaptureFromPerformance() {
      if (!('getEntriesByType' in performance)) return false;
      const entries = performance.getEntriesByType('resource') || [];
      for (let i = entries.length - 1; i >= 0; i--) {
        const name = entries[i]?.name || '';
        if (/\/(?:app\/)?data\/data_compare\.jsp(?:\?|$)/i.test(name)) {
          log('[Performance 캡처 성공]', name);
          handleCapturedUrl(name);
          return true;
        }
      }
      return false;
    }
    const didPerf = tryCaptureFromPerformance();
    if (!didPerf) {
      setTimeout(() => {
        if (!window.__asil_lastCompareQP) tryCaptureFromPerformance();
      }, 500);
    }

    log('compare 캡처 준비 완료');
  })();

  /* ========== 3-1) 토글 UI (제목 h2 바로 '위'에 안전 삽입 + 레이아웃 보정) ========== */
  (function injectToggles(){
    if (window.__asil_toggle_injected) return;

    // 헤더(h2) 탐색
    function findHeaderH2() {
      return document.querySelector('div.asilScroll div.apt_info div.hgroup h2.h2')
          || document.querySelector('div.asilScroll div.hgroup h2.h2')
          || document.querySelector('h2.h2');
    }
    function findHeaderDivFromH2(h2){ return h2 ? h2.parentElement : null; }

    // 스타일 1회 주입
    if (!document.getElementById('asil-toggle-style')) {
      const st = document.createElement('style');
      st.id = 'asil-toggle-style';
      st.textContent = [
        '.asil-toggle-bar{display:flex;gap:12px;align-items:center;',
        'margin:0 0 10px 0;padding:6px 10px;background:#fff;border-radius:8px;',
        'box-shadow:inset 0 0 0 1px #e5e7eb;position:relative;z-index:9;}',
        '.asil-toggle{font-size:11px;color:#333;user-select:none;display:inline-flex;align-items:center;}',
        '.asil-toggle input[type="checkbox"]{transform:scale(0.9);margin-right:6px;}',
        '.asil-chip{display:inline-block;padding:1px 6px;border-radius:999px;font-size:11px;line-height:16px;',
        'border:1px solid #d0d4d9;margin-left:6px;font-weight:600;}',
        '.asil-chip.on{background:#e6f8ee;color:#0f6b3f;border-color:#bfe8cf;}',
        '.asil-chip.off{background:#f8eaea;color:#8a1c1c;border-color:#f0c9c9;}',
        '.asil-toggle.disabled{opacity:.5;cursor:not-allowed;}',
        '.asil-toggle.disabled input[type="checkbox"]{pointer-events:none;}',
        'body > div.asilScroll > div.apt_info > div.hgroup{padding:8px 12px 6px !important;}',
        'body > div.asilScroll > div.apt_info > div.hgroup h2.h2{margin:0 0 6px 0 !important;line-height:1.25;}'
      ].join('');
      asilSafeAppend(document.head, st);
    }

    function reflowForHeader(headerDiv){
      if (!headerDiv) return;
      headerDiv.style.height = 'auto';
      const scrollRoot = document.querySelector('body > div.asilScroll');
      const aptInfo    = document.querySelector('body > div.asilScroll > div.apt_info');
      if (!scrollRoot || !aptInfo) return;

      const bar = headerDiv.querySelector('.asil-toggle-bar');
      if (bar) {
        const padLeft = parseFloat(getComputedStyle(headerDiv).paddingLeft) || 0;
        bar.style.marginLeft = `-${padLeft}px`;
        bar.style.width      = `calc(100% + ${padLeft}px)`;
      }
      const rectH = headerDiv.getBoundingClientRect();
      let h = 45;
      if (bar && rectH.width) {
        const rectB = bar.getBoundingClientRect();
        h = Math.ceil(rectB.bottom - rectH.top);
        if (!(h > 0 && h < 200)) h = 45;
        if (h < 30) h = 30;
      }
      scrollRoot.style.paddingTop = '41px';
      aptInfo.style.height = `calc(100% - ${h}px)`;
    }

    function makeLabel(idToggle, text, chipId, checked){
      const label = document.createElement('label');
      label.className = 'asil-toggle';
      label.style.cursor = 'pointer';

      const input = document.createElement('input');
      input.type = 'checkbox';
      input.id = idToggle;
      if (checked) input.checked = true;

      const spanText = document.createElement('span');
      spanText.className = 'label';
      spanText.textContent = text;

      const chip = document.createElement('span');
      chip.id = chipId;
      chip.className = 'asil-chip ' + (checked ? 'on' : 'off');
      chip.textContent = checked ? 'ON' : 'OFF';

      asilSafeAppend(label, input);
      asilSafeAppend(label, spanText);
      asilSafeAppend(label, chip);
      return { label, input, chip };
    }

    function mount(){
      const h2 = findHeaderH2();
      const headerDiv = findHeaderDivFromH2(h2);
      if (!h2 || !headerDiv || window.__asil_toggle_injected) return false;

      const bar = document.createElement('div');
      bar.className = 'asil-toggle-bar';

      const indiv = makeLabel('asil_individual_toggle', '일자별로 보기', 'asil_individual_chip', !!window.__asil_INDIVIDUAL_ON);
      const renew = makeLabel('asil_jeonse_renewal_exclude','전세 갱신거래 제외','asil_renewal_exclude_chip', !!window.__asil_EXCLUDE_RENEWAL);
      const direct= makeLabel('asil_direct_exclude','직거래 제외','asil_direct_exclude_chip', !!window.__asil_EXCLUDE_DIRECT);

      asilSafeAppend(bar, indiv.label);
      asilSafeAppend(bar, renew.label);
      asilSafeAppend(bar, direct.label);

      asilSafeInsert(headerDiv, bar, h2);
      window.__asil_toggle_injected = true;

      const $onoff = indiv.input;
      const $renew = renew.input;
      const $direct= direct.input;
      const $onChip= indiv.chip;
      const $reChip= renew.chip;
      const $diChip= direct.chip;

      renew.label.title  = '전세 갱신(U) 거래 제외';
      direct.label.title = '직거래(reg_gbn=1) 제외';

      function refreshVisual(){
        $onChip.textContent = $onoff.checked ? 'ON' : 'OFF';
        $onChip.classList.toggle('on', $onoff.checked);
        $onChip.classList.toggle('off', !$onoff.checked);

        $reChip.textContent = $renew.checked ? 'ON' : 'OFF';
        $reChip.classList.toggle('on', $renew.checked);
        $reChip.classList.toggle('off', !$renew.checked);

        $diChip.textContent = $direct.checked ? 'ON' : 'OFF';
        $diChip.classList.toggle('on', $direct.checked);
        $diChip.classList.toggle('off', !$direct.checked);
      }

      function onChange(){
        window.__asil_INDIVIDUAL_ON    = !!$onoff.checked;
        window.__asil_EXCLUDE_RENEWAL  = !!$renew.checked;
        window.__asil_EXCLUDE_DIRECT   = !!$direct.checked;
        refreshVisual();

        // 개별보기 ON 또는 (OFF이지만 제외토글 ON) → 우리 재바인드
        const needDaily = window.__asil_INDIVIDUAL_ON
                       || window.__asil_EXCLUDE_RENEWAL
                       || window.__asil_EXCLUDE_DIRECT;
        if (needDaily) {
          __asil_startProcessingGuard('처리중입니다…');
          window.__asil_capture_enabled = true;
          try { scheduleRebind('toggle-change'); } catch(e){}
        } else {
          __asil_startProcessingGuard('처리중입니다…');
          revertToOriginal(); // OFF + 제외옵션 OFF: 서버 월차트 유지
        }
        reflowForHeader(headerDiv);
      }

      $onoff.addEventListener('change', onChange);
      $renew.addEventListener('change', onChange);
      $direct.addEventListener('change', onChange);
      refreshVisual();

      reflowForHeader(headerDiv);
      const ro = new ResizeObserver(() => reflowForHeader(headerDiv));
      ro.observe(headerDiv);
      window.addEventListener('resize', () => reflowForHeader(headerDiv));
      setTimeout(() => reflowForHeader(headerDiv), 0);

      return true;
    }

    if (!mount()) {
      const mo = new MutationObserver(() => { if (mount()) mo.disconnect(); });
      mo.observe(document.documentElement, { childList:true, subtree:true });
      let tries = 0;
      const t = setInterval(() => { if (mount() || ++tries > 20) clearInterval(t); }, 300);
    }
  })();

  /* ========== 4) showChartInfo: ON이면 일자(dd) 포함, OFF면 년월만 ========== */
  (function overrideShowChartInfo() {
    function parseYMD(dateStr) {
      if (!dateStr) return null;
      const s = String(dateStr).trim().replace(/-/g, '/');
      const m = s.match(/^(\d{4})\/(\d{2})\/(\d{2})$/);
      if (!m) return null;
      return { yy: m[1].slice(2), mm: String(parseInt(m[2],10)), dd: String(parseInt(m[3],10)) };
    }

    const newShowChartInfo = function (data) {
      try {
        const isIndividualOn = (window.__asil_INDIVIDUAL_ON === true);
        const raw = String(data?.date || '').trim().replace(/-/g, '/');

        let yy, mm, dd;
        const p = parseYMD(raw);
        if (p) { yy = p.yy; mm = p.mm; dd = p.dd; }
        else {
          yy = raw.substring(2, 4);
          mm = raw.substring(5, 7);
          if (mm && mm[0] === '0') mm = mm.substring(1, 2);
        }

        if (isIndividualOn && dd) {
          $('#chart_info_yyyymm').html(`${yy}년 ${mm}월 ${dd}일`);
        } else {
          $('#chart_info_yyyymm').html(`${yy}년 ${mm}월`);
        }

        const cd = String(window.chart_deal||'');
        const subM=(cd.indexOf('4')>=0 && data?.M_CNT!=null)?` / ${data.M_CNT}건`:"";
        const subJ=(cd.indexOf('4')>=0 && data?.J_CNT!=null)?` / ${data.J_CNT}건`:"";

        if (data?.M==null || data.M==='null') {
          $('#chart_info_m').html(cd.indexOf('1')<0?'매매':'매매 거래내역 없음');
        } else {
          $('#chart_info_m').html('매매 '+ setComma(String(data.M)) + subM);
        }

        if (data?.J==null || data.J==='null') {
          $('#chart_info_j').html(cd.indexIndexOf?.('2')<0?'전세':'전세 거래내역 없음'); // 안전 가드
          if (!$('#chart_info_j').text()) $('#chart_info_j').html(cd.indexOf('2')<0?'전세':'전세 거래내역 없음');
        } else {
          $('#chart_info_j').html('전세 '+ setComma(String(data.J)) + subJ);
        }
      } catch (e) {
        console.warn('[ASIL] showChartInfo override error:', e);
      }
    };

    try {
      Object.defineProperty(window, 'showChartInfo', { configurable:true, writable:true, value:newShowChartInfo });
    } catch {
      window.showChartInfo = newShowChartInfo;
    }

    // 원본 스크립트가 재정의하더라도 유지
    let guardCount = 0;
    const guard = setInterval(() => {
      if (typeof window.showChartInfo !== 'function' || window.showChartInfo !== newShowChartInfo) {
        try { window.showChartInfo = newShowChartInfo; } catch {}
      }
      if (++guardCount > 40) clearInterval(guard);
    }, 500);

    console.log('[ASIL] showChartInfo overridden (OFF: YY/MM, ON: YY/MM/DD)');
  })();

  /* ========== 5) 재요청→재바인딩 (개별보기 ON 또는 제외토글 ON) ========== */
  let _rebindToken = 0;
  function scheduleRebind(reason){
    const token = ++_rebindToken;
    setTimeout(() => { if (token === _rebindToken) requeryAndRebindByCompareQP(reason); }, 250);
  }

  // YYYY/MM/DD → 숫자키
  function __asil_key(dateStr){
    const [Y,M,D] = String(dateStr||'').split('/');
    return (parseInt(Y,10)*10000) + (parseInt(M,10)*100) + (parseInt(D,10)||1);
  }

  // sY/sM ~ eY/eM 월 범위 필터
  function filterByYMDRange(rows, sY, sM, eY, eM) {
    const sy = parseInt(sY,10), sm = parseInt(sM||'1',10);
    const ey = parseInt(eY,10), em = parseInt(eM||'12',10);
    if (!sy || !ey) return rows;
    const startKey = sy*10000 + sm*100 + 1;
    const endKey   = ey*10000 + em*100 + 31;
    return rows.filter(r => {
      const k = __asil_key(r.date);
      return k >= startKey && k <= endKey;
    });
  }

  function __asil_buildCompareUrl(basePath, params){
    const ALLOWED = new Set(['ch_id','building','sido','apt','deal','m2','py','sY','eY','sM','eM']);
    const u = new URL(basePath, location.origin);
    Object.entries(params || {}).forEach(([k,v])=>{
      if (ALLOWED.has(k) && v !== undefined && v !== null && v !== '') {
        u.searchParams.set(k, String(v));
      }
    });
    return u.toString();
  }

  // 스크립트 태그 로드 후 즉시 제거(누수 방지) + append 우회
  async function __asil_tryLoadCompare(url){
    return new Promise((resolve) => {
      const sc = document.createElement('script');
      sc.src = url;
      sc.onload  = () => { asilSafeRemove(sc); resolve(true); };
      sc.onerror = () => { asilSafeRemove(sc); resolve(false); };
      asilSafeAppend(document.body, sc);
    });
  }

  async function requeryAndRebindByCompareQP(reason='') {
    try {
      // === 토글 스냅샷: 이 함수 시작 시 단 한 번만 읽음 ===
      const TOGGLE = (window.__asil_toggleSnapshot
        ? window.__asil_toggleSnapshot()
        : {
            individualOn:   !!window.__asil_INDIVIDUAL_ON,
            excludeRenewal: !!window.__asil_EXCLUDE_RENEWAL,
            excludeDirect:  !!window.__asil_EXCLUDE_DIRECT,
          });

      // 개별보기 ON 또는 (OFF이지만 제외토글 ON)일 때만 우리 경로 진행
      const needDaily = TOGGLE.individualOn || TOGGLE.excludeRenewal || TOGGLE.excludeDirect;
      if (!needDaily) {
        log('[스킵] 개별보기 OFF & 제외옵션 OFF — 서버 월차트 유지');
        __asil_stopProcessingGuard();
        return;
      }

      // 최신 UI 파라미터 병합 (URL 로직은 기존 유지)
      const qp0 = window.__asil_lastCompareQP || {};
      const cur = __asil_readCurrentParams();
      const qp  = Object.assign({}, qp0, cur);

      const sido = qp.sido || '11';
      const apt  = qp.apt  || '168';
      const m2   = qp.m2   || '';
      const py   = qp.py   || '';
      const deal = qp.deal || '124';   // 1=매매, 2=전세
      const year = '9999';
      const sY   = qp.sY, eY = qp.eY;
      const sM   = qp.sM, eM = qp.eM;

      if (!getSecretForApt(apt)) await ensureSecretForApt(apt);
      setCurrentApt(apt);

      let endpoint='', params='';
      if (/1/.test(deal) && /2/.test(deal)) {
        endpoint='apt_price_m2_mjw_newver_6.jsp';
        params=`sido=${sido}&dealmode=12&building=apt&seq=${apt}&m2=${m2}&py=${py}&py_type=&isPyQuery=true&year=${year}&start=0&count=10000&u=0&order=`;
      } else if (/1/.test(deal)) {
        endpoint='apt_price_m2_newver_6.jsp';
        params=`sido=${sido}&dealmode=1&building=apt&seq=${apt}&m2=${m2}&py=${py}&py_type=&isPyQuery=true&year=${year}&u=0&start=0&count=10000&dong_name=&order=`;
      } else if (/2/.test(deal)) {
        endpoint='apt_price_m2_newver_6.jsp';
        params=`sido=${sido}&dealmode=2&building=apt&seq=${apt}&m2=${m2}&py=${py}&py_type=&isPyQuery=true&year=${year}&u=0&start=0&count=10000&dong_name=&order=`;
      } else { log('deal 1/2 아님 → 재바인딩 스킵:', deal); __asil_stopProcessingGuard(); return; }

      const url = `https://asil.kr/app/data/${endpoint}?${params}`;
      log('[재요청]', reason, url);

      // ===== 요청부는 그대로 =====
      const res  = await fetch(url, { headers:{accept:'*/*'}, method:'GET', mode:'cors', credentials:'include' });
      const json = await res.json();

      // ===== 여기서부터 '토글 스냅샷'만 사용 =====
      let newData = buildDailyChartPData(json, {
        individualOn:   TOGGLE.individualOn,
        excludeRenewal: TOGGLE.excludeRenewal,
        excludeDirect:  TOGGLE.excludeDirect,
      });

      // 연/월 범위로 필터링
      newData = filterByYMDRange(newData, sY, sM, eY, eM);

      // 개별보기 OFF면 월 단위로 재집계(가중평균/총건수) — 스냅샷 기준
      if (!TOGGLE.individualOn) {
        newData = aggregateToMonthly(newData);
      }

      window.chartPData = newData;
      log('[chartPData 갱신]', newData.length, 'rows', { sY, sM, eY, eM });

      if (typeof window.apply === 'function') {
        try { window.apply(); log('[apply()] 호출'); } catch(e){ warn('apply 실패', e); }
      } else if (window.rMateChartH5?.calls) {
        try { window.rMateChartH5.calls('ch1', {'setData': newData}); log('[rMate setData] 호출'); } catch(e){ warn('rMate setData 실패', e); }
      } else {
        warn('apply()/rMate 없음 — 페이지 로직 확인 필요');
      }

      if (newData.length && typeof window.showChartInfo === 'function') {
        window.showChartInfo(newData[newData.length - 1]);
      }
      __asil_stopProcessingGuard();
    } catch(e){
      err('requeryAndRebindByCompareQP 오류', e);
      __asil_stopProcessingGuard();
    }
  }

  /* ========== 6) 호버 시 chart_info 갱신 (중복 설치 방지) ========== */
  (function installHoverUpdateOnce(){
    const GLOBAL_FLAG = '__asil_hover_update_installed';
    if (window[GLOBAL_FLAG]) {
      log('[hover] already installed — skip');
      return;
    }
    window[GLOBAL_FLAG] = true;

    const PATCH_FLAG = '__asilHoverPatched';

    const newFn = function(seriesId, seriesName, index, xName, yName, data, values){
      if (!data) return '';
      if (seriesId === 'G') return '';
      if (seriesId === 'M' || seriesId === 'J') {
        try { showChartInfo(data); } catch (e) {}
        return '';
      }
      return '';
    };
    try { newFn[PATCH_FLAG] = true; } catch (_) {}

    try {
      Object.defineProperty(window, 'dataTipFuncForSingle', {
        configurable: true, writable: true, value: newFn
      });
    } catch {
      window.dataTipFuncForSingle = newFn;
    }

    let guardCount = 0;
    const guard = setInterval(() => {
      const fn = window.dataTipFuncForSingle;
      const patched = (typeof fn === 'function' && fn[PATCH_FLAG] === true);
      if (!patched) {
        try {
          window.dataTipFuncForSingle = newFn;
          window.dataTipFuncForSingle[PATCH_FLAG] = true;
          log('[hover] re-patched');
        } catch (_) {}
      }
      if (++guardCount > 40) clearInterval(guard);
    }, 500);

    log('[hover] installed (idempotent)');
  })();

  /* ========== 7) 집계 규칙 (일자 단위 집계) ========== */
  function buildDailyChartPData(resp, opts = {}) {
    const {
      individualOn    = false,  // 스냅샷을 항상 넘기므로 기본값은 false로 안전하게
      excludeRenewal  = false,
      excludeDirect   = false,
    } = opts;

    const months = resp?.[0]?.val || [];
    const map = new Map(); // date -> { M: number[], J: number[] }

    for (const m of months) {
      const days = m?.val || [];
      const yyyymm = String(m?.yyyymm || '');
      for (const d of days) {
        const date = fmtDate(yyyymm, d?.day); // "YYYY/MM/DD"
        if (!map.has(date)) map.set(date, { M: [], J: [] });

        const recs = d?.val || [];
        for (const r of recs) {
          const moneyTxt = decryptStr(r.money);
          const rentTxt  = decryptStr(r.rent);
          const priceMan = toManwonNumber(moneyTxt);
          if (priceMan == null) continue;

          const rentNorm = (rentTxt ?? '').trim();
          const jw  = String(r.jw_gbn  ?? '').trim().toUpperCase(); // 'N','U',...
          const reg = String(r.reg_gbn ?? '').trim();               // '1' == 직거래(최종 규격)
          const isM = (rentNorm === "");   // 매매
          const isJ = (rentNorm === "0");  // 전세
          if (!isM && !isJ) continue;      // 월세/기타 제외

          // 전세 갱신(U) 제외
          if (isJ && excludeRenewal && jw === 'U') continue;

          // 직거래 제외 (reg_gbn=1)
          if (excludeDirect && reg === '1') continue;

          if (isM) map.get(date).M.push(priceMan);
          if (isJ) map.get(date).J.push(priceMan);
        }
      }
    }

    const avg = (arr) => arr.length ? Math.round(arr.reduce((s, v) => s + v, 0) / arr.length) : null;

    const out = [];
    for (const [date, v] of map.entries()) {
      // 제외 로직 적용 후 아무 거래도 없는 날은 스킵(선 끊김 방지)
      if (v.M.length === 0 && v.J.length === 0) continue;
      out.push({
        date,
        M: avg(v.M),  M_CNT: v.M.length,
        J: avg(v.J),  J_CNT: v.J.length,
      });
    }

    out.sort((a, b) => a.date.localeCompare(b.date));
    return out;
  }

  // 일자→월 집계(건수 가중 평균)
  function aggregateToMonthly(rows){
    const map = new Map(); // "YYYY/MM" -> {M_sum,M_cnt,J_sum,J_cnt}
    for (const r of rows) {
      const ym = r.date.slice(0, 7); // YYYY/MM
      let a = map.get(ym);
      if (!a) a = { M_sum:0, M_cnt:0, J_sum:0, J_cnt:0 };
      if (r.M != null && r.M_CNT > 0) { a.M_sum += r.M * r.M_CNT; a.M_cnt += r.M_CNT; }
      if (r.J != null && r.J_CNT > 0) { a.J_sum += r.J * r.J_CNT; a.J_cnt += r.J_CNT; }
      map.set(ym, a);
    }
    const out = [];
    for (const [ym, a] of map.entries()) {
      out.push({
        date: ym,
        M: a.M_cnt ? Math.round(a.M_sum / a.M_cnt) : null,
        M_CNT: a.M_cnt,
        J: a.J_cnt ? Math.round(a.J_sum / a.J_cnt) : null,
        J_CNT: a.J_cnt,
      });
    }
    out.sort((a,b)=>a.date.localeCompare(b.date));
    return out;
  }

  /* ========== 8) 현재 파라미터 읽기 & OFF 복귀(기간/경로 안정화) ========== */
  function __asil_pick(v, def=null){ return (v===undefined || v===null || v==='') ? def : v; }

  function __asil_readCurrentParams(){
    const u = new URL(location.href);
    const q = sel => document.querySelector(sel);

    const fromURL = {
      ch_id: u.searchParams.get('ch_id') || 'ch1',
      building: u.searchParams.get('building') || 'apt',
      sido: u.searchParams.get('sido'),
      apt: u.searchParams.get('apt'),
      sY: u.searchParams.get('sY'),
      eY: u.searchParams.get('eY'),
      sM: u.searchParams.get('sM'),
      eM: u.searchParams.get('eM'),
      deal: u.searchParams.get('deal'),
      m2: u.searchParams.get('m2'),
      py: u.searchParams.get('py'),
    };

    const fromDOM = {
      sY: q('#sY')?.value || q('[name="sY"]')?.value,
      eY: q('#eY')?.value || q('[name="eY"]')?.value,
      sM: q('#sM')?.value || q('[name="sM"]')?.value,
      eM: q('#eM')?.value || q('[name="eM"]')?.value,
      deal: (typeof window.chart_deal !== 'undefined' && String(window.chart_deal)) ? String(window.chart_deal) : null,
      m2: q('#m2')?.value || q('[name="m2"]')?.value,
      py: q('#py')?.value || q('[name="py"]')?.value,
    };

    const last = window.__asil_lastCompareQP || {};

    const merged = {
      ch_id: 'ch1',
      building: 'apt',
      sido: __asil_pick(fromURL.sido, last.sido),
      apt: __asil_pick(fromURL.apt,  last.apt),
      sY: __asil_pick(fromDOM.sY, __asil_pick(fromURL.sY, last.sY)),
      eY: __asil_pick(fromDOM.eY, __asil_pick(fromURL.eY, last.eY)),
      sM: __asil_pick(fromDOM.sM, __asil_pick(fromURL.sM, last.sM)),
      eM: __asil_pick(fromDOM.eM, __asil_pick(fromURL.eM, last.eM)),
      deal: __asil_pick(fromDOM.deal, __asil_pick(fromURL.deal, last.deal || '124')),
      m2: __asil_pick(fromDOM.m2, __asil_pick(fromURL.m2, last.m2 || '')),
      py: __asil_pick(fromDOM.py, __asil_pick(fromURL.py, last.py || '')),
    };

    ['sY','eY','sM','eM'].forEach(k=>{
      if (merged[k] != null && merged[k] !== '') merged[k] = String(parseInt(merged[k],10));
    });

    return merged;
  }

  function revertToOriginal(){
    if (window.__asil_revert_inflight) return;
    window.__asil_revert_inflight = true;
    window.__asil_capture_enabled = false;

    __asil_startProcessingGuard('처리중입니다…');

    (async () => {
      try {
        const cur = __asil_readCurrentParams();

        const paths = [];
        if (window.__asil_initialAppCompareUrl) {
          paths.push(new URL(window.__asil_initialAppCompareUrl, location.origin).pathname);
        }
        if (!paths.includes('/app/data/data_compare.jsp')) {
          paths.push('/app/data/data_compare.jsp');
        }
        if (window.__asil_lastGoodCompareUrl) {
          const p = new URL(window.__asil_lastGoodCompareUrl, location.origin).pathname;
          if (!paths.includes(p)) paths.push(p);
        }
        if (!paths.includes('/data/data_compare.jsp')) {
          paths.push('/data/data_compare.jsp');
        }

        let loaded = false;
        for (const p of paths) {
          const url = __asil_buildCompareUrl(p, cur);
          const ok = await __asil_tryLoadCompare(url);
          if (ok) { loaded = true; break; }
        }

        if (!loaded) {
          try { if (typeof window.apply === 'function') window.apply(); } catch(_){}
          console.warn('[ASIL] revertToOriginal: all paths failed → apply() fallback');
        }
      } finally {
        setTimeout(() => { window.__asil_capture_enabled = true; }, 120);
        window.__asil_revert_inflight = false;
        __asil_stopProcessingGuard();
      }
    })();
  }

  function mouseupEventAdd() {
    setTimeout(function() {
      chartElement = document.getElementsByClassName("rMateH5__Combination2DChart")[0];
      if (!chartElement) return;

      chartElement.addEventListener('mouseup', function(event) {
        if (event.button === 0 && !event.shiftKey && !event.ctrlKey) {
          let table = document.getElementById("tbl_price");
          if (!table) {
            createTable("initial");
          } else {
            table.style.userSelect = 'text';
            table.style.cursor = 'default';
          }

          const ym = document.getElementById("chart_info_yyyymm")?.innerText || '';
          const mTxt = document.getElementById("chart_info_m")?.innerText || '';
          const jTxt = document.getElementById("chart_info_j")?.innerText || '';
          const m = mTxt.match(/매매\s+(\d+),(\d+)/);
          const j = jTxt.match(/전세\s+(\d+),(\d+)/);
          const vM = m ? +(m[1] + m[2]) : NaN;
          const vJ = j ? +(j[1] + j[2]) : NaN;

          const table2 = document.getElementById("tbl_price");
          if (table2 && currentColumnIndex < table2.rows[0].cells.length) {
            addDataToTableCell(0, currentColumnIndex, ym);
            if (Number.isFinite(vM)) addNumberToTableCell(1, currentColumnIndex, vM);
            if (Number.isFinite(vJ)) addNumberToTableCell(2, currentColumnIndex, vJ);
            if (Number.isFinite(vM) && Number.isFinite(vJ)) {
              addNumberToTableCell(3, currentColumnIndex, vM - vJ);
              addDataToTableCell(4, currentColumnIndex, Math.floor(vJ / vM * 100), true);
            } else {
              table2.rows[4].cells[currentColumnIndex].innerText = '0%';
              table2.rows[4].cells[currentColumnIndex].style.textAlign = "right";
            }

            const h2Title = (document.querySelector("div.asilScroll div.apt_info div.hgroup h2.h2")
                            || document.querySelector("h2.h2"));
            addDataToTableCell(0, 0, h2Title ? h2Title.innerText : '');

            const ths = document.querySelectorAll("#tbl_price th");
            ths.forEach(cell => {
              let fontSize = 14;
              const cellWidth = parseInt(cell.style.width||'76',10);
              while (cell.scrollWidth > cellWidth && fontSize > 10) {
                fontSize--; cell.style.fontSize = fontSize + "px";
              }
            });
            currentColumnIndex++;
          }
        }
      });
    }, 1000);
  }

  /* ========== 완료 로그 ========== */
  log('설치 완료(v0.43): 개별보기 OFF여도 제외토글 ON 시 일자 재요청→월집계. 전세(U)·직거래(reg=1) 제외. 2초 지연 시 처리중 팝업.');
})();
