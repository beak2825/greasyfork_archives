// ==UserScript==
// @name         Reader Mode Auto Close (Adaptive Cross Click)
// @namespace    https://tampermonkey.local/reader-auto-close
// @version      1.1.1
// @description  Detect Reader Mode and click the auto ❌ cross button. (ตรวจจับโหมดอ่าน (Reader Mode) แล้วคลิกปุ่มกากบาทอัตโนมัติ รองรับหลายรูปแบบ SVG ปุ่ม ❌ โดยไม่ใช้ history.back())
// @author       Apichai P.
// @license      MIT 
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554691/Reader%20Mode%20Auto%20Close%20%28Adaptive%20Cross%20Click%29.user.js
// @updateURL https://update.greasyfork.org/scripts/554691/Reader%20Mode%20Auto%20Close%20%28Adaptive%20Cross%20Click%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /** ================== CONFIG ================== */
    const SCAN_INTERVAL = 100;   // ตรวจทุก 100 มิลลิวินาที
    const MAX_ATTEMPTS = 50;      // ตรวจสูงสุด 50 รอบ (~5 วินาที)
    const DEBUG_MODE = false;

    /** ================== CONSTANTS ================== */
    const READER_KEYWORDS = [
        'reader', 'read-mode', 'simplified', 'reading-mode',
        'reader-mode', '阅读', '简化', '阅读模式', '简化视图'
    ];

    // รูปแบบ path ของปุ่ม ❌ ที่พบได้ทั่วไป
    const CROSS_PATH_PATTERNS = [
        /^M12\s+13\.3/i,
        /^M12\s+3(\.0+)?L7/i,
        /L7\.1\d{2,}/i,
        /^M15\.5.*L8\.5/i,
        /L18\.2\d+/i
    ];

    /** ================== STATE ================== */
    let attemptCount = 0;
    let closed = false;

    /** ================== LOGGER ================== */
    function createLogBox() {
        const box = document.createElement('div');
        Object.assign(box.style, {
            position: 'fixed',
            bottom: '5px',
            left: '5px',
            zIndex: 999999,
            background: 'rgba(0,0,0,0.7)',
            color: '#0f0',
            padding: '5px 8px',
            fontSize: '12px',
            fontFamily: 'monospace',
            borderRadius: '6px',
            maxWidth: '90vw',
            maxHeight: '40vh',
            overflowY: 'auto',
            whiteSpace: 'pre-line'
        });
        document.body.appendChild(box);
        return box;
    }
    const logBox = DEBUG_MODE ? createLogBox() : null;

    function log(msg, level = 'info') {
        if (!DEBUG_MODE) return;
        const time = new Date().toLocaleTimeString('th-TH', { hour12: false });
        logBox.textContent += `[${time}] [${level.toUpperCase()}] ${msg}\n`;
    }

    /** ================== UTILITIES ================== */
    function collectAllElements(root = document) {
        const elements = [...root.querySelectorAll('*')];
        for (const el of elements) {
            if (el.shadowRoot) elements.push(...collectAllElements(el.shadowRoot));
        }
        return elements;
    }

    /** ================== DETECT READER MODE ================== */
    function isReaderModeActive() {
        const html = document.documentElement.outerHTML.toLowerCase();
        return READER_KEYWORDS.some(k => html.includes(k));
    }

    /** ================== CLICK CROSS (Adaptive) ================== */
    function clickReaderCloseButton() {
        try {
            const all = collectAllElements(document);
            const matches = [];

            for (const el of all) {
                if (el.tagName?.toLowerCase() !== 'svg') continue;
                const rect = el.getBoundingClientRect();
                if (rect.width < 20 || rect.height < 20 || rect.top > 200) continue;
                const path = el.querySelector('path');
                if (!path) continue;
                const d = path.getAttribute('d') || '';

                // ตรวจ pattern จากหลายแบบ
                if (CROSS_PATH_PATTERNS.some(re => re.test(d))) matches.push(el);
            }

            if (matches.length === 0) {
                log('❌ ยังไม่พบปุ่ม ❌ (จะตรวจซ้ำ)', 'debug');
                return false;
            }

            const btn = matches[0];
            btn.style.setProperty('z-index', '9999999', 'important');
            btn.style.setProperty('pointer-events', 'auto', 'important');

            const ev = new MouseEvent('click', { bubbles: true, cancelable: true });
            btn.dispatchEvent(ev);
            if (typeof btn.click === 'function') btn.click();

            log(`✅ คลิกปุ่มกากบาทสำเร็จ (พบ ${matches.length} ตัว)`, 'info');
            closed = true;
            return true;
        } catch (err) {
            log(`⚠️ clickReaderCloseButton error: ${err.message}`, 'error');
            return false;
        }
    }

    /** ================== MONITOR ================== */
    function monitorReaderMode() {
        const timer = setInterval(() => {
            if (closed || attemptCount >= MAX_ATTEMPTS) {
                clearInterval(timer);
                log('🟢 หยุดตรวจจับ Reader Mode', 'debug');
                return;
            }

            attemptCount++;
            if (isReaderModeActive()) {
                log(`ตรวจพบ Reader Mode รอบที่ ${attemptCount}`, 'debug');
                const done = clickReaderCloseButton();
                if (done) {
                    clearInterval(timer);
                    log('✅ ปิด Reader Mode สำเร็จ', 'info');
                }
            } else {
                log(`ยังไม่พบ Reader Mode (${attemptCount}/${MAX_ATTEMPTS})`, 'debug');
            }
        }, SCAN_INTERVAL);
    }

    /** ================== INIT ================== */
    window.addEventListener('load', () => {
        log('เริ่มตรวจจับ Reader Mode...', 'info');
        monitorReaderMode();
    }, { passive: true });

})();