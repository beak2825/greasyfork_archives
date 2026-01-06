// ==UserScript==
// @name         Universal Code Splitter for AI
// @name:ar      Universal Code Splitter for AI
// @name:be      Universal Code Splitter for AI
// @name:bg      Universal Code Splitter for AI
// @name:ckb     Universal Code Splitter for AI
// @name:cs      Univerzální rozdělovač kódu pro AI
// @name:da      Universal Code Splitter for AI
// @name:de      Universal-Code-Splitter für KI
// @name:el      Universal Code Splitter for AI
// @name:en      Universal Code Splitter for AI
// @name:eo      Universal Code Splitter for AI
// @name:es      Divisor de Código Universal para IA
// @name:es-419  Divisor de Código Universal para IA
// @name:fi      Universal Code Splitter for AI
// @name:fr      Diviseur de Code Universel pour IA
// @name:fr-CA   Diviseur de Code Universel pour IA
// @name:he      Universal Code Splitter for AI
// @name:hr      Universal Code Splitter for AI
// @name:hu      Universal Code Splitter for AI
// @name:id      Universal Code Splitter for AI
// @name:it      Universal Code Splitter for AI
// @name:ja      Universal Code Splitter for AI
// @name:ka      Universal Code Splitter for AI
// @name:ko      Universal Code Splitter for AI
// @name:mr      Universal Code Splitter for AI
// @name:nb      Universal Code Splitter for AI
// @name:nl      Universal Code Splitter for AI
// @name:pl      Universal Code Splitter for AI
// @name:pt-BR   Divisor de Código Universal para IA
// @name:ro      Universal Code Splitter for AI
// @name:ru      Универсальный разделитель кода для ИИ
// @name:sk      Universal Code Splitter for AI
// @name:sr      Universal Code Splitter for AI
// @name:sv      Universal Code Splitter for AI
// @name:th      Universal Code Splitter for AI
// @name:tr      Universal Code Splitter for AI
// @name:uk      Універсальний розділювач коду для AI
// @name:ug      Universal Code Splitter for AI
// @name:vi      Universal Code Splitter for AI
// @name:zh-CN   通用AI代码分割器
// @name:zh-TW   通用AI代碼分割器
// @description         Split code blocks for AI (Alt+S to toggle)
// @description:ar      قم بتقسيم كتل الكود للذكاء الاصطناعي (Alt+S للتبديل)
// @description:be      Раздзяліць блокі кода для AI (Alt+S для пераключэння)
// @description:bg      Разделяне на кодови блокове за AI (Alt+S за превключване)
// @description:ckb     بلۆکەکانی کۆد دابەش بکە بۆ AI (Alt+S بۆ گۆڕین)
// @description:cs      Rozdělit bloky kódu pro AI (Alt+S pro přepnutí)
// @description:da      Opdel kodeblokke til AI (Alt+S for at skifte)
// @description:de      Teilt Codeblöcke für KI (Alt+S zum Umschalten)
// @description:el      Διαχωρισμός τμημάτων κώδικα για AI (Alt+S για εναλλαγή)
// @description:en      Split code blocks for AI (Alt+S to toggle)
// @description:eo      Disigi kodblokojn por AI (Alt+S por baskuli)
// @description:es      Dividir bloques de código para IA (Alt+S para alternar)
// @description:es-419  Dividir bloques de código para IA (Alt+S para alternar)
// @description:fi      Jaa koodilohkot tekoälyä varten (Alt+S vaihtaaksesi)
// @description:fr      Diviser les blocs de code pour l'IA (Alt+S pour basculer)
// @description:fr-CA   Diviser les blocs de code pour l'IA (Alt+S pour basculer)
// @description:he      פיצול קוביות קוד עבור AI (Alt+S להחלפה)
// @description:hr      Podijeli blokove koda za AI (Alt+S za prebacivanje)
// @description:hu      Kódblokkok felosztása az AI-hoz (Alt+S a váltáshoz)
// @description:id      Bagi blok kode untuk AI (Alt+S untuk beralih)
// @description:it      Dividi blocchi di codice per AI (Alt+S per attivare)
// @description:ja      AI用にコードブロックを分割 (Alt+Sで切り替え)
// @description:ka      კოდის ბლოკების გაყოფა AI-სთვის (Alt+S გადასართავად)
// @description:ko      AI를 위한 코드 블록 분할 (Alt+S로 전환)
// @description:mr      AI साठी कोड ब्लॉक्स विभाजित करा (स्विच करण्यासाठी Alt+S)
// @description:nb      Del opp kodeblokker for AI (Alt+S for å bytte)
// @description:nl      Splits codeblokken voor AI (Alt+S om te wisselen)
// @description:pl      Podziel bloki kodu dla AI (Alt+S, aby przełączyć)
// @description:pt-BR   Dividir blocos de código para IA (Alt+S para alternar)
// @description:ro      Împarte blocurile de cod pentru AI (Alt+S pentru a comuta)
// @description:ru      Разделить блоки кода для ИИ (Alt+S для переключения)
// @description:sk      Rozdeliť bloky kódu pre AI (Alt+S na prepnutie)
// @description:sr      Подели блокове кода за АИ (Alt+S за пребацивање)
// @description:sv      Dela upp kodblock för AI (Alt+S för att växla)
// @description:th      แบ่งบล็อกโค้ดสำหรับ AI (Alt+S เพื่อสลับ)
// @description:tr      AI için kod bloklarını böl (Geçiş yapmak için Alt+S)
// @description:uk      Розділити блоки коду для AI (Alt+S для перемикання)
// @description:ug      AI ئۈچۈن كود بۆلەكلىرىنى بۆلۈش (ئالماشتۇرۇش ئۈچۈن Alt+S)
// @description:vi      Chia các khối mã cho AI (Alt+S để chuyển đổi)
// @description:zh-CN   为 AI 分割代码块 (Alt+S 切换)
// @description:zh-TW   為 AI 分割代碼塊 (Alt+S 切換)

// @namespace    tm-code-splitter
// @version      1.0
// @author       Pascal
// @match        *://*/*
// @run-at       document-start
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561642/Universal%20Code%20Splitter%20for%20AI.user.js
// @updateURL https://update.greasyfork.org/scripts/561642/Universal%20Code%20Splitter%20for%20AI.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 1. Trusted Types Bypass (Fix for YouTube/Google UI injection)
    if (window.trustedTypes && trustedTypes.createPolicy && !trustedTypes.defaultPolicy) {
        const passThrough = (x) => x;
        try {
            trustedTypes.createPolicy('default', {
                createHTML: passThrough,
                createScriptURL: passThrough,
                createScript: passThrough
            });
        } catch (e) {}
    }

    const COLORS = {
        bg: '#1e1e1e',
        border: '#333',
        accent: '#0e639c',
        success: '#1e3a1e',
        text: '#d4d4d4',
        blue: '#4fc1ff',
        orange: '#ce9178'
    };

    let isVisible = true;
    const panel = document.createElement('div');

    function formatSize(bytes) {
        return bytes < 1024 ? bytes + " B" : (bytes / 1024).toFixed(1) + " KB";
    }

    function estimateTokens(text) {
        return Math.ceil(new TextEncoder().encode(text).length / 3.2);
    }

    // --- CLEANING FUNCTION (Removes previous headers/footers to prevent duplication) ---
    function cleanOldMarkers(text) {
        return text.replace(/\[PART \d+ OF \d+\][\s\S]*?--- START PART \d+ ---\n/g, '')
                   .replace(/\n--- END PART \d+ ---/g, '');
    }

    async function copyToClipboard(text, index, total) {
        const header = `[PART ${index + 1} OF ${total}]\n[NOTE: This is part of a larger file. Please confirm with "OK" only. Do not analyze until Part ${total} is received.]\n--- START PART ${index + 1} ---\n`;
        const footer = `\n--- END PART ${index + 1} ---`;
        const fullText = header + text + footer;
        try {
            await navigator.clipboard.writeText(fullText);
        } catch (e) {
            GM_setClipboard(fullText);
        }
    }

    function initUI() {
        if (document.getElementById('sc-panel-root')) return;
        panel.id = 'sc-panel-root';
        Object.assign(panel.style, {
            position: 'fixed', top: '15px', right: '15px', zIndex: '2147483647',
            background: COLORS.bg, color: COLORS.text, padding: '15px',
            borderRadius: '10px', fontFamily: 'Segoe UI, sans-serif', fontSize: '13px',
            width: '300px', boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
            border: `1px solid ${COLORS.border}`, display: isVisible ? 'block' : 'none'
        });

        panel.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; border-bottom:1px solid ${COLORS.border}; padding-bottom:8px;">
                <span style="color:${COLORS.blue}; font-weight:bold;">Code Splitter v1.0</span>
                <span style="font-size:10px; color:#666;">Alt+S</span>
            </div>
            <div id="sc-info" style="background:#252526; padding:10px; border-radius:4px; margin-bottom:12px; font-size:11px; display:none; border-left: 3px solid ${COLORS.blue};">
                <div style="display:flex; justify-content:space-between;"><span>Total Size:</span><b id="info-size">-</b></div>
                <div style="display:flex; justify-content:space-between;"><span>Est. Tokens:</span><b id="info-tokens">-</b></div>
            </div>
            <div style="margin-bottom:10px;">
                <label style="display:flex; justify-content:space-between; margin-bottom:5px; font-size:11px;">
                    Part Limit: <span id="kb-display" style="color:${COLORS.orange};">8 KB</span>
                </label>
                <input id="sc-kb" type="range" min="2" max="128" value="8" style="width:100%; cursor:pointer;">
            </div>
            <button id="sc-read" style="width:100%; background:${COLORS.accent}; color:white; border:none; padding:10px; border-radius:4px; cursor:pointer; font-weight:bold;">Read Clipboard</button>
            <div id="sc-buttons" style="display:grid; grid-template-columns: repeat(4, 1fr); gap:6px; margin-top:10px; max-height:180px; overflow-y:auto;"></div>
            <div id="sc-status" style="margin-top:12px; font-size:11px; color:#888; text-align:center;">Ready for input.</div>
        `;
        document.body.appendChild(panel);

        const btnRead = panel.querySelector('#sc-read');
        panel.querySelector('#sc-kb').oninput = (e) => {
            panel.querySelector('#kb-display').textContent = e.target.value + ' KB';
        };

        btnRead.onclick = async () => {
            btnRead.disabled = true;
            btnRead.style.opacity = '0.5';

            const kbLimit = parseInt(panel.querySelector('#sc-kb').value);
            const status = panel.querySelector('#sc-status');
            const container = panel.querySelector('#sc-buttons');

            try {
                let text = await navigator.clipboard.readText();
                if (!text || text.trim() === "") throw new Error("Clipboard empty");

                // REMOVE OLD HEADERS (Prevention of the repetition bug)
                text = cleanOldMarkers(text);

                const encoder = new TextEncoder();
                const totalBytes = encoder.encode(text).length;
                panel.querySelector('#sc-info').style.display = 'block';
                panel.querySelector('#info-size').textContent = formatSize(totalBytes);
                panel.querySelector('#info-tokens').textContent = estimateTokens(text).toLocaleString();

                const maxBytes = kbLimit * 1024;
                const lines = text.split(/\r?\n/);
                const parts = [];
                let currentChunk = [];
                let currentSize = 0;

                for (let line of lines) {
                    const lSize = encoder.encode(line + '\n').length;
                    if (currentSize + lSize > maxBytes && currentChunk.length > 0) {
                        parts.push(currentChunk.join('\n'));
                        currentChunk = []; currentSize = 0;
                    }
                    currentChunk.push(line); currentSize += lSize;
                }
                if (currentChunk.length > 0) parts.push(currentChunk.join('\n'));

                container.innerHTML = '';
                parts.forEach((content, i) => {
                    const btn = document.createElement('button');
                    btn.textContent = i + 1;
                    Object.assign(btn.style, {
                        background: '#333', color: '#ccc', border: '1px solid #444',
                        padding: '8px 0', borderRadius: '4px', cursor: 'pointer'
                    });
                    btn.onclick = async () => {
                        await copyToClipboard(content, i, parts.length);
                        container.querySelectorAll('button').forEach(b => b.style.borderColor = '#444');
                        btn.style.background = COLORS.success;
                        btn.style.borderColor = '#4ec9b0';
                        status.textContent = `Part ${i+1}/${parts.length} copied.`;
                    };
                    container.appendChild(btn);
                });
                status.textContent = `Generated ${parts.length} parts.`;
            } catch (err) {
                status.textContent = "Error: " + err.message;
            }

            btnRead.disabled = false;
            btnRead.style.opacity = '1';
        };
    }

    // Toggle visibility with Alt+S
    window.addEventListener('keydown', (e) => {
        if (e.altKey && e.key.toLowerCase() === 's') {
            isVisible = !isVisible;
            panel.style.display = isVisible ? 'block' : 'none';
        }
    });

    const start = setInterval(() => {
        if (document.body) {
            initUI();
            clearInterval(start);
        }
    }, 200);
})();