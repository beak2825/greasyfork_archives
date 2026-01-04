// ==UserScript==
// @name         SOOP Enhanced v1.0
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  SOOP 라이브 시청 환경을 개선합니다. 자동 탭 음소거, 전역 M 키 토글, Ctrl+숫자 탭 전환 픽스, 채팅 복사/붙여넣기, F5/Ctrl+R 새로고침 픽스 기능을 제공하는 확장 스크립트입니다.
// @author       H3art
// @match        https://play.sooplive.co.kr/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/553794/SOOP%20Enhanced%20v10.user.js
// @updateURL https://update.greasyfork.org/scripts/553794/SOOP%20Enhanced%20v10.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ====================================================================
    // 0. 공통 상수 및 변수 정의
    // ====================================================================
    const SETTING_KEY = 'SOOP_Enhanced_Settings';
    const MUTE_BUTTON_ID = 'btn_sound';
    const AUTO_MUTE_SETTING = 'autoMuteEnabled';
    const CURRENT_TAB_ID = Date.now() + Math.random().toString().slice(2);
    const CHECK_INTERVAL = 200; 

    let settings = { [AUTO_MUTE_SETTING]: true };
    let isUserMuted = false;
    let muteCheckInterval = null;
    let hideSettingsTimer = null;
    let isSidebarOpen = false;
    let sidebarElement = null; 
    let settingsButtonContainerElement = null;

    // ====================================================================
    // I. [전역 함수 정의] - 핵심 기능 및 제어
    // ====================================================================
    function loadSettings() {
        try { const savedSettings = localStorage.getItem(SETTING_KEY); if (savedSettings) { settings = JSON.parse(savedSettings); if (settings[AUTO_MUTE_SETTING] === undefined) settings[AUTO_MUTE_SETTING] = true; } } catch (e) {}
    }
    function saveSettings() { localStorage.setItem(SETTING_KEY, JSON.stringify(settings)); }
    function mutePlayer() {
        const muteButton = document.getElementById(MUTE_BUTTON_ID);
        if (muteButton && !muteButton.classList.contains('mute')) muteButton.click();
    }
    function unmutePlayer() {
        const muteButton = document.getElementById(MUTE_BUTTON_ID);
        if (muteButton && muteButton.classList.contains('mute')) muteButton.click();
    }
    function toggleMute() {
        const muteButton = document.getElementById(MUTE_BUTTON_ID);
        if (muteButton) { muteButton.click(); return true; }
        return false;
    }
    const checkAndMuteInactive = () => {
        if (!settings[AUTO_MUTE_SETTING]) return;
        const activeTabId = localStorage.getItem('SOOP_Active_Tab_ID');
        if (activeTabId !== CURRENT_TAB_ID) mutePlayer();
    };
    
    // Ctrl+숫자 탭 전환 픽스 및 M 키 이중 토글 방지 로직
    function fixCtrlNumberTabSwitch() {
        const playerElement = document.getElementById('player'); 
        if (playerElement) playerElement.addEventListener('keydown', (e) => { 
            const isPlainM = e.key.toLowerCase() === 'm' && !e.ctrlKey && !e.altKey && !e.shiftKey;

            // Ctrl+Number Fix 또는 M 키 충돌 방지 시 전파 차단
            if ((e.ctrlKey && e.key >= '1' && e.key <= '9') || isPlainM) { 
                e.stopPropagation(); // 플레이어 내부 SOOP 로직으로 이벤트 전달 차단
            }
        }, true);
    }

    function allowChatCopyPaste() {
        const writeArea = document.getElementById("write_area"); if (!writeArea) return; writeArea.addEventListener("cut", (e) => e.stopPropagation(), true); writeArea.addEventListener("copy", (e) => e.stopPropagation(), true); writeArea.addEventListener("paste", (e) => e.stopPropagation(), true);
    }
    
    // 전역 M 키 토글 - Capturing 단계에서 실행하여 전역 토글 보장
    function setupGlobalMuteKey() {
        document.addEventListener('keydown', (e) => {
            if (e.key.toLowerCase() !== 'm' || e.ctrlKey || e.altKey || e.shiftKey) return;
            // 채팅 입력 중인지 확인
            const target = e.target; const tagName = target.tagName;
            if (tagName === 'INPUT' || tagName === 'TEXTAREA' || target.id === 'write_area' || target.closest('#write_area')) return;
            
            // 토글 로직 실행 
            if (toggleMute()) e.preventDefault();
        }, true); 
    }
    
    // F5 새로고침 활성화 (강제 활성화 로직으로 수정)
    function fixF5Refresh() {
        document.addEventListener('keydown', (e) => {
            // F5 (key: 'F5', keyCode: 116) 또는 Ctrl+R (새로고침 단축키)
            if (e.key === 'F5' || (e.ctrlKey && e.key.toLowerCase() === 'r')) {
                const target = e.target;
                const tagName = target.tagName;

                // 채팅 입력 중이 아닐 때만 강제 새로고침 활성화 (입력 중에는 새로고침 방지)
                if (!(tagName === 'INPUT' || tagName === 'TEXTAREA' || target.id === 'write_area' || target.closest('#write_area'))) {
                    // SOOP의 e.preventDefault() 실행을 막기 위해 모든 전파를 즉시 중지
                    e.stopImmediatePropagation();
                    
                    // 중요한 점: e.preventDefault()를 호출하지 않아야 브라우저 기본 동작이 실행됨
                    // 따라서 추가적인 동작 없이 리스너를 종료하여 새로고침이 가능하게 합니다.
                }
            }
        }, true); // **true: Capturing 단계에서 먼저 가로챕니다.**
    }

    function initializeAutoMuteFeature() {
        const muteButton = document.getElementById(MUTE_BUTTON_ID);
        if (!muteButton) { const toggleButton = document.getElementById('auto-mute-toggle-button'); if (toggleButton) { toggleButton.textContent = '오류'; toggleButton.style.background = '#888'; toggleButton.disabled = true; } return; }
        
        isUserMuted = muteButton.classList.contains('mute');
        if (document.hasFocus()) localStorage.setItem('SOOP_Active_Tab_ID', CURRENT_TAB_ID);
        else if (settings[AUTO_MUTE_SETTING] && !muteCheckInterval) muteCheckInterval = setInterval(checkAndMuteInactive, CHECK_INTERVAL);

        const manualMuteHandler = () => { setTimeout(() => { isUserMuted = muteButton.classList.contains('mute'); }, 50); };
        muteButton.addEventListener('click', manualMuteHandler);
        
        window.addEventListener('focus', () => {
            if (!settings[AUTO_MUTE_SETTING]) return; localStorage.setItem('SOOP_Active_Tab_ID', CURRENT_TAB_ID); unmutePlayer();
            if (muteCheckInterval) { clearInterval(muteCheckInterval); muteCheckInterval = null; }
        });
        window.addEventListener('blur', () => {
            if (!settings[AUTO_MUTE_SETTING] || muteCheckInterval) return; muteCheckInterval = setInterval(checkAndMuteInactive, CHECK_INTERVAL);
        });
    }

    // ====================================================================
    // II. UI 생성 및 이벤트 관리
    // ====================================================================
    const toggleSidebar = (closeOnly = false) => {
        if (!sidebarElement) return;

        isSidebarOpen = closeOnly ? false : !isSidebarOpen;
        sidebarElement.style.transform = isSidebarOpen ? 'translateX(0)' : 'translateX(100%)';
        
        if (!isSidebarOpen) { 
            if(settingsButtonContainerElement) settingsButtonContainerElement.dispatchEvent(new MouseEvent('mouseleave')); 
        } else {
            if(hideSettingsTimer) clearTimeout(hideSettingsTimer);
            if(settingsButtonContainerElement) settingsButtonContainerElement.style.opacity = 1;
        }
    };
    
    function createSettingsUI() {
        const body = document.body; if (!body) return;

        const settingsButtonContainer = document.createElement('div');
        settingsButtonContainer.id = 'soop-enhanced-button-container';
        settingsButtonContainer.style.cssText = `position: fixed; bottom: 60px; right: 20px; z-index: 100000; display: flex; opacity: 0; transition: opacity 0.3s;`;
        body.appendChild(settingsButtonContainer);
        settingsButtonContainerElement = settingsButtonContainer;

        const iconButton = document.createElement('button');
        iconButton.id = 'soop-enhanced-settings-icon';
        iconButton.style.cssText = `background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(2px); border: none; color: white; width: 80px; height: 35px; line-height: 35px; font-size: 14px; border-radius: 8px; cursor: pointer; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4); transition: background 0.3s, transform 0.1s; display: flex; align-items: center; justify-content: center; font-family: 'Malgun Gothic', 'Arial', sans-serif;`;
        iconButton.innerHTML = '⚙️ <span style="margin-left: 5px;">설정</span>';
        iconButton.onmouseenter = () => { iconButton.style.background = 'rgba(255, 255, 255, 0.2)'; };
        iconButton.onmouseleave = () => { iconButton.style.background = 'rgba(255, 255, 255, 0.1)'; };
        settingsButtonContainer.appendChild(iconButton);

        const sidebar = document.createElement('div');
        sidebar.id = 'soop-enhanced-sidebar';
        sidebar.style.cssText = `
            position: fixed; top: 0; right: 0; width: 300px; height: 100%; z-index: 99999;
            background: rgba(20, 20, 20, 0.95); box-shadow: -4px 0 10px rgba(0, 0, 0, 0.5);
            color: #fff; padding: 20px;
            transform: translateX(100%); transition: transform 0.3s ease-out;
            backdrop-filter: blur(5px); -webkit-backdrop-filter: blur(5px);
            font-family: 'Malgun Gothic', 'Arial', sans-serif; display: flex; flex-direction: column;
        `;
        body.appendChild(sidebar);
        sidebarElement = sidebar; 

        const style = document.createElement('style');
        style.innerHTML = `.soop-enhanced-tooltip-container{position:relative;display:inline-block;margin-left:5px}.soop-enhanced-tooltip{visibility:hidden;opacity:0;width:350px;background-color:rgba(0,0,0,.95);color:#fff;text-align:left;border-radius:6px;padding:12px;position:absolute;z-index:1;bottom:100%;right:0;margin-right:-25px;margin-bottom:10px;font-size:12px;line-height:1.5;transition:opacity .3s,visibility .3s;pointer-events:none}.soop-enhanced-tooltip-container:hover .soop-enhanced-tooltip{visibility:visible;opacity:1}.soop-enhanced-tooltip::after{content:"";position:absolute;top:100%;right:30px;border-width:5px;border-style:solid;border-color:rgba(0,0,0,.95) transparent transparent transparent}`;
        document.head.appendChild(style);

        sidebar.innerHTML = `
            <h2 style="font-size: 18px; margin-bottom: 25px; border-bottom: 1px solid #333; padding-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
                SOOP Enhanced 설정
                <button id="close-sidebar-button" style="background: none; border: none; color: #fff; font-size: 24px; cursor: pointer; line-height: 1; padding: 0;">&times;</button>
            </h2>
            <div id="sidebar-content" style="flex-grow: 1;">
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #222;"><span style="font-size: 14px; display: flex; align-items: center;">자동 포커스 음소거 <div class="soop-enhanced-tooltip-container"><span style="color:#ADFF2F; font-size:14px; cursor:help;">ⓘ</span><div class="soop-enhanced-tooltip">여러 개의 SOOP 라이브 탭 중 현재 활성화된 탭의 소리만 켜고, 나머지는 자동으로 음소거합니다. 탭 전환 시 소리 겹침을 방지하고, 수동 조작 상태를 기억합니다.</div></div></span><button id="auto-mute-toggle-button" style="background: ${settings[AUTO_MUTE_SETTING] ? '#4CAF50' : '#f44336'}; color: white; border: none; padding: 4px 10px; font-size: 11px; cursor: pointer; border-radius: 6px; transition: background 0.3s; width: 50px;">${settings[AUTO_MUTE_SETTING] ? 'ON' : 'OFF'}</button></div>
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #222;"><span style="font-size: 14px; display: flex; align-items: center;">전역 M 키 토글 <div class="soop-enhanced-tooltip-container"><span style="color:#ADFF2F; font-size:14px; cursor:help;">ⓘ</span><div class="soop-enhanced-tooltip">방송 화면 포커스와 관계없이 'M' 키로 음소거/해제가 가능합니다. 채팅창 입력 중에는 'M'이 정상 입력되어 충돌이 없습니다.</div></div></span><span style="font-size: 13px; color: #aaa;">항상 ON</span></div>
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #222;"><span style="font-size: 14px; display: flex; align-items: center;">Ctrl+숫자 탭 전환 픽스 <div class="soop-enhanced-tooltip-container"><span style="color:#ADFF2F; font-size:14px; cursor:help;">ⓘ</span><div class="soop-enhanced-tooltip">플레이어 포커스 시에도 브라우저 기본 단축키 (Ctrl+1, Ctrl+2 등)로 탭 전환이 가능합니다.</div></div></span><span style="font-size: 13px; color: #aaa;">항상 ON</span></div>
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #222;"><span style="font-size: 14px; display: flex; align-items: center;">채팅 복붙 허용 & F5 픽스 <div class="soop-enhanced-tooltip-container"><span style="color:#ADFF2F; font-size:14px; cursor:help;">ⓘ</span><div class="soop-enhanced-tooltip">채팅 입력창에서 복사/붙여넣기 기능이 가능해집니다. 또한, 플레이어 포커스 시에도 F5 또는 Ctrl+R로 새로고침이 가능합니다.</div></div></span><span style="font-size: 13px; color: #aaa;">항상 ON</span></div>
            </div>
            <div id="version-info" style="margin-top: auto; font-size: 11px; text-align: center; padding-top: 10px; color: #777; border-top: 1px solid #222;">SOOP Enhanced v1.0 by H3art</div>
        `;

        // 이벤트 연결
        iconButton.onclick = (e) => { e.stopPropagation(); toggleSidebar(); }; 
        document.getElementById('close-sidebar-button').onclick = (e) => { e.stopPropagation(); toggleSidebar(true); };
        
        document.addEventListener('click', (e) => {
            if (isSidebarOpen && sidebarElement && settingsButtonContainerElement && !sidebarElement.contains(e.target) && !settingsButtonContainerElement.contains(e.target)) {
                toggleSidebar(true);
            }
        });

        const toggleButton = document.getElementById('auto-mute-toggle-button');
        toggleButton.onclick = function() {
            settings[AUTO_MUTE_SETTING] = !settings[AUTO_MUTE_SETTING]; saveSettings();
            this.style.background = settings[AUTO_MUTE_SETTING] ? '#4CAF50' : '#f44336';
            this.textContent = settings[AUTO_MUTE_SETTING] ? 'ON' : 'OFF';
            if (!settings[AUTO_MUTE_SETTING]) { if(muteCheckInterval) clearInterval(muteCheckInterval); unmutePlayer(); }
            else { if(document.hasFocus()){ localStorage.setItem('SOOP_Active_Tab_ID', CURRENT_TAB_ID); } else { if(!muteCheckInterval) muteCheckInterval = setInterval(checkAndMuteInactive, CHECK_INTERVAL);} }
        };

        settingsButtonContainer.addEventListener('mouseenter', () => {
            if (hideSettingsTimer) clearTimeout(hideSettingsTimer);
            settingsButtonContainer.style.opacity = 1;
        });
        settingsButtonContainer.addEventListener('mouseleave', () => {
            if (!isSidebarOpen) {
                hideSettingsTimer = setTimeout(() => { settingsButtonContainer.style.opacity = 0; }, 500);
            }
        });

        settingsButtonContainer.style.opacity = 1;
        setTimeout(() => { if (!isSidebarOpen) settingsButtonContainer.style.opacity = 0; }, 2000);
    }

    // ====================================================================
    // III. 메인 실행
    // ====================================================================
    function main() {
        loadSettings();
        createSettingsUI();
        fixCtrlNumberTabSwitch(); // M 키 충돌 방지 로직 포함
        allowChatCopyPaste();
        setupGlobalMuteKey(); // Capturing 단계에서 실행하여 전역 토글 보장
        fixF5Refresh(); // F5/Ctrl+R 새로고침 활성화 (강제 로직)
        
        const maxAttempts = 20; let attempts = 0;
        const initInterval = setInterval(() => {
            if (document.getElementById(MUTE_BUTTON_ID)) {
                clearInterval(initInterval);
                initializeAutoMuteFeature();
            } else {
                attempts++;
                if (attempts >= maxAttempts) {
                    clearInterval(initInterval);
                    initializeAutoMuteFeature(); 
                }
            }
        }, 500);
    }
    
    main();
})();