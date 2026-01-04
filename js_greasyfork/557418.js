// ==UserScript==
// @name                Twitch Live Auto Reload (獨立版)
// @name         Twitch 直播開始自動刷新 (獨立版)
// @version             1.1.1 
// @description         監控 Twitch 頻道頁面，偵測到直播開始後，會嘗試點擊進入直播，再備用刷新。
// @match        https://www.twitch.tv/*
// @author       程式夥伴 (基於使用者原碼修改)
// @namespace    https://greasyfork.org/users/ianias2
// @license      MPL-2.0
 
// @grant        none
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/557418/Twitch%20Live%20Auto%20Reload%20%28%E7%8D%A8%E7%AB%8B%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557418/Twitch%20Live%20Auto%20Reload%20%28%E7%8D%A8%E7%AB%8B%E7%89%88%29.meta.js
// ==/UserScript==
 
(function() {
    'use strict';

    // ====================================================================
    // ⚙️ 配置區塊 (Config)
    // ====================================================================

    const Config = {
        Dev: true, // 建議設為 true 進行除錯，確認點擊操作是否成功
        // 直播開始自動刷新的檢查間隔 (秒)。預設 3 秒檢查一次頁面。
        AutoLiveCheckInterval: 3, 
    };

    // ====================================================================
    // 🌟 LiveMonitor 核心類別 (直播狀態監控與刷新)
    // ====================================================================

    class LiveMonitor {
        constructor() {
            this.RELOAD_DELAY_SECONDS = 0; 
            
            this.TARGET_KEYWORDS = [
                "開台", 
                "正在開台", 
                "立即觀賞", 
                "正在實況"
            ];
            
            // 最終極簡修正：只檢查 URL 是否以 Twitch 域名開頭
            this.isChannelPage = window.location.href.startsWith("https://www.twitch.tv");
            
            this.timer = null;
            this.reloadTimer = null; 
        }

        /**
         * 嘗試點擊 Twitch 上的「進入直播」或「播放」按鈕。
         * @returns {boolean} 是否成功找到並點擊按鈕。
         */
        tryClickLiveButton() {
            // 尋找 Twitch 常見的直播按鈕選擇器
            const buttonSelectors = [
                // 可能是播放器中間的播放/立即觀賞按鈕 (常見的 data-a-target)
                '[data-a-target="player-play-button"]', 
                '[data-a-target="content-entry-play-button"]', 
                // 尋找包含關鍵字並可點擊的按鈕
                `//button[contains(text(), '立即觀賞')]`,
                `//button[contains(text(), '觀看直播')]`
            ];

            for (const selector of buttonSelectors) {
                let element;
                
                if (selector.startsWith('//')) {
                    // 使用 XPath 進行查找
                    element = document.evaluate(
                        selector,
                        document,
                        null,
                        XPathResult.FIRST_ORDERED_NODE_TYPE,
                        null
                    ).singleNodeValue;
                } else {
                    // 使用 CSS 選擇器進行查找
                    element = document.querySelector(selector);
                }

                if (element) {
                    if (Config.Dev) console.log(`⭐ LiveMonitor: 偵測到可點擊元素，執行點擊操作！`, element);
                    element.click();
                    return true;
                }
            }
            return false;
        }

        /**
         * 檢查頁面上是否存在目標文字，如果存在則執行點擊和刷新操作。
         */
        checkAndReloadByText() {
            if (this.reloadTimer) return false; 
            
            // 構建 XPath 的 OR 條件
            const orConditions = this.TARGET_KEYWORDS
                .map(keyword => `contains(text(), '${keyword}')`)
                .join(' or ');

            // 修正: 排除 <title> 標籤和播放器控制元件
            const excludedElements = ` and not(self::title) and not(ancestor::div[contains(@class, 'player-controls')]) and not(ancestor::div[contains(@data-a-target, 'player-control-wrapper')])`;
            
            // 最終的 XPath 表達式 (用於偵測直播通知文字)
            const xpathExpression = `//body//*[not(self::script) and not(self::style)${excludedElements} and (${orConditions})]`;
            
            const matchingElement = document.evaluate(
                xpathExpression,
                document,
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null
            ).singleNodeValue;
            
            const allKeywords = this.TARGET_KEYWORDS.join(' / ');

            if (matchingElement) { 
                // 1. 偵測成功，停止主要的監控循環
                if (this.timer) {
                    clearInterval(this.timer);
                    this.timer = null;
                }
                
                let matchedKeyword = this.TARGET_KEYWORDS.find(k => matchingElement.textContent.includes(k)) || "Unknown";
                
                if (Config.Dev) {
                    console.log(`✅ LiveMonitor: 偵測成功！關鍵字: [${matchedKeyword}]。元素:`, matchingElement);
                }

                // ⭐ 2. 嘗試點擊直播按鈕
                const clicked = this.tryClickLiveButton();

                // ⭐ 3. 設置備用刷新：無論點擊是否成功，都延遲一小段時間執行刷新
                // 這樣可以給點擊操作一個機會，如果點擊失敗，刷新作為保底
                const delayMs = clicked ? 500 : 0; // 如果點擊成功，延遲 500ms 讓頁面有時間響應

                if (Config.Dev) {
                    console.warn(`🚀 執行點擊後，將在 ${delayMs}ms 後執行備用刷新。`);
                }

                this.reloadTimer = setTimeout(() => {
                    location.reload(); 
                }, delayMs); 
                
                return true; 
            }
            if (Config.Dev) console.log(`LiveMonitor: 未偵測到任何關鍵字：${allKeywords}`);
            return false;
        }

        // run 函式保持不變
        async run() {
            if (this.timer) {
                clearInterval(this.timer);
                this.timer = null;
            }

            if (!this.isChannelPage) {
                if (Config.Dev) console.log("LiveMonitor: 不在 Twitch 網站上，停止監控。"); 
                return;
            }
            
            if (Config.Dev) console.log(`LiveMonitor: 頻道監控啟動 (全 Twitch 網站)，間隔: ${Config.AutoLiveCheckInterval}s，準備捕捉關鍵字: ${this.TARGET_KEYWORDS.join(', ')}`);

            // 3. 開始定時循環檢查文字
            this.timer = setInterval(() => {
                this.checkAndReloadByText();
            }, Config.AutoLiveCheckInterval * 1000);
        }
    }

    // ====================================================================
    // 🚀 腳本啟動
    // ====================================================================

    const liveMonitor = new LiveMonitor();
    liveMonitor.run(); 

})();