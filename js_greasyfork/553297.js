// ==UserScript==
// @name         本地文件链接生成器
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  快速生成访问本地文件和URL的链接
// @author       热心阿姨
// @match        *://*/*
// @grant        GM_setClipboard
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/553297/%E6%9C%AC%E5%9C%B0%E6%96%87%E4%BB%B6%E9%93%BE%E6%8E%A5%E7%94%9F%E6%88%90%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/553297/%E6%9C%AC%E5%9C%B0%E6%96%87%E4%BB%B6%E9%93%BE%E6%8E%A5%E7%94%9F%E6%88%90%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 初始化配置
    function initConfig() {
        let config = GM_getValue('fileOpenerConfig');
        if (!config) {
            config = {
                domain: 'Mac-mini.local:1234',
                position: { top: '50%', right: '20px' },
                buttonSize: 'small',
                batchMode: false
            };
            GM_setValue('fileOpenerConfig', config);
        }
        return config;
    }

    // 保存配置（防抖处理）
    let saveTimeout;
    function saveConfig(config) {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
            GM_setValue('fileOpenerConfig', config);
        }, 300);
    }

    // 获取当前配置
    let config = initConfig();

    // 创建浮动按钮（使用原生拖拽）
    function createFloatingButton() {
        const buttonSize = config.buttonSize === 'small' ? {
            width: '30px',
            height: '30px',
            fontSize: '10px'
        } : {
            width: '40px',
            height: '40px',
            fontSize: '15px'
        };

        const button = $(`
            <div id="fileLinkGenerator" style="
                position: fixed;
                top: ${config.position.top};
                right: ${config.position.right};
                background: linear-gradient(135deg, var(--primarycolor), var(--primarycolor-dark));
                color: white;
                border-radius: 50%;
                cursor: grab;
                box-shadow: 0 4px 20px var(--primarycolor-lighter);
                z-index: 10000;
                font-size: ${buttonSize.fontSize};
                width: ${buttonSize.width};
                height: ${buttonSize.height};
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
                border: 1px solid white;
                user-select: none;
                -webkit-user-select: none;
                touch-action: none;
                font-family: 'JiangChengLvDongSong', 'PingFang SC', sans-serif;
                font-weight: 600;
            " title="生成本地访问链接">链接</div>
        `);

        let isDragging = false;
        let startX, startY, startTop, startRight;
        let dragStartTime = 0;
        const CLICK_THRESHOLD = 200; // 毫秒，拖动时间超过这个值不算点击
        const MOVE_THRESHOLD = 5; // 像素，移动距离超过这个值不算点击

        // 鼠标拖拽事件
        function handleMouseDown(e) {
            isDragging = false; // 先设为false，等待移动判断
            dragStartTime = Date.now();
            startX = e.clientX || e.touches[0].clientX;
            startY = e.clientY || e.touches[0].clientY;

            const rect = button[0].getBoundingClientRect();
            startTop = rect.top;
            startRight = window.innerWidth - rect.right;

            button.css({
                'cursor': 'grabbing',
                'transform': 'scale(1.15)',
                'box-shadow': '0 8px 30px var(primarycolor-lighter)',
                'transition': 'none'
            });

            e.preventDefault();
            e.stopPropagation();
        }

        function handleMouseMove(e) {
            if (!dragStartTime) return;

            const currentX = e.clientX || (e.touches && e.touches[0].clientX);
            const currentY = e.clientY || (e.touches && e.touches[0].clientY);

            // 检查是否达到拖动阈值
            const deltaX = Math.abs(currentX - startX);
            const deltaY = Math.abs(currentY - startY);

            if (!isDragging && (deltaX > MOVE_THRESHOLD || deltaY > MOVE_THRESHOLD)) {
                isDragging = true;
            }

            if (isDragging) {
                const deltaX = currentX - startX;
                const deltaY = currentY - startY;

                let newTop = startTop + deltaY;
                let newRight = startRight - deltaX;

                // 边界检查
                newTop = Math.max(0, Math.min(newTop, window.innerHeight - parseInt(buttonSize.height)));
                newRight = Math.max(0, Math.min(newRight, window.innerWidth - parseInt(buttonSize.width)));

                button.css({
                    'top': newTop + 'px',
                    'right': newRight + 'px'
                });

                config.position = {
                    top: newTop + 'px',
                    right: newRight + 'px'
                };
            }
        }

        function handleMouseUp(e) {
            if (!dragStartTime) return;

            const wasDragging = isDragging;
            const dragDuration = Date.now() - dragStartTime;
            const isClick = !wasDragging && dragDuration < CLICK_THRESHOLD;

            // 重置状态
            isDragging = false;
            dragStartTime = 0;

            button.css({
                'cursor': 'grab',
                'transform': 'scale(1)',
                'box-shadow': '0 4px 20px var(primarycolor-lighter)',
                'transition': 'all 0.2s ease'
            });

            // 如果是拖动操作，保存位置
            if (wasDragging) {
                saveConfig(config);
            }
            // 如果是点击操作，打开对话框
            else if (isClick) {
                $('#linkDialog').show();
                $('#dialogOverlay').show();
                $('#pathInput').focus();
            }

            e.preventDefault();
            e.stopPropagation();
        }

        // 鼠标事件
        button.on('mousedown', handleMouseDown);
        $(document).on('mousemove', handleMouseMove);
        $(document).on('mouseup', handleMouseUp);

        // 触摸事件（移动端支持）
        button.on('touchstart', handleMouseDown);
        $(document).on('touchmove', handleMouseMove);
        $(document).on('touchend', handleMouseUp);

        // 阻止移动端的默认行为
        button.on('touchstart', function(e) {
            e.preventDefault();
        });

        // 悬停效果（仅桌面端）
        button.hover(
            function() {
                if (!isDragging && !dragStartTime) {
                    $(this).css({
                        'transform': 'scale(1.1)',
                        'box-shadow': '0 6px 25px var(--primarycolor-light)'
                    });
                }
            },
            function() {
                if (!isDragging && !dragStartTime) {
                    $(this).css({
                        'transform': 'scale(1)',
                        'box-shadow': '0 4px 20px var(--primarycolor-lighter)'
                    });
                }
            }
        );

        $('body').append(button);
        return button;
    }

    // 创建输入对话框
    function createInputDialog() {
        const dialog = $(`
            <div id="linkDialog" style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                padding: 0;
                border-radius: 16px;
                box-shadow: 0 20px 60px rgba(0,0,0,0.15);
                z-index: 10001;
                width: 440px;
                max-width: 90vw;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                overflow: hidden;
                display: none;
            ">
                <!-- 标题栏 -->
                <div style="
                    background: linear-gradient(135deg, var(--primarycolor), var(--primarycolor-dark));
                    padding: 20px;
                    color: white;
                    text-align: center;
                ">
                    <div style="font-size: 20px; margin-bottom: 6px;">🔗</div>
                    <h3 style="margin: 0; font-weight: 600; font-size: 16px;">本地访问链接生成器</h3>
                </div>

                <!-- 内容区域 -->
                <div style="padding: 20px;">
                    <!-- 模式切换 -->
                    <div style="margin-bottom: 16px; display: flex; gap: 8px; align-items: center;">
                        <button id="singleModeBtn" class="mode-btn active" data-mode="single" style="
                            flex: 1;
                            padding: 8px 12px;
                            background: linear-gradient(135deg, var(--primarycolor), var(--primarycolor-dark));
                            color: white;
                            border: none;
                            border-radius: 8px;
                            cursor: pointer;
                            font-size: 12px;
                            font-weight: 500;
                        ">🔗 单条模式</button>
                        <button id="batchModeBtn" class="mode-btn" data-mode="batch" style="
                            flex: 1;
                            padding: 8px 12px;
                            background: var(--primarycolor-lighter);
                            color: var(--primarycolor-dark);
                            border: 1.5px solid var(--primarycolor-light);
                            border-radius: 8px;
                            cursor: pointer;
                            font-size: 12px;
                            font-weight: 500;
                        ">📋 批量模式</button>
                    </div>

                    <!-- 单条输入区域 -->
                    <div id="singleInputSection" style="margin-bottom: 16px;">
                        <label style="display: block; margin-bottom: 6px; font-weight: 500; color: #374151; font-size: 13px;">
                            输入路径或URL
                        </label>
                        <input type="text" id="pathInput" style="
                            width: 100%;
                            padding: 10px 12px;
                            border: 1.5px solid var(--primarycolor-light);
                            border-radius: 8px;
                            font-size: 13px;
                            box-sizing: border-box;
                            color: #374151;
                            background: #fafafa;
                        " placeholder="例如：Desktop、/Users/xiaoyangsuxi/Downloads、https://example.com">
                    </div>

                    <!-- 批量输入区域 -->
                    <div id="batchInputSection" style="margin-bottom: 16px; display: none;">
                        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                            <label style="font-weight: 500; color: #374151; font-size: 13px;">
                                批量输入路径或URL（每行一个）
                            </label>
                            <button id="clearBatchBtn" style="
                                background: none;
                                border: none;
                                color: #ef4444;
                                cursor: pointer;
                                font-size: 11px;
                                padding: 2px 6px;
                            ">清空</button>
                        </div>
                        <textarea id="batchPathInput" style="
                            width: 100%;
                            height: 80px;
                            padding: 10px 12px;
                            border: 1.5px solid var(--primarycolor-light);
                            border-radius: 8px;
                            font-size: 13px;
                            box-sizing: border-box;
                            color: #374151;
                            background: #fafafa;
                            resize: vertical;
                            font-family: 'Monaco', 'Menlo', monospace;
                        " placeholder="例如：&#10;Desktop&#10;/Users/xiaoyangsuxi/Downloads&#10;https://example.com"></textarea>
                    </div>

                    <!-- 快速选择 -->
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 10px; font-weight: 500; color: #374151; font-size: 13px;">
                            快速选择
                        </label>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
                            <button class="quick-btn" data-path="Desktop" style="
                                padding: 8px 10px;
                                background: #f8fafc;
                                border: 1.5px solid #e2e8f0;
                                border-radius: 6px;
                                cursor: pointer;
                                font-size: 12px;
                                color: #475569;
                                transition: all 0.2s ease;
                                display: flex;
                                align-items: center;
                                gap: 4px;
                            "><span>📁</span> 桌面</button>
                            <button class="quick-btn" data-path="Downloads" style="
                                padding: 8px 10px;
                                background: #f8fafc;
                                border: 1.5px solid #e2e8f0;
                                border-radius: 6px;
                                cursor: pointer;
                                font-size: 12px;
                                color: #475569;
                                transition: all 0.2s ease;
                                display: flex;
                                align-items: center;
                                gap: 4px;
                            "><span>📥</span> 下载</button>
                            <button class="quick-btn" data-path="Documents" style="
                                padding: 8px 10px;
                                background: #f8fafc;
                                border: 1.5px solid #e2e8f0;
                                border-radius: 6px;
                                cursor: pointer;
                                font-size: 12px;
                                color: #475569;
                                transition: all 0.2s ease;
                                display: flex;
                                align-items: center;
                                gap: 4px;
                            "><span>📄</span> 文档</button>
                            <button class="quick-btn" data-path="/Applications" style="
                                padding: 8px 10px;
                                background: #f8fafc;
                                border: 1.5px solid #e2e8f0;
                                border-radius: 6px;
                                cursor: pointer;
                                font-size: 12px;
                                color: #475569;
                                transition: all 0.2s ease;
                                display: flex;
                                align-items: center;
                                gap: 4px;
                            "><span>🖥️</span> 应用程序</button>
                        </div>
                    </div>

                    <!-- 生成结果 -->
                    <div style="margin-bottom: 20px;">
                        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                            <label style="font-weight: 500; color: #374151; font-size: 13px;">
                                生成的链接
                            </label>
                            <span id="resultCount" style="font-size: 11px; color: #6b7280; display: none;">
                                共 <span id="linkCount">0</span> 个链接
                            </span>
                        </div>

                        <!-- 单条结果 -->
                        <div id="singleResultSection" style="position: relative;">
                            <input type="text" id="resultLink" readonly style="
                                width: 100%;
                                padding: 10px 12px;
                                padding-right: 90px;
                                border: 1.5px solid var(--primarycolor-light);
                                border-radius: 8px;
                                background: #f8faff;
                                font-size: 12px;
                                color: #374151;
                                box-sizing: border-box;
                                font-family: 'Monaco', 'Menlo', monospace;
                            ">
                            <div style="position: absolute; right: 6px; top: 50%; transform: translateY(-50%); display: flex; gap: 4px;">
                                <button id="copyBtn" style="
                                    padding: 5px 10px;
                                    background: linear-gradient(135deg, var(--primarycolor), var(--primarycolor-dark));
                                    color: white;
                                    border: none;
                                    border-radius: 5px;
                                    cursor: pointer;
                                    font-size: 11px;
                                    transition: all 0.2s ease;
                                ">复制</button>
                            </div>
                        </div>

                        <!-- 批量结果 -->
                        <div id="batchResultSection" style="display: none;">
                            <textarea id="batchResultLinks" readonly style="
                                width: 100%;
                                height: 100px;
                                padding: 10px 12px;
                                border: 1.5px solid var(--primarycolor-light);
                                border-radius: 8px;
                                background: #f8faff;
                                font-size: 11px;
                                color: #374151;
                                box-sizing: border-box;
                                font-family: 'Monaco', 'Menlo', monospace;
                                resize: vertical;
                                line-height: 1.4;
                            "></textarea>
                            <div style="margin-top: 8px; display: flex; gap: 6px; justify-content: flex-end;">
                                <button id="copyBatchBtn" style="
                                    padding: 5px 12px;
                                    background: linear-gradient(135deg, var(--primarycolor), var(--primarycolor-dark));
                                    color: white;
                                    border: none;
                                    border-radius: 5px;
                                    cursor: pointer;
                                    font-size: 11px;
                                ">📋 复制全部</button>
                                <button id="copyBatchNewlineBtn" style="
                                    padding: 5px 12px;
                                    background: linear-gradient(135deg, var(--primarycolor), var(--primarycolor-dark));
                                    color: white;
                                    border: none;
                                    border-radius: 5px;
                                    cursor: pointer;
                                    font-size: 11px;
                                ">↵ 换行复制</button>
                            </div>
                        </div>
                    </div>

                    <!-- 服务配置区域 -->
                    <div style="margin-bottom: 20px; padding: 16px; background: #f8fafc; border-radius: 10px; border: 1px solid #e2e8f0;">
                        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
                            <label style="font-weight: 500; color: #374151; font-size: 13px;">
                                ⚙️ 服务配置
                            </label>
                            <button id="toggleConfig" style="
                                background: none;
                                border: none;
                                color: var(--primarycolor);
                                cursor: pointer;
                                font-size: 11px;
                                padding: 4px 8px;
                            ">显示配置</button>
                        </div>

                        <div id="configContent" style="display: none;">
                            <div style="margin-bottom: 12px;">
                                <label style="display: block; margin-bottom: 6px; font-weight: 500; color: #374151; font-size: 12px;">
                                    服务域名和端口
                                </label>
                                <input type="text" id="domainInput" style="
                                    width: 100%;
                                    padding: 8px 12px;
                                    border: 1.5px solid #e5e7eb;
                                    border-radius: 8px;
                                    font-size: 12px;
                                    box-sizing: border-box;
                                    color: #374151;
                                    background: white;
                                " placeholder="例如：Mac-mini.local:1234">
                            </div>

                            <div style="margin-bottom: 12px;">
                                <label style="display: block; margin-bottom: 6px; font-weight: 500; color: #374151; font-size: 12px;">
                                    按钮大小
                                </label>
                                <div style="display: flex; gap: 8px;">
                                    <button class="size-btn" data-size="small" style="
                                        flex: 1;
                                        padding: 6px;
                                        background: linear-gradient(135deg, var(--primarycolor), var(--primarycolor-dark));
                                        color: white;
                                        border: none;
                                        border-radius: 6px;
                                        cursor: pointer;
                                        font-size: 11px;
                                    ">小按钮</button>
                                    <button class="size-btn" data-size="normal" style="
                                flex: 1;
                                padding: 6px;
                                background: var(--primarycolor-lighter);
                                color: var(--primarycolor-dark);
                                border: 1.5px solid var(--primarycolor-light);
                                border-radius: 6px;
                                cursor: pointer;
                                font-size: 11px;
                            ">正常按钮</button>
                                </div>
                            </div>

                            <div style="display: flex; gap: 8px;">
                                <button id="saveConfig" style="
                                    flex: 1;
                                    padding: 8px;
                                    background: linear-gradient(135deg, var(--primarycolor-dark), var(--primarycolor));
                                    color: white;
                                    border: none;
                                    border-radius: 6px;
                                    cursor: pointer;
                                    font-size: 11px;
                                ">💾 保存配置</button>
                                <button id="resetPosition" style="
                                    padding: 8px 12px;
                                    background: linear-gradient(135deg, var(--primarycolor-light), var(--primarycolor-lighter));
                                    color: var(--primarycolor-dark);
                                    border: none;
                                    border-radius: 6px;
                                    cursor: pointer;
                                    font-size: 11px;
                                    font-family: 'JiangChengLvDongSong', 'Microsoft YaHei', sans-serif;
                                    font-weight: 600;
                                ">Reset Local</button>
                            </div>
                        </div>
                    </div>

                    <!-- 操作按钮 -->
                    <div style="display: flex; gap: 10px;">
                        <!-- 单条模式按钮 -->
                        <button id="openBtn" style="
                            flex: 1;
                            padding: 10px;
                            background: linear-gradient(135deg, var(--primarycolor), var(--primarycolor-dark));
                            color: white;
                            border: none;
                            border-radius: 8px;
                            cursor: pointer;
                            font-size: 13px;
                            font-weight: 500;
                            transition: all 0.2s ease;
                        ">🔗 直接打开</button>

                        <!-- 批量模式按钮 -->
                        <button id="openBatchBtn" style="
                            flex: 1;
                            padding: 10px;
                            background: linear-gradient(135deg, var(--primarycolor), var(--primarycolor-dark));
                            color: white;
                            border: none;
                            border-radius: 8px;
                            cursor: pointer;
                            font-size: 13px;
                            font-weight: 500;
                            transition: all 0.2s ease;
                            display: none;
                        ">📋 批量打开</button>

                        <button id="closeBtn" style="
                            padding: 10px 16px;
                            background: var(--primarycolor-lighter);
                            color: var(--primarycolor-dark);
                            border: 1.5px solid var(--primarycolor-light);
                            border-radius: 8px;
                            cursor: pointer;
                            font-size: 13px;
                            font-weight: 500;
                            transition: all 0.2s ease;
                        ">关闭</button>
                    </div>
                </div>
            </div>
            <div id="dialogOverlay" style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.4);
                backdrop-filter: blur(2px);
                z-index: 10000;
                display: none;
            "></div>
        `);

        $('body').append(dialog);
        return dialog;
    }

    // 生成访问链接
    function generateLink(path) {
        const encodedPath = encodeURIComponent(path);
        return `http://${config.domain}/open?query=${encodedPath}`;
    }

    // 显示通知
    function showNotification(message, type = 'info') {
        GM_notification({
            text: message,
            title: '链接生成器',
            timeout: 2000,
            highlight: true
        });
    }

    // 更新按钮位置和大小
    function updateButtonAppearance() {
        const button = $('#fileLinkGenerator');
        if (button.length === 0) return;

        const buttonSize = config.buttonSize === 'small' ? {
            width: '30px',
            height: '30px',
            fontSize: '10px'
        } : {
            width: '40px',
            height: '40px',
            fontSize: '12px'
        };

        button.css({
            'top': config.position.top,
            'right': config.position.right,
            'width': buttonSize.width,
            'height': buttonSize.height,
            'font-size': buttonSize.fontSize
        });
    }

    // 主逻辑
    $(document).ready(function() {
        // 等待页面加载完成
        setTimeout(() => {
            const floatingBtn = createFloatingButton();
            const dialog = createInputDialog();
            const overlay = $('#dialogOverlay');

            // 初始化配置界面
            $('#domainInput').val(config.domain);
            $('.size-btn').each(function() {
                const btn = $(this);
                if (btn.data('size') === config.buttonSize) {
                    btn.css({
                        'background': 'linear-gradient(135deg, var(--primarycolor), var(--primarycolor-dark))',
                        'color': 'white',
                        'border': 'none'
                    });
                } else {
                    btn.css({
                        'background': 'white',
                        'color': '#475569',
                        'border': '1.5px solid #cbd5e1'
                    });
                }
            });

            // 初始化模式状态
            if (config.batchMode) {
                $('#batchModeBtn').click();
            } else {
                $('#singleModeBtn').click();
            }

            // 配置切换
            $('#toggleConfig').click(function() {
                const configContent = $('#configContent');
                const isVisible = configContent.is(':visible');
                configContent.slideToggle(200);
                $(this).text(isVisible ? '显示配置' : '隐藏配置');
            });

            // 按钮大小选择
            $('.size-btn').click(function() {
                const size = $(this).data('size');
                $('.size-btn').css({
                    'background': 'white',
                    'color': '#475569',
                    'border': '1.5px solid #cbd5e1'
                });
                $(this).css({
                    'background': 'linear-gradient(135deg, var(--primarycolor), var(--primarycolor-dark))',
                    'color': 'white',
                    'border': 'none'
                });

                config.buttonSize = size;
                updateButtonAppearance();
                saveConfig(config);
            });

            // 保存配置
            $('#saveConfig').click(function() {
                config.domain = $('#domainInput').val().trim();
                saveConfig(config);
                showNotification('配置已保存！', 'success');
                updateResultLink();
            });

            // 重置位置
            $('#resetPosition').click(function() {
                config.position = { top: '50%', right: '20px' };
                saveConfig(config);
                updateButtonAppearance();
                showNotification('位置已重置！', 'success');
            });

            // 快速选择按钮悬停效果
            $('.quick-btn').hover(
                function() {
                    $(this).css({
                        'background': '#ffffff',
                        'border-color': 'var(--primarycolor-light)',
                        'color': 'linear-gradient(135deg, var(--primarycolor), var(--primarycolor-dark))',
                        'transform': 'translateY(-1px)',
                        'box-shadow': '0 2px 8px var(--primarycolor-lighter)'
                    });
                },
                function() {
                    $(this).css({
                        'background': '#f8fafc',
                        'border-color': '#e2e8f0',
                        'color': '#475569',
                        'transform': 'translateY(0)',
                        'box-shadow': 'none'
                    });
                }
            );

            // 快速选择按钮点击
            $('.quick-btn').click(function() {
                const path = $(this).data('path');
                if (config.batchMode) {
                    const currentText = $('#batchPathInput').val().trim();
                    $('#batchPathInput').val(currentText ? currentText + '\n' + path : path);
                    updateBatchResultLinks();
                } else {
                    $('#pathInput').val(path);
                    updateResultLink();
                }
            });

            // 输入框实时更新
            $('#pathInput').on('input', updateResultLink);
            $('#batchPathInput').on('input', updateBatchResultLinks);

            // 清空批量输入
            $('#clearBatchBtn').click(function() {
                $('#batchPathInput').val('');
                updateBatchResultLinks();
            });

            // 模式切换
            $('.mode-btn').click(function() {
                const mode = $(this).data('mode');
                config.batchMode = mode === 'batch';

                // 更新按钮样式
                $('.mode-btn').css({
                    'background': '#f1f5f9',
                    'color': '#64748b',
                    'border': '1.5px solid #e2e8f0'
                });
                $(this).css({
                    'background': 'linear-gradient(135deg, var(--primarycolor), var(--primarycolor-dark))',
                    'color': 'white',
                    'border': 'none'
                });

                // 切换显示区域
                if (config.batchMode) {
                    $('#singleInputSection').hide();
                    $('#batchInputSection').show();
                    $('#singleResultSection').hide();
                    $('#batchResultSection').show();
                    $('#resultCount').show();
                    $('#openBtn').hide();
                    $('#openBatchBtn').show();
                    updateBatchResultLinks();
                } else {
                    $('#singleInputSection').show();
                    $('#batchInputSection').hide();
                    $('#singleResultSection').show();
                    $('#batchResultSection').hide();
                    $('#resultCount').hide();
                    $('#openBtn').show();
                    $('#openBatchBtn').hide();
                    updateResultLink();
                }

                saveConfig(config);
            });

            // 更新结果链接（单条模式）
            function updateResultLink() {
                const path = $('#pathInput').val().trim();
                if (path) {
                    const link = generateLink(path);
                    $('#resultLink').val(link);
                } else {
                    $('#resultLink').val('');
                }
            }

            // 更新批量结果链接
            function updateBatchResultLinks() {
                const batchText = $('#batchPathInput').val().trim();
                if (batchText) {
                    const paths = batchText.split('\n').filter(line => line.trim());
                    const links = paths.map(path => generateLink(path.trim()));

                    $('#batchResultLinks').val(links.join('\n'));
                    $('#linkCount').text(links.length);

                    // 更新按钮状态
                    const hasLinks = links.length > 0;
                    $('#copyBatchBtn, #copyBatchNewlineBtn, #openBatchBtn').prop('disabled', !hasLinks);
                } else {
                    $('#batchResultLinks').val('');
                    $('#linkCount').text('0');
                    $('#copyBatchBtn, #copyBatchNewlineBtn, #openBatchBtn').prop('disabled', true);
                }
            }

            // 复制按钮悬停效果
            $('#copyBtn').hover(
                function() {
                    $(this).css({
                        'background': 'linear-gradient(135deg, var(--primarycolor), var(--primarycolor-dark))',
                        'transform': 'scale(1.05)'
                    });
                },
                function() {
                    $(this).css({
                        'background': 'var(--primarycolor-dark)',
                        'transform': 'scale(1)'
                    });
                }
            );

            // 复制链接
            $('#copyBtn').click(function() {
                const link = $('#resultLink').val();
                if (link) {
                    GM_setClipboard(link);
                    showNotification('链接已复制到剪贴板！', 'success');

                    // 复制反馈动画
                    const originalText = $(this).text();
                    $(this).text('已复制!');
                    setTimeout(() => {
                        $(this).text(originalText);
                    }, 1500);
                }
            });

            // 批量复制链接（逗号分隔）
            $('#copyBatchBtn').click(function() {
                const links = $('#batchResultLinks').val();
                if (links) {
                    GM_setClipboard(links);
                    showNotification(`已复制 ${links.split('\n').length} 个链接到剪贴板！`, 'success');

                    // 复制反馈动画
                    const originalText = $(this).text();
                    $(this).text('已复制!');
                    setTimeout(() => {
                        $(this).text(originalText);
                    }, 1500);
                }
            });

            // 批量复制链接（换行分隔）
            $('#copyBatchNewlineBtn').click(function() {
                const links = $('#batchResultLinks').val();
                if (links) {
                    GM_setClipboard(links);
                    showNotification(`已复制 ${links.split('\n').length} 个链接到剪贴板！`, 'success');

                    // 复制反馈动画
                    const originalText = $(this).text();
                    $(this).text('已复制!');
                    setTimeout(() => {
                        $(this).text(originalText);
                    }, 1500);
                }
            });

            // 批量打开链接
            $('#openBatchBtn').click(function() {
                const links = $('#batchResultLinks').val();
                if (links) {
                    const linkArray = links.split('\n').filter(link => link.trim());
                    linkArray.forEach(link => {
                        window.open(link, '_blank');
                    });
                    showNotification(`正在批量打开 ${linkArray.length} 个链接...`, 'info');
                    dialog.hide();
                    overlay.hide();
                }
            });

            // 打开按钮悬停效果
            $('#openBtn').hover(
                function() {
                    $(this).css({
                        'transform': 'translateY(-1px)',
                        'box-shadow': '0 4px 15px var(--primarycolor-light)'
                    });
                },
                function() {
                    $(this).css({
                        'transform': 'translateY(0)',
                        'box-shadow': 'none'
                    });
                }
            );

            // 直接打开链接
            $('#openBtn').click(function() {
                const link = $('#resultLink').val();
                if (link) {
                    window.open(link, '_blank');
                    showNotification('正在打开链接...', 'info');
                    dialog.hide();
                    overlay.hide();
                }
            });

            // 关闭按钮悬停效果
            $('#closeBtn').hover(
                function() {
                    $(this).css({
                        'background': '#e2e8f0',
                        'border-color': '#cbd5e1'
                    });
                },
                function() {
                    $(this).css({
                        'background': '#f1f5f9',
                        'border-color': '#e2e8f0'
                    });
                }
            );

            // 关闭对话框
            $('#closeBtn, #dialogOverlay').click(function() {
                dialog.hide();
                overlay.hide();
            });

            // 阻止对话框内容点击关闭
            $('#linkDialog').click(function(e) {
                e.stopPropagation();
            });

            // 回车键快速生成
            $('#pathInput').keypress(function(e) {
                if (e.which === 13) { // Enter键
                    updateResultLink();
                    $('#openBtn').click();
                }
            });

            // 输入框聚焦效果
            $('#pathInput').focus(function() {
                $(this).css({
                    'border-color': 'var(--primarycolor-light)',
                    'background': '#ffffff',
                    'box-shadow': '0 0 0 2px var(--primarycolor-lighter)'
                });
            }).blur(function() {
                $(this).css({
                    'border-color': 'var(--primarycolor-dark)',
                    'background': '#fafafa',
                    'box-shadow': 'none'
                });
            });

            // 初始更新一次
            updateResultLink();
        }, 100);
    });

})();