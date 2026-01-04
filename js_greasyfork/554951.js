// ==UserScript==
// @name         Gemini 🛡️ Enter Fix Pro
// @namespace    https://tampermonkey.local/gemini-enter-fix
// @version      1.4.0
// @description  ป้องกัน Enter ส่งข้อความ, รองรับ Enter ค้าง, และเปลี่ยนห้อง/แท็บใน Gemini อัตโนมัติ (Android มือถือ)
// @match        https://gemini.google.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554951/Gemini%20%F0%9F%9B%A1%EF%B8%8F%20Enter%20Fix%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/554951/Gemini%20%F0%9F%9B%A1%EF%B8%8F%20Enter%20Fix%20Pro.meta.js
// ==/UserScript==
(function () {
    'use strict';
    /** ================= CONFIG ================= **/
    const CONFIG = {
        DEBUG: true,
        NS: 'gemini-enterfix',
        RECHECK_INTERVAL: 2000, // ms, ตรวจสอบช่องข้อความใหม่ทุก 2 วินาที
    };
    /* ================== LOGGER ================== */
    function log(msg, type = "info") {
        try {
            if (!CONFIG.DEBUG) return;

            // ตรวจสอบข้อความให้แน่ใจว่าเป็น string เสมอ
            const safeMsg = typeof msg === "string" ? msg : JSON.stringify(msg, null, 2);

            // เตรียม payload ที่ปลอดภัย
            const payload = {
                namespace: "LogCenter", // ✅ ต้องตรงกับ CONFIG.NAMESPACE ใน Logs Center
                from: (typeof GM_info !== "undefined" && GM_info.script && GM_info.script.name) 
                ? GM_info.script.name 
                : "UnknownScript",
                type,
                time: new Date().toLocaleTimeString("th-TH", { hour12: false }),
                stack: new Error().stack,
                message: safeMsg
            };

            // ✅ ส่ง log ไปยัง Logs Center
            window.postMessage(payload, "*");
        } catch (err) {
            console.error("Logger error:", err);
        }
    }
    /** ================= UTILITIES ================= **/
    function insertNewLine(el) {
        try {
            // ใช้ execCommand เพื่อให้ Quill รองรับ
            el.focus();
            const ok = document.execCommand('insertLineBreak', false);
            if (!ok) {
                const sel = el.ownerDocument.getSelection();
                if (!sel || !sel.rangeCount) return;
                const range = sel.getRangeAt(0);
                const br = el.ownerDocument.createElement('br');
                range.deleteContents();
                range.insertNode(br);
                range.setStartAfter(br);
                range.setEndAfter(br);
                sel.removeAllRanges();
                sel.addRange(range);
            }
            el.dispatchEvent(new InputEvent('input', { bubbles: true }));
        } catch (err) {
            log(`insertNewLine error: ${err.message}`, 'error');
        }
    }
    /** ================= KEY HANDLER ================= **/
    function handleKey(e) {
        try {
            const el = document.activeElement;
            if (!el || !el.isContentEditable) return;
            // Enter ธรรมดา = ขึ้นบรรทัดใหม่
            if (e.key === 'Enter' && !e.ctrlKey && !e.shiftKey) {
                e.preventDefault();
                e.stopImmediatePropagation();
                insertNewLine(el);
            }
            // Ctrl/Shift + Enter = ส่งข้อความ
            else if (e.key === 'Enter' && (e.ctrlKey || e.shiftKey)) {
                log('📨 ส่งข้อความ (Ctrl/Shift+Enter)');
            }
        } catch (err) {
            log(`handleKey error: ${err.message}`, 'error');
        }
    }
    /** ================= EVENT ATTACH ================= **/
    function attachEditor(el) {
        if (!el || el.dataset[`${CONFIG.NS}-active`] === '1') return;
        el.dataset[`${CONFIG.NS}-active`] = '1';
        // ใช้ keydown (ไม่ใช้ keypress เพราะ Quill intercept)
        el.addEventListener('keydown', handleKey, { capture: true, passive: false });
        log('✅ ผูก Event Keydown สำเร็จ');
    }
    function scanEditors(root = document) {
        const boxes = root.querySelectorAll('.ql-editor,[contenteditable="true"],div[role="textbox"]');
        boxes.forEach(attachEditor);
    }
    /** ================= AUTO RE-ATTACH ================= **/
    // debounce เพื่อให้เปลี่ยนห้องแล้ว reattach ได้เร็วแต่ไม่ถี่เกิน
    let reattachTimer = null;
    function scheduleReattach() {
        if (reattachTimer) return;
        reattachTimer = setTimeout(() => {
            reattachTimer = null;
            scanEditors(document);
        }, 300);
    }
    // สังเกต DOM เปลี่ยน (เปลี่ยนแท็บ/ห้อง)
    const observer = new MutationObserver(scheduleReattach);
    observer.observe(document, { childList: true, subtree: true });
    // ตรวจซ้ำทุกๆ N วินาที (ป้องกันกรณี Shadow DOM โหลดช้า)
    setInterval(() => {
        scanEditors(document);
    }, CONFIG.RECHECK_INTERVAL);
    /** ================= INIT ================= **/
    window.addEventListener('keydown', handleKey, { capture: true, passive: false });
    scanEditors(document);
    log('🧩 Gemini Enter Fix Pro พร้อมใช้งานแล้ว');
})();