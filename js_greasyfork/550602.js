// ==UserScript==
// @name         考勤自动计算
// @namespace    https://www.italent.cn/
// @version      1.5
// @description  自动计算超过6小时的平均工作时长，并弹出提示框
// @author       Meko
// @match        https://*.italent.cn/portal/convoy/attendance*
// @match        https://www.italent.cn/portal/convoy/attendance?quark_s=*
// @match        https://*.italent.cn/portal/convoy/attendance?*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/550602/%E8%80%83%E5%8B%A4%E8%87%AA%E5%8A%A8%E8%AE%A1%E7%AE%97.user.js
// @updateURL https://update.greasyfork.org/scripts/550602/%E8%80%83%E5%8B%A4%E8%87%AA%E5%8A%A8%E8%AE%A1%E7%AE%97.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 劫持 fetch 请求
    const originalFetch = window.fetch;
    window.fetch = function (url, options) {
        return originalFetch.apply(this, arguments).then(async response => {
            // 检查请求 URL 是否包含 "TableList"
            if (url.includes('TableList')) {
                try {
                    const clonedResponse = response.clone();
                    const data = await clonedResponse.json();

                    if (data.biz_data && Array.isArray(data.biz_data)) {
                        // 过滤和累积一次性完成
                        let total = 0;
                        let count = 0;

                        data.biz_data.forEach(item => {
                            if (item.WorkPeriod && item.WorkPeriod.value > 6) {
                                total += Number(item.WorkPeriod.value);
                                count++;
                            }
                        });

                        if (count > 0) {
                            const average = total / count;
                            if (average > 9.5) {
                                alert(`恭喜你！共计算 ${count} 组数据，目前平均工时为: ${average.toFixed(2)} 小时`);
                            } else {
                                const targetHours = 9.5; // 目标工时
                                const deficitHours = targetHours - average; // 缺少的工时
                                const deficitMinutes = Math.ceil(deficitHours * 60); // 转换为分钟并向上取整
                                alert(`共计算 ${count} 组数据，平均工时为: ${average.toFixed(2)} 小时。还得加油哦！\n还需要补 ${deficitMinutes} 分钟才能达到 9.5 小时。`);
                            }
                        } else {
                            //alert('没有超过6小时的工作时长记录');
                        }
                    }
                } catch (error) {
                    console.error('解析 TableList 数据出错:', error);
                }
            }

            return response;
        });
    };
})();
