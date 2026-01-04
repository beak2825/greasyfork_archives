// ==UserScript==
// @name         PTA清空题库工具
// @namespace    https://github.com/Qiuner/pta-helper
// @version      1.0
// @description  清空PTA平台已提交的编程题代码，支持多题目集
// @author       Qiuner
// @match        https://pintia.cn/problem-sets/*/exam/problems/type/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/561232/PTA%E6%B8%85%E7%A9%BA%E9%A2%98%E5%BA%93%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/561232/PTA%E6%B8%85%E7%A9%BA%E9%A2%98%E5%BA%93%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 存储配置的key
    const CONFIG_KEY = 'pta_clear_config';

    // 获取当前题目集ID
    function getCurrentProblemSetId() {
        const match = window.location.pathname.match(/problem-sets\/(\d+)/);
        return match ? match[1] : null;
    }

    // 获取配置
    function getConfig() {
        const defaultConfig = {
            enabledSets: [getCurrentProblemSetId()].filter(Boolean)
        };
        const saved = GM_getValue(CONFIG_KEY);
        return saved ? JSON.parse(saved) : defaultConfig;
    }

    // 保存配置
    function saveConfig(config) {
        GM_setValue(CONFIG_KEY, JSON.stringify(config));
    }

    // 检查当前题目集是否启用
    function isCurrentSetEnabled() {
        const config = getConfig();
        const currentId = getCurrentProblemSetId();
        return config.enabledSets.includes(currentId);
    }

    // 等待页面加载完成
    function waitForElement(selector, timeout = 10000) {
        return new Promise((resolve, reject) => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(() => {
                if (document.querySelector(selector)) {
                    observer.disconnect();
                    resolve(document.querySelector(selector));
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            setTimeout(() => {
                observer.disconnect();
                reject(new Error('等待元素超时'));
            }, timeout);
        });
    }

    // 清空当前题目的代码编辑器
    function clearCurrentEditor(silent = false) {
        const editor = document.querySelector('.cm-content[role="textbox"]');
        if (editor) {
            // 清空编辑器内容
            editor.textContent = '';

            // 触发输入事件，让编辑器知道内容已更改
            const event = new Event('input', { bubbles: true });
            editor.dispatchEvent(event);

            if (!silent) {
                console.log('当前题目代码已清空');
            }
            return true;
        }
        return false;
    }

    // 获取所有已提交的题目链接
    function getSubmittedProblems() {
        const problemLinks = document.querySelectorAll('a[href*="problemSetProblemId"]');
        const submitted = [];

        problemLinks.forEach(link => {
            // 检查是否包含已提交标记（绿色对勾）
            const checkIcon = link.querySelector('.PROBLEM_ACCEPTED_iri62');
            if (checkIcon) {
                submitted.push(link);
            }
        });

        return submitted;
    }

    // 全选A功能（单选题）
    async function selectAllA() {
        // 查找所有单选题容器
        const allRadios = document.querySelectorAll('input[type="radio"]');

        if (allRadios.length === 0) {
            alert('未找到单选题');
            return;
        }

        let count = 0;
        const processedQuestions = new Set();

        // 遍历所有单选框
        for (const radio of allRadios) {
            const questionName = radio.getAttribute('name');

            // 跳过已处理的题目
            if (processedQuestions.has(questionName)) {
                continue;
            }

            // 查找该题的所有选项
            const questionRadios = document.querySelectorAll(`input[name="${questionName}"]`);

            // 选择第一个选项（A选项）
            if (questionRadios.length > 0) {
                const firstOption = questionRadios[0];

                // 方法1: 直接点击
                firstOption.click();

                // 方法2: 手动设置checked并触发多个事件
                firstOption.checked = true;

                // 触发多种事件确保React捕获到变化
                ['input', 'change', 'click'].forEach(eventType => {
                    const event = new Event(eventType, { bubbles: true });
                    firstOption.dispatchEvent(event);
                });

                // 触发React的onChange
                const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                    window.HTMLInputElement.prototype,
                    'checked'
                ).set;
                nativeInputValueSetter.call(firstOption, true);

                const reactEvent = new Event('input', { bubbles: true });
                firstOption.dispatchEvent(reactEvent);

                processedQuestions.add(questionName);
                count++;

                // 添加小延迟确保状态更新
                await new Promise(resolve => setTimeout(resolve, 50));
            }
        }

        console.log(`已选择 ${count} 道单选题的A选项`);

        // 等待一下确保所有状态都更新了
        await new Promise(resolve => setTimeout(resolve, 300));

        // 自动点击提交按钮
        const submitBtn = document.querySelector('button[type="submit"]') ||
                         document.querySelector('button:has-text("提交")') ||
                         Array.from(document.querySelectorAll('button')).find(btn =>
                             btn.textContent.includes('提交') ||
                             btn.textContent.includes('保存')
                         );

        if (submitBtn) {
            if (confirm(`已选择 ${count} 道单选题的A选项\n\n是否立即提交？`)) {
                submitBtn.click();
                console.log('已点击提交按钮');
            } else {
                alert(`已选择 ${count} 道单选题的A选项\n\n请手动检查后提交`);
            }
        } else {
            alert(`已选择 ${count} 道单选题的A选项\n\n未找到提交按钮，请手动提交`);
        }
    }

    // 多选题全选A功能
    async function selectAllMultipleA() {
        // 查找所有复选框
        const allCheckboxes = document.querySelectorAll('input[type="checkbox"]');

        if (allCheckboxes.length === 0) {
            alert('未找到多选题');
            return;
        }

        let count = 0;
        const processedQuestions = new Set();

        // 遍历所有复选框
        for (const checkbox of allCheckboxes) {
            const name = checkbox.getAttribute('name');

            // 多选题的name格式：questionId.A, questionId.B 等
            // 提取题目ID（去掉 .A .B 等后缀）
            if (!name || !name.includes('.')) continue;

            const questionId = name.split('.')[0];
            const option = name.split('.')[1];

            // 跳过已处理的题目
            if (processedQuestions.has(questionId)) {
                continue;
            }

            // 只处理A选项
            if (option === 'A') {
                // 先取消该题的所有选项
                const allOptions = document.querySelectorAll(`input[name^="${questionId}."]`);
                for (const opt of allOptions) {
                    if (opt.checked) {
                        opt.click(); // 取消选中
                        await new Promise(resolve => setTimeout(resolve, 30));
                    }
                }

                // 选择A选项
                checkbox.click();
                checkbox.checked = true;

                // 触发多种事件确保React捕获到变化
                ['input', 'change', 'click'].forEach(eventType => {
                    const event = new Event(eventType, { bubbles: true });
                    checkbox.dispatchEvent(event);
                });

                // 触发React的onChange
                const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                    window.HTMLInputElement.prototype,
                    'checked'
                ).set;
                nativeInputValueSetter.call(checkbox, true);

                const reactEvent = new Event('input', { bubbles: true });
                checkbox.dispatchEvent(reactEvent);

                processedQuestions.add(questionId);
                count++;

                // 添加小延迟确保状态更新
                await new Promise(resolve => setTimeout(resolve, 50));
            }
        }

        console.log(`已选择 ${count} 道多选题的A选项`);

        // 等待一下确保所有状态都更新了
        await new Promise(resolve => setTimeout(resolve, 300));

        // 自动点击提交按钮
        const submitBtn = document.querySelector('button[type="submit"]') ||
                         Array.from(document.querySelectorAll('button')).find(btn =>
                             btn.textContent.includes('提交') ||
                             btn.textContent.includes('保存')
                         );

        if (submitBtn) {
            if (confirm(`已选择 ${count} 道多选题的A选项\n\n是否立即提交？`)) {
                submitBtn.click();
                console.log('已点击提交按钮');
            } else {
                alert(`已选择 ${count} 道多选题的A选项\n\n请手动检查后提交`);
            }
        } else {
            alert(`已选择 ${count} 道多选题的A选项\n\n未找到提交按钮，请手动提交`);
        }
    }

    // 判断题全选T（对）
    async function selectAllTrue() {
        // 查找所有单选框
        const allRadios = document.querySelectorAll('input[type="radio"]');

        if (allRadios.length === 0) {
            alert('未找到判断题');
            return;
        }

        let count = 0;
        const processedQuestions = new Set();

        // 遍历所有单选框
        for (const radio of allRadios) {
            const questionName = radio.getAttribute('name');

            // 跳过已处理的题目
            if (processedQuestions.has(questionName)) {
                continue;
            }

            // 查找该题的所有选项
            const questionRadios = document.querySelectorAll(`input[name="${questionName}"]`);

            // 判断题特征：只有2个选项，且标签文本为T和F
            if (questionRadios.length === 2) {
                let trueOption = null;

                // 查找T选项
                for (const opt of questionRadios) {
                    const label = opt.closest('label');
                    if (label && label.textContent.trim() === 'T') {
                        trueOption = opt;
                        break;
                    }
                }

                // 如果找到T选项，选择它
                if (trueOption) {
                    trueOption.click();
                    trueOption.checked = true;

                    // 触发多种事件确保React捕获到变化
                    ['input', 'change', 'click'].forEach(eventType => {
                        const event = new Event(eventType, { bubbles: true });
                        trueOption.dispatchEvent(event);
                    });

                    // 触发React的onChange
                    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                        window.HTMLInputElement.prototype,
                        'checked'
                    ).set;
                    nativeInputValueSetter.call(trueOption, true);

                    const reactEvent = new Event('input', { bubbles: true });
                    trueOption.dispatchEvent(reactEvent);

                    processedQuestions.add(questionName);
                    count++;

                    // 添加小延迟确保状态更新
                    await new Promise(resolve => setTimeout(resolve, 50));
                }
            }
        }

        console.log(`已选择 ${count} 道判断题为"对"`);

        // 等待一下确保所有状态都更新了
        await new Promise(resolve => setTimeout(resolve, 300));

        // 自动点击提交按钮
        const submitBtn = document.querySelector('button[type="submit"]') ||
                         Array.from(document.querySelectorAll('button')).find(btn =>
                             btn.textContent.includes('提交') ||
                             btn.textContent.includes('保存')
                         );

        if (submitBtn) {
            if (confirm(`已选择 ${count} 道判断题为"对"\n\n是否立即提交？`)) {
                submitBtn.click();
                console.log('已点击提交按钮');
            } else {
                alert(`已选择 ${count} 道判断题为"对"\n\n请手动检查后提交`);
            }
        } else {
            alert(`已选择 ${count} 道判断题为"对"\n\n未找到提交按钮，请手动提交`);
        }
    }

    // 清空所有已提交的题目
    async function clearAllSubmitted() {
        const submitted = getSubmittedProblems();

        if (submitted.length === 0) {
            alert('没有找到已提交的题目');
            return;
        }

        if (!confirm(`找到 ${submitted.length} 个已提交的题目，确定要清空所有代码吗？\n\n⚠️ 此操作不可逆，请谨慎操作！\n⚠️ 清空过程中会弹出确认对话框，请手动点击"确定"继续。`)) {
            return;
        }

        // 创建进度提示框
        const progressDiv = document.createElement('div');
        progressDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 30px 40px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            text-align: center;
            min-width: 300px;
        `;
        progressDiv.innerHTML = `
            <div style="font-size: 18px; font-weight: 600; margin-bottom: 15px;">正在清空题目...</div>
            <div style="font-size: 14px; color: #666; margin-bottom: 10px;">
                <span id="progress-text">0/${submitted.length}</span>
            </div>
            <div style="width: 100%; height: 8px; background: #e5e7eb; border-radius: 4px; overflow: hidden;">
                <div id="progress-bar" style="width: 0%; height: 100%; background: #3b82f6; transition: width 0.3s;"></div>
            </div>
            <div style="margin-top: 15px; font-size: 12px; color: #999;">
                请手动点击弹出的确认对话框
            </div>
        `;
        document.body.appendChild(progressDiv);

        const progressText = document.getElementById('progress-text');
        const progressBar = document.getElementById('progress-bar');

        let cleared = 0;
        for (let i = 0; i < submitted.length; i++) {
            const link = submitted[i];
            const problemNum = link.querySelector('.text-xs.font-mono')?.textContent || (i + 1);

            console.log(`正在处理第 ${i + 1}/${submitted.length} 题 (题号: ${problemNum})...`);

            // 点击题目链接
            link.click();

            // 等待编辑器加载
            await new Promise(resolve => setTimeout(resolve, 800));

            // 清空编辑器（静默模式）
            if (clearCurrentEditor(true)) {
                cleared++;
            }

            // 更新进度
            progressText.textContent = `${cleared}/${submitted.length}`;
            progressBar.style.width = `${(cleared / submitted.length) * 100}%`;

            // 添加延迟避免请求过快
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        // 移除进度提示框
        document.body.removeChild(progressDiv);

        alert(`清空完成！\n\n成功清空: ${cleared}/${submitted.length} 个题目`);
    }

    // 创建配置面板
    function createConfigPanel() {
        const panel = document.createElement('div');
        panel.id = 'pta-config-panel';
        panel.style.cssText = `
            display: none;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 25px;
            border-radius: 12px;
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
            z-index: 10001;
            min-width: 450px;
            max-height: 80vh;
            overflow-y: auto;
        `;

        const config = getConfig();
        const currentSetId = getCurrentProblemSetId();

        panel.innerHTML = `
            <h3 style="margin: 0 0 20px 0; font-size: 18px; font-weight: 600; color: #333;">题目集管理</h3>

            <div style="margin-bottom: 20px;">
                <div style="font-size: 14px; color: #666; margin-bottom: 10px;">
                    当前题目集ID: <strong style="color: #3b82f6;">${currentSetId || '未知'}</strong>
                </div>
            </div>

            <div style="margin-bottom: 20px;">
                <label style="display: block; font-size: 14px; font-weight: 500; margin-bottom: 8px; color: #333;">
                    添加题目集链接或ID：
                </label>
                <input
                    id="pta-url-input"
                    type="text"
                    placeholder="粘贴完整URL或输入题目集ID"
                    style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px; box-sizing: border-box;"
                />
                <button id="pta-add-btn" style="
                    margin-top: 10px;
                    padding: 8px 16px;
                    background: #3b82f6;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 14px;
                ">添加</button>
            </div>

            <div style="margin-bottom: 20px;">
                <div style="font-size: 14px; font-weight: 500; margin-bottom: 10px; color: #333;">
                    已启用的题目集：
                </div>
                <div id="pta-set-list" style="
                    max-height: 200px;
                    overflow-y: auto;
                    border: 1px solid #e5e7eb;
                    border-radius: 6px;
                    padding: 10px;
                "></div>
            </div>

            <div style="display: flex; gap: 10px; justify-content: flex-end;">
                <button id="pta-close-btn" style="
                    padding: 10px 20px;
                    background: #6b7280;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 14px;
                ">关闭</button>
            </div>
        `;

        document.body.appendChild(panel);

        // 创建遮罩层
        const overlay = document.createElement('div');
        overlay.id = 'pta-overlay';
        overlay.style.cssText = `
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 10000;
        `;
        document.body.appendChild(overlay);

        // 渲染题目集列表
        function renderSetList() {
            const config = getConfig();
            const listDiv = document.getElementById('pta-set-list');

            if (config.enabledSets.length === 0) {
                listDiv.innerHTML = '<div style="color: #9ca3af; text-align: center; padding: 20px;">暂无题目集</div>';
                return;
            }

            listDiv.innerHTML = config.enabledSets.map(setId => `
                <div style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 10px;
                    border-bottom: 1px solid #f3f4f6;
                ">
                    <span style="font-family: monospace; color: #374151;">${setId}</span>
                    <button class="pta-remove-btn" data-set-id="${setId}" style="
                        padding: 5px 12px;
                        background: #ef4444;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 12px;
                    ">删除</button>
                </div>
            `).join('');

            // 绑定删除按钮事件
            document.querySelectorAll('.pta-remove-btn').forEach(btn => {
                btn.onclick = function() {
                    const setId = this.getAttribute('data-set-id');
                    const config = getConfig();
                    config.enabledSets = config.enabledSets.filter(id => id !== setId);
                    saveConfig(config);
                    renderSetList();
                };
            });
        }

        renderSetList();

        // 添加题目集
        document.getElementById('pta-add-btn').onclick = function() {
            const input = document.getElementById('pta-url-input');
            const value = input.value.trim();

            if (!value) {
                alert('请输入题目集链接或ID');
                return;
            }

            // 尝试从URL中提取ID
            let setId = value;
            const match = value.match(/problem-sets\/(\d+)/);
            if (match) {
                setId = match[1];
            }

            // 验证是否为数字
            if (!/^\d+$/.test(setId)) {
                alert('无效的题目集ID');
                return;
            }

            const config = getConfig();
            if (config.enabledSets.includes(setId)) {
                alert('该题目集已存在');
                return;
            }

            config.enabledSets.push(setId);
            saveConfig(config);
            renderSetList();
            input.value = '';
            alert('添加成功！');
        };

        // 关闭面板
        document.getElementById('pta-close-btn').onclick = function() {
            panel.style.display = 'none';
            overlay.style.display = 'none';
        };

        overlay.onclick = function() {
            panel.style.display = 'none';
            overlay.style.display = 'none';
        };

        return { panel, overlay };
    }

    // 显示配置面板
    function showConfigPanel() {
        const panel = document.getElementById('pta-config-panel');
        const overlay = document.getElementById('pta-overlay');
        panel.style.display = 'block';
        overlay.style.display = 'block';
    }

    // 创建控制按钮
    function createButtons() {
        // 创建按钮容器
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;

        // 清空当前题目按钮
        const clearCurrentBtn = document.createElement('button');
        clearCurrentBtn.textContent = '清空当前题目';
        clearCurrentBtn.style.cssText = `
            padding: 10px 20px;
            background: #3b82f6;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
            transition: all 0.3s;
        `;
        clearCurrentBtn.onmouseover = () => {
            clearCurrentBtn.style.background = '#2563eb';
            clearCurrentBtn.style.transform = 'translateY(-2px)';
            clearCurrentBtn.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)';
        };
        clearCurrentBtn.onmouseout = () => {
            clearCurrentBtn.style.background = '#3b82f6';
            clearCurrentBtn.style.transform = 'translateY(0)';
            clearCurrentBtn.style.boxShadow = '0 2px 8px rgba(59, 130, 246, 0.3)';
        };
        clearCurrentBtn.onclick = () => {
            if (!isCurrentSetEnabled()) {
                alert('当前题目集未启用！\n请点击"管理题目集"按钮添加此题目集。');
                return;
            }
            if (confirm('确定要清空当前题目的代码吗？')) {
                if (clearCurrentEditor()) {
                    alert('当前题目已清空！');
                } else {
                    alert('清空失败，请确保编辑器已加载');
                }
            }
        };

        // 清空所有题目按钮
        const clearAllBtn = document.createElement('button');
        clearAllBtn.textContent = '清空所有已提交';
        clearAllBtn.style.cssText = `
            padding: 10px 20px;
            background: #ef4444;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
            transition: all 0.3s;
        `;
        clearAllBtn.onmouseover = () => {
            clearAllBtn.style.background = '#dc2626';
            clearAllBtn.style.transform = 'translateY(-2px)';
            clearAllBtn.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.4)';
        };
        clearAllBtn.onmouseout = () => {
            clearAllBtn.style.background = '#ef4444';
            clearAllBtn.style.transform = 'translateY(0)';
            clearAllBtn.style.boxShadow = '0 2px 8px rgba(239, 68, 68, 0.3)';
        };
        clearAllBtn.onclick = () => {
            if (!isCurrentSetEnabled()) {
                alert('当前题目集未启用！\n请点击"管理题目集"按钮添加此题目集。');
                return;
            }
            clearAllSubmitted();
        };

        // 管理题目集按钮
        const configBtn = document.createElement('button');
        configBtn.textContent = '管理题目集';
        configBtn.style.cssText = `
            padding: 10px 20px;
            background: #8b5cf6;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3);
            transition: all 0.3s;
        `;
        configBtn.onmouseover = () => {
            configBtn.style.background = '#7c3aed';
            configBtn.style.transform = 'translateY(-2px)';
            configBtn.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.4)';
        };
        configBtn.onmouseout = () => {
            configBtn.style.background = '#8b5cf6';
            configBtn.style.transform = 'translateY(0)';
            configBtn.style.boxShadow = '0 2px 8px rgba(139, 92, 246, 0.3)';
        };
        configBtn.onclick = showConfigPanel;

        // 全选A按钮（单选题）
        const selectABtn = document.createElement('button');
        selectABtn.textContent = '单选全A';
        selectABtn.style.cssText = `
            padding: 10px 20px;
            background: #10b981;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
            transition: all 0.3s;
        `;
        selectABtn.onmouseover = () => {
            selectABtn.style.background = '#059669';
            selectABtn.style.transform = 'translateY(-2px)';
            selectABtn.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.4)';
        };
        selectABtn.onmouseout = () => {
            selectABtn.style.background = '#10b981';
            selectABtn.style.transform = 'translateY(0)';
            selectABtn.style.boxShadow = '0 2px 8px rgba(16, 185, 129, 0.3)';
        };
        selectABtn.onclick = () => {
            if (confirm('确定要将所有单选题选择为A选项吗？\n\n提示：选择完成后会询问是否立即提交')) {
                selectAllA();
            }
        };

        // 多选题全选A按钮
        const selectMultipleABtn = document.createElement('button');
        selectMultipleABtn.textContent = '多选全A';
        selectMultipleABtn.style.cssText = `
            padding: 10px 20px;
            background: #14b8a6;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 2px 8px rgba(20, 184, 166, 0.3);
            transition: all 0.3s;
        `;
        selectMultipleABtn.onmouseover = () => {
            selectMultipleABtn.style.background = '#0d9488';
            selectMultipleABtn.style.transform = 'translateY(-2px)';
            selectMultipleABtn.style.boxShadow = '0 4px 12px rgba(20, 184, 166, 0.4)';
        };
        selectMultipleABtn.onmouseout = () => {
            selectMultipleABtn.style.background = '#14b8a6';
            selectMultipleABtn.style.transform = 'translateY(0)';
            selectMultipleABtn.style.boxShadow = '0 2px 8px rgba(20, 184, 166, 0.3)';
        };
        selectMultipleABtn.onclick = () => {
            if (confirm('确定要将所有多选题选择为A选项吗？\n\n提示：会先取消其他选项，然后只选A\n选择完成后会询问是否立即提交')) {
                selectAllMultipleA();
            }
        };

        // 判断题全选T按钮
        const selectTrueBtn = document.createElement('button');
        selectTrueBtn.textContent = '判断全对';
        selectTrueBtn.style.cssText = `
            padding: 10px 20px;
            background: #f59e0b;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
            transition: all 0.3s;
        `;
        selectTrueBtn.onmouseover = () => {
            selectTrueBtn.style.background = '#d97706';
            selectTrueBtn.style.transform = 'translateY(-2px)';
            selectTrueBtn.style.boxShadow = '0 4px 12px rgba(245, 158, 11, 0.4)';
        };
        selectTrueBtn.onmouseout = () => {
            selectTrueBtn.style.background = '#f59e0b';
            selectTrueBtn.style.transform = 'translateY(0)';
            selectTrueBtn.style.boxShadow = '0 2px 8px rgba(245, 158, 11, 0.3)';
        };
        selectTrueBtn.onclick = () => {
            if (confirm('确定要将所有判断题选择为"对"吗？\n\n提示：选择完成后会询问是否立即提交')) {
                selectAllTrue();
            }
        };

        // 支持作者按钮
        const supportBtn = document.createElement('button');
        supportBtn.textContent = '支持作者';
        supportBtn.style.cssText = `
            padding: 10px 20px;
            background: #ec4899;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 2px 8px rgba(236, 72, 153, 0.3);
            transition: all 0.3s;
        `;
        supportBtn.onmouseover = () => {
            supportBtn.style.background = '#db2777';
            supportBtn.style.transform = 'translateY(-2px)';
            supportBtn.style.boxShadow = '0 4px 12px rgba(236, 72, 153, 0.4)';
        };
        supportBtn.onmouseout = () => {
            supportBtn.style.background = '#ec4899';
            supportBtn.style.transform = 'translateY(0)';
            supportBtn.style.boxShadow = '0 2px 8px rgba(236, 72, 153, 0.3)';
        };
        supportBtn.onclick = () => {
            window.open('https://blog.csdn.net/qq_61654952?spm=1000.2115.3001.5343', '_blank');
        };

        buttonContainer.appendChild(clearCurrentBtn);
        buttonContainer.appendChild(clearAllBtn);
        buttonContainer.appendChild(selectABtn);
        buttonContainer.appendChild(selectMultipleABtn);
        buttonContainer.appendChild(selectTrueBtn);
        buttonContainer.appendChild(configBtn);
        buttonContainer.appendChild(supportBtn);
        document.body.appendChild(buttonContainer);
    }

    // 初始化
    function init() {
        console.log('PTA题目清空工具已加载（通用版）');
        createButtons();
        createConfigPanel();

        // 如果当前题目集未启用，提示用户
        if (!isCurrentSetEnabled()) {
            console.warn('当前题目集未启用，请在管理面板中添加');
        }
    }

    // 根据页面类型初始化
    if (window.location.pathname.includes('/type/')) {
        // 编程题页面，等待编辑器加载
        if (window.location.pathname.includes('/type/10') || window.location.pathname.includes('/type/3')) {
            waitForElement('.cm-content[role="textbox"]').then(() => {
                init();
            }).catch(err => {
                console.error('初始化失败:', err);
            });
        } else {
            // 其他类型题目（如单选题），直接初始化
            setTimeout(init, 1000);
        }
    } else {
        // 其他页面也直接初始化
        setTimeout(init, 1000);
    }

})();