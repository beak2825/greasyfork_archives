// ==UserScript==
// @name         E-Hentai 圖片自適應調整
// @name:en      E-Hentai Image Auto Resize
// @name:ja      E-Hentai 畫像自動調整
// @name:de      E-Hentai Bild automatisch anpassen
// @name:cs      E-Hentai Automatické přizpůsobení obrázků
// @name:lt      E-Hentai Vaizdų automatinis prisitaikymas
// @description  自動調整畫廊圖片使其適應螢幕大小
// @description:en Automatically resize gallery images to fit the screen size while preserving aspect ratio
// @description:ja ギャラリー画像を自動調整して画面サイズに適応させる
// @description:de Automatische Anpassung der Galeriebilder an die Bildschirmgröße
// @description:cs Automaticky upravit obrázky galerie tak, aby se přizpůsobily velikosti obrazovky
// @description:lt Automatiškai pritaikyti galerijos vaizdus prie ekrano dydžio
//
// @author       Max
// @namespace    https://github.com/Max46656
// @supportURL   https://github.com/Max46656/EverythingInGreasyFork/issues
// @license      MPL2.0
//
// @version      1.0.0
// @match        https://exhentai.org/s/*/*
// @match        https://e-hentai.org/s/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=e-hentai.org
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/561956/E-Hentai%20Image%20Auto%20Resize.user.js
// @updateURL https://update.greasyfork.org/scripts/561956/E-Hentai%20Image%20Auto%20Resize.meta.js
// ==/UserScript==

class ImageResizer {
    constructor() {
        this.screenHeight = window.screen.height;
    }

    applyStyles() {
        GM_addStyle(`
                #img {
                    height: ${this.screenHeight}px !important;
                    width: auto !important;
                    max-width: 100% !important;
                    object-fit: contain !important;
                    object-position: center !important;
                }
            `);
        }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.applyStyles());
        } else {
            this.applyStyles();
        }
    }
}

const resizer = new ImageResizer();
resizer.init();