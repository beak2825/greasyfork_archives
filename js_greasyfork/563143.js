// ==UserScript==
// @name         Homework Solver 67
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Решает Sparx Maths с помощью Gemini AI - только ответы (Ctrl+Q)
// @author       Your Name
// @match        https://maths.sparx-learning.com/*
// @match        https://*.sparxmaths.uk/*
// @match        https://*.sparx-learning.com/*
// @match        https://app.bedrocklearning.org/*
// @match        https://edu-masters.edunect.pl/*
// @grant        GM_openInTab
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @connect      generativelanguage.googleapis.com
// @connect      cdn.jsdelivr.net
// @require      https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563143/Homework%20Solver%2067.user.js
// @updateURL https://update.greasyfork.org/scripts/563143/Homework%20Solver%2067.meta.js
// ==/UserScript==

/* global html2canvas */

(function () {
    'use strict';

    console.log("%c🚀 Sparx Maths Solver loaded!", "color: #667eea; font-size: 16px; font-weight: bold;");

    const API_KEY_STORAGE = 'sparx_gemini_key';
    let apiKey = GM_getValue(API_KEY_STORAGE, '');

    const MODELS = [
        'gemini-2.5-flash',
        'gemini-flash-latest',
        'gemini-2.5-pro',
        'gemini-2.0-flash',
        'gemini-pro-latest'
    ];

    const SHORT_PROMPT = `Analyze this Sparx Maths question and provide ONLY the final answer.

Rules:
- Give ONLY the answer, nothing else
- No explanations, no working, no steps
- Just the answer in the simplest form

Examples:
Q: "What is 12 + 8?" → A: "20"
Q: "Solve x + 5 = 12" → A: "x = 7"
Q: "What is the area?" → A: "24 cm²"

Your response:`;

    // API key
    function checkKey() {
        if (!apiKey) {
            const key = prompt("🔑 Enter your Google AI API Key:\nhttps://aistudio.google.com/app/apikey");
            if (!key) {
                alert("❌ API key required!");
                return false;
            }
            apiKey = key.trim();
            GM_setValue(API_KEY_STORAGE, apiKey);
            alert("✅ Key saved! Press Ctrl+Q again.");
            return false;
        }
        return true;
    }

    // Уведомление
    function notify(msg, type = 'info') {
        const old = document.getElementById('sparx-notify');
        if (old) old.remove();

        const colors = {
            info: 'linear-gradient(135deg, #667eea, #764ba2)',
            success: 'linear-gradient(135deg, #11998e, #38ef7d)',
            error: 'linear-gradient(135deg, #eb3349, #f45c43)',
            loading: 'linear-gradient(135deg, #f093fb, #f5576c)'
        };

        const div = document.createElement('div');
        div.id = 'sparx-notify';
        div.style.cssText = `
            position: fixed; top: 20px; right: 20px; z-index: 999999;
            background: ${colors[type]}; color: white;
            padding: 16px 24px; border-radius: 12px;
            font: 600 15px 'Segoe UI', sans-serif;
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            animation: slideIn 0.3s ease-out;
        `;
        div.textContent = msg;

        const style = document.createElement('style');
        style.textContent = '@keyframes slideIn{from{transform:translateX(400px);opacity:0}to{transform:translateX(0);opacity:1}}';
        document.head.appendChild(style);
        document.body.appendChild(div);

        if (type !== 'loading') setTimeout(() => div.remove(), 5000);
        return div;
    }

    // html2canvas ready
    async function waitCanvas() {
        let tries = 0;
        while (typeof html2canvas === 'undefined' && tries < 30) {
            await new Promise(r => setTimeout(r, 100));
            tries++;
        }
        if (typeof html2canvas === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
            await new Promise((res, rej) => {
                script.onload = res;
                script.onerror = rej;
                document.head.appendChild(script);
            });
        }
    }

    // Скриншот
    async function capture() {
        console.log("📸 Делаю скриншот...");

        const btn = document.getElementById('sparx-btn');
        const notify = document.getElementById('sparx-notify');
        if (btn) btn.style.visibility = 'hidden';
        if (notify) notify.style.visibility = 'hidden';

        await new Promise(r => setTimeout(r, 200));
        await waitCanvas();

        let target = document.body;
        const containers = [
            document.querySelector('[data-test-id="question-container"]'),
            document.querySelector('.question-container'),
            document.querySelector('main'),
            document.querySelector('#root')
        ];

        for (const el of containers) {
            if (el) {
                target = el;
                console.log("✅ Контейнер:", el.tagName);
                break;
            }
        }

        const canvas = await html2canvas(target, {
            useCORS: true,
            allowTaint: true,
            logging: true,
            scale: 1.5,
            backgroundColor: '#fff',
            foreignObjectRendering: true
        });

        if (btn) btn.style.visibility = 'visible';
        if (notify) notify.style.visibility = 'visible';

        console.log("✅ Размер:", canvas.width, "x", canvas.height);

        // Проверка на белый экран
        const ctx = canvas.getContext('2d');
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        let blank = true;
        for (let i = 0; i < data.length; i += 4) {
            if (data[i] !== 255 || data[i+1] !== 255 || data[i+2] !== 255) {
                blank = false;
                break;
            }
        }

        if (blank) throw new Error("Скриншот пустой! Подождите загрузки страницы и попробуйте снова.");

        return canvas;
    }

    // Canvas to blob
    function toBlob(canvas) {
        return new Promise((res, rej) => {
            let c = canvas;
            const max = 2048;

            if (canvas.width > max || canvas.height > max) {
                const scale = Math.min(max / canvas.width, max / canvas.height);
                const w = Math.floor(canvas.width * scale);
                const h = Math.floor(canvas.height * scale);

                c = document.createElement('canvas');
                c.width = w;
                c.height = h;
                c.getContext('2d').drawImage(canvas, 0, 0, w, h);
                console.log(`📐 Уменьшено: ${canvas.width}x${canvas.height} → ${w}x${h}`);
            }

            c.toBlob(blob => {
                if (!blob) return rej(new Error('Ошибка blob'));
                console.log("✅ Blob:", (blob.size/1024/1024).toFixed(2), "MB");
                res(blob);
            }, 'image/jpeg', 0.85);
        });
    }

    // Отправка в Gemini
    async function solve(blob, custom = '') {
        const reader = new FileReader();
        const b64 = await new Promise((res, rej) => {
            reader.onload = () => res(reader.result.split(',')[1]);
            reader.onerror = rej;
            reader.readAsDataURL(blob);
        });

        const prompt = custom || SHORT_PROMPT;
        const payload = {
            contents: [{
                parts: [
                    { text: prompt },
                    { inline_data: { mime_type: "image/jpeg", data: b64 }}
                ]
            }]
        };

        const saved = GM_getValue('sparx_model', 0);

        for (let i = 0; i < MODELS.length; i++) {
            const idx = (saved + i) % MODELS.length;
            const model = MODELS[idx];

            try {
                console.log(`🔧 ${i+1}/${MODELS.length}: ${model}`);

                const answer = await new Promise((res, rej) => {
                    GM_xmlhttpRequest({
                        method: "POST",
                        url: `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
                        headers: { "Content-Type": "application/json" },
                        data: JSON.stringify(payload),
                        timeout: 60000,
                        onload: (r) => {
                            if (r.status >= 200 && r.status < 300) {
                                const json = JSON.parse(r.responseText);
                                const ans = json?.candidates?.[0]?.content?.parts?.[0]?.text;
                                if (ans) {
                                    GM_setValue('sparx_model', idx);
                                    res(ans);
                                } else {
                                    rej(new Error('Пустой ответ'));
                                }
                            } else {
                                rej(new Error(`HTTP ${r.status}`));
                            }
                        },
                        onerror: () => rej(new Error('Сеть')),
                        ontimeout: () => rej(new Error('Timeout'))
                    });
                });

                return answer;
            } catch (err) {
                console.warn(`⚠️ ${model}:`, err.message);
                if (i === MODELS.length - 1) {
                    throw new Error(`Все модели не работают!\n${err.message}\n\nПроверьте API ключ: https://aistudio.google.com/app/apikey`);
                }
            }
        }
    }

    // Показать результат в углу страницы
    function show(answer) {
        // Удаляем старое окно если есть
        const old = document.getElementById('sparx-result-widget');
        if (old) old.remove();

        const widget = document.createElement('div');
        widget.id = 'sparx-result-widget';
        widget.innerHTML = `
            <div class="sparx-widget-header">
                <span class="sparx-widget-title">📐 Ответ</span>
                <button class="sparx-widget-close" id="sparx-widget-close">✖</button>
            </div>
            <div class="sparx-widget-body">
                <pre id="sparx-widget-answer">${answer.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}</pre>
            </div>
            <div class="sparx-widget-footer">
                <button id="sparx-widget-copy">📋 Копировать</button>
            </div>
        `;

        const style = document.createElement('style');
        style.textContent = `
            #sparx-result-widget {
                position: fixed;
                top: 20px;
                left: 20px;
                width: 350px;
                background: rgba(255, 255, 255, 0.98);
                backdrop-filter: blur(20px);
                border-radius: 16px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
                z-index: 999999;
                font-family: 'Inter', 'Segoe UI', sans-serif;
                animation: slideInLeft 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                border: 2px solid rgba(102, 126, 234, 0.3);
            }

            @keyframes slideInLeft {
                from {
                    opacity: 0;
                    transform: translateX(-100px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }

            .sparx-widget-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 12px 16px;
                background: linear-gradient(135deg, #667eea, #764ba2);
                border-radius: 14px 14px 0 0;
                color: white;
            }

            .sparx-widget-title {
                font-size: 16px;
                font-weight: 700;
            }

            .sparx-widget-close {
                background: rgba(255, 255, 255, 0.2);
                border: none;
                width: 28px;
                height: 28px;
                border-radius: 50%;
                color: white;
                cursor: pointer;
                font-size: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s;
            }

            .sparx-widget-close:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: rotate(90deg);
            }

            .sparx-widget-body {
                padding: 20px 16px;
                background: linear-gradient(135deg, #f5f7fa, #e8ecf1);
                max-height: 300px;
                overflow-y: auto;
            }

            .sparx-widget-body::-webkit-scrollbar {
                width: 6px;
            }

            .sparx-widget-body::-webkit-scrollbar-track {
                background: rgba(0, 0, 0, 0.05);
                border-radius: 10px;
            }

            .sparx-widget-body::-webkit-scrollbar-thumb {
                background: #667eea;
                border-radius: 10px;
            }

            #sparx-widget-answer {
                margin: 0;
                padding: 0;
                white-space: pre-wrap;
                word-wrap: break-word;
                font-size: 22px;
                line-height: 1.4;
                color: #2d3748;
                font-family: 'Inter', monospace;
                font-weight: 700;
                text-align: center;
                user-select: all;
            }

            .sparx-widget-footer {
                padding: 12px 16px;
                background: white;
                border-radius: 0 0 14px 14px;
            }

            .sparx-widget-footer button {
                width: 100%;
                padding: 12px;
                font-size: 15px;
                font-weight: 600;
                border: none;
                border-radius: 10px;
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                cursor: pointer;
                transition: all 0.3s;
                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
            }

            .sparx-widget-footer button:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
            }

            .sparx-widget-footer button.copied {
                background: linear-gradient(135deg, #11998e, #38ef7d);
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(widget);

        // Закрытие
        const closeBtn = document.getElementById('sparx-widget-close');
        closeBtn.onclick = () => widget.remove();

        // Копирование
        const copyBtn = document.getElementById('sparx-widget-copy');
        const answerText = document.getElementById('sparx-widget-answer');

        copyBtn.onclick = () => {
            const text = answerText.textContent;
            navigator.clipboard.writeText(text).then(() => {
                copyBtn.textContent = '✅ Скопировано!';
                copyBtn.classList.add('copied');
                setTimeout(() => {
                    copyBtn.textContent = '📋 Копировать';
                    copyBtn.classList.remove('copied');
                }, 2000);
            }).catch(() => {
                const temp = document.createElement('textarea');
                temp.value = text;
                document.body.appendChild(temp);
                temp.select();
                document.execCommand('copy');
                document.body.removeChild(temp);
                copyBtn.textContent = '✅ Скопировано!';
                copyBtn.classList.add('copied');
            });
        };

        // Автовыделение текста при клике
        answerText.onclick = () => {
            const selection = window.getSelection();
            const range = document.createRange();
            range.selectNodeContents(answerText);
            selection.removeAllRanges();
            selection.addRange(range);
        };
    }

    // Главная функция
    async function run() {
        if (!checkKey()) return;

        let n;
        try {
            n = notify('📸 Создаю скриншот...', 'loading');
            await new Promise(r => setTimeout(r, 500));

            const canvas = await capture();
            n.textContent = '📤 Отправка в AI...';

            const blob = await toBlob(canvas);
            const url = URL.createObjectURL(blob);
            console.log("🖼️ ПРЕВЬЮ:", url);

            const custom = prompt("💬 Дополнительный промпт?\n(Оставьте пустым для автоматического ответа)");
            if (custom === null) {
                n.remove();
                return;
            }

            n.textContent = '🤖 AI думает...';
            const answer = await solve(blob, custom);

            n.remove();
            notify('✅ Готово!', 'success');
            show(answer);

        } catch (err) {
            if (n) n.remove();
            console.error("❌", err);
            notify('❌ ' + err.message, 'error');
        }
    }

    // Ctrl+Q
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'q') {
            e.preventDefault();
            e.stopPropagation();
            console.log("⌨️ Ctrl+Q!");
            run();
        }
    }, true);

    // Кнопка
    function addBtn() {
        if (document.getElementById('sparx-btn')) return;

        const btn = document.createElement('button');
        btn.id = 'sparx-btn';
        btn.innerHTML = '🤖 Решить';
        btn.style.cssText = `
            position:fixed;bottom:20px;right:20px;z-index:999998;
            padding:14px 24px;background:linear-gradient(135deg,#667eea,#764ba2);
            color:#fff;border:none;border-radius:12px;font-size:16px;
            font-weight:600;cursor:pointer;box-shadow:0 6px 25px rgba(102,126,234,.5);
            transition:.3s;font-family:'Inter',sans-serif;
        `;

        btn.onmouseenter = () => {
            btn.style.transform = 'translateY(-3px)';
            btn.style.boxShadow = '0 10px 35px rgba(102,126,234,.7)';
        };
        btn.onmouseleave = () => {
            btn.style.transform = 'translateY(0)';
            btn.style.boxShadow = '0 6px 25px rgba(102,126,234,.5)';
        };
        btn.onclick = run;

        document.body.appendChild(btn);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addBtn);
    } else {
        addBtn();
    }
    window.addEventListener('load', addBtn);

    console.log("%c✅ Готово! Ctrl+Q для запуска", "color: #38ef7d; font-size: 14px; font-weight: bold;");

})();