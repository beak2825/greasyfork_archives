// ==UserScript==
// @name         ERP 결재 도착 알림 (api 상태 체크 + 고정 UI + 설정)
// @match        https://admin.hyecho.com/*
// @grant        GM_notification
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @description 미결재 문서 존재 여부만 확인하여 알림 제공 (단일 알림, 설정 UI 포함)
// @license      MIT
// @version      3.1
// @namespace    https://greasyfork.org/users/1554043
// @downloadURL https://update.greasyfork.org/scripts/560701/ERP%20%EA%B2%B0%EC%9E%AC%20%EB%8F%84%EC%B0%A9%20%EC%95%8C%EB%A6%BC%20%28api%20%EC%83%81%ED%83%9C%20%EC%B2%B4%ED%81%AC%20%2B%20%EA%B3%A0%EC%A0%95%20UI%20%2B%20%EC%84%A4%EC%A0%95%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560701/ERP%20%EA%B2%B0%EC%9E%AC%20%EB%8F%84%EC%B0%A9%20%EC%95%8C%EB%A6%BC%20%28api%20%EC%83%81%ED%83%9C%20%EC%B2%B4%ED%81%AC%20%2B%20%EA%B3%A0%EC%A0%95%20UI%20%2B%20%EC%84%A4%EC%A0%95%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ⭐ 모든 ERP 팝업 차단 (결재함, 결재본문 포함)
  if (location.pathname.includes('/pop/')) return;

  // iframe 실행 차단 (중복 인스턴스 방지)
  if (window.top !== window.self) return;

  /* ===============================
     상수
  =============================== */
  const CHECK_URL = 'https://admin.hyecho.com/erp/sy/getAlarm.json';

  /* ===============================
     설정
  =============================== */
  let settings = {
    intervalMin: GM_getValue('intervalMin', 1),
    enableOS: GM_getValue('enableOS', true),
    enableFixedUI: GM_getValue('enableFixedUI', true)
  };

  /* ===============================
     상태
  =============================== */
  let hasPending = false;   // 이전 체크 상태
  let alertActive = false;  // 현재 알림 상태
  let fixedUI = null;
  let timerId = null;

  /* ===============================
     알림 상태 해제
  =============================== */
  function clearAlertState() {
    alertActive = false;

    if (fixedUI) {
      fixedUI.remove();
      fixedUI = null;
    }

    console.log('[ERP 알림] 알림 상태 해제');
  }

  /* ===============================
     고정 UI
  =============================== */
  function showFixedUI() {
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
        📌 미결재 문서가 존재합니다
      </div>
      <button id="erpOpenBtn">결재함 열기</button>
      <button id="erpCloseBtn" style="margin-left:8px;">닫기</button>
    `;

    document.body.appendChild(fixedUI);

    document.getElementById('erpOpenBtn').onclick = () => {
      window.open('/erp/sy/sy99/pop/apprDocuAlarm', '_blank');
      clearAlertState();
    };

    document.getElementById('erpCloseBtn').onclick = clearAlertState;
  }

  /* ===============================
     상태 체크 (존재 여부만)
  =============================== */
  async function check() {
    try {
      if (alertActive) return; // 🔒 알림 활성 중이면 아무것도 안 함

      const res = await fetch(CHECK_URL, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        }
      });

      if (!res.ok) return;

      const json = await res.json();
      const count = json?.data?.apprDocuAlarmCnt;

      if (typeof count !== 'number') return;

      const existsNow = count > 0;

      // 없음 → 있음 변화만 감지
      if (!hasPending && existsNow) {
        alertActive = true;

        console.log('[ERP 알림] 미결재 문서 존재 감지');

        if (settings.enableOS && typeof GM_notification === 'function') {
          GM_notification({
            title: '📌 전자결재 도착',
            text: '미결재 문서가 있습니다',
            timeout: 0,
            onclick: () => {
              window.open('/erp/sy/sy99/pop/apprDocuAlarm', '_blank');
              clearAlertState();
            }
          });
        }

        if (settings.enableFixedUI) {
          showFixedUI();
        }
      }

      hasPending = existsNow;

    } catch (e) {
      console.debug('[ERP 알림] 예외 발생', e);
    }
  }

  /* ===============================
     타이머 재시작
  =============================== */
  function restartChecker() {
    if (timerId) clearInterval(timerId);
    timerId = setInterval(check, settings.intervalMin * 60 * 1000);
  }

  /* ===============================
     설정 UI
  =============================== */
  function openSettingsUI() {
    document.querySelectorAll('.erp-settings-panel').forEach(el => el.remove());

    const panel = document.createElement('div');
    panel.className = 'erp-settings-panel';
    panel.style.cssText = `
      position: fixed;
      top: 80px;
      right: 24px;
      background: #fff;
      border-radius: 12px;
      padding: 14px 16px;
      box-shadow: 0 6px 16px rgba(0,0,0,.2);
      z-index: 2147483647;
      font-size: 13px;
    `;

    panel.innerHTML = `
      <b>ERP 결재 알림 설정</b><br><br>

      ⏱ 체크 주기 (분)<br>
      <input id="erpInterval" type="number" min="1" value="${settings.intervalMin}" style="width:80px"><br><br>

      <label>
        <input id="erpOS" type="checkbox" ${settings.enableOS ? 'checked' : ''}>
        OS 알림 사용
      </label><br>

      <label>
        <input id="erpFixed" type="checkbox" ${settings.enableFixedUI ? 'checked' : ''}>
        고정 UI 사용
      </label><br><br>

      <button id="erpSave">저장</button>
      <button id="erpClose" style="margin-left:6px;">닫기</button>
    `;

    document.body.appendChild(panel);

    document.getElementById('erpSave').onclick = () => {
      settings.intervalMin = Number(document.getElementById('erpInterval').value);
      settings.enableOS = document.getElementById('erpOS').checked;
      settings.enableFixedUI = document.getElementById('erpFixed').checked;

      GM_setValue('intervalMin', settings.intervalMin);
      GM_setValue('enableOS', settings.enableOS);
      GM_setValue('enableFixedUI', settings.enableFixedUI);

      restartChecker();
      panel.remove();
      alert('설정이 즉시 적용되었습니다.');
    };

    document.getElementById('erpClose').onclick = () => panel.remove();
  }

  /* ===============================
     시작
  =============================== */
  setTimeout(() => {
    check();
    restartChecker();
  }, 10000);

  GM_registerMenuCommand('⚙ ERP 결재 알림 설정', openSettingsUI);

})();