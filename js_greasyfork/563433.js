// ==UserScript==
// @name         LightLayer Refund Calculator
// @namespace    https://account.lightlayer.net/
// @version      2.6.5
// @include      https://account.lightlayer.net/syscontrol/*cmd=invoices&action=edit*
// @include      https://account.lightlayer.net/syscontrol/index.php*cmd=invoices&action=edit*
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @connect      account.lightlayer.net
// @description  在 LightLayer 发票页面计算退款金额，并显示可复制公式
// @downloadURL https://update.greasyfork.org/scripts/563433/LightLayer%20Refund%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/563433/LightLayer%20Refund%20Calculator.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function parseDateDMY(str) {
        if (!str) return null;
        const m = str.match(/(\d{2})\/(\d{2})\/(\d{4})/);
        if (!m) return null;
        return new Date(+m[3], +m[2] - 1, +m[1]);
    }

    function parseDateYMD(str) {
        if (!str) return null;
        const m = str.match(/(\d{4})-(\d{2})-(\d{2})/);
        if (!m) return null;
        return new Date(+m[1], +m[2] - 1, +m[3]);
    }

    function getTotalDaysByMonth(date) {
        const m = date.getMonth() + 1;
        if (m === 2) return 30;
        if ([1,3,5,7,8,10,12].includes(m)) return 30;
        return 29;
    }

    function getTotalDays(startDate, endDate) {
        const monthDiff = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth());
        if (monthDiff === 3) return 90; // 季度
        if (monthDiff === 6) return 180; // 半年
        if (monthDiff === 12) return 365; // 年付
        return getTotalDaysByMonth(startDate); // 默认月付逻辑
    }

    function showResult(fullText, formulaText) {
        const box = document.createElement('div');
        box.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #fff;
            border: 1px solid #ccc;
            padding: 16px;
            z-index: 10000;
            width: 480px;
            font-family: monospace;
            white-space: pre-wrap;
            user-select: text;
        `;
        box.textContent = fullText;

        const close = document.createElement('button');
        close.textContent = '关闭';
        close.style.marginTop = '10px';
        close.onclick = () => box.remove();

        const copyBtn = document.createElement('button');
        copyBtn.textContent = '复制公式';
        copyBtn.style.margin = '10px 0 0 10px';
        copyBtn.onclick = () => {
            navigator.clipboard.writeText(formulaText);
            alert('公式已复制到剪贴板');
        };

        box.appendChild(document.createElement('br'));
        box.appendChild(close);
        box.appendChild(copyBtn);
        document.body.appendChild(box);
    }

    function createButton() {
        if (document.querySelector('#refundCalcBtn')) return document.querySelector('#refundCalcBtn');
        const btn = document.createElement('button');
        btn.id = 'refundCalcBtn';
        btn.textContent = '计算退款金额';
        btn.style.cssText = `
            position: fixed;
            right: 20px;
            bottom: 40px;
            z-index: 9999;
            padding: 10px 16px;
            background: #4CAF50;
            color: #fff;
            border: none;
            border-radius: 6px;
            cursor: pointer;
        `;
        document.body.appendChild(btn);
        return btn;
    }

    function waitForElements(selectors, callback, interval = 200, timeout = 10000) {
        const start = Date.now();
        const timer = setInterval(() => {
            const els = selectors.map(s => document.querySelectorAll(s));
            if (els.every(e => e.length > 0)) {
                clearInterval(timer);
                callback(...els);
            } else if (Date.now() - start > timeout) {
                clearInterval(timer);
                console.warn('元素等待超时:', selectors);
            }
        }, interval);
    }

    function promptForDate(label, callback) {
        const dateInput = document.createElement('input');
        dateInput.type = 'date';
        dateInput.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:10001;padding:6px;font-size:14px;';
        const okBtn = document.createElement('button');
        okBtn.textContent = '确认';
        okBtn.style.cssText = 'position:fixed;top:calc(50% + 40px);left:50%;transform:translateX(-50%);z-index:10001;padding:6px 12px;font-size:14px;';
        document.body.appendChild(dateInput);
        document.body.appendChild(okBtn);

        okBtn.onclick = () => {
            if (!dateInput.value) return alert('未选择日期');
            const date = new Date(dateInput.value);
            document.body.removeChild(dateInput);
            document.body.removeChild(okBtn);
            callback(date);
        };
    }

    waitForElements(
        ['td.summary.aright', 'a.line_descr'],
        (priceEls, lineDescrEls) => {
            const priceText = priceEls[priceEls.length - 1].innerText.trim().replace(/[^0-9.-]/g, '');
            const price = parseFloat(priceText);
            if (isNaN(price)) return showResult('❌ 解析账单金额失败', '');

            const lineDescr = lineDescrEls[0];
            const accountLink = lineDescr.href;
            const descrText = lineDescr.innerText;

            const dateMatch = descrText.match(/\(?(\d{2}\/\d{2}\/\d{4}|(\d{4}-\d{2}-\d{2}))\s*[-to至]+\s*(\d{2}\/\d{2}\/\d{4}|(\d{4}-\d{2}-\d{2}))\)?/i);

            let startDate, endDate, parser;
            if (dateMatch) {
                const startStr = dateMatch[1];
                const endStr = dateMatch[3] || dateMatch[2];
                parser = startStr.includes('/') ? parseDateDMY : parseDateYMD;
                startDate = parser(startStr);
                endDate = parser(endStr);
            }

            if (!startDate || !endDate) {
                showResult('⚠️ 自动提取日期失败，请手动输入', '');
                promptForDate('起始日', (start) => {
                    promptForDate('结束日', (end) => {
                        startDate = start;
                        endDate = end;
                        proceed();
                    });
                });
                return;
            }

            const totalDays = getTotalDays(startDate, endDate);
            const btn = createButton();

            btn.onclick = () => {
                const modeSelect = document.createElement('select');
                modeSelect.innerHTML = `
                    <option value="exclusive">结束日减起始日（同日=0天）</option>
                    <option value="inclusive">含首尾日（同日=1天）</option>
                `;
                const modeBox = document.createElement('div');
                modeBox.style.cssText = 'position:fixed;top:40%;left:50%;transform:translate(-50%,-50%);z-index:10001;padding:10px;background:#fff;border:1px solid #ccc;';
                modeBox.appendChild(document.createTextNode('选择计算模式: '));
                modeBox.appendChild(modeSelect);
                const modeOk = document.createElement('button');
                modeOk.textContent = '确认';
                modeOk.style.marginLeft = '10px';
                modeOk.onclick = () => {
                    document.body.removeChild(modeBox);
                    const mode = modeSelect.value;
                    fetchRefundDate(mode);
                };
                modeBox.appendChild(modeOk);
                document.body.appendChild(modeBox);
            };

            function fetchRefundDate(mode) {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: accountLink,
                    onload(res) {
                        const match = res.responseText.match(/<td[^>]*class=["']?cancellation["']?[^>]*>[\s\S]*?<td[^>]*>\s*(\d{2}\/\d{2}\/\d{4}|\d{4}-\d{2}-\d{2})/i)
                                      || res.responseText.match(/<td[^>]*>\s*(\d{2}\/\d{2}\/\d{4}|\d{4}-\d{2}-\d{2})/i);

                        let refundDate;
                        if (match) {
                            const refundStr = match[1];
                            const refundParser = refundStr.includes('/') ? parseDateDMY : parseDateYMD;
                            refundDate = refundParser(refundStr);
                        }

                        if (!refundDate) {
                            promptForDate('退款日', (date) => {
                                refundDate = date;
                                calculate(refundDate, mode);
                            });
                            return;
                        }

                        calculate(refundDate, mode);
                    },
                    onerror() {
                        showResult('❌ 获取账户页面失败，请检查网络或登录', '');
                    }
                });
            }

            function calculate(refundDate, mode) {
                let remainDays = Math.floor((endDate - refundDate) / 86400000);
                if (mode === 'inclusive') remainDays += 1;
                remainDays = Math.max(0, remainDays);

                const perDay = price / totalDays;
                const rawRefund = perDay * remainDays;
                const refund = (Math.round(rawRefund * 100) / 100).toFixed(2);

                const modeDesc = mode === 'exclusive' ? '（不含结束日）' : '（含首尾日）';
                const formulaText = `总价 ${price} ÷ ${totalDays}天 = 单日价 ${perDay.toFixed(6)}；剩余 ${remainDays} 天${modeDesc} → 结果：$${refund}`;

                const fullText = `【退款计算结果】\n\n` +
                                 `账单金额：${price}\n` +
                                 `账单起始日：${startDate.toLocaleDateString()}\n` +
                                 `账单结束日：${endDate.toLocaleDateString()}\n` +
                                 `退款日：${refundDate.toLocaleDateString()}\n` +
                                 `计算模式：${modeDesc}\n\n` +
                                 `计算公式：\n${formulaText}\n\n` +
                                 `退款金额：$${refund}`;

                showResult(fullText, formulaText);
            }
        }
    );

})();