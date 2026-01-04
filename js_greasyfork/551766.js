// ==UserScript==
// @name         Pixeldrain Bypass - Multi Language
// @name:tr      Pixeldrain Bypass - Çok Dilli
// @name:en      Pixeldrain Bypass - Multi Language
// @name:es      Pixeldrain Bypass - Multiidioma
// @name:fr      Pixeldrain Bypass - Multilingue
// @name:de      Pixeldrain Bypass - Mehrsprachig
// @name:ru      Pixeldrain Bypass - Многоязычный
// @name:ja      Pixeldrain Bypass - 多言語
// @name:ko      Pixeldrain Bypass - 다국어
// @name:zh      Pixeldrain Bypass - 多语言
// @name:ar      Pixeldrain Bypass - متعدد اللغات
// @name:pt      Pixeldrain Bypass - Multi-idioma
// @namespace    https://greasyfork.org/users/1522465-xmtaha
// @version      1.2.3
// @description  Bypass Pixeldrain download limits with multiple proxy options and language support
// @description:tr Pixeldrain indirme sınırlarını birden fazla proxy seçeneği ve dil desteği ile bypass et
// @description:en Bypass Pixeldrain download limits with multiple proxy options and language support
// @description:es Elude los límites de descarga de Pixeldrain con múltiples opciones de proxy y soporte de idiomas
// @description:fr Contourne les limites de téléchargement Pixeldrain avec plusieurs options de proxy et support multilingue
// @description:de Umgehe Pixeldrain Download-Limits mit mehreren Proxy-Optionen und Sprachunterstützung
// @description:ru Обход ограничений загрузки Pixeldrain с несколькими вариантами прокси и поддержкой языков
// @description:ja 複数のプロキシオプションと言語サポートでPixeldrainダウンロード制限をバイパス
// @description:ko 여러 프록시 옵션과 언어 지원으로 Pixeldrain 다운로드 제한 우회
// @description:zh 使用多个代理选项和语言支持绕过Pixeldrain下载限制
// @description:ar تجاوز حدود تنزيل Pixeldrain مع خيارات بروكسي متعددة ودعم اللغات
// @description:pt Contorna os limites de download do Pixeldrain com múltiplas opções de proxy e suporte a idiomas
// @author       xmtaha
// @match        https://pixeldrain.com/*
// @match        https://www.pixeldrain.com/*
// @match        https://pixeldra.in/*
// @match        https://www.pixeldra.in/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// @icon         https://pixeldrain.com/favicon.ico
// @supportURL   https://greasyfork.org/scripts/551766-pixeldrain-bypass-multi-language/feedback
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551766/Pixeldrain%20Bypass%20-%20Multi%20Language.user.js
// @updateURL https://update.greasyfork.org/scripts/551766/Pixeldrain%20Bypass%20-%20Multi%20Language.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const translations = {
        tr: {
            bypass: 'Bypass',
            selectProxy: 'Proxy Seç',
            proxy1: 'Proxy 1 (proxy2.pixeldrainbypass.org)',
            proxy2: 'Proxy 2 (pd.1drv.eu.org)',
                proxy1: 'Proxy 1 (pixeldrainbypass.org)',
                proxy2: 'Proxy 2 (pixeldrain-bypass.cybar.xyz)',
            downloading: 'İndiriliyor...',
            success: 'Bypass linki başarıyla açıldı!',
            error: 'Hata oluştu!',
            noFileId: 'Dosya ID\'si bulunamadı!',
            copied: 'Link kopyalandı!',
            copyLink: 'Linki Kopyala',
            openLink: 'Linki Aç',
            codedBy: 'xmtaha tarafından sevgi ile kodlanmıştır'
        },
        en: {
            bypass: 'Bypass',
            selectProxy: 'Select Proxy',
            proxy1: 'Proxy 1 (proxy2.pixeldrainbypass.org)',
            proxy2: 'Proxy 2 (pd.cybar.xyz)',
                proxy1: 'Proxy 1 (pixeldrainbypass.org)',
                proxy2: 'Proxy 2 (pixeldrain-bypass.cybar.xyz)',
            downloading: 'Downloading...',
            success: 'Bypass link opened successfully!',
            error: 'An error occurred!',
            noFileId: 'File ID not found!',
            copied: 'Link copied!',
            copyLink: 'Copy Link',
            openLink: 'Open Link',
            codedBy: 'Coded with love by xmtaha'
        },
        es: {
            bypass: 'Saltar',
            selectProxy: 'Seleccionar Proxy',
            proxy1: 'Proxy 1 (proxy2.pixeldrainbypass.org)',
            proxy2: 'Proxy 2 (pd.cybar.xyz)',
                proxy1: 'Proxy 1 (pixeldrainbypass.org)',
                proxy2: 'Proxy 2 (pixeldrain-bypass.cybar.xyz)',
            downloading: 'Descargando...',
            success: '¡Enlace de bypass abierto exitosamente!',
            error: '¡Ocurrió un error!',
            noFileId: '¡ID de archivo no encontrado!',
            copied: '¡Enlace copiado!',
            copyLink: 'Copiar Enlace',
            openLink: 'Abrir Enlace',
            codedBy: 'Codificado con amor por xmtaha'
        },
        fr: {
            bypass: 'Contourner',
            selectProxy: 'Sélectionner Proxy',
            proxy1: 'Proxy 1 (proxy2.pixeldrainbypass.org)',
            proxy2: 'Proxy 2 (pd.cybar.xyz)',
                proxy1: 'Proxy 1 (pixeldrainbypass.org)',
                proxy2: 'Proxy 2 (pixeldrain-bypass.cybar.xyz)',
            downloading: 'Téléchargement...',
            success: 'Lien de contournement ouvert avec succès!',
            error: 'Une erreur est survenue!',
            noFileId: 'ID de fichier introuvable!',
            copied: 'Lien copié!',
            copyLink: 'Copier le Lien',
            openLink: 'Ouvrir le Lien',
            codedBy: 'Codé avec amour par xmtaha'
        },
        de: {
            bypass: 'Umgehen',
            selectProxy: 'Proxy Auswählen',
            proxy1: 'Proxy 1 (proxy2.pixeldrainbypass.org)',
            proxy2: 'Proxy 2 (pd.cybar.xyz)',
                proxy1: 'Proxy 1 (pixeldrainbypass.org)',
                proxy2: 'Proxy 2 (pixeldrain-bypass.cybar.xyz)',
            downloading: 'Wird heruntergeladen...',
            success: 'Bypass-Link erfolgreich geöffnet!',
            error: 'Ein Fehler ist aufgetreten!',
            noFileId: 'Datei-ID nicht gefunden!',
            copied: 'Link kopiert!',
            copyLink: 'Link Kopieren',
            openLink: 'Link Öffnen',
            codedBy: 'Mit Liebe von xmtaha kodiert'
        },
        ru: {
            bypass: 'Обход',
            selectProxy: 'Выбрать Прокси',
            proxy1: 'Прокси 1 (proxy2.pixeldrainbypass.org)',
            proxy2: 'Прокси 2 (pd.cybar.xyz)',
                proxy1: 'Прокси 1 (pixeldrainbypass.org)',
                proxy2: 'Прокси 2 (pixeldrain-bypass.cybar.xyz)',
            downloading: 'Загрузка...',
            success: 'Ссылка обхода успешно открыта!',
            error: 'Произошла ошибка!',
            noFileId: 'ID файла не найден!',
            copied: 'Ссылка скопирована!',
            copyLink: 'Копировать Ссылку',
            openLink: 'Открыть Ссылку',
            codedBy: 'Закодировано с любовью xmtaha'
        },
        ja: {
            bypass: 'バイパス',
            selectProxy: 'プロキシ選択',
            proxy1: 'プロキシ1 (proxy2.pixeldrainbypass.org)',
            proxy2: 'プロキシ2 (pd.cybar.xyz)',
                proxy1: 'プロキシ1 (pixeldrainbypass.org)',
                proxy2: 'プロキシ2 (pixeldrain-bypass.cybar.xyz)',
            downloading: 'ダウンロード中...',
            success: 'バイパスリンクが正常に開かれました！',
            error: 'エラーが発生しました！',
            noFileId: 'ファイルIDが見つかりません！',
            copied: 'リンクをコピーしました！',
            copyLink: 'リンクをコピー',
            openLink: 'リンクを開く',
            codedBy: 'xmtahaによって愛情を込めてコードされました'
        },
        ko: {
            bypass: '우회',
            selectProxy: '프록시 선택',
            proxy1: '프록시 1 (proxy2.pixeldrainbypass.org)',
            proxy2: '프록시 2 (pd.cybar.xyz)',
                proxy1: '프록시 1 (pixeldrainbypass.org)',
                proxy2: '프록시 2 (pixeldrain-bypass.cybar.xyz)',
            downloading: '다운로드 중...',
            success: '우회 링크가 성공적으로 열렸습니다!',
            error: '오류가 발생했습니다!',
            noFileId: '파일 ID를 찾을 수 없습니다!',
            copied: '링크가 복사되었습니다!',
            copyLink: '링크 복사',
            openLink: '링크 열기',
            codedBy: 'xmtaha가 사랑으로 코딩했습니다'
        },
        zh: {
            bypass: '绕过',
            selectProxy: '选择代理',
            proxy1: '代理1 (proxy2.pixeldrainbypass.org)',
            proxy2: '代理2 (pd.cybar.xyz)',
                proxy1: '代理1 (pixeldrainbypass.org)',
                proxy2: '代理2 (pixeldrain-bypass.cybar.xyz)',
            downloading: '下载中...',
            success: '绕过链接成功打开！',
            error: '发生错误！',
            noFileId: '未找到文件ID！',
            copied: '链接已复制！',
            copyLink: '复制链接',
            openLink: '打开链接',
            codedBy: '由 xmtaha 满怀爱意编码'
        },
        ar: {
            bypass: 'تجاوز',
            selectProxy: 'اختيار البروكسي',
            proxy1: 'البروكسي 1 (proxy2.pixeldrainbypass.org)',
            proxy2: 'البروكسي 2 (pd.cybar.xyz)',
                proxy1: 'البروكسي 1 (pixeldrainbypass.org)',
                proxy2: 'البروكسي 2 (pixeldrain-bypass.cybar.xyz)',
            downloading: 'جاري التنزيل...',
            success: 'تم فتح رابط التجاوز بنجاح!',
            error: 'حدث خطأ!',
            noFileId: 'لم يتم العثور على معرف الملف!',
            copied: 'تم نسخ الرابط!',
            copyLink: 'نسخ الرابط',
            openLink: 'فتح الرابط',
            codedBy: 'مبرمج بحب من قبل xmtaha'
        },
        pt: {
            bypass: 'Contornar',
            selectProxy: 'Selecionar Proxy',
            proxy1: 'Proxy 1 (proxy2.pixeldrainbypass.org)',
            proxy2: 'Proxy 2 (pd.cybar.xyz)',
                proxy1: 'Proxy 1 (pixeldrainbypass.org)',
                proxy2: 'Proxy 2 (pixeldrain-bypass.cybar.xyz)',
            downloading: 'Baixando...',
            success: 'Link de contorno aberto com sucesso!',
            error: 'Ocorreu um erro!',
            noFileId: 'ID do arquivo não encontrado!',
            copied: 'Link copiado!',
            copyLink: 'Copiar Link',
            openLink: 'Abrir Link',
            codedBy: 'Codificado com amor por xmtaha'
        }
    };

    function getLanguage() {
        const savedLang = GM_getValue('selectedLanguage', null);
        if (savedLang && translations[savedLang]) {
            return savedLang;
        }
        
        const browserLang = navigator.language || navigator.userLanguage;
        const langCode = browserLang.split('-')[0].toLowerCase();
        
        if (translations[langCode]) {
            return langCode;
        }
        
        return 'en';
    }

    let currentLang = getLanguage();
    let currentTranslation = translations[currentLang];

    function extractFileId() {
        const url = window.location.href;
        const match = url.match(/(?:pixeldrain\.com|pixeldra\.in)\/u\/([a-zA-Z0-9]+)/);
        return match ? match[1] : null;
    }

    function generateBypassUrls(fileId) {
        return {
            proxy1: `https://proxy2.pixeldrainbypass.org/download/${fileId}`,
            proxy2: `https://pd.1drv.eu.org/${fileId}`
        };
    }

    function copyToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
    }

    function showNotification(message, type = 'info') {
        if (typeof GM_notification !== 'undefined') {
            GM_notification({
                text: message,
                title: 'Pixeldrain Bypass',
                timeout: 3000
            });
        } else {
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
                color: white;
                padding: 15px 20px;
                border-radius: 5px;
                z-index: 10000;
                font-family: Arial, sans-serif;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            `;
            notification.textContent = message;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 3000);
        }
    }

    function createLanguageSelector() {
        const langSelector = document.createElement('select');
        langSelector.style.cssText = `
            margin-left: 10px;
            padding: 5px;
            border: 1px solid #ddd;
            border-radius: 3px;
            background: white;
            font-size: 12px;
        `;
        
        const languages = {
            tr: 'Türkçe',
            en: 'English',
            es: 'Español',
            fr: 'Français',
            de: 'Deutsch',
            ru: 'Русский',
            ja: '日本語',
            ko: '한국어',
            zh: '中文',
            ar: 'العربية',
            pt: 'Português'
        };
        
        Object.entries(languages).forEach(([code, name]) => {
            const option = document.createElement('option');
            option.value = code;
            option.textContent = name;
            if (code === currentLang) {
                option.selected = true;
            }
            langSelector.appendChild(option);
        });
        
        langSelector.addEventListener('change', function() {
            currentLang = this.value;
            currentTranslation = translations[currentLang];
            GM_setValue('selectedLanguage', currentLang);
            updateButtonTexts();
        });
        
        return langSelector;
    }

    function updateButtonTexts() {
        const bypassContainer = document.getElementById('pixeldrain-bypass-container');
        if (bypassContainer) {
            bypassContainer.remove();
            createBypassButton();
        }
    }

    function createBypassButton() {
        const fileId = extractFileId();
        if (!fileId) {
            console.log('File ID not found');
            return;
        }

        const bypassUrls = generateBypassUrls(fileId);
        
        const container = document.createElement('div');
        container.id = 'pixeldrain-bypass-container';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 15px;
            border-radius: 10px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            min-width: 280px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.2);
        `;

        const header = document.createElement('div');
        header.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 15px;
            color: white;
            font-weight: bold;
            font-size: 16px;
        `;
        header.innerHTML = 'Pixeldrain Bypass';
        header.appendChild(createLanguageSelector());

        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;

        const proxy1Button = document.createElement('button');
        proxy1Button.textContent = currentTranslation.proxy1;
        proxy1Button.style.cssText = `
            background: linear-gradient(45deg, #FF6B6B, #FF8E8E);
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            transition: all 0.3s ease;
            text-align: center;
        `;
        
        proxy1Button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 6px 20px rgba(255,107,107,0.4)';
        });
        
        proxy1Button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
        
        proxy1Button.addEventListener('click', function() {
            this.textContent = currentTranslation.downloading;
            this.disabled = true;
            setTimeout(() => {
                window.open(bypassUrls.proxy1, '_blank');
                showNotification(currentTranslation.success, 'success');
                this.textContent = currentTranslation.proxy1;
                this.disabled = false;
            }, 1000);
        });

        const proxy2Button = document.createElement('button');
        proxy2Button.textContent = currentTranslation.proxy2;
        proxy2Button.style.cssText = `
            background: linear-gradient(45deg, #4ECDC4, #6FDDDD);
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            transition: all 0.3s ease;
            text-align: center;
        `;
        
        proxy2Button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 6px 20px rgba(78,205,196,0.4)';
        });
        
        proxy2Button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
        
        proxy2Button.addEventListener('click', function() {
            this.textContent = currentTranslation.downloading;
            this.disabled = true;
            setTimeout(() => {
                window.open(bypassUrls.proxy2, '_blank');
                showNotification(currentTranslation.success, 'success');
                this.textContent = currentTranslation.proxy2;
                this.disabled = false;
            }, 1000);
        });

        const copyContainer = document.createElement('div');
        copyContainer.style.cssText = `
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid rgba(255,255,255,0.2);
        `;

        const copyProxy1Btn = document.createElement('button');
        copyProxy1Btn.textContent = `${currentTranslation.copyLink} 1`;
        copyProxy1Btn.style.cssText = `
            background: rgba(255,255,255,0.2);
            color: white;
            border: 1px solid rgba(255,255,255,0.3);
            padding: 8px 15px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 12px;
            margin-right: 5px;
            margin-bottom: 5px;
            transition: all 0.3s ease;
        `;
        
        copyProxy1Btn.addEventListener('click', function() {
            copyToClipboard(bypassUrls.proxy1);
            showNotification(currentTranslation.copied, 'success');
        });

        const copyProxy2Btn = document.createElement('button');
        copyProxy2Btn.textContent = `${currentTranslation.copyLink} 2`;
        copyProxy2Btn.style.cssText = copyProxy1Btn.style.cssText;
        
        copyProxy2Btn.addEventListener('click', function() {
            copyToClipboard(bypassUrls.proxy2);
            showNotification(currentTranslation.copied, 'success');
        });

        buttonContainer.appendChild(proxy1Button);
        buttonContainer.appendChild(proxy2Button);
        
        copyContainer.appendChild(copyProxy1Btn);
        copyContainer.appendChild(copyProxy2Btn);

        const creditContainer = document.createElement('div');
        creditContainer.style.cssText = `
            margin-top: 10px;
            text-align: center;
            font-size: 11px;
            color: rgba(255,255,255,0.7);
            cursor: pointer;
            transition: color 0.3s ease;
        `;
        creditContainer.textContent = currentTranslation.codedBy;
        creditContainer.addEventListener('mouseenter', function() {
            this.style.color = 'rgba(255,255,255,1)';
        });
        creditContainer.addEventListener('mouseleave', function() {
            this.style.color = 'rgba(255,255,255,0.7)';
        });
        creditContainer.addEventListener('click', function() {
            window.open('https://github.com/xmtaha', '_blank');
        });
        
        container.appendChild(header);
        container.appendChild(buttonContainer);
        container.appendChild(copyContainer);
        container.appendChild(creditContainer);

        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;

        header.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);

        function dragStart(e) {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
            
            if (e.target === header || header.contains(e.target)) {
                isDragging = true;
                header.style.cursor = 'grabbing';
            }
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                xOffset = currentX;
                yOffset = currentY;
                
                container.style.transform = `translate(${currentX}px, ${currentY}px)`;
            }
        }

        function dragEnd() {
            if (isDragging) {
                isDragging = false;
                header.style.cursor = 'grab';
            }
        }

        header.style.cursor = 'grab';
        
        document.body.appendChild(container);
    }

    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        const fileId = extractFileId();
        if (fileId) {
            setTimeout(createBypassButton, 1000);
        }
    }

    init();

})();
