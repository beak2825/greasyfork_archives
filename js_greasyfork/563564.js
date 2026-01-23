// ==UserScript==
// @name         电子税务局外管证自动延期脚本
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动扫描并延期到期或者即将到期的外管证（跨区域涉税事项报告）
// @author       Herohub
// @match        https://etax.hunan.chinatax.gov.cn:8443/xxbg/view/ztxxbg/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563564/%E7%94%B5%E5%AD%90%E7%A8%8E%E5%8A%A1%E5%B1%80%E5%A4%96%E7%AE%A1%E8%AF%81%E8%87%AA%E5%8A%A8%E5%BB%B6%E6%9C%9F%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/563564/%E7%94%B5%E5%AD%90%E7%A8%8E%E5%8A%A1%E5%B1%80%E5%A4%96%E7%AE%A1%E8%AF%81%E8%87%AA%E5%8A%A8%E5%BB%B6%E6%9C%9F%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置参数
    const config = {
        // 延期日期设置（默认值，用户可以手动修改）
        extensionYear: parseInt(localStorage.getItem('taxCertificateExtensionYear')) || 2026,
        extensionMonth: parseInt(localStorage.getItem('taxCertificateExtensionMonth')) || 12,
        extensionDay: parseInt(localStorage.getItem('taxCertificateExtensionDay')) || 31,
        
        // 到期提醒设置
        expirySetting: localStorage.getItem('taxCertificateExpirySetting') || 'expired', // 到期设置：expired(已过期), 10(10日内), 30(30日内), 180(180日内)
        
        // 执行设置
        autoExecute: false,        // 是否自动执行
        showNotification: true,    // 是否显示通知
        manualDateSelection: false, // 改为自动选择日期
        manualConfirmation: localStorage.getItem('taxCertificateManualConfirmation') !== 'false',  // 是否需要手动确认，默认true
        
        // 页面选择器
        selectors: {
            // 弹窗相关
            dateInput: 'input[placeholder="请选择日期"]',
            monthSelect: '.t-date-picker__header-controller-month',
            yearSelect: '.t-date-picker__header-controller-year',
            dateCell: '.t-date-picker__cell:not(.t-date-picker__cell--disabled) .t-date-picker__cell-inner',
            submitButton: 'button',
            cancelButton: 'button:contains("取消")'
        }
    };
    
    // 执行控制变量
    // 从 localStorage 恢复状态，确保页面刷新后能够继续执行
    let isRunning = localStorage.getItem('taxCertificateIsRunning') === 'true'; // 是否正在执行
    let lastPageSize = parseInt(localStorage.getItem('taxCertificateLastPageSize')) || 0; // 上一次的页面大小

    /**
     * 保存执行状态到本地存储
     * @param {boolean} status - 执行状态
     */
    function saveExecutionStatus(status) {
        isRunning = status;
        localStorage.setItem('taxCertificateIsRunning', status.toString());
        addLog('执行状态已保存：' + (status ? '运行中' : '已停止'));
    }

    /**
     * 获取当前日期
     * @returns {Date} 当前日期对象
     */
    function getCurrentDate() {
        return new Date();
    }

    /**
     * 解析日期字符串为Date对象
     * @param {string} dateStr - 日期字符串，格式如"2025-12-31"
     * @returns {Date|null} 解析后的Date对象，解析失败返回null
     */
    function parseDate(dateStr) {
        if (!dateStr) return null;
        
        const match = dateStr.match(/(\d{4})-(\d{2})-(\d{2})/);
        if (!match) return null;
        
        const [, year, month, day] = match;
        return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    }

    /**
     * 计算两个日期之间的天数差
     * @param {Date} date1 - 第一个日期
     * @param {Date} date2 - 第二个日期
     * @returns {number} 天数差
     */
    function getDaysDifference(date1, date2) {
        const timeDiff = Math.abs(date2.getTime() - date1.getTime());
        return Math.ceil(timeDiff / (1000 * 3600 * 24));
    }

    /**
     * 检查外管证是否需要延期
     * @param {string} expiryDateStr - 到期日期字符串
     * @returns {boolean} 是否需要延期
     */
    function needExtension(expiryDateStr) {
        const expiryDate = parseDate(expiryDateStr);
        if (!expiryDate) return false;
        
        const currentDate = getCurrentDate();
        
        // 直接比较日期
        if (expiryDate < currentDate) {
            // 已经过期，需要延期
            return true;
        }
        
        // 未过期，根据用户设置的到期阈值检查
        const daysLeft = getDaysDifference(currentDate, expiryDate);
        
        // 根据用户选择的到期设置判断
        switch (config.expirySetting) {
            case '10':
                return daysLeft <= 10;
            case '30':
                return daysLeft <= 30;
            case '180':
                return daysLeft <= 180;
            case 'expired':
            default:
                // 只处理已过期的
                return false;
        }
    }

    /**
     * 扫描页面上的所有外管证记录
     * @returns {Array} 外管证记录数组
     */
    function scanCertificates() {
        const records = [];
        
        // 获取所有表格
        const tables = document.querySelectorAll('table');
        console.log('找到表格数量：', tables.length);
        
        // 打印所有表格的信息
        tables.forEach((table, index) => {
            const rows = table.querySelectorAll('tr');
            console.log(`表格 ${index}：行数=${rows.length}，类名=${table.className}`);
        });
        
        // 尝试获取第二个表格（外管证记录表格）
        const fixedTables = document.querySelectorAll('table.t-table--layout-fixed');
        console.log('找到固定布局表格数量：', fixedTables.length);
        
        if (fixedTables.length < 2) {
            console.log('未找到外管证记录表格，尝试使用第一个表格');
            if (tables.length > 0) {
                var recordTable = tables[0];
            } else {
                console.log('页面上没有表格');
                return records;
            }
        } else {
            var recordTable = fixedTables[1];
        }
        
        const rows = recordTable.querySelectorAll('tr');
        console.log('表格行数：', rows.length);
        
        // 跳过表头行，从第二行开始
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            
            // 获取所有单元格内容
            const cells = row.querySelectorAll('.t-table__ellipsis.t-text-ellipsis');
            console.log(`行 ${i} 单元格数量：`, cells.length);
            
            if (cells.length < 6) {
                console.log(`跳过不完整的记录（行 ${i}）`);
                continue; // 跳过不完整的记录
            }
            
            // 打印所有单元格内容
            console.log(`行 ${i} 单元格内容：`);
            cells.forEach((cell, cellIndex) => {
                console.log(`  单元格 ${cellIndex}：${cell.textContent.trim()}`);
            });
            
            // 外管证名称（第一个单元格）
            const name = cells[0].textContent.trim();
            
            // 到期时间（第六个单元格，索引为5）
            const expiryDate = cells[5].textContent.trim();
            
            // 延期按钮（操作列中的按钮）
            const buttons = row.querySelectorAll('.t-link.t-link--theme-primary.t-link--hover-color');
            console.log(`行 ${i} 按钮数量：`, buttons.length);
            
            let extensionBtn = null;
            
            // 寻找文本为"延期"的按钮
            buttons.forEach(btn => {
                console.log(`  按钮文本：${btn.textContent.trim()}`);
                if (btn.textContent.trim() === '延期') {
                    extensionBtn = btn;
                    console.log(`  找到延期按钮`);
                }
            });
            
            if (name && expiryDate && extensionBtn) {
                records.push({
                    name,
                    expiryDate,
                    extensionButton: extensionBtn,
                    row
                });
                console.log(`  添加记录：${name}，到期时间：${expiryDate}`);
            } else {
                console.log(`  跳过记录：名称=${name ? '有' : '无'}，到期时间=${expiryDate ? '有' : '无'}，按钮=${extensionBtn ? '有' : '无'}`);
            }
        }
        
        console.log('扫描到外管证记录：', records.length, '条');
        return records;
    }

    /**
     * 执行延期操作
     * @param {Object} certificate - 外管证记录对象
     */
    async function extendCertificate(certificate) {
        try {
            console.log(`开始延期外管证：${certificate.name}`);
            
            // 点击延期按钮
            certificate.extensionButton.click();
            
            // 等待弹窗出现
            await new Promise(resolve => setTimeout(resolve, 1000)); // 增加等待时间
            
            // 处理日期选择
            await selectExtensionDate();
            
            // 等待日期选择完成
            await new Promise(resolve => setTimeout(resolve, 1000)); // 增加等待时间
            
            // 点击提交按钮
            let submitBtn = document.querySelector('button');
            // 尝试找到提交或确定按钮
            const buttons = document.querySelectorAll('button');
            buttons.forEach(btn => {
                const text = btn.textContent.trim();
                if (text === '提交' || text === '确定' || text === '保存') {
                    submitBtn = btn;
                }
            });
            
            if (submitBtn) {
                console.log('找到提交按钮，准备点击');
                submitBtn.click();
            } else {
                console.error('未找到提交按钮');
                if (config.showNotification) {
                    alert('未找到提交按钮，请手动点击提交按钮完成延期操作。');
                }
                return;
            }
            
            // 等待提交完成
            await new Promise(resolve => setTimeout(resolve, 2000)); // 增加等待时间
            
            console.log(`外管证 ${certificate.name} 延期操作已完成`);
            
            if (config.showNotification) {
                alert(`外管证 ${certificate.name} 延期操作已完成！\n\n请点击确定返回外管证列表页面，然后刷新页面继续处理下一个外管证。`);
            }
        } catch (error) {
            console.error(`延期外管证 ${certificate.name} 时出错：`, error);
            if (config.showNotification) {
                alert(`延期外管证 ${certificate.name} 时出错，请手动处理。\n\n错误信息：${error.message}\n\n请点击确定返回外管证列表页面。`);
            }
        }
    }

    /**
     * 选择延期日期
     */
    async function selectExtensionDate() {
        try {
            console.log('开始选择延期日期...');
            
            // 查找日期输入框
            let dateInput = document.querySelector('input[placeholder="请选择日期"]');
            
            // 如果没找到，尝试其他选择器
            if (!dateInput) {
                dateInput = document.querySelector('input.t-input__inner');
            }
            
            if (dateInput) {
                console.log('找到日期输入框:', dateInput);
                
                // 点击日期输入框打开日期选择器
                dateInput.click();
                console.log('点击了日期输入框');
                
                // 等待日期选择器出现
                await new Promise(resolve => setTimeout(resolve, 2000));
                console.log('等待日期选择器出现完成');
                
                // 方法1：尝试直接在输入框中设置日期
                const targetDate = `${config.extensionYear}-${String(config.extensionMonth).padStart(2, '0')}-${String(config.extensionDay).padStart(2, '0')}`;
                console.log('尝试直接设置日期:', targetDate);
                
                dateInput.value = targetDate;
                
                // 触发多种事件
                const events = ['change', 'input', 'blur', 'keydown', 'keyup'];
                events.forEach(eventName => {
                    try {
                        dateInput.dispatchEvent(new Event(eventName, { bubbles: true, cancelable: true }));
                    } catch (e) {
                        console.log(`触发${eventName}事件失败:`, e);
                    }
                });
                
                // 尝试触发键盘事件模拟用户输入
                try {
                    dateInput.dispatchEvent(new KeyboardEvent('keydown', {
                        key: 'Enter',
                        bubbles: true,
                        cancelable: true
                    }));
                } catch (e) {
                    console.log('触发Enter事件失败:', e);
                }
                
                console.log('直接设置日期完成');
                
                // 等待输入框更新
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // 检查是否设置成功
                console.log('日期输入框当前值:', dateInput.value);
                
                if (!dateInput.value) {
                    console.warn('直接设置日期失败，尝试方法2');
                    
                    // 方法2：尝试找到日期选择器的具体组件
                    await findAndSelectDateDirectly();
                    
                    // 再次检查
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    console.log('方法2完成后日期输入框值:', dateInput.value);
                }
                
                if (!dateInput.value) {
                    console.warn('所有自动方法失败，使用备用方案');
                    // 备用方法：提醒用户手动选择
                    if (config.showNotification) {
                        alert('自动日期选择失败，请手动选择延期日期:\n\n建议日期: ' + targetDate + '\n\n操作步骤:\n1. 点击日期输入框\n2. 在弹出的日历中选择日期\n3. 点击提交按钮');
                    }
                }
            } else {
                console.error('未找到日期输入框');
                if (config.showNotification) {
                    alert('未找到日期输入框，请手动选择延期日期');
                }
            }
        } catch (error) {
            console.error('选择延期日期时出错：', error);
            if (config.showNotification) {
                alert('选择延期日期时出错，请手动选择日期\n\n错误信息：' + error.message);
            }
        }
    }

    /**
     * 直接查找并选择日期
     */
    async function findAndSelectDateDirectly() {
        try {
            console.log('开始直接查找并选择日期...');
            
            // 查找日期选择器面板
            const datePickerPanels = document.querySelectorAll('.t-popup, .t-date-picker__panel-container');
            console.log('找到日期选择器面板数量:', datePickerPanels.length);
            
            if (datePickerPanels.length > 0) {
                console.log('找到日期选择器面板:', datePickerPanels[0]);
                
                // 尝试查找年份和月份选择器
                const yearElements = document.querySelectorAll('.t-date-picker__header-controller-year, .t-select-input');
                const monthElements = document.querySelectorAll('.t-date-picker__header-controller-month, .t-select-input');
                
                console.log('找到年份选择器相关元素:', yearElements.length);
                console.log('找到月份选择器相关元素:', monthElements.length);
                
                // 尝试点击今天按钮或其他快捷按钮
                const todayButtons = document.querySelectorAll('.t-date-picker__cell.t-date-picker__cell--today');
                if (todayButtons.length > 0) {
                    console.log('找到今天按钮，尝试点击');
                    todayButtons[0].click();
                    return;
                }
                
                // 尝试直接点击日期单元格
                const dateCells = document.querySelectorAll('.t-date-picker__cell .t-date-picker__cell-inner');
                console.log('找到日期单元格数量:', dateCells.length);
                
                if (dateCells.length > 0) {
                    // 尝试点击一个可用的日期
                    dateCells.forEach((cell, index) => {
                        const dayText = cell.textContent.trim();
                        const day = parseInt(dayText);
                        
                        if (!isNaN(day) && day > 0 && day <= 31) {
                            console.log('尝试点击日期:', day);
                            try {
                                cell.click();
                                console.log('成功点击日期:', day);
                            } catch (e) {
                                console.log('点击日期失败:', e);
                            }
                            // 只尝试前几个日期
                            if (index < 5) return;
                        }
                    });
                }
            }
            
            // 尝试另一种方法：查找所有可能的日期相关元素
            const allDateElements = document.querySelectorAll('[class*="date"], [class*="Date"]');
            console.log('找到日期相关元素数量:', allDateElements.length);
            
        } catch (error) {
            console.error('直接选择日期时出错：', error);
        }
    }

    /**
     * 主执行函数
     */
    function main() {
        try {
            console.log('开始执行外管证延期脚本...');
            console.log('当前页面URL:', window.location.href);
            
            // 首先检查是否在正确的页面
            const currentUrl = window.location.href;
            const isCorrectPage = currentUrl.includes('kqysssxgl') || 
                                currentUrl.includes('kqysssx') ||
                                currentUrl.includes('跨区域涉税');
            
            console.log('页面检查结果:', isCorrectPage);
            
            if (!isCorrectPage) {
                if (config.showNotification) {
                    alert('请在跨区域涉税事项管理页面运行此脚本。');
                }
                return;
            }
            
            // 扫描当前页面的外管证
            scanAndProcessPage();
            
        } catch (error) {
            console.error('执行脚本时出错：', error);
            if (config.showNotification) {
                alert('执行脚本时出错，请检查控制台日志。');
            }
        }
    }

    /**
     * 扫描当前页面并处理外管证
     */
    async function scanAndProcessPage() {
        try {
            // 检查是否正在运行
            if (!isRunning) {
                addLog('执行已停止，退出扫描');
                updateStatus('已停止');
                return;
            }
            
            addLog('扫描当前页面的外管证...');
            updateStatus('扫描中');
            
            // 保存当前页码，确保下次直接用当前页面查找
            const currentPage = getCurrentPageNumber();
            saveCurrentPage(currentPage);
            
            // 尝试跳转到保存的页码
            const savedPage = getSavedCurrentPage();
            if (savedPage > 1) {
                addLog('尝试跳转到保存的页码：' + savedPage);
                const jumped = jumpToPage(savedPage);
                if (jumped) {
                    // 等待页面加载
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    addLog('跳转完成，重新开始扫描');
                    // 重新调用自身，在新页面上扫描
                    scanAndProcessPage();
                    return;
                }
            }
            
            // 扫描外管证
            const certificates = scanCertificates();
            addLog(`当前页面发现 ${certificates.length} 条外管证记录`);
            
            // 一条一条检查外管证，找到一个需要延期的就停止
            for (let i = 0; i < certificates.length; i++) {
                const certificate = certificates[i];
                const needExt = needExtension(certificate.expiryDate);
                
                if (needExt) {
                    const expiryDate = certificate.expiryDate;
                    const currentDate = getCurrentDate();
                    const daysLeft = getDaysDifference(currentDate, parseDate(expiryDate));
                    
                    addLog(`发现需要延期的外管证：${certificate.name} (到期时间：${expiryDate}，剩余 ${daysLeft} 天)`);
                    updateStatus('发现需要延期的外管证');
                    
                    // 检查是否需要手动确认
                    let confirmExtend = true;
                    if (config.manualConfirmation) {
                        // 提示用户
                        confirmExtend = confirm(`发现需要延期的外管证：\n\n名称：${certificate.name}\n到期时间：${expiryDate}\n剩余天数：${daysLeft}天\n\n是否开始延期操作？\n\n注意：处理完成后会点击"继续办理"并重新开始扫描。`);
                    } else {
                        addLog('自动开始处理，跳过手动确认');
                    }
                    
                    if (confirmExtend) {
                        addLog('开始延期操作');
                        updateStatus('处理中');
                        
                        // 保存当前页码，确保延期后能回到当前页面
                        const currentPageBeforeExtension = getCurrentPageNumber();
                        saveCurrentPage(currentPageBeforeExtension);
                        addLog('延期前保存当前页码：' + currentPageBeforeExtension);
                        
                        // 处理这个外管证
                        await processSingleCertificate(certificate);
                        
                        // 处理完成后重新开始扫描
                        addLog('外管证处理完成，准备重新开始扫描任务');
                        // 不再使用 setTimeout，因为页面导航会导致回调不执行
                        // 而是依赖于 checkContinueExecution 函数在页面加载后继续执行
                        addLog('等待页面导航完成后继续执行');
                        // 这里不需要做任何操作，checkContinueExecution 会在页面加载完成后处理
                    } else {
                        addLog('用户取消了延期操作');
                        updateStatus('已取消');
                    }
                    
                    // 找到一个就停止扫描
                    return;
                }
            }
            
            // 没有找到需要延期的外管证
            addLog('当前页面没有需要延期的外管证');
            // 尝试翻页
            if (await tryToNextPage()) {
                addLog('已跳转到下一页，重新扫描');
                // 等待页面加载
                await new Promise(resolve => setTimeout(resolve, 2000));
                // 递归扫描下一页
                if (isRunning) {
                    scanAndProcessPage();
                }
            } else {
                addLog('已到达最后一页');
                // 检查是否需要继续循环执行
                if (isRunning) {
                    addLog('开始新一轮扫描...');
                    // 尝试返回第一页
                    try {
                        // 查找第一页按钮
                        const firstPageButton = document.querySelector('.t-pagination__btn-first') || 
                                             document.querySelector('button:contains("首页")') || 
                                             document.querySelector('button:contains("1")');
                        if (firstPageButton) {
                            addLog('返回第一页');
                            firstPageButton.click();
                            await new Promise(resolve => setTimeout(resolve, 2000));
                            // 重新开始扫描
                            scanAndProcessPage();
                        } else {
                            addLog('未找到第一页按钮，刷新页面重新开始');
                            // 刷新页面
                            location.reload();
                            // 等待页面加载
                            await new Promise(resolve => setTimeout(resolve, 3000));
                            // 重新开始扫描
                            if (isRunning) {
                                scanAndProcessPage();
                            }
                        }
                    } catch (error) {
                        addLog('返回第一页时出错：' + error.message);
                        // 出错时刷新页面
                        location.reload();
                        await new Promise(resolve => setTimeout(resolve, 3000));
                        if (isRunning) {
                            scanAndProcessPage();
                        }
                    }
                } else {
                    addLog('执行已停止');
                    updateStatus('已停止');
                }
            }
            
        } catch (error) {
            console.error('扫描页面时出错：', error);
            addLog('扫描页面时出错：' + error.message);
            updateStatus('错误');
            if (config.showNotification) {
                alert('扫描页面时出错，请检查控制台日志。');
            }
            // 检查是否需要继续执行
            const savedIsRunning = localStorage.getItem('taxCertificateIsRunning') === 'true';
            if (savedIsRunning) {
                addLog('尝试重新扫描...');
                setTimeout(() => {
                    scanAndProcessPage();
                }, 3000);
            }
        }
    }

    /**
     * 尝试翻到下一页
     * @returns {Promise<boolean>} 是否成功翻页
     */
    async function tryToNextPage() {
        try {
            addLog('尝试翻到下一页...');
            
            // 翻页前将每页条数改为50
            autoSelect50Items();
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // 方法1：查找T Design分页控件
            let nextButton = document.querySelector('.t-pagination__btn-next');
            
            addLog('查找T Design下一页按钮:', nextButton ? '找到' : '未找到');
            
            if (!nextButton) {
                // 方法2：查找通用按钮
                const nextPageButtons = document.querySelectorAll('button');
                nextPageButtons.forEach(btn => {
                    const text = btn.textContent.trim();
                    if (text === '下一页' || text === '>') {
                        nextButton = btn;
                    }
                });
            }
            
            addLog('最终找到的下一页按钮:', nextButton ? '找到' : '未找到');
            
            if (nextButton) {
                // 检查按钮是否可用
                const isDisabled = nextButton.disabled || 
                                  nextButton.classList.contains('t-is-disabled') || 
                                  nextButton.classList.contains('t-button--disabled');
                
                addLog('下一页按钮是否可用:', !isDisabled);
                
                if (!isDisabled) {
                    addLog('找到下一页按钮，准备点击');
                    nextButton.click();
                    // 保存当前页码
                    const currentPage = getCurrentPageNumber() + 1;
                    saveCurrentPage(currentPage);
                    return true;
                } else {
                    addLog('下一页按钮不可用，已到达最后一页');
                    // 重置页码为1
                    saveCurrentPage(1);
                    return false;
                }
            } else {
                addLog('未找到下一页按钮');
                return false;
            }
            
        } catch (error) {
            console.error('翻页时出错：', error);
            addLog('翻页时出错：' + error.message);
            return false;
        }
    }

    /**
     * 逐个处理外管证延期
     * @param {Array} certificates - 外管证数组
     * @param {number} index - 当前处理索引
     */
    async function processCertificatesOneByOne(certificates, index) {
        if (index >= certificates.length) {
            addLog('当前页面所有外管证处理完成');
            updateStatus('翻页中');
            // 尝试翻页
            if (await tryToNextPage()) {
                addLog('已跳转到下一页，重新扫描');
                // 等待页面加载
                await new Promise(resolve => setTimeout(resolve, 2000));
                // 重新扫描下一页
                scanAndProcessPage();
            } else {
                addLog('所有页面的外管证处理完成');
                updateStatus('完成');
                if (config.showNotification) {
                    alert('所有外管证延期操作已完成！');
                }
            }
            return;
        }
        
        const certificate = certificates[index];
        addLog(`开始处理第 ${index + 1} 个外管证：${certificate.name}`);
        updateStatus(`处理中 (${index + 1}/${certificates.length})`);
        
        // 确认是否处理当前外管证
        if (confirm(`准备处理第 ${index + 1} 个外管证：\n\n名称：${certificate.name}\n到期时间：${certificate.expiryDate}\n\n是否继续？\n\n注意：处理完成后会自动返回原页面。`)) {
            // 执行延期
            await extendCertificate(certificate);
            
            // 等待办理成功页面加载
            addLog('等待办理成功页面加载...');
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            // 尝试自动返回
            addLog('尝试自动返回原页面...');
            await autoReturnToMainPage();
            
            // 等待页面刷新
            addLog('等待页面刷新...');
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // 继续处理下一个
            addLog(`第 ${index + 1} 个外管证处理完成，准备处理下一个`);
            processCertificatesOneByOne(certificates, index + 1);
        } else {
            // 跳过当前外管证
            addLog(`跳过第 ${index + 1} 个外管证：${certificate.name}`);
            processCertificatesOneByOne(certificates, index + 1);
        }
    }

    /**
     * 处理单个外管证
     * @param {Object} certificate - 外管证对象
     */
    async function processSingleCertificate(certificate) {
        try {
            addLog(`开始处理外管证：${certificate.name}`);
            
            // 点击延期按钮
            addLog('点击延期按钮...');
            certificate.extensionButton.click();
            
            // 等待弹窗出现
            addLog('等待延期弹窗出现...');
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // 选择延期日期
            addLog('选择延期日期...');
            await selectExtensionDate();
            
            // 等待日期选择完成
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // 点击提交按钮
            addLog('点击提交按钮...');
            let submitBtn = null;
            const buttons = document.querySelectorAll('button');
            buttons.forEach(btn => {
                const text = btn.textContent.trim();
                if (text === '提交' || text === '确定' || text === '保存') {
                    submitBtn = btn;
                }
            });
            
            if (submitBtn) {
                submitBtn.click();
                addLog('点击提交按钮成功');
            } else {
                addLog('未找到提交按钮，请手动点击');
                if (config.showNotification) {
                    alert('未找到提交按钮，请手动点击提交按钮完成延期操作。');
                }
            }
            
            // 等待办理成功页面
            addLog('等待办理成功页面加载...');
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            // 查找并点击"继续办理"按钮
            await clickContinueButton();
            
            // 等待返回原页面
            addLog('等待返回原页面...');
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // 检查是否成功返回
            if (window.location.href.includes('kqysssx') || window.location.href.includes('跨区域涉税')) {
                addLog('成功返回原页面');
            } else {
                addLog('返回原页面失败，尝试自动返回');
                await autoReturnToMainPage();
            }
            
            addLog(`外管证 ${certificate.name} 处理完成`);
            
        } catch (error) {
            console.error(`处理外管证时出错：`, error);
            addLog('处理外管证时出错：' + error.message);
            if (config.showNotification) {
                alert(`处理外管证时出错：${error.message}\n\n请手动处理该外管证，然后点击确定继续。`);
            }
        }
    }

    /**
     * 点击"继续办理"按钮
     */
    async function clickContinueButton() {
        try {
            addLog('查找"继续办理"按钮...');
            
            let continueButton = null;
            
            // 方法1：直接查找带有 .t-button__text 类的"继续办理"按钮
            const buttonTexts = document.querySelectorAll('.t-button__text');
            buttonTexts.forEach(textElement => {
                if (textElement.textContent.trim() === '继续办理') {
                    // 获取父级按钮元素
                    let parent = textElement.parentElement;
                    while (parent && parent.tagName !== 'BUTTON') {
                        parent = parent.parentElement;
                    }
                    if (parent) {
                        continueButton = parent;
                        addLog('通过 .t-button__text 找到"继续办理"按钮');
                    }
                }
            });
            
            // 方法2：查找所有按钮，检查文本内容
            if (!continueButton) {
                const buttons = document.querySelectorAll('button');
                buttons.forEach(btn => {
                    const text = btn.textContent.trim();
                    if (text === '继续办理') {
                        continueButton = btn;
                        addLog('通过按钮文本找到"继续办理"按钮');
                    }
                });
            }
            
            // 方法3：查找带有特定属性的"继续办理"按钮
            if (!continueButton) {
                const specificButtons = document.querySelectorAll('button.t-button.t-button--variant-base.t-button--theme-primary');
                specificButtons.forEach(btn => {
                    const textElement = btn.querySelector('.t-button__text');
                    if (textElement && textElement.textContent.trim() === '继续办理') {
                        continueButton = btn;
                        addLog('通过特定属性找到"继续办理"按钮');
                    }
                });
            }
            
            // 方法4：查找包含"继续办理"文本的任何可点击元素
            if (!continueButton) {
                const elements = document.querySelectorAll('*');
                elements.forEach(el => {
                    if (el.textContent.trim() === '继续办理' && 
                        (el.tagName === 'BUTTON' || el.tagName === 'A' || 
                         el.style.cursor === 'pointer' || el.classList.contains('t-button'))) {
                        continueButton = el;
                        addLog('通过通用元素查找找到"继续办理"按钮');
                    }
                });
            }
            
            if (continueButton) {
                addLog('找到"继续办理"按钮，准备点击');
                try {
                    // 确保按钮可见
                    if (continueButton.offsetParent !== null) {
                        // 滚动到按钮位置
                        continueButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        await new Promise(resolve => setTimeout(resolve, 500));
                        
                        // 点击按钮
                        continueButton.click();
                        addLog('点击"继续办理"按钮成功');
                    } else {
                        addLog('"继续办理"按钮不可见，尝试其他方法');
                    }
                } catch (e) {
                    addLog('点击"继续办理"按钮失败：' + e.message);
                    
                    // 尝试使用 dispatchEvent 方法点击
                    try {
                        continueButton.dispatchEvent(new MouseEvent('click', {
                            bubbles: true,
                            cancelable: true,
                            view: window
                        }));
                        addLog('使用 dispatchEvent 方法点击成功');
                    } catch (e2) {
                        addLog('dispatchEvent 方法点击失败：' + e2.message);
                    }
                }
            } else {
                addLog('未找到"继续办理"按钮，尝试其他方法');
                
                // 尝试使用浏览器返回
                try {
                    window.history.back();
                    addLog('尝试使用浏览器返回');
                } catch (e) {
                    addLog('浏览器返回失败：' + e.message);
                }
                
                // 尝试直接导航到外管证管理页面
                try {
                    const mainPageUrl = 'https://etax.hunan.chinatax.gov.cn:8443/xxbg/view/ztxxbg/kqysssxgl';
                    window.location.href = mainPageUrl;
                    addLog('尝试直接导航到外管证管理页面');
                } catch (e) {
                    addLog('直接导航失败：' + e.message);
                }
            }
            
            // 等待操作完成
            await new Promise(resolve => setTimeout(resolve, 3000));
            
        } catch (error) {
            console.error('点击"继续办理"按钮时出错：', error);
            addLog('点击"继续办理"按钮时出错：' + error.message);
        }
    }

    /**
     * 自动返回原页面
     */
    async function autoReturnToMainPage() {
        try {
            addLog('开始自动返回原页面...');
            
            // 方法1：查找返回按钮或链接
            let returnElement = null;
            
            // 查找返回按钮
            const buttons = document.querySelectorAll('button');
            buttons.forEach(btn => {
                const text = btn.textContent.trim();
                if (text === '返回' || text === '确定' || text === '关闭') {
                    returnElement = btn;
                    addLog('找到返回按钮：' + text);
                }
            });
            
            // 查找跨区域涉税事项报告链接
            if (!returnElement) {
                const links = document.querySelectorAll('a');
                links.forEach(link => {
                    const text = link.textContent.trim();
                    if (text.includes('跨区域涉税事项报告') || text.includes('返回')) {
                        returnElement = link;
                        addLog('找到跨区域涉税事项报告链接：' + text);
                    }
                });
            }
            
            // 查找breadcrumb导航中的返回
            if (!returnElement) {
                const breadcrumbLinks = document.querySelectorAll('.t-breadcrumb__inner-text');
                breadcrumbLinks.forEach(link => {
                    const text = link.textContent.trim();
                    if (text.includes('跨区域涉税事项报告') || text.includes('返回')) {
                        returnElement = link;
                        addLog('找到breadcrumb中的返回链接：' + text);
                    }
                });
            }
            
            // 查找所有包含"跨区域涉税"的元素
            if (!returnElement) {
                const allElements = document.querySelectorAll('*');
                allElements.forEach(el => {
                    const text = el.textContent.trim();
                    if (text.includes('跨区域涉税事项报告') && 
                        (el.tagName === 'A' || el.tagName === 'BUTTON' || el.style.cursor === 'pointer')) {
                        returnElement = el;
                        addLog('找到包含"跨区域涉税事项报告"的元素：' + text);
                    }
                });
            }
            
            if (returnElement) {
                addLog('找到返回元素，准备点击');
                try {
                    // 确保元素可见
                    if (returnElement.offsetParent !== null) {
                        // 滚动到元素位置
                        returnElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        await new Promise(resolve => setTimeout(resolve, 500));
                        
                        // 点击元素
                        returnElement.click();
                        addLog('点击返回元素成功');
                    } else {
                        addLog('返回元素不可见，尝试其他方法');
                    }
                } catch (e) {
                    addLog('点击返回元素失败：' + e.message);
                    
                    // 尝试使用 dispatchEvent 方法点击
                    try {
                        returnElement.dispatchEvent(new MouseEvent('click', {
                            bubbles: true,
                            cancelable: true,
                            view: window
                        }));
                        addLog('使用 dispatchEvent 方法点击返回元素成功');
                    } catch (e2) {
                        addLog('dispatchEvent 方法点击返回元素失败：' + e2.message);
                    }
                }
            } else {
                addLog('未找到返回元素，尝试其他方法');
                
                // 方法2：使用浏览器返回
                try {
                    window.history.back();
                    addLog('尝试使用浏览器返回');
                } catch (e) {
                    addLog('浏览器返回失败：' + e.message);
                }
                
                // 方法3：直接导航到外管证管理页面
                try {
                    const mainPageUrl = 'https://etax.hunan.chinatax.gov.cn:8443/xxbg/view/ztxxbg/kqysssxgl';
                    window.location.href = mainPageUrl;
                    addLog('尝试直接导航到外管证管理页面');
                } catch (e) {
                    addLog('直接导航失败：' + e.message);
                }
            }
            
            // 等待返回完成
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            // 检查是否成功返回
            if (window.location.href.includes('kqysssx') || window.location.href.includes('跨区域涉税')) {
                addLog('成功返回原页面');
            } else {
                addLog('返回原页面失败，提示用户手动操作');
                if (config.showNotification) {
                    alert('自动返回失败，请手动点击"跨区域涉税事项报告"返回原页面，然后点击确定继续。');
                }
                
                // 等待用户手动操作
                await new Promise(resolve => {
                    const checkReturn = setInterval(() => {
                        if (window.location.href.includes('kqysssx') || window.location.href.includes('跨区域涉税')) {
                            clearInterval(checkReturn);
                            resolve();
                        }
                    }, 2000);
                    setTimeout(() => {
                        clearInterval(checkReturn);
                        resolve();
                    }, 30000); // 30秒超时
                });
            }
            
        } catch (error) {
            console.error('自动返回时出错：', error);
            addLog('自动返回时出错：' + error.message);
            
            // 提示用户手动返回
            if (config.showNotification) {
                alert('自动返回失败，请手动点击"跨区域涉税事项报告"返回原页面，然后点击确定继续。');
            }
        }
    }

    /**
     * 创建完整的UI界面
     */
    function createUI() {
        try {
            // 检查是否已经存在UI
            if (document.getElementById('tax-cert-ui-container')) {
                return;
            }
            
            // 创建主容器
            const mainContainer = document.createElement('div');
            mainContainer.id = 'tax-cert-ui-container';
            mainContainer.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                width: 400px;
                background: white;
                border: 2px solid #4CAF50;
                border-radius: 8px;
                padding: 20px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 9999;
                font-family: Arial, sans-serif;
            `;
            
            // 标题
            const title = document.createElement('h3');
            title.textContent = '外管证自动延期工具';
            title.style.cssText = 'margin-top: 0; color: #4CAF50; border-bottom: 1px solid #e0e0e0; padding-bottom: 10px;';
            mainContainer.appendChild(title);
            
            // 日期设置区域
            const dateSection = document.createElement('div');
            dateSection.style.cssText = 'margin: 15px 0;';
            dateSection.innerHTML = `
                <h4 style="color: #333; margin-bottom: 10px;">延期日期设置</h4>
                <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 10px;">
                    <div>
                        <label style="display: block; margin-bottom: 5px; font-size: 12px; color: #666;">年份</label>
                        <input type="number" id="extension-year" value="${config.extensionYear}" style="width: 80px; padding: 5px; border: 1px solid #ddd; border-radius: 3px;">
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: 5px; font-size: 12px; color: #666;">月份</label>
                        <input type="number" id="extension-month" value="${config.extensionMonth}" min="1" max="12" style="width: 60px; padding: 5px; border: 1px solid #ddd; border-radius: 3px;">
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: 5px; font-size: 12px; color: #666;">日期</label>
                        <input type="number" id="extension-day" value="${config.extensionDay}" min="1" max="31" style="width: 60px; padding: 5px; border: 1px solid #ddd; border-radius: 3px;">
                    </div>
                </div>
                <div style="display: flex; gap: 10px; margin-top: 10px;">
                    <button id="set-current-year-end" style="
                        padding: 5px 10px;
                        background-color: #2196F3;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 12px;
                    ">当年年底</button>
                    <button id="set-next-year-end" style="
                        padding: 5px 10px;
                        background-color: #2196F3;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 12px;
                    ">次年年底</button>
                </div>
            `;
            mainContainer.appendChild(dateSection);
            
            // 执行设置区域
            const executionSection = document.createElement('div');
            executionSection.style.cssText = 'margin: 15px 0;';
            executionSection.innerHTML = `
                <h4 style="color: #333; margin-bottom: 10px;">执行设置</h4>
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                    <input type="checkbox" id="manual-confirmation" ${config.manualConfirmation ? 'checked' : ''} style="width: 16px; height: 16px;">
                    <label for="manual-confirmation" style="font-size: 13px; color: #333;">需要手动确认</label>
                </div>
                <div style="margin-bottom: 10px;">
                    <label style="display: block; margin-bottom: 5px; font-size: 13px; color: #333;">到期设置</label>
                    <select id="expiry-setting" style="padding: 5px; border: 1px solid #ddd; border-radius: 3px; width: 150px;">
                        <option value="expired" ${config.expirySetting === 'expired' ? 'selected' : ''}>已过期</option>
                        <option value="10" ${config.expirySetting === '10' ? 'selected' : ''}>10日内到期</option>
                        <option value="30" ${config.expirySetting === '30' ? 'selected' : ''}>30日内到期</option>
                        <option value="180" ${config.expirySetting === '180' ? 'selected' : ''}>180日内到期</option>
                    </select>
                </div>
            `;
            mainContainer.appendChild(executionSection);
            
            // 控制按钮区域
            const controlSection = document.createElement('div');
            controlSection.style.cssText = 'margin: 15px 0;';
            controlSection.innerHTML = `
                <button id="start-execution" style="
                    padding: 10px 20px;
                    background-color: #4CAF50;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: bold;
                    margin-right: 10px;
                ">开始执行</button>
                <button id="stop-execution" style="
                    padding: 10px 20px;
                    background-color: #f44336;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 14px;
                ">停止执行</button>
            `;
            mainContainer.appendChild(controlSection);
            
            // 日志展示区域
            const logSection = document.createElement('div');
            logSection.style.cssText = 'margin: 15px 0;';
            logSection.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <h4 style="color: #333; margin: 0;">操作日志</h4>
                    <button id="clear-log" style="
                        padding: 5px 10px;
                        background-color: #f5f5f5;
                        color: #333;
                        border: 1px solid #ddd;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 12px;
                    ">清空日志</button>
                </div>
                <div id="execution-log" style="
                    width: 100%;
                    height: 200px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    padding: 10px;
                    overflow-y: auto;
                    font-family: monospace;
                    font-size: 12px;
                    background: #f5f5f5;
                "></div>
            `;
            mainContainer.appendChild(logSection);
            
            // 状态信息
            const statusSection = document.createElement('div');
            statusSection.id = 'execution-status';
            statusSection.style.cssText = 'margin: 15px 0; padding: 10px; background: #e3f2fd; border-radius: 4px; font-size: 12px;';
            statusSection.innerHTML = '<strong>状态：</strong>就绪';
            mainContainer.appendChild(statusSection);
            
            // 添加到页面
            document.body.appendChild(mainContainer);
            
            // 添加事件监听器
            document.getElementById('start-execution').addEventListener('click', startExecution);
            document.getElementById('stop-execution').addEventListener('click', stopExecution);
            
            // 保存日期设置
            document.getElementById('extension-year').addEventListener('change', saveDateSettings);
            document.getElementById('extension-month').addEventListener('change', saveDateSettings);
            document.getElementById('extension-day').addEventListener('change', saveDateSettings);
            
            // 保存手动确认设置
            document.getElementById('manual-confirmation').addEventListener('change', function() {
                config.manualConfirmation = this.checked;
                // 保存到本地存储
                localStorage.setItem('taxCertificateManualConfirmation', config.manualConfirmation.toString());
                addLog('手动确认设置已更新：' + (config.manualConfirmation ? '开启' : '关闭'));
            });
            
            // 保存到期设置
            document.getElementById('expiry-setting').addEventListener('change', function() {
                config.expirySetting = this.value;
                // 保存到本地存储
                localStorage.setItem('taxCertificateExpirySetting', config.expirySetting);
                addLog('到期设置已更新：' + this.options[this.selectedIndex].text);
            });
            
            // 当年年底按钮点击事件
            document.getElementById('set-current-year-end').addEventListener('click', function() {
                const currentYear = new Date().getFullYear();
                document.getElementById('extension-year').value = currentYear;
                document.getElementById('extension-month').value = 12;
                document.getElementById('extension-day').value = 31;
                // 保存设置
                saveDateSettings();
                addLog('已设置延期日期为：' + currentYear + '-12-31');
            });
            
            // 次年年底按钮点击事件
            document.getElementById('set-next-year-end').addEventListener('click', function() {
                const nextYear = new Date().getFullYear() + 1;
                document.getElementById('extension-year').value = nextYear;
                document.getElementById('extension-month').value = 12;
                document.getElementById('extension-day').value = 31;
                // 保存设置
                saveDateSettings();
                addLog('已设置延期日期为：' + nextYear + '-12-31');
            });
            
            // 清空日志按钮事件监听器
            document.getElementById('clear-log').addEventListener('click', function() {
                const logElement = document.getElementById('execution-log');
                if (logElement) {
                    logElement.textContent = '';
                    addLog('日志已清空');
                    // 清空本地存储中的日志
                    localStorage.removeItem('taxCertificateLog');
                }
            });
            
            console.log('UI界面已创建完成');
        } catch (error) {
            console.error('创建UI界面时出错：', error);
        }
    }

    /**
     * 保存日期设置
     */
    function saveDateSettings() {
        try {
            config.extensionYear = parseInt(document.getElementById('extension-year').value) || 2026;
            config.extensionMonth = parseInt(document.getElementById('extension-month').value) || 12;
            config.extensionDay = parseInt(document.getElementById('extension-day').value) || 31;
            
            // 保存到本地存储
            localStorage.setItem('taxCertificateExtensionYear', config.extensionYear.toString());
            localStorage.setItem('taxCertificateExtensionMonth', config.extensionMonth.toString());
            localStorage.setItem('taxCertificateExtensionDay', config.extensionDay.toString());
            
            addLog('日期设置已更新：' + `${config.extensionYear}-${String(config.extensionMonth).padStart(2, '0')}-${String(config.extensionDay).padStart(2, '0')}`);
        } catch (error) {
            console.error('保存日期设置时出错：', error);
        }
    }

    /**
     * 保存当前页码到本地存储
     * @param {number} pageNumber - 当前页码
     */
    function saveCurrentPage(pageNumber) {
        localStorage.setItem('taxCertificateCurrentPage', pageNumber.toString());
        addLog('当前页码已保存：' + pageNumber);
    }

    /**
     * 获取保存的当前页码
     * @returns {number} 保存的页码，默认1
     */
    function getSavedCurrentPage() {
        return parseInt(localStorage.getItem('taxCertificateCurrentPage')) || 1;
    }

    /**
     * 获取当前页码
     * @returns {number} 当前页码，默认1
     */
    function getCurrentPageNumber() {
        try {
            // 方法1：查找T Design分页控件中的当前页码（适配提供的翻页元素结构）
            const currentPageElement = document.querySelector('.t-pagination__number.t-is-current') || 
                                      document.querySelector('.t-pagination__btn-current') || 
                                      document.querySelector('.t-pagination__item.t-is-active');
            if (currentPageElement) {
                const pageText = currentPageElement.textContent.trim();
                const pageNumber = parseInt(pageText);
                if (!isNaN(pageNumber)) {
                    return pageNumber;
                }
            }
            
            // 方法2：查找页码输入框
            const pageInput = document.querySelector('input.t-pagination__editor');
            if (pageInput) {
                const pageNumber = parseInt(pageInput.value);
                if (!isNaN(pageNumber)) {
                    return pageNumber;
                }
            }
            
            // 方法3：从URL参数中获取
            const urlParams = new URLSearchParams(window.location.search);
            const pageParam = urlParams.get('page') || urlParams.get('current') || urlParams.get('p');
            if (pageParam) {
                const pageNumber = parseInt(pageParam);
                if (!isNaN(pageNumber)) {
                    return pageNumber;
                }
            }
            
        } catch (error) {
            console.error('获取当前页码时出错：', error);
        }
        return 1;
    }

    /**
     * 跳转到指定页码
     * @param {number} pageNumber - 目标页码
     * @returns {boolean} 是否成功跳转
     */
    function jumpToPage(pageNumber) {
        try {
            // 检查当前页码是否已经是目标页码，如果是则不执行跳转
            const currentPage = getCurrentPageNumber();
            if (currentPage === pageNumber) {
                addLog('当前页码已经是目标页码：' + pageNumber + '，无需跳转');
                return false;
            }
            
            addLog('尝试跳转到页码：' + pageNumber);
            
            // 方法1：使用用户提供的特定输入框结构进行跳转（优先使用）
            const paginationJumpContainer = document.querySelector('.t-pagination__jump');
            if (paginationJumpContainer) {
                const pageInput = paginationJumpContainer.querySelector('.t-input__inner');
                if (pageInput) {
                    addLog('找到指定的页码输入框：' + pageInput);
                    pageInput.value = pageNumber;
                    
                    // 触发change事件
                    pageInput.dispatchEvent(new Event('change', { bubbles: true }));
                    
                    // 触发键盘事件模拟回车
                    try {
                        pageInput.dispatchEvent(new KeyboardEvent('keydown', {
                            key: 'Enter',
                            bubbles: true,
                            cancelable: true
                        }));
                        addLog('模拟回车事件成功');
                    } catch (e) {
                        addLog('触发Enter事件失败：' + e.message);
                    }
                    
                    addLog('通过指定输入框跳转到页码：' + pageNumber);
                    return true;
                }
            }
            
            // 方法2：查找页码输入框
            const pageInput = document.querySelector('input.t-pagination__editor');
            if (pageInput) {
                pageInput.value = pageNumber;
                pageInput.dispatchEvent(new Event('change', { bubbles: true }));
                pageInput.dispatchEvent(new KeyboardEvent('keydown', {
                    key: 'Enter',
                    bubbles: true
                }));
                addLog('通过页码输入框跳转到页码：' + pageNumber);
                return true;
            }
            
            // 方法3：查找页码按钮（适配提供的翻页元素结构）
            const pageButtons = document.querySelectorAll('.t-pagination__number');
            for (const button of pageButtons) {
                const text = button.textContent.trim();
                const buttonPage = parseInt(text);
                if (!isNaN(buttonPage) && buttonPage === pageNumber) {
                    button.click();
                    addLog('通过页码按钮跳转到页码：' + pageNumber);
                    return true;
                }
            }
            
            // 方法4：查找通用页码输入或选择器
            const allInputs = document.querySelectorAll('input');
            for (const input of allInputs) {
                if (input.type === 'number' && 
                    (input.name.includes('page') || input.id.includes('page') || input.placeholder.includes('页码'))) {
                    input.value = pageNumber;
                    input.dispatchEvent(new Event('change', { bubbles: true }));
                    addLog('通过通用页码输入跳转到页码：' + pageNumber);
                    return true;
                }
            }
            
            // 方法5：尝试通过省略号按钮跳转（如果目标页码不在当前显示范围内）
            const moreButtons = document.querySelectorAll('.t-pagination__number--more');
            if (moreButtons.length > 0) {
                // 尝试点击省略号按钮，可能会显示更多页码
                moreButtons[0].click();
                addLog('点击省略号按钮显示更多页码');
                // 等待页面更新
                setTimeout(() => {
                    // 再次尝试查找并点击目标页码
                    const newPageButtons = document.querySelectorAll('.t-pagination__number');
                    for (const button of newPageButtons) {
                        const text = button.textContent.trim();
                        const buttonPage = parseInt(text);
                        if (!isNaN(buttonPage) && buttonPage === pageNumber) {
                            button.click();
                            addLog('通过页码按钮跳转到页码：' + pageNumber);
                            return true;
                        }
                    }
                }, 500);
            }
            
            addLog('未找到跳转页码的方法');
            return false;
        } catch (error) {
            console.error('跳转到页码时出错：', error);
            addLog('跳转到页码时出错：' + error.message);
            return false;
        }
    }

    /**
     * 添加日志到UI
     * @param {string} message - 日志消息
     */
    function addLog(message) {
        try {
            const timestamp = new Date().toLocaleTimeString();
            const logEntry = `[${timestamp}] ${message}\n`;
            
            // 添加到UI
            const logElement = document.getElementById('execution-log');
            if (logElement) {
                logElement.textContent += logEntry;
                logElement.scrollTop = logElement.scrollHeight;
            }
            
            // 保存到本地存储，实现长效保存
            let savedLog = localStorage.getItem('taxCertificateLog') || '';
            savedLog += logEntry;
            // 限制日志大小，只保留最近的1000行左右
            const logLines = savedLog.split('\n');
            if (logLines.length > 1000) {
                savedLog = logLines.slice(-1000).join('\n');
            }
            localStorage.setItem('taxCertificateLog', savedLog);
            
            console.log(message);
        } catch (error) {
            console.error('添加日志时出错：', error);
        }
    }

    /**
     * 更新执行状态
     * @param {string} status - 状态消息
     */
    function updateStatus(status) {
        try {
            const statusElement = document.getElementById('execution-status');
            if (statusElement) {
                statusElement.innerHTML = `<strong>状态：</strong>${status}`;
            }
        } catch (error) {
            console.error('更新状态时出错：', error);
        }
    }

    /**
     * 检测并关闭温馨提示弹窗
     */
    function closeWarmPrompt() {
        try {
            addLog('检测是否存在温馨提示弹窗...');
            
            // 查找温馨提示弹窗
            const warmPrompt = document.querySelector('.t-dialog.t-dialog--default.t-dialog__modal-info');
            if (warmPrompt) {
                addLog('发现温馨提示弹窗，准备关闭...');
                
                // 尝试点击关闭按钮
                const closeButton = warmPrompt.querySelector('.t-dialog__close');
                if (closeButton) {
                    addLog('点击关闭按钮...');
                    closeButton.click();
                    addLog('关闭按钮点击成功');
                    return true;
                }
                
                // 尝试点击确认按钮
                const confirmButton = warmPrompt.querySelector('.t-dialog__confirm');
                if (confirmButton) {
                    addLog('点击确认按钮...');
                    confirmButton.click();
                    addLog('确认按钮点击成功');
                    return true;
                }
                
                addLog('未找到关闭或确认按钮');
            } else {
                addLog('未发现温馨提示弹窗');
            }
        } catch (error) {
            console.error('关闭温馨提示弹窗时出错：', error);
            addLog('关闭温馨提示弹窗时出错：' + error.message);
        }
        return false;
    }

    /**
     * 自动选择50条/页
     */
    function autoSelect50Items() {
        try {
            addLog('尝试自动选择50条/页...');
            
            // 方法1：查找T Design选择器组件（更准确的选择器）
            const tSelectContainers = document.querySelectorAll('.t-input.t-is-readonly');
            for (const tSelectContainer of tSelectContainers) {
                addLog('找到T Design选择器组件');
                
                // 检查是否已经选择了50条/页
                const inputElement = tSelectContainer.querySelector('input');
                if (inputElement && inputElement.value.includes('50')) {
                    addLog('已经选择了50条/页，无需修改');
                    return true;
                }
                
                // 点击选择器打开下拉列表
                if (inputElement) {
                    addLog('点击选择器打开下拉列表');
                    inputElement.click();
                    
                    // 添加短暂等待，确保下拉列表完全显示
                    setTimeout(() => {
                        // 查找所有可能的选项元素
                        const optionElements = document.querySelectorAll('.t-select-option, .t-dropdown-menu__item');
                        addLog('找到选项元素数量：' + optionElements.length);
                        
                        // 查找50条/页选项
                        const option50 = Array.from(optionElements).find(option => {
                            const text = option.textContent || option.title || '';
                            return text.includes('50') && (text.includes('条') || text.includes('每页') || text.includes('per page'));
                        });
                        
                        if (option50) {
                            addLog('找到50条/页选项：' + option50.textContent);
                            option50.click();
                            addLog('已选择50条/页');
                        } else {
                            addLog('未找到50条/页选项，尝试其他方法');
                        }
                    }, 500);
                    
                    return true; // 标记尝试完成
                }
            }
            
            // 方法2：查找每页显示条数的选择器
            const pageSizeSelectors = [
                'select[class*="page"], select[class*="size"], select[class*="rows"]',
                '.t-select select',
                'select'
            ];
            
            let pageSizeSelect = null;
            
            // 尝试不同的选择器
            for (const selector of pageSizeSelectors) {
                const elements = document.querySelectorAll(selector);
                for (const el of elements) {
                    // 检查是否包含页码选项
                    const options = el.querySelectorAll('option');
                    for (const option of options) {
                        if (option.value === '50' || option.textContent === '50' || 
                            option.value === '50条' || option.textContent === '50条') {
                            pageSizeSelect = el;
                            break;
                        }
                    }
                    if (pageSizeSelect) break;
                }
                if (pageSizeSelect) break;
            }
            
            if (pageSizeSelect) {
                addLog('找到每页显示条数选择器');
                
                // 选择50条
                const options = pageSizeSelect.querySelectorAll('option');
                for (const option of options) {
                    if (option.value === '50' || option.textContent === '50' || 
                        option.value === '50条' || option.textContent === '50条') {
                        option.selected = true;
                        addLog('已选择50条/页');
                        
                        // 触发change事件
                        try {
                            pageSizeSelect.dispatchEvent(new Event('change', { bubbles: true }));
                            addLog('触发change事件成功');
                        } catch (e) {
                            addLog('触发change事件失败：' + e.message);
                        }
                        return true;
                    }
                }
                
                addLog('未找到50条选项');
            } else {
                addLog('未找到每页显示条数选择器');
            }
            
            // 方法3：查找所有可能的选择器组件
            const allSelectElements = document.querySelectorAll('select, .t-select, .t-dropdown');
            for (const selectEl of allSelectElements) {
                addLog('检查选择器元素：' + selectEl.className);
                
                // 尝试点击打开
                try {
                    selectEl.click();
                    
                    // 等待下拉列表
                    setTimeout(() => {
                        // 查找50选项
                        const option50 = document.querySelector('[data-value="50"]') || 
                                        document.querySelector('[value="50"]');
                        if (option50) {
                            option50.click();
                            addLog('通过备选方法选择了50条/页');
                        }
                    }, 500);
                } catch (e) {
                    addLog('点击选择器失败：' + e.message);
                }
            }
            
        } catch (error) {
            console.error('自动选择50条/页时出错：', error);
            addLog('自动选择50条/页时出错：' + error.message);
        }
        return false;
    }

    /**
     * 开始执行
     */
    function startExecution() {
        try {
            addLog('开始执行外管证延期操作...');
            updateStatus('执行中');
            
            // 设置执行状态为运行中并保存
            saveExecutionStatus(true);
            
            // 检测并关闭温馨提示弹窗
            closeWarmPrompt();
            // 自动选择50条/页
            autoSelect50Items();
            // 等待操作完成
            setTimeout(async () => {
                // 保存日期设置
                saveDateSettings();
                
                // 开始扫描和处理
                await scanAndProcessPage();
            }, 1000);
        } catch (error) {
            console.error('开始执行时出错：', error);
            addLog('开始执行时出错：' + error.message);
            // 出错时设置为停止状态并保存
            saveExecutionStatus(false);
            updateStatus('已停止');
        }
    }

    /**
     * 停止执行
     */
    function stopExecution() {
        try {
            addLog('停止执行外管证延期操作');
            updateStatus('已停止');
            
            // 设置执行状态为停止并保存
            saveExecutionStatus(false);
        } catch (error) {
            console.error('停止执行时出错：', error);
        }
    }

    // 初始化脚本
    function init() {
        // 创建UI界面
        createUI();
        
        // 延迟加载日志，确保DOM完全准备好
        setTimeout(() => {
            // 从本地存储中加载保存的日志
            const savedLog = localStorage.getItem('taxCertificateLog');
            if (savedLog) {
                const logElement = document.getElementById('execution-log');
                if (logElement) {
                    logElement.textContent = savedLog;
                    logElement.scrollTop = logElement.scrollHeight;
                    addLog('已加载保存的日志');
                }
            }
        }, 500);
        
        // 延迟执行页面大小检测，确保页面完全加载
        setTimeout(() => {
            checkPageRefresh();
        }, 1500);
        
        // 如果设置为自动执行，则直接执行
        if (config.autoExecute) {
            startExecution();
        }
    }
    
    /**
     * 检查页面是否被刷新
     */
    function checkPageRefresh() {
        try {
            // 获取当前页面大小
            const currentPageSize = document.body.scrollHeight;
            addLog('当前页面大小：' + currentPageSize + '，上一次页面大小：' + lastPageSize);
            
            // 检查是否有保存的页码
            const savedPage = getSavedCurrentPage();
            
            // 如果当前页面比上一次小，说明页面被刷新了，并且有保存的页码，则跳转到该页码
            if (currentPageSize < lastPageSize && savedPage > 1) {
                addLog('检测到页面刷新，准备跳转到保存的页码：' + savedPage);
                jumpToPage(savedPage);
            } else if (savedPage > 1) {
                // 如果没有刷新，但有保存的页码，也跳转到该页码
                addLog('发现保存的页码：' + savedPage + '，准备跳转');
                jumpToPage(savedPage);
            }
            
            // 保存当前页面大小
            lastPageSize = currentPageSize;
            localStorage.setItem('taxCertificateLastPageSize', lastPageSize.toString());
            addLog('已保存当前页面大小：' + lastPageSize);
        } catch (error) {
            console.error('检查页面刷新时出错：', error);
            addLog('检查页面刷新时出错：' + error.message);
        }
    }

    // 检查是否需要继续执行
    function checkContinueExecution() {
        // 从 localStorage 恢复状态
        const savedIsRunning = localStorage.getItem('taxCertificateIsRunning') === 'true';
        if (savedIsRunning) {
            // 更新当前状态
            isRunning = true;
            // 检查是否在正确的页面
            const currentUrl = window.location.href;
            const isCorrectPage = currentUrl.includes('kqysssx') || 
                                currentUrl.includes('kqysssxgl') ||
                                currentUrl.includes('跨区域涉税');
            
            if (isCorrectPage) {
                addLog('页面加载完成，继续执行扫描任务');
                // 延迟一点时间确保页面完全加载
                setTimeout(() => {
                    // 检查页面是否被刷新
                    checkPageRefresh();
                    
                    // 延迟执行，确保页面跳转完成
                    setTimeout(() => {
                        // 选择50条/页
                        autoSelect50Items();
                        // 开始扫描
                        scanAndProcessPage();
                    }, 2000);
                }, 1000);
            }
        }
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 监听页面加载完成事件，确保在页面导航后继续执行
    window.addEventListener('load', checkContinueExecution);

    // 监听页面状态变化，确保在SPA应用中继续执行
    if (window.history.pushState) {
        const originalPushState = window.history.pushState;
        window.history.pushState = function() {
            originalPushState.apply(this, arguments);
            checkContinueExecution();
        };
    }

    // 监听popstate事件，确保在浏览器后退时继续执行
    window.addEventListener('popstate', checkContinueExecution);

})();