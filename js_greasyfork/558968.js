// ==UserScript==
// @name         📷💨Steam universal image gallery🖼️
// @name:zh-CN   📷💨Steam 通用图片库🖼️
// @name:ja      📷💨Steam 汎用画像ギャラリー🖼️
// @name:ru      📷💨Универсальная галерея изображений Steam🖼️
// @name:es      📷💨Galería Universal de Imágenes de Steam🖼️
// @name:pt-PT   📷💨Galeria Universal de Imagens da Steam🖼️
// @namespace    https://violentmonkey.github.io/
// @version      9.2
// @description  🖼️ Scans any Steam page for images and shows them in a live, organized gallery 📂 for easy preview 👀 and download 📥
// @description:zh-CN  🖼️ 扫描任何 Steam 页面中的图片，并在实时、有组织的图库中显示，便于预览和下载。
// @description:ja     🖼️ 任意のSteamページから画像を抽出し、リアルタイムで整理されたギャラリーに表示します。簡単にプレビュー＆ダウンロード可能です。
// @description:ru     🖼️ Находит изображения на любой странице Steam и отображает их в организованной галерее в реальном времени для удобного просмотра и скачивания.
// @description:es     🖼️ Escanea cualquier página de Steam en busca de imágenes y las muestra en una galería organizada y en tiempo real para una fácil vista previa y descarga.
// @description:pt-PT  🖼️ Procura imagens em qualquer página da Steam e exibe-as numa galeria organizada e em tempo real para fácil visualização e download.
// @author       Okagame
// @icon         https://cdn-icons-png.flaticon.com/512/18961/18961809.png
// @license      MIT
// @match        https://store.steampowered.com/*
// @match        https://steamcommunity.com/*
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/558968/%F0%9F%93%B7%F0%9F%92%A8Steam%20universal%20image%20gallery%F0%9F%96%BC%EF%B8%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/558968/%F0%9F%93%B7%F0%9F%92%A8Steam%20universal%20image%20gallery%F0%9F%96%BC%EF%B8%8F.meta.js
// ==/UserScript==


(function () {
    'use strict';

    const foundImages = new Set();
    let gallery = null;
    let modal = null;
    let isObserving = false;
    let currentLang = 'en';

    // Translations
    const translations = {
        en: {
            title: 'Image Gallery',
            imagesFound: 'images found',
            downloadAll: 'Download All',
            close: 'Close',
            downloading: 'Downloading',
            categories: {
                'Game Assets': 'Game Assets',
                'Screenshots': 'Screenshots',
                'Promotional': 'Promotional',
                'Backgrounds': 'Backgrounds',
                'Community': 'Community',
                'UI/Icons': 'UI/Icons',
                'Other': 'Other'
            }
        },
        'zh-CN': {
            title: '图片库',
            imagesFound: '张图片',
            downloadAll: '下载全部',
            close: '关闭',
            downloading: '正在下载',
            categories: {
                'Game Assets': '游戏素材',
                'Screenshots': '游戏截图',
                'Promotional': '宣传素材',
                'Backgrounds': '页面背景',
                'Community': '社区内容',
                'UI/Icons': '界面图标',
                'Other': '其他'
            }
        },
        ja: {
            title: '画像ギャラリー',
            imagesFound: '枚の画像',
            downloadAll: 'すべてダウンロード',
            close: '閉じる',
            downloading: 'ダウンロード中',
            categories: {
                'Game Assets': 'ゲーム素材',
                'Screenshots': 'スクリーンショット',
                'Promotional': 'プロモーション',
                'Backgrounds': '背景',
                'Community': 'コミュニティ',
                'UI/Icons': 'UI/アイコン',
                'Other': 'その他'
            }
        },
        ru: {
            title: 'Галерея изображений',
            imagesFound: 'изображений',
            downloadAll: 'Скачать все',
            close: 'Закрыть',
            downloading: 'Скачивание',
            categories: {
                'Game Assets': 'Игровые ассеты',
                'Screenshots': 'Скриншоты',
                'Promotional': 'Промо-материалы',
                'Backgrounds': 'Фоны',
                'Community': 'Сообщество',
                'UI/Icons': 'UI/Иконки',
                'Other': 'Другое'
            }
        },
        es: {
            title: 'Galería de imágenes',
            imagesFound: 'imágenes',
            downloadAll: 'Descargar todo',
            close: 'Cerrar',
            downloading: 'Descargando',
            categories: {
                'Game Assets': 'Recursos del juego',
                'Screenshots': 'Capturas de pantalla',
                'Promotional': 'Material promocional',
                'Backgrounds': 'Fondos',
                'Community': 'Comunidad',
                'UI/Icons': 'UI/Iconos',
                'Other': 'Otro'
            }
        },
        'pt-PT': {
            title: 'Galeria de imagens',
            imagesFound: 'imagens',
            downloadAll: 'Descarregar tudo',
            close: 'Fechar',
            downloading: 'A descarregar',
            categories: {
                'Game Assets': 'Recursos do jogo',
                'Screenshots': 'Capturas de ecrã',
                'Promotional': 'Material promocional',
                'Backgrounds': 'Fundos',
                'Community': 'Comunidade',
                'UI/Icons': 'UI/Ícones',
                'Other': 'Outro'
            }
        }
    };

    // Get translation
    function t(key, subkey = null) {
        const lang = translations[currentLang] || translations.en;
        if (subkey) {
            return lang[key]?.[subkey] || translations.en[key]?.[subkey] || subkey;
        }
        return lang[key] || translations.en[key] || key;
    }

    // Detect and set language
    function detectLanguage() {
        const saved = localStorage.getItem('sug-language');
        if (saved && translations[saved]) {
            currentLang = saved;
            return;
        }

        const browserLang = navigator.language || navigator.userLanguage;
        
        // Direct match
        if (translations[browserLang]) {
            currentLang = browserLang;
            return;
        }
        
        // Try base language (zh-CN -> zh, pt-PT -> pt)
        const baseLang = browserLang.split('-')[0];
        const matchingLang = Object.keys(translations).find(lang => lang.startsWith(baseLang));
        
        if (matchingLang) {
            currentLang = matchingLang;
        } else {
            currentLang = 'en';
        }
    }

    // Change language
    function changeLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('sug-language', lang);
        updateUILanguage();
    }

    // Update all UI text
    function updateUILanguage() {
        const titleEl = document.querySelector('.sug-title');
        if (titleEl) titleEl.textContent = t('title');
        
        const countEl = document.querySelector('.sug-count');
        if (countEl) {
            const count = foundImages.size;
            countEl.textContent = `${count} ${t('imagesFound')}`;
        }
        
        const downloadBtn = document.querySelector('.sug-btn[title]');
        if (downloadBtn) downloadBtn.title = t('downloadAll');
        
        const closeBtn = document.querySelector('.sug-close');
        if (closeBtn) closeBtn.title = t('close');
        
        // Refresh gallery to update category names
        if (modal && modal.style.display === 'block') {
            populateGallery();
        }
    }

    // Categorize image by URL
    function categorizeImage(url) {
        if (url.includes('header.jpg') || url.includes('capsule_') || url.includes('library_')) {
            return 'Game Assets';
        }
        if (url.includes('ss_') || url.includes('screenshot')) {
            return 'Screenshots';
        }
        if (url.includes('/extras/') || url.includes('promotional')) {
            return 'Promotional';
        }
        if (url.includes('page_bg') || url.includes('background')) {
            return 'Backgrounds';
        }
        if (url.includes('steamcommunity.com')) {
            return 'Community';
        }
        if (url.includes('store.fastly') || url.includes('public/images')) {
            return 'UI/Icons';
        }
        return 'Other';
    }

    // Find all image URLs in the page
    function scanForImages() {
        const html = document.documentElement.outerHTML;
        const pattern = /https?:\/\/[^\s"'<>]+\.(jpg|jpeg|png|gif|webp|avif|bmp)[^\s"'<>]*/gi;
        const matches = html.match(pattern) || [];
        
        let newImagesFound = false;
        matches.forEach(url => {
            // Clean up URL
            url = url.replace(/&quot;/g, '').replace(/&amp;/g, '&').trim();
            
            if (!foundImages.has(url)) {
                foundImages.add(url);
                newImagesFound = true;
                if (modal && modal.style.display === 'block') {
                    populateGallery();
                }
            }
        });
        
        return newImagesFound;
    }

    // Add single image to gallery
    function addImageToSection(section, url) {
        const card = document.createElement('div');
        card.className = 'sug-card';
        
        const img = document.createElement('img');
        img.src = url;
        img.alt = 'Image';
        img.loading = 'lazy';
        
        img.onerror = () => {
            card.remove();
            foundImages.delete(url);
        };
        
        card.appendChild(img);
        card.addEventListener('click', () => window.open(url, '_blank'));
        
        section.appendChild(card);
    }

    // Populate gallery with all found images, organized by category
    function populateGallery() {
        if (!gallery) return;
        gallery.innerHTML = '';
        
        // Group images by category
        const categories = {};
        foundImages.forEach(url => {
            const category = categorizeImage(url);
            if (!categories[category]) {
                categories[category] = [];
            }
            categories[category].push(url);
        });
        
        // Create sections for each category
        const categoryOrder = ['Game Assets', 'Screenshots', 'Promotional', 'Backgrounds', 'Community', 'UI/Icons', 'Other'];
        
        categoryOrder.forEach(categoryName => {
            if (categories[categoryName] && categories[categoryName].length > 0) {
                // Section header
                const header = document.createElement('div');
                header.className = 'sug-section-header';
                const translatedName = t('categories', categoryName);
                header.textContent = `${translatedName} (${categories[categoryName].length})`;
                gallery.appendChild(header);
                
                // Section grid
                const section = document.createElement('div');
                section.className = 'sug-section';
                
                categories[categoryName].forEach(url => {
                    addImageToSection(section, url);
                });
                
                gallery.appendChild(section);
            }
        });
    }

    // Download all images
    function downloadAll() {
        const images = Array.from(foundImages);
        if (images.length === 0) return;
        
        const notify = (msg) => {
            const note = document.createElement('div');
            note.style.cssText = 'position:fixed;bottom:160px;right:20px;padding:10px 15px;border-radius:6px;background:rgba(0,0,0,0.8);color:#fff;z-index:100003;';
            note.textContent = msg;
            document.body.appendChild(note);
            setTimeout(() => note.remove(), 2500);
        };
        
        notify(`${t('downloading')} ${images.length} ${t('imagesFound')}...`);
        
        images.forEach((url, i) => {
            setTimeout(() => {
                fetch(url)
                    .then(r => r.blob())
                    .then(blob => {
                        const a = document.createElement('a');
                        a.href = URL.createObjectURL(blob);
                        a.download = url.split('/').pop().split('?')[0] || `image_${i}.jpg`;
                        a.click();
                        URL.revokeObjectURL(a.href);
                    })
                    .catch(() => {});
            }, i * 300);
        });
    }

    // Open gallery
    function openGallery() {
        if (!modal) return;
        
        scanForImages();
        populateGallery();
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        const count = document.querySelector('.sug-count');
        if (count) count.textContent = `${foundImages.size} ${t('imagesFound')}`;
    }

    // Close gallery
    function closeGallery() {
        if (!modal) return;
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }

    // Start observing page for changes
    function startObserver() {
        if (isObserving) return;
        
        const observer = new MutationObserver(() => {
            if (scanForImages() && modal && modal.style.display === 'block') {
                const count = document.querySelector('.sug-count');
                if (count) count.textContent = `${foundImages.size} ${t('imagesFound')}`;
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['src', 'style']
        });
        
        isObserving = true;
    }

    // Create language selector
    function createLanguageSelector() {
        const selector = document.createElement('select');
        selector.className = 'sug-lang-selector';
        selector.title = 'Language / 语言 / 言語 / Язык / Idioma';
        
        const languages = [
            { code: 'en', name: 'English' },
            { code: 'zh-CN', name: '简体中文' },
            { code: 'ja', name: '日本語' },
            { code: 'ru', name: 'Русский' },
            { code: 'es', name: 'Español' },
            { code: 'pt-PT', name: 'Português' }
        ];
        
        languages.forEach(lang => {
            const option = document.createElement('option');
            option.value = lang.code;
            option.textContent = lang.name;
            if (lang.code === currentLang) option.selected = true;
            selector.appendChild(option);
        });
        
        selector.addEventListener('change', (e) => {
            changeLanguage(e.target.value);
        });
        
        return selector;
    }

    // Add visual indicator to Steam logo
    function addLogoIndicator() {
        const logoHolder = document.querySelector('#logo_holder, .logo a');
        if (!logoHolder) return;
        
        const indicator = document.createElement('div');
        indicator.className = 'sug-indicator';
        indicator.innerHTML = '🖼️';
        indicator.title = 'Click to view all images on this page';
        
        logoHolder.style.position = 'relative';
        logoHolder.appendChild(indicator);
        
        // Only make the indicator clickable, not the logo
        indicator.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            openGallery();
        });
    }

    // Initialize
    function initialize() {
        // Detect language
        detectLanguage();
        
        // Create modal
        modal = document.createElement('div');
        modal.className = 'sug-modal';
        modal.id = 'sug-modal';
        
        const content = document.createElement('div');
        content.className = 'sug-content';
        
        // Header
        const header = document.createElement('div');
        header.className = 'sug-header';
        
        const title = document.createElement('div');
        title.className = 'sug-title';
        title.textContent = t('title');
        
        const headerRight = document.createElement('div');
        headerRight.className = 'sug-header-right';
        
        const count = document.createElement('div');
        count.className = 'sug-count';
        count.textContent = `0 ${t('imagesFound')}`;
        
        const langSelector = createLanguageSelector();
        
        headerRight.appendChild(count);
        headerRight.appendChild(langSelector);
        
        header.appendChild(title);
        header.appendChild(headerRight);
        
        // Sidebar
        const sidebar = document.createElement('div');
        sidebar.className = 'sug-sidebar';
        
        const downloadBtn = document.createElement('button');
        downloadBtn.className = 'sug-btn';
        downloadBtn.innerHTML = '📥';
        downloadBtn.title = t('downloadAll');
        downloadBtn.addEventListener('click', downloadAll);
        
        const closeBtn = document.createElement('button');
        closeBtn.className = 'sug-btn sug-close';
        closeBtn.innerHTML = '✕';
        closeBtn.title = t('close');
        closeBtn.addEventListener('click', closeGallery);
        
        sidebar.appendChild(downloadBtn);
        sidebar.appendChild(closeBtn);
        
        // Gallery
        gallery = document.createElement('div');
        gallery.className = 'sug-gallery';
        gallery.id = 'sug-gallery';
        
        content.appendChild(header);
        content.appendChild(gallery);
        content.appendChild(sidebar);
        modal.appendChild(content);
        
        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeGallery();
        });
        
        document.body.appendChild(modal);
        
        // Add logo indicator
        addLogoIndicator();
        
        // Initial scan
        scanForImages();
        
        // Start observing
        startObserver();
    }

    // Styles
    GM_addStyle(`
        .sug-indicator {
            position: absolute;
            top: -8px;
            right: -8px;
            width: 24px;
            height: 24px;
            background: linear-gradient(135deg, #1b2838 0%, #2a475e 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            cursor: pointer;
            transition: all 0.2s ease;
            border: 2px solid #66c0f4;
        }
        
        .sug-indicator:hover {
            transform: scale(1.15);
            box-shadow: 0 4px 12px rgba(102, 192, 244, 0.4);
        }
        
        .sug-modal {
            position: fixed;
            inset: 0;
            display: none;
            z-index: 100001;
            background: rgba(10, 15, 25, 0.95);
            backdrop-filter: blur(12px);
            overflow: hidden;
        }
        
        .sug-content {
            position: absolute;
            inset: 0;
            display: flex;
            flex-direction: column;
        }
        
        .sug-header {
            padding: 20px;
            background: rgba(27, 40, 56, 0.9);
            border-bottom: 2px solid #66c0f4;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .sug-header-right {
            display: flex;
            align-items: center;
            gap: 15px;
        }
        
        .sug-title {
            font-size: 24px;
            font-weight: 600;
            color: #fff;
        }
        
        .sug-count {
            font-size: 14px;
            color: #8f98a0;
        }
        
        .sug-lang-selector {
            background: rgba(27, 40, 56, 0.8);
            color: #66c0f4;
            border: 1px solid #66c0f4;
            border-radius: 4px;
            padding: 5px 10px;
            font-size: 13px;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .sug-lang-selector:hover {
            background: rgba(102, 192, 244, 0.2);
        }
        
        .sug-lang-selector option {
            background: #1b2838;
            color: #fff;
        }
        
        .sug-sidebar {
            position: fixed;
            right: 20px;
            top: 50%;
            transform: translateY(-50%);
            display: flex;
            flex-direction: column;
            gap: 12px;
            z-index: 3;
        }
        
        .sug-btn {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            border: none;
            font-size: 20px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
            transition: all 0.2s ease;
            background: #66c0f4;
            color: #1b2838;
        }
        
        .sug-btn:hover {
            transform: scale(1.1);
            box-shadow: 0 4px 16px rgba(102, 192, 244, 0.4);
        }
        
        .sug-close {
            background: #c7503a;
            color: #fff;
        }
        
        .sug-gallery {
            flex: 1;
            overflow-y: scroll;
            overflow-x: hidden;
            padding: 20px;
            -webkit-overflow-scrolling: touch;
        }
        
        .sug-section-header {
            font-size: 18px;
            font-weight: 600;
            color: #66c0f4;
            margin: 20px 0 15px 0;
            padding-bottom: 10px;
            border-bottom: 2px solid rgba(102, 192, 244, 0.3);
        }
        
        .sug-section-header:first-child {
            margin-top: 0;
        }
        
        .sug-section {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 15px;
            margin-bottom: 30px;
        }
        
        .sug-card {
            width: 100%;
            height: 200px;
            border-radius: 8px;
            overflow: hidden;
            background: rgba(27, 40, 56, 0.6);
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }
        
        .sug-card:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 20px rgba(102, 192, 244, 0.3);
            z-index: 2;
        }
        
        .sug-card img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
        }
    `);

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();