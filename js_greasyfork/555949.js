// ==UserScript==
// @name         4PDA Logo
// @namespace    http://4pda.to/forum/index.php
// @version      5.0
// @description  Замена логотипа в посте (очистка старого лого в тексте + удаление вложения логотипа + причина редактирования )
// @author       BrantX
// @match        http*://4pda.to/forum/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/555949/4PDA%20Logo.user.js
// @updateURL https://update.greasyfork.org/scripts/555949/4PDA%20Logo.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log('Logo Replacer v5.0 LOADED');

    // ---------- База логотипов ----------

    const LOGOS = [
        { url: 'https://4pda.to/s/HL5V5qDA1xLMwNxwm561PwRaFF6TOoR9wwZ.png', description: 'AICP' },
        { url: 'https://4pda.to/s/HL5V1GHLxxp1z1TgHPZRKOvz0Rlz2z1H61bgCj7.png', description: 'AICP_2' },
        { url: 'https://4pda.to/s/HL5V6p1Ko5MmbdZ6sAUz0z25RaFFcDmsHOneE.png', description: 'AlphaDroid_2' },
        { url: 'https://4pda.to/s/HL5V7m7RgvmFbd3skM8Q33KypfPDmsnefKe.png', description: 'AlphaDroid' },
        { url: 'https://4pda.to/s/HL5VEdX4wHqbaab9ksu2VLJGz0IJyBy0ppDt.png', description: 'Ancient' },
        { url: 'https://4pda.to/s/HL5VFadBYjIQaa5vsgkbZJS81qiyByW3hnH.png', description: 'Android Beta' },
        { url: 'https://4pda.to/s/HL5V0xNpkJnip0z2Gn6Wz1PwxKtZ86YRSbq19.png', description: 'Android' },
        { url: 'https://4pda.to/s/HL5V1uHyslNJp0VWfQsPbyqCB5t6YRyLiz0l.png', description: 'ApolloOS' },
        { url: 'https://4pda.to/s/HL5V2z2TY5HKrim7SlLkb33qCB5NMAVs4dl2.png', description: 'AwakenOS' },
        { url: 'https://4pda.to/s/HL5V3yRjTjoAimdit9u2z25xKtZeMAVMqz2Ja.png', description: 'AxionOS' },
        { url: 'https://4pda.to/s/HL5V4p3HxIogyO3sEcmsj8cX6O2N9PvSRfj.png', description: 'BaikalOS' },
        { url: 'https://4pda.to/s/HL5V5m5UZkKLyOZ6MwcHHEfvwz1z0N9PPi3LB.png', description: 'BananaDroid' },
        { url: 'https://4pda.to/s/HL5V6t90GGNpZexwGrz1jtnfvwz1T7XTJz087c.png', description: 'Bliss ROM' },
        { url: 'https://4pda.to/s/HL5V7qFF8inCZeRA8feABtcX6OY7XTpDGx0.png', description: 'Bootleggers' },
        { url: 'https://4pda.to/s/HL5VEhvuSkq5qinhxtRKu95tXa4uXz0Z54PL.png', description: 'CalyxOS_1' },
        { url: 'https://4pda.to/s/HL5VFez2t4IIwqiHRZhDp4FAlT2xuXz03rSbp.png', description: 'CalyxOS_2' },
        { url: 'https://4pda.to/s/HL5V0tFF8inCZ8hoa73ez1cjphLV28Qz2J3Lh.png', description: 'Cherish OS' },
        { url: 'https://4pda.to/s/HL5V1q90GGNpZ8B2yRLF2WYhNpW28QVZRfD.png', description: 'CipherOS' },
        { url: 'https://4pda.to/s/HL5V2p5UZkKLyuJz1wKDpaVYhNp0IWULoGxW.png', description: 'ColtOS' },
        { url: 'https://4pda.to/s/HL5V3m3HxIogyupEY8RKOPjphLz2IWUr2876.png', description: 'crDroid' },
        { url: 'https://4pda.to/s/HL5V4z2RjTjoAiGNKRdJWAKm6QkLJZOQgiz0F.png', description: 'DerpFest' },
        { url: 'https://4pda.to/s/HL5V5yTY5HKriGta3x57sIz2Uc8gJZOwQq1f.png', description: 'DivestOS' },
        { url: 'https://4pda.to/s/HL5V6xHyslNJpWlO5qTxGjz2Uc8A3BSmBz2J4.png', description: 'Evolution X' },
        { url: 'https://4pda.to/s/HL5V7uNpkJnipWFeTeBSihm6Qkr3BSGxdlY.png', description: 'GrapheneOS' },
        { url: 'https://4pda.to/s/HL5VElniz1xr6oZfNT8x4mz0tgKLz2omMXWz0sz0.png', description: 'HentaiOS' },
        { url: 'https://4pda.to/s/HL5VFitZc7JvoZ9d5KjZCxuoep0omM1GbAR.png', description: 'HorizonDroid' },
        { url: 'https://4pda.to/s/HL5V0p7RgvmFb7pE2uZusIVkUaa8Pnz0sww3.png', description: 'Infinity' },
        { url: 'https://4pda.to/s/HL5V1m1Ko5Mmb7Jz1QarVAKGsY2R8PnT6Y6b.png', description: 'iode' },
        { url: 'https://4pda.to/s/HL5V2tDA1xLMwtB2ShjZihGsY2xOnrNNfK8.png', description: 'Kirisakura' },
        { url: 'https://4pda.to/s/HL5V3qB5P7pfwtho4tx4GjVkUa4Onrtdnek.png', description: 'LineageOS' },
        { url: 'https://4pda.to/s/HL5V4xJvz2up9gVFez0Opm2W2RlVkPopOFLId.png', description: 'LMODroid' },
        { url: 'https://4pda.to/s/HL5V5uLsd4LsgVlOb4bNz1cD3JvHPopuz2Dk1.png', description: 'Martixx' },
        { url: 'https://4pda.to/s/HL5V6z2PeKwMGrltaZBz0hOPD3Jvn9Qtok6yi.png', description: 'MistOS' },
        { url: 'https://4pda.to/s/HL5V7yVdC6mlrlNKxNhCaV2RlVE9QtIUU0A.png', description: 'Paranoid' },
        { url: 'https://4pda.to/s/HL5VEBfuSkq5qinhxtRKu95tXa4uXz0Z54PL.png', description: 'PhoenixAOSP' },
        { url: 'https://4pda.to/s/HL5VF8lt4IIwqiHRZhDp4FAlT2xuXz03rSbp.png', description: 'PixelDust' },
        { url: 'https://4pda.to/s/HL5V0NVF8inCZ8hoa73ez1cjphLV28Qz2J3Lh.png', description: 'PixelExperience' },
        { url: 'https://4pda.to/s/HL5V1KP0GGNpZ8B2yRLF2WYhNpW28QVZRfD.png', description: 'PixelOS' },
        { url: 'https://4pda.to/s/HL5V2JLUZkKLyuJz1wKDpaVYhNp0IWULoGxW.png', description: 'PixelPlus UI' },
        { url: 'https://4pda.to/s/HL5V3GJHxIogyupEY8RKOPjphLz2IWUr2876.png', description: 'Project Blaze' },
        { url: 'https://4pda.to/s/HL5V4VBjTjoAiGNKRdJWAKm6QkLJZOQgiz0F.png', description: 'Project Elixir-new' },
        { url: 'https://4pda.to/s/HL5V5SDY5HKriGta3x57sIz2Uc8gJZOwQq1f.png', description: 'Project Elixir' },
        { url: 'https://4pda.to/s/HL5V6R1yslNJpWlO5qTxGjz2Uc8A3BSmBz2J4.png', description: 'Project Zephyrus' },
        { url: 'https://4pda.to/s/HL5V7O7pkJnipWFeTeBSihm6Qkr3BSGxdlY.png', description: 'ProjectEverest' },
        { url: 'https://4pda.to/s/HL5VEFXiz1xr6oZfNT8x4mz0tgKLz2omMXWz0sz0.png', description: 'Radioactive Kernel' },
        { url: 'https://4pda.to/s/HL5VFCdZc7JvoZ9d5KjZCxuoep0omM1GbAR.png', description: 'RisingOS' },
        { url: 'https://4pda.to/s/HL5V0JNRgvmFb7pE2uZusIVkUaa8Pnz0sww3.png', description: 'Sigmadroid_2' },
        { url: 'https://4pda.to/s/HL5V1GHKo5Mmb7Jz1QarVAKGsY2R8PnT6Y6b.png', description: 'Sigmadroid' },
        { url: 'https://4pda.to/s/HL5V2NTA1xLMwtB2ShjZihGsY2xOnrNNfK8.png', description: 'SparkOS' },
        { url: 'https://4pda.to/s/HL5V3KR5P7pfwtho4tx4GjVkUa4Onrtdnek.png', description: 'StagOS' },
        { url: 'https://4pda.to/s/HL5V4R3vz2up9gVFez0Opm2W2RlVkPopOFLId.png', description: 'StatixOS' },
        { url: 'https://4pda.to/s/HL5V5O5sd4LsgVlOb4bNz1cD3JvHPopuz2Dk1.png', description: 'Superior_2' },
        { url: 'https://4pda.to/s/HL5V6V9eKwMGrltaZBz0hOPD3Jvn9Qtok6yi.png', description: 'Superior' },
        { url: 'https://4pda.to/s/HL5V7SFdC6mlrlNKxNhCaV2RlVE9QtIUU0A.png', description: 'SyberiaOS' }
    ];

    let buttonAdded = false;
    let logoPanel = null;

    // ---------- Кнопка "Лого" ----------

    function addLogoButton() {
        if (buttonAdded) return;

        const selectors = [
            'img[src*="folder_editor_buttons"]',
            'td.formbuttons img',
            '.buttons img',
            'input[value*="B"]',
            'input[value*="I"]',
            'input[value*="U"]',
            'textarea[name="Post"]'
        ];

        for (let selector of selectors) {
            const elements = document.querySelectorAll(selector);
            if (elements.length > 0) {
                const element = elements[0];
                const logoBtn = document.createElement('span');
                logoBtn.className = 'g-btn blue logo-replacer-btn';
                logoBtn.textContent = 'Лого';
                logoBtn.title = `Выбрать логотип из ${LOGOS.length} вариантов`;
                logoBtn.style.cssText = 'margin-left:4px;cursor:pointer;font-weight:bold;';
                logoBtn.addEventListener('click', showLogoSelector);

                const container = element.parentNode;
                container.insertBefore(logoBtn, container.firstChild);
                buttonAdded = true;
                return;
            }
        }
    }

    function showLogoSelector() {
        if (logoPanel) {
            logoPanel.remove();
            logoPanel = null;
            return;
        }

        logoPanel = document.createElement('div');
        logoPanel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border: 3px solid #4a6782;
            border-radius: 10px;
            padding: 15px;
            z-index: 10000;
            box-shadow: 0 8px 25px rgba(0,0,0,0.3);
            max-width: 95vw;
            max-height: 85vh;
            overflow-y: auto;
            font-family: Arial, sans-serif;
            font-size: 12px;
        `;

        const title = document.createElement('div');
        title.textContent = `Выберите логотип (${LOGOS.length} вариантов):`;
        title.style.cssText = 'font-weight: bold; margin-bottom: 12px; color: #333; font-size: 14px; text-align: center;';
        logoPanel.appendChild(title);

        const grid = document.createElement('div');
        grid.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 10px;';
        logoPanel.appendChild(grid);

        LOGOS.forEach((logo) => {
            const logoContainer = document.createElement('div');
            logoContainer.style.cssText = 'border: 1px solid #ddd; border-radius: 6px; padding: 8px; text-align: center; background: #f9f9f9; cursor: pointer;';

            const name = document.createElement('div');
            name.textContent = logo.description;
            name.style.cssText = 'font-weight: bold; font-size: 10px; color: #4a6782; margin-bottom: 5px; height: 30px; display: flex; align-items: center; justify-content: center;';
            logoContainer.appendChild(name);

            const preview = document.createElement('img');
            preview.src = logo.url;
            preview.style.cssText = 'max-width: 100px; max-height: 50px; display: block; margin: 0 auto 8px; border: 1px solid #ccc;';
            preview.alt = logo.description;
            logoContainer.appendChild(preview);

            const logoBtn = document.createElement('button');
            logoBtn.textContent = 'Вставить';
            logoBtn.style.cssText = `
                width: 100%;
                padding: 4px 8px;
                background: #4a6782;
                color: white;
                border: none;
                border-radius: 3px;
                cursor: pointer;
                font-size: 10px;
                font-weight: bold;
            `;

            logoBtn.addEventListener('mouseenter', function () {
                this.style.background = '#5a7792';
                logoContainer.style.background = '#f0f5fa';
            });

            logoBtn.addEventListener('mouseleave', function () {
                this.style.background = '#4a6782';
                logoContainer.style.background = '#f9f9f9';
            });

            logoBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                insertLogo(logo.url, logo.description);
                logoPanel.remove();
                logoPanel = null;
            });

            logoContainer.appendChild(logoBtn);

            logoContainer.addEventListener('click', (e) => {
                if (e.target !== logoBtn) {
                    insertLogo(logo.url, logo.description);
                    logoPanel.remove();
                    logoPanel = null;
                }
            });

            grid.appendChild(logoContainer);
        });

        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Закрыть';
        closeBtn.style.cssText = `
            display: block;
            margin: 15px auto 0;
            padding: 8px 16px;
            background: #ff4444;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            font-weight: bold;
        `;
        closeBtn.addEventListener('click', () => {
            logoPanel.remove();
            logoPanel = null;
        });

        logoPanel.appendChild(closeBtn);
        document.body.appendChild(logoPanel);

        setTimeout(() => {
            const closeHandler = (e) => {
                if (logoPanel && !logoPanel.contains(e.target)) {
                    logoPanel.remove();
                    logoPanel = null;
                    document.removeEventListener('click', closeHandler);
                }
            };
            document.addEventListener('click', closeHandler);
        }, 100);
    }

    // ---------- Анализ спойлеров и логотипов ----------

    function isPureAttachmentSpoiler(content) {
        let cleaned = content;
        cleaned = cleaned.replace(/\[attachment[^\]]*?]/gi, '');
        cleaned = cleaned.replace(/\[(?:\/?center|\/?b|\/?i|\/?u|\/?size|\/?color)[^\]]*]/gi, '');
        cleaned = cleaned.replace(/\s+/g, '');
        return !/[A-Za-zА-Яа-я0-9]/.test(cleaned);
    }

    function getLogoSpoilers(text) {
        const spoilerRegex = /\[spoiler(?:=([^\]]*))?]([\s\S]*?)\[\/spoiler]/gi;
        const result = [];
        let m;
        while ((m = spoilerRegex.exec(text)) !== null) {
            const whole = m[0];
            const rawTitle = m[1] || '';
            const content = m[2] || '';
            const titleTrim = rawTitle.trim();

            let isLogo = false;

            if (titleTrim) {
                const norm = titleTrim.replace(/["'\[\]]/g, '');
                if (/лого|logo/i.test(norm)) isLogo = true;
                if (/(скрин|screenshot|screens?)/i.test(norm)) isLogo = false;
            }

            if (!titleTrim && isPureAttachmentSpoiler(content)) {
                isLogo = true;
            }

            if (isLogo) result.push({ whole, content });
        }
        return result;
    }

    function removeTopLogoBlocks(text) {
        let t = text;
        const maxScan = 1200;

        // первый [center]...[/center] в начале поста
        const firstPart = t.slice(0, maxScan);
        const centerRegex = /\[center][\s\S]*?\[\/center]/i;
        const cm = centerRegex.exec(firstPart);
        if (cm && cm.index !== undefined && cm.index < 400) {
            t = t.replace(cm[0], '');
        }

        // любые [attachment]-картинки до первого [spoiler]
        const firstSpoilerIndex = t.search(/\[spoiler(?:=|])/i);
        const headerEnd = firstSpoilerIndex === -1 ? Math.min(maxScan, t.length) : Math.min(firstSpoilerIndex, maxScan);
        const headerPart = t.slice(0, headerEnd);
        let changed = false;
        const newHeader = headerPart.replace(/\[attachment[^\]]*?\.(?:png|jpe?g|gif|webp)[^\]]*]/gi, () => {
            changed = true;
            return '';
        });
        if (changed) {
            t = newHeader + t.slice(headerEnd);
        }

        return t;
    }

    // ---------- Вытаскиваем имена файлов из текста ----------

    function extractAttachmentNames(text) {
        const names = new Set();
        const regex = /\[attachment[^\]]*?["']?([^"'\]]+?\.(?:png|jpe?g|gif|webp))["']?]/gi;
        let m;
        while ((m = regex.exec(text)) !== null) {
            const full = m[1];
            const parts = full.split(':');
            const fileName = (parts.length > 1 ? parts[1] : parts[0]).toLowerCase().trim();
            if (fileName) names.add(fileName);
        }
        return Array.from(names);
    }

    function getRemovedAttachmentNames(originalText, cleanedText) {
        const before = extractAttachmentNames(originalText);
        const after = extractAttachmentNames(cleanedText);
        const afterSet = new Set(after);
        const removed = before.filter(n => !afterSet.has(n));
        if (removed.length) {
            console.log('Logo Replacer: attachments removed from text:', removed);
        }
        return removed;
    }

    // ---------- Удаляем логотипы из текста ----------

    function removeAllLogoReferences(text) {
        if (!text) return text;

        let result = text;

        // все "логотипные" спойлеры
        const spoilers = getLogoSpoilers(text);
        spoilers.forEach(sp => {
            result = result.replace(sp.whole, '');
        });

        // одиночные центровые логотипы
        const extraPatterns = [
            /\[center]\s*\[(?:img|attachment)[^\]]*logo[^\]]*]\s*\[\/center]/gi,
            /\[center]\s*\[(?:img|attachment)[^\]]*]\s*\[\/center]/gi,
            /\[(?:img|attachment)][^\]]*logo[^\]]*\[\/(?:img|attachment)]/gi,
            /\[attachment[^\]]*logo[^\]]*]/gi
        ];
        extraPatterns.forEach(p => {
            result = result.replace(p, '');
        });

        // верхний логотип без спойлера
        result = removeTopLogoBlocks(result);

        result = result.replace(/\n\s*\n\s*\n/g, '\n\n');
        result = result.replace(/(\r?\n){3,}/g, '\n\n');
        return result.trim();
    }

    // ---------- Удаление вложений из блока "Файлы" ----------

    function removeLogoAttachmentsFromForm(attachmentNames) {
        if (!attachmentNames || !attachmentNames.length) return;
        const names = attachmentNames.map(n => n.toLowerCase());

        const buttons = document.querySelectorAll(
            'button[data-forum-attach-action="delete"], button.attach-delete, .attach-delete button'
        );
        if (!buttons.length) {
            console.log('Logo Replacer: no delete buttons found');
            return;
        }

        buttons.forEach(btn => {
            let node = btn;
            let depth = 0;
            let matched = false;
            while (node && depth < 4 && !matched) {
                const text = (node.textContent || '').toLowerCase();
                if (names.some(name => text.includes(name))) {
                    btn.click();
                    console.log('Logo Replacer: attachment deleted near button, text:', text.trim().slice(0, 120));
                    matched = true;
                    break;
                }
                node = node.parentElement;
                depth++;
            }
        });
    }

    // ---------- Вставка нового логотипа ----------

    function insertLogo(logoUrl, logoName) {
        const bbcode = `[center][img]${logoUrl}[/img][/center]`;

        let textarea = document.querySelector('textarea[name="Post"]')
            || document.querySelector('#Post, textarea[id*="post"], textarea[class*="editor"]');

        if (!textarea) {
            const allTextareas = document.querySelectorAll('textarea');
            for (let ta of allTextareas) {
                if (ta.offsetWidth > 300 && ta.offsetHeight > 100) {
                    textarea = ta;
                    break;
                }
            }
        }

        if (!textarea) {
            alert('Не найдено поле для ввода текста! Откройте редактор поста.');
            return;
        }

        const originalText = textarea.value;

        // 1. Чистим старые логотипы
        const cleanedText = removeAllLogoReferences(originalText);

        // 2. Определяем, какие вложения реально исчезли из текста
        const removedAttachmentNames = getRemovedAttachmentNames(originalText, cleanedText);

        // 3. Вставляем новый логотип в начало
        textarea.value = bbcode + '\n\n' + cleanedText;
        textarea.scrollTop = 0;
        textarea.focus();

        showNotification(`✅ Логотип "${logoName}" добавлен!`);

        // 4. Причина редактирования
        const reasonInput = document.querySelector('input[name="post_edit_reason"], input[name="EditReason"]');
        if (reasonInput && !reasonInput.value.includes('Логотип 200х200')) {
            reasonInput.value = (reasonInput.value ? reasonInput.value + '; ' : '') + 'Правила раздела п.3.8';
        }

        // 5. Удаляем вложения, которые были убраны из текста
        removeLogoAttachmentsFromForm(removedAttachmentNames);
    }

    // ---------- Уведомление ----------

    function showNotification(message) {
        document.querySelectorAll('.logo-replacer-notification').forEach(n => n.remove());

        const notification = document.createElement('div');
        notification.className = 'logo-replacer-notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #4a6782;
            color: white;
            padding: 12px 24px;
            border-radius: 6px;
            z-index: 10000;
            font-family: Arial, sans-serif;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            text-align: center;
            max-width: 400px;
            line-height: 1.4;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => notification.remove(), 5000);
    }

    // ---------- Инициализация ----------

    function init() {
        setTimeout(addLogoButton, 1000);
        setTimeout(addLogoButton, 3000);
        setTimeout(addLogoButton, 5000);

        const observer = new MutationObserver(() => {
            setTimeout(addLogoButton, 500);
        });

        observer.observe(document.body, { childList: true, subtree: true });
        setInterval(addLogoButton, 5000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();