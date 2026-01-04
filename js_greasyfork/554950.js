// ==UserScript==
// @name         Clean Clipboard
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  ตรวจ clipboard ทุก 3 วิ, ทำงานเฉพาะเมื่อ tab โฟกัส, ถ้ามีข้อความไทยเกิน 100 ตัว → clean และคัดลอกกลับ (เลือกเก็บ format หรือไม่) + ตรวจจับข้อความใหม่
// @author       You
// @match        https://*/*
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554950/Clean%20Clipboard.user.js
// @updateURL https://update.greasyfork.org/scripts/554950/Clean%20Clipboard.meta.js
// ==/UserScript==
/* eslint-disable no-multi-spaces */
(function () {
    'use strict';
    /** ================== CONFIG ================== */
    const CONFIG = {
        DEBUG: false,           // ปิดเปิดฟังก์ชันดีบัก
        THAI_LIMIT: 10,         // จำนวนขั้นต่ำของอักษรไทย
        CHINESE_LIMIT: 300,     // ถ้าจำนวนอักษรจีนเกินไม่ต้องทำงาน
        CHECK_INTERVAL: 1000,   // ตรวจเช็คทุกๆ x วินาที
        KEEP_FORMAT: false,     // true = เก็บ format, false = plain text only

        BEEP_FREQUENCY: 3000,   // Hz
        BEEP_DURATION: 0.3,     // s
        BEEP_VOLUME: 0.1,      // 0.0-1
        ENABLE_SOUND: true      // เปิดเสียงแจ้งเตือน
    };
    /* ================== STATE ================== */
    let audioCtx = null;
    let audioUnlocked = false;

    /** ================== LOGGER OVERLAY ================== */
    function createLoggerOverlay() {
        const box = document.createElement('div');
        box.id = 'clipboard-logger';
        box.style.cssText = `
            position: fixed; bottom: 0; left: 0; width: 100%; max-height: 2%;
            overflow-y: auto; font-size: 6px; background: rgba(0,0,0,0.85);
            color: #0f0; padding: 6px; z-index: 2147483646;
            white-space: pre-wrap; font-family: monospace;
        `;
        document.body.appendChild(box);

        const clearBtn = document.createElement('button');
        clearBtn.textContent = '🧹 Clear';
        clearBtn.style.cssText = `
            position: absolute; right: 5px; top: 5px;
            background: #222; color: #fff; border: none;
            padding: 2px 6px; font-size: 12px; cursor: pointer;
        `;
        clearBtn.addEventListener('click', () => { box.textContent = ""; box.appendChild(clearBtn); });
        box.appendChild(clearBtn);

        return box;
    }

    const loggerBox = CONFIG.DEBUG ? createLoggerOverlay() : null;

    function log(msg) {
        if (!CONFIG.DEBUG) return;
        console.log(msg);
        if (loggerBox) {
            const line = document.createElement('div');
            line.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
            loggerBox.appendChild(line);
            loggerBox.scrollTop = loggerBox.scrollHeight;
        }
    }

    /** ================== UTILITIES ================== */
    function stripHTML(text) {
        return text.replace(/]+(>|$)/g, "");
    }
    function cleanText(text) {
        return text.replace(/\n\s*\n/g, "\n").trim();
    }
    function countThaiChars(text) {
        const matches = text.match(/[\u0E00-\u0E7F]/g);
        return matches ? matches.length : 0;
    }
    function countChineseChars(text){
        const matches = text.match(/[\u4e00-\u9fff]/g);
        return matches ? matches.length : 0;
    }
    /* ================== SOUND ================== */
    function setupAudioUnlock() {
        const unlock = () => {
            try {
                if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                if (audioCtx.state === "suspended") {
                    audioCtx.resume().then(() => { audioUnlocked = true; });
                } else {
                    audioUnlocked = true;
                }
            } catch (e) {
                log(`⚠️ setupAudioUnlock: ${e.message}`, "warn");
            }
            document.removeEventListener("click", unlock, true);
            document.removeEventListener("keydown", unlock, true);
            document.removeEventListener("touchstart", unlock, { capture: true, passive: true });
        };
        document.addEventListener("click", unlock, true);
        document.addEventListener("keydown", unlock, true);
        document.addEventListener("touchstart", unlock, { capture: true, passive: true });
    }

    function beep(freq = CONFIG.BEEP_FREQUENCY) {
        if (!CONFIG.ENABLE_SOUND) return;
        try {
            if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            if (audioCtx.state === "suspended" && !audioUnlocked) {
                log("🔇 ยังไม่ได้ปลดล็อคเสียง (ต้องแตะจอ/คีย์บอร์ดก่อน)", "warn");
                return;
            }
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = "sine";
            osc.frequency.value = freq;
            gain.gain.value = CONFIG.BEEP_VOLUME;
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + CONFIG.BEEP_DURATION);
        } catch (e) {
            log(`❌ beep error: ${e.message}`, "error");
        }
    }
    /** ================== MAIN ================== */
    let lastRaw = "";   // ข้อความดิบครั้งก่อน
    let lastClean = ""; // ข้อความที่ clean ครั้งก่อน
    async function checkClipboard() {
        try {
            if (!document.hasFocus()) return;
            const raw = await navigator.clipboard.readText();
            if (!raw || raw === lastRaw) return; // ไม่เปลี่ยน → ไม่ทำงานซ้ำ
            // ✅ ถ้าไม่มีขึ้นบรรทัดใหม่เลย ไม่ต้องทำงาน
//             if (!raw.includes("\n")) {
//                 log("⏩ ข้าม: ไม่มีขึ้นบรรทัดใหม่");
//                 return;
//             }
            lastRaw = raw;
            const rawCount = raw.length;
            const chineseCount = countChineseChars(raw);
            const thaiCount = countThaiChars(raw);

            log(`CN: ${chineseCount}  TH: ${thaiCount}`);

            if (chineseCount > CONFIG.CHINESE_LIMIT) return;// ถ้าจำนวนอักษรจีนเกินไม่ต้องทำงาน

            if (thaiCount > CONFIG.THAI_LIMIT) {
                const clean = cleanText(stripHTML(raw));
                if (clean && clean !== lastClean) {
                    if (CONFIG.KEEP_FORMAT) {
                        GM_setClipboard(clean, "text");
                        log(`Copied with FORMAT kept (${rawCount} chars)`);
                        beep();
                    } else {
                        try {
                            await navigator.clipboard.writeText(clean);
                            log(`Copied as PLAIN text (${rawCount} chars)`);
                            beep();
                        } catch (e) {
                            GM_setClipboard(clean);
                            log(`Copied as PLAIN text (fallback)`);
                            beep();
                        }
                    }
                    lastClean = clean;
                }
            }
        } catch (err) {
            log("⚠️ Clipboard read failed: " + err.message);
        }
    }
    /** ================== LOOP ================== */
    setInterval(checkClipboard, CONFIG.CHECK_INTERVAL);
})();