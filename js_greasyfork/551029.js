// ==UserScript==
// @name         Archery Dynamic DB Name Setter
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  插入 custom-db-selector 并动态设置 db_name
// @license      MIT
// @match        http://archery.dachensky.com/sqlquery/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551029/Archery%20Dynamic%20DB%20Name%20Setter.user.js
// @updateURL https://update.greasyfork.org/scripts/551029/Archery%20Dynamic%20DB%20Name%20Setter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 数据库映射配置
    const dbMapping = {
        "skg_wt": {
            instanceName: "千聊工具业务库-只读",
            dbName: "skg_wt"
        },
        "coupon": {
            instanceName: "otherDB业务库-只读",
            dbName: "coupon"
        },
        "ql_comment": {
            instanceName: "otherDB业务库-只读",
            dbName: "ql_comment"
        },
        "ql_ops_weapp": {
            instanceName: "otherDB业务库-只读",
            dbName: "ql_ops_weapp"
        },
        "ql_pay": {
            instanceName: "otherDB业务库-只读",
            dbName: "ql_pay"
        },
        "ql_speak": {
            instanceName: "otherDB业务库-只读",
            dbName: "ql_speak"
        },
        "ql_unity": {
            instanceName: "otherDB业务库-只读",
            dbName: "ql_unity"
        },
        "qlchat_crm": {
            instanceName: "otherDB业务库-只读",
            dbName: "qlchat_crm"
        },
        "qlchat_bigdata_feedback": {
            instanceName: "大数据bigdata-feedback库-只读",
            dbName: "qlchat_bigdata_feedback"
        },
        "stat_db": {
            instanceName: "大数据stat_db库-只读",
            dbName: "stat_db"
        },
        "ql_censor": {
            instanceName: "审核数据库[ql_censor]-只读",
            dbName: "ql_censor"
        },
        "mongo_qlchat": {
            instanceName: "mongo_kaifang",
            dbName: "qlchat"
        },
    };

    // 插入选择器
    function insertSelector() {
        const instanceGroup = document.querySelector('#instance_name')?.closest('.form-group');
        if (!instanceGroup || document.getElementById('custom-db-selector')) return;

        // 创建选择器
        const selector = document.createElement('select');
        selector.id = 'custom-db-selector';
        selector.style.marginBottom = '10px';
        selector.className = 'form-control';
        selector.innerHTML = `
       <option value="">请选择数据库</option>
       <option value="skg_wt">skg_wt</option>
       <option value="ql_pay">ql_pay</option>
       <option value="qlchat_crm">qlchat_crm</option>
       <option value="ql_unity">ql_unity</option>
       <option value="qlchat_bigdata_feedback">qlchat_bigdata_feedback</option>
       <option value="stat_db">stat_db</option>
       <option value="ql_ops_weapp">ql_ops_weapp</option>
       <option value="ql_speak">ql_speak</option>
       <option value="ql_censor">ql_censor</option>
       <option value="ql_comment">ql_comment</option>
       <option value="coupon">coupon</option>
       <option value="mongo_qlchat">qlchat</option>
    `;

        // 插入选择器到目标位置
        instanceGroup.parentNode.insertBefore(selector, instanceGroup);

        // 页面加载时，设置上一次记录的值
        const lastSelectedValue = localStorage.getItem('customDbSelectorValue');
        if (lastSelectedValue && dbMapping[lastSelectedValue]) {
            selector.value = lastSelectedValue;
            setInstanceName(dbMapping[lastSelectedValue].instanceName);
        }

        // 监听选择器变化
        selector.addEventListener('change', function () {
            const selectedValue = this.value;
            if (dbMapping[selectedValue]) {
                setInstanceName(dbMapping[selectedValue].instanceName);
                localStorage.setItem('customDbSelectorValue', selectedValue); // 记录选择器的值
            }
        });
    }

    // 设置 instance_name
    function setInstanceName(instanceName) {
        const instanceSelect = document.querySelector('#instance_name');
        if (instanceSelect) {
            const instanceOptions = instanceSelect.querySelectorAll('option');
            instanceOptions.forEach(option => {
                if (option.textContent === instanceName) {
                    instanceSelect.value = option.value;
                    instanceSelect.dispatchEvent(new Event('change', { bubbles: true }));
                }
            });
        }
    }

    // 设置 db_name
    function setDbName(dbName) {
        const dbSelect = document.querySelector('#db_name');
        if (dbSelect) {
            const dbOptions = dbSelect.querySelectorAll('option');
            dbOptions.forEach(option => {
                if (option.value === dbName) {
                    dbSelect.value = option.value;
                    dbSelect.dispatchEvent(new Event('change', { bubbles: true }));
                }
            });
        }
    }

    // 使用 MutationObserver 监听 `db_name` 父节点的变化
    function observeDbNameChanges() {
        const dbGroup = document.querySelector('#db_name')?.closest('.form-group');

        if (dbGroup) {
            let timeoutId; // 用于防抖处理
            let lastSelectedValue = null; // 记录上一次选择器的值

            const observer = new MutationObserver(() => {

                clearTimeout(timeoutId); // 清除之前的定时器
                timeoutId = setTimeout(() => {
                    const selectedValue = document.getElementById('custom-db-selector')?.value;

                    // 只有当选择器的值发生变化时才执行设置
                    if (selectedValue !== lastSelectedValue) {
                        lastSelectedValue = selectedValue; // 更新记录的值

                        if (dbMapping[selectedValue]) {
                            const newDbName = dbMapping[selectedValue].dbName;

                            // 设置 db_name 的值
                            setDbName(newDbName);
                        }
                    }
                }, 200); // 防抖时间设置为200ms
            });

            observer.observe(dbGroup, { childList: true, subtree: true });
        }
    }

    function handleAceEditorPersistence() {
        const editor = ace.edit("sql_content_editor"); // 获取 Ace Editor 实例
        const selector = document.getElementById('custom-db-selector'); // 获取选择器实例

        if (!editor || !selector) return;

        // 根据选择器的当前值动态生成存储的 key
        function getStorageKey() {
            const selectedValue = selector.value || 'default'; // 如果未选择，使用 'default'
            return `aceEditorContent_${selectedValue}`;
        }

        // 页面加载时，自动填写上次记录的内容
        const savedContent = localStorage.getItem(getStorageKey());
        if (savedContent !== null) {
            editor.setValue(savedContent, -1); // 使用 Ace Editor 的 setValue 方法设置内容
        }

        // 监听选择器变化，切换存储的内容
        selector.addEventListener('change', () => {
            const newKey = getStorageKey();
            const newContent = localStorage.getItem(newKey) || ''; // 获取新选项对应的内容
            editor.setValue(newContent, -1); // 更新编辑器内容
        });

        // 监听内容变化事件，实时保存内容到 localStorage
        editor.getSession().on('change', () => {
            const currentContent = editor.getValue(); // 获取当前编辑器内容
            localStorage.setItem(getStorageKey(), currentContent); // 保存到与当前选项相关的 key
        });
    }

    // 记录上一次执行的 SQL
    let lastExecutedSQL = '';
    // 初始化功能
    function initSQLExecution() {
        const sqlButton = document.getElementById('btn-sqlquery');
        const sqlEditor = ace.edit("sql_content_editor"); // 获取 Ace Editor 实例

        if (!sqlButton || !sqlEditor) return;

        // 克隆节点，会移除所有原有事件
        const newButton = sqlButton.cloneNode(true);
        sqlButton.parentNode.replaceChild(newButton, sqlButton);

        // 监听 SQL 查询按钮点击事件
        newButton.addEventListener('click', () => {
            let selectedSQL = sqlEditor.session.getTextRange(sqlEditor.getSelectionRange()).trim();
            let currentSQL = selectedSQL;
            if (!currentSQL) {
                // 没有选中，取光标所在 SQL 语句（多行）
                currentSQL = getCurrentSqlStatement(sqlEditor);
            }

            console.log('currentSql', currentSQL);
            if (currentSQL !== lastExecutedSQL) {
                // 如果 SQL 不一样，新增 tab 页面
                tab_add();
                lastExecutedSQL = currentSQL; // 更新记录的 SQL

                // 回显 SQL 到 mask_time 开头的 div 右边
                echoSQL(currentSQL);
            }
            setTimeout(() => dosqlquery(), 100);
        }, true);
    }

    function initExplainButton() {
        const explainButton = document.getElementById('btn-explain');
        const sqlEditor = ace.edit("sql_content_editor"); // 获取 Ace Editor 实例

        if (!explainButton || !sqlEditor) return;

        // 克隆节点，会移除所有原有事件
        const newExplainButton = explainButton.cloneNode(true);
        explainButton.parentNode.replaceChild(newExplainButton, explainButton);

        // 绑定新的点击事件
        newExplainButton.addEventListener('click', () => {
            let selectedSQL = sqlEditor.session.getTextRange(sqlEditor.getSelectionRange()).trim();
            let currentSQL = selectedSQL;
            if (!currentSQL) {
                // 没有选中，取光标所在 SQL 语句（多行）
                currentSQL = getCurrentSqlStatement(sqlEditor);
            }
            console.log('当前 SQL:', currentSQL);
            if (currentSQL !== lastExecutedSQL) {
                // 如果 SQL 不一样，新增 tab 页面
                tab_add();
                lastExecutedSQL = currentSQL; // 更新记录的 SQL

                // 回显 SQL 到 mask_time 开头的 div 右边
                echoSQL(currentSQL);
            }

            // 调用旧的点击事件逻辑
            if (sqlquery_validate()) {
                $('input[type=button]').addClass('disabled');
                $('input[type=button]').prop('disabled', true);
                setTimeout(() => sqlquery('explain'), 100);
            }
        });
    }

    // 获取光标所在行 sql
    function getCurrentSqlStatement(editor) {
        const content = editor.getValue();
        const cursor = editor.getCursorPosition();
        const lines = content.split('\n');

        // 计算光标在全文中的偏移量
        let pos = 0;
        for (let i = 0; i < cursor.row; i++) {
            pos += lines[i].length + 1; // +1 for \n
        }
        pos += cursor.column;

        // 向前找最近的分号
        let start = content.lastIndexOf(';', pos - 1);
        start = (start === -1) ? 0 : start + 1;

        // 向后找下一个分号
        let end = content.indexOf(';', pos);
        end = (end === -1) ? content.length : end + 1; // 保留末尾分号

        // 修正 start，跳过空字符
        while (start < content.length && ['\n', '\r', ' ', '\t'].includes(content[start])) {
            start++;
        }

        // 截取并修整
        const sql = content.slice(start, end).trim();

        // 选中 SQL
        const Range = ace.require('ace/range').Range;
        const startRow = content.substring(0, start).split('\n').length - 1;
        const startColumn = start - content.lastIndexOf('\n', start - 1) - 1;
        const endRow = content.substring(0, end).split('\n').length - 1;
        const endColumn = end - content.lastIndexOf('\n', end - 1) - 1;

        const range = new Range(startRow, startColumn, endRow, endColumn);
        editor.getSelection().setSelectionRange(range);

        return sql;
    }

    // 回显 SQL 到 mask_time 开头的 div 右边
    function echoSQL(sql) {
        // 从 sessionStorage 获取 tab_number
        const tabNumber = sessionStorage.getItem('tab_num');
        if (!tabNumber) return;

        // 动态获取父容器
        const parentDiv = document.getElementById(`sqlquery_result${tabNumber}`);
        if (!parentDiv) return;

        // 限制显示长度
        const maxLength = 50;
        const shortSQL = sql.length > maxLength ? sql.substring(0, maxLength) + '...' : sql;

        // 创建 sqlEchoDiv
        const sqlEchoDiv = document.createElement('div');
        sqlEchoDiv.id = `sql_echo${tabNumber}`;
        sqlEchoDiv.className = 'navbar-text';
        sqlEchoDiv.innerHTML = `<small>SQL内容 : <strong title="${sql}">${shortSQL}</strong></small>`;

        // 插入到 maskTimeDiv 的同级位置
        const maskTimeDiv = document.getElementById(`mask_time${tabNumber}`);
        if (maskTimeDiv) {
            maskTimeDiv.parentNode.insertBefore(sqlEchoDiv, maskTimeDiv.nextSibling);
        }
    }

    // 监听页面加载完成后绑定事件
    function bindEventAfterScriptsLoaded() {
        const targetNode = document.body; // 监听整个 body
        const observer = new MutationObserver(() => {
            const scripts = document.querySelectorAll('script');
            let allScriptsLoaded = true;

            // 检查是否所有 script 标签都加载完成
            scripts.forEach(script => {
                if (!script.src && script.innerHTML.trim() === '') {
                    allScriptsExecuted = false;
                }
            });

            if (allScriptsLoaded) {
                console.log('所有 script 标签加载完成，绑定事件');
                observer.disconnect(); // 停止观察
                //initSQLExecution(); // 执行绑定事件逻辑
                initExplainButton();
            }
        });

        observer.observe(targetNode, { childList: true, subtree: true });
    }

    function deleteTabButton() {
        // 找到现有的按钮
        var existingButton = $("button.btn.btn-default.btn-sm.pull-right[onclick='tab_remove()']");

        if (existingButton.length > 0) {
            // 创建新的按钮
            var newButton = $('<button class="btn btn-danger btn-sm pull-right">')
            .html('<span class="glyphicon glyphicon-minus">清理</span>')
            .css("margin-left", "5px") // 添加间距
            .on('click', manageTabs); // 绑定 manageTabs 方法

            // 将新按钮插入到现有按钮右边
            existingButton.after(newButton);
        }
    }

    // manageTabs 方法实现
    function manageTabs() {
        var active_li_id = sessionStorage.getItem('active_li_id'); // 当前激活的标签页 ID
        var tab_number = Number(sessionStorage.getItem('tab_num')); // 当前标签页数量

        if (tab_number > 0) {
            var tabs = $("#nav-tabs li[id^='execute_result_tab']"); // 获取所有执行结果的标签页
            var deleteCount = 0; // 记录删除的标签页数量

            tabs.each(function () {
                var tabId = $(this).attr('id');
                if (tabId === active_li_id) {
                    return false;
                }
                // 如果删除了10个标签页，停止删除
                if (deleteCount >= 10) {
                    return false; // 退出循环
                }


                var n = tabId.split("execute_result_tab")[1];
                $("#" + tabId).remove(); // 删除标签页
                $("#" + 'sqlquery_result' + n).remove(); // 删除对应的内容区域
                deleteCount++;

                // 更新标签页数量
                tab_number--;
                sessionStorage.setItem('tab_num', tab_number);
            });

            // 激活标签页
            $("#" + active_li_id).tab('show');
            sessionStorage.setItem('active_li_id', active_li_id);
        }
    }

    // 初始化脚本
    function init() {
        insertSelector();
        observeDbNameChanges();
        handleAceEditorPersistence();
        bindEventAfterScriptsLoaded();
        deleteTabButton();
    }

    // 等待页面加载完成后执行
    window.addEventListener('load', init);
})();