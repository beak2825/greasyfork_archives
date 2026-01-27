// ==UserScript==
// @name         Nexus Easy Collection Downloader
// @license      CC BY-NC 4.0
// @version      9.2.3
// @description  This script allows you to automatically download all collection mods in sequence with a single click.
// @author       linik (Made with Gemini AI & Claude AI)
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nexusmods.com
// @match        https://www.nexusmods.com/*
// @grant        GM.xmlHttpRequest
// @grant        GM_addStyle
// @grant        GM_openInTab
// @connect      nexusmods.com
// @connect      api-router.nexusmods.com
// @run-at       document-idle
// @namespace https://greasyfork.org/users/1563278
// @downloadURL https://update.greasyfork.org/scripts/563533/Nexus%20Easy%20Collection%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/563533/Nexus%20Easy%20Collection%20Downloader.meta.js
// ==/UserScript==
(function() {
    'use strict';
    console.log('[NECD] 🚀 Script activated');

    // ========================================
    // URL DEĞİŞİKLİĞİ DİNLEYİCİSİ
    // ========================================
    let lastUrl = location.href;
    let urlMonitoringActive = false;

    const checkUrlChange = () => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            console.log('[NECD] 🔄 URL changed, reinitializing...');
            // Panel'i temizle
            const oldPanel = document.getElementById('necd-panel');
            if (oldPanel) oldPanel.remove();
            // Script'i yeniden başlat
            setTimeout(() => {
                location.reload();
            }, 100);
        }
    };

    // URL listener'ı sadece koleksiyon/mod sayfalarında aktif et
    const shouldMonitorUrl = () => {
        const pathname = window.location.pathname;
        // Koleksiyon, mod sayfaları, oyun sayfaları ve koleksiyon liste sayfaları
        return /\/collections|\/mods\/\d+|\/[a-z0-9]+\/mods/.test(pathname);
    };

    // popstate'i SADECE koleksiyon/mod sayfalarında dinle
    if (shouldMonitorUrl()) {
        window.addEventListener('popstate', checkUrlChange);
        setInterval(checkUrlChange, 500);
        urlMonitoringActive = true;
        console.log('[NECD] 🔍 URL monitoring activated');
    } else {
        console.log('[NECD] 🔍 URL monitoring disabled (not on collection/mod page)');
    }
    // ========================================
    // 1. GLOBAL DİL SÖZLÜĞÜ
    // ========================================
    const i18n = {
        tr: {
            welcomeTitle: "ÖN KONTROL LİSTESİ",
            btnUnderstand: "ANLAŞILDI",
            labelColor: "🎨 Tema Rengi",
            labelAnim: "🎬 Animasyonlar",
            labelSound: "🔊 Bitiş Sesi",
            labelWait: "⏳ Bekleme (sn)",
            btnLaunch: "BAŞLAT",
            btnPause: "DURAKLAT",
            btnResume: "DEVAM ET",
            btnReset: "SIFIRLA",
            msgReady: "Hazır - İndirmeye başlayabilirsiniz",
            msgLoading: "Modlar yükleniyor...",
            msgDownloading: "📥 İndiriliyor: ",
            msgFinished: "✅ TAMAMLANDI!",
            msgError: "❌ Hata: Mod listesi alınamadı",
            confirmReset: "Tüm ilerleme sıfırlanacak. Emin misiniz?",
            warnPopup: "<b>Pop-up İzni:</b> Tarayıcının sekme açmasına izin verin.",
            warnMulti: "<b>Çoklu İndirme:</b> Tarayıcının birden fazla dosya indirmesini onaylayın.",
            warnAdult: "<b>Yetişkin İçerik:</b> Nexusmods profilinizin yetişkin içerik ayarlarını kontrol edin.",
            warnStorage: "<b>Depolama:</b> Disk alanınızı kontrol edin.",
            warnAsk: "<b>İndirme Ayarı:</b> 'Nereye indirileceğini sor' seçeneğini kapatın.",
            tooltipAnim: "Performans problemi yaşıyorsanız bunu kapatın.",
            tooltipSound: "İndirme işlemi bittiğinde ses çalar.",
            tooltipWait: "Modları indirmek için beklenecek süre. 15 saniye Nexus bot korumasına karşı idealdir.",
            errGraphQL: "❌ Hata: GraphQL isteği başarısız",
            errModData: "❌ Hata: Mod verileri bulunamadı",
            errParse: "❌ Hata: Veri ayrıştırma hatası",
            errAPI: "❌ Hata: API isteği başarısız",
            errTimeout: "❌ Hata: İstek zaman aşımına uğradı",
            errTab: "❌ Hata: Sekme açılamadı"
        },
        en: {
            welcomeTitle: "PRE-CHECKLIST",
            btnUnderstand: "I UNDERSTAND",
            labelColor: "🎨 Theme Color",
            labelAnim: "🎬 Animations",
            labelSound: "🔊 Completion Sound",
            labelWait: "⏳ Wait Interval (sec)",
            btnLaunch: "LAUNCH",
            btnPause: "PAUSE",
            btnResume: "RESUME",
            btnReset: "RESET",
            msgReady: "Ready - You may start downloading",
            msgLoading: "Loading mods...",
            msgDownloading: "📥 Downloading: ",
            msgFinished: "✅ COMPLETED!",
            msgError: "❌ Error: Could not retrieve mod list",
            confirmReset: "All progress will be reset. Are you sure?",
            warnPopup: "<b>Pop-up Permission:</b> Please allow the browser to open new tabs.",
            warnMulti: "<b>Multiple Downloads:</b> Please allow the browser to download multiple files simultaneously.",
            warnAdult: "<b>Adult Content:</b> Please check the adult content settings in your Nexusmods profile.",
            warnStorage: "<b>Storage:</b> Please check your available disk space.",
            warnAsk: "<b>Download Settings:</b> Please disable the 'Ask where to save each file before downloading' option.",
            tooltipAnim: "Disable this option if you are experiencing performance issues or lag.",
            tooltipSound: "Plays an audible notification when the entire download process is finished.",
            tooltipWait: "The duration to wait between mod downloads. 15 seconds is ideal to avoid Nexus anti-bot protection.",
            errGraphQL: "❌ Error: GraphQL request failed",
            errModData: "❌ Error: Mod data not found",
            errParse: "❌ Error: Data parsing error",
            errAPI: "❌ Error: API request failed",
            errTimeout: "❌ Error: Request timeout",
            errTab: "❌ Error: Could not open tab"
        },
de: {
            welcomeTitle: "VORAB-CHECKLISTE",
            btnUnderstand: "VERSTANDEN",
            labelColor: "🎨 Schema-Farbe",
            labelAnim: "🎬 Animationen",
            labelSound: "🔊 Abschluss-Ton",
            labelWait: "⏳ Wartezeit (sek)",
            btnLaunch: "STARTEN",
            btnPause: "PAUSE",
            btnResume: "FORTSETZEN",
            btnReset: "ZURÜCKSETZEN",
            msgReady: "Bereit - Sie können mit dem Herunterladen beginnen",
            msgLoading: "Mods werden geladen...",
            msgDownloading: "📥 Herunterladen: ",
            msgFinished: "✅ ABGESCHLOSSEN!",
            msgError: "❌ Fehler: Mod-Liste konnte nicht abgerufen werden",
            confirmReset: "Der gesamte Fortschritt wird zurückgesetzt. Sind Sie sicher?",
            warnPopup: "<b>Pop-up-Berechtigung:</b> Erlauben Sie dem Browser, neue Tabs zu öffnen.",
            warnMulti: "<b>Mehrere Downloads:</b> Erlauben Sie dem Browser, mehrere Dateien gleichzeitig herunterzuladen.",
            warnAdult: "<b>Inhalte für Erwachsene:</b> Überprüfen Sie die Einstellungen für jugendgefährdende Inhalte in Ihrem Nexusmods-Profil.",
            warnStorage: "<b>Speicherplatz:</b> Überprüfen Sie Ihren verfügbaren Speicherplatz auf der Festplatte.",
            warnAsk: "<b>Download-Einstellung:</b> Deaktivieren Sie die Option 'Vor dem Download fragen, wo die Datei gespeichert werden soll'.",
            tooltipAnim: "Deaktivieren Sie diese Option, wenn Sie Performance-Probleme oder Verzögerungen feststellen.",
            tooltipSound: "Spielt ein akustisches Signal ab, wenn der gesamte Download-Vorgang abgeschlossen ist.",
            tooltipWait: "Die Zeitspanne, die zwischen den einzelnen Mod-Downloads gewartet wird. 15 Sekunden sind ideal, um den Anti-Bot-Schutz von Nexus zu umgehen.",
            errGraphQL: "❌ Fehler: GraphQL-Anfrage fehlgeschlagen",
            errModData: "❌ Fehler: Mod-Daten nicht gefunden",
            errParse: "❌ Fehler: Datenanalyse fehlgeschlagen",
            errAPI: "❌ Fehler: API-Anfrage fehlgeschlagen",
            errTimeout: "❌ Fehler: Anfrage-Zeitüberschreitung",
            errTab: "❌ Fehler: Registerkarte konnte nicht geöffnet werden"
        },
es: {
            welcomeTitle: "LISTA DE CONTROL PREVIO",
            btnUnderstand: "ENTENDIDO",
            labelColor: "🎨 Color del Tema",
            labelAnim: "🎬 Animaciones",
            labelSound: "🔊 Sonido de Finalización",
            labelWait: "⏳ Intervalo de Espera (seg)",
            btnLaunch: "INICIAR",
            btnPause: "PAUSAR",
            btnResume: "REANUDAR",
            btnReset: "REINICIAR",
            msgReady: "Listo - Puede comenzar la descarga",
            msgLoading: "Cargando mods...",
            msgDownloading: "📥 Descargando: ",
            msgFinished: "✅ ¡COMPLETADO!",
            msgError: "❌ Error: No se pudo obtener la lista de mods",
            confirmReset: "Se perderá todo el progreso. ¿Está seguro?",
            warnPopup: "<b>Permiso de Pop-up:</b> Permita que el navegador abra nuevas pestañas.",
            warnMulti: "<b>Descargas Múltiples:</b> Autorice al navegador para descargar varios archivos simultáneamente.",
            warnAdult: "<b>Contenido Adulto:</b> Verifique la configuración de contenido para adultos en su perfil de Nexusmods.",
            warnStorage: "<b>Almacenamiento:</b> Compruebe el espacio disponible en su disco.",
            warnAsk: "<b>Ajuste de Descarga:</b> Desactive la opción 'Preguntar dónde se guardará cada archivo antes de descargar'.",
            tooltipAnim: "Desactive esta opción si experimenta problemas de rendimiento o lentitud en la interfaz.",
            tooltipSound: "Reproduce una notificación sonora cuando el proceso de descarga ha finalizado por completo.",
            tooltipWait: "El tiempo de espera entre la descarga de cada mod. 15 segundos es el intervalo ideal para evitar la protección anti-bot de Nexus.",
            errGraphQL: "❌ Error: Solicitud GraphQL fallida",
            errModData: "❌ Error: Datos de mod no encontrados",
            errParse: "❌ Error: Error al analizar datos",
            errAPI: "❌ Error: Solicitud API fallida",
            errTimeout: "❌ Error: Tiempo de espera agotado",
            errTab: "❌ Error: No se pudo abrir la pestaña"
        },
fr: {
            welcomeTitle: "LISTE DE CONTRÔLE PRÉALABLE",
            btnUnderstand: "COMPRIS",
            labelColor: "🎨 Couleur du Thème",
            labelAnim: "🎬 Animations",
            labelSound: "🔊 Son de Fin",
            labelWait: "⏳ Délai d'Attente (sec)",
            btnLaunch: "LANCER",
            btnPause: "PAUSER",
            btnResume: "REPRENDRE",
            btnReset: "RÉINITIALISER",
            msgReady: "Prêt - Vous pouvez commencer le téléchargement",
            msgLoading: "Chargement des mods...",
            msgDownloading: "📥 Téléchargement : ",
            msgFinished: "✅ TERMINÉ !",
            msgError: "❌ Erreur : Impossible de récupérer la liste des mods",
            confirmReset: "Toute la progression sera réinitialisée. Êtes-vous sûr ?",
            warnPopup: "<b>Autorisation Pop-up :</b> Autorisez le navigateur à ouvrir de nouveaux onglets.",
            warnMulti: "<b>Téléchargements Multiples :</b> Autorisez le navigateur à télécharger plusieurs fichiers simultanément.",
            warnAdult: "<b>Contenu Adulte :</b> Vérifiez les paramètres de contenu adulte dans votre profil Nexusmods.",
            warnStorage: "<b>Stockage :</b> Vérifiez l'espace disque disponible.",
            warnAsk: "<b>Paramètre de Téléchargement :</b> Désactivez l'option 'Demander où enregistrer chaque fichier avant le téléchargement'.",
            tooltipAnim: "Désactivez cette option si vous rencontrez des problèmes de performance ou de fluidité.",
            tooltipSound: "Émet un signal sonore lorsque l'ensemble du processus de téléchargement est terminé.",
            tooltipWait: "Le temps d'attente entre le téléchargement de chaque mod. Un délai de 15 secondes est idéal pour contourner la protection anti-bot de Nexus.",
            errGraphQL: "❌ Erreur : Requête GraphQL échouée",
            errModData: "❌ Erreur : Données de mod non trouvées",
            errParse: "❌ Erreur : Erreur d'analyse des données",
            errAPI: "❌ Erreur : Requête API échouée",
            errTimeout: "❌ Erreur : Délai d'attente dépassé",
            errTab: "❌ Erreur : Impossible d'ouvrir l'onglet"
        },
ru: {
            welcomeTitle: "ПРЕДВАРИТЕЛЬНАЯ ПРОВЕРКА",
            btnUnderstand: "ПОНЯТНО",
            labelColor: "🎨 Цвет темы",
            labelAnim: "🎬 Анимации",
            labelSound: "🔊 Звук завершения",
            labelWait: "⏳ Время ожидания (сек)",
            btnLaunch: "ЗАПУСТИТЬ",
            btnPause: "ПАУЗА",
            btnResume: "ПРОДОЛЖИТЬ",
            btnReset: "СБРОСИТЬ",
            msgReady: "Готово - Вы можете начинать загрузку",
            msgLoading: "Загрузка модов...",
            msgDownloading: "📥 Загрузка: ",
            msgFinished: "✅ ЗАВЕРШЕНО!",
            msgError: "❌ Ошибка: Не удалось получить список модов",
            confirmReset: "Весь прогресс будет сброшен. Вы уверены?",
            warnPopup: "<b>Разрешение на поп-апы:</b> Разрешите браузеру открывать новые вкладки.",
            warnMulti: "<b>Множественная загрузка:</b> Разрешите браузеру скачивать несколько файлов одновременно.",
            warnAdult: "<b>Контент для взрослых:</b> Проверьте настройки контента для взрослых в вашем профиле Nexusmods.",
            warnStorage: "<b>Хранилище:</b> Проверьте наличие свободного места на диске.",
            warnAsk: "<b>Настройка загрузки:</b> Отключите опцию 'Всегда спрашивать место сохранения файлов'.",
            tooltipAnim: "Отключите эту опцию, если вы испытываете проблемы с производительностью или задержки интерфейса.",
            tooltipSound: "Воспроизводит звуковое уведомление, когда весь процесс загрузки полностью завершен.",
            tooltipWait: "Время ожидания между загрузками модов. 15 секунд — идеальный интервал для обхода анти-бот защиты Nexus.",
            errGraphQL: "❌ Ошибка: Запрос GraphQL не выполнен",
            errModData: "❌ Ошибка: Данные мода не найдены",
            errParse: "❌ Ошибка: Ошибка разбора данных",
            errAPI: "❌ Ошибка: Запрос API не выполнен",
            errTimeout: "❌ Ошибка: Истекло время ожидания",
            errTab: "❌ Ошибка: Не удалось открыть вкладку"
        },
zh: {
            welcomeTitle: "预检清单",
            btnUnderstand: "明白了",
            labelColor: "🎨 主题颜色",
            labelAnim: "🎬 动画效果",
            labelSound: "🔊 完成提示音",
            labelWait: "⏳ 等待间隔 (秒)",
            btnLaunch: "开始",
            btnPause: "暂停",
            btnResume: "继续",
            btnReset: "重置",
            msgReady: "就绪 - 您可以开始下载了",
            msgLoading: "正在加载模组...",
            msgDownloading: "📥 正在下载：",
            msgFinished: "✅ 已完成！",
            msgError: "❌ 错误：无法获取模组列表",
            confirmReset: "所有进度将被重置。您确定吗？",
            warnPopup: "<b>弹窗权限：</b>请允许浏览器打开新标签页。",
            warnMulti: "<b>多文件下载：</b>请授权浏览器同时下载多个文件。",
            warnAdult: "<b>成人内容：</b>请检查您 Nexusmods 个人资料中的成人内容设置。",
            warnStorage: "<b>存储空间：</b>请检查您的磁盘可用空间。",
            warnAsk: "<b>下载设置：</b>请关闭“下载前询问每个文件的保存位置”选项。",
            tooltipAnim: "如果您遇到性能问题或界面卡顿，请关闭此选项。",
            tooltipSound: "当所有下载任务完成后，将播放声音通知。",
            tooltipWait: "下载每个模组之间的等待时间。15 秒是规避 Nexus 反机器人检测机制的最佳间隔。",
            errGraphQL: "❌ 错误：GraphQL 请求失败",
            errModData: "❌ 错误：找不到模组数据",
            errParse: "❌ 错误：数据解析错误",
            errAPI: "❌ 错误：API 请求失败",
            errTimeout: "❌ 错误：请求超时",
            errTab: "❌ 错误：无法打开标签页"
        }
    };
let currentLang = localStorage.getItem('necd_lang') || (['tr', 'zh', 'de', 'fr', 'ru', 'es'].find(l => navigator.language.startsWith(l)) || 'en');
    let lang = i18n[currentLang] || i18n.en;
    // ========================================
    // 2. İNDİRME MOTORU (SEKME İÇİ)
    // ========================================
    if (window.location.href.includes('&necd=true')) {
        console.log('[NECD] 📥 Download page - bypass active');

        // Tekil mod indirmesi mi kontrol et
        const isSingleModDownload = window.location.href.includes('&single_mod=true');
        if (isSingleModDownload) {
            console.log('[NECD] 🎯 Single mod download detected - bypassing wait time');
            // localStorage'ı sıfırla ki nextFile() bekleme yapmadan devam etsin
            localStorage.setItem('necd_sira', '0');
        }

        let dlTriggered = false; // Çift indirmeyi önlemek için flag

        const triggerDL = () => {
            if (dlTriggered) {
                console.log('[NECD] ⚠️ Download already triggered, skipping duplicate');
                return false;
            }

            const fileId = new URLSearchParams(window.location.search).get('file_id');
            if (!fileId) {
                console.log('[NECD] ⏳ Waiting for file_id...');
                setTimeout(triggerDL, 1000);
                return false;
            }

            dlTriggered = true; // Flag'i ayarla

            const gameId = document.querySelector('section[data-game-id]')?.getAttribute('data-game-id') ||
                           document.querySelector('#section')?.getAttribute('data-game-id') || "";

            console.log('[NECD] ⏳ Creating download URL...', { fileId, gameId });

            GM.xmlHttpRequest({
                method: 'POST',
                url: 'https://www.nexusmods.com/Core/Libs/Common/Managers/Downloads?GenerateDownloadUrl',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                data: `fid=${encodeURIComponent(fileId)}&game_id=${encodeURIComponent(gameId)}`,
                timeout: 10000,
                onload: (response) => {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.url) {
                            console.log('[NECD] ✅ Download started');
                            window.location.href = data.url;
                            setTimeout(() => window.close(), 4000);
                        } else {
                            console.error('[NECD] ❌ No download URL in response:', data);
                            dlTriggered = false; // Retry için flag'i sıfırla
                            setTimeout(triggerDL, 2000);
                        }
                    } catch (e) {
                        console.error('[NECD] ❌ Parse error:', e);
                        dlTriggered = false; // Retry için flag'i sıfırla
                        setTimeout(triggerDL, 2000);
                    }
                },
                onerror: (err) => {
                    console.error('[NECD] ❌ Request error:', err);
                    dlTriggered = false; // Retry için flag'i sıfırla
                    setTimeout(triggerDL, 2000);
                }
            });
            return true;
        };

        setTimeout(triggerDL, 500);
        return;
    }
    // ========================================
    // 3. UI DEĞİŞKENLERİ
    // ========================================
    let sira = parseInt(localStorage.getItem('necd_sira')) || 0;
    let anaRenk = localStorage.getItem('necd_color') || '#009dff';
    let isMin = localStorage.getItem('necd_is_minimized') === 'true';
    let animActive = localStorage.getItem('necd_anim') !== 'false';
    let soundActive = localStorage.getItem('necd_sound') !== 'false';
    let savedPos = JSON.parse(localStorage.getItem('necd_pos')) || {
        x: Math.max(0, window.innerWidth - 340),
        y: Math.max(0, window.innerHeight - 590)
    };
    let isStarted = false;
    let isRunning = false;
    let modListesi = [];
    let downloadTimer = null;
    const finishAudio = new Audio('https://actions.google.com/sounds/v1/alarms/bugle_tune.ogg');
    const getAnimCSS = () => animActive ?
        'width 0.3s cubic-bezier(0.4, 0, 0.2, 1), height 0.3s cubic-bezier(0.4, 0, 0.2, 1), border-radius 0.3s ease, background-color 0.3s ease' :
        'none';

    // ========================================
    // 4. CSS (TEK SEFERLIK INJECTION)
    // ========================================
    const injectCSS = () => {
        if (document.getElementById('necd-global-style')) return; // Zaten eklenmişse skip
        GM_addStyle(`
:root {
        --necd-primary: ${anaRenk};
        --necd-primary-dark: ${adjustColor(anaRenk, -20)};
        --necd-primary-alpha: ${anaRenk}40;
    }
            #necd-panel {
                position: fixed;
                z-index: 100000;
                background: linear-gradient(135deg, rgba(15, 15, 20, 0.98) 0%, rgba(20, 20, 28, 0.98) 100%);
                backdrop-filter: blur(20px) saturate(180%);
                border: 2px solid var(--necd-primary);
                border-radius: 16px;
                color: #fff;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                box-shadow: 0 20px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.05) inset;
                width: 320px;
                height: 550px;
                display: flex;
                flex-direction: column;
                overflow: hidden;
                transition: ${getAnimCSS()};
                will-change: left, top, width, height;
            }
            #necd-panel.minimized {
                width: 54px !important;
                height: 54px !important;
                border-radius: 50% !important;
                cursor: pointer !important;
                background: linear-gradient(135deg, var(--necd-primary) 0%, var(--necd-primary-dark) 100%) !important;
                border-color: rgba(255,255,255,0.3) !important;
                box-shadow: 0 8px 24px rgba(0,0,0,0.5);
            }
            #necd-panel.minimized * { display: none !important; }
            #necd-panel.minimized::before {
                content: "🚀";
                display: block !important;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 24px;
                animation: pulse 2s ease-in-out infinite;
            }
            @keyframes pulse {
                0%, 100% { transform: translate(-50%, -50%) scale(1); }
                50% { transform: translate(-50%, -50%) scale(1.1); }
            }
            #necd-welcome {
                position: absolute;
                top: 48px;
                left: 0;
                width: 100%;
                height: calc(100% - 48px);
                background: linear-gradient(180deg, #0f0f14 0%, #14141c 100%);
                z-index: 90;
                display: flex;
                flex-direction: column;
                padding: 20px;
                box-sizing: border-box;
                overflow-y: auto;
            }
            .welcome-title {
                color: var(--necd-primary);
                font-weight: 800;
                font-size: 14px;
                margin-bottom: 12px;
                text-align: center;
                border-bottom: 2px solid var(--necd-primary-alpha);
                padding-bottom: 10px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .welcome-list {
                list-style: none;
                padding: 0;
                margin: 0;
                font-size: 11px;
                color: #ccc;
                flex-grow: 1;
                overflow-y: auto;
            }
            .welcome-list li {
                margin-bottom: 10px;
                padding: 8px 12px 8px 28px;
                position: relative;
                line-height: 1.4;
                background: rgba(255,255,255,0.03);
                border-radius: 6px;
                border-left: 3px solid var(--necd-primary);
            }
            .welcome-list li::before {
                content: "✓";
                position: absolute;
                left: 8px;
                color: var(--necd-primary);
                font-weight: bold;
                font-size: 14px;
                top: 8px;
            }
            #necd-header {
                background: linear-gradient(135deg, rgba(15, 15, 20, 0.98) 0%, rgba(20, 20, 28, 0.98) 100%);
                color: #ffffff;
                padding: 0 18px;
                cursor: move;
                font-weight: 700;
                display: flex;
                justify-content: space-between;
                align-items: center;
                height: 48px;
                user-select: none;
                z-index: 102;
                box-shadow: 0 2px 10px rgba(0,0,0,0.3);
                position: relative;
                border-bottom: 2px solid var(--necd-primary);
            }
            #necd-body {
                padding: 18px;
                flex-grow: 1;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                gap: 8px;
            }
            .necd-row-wrap {
                position: relative;
                background: rgba(255,255,255,0.02);
                border-radius: 8px;
                padding: 4px 0;
            }
            .necd-row-item {
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-size: 12px;
                padding: 8px 12px;
            }
            .necd-tooltip-box {
                position: absolute;
                bottom: 100%;
                left: 50%;
                transform: translateX(-50%);
                width: 90%;
                background: rgba(0,0,0,0.95);
                color: #fff;
                font-size: 10px;
                padding: 8px 10px;
                border-radius: 6px;
                border-left: 3px solid var(--necd-primary);
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.2s, transform 0.2s;
                z-index: 100;
                box-shadow: 0 4px 12px rgba(0,0,0,0.5);
                transform: translateX(-50%) translateY(5px);
            }
            .necd-row-wrap:hover .necd-tooltip-box {
                opacity: 1;
                transform: translateX(-50%) translateY(-5px);
            }
            .necd-main-btn {
                border: none;
                padding: 12px;
                width: 100%;
                cursor: pointer;
                font-weight: 700;
                border-radius: 8px;
                background: linear-gradient(135deg, var(--necd-primary) 0%, var(--necd-primary-dark) 100%);
                color: white;
                font-size: 12px;
                outline: none;
                transition: transform 0.2s, box-shadow 0.2s;
                box-shadow: 0 4px 12px var(--necd-primary-alpha);
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .necd-main-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 16px var(--necd-primary-alpha);
            }
            .necd-main-btn:active {
                transform: translateY(0);
            }
            #necd-counter-display {
                font-size: 32px;
                text-align: center;
                font-weight: 800;
                color: var(--necd-primary);
                margin: 8px 0;
                text-shadow: 0 2px 10px var(--necd-primary-alpha);
            }
            #necd-log-status {
                font-size: 10px;
                text-align: center;
                color: #888;
                min-height: 30px;
                background: rgba(255,255,255,0.02);
                padding: 8px;
                border-radius: 6px;
            }
            #necd-version-footer {
                font-size: 9px;
                text-align: center;
                color: #ffffff;
                opacity: 0.6;
                padding: 6px 0;
                border-top: 1px solid rgba(255,255,255,0.1);
                margin-top: 8px;
                font-weight: 500;
                letter-spacing: 0.3px;
            }
            .necd-select {
                background: rgba(255,255,255,0.08);
                color: #fff;
                border: 1px solid rgba(255,255,255,0.1);
                border-radius: 6px;
                padding: 4px 8px;
                font-size: 11px;
                outline: none;
                cursor: pointer;
                transition: background 0.2s;
            }
            .necd-select option {
                color: #000000 !important;
                background-color: #ffffff !important;
            }
            .necd-select:hover {
                background: rgba(255,255,255,0.12);
            }
            .test-sound-btn {
                background: rgba(255,255,255,0.1);
                border: 1px solid rgba(255,255,255,0.2);
                color: #fff;
                border-radius: 4px;
                padding: 2px 8px;
                cursor: pointer;
                font-size: 10px;
                font-weight: 600;
                transition: background 0.2s;
            }
            .test-sound-btn:hover {
                background: rgba(255,255,255,0.2);
            }
            input[type="number"] {
                width: 50px;
                background: rgba(255,255,255,0.08);
                color: #fff;
                border: 1px solid rgba(255,255,255,0.1);
                border-radius: 6px;
                text-align: center;
                padding: 4px;
                outline: none;
            }
            input[type="checkbox"] {
                width: 18px;
                height: 18px;
                cursor: pointer;
                accent-color: var(--necd-primary);
            }
            input[type="color"] {
                border: 2px solid rgba(255,255,255,0.2);
                width: 32px;
                height: 32px;
                background: none;
                cursor: pointer;
                border-radius: 6px;
                transition: border-color 0.2s;
            }
            input[type="color"]:hover {
                border-color: var(--necd-primary);
            }
#necd-color-input:hover {
    border-color: var(--necd-primary); /* DEĞİŞTİ - Üstüne gelince parlar */
    box-shadow: 0 0 8px var(--necd-primary-alpha); /* Hafif dış ışıma */
}
        `);
        const styleEl = document.createElement('style');
        styleEl.id = 'necd-global-style';
        document.head.appendChild(styleEl);
    };
    // Renk yardımcı fonksiyonu
    function adjustColor(color, amount) {
        const clamp = (val) => Math.min(255, Math.max(0, val));
        const num = parseInt(color.replace("#",""), 16);
        const r = clamp((num >> 16) + amount);
        const g = clamp(((num >> 8) & 0x00FF) + amount);
        const b = clamp((num & 0x0000FF) + amount);
        return "#" + (0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1);
    }
    injectCSS();
    // ========================================
    // 5. PANEL OLUŞTUR
    // ========================================
    const panel = document.createElement('div');
    panel.id = 'necd-panel';
    if (isMin) panel.classList.add('minimized');
    // Pozisyon güvenlik kontrolü
    const safePos = fixPosition(savedPos.x, savedPos.y, 320, 550);
    panel.style.left = safePos.x + 'px';
    panel.style.top = safePos.y + 'px';
    const renderUI = (showWelcome = false) => {
        const langOptions = Object.keys(i18n).map(code =>
            `<option value="${code}" ${currentLang === code ? 'selected' : ''}>${code.toUpperCase()}</option>`
        ).join('');
        const modCount = modListesi.length || 0;
        const statusMsg = modListesi.length === 0 ? lang.msgLoading : lang.msgReady;
        panel.innerHTML = `
            <div id="necd-header">
                <div style="display: flex; flex-direction: column; gap: 2px;">
                    <span style="font-size: 11px; opacity: 0.7; letter-spacing: 0.5px;">NEXUS EASY COLLECTION</span>
                    <span style="font-size: 13px; font-weight: 800;">DOWNLOADER</span>
                </div>
                <div id="necd-min-toggle" style="cursor:pointer; font-size:20px; color: var(--necd-primary); transition: transform 0.2s;">−</div>
            </div>
            <div id="necd-welcome" style="display: ${showWelcome ? 'flex' : 'none'}">
                <div class="necd-row-item" style="margin-bottom:15px; border-bottom: 2px solid var(--necd-primary-alpha); padding-bottom:12px;">
                    <span style="font-size:18px;">🌐</span>
                    <select class="necd-lang-selector necd-select">${langOptions}</select>
                </div>
                <div class="welcome-title">${lang.welcomeTitle}</div>
                <ul class="welcome-list">
                    <li>${lang.warnPopup}</li>
                    <li>${lang.warnMulti}</li>
                    <li>${lang.warnAdult}</li>
                    <li>${lang.warnStorage}</li>
                    <li>${lang.warnAsk}</li>
                </ul>
                <button id="necd-understand-btn" class="necd-main-btn" style="margin-top:auto;">${lang.btnUnderstand}</button>
            </div>
            <div id="necd-body">
            <div class="necd-row-wrap">
                <div class="necd-row-item">
                    <span>🌐</span>
                    <select class="necd-lang-selector necd-select">${langOptions}</select>
                </div>
            </div>
            <div class="necd-row-wrap">
                <div class="necd-row-item">
                    <span>${lang.labelColor}</span>
                    <input type="color" id="necd-color-input" value="${anaRenk}">
                </div>
            </div>
            <div class="necd-row-wrap">
                <div class="necd-row-item">
                    <span>${lang.labelAnim} ⓘ</span>
                    <input type="checkbox" id="necd-anim-check" ${animActive ? 'checked' : ''}>
                </div>
                <div class="necd-tooltip-box">${lang.tooltipAnim}</div>
            </div>
            <div class="necd-row-wrap">
                <div class="necd-row-item">
                    <span>${lang.labelSound} ⓘ</span>
                    <div style="display:flex; gap:8px; align-items:center;">
                        <button id="necd-test-sound" class="test-sound-btn">TEST</button>
                        <input type="checkbox" id="necd-sound-check" ${soundActive ? 'checked' : ''}>
                    </div>
                </div>
                <div class="necd-tooltip-box">${lang.tooltipSound}</div>
            </div>
            <div class="necd-row-wrap">
                <div class="necd-row-item">
                    <span>${lang.labelWait} ⓘ</span>
                    <input type="number" id="necd-wait-input" value="15" min="5" max="60">
                </div>
                <div class="necd-tooltip-box">${lang.tooltipWait}</div>
            </div>
            <div id="necd-counter-display">${sira} / ${modCount}</div>
            <button id="necd-launch-btn" class="necd-main-btn" style="display: ${isStarted ? 'none' : 'block'}">
                ${lang.btnLaunch}
            </button>
            <div id="necd-action-group" style="display: ${isStarted ? 'flex' : 'none'}; gap:8px;">
                <button id="necd-pause-btn" class="necd-main-btn" style="flex:1;"></button>
                <button id="necd-reset-btn" class="necd-main-btn" style="background: linear-gradient(135deg, #e53e3e 0%, #c53030 100%); width:90px;">${lang.btnReset}</button>
            </div>
            <div id="necd-log-status">${statusMsg}</div>
            <div id="necd-version-footer">v9.2.2</div>
        </div>
    `;
    // attachEvents() çağrısını panel DOM'a eklendikten sonra yapacağız
    attachEvents();
};

const attachEvents = () => {
    // Pause/Resume UI güncelle
    const updatePauseResumeUI = () => {
        const btn = document.getElementById('necd-pause-btn');
        if(!btn) return;
        if (isRunning) {
            btn.innerText = lang.btnPause;
            btn.style.background = "linear-gradient(135deg, #dd6b20 0%, #c05621 100%)";
        } else {
            btn.innerText = lang.btnResume;
            btn.style.background = "linear-gradient(135deg, #2d3748 0%, #1a202c 100%)";
        }
    };

    // Sürükleme - null check ekle
    const header = document.getElementById('necd-header');
    if (header) {
        header.onmousedown = startDrag;
    }

    // Minimize - null check ekle
    const minToggle = document.getElementById('necd-min-toggle');
    if (minToggle) {
        minToggle.onclick = (e) => {
            e.stopPropagation();
            togglePanel(true);
        };
        minToggle.onmouseover = () => {
            minToggle.style.transform = 'scale(1.2)';
        };
        minToggle.onmouseout = () => {
            minToggle.style.transform = 'scale(1)';
        };
    }

    // Hoşgeldin kapat
    const welcomeBtn = document.getElementById('necd-understand-btn');
    if (welcomeBtn) {
        welcomeBtn.onclick = () => {
            const welcomeDiv = document.getElementById('necd-welcome');
            if (welcomeDiv) welcomeDiv.style.display = 'none';
        };
    }

    // Dil değiştir
    document.querySelectorAll('.necd-lang-selector').forEach(select => {
        select.onchange = (e) => {
            currentLang = e.target.value;
            localStorage.setItem('necd_lang', currentLang);
            lang = i18n[currentLang] || i18n.en;
            const welcomeOpen = document.getElementById('necd-welcome').style.display === 'flex';
            renderUI(welcomeOpen);
            // Dil değişiminden sonra event listener'ları yeniden bağla
            setTimeout(() => {
                attachEvents();
            }, 50);
        };
    });
    // Ses test
    const testBtn = document.getElementById('necd-test-sound');
    if (testBtn) {
        testBtn.onclick = (e) => {
            e.stopPropagation();
            finishAudio.play().catch(err => console.warn('[NECD] The sound could not be played:', err));
        };
    }
    // İndirme başlat
    const launchBtn = document.getElementById('necd-launch-btn');
    if (launchBtn) {
        launchBtn.onclick = () => {
            if (modListesi.length === 0) {
                alert(lang.msgError);
                return;
            }
            isStarted = true;
            isRunning = true;
            launchBtn.style.display = 'none';
            document.getElementById('necd-action-group').style.display = 'flex';
            updatePauseResumeUI();
            nextFile();
        };
    }
    // Pause/Resume
    const pauseBtn = document.getElementById('necd-pause-btn');
    if (pauseBtn) {
        pauseBtn.onclick = function() {
            isRunning = !isRunning;
            if (isRunning) {
                nextFile();
            } else {
                if (downloadTimer) clearTimeout(downloadTimer);
            }
            updatePauseResumeUI();
        };
    }
    // Reset
    const resetBtn = document.getElementById('necd-reset-btn');
    if (resetBtn) {
        resetBtn.onclick = () => {
            if (confirm(lang.confirmReset)) {
                localStorage.setItem('necd_sira', 0);
                location.reload();
            }
        };
    }
    // Animasyon toggle
    const animCheck = document.getElementById('necd-anim-check');
    if (animCheck) {
        animCheck.onchange = (e) => {
            animActive = e.target.checked;
            localStorage.setItem('necd_anim', animActive);
            panel.style.transition = getAnimCSS();
        };
    }
    // Ses toggle
    const soundCheck = document.getElementById('necd-sound-check');
    if (soundCheck) {
        soundCheck.onchange = (e) => {
            soundActive = e.target.checked;
            localStorage.setItem('necd_sound', soundActive);
        };
    }
    // Renk değiştir
const colorInp = document.getElementById('necd-color-input');
if (colorInp) {
    colorInp.oninput = (e) => {
        const yeniRenk = e.target.value;
        anaRenk = yeniRenk;
        // Sayfadaki tüm "var(--necd-primary)" yazan yerleri tek seferde günceller
        document.documentElement.style.setProperty('--necd-primary', yeniRenk);
        document.documentElement.style.setProperty('--necd-primary-dark', adjustColor(yeniRenk, -15));
        document.documentElement.style.setProperty('--necd-primary-alpha', yeniRenk + '40');
        document.documentElement.style.setProperty('--necd-primary-light', adjustColor(yeniRenk, 15));
        localStorage.setItem('necd_color', yeniRenk);
    };
}
};
// Pozisyon güvenlik fonksiyonu
function fixPosition(nx, ny, width, height) {
    nx = Math.max(0, Math.min(nx, window.innerWidth - width));
    ny = Math.max(0, Math.min(ny, window.innerHeight - height));
    return { x: nx, y: ny };
}
// Panel minimize/maximize
const togglePanel = (minimize) => {
    isMin = minimize;
    localStorage.setItem('necd_is_minimized', isMin);
    const targetW = isMin ? 54 : 320;
    const targetH = isMin ? 54 : 550;
    let safe = fixPosition(panel.offsetLeft, panel.offsetTop, targetW, targetH);
    panel.style.left = safe.x + 'px';
    panel.style.top = safe.y + 'px';
    if (isMin) {
        panel.classList.add('minimized');
    } else {
        panel.classList.remove('minimized');
    }
};
// Sürükleme
let isDragging = false;
const startDrag = (e) => {
    isDragging = false;
    let ox = e.clientX - panel.offsetLeft, oy = e.clientY - panel.offsetTop;
    const moveHandler = (m) => {
        isDragging = true;
        panel.style.transition = 'none';
        let safe = fixPosition(m.clientX - ox, m.clientY - oy, panel.offsetWidth, panel.offsetHeight);
        panel.style.left = safe.x + 'px';
        panel.style.top = safe.y + 'px';
    };
    const upHandler = () => {
        document.removeEventListener('mousemove', moveHandler);
        document.removeEventListener('mouseup', upHandler);
        panel.style.transition = getAnimCSS();
        localStorage.setItem('necd_pos', JSON.stringify({x: panel.offsetLeft, y: panel.offsetTop}));
    };
    document.addEventListener('mousemove', moveHandler);
    document.addEventListener('mouseup', upHandler);
};
panel.onmousedown = (e) => { if (isMin) startDrag(e); };
panel.onclick = (e) => { if (isMin && !isDragging) togglePanel(false); };
// İndirme fonksiyonu
// ========================================
// 6. MOD LİSTESİNİ ÇEK (GELİŞTİRİLMİŞ)
// ========================================
const extractSlug = () => {
    const match = window.location.pathname.match(/\/collections\/([^\/]+)/);
    if (match && match[1]) {
        return match[1];
    }
    return null;
};

const extractModId = () => {
    const match = window.location.pathname.match(/\/mods\/(\d+)/);
    if (match && match[1]) {
        return match[1];
    }
    return null;
};

const extractGamePage = () => {
    // Oyun sayfası: /skyrimspecialedition/mods, /fallout4/mods, vb.
    // Veya /skyrimspecialedition/mods/categories, /skyrimspecialedition/mods?sort=...
    const match = window.location.pathname.match(/\/([a-z0-9]+)\/mods(?:\/|$)/);
    if (match && match[1]) {
        return match[1];
    }
    return null;
};

const slug = extractSlug();
const modId = extractModId();
const gamePage = extractGamePage();

console.log('[NECD] Page type detection:', { slug, modId, gamePage });
console.log('[NECD] Current pathname:', window.location.pathname);
console.log('[NECD] Current URL:', window.location.href);

// Eğer ilk yüklemede slug bulunamadıysa, URL değişimini dinle
if (!slug && !modId && !gamePage) {
    console.log('[NECD] ⏳ Waiting for page to load...');
    let checkCount = 0;
    const checkPageLoad = setInterval(() => {
        checkCount++;
        const newSlug = extractSlug();
        const newModId = extractModId();
        const newGamePage = extractGamePage();

        if (newSlug || newModId || newGamePage) {
            console.log('[NECD] ✅ Page loaded! New page type:', { newSlug, newModId, newGamePage });
            clearInterval(checkPageLoad);
            location.reload();
        }

        if (checkCount > 40) { // 20 saniye sonra bırak
            console.log('[NECD] ⏱️ Page load timeout');
            clearInterval(checkPageLoad);
        }
    }, 500);
}

// İndirme fonksiyonu
const nextFile = () => {
    if (!isRunning) return;
    const total = modListesi.length;
    const displayCounter = document.getElementById('necd-counter-display');
    const displayStatus = document.getElementById('necd-log-status');
    if(displayCounter) displayCounter.innerText = `${sira} / ${total}`;
    if (sira >= total) {
        if(displayStatus) displayStatus.innerText = lang.msgFinished;
        if (soundActive) finishAudio.play().catch(err => console.warn('[NECD] The sound could not be played:', err));
        isRunning = false;
        isStarted = false;
        return;
    }
    const m = modListesi[sira];
    console.log(`[NECD] 📥 Downloading (${sira + 1}/${total}):`, m.file.name);
    if(displayStatus) {
        displayStatus.innerHTML = `${lang.msgDownloading}<br><b>${m.file.name.substring(0, 22)}...</b>`;
    }
    const url = `https://www.nexusmods.com/${m.file.mod.game.domainName}/mods/${m.file.mod.modId}?tab=files&file_id=${m.fileId}&nmm=1&necd=true&single_mod=false`;
    try {
        GM_openInTab(url, { active: false, insert: true, setParent: true });
    } catch (err) {
        console.error('[NECD] ❌ The tab could not be opened:', err);
    }
    sira++;
    localStorage.setItem('necd_sira', sira);
    const waitTime = parseInt(document.getElementById('necd-wait-input')?.value) || 15;
    const randomDelay = (waitTime * 1000) + (Math.random() * 4000);
    downloadTimer = setTimeout(nextFile, randomDelay);
};
// Cleanup fonksiyonu
window.addEventListener('beforeunload', () => {
    if (downloadTimer) {
        clearTimeout(downloadTimer);
        console.log('[NECD] 🧹 cleaned');
    }
});
// Panel'i DOM'a ekle - body hazır olana kadar bekle
const addPanelToDom = () => {
    if (!document.body) {
        setTimeout(addPanelToDom, 100);
        return;
    }
    document.body.appendChild(panel);
    console.log('[NECD] ✅ Panel added');

    // Panel DOM'a eklendikten sonra attachEvents() çağır
    attachEvents();
};

// Sayfa tipi kontrol et - koleksiyon/mod/oyun sayfasında hemen ekle, anasayfada geciktirilmiş ekle
const isCollectionPage = !!slug;
const isModPage = !!modId;
const isGamePage = !!gamePage && !isCollectionPage && !isModPage;
const isHomePage = !isCollectionPage && !isModPage && !isGamePage;

if (isHomePage) {
    // Anasayfada React render tamamlanana kadar bekle
    setTimeout(addPanelToDom, 2000);
} else {
    // Koleksiyon/mod/oyun sayfalarında hemen ekle
    addPanelToDom();
}

// Collection page, mod page, and game page handling
if (isCollectionPage) {
    // Koleksiyon sayfası
    console.log('[NECD] 🔍 Collection slug:', slug);

    GM.xmlHttpRequest({
    method: "POST",
    url: "https://api-router.nexusmods.com/graphql",
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
    data: JSON.stringify({
        query: 'query($slug:String!){collectionRevision(slug:$slug){modFiles{fileId,file{name,mod{modId,game{domainName}}}}}}',
        variables: { slug: slug }
    }),
    timeout: 20000, // 20 saniye timeout
    onload: (res) => {
        try {
            const json = JSON.parse(res.responseText);
            if (json.errors) {
                console.error('[NECD] ❌ GraphQL error:', json.errors);
                const statusEl = document.getElementById('necd-log-status');
                if (statusEl) statusEl.textContent = lang.errGraphQL;
                return;
            }
            if (!json.data?.collectionRevision?.modFiles) {
                console.error('[NECD] ❌ Mod data not found');
                const statusEl = document.getElementById('necd-log-status');
                if (statusEl) statusEl.textContent = lang.errModData;
                return;
            }
            modListesi = json.data.collectionRevision.modFiles;
            console.log('[NECD] ✅ Mod list retrieved:', modListesi.length, 'mod');
            // Mod listesi alındıktan sonra UI'ı güncelle
            renderUI(false);
        } catch(e) {
            console.error('[NECD] ❌ JSON parse error:', e);
            const statusEl = document.getElementById('necd-log-status');
            if (statusEl) statusEl.textContent = lang.errParse;
        }
    },
    onerror: (err) => {
        console.error('[NECD] ❌ API request error:', err);
        const statusEl = document.getElementById('necd-log-status');
        if (statusEl) statusEl.textContent = lang.errAPI;
    },
    ontimeout: () => {
        console.error('[NECD] ❌ API timeout (10s)');
        renderUI(false);
        const statusEl = document.getElementById('necd-log-status');
        if (statusEl) statusEl.textContent = lang.errTimeout;
    }
});

    // Panel DOM'a eklendikten sonra ilk renderUI çağrısını yap
    const checkPanelAndRender = () => {
        if (document.getElementById('necd-panel')) {
            renderUI(false);
        } else {
            setTimeout(checkPanelAndRender, 100);
        }
    };
    checkPanelAndRender();
} else if (isModPage) {
    // Tekil mod sayfası
    console.log('[NECD] 📄 Mod page detected');

    // Harici NECD Download butonu ekle - Çoklu dosya desteği
    const addExternalDownloadButton = () => {
        // Tüm dosyaları bul - file-container-main-files içindeki tüm dt (file headers)
        const fileContainer = document.getElementById('file-container-main-files');
        if (!fileContainer) {
            console.log('[NECD] ⚠️ File container not found');
            return;
        }

        const fileHeaders = fileContainer.querySelectorAll('dt.file-expander-header');
        if (fileHeaders.length === 0) {
            console.log('[NECD] ⚠️ No file headers found');
            return;
        }

        console.log(`[NECD] 📁 Found ${fileHeaders.length} file(s) in container`);

        // Her dosya için buton oluştur
        fileHeaders.forEach((header, index) => {
            const fileId = header.getAttribute('data-id');
            const fileName = header.getAttribute('data-name');

            if (!fileId) {
                console.log(`[NECD] ⚠️ File ${index} has no data-id`);
                return;
            }

            // Zaten buton varsa skip
            const existingBtn = header.querySelector(`[data-necd-file-id="${fileId}"]`);
            if (existingBtn) {
                console.log(`[NECD] ℹ️ Button already exists for file ${fileId}`);
                return;
            }

            // Buton oluştur
            const newBtn = document.createElement('button');
            newBtn.setAttribute('data-necd-file-id', fileId);
            newBtn.textContent = '⚡ NECD';
            newBtn.type = 'button';
            newBtn.style.cssText = `
                display: inline-block !important;
                background: linear-gradient(135deg, #00d084 0%, #00a86b 100%) !important;
                color: white !important;
                border: none !important;
                padding: 6px 12px !important;
                border-radius: 4px !important;
                cursor: pointer !important;
                font-weight: 600 !important;
                font-size: 12px !important;
                box-shadow: 0 2px 8px rgba(0, 212, 132, 0.3) !important;
                transition: all 0.2s !important;
                text-decoration: none !important;
                text-align: center !important;
                z-index: 10000 !important;
                font-family: inherit !important;
                margin-left: 8px !important;
                white-space: nowrap !important;
            `;

            newBtn.onmouseover = () => {
                newBtn.style.transform = 'translateY(-2px) !important';
                newBtn.style.boxShadow = '0 4px 12px rgba(0, 212, 132, 0.4) !important';
            };
            newBtn.onmouseout = () => {
                newBtn.style.transform = 'translateY(0) !important';
                newBtn.style.boxShadow = '0 2px 8px rgba(0, 212, 132, 0.3) !important';
            };

            newBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();

                console.log(`[NECD] 🎯 Single mod download triggered for file ${fileId} (${fileName})`);

                // localStorage'ı sıfırla
                localStorage.setItem('necd_sira', '0');

                // İndirme sayfasına yönlendir (single_mod flag ile)
                const baseUrl = window.location.href.split('?')[0];
                const url = `${baseUrl}?tab=files&file_id=${fileId}&nmm=1&necd=true&single_mod=true`;
                window.location.href = url;
            };

            // Buton yerleştirme - file-download-stats div'inin yanına ekle (inline)
            const statsDiv = header.querySelector('.file-download-stats');
            if (statsDiv) {
                // Stats div'inin sonuna ekle (sağ tarafta)
                statsDiv.appendChild(newBtn);
                console.log(`[NECD] ✅ Button placed inline with stats for file ${fileId}`);
            } else {
                // Fallback: header'ın sonuna ekle
                header.appendChild(newBtn);
                console.log(`[NECD] ✅ Button placed in header for file ${fileId} (fallback)`);
            }
        });

        console.log(`[NECD] ✅ All buttons created and placed`);
    };

    // DOM hazır olana kadar bekle
    let attempts = 0;
    const waitForButton = () => {
        attempts++;
        addExternalDownloadButton();

        // Kontrol: file-container-main-files'da buton var mı?
        const fileContainer = document.getElementById('file-container-main-files');
        const hasButtons = fileContainer && fileContainer.querySelector('[data-necd-file-id]');

        if (!hasButtons && attempts < 120) {
            setTimeout(waitForButton, 500); // 60 saniyeye kadar bekle
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(waitForButton, 500);
        });
    } else {
        setTimeout(waitForButton, 500);
    }

    // Dinamik yükleme için observer - files tab açıldığında buton ekle
    const observer = new MutationObserver(() => {
        const fileContainer = document.getElementById('file-container-main-files');
        if (fileContainer) {
            // Kontrol: tüm file headers'ın buton var mı?
            const fileHeaders = fileContainer.querySelectorAll('dt.file-expander-header');
            const buttonsCount = fileContainer.querySelectorAll('[data-necd-file-id]').length;

            // Eğer dosya sayısı buton sayısından fazlaysa, yeni butonlar ekle
            if (fileHeaders.length > buttonsCount) {
                addExternalDownloadButton();
            }
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    renderUI(true);
} else if (isGamePage) {
    // Oyun sayfası
    console.log('[NECD] 🎮 Game page detected:', gamePage);
    renderUI(true);
} else {
    // Anasayfa veya diğer sayfalar
    console.log('[NECD] ℹ️ Home or other page');
    renderUI(true);
}
})();