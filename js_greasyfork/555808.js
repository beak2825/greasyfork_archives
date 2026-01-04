// ==UserScript==
// @name         OI 教练模拟器 - 开发者工具
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  OI教练模拟器开发者工具，支持编辑学生属性、天赋、晋级状态、预算、声誉等
// @author       Oracynx
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555808/OI%20%E6%95%99%E7%BB%83%E6%A8%A1%E6%8B%9F%E5%99%A8%20-%20%E5%BC%80%E5%8F%91%E8%80%85%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/555808/OI%20%E6%95%99%E7%BB%83%E6%A8%A1%E6%8B%9F%E5%99%A8%20-%20%E5%BC%80%E5%8F%91%E8%80%85%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function ()
{
    'use strict';

    // 检测是否为OI教练模拟器
    function isOICoachSimulator()
    {
        console.log('开始检测OI教练模拟器...');

        // 检查关键特征
        const hasGameObject = typeof window.game !== 'undefined';
        console.log('检测到game对象:', hasGameObject);

        const hasStudents = hasGameObject && Array.isArray(window.game.students);
        console.log('检测到学生数据:', hasStudents);

        const hasWeek = hasGameObject && typeof window.game.week === 'number';
        console.log('检测到周数:', hasWeek);

        const hasBudget = hasGameObject && typeof window.game.budget === 'number';
        console.log('检测到预算:', hasBudget);

        // 放宽检测条件：只要有game对象和学生数据就认为是模拟器
        const isSimulator = hasGameObject && hasStudents;
        console.log('最终检测结果:', isSimulator);

        if (!isSimulator)
        {
            console.log('检测失败原因:');
            if (!hasGameObject) console.log('- 缺少game对象');
            if (!hasStudents) console.log('- 缺少学生数据');
        }

        return isSimulator;
    }

    // 主面板类
    class OIDevTools
    {
        constructor()
        {
            this.isVisible = false;
            this.panel = null;
            this.currentTab = 'students';
            this.init();
        }

        init()
        {
            this.createPanel();
            this.bindEvents();
            this.injectStyles();
        }

        createPanel()
        {
            this.panel = document.createElement('div');
            this.panel.id = 'oi-dev-tools';
            this.panel.innerHTML = this.getPanelHTML();
            this.panel.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 90%;
                max-width: 1200px;
                height: 80vh;
                background: white;
                border: 2px solid #333;
                border-radius: 10px;
                box-shadow: 0 0 20px rgba(0,0,0,0.5);
                z-index: 10000;
                display: none;
                font-family: Arial, sans-serif;
                overflow: hidden;
            `;

            document.body.appendChild(this.panel);
        }

        getPanelHTML()
        {
            const studentsTabDisplay = this.currentTab === 'students' ? 'block' : 'none';
            const gameTabDisplay = this.currentTab === 'game' ? 'block' : 'none';
            const qualificationsTabDisplay = this.currentTab === 'qualifications' ? 'block' : 'none';
            const talentsTabDisplay = this.currentTab === 'talents' ? 'block' : 'none';
            const advancedTabDisplay = this.currentTab === 'advanced' ? 'block' : 'none';

            const studentsActive = this.currentTab === 'students' ? 'active' : '';
            const gameActive = this.currentTab === 'game' ? 'active' : '';
            const qualificationsActive = this.currentTab === 'qualifications' ? 'active' : '';
            const talentsActive = this.currentTab === 'talents' ? 'active' : '';
            const advancedActive = this.currentTab === 'advanced' ? 'active' : '';

            return '<div style="display: flex; height: 100%;">' +
                '<!-- 侧边栏 -->' +
                '<div style="width: 200px; background: #f5f5f5; border-right: 1px solid #ddd; padding: 10px;">' +
                '<h3 style="margin: 0 0 20px 0; color: #333;">开发者工具</h3>' +
                '<div class="tab-button ' + studentsActive + '" data-tab="students">学生管理</div>' +
                '<div class="tab-button ' + gameActive + '" data-tab="game">游戏状态</div>' +
                '<div class="tab-button ' + qualificationsActive + '" data-tab="qualifications">晋级状态</div>' +
                '<div class="tab-button ' + talentsActive + '" data-tab="talents">天赋管理</div>' +
                '<div class="tab-button ' + advancedActive + '" data-tab="advanced">高级功能</div>' +
                '<div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd;">' +
                '<button id="save-game" style="width: 100%; padding: 8px; margin-bottom: 5px; background: #4CAF50; color: white; border: none; border-radius: 4px;">保存游戏</button>' +
                '<button id="close-panel" style="width: 100%; padding: 8px; background: #f44336; color: white; border: none; border-radius: 4px;">关闭面板</button>' +
                '</div>' +
                '</div>' +
                '<!-- 主内容区 -->' +
                '<div style="flex: 1; padding: 20px; overflow-y: auto;">' +
                '<div id="students-tab" class="tab-content" style="display: ' + studentsTabDisplay + '">' +
                this.getStudentsTabHTML() +
                '</div>' +
                '<div id="game-tab" class="tab-content" style="display: ' + gameTabDisplay + '">' +
                this.getGameTabHTML() +
                '</div>' +
                '<div id="qualifications-tab" class="tab-content" style="display: ' + qualificationsTabDisplay + '">' +
                this.getQualificationsTabHTML() +
                '</div>' +
                '<div id="talents-tab" class="tab-content" style="display: ' + talentsTabDisplay + '">' +
                this.getTalentsTabHTML() +
                '</div>' +
                '<div id="advanced-tab" class="tab-content" style="display: ' + advancedTabDisplay + '">' +
                this.getAdvancedTabHTML() +
                '</div>' +
                '</div>' +
                '</div>';
        }

        getStudentsTabHTML()
        {
            const students = window.game?.students || [];
            let tableRows = '';
            students.forEach((student, index) =>
            {
                tableRows += this.getStudentRowHTML(student, index);
            });

            return '<h2>学生管理</h2>' +
                '<div style="margin-bottom: 20px;">' +
                '<button id="add-student" style="padding: 8px 16px; background: #2196F3; color: white; border: none; border-radius: 4px;">添加学生</button>' +
                '<button id="refresh-students" style="padding: 8px 16px; background: #FF9800; color: white; border: none; border-radius: 4px; margin-left: 10px;">刷新数据</button>' +
                '</div>' +
                '<div style="max-height: 500px; overflow-y: auto;">' +
                '<table style="width: 100%; border-collapse: collapse;">' +
                '<thead>' +
                '<tr style="background: #f0f0f0;">' +
                '<th style="padding: 8px; border: 1px solid #ddd;">姓名</th>' +
                '<th style="padding: 8px; border: 1px solid #ddd;">能力</th>' +
                '<th style="padding: 8px; border: 1px solid #ddd;">思维</th>' +
                '<th style="padding: 8px; border: 1px solid #ddd;">编码</th>' +
                '<th style="padding: 8px; border: 1px solid #ddd;">压力</th>' +
                '<th style="padding: 8px; border: 1px solid #ddd;">心理</th>' +
                '<th style="padding: 8px; border: 1px solid #ddd;">状态</th>' +
                '<th style="padding: 8px; border: 1px solid #ddd;">操作</th>' +
                '</tr>' +
                '</thead>' +
                '<tbody>' + tableRows + '</tbody>' +
                '</table>' +
                '</div>';
        }

        getStudentRowHTML(student, index)
        {
            const isActive = student.active !== false;
            const selectedActive = isActive ? 'selected' : '';
            const selectedInactive = !isActive ? 'selected' : '';

            return '<tr>' +
                '<td style="padding: 8px; border: 1px solid #ddd;">' +
                '<input type="text" value="' + (student.name || '') + '" data-index="' + index + '" data-field="name" style="width: 100%; padding: 4px;">' +
                '</td>' +
                '<td style="padding: 8px; border: 1px solid #ddd;">' +
                '<input type="number" value="' + (student.ability || 0) + '" data-index="' + index + '" data-field="ability" style="width: 60px; padding: 4px;">' +
                '</td>' +
                '<td style="padding: 8px; border: 1px solid #ddd;">' +
                '<input type="number" value="' + (student.thinking || 0) + '" data-index="' + index + '" data-field="thinking" style="width: 60px; padding: 4px;">' +
                '</td>' +
                '<td style="padding: 8px; border: 1px solid #ddd;">' +
                '<input type="number" value="' + (student.coding || 0) + '" data-index="' + index + '" data-field="coding" style="width: 60px; padding: 4px;">' +
                '</td>' +
                '<td style="padding: 8px; border: 1px solid #ddd;">' +
                '<input type="number" value="' + (student.pressure || 0) + '" data-index="' + index + '" data-field="pressure" style="width: 60px; padding: 4px;">' +
                '</td>' +
                '<td style="padding: 8px; border: 1px solid #ddd;">' +
                '<input type="number" value="' + (student.mental || 0) + '" data-index="' + index + '" data-field="mental" style="width: 60px; padding: 4px;">' +
                '</td>' +
                '<td style="padding: 8px; border: 1px solid #ddd;">' +
                '<select data-index="' + index + '" data-field="active" style="padding: 4px;">' +
                '<option value="true" ' + selectedActive + '>活跃</option>' +
                '<option value="false" ' + selectedInactive + '>非活跃</option>' +
                '</select>' +
                '</td>' +
                '<td style="padding: 8px; border: 1px solid #ddd;">' +
                '<button class="edit-knowledge" data-index="' + index + '" style="padding: 4px 8px; margin: 2px; background: #9C27B0; color: white; border: none; border-radius: 3px;">知识</button>' +
                '<button class="edit-talents" data-index="' + index + '" style="padding: 4px 8px; margin: 2px; background: #3F51B5; color: white; border: none; border-radius: 3px;">天赋</button>' +
                '<button class="delete-student" data-index="' + index + '" style="padding: 4px 8px; margin: 2px; background: #f44336; color: white; border: none; border-radius: 3px;">删除</button>' +
                '</td>' +
                '</tr>';
        }

        getGameTabHTML()
        {
            const game = window.game || {};
            return `
                <h2>游戏状态编辑</h2>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                    <div>
                        <h3>基础信息</h3>
                        <div style="margin-bottom: 10px;">
                            <label style="display: block; margin-bottom: 5px;">当前周数:</label>
                            <input type="number" id="game-week" value="${game.week || 1}" style="width: 100px; padding: 8px;">
                        </div>
                        <div style="margin-bottom: 10px;">
                            <label style="display: block; margin-bottom: 5px;">预算 (¥):</label>
                            <input type="number" id="game-budget" value="${game.budget || 0}" style="width: 200px; padding: 8px;">
                        </div>
                        <div style="margin-bottom: 10px;">
                            <label style="display: block; margin-bottom: 5px;">声誉:</label>
                            <input type="number" id="game-reputation" value="${game.reputation || 0}" min="0" max="100" style="width: 100px; padding: 8px;">
                        </div>
                        <div style="margin-bottom: 10px;">
                            <label style="display: block; margin-bottom: 5px;">省份类型:</label>
                            <select id="game-province-type" style="padding: 8px;">
                                <option value="强省" ${game.province_type === '强省' ? 'selected' : ''}>强省</option>
                                <option value="普通省" ${!game.province_type || game.province_type === '普通省' ? 'selected' : ''}>普通省</option>
                                <option value="弱省" ${game.province_type === '弱省' ? 'selected' : ''}>弱省</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <h3>快速操作</h3>
                        <button id="add-budget" style="width: 100%; padding: 10px; margin-bottom: 10px; background: #4CAF50; color: white; border: none; border-radius: 4px;">+10,000 预算</button>
                        <button id="add-reputation" style="width: 100%; padding: 10px; margin-bottom: 10px; background: #2196F3; color: white; border: none; border-radius: 4px;">+10 声誉</button>
                        <button id="next-week" style="width: 100%; padding: 10px; margin-bottom: 10px; background: #FF9800; color: white; border: none; border-radius: 4px;">下一周</button>
                        <button id="reset-pressure" style="width: 100%; padding: 10px; margin-bottom: 10px; background: #9C27B0; color: white; border: none; border-radius: 4px;">重置所有学生压力</button>
                    </div>
                </div>
                <div style="margin-top: 20px;">
                    <button id="apply-game-changes" style="padding: 10px 20px; background: #333; color: white; border: none; border-radius: 4px;">应用更改</button>
                </div>
            `;
        }

        getQualificationsTabHTML()
        {
            const game = window.game || {};
            const qualifications = game.qualification || {};
            const students = game.students || [];

            const compOrder = window.COMPETITION_ORDER || ["CSP-S1", "CSP-S2", "NOIP", "省选", "NOI"];

            return `
                <h2>晋级状态管理</h2>
                <div style="margin-bottom: 20px;">
                    <p>当前赛季: ${game.week > 13 ? '第二赛季' : '第一赛季'}</p>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                    ${compOrder.map(comp => this.getCompetitionQualificationHTML(comp, qualifications, students)).join('')}
                </div>
            `;
        }

        getCompetitionQualificationHTML(compName, qualifications, students)
        {
            const seasonIndex = window.game?.week > 13 ? 1 : 0;
            const qualified = qualifications[seasonIndex]?.[compName] || new Set();
            const qualifiedArray = Array.from(qualified);

            return `
                <div style="border: 1px solid #ddd; border-radius: 5px; padding: 15px;">
                    <h3 style="margin-top: 0;">${compName}</h3>
                    <div style="max-height: 200px; overflow-y: auto; margin-bottom: 10px;">
                        ${students.map(student => `
                            <div style="display: flex; align-items: center; margin-bottom: 5px;">
                                <input type="checkbox" 
                                       id="qual-${compName}-${student.name}" 
                                       ${qualifiedArray.includes(student.name) ? 'checked' : ''}
                                       data-comp="${compName}" 
                                       data-student="${student.name}">
                                <label for="qual-${compName}-${student.name}" style="margin-left: 8px;">${student.name}</label>
                            </div>
                        `).join('')}
                    </div>
                    <div>
                        <button class="select-all" data-comp="${compName}" style="padding: 5px 10px; margin-right: 5px; background: #4CAF50; color: white; border: none; border-radius: 3px;">全选</button>
                        <button class="clear-all" data-comp="${compName}" style="padding: 5px 10px; background: #f44336; color: white; border: none; border-radius: 3px;">清空</button>
                    </div>
                </div>
            `;
        }

        getTalentsTabHTML()
        {
            const talentManager = window.TalentManager;
            const registeredTalents = talentManager ? Object.keys(talentManager._talents || {}) : [];

            return `
                <h2>天赋管理</h2>
                <div style="margin-bottom: 20px;">
                    <h3>已注册天赋</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px; margin-bottom: 20px;">
                        ${registeredTalents.map(talent => `
                            <div style="border: 1px solid #ddd; padding: 10px; border-radius: 5px;">
                                <strong>${talent}</strong>
                                <div style="font-size: 12px; color: #666; margin-top: 5px;">
                                    ${talentManager.getTalent(talent)?.description || '暂无描述'}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div>
                    <h3>批量天赋操作</h3>
                    <div style="margin-bottom: 10px;">
                        <select id="bulk-talent-select" style="padding: 8px; margin-right: 10px;">
                            <option value="">选择天赋</option>
                            ${registeredTalents.map(talent => `<option value="${talent}">${talent}</option>`).join('')}
                        </select>
                        <button id="add-talent-all" style="padding: 8px 16px; background: #4CAF50; color: white; border: none; border-radius: 4px;">给所有学生添加</button>
                        <button id="remove-talent-all" style="padding: 8px 16px; background: #f44336; color: white; border: none; border-radius: 4px; margin-left: 10px;">从所有学生移除</button>
                    </div>
                </div>
            `;
        }

        getAdvancedTabHTML()
        {
            return `
                <h2>高级功能</h2>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                    <div>
                        <h3>数据操作</h3>
                        <button id="export-save" style="width: 100%; padding: 10px; margin-bottom: 10px; background: #2196F3; color: white; border: none; border-radius: 4px;">导出存档</button>
                        <button id="import-save" style="width: 100%; padding: 10px; margin-bottom: 10px; background: #FF9800; color: white; border: none; border-radius: 4px;">导入存档</button>
                        <button id="reset-game" style="width: 100%; padding: 10px; margin-bottom: 10px; background: #f44336; color: white; border: none; border-radius: 4px;">重置游戏</button>
                    </div>
                    <div>
                        <h3>调试功能</h3>
                        <button id="trigger-event" style="width: 100%; padding: 10px; margin-bottom: 10px; background: #9C27B0; color: white; border: none; border-radius: 4px;">触发随机事件</button>
                        <button id="force-competition" style="width: 100%; padding: 10px; margin-bottom: 10px; background: #607D8B; color: white; border: none; border-radius: 4px;">强制开始比赛</button>
                        <button id="debug-info" style="width: 100%; padding: 10px; margin-bottom: 10px; background: #795548; color: white; border: none; border-radius: 4px;">显示调试信息</button>
                    </div>
                </div>
                <div style="margin-top: 20px;">
                    <h3>自定义命令</h3>
                    <textarea id="custom-command" placeholder="输入JavaScript代码..." style="width: 100%; height: 100px; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-family: monospace;"></textarea>
                    <button id="execute-command" style="padding: 10px 20px; margin-top: 10px; background: #333; color: white; border: none; border-radius: 4px;">执行命令</button>
                </div>
            `;
        }

        injectStyles()
        {
            const style = document.createElement('style');
            style.textContent = `
                .tab-button {
                    padding: 10px;
                    margin-bottom: 5px;
                    cursor: pointer;
                    border-radius: 4px;
                    transition: background-color 0.2s;
                }
                .tab-button:hover {
                    background: #e0e0e0;
                }
                .tab-button.active {
                    background: #2196F3;
                    color: white;
                }
                input, select, textarea {
                    border: 1px solid #ccc;
                    border-radius: 4px;
                }
                input:focus, select:focus, textarea:focus {
                    outline: none;
                    border-color: #2196F3;
                    box-shadow: 0 0 5px rgba(33, 150, 243, 0.3);
                }
                button {
                    cursor: pointer;
                    transition: background-color 0.2s;
                }
                button:hover {
                    opacity: 0.9;
                }
            `;
            document.head.appendChild(style);
        }

        bindEvents()
        {
            // 标签切换
            this.panel.addEventListener('click', (e) =>
            {
                if (e.target.classList.contains('tab-button'))
                {
                    this.switchTab(e.target.dataset.tab);
                }
            });

            // 关闭面板
            this.panel.addEventListener('click', (e) =>
            {
                if (e.target.id === 'close-panel')
                {
                    this.hide();
                }
            });

            // 保存游戏
            this.panel.addEventListener('click', (e) =>
            {
                if (e.target.id === 'save-game')
                {
                    this.saveGame();
                }
            });

        // 学生管理事件
        this.panel.addEventListener('click', (e) =>
        {
            if (e.target.classList.contains('delete-student'))
            {
                this.deleteStudent(parseInt(e.target.dataset.index));
            } else if (e.target.id === 'add-student')
            {
                this.addStudent();
            } else if (e.target.id === 'refresh-students')
            {
                this.refreshStudents();
            } else if (e.target.classList.contains('edit-talents'))
            {
                this.showEditTalentsModal(parseInt(e.target.dataset.index));
            }
        });

            // 学生属性实时更新
            this.panel.addEventListener('change', (e) =>
            {
                if (e.target.type === 'text' || e.target.type === 'number' || e.target.tagName === 'SELECT')
                {
                    const index = parseInt(e.target.dataset.index);
                    const field = e.target.dataset.field;
                    const value = e.target.type === 'number' ? parseInt(e.target.value) :
                        e.target.tagName === 'SELECT' ? e.target.value === 'true' : e.target.value;

                    if (!isNaN(index) && field)
                    {
                        this.updateStudentField(index, field, value);
                    }
                }
            });

            // 游戏状态事件
            this.panel.addEventListener('click', (e) =>
            {
                const game = window.game;
                if (!game) return;

                if (e.target.id === 'add-budget')
                {
                    game.budget = (game.budget || 0) + 10000;
                    this.updateGameFields();
                } else if (e.target.id === 'add-reputation')
                {
                    game.reputation = Math.min(100, (game.reputation || 0) + 10);
                    this.updateGameFields();
                } else if (e.target.id === 'next-week')
                {
                    game.week = (game.week || 1) + 1;
                    this.updateGameFields();
                } else if (e.target.id === 'reset-pressure')
                {
                    this.resetAllPressure();
                } else if (e.target.id === 'apply-game-changes')
                {
                    this.applyGameChanges();
                }
            });

            // 晋级状态事件
            this.panel.addEventListener('change', (e) =>
            {
                if (e.target.type === 'checkbox' && e.target.dataset.comp && e.target.dataset.student)
                {
                    this.updateQualification(e.target.dataset.comp, e.target.dataset.student, e.target.checked);
                }
            });

            this.panel.addEventListener('click', (e) =>
            {
                if (e.target.classList.contains('select-all'))
                {
                    this.selectAllQualifications(e.target.dataset.comp);
                } else if (e.target.classList.contains('clear-all'))
                {
                    this.clearAllQualifications(e.target.dataset.comp);
                }
            });

            // 天赋管理事件
            this.panel.addEventListener('click', (e) =>
            {
                if (e.target.id === 'add-talent-all')
                {
                    this.addTalentToAll();
                } else if (e.target.id === 'remove-talent-all')
                {
                    this.removeTalentFromAll();
                }
            });

            // 高级功能事件
            this.panel.addEventListener('click', (e) =>
            {
                if (e.target.id === 'export-save')
                {
                    this.exportSave();
                } else if (e.target.id === 'import-save')
                {
                    this.importSave();
                } else if (e.target.id === 'reset-game')
                {
                    this.resetGame();
                } else if (e.target.id === 'execute-command')
                {
                    this.executeCustomCommand();
                }
            });
        }

        switchTab(tabName)
        {
            this.currentTab = tabName;

            // 更新标签按钮状态
            this.panel.querySelectorAll('.tab-button').forEach(btn =>
            {
                btn.classList.toggle('active', btn.dataset.tab === tabName);
            });

            // 更新内容区域
            this.panel.querySelectorAll('.tab-content').forEach(content =>
            {
                content.style.display = content.id === `${tabName}-tab` ? 'block' : 'none';
            });

            // 刷新特定标签的数据
            if (tabName === 'students')
            {
                this.refreshStudents();
            } else if (tabName === 'game')
            {
                this.updateGameFields();
            }
        }

        refreshStudents()
        {
            const studentsTab = this.panel.querySelector('#students-tab');
            studentsTab.innerHTML = this.getStudentsTabHTML();
        }

        updateStudentField(index, field, value)
        {
            const students = window.game?.students;
            if (students && students[index])
            {
                // 如果修改的是姓名，需要处理晋级状态的数据同步
                if (field === 'name') {
                    const oldName = students[index].name; // 保存旧姓名
                    students[index][field] = value;
                    this.updateQualificationNames(oldName, value); // 更新晋级状态中的姓名
                    this.showNotification(`已更新学生姓名从 "${oldName}" 到 "${value}"`);
                } else {
                    students[index][field] = value;
                    this.showNotification(`已更新 ${students[index].name} 的 ${field}`);
                }
                
                // 刷新游戏UI
                if (typeof window.renderAll === 'function') {
                    window.renderAll();
                }
            }
        }

        deleteStudent(index)
        {
            const students = window.game?.students;
            if (students && students[index])
            {
                const studentName = students[index].name;
                if (confirm(`确定要删除学生 "${studentName}" 吗？`))
                {
                    students.splice(index, 1);
                    this.refreshStudents();
                    this.showNotification(`已删除学生 ${studentName}`);
                }
            }
        }

        addStudent()
        {
            const students = window.game?.students || [];
            const newStudent = {
                name: `新生${students.length + 1}`,
                ability: 50,
                thinking: 50,
                coding: 50,
                pressure: 0,
                mental: 80,
                active: true,
                talents: new Set()
            };
            students.push(newStudent);
            this.refreshStudents();
            this.showNotification('已添加新学生');
        }

        updateGameFields()
        {
            const game = window.game;
            if (!game) return;

            const weekInput = this.panel.querySelector('#game-week');
            const budgetInput = this.panel.querySelector('#game-budget');
            const reputationInput = this.panel.querySelector('#game-reputation');
            const provinceSelect = this.panel.querySelector('#game-province-type');

            if (weekInput) weekInput.value = game.week || 1;
            if (budgetInput) budgetInput.value = game.budget || 0;
            if (reputationInput) reputationInput.value = game.reputation || 0;
            if (provinceSelect) provinceSelect.value = game.province_type || '普通省';
        }

        applyGameChanges()
        {
            const game = window.game;
            if (!game) return;

            const weekInput = this.panel.querySelector('#game-week');
            const budgetInput = this.panel.querySelector('#game-budget');
            const reputationInput = this.panel.querySelector('#game-reputation');
            const provinceSelect = this.panel.querySelector('#game-province-type');

            if (weekInput) game.week = parseInt(weekInput.value) || 1;
            if (budgetInput) game.budget = parseInt(budgetInput.value) || 0;
            if (reputationInput) game.reputation = parseInt(reputationInput.value) || 0;
            if (provinceSelect) game.province_type = provinceSelect.value;

            this.showNotification('游戏状态已更新');

            // 刷新游戏UI
            if (typeof window.renderAll === 'function')
            {
                window.renderAll();
            }
        }

        resetAllPressure()
        {
            const students = window.game?.students || [];
            students.forEach(student =>
            {
                student.pressure = 0;
            });
            
            // 刷新学生表格和游戏UI
            this.refreshStudents();
            if (typeof window.renderAll === 'function') {
                window.renderAll();
            }
            
            this.showNotification('已重置所有学生压力');
        }

        updateQualification(compName, studentName, qualified)
        {
            const game = window.game;
            if (!game) return;

            const seasonIndex = game.week > 13 ? 1 : 0;

            if (!game.qualification) game.qualification = {};
            if (!game.qualification[seasonIndex]) game.qualification[seasonIndex] = {};
            if (!game.qualification[seasonIndex][compName]) game.qualification[seasonIndex][compName] = new Set();

            if (qualified)
            {
                game.qualification[seasonIndex][compName].add(studentName);
            } else
            {
                game.qualification[seasonIndex][compName].delete(studentName);
            }

            // 刷新游戏UI
            if (typeof window.renderAll === 'function') {
                window.renderAll();
            }
        }

        selectAllQualifications(compName)
        {
            const students = window.game?.students || [];
            students.forEach(student =>
            {
                this.updateQualification(compName, student.name, true);
            });

            // 更新UI
            const checkboxes = this.panel.querySelectorAll(`input[data-comp="${compName}"]`);
            checkboxes.forEach(checkbox =>
            {
                checkbox.checked = true;
            });

            this.showNotification(`已为所有学生添加 ${compName} 晋级资格`);
        }

        clearAllQualifications(compName)
        {
            const game = window.game;
            if (!game) return;

            const seasonIndex = game.week > 13 ? 1 : 0;
            if (game.qualification && game.qualification[seasonIndex])
            {
                delete game.qualification[seasonIndex][compName];
            }

            // 更新UI
            const checkboxes = this.panel.querySelectorAll(`input[data-comp="${compName}"]`);
            checkboxes.forEach(checkbox =>
            {
                checkbox.checked = false;
            });

            this.showNotification(`已清空 ${compName} 晋级资格`);
        }

        addTalentToAll()
        {
            const talentSelect = this.panel.querySelector('#bulk-talent-select');
            const talentName = talentSelect?.value;

            if (!talentName)
            {
                alert('请先选择天赋');
                return;
            }

            const students = window.game?.students || [];
            students.forEach(student =>
            {
                if (!student.talents) student.talents = new Set();
                student.talents.add(talentName);
            });

            // 刷新学生表格和游戏UI
            this.refreshStudents();
            if (typeof window.renderAll === 'function') {
                window.renderAll();
            }

            this.showNotification(`已为所有学生添加天赋: ${talentName}`);
        }

        removeTalentFromAll()
        {
            const talentSelect = this.panel.querySelector('#bulk-talent-select');
            const talentName = talentSelect?.value;

            if (!talentName)
            {
                alert('请先选择天赋');
                return;
            }

            const students = window.game?.students || [];
            students.forEach(student =>
            {
                if (student.talents)
                {
                    student.talents.delete(talentName);
                }
            });

            // 刷新学生表格和游戏UI
            this.refreshStudents();
            if (typeof window.renderAll === 'function') {
                window.renderAll();
            }

            this.showNotification(`已从所有学生移除天赋: ${talentName}`);
        }

        exportSave()
        {
            const gameData = window.game;
            if (!gameData)
            {
                alert('没有找到游戏数据');
                return;
            }

            const dataStr = JSON.stringify(gameData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });

            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `oi-coach-save-${new Date().toISOString().split('T')[0]}.json`;
            link.click();

            URL.revokeObjectURL(url);
            this.showNotification('存档已导出');
        }

        importSave()
        {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';

            input.onchange = (e) =>
            {
                const file = e.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = (event) =>
                {
                    try
                    {
                        const saveData = JSON.parse(event.target.result);
                        Object.assign(window.game, saveData);
                        this.showNotification('存档已导入');

                        // 刷新所有数据
                        this.refreshStudents();
                        this.updateGameFields();

                        // 刷新游戏UI
                        if (typeof window.renderAll === 'function')
                        {
                            window.renderAll();
                        }
                    } catch (error)
                    {
                        alert('导入失败: ' + error.message);
                    }
                };
                reader.readAsText(file);
            };

            input.click();
        }

        resetGame()
        {
            if (confirm('确定要重置游戏吗？所有进度将会丢失！'))
            {
                if (typeof window.resetGame === 'function')
                {
                    window.resetGame();
                } else
                {
                    // 简单重置
                    window.game = {
                        week: 1,
                        budget: 50000,
                        reputation: 50,
                        students: [],
                        qualification: {}
                    };
                }
                this.showNotification('游戏已重置');
                this.refreshStudents();
                this.updateGameFields();
            }
        }

        executeCustomCommand()
        {
            const commandTextarea = this.panel.querySelector('#custom-command');
            const command = commandTextarea.value.trim();

            if (!command)
            {
                alert('请输入命令');
                return;
            }

            try
            {
                const result = eval(command);
                console.log('命令执行结果:', result);
                this.showNotification('命令执行成功');
            } catch (error)
            {
                alert('命令执行失败: ' + error.message);
            }
        }

        // 显示编辑天赋模态框
        showEditTalentsModal(studentIndex)
        {
            const students = window.game?.students;
            if (!students || !students[studentIndex]) return;

            const student = students[studentIndex];
            const talentManager = window.TalentManager;
            const registeredTalents = talentManager ? Object.keys(talentManager._talents || {}) : [];
            const studentTalents = student.talents ? Array.from(student.talents) : [];

            // 创建天赋列表HTML
            let talentsHTML = '';
            registeredTalents.forEach(talentName => {
                const isSelected = studentTalents.includes(talentName);
                const talentDef = talentManager.getTalent(talentName);
                const description = talentDef?.description || '暂无描述';
                const color = talentDef?.color || '#2b6cb0';
                
                talentsHTML += `
                    <div style="margin-bottom: 8px; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                        <label style="display: flex; align-items: center; cursor: pointer;">
                            <input type="checkbox" value="${talentName}" ${isSelected ? 'checked' : ''} 
                                   style="margin-right: 8px;">
                            <div style="flex: 1;">
                                <strong style="color: ${color}">${talentName}</strong>
                                <div style="font-size: 12px; color: #666;">${description}</div>
                            </div>
                        </label>
                    </div>
                `;
            });

            const modalHTML = `
                <div class="modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 10001; display: flex; align-items: center; justify-content: center;">
                    <div style="background: white; border-radius: 8px; padding: 20px; max-width: 500px; max-height: 80vh; overflow-y: auto;">
                        <h3 style="margin-top: 0;">编辑 ${student.name} 的天赋</h3>
                        <div style="margin-bottom: 16px; max-height: 400px; overflow-y: auto;">
                            ${talentsHTML}
                        </div>
                        <div style="display: flex; gap: 10px;">
                            <button id="save-talents" style="padding: 8px 16px; background: #4CAF50; color: white; border: none; border-radius: 4px;">保存</button>
                            <button id="cancel-talents" style="padding: 8px 16px; background: #f44336; color: white; border: none; border-radius: 4px;">取消</button>
                        </div>
                    </div>
                </div>
            `;

            // 创建模态框
            const modalContainer = document.createElement('div');
            modalContainer.innerHTML = modalHTML;
            document.body.appendChild(modalContainer);

            // 绑定事件
            const saveBtn = modalContainer.querySelector('#save-talents');
            const cancelBtn = modalContainer.querySelector('#cancel-talents');

            saveBtn.onclick = () => {
                // 获取选中的天赋
                const checkboxes = modalContainer.querySelectorAll('input[type="checkbox"]');
                const selectedTalents = [];
                checkboxes.forEach(checkbox => {
                    if (checkbox.checked) {
                        selectedTalents.push(checkbox.value);
                    }
                });

                // 更新学生天赋
                if (!student.talents) student.talents = new Set();
                student.talents.clear();
                selectedTalents.forEach(talent => student.talents.add(talent));

                // 移除模态框
                modalContainer.remove();
                
                // 刷新学生表格以更新视图
                this.refreshStudents();
                
                // 刷新游戏UI（如果存在）
                if (typeof window.renderAll === 'function') {
                    window.renderAll();
                }
                
                this.showNotification(`已更新 ${student.name} 的天赋`);
            };

            cancelBtn.onclick = () => {
                modalContainer.remove();
            };

            // 点击背景关闭
            modalContainer.querySelector('.modal').onclick = (e) => {
                if (e.target === e.currentTarget) {
                    modalContainer.remove();
                }
            };
        }

        saveGame()
        {
            if (typeof window.saveGame === 'function')
            {
                window.saveGame();
                this.showNotification('游戏已保存');
            } else
            {
                alert('保存功能不可用');
            }
        }

        showNotification(message)
        {
            // 创建通知元素
            const notification = document.createElement('div');
            notification.textContent = message;
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #4CAF50;
                color: white;
                padding: 10px 20px;
                border-radius: 4px;
                z-index: 10001;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            `;

            document.body.appendChild(notification);

            // 3秒后自动移除
            setTimeout(() =>
            {
                if (notification.parentNode)
                {
                    notification.parentNode.removeChild(notification);
                }
            }, 3000);
        }

        // 更新晋级状态中的学生姓名
        updateQualificationNames(oldName, newName)
        {
            const game = window.game;
            if (!game || !game.qualification) return;

            // 遍历所有赛季和比赛，更新晋级状态中的姓名
            for (const seasonIndex in game.qualification)
            {
                const season = game.qualification[seasonIndex];
                for (const compName in season)
                {
                    const qualifiedSet = season[compName];
                    if (qualifiedSet.has(oldName))
                    {
                        qualifiedSet.delete(oldName);
                        qualifiedSet.add(newName);
                        console.log(`[晋级状态更新] 赛季${seasonIndex} ${compName}: "${oldName}" → "${newName}"`);
                    }
                }
            }

            // 同时更新国家集训队相关数据
            if (game.nationalTeamResults)
            {
                // 更新CTT成绩
                if (game.nationalTeamResults.cttScores)
                {
                    game.nationalTeamResults.cttScores.forEach(score => 
                    {
                        if (score.studentName === oldName)
                        {
                            score.studentName = newName;
                        }
                    });
                }

                // 更新CTS成绩
                if (game.nationalTeamResults.ctsScores)
                {
                    game.nationalTeamResults.ctsScores.forEach(score => 
                    {
                        if (score.studentName === oldName)
                        {
                            score.studentName = newName;
                        }
                    });
                }

                // 更新IOI晋级名单
                if (game.nationalTeamResults.ioiQualified)
                {
                    const index = game.nationalTeamResults.ioiQualified.indexOf(oldName);
                    if (index !== -1)
                    {
                        game.nationalTeamResults.ioiQualified[index] = newName;
                    }
                }
            }

            // 更新职业生涯记录
            if (game.careerCompetitions)
            {
                game.careerCompetitions.forEach(comp => 
                {
                    comp.entries.forEach(entry => 
                    {
                        if (entry.name === oldName)
                        {
                            entry.name = newName;
                        }
                    });
                });
            }

            this.showNotification(`已同步晋级状态数据: "${oldName}" → "${newName}"`);
        }

        show()
        {
            this.isVisible = true;
            this.panel.style.display = 'block';
            this.refreshStudents();
            this.updateGameFields();
        }

        hide()
        {
            this.isVisible = false;
            this.panel.style.display = 'none';
        }

        toggle()
        {
            if (this.isVisible)
            {
                this.hide();
            } else
            {
                this.show();
            }
        }
    }

    // 创建开发者工具按钮
    function createDevButton()
    {
        const devButton = document.createElement('button');
        devButton.innerHTML = '🔧 Dev';
        devButton.id = 'oi-dev-button';
        devButton.style.cssText = `
            position: fixed;
            top: 10px;
            left: 10px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 8px 16px;
            font-size: 14px;
            cursor: pointer;
            z-index: 9998;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            transition: background-color 0.2s;
        `;

        // 悬停效果
        devButton.addEventListener('mouseenter', () =>
        {
            devButton.style.background = '#45a049';
        });
        devButton.addEventListener('mouseleave', () =>
        {
            devButton.style.background = '#4CAF50';
        });

        return devButton;
    }

    // 主函数
    function main()
    {
        const isSimulator = isOICoachSimulator();

        if (!isSimulator)
        {
            console.log('未检测到OI教练模拟器，开发者工具未启用');
            return;
        }

        console.log('检测到OI教练模拟器，正在启用开发者工具...');

        let devTools = null;

        // 创建开发者按钮
        const devButton = createDevButton();
        document.body.appendChild(devButton);

        // 按钮点击事件
        devButton.addEventListener('click', () =>
        {
            if (!devTools)
            {
                devTools = new OIDevTools();
            }
            devTools.toggle();
        });
    }

    // 等待DOM加载完成后初始化
    if (document.readyState === 'loading')
    {
        document.addEventListener('DOMContentLoaded', main);
    } else
    {
        main();
    }
})();

