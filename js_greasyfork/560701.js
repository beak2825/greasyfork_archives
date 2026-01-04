// ==UserScript==
// @name         ERP 결재 도착 알림 (JSON 상태 체크 + 고정 UI)
// @match        https://admin.hyecho.com/*
// @grant        GM_notification
// @grant        GM_registerMenuCommand
// @description 전자결재 건수를 JSON으로 백그라운드 확인하여 신규 결재 시 OS 알림 + 고정 UI 제공 (유저 액션 시 알림 해제)
// @license      MIT
// @version      2.3
// @namespace    https://greasyfork.org/users/1554043
// @downloadURL https://update.greasyfork.org/scripts/560701/ERP%20%EA%B2%B0%EC%9E%AC%20%EB%8F%84%EC%B0%A9%20%EC%95%8C%EB%A6%BC%20%28JSON%20%EC%83%81%ED%83%9C%20%EC%B2%B4%ED%81%AC%20%2B%20%EA%B3%A0%EC%A0%95%20UI%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560701/ERP%20%EA%B2%B0%EC%9E%AC%20%EB%8F%84%EC%B0%A9%20%EC%95%8C%EB%A6%BC%20%28JSON%20%EC%83%81%ED%83%9C%20%EC%B2%B4%ED%81%AC%20%2B%20%EA%B3%A0%EC%A0%95%20UI%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const CHECK_URL = 'https://admin.hyecho.com/erp/sy/getAlarm.json';
  const INTERVAL = 60 * 1000;

  let lastCount = null;
  let alertActive = false;
  let fixedUI = null;

  /* ===============================
     🔒 전역 알림 락
  =============================== */
  const ALERT_LOCK_KEY = 'ERP_APPROVAL_ALERT_LOCK';
  const ALERT_LOCK_TTL = 60 * 1000;

  function acquireAlertLock() {
    const now = Date.now();
    const lockTime = Number(localStorage.getItem(ALERT_LOCK_KEY));
    if (lockTime && now - lockTime < ALERT_LOCK_TTL) return false;
    localStorage.setItem(ALERT_LOCK_KEY, now);
    return true;
  }

  function releaseAlertLock() {
    localStorage.removeItem(ALERT_LOCK_KEY);
  }

  /* ===============================
     공통: 알림 상태 해제
  =============================== */
  function clearAlertState() {
    alertActive = false;
    releaseAlertLock();

    if (fixedUI) {
      fixedUI.remove();
      fixedUI = null;
    }

    console.log('[ERP 알림] 알림 상태 해제');
  }

  /* ===============================
     고정 UI 표시
  =============================== */
  function showFixedUI(count) {
    if (fixedUI) return;

    fixedUI = document.createElement('div');
    fixedUI.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: #1f2937;
      color: #fff;
      padding: 14px 16px;
      border-radius: 12px;
      box-shadow: 0 8px 20px rgba(0,0,0,.25);
      z-index: 99999;
      font-size: 14px;
    `;

    fixedUI.innerHTML = `
      <div style="margin-bottom:10px;">
        📌 미결재 문서 <b>${count}</b>건
      </div>
      <button id="erpOpenBtn">결재함 열기</button>
      <button id="erpCloseBtn" style="margin-left:8px;">닫기</button>
    `;

    document.body.appendChild(fixedUI);

    document.getElementById('erpOpenBtn').onclick = () => {
      window.open('/erp/sy/sy99/pop/apprDocuAlarm', '_blank');
      clearAlertState();
    };

    document.getElementById('erpCloseBtn').onclick = () => {
      clearAlertState();
    };
  }

  /* ===============================
     결재 상태 체크
  =============================== */
  async function check() {
    try {
      const res = await fetch(CHECK_URL, {
        method: 'POST',
        credentials: 'include',
        headers: { 'X-Requested-With': 'XMLHttpRequest' }
      });

      if (!res.ok) return;

      const json = await res.json();
      const count = json?.data?.apprDocuAlarmCnt;

      if (typeof count !== 'number') return;

      if (lastCount === null) {
        lastCount = count;
        console.log(`[ERP 알림] 초기 결재 건수: ${count}`);
        return;
      }

      if (count > lastCount && !alertActive && acquireAlertLock()) {
        console.log(`[ERP 알림] 신규 전자결재 감지 (${lastCount} → ${count})`);
        alertActive = true;

        GM_notification({
          title: '📌 전자결재 도착',
          text: `미결재 문서 ${count}건`,
          timeout: 0,
          onclick: () => {
            window.open('/erp/sy/sy99/pop/apprDocuAlarm', '_blank');
            clearAlertState();
          }
        });

        showFixedUI(count);
      }

      lastCount = count;
    } catch (e) {
      console.debug('[ERP 알림] 예외 발생', e);
    }
  }

  /* ===============================
     시작
  =============================== */
  setTimeout(() => {
    check();
    setInterval(check, INTERVAL);
  }, 10000);

  /* ===============================
     🧪 강제 테스트
  =============================== */
  GM_registerMenuCommand('🧪 결재 알림 강제 테스트', () => {
    if (alertActive || !acquireAlertLock()) return;

    alertActive = true;

    GM_notification({
      title: '🧪 전자결재 도착 (TEST)',
      text: '실제 결재는 발생하지 않았습니다.',
      timeout: 0,
      onclick: clearAlertState
    });

    showFixedUI('TEST');
  });

})();