// ==UserScript==
// @name         Chzzk VOD 시청 기록 관리
// @namespace    Chzzk VOD 시청 기록 관리
// @version      1.0
// @description  치지직 VOD에서 재생위치 튐 복구 + 시청 기록 저장 및 복구
// @Author       DOGJIP
// @match        https://chzzk.naver.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552245/Chzzk%20VOD%20%EC%8B%9C%EC%B2%AD%20%EA%B8%B0%EB%A1%9D%20%EA%B4%80%EB%A6%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/552245/Chzzk%20VOD%20%EC%8B%9C%EC%B2%AD%20%EA%B8%B0%EB%A1%9D%20%EA%B4%80%EB%A6%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let video = null;
    let historyLog = [];
    let lastSeekByUser = false;
    let zeroDetected = false;
    let buttons = { recover: null, save: null, savedList: null, clear: null };
    let hasShownPopup = false;
    let recordInterval = null;
    let observers = { mutation: null, src: null };

    const HISTORY_LIMIT = 4;
    const RECORD_INTERVAL = 3000;
    const WATCH_KEY_PREFIX = "chzzk_vod_saves_";
    const MAX_SAVES = 10;
    const EXPIRE_DAYS = 7;

    // === 유틸리티 함수 ===
    function addHistory(time) {
        if (isNaN(time) || time < 1) return;
        historyLog.push(time);
        if (historyLog.length > HISTORY_LIMIT) historyLog.shift();
    }

    function getLastTime() {
        return historyLog.length ? historyLog[historyLog.length - 1] : 0;
    }

    function getWatchKey() {
        return WATCH_KEY_PREFIX + location.pathname;
    }

    function formatTime(sec) {
        sec = Math.floor(sec);
        const h = Math.floor(sec / 3600);
        const m = Math.floor((sec % 3600) / 60);
        const s = sec % 60;
        return `${h > 0 ? h + ":" : ""}${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    }

    function formatDate(isoString) {
        const date = new Date(isoString);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hour = String(date.getHours()).padStart(2, '0');
        const minute = String(date.getMinutes()).padStart(2, '0');
        return `${month}/${day} ${hour}:${minute}`;
    }

    function showToast(msg) {
        const toast = document.createElement("div");
        toast.textContent = msg;
        Object.assign(toast.style, {
            position: "fixed",
            bottom: "20px",
            right: "20px",
            background: "rgba(0,0,0,0.7)",
            color: "#fff",
            padding: "8px 12px",
            borderRadius: "6px",
            fontSize: "14px",
            zIndex: 99999,
            transition: "opacity 0.5s",
            opacity: "1"
        });
        document.body.appendChild(toast);
        setTimeout(() => { toast.style.opacity = "0"; }, 5000);
        setTimeout(() => { toast.remove(); }, 5500);
    }

    // === 저장 관련 함수 ===
    function getSavedList() {
        const key = getWatchKey();
        const data = localStorage.getItem(key);
        if (!data) return [];
        try {
            const saves = JSON.parse(data);
            const now = Date.now();
            const filtered = saves.filter(save => {
                const saveDate = new Date(save.date).getTime();
                const daysPassed = (now - saveDate) / (1000 * 60 * 60 * 24);
                return daysPassed < EXPIRE_DAYS;
            });

            if (filtered.length !== saves.length) {
                localStorage.setItem(key, JSON.stringify(filtered));
            }

            return filtered;
        } catch (e) {
            return [];
        }
    }

    function saveTimes(time) {
        if (!time || isNaN(time) || time < 10) return;

        const key = getWatchKey();
        let saves = getSavedList();

        // 마지막 저장 기록과 5초 이내 차이면 업데이트만 수행
        if (saves.length > 0) {
            const lastSave = saves[saves.length - 1];
            const timeDiff = Math.abs(lastSave.time - time);

            if (timeDiff <= 5) {
                // 기존 기록 업데이트 (시간과 날짜 갱신)
                lastSave.time = parseFloat(time.toFixed(2));
                lastSave.date = new Date().toISOString();
                localStorage.setItem(key, JSON.stringify(saves));
                console.log("[ChzzkFix] 시청 위치 업데이트:", time);
                return;
            }
        }

        // 5초 이상 차이나면 새 기록 추가
        const timestamp = new Date().toISOString();
        saves.push({ time: parseFloat(time.toFixed(2)), date: timestamp });

        if (saves.length > MAX_SAVES) {
            saves = saves.slice(-MAX_SAVES);
        }

        localStorage.setItem(key, JSON.stringify(saves));
        console.log("[ChzzkFix] 시청 위치 저장:", time);
    }

    function clearCurrentPageData() {
        const key = getWatchKey();
        localStorage.removeItem(key);
        console.log("[ChzzkFix] 현재 페이지 시청 기록 삭제");
    }

    // === 팝업/모달 생성 함수 ===
    function createSaveItem(save, idx, saves, onTimeClick, onDelete) {
        const item = document.createElement("div");
        Object.assign(item.style, {
            padding: "10px",
            marginBottom: "8px",
            background: "#f5f5f5",
            borderRadius: "4px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
        });

        const infoDiv = document.createElement("div");
        infoDiv.style.flex = "1";
        infoDiv.style.cursor = "pointer";

        infoDiv.addEventListener("mouseenter", () => item.style.background = "#e0e0e0", { passive: true });
        infoDiv.addEventListener("mouseleave", () => item.style.background = "#f5f5f5", { passive: true });

        const timeText = document.createElement("div");
        timeText.textContent = formatTime(save.time);
        Object.assign(timeText.style, {
            fontSize: "15px",
            fontWeight: "bold",
            color: "#333",
            marginBottom: "4px"
        });

        const dateText = document.createElement("div");
        dateText.textContent = formatDate(save.date);
        Object.assign(dateText.style, {
            fontSize: "12px",
            color: "#666"
        });

        infoDiv.appendChild(timeText);
        infoDiv.appendChild(dateText);

        infoDiv.addEventListener("click", () => {
            if (video) {
                video.currentTime = save.time;
                showToast(`${formatTime(save.time)} 위치로 이동`);
            }
            if (onTimeClick) onTimeClick();
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "✕";
        Object.assign(deleteBtn.style, {
            padding: "4px 8px",
            fontSize: "14px",
            background: "#f44336",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginLeft: "8px"
        });

        deleteBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            const originalIndex = saves.length - 1 - idx;
            saves.splice(originalIndex, 1);
            localStorage.setItem(getWatchKey(), JSON.stringify(saves));
            item.remove();
            showToast("기록 삭제됨");

            const isEmpty = saves.length === 0;
            if (onDelete) onDelete(isEmpty);
        });

        item.appendChild(infoDiv);
        item.appendChild(deleteBtn);

        return item;
    }

    function createPopupBase(title) {
        const overlay = document.createElement("div");
        Object.assign(overlay.style, {
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.6)",
            zIndex: 100000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        });

        const popup = document.createElement("div");
        Object.assign(popup.style, {
            background: "#fff",
            padding: "24px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            maxWidth: "400px",
            maxHeight: "500px",
            overflow: "auto"
        });

        const titleEl = document.createElement("h3");
        titleEl.textContent = title;
        Object.assign(titleEl.style, {
            marginTop: "0",
            marginBottom: "16px",
            fontSize: "16px",
            color: "#333"
        });

        popup.appendChild(titleEl);
        overlay.appendChild(popup);

        return { overlay, popup };
    }

    function showSavedListPopup() {
        if (hasShownPopup || !video) return;

        const saves = getSavedList();
        if (saves.length === 0) return;

        hasShownPopup = true;

        const { overlay, popup } = createPopupBase("이전 시청 기록");

        const list = document.createElement("div");
        list.style.marginBottom = "16px";

        const savesToShow = saves.slice().reverse();
        savesToShow.forEach((save, idx) => {
            const item = createSaveItem(
                save,
                idx,
                saves,
                () => overlay.remove(), // 시간 클릭 시 팝업 닫기
                (isEmpty) => { if (isEmpty) overlay.remove(); } // 삭제 후 빈 리스트면 팝업 닫기
            );
            list.appendChild(item);
        });

        const cancelBtn = document.createElement("button");
        cancelBtn.textContent = "취소";
        Object.assign(cancelBtn.style, {
            width: "100%",
            padding: "10px",
            fontSize: "14px",
            background: "#999",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
        });

        cancelBtn.addEventListener("click", () => overlay.remove());

        popup.appendChild(list);
        popup.appendChild(cancelBtn);
        document.body.appendChild(overlay);
    }

    function showSavedListModal() {
        const saves = getSavedList();
        if (saves.length === 0) {
            showToast("저장된 기록이 없습니다");
            return;
        }

        const { overlay, popup } = createPopupBase("저장된 시청 위치");

        const list = document.createElement("div");
        list.style.marginBottom = "16px";

        const savesToShow = saves.slice().reverse();
        savesToShow.forEach((save, idx) => {
            const item = createSaveItem(
                save,
                idx,
                saves,
                () => overlay.remove(), // 시간 클릭 시 모달 닫기
                (isEmpty) => { // 삭제 후 빈 리스트면 모달 닫고 토스트
                    if (isEmpty) {
                        overlay.remove();
                        showToast("저장된 기록이 없습니다");
                    }
                }
            );
            list.appendChild(item);
        });

        const cancelBtn = document.createElement("button");
        cancelBtn.textContent = "닫기";
        Object.assign(cancelBtn.style, {
            width: "100%",
            padding: "10px",
            fontSize: "14px",
            background: "#999",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
        });

        cancelBtn.addEventListener("click", () => overlay.remove());

        popup.appendChild(list);
        popup.appendChild(cancelBtn);
        document.body.appendChild(overlay);
    }

    // === 버튼 생성 ===
    function createButton(text, color, onClick) {
        const btn = document.createElement("button");
        btn.textContent = text;
        Object.assign(btn.style, {
            display: "inline-block",
            marginLeft: text === "복구" ? "12px" : "6px",
            padding: "2px 6px",
            fontSize: "12px",
            background: color,
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            opacity: "1",
            transition: "none"
        });
        btn.addEventListener("click", onClick);
        return btn;
    }

    function removeButtons() {
        Object.values(buttons).forEach(btn => btn?.remove());
        buttons = { recover: null, save: null, savedList: null, clear: null };
    }

    function createRecoverButton() {
        if (buttons.recover) return;

        const timerDiv = document.querySelector('div.pzp-vod-time');
        if (!timerDiv) return; // timerDiv 없으면 바로 리턴

        buttons.recover = createButton("복구", "#ff6f61", () => {
            const last = getLastTime();
            if (video && last > 0) {
                video.currentTime = last;
                showToast(`재생 위치 복구 → ${formatTime(last)}`);
            }
        });

        buttons.save = createButton("저장", "#2196f3", () => {
            if (video && video.currentTime > 0) {
                saveTimes(video.currentTime);
                showToast(`시청 위치 저장 → ${formatTime(video.currentTime)}`);
            } else {
                showToast("저장할 시청 위치가 없습니다");
            }
        });

        buttons.savedList = createButton("기록", "#4caf50", showSavedListModal);

        buttons.clear = createButton("삭제", "#f44336", () => {
            if (confirm("이 영상의 모든 시청 기록을 삭제하시겠습니까?")) {
                clearCurrentPageData();
                showToast("시청 기록이 삭제되었습니다");
            }
        });

        timerDiv.append(buttons.recover, buttons.save, buttons.savedList, buttons.clear);
    }

    // === 비디오 연결 ===
    function attach(v) {
        if (!v || video === v) return;
        video = v;
        console.log("[ChzzkFix] video attach 완료", video);

        // 버튼 생성 (MutationObserver가 대신 처리)
        createRecoverButton();

        // 시청 기록 팝업 표시
        const showPopup = () => setTimeout(() => showSavedListPopup(), 500);
        if (video.readyState >= 2) {
            showPopup();
        } else {
            video.addEventListener("loadedmetadata", showPopup, { once: true });
        }

        // seeked 이벤트
        let seekTimeout = null;
        video.addEventListener("seeked", () => {
            lastSeekByUser = true;
            if (seekTimeout) clearTimeout(seekTimeout);
            seekTimeout = setTimeout(() => { lastSeekByUser = false; }, 500);
        });

        // timeupdate 이벤트
        video.addEventListener("timeupdate", () => {
            if (!video || !video.duration || lastSeekByUser) return;
            const t = video.currentTime;

            if (t <= 0.05 && !zeroDetected) {
                zeroDetected = true;
                showToast("0초 튐 감지! 복구 버튼 클릭 가능");
            }
        });

        // 주기적 기록
        if (recordInterval) clearInterval(recordInterval);
        recordInterval = setInterval(() => {
            if (video && !video.paused && !video.seeking && !lastSeekByUser) {
                addHistory(video.currentTime);
            }
        }, RECORD_INTERVAL);

        // src 변경 감지
        if (observers.src) observers.src.disconnect();
        observers.src = new MutationObserver(() => attach(v));
        observers.src.observe(v, { attributes: true, attributeFilter: ['src'] });
    }

    function cleanup() {
        if (recordInterval) {
            clearInterval(recordInterval);
            recordInterval = null;
        }
        if (observers.src) {
            observers.src.disconnect();
            observers.src = null;
        }
        removeButtons();
        video = null;
        historyLog = [];
        zeroDetected = false;
        lastSeekByUser = false;
        hasShownPopup = false;
    }

    // === SPA 훅 ===
    function hookSPA() {
        const patchHistory = type => {
            const orig = history[type];
            return function() {
                if (video && video.currentTime > 0 && location.pathname.startsWith("/video/")) {
                    saveTimes(video.currentTime);
                }

                const ret = orig.apply(this, arguments);
                window.dispatchEvent(new Event("locationchange"));
                return ret;
            };
        };
        history.pushState = patchHistory("pushState");
        history.replaceState = patchHistory("replaceState");

        window.addEventListener("popstate", () => {
            if (video && video.currentTime > 0 && location.pathname.startsWith("/video/")) {
                saveTimes(video.currentTime);
            }
            window.dispatchEvent(new Event("locationchange"));
        });

        window.addEventListener("locationchange", () => {
            cleanup();

            if (location.pathname.startsWith("/video/")) {
                const v = document.querySelector("video");
                if (v) attach(v);
            }
        });
    }

    window.addEventListener("beforeunload", () => {
        if (video && video.currentTime > 0 && location.pathname.startsWith("/video/")) {
            saveTimes(video.currentTime);
        }
    });

    // === 초기화 ===
    // 전역 MutationObserver로 video와 timerDiv 모두 감시
    observers.mutation = new MutationObserver(() => {
        if (!location.pathname.startsWith("/video/")) return;

        const v = document.querySelector("video");
        if (v && video !== v) attach(v);

        // 버튼이 없으면 생성 시도
        if (!buttons.recover) createRecoverButton();
    });
    observers.mutation.observe(document.body, { childList: true, subtree: true });

    hookSPA();

    if (location.pathname.startsWith("/video/")) {
        const v = document.querySelector("video");
        if (v) attach(v);
    }

})();