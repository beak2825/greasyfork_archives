// ==UserScript==
// @name         Pixiv 圖片自適應調整
// @name:en      Pixiv Image Auto Resize
// @name:ja      Pixiv 畫像自動調整
// @name:de      Pixiv Bild automatisch anpassen
// @name:cs      Pixiv Automatické přizpůsobení obrázků
// @name:lt      Pixiv Vaizdų automatinis prisitaikymas
// @description  當Pixiv作品放大顯示時，設定其顯示方式以適應過大的圖片超出顯示範圍
// @description:en When viewing enlarged Pixiv artwork, adjust display mode to fit oversized images that exceed the screen
// @description:ja Pixiv作品を拡大表示する際、畫面からはみ出る大きすぎる畫像に適応するよう表示方式を設定
// @description:de Beim Vergrößern von Pixiv-Werken die Anzeige so anpassen, dass überdimensionale Bilder, die den Bildschirm überragen, passend dargestellt werden
// @description:cs Při zvětšeném zobrazení díla na Pixivu nastavit způsob zobrazení tak, aby se příliš velké obrázky, které přesahují obrazovku, přizpůsobily
// @description:lt Peržiūrint padidintą Pixiv kūrinį, nustatyti rodymo būdą, kad per dideli paveikslėliai, viršijantys ekraną, būtų tinkamai pritaikyti
//
// @author Max
// @namespace https://github.com/Max46656
// @supportURL https://github.com/Max46656/EverythingInGreasyFork/issues
// @license MPL2.0
//
// @version 1.0.0
// @match https://www.pixiv.net/*
// @icon https://www.google.com/s2/favicons?sz=64&domain=pixiv.net
// @grant GM_addStyle
// @grant GM_registerMenuCommand
// @grant GM_unregisterMenuCommand
// @grant GM_setValue
// @grant GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/563349/Pixiv%20%E5%9C%96%E7%89%87%E8%87%AA%E9%81%A9%E6%87%89%E8%AA%BF%E6%95%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/563349/Pixiv%20%E5%9C%96%E7%89%87%E8%87%AA%E9%81%A9%E6%87%89%E8%AA%BF%E6%95%B4.meta.js
// ==/UserScript==

class ImageResizer {
    constructor() {
        this.currentModeId = GM_getValue('img_mode_id', 'fit-window');
        this.menuId = null;
        this.observer = null;
    }

    get MODES() {
        return {
            '1': { id: 'fit-window', label: '🞎', mw: '100vw', mh: '100vh', w: 'auto', h: 'auto' },
            '2': { id: 'fit-height', label: '⭿', mw: 'none', mh: '100vh', w: 'auto', h: '100vh' },
            '3': { id: 'fit-width', label: '⭾', mw: '100%', mh: 'none', w: '99vw', h: 'auto' },
            '4': { id: 'original', label: '🞨', mw: 'none', mh: 'none', w: 'auto', h: 'auto' }
        };
    }

    applyBaseStyles() {
        GM_addStyle(`
                :root {
                    --eh-mw: none; --eh-mh: none; --eh-w: auto; --eh-h: auto;
                }
                div[role="presentation"] {
                    width: 100% !important;
                }
                div[role="presentation"] img[src^="https://i.pximg.net/img-original"] {
                    max-width: var(--eh-mw) !important;
                    max-height: var(--eh-mh) !important;
                    width: var(--eh-w) !important;
                    height: var(--eh-h) !important;
                    display: block !important;
                    margin: 0 !important;
                    flex-shrink: 0;
                }
                .eh-resizer-select {
                    margin-left: 10px;
                    padding: 0 5px;
                    background: #34353b;
                    color: #fff;
                    border: 1px solid #5c5c5c;
                    cursor: pointer;
                    font-size: 14px;
                    vertical-align: middle;
                }
            `);
            this.updateCSSVariables();
        }

    updateCSSVariables() {
        const modeConfig = Object.values(this.MODES).find(m => m.id === this.currentModeId) || this.MODES['1'];
        const root = document.documentElement;
        root.style.setProperty('--eh-mw', modeConfig.mw);
        root.style.setProperty('--eh-mh', modeConfig.mh);
        root.style.setProperty('--eh-w', modeConfig.w);
        root.style.setProperty('--eh-h', modeConfig.h);
    }

    setModeById(modeId) {
        this.currentModeId = modeId;
        GM_setValue('img_mode_id', modeId);
        this.updateCSSVariables();
        const select = document.querySelector('.eh-resizer-select');
        if (select) select.value = modeId;
        this.registerMenu();
    }

    registerMenu() {
        if (this.menuId !== null) {
            GM_unregisterMenuCommand(this.menuId);
        }
        const currentConfig = Object.values(this.MODES).find(m => m.id === this.currentModeId) || this.MODES['1'];
        const menuLabel = `Mode: [ ${currentConfig.label} ] Click to Change`;
        this.menuId = GM_registerMenuCommand(menuLabel, () => {
            let menuPrompt = "Select Mode / 切換模式 (請輸入數字):\n";
            for (const [num, config] of Object.entries(this.MODES)) {
                const marker = (config.id === this.currentModeId) ? " ▶ " : "   ";
                menuPrompt += `${num}. ${marker}${config.label} (${config.id})\n`;
            }
            const choice = prompt(menuPrompt, "");
            if (choice && this.MODES[choice]) {
                this.setModeById(this.MODES[choice].id);
            }
        });
    }

    async injectUI() {
        if (!this.isArtworkPage()) return;
        const container = await this.waitForElement("section div div div section");
        if (!container) return;

        if (document.querySelector(".eh-resizer-select")) return;

        const select = document.createElement('select');
        select.className = 'eh-resizer-select';
        Object.values(this.MODES).forEach(config => {
            const opt = document.createElement('option');
            opt.value = config.id;
            opt.textContent = config.label;
            if (config.id === this.currentModeId) opt.selected = true;
            select.appendChild(opt);
        });

        select.addEventListener('change', (e) => this.setModeById(e.target.value));
        container.appendChild(select);
    }

    isArtworkPage() {
        return /^https:\/\/www\.pixiv\.net\/artworks\/\d+/.test(location.href);
    }

    async waitForElement(selector, timeout = 15000, interval = 500) {
        const start = Date.now();
        while (Date.now() - start < timeout) {
            const el = document.querySelector(selector);
            if (el) return el;
            await new Promise(r => setTimeout(r, interval));
        }
        return null;
    }

    startObserving() {
        if (this.observer) return;

        this.observer = new MutationObserver(() => {
            if (this.isArtworkPage()) {
                this.injectUI();
            }
        });

        this.observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    init() {
        this.applyBaseStyles();
        this.registerMenu();

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.injectUI();
                this.startObserving();
            });
        } else {
            this.injectUI();
            this.startObserving();
        }
    }
}

const resizer = new ImageResizer();
resizer.init();
