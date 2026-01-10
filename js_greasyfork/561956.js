// ==UserScript==
// @name         E-Hentai 圖片自適應調整
// @name:en      E-Hentai Image Auto Resize
// @name:ja      E-Hentai 畫像自動調整
// @name:de      E-Hentai Bild automatisch anpassen
// @name:cs      E-Hentai Automatické přizpůsobení obrázků
// @name:lt      E-Hentai Vaizdų automatinis prisitaikymas
// @description  將 E-Hentai / ExHentai 單頁圖片 #img 高度固定為螢幕高度，並在維持原圖比例的前提下盡可能填滿寬度
// @description:en Resize #img to screen height while preserving aspect ratio and maximizing width on E-Hentai/ExHentai viewer pages
// @description:ja E-Hentai/ExHentai閱覧ページで#imgを畫面高さに固定し、アスペクト比を保持したまま幅を最大化
// @description:de Passt #img an Bildschirmhöhe an, behält das Seitenverhältnis bei und maximiert die Breite auf E-Hentai/ExHentai-Seiten
// @description:cs Na stránkách prohlížeče E-Hentai/ExHentai nastaví výšku obrázku #img na výšku obrazovky, zachová poměr stran a maximalizuje šířku
// @description:lt E-Hentai/ExHentai peržiūros puslapiuose nustato #img aukštį pagal ekrano aukštį, išlaiko proporcijas ir maksimaliai išnaudoja plotį
//
// @author       Max
// @namespace    https://github.com/Max46656
// @supportURL   https://github.com/Max46656/EverythingInGreasyFork/issues
// @license      MPL2.0
//
// @version      1.1.0
// @match        https://exhentai.org/s/*/*
// @match        https://e-hentai.org/s/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=e-hentai.org
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/561956/E-Hentai%20Image%20Auto%20Resize.user.js
// @updateURL https://update.greasyfork.org/scripts/561956/E-Hentai%20Image%20Auto%20Resize.meta.js
// ==/UserScript==

class ImageResizer {
    applyStyles() {
        GM_addStyle(`
                #img {
                    max-width: 100vw !important;
                    max-height: 100vh !important;
                    width: auto !important;
                    height: auto !important;
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
