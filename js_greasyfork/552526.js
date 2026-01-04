// ==UserScript==
// @name         设备在线状态统计 - 增强版
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  北斗位置综合服务管理平台 - 项目在线率统计工具，支持搜索、排序、导出功能
// @author       rubysiu
// @match        http://39.103.174.164:8083/*
// @match        https://39.103.174.164:8083/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @icon         data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiByeD0iNCIgZmlsbD0iIzY2N2VlYSIvPgo8cGF0aCBkPSJNOCAxMkgxNlYyMEg4VjEyWiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTE2IDEySDI0VjIwSDE2VjEyWiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTggMjBIMTZWMjhIOFYyMFoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0xNiAyMEgyNFYyOEgxNlYyMFoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=
// @supportURL   https://github.com/rubysiu/device-monitor-stats/issues
// @downloadURL https://update.greasyfork.org/scripts/552526/%E8%AE%BE%E5%A4%87%E5%9C%A8%E7%BA%BF%E7%8A%B6%E6%80%81%E7%BB%9F%E8%AE%A1%20-%20%E5%A2%9E%E5%BC%BA%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/552526/%E8%AE%BE%E5%A4%87%E5%9C%A8%E7%BA%BF%E7%8A%B6%E6%80%81%E7%BB%9F%E8%AE%A1%20-%20%E5%A2%9E%E5%BC%BA%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ====== 1. 等待页面加载完成 ======
    function waitForElement(selector, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const element = document.querySelector(selector);
            if (element) {
                resolve(element);
                return;
            }

            const observer = new MutationObserver((mutations, obs) => {
                const element = document.querySelector(selector);
                if (element) {
                    obs.disconnect();
                    resolve(element);
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            setTimeout(() => {
                observer.disconnect();
                reject(new Error(`Element ${selector} not found within ${timeout}ms`));
            }, timeout);
        });
    }

    // ====== 2. 创建手动触发按钮 ======
    function createTriggerButton() {
        const triggerBtn = document.createElement('button');
        triggerBtn.id = 'device-stats-trigger';
        triggerBtn.innerHTML = '📊 设备统计';
        triggerBtn.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            z-index: 10000;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 25px;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
            font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif;
        `;

        triggerBtn.addEventListener('mouseenter', () => {
            triggerBtn.style.transform = 'scale(1.05)';
            triggerBtn.style.boxShadow = '0 6px 20px rgba(0,0,0,0.4)';
        });

        triggerBtn.addEventListener('mouseleave', () => {
            triggerBtn.style.transform = 'scale(1)';
            triggerBtn.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
        });

        document.body.appendChild(triggerBtn);
        return triggerBtn;
    }

    // ====== 3. 查找根节点及其直接子项目 ======
    async function findProjectData() {
        try {
            const rootLi = await waitForElement('#monitorvhcztree_1', 15000);
            console.log('✅ 找到根节点 monitorvhcztree_1');
            return rootLi;
        } catch (error) {
            console.warn('❌ 未找到根节点 monitorvhcztree_1:', error.message);
            return null;
        }
    }

    // ====== 4. 解析项目数据 ======
    function parseProjectData(rootLi) {
        if (!rootLi) {
            console.warn('❌ 根节点为空，无法解析项目数据');
            return {};
        }

        // 获取根节点下的所有直接 <li> 子节点 (即 level1 的项目)
        const projectElements = Array.from(rootLi.querySelectorAll(':scope > ul > li'));
        
        if (projectElements.length === 0) {
            console.warn('❌ 未找到任何一级子项目');
            return {};
        }

        console.log(`✅ 找到 ${projectElements.length} 个项目`);

        const projectStats = {};

        projectElements.forEach(projectLi => {
            // 获取项目名称 (如 "三鼎[4/15]")
            const nameSpan = projectLi.querySelector('.node_name');
            const projectNameFull = nameSpan ? nameSpan.textContent.trim() : '未知项目';
            
            // 提取项目名称（去掉后面的 [数字/数字]）
            const projectNameMatch = projectNameFull.match(/^([^[]+)/);
            const projectName = projectNameMatch ? projectNameMatch[1].trim() : projectNameFull;

            // 提取括号内的数字：[在线数/总数]
            const countMatch = projectNameFull.match(/\[(\d+)\/(\d+)\]/);
            const onlineCountInName = countMatch ? parseInt(countMatch[1]) : 0;
            const totalCountInName = countMatch ? parseInt(countMatch[2]) : 0;

            // ✅ 使用括号内的数字作为统计依据（更准确）
            const totalCount = totalCountInName;
            const onlineCount = onlineCountInName;
            const offlineCount = totalCount - onlineCount;
            const onlineRate = totalCount > 0 ? ((onlineCount / totalCount) * 100).toFixed(2) : 0;

            projectStats[projectName] = {
                name: projectName,
                total: totalCount,
                online: onlineCount,
                offline: offlineCount,
                rate: parseFloat(onlineRate)
            };
        });

        return projectStats;
    }

    // ====== 5. 创建增强显示面板 ======
    function createStatsPanel(projectStats) {
        const panelId = 'project-stats-panel-enhanced';
        const existingPanel = document.getElementById(panelId);
        if (existingPanel) existingPanel.remove();

        const panel = document.createElement('div');
        panel.id = panelId;
        panel.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 450px;
            max-height: 85vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 20px;
            box-shadow: 0 25px 60px rgba(0,0,0,0.6);
            padding: 25px;
            font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif;
            z-index: 9999;
            border: 2px solid rgba(255,255,255,0.2);
            backdrop-filter: blur(15px);
            overflow: hidden;
            transform: scale(1);
            transition: all 0.4s cubic-bezier(0.2, 0, 0, 1);
        `;

        // 构建面板内容
        let panelHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 2px solid rgba(255,255,255,0.2);">
                <h3 style="margin: 0; font-weight: 700; font-size: 1.4em; color: #fff;">
                    📊 项目在线率统计
                </h3>
                <div style="display: flex; gap: 8px;">
                    <button id="refresh-btn" style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 12px; transition: all 0.2s;">
                        🔄 刷新
                    </button>
                    <button id="close-btn" style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 12px; transition: all 0.2s;">
                        ✕ 关闭
                    </button>
                </div>
            </div>
            
            <div style="text-align: center; margin: 15px 0; font-size: 0.9em; opacity: 0.9;">
                共 <strong>${Object.keys(projectStats).length}</strong> 个项目 | 数据来自页面标签
            </div>

            <!-- 搜索和排序控制 -->
            <div style="margin-bottom: 20px;">
                <div style="position: relative; margin-bottom: 12px;">
                    <input type="text" id="project-search" placeholder="🔍 搜索项目名称..." 
                           style="width: 100%; padding: 12px 16px; border: none; border-radius: 10px; 
                                  background: rgba(255,255,255,0.15); color: white; font-size: 14px;
                                  outline: none; box-sizing: border-box; backdrop-filter: blur(5px);
                                  transition: all 0.3s ease;">
                    <div id="search-clear" style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); 
                                                cursor: pointer; opacity: 0.7; font-size: 16px; display: none;">
                        ✕
                    </div>
                </div>
                
                <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                    <select id="sort-select" style="flex: 1; padding: 8px 12px; border: none; border-radius: 8px; 
                                                   background: rgba(255,255,255,0.15); color: white; font-size: 12px; 
                                                   outline: none; min-width: 120px;">
                        <option value="rate-desc">在线率 ↓</option>
                        <option value="rate-asc">在线率 ↑</option>
                        <option value="name-asc">名称 A-Z</option>
                        <option value="name-desc">名称 Z-A</option>
                        <option value="total-desc">总数 ↓</option>
                        <option value="total-asc">总数 ↑</option>
                    </select>
                    
                    <button id="export-btn" style="padding: 8px 12px; border: none; border-radius: 8px; 
                                                  background: rgba(255,255,255,0.15); color: white; font-size: 12px; 
                                                  cursor: pointer; transition: all 0.2s;">
                        📋 导出
                    </button>
                </div>
            </div>

            <!-- 项目列表容器 -->
            <div id="projects-container" style="max-height: 400px; overflow-y: auto; padding-right: 8px;">
                <!-- 项目列表将在这里动态生成 -->
            </div>
        `;

        panel.innerHTML = panelHTML;
        return panel;
    }

    // ====== 6. 渲染项目列表 ======
    function renderProjects(panel, projects, searchTerm = '', sortBy = 'rate-desc') {
        const container = panel.querySelector('#projects-container');
        
        // 过滤项目
        let filteredProjects = Object.values(projects);
        if (searchTerm) {
            filteredProjects = filteredProjects.filter(project => 
                project.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        // 排序项目
        filteredProjects.sort((a, b) => {
            switch (sortBy) {
                case 'rate-desc': return b.rate - a.rate;
                case 'rate-asc': return a.rate - b.rate;
                case 'name-asc': return a.name.localeCompare(b.name);
                case 'name-desc': return b.name.localeCompare(a.name);
                case 'total-desc': return b.total - a.total;
                case 'total-asc': return a.total - b.total;
                default: return b.rate - a.rate;
            }
        });
        
        // 生成HTML
        let projectsHTML = '';
        if (filteredProjects.length === 0) {
            projectsHTML = `
                <div style="text-align: center; padding: 40px 20px; opacity: 0.7;">
                    <div style="font-size: 48px; margin-bottom: 15px;">🔍</div>
                    <div>未找到匹配的项目</div>
                </div>
            `;
        } else {
            filteredProjects.forEach(project => {
                const rateColor = project.rate > 90 ? '#4ade80' :
                               project.rate > 70 ? '#fbbf24' : '#f87171';
                
                projectsHTML += `
                    <div class="project-item" style="background: rgba(255,255,255,0.1); border-radius: 12px; 
                                                     padding: 16px; margin: 12px 0; border-left: 4px solid ${rateColor}; 
                                                     transition: all 0.3s ease; cursor: pointer;"
                         onmouseover="this.style.background='rgba(255,255,255,0.2)'"
                         onmouseout="this.style.background='rgba(255,255,255,0.1)'">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                            <div class="project-name" style="font-weight: 600; font-size: 1.1em; color: #fff;">
                                ${project.name}
                            </div>
                            <div style="font-size: 1.2em; font-weight: bold; color: ${rateColor};">
                                ${project.rate}%
                            </div>
                        </div>
                        
                        <div style="display: flex; justify-content: space-between; font-size: 0.9em; margin-bottom: 12px; opacity: 0.9;">
                            <span>🟢 在线: <strong>${project.online}</strong></span>
                            <span>🔴 离线: <strong>${project.offline}</strong></span>
                            <span>📊 总计: <strong>${project.total}</strong></span>
                        </div>
                        
                        <div style="position: relative; height: 20px; background: rgba(0,0,0,0.2); 
                                    border-radius: 10px; overflow: hidden; box-shadow: inset 0 1px 3px rgba(0,0,0,0.3);">
                            <div style="position: absolute; top: 0; left: 0; height: 100%; width: ${project.rate}%; 
                                        background: ${rateColor}; border-radius: 10px; transition: width 1s ease-out; 
                                        display: flex; align-items: center; justify-content: center; font-weight: bold; 
                                        font-size: 0.8em; color: ${project.rate > 50 ? '#1f2937' : '#fff'};">
                                ${project.rate}%
                            </div>
                        </div>
                    </div>
                `;
            });
        }
        
        container.innerHTML = projectsHTML;
    }

    // ====== 7. 设置面板事件 ======
    function setupPanelEvents(panel, projectStats) {
        // 初始渲染
        renderProjects(panel, projectStats);

        // 搜索功能
        const searchInput = panel.querySelector('#project-search');
        const searchClear = panel.querySelector('#search-clear');
        const sortSelect = panel.querySelector('#sort-select');
        
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value;
            searchClear.style.display = searchTerm ? 'block' : 'none';
            renderProjects(panel, projectStats, searchTerm, sortSelect.value);
        });
        
        // 清除搜索
        searchClear.addEventListener('click', () => {
            searchInput.value = '';
            searchClear.style.display = 'none';
            renderProjects(panel, projectStats, '', sortSelect.value);
        });
        
        // 排序功能
        sortSelect.addEventListener('change', (e) => {
            renderProjects(panel, projectStats, searchInput.value, e.target.value);
        });
        
        // 刷新功能
        panel.querySelector('#refresh-btn').addEventListener('click', () => {
            location.reload();
        });
        
        // 关闭功能
        panel.querySelector('#close-btn').addEventListener('click', () => {
            panel.remove();
        });
        
        // 导出功能
        panel.querySelector('#export-btn').addEventListener('click', () => {
            const data = Object.values(projectStats).map(project => ({
                项目名称: project.name,
                在线数: project.online,
                离线数: project.offline,
                总数: project.total,
                在线率: project.rate + '%'
            }));
            
            const csv = [
                '项目名称,在线数,离线数,总数,在线率',
                ...data.map(row => Object.values(row).join(','))
            ].join('\n');
            
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `项目在线率统计_${new Date().toISOString().slice(0,10)}.csv`;
            link.click();
        });

        // 悬停效果
        panel.addEventListener('mouseenter', () => {
            panel.style.transform = 'scale(1.02)';
            panel.style.boxShadow = '0 30px 70px rgba(0,0,0,0.7)';
        });
        
        panel.addEventListener('mouseleave', () => {
            panel.style.transform = 'scale(1)';
            panel.style.boxShadow = '0 25px 60px rgba(0,0,0,0.6)';
        });

        // 控制台输出
        console.group('%c🎯 项目在线率统计结果 (增强版)', 'color: #667eea; font-weight: bold; font-size: 16px;');
        Object.values(projectStats).forEach(project => {
            console.log(
                `%c${project.name.padEnd(12)} %c${project.rate}% %c(${project.online}/${project.total})`,
                'color: #764ba2; font-weight: bold;',
                `color: ${project.rate > 90 ? 'green' : project.rate > 70 ? 'orange' : 'red'}; font-weight: bold; font-size: 14px;`,
                'color: #ccc;'
            );
        });
        console.groupEnd();

        // 附加信息
        console.info('💡 提示：在线率数据来源于项目名称后的 [在线数/总数] 括号内数字，这是最准确的统计方式。');
        console.info('🔍 新功能：支持项目名称模糊搜索、多种排序方式、数据导出功能。');
    }

    // ====== 8. 主函数：显示统计面板 ======
    async function showStatsPanel() {
        console.log('🚀 开始加载设备统计面板...');
        
        // 查找项目数据
        const rootLi = await findProjectData();
        if (!rootLi) {
            alert('❌ 未找到项目数据，请确保页面已完全加载');
            return;
        }

        // 解析项目数据
        const projectStats = parseProjectData(rootLi);
        if (Object.keys(projectStats).length === 0) {
            alert('❌ 未找到任何项目数据');
            return;
        }

        // 创建并显示面板
        const panel = createStatsPanel(projectStats);
        setupPanelEvents(panel, projectStats);
        document.body.appendChild(panel);

        console.log('✅ 设备统计面板已显示');
    }

    // ====== 9. 初始化 ======
    function init() {
        console.log('🎯 设备在线状态统计脚本已加载');
        
        // 创建触发按钮
        const triggerBtn = createTriggerButton();
        
        // 绑定点击事件
        triggerBtn.addEventListener('click', async () => {
            triggerBtn.innerHTML = '⏳ 加载中...';
            triggerBtn.disabled = true;
            
            try {
                await showStatsPanel();
            } catch (error) {
                console.error('❌ 显示统计面板失败:', error);
                alert('❌ 显示统计面板失败: ' + error.message);
            } finally {
                triggerBtn.innerHTML = '📊 设备统计';
                triggerBtn.disabled = false;
            }
        });

        // 添加键盘快捷键 (Ctrl+Shift+S)
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'S') {
                e.preventDefault();
                triggerBtn.click();
            }
        });

        console.log('💡 提示：点击左上角"📊 设备统计"按钮或按 Ctrl+Shift+S 打开统计面板');
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();