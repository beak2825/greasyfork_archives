// ==UserScript==
// @name         FileGuard & Gofile Auto Downloader (Multi-Language)
// @name:tr      FileGuard & Gofile Otomatik İndirici (Çok Dilli)
// @name:es      Descargador Automático FileGuard & Gofile (Multi-Idioma)
// @name:fr      Téléchargeur Automatique FileGuard & Gofile (Multi-Langue)
// @name:de      FileGuard & Gofile Auto-Downloader (Mehrsprachig)
// @name:it      Downloader Automatico FileGuard & Gofile (Multi-Lingua)
// @name:pt      Downloader Automático FileGuard & Gofile (Multi-Idioma)
// @name:ru      Автозагрузчик FileGuard & Gofile (Многоязычный)
// @name:zh      FileGuard & Gofile 自动下载器（多语言）
// @name:ja      FileGuard & Gofile 自動ダウンローダー（多言語）
// @name:ar      منزل تلقائي FileGuard & Gofile (متعدد اللغات)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Automatically finds gofile links on fileguard.cc pages, opens selected links and starts automatic download on gofile.io. Supports 11 languages with automatic detection.
// @description:tr  fileguard.cc sayfalarında gofile linklerini otomatik bulur, seçilen linkleri açar ve gofile.io'da otomatik indirme başlatır. 11 dil desteği ile otomatik dil algılama.
// @description:es  Encuentra automáticamente enlaces de gofile en páginas de fileguard.cc, abre enlaces seleccionados e inicia descarga automática en gofile.io. Soporta 11 idiomas con detección automática.
// @description:fr  Trouve automatiquement les liens gofile sur les pages fileguard.cc, ouvre les liens sélectionnés et démarre le téléchargement automatique sur gofile.io. Prend en charge 11 langues avec détection automatique.
// @description:de  Findet automatisch Gofile-Links auf fileguard.cc-Seiten, öffnet ausgewählte Links und startet automatischen Download auf gofile.io. Unterstützt 11 Sprachen mit automatischer Erkennung.
// @description:it  Trova automaticamente i link gofile nelle pagine fileguard.cc, apre i link selezionati e avvia il download automatico su gofile.io. Supporta 11 lingue con rilevamento automatico.
// @description:pt  Encontra automaticamente links do gofile em páginas fileguard.cc, abre links selecionados e inicia download automático no gofile.io. Suporta 11 idiomas com detecção automática.
// @description:ru  Автоматически находит ссылки gofile на страницах fileguard.cc, открывает выбранные ссылки и запускает автоматическую загрузку на gofile.io. Поддерживает 11 языков с автоматическим определением.
// @description:zh  自动在 fileguard.cc 页面查找 gofile 链接，打开选定链接并在 gofile.io 启动自动下载。支持 11 种语言的自动检测。
// @description:ja  fileguard.ccページでgofileリンクを自動検出し、選択したリンクを開いてgofile.ioで自動ダウンロードを開始します。11言語の自動検出をサポート。
// @description:ar  يجد تلقائياً روابط gofile في صفحات fileguard.cc، يفتح الروابط المختارة ويبدأ التحميل التلقائي في gofile.io. يدعم 11 لغة مع الكشف التلقائي.
// @author       xmtaha
// @match        https://fileguard.cc/*
// @match        https://gofile.io/*
// @grant        GM_openInTab
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551709/FileGuard%20%20Gofile%20Auto%20Downloader%20%28Multi-Language%29.user.js
// @updateURL https://update.greasyfork.org/scripts/551709/FileGuard%20%20Gofile%20Auto%20Downloader%20%28Multi-Language%29.meta.js
// ==/UserScript==


(function() {
    'use strict';
    const translations = {
        en: {
            title: 'Auto Download Assistant',
            selectAll: 'SELECT ALL',
            removeAll: 'REMOVE ALL',
            downloadSelected: 'DOWNLOAD SELECTED',
            pleaseSelect: 'Please select files to download first!',
            openingSequentially: 'Opening sequentially...'
        },
        tr: {
            title: 'Otomatik İndirme Yardımcısı',
            selectAll: 'TÜMÜNÜ SEÇ',
            removeAll: 'TÜMÜNÜ KALDIR',
            downloadSelected: 'SEÇİLENLERİ İNDİR',
            pleaseSelect: 'Lütfen önce indirilecek dosyaları seçin!',
            openingSequentially: 'Sırayla açılıyor...'
        },
        es: {
            title: 'Asistente de Descarga Automática',
            selectAll: 'SELECCIONAR TODO',
            removeAll: 'QUITAR TODO',
            downloadSelected: 'DESCARGAR SELECCIONADOS',
            pleaseSelect: '¡Por favor, selecciona los archivos a descargar primero!',
            openingSequentially: 'Abriendo secuencialmente...'
        },
        fr: {
            title: 'Assistant de Téléchargement Automatique',
            selectAll: 'TOUT SÉLECTIONNER',
            removeAll: 'TOUT SUPPRIMER',
            downloadSelected: 'TÉLÉCHARGER SÉLECTIONNÉS',
            pleaseSelect: 'Veuillez d\'abord sélectionner les fichiers à télécharger!',
            openingSequentially: 'Ouverture séquentielle...'
        },
        de: {
            title: 'Auto-Download-Assistent',
            selectAll: 'ALLE AUSWÄHLEN',
            removeAll: 'ALLE ENTFERNEN',
            downloadSelected: 'AUSGEWÄHLTE HERUNTERLADEN',
            pleaseSelect: 'Bitte wählen Sie zuerst die herunterzuladenden Dateien aus!',
            openingSequentially: 'Sequenziell öffnen...'
        },
        it: {
            title: 'Assistente Download Automatico',
            selectAll: 'SELEZIONA TUTTO',
            removeAll: 'RIMUOVI TUTTO',
            downloadSelected: 'SCARICA SELEZIONATI',
            pleaseSelect: 'Per favore seleziona prima i file da scaricare!',
            openingSequentially: 'Apertura sequenziale...'
        },
        pt: {
            title: 'Assistente de Download Automático',
            selectAll: 'SELECIONAR TUDO',
            removeAll: 'REMOVER TUDO',
            downloadSelected: 'BAIXAR SELECIONADOS',
            pleaseSelect: 'Por favor, selecione os arquivos para baixar primeiro!',
            openingSequentially: 'Abrindo sequencialmente...'
        },
        ru: {
            title: 'Помощник Автозагрузки',
            selectAll: 'ВЫБРАТЬ ВСЕ',
            removeAll: 'УБРАТЬ ВСЕ',
            downloadSelected: 'СКАЧАТЬ ВЫБРАННЫЕ',
            pleaseSelect: 'Пожалуйста, сначала выберите файлы для скачивания!',
            openingSequentially: 'Открытие по очереди...'
        },
        zh: {
            title: '自动下载助手',
            selectAll: '全选',
            removeAll: '全部移除',
            downloadSelected: '下载选中项',
            pleaseSelect: '请先选择要下载的文件！',
            openingSequentially: '依次打开中...'
        },
        ja: {
            title: '自動ダウンロードアシスタント',
            selectAll: 'すべて選択',
            removeAll: 'すべて削除',
            downloadSelected: '選択項目をダウンロード',
            pleaseSelect: 'まずダウンロードするファイルを選択してください！',
            openingSequentially: '順次開いています...'
        },
        ar: {
            title: 'مساعد التحميل التلقائي',
            selectAll: 'تحديد الكل',
            removeAll: 'إزالة الكل',
            downloadSelected: 'تحميل المحدد',
            pleaseSelect: 'يرجى تحديد الملفات للتحميل أولاً!',
            openingSequentially: 'فتح متسلسل...'
        }
    };
    let currentLang = (function() {
        const browserLang = navigator.language || navigator.userLanguage;
        const langCode = browserLang.split('-')[0].toLowerCase();
        return translations[langCode] ? langCode : 'en';
    })();
    let t = translations[currentLang];
    if (window.location.hostname.includes('fileguard.cc')) {
        function findGofileLinks() {
            const links = Array.from(document.querySelectorAll('a[href*="gofile.io"]'));
            return links.map(link => link.href);
        }
        function showLinks(links) {
            if (links.length === 0) return;
            if (document.getElementById('auto-downloader-container')) return;
            const container = document.createElement('div');
            container.id = 'auto-downloader-container';
            container.style.position = 'fixed';
            container.style.top = '40px';
            container.style.right = '40px';
            container.style.background = 'linear-gradient(135deg, #e0e7ff 0%, #f0e7ff 100%)';
            container.style.border = '1.5px solid #b7aaff';
            container.style.borderRadius = '20px';
            container.style.padding = '0 0 28px 0';
            container.style.zIndex = 9999;
            container.style.maxWidth = '430px';
            container.style.boxShadow = '0 10px 36px 0 rgba(80, 60, 180, 0.18), 0 2px 8px 0 rgba(80,60,180,0.10)';
            container.style.fontFamily = 'Segoe UI, Arial, sans-serif';

            // Header bar
            const header = document.createElement('div');
            header.style.display = 'flex';
            header.style.alignItems = 'center';
            header.style.justifyContent = 'space-between';
            header.style.background = 'linear-gradient(90deg, #7f6fff 60%, #5ad1ff 100%)';
            header.style.borderTopLeftRadius = '20px';
            header.style.borderTopRightRadius = '20px';
            header.style.padding = '20px 28px 16px 28px';
            header.style.boxShadow = '0 3px 12px rgba(127,111,255,0.10)';

            // Title
            const title = document.createElement('div');
            title.textContent = t.title;
            title.style.fontWeight = 'bold';
            title.style.fontSize = '23px';
            title.style.color = '#fff';
            title.style.letterSpacing = '0.5px';
            title.style.textShadow = '0 2px 8px #7f6fff33';
            header.appendChild(title);

            // Language selector
            const langSelect = document.createElement('select');
            langSelect.style.fontSize = '15px';
            langSelect.style.padding = '5px 12px';
            langSelect.style.borderRadius = '7px';
            langSelect.style.border = '1.5px solid #b7aaff';
            langSelect.style.background = 'linear-gradient(90deg, #fff 60%, #e0e7ff 100%)';
            langSelect.style.color = '#5a3d99';
            langSelect.style.fontWeight = 'bold';
            langSelect.style.boxShadow = '0 1.5px 6px rgba(127,111,255,0.10)';
            langSelect.style.cursor = 'pointer';
            for (const code in translations) {
                const option = document.createElement('option');
                option.value = code;
                option.textContent = code.toUpperCase();
                if (code === currentLang) option.selected = true;
                langSelect.appendChild(option);
            }
            langSelect.onchange = function() {
                currentLang = langSelect.value;
                t = translations[currentLang];
                document.getElementById('auto-downloader-container').remove();
                showLinks(links);
            };
            header.appendChild(langSelect);
            container.appendChild(header);

            // Content area
            const content = document.createElement('div');
            content.style.padding = '22px 28px 0 28px';

            const list = document.createElement('div');
            list.style.marginBottom = '22px';
            const checkboxes = [];
            links.forEach((link, idx) => {
                const row = document.createElement('div');
                row.style.marginBottom = '10px';
                row.style.display = 'flex';
                row.style.alignItems = 'center';
                row.style.gap = '10px';
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = 'gofile_link_' + idx;
                checkbox.value = link;
                checkboxes.push(checkbox);
                const label = document.createElement('label');
                label.htmlFor = checkbox.id;
                let fileName = link.split('/').pop() || link;
                label.textContent = decodeURIComponent(fileName);
                label.style.marginLeft = '2px';
                label.style.fontSize = '16px';
                label.style.color = '#4b3a7a';
                label.style.fontWeight = '500';
                row.appendChild(checkbox);
                row.appendChild(label);
                list.appendChild(row);
            });
            content.appendChild(list);

            // Button group
            const btnGroup = document.createElement('div');
            btnGroup.style.display = 'flex';
            btnGroup.style.gap = '16px';
            btnGroup.style.marginBottom = '0';

            const btnSelectAll = document.createElement('button');
            btnSelectAll.textContent = t.selectAll;
            btnSelectAll.style.background = 'linear-gradient(90deg, #a18fff 60%, #5ad1ff 100%)';
            btnSelectAll.style.color = '#fff';
            btnSelectAll.style.border = 'none';
            btnSelectAll.style.padding = '12px 22px';
            btnSelectAll.style.borderRadius = '8px';
            btnSelectAll.style.fontWeight = 'bold';
            btnSelectAll.style.fontSize = '16px';
            btnSelectAll.style.cursor = 'pointer';
            btnSelectAll.style.transition = 'background 0.2s, box-shadow 0.2s';
            btnSelectAll.onmouseover = () => btnSelectAll.style.boxShadow = '0 2px 12px #a18fff55';
            btnSelectAll.onmouseout = () => btnSelectAll.style.boxShadow = '';
            let allSelected = false;
            btnSelectAll.onclick = () => {
                allSelected = !allSelected;
                checkboxes.forEach(cb => cb.checked = allSelected);
                btnSelectAll.textContent = allSelected ? t.removeAll : t.selectAll;
            };

            const btnDownload = document.createElement('button');
            btnDownload.textContent = t.downloadSelected;
            btnDownload.style.background = 'linear-gradient(90deg, #5ad1ff 60%, #a18fff 100%)';
            btnDownload.style.color = '#fff';
            btnDownload.style.border = 'none';
            btnDownload.style.padding = '12px 22px';
            btnDownload.style.borderRadius = '8px';
            btnDownload.style.fontWeight = 'bold';
            btnDownload.style.fontSize = '16px';
            btnDownload.style.cursor = 'pointer';
            btnDownload.style.transition = 'background 0.2s, box-shadow 0.2s';
            btnDownload.onmouseover = () => btnDownload.style.boxShadow = '0 2px 12px #5ad1ff55';
            btnDownload.onmouseout = () => btnDownload.style.boxShadow = '';
            btnDownload.onclick = async () => {
                const checked = checkboxes.filter(cb => cb.checked);
                if (checked.length === 0) {
                    showMessage(t.pleaseSelect);
                    return;
                }
                btnDownload.disabled = true;
                btnDownload.textContent = t.openingSequentially;
                for (const cb of checked) {
                    GM_openInTab(cb.value, {active: true, insert: true, setParent: true});
                    await new Promise(res => setTimeout(res, 1000));
                }
                btnDownload.disabled = false;
                btnDownload.textContent = t.downloadSelected;
            };

            btnGroup.appendChild(btnSelectAll);
            btnGroup.appendChild(btnDownload);
            content.appendChild(btnGroup);
            container.appendChild(content);
            document.body.appendChild(container);
            function showMessage(msg) {
                const messageBox = document.createElement('div');
                messageBox.style.cssText = `
                    position: fixed;
                    top: 20px;
                    left: 50%;
                    background-color: #ffc107;
                    color: #333;
                    padding: 15px 30px;
                    border-radius: 8px;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                    z-index: 9999;
                    font-family: sans-serif;
                    opacity: 0;
                    transition: opacity 0.5s ease-in-out;
                `;
                messageBox.innerText = msg;
                document.body.appendChild(messageBox);
                setTimeout(() => { messageBox.style.opacity = '1'; }, 10);
                setTimeout(() => {
                    messageBox.style.opacity = '0';
                    messageBox.addEventListener('transitionend', () => {
                        messageBox.remove();
                    });
                }, 3000);
            }
        }
        showLinks(findGofileLinks());
    } else if (window.location.hostname.includes('gofile.io')) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const buttons = document.querySelectorAll('button');
                for (let btn of buttons) {
                    const btnText = btn.textContent.toLowerCase();
                    const downloadKeywords = ['download', 'télécharger', 'descargar', 'herunterladen', 
                        'scaricare', 'baixar', 'скачать', '下载', 'ダウンロード', 'تحميل', 'indir'];
                    if (downloadKeywords.some(keyword => btnText.includes(keyword.toLowerCase()))) {
                        btn.click();
                        setTimeout(() => window.close(), 1500);
                        break;
                    }
                }
            }, 2000);
        });
    }
})();

