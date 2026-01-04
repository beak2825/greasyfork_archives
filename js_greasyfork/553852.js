// ==UserScript==
// @name         打印加油记录
// @namespace    refuelRecordPrint_3xLineHeight
// @version      2.2.0
// @description  打印加油记录1
// @license      MIT
// @author       Your Name
// @match        *://10.1.65.53/modules/gwyc/iolCardNew/refuelingRecord.html*oper=VIEW*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/553852/%E6%89%93%E5%8D%B0%E5%8A%A0%E6%B2%B9%E8%AE%B0%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/553852/%E6%89%93%E5%8D%B0%E5%8A%A0%E6%B2%B9%E8%AE%B0%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(() => {
        let btnContainer = document.querySelector('#btns.form_btn_area2') ||
                          document.querySelector('.flow_info_area .form_btn_area2') ||
                          document.querySelector('.flow_sign_area + .tab-pane .form-group:last-child');

        if (!btnContainer) {
            const titleArea = document.querySelector('.block_title.name');
            if (titleArea) {
                btnContainer = document.createElement('div');
                btnContainer.style.cssText = 'text-align:center; margin:15px 0;';
                titleArea.parentNode.insertBefore(btnContainer, titleArea.nextSibling);
            } else {
                console.warn('未找到默认按钮容器，在页面顶部添加打印按钮');
                btnContainer = document.body;
            }
        }

        const printBtn = document.createElement('button');
        printBtn.type = 'button';
        printBtn.className = 'btn btn-primary flow_btn';
        printBtn.style.cssText = 'margin-left:12px; padding:6px 12px; cursor:pointer;';
        printBtn.innerHTML = '<span><i class="fa fa-print"></i> 打印加油记录</span>';
        btnContainer.appendChild(printBtn);

        printBtn.addEventListener('click', function() {
            const formData = collectFormData();
            const printHtml = generate3xLineHeightContent(formData);
            openPrintWindow(printHtml);
        });

        function collectFormData() {
            const fixedData = {
                mainTitle: '加油信息',
                creUnitName: '理县气象局',
                refuelDate: '2025-07-28',
                carNo: '川UDL253',
                place: '',
                cardNo: '9130010009142703',
                cardSum: '5715.66',
                fuelAmount: '438.14',
                unitPrice: '7.43',
                fuelCharge: '58.97',
                iolType: 'E92',
                remark: ''
            };

            function getPageValue(id) {
                const elementById = document.getElementById(id);
                if (elementById) {
                    const value = elementById.value || elementById.textContent;
                    return value.trim() || '';
                }

                const labels = document.querySelectorAll('label');
                for (const label of labels) {
                    if (label.textContent.includes(id)) {
                        let contentElement = label.nextElementSibling;
                        while (contentElement && (contentElement.tagName !== 'INPUT' && contentElement.tagName !== 'SPAN')) {
                            contentElement = contentElement.nextElementSibling;
                        }
                        if (contentElement) {
                            return contentElement.value || contentElement.textContent || '';
                        }
                    }
                }

                return fixedData[id] || '';
            }

            return {
                mainTitle: fixedData.mainTitle,
                creUnitName: getPageValue('creUnitName') || fixedData.creUnitName,
                refuelDate: getPageValue('refuelDate') || fixedData.refuelDate,
                carNo: getPageValue('carNo') || fixedData.carNo,
                place: getPageValue('place') || fixedData.place,
                cardNo: getPageValue('cardNo') || fixedData.cardNo,
                cardSum: getPageValue('cardSum') || fixedData.cardSum,
                fuelAmount: getPageValue('fuelAmount') || fixedData.fuelAmount,
                unitPrice: getPageValue('unitPrice') || fixedData.unitPrice,
                fuelCharge: getPageValue('fuelCharge') || fixedData.fuelCharge,
                iolType: getSelectText('iolType') || fixedData.iolType,
                remark: getPageValue('remark') || fixedData.remark
            };
        }

        function getSelectText(selectId) {
            const select = document.getElementById(selectId);
            if (!select) return '';
            return select.options[select.selectedIndex]?.text.trim() || '';
        }

        // 核心修改：增加左上边距（通过padding-left和padding-top实现）
        function generate3xLineHeightContent(data) {
            return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>加油记录_${data.carNo || '未知车辆'}</title>
    <style>
        /* 页面显示样式 */
        body {
            font-family: "Microsoft YaHei", "微软雅黑", sans-serif;
            font-size: 10.5pt;
            margin: 20px;
            width: 100%;
            line-height: 3.0;
        }
        .main-title {
            font-family: "Microsoft YaHei", "微软雅黑", sans-serif;
            font-size: 12pt;
            font-weight: bold;
            color: #007AFF;
            text-align: left;
            margin-top: 0;
            margin-bottom: 3.75pt;
            line-height: 3.0;
        }
        .content-item {
            margin: 0 0 3.75pt 0;
            text-align: left;
            line-height: 3.0;
        }
        .item-label {
            font-weight: normal;
            display: inline-block;
            width: 120px;
            vertical-align: top;
        }
        .item-content {
            display: inline-block;
            vertical-align: top;
        }

        /* 打印专属样式：默认横向 + 无页眉页脚 + 增加左上边距 */
        @media print {
            /* 1. 强制横向打印，清除默认边距 */
            @page {
                size: landscape;
                margin: 0; /* 清除浏览器默认边距 */
            }
            /* 2. 核心：增加左上边距（单位mm更适合打印场景） */
            body {
                padding-left: 30mm; /* 左边距30毫米（可调整） */
                padding-top: 20mm;  /* 上边距20毫米（可调整） */
                padding-right: 10mm;
                padding-bottom: 10mm;
                font-size: 10pt;
                width: calc(100% - 40mm); /* 减去左右边距总和，避免内容溢出 */
                line-height: 2.5;
            }
            .main-title {
                font-size: 11pt;
            }
            ::-webkit-print-color-adjust: exact;
        }
    </style>
</head>
<body>
    <div class="main-title">${data.mainTitle}</div>
    <div class="content-item">
        <span class="item-label">加油单位：</span>
        <span class="item-content">${data.creUnitName}</span>
    </div>
    <div class="content-item">
        <span class="item-label">加油时间：</span>
        <span class="item-content">${data.refuelDate}</span>
    </div>
    <div class="content-item">
        <span class="item-label">加油车辆：</span>
        <span class="item-content">${data.carNo}</span>
    </div>
    <div class="content-item">
        <span class="item-label">加油地点：</span>
        <span class="item-content">${data.place || ''}</span>
    </div>
    <div class="content-item">
        <span class="item-label">油卡卡号：</span>
        <span class="item-content">${data.cardNo}</span>
    </div>
    <div class="content-item">
        <span class="item-label">实时余额（元）：</span>
        <span class="item-content">${data.cardSum}</span>
    </div>
    <div class="content-item">
        <span class="item-label">加油金额（元）：</span>
        <span class="item-content">${data.fuelAmount}</span>
    </div>
    <div class="content-item">
        <span class="item-label">单价（元/升）：</span>
        <span class="item-content">${data.unitPrice}</span>
    </div>
    <div class="content-item">
        <span class="item-label">加油量（升）：</span>
        <span class="item-content">${data.fuelCharge}</span>
    </div>
    <div class="content-item">
        <span class="item-label">燃油类别：</span>
        <span class="item-content">${data.iolType}</span>
    </div>
    <div class="content-item">
        <span class="item-label">备注：</span>
        <span class="item-content">${data.remark || ''}</span>
    </div>
</body>
</html>
            `;
        }

        function openPrintWindow(htmlContent) {
            const printWindow = window.open('', '_blank');
            if (!printWindow) {
                alert('请允许浏览器弹出窗口，否则无法正常打印');
                return;
            }
            printWindow.document.write(htmlContent);
            printWindow.document.close();
            printWindow.onload = function() {
                setTimeout(() => {
                    printWindow.print();
                    // 可选：打印后自动关闭窗口
                    // printWindow.close();
                }, 300);
            };
        }
    }, 1500);
})();