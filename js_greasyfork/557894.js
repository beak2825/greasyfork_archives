// ==UserScript==
// @name         SOOP Chat Keyword Logger (별풍선)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  SOOP 채팅에서 '별풍선' 단어가 나오면 시간과 문장을 기록하고, L 키로 패널을 토글합니다. (성능 최적화 버전)
// @match        https://play.sooplive.co.kr/tleod1818/*
// @run-at       document-end
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557894/SOOP%20Chat%20Keyword%20Logger%20%28%EB%B3%84%ED%92%8D%EC%84%A0%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557894/SOOP%20Chat%20Keyword%20Logger%20%28%EB%B3%84%ED%92%8D%EC%84%A0%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ===== 설정 =====
    const KEYWORDS = ['별풍선'];                 // 키워드
    const CHAT_LIST_SELECTOR = '#chat_area';      // 전체 채팅 영역
    const CHAT_ITEM_SELECTOR = '.chatting-list-item';
    const CHAT_TEXT_SELECTOR = '.message-text .msg';

    const STORAGE_KEY_LOGS = 'soop_keyword_logs_v1';
    const STORAGE_KEY_PANEL_POS = 'soop_logger_panel_pos';

    const MAX_LOGS = 300;                         // 메모리에 유지할 최대 로그 수
    const SAVE_DEBOUNCE_MS = 1000;               // 로그 저장 주기 (1초에 한 번)

    let logs = [];
    let saveTimer = null;                        // 저장 딜레이용 타이머

    // ===== localStorage =====
    function loadLogsFromStorage() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY_LOGS);
            if (!saved) return;
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) {
                logs = parsed;
                console.log('[SOOP Logger] loaded logs:', logs.length);
            }
        } catch (e) {
            console.error('[SOOP Logger] load error', e);
        }
    }

    function saveLogsToStorage() {
        try {
            localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(logs));
        } catch (e) {
            console.error('[SOOP Logger] save error', e);
        }
    }

    // 너무 자주 저장하지 않도록 1초에 한 번씩만 저장
    function scheduleSaveLogs() {
        if (saveTimer !== null) return;
        saveTimer = setTimeout(() => {
            saveTimer = null;
            saveLogsToStorage();
        }, SAVE_DEBOUNCE_MS);
    }

    // ===== 패널 UI =====
    function createLogPanel() {
        if (document.getElementById('soop-keyword-logger-panel')) return;

        const panel = document.createElement('div');
        panel.id = 'soop-keyword-logger-panel';
        panel.style.position = 'fixed';
        panel.style.zIndex = '999999';
        panel.style.width = '320px';
        panel.style.maxHeight = '300px';
        panel.style.overflowY = 'auto';
        panel.style.background = 'rgba(0,0,0,0.75)';
        panel.style.color = '#fff';
        panel.style.fontSize = '12px';
        panel.style.padding = '8px';
        panel.style.borderRadius = '8px';

        // 기본 위치 / 저장된 위치
        const savedPos = localStorage.getItem(STORAGE_KEY_PANEL_POS);
        if (savedPos) {
            try {
                const pos = JSON.parse(savedPos);
                panel.style.left = (pos.left || window.innerWidth - 340) + 'px';
                panel.style.top = (pos.top || 80) + 'px';
            } catch {
                panel.style.right = '10px';
                panel.style.top = '80px';
            }
        } else {
            panel.style.right = '10px';
            panel.style.bottom = '220px'; // 채팅 입력창 안 가리게
        }

        const title = document.createElement('div');
        title.textContent = '키워드 감지 로그 (L: 토글)';
        title.style.fontWeight = 'bold';
        title.style.marginBottom = '4px';
        title.style.cursor = 'move';

        const btnDownload = document.createElement('button');
        btnDownload.textContent = 'CSV로 저장';
        btnDownload.style.fontSize = '11px';
        btnDownload.style.marginBottom = '4px';
        btnDownload.onclick = downloadCSV;

        const btnClear = document.createElement('button');
        btnClear.textContent = '로그 초기화';
        btnClear.style.fontSize = '11px';
        btnClear.style.marginLeft = '4px';
        btnClear.onclick = clearLogs;

        const list = document.createElement('div');
        list.id = 'soop-keyword-logger-list';

        panel.appendChild(title);
        panel.appendChild(btnDownload);
        panel.appendChild(btnClear);
        panel.appendChild(list);
        document.body.appendChild(panel);

        renderExistingLogs();
        makePanelDraggable(panel, title);
    }

    function appendLogToPanel(timeStr, text) {
        const list = document.getElementById('soop-keyword-logger-list');
        if (!list) return;
        const item = document.createElement('div');
        item.textContent = `[${timeStr}] ${text}`;
        item.style.marginBottom = '2px';
        list.appendChild(item);

        // DOM에 너무 많이 쌓이지 않도록 오래된 것 제거
        const children = list.children;
        if (children.length > MAX_LOGS) {
            list.removeChild(children[0]);
        }
    }

    function renderExistingLogs() {
        const list = document.getElementById('soop-keyword-logger-list');
        if (!list) return;
        list.innerHTML = '';
        logs.forEach((log) => appendLogToPanel(log.time, log.text));
    }

    function clearLogs() {
        if (!confirm('저장된 로그를 모두 삭제할까요?')) return;
        logs = [];
        saveLogsToStorage();
        renderExistingLogs();
    }

    // 패널 토글 (L 키)
    function togglePanelVisibility() {
        const panel = document.getElementById('soop-keyword-logger-panel');
        if (!panel) return;
        panel.style.display = (panel.style.display === 'none') ? 'block' : 'none';
    }

    document.addEventListener('keydown', (e) => {
        const tag = e.target.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA') return; // 채팅 입력 중에는 무시
        if (e.key.toLowerCase() === 'l' && !e.ctrlKey && !e.altKey && !e.metaKey) {
            togglePanelVisibility();
        }
    });

    // ===== CSV 저장 =====
    function downloadCSV() {
        if (logs.length === 0) {
            alert('저장된 로그가 없습니다.');
            return;
        }
        const header = 'time,text\n';
        const rows = logs.map((log) => {
            const safeText = log.text.replace(/"/g, '""');
            return `"${log.time}","${safeText}"`;
        });
        const csvContent = header + rows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const now = new Date();
        const fileName = `soop_keyword_log_${now.toISOString().slice(0, 19).replace(/[:T]/g, '-')}.csv`;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
    }

    // ===== 드래그 =====
    function makePanelDraggable(panel, handle) {
        let isDragging = false;
        let startX, startY, startLeft, startTop;

        handle.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            const rect = panel.getBoundingClientRect();
            startLeft = rect.left;
            startTop = rect.top;
            panel.style.right = 'auto';
            panel.style.bottom = 'auto';
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            panel.style.left = (startLeft + dx) + 'px';
            panel.style.top = (startTop + dy) + 'px';
        });

        document.addEventListener('mouseup', () => {
            if (!isDragging) return;
            isDragging = false;
            const rect = panel.getBoundingClientRect();
            const pos = { left: rect.left, top: rect.top };
            localStorage.setItem(STORAGE_KEY_PANEL_POS, JSON.stringify(pos));
        });
    }

    // ===== 키워드 감지 =====
    function containsKeyword(text) {
        return KEYWORDS.some((kw) => text.includes(kw));
    }

    function setupObserver(chatListEl) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (!(node instanceof HTMLElement)) return;

                    let itemEl = null;
                    if (node.matches?.(CHAT_ITEM_SELECTOR)) {
                        itemEl = node;
                    } else {
                        itemEl = node.closest?.(CHAT_ITEM_SELECTOR);
                    }
                    if (!itemEl) return;

                    const textEl = itemEl.querySelector(CHAT_TEXT_SELECTOR);
                    if (!textEl) return;

                    const text = textEl.innerText.trim();
                    if (!text) return;

                    if (containsKeyword(text)) {
                        const now = new Date();
                        const timeStr = now.toLocaleString('ko-KR', { hour12: false });

                        logs.push({ time: timeStr, text });

                        // 로그 개수 제한
                        if (logs.length > MAX_LOGS) {
                            logs.splice(0, logs.length - MAX_LOGS);
                        }

                        scheduleSaveLogs();           // 즉시 저장 대신 딜레이 저장
                        appendLogToPanel(timeStr, text);
                        // console.log('[SOOP Logger]', timeStr, text); // 필요 없으면 주석 유지
                    }
                });
            });
        });

        // subtree: true → false 로 줄여서 성능 개선
        observer.observe(chatListEl, { childList: true, subtree: false });
        console.log('[SOOP Logger] MutationObserver started');
    }

    // ===== 초기화 =====
    function waitForChatList() {
        const chatListEl = document.querySelector(CHAT_LIST_SELECTOR);
        if (chatListEl) {
            console.log('[SOOP Logger] Chat list found:', chatListEl);
            loadLogsFromStorage();
            createLogPanel();
            setupObserver(chatListEl);
        } else {
            console.log('[SOOP Logger] Chat list not found yet. retry...');
            setTimeout(waitForChatList, 1000);
        }
    }

    window.addEventListener('load', () => {
        waitForChatList();
    });
})();
