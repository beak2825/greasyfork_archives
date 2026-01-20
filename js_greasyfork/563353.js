// ==UserScript==
// @name         Shikimori Decimal Ratings
// @namespace    shikimori-decimal-ratings
// @version      5.0
// @description  Дробные оценки аниме (видны только вам)
// @author       Jesein
// @license      MIT
// @match        https://shikimori.one/*
// @match        https://shikimori.me/*
// @match        https://shikimori.org/*
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/563353/Shikimori%20Decimal%20Ratings.user.js
// @updateURL https://update.greasyfork.org/scripts/563353/Shikimori%20Decimal%20Ratings.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'shikimori_decimal_ratings';

    function loadRatings() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
        } catch {
            return {};
        }
    }

    function saveRatings(ratings) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(ratings));
    }

    GM_addStyle(`

        
        tr.user_rate td.name {
            position: relative;
        }
        
        .dr-edit-btn {
            position: absolute;
            right: 5px;
            top: 50%;
            transform: translateY(-50%);
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 18px;
            height: 18px;
            background: none;
            color: #333;
            font-size: 12px;
            cursor: pointer;
            opacity: 0.4;
            transition: all 0.2s;
        }
        .dr-edit-btn:hover {
            opacity: 1;
            transform: translateY(-50%) scale(1.2);
        }
        .dr-edit-btn.has-rating {
            opacity: 0.7;
        }
        
        .dr-popup {
            position: fixed;
            padding: 10px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            z-index: 99999;
            display: flex;
            gap: 6px;
            align-items: center;
        }
        .dr-input {
            width: 60px;
            padding: 4px 8px;
            border: 2px solid #667eea;
            border-radius: 6px;
            font-size: 14px;
            text-align: center;
            outline: none;
            color: #333;
            background: white;
        }
        .dr-input:focus {
            border-color: #764ba2;
        }
        .dr-input::placeholder {
            color: #999;
        }
        .dr-save-btn {
            padding: 4px 10px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 12px;
            cursor: pointer;
        }
        .dr-save-btn:hover {
            opacity: 0.85;
        }
        .dr-clear-btn {
            padding: 4px 8px;
            background: #e74c3c;
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 12px;
            cursor: pointer;
        }
        .dr-clear-btn:hover {
            opacity: 0.85;
        }
        
        .dr-page-badge {
            display: inline-flex;
            align-items: center;
            margin-left: 10px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .dr-page-badge:hover {
            transform: scale(1.05);
        }
        .dr-page-badge.empty {
            background: #888;
            opacity: 0.6;
        }
        .dr-page-badge.empty:hover {
            opacity: 1;
        }
        
        /* Плавающая кнопка управления */
        .dr-float-btn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 50%;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            z-index: 99998;
            transition: all 0.3s;
        }
        .dr-float-btn:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 20px rgba(0,0,0,0.4);
        }
        
        /* Меню управления */
        .dr-menu {
            position: fixed;
            bottom: 80px;
            right: 20px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.25);
            padding: 15px;
            min-width: 250px;
            z-index: 99999;
            opacity: 0;
            transform: translateY(10px);
            pointer-events: none;
            transition: all 0.3s;
        }
        .dr-menu.active {
            opacity: 1;
            transform: translateY(0);
            pointer-events: all;
        }
        .dr-menu-title {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 15px;
            color: #333;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .dr-menu-stats {
            background: #f5f5f5;
            padding: 10px;
            border-radius: 8px;
            margin-bottom: 15px;
            font-size: 14px;
            color: #666;
        }
        .dr-menu-btn {
            display: block;
            width: 100%;
            padding: 10px;
            margin-bottom: 8px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.2s;
        }
        .dr-menu-btn:hover {
            transform: translateX(2px);
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }
        .dr-menu-btn.danger {
            background: #e74c3c;
        }
        .dr-menu-btn:last-child {
            margin-bottom: 0;
        }
        
        /* Скрытый input для файла */
        .dr-file-input {
            display: none;
        }
        
        /* Уведомление */
        .dr-notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 100000;
            display: flex;
            align-items: center;
            gap: 10px;
            animation: dr-slide-in 0.3s ease;
        }
        .dr-notification.success {
            border-left: 4px solid #27ae60;
        }
        .dr-notification.error {
            border-left: 4px solid #e74c3c;
        }
        @keyframes dr-slide-in {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `);

    // Показать уведомление
    function showNotification(message, type = 'success') {
        const notif = document.createElement('div');
        notif.className = `dr-notification ${type}`;
        notif.textContent = message;
        document.body.appendChild(notif);
        
        setTimeout(() => {
            notif.style.animation = 'dr-slide-in 0.3s ease reverse';
            setTimeout(() => notif.remove(), 300);
        }, 3000);
    }

    // Экспорт в файл
    function exportRatings() {
        const ratings = loadRatings();
        const count = Object.keys(ratings).length;
        
        if (count === 0) {
            showNotification('Нет оценок для экспорта', 'error');
            return;
        }
        
        const data = JSON.stringify(ratings, null, 2);
        const blob = new Blob([data], {type: 'application/json'});
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `shikimori-ratings-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        
        showNotification(`Экспортировано оценок: ${count}`, 'success');
    }

    // Импорт из файла
    function importRatings() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.className = 'dr-file-input';
        
        input.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result);
                    saveRatings(data);
                    const count = Object.keys(data).length;
                    showNotification(`Импортировано оценок: ${count}`, 'success');
                    setTimeout(() => location.reload(), 1500);
                } catch (err) {
                    showNotification('Ошибка чтения файла', 'error');
                }
            };
            reader.readAsText(file);
        });
        
        input.click();
    }

    // Очистить все оценки
    function clearAllRatings() {
        if (!confirm('Удалить все дробные оценки?')) return;
        
        saveRatings({});
        showNotification('Все оценки удалены', 'success');
        setTimeout(() => location.reload(), 1000);
    }

    // Создать меню управления
    function createManagementUI() {
        const ratings = loadRatings();
        const count = Object.keys(ratings).length;
        
        // Плавающая кнопка
        const floatBtn = document.createElement('div');
        floatBtn.className = 'dr-float-btn';
        floatBtn.innerHTML = '★';
        floatBtn.title = 'Управление дробными оценками';
        
        // Меню
        const menu = document.createElement('div');
        menu.className = 'dr-menu';
        menu.innerHTML = `
            <div class="dr-menu-title">★ Дробные оценки</div>
            <div class="dr-menu-stats">
                Оценок сохранено: <strong>${count}</strong>
            </div>
            <button class="dr-menu-btn" data-action="export">📥 Экспорт в файл</button>
            <button class="dr-menu-btn" data-action="import">📤 Импорт из файла</button>
            <button class="dr-menu-btn danger" data-action="clear">🗑️ Очистить все</button>
        `;
        
        // Переключение меню
        floatBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            menu.classList.toggle('active');
        });
        
        // Закрытие при клике вне
        document.addEventListener('click', (e) => {
            if (!menu.contains(e.target) && e.target !== floatBtn) {
                menu.classList.remove('active');
            }
        });
        
        // Обработка кнопок меню
        menu.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-action]');
            if (!btn) return;
            
            const action = btn.dataset.action;
            if (action === 'export') exportRatings();
            if (action === 'import') importRatings();
            if (action === 'clear') clearAllRatings();
            
            menu.classList.remove('active');
        });
        
        document.body.appendChild(floatBtn);
        document.body.appendChild(menu);
    }

    function closeAllPopups() {
        document.querySelectorAll('.dr-popup').forEach(p => p.remove());
    }

    function createPopup(animeId, currentRating, onSave, anchorElement) {
        closeAllPopups();

        const popup = document.createElement('div');
        popup.className = 'dr-popup';

        const rect = anchorElement.getBoundingClientRect();
        popup.style.left = rect.left + 'px';
        popup.style.top = (rect.bottom + 5) + 'px';

        const input = document.createElement('input');
        input.type = 'number';
        input.className = 'dr-input';
        input.min = '0';
        input.max = '10';
        input.step = '0.1';
        input.value = currentRating || '';
        input.placeholder = '0-10';

        const saveBtn = document.createElement('button');
        saveBtn.className = 'dr-save-btn';
        saveBtn.textContent = '✓';
        saveBtn.title = 'Сохранить';

        const clearBtn = document.createElement('button');
        clearBtn.className = 'dr-clear-btn';
        clearBtn.textContent = '✕';
        clearBtn.title = 'Удалить оценку';

        const save = (clear = false) => {
            const ratings = loadRatings();
            let newRating = null;

            if (!clear) {
                const value = parseFloat(input.value);
                if (input.value !== '' && !isNaN(value)) {
                    newRating = Math.round(Math.max(0, Math.min(10, value)) * 10) / 10;
                    ratings[animeId] = newRating;
                } else {
                    delete ratings[animeId];
                }
            } else {
                delete ratings[animeId];
            }

            saveRatings(ratings);
            onSave(newRating);
            popup.remove();
            
            // Обновляем счётчик в меню
            const stats = document.querySelector('.dr-menu-stats strong');
            if (stats) {
                stats.textContent = Object.keys(loadRatings()).length;
            }
        };

        popup.addEventListener('click', e => e.stopPropagation());
        popup.addEventListener('mousedown', e => e.stopPropagation());
        popup.addEventListener('mouseup', e => e.stopPropagation());

        saveBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            save(false);
        });

        clearBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            save(true);
        });

        input.addEventListener('keydown', (e) => {
            e.stopPropagation();
            if (e.key === 'Enter') save(false);
            if (e.key === 'Escape') popup.remove();
        });

        popup.appendChild(input);
        popup.appendChild(saveBtn);
        popup.appendChild(clearBtn);

        document.body.appendChild(popup);

        const popupRect = popup.getBoundingClientRect();
        if (popupRect.right > window.innerWidth) {
            popup.style.left = (window.innerWidth - popupRect.width - 10) + 'px';
        }
        if (popupRect.bottom > window.innerHeight) {
            popup.style.top = (rect.top - popupRect.height - 5) + 'px';
        }

        setTimeout(() => {
            document.addEventListener('click', function handler(e) {
                if (!popup.contains(e.target) && e.target !== anchorElement) {
                    popup.remove();
                    document.removeEventListener('click', handler);
                }
            });
        }, 10);

        return { popup, input };
    }

    function processUserList() {
        const ratings = loadRatings();

        document.querySelectorAll('tr.user_rate[data-target_id]:not([data-dr-done])').forEach(row => {
            row.dataset.drDone = '1';

            const animeId = row.dataset.target_id;
            if (!animeId) return;

            const scoreEl = row.querySelector('.current-value[data-field="score"]');
            const nameCell = row.querySelector('td.name');
            if (!scoreEl || !nameCell) return;

            if (!scoreEl.dataset.originalScore) {
                scoreEl.dataset.originalScore = scoreEl.textContent.trim();
            }
            const originalScore = scoreEl.dataset.originalScore;

            const myRating = ratings[animeId];

            const btn = document.createElement('span');
            btn.className = 'dr-edit-btn' + (myRating ? ' has-rating' : '');
            btn.textContent = '✎';
            btn.title = myRating ? `Дробная оценка: ${myRating}` : 'Добавить дробную оценку';

            const updateDisplay = (rating) => {
                if (rating !== null && rating !== undefined) {
                    scoreEl.textContent = rating;
                    scoreEl.classList.add('dr-custom-score');
                    scoreEl.title = `Моя: ${rating} | Оригинал: ${originalScore}`;
                    btn.classList.add('has-rating');
                    btn.title = `Дробная оценка: ${rating}`;
                } else {
                    scoreEl.textContent = originalScore;
                    scoreEl.classList.remove('dr-custom-score');
                    scoreEl.title = '';
                    btn.classList.remove('has-rating');
                    btn.title = 'Добавить дробную оценку';
                }
            };

            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                const currentRating = loadRatings()[animeId];
                const { input } = createPopup(animeId, currentRating, updateDisplay, btn);
                input.focus();
                input.select();
            });

            nameCell.appendChild(btn);
            updateDisplay(myRating);
        });
    }

    function processAnimePage() {
        const match = location.pathname.match(/\/animes\/[a-z-]*(\d+)/);
        if (!match) return;

        const animeId = match[1];
        if (document.querySelector('.dr-page-badge')) return;

        const ratings = loadRatings();
        const myRating = ratings[animeId];

        const target = document.querySelector('.b-entry-info .line-container:first-child') ||
                       document.querySelector('.b-entry-info') ||
                       document.querySelector('header.head h1');
        if (!target) return;

        const badge = document.createElement('span');
        badge.className = 'dr-page-badge' + (myRating ? '' : ' empty');
        badge.textContent = myRating ? `★ ${myRating}` : '+ оценка';

        const updateBadge = (rating) => {
            if (rating !== null && rating !== undefined) {
                badge.textContent = `★ ${rating}`;
                badge.className = 'dr-page-badge';
            } else {
                badge.textContent = '+ оценка';
                badge.className = 'dr-page-badge empty';
            }
            
            // Обновляем счётчик в меню
            const stats = document.querySelector('.dr-menu-stats strong');
            if (stats) {
                stats.textContent = Object.keys(loadRatings()).length;
            }
        };

        badge.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const currentRating = loadRatings()[animeId];
            const { input } = createPopup(animeId, currentRating, updateBadge, badge);
            input.focus();
            input.select();
        });

        target.appendChild(badge);
    }

    function processAll() {
        processUserList();
        processAnimePage();
    }

    const observer = new MutationObserver(() => {
        setTimeout(processAll, 150);
    });

    function init() {
        processAll();
        createManagementUI();

        observer.observe(document.body, { childList: true, subtree: true });

        window.addEventListener('scroll', closeAllPopups, { passive: true });

        let lastUrl = location.href;
        setInterval(() => {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                closeAllPopups();
                document.querySelectorAll('[data-dr-done]').forEach(el => delete el.dataset.drDone);
                document.querySelectorAll('.dr-page-badge').forEach(el => el.remove());
                setTimeout(processAll, 400);
            }
        }, 500);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // API для консоли (оставляем для совместимости)
    window.decimalRatings = {
        export: () => { const r = loadRatings(); console.log(JSON.stringify(r)); return r; },
        import: (d) => { saveRatings(typeof d === 'string' ? JSON.parse(d) : d); location.reload(); },
        clear: () => { saveRatings({}); location.reload(); }
    };

    console.log('🌟 Decimal Ratings v5.0');
})();