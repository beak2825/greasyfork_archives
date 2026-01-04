// ==UserScript==
// @name         [牛牛] Milkonomy 计算器
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  从 Milkonomy 中复制内容，生成单子所需的原料
// @author       jxxzs
// @match        https://www.milkywayidle.com/game*
// @run-at       document-idle
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/550947/%5B%E7%89%9B%E7%89%9B%5D%20Milkonomy%20%E8%AE%A1%E7%AE%97%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/550947/%5B%E7%89%9B%E7%89%9B%5D%20Milkonomy%20%E8%AE%A1%E7%AE%97%E5%99%A8.meta.js
// ==/UserScript==

(async () => {

    // 数字转换函数
    function ParseCount(str) {
        str = str.trim();
        let num = parseFloat(str.replace(/[^0-9.]/g, '')) || 0;
        if (str.includes('B')) return num * 1_000_000_000;
        if (str.includes('M')) return num * 1_000_000;
        if (str.includes('K')) return num * 1_000;
        return num;
    }

    // 获取指定物品的数量
    function GetItemCountByName(name) {
        const $svg = $('div.Inventory_inventory__17CH2')
            .find(`svg[aria-label='${name}']`).first();
        return $svg.length
            ? ParseCount($svg.closest('div.Item_item__2De2O')
                .find('div.Item_count__1HVvv')
                .text())
            : 0;
    }

    // 剪贴板转换函数
    function ParseItems(inputText) {
        if (!inputText || !inputText.trim()) return null;

        const lines = inputText
            .split(/\r?\n/)
            .map(l => l.trim())
            .filter(Boolean);

        // 使用正则检查每个物品块的格式
        const validFourLine = /^.+\n\d+(\.\d+)?个\n¥?[\d,]+(\.\d+)?\n[\d,]+(\.\d+)?\s*\/\s*h$/;
        const validThreeLine = /^.+\n¥?[\d,]+(\.\d+)?\n[\d,]+(\.\d+)?\s*\/\s*h$/;
        // 将行合并成每个物品块
        let i = 0;
        while (i < lines.length) {
            if (/\d+(\.\d+)?个/.test(lines[i + 1])) {
                // 四行格式
                const block = lines.slice(i, i + 4).join('\n');
                if (!validFourLine.test(block)) return null;
                i += 4;
            } else {
                // 三行格式
                const block = lines.slice(i, i + 3).join('\n');
                if (!validThreeLine.test(block)) return null;
                i += 3;
            }
        }

        const items = [];
        for (let i = 0; i < lines.length;) {
            const name = lines[i];

            let priceLine, rateLine;
            // 判断第二行是否是 "X个"
            if (/\d+(\.\d+)?个/.test(lines[i + 1])) {
                priceLine = lines[i + 2];
                rateLine = lines[i + 3];
                i += 4;
            } else {
                priceLine = lines[i + 1];
                rateLine = lines[i + 2];
                i += 3;
            }

            const price = parseFloat(priceLine.replace(/[^\d.]/g, ""));
            const rate = parseFloat(rateLine.replace(/[^\d.]/g, ""));

            const count = GetItemCountByName(name) || 0;
            items.push({ name, price, rate, count });
        }

        return items.length ? items : null; // 如果没有任何物品，也返回 null
    }

    // 等待指定元素出现
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
                        message('请刷新页面，重新加载脚本');
                    }
                }
            }, interval);
        });
    }

    // 计算最多可持续小时数
    function CalculateMaxHoursSegment(items, money) {
        const validItems = items.filter(i => i.rate > 0);
        const stock = validItems.map(i => i.count);

        // 每个物品库存支撑的时间
        const timePoints = validItems.map((i, idx) => i.rate > 0 ? i.count / i.rate : Infinity);
        // 去重并升序
        const uniqueTimes = Array.from(new Set(timePoints)).sort((a, b) => a - b);

        let hours = 0;
        let prevTime = 0;

        for (let t of uniqueTimes) {
            const dt = t - prevTime; // 当前段长度
            if (dt <= 0) continue;

            // 计算这一段金币需求
            let neededCoins = 0;
            for (let i = 0; i < validItems.length; i++) {
                const item = validItems[i];
                const consume = dt * item.rate;
                if (stock[i] >= consume) {
                    stock[i] -= consume; // 用库存
                } else {
                    neededCoins += (consume - stock[i]) * item.price;
                    stock[i] = 0; // 库存耗尽
                }
            }

            if (neededCoins > money) {
                // 金币不足，按比例计算剩余小时
                hours += dt * (money / neededCoins);
                return hours;
            }

            money -= neededCoins;
            hours += dt;
            prevTime = t;
        }

        // 如果金币还够，剩余时间可无限制用库存或金币（可以返回 Infinity 或继续按速率计算）
        // 为了现实，这里再计算一小时消耗金币
        const totalRatePrice = validItems.reduce((sum, i) => sum + i.rate * i.price, 0);
        if (totalRatePrice > 0) {
            hours += money / totalRatePrice;
        }

        return hours;
    }

    // 根据想做的小时数计算每个物品需要购买的数量
    function CalculatePurchase(items, desiredHours) {
        if (!Array.isArray(items) || items.length === 0) return [];

        return items.map(item => {
            const required = desiredHours * item.rate; // 总消耗量
            const needToBuy = Math.max(0, required - item.count); // 减去现有库存
            return { name: item.name, quantity: Math.floor(needToBuy) };
        });
    }

    // 创建 Message 的窗口
    function CreateMessageMenu() {
        // 创建 alert 菜单
        const $alert = $('<div id="MessageMenu">').css({
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            zIndex: 99999,
            backgroundColor: '#00000099',
            cursor: 'pointer'
        });
        $('body').append($alert);
    }

    // 提示信息
    function message(msg) {
        // console.log(`[右键删除] ${msg}`);
        const $div = $('<div>')
            .css({
                backgroundColor: '#000000dd',
                color: '#ffffffff'
            })
            .text(`[右键删除] ${msg}`);
        $('#MessageMenu').append($div);
        $div.on('contextmenu', (e) => {
            e.preventDefault();
            $div.remove();
        });
    }

    // 等待页面加载完毕
    await WaitForElement('div.NavigationBar_navigationLinks__1XSSb');

    // 创建 Message 的窗口
    CreateMessageMenu();

    // 修改光标
    const style = document.createElement('style');
    style.textContent = `
        div.Header_logoContainer__1sCnZ:hover {
            cursor: zoom-in;
        }
    `;
    document.head.appendChild(style);

    // 按钮点击返回值
    $('div.Header_logoContainer__1sCnZ').click(async () => {
        const text = await navigator.clipboard.readText()
        const items = ParseItems(text);
        if (items === null) { alert('请检查剪贴板格式是否正确，现在是\n\n' + text); return; }
        const money = GetItemCountByName('金币');
        const maxTime = CalculateMaxHoursSegment(items, money);
        const value = prompt("想做的数量（默认为最大数量）：", maxTime.toFixed(2));
        if (value === null) { return; }
        const desiredHours = parseFloat(value);
        if (isNaN(desiredHours) || desiredHours <= 0 || desiredHours > maxTime) { alert("请输入有效数字"); return; }
        const result = CalculatePurchase(items, desiredHours);
        result.forEach((item, index) => {
            message(`${item.name}: ${item.quantity}`);
        });
    });
})();
