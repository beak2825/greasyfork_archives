// ==UserScript==
// @name         Google AI Studio Copy - v9 Surgical Extraction
// @namespace    http://tampermonkey.net/
// @version      9.0
// @description  copy all text
// @author       User
// @match        https://aistudio.google.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562806/Google%20AI%20Studio%20Copy%20-%20v9%20Surgical%20Extraction.user.js
// @updateURL https://update.greasyfork.org/scripts/562806/Google%20AI%20Studio%20Copy%20-%20v9%20Surgical%20Extraction.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const delay = ms => new Promise(res => setTimeout(res, ms));

    // Хранилище: ID -> Текст
    let capturedData = new Map();
    let isFinished = false;
    let formattedOutput = "";

    function createButton() {
        const btn = document.createElement('button');
        btn.innerText = 'START SURGICAL EXTRACT';
        btn.id = 'ai-studio-extract-btn';

        Object.assign(btn.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: '9999',
            padding: '12px 24px',
            backgroundColor: '#d93025',
            color: 'white',
            border: '2px solid rgba(255,255,255,0.2)',
            borderRadius: '24px',
            cursor: 'pointer',
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
            fontWeight: 'bold',
            fontSize: '13px',
            fontFamily: 'monospace',
            transition: 'all 0.2s'
        });

        document.body.appendChild(btn);

        btn.addEventListener('click', async () => {
            // --- ЭТАП 2: КОПИРОВАНИЕ ---
            if (isFinished) {
                try {
                    await navigator.clipboard.writeText(formattedOutput);
                    btn.innerText = 'COPIED!';
                    btn.style.backgroundColor = '#34a853';

                    setTimeout(() => {
                        isFinished = false;
                        capturedData.clear();
                        formattedOutput = "";
                        btn.innerText = 'START SURGICAL EXTRACT';
                        btn.style.backgroundColor = '#d93025';
                    }, 3000);
                } catch (e) {
                    alert('Copy failed: ' + e.message);
                }
                return;
            }

            // --- ЭТАП 1: СБОР ---
            let targetDiv = document.querySelector('ms-autoscroll-container') ||
                            document.querySelector('.chat-view-container');

            if (!targetDiv) {
                btn.innerText = 'NO CHAT FOUND';
                return;
            }

            btn.disabled = true;
            btn.innerText = 'INIT...';
            btn.style.backgroundColor = '#fbbc04'; // Желтый
            btn.style.color = '#000';

            try {
                // 1. Быстрая загрузка истории (вверх)
                let prevHeight = targetDiv.scrollHeight;
                for (let i = 0; i < 15; i++) {
                    targetDiv.scrollTop = 0;
                    await delay(800);
                    if (targetDiv.scrollHeight > prevHeight) {
                        prevHeight = targetDiv.scrollHeight;
                        btn.innerText = `LOADING HISTORY...`;
                    } else if (i > 3) {
                        break;
                    }
                }

                // 2. Умный парсинг (вниз)
                btn.innerText = 'EXTRACTING...';
                btn.style.backgroundColor = '#1a73e8'; // Синий
                btn.style.color = '#fff';

                targetDiv.scrollTop = 0;
                await delay(500);

                let scrollStep = 600;
                let noNewDataCount = 0;

                while (true) {
                    const turns = targetDiv.querySelectorAll('ms-chat-turn');
                    let addedThisCycle = 0;

                    turns.forEach(turn => {
                        const turnId = turn.id || turn.getAttribute('id');

                        if (turnId && !capturedData.has(turnId)) {
                            // --- ХИРУРГИЯ: ЧИСТИМ МУСОР ---

                            // 1. Определяем роль
                            let role = "UNKNOWN";
                            const container = turn.querySelector('.chat-turn-container');
                            if (container) {
                                if (container.classList.contains('user')) role = "USER";
                                else if (container.classList.contains('model')) role = "MODEL";
                            }

                            // 2. Клонируем узел, чтобы не ломать страницу
                            const clone = turn.cloneNode(true);

                            // 3. Удаляем весь мусор (кнопки, иконки, меню)
                            const junkSelectors = [
                                'button',
                                'mat-icon',
                                '.actions-container',
                                '.turn-footer',
                                '.actions',
                                'ms-prompt-options-menu',
                                '.material-symbols-outlined'
                            ];

                            junkSelectors.forEach(sel => {
                                const junk = clone.querySelectorAll(sel);
                                junk.forEach(el => el.remove());
                            });

                            // 4. Ищем настоящий контент
                            // В AI Studio текст лежит либо в .cmark-node (markdown), либо в textarea (ввод)
                            let cleanText = "";

                            // Попытка 1: Найти отрендеренный Markdown (самый чистый текст)
                            const markdownNodes = clone.querySelectorAll('ms-cmark-node, .user-chunk');
                            if (markdownNodes.length > 0) {
                                let lines = [];
                                markdownNodes.forEach(node => lines.push(node.innerText));
                                cleanText = lines.join('\n');
                            }
                            // Попытка 2: Если это поле ввода пользователя
                            else {
                                const textArea = clone.querySelector('textarea');
                                if (textArea) {
                                    cleanText = textArea.value || textArea.innerText;
                                } else {
                                    // Попытка 3: Просто берем очищенный текст клона
                                    cleanText = clone.innerText;
                                }
                            }

                            // 5. Финальная зачистка
                            cleanText = cleanText
                                .replace(/^more_vert$/gm, '') // Убираем остатки меню
                                .replace(/^edit$/gm, '')
                                .replace(/^User$/gm, '')      // Убираем лейблы
                                .replace(/^Model$/gm, '')
                                .trim();

                            if (cleanText.length > 0) {
                                capturedData.set(turnId, { role, text: cleanText });
                                addedThisCycle++;
                            }
                        }
                    });

                    if (addedThisCycle > 0) {
                        noNewDataCount = 0;
                        btn.innerText = `SAVED: ${capturedData.size}`;
                    } else {
                        noNewDataCount++;
                    }

                    // Логика остановки
                    if (Math.ceil(targetDiv.scrollTop + targetDiv.clientHeight) >= targetDiv.scrollHeight) {
                        // Если мы внизу, даем пару попыток на подгрузку
                        if (noNewDataCount > 5) break;
                    }

                    targetDiv.scrollBy(0, scrollStep);
                    await delay(300);
                }

                // 3. Формирование
                let output = [];
                for (let [id, data] of capturedData) {
                    output.push(`### ${data.role} ###\n${data.text}`);
                }
                formattedOutput = output.join('\n\n' + '-'.repeat(30) + '\n\n');

                if (formattedOutput.length < 50) {
                    formattedOutput = "Ошибка: не удалось извлечь текст. Возможно, изменилась верстка сайта.";
                }

                isFinished = true;
                btn.disabled = false;
                btn.innerText = `DONE! COPY (${formattedOutput.length})`;
                btn.style.backgroundColor = '#9c27b0';
                btn.style.transform = 'scale(1.1)';

            } catch (e) {
                console.error(e);
                btn.innerText = 'ERROR';
                btn.style.backgroundColor = '#d93025';
                btn.disabled = false;
            }
        });
    }

    const observer = new MutationObserver((mutations) => {
        if (document.body && !document.getElementById('ai-studio-extract-btn')) {
            createButton();
        }
    });

    observer.observe(document, { childList: true, subtree: true });

})();