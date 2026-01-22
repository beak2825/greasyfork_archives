// ==UserScript==
// @name         Kemono Save to Eagle
// @name:zh-TW   Kemono 儲存至 Eagle
// @name:ja      Kemonoの畫像を直接Eagleに儲存
// @name:en      Kemono Save to Eagle
// @name:de      Kemono-Bilder direkt in Eagle speichern
// @name:es      Guardar imágenes de Kemono directamente en Eagle
// @description  將 Kemono 作品圖片與動圖直接存入 Eagle
// @description:zh-TW 直接將 Kemono 上的圖片與動圖儲存到 Eagle
// @description:ja Kemonoの作品畫像とアニメーションを直接Eagleに儲存します
// @description:en  Save Kemono images & animations directly into Eagle
// @description:de  Speichert Kemono-Bilder und Animationen direkt in Eagle
// @description:es  Guarda imágenes y animaciones de Kemono directamente en Eagle
//
// @version      1.4.2
// @match        https://kemono.cr/*/user/*/post/*
// @match        https://coomer.st/*/user/*/post/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kemono.cr
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM.getValue
// @grant        GM.setValue
// @require      https://greasyfork.org/scripts/2963-gif-js/code/gifjs.js?version=8596
// @run-at       document-end
//
// @author       Max
// @namespace    https://github.com/Max46656
// @license      MPL2.0
// @downloadURL https://update.greasyfork.org/scripts/552924/Kemono%E3%81%AE%E7%95%AB%E5%83%8F%E3%82%92%E7%9B%B4%E6%8E%A5Eagle%E3%81%AB%E5%84%B2%E5%AD%98.user.js
// @updateURL https://update.greasyfork.org/scripts/552924/Kemono%E3%81%AE%E7%95%AB%E5%83%8F%E3%82%92%E7%9B%B4%E6%8E%A5Eagle%E3%81%AB%E5%84%B2%E5%AD%98.meta.js
// ==/UserScript==

class EagleClient {
    async save(urlOrBase64, name, folderId = []) {
        return new Promise(resolve => {
            const data = {
                url: urlOrBase64,
                name,
                folderId: Array.isArray(folderId) ? folderId : [folderId],
                tags: [],
                website: location.href,
                headers: { referer: "https://kemono.cr/" }
            }

            GM_xmlhttpRequest({
                url: "http://localhost:41595/api/item/addFromURL",
                method: "POST",
                headers: { "Content-Type": "application/json" },
                data: JSON.stringify(data),
                onload: r => {
                    if (r.status >= 200 && r.status < 300) {
                        console.log("⭘ 已新增:", name)
                    } else {
                        console.error("失敗:", r)
                    }
                    resolve()
                },
                onerror: e => {
                    console.error(e)
                    resolve()
                },
                ontimeout: e => {
                    console.error(e)
                    resolve()
                }
            })
        })
    }

    async getFolderList() {
        return new Promise(resolve => {
            GM_xmlhttpRequest({
                url: "http://localhost:41595/api/folder/list",
                method: "GET",
                onload: res => {
                    try {
                        const folders = JSON.parse(res.responseText).data || []
                        const list = []
                        const appendFolder = (f, prefix = "") => {
                            list.push({ id: f.id, name: prefix + f.name })
                            if (f.children && f.children.length) {
                                f.children.forEach(c => appendFolder(c, "└── " + prefix))
                            }
                        }
                        folders.forEach(f => appendFolder(f))
                        resolve(list)
                    } catch (e) {
                        console.error("解析資料夾列表失敗", e)
                        resolve([])
                    }
                },
                onerror: err => {
                    console.error(err)
                    resolve([])
                }
            })
        })
    }
}

class KemonoImage {
    constructor(eagleClient) {
        this.eagle = eagleClient;
        this.images = this.fetchImages();
        this.imageSelector = "div.post__files img";
    }

    fetchImages() {
        return Array.from(document.querySelectorAll(this.imageSelector)).map((img, index) => {
            let url = img.parentElement?.href || img.src;

            if (img.dataset.src) url = img.dataset.src;
            if (img.dataset.original) url = img.dataset.original;

            let title = document.querySelector("title")?.textContent?.trim() || "Kemono Post";
            let name = `${title} P${index + 1}`;

            const urlWithoutQuery = url.split(/[#?]/)[0];
            const ext = urlWithoutQuery.split('.').pop().toLowerCase();
            if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif', 'webm'].includes(ext)) {
                name += `.${ext}`;
            }

            return { url, name };
        });
    }

    async getImageDataUrl(url) {
        if (!url.startsWith('blob:')) {
            return url;
        }

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`fetch blob 失敗：${response.status} ${response.statusText}`);
            }

            const blob = await response.blob();

            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    if (reader.result) {
                        resolve(reader.result); // data:image/...;base64,xxxx...
                    } else {
                        reject(new Error("FileReader 讀取失敗"));
                    }
                };
                reader.onerror = () => reject(new Error("FileReader 發生錯誤"));
                reader.readAsDataURL(blob);
            });
        } catch (err) {
            console.error("無法將 blob 轉為 base64:", url, err);
            return null;
        }
    }

    async handleImage(url, name, folderId) {
        const dataUrlOrOriginal = await this.getImageDataUrl(url);

        if (!dataUrlOrOriginal) {
            console.warn(`跳過無法處理的圖片：${name} (${url})`);
            return;
        }

        await this.eagle.save(dataUrlOrOriginal, name, folderId);
        console.log("已送到 Eagle:", name);
    }
}

class KemonoEagleUI {
    constructor() {
        this.eagle = new EagleClient();
        this.kemono = new KemonoImage(this.eagle);
        this.i18n = new Localization();
        this.buttonContainerSelector = "div.post__body h2:last-of-type";
        this.imageSelector = "div.post__files img";
        this.processedSelector = "eagle-folder-select";
        this.init();
    }

    async init() {
        this.registerPositionMenu()
        this.addButtons()
        await this.addFolderSelect()
        this.addDownloadAllButton()
        this.observeDomChange(() => {
            this.addButtons()
            this.kemono.images = this.kemono.fetchImages()
        })
    }

    async waitForElement(selector, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const el = document.querySelector(selector)
            if (el) return resolve(el)
            const obs = new MutationObserver(() => {
                const e = document.querySelector(selector)
                if (e) {
                    obs.disconnect()
                    resolve(e)
                }
            })
            obs.observe(document.body, { childList: true, subtree: true })
            if (timeout) {
                setTimeout(() => {
                    obs.disconnect()
                    reject(new Error("Timeout:" + selector))
                }, timeout)
            }
        })
    }

    registerPositionMenu() {
        GM_registerMenuCommand(this.i18n.get("選擇按鈕位置"), () => {
            const select = document.createElement("select");
            const options = [
                { value: "↖", text: "↖" },
                { value: "↗", text: "↗" },
                { value: "↙", text: "↙" },
                { value: "↘", text: "↘" },
                { value: "↑", text: "↑" },
                { value: "↓", text: "↓" },
                { value: "←", text: "←" },
                { value: "→", text: "→" }
            ];
            options.forEach(opt => {
                const option = document.createElement("option");
                option.value = opt.value;
                option.textContent = opt.text;
                if (opt.value === this.buttonPosition) option.selected = true;
                select.appendChild(option);
            });
            const container = document.createElement("div");
            container.style.position = "fixed";
            container.style.top = "50%";
            container.style.left = "50%";
            container.style.transform = "translate(-50%, -50%)";
            container.style.color = "black";
            container.style.backgroundColor = "white";
            container.style.padding = "20px";
            container.style.border = "1px solid #ccc";
            container.style.zIndex = "10000";
            container.style.display = "flex";
            container.style.alignItems = "center";
            container.style.gap = "10px";
            const label = document.createElement("label");
            label.textContent = this.i18n.get("選擇按鈕位置：");
            label.style.marginRight = "10px";
            const confirmButton = document.createElement("button");
            confirmButton.textContent = "⭘";
            confirmButton.style.padding = "2px 8px";
            confirmButton.style.backgroundColor = "#28a745";
            confirmButton.style.color = "white";
            confirmButton.style.border = "none";
            confirmButton.style.borderRadius = "4px";
            confirmButton.style.cursor = "pointer";
            confirmButton.style.fontSize = "14px";
            confirmButton.title = this.i18n.get("確定選擇");
            confirmButton.setAttribute("aria-label", this.i18n.get("確定按鈕位置"));
            confirmButton.onclick = async () => {
                this.buttonPosition = select.value;
                await GM.setValue("buttonPosition", this.buttonPosition);
                document.querySelectorAll("[id^=save-to-eagle-btn]").forEach(btn => btn.parentElement.remove());
                this.addButtons(this.buttonPosition);
                container.remove();
            };
            select.onchange = async () => {
                this.buttonPosition = select.value;
                await GM.setValue("buttonPosition", this.buttonPosition);
                document.querySelectorAll("[id^=save-to-eagle-btn]").forEach(btn => btn.parentElement.remove());
                this.addButtons(this.buttonPosition);
            };
            container.appendChild(label);
            container.appendChild(select);
            container.appendChild(confirmButton);
            document.body.appendChild(container);
        });
    }

    async addFolderSelect() {
        try {
            const section = await this.waitForElement(this.buttonContainerSelector);
            if (document.getElementById(this.processedSelector)) return;
            const container = document.createElement("div");
            container.style.margin = "10px 0";
            container.style.display = "flex";
            container.style.alignItems = "center";
            container.style.gap = "8px";
            const folderLabel = document.createElement("label");
            folderLabel.textContent = this.i18n.get("Eagle 資料夾：");
            folderLabel.htmlFor = this.processedSelector;
            folderLabel.style.fontSize = "14px";
            folderLabel.style.fontWeight = "500";
            folderLabel.style.color = "#FFFFFF";
            const select = document.createElement("select");
            select.id = this.processedSelector;
            select.style.padding = "5px";
            select.style.fontSize = "14px";
            const timeoutWarning = document.createElement("div");
            timeoutWarning.id = "eagle-folder-timeout-warning";
            timeoutWarning.textContent = this.i18n.get("請檢查 Eagle 程式是否正常運行、沒有當機、已開啟「瀏覽器擴充功能支援」");
            timeoutWarning.style.color = "#e8a17d";
            timeoutWarning.style.fontSize = "13px";
            timeoutWarning.style.marginTop = "8px";
            timeoutWarning.style.display = "none";
            container.appendChild(folderLabel);
            container.appendChild(select);
            //section.appendChild(container);
            //section.appendChild(timeoutWarning);
            section.after(container,timeoutWarning);
            const lastFolderId = await GM.getValue("eagle_last_folder");
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error("TIMEOUT")), 2000)
            );
            let folders;
            try {
                folders = await Promise.race([
                    this.eagle.getFolderList(),
                    timeoutPromise
                ]);
            } catch (err) {
                if (err.message === "TIMEOUT") {
                    timeoutWarning.style.display = "block";
                    folders = await this.eagle.getFolderList();
                } else {
                    throw err;
                }
            }
            folders.forEach(f => {
                const option = document.createElement("option");
                option.value = f.id;
                option.textContent = f.name;
                if (f.id === lastFolderId) option.selected = true;
                select.appendChild(option);
            });
            select.addEventListener("change", async () => {
                await GM.setValue("eagle_last_folder", select.value);
            });
        } catch (e) {
            console.error("無法新增資料夾選擇器:", e);
        }
    }

    async addDownloadAllButton() {
        try {
            const section = await this.waitForElement(this.buttonContainerSelector);
            const select = document.getElementById(this.processedSelector);
            if (!select || document.getElementById("download-all-btn")) return;
            const container = document.createElement("div");
            container.style.margin = "10px 0";
            const btn = document.createElement("button");
            btn.id = "download-all-btn";
            btn.textContent = this.i18n.get("全部儲存到 Eagle");
            btn.style.padding = "5px 10px";
            btn.style.backgroundColor = "#282a2e"
            btn.style.color = "#e8a17d"
            btn.style.border = "2px solid #3b3e44CC";
            btn.style.borderRadius = "4px";
            btn.style.cursor = "pointer";
            btn.style.fontSize = "14px";
            btn.style.marginLeft = "10px";
            btn.onclick = async () => {
                const folderId = select.value;
                await GM.setValue("eagle_last_folder", folderId);
                const images = this.kemono.images;
                for (const [index, image] of images.entries()) {
                    await this.kemono.handleImage(image.url, image.name, folderId);
                    console.log(`已儲存圖片 ${index + 1}/${images.length}`);
                }
                console.log(`⭘ 已將 ${images.length} 張圖片儲存到 Eagle`);
            };
            container.appendChild(btn);
            select.parentElement.appendChild(container);
        } catch (e) {
            console.error("無法新增全部下載按鈕:", e);
        }
    }

    async addButtons() {
        try {
            const images = await this.waitForElement(this.imageSelector);
            const select = document.getElementById(this.processedSelector);
            if (!select) return;
            const positionStyles = {
                "↖": { top: "10px", left: "10px" },
                "↗": { top: "10px", right: "10px" },
                "↙": { bottom: "10px", left: "10px" },
                "↘": { bottom: "10px", right: "10px" },
                "↑": { top: "10px", left: "50%", transform: "translateX(-50%)" },
                "↓": { bottom: "10px", left: "50%", transform: "translateX(-50%)" },
                "←": { top: "50%", left: "10px", transform: "translateY(-50%)" },
                "→": { top: "50%", right: "10px", transform: "translateY(-50%)" }
            };
            const position = await GM.getValue("buttonPosition", "↖")
            document.querySelectorAll(this.imageSelector).forEach((img, index) => {
                if (img.parentElement.querySelector(`#save-to-eagle-btn-${index}`)) return;
                const container = document.createElement("div");
                container.style.position = "absolute";
                container.style.zIndex = "1000";
                Object.assign(container.style, positionStyles[position]);
                const btn = document.createElement("button");
                btn.id = `save-to-eagle-btn-${index}`;
                btn.textContent = this.i18n.get("儲存到 Eagle");
                btn.style.padding = "5px 10px";
                btn.style.backgroundColor = "#00000080"
                btn.style.color = "#e8a17d"
                btn.style.border = "none";
                btn.style.borderRadius = "4px";
                btn.style.cursor = "pointer";
                btn.style.fontSize = "12px";
                btn.onclick = async () => {
                    let folderId = await GM.getValue("eagle_last_folder");
                    const image = this.kemono.images[index];
                    await this.kemono.handleImage(image.url, image.name, folderId);
                };
                container.appendChild(btn);
                img.parentElement.style.position = "relative";
                img.parentElement.appendChild(container);
            });
        } catch (e) {
            console.error("無法新增按鈕:", e);
        }
    }

    observeDomChange(callback) {
        const observer = new MutationObserver(() => {
            callback()
        })
        observer.observe(document.body, { childList: true, subtree: true })
    }

}

class Localization {
    constructor() {
        this.translations = {
            "Eagle 資料夾：": {
                "zh-TW": "Eagle 資料夾：",
                "ja": "Eagle フォルダー：",
                "en": "Eagle Folder:",
                "de": "Eagle Ordner:",
                "es": "Carpeta de Eagle:"
            },
            "全部儲存到 Eagle": {
                "zh-TW": "全部儲存到 Eagle",
                "ja": "すべてを Eagle に保存",
                "en": "Save All to Eagle",
                "de": "Alles in Eagle speichern",
                "es": "Guardar todo en Eagle"
            },
            "儲存到 Eagle": {
                "zh-TW": "儲存到 Eagle",
                "ja": "Eagle に保存",
                "en": "Save to Eagle",
                "de": "In Eagle speichern",
                "es": "Guardar en Eagle"
            },
            "選擇按鈕位置": {
                "zh-TW": "選擇按鈕位置",
                "ja": "ボタンの位置を選択",
                "en": "Select Button Position",
                "de": "Schaltflächenposition auswählen",
                "es": "Seleccionar posición del botón"
            },
            "選擇按鈕位置：": {
                "zh-TW": "選擇按鈕位置：",
                "ja": "ボタンの位置を選択：",
                "en": "Select button position:",
                "de": "Schaltflächenposition auswählen:",
                "es": "Seleccionar posición del botón:"
            },
            "確定選擇": {
                "zh-TW": "確定選擇",
                "ja": "選択を確定",
                "en": "Confirm Selection",
                "de": "Auswahl bestätigen",
                "es": "Confirmar selección"
            },
            "確定按鈕位置": {
                "zh-TW": "確定按鈕位置",
                "ja": "ボタン位置を確定",
                "en": "Confirm button position",
                "de": "Schaltflächenposition bestätigen",
                "es": "Confirmar posición del botón"
            },
            "請檢查 Eagle 程式是否正常運行、沒有當機、已開啟「瀏覽器擴充功能支援」": {
                "zh-TW": "✕ 請檢查 Eagle 程式是否正常運行、沒有當機、已開啟「瀏覽器擴充功能支援」",
                "ja": "✕ Eagle アプリが正常に動作しているか、クラッシュしていないか、「ブラウザ拡張機能サポート」が有効になっているかを確認してください",
                "en": "✕ Please check if the Eagle app is running normally, not crashed, and has 'Browser Extension Support' enabled",
                "de": "✕ Bitte überprüfen Sie, ob die Eagle-App normal läuft, nicht abgestürzt ist und 'Browser-Erweiterungsunterstützung' aktiviert ist",
                "es": "✕ Por favor, verifica si la aplicación Eagle está funcionando normalmente, no se ha bloqueado y tiene activado el 'Soporte para extensiones de navegador'"
            }
        };

        this.supportedLanguages = ["zh-TW", "ja", "en", "de", "es"];

        this.detectBrowserLanguage();
    }

    detectBrowserLanguage() {
        let detected;

        if (navigator.languages && navigator.languages.length > 0) {
            for (const lang of navigator.languages) {
                const normalized = this.normalizeLanguage(lang);
                if (this.supportedLanguages.includes(normalized)) {
                    detected = normalized;
                    break;
                }
            }
        } else if (navigator.language) {
            const normalized = this.normalizeLanguage(navigator.language);
            if (this.supportedLanguages.includes(normalized)) {
                detected = normalized;
            }
        }

        this.currentLanguage = detected || "zh-TW";
        console.log(`Localization: 偵測到瀏覽器語言，使用 ${this.currentLanguage}`);
    }

    normalizeLanguage(lang) {
        lang = lang.toLowerCase();

        if (lang.startsWith("zh")) {
            return "zh-TW";
        }

        const primary = lang.split("-")[0];
        return primary;
    }

    get(key) {
        const dict = this.translations[key];
        if (!dict) {
            console.warn(`缺少翻譯鍵：${key}`);
            return key;
        }
        return dict[this.currentLanguage] || dict["zh-TW"];
    }
}

new KemonoEagleUI()
