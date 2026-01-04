// ==UserScript==
// @name         FitGirl Automatic Download Assistant
// @name:es      Asistente de Descarga Automática FitGirl
// @name:zh      FitGirl 自动下载助手
// @name:fr      Assistant de Téléchargement Automatique FitGirl
// @name:de      FitGirl Automatischer Download-Assistent
// @name:ja      FitGirl 自動ダウンロードアシスタント
// @name:pt      Assistente de Download Automático FitGirl
// @name:ru      Автоматический Помощник Загрузки FitGirl
// @name:ko      FitGirl 자동 다운로드 도우미
// @name:it      Assistente di Download Automatico FitGirl
// @name:tr      FitGirl Otomatik İndirme Yardımcısı
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Automatically handles fuckingfast.co download links on FitGirl pages with multi-language support
// @description:es  Maneja automáticamente los enlaces de descarga de fuckingfast.co en páginas de FitGirl con soporte multiidioma
// @description:zh  自动处理 FitGirl 页面上的 fuckingfast.co 下载链接，支持多语言
// @description:fr  Gère automatiquement les liens de téléchargement fuckingfast.co sur les pages FitGirl avec support multilingue
// @description:de  Verwaltet automatisch fuckingfast.co Download-Links auf FitGirl-Seiten mit mehrsprachiger Unterstützung
// @description:ja  多言語サポート付きでFitGirlページのfuckingfast.coダウンロードリンクを自動処理
// @description:pt  Gerencia automaticamente links de download fuckingfast.co em páginas FitGirl com suporte multilíngue
// @description:ru  Автоматически обрабатывает ссылки для загрузки fuckingfast.co на страницах FitGirl с многоязычной поддержкой
// @description:ko  다국어 지원으로 FitGirl 페이지의 fuckingfast.co 다운로드 링크를 자동 처리
// @description:it  Gestisce automaticamente i link di download fuckingfast.co sulle pagine FitGirl con supporto multilingue
// @description:tr  FitGirl sayfalarında fuckingfast.co indirme bağlantılarını çoklu dil desteğiyle otomatik yönetir
// @author       xmtaha
// @match        https://fitgirl-repacks.site/*
// @match        https://fuckingfast.co/*
// @grant        GM_openInTab
// @grant        window.close
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551711/FitGirl%20Automatic%20Download%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/551711/FitGirl%20Automatic%20Download%20Assistant.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const translations = {
        'en': {
            'autoDownloader': 'Automatic Download Assistant',
            'selectAll': 'Select All',
            'deselectAll': 'Deselect All',
            'downloadSelected': 'Download Selected',
            'opening': 'Opening sequentially...',
            'selectFirst': 'Please select files to download first!',
            'part': 'Part'
        },
        'es': {
            'autoDownloader': 'Asistente de Descarga Automática',
            'selectAll': 'Seleccionar Todo',
            'deselectAll': 'Deseleccionar Todo',
            'downloadSelected': 'Descargar Seleccionados',
            'opening': 'Abriendo secuencialmente...',
            'selectFirst': '¡Por favor selecciona archivos para descargar primero!',
            'part': 'Parte'
        },
        'zh': {
            'autoDownloader': '自动下载助手',
            'selectAll': '全选',
            'deselectAll': '取消全选',
            'downloadSelected': '下载选中项',
            'opening': '正在依次打开...',
            'selectFirst': '请先选择要下载的文件！',
            'part': '部分'
        },
        'fr': {
            'autoDownloader': 'Assistant de Téléchargement Automatique',
            'selectAll': 'Tout Sélectionner',
            'deselectAll': 'Tout Désélectionner',
            'downloadSelected': 'Télécharger Sélectionnés',
            'opening': 'Ouverture séquentielle...',
            'selectFirst': 'Veuillez d\'abord sélectionner les fichiers à télécharger !',
            'part': 'Partie'
        },
        'de': {
            'autoDownloader': 'Automatischer Download-Assistent',
            'selectAll': 'Alle Auswählen',
            'deselectAll': 'Alle Abwählen',
            'downloadSelected': 'Ausgewählte Herunterladen',
            'opening': 'Sequenzielles Öffnen...',
            'selectFirst': 'Bitte wählen Sie zuerst Dateien zum Herunterladen aus!',
            'part': 'Teil'
        },
        'ja': {
            'autoDownloader': '自動ダウンロードアシスタント',
            'selectAll': 'すべて選択',
            'deselectAll': 'すべて選択解除',
            'downloadSelected': '選択項目をダウンロード',
            'opening': '順次開いています...',
            'selectFirst': '最初にダウンロードするファイルを選択してください！',
            'part': 'パート'
        },
        'pt': {
            'autoDownloader': 'Assistente de Download Automático',
            'selectAll': 'Selecionar Tudo',
            'deselectAll': 'Desselecionar Tudo',
            'downloadSelected': 'Baixar Selecionados',
            'opening': 'Abrindo sequencialmente...',
            'selectFirst': 'Por favor, selecione os arquivos para baixar primeiro!',
            'part': 'Parte'
        },
        'ru': {
            'autoDownloader': 'Автоматический Помощник Загрузки',
            'selectAll': 'Выбрать Все',
            'deselectAll': 'Отменить Все',
            'downloadSelected': 'Скачать Выбранные',
            'opening': 'Открытие по порядку...',
            'selectFirst': 'Сначала выберите файлы для загрузки!',
            'part': 'Часть'
        },
        'ko': {
            'autoDownloader': '자동 다운로드 도우미',
            'selectAll': '모두 선택',
            'deselectAll': '모두 선택 해제',
            'downloadSelected': '선택된 항목 다운로드',
            'opening': '순차적으로 여는 중...',
            'selectFirst': '먼저 다운로드할 파일을 선택하세요!',
            'part': '부분'
        },
        'it': {
            'autoDownloader': 'Assistente di Download Automatico',
            'selectAll': 'Seleziona Tutto',
            'deselectAll': 'Deseleziona Tutto',
            'downloadSelected': 'Scarica Selezionati',
            'opening': 'Apertura sequenziale...',
            'selectFirst': 'Per favore seleziona prima i file da scaricare!',
            'part': 'Parte'
        }
    };

    function detectLanguage() {
        const browserLang = navigator.language || navigator.userLanguage;
        const langCode = browserLang.split('-')[0];
        return translations[langCode] || translations['en'];
    }

    const t = detectLanguage();

    if (window.location.hostname.includes('fitgirl-repacks.site')) {
        const currentPath = window.location.pathname;
        const isMainPage = currentPath === '/' || currentPath === '' || 
                          currentPath === '/index.html' || 
                          currentPath.match(/^\/page\/\d+\/?$/);
        
        if (isMainPage) {
            return;
        }

        const checkInterval = setInterval(() => {
            const links = document.querySelectorAll('a[href*="fuckingfast.co/"]');
            const entryContent = document.querySelector('.entry-content');

            if (links.length > 0 && entryContent) {
                clearInterval(checkInterval);

                if (document.getElementById('auto-downloader-container')) {
                    return;
                }

                const linkContainer = document.createElement('div');
                linkContainer.id = 'auto-downloader-container';
                linkContainer.style.marginTop = '20px';
                linkContainer.style.marginBottom = '20px';
                linkContainer.style.border = '2px solid #4CAF50';
                linkContainer.style.borderRadius = '5px';
                linkContainer.style.padding = '15px';
                linkContainer.style.backgroundColor = '#f0fff0';

                const title = document.createElement('h3');
                title.innerText = t.autoDownloader;
                title.style.marginTop = '0';
                linkContainer.appendChild(title);

                const listContainer = document.createElement('div');
                listContainer.style.display = 'flex';
                listContainer.style.flexDirection = 'column';
                listContainer.style.gap = '10px';

                links.forEach((link, index) => {
                    const originalUrl = link.href;
                    const fileName = originalUrl.split('#')[1] || `${t.part} ${index + 1}`;
                    const fileLabel = fileName.replace(/_/g, ' ');

                    const listItem = document.createElement('div');
                    listItem.style.display = 'flex';
                    listItem.style.alignItems = 'center';
                    listItem.style.gap = '8px';

                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.id = `download-item-${index}`;
                    checkbox.value = originalUrl;
                    checkbox.style.cursor = 'pointer';

                    const label = document.createElement('label');
                    label.htmlFor = `download-item-${index}`;
                    label.innerText = fileLabel;
                    label.style.cursor = 'pointer';

                    listItem.appendChild(checkbox);
                    listItem.appendChild(label);
                    listContainer.appendChild(listItem);
                });

                linkContainer.appendChild(listContainer);

                const selectAllButton = document.createElement('button');
                selectAllButton.innerText = t.selectAll;
                selectAllButton.style.marginTop = '10px';
                selectAllButton.style.padding = '8px 16px';
                selectAllButton.style.cursor = 'pointer';
                selectAllButton.style.border = '1px solid #2196F3';
                selectAllButton.style.borderRadius = '5px';
                selectAllButton.style.backgroundColor = '#2196F3';
                selectAllButton.style.color = 'white';
                selectAllButton.style.marginRight = '10px';

                selectAllButton.onmouseover = () => selectAllButton.style.backgroundColor = '#1976D2';
                selectAllButton.onmouseout = () => selectAllButton.style.backgroundColor = '#2196F3';

                let allSelected = false;
                selectAllButton.onclick = () => {
                    const checkboxes = document.querySelectorAll('#auto-downloader-container input[type="checkbox"]');
                    allSelected = !allSelected;
                    
                    checkboxes.forEach(checkbox => {
                        checkbox.checked = allSelected;
                    });
                    
                    selectAllButton.innerText = allSelected ? t.deselectAll : t.selectAll;
                };

                linkContainer.appendChild(selectAllButton);

                const downloadAllButton = document.createElement('button');
                downloadAllButton.innerText = t.downloadSelected;
                downloadAllButton.style.marginTop = '15px';
                downloadAllButton.style.padding = '10px 20px';
                downloadAllButton.style.cursor = 'pointer';
                downloadAllButton.style.border = '1px solid #4CAF50';
                downloadAllButton.style.borderRadius = '5px';
                downloadAllButton.style.backgroundColor = '#4CAF50';
                downloadAllButton.style.color = 'white';

                downloadAllButton.onmouseover = () => downloadAllButton.style.backgroundColor = '#45a049';
                downloadAllButton.onmouseout = () => downloadAllButton.style.backgroundColor = '#4CAF50';

                downloadAllButton.onclick = async () => {
                    const checkedItems = document.querySelectorAll('input[type="checkbox"]:checked');
                    if (checkedItems.length === 0) {
                        showMessage(t.selectFirst);
                        return;
                    }

                    downloadAllButton.disabled = true;
                    downloadAllButton.innerText = t.opening;

                    for (const item of checkedItems) {
                        const url = item.value;
                        await new Promise(resolve => {
                            GM_openInTab(url, { active: true });
                            setTimeout(resolve, 1000);
                        });
                    }

                    downloadAllButton.disabled = false;
                    downloadAllButton.innerText = t.downloadSelected;
                };

                linkContainer.appendChild(downloadAllButton);
                entryContent.prepend(linkContainer);

                function showMessage(msg) {
                    const messageBox = document.createElement('div');
                    messageBox.style.cssText = `
                        position: fixed;
                        top: 20px;
                        left: 50%;
                        transform: translateX(-50%);
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

                    setTimeout(() => {
                        messageBox.style.opacity = '1';
                    }, 10);

                    setTimeout(() => {
                        messageBox.style.opacity = '0';
                        messageBox.addEventListener('transitionend', () => {
                            messageBox.remove();
                        });
                    }, 3000);
                }

            }
        }, 1000);
    }

    if (window.location.hostname.includes('fuckingfast.co')) {
        const interval = setInterval(() => {
            const downloadButton = document.querySelector('button.link-button.text-5xl.gay-button');
            if (downloadButton) {
                clearInterval(interval);
                downloadButton.click();

                setTimeout(() => {
                    window.close();
                }, 3000);
            }
        }, 1000);
    }
})();