// ==UserScript==
// @name         cvat_shortcuts
// @namespace    http://tampermonkey.net/
// @version      1.08.4
// @description  CVAT Shorcuts
// @author       Megumin
// @match        http*://cvat:8080/*
// @match        http*://cvat-backup:8080/*
// @match        http://cvat.lastpassenger.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=honeycomb.vision
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553564/cvat_shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/553564/cvat_shortcuts.meta.js
// ==/UserScript==

(function () {
    const handleUrlChange = () => {
        if (window.location.href.includes("/tasks/") && window.location.href.includes("/jobs/")) {

            function waitForElement(selector, callback) {
                const observer = new MutationObserver(() => {
                    const element = document.querySelector(selector);
                    if (element) {
                        observer.disconnect();
                        callback(element);
                    }
                });

                observer.observe(document.body, {
                    childList: true,
                    subtree: true,
                });
            }

            // === ВІДКЛЮЧАЄМО ОБЕРТАННЯ БОКСІВ (rotation handle) ===

            function disableRotationHandles(root) {
                const handles = (root || document).querySelectorAll('circle.svg_select_points_rot');
                handles.forEach(h => {
                    h.style.pointerEvents = 'none';
                    h.style.cursor = 'default';
                    h.onmousedown = null;
                    h.onmousemove = null;
                    h.onmouseup = null;
                });
            }

            disableRotationHandles(document);

            const rotationObserver = new MutationObserver((mutations) => {
                for (const m of mutations) {
                    m.addedNodes.forEach(node => {
                        if (node.nodeType !== Node.ELEMENT_NODE) return;
                        if (node.matches && node.matches('circle.svg_select_points_rot')) {
                            disableRotationHandles(node);
                        } else {
                            disableRotationHandles(node);
                        }
                    });
                }
            });

            rotationObserver.observe(document.body, {
                childList: true,
                subtree: true,
            });

            function opacityToZero() {
                const slider = document.querySelector('.cvat-appearance-opacity-slider');
                if (!slider) return;
                const sliderHandle = slider.querySelector('.ant-slider-handle');
                if (!sliderHandle) return;
                sliderHandle.style.left = 0;

                const mouseDownEvent = new MouseEvent('mousedown', {
                    bubbles: true,
                    cancelable: true,
                    clientX: sliderHandle.getBoundingClientRect().left,
                    clientY: sliderHandle.getBoundingClientRect().top,
                });

                const mouseMoveEvent = new MouseEvent('mousemove', {
                    bubbles: true,
                    cancelable: true,
                    clientX: sliderHandle.getBoundingClientRect().left - 100,
                    clientY: sliderHandle.getBoundingClientRect().top,
                });

                const mouseUpEvent = new MouseEvent('mouseup', {
                    bubbles: true,
                    cancelable: true,
                    clientX: sliderHandle.getBoundingClientRect().left - 100,
                    clientY: sliderHandle.getBoundingClientRect().top,
                });

                sliderHandle.dispatchEvent(mouseDownEvent);
                sliderHandle.dispatchEvent(mouseMoveEvent);
                sliderHandle.dispatchEvent(mouseUpEvent);

                console.log(`Opacity slider -> 0`);

                const slider2 = document.querySelector('.cvat-appearance-selected-opacity-slider');
                if (!slider2) return;
                const sliderHandle2 = slider2.querySelector('.ant-slider-handle');
                if (!sliderHandle2) return;
                sliderHandle2.style.left = 0;

                const mouseDownEvent2 = new MouseEvent('mousedown', {
                    bubbles: true,
                    cancelable: true,
                    clientX: sliderHandle2.getBoundingClientRect().left,
                    clientY: sliderHandle2.getBoundingClientRect().top,
                });

                const mouseMoveEvent2 = new MouseEvent('mousemove', {
                    bubbles: true,
                    cancelable: true,
                    clientX: sliderHandle2.getBoundingClientRect().left - 100,
                    clientY: sliderHandle2.getBoundingClientRect().top,
                });

                const mouseUpEvent2 = new MouseEvent('mouseup', {
                    bubbles: true,
                    cancelable: true,
                    clientX: sliderHandle2.getBoundingClientRect().left - 100,
                    clientY: sliderHandle2.getBoundingClientRect().top,
                });

                sliderHandle2.dispatchEvent(mouseDownEvent2);
                sliderHandle2.dispatchEvent(mouseMoveEvent2);
                sliderHandle2.dispatchEvent(mouseUpEvent2);

                console.log(`Selected opacity slider -> 0`);
            }

            // === КНОПКА "?" + ВІКНО ЗІ ШОРТКАТАМИ ===

            function initShortcutsHelp(fullscreenButton) {
                if (!fullscreenButton) return;

                if (document.getElementById('cvat-shortcuts-help-button')) {
                    return;
                }

                const helpButton = document.createElement('button');
                helpButton.id = 'cvat-shortcuts-help-button';
                helpButton.type = 'button';
                helpButton.className = fullscreenButton.className || 'ant-btn ant-btn-link cvat-annotation-header-button';

                const iconSpan = document.createElement('span');
                iconSpan.textContent = '?';
                iconSpan.style.fontWeight = 'bold';
                iconSpan.style.fontSize = '18px';
                iconSpan.style.display = 'inline-flex';
                iconSpan.style.alignItems = 'center';
                iconSpan.style.justifyContent = 'center';
                iconSpan.style.width = '1em';
                iconSpan.style.height = '1em';

                const textSpan = document.createElement('span');
                textSpan.textContent = 'Help';
                textSpan.style.marginLeft = '4px';

                const hotkeyBadge = document.createElement('span');
                hotkeyBadge.textContent = 'F9';
                hotkeyBadge.style.marginLeft = '6px';
                hotkeyBadge.style.fontSize = '10px';
                hotkeyBadge.style.padding = '1px 4px';
                hotkeyBadge.style.borderRadius = '4px';
                hotkeyBadge.style.background = '#e6e6e6';
                hotkeyBadge.style.color = '#333';
                hotkeyBadge.style.border = '1px solid #ccc';
                hotkeyBadge.style.display = 'inline-block';
                hotkeyBadge.style.lineHeight = '12px';
                helpButton.appendChild(hotkeyBadge);
                helpButton.appendChild(textSpan);

                helpButton.style.marginRight = '4px';

                if (fullscreenButton.parentNode) {
                    fullscreenButton.parentNode.insertBefore(helpButton, fullscreenButton);
                }

                function openShortcutsModal() {
                    let modal = document.getElementById('cvat-shortcuts-help-modal');
                    if (modal) {
                        modal.style.display = 'flex';
                        return;
                    }

                    modal = document.createElement('div');
                    modal.id = 'cvat-shortcuts-help-modal';
                    modal.style.position = 'fixed';
                    modal.style.top = '0';
                    modal.style.left = '0';
                    modal.style.width = '100%';
                    modal.style.height = '100%';
                    modal.style.backgroundColor = 'rgba(0,0,0,0.6)';
                    modal.style.zIndex = '9999';
                    modal.style.display = 'flex';
                    modal.style.alignItems = 'center';
                    modal.style.justifyContent = 'center';

                    const content = document.createElement('div');
                    content.style.backgroundColor = 'white';
                    content.style.maxWidth = '900px';
                    content.style.width = '90%';
                    content.style.maxHeight = '80%';
                    content.style.overflowY = 'auto';
                    content.style.borderRadius = '8px';
                    content.style.padding = '20px 24px';
                    content.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
                    content.style.fontSize = '14px';
                    content.style.lineHeight = '1.5';

                    content.innerHTML = `
                        <h3 style="margin-top:0;margin-bottom:12px;">Гарячі клавіші користувацького скрипта CVAT</h3>
                        <p style="margin-bottom:8px;"><strong>Режим анотації (job / /tasks/:id/jobs/:id)</strong></p>
                        <ul style="padding-left:20px;margin-top:4px;margin-bottom:12px;">
                            <li><strong>Ctrl + Shift + S</strong> — відкрити сторінку task для поточного job і зберегти його ID в localStorage (для зміни статусу на сторінці tasks).</li>
                            <li><strong>Alt + W</strong> — перемикання режиму <em>Standard / Review</em> з автоматичним перевідкриттям вкладок Issues → Objects.</li>
                            <li><strong>F3</strong> — відкрити / закрити вікно <em>Info</em> (job info).</li>
                            <li><strong>F4</strong> — відкрити <em>Info</em>, скопіювати значення останньої колонки (OPF) у буфер обміну, закрити вікно.</li>
                            <li><strong>Alt + D</strong> — переключити прапорець <em>Destroyed</em> для активного об’єкта у sidebar.</li>
                            <li><strong>Alt + F</strong> — ввімкнути / вимкнути опцію <em>Outlined borders</em> в Appearance.</li>
                            <li><strong>Alt + I</strong> — циклічне перемикання режиму підсвітки: <em>Label → Instance → Group → Label</em>.</li>
                            <li><strong>Alt + S</strong> — показати розміри всіх видимих боксів; якщо бокс &lt; 10×10 — червоне "RBA".</li>
                            <li><strong>Alt + A</strong> — ввімкнути keyframe для всіх об’єктів.</li>
                            <li><strong>X</strong> — закрити всі бокси (якщо фокус не в полі вводу).</li>
                            <li><strong>Z</strong> — відкрити всі бокси (якщо фокус не в полі вводу).</li>
                            <li><strong>.</strong> або <strong>Alt + E</strong> — наступний кадр з issues.</li>
                            <li><strong>,</strong> або <strong>Alt + Q</strong> — попередній кадр з issues.</li>
                            <li><strong>/</strong> або <strong>Alt + R</strong> — приховати / показати issues.</li>
                            <li><strong>F8</strong> — OFF → &lt;10×10 → &lt;4×4 (size monitoring).</li>
                        </ul>
                            <li><strong>F1 — відкрити / закрити вікно Active list of shortcuts (CVAT).</li>

                        <p style="margin-bottom:8px;"><strong>Автоматична поведінка в режимі job</strong></p>
                        <ul style="padding-left:20px;margin-top:4px;margin-bottom:12px;">
                            <li>При відкритті job автоматично вмикається size monitoring у режимі &lt;10×10.</li>
                            <li>Маленькі бокси (менше порогу) підсвічуються попередженням <code>RBA</code>.</li>
                        </ul>
                    `;

                    const footer = document.createElement('div');
                    footer.style.display = 'flex';
                    footer.style.justifyContent = 'flex-end';
                    footer.style.marginTop = '16px';

                    const closeBtn = document.createElement('button');
                    closeBtn.type = 'button';
                    closeBtn.textContent = 'Close';
                    closeBtn.style.padding = '4px 12px';
                    closeBtn.style.borderRadius = '4px';
                    closeBtn.style.border = '1px solid #d9d9d9';
                    closeBtn.style.backgroundColor = '#fafafa';
                    closeBtn.style.cursor = 'pointer';
                    closeBtn.onclick = () => {
                        modal.style.display = 'none';
                    };

                    footer.appendChild(closeBtn);
                    content.appendChild(footer);

                    modal.appendChild(content);

                    modal.addEventListener('click', (e) => {
                        if (e.target === modal) {
                            modal.style.display = 'none';
                        }
                    });

                    document.addEventListener('keydown', function escHandler(ev) {
                        if (ev.key === 'Escape') {
                            if (modal.style.display !== 'none') {
                                modal.style.display = 'none';
                            }
                        }
                    });

                    document.body.appendChild(modal);
                }

                helpButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    openShortcutsModal();
                });

                // === HOTKEY FOR HELP WINDOW (F9) ===
                document.addEventListener('keydown', function(e) {
                    if (e.key === 'F9') {
                        e.preventDefault();

                        let modal = document.getElementById('cvat-shortcuts-help-modal');

                        if (!modal) {
                            const helpBtn = document.getElementById('cvat-shortcuts-help-button');
                            if (helpBtn) helpBtn.click();
                            return;
                        }

                        if (modal.style.display === 'none' || modal.style.display === '') {
                            modal.style.display = 'flex';
                        } else {
                            modal.style.display = 'none';
                        }
                    }
                });
            }

            // === ЛОКАЛЬНІ RESET ДЛЯ IMAGE GRID ===

            // Дефолтні значення
            const IMAGE_GRID_DEFAULTS = {
                Brightness: 100,
                Contrast: 100,
                Saturation: 100,
                Gamma: 1,
            };

            // Встановлює значення слайдера і тригерить React onChange
            function setSliderValue(sliderEl, targetValue) {
                if (!sliderEl) return;

                const handle = sliderEl.querySelector('.ant-slider-handle');
                const track = sliderEl.querySelector('.ant-slider-track');
                if (!handle || !track) return;

                const min = Number(handle.getAttribute('aria-valuemin')) || 0;
                const max = Number(handle.getAttribute('aria-valuemax')) || 100;

                // обчислюємо % позиції
                const ratio = (targetValue - min) / (max - min);
                const percent = Math.min(100, Math.max(0, ratio * 100));

                // оновлюємо DOM
                handle.setAttribute('aria-valuenow', String(targetValue));
                handle.style.left = percent + '%';
                track.style.left = '0%';
                track.style.width = percent + '%';

                // шукаємо справжній React onChange
                try {
                    const keys = Object.keys(sliderEl);

                    const fiberKey =
                          keys.find(k => k.startsWith('__reactFiber$')) ||
                          keys.find(k => k.startsWith('__reactInternalInstance$'));

                    let called = false;

                    if (fiberKey) {
                        let fiber = sliderEl[fiberKey];
                        while (fiber && !called) {
                            const props = fiber.memoizedProps || fiber.pendingProps;
                            if (props && typeof props.onChange === 'function') {
                                props.onChange(targetValue);
                                called = true;
                                break;
                            }
                            fiber = fiber.return;
                        }
                    }

                    if (!called) {
                        const propsKey = keys.find(k => k.startsWith('__reactProps$'));
                        if (propsKey && sliderEl[propsKey] && typeof sliderEl[propsKey].onChange === 'function') {
                            sliderEl[propsKey].onChange(targetValue);
                            called = true;
                        }
                    }
                } catch (err) {
                    console.warn('React onChange error: ', err);
                }
            }
            // Створення кнопок Reset
            function addResetButtonForSlider(panel, labelText) {
                const label = Array.from(panel.querySelectorAll('span,div,label'))
                .find(el => el.textContent.trim() === labelText);
                if (!label) return;

                const row = label.closest('.ant-row') || label.closest('div');
                if (!row) return;

                let slider = row.querySelector('.ant-slider');
                if (!slider) {
                    const col = row.querySelector('.ant-col-12, .ant-col-18, .ant-col');
                    if (col) slider = col.querySelector('.ant-slider');
                }
                if (!slider) return;

                // Якщо кнопка вже є — не дублюємо
                if (row.querySelector('.cvat-image-grid-reset-btn-' + labelText)) return;

                const btn = document.createElement('button');
                btn.type = 'button';
                btn.textContent = 'Reset';
                btn.className = 'cvat-image-grid-reset-btn-' + labelText;
                btn.style.padding = '0 8px';
                btn.style.height = '20px';
                btn.style.fontSize = '11px';
                btn.style.cursor = 'pointer';
                btn.style.borderRadius = '3px';
                btn.style.border = '1px solid #d9d9d9';
                btn.style.backgroundColor = '#fafafa';
                btn.style.whiteSpace = 'nowrap';
                btn.style.marginLeft = '8px';

                btn.addEventListener('click', () => {
                    const def = IMAGE_GRID_DEFAULTS[labelText];
                    if (def != null) setSliderValue(slider, def);
                });

                const sliderContainer = slider.parentElement || row;
                const cs = getComputedStyle(sliderContainer);
                if (cs.display === 'block') {
                    sliderContainer.style.display = 'flex';
                    sliderContainer.style.alignItems = 'center';
                }

                slider.style.flex = '1 1 auto';
                slider.style.minWidth = '0';

                sliderContainer.appendChild(btn);
            }

            function initImageGridResets(root) {
                const panels = Array.from(root.querySelectorAll('.ant-popover, .ant-modal, .ant-dropdown, div'));
                const panel = panels.find(el =>
                                          el.textContent && el.textContent.includes('Image grid') &&
                                          (el.querySelector('.ant-slider') || el.textContent.includes('Brightness'))
                                         );
                if (!panel) return;

                addResetButtonForSlider(panel, 'Brightness');
                addResetButtonForSlider(panel, 'Contrast');
                addResetButtonForSlider(panel, 'Saturation');
                addResetButtonForSlider(panel, 'Gamma');
            }

            const imageGridObserver = new MutationObserver((mutations) => {
                for (const m of mutations) {
                    m.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            initImageGridResets(node);
                        }
                    });
                }
            });

            imageGridObserver.observe(document.body, {
                childList: true,
                subtree: true,
            });

            // На всяк випадок, якщо панель вже відкрита
            initImageGridResets(document);


            imageGridObserver.observe(document.body, {
                childList: true,
                subtree: true,
            });

            // Initialize
            (function () {
                console.log("Виконуюсь перед завантаженням");
                waitForElement('[data-node-key="issues"]', (element) => {
                    console.log('Елемент знайдено:', element);
                    element.click();
                    opacityToZero();

                    const objects = document.querySelector('[data-node-key="objects"]');
                    setTimeout(() => {
                        if (objects) {
                            objects.click();
                            console.log('Клік виконано');
                        }
                    }, 50);
                });

                waitForElement('.cvat-annotation-header-fullscreen-button', (fullscreenButton) => {
                    initShortcutsHelp(fullscreenButton);
                });

                // на випадок, якщо Image grid уже відкритий
                initImageGridResets(document);

                let size_monitoring = "off";
                size_monitoring = "small10";

                const autoMessage = document.createElement("span");
                autoMessage.id = "small-shape-message";
                autoMessage.textContent = "Size monitoring: Enabled (auto)";
                autoMessage.style.position = "fixed";
                autoMessage.style.left = "10px";
                autoMessage.style.top = "10px";
                autoMessage.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
                autoMessage.style.color = "white";
                autoMessage.style.fontSize = "100px";
                autoMessage.style.zIndex = "1000";
                autoMessage.style.borderRadius = "15px";
                autoMessage.style.padding = "20px 30px";
                document.body.appendChild(autoMessage);

                setTimeout(() => {
                    autoMessage.remove();
                }, 1500);

                function updateSizeMonitoringIndicator() {
                    let indicator = document.getElementById("size-monitoring-indicator");

                    const redoButton = document.querySelector('.cvat-annotation-header-redo-button');
                    if (!redoButton) {
                        setTimeout(updateSizeMonitoringIndicator, 500);
                        return;
                    }

                    if (!indicator) {
                        indicator = document.createElement("div");
                        indicator.id = "size-monitoring-indicator";
                        indicator.style.position = "absolute";
                        indicator.style.fontSize = "14px";
                        indicator.style.fontWeight = "bold";
                        indicator.style.zIndex = "2000";
                        indicator.style.background = "rgba(0, 0, 0, 0.6)";
                        indicator.style.color = "white";
                        indicator.style.padding = "3px 8px";
                        indicator.style.borderRadius = "6px";
                        indicator.style.pointerEvents = "none";
                        document.body.appendChild(indicator);
                    }

                    const rect = redoButton.getBoundingClientRect();
                    indicator.style.top = `${rect.top + window.scrollY + 4}px`;
                    indicator.style.left = `${rect.right + window.scrollX + 8}px`;

                    if (size_monitoring === "off") {
                        indicator.textContent = "OFF";
                        indicator.style.color = "#ccc";
                    } else if (size_monitoring === "small10") {
                        indicator.textContent = "10×10";
                        indicator.style.color = "red";
                    } else if (size_monitoring === "small4") {
                        indicator.textContent = "4×4";
                        indicator.style.color = "lime";
                    }

                    if (!window.__sizeMonitoringResizeHandler) {
                        window.__sizeMonitoringResizeHandler = () => {
                            const rect = redoButton.getBoundingClientRect();
                            indicator.style.top = `${rect.top + window.scrollY + 4}px`;
                            indicator.style.left = `${rect.right + window.scrollX + 8}px`;
                        };
                        window.addEventListener("resize", window.__sizeMonitoringResizeHandler);
                    }
                }

                document.addEventListener("keydown", (event) => {
                    if (event.key === "F8") {
                        updateSizeMonitoringIndicator();
                    }
                });

                updateSizeMonitoringIndicator();

                const toggleMonitoring = (event) => {
                    if (event.key === "F8") {
                        if (size_monitoring === "off") {
                            size_monitoring = "small10";
                        } else if (size_monitoring === "small10") {
                            size_monitoring = "small4";
                        } else {
                            size_monitoring = "off";
                        }

                        updateSizeMonitoringIndicator();

                        const addedText = document.createElement("span");
                        addedText.id = "small-shape-message";
                        let modeText =
                            size_monitoring === "off"
                                ? "Disabled"
                                : size_monitoring === "small10"
                                    ? "<10x10"
                                    : "<4x4";

                        addedText.textContent = `Size monitoring: ${modeText}`;
                        addedText.style.position = "fixed";
                        addedText.style.left = "10px";
                        addedText.style.top = "10px";
                        addedText.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
                        addedText.style.color = "white";
                        addedText.style.fontSize = "120px";
                        addedText.style.zIndex = "1000";
                        document.body.appendChild(addedText);

                        setTimeout(() => {
                            addedText.remove();
                        }, 1500);
                    }
                };

                document.addEventListener("keydown", toggleMonitoring);

                if (!window.location.href.includes("lastpassenger")) {
                    const observer = new MutationObserver(() => {
                        if (size_monitoring === "off") return;

                        const shapes = document.querySelectorAll(".cvat_canvas_shape:not(.cvat_canvas_hidden)");

                        let foundSmallShape = false;
                        let messageContent = "";

                        shapes.forEach((shape) => {
                            const currentWidth = Math.round(parseFloat(shape.getAttribute("width")) || 0);
                            const currentHeight = Math.round(parseFloat(shape.getAttribute("height")) || 0);

                            if (
                                (size_monitoring === "small10" && (currentWidth < 10 || currentHeight < 10)) ||
                                (size_monitoring === "small4" && (currentWidth < 4 || currentHeight < 4))
                            ) {
                                foundSmallShape = true;
                                messageContent = `${currentWidth} x ${currentHeight} --- RBA!!!`;
                            }
                        });

                        if (foundSmallShape) {
                            let existingMessage = document.getElementById("small-shape-message");
                            if (!existingMessage) {
                                const addedText = document.createElement("span");
                                addedText.id = "small-shape-message";
                                addedText.textContent = messageContent;
                                addedText.style.position = "fixed";
                                addedText.style.left = "10px";
                                addedText.style.top = "10px";
                                addedText.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
                                addedText.style.color = "red";
                                addedText.style.fontSize = "120px";
                                addedText.style.zIndex = "1000";
                                document.body.appendChild(addedText);

                                setTimeout(() => {
                                    addedText.remove();
                                }, 500);
                            }
                        }
                    });

                    observer.observe(document.body, { childList: true, subtree: true });
                }
            })();

            // ========= KEYBOARD SHORTCUTS (JOB PAGE) =========

            document.addEventListener("keydown", function(e) {
                // Open task
                if (e.ctrlKey && e.shiftKey && e.code === "KeyS") {
                    e.preventDefault();

                    const currentUrl = window.location.href;
                    const newUrl = currentUrl.split('/jobs')[0];
                    const job_id = currentUrl.split('/jobs/')[1];
                    console.log(job_id);
                    localStorage.setItem('job_id', job_id);
                    window.location.href = newUrl;
                }

                // Change mode Standart and Review
                if (e.altKey && e.code === "KeyW") {
                    e.preventDefault();
                    const selectorDiv = document.querySelector(".ant-select-selector");
                    if (selectorDiv) {
                        const mouseDownEvent = new MouseEvent('mousedown', { bubbles: true });
                        selectorDiv.dispatchEvent(mouseDownEvent);

                        setTimeout(() => {
                            const currentOption = selectorDiv.innerText ? selectorDiv.innerText.trim() : "";
                            const targetOptionText = currentOption === "Review" ? "Standard" : "Review";
                            const targetOption = Array.from(document.querySelectorAll(".ant-select-item-option")).find(option => option.innerText.trim() === targetOptionText);
                            if (!targetOption) return;

                            setTimeout(() => {
                                const issues = document.querySelector('[data-node-key="issues"]');
                                if (issues) {
                                    issues.click();
                                    setTimeout(() => {
                                        const objects = document.querySelector('[data-node-key="objects"]');
                                        if (objects) {
                                            objects.click();
                                            console.log('Клік виконано');
                                        }
                                    }, 50);
                                }
                            }, 50);
                            targetOption.click();
                        }, 50);
                    }
                }

                // INFO
                if (e.key === "F3") {
                    e.preventDefault();
                    const button = document.querySelector(".cvat-annotation-header-info-button");
                    const panel = document.querySelector(".ant-modal-mask");

                    if (panel) {
                        const ok = Array.from(document.querySelectorAll("button"))
                            .find(btn => btn.innerText.trim() === "OK");
                        if (ok) ok.click();
                    } else if (button) {
                        button.click();
                    }
                }

                // COPY OPF
                if (e.key === "F4") {
                    const button = document.querySelector(".cvat-annotation-header-info-button");
                    if (!button) return;
                    button.click();

                    setTimeout(() => {
                        const tableBody = document.querySelector(".ant-table-tbody");
                        if (!tableBody) return;

                        const cells = tableBody.querySelectorAll(".ant-table-cell.ant-table-cell-fix-right");
                        if (!cells.length) return;
                        const lastCell = cells[cells.length - 1];

                        const copyToClipboard = (text) => {
                            const textarea = document.createElement('textarea');
                            textarea.value = text;
                            document.body.appendChild(textarea);
                            textarea.select();
                            try {
                                document.execCommand('copy');
                                console.log('Значення скопійовано в буфер обміну:', text);
                            } catch (err) {
                                console.error('Не вдалося скопіювати текст в буфер обміну:', err);
                            }
                            document.body.removeChild(textarea);
                        };

                        const cellValue = lastCell.innerText;
                        copyToClipboard(cellValue);
                        const ok = Array.from(document.querySelectorAll("button"))
                            .find(btn => btn.innerText.trim() === "OK");
                        if (ok) ok.click();
                    }, 400);
                }

                // DESTROYED
                if (e.altKey && e.code === "KeyD") {
                    e.preventDefault();
                    const active_shape = document.querySelector(".cvat-objects-sidebar-state-active-item");
                    if (!active_shape) return;
                    const flag = active_shape.querySelector(".ant-collapse-item-active");

                    if (!flag) {
                        const collapse = active_shape.querySelector(".ant-collapse-header");
                        if (!collapse) return;
                        collapse.click();
                        setTimeout(() => {
                            const destroyed = active_shape.querySelector(".ant-checkbox-input");
                            if (destroyed) destroyed.click();
                        }, 100);
                    } else {
                        const destroyed = active_shape.querySelector(".ant-checkbox-input");
                        if (destroyed) destroyed.click();
                    }

                }
                // Toggle "Outlined borders" (Alt + F)
                if (e.altKey && e.code === "KeyF") {
                    e.preventDefault();
                    const outlinedBorders = Array.from(
                        document.querySelectorAll('.cvat-objects-appearance-content .ant-checkbox-wrapper')
                    ).find(el => el.textContent.includes('Outlined borders'));

                    if (outlinedBorders) {
                        outlinedBorders.click();
                        console.log("Outlined borders toggled");
                    } else {
                        console.log("Outlined borders checkbox not found");
                    }
                }
                // Cycle between "Label" → "Instance" → "Group" (Alt + I)
                if (e.altKey && e.code === "KeyI") {
                    e.preventDefault();
                    const radios = Array.from(document.querySelectorAll('.ant-radio-button-wrapper'));
                    const labelRadio = radios.find(el => el.textContent.trim() === 'Label');
                    const instanceRadio = radios.find(el => el.textContent.trim() === 'Instance');
                    const groupRadio = radios.find(el => el.textContent.trim() === 'Group');

                    if (!labelRadio || !instanceRadio || !groupRadio) {
                        console.log("One or more radio buttons not found");
                        return;
                    }

                    const isLabelActive = labelRadio.classList.contains('ant-radio-button-wrapper-checked');
                    const isInstanceActive = instanceRadio.classList.contains('ant-radio-button-wrapper-checked');
                    const isGroupActive = groupRadio.classList.contains('ant-radio-button-wrapper-checked');

                    if (isLabelActive) {
                        instanceRadio.click();
                        console.log("Switched to Instance");
                    } else if (isInstanceActive) {
                        groupRadio.click();
                        console.log("Switched to Group");
                    } else if (isGroupActive) {
                        labelRadio.click();
                        console.log("Switched to Label");
                    } else {
                        labelRadio.click();
                        console.log("Switched to Label (default)");
                    }
                }
                // Box Size
                if (e.altKey && e.code === "KeyS") {
                    e.preventDefault();

                    const shapes = document.querySelectorAll(".cvat_canvas_shape:not(.cvat_canvas_hidden)");

                    shapes.forEach((shape) => {
                        const currentWidth = Math.round(parseFloat(shape.getAttribute("width")) || 0);
                        const currentHeight = Math.round(parseFloat(shape.getAttribute("height")) || 0);

                        const addedText = document.createElement("span");
                        addedText.textContent = ` ${currentWidth} x ${currentHeight}`;
                        addedText.style.position = "absolute";
                        const rect = shape.getBoundingClientRect();
                        addedText.style.left = `${rect.left + window.scrollX}px`;
                        addedText.style.top = `${rect.top + window.scrollY}px`;
                        addedText.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
                        addedText.style.color = "white";
                        addedText.style.fontSize = "22px";
                        if (currentWidth < 10 || currentHeight < 10) {
                            addedText.style.color = "red";
                            addedText.style.fontSize = "32px";
                            addedText.textContent += ' RBA';
                        }

                        document.body.appendChild(addedText);

                        setTimeout(() => {
                            addedText.remove();
                        }, 500);
                    });
                }

                // Keyframe on all boxes
                if (e.altKey && e.code === "KeyA") {
                    e.preventDefault();
                    const icons = document.querySelectorAll(".cvat-object-item-button-keyframe:not(.cvat-object-item-button-keyframe-enabled)");
                    console.log("fine");
                    icons.forEach(icon => {
                        icon.click();
                        console.log("click");
                    });
                }

                // Close all boxes
                if (e.code === "KeyX" && e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA") {
                    e.preventDefault();
                    const icons = document.querySelectorAll(".anticon-select");

                    icons.forEach(icon => {
                        icon.click();
                    });
                }

                // Open all boxes
                if (e.code === "KeyZ" && !e.ctrlKey && e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA") {
                    e.preventDefault();
                    const icons = document.querySelectorAll(".cvat-object-item-button-outside-enabled");

                    icons.forEach(icon => {
                        icon.click();
                    });
                }

                // Next issues
                if ((e.code === "Period" && e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA") || (e.altKey && e.code === "KeyE" && e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA")) {
                    e.preventDefault();
                    const next_issues = document.querySelector(".cvat-issues-sidebar-next-frame");
                    if (next_issues) next_issues.click();
                }

                // Previous issues
                if ((e.code === "Comma" && e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA") || (e.altKey && e.code === "KeyQ" && e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA")) {
                    e.preventDefault();
                    const previous_issues = document.querySelector(".cvat-issues-sidebar-previous-frame");
                    if (previous_issues) previous_issues.click();
                }

                // Hide/Unhide issues
                if ((e.code === "Slash" && e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA") || (e.altKey && e.code === "KeyR" && e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA")) {
                    e.preventDefault();

                    const hide_button = document.querySelector(".cvat-issues-sidebar-shown-issues");
                    const unhide_button = document.querySelector(".cvat-issues-sidebar-hidden-issues");
                    if (hide_button) {
                        hide_button.click();
                    } else if (unhide_button) {
                        unhide_button.click();
                    }
                }
            });

        } else if (window.location.href.includes("/tasks/") && !window.location.href.includes("/jobs/")) {

            document.addEventListener("keydown", function(e) {
                if ((e.altKey && e.code === "KeyS") || (e.altKey && e.code === "KeyA")) {
                    const stage_text = 'acceptance';
                    let state_text = 'completed';
                    if (e.altKey && e.code === "KeyA") {
                        state_text = 'rejected';
                    }
                    e.preventDefault();
                    let stage = document.querySelector(".cvat-job-item-stage");
                    let state = document.querySelector(".cvat-job-item-state");

                    const job_id = localStorage.getItem('job_id');
                    console.log(job_id);
                    if (job_id) {
                        const job = document.querySelector(`div[data-row-id="${job_id}"]`);
                        if (job) {
                            stage = job.querySelector(".cvat-job-item-stage") || stage;
                            state = job.querySelector(".cvat-job-item-state") || state;
                        }
                    }

                    if (!stage || !state) return;

                    const stageSelector = stage.querySelector(".ant-select-selector");
                    if (stageSelector) {
                        const mouseDownEvent = new MouseEvent('mousedown', { bubbles: true });
                        stageSelector.dispatchEvent(mouseDownEvent);

                        setTimeout(() => {
                            const targetOption = Array.from(document.querySelectorAll(".ant-select-item-option")).find(option => option.innerText.trim() === stage_text);
                            if (targetOption) targetOption.click();
                        }, 50);
                    }

                    setTimeout(() => {
                        const stateSelector = state.querySelector(".ant-select-selector");
                        if (stateSelector) {
                            const mouseDownEvent = new MouseEvent('mousedown', { bubbles: true });
                            stateSelector.dispatchEvent(mouseDownEvent);

                            setTimeout(() => {
                                const targetOption = Array.from(document.querySelectorAll(".ant-select-item-option")).find(option => option.innerText.trim() === state_text);
                                if (targetOption) targetOption.click();
                            }, 50);

                        }
                    }, 800);
                }
            });
        }
    };

    let lastUrl = window.location.href;
    setInterval(() => {
        const currentUrl = window.location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            handleUrlChange();
        }
    }, 1000);

    handleUrlChange();
})();
