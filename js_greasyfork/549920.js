// ==UserScript==
// @name               Script Notifier
// @namespace          http://github.com/0H4S
// @version            2.5
// @author             OHAS
// @description        Sistema de notificação para UserScripts.
// @license            CC-BY-NC-ND-4.0
// @copyright          2026 OHAS. All Rights Reserved. (https://gist.github.com/0H4S/ae2fa82957a089576367e364cbf02438)
// ==/UserScript==

/*
    Copyright Notice & Terms of Use
    Copyright © 2026 OHAS. All Rights Reserved.

    This software is the exclusive property of OHAS and is licensed for personal, non-commercial use only.

    You may:
    - Install, use, and inspect the code for learning or personal purposes.

    You may NOT (without prior written permission from the author):
    - Copy, redistribute, or republish this software.
    - Modify, sell, or use it commercially.
    - Create derivative works.

    For questions, permission requests, or alternative licensing, please contact via
    - GitHub:       https://github.com/0H4S
    - Greasy Fork:  https://greasyfork.org/users/1464180

    This software is provided "as is", without warranty of any kind. The author is not liable for any damages arising from its use.
*/

class ScriptNotifier {
    constructor({ notificationsUrl, scriptVersion, currentLang, runtimePolicy }) {
        this.NOTIFICATIONS_URL           = notificationsUrl;
        this.SCRIPT_VERSION              = scriptVersion;
        this.forcedLang                  = currentLang;
        this.currentLang                 = 'en';
        this.STAGGER_DELAY               = 70;
        this.DISMISSED_NOTIFICATIONS_KEY = 'DismissedNotifications';
        this.NOTIFICATIONS_ENABLED_KEY   = 'NotificationsEnabled';
        this.LANG_STORAGE_KEY            = 'UserScriptLang';
        this.USAGE_COUNT_KEY             = 'ScriptUsageCount';
        this.USAGE_CAP                   = 1000;
        this.hostElement                 = null;
        this.shadowRoot                  = null;
        this.activeNotifications         = [];
        this.currentUsageCount           = 0;
        this.uiStrings                   = {};
        this.icons                       = this._getIcons();
        this.mediaCache                  = new Map();
        this.scriptPolicy                = runtimePolicy || this._createPolicy();
    }

    _fetchResourceAsBlobUrl(url) {
        if (this.mediaCache.has(url)) {
            return this.mediaCache.get(url);
        }
        const fetchPromise = new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                responseType: 'blob',
                anonymous: true,
                onload: (response) => {
                    if (response.status >= 200 && response.status < 300) {
                        const blobUrl = URL.createObjectURL(response.response);
                        resolve(blobUrl);
                    } else {
                        this.mediaCache.delete(url);
                        reject(new Error(`HTTP error ${response.status}`));
                    }
                },
                onerror: (err) => {
                    this.mediaCache.delete(url);
                    reject(err);
                }
            });
        });
        this.mediaCache.set(url, fetchPromise);
        return fetchPromise;
    }

    async _processMediaInContainer(container) {
        const mediaElements = [
            ...container.querySelectorAll('img[src^="http"]'),
            ...container.querySelectorAll('video[src^="http"], source[src^="http"]')
        ];
        const processElement = async (el) => {
            const originalUrl = el.src || el.getAttribute('src');
            if (!originalUrl) return;
            try {
                const blobUrl = await this._fetchResourceAsBlobUrl(originalUrl);
                el.src = blobUrl;
                if (el.tagName === 'SOURCE') {
                    const videoParent = el.closest('video');
                    if (videoParent) videoParent.load();
                }
            } catch (e) {
            }
        };
        await Promise.all(mediaElements.map(processElement));
    }

    async _incrementUsageCount() {
        let count = await GM_getValue(this.USAGE_COUNT_KEY, 0);
        if (count >= this.USAGE_CAP) {
            return this.USAGE_CAP;
        }
        count++;
        await GM_setValue(this.USAGE_COUNT_KEY, count);
        return count;
    }

    async run() {
        await this._initializeLanguage();
        this.currentUsageCount = await this._incrementUsageCount();
        await this._registerUserCommands();
        setTimeout(() => this.checkForNotifications(), 1500);
    }

    forceShowAllNotifications() {
        this.checkForNotifications(true);
    }

    checkForNotifications(forceShow = false) {
        if (!this.NOTIFICATIONS_URL || this.NOTIFICATIONS_URL.includes("SEU_USUARIO")) return;
        GM_xmlhttpRequest({
            method: 'GET',
            url: `${this.NOTIFICATIONS_URL}?t=${new Date().getTime()}`,
            onload: async (response) => {
                if (response.status < 200 || response.status >= 300) {return;}
                let jsonString;
                const isGistPage = this.NOTIFICATIONS_URL.includes('gist.github.com/') && !this.NOTIFICATIONS_URL.includes('usercontent');
                if (isGistPage) {
                    try {
                        const parser = new DOMParser();
                        const trustedHtml = this.scriptPolicy
                            ? this.scriptPolicy.createHTML(response.responseText)
                            : response.responseText;
                        const doc = parser.parseFromString(trustedHtml, 'text/html');
                        const codeLines = doc.querySelectorAll('table.highlight .blob-code-inner');
                        if (codeLines.length === 0) {return;}
                        jsonString = Array.from(codeLines).map(line => line.innerText).join('\n');
                    } catch (e) {return;}
                } else {
                    jsonString = response.responseText;
                }
                try {
                    const data = JSON.parse(jsonString);
                    const notifications = data.notifications || [];
                    if (forceShow) {
                        this.activeNotifications.forEach(n => n.element.remove());
                        this.activeNotifications = [];
                    }
                    await this._cleanupDismissedNotifications(notifications);
                    const dismissed = await GM_getValue(this.DISMISSED_NOTIFICATIONS_KEY, []);
                    const notificationsToDisplay = notifications.filter(notification => {
                        if (this.activeNotifications.some(n => n.id === notification.id)) return false;
                        if (!forceShow && dismissed.includes(notification.id)) return false;
                        if (notification.expires && new Date(notification.expires) < new Date()) return false;
                        if (typeof notification.minUsageCount === 'number') {
                            if (this.currentUsageCount < notification.minUsageCount) {
                                return false;
                            }
                        }
                        if (typeof notification.maxUsageCount === 'number') {
                            if (this.currentUsageCount > notification.maxUsageCount) {
                                return false;
                            }
                        }
                        const targetVersion = notification.targetVersion;
                        const scriptVersion = this.SCRIPT_VERSION;
                        if (targetVersion && targetVersion !== 'all') {
                            let versionMatch = false;
                            if (typeof targetVersion === 'string') {
                                if (targetVersion.includes(',')) {
                                    const specificVersions = targetVersion.split(',').map(v => v.trim());
                                    if (specificVersions.includes(scriptVersion)) {
                                        versionMatch = true;
                                    }
                                }
                                else if (targetVersion.startsWith('*')) {
                                    const versionToCompare = targetVersion.substring(1);
                                    if (this._compareVersions(scriptVersion, versionToCompare) <= 0) {
                                        versionMatch = true;
                                    }
                                }
                                else if (targetVersion.endsWith('*')) {
                                    const versionToCompare = targetVersion.slice(0, -1);
                                    if (this._compareVersions(scriptVersion, versionToCompare) >= 0) {
                                        versionMatch = true;
                                    }
                                }
                                else if (targetVersion === scriptVersion) {
                                    versionMatch = true;
                                }
                            }
                            if (!versionMatch) {
                                return false;
                            }
                        }
                        if (notification.targetHostname && window.location.hostname !== notification.targetHostname) return false;
                        return true;
                    });
                    notificationsToDisplay.forEach((notification, index) => {
                        setTimeout(() => this.displayNotification(notification), index * 200);
                    });
                } catch (e) {}
            },
            onerror: () => {}
        });
    }

    async displayNotification(notification) {
        this._ensureHostElement();
        const notificationsEnabled = await GM_getValue(this.NOTIFICATIONS_ENABLED_KEY, true);
        if (notification.priority !== 'high' && !notificationsEnabled) return;
        const notificationId = `notification-${notification.id}`;
        if (this.shadowRoot.getElementById(notificationId)) return;
        const title = this._getTranslatedText(notification.title);
        const message = this._getTranslatedText(notification.message);
        if (!title && !message) return;
        const container = document.createElement('div');
        container.id = notificationId;
        container.className = 'notification-container';
        const notificationType = notification.type || 'info';
        container.dataset.type = notificationType;
        const finalColor = this._resolveThemeColor(notification.customColor);
        if (finalColor) {
            container.style.borderLeftColor = finalColor;
            container.style.setProperty('--type-color', finalColor);
        }
        let iconHTML = this.icons[notificationType] || this.icons['info'];
        if (notification.customIconSvg) {
            iconHTML = this._sanitizeAndStyleSvg(notification.customIconSvg);
        }
        const imageOrIconHTML = notification.imageUrl ?
            `<img src="${notification.imageUrl}" class="notification-image" alt="Notification Image">` :
            `<div class="notification-icon">${iconHTML}</div>`;
        let expandButtonHTML = '';
        if (notification.expanded && notification.expanded.content) {
            const expandIconSVG = `<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>`;
            expandButtonHTML = `<button class="expand-button" title="${this._getUIText('expandButtonTitle')}">${expandIconSVG}</button>`;
        }
        const closeIconSVG = `<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg>`;
        const notificationHTML = `
          ${imageOrIconHTML}
          <div class="notification-content">
              <h3 class="notification-title">${this._prepareMessageHTML(title)}</h3>
              <div class="notification-message">${this._prepareMessageHTML(message)}</div>
          </div>
          <div class="notification-actions">
            ${expandButtonHTML}
            <button class="dismiss-button" title="${this._getUIText('closeButtonTitle')}">${closeIconSVG}</button>
          </div>
        `;
        this._setSafeInnerHTML(container, notificationHTML);
        if (notification.buttons && notification.buttons.length > 0) {
            const buttonsContainer = this._createButtons(notification.buttons, notification.id, notification);
            container.querySelector('.notification-content').appendChild(buttonsContainer);
        }
        this.shadowRoot.appendChild(container);
        this._processMediaInContainer(container);
        this.activeNotifications.push({ id: notification.id, element: container, isNew: true });
        this._updateNotificationPositions();
        container.querySelector('.dismiss-button').onclick = (e) => {
            e.stopPropagation();
            this._dismissNotification(notification.id);
        };
        const expandBtn = container.querySelector('.expand-button');
        if (expandBtn) {
            expandBtn.onclick = (e) => {
                e.stopPropagation();
                this._openExpandedView(notification);
            };
        }
    }

    _resolveThemeColor(colorInput) {
        if (!colorInput) return null;
        if (typeof colorInput === 'string') return colorInput;
        if (typeof colorInput === 'object') {
            const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (isDark) {
                return colorInput.te || colorInput.tc;
            } else {
                return colorInput.tc || colorInput.te;
            }
        }
        return null;
    }

    _openExpandedView(notification) {
        this._ensureHostElement();
        if (this.shadowRoot.getElementById('sn-expanded-modal')) return;
        const modalOverlay = document.createElement('div');
        modalOverlay.id = 'sn-expanded-modal';
        modalOverlay.className = 'modal-overlay';
        const expandedData = notification.expanded || {};
        const expandedContent = this._getTranslatedText(expandedData.content) || "Conteúdo indisponível.";
        const title = this._getTranslatedText(expandedData.title) || this._getTranslatedText(notification.title);
        const headerImageUrl = expandedData.headerImage || null;
        const summaryText = this._getTranslatedText(expandedData.summary) || null;
        const closeIconSVG = `<svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg>`;
        const headerHTML = headerImageUrl
            ? `<img src="${headerImageUrl}" class="modal-hero-img" alt="Header">`
            : '';
        const summaryHTML = summaryText
            ? `<div class="modal-summary">${this._prepareMessageHTML(summaryText)}</div>`
            : '';
        const modalHTML = `
            <div class="modal-card">
                <button class="modal-close-btn floating" title="Fechar">${closeIconSVG}</button>
                ${headerHTML}
                <div class="modal-inner-content">
                    <div class="modal-header">
                        <h1 class="modal-title">${this._prepareMessageHTML(title)}</h1>
                        ${summaryHTML}
                    </div>
                    <div class="modal-body">
                        ${expandedContent}
                    </div>
                </div>
            </div>
        `;
        this._setSafeInnerHTML(modalOverlay, modalHTML);
        this.shadowRoot.appendChild(modalOverlay);
        this._processMediaInContainer(modalOverlay);
        requestAnimationFrame(() => { modalOverlay.classList.add('animate-in'); });
        const closeModal = () => {
            modalOverlay.classList.remove('animate-in');
            modalOverlay.classList.add('animate-out');
            setTimeout(() => modalOverlay.remove(), 300);
        };
        modalOverlay.querySelector('.modal-close-btn').onclick = closeModal;
        modalOverlay.querySelector('.modal-card').onclick = (e) => {
            if (e.target.tagName === 'IMG') {
                e.stopPropagation();
                this._openLightbox(e.target.src);
            }
        };
    }

    _openLightbox(imgSrc) {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox-overlay';
        const img = document.createElement('img');
        img.src = imgSrc;
        img.className = 'lightbox-img';
        img.draggable = false;
        lightbox.appendChild(img);
        this.shadowRoot.appendChild(lightbox);
        let scale = 1;
        let isDragging = false;
        let startX, startY, translateX = 0, translateY = 0;
        const updateTransform = () => {
            img.style.transform = `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`;
        };
        const closeLightbox = () => {
            lightbox.classList.remove('visible');
            document.removeEventListener('keydown', handleEsc);
            setTimeout(() => lightbox.remove(), 300);
        };
        const handleEsc = (e) => {
            if (e.key === 'Escape') closeLightbox();
        };
        document.addEventListener('keydown', handleEsc);
        lightbox.onclick = (e) => {
            if (e.target === lightbox) closeLightbox();
        };
        lightbox.onwheel = (e) => {
            e.preventDefault();
            const delta = e.deltaY > 0 ? -0.2 : 0.2;
            const newScale = Math.min(Math.max(1, scale + delta), 5);
            if (newScale !== scale) {
                scale = newScale;
                if (scale === 1) {
                    translateX = 0;
                    translateY = 0;
                }
                updateTransform();
            }
        };
        img.onpointerdown = (e) => {
            if (scale > 1) {
                isDragging = true;
                img.classList.add('dragging');
                startX = e.clientX - translateX;
                startY = e.clientY - translateY;
                img.setPointerCapture(e.pointerId);
            }
        };
        img.onpointermove = (e) => {
            if (!isDragging) return;
            translateX = e.clientX - startX;
            translateY = e.clientY - startY;
            requestAnimationFrame(updateTransform);
        };
        img.onpointerup = () => {
            isDragging = false;
            img.classList.remove('dragging');
        };
        requestAnimationFrame(() => lightbox.classList.add('visible'));
    }

    _createButtons(buttonDataArray, notificationId, notification) {
        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'notification-buttons';
        buttonDataArray.forEach((buttonData, index) => {
            const button = document.createElement('button');
            const buttonText = this._getTranslatedText(buttonData.text);
            this._setSafeInnerHTML(button, this._prepareMessageHTML(buttonText));
            button.className = 'notification-button';
            const finalBgColor = this._resolveThemeColor(buttonData.backgroundColor);
            if (finalBgColor) {
                button.style.backgroundColor = finalBgColor;
                button.classList.add('custom-bg');
            } else if (index === 0) {
                button.classList.add('primary');
            }
            const finalTextColor = this._resolveThemeColor(buttonData.textColor);
            if (finalTextColor) {
                button.style.color = finalTextColor;
            }
            button.onclick = (e) => {
                e.stopPropagation();
                if (buttonData.action) {
                    switch (buttonData.action) {
                        case 'open_url': window.location.href = buttonData.value; break;
                        case 'open_url_new_tab': window.open(buttonData.value, '_blank'); break;
                        case 'open_expanded_view':
                            if (notification && notification.expanded && notification.expanded.content) {
                                this._openExpandedView(notification);
                            }
                            break;
                    }
                }
                this._dismissNotification(notificationId);
            };
            buttonsContainer.appendChild(button);
        });
        return buttonsContainer;
    }

    async _dismissNotification(notificationId) {
        this._ensureHostElement();
        const notification = this.activeNotifications.find(n => n.id === notificationId);
        if (!notification) return;
        const dismissed = await GM_getValue(this.DISMISSED_NOTIFICATIONS_KEY, []);
        if (!dismissed.includes(notificationId)) {
            dismissed.push(notificationId);
            await GM_setValue(this.DISMISSED_NOTIFICATIONS_KEY, dismissed);
        }
        notification.element.classList.remove('animate-in');
        notification.element.classList.add('animate-out');
        setTimeout(() => {
            this.activeNotifications = this.activeNotifications.filter(n => n.id !== notificationId);
            notification.element.remove();
            this._updateNotificationPositions();
        }, 600);
    }

    _updateNotificationPositions() {
        this._ensureHostElement();
        const spacingValue = parseInt(getComputedStyle(this.shadowRoot.host).getPropertyValue('--sn-spacing')) || 20;
        let currentTop = spacingValue;
        this.activeNotifications.forEach((notif, index) => {
            const { element } = notif;
            element.style.top = `${currentTop}px`;
            element.style.transitionDelay = `${index * this.STAGGER_DELAY}ms`;
            if (notif.isNew) {
                requestAnimationFrame(() => {
                    element.classList.add('animate-in');
                });
                delete notif.isNew;
            }
            currentTop += element.offsetHeight + (spacingValue / 2);
        });
    }

    _compareVersions(v1, v2) {
        const parts1 = v1.split('.').map(part => parseInt(part, 10) || 0);
        const parts2 = v2.split('.').map(part => parseInt(part, 10) || 0);
        const maxLength = Math.max(parts1.length, parts2.length);
        for (let i = 0; i < maxLength; i++) {
            const p1 = parts1[i] || 0;
            const p2 = parts2[i] || 0;
            if (p1 > p2) return 1;
            if (p1 < p2) return -1;
        }
        return 0;
    }

    _ensureHostElement() {
        const hostId = 'script-notifier-host';
        this.hostElement = document.getElementById(hostId);
        if (!this.hostElement) {
            this.hostElement = document.createElement('div');
            this.hostElement.id = hostId;
            document.body.appendChild(this.hostElement);
        }
        if (!this.hostElement.shadowRoot) {
            this.shadowRoot = this.hostElement.attachShadow({ mode: 'open' });
            const style = document.createElement('style');
            style.textContent = this._getNotifierStyles();
            this.shadowRoot.appendChild(style);
        } else {
            this.shadowRoot = this.hostElement.shadowRoot;
        }
    }

    async _initializeLanguage() {
        const supportedLanguages = ['pt-BR', 'zh-CN', 'ckb', 'ar', 'be', 'bg', 'cs', 'da', 'de', 'el', 'en', 'eo', 'es', 'fi', 'fr', 'he', 'hr', 'hu', 'id', 'it', 'ja', 'ka', 'ko', 'mr', 'nb', 'nl', 'pl', 'ro', 'ru', 'sk', 'sr', 'sv', 'th', 'tr', 'uk', 'ug', 'vi'];
        let lang = this.forcedLang || await GM_getValue(this.LANG_STORAGE_KEY) || navigator.language || 'en';
        if      (lang.startsWith('pt'))  lang = 'pt-BR';
        else if (lang.startsWith('zh'))  lang = 'zh-CN'; else if (lang.startsWith('ckb')) lang = 'ckb';   else if (lang.startsWith('en'))  lang = 'en';
        else if (lang.startsWith('es'))  lang = 'es';    else if (lang.startsWith('fr'))  lang = 'fr';    else if (lang.startsWith('ru'))  lang = 'ru';
        else if (lang.startsWith('ja'))  lang = 'ja';    else if (lang.startsWith('ko'))  lang = 'ko';    else if (lang.startsWith('ar'))  lang = 'ar';
        else if (lang.startsWith('be'))  lang = 'be';    else if (lang.startsWith('bg'))  lang = 'bg';    else if (lang.startsWith('cs'))  lang = 'cs';
        else if (lang.startsWith('da'))  lang = 'da';    else if (lang.startsWith('de'))  lang = 'de';    else if (lang.startsWith('el'))  lang = 'el';
        else if (lang.startsWith('eo'))  lang = 'eo';    else if (lang.startsWith('fi'))  lang = 'fi';    else if (lang.startsWith('he'))  lang = 'he';
        else if (lang.startsWith('hr'))  lang = 'hr';    else if (lang.startsWith('hu'))  lang = 'hu';    else if (lang.startsWith('id'))  lang = 'id';
        else if (lang.startsWith('it'))  lang = 'it';    else if (lang.startsWith('ka'))  lang = 'ka';    else if (lang.startsWith('mr'))  lang = 'mr';
        else if (lang.startsWith('nl'))  lang = 'nl';    else if (lang.startsWith('pl'))  lang = 'pl';    else if (lang.startsWith('ro'))  lang = 'ro';
        else if (lang.startsWith('sk'))  lang = 'sk';    else if (lang.startsWith('sr'))  lang = 'sr';    else if (lang.startsWith('sv'))  lang = 'sv';
        else if (lang.startsWith('th'))  lang = 'th';    else if (lang.startsWith('tr'))  lang = 'tr';    else if (lang.startsWith('uk'))  lang = 'uk';
        else if (lang.startsWith('ug'))  lang = 'ug';    else if (lang.startsWith('vi'))  lang = 'vi';    else if (lang.startsWith('nb') || lang.startsWith('no')) lang = 'nb';
        this.currentLang = supportedLanguages.includes(lang) ? lang : 'en';
        this.uiStrings = this._getUIStrings();
    }

    async _cleanupDismissedNotifications(serverNotifications) {
        const dismissed = await GM_getValue(this.DISMISSED_NOTIFICATIONS_KEY, []);
        if (dismissed.length === 0) return;
        const validServerIds = new Set(serverNotifications.filter(n => !n.expires || new Date(n.expires) >= new Date()).map(n => n.id));
        const cleanedDismissed = dismissed.filter(id => validServerIds.has(id));
        if (cleanedDismissed.length < dismissed.length) {
            await GM_setValue(this.DISMISSED_NOTIFICATIONS_KEY, cleanedDismissed);
        }
    }

    async _registerUserCommands() {
        const notificationsEnabled = await GM_getValue(this.NOTIFICATIONS_ENABLED_KEY, true);
        const toggleCommandText = notificationsEnabled
            ? this._getUIText('disableNotificationsCmd')
            : this._getUIText('enableNotificationsCmd');
        GM_registerMenuCommand(this._getUIText('showAllNotificationsCmd'), () => this.forceShowAllNotifications());
        GM_registerMenuCommand(toggleCommandText, async () => {
            const currentState = await GM_getValue(this.NOTIFICATIONS_ENABLED_KEY, true);
            await GM_setValue(this.NOTIFICATIONS_ENABLED_KEY, !currentState);
            window.location.reload();
        });
    }

    _createPolicy() {
        if (!window.trustedTypes || !window.trustedTypes.createPolicy) return null;
        try {
            return window.trustedTypes.createPolicy('script-notifier-fallback', {
                createHTML: (input) => input
            });
        } catch (e) {
            return null;
        }
    }

    _getUIText(key) {
        return this.uiStrings[key]?.[this.currentLang] || this.uiStrings[key]?.['en'] || '';
    }

    _setSafeInnerHTML(element, html) {
        if (!element) return;
        element.innerHTML = this.scriptPolicy ? this.scriptPolicy.createHTML(html) : html;
    }

    _getTranslatedText(translationObject) {
        if (!translationObject) return '';
        if (typeof translationObject === 'string') return translationObject;
        return translationObject[this.currentLang] || translationObject[this.currentLang.split('-')[0]] || translationObject['en'] || '';
    }

    _prepareMessageHTML(text) {
        return text || '';
    }

    _sanitizeAndStyleSvg(svgString) {
        try {
            const tempDiv = document.createElement('div');
            this._setSafeInnerHTML(tempDiv, svgString);
            const svgElement = tempDiv.querySelector('svg');
            if (!svgElement) return '';
            svgElement.setAttribute     ('fill', 'currentColor');
            svgElement.removeAttribute  ('width');
            svgElement.removeAttribute  ('height');
            svgElement.removeAttribute  ('style');
            svgElement.removeAttribute  ('class');
            return svgElement.outerHTML;
        } catch (e) {
            return '';
        }
    }

    _getUIStrings() {
        return {
            showAllNotificationsCmd: { 'pt-BR': '🔔 Notificações', 'zh-CN': '🔔 通知', 'ckb': '🔔 ئاگادارکردنەوەکان', 'ar': '🔔 الإشعارات', 'be': '🔔 Апавяшчэнні', 'bg': '🔔 Известия', 'cs': '🔔 Upozornění', 'da': '🔔 Notifikationer', 'de': '🔔 Benachrichtigungen', 'el': '🔔 Ειδοποιήσεις', 'en': '🔔 Notifications', 'eo': '🔔 Sciigoj', 'es': '🔔 Notificaciones', 'fi': '🔔 Ilmoitukset', 'fr': '🔔 Notifications', 'he': '🔔 התראות', 'hr': '🔔 Obavijesti', 'hu': '🔔 Értesítések', 'id': '🔔 Notifikasi', 'it': '🔔 Notifiche', 'ja': '🔔 通知', 'ka': '🔔 შეტყობინებები', 'ko': '🔔 알림', 'mr': '🔔 सूचना', 'nb': '🔔 Varsler', 'nl': '🔔 Meldingen', 'pl': '🔔 Powiadomienia', 'ro': '🔔 Notificări', 'ru': '🔔 Уведомления', 'sk': '🔔 Upozornenia', 'sr': '🔔 Обавештења', 'sv': '🔔 Aviseringar', 'th': '🔔 การแจ้งเตือน', 'tr': '🔔 Bildirimler', 'uk': '🔔 Сповіщення', 'ug': '🔔 ئۇقتۇرۇشلار', 'vi': '🔔 Thông báo' },
            disableNotificationsCmd: { 'pt-BR': '❌ Desativar Notificações', 'zh-CN': '❌ 禁用通知', 'ckb': '❌ ناچالاککردنی ئاگادارکردنەوەکان', 'ar': '❌ تعطيل الإشعارات', 'be': '❌ Адключыць аπαвяшчэнні', 'bg': '❌ Изключване на известия', 'cs': '❌ Vypnout upozornění', 'da': '❌ Deaktiver notifikationer', 'de': '❌ Benachrichtigungen deaktivieren', 'el': '❌ Απενεργοποίηση ειδοποιήσεων', 'en': '❌ Disable Notifications', 'eo': '❌ Malŝalti Sciigojn', 'es': '❌ Desactivar Notificaciones', 'fi': '❌ Poista ilmoitukset käytöstä', 'fr': '❌ Désactiver les notifications', 'he': '❌ השבת התראות', 'hr': '❌ Onemogući obavijesti', 'hu': '❌ Értesítések kikapcsolása', 'id': '❌ Nonaktifkan Notifikasi', 'it': '❌ Disattiva notifiche', 'ja': '❌ 通知を無効にする', 'ka': '❌ შეტყობინებების გამორთვა', 'ko': '❌ 알림 비활성화', 'mr': '❌ सूचना अक्षम करा', 'nb': '❌ Slå av varsler', 'nl': '❌ Meldingen uitschakelen', 'pl': '❌ Wyłącz powiadomienia', 'ro': '❌ Dezactivează notificările', 'ru': '❌ Отключить уведомления', 'sk': '❌ Vypnúť upozornenia', 'sr': '❌ Онемогући обавештења', 'sv': '❌ Inaktivera aviseringar', 'th': '❌ ปิดการแจ้งเตือน', 'tr': '❌ Bildirimleri Kapat', 'uk': '❌ Вимкнути сповіщення', 'ug': '❌ ئۇقتۇرۇشلارنى چەكلەش', 'vi': '❌ Tắt thông báo' },
            enableNotificationsCmd: { 'pt-BR': '✅ Ativar Notificações', 'zh-CN': '✅ 启用通知', 'ckb': '✅ چالاککردنی ئاگادارکردنەوەکان', 'ar': '✅ تفعيل الإشعارات', 'be': '✅ Уключыць апавяшчэнні', 'bg': '✅ Включване на известия', 'cs': '✅ Zapnout upozornění', 'da': '✅ Aktiver notifikationer', 'de': '✅ Benachrichtigungen aktivieren', 'el': '✅ Ενεργοποίηση ειδοποιήσεων', 'en': '✅ Enable Notifications', 'eo': '✅ Ŝalti Sciigojn', 'es': '✅ Activar Notificaciones', 'fi': '✅ Ota ilmoitukset käyttöön', 'fr': '✅ Activer les notifications', 'he': '✅ הפעל התראות', 'hr': '✅ Omogući obavijesti', 'hu': '✅ Értesítések bekapcsolása', 'id': '✅ Aktifkan Notifikasi', 'it': '✅ Attiva notifiche', 'ja': '✅ 通知を有効にする', 'ka': '✅ შეტყობინებების ჩართვა', 'ko': '✅ 알림 활성화', 'mr': '✅ सूचना सक्षम करा', 'nb': '✅ Slå på varsler', 'nl': '✅ Meldingen inschakelen', 'pl': '✅ Włącz powiadomienia', 'ro': '✅ Activează notificările', 'ru': '✅ Включить уведомления', 'sk': '✅ Zapnúť upozornenia', 'sr': '✅ Омогући обавештења', 'sv': '✅ Aktivera aviseringar', 'th': '✅ เปิดการแจ้งเตือน', 'tr': '✅ Bildirimleri Aç', 'uk': '✅ Увімкнути сповіщення', 'ug': '✅ ئۇقتۇرۇشلارنى قوزغىتىش', 'vi': '✅ Bật thông báo' },
            expandButtonTitle: { 'pt-BR': 'Expandir', 'zh-CN': '展开', 'ckb': 'بەرینکردنەوە', 'ar': 'توسيع', 'be': 'Разгарнуць', 'bg': 'Разширяване', 'cs': 'Rozbalit', 'da': 'Udvid', 'de': 'Erweitern', 'el': 'Επέκταση', 'en': 'Expand', 'eo': 'Etendi', 'es': 'Expandir', 'fi': 'Laajenna', 'fr': 'Développer', 'he': 'הexpand', 'hr': 'Proširi', 'hu': 'Kibontás', 'id': 'Perluas', 'it': 'Espandi', 'ja': '展開', 'ka': 'გაშლა', 'ko': '확장', 'mr': 'विस्तार करा', 'nb': 'Utvid', 'nl': 'Uitvouwen', 'pl': 'Rozwiń', 'ro': 'Extinde', 'ru': 'Развернуть', 'sk': 'Rozbaliť', 'sr': 'Proširi', 'sv': 'Expandera', 'th': 'ขยาย', 'tr': 'Genişlet', 'uk': 'Розгорнути', 'ug': 'كېڭەيتىش', 'vi': 'Mở rộng' },
            closeButtonTitle: { 'pt-BR': 'Fechar', 'zh-CN': '关闭', 'ckb': 'داخستن', 'ar': 'إغلاق', 'be': 'Закрыць', 'bg': 'Затвори', 'cs': 'Zavřít', 'da': 'Luk', 'de': 'Schließen', 'el': 'Κλείσιμο', 'en': 'Close', 'eo': 'Fermi', 'es': 'Cerrar', 'fi': 'Sulje', 'fr': 'Fermer', 'he': 'סגור', 'hr': 'Zatvori', 'hu': 'Bezárás', 'id': 'Tutup', 'it': 'Chiudi', 'ja': '閉じる', 'ka': 'დახურვა', 'ko': '닫기', 'mr': 'बंद करा', 'nb': 'Lukk', 'nl': 'Sluiten', 'pl': 'Zamknij', 'ro': 'Închide', 'ru': 'Закрыть', 'sk': 'Zavrieť', 'sr': 'Затвори', 'sv': 'Stäng', 'th': 'ปิด', 'tr': 'Kapat', 'uk': 'Закрити', 'ug': 'تاقاش', 'vi': 'Đóng' }
        };
    }

    _getIcons() {
        return {
            success:    `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path></svg>`,
            warning:    `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"></path></svg>`,
            info:       `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"></path></svg>`
        };
    }

    _getNotifierStyles() {
        return `
            :host{--sn-font-family: "Roboto Slab", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Microsoft YaHei", "PingFang SC", "Hiragino Sans GB", "Heiti SC", "Apple SD Gothic Neo", "Noto Sans CJK SC", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";--sn-font-family-code: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace, var(--sn-font-family);--sn-font-size-title: 16px;--sn-font-size-body: 14px;--sn-font-weight-title: 600;--sn-color-background: #fff;--sn-color-text-primary: #000;--sn-color-text-secondary: #333;--sn-color-border: #ddd;--sn-color-link: currentColor;--sn-color-link-underline: currentColor;--sn-color-dismiss: #999;--sn-color-dismiss-hover: #ff4d4d;--sn-color-expand-hover: #007bff;--sn-shadow-default: 0 8px 20px rgba(0, 0, 0, 0.15);--sn-shadow-button-hover: 0 4px 10px rgba(0, 0, 0, 0.2);--sn-card-background: rgba(0, 0, 0, 0.05);--sn-card-border: #ccc;--sn-color-background-overlay: rgba(255, 255, 255, 0.75);--sn-scrollbar-track: #f1f1f1;--sn-scrollbar-thumb: #ccc;--sn-scrollbar-thumb-hover: #aaa;--sn-button-hover-bg: #555;--sn-button-hover-text: #fff;--sn-border-radius: 12px;--sn-border-radius-small: 6px;--sn-padding: 16px;--sn-notification-width: 380px;--sn-spacing: 20px;--sn-icon-size: 24px;--sn-image-size: 48px;--sn-message-max-height: 110px;--sn-animation-duration-fast: 0.2s;--sn-animation-duration-medium: 0.4s;--sn-animation-duration-slow: 0.8s;--sn-code-bg: rgba(0, 0, 0, 0.06);--sn-code-text: #c7254e;--sn-code-block-bg: #f8f9fa;--sn-code-block-border: #e9ecef;--sn-table-border: #dee2e6;--sn-table-stripe: rgba(0, 0, 0, 0.02);--sn-table-header-bg: rgba(0, 0, 0, 0.04);}
            @media (prefers-color-scheme: dark){:host{--sn-color-background: #292929;--sn-color-text-primary: #fff;--sn-color-text-secondary: #ddd;--sn-color-border: #444;--sn-color-dismiss: #aaa;--sn-color-expand-hover: #3b82f6;--sn-shadow-default: 0 8px 20px rgba(0, 0, 0, 0.5);--sn-shadow-button-hover: 0 4px 12px rgba(0, 0, 0, 0.4);--sn-card-background: rgba(0, 0, 0, 0.1);--sn-card-border: #555;--sn-scrollbar-track: #444;--sn-scrollbar-thumb: #666;--sn-scrollbar-thumb-hover: #888;--sn-button-hover-bg: #777;--sn-code-bg: rgba(255, 255, 255, 0.15);--sn-code-text: #ff7b72;--sn-code-block-bg: rgba(0, 0, 0, 0.3);--sn-code-block-border: #444;--sn-table-border: #555;--sn-table-stripe: rgba(255, 255, 255, 0.05);--sn-table-header-bg: rgba(255, 255, 255, 0.1);--sn-color-background-overlay: rgba(0, 0, 0, 0.75);}}
            .notification-container,.modal-card,.notification-container *,.modal-card *{font-family: var(--sn-font-family) !important;box-sizing: border-box;}
            .notification-container code,.notification-container pre,.notification-container kbd,.notification-container samp,.modal-card code,.modal-card pre,.modal-card kbd,.modal-card samp{font-family: var(--sn-font-family-code) !important;}
            .notification-container{position: fixed;top: 0;right: var(--sn-spacing);z-index: 2147483647;width: var(--sn-notification-width);font-family: var(--sn-font-family) !important;background-color: var(--sn-color-background);color: var(--sn-color-text-secondary);border-radius: var(--sn-border-radius);box-shadow: var(--sn-shadow-default);border: 1px solid var(--sn-color-border);display: flex;padding: var(--sn-padding);box-sizing: border-box;border-left: 5px solid transparent;opacity: 0;transform: translateX(120%);will-change: transform, opacity, top;align-items: flex-start;padding-right: 8px;}
            .notification-container.animate-in{opacity: 1;transform: translateX(0);transition: transform var(--sn-animation-duration-slow) cubic-bezier(0.22, 1.6, 0.5, 1), opacity var(--sn-animation-duration-medium) ease-out, top var(--sn-animation-duration-slow) cubic-bezier(0.22, 1.6, 0.5, 1);}
            .notification-container.animate-out{opacity: 0;transform: translateX(120%);transition: transform var(--sn-animation-duration-medium) cubic-bezier(0.6, -0.28, 0.735, 0.045), opacity var(--sn-animation-duration-medium) ease-out, top var(--sn-animation-duration-medium) ease-out;}
            .notification-container[data-type="success"]{ --type-color: #22c55e;}.notification-container[data-type="warning"]{ --type-color: #f97316;}.notification-container[data-type="info"]{ --type-color: #3b82f6;}
            .notification-container[data-type]{border-left-color: var(--type-color);}
            .notification-icon{width: var(--sn-icon-size);height: var(--sn-icon-size);margin-right: 12px;flex-shrink: 0;color: var(--type-color);}
            .notification-image{width: var(--sn-image-size);height: var(--sn-image-size);border-radius: var(--sn-border-radius-small);object-fit: cover;flex-shrink: 0;margin-right: 15px;}
            .notification-content{flex-grow: 1;word-break: break-word;}
            .notification-title{margin: 0 0 8px;font-size: var(--sn-font-size-title);font-weight: var(--sn-font-weight-title);color: var(--sn-color-text-primary);}
            .notification-message{font-size: var(--sn-font-size-body);line-height: 1.5;max-height: var(--sn-message-max-height);overflow-y: auto;padding-right: 8px;}
            .notification-message ul,.notification-message ol{padding-left: 1.5rem !important;margin: 1rem 0 !important;margin: 0 0 16px 16px !important;}
            .notification-message blockquote{margin: 0.5em 0;padding: 0.5em 1em;border-radius: 0;background-color: var(--sn-card-background);border-left: 4px solid var(--sn-card-border);}
            .notification-message a,.notification-title a{color: var(--sn-color-link);text-decoration: none;}
            .notification-messagea:hover,.notification-titlea:hover{text-decoration: underline;text-decoration-color: var(--sn-color-link-underline);}
            .dismiss-button,.expand-button{background: none;border: none;color: var(--sn-color-dismiss);cursor: pointer;padding: 4px;width: 28px;height: 28px;display: inline-flex;align-items: center;justify-content: center;border-radius: 50%;transition: background-color 0.2s, color 0.2s, transform 0.2s;align-self: flex-start;}
            .dismiss-button:hover,.expand-button:hover{background-color: rgba(0, 0, 0, 0.05);transform: scale(1.1);}
            .dismiss-button:hover{color: var(--sn-color-dismiss-hover);transform: rotate(90deg);}
            .expand-button:hover{color: var(--sn-color-expand-hover);}
            .expand-button:active{transform: scale(0.95);}
            .notification-actions{display: flex;flex-direction: row;align-items: center;gap: 4px;margin-left: 8px;flex-shrink: 0;}
            .notification-buttons{margin-top: 12px;display: flex;gap: 8px;flex-wrap: wrap;}
            .notification-button{background-color: var(--sn-color-border);color: var(--sn-color-text-secondary);border: none;border-radius: var(--sn-border-radius-small);padding: 6px 12px;font-size: var(--sn-font-size-body);font-weight: 500;cursor: pointer;transition: transform var(--sn-animation-duration-fast) ease-in-out, box-shadow var(--sn-animation-duration-fast) ease-in-out, background-color var(--sn-animation-duration-fast) ease-in-out, filter var(--sn-animation-duration-fast) ease-in-out, color var(--sn-animation-duration-fast) ease-in-out;}
            .notification-button:hover{transform: translateY(-2px);box-shadow: var(--sn-shadow-button-hover);filter: brightness(1.15);}
            .notification-button:not(.custom-bg):hover{background-color: var(--sn-button-hover-bg);color: var(--sn-button-hover-text);filter: brightness(1);}
            .notification-button:active{transform: translateY(0);box-shadow: none;transition-duration: 0.1s;}
            .notification-button.primary{background-color: var(--sn-color-link);color: #fff;}
            .notification-button.primary:hover{background-color: var(--sn-color-link);color: #fff;filter: brightness(1.1);}
            .notification-button.custom-bg:hover{filter: brightness(1.15);}
            .modal-overlay{position: fixed;top: 0;left: 0;width: 100vw;height: 100vh;background-color: var(--sn-color-background-overlay);z-index: 2147483648;display: flex;align-items: center;justify-content: center;opacity: 0;visibility: hidden;backdrop-filter: blur(4px);transition: opacity 0.3s ease, visibility 0.3s;}
            .modal-overlay.animate-in{opacity: 1;visibility: visible;}
            .modal-overlay.animate-out{opacity: 0;visibility: hidden;}
            .modal-card{background-color: var(--sn-color-background);color: var(--sn-color-text-primary);width: 95%;max-width: 900px;height: auto;max-height: 95vh;border-radius: 16px;box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);display: flex;flex-direction: column;overflow: hidden;transform: scale(0.9);opacity: 0;transition: transform 0.4s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.4s ease;border: 1px solid var(--sn-color-text-primary);padding: 0;position: relative;}
            .modal-overlay.animate-in .modal-card{transform: scale(1);opacity: 1;}.modal-overlay.animate-out .modal-card{transform: scale(0.9);opacity: 0;}
            .modal-hero-img{width: 100%;height: auto;max-height: 150px;object-fit: cover;display: block;border-bottom: 1px solid var(--sn-color-text-primary);cursor: zoom-in;flex-shrink: 0;}
            .modal-close-btn.floating{position: absolute;top: 20px;right: 20px;z-index: 10;background-color: rgba(0, 0, 0, 0.6);border: none;cursor: pointer;color: #fff;padding: 8px;border-radius: 50%;transition: all 0.2s;display: flex;backdrop-filter: blur(4px);}
            .modal-close-btn.floating:hover{background-color: var(--sn-color-dismiss-hover);transform: scale(1.1);}
            .modal-inner-content{display: flex;flex-direction: column;overflow: hidden;height: 100%;}
            .modal-header{padding: 25px;background-color: var(--sn-color-background);display: block;text-align: left;flex-shrink: 0;border-bottom: 1px solid var(--sn-color-text-primary);}
            .modal-title{margin: 0;font-size: 26px;font-weight: 700;line-height: 1.2;color: var(--sn-color-text-primary);}
            .modal-summary{margin-top: 10px;font-size: 16px;color: var(--sn-color-text-secondary);line-height: 1.5;}
            .modal-body{padding: 25px;overflow-y: auto;font-size: 16px;line-height: 1.7;text-align: left;color: var(--sn-color-text-primary);}
            .modal-body img,.modal-body video{display: block;margin: 25px auto;max-width: 100%;max-height: 400px;border-radius: 8px;box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);cursor: zoom-in;}
            .modal-body ul,.modal-body ol{padding-left: 1.5rem !important;margin: 1rem 0 !important;margin: 0 0 16px 16px !important;}
            .modal-body blockquote{margin: 1em 0;padding: 0.5em 1em;border-radius: 0;background-color: var(--sn-card-background);border-left: 4px solid var(--sn-card-border);}
            .modal-body h1, h2, h3, h4, h5, h6{margin: 0 0 16px 0;}
            .modal-body hr{margin-top: 16px;margin-bottom: 16px;}
            .lightbox-overlay{position: fixed;top: 0;left: 0;width: 100%;height: 100%;background: rgba(0, 0, 0, 0.95);z-index: 2147483649;display: flex;align-items: center;justify-content: center;opacity: 0;transition: opacity 0.3s ease;cursor: zoom-out;overflow: hidden;touch-action: none;}
            .lightbox-overlay.visible{opacity: 1;}
            .lightbox-img{max-width: 95vw;max-height: 95vh;object-fit: contain;border-radius: 4px;box-shadow: 0 0 20px rgba(0, 0, 0, 0.8);transform: scale(0.9);transition: transform 0.3s cubic-bezier(0.2, 0, 0.2, 1);cursor: grab;will-change: transform;user-select: none;}
            .lightbox-img.dragging{transition: none !important;cursor: grabbing;}
            .lightbox-overlay.visible .lightbox-img{transform: scale(1);}
            .modal-body::-webkit-scrollbar{width: 8px;}.modal-body::-webkit-scrollbar-track{background: transparent;}.modal-body::-webkit-scrollbar-thumb{background: #bbb; border-radius: 4px;}.modal-body::-webkit-scrollbar-thumb:hover{background: #999;}
            .notification-message::-webkit-scrollbar{width: 6px;}.notification-message::-webkit-scrollbar-track{background: var(--sn-scrollbar-track); border-radius: 3px;}.notification-message::-webkit-scrollbar-thumb{background: var(--sn-scrollbar-thumb); border-radius: 3px;}.notification-message::-webkit-scrollbar-thumb:hover{background: var(--sn-scrollbar-thumb-hover);}
            .notification-message code,.modal-body code{font-size: 0.9em !important;color: var(--sn-code-text);background-color: var(--sn-code-bg);padding: 2px 5px;border-radius: 4px;word-wrap: break-word;}
            .notification-message pre,.modal-body pre{background-color: var(--sn-code-block-bg);border: 1px solid var(--sn-code-block-border);border-radius: var(--sn-border-radius-small);padding: 12px;margin: 10px 0;font-size: 0.85em !important;color: var(--sn-color-text-primary);white-space: pre-wrap !important;word-wrap: break-word !important;word-break: break-word !important;max-height: 300px;overflow-y: auto;}
            .notification-message pre code,.modal-body pre code{background-color: transparent !important;color: inherit !important;padding: 0 !important;border-radius: 0 !important;font-size: inherit !important;}
            .notification-message pre code,.modal-body pre code{background-color: transparent;color: inherit;padding: 0;border-radius: 0;}
            .notification-message table,.modal-body table{width: 100%;border-collapse: collapse;margin: 12px 0;font-size: 0.9em;background-color: transparent;}
            .notification-message th,.notification-message td,.modal-body th,.modal-body td{padding: 8px 10px;border: 1px solid var(--sn-table-border);text-align: center;vertical-align: middle;}
            .notification-message th,.modal-body th{background-color: var(--sn-table-header-bg);font-weight: 600;color: var(--sn-color-text-primary);}
            .notification-messagetr:nth-child(even),.modal-bodytr:nth-child(even){background-color: var(--sn-table-stripe);}
            .notification-messagepre::-webkit-scrollbar{width: 6px;height: 6px;}.notification-messagepre::-webkit-scrollbar-track{background: transparent;}.notification-messagepre::-webkit-scrollbar-thumb{background: var(--sn-scrollbar-thumb); border-radius: 3px;}.notification-messagepre::-webkit-scrollbar-thumb:hover{background: var(--sn-scrollbar-thumb-hover);}
        `;
    }
}