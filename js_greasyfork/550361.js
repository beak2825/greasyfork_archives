// ==UserScript==
// @name         更好的商店界面
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  将相同报价的单子合并到一起，如果中间有自己的单子，则从该处隔开
// @author       jxxzs
// @match        https://www.milkywayidle.com/game*
// @grant        none
// @run-at       document-idle
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/550361/%E6%9B%B4%E5%A5%BD%E7%9A%84%E5%95%86%E5%BA%97%E7%95%8C%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/550361/%E6%9B%B4%E5%A5%BD%E7%9A%84%E5%95%86%E5%BA%97%E7%95%8C%E9%9D%A2.meta.js
// ==/UserScript==

(async () => {
    'use strict';

    function WaitForElement(selector, $root = $(document), timeout = 30000) {
        return new Promise((resolve, reject) => {
            const interval = 100;
            let elapsed = 0;
            const timer = setInterval(() => {
                const element = $root.find(selector);
                if (element.length) {
                    clearInterval(timer);
                    resolve(element);
                } else {
                    elapsed += interval;
                    if (elapsed >= timeout) {
                        clearInterval(timer);
                        reject(new Error('元素未出现'));
                        console.warn('请刷新页面，重新加载脚本');
                    }
                }
            }, interval);
        });
    }

    // 监听 DOM 中某个元素出现，触发回调
    function OnElementAppear(selector, callback) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (!(node instanceof HTMLElement)) return;

                    if ($(node).is(selector)) {
                        requestAnimationFrame(() => callback($(node)));
                    }

                    const $matches = $(node).find(selector);
                    if ($matches.length) {
                        $matches.each((_, el) => {
                            requestAnimationFrame(() => callback($(el)));
                        });
                    }
                });
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // 把 "1.5K" "2M" "9999K" 转换成实际数字
    function ParseFormattedNumber(str) {
        str = str.trim().toUpperCase();
        const units = { "K": 1e3, "M": 1e6, "B": 1e9 };
        const match = str.match(/^([\d\.]+)([KMB]?)$/);

        if (!match) return parseFloat(str) || 0;
        let value = parseFloat(match[1]);
        let unit = match[2];

        if (unit && units[unit]) {
            value *= units[unit];
        }
        return value;
    }

    // 处理面板
    function HandlePanel($panel) {
        let lastPrice = null;
        let lastRow = null;

        $panel.find('tr').each(function () {
            const $tr = $(this);
            const $tds = $tr.find('td');

            // 第 1 个 td → count
            let countText = $tds.eq(0).clone().children().remove().end().text().trim();
            let count = ParseFormattedNumber(countText);

            // 不论合并与否，先把这一行的数量格式化
            $tds.eq(0).contents().filter(function () {
                return this.nodeType === 3; // 只修改纯文本
            }).first().replaceWith(count.toLocaleString("en-US"));

            // 判断是否是 "我的订单"
            const mineText = $tds.eq(0).find('div.MarketplacePanel_mine__3aG9I').text().trim();
            const isMine = mineText.length > 0;

            // 第 2 个 td → price
            let priceText = $tds.eq(1).find('span').first().text().trim();
            let price = ParseFormattedNumber(priceText);

            if (!isMine && lastPrice !== null && price === lastPrice) {
                // 合并逻辑：累加到上一行 count
                let prevText = lastRow.find('td').eq(0).clone().children().remove().end().text().trim();
                let prevCount = ParseFormattedNumber(prevText);

                let newCount = prevCount + count;
                lastRow.find('td').eq(0).contents().filter(function () {
                    return this.nodeType === 3;
                }).first().replaceWith(newCount.toLocaleString("en-US"));

                // 删除当前行
                $tr.remove();
            } else {
                lastPrice = price;
                lastRow = $tr;

                if (isMine) {
                    lastPrice = null;
                    lastRow = null;
                }
            }
        });
    }

    // 主逻辑
    (async () => {
        await WaitForElement('div.NavigationBar_navigationLinks__1XSSb');
        OnElementAppear('div.MarketplacePanel_orderBooksContainer__B4YE-', () => {
            const $panels = $('table.MarketplacePanel_orderBookTable__3zzrv');
            HandlePanel($panels.eq(0));
            HandlePanel($panels.eq(1));
        });
    })();
})();
