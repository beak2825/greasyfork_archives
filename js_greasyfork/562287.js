// ==UserScript==
// @name                LinkedIn Auto Connect & Save Profiles✨🚀 - Sequential & Safe🚫🌐 (LnAuto V8)
// @name:tr             LinkedIn Otomatik Bağlantı & Profil Kaydedici✨ - GÜVENLİ & SERİ🚫
// @name:en             LinkedIn Auto Connect & Save Profiles✨ - SAFE & FAST🚫
// @name:de             LinkedIn Auto Connect & Profil-Speicher✨ - SICHER & SCHNELL🚫
// @name:fr             LinkedIn Auto Connect & Sauvegarde de Profil✨ - SÛR & RAPIDE🚫
// @name:es             LinkedIn Auto Connect y Guardar Perfil✨ - SEGURO Y RÁPIDO🚫
// @name:it             LinkedIn Auto Connect & Salva Profilo✨ - SICURO & VELOCE🚫
// @name:pt-BR          LinkedIn Auto Connect & Salvar Perfil✨ - SEGURO E RÁPIDO🚫
// @name:ru             LinkedIn Auto Connect & Сохранение профиля✨ - БЕЗОПАСНО🚫
// @name:ja             LinkedIn 自動接続 & プロフィール保存✨ - 安全で高速🚫
// @name:zh-CN          LinkedIn 自动连接 & 个人资料保存✨ - 安全且快速🚫
// @name:ko             LinkedIn 자동 연결 & 프로필 저장✨ - 안전하고 빠른🚫
// @name:id             LinkedIn Auto Connect & Simpan Profil✨ - AMAN & CEPAT🚫
// @name:vi             LinkedIn Auto Connect & Lưu Hồ Sơ✨ - AN TOÀN & NHANH🚫
// @name:ar             LinkedIn Auto Connect & حفظ الملف الشخصي✨ - آمن وسريع🚫
//
// @description         Enhance your LinkedIn experience with auto-connect, profile saving, and auto-add from saved list. Features safe limits and a clean dashboard!
// @description:tr      LinkedIn deneyiminizi geliştirin: Otomatik bağlantı kurma, profil kaydetme ve kaydedilenleri otomatik ekleme. Güvenli sınırlar ve temiz panel!
// @description:en      Enhance your LinkedIn experience with auto-connect, profile saving, and auto-add from saved list. Features safe limits and a clean dashboard!
// @description:de      Verbessern Sie LinkedIn mit automatischer Vernetzung, Profilspeicherung und automatischem Hinzufügen. Sicherheitslimits und sauberes Dashboard!
// @description:fr      Améliorez LinkedIn avec la connexion automatique, la sauvegarde de profil et l'ajout automatique. Limites de sécurité et tableau de bord propre !
// @description:es      ¡Mejora tu experiencia en LinkedIn con conexión automática, guardado de perfiles y adición automática! Límites de seguridad y panel limpio.
// @description:it      Migliora LinkedIn con la connessione automatica, il salvataggio dei profili e l'aggiunta automatica. Limiti di sicurezza e dashboard pulita!
// @description:pt-BR   Melhore sua experiência no LinkedIn com conexão automática, salvamento de perfil e adição automática. Limites de segurança e painel limpo!
// @description:ru      Улучшите LinkedIn с помощью автоматического подключения, сохранения профилей и автоматического добавления. Безопасные лимиты и чистая панель!
// @description:ja      自動接続、プロフィール保存、保存されたプロフィールの自動追加でLinkedIn体験を向上させます。安全制限とクリーンなダッシュボード！
// @description:zh-CN   增强您的 LinkedIn 体验：自动连接、保存个人资料和自动添加已保存的资料。安全限制和简洁的仪表板！
// @description:ko      자동 연결, 프로필 저장 및 저장된 프로필 자동 추가로 LinkedIn 경험을 향상시키세요. 안전 제한 및 깔끔한 대시보드!
// @description:id      Tingkatkan LinkedIn Anda dengan koneksi otomatis, penyimpanan profil, dan penambahan otomatis. Batas aman dan dasbor bersih!
// @description:vi      Nâng cao trải nghiệm LinkedIn của bạn với kết nối tự động, lưu hồ sơ và tự động thêm. Giới hạn an toàn và bảng điều khiển sạch sẽ!
// @description:ar      عزز تجربتك على LinkedIn من خلال الاتصال التلقائي وحفظ الملفات الشخصية والإضافة التلقائية. حدود آمنة ولوحة تحكم نظيفة!
//
// @namespace           https://github.com/tanersb/LinkedIn-Fast-Sequential-Auto-Connect
// @version             8.2
// @author              tanersb
// @match               https://www.linkedin.com/*
// @license             MIT
// @description         Shadow DOM fix + Clean UI + Speed Controls + Signature + Timestamp + Full Reset + Update Checker + Limit Detection + State Memory + Profile Saver + Auto Add Saved + Full Custom UI + Anti-Duplicate System + Multi-Language (TR/EN).
// @author              tanersb
// @match               https://www.linkedin.com/*
// @grant               none
// @downloadURL https://update.greasyfork.org/scripts/562287/LinkedIn%20Auto%20Connect%20%20Save%20Profiles%E2%9C%A8%F0%9F%9A%80%20-%20Sequential%20%20Safe%F0%9F%9A%AB%F0%9F%8C%90%20%28LnAuto%20V8%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562287/LinkedIn%20Auto%20Connect%20%20Save%20Profiles%E2%9C%A8%F0%9F%9A%80%20-%20Sequential%20%20Safe%F0%9F%9A%AB%F0%9F%8C%90%20%28LnAuto%20V8%29.meta.js
// ==/UserScript==

/*
    LinkedIn Fast Sequential Auto Connect
    ------------------------------------
    Author  : TanerSB
    Repo    : https://github.com/tanersb/LinkedIn-Fast-Sequential-Auto-Connect
    License : MIT
*/

(function () {
    'use strict';

    // --- ÖNEMLİ: IFRAME KORUMASI ---
    if (window.top !== window.self) return;

    // --- SABİTLER ---
    const UPDATE_LINK = "https://raw.githubusercontent.com/tanersb/LinkedIn-Fast-Sequential-Auto-Connect/main/linkedin-fast-sequential.user.js";
    const SLEEP_BETWEEN_ACTIONS = 2500;

    // --- DİL SÖZLÜĞÜ (TRANSLATIONS) ---
    const TEXTS = {
        tr: {
            title: "LinkedIn Auto v8.2",
            total: "Toplam",
            last: "Son",
            save_btn: "BU PROFİLİ KAYDET",
            save_success: "KAYDEDİLDİ ✔",
            list_btn: "LİSTE",
            note_closer: "Not Kapatıcı",
            active: "AKTİF",
            passive: "PASİF",
            start: "BAŞLAT",
            stop: "DURDUR",
            limit_btn: "LİMİT DOLDU",
            update: "Güncelle",
            list_header: "Kayıtlı Profiller",
            list_empty: "Liste boş.",
            back: "« GERİ",
            auto_add: "HEPSİNİ EKLE (OTO)",
            clear: "TEMİZLE",
            confirm_reset_title: "Sayaç Sıfırlama",
            confirm_reset_msg: "Toplam sayı ve son işlem tarihi sıfırlansın mı?",
            confirm_clear_title: "Listeyi Temizle",
            confirm_clear_msg: "Tüm kayıtlı profiller silinecek. Emin misiniz?",
            alert_empty_title: "Liste Boş",
            alert_empty_msg: "İşleme başlamak için önce profil sayfalarına gidip <b>'BU PROFİLİ KAYDET'</b> butonuna basarak liste oluşturun.",
            confirm_auto_title: "Oto Ekleme Başlatılsın mı?",
            confirm_auto_msg_1: "Listede toplam <b>",
            confirm_auto_msg_2: "</b> kişi var.<br><br>Bot sırayla bu profilleri gezip 'Bağlantı Kur' butonuna basacak.",
            alert_limit_title: "⚠️ HAFTALIK LİMİT UYARISI",
            alert_limit_msg: "LinkedIn'in 'Haftalık Davet Sınırı' uyarısı tespit edildi ve ekranınızdan kaldırıldı.<br><br>Bot güvenliğiniz için otomatik olarak durduruldu.",
            modal_cancel: "İPTAL",
            modal_confirm: "ONAYLA",
            modal_ok: "TAMAM",
            error_profile: "Lütfen bir kişi profiline girin.<br>(Örn: linkedin.com/in/kullanici)",
            error_exists: "Bu kişi zaten listenizde kayıtlı.",
            dash_title: "🤖 Oto Ekleme Modu",
            dash_person: "Kişi",
            dash_status_scan: "Profil taranıyor...",
            dash_status_conn: "Bağlantı kuruluyor...",
            dash_status_sent: "✔ İstek Gönderildi",
            dash_status_pending: "⚠ Zaten İstek Atılmış",
            dash_status_fail: "❌ Buton Bulunamadı",
            dash_next: "Sıradaki profile geçiliyor...",
            dash_done: "✅ TÜM LİSTE TAMAMLANDI!",
            dash_stop_user: "🛑 Kullanıcı durdurdu.",
            dash_stop_limit: "⚠️ HAFTALIK LİMİT!"
        },
        en: {
            title: "LinkedIn Auto v8.2",
            total: "Total",
            last: "Last",
            save_btn: "SAVE THIS PROFILE",
            save_success: "SAVED ✔",
            list_btn: "LIST",
            note_closer: "Note Closer",
            active: "ACTIVE",
            passive: "OFF",
            start: "START",
            stop: "STOP",
            limit_btn: "LIMIT REACHED",
            update: "Update",
            list_header: "Saved Profiles",
            list_empty: "List is empty.",
            back: "« BACK",
            auto_add: "ADD ALL (AUTO)",
            clear: "CLEAR ALL",
            confirm_reset_title: "Reset Counter",
            confirm_reset_msg: "Reset total count and last action date?",
            confirm_clear_title: "Clear List",
            confirm_clear_msg: "All saved profiles will be deleted. Are you sure?",
            alert_empty_title: "List Empty",
            alert_empty_msg: "To start, visit profile pages and click <b>'SAVE THIS PROFILE'</b> to build your list.",
            confirm_auto_title: "Start Auto Add?",
            confirm_auto_msg_1: "There are <b>",
            confirm_auto_msg_2: "</b> people in the list.<br><br>The bot will visit each profile and click 'Connect'.",
            alert_limit_title: "⚠️ WEEKLY LIMIT WARNING",
            alert_limit_msg: "LinkedIn's 'Weekly Invitation Limit' warning was detected and removed from your screen.<br><br>The bot has been stopped for your safety.",
            modal_cancel: "CANCEL",
            modal_confirm: "CONFIRM",
            modal_ok: "OK",
            error_profile: "Please visit a user profile.<br>(e.g. linkedin.com/in/user)",
            error_exists: "This person is already in your list.",
            dash_title: "🤖 Auto Add Mode",
            dash_person: "Person",
            dash_status_scan: "Scanning profile...",
            dash_status_conn: "Connecting...",
            dash_status_sent: "✔ Request Sent",
            dash_status_pending: "⚠ Already Pending",
            dash_status_fail: "❌ Button Not Found",
            dash_next: "Moving to next profile...",
            dash_done: "✅ ALL DONE!",
            dash_stop_user: "🛑 Stopped by user.",
            dash_stop_limit: "⚠️ WEEKLY LIMIT!"
        }
    };

    // --- AYARLAR VE HAFIZA ---
    let currentLang = localStorage.getItem('LnAuto_Lang') || 'tr'; // Varsayılan TR

    // Çeviri Yardımcısı
    const t = (key) => TEXTS[currentLang][key] || key;

    let isConnectorRunning = false;
    let isNoteCloserActive = true;

    let totalCount = parseInt(localStorage.getItem('LnAuto_TotalCount')) || 0;
    let speedPopup = parseInt(localStorage.getItem('LnAuto_SpeedPopup')) || 100;
    let speedConnect = parseInt(localStorage.getItem('LnAuto_SpeedConnect')) || 1000;
    let lastActionDate = localStorage.getItem('LnAuto_LastDate') || '-';
    let panelState = localStorage.getItem('LnAuto_PanelState') || 'open';

    let savedProfiles = [];
    try {
        savedProfiles = JSON.parse(localStorage.getItem('LnAuto_SavedProfiles')) || [];
    } catch (e) {
        savedProfiles = [];
    }

    let isAutoAdding = localStorage.getItem('LnAuto_IsAutoAdding') === 'true';
    let autoAddIndex = parseInt(localStorage.getItem('LnAuto_AutoAddIndex')) || 0;

    function saveSettings() {
        localStorage.setItem('LnAuto_SpeedPopup', speedPopup);
        localStorage.setItem('LnAuto_SpeedConnect', speedConnect);
        localStorage.setItem('LnAuto_TotalCount', totalCount);
        localStorage.setItem('LnAuto_LastDate', lastActionDate);
        localStorage.setItem('LnAuto_SavedProfiles', JSON.stringify(savedProfiles));
        localStorage.setItem('LnAuto_IsAutoAdding', isAutoAdding);
        localStorage.setItem('LnAuto_AutoAddIndex', autoAddIndex);
        localStorage.setItem('LnAuto_Lang', currentLang);
    }

    // --- YARDIMCI FONKSİYONLAR ---
    function findInShadows(selector) {
        let el = document.querySelector(selector);
        if (el) return el;
        const shadowHost = document.querySelector("#interop-outlet");
        if (shadowHost && shadowHost.shadowRoot) {
            el = shadowHost.shadowRoot.querySelector(selector);
            if (el) return el;
        }
        return null;
    }

    function nativeClick(element) {
        if (!element) return;
        ['mouseover', 'mousedown', 'mouseup', 'click'].forEach(evt => {
            element.dispatchEvent(new MouseEvent(evt, { bubbles: true, cancelable: true, view: window }));
        });
    }

    function getFormattedDate() {
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const hour = String(now.getHours()).padStart(2, '0');
        const min = String(now.getMinutes()).padStart(2, '0');
        return `${day}.${month} ${hour}:${min}`;
    }

    function updateCounterDisplay() {
        const counterEl = document.getElementById('lnk-counter-val');
        const dateEl = document.getElementById('lnk-last-date');
        if (counterEl) counterEl.textContent = totalCount;
        if (dateEl) dateEl.textContent = lastActionDate;
        saveSettings();
    }

    // --- GLOBAL CUSTOM MODAL SİSTEMİ ---
    function showModal(type, title, message, onConfirm) {
        const existingModal = document.getElementById('lnk-custom-modal-overlay');
        if (existingModal && existingModal.innerText.includes(title)) return;
        if (existingModal) existingModal.remove();

        const overlay = document.createElement('div');
        overlay.id = 'lnk-custom-modal-overlay';
        overlay.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.85);
            backdrop-filter: blur(8px);
            z-index: 2147483647;
            display: flex; align-items: center; justify-content: center;
            animation: fadeIn 0.2s ease-out;
        `;

        const modal = document.createElement('div');
        modal.style.cssText = `
            background: #121212;
            width: 400px;
            padding: 30px;
            border-radius: 16px;
            border: 2px solid ${type === 'alert-error' ? '#ff4444' : '#333'};
            box-shadow: 0 0 50px rgba(0,0,0,0.5);
            text-align: center;
            font-family: system-ui, -apple-system, sans-serif;
            color: #fff;
            transform: scale(0.9);
            animation: popIn 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        `;

        if (!document.getElementById('lnk-modal-style')) {
            const style = document.createElement('style');
            style.id = 'lnk-modal-style';
            style.innerHTML = `
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes popIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
                .lnk-modal-btn { padding: 12px 24px; border-radius: 8px; border: none; cursor: pointer; font-weight: 600; font-size: 14px; margin: 0 5px; transition: 0.2s; }
                .lnk-modal-btn:hover { opacity: 0.9; transform: translateY(-1px); }
                .lnk-modal-btn:active { transform: scale(0.96); }
            `;
            document.head.appendChild(style);
        }

        let buttonsHtml = '';
        if (type === 'confirm') {
            buttonsHtml = `
                <button id="lnk-modal-cancel" class="lnk-modal-btn" style="background: #333; color: #ccc;">${t('modal_cancel')}</button>
                <button id="lnk-modal-confirm" class="lnk-modal-btn" style="background: #0d6efd; color: #fff;">${t('modal_confirm')}</button>
            `;
        } else {
            buttonsHtml = `
                <button id="lnk-modal-ok" class="lnk-modal-btn" style="background: #0d6efd; color: #fff; min-width: 100px;">${t('modal_ok')}</button>
            `;
        }

        modal.innerHTML = `
            <div style="font-size: 22px; font-weight: 800; margin-bottom: 12px; color: #fff;">${title}</div>
            <div style="font-size: 16px; color: #ccc; margin-bottom: 30px; line-height: 1.5;">${message}</div>
            <div style="display: flex; justify-content: center; gap: 10px;">
                ${buttonsHtml}
            </div>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        if (type === 'confirm') {
            document.getElementById('lnk-modal-cancel').onclick = () => overlay.remove();
            document.getElementById('lnk-modal-confirm').onclick = () => {
                overlay.remove();
                if (onConfirm) onConfirm();
            };
        } else {
            document.getElementById('lnk-modal-ok').onclick = () => overlay.remove();
        }
    }

    // --- MUTATION OBSERVER (INTERCEPTOR) ---
    const observer = new MutationObserver((mutations) => {
        const limitAlert = document.querySelector('.ip-fuse-limit-alert');
        const limitOverlay = document.querySelector('[data-test-modal-id="fuse-limit-alert"]');
        const limitHeader = document.getElementById('ip-fuse-limit-alert__header');

        if (limitAlert || limitOverlay || limitHeader) {
            console.warn(">>> [INTERCEPTOR] LinkedIn Limit Uyarısı Yakalandı!");

            if (limitOverlay) limitOverlay.remove();
            if (limitAlert) limitAlert.remove();
            document.querySelectorAll('.artdeco-modal-overlay').forEach(el => el.remove());
            document.body.style.overflow = 'auto';
            document.body.classList.remove('artdeco-modal-is-open');

            isConnectorRunning = false;
            isAutoAdding = false;
            saveSettings();

            const startBtn = document.getElementById('lnk-btn-start');
            if (startBtn) {
                startBtn.textContent = t('limit_btn');
                startBtn.style.background = "#000";
            }

            setTimeout(() => {
                showModal('alert-error', t('alert_limit_title'), t('alert_limit_msg'));
            }, 100);
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    function checkWeeklyLimit() {
        if (document.getElementById('ip-fuse-limit-alert__header')) return true;
        const bodyText = document.body.innerText;
        if (bodyText.includes("Haftalık bağlantı daveti sınırına") || bodyText.includes("Weekly invitation limit")) {
            return true;
        }
        return false;
    }

    // --- OTO EKLEME ---
    function startAutoAddProcess() {
        if (!savedProfiles || savedProfiles.length === 0) {
            showModal('alert', t('alert_empty_title'), t('alert_empty_msg'));
            return;
        }

        showModal('confirm', t('confirm_auto_title'),
            `${t('confirm_auto_msg_1')}${savedProfiles.length}${t('confirm_auto_msg_2')}`,
            () => {
                isAutoAdding = true;
                autoAddIndex = 0;
                saveSettings();
                window.location.href = savedProfiles[0].url;
            }
        );
    }

    function processAutoAddStep() {
        if (!isAutoAdding) return;

        const dashboard = document.createElement('div');
        const progressPercent = Math.round(((autoAddIndex + 1) / savedProfiles.length) * 100);

        dashboard.style.cssText = `
            position: fixed; top: 80px; right: 20px; width: 280px;
            background: rgba(25, 25, 25, 0.9); backdrop-filter: blur(12px);
            border-left: 4px solid #0d6efd; border-radius: 8px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4); z-index: 999999;
            font-family: -apple-system, system-ui; color: #fff; padding: 15px;
            display: flex; flex-direction: column; gap: 10px; animation: slideIn 0.5s ease-out;
        `;

        const styleSheet = document.createElement("style");
        styleSheet.innerText = `
            @keyframes slideIn { from { opacity: 0; transform: translateX(50px); } to { opacity: 1; transform: translateX(0); } }
            .lnk-progress-bar { width: 100%; height: 6px; background: #444; border-radius: 3px; overflow: hidden; margin-top: 5px; }
            .lnk-progress-fill { height: 100%; background: #0d6efd; width: 0%; transition: width 0.5s ease; }
            .lnk-dash-btn:active { transform: scale(0.96); }
        `;
        document.head.appendChild(styleSheet);

        dashboard.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <span style="font-weight:700; font-size:14px; color:#0d6efd;">${t('dash_title')}</span>
                <span style="font-size:12px; color:#aaa;">${progressPercent}%</span>
            </div>
            <div style="font-size:13px; color:#eee;">${t('dash_person')}: <b>${autoAddIndex + 1}</b> / ${savedProfiles.length}</div>
            <div class="lnk-progress-bar"><div class="lnk-progress-fill" style="width: ${progressPercent}%"></div></div>
            <div id="lnk-status-text" style="font-size:12px; color:#ccc; min-height:18px;">${t('dash_status_scan')}</div>
        `;

        const stopBtn = document.createElement("button");
        stopBtn.className = "lnk-dash-btn";
        stopBtn.textContent = t('stop');
        stopBtn.style.cssText = `background: #333; color: #ff6b6b; border: 1px solid #444; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 600; margin-top: 5px; width: 100%; transition: all 0.2s;`;
        stopBtn.onmouseover = () => stopBtn.style.background = "#444";
        stopBtn.onmouseout = () => stopBtn.style.background = "#333";

        stopBtn.onclick = () => {
            isAutoAdding = false;
            saveSettings();
            dashboard.style.borderLeftColor = "#dc3545";
            document.getElementById('lnk-status-text').innerHTML = t('dash_stop_user');
            document.querySelector('.lnk-progress-fill').style.background = "#dc3545";
            setTimeout(() => dashboard.remove(), 2000);
        };
        dashboard.appendChild(stopBtn);
        document.body.appendChild(dashboard);

        setTimeout(async () => {
            const statusText = document.getElementById('lnk-status-text');

            if (checkWeeklyLimit()) {
                isAutoAdding = false;
                saveSettings();
                dashboard.style.borderLeftColor = "#dc3545";
                statusText.innerHTML = `<span style='color:#ff4444'>${t('dash_stop_limit')}</span>`;
                return;
            }

            const buttons = Array.from(document.querySelectorAll('button'));
            const connectBtn = buttons.find(b => (b.innerText.trim() === 'Bağlantı kur' || b.innerText.trim() === 'Connect') && !b.disabled);
            const pendingBtn = buttons.find(b => b.innerText.trim() === 'İstek gönderildi' || b.innerText.trim() === 'Pending');

            if (connectBtn) {
                statusText.innerText = t('dash_status_conn');
                connectBtn.click();
                await new Promise(r => setTimeout(r, 1000));
                const sendNowBtn = findInShadows('button[aria-label="Not olmadan gönderin"]') || document.querySelector('button[aria-label="Send without a note"]');
                if (sendNowBtn) {
                    nativeClick(sendNowBtn);
                    totalCount++;
                    lastActionDate = getFormattedDate();
                }
                statusText.innerHTML = `<span style='color:#198754'>${t('dash_status_sent')}</span>`;
                document.querySelector('.lnk-progress-fill').style.background = "#198754";
            } else if (pendingBtn) {
                statusText.innerHTML = `<span style='color:#ffc107'>${t('dash_status_pending')}</span>`;
                document.querySelector('.lnk-progress-fill').style.background = "#ffc107";
            } else {
                statusText.innerHTML = `<span style='color:#aaa'>${t('dash_status_fail')}</span>`;
            }

            autoAddIndex++;
            saveSettings();
            await new Promise(r => setTimeout(r, 1500));

            if (autoAddIndex < savedProfiles.length) {
                statusText.innerText = t('dash_next');
                window.location.href = savedProfiles[autoAddIndex].url;
            } else {
                isAutoAdding = false;
                autoAddIndex = 0;
                saveSettings();
                dashboard.style.borderLeftColor = "#198754";
                document.querySelector('.lnk-progress-fill').style.width = "100%";
                document.querySelector('.lnk-progress-fill').style.background = "#198754";
                statusText.innerText = t('dash_done');
                stopBtn.style.display = "none";
                setTimeout(() => dashboard.remove(), 5000);
            }
        }, SLEEP_BETWEEN_ACTIONS);
    }

    // --- DİĞER FONKSİYONLAR ---
    function saveCurrentProfile() {
        const url = window.location.href;
        if (!url.includes('/in/')) {
            showModal('alert', t('title'), t('error_profile'));
            return;
        }
        if (savedProfiles.some(p => p.url === url)) {
            showModal('alert', t('title'), t('error_exists'));
            return;
        }

        let name = "Unknown";
        const h1 = document.querySelector('h1');
        if (h1) name = h1.innerText.trim();
        else {
            const title = document.title.split('|')[0].trim();
            if (title) name = title;
        }

        savedProfiles.push({ name, url, date: getFormattedDate() });
        saveSettings();

        const btn = document.getElementById('lnk-btn-save');
        if(btn) {
            const oldTxt = btn.innerText;
            btn.innerText = t('save_success');
            btn.style.background = "#198754";
            setTimeout(() => { btn.innerText = oldTxt; btn.style.background = "#6610f2"; }, 1500);
        }

        const listBtn = document.getElementById('lnk-btn-list');
        if(listBtn) listBtn.textContent = `${t('list_btn')} (${savedProfiles.length})`;
    }

    function deleteProfile(index) {
        savedProfiles.splice(index, 1);
        saveSettings();
        renderSavedListView();
    }

    // --- RENDER FONKSİYONLARI ---
    function renderMainView() {
        const container = document.getElementById('lnk-panel-content');
        if(!container) return;
        container.innerHTML = '';

        const infoRow = document.createElement("div");
        infoRow.style.cssText = "text-align:center; color:#ccc; font-size:12px; margin-bottom:5px; border-bottom:1px solid #444; padding-bottom:10px; cursor:pointer;";
        infoRow.innerHTML = `<span style="color:#fff; font-weight:bold;">${t('total')}: <span id="lnk-counter-val">${totalCount}</span></span> <span style="color:#555;">|</span> <span>${t('last')}: <span id="lnk-last-date" style="color:#fff;">${lastActionDate}</span></span>`;
        infoRow.onclick = () => {
            showModal('confirm', t('confirm_reset_title'), t('confirm_reset_msg'), () => {
                totalCount = 0; lastActionDate = '-'; updateCounterDisplay();
            });
        };

        const rowStyle = "display: flex; gap: 10px; align-items: center;";
        const btnStyle = "border:none; border-radius:6px; padding:10px; cursor:pointer; font-weight:600; font-size:13px; flex-grow:1; color:#fff; text-align:center;";
        const inputStyle = "width:50px; padding:10px; border-radius:6px; border:1px solid #555; background:#222; color:#fff; text-align:center; font-size:13px; outline:none;";

        const saveRow = document.createElement("div");
        saveRow.style.cssText = rowStyle;
        const saveBtn = document.createElement("button");
        saveBtn.id = "lnk-btn-save";
        saveBtn.textContent = t('save_btn');
        saveBtn.style.cssText = btnStyle + "background: #6610f2;";
        saveBtn.onclick = saveCurrentProfile;
        const listBtn = document.createElement("button");
        listBtn.id = "lnk-btn-list";
        listBtn.textContent = `${t('list_btn')} (${savedProfiles.length})`;
        listBtn.style.cssText = btnStyle + "background: #fd7e14; max-width: 80px;";
        listBtn.onclick = renderSavedListView;
        saveRow.append(saveBtn, listBtn);

        const row1 = document.createElement("div");
        row1.style.cssText = rowStyle;
        const noteBtn = document.createElement("button");
        noteBtn.textContent = `${t('note_closer')}: ${isNoteCloserActive ? t('active') : t('passive')}`;
        noteBtn.style.cssText = btnStyle + (isNoteCloserActive ? "background: #198754;" : "background: #6c757d;");
        noteBtn.onclick = () => {
            isNoteCloserActive = !isNoteCloserActive;
            noteBtn.textContent = `${t('note_closer')}: ${isNoteCloserActive ? t('active') : t('passive')}`;
            noteBtn.style.background = isNoteCloserActive ? "#198754" : "#6c757d";
        };
        const noteInput = document.createElement("input");
        noteInput.type = "number"; noteInput.value = speedPopup; noteInput.style.cssText = inputStyle;
        noteInput.onchange = (e) => { speedPopup = parseInt(e.target.value) || 100; saveSettings(); };
        row1.append(noteBtn, noteInput);

        const row2 = document.createElement("div");
        row2.style.cssText = rowStyle;
        const startBtn = document.createElement("button");
        startBtn.id = "lnk-btn-start";
        startBtn.textContent = isConnectorRunning ? t('stop') : t('start');
        startBtn.style.cssText = btnStyle + (isConnectorRunning ? "background: #dc3545;" : "background: #0d6efd;");
        startBtn.onclick = () => {
            if (startBtn.textContent.includes(t('limit_btn'))) {
                showModal('alert-error', 'Dikkat', t('alert_limit_msg'));
                return;
            }
            isConnectorRunning = !isConnectorRunning;
            startBtn.textContent = isConnectorRunning ? t('stop') : t('start');
            startBtn.style.background = isConnectorRunning ? "#dc3545" : "#0d6efd";
        };
        const startInput = document.createElement("input");
        startInput.type = "number"; startInput.value = speedConnect; startInput.style.cssText = inputStyle;
        startInput.onchange = (e) => { speedConnect = parseInt(e.target.value) || 1000; saveSettings(); };
        row2.append(startBtn, startInput);

        const footerRow = document.createElement("div");
        footerRow.style.cssText = "display:flex; justify-content:space-between; margin-top:5px; font-size:10px; color:#777;";
        const updateLink = document.createElement("a");
        updateLink.href = UPDATE_LINK; updateLink.target = "_blank"; updateLink.style.cssText = "color:#777; text-decoration:none;"; updateLink.innerHTML = `🔄 ${t('update')}`;
        const signature = document.createElement("div"); signature.textContent = "tanersb"; signature.style.cssText = "font-style:italic;";
        footerRow.append(updateLink, signature);

        container.append(infoRow, saveRow, row1, row2, footerRow);
    }

    function renderSavedListView() {
        const container = document.getElementById('lnk-panel-content');
        if(!container) return;
        container.innerHTML = '';

        const header = document.createElement("div");
        header.innerHTML = `<b>${t('list_header')} (${savedProfiles.length})</b>`;
        header.style.cssText = "text-align:center; padding-bottom:10px; border-bottom:1px solid #444; margin-bottom:10px;";

        const listContainer = document.createElement("div");
        listContainer.style.cssText = "max-height:200px; overflow-y:auto; display:flex; flex-direction:column; gap:8px; margin-bottom:10px; padding-right:5px;";

        if (savedProfiles.length === 0) {
            listContainer.innerHTML = `<div style='text-align:center; color:#777; font-style:italic;'>${t('list_empty')}</div>`;
        } else {
            savedProfiles.forEach((profile, index) => {
                const item = document.createElement("div");
                item.style.cssText = "display:flex; justify-content:space-between; align-items:center; background:#333; padding:8px; border-radius:6px;";
                const link = document.createElement("a");
                link.href = profile.url; link.textContent = profile.name; link.target = "_blank";
                link.style.cssText = "color:#fff; text-decoration:none; font-size:13px; font-weight:bold; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:180px;";
                const delBtn = document.createElement("button");
                delBtn.innerHTML = "&times;"; delBtn.style.cssText = "background:none; border:none; color:#ff6b6b; font-size:18px; cursor:pointer;";
                delBtn.addEventListener('click', () => deleteProfile(index));
                item.append(link, delBtn);
                listContainer.append(item);
            });
        }

        const btnRow = document.createElement("div");
        btnRow.style.cssText = "display:flex; gap:5px;";

        const backBtn = document.createElement("button");
        backBtn.textContent = t('back');
        backBtn.style.cssText = "flex:1; padding:8px; background:#6c757d; border:none; border-radius:6px; color:white; cursor:pointer; font-size:11px;";
        backBtn.addEventListener('click', renderMainView);

        const autoAddBtn = document.createElement("button");
        autoAddBtn.textContent = t('auto_add');
        autoAddBtn.style.cssText = "flex:2; padding:8px; background:#0dcaf0; border:none; border-radius:6px; color:#000; font-weight:bold; cursor:pointer; font-size:11px; transition:0.2s;";
        autoAddBtn.addEventListener('click', () => { startAutoAddProcess(); });

        const clearAllBtn = document.createElement("button");
        clearAllBtn.textContent = t('clear');
        clearAllBtn.style.cssText = "flex:1; padding:8px; background:#dc3545; border:none; border-radius:6px; color:white; cursor:pointer; font-size:11px; transition:0.2s;";
        clearAllBtn.addEventListener('click', () => {
            showModal('confirm', t('confirm_clear_title'), t('confirm_clear_msg'), () => {
                savedProfiles = [];
                saveSettings();
                renderSavedListView();
            });
        });

        btnRow.append(backBtn, autoAddBtn, clearAllBtn);
        container.append(header, listContainer, btnRow);
    }

    // --- DÖNGÜLER ---
    function loopPopup() {
        if (isNoteCloserActive) {
            const sendBtn = findInShadows('button[aria-label="Not olmadan gönderin"]');
            if (sendBtn && !sendBtn.disabled) nativeClick(sendBtn);
        }
        setTimeout(loopPopup, speedPopup);
    }
    loopPopup();

    function loopConnect() {
        if (isConnectorRunning && !isAutoAdding) {
            if (checkWeeklyLimit()) {
                isConnectorRunning = false;
                const startBtn = document.getElementById('lnk-btn-start');
                if (startBtn) {
                    startBtn.textContent = t('limit_btn');
                    startBtn.style.background = "#000";
                    startBtn.style.cursor = "not-allowed";
                }
                showModal('alert-error', t('alert_limit_title'), t('alert_limit_msg'));
                return;
            }
            const isPopupOpen = findInShadows('div[role="dialog"]') || findInShadows('.artdeco-modal');
            if (!isPopupOpen) {
                const allButtons = document.querySelectorAll('button, span');
                for (let el of allButtons) {
                    if (el.innerText && el.innerText.trim() === "Bağlantı kur") {
                        const btn = el.closest('button') || el;
                        if (btn && !btn.disabled) {
                            btn.click();
                            totalCount++;
                            lastActionDate = getFormattedDate();
                            updateCounterDisplay();
                            break;
                        }
                    }
                }
            }
        }
        setTimeout(loopConnect, speedConnect);
    }
    loopConnect();

    // --- INIT ---
    function initPanel() {
        // AGRESİF TEMİZLİK: Var olan panelleri yok et
        document.querySelectorAll('#lnk-modern-panel').forEach(e => e.remove());

        if (!document.body) return setTimeout(initPanel, 500);

        if (isAutoAdding) processAutoAddStep();

        const style = document.createElement('style');
        style.innerHTML = `
            input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
            input[type=number] { -moz-appearance: textfield; }
            #lnk-panel-content ::-webkit-scrollbar { width: 5px; }
            #lnk-panel-content ::-webkit-scrollbar-track { background: #222; }
            #lnk-panel-content ::-webkit-scrollbar-thumb { background: #555; border-radius: 5px; }
            #lnk-modern-panel button:active { transform: scale(0.95); opacity: 0.9; }
            #lnk-modern-panel button { transition: transform 0.1s ease, background 0.2s; }
        `;
        document.head.appendChild(style);

        const isClosed = panelState === 'closed';
        const panel = document.createElement("div");
        panel.id = "lnk-modern-panel";
        panel.style.cssText = `position:fixed; bottom:85px; right:25px; z-index:2147483647; background:rgba(20,20,20,0.95); border:1px solid #555; color:#fff; font-family:system-ui; backdrop-filter:blur(10px); min-width:${isClosed?'auto':'280px'}; border-radius:${isClosed?'30px':'12px'}; transition:all 0.3s;`;

        const wrapper = document.createElement("div");
        wrapper.style.display = isClosed ? 'none' : 'block';
        wrapper.style.padding = "20px";

        const headerRow = document.createElement("div");
        headerRow.style.cssText = "display:flex; justify-content:space-between; align-items:center; margin-bottom:5px;";

        const title = document.createElement("div");
        title.textContent = t('title');
        title.style.cssText = "font-weight:800; font-size:16px;";

        // --- KONTROL GRUBU (DİL + KAPAT) ---
        const controlsDiv = document.createElement("div");
        controlsDiv.style.display = "flex";
        controlsDiv.style.gap = "8px";
        controlsDiv.style.alignItems = "center";

        // DİL BUTONU (YENİ)
        const langBtn = document.createElement("button");
        langBtn.textContent = currentLang.toUpperCase();
        langBtn.title = "Change Language / Dili Değiştir";
        langBtn.style.cssText = "background: #333; color: #aaa; border: 1px solid #555; border-radius: 4px; font-size: 10px; padding: 2px 5px; cursor: pointer; font-weight:bold;";
        langBtn.onclick = (e) => {
            e.stopPropagation();
            currentLang = currentLang === 'tr' ? 'en' : 'tr'; // Toggle
            saveSettings();

            // Paneli yeniden oluştur (Dil değişimi için en temiz yol)
            panel.remove();
            initPanel();
        };

        const closeBtn = document.createElement("button");
        closeBtn.innerHTML = "&minus;";
        closeBtn.style.cssText = "background:#333; color:#fff; border:none; border-radius:50%; width:28px; height:28px; cursor:pointer;";

        controlsDiv.append(langBtn, closeBtn);

        const dynamicContent = document.createElement("div");
        dynamicContent.id = "lnk-panel-content";
        dynamicContent.style.cssText = "display:flex; flex-direction:column; gap:15px; margin-top:10px;";

        headerRow.append(title, controlsDiv);
        wrapper.append(headerRow, dynamicContent);

        const miniView = document.createElement("div");
        miniView.textContent = "@tanersb";
        miniView.style.cssText = `padding:20px; cursor:pointer; font-weight:bold; display:${isClosed?'flex':'none'};`;

        miniView.onclick = () => { miniView.style.display="none"; wrapper.style.display="block"; panel.style.minWidth="280px"; panel.style.borderRadius="12px"; localStorage.setItem('LnAuto_PanelState', 'open'); };
        closeBtn.onclick = (e) => { e.stopPropagation(); wrapper.style.display="none"; miniView.style.display="flex"; panel.style.minWidth="auto"; panel.style.borderRadius="30px"; localStorage.setItem('LnAuto_PanelState', 'closed'); };

        panel.append(wrapper, miniView);
        document.body.appendChild(panel);
        renderMainView();
    }
    initPanel();
})();