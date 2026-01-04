// ==UserScript==
// @name               Script Notifier
// @namespace          http://github.com/0H4S
// @version            1.8
// @author             OHAS
// @description        Sistema de notificação para UserScripts.
// @license            CC-BY-NC-ND-4.0
// @copyright          2025 OHAS. All Rights Reserved. (https://gist.github.com/0H4S/ae2fa82957a089576367e364cbf02438)
// ==/UserScript==

/*
    Copyright Notice & Terms of Use
    Copyright © 2025 OHAS. All Rights Reserved.

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
    eslint-disable
*/

class ScriptNotifier {
    constructor({ notificationsUrl, scriptVersion, currentLang }) {
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
        this.scriptPolicy                = this._createPolicy();
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
                if (response.status < 200 || response.status >= 300) {
                    console.error(`Script Notifier: Falha ao buscar notificações. Status: ${response.status}`);
                    return;
                }
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
                        if (codeLines.length === 0) {
                            console.error('Script Notifier: A página Gist foi encontrada, mas nenhum conteúdo pôde ser extraído.');
                            return;
                        }
                        jsonString = Array.from(codeLines).map(line => line.innerText).join('\n');
                    } catch (e) {
                        console.error('Script Notifier: Falha ao analisar a página Gist.', e);
                        return;
                    }
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
                } catch (e) {
                    console.error('Script Notifier: Falha ao analisar o JSON das notificações.', e);
                }
            },
            onerror: (error) => {
                console.error('Script Notifier: Erro de rede ao buscar as notificações.', error);
            }
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
        if (notification.customColor) {
            container.style.borderLeftColor = notification.customColor;
            container.style.setProperty('--type-color', notification.customColor);
        }
        let iconHTML = this.icons[notificationType] || this.icons['info'];
        if (notification.customIconSvg) {
            iconHTML = this._sanitizeAndStyleSvg(notification.customIconSvg);
        }
        const imageOrIconHTML = notification.imageUrl ?
            `<img src="${notification.imageUrl}" class="notification-image" alt="Notification Image">` :
            `<div class="notification-icon">${iconHTML}</div>`;
        const closeIconSVG = `<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg>`;
        const notificationHTML = `
          ${imageOrIconHTML}
          <div class="notification-content">
              <h3 class="notification-title">${this._prepareMessageHTML(title)}</h3>
              <div class="notification-message">${this._prepareMessageHTML(message)}</div>
          </div>
          <button class="dismiss-button" title="${this._getUIText('closeButtonTitle')}">${closeIconSVG}</button>
        `;
        this._setSafeInnerHTML(container, notificationHTML);
        if (notification.buttons && notification.buttons.length > 0) {
            const buttonsContainer = this._createButtons(notification.buttons, notification.id);
            container.querySelector('.notification-content').appendChild(buttonsContainer);
        }
        this.shadowRoot.appendChild(container);
        this.activeNotifications.push({ id: notification.id, element: container, isNew: true });
        this._updateNotificationPositions();
        container.querySelector('.dismiss-button').onclick = (e) => {
            e.stopPropagation();
            this._dismissNotification(notification.id);
        };
    }
    _createButtons(buttonDataArray, notificationId) {
        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'notification-buttons';
        buttonDataArray.forEach((buttonData, index) => {
            const button = document.createElement('button');
            const buttonText = this._getTranslatedText(buttonData.text);
            this._setSafeInnerHTML(button, this._prepareMessageHTML(buttonText));
            button.className = 'notification-button';
            if (buttonData.backgroundColor) {
                button.style.backgroundColor = buttonData.backgroundColor;
                button.classList.add('custom-bg');
            } else if (index === 0) {
                button.classList.add('primary');
            }
            if (buttonData.textColor) {
                button.style.color = buttonData.textColor;
            }
            button.onclick = (e) => {
                e.stopPropagation();
                if (buttonData.action) {
                    switch (buttonData.action) {
                        case 'open_url': window.location.href = buttonData.value; break;
                        case 'open_url_new_tab': window.open(buttonData.value, '_blank'); break;
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
        const supportedLanguages = [
            'pt-BR', 'zh-CN', 'ckb', 'ar', 'be', 'bg', 'cs', 'da', 'de', 'el',
            'en', 'eo', 'es', 'fi', 'fr', 'he', 'hr', 'hu', 'id', 'it', 'ja',
            'ka', 'ko', 'mr', 'nb', 'nl', 'pl', 'ro', 'ru', 'sk', 'sr', 'sv',
            'th', 'tr', 'uk', 'ug', 'vi'
        ];
        let lang = this.forcedLang || await GM_getValue(this.LANG_STORAGE_KEY) || navigator.language || 'en';
        if          (lang.startsWith('pt'))  lang = 'pt-BR';
        else if     (lang.startsWith('zh'))  lang = 'zh-CN';
        else if     (lang.startsWith('ckb')) lang = 'ckb';
        else if     (lang.startsWith('en'))  lang = 'en';
        else if     (lang.startsWith('es'))  lang = 'es';
        else if     (lang.startsWith('fr'))  lang = 'fr';
        else if     (lang.startsWith('ru'))  lang = 'ru';
        else if     (lang.startsWith('ja'))  lang = 'ja';
        else if     (lang.startsWith('ko'))  lang = 'ko';
        else if     (lang.startsWith('ar'))  lang = 'ar';
        else if     (lang.startsWith('be'))  lang = 'be';
        else if     (lang.startsWith('bg'))  lang = 'bg';
        else if     (lang.startsWith('cs'))  lang = 'cs';
        else if     (lang.startsWith('da'))  lang = 'da';
        else if     (lang.startsWith('de'))  lang = 'de';
        else if     (lang.startsWith('el'))  lang = 'el';
        else if     (lang.startsWith('eo'))  lang = 'eo';
        else if     (lang.startsWith('fi'))  lang = 'fi';
        else if     (lang.startsWith('he'))  lang = 'he';
        else if     (lang.startsWith('hr'))  lang = 'hr';
        else if     (lang.startsWith('hu'))  lang = 'hu';
        else if     (lang.startsWith('id'))  lang = 'id';
        else if     (lang.startsWith('it'))  lang = 'it';
        else if     (lang.startsWith('ka'))  lang = 'ka';
        else if     (lang.startsWith('mr'))  lang = 'mr';
        else if     (lang.startsWith('nl'))  lang = 'nl';
        else if     (lang.startsWith('pl'))  lang = 'pl';
        else if     (lang.startsWith('ro'))  lang = 'ro';
        else if     (lang.startsWith('sk'))  lang = 'sk';
        else if     (lang.startsWith('sr'))  lang = 'sr';
        else if     (lang.startsWith('sv'))  lang = 'sv';
        else if     (lang.startsWith('th'))  lang = 'th';
        else if     (lang.startsWith('tr'))  lang = 'tr';
        else if     (lang.startsWith('uk'))  lang = 'uk';
        else if     (lang.startsWith('ug'))  lang = 'ug';
        else if     (lang.startsWith('vi'))  lang = 'vi';
        else if     (lang.startsWith('nb') || lang.startsWith('no')) lang = 'nb';
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
        const toggleCommandText = notificationsEnabled ? this._getUIText('disableNotificationsCmd') : this._getUIText('enableNotificationsCmd');
        GM_registerMenuCommand(this._getUIText('showAllNotificationsCmd'), () => this.forceShowAllNotifications());
        GM_registerMenuCommand(toggleCommandText, async () => {
            const currentState = await GM_getValue(this.NOTIFICATIONS_ENABLED_KEY, true);
            await GM_setValue(this.NOTIFICATIONS_ENABLED_KEY, !currentState);
            window.location.reload();
        });
    }
    _createPolicy() {
        return window.trustedTypes ? window.trustedTypes.createPolicy('script-notifier-policy-unico', {
            createHTML: (input) => input
        }) : null;
    }
    _getUIText(key) { return this.uiStrings[key]?.[this.currentLang] || this.uiStrings[key]?.['en'] || ''; }
    _setSafeInnerHTML(element, html) {
        if (!element) return;
        element.innerHTML = this.scriptPolicy ? this.scriptPolicy.createHTML(html) : html;
    }
    _getTranslatedText(translationObject) {
        if (!translationObject) return '';
        if (typeof translationObject === 'string') return translationObject;
        return translationObject[this.currentLang] || translationObject[this.currentLang.split('-')[0]] || translationObject['en'] || '';
    }
    _prepareMessageHTML(text) { return text || ''; }
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
            showAllNotificationsCmd: {
                'pt-BR': '🔔 Notificações',
                'zh-CN': '🔔 通知',
                'ckb':   '🔔 ئاگادارکردنەوەکان',
                'ar':    '🔔 الإشعارات',
                'be':    '🔔 Апавяшчэнні',
                'bg':    '🔔 Известия',
                'cs':    '🔔 Upozornění',
                'da':    '🔔 Notifikationer',
                'de':    '🔔 Benachrichtigungen',
                'el':    '🔔 Ειδοποιήσεις',
                'en':    '🔔 Notifications',
                'eo':    '🔔 Sciigoj',
                'es':    '🔔 Notificaciones',
                'fi':    '🔔 Ilmoitukset',
                'fr':    '🔔 Notifications',
                'he':    '🔔 התראות',
                'hr':    '🔔 Obavijesti',
                'hu':    '🔔 Értesítések',
                'id':    '🔔 Notifikasi',
                'it':    '🔔 Notifiche',
                'ja':    '🔔 通知',
                'ka':    '🔔 შეტყობინებები',
                'ko':    '🔔 알림',
                'mr':    '🔔 सूचना',
                'nb':    '🔔 Varsler',
                'nl':    '🔔 Meldingen',
                'pl':    '🔔 Powiadomienia',
                'ro':    '🔔 Notificări',
                'ru':    '🔔 Уведомления',
                'sk':    '🔔 Upozornenia',
                'sr':    '🔔 Обавештења',
                'sv':    '🔔 Aviseringar',
                'th':    '🔔 การแจ้งเตือน',
                'tr':    '🔔 Bildirimler',
                'uk':    '🔔 Сповіщення',
                'ug':    '🔔 ئۇقتۇرۇشلار',
                'vi':    '🔔 Thông báo'
            },
            disableNotificationsCmd: {
                'pt-BR': '❌ Desativar Notificações',
                'zh-CN': '❌ 禁用通知',
                'ckb':   '❌ ناچالاککردنی ئاگادارکردنەوەکان',
                'ar':    '❌ تعطيل الإشعارات',
                'be':    '❌ Адключыць апавяшчэнні',
                'bg':    '❌ Изключване на известия',
                'cs':    '❌ Vypnout upozornění',
                'da':    '❌ Deaktiver notifikationer',
                'de':    '❌ Benachrichtigungen deaktivieren',
                'el':    '❌ Απενεργοποίηση ειδοποιήσεων',
                'en':    '❌ Disable Notifications',
                'eo':    '❌ Malŝalti Sciigojn',
                'es':    '❌ Desactivar Notificaciones',
                'fi':    '❌ Poista ilmoitukset käytöstä',
                'fr':    '❌ Désactiver les notifications',
                'he':    '❌ השבת התראות',
                'hr':    '❌ Onemogući obavijesti',
                'hu':    '❌ Értesítések kikapcsolása',
                'id':    '❌ Nonaktifkan Notifikasi',
                'it':    '❌ Disattiva notifiche',
                'ja':    '❌ 通知を無効にする',
                'ka':    '❌ შეტყობინებების გამორთვა',
                'ko':    '❌ 알림 비활성화',
                'mr':    '❌ सूचना अक्षम करा',
                'nb':    '❌ Slå av varsler',
                'nl':    '❌ Meldingen uitschakelen',
                'pl':    '❌ Wyłącz powiadomienia',
                'ro':    '❌ Dezactivează notificările',
                'ru':    '❌ Отключить уведомления',
                'sk':    '❌ Vypnúť upozornenia',
                'sr':    '❌ Онемогући обавештења',
                'sv':    '❌ Inaktivera aviseringar',
                'th':    '❌ ปิดการแจ้งเตือน',
                'tr':    '❌ Bildirimleri Kapat',
                'uk':    '❌ Вимкнути сповіщення',
                'ug':    '❌ ئۇقتۇرۇشلارنى چەكلەش',
                'vi':    '❌ Tắt thông báo'
            },
            enableNotificationsCmd: {
                'pt-BR': '✅ Ativar Notificações',
                'zh-CN': '✅ 启用通知',
                'ckb':   '✅ چالاککردنی ئاگادارکردنەوەکان',
                'ar':    '✅ تفعيل الإشعارات',
                'be':    '✅ Уключыць апавяшчэнні',
                'bg':    '✅ Включване на известия',
                'cs':    '✅ Zapnout upozornění',
                'da':    '✅ Aktiver notifikationer',
                'de':    '✅ Benachrichtigungen aktivieren',
                'el':    '✅ Ενεργοποίηση ειδοποιήσεων',
                'en':    '✅ Enable Notifications',
                'eo':    '✅ Ŝalti Sciigojn',
                'es':    '✅ Activar Notificaciones',
                'fi':    '✅ Ota ilmoitukset käyttöön',
                'fr':    '✅ Activer les notifications',
                'he':    '✅ הפעל התראות',
                'hr':    '✅ Omogući obavijesti',
                'hu':    '✅ Értesítések bekapcsolása',
                'id':    '✅ Aktifkan Notifikasi',
                'it':    '✅ Attiva notifiche',
                'ja':    '✅ 通知を有効にする',
                'ka':    '✅ შეტყობინებების ჩართვა',
                'ko':    '✅ 알림 활성화',
                'mr':    '✅ सूचना सक्षम करा',
                'nb':    '✅ Slå på varsler',
                'nl':    '✅ Meldingen inschakelen',
                'pl':    '✅ Włącz powiadomienia',
                'ro':    '✅ Activează notificările',
                'ru':    '✅ Включить уведомления',
                'sk':    '✅ Zapnúť upozornenia',
                'sr':    '✅ Омогући обавештења',
                'sv':    '✅ Aktivera aviseringar',
                'th':    '✅ เปิดการแจ้งเตือน',
                'tr':    '✅ Bildirimleri Aç',
                'uk':    '✅ Увімкнути сповіщення',
                'ug':    '✅ ئۇقتۇرۇشلارنى قوزغىتىش',
                'vi':    '✅ Bật thông báo'
            },
            closeButtonTitle: {
                'pt-BR': 'Fechar',
                'zh-CN': '关闭',
                'ckb':   'داخستن',
                'ar':    'إغلاق',
                'be':    'Закрыць',
                'bg':    'Затвори',
                'cs':    'Zavřít',
                'da':    'Luk',
                'de':    'Schließen',
                'el':    'Κλείσιμο',
                'en':    'Close',
                'eo':    'Fermi',
                'es':    'Cerrar',
                'fi':    'Sulje',
                'fr':    'Fermer',
                'he':    'סגור',
                'hr':    'Zatvori',
                'hu':    'Bezárás',
                'id':    'Tutup',
                'it':    'Chiudi',
                'ja':    '閉じる',
                'ka':    'დახურვა',
                'ko':    '닫기',
                'mr':    'बंद करा',
                'nb':    'Lukk',
                'nl':    'Sluiten',
                'pl':    'Zamknij',
                'ro':    'Închide',
                'ru':    'Закрыть',
                'sk':    'Zavrieť',
                'sr':    'Затвори',
                'sv':    'Stäng',
                'th':    'ปิด',
                'tr':    'Kapat',
                'uk':    'Закрити',
                'ug':    'تاقاش',
                'vi':    'Đóng'
            }
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
            :host {
                --sn-font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                --sn-color-background: #fff;
                --sn-color-text-primary: #000;
                --sn-color-text-secondary: #333;
                --sn-color-border: #ddd;
                --sn-color-link: currentColor;
                --sn-color-link-underline: currentColor;
                --sn-color-dismiss: #999;
                --sn-color-dismiss-hover: #ff4d4d;
                --sn-shadow-default: 0 8px 20px rgba(0, 0, 0, 0.15);
                --sn-shadow-button-hover: 0 4px 10px rgba(0,0,0,0.2);
                --sn-card-background: rgba(0, 0, 0, 0.05);
                --sn-card-border: #ccc;
                --sn-scrollbar-track: #f1f1f1;
                --sn-scrollbar-thumb: #ccc;
                --sn-scrollbar-thumb-hover: #aaa;
                --sn-button-hover-bg: #555;
                --sn-button-hover-text: #fff;
                --sn-border-radius: 12px;
                --sn-border-radius-small: 6px;
                --sn-padding: 16px;
                --sn-notification-width: 380px;
                --sn-spacing: 20px;
                --sn-icon-size: 24px;
                --sn-image-size: 48px;
                --sn-font-size-title: 16px;
                --sn-font-size-body: 14px;
                --sn-font-weight-title: 600;
                --sn-message-max-height: 110px;
                --sn-animation-duration-fast: 0.2s;
                --sn-animation-duration-medium: 0.4s;
                --sn-animation-duration-slow: 0.8s;
            }

            @media (prefers-color-scheme: dark) {
                :host {
                    --sn-font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                    --sn-color-background: #333;
                    --sn-color-text-primary: #fff;
                    --sn-color-text-secondary: #ddd;
                    --sn-color-border: #444;
                    --sn-color-link: currentColor;
                    --sn-color-link-underline: currentColor;
                    --sn-color-dismiss: #aaa;
                    --sn-color-dismiss-hover: #ff4d4d;
                    --sn-shadow-default: 0 8px 20px rgba(0, 0, 0, 0.5);
                    --sn-shadow-button-hover: 0 4px 12px rgba(0,0,0,0.4);
                    --sn-card-background: rgba(0, 0, 0, 0.1);
                    --sn-card-border: #555;
                    --sn-scrollbar-track: #444;
                    --sn-scrollbar-thumb: #666;
                    --sn-scrollbar-thumb-hover: #888;
                    --sn-button-hover-bg: #777;
                    --sn-button-hover-text: #fff;
                    --sn-border-radius: 12px;
                    --sn-border-radius-small: 6px;
                    --sn-padding: 16px;
                    --sn-notification-width: 380px;
                    --sn-spacing: 20px;
                    --sn-icon-size: 24px;
                    --sn-image-size: 48px;
                    --sn-font-size-title: 16px;
                    --sn-font-size-body: 14px;
                    --sn-font-weight-title: 600;
                    --sn-message-max-height: 110px;
                    --sn-animation-duration-fast: 0.2s;
                    --sn-animation-duration-medium: 0.4s;
                    --sn-animation-duration-slow: 0.8s;
                }
            }

            .notification-container {
                position: fixed;
                top: 0;
                right: var(--sn-spacing);
                z-index: 2147483647;
                width: var(--sn-notification-width);
                font-family: var(--sn-font-family);
                background-color: var(--sn-color-background);
                color: var(--sn-color-text-secondary);
                border-radius: var(--sn-border-radius);
                box-shadow: var(--sn-shadow-default);
                border: 1px solid var(--sn-color-border);
                display: flex;
                padding: var(--sn-padding);
                box-sizing: border-box;
                border-left: 5px solid transparent;
                opacity: 0;
                transform: translateX(120%);
                will-change: transform, opacity, top;
            }

            .notification-container.animate-in {
                opacity: 1;
                transform: translateX(0);
                transition: transform var(--sn-animation-duration-slow) cubic-bezier(0.22, 1.6, 0.5, 1), opacity var(--sn-animation-duration-medium) ease-out, top var(--sn-animation-duration-slow) cubic-bezier(0.22, 1.6, 0.5, 1);
            }

            .notification-container.animate-out {
                opacity: 0;
                transform: translateX(120%);
                transition: transform var(--sn-animation-duration-medium) cubic-bezier(0.6, -0.28, 0.735, 0.045), opacity var(--sn-animation-duration-medium) ease-out, top var(--sn-animation-duration-medium) ease-out;
            }

            .notification-container[data-type="success"] {
                --type-color: #22c55e;
            }

            .notification-container[data-type="warning"] {
                --type-color: #f97316;
            }

            .notification-container[data-type="info"] {
                --type-color: #3b82f6;
            }

            .notification-container[data-type] {
                border-left-color: var(--type-color);
            }

            .notification-icon {
                width: var(--sn-icon-size);
                height: var(--sn-icon-size);
                margin-right: 12px;
                flex-shrink: 0;
                color: var(--type-color);
            }

            .notification-image {
                width: var(--sn-image-size);
                height: var(--sn-image-size);
                border-radius: var(--sn-border-radius-small);
                object-fit: cover;
                flex-shrink: 0;
                margin-right: 15px;
            }

            .notification-content {
                flex-grow: 1;
                word-break: break-word;
            }

            .notification-title {
                margin: 0 0 8px;
                font-size: var(--sn-font-size-title);
                font-weight: var(--sn-font-weight-title);
                color: var(--sn-color-text-primary);
            }

            .notification-message {
                font-size: var(--sn-font-size-body);
                line-height: 1.5;
                max-height: var(--sn-message-max-height);
                overflow-y: auto;
                padding-right: 8px;
            }

            .notification-message ul,
            .notification-message ol {
                padding-left: 1.5rem;
                margin: 0.5rem 0;
            }

            .notification-message blockquote {
                margin: 0.5em 0; padding: 0.5em 1em;
                border-radius: 0;
                background-color: var(--sn-card-background);
                border-left: 4px solid var(--sn-card-border);
            }

            .notification-message a,
            .notification-title a {
                color: var(--sn-color-link);
                text-decoration: none;
            }

            .notification-message a:hover,
            .notification-title a:hover {
                text-decoration: underline;
                text-decoration-color: var(--sn-color-link-underline);
            }

            .dismiss-button {
                background: none;
                border: none;
                color: var(--sn-color-dismiss);
                cursor: pointer;
                padding: 0;
                margin-left: 10px;
                align-self: flex-start;
                transition: color var(--sn-animation-duration-fast) ease, transform var(--sn-animation-duration-medium) cubic-bezier(0.25, 0.1, 0.25, 1.5);
                width: var(--sn-icon-size);
                height: var(--sn-icon-size);
                display: inline-flex;
                align-items: center;
                justify-content: center;
            }

            .dismiss-button:hover {
                color: var(--sn-color-dismiss-hover);
                transform: rotate(90deg);
            }

            .dismiss-button:active {
                transform: rotate(90deg) scale(0.9);
            }

            .notification-buttons {
                margin-top: 12px;
                display: flex;
                gap: 8px;
                flex-wrap: wrap;
            }

            .notification-button {
                background-color: var(--sn-color-border);
                color: var(--sn-color-text-secondary);
                border: none;
                border-radius: var(--sn-border-radius-small);
                padding: 6px 12px;
                font-size: var(--sn-font-size-body);
                font-weight: 500;
                cursor: pointer;
                transition: transform var(--sn-animation-duration-fast) ease-in-out, box-shadow var(--sn-animation-duration-fast) ease-in-out, background-color var(--sn-animation-duration-fast) ease-in-out,filter var(--sn-animation-duration-fast) ease-in-out, color var(--sn-animation-duration-fast) ease-in-out;
            }

            .notification-button:hover {
                transform: translateY(-2px);
                box-shadow: var(--sn-shadow-button-hover);
                filter: brightness(1.15);
            }

            .notification-button:not(.custom-bg):hover {
                background-color: var(--sn-button-hover-bg);
                color: var(--sn-button-hover-text);
                filter: brightness(1);
            }

            .notification-button:active {
                transform: translateY(0);
                box-shadow: none;
                transition-duration: 0.1s;
            }

            .notification-button.primary {
                background-color: var(--sn-color-link);
                color: #fff;
            }

            .notification-button.primary:hover {
                background-color: var(--sn-color-link);
                color: #fff;
                filter: brightness(1.1);
            }

            .notification-button.custom-bg:hover {
                filter: brightness(1.15);
            }

            .notification-message::-webkit-scrollbar {
                width: 6px;
            }

            .notification-message::-webkit-scrollbar-track {
                background: var(--sn-scrollbar-track);
                border-radius: 3px;
            }

            .notification-message::-webkit-scrollbar-thumb {
                background: var(--sn-scrollbar-thumb);
                border-radius: 3px;
            }

            .notification-message::-webkit-scrollbar-thumb:hover {
                background: var(--sn-scrollbar-thumb-hover);
            }

        `;
    }
}