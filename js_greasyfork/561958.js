// ==UserScript==
// @name        TTG Bestiary FIX with Navigation
// @namespace   http://tampermonkey.net/
// @version     3.7
// @description Фикс интерфейса бестиария TTG
// @match       https://new.ttg.club/bestiary
// @author      Kogal
// @license     MIT
// @run-at      document-end
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/561958/TTG%20Bestiary%20FIX%20with%20Navigation.user.js
// @updateURL https://update.greasyfork.org/scripts/561958/TTG%20Bestiary%20FIX%20with%20Navigation.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if (document.body.classList.contains('ttg-dual-mode')) return;
    document.body.classList.add('ttg-dual-mode');

    // === КОНФИГУРАЦИЯ ===
    const BG_LEFT = '#0b0e1a';
    const BG_RIGHT = '#080a12';
    const SPLITTER_WIDTH = 6;
    const STORAGE_KEY = 'ttg_bestiary_split_pos';

    let currentLeftWidth = parseFloat(localStorage.getItem(STORAGE_KEY)) || 40;
    let filterObserver = null;

    const waitForContent = () => {
        const searchContainer = document.querySelector(
            '#ttg-club > div.ttg-app > div.min-h-dvh.w-full > div > div.sticky.top-0.left-0.z-1.shrink-0.border-default.backdrop-blur-lg.lg\\:hidden-scrollbar.lg\\:h-dvh.lg\\:border-r.lg\\:backdrop-blur-none > div > div'
        );
        const cardsContainer = document.querySelector(
            '#ttg-club > div.ttg-app > div.min-h-dvh.w-full > div > div.flex.min-h-dvh.flex-auto.flex-col.gap-4.px-4.pb-8.lg\\:pt-4 > div'
        );

        if (!searchContainer || !cardsContainer) {
            setTimeout(waitForContent, 300);
            return;
        }

        // 1. Левая панель
        const leftPanel = document.createElement('div');
        leftPanel.id = 'ttg-search-left';
        Object.assign(leftPanel.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: `${currentLeftWidth}%`,
            height: '100vh',
            background: BG_LEFT,
            overflowY: 'auto',
            padding: '20px',
            boxSizing: 'border-box',
            borderRight: '1px solid rgba(100, 120, 180, 0.25)',
            zIndex: '9000',
            color: '#e0e0ff'
        });

        leftPanel.appendChild(searchContainer);
        leftPanel.appendChild(cardsContainer);
        document.body.appendChild(leftPanel);

        // 1.1. Добавляем кнопку навигации
        setTimeout(() => addNavigationButton(leftPanel), 2000);

        // 2. Правая панель
        const rightPanel = document.createElement('div');
        rightPanel.id = 'ttg-monster-right';
        Object.assign(rightPanel.style, {
            position: 'fixed',
            top: '0',
            right: '0',
            width: `${100 - currentLeftWidth}%`,
            height: '100vh',
            background: BG_RIGHT,
            overflowY: 'hidden',
            zIndex: '9001',
            color: '#d0d0f0'
        });

        const placeholder = document.createElement('div');
        placeholder.innerHTML = '🔍 Выберите монстра<br><small style="color:#7788aa">Кликните по карточке слева</small>';
        placeholder.style.cssText = `
            color: #7788aa;
            text-align: center;
            position: absolute;
            top: 50%;
            left: 0;
            right: 0;
            transform: translateY(-50%);
            font-size: 18px;
            pointer-events: none;
        `;
        rightPanel.appendChild(placeholder);
        document.body.appendChild(rightPanel);

        // 3. Разделитель
        const splitter = document.createElement('div');
        splitter.id = 'ttg-splitter';
        splitter.style.cssText = `
            position: fixed;
            top: 0;
            left: ${currentLeftWidth}%;
            width: ${SPLITTER_WIDTH}px;
            height: 100vh;
            background: transparent;
            z-index: 9005;
            cursor: col-resize;
            transition: background 0.2s;
            margin-left: -${SPLITTER_WIDTH / 2}px;
        `;

        const splitterLine = document.createElement('div');
        splitterLine.style.cssText = `
            width: 2px;
            height: 100%;
            background: rgba(100, 120, 180, 0.3);
            margin: 0 auto;
        `;
        splitter.appendChild(splitterLine);

        splitter.addEventListener('mouseenter', () => {
            splitterLine.style.background = '#4a9eff';
        });
        splitter.addEventListener('mouseleave', () => {
            if (!isDragging) splitterLine.style.background = 'rgba(100, 120, 180, 0.3)';
        });
        document.body.appendChild(splitter);

        // 4. Логика перетаскивания
        let isDragging = false;
        splitter.addEventListener('mousedown', (e) => {
            isDragging = true;
            document.body.style.cursor = 'col-resize';
            splitterLine.style.background = '#4a9eff';
            document.querySelectorAll('iframe').forEach(i => i.style.pointerEvents = 'none');
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            let newLeftWidth = (e.clientX / window.innerWidth) * 100;
            if (newLeftWidth < 20) newLeftWidth = 20;
            if (newLeftWidth > 80) newLeftWidth = 80;

            currentLeftWidth = newLeftWidth;
            leftPanel.style.width = `${currentLeftWidth}%`;
            rightPanel.style.width = `${100 - currentLeftWidth}%`;
            splitter.style.left = `${currentLeftWidth}%`;
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                document.body.style.cursor = 'default';
                splitterLine.style.background = 'rgba(100, 120, 180, 0.3)';
                document.querySelectorAll('iframe').forEach(i => i.style.pointerEvents = 'auto');
                localStorage.setItem(STORAGE_KEY, currentLeftWidth);
            }
        });

        // 5. Обработчик ссылок
        document.addEventListener('click', (e) => {
            const monsterLink = e.target.closest('a[href^="/bestiary/"]');
            if (monsterLink && monsterLink.href !== 'https://new.ttg.club/bestiary') {
                e.preventDefault();
                e.stopPropagation();
                loadMonster(monsterLink.href);
            }
        }, true);

        // 6. Запускаем систему фильтров
        startFilterMonitoring(leftPanel);

        // 7. Стили
        document.body.style.margin = '0';
        document.body.style.overflow = 'hidden';
        addFilterGlobalStyles();
        addNavigationStyles();
    };

// === КНОПКА НАВИГАЦИИ ===
function addNavigationButton(leftPanel) {
    const navButton = document.createElement('button');
    navButton.innerHTML = '☰ Навигация';
    navButton.style.cssText = `
        position: sticky;
        top: 0;
        z-index: 20;
        background: rgba(30, 40, 80, 0.8);
        border: 1px solid rgba(80, 100, 180, 0.4);
        border-radius: 6px;
        padding: 8px 12px;
        margin-bottom: 15px;
        cursor: pointer;
        color: #a0b0ff;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        backdrop-filter: blur(10px);
        transition: all 0.2s ease;
        width: 100%;
        font-size: 14px;
        font-weight: 500;
    `;

    navButton.addEventListener('mouseenter', () => {
        navButton.style.background = 'rgba(40, 50, 100, 0.9)';
        navButton.style.borderColor = 'rgba(100, 140, 255, 0.6)';
        navButton.style.transform = 'translateY(-1px)';
    });

    navButton.addEventListener('mouseleave', () => {
        navButton.style.background = 'rgba(30, 40, 80, 0.8)';
        navButton.style.borderColor = 'rgba(80, 100, 180, 0.4)';
        navButton.style.transform = 'translateY(0)';
    });

    navButton.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();

        // Закрываем предыдущее меню если открыто
        closeNavigation();

        // Создаем минималистичное меню
        createMinimalNavigationMenu(navButton);
    });

    // Вставляем кнопку в самое начало левой панели
    leftPanel.insertBefore(navButton, leftPanel.firstChild);

    // ===== СОЗДАНИЕ МИНИМАЛИСТИЧНОГО МЕНЮ =====

    function createMinimalNavigationMenu(navButton) {
        const buttonRect = navButton.getBoundingClientRect();
        const viewportWidth = window.innerWidth;

        // Позиционируем (с проверкой на выход за границы)
        let left = buttonRect.left;
        let top = buttonRect.bottom + 10;

        // Ширина меню (4 колонки с правильными отступами)
        const menuWidth = 640; // Немного увеличил для нормальных отступов

        if (left + menuWidth > viewportWidth) {
            left = viewportWidth - menuWidth - 10;
        }
        if (left < 10) left = 10;

        // Создаем контейнер меню
        const menu = document.createElement('div');
        menu.id = 'ttg-minimal-nav';
        menu.className = 'ttg-minimal-nav';

        // Основные стили - минимализм
        menu.style.cssText = `
            position: fixed;
            top: ${top}px;
            left: ${left}px;
            width: ${menuWidth}px;
            background: rgba(15, 20, 40, 0.98);
            border: 1px solid rgba(70, 90, 170, 0.4);
            border-radius: 8px;
            padding: 20px;
            z-index: 10000;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(15px);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
            color: #e0e8ff;
            box-sizing: border-box;
        `;

        // Содержимое меню - 4 колонки в строку с правильными отступами
        menu.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; gap: 15px;">
                <!-- Колонка 1: Персонаж -->
                <div style="flex: 1; min-width: 0;">
                    <div style="font-size: 13px; font-weight: 600; color: #8a9bff; margin-bottom: 10px; letter-spacing: 0.5px; white-space: nowrap;">
                        Персонаж
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 6px;">
                        <a href="https://new.ttg.club/classes" style="color: #c3d0ff; text-decoration: none; font-size: 13px; padding: 3px 0; transition: color 0.2s; white-space: nowrap;">Классы</a>
                        <a href="https://new.ttg.club/species" style="color: #c3d0ff; text-decoration: none; font-size: 13px; padding: 3px 0; transition: color 0.2s; white-space: nowrap;">Виды</a>
                        <a href="https://new.ttg.club/feats" style="color: #c3d0ff; text-decoration: none; font-size: 13px; padding: 3px 0; transition: color 0.2s; white-space: nowrap;">Черты</a>
                        <a href="https://new.ttg.club/backgrounds" style="color: #c3d0ff; text-decoration: none; font-size: 13px; padding: 3px 0; transition: color 0.2s; white-space: nowrap;">Предыстории</a>
                        <a href="https://new.ttg.club/spells" style="color: #c3d0ff; text-decoration: none; font-size: 13px; padding: 3px 0; transition: color 0.2s; white-space: nowrap;">Заклинания</a>
                    </div>
                </div>

                <!-- Колонка 2: Предметы -->
                <div style="flex: 1; min-width: 0;">
                    <div style="font-size: 13px; font-weight: 600; color: #8a9bff; margin-bottom: 10px; letter-spacing: 0.5px; white-space: nowrap;">
                        Предметы
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 6px;">
                        <a href="https://new.ttg.club/spells" style="color: #c3d0ff; text-decoration: none; font-size: 13px; padding: 3px 0; transition: color 0.2s; white-space: nowrap;">Снаряжение</a>
                        <a href="https://new.ttg.club/magic-items" style="color: #c3d0ff; text-decoration: none; font-size: 13px; padding: 3px 0; transition: color 0.2s; white-space: nowrap;">Магические предметы</a>
                        <span style="color: #666; text-decoration: none; font-size: 13px; padding: 3px 0; cursor: default; white-space: nowrap;">Бастионы</span>
                    </div>
                </div>

                <!-- Колонка 3: Мастерская -->
                <div style="flex: 1; min-width: 0;">
                    <div style="font-size: 13px; font-weight: 600; color: #8a9bff; margin-bottom: 10px; letter-spacing: 0.5px; white-space: nowrap;">
                        Мастерская
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 6px;">
                        <a href="https://new.ttg.club/bestiary" style="color: #c3d0ff; text-decoration: none; font-size: 13px; padding: 3px 0; transition: color 0.2s; white-space: nowrap;">Бестиарий</a>
                        <a href="https://new.ttg.club/glossary" style="color: #c3d0ff; text-decoration: none; font-size: 13px; padding: 3px 0; transition: color 0.2s; white-space: nowrap;">Глоссарий</a>
                        <span style="color: #666; text-decoration: none; font-size: 13px; padding: 3px 0; cursor: default; white-space: nowrap;">Источники</span>
                    </div>
                </div>

                <!-- Колонка 4: Другое -->
                <div style="flex: 1; min-width: 0;">
                    <div style="font-size: 13px; font-weight: 600; color: #8a9bff; margin-bottom: 10px; letter-spacing: 0.5px; white-space: nowrap;">
                        Другое
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 6px;">
                        <a href="https://new.ttg.club/roadmap" style="color: #c3d0ff; text-decoration: none; font-size: 13px; padding: 3px 0; transition: color 0.2s; white-space: nowrap;">Дорожная карта</a>
                        <a href="https://5e14.ttg.club/" style="color: #c3d0ff; text-decoration: none; font-size: 13px; padding: 3px 0; transition: color 0.2s; white-space: nowrap;">Редакция D&D 2014</a>
                    </div>
                </div>
            </div>

            <!-- Крестик для закрытия -->
            <div style="position: absolute; top: 10px; right: 10px;">
                <button id="ttg-close-menu-btn" style="background: none; border: none; color: #8a9bff; cursor: pointer; font-size: 20px; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; border-radius: 4px; transition: all 0.2s; padding: 0; line-height: 1;">
                    ×
                </button>
            </div>
        `;

        // Добавляем hover-эффекты для ссылок
        setTimeout(() => {
            const links = menu.querySelectorAll('a');
            links.forEach(link => {
                link.addEventListener('mouseenter', () => {
                    link.style.color = '#ffffff';
                    link.style.textShadow = '0 0 8px rgba(138, 155, 255, 0.5)';
                });
                link.addEventListener('mouseleave', () => {
                    link.style.color = '#c3d0ff';
                    link.style.textShadow = 'none';
                });
            });

            // Hover для крестика
            const closeBtn = menu.querySelector('#ttg-close-menu-btn');
            if (closeBtn) {
                closeBtn.addEventListener('mouseenter', () => {
                    closeBtn.style.background = 'rgba(255, 70, 70, 0.2)';
                    closeBtn.style.color = '#ffa0a0';
                    closeBtn.style.transform = 'scale(1.1)';
                });
                closeBtn.addEventListener('mouseleave', () => {
                    closeBtn.style.background = 'none';
                    closeBtn.style.color = '#8a9bff';
                    closeBtn.style.transform = 'scale(1)';
                });

                // ВЕШАЕМ ПРАВИЛЬНЫЙ ОБРАБОТЧИК!
                closeBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    closeNavigation();
                });
            }
        }, 10);

        // Добавляем в DOM
        document.body.appendChild(menu);

        // Создаем оверлей
        createNavOverlay();
    }
}

// === СОЗДАНИЕ OVERLAY ДЛЯ НАВИГАЦИИ ===
function createNavOverlay() {
    const oldOverlay = document.getElementById('ttg-nav-overlay');
    if (oldOverlay) oldOverlay.remove();

    const overlay = document.createElement('div');
    overlay.id = 'ttg-nav-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.3);
        z-index: 9998;
        backdrop-filter: blur(2px);
    `;

    overlay.addEventListener('click', closeNavigation);
    document.body.appendChild(overlay);
}

// === ЗАКРЫТИЕ НАВИГАЦИИ ===
function closeNavigation() {
    console.log('Закрываем навигацию...');

    // Удаляем меню
    const menus = document.querySelectorAll('.ttg-minimal-nav, #ttg-minimal-nav');
    menus.forEach(menu => {
        menu.style.opacity = '0';
        menu.style.transform = 'translateY(-10px)';
        setTimeout(() => menu.remove(), 150);
    });

    // Убираем оверлей
    const overlay = document.getElementById('ttg-nav-overlay');
    if (overlay) {
        overlay.style.opacity = '0';
        setTimeout(() => overlay.remove(), 150);
    }
}

// Экспортируем closeNavigation для использования
if (typeof window !== 'undefined') {
    window.closeNavigation = closeNavigation;
}

    // === СИСТЕМА ФИЛЬТРОВ ===
    function startFilterMonitoring(leftPanel) {
        filterObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length) {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) {
                            checkForFilter(node, leftPanel);
                        }
                    });
                }
            });
        });

        filterObserver.observe(document.body, {
            childList: true,
            subtree: true
        });

        setTimeout(() => setupFilterButton(leftPanel), 1500);
    }

    function checkForFilter(element, leftPanel) {
        if (element.matches && element.matches('div[data-side="right"][role="dialog"]')) {
            positionFilter(element, leftPanel);
            return;
        }

        if (element.querySelectorAll) {
            const filter = element.querySelector('div[data-side="right"][role="dialog"]');
            if (filter) {
                positionFilter(filter, leftPanel);
            }
        }
    }

    function positionFilter(filterElement, leftPanel) {
        const filterButton = leftPanel.querySelector('div.flex.gap-2 > div > button');
        if (!filterButton) return;

        const buttonRect = filterButton.getBoundingClientRect();
        const top = buttonRect.bottom + 10;
        const left = buttonRect.left + (buttonRect.width / 2);

        filterElement.style.cssText = `
            position: fixed !important;
            top: ${top}px !important;
            left: ${left}px !important;
            transform: translateX(-50%) !important;
            width: 35vw !important;
            max-width: 400px !important;
            height: auto !important;
            max-height: 70vh !important;
            margin: 0 !important;
            border-radius: 8px !important;
            background: rgba(20, 30, 60, 0.98) !important;
            border: 1px solid rgba(80, 100, 180, 0.4) !important;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5) !important;
            animation: none !important;
            overflow: hidden !important;
            z-index: 9999 !important;
        `;

        filterElement.classList.remove('data-[state=open]:animate-[slide-in-from-right_200ms_ease-in-out]');
        filterElement.classList.remove('data-[state=closed]:animate-[slide-out-to-right_200ms_ease-in-out]');

        const body = filterElement.querySelector('[data-slot="body"]');
        if (body) {
            body.style.maxHeight = '50vh';
            body.style.overflowY = 'auto';
        }

        createOverlay();
        setupFilterButtons(filterElement, filterButton);
    }

    function createOverlay() {
        const oldOverlay = document.getElementById('ttg-filter-overlay');
        if (oldOverlay) oldOverlay.remove();

        const overlay = document.createElement('div');
        overlay.id = 'ttg-filter-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.5);
            z-index: 9998;
            backdrop-filter: blur(2px);
        `;

        overlay.onclick = () => closeFilter();
        document.body.appendChild(overlay);
    }

    // === ПОИСК КНОПКИ ПО ТЕКСТУ ===
    function findButtonByText(container, text) {
        const buttons = container.querySelectorAll('button');
        for (const button of buttons) {
            if (button.textContent && button.textContent.includes(text)) {
                return button;
            }
        }
        return null;
    }

    // === УДАЛЕНИЕ OVERLAY ===
    function removeOverlay() {
        const overlay = document.getElementById('ttg-filter-overlay');
        if (overlay) {
            overlay.remove();
        }
    }

    // === НАСТРОЙКА КНОПОК ФИЛЬТРА ===
    function setupFilterButtons(filterElement, filterButton) {
        // 1. Кнопка "Закрыть"
        const closeBtn = filterElement.querySelector('button[aria-label="Закрыть"]');
        if (closeBtn) {
            const originalClick = closeBtn.onclick;
            closeBtn.addEventListener('click', function(e) {
                removeOverlay();
                if (originalClick) originalClick.call(this, e);
            }, { once: true });
        }

        // 2. Кнопка "Применить"
        const applyBtn = findButtonByText(filterElement, 'Применить');
        if (applyBtn) {
            const originalApplyClick = applyBtn.onclick;
            applyBtn.addEventListener('click', function(e) {
                setTimeout(removeOverlay, 100);
                if (originalApplyClick) originalApplyClick.call(this, e);
            }, { once: true });
        }

        // 3. Кнопка "Сбросить"
        const resetBtn = findButtonByText(filterElement, 'Сбросить');
        if (resetBtn) {
            const originalResetClick = resetBtn.onclick;
            resetBtn.addEventListener('click', function(e) {
                setTimeout(removeOverlay, 100);
                if (originalResetClick) originalResetClick.call(this, e);
            }, { once: true });
        }

        // 4. Клик вне фильтра
        const closeOnOutsideClick = (e) => {
            const filter = document.querySelector('div[data-side="right"][role="dialog"]');
            if (!filter) return;

            if (!filter.contains(e.target) &&
                e.target !== filterButton &&
                !filterButton.contains(e.target)) {
                closeFilter();
                document.removeEventListener('click', closeOnOutsideClick);
            }
        };

        setTimeout(() => document.addEventListener('click', closeOnOutsideClick), 10);
    }

    // === ЗАКРЫТИЕ ФИЛЬТРА ===
    function closeFilter() {
        const filter = document.querySelector('div[data-side="right"][role="dialog"]');
        if (filter) {
            const closeBtn = filter.querySelector('button[aria-label="Закрыть"]');
            if (closeBtn) {
                closeBtn.click();
            }
            filter.style.cssText = '';
        }
        removeOverlay();
    }

    // === НАСТРОЙКА КНОПКИ ФИЛЬТРА ===
    function setupFilterButton(leftPanel) {
        const filterButton = leftPanel.querySelector('div.flex.gap-2 > div > button');
        if (!filterButton) return;

        const originalClick = filterButton.onclick;
        filterButton.addEventListener('click', function(e) {
            const existingFilter = document.querySelector('div[data-side="right"][role="dialog"]');
            if (existingFilter) {
                closeFilter();
                return;
            }

            if (originalClick) {
                originalClick.call(this, e);
            }
        }, true);
    }

    // === ГЛОБАЛЬНЫЕ СТИЛИ (ФИЛЬТР) ===
    function addFilterGlobalStyles() {
        const styleId = 'ttg-filter-global-css';
        if (document.getElementById(styleId)) return;

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            div[data-side="right"][role="dialog"] [data-slot="body"]::-webkit-scrollbar {
                width: 6px;
            }

            div[data-side="right"][role="dialog"] [data-slot="body"]::-webkit-scrollbar-track {
                background: rgba(20, 30, 60, 0.3);
            }

            div[data-side="right"][role="dialog"] [data-slot="body"]::-webkit-scrollbar-thumb {
                background: rgba(80, 100, 180, 0.5);
                border-radius: 3px;
            }

            div[data-side="right"][role="dialog"] span[data-slot="base"]:hover {
                background: rgba(80, 120, 255, 0.2) !important;
            }

            /* === ЗАКРЕПЛЕНИЕ ПОИСКА И ФИЛЬТРА В ЛЕВОЙ ПАНЕЛИ === */
            #ttg-search-left > div.flex.gap-2.lg\\:flex-col.lg\\:gap-4 {
                position: sticky !important;
                top: 50px !important;
                z-index: 15 !important;
                background: ${BG_LEFT} !important;
                padding: 15px 0 !important;
                margin-bottom: 15px !important;
                border-bottom: 1px solid rgba(100, 120, 180, 0.2) !important;
                backdrop-filter: blur(10px) !important;
            }

            /* Небольшая тень при скролле */
            #ttg-search-left > div.flex.gap-2.lg\\:flex-col.lg\\:gap-4::after {
                content: '';
                position: absolute;
                bottom: -1px;
                left: 0;
                right: 0;
                height: 1px;
                background: linear-gradient(to right, transparent, rgba(100, 120, 180, 0.3), transparent);
            }
        `;
        document.head.appendChild(style);
    }

    // === СТИЛИ ДЛЯ НАВИГАЦИИ ===
    function addNavigationStyles() {
        const styleId = 'ttg-nav-styles';
        if (document.getElementById(styleId)) return;

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            /* Стили для меню навигации */
            #ttg-search-left ~ div[role="dialog"],
            #ttg-search-left ~ aside,
            #ttg-search-left ~ [class*="sidebar"] {
                position: fixed !important;
                z-index: 9999 !important;
                background: rgba(20, 30, 60, 0.98) !important;
                border: 1px solid rgba(80, 100, 180, 0.4) !important;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5) !important;
                border-radius: 8px !important;
                overflow: hidden !important;
            }

            /* Стили для ссылок в меню */
            #ttg-search-left ~ div[role="dialog"] a,
            #ttg-search-left ~ aside a {
                color: #c0d0ff !important;
                padding: 10px 15px !important;
                display: block !important;
                text-decoration: none !important;
                border-radius: 4px !important;
                margin: 2px 0 !important;
                transition: background 0.2s !important;
            }

            #ttg-search-left ~ div[role="dialog"] a:hover,
            #ttg-search-left ~ aside a:hover {
                background: rgba(80, 120, 255, 0.2) !important;
            }

            /* Скроллбар для меню */
            #ttg-search-left ~ div[role="dialog"]::-webkit-scrollbar,
            #ttg-search-left ~ aside::-webkit-scrollbar {
                width: 6px;
            }

            #ttg-search-left ~ div[role="dialog"]::-webkit-scrollbar-track,
            #ttg-search-left ~ aside::-webkit-scrollbar-track {
                background: rgba(20, 30, 60, 0.3);
            }

            #ttg-search-left ~ div[role="dialog"]::-webkit-scrollbar-thumb,
            #ttg-search-left ~ aside::-webkit-scrollbar-thumb {
                background: rgba(80, 100, 180, 0.5);
                border-radius: 3px;
            }
        `;
        document.head.appendChild(style);
    }

    // === ЗАГРУЗКА ПРЕДЫСТОРИИ ===
    function loadMonster(url) {
        const panel = document.getElementById('ttg-monster-right');
        panel.innerHTML = '';

        const container = document.createElement('div');
        container.style.cssText = `
            width: 100%;
            height: 100%;
            position: relative;
            overflow: hidden;
        `;

        const loadingDiv = document.createElement('div');
        loadingDiv.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: ${BG_RIGHT};
            color: #7788aa;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10;
        `;
        loadingDiv.textContent = 'Загрузка предыстории...';
        container.appendChild(loadingDiv);

        const iframe = document.createElement('iframe');
        iframe.style.cssText = `
            width: 100%;
            height: 100%;
            border: none;
            background: ${BG_RIGHT};
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        iframe.src = url;
        container.appendChild(iframe);
        panel.appendChild(container);

        iframe.onload = () => {
            try {
                const doc = iframe.contentDocument || iframe.contentWindow.document;

                const waitForReady = (callback) => {
                    if (doc.readyState === 'complete') {
                        setTimeout(callback, 100);
                    } else {
                        iframe.contentWindow.addEventListener('load', () => {
                            setTimeout(callback, 100);
                        }, { once: true });
                    }
                };

                waitForReady(() => {
                    cleanupIframeContent(doc);
                    iframe.style.opacity = '1';
                    loadingDiv.style.opacity = '0';
                    loadingDiv.style.transition = 'opacity 0.3s ease';
                    setTimeout(() => {
                        loadingDiv.remove();
                        iframe.style.opacity = '1';
                    }, 300);
                });

            } catch (err) {
                loadingDiv.textContent = 'Ошибка загрузки (CORS?)';
                loadingDiv.style.color = '#ff8888';
            }
        };

        function cleanupIframeContent(doc) {
            try {
                const removeSelectors = [
                    'header', 'nav', 'footer',
                    '[class*="header"]', '[class*="navbar"]',
                    '[aria-label*="Close"]', 'button[aria-label*="close"]',
                    '[class*="back-button"]',
                    '.sticky', '.absolute',
                    'a[href="/backgrounds"]'
                ];

                removeSelectors.forEach(selector => {
                    try {
                        doc.querySelectorAll(selector).forEach(el => {
                            if (el.parentNode && !el.classList.contains('w-2xl')) {
                                el.parentNode.removeChild(el);
                            }
                        });
                    } catch (e) {}
                });

                const style = doc.createElement('style');
                style.id = 'ttg-cleanup-styles';
                style.textContent = `
                    * {
                        box-sizing: border-box !important;
                    }

                    body, html {
                        background: ${BG_RIGHT} !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        overflow-x: hidden !important;
                        color: #d0d0f0 !important;
                        font-size: 16px !important;
                    }

                    .container, [class*="container"], [class*="mx-auto"], main, article {
                        margin-left: 0 !important;
                        margin-right: 0 !important;
                        max-width: 100% !important;
                        width: 100% !important;
                        padding-left: 10px !important;
                        padding-right: 10px !important;
                    }

                    body {
                        zoom: 1.05;
                    }

                    ::-webkit-scrollbar {
                        width: 8px;
                    }

                    ::-webkit-scrollbar-track {
                        background: #080a12;
                    }

                    ::-webkit-scrollbar-thumb {
                        background: #334466;
                        border-radius: 4px;
                    }

                    [class*="fixed"]:not(.w-2xl),
                    [style*="position: fixed"]:not(.w-2xl),
                    [class*="sticky"] {
                        position: static !important;
                    }

                    body > div.fixed.w-2xl {
                        position: fixed !important;
                        z-index: 999999 !important;
                        display: flex !important;
                        background: #1a1a1a !important;
                        box-shadow: -5px 0 20px rgba(0,0,0,0.7) !important;
                    }

                    div.shrink-0.\\!bg-accented {
                        display: block !important;
                        opacity: 1 !important;
                    }

                    [class*="navigation"],
                    [role="navigation"] {
                        display: none !important;
                    }
                `;

                const oldStyle = doc.getElementById('ttg-cleanup-styles');
                if (oldStyle) oldStyle.remove();
                doc.head.appendChild(style);

                doc.body.style.backgroundColor = BG_RIGHT;
                doc.body.style.background = BG_RIGHT;

            } catch (err) {
                console.warn('Ошибка очистки iframe:', err);
            }
        }
    }

    // Запуск
    waitForContent();
})();