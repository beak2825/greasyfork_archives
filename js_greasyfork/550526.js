// ==UserScript==
// @name         Smogon自动点赞工具 v1.2
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  自动点赞Smogon用户的历史发帖，支持自动翻到older results，移除返回结果检查，增强错误调试功能
// @author       Xuwu
// @match        https://www.smogon.com/forums/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// @grant        GM_log
// @connect      smogon.com
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/550526/Smogon%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E%E5%B7%A5%E5%85%B7%20v12.user.js
// @updateURL https://update.greasyfork.org/scripts/550526/Smogon%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E%E5%B7%A5%E5%85%B7%20v12.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置
    const config = {
        minDelay: 5000, // 最小延迟(毫秒)
        maxDelay: 10000, // 最大延迟(毫秒)
        timeout: 15000, // 请求超时时间(毫秒)
        debugMode: true // 启用调试模式
    };

    // 创建UI
    function createUI() {
        // 主容器
        const container = $('<div>', {
            id: 'smogon-auto-liker',
            css: {
                position: 'fixed',
                top: '20px',
                right: '20px',
                background: '#fff',
                border: '2px solid #3498db',
                borderRadius: '8px',
                padding: '15px',
                zIndex: '9999',
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                minWidth: '300px',
                fontFamily: 'Arial, sans-serif'
            }
        });

        // 标题
        const title = $('<h3>', {
            text: 'Smogon自动点赞工具 v1.2',
            css: {
                margin: '0 0 15px 0',
                color: '#3498db',
                borderBottom: '1px solid #eee',
                paddingBottom: '10px'
            }
        });

        // URL输入
        const urlLabel = $('<label>', {
            text: '用户发帖历史URL:',
            css: {
                display: 'block',
                marginBottom: '5px',
                fontWeight: 'bold'
            }
        });

        const urlInput = $('<input>', {
            type: 'text',
            id: 'smogon-user-url',
            placeholder: '例如: https://www.smogon.com/forums/search/63660517/?c[users]=xuwu&o=date',
            css: {
                width: '100%',
                padding: '8px',
                marginBottom: '15px',
                boxSizing: 'border-box',
                border: '1px solid #ddd',
                borderRadius: '4px'
            }
        });

        // 页数输入
        const pagesLabel = $('<label>', {
            text: '要处理的页数:',
            css: {
                display: 'block',
                marginBottom: '5px',
                fontWeight: 'bold'
            }
        });

        const pagesInput = $('<input>', {
            type: 'number',
            id: 'smogon-pages',
            value: '1',
            min: '1',
            max: '50',
            css: {
                width: '100%',
                padding: '8px',
                marginBottom: '15px',
                boxSizing: 'border-box',
                border: '1px solid #ddd',
                borderRadius: '4px'
            }
        });

        // 调试模式开关
        const debugLabel = $('<label>', {
            text: '调试模式:',
            css: {
                display: 'block',
                marginBottom: '5px',
                fontWeight: 'bold'
            }
        });

        const debugCheckbox = $('<input>', {
            type: 'checkbox',
            id: 'smogon-debug',
            checked: config.debugMode,
            css: {
                marginRight: '5px'
            }
        }).change(function() {
            config.debugMode = this.checked;
            GM_setValue('debug_mode', this.checked);
        });

        const debugContainer = $('<div>', {
            css: {
                marginBottom: '15px'
            }
        }).append(debugCheckbox, $('<span>', {text: '启用详细调试信息'}));

        // 按钮容器
        const buttonContainer = $('<div>', {
            css: {
                display: 'flex',
                justifyContent: 'space-between'
            }
        });

        // 开始按钮
        const startButton = $('<button>', {
            id: 'smogon-start',
            text: '开始点赞',
            css: {
                padding: '10px 15px',
                background: '#2ecc71',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                flex: '1',
                marginRight: '5px'
            }
        });

        // 停止按钮
        const stopButton = $('<button>', {
            id: 'smogon-stop',
            text: '停止',
            css: {
                padding: '10px 15px',
                background: '#e74c3c',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                flex: '1',
                marginLeft: '5px',
                display: 'none'
            }
        });

        // 状态显示
        const status = $('<div>', {
            id: 'smogon-status',
            text: '等待开始...',
            css: {
                marginTop: '15px',
                padding: '10px',
                background: '#f9f9f9',
                borderRadius: '4px',
                fontSize: '14px',
                maxHeight: '150px',
                overflowY: 'auto'
            }
        });

        // 组装UI
        buttonContainer.append(startButton, stopButton);
        container.append(
            title,
            urlLabel,
            urlInput,
            pagesLabel,
            pagesInput,
            debugLabel,
            debugContainer,
            buttonContainer,
            status
        );

        // 添加到页面
        $('body').append(container);

        // 保存上次使用的URL和调试模式设置
        const lastUrl = GM_getValue('last_user_url', '');
        const debugMode = GM_getValue('debug_mode', config.debugMode);

        if (lastUrl) {
            urlInput.val(lastUrl);
        }
        debugCheckbox.prop('checked', debugMode);
        config.debugMode = debugMode;

        // 事件处理
        startButton.click(startLiking);
        stopButton.click(stopLiking);
    }

    // 状态变量
    let isRunning = false;
    let currentPage = 1;
    let totalPages = 1;
    let postIds = [];
    let processedPosts = 0;
    let baseUrl = ''; // 当前base URL，支持翻到older results后更新

    // 开始点赞
    function startLiking() {
        if (isRunning) return;

        baseUrl = $('#smogon-user-url').val().trim();
        if (!baseUrl) {
            updateStatus('错误: 请输入用户发帖历史URL', 'error');
            return;
        }

        // 保存URL供下次使用
        GM_setValue('last_user_url', baseUrl);

        totalPages = parseInt($('#smogon-pages').val()) || 1;
        if (totalPages < 1) totalPages = 1;

        isRunning = true;
        $('#smogon-start').hide();
        $('#smogon-stop').show();
        postIds = [];
        processedPosts = 0;
        currentPage = 1;

        updateStatus('开始获取帖子列表...');
        fetchPostIds(baseUrl);
    }

    // 停止点赞
    function stopLiking() {
        isRunning = false;
        $('#smogon-start').show();
        $('#smogon-stop').hide();
        updateStatus('操作已停止');
    }

    // 获取帖子ID
    function fetchPostIds(url) {
        if (!isRunning) return;

        updateStatus(`正在获取第 ${currentPage}/${totalPages} 页的帖子...`);

        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            timeout: config.timeout,
            onload: function(response) {
                if (response.status === 200) {
                    // 解析HTML获取帖子链接
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, 'text/html');

                    // 查找所有帖子链接
                    const postLinks = doc.querySelectorAll('a[href*="/post-"]');
                    const pagePostIds = [];

                    postLinks.forEach(link => {
                        const href = link.getAttribute('href');
                        const postIdMatch = href.match(/\/post-(\d+)/);
                        if (postIdMatch && postIdMatch[1]) {
                            pagePostIds.push(postIdMatch[1]);
                        }
                    });

                    postIds = postIds.concat(pagePostIds);
                    updateStatus(`第 ${currentPage} 页找到 ${pagePostIds.length} 个帖子，总共 ${postIds.length} 个帖子`);

                    if (config.debugMode) {
                        debugLog(`第 ${currentPage} 页帖子ID: ${pagePostIds.join(', ')}`);
                    }

                    // 检查是否是第10页，并查找 "Show older results" 按钮
                    if (currentPage % 10 === 0) {
                        const olderButton = doc.querySelector('a.button[href*="older"]');
                        if (olderButton) {
                            const olderHref = olderButton.getAttribute('href');
                            if (olderHref) {
                                baseUrl = 'https://www.smogon.com' + olderHref;
                                currentPage = 0; // 重置为下一组的第1页
                                updateStatus(`检测到 "Show older results" 链接，切换到更旧结果: ${baseUrl}`);
                                if (config.debugMode) {
                                    debugLog(`切换到 older results URL: ${baseUrl}`);
                                }
                            }
                        }
                    }

                    // 继续下一页
                    if (currentPage < totalPages) {
                        currentPage++;
                        // 构建下一页URL
                        let nextPageUrl;
                        if (baseUrl.includes('?')) {
                            nextPageUrl = baseUrl.replace(/([?&]page=)\d+/, `$1${currentPage}`);
                            if (nextPageUrl === baseUrl) {
                                nextPageUrl = baseUrl + (baseUrl.includes('?') ? '&' : '?') + `page=${currentPage}`;
                            }
                        } else {
                            nextPageUrl = baseUrl + `?page=${currentPage}`;
                        }

                        // 延迟后获取下一页
                        setTimeout(() => fetchPostIds(nextPageUrl), getRandomDelay());
                    } else {
                        // 开始点赞所有帖子
                        updateStatus(`开始点赞 ${postIds.length} 个帖子...`);
                        processNextPost();
                    }
                } else {
                    updateStatus(`错误: 获取页面失败 (HTTP ${response.status})`, 'error');
                    debugLog(`页面响应: ${response.responseText.substring(0, 500)}...`);
                    stopLiking();
                }
            },
            onerror: function(error) {
                updateStatus('错误: 获取页面失败 - ' + error, 'error');
                stopLiking();
            },
            ontimeout: function() {
                updateStatus('错误: 获取页面超时', 'error');
                stopLiking();
            }
        });
    }

    // 处理下一个帖子
    function processNextPost() {
        if (!isRunning || processedPosts >= postIds.length) {
            updateStatus('点赞完成!');
            stopLiking();
            return;
        }

        const postId = postIds[processedPosts];
        updateStatus(`正在处理帖子 ${processedPosts + 1}/${postIds.length} (ID: ${postId})...`);

        // 点赞URL
        const likeUrl = `https://www.smogon.com/forums/posts/${postId}/react?reaction_id=1`;

        GM_xmlhttpRequest({
            method: 'GET',
            url: likeUrl,
            timeout: config.timeout,
            onload: function(response) {
                if (response.status === 200) {
                    if (config.debugMode) {
                        debugLog(`点赞页面响应: ${response.responseText.substring(0, 500)}...`);
                    }

                    // 解析HTML获取CSRF token
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, 'text/html');
                    const csrfToken = doc.querySelector('input[name="_xfToken"]');

                    if (csrfToken) {
                        const token = csrfToken.value;

                        if (config.debugMode) {
                            debugLog(`获取到CSRF Token: ${token.substring(0, 30)}...`);
                        }

                        // 检查是否有Confirm按钮
                        const confirmButton = doc.querySelector('button.button--icon--confirm');
                        if (!confirmButton) {
                            debugLog('未找到Confirm按钮，可能已点赞或无权操作');
                        }

                        // 发送点赞请求
                        sendLikeRequest(likeUrl, token, postId);
                    } else {
                        updateStatus(`错误: 无法获取CSRF token (帖子 ${postId})`, 'error');
                        debugLog(`页面内容: ${response.responseText.substring(0, 500)}...`);
                        processedPosts++;
                        setTimeout(processNextPost, getRandomDelay());
                    }
                } else {
                    updateStatus(`错误: 获取点赞页面失败 (帖子 ${postId}, HTTP ${response.status})`, 'error');
                    processedPosts++;
                    setTimeout(processNextPost, getRandomDelay());
                }
            },
            onerror: function(error) {
                updateStatus(`错误: 获取点赞页面失败 (帖子 ${postId}) - ${error}`, 'error');
                processedPosts++;
                setTimeout(processNextPost, getRandomDelay());
            },
            ontimeout: function() {
                updateStatus(`错误: 获取点赞页面超时 (帖子 ${postId})`, 'error');
                processedPosts++;
                setTimeout(processNextPost, getRandomDelay());
            }
        });
    }

    // 发送点赞请求（移除返回结果检查）
    function sendLikeRequest(url, token, postId) {
        // 准备表单数据
        const formData = new URLSearchParams();
        formData.append('_xfToken', token);
        formData.append('_xfWithData', '1');
        formData.append('_xfResponseType', 'json');

        GM_xmlhttpRequest({
            method: 'POST',
            url: url,
            data: formData.toString(),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'X-Requested-With': 'XMLHttpRequest'
            },
            timeout: config.timeout,
            onload: function(response) {
                if (config.debugMode) {
                    debugLog(`点赞响应: ${response.responseText}`);
                }

                if (response.status === 200) {
                    updateStatus(`成功点赞帖子 ${postId} (HTTP 200)`);
                } else {
                    updateStatus(`点赞失败 (帖子 ${postId}, HTTP ${response.status})`, 'error');
                    debugLog(`响应内容: ${response.responseText.substring(0, 500)}...`);
                }

                processedPosts++;
                setTimeout(processNextPost, getRandomDelay());
            },
            onerror: function(error) {
                updateStatus(`错误: 点赞请求失败 (帖子 ${postId}) - ${error}`, 'error');
                processedPosts++;
                setTimeout(processNextPost, getRandomDelay());
            },
            ontimeout: function() {
                updateStatus(`错误: 点赞请求超时 (帖子 ${postId})`, 'error');
                processedPosts++;
                setTimeout(processNextPost, getRandomDelay());
            }
        });
    }

    // 获取随机延迟
    function getRandomDelay() {
        return Math.floor(Math.random() * (config.maxDelay - config.minDelay + 1)) + config.minDelay;
    }

    // 更新状态
    function updateStatus(message, type = 'info') {
        const status = $('#smogon-status');
        const now = new Date().toLocaleTimeString();
        const color = type === 'error' ? '#e74c3c' : (type === 'success' ? '#2ecc71' : '#34495e');

        status.prepend(`<div style="color: ${color}">[${now}] ${message}</div>`);

        // 限制显示的行数
        const lines = status.children();
        if (lines.length > 20) {
            lines.last().remove();
        }

        // 限制显示的行数
        if (config.debugMode) {
            console.log(`[SmogonAutoLiker] ${message}`);
        }
    }

    // 调试日志
    function debugLog(message) {
        if (config.debugMode) {
            console.log(`[SmogonAutoLiker DEBUG] ${message}`);

            // 也显示在状态区域
            const status = $('#smogon-status');
            const now = new Date().toLocaleTimeString();
            status.prepend(`<div style="color: #7f8c8d; font-size: 12px;">[${now} DEBUG] ${message}</div>`);

            // 限制显示的行数
            const lines = status.children();
            if (lines.length > 25) {
                lines.slice(25).remove();
            }
        }
    }

    // 初始化
    $(document).ready(function() {
        // 等待页面加载完成
        setTimeout(createUI, 1000);
    });
})();