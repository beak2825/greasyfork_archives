// ==UserScript==
// @name         Numo Решатель с Gemini AI
// @namespace    http://tampermonkey.net/
// @version      4.8
// @description  Решает математические вопросы на Numo с помощью Gemini AI. Требуется пароль и API ключ.
// @match        *://numo.nl/*
// @match        *://www.numo.nl/*
// @match        *://mijn.numo.nl/*
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @noframes
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/556905/Numo%20%D0%A0%D0%B5%D1%88%D0%B0%D1%82%D0%B5%D0%BB%D1%8C%20%D1%81%20Gemini%20AI.user.js
// @updateURL https://update.greasyfork.org/scripts/556905/Numo%20%D0%A0%D0%B5%D1%88%D0%B0%D1%82%D0%B5%D0%BB%D1%8C%20%D1%81%20Gemini%20AI.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // ---------------------------------------------
    // КОНФИГУРАЦИЯ
    const SCRIPT_PASSWORD = "12345"; // <- поменяй на свой пароль
    const GEMINI_API_KEY = "AIzaSyBraKxLT9TCs4fC2c4qL8ceB63lEFEAE18"; // <- получи на https://aistudio.google.com
    function requestPassword() {
        const input = prompt("Введите пароль для запуска скрипта:");
        if (input !== SCRIPT_PASSWORD) {
            alert("Неверный пароль. Скрипт не будет запущен.");
            return false;
        }
        return true;
    }

  //  if (!requestPassword()) return;

    // ---------------------------------------------
    // НАСТРОЙКИ
    const SCAN_SELECTORS = [
        ".q-text",
        ".question__text",
        ".question__prompt",
        "[data-testid='question-text']"
    ];
    const INPUT_SELECTOR = ".open-question";
    const CHECK_BUTTON_SELECTOR = ".question__action button";
    const AUTO_INTERVAL = 2000;
    const ANSWER_DELAY_MS = 1000;
    const OVERLOAD_RETRY_DELAY = 15000; // 15 секунд при перегрузке
    const MAX_RETRIES = 3; // Максимальное количество попыток

    let autoMode = false;
    let timer = null;
    let solving = false;
    let lastQuestion = "";
    let uiVisible = true;
    let apiKey = "AIzaSyBraKxLT9TCs4fC2c4qL8ceB63lEFEAE18";
    let currentModel = "gemini-2.5-flash";

    // ---------------------------------------------
    // ЛОГИ
    function log(msg) {
        const box = document.getElementById("ns-log");
        if (box) {
            const line = document.createElement("div");
            line.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
            box.prepend(line);
            if (box.children.length > 20) {
                box.removeChild(box.lastChild);
            }
        }
        console.log("[NumoSolver]", msg);
    }

    function wait(ms) {
        return new Promise(res => setTimeout(res, ms));
    }

    // ---------------------------------------------
    // Gemini API запрос с повторными попытками
    async function askGemini(question, retryCount = 0) {

        const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${currentModel}:generateContent`;

        const prompt = `ТОЛЬКО ЧИСЛО! Используй запятую для десятичных. Пример: 12,5 а не 12.5, читай полностю не только самое последние понял?
Тогда вот вопрос. Без сообщений ничего лишнего. ons is 100 gram pond is 500 gram.

Вопрос: ${question}

Ответ:`;

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "POST",
                url: `${GEMINI_API_URL}?key=${apiKey}`,
                headers: {
                    "Content-Type": "application/json"
                },
                data: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }]
                }),
                onload: function(response) {
                    try {
                        console.log("Raw API response:", response.responseText);
                        const data = JSON.parse(response.responseText);

                        // Обработка ошибки 503 - перегрузка модели
                        if (response.status === 503 && data.error?.message?.includes("overloaded")) {
                            if (retryCount < MAX_RETRIES) {
                                log(`⚠ Модель перегружена. Повторная попытка через 15 секунд... (${retryCount + 1}/${MAX_RETRIES})`);
                                setTimeout(() => {
                                    askGemini(question, retryCount + 1).then(resolve).catch(reject);
                                }, OVERLOAD_RETRY_DELAY);
                                return;
                            } else {
                                reject(new Error("Модель перегружена после нескольких попыток. Попробуйте позже."));
                                return;
                            }
                        }

                        if (response.status !== 200) {
                            reject(new Error(`HTTP ${response.status}: ${data.error?.message || 'Unknown error'}`));
                            return;
                        }

                        // УНИВЕРСАЛЬНАЯ ОБРАБОТКА ЛЮБОЙ СТРУКТУРЫ ОТВЕТА
                        let answerText = "";

                        // Рекурсивно ищем текстовое поле в ответе
                        function findText(obj) {
                            if (typeof obj === 'string') {
                                return obj;
                            }
                            if (typeof obj === 'object' && obj !== null) {
                                for (let key in obj) {
                                    if (key === 'text' && typeof obj[key] === 'string') {
                                        return obj[key];
                                    }
                                    const result = findText(obj[key]);
                                    if (result) return result;
                                }
                            }
                            return null;
                        }

                        answerText = findText(data);

                        if (!answerText) {
                            // Если не нашли текст, пробуем стандартные пути
                            if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
                                answerText = data.candidates[0].content.parts[0].text;
                            } else if (data.contents?.[0]?.parts?.[0]?.text) {
                                answerText = data.contents[0].parts[0].text;
                            } else if (data.parts?.[0]?.text) {
                                answerText = data.parts[0].text;
                            }
                        }

                        if (!answerText) {
                            console.log("Full API response structure:", JSON.stringify(data, null, 2));
                            reject(new Error("Не удалось найти текст в ответе API"));
                            return;
                        }

                        answerText = answerText.trim();

                        if (!answerText) {
                            reject(new Error("Пустой ответ от API"));
                            return;
                        }

                        log(`🤖 Ответ: "${answerText}"`);
                        resolve(answerText);
                    } catch (e) {
                        console.error("Parse error:", e);
                        reject(new Error("Ошибка парсинга: " + e.message));
                    }
                },
                onerror: function(error) {
                    // Повторная попытка при ошибках сети
                    if (retryCount < MAX_RETRIES) {
                        log(`⚠ Ошибка сети. Повтор через 5 секунд... (${retryCount + 1}/${MAX_RETRIES})`);
                        setTimeout(() => {
                            askGemini(question, retryCount + 1).then(resolve).catch(reject);
                        }, 5000);
                        return;
                    }
                    reject(new Error("Ошибка сети: " + error.statusText));
                },
                timeout: 30000
            });
        });
    }

    // ---------------------------------------------
    // Обработка ответа от Gemini
    function processGeminiAnswer(answer) {
        console.log("Processing answer:", answer);

        // Ищем число в ответе (включая отрицательные и десятичные)
        const numberMatch = answer.match(/-?\d+[,\.]?\d*/);
        if (!numberMatch) {
            throw new Error("Число не найдено в ответе: " + answer);
        }

        let numberStr = numberMatch[0];

        // Заменяем точку на запятую для голландского формата
        numberStr = numberStr.replace('.', ',');

        // Проверяем, является ли результат числом
        const numberValue = parseFloat(numberStr.replace(',', '.'));
        if (isNaN(numberValue)) {
            throw new Error("Некорректное число: " + numberStr);
        }

        // Если было десятичное число, форматируем с 2 знаками
        if (numberStr.includes(',')) {
            return numberValue.toFixed(2).replace('.', ',');
        }

        return numberStr;
    }

    // ---------------------------------------------
    async function clickCheckButton() {
        const btn = document.querySelector(CHECK_BUTTON_SELECTOR);
        if (!btn) return false;

        let start = Date.now();
        while (Date.now() - start < 1500) {
            const cs = window.getComputedStyle(btn);
            if (parseFloat(cs.opacity) > 0 && cs.pointerEvents !== "none") break;
            await wait(100);
        }

        try {
            btn.click();
            log("🖱️ Нажата кнопка Проверить");
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    function findQuestionCandidate() {
        for (const sel of SCAN_SELECTORS) {
            const node = document.querySelector(sel);
            if (!node) continue;
            const text = node.innerText || "";
            if (text.trim()) return text.trim();
        }
        return null;
    }

    async function solveAndSubmit() {
        if (solving) return;
        solving = true;

        try {
            const rawQuestion = findQuestionCandidate();
            if (!rawQuestion) {
                log("⚠ Вопрос не найден");
                solving = false;
                return;
            }

            if (rawQuestion === lastQuestion) {
                solving = false;
                return;
            }
            lastQuestion = rawQuestion;

            log(`🔎 Вопрос: "${rawQuestion}"`);
            log("⏳ Запрос к Gemini...");

            const geminiAnswer = await askGemini(rawQuestion);
            const finalAnswer = processGeminiAnswer(geminiAnswer);

            log(`✅ Ответ: ${finalAnswer}`);

            const input = document.querySelector(INPUT_SELECTOR);
            if (!input) {
                log("⚠ Поле ввода не найдено");
                solving = false;
                return;
            }

            input.focus();
            input.value = finalAnswer;
            input.dispatchEvent(new Event("input", { bubbles: true }));
            await wait(ANSWER_DELAY_MS);

            await clickCheckButton();

        } catch (error) {
            log(`❌ Ошибка: ${error.message}`);
        } finally {
            solving = false;
        }
    }

    // ---------------------------------------------
    function createUI() {
        const root = document.createElement("div");
        root.id = "numoSolver";
        root.innerHTML = `
          <div id="ns-header" style="cursor:move;font-weight:bold;margin-bottom:6px;padding:4px;background:#333;border-radius:4px;">🧮 Numo Решатель v4.8</div>

          <div style="margin:8px 0;">
            <div style="font-size:11px;margin-bottom:4px;">API ключ Gemini AIzaSyBraKxLT9TCs4fC2c4qL8ceB63lEFEAE18:</div>
            <input type="password" id="ns-api-key" style="width:100%;padding:4px;font-size:11px;background:#333;color:white;border:1px solid #555;border-radius:4px;" placeholder="Введите API ключ...">
          </div>

          <div style="margin:8px 0;">
            <div style="font-size:11px;margin-bottom:4px;">Модель: <span id="ns-model-info">${currentModel}</span></div>
          </div>

          <div style="margin-top:8px;display:flex;gap:4px;">
            <button id="ns-once" style="flex:1;padding:6px;font-size:12px;">⚡ Решить</button>
            <button id="ns-auto" style="flex:1;padding:6px;font-size:12px;">▶ Авто</button>
            <button id="ns-test" style="flex:1;padding:6px;font-size:12px;">🧪 Тест API</button>
          </div>

          <div id="ns-log" style="margin-top:8px;font-size:11px;max-height:120px;overflow:auto;background:#111;padding:6px;border-radius:6px;color:#fff;font-family:monospace;"></div>

          <div style="margin-top:6px;font-size:10px;color:#888;text-align:center;">
            Shift+A+S+D - скрыть/показать
          </div>
        `;

        Object.assign(root.style, {
            position: "fixed",
            bottom: "20px",
            right: "20px",
            background: "#222",
            color: "#fff",
            padding: "10px",
            borderRadius: "10px",
            zIndex: 999999,
            fontFamily: "sans-serif",
            width: "320px",
            fontSize: "12px",
            border: "2px solid #444"
        });

        document.body.appendChild(root);

        const apiKeyInput = document.getElementById("ns-api-key");
        const savedKey = localStorage.getItem("numo_gemini_api_key");
        if (savedKey) {
            apiKeyInput.value = savedKey;
            apiKey = savedKey;
        }

        apiKeyInput.addEventListener("change", function() {
            apiKey = this.value;
            localStorage.setItem("numo_gemini_api_key", apiKey);
            log("🔑 API ключ сохранен");
        });

        document.getElementById("ns-once").onclick = () => solveAndSubmit();

        document.getElementById("ns-auto").onclick = () => {
            autoMode = !autoMode;
            const btn = document.getElementById("ns-auto");
            if (autoMode) {
                btn.textContent = "⏸ Стоп";
                btn.style.background = "#d32f2f";
                timer = setInterval(solveAndSubmit, AUTO_INTERVAL);
                log("▶ Авторежим ВКЛ");
            } else {
                btn.textContent = "▶ Авто";
                btn.style.background = "";
                clearInterval(timer);
                log("⏸ Авторежим ВЫКЛ");
            }
        };

        document.getElementById("ns-test").onclick = async () => {
            log("🧪 Тест API...");
            try {
                const testAnswer = await askGemini("Hoeveel is 10 plus 15?");
                const processed = processGeminiAnswer(testAnswer);
                log(`✅ Тест пройден! Ответ: ${processed}`);
            } catch (error) {
                log(`❌ Тест не пройден: ${error.message}`);
            }
        };

        makeDraggable(root, document.getElementById("ns-header"));
    }

    function makeDraggable(el, handle) {
        let dx = 0, dy = 0, drag = false;
        handle.onmousedown = e => {
            drag = true;
            dx = e.clientX - el.offsetLeft;
            dy = e.clientY - el.offsetTop;
            document.onmousemove = ev => {
                if (!drag) return;
                el.style.left = ev.clientX - dx + "px";
                el.style.top = ev.clientY - dy + "px";
                el.style.bottom = "auto";
                el.style.right = "auto";
            };
            document.onmouseup = () => (drag = false);
        };
    }

    function toggleUI() {
        const ui = document.getElementById("numoSolver");
        if (!ui) return;
        uiVisible = !uiVisible;
        ui.style.display = uiVisible ? "block" : "none";
        log(uiVisible ? "✅ UI показан" : "❌ UI скрыт");
    }

    // ---------------------------------------------
    let pressedKeys = {};
    window.addEventListener("keydown", e => {
        pressedKeys[e.key.toLowerCase()] = true;
        if (pressedKeys["shift"] && pressedKeys["a"] && pressedKeys["s"] && pressedKeys["d"]) {
            toggleUI();
            pressedKeys = {};
        }
    });

    window.addEventListener("keyup", e => {
        pressedKeys[e.key.toLowerCase()] = false;
    });

    // ---------------------------------------------
    window.addEventListener("load", () => {
        createUI();
        log("✅ Numo Решатель v4.8 загружен");
        log(`🔮 Модель: ${currentModel}`);
        log(`🔄 Автоповтор при ошибках: ${MAX_RETRIES} попытки`);

        if (!apiKey || apiKey === "AIzaSyBraKxLT9TCs4fC2c4qL8ceB63lEFEAE18") {
            log("⚠ Введите API ключ в поле выше");
        }
    });

})();