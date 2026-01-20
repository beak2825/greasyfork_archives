// ==UserScript==
// @name         小昭 - 办公自动化助手（油猴版）
// @namespace    https://oa.sd-port.com/
// @version      1.1.0
// @description  智能办公助手，支持流程自动填充与 AI 内容生成
// @author       Your Name
// @match        https://oa.sd-port.com/*
// @icon         data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="75" font-size="75">J</text></svg>
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @connect      api.openai.com
// @connect      *
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/563295/%E5%B0%8F%E6%98%AD%20-%20%E5%8A%9E%E5%85%AC%E8%87%AA%E5%8A%A8%E5%8C%96%E5%8A%A9%E6%89%8B%EF%BC%88%E6%B2%B9%E7%8C%B4%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/563295/%E5%B0%8F%E6%98%AD%20-%20%E5%8A%9E%E5%85%AC%E8%87%AA%E5%8A%A8%E5%8C%96%E5%8A%A9%E6%89%8B%EF%BC%88%E6%B2%B9%E7%8C%B4%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log('Jarvis: 油猴脚本已注入，监控 Landray OA...');

    // ==================== 配置管理 ====================
    const CONFIG = {
        get: (key, defaultValue) => GM_getValue(key, defaultValue),
        set: (key, value) => GM_setValue(key, value),
        getProfile: () => ({
            userName: GM_getValue('userName', '李志浩'),
            userDept: GM_getValue('userDept', '集装箱生产部'),
            userId: GM_getValue('userId', '')
        }),
        getApiConfig: () => ({
            apiKey: GM_getValue('apiKey', ''),
            apiUrl: GM_getValue('apiUrl', 'https://api.openai.com/v1'),
            apiModel: GM_getValue('apiModel', 'gpt-4o')
        })
    };

    // ==================== 流程模板配置 ====================
    const TEMPLATE_CONFIG = {
        // 加班申请流程
        '18f9f43db15c4d565152c7f49b0ad6b5': {
            name: '加班申请',
            type: 'overtime',
            fields: {
                userName: 'extendDataFormInfo.value(fd_3196c46a6b8a4e)',
                userDept: 'extendDataFormInfo.value(fd_31a28df3ded1a2)',
                overtimeReason: 'extendDataFormInfo.value(fd_3196c4a9427654)',
                overtimeDays: 'extendDataFormInfo.value(fd_3197874355e090)',
                detailBeginDate: 'extendDataFormInfo.value(fd_3469156a628094.0.fd_begin_date)',
                detailEndDate: 'extendDataFormInfo.value(fd_3469156a628094.0.fd_end_date)'
            }
        },
        // 请假申请流程
        '18f9f2b46faabdd722194a144a3b5a8e': {
            name: '请假申请',
            type: 'leave',
            fields: {
                userName: 'extendDataFormInfo.value(fd_31915244cc5234)',
                userDept: 'extendDataFormInfo.value(fd_31a28d4a6542f6)',
                leaveStartTime: 'extendDataFormInfo.value(fd_319152b4e7ed04)',
                leaveEndTime: 'extendDataFormInfo.value(fd_319152be0a39ac)',
                leaveDays: 'extendDataFormInfo.value(fd_qjts)',
                leaveType: 'extendDataFormInfo.value(fd_3191532ec5bb08)',
                leaveReason: 'extendDataFormInfo.value(fd_319154e68cbe14)',
                jobTitle: 'extendDataFormInfo.value(fd_zw)'
            }
        }
    };

    // ==================== 工具函数 ====================
    function getTemplateId() {
        return new URLSearchParams(window.location.search).get('fdTemplateId');
    }

    function getCurrentTemplate() {
        const tid = getTemplateId();
        return tid ? TEMPLATE_CONFIG[tid] : null;
    }

    function showToast(message, duration = 2000) {
        const existing = document.getElementById('jarvis-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.id = 'jarvis-toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #0066b3;
            color: white;
            padding: 12px 24px;
            border-radius: 4px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 999999;
            font-size: 14px;
            font-family: "Microsoft YaHei", sans-serif;
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), duration);
    }

    function fillElement(el, value) {
        if (!el || value === undefined) return;
        el.value = value;
        // 只触发最基本的 input 事件，避免触发 OA 系统的自动提交逻辑
        el.dispatchEvent(new Event('input', { bubbles: true }));

        // 高亮动画
        const originalShadow = el.style.boxShadow;
        el.style.boxShadow = '0 0 15px rgba(0, 102, 179, 1)';
        setTimeout(() => { el.style.boxShadow = originalShadow; }, 1500);
    }

    // ==================== 请假流程填充 ====================
    function handleLeaveFill(date) {
        const template = getCurrentTemplate();
        if (!template || template.type !== 'leave') {
            showToast('⚠️ 当前不是请假申请页面');
            return;
        }

        const fields = template.fields;

        // 填充起始/截止时间 (08:00 - 17:00)
        fillElement(document.getElementsByName(fields.leaveStartTime)[0], `${date} 08:00`);
        fillElement(document.getElementsByName(fields.leaveEndTime)[0], `${date} 17:00`);

        // 填充请假事由
        fillElement(document.getElementsByName(fields.leaveReason)[0], '个人私事，请假一天。');

        // 填充类别
        const typeSelect = document.getElementsByName(fields.leaveType)[0];
        if (typeSelect) {
            typeSelect.value = '年假';
            typeSelect.dispatchEvent(new Event('change', { bubbles: true }));
        }

        // 职务 (Radio)
        const radios = document.getElementsByName(fields.jobTitle);
        radios.forEach(r => { if (r.value === '普通员工') r.click(); });

        showToast('✅ 请假表单已填充');
    }

    // ==================== 加班流程填充 ====================
    function handleOvertimeFill(date, reason) {
        const template = getCurrentTemplate();
        if (!template || template.type !== 'overtime') {
            showToast('⚠️ 当前不是加班申请页面');
            return;
        }

        const profile = CONFIG.getProfile();
        const fields = template.fields;

        const d = date.split('-');
        const formattedDate = `${d[0]}年${parseInt(d[1])}月${parseInt(d[2])}日`;

        // 主题
        const subject = `${profile.userDept}${profile.userName}${formattedDate}加班申请1天`;
        fillElement(document.getElementsByName('docSubject')[0], subject);

        // 理由与时间
        fillElement(document.getElementsByName(fields.overtimeReason)[0], reason);
        fillElement(document.getElementsByName(fields.detailBeginDate)[0], `${date} 08:00`);
        fillElement(document.getElementsByName(fields.detailEndDate)[0], `${date} 17:00`);
        fillElement(document.getElementsByName(fields.overtimeDays)[0], '1');

        // 个人信息
        fillElement(document.getElementsByName(fields.userName)[0], profile.userName);
        fillElement(document.getElementsByName(fields.userDept)[0], profile.userDept);

        showToast('✅ 加班表单已填充');
    }

    // ==================== 创建内嵌工具栏 ====================
    function createInlineToolbar() {
        const template = getCurrentTemplate();
        if (!template) {
            console.log('Jarvis: 非目标流程页面，跳过');
            return;
        }

        // 防止重复创建
        if (document.getElementById('jarvis-inline-toolbar')) {
            return;
        }

        // 查找插入位置：导航条下方、表单外部（避免触发表单提交）
        // 优先查找 lui_validate_message 容器（在表单外面）
        let insertTarget = document.getElementById('lui_validate_message');
        if (!insertTarget) {
            // 备选：查找主体内容区容器
            insertTarget = document.querySelector('.lui-fm-container');
        }
        if (!insertTarget) {
            console.log('Jarvis: 未找到合适的插入位置');
            return;
        }

        // 创建工具栏容器（放在表单外部）
        const toolbar = document.createElement('div');
        toolbar.id = 'jarvis-inline-toolbar';
        toolbar.style.cssText = `
            display: flex;
            align-items: center;
            gap: 12px;
            margin: 10px auto;
            padding: 10px 16px;
            background: linear-gradient(135deg, #f0f9ff 0%, #e6f3ff 100%);
            border: 1px solid #0066b3;
            border-radius: 6px;
            font-family: "Microsoft YaHei", sans-serif;
            width: fit-content;
        `;

        const today = new Date().toISOString().split('T')[0];

        if (template.type === 'leave') {
            // 请假流程工具栏
            toolbar.innerHTML = `
                <span style="font-size: 13px; color: #0066b3; font-weight: bold;">🤖 小昭助手</span>
                <input type="date" id="jarvis-leave-date" value="${today}"
                    style="padding: 4px 8px; border: 1px solid #ccc; border-radius: 4px; font-size: 13px;">
                <button type="button" id="jarvis-leave-btn" style="
                    background: #0066b3; color: white; border: none;
                    padding: 6px 16px; border-radius: 4px; cursor: pointer; font-size: 13px;
                ">一键填充请假</button>
                <span style="font-size: 11px; color: #666;">理由：个人私事 | 类别：年假 | 全天</span>
                <a href="javascript:void(0)" id="jarvis-settings-link" style="font-size: 11px; color: #0066b3; margin-left: auto;">⚙️ 设置</a>
            `;
        } else if (template.type === 'overtime') {
            // 加班流程工具栏
            toolbar.innerHTML = `
                <span style="font-size: 13px; color: #0066b3; font-weight: bold;">🤖 小昭助手</span>
                <input type="date" id="jarvis-ot-date" value="${today}"
                    style="padding: 4px 8px; border: 1px solid #ccc; border-radius: 4px; font-size: 13px;">
                <button type="button" id="jarvis-ot-btn" style="
                    background: #0066b3; color: white; border: none;
                    padding: 6px 16px; border-radius: 4px; cursor: pointer; font-size: 13px;
                ">一键填充加班</button>
                <span style="font-size: 11px; color: #666;">理由：推进玉衡项目研发 | 08:00-17:00</span>
                <a href="javascript:void(0)" id="jarvis-settings-link" style="font-size: 11px; color: #0066b3; margin-left: auto;">⚙️ 设置</a>
            `;
        }

        // 插入到目标元素（表单外部）
        insertTarget.appendChild(toolbar);

        // 绑定事件
        if (template.type === 'leave') {
            document.getElementById('jarvis-leave-btn').addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const date = document.getElementById('jarvis-leave-date').value;
                if (!date) return showToast('⚠️ 请选择日期');
                handleLeaveFill(date);
            });
        } else if (template.type === 'overtime') {
            document.getElementById('jarvis-ot-btn').addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const date = document.getElementById('jarvis-ot-date').value;
                if (!date) return showToast('⚠️ 请选择日期');
                handleOvertimeFill(date, '推进玉衡项目研发，加班一天');
            });
        }

        // 设置链接
        document.getElementById('jarvis-settings-link').addEventListener('click', showSettingsModal);

        console.log(`Jarvis: 已在「${template.name}」页面创建工具栏`);
    }

    // ==================== 设置面板 ====================
    function showSettingsModal() {
        const existing = document.getElementById('jarvis-settings-modal');
        if (existing) existing.remove();

        const modal = document.createElement('div');
        modal.id = 'jarvis-settings-modal';

        const config = CONFIG.getApiConfig();
        const profile = CONFIG.getProfile();

        modal.innerHTML = `
            <style>
                #jarvis-settings-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.5);
                    z-index: 9999999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: "Microsoft YaHei", sans-serif;
                }

                .settings-panel {
                    background: white;
                    border-radius: 8px;
                    width: 450px;
                    max-width: 90%;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
                }

                .settings-header {
                    background: #0066b3;
                    color: white;
                    padding: 14px 20px;
                    border-radius: 8px 8px 0 0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .settings-header h2 {
                    margin: 0;
                    font-size: 15px;
                }

                .close-settings {
                    background: rgba(255,255,255,0.2);
                    border: none;
                    color: white;
                    width: 26px;
                    height: 26px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 16px;
                }

                .settings-body {
                    padding: 20px;
                }

                .form-group {
                    margin-bottom: 14px;
                }

                .form-group label {
                    display: block;
                    font-size: 12px;
                    color: #606266;
                    margin-bottom: 4px;
                    font-weight: bold;
                }

                .form-group input {
                    width: 100%;
                    padding: 8px 10px;
                    border: 1px solid #dcdfe6;
                    border-radius: 4px;
                    font-size: 13px;
                    box-sizing: border-box;
                    outline: none;
                }

                .form-group input:focus {
                    border-color: #0066b3;
                }

                .form-section-title {
                    font-size: 13px;
                    font-weight: bold;
                    color: #303133;
                    margin: 16px 0 10px 0;
                    padding-bottom: 6px;
                    border-bottom: 2px solid #0066b3;
                }

                .settings-footer {
                    padding: 14px 20px;
                    border-top: 1px solid #eee;
                    display: flex;
                    justify-content: flex-end;
                    gap: 10px;
                }

                .btn-save {
                    background: #0066b3;
                    color: white;
                    border: none;
                    padding: 8px 20px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 13px;
                }

                .btn-cancel {
                    background: #f5f7fa;
                    color: #606266;
                    border: 1px solid #dcdfe6;
                    padding: 8px 20px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 13px;
                }
            </style>

            <div class="settings-panel">
                <div class="settings-header">
                    <h2>⚙️ 小昭助手设置</h2>
                    <button class="close-settings">×</button>
                </div>

                <div class="settings-body">
                    <div class="form-section-title">👤 个人信息</div>
                    <div class="form-group">
                        <label>姓名</label>
                        <input type="text" id="setting-user-name" value="${profile.userName}" placeholder="张三">
                    </div>
                    <div class="form-group">
                        <label>部门</label>
                        <input type="text" id="setting-user-dept" value="${profile.userDept}" placeholder="技术部">
                    </div>

                    <div class="form-section-title">🤖 AI 配置（可选）</div>
                    <div class="form-group">
                        <label>API Key</label>
                        <input type="password" id="setting-api-key" value="${config.apiKey}" placeholder="sk-...">
                    </div>
                    <div class="form-group">
                        <label>API URL</label>
                        <input type="text" id="setting-api-url" value="${config.apiUrl}" placeholder="https://api.openai.com/v1">
                    </div>
                    <div class="form-group">
                        <label>模型</label>
                        <input type="text" id="setting-api-model" value="${config.apiModel}" placeholder="gpt-4o">
                    </div>
                </div>

                <div class="settings-footer">
                    <button class="btn-cancel" id="cancel-settings">取消</button>
                    <button class="btn-save" id="save-settings">保存</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // 事件绑定
        modal.querySelector('.close-settings').addEventListener('click', () => modal.remove());
        modal.querySelector('#cancel-settings').addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });

        modal.querySelector('#save-settings').addEventListener('click', () => {
            CONFIG.set('userName', document.getElementById('setting-user-name').value);
            CONFIG.set('userDept', document.getElementById('setting-user-dept').value);
            CONFIG.set('apiKey', document.getElementById('setting-api-key').value);
            CONFIG.set('apiUrl', document.getElementById('setting-api-url').value);
            CONFIG.set('apiModel', document.getElementById('setting-api-model').value);

            showToast('✅ 配置已保存');
            modal.remove();
        });
    }

    // ==================== 初始化 ====================
    function init() {
        // 防止重复初始化
        if (window.__jarvisInitialized) {
            return;
        }
        window.__jarvisInitialized = true;

        // 注册菜单命令
        GM_registerMenuCommand('⚙️ 打开小昭设置', showSettingsModal);

        // 延迟创建工具栏，等待表单加载完成
        setTimeout(createInlineToolbar, 500);

        console.log('✅ 小昭助手已就绪');
    }

    // 等待页面加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
