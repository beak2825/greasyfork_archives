// ==UserScript==
// @name         FFZ popup emote select
// @namespace    http://tampermonkey.net/
// @version      1.3.28.26
// @description  shows emotes in popup modal!
// @author       Gullampis810
// @license      MIT
// @match        https://www.twitch.tv/*
// @icon         https://greasyfork.s3.us-east-2.amazonaws.com/odzuv9nq6kwpjw7znk8xxzxppd4n
// @grant        none
// @downloadURL
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/560795/FFZ%20popup%20emote%20select.user.js
// @updateURL https://update.greasyfork.org/scripts/560795/FFZ%20popup%20emote%20select.meta.js
// ==/UserScript==







// ============ Emote_Popup_Utils.js ============ //
  
(function () {
    // ============-23-10-2025- оптимизированная версия ======================== //
    // ====== В ЭТОЙ ВЕРСИИ ДОБАВЛЕНА ПОДДЕРЖКА ВСТАВКИ ТЕКСТ В ИНПУТ ============== //

    // Флаг для отладочных логов (отключите в продакшене)
    const isDebug = false;
    const log = isDebug ? console.log.bind(console) : () => {};
    const warn = isDebug ? console.warn.bind(console) : () => {};

    // Инициализация Web Worker
    const worker = new Worker('worker.js');

    // Глобальный ID интервала для cleanup
    let globalIntervalId;

    // Общая функция для ожидания появления элемента в DOM
    function waitForElement(selector, timeout = 1000) {
        return new Promise((resolve, reject) => {
            const element = document.querySelector(selector);
            if (element) {
                resolve(element);
                return;
            }
            const observer = new MutationObserver((mutations, obs) => {
                const foundElement = document.querySelector(selector);
                if (foundElement) {
                    obs.disconnect();
                    resolve(foundElement);
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
            setTimeout(() => {
                observer.disconnect();
                reject(new Error(`[Content] Element ${selector} not found within ${timeout}ms`));
            }, timeout);
        });
    }

    // Общая функция для позиционирования попапа
    function positionPopup(popup, viewerCard, platform) {
        if (!viewerCard || !document.contains(viewerCard)) {
            popup.style.right = '20px';
            popup.style.top = '20px';
            warn(`[Content] ${platform} viewer card not found, using fallback position`);
            return;
        }
        const rect = viewerCard.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const popupWidth = 320;
        const offset = 20;
        const minGap = 10;
        let left = rect.right + offset;
        let top = rect.top;
        if (left + popupWidth + minGap > viewportWidth) {
            left = rect.left - popupWidth - offset;
        }
        if (top + popup.offsetHeight + minGap > viewportHeight) {
            top = viewportHeight - popup.offsetHeight - offset;
        }
        if (top < minGap) {
            top = minGap;
        }
        if (left < minGap) {
            left = minGap;
            if (rect.bottom + popup.offsetHeight + offset <= viewportHeight) {
                left = rect.left;
                top = rect.bottom + offset;
            }
        }
        popup.style.left = `${left}px`;
        popup.style.top = `${top}px`;
        log(`[Content] ${platform} popup positioned at left: ${left}, top: ${top}`);
    }

   

// Унифицированная функция для привязки попапа к карточке с поддержкой drag-and-drop 
function attachPopupToViewerCard(popup, viewerCard, platform) {
    if (!viewerCard || !document.contains(viewerCard)) {
        warn(`[Content] ${platform} viewer card not found for drag-and-drop`);
        positionPopup(popup, null, platform);
        return;
    }

    // Позиционируем попап сразу
    positionPopup(popup, viewerCard, platform);

    // Переменные для drag-and-drop с requestAnimationFrame
    let isDragging = false;
    let animationFrameId = null;
    let moveHandler = null; // Сохраним ссылку на обработчик mousemove

    const startDragging = (e) => {
        if (e.target.closest('.viewer-card-drag-cancel')) return;
        isDragging = true;
        log(`[Content] Started dragging ${platform} viewer card`);
    };

    const updatePosition = () => {
        if (isDragging && document.contains(viewerCard)) {
            positionPopup(popup, viewerCard, platform);
            animationFrameId = requestAnimationFrame(updatePosition);
        }
    };

    const stopDragging = () => {
        if (isDragging) {
            isDragging = false;
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
            }
            if (document.contains(viewerCard)) {
                positionPopup(popup, viewerCard, platform);
            }
            log(`[Content] Stopped dragging ${platform} viewer card`);
        }
    };

    // Обработчик mousemove — сохраняем ссылку, чтобы потом снять
    moveHandler = () => {
        if (isDragging && !animationFrameId) {
            animationFrameId = requestAnimationFrame(updatePosition);
        }
    };

    viewerCard.addEventListener('mousedown', startDragging);
    document.addEventListener('mousemove', moveHandler);
    document.addEventListener('mouseup', stopDragging);

    // Наблюдатель за изменениями атрибутов карточки (style, class)
    const attrObserver = new MutationObserver(() => {
        if (!isDragging && document.contains(viewerCard)) {
            positionPopup(popup, viewerCard, platform);
        }
    });
    attrObserver.observe(viewerCard, {
        attributes: true,
        attributeFilter: ['style', 'class'],
        subtree: false
    });

    // Наблюдатель за удалением карточки из DOM
    const parent = viewerCard.parentNode;
    let removalObserverCard = null;
    if (parent) {
        removalObserverCard = new MutationObserver(() => {
            if (!document.contains(viewerCard)) {
                warn(`[Content] ${platform} viewer card removed from DOM, closing popup`);
                if (popup.parentNode) {
                    popup.parentNode.removeChild(popup);
                } else {
                    popup.remove();
                }
                cleanup();
            }
        });
        removalObserverCard.observe(parent, { childList: true });
    }

    // Обработчик изменения размера окна
    const resizeHandler = () => {
        if (document.contains(viewerCard)) {
            positionPopup(popup, viewerCard, platform);
        }
    };
    window.addEventListener('resize', resizeHandler, { passive: true });

    // Наблюдатель за удалением попапа
    const removalObserver = new MutationObserver(() => {
        if (!document.contains(popup)) {
            cleanup();
        }
    });
    if (popup.parentNode) {
        removalObserver.observe(popup.parentNode, { childList: true });
    } else {
        removalObserver.observe(document.body, { childList: true, subtree: true });
    }

    // Функция полной очистки всех слушателей и observers
    const cleanup = () => {
        attrObserver.disconnect();
        if (removalObserverCard) removalObserverCard.disconnect();
        removalObserver.disconnect();
        window.removeEventListener('resize', resizeHandler);
        viewerCard.removeEventListener('mousedown', startDragging);
        document.removeEventListener('mousemove', moveHandler);
        document.removeEventListener('mouseup', stopDragging);
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
        log(`[Content] Cleanup for ${platform} popup completed`);
    };

    // Возвращаем cleanup, если нужно использовать снаружи (не обязательно, но на всякий случай)
    return cleanup;
}

    // Функция для отправки данных в Worker
    function preventHidingElements(elements, viewerCardSelector) {
        worker.postMessage({
            emotePickerElements: elements,
            viewerCardSelector: viewerCardSelector
        });
    }

    // Обработчик сообщений от Worker
    worker.onmessage = function (e) {
        log('[Content] Worker response:', e.data);
        if (e.data.status === 'viewerCardRestored') {
            log('[Content] Viewer card visibility restored by worker:', e.data.message);
        }
        else if (e.data.status === 'viewerCardNotFound') {
            warn('[Content] Viewer card not found in DOM:', e.data.message);
        }
    };

    // Функция debounce
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Дебонсированная проверка видимости карточки Twitch
    const checkTwitchCardVisibility = debounce(() => {
        const twitchCard = document.querySelector('[data-a-target="viewer-card-positioner"]') ||
            document.querySelector('.viewer-card');
        if (twitchCard) {
            const computedStyle = window.getComputedStyle(twitchCard);
            if (computedStyle.display === 'none' || computedStyle.visibility === 'hidden' || computedStyle.opacity === '0') {
                warn("[Content] Twitch viewer card hidden detected in global check, restoring visibility");
                twitchCard.style.display = '';
                twitchCard.style.visibility = 'visible';
                twitchCard.style.opacity = '1';
                preventHidingElements([], '[data-a-target="viewer-card-positioner"]');
            }
        } else {
            warn("[Content] Twitch viewer card not found in global check");
        }
    }, 500);

    // Глобальная проверка видимости карточки (увеличен интервал до 500 мс)
    globalIntervalId = setInterval(checkTwitchCardVisibility, 500);

    // Глобальный cleanup при выгрузке страницы
    window.addEventListener('beforeunload', () => {
        if (globalIntervalId) {
            clearInterval(globalIntervalId);
        }
        worker.terminate();
    }, { once: true });

    // Экспорт общих функций в глобальную область для доступа из других модулей
    window.waitForElement = waitForElement;
    window.positionPopup = positionPopup;
    window.attachPopupToViewerCard = attachPopupToViewerCard;
    window.preventHidingElements = preventHidingElements;
    window.debounce = debounce;
    window.checkTwitchCardVisibility = checkTwitchCardVisibility;
})(); 

// ============ FFZ_emote_Popup.js ============ //
 
(function () {
    // ============-17-08-2025- исправлен удалены спам логов ======================== //
    // ====== В ЭТОЙ ВЕРСИИ ДОБАВЛЕНА ПОДДЕРЖКА ВСТАВКИ ТЕКСТ В ИНПУТ ============== //

    // Обновлённая функция showEmoteSelectionPopup
    // Функция showEmoteSelectionPopup с исправлением
    function showEmoteSelectionPopup(emotes, callback) {
        console.log("[Content] Attempting to show emote selection popup with emotes:", emotes);

        // Проверка для запрета показа попапа только в контейнере PrattleNot
        const restrictedSelector = '.ffz-pn--list.chat-list--other.font-scale--default.ffz-pn--top, ' +
            '.ffz-pn--list.chat-list--other.font-scale--default.ffz-pn--bottom, ' +
            '.ffz-pn--list.chat-list--other.font-scale--default.ffz-pn--right, ' +
            '.ffz-pn--list.chat-list--other.font-scale--default.ffz-pn--left';
        if (emotes[0]?.element && emotes[0].element.closest(restrictedSelector)) {
            console.log(`[Content] Twitch popup blocked for element within restricted selector: ${restrictedSelector}`);
            return;
        }

        const existingPopup = document.getElementById('emote-selection-popup');
        if (existingPopup) {
            console.log("[Content] Emote selection popup already exists, skipping creation");
            return;
        }

        const popup = document.createElement('div');
        popup.id = 'emote-selection-popup';
        popup.innerHTML = `
            <div class="close-emote-popup-button" style="cursor:pointer;position:absolute;top:6px;right:10px;font-size:20px;">✕</div>
            <div class="emote-options"></div>
        `;
        document.body.appendChild(popup);
        console.log("[Content] FFZ popup element created and appended to body");

        // Добавляем кнопку "Копировать всё"
        addPasteAllButton('emote-selection-popup');
        

        // Инлайн-стили для попапа
        popup.style.position = 'fixed';
        popup.style.boxShadow = 'rgb(75 191 191 / 24%) 0px 4px 10px 2px';
        popup.style.background = 'linear-gradient(205deg, #406f76, #3b1d47)';
        popup.style.color = 'rgb(235, 235, 235)';
        popup.style.fontWeight = 'bold';
        popup.style.fontSize = '16px';
        popup.style.border = '1px solid #12b6a7';
        popup.style.borderRadius = '8px';
        popup.style.padding = '10px 10px 10px 10px';
        popup.style.zIndex = '555555';
        popup.style.maxWidth = '345px';
        popup.style.maxHeight = '500px';
        popup.style.overflowY = 'auto';
        popup.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
        popup.style.opacity = '0';
        popup.style.transform = 'scale(0.9)';
        popup.style.display = 'block';
        popup.style.visibility = 'visible';
        popup.style.paddingTop = '32px';

        // Ожидание появления карточки
        waitForElement('.ffz-viewer-card.tw-border, [data-a-target="viewer-card-positioner"], .viewer-card', 1000)
            .then((viewerCard) => {
                console.log("[Content] FFZ/Twitch viewer card found:", viewerCard);
                attachPopupToViewerCard(popup, viewerCard, 'FFZ');

                // Закрытие при клике вне попапа
                document.addEventListener('click', function closePopup(e) {
                    const currentViewerCard = document.querySelector('.ffz-viewer-card.tw-border, [data-a-target="viewer-card-positioner"], .viewer-card');
                    if (!popup.contains(e.target) && e.target !== popup && (!currentViewerCard || !currentViewerCard.contains(e.target))) {
                        console.log("[Content] Closing FFZ popup due to outside click");
                        popup.remove();
                    }
                }, { capture: true, once: true });
            })
            .catch((error) => {
                console.warn(error.message);
                attachPopupToViewerCard(popup, null, 'FFZ');
                // Закрытие при клике вне попапа, если карточка не найдена
                document.addEventListener('click', function closePopup(e) {
                    if (!popup.contains(e.target) && e.target !== popup) {
                        console.log("[Content] Closing FFZ popup due to outside click (no viewer card)");
                        popup.remove();
                    }
                }, { capture: true, once: true });
            });

        const optionsContainer = popup.querySelector('.emote-options');
        // Заполнение попапа
        emotes.forEach((emote) => {
            const option = document.createElement('div');
            option.className = 'emote-option';
            option.style.display = 'flex';
            option.style.alignItems = 'center';
            option.style.justifyContent = 'space-between';
            option.style.padding = '8px 0';
            option.style.borderBottom = '1px solid rgba(115, 209, 204, 0.16)';
            option.style.gap = '10px';
            const left = document.createElement('div');
            left.style.display = 'flex';
            left.style.alignItems = 'center';
            left.style.minWidth = '0';
            const img = document.createElement('img');
            img.src = emote.src || '';
            img.alt = emote.alt || 'Emote';
            img.style.width = '24px';
            img.style.height = '24px';
            img.style.marginRight = '10px';
            img.style.flexShrink = '0';
            img.style.userSelect = 'none';
            const info = document.createElement('div');
            info.className = 'emote-info';
            info.style.fontSize = '14px';
            info.style.whiteSpace = 'nowrap';
            info.style.overflow = 'hidden';
            info.style.textOverflow = 'ellipsis';
            info.innerHTML = `<span>${emote.alt || 'Unnamed'} <span style="user-select:none;">(${emote.platform})</span></span>`;
            left.appendChild(img);
            left.appendChild(info);
            const blockButton = document.createElement('button');
            blockButton.className = 'block-button';
            blockButton.type = 'button';
            blockButton.textContent = 'Block';
            blockButton.style.background = '#ff5555';
            blockButton.style.color = '#ffffff';
            blockButton.style.border = 'none';
            blockButton.style.padding = '4px 8px';
            blockButton.style.borderRadius = '4px';
            blockButton.style.cursor = 'pointer';
            blockButton.style.fontSize = '14px';
            blockButton.style.marginLeft = '10px';
            blockButton.style.flexShrink = '0';
            blockButton.style.userSelect = 'none';
            blockButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log("[Content] Block button clicked for FFZ emote:", emote);
                let targetElement = emote.element;
                if (!targetElement || !targetElement.isConnected) {
                    targetElement = document.querySelector(`img[src="${emote.src}"]`);
                    console.log("[Content] FFZ emote element re-fetched by src:", targetElement);
                }
                let platform = emote.platform || 'TwitchChannel';
                let emoteName = emote.alt || 'Unnamed';
                let emoteUrl = emote.src || '';
                let emotePrefix = emoteName;
                if (targetElement) {
                    emoteName = targetElement.getAttribute('alt') ||
                        targetElement.getAttribute('data-emote-name') ||
                        targetElement.getAttribute('title') ||
                        targetElement.getAttribute('data-code') ||
                        emoteName;
                    emoteName = emoteName.trim();
                }
                const dataProvider = targetElement?.getAttribute('data-provider') || '';
                const dataSet = targetElement?.getAttribute('data-set') || '';
                if (emoteUrl.includes('7tv.app') || dataProvider === '7tv' || dataSet?.includes('seventv_emotes')) {
                    platform = '7tv';
                    emoteUrl = emote.src;
                    emoteName = emoteName || emoteUrl.split('/').slice(-2)[0] || 'Unnamed';
                    emotePrefix = emoteUrl;
                } else if (emoteUrl.includes('betterttv.net') || dataProvider === 'bttv' || (dataProvider === 'ffz' && emoteUrl.includes('betterttv.net'))) {
                    platform = 'bttTV';
                    emoteUrl = emote.src;
                    emoteName = emoteName || emoteUrl.split('/').pop().replace(/\.webp|\.png/, '') || 'Unnamed';
                    emotePrefix = emoteUrl;
                } else if (emoteUrl.includes('frankerfacez.com') || (dataProvider === 'ffz' && !emoteUrl.includes('betterttv.net'))) {
                    platform = 'ffz';
                    emoteUrl = emote.src;
                    emoteName = emoteName || emoteUrl.split('/').pop().replace(/\.webp|\.png/, '') || 'Unnamed';
                    emotePrefix = emoteUrl;
                } else if (emoteUrl.includes('jtvnw.net') || dataProvider === 'twitch') {
                    platform = 'TwitchChannel';
                    emoteName = emoteName || emoteUrl.split('/').pop() || 'Unnamed';
                    const match = emoteName.match(/^([a-z0-9]+)([A-Z].*|\d+.*)$/i);
                    emotePrefix = match ? match[1] : emoteName.split(/[^a-zA-Z0-9]/)[0] || emoteName;
                    emoteUrl = '';
                } else if (dataProvider === 'emoji') {
                    platform = 'emoji';
                    emoteName = emoteName || emoteUrl.split('/').pop() || 'Unnamed';
                    emotePrefix = emoteName;
                    emoteUrl = emote.src;
                } else {
                    platform = 'TwitchChannel';
                    emoteName = emoteName || emoteUrl.split('/').pop() || 'Unnamed';
                    const match = emoteName.match(/^([a-z0-9]+)([A-Z].*|\d+.*)$/i);
                    emotePrefix = match ? match[1] : emoteName.split(/[^a-zA-Z0-9]/)[0] || emoteName;
                    emoteUrl = '';
                }
                if (!emoteName || emoteName === 'Unknown') {
                    emoteName = targetElement?.getAttribute('data-id') || emoteUrl.split('/').pop() || 'Unnamed';
                }
                console.log(`[Content] Blocking FFZ emote:`, { emoteName, platform, emoteUrl, emotePrefix });
                const item = addEmoteOrChannel(emotePrefix, platform, emoteName, emoteUrl, targetElement);
                if (item && targetElement) {
                    targetElement.setAttribute('data-emote-id', item.id);
                    targetElement.style.display = 'none';
                    console.log(`[Content] Immediately hid FFZ emote ${emoteName} with ID ${item.id}`);
                    const parentContainer = targetElement.closest('.ffz--inline, .chat-line__message, .chat-image');
                    if (parentContainer) {
                        const allEmotes = parentContainer.querySelectorAll('img.chat-line__message--emote, .ffz-emote, .seventv-emote, .bttv-emote, .twitch-emote, .chat-image');
                        const allBlocked = Array.from(allEmotes).every(e => e.style.display === 'none');
                        if (allBlocked) {
                            parentContainer.style.display = 'none';
                            console.log("[Content] Parent container hidden as all emotes are blocked");
                        }
                    }
                    if (uiElements?.counter) {
                        updateCounter(uiElements.counter);
                    }
                    setStorage(() => {
                        console.log("[Content] Storage updated after blocking FFZ emote");
                        toggleEmotesInNode(document.body, true);
                    });
                } else {
                    console.error("[Content] Failed to block FFZ emote:", emote);
                    if (window.Notifications?.showPanelNotification) {
                        window.Notifications.showPanelNotification('Ошибка: эмодзи уже заблокирован или не удалось добавить', 5000, false);
                    }
                }
                callback(emote);
            });
            option.appendChild(left);
            // option.appendChild(blockButton); //
            optionsContainer.appendChild(option);
        });

        console.log("[Content] FFZ popup populated with", emotes.length, "emotes");

        // Кнопка закрытия попапа
        const closeButton = popup.querySelector('.close-emote-popup-button');
        closeButton.onclick = () => {
            console.log("[Content] FFZ emote popup closed via close button");
            popup.remove();
        };

        // Анимация
        setTimeout(() => {
            popup.classList.add('visible');
            popup.style.opacity = '1';
            popup.style.transform = 'scale(1)';
            console.log("[Content] FFZ popup visibility class and styles applied");
        }, 10);
    }

    function getEmotesFromViewerCard(card) {
        const emotes = [];
        const mainEmoteImg = card.querySelector('.ffz-avatar img');
        const displayName = card.querySelector('.viewer-card__display-name h4')?.textContent?.trim() || 'Unnamed';
        const platformText = card.querySelector('.viewer-card__banner p')?.textContent?.trim() || 'Unknown';
        const platform = platformText.includes('Twitch') ? 'Twitch' : '7tv';
        if (mainEmoteImg) {
            emotes.push({
                src: mainEmoteImg.src,
                alt: mainEmoteImg.alt || mainEmoteImg.title || displayName,
                platform: platform,
                element: mainEmoteImg,
                id: mainEmoteImg.src.split('/').slice(-2, -1)[0] || ''
            });
            if (window.Notifications?.showPanelNotification) {
                window.Notifications.showPanelNotification(`Main emote found: ${displayName} (${platform})`, 3000, false);
            }
        }
        else {
            if (window.Notifications?.showPanelNotification) {
                window.Notifications.showPanelNotification('No main emote image found in viewer card', 3000, false);
            }
            console.log("[DEBUG] No main emote image. Card HTML:", card.outerHTML);
        }
        card.querySelectorAll('.ffz-emote-card__modifiers .tw-image-avatar').forEach(img => {
            emotes.push({
                src: img.src,
                alt: img.alt || img.title || img.closest('.tw-flex.tw-align-items-center')?.querySelector('h4')?.textContent?.trim() || 'Unnamed',
                platform: platform,
                element: img,
                id: img.src.split('/').slice(-2, -1)[0] || ''
            });
        });
        if (emotes.length === 0 && window.Notifications?.showPanelNotification) {
            window.Notifications.showPanelNotification('No emotes found in viewer card', 3000, false);
        }
        console.log("[Content] Extracted emotes from viewer card:", emotes);
        return emotes;
    }

    function getEmotesFromChatMessage(messageContainer) {
        const emotes = [];
        const emoteElements = messageContainer.querySelectorAll('.chat-line__message--emote, .ffz-emote, .seventv-emote, .bttv-emote, .twitch-emote, .ffz-emoji');
        emoteElements.forEach(img => {
            const alt = img.alt || 'Unnamed';
            const src = img.src || '';
            const platform = img.getAttribute('data-provider') || 'Unknown';
            const id = img.getAttribute('data-id') || src.split('/').slice(-2, -1)[0] || '';
            emotes.push({
                src: src,
                alt: alt,
                platform: platform,
                element: img,
                id: id
            });
        });
        console.log("[Content] Extracted emotes from chat message:", emotes);
        return emotes;
    }

    // Обработчик клика по смайлу в чате
    function handleChatEmoteClick() {
        document.body.removeEventListener('click', handleChatEmoteClick._handler);
        handleChatEmoteClick._handler = (e) => {
            const emoteElement = e.target.closest('.chat-line__message--emote, .ffz-emote, .seventv-emote, .bttv-emote, .twitch-emote, .ffz-emoji');
            if (!emoteElement)
                return;
            if (document.getElementById('emote-selection-popup') || document.getElementById('twitch-emote-popup')) {
                console.log("[Content] Popup already open, skipping click");
                return;
            }
            const messageContainer = emoteElement.closest('.chat-line__message');
            if (!messageContainer) {
                console.warn("[Content] No chat-line__message found for emote click");
                return;
            }
            const emotes = getEmotesFromChatMessage(messageContainer);
            if (emotes.length) {
                console.log("[Content] Showing emote selection popup for chat emotes:", emotes);
                showEmoteSelectionPopup(emotes, (selectedEmote) => {
                    console.log("[Content] Blocking emote from chat popup:", selectedEmote);
                });
                // Симулируем клик по имени пользователя для вызова Twitch-карточки
                waitForElement('[data-a-target="chat-message-username"]', 1000)
                    .then((usernameElement) => {
                    if (!document.querySelector('[data-a-target="viewer-card-positioner"]')) {
                        usernameElement.click();
                        console.log("[Content] Simulated click on username to trigger Twitch viewer card");
                    }
                })
                    .catch((error) => {
                    console.warn("[Content] Username element not found for simulated click:", error.message);
                });
            }
        };
        document.body.addEventListener('click', handleChatEmoteClick._handler, { capture: true });
    }
    // Запускаем обработчик
    handleChatEmoteClick();

    // Наблюдатель за сообщениями в чате
    const chatObserver = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.classList && node.classList.contains('chat-line__message') && !node.__popup_shown) {
                    node.__popup_shown = true;
                    const emotes = getEmotesFromChatMessage(node);
                    if (emotes.length) {
                        console.log("[Content] Showing emote selection popup for new chat message:", emotes);
                        showEmoteSelectionPopup(emotes, (selectedEmote) => {
                            let emoteName = selectedEmote.alt || 'Unnamed';
                            let emoteUrl = selectedEmote.src || '';
                            let emotePrefix = emoteName;
                            const platform = selectedEmote.platform || 'Unknown';
                            if (platform === 'TwitchChannel' || platform === 'emoji') {
                                const match = emoteName.match(/^([a-z0-9]+)([A-Z].*|\d+.*)$/i);
                                emotePrefix = match ? match[1] : emoteName.split(/[^a-zA-Z0-9]/)[0] || emoteName;
                                emoteUrl = platform === 'emoji' ? emoteUrl : '';
                            }
                            else {
                                emotePrefix = emoteUrl || emoteName;
                            }
                            console.log(`[Content] Blocking selected emote from chat popup:`, { emoteName, platform, emoteUrl, emotePrefix });
                            const item = addEmoteOrChannel(emotePrefix, platform, emoteName, emoteUrl, selectedEmote.element);
                            if (item) {
                                if (selectedEmote.element) {
                                    selectedEmote.element.setAttribute('data-emote-id', item.id);
                                    selectedEmote.element.style.display = 'none';
                                    console.log(`[Content] Immediately hid emote ${emoteName} with ID ${item.id}`);
                                }
                                setStorage(() => {
                                    console.log("[Content] Storage updated after blocking from chat popup");
                                    toggleEmotesInNode(document.body, true);
                                });
                            }
                            else {
                                console.error("[Content] Failed to block emote from chat popup:", selectedEmote);
                                if (window.Notifications?.showPanelNotification) {
                                    window.Notifications.showPanelNotification('Ошибка: эмодзи уже заблокирован или не удалось добавить', 5000, false);
                                }
                            }
                        });
                    }
                }
            });
        });
    });
    chatObserver.observe(document.querySelector('.chat-scrollable-area__message-container') || document.body, {
        childList: true,
        subtree: true
    });

    // Observer за карточкой зрителя ffz-viewer-card, который будет показывать попап при появлении карточки
    // Наблюдатель за появлением карточек
    const viewerCardObserverFFZ = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.matches && node.matches('.ffz-viewer-card.tw-border') && !node.__popup_shown) {
                    node.__popup_shown = true;
                    const emotes = getEmotesFromViewerCard(node);
                    if (emotes.length) {
                        console.log("[Content] Showing FFZ emote popup for detected card:", emotes);
                        showEmoteSelectionPopup(emotes, (selectedEmote) => {
                            console.log("[Content] Blocking FFZ emote:", selectedEmote);
                        });
                    }
                }
            });
        });
    });
    viewerCardObserverFFZ.observe(document.body, { childList: true, subtree: true });

    // Создаём и добавляем кнопку "Копировать всё"
    // Глобальная переменная для хранения скопированного текста
    

    function addPasteAllButton(popupId) {
        const popup = document.getElementById(popupId);
        if (!popup) {
            console.error(`[Content] Попап с ID ${popupId} не найден`);
            return;
        }
        if (popup.querySelector('.paste-all-button')) {
            console.log(`[Content] Кнопка "Вставить" для попапа ${popupId} уже существует`);
            return;
        }

        // Создаём кнопку "Вставить"
        const pasteBtn = document.createElement('button');
        pasteBtn.className = 'paste-all-button';
        pasteBtn.style.cssText = `
            background: rgba(85, 221, 255, 0.11);
            color: rgba(85, 255, 127, 0.71);
            border: none;
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            position: absolute;
            top: 6px;
            left: 10px;
            display: flex;
            align-items: center;
            gap: 6px;
        `;
        pasteBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:16px;height:16px;">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
            </svg> paste
        `;
        pasteBtn.addEventListener('click', () => {
            // Извлекаем текст эмодзи из попапа
            const emoteSpans = popup.querySelectorAll('.emote-info span');
            console.log(`[Content] Найдено ${emoteSpans.length} элементов .emote-info span`);
            const emoteTexts = Array.from(emoteSpans)
                .map(span => {
                    // Извлекаем только текстовые узлы первого уровня, игнорируя вложенные span
                    const textNodes = Array.from(span.childNodes)
                        .filter(node => node.nodeType === Node.TEXT_NODE)
                        .map(node => node.textContent.trim())
                        .join('');
                    console.log(`[Content] Извлечённый текст из span: "${textNodes}"`);
                    // Удаляем (ffz), (7tv) и т.д., если они есть
                    return textNodes.replace(/\s*\([^)]+\)\s*/g, '').trim();
                })
                .filter(text => text.length > 0);
            
            // Формируем итоговую строку с пробелами в начале и конце
            const allEmotes = emoteTexts.length > 0 ? ` ${emoteTexts.join(' ')} ` : '';
            console.log(`[Content] Общий текст эмодзи: "${allEmotes}"`);

            if (allEmotes) {
                // Вставляем текст напрямую, без сохранения в буфер обмена
                pasteTextToInput(allEmotes);
                console.log(`[Content] Инициирована вставка эмодзи: "${allEmotes}"`);
                if (window.Notifications?.showPanelNotification) {
                    window.Notifications.showPanelNotification(`Вставлено: ${allEmotes}`, 3000, false);
                }
            } else {
                console.warn('[Content] Нет эмодзи для вставки');
                if (window.Notifications?.showPanelNotification) {
                    window.Notifications.showPanelNotification('Ошибка: нет эмодзи для вставки', 3000, false);
                }
            }
        });

        popup.appendChild(pasteBtn);
    }

    // Функция вставки текста в поле ввода
    function pasteTextToInput(text) {
        // Находим поле ввода
        const inputEditors = document.querySelectorAll('[data-a-target="chat-input"]');
        let inputEditor = null;

        // Если найдено несколько полей ввода, выбираем первое видимое
        if (inputEditors.length > 1) {
            console.warn(`[Content] Найдено ${inputEditors.length} элементов с data-a-target="chat-input", выбираем первое видимое`);
            inputEditor = Array.from(inputEditors).find(editor => {
                const style = window.getComputedStyle(editor);
                return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
            });
        } else if (inputEditors.length === 1) {
            inputEditor = inputEditors[0];
        }

        if (!inputEditor) {
            console.error('[Content] Поле ввода чата не найдено');
            if (window.Notifications?.showPanelNotification) {
                window.Notifications.showPanelNotification('Ошибка: поле ввода не найдено', 3000, false);
            }
            return;
        }

        // Фокусируем поле ввода
        inputEditor.focus();
        console.log('[Content] Поле ввода в фокусе');

        try {
            // Проверяем тип элемента
            if (inputEditor.tagName.toLowerCase() === 'textarea') {
                // Работа с textarea
                const currentValue = inputEditor.value || '';
                const selectionStart = inputEditor.selectionStart || currentValue.length;
                const selectionEnd = inputEditor.selectionEnd || currentValue.length;

                // Вставляем текст в текущую позицию курсора
                inputEditor.value = currentValue.slice(0, selectionStart) + text + currentValue.slice(selectionEnd);

                // Устанавливаем курсор после вставленного текста
                const newCursorPos = selectionStart + text.length;
                inputEditor.setSelectionRange(newCursorPos, newCursorPos);

                // Диспатчим событие input
                const inputEvent = new Event('input', { bubbles: true });
                inputEditor.dispatchEvent(inputEvent);

                // Диспатчим событие keyup
                const keyupEvent = new KeyboardEvent('keyup', { bubbles: true });
                inputEditor.dispatchEvent(keyupEvent);

                console.log(`[Content] Текст успешно вставлен в textarea: "${text}"`);
            } else if (inputEditor.hasAttribute('contenteditable') && inputEditor.getAttribute('contenteditable') === 'true') {
                // Работа с contenteditable
                const supportsInputEvent = 'InputEvent' in window;

                if (supportsInputEvent) {
                    // Создаём событие beforeinput
                    const beforeInputEvent = new InputEvent('beforeinput', {
                        bubbles: true,
                        cancelable: true,
                        data: text,
                        inputType: 'insertText'
                    });

                    // Диспатчим beforeinput
                    if (!inputEditor.dispatchEvent(beforeInputEvent)) {
                        console.warn('[Content] Событие beforeinput было отменено');
                        if (window.Notifications?.showPanelNotification) {
                            window.Notifications.showPanelNotification('Ошибка: ввод заблокирован редактором', 3000, false);
                        }
                        return;
                    }

                    // Устанавливаем текст через Range
                    const range = document.createRange();
                    const selection = window.getSelection();
                    range.selectNodeContents(inputEditor);
                    range.collapse(false); // Курсор в конец
                    selection.removeAllRanges();
                    selection.addRange(range);

                    // Вставляем текст через TextNode
                    const textNode = document.createTextNode(text);
                    range.insertNode(textNode);
                    range.setStartAfter(textNode);
                    range.setEndAfter(textNode);
                    selection.removeAllRanges();
                    selection.addRange(range);

                    // Диспатчим событие input
                    const inputEvent = new InputEvent('input', {
                        bubbles: true,
                        cancelable: true,
                        data: text,
                        inputType: 'insertText'
                    });
                    inputEditor.dispatchEvent(inputEvent);

                    // Диспатчим событие keyup
                    const keyupEvent = new KeyboardEvent('keyup', { bubbles: true });
                    inputEditor.dispatchEvent(keyupEvent);

                    console.log(`[Content] Текст успешно вставлен через InputEvent: "${text}"`);
                } else {
                    // Резервный вариант с использованием execCommand
                    const selection = window.getSelection();
                    selection.removeAllRanges();
                    const range = document.createRange();
                    range.selectNodeContents(inputEditor);
                    range.collapse(false);
                    selection.addRange(range);

                    if (document.execCommand('insertText', false, text)) {
                        console.log(`[Content] Текст вставлен через execCommand: "${text}"`);
                    } else {
                        console.warn('[Content] document.execCommand("insertText") не сработал, пробуем innerText');
                        inputEditor.innerText += text;
                    }

                    // Диспатчим событие input
                    const inputEvent = new Event('input', { bubbles: true });
                    inputEditor.dispatchEvent(inputEvent);

                    // Диспатчим событие keyup
                    const keyupEvent = new KeyboardEvent('keyup', { bubbles: true });
                    inputEditor.dispatchEvent(keyupEvent);

                    console.log(`[Content] Текст успешно вставлен через резервный метод: "${text}"`);
                }
            } else {
                console.error('[Content] Поле ввода не является ни textarea, ни contenteditable');
                if (window.Notifications?.showPanelNotification) {
                    window.Notifications.showPanelNotification('Ошибка: неподдерживаемый тип поля ввода', 3000, false);
                }
            }
        } catch (err) {
            console.error('[Content] Ошибка при вставке текста:', err);
            if (window.Notifications?.showPanelNotification) {
                window.Notifications.showPanelNotification('Ошибка при вставке текста', 3000, false);
            }
        }
    }
    window.addPasteAllButton = addPasteAllButton;
    window.pasteTextToInput = pasteTextToInput;
})();

// ============ - FFZ_twitch_emote_Popup.js ============  //

(function () {
    // ============-17-08-2025- исправлен удалены спам логов ======================== //
    // ====== В ЭТОЙ ВЕРСИИ ДОБАВЛЕНА ПОДДЕРЖКА ВСТАВКИ ТЕКСТ В ИНПУТ ============== //
 
    // Обновлённая функция showTwitchEmotePopup
    function showTwitchEmotePopup(emotes, callback) {
        console.log("[Content] Attempting to show Twitch emote popup with emotes:", emotes);
        // =======  Проверка для запрета показа попапа только в контейнере PrattleNot ======= //
        // Проверка для запрета показа попапа только в контейнере PrattleNot
        const restrictedSelector = '.ffz-pn--list.chat-list--other.font-scale--default.ffz-pn--top, ' +
            '.ffz-pn--list.chat-list--other.font-scale--default.ffz-pn--bottom, ' +
            '.ffz-pn--list.chat-list--other.font-scale--default.ffz-pn--right, ' +
            '.ffz-pn--list.chat-list--other.font-scale--default.ffz-pn--left';
        if (emotes[0]?.element && emotes[0].element.closest(restrictedSelector)) {
            console.log(`[Content] Twitch popup blocked for element within restricted selector: ${restrictedSelector}`);
            return;
        }
        // =======  Проверка для запрета показа попапа только в контейнере PrattleNot ======= //
        const existingPopup = document.getElementById('twitch-emote-popup');
        if (existingPopup) {
            console.log("[Content] Twitch popup already exists, skipping creation");
            return;
        }
        const popup = document.createElement('div');
        popup.id = 'twitch-emote-popup';
        popup.innerHTML = `
            <div class="close-twitch-emote-popup-button" style="cursor:pointer;position:absolute;top:6px;right:10px;font-size:20px;">✕</div>
            <div class="emote-options"></div>
        `;
        document.body.appendChild(popup);
        console.log("[Content] Twitch popup element created and appended to body");
        // Добавляем кнопку "Копировать всё"
        addCopyAllButton('twitch-emote-popup');
        // Инлайн-стили для попапа
        popup.style.position = 'fixed';
        popup.style.boxShadow = 'rgb(75 191 191 / 24%) 0px 4px 10px 2px';
        popup.style.background = 'linear-gradient(205deg, #406f76, #3b1d47)';
        popup.style.color = 'rgb(235, 235, 235)';
        popup.style.fontWeight = 'bold';
        popup.style.fontSize = '16px';
        popup.style.border = '1px solid #12b6a7';
        popup.style.borderRadius = '8px';
        popup.style.padding = '10px 10px 10px 10px';
        popup.style.zIndex = '100001';
        popup.style.maxWidth = '320px';
        popup.style.maxHeight = '500px';
        popup.style.overflowY = 'auto';
        popup.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
        popup.style.opacity = '0';
        popup.style.transform = 'scale(0.9)';
        popup.style.display = 'block';
        popup.style.visibility = 'visible';
        popup.style.paddingTop = '32px';
        // Ожидание появления карточки
        waitForElement('[data-a-target="viewer-card-positioner"], .viewer-card', 1000)
            .then((twitchCard) => {
            console.log("[Content] Twitch viewer card found:", twitchCard);
            attachPopupToViewerCard(popup, twitchCard, 'Twitch');
        })
            .catch((error) => {
            console.warn(error.message);
            attachPopupToViewerCard(popup, null, 'Twitch'); // Используем запасную позицию
        });
        const optionsContainer = popup.querySelector('.emote-options');
        // Заполнение попапа
        emotes.forEach((emote) => {
            const option = document.createElement('div');
            option.className = 'emote-option';
            option.style.display = 'flex';
            option.style.alignItems = 'center';
            option.style.justifyContent = 'space-between';
            option.style.padding = '8px 0';
            option.style.borderBottom = '1px solid rgba(115, 209, 204, 0.16)';
            option.style.gap = '10px';
            const left = document.createElement('div');
            left.style.display = 'flex';
            left.style.alignItems = 'center';
            left.style.minWidth = '0';
            const img = document.createElement('img');
            img.src = emote.src || '';
            img.alt = emote.alt || 'Emote';
            img.style.width = '24px';
            img.style.height = '24px';
            img.style.marginRight = '10px';
            img.style.flexShrink = '0';
            img.style.userSelect = 'none';
            const info = document.createElement('div');
            info.className = 'emote-info';
            info.style.fontSize = '14px';
            info.style.whiteSpace = 'nowrap';
            info.style.overflow = 'hidden';
            info.style.textOverflow = 'ellipsis';
            info.innerHTML = `<span>${emote.alt || 'Unnamed'} <span style="user-select:none;">(${emote.platform})</span></span>`;
            left.appendChild(img);
            left.appendChild(info);
            const blockButton = document.createElement('button');
            blockButton.className = 'block-button';
            blockButton.type = 'button';
            blockButton.textContent = 'Block';
            blockButton.style.background = ' #ff5555';
            blockButton.style.color = ' #ffffff';
            blockButton.style.border = 'none';
            blockButton.style.padding = '4px 8px';
            blockButton.style.borderRadius = '4px';
            blockButton.style.cursor = 'pointer';
            blockButton.style.fontSize = '14px';
            blockButton.style.marginLeft = '10px';
            blockButton.style.flexShrink = '0';
            blockButton.style.userSelect = 'none';
            blockButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log("[Content] Block button clicked for Twitch emote:", emote);
                let targetElement = emote.element;
                if (!targetElement || !targetElement.isConnected) {
                    targetElement = document.querySelector(`img[src="${emote.src}"]`);
                    console.log("[Content] Twitch emote element re-fetched by src:", targetElement);
                }
                let platform = emote.platform || 'TwitchChannel';
                let emoteName = emote.alt || 'Unnamed';
                let emoteUrl = emote.src || '';
                let emotePrefix = emoteName;
                if (targetElement) {
                    emoteName = targetElement.getAttribute('alt') ||
                        targetElement.getAttribute('data-emote-name') ||
                        targetElement.getAttribute('title') ||
                        targetElement.getAttribute('data-code') ||
                        emoteName;
                    emoteName = emoteName.trim();
                }
                const dataProvider = targetElement?.getAttribute('data-provider') || '';
                const dataSet = targetElement?.getAttribute('data-set') || '';
                if (emoteUrl.includes('7tv.app') || dataProvider === '7tv' || dataSet?.includes('seventv_emotes')) {
                    platform = '7tv';
                    emoteUrl = emote.src;
                    emoteName = emoteName || emoteUrl.split('/').slice(-2)[0] || 'Unnamed';
                    emotePrefix = emoteUrl;
                }
                else if (emoteUrl.includes('betterttv.net') || dataProvider === 'bttv' || (dataProvider === 'ffz' && emoteUrl.includes('betterttv.net'))) {
                    platform = 'bttTV';
                    emoteUrl = emote.src;
                    emoteName = emoteName || emoteUrl.split('/').pop().replace(/\.webp|\.png/, '') || 'Unnamed';
                    emotePrefix = emoteUrl;
                }
                else if (emoteUrl.includes('frankerfacez.com') || (dataProvider === 'ffz' && !emoteUrl.includes('betterttv.net'))) {
                    platform = 'ffz';
                    emoteUrl = emote.src;
                    emoteName = emoteName || emoteUrl.split('/').pop().replace(/\.webp|\.png/, '') || 'Unnamed';
                    emotePrefix = emoteUrl;
                }
                else if (emoteUrl.includes('jtvnw.net') || dataProvider === 'twitch') {
                    platform = 'TwitchChannel';
                    emoteName = emoteName || emoteUrl.split('/').pop() || 'Unnamed';
                    const match = emoteName.match(/^([a-z0-9]+)([A-Z].*|\d+.*)$/i);
                    emotePrefix = match ? match[1] : emoteName.split(/[^a-zA-Z0-9]/)[0] || emoteName;
                    emoteUrl = '';
                }
                else if (dataProvider === 'emoji') {
                    platform = 'emoji';
                    emoteName = emoteName || emoteUrl.split('/').pop() || 'Unnamed';
                    emotePrefix = emoteName;
                    emoteUrl = emote.src;
                }
                else {
                    platform = 'TwitchChannel';
                    emoteName = emoteName || emoteUrl.split('/').pop() || 'Unnamed';
                    const match = emoteName.match(/^([a-z0-9]+)([A-Z].*|\d+.*)$/i);
                    emotePrefix = match ? match[1] : emoteName.split(/[^a-zA-Z0-9]/)[0] || emoteName;
                    emoteUrl = '';
                }
                if (!emoteName || emoteName === 'Unknown') {
                    emoteName = targetElement?.getAttribute('data-id') || emoteUrl.split('/').pop() || 'Unnamed';
                }
                console.log(`[Content] Blocking Twitch emote:`, { emoteName, platform, emoteUrl, emotePrefix });
                const item = addEmoteOrChannel(emotePrefix, platform, emoteName, emoteUrl, targetElement);
                if (item && targetElement) {
                    targetElement.setAttribute('data-emote-id', item.id);
                    targetElement.style.display = 'none';
                    console.log(`[Content] Immediately hid Twitch emote ${emoteName} with ID ${item.id}`);
                    const parentContainer = targetElement.closest('.ffz--inline, .chat-line__message, .chat-image');
                    if (parentContainer) {
                        const allEmotes = parentContainer.querySelectorAll('img.chat-line__message--emote, .ffz-emote, .seventv-emote, .bttv-emote, .twitch-emote, .chat-image');
                        const allBlocked = Array.from(allEmotes).every(e => e.style.display === 'none');
                        if (allBlocked) {
                            parentContainer.style.display = 'none';
                            console.log("[Content] Parent container hidden as all emotes are blocked");
                        }
                    }
                    if (uiElements?.counter) {
                        updateCounter(uiElements.counter);
                    }
                    setStorage(() => {
                        console.log("[Content] Storage updated after blocking Twitch emote");
                        toggleEmotesInNode(document.body, true);
                    });
                }
                else {
                    console.error("[Content] Failed to block Twitch emote:", emote);
                    if (window.Notifications?.showPanelNotification) {
                        window.Notifications.showPanelNotification('Ошибка: эмодзи уже заблокирован или не удалось добавить', 5000, false);
                    }
                }
                // popup.remove(); удаляем что бы не мешал //
                // popup.remove(); //
                callback(emote);
                if (twitchCard) {
                    preventHidingElements([], '[data-a-target="viewer-card-positioner"]');
                }
            });
            option.appendChild(left);
            // option.appendChild(blockButton); //
            optionsContainer.appendChild(option);
        });
        console.log("[Content] Twitch popup populated with", emotes.length, "emotes");
        // Кнопка закрытия попапа
        const closeButton = popup.querySelector('.close-twitch-emote-popup-button');
        closeButton.onclick = () => {
            console.log("[Content] Twitch emote popup closed via close button");
            popup.remove();
            if (twitchCard) {
                preventHidingElements([], '[data-a-target="viewer-card-positioner"]');
            }
        };
        // Анимация
        setTimeout(() => {
            popup.classList.add('visible');
            popup.style.opacity = '1';
            popup.style.transform = 'scale(1)';
            console.log("[Content] Twitch popup visibility class and styles applied");
        }, 10);
        // Закрытие при клике вне попапа
        document.addEventListener('click', function closePopup(e) {
            if (!popup.contains(e.target) && e.target !== popup && (!twitchCard || !twitchCard.contains(e.target))) {
                console.log("[Content] Closing Twitch popup due to outside click");
                popup.remove();
                if (twitchCard) {
                    preventHidingElements([], '[data-a-target="viewer-card-positioner"]');
                }
            }
        }, { capture: true, once: true });
        // Обход проблемы с асинхронным добавлением кнопки закрытия
        const waitForCloseButton = setInterval(() => {
            const twitchCardCloseButton = twitchCard?.querySelector('button[aria-label="Hide"], button[aria-label="Close"]');
            if (twitchCardCloseButton) {
                twitchCardCloseButton.removeEventListener('click', twitchCardCloseButton._closeHandler);
                twitchCardCloseButton._closeHandler = () => {
                    console.log("[Content] Twitch viewer card close button clicked");
                    popup.remove();
                    preventHidingElements([], '[data-a-target="viewer-card-positioner"]');
                };
                twitchCardCloseButton.addEventListener('click', twitchCardCloseButton._closeHandler, { once: true });
                clearInterval(waitForCloseButton);
            }
        }, 2000);
    }

    // ========= Наблюдатель за появлением карточки Twitch ======== //
    let twitchCardObserver;
    function observeTwitchCard() {
        if (twitchCardObserver) {
            twitchCardObserver.disconnect();
        }
        twitchCardObserver = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.matches && (node.matches('[data-a-target="viewer-card-positioner"]') || node.matches('.viewer-card'))) {
                        console.log('[Content] Twitch viewer card detected in DOM:', node);
                        node.__popup_shown = true;
                        const emotes = getEmotesFromTwitchCard(node);
                        if (emotes.length) {
                            console.log('[Content] Showing Twitch emote popup for detected card:', emotes);
                            showTwitchEmotePopup(emotes, (selectedEmote) => {
                                let emoteName = selectedEmote.alt || 'Unnamed';
                                let emoteUrl = selectedEmote.src || '';
                                let emotePrefix = emoteName;
                                const platform = selectedEmote.platform || 'Twitch';
                                if (platform === 'TwitchChannel' || platform === 'emoji') {
                                    const match = emoteName.match(/^([a-z0-9]+)([A-Z].*|\d+.*)$/i);
                                    emotePrefix = match ? match[1] : emoteName.split(/[^a-zA-Z0-9]/)[0] || emoteName;
                                    emoteUrl = platform === 'emoji' ? emoteUrl : '';
                                }
                                else {
                                    emotePrefix = emoteUrl || emoteName;
                                }
                                console.log(`[Content] Blocking selected Twitch emote from popup:`, { emoteName, platform, emoteUrl, emotePrefix });
                                const item = addEmoteOrChannel(emotePrefix, platform, emoteName, emoteUrl, selectedEmote.element);
                                if (item) {
                                    if (selectedEmote.element) {
                                        selectedEmote.element.setAttribute('data-emote-id', item.id);
                                        selectedEmote.element.style.display = 'none';
                                        console.log(`[Content] Immediately hid Twitch emote ${emoteName} with ID ${item.id}`);
                                    }
                                    setStorage(() => {
                                        console.log("[Content] Storage updated after blocking from Twitch popup");
                                        toggleEmotesInNode(document.body, true);
                                    });
                                }
                                else {
                                    console.error("[Content] Failed to block Twitch emote from popup:", selectedEmote);
                                }
                            });
                        }
                        preventHidingElements([], '[data-a-target="viewer-card-positioner"]');
                    }
                });
            });
        });
        twitchCardObserver.observe(document.body, { childList: true, subtree: true });
    }
    // Запускаем наблюдатель
    observeTwitchCard();

    function getEmotesFromTwitchCard(card) {
        const emotes = [];
        const mainEmoteImg = card.querySelector('.emote-card__big-emote');
        const displayName = card.querySelector('h4[data-test-selector="emote-code-header"]')?.textContent?.trim() || 'Unnamed';
        const platform = card.querySelector('p[data-test-selector="emote-type-copy"]')?.textContent?.trim() || 'Twitch';
        if (mainEmoteImg) {
            emotes.push({
                src: mainEmoteImg.src,
                alt: mainEmoteImg.alt || displayName,
                platform: platform,
                element: mainEmoteImg,
                id: mainEmoteImg.src.split('/').slice(-2, -1)[0] || ''
            });
        }
        console.log("[Content] Extracted emotes from Twitch card:", emotes);
        return emotes;
    }

    // Часть viewerCardObserver для Twitch
    const viewerCardObserverTwitch = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.matches && node.matches('[data-a-target="viewer-card-positioner"]') && !node.__popup_shown) {
                    node.__popup_shown = true;
                    const emotes = getEmotesFromTwitchCard(node);
                    if (emotes.length) {
                        console.log("[Content] Showing Twitch emote popup for detected card:", emotes);
                        showTwitchEmotePopup(emotes, (selectedEmote) => {
                            console.log("[Content] Blocking Twitch emote:", selectedEmote);
                        });
                    }
                    preventHidingElements([], '[data-a-target="viewer-card-positioner"]');
                }
            });
        });
    });
    viewerCardObserverTwitch.observe(document.body, { childList: true, subtree: true });

})();


// ======= send_in-chat_from-popup-emote.js ======== //

// Добавляет кнопку "Отправить в чат" в попап выбора эмодзи (emote-selection-popup)
// Последнее обновление: декабрь 2025

(function () {
    'use strict';

    const DEBUG = false;
    const log = (...args) => DEBUG && console.log('[SendToChat]', ...args);
    const warn = (...args) => console.warn('[SendToChat]', ...args);

    // ────────────────────────────────────────────────
    // 1. Функция получения текста всех эмодзи из попапа
    // ────────────────────────────────────────────────
    function getAllEmoteTextsFromPopup(popup) {
        const spans = popup.querySelectorAll('.emote-info span');
        if (!spans.length) return '';

        const texts = Array.from(spans)
            .map(span => {
                // Берём только текстовые узлы первого уровня (без вложенного <span>(platform)</span>)
                const text = Array.from(span.childNodes)
                    .filter(node => node.nodeType === Node.TEXT_NODE)
                    .map(node => node.textContent.trim())
                    .join('')
                    .replace(/\s*\([^)]+\)\s*/g, '')     // убираем (ffz), (7tv) и т.п.
                    .trim();

                return text;
            })
            .filter(Boolean);

        if (!texts.length) return '';

        // Добавляем пробелы по краям — как в оригинальной кнопке paste
        return ` ${texts.join(' ')} `;
    }

    // ────────────────────────────────────────────────
    // 2. Функция отправки сообщения в чат Twitch
    // ────────────────────────────────────────────────
    function sendMessageToTwitchChat(message) {
        if (!message.trim()) {
            warn('Попытка отправить пустое сообщение');
            return false;
        }

        // 1. Находим поле ввода
        const chatInput = document.querySelector('[data-a-target="chat-input"]');
        if (!chatInput) {
            warn('Поле ввода чата не найдено');
            return false;
        }

        // 2. Фокусируем
        chatInput.focus();

        // 3. Вставляем текст
        try {
            if (chatInput.tagName.toLowerCase() === 'textarea') {
                chatInput.value = message;
                chatInput.setSelectionRange(message.length, message.length);
            } else if (chatInput.isContentEditable || chatInput.contentEditable === 'true') {
                chatInput.textContent = message;
                const range = document.createRange();
                range.selectNodeContents(chatInput);
                range.collapse(false);
                const sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
            } else {
                warn('Неизвестный тип поля ввода чата');
                return false;
            }

            // 4. Имитируем нажатие Enter
            const enterEvent = new KeyboardEvent('keydown', {
                bubbles: true,
                cancelable: true,
                key: 'Enter',
                code: 'Enter',
                keyCode: 13,
                which: 13
            });

            const success = chatInput.dispatchEvent(enterEvent);

            if (success) {
                log('Сообщение отправлено в чат:', message);
                return true;
            } else {
                warn('Событие keydown Enter было предотвращено');
                return false;
            }
        } catch (err) {
            warn('Ошибка при отправке сообщения в чат:', err);
            return false;
        }
    }

    // ────────────────────────────────────────────────
    // 3. Создание и вставка кнопки "Отправить в чат"
    // ────────────────────────────────────────────────
    function addSendToChatButton(popupId = 'emote-selection-popup') {
        // Ждём появления попапа
        const popup = document.getElementById(popupId);
        if (!popup) {
            // Если попапа ещё нет — пробуем через 300–400 мс
            setTimeout(() => addSendToChatButton(popupId), 400);
            return;
        }

        // Уже есть кнопка? Не создаём дубликат
        if (popup.querySelector('.send-to-chat-button')) {
            log('Кнопка "Отправить в чат" уже существует');
            return;
        }

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'send-to-chat-button';
        btn.style.cssText = `
            background: rgba(0, 204, 153, 0.18);
            color: rgba(0, 255, 204, 0.9);
            border: none;
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            position: absolute;
            top: 6px;
            left: 100px;               /* правее кнопки paste */
            display: flex;
            align-items: center;
            gap: 6px;
        `;

        btn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:16px;height:16px;">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
            chat
        `;

        btn.addEventListener('click', () => {
            const text = getAllEmoteTextsFromPopup(popup);
            if (!text) {
                warn('Нет эмодзи для отправки');
                return;
            }

            const sent = sendMessageToTwitchChat(text);
            if (sent && window.Notifications?.showPanelNotification) {
                window.Notifications.showPanelNotification(`Отправлено в чат: ${text.trim()}`, 4000, false);
            }
        });

        popup.appendChild(btn);
        log('Кнопка "Отправить в чат" добавлена в попап');
    }

    // ────────────────────────────────────────────────
    // Запуск
    // ────────────────────────────────────────────────
    function init() {
        // Пытаемся сразу
        addSendToChatButton();

        // На случай если попап появится позже (динамически)
        const observer = new MutationObserver(() => {
            if (document.getElementById('emote-selection-popup')) {
                addSendToChatButton();
                // Можно отключить после первого успешного добавления
                // observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();

// ======= popupemote-styles-inject.js ======== //

(function() {
    // Проверяем, не добавлен ли уже этот стиль (по уникальному селектору, чтобы избежать дубликатов)
    if (document.querySelector('#popupemote-styles-inject')) {
        console.log('Стили уже инжектированы.');
        return;
    }

    var style = document.createElement('style');
    style.id = 'popupemote-styles-inject'; // Уникальный ID для идентификации
    style.type = 'text/css';

    style.innerHTML = `
  #emote-selection-popup {
    position: fixed;
    box-shadow: rgba(75, 191, 191, 0.24) 0px 4px 10px 2px;
    background: linear-gradient(205deg, rgb(64, 111, 118), rgb(59, 29, 71));
    color: rgb(235, 235, 235);
    font-weight: bold;
    font-size: 16px;
    border: 1px solid rgb(18, 182, 167);
    border-radius: 8px;
    padding: 32px 10px 10px;
    z-index: 555555;
    max-width: 395px;
    max-height: 500px;
    width: 240px;
    overflow-y: auto;
    transition: opacity 0.2s, transform 0.2s;
    opacity: 1;
    transform: scale(1);
    display: block;
    visibility: visible;
    left: 708px;
    top: 473px;
}
    `;

    document.head.appendChild(style);
    console.log('Стили успешно инжектированы.');
})();
