// ==UserScript==
// @name Kemono/Coomer grid layout for post
// @name:zh-TW Kemono/Coomer 貼文網格佈局
// @name:ja Kemono/Coomer 投稿グリッドレイアウト
// @name:en Kemono/Coomer grid layout for post
// @name:de Kemono/Coomer Raster-Layout für Beiträge
// @name:es Diseño en cuadrícula para publicaciones de Kemono/Coomer
// @description 將文章中的圖片改為網格顯示，並提供幻燈片檢視
// @description:zh-TW 將貼文內的圖片改為網格排列，並提供全螢幕幻燈片檢視功能
// @description:ja 投稿内の画像をグリッド表示に変更し、全画面スライドショー閲覧機能を追加します
// @description:en Changes images in posts to a clean grid layout and adds fullscreen slideshow viewing
// @description:de Ändert Bilder in Beiträgen in ein übersichtliches Raster-Layout und fügt Vollbild-Diashow hinzu
// @description:es Cambia las imágenes de las publicaciones a un diseño en cuadrícula limpio y añade modo presentación a pantalla completa
//
// @version 1.0.12
// @match https://kemono.cr/*/user/*/post/*
// @match https://coomer.st/*/user/*/post/*
// @grant GM_addStyle
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_getValues
// @grant GM_registerMenuCommand
//
// @author Max
// @namespace https://github.com/Max46656
// @license MPL2.0
// @downloadURL https://update.greasyfork.org/scripts/557130/KemonoCoomer%20grid%20layout%20for%20post.user.js
// @updateURL https://update.greasyfork.org/scripts/557130/KemonoCoomer%20grid%20layout%20for%20post.meta.js
// ==/UserScript==

class ImageGridEnhancer {
    constructor() {
        this.settings = {
            gridColumns: GM_getValue("gridColumns", 3),
            slideshowSize: GM_getValue("slideshowSize", "large"),
            autoSlideshow: GM_getValue("autoSlideshow", false)
        };
        this.images = [];
        this.container = null;
        this.fullScreenContainer = null;
        this.currentIndex = 0;
        this.observeDOM();
        this.tidyUpPostImage();
        GM_registerMenuCommand("圖片網格設定", () => this.openSettingsPanel(), "G");
    }

    async tidyUpPostImage() {
        try{
            const postFiles = await this.waitForElement("div.post__files");
            const hadGrid = postFiles.classList.contains("image__grid");
            if (hadGrid && postFiles.style.gridTemplateColumns === `repeat(${GM_getValue("gridColumns")}, 1fr)`) return;
            this.container = postFiles;
            const divs = postFiles.querySelectorAll("div");
            if (divs.length === 0) return;
            this.container.style.position = "relative";
            this.container.style.padding = "12px 12px 8px";
            if (!hadGrid) {
                postFiles.classList.add("image__grid");
            }
            postFiles.innerHTML = "";
            postFiles.style.display = "grid";
            postFiles.style.gridTemplateColumns = `repeat(${this.settings.gridColumns}, 1fr)`;
            postFiles.style.gap = "10px";
            postFiles.style.marginTop = "8px";
            divs.forEach((div, index) => {
                const img = div.querySelector("img");
                if(!img) return;
                div.style.cssText = "";
                Object.assign(div.style, {
                    margin: "0",
                    overflow: "hidden",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
                    cursor: this.settings.autoSlideshow ? "zoom-in" : "pointer",
                    transition: "transform 0.2s ease, box-shadow 0.3s ease"
                });
                Object.assign(img.style, {
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                    transition: "transform 0.35s ease"
                });
                div.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (this.settings.autoSlideshow) {
                        this.openSlideshow(index);
                    }
                };
                postFiles.appendChild(div);
            });
            this.createSlideshowButton();
            this.deleteEmptyContainer();
        }catch(e){console.error(e)}
    }

    createSlideshowButton() {
        if (document.getElementById("gridBtn")) return;

        const btn = document.createElement("button");
        btn.id = "gridBtn";
        btn.textContent = "幻燈片模式";
        btn.title = "全螢幕幻燈片模式";

        btn.onclick = () => this.openSlideshow();

        Object.assign(btn.style, {
            position: "fixed",
            bottom: "20px",
            right: "20px",
            zIndex: "99999",
            padding: "6px 10px",
            backgroundColor: "#282a2e",
            color: "#e8a17d",
            border: "2px solid #3b3e44",
            borderRadius: "12px",
            cursor: "pointer",
            fontSize: "15px",
            fontWeight: "bold",
            boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
            transition: "all 0.3s ease",
            userSelect: "none",
            backdropFilter: "blur(10px)"
        });

        document.body.appendChild(btn);
    }

    deleteEmptyContainer(){
        const container = document.querySelectorAll("div.post__files div");
        let count = 0;
        container.forEach((div)=>{
            if(div.querySelectorAll("img").length === 0) {
                div.remove();
                count++;
            }
        });
        if(count > 0) console.log(`已刪除${count}個空div`);
    }

    openSlideshow(startIndex = 0) {
        const thumbnails = Array.from(
            document.querySelectorAll("div.post__files div")
        );

        if (thumbnails.length === 0) return;

        this.currentIndex = Math.max(0, Math.min(startIndex, thumbnails.length - 1));

        const imageUrls = thumbnails.map(thumb => {
            const img = thumb.querySelector("img");
            if (!img) return null;
            let src = img.parentElement.href || img.src;
            if (src && !src.startsWith("http")) {
                src = new URL(src, location.origin).href;
            }
            return src;
        }).filter(Boolean);

        if (imageUrls.length === 0) return;

        if (!this.fullScreenContainer) {
            this.fullScreenContainer = document.createElement("div");
            this.fullScreenContainer.id = "full__slideshow__container";
            Object.assign(this.fullScreenContainer.style, {
                position: "fixed",
                top: "0", left: "0",
                width: "100%", height: "100%",
                background: "rgba(0,0,0,0.97)",
                zIndex: "99999",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column"
            });
            document.body.appendChild(this.fullScreenContainer);
        }

        const sizes = { small: "60%", medium: "80%", large: "100%" };

        this.fullScreenContainer.innerHTML = `
        <div id="closeSlide" style="position:absolute;top:20px;right:30px;font-size:52px;color:#fff;
            cursor:pointer;width:70px;height:70px;line-height:70px;text-align:center;
            background:rgba(255,255,255,0.12);border-radius:50%;backdrop-filter:blur(12px);
            user-select:none;">
            ✕
        </div>
        <img src="${imageUrls[this.currentIndex]}" alt="Slideshow image"
             style="max-width:${sizes[this.settings.slideshowSize]};
                    max-height:${sizes[this.settings.slideshowSize]};
                    object-fit:contain;
                    border-radius:16px;
                    box-shadow:0 20px 40px rgba(0,0,0,0.7);
                    transition:opacity 0.4s ease, transform 0.3s ease;
                    opacity:0;">
    `;

        const imgEl = this.fullScreenContainer.querySelector("img");
        imgEl.onload = () => imgEl.style.opacity = "1";

        document.getElementById("closeSlide").onclick = () => {
            this.fullScreenContainer.style.display = "none";
        };

        const switchHandler = (e) => {
            e.preventDefault();
            if (e.type === "click" || e.deltaY > 0) {
                this.currentIndex = (this.currentIndex + 1) % imageUrls.length;
            } else {
                this.currentIndex = (this.currentIndex - 1 + imageUrls.length) % imageUrls.length;
            }
            imgEl.src = imageUrls[this.currentIndex];
        };
        this.fullScreenContainer.onclick = switchHandler;
        this.fullScreenContainer.onwheel = switchHandler;

        const keyHandler = (e) => {
            if (["ArrowRight", "ArrowDown", "d", " ", "Enter"].includes(e.key)) {
                switchHandler({ type: "click", preventDefault: () => {} });
            } else if (["ArrowLeft", "ArrowUp", "a"].includes(e.key)) {
                switchHandler({ type: "wheel", deltaY: -1, preventDefault: () => {} });
            } else if (e.key === "Escape") {
                this.fullScreenContainer.style.display = "none";
            }
        };
        document.addEventListener("keydown", keyHandler);

        this.fullScreenContainer.style.display = "flex";
    }

    async waitForElement(selector, parentElement = null, interval = 100) {
        return new Promise((resolve, reject) => {
            let intervalId;
            const checkElement = () => {
                const element = parentElement !== null ? parentElement.querySelector(selector) : document.querySelector(selector);
                if (element) {
                    clearInterval(intervalId);
                    resolve(element);
                }
            };
            checkElement();
            intervalId = setInterval(checkElement, interval);
        });
    }

    nextImage() {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.updateSlide();
    }

    prevImage() {
        this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.updateSlide();
    }

    updateSlide() {
        const img = this.fullScreenContainer.querySelector("img");
        img.src = this.images[this.currentIndex];
    }

    openSettingsPanel() {
        if (document.getElementById("imgmode__settings")) return;
        const panel = document.createElement("div");
        panel.id = "imgmode__settings";
        panel.innerHTML = `
                <div style="position:fixed;top:0;left:0;width:100%;height:100%;
                            background:rgba(0,0,0,0.5);z-index:9998;" onclick="this.parentNode.remove()"></div>
                <div style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);
                            background:#fff;color:#000;padding:24px;border-radius:16px;
                            box-shadow:0 20px 40px rgba(0,0,0,0.4);z-index:9999;min-width:320px;">
                    <h3 style="margin:0 0 20px;text-align:center;">圖片顯示設定</h3>
                    <label style="display:block;margin:15px 0;">
                        網格欄數：
                        <input type="range" min="1" max="12" value="${this.settings.gridColumns}" id="colRange">
                        <b id="colNum" style="margin-left:10px;">${this.settings.gridColumns}</b> 欄
                    </label>
                    <label style="display:block;margin:15px 0;">
                        幻燈片大小：
                        <select id="sizeSel" style="width:100%;padding:8px;margin-top:8px;">
                            <option value="small">小 (60%)</option>
                            <option value="medium">中 (80%)</option>
                            <option value="large">大 (100%)</option>
                        </select>
                    </label>
                    <label style="display:block;margin:20px 0;">
                        <input type="checkbox" id="autoSlide"${this.settings.autoSlideshow ? " checked" : ""}>
                        點選小圖直接進入幻燈片
                    </label>
                    <div style="text-align:center;">
                        <button id="saveSet" style="padding:10px 24px;background:#28a745;color:white;
                                                   border:none;border-radius:8px;font-size:16px;cursor:pointer;">
                            儲存並套用
                        </button>
                    </div>
                </div>
            `;
        document.body.appendChild(panel);
        document.getElementById("sizeSel").value = this.settings.slideshowSize;
        const range = document.getElementById("colRange");
        const num = document.getElementById("colNum");
        range.oninput = () => num.textContent = range.value;
        document.getElementById("saveSet").onclick = () => {
            this.settings.gridColumns = parseInt(range.value);
            this.settings.slideshowSize = document.getElementById("sizeSel").value;
            this.settings.autoSlideshow = document.getElementById("autoSlide").checked;
            GM_setValue("gridColumns", this.settings.gridColumns);
            GM_setValue("slideshowSize", this.settings.slideshowSize);
            GM_setValue("autoSlideshow", this.settings.autoSlideshow);
            //console.log(GM_getValues(["gridColumns","slideshowSize","autoSlideshow"]))
            panel.remove();
            this.tidyUpPostImage();
        };
    }

    observeDOM() {
        const observer = new MutationObserver(() => {
            const postFiles = document.querySelector("div.post__files");
            if (postFiles && !postFiles.dataset.gridProcessed) {
                this.tidyUpPostImage();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }
}

new ImageGridEnhancer();
GM_addStyle(`
    .image-grid img:hover { transform:scale(1.06); }
    #full-slideshow-container img { transition: all 0.4s ease; }
    button:hover { filter: brightness(1.15); }
`);
