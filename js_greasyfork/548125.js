// ==UserScript==
// @name         手機版網址重新導向到電腦版
// @name:en      Mobile to Desktop URL Redirect
// @name:ja      モバイル版URLからデスクトップ版へのリダイレクト
// @name:de      Umleitung von Mobil-URL zur Desktop-Version
// @name:uk      Перенаправлення URL з мобільної на десктопну версію
// @description  當載入手機版網頁時，若電腦版存在，則自動重新導向到電腦版網址。
// @description:en When a mobile webpage is loaded, automatically redirects to the desktop version if it exists.
// @description:ja モバイル版ウェブページが読み込まれた際、デスクトップ版が存在する場合、自動的にデスクトップ版のURLにリダイレクトします。
// @description:de Wenn eine mobile Webseite geladen wird, wird automatisch zur Desktop-Version umgeleitet, falls diese existiert.
// @description:uk Коли завантажується мобільна веб-сторінка, автоматично перенаправляє на десктопну версію, якщо вона існує。
//
// @author       Max
// @namespace    https://github.com/Max46656
// @license      MPL2.0
//
// @version      1.4.1
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-start
// @icon         https://cdn-icons-png.flaticon.com/512/3559/3559356.png
// @downloadURL https://update.greasyfork.org/scripts/548125/%E6%89%8B%E6%A9%9F%E7%89%88%E7%B6%B2%E5%9D%80%E9%87%8D%E6%96%B0%E5%B0%8E%E5%90%91%E5%88%B0%E9%9B%BB%E8%85%A6%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/548125/%E6%89%8B%E6%A9%9F%E7%89%88%E7%B6%B2%E5%9D%80%E9%87%8D%E6%96%B0%E5%B0%8E%E5%90%91%E5%88%B0%E9%9B%BB%E8%85%A6%E7%89%88.meta.js
// ==/UserScript==
// @icon from Smashicons

class DesktopSwitcher {
    constructor() {
        this.url = window.location.href;
        this.hostname = window.location.hostname;
        this.blacklist = Array.isArray(GM_getValue("blacklist", [])) ? GM_getValue("blacklist", []) : [];
        this.customRules = GM_getValue("customRules", {});
        this.mobilePatterns = [
            { regex: /:\/\/m\./, replace: "://" },
            { regex: /\/m\//, replace: "/" },
            { regex: /\.mobile\./, replace: "." },
            { regex: /\/mobile\//, replace: "/" },
            { regex: /\.wap\./, replace: "." },
            { regex: /\?view=mobile(&|$)/, replace: "?" },
            { regex: /&view=mobile/, replace: "" },
            { regex: /\?device=mobile(&|$)/, replace: "?" },
            { regex: /&device=mobile/, replace: "" },
        ];

        this.registerMenu();
        this.switch2Desktop();
    }

    registerMenu() {
        GM_registerMenuCommand(`⭘ 加入黑名單：${this.hostname}`, () => this.addBlacklist());
        GM_registerMenuCommand(`✕ 從黑名單移除：${this.hostname}`, () => this.removeBlacklist());
        GM_registerMenuCommand("？ 檢視黑名單", () => this.showBlacklist());
        GM_registerMenuCommand(`⭘ 新增自訂規則：${this.hostname}`, () => this.addCustomRule());
        GM_registerMenuCommand(`✎ 修改自訂規則：${this.hostname}`, () => this.updateCustomRule());
        GM_registerMenuCommand(`✕ 刪除自訂規則：${this.hostname}`, () => this.removeCustomRule());
        GM_registerMenuCommand("？ 檢視自訂規則", () => this.showCustomRules());
    }

    addCustomRule() {
        if (this.customRules[this.hostname]) {
            console.error(`規則已存在，請使用「修改自訂規則」進行更新。`);
            return;
        }
        const matchString = prompt(`為 ${this.hostname} 輸入自訂字串 (例如 /m.):`);
        const replaceString = prompt(`輸入替換字串 (例如 /):`);
        if (matchString && replaceString) {
            try {
                this.customRules[this.hostname] = { match: matchString, replace: replaceString };
                GM_setValue("customRules", this.customRules);
                console.log(`已為 ${this.hostname} 新增自訂規則: match=${matchString}, replace=${replaceString}`);
            } catch (error) {
                console.error(`無效的 match: ${error.message}`);
            }
        }
        window.location.reload();
    }

    showCustomRules() {
        let message = "";
        for (const [host, rule] of Object.entries(this.customRules)) {
            message += `${host}: match=${rule.match}, replace=${rule.replace}\n`;
        }
        message = message || "（空）";
        console.log(`目前自訂規則：\n${message}`);
    }

    updateCustomRule() {
        if (!this.customRules[this.hostname]) {
            console.error(`無 ${this.hostname} 的自訂規則，請先新增。`);
            return;
        }
        const currentRule = this.customRules[this.hostname];
        const matchString = prompt(`修改 match (目前: ${currentRule.match}):`, currentRule.match);
        const replaceString = prompt(`修改替換字串 (目前: ${currentRule.replace}):`, currentRule.replace);
        if (matchString && replaceString) {
            try {
                this.customRules[this.hostname] = { regex: matchString, replace: replaceString };
                GM_setValue("customRules", this.customRules);
                console.log(`已更新 ${this.hostname} 的自訂規則: match=${matchString}, replace=${replaceString}`);
            } catch (error) {
                console.error(`無效的 match: ${error.message}`);
            }
        }
        window.location.reload();
    }

    removeCustomRule() {
        if (!this.customRules[this.hostname]) {
            console.error(`無 ${this.hostname} 的自訂規則。`);
            return;
        }
        delete this.customRules[this.hostname];
        GM_setValue("customRules", this.customRules);
        console.log(`已刪除 ${this.hostname} 的自訂規則`);
    }

    addBlacklist() {
        this.updateBlacklist(true, this.hostname, this.getDesktopUrl());
    }

    showBlacklist() {
        const message = this.blacklist.length ? this.blacklist.join("\n") : "（空）";
        console.log(`目前黑名單：\n${message}`);
    }

    updateBlacklist(add, hostname, desktopUrl) {
        if (!desktopUrl || desktopUrl === this.url) {
            if (add && !this.blacklist.includes(hostname)) {
                this.blacklist.push(hostname);
                GM_setValue("blacklist", this.blacklist);
                console.log(`已將 ${hostname} 加入黑名單`);
            } else if (!add) {
                this.blacklist = this.blacklist.filter(domain => domain !== hostname);
                GM_setValue("blacklist", this.blacklist);
                console.log(`已將 ${hostname} 從黑名單移除`);
            } else {
                console.warn(`${hostname} 已在黑名單中`);
            }
            window.location.reload();
            return;
        }

        this.checkDesktopUrl(
            desktopUrl,
            (finalUrl, finalHostname) => {
                if (add && !this.blacklist.includes(finalHostname)) {
                    this.blacklist.push(finalHostname);
                    GM_setValue("blacklist", this.blacklist);
                    console.log(`已將 ${finalHostname} 加入黑名單`);
                } else if (!add) {
                    this.blacklist = this.blacklist.filter(domain => domain !== finalHostname);
                    GM_setValue("blacklist", this.blacklist);
                    console.log(`已將 ${finalHostname} 從黑名單移除`);
                } else {
                    console.warn(`${finalHostname} 已在黑名單中`);
                }
            },
            (errorMessage) => {
                console.error(`無法${add ? "加入" : "移除"}黑名單: ${errorMessage}`);
            }
        );
        window.location.reload();
    }

    removeBlacklist() {
        this.updateBlacklist(false, this.hostname, this.getDesktopUrl());
        window.location.reload();
    }

    checkDesktopUrl(desktopUrl, onSuccess, onFailure) {
        GM_xmlhttpRequest({
            method: "HEAD",
            url: desktopUrl,
            timeout: 3000,
            onload: (response) => {
                if (response.status >= 200 && response.status < 400) {
                    const finalUrl = response.finalUrl || desktopUrl;
                    try {
                        const urlObj = new URL(finalUrl);
                        const finalHostname = urlObj.hostname;
                        onSuccess(finalUrl, finalHostname);
                    } catch (error) {
                        console.error(`無效的 URL: ${finalUrl}, 錯誤: ${error.message}`);
                        onFailure(`無效的 URL 格式: ${finalUrl}`);
                    }
                } else {
                    console.error(`請求失敗，狀態碼: ${response.status}, URL: ${desktopUrl}`);
                    onFailure(`無法訪問電腦版，狀態碼: ${response.status}`);
                }
            },
            onerror: () => {
                console.error(`網絡錯誤，URL: ${desktopUrl}`);
                onFailure("網絡錯誤，無法完成請求");
            },
            ontimeout: () => {
                console.error(`請求超時，URL: ${desktopUrl}`);
                onFailure("請求超時，無法訪問電腦版");
            }
        });
    }

    getDesktopUrl() {
        let tempUrl = this.url;
        const customPattern = this.customRules[this.hostname];
        if (customPattern) {
            console.log(`應用自訂規則於: ${this.hostname}, regex=${customPattern.regex}`);
            try {
                tempUrl = tempUrl.replace(customPattern.regex, customPattern.replace);
                if (tempUrl !== this.url) return tempUrl;
            } catch (error) {
                console.error(`應用自訂規則失敗: ${error.message}`);
            }
        }else{
            for (const pattern of this.mobilePatterns) {
                if (pattern.regex.test(tempUrl)) {
                    console.log(`檢測到手機版模式: ${pattern.regex}`);
                    tempUrl = tempUrl.replace(pattern.regex, pattern.replace);
                }
            }
        }
        return tempUrl !== this.url ? tempUrl : null;
    }

    switch2Desktop() {
        const desktopUrl = this.getDesktopUrl();
        if (desktopUrl === null) return

        console.log(`嘗試解析 canonical tag: ${this.url}`);
        GM_xmlhttpRequest({
            method: "GET",
            url: this.url,
            timeout: 3000,
            onload: (response) => {
                if (response.status >= 200 && response.status < 400) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, "text/html");
                    const canonical = doc.querySelector('link[rel="canonical"]');
                    if (canonical && canonical.href && canonical.href !== this.url) {
                        try {
                            const canonicalHostname = new URL(canonical.href).hostname;
                            if (this.blacklist.includes(canonicalHostname)) {
                                console.warn(`阻止重新導向，黑名單域名: ${canonicalHostname}`);
                                return;
                            }
                            console.log(`找到 canonical URL: ${canonical.href}`);
                            window.location.replace(canonical.href);
                            return;
                        } catch (error) {
                            console.error(`無效的 canonical URL: ${canonical.href}, 錯誤: ${error.message}`);
                        }
                    } else {
                        console.warn(`未找到有效 canonical tag，嘗試模式符合`);
                    }
                } else {
                    console.error(`無法載入頁面內容: ${response.status}`);
                }
                tryPatternMatch();
            },
            onerror: () => {
                console.error(`網絡錯誤: ${this.url}`);
                tryPatternMatch();
            },
            ontimeout: () => {
                console.error(`請求超時: ${this.url}`);
                tryPatternMatch();
            }
        });

        const tryPatternMatch = () => {
                console.log(`嘗試切換到電腦版網址: ${desktopUrl}`);
                this.checkDesktopUrl(
                    desktopUrl,
                    (finalUrl, finalHostname) => {
                        if (this.blacklist.includes(finalHostname)) {
                            console.warn(`阻止重新導向，黑名單域名: ${finalHostname}`);
                            return;
                        }
                        console.log(`正在重新導向到電腦版: ${finalUrl}`);
                        window.location.replace(finalUrl);
                    },
                    (errorMessage) => {
                        console.error(`無法切換到電腦版: ${errorMessage}`);
                    }
                );
        };
    }

}

new DesktopSwitcher();
