// ==UserScript==
    // @name         批量操作记录导出
    // @namespace    http://tampermonkey.net/
    // @version      1.0
    // @description  自动获取剪切板信息并解析K开头的编码
    // @author       ming
    // @match        https://ww.erp321.com/app/item/skusn/Search.aspx
    // @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560731/%E6%89%B9%E9%87%8F%E6%93%8D%E4%BD%9C%E8%AE%B0%E5%BD%95%E5%AF%BC%E5%87%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/560731/%E6%89%B9%E9%87%8F%E6%93%8D%E4%BD%9C%E8%AE%B0%E5%BD%95%E5%AF%BC%E5%87%BA.meta.js
// ==/UserScript==

    (function() {
        'use strict';

        function saveColumnConfig(config) {
            localStorage.setItem('skuParserColumnConfig', JSON.stringify(config));
        }

        function loadColumnConfig() {
            const config = localStorage.getItem('skuParserColumnConfig');
            if (config) {
                try {
                    return JSON.parse(config);
                } catch (e) {
                    return null;
                }
            }
            return null;
        }

        function getColumnConfig() {
            const savedConfig = loadColumnConfig();
            if (savedConfig) {
                return savedConfig;
            }

            const defaultConfig = {
                'rn__': true,
                'sku_id': true,
                'sku_name': true,
                'properties_value': true,
                'qty': true,
                'id1': true,
                'id2': true,
                'type': true,
                's2': true,
                'bin': true,
                'pack_id': true,
                'remark': true,
                'created': true,
                'creator_name': true
            };

            saveColumnConfig(defaultConfig);
            return defaultConfig;
        }

        function createOperationSheetHTML(data, columnHeaders) {
            // 提取表头
            const headers = Object.keys(data[0]);

            // 创建表格HTML
            let html = `
                <table border="1">
                    <thead>
                        <tr>
            `;

            // 添加表头
            headers.forEach(header => {
                html += `
                            <th style="background-color: #4CAF50; color: white; font-weight: bold; text-align: center; padding: 5px;">${header}</th>
                `;
            });

            html += `
                        </tr>
                    </thead>
                    <tbody>
            `;

            // 添加数据行
            data.forEach(row => {
                html += `
                        <tr>
                `;

                headers.forEach(header => {
                    // 对特殊列进行处理
                    if (header === '图片') {
                        // 图片列不显示任何内容，因为图片将在商品信息表中显示
                        html += `
                            <td style="padding: 5px;"></td>
                        `;
                    } else {
                        html += `
                            <td style="padding: 5px;">${row[header] || ''}</td>
                        `;
                    }
                });

                html += `
                        </tr>
                `;
            });

            html += `
                    </tbody>
                </table>
            `;

            return html;
        }

        function createItemSheetHTML(itemData, results) {
            // 提取表头
            const headers = Object.keys(itemData[0]);

            // 创建表格HTML
            let html = `
                <table border="1">
                    <thead>
                        <tr>
            `;

            // 添加表头
            headers.forEach(header => {
                html += `
                            <th style="background-color: #4CAF50; color: white; font-weight: bold; text-align: center; padding: 5px;">${header}</th>
                `;
            });

            // 添加图片列
            html += `
                            <th style="background-color: #4CAF50; color: white; font-weight: bold; text-align: center; padding: 5px;">图片</th>
            `;

            html += `
                        </tr>
                    </thead>
                    <tbody>
            `;

            // 添加数据行
            itemData.forEach(row => {
                html += `
                        <tr>
                `;

                headers.forEach(header => {
                    html += `
                            <td style="padding: 5px;">${row[header] || ''}</td>
                        `;
                });

                // 添加图片列
                const skuId = row['编码'];
                const result = results.find(r => r.skuId === skuId);
                let imageHTML = '';

                if (result && result.imageData) {
                    // 直接使用base64图片数据嵌入到HTML中，设置图片样式确保嵌入单元格
                    imageHTML = `
                            <td style="padding: 5px; text-align: center; vertical-align: middle;"><img src="${result.imageData}" width="150" height="150" style="object-fit: contain; display: block; margin: 0 auto;" /></td>
                        `;
                } else {
                    imageHTML = `
                            <td style="padding: 5px;"></td>
                        `;
                }

                html += imageHTML;

                html += `
                        </tr>
                `;
            });

            html += `
                    </tbody>
                </table>
            `;

            return html;
        }

        function createCombinedHTML(operationSheetHTML, itemSheetHTML) {
            return `
                <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
                <head>
                    <!--[if gte mso 9]>
                    <xml>
                        <x:ExcelWorkbook>
                            <x:ExcelWorksheets>
                                <x:ExcelWorksheet>
                                    <x:Name>操作记录汇总</x:Name>
                                    <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>
                                </x:ExcelWorksheet>
                                <x:ExcelWorksheet>
                                    <x:Name>商品详细</x:Name>
                                    <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>
                                </x:ExcelWorksheet>
                            </x:ExcelWorksheets>
                        </x:ExcelWorkbook>
                    </xml>
                    <![endif]-->
                    <meta charset="utf-8">
                </head>
                <body>
                    <div><!--[if gte mso 9]><x:ExcelWorksheet><x:Name>操作记录汇总</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions><x:Worksheet><table><![endif]-->
                        ${operationSheetHTML}
                    <!--[if gte mso 9]></table></x:Worksheet></x:ExcelWorksheet><![endif]--></div>
                    <div><!--[if gte mso 9]><x:ExcelWorksheet><x:Name>商品详细</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions><x:Worksheet><table><![endif]-->
                        ${itemSheetHTML}
                    <!--[if gte mso 9]></table></x:Worksheet></x:ExcelWorksheet><![endif]--></div>
                </body>
                </html>
            `;
        }

        function exportHTMLToExcel(html, filename) {
            const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(a.href);
        }

        function createUI() {
            const container = document.createElement('div');
            container.id = 'sku-parser-container';
            container.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                z-index: 9999;
                background: white;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                display: flex;
                flex-direction: column;
                min-width: 600px;
                transition: width 0.3s ease, left 0.3s ease, right 0.3s ease;
            `;

            const dragHeader = document.createElement('div');
            dragHeader.id = 'drag-header';
            dragHeader.textContent = '批量操作记录导出工具';
            dragHeader.style.cssText = `
                background-color: #4A90E2;
                color: white;
                padding: 8px 15px;
                border-radius: 8px 8px 0 0;
                font-weight: bold;
                cursor: grab;
                user-select: none;
            `;

            const content = document.createElement('div');
            content.style.cssText = `
                padding: 15px;
                display: flex;
                flex-direction: column;
                gap: 12px;
            `;

            const dateRow = document.createElement('div');
            dateRow.style.cssText = `
                display: flex;
                align-items: center;
                gap: 10px;
                flex-wrap: wrap;
            `;

            const dateLabel = document.createElement('label');
            dateLabel.textContent = '单据日期:';
            dateLabel.style.cssText = `
                font-size: 12px;
                color: #666;
                font-weight: bold;
            `;

            const startDateInput = document.createElement('input');
            startDateInput.type = 'date';
            startDateInput.id = 'start-date';
            startDateInput.style.cssText = `
                padding: 6px;
                border: 1px solid #ccc;
                border-radius: 4px;
                font-size: 12px;
            `;

            const toLabel = document.createElement('label');
            toLabel.textContent = '至';
            toLabel.style.cssText = `
                font-size: 12px;
                color: #666;
            `;

            const endDateInput = document.createElement('input');
            endDateInput.type = 'date';
            endDateInput.id = 'end-date';
            endDateInput.style.cssText = `
                padding: 6px;
                border: 1px solid #ccc;
                border-radius: 4px;
                font-size: 12px;
            `;

            dateRow.appendChild(dateLabel);
            dateRow.appendChild(startDateInput);
            dateRow.appendChild(toLabel);
            dateRow.appendChild(endDateInput);

            const columnRow = document.createElement('div');
            columnRow.style.cssText = `
                display: flex;
                flex-direction: column;
                gap: 8px;
            `;

            const selectAllRow = document.createElement('div');
            selectAllRow.style.cssText = `
                display: flex;
                align-items: center;
                gap: 5px;
            `;

            const selectAllCheckbox = document.createElement('input');
            selectAllCheckbox.type = 'checkbox';
            selectAllCheckbox.id = 'select-all-columns';
            selectAllCheckbox.checked = true;
            selectAllCheckbox.style.cssText = `
                cursor: pointer;
                width: 16px;
                height: 16px;
            `;

            const selectAllLabel = document.createElement('label');
            selectAllLabel.textContent = '全选';
            selectAllLabel.htmlFor = 'select-all-columns';
            selectAllLabel.style.cssText = `
                font-size: 12px;
                color: #666;
                cursor: pointer;
                font-weight: bold;
            `;

            selectAllRow.appendChild(selectAllCheckbox);
            selectAllRow.appendChild(selectAllLabel);

            const columnsGrid = document.createElement('div');
            columnsGrid.style.cssText = `
                display: grid;
                grid-template-columns: repeat(5, 1fr);
                gap: 8px;
            `;

            const columnOptions = [
                { key: 'rn__', label: '序号' },
                { key: 'sku_id', label: '编码' },
                { key: 'sku_name', label: '货品名称' },
                { key: 'properties_value', label: '规格' },
                { key: 'qty', label: '数量' },
                { key: 'id1', label: '单据编码1' },
                { key: 'id2', label: '单据编码2' },
                { key: 'type', label: '操作' },
                { key: 's2', label: '备注' },
                { key: 'bin', label: '货架' },
                { key: 'pack_id', label: '箱号' },
                { key: 'remark', label: '备注2' },
                { key: 'created', label: '操作时间' },
                { key: 'creator_name', label: '操作人' }
            ];

            const columnCheckboxes = {};
            const columnConfig = getColumnConfig();

            columnOptions.forEach(option => {
                const checkboxContainer = document.createElement('div');
                checkboxContainer.style.cssText = `
                    display: flex;
                    align-items: center;
                    gap: 5px;
                `;

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = `column-${option.key}`;
                checkbox.checked = columnConfig[option.key] !== false;
                checkbox.style.cssText = `
                    cursor: pointer;
                    width: 14px;
                    height: 14px;
                `;

                const label = document.createElement('label');
                label.textContent = option.label;
                label.htmlFor = `column-${option.key}`;
                label.style.cssText = `
                    font-size: 11px;
                    color: #666;
                    cursor: pointer;
                    white-space: nowrap;
                `;

                checkboxContainer.appendChild(checkbox);
                checkboxContainer.appendChild(label);
                columnsGrid.appendChild(checkboxContainer);
                columnCheckboxes[option.key] = checkbox;
            });

            selectAllCheckbox.addEventListener('change', function() {
                const isChecked = this.checked;
                Object.values(columnCheckboxes).forEach(cb => {
                    cb.checked = isChecked;
                });
                saveColumnSelection(columnCheckboxes);
            });

            Object.entries(columnCheckboxes).forEach(([key, checkbox]) => {
                checkbox.addEventListener('change', function() {
                    saveColumnSelection(columnCheckboxes);
                    const allChecked = Object.values(columnCheckboxes).every(cb => cb.checked);
                    selectAllCheckbox.checked = allChecked;
                });
            });

            function saveColumnSelection(checkboxes) {
                const config = {};
                Object.entries(checkboxes).forEach(([key, checkbox]) => {
                    config[key] = checkbox.checked;
                });
                saveColumnConfig(config);
            }

            columnRow.appendChild(selectAllRow);
            columnRow.appendChild(columnsGrid);

            const logRow = document.createElement('div');
            logRow.style.cssText = `
                display: flex;
                flex-direction: column;
                gap: 10px;
                margin-bottom: 15px;
            `;

            const logHeader = document.createElement('div');
            logHeader.style.cssText = `
                display: flex;
                align-items: center;
                gap: 10px;
            `;

            const logLabel = document.createElement('label');
            logLabel.textContent = '搜索商品编码';
            logLabel.style.cssText = `
                font-size: 14px;
                font-weight: bold;
                color: #333;
            `;

            const progressContainer = document.createElement('div');
            progressContainer.className = 'progress-container';
            progressContainer.style.cssText = `
                flex: 1;
                height: 10px;
                background: #f0f0f0;
                border-radius: 5px;
                overflow: hidden;
                display: none;
            `;

            const progressBar = document.createElement('div');
            progressBar.id = 'export-progress';
            progressBar.style.cssText = `
                height: 100%;
                width: 0%;
                background: #4CAF50;
                transition: width 0.3s ease;
            `;

            progressContainer.appendChild(progressBar);
            logHeader.appendChild(logLabel);
            logHeader.appendChild(progressContainer);

            const progressText = document.createElement('div');
            progressText.id = 'progress-text';
            progressText.style.cssText = `
                font-size: 12px;
                color: #666;
                text-align: center;
                margin-top: 5px;
                display: none;
            `;

            const textarea = document.createElement('textarea');
            textarea.id = 'sku-input';
            textarea.placeholder = '粘贴商品编码...';
            textarea.style.cssText = `
                width: 100%;
                height: 80px;
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: 4px;
                resize: none;
                font-size: 12px;
                font-family: monospace;
            `;

            logRow.appendChild(logHeader);
            logRow.appendChild(progressText);
            logRow.appendChild(textarea);

            const buttonRow = document.createElement('div');
            buttonRow.style.cssText = `
                display: flex;
                justify-content: flex-end;
                align-items: center;
                gap: 10px;
            `;

            const countLabel = document.createElement('label');
            countLabel.id = 'sku-count';
            countLabel.textContent = '编码数量: 0';
            countLabel.style.cssText = `
                font-size: 12px;
                color: #4CAF50;
                font-weight: bold;
            `;

            const button = document.createElement('button');
            button.textContent = '导出操作日志';
            button.style.cssText = `
                padding: 10px 30px;
                background: #4CAF50;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                font-weight: bold;
            `;
            button.onmouseover = function() {
                this.style.background = '#45a049';
            };
            button.onmouseout = function() {
                this.style.background = '#4CAF50';
            };

            buttonRow.appendChild(countLabel);
            buttonRow.appendChild(button);

            content.appendChild(dateRow);
            content.appendChild(columnRow);
            content.appendChild(logRow);
            content.appendChild(buttonRow);

            container.appendChild(dragHeader);
            container.appendChild(content);
            document.body.appendChild(container);

            return { textarea, button, startDateInput, endDateInput };
        }

        async function getClipboardText() {
            try {
                const text = await navigator.clipboard.readText();
                return text;
            } catch (err) {
                console.log('无法读取剪切板', err);
                return '';
            }
        }

        function parseSKUs(text) {
            // 从输入框提取一行一个编码
            return text.split('\n')
                .map(line => line.trim())
                .filter(line => line.length > 0);
        }

        function getCookieValue(name) {
            const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
            if (match) {
                return match[2];
            }
            return null;
        }

        function getAuthCookieValues() {
            // 从cookie中获取u_co_id，它同时是owner_co_id和authorize_co_id
            const u_co_id = getCookieValue('u_co_id');
            return { owner_co_id: u_co_id, authorize_co_id: u_co_id };
        }

        async function fetchSKUData(skuId, startDate, endDate) {
            // 添加1-3秒随机延迟
            const delay = Math.random() * 2000;
            await new Promise(resolve => setTimeout(resolve, delay));

            const startDateStr = startDate + ' 00:00:00';
            const endDateStr = endDate + ' 23:59:59.998';

            const callbackParam = {
                "Method": "LoadDataToJSON",
                "Args": [
                    "1",
                    JSON.stringify([
                        {"k": "sku_id", "v": skuId, "c": "="},
                        {"k": "created", "v": startDate, "c": ">=", "t": "date"},
                        {"k": "created", "v": endDateStr, "c": "<=", "t": "date"},
                        {"k": "match_form", "v": "0", "c": "="}
                    ]),
                    "{}"
                ]
            };

            const formData = new URLSearchParams();
            formData.append('__VIEWSTATE', '/wEPDwULLTE3Mzc1NDY1NTlkZKsHd/oJEfHOKFcPDleZ87c7FXsL');
            formData.append('__VIEWSTATEGENERATOR', '96687167');
            formData.append('sku_id', skuId);
            formData.append('created', startDateStr);
            formData.append('created', endDateStr);
            formData.append('_jt_page_size', '1000');
            formData.append('__CALLBACKID', 'JTable1');
            formData.append('__CALLBACKPARAM', JSON.stringify(callbackParam));

            const timestamp = Date.now();
            const url = `https://ww.erp321.com/app/item/skusn/Search.aspx?ts___=${timestamp}&am___=LoadDataToJSON`;

            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: url,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    data: formData.toString(),
                    onload: function(response) {
                        try {
                            const responseText = response.responseText;
                            const cleanedResponse = responseText.replace(/^0\|/, '');
                            const parsedData = JSON.parse(cleanedResponse);

                            if (parsedData.ReturnValue) {
                                let returnValueObj;

                                if (typeof parsedData.ReturnValue === 'string') {
                                    returnValueObj = JSON.parse(parsedData.ReturnValue);
                                } else if (typeof parsedData.ReturnValue === 'object') {
                                    returnValueObj = parsedData.ReturnValue;
                                } else {
                                    resolve({ skuId, datas: null });
                                    return;
                                }

                                if (returnValueObj.datas) {
                                    let datas;
                                    if (typeof returnValueObj.datas === 'string') {
                                        datas = JSON.parse(returnValueObj.datas);
                                    } else if (Array.isArray(returnValueObj.datas)) {
                                        datas = returnValueObj.datas;
                                    } else if (typeof returnValueObj.datas === 'object') {
                                        datas = returnValueObj.datas;
                                    } else {
                                        resolve({ skuId, datas: null });
                                        return;
                                    }
                                    resolve({ skuId, datas });
                                } else {
                                    resolve({ skuId, datas: null });
                                }
                            } else {
                                resolve({ skuId, datas: null });
                            }
                        } catch (error) {
                            console.error(`SKU ${skuId} 解析响应失败:`, error);
                            resolve({ skuId, datas: null });
                        }
                    },
                    onerror: function(error) {
                        console.error(`SKU ${skuId} 请求失败:`, error);
                        resolve({ skuId, datas: null });
                    }
                });
            });
        }

        async function fetchPackItemsData(skuId) {
            // 添加1-3秒随机延时，避免请求过于频繁
            const delay = Math.random() * 2000;
            await new Promise(resolve => setTimeout(resolve, delay));

            // 获取cookie中的认证信息
            const { owner_co_id, authorize_co_id } = getAuthCookieValues();

            // 构建callbackParam，替换sku_id
            const callbackParam = {
                "Method": "LoadDataToJSON",
                "Args": [
                    "1",
                    JSON.stringify([
                        {"k": "[pit].sku_id", "v": skuId, "c": "like"},
                        {"k": "[p].wh_id", "v": "0", "c": ">"}
                    ]),
                    "{}"
                ]
            };

            // 构建表单数据
            const formData = new URLSearchParams();
            formData.append('__VIEWSTATE', '/wEPDwULLTE5NjQ1OTMwNTBkZCkrLD4nyy3+uGYxTeUJ0orSPHMl');
            formData.append('__VIEWSTATEGENERATOR', '2F6CC565');
            formData.append('owner_co_id', owner_co_id);
            formData.append('authorize_co_id', authorize_co_id);
            formData.append('_jt_page_size', '50');
            formData.append('__CALLBACKID', 'JTable1');
            formData.append('__CALLBACKPARAM', JSON.stringify(callbackParam));

            const timestamp = Date.now();
            const url = `https://ww.erp321.com/app/wms/Pack/PackItems.aspx?_c=jst-epaas&ts___=${timestamp}&am___=LoadDataToJSON`;

            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: url,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    data: formData.toString(),
                    onload: function(response) {
                        try {
                            const responseText = response.responseText;
                            // 处理响应开头的0|
                            const cleanedResponse = responseText.replace(/^0\|/, '');
                            const parsedData = JSON.parse(cleanedResponse);

                            if (parsedData.ReturnValue) {
                                let returnValueObj;

                                // 解析带有反斜杠的ReturnValue
                                if (typeof parsedData.ReturnValue === 'string') {
                                    // 处理可能的转义字符
                                    try {
                                        returnValueObj = JSON.parse(parsedData.ReturnValue);
                                    } catch (e) {
                                        // 如果直接解析失败，尝试替换转义字符后再解析
                                        const unescaped = parsedData.ReturnValue.replace(/\\/g, '');
                                        returnValueObj = JSON.parse(unescaped);
                                    }
                                } else if (typeof parsedData.ReturnValue === 'object') {
                                    returnValueObj = parsedData.ReturnValue;
                                } else {
                                    resolve({ skuId, itemData: null });
                                    return;
                                }

                                if (returnValueObj.datas) {
                                    let datas;
                                    if (typeof returnValueObj.datas === 'string') {
                                        datas = JSON.parse(returnValueObj.datas);
                                    } else if (Array.isArray(returnValueObj.datas)) {
                                        datas = returnValueObj.datas;
                                    } else if (typeof returnValueObj.datas === 'object') {
                                        datas = returnValueObj.datas;
                                    } else {
                                        resolve({ skuId, itemData: null });
                                        return;
                                    }

                                    // 提取需要的信息
                                    if (datas.length > 0) {
                                        const firstItem = datas[0];
                                        // 输出图片链接调试信息
                                        console.log(`SKU ${skuId} 商品信息响应:`, firstItem);
                                        console.log(`SKU ${skuId} 图片链接:`, firstItem.itemsku_pic);
                                        const itemData = {
                                            itemsku_pic: firstItem.itemsku_pic || '',
                                            cost_price: firstItem.cost_price || '',
                                            itemsku_supplier: firstItem.itemsku_supplier || ''
                                        };
                                        resolve({ skuId, itemData });
                                    } else {
                                        resolve({ skuId, itemData: null });
                                    }
                                } else {
                                    resolve({ skuId, itemData: null });
                                }
                            } else {
                                resolve({ skuId, itemData: null });
                            }
                        } catch (error) {
                            console.error(`SKU ${skuId} 商品信息请求失败:`, error);
                            resolve({ skuId, itemData: null });
                        }
                    },
                    onerror: function(error) {
                        console.error(`SKU ${skuId} 商品信息请求失败:`, error);
                        resolve({ skuId, itemData: null });
                    }
                });
            });
        }

        async function downloadImageAsBase64(imageUrl, skuId) {
            console.log(`开始下载图片 ${imageUrl}`);
            if (!imageUrl) {
                console.log('图片URL为空');
                return null;
            }

            // 检查图片URL格式
            if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
                console.log(`图片URL格式不正确，缺少协议: ${imageUrl}`);
                // 尝试补全协议
                imageUrl = 'https://' + imageUrl;
                console.log(`尝试使用补全后的URL: ${imageUrl}`);
            }

            // 添加1-2秒随机延迟
            const delay = Math.random() * 1000;
            await new Promise(resolve => setTimeout(resolve, delay));

            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: imageUrl,
                    responseType: 'blob',
                    onload: function(response) {
                        console.log(`图片下载响应状态 ${response.status}, URL: ${imageUrl}`);
                        if (response.status === 200) {
                            const blob = response.response;
                            console.log(`图片下载成功，Blob大小: ${blob.size} bytes, URL: ${imageUrl}`);

                            const reader = new FileReader();
                            reader.onloadend = function() {
                                // 获取base64数据
                                const base64data = reader.result;
                                console.log(`[图片处理] 图片转换为base64成功，数据长度 ${base64data.length}, URL: ${imageUrl}`);
                                // 记录数据前100个字符，用于调试
                                console.log(`[图片处理] base64数据前100字符: ${base64data.substring(0, 100)}...`);
                                resolve(base64data);
                            };
                            reader.onerror = function() {
                                console.log(`图片转换为base64失败，URL: ${imageUrl}`);
                                resolve(null);
                            };
                            reader.readAsDataURL(blob);
                        } else {
                            console.log(`图片下载失败，状态 ${response.status}, URL: ${imageUrl}`);
                            resolve(null);
                        }
                    },
                    onerror: function(error) {
                        console.log(`图片下载请求失败，错误 ${JSON.stringify(error)}, URL: ${imageUrl}`);
                        resolve(null);
                    }
                });
            });
        }

        async function exportSKUs(skus, startDate, endDate) {
            if (skus.length === 0) {
                console.log('未找到符合格式的编码');
                showNotification('未找到符合格式的编码');
                return;
            }

            const progressContainer = document.querySelector('.progress-container') || document.getElementById('export-progress').parentElement;
            progressContainer.style.display = 'block';
            const progressBar = document.getElementById('export-progress');
            const progressText = document.getElementById('progress-text');
            progressBar.style.width = '0%';
            progressText.style.display = 'block';
            progressText.textContent = `开始导出，共${skus.length} 个编码`;

            console.log('开始处理', skus.length, '个SKU编码');

            const results = [];
            const failedSkus = [];

            for (let i = 0; i < skus.length; i++) {
                const skuId = skus[i];
                const result = await fetchSKUData(skuId, startDate, endDate);

                // 获取商品信息
                const itemDataResult = await fetchPackItemsData(skuId);
                result.itemData = itemDataResult.itemData;

                // 如果有图片URL，下载图片
                if (result.itemData && result.itemData.itemsku_pic) {
                    console.log(`[图片处理] 准备下载SKU ${skuId} 的图片 ${result.itemData.itemsku_pic}`);
                    const imageData = await downloadImageAsBase64(result.itemData.itemsku_pic, skuId);
                    result.imageData = imageData;
                    if (imageData) {
                        console.log(`[图片处理] SKU ${skuId} 图片下载成功，数据长度 ${imageData.length}`);
                        // 检查图片数据格式
                        if (imageData.startsWith('data:image/')) {
                            const imageType = imageData.match(/data:(image\/[^;]+);base64,/)[1];
                            console.log(`[图片处理] SKU ${skuId} 图片数据格式正确，类型 ${imageType}`);
                            console.log(`[图片处理] SKU ${skuId} 图片数据示例: ${imageData.substring(0, 50)}...`);
                        } else {
                            console.log(`[图片处理] SKU ${skuId} 图片数据格式异常`);
                            console.log(`[图片处理] 数据前100字符: ${imageData.substring(0, 100)}`);
                        }
                    } else {
                        console.log(`[图片处理] SKU ${skuId} 图片下载失败`);
                    }
                } else {
                    result.imageData = null;
                    console.log(`[图片处理] SKU ${skuId} 没有图片URL，跳过下载`);
                }

                results.push(result);

                // 检查是否失败
                if (!result.datas ||
                    (Array.isArray(result.datas) && result.datas.length === 0) ||
                    (typeof result.datas === 'object' && !Array.isArray(result.datas) && Object.keys(result.datas).length === 0)) {
                    failedSkus.push(skuId);
                }

                // 更新进度条
                const progress = ((i + 1) / skus.length) * 100;
                progressBar.style.width = `${progress}%`;
                progressText.textContent = `导出进度: ${Math.round(progress)}% (${i + 1}/${skus.length})`;
            }

            await exportToExcel(results);

            // 显示结果
            const successCount = skus.length - failedSkus.length;
            console.log(`数据处理完成！共处理 ${skus.length} 个SKU编码，成功${successCount} 个，失败 ${failedSkus.length} 个`);

            if (failedSkus.length > 0) {
                console.log('失败的编码', failedSkus);
            }

            // 显示完成提示
            let notificationMsg = `导出完成！共处理 ${skus.length} 个SKU编码，成功${successCount} 个`;
            if (failedSkus.length > 0) {
                notificationMsg += `，失败${failedSkus.length} 个`;
            }
            showNotification(notificationMsg);

            // 如果有失败的编码，显示详细信息
            if (failedSkus.length > 0) {
                const failedMsg = `失败的编码：\n${failedSkus.join('\n')}`;
                // 创建一个失败信息弹窗
                const failedDialog = document.createElement('div');
                failedDialog.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 2px 20px rgba(0,0,0,0.3);
                    z-index: 999999;
                    max-width: 80%;
                    max-height: 70%;
                    overflow-y: auto;
                `;

                const failedTitle = document.createElement('div');
                failedTitle.textContent = '导出失败的编码';
                failedTitle.style.cssText = `
                    font-weight: bold;
                    font-size: 16px;
                    color: #333;
                    margin-bottom: 10px;
                    border-bottom: 1px solid #ddd;
                    padding-bottom: 5px;
                `;

                const failedContent = document.createElement('div');
                failedContent.textContent = failedMsg;
                failedContent.style.cssText = `
                    font-size: 14px;
                    color: #666;
                    white-space: pre-wrap;
                `;

                const closeBtn = document.createElement('button');
                closeBtn.textContent = '关闭';
                closeBtn.style.cssText = `
                    margin-top: 15px;
                    padding: 8px 20px;
                    background: #4CAF50;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 14px;
                `;

                closeBtn.addEventListener('click', () => {
                    document.body.removeChild(failedDialog);
                });

                failedDialog.appendChild(failedTitle);
                failedDialog.appendChild(failedContent);
                failedDialog.appendChild(closeBtn);
                document.body.appendChild(failedDialog);
            }

            // 隐藏进度条
            setTimeout(() => {
                progressContainer.style.display = 'none';
                progressBar.style.width = '0%';
                progressText.style.display = 'none';
            }, 1000);
        }

        function showNotification(message) {
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                background: #4CAF50;
                color: white;
                border-radius: 4px;
                font-size: 14px;
                font-weight: bold;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
                z-index: 999999;
                opacity: 1;
                transition: opacity 0.5s ease;
            `;
            notification.textContent = message;
            document.body.appendChild(notification);

            // 3秒后缓缓消失
            setTimeout(() => {
                notification.style.opacity = '0';
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 500);
            }, 3000);
        }

        // 浏览器检测函数
        function getExplorer() {
            let explorer = window.navigator.userAgent.toLowerCase();
            if (explorer.indexOf("msie") >= 0) {
                return "ie";
            } else if (explorer.indexOf("firefox") >= 0) {
                return "Firefox";
            } else if (explorer.indexOf("chrome") >= 0) {
                return "Chrome";
            } else if (explorer.indexOf("opera") >= 0) {
                return "Opera";
            } else if (explorer.indexOf("Safari") >= 0) {
                return "Safari";
            }
        }

        // IE浏览器Excel导出
        const tableToIE = (data, name) => {
            let curTbl = data;
            let oXL = new ActiveXObject("Excel.Application");
            let oWB = oXL.Workbooks.Add();
            let xlsheet = oWB.Worksheets(1);
            let sel = document.body.createTextRange();
            sel.moveToElementText(curTbl);
            sel.select();
            sel.execCommand("Copy");
            xlsheet.Paste();
            oXL.Visible = true;
            try {
                let fname = oXL.Application.GetSaveAsFilename("Excel.xls", "Excel Spreadsheets (*.xls), *.xls");
            } catch (e) {
                print("Nested catch caught ", e);
            } finally {
                oWB.SaveAs(fname);
                oWB.Close(savechanges = false);
                oXL.Quit();
                oXL = null;
                let downLoadLink = document.createElement('a');
                downLoadLink.href = fname;
                downLoadLink.download = name + ".xls";
                document.body.appendChild(downLoadLink);
                downLoadLink.click();
                document.body.removeChild(downLoadLink);
            }
        };

        // 非IE浏览器Excel导出
        const tableToNotIE = (function() {
            let uri = 'data:application/vnd.ms-excel;base64,',
                template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body>{table}</body></html>',
                base64 = function(s) {
                    return window.btoa(unescape(encodeURIComponent(s)));
                },
                format = function(s, c) {
                    return s.replace(/{(\w+)}/g, function(m, p) {
                        return c[p];
                    });
                };
            return function(table, name) {
                let ctx = { worksheet: name || 'Worksheet', table: table };
                let elementA = document.createElement('a');
                elementA.href = uri + base64(format(template, ctx));
                elementA.download = name + '.xls';
                document.body.appendChild(elementA);
                elementA.click();
                document.body.removeChild(elementA);
            };
        })();

        // 创建操作记录汇总表格HTML
        function createOperationSheetHTML(data, columnHeaders) {
            if (!data || data.length === 0) {
                return '';
            }

            // 获取表头
            const headers = Object.keys(data[0]);
            let html = '<table border="1" cellpadding="2" cellspacing="0" style="border-collapse: collapse;">';

            // 表头
            html += '<thead>';
            html += '<tr style="background-color: #4CAF50; color: white; font-weight: bold;">';
            headers.forEach(header => {
                html += `<th style="text-align: center; white-space: nowrap; padding: 5px;">${header}</th>`;
            });
            html += '</tr>';
            html += '</thead>';

            // 数据行
            html += '<tbody>';
            data.forEach(row => {
                html += '<tr>';
                headers.forEach(header => {
                    html += `<td style="padding: 3px; word-break: break-word;">${row[header] || ''}</td>`;
                });
                html += '</tr>';
            });
            html += '</tbody>';
            html += '</table>';

            return html;
        }

        // 创建商品信息表格HTML，包含图片嵌入
        function createItemSheetHTML(data) {
            if (!data || data.length === 0) {
                return '';
            }

            // 定义固定的表头
            const columns = ['编码', '成本价', '供应商', '图片'];
            let html = '<table border="1" cellpadding="2" cellspacing="0" style="border-collapse: collapse;">';

            // 表头
            html += '<thead>';
            html += '<tr style="background-color: #4CAF50; color: white; font-weight: bold;">';
            columns.forEach(column => {
                html += `<th style="text-align: center; white-space: nowrap; padding: 5px;">${column}</th>`;
            });
            html += '</tr>';
            html += '</thead>';

            // 数据行
            html += '<tbody>';
            data.forEach(row => {
                html += '<tr>';

                // 编码
                html += `<td style="padding: 3px; word-break: break-word;">${row['编码'] || ''}</td>`;

                // 成本价
                html += `<td style="padding: 3px; word-break: break-word;">${row['成本价'] || ''}</td>`;

                // 供应商
                html += `<td style="padding: 3px; word-break: break-word;">${row['供应商'] || ''}</td>`;

                // 图片
                if (row['图片数据']) {
                    html += `<td style="width: 150px; height: 150px; text-align: center; vertical-align: middle;"><img src="${row['图片数据']}" width="140" height="140" style="display: block; margin: 0 auto; object-fit: contain;"></td>`;
                } else {
                    html += '<td style="width: 150px; height: 150px;"></td>';
                }

                html += '</tr>';
            });
            html += '</tbody>';
            html += '</table>';

            return html;
        }

        // 创建合并多工作表HTML结构
        function createCombinedHTML(operationSheetHTML, itemSheetHTML) {
            // 使用支持多工作表的Excel XML标记
            return `
                <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
                <head>
                    <meta charset="utf-8">
                    <meta name="ProgId" content="Excel.Sheet">
                    <meta name="Generator" content="Microsoft Excel 11">
                    <!--[if gte mso 9]>
                    <xml>
                        <x:ExcelWorkbook>
                            <x:ExcelWorksheets>
                                <x:ExcelWorksheet>
                                    <x:Name>操作记录汇总</x:Name>
                                    <x:WorksheetOptions>
                                        <x:DisplayGridlines/>
                                    </x:WorksheetOptions>
                                </x:ExcelWorksheet>
                                <x:ExcelWorksheet>
                                    <x:Name>商品详细</x:Name>
                                    <x:WorksheetOptions>
                                        <x:DisplayGridlines/>
                                    </x:WorksheetOptions>
                                </x:ExcelWorksheet>
                            </x:ExcelWorksheets>
                        </x:ExcelWorkbook>
                    </xml>
                    <![endif]-->
                </head>
                <body>
                    <!-- 第一个工作表：操作记录汇总 -->
                    <!--[if gte mso 9]><x:Worksheet><x:Name>操作记录汇总</x:Name><x:WorksheetOptions><x:Print><x:ValidPrinterInfo/></x:Print></x:WorksheetOptions><x:Table><![endif]-->
                    ${operationSheetHTML}
                    <!--[if gte mso 9]></x:Table></x:Worksheet><![endif]-->

                    <!-- 第二个工作表：商品详细 -->
                    <!--[if gte mso 9]><x:Worksheet><x:Name>商品详细</x:Name><x:WorksheetOptions><x:Print><x:ValidPrinterInfo/></x:Print></x:WorksheetOptions><x:Table><![endif]-->
                    ${itemSheetHTML}
                    <!--[if gte mso 9]></x:Table></x:Worksheet><![endif]-->
                </body>
                </html>
            `;
        }

        // 将HTML导出为Excel文件
        function exportHTMLToExcel(html, filename) {
            // 创建Blob对象
            const blob = new Blob([html], { type: 'application/vnd.ms-excel' });

            // 创建下载链接
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = filename;

            // 触发下载
            document.body.appendChild(a);
            a.click();

            // 清理
            document.body.removeChild(a);
            URL.revokeObjectURL(a.href);
        }

        async function exportToExcel(results) {
            if (!results || results.length === 0) {
                console.log('没有数据可导出');
                return;
            }
            // 获取列配置
            const columnConfig = getColumnConfig();
            const columnHeaders = {
                'rn__': '序号',
                'sku_id': '编码',
                'sku_name': '货品名称',
                'properties_value': '规格',
                'qty': '数量',
                'id1': '单据编码1',
                'id2': '单据编码2',
                'type': '操作',
                's2': '操作备注',
                'bin': '货架',
                'pack_id': '箱号',
                'remark': '商品备注',
                'created': '操作时间',
                'creator_name': '操作人'
            };

            const excludeFields = ['creator', 'owner_co_id', 'i_id', 'labels', '__KeyData'];
            const allFilteredData = []; // 创建数组收集所有数据

            for (let i = 0; i < results.length; i++) {
                const result = results[i];
                const { skuId, datas } = result;

                // 如果datas空白则不写入表格
                if (!datas ||
                    (Array.isArray(datas) && datas.length === 0) ||
                    (typeof datas === 'object' && !Array.isArray(datas) && Object.keys(datas).length === 0)) {
                    continue;
                }
                let filteredData;

                if (Array.isArray(datas)) {
                    filteredData = datas.map(item => {
                        const filtered = {};
                        for (const key in item) {
                            if (!excludeFields.includes(key) && columnConfig[key]) {
                                filtered[columnHeaders[key] || key] = item[key];
                            }
                        }
                        return filtered;
                    });
                    // 将过滤后的数据添加到总数组中
                    allFilteredData.push(...filteredData);
                } else {
                    filteredData = {};
                    for (const key in datas) {
                        if (!excludeFields.includes(key) && columnConfig[key]) {
                            filteredData[columnHeaders[key] || key] = datas[key];
                        }
                    }
                    // 将过滤后的数据添加到总数组中
                    allFilteredData.push(filteredData);
                }
            }

            // 如果没有有效数据则返回
            if (allFilteredData.length === 0) {
                console.log('没有有效数据可导出');
                return;
            }

            // 创建商品信息列表（去重SKU）
            const itemData = [];
            const processedSkuIds = new Set(); // 用于跟踪已处理的SKU，避免重复处理

            for (let i = 0; i < allFilteredData.length; i++) {
                const dataRow = allFilteredData[i];
                const skuId = dataRow['编码'];

                // 如果该SKU已经处理过，跳过
                if (processedSkuIds.has(skuId)) {
                    continue;
                }
                processedSkuIds.add(skuId);

                // 查找对应的结果
                const result = results.find(r => r.skuId === skuId);

                // 添加到商品信息列表
                const itemDataEntry = {
                    '编码': skuId,
                    '成本价': '',
                    '供应商': '',
                    '图片数据': null
                };

                if (result && result.itemData) {
                    itemDataEntry['成本价'] = result.itemData.cost_price || '';
                    itemDataEntry['供应商'] = result.itemData.itemsku_supplier || '';
                    itemDataEntry['图片数据'] = result.imageData || null;
                }

                itemData.push(itemDataEntry);
            }

            console.log('导出数据准备完成:', allFilteredData.length, itemData.length);
            console.log('商品数据示例:', itemData[0]);

            try {
                const today = new Date();
                const year = today.getFullYear().toString().slice(-2);
                const month = String(today.getMonth() + 1).padStart(2, '0');
                const day = String(today.getDate()).padStart(2, '0');
                const timestamp = Math.floor(today.getTime() / 1000);

                console.log('开始使用ExcelJS创建工作簿...');

                // 直接使用ExcelJS创建工作簿
                const workbook = new ExcelJS.Workbook();

                // 创建操作记录汇总工作表
                console.log('创建操作记录汇总工作表...');
                const operationSheet = workbook.addWorksheet('操作记录汇总');

                // 如果有数据，添加表头和数据行
                if (allFilteredData.length > 0) {
                    // 获取所有列名作为表头
                    const columns = Object.keys(allFilteredData[0]);

                    // 添加表头行
                    const headerRow = operationSheet.addRow(columns);
                    headerRow.font = { bold: true, color: { argb: 'FFFFFF' } };
                    headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '4CAF50' } };

                    // 添加数据行
                    allFilteredData.forEach(rowData => {
                        const row = [];
                        columns.forEach(col => {
                            row.push(rowData[col] || '');
                        });
                        operationSheet.addRow(row);
                    });

                    // 设置列宽 - 根据示例数据调整
                    columns.forEach((col, index) => {
                        let width = 15;
                        if (col === '序号') width = 10;
                        if (col === '编码') width = 15;
                        if (col === '货品名称') width = 30;
                        if (col === '规格') width = 20;
                        if (col === '数量') width = 10;
                        if (col === '原货位') width = 25;
                        if (col === '目标货位') width = 30;
                        if (col === '操作类型') width = 15;
                        if (col === '操作内容') width = 40;
                        if (col === '货位') width = 20;
                        if (col === '备注') width = 30;
                        if (col === '操作备注') width = 50;
                        if (col === '操作时间') width = 20;
                        if (col === '操作人') width = 15;
                        if (col === '商品备注') width = 30;
                        operationSheet.getColumn(index + 1).width = width;
                    });

                    // 美化表格设置
                    // 1. 设置单元格边框
                    operationSheet.eachRow((row, rowNumber) => {
                        row.eachCell((cell, colNumber) => {
                            cell.border = {
                                top: { style: 'thin' },
                                left: { style: 'thin' },
                                bottom: { style: 'thin' },
                                right: { style: 'thin' }
                            };
                            // 设置文本对齐方式
                            cell.alignment = {
                                vertical: 'middle',
                                horizontal: 'left',
                                wrapText: true
                            };
                        });
                    });

                    // 2. 设置行高
                    operationSheet.getRow(1).height = 20; // 表头行高
                    for (let i = 2; i <= operationSheet.rowCount; i++) {
                        operationSheet.getRow(i).height = 18; // 数据行高
                    }

                    // 3. 冻结首行
                    operationSheet.views = [{
                        state: 'frozen',
                        ySplit: 1
                    }];

                    // 4. 设置自动筛选
                    operationSheet.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: columns.length } };
                } else {
                    // 如果没有数据，添加提示信息
                    operationSheet.addRow(['没有操作记录数据']);
                }

                // 创建商品详细工作表
                console.log('创建商品详细工作表...');
                const itemSheet = workbook.addWorksheet('商品详细');

                // 定义商品详细列顺序
                const itemColumns = ['编码', '成本价', '供应商', '图片'];

                // 添加商品详细表头
                const itemHeaderRow = itemSheet.addRow(itemColumns);
                itemHeaderRow.font = { bold: true, color: { argb: 'FFFFFF' } };
                itemHeaderRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '4CAF50' } };

                // 设置商品详细列宽
                itemSheet.getColumn(1).width = 15;
                itemSheet.getColumn(2).width = 15;
                itemSheet.getColumn(3).width = 25;
                itemSheet.getColumn(4).width = 20;

                // 美化商品详细表格设置
                // 1. 设置单元格边框
                itemSheet.eachRow((row, rowNumber) => {
                    row.eachCell((cell, colNumber) => {
                        cell.border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                        // 设置文本对齐方式
                        cell.alignment = {
                            vertical: 'middle',
                            horizontal: 'left',
                            wrapText: true
                        };
                    });
                });

                // 2. 设置行高
                itemSheet.getRow(1).height = 20; // 表头行高

                // 3. 冻结首行
                itemSheet.views = [{
                    state: 'frozen',
                    ySplit: 1
                }];

                // 4. 设置自动筛选
                itemSheet.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: itemColumns.length } };

                // 添加商品详细数据和图片
                for (let i = 0; i < itemData.length; i++) {
                    const item = itemData[i];
                    const rowIndex = i + 2; // 从第二行开始（第一行是表头）

                    // 设置行高以容纳图片
                    itemSheet.getRow(rowIndex).height = 120;

                    // 添加数据列
                    itemSheet.getCell(`A${rowIndex}`).value = item['编码'] || '';
                    itemSheet.getCell(`B${rowIndex}`).value = item['成本价'] || '';
                    itemSheet.getCell(`C${rowIndex}`).value = item['供应商'] || '';

                    // 添加图片
                    if (item['图片数据']) {
                        try {
                            // 从base64字符串中提取图片数据
                            const base64Data = item['图片数据'].split(',')[1];
                            const binaryData = atob(base64Data);
                            const arrayBuffer = new ArrayBuffer(binaryData.length);
                            const view = new Uint8Array(arrayBuffer);

                            for (let j = 0; j < binaryData.length; j++) {
                                view[j] = binaryData.charCodeAt(j);
                            }

                            // 添加图片到工作簿
                            const image = workbook.addImage({
                                buffer: arrayBuffer,
                                extension: 'png',
                            });

                            // 插入图片到单元格
                            itemSheet.addImage(image, {
                                tl: { col: 3, row: rowIndex - 1 }, // col是0-based，row是0-based
                                ext: { width: 150, height: 150 },
                            });
                        } catch (imageError) {
                            console.error('处理图片时发生错误:', imageError);
                        }
                    }
                }

                // 导出Excel文件
                console.log('导出包含两个工作表的完整Excel文件...');
                const excelBuffer = await workbook.xlsx.writeBuffer();
                const excelBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                const excelUrl = URL.createObjectURL(excelBlob);
                const excelA = document.createElement('a');
                const fileName = `操作记录汇总${year}${month}${day}-${timestamp}.xlsx`;
                excelA.href = excelUrl;
                excelA.download = fileName;
                document.body.appendChild(excelA);
                excelA.click();
                document.body.removeChild(excelA);
                URL.revokeObjectURL(excelUrl);

                console.log('Excel文件导出成功:', fileName);
                console.log(`导出数据统计: ${allFilteredData.length} 行操作记录，${itemData.length} 个商品`);
            } catch (error) {
                console.error('导出过程中发生错误:', error);
            }
        }

        // 创建操作记录汇总表格HTML
        function createOperationSheetHTML(data) {
            if (!data || data.length === 0) {
                return '<table><tr><td>没有数据</td></tr></table>';
            }

            // 获取所有列名
            const columns = Object.keys(data[0]);

            let html = '<table border="1" style="border-collapse: collapse;">';

            // 表头
            html += '<thead style="background-color: #4CAF50; color: white;">';
            html += '<tr>';
            columns.forEach(col => {
                // 设置列宽
                let width = '150px';
                if (col === '货品名称') width = '300px';
                if (col === '操作备注') width = '250px';
                if (col === '商品备注') width = '300px';
                html += `<th style="text-align: center; padding: 5px; min-width: ${width};">${col}</th>`;
            });
            html += '</tr>';
            html += '</thead>';

            // 表体
            html += '<tbody>';
            data.forEach(row => {
                html += '<tr>';
                columns.forEach(col => {
                    html += `<td style="padding: 5px;">${row[col] || ''}</td>`;
                });
                html += '</tr>';
            });
            html += '</tbody>';

            html += '</table>';
            return html;
        }

        // 创建商品信息表格HTML，含图片嵌入
        function createItemSheetHTML(itemData, results) {
            if (!itemData || itemData.length === 0) {
                return '<table><tr><td>没有数据</td></tr></table>';
            }

            // 定义列顺序
            const columns = ['编码', '成本价', '供应商', '图片'];

            let html = '<table border="1" style="border-collapse: collapse;">';

            // 表头
            html += '<thead style="background-color: #4CAF50; color: white;">';
            html += '<tr>';
            columns.forEach(col => {
                // 设置列宽
                let width = '150px';
                if (col === '图片URL') width = '300px';
                if (col === '图片') width = '200px';
                html += `<th style="text-align: center; padding: 5px; min-width: ${width};">${col}</th>`;
            });
            html += '</tr>';
            html += '</thead>';

            // 表体
            html += '<tbody>';
            itemData.forEach(item => {
                html += '<tr>';
                columns.forEach(col => {
                    if (col === '图片') {
                        // 嵌入图片
                        if (item['图片数据']) {
                            html += `<td style="padding: 5px; text-align: center;"><img src="${item['图片数据']}" style="max-width: 150px; max-height: 150px;"></td>`;
                        } else {
                            html += '<td style="padding: 5px;"></td>';
                        }
                    } else {
                        html += `<td style="padding: 5px;">${item[col] || ''}</td>`;
                    }
                });
                html += '</tr>';
            });
            html += '</tbody>';

            html += '</table>';
            return html;
        }

        // 生成含Excel XML标签的组合HTML
        function createCombinedHTML(operationSheetHTML, itemSheetHTML) {
            return `
                <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
                <head>
                    <meta http-equiv="Content-Type" content="application/vnd.ms-excel; charset=utf-8">
                    <!--[if gte mso 9]>
                    <xml>
                        <x:ExcelWorkbook>
                            <x:ExcelWorksheets>
                                <x:ExcelWorksheet>
                                    <x:Name>操作记录汇总</x:Name>
                                    <x:WorksheetOptions>
                                        <x:Selected/>
                                        <x:FreezePanes>
                                            <x:Panes>
                                                <x:Pane>
                                                    <x:Number>1</x:Number>
                                                    <x:ActiveRow>1</x:ActiveRow>
                                                </x:Pane>
                                            </x:Panes>
                                        </x:FreezePanes>
                                        <x:ProtectContents>False</x:ProtectContents>
                                        <x:ProtectObjects>False</x:ProtectObjects>
                                        <x:ProtectScenarios>False</x:ProtectScenarios>
                                    </x:WorksheetOptions>
                                </x:ExcelWorksheet>
                                <x:ExcelWorksheet>
                                    <x:Name>商品详细</x:Name>
                                    <x:WorksheetOptions>
                                        <x:Selected/>
                                        <x:FreezePanes>
                                            <x:Panes>
                                                <x:Pane>
                                                    <x:Number>1</x:Number>
                                                    <x:ActiveRow>1</x:ActiveRow>
                                                </x:Pane>
                                            </x:Panes>
                                        </x:FreezePanes>
                                        <x:ProtectContents>False</x:ProtectContents>
                                        <x:ProtectObjects>False</x:ProtectObjects>
                                        <x:ProtectScenarios>False</x:ProtectScenarios>
                                    </x:WorksheetOptions>
                                </x:ExcelWorksheet>
                            </x:ExcelWorksheets>
                        </x:ExcelWorkbook>
                    </xml>
                    <![endif]-->
                </head>
                <body>
                    <!-- 操作记录汇总-->
                    ${operationSheetHTML}
                    <br clear="all" style="page-break-before:always;">
                    <!-- 商品详细 -->
                    ${itemSheetHTML}
                </body>
                </html>
            `;
        }

        // 通过Blob下载HTML为Excel文件
        function exportHTMLToExcel(html, fileName) {
            const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8;' });
            const link = document.createElement('a');

            if (link.download !== undefined) {
                const url = URL.createObjectURL(blob);
                link.setAttribute('href', url);
                link.setAttribute('download', fileName);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }


        function savePosition(x, y) {
            localStorage.setItem('skuParserPosition', JSON.stringify({ x, y }));
        }

        function loadPosition() {
            const position = localStorage.getItem('skuParserPosition');
            if (position) {
                try {
                    return JSON.parse(position);
                } catch (e) {
                    return null;
                }
            }
            return null;
        }

        function saveCollapseState(isCollapsed, side) {
            localStorage.setItem('skuParserCollapseState', JSON.stringify({ isCollapsed, side }));
        }

        function loadCollapseState() {
            const state = localStorage.getItem('skuParserCollapseState');
            if (state) {
                try {
                    return JSON.parse(state);
                } catch (e) {
                    return null;
                }
            }
            return null;
        }

        function checkEdgeSnap(container, x, y) {
            const snapThreshold = 50;
            const screenWidth = window.innerWidth;
            const containerWidth = container.offsetWidth;

            // Calculate actual left position considering CSS positioning
            const actualLeft = container.offsetLeft;

            if (actualLeft <= snapThreshold) {
                return { x: 0, side: 'left' };
            } else if (actualLeft + containerWidth >= screenWidth - snapThreshold) {
                return { x: screenWidth - containerWidth, side: 'right' };
            }
            return null;
        }

        function collapseWindow(container, side) {
            const collapsedWidth = 30;
            container.style.width = collapsedWidth + 'px';
            container.style.overflow = 'hidden';

            if (side === 'left') {
                container.style.left = '0px';
                container.style.right = 'auto';
            } else {
                container.style.right = '0px';
                container.style.left = 'auto';
            }

            // Add tooltip for collapsed state
            const dragHeader = container.querySelector('#drag-header');
            dragHeader.style.position = 'relative';
            dragHeader.title = dragHeader.textContent;

            saveCollapseState(true, side);
        }

        function expandWindow(container, originalWidth, side) {
            container.style.width = originalWidth + 'px';
            container.style.overflow = 'visible';

            if (side === 'left') {
                container.style.left = '0px';
                container.style.right = 'auto';
            } else {
                container.style.right = '0px';
                container.style.left = 'auto';
            }

            // Remove tooltip when expanded
            const dragHeader = container.querySelector('#drag-header');
            dragHeader.title = '';

            saveCollapseState(false, side);
        }

        function makeDraggable(container) {
            let isDragging = false;
            let startX, startY, initialX, initialY;
            let autoCollapseTimer;
            let originalWidth = container.offsetWidth;
            let isCollapsed = false;
            let collapseSide = 'right';

            // Set default collapsed state on load
            setTimeout(() => {
                if (!isCollapsed) {
                    // Check if near edge by default
                    const x = container.offsetLeft;
                    const snapResult = checkEdgeSnap(container, x, container.offsetTop);
                    if (snapResult) {
                        collapseWindow(container, snapResult.side);
                        isCollapsed = true;
                        collapseSide = snapResult.side;
                    }
                }
            }, 100);

            const dragHeader = container.querySelector('#drag-header');

            // Load collapse state
            const savedCollapseState = loadCollapseState();
            if (savedCollapseState && savedCollapseState.isCollapsed) {
                isCollapsed = true;
                collapseSide = savedCollapseState.side;
                collapseWindow(container, collapseSide);
            }

            dragHeader.addEventListener('mousedown', function(e) {
                // If collapsed, expand first before dragging
                if (isCollapsed) {
                    expandWindow(container, originalWidth, collapseSide);
                    isCollapsed = false;
                    // Update initial position after expansion
                    initialX = container.offsetLeft;
                    initialY = container.offsetTop;
                } else {
                    initialX = container.offsetLeft;
                    initialY = container.offsetTop;
                }

                isDragging = true;
                startX = e.clientX;
                startY = e.clientY;
                container.style.cursor = 'grabbing';

                // Clear any pending auto-collapse timer
                if (autoCollapseTimer) {
                    clearTimeout(autoCollapseTimer);
                }
            });

            document.addEventListener('mousemove', function(e) {
                if (!isDragging) return;
                const dx = e.clientX - startX;
                const dy = e.clientY - startY;
                container.style.left = (initialX + dx) + 'px';
                container.style.top = (initialY + dy) + 'px';
                container.style.right = 'auto';
            });

            document.addEventListener('mouseup', function(e) {
                if (!isDragging) return;
                isDragging = false;
                container.style.cursor = 'grab';

                const x = container.offsetLeft;
                const y = container.offsetTop;

                // Check for edge snapping
                const snapResult = checkEdgeSnap(container, x, y);
                if (snapResult) {
                    collapseSide = snapResult.side;
                    collapseWindow(container, snapResult.side);
                    isCollapsed = true;
                } else {
                    // If not snapped, ensure window is expanded
                    if (isCollapsed) {
                        expandWindow(container, originalWidth, collapseSide);
                        isCollapsed = false;
                    }
                }

                savePosition(container.offsetLeft, container.offsetTop);
            });

            // Mouse enter/leave events for auto-collapse
            container.addEventListener('mouseenter', function() {
                if (isCollapsed) {
                    expandWindow(container, originalWidth, collapseSide);
                    isCollapsed = false;
                }

                // Clear any pending auto-collapse timer
                if (autoCollapseTimer) {
                    clearTimeout(autoCollapseTimer);
                }
            });

            container.addEventListener('mouseleave', function() {
                if (!isCollapsed) {
                    const screenWidth = window.innerWidth;
                    const actualLeft = container.offsetLeft;
                    const containerWidth = container.offsetWidth;

                    // Check if near left or right edge
                    if (actualLeft <= 10 || actualLeft + containerWidth >= screenWidth - 10) {
                        // Start auto-collapse timer
                        autoCollapseTimer = setTimeout(() => {
                            // Determine which side we're on for collapsing
                            const side = actualLeft <= 10 ? 'left' : 'right';
                            collapseWindow(container, side);
                            isCollapsed = true;
                            collapseSide = side;
                        }, 5000); // 5 seconds delay
                    }
                }
            });
        }

        function setDefaultDates(startDateInput, endDateInput) {
            const today = new Date();
            const fortyFiveDaysAgo = new Date(today.getTime() - 45 * 24 * 60 * 60 * 1000);

            const formatDate = (date) => {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            };

            startDateInput.value = formatDate(fortyFiveDaysAgo);
            endDateInput.value = formatDate(today);
        }

        async function init() {
            const { textarea, button, startDateInput, endDateInput } = createUI();
            const container = document.getElementById('sku-parser-container');

            const savedPosition = loadPosition();
            if (savedPosition) {
                container.style.left = savedPosition.x + 'px';
                container.style.top = savedPosition.y + 'px';
                container.style.right = 'auto';
            }

            makeDraggable(container);
            setDefaultDates(startDateInput, endDateInput);

            const updateClipboard = async () => {
                const clipboardText = await getClipboardText();
                if (clipboardText) {
                    textarea.value = clipboardText;
                    const skus = parseSKUs(clipboardText);
                    document.getElementById('sku-count').textContent = `编码数量: ${skus.length}`;
                }
            };

            await updateClipboard();

            document.addEventListener('visibilitychange', async () => {
                if (!document.hidden) {
                    await updateClipboard();
                }
            });

            textarea.addEventListener('input', function() {
                const skus = parseSKUs(this.value);
                document.getElementById('sku-count').textContent = `编码数量: ${skus.length}`;
            });

            button.addEventListener('click', async function() {
                const text = textarea.value;
                const skus = parseSKUs(text);
                const startDate = startDateInput.value;
                const endDate = endDateInput.value;
                await exportSKUs(skus, startDate, endDate);
            });
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            init();
        }
    })();
