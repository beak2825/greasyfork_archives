// ==UserScript==
// @name         三叉戟-发版管理-表格增强
// @namespace    http://tampermonkey.net/
// @version      1.3.0
// @description  发版管理页面，相关功能的增强实现
// @author       CloudS3n
// @match        https://poseidon.cisdigital.cn/app/devops*
// @icon         https://poseidon.cisdigital.cn/favicon.ico
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @require      https://unpkg.com/xlsx/dist/xlsx.full.min.js
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/562632/%E4%B8%89%E5%8F%89%E6%88%9F-%E5%8F%91%E7%89%88%E7%AE%A1%E7%90%86-%E8%A1%A8%E6%A0%BC%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/562632/%E4%B8%89%E5%8F%89%E6%88%9F-%E5%8F%91%E7%89%88%E7%AE%A1%E7%90%86-%E8%A1%A8%E6%A0%BC%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // 脚本版本信息
    const SCRIPT_VERSION = "1.3.0";
    const SCRIPT_NAME = "三叉戟-发版管理-表格增强";

    const releaseUrlPrefix =
        "https://poseidon.cisdigital.cn/app/devops/releases?";
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
            const tabItem = e.target.closest('.el-tabs__item');
            if (tabItem && location.href.startsWith(releaseUrlPrefix)) {
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

            let projectDisplayName = document.querySelectorAll(
                "#base-app > div > div.header-container > div.header > div.left > div.base-selector.base-selector > span.selector-item-wrap.selector-project > div > div.el-select-dropdown.el-popper.base-selector-dropdown > div > div.el-select-dropdown__wrap.el-scrollbar__wrap > ul > ul.el-select-group__wrap.recent-group > li:nth-child(2) > ul > li.el-select-dropdown__item.selected"
            )[0]?.textContent;
            let defaultProductDisplayName = document.querySelectorAll(
                "#base-app > div > div.header-container > div.header > div.left > div.base-selector.base-selector > span.selector-item-wrap.selector-product > div > div.el-select-dropdown.el-popper.base-selector-dropdown > div > div.el-select-dropdown__wrap.el-scrollbar__wrap > ul > ul.el-select-group__wrap.recent-group > li:nth-child(2) > ul > li.el-select-dropdown__item.selected"
            )[0]?.textContent;
            let selectProductDisplayName = document.querySelectorAll(
                "body > div.el-select-dropdown.el-popper.base-selector-dropdown > div > div.el-select-dropdown__wrap.el-scrollbar__wrap > ul > ul:nth-child(2) > li:nth-child(2) > ul > li.el-select-dropdown__item.selected"
            )[0]?.textContent;
            productDisplayName = defaultProductDisplayName ? defaultProductDisplayName : selectProductDisplayName;
            if (!productDisplayName) {
                console.error(
                    `[${SCRIPT_NAME}] 获取项目和产品信息失败，projectDisplayName=${projectDisplayName}, productDisplayName=${productDisplayName}`
                );
                return;
            }
            fetchProjectList()
                .then((projectList) => {
                    if (projectList && projectList.length > 0) {
                        projectList.forEach((project) => {
                            if (project.display_name === projectDisplayName) {
                                projectName = project.name;
                                project.products.forEach((product) => {
                                    if (
                                        product.display_name === productDisplayName
                                    ) {
                                        productName = product.name;
                                    }
                                });
                            }
                        });
                    }
                    if (projectName && productName) {
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
                                console.error(`[${SCRIPT_NAME}] Error fetching data: ${error}`);
                            });
                    } else {
                        console.error(
                            `[${SCRIPT_NAME}] 获取项目和产品信息失败，project=${projectName}, product=${productName}`
                        );
                    }
                })
                .catch((error) => {
                    console.error(`[${SCRIPT_NAME}] Error fetching data: ${error}`);
                });
        } catch (error) {
            console.error(`[${SCRIPT_NAME}] initializePageEnhancements错误: ${error}`);
        }
    }

    function reloadTableEnhancements() {
        // 重新加载表格增强
        console.log(`[${SCRIPT_NAME}] 重新加载表格增强...`);
        enableTableObserver();
    }

    function onUrlChange() {
        const currUrl = location.href;
        console.log(`[${SCRIPT_NAME}] URL changed!`, currUrl);
        if (currUrl.startsWith(releaseUrlPrefix)) {
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
        const headerRow = document.querySelector(
            ".el-table__header-wrapper .el-table__header thead tr"
        );
        const bodyRows = document.querySelectorAll(
            ".el-table__body-wrapper .el-table__body tbody tr"
        );
        const project = document.querySelectorAll(
            "#base-app > div > div.header-container > div.header > div.left > div.base-selector.base-selector > span.selector-item-wrap.selector-project > div > div.el-select-dropdown.el-popper.base-selector-dropdown > div > div.el-select-dropdown__wrap.el-scrollbar__wrap > ul > ul.el-select-group__wrap.recent-group > li:nth-child(2) > ul > li.el-select-dropdown__item.selected"
        )[0];
        const defaultProduct = document.querySelectorAll(
            "#base-app > div > div.header-container > div.header > div.left > div.base-selector.base-selector > span.selector-item-wrap.selector-product > div > div.el-select-dropdown.el-popper.base-selector-dropdown > div > div.el-select-dropdown__wrap.el-scrollbar__wrap > ul > ul.el-select-group__wrap.recent-group > li:nth-child(2) > ul > li.el-select-dropdown__item.selected"
        )[0];
        const product = document.querySelectorAll(
            "body > div.el-select-dropdown.el-popper.base-selector-dropdown > div > div.el-select-dropdown__wrap.el-scrollbar__wrap > ul > ul:nth-child(2) > li:nth-child(2) > ul > li.el-select-dropdown__item.selected"
        )[0];
        return (
            headerRow &&
            bodyRows &&
            bodyRows.length > 0 &&
            project &&
            (defaultProduct || product)
        );
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
        console.log("[三叉戟] 添加发版日志按钮");

        try {
            // 同时处理主表格和固定表格
            const fixedRows = document.querySelectorAll(
                ".el-table__fixed-body-wrapper .el-table__body tbody tr"
            );
            const mainRows = document.querySelectorAll(
                ".el-table__body-wrapper .el-table__body tbody tr"
            );

            console.log(`[三叉戟] 找到 ${fixedRows.length} 个固定行, ${mainRows.length} 个主表行`);

            fixedRows.forEach((row, index) => {
                const actionGroup = row.querySelector(
                    "td:last-child .table-action-group"
                );
                if (actionGroup) {
                    // 检查是否已经添加过按钮
                    if (actionGroup.querySelector('.release-log-btn')) {
                        return;
                    }

                    const actionItem = document.createElement("div");
                    actionItem.className = "table-action-item";
                    const btn = document.createElement("button");
                    btn.setAttribute("type", "button");
                    btn.setAttribute("data-row-index", index.toString());
                    btn.style.cssText =
                        "margin-top:-10px; vertical-align:middle; color:var(--cs-color_primary); cursor: pointer;";
                    btn.className =
                        "el-button table-action-button table-action-item el-button--text release-log-btn";
                    btn.innerHTML = "<span>发版日志</span>";

                    actionItem.appendChild(btn);
                    actionGroup.appendChild(actionItem);

                    // 同步行高
                    if (mainRows[index]) {
                        syncRowHeight(mainRows[index], row);
                    }
                }
            });

            // 使用事件委托 - 在 document 上监听点击事件
            if (!window._releaseLogClickHandlerAdded) {
                window._releaseLogClickHandlerAdded = true;
                document.addEventListener('click', function(e) {
                    const btn = e.target.closest('.release-log-btn');
                    if (btn) {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log("[三叉戟] 发版日志按钮被点击 (事件委托)");
                        
                        // 获取按钮所在的行（在固定表格中）
                        const fixedRow = btn.closest('tr');
                        if (!fixedRow) {
                            console.error("[三叉戟] 无法找到按钮所在的行");
                            return;
                        }
                        
                        // 获取行索引
                        const rowIndex = Array.from(fixedRow.parentElement.children).indexOf(fixedRow);
                        console.log("[三叉戟] 点击的行索引:", rowIndex);
                        
                        // 从主表格获取对应行（主表格包含所有数据列）
                        const mainTableRows = document.querySelectorAll(
                            ".el-table__body-wrapper .el-table__body tbody tr"
                        );
                        const mainRow = mainTableRows[rowIndex];
                        
                        if (mainRow) {
                            console.log("[三叉戟] 找到主表格对应行");
                            handleReleaseLogClick(mainRow);
                        } else {
                            console.error("[三叉戟] 无法在主表格中找到对应行, 索引:", rowIndex);
                            // 降级使用固定表格行
                            handleReleaseLogClick(fixedRow);
                        }
                    }
                }, true); // 使用捕获阶段
                console.log("[三叉戟] 事件委托已注册");
            }

            console.log("[三叉戟] 发版日志按钮添加完成");
        } catch (error) {
            console.error("[三叉戟] addReleaseNoteButton错误:", error);
        }
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
                const env = (releaseDetail && releaseDetail.env) ? releaseDetail.env : "dev";

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
            const publicConfigCheck = checkPublicConfigSync(releaseDetail);
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
        const status = releaseDetail.status;
        const statusMap = {
            0: '草稿',
            1: '待发布',
            2: '发布中',
            3: '已发布',
            4: '已回滚'
        };

        if (status === 3) {
            return {
                name: '版本状态',
                status: 'passed',
                message: `状态正常: ${statusMap[status] || status}`
            };
        } else if (status === 2) {
            return {
                name: '版本状态',
                status: 'warning',
                message: `发布进行中: ${statusMap[status] || status}`
            };
        } else {
            return {
                name: '版本状态',
                status: 'warning',
                message: `当前状态: ${statusMap[status] || status}`
            };
        }
    }

    function checkEnvironment(releaseDetail) {
        const env = releaseDetail.env;
        const validEnvs = ['dev', 'test', 'staging', 'prod', 'production'];

        if (validEnvs.includes(env)) {
            return {
                name: '环境配置',
                status: 'passed',
                message: `环境: ${env}`
            };
        } else {
            return {
                name: '环境配置',
                status: 'warning',
                message: `未知环境: ${env || '未设置'}`
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

    // 异步检查branch信息
    async function checkBranchTagMatchAsync(serviceTasks) {
        const issues = [];
        const passed = [];
        
        for (const task of serviceTasks) {
            const appId = task.task.app.id;
            const appName = task.task.app.name;
            const tag = task.task.tag || '';
            const version = tag.replace(/-release$/, '');
            const expectedBranch = `tags/v${version}`;
            
            try {
                // 获取该应用的构建记录
                const builds = await fetchAppBuilds(appId);
                
                // 查找与当前tag匹配的构建记录
                const matchingBuild = builds.find(b => b.tag === version || b.tag === tag);
                
                if (matchingBuild) {
                    const actualBranch = matchingBuild.branch || '';
                    if (actualBranch === expectedBranch) {
                        passed.push(appName);
                    } else {
                        issues.push(`${appName}: branch="${actualBranch}" 应为"${expectedBranch}"`);
                    }
                } else {
                    issues.push(`${appName}: 未找到tag=${version}的构建记录`);
                }
            } catch (error) {
                console.error(`[三叉戟] 获取${appName}构建记录失败:`, error);
                issues.push(`${appName}: 获取构建记录失败`);
            }
        }

        return {
            name: 'Branch-Tag匹配',
            status: issues.length === 0 ? 'passed' : 'failed',
            message: issues.length === 0 
                ? `${passed.length}个服务branch格式正确(tags/v{version})`
                : issues.slice(0, 3).join('; ') + (issues.length > 3 ? `...等${issues.length}个` : '')
        };
    }

    // 获取应用的构建记录
    function fetchAppBuilds(appId) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: `https://poseidon.cisdigital.cn/devops/api/apps/${appId}/builds/?page=1&page_size=20`,
                headers: {
                    accept: "application/json, text/plain, */*",
                    "accept-language": "zh-CN,zh;q=0.9",
                    authorization: `Bearer ${getCookie("poseidon_user_token")}`,
                    "x-poseidon-product": `${productName}`,
                    "x-poseidon-project": `${projectName}`,
                },
                onload: function (response) {
                    try {
                        const result = JSON.parse(response.responseText);
                        if (result.code === 0 && Array.isArray(result.data)) {
                            resolve(result.data);
                        } else {
                            reject(new Error("API返回结构异常"));
                        }
                    } catch (e) {
                        reject(new Error(`解析响应失败: ${e.message}`));
                }
                },
                onerror: function (error) {
                    reject(new Error(`API调用失败: ${error}`));
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
    function checkPublicConfigSync(releaseDetail) {
        // 尝试从多个可能的位置获取公共配置
        const publicConfigs = releaseDetail.public_configs || 
                             releaseDetail.configs?.public || 
                             releaseDetail.config_files?.public || 
                             [];

        if (!Array.isArray(publicConfigs)) {
            return {
                name: '公共配置检查',
                status: 'warning',
                message: '无法获取公共配置信息'
            };
        }

        const validConfigs = ['bootstrap-external.yaml', 'bootstrap.yml'];
        const configNames = publicConfigs.map(c => 
            typeof c === 'string' ? c : (c.name || c.filename || c)
        );

        const invalidConfigs = configNames.filter(name => !validConfigs.includes(name));
        const missingConfigs = validConfigs.filter(name => !configNames.includes(name));

        if (invalidConfigs.length > 0) {
            return {
                name: '公共配置检查',
                status: 'failed',
                message: `204-波塞冬发布任务-公共配置不规范: 包含无效配置 ${invalidConfigs.join(', ')}`
            };
        }

        if (missingConfigs.length > 0) {
            return {
                name: '公共配置检查',
                status: 'failed',
                message: `204-波塞冬发布任务-公共配置不规范: 缺少配置 ${missingConfigs.join(', ')}`
            };
        }

        return {
            name: '公共配置检查',
            status: 'passed',
            message: '公共配置规范: bootstrap-external.yaml, bootstrap.yml'
        };
    }

    // 检查2.5: 后端应用公共配置关联
    function checkBackendAppConfigSync(taskList, releaseDetail) {
        const serviceTasks = taskList.filter(t => t.task_type === 1);
        const backendApps = serviceTasks
            .filter(t => t.task.app.name.startsWith('app-'))
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
            // 尝试从任务或发布详情中获取配置关联信息
            const appConfigs = task.task.configs || 
                              task.task.public_configs || 
                              task.configs || 
                              [];
            
            const configNames = Array.isArray(appConfigs) 
                ? appConfigs.map(c => typeof c === 'string' ? c : (c.name || c.filename || c))
                : [];

            const bootstrapExternalCount = configNames.filter(name => 
                name === 'bootstrap-external.yaml' || name.includes('bootstrap-external')
            ).length;

            if (bootstrapExternalCount === 0) {
                issues.push(`${appName}: 未关联 bootstrap-external.yaml`);
            } else if (bootstrapExternalCount > 1) {
                issues.push(`${appName}: 关联了${bootstrapExternalCount}个 bootstrap-external.yaml (应为1个)`);
            }
        });

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
            return {
                name: 'app-datakits-ai配置检查',
                status: 'warning',
                message: '本次发布不包含 app-datakits-ai 应用'
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
            return {
                name: 'app-datagovernance-management配置检查',
                status: 'warning',
                message: '本次发布不包含 app-datagovernance-management 应用'
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

    function fetchProjectList() {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: `https://poseidon.cisdigital.cn/api/projects/`,
                headers: {
                    accept: "application/json, text/plain, */*",
                    "accept-language": "zh-CN,zh;q=0.9",
                    authorization: `Bearer ${getCookie("poseidon_user_token")}`,
                    referer:
                        "https://poseidon.cisdigital.cn/app/devops/releases?project=ciip-private&product=datakits",
                },
                onload: function (response) {
                    try {
                    const result = JSON.parse(response.responseText);
                    if (result.code === 0 && Array.isArray(result.data)) {
                            console.log(`[三叉戟] 获取项目数据成功`);
                        resolve(result.data);
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

    function fetchReleaseList(archived = 0) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: `https://poseidon.cisdigital.cn/devops/api/releases/?page=1&page_size=100&archived=${archived}&search=`,
                headers: {
                    accept: "application/json, text/plain, */*",
                    "accept-language": "zh-CN,zh;q=0.9",
                    authorization: `Bearer ${getCookie("poseidon_user_token")}`,
                    referer:
                        "https://poseidon.cisdigital.cn/app/devops/releases?project=ciip-private&product=datakits",
                    "x-poseidon-product": `${productName}`,
                    "x-poseidon-project": `${projectName}`,
                },
                onload: function (response) {
                    try {
                    const result = JSON.parse(response.responseText);
                    if (result.code === 0 && Array.isArray(result.data)) {
                            console.log(`[三叉戟] 获取版本管理数据(archived=${archived})成功`);
                        resolve(result.data);
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

    function fetchReleaseDetailData(releaseId) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: `https://poseidon.cisdigital.cn/devops/api/releases/${releaseId}/`,
                headers: {
                    accept: "application/json, text/plain, */*",
                    "accept-language": "zh-CN,zh;q=0.9",
                    authorization: `Bearer ${getCookie("poseidon_user_token")}`,
                    referer:
                        "https://poseidon.cisdigital.cn/app/devops/releases?project=ciip-private&product=datakits",
                    "x-poseidon-product": `${productName}`,
                    "x-poseidon-project": `${projectName}`,
                },
                onload: function (response) {
                    try {
                    const result = JSON.parse(response.responseText);
                    if (result.code === 0 && result.data) {
                            console.log(`[三叉戟] 获取版本详情数据成功`);
                        resolve(result.data);
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

    function fetchTaskList(releaseId, env) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: `https://poseidon.cisdigital.cn/devops/api/releases/${releaseId}/tasks/?env=${env}`,
                headers: {
                    accept: "application/json, text/plain, */*",
                    "accept-language": "zh-CN,zh;q=0.9",
                    authorization: `Bearer ${getCookie("poseidon_user_token")}`,
                    referer:
                        "https://poseidon.cisdigital.cn/app/devops/releases?project=ciip-private&product=datakits",
                    "x-poseidon-product": `${productName}`,
                    "x-poseidon-project": `${projectName}`,
                },
                onload: function (response) {
                    try {
                    const result = JSON.parse(response.responseText);
                    if (result.code === 0 && Array.isArray(result.data)) {
                            console.log(`[三叉戟] 获取版本任务数据成功`);
                        resolve(result.data);
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

        const checksHtml = checkResults.checks.map(check => `
            <div class="check-item">
                <div class="check-icon ${check.status}">${iconMap[check.status]}</div>
                <span class="check-name">${check.name}</span>
                <span class="check-message">${check.message}</span>
            </div>
        `).join('');

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
        const token = getCookie("poseidon_user_token");

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

        GM_xmlhttpRequest({
            method: "POST",
            url: "https://poseidon.cisdigital.cn/devops/api/migration/exports/",
            headers: {
                "accept": "application/json, text/plain, */*",
                "accept-language": "zh-CN,zh;q=0.9",
                "authorization": `Bearer ${token}`,
                "content-type": "application/json",
                "origin": "https://poseidon.cisdigital.cn",
                "referer": "https://poseidon.cisdigital.cn/app/devops/import-export",
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
                    const url = `https://poseidon.cisdigital.cn/app/devops/import-export?project=${projectName}&product=${productName}`;
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

        GM_xmlhttpRequest({
            method: "POST",
            url: "https://poseidon.cisdigital.cn/devops/api/migration/exports/",
            headers: {
                "accept": "application/json, text/plain, */*",
                "accept-language": "zh-CN,zh;q=0.9",
                "authorization": `Bearer ${getCookie("poseidon_user_token")}`,
                "content-type": "application/json",
                "origin": "https://poseidon.cisdigital.cn",
                "referer": "https://poseidon.cisdigital.cn/app/devops/import-export",
                "x-poseidon-product": `${productName}`,
                "x-poseidon-project": `${projectName}`,
            },
            data: JSON.stringify(exportData),
            onload: function (response) {
                try {
                const result = JSON.parse(response.responseText);
                if (result.code === 0 && result.data) {
                        console.log(`[三叉戟] 成功触发${onlySelected ? '选中' : '批量'}导出${images.length}个镜像`);
                    const url = `https://poseidon.cisdigital.cn/app/devops/import-export?project=${projectName}&product=${productName}`;
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
