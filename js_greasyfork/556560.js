// ==UserScript==
// @name         Garmin Connect 训练计划批量清理 & 导出 - 增强版 V2.3
// @namespace    http://tampermonkey.net/
// @version      2.3
// @license      MIT
// @description  批量识别和删除 Garmin Connect 日历中指定月份的训练计划，新增：在日历页面批量导出运动记录(GPX)；支持在“我的训练”页面批量删除训练。
// @author       qinjian
// @match        https://connect.garmin.cn/modern/calendar*
// @match        https://connect.garmin.com/modern/calendar*
// @match        https://connect.garmin.cn/modern/workouts*
// @match        https://connect.garmin.com/modern/workouts*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/556560/Garmin%20Connect%20%E8%AE%AD%E7%BB%83%E8%AE%A1%E5%88%92%E6%89%B9%E9%87%8F%E6%B8%85%E7%90%86%20%20%E5%AF%BC%E5%87%BA%20-%20%E5%A2%9E%E5%BC%BA%E7%89%88%20V23.user.js
// @updateURL https://update.greasyfork.org/scripts/556560/Garmin%20Connect%20%E8%AE%AD%E7%BB%83%E8%AE%A1%E5%88%92%E6%89%B9%E9%87%8F%E6%B8%85%E7%90%86%20%20%E5%AF%BC%E5%87%BA%20-%20%E5%A2%9E%E5%BC%BA%E7%89%88%20V23.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // =================================================================================================
    // 1. 数据存储和状态
    // =================================================================================================
    let cachedCalendarItems = []; // 日历页所有数据（包括计划和活动）
    let currentContext = null;    // 日历页上下文
    let workoutCheckInterval = null;

    // =================================================================================================
    // 2. 样式注入
    // =================================================================================================
    const STYLES = `
        /* 批量删除按钮（日历页） */
        #garmin-batch-del-btn {
            background-color: #9c27b0; 
            color: white; 
            border: none; 
            padding: 6px 15px; 
            border-radius: 4px; 
            font-size: 14px; 
            font-weight: bold; 
            cursor: pointer; 
            display: inline-block;
            margin-left: 20px;
        }
        #garmin-batch-del-btn:disabled { background-color: #ccc; cursor: not-allowed; }

        /* 批量导出按钮（日历页 V2.3 新增） */
        #garmin-batch-export-btn {
            background-color: #007bff; /* 蓝色 */
            color: white; 
            border: none; 
            padding: 6px 15px; 
            border-radius: 4px; 
            font-size: 14px; 
            font-weight: bold; 
            cursor: pointer; 
            display: inline-block;
            margin-left: 10px;
        }
        #garmin-batch-export-btn:disabled { background-color: #ccc; cursor: not-allowed; }

        /* 批量删除按钮（训练列表页） */
        #garmin-batch-del-workouts-btn {
            background-color: #d9534f; 
            color: white; 
            border: none; 
            padding: 6px 15px; 
            border-radius: 4px; 
            font-size: 14px; 
            font-weight: bold; 
            cursor: pointer; 
            display: inline-block;
            margin-left: 10px;
        }

        /* 模态框样式 */
        #gc-modal-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.6); z-index: 9999; display: flex;
            justify-content: center; align-items: center; font-family: 'Open Sans', sans-serif;
        }
        #gc-modal-box {
            background: #fff; width: 500px; max-height: 80vh; border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3); display: flex; flex-direction: column;
            overflow: hidden;
        }
        #gc-modal-header {
            padding: 15px 20px; background: #f5f7fa; border-bottom: 1px solid #eee;
            display: flex; justify-content: space-between; align-items: center;
        }
        #gc-modal-title { font-size: 16px; font-weight: bold; color: #333; }
        #gc-close-btn { cursor: pointer; font-size: 20px; color: #999; }
        #gc-modal-body { padding: 0; overflow-y: auto; flex-grow: 1; background: #fff; }
        .gc-list-item {
            display: flex; align-items: center; padding: 10px 20px; border-bottom: 1px solid #eee;
            transition: background 0.2s; background: #fcf8ff;
        }
        .gc-list-item:hover { background-color: #f5f0ff; }
        .gc-checkbox { transform: scale(1.3); margin-right: 15px; cursor: pointer; }
        .gc-item-info { flex-grow: 1; }
        .gc-visual-tag {
            display: inline-block; width: 8px; height: 8px; border-radius: 50%; 
            margin-right: 6px; box-shadow: 0 0 4px #ccc;
        }
        /* 类型颜色标签 */
        .tag-delete { background-color: #9c27b0; box-shadow: 0 0 4px #ce93d8; } /* 计划/删除 */
        .tag-export { background-color: #007bff; box-shadow: 0 0 4px #80bdff; } /* 活动/导出 */

        .gc-item-title { font-size: 14px; font-weight: 600; color: #333; }
        .gc-item-detail { font-size: 12px; color: #888; margin-top: 3px; display: flex; justify-content: space-between;}
        #gc-modal-footer {
            padding: 15px 20px; border-top: 1px solid #eee; background: #fff;
            display: flex; justify-content: space-between; align-items: center;
        }
        .gc-btn { padding: 8px 20px; border-radius: 4px; border: none; cursor: pointer; font-weight: bold; }
        .gc-btn-cancel { background: #f0f0f0; color: #333; }
        
        /* 动态按钮颜色 */
        .gc-btn-action-delete { background: #d9534f; color: #fff; }
        .gc-btn-action-delete:disabled { background: #f0ad4e; opacity: 0.7; cursor: not-allowed;}
        
        .gc-btn-action-export { background: #28a745; color: #fff; } /* 绿色导出确认键 */
        .gc-btn-action-export:disabled { background: #8fd19e; opacity: 0.7; cursor: not-allowed;}

        #gc-select-all-area { font-size: 14px; display: flex; align-items: center;}
    `;

    const styleSheet = document.createElement("style");
    styleSheet.innerText = STYLES;
    document.head.appendChild(styleSheet);


    // =================================================================================================
    // 3. 通用辅助函数
    // =================================================================================================

    function getCsrfToken() {
        const metaTag = document.querySelector('meta[name="csrf-token"]');
        return metaTag ? metaTag.content : null;
    }

    // --- 删除逻辑 ---
    async function deleteItem(id, type = 'schedule') {
        const csrfToken = getCsrfToken();
        if (!csrfToken) return false;

        const domain = window.location.origin;
        const apiPath = type === 'workout' ? 'workout' : 'schedule';
        const deleteUrl = `${domain}/gc-api/workout-service/${apiPath}/${id}`;

        try {
            const response = await fetch(deleteUrl, {
                method: 'DELETE',
                headers: { 'connect-csrf-token': csrfToken, 'Content-Type': 'application/json' }
            });
            return response.status === 204;
        } catch (error) {
            console.error(`删除出错 ID: ${id}`, error);
            return false;
        }
    }

    // --- V2.3 新增：导出逻辑 ---
    async function exportItem(id) {
        const csrfToken = getCsrfToken();
        const domain = window.location.origin;
        // 目标 URL: /gc-api/download-service/export/gpx/activity/{id}
        const exportUrl = `${domain}/gc-api/download-service/export/gpx/activity/${id}`;

        try {
            const response = await fetch(exportUrl, {
                method: 'GET',
                headers: { 'connect-csrf-token': csrfToken }
            });

            if (response.status === 200) {
                // 将响应转为 Blob，然后创建下载链接
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = `activity_${id}.gpx`; // 设置文件名
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                a.remove();
                return true;
            } else {
                console.error(`导出失败 ID ${id}, Status: ${response.status}`);
                return false;
            }
        } catch (error) {
            console.error(`导出出错 ID: ${id}`, error);
            return false;
        }
    }


    // =================================================================================================
    // 4. 日历页面逻辑
    // =================================================================================================

    function getContextFromUrl(url) {
        const match = url.match(/\/year\/(\d{4})\/month\/(\d{1,2})/);
        if (match) {
            let year = parseInt(match[1]);
            let urlMonth = parseInt(match[2]); 
            let monthIndex = urlMonth; 
            if (urlMonth === 12) {
                monthIndex = 0; 
                year += 1;
            }
            return {
                year: year,
                monthIndex: monthIndex, 
                display: `${year}年${monthIndex + 1}月`
            };
        }
        return null;
    }

    function getContextFromDom() {
        const header = document.querySelector('.calendar-header');
        if (!header) return null;
        const headerText = header.querySelector('.calendar-date-wrapper .calendar-date') || header;
        
        let cnDateMatch = headerText.innerText.match(/(\d{1,2})月\s*(\d{4})/);
        if (cnDateMatch) {
              return { 
                year: parseInt(cnDateMatch[2], 10), 
                monthIndex: parseInt(cnDateMatch[1], 10) - 1, 
                display: `${cnDateMatch[2]}年${cnDateMatch[1]}月` 
            };
        }
        cnDateMatch = headerText.innerText.match(/(\d{4}).*?(\d{1,2})月/);
        if (cnDateMatch) {
              return { 
                year: parseInt(cnDateMatch[1], 10), 
                monthIndex: parseInt(cnDateMatch[2], 10) - 1, 
                display: `${cnDateMatch[1]}年${cnDateMatch[2]}月` 
            };
        }
        return null;
    }
    
    function isItemInCurrentMonth(item, currentContext) {
        if (!currentContext || !item.date) return false;
        const itemDate = new Date(item.date);
        if (isNaN(itemDate.getTime())) return false;
        return (itemDate.getFullYear() === currentContext.year) &&
               (itemDate.getMonth() === currentContext.monthIndex);
    }

    // 收集目标项目 (V2.3 修改：增加 'activity' 类型)
    function collectTargetItems(calendarItems, context) {
        const targetItems = [];
        // workout/trainingPlan 用于删除, activity 用于导出
        const targetTypes = ['workout', 'trainingPlan', 'activity']; 

        calendarItems.forEach(item => {
            if (targetTypes.includes(item.itemType)) {
                if (isItemInCurrentMonth(item, context)) {
                    targetItems.push({
                        id: item.id,
                        title: item.title,
                        date: item.date || '未知日期',
                        itemType: item.itemType
                    });
                }
            }
        });

        targetItems.sort((a, b) => new Date(a.date) - new Date(b.date));
        return targetItems;
    }

    /**
     * 渲染模态框 (V2.3 升级：支持 Delete 和 Export 两种模式)
     * @param {Array} items - 待展示的数据
     * @param {String} monthTitle - 月份标题
     * @param {String} mode - 'delete' 或 'export'
     */
    function renderModal(items, monthTitle, mode = 'delete') {
        const old = document.getElementById('gc-modal-overlay');
        if (old) old.remove();

        // 根据模式设置文案和颜色
        const isDelete = mode === 'delete';
        const actionText = isDelete ? '删除' : '导出 GPX';
        const confirmBtnClass = isDelete ? 'gc-btn-action-delete' : 'gc-btn-action-export';
        const confirmBtnText = isDelete ? '确认删除' : '开始导出';
        const visualTagClass = isDelete ? 'tag-delete' : 'tag-export';
        
        const overlay = document.createElement('div');
        overlay.id = 'gc-modal-overlay';
        
        overlay.innerHTML = `
            <div id="gc-modal-box">
                <div id="gc-modal-header">
                    <div id="gc-modal-title">${actionText}: ${monthTitle} (共 ${items.length} 项)</div>
                    <div id="gc-close-btn">✕</div>
                </div>
                <div id="gc-modal-body"></div>
                <div id="gc-modal-footer">
                    <div id="gc-select-all-area">
                        <input type="checkbox" id="gc-select-all" checked class="gc-checkbox" style="margin-right:8px">
                        <label for="gc-select-all">全选 (${items.length}/${items.length})</label>
                    </div>
                    <div>
                        <button class="gc-btn gc-btn-cancel" id="gc-btn-cancel">取消</button>
                        <button class="gc-btn ${confirmBtnClass}" id="gc-btn-confirm">${confirmBtnText}</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        const listContainer = overlay.querySelector('#gc-modal-body');
        
        items.forEach(item => {
            const row = document.createElement('div');
            row.className = 'gc-list-item';
            let dateStr = item.date.substring(5, 10) || '--/--'; 
            
            // 类型显示名称
            let typeName = '未知';
            if (item.itemType === 'trainingPlan') typeName = '计划';
            if (item.itemType === 'workout') typeName = '单次训练';
            if (item.itemType === 'activity') typeName = '已完成活动';

            row.innerHTML = `
                <input type="checkbox" class="gc-checkbox item-chk" data-id="${item.id}" checked>
                <div class="gc-item-info">
                    <div class="gc-item-title">
                        <span class="gc-visual-tag ${visualTagClass}"></span>
                        ${item.title || '无标题'}
                    </div>
                    <div class="gc-item-detail">
                        <span>日期: ${dateStr}</span>
                        <span style="font-style: italic;">类型: ${typeName} | ID: ${item.id}</span>
                    </div>
                </div>
            `;
            
            // 点击行也能切换checkbox
            row.onclick = (e) => {
                if (e.target.type !== 'checkbox') {
                    const chk = row.querySelector('.item-chk');
                    chk.checked = !chk.checked;
                    updateBtnState();
                }
            };
            row.querySelector('.item-chk').onchange = (e) => { e.stopPropagation(); updateBtnState(); };
            listContainer.appendChild(row);
        });

        const close = () => overlay.remove();
        overlay.querySelector('#gc-close-btn').onclick = close;
        overlay.querySelector('#gc-btn-cancel').onclick = close;

        const allChk = overlay.querySelector('#gc-select-all');
        const itemChks = overlay.querySelectorAll('.item-chk');
        
        allChk.onchange = () => {
            itemChks.forEach(chk => chk.checked = allChk.checked);
            updateBtnState();
        };

        function updateBtnState() {
            const checkedCount = overlay.querySelectorAll('.item-chk:checked').length;
            const delBtn = overlay.querySelector('#gc-btn-confirm');
            const allLabel = overlay.querySelector('#gc-select-all-area label');
            
            delBtn.innerText = checkedCount > 0 ? `${actionText}选中的 (${checkedCount})` : '请选择';
            delBtn.disabled = checkedCount === 0;
            allLabel.innerText = `全选 (${checkedCount}/${itemChks.length})`;
            
            if(checkedCount === itemChks.length) allChk.checked = true;
            else if(checkedCount === 0) allChk.checked = false;
            allChk.indeterminate = checkedCount > 0 && checkedCount < itemChks.length;
        }

        // 确认按钮逻辑
        overlay.querySelector('#gc-btn-confirm').onclick = async () => {
            const selectedChks = overlay.querySelectorAll('.item-chk:checked');
            const idsToProcess = Array.from(selectedChks).map(chk => chk.dataset.id);
            
            if (idsToProcess.length === 0) return;

            // 确认提示
            const msg = isDelete 
                ? `⚠️ 最终确认：\n真的要永久删除这 ${idsToProcess.length} 个训练计划吗？`
                : `📥 准备导出：\n即将开始下载 ${idsToProcess.length} 个 GPX 文件。`;
            
            if (!confirm(msg)) return;

            const confirmBtn = overlay.querySelector('#gc-btn-confirm');
            const cancelBtn = overlay.querySelector('#gc-btn-cancel');
            cancelBtn.style.display = 'none'; 
            allChk.disabled = true;
            itemChks.forEach(c => c.disabled = true);

            let successCount = 0;
            
            for (let i = 0; i < idsToProcess.length; i++) {
                const id = idsToProcess[i];
                confirmBtn.innerText = `处理中... ${i + 1}/${idsToProcess.length}`;
                
                let success = false;
                if (isDelete) {
                    success = await deleteItem(id, 'schedule');
                } else {
                    success = await exportItem(id);
                }

                if (success) {
                    successCount++;
                    const itemRow = overlay.querySelector(`[data-id="${id}"]`).closest('.gc-list-item');
                    if(itemRow) {
                        itemRow.style.opacity = '0.5';
                        itemRow.style.textDecoration = isDelete ? 'line-through' : 'none';
                        if (!isDelete) itemRow.style.background = '#e8f5e9'; // 导出成功变绿
                    }
                }
                // 导出时稍微增加间隔，防止浏览器阻止并发下载
                const delay = isDelete ? 100 : 800; 
                await new Promise(r => setTimeout(r, delay)); 
            }

            alert(`处理完成！\n成功${actionText}: ${successCount} 项。`);
            overlay.remove();
            if (isDelete) location.reload(); // 仅删除需要刷新，导出不需要
        };

        updateBtnState();
    }

    // 打开选择模态框 (入口函数，区分模式)
    function openSelectionModal(mode = 'delete') {
        let contextToUse = currentContext || getContextFromDom();
        
        if (!contextToUse) {
            alert('错误：无法确定当前的日历年月信息。请刷新页面重试。');
            return;
        }

        if (cachedCalendarItems.length === 0) {
            alert(`当前 ${contextToUse.display} 未检测到数据，请确保页面已完全加载或刷新。`);
            return;
        }

        // 筛选数据：删除模式只看计划，导出模式只看活动
        let filteredItems = [];
        if (mode === 'delete') {
            filteredItems = cachedCalendarItems.filter(i => i.itemType === 'workout' || i.itemType === 'trainingPlan');
        } else {
            filteredItems = cachedCalendarItems.filter(i => i.itemType === 'activity');
        }

        if (filteredItems.length === 0) {
            const msg = mode === 'delete' 
                ? `当前 ${contextToUse.display} 没有可删除的训练计划。` 
                : `当前 ${contextToUse.display} 没有可导出的已完成活动。`;
            alert(msg);
            return;
        }
        
        renderModal(filteredItems, contextToUse.display, mode);
    }

    // 检查视图并注入日历按钮 (V2.3 更新：注入两个按钮)
    function checkViewAndInject() {
        const url = location.href;
        const isCalendarView = url.includes('/modern/calendar');
        const isWeekView = url.includes('/week/');
        const isYearView = url.includes('/year/') && !url.includes('/month/');
        
        const headerContainer = document.querySelector('.calendar-header'); 
        let delBtn = document.getElementById('garmin-batch-del-btn');
        let exportBtn = document.getElementById('garmin-batch-export-btn');

        if (isCalendarView && !isWeekView && !isYearView && headerContainer) {
            const toolbar = headerContainer.querySelector('.calendar-header-toolbar > div:first-child') || headerContainer;

            // 1. 注入删除按钮
            if (!delBtn) {
                delBtn = document.createElement('button');
                delBtn.id = 'garmin-batch-del-btn';
                delBtn.innerText = '🗑️ 批量删除计划';
                delBtn.onclick = () => openSelectionModal('delete');
                toolbar.appendChild(delBtn);
            }
            // 2. 注入导出按钮 (V2.3 新增)
            if (!exportBtn) {
                exportBtn = document.createElement('button');
                exportBtn.id = 'garmin-batch-export-btn';
                exportBtn.innerText = '📥 批量导出记录 (GPX)';
                exportBtn.onclick = () => openSelectionModal('export');
                toolbar.appendChild(exportBtn);
            }

            delBtn.style.display = 'inline-block';
            exportBtn.style.display = 'inline-block';
            
            // 按钮启用状态简单控制（只要有上下文就启用，具体点击后再细分）
            const isDisabled = !currentContext;
            delBtn.disabled = isDisabled;
            exportBtn.disabled = isDisabled;

        } else {
            if (delBtn) delBtn.style.display = 'none';
            if (exportBtn) exportBtn.style.display = 'none';
        }
    }
    
    // API 响应数据处理 (日历页)
    function processCalendarResponse(url, data) {
        const context = getContextFromUrl(url); 
        if (context) {
            const items = data.calendarItems || [];
            // V2.3: collectTargetItems 现已包含 activity
            const targetItems = collectTargetItems(items, context);
            
            cachedCalendarItems = targetItems;
            currentContext = context;

            console.log(`V2.3: 日历数据捕获成功。总项数: ${targetItems.length}`);
            checkViewAndInject();
        }
    }


    // =================================================================================================
    // 5. 训练列表页面逻辑 (保持 V2.2 不变)
    // =================================================================================================
    
    function checkWorkoutsViewAndInject() {
        if (!location.href.includes('/modern/workouts')) return;
        const container = document.querySelector('.tab-pane.active'); 
        const listHeaderRow = document.querySelector('.sortable-header-row'); 
        if (!container || !listHeaderRow) return false;
        
        let delBtn = document.getElementById('garmin-batch-del-workouts-btn');
        let selectAllContainer = document.getElementById('garmin-select-all-workouts-container');
        
        const firstHeaderCell = listHeaderRow.querySelector('th:first-child');
        if (firstHeaderCell && !selectAllContainer) {
            selectAllContainer = document.createElement('div');
            selectAllContainer.id = 'garmin-select-all-workouts-container';
            selectAllContainer.style.cssText = 'display: flex; align-items: center; width: 100%; height: 100%; justify-content: center;';
            selectAllContainer.innerHTML = `<input type="checkbox" id="garmin-select-all-workouts" class="gc-checkbox" style="transform: scale(1.3); margin: 0;">`;
            firstHeaderCell.innerHTML = '';
            firstHeaderCell.appendChild(selectAllContainer);
        }
        
        const createWorkoutForm = container.querySelector('form.bottom-xs');
        if (!delBtn) {
            delBtn = document.createElement('button');
            delBtn.id = 'garmin-batch-del-workouts-btn';
            delBtn.className = 'gc-btn gc-btn-delete'; 
            delBtn.style.cssText = 'padding: 6px 15px; margin-left: 10px;'; 
            delBtn.innerText = '🗑️ 批量删除 (0 项)';
            delBtn.disabled = true;
            delBtn.onclick = confirmAndDeleteWorkouts;
        }
        
        if (createWorkoutForm && delBtn.parentElement !== createWorkoutForm) {
            createWorkoutForm.appendChild(delBtn); 
            const anchor = createWorkoutForm.querySelector('button.create-workout');
            if (anchor) anchor.style.marginRight = '10px';
        } else if (!createWorkoutForm && delBtn.parentNode !== container) {
            container.prepend(delBtn);
        }
        
        injectCheckboxesAndBindEvents();
        return true;
    }
    
    function injectCheckboxesAndBindEvents() {
        const rows = document.querySelectorAll('tbody tr[data-id]'); 
        const selectAllChk = document.getElementById('garmin-select-all-workouts');
        const delBtn = document.getElementById('garmin-batch-del-workouts-btn');
        if (!selectAllChk || !delBtn) return;

        rows.forEach(row => {
            let chk = row.querySelector('.gc-item-checkbox');
            if (!chk) {
                const workoutId = row.getAttribute('data-id');
                if (!workoutId) return; 
                chk = document.createElement('input');
                chk.type = 'checkbox';
                chk.className = 'gc-checkbox gc-item-checkbox';
                chk.setAttribute('data-id', workoutId);
                chk.style.cssText = 'transform: scale(1.3); margin: 0;';
                const firstCell = row.querySelector('td:first-child');
                if (firstCell) {
                    firstCell.innerHTML = ''; 
                    firstCell.style.textAlign = 'center';
                    firstCell.appendChild(chk);
                }
            }
            chk.onchange = updateWorkoutButtonState;
        });

        selectAllChk.onchange = () => {
            document.querySelectorAll('.gc-item-checkbox').forEach(chk => chk.checked = selectAllChk.checked);
            updateWorkoutButtonState();
        };
        updateWorkoutButtonState();
    }
    
    function updateWorkoutButtonState() {
        const itemChks = document.querySelectorAll('.gc-item-checkbox');
        const selectedCount = Array.from(itemChks).filter(chk => chk.checked).length;
        const delBtn = document.getElementById('garmin-batch-del-workouts-btn');
        const selectAllChk = document.getElementById('garmin-select-all-workouts');

        if (!delBtn) return;
        delBtn.innerText = selectedCount > 0 ? `🗑️ 批量删除 (${selectedCount} 项)` : '🗑️ 批量删除 (0 项)';
        delBtn.disabled = selectedCount === 0;
        if (selectAllChk) {
            selectAllChk.checked = itemChks.length > 0 && selectedCount === itemChks.length;
            selectAllChk.indeterminate = selectedCount > 0 && selectedCount < itemChks.length;
        }
    }
    
    async function confirmAndDeleteWorkouts() {
        const selectedChks = document.querySelectorAll('.gc-item-checkbox:checked');
        const idsToDelete = Array.from(selectedChks).map(chk => chk.getAttribute('data-id'));
        if (idsToDelete.length === 0) return;
        if (!confirm(`⚠️ 最终确认：\n真的要永久删除选中的 ${idsToDelete.length} 个训练吗？`)) return;

        const delBtn = document.getElementById('garmin-batch-del-workouts-btn');
        delBtn.disabled = true;
        document.querySelectorAll('.gc-item-checkbox').forEach(c => c.disabled = true);
        
        let successCount = 0;
        for (let i = 0; i < idsToDelete.length; i++) {
            const id = idsToDelete[i];
            delBtn.innerText = `处理中... ${i + 1}/${idsToDelete.length}`;
            const success = await deleteItem(id, 'workout'); 
            if (success) {
                successCount++;
                const itemRow = document.querySelector(`tbody tr[data-id="${id}"]`);
                if(itemRow) { itemRow.style.textDecoration = 'line-through'; itemRow.style.opacity = '0.5'; }
            }
            await new Promise(r => setTimeout(r, 100)); 
        }
        alert(`清理完成！\n成功删除: ${successCount} 项。请刷新页面。`);
        location.reload(); 
    }


    // =================================================================================================
    // 6. API 拦截 (V1.x 代码)
    // =================================================================================================
    
    function hookFetch() {
        if (window.fetch.isHooked) return;
        const originalFetch = window.fetch;
        window.fetch = async function(...args) {
            const response = await originalFetch.apply(this, args);
            const url = args[0] && (typeof args[0] === 'string' ? args[0] : args[0].url);
            
            if (url && url.includes('/gc-api/calendar-service/') && url.includes('/year/') && url.includes('/month/')) {
                if (response.status >= 200 && response.status < 300) {
                    try {
                        const cloned = response.clone();
                        const data = await cloned.json();
                        if (data && data.calendarItems) processCalendarResponse(url, data);
                    } catch (e) { console.error('JSON Error', e); }
                }
            }
            return response;
        };
        window.fetch.isHooked = true;
    }

    function hookXHR() {
        if (window.XMLHttpRequest.isHooked) return;
        const originalOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url) {
            this._url = url;
            originalOpen.apply(this, arguments);
        };
        const originalSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function() {
            if (this._url && this._url.includes('/gc-api/calendar-service/') && this._url.includes('/year/') && this._url.includes('/month/')) {
                this.addEventListener('load', function() {
                    if (this.status >= 200 && this.status < 300) {
                        try {
                            const data = JSON.parse(this.responseText);
                            if (data && data.calendarItems) processCalendarResponse(this._url, data);
                        } catch (e) {}
                    }
                });
            }
            originalSend.apply(this, arguments);
        };
        window.XMLHttpRequest.isHooked = true;
    }


    // =================================================================================================
    // 7. 初始化和页面切换监听
    // =================================================================================================
    
    let lastUrl = location.href;
    const observer = new MutationObserver((mutationsList) => {
        const currentUrl = location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            cachedCalendarItems = []; 
            currentContext = null; 
            if (currentUrl.includes('/modern/workouts')) setTimeout(checkWorkoutsViewAndInject, 5000); 
            else if (currentUrl.includes('/modern/calendar')) checkViewAndInject();
        }
        
        if (currentUrl.includes('/modern/workouts')) {
            const isRelevant = mutationsList.some(m => Array.from(m.addedNodes).some(n => n.tagName === 'TBODY'));
            if (isRelevant) checkWorkoutsViewAndInject();
        } else if (currentUrl.includes('/modern/calendar')) {
            checkViewAndInject();
        }
    });

    function initExtension() {
        hookFetch();
        hookXHR(); 
        observer.observe(document.body, { subtree: true, childList: true });
        
        if (location.href.includes('/modern/workouts')) {
            checkWorkoutsViewAndInject(); 
            if (!document.querySelector('.tab-pane.active') || !document.querySelector('.sortable-header-row')) {
                workoutCheckInterval = setInterval(() => {
                    if (checkWorkoutsViewAndInject()) {
                        clearInterval(workoutCheckInterval);
                        workoutCheckInterval = null;
                    }
                }, 100);
            }
        } else if (location.href.includes('/modern/calendar')) {
            checkViewAndInject();
        }
    }

    initExtension();
})();