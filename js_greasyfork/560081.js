// ==UserScript==
// @name         Templerun Auto-Complete+
// @namespace    http://tampermonkey.net/
// @version      2025.12.02
// @description  치지직, 숲, 유튜브 라이브에서 가사를 자동완성 해줍니다.  일치하는 부분이 있는 가사 찾기(초성도 가능), 입력이 빈 칸일 때 다음 가사 미리 띄우기 등의 기능이 있습니다.
// @author       통나무대리요족
// @original     Nata
// @license      MIT
// @match        https://chzzk.naver.com/*
// @match        https://play.sooplive.co.kr/*
// @match        https://vod.sooplive.co.kr/*
// @match        https://www.youtube.com/*
// @match        *://www.youtube.com/live_chat*
// @run-at       document-idle
// @grant        unsafeWindow
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/560081/Templerun%20Auto-Complete%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/560081/Templerun%20Auto-Complete%2B.meta.js
// ==/UserScript==

(function() {
  'use strict';
let isUpdating = false;
const isYoutubePopup = location.hostname.includes('youtube');

function getPopupIframe() {
  if (! isYoutubePopup) return null;

  const iframes = window.top.document.querySelectorAll('iframe');
  for (const iframe of iframes) {
    try {
      const popup = iframe.contentDocument.getElementById('autocomplete_popup');
      if (popup) return iframe;
    } catch(e) {}
  }
  return null;
}

function updatePopupVisibility() {
  if (isUpdating) return;
  isUpdating = true;

  const isEnabled = localStorage.getItem('ac. popup_enabled') !== 'false';

  let popups;
  if (isYoutubePopup) {
    const iframe = getPopupIframe();
    if (iframe) {
      popups = iframe.contentDocument.querySelectorAll('#autocomplete_popup');
    }
  } else {
    popups = document.querySelectorAll('#autocomplete_popup');
  }

  if (popups) {
    popups.forEach(popup => {
      const items = popup.querySelectorAll('.autocomplete_item');
      items.forEach(item => {
        if (item.textContent.trim() !== '설정') {
          item.style. setProperty('display', isEnabled ?  '' : 'none', 'important');
        }
      });
    });
  }

  isUpdating = false;
}

const popupObserver = new MutationObserver(() => {
  updatePopupVisibility();
});

const watchPopup = () => {
  if (isYoutubePopup) {
    const iframe = getPopupIframe();
    if (iframe) {
      popupObserver.observe(iframe.contentDocument.body, { childList: true, subtree:  true });
      return;
    }
  } else {
    const popup = document.getElementById('autocomplete_popup');
    if (popup) {
      popupObserver.observe(popup, { childList: true });
      return;
    }
  }
  setTimeout(watchPopup, 500);
};
watchPopup();
var isYoutubeForStyle = location.hostname.includes('youtube.com');

if(isYoutubeForStyle){
  var ytStyleObserver = new MutationObserver(function(){
    var doc = window.top.document;
    var settingsUI = doc. getElementById('autocomplete_settings');

    if(settingsUI && ! doc.getElementById('cac-yt-settings-style')){
      var styleEl = document.createElement('style');
      styleEl.id = 'cac-yt-settings-style';
      styleEl.textContent = '#autocomplete_settings, #autocomplete_settings * { font-family: -apple-system, BlinkMacSystemFont, "Malgun Gothic", sans-serif ! important; font-size: 14px !important; color: rgb(255, 255, 255) !important; }';
      doc.head.appendChild(styleEl);
    }
  });
  ytStyleObserver.observe(window.top.document.body, { childList: true, subtree:  true });
}

    // ===== 1. 백업/복원 유틸 =====
  function exportBackup() {
    const templates = JSON.parse(localStorage.getItem('ac.templates') || '[]');
    const settings = JSON.parse(localStorage.getItem('ac.settings') || '{}');

    const backup = {
      version: '2024.12.22',
      exportDate: new Date().toISOString(),
      templates: templates,
      settings: settings
    };

    const dataStr = JSON.stringify(backup, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const now = new Date();
    const filename = `cac-backup-${
      now.getFullYear()
    }${String(now.getMonth() + 1).padStart(2, '0')}${
      String(now.getDate()).padStart(2, '0')
    }-${
      String(now.getHours()).padStart(2, '0')
    }${String(now.getMinutes()).padStart(2, '0')}${
      String(now.getSeconds()).padStart(2, '0')
    }.json`;

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    console.log(`[CAC] Backup exported: ${filename}`);
    alert(`✅ 백업 파일이 다운로드되었습니다: ${filename}`);
  }

  function importBackup(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const backup = JSON.parse(e.target.result);

          if (! backup.templates || !backup.settings) {
            throw new Error('Invalid backup file format');
          }

          // 새 데이터 저장
          localStorage.setItem('ac.templates', JSON.stringify(backup.templates));
          localStorage. setItem('ac.settings', JSON.stringify(backup.settings));

          console.log('[CAC] Backup restored successfully');
          alert(`✅ 백업이 복원되었습니다!\n템플릿: ${backup.templates. length}개\n설정이 업데이트되었습니다. `);

          resolve({ success: true, backup });
        } catch (error) {
          console.error('[CAC] Import error:', error);
          alert(`❌ 백업 파일을 읽을 수 없습니다:\n${error.message}`);
          reject(error);
        }
      };

      reader.onerror = (e) => {
        console. error('[CAC] File read error:', e);
        reject(e);
      };

      reader. readAsText(file);
    });
  }

  // ===== 2. 설정 팝업에 백업/복원 버튼 추가 =====
  function addBackupButtonsToSettings() {
    const isYT = location.hostname.includes('youtube.com');
    const doc = isYT ? window.top.document : document;
    const checkAndAddButtons = setInterval(() => {
      const settingsModal = doc.getElementById('autocomplete_settings');
      if (!settingsModal) return;

      // 이미 백업 버튼이 있으면 스킵
      if (window.top.document.getElementById('backup-export-btn')) {
        clearInterval(checkAndAddButtons);
        return;
      }

      let leftPane = null;
if (location.hostname. includes('youtube.com')) {
  const allLeftPanes = window.top.document.querySelectorAll('.autocomplete_pane.left_pane');
  for (let i = 0; i < allLeftPanes.length; i++) {
    if (allLeftPanes[i].getBoundingClientRect().width > 0) {
      leftPane = allLeftPanes[i];
      break;
    }
  }
} else {
  leftPane = settingsModal.querySelector('.autocomplete_pane.left_pane');
}
if (! leftPane) return;

      // 백업/복원 버튼 컨테이너
      const backupContainer = document.createElement('div');
      backupContainer.style.cssText = 'display:flex;gap:8px;margin-top:16px;border-top:1px solid rgba(115,119,127,0.3);padding-top:16px;';

      // 내보내기 버튼
      const exportBtn = document.createElement('button');
      exportBtn.id = 'backup-export-btn';
      exportBtn.className = 'autocomplete_button';
      exportBtn.textContent = '💾 백업 내보내기';
      exportBtn.onclick = exportBackup;
      exportBtn.style.flex = '1';

      // 불러오기 버튼
      const importBtn = document.createElement('button');
      importBtn.id = 'backup-import-btn';
      importBtn.className = 'autocomplete_button';
      importBtn.textContent = '📂 백업 불러오기';
      importBtn.style.flex = '1';

      // 숨겨진 파일 입력
      const fileInput = document.createElement('input');
      fileInput. type = 'file';
      fileInput.accept = '.json';
      fileInput.style.display = 'none';
      fileInput.onchange = async (e) => {
  const file = e.target.files[0];
  if (file) {
    try {
      await importBackup(file);
      // 페이지 새로고침 (새 데이터 반영)
      if (location.hostname.includes('youtube.com')) {
        setTimeout(() => window.top.location.reload(), 1000);
      } else {
        setTimeout(() => location.reload(), 1000);
      }
          } catch (err) {
            console.error('[CAC] Import failed:', err);
          }
        }
      };

      importBtn.onclick = () => fileInput.click();
const clearAllBtn = document.createElement('button');
clearAllBtn.id = 'backup-clear-btn';
clearAllBtn.className = 'autocomplete_button';
clearAllBtn.textContent = '🗑️ 전체 삭제';
clearAllBtn.style.flex = '1';
clearAllBtn.style.background = '#dc3545';
clearAllBtn.onclick = () => {
  if (confirm('정말 모든 템플릿을 삭제할까요?')) {
    localStorage.removeItem('ac.templates');
    localStorage.removeItem('ac.  templates');
    if (location.hostname.includes('youtube.com')) {
      window.top.location.reload();
    } else {
      location. reload();
    }
  }
};
      backupContainer.append(exportBtn, importBtn, clearAllBtn, fileInput);
        // 토글 컨테이너
const toggleContainer = document.createElement('div');
toggleContainer.style.cssText = 'display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;padding-bottom:16px;border-bottom:1px solid rgba(115,119,127,0.3);';

// 라벨
const toggleLabel = document.createElement('span');
toggleLabel.textContent = '자동 완성 기능';
toggleLabel.style.cssText = 'color:#fff;font-size:14px;';

// 토글 스위치
const toggleSwitch = document.createElement('div');
const isEnabled = localStorage.getItem('ac. popup_enabled') !== 'false';
toggleSwitch.style.cssText = `width:50px;height:26px;border-radius:13px;cursor:pointer;position:relative;transition:background 0.3s;background: ${isEnabled ? '#5c6bc0' : '#555'};`;

const toggleKnob = document.createElement('div');
toggleKnob.style.cssText = `width:22px;height:22px;border-radius:50%;background:#fff;position:absolute;top:2px;transition:left 0.3s;left:${isEnabled ? '26px' : '2px'};`;
toggleSwitch.appendChild(toggleKnob);

toggleSwitch.onclick = () => {
  const newState = localStorage.getItem('ac. popup_enabled') === 'false';
  localStorage.setItem('ac. popup_enabled', newState);
  toggleKnob.style.left = newState ? '26px' : '2px';
  toggleSwitch.style.background = newState ? '#5c6bc0' : '#555';
  updatePopupVisibility();

};
toggleContainer.append(toggleLabel, toggleSwitch);
      leftPane.insertBefore(backupContainer,leftPane.children[2]);
      leftPane.insertBefore(toggleContainer, backupContainer);

      clearInterval(checkAndAddButtons);
    }, 500);

    // 20초 후 포기
    setTimeout(() => clearInterval(checkAndAddButtons), 20000);
  }
if (location.hostname.includes('youtube.com')) {
  window.top.document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('#autocomplete_settings').forEach(el => {
        el.style.display = 'none';
      });
      window.top.document.querySelectorAll('#autocomplete_settings').forEach(el => {
        el.style. display = 'none';
      });
    }
  });
}
  // ===== 2. CSS 스타일 =====
  GM_addStyle(`
/* 팝업 스타일 */
#autocomplete_popup {
  display: flex;
  position: absolute;
  bottom: 48px;
  width: calc(100% - 10px);
  flex-direction: column;
  height: max-content;
  max-height: 150px;
  overflow:  hidden scroll ! important;
  z-index: 9;
  background: rgb(56, 58, 62) !important;
  border: 0px none !important;
  border-radius: 12px 0 0 12px !important;
}

html #autocomplete_popup .autocomplete_item {
  padding: 8px 28px;
  line-height: normal;
  word-break: keep-all;
  white-space: pre-wrap;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  font-size: 14px !important;
  color: rgba(255, 255, 255, 0.8) !important;
  font-family: -apple-system, BlinkMacSystemFont, "Malgun Gothic", "맑은 고딕", Helvetica, Arial, sans-serif !important;
}

#autocomplete_popup .autocomplete_item:hover,
#autocomplete_popup .autocomplete_item.selected {
  background: rgb(79, 82, 88) !important;
}

#autocomplete_popup .autocomplete_item:active {
  background: rgb(91, 94, 101) !important;
}

.autocomplete_subtext {
  color: rgba(255, 255, 255, 0.5) !important;
  font-size: 12px !important;
  font-family: -apple-system, BlinkMacSystemFont, "Malgun Gothic", "맑은 고딕", Helvetica, Arial, sans-serif !important;
}

/* 설정 UI 스타일 */
#autocomplete_settings {
  display: none;
  position: fixed;
  top: 32px;
  bottom: 32px;
  left: 32px;
  right: 32px;
  overflow-y: scroll;
  padding: 24px;
  gap: 24px;
  background: rgba(56, 58, 62, 0.875);
  border: 1px solid rgba(115, 119, 127, 0.75);
  border-radius: 12px 0 0 12px !important;
  backdrop-filter: blur(4px);
  z-index: 99999;
}

#autocomplete_settings.opened {
  display: flex;
}

.autocomplete_button {
  display: flex;
  flex-shrink: 0;
  padding: 12px 24px;
  border: 0.8px solid rgba(115, 119, 127, 0.5) !important;
  border-radius: 6px;
  line-height: normal;
  align-items: center;
  justify-content: center;
  word-break: keep-all;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  background: rgba(0, 0, 0, 0) !important;
  color: rgb(255, 255, 255) !important;
  font-size: 14px !important;
  font-family: -apple-system, BlinkMacSystemFont, "Malgun Gothic", "맑은 고딕", Helvetica, Arial, sans-serif !important;
  transition: background 0.2s cubic-bezier(0.2, 1, 0.5, 0.95);
}

.autocomplete_button:hover,
.autocomplete_button.selected {
  background: rgb(79, 82, 88) !important;
}

.autocomplete_button:active {
  background: rgb(91, 94, 101) !important;
}

.autocomplete_button.left {
  justify-content: flex-start;
}

#backup-export-btn,
#backup-import-btn {
  padding: 12px 24px;
  border: 0.8px solid rgba(115, 119, 127, 0.5) !important;
  border-radius: 6px;
  background: rgba(0, 0, 0, 0) !important;
  color: rgb(255, 255, 255) !important;
  cursor: pointer;
  user-select: none;
  transition: background 0.2s cubic-bezier(0.2, 1, 0.5, 0.95);
  font-weight: bold;
}

#backup-export-btn:hover,
#backup-import-btn:hover {
  background: rgb(79, 82, 88) !important;
}

#backup-export-btn:active,
#backup-import-btn:active {
  background: rgb(91, 94, 101) !important;
}

.autocomplete_pane {
  display: flex;
  width: 100%;
  height: 100%;
  gap: 8px;
  flex-direction: column;
  overflow-y: scroll;
}

.autocomplete_pane.right_pane {
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
}

/* 오른쪽 부분(right_pane) INPUT 스타일 */
.autocomplete_pane.right_pane input {
  background-color: rgb(21, 22, 25) !important;
  color: rgb(255, 255, 255) !important;
  border: 1.6px solid rgb(115, 119, 127) !important;
  border-radius: 8px !important;
  padding: 12px 16px !important;
  font-size: 14px !important;
  font-family: -apple-system, BlinkMacSystemFont, "Malgun Gothic", "맑은 고딕", Helvetica, Arial, sans-serif !important;
  width: 100% !important;
  box-sizing: border-box !important;
}

.autocomplete_pane.right_pane input:hover {
  background-color: rgb(33, 34, 37) !important;
  border-color: rgb(140, 145, 155) !important;
}

.autocomplete_pane.right_pane input:focus {
  background-color: rgb(33, 34, 37) !important;
  border-color: rgb(167, 171, 180) !important;
}

/* 오른쪽 부분(right_pane) DIV 라벨 스타일 */
.autocomplete_pane.right_pane > div:not(input):not(button) {
  color: rgb(255, 255, 255) !important;
  font-size: 14px !important;
  font-family: -apple-system, BlinkMacSystemFont, "Malgun Gothic", "맑은 고딕", Helvetica, Arial, sans-serif !important;
  font-weight: 400 !important;
  padding: 0px !important;
  margin: 0px !important;
  line-height: 16.8px !important;
}

/* 오른쪽 부분(right_pane) BUTTON 스타일 */
.autocomplete_pane.right_pane button {
  background-color: rgba(0, 0, 0, 0) !important;
  color: rgb(255, 255, 255) !important;
  border: 0.8px solid rgba(115, 119, 127, 0.5) !important;
  border-radius: 6px !important;
  padding: 12px 24px !important;
  font-size: 14px !important;
  font-family: -apple-system, BlinkMacSystemFont, "Malgun Gothic", "맑은 고딕", Helvetica, Arial, sans-serif !important;
  cursor: pointer !important;
  transition: color 0.2s cubic-bezier(0.2, 1, 0.5, 0.95), background-color 0.2s cubic-bezier(0.2, 1, 0.5, 0.95), border-color 0.2s cubic-bezier(0.2, 1, 0.5, 0.95), text-decoration-color 0.2s cubic-bezier(0.2, 1, 0.5, 0.95), fill 0.2s cubic-bezier(0.2, 1, 0.5, 0.95), stroke 0.2s cubic-bezier(0.2, 1, 0.5, 0.95), opacity 0.2s cubic-bezier(0.2, 1, 0.5, 0.95), box-shadow 0.2s cubic-bezier(0.2, 1, 0.5, 0.95), transform 0.2s cubic-bezier(0.2, 1, 0.5, 0.95), filter 0.2s cubic-bezier(0.2, 1, 0.5, 0.95), backdrop-filter 0.2s cubic-bezier(0.2, 1, 0.5, 0.95) !important;
}

.autocomplete_pane.right_pane button:hover {
  background-color: rgb(79, 82, 88) !important;
}

.autocomplete_pane.right_pane button:active {
  background-color: rgb(91, 94, 101) !important;
}

.autocomplete_input {
  display: flex;
  position: relative;
  width: 100%;
  margin: 0;
  outline: none;
  border: 2px solid rgb(115, 119, 127);
  border-radius: 8px;
  padding: 12px 16px;
  line-height: normal;
  align-items: center;
  background: rgb(21, 22, 25);
  color: white;
  cursor: text;
}

.autocomplete_input:hover,
.autocomplete_input:focus {
  background: rgb(33, 34, 37);
}

.autocomplete_input:hover {
  border-color: rgb(140, 145, 155);
}

.autocomplete_input:focus {
  border-color: rgb(167, 171, 180);
}

.autocomplete_textarea {
  display: flex;
  position: relative;
  width: 100%;
  height: 100%;
  margin: 0;
  outline: none;
  border: 2px solid rgb(115, 119, 127);
  border-radius: 8px;
  padding: 12px 16px;
  line-height: normal;
  align-items: center;
  background: rgb(21, 22, 25);
  color: white;
  cursor: text;
}

.autocomplete_textarea:hover,
.autocomplete_textarea:focus {
  background: rgb(33, 34, 37);
}

.autocomplete_textarea:hover {
  border-color: rgb(140, 145, 155);
}

.autocomplete_textarea:focus {
  border-color: rgb(167, 171, 180);
}

.transition {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.2, 1, 0.5, 0.95);
  transition-duration: 0.2s;
}
  `);

  // ===== 3. MutationObserver로 right_pane 스타일 강제 적용 =====
  let styleObserverInitialized = false;

  const applyRightPaneStyles = () => {
  const rightPane = document.querySelector('.autocomplete_pane.right_pane');
  if (! rightPane) return;

  // INPUT 요소들
  rightPane.querySelectorAll('input'). forEach(input => {
    input.style.backgroundColor = 'rgb(21, 22, 25)';
    input.style. color = 'rgb(255, 255, 255)';
    input.style.border = '1. 6px solid rgb(115, 119, 127)';
    input.style.borderRadius = '8px';
    input.style. padding = '12px 16px';
    input.style. fontSize = '14px';
    input.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Malgun Gothic", "맑은 고딕", Helvetica, Arial, sans-serif';
    input.style.width = '100%';
    input.style.boxSizing = 'border-box';
  });

  // DIV 라벨 요소들 (모든 DIV에 스타일 적용 - TEXT 노드의 부모)
    // DIV/LABEL/SPAN 등 다른 요소들
  rightPane.querySelectorAll('div'). forEach(div => {
    if (div.tagName !== 'INPUT' && div.tagName !== 'BUTTON') {
      div.style.color = 'rgb(255, 255, 255)';
      div.style.fontSize = '14px';
      div.style. fontFamily = '-apple-system, BlinkMacSystemFont, "Malgun Gothic", "맑은 고딕", Helvetica, Arial, sans-serif';
      div.style.fontWeight = '400';
      div. style.lineHeight = '16. 8px';
    }
  });

  // TEXT 노드를 SPAN으로 감싸서 스타일 적용
  rightPane.childNodes.forEach(node => {
    if (node.nodeType === Node.TEXT_NODE && node. textContent.trim().length > 0) {
      const span = document.createElement('span');
      span.style.color = 'rgb(255, 255, 255)';
      span.style.fontSize = '14px';
      span.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Malgun Gothic", "맑은 고딕", Helvetica, Arial, sans-serif';
      span.style.fontWeight = '400';
      span.style.lineHeight = '16.8px';
      span.style.display = 'block';
      span.appendChild(node.cloneNode(true));
      node. parentNode.insertBefore(span, node);
      node.parentNode.removeChild(node);
    }
  });

  // BUTTON 요소들
  rightPane.querySelectorAll('button').forEach(button => {
    button.style.backgroundColor = 'rgba(0, 0, 0, 0)';
    button.style.color = 'rgb(255, 255, 255)';
    button.style. border = '0.8px solid rgba(115, 119, 127, 0.5)';
    button.style.borderRadius = '6px';
    button.style.padding = '12px 24px';
    button.style.fontSize = '14px';
    button.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Malgun Gothic", "맑은 고딕", Helvetica, Arial, sans-serif';
    button.style. cursor = 'pointer';
  });
};
  // DOM 변경 감시
  const styleObserver = new MutationObserver(() => {
    applyRightPaneStyles();
  });

  // 옵저버 시작
  const startStyleObserver = () => {
    if (!styleObserverInitialized) {
      styleObserver.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class']
      });
      styleObserverInitialized = true;
      console.log('[CAC] Style observer started');
    }
    applyRightPaneStyles();
  };

  // 초기 적용 및 감시
  startStyleObserver();

  // ===== 4. SOOP font-family 강제 적용 =====
  const applyFontFix = () => {
    const items = document.querySelectorAll('#autocomplete_popup .autocomplete_item');
    items.forEach(item => {
      item.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Malgun Gothic", "맑은 고딕", Helvetica, Arial, sans-serif';
      item.style.fontSize = '14px';
      item.style.color = 'rgba(255, 255, 255, 0.8)';
    });
  };

  // 요소가 생성/변경될 때마다 적용
  const observer = new MutationObserver(() => {
    applyFontFix();
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // 초기 적용
  applyFontFix();
  addBackupButtonsToSettings();

function updateLeftPaneScrollbar(){
  var target=document.querySelector('.autocomplete_pane.left_pane');
  if(!target)return;
  var rect=target. getBoundingClientRect();
  var track=document.querySelector('.cac-scrollbar-track[data-target-id="leftpane"]');
  if(rect.width===0||rect.height===0){
    if(track)track.style.display='none';
    return;
  }
  if(! track){track=createTrack('leftpane',null);}
  track.style.display='flex';
  track.style.top=rect.top+'px';
  track.style.left=(rect.right-14)+'px';
  track.style.height=rect.height+'px';
  updateThumb(target,track);
}

function updateRightPaneScrollbar(){
  var target=document.querySelector('.autocomplete_pane.right_pane');
  if(!target)return;
  var rect=target.getBoundingClientRect();
  var track=document.querySelector('.cac-scrollbar-track[data-target-id="rightpane"]');
  if(rect.width===0||rect.height===0){
    if(track)track.style.display='none';
    return;
  }
  if(!track){track=createTrack('rightpane',null);}
  track.style.display='flex';
  track.style.top=rect.top+'px';
  track.style.left=(rect. right-14)+'px';
  track.style.height=rect.height+'px';
  updateThumb(target,track);
}

function updateSettingsScrollbar(){
  var target=document. getElementById('autocomplete_settings');
  if(!target)return;
  var rect=target.getBoundingClientRect();
  var track=document.querySelector('.cac-scrollbar-track[data-target-id="settings"]');
  if(rect.width===0||rect.height===0){
    if(track)track.style.display='none';
    return;
  }
  if(! track){track=createTrack('settings',null);}
  track.style.display='flex';
  track.style.top=(rect.top+1)+'px';
  track.style.left=(rect.right-14-1)+'px';
  track.style.height=(rect.height-2)+'px';
  updateThumb(target,track);
}

function updatePopupScrollbar(){
  var popup=document.getElementById('autocomplete_popup');
  if(!popup)return;
  var rect=popup.getBoundingClientRect();
  var track=popup.querySelector('.cac-scrollbar-track[data-target-id="popup"]');
  if(rect.width===0||rect.height===0){
    if(track)track.style.display='none';
    return;
  }
  var wrapper=createPopupWrapper();
  if(!wrapper)return;
  if(!track){track=createTrack('popup',popup);}
  track.style.display='flex';
  updateThumb(wrapper,track);
}

var dragInfo=null;
document.addEventListener('mousedown',function(e){
if(e.target.classList.contains('cac-scrollbar-thumb')){
var track=e.target.closest('.cac-scrollbar-track');
var targetId=track.dataset.targetId;
var target;
if(targetId==='leftpane')target=document.querySelector('.autocomplete_pane.left_pane');
else if(targetId==='rightpane')target=document.querySelector('.autocomplete_pane.right_pane');
else if(targetId==='settings')target=document.getElementById('autocomplete_settings');
else if(targetId==='popup')target=document.getElementById('autocomplete_popup');
if(target){
dragInfo={target:target,startY:e.clientY,startScrollTop:target.scrollTop};
e.preventDefault();
}
}
});
document.addEventListener('mousemove',function(e){
if(!dragInfo)return;
var target=dragInfo.target;
var deltaY=e.clientY-dragInfo.startY;
var scrollHeight=target.scrollHeight;
var clientHeight=target.clientHeight;
var thumbHeight=Math.max((clientHeight/scrollHeight)*clientHeight,30);
var scrollDelta=(deltaY/(clientHeight-thumbHeight))*(scrollHeight-clientHeight);
target.scrollTop=dragInfo.startScrollTop+scrollDelta;
});
document.addEventListener('mouseup',function(){dragInfo=null;});

function hideNativeScrollbar(){
var settings=document.getElementById('autocomplete_settings');
if(settings){settings.style.setProperty('scrollbar-width','none','important');}
var panes=document.getElementsByClassName('autocomplete_pane');
for(var i=0;i<panes.length;i++){
panes[i].style.setProperty('scrollbar-width','none','important');
panes[i].style.setProperty('padding-right','14px','important');
}
var popup=document.getElementById('autocomplete_popup');
if(popup){
popup.style.setProperty('scrollbar-width','none','important');
popup.style.setProperty('overflow','hidden','important');
}
}

var style=document.createElement('style');
style.textContent='#autocomplete_settings: :-webkit-scrollbar,. autocomplete_pane::-webkit-scrollbar,#autocomplete_popup::-webkit-scrollbar{display:none! important;}';
document.head.appendChild(style);

function createTrack(targetId,parent){
var track=document.createElement('div');
track.className='cac-scrollbar-track';
track.dataset.targetId=targetId;
var isInside=(targetId==='popup');
if(isInside){
track.style.cssText='position:absolute;right:0;top:0;width:14px;height:100%;background:#2c2c2c;z-index:10;display:flex;flex-direction:column;pointer-events:none;';
}else{
track.style.cssText='position:fixed;width:14px;background:#2c2c2c;z-index:9999999;display:flex;flex-direction: column;pointer-events:none;';
}
var upBtn=document.createElement('div');
upBtn.className='cac-scrollbar-up';
upBtn. textContent='▲';
upBtn.style.cssText='width:14px;height:14px;background:#2c2c2c;color:#9f9f9f;font-size:10px;display:flex;align-items:center;justify-content: center;cursor:pointer;user-select:none;pointer-events: auto;';
upBtn.addEventListener('mouseenter',function(){this.style.color='#d1d1d1';});
upBtn.addEventListener('mouseleave',function(){this.style.color='#9f9f9f';});
upBtn.addEventListener('mousedown',function(){this.style.color='#d1d1d1';});
upBtn.addEventListener('mouseup',function(){this.style.color='#9f9f9f';});
upBtn.addEventListener('click',function(){var t;if(targetId==='leftpane')t=document.querySelector('.autocomplete_pane.left_pane');else if(targetId==='rightpane')t=document.querySelector('.autocomplete_pane.right_pane');else if(targetId==='settings')t=document.getElementById('autocomplete_settings');else if(targetId==='popup')t=document.getElementById('autocomplete_popup');if(t)t.scrollTop-=50;});
var middle=document. createElement('div');
middle.className='cac-scrollbar-middle';
middle.style.cssText='flex: 1;position:relative;background:#2c2c2c;';
var thumb=document.createElement('div');
thumb.className='cac-scrollbar-thumb';
thumb.style.cssText='position:absolute;left:50%;transform:translateX(-50%);width:9px;background:#9f9f9f;border-radius:4px;pointer-events:auto;cursor:pointer;';
thumb.addEventListener('mouseenter',function(){this.style.background='#d1d1d1';});
thumb.addEventListener('mouseleave',function(){if(! dragInfo)this.style.background='#9f9f9f';});
middle.appendChild(thumb);
var downBtn=document.createElement('div');
downBtn.className='cac-scrollbar-down';
downBtn.textContent='▼';
downBtn.style.cssText='width:14px;height: 14px;background:#2c2c2c;color:#9f9f9f;font-size:10px;display:flex;align-items:center;justify-content:center;cursor:pointer;user-select:none;pointer-events:auto;';
downBtn.addEventListener('mouseenter',function(){this.style.color='#d1d1d1';});
downBtn.addEventListener('mouseleave',function(){this.style.color='#9f9f9f';});
downBtn.addEventListener('mousedown',function(){this.style.color='#d1d1d1';});
downBtn.addEventListener('mouseup',function(){this.style.color='#9f9f9f';});
downBtn.addEventListener('click',function(){var t;if(targetId==='leftpane')t=document.querySelector('.autocomplete_pane.left_pane');else if(targetId==='rightpane')t=document.querySelector('.autocomplete_pane.right_pane');else if(targetId==='settings')t=document.getElementById('autocomplete_settings');else if(targetId==='popup')t=document.getElementById('autocomplete_popup');if(t)t.scrollTop+=50;});
track.appendChild(upBtn);
track.appendChild(middle);
track.appendChild(downBtn);
if(parent){
parent.appendChild(track);
}else{
document.body.appendChild(track);
}
return track;
}

function updateThumb(target,track){
var thumb=track.querySelector('.cac-scrollbar-thumb');
var scrollHeight=target.scrollHeight;
var clientHeight=target.clientHeight;
var scrollTop=target.scrollTop;
var trackHeight=track.offsetHeight-28;
if(scrollHeight<=clientHeight){
thumb.style.display='none';
}else{
thumb.style.display='block';
var thumbHeight=Math.max((clientHeight/scrollHeight)*trackHeight,30);
var thumbTop=(scrollTop/(scrollHeight-clientHeight))*(trackHeight-thumbHeight);
thumb.style.height=thumbHeight+'px';
thumb.style.top=thumbTop+'px';
}
}

function updateLeftPaneScrollbar(){
var doc=(isYoutubePopup&&window. top)?window.top.document:document;
var target=doc. querySelector('.autocomplete_pane.left_pane');
if(!target)return;
var rect=target.getBoundingClientRect();
var track=document.querySelector('.cac-scrollbar-track[data-target-id="leftpane"]');
if(rect.width===0||rect.height===0){
if(track)track.style.display='none';
return;
}
if(! track){track=createTrack('leftpane',null);}
track.style.display='flex';
track.style.top=rect.top+'px';
track. style.left=(rect.right-14)+'px';
track.style.height=rect.height+'px';
updateThumb(target,track);
}

function updateRightPaneScrollbar(){
var doc=(isYoutubePopup&&window.top)?window.top.document:document;
var target=doc.querySelector('.autocomplete_pane.right_pane');
if(!target)return;
var rect=target.getBoundingClientRect();
var track=document.querySelector('.cac-scrollbar-track[data-target-id="rightpane"]');
if(rect.width===0||rect.height===0){
if(track)track.style.display='none';
return;
}
if(!track){track=createTrack('rightpane',null);}
track.style.display='flex';
track.style.top=rect.top+'px';
track.style.left=(rect. right-14)+'px';
track.style.height=rect. height+'px';
updateThumb(target,track);
}

function updateSettingsScrollbar(){
var target=document.getElementById('autocomplete_settings');
if(!target)return;
var rect=target.getBoundingClientRect();
var track=document.querySelector('.cac-scrollbar-track[data-target-id="settings"]');
if(rect.width===0||rect.height===0){
if(track)track.style.display='none';
return;
}
if(! track){track=createTrack('settings',null);}
track.style.display='flex';
track.style.top=(rect.top+1)+'px';
track.style.left=(rect.right-14-1)+'px';
track.style.height=(rect.height-2)+'px';
updateThumb(target,track);
}

function createPopupWrapper(){
var popup=document.getElementById('autocomplete_popup');
if(!popup)return null;
var wrapper=popup.querySelector('.cac-popup-wrapper');
if(!wrapper){
wrapper=document.createElement('div');
wrapper.className='cac-popup-wrapper';
wrapper.style.cssText='position:relative;width:100%;height:100%;overflow-y:auto;scrollbar-width:none;';
while(popup.firstChild){
wrapper.appendChild(popup.firstChild);
}
popup.appendChild(wrapper);
}
return wrapper;
}
  // ===== 4-1. 커스텀 스크롤바 =====
function updatePopupScrollbar(){
var popup=document.getElementById('autocomplete_popup');
if(!popup)return;
var rect=popup.getBoundingClientRect();
var track=popup.querySelector('.cac-scrollbar-track[data-target-id="popup"]');
if(rect.width===0||rect.height===0){
if(track)track.style.display='none';
return;
}
var wrapper=createPopupWrapper();
if(!wrapper)return;
if(!track){track=createTrack('popup',popup);}
track.style.display='flex';
updateThumb(wrapper,track);
}

setInterval(function(){
hideNativeScrollbar();
updateLeftPaneScrollbar();
updateRightPaneScrollbar();
updateSettingsScrollbar();
updatePopupScrollbar();
},50);

console.log('[CAC] 커스텀 스크롤바 적용 완료');

// ===== SOOP 복사/붙여넣기 활성화 =====
function enableCopyPaste(){
  var targets = [
    '#write_area',
    '#auqa_voice_textarea',
    '#adb_auqa_voice_textarea'
  ];

  targets.forEach(function(selector){
    var el = document.querySelector(selector);
    if(!el) return;
    if(el.dataset.copyPasteEnabled) return; // 중복 방지

    // 이벤트 핸들러 제거
    el.removeAttribute('onpaste');
    el.removeAttribute('oncopy');
    el.removeAttribute('ondragenter');
    el.removeAttribute('ondrop');
    el.removeAttribute('ondragover');

    // 붙여넣기 직접 처리
    el.addEventListener('paste', function(e){
      e.preventDefault();
      e.stopPropagation();

      var text = (e.clipboardData || window. clipboardData).getData('text');
      if(!text) return;

      var sel = window.getSelection();
      if(! sel. rangeCount) return;

      // 현재 선택 영역 삭제 후 텍스트 삽입
      var range = sel.getRangeAt(0);
      range.deleteContents();
      var textNode = document.createTextNode(text);
      range.insertNode(textNode);

      // 커서를 텍스트 끝으로 이동
      range.setStartAfter(textNode);
      range.setEndAfter(textNode);
      sel.removeAllRanges();
      sel.addRange(range);
    }, true);

    el.addEventListener('copy', function(e){ e.stopPropagation(); }, true);

    el.dataset.copyPasteEnabled = 'true';
  });
}

setInterval(enableCopyPaste, 500);

console.log('[CAC] 복사/붙여넣기 활성화 완료');
  // ===== 5. 기존 CAC 코드 =====
var b=(e,{scope:n,equals:s=pe,lazy:o=!0}={})=>{let l={scope:n,equals:s,init:e};l.base=l;let t=Object.create(l);return t.e=98,t.a={get signal(){return ne(t)}},e instanceof Function?(t.r=0,t.u=e,o||(t.e=102,N(t)),t.get=(i=!(t.e&7180))=>{if(i&&N(t),t.e&1)return t.n;throw t.e&2?new Promise((u,r)=>{let p=t.watch(()=>{t.o===void 0?u(t.n):r(t.o),p()})}):t.o},Object.defineProperty(t,"state",{get:()=>({pending:!!(t.e&2)||!(t.e&7180),error:t.o,value:t.n})})):(t.e=105,t.n=e,t.get=()=>t.n,t.set=i=>{J(t,i instanceof Function?i(t.n):i)}),t.watch=i=>{let u=!(t.e&7180);return t.e|=2048,(t.l??=new Set).add(i),u&&N(t),()=>{t.l.delete(i),!t.l.size&&!((t.e&=-2049)&7180)&&W(t)}},t.subscribe=i=>{let u=!(t.e&7180);t.e|=4096;let r={p:i,a:{get signal(){return ne(r)}}};return(t.i??=new Set).add(r),u?N(t):t.e&1&&queueMicrotask(()=>i(t.n,t.a)),()=>{t.i.delete(r),!t.i.size&&!((t.e&=-2049)&7180)&&W(t),r.t!==void 0&&(r.t.abort(),r.t=void 0)}},t};var N=e=>{e.e|=2;let n=++e.r;e.o!==void 0&&(e.o=void 0),e.t!==void 0&&(e.t.abort(),e.t=void 0);try{let s=e.u((o,l=!1)=>{if(n!==e.r)throw void 0;if(o!==e&&(e.scope!==void 0&&(o=l?e.scope(o):e.scope.get(o)),e.e&7180)){(e.c??=new Set).add(o),o.s??=new Set;let t=!!(e.e&32)&&!(o.e&7180);o.e|=1024;let i=o.get(t);return o.s.add(e),i}return o.get()},e.a);me(s)?(s.then(o=>{n===e.r&&J(e,o)},o=>{n===e.r&&te(e,o)}),z(e)):J(e,s)}catch(s){te(e,s)}},J=(e,n)=>{e.e=e.e&-3|1;let s=e.n;!Object.is(n,s)&&!e.equals(n,s)&&(e.n=n,z(e),(e.e&4160)===4160&&(e.e&=-65,de(()=>{if((e.e&4097)===4097)for(let o of e.i)o.t!==void 0&&(o.t.abort(),o.t=void 0),queueMicrotask(()=>o.p(e.n,o.a));e.e|=64})),oe(e))},te=(e,n)=>{e.e&=-4,Object.is(e.o,n)||(e.o=n,z(e),oe(e))},z=e=>{if(e.e&2048)for(let n of e.l)n();e.e&=-129},oe=e=>{if((e.e&1056)===1056){se(e);for(let n of e.s)n.e|=128;for(let n=q.length;n--;){let s=q[n];if(s.e&128)if(N(s),(s.e&1152)===1024){for(let o of s.s)o.e|=128;s.e&=-1025,s.s.clear()}else s.e&=-129;s.e|=32}q=[]}},se=e=>{for(let n of e.s)n.e&32&&n.e&7172&&(n.e&=-33,n.e&1024&&se(n),q.push(n))},W=e=>{e.t!==void 0&&(e.t.abort(),e.t=void 0);for(let n of e.c)n.s.delete(e)&&!n.s.size&&!((e.e&=-1025)&7180)&&W(n);e.c.clear()},ne=e=>{let n=(e.t??=new AbortController).signal;if(n.then===void 0){let s=[];n.then=o=>{n.aborted?o():s.push(o)},n.addEventListener("abort",()=>{for(let o of s)o()},{once:!0,passive:!0})}return n},pe=()=>!1,me=e=>typeof e?.then=="function",q=[],A=[],de=e=>{A.length===0&&queueMicrotask(()=>{let n=A;A=[];for(let s of n)s()}),A.push(e)};var K=["\u3131","\u3132","\u3134","\u3137","\u3138","\u3139","\u3141","\u3142","\u3143","\u3145","\u3146","\u3147","\u3148","\u3149","\u314A","\u314B","\u314C","\u314D","\u314E"],ge=new Set(K.map(e=>e.charCodeAt(0)));var fe=["\u314F","\u3150","\u3151","\u3152","\u3153","\u3154","\u3155","\u3156","\u3157","\u3157\u314F","\u3157\u3150","\u3157\u3163","\u315B","\u315C","\u315C\u3153","\u315C\u3154","\u315C\u3163","\u3160","\u3161","\u3161\u3163","\u3163"];var be=["","\u3131","\u3132","\u3131\u3145","\u3134","\u3134\u3148","\u3134\u314E","\u3137","\u3139","\u3139\u3131","\u3139\u3141","\u3139\u3142","\u3139\u3145","\u3139\u314C","\u3139\u314D","\u3139\u314E","\u3141","\u3142","\u3142\u3145","\u3145","\u3146","\u3147","\u3148","\u314A","\u314B","\u314C","\u314D","\u314E"];var F=e=>{let n="",s=e.length;for(let o=0;o<s;o+=1){let l=e.charCodeAt(o),t=l-44032|0;if(t<0||t>=11172){n+=String.fromCharCode(l);continue}let i=K[t/588|0],u=fe[(t%588|0)/28|0],r=be[t%28|0];n+=i+u+r}return n},ae=e=>{let n="",s=e.length;for(let o=0;o<s;o+=1){let l=e.charCodeAt(o);if(ge.has(l)||l===10||l===32){n+=String.fromCharCode(l);continue}let t=l-44032|0;if(t<0||t>=11172)continue;let i=K[t/588|0];n+=i}return n};var xe=e=>e.nodeType===Node.ELEMENT_NODE,U=(e,n,s=document.body)=>{let o=new WeakMap,l=r=>{let p=[],f=v=>{p.push(v)};o.set(r,p),n(r,f)},t=r=>{let p=o.get(r);o.delete(r);for(let f of p)f()},i=(r,p)=>{if(xe(r)){r.matches(e)&&p(r);for(let f of r.querySelectorAll(e))p(f)}};for(let r of s.querySelectorAll(e))l(r);let u=new MutationObserver(r=>{for(let p of r){for(let f of p.removedNodes)i(f,t);for(let f of p.addedNodes)i(f,l)}});return u.observe(s,{childList:!0,subtree:!0}),u};var re=e=>{let n=!0,s=()=>{n&&(e(),requestAnimationFrame(s))};return requestAnimationFrame(s),()=>{n=!1}};localStorage.getItem("ac.settings")===null&&localStorage.setItem("ac.settings",JSON.stringify({cooltime:2*1e3,nextLyricsCount:3,wsRemovalProb:.02,conRemovalProb:.02,xCoord:0,yCoord:0,opacity:1}));localStorage.getItem("ac.templates")===null&&localStorage.setItem("ac.templates",JSON.stringify([]));var{cooltime:he=2*1e3,nextLyricsCount:ve=3,wsRemovalProb:Ve=.02,conRemovalProb:Be=.02,xCoord:XC=0,yCoord:YC=0,opacity:OP=1}=JSON.parse(localStorage.getItem("ac.settings")??"{}"),ye=JSON.parse(localStorage.getItem("ac.templates")??"[]"),P=b(Math.max(he,2*1e3)),M=b(ve),O=b(Ve),$=b(Be),xc=b(XC),yc=b(YC),op=b(OP),C=b(ye),le=b(0),Q=b(!1),j=b(!1),Se=b(e=>ke(e(C)));re(()=>le.set(performance.now()));var ie=e=>{let n=e.match(/<(.+?)>$/);return n===null?null:n[1]},Z=e=>e.match(/[0-9]+|[a-zA-Z]+|[ㄱ-ㅎㅏ-ㅣ가-힣]+|\S/g)??[],ce=e=>e.toLowerCase().replace(/\s/g," "),Ee=(e,n)=>e.replace(/\s/g,s=>Math.random()<n?"":s),Ce=(e,n)=>e.replace(/[ㄱ-ㅎㅏ-ㅣ !,.;()\[\]<>?^Vv~→←↑↓↖↗↘↙⬈⬉⬊⬋⬌⬅⬆⬇⮕⭠⭡⭢⭣]{4,}/g,s=>s.replace(/./g,o=>Math.random()<n?"":o)),we=e=>{let n=e.split(/\s*\|\s*/g).filter(t=>t.length>0).map(t=>{let i=t.split(":");return{text:i[0],prob:Number.parseFloat(i[1]??-100)/100}});if(n.length===0)return null;let s=0,o=1;for(let t of n)t.prob<0?s+=1:o-=t.prob=Math.min(t.prob,o);let l=o/s;for(let t of n)t.prob<0&&(t.prob=l);return n},Te=({text:e})=>{let n=ce(e),s=F(n);return{split:s,tokens:Z(s),chosungTokens:Z(ae(n))}},Ie=e=>{let n=Math.random(),s=0;for(let{text:o,prob:l}of e)if(s+=l,n<=s)return o;return e[0].text},ke=e=>{let n=[];for(let{title:s,text:o}of e){let l=o.trim().split(/\n+/g),t=l.length;for(let i=0;i<t;i+=1){let u=l[i].trim();if(u.length===0)continue;let r=we(u);if(r===null)continue;let p=r[0].text,f=r.map(Te),v={title:s,texts:r,mainText:p,transformations:f,next:null};i>0&&(n[n.length-1].next=v),n.push(v)}}return n},G=(e,n,s)=>{let o=e.length,l=n.length;if(o>l||o<=0)return null;let t=!1,i=0,u=0,r=0,p=e[0];for(let f=0;f+(o-r)<=l;f++){let v=n[f],B=v.length;if(p.startsWith(v))if(t=!0,p.length>B)p=p.slice(B),u+=1;else if(++r<o)p=e[r];else return i*1e4+f*100+u;else{if(v.startsWith(p)&&r+1>=o)return i*1e4+f*100+u;s?(t=!1,u=0,r=0,p=e[0]):t&&(t=!1,i+=1)}}return null},_e=(e,n)=>{let s=e.length,o=n.length;if(s>o||s<=0)return null;let l=!1,t=0,i=0;for(let u=0;u+(s-i)<=o;u++)if(e[i]===n[u]){if(l=!0,++i>=s)return t*1e4+u*100}else l&&(l=!1,t+=1);return null},Le=(e,n,s)=>{if(n.length===0)return null;if(/\s/.test(n[0]))return[];let o=[],l=[],t=[],i=F(ce(n)),u=Z(i);for(let r of e){let{transformations:p}=r,f=ie(r.title)===s?0:1,v=1e9,B=1e9,T=1e9;for(let{split:_,tokens:L,chosungTokens:c}of p){let d=G(u,L,!0)??G(u,L,!1)??1e9,h=G(u,c,!0)??G(u,c,!1)??1e9,y=_e(i,_)??1e9;v=Math.min(v,d),B=Math.min(B,h),T=Math.min(T,y)}v<1e9&&o.push({template:r,categoryPenalty:f,score:v}),B<1e9&&l.push({template:r,categoryPenalty:f,score:B}),T<1e9&&t.push({template:r,categoryPenalty:f,score:T})}return o.length===0&&(o=l),o.length===0&&(o=t),o.sort((r,p)=>r.categoryPenalty-p.categoryPenalty||r.score-p.score),o.map(r=>r.template)},Ne=({$popupElm:e,$inputElm:n,$text:s,$selection:o,$lastCompletionTime:l,$lastCompletion:t,$lastCompletionCategory:i},u)=>{let r=a=>{let g=n.get();g!==null&&(g.textContent=a,s.set(a))},p=()=>{let a=n.get();if(a===null)return;let g=document.createRange();g.selectNodeContents(a);let x=window.getSelection();x!==null&&(x.removeAllRanges(),x.addRange(g))},f=()=>{let a=n.get();if(a===null||c.get()!==null)return;let g=y.get()[o.get()],x=O.get(),m=$.get();a.focus(),p(),requestAnimationFrame(()=>{r(Ce(Ee(Ie(g.texts),x),m)),a.focus(),p(),o.set(0),l.set(performance.now()),t.set(g),i.set(ie(g.title))})},v=({target:a})=>{o.set(S.get().indexOf(a)),f()},B=()=>{j.set(!0)},T=(a,g)=>{if(a===null)return[];let x=[],m=a.next;for(let E=0;E<g&&m!==null;E+=1)x.push(m),m=m.next;return x},_=()=>{let a=document.createElement("div");return a.textContent="\uC124\uC815",a.className="autocomplete_item",a.addEventListener("click",B),a},L=(a,g)=>{let{title:x,mainText:m,next:E}=a,V=document.createElement("div"),I=E?E.mainText:"(\uB05D)",D=g?`\u{1F512}(${g}\uCD08) `:"";return V.innerHTML=`${D}${m} <span class="autocomplete_subtext">\u2192 ${I} @ [${x}]</span>`,V.className="autocomplete_item",V.addEventListener("click",v),V},c=b(a=>{let g=a(le),x=a(l),m=a(P),V=x+m-g;return V<=0?null:(V/1e3).toFixed(1)}),d=b(a=>/^\s$/.test(a(s))),h=b(a=>T(a(t),a(M))),y=b(a=>{if(a(Q))return[];let g=Le(a(Se),a(s),a(i));if(g===null)return a(h);let x=a(t);return g.filter(m=>m!==x).slice(0,10)}),S=b(a=>{if(a(d))return[_()];let g=a(c);return a(y).map(m=>L(m,g))}),w=b(a=>a(S)[a(o)]);return u(y.subscribe(()=>{o.set(0)})),u(S.subscribe((a,{signal:g})=>{e.get().append(...a),g.then(()=>{for(let m of a)m.remove()})})),u(w.subscribe((a,{signal:g})=>{a!==void 0&&(a.classList.add("selected"),a.scrollIntoView({behavior:"instant",block:"nearest"}),g.then(()=>{a.classList.remove("selected")}))})),{handleControlKey:a=>{if(j.get())return;let{ctrlKey:g,altKey:x,metaKey:m,shiftKey:E,key:V,isComposing:I}=a;if(V==="Dead"||V==="Unidentified"||V==="Enter"||g||x||m||E||I)return;let D=d.get(),X=Q.get();if(V==="Escape"&&!D){Q.set(!X);return}if(X)return;let R=y.get().length,Y=o.get(),H=R===0,ee=ue=>{o.set((ue%R+R)%R)};if(V==="ArrowDown"){if(H)return;ee(Y+1)}else if(V==="ArrowUp"){if(H)return;ee(Y-1)}else if(V==="Tab")D?B():H||f();else return;a.preventDefault(),a.stopPropagation()}}};GM_addStyle(`
#autocomplete_popup {
	display: flex;
	position: absolute;
	bottom: 48px;
	width: calc(100% - 10px);
	flex-direction: column;
	height: max-content;
	max-height: 150px;
	overflow: hidden scroll;
	z-index: 9;
	background: rgb(56,58,62);
	border-radius: 12px;
}
.autocomplete_item {
	padding: 8px 28px;
	line-height: normal;
	word-break: keep-all;
	white-space: pre-wrap;
	cursor: pointer;
	user-select: none;
	-webkit-user-select: none;
}
.autocomplete_item:hover, .autocomplete_item.selected {
	background: rgb(79,82,88);
}
.autocomplete_item:active {
	background: rgb(91,94,101);
}
.autocomplete_subtext {
	color: rgba(255, 255, 255, 0.5);
}
`);const isChzzk = location.hostname. includes('chzzk');
const isYoutube = location.hostname.includes('youtube');

const WRAP = isChzzk
  ? "div[class*=live_chatting_input_container]"
  : isYoutube
  ? "#input-container.yt-live-chat-message-input-renderer"
  :  "#chat_write";

const INPUT = isChzzk
  ?  "pre[contenteditable]"
  : isYoutube
  ? "div#input.yt-live-chat-text-input-field-renderer[contenteditable]"
  : "#write_area[contenteditable='true']";

U(WRAP,e=>{let n=document.createElement("div");n.id="autocomplete_popup",xc.subscribe(v=>{n.style.left=`${v}px`}),yc.subscribe(v=>{n.style.bottom=`${48-v}px`}),op.subscribe(v=>{n.style.opacity=`${v}`}),e.appendChild(n);let s=b(n),o=b(null),l=b(""),t=b(0),i=b(0),u=b(null),r=b(null);U(INPUT,(p,f)=>{let v=p,B=()=>{l.set(v.textContent??"")};o.set(v),v.addEventListener("input",B);let{handleControlKey:T}=Ne({$popupElm:s,$inputElm:o,$text:l,$selection:t,$lastCompletionTime:i,$lastCompletion:u,$lastCompletionCategory:r},f);v.addEventListener("keydown",T),f(re(B))},e)});GM_addStyle(`
#autocomplete_settings {
	display: none;
	position: fixed;
	top: 32px;
	bottom: 32px;
	left: 32px;
	right: 32px;
	overflow-y: scroll;
	padding: 24px;
	gap: 24px;
	background: rgba(56,58,62,0.875);
	border: 1px solid rgb(115,119,127,0.75);
	border-radius: 12px;
	backdrop-filter: blur(4px);
	z-index: 99999;
}
#autocomplete_settings.opened {
	display: flex;
}
.autocomplete_button {
	display: flex;
	flex-shrink: 0;
	padding: 12px 24px;
	border: 1px solid rgb(115,119,127,0.5);
	border-radius: 6px;
	line-height: normal;
	align-items: center;
	justify-content: center;
	word-break: keep-all;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	cursor: pointer;
	user-select: none;
	-webkit-user-select: none;
}
.autocomplete_button.left {
	justify-content: flex-start;
}
.autocomplete_button:hover, .autocomplete_button.selected {
	background: rgb(79,82,88);
}
.autocomplete_button:active {
	background: rgb(91,94,101);
}
.autocomplete_subtext {
	color: rgba(255, 255, 255, 0.5);
}

.autocomplete_pane {
	display: flex;
	width: 100%;
	height: 100%;
	gap: 8px;
	flex-direction: column;
	overflow-y: scroll;
}
.autocomplete_pane.right_pane {
	display: flex;
	width: 100%;
	height: 100%;
	flex-direction: column;
}

.autocomplete_input {
	display: flex;
	position: relative;
	width: 100%;
	margin: 0;
	outline: none;
	border: 2px solid rgb(115,119,127);
	border-radius: 8px;
	padding: 12px 16px;
	line-height: normal;
	align-items: center;
	background: rgb(21,22,25);
	color: white;
	cursor: text;
}
.autocomplete_input:hover, .autocomplete_input:focus {
	background: rgb(33,34,37);
}
.autocomplete_input:hover {
	border-color: rgb(140,145,155);
}
.autocomplete_input:focus {
	border-color: rgb(167,171,180);
}

.autocomplete_textarea {
	display: flex;
	position: relative;
	width: 100%;
	height: 100%;
	margin: 0;
	outline: none;
	border: 2px solid rgb(115,119,127);
	border-radius: 8px;
	padding: 12px 16px;
	line-height: normal;
	align-items: center;
	background: rgb(21,22,25);
	color: white;
	cursor: text;
}
.autocomplete_textarea:hover, .autocomplete_textarea:focus {
	background: rgb(33,34,37);
}
.autocomplete_textarea:hover {
	border-color: rgb(140,145,155);
}
.autocomplete_textarea:focus {
	border-color: rgb(167,171,180);
}

.transition {
	transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
	transition-timing-function: cubic-bezier(.2,1,.5,.95);
	transition-duration: .2s;
}
`);{let e=b(-1),n=b(c=>-Math.min(c(e),0)),s=b(c=>{let d=c(e);return d===null?null:c(C)[d]??null}),o=c=>{let d=document.createElement("div");return d.textContent=c,d},l=(c,d,h=[])=>{let y=document.createElement("button");return y.className="autocomplete_button transition",y.classList.add(...h),y.textContent=c,y.addEventListener("click",d),y},t=(c,d="text")=>{let h=document.createElement("input");return h.className="autocomplete_input transition",h.type=d,h.value=c,h},i=(c,d="")=>{let h=document.createElement("textarea");return h.className="autocomplete_textarea transition",h.placeholder=d,h.value=c,h},u=document.createElement("div");u.id="autocomplete_settings",(isYoutube && window.top ?  window.top.document.body :  document.body).appendChild(u);if(isYoutube&&window.top){
var styleEl=window.top.document.createElement('style');
styleEl.textContent=document.querySelector('style').textContent;
window.top.document.head.appendChild(styleEl);
}let r=document.createElement("div"),p=document.createElement("div");r.className="autocomplete_pane left_pane",p.className="autocomplete_pane right_pane",u.append(r,p);let f=l("\u2699\uFE0F \uC124\uC815",()=>{e.set(e.get()!==-1?-1:-2)}),v=l("\u{1F4DD} \uD15C\uD50C\uB9BF \uCD94\uAC00\uD558\uAE30",()=>{let c={title:"\uC0C8 \uD15C\uD50C\uB9BF",text:""};C.set([c,...C.get()]),e.set(0)});r.append(f,v);let B=(c,d,h,y)=>{let S=Number(c);return Number.isNaN(S)||S<d||S>h?y:Math.floor(S)};n.subscribe((c,{signal:d})=>{if(c===0)return;p.textContent='';if(c===2){let m=i(JSON.stringify(C.get(),null,4)),E=l("\uC800\uC7A5",()=>{let I=JSON.parse(m.value);localStorage.setItem("ac.templates",JSON.stringify(I)),C.set(I)});f.textContent="\u2699\uFE0F \uC124\uC815 - \uC77C\uBC18 \uC124\uC815\uC73C\uB85C \uC804\uD658\uD558\uAE30";let V=[m,E];p.append(...V),d.then(()=>{f.textContent="\u2699\uFE0F \uC124\uC815";for(let I of V)I.remove()});return}b(m=>JSON.stringify({cooltime:m(P),nextLyricsCount:m(M),wsRemovalProb:m(O),conRemovalProb:m($),xCoord:m(xc),yCoord:m(yc),opacity:m(op)})).subscribe(m=>{localStorage.setItem("ac.settings",m)});let y=()=>{let m=B(S.value,2,60,P.get()/1e3)*1e3,E=B(w.value,0,10,M.get()),V=B(k.value,0,100,O.get()*100)/100,I=B(a.value,0,100,$.get()*100)/100,Xc=B(xC.value,-9999,9999,xc.get()),Yc=B(yC.value,-9999,9999,yc.get()),Op=B(oP.value,0,100,op.get()*100)/100;P.set(m),M.set(E),O.set(V),$.set(I),xc.set(Xc),yc.set(Yc),op.set(Op)},S=t((P.get()/1e3).toString(),"number"),w=t(M.get().toString(),"number"),k=t((O.get()*100).toString(),"number"),a=t(($.get()*100).toString(),"number"),xC=t(xc.get().toString(),"number"),yC=t(yc.get().toString(),"number"),oP=t((op.get()*100).toString(),"number"),g=l("\uC800\uC7A5",y);S.min="2",S.max="60",w.min="0",w.max="10",k.min="0",k.max="100",a.min="0",a.max="100",oP.min="0",oP.max="100";let x=[o("\uBBF8\uB9AC \uB744\uC6B8 \uB2E4\uC74C \uD14D\uC2A4\uD2B8\uC758 \uAC1C\uC218:"),w,o("\uB744\uC5B4\uC4F0\uAE30 \uC0AD\uC81C \uD655\uB960 (% \uB2E8\uC704):"),k,o("\uC5F0\uC18D\uD55C \uC790\uC74C/\uBAA8\uC74C \uBC0F \uD2B9\uC218\uBB38\uC790 \uC0AD\uC81C \uD655\uB960 (% \uB2E8\uC704):"),a,o("\uCFE8\uD0C0\uC784 (\uCD08 \uB2E8\uC704, \uCD5C\uC18C 2\uCD08):"),S,"\uC790\uB3D9\uC644\uC131 \uD31D\uC5C5 X\uC88C\uD45C (px \uB2E8\uC704, \uC74C\uC218\uB294 \uC67C\uCABD, \uC591\uC218\uB294 \uC624\uB978\uCABD, -400~0 \uC0AC\uC774\uC758 \uAC12\uC744 \uAD8C\uC7A5):",xC,"\uC790\uB3D9\uC644\uC131 \uD31D\uC5C5 Y\uC88C\uD45C (px \uB2E8\uC704, \uC74C\uC218\uB294 \uC67C\uCABD, \uC591\uC218\uB294 \uC624\uB978\uCABD, -400~0 \uC0AC\uC774\uC758 \uAC12\uC744 \uAD8C\uC7A5):",yC,"\uC790\uB3D9\uC644\uC131 \uD31D\uC5C5 \uD22C\uBA85\uB3C4 (% \uB2E8\uC704, 0~100):",oP,g];p.append(...x),f.textContent="\u2699\uFE0F \uC124\uC815 - \uD15C\uD50C\uB9BF JSON \uD3B8\uC9D1 \uBAA8\uB4DC\uB85C \uC804\uD658\uD558\uAE30",d.then(()=>{for(let m of x)m.remove();f.textContent="\u2699\uFE0F \uC124\uC815"})});let T=({target:c})=>{let d=_.get().indexOf(c);e.set(d)},_=b(c=>c(C).map(({title:d})=>l(d,T,["left"]))),L=b(c=>{let d=c(e);if(d!==null)return c(_)[d]});_.subscribe((c,{signal:d})=>{r.append(...c),d.then(()=>{for(let h of c)h.remove()})}),L.subscribe((c,{signal:d})=>{c!==void 0&&(c.classList.add("selected"),d.then(()=>{c.classList.remove("selected")}))}),s.subscribe((c,{signal:d})=>{if(c===null)return;let{title:h,text:y}=c,S=t(h),w=i(y,`\uD14D\uC2A4\uD2B8\uB294 \uC904 \uB2E8\uC704\uB85C \uAD6C\uBD84\uB418\uBA70, \uBE48 \uC904\uACFC \uAC01 \uD14D\uC2A4\uD2B8\uC758 \uC591\uC606 \uACF5\uBC31\uC740 \uBAA8\uB450 \uBB34\uC2DC\uB429\uB2C8\uB2E4.
\uC790\uB3D9\uC644\uC131 \uC2DC \uD14D\uC2A4\uD2B8\uAC00 \uC5EC\uB7EC \uAC1C \uC911 \uB79C\uB364\uC73C\uB85C \uC120\uD0DD\uB418\uAC8C \uD558\uB824\uBA74, \uD55C \uC904 \uC548\uC5D0\uC11C \uAD6C\uBD84\uD560 \uD14D\uC2A4\uD2B8 \uC0AC\uC774\uC5D0 '|'\uB97C \uB123\uC5B4\uC8FC\uC138\uC694.
* \uC608\uC2DC: \uC5B5\uC6B8\uD558\uB2E4 \uC5B5\uC6B8\uD574 | \uC5B4\uAD6C\uB77C\uB2E4 \uC5B4\uAD6C\uB798 | \u3147\u3131\u3139\u3137 \u3147\u3131\u3139

\uAC01 \uD14D\uC2A4\uD2B8\uC758 \uD655\uB960\uC744 \uC9C0\uC815\uD558\uACE0 \uC2F6\uB2E4\uBA74, ':'\uB85C \uAD6C\uBD84\uD574 \uD655\uB960(% \uB2E8\uC704)\uC744 \uD45C\uAE30\uD574 \uC8FC\uC138\uC694. \uD655\uB960\uC774 \uD45C\uAE30\uB41C \uD14D\uC2A4\uD2B8\uB97C \uC81C\uC678\uD558\uACE0 \uB0A8\uB294 \uD655\uB960\uC740 \uD655\uB960\uC774 \uD45C\uAE30\uB418\uC9C0 \uC54A\uC740 \uD14D\uC2A4\uD2B8\uC5D0 \uBD84\uBC30\uB429\uB2C8\uB2E4.
* \uC608\uC2DC: \uC5B5\uC6B8\uD558\uB2E4 \uC5B5\uC6B8\uD574:50 | \uC5B5\uC6B0\uB797\uB2E4 \uC5B5\uC6B8\uD574 | \uC5B5\uC6B8\uD558\uB2E4 \uC5B5\uC6B0\uB7B3 | \u3147\u3131\u3139\u3137 \u3147\u3131\u3139:40
\uC704 \uC608\uC2DC\uC5D0\uC11C '\uC5B5\uC6B8\uD558\uB2E4 \uC5B5\uC6B8\uD574'\uB294 50% \uD655\uB960\uB85C \uC120\uD0DD\uB418\uBA70, \u3147\u3131\u3139\u3137 \u3147\u3131\u3139\uB294 40% \uD655\uB960\uB85C \uC120\uD0DD\uB429\uB2C8\uB2E4. \uB098\uBA38\uC9C0 10% \uD655\uB960\uC740 \uB0A8\uC740 \uD14D\uC2A4\uD2B8 '\uC5B5\uC6B0\uB797\uB2E4 \uC5B5\uC6B8\uD574'\uC640 '\uC5B5\uC6B8\uD558\uB2E4 \uC5B5\uC6B0\uB7B3'\uC5D0 \uAC01\uAC01 5%\uC529 \uBD84\uBC30\uB429\uB2C8\uB2E4.

:0\uC73C\uB85C \uC124\uC815\uD560 \uACBD\uC6B0 \uD574\uB2F9 \uD14D\uC2A4\uD2B8\uB294 \uC120\uD0DD\uB418\uC9C0 \uC54A\uC9C0\uB9CC \uAC80\uC0C9\uC740 \uB418\uAE30 \uB54C\uBB38\uC5D0, \uAC80\uC0C9\uC6A9 \uD0A4\uC6CC\uB4DC\uB97C \uCD94\uAC00\uD558\uACE0 \uC2F6\uC744 \uB54C \uC0AC\uC6A9\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.
* \uC608\uC2DC: Lost in the echoes of deceit | \uB85C\uC2A4\uD2B8 \uC778 \uB354 \uC5D0\uCF54\uC2A4:0
\uC704 \uC608\uC2DC\uB294 'Lost'\uBFD0\uB9CC \uC544\uB2C8\uB77C '\u3139\u3145\u314C' \uB4F1\uC73C\uB85C\uB3C4 \uAC80\uC0C9\uC774 \uB418\uC9C0\uB9CC, \uD56D\uC0C1 'Lost in the echoes of deceit'\uB9CC\uC774 \uC120\uD0DD\uB429\uB2C8\uB2E4.

\uC790\uB3D9\uC644\uC131 \uBAA9\uB85D\uC5D0\uC11C\uB294 \uCCAB\uBC88\uC9F8 \uD14D\uC2A4\uD2B8\uB9CC \uB098\uD0C0\uB098\uBA70, \uD574\uB2F9 \uD14D\uC2A4\uD2B8\uB97C \uC120\uD0DD \uC2DC \uB79C\uB364\uC73C\uB85C \uC644\uC131\uB429\uB2C8\uB2E4.
\uD14D\uC2A4\uD2B8\uAC00 \uC120\uD0DD\uB41C \uD6C4, \uC124\uC815\uD55C \uC0AD\uC81C \uD655\uB960\uC5D0 \uB530\uB77C \uD2B9\uC815 \uAE00\uC790\uB4E4\uC774 \uB79C\uB364\uD558\uAC8C \uC77C\uBD80 \uC0AD\uC81C\uB420 \uC218 \uC788\uC2B5\uB2C8\uB2E4.`),k=l("\uC800\uC7A5",()=>{let g=e.get();if(g===null)return;let x=C.get(),m=[...x.slice(0,g),{title:S.value,text:w.value},...x.slice(g+1)];localStorage.setItem("ac.templates",JSON.stringify(m)),C.set(m)}),a=l("\uC0AD\uC81C",()=>{let g=e.get();if(g===null)return;if(w.value){alert("\uD15C\uD50C\uB9BF\uC744 \uC0AD\uC81C\uD558\uB824\uBA74 \uD14D\uC2A4\uD2B8\uB97C \uC804\uBD80 \uC9C0\uC6CC \uC8FC\uC138\uC694.");return}let x=C.get(),m=[...x.slice(0,g),...x.slice(g+1)];localStorage.setItem("ac.templates",JSON.stringify(m)),C.set(m)});p.append(S,w,k,a),d.then(()=>{S.remove(),w.remove(),k.remove(),a.remove()})}),j.subscribe((c,{signal:d})=>{c&&(C.set(JSON.parse(localStorage.getItem("ac.templates")??"[]")),u.classList.add("opened"),d.then(()=>{u.classList.remove("opened")}),window.addEventListener("keydown",h=>{h.key==="Escape"&&j.set(!1)},{signal:d}))})}
    function createYoutubePaneScrollbars(){
  var doc = window.top.document;

  var leftPane = Array.from(doc.querySelectorAll('.autocomplete_pane.left_pane')).find(el => el.getBoundingClientRect().width > 0);
  var rightPane = Array. from(doc.querySelectorAll('.autocomplete_pane.right_pane')).find(el => el.getBoundingClientRect().width > 0);

  if(!leftPane && !rightPane) return;

  function createPaneTrack(pane,id){
    if(!pane) return null;

    var track = document. createElement('div');
    track.id = id;
    track.style.cssText = 'position: fixed;width:14px;background:#2c2c2c;z-index:9999999;display:flex;flex-direction: column;';

    var upBtn = document.createElement('div');
    upBtn.textContent = '▲';
    upBtn.style.cssText = 'width:14px;height: 14px;background:#2c2c2c;color:#9f9f9f;font-size:10px;display:flex;align-items:center;justify-content:center;cursor:pointer;';
    upBtn.onmouseenter = function(){ this.style.color = '#d1d1d1'; };
    upBtn.onmouseleave = function(){ this.style.color = '#9f9f9f'; };
    upBtn.onclick = function(){ pane.scrollTop -= 50; };

    var middle = document.createElement('div');
    middle.style.cssText = 'flex:1;position:relative;background:#2c2c2c;';

    var thumb = document.createElement('div');
    thumb.style.cssText = 'position:absolute;left:50%;transform:translateX(-50%);width:9px;background:#9f9f9f;border-radius:4px;cursor:pointer;';
    var dragging = false;
    var startY = 0;
    var startScrollTop = 0;

    thumb.onmouseenter = function(){ this.style.background = '#d1d1d1'; };
    thumb.onmouseleave = function(){ if(!dragging) this.style.background = '#9f9f9f'; };
    middle.appendChild(thumb);

    var downBtn = document.createElement('div');
    downBtn.textContent = '▼';
    downBtn.style.cssText = 'width:14px;height: 14px;background:#2c2c2c;color:#9f9f9f;font-size:10px;display:flex;align-items:center;justify-content:center;cursor:pointer;';
    downBtn.onmouseenter = function(){ this.style.color = '#d1d1d1'; };
    downBtn.onmouseleave = function(){ this.style.color = '#9f9f9f'; };
    downBtn.onclick = function(){ pane.scrollTop += 50; };

    track.appendChild(upBtn);
    track.appendChild(middle);
    track.appendChild(downBtn);
    doc.body.appendChild(track);

    function updatePosition(){
      var rect = pane.getBoundingClientRect();
      if(rect.width === 0 || rect. height === 0){
        track.style.display = 'none';
        return;
      }
      track.style.display = 'flex';
      track.style.top = rect.top + 'px';
      track.style.left = (rect.right - 14) + 'px';
      track.style.height = rect.height + 'px';

      var scrollHeight = pane.scrollHeight;
      var clientHeight = pane.clientHeight;
      var trackHeight = rect.height - 28;

      if(scrollHeight <= clientHeight){
        thumb.style.display = 'none';
      } else {
        thumb.style.display = 'block';
        var thumbHeight = Math.max((clientHeight / scrollHeight) * trackHeight, 30);
        var thumbTop = (pane.scrollTop / (scrollHeight - clientHeight)) * (trackHeight - thumbHeight);
        thumb.style.height = thumbHeight + 'px';
        thumb.style.top = thumbTop + 'px';
      }
    }

    setInterval(updatePosition, 100);
    pane.addEventListener('scroll',updatePosition);

    thumb.addEventListener('mousedown',function(e){
      dragging = true;
      startY = e.clientY;
      startScrollTop = pane.scrollTop;
      e.preventDefault();
    });

    doc.addEventListener('mousemove',function(e){
      if(!dragging) return;
      var deltaY = e.clientY - startY;
      var trackHeight = track.offsetHeight - 28;
      var thumbHeight = thumb.offsetHeight;
      var scrollRange = pane.scrollHeight - pane.clientHeight;
      var ratio = scrollRange / (trackHeight - thumbHeight);
      pane.scrollTop = startScrollTop + deltaY * ratio;
    });

    doc.addEventListener('mouseup',function(){
      dragging = false;
    });

    updatePosition();
    return track;
  }

  createPaneTrack(leftPane, 'cac-yt-left-track');
  createPaneTrack(rightPane, 'cac-yt-right-track');
}

if(isYoutube){
  var ytScrollbarObserver = new MutationObserver(function(){
    var settingsUI = window. top.document.getElementById('autocomplete_settings');
    if(settingsUI && ! window.top.document.getElementById('cac-yt-left-track')){
      setTimeout(createYoutubePaneScrollbars, 100);
    }
  });
  ytScrollbarObserver.observe(window.top.document.body, { childList: true, subtree:  true, attributes: true });
}

})();