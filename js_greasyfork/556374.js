// ==UserScript==
// @name         TikTok Market Scope Data Extractor
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @license MIT
// @description  抓取 TikTok Market Scope 的商品品类洞察和商品洞察数据
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tiktok.com
// @author       You
// @match        https://marketscope.tiktok.com/brand/merchandise/market-insights*
// @grant        GM_addStyle
// @grant       GM_getResourceText
// @grant GM_xmlhttpRequest
// @connect *.tiktok.com
// @run-at       document-end
// @resource    jqueryBaseCSS https://cdn.jsdelivr.net/npm/jquery-ui@1.13.2/dist/themes/base/jquery-ui.min.css
// @resource    jqueryToastCSS https://cdn.jsdelivr.net/npm/jquery-toast-plugin@1.3.2/dist/jquery.toast.min.css
// @require https://cdn.jsdelivr.net/npm/jquery@3.6.3/dist/jquery.min.js
// @require https://cdn.jsdelivr.net/npm/jquery-ui@1.13.2/dist/jquery-ui.min.js
// @require https://cdn.jsdelivr.net/npm/jquery-toast-plugin@1.3.2/dist/jquery.toast.min.js
// @downloadURL https://update.greasyfork.org/scripts/556374/TikTok%20Market%20Scope%20Data%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/556374/TikTok%20Market%20Scope%20Data%20Extractor.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log('插件代码开始');

    var newCSS = GM_getResourceText("jqueryToastCSS");
    GM_addStyle(newCSS);


    // 添加样式
    GM_addStyle(`
        #marketscope-extractor-panel {
            position: fixed;
            top: 0;
            right: 400px;
            width: auto;
            min-height: 64px;
            background: #fff;
            padding: 4px;
            z-index: 10000;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            display: flex;
            flex-direction: column;
            gap: 0;
        }
        .extractor-section {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }
        .extractor-buttons {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .extractor-label {
            font-size: 12px;
            color: #333;
            min-width: 110px;
            font-weight: 500;
        }
        .extractor-button {
            padding: 0;
            background: none;
            color: #007bff;
            border: none;
            border-radius: 0;
            cursor: pointer;
            font-size: 12px;
            white-space: nowrap;
            text-decoration: underline;
        }
        .extractor-button:hover {
            color: #0056b3;
        }
        .extractor-button:disabled {
            color: #999;
            cursor: not-allowed;
            text-decoration: none;
        }
        .extractor-progress {
            font-size: 10px;
            color: #666;
        }
        .extractor-download {
            padding: 0;
            background: none;
            color: #28a745;
            border: none;
            border-radius: 0;
            cursor: pointer;
            font-size: 12px;
            display: none;
            white-space: nowrap;
            text-decoration: underline;
        }
        .extractor-download:hover {
            color: #218838;
        }
        .extractor-download.show {
            display: inline-block;
        }
        .extractor-pause {
            padding: 0;
            background: none;
            color: #ffc107;
            border: none;
            border-radius: 0;
            cursor: pointer;
            font-size: 12px;
            display: none;
            white-space: nowrap;
            text-decoration: underline;
        }
        .extractor-pause:hover {
            color: #e0a800;
        }
        .extractor-pause.show {
            display: inline-block;
        }
        .extractor-pause.resume {
            color: #17a2b8;
        }
        .extractor-pause.resume:hover {
            color: #138496;
        }
        .extractor-reset {
            padding: 0;
            background: none;
            color: #dc3545;
            border: none;
            border-radius: 0;
            cursor: pointer;
            font-size: 12px;
            white-space: nowrap;
            text-decoration: underline;
        }
        .extractor-reset:hover {
            color: #c82333;
        }
        .extractor-reset:disabled {
            color: #999;
            cursor: not-allowed;
            text-decoration: none;
        }
    `);

    // 等待 jQuery 加载后初始化

    $(function () {
        // 从 URL 获取 accountId
        function getAccountId() {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get('accountId') || '';
        }

        // 从页面获取筛选条件（尝试从页面元素获取，如果获取不到则使用默认值）
        function getFilterParams() {
            let lastDays = 7;
            // 计算 2 天前的日期作为默认值
            const twoDaysAgo = new Date();
            twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
            let endDate, audienceEndDate;
            endDate = audienceEndDate = twoDaysAgo.toISOString().split('T')[0];
            let categoryId = "601450";

            // 尝试从页面获取日期范围选择器的值
            try {
                // 查找日期输入框：限定在 ttms-block-sticky 里的 byted-date-picker-range 的 input
                const dateInput = $('.ttms-block-sticky .byted-date-picker-range input');
                if (dateInput.length > 0) {
                    const dateValue = dateInput.val();
                    // 解析日期格式：2025-08-04 ～ 2025-08-18
                    const dateMatch = dateValue.match(/(\d{4}-\d{2}-\d{2})\s*～\s*(\d{4}-\d{2}-\d{2})/);
                    if (dateMatch) {
                        const startDate = dateMatch[1];
                        endDate = dateMatch[2];

                        // 计算天数差
                        const startDateObj = new Date(startDate);
                        const endDateObj = new Date(endDate);
                        const diffTime = Math.abs(endDateObj - startDateObj);
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

                        lastDays = diffDays;
                        console.log(`从页面提取日期范围: ${startDate} ～ ${endDate}, 天数差: ${diffDays}, endDate: ${endDate}`);
                    }
                }
            } catch (e) {
                console.log('无法从页面获取日期，使用默认值', e);
            }

            return {
                categoryId: categoryId,
                lastDays: lastDays,
                endDate: endDate,
                isDateRangeValid: true,
                categoryAudienceEndDate: audienceEndDate,
                categoryAudienceLastDays: 30
            };
        }

        // 创建面板
        function createPanel() {
            const panel = $(`
                <div id="marketscope-extractor-panel">
                    <div class="extractor-section" id="category-section">
                        <div class="extractor-buttons">
                            <span class="extractor-label">商品品类洞察：</span>
                            <button class="extractor-button" id="btn-category">获取</button>
                            <button class="extractor-pause" id="btn-pause-category">暂停</button>
                            <button class="extractor-download" id="btn-download-category">下载</button>
                            <button class="extractor-reset" id="btn-reset-category">重置</button>
                        </div>
                        <div class="extractor-progress" id="progress-category"></div>
                    </div>
                    <div class="extractor-section" id="product-section">
                        <div class="extractor-buttons">
                            <span class="extractor-label">商品洞察：</span>
                            <button class="extractor-button" id="btn-product">获取</button>
                            <button class="extractor-pause" id="btn-pause-product">暂停</button>
                            <button class="extractor-download" id="btn-download-product">下载</button>
                            <button class="extractor-reset" id="btn-reset-product">重置</button>
                        </div>
                        <div class="extractor-progress" id="progress-product"></div>
                    </div>
                </div>
            `);
            $('body').append(panel);
            return panel;
        }

        // 存储数据
        let categoryData = [];
        let productData = [];

        // 暂停状态管理
        let categoryPaused = false;
        let productPaused = false;

        // 等待恢复的函数
        async function waitForResume(getPausedState) {
            while (getPausedState()) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }

        // 获取请求头
        function getHeaders() {
            return {
                "accept": "application/json, text/plain, */*",
                "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
                "content-type": "application/json",
                "sec-ch-ua": '"Chromium";v="142", "Google Chrome";v="142", "Not_A Brand";v="99"',
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": '"macOS"',
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36",
                "x-ttms-support-lngs": "en,zh"
            };
        }

        // 获取品类洞察数据
        async function fetchCategoryInsights(pageNum, pageSize = 200) {
            const accountId = getAccountId();
            if (!accountId) {
                throw new Error('无法获取 accountId');
            }

            const url = `https://marketscope.tiktok.com/wormhole/merchandise/api/v1/get-category-insights?accountId=${accountId}`;

            const filterParams = getFilterParams();
            const body = {
                "globalFilter": {
                    "categoryId": filterParams.categoryId,
                    "lastDays": Math.min(filterParams.lastDays, 30),
                    "endDate": filterParams.endDate,
                    "isDateRangeValid": filterParams.isDateRangeValid
                },
                "sortList": [],
                "categoryAudienceEndDate": filterParams.categoryAudienceEndDate,
                "categoryAudienceLastDays": filterParams.categoryAudienceLastDays,
                "page": {
                    "pageNum": pageNum,
                    "pageSize": pageSize
                }
            };

            const response = await fetch(url, {
                method: "POST",
                headers: getHeaders(),
                body: JSON.stringify(body),
                redirect: "follow"
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            if (result.code !== 101020000) {
                throw new Error(result.msg || '请求失败');
            }

            return result.data;
        }

        // 获取商品洞察数据
        async function fetchProductInsights(categoryId, pageNum, pageSize = 200) {
            const accountId = getAccountId();
            if (!accountId) {
                throw new Error('无法获取 accountId');
            }

            const url = `https://marketscope.tiktok.com/wormhole/merchandise/api/v1/get-product-insights?accountId=${accountId}`;

            const filterParams = getFilterParams();
            const body = {
                "globalFilter": {
                    "categoryId": categoryId,
                    "lastDays": Math.min(filterParams.lastDays, 30),
                    "endDate": filterParams.endDate,
                    "isDateRangeValid": filterParams.isDateRangeValid
                },
                "sortList": [],
                "page": {
                    "pageNum": pageNum,
                    "pageSize": pageSize
                }
            };

            const response = await fetch(url, {
                method: "POST",
                headers: getHeaders(),
                body: JSON.stringify(body),
                redirect: "follow"
            });


            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            if (result.code !== 101020000) {
                throw new Error(result.msg || '请求失败');
            }

            return result.data;
        }

        // 获取所有品类数据
        async function getAllCategoryData() {
            categoryData = [];
            categoryPaused = false;
            const btn = $('#btn-category');
            const pauseBtn = $('#btn-pause-category');
            const resetBtn = $('#btn-reset-category');
            const progress = $('#progress-category');

            btn.prop('disabled', true);
            resetBtn.prop('disabled', true);
            pauseBtn.addClass('show').text('暂停').removeClass('resume');
            $('#btn-download-category').removeClass('show');
            progress.text('开始获取...');

            try {
                // 先获取第一页，确定总页数
                const firstPage = await fetchCategoryInsights(1);
                categoryData.push(...firstPage.rows);

                // 有数据后立即显示下载按钮
                if (categoryData.length > 0) {
                    $('#btn-download-category').addClass('show');
                }

                const total = parseInt(firstPage.page.total);
                const pageSize = firstPage.page.pageSize;
                const totalPages = Math.ceil(total / pageSize);

                progress.text(`1/${totalPages}`);

                // 获取剩余页面
                for (let page = 2; page <= totalPages; page++) {
                    // 检查是否暂停
                    if (categoryPaused) {
                        progress.text(`已暂停 - ${page - 1}/${totalPages}`);
                        resetBtn.prop('disabled', false);
                        await waitForResume(() => categoryPaused);
                        progress.text(`恢复 - ${page}/${totalPages}`);
                        resetBtn.prop('disabled', true);
                    }

                    const pageData = await fetchCategoryInsights(page);
                    categoryData.push(...pageData.rows);
                    progress.text(`${page}/${totalPages}`);

                    // 确保下载按钮显示（如果有数据）
                    if (categoryData.length > 0) {
                        $('#btn-download-category').addClass('show');
                    }

                    // 添加小延迟避免请求过快
                    await new Promise(resolve => setTimeout(resolve, 200));
                }

                progress.text(`完成！共获取 ${categoryData.length} 条数据`);
                pauseBtn.removeClass('show');
                btn.prop('disabled', false);
                resetBtn.prop('disabled', false);
                // 启用商品洞察按钮和重置按钮
                $('#btn-product').prop('disabled', false);
                $('#btn-reset-product').prop('disabled', false);
            } catch (error) {
                progress.text(`错误: ${error.message}`);
                pauseBtn.removeClass('show');
                btn.prop('disabled', false);
                resetBtn.prop('disabled', false);
                console.error('获取品类数据失败:', error);
            }
        }

        // 获取所有商品数据
        async function getAllProductData() {
            if (categoryData.length === 0) {
                alert('请先完成商品品类洞察数据获取！');
                return;
            }

            productData = [];
            productPaused = false;
            const btn = $('#btn-product');
            const pauseBtn = $('#btn-pause-product');
            const resetBtn = $('#btn-reset-product');
            const progress = $('#progress-product');

            btn.prop('disabled', true);
            resetBtn.prop('disabled', true);
            pauseBtn.addClass('show').text('暂停').removeClass('resume');
            $('#btn-download-product').removeClass('show');
            progress.text('开始获取...');

            try {
                const totalCategories = categoryData.length;

                for (let catIndex = 0; catIndex < totalCategories; catIndex++) {
                    // 检查是否暂停
                    if (productPaused) {
                        progress.text(`已暂停 - 品类 ${catIndex}/${totalCategories}`);
                        resetBtn.prop('disabled', false);
                        await waitForResume(() => productPaused);
                        progress.text(`恢复 - 品类 ${catIndex + 1}/${totalCategories}`);
                        resetBtn.prop('disabled', true);
                    }

                    const category = categoryData[catIndex];
                    const categoryId = category.categoryId;
                    const categoryName = category.categoryName;

                    // 获取第一页，确定总页数
                    const firstPage = await fetchProductInsights(categoryId, 1);
                    const rows = firstPage.rows || [];

                    // 为每条数据添加品类信息
                    rows.forEach(row => {
                        row.categoryId = categoryId;
                        row.categoryName = categoryName;
                    });
                    productData.push(...rows);

                    // 有数据后立即显示下载按钮
                    if (productData.length > 0) {
                        $('#btn-download-product').addClass('show');
                    }

                    const total = parseInt(firstPage.page.total);
                    const pageSize = firstPage.page.pageSize;
                    const totalPages = Math.ceil(total / pageSize);
                    const maxPages = Math.ceil(200 / pageSize); // 最多200条
                    const actualPages = Math.min(totalPages, maxPages);

                    progress.text(`品类 ${catIndex + 1}/${totalCategories}, 页 1/${actualPages}`);

                    // 获取剩余页面（最多200条）
                    for (let page = 2; page <= actualPages; page++) {
                        // 检查是否暂停
                        if (productPaused) {
                            progress.text(`已暂停 - 品类 ${catIndex + 1}/${totalCategories}, 页 ${page - 1}/${actualPages}`);
                            resetBtn.prop('disabled', false);
                            await waitForResume(() => productPaused);
                            progress.text(`恢复 - 品类 ${catIndex + 1}/${totalCategories}, 页 ${page}/${actualPages}`);
                            resetBtn.prop('disabled', true);
                        }

                        const pageData = await fetchProductInsights(categoryId, page);
                        const pageRows = pageData.rows || [];
                        pageRows.forEach(row => {
                            row.categoryId = categoryId;
                            row.categoryName = categoryName;
                        });
                        productData.push(...pageRows);
                        progress.text(`品类 ${catIndex + 1}/${totalCategories}, 页 ${page}/${actualPages}`);

                        // 确保下载按钮显示（如果有数据）
                        if (productData.length > 0) {
                            $('#btn-download-product').addClass('show');
                        }

                        // 添加小延迟避免请求过快
                        await new Promise(resolve => setTimeout(resolve, 200));
                    }
                }

                progress.text(`完成！共获取 ${productData.length} 条数据`);
                pauseBtn.removeClass('show');
                btn.prop('disabled', false);
                resetBtn.prop('disabled', false);
            } catch (error) {
                progress.text(`错误: ${error.message}`);
                pauseBtn.removeClass('show');
                btn.prop('disabled', false);
                resetBtn.prop('disabled', false);
                console.error('获取商品数据失败:', error);
            }
        }

        // 将对象转换为 CSV 行
        function objectToCSVRow(obj) {
            const values = Object.keys(obj).map(key => {
                let value = obj[key];
                if (value === null || value === undefined) {
                    return '';
                }
                let str = String(value);
                // 如果包含逗号、引号或换行符，需要用引号包裹并转义引号
                if (str.includes(',') || str.includes('"') || str.includes('\n')) {
                    str = '"' + str.replace(/"/g, '""') + '"';
                }

                // 如果字段名包含"ttms_"，则值需要套一层 ="value" 来避免CSV软件将类似10-15的数据当作日期
                if (key.includes('ttms_')) {
                    // 删除 逗号
                    str = str.replace(/,/g, '');
                    // 如果 str 没有以 " 包裹，则自动增加 "
                    if (!str.startsWith('"')) {
                        str = '"' + str + '"';
                    }
                    // str.startsWith('=') ? str = str.slice(1) : str = str;
                    return '=' + str;
                }

                return str;
            });
            return values.join(',');
        }

        // 将品类数据转换为 CSV
        function categoryDataToCSV(data) {
            if (data.length === 0) return '';

            // 扁平化数据结构
            const flattened = data.map(item => {
                const row = {
                    categoryId: item.categoryId,
                    categoryName: item.categoryName
                };
                // 展开 datas 对象
                if (item.datas) {
                    Object.keys(item.datas).forEach(key => {
                        row[key] = item.datas[key];
                    });
                }
                return row;
            });

            // 获取所有列名
            const headers = Object.keys(flattened[0]);
            const csvRows = [headers.join(',')];

            // 添加数据行
            flattened.forEach(row => {
                csvRows.push(objectToCSVRow(row));
            });

            return csvRows.join('\n');
        }

        // 将商品数据转换为 CSV
        function productDataToCSV(data) {
            if (data.length === 0) return '';

            // 创建品类数据映射，方便快速查找
            const categoryMap = {};
            categoryData.forEach(cat => {
                categoryMap[cat.categoryId] = cat;
            });

            // 扁平化数据结构
            const flattened = data.map(item => {
                const row = {};



                // 展开 productInfo 对象（动态遍历所有字段）
                if (item.productInfo) {
                    Object.keys(item.productInfo).forEach(key => {
                        row[`product_${key}`] = item.productInfo[key] || '';
                    });
                }

                // 展开商品的 datas 对象
                if (item.datas) {
                    Object.keys(item.datas).forEach(key => {
                        row[key] = item.datas[key];
                    });
                }

                // 添加对应品类的所有信息
                const category = categoryMap[item.categoryId];
                if (category) {
                    // 添加品类的基础信息
                    row.categoryId = category.categoryId || '';
                    row.categoryName = category.categoryName || '';

                    // 展开品类的 datas 对象，添加 category_ 前缀避免冲突
                    if (category.datas) {
                        Object.keys(category.datas).forEach(key => {
                            row[`category_${key}`] = category.datas[key];
                        });
                    }
                } else {
                    row.categoryId = '';
                    row.categoryName = '';
                }

                return row;
            });

            // 获取所有列名
            const headers = Object.keys(flattened[0]);
            const csvRows = [headers.join(',')];

            // 添加数据行
            flattened.forEach(row => {
                csvRows.push(objectToCSVRow(row));
            });

            return csvRows.join('\n');
        }

        // 下载 CSV 文件
        function downloadCSV(csvContent, filename) {
            const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }

        // 重置品类数据
        function resetCategoryData() {
            categoryData = [];
            categoryPaused = false;

            $('#btn-category').prop('disabled', false);
            $('#btn-pause-category').removeClass('show resume').text('暂停');
            $('#btn-download-category').removeClass('show');
            $('#btn-reset-category').prop('disabled', true);
            $('#progress-category').text('');

            // 如果品类数据被清空，也需要禁用商品洞察按钮和重置按钮
            $('#btn-product').prop('disabled', true);
            $('#btn-reset-product').prop('disabled', true);
            // 清空商品数据时也隐藏下载按钮
            if (productData.length === 0) {
                $('#btn-download-product').removeClass('show');
            }
        }

        // 重置商品数据
        function resetProductData() {
            productData = [];
            productPaused = false;

            $('#btn-product').prop('disabled', categoryData.length === 0);
            $('#btn-pause-product').removeClass('show resume').text('暂停');
            $('#btn-download-product').removeClass('show');
            $('#btn-reset-product').prop('disabled', categoryData.length === 0);
            $('#progress-product').text('');
        }

        // 初始化面板和事件绑定
        const panel = createPanel();

        // 初始化时禁用商品洞察按钮和重置按钮（需要先完成品类数据获取）
        $('#btn-product').prop('disabled', true);
        $('#btn-reset-category').prop('disabled', true);
        $('#btn-reset-product').prop('disabled', true);

        $('#btn-category').on('click', getAllCategoryData);
        $('#btn-product').on('click', getAllProductData);

        // 品类数据暂停/恢复按钮
        $('#btn-pause-category').on('click', function () {
            const pauseBtn = $(this);
            const resetBtn = $('#btn-reset-category');
            if (categoryPaused) {
                // 恢复
                categoryPaused = false;
                pauseBtn.text('暂停').removeClass('resume');
                resetBtn.prop('disabled', true);
            } else {
                // 暂停
                categoryPaused = true;
                pauseBtn.text('恢复').addClass('resume');
                resetBtn.prop('disabled', false);
            }
        });

        // 商品数据暂停/恢复按钮
        $('#btn-pause-product').on('click', function () {
            const pauseBtn = $(this);
            const resetBtn = $('#btn-reset-product');
            if (productPaused) {
                // 恢复
                productPaused = false;
                pauseBtn.text('暂停').removeClass('resume');
                resetBtn.prop('disabled', true);
            } else {
                // 暂停
                productPaused = true;
                pauseBtn.text('恢复').addClass('resume');
                resetBtn.prop('disabled', false);
            }
        });

        $('#btn-download-category').on('click', function () {
            if (categoryData.length === 0) {
                alert('没有可下载的数据！');
                return;
            }
            const csv = categoryDataToCSV(categoryData);
            const date = new Date().toISOString().split('T')[0];
            downloadCSV(csv, `category-insights-${date}.csv`);
        });

        $('#btn-download-product').on('click', function () {
            if (productData.length === 0) {
                alert('没有可下载的数据！');
                return;
            }
            const csv = productDataToCSV(productData);
            const date = new Date().toISOString().split('T')[0];
            downloadCSV(csv, `product-insights-${date}.csv`);
        });

        // 品类数据重置按钮
        $('#btn-reset-category').on('click', function () {
            if (confirm('确定要重置商品品类洞察数据吗？')) {
                resetCategoryData();
            }
        });

        // 商品数据重置按钮
        $('#btn-reset-product').on('click', function () {
            if (confirm('确定要重置商品洞察数据吗？')) {
                resetProductData();
            }
        });
    });
})();

