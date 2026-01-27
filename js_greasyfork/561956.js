// ==UserScript==
// @name         E-Hentai 圖片自適應調整
// @name:en      E-Hentai Image Auto Resize
// @name:ja      E-Hentai 畫像自動調整
// @name:de      E-Hentai Bild automatisch anpassen
// @name:cs      E-Hentai Automatické přizpůsobení obrázků
// @name:lt      E-Hentai Vaizdų automatinis prisitaikymas
// @description         可將 E-Hentai / ExHentai 的圖片大小更改為適合視窗/適合高度/適合寬度與原始大小4種模式
// @description:en      Allows changing E-Hentai / ExHentai image size to 4 modes: Fit Window / Fit Height / Fit Width / Original Size
// @description:ja      E-Hentai / ExHentai の画像サイズを「ウィンドウに合わせる」「高さに合わせる」「幅に合わせる」「オリジナルサイズ」の4モードに変更可能
// @description:de      Ermöglicht das Ändern der Bildgröße bei E-Hentai / ExHentai in 4 Modi: An Fenster anpassen / An Höhe anpassen / An Breite anpassen / Originalgröße
// @description:cs      Umožňuje změnit velikost obrázků na E-Hentai / ExHentai do 4 režimů: Přizpůsobit oknu / Přizpůsobit výšce / Přizpůsobit šířce / Původní velikost
// @description:lt      Leidžia keisti E-Hentai / ExHentai paveikslėlių dydį į 4 režimus: Tinkinti langui / Tinkinti aukščiui / Tinkinti pločiui / Originalus dydis
// @description:uk      Дозволяє змінювати розмір зображень E-Hentai / ExHentai на 4 режими: Підігнати під вікно / Підігнати під висоту / Підігнати під ширину / Оригінальний розмір
//
// @author       Max
// @namespace    https://github.com/Max46656
// @supportURL   https://github.com/Max46656/EverythingInGreasyFork/issues
// @license      MPL2.0
//
// @version      1.5.2
// @match        https://exhentai.org/s/*/*
// @match        https://e-hentai.org/s/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=e-hentai.org
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/561956/E-Hentai%20Image%20Auto%20Resize.user.js
// @updateURL https://update.greasyfork.org/scripts/561956/E-Hentai%20Image%20Auto%20Resize.meta.js
// ==/UserScript==

class ImageResizer {
    constructor() {
        this.currentModeId = GM_getValue('img_mode_id', 'fit-window');
        this.menuId = null;
    }

    get MODES() {
        return {
            '1': { id: 'fit-window', label: '🞎', mw: '100vw', mh: '100vh', w: 'auto', h: 'auto' },
            '2': { id: 'fit-height', label: '⭿',  mw: 'none',  mh: '100vh', w: 'auto', h: '100vh' },
            '3': { id: 'fit-width',  label: '⭾',  mw: '100%', mh: 'none',   w: '100vw', h: 'auto' },
            '4': { id: 'original',   label: '🞨',  mw: 'none',  mh: 'none',   w: 'auto', h: 'auto' }
        };
    }

    applyBaseStyles() {
        GM_addStyle(`
            :root {
                --eh-mw: none; --eh-mh: none; --eh-w: auto; --eh-h: auto;
            }

            #i1 {
                width: 100% !important;
            }

            #img {
                max-width: var(--eh-mw) !important;
                max-height: var(--eh-mh) !important;
                width: var(--eh-w) !important;
                height: var(--eh-h) !important;
                display: block !important;
                margin: 0 auto !important;
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
            let menuPrompt = "Select Mode / 切換模式 (Enter Number):\n";
            for (const [num, config] of Object.entries(this.MODES)) {
                const activeMarker = (config.id === this.currentModeId) ? " ▶ " : "    ";
                menuPrompt += `${num}.${activeMarker}${config.label} (${config.id})\n`;
            }

            const choice = prompt(menuPrompt, "");
            if (choice && this.MODES[choice]) {
                this.setModeById(this.MODES[choice].id);
            }
        });
    }

    injectUI() {
        const target = document.querySelector('.sn');
        if (!target) return;

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
        target.appendChild(select);
    }

    init() {
        this.applyBaseStyles();
        this.registerMenu();

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.injectUI());
        } else {
            this.injectUI();
        }
    }
}

const resizer = new ImageResizer();
resizer.init();
