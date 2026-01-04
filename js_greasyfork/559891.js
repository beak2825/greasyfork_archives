// ==UserScript==
// @name         まよタイムスタンプ Memo
// @namespace    http://tampermonkey.net/
// @version      2.12.3
// @description  タイムスタンプの作成をサポートします。過去の演奏曲からサジェストします
// @author       Gemini
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @connect      docs.google.com
// @connect      googleusercontent.com
// @connect      itunes.apple.com
// @downloadURL https://update.greasyfork.org/scripts/559891/%E3%81%BE%E3%82%88%E3%82%BF%E3%82%A4%E3%83%A0%E3%82%B9%E3%82%BF%E3%83%B3%E3%83%97%20Memo.user.js
// @updateURL https://update.greasyfork.org/scripts/559891/%E3%81%BE%E3%82%88%E3%82%BF%E3%82%A4%E3%83%A0%E3%82%B9%E3%82%BF%E3%83%B3%E3%83%97%20Memo.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRw0S3-D3P6TZYfE1UpSkaSYg3WTEX1M_2o2x-SLMYovwhqID6Ek-KRIJS9_la7ipL1jRYtT93-29Mx/pub?gid=1677386991&single=true&output=csv';
    let songDatabase = [];
    let itunesResults = [];
    let selectedSuggestIndex = -1;
    let isItunesMode = false;
    let isCountEnabled = GM_getValue('yt_memo_count_enabled', true);

    let mayoSearchBtnRef = null;
    let itunesSearchBtnRef = null;
    let itunesSearchEnBtnRef = null;

    // --- ツールチップ管理 ---
    let globalTooltip = null;
    function getTooltip() {
        if (globalTooltip) return globalTooltip;
        globalTooltip = document.createElement('div');
        globalTooltip.style.cssText = `position: fixed; background: rgba(40, 40, 40, 0.95); color: #fff; padding: 6px 10px; border-radius: 4px; font-size: 11px; pointer-events: none; z-index: 2147483647; display: none; white-space: nowrap; border: 1px solid #7b1fa2; box-shadow: 0 4px 12px rgba(0,0,0,0.6); backdrop-filter: blur(2px); font-family: sans-serif;`;
        document.body.appendChild(globalTooltip);
        return globalTooltip;
    }

    function setTooltip(el, text) {
        el.addEventListener('mouseenter', () => {
            const tip = getTooltip();
            tip.textContent = text;
            tip.style.display = 'block';
            const rect = el.getBoundingClientRect();
            let left = rect.left + (rect.width / 2) - (tip.offsetWidth / 2);
            let top = rect.top - tip.offsetHeight - 8;
            if (left < 10) left = 10;
            if (left + tip.offsetWidth > window.innerWidth) left = window.innerWidth - tip.offsetWidth - 10;
            if (top < 0) top = rect.bottom + 8;
            tip.style.left = left + 'px';
            tip.style.top = top + 'px';
        });
        el.addEventListener('mouseleave', () => {
            const tip = getTooltip();
            tip.style.display = 'none';
        });
    }

    function toggleSearchMode(itunes) {
        isItunesMode = itunes;
        if (mayoSearchBtnRef) mayoSearchBtnRef.style.opacity = itunes ? "0.4" : "1";
        if (itunesSearchBtnRef) itunesSearchBtnRef.style.opacity = itunes ? "1" : "0.4";
        if (itunesSearchEnBtnRef) itunesSearchEnBtnRef.style.opacity = itunes ? "1" : "0.4";
    }

    // --- ロジック系 ---
    function parseCSVLine(line) {
        const result = [];
        let cell = '';
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
                if (inQuotes && line[i + 1] === '"') { cell += '"'; i++; }
                else { inQuotes = !inQuotes; }
            } else if (char === ',' && !inQuotes) {
                result.push(cell.trim());
                cell = '';
            } else { cell += char; }
        }
        result.push(cell.trim());
        return result;
    }

    function fetchSheetData() {
        GM_xmlhttpRequest({
            method: "GET",
            url: CSV_URL,
            onload: function (response) {
                const rows = response.responseText.split(/\r?\n/);
                const rawData = rows.slice(1).map(row => {
                    const cols = parseCSVLine(row);
                    if (!cols || cols.length < 6) return null;
                    return (cols[4] + " / " + cols[5]);
                }).filter(name => name && name.length > 1);
                songDatabase = Array.from(new Set(rawData));
            }
        });
    }

    function searchItunes(term, lang, callback) {
        const country = lang === 'EN' ? 'US' : 'jp';
        const url = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&country=${country}&entity=song&limit=10`;
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function (response) {
                try {
                    const data = JSON.parse(response.responseText);
                    const results = data.results.map(r => `${r.trackName} / ${r.artistName}`);
                    callback(results);
                } catch (e) { callback([]); }
            },
            onerror: () => callback([])
        });
    }

    function formatTime(seconds) {
        const s = Math.max(0, Math.floor(seconds));
        const hrs = Math.floor(s / 3600);
        const mins = Math.floor((s % 3600) / 60).toString().padStart(2, '0');
        const secs = (s % 60).toString().padStart(2, '0');
        return (hrs > 0) ? `${hrs}:${mins}:${secs}` : `0:${mins}:${secs}`;
    }

    function timeToSeconds(timeStr) {
        const parts = timeStr.trim().split(':').map(Number);
        if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
        if (parts.length === 2) return parts[0] * 60 + parts[1];
        return 0;
    }

    function getNextNumberFromAbove(textarea) {
        if (!isCountEnabled) return "";
        const text = textarea.value;
        const cursorPos = textarea.selectionStart;
        const lines = text.substring(0, cursorPos).split('\n');
        for (let i = lines.length - 1; i >= 0; i--) {
            const match = lines[i].match(/(\d+)\./);
            if (match) return (parseInt(match[1]) + 1) + ". ";
        }
        return "1. ";
    }

    function safeInsertText(textarea, text, isOverwriteLine = false) {
        textarea.focus();
        const startPos = textarea.selectionStart;
        if (isOverwriteLine) {
            const val = textarea.value;
            const lineStart = val.lastIndexOf('\n', startPos - 1) + 1;
            let lineEnd = val.indexOf('\n', startPos);
            if (lineEnd === -1) lineEnd = val.length;
            textarea.setSelectionRange(lineStart, lineEnd);
        }
        document.execCommand('insertText', false, text);
        localStorage.setItem('yt_memo_content', textarea.value);
    }

    // --- UI生成 ---
    function createMemoUI() {
        if (document.getElementById('yt-memo-container')) return;

        const container = document.createElement('div');
        container.id = 'yt-memo-container';
        const savedOpacity = GM_getValue('yt_memo_opacity', '1.0');
        const sideVisible = GM_getValue('yt_memo_side_visible', true);

        container.style.cssText = `position: fixed; top: 150px; left: 50px; z-index: 99999; display: none; flex-direction: column; min-width: 520px; width: 520px; height: 500px; background: #1a1a1a; border: 1px solid #7b1fa2; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.7); overflow: hidden; resize: both; opacity: ${savedOpacity};`;

        const header = document.createElement('div');
        header.style.cssText = `padding: 8px; background: linear-gradient(90deg, #4a148c, #7b1fa2); color: #eee; font-size: 11px; cursor: move; display: flex; align-items: center; justify-content: space-between; user-select: none; flex-shrink: 0; font-weight: bold;`;

        const headerTitle = document.createElement('span');
        headerTitle.textContent = 'まよタイムスタンプ Memo';
        const headerControls = document.createElement('div');
        headerControls.style.cssText = `display: flex; align-items: center; gap: 8px;`;

        const opInput = document.createElement('input');
        opInput.type = 'range'; opInput.min = '0.6'; opInput.max = '1.0'; opInput.step = '0.01'; opInput.value = savedOpacity;
        opInput.style.width = '60px';
        setTooltip(opInput, "透明度設定 (60% - 100%)");
        opInput.oninput = () => {
            container.style.opacity = opInput.value;
            GM_setValue('yt_memo_opacity', opInput.value);
        };

        const closeBtn = document.createElement('div');
        closeBtn.textContent = '×';
        closeBtn.style.cssText = `padding: 0 8px; cursor: pointer; font-size: 18px;`;
        closeBtn.onclick = () => container.style.display = 'none';

        headerControls.append(opInput, closeBtn);
        header.append(headerTitle, headerControls);

        const liveArea = document.createElement('div');
        liveArea.style.cssText = `display: flex; background: #000; border-bottom: 1px solid #333; align-items: center; justify-content: center; padding: 6px; gap: 12px; flex-shrink: 0; height: 40px; box-sizing: border-box;`;
        const liveTimeLabel = document.createElement('div');
        liveTimeLabel.id = 'yt-live-time-display';
        liveTimeLabel.style.cssText = `color: #e1bee7; font-family: monospace; font-size: 18px; font-weight: bold;`;
        const nowBtn = document.createElement('button');
        nowBtn.id = 'yt-memo-now-btn';
        nowBtn.textContent = 'NOW';
        setTooltip(nowBtn, "最新のリアルタイム位置に再生箇所を戻す");
        nowBtn.style.cssText = `padding: 2px 10px; background: #555; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 11px; font-weight: bold; transition: background 0.3s;`;
        nowBtn.onclick = () => {
            const player = document.getElementById('movie_player');
            // YouTubeプレイヤーAPIを使用して最新位置へ移動
            if (player && player.seekToStreamTime) {
                player.seekToStreamTime(9999999999);
            } else {
                const v = document.querySelector('video');
                if (v) v.currentTime = v.duration;
            }
        };
        liveArea.append(liveTimeLabel, nowBtn);

        const btnAreaWrapper = document.createElement('div');
        btnAreaWrapper.style.cssText = `height: 50px; background: #222; flex-shrink: 0; position: relative; border-bottom: 1px solid #333; overflow: hidden;`;
        const btnContainer = document.createElement('div');
        btnContainer.style.cssText = `display: flex; gap: 6px; padding: 8px; box-sizing: border-box; width: 100%; height: 50px; position: absolute; top: 0; left: 0; z-index: 1; transition: transform 0.2s;`;
        const confirmContainer = document.createElement('div');
        confirmContainer.style.cssText = `display: flex; gap: 8px; padding: 8px; background: #311b92; box-sizing: border-box; width: 100%; height: 50px; position: absolute; top: 0; left: 0; align-items: center; justify-content: center; z-index: 2; transform: translateY(50px); transition: transform 0.2s;`;

        const confirmTitle = document.createElement('span');
        confirmTitle.textContent = '本当に全消去しますか？';
        confirmTitle.style.cssText = `color: white; font-size: 11px; font-weight: bold; margin-right: 8px;`;

        const yesBtn = document.createElement('button');
        yesBtn.textContent = 'はい';
        yesBtn.style.cssText = `padding: 4px 12px; background: #d32f2f; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 11px; font-weight: bold;`;

        const noBtn = document.createElement('button');
        noBtn.textContent = 'いいえ';
        noBtn.style.cssText = `padding: 4px 12px; background: #555; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 11px; font-weight: bold;`;

        const createBtn = (txt, color, flex = "1") => {
            const b = document.createElement('button');
            b.textContent = txt;
            b.style.cssText = `flex: ${flex}; padding: 7px 4px; background: ${color}; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 11px; font-weight: bold; transition: opacity 0.2s; white-space: nowrap;`;
            return b;
        };

        const timeBtn = createBtn('時刻', '#7b1fa2');
        const copyBtn = createBtn('全コピー', '#4a148c');
        const clearBtn = createBtn('全消去', '#424242');

        const mainContentArea = document.createElement('div');
        mainContentArea.style.cssText = `display: flex; flex-grow: 1; background: #121212; overflow: hidden; position: relative;`;
        const sidePanel = document.createElement('div');
        sidePanel.id = 'yt-memo-side-panel';
        sidePanel.style.cssText = `width: 140px; background: #1a1a1a; border-right: 1px solid #333; display: ${sideVisible ? 'flex' : 'none'}; flex-direction: column; overflow: hidden; flex-shrink: 0;`;
        const sidePanelContent = document.createElement('div');
        sidePanelContent.id = 'yt-memo-side-content';
        sidePanelContent.style.cssText = `position: relative; top: 0; padding: 14px 0 !important;`;

        const textarea = document.createElement('textarea');
        textarea.id = 'yt-memo-textarea';
        textarea.setAttribute('spellcheck', 'false');
        textarea.setAttribute('placeholder', 'Ctrl+I: 時刻挿入\nCtrl+J: ジャンプ\nCtrl+↑↓: ±1秒＆ジャンプ\nShift+↑↓: 時間±1秒のみ');
        textarea.style.cssText = `flex-grow: 1; background: #121212; color: #e0e0e0; border: none; padding: 14px !important; font-size: 14px !important; outline: none; box-sizing: border-box; resize: none; line-height: 24px !important; font-family: 'Consolas', monospace !important; z-index: 1; caret-color: #fff; overflow-y: scroll; overflow-x: auto; white-space: pre; word-wrap: normal; margin: 0 !important;`;

        const suggestList = document.createElement('div');
        suggestList.id = 'yt-suggest-list';
        suggestList.style.cssText = `background: #2a1b3d; max-height: 180px; overflow-y: auto; display: none; border-top: 2px solid #7b1fa2; width: 100%; flex-shrink: 0;`;

        const footerArea = document.createElement('div');
        footerArea.style.cssText = `display: flex; gap: 8px; padding: 8px; background: #1a1a1a; border-top: 1px solid #333; align-items: center;`;

        const toggleSideBtn = document.createElement('button');
        toggleSideBtn.textContent = '≡';
        setTooltip(toggleSideBtn, "サイドパネル表示切替");
        toggleSideBtn.style.cssText = `background: #333; color: #fff; border: none; border-radius: 4px; width: 30px; height: 30px; cursor: pointer; font-size: 16px;`;
        toggleSideBtn.onclick = () => {
            const isVisible = sidePanel.style.display !== 'none';
            sidePanel.style.display = isVisible ? 'none' : 'flex';
            GM_setValue('yt_memo_side_visible', !isVisible);
        };

        const toggleCountBtn = document.createElement('button');
        toggleCountBtn.textContent = '#.';
        setTooltip(toggleCountBtn, "曲番号(1.等)の自動入力ON/OFF");
        const updateCountBtnStyle = () => {
            toggleCountBtn.style.cssText = `background: ${isCountEnabled ? '#4a148c' : '#444'}; color: ${isCountEnabled ? '#fff' : '#aaa'}; border: none; border-radius: 4px; width: 30px; height: 30px; cursor: pointer; font-size: 12px; font-weight: bold; margin-right: auto;`;
        };
        updateCountBtnStyle();
        toggleCountBtn.onclick = () => {
            isCountEnabled = !isCountEnabled;
            GM_setValue('yt_memo_count_enabled', isCountEnabled);
            updateCountBtnStyle();
        };

        const mayoSearchBtn = createBtn('まよ検索', '#7b1fa2', '0');
        mayoSearchBtn.style.minWidth = "100px";
        setTooltip(mayoSearchBtn, "朔栖まよが演奏した履歴から検索します。リアルタイム検索");
        mayoSearchBtnRef = mayoSearchBtn;

        const itunesSearchBtn = createBtn('iTunes検索(JP)', '#0070c9', '0');
        itunesSearchBtn.style.minWidth = "100px"; itunesSearchBtn.style.opacity = "0.4";
        setTooltip(itunesSearchBtn, "iTunesを日本語で検索します。Jpop向け。クリック時のみ検索");
        itunesSearchBtnRef = itunesSearchBtn;

        const itunesSearchEnBtn = createBtn('iTunes検索(EN)', '#0070c9', '0');
        itunesSearchEnBtn.style.minWidth = "100px"; itunesSearchEnBtn.style.opacity = "0.4";
        setTooltip(itunesSearchEnBtn, "iTunesを英語で検索します。Jazz向け。クリック時のみ検索");
        itunesSearchEnBtnRef = itunesSearchEnBtn;

        function updateSideButtons() {
            while (sidePanelContent.firstChild) sidePanelContent.removeChild(sidePanelContent.firstChild);
            const val = textarea.value;
            const lines = val.split('\n');
            const lineHeight = 24;
            const cursorPos = textarea.selectionStart;
            const currentLineIndex = val.substring(0, cursorPos).split('\n').length - 1;

            lines.forEach((line, index) => {
                const rowWrap = document.createElement('div');
                rowWrap.style.cssText = `height: ${lineHeight}px !important; display: flex; align-items: center; justify-content: center; gap: 3px; margin: 0 !important; padding: 0 !important; box-sizing: border-box !important;`;
                if (index === currentLineIndex) {
                    const btnStyle = `width: 24px; height: 18px; border-radius: 3px; border: none; font-size: 10px; color: white; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 0;`;

                    const jump = document.createElement('button');
                    jump.textContent = '🚀'; jump.style.cssText = btnStyle + `background: #2e7d32;`;
                    setTooltip(jump, "この再生位置にジャンプ");
                    jump.onmousedown = (e) => e.preventDefault();
                    jump.onclick = () => {
                        const match = lines[index].match(/(\d{1,2}:\d{2}:\d{2}|\d{1,2}:\d{2})/);
                        if (match) {
                            const v = document.querySelector('video');
                            if (v) v.currentTime = timeToSeconds(match[0]);
                        }
                    };

                    const tMinus = document.createElement('button');
                    tMinus.textContent = '◀'; tMinus.style.cssText = btnStyle + `background: #555; font-size: 8px;`;
                    setTooltip(tMinus, "時間を-1秒(SHIFT+↓)");
                    tMinus.onmousedown = (e) => e.preventDefault();
                    tMinus.onclick = () => adjustLineTime(index, -1);

                    const tPlus = document.createElement('button');
                    tPlus.textContent = '▶'; tPlus.style.cssText = btnStyle + `background: #555; font-size: 8px;`;
                    setTooltip(tPlus, "時間を+1秒(SHIFT+↑)");
                    tPlus.onmousedown = (e) => e.preventDefault();
                    tPlus.onclick = () => adjustLineTime(index, 1);

                    const plusBtn = document.createElement('button');
                    plusBtn.textContent = '＋'; plusBtn.style.cssText = btnStyle + `background: #4a148c; font-weight: bold;`;
                    setTooltip(plusBtn, "カウント+1");
                    plusBtn.onmousedown = (e) => e.preventDefault();
                    plusBtn.onclick = () => adjustLineNumber(index, 1);

                    const minusBtn = document.createElement('button');
                    minusBtn.textContent = '－'; minusBtn.style.cssText = btnStyle + `background: #424242; font-weight: bold;`;
                    setTooltip(minusBtn, "カウント-1");
                    minusBtn.onmousedown = (e) => e.preventDefault();
                    minusBtn.onclick = () => adjustLineNumber(index, -1);

                    rowWrap.append(jump, tMinus, tPlus, plusBtn, minusBtn);
                }
                sidePanelContent.appendChild(rowWrap);
            });
            syncScroll();
        }

        function adjustLineTime(lineIndex, diff) {
            const lines = textarea.value.split('\n');
            const match = lines[lineIndex].match(/(\d{1,2}:\d{2}:\d{2})/);
            if (match) {
                let sec = timeToSeconds(match[0]) + diff;
                lines[lineIndex] = lines[lineIndex].replace(/\d{1,2}:\d{2}:\d{2}/, formatTime(sec));
                const start = textarea.selectionStart, end = textarea.selectionEnd;
                textarea.value = lines.join('\n');
                textarea.setSelectionRange(start, end);
                updateSideButtons();
            }
        }

        function adjustLineNumber(lineIndex, diff) {
            const lines = textarea.value.split('\n');
            const line = lines[lineIndex];
            const countMatch = line.match(/(\d+)\./);
            if (countMatch) {
                let num = parseInt(countMatch[1]);
                if (num === 1 && diff < 0) {
                    lines[lineIndex] = line.replace(/\d+\.\s*/, "");
                } else {
                    num = Math.max(1, num + diff);
                    lines[lineIndex] = line.replace(/(\d+)\./, num + ".");
                }
            } else if (diff > 0) {
                const timeMatch = line.match(/^(\d{1,2}:\d{2}:\d{2}\s+)?/);
                if (timeMatch && timeMatch[1]) {
                    lines[lineIndex] = line.replace(timeMatch[1], timeMatch[1] + "1. ");
                } else {
                    lines[lineIndex] = "1. " + line;
                }
            }
            const start = textarea.selectionStart, end = textarea.selectionEnd;
            textarea.value = lines.join('\n');
            textarea.setSelectionRange(start, end);
            updateSideButtons();
        }

        function syncScroll() {
            sidePanelContent.style.top = `-${textarea.scrollTop}px`;
        }

        textarea.addEventListener('keydown', (e) => {
            // Ctrl+I: 時刻ボタン
            if (e.ctrlKey && (e.key === 'i' || e.key === 'I')) {
                e.preventDefault();
                timeBtn.click();
                return;
            }
            // Ctrl+J: ジャンプボタン
            if (e.ctrlKey && (e.key === 'j' || e.key === 'J')) {
                e.preventDefault();
                const val = textarea.value;
                const pos = textarea.selectionStart;
                const lines = val.split('\n');
                const idx = val.substring(0, pos).split('\n').length - 1;
                const row = sidePanelContent.children[idx];
                if (row) {
                    const jumpBtn = row.querySelector('button');
                    if (jumpBtn) jumpBtn.click();
                }
                return;
            }

            // Ctrl+↑ or Ctrl+↓: 時間調整してジャンプ
            if (e.ctrlKey && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
                e.preventDefault();
                const val = textarea.value;
                const pos = textarea.selectionStart;
                const idx = val.substring(0, pos).split('\n').length - 1;

                adjustLineTime(idx, e.key === 'ArrowUp' ? 1 : -1);

                // ジャンプ
                const newLines = textarea.value.split('\n');
                const match = newLines[idx].match(/(\d{1,2}:\d{2}:\d{2}|\d{1,2}:\d{2})/);
                if (match) {
                    const v = document.querySelector('video');
                    if (v) v.currentTime = timeToSeconds(match[0]);
                }
                return;
            }

            if (e.shiftKey && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
                const val = textarea.value;
                const pos = textarea.selectionStart;
                const idx = val.substring(0, pos).split('\n').length - 1;
                adjustLineTime(idx, e.key === 'ArrowUp' ? 1 : -1);
                e.preventDefault();
                return;
            }
            if (suggestList.style.display === 'block') {
                if (e.key === 'ArrowDown') { e.preventDefault(); moveSuggestSelection(1); }
                else if (e.key === 'ArrowUp') { e.preventDefault(); moveSuggestSelection(-1); }
                else if (e.key === 'Enter' && selectedSuggestIndex >= 0) {
                    e.preventDefault();
                    const items = suggestList.querySelectorAll('.suggest-item');
                    if (items[selectedSuggestIndex]) items[selectedSuggestIndex].click();
                }
            }
        });

        function moveSuggestSelection(dir) {
            const items = suggestList.querySelectorAll('.suggest-item');
            if (!items.length) return;
            selectedSuggestIndex += dir;
            if (selectedSuggestIndex < -1) selectedSuggestIndex = -1;
            else if (selectedSuggestIndex >= items.length) selectedSuggestIndex = items.length - 1;
            items.forEach(el => el.style.background = "transparent");
            if (selectedSuggestIndex >= 0) {
                const sel = items[selectedSuggestIndex];
                sel.style.background = isItunesMode ? "#0070c9" : "#4a148c";
                sel.scrollIntoView({ block: 'nearest' });
            }
        }

        textarea.addEventListener('scroll', syncScroll);
        textarea.addEventListener('keyup', (e) => {
            if (!['ArrowUp', 'ArrowDown', 'Enter'].includes(e.key)) updateSideButtons();
        });
        textarea.addEventListener('click', updateSideButtons);
        textarea.addEventListener('input', () => {
            localStorage.setItem('yt_memo_content', textarea.value);
            renderSuggestions(textarea, suggestList);
            updateSideButtons();
        });

        timeBtn.onclick = () => {
            const v = document.querySelector('video');
            if (v) {
                const t = formatTime(v.currentTime);
                const n = getNextNumberFromAbove(textarea);
                safeInsertText(textarea, `${t}   ${n}`);
                renderSuggestions(textarea, suggestList, false);
                updateSideButtons();
            }
        };

        mayoSearchBtn.onclick = () => {
            toggleSearchMode(false);
            renderSuggestions(textarea, suggestList, true);
        };

        const itunesSearchFn = (lang) => {
            const query = getQueryAtCursor(textarea);
            if (!query) return;
            const btn = lang === 'EN' ? itunesSearchEnBtn : itunesSearchBtn;
            const originalText = btn.textContent;
            btn.textContent = '検索中...';
            btn.style.minWidth = "100px";
            searchItunes(query, lang, (results) => {
                btn.textContent = originalText;
                itunesResults = results;
                toggleSearchMode(true);
                renderSuggestions(textarea, suggestList, true);
            });
        };
        itunesSearchBtn.onclick = () => itunesSearchFn('JP');
        itunesSearchEnBtn.onclick = () => itunesSearchFn('EN');

        copyBtn.onclick = () => {
            navigator.clipboard.writeText(textarea.value).then(() => {
                const oldText = copyBtn.textContent;
                copyBtn.textContent = '完了';
                setTimeout(() => copyBtn.textContent = oldText, 1000);
            });
        };

        clearBtn.onclick = () => {
            btnContainer.style.transform = 'translateY(-50px)';
            confirmContainer.style.transform = 'translateY(0)';
        };
        noBtn.onclick = () => {
            btnContainer.style.transform = 'translateY(0)';
            confirmContainer.style.transform = 'translateY(50px)';
        };
        yesBtn.onclick = () => {
            textarea.value = '';
            localStorage.setItem('yt_memo_content', '');
            updateSideButtons();
            btnContainer.style.transform = 'translateY(0)';
            confirmContainer.style.transform = 'translateY(50px)';
            textarea.focus();
        };

        let drag = false, off = { x: 0, y: 0 };
        header.onmousedown = e => {
            if (e.target.closest('input') || e.target === closeBtn) return;
            drag = true; off = { x: e.clientX - container.offsetLeft, y: e.clientY - container.offsetTop };
        };
        document.addEventListener('mousemove', e => {
            if (drag) {
                container.style.left = (e.clientX - off.x) + 'px';
                container.style.top = (e.clientY - off.y) + 'px';
            }
        });
        document.addEventListener('mouseup', () => drag = false);

        btnContainer.append(timeBtn, copyBtn, clearBtn);
        confirmContainer.append(confirmTitle, yesBtn, noBtn);
        btnAreaWrapper.append(btnContainer, confirmContainer);
        sidePanel.appendChild(sidePanelContent);
        mainContentArea.append(sidePanel, textarea);
        footerArea.append(toggleSideBtn, toggleCountBtn, mayoSearchBtn, itunesSearchBtn, itunesSearchEnBtn);
        container.append(header, liveArea, btnAreaWrapper, mainContentArea, suggestList, footerArea);
        document.body.appendChild(container);

        textarea.value = localStorage.getItem('yt_memo_content') || '';
        toggleSearchMode(false);
        updateSideButtons();
    }

    function getQueryAtCursor(tx) {
        const val = tx.value;
        const pos = tx.selectionStart;
        const start = val.lastIndexOf('\n', pos - 1) + 1;
        const line = val.substring(start, pos);
        const info = line.match(/^(\d{1,2}:\d{2}:\d{2}\s*)?(\d+\.\s*)?(.*)$/);
        return (info && info[3]) ? info[3].trim() : "";
    }

    function renderSuggestions(textarea, list, force = false) {
        const query = getQueryAtCursor(textarea).toLowerCase();
        selectedSuggestIndex = -1;
        if (!force && (!query || query.length < 1)) { list.style.display = 'none'; return; }
        if (force && !query) { list.style.display = 'none'; return; }

        let matches = [];
        if (isItunesMode) {
            matches = itunesResults;
        } else {
            // 前方一致優先、部分一致も含める
            const sMatch = songDatabase.filter(s => s.toLowerCase().startsWith(query));
            const cMatch = songDatabase.filter(s => s.toLowerCase().includes(query) && !s.toLowerCase().startsWith(query));
            matches = [...sMatch, ...cMatch].slice(0, 20);
        }

        while (list.firstChild) list.removeChild(list.firstChild);
        if (!matches.length) { list.style.display = 'none'; return; }
        list.style.display = 'block';

        // iTunesモードなら背景色を変更
        const bgColor = isItunesMode ? "#001a2e" : "#2a1b3d";
        const itemHoverColor = isItunesMode ? "#0070c9" : "#4a148c";
        list.style.background = bgColor;

        matches.forEach((m, idx) => {
            const item = document.createElement('div');
            item.className = 'suggest-item';
            item.textContent = m;
            item.style.cssText = `padding: 10px 14px; cursor: pointer; color: #e1bee7; border-bottom: 1px solid #3b2a50; font-size: 13px; transition: background 0.1s;`;
            item.onmouseover = () => {
                const all = list.querySelectorAll('.suggest-item');
                all.forEach(el => el.style.background = "transparent");
                selectedSuggestIndex = idx;
                item.style.background = itemHoverColor;
            };
            item.onclick = () => {
                const val = textarea.value;
                const pos = textarea.selectionStart;
                const start = val.lastIndexOf('\n', pos - 1) + 1;
                const line = val.substring(start, pos);
                const info = line.match(/^(\d{1,2}:\d{2}:\d{2}\s*)?(\d+\.\s*)?(.*)$/);
                const v = document.querySelector('video');
                const t = (info && info[1]) ? info[1].trim() : (v ? formatTime(v.currentTime) : "0:00:00");
                const n = (info && info[2]) ? info[2].trim() : getNextNumberFromAbove(textarea);
                safeInsertText(textarea, `${t}   ${n}${m}\n`, true);
                list.style.display = 'none';
                if (isItunesMode) toggleSearchMode(false);
                textarea.dispatchEvent(new Event('input'));
            };
            list.appendChild(item);
        });
    }

    // --- 監視ループ ---
    setInterval(() => {
        const v = document.querySelector('video');
        const l = document.getElementById('yt-live-time-display');
        const nowBtn = document.getElementById('yt-memo-now-btn');
        // YouTube公式の「ライブ」バッジ要素を取得
        const liveBadge = document.querySelector('.ytp-live-badge');

        if (v && l) {
            l.textContent = formatTime(v.currentTime).trim();

            if (nowBtn && liveBadge) {
                // クラス名 ytp-live-badge-is-livehead が付与されているかどうかで最新か判定
                const isLatest = liveBadge.classList.contains('ytp-live-badge-is-livehead');
                nowBtn.style.background = isLatest ? "#d32f2f" : "#555";
            }
        }
    }, 500);

    function injectToggleButton() {
        if (document.getElementById('yt-memo-toggle-btn')) return;
        const target = document.querySelector('#top-row segmented-like-dislike-button-view-model') || document.querySelector('#top-row #top-level-buttons-computed');
        if (target) {
            const btn = document.createElement('button');
            btn.id = 'yt-memo-toggle-btn'; btn.textContent = 'Memo';
            btn.style.cssText = `background-color: #4a148c; color: #fff; border: 1px solid #7b1fa2; border-radius: 18px; padding: 0 16px; margin-right: 12px; height: 36px; font-size: 13px; font-weight: bold; cursor: pointer;`;
            btn.onclick = () => {
                const m = document.getElementById('yt-memo-container');
                if (m) m.style.display = (m.style.display === 'none') ? 'flex' : 'none';
            };
            target.parentNode.insertBefore(btn, target);
        }
    }

    fetchSheetData();
    setInterval(() => { createMemoUI(); injectToggleButton(); }, 2000);
})();
