// ==UserScript==
// @name         보조바퀴(크랙 기억력 보조) - 수정판
// @namespace    https://crack.wrtn.ai
// @version      2.1
// @description  크랙 기억력 보조용 메모장 (URL 구조 업데이트)
// @author       바보륍부이
// @license      MIT
// @match        https://crack.wrtn.ai/stories/*/episodes/*
// @match        https://crack.wrtn.ai/characters/*/chats/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552243/%EB%B3%B4%EC%A1%B0%EB%B0%94%ED%80%B4%28%ED%81%AC%EB%9E%99%20%EA%B8%B0%EC%96%B5%EB%A0%A5%20%EB%B3%B4%EC%A1%B0%29%20-%20%EC%88%98%EC%A0%95%ED%8C%90.user.js
// @updateURL https://update.greasyfork.org/scripts/552243/%EB%B3%B4%EC%A1%B0%EB%B0%94%ED%80%B4%28%ED%81%AC%EB%9E%99%20%EA%B8%B0%EC%96%B5%EB%A0%A5%20%EB%B3%B4%EC%A1%B0%29%20-%20%EC%88%98%EC%A0%95%ED%8C%90.meta.js
// ==/UserScript==

(function () {
  'use strict';

  console.log('보조바퀴 스크립트 시작!', location.pathname);

  let textKey = `wrtn_custom_text_${location.pathname}`;
  const panelKey = 'wrtn_custom_panel';

  // 상태 저장을 위한 디바운스 함수
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  // 패널 상태 저장 (300ms 디바운스)
  const savePanelState = debounce((state) => {
    localStorage.setItem(panelKey, JSON.stringify(state));
  }, 300);

  const savedPanelState = JSON.parse(localStorage.getItem(panelKey) || '{}');
  let isMinimized = savedPanelState.minimized || false;

  // 패널 생성
  const panel = document.createElement('div');
  Object.assign(panel.style, {
    position: 'fixed',
    top: savedPanelState.top || '100px',
    left: savedPanelState.left || '10px',
    width: savedPanelState.width || '600px',
    height: savedPanelState.height || '500px',
    backgroundColor: '#1a1a1a',
    padding: '0',
    borderRadius: '10px',
    zIndex: '99999',
    color: '#fff',
    fontFamily: 'sans-serif',
    boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
    resize: 'both',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column'
  });

  // 헤더 생성
  const dragHeader = document.createElement('div');
  Object.assign(dragHeader.style, {
    backgroundColor: '#333',
    padding: '8px 10px',
    borderRadius: '10px 10px 0 0',
    cursor: 'move',
    userSelect: 'none',
    fontSize: '12px',
    fontWeight: 'bold',
    borderBottom: '1px solid #444',
    flexShrink: '0',
    position: 'relative'
  });
  dragHeader.textContent = '📝 보조바퀴-크랙 기억력 보조 메모장 (Ctrl+Enter로 빠른 입력)';

  // 도움말 아이콘
  const helpIcon = document.createElement('div');
  Object.assign(helpIcon.style, {
    position: 'absolute',
    top: '5px',
    right: '10px',
    cursor: 'help',
    fontSize: '14px'
  });
  helpIcon.textContent = '❓';
  helpIcon.title = [
    '요약은 캐즘 등 다른 프로그램을 활용해주세요',
    '직접 메모해도 됩니다',
    '다른 방으로 이동하는 등 URL이 바뀌면 갱신 버튼을 눌러주세요',
    '최상단을 더블클릭하면 최소화 됩니다'
  ].join('\n');
  dragHeader.appendChild(helpIcon);

  // 콘텐츠 영역
  const content = document.createElement('div');
  Object.assign(content.style, {
    padding: '10px',
    flex: '1',
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column'
  });

  // 텍스트 입력 영역
  const input = document.createElement('textarea');
  input.rows = 50;
  input.placeholder = '추가할 내용 입력';
  Object.assign(input.style, {
    width: '100%',
    flex: '1',
    padding: '8px',
    borderRadius: '5px',
    border: '1px solid #444',
    backgroundColor: '#2a2a2a',
    color: '#fff',
    resize: 'none',
    minHeight: '200px'
  });

  // 컨트롤 패널
  const controlRow = document.createElement('div');
  Object.assign(controlRow.style, {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px',
    backgroundColor: '#222',
    borderTop: '1px solid #444',
    borderRadius: '0 0 10px 10px',
    flexShrink: '0'
  });

  // 텍스트 추가 버튼
  const button = document.createElement('button');
  button.textContent = '텍스트 추가';
  Object.assign(button.style, {
    flex: '1',
    padding: '8px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#4caf50',
    color: '#fff',
    cursor: 'pointer'
  });

  // 갱신 버튼
  const refreshButton = document.createElement('button');
  refreshButton.textContent = '🔄 갱신';
  Object.assign(refreshButton.style, {
    flex: '1',
    padding: '8px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#555',
    color: '#fff',
    cursor: 'pointer'
  });

  // 글자 수 표시
  const countDisplay = document.createElement('div');
  Object.assign(countDisplay.style, {
    marginLeft: 'auto',
    fontSize: '12px'
  });

  // 스토리지에서 텍스트 로드
  const loadTextFromStorage = () => {
    textKey = `wrtn_custom_text_${location.pathname}`;
    const savedText = localStorage.getItem(textKey);
    input.value = savedText || '';
    updateCharCount();
    console.log('메모 로드됨:', textKey);
  };

  // 글자 수 업데이트
  const updateCharCount = () => {
    countDisplay.textContent = `총 ${input.value.length}글자`;
  };

  loadTextFromStorage();

  // 갱신 버튼 이벤트
  refreshButton.addEventListener('click', () => {
    loadTextFromStorage();
    alert('메모를 갱신했습니다!');
  });

  // 최소화 토글
  const toggleMinimize = () => {
    isMinimized = !isMinimized;
    if (isMinimized) {
      content.style.display = 'none';
      controlRow.style.display = 'none';
      panel.style.height = 'auto';
      dragHeader.style.borderRadius = '10px';
      dragHeader.style.borderBottom = 'none';
    } else {
      content.style.display = 'flex';
      controlRow.style.display = 'flex';
      panel.style.height = savedPanelState.height || '500px';
      dragHeader.style.borderRadius = '10px 10px 0 0';
      dragHeader.style.borderBottom = '1px solid #444';
    }
    savePanelState({ ...getCurrentPanelState(), minimized: isMinimized });
  };

  if (isMinimized) toggleMinimize();
  dragHeader.addEventListener('dblclick', toggleMinimize);

  // 현재 패널 상태 가져오기
  const getCurrentPanelState = () => ({
    top: panel.style.top,
    left: panel.style.left,
    width: panel.style.width,
    height: panel.style.height,
    minimized: isMinimized
  });

  // 채팅창에 텍스트 추가
  const appendToTextarea = () => {
    const newText = input.value.trim();
    if (!newText) {
      alert('메모 내용이 비어있습니다!');
      return;
    }

    // 여러 가지 선택자로 시도
    const selectors = [
      'textarea[placeholder*="메시지"]',
      'textarea[placeholder*="입력"]',
      'textarea',
      '[contenteditable="true"]'
    ];

    let textarea = null;
    for (const selector of selectors) {
      textarea = document.querySelector(selector);
      if (textarea) {
        console.log('채팅창 찾음:', selector);
        break;
      }
    }

    if (!textarea) {
      alert("채팅 입력창을 찾을 수 없습니다.\n페이지를 새로고침하거나 채팅창이 로드될 때까지 기다려주세요.");
      console.error('채팅창을 찾을 수 없음');
      return;
    }

    // contenteditable인 경우
    if (textarea.contentEditable === 'true') {
      const currentValue = textarea.textContent || '';
      const newValue = currentValue ? `${currentValue}\n${newText}` : newText;
      textarea.textContent = newValue;
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    } else {
      // textarea인 경우
      const setter = Object.getOwnPropertyDescriptor(
        window.HTMLTextAreaElement.prototype,
        'value'
      )?.set;

      if (setter) {
        const currentValue = textarea.value;
        const newValue = currentValue ? `${currentValue}\n${newText}` : newText;
        setter.call(textarea, newValue);
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }

    console.log('텍스트 추가 완료');
  };

  // Ctrl+Enter 단축키
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      appendToTextarea();
    }
  });

  // 버튼 클릭 이벤트
  button.addEventListener('click', appendToTextarea);

  // 입력 시 저장 및 글자 수 업데이트 (디바운스 적용)
  const saveText = debounce(() => {
    localStorage.setItem(textKey, input.value);
    console.log('메모 자동저장됨');
  }, 500);

  input.addEventListener('input', () => {
    updateCharCount();
    saveText();
  });

  // 드래그 기능
  let offsetX, offsetY, dragging = false;

  dragHeader.addEventListener('mousedown', (e) => {
    if (e.target === helpIcon) return;
    dragging = true;
    offsetX = e.clientX - panel.offsetLeft;
    offsetY = e.clientY - panel.offsetTop;
    document.body.style.userSelect = 'none';
    e.preventDefault();
  });

  document.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    panel.style.left = `${e.clientX - offsetX}px`;
    panel.style.top = `${e.clientY - offsetY}px`;
  });

  document.addEventListener('mouseup', () => {
    if (!dragging) return;
    dragging = false;
    document.body.style.userSelect = '';
    savePanelState(getCurrentPanelState());
  });

  // 리사이즈 감지 (디바운스 적용)
  new ResizeObserver(() => {
    if (!isMinimized) {
      const rect = panel.getBoundingClientRect();
      savePanelState({
        top: `${rect.top}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
        minimized: isMinimized
      });
    }
  }).observe(panel);

  // DOM 조립
  controlRow.appendChild(button);
  controlRow.appendChild(refreshButton);
  controlRow.appendChild(countDisplay);
  content.appendChild(input);
  panel.appendChild(dragHeader);
  panel.appendChild(content);
  panel.appendChild(controlRow);
  document.body.appendChild(panel);

  console.log('보조바퀴 패널 생성 완료!');
})();