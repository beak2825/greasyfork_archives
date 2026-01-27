// ==UserScript==
// @name         三叉戟-发版管理-表格增强
// @namespace    http://tampermonkey.net/
// @version      1.6.0
// @description  发版管理页面，相关功能的增强实现 (增加完整调试日志+扩大查询范围)
// @author       shrek_maxi
// @match        https://poseidon.cisdigital.cn/app/devops*
// @match        https://poseidon.cisdigital.cn/devops*
// @match        *://*/app/devops*
// @icon         https://poseidon.cisdigital.cn/favicon.ico
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @require      https://unpkg.com/xlsx/dist/xlsx.full.min.js
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/563581/%E4%B8%89%E5%8F%89%E6%88%9F-%E5%8F%91%E7%89%88%E7%AE%A1%E7%90%86-%E8%A1%A8%E6%A0%BC%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/563581/%E4%B8%89%E5%8F%89%E6%88%9F-%E5%8F%91%E7%89%88%E7%AE%A1%E7%90%86-%E8%A1%A8%E6%A0%BC%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // 脚本版本信息
    const SCRIPT_VERSION = "1.6.0";
    const SCRIPT_NAME = "三叉戟-发版管理-表格增强";
    
    // 可能的 releases API 路径 (/api 在前)
    const RELEASES_API_PATHS = [
        "/api/devops/releases/",    // 主路径
        "/api/releases/",           // 备选路径
    ];

    // 支持多种 URL 格式 (v1.7.0+ 兼容)
    const releaseUrlPatterns = [
        "poseidon.cisdigital.cn/app/devops/releases",
        "/app/devops/releases",
        "/devops/releases",
    ];
    let isFirstLoad = true;
    let projectName;
    let productName;
    let productDisplayName;
    let currentArchived = 0; // 0: 未归档, 1: 已归档
    let observer = null;
    let releaseDataCache = {}; // 缓存版本数据 {name: id}

    // 显示版本信息
    console.log(`%c[${SCRIPT_NAME}]`, 'color: #409EFF; font-weight: bold; font-size: 14px;', 
                `版本 ${SCRIPT_VERSION} 已加载`);
    console.log(`%c[${SCRIPT_NAME}]`, 'color: #67C23A;', 
                `当前生效版本: v${SCRIPT_VERSION}`);

    // 注入CSS样式确保发版日志按钮文字完整显示
    GM_addStyle(`
        .release-log-btn {
            white-space: nowrap !important;
            overflow: visible !important;
            text-overflow: unset !important;
        }
        /* 让操作列允许内容溢出 */
        .el-table td:last-child,
        .el-table td:last-child .cell,
        .el-table td:last-child .el-space,
        .el-table td:last-child .el-space__item {
            overflow: visible !important;
        }
        /* 让包含发版日志按钮的容器不换行 */
        .el-space--horizontal:has(.release-log-btn) {
            flex-wrap: nowrap !important;
        }
    `);

    initial();

    function initial() {
        console.log(`[${SCRIPT_NAME}] 脚本初始化... (v${SCRIPT_VERSION})`);
        // vue单页面框架，需要根据URL的变化执行相应的操作
        let lastUrl = location.href;
        new MutationObserver(() => {
            const url = location.href;
            if (isFirstLoad || url !== lastUrl) {
                lastUrl = url;
                onUrlChange();
                isFirstLoad = false;
            }
        }).observe(document, { subtree: true, childList: true });

        // 监听tab切换（归档/未归档）
        document.addEventListener('click', function (e) {
            // 支持多种 tab 选择器
            const tabItem = e.target.closest('.el-tabs__item') || 
                           e.target.closest('[role="tab"]') ||
                           e.target.closest('.tab-item');
            const isReleasePage = releaseUrlPatterns.some(pattern => location.href.includes(pattern));
            
            if (tabItem && isReleasePage) {
                // 延迟执行以等待tab内容加载
                setTimeout(() => {
                    detectArchivedTab();
                    reloadTableEnhancements();
                }, 500);
            }
        });
    }

    function detectArchivedTab() {
        // 检测当前是否在已归档tab
        const activeTab = document.querySelector('.el-tabs__item.is-active');
        if (activeTab) {
            const tabText = activeTab.textContent.trim();
            currentArchived = tabText.includes('已归档') ? 1 : 0;
            console.log(`[${SCRIPT_NAME}] 当前Tab: ${tabText}, archived=${currentArchived}`);
        }
    }

    function createObserver() {
        return new MutationObserver((mutations, me) => {
        console.log(`[${SCRIPT_NAME}] 版本管理页面dom发生变化`);
        if (isPageLoaded()) {
            console.log(`[${SCRIPT_NAME}] 页面加载完毕`);
                me.disconnect();
            console.log(`[${SCRIPT_NAME}] 停止监听版本管理页面`);
                initializePageEnhancements();
            }
        });
    }

    function initializePageEnhancements() {
        try {
            detectArchivedTab();

            // 尝试多种方式获取项目和产品显示名称
            let projectDisplayName = getProjectDisplayName();
            let productDisplayNameValue = getProductDisplayName();
            
            productDisplayName = productDisplayNameValue;
            
            // 如果 DOM 方式失败，尝试从 URL 获取 (v1.7.0 使用数字 ID)
            if (!productDisplayName || !projectDisplayName) {
                const urlParams = new URLSearchParams(window.location.search);
                const urlProject = urlParams.get('project');
                const urlProduct = urlParams.get('product');
                
                if (urlProject && urlProduct) {
                    console.log(`[${SCRIPT_NAME}] 从 URL 获取项目产品 ID: ${urlProject}/${urlProduct}`);
                    // v1.7.0 使用数字 ID，需要通过 API 转换为名称
                    continueInitialization(urlProject, urlProduct);
                    return;
                }
            }
            
            if (!productDisplayName) {
                console.warn(
                    `[${SCRIPT_NAME}] 无法获取产品信息，尝试延迟重试...`
                );
                // 延迟重试一次
                setTimeout(() => {
                    productDisplayName = getProductDisplayName();
                    if (productDisplayName) {
                        continueInitialization(projectDisplayName, productDisplayName);
                    } else {
                        console.error(`[${SCRIPT_NAME}] 获取产品信息最终失败`);
                    }
                }, 1000);
                return;
            }
            
            continueInitialization(projectDisplayName, productDisplayName);
            
        } catch (error) {
            console.error(`[${SCRIPT_NAME}] initializePageEnhancements错误: ${error}`);
            console.error(error.stack);
        }
    }
    
    // 获取项目显示名称
    function getProjectDisplayName() {
        const selectors = [
            "#base-app .selector-project .el-select-dropdown__item.selected",
            ".selector-project .selected",
            "[class*='selector-project'] .selected",
            ".project-select .el-input__inner",
            ".header-selector .project .selected-text",
        ];
        
        for (const selector of selectors) {
            const el = document.querySelector(selector);
            if (el?.textContent?.trim()) {
                return el.textContent.trim();
            }
        }
        return null;
    }
    
    // 获取产品显示名称
    function getProductDisplayName() {
        const selectors = [
            "#base-app .selector-product .el-select-dropdown__item.selected",
            ".selector-product .selected",
            "[class*='selector-product'] .selected",
            ".product-select .el-input__inner",
            ".header-selector .product .selected-text",
            "body > div.el-select-dropdown .el-select-dropdown__item.selected",
        ];
        
        for (const selector of selectors) {
            const el = document.querySelector(selector);
            if (el?.textContent?.trim()) {
                return el.textContent.trim();
            }
        }
        return null;
    }
    
    // 继续初始化流程
    function continueInitialization(projDisplayName, prodDisplayName) {
        fetchProjectList()
            .then((projectList) => {
                const urlParams = new URLSearchParams(window.location.search);
                const urlProjectId = urlParams.get('project');
                const urlProductId = urlParams.get('product');
                
                if (projectList && projectList.length > 0) {
                    projectList.forEach((project) => {
                        // 支持通过 ID、名称或显示名称匹配
                        const projectIdMatch = String(project.id) === urlProjectId;
                        const projectNameMatch = project.display_name === projDisplayName || project.name === projDisplayName;
                        
                        if (projectIdMatch || projectNameMatch) {
                            projectName = project.name; // 使用 API 名称，不是 ID
                            console.log(`[${SCRIPT_NAME}] 匹配到项目: id=${project.id}, name=${project.name}`);
                            
                            project.products.forEach((product) => {
                                const productIdMatch = String(product.id) === urlProductId;
                                const productNameMatch = product.display_name === prodDisplayName || product.name === prodDisplayName;
                                
                                if (productIdMatch || productNameMatch) {
                                    productName = product.name; // 使用 API 名称，不是 ID
                                    console.log(`[${SCRIPT_NAME}] 匹配到产品: id=${product.id}, name=${product.name}`);
                                }
                            });
                        }
                    });
                }
                
                if (projectName && productName) {
                    proceedWithProjectProduct();
                } else {
                    console.error(
                        `[${SCRIPT_NAME}] 无法从项目列表中找到匹配项，urlProjectId=${urlProjectId}, urlProductId=${urlProductId}`
                    );
                    console.log(`[${SCRIPT_NAME}] 可用项目列表:`, projectList?.map(p => ({id: p.id, name: p.name})));
                }
            })
            .catch((error) => {
                console.error(`[${SCRIPT_NAME}] Error fetching project list: ${error}`);
            });
    }
    
    // 使用项目和产品信息进行页面增强
    function proceedWithProjectProduct() {
        console.log(`[${SCRIPT_NAME}] project=${projectName}, product=${productName}`);
        addVersionBadge();
        addIdColumn();
        removeColumn('新建时间');
        removeColumn('ID');
        removeEditButtons();
        addReleaseNoteButton();
        // 根据当前tab获取对应的数据
        fetchReleaseList(currentArchived)
            .then((data) => {
                cacheReleaseData(data); // 缓存数据
                updateTableWithRealIds(data);
            })
            .catch((error) => {
                console.error(`[${SCRIPT_NAME}] Error fetching release list: ${error}`);
            });
    }

    function reloadTableEnhancements() {
        // 重新加载表格增强
        console.log(`[${SCRIPT_NAME}] 重新加载表格增强...`);
        enableTableObserver();
    }

    function onUrlChange() {
        const currUrl = location.href;
        console.log(`[${SCRIPT_NAME}] URL changed!`, currUrl);
        
        // 检查是否匹配任何版本管理页面 URL
        const isReleasePage = releaseUrlPatterns.some(pattern => currUrl.includes(pattern));
        if (isReleasePage) {
            console.log(`[${SCRIPT_NAME}] 检测到版本管理页面`);
            enableTableObserver();
        }
    }

    function enableTableObserver() {
        if (observer) {
            observer.disconnect();
        }
        observer = createObserver();
        console.log(`[${SCRIPT_NAME}] 开始监听版本管理页面`);
        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }

    function isPageLoaded() {
        // 多种表格头部选择器
        const headerSelectors = [
            ".el-table__header-wrapper .el-table__header thead tr",
            ".el-table thead tr",
            "table thead tr",
        ];
        
        // 多种表格行选择器
        const bodyRowSelectors = [
            ".el-table__body-wrapper .el-table__body tbody tr",
            ".el-table tbody tr.el-table__row",
            "table tbody tr",
        ];
        
        // 多种项目选择器 (v1.7.0 可能有变化)
        const projectSelectors = [
            "#base-app .selector-project .el-select-dropdown__item.selected",
            ".selector-project .selected",
            "[class*='selector-project'] .selected",
            ".header .project-selector .selected",
            ".el-select-dropdown__item.selected", // 通用选择器
        ];
        
        // 多种产品选择器
        const productSelectors = [
            "#base-app .selector-product .el-select-dropdown__item.selected",
            ".selector-product .selected",
            "[class*='selector-product'] .selected",
            ".header .product-selector .selected",
        ];
        
        // 检查表格头部
        let headerRow = null;
        for (const selector of headerSelectors) {
            headerRow = document.querySelector(selector);
            if (headerRow) break;
        }
        
        // 检查表格行
        let bodyRows = [];
        for (const selector of bodyRowSelectors) {
            bodyRows = document.querySelectorAll(selector);
            if (bodyRows.length > 0) break;
        }
        
        // 检查项目选择
        let project = null;
        for (const selector of projectSelectors) {
            project = document.querySelector(selector);
            if (project) break;
        }
        
        // 检查产品选择
        let product = null;
        for (const selector of productSelectors) {
            product = document.querySelector(selector);
            if (product) break;
        }
        
        const isLoaded = headerRow && bodyRows && bodyRows.length > 0 && (project || product);
        
        if (!isLoaded && bodyRows.length > 0) {
            // 如果有表格数据但没有选择器，可能是新版本 UI
            // 尝试从 URL 获取项目和产品信息
            const urlParams = new URLSearchParams(window.location.search);
            const urlProject = urlParams.get('project');
            const urlProduct = urlParams.get('product');
            
            if (urlProject || urlProduct) {
                console.log(`[${SCRIPT_NAME}] 从 URL 获取: project=${urlProject}, product=${urlProduct}`);
                return true;
            }
        }
        
        return isLoaded;
    }

    function addReleaseNoteDom(releaseDetail, taskList, checkResults) {
        addModalStyles();
        document.getElementById("release-log-modal")?.remove();
        const modalHtml = buildModalContent(releaseDetail, taskList, checkResults);
        document.body.insertAdjacentHTML("beforeend", modalHtml);
        setupModal();
    }

    function getCookie(cookieName) {
        var strCookie = document.cookie;
        var arrCookie = strCookie.split("; ");
        for (var i = 0; i < arrCookie.length; i++) {
            var arr = arrCookie[i].split("=");
            if (cookieName == arr[0]) {
                return arr[1];
            }
        }
        return "";
    }
    
    // 获取 Poseidon Token (支持多种存储位置)
    function getPoseidonToken() {
        // 优先尝试从 localStorage 获取 (v1.7.0+ 使用 platform_base_token)
        const localStorageKeys = [
            'platform_base_token',      // v1.7.0+ 新格式
            'poseidon_user_token',
            'poseidon_token',
            'token',
            'access_token'
        ];
        
        for (const key of localStorageKeys) {
            try {
                const token = localStorage.getItem(key);
                if (token) {
                    console.log(`[三叉戟] 从 localStorage "${key}" 获取到 Token`);
                    return token;
                }
            } catch (e) {
                // localStorage 可能不可用
            }
        }
        
        // 尝试多种 Cookie 名称
        const cookieNames = [
            'poseidon_user_token',
            'poseidon_token',
            'token',
            'access_token',
            'jwt_token'
        ];
        
        for (const name of cookieNames) {
            const token = getCookie(name);
            if (token) {
                console.log(`[三叉戟] 从 Cookie "${name}" 获取到 Token`);
                return token;
            }
        }
        
        // 尝试从 sessionStorage 获取
        const sessionStorageKeys = [
            'platform_base_token',
            'poseidon_user_token',
            'poseidon_token',
            'token',
            'access_token'
        ];
        
        for (const key of sessionStorageKeys) {
            try {
                const token = sessionStorage.getItem(key);
                if (token) {
                    console.log(`[三叉戟] 从 sessionStorage "${key}" 获取到 Token`);
                    return token;
                }
            } catch (e) {
                // sessionStorage 可能不可用
            }
        }
        
        console.warn('[三叉戟] 未能找到 Token，尝试列出所有存储位置...');
        debugTokenLocations();
        
        return "";
    }
    
    // 获取带 Bearer 前缀的 Authorization 头
    function getAuthorizationHeader() {
        const token = getPoseidonToken();
        if (!token) {
            console.error('[三叉戟] 无法获取 Token');
            return '';
        }
        
        // 如果 token 已经包含 Bearer 前缀，直接返回
        if (token.startsWith('Bearer ')) {
            return token;
        }
        
        // 否则添加 Bearer 前缀
        return `Bearer ${token}`;
    }
    
    // 调试：列出所有可能的 Token 存储位置
    function debugTokenLocations() {
        console.log('=== [三叉戟] Token 存储位置调试 ===');
        
        // 列出所有 Cookie
        console.log('Cookies:');
        document.cookie.split(';').forEach(cookie => {
            const [name, value] = cookie.trim().split('=');
            if (name.toLowerCase().includes('token') || name.toLowerCase().includes('auth') || name.toLowerCase().includes('jwt')) {
                console.log(`  ${name}: ${value ? value.substring(0, 30) + '...' : '(empty)'}`);
            }
        });
        
        // 列出 localStorage 中的 token 相关项
        console.log('localStorage:');
        try {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key.toLowerCase().includes('token') || key.toLowerCase().includes('auth') || key.toLowerCase().includes('jwt')) {
                    const value = localStorage.getItem(key);
                    console.log(`  ${key}: ${value ? value.substring(0, 30) + '...' : '(empty)'}`);
                }
            }
        } catch (e) {
            console.log('  (无法访问)');
        }
        
        console.log('=== 调试结束 ===');
    }

    // 缓存版本数据
    function cacheReleaseData(data) {
        releaseDataCache = {};
        if (data && Array.isArray(data)) {
            data.forEach(item => {
                releaseDataCache[item.name] = item.id;
            });
        }
        console.log("[三叉戟] 版本数据已缓存，共", Object.keys(releaseDataCache).length, "条");
    }

    // 根据版本名称查找ID
    function findReleaseIdByName(name) {
        return releaseDataCache[name] || null;
    }

    function removeColumn(columnName) {
        for (let i = 0; i++; i < 2) {
            const headers = document.querySelectorAll(
                `.el-table__${i == 0 ? "fixed-" : ""
                }header-wrapper .el-table__header thead th`
            );
            let columnIndex = -1;
            headers.forEach((th, index) => {
                if (th.textContent.trim() === columnName) {
                    columnIndex = index;
                    th.remove();
                }
            });

            if (columnIndex !== -1) {
                const cols = document.querySelector(
                    `.el-table__${i == 0 ? "fixed-" : ""
                    }header-wrapper .el-table__header colgroup col`
                );
                if (cols && cols[columnIndex]) {
                    cols[columnIndex].remove();
                }
                const bodyCols = document.querySelectorAll(
                    `.el-table__${i == 0 ? "fixed-" : ""
                    }body-wrapper .el-table__body colgroup col`
                );
                if (bodyCols && bodyCols[columnIndex]) {
                    bodyCols[columnIndex].remove();
                }
            }

            const rows = document.querySelectorAll(
                `.el-table__${i == 0 ? "fixed-" : ""
                }body-wrapper .el-table__body tbody tr`
            );
            rows.forEach((row) => {
                const cells = row.querySelectorAll("td");
                if (cells[columnIndex]) {
                    cells[columnIndex].remove();
                }
            });
        }
    }

    function removeEditButtons() {
        const actionGroups = document.querySelectorAll(".table-action-group");
        if (actionGroups && actionGroups.length > 0) {
            actionGroups.forEach((group) => {
                const actionItems = group.querySelectorAll(".table-action-item");
                actionItems.forEach((item) => {
                    const buttonText = Array.from(
                        item.querySelectorAll("button, button *")
                    )
                        .map((e) => e.textContent.trim())
                        .join("");
                    if (buttonText.includes("编辑")) {
                        item.remove();
                        console.log("删除编辑按钮");
                    }
                });
            });
        }
    }

    function addIdColumn() {
        console.log("[三叉戟] 添加ID列");
        try {
        const headerRow = document.querySelector(
            ".el-table__header-wrapper .el-table__header thead tr"
        );
        const colgroup = document.querySelector(
            ".el-table__header-wrapper .el-table__header colgroup"
        );
        const bodyColgroup = document.querySelector(
            ".el-table__body-wrapper .el-table__body colgroup"
        );
        const colgroupFixed = document.querySelector(
            ".el-table__fixed-header-wrapper .el-table__header colgroup"
        );
        const bodyColgroupFixed = document.querySelector(
            ".el-table__fixed-body-wrapper .el-table__body colgroup"
        );

            if (!headerRow || !colgroup || !bodyColgroup) {
                console.error("[三叉戟] 无法找到表格元素");
                return;
            }

        const newCol = document.createElement("col");
        newCol.style.width = "240px";
        if (colgroup.firstChild) {
            colgroup.insertBefore(newCol, colgroup.firstChild);
        } else {
            colgroup.appendChild(newCol);
        }
        if (bodyColgroup.firstChild) {
            bodyColgroup.insertBefore(
                newCol.cloneNode(true),
                bodyColgroup.firstChild
            );
        } else {
            bodyColgroup.appendChild(newCol.cloneNode(true));
        }

            if (colgroupFixed && colgroupFixed.firstChild) {
            colgroupFixed.insertBefore(
                newCol.cloneNode(true),
                colgroupFixed.firstChild
            );
            } else if (colgroupFixed) {
            colgroupFixed.appendChild(newCol.cloneNode(true));
        }
            if (bodyColgroupFixed && bodyColgroupFixed.firstChild) {
            bodyColgroupFixed.insertBefore(
                newCol.cloneNode(true),
                bodyColgroupFixed.firstChild
            );
            } else if (bodyColgroupFixed) {
            bodyColgroupFixed.appendChild(newCol.cloneNode(true));
        }

        const idHeader = document.createElement("th");
        idHeader.innerHTML = '<div class="cell">ID</div>';
        headerRow.insertBefore(idHeader, headerRow.firstChild);

            // 获取主表格和固定表格的行
            const mainRows = document.querySelectorAll(
                ".el-table__body-wrapper .el-table__body tbody tr"
            );
            const fixedRows = document.querySelectorAll(
                ".el-table__fixed-body-wrapper .el-table__body tbody tr"
            );

            // 同步添加ID单元格，并确保行高一致
            mainRows.forEach((row, index) => {
                const idCell = document.createElement("td");
                idCell.innerHTML = '<div class="cell"></div>';
                // 设置与原有单元格相同的类名
                idCell.className = row.cells[0]?.className || '';
                row.insertBefore(idCell, row.firstChild);

                // 同步固定表格
                if (fixedRows[index]) {
                    const fixedIdCell = document.createElement("td");
                    fixedIdCell.innerHTML = '<div class="cell"></div>';
                    fixedIdCell.className = fixedRows[index].cells[0]?.className || '';
                    fixedRows[index].insertBefore(fixedIdCell, fixedRows[index].firstChild);

                    // 确保行高一致
                    syncRowHeight(row, fixedRows[index]);
                }
            });
            console.log("[三叉戟] ID列添加完成");
        } catch (error) {
            console.error("[三叉戟] addIdColumn错误:", error);
        }
    }

    // 同步行高
    function syncRowHeight(mainRow, fixedRow) {
        // 使用 requestAnimationFrame 确保 DOM 更新完成后再同步高度
        requestAnimationFrame(() => {
            const mainHeight = mainRow.offsetHeight;
            const fixedHeight = fixedRow.offsetHeight;
            const maxHeight = Math.max(mainHeight, fixedHeight);

            if (mainHeight !== fixedHeight) {
                mainRow.style.height = maxHeight + 'px';
                fixedRow.style.height = maxHeight + 'px';

                // 同步每个单元格的高度
                Array.from(mainRow.cells).forEach((cell, i) => {
                    if (fixedRow.cells[i]) {
                        cell.style.height = maxHeight + 'px';
                        fixedRow.cells[i].style.height = maxHeight + 'px';
                    }
                });
            }
            });
    }

    // 添加版本标签到页面
    function addVersionBadge() {
        // 如果已经存在，先移除
        const existingBadge = document.getElementById('script-version-badge');
        if (existingBadge) {
            existingBadge.remove();
        }

        // 创建版本标签
        const badge = document.createElement('div');
        badge.id = 'script-version-badge';
        badge.className = 'script-version-badge';
        badge.textContent = `${SCRIPT_NAME} v${SCRIPT_VERSION}`;
        badge.title = `当前生效的脚本版本: v${SCRIPT_VERSION}\n点击查看控制台详细信息`;
        
        // 点击时在控制台显示详细信息
        badge.addEventListener('click', function() {
            console.log(`%c[${SCRIPT_NAME}]`, 'color: #409EFF; font-weight: bold; font-size: 14px;', 
                        `版本信息`);
            console.log(`  版本号: v${SCRIPT_VERSION}`);
            console.log(`  脚本名称: ${SCRIPT_NAME}`);
            console.log(`  加载时间: ${new Date().toLocaleString()}`);
        });

        document.body.appendChild(badge);
        console.log(`[${SCRIPT_NAME}] 版本标签已添加到页面 (v${SCRIPT_VERSION})`);
    }

    function addReleaseNoteButton() {
        console.log("[三叉戟] 添加发版日志按钮 (v1.4.0)");

        try {
            // 尝试多种选择器以适配不同版本的 Poseidon
            // v1.7.0+ 可能使用不同的 DOM 结构
            const actionGroupSelectors = [
                ".table-action-group",           // 原始选择器
                ".el-table__fixed-right .cell",  // 固定右侧列
                "[class*='action']",             // 包含 action 的类
                ".operation-column",             // 操作列
                "td:last-child .cell",           // 最后一列的单元格
            ];
            
            // 尝试多种行选择器
            const rowSelectors = [
                ".el-table__fixed-body-wrapper .el-table__body tbody tr",
                ".el-table__fixed-right-wrapper .el-table__body tbody tr",
                ".el-table__body-wrapper .el-table__body tbody tr",
                ".el-table tbody tr",
                "table tbody tr.el-table__row",
            ];
            
            let fixedRows = [];
            let mainRows = [];
            let usedRowSelector = "";
            
            // 找到有效的行选择器
            for (const selector of rowSelectors) {
                const rows = document.querySelectorAll(selector);
                if (rows.length > 0) {
                    if (selector.includes('fixed')) {
                        fixedRows = rows;
                        console.log(`[三叉戟] 固定行选择器: ${selector}, 找到 ${rows.length} 行`);
                    } else if (mainRows.length === 0) {
                        mainRows = rows;
                        usedRowSelector = selector;
                        console.log(`[三叉戟] 主表行选择器: ${selector}, 找到 ${rows.length} 行`);
                    }
                }
            }
            
            // 如果没有固定列，使用主表行
            if (fixedRows.length === 0 && mainRows.length > 0) {
                fixedRows = mainRows;
                console.log("[三叉戟] 使用主表行作为目标行");
            }

            console.log(`[三叉戟] 最终: ${fixedRows.length} 个固定行, ${mainRows.length} 个主表行`);
            
            if (fixedRows.length === 0) {
                console.warn("[三叉戟] 未找到表格行，可能页面结构已变化");
                debugPageStructure();
                return;
            }

            let buttonsAdded = 0;
            fixedRows.forEach((row, index) => {
                // 尝试多种选择器找到操作区域
                let actionGroup = null;
                for (const selector of actionGroupSelectors) {
                    actionGroup = row.querySelector(selector);
                    if (actionGroup) {
                        // 验证这是操作列而不是数据列
                        const isActionColumn = actionGroup.closest('td:last-child') || 
                                              actionGroup.classList.contains('table-action-group') ||
                                              actionGroup.querySelector('button');
                        if (isActionColumn) {
                            break;
                        }
                        actionGroup = null;
                    }
                }
                
                if (actionGroup) {
                    // 检查是否已经添加过按钮
                    if (row.querySelector('.release-log-btn')) {
                        return;
                    }

                    // 调试：输出 actionGroup 的 HTML 结构（仅第一行）
                    if (index === 0) {
                        console.log("[三叉戟] actionGroup HTML:", actionGroup.innerHTML);
                        console.log("[三叉戟] actionGroup 子元素数量:", actionGroup.children.length);
                        Array.from(actionGroup.children).forEach((child, i) => {
                            console.log(`[三叉戟] 子元素${i}: tagName=${child.tagName}, className=${child.className}, text=${child.textContent.trim().substring(0, 20)}`);
                        });
                    }

                    // 查找所有现有按钮和它们的包装元素
                    const existingBtns = actionGroup.querySelectorAll('button, .el-button');
                    const lastBtn = existingBtns.length > 0 ? existingBtns[existingBtns.length - 1] : null;
                    
                    // 找到按钮的直接父包装元素（如果有的话）
                    let lastBtnWrapper = null;
                    if (lastBtn && lastBtn.parentNode !== actionGroup) {
                        lastBtnWrapper = lastBtn.parentNode;
                        if (index === 0) {
                            console.log("[三叉戟] 按钮有包装元素:", lastBtnWrapper.tagName, lastBtnWrapper.className);
                        }
                    }
                    
                    // 创建按钮
                    const btn = document.createElement("button");
                    btn.setAttribute("type", "button");
                    btn.setAttribute("data-row-index", index.toString());
                    btn.setAttribute("title", "发版日志"); // 鼠标悬停显示完整文本
                    btn.textContent = "发版日志";
                    btn.className = "el-button el-button--text release-log-btn";
                    btn.style.cssText = "color: var(--cs-color_primary, #409EFF); cursor: pointer; pointer-events: auto; background: transparent; border: none; padding: 0; font-size: 14px; white-space: nowrap;";
                    
                    if (lastBtn) {
                        // 复制现有按钮的类名
                        const cleanClass = lastBtn.className
                            .replace(/is-disabled/g, '')
                            .replace(/disabled/g, '')
                            .replace(/release-log-btn/g, '')
                            .trim();
                        btn.className = cleanClass + ' release-log-btn';
                    }
                    
                    // 如果按钮有包装元素，克隆包装元素的结构
                    if (lastBtnWrapper) {
                        const wrapper = lastBtnWrapper.cloneNode(false); // 只克隆元素本身，不克隆子节点
                        wrapper.innerHTML = ''; // 清空
                        wrapper.style.cssText += "; overflow: visible; flex-shrink: 0;";
                        wrapper.appendChild(btn);
                        
                        // 在最后一个按钮的包装元素之后插入
                        if (lastBtnWrapper.nextSibling) {
                            lastBtnWrapper.parentNode.insertBefore(wrapper, lastBtnWrapper.nextSibling);
                        } else {
                            lastBtnWrapper.parentNode.appendChild(wrapper);
                        }
                        
                        // 强制让父容器和表格单元格允许溢出
                        const elSpace = wrapper.closest('.el-space');
                        if (elSpace) {
                            elSpace.style.overflow = 'visible';
                            elSpace.style.flexWrap = 'nowrap';
                        }
                        const cell = wrapper.closest('.cell');
                        if (cell) {
                            cell.style.overflow = 'visible';
                        }
                        const td = wrapper.closest('td');
                        if (td) {
                            td.style.overflow = 'visible';
                        }
                    } else {
                        // 没有包装元素，直接追加到 actionGroup
                        actionGroup.appendChild(btn);
                    }
                    btn.removeAttribute("disabled");
                    
                    buttonsAdded++;

                    // 同步行高
                    if (mainRows[index] && mainRows[index] !== row) {
                        syncRowHeight(mainRows[index], row);
                    }
                } else if (index === 0) {
                    // 首行找不到操作区域，输出调试信息
                    console.warn("[三叉戟] 第一行未找到操作区域，输出行结构:");
                    console.log(row.innerHTML.substring(0, 500));
                }
            });
            
            console.log(`[三叉戟] 成功添加 ${buttonsAdded} 个发版日志按钮`);

            // 使用事件委托 - 在 document 上监听点击事件
            if (!window._releaseLogClickHandlerAdded) {
                window._releaseLogClickHandlerAdded = true;
                document.addEventListener('click', function(e) {
                    const btn = e.target.closest('.release-log-btn');
                    if (btn) {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log("[三叉戟] 发版日志按钮被点击 (事件委托)");
                        
                        // 获取按钮所在的行
                        const clickedRow = btn.closest('tr');
                        if (!clickedRow) {
                            console.error("[三叉戟] 无法找到按钮所在的行");
                            return;
                        }
                        
                        // 获取行索引
                        const rowIndex = Array.from(clickedRow.parentElement.children).indexOf(clickedRow);
                        console.log("[三叉戟] 点击的行索引:", rowIndex);
                        
                        // 尝试从主表格获取对应行
                        let targetRow = clickedRow;
                        for (const selector of [
                            ".el-table__body-wrapper .el-table__body tbody tr",
                            ".el-table tbody tr.el-table__row",
                            "table tbody tr"
                        ]) {
                            const tableRows = document.querySelectorAll(selector);
                            if (tableRows[rowIndex] && tableRows[rowIndex] !== clickedRow) {
                                targetRow = tableRows[rowIndex];
                                console.log("[三叉戟] 找到主表格对应行");
                                break;
                            }
                        }
                        
                        handleReleaseLogClick(targetRow);
                    }
                }, true); // 使用捕获阶段
                console.log("[三叉戟] 事件委托已注册");
            }

            console.log("[三叉戟] 发版日志按钮添加完成");
        } catch (error) {
            console.error("[三叉戟] addReleaseNoteButton错误:", error);
            console.error(error.stack);
        }
    }
    
    // 调试函数：输出页面结构
    function debugPageStructure() {
        console.log("=== [三叉戟] 页面结构调试 ===");
        
        const tables = document.querySelectorAll('table, .el-table');
        console.log(`找到 ${tables.length} 个表格元素`);
        
        tables.forEach((table, i) => {
            console.log(`表格 ${i}:`, table.className);
            const rows = table.querySelectorAll('tr');
            console.log(`  - 行数: ${rows.length}`);
            if (rows[0]) {
                const cells = rows[0].querySelectorAll('td, th');
                console.log(`  - 列数: ${cells.length}`);
                if (cells.length > 0) {
                    const lastCell = cells[cells.length - 1];
                    console.log(`  - 最后一列类名: ${lastCell.className}`);
                    console.log(`  - 最后一列内容: ${lastCell.innerHTML.substring(0, 200)}`);
                }
            }
        });
        
        // 查找所有包含"操作"或"action"的元素
        const actionElements = document.querySelectorAll('[class*="action"], [class*="操作"]');
        console.log(`找到 ${actionElements.length} 个操作相关元素`);
        
        console.log("=== 调试结束 ===");
    }

    // 处理发版日志按钮点击
    function handleReleaseLogClick(row) {
        console.log("[三叉戟] handleReleaseLogClick 被调用");
        
        // 打印所有单元格内容用于调试
        const allCells = row.querySelectorAll("td");
        console.log("[三叉戟] 行中共有", allCells.length, "个单元格");
        allCells.forEach((cell, idx) => {
            const cellContent = cell.querySelector(".cell");
            console.log(`[三叉戟] 单元格${idx}:`, cellContent ? cellContent.innerText.trim().substring(0, 50) : '(无.cell)');
        });
        
        // 尝试从第一列获取ID
        const releaseIdCell = row.querySelector("td:first-child .cell");
        let releaseId = releaseIdCell ? releaseIdCell.innerText.trim() : null;
        console.log("[三叉戟] 从ID列获取的releaseId:", releaseId);

        // 如果ID列为空，尝试从版本名称获取
        if (!releaseId) {
            console.log("[三叉戟] ID列为空，尝试从版本名称获取...");
            console.log("[三叉戟] 当前缓存:", JSON.stringify(releaseDataCache));
            
            // 尝试多个可能的位置查找版本名称
            let versionName = null;
            for (let i = 1; i <= 3; i++) {
                const versionCell = row.querySelector(`td:nth-child(${i}) .cell`);
                const text = versionCell ? versionCell.innerText.trim() : null;
                console.log(`[三叉戟] 第${i}列内容:`, text);
                // 版本名称通常包含数字和点号，如 "1.0.0" 或 "v1.2.3"
                if (text && (text.match(/\d+\.\d+/) || releaseDataCache[text])) {
                    versionName = text;
                    console.log(`[三叉戟] 在第${i}列找到可能的版本名称:`, versionName);
                    break;
                }
            }
            
            if (versionName) {
                // 从缓存的数据中查找ID
                releaseId = findReleaseIdByName(versionName);
                console.log("[三叉戟] 通过版本名称查找到的releaseId:", releaseId);
            }
        }

        // 如果还是没有，尝试直接调用API获取
        if (!releaseId) {
            console.log("[三叉戟] 尝试从API重新获取数据...");
            
            // 先获取数据再让用户重试
            fetchReleaseList(currentArchived).then((data) => {
                cacheReleaseData(data);
                updateTableWithRealIds(data);
                
                // 再次尝试获取
                const retryIdCell = row.querySelector("td:first-child .cell");
                const retryId = retryIdCell ? retryIdCell.innerText.trim() : null;
                
                if (retryId) {
                    console.log("[三叉戟] 重新获取后找到ID:", retryId);
                    proceedWithReleaseId(retryId);
                } else {
                    alert("无法获取版本ID，请检查控制台日志并报告问题");
                }
            }).catch(err => {
                console.error("[三叉戟] 获取数据失败:", err);
                alert("获取数据失败: " + err.message);
            });
            return;
        }
        
        proceedWithReleaseId(releaseId);
    }
    
    // 继续处理发版日志
    function proceedWithReleaseId(releaseId) {
        console.log("[三叉戟] proceedWithReleaseId:", releaseId);

                        fetchReleaseDetailData(releaseId)
            .then((releaseDetail) => {
                console.log("[三叉戟] 获取到releaseDetail:", releaseDetail);
                
                // v1.7.0 兼容: env 可能是字符串或对象
                let env = "dev";
                if (releaseDetail && releaseDetail.env) {
                    if (typeof releaseDetail.env === 'string') {
                        env = releaseDetail.env;
                    } else if (typeof releaseDetail.env === 'object') {
                        // 尝试多种可能的属性名
                        env = releaseDetail.env.name || 
                              releaseDetail.env.value || 
                              releaseDetail.env.key ||
                              releaseDetail.env.id ||
                              "dev";
                        console.log("[三叉戟] env 是对象，提取值:", env, "原对象:", releaseDetail.env);
                    }
                }
                console.log("[三叉戟] 使用 env:", env);

                                fetchTaskList(releaseId, env)
                                    .then((taskList) => {
                        console.log("[三叉戟] 获取到taskList, 数量:", taskList.length);
                        // 同步执行检查，避免异步问题
                        const checkResults = performAutoCheckSync(releaseDetail, taskList);
                        console.log("[三叉戟] 检查结果:", checkResults);

                        addReleaseNoteDom(releaseDetail, taskList, checkResults);
                                        const modal = document.getElementById("release-log-modal");
                        if (modal) {
                                        modal.style.display = "block";
                        }

                        // 异步执行Branch检查
                        const branchCheck = checkResults.checks.find(c => c.needsAsyncCheck);
                        if (branchCheck && branchCheck.serviceTasks) {
                            console.log("[三叉戟] 开始异步检查Branch...");
                            checkBranchTagMatchAsync(branchCheck.serviceTasks).then(result => {
                                console.log("[三叉戟] Branch检查完成:", result);
                                updateBranchCheckResult(result);
                            });
                        }
                                    })
                                    .catch((error) => {
                        console.error(`[三叉戟] 获取任务列表失败: ${error}`);
                        alert(`获取任务列表失败: ${error.message || error}`);
                                    });
                            })
                            .catch((error) => {
                console.error(`[三叉戟] 获取版本详情失败: ${error}`);
                alert(`获取版本详情失败: ${error.message || error}`);
            });
    }

    // 更新Branch检查结果到UI
    function updateBranchCheckResult(result) {
        const checkItems = document.querySelectorAll('.check-item');
        checkItems.forEach(item => {
            const nameEl = item.querySelector('.check-name');
            if (nameEl && nameEl.textContent === 'Branch-Tag匹配') {
                const iconEl = item.querySelector('.check-icon');
                const messageEl = item.querySelector('.check-message');
                
                if (iconEl) {
                    iconEl.className = `check-icon ${result.status}`;
                    iconEl.textContent = result.status === 'passed' ? '✓' : (result.status === 'failed' ? '✗' : '!');
                }
                if (messageEl) {
                    messageEl.textContent = result.message;
                }

                // 更新summary badge
                updateSummaryBadges(result.status);
            }
        });
    }

    // 更新summary统计
    function updateSummaryBadges(newStatus) {
        // 减少pending计数（如果有的话），增加新状态计数
        const summaryEl = document.querySelector('.auto-check-summary');
        if (summaryEl) {
            const badges = summaryEl.querySelectorAll('.check-badge');
            badges.forEach(badge => {
                if (badge.classList.contains(newStatus)) {
                    const num = parseInt(badge.textContent.match(/\d+/)[0]) || 0;
                    badge.textContent = badge.textContent.replace(/\d+/, num + 1);
                }
            });
        }
    }

    // ===== 同步版本的自动化DevOps任务检查 =====
    function performAutoCheckSync(releaseDetail, taskList) {
        const results = {
            timestamp: new Date().toLocaleString(),
            checks: [],
            summary: { passed: 0, failed: 0, warning: 0 }
        };

        try {
            // 检查1: 版本状态
            const statusCheck = checkReleaseStatus(releaseDetail);
            results.checks.push(statusCheck);
            results.summary[statusCheck.status]++;

            // 检查2: 环境配置
            const envCheck = checkEnvironment(releaseDetail);
            results.checks.push(envCheck);
            results.summary[envCheck.status]++;

            // 检查3: 任务完整性
            const taskCheck = checkTaskIntegritySync(taskList);
            results.checks.push(taskCheck);
            results.summary[taskCheck.status]++;

            // 检查4: 镜像信息
            const imageCheck = checkImageInfoSync(taskList);
            results.checks.push(imageCheck);
            results.summary[imageCheck.status]++;

            // 检查5: Tag是否以-release结尾
            const tagReleaseCheck = checkTagReleaseSync(taskList);
            results.checks.push(tagReleaseCheck);
            results.summary[tagReleaseCheck.status]++;

            // 检查6: Tag版本号格式 X.Y.Z
            const tagVersionCheck = checkTagVersionFormatSync(taskList);
            results.checks.push(tagVersionCheck);
            results.summary[tagVersionCheck.status]++;

            // 检查7: Branch格式为 tags/v{tag}
            const branchTagCheck = checkBranchTagMatchSync(taskList);
            results.checks.push(branchTagCheck);
            results.summary[branchTagCheck.status]++;

            // 检查8: 是否包含非应用类任务 (2.3)
            const nonAppTaskCheck = checkNonAppTasksSync(taskList);
            results.checks.push(nonAppTaskCheck);
            results.summary[nonAppTaskCheck.status]++;

            // 检查9: 公共配置是否规范 (2.4)
            const publicConfigCheck = checkPublicConfigSync(releaseDetail, taskList);
            results.checks.push(publicConfigCheck);
            results.summary[publicConfigCheck.status]++;

            // 检查10: 后端应用公共配置关联 (2.5)
            const backendConfigCheck = checkBackendAppConfigSync(taskList, releaseDetail);
            results.checks.push(backendConfigCheck);
            results.summary[backendConfigCheck.status]++;

            // 检查11: app-datakits-ai 私有配置 (2.6)
            const aiAppConfigCheck = checkAiAppConfigSync(taskList, releaseDetail);
            results.checks.push(aiAppConfigCheck);
            results.summary[aiAppConfigCheck.status]++;

            // 检查12: app-datagovernance-management 私有配置 (2.7)
            const governanceAppConfigCheck = checkGovernanceAppConfigSync(taskList, releaseDetail);
            results.checks.push(governanceAppConfigCheck);
            results.summary[governanceAppConfigCheck.status]++;

        } catch (error) {
            console.error('[三叉戟] 自动化检查出错:', error);
            results.checks.push({
                name: '检查过程',
                status: 'failed',
                message: `检查过程出错: ${error.message}`
            });
            results.summary.failed++;
        }

        return results;
    }

    function checkReleaseStatus(releaseDetail) {
        // stage 是部署阶段状态，status 是审批状态
        const stage = releaseDetail.stage;
        const status = releaseDetail.status;
        
        console.log('[三叉戟] 版本状态原始值:', {
            stage: stage,      // 部署阶段
            status: status     // 审批状态
        });

        // stage 阶段映射 (部署状态)
        const stageMap = {
            0: '待部署',
            1: '部署中',
            2: '部署中',
            3: '部署中',
            4: '已完成',
            5: '已回滚'
        };

        // status 状态映射 (审批状态)
        const statusMap = {
            0: '草稿',
            1: '待发布',
            2: '发布中',
            3: '已发布'
        };

        const stageText = stageMap[stage] || `阶段${stage}`;
        const statusText = statusMap[status] || `状态${status}`;

        // 优先使用 stage 判断部署状态
        if (stage === 4) {
            return {
                name: '版本状态',
                status: 'passed',
                message: `已完成 (stage=${stage})`
            };
        } else if (stage === 5) {
            return {
                name: '版本状态',
                status: 'failed',
                message: `已回滚 (stage=${stage})`
            };
        } else if (stage >= 1 && stage <= 3) {
            return {
                name: '版本状态',
                status: 'warning',
                message: `部署中 (stage=${stage})`
            };
        } else if (stage === 0) {
            return {
                name: '版本状态',
                status: 'warning',
                message: `待部署 (stage=${stage}, 审批状态: ${statusText})`
            };
        } else {
            return {
                name: '版本状态',
                status: 'warning',
                message: `${stageText} (stage=${stage})`
            };
        }
    }

    function checkEnvironment(releaseDetail) {
        // v1.7.0 兼容: env 可能是字符串或对象
        let env = releaseDetail.env;
        if (typeof env === 'object' && env !== null) {
            env = env.name || env.value || env.key || env.id || '';
        }
        env = env || '';
        
        // 合法环境: DEV, QA, PRE, PROD (不区分大小写)
        const validEnvs = ['dev', 'qa', 'pre', 'prod'];
        const envLower = env.toLowerCase();

        if (validEnvs.includes(envLower)) {
            return {
                name: '环境配置',
                status: 'passed',
                message: `环境: ${env.toUpperCase()}`
            };
        } else {
            return {
                name: '环境配置',
                status: 'failed',
                message: `非法环境: ${env || '未设置'} (合法环境: DEV, QA, PRE, PROD)`
            };
        }
    }

    function checkTaskIntegritySync(taskList) {
        const hasService = taskList.some(t => t.task_type === 1);
        const hasSQL = taskList.some(t => t.task_type === 2);
        const hasManual = taskList.some(t => t.task_type === 4);

        const messages = [];
        if (hasService) messages.push(`服务任务: ${taskList.filter(t => t.task_type === 1).length}个`);
        if (hasSQL) messages.push(`SQL任务: ${taskList.filter(t => t.task_type === 2).length}个`);
        if (hasManual) messages.push(`人工确认: ${taskList.filter(t => t.task_type === 4).length}个`);

        return {
            name: '任务完整性',
            status: taskList.length > 0 ? 'passed' : 'warning',
            message: messages.length > 0 ? messages.join(', ') : '无任务'
        };
    }

    function checkImageInfoSync(taskList) {
        const serviceTasks = taskList.filter(t => t.task_type === 1);

        const issues = [];
        serviceTasks.forEach(task => {
            if (!task.task.tag) {
                issues.push(`${task.task.app.name}: 缺少tag`);
            }
            if (!task.task.digest) {
                issues.push(`${task.task.app.name}: 缺少digest`);
            }
        });

        if (issues.length === 0 && serviceTasks.length > 0) {
            return {
                name: '镜像信息',
                status: 'passed',
                message: `${serviceTasks.length}个服务镜像信息完整`
            };
        } else if (issues.length > 0) {
            return {
                name: '镜像信息',
                status: 'failed',
                message: issues.slice(0, 3).join('; ') + (issues.length > 3 ? '...' : '')
            };
        } else {
            return {
                name: '镜像信息',
                status: 'warning',
                message: '无服务任务'
            };
        }
    }

    // 检查4.1: tag是否以-release结尾
    function checkTagReleaseSync(taskList) {
        const serviceTasks = taskList.filter(t => t.task_type === 1);
        
        if (serviceTasks.length === 0) {
            return {
                name: 'Tag后缀检查',
                status: 'warning',
                message: '无服务任务'
            };
        }

        const issues = [];
        serviceTasks.forEach(task => {
            const tag = task.task.tag || '';
            if (!tag.endsWith('-release')) {
                issues.push(`${task.task.app.name}: "${tag}" 未以-release结尾`);
            }
        });

        if (issues.length === 0) {
            return {
                name: 'Tag后缀检查',
                status: 'passed',
                message: `${serviceTasks.length}个服务tag均以-release结尾`
            };
        } else {
            return {
                name: 'Tag后缀检查',
                status: 'failed',
                message: issues.slice(0, 3).join('; ') + (issues.length > 3 ? `...等${issues.length}个` : '')
            };
        }
    }

    // 检查4.2: tag版本号格式 X.Y.Z 或 X.Y.Z-release
    function checkTagVersionFormatSync(taskList) {
        const serviceTasks = taskList.filter(t => t.task_type === 1);
        
        if (serviceTasks.length === 0) {
            return {
                name: 'Tag版本格式',
                status: 'warning',
                message: '无服务任务'
            };
        }

        // 版本号格式: X.Y.Z 或 X.Y.Z-release (X, Y, Z 为数字)
        const versionRegex = /^\d+\.\d+\.\d+(-release)?$/;
        const issues = [];
        
        serviceTasks.forEach(task => {
            const tag = task.task.tag || '';
            if (!versionRegex.test(tag)) {
                issues.push(`${task.task.app.name}: "${tag}" 不符合X.Y.Z格式`);
            }
        });

        if (issues.length === 0) {
            return {
                name: 'Tag版本格式',
                status: 'passed',
                message: `${serviceTasks.length}个服务tag均符合X.Y.Z格式`
            };
        } else {
            return {
                name: 'Tag版本格式',
                status: 'failed',
                message: issues.slice(0, 3).join('; ') + (issues.length > 3 ? `...等${issues.length}个` : '')
            };
        }
    }

    // 检查4.3: branch格式为 tags/v{tag} (需要从builds API获取)
    // 注意: branch信息不在tasks API中，需要异步获取
    function checkBranchTagMatchSync(taskList) {
        const serviceTasks = taskList.filter(t => t.task_type === 1);
        
        if (serviceTasks.length === 0) {
            return {
                name: 'Branch-Tag匹配',
                status: 'warning',
                message: '无服务任务'
            };
        }

        // Branch信息需要从builds API获取，这里先返回待检查状态
        // 实际检查在弹窗打开后异步进行
        return {
            name: 'Branch-Tag匹配',
            status: 'pending',
            message: `${serviceTasks.length}个服务待检查...`,
            needsAsyncCheck: true,
            serviceTasks: serviceTasks
        };
    }

    // builds API 状态追踪 (用于 Branch-Tag 检查)
    let buildsApiStatus = 'unknown';  // 'working', 'failed', 'unknown'

    // 异步检查branch信息
    async function checkBranchTagMatchAsync(serviceTasks) {
        const issues = [];
        const passed = [];
        const apiUnavailable = [];
        
        console.log(`[三叉戟] 开始 Branch-Tag 检查，共 ${serviceTasks.length} 个服务任务`);
        
        for (const task of serviceTasks) {
            const appId = task.task.app.id;
            const appName = task.task.app.name;
            const tag = task.task.tag || '';
            const version = tag.replace(/-release$/, '');
            const expectedBranch = `tags/v${version}`;
            
            try {
                // 获取该应用的构建记录 (传入 appName 用于日志)
                const builds = await fetchAppBuilds(appId, appName);
                
                // 如果 builds 为空数组且 API 状态为 failed，说明是 API 问题
                if (builds.length === 0 && buildsApiStatus === 'failed') {
                    apiUnavailable.push(appName);
                    continue;
                }
                
                // 查找与当前版本号匹配的构建记录
                // 只要版本号匹配就OK，不管分支类型 (release/tags/hotfix 都行)
                // 注意: 版本和分支信息在 config 对象中
                
                console.log(`[三叉戟] ${appName} 查找版本 ${version}, 共 ${builds.length} 条构建记录`);
                
                // 列出所有构建记录的版本信息用于调试
                const allVersions = builds.map((b, idx) => {
                    const cfg = b.config || {};
                    return `[${idx}] ${cfg.branch || 'N/A'}:${cfg.tag || 'N/A'}`;
                });
                console.log(`[三叉戟] ${appName} 所有构建版本:`, allVersions);
                
                // 查找版本号匹配的构建
                const matchingBuild = builds.find((b, idx) => {
                    // 获取 config 对象中的 tag/branch
                    const config = b.config || {};
                    const buildTag = (config.tag || '').trim();
                    const buildBranch = (config.branch || '').trim();
                    
                    // 从 tag 提取版本号: "2.12.0", "2.11.1-release"
                    const tagVersion = buildTag.replace(/-release$/, '').split('(')[0].trim();
                    
                    // 从 branch 提取版本号: "release/v2.11.1", "tags/v2.11.1", "hotfix/v2.17.1"
                    const branchMatch = buildBranch.match(/(?:release|tags|hotfix|feature|test)\/v?(\d+\.\d+\.\d+)/i);
                    const branchVersion = branchMatch ? branchMatch[1] : null;
                    
                    console.log(`[三叉戟] ${appName}[${idx}] 检查: branch="${buildBranch}" (提取=${branchVersion}), tag="${buildTag}" (提取=${tagVersion}), 目标=${version}`);
                    
                    // 只要 tag 或 branch 中的版本号匹配即可
                    if (tagVersion === version || branchVersion === version) {
                        console.log(`[三叉戟] ✓ ${appName} 在记录[${idx}]找到匹配: branch=${buildBranch}, tag=${buildTag}`);
                        return true;
                    }
                    
                    return false;
                });
                
                if (matchingBuild) {
                    passed.push(appName);
                } else if (builds.length > 0) {
                    // 没找到匹配，列出所有记录的版本信息
                    const versions = builds.map(b => {
                        const cfg = b.config || {};
                        return `${cfg.branch || 'N/A'}:${cfg.tag || 'N/A'}`;
                    }).join(', ');
                    issues.push(`${appName}: 未找到v${version} (现有${builds.length}条: ${versions})`);
                    console.warn(`[三叉戟] ✗ ${appName}: 未找到版本 ${version}，所有记录:`, versions);
                } else {
                    apiUnavailable.push(appName);
                }
            } catch (error) {
                console.error(`[三叉戟] 获取${appName}构建记录异常:`, error);
                apiUnavailable.push(appName);
            }
        }

        // 根据不同情况返回结果
        if (apiUnavailable.length === serviceTasks.length) {
            // 所有应用都无法获取构建记录 - API 不可用
        return {
            name: 'Branch-Tag匹配',
                status: 'warning',
                message: `⚠️ builds API 不可用 (Poseidon v1.7.0 可能已移除此功能)`
            };
        }
        
        let message = '';
        if (issues.length === 0 && apiUnavailable.length === 0) {
            message = `✓ ${passed.length}个服务均有对应版本的构建记录`;
        } else {
            const parts = [];
            if (issues.length > 0) {
                parts.push(issues.slice(0, 2).join('; ') + (issues.length > 2 ? `...等${issues.length}个` : ''));
            }
            if (apiUnavailable.length > 0) {
                parts.push(`${apiUnavailable.length}个应用无构建记录`);
            }
            message = parts.join(' | ');
        }

        return {
            name: 'Branch-Tag匹配',
            status: issues.length === 0 ? (apiUnavailable.length > 0 ? 'warning' : 'passed') : 'failed',
            message: message
        };
    }

    // 可能的 apps/builds API 路径 (/api 在前)
    const APPS_API_PATHS = [
        "/api/devops/apps/",    // 主路径
        "/api/apps/",           // 备选路径
    ];
    let workingAppsPath = null;

    // 获取应用的构建记录
    function fetchAppBuilds(appId, appName) {
        return new Promise(async (resolve, reject) => {
            // 如果已知 builds API 不可用，直接返回空数组
            if (buildsApiStatus === 'failed') {
                resolve([]);
                return;
            }
            
            // 如果已有工作路径，直接使用（非静默）
            if (workingAppsPath) {
                try {
                    const result = await tryFetchBuilds(appId, workingAppsPath, appName, false);
                    resolve(result);
                    return;
                } catch (e) {
                    // 缓存路径失效，重新探测
                    workingAppsPath = null;
                }
            }
            
            // 探测所有可能的路径（静默模式）
            for (const basePath of APPS_API_PATHS) {
                try {
                    const result = await tryFetchBuilds(appId, basePath, appName, true);
                    workingAppsPath = basePath;
                    buildsApiStatus = 'working';
                    console.log(`%c[三叉戟] builds API: ${basePath}`, 'color: #67C23A');
                    resolve(result);
                    return;
                } catch (e) {
                    // 静默继续尝试下一个路径
                }
            }
            
            // 所有路径都失败 - 只输出一次简短警告
            buildsApiStatus = 'failed';
            console.warn(`[三叉戟] builds API 不可用，Branch-Tag 检查已跳过`);
            resolve([]);
        });
    }

    function tryFetchBuilds(appId, basePath, appName, silent = false) {
        return new Promise((resolve, reject) => {
            const apiUrl = `${getApiBaseUrl()}${basePath}${appId}/builds/?page=1&page_size=100`;
            
            GM_xmlhttpRequest({
                method: "GET",
                url: apiUrl,
                headers: {
                    accept: "application/json, text/plain, */*",
                    "accept-language": "zh-CN,zh;q=0.9",
                    authorization: getAuthorizationHeader(),
                    "x-poseidon-product": `${productName}`,
                    "x-poseidon-project": `${projectName}`,
                },
                onload: function (response) {
                    try {
                        // 检查是否返回 HTML
                        const text = response.responseText.trim().toLowerCase();
                        if (text.startsWith('<!doctype') || text.startsWith('<html')) {
                            reject(new Error(`返回 HTML`));
                            return;
                        }
                        
                        const result = JSON.parse(response.responseText);
                        
                        // 检查错误响应
                        if (result.code && result.code !== 0) {
                            reject(new Error(`API错误: ${result.message || result.msg}`));
                            return;
                        }
                        
                        if (result.code === 0 && Array.isArray(result.data)) {
                            if (!silent) {
                                console.log(`[三叉戟] ${appName || appId} 构建记录: ${result.data.length} 条`);
                                if (result.data.length > 0) {
                                    console.log(`[三叉戟] ${appName || appId} API返回的第一条数据:`, result.data[0]);
                                }
                            }
                            resolve(result.data);
                        } else if (Array.isArray(result.results)) {
                            if (!silent) {
                                console.log(`[三叉戟] ${appName || appId} 构建记录: ${result.results.length} 条`);
                                if (result.results.length > 0) {
                                    console.log(`[三叉戟] ${appName || appId} API返回的第一条数据:`, result.results[0]);
                                }
                            }
                            resolve(result.results);
                        } else {
                            reject(new Error("API返回结构异常"));
                        }
                    } catch (e) {
                        reject(new Error(`解析响应失败: ${e.message}`));
                    }
                },
                onerror: function (error) {
                    reject(new Error(`网络错误`));
                },
            });
        });
    }

    // 检查2.3: 是否包含非应用类任务 (如SQL任务)
    function checkNonAppTasksSync(taskList) {
        const nonAppTasks = taskList.filter(t => t.task_type === 2 || t.task_type === 4);
        
        if (nonAppTasks.length === 0) {
            return {
                name: '非应用类任务检查',
                status: 'passed',
                message: '未包含非应用类任务'
            };
        }

        const issues = [];
        nonAppTasks.forEach(task => {
            if (task.task_type === 2) {
                issues.push(`SQL任务: ${task.task.name || task.task.middleware}-${task.task.database}`);
            } else if (task.task_type === 4) {
                issues.push(`人工确认任务`);
            }
        });

        return {
            name: '非应用类任务检查',
            status: 'failed',
            message: `203-波塞冬发布任务-包含非应用类任务 (如SQL): ${issues.slice(0, 3).join('; ')}${issues.length > 3 ? `...等${issues.length}个` : ''}`
        };
    }

    // 检查2.4: 公共配置是否仅包含 bootstrap-external.yaml 和 bootstrap.yml
    // 修改：从 taskList 中找到公共配置任务并获取配置文件
    function checkPublicConfigSync(releaseDetail, taskList) {
        // task_type === 3 是公共配置任务
        const publicConfigTask = taskList?.find(t => t.task_type === 3);
        
        // 尝试从多个位置获取配置文件列表
        let configNames = [];
        
        if (publicConfigTask) {
            console.log('[三叉戟] 找到公共配置任务:', publicConfigTask);
            console.log('[三叉戟] publicConfigTask.task 类型:', Array.isArray(publicConfigTask.task) ? 'Array' : typeof publicConfigTask.task);
            console.log('[三叉戟] publicConfigTask.task 内容:', JSON.stringify(publicConfigTask.task, null, 2));
            
            // 情况1: task 本身就是配置文件数组
            if (Array.isArray(publicConfigTask.task)) {
                configNames = publicConfigTask.task.map(c => {
                    if (typeof c === 'string') return c;
                    // 配置文件对象可能有 name, filename, file_name, data_id 等字段
                    return c.name || c.filename || c.file_name || c.data_id || c.dataId || String(c);
                });
                console.log('[三叉戟] 从task数组提取的配置文件:', configNames);
            } else {
                // 情况2: task 是对象，需要从其属性中获取配置列表
                const configs = publicConfigTask.task?.configs || 
                               publicConfigTask.task?.config_files ||
                               publicConfigTask.configs ||
                               publicConfigTask.config_files ||
                               [];
                configNames = configs.map(c => 
                    typeof c === 'string' ? c : (c.name || c.filename || c.file_name || c.data_id || c.dataId || c)
                );
            }
        }
        
        // 如果 taskList 方式没找到，尝试从 releaseDetail 获取
        if (configNames.length === 0) {
            const publicConfigs = releaseDetail.public_configs || 
                                 releaseDetail.configs?.public || 
                                 releaseDetail.config_files?.public || 
                                 [];
            if (Array.isArray(publicConfigs)) {
                configNames = publicConfigs.map(c => 
                    typeof c === 'string' ? c : (c.name || c.filename || c.file_name || c.data_id || c.dataId || c)
                );
            }
        }

        console.log('[三叉戟] 公共配置文件列表:', configNames);

        if (configNames.length === 0) {
            return {
                name: '公共配置检查',
                status: 'warning',
                message: '无法获取公共配置信息（请检查控制台日志）'
            };
        }

        // 标准的公共配置文件列表（仅允许这两个）
        const validConfigs = ['bootstrap-external.yaml', 'bootstrap.yml'];

        // 分类配置文件
        const standardConfigs = configNames.filter(name => validConfigs.includes(name));
        const nonStandardConfigs = configNames.filter(name => !validConfigs.includes(name));

        // 情况1: 仅包含标准配置 → 绿色 (passed)
        if (nonStandardConfigs.length === 0 && standardConfigs.length > 0) {
            return {
                name: '公共配置检查',
                status: 'passed',
                message: `公共配置规范: ${standardConfigs.join(', ')}`
            };
        }

        // 情况2: 同时包含标准和非标准配置 → 黄色 (warning)，非标准配置用红色标记
        if (standardConfigs.length > 0 && nonStandardConfigs.length > 0) {
            const redMarkedExtras = nonStandardConfigs.map(name => `<span style="color: #dc3545; font-weight: bold;">${name}</span>`).join(', ');
            return {
                name: '公共配置检查',
                status: 'warning',
                message: `标准配置: ${standardConfigs.join(', ')}; 非标准配置: ${redMarkedExtras}`,
                isHtml: true
            };
        }

        // 情况3: 完全没有标准配置 → 红色 (failed)
        const redMarkedAll = nonStandardConfigs.map(name => `<span style="color: #dc3545; font-weight: bold;">${name}</span>`).join(', ');
        return {
            name: '公共配置检查',
            status: 'failed',
            message: `无标准配置文件! 仅包含非标准配置: ${redMarkedAll}`,
            isHtml: true
        };
    }

    // 检查2.5: 后端应用公共配置关联
    function checkBackendAppConfigSync(taskList, releaseDetail) {
        const serviceTasks = taskList.filter(t => t.task_type === 1);
        const backendApps = serviceTasks
            .filter(t => t.task?.app?.name?.startsWith('app-'))
            .filter(t => {
                const appName = t.task.app.name;
                return appName !== 'app-datakits-ai' && 
                       appName !== 'app-datakits-xxl-job' && 
                       appName !== 'app-datagovernance-management';
            });

        if (backendApps.length === 0) {
            return {
                name: '后端应用公共配置关联',
                status: 'warning',
                message: '无符合条件的后端应用'
            };
        }

        const issues = [];
        backendApps.forEach(task => {
            const appName = task.task.app.name;
            
            // 尝试从多个位置获取应用的公共配置关联
            const appConfigs = task.task.configs || 
                              task.task.public_configs ||
                              task.task.config_files ||
                              task.configs ||
                              task.public_configs ||
                              [];
            
            console.log(`[三叉戟] ${appName} 配置关联:`, appConfigs, '完整任务:', task);
            
            const configNames = Array.isArray(appConfigs) 
                ? appConfigs.map(c => typeof c === 'string' ? c : (c.name || c.filename || c.file_name || c))
                : [];

            const bootstrapExternalCount = configNames.filter(name => 
                name === 'bootstrap-external.yaml' || name.includes('bootstrap-external')
            ).length;

            // 只有当配置列表不为空但没有 bootstrap-external.yaml 时才报错
            // 如果配置列表为空，可能是API没有返回这个信息
            if (configNames.length > 0 && bootstrapExternalCount === 0) {
                issues.push(`${appName}: 未关联 bootstrap-external.yaml`);
            } else if (bootstrapExternalCount > 1) {
                issues.push(`${appName}: 关联了${bootstrapExternalCount}个 bootstrap-external.yaml (应为1个)`);
            }
        });

        // 如果没有任何应用有配置信息，说明API可能没有返回这个字段
        const appsWithConfigs = backendApps.filter(task => {
            const appConfigs = task.task.configs || task.task.public_configs || task.configs || [];
            return Array.isArray(appConfigs) && appConfigs.length > 0;
        });

        if (appsWithConfigs.length === 0) {
            return {
                name: '后端应用公共配置关联',
                status: 'passed',
                message: `✓ ${backendApps.length}个后端应用（无法获取配置关联详情，请在页面确认）`
            };
        }

        if (issues.length === 0) {
            return {
                name: '后端应用公共配置关联',
                status: 'passed',
                message: `${backendApps.length}个后端应用公共配置关联规范`
            };
        } else {
            return {
                name: '后端应用公共配置关联',
                status: 'failed',
                message: `205-波塞冬发布任务-后端应用公共配置关联不规范: ${issues.slice(0, 3).join('; ')}${issues.length > 3 ? `...等${issues.length}个` : ''}`
            };
        }
    }

    // 检查2.6: app-datakits-ai 私有配置
    function checkAiAppConfigSync(taskList, releaseDetail) {
        const serviceTasks = taskList.filter(t => t.task_type === 1);
        const aiApp = serviceTasks.find(t => t.task.app.name === 'app-datakits-ai');

        if (!aiApp) {
            // 本次发布不包含该应用，标绿跳过检查
            return {
                name: 'app-datakits-ai配置检查',
                status: 'passed',
                message: '✓ 本次发布不包含 app-datakits-ai 应用（跳过检查）'
            };
        }

        // 尝试从任务或发布详情中获取私有配置信息
        const privateConfigs = aiApp.task.private_configs || 
                              aiApp.task.configs?.private || 
                              aiApp.configs || 
                              [];

        const configNames = Array.isArray(privateConfigs) 
            ? privateConfigs.map(c => typeof c === 'string' ? c : (c.name || c.filename || c))
            : [];

        const applicationYamlCount = configNames.filter(name => 
            name === 'application.yaml' || name.includes('application.yaml')
        ).length;

        if (applicationYamlCount === 0) {
            return {
                name: 'app-datakits-ai配置检查',
                status: 'failed',
                message: '206-波塞冬发布任务-app-datakits-ai 配置文件关联错误: 未包含 application.yaml'
            };
        } else if (applicationYamlCount > 1) {
            return {
                name: 'app-datakits-ai配置检查',
                status: 'failed',
                message: `206-波塞冬发布任务-app-datakits-ai 配置文件关联错误: 包含${applicationYamlCount}个 application.yaml (应为1个)`
            };
        } else {
            return {
                name: 'app-datakits-ai配置检查',
                status: 'passed',
                message: 'app-datakits-ai 私有配置规范: 1个 application.yaml'
            };
        }
    }

    // 检查2.7: app-datagovernance-management 私有配置
    function checkGovernanceAppConfigSync(taskList, releaseDetail) {
        const serviceTasks = taskList.filter(t => t.task_type === 1);
        const governanceApp = serviceTasks.find(t => t.task.app.name === 'app-datagovernance-management');

        if (!governanceApp) {
            // 本次发布不包含该应用，标绿跳过检查
            return {
                name: 'app-datagovernance-management配置检查',
                status: 'passed',
                message: '✓ 本次发布不包含 app-datagovernance-management 应用（跳过检查）'
            };
        }

        // 尝试从任务或发布详情中获取私有配置信息
        const privateConfigs = governanceApp.task.private_configs || 
                              governanceApp.task.configs?.private || 
                              governanceApp.configs || 
                              [];

        const configNames = Array.isArray(privateConfigs) 
            ? privateConfigs.map(c => typeof c === 'string' ? c : (c.name || c.filename || c))
            : [];

        const bootstrapYmlCount = configNames.filter(name => 
            name === 'bootstrap.yml' || name.includes('bootstrap.yml')
        ).length;

        if (bootstrapYmlCount === 0) {
            return {
                name: 'app-datagovernance-management配置检查',
                status: 'failed',
                message: '207-波塞冬发布任务-app-datagovernance-management 配置文件关联错误: 未包含 bootstrap.yml'
            };
        } else if (bootstrapYmlCount > 1) {
            return {
                name: 'app-datagovernance-management配置检查',
                status: 'failed',
                message: `207-波塞冬发布任务-app-datagovernance-management 配置文件关联错误: 包含${bootstrapYmlCount}个 bootstrap.yml (应为1个)`
            };
        } else {
            return {
                name: 'app-datagovernance-management配置检查',
                status: 'passed',
                message: 'app-datagovernance-management 私有配置规范: 1个 bootstrap.yml'
            };
        }
    }

    // 获取当前主机地址
    function getApiBaseUrl() {
        return window.location.origin;
    }

    function fetchProjectList() {
        return new Promise((resolve, reject) => {
            const apiUrl = `${getApiBaseUrl()}/api/projects/`;
            console.log(`[三叉戟] 请求项目列表: ${apiUrl}`);
            
            const authHeader = getAuthorizationHeader();
            if (!authHeader) {
                reject(new Error("[三叉戟] 无法获取认证 Token"));
                return;
            }
            
            GM_xmlhttpRequest({
                method: "GET",
                url: apiUrl,
                headers: {
                    accept: "application/json, text/plain, */*",
                    "accept-language": "zh-CN,zh;q=0.9",
                    authorization: authHeader,
                },
                onload: function (response) {
                    try {
                        // 检查是否返回 HTML（错误响应）
                        if (response.responseText.trim().startsWith('<!DOCTYPE') || 
                            response.responseText.trim().startsWith('<html')) {
                            console.error(`[三叉戟] 项目列表 API 返回 HTML，可能是认证问题或路径错误`);
                            console.log(`[三叉戟] 响应状态: ${response.status}`);
                            reject(new Error("[三叉戟] API 返回 HTML 而非 JSON"));
                            return;
                        }
                        
                        const result = JSON.parse(response.responseText);
                        if (result.code === 0 && Array.isArray(result.data)) {
                            console.log(`[三叉戟] 获取项目数据成功，共 ${result.data.length} 个项目`);
                            resolve(result.data);
                        } else {
                            console.error(`[三叉戟] API 返回结构异常:`, result);
                            reject(new Error("[三叉戟] API返回结构异常"));
                        }
                    } catch (e) {
                        console.error(`[三叉戟] 解析响应失败:`, response.responseText.substring(0, 200));
                        reject(new Error(`[三叉戟] 解析响应失败: ${e.message}`));
                    }
                },
                onerror: function (error) {
                    reject(new Error(`API call failed: ${error}`));
                },
            });
        });
    }

    // 尝试单个 API 路径获取 releases
    // silent: 静默模式，探测时不输出警告
    function tryFetchReleasesFromPath(basePath, archived, silent = false) {
        return new Promise((resolve, reject) => {
            const apiUrl = `${getApiBaseUrl()}${basePath}?page=1&page_size=100&archived=${archived}&search=`;
            if (!silent) console.log(`[三叉戟] 尝试 API 路径: ${apiUrl}`);
            
            GM_xmlhttpRequest({
                method: "GET",
                url: apiUrl,
                headers: {
                    accept: "application/json, text/plain, */*",
                    "accept-language": "zh-CN,zh;q=0.9",
                    authorization: getAuthorizationHeader(),
                    "x-poseidon-product": `${productName}`,
                    "x-poseidon-project": `${projectName}`,
                },
                onload: function (response) {
                    try {
                        // 检查是否返回 HTML (404页面) - 大小写不敏感
                        const text = response.responseText.trim().toLowerCase();
                        if (text.startsWith('<!doctype') || text.startsWith('<html')) {
                            // 探测模式下静默失败
                            reject(new Error(`返回 HTML`));
                            return;
                        }
                        
                        const result = JSON.parse(response.responseText);
                        
                        // 检查是否返回错误
                        if (result.code && result.code !== 0) {
                            reject(new Error(`路径 ${basePath} 返回错误: ${result.message || result.msg}`));
                            return;
                        }
                        
                        // 成功获取数据
                        if (Array.isArray(result.data)) {
                            console.log(`%c[三叉戟] ✓ ${basePath} 成功，共 ${result.data.length} 条`, 'color: #67C23A');
                            resolve({ path: basePath, data: result.data });
                        } else if (result.results && Array.isArray(result.results)) {
                            // 有些 API 使用 results 而不是 data
                            console.log(`%c[三叉戟] ✓ ${basePath} 成功 (results)，共 ${result.results.length} 条`, 'color: #67C23A');
                            resolve({ path: basePath, data: result.results });
                        } else {
                            reject(new Error(`路径 ${basePath} 返回结构异常`));
                        }
                    } catch (e) {
                        // 探测模式下静默处理解析失败
                        reject(new Error(`路径 ${basePath} 解析失败: ${e.message}`));
                    }
                },
                onerror: function (error) {
                    reject(new Error(`路径 ${basePath} 请求失败`));
                },
            });
        });
    }
    
    // 缓存已发现的工作路径
    let workingReleasesPath = null;
    
    function fetchReleaseList(archived = 0) {
        return new Promise(async (resolve, reject) => {
            console.log(`[三叉戟] 请求版本列表: project=${projectName}, product=${productName}`);
            
            // 如果已有工作路径，优先使用
            if (workingReleasesPath) {
                try {
                    const result = await tryFetchReleasesFromPath(workingReleasesPath, archived, false);
                    resolve(result.data);
                    return;
                } catch (e) {
                    console.log(`[三叉戟] 缓存路径失效，重新探测...`);
                    workingReleasesPath = null;
                }
            }
            
            // 尝试所有可能的路径（静默模式，不输出警告）
            for (const path of RELEASES_API_PATHS) {
                try {
                    const result = await tryFetchReleasesFromPath(path, archived, true);
                    workingReleasesPath = result.path;  // 缓存工作路径
                    console.log(`%c[三叉戟] releases API: ${result.path}`, 'color: #67C23A');
                    resolve(result.data);
                    return;
                } catch (e) {
                    // 静默继续尝试下一个路径
                }
            }
            
            // 所有路径都失败
            console.error(`[三叉戟] 所有 releases API 路径都失败，尝试过: ${RELEASES_API_PATHS.join(', ')}`);
            reject(new Error("[三叉戟] 无法找到可用的 releases API"));
        });
    }

    // 获取当前生效的 releases API 基路径
    function getReleasesBasePath() {
        return workingReleasesPath || "/api/devops/releases/";
    }

    function fetchReleaseDetailData(releaseId) {
        return new Promise((resolve, reject) => {
            const basePath = getReleasesBasePath().replace(/\/$/, '');  // 移除尾部斜杠
            const apiUrl = `${getApiBaseUrl()}${basePath}/${releaseId}/`;
            console.log(`[三叉戟] 请求版本详情: ${apiUrl}`);
            
            GM_xmlhttpRequest({
                method: "GET",
                url: apiUrl,
                headers: {
                    accept: "application/json, text/plain, */*",
                    "accept-language": "zh-CN,zh;q=0.9",
                    authorization: getAuthorizationHeader(),
                    referer: window.location.href,
                    "x-poseidon-product": `${productName}`,
                    "x-poseidon-project": `${projectName}`,
                },
                onload: function (response) {
                    try {
                        console.log(`[三叉戟] API响应状态: ${response.status}`);
                        
                        // 检查是否返回 HTML
                        if (response.responseText.trim().startsWith('<!DOCTYPE') || 
                            response.responseText.trim().startsWith('<html')) {
                            console.error(`[三叉戟] 版本详情 API 返回 HTML`);
                            reject(new Error("[三叉戟] API 返回 HTML"));
                            return;
                        }
                        
                        console.log(`[三叉戟] API响应内容: ${response.responseText.substring(0, 500)}`);
                        const result = JSON.parse(response.responseText);
                        // 兼容多种返回结构
                        if (result.code === 0 && result.data) {
                            console.log(`[三叉戟] 获取版本详情数据成功 (code=0)`);
                            resolve(result.data);
                        } else if (result.data) {
                            // 有些API直接返回 {data: {...}} 没有code字段
                            console.log(`[三叉戟] 获取版本详情数据成功 (无code字段)`);
                            resolve(result.data);
                        } else if (result.id) {
                            // 有些API直接返回对象本身
                            console.log(`[三叉戟] 获取版本详情数据成功 (直接返回对象)`);
                            resolve(result);
                        } else {
                            console.error(`[三叉戟] API返回结构异常:`, result);
                            reject(new Error(`[三叉戟] API返回结构异常: code=${result.code}, msg=${result.msg || result.message || '未知'}`));
                        }
                    } catch (e) {
                        console.error(`[三叉戟] 解析响应失败:`, e, response.responseText);
                        reject(new Error(`[三叉戟] 解析响应失败: ${e.message}`));
                    }
                },
                onerror: function (error) {
                    console.error(`[三叉戟] API请求失败:`, error);
                    reject(new Error(`API call failed: ${error}`));
                },
            });
        });
    }

    function fetchTaskList(releaseId, env) {
        return new Promise((resolve, reject) => {
            const basePath = getReleasesBasePath().replace(/\/$/, '');
            const apiUrl = `${getApiBaseUrl()}${basePath}/${releaseId}/tasks/?env=${env}`;
            console.log(`[三叉戟] 请求任务列表: ${apiUrl}`);
            
            GM_xmlhttpRequest({
                method: "GET",
                url: apiUrl,
                headers: {
                    accept: "application/json, text/plain, */*",
                    "accept-language": "zh-CN,zh;q=0.9",
                    authorization: getAuthorizationHeader(),
                    referer: window.location.href,
                    "x-poseidon-product": `${productName}`,
                    "x-poseidon-project": `${projectName}`,
                },
                onload: function (response) {
                    try {
                        // 检查是否返回 HTML
                        if (response.responseText.trim().startsWith('<!DOCTYPE') || 
                            response.responseText.trim().startsWith('<html')) {
                            console.error(`[三叉戟] 任务列表 API 返回 HTML`);
                            reject(new Error("[三叉戟] API 返回 HTML"));
                            return;
                        }
                        
                        const result = JSON.parse(response.responseText);
                        if (result.code === 0 && Array.isArray(result.data)) {
                            console.log(`[三叉戟] 获取版本任务数据成功`);
                            resolve(result.data);
                        } else if (Array.isArray(result.results)) {
                            console.log(`[三叉戟] 获取版本任务数据成功 (results)`);
                            resolve(result.results);
                        } else {
                            reject(new Error("[三叉戟] API返回结构异常"));
                        }
                    } catch (e) {
                        reject(new Error(`[三叉戟] 解析响应失败: ${e.message}`));
                    }
                },
                onerror: function (error) {
                    reject(new Error(`API call failed: ${error}`));
                },
            });
        });
    }

    function updateTableWithRealIds(data) {
        const nameIdMap = data.reduce((acc, curr) => {
            acc[curr.name] = curr.id;
            return acc;
        }, {});

        const bodyRows = document.querySelectorAll(
            ".el-table__body-wrapper .el-table__body tbody tr"
        );
        const bodyRowsFixed = document.querySelectorAll(
            ".el-table__fixed-body-wrapper .el-table__body tbody tr"
        );
        console.log("[三叉戟] 填充ID列");
        bodyRows.forEach((row, index) => {
            const versionCell = row.querySelector("td:nth-child(2)");
            if (versionCell) {
                const versionText = versionCell.textContent.trim();
                const realId = nameIdMap[versionText];
                if (realId !== undefined) {
                    const idCell = row.querySelector("td:first-child .cell");
                    if (idCell) {
                        idCell.textContent = realId;
                    }
                }
            }
            // 同步行高
            if (bodyRowsFixed[index]) {
                syncRowHeight(row, bodyRowsFixed[index]);
            }
        });
        bodyRowsFixed.forEach((row) => {
            const versionCell = row.querySelector("td:nth-child(2)");
            if (versionCell) {
                const versionText = versionCell.textContent.trim();
                const realId = nameIdMap[versionText];
                if (realId !== undefined) {
                    const idCell = row.querySelector("td:first-child .cell");
                    if (idCell) {
                        idCell.textContent = realId;
                    }
                }
            }
        });
    }

    function addModalStyles() {
        GM_addStyle(`
        .modal {
            display: none;
            position: fixed;
            z-index: 10000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: auto;
            background-color: rgb(0,0,0);
            background-color: rgba(0,0,0,0.4);
            padding-top: 60px;
        }

        .modal-content {
            background-color: #fefefe;
            margin: 5% auto;
            padding: 20px;
            border: 1px solid #888;
            width: 80%;
            max-height: 80vh;
            overflow-y: auto;
        }

        .close {
            color: #aaaaaa;
            float: right;
            font-size: 28px;
            font-weight: bold;
        }

        .close:hover,
        .close:focus {
            color: #000;
            text-decoration: none;
            cursor: pointer;
        }

        #release-note-table {
            width: 100%;
            border-collapse: collapse;
        }

        #release-note-table > thead > tr > th, td {
            border: 1px solid #ddd;
            text-align: left;
            padding: 8px;
        }

        #release-note-table > thead > tr > th {
            background-color: #f2f2f2;
            text-align: center;
            font-size: 20px;
            font-weight: bold;
        }

        #release-note-table > tbody > tr > td.sub-title {
          font-size: 18px;
          font-weight: bold;
          background-color: #f2f2f2;
        }

        #release-note-table > tbody > tr.third-title > td {
          font-size: 16px;
          font-weight: bold;
        }

        #release-note-table > tbody > tr.item-list:nth-child(odd) {
          background-color: #e0f2f1;
        }

        .multi-line-clamp {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 500;
          overflow: hidden;
          text-overflow: ellipsis;
          word-break: break-word;
          max-height: 20em;
          line-height: 1em;
        }

        code {
          white-space: pre-wrap;
          word-wrap: break-word;
        }

        /* 自动化检查结果样式 */
        .auto-check-panel {
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 20px;
        }

        .auto-check-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            padding-bottom: 10px;
            border-bottom: 1px solid #dee2e6;
        }

        .auto-check-title {
            font-size: 16px;
            font-weight: bold;
            color: #495057;
        }

        .auto-check-summary {
            display: flex;
            gap: 15px;
        }

        .check-badge {
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 500;
        }

        .check-badge.passed {
            background: #d4edda;
            color: #155724;
        }

        .check-badge.warning {
            background: #fff3cd;
            color: #856404;
        }

        .check-badge.failed {
            background: #f8d7da;
            color: #721c24;
        }

        .check-item {
            display: flex;
            align-items: center;
            padding: 8px 0;
            border-bottom: 1px solid #e9ecef;
        }

        .check-item:last-child {
            border-bottom: none;
        }

        .check-icon {
            width: 20px;
            height: 20px;
            margin-right: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            font-size: 12px;
        }

        .check-icon.passed {
            background: #28a745;
            color: white;
        }

        .check-icon.warning {
            background: #ffc107;
            color: white;
        }

        .check-icon.failed {
            background: #dc3545;
            color: white;
        }

        .check-icon.pending {
            background: #6c757d;
            color: white;
            animation: pulse 1s infinite;
        }

        .check-badge.pending {
            background: #e9ecef;
            color: #6c757d;
        }

        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }

        .check-name {
            font-weight: 500;
            min-width: 100px;
            color: #495057;
        }

        .check-message {
            color: #6c757d;
            flex: 1;
        }

        /* 多选导出样式 */
        .export-checkbox {
            width: 18px;
            height: 18px;
            cursor: pointer;
        }

        .select-all-container {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 10px;
        }

        .select-all-label {
            cursor: pointer;
            user-select: none;
        }

        .selected-count {
            margin-left: auto;
            color: #666;
            font-size: 14px;
        }

        .toolbar-buttons {
            display: flex;
            gap: 10px;
            margin-bottom: 15px;
            flex-wrap: wrap;
            align-items: center;
        }

        /* 版本标签样式 */
        .script-version-badge {
            position: fixed;
            bottom: 10px;
            right: 10px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 500;
            z-index: 9999;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
            cursor: pointer;
            transition: all 0.3s ease;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .script-version-badge:hover {
            transform: scale(1.05);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
    `);
    }

    // 弹窗逻辑
    function setupModal() {
        const modal = document.getElementById("release-log-modal");
        const closeBtn = modal.querySelector(".close");
        const singleExportBtnList = document.querySelectorAll('#release-note-table > tbody > tr > td > button.singe-export-btn');
        const batchExportBtn = document.getElementById("batch-export-button");
        const selectedExportBtn = document.getElementById("selected-export-button");
        const excelExportBtn = document.getElementById("export-excel-button");
        const copyAppBtn = document.getElementById("copy-app-button");
        const selectAllCheckbox = document.getElementById("select-all-checkbox");

        // 点击关闭按钮隐藏弹窗
        closeBtn.onclick = function () {
            modal.style.display = "none";
        };

        // 全选/取消全选
        if (selectAllCheckbox) {
            selectAllCheckbox.addEventListener('change', function () {
                const checkboxes = document.querySelectorAll('.export-checkbox');
                checkboxes.forEach(cb => {
                    cb.checked = this.checked;
                });
                updateSelectedCount();
            });
        }

        // 监听单个checkbox变化
        document.querySelectorAll('.export-checkbox').forEach(cb => {
            cb.addEventListener('change', updateSelectedCount);
        });

        // 点击批量导出按钮触发批量导出功能（导出所有）
        if (batchExportBtn) {
            batchExportBtn.addEventListener('click', function () {
                batchExportImages(false);
        });
        }

        // 点击选中导出按钮
        if (selectedExportBtn) {
            selectedExportBtn.addEventListener('click', function () {
                batchExportImages(true);
            });
        }

        // 点击导出Excel功能
        if (excelExportBtn) {
            excelExportBtn.addEventListener('click', function () {
            onExcelExport();
        });
        }

        // 点击复制应用功能
        if (copyAppBtn) {
            copyAppBtn.addEventListener('click', function () {
            copyAppInfoToColipBoard();
        });
        }

        // 点击窗口外部区域隐藏弹窗
        window.onclick = function (event) {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        };

        // 单个导出按钮
        singleExportBtnList.forEach(button => {
            button.addEventListener('click', handleSingleExportButtonClick);
        });

        // 初始化选中计数
        updateSelectedCount();
    }

    function updateSelectedCount() {
        const total = document.querySelectorAll('.export-checkbox').length;
        const selected = document.querySelectorAll('.export-checkbox:checked').length;
        const countEl = document.getElementById('selected-count');
        if (countEl) {
            countEl.textContent = `已选: ${selected}/${total}`;
        }

        // 更新全选checkbox状态
        const selectAllCheckbox = document.getElementById('select-all-checkbox');
        if (selectAllCheckbox) {
            selectAllCheckbox.checked = selected === total && total > 0;
            selectAllCheckbox.indeterminate = selected > 0 && selected < total;
        }

        // 禁用/启用选中导出按钮
        const selectedExportBtn = document.getElementById('selected-export-button');
        if (selectedExportBtn) {
            selectedExportBtn.disabled = selected === 0;
            selectedExportBtn.style.opacity = selected === 0 ? '0.5' : '1';
        }
    }

    function addElementToKey(myMap, key, element) {
        if (myMap.has(key)) {
            let currentList = myMap.get(key);
            currentList.push(element);
            myMap.set(key, currentList);
        } else {
            myMap.set(key, [element]);
        }
    }

    function encodeHtml(html) {
        return html.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function buildCheckResultsHtml(checkResults) {
        if (!checkResults || !checkResults.checks) {
            return '';
        }

        const iconMap = {
            passed: '✓',
            warning: '!',
            failed: '✗',
            pending: '...'
        };

        const checksHtml = checkResults.checks.map(check => {
            // 如果 check.isHtml 为 true，直接渲染 HTML；否则转义 HTML
            const messageContent = check.isHtml ? check.message : check.message.replace(/</g, '&lt;').replace(/>/g, '&gt;');
            return `
            <div class="check-item">
                <div class="check-icon ${check.status}">${iconMap[check.status]}</div>
                <span class="check-name">${check.name}</span>
                <span class="check-message">${messageContent}</span>
            </div>
        `;
        }).join('');

        return `
            <div class="auto-check-panel">
                <div class="auto-check-header">
                    <span class="auto-check-title">🔍 自动化DevOps检查结果</span>
                    <div class="auto-check-summary">
                        <span class="check-badge passed">通过: ${checkResults.summary.passed}</span>
                        <span class="check-badge warning">警告: ${checkResults.summary.warning}</span>
                        <span class="check-badge failed">失败: ${checkResults.summary.failed}</span>
                    </div>
                </div>
                <div class="check-items">
                    ${checksHtml}
                </div>
                <div style="text-align: right; font-size: 12px; color: #999; margin-top: 10px;">
                    检查时间: ${checkResults.timestamp} | 脚本版本: v${SCRIPT_VERSION}
                </div>
            </div>
        `;
    }

    function buildModalContent(releaseDetail, taskList, checkResults) {
        // 生成任务列表HTML
        const bodyMap = new Map();
        const exportButtonHtml = '<button class="el-button el-button--primary" id="batch-export-button" style="margin-right: 10px;">全部导出</button>';
        const selectedExportHtml = '<button class="el-button el-button--success" id="selected-export-button" style="margin-right: 10px;" disabled>选中导出</button>';
        const exportExcelHtml = '<button class="el-button el-button--primary" id="export-excel-button" style="margin-right: 10px;">导出Excel</button>';
        const copyAppHtml = '<button class="el-button el-button--primary" id="copy-app-button" style="margin-right: 10px;">复制应用信息</button>';

        // 构建自动化检查结果HTML
        const checkResultsHtml = buildCheckResultsHtml(checkResults);

        let serviceIndex = 0;
        taskList
            ?.sort((a, b) => a.order - b.order)
            .forEach((task) => {
                switch (task.task_type) {
                    case 1: {
                        // 前端或后端服务 - 添加checkbox
                        const serverHtml = `
            <tr class="item-list" data-app="${task.task.app.name}" data-tag="${task.task.tag.replace('-release', '')}" data-digest="${task.task.digest}">
            <td colspan="1" width="5%"><input type="checkbox" class="export-checkbox" data-index="${serviceIndex}" checked /></td>
            <td colspan="1" width="18%">${task.task.app.name}</td>
            <td colspan="1" width="10%">${task.task.tag.replace('-release', '')}</td>
            <td colspan="1" width="17%">${task.task.digest}</td>
            <td colspan="1" width="45%">${task.task.description.replace(
                            /\n/g,
                            "<br>"
                        )}</td>
            <td colspan="1" width="5%"><button type="button" class="el-button table-action-button table-action-item el-button--text singe-export-btn" style="color:var(--cs-color_primary)">导出</button></td>
            </tr>
        `;
                        serviceIndex++;
                        if (task.task.app.name.startsWith("fe-")) {
                            addElementToKey(bodyMap, "frontEndBody", serverHtml);
                        } else {
                            addElementToKey(bodyMap, "backEndBody", serverHtml);
                        }
                        break;
                    }
                    case 2: {
                        // 需要执行的sql
                        addElementToKey(
                            bodyMap,
                            "sqlBody",
                            `
              <tr class="item-list">
              <td colspan="2">${task.task.middleware}-${task.task.database}</td>
              <td colspan="1">${task.task.name}</td>
              <td colspan="3"><textarea style="width: 100%; height: 200px; resize: vertical; overflow-y: auto; white-space: pre-wrap;">${encodeHtml(task.task.content)}</textarea></td>
              </tr>
        `
                        );
                        break;
                    }
                    case 4: {
                        // 需要人工确认的事项
                        addElementToKey(
                            bodyMap,
                            "manualBody",
                            `<tr class="item-list"><td colspan="6" style="white-space: pre-wrap">${task.task.content}</td></tr>`
                        );
                        break;
                    }
                    default:
                        return "";
                }
            });

        return `
    <div id="release-log-modal" class="modal">
        <div id="modal-content" class="modal-content">
            <span class="close">&times;</span>

            ${checkResultsHtml}

            <div class="toolbar-buttons">
                <div class="select-all-container">
                    <input type="checkbox" id="select-all-checkbox" checked />
                    <label for="select-all-checkbox" class="select-all-label">全选</label>
                    <span id="selected-count" class="selected-count">已选: 0/0</span>
                </div>
                ${selectedExportHtml}
            ${exportButtonHtml}
            ${exportExcelHtml}
            ${copyAppHtml}
            </div>

            <table id="release-note-table">
              <thead>
                <tr>
                    <th colspan="6">${releaseDetail.description}-发版日志-<span id="product-version">${releaseDetail.name
        }</span></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colspan="6" class="sub-title">1.需要人工确认的事项</td>
                </tr>
                ${bodyMap.get("manualBody")
                ? bodyMap.get("manualBody").join("")
                : ""
        }
                <tr>
                  <td colspan="6" class="sub-title">2.SQL变动</td>
                </tr>
                <tr class="third-title">
                  <td colspan="2">数据库</td>
                  <td colspan="1">描述</td>
                  <td colspan="3">执行sql</td>
                </tr>
                ${bodyMap.get("sqlBody") ? bodyMap.get("sqlBody").join("") : ""}
                <tr>
                  <td colspan="6" class="sub-title">3.前端服务</td>
                </tr>
                <tr class="third-title">
                    <td colspan="1">选择</td>
                    <td colspan="1">服务名</td>
                    <td colspan="1">镜像tag</td>
                    <td colspan="1">镜像摘要</td>
                    <td colspan="1">升级描述</td>
                    <td colspan="1">导出</td>
                </tr>
                ${bodyMap.get("frontEndBody")
                ? bodyMap.get("frontEndBody").join("")
                : ""
        }
                <tr>
                  <td colspan="6" class="sub-title">4.后端服务</td>
                </tr>
                <tr class="third-title">
                    <td colspan="1">选择</td>
                    <td colspan="1">服务名</td>
                    <td colspan="1">镜像tag</td>
                    <td colspan="1">镜像摘要</td>
                    <td colspan="1">升级描述</td>
                    <td colspan="1">导出</td>
                </tr>
                ${bodyMap.get("backEndBody")
                ? bodyMap.get("backEndBody").join("")
                : ""
        }
              </tbody>
          </table>
        </div>
    </div>
    `;
    }

    function handleSingleExportButtonClick(event) {
        const row = event.target.closest('tr.item-list');
        const appName = row.dataset.app;
        const tag = row.dataset.tag;
        const digest = row.dataset.digest;

        const exportData = {
            spec: JSON.stringify({
                images: [{
                    app: appName,
                    images: [{ tag, digest }]
                }]
            }),
            description: "导出镜像",
            meta_type: 2
        };

        const baseUrl = getApiBaseUrl();
        GM_xmlhttpRequest({
            method: "POST",
            url: `${baseUrl}/api/devops/migration/exports/`,
            headers: {
                "accept": "application/json, text/plain, */*",
                "accept-language": "zh-CN,zh;q=0.9",
                "authorization": getAuthorizationHeader(),
                "content-type": "application/json",
                "origin": baseUrl,
                "referer": `${baseUrl}/app/devops/import-export`,
                "x-poseidon-product": `${productName}`,
                "x-poseidon-project": `${projectName}`,
            },
            data: JSON.stringify(exportData),
            onload: function (response) {
                try {
                const result = JSON.parse(response.responseText);
                if (result.code === 0 && result.data) {
                    console.log(
                        `[三叉戟] 成功触发导出单个镜像: ${appName}-${tag}-${digest}`
                    );
                    const url = `${baseUrl}/app/devops/import-export?project=${projectName}&product=${productName}`;
                    window.open(url, '_blank');
                } else {
                    window.alert(`[三叉戟] 触发导出单个镜像失败: ${JSON.stringify(result)}`)
                    }
                } catch (e) {
                    window.alert(`[三叉戟] 解析响应失败: ${e.message}`);
                }
            },
            onerror: function (error) {
                window.alert(`[三叉戟] 触发导出单个镜像API call failed: ${error}`)
            },
        });
    }

    function batchExportImages(onlySelected = false) {
        const rows = document.querySelectorAll('#release-note-table tr.item-list[data-app]');
        const images = [];

        rows.forEach(row => {
            const checkbox = row.querySelector('.export-checkbox');

            // 如果是选中导出模式，只处理选中的行
            if (onlySelected && (!checkbox || !checkbox.checked)) {
                return;
            }

            const appName = row.dataset.app;
            const tag = row.dataset.tag;
            const digest = row.dataset.digest;

            if (appName && tag && digest) {
                images.push({ app: appName, tag: tag, digest: digest });
            }
        });

        if (images.length === 0) {
            window.alert('[三叉戟] 没有选中任何应用进行导出');
            return;
            }

        const exportData = {
            spec: JSON.stringify({
                images: images.map(img => ({
                    app: img.app,
                    images: [{ tag: img.tag, digest: img.digest }]
                }))
            }),
            description: onlySelected ? `选中导出${images.length}个镜像` : "批量导出镜像",
            meta_type: 2
        };

        console.log(`[三叉戟] 导出的镜像信息为：${JSON.stringify(exportData)}`);

        const baseUrl = getApiBaseUrl();
        GM_xmlhttpRequest({
            method: "POST",
            url: `${baseUrl}/api/devops/migration/exports/`,
            headers: {
                "accept": "application/json, text/plain, */*",
                "accept-language": "zh-CN,zh;q=0.9",
                "authorization": getAuthorizationHeader(),
                "content-type": "application/json",
                "origin": baseUrl,
                "referer": `${baseUrl}/app/devops/import-export`,
                "x-poseidon-product": `${productName}`,
                "x-poseidon-project": `${projectName}`,
            },
            data: JSON.stringify(exportData),
            onload: function (response) {
                try {
                const result = JSON.parse(response.responseText);
                if (result.code === 0 && result.data) {
                        console.log(`[三叉戟] 成功触发${onlySelected ? '选中' : '批量'}导出${images.length}个镜像`);
                    const url = `${baseUrl}/app/devops/import-export?project=${projectName}&product=${productName}`;
                    window.open(url, '_blank');
                } else {
                        window.alert(`[三叉戟] 触发导出镜像失败: ${JSON.stringify(result)}`)
                    }
                } catch (e) {
                    window.alert(`[三叉戟] 解析响应失败: ${e.message}`);
                }
            },
            onerror: function (error) {
                window.alert(`[三叉戟] 触发导出镜像API call failed: ${error}`);
            },
        });
    }

    function onExcelExport() {
        const table = document.getElementById('release-note-table');
        const exportTable = prepareTableForExport(table)
        var workbook = XLSX.utils.table_to_book(exportTable, { sheet: "发版日志" });
        var ws = workbook.Sheets[workbook.SheetNames[0]];
        ws['!cols'] = [
            { wch: 10 },  // 选择列
            { wch: 50 },
            { wch: 50 },
            { wch: 50 },
            { wch: 50 },
            { wch: 50 }
        ];
        XLSX.writeFile(workbook, '发版日志.xlsx');
    }

    function prepareTableForExport(originalTable) {
        let clonedTable = originalTable.cloneNode(true);

        // 移除checkbox列
        clonedTable.querySelectorAll('.export-checkbox').forEach(cb => {
            cb.parentElement.remove();
        });

        // 移除"选择"表头
        clonedTable.querySelectorAll('tr.third-title td:first-child').forEach(td => {
            if (td.textContent.trim() === '选择') {
                td.remove();
            }
        });

        let textareas = clonedTable.getElementsByTagName('textarea');

        Array.from(textareas).forEach(textarea => {
            let content = textarea.value;
            let lines = content.split('\n');
            let parentTd = textarea.parentNode;
            let parentTr = parentTd.parentNode;
            let databaseCell = parentTr.cells[0];
            let descriptionCell = parentTr.cells[1];

            if (databaseCell) databaseCell.setAttribute('rowspan', lines.length);
            if (descriptionCell) descriptionCell.setAttribute('rowspan', lines.length);

            parentTd.remove();

            lines.forEach((line, index) => {
                if (index === 0) {
                    let newTd = document.createElement('td');
                    newTd.textContent = line;
                    newTd.setAttribute('colspan', '3');
                    parentTr.appendChild(newTd);
                } else {
                    let newRow = document.createElement('tr');
                    let newTd = document.createElement('td');
                    newTd.textContent = line;
                    newTd.setAttribute('colspan', '3');
                    newRow.appendChild(newTd);
                    parentTr.parentNode.insertBefore(newRow, parentTr.nextSibling);
                    parentTr = newRow;
                }
            });
        });

        return clonedTable;
    }

    function copyAppInfoToColipBoard() {
        let modal = document.getElementById('release-log-modal');

        if (!modal) {
            console.error('Modal element with ID "release-log-modal" not found.');
            alert('Modal element not found. Cannot copy text.');
            return;
        }

        const rows = document.querySelectorAll('#release-note-table tr.item-list[data-app]');
        let text = '';

        rows.forEach(row => {
            const appName = row.dataset.app;
            const tag = row.dataset.tag;
            if (appName && tag) {
                text += appName + '\t' + tag + '\n';
            }
        });

        if (!text) {
            alert('没有找到应用信息');
            return;
        }

        // 创建text area
        let textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "absolute";
        textArea.style.opacity = 0;
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        return new Promise((res, rej) => {
            document.execCommand('copy') ? res() : rej();
            textArea.remove();
            alert('成功复制应用信息到粘贴板');
        });
    }
})();
