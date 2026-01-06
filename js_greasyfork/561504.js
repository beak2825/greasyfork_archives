// ==UserScript==
// @name         筛选 Transmission 中给 HDB 辅种失败的种子
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  筛选 Transmission 中给 HDB 辅种失败的种子，可以删除
// @author       江畔
// @match        *://*/transmission*/*
// @grant        GM_xmlhttpRequest
// @connect      *
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561504/%E7%AD%9B%E9%80%89%20Transmission%20%E4%B8%AD%E7%BB%99%20HDB%20%E8%BE%85%E7%A7%8D%E5%A4%B1%E8%B4%A5%E7%9A%84%E7%A7%8D%E5%AD%90.user.js
// @updateURL https://update.greasyfork.org/scripts/561504/%E7%AD%9B%E9%80%89%20Transmission%20%E4%B8%AD%E7%BB%99%20HDB%20%E8%BE%85%E7%A7%8D%E5%A4%B1%E8%B4%A5%E7%9A%84%E7%A7%8D%E5%AD%90.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Transmission RPC配置 - 动态获取
    let TRANSMISSION_RPC_URL = null;
    let sessionId = null;

    // 获取Transmission RPC URL
    function getTransmissionRpcUrl() {
        if (TRANSMISSION_RPC_URL) return TRANSMISSION_RPC_URL;

        // 从当前页面URL提取Transmission服务器信息
        const currentUrl = window.location.href;

        // 尝试从URL中提取域名和端口
        const urlMatch = currentUrl.match(/^([^:]+:\/\/)([^:\/]+)(?::(\d+))?/);
        if (urlMatch) {
            const protocol = urlMatch[1]; // http:// 或 https://
            const domain = urlMatch[2];   // 域名
            const port = urlMatch[3] || (protocol === 'https://' ? '443' : '80');

            // 构造RPC URL，默认为9091端口（Transmission默认端口）
            const rpcPort = port === '80' || port === '443' ? '9091' : port;
            TRANSMISSION_RPC_URL = `${protocol}${domain}:${rpcPort}/transmission/rpc`;

            console.log('构造的RPC URL:', TRANSMISSION_RPC_URL);
        } else {
            // 备用方案：直接使用当前域名的9091端口
            const fallbackUrl = `http://${window.location.hostname}:9091/transmission/rpc`;
            TRANSMISSION_RPC_URL = fallbackUrl;
            console.log('使用备用RPC URL:', TRANSMISSION_RPC_URL);
        }

        return TRANSMISSION_RPC_URL;
    }

    // 手动设置session ID的函数（供HTML按钮调用）
    window.setManualSessionId = function() {
        const input = document.getElementById('manual-session-id');
        if (input && input.value.trim()) {
            sessionId = input.value.trim();
            console.log('手动设置session ID:', sessionId);

            // 隐藏错误提示，尝试重新获取种子
            const resultDiv = document.getElementById('transmission-filter-result');
            if (resultDiv) {
                resultDiv.remove();
            }

            // 重新触发筛选
            document.querySelector('#transmission-filter-button').click();
        } else {
            alert('请输入有效的Session ID');
        }
    };

    // 获取session ID
    function getSessionId(callback) {
        GM_xmlhttpRequest({
            method: 'POST',
            url: getTransmissionRpcUrl(),
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                method: 'session-get'
            }),
            onload: function(response) {
                // 无论什么状态码，都尝试从响应头获取session ID
                console.log('响应头:', response.responseHeaders);
                console.log('响应状态:', response.status);

                // 从响应头提取session ID
                let extractedSessionId = null;
                const headers = response.responseHeaders.split('\n');
                for (const header of headers) {
                    if (header.toLowerCase().startsWith('x-transmission-session-id:')) {
                        extractedSessionId = header.split(':')[1].trim();
                        break;
                    }
                }

                if (extractedSessionId) {
                    sessionId = extractedSessionId;
                    console.log('获取到session ID:', sessionId);
                } else {
                    console.log('未找到session ID in headers:', response.responseHeaders);
                }

                if (response.status === 200) {
                    // 成功获取session信息
                    console.log('session-get成功');
                    callback();
                } else if (response.status === 409) {
                    // 409表示需要session ID，但我们已经从响应头获取了
                    if (sessionId) {
                        callback();
                    } else {
                        console.error('409响应但未找到session ID');
                        console.error('完整响应头:', response.responseHeaders);

                        // 尝试一些备用的解析方式
                        const altMatch = response.responseHeaders.match(/x-transmission-session-id:\s*([^\r\n;]+)/i);
                        if (altMatch) {
                            sessionId = altMatch[1].trim();
                            console.log('使用备用方法获取session ID:', sessionId);
                            callback();
                        } else {
                            showResult('无法获取Transmission会话ID (409)。<br>' +
                                     '请检查Transmission是否正常运行，或尝试刷新页面重试。<br>' +
                                     '<small>调试信息已在控制台输出</small><br><br>' +
                                     '<div style="background: #f8f9fa; padding: 10px; border-radius: 4px; margin: 10px 0;">' +
                                     '<strong>如何获取Session ID：</strong><br>' +
                                     `1. 打开浏览器访问: <code>${getTransmissionRpcUrl()}</code><br>` +
                                     '2. 发送POST请求，查看响应头的 <code>X-Transmission-Session-Id</code><br>' +
                                     `3. 或使用curl: <code>curl -I ${getTransmissionRpcUrl()}</code>` +
                                     '</div>' +
                                     '<input type="text" id="manual-session-id" placeholder="手动输入Session ID" style="width: 300px; padding: 5px;"> ' +
                                     '<button onclick="setManualSessionId()">设置Session ID</button>');
                        }
                    }
                } else {
                    console.error('获取session失败:', response.status, response.responseText);
                    showResult('获取Transmission会话失败: ' + response.status);
                }
            },
            onerror: function(error) {
                console.error('获取session错误:', error);
                showResult('连接Transmission失败，请检查网络或Transmission是否运行');
            }
        });
    }

    // 获取torrents列表
    function getTorrents(callback) {
        if (!sessionId) {
            getSessionId(() => getTorrents(callback));
            return;
        }

        GM_xmlhttpRequest({
            method: 'POST',
            url: getTransmissionRpcUrl(),
            headers: {
                'Content-Type': 'application/json',
                'X-Transmission-Session-Id': sessionId
            },
            data: JSON.stringify({
                method: 'torrent-get',
                arguments: {
                    fields: ['id', 'name', 'downloadDir', 'trackers', 'trackerStats', 'totalSize']
                }
            }),
            onload: function(response) {
                // 检查响应头是否有新的session ID
                console.log('torrent-get响应头:', response.responseHeaders);
                console.log('torrent-get响应状态:', response.status);

                // 从响应头提取session ID
                let extractedSessionId = null;
                const headers = response.responseHeaders.split('\n');
                for (const header of headers) {
                    if (header.toLowerCase().startsWith('x-transmission-session-id:')) {
                        extractedSessionId = header.split(':')[1].trim();
                        break;
                    }
                }

                if (extractedSessionId) {
                    sessionId = extractedSessionId;
                    console.log('更新session ID:', sessionId);
                }

                if (response.status === 200) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.result === 'success') {
                            callback(data.arguments.torrents);
                        } else {
                            console.error('RPC调用失败:', data.result);
                            showResult('获取种子列表失败: ' + data.result);
                        }
                    } catch (e) {
                        console.error('解析响应失败:', e);
                        showResult('解析Transmission响应失败');
                    }
                } else if (response.status === 409) {
                    // Session ID过期，需要重新获取
                    console.log('Session ID过期，重新获取');
                    sessionId = null;
                    getSessionId(() => getTorrents(callback));
                } else {
                    console.error('获取torrents失败:', response.status, response.responseText);
                    showResult('获取种子列表失败: HTTP ' + response.status);
                }
            },
            onerror: function(error) {
                console.error('获取torrents错误:', error);
                showResult('连接Transmission失败');
            }
        });
    }

    // 格式化文件大小
    function formatSize(bytes) {
        if (!bytes || bytes === 0) return '0 B';

        const units = ['B', 'KB', 'MB', 'GB', 'TB'];
        let size = bytes;
        let unitIndex = 0;

        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }

        return `${size.toFixed(1)} ${units[unitIndex]}`;
    }

    // 检查tracker是否包含hdbits
    function hasHdbitsTracker(torrent) {
        // 检查trackers字段
        if (torrent.trackers && Array.isArray(torrent.trackers)) {
            return torrent.trackers.some(tracker =>
                tracker.announce && tracker.announce.toLowerCase().includes('hdbits')
            );
        }

        // 检查trackerStats字段（更常见）
        if (torrent.trackerStats && Array.isArray(torrent.trackerStats)) {
            return torrent.trackerStats.some(stat =>
                stat.announce && stat.announce.toLowerCase().includes('hdbits')
            );
        }

        return false;
    }

    // 筛选种子
    function filterTorrents(torrents) {
        console.log('开始筛选种子，总数:', torrents.length);

        // 按文件大小分组
        const sizeGroups = {};
        torrents.forEach(torrent => {
            // 使用文件大小作为分组键，只使用totalSize
            const size = torrent.totalSize || 0;
            const key = size.toString();


            if (!sizeGroups[key]) {
                sizeGroups[key] = [];
            }
            sizeGroups[key].push(torrent);
        });

        console.log('文件大小分组:', Object.keys(sizeGroups).length, '个分组');
        console.log('分组详情:', Object.keys(sizeGroups).map(key => ({
            size: key,
            formattedSize: formatSize(parseInt(key) || 0),
            count: sizeGroups[key].length
        })));

        const filtered = [];
        let hdbitsCount = 0;
        let noHdbitsCount = 0;

        // 检查每个种子
        torrents.forEach(torrent => {
            const size = torrent.totalSize || 0;
            const key = size.toString();
            const groupTorrents = sizeGroups[key];

            // 检查当前种子是否有hdbits tracker
            const hasHdbits = hasHdbitsTracker(torrent);
            if (hasHdbits) hdbitsCount++;
            else noHdbitsCount++;

            // 检查同文件大小的所有种子是否有hdbits tracker
            const groupHasHdbits = groupTorrents.some(t => hasHdbitsTracker(t));

            // 条件：当前种子没有hdbits且同文件大小所有种子都没有hdbits
            if (!hasHdbits && !groupHasHdbits) {
                filtered.push(torrent);
            }
        });

        console.log('种子统计:', { hdbitsCount, noHdbitsCount, filteredCount: filtered.length });
        console.log('分组统计:', {
            totalGroups: Object.keys(sizeGroups).length,
            groupsWithHdbits: Object.values(sizeGroups).filter(group => group.some(t => hasHdbitsTracker(t))).length,
            groupsWithoutHdbits: Object.values(sizeGroups).filter(group => !group.some(t => hasHdbitsTracker(t))).length
        });

        return filtered;
    }

    // 删除筛选出的种子
    function deleteFilteredTorrents(filteredTorrents) {
        if (!filteredTorrents || filteredTorrents.length === 0) {
            alert('没有种子需要删除');
            return;
        }

        if (!confirm(`确定要删除 ${filteredTorrents.length} 个种子及其文件吗？此操作不可撤销！`)) {
            return;
        }

        console.log('开始删除种子:', filteredTorrents.length, '个');
        console.log('种子IDs:', filteredTorrents.map(t => t.id));

        const torrentIds = filteredTorrents.map(t => t.id);

        GM_xmlhttpRequest({
            method: 'POST',
            url: getTransmissionRpcUrl(),
            headers: {
                'Content-Type': 'application/json',
                'X-Transmission-Session-Id': sessionId
            },
            data: JSON.stringify({
                method: 'torrent-remove',
                arguments: {
                    ids: torrentIds,
                    'delete-local-data': true  // 删除本地文件
                }
            }),
            onload: function(response) {
                console.log('删除请求响应:', response.status);
                console.log('删除响应内容:', response.responseText);

                // 检查响应头是否有新的session ID
                const sessionHeader = response.responseHeaders.split('\n').find(header =>
                    header.toLowerCase().startsWith('x-transmission-session-id:')
                );
                if (sessionHeader) {
                    sessionId = sessionHeader.split(':')[1].trim();
                    console.log('更新session ID:', sessionId);
                }

                if (response.status === 200) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.result === 'success') {
                            alert(`成功删除 ${filteredTorrents.length} 个种子及其文件`);
                            // 关闭结果窗口
                            const resultDiv = document.getElementById('transmission-filter-result');
                            if (resultDiv) {
                                resultDiv.remove();
                            }
                        } else {
                            alert('删除失败: ' + data.result);
                        }
                    } catch (e) {
                        console.error('解析删除响应失败:', e);
                        alert('删除响应解析失败');
                    }
                } else if (response.status === 409) {
                    console.log('Session ID过期，重新删除');
                    getSessionId(() => deleteFilteredTorrents(filteredTorrents));
                } else {
                    alert('删除请求失败: HTTP ' + response.status);
                }
            },
            onerror: function(error) {
                console.error('删除请求错误:', error);
                alert('删除请求发送失败，请检查网络连接');
            }
        });
    }

    // 显示结果
    function showResult(content, filteredTorrents = []) {
        // 创建或更新结果显示区域
        let resultDiv = document.getElementById('transmission-filter-result');
        if (!resultDiv) {
            resultDiv = document.createElement('div');
            resultDiv.id = 'transmission-filter-result';
            resultDiv.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                border: 1px solid #ccc;
                border-radius: 8px;
                padding: 20px;
                max-width: 80%;
                max-height: 80%;
                overflow: auto;
                z-index: 10000;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            `;
            document.body.appendChild(resultDiv);
        }

        resultDiv.innerHTML = content;

        // 添加关闭按钮
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '关闭';
        closeBtn.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            padding: 5px 10px;
            background: #f0f0f0;
            border: 1px solid #ccc;
            border-radius: 4px;
            cursor: pointer;
        `;
        closeBtn.onclick = () => resultDiv.remove();
        resultDiv.appendChild(closeBtn);

        // 添加删除按钮事件
        const deleteBtn = resultDiv.querySelector('#delete-filtered-torrents');
        if (deleteBtn) {
            deleteBtn.onclick = () => deleteFilteredTorrents(filteredTorrents);
        }
    }

    // 创建按钮
    function createFilterButton() {
        const button = document.createElement('button');
        button.id = 'transmission-filter-button';
        button.textContent = '筛选种子';
        button.style.cssText = `
            position: fixed;
            top: 50%;
            right: 20px;
            transform: translateY(-50%);
            padding: 12px 20px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            box-shadow: 0 2px 8px rgba(0,123,255,0.3);
            z-index: 9999;
        `;

        button.onmouseover = () => {
            button.style.background = '#0056b3';
        };

        button.onmouseout = () => {
            button.style.background = '#007bff';
        };

        button.onclick = () => {
            button.textContent = '筛选中...';
            button.disabled = true;

            console.log('开始获取种子列表...');

            getTorrents(torrents => {
                console.log('获取到种子列表:', torrents.length, '个种子');

                const filtered = filterTorrents(torrents);
                console.log('筛选出种子:', filtered.length, '个');

                let result = `<h3>筛选结果</h3>`;
                result += `<p>总种子数: ${torrents.length}</p>`;
                result += `<p>筛选出种子数: ${filtered.length}</p>`;

                if (filtered.length > 0) {
                    result += `<h4>筛选出的种子 (${filtered.length}个):</h4>`;
                    result += `<div style="margin: 10px 0;">`;
                    result += `<button id="delete-filtered-torrents" style="background: #dc3545; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">删除所有筛选种子及文件</button>`;
                    result += `</div>`;
                    result += `<div style="max-height: 400px; overflow-y: auto; border: 1px solid #ddd; border-radius: 4px;">`;
                    result += `<table style="width: 100%; border-collapse: collapse;">`;
                    result += `<thead style="position: sticky; top: 0; background: #f8f9fa; z-index: 1; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">`;
                    result += `<tr>`;
                    result += `<th style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">ID</th>`;
                    result += `<th style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">种子名称</th>`;
                    result += `<th style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">大小</th>`;
                    result += `<th style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">Trackers</th>`;
                    result += `</tr></thead>`;
                    result += `<tbody>`;

                    filtered.forEach(torrent => {
                        const size = torrent.totalSize || 0;
                        const sizeStr = size > 0 ? formatSize(size) : '未知';
                        result += `<tr style="border-bottom: 1px solid #eee;">`;
                        result += `<td style="padding: 8px; white-space: nowrap;">${torrent.id}</td>`;
                        result += `<td style="padding: 8px; white-space: nowrap;">${torrent.name}</td>`;
                        result += `<td style="padding: 8px; white-space: nowrap;">${sizeStr}</td>`;
                        // 显示tracker信息
                        let trackerText = '无tracker';
                        if (torrent.trackers && Array.isArray(torrent.trackers) && torrent.trackers.length > 0) {
                            trackerText = torrent.trackers.slice(0, 2).map(t => {
                                const domain = t.announce ? t.announce.split('/')[2] : '未知';
                                return domain.replace(/^tracker\./, ''); // 去掉tracker.前缀
                            }).join('; ');
                        } else if (torrent.trackerStats && Array.isArray(torrent.trackerStats) && torrent.trackerStats.length > 0) {
                            trackerText = torrent.trackerStats.slice(0, 2).map(t => {
                                const domain = t.announce ? t.announce.split('/')[2] : '未知';
                                return domain.replace(/^tracker\./, ''); // 去掉tracker.前缀
                            }).join('; ');
                        }
                        result += `<td style="padding: 8px; font-size: 11px; color: #666; white-space: nowrap;" title="${trackerText}">${trackerText}</td>`;
                        result += `</tr>`;
                    });

                    result += `</tbody></table>`;
                    result += `</div>`;
                } else {
                    result += `<p>没有找到符合条件的种子</p>`;
                    result += `<p><small>条件：tracker不包含"hdbits"且同文件大小所有种子都不包含"hdbits"</small></p>`;
                }

                showResult(result, filtered);

                button.textContent = '筛选种子';
                button.disabled = false;
            });
        };

        document.body.appendChild(button);
    }

    // 初始化
    function init() {
        // 检查是否在Transmission相关页面
        const currentUrl = window.location.href.toLowerCase();
        const hostname = window.location.hostname.toLowerCase();

        console.log('Transmission Filter: 初始化检查');
        console.log('当前页面URL:', window.location.href);
        console.log('当前页面hostname:', hostname);
        console.log('检查transmission关键词:', currentUrl.includes('transmission'));

        // 检查是否是Transmission页面
        const isTransmissionPage = currentUrl.includes('transmission') ||
                                  hostname.includes('transmission') ||
                                  currentUrl.includes('9091'); // 默认Transmission端口

        if (isTransmissionPage) {
            console.log('检测到Transmission页面，添加筛选按钮');
            console.log('RPC URL:', getTransmissionRpcUrl());
            createFilterButton();
        } else {
            console.log('当前页面不是Transmission页面，跳过初始化');
        }
    }


    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
