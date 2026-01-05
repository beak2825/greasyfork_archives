// ==UserScript==
// @name         订单数据导出工具
// @namespace    http://maxpeedingrods.cn/
// @version      1.0
// @description  从DMS系统导出订单相关数据并生成INSERT语句
// @author       汪家强-petma
// @license      No License
// @match        https://dms.maxpeedingrods.cn/sqlquery/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=maxpeedingrods.cn
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @connect      dms.maxpeedingrods.cn
// @downloadURL https://update.greasyfork.org/scripts/561454/%E8%AE%A2%E5%8D%95%E6%95%B0%E6%8D%AE%E5%AF%BC%E5%87%BA%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/561454/%E8%AE%A2%E5%8D%95%E6%95%B0%E6%8D%AE%E5%AF%BC%E5%87%BA%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置：定义需要查询的相关表及其关联字段
    const TABLE_CONFIG = {
        'crm_order_info': {
            idField: 'id',
            tableName: 'crm_order_info',
            whereTemplate: 'where id in ({ids})'  // 用于关联表查询
        },
        'crm_order_info_extend': {
            foreignKey: 'order_id',
            tableName: 'crm_order_info_extend',
            whereTemplate: 'where order_id in ({ids})'
        },
        'crm_order_info_buyer': {
            foreignKey: 'order_id',
            tableName: 'crm_order_info_buyer',
            whereTemplate: 'where order_id in ({ids})'
        },
        'crm_order_detail_sold_goods': {
            foreignKey: 'order_id',
            tableName: 'crm_order_detail_sold_goods',
            whereTemplate: 'where order_id in ({ids})'
        },
        'crm_order_payment': {
            foreignKey: 'order_id',
            tableName: 'crm_order_payment',
            whereTemplate: 'where order_id in ({ids})'
        }
    };

    // 调试模式开关
    let DEBUG_MODE = false;

    // 注册Tampermonkey菜单命令
    GM_registerMenuCommand('📤 导出订单数据', createExportUI);
    GM_registerMenuCommand('🐛 切换调试模式', () => {
        DEBUG_MODE = !DEBUG_MODE;
        GM_notification({
            text: `调试模式已${DEBUG_MODE ? '开启' : '关闭'}`,
            title: '调试模式',
            timeout: 2000
        });
        console.log(`🐛 调试模式: ${DEBUG_MODE ? '开启' : '关闭'}`);
    });

    // 创建导出界面
    function createExportUI() {
        // 如果已存在界面，先移除
        const existingUI = document.getElementById('export-order-data-ui');
        if (existingUI) existingUI.remove();

        const container = document.createElement('div');
        container.id = 'export-order-data-ui';
        container.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 10000;
            background: white;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            width: 500px;
            max-height: 80vh;
            overflow-y: auto;
        `;

        const title = document.createElement('h3');
        title.textContent = '订单数据导出工具' + (DEBUG_MODE ? ' 🐛调试模式' : '');
        title.style.cssText = 'margin-top: 0; margin-bottom: 15px; color: #1890ff;';

        const sqlLabel = document.createElement('label');
        sqlLabel.textContent = '输入SQL查询语句：';
        sqlLabel.style.cssText = 'display: block; margin-bottom: 5px; font-weight: bold;';

        const textarea = document.createElement('textarea');
        textarea.id = 'export-sql-input';
        textarea.placeholder = '例如：select * from crm_order_info where crm_human_order_id in (\'EAPCD-2210311347C5G4O\')';
        textarea.value = "select * from crm_order_info where crm_human_order_id in ('MSRCA-01-14064-99460') limit 100;";
        textarea.style.cssText = `
            width: 100%;
            height: 120px;
            margin-bottom: 15px;
            padding: 10px;
            box-sizing: border-box;
            font-family: 'Consolas', 'Monaco', monospace;
            font-size: 13px;
            border: 1px solid #d9d9d9;
            border-radius: 4px;
            resize: vertical;
        `;

        // 添加调试选项
        const debugContainer = document.createElement('div');
        debugContainer.style.cssText = 'margin-bottom: 15px; padding: 10px; background: #f5f5f5; border-radius: 4px;';

        const debugLabel = document.createElement('label');
        debugLabel.style.cssText = 'display: flex; align-items: center; cursor: pointer;';

        const debugCheckbox = document.createElement('input');
        debugCheckbox.type = 'checkbox';
        debugCheckbox.id = 'debug-checkbox';
        debugCheckbox.checked = DEBUG_MODE;
        debugCheckbox.style.marginRight = '8px';

        const debugText = document.createElement('span');
        debugText.textContent = '启用详细调试输出（控制台查看）';
        debugText.style.fontSize = '12px';

        debugLabel.appendChild(debugCheckbox);
        debugLabel.appendChild(debugText);
        debugContainer.appendChild(debugLabel);

        const exampleContainer = document.createElement('div');
        exampleContainer.style.cssText = 'margin-bottom: 15px;';

        const exampleLabel = document.createElement('span');
        exampleLabel.textContent = '快速示例：';
        exampleLabel.style.cssText = 'font-size: 12px; color: #666; margin-right: 10px;';

        const exampleBtn = document.createElement('button');
        exampleBtn.textContent = '测试用例';
        exampleBtn.style.cssText = `
            background: #f0f0f0;
            color: #333;
            border: 1px solid #d9d9d9;
            padding: 4px 8px;
            border-radius: 3px;
            font-size: 12px;
            cursor: pointer;
            margin-right: 5px;
        `;
        exampleBtn.addEventListener('click', () => {
            textarea.value = "select * from crm_order_info where crm_human_order_id in ('MSRCA-01-14064-99460') limit 100;";
            textarea.focus();
        });

        exampleContainer.appendChild(exampleLabel);
        exampleContainer.appendChild(exampleBtn);

        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = 'display: flex; gap: 10px; margin-bottom: 15px;';

        const exportBtn = document.createElement('button');
        exportBtn.id = 'export-data-btn';
        exportBtn.textContent = '开始导出';
        exportBtn.style.cssText = `
            flex: 1;
            background: #1890ff;
            color: white;
            border: none;
            padding: 10px;
            border-radius: 4px;
            font-weight: bold;
            cursor: pointer;
            transition: background 0.3s;
        `;
        exportBtn.onmouseover = () => exportBtn.style.background = '#40a9ff';
        exportBtn.onmouseout = () => exportBtn.style.background = '#1890ff';

        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = '取消';
        cancelBtn.style.cssText = `
            flex: 0.5;
            background: #f5f5f5;
            color: #333;
            border: 1px solid #d9d9d9;
            padding: 10px;
            border-radius: 4px;
            cursor: pointer;
        `;
        cancelBtn.addEventListener('click', () => {
            container.remove();
            if (overlay) overlay.remove();
        });

        buttonContainer.appendChild(exportBtn);
        buttonContainer.appendChild(cancelBtn);

        const statusDiv = document.createElement('div');
        statusDiv.id = 'export-status';
        statusDiv.style.cssText = `
            padding: 10px;
            border-radius: 4px;
            font-size: 13px;
            min-height: 20px;
            word-break: break-all;
            font-family: monospace;
            max-height: 200px;
            overflow-y: auto;
            background: #fafafa;
        `;

        // 添加半透明背景遮罩
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            z-index: 9999;
        `;
        overlay.addEventListener('click', () => {
            container.remove();
            overlay.remove();
        });

        container.appendChild(title);
        container.appendChild(sqlLabel);
        container.appendChild(textarea);
        container.appendChild(debugContainer);
        container.appendChild(exampleContainer);
        container.appendChild(buttonContainer);
        container.appendChild(statusDiv);

        document.body.appendChild(overlay);
        document.body.appendChild(container);

        // 聚焦到输入框
        setTimeout(() => textarea.focus(), 100);

        // 绑定导出事件
        exportBtn.addEventListener('click', () => {
            const debugEnabled = document.getElementById('debug-checkbox').checked;
            handleExport(statusDiv, container, overlay, debugEnabled);
        });

        // 支持按ESC键关闭
        const handleKeydown = (e) => {
            if (e.key === 'Escape') {
                container.remove();
                overlay.remove();
                document.removeEventListener('keydown', handleKeydown);
            }
        };
        document.addEventListener('keydown', handleKeydown);
    }

    // 获取CSRF Token
    function getCsrfToken() {
        const meta = document.querySelector('meta[name="csrf-token"]');
        if (meta) {
            if (DEBUG_MODE) console.log('🔑 从meta标签获取CSRF Token:', meta.content.substring(0, 20) + '...');
            return meta.content;
        }

        const cookieMatch = document.cookie.match(/csrftoken=([^;]+)/);
        if (cookieMatch) {
            if (DEBUG_MODE) console.log('🔑 从cookie获取CSRF Token:', cookieMatch[1].substring(0, 20) + '...');
            return cookieMatch[1];
        }

        // 尝试从页面中查找隐藏的CSRF token
        const csrfInput = document.querySelector('input[name="csrfmiddlewaretoken"]');
        if (csrfInput) {
            if (DEBUG_MODE) console.log('🔑 从input获取CSRF Token:', csrfInput.value.substring(0, 20) + '...');
            return csrfInput.value;
        }

        if (DEBUG_MODE) console.warn('❌ CSRF Token未找到');
        return '';
    }

    // 将二维数组转换为对象数组
    function convertRowsToObjects(rows, column_list) {
        if (!rows || !column_list) return [];

        return rows.map(row => {
            const obj = {};
            column_list.forEach((col, index) => {
                obj[col] = row[index];
            });
            return obj;
        });
    }

    // 执行SQL查询（带详细调试）
    function executeSql(sql, tableName, debugEnabled = false) {
        return new Promise((resolve, reject) => {
            const formData = new URLSearchParams();
            formData.append('instance_name', 'CRM_CENTER');
            formData.append('db_name', 'crm_center');
            formData.append('schema_name', '');
            formData.append('tb_name', '');
            formData.append('sql_content', sql);
            formData.append('limit_num', '1000');

            const csrfToken = getCsrfToken();

            if (debugEnabled) {
                console.log('🔍 =============== DEBUG executeSql 开始 ===============');
                console.log('📝 SQL语句:', sql);
                console.log('📋 表名:', tableName);
                console.log('🔑 CSRF Token:', csrfToken ? `${csrfToken.substring(0, 10)}...${csrfToken.substring(csrfToken.length-10)}` : '未找到');
                console.log('📦 请求数据:', Object.fromEntries(formData));
            }

            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://dms.maxpeedingrods.cn/query/',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'x-csrftoken': csrfToken,
                    'Origin': 'https://dms.maxpeedingrods.cn',
                    'Referer': 'https://dms.maxpeedingrods.cn/sqlquery/'
                },
                data: formData.toString(),
                onload: function(response) {
                    if (debugEnabled) {
                        console.log('✅ =============== 请求成功 ===============');
                        console.log('📊 响应状态:', response.status, response.statusText);
                        console.log('📏 响应长度:', response.responseText.length, '字符');

                        // 尝试解析响应
                        try {
                            const parsed = JSON.parse(response.responseText);
                            console.log('🔍 JSON解析成功:', {
                                success: parsed.success,
                                message: parsed.msg,
                                data_keys: parsed.data ? Object.keys(parsed.data) : '无data字段',
                                column_count: parsed.data?.column_list?.length || 0,
                                row_count: parsed.data?.rows?.length || 0,
                                row_format: Array.isArray(parsed.data?.rows?.[0]) ? '二维数组' : '对象数组'
                            });
                        } catch (e) {
                            console.log('❌ JSON解析失败:', e.message);
                        }
                    }

                    try {
                        const result = JSON.parse(response.responseText);

                        if (debugEnabled) {
                            console.log('📊 响应详情:', {
                                status: result.status,
                                msg: result.msg,
                                success: result.status === 0,
                                hasData: !!result.data,
                                columnCount: result.data?.column_list?.length || 0,
                                rowCount: result.data?.rows?.length || 0,
                                affectedRows: result.data?.affected_rows || 0
                            });

                            if (result.data?.rows?.length > 0) {
                                console.log('📝 第一行数据（原始格式）:', result.data.rows[0]);
                                console.log('📝 对应列名:', result.data.column_list);
                            }
                        }

                        if (result.status === 0) {
                            // 将二维数组转换为对象数组
                            const rowsAsObjects = convertRowsToObjects(result.data.rows, result.data.column_list);

                            if (debugEnabled) {
                                console.log('✅ 查询成功！');
                                console.log('📋 列名:', result.data.column_list);
                                if (rowsAsObjects.length > 0) {
                                    console.log('📝 第一行数据（转换后）:', rowsAsObjects[0]);
                                }
                            }

                            resolve({
                                tableName: tableName,
                                columns: result.data.column_list || [],
                                rows: rowsAsObjects, // 使用转换后的对象数组
                                rawRows: result.data.rows || [], // 保留原始二维数组
                                sql: sql,
                                affectedRows: result.data?.affected_rows || 0
                            });
                        } else {
                            const errorMsg = `查询失败: ${result.msg || '未知错误'}`;
                            console.error('❌ 查询失败详情:', {
                                result: result,
                                sql: sql,
                                status: response.status
                            });
                            reject(new Error(errorMsg));
                        }
                    } catch (e) {
                        console.error('❌ JSON解析异常:', e);
                        console.error('📄 原始响应文本:', response.responseText.substring(0, 500));
                        reject(new Error(`解析响应失败: ${e.message}`));
                    }

                    if (debugEnabled) {
                        console.log('🔚 =============== DEBUG executeSql 结束 ===============\n\n');
                    }
                },
                onerror: function(error) {
                    console.error('❌ 网络请求错误:', error);
                    reject(new Error(`网络请求失败: ${error.statusText || '未知错误'}`));
                },
                ontimeout: function() {
                    console.error('⏰ 请求超时');
                    reject(new Error('请求超时'));
                }
            });
        });
    }

    // 生成INSERT语句
    function generateInsertStatement(result) {
        if (!result.rows || result.rows.length === 0) {
            return '';
        }

        const { tableName, columns, rows } = result;

        if (DEBUG_MODE) {
            console.log(`📄 生成INSERT语句 - 表: ${tableName}`);
            console.log(`📊 行数: ${rows.length}`);
            console.log(`📋 列数: ${columns.length}`);
        }

        // 转义单引号
        const escapeValue = (value) => {
            if (value === '') {
                return "''"; // ✅ 空字符串保持为空字符串
            }
            if (value === null || value === undefined) {
                return 'NULL';
            }
            if (typeof value === 'string') {
                // 处理包含单引号的字符串
                return "'" + value.replace(/'/g, "''") + "'";
            }
            if (value instanceof Date) {
                return "'" + value.toISOString().slice(0, 19).replace('T', ' ') + "'";
            }
            // 处理数字、布尔值等
            return value;
        };

        // 生成列名部分
        const columnNames = columns.map(col => `\`${col}\``).join(', ');

        // 生成所有行的VALUES
        const values = rows.map((row, rowIndex) => {
            const rowValues = columns.map((col, colIndex) => {
                const value = row[col];
                const escaped = escapeValue(value);

                if (DEBUG_MODE && rowIndex === 0 && colIndex < 3) {
                    console.log(`  列 "${col}": ${value} -> ${escaped}`);
                }

                return escaped;
            });
            return `(${rowValues.join(', ')})`;
        }).join(',\n    ');

        const insertSql = `-- 表: ${tableName} (${rows.length} 条记录)\nINSERT INTO \`${tableName}\` (${columnNames}) VALUES\n    ${values};\n\n`;

        if (DEBUG_MODE) {
            console.log(`📝 生成的SQL（预览前200字符）: ${insertSql.substring(0, 200)}...`);
        }

        return insertSql;
    }

    // 从主表结果中提取ID列表
    function extractIdsFromResult(result) {
        if (!result.rows || result.rows.length === 0) return [];

        // 使用id字段（根据你的数据结构）
        const idField = 'id';
        if (!result.columns.includes(idField)) {
            console.warn(`❌ 未找到ID字段 "${idField}"，可用字段:`, result.columns);
            // 尝试使用第一列
            const firstColumn = result.columns[0];
            console.log(`⚠️ 尝试使用第一列 "${firstColumn}" 作为ID`);
        }

        const targetField = result.columns.includes(idField) ? idField : result.columns[0];

        const ids = result.rows.map(row => {
            const value = row[targetField];
            if (DEBUG_MODE && row === result.rows[0]) {
                console.log(`🔑 提取ID - 字段: ${targetField}, 值: ${value}`);
            }
            return typeof value === 'string' ? `'${value.replace(/'/g, "''")}'` : value;
        });

        if (DEBUG_MODE) {
            console.log(`🔑 提取的ID列表 (${ids.length}个):`, ids);
        }

        return ids;
    }

    // 生成关联表的SQL
    function generateRelatedTableSql(mainResult, tableKey, debugEnabled = false) {
        const config = TABLE_CONFIG[tableKey];
        if (!config || !config.foreignKey) {
            if (debugEnabled) console.log(`⚠️ 表 ${tableKey} 无配置或外键`);
            return '';
        }

        const ids = extractIdsFromResult(mainResult);
        if (ids.length === 0) {
            if (debugEnabled) console.log(`⚠️ 表 ${tableKey} 无有效ID`);
            return '';
        }

        if (debugEnabled) {
            console.log(`🔗 生成关联表 ${tableKey} 的SQL`);
            console.log(`🔑 外键字段: ${config.foreignKey}`);
            console.log(`📋 ID列表 (${ids.length}个):`, ids.slice(0, 3), ids.length > 3 ? '...' : '');
        }

        const whereClause = config.whereTemplate.replace('{ids}', ids.join(','));
        const sql = `select * from ${config.tableName} ${whereClause}`;

        if (debugEnabled) console.log(`📝 生成SQL: ${sql}`);
        return sql;
    }

    // 显示状态信息
    function showStatus(statusDiv, message, type = 'info') {
        const colors = {
            info: '#1890ff',
            success: '#52c41a',
            error: '#ff4d4f',
            warning: '#faad14'
        };

        const prefix = {
            info: 'ℹ️',
            success: '✅',
            error: '❌',
            warning: '⚠️'
        };

        const line = document.createElement('div');
        line.textContent = `${prefix[type]} ${new Date().toLocaleTimeString()}: ${message}`;
        line.style.color = colors[type];
        line.style.marginBottom = '5px';

        statusDiv.appendChild(line);
        statusDiv.scrollTop = statusDiv.scrollHeight;

        // 同时在控制台输出
        console.log(`${prefix[type]} ${message}`);
    }

    // 处理导出
    async function handleExport(statusDiv, container, overlay, debugEnabled = false) {
        const sqlInput = document.getElementById('export-sql-input');
        const exportBtn = document.getElementById('export-data-btn');

        const originalSql = sqlInput.value.trim();
        if (!originalSql) {
            showStatus(statusDiv, '请输入SQL语句', 'error');
            return;
        }

        try {
            // 禁用按钮防止重复点击
            exportBtn.disabled = true;
            exportBtn.textContent = '导出中...';
            exportBtn.style.background = '#95d475';
            exportBtn.style.cursor = 'not-allowed';

            // 清空状态
            statusDiv.innerHTML = '';
            showStatus(statusDiv, '开始导出数据...', 'info');

            if (debugEnabled) {
                console.log('🚀 =============== 开始导出流程 ===============');
                console.log('📝 原始SQL:', originalSql);
                console.log('🐛 调试模式:', debugEnabled);
            }

            // 1. 执行主表查询
            showStatus(statusDiv, '查询主表数据...', 'info');
            const mainResult = await executeSql(originalSql, 'crm_order_info', debugEnabled);

            if (!mainResult.rows || mainResult.rows.length === 0) {
                showStatus(statusDiv, '未找到相关数据，请检查SQL语句', 'error');
                if (debugEnabled) {
                    console.log('📊 主表结果:', mainResult);
                    console.log('❌ 未找到数据，流程终止');
                }
                resetButton(exportBtn);
                return;
            }

            showStatus(statusDiv, `✓ 主表查询完成，找到 ${mainResult.rows.length} 条记录`, 'success');

            if (debugEnabled) {
                console.log(`✅ 主表查询成功，${mainResult.rows.length}条记录`);
                console.log('📋 主表列名:', mainResult.columns);
                if (mainResult.rows.length > 0) {
                    console.log('📝 第一条数据:', mainResult.rows[0]);
                }
            }

            // 2. 生成主表INSERT语句
            let allInsertSql = generateInsertStatement(mainResult);

            // 3. 查询所有关联表
            const relatedTables = ['crm_order_info_extend', 'crm_order_info_buyer',
                                 'crm_order_detail_sold_goods', 'crm_order_payment'];

            let totalTables = 1; // 主表
            for (const tableKey of relatedTables) {
                showStatus(statusDiv, `查询 ${tableKey} 表...`, 'info');

                const relatedSql = generateRelatedTableSql(mainResult, tableKey, debugEnabled);
                if (!relatedSql) {
                    showStatus(statusDiv, `⚠️ ${tableKey} 表无需查询`, 'warning');
                    continue;
                }

                try {
                    const relatedResult = await executeSql(relatedSql, tableKey, debugEnabled);

                    if (relatedResult.rows && relatedResult.rows.length > 0) {
                        allInsertSql += generateInsertStatement(relatedResult);
                        showStatus(statusDiv, `✓ ${tableKey} 表查询完成，找到 ${relatedResult.rows.length} 条记录`, 'success');
                        totalTables++;
                    } else {
                        showStatus(statusDiv, `ℹ️ ${tableKey} 表无相关数据`, 'info');
                    }
                } catch (error) {
                    showStatus(statusDiv, `⚠️ ${tableKey} 表查询失败: ${error.message}`, 'warning');
                    if (debugEnabled) console.error(`❌ ${tableKey} 表查询异常:`, error);
                }
            }

            // 4. 下载文件
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const filename = `order_export_${timestamp}.sql`;

            if (debugEnabled) {
                console.log('💾 准备下载文件:', filename);
                console.log('📄 SQL总长度:', allInsertSql.length, '字符');
                console.log('📊 包含表数:', totalTables);
            }

            // 先显示完成信息
            showStatus(statusDiv, `✓ 导出完成！共 ${totalTables} 个表，正在下载文件...`, 'success');

            // 使用Blob方式下载，避免GM_download的兼容性问题
            const blob = new Blob([allInsertSql], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            showStatus(statusDiv, `✓ 文件已下载: ${filename}`, 'success');

            if (debugEnabled) {
                console.log('🎉 =============== 导出流程完成 ===============');
            }

        } catch (error) {
            console.error('❌ 导出流程异常:', error);
            showStatus(statusDiv, `导出失败: ${error.message}`, 'error');

            if (debugEnabled) {
                console.error('🔍 错误堆栈:', error.stack);
            }
        } finally {
            resetButton(exportBtn);
        }
    }

    // 重置按钮状态
    function resetButton(button) {
        button.disabled = false;
        button.textContent = '开始导出';
        button.style.background = '#1890ff';
        button.style.cursor = 'pointer';
    }

    // 页面加载完成后在控制台显示提示
    console.log('📦 订单数据导出工具（修正版）已加载');
    console.log('🛠️ 使用Tampermonkey菜单中的"📤 导出订单数据"开始');
    console.log('🐛 如需调试，点击"🐛 切换调试模式"');

})();