// ==UserScript==
// @name         网络书签管理器 - WebDAV云同步版
// @namespace    https://www.cckdn.cn/
// @version      3.9.7
// @description  支持WebDAV的云同步的网络书签管理器，支持多设备多平台（iPhone、Android、windows），使用HTML格式存储，支持多级分类管理，书签批量导入，可拖动按钮，自动同步，完美适配移动端与电脑端。
// @author       云码酷-CCKDN
// @homepageURL  http://www.cckdn.cn/thread-3175-1-1.html
// @supportURL   https://github.com/superman610/WebDAV-Bookmark
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_addValueChangeListener
// @connect      dav.jianguoyun.com
// @connect      www.cckdn.cn
// @connect      *
// @icon         data:image/svg+xml;charset=utf-8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPCEtLSBHZW5lcmF0b3I6IHZpc2lvbmNvcnRleCBWVHJhY2VyIDAuNi4zIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCI+CjxwYXRoIGQ9Ik0wLDAgTDc4LDAgTDc4LDEyMCBMNzYsMTIwIEw3NiwxMTkgTDc1LDExOSBMNzUsMTE4IEw3NCwxMTggTDc0LDExNyBMNzMsMTE3IEw3MywxMTYgTDcxLDExNiBMNzEsMTE1IEw3MCwxMTUgTDcwLDExNCBMNjksMTE0IEw2OSwxMTMgTDY4LDExMyBMNjgsMTEyIEw2NiwxMTIgTDY2LDExMSBMNjUsMTExIEw2NSwxMTAgTDY0LDExMCBMNjQsMTA5IEw2MywxMDkgTDYzLDEwOCBMNjEsMTA4IEw2MSwxMDcgTDYwLDEwNyBMNjAsMTA2IEw1OSwxMDYgTDU5LDEwNSBMNTgsMTA1IEw1OCwxMDQgTDU2LDEwNCBMNTYsMTAzIEw1NSwxMDMgTDU1LDEwMiBMNTQsMTAyIEw1NCwxMDEgTDUzLDEwMSBMNTMsMTAwIEw1MSwxMDAgTDUxLDk5IEw1MCw5OSBMNTAsOTggTDQ5LDk4IEw0OSw5NyBMNDgsOTcgTDQ4LDk2IEw0Niw5NiBMNDYsOTUgTDQ1LDk1IEw0NSw5NCBMNDQsOTQgTDQ0LDkzIEw0Myw5MyBMNDMsOTIgTDQxLDkyIEw0MSw5MSBMNDAsOTEgTDQwLDkwIEwzOCw5MCBMMzgsOTEgTDM3LDkxIEwzNyw5MiBMMzUsOTIgTDM1LDkzIEwzNCw5MyBMMzQsOTQgTDMzLDk0IEwzMyw5NSBMMzIsOTUgTDMyLDk2IEwzMCw5NiBMMzAsOTcgTDI5LDk3IEwyOSw5OCBMMjgsOTggTDI4LDk5IEwyNyw5OSBMMjcsMTAwIEwyNSwxMDAgTDI1LDEwMSBMMjQsMTAxIEwyNCwxMDIgTDIzLDEwMiBMMjMsMTAzIEwyMiwxMDMgTDIyLDEwNCBMMjAsMTA0IEwyMCwxMDUgTDE5LDEwNSBMMTksMTA2IEwxOCwxMDYgTDE4LDEwNyBMMTcsMTA3IEwxNywxMDggTDE1LDEwOCBMMTUsMTA5IEwxNCwxMDkgTDE0LDExMCBMMTMsMTEwIEwxMywxMTEgTDEyLDExMSBMMTIsMTEyIEwxMCwxMTIgTDEwLDExMyBMOSwxMTMgTDksMTE0IEw4LDExNCBMOCwxMTUgTDcsMTE1IEw3LDExNiBMNSwxMTYgTDUsMTE3IEw0LDExNyBMNCwxMTggTDMsMTE4IEwzLDExOSBMMiwxMTkgTDIsMTIwIEwwLDEyMCBaIE0zOCwxOSBMMzgsMjEgTDM3LDIxIEwzNywyMyBMMzYsMjMgTDM2LDI1IEwzNSwyNSBMMzUsMjcgTDM0LDI3IEwzNCwyOSBMMzMsMjkgTDMzLDMxIEwzMiwzMSBMMzIsMzMgTDMxLDMzIEwzMSwzNSBMMjUsMzUgTDI1LDM2IEwxNywzNiBMMTcsMzcgTDEyLDM3IEwxMiwzOCBMMTQsMzggTDE0LDM5IEwxNSwzOSBMMTUsNDAgTDE2LDQwIEwxNiw0MSBMMTcsNDEgTDE3LDQyIEwxOCw0MiBMMTgsNDMgTDE5LDQzIEwxOSw0NCBMMjAsNDQgTDIwLDQ1IEwyMSw0NSBMMjEsNDYgTDIyLDQ2IEwyMiw0NyBMMjMsNDcgTDIzLDQ4IEwyNCw0OCBMMjQsNDkgTDI1LDQ5IEwyNSw1MCBMMjYsNTAgTDI2LDUyIEwyNSw1MiBMMjUsNTcgTDI0LDU3IEwyNCw2MyBMMjMsNjMgTDIzLDY4IEwyNSw2OCBMMjUsNjcgTDI3LDY3IEwyNyw2NiBMMjgsNjYgTDI4LDY1IEwzMCw2NSBMMzAsNjQgTDMyLDY0IEwzMiw2MyBMMzQsNjMgTDM0LDYyIEwzNiw2MiBMMzYsNjEgTDM4LDYxIEwzOCw2MCBMNDAsNjAgTDQwLDYxIEw0Miw2MSBMNDIsNjIgTDQ0LDYyIEw0NCw2MyBMNDYsNjMgTDQ2LDY0IEw0OCw2NCBMNDgsNjUgTDUwLDY1IEw1MCw2NiBMNTEsNjYgTDUxLDY3IEw1Myw2NyBMNTMsNjggTDU1LDY4IEw1NSw2MyBMNTQsNjMgTDU0LDU3IEw1Myw1NyBMNTMsNTIgTDUyLDUyIEw1Miw1MCBMNTMsNTAgTDUzLDQ5IEw1NCw0OSBMNTQsNDggTDU1LDQ4IEw1NSw0NyBMNTYsNDcgTDU2LDQ2IEw1Nyw0NiBMNTcsNDUgTDU4LDQ1IEw1OCw0NCBMNTksNDQgTDU5LDQzIEw2MCw0MyBMNjAsNDIgTDYxLDQyIEw2MSw0MSBMNjIsNDEgTDYyLDQwIEw2Myw0MCBMNjMsMzkgTDY0LDM5IEw2NCwzOCBMNjYsMzggTDY2LDM3IEw2MSwzNyBMNjEsMzYgTDUzLDM2IEw1MywzNSBMNDcsMzUgTDQ3LDMzIEw0NiwzMyBMNDYsMzEgTDQ1LDMxIEw0NSwyOSBMNDQsMjkgTDQ0LDI3IEw0MywyNyBMNDMsMjUgTDQyLDI1IEw0MiwyMyBMNDEsMjMgTDQxLDIxIEw0MCwyMSBMNDAsMTkgWiAiIGZpbGw9IiM4N0NFRUIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDIxLDApIi8+CjxwYXRoIGQ9Ik0wLDAgTDIsMCBMMiwyIEwzLDIgTDMsNCBMNCw0IEw0LDYgTDUsNiBMNSw3IEw3LDcgTDcsOCBMMTQsOCBMMTQsMTAgTDEyLDEwIEwxMiwxMSBMMTEsMTEgTDExLDEyIEwxMCwxMiBMMTAsMTMgTDksMTMgTDksMTQgTDgsMTQgTDgsMjAgTDksMjAgTDksMjQgTDcsMjQgTDcsYy0yMyBMNiwyMyBMNiwyMiBMNCwyMiBMNCwyMSBMMiwyMSBMMiwyMCBMMCwyMCBMMCwyMSBMLTIsMjEgTC0yLDIyIEwtNCwyMiBMLTQsMjMgTC01LDIzIEwtNSwyNCBMLTcsMjQgTC03LDIwIEwtNiwyMCBMLTYsMTQgTC03LDE0IEwtNywxMyBMLTgsMTMgTC04LDEyIEwtOSwxMiBMLTksMTEgTC0xMCwxMSBMLTEwLDEwIEwtMTIsMTAgTC0xMiw4IEwtNSw4IEwtNSw3IEwtMyw3IEwtMyw2IEwtMiw2IEwtMiw0IEwtMSw0IEwtMSwyIEwwLDIgWiAiIGZpbGw9IiNmZmZlMDAiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDU5LDMzKSIvPgo8L3N2Zz4K
// @downloadURL https://update.greasyfork.org/scripts/559077/%E7%BD%91%E7%BB%9C%E4%B9%A6%E7%AD%BE%E7%AE%A1%E7%90%86%E5%99%A8%20-%20WebDAV%E4%BA%91%E5%90%8C%E6%AD%A5%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/559077/%E7%BD%91%E7%BB%9C%E4%B9%A6%E7%AD%BE%E7%AE%A1%E7%90%86%E5%99%A8%20-%20WebDAV%E4%BA%91%E5%90%8C%E6%AD%A5%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 检查是否在iframe中运行，如果是则不执行
    if (window.self !== window.top) {
        console.log('书签管理器: 在iframe中运行，跳过初始化');
        return;
    }

    // 多标签页同步管理器
    class MultiTabSyncManager {
        constructor(bookmarkManager) {
            this.bookmarkManager = bookmarkManager;
            this.operationLock = false;
            this.currentDataVersion = GM_getValue('data_version', 0);
            this.setupSyncListener();
        }

        // 设置同步监听器
        setupSyncListener() {
            // 监听数据版本变化
            GM_addValueChangeListener('data_version', (name, oldValue, newValue, remote) => {
                if (remote && newValue !== this.currentDataVersion) {
                    console.log('检测到其他标签页数据更新，重新加载数据');
                    this.currentDataVersion = newValue;
                    this.bookmarkManager.loadLocalDataSilently();
                }
            });

            // 监听操作锁状态
            GM_addValueChangeListener('operation_lock', (name, oldValue, newValue, remote) => {
                if (remote) {
                    this.operationLock = newValue;
                }
            });
        }

        // 执行原子操作
        async executeAtomicOperation(operation) {
            // 等待操作锁释放
            let attempts = 0;
            while (this.operationLock && attempts < 50) {
                await new Promise(resolve => setTimeout(resolve, 100));
                this.operationLock = GM_getValue('operation_lock', false);
                attempts++;
            }

            if (attempts >= 50) {
                throw new Error('操作超时，请稍后重试');
            }

            try {
                // 获取操作锁
                GM_setValue('operation_lock', true);
                this.operationLock = true;

                // 执行操作
                const result = await operation();

                // 更新数据版本
                this.currentDataVersion = Date.now();
                GM_setValue('data_version', this.currentDataVersion);

                return result;
            } finally {
                // 释放操作锁
                GM_setValue('operation_lock', false);
                this.operationLock = false;
            }
        }
    }

    // 检测是否为移动设备
    const isMobile = () => {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               window.innerWidth <= 768;
    };

    // 存储上次密码验证时间
    const getLastVerifyTime = () => {
        return GM_getValue('last_verify_time', 0);
    };

    // 保存上次密码验证时间
    const saveLastVerifyTime = (time) => {
        GM_setValue('last_verify_time', time);
    };

    // 判断是否需要验证密码（每月1日需要验证）
    const needVerifyPassword = () => {
        const lastVerifyTime = getLastVerifyTime();
        const now = new Date();
        const lastVerifyDate = new Date(lastVerifyTime);

        // 如果从未验证过，或者当前月份与上次验证月份不同，则需要验证
        return lastVerifyTime === 0 ||
               (now.getFullYear() !== lastVerifyDate.getFullYear() ||
                now.getMonth() !== lastVerifyDate.getMonth());
    };

    // API URL验证器（代码保护）
    const API_URL_VALIDATOR = (() => {
        const getUrlHash = (str) => {
            let hash = 0;
            for (let i = 0; i < str.length; i++) {
                const char = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash;
            }
            return Math.abs(hash).toString(16);
        };

        const API_URL_PARTS = [
            ['68', '74', '74', '70', '73', '3a', '2f', '2f'],
            ['77', '77', '77', '2e'],
            ['63', '63', '6b', '64', '6e', '2e', '63', '6e'],
            ['2f', '61', '70', '69', '2f'],
            ['6d', '69', '6d', '61', '2f'],
            ['6d', '6d', '79', '7a', '2e', '70', '68', '70']
        ];

        const EXPECTED_HASH_1 = '444fe50';
        const EXPECTED_HASH_2 = 'c88abf0';
        const EXPECTED_HASH_3 = 'ce3de16';

        const reconstructUrl = () => {
            try {
                const parts = API_URL_PARTS.map(part =>
                    part.map(hex => String.fromCharCode(parseInt(hex, 16))).join('')
                );
                return parts.join('');
            } catch (e) {
                throw new Error('URL重建失败');
            }
        };

        const validateUrl = (url) => {
            const hash1 = getUrlHash(url);
            const hash2 = getUrlHash(url.split('').reverse().join(''));
            const hash3 = getUrlHash(url.substring(0, 20));

            if (hash1 !== EXPECTED_HASH_1) {
                throw new Error('URL验证失败 (检查点1)');
            }
            if (hash2 !== EXPECTED_HASH_2) {
                throw new Error('URL验证失败 (检查点2)');
            }
            if (hash3 !== EXPECTED_HASH_3) {
                throw new Error('URL验证失败 (检查点3)');
            }
            return true;
        };

        return {
            getValidatedUrl: () => {
                const url = reconstructUrl();
                validateUrl(url);
                return url;
            },
            verify: () => {
                try {
                    reconstructUrl();
                    return true;
                } catch (e) {
                    return false;
                }
            }
        };
    })();

    // 通过API验证密码
    async function verifyPasswordWithAPI(password) {
        return new Promise((resolve, reject) => {
            try {
                const apiUrl = API_URL_VALIDATOR.getValidatedUrl();

                // 准备POST数据 - 使用标准的form-urlencoded格式
                const postData = new URLSearchParams();
                postData.append('password', password);

                console.log('发送密码验证请求:', password);

                GM_xmlhttpRequest({
                    method: 'POST',
                    url: apiUrl,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                },
                data: postData.toString(),
                timeout: 15000,
                onload: function(response) {
                    console.log('密码验证API响应状态:', response.status);
                    console.log('密码验证API响应内容:', response.responseText);

                    if (response.status >= 200 && response.status < 300) {
                        try {
                            // 尝试解析JSON响应
                            const result = JSON.parse(response.responseText);
                            console.log('验证结果:', result);

                            if (result.success === true) {
                                console.log('密码验证成功');
                                resolve(true);
                            } else {
                                console.log('密码验证失败:', result.message || '密码错误');
                                resolve(false);
                            }
                        } catch (parseError) {
                            console.error('解析API响应失败:', parseError);
                            console.log('原始响应:', response.responseText);

                            // 如果JSON解析失败，尝试简单的文本匹配
                            const responseText = response.responseText.toLowerCase();
                            if (responseText.includes('success') && responseText.includes('true')) {
                                resolve(true);
                            } else {
                                reject(new Error('服务器响应格式错误: ' + response.responseText));
                            }
                        }
                    } else {
                        console.error('API请求失败:', response.status, response.statusText);
                        console.log('错误响应内容:', response.responseText);
                        reject(new Error(`服务器错误 ${response.status}: ${response.statusText || '未知错误'}`));
                    }
                },
                onerror: function(error) {
                    console.error('密码验证网络请求失败:', error);
                    reject(new Error('网络请求失败，请检查网络连接'));
                },
                ontimeout: function() {
                    console.error('密码验证请求超时');
                    reject(new Error('请求超时，请稍后重试'));
                }
            });
            } catch (error) {
                reject(error);
            }
        });
    }

    // 显示密码验证对话框（包含扫码图片）
    function showPasswordVerifyDialog() {
        return new Promise((resolve) => {
            const dialog = document.createElement('div');
            const mobile = isMobile();

            dialog.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.7);
                z-index: 100000;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: ${mobile ? '20px' : '0'};
                box-sizing: border-box;
            `;

            dialog.innerHTML = `
                <div style="background: white; padding: ${mobile ? '20px' : '15px'}; border-radius: 8px; width: ${mobile ? '90%' : '400px'}; max-width: 90vw; text-align: center;">
                    <h3 style="margin: 0 0 ${mobile ? '15px' : '10px'} 0; font-size: ${mobile ? '18px' : '16px'}; color: #333;">书签管理器开源协议密码验证</h3>
                    <div id="password-error" style="display: none; margin-bottom: ${mobile ? '15px' : '10px'}; padding: ${mobile ? '10px' : '8px'}; background-color: #ffebee; color: #c62828; border-radius: 4px; font-size: ${mobile ? '14px' : '12px'};">
                        密码错误，请重新输入！
                    </div>
                    <div id="verify-loading" style="display: none; margin-bottom: ${mobile ? '15px' : '10px'}; padding: ${mobile ? '10px' : '8px'}; background-color: #e3f2fd; color: #1976d2; border-radius: 4px; font-size: ${mobile ? '14px' : '12px'};">
                        正在验证密码，请稍候...
                    </div>
                    <div style="margin-bottom: ${mobile ? '15px' : '10px'};">
                        <img src="https://www.cckdn.cn/source/plugin/bphp_pass/static/demo.png"
                             alt="扫码获取密码"
                             style="max-width: 100%; height: auto; border-radius: 6px; margin-bottom: ${mobile ? '15px' : '10px'}; border: 1px solid #ddd;">
                        <p style="margin: 5px 0; font-size: ${mobile ? '14px' : '12px'}; color: #ff0000;">微信扫码关注 云码酷 公众号<br>回复【开源】查看协议获取密码</p>
                    </div>
                    <div style="margin-bottom: ${mobile ? '15px' : '10px'};">
                        <input type="password" id="password-input" placeholder="请输入密码"
                               style="width: 100%; padding: ${mobile ? '12px' : '8px'}; border: 1px solid #ddd; border-radius: 4px; font-size: ${mobile ? '16px' : '14px'}; box-sizing: border-box;">
                    </div>
                    <div style="display: flex; gap: ${mobile ? '10px' : '8px'};">
                        <button id="verify-confirm" style="flex: 1; padding: ${mobile ? '12px' : '8px'}; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: ${mobile ? '14px' : '12px'};">确认</button>
                        <button id="verify-cancel" style="flex: 1; padding: ${mobile ? '12px' : '8px'}; background: #666; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: ${mobile ? '14px' : '12px'};">取消</button>
                    </div>
                </div>
            `;

            document.body.appendChild(dialog);

            const passwordInput = document.getElementById('password-input');
            const confirmBtn = document.getElementById('verify-confirm');
            const cancelBtn = document.getElementById('verify-cancel');
            const errorElement = document.getElementById('password-error');
            const loadingElement = document.getElementById('verify-loading');

            // 自动聚焦到密码输入框
            setTimeout(() => passwordInput.focus(), 100);

            // 显示/隐藏加载状态
            const showLoading = (show) => {
                if (show) {
                    loadingElement.style.display = 'block';
                    errorElement.style.display = 'none';
                    confirmBtn.disabled = true;
                    confirmBtn.style.opacity = '0.6';
                } else {
                    loadingElement.style.display = 'none';
                    confirmBtn.disabled = false;
                    confirmBtn.style.opacity = '1';
                }
            };

            // 显示错误信息
            const showError = (message) => {
                errorElement.textContent = message;
                errorElement.style.display = 'block';
                loadingElement.style.display = 'none';
                // 滚动到错误提示位置（针对手机端）
                errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                // 清空输入框并重新聚焦
                passwordInput.value = '';
                passwordInput.focus();
            };

            // 验证密码函数
            const validatePassword = async () => {
                const userInput = passwordInput.value.trim();
                if (!userInput) {
                    showError('请输入密码');
                    return;
                }

                try {
                    showLoading(true);
                    const isValid = await verifyPasswordWithAPI(userInput);

                    if (isValid) {
                        document.body.removeChild(dialog);
                        saveLastVerifyTime(new Date().getTime());
                        resolve(true);
                    } else {
                        showLoading(false);
                        showError('密码错误，请重新输入！');
                    }
                } catch (error) {
                    showLoading(false);
                    console.error('密码验证失败:', error);
                    showError(`验证失败: ${error.message}`);
                }
            };

            // 回车键确认
            passwordInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !confirmBtn.disabled) {
                    validatePassword();
                }
            });

            confirmBtn.addEventListener('click', validatePassword);

            cancelBtn.addEventListener('click', () => {
                document.body.removeChild(dialog);
                resolve(false);
            });

            // 点击背景关闭
            dialog.addEventListener('click', (e) => {
                if (e.target === dialog) {
                    document.body.removeChild(dialog);
                    resolve(false);
                }
            });
        });
    }

    // 验证密码
    async function verifyPassword() {
        if (!needVerifyPassword()) {
            console.log('无需密码验证，上次验证时间未过期');
            return true;
        }

        try {
            console.log('开始密码验证...');

            let isVerified = false;
            while (!isVerified) {
                isVerified = await showPasswordVerifyDialog();
                if (!isVerified) {
                    // 如果用户取消验证，直接返回false
                    console.log('用户取消密码验证');
                    return false;
                }
            }

            console.log('密码验证成功');
            return true;
        } catch (error) {
            console.error('密码验证过程中发生错误:', error);
            alert(`密码验证失败: ${error.message}`);
            return false;
        }
    }

    // WebDAV客户端类 - 使用GM_xmlhttpRequest绕过CORS
    class WebDAVClient {
        constructor(url, username, password) {
            this.url = url.endsWith('/') ? url : url + '/';
            this.username = username;
            this.password = password;
            this.auth = btoa(`${username}:${password}`);
        }

        // 使用GM_xmlhttpRequest发送请求，绕过CORS限制
        request(method, path = '', data = null, headers = {}) {
            return new Promise((resolve, reject) => {
                const url = this.url + path;
                const requestHeaders = {
                    'Authorization': `Basic ${this.auth}`,
                    'Content-Type': 'text/html; charset=utf-8',
                    ...headers
                };

                GM_xmlhttpRequest({
                    method: method,
                    url: url,
                    headers: requestHeaders,
                    data: data,
                    timeout: 10000,
                    onload: function(response) {
                        console.log(`WebDAV ${method} ${url}:`, response.status, response.statusText);
                        if (response.status >= 200 && response.status < 300) {
                            resolve({
                                status: response.status,
                                statusText: response.statusText,
                                text: () => Promise.resolve(response.responseText),
                                headers: response.responseHeaders
                            });
                        } else {
                            reject(new Error(`HTTP ${response.status}: ${response.statusText}`));
                        }
                    },
                    onerror: function(error) {
                        console.error(`WebDAV请求失败:`, error);
                        reject(new Error('网络请求失败'));
                    },
                    ontimeout: function() {
                        reject(new Error('请求超时'));
                    }
                });
            });
        }

        // 测试连接
        async testConnection() {
            try {
                console.log('测试WebDAV连接...');

                // 尝试PROPFIND请求
                const propfindData = `<?xml version="1.0" encoding="utf-8"?>
                    <D:propfind xmlns:D="DAV:">
                        <D:prop>
                            <D:resourcetype/>
                            <D:getlastmodified/>
                        </D:prop>
                    </D:propfind>`;

                const response = await this.request('PROPFIND', '', propfindData, {
                    'Depth': '1',
                    'Content-Type': 'application/xml; charset=utf-8'
                });

                console.log('PROPFIND请求成功');
                return true;
            } catch (error) {
                console.error('PROPFIND请求失败:', error);

                // 如果PROPFIND失败，尝试简单的GET请求
                try {
                    console.log('尝试GET请求...');
                    await this.request('GET');
                    console.log('GET请求成功');
                    return true;
                } catch (getError) {
                    console.error('GET请求失败:', getError);
                    throw new Error(`连接失败: ${error.message}`);
                }
            }
        }

        // 确保目录存在
        async ensureDirectory(path) {
            if (!path || path === '/') return;

            try {
                // 尝试创建目录
                await this.request('MKCOL', path);
                console.log(`创建目录成功: ${path}`);
            } catch (error) {
                // 如果是405错误，说明目录已存在
                if (error.message.includes('405')) {
                    console.log(`目录已存在: ${path}`);
                    return;
                }
                // 其他错误则抛出
                console.warn(`创建目录失败: ${path}`, error.message);
            }
        }

        // 读取文件
        async readFile(filename) {
            try {
                const response = await this.request('GET', filename);
                return await response.text();
            } catch (error) {
                if (error.message.includes('404')) {
                    return null; // 文件不存在
                }
                throw error;
            }
        }

        // 写入文件
        async writeFile(filename, content) {
            // 确保目录存在
            const pathParts = filename.split('/');
            if (pathParts.length > 1) {
                const dirPath = pathParts.slice(0, -1).join('/');
                await this.ensureDirectory(dirPath);
            }

            await this.request('PUT', filename, content, {
                'Content-Type': 'text/html; charset=utf-8'
            });
        }
    }

    // HTML书签转换器类
    class BookmarkHTMLConverter {
        // 将书签和分类数据转换为HTML格式
        static convertToHTML(bookmarks, categories) {
            console.log('=== 开始转换为HTML格式 ===');
            console.log(`转换 ${categories.length} 个分类，${bookmarks.length} 个书签`);

            const timestamp = Math.floor(Date.now() / 1000);

            let html = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<!-- This is an automatically generated file.
     It will be read and overwritten.
     DO NOT EDIT! -->
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>
<DL><p>
`;

            // 构建分类树结构
            const categoryTree = this.buildCategoryTree(categories);

            // 渲染分类树
            html += this.renderCategoryTree(categoryTree, bookmarks, 1, timestamp);

            html += `</DL><p>\n`;

            console.log('=== HTML转换完成 ===');
            return html;
        }

        // 构建分类树结构
        static buildCategoryTree(categories) {
            console.log('=== 构建分类树结构 ===');

            // 创建分类映射
            const categoryMap = new Map();
            categories.forEach(category => {
                categoryMap.set(category.id, {
                    ...category,
                    children: []
                });
            });

            // 构建树结构
            const rootCategories = [];

            categories.forEach(category => {
                const categoryNode = categoryMap.get(category.id);

                if (category.parentId && categoryMap.has(category.parentId)) {
                    // 有父分类，添加到父分类的children中
                    const parent = categoryMap.get(category.parentId);
                    parent.children.push(categoryNode);
                    console.log(`分类 "${category.name}" 添加到父分类 "${parent.name}" 下`);
                } else {
                    // 没有父分类或父分类不存在，作为根分类
                    rootCategories.push(categoryNode);
                    console.log(`分类 "${category.name}" 作为根分类`);
                }
            });

            // 按order排序
            const sortCategories = (categories) => {
                categories.sort((a, b) => (a.order || 0) - (b.order || 0));
                categories.forEach(category => {
                    if (category.children.length > 0) {
                        sortCategories(category.children);
                    }
                });
            };

            sortCategories(rootCategories);

            console.log(`构建完成，共 ${rootCategories.length} 个根分类`);
            return rootCategories;
        }

        // 渲染分类树
        static renderCategoryTree(categoryTree, bookmarks, depth, timestamp) {
            let html = '';
            const indent = '    '.repeat(depth);

            categoryTree.forEach(category => {
                const categoryBookmarks = bookmarks.filter(b => b.categoryId === category.id);
                console.log(`渲染分类 "${category.name}": ${categoryBookmarks.length} 个书签, ${category.children.length} 个子分类`);

                if (category.id === 'default') {
                    // 默认分类直接输出书签，不创建分类标题
                    categoryBookmarks.forEach(bookmark => {
                        const addDate = bookmark.createdAt ? Math.floor(new Date(bookmark.createdAt).getTime() / 1000) : timestamp;
                        const iconData = bookmark.icon || '';
                        const iconAttr = iconData ? ` ICON="${iconData}"` : '';
                        // 保存标签信息到TITLE属性（如果有标签）
                        const titleAttr = bookmark.tags && bookmark.tags.length > 0 
                            ? ` TITLE="${this.escapeHTML(bookmark.tags.join(','))}"` 
                            : '';

                        html += `${indent}<DT><A HREF="${this.escapeHTML(bookmark.url)}" ADD_DATE="${addDate}"${iconAttr}${titleAttr}>${this.escapeHTML(bookmark.title)}</A>\n`;
                    });
                } else {
                    // 非默认分类创建分类标题和内容
                    const addDate = category.createdAt ? Math.floor(new Date(category.createdAt).getTime() / 1000) : timestamp;
                    const lastModified = timestamp;

                    html += `${indent}<DT><H3 ADD_DATE="${addDate}" LAST_MODIFIED="${lastModified}">${this.escapeHTML(category.name)}</H3>\n`;

                    if (categoryBookmarks.length > 0 || category.children.length > 0) {
                        html += `${indent}<DL><p>\n`;

                        // 先输出书签
                        categoryBookmarks.forEach(bookmark => {
                            const bookmarkAddDate = bookmark.createdAt ? Math.floor(new Date(bookmark.createdAt).getTime() / 1000) : timestamp;
                            const iconData = bookmark.icon || '';
                            const iconAttr = iconData ? ` ICON="${iconData}"` : '';
                            // 保存标签信息到TITLE属性（如果有标签）
                            const titleAttr = bookmark.tags && bookmark.tags.length > 0 
                                ? ` TITLE="${this.escapeHTML(bookmark.tags.join(','))}"` 
                                : '';

                            html += `${indent}    <DT><A HREF="${this.escapeHTML(bookmark.url)}" ADD_DATE="${bookmarkAddDate}"${iconAttr}${titleAttr}>${this.escapeHTML(bookmark.title)}</A>\n`;
                        });

                        // 再输出子分类
                        if (category.children.length > 0) {
                            html += this.renderCategoryTree(category.children, bookmarks, depth + 1, timestamp);
                        }

                        html += `${indent}</DL><p>\n`;
                    } else {
                        // 空分类也要有DL结构
                        html += `${indent}<DL><p>\n${indent}</DL><p>\n`;
                    }
                }
            });

            return html;
        }

        // 从HTML格式解析书签和分类数据
        static parseFromHTML(htmlContent) {
            console.log('=== 开始从HTML解析 ===');

            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlContent, 'text/html');

            const bookmarks = [];
            const categories = [];
            let categoryIdCounter = 1;

            // 确保有默认分类 - 修改为默认折叠
            const defaultCategory = {
                id: 'default',
                name: '默认分类',
                expanded: false,  // 改为 false，默认折叠
                order: 0,
                parentId: null,
                level: 0,
                createdAt: new Date().toISOString()
            };
            categories.push(defaultCategory);

            // 递归解析书签结构
            function parseBookmarkStructure(node, currentCategoryId = 'default', parentCategoryId = null, level = 0, depth = 0) {
                const indent = '  '.repeat(depth);
                console.log(`${indent}解析节点: ${node.tagName}, 当前分类ID: ${currentCategoryId}, 层级: ${level}`);

                const children = Array.from(node.children);
                let activeCategoryId = currentCategoryId;

                for (let i = 0; i < children.length; i++) {
                    const child = children[i];

                    if (child.tagName === 'DT') {
                        // DT节点可能包含H3(分类)或A(书签)
                        const h3 = child.querySelector('h3');
                        const link = child.querySelector('a');

                        if (h3) {
                            // 这是一个分类标题
                            const categoryName = h3.textContent.trim();
                            console.log(`${indent}发现分类: "${categoryName}", 父分类ID: ${parentCategoryId}, 层级: ${level}`);

                            if (categoryName) {
                                // 检查是否已存在同名同级分类
                                let categoryId = null;
                                const existingCategory = categories.find(c =>
                                    c.name.toLowerCase() === categoryName.toLowerCase() &&
                                    c.parentId === parentCategoryId
                                );

                                if (existingCategory) {
                                    categoryId = existingCategory.id;
                                    console.log(`${indent}分类已存在，使用现有ID: ${categoryId}`);
                                } else {
                                    // 创建新分类
                                    categoryId = 'category_' + (categoryIdCounter++);
                                    const addDate = h3.getAttribute('ADD_DATE');
                                    const createdAt = addDate ? new Date(parseInt(addDate) * 1000).toISOString() : new Date().toISOString();

                                    const category = {
                                        id: categoryId,
                                        name: categoryName,
                                        expanded: false,  // 改为 false，默认折叠
                                        order: categories.length,
                                        parentId: parentCategoryId,
                                        level: level,
                                        createdAt: createdAt
                                    };
                                    categories.push(category);
                                    console.log(`${indent}创建新分类: "${categoryName}", ID: ${categoryId}, 父ID: ${parentCategoryId}, 层级: ${level}`);
                                }

                                // 更新当前活动分类
                                activeCategoryId = categoryId;

                                // 查找该分类后面的书签 - 检查下一个兄弟节点是否是DL
                                const nextSibling = children[i + 1];
                                if (nextSibling && nextSibling.tagName === 'DL') {
                                    console.log(`${indent}找到分类 "${categoryName}" 对应的DL，递归解析`);
                                    parseBookmarkStructure(nextSibling, categoryId, categoryId, level + 1, depth + 1);
                                    i++; // 跳过已处理的DL节点
                                } else {
                                    // 如果没有紧跟的DL，检查当前DT下是否有嵌套的DL
                                    const nestedDL = child.querySelector('dl');
                                    if (nestedDL) {
                                        console.log(`${indent}找到分类 "${categoryName}" 内嵌的DL，递归解析`);
                                        parseBookmarkStructure(nestedDL, categoryId, categoryId, level + 1, depth + 1);
                                    }
                                }
                            }
                        } else if (link && link.href && link.href.startsWith('http')) {
                            // 这是一个书签
                            const existingBookmark = bookmarks.find(b => b.url === link.href);
                            if (!existingBookmark) {
                                const addDate = link.getAttribute('ADD_DATE');
                                const icon = link.getAttribute('ICON');
                                const createdAt = addDate ? new Date(parseInt(addDate) * 1000).toISOString() : new Date().toISOString();

                                // 从TITLE属性中读取标签信息
                                let tags = [];
                                const titleAttr = link.getAttribute('TITLE');
                                if (titleAttr && titleAttr.trim()) {
                                    tags = titleAttr.split(',').map(t => t.trim()).filter(t => t);
                                }

                                const bookmark = {
                                    id: Date.now().toString() + '_' + Math.random().toString(36).substr(2, 9),
                                    title: link.textContent.trim() || link.href,
                                    url: link.href,
                                    tags: tags,
                                    categoryId: activeCategoryId,
                                    createdAt: createdAt,
                                    updatedAt: createdAt, // 从HTML解析的书签，使用createdAt作为updatedAt的默认值
                                    domain: new URL(link.href).hostname
                                };

                                if (icon) {
                                    bookmark.icon = icon;
                                }

                                bookmarks.push(bookmark);
                                console.log(`${indent}添加书签: "${bookmark.title}" -> 分类ID: ${activeCategoryId}, 标签: [${tags.join(', ')}]`);
                            } else {
                                // 如果书签已存在，尝试更新标签（从TITLE属性）
                                const titleAttr = link.getAttribute('TITLE');
                                if (titleAttr && titleAttr.trim()) {
                                    existingBookmark.tags = titleAttr.split(',').map(t => t.trim()).filter(t => t);
                                    console.log(`${indent}更新已存在书签的标签: "${existingBookmark.title}" -> [${existingBookmark.tags.join(', ')}]`);
                                } else {
                                    // 如果没有TITLE属性，说明标签为空，清空标签
                                    existingBookmark.tags = [];
                                    console.log(`${indent}已存在书签 "${existingBookmark.title}" 没有TITLE属性，清空标签`);
                                }
                                console.log(`${indent}书签已存在，跳过: ${link.textContent.trim()}`);
                            }
                        }
                    } else if (child.tagName === 'DL') {
                        // 直接处理嵌套的DL，保持当前分类上下文
                        console.log(`${indent}处理嵌套DL，当前分类: ${activeCategoryId}, 父分类: ${parentCategoryId}`);
                        parseBookmarkStructure(child, activeCategoryId, parentCategoryId, level, depth + 1);
                    }
                }

                return activeCategoryId;
            }

            // 查找所有顶级DL元素并开始解析
            const dlElements = doc.querySelectorAll('body > dl, dl');
            console.log(`找到 ${dlElements.length} 个DL元素`);

            // 按层级处理DL元素，优先处理顶级DL
            const topLevelDLs = Array.from(dlElements).filter(dl => {
                const parent = dl.parentNode;
                return parent && (parent.tagName === 'BODY' || parent.tagName === 'HTML');
            });

            if (topLevelDLs.length > 0) {
                console.log(`处理 ${topLevelDLs.length} 个顶级DL元素`);
                topLevelDLs.forEach((dl, index) => {
                    console.log(`解析顶级DL ${index + 1}`);
                    parseBookmarkStructure(dl, 'default', null, 0, 0);
                });
            } else {
                console.log('未找到顶级DL，处理所有DL元素');
                dlElements.forEach((dl, index) => {
                    console.log(`解析DL ${index + 1}`);
                    parseBookmarkStructure(dl, 'default', null, 0, 0);
                });
            }

            // 处理可能存在的顶级书签
            console.log('检查顶级书签...');
            const topLevelLinks = doc.querySelectorAll('body > a, body > dt > a');
            topLevelLinks.forEach(link => {
                if (link.href && link.href.startsWith('http')) {
                    const existingBookmark = bookmarks.find(b => b.url === link.href);
                    if (!existingBookmark) {
                        const addDate = link.getAttribute('ADD_DATE');
                        const icon = link.getAttribute('ICON');
                        const createdAt = addDate ? new Date(parseInt(addDate) * 1000).toISOString() : new Date().toISOString();

                        // 从TITLE属性中读取标签信息
                        let tags = [];
                        const titleAttr = link.getAttribute('TITLE');
                        if (titleAttr && titleAttr.trim()) {
                            tags = titleAttr.split(',').map(t => t.trim()).filter(t => t);
                        }

                        const bookmark = {
                            id: Date.now().toString() + '_' + Math.random().toString(36).substr(2, 9),
                            title: link.textContent.trim() || link.href,
                            url: link.href,
                            tags: tags,
                            categoryId: 'default',
                            createdAt: createdAt,
                            updatedAt: createdAt, // 从HTML解析的书签，使用createdAt作为updatedAt的默认值
                            domain: new URL(link.href).hostname
                        };

                        if (icon) {
                            bookmark.icon = icon;
                        }

                        bookmarks.push(bookmark);
                        console.log(`添加顶级书签: "${bookmark.title}" -> 默认分类, 标签: [${tags.join(', ')}]`);
                    } else {
                        // 如果书签已存在，尝试更新标签（从TITLE属性）
                        const titleAttr = link.getAttribute('TITLE');
                        if (titleAttr && titleAttr.trim()) {
                            existingBookmark.tags = titleAttr.split(',').map(t => t.trim()).filter(t => t);
                            console.log(`更新已存在顶级书签的标签: "${existingBookmark.title}" -> [${existingBookmark.tags.join(', ')}]`);
                        } else {
                            // 如果没有TITLE属性，说明标签为空，清空标签
                            existingBookmark.tags = [];
                            console.log(`已存在顶级书签 "${existingBookmark.title}" 没有TITLE属性，清空标签`);
                        }
                    }
                }
            });

            console.log(`=== HTML解析完成 ===`);
            console.log(`共解析出 ${categories.length} 个分类，${bookmarks.length} 个书签`);

            // 输出分类详情
            categories.forEach(category => {
                const categoryBookmarks = bookmarks.filter(b => b.categoryId === category.id);
                console.log(`分类 "${category.name}" (${category.id}, 层级${category.level}, 父ID:${category.parentId}): ${categoryBookmarks.length} 个书签`);
            });

            return {
                bookmarks,
                categories
            };
        }

        // HTML转义
        static escapeHTML(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }
    }

    // 书签解析器类（保持兼容性）
    class BookmarkParser {
        // 解析HTML书签文件
        static parseHTMLBookmarks(htmlContent) {
            return BookmarkHTMLConverter.parseFromHTML(htmlContent);
        }
    }

    // 书签管理器类
    class BookmarkManager {
        constructor() {
            this.bookmarks = [];
            this.categories = [];
            this.webdavClient = null;
            this.syncEnabled = false;
            this.bookmarkFileName = 'bookmarks/bookmarks.html';
            this.lastSyncTime = 0;
            this.syncInProgress = false;
            // 批量管理相关属性
            this.batchMode = false;
            this.selectedBookmarks = new Set();
            // 多标签页同步管理器
            this.multiTabSync = new MultiTabSyncManager(this);
            this.init();
        }

        async init() {
            console.log('开始初始化书签管理器...');

            // 先加载本地数据和初始化WebDAV
            await this.loadLocalData();
            await this.initWebDAVAndSync();
            this.createUI();
            this.registerMenuCommands();

            console.log('书签管理器初始化完成');
        }

        // 初始化WebDAV并执行初始同步
        async initWebDAVAndSync() {
            const webdavConfig = this.getWebDAVConfig();
            if (webdavConfig.url && webdavConfig.username && webdavConfig.password) {
                try {
                    await this.initWebDAV(webdavConfig.url, webdavConfig.username, webdavConfig.password);
                    // 脚本加载时从云端同步
                    await this.syncFromCloud();
                    console.log('初始同步完成');
                } catch (error) {
                    console.warn('WebDAV初始化或同步失败:', error.message);
                }
            }
        }

        // 获取WebDAV配置
        getWebDAVConfig() {
            return {
                url: GM_getValue('webdav_url', ''),
                username: GM_getValue('webdav_username', ''),
                password: GM_getValue('webdav_password', '')
            };
        }

        // 保存WebDAV配置
        saveWebDAVConfig(url, username, password) {
            GM_setValue('webdav_url', url);
            GM_setValue('webdav_username', username);
            GM_setValue('webdav_password', password);
        }

        // 保存按钮位置
        saveButtonPosition(x, y) {
            GM_setValue('button_position', JSON.stringify({ x, y }));
        }

        // 获取按钮位置
        getButtonPosition() {
            const saved = GM_getValue('button_position', '{"x":20,"y":20}');
            try {
                return JSON.parse(saved);
            } catch {
                return { x: 20, y: 20 };
            }
        }

        // 获取拖动图标显示设置
        getDragIconVisible() {
            return GM_getValue('drag_icon_visible', true);
        }

        // 保存拖动图标显示设置
        saveDragIconVisible(visible) {
            GM_setValue('drag_icon_visible', visible);
        }

        // 获取拖动按钮图标透明度设置
        getButtonOpacity() {
            return GM_getValue('button_opacity', 0.1);
        }

        // 保存拖动按钮图标透明度设置
        saveButtonOpacity(opacity) {
            GM_setValue('button_opacity', opacity);
        }

        // 更新浮动按钮的透明度
        updateFloatButtonOpacity(opacity) {
            const floatBtn = document.getElementById('bookmark-float-btn');
            if (floatBtn) {
                floatBtn.style.opacity = opacity;
            }
        }

        // 初始化WebDAV
        async initWebDAV(url, username, password) {
            this.webdavClient = new WebDAVClient(url, username, password);
            await this.webdavClient.testConnection();
            this.syncEnabled = true;
            console.log('WebDAV连接成功');
        }

        // 从云端同步数据
        async syncFromCloud() {
            if (!this.syncEnabled || !this.webdavClient) {
                return false;
            }

            try {
                console.log('开始从云端同步HTML格式书签...');

                // 从云端读取HTML格式的书签文件
                const cloudBookmarksHTML = await this.webdavClient.readFile(this.bookmarkFileName);
                if (cloudBookmarksHTML) {
                    console.log('成功读取云端HTML书签文件');

                    // 解析HTML格式的书签数据
                    const { bookmarks: cloudBookmarks, categories: cloudCategories } = BookmarkHTMLConverter.parseFromHTML(cloudBookmarksHTML);

                    console.log(`云端数据: ${cloudCategories.length} 个分类，${cloudBookmarks.length} 个书签`);

                    // 合并数据（在更新lastSyncTime之前保存当前值，用于判断本地新增的书签）
                    const previousSyncTime = this.lastSyncTime || 0;
                    this.bookmarks = this.mergeBookmarks(this.bookmarks, cloudBookmarks, previousSyncTime);
                    this.categories = this.mergeCategories(this.categories, cloudCategories);

                    // 保存到本地
                    await this.saveLocalData();
                } else {
                    console.log('云端无书签文件');
                }

                this.lastSyncTime = Date.now();
                GM_setValue('last_sync_time', this.lastSyncTime);
                this.updateUI();
                console.log('从云端同步成功');
                return true;
            } catch (error) {
                console.error('从云端同步失败:', error);
                return false;
            }
        }

        // 同步到云端
        async syncToCloud() {
            if (!this.syncEnabled || !this.webdavClient) {
                return false;
            }

            try {
                console.log('开始同步HTML格式书签到云端...');

                // 将书签和分类数据转换为HTML格式
                const htmlContent = BookmarkHTMLConverter.convertToHTML(this.bookmarks, this.categories);

                console.log('HTML内容生成完成，准备上传到云端');

                // 上传HTML文件到云端
                await this.webdavClient.writeFile(this.bookmarkFileName, htmlContent);

                this.lastSyncTime = Date.now();
                GM_setValue('last_sync_time', this.lastSyncTime);
                console.log('同步HTML书签到云端成功');
                return true;
            } catch (error) {
                console.error('同步到云端失败:', error);
                return false;
            }
        }

        // 合并书签（修复删除同步问题和同步数据问题）
        mergeBookmarks(localBookmarks, cloudBookmarks, lastSyncTime = 0) {
            console.log('=== 开始合并书签 ===');
            console.log(`本地书签: ${localBookmarks.length} 个`);
            console.log(`云端书签: ${cloudBookmarks.length} 个`);

            // 1. 创建云端书签的URL映射（因为HTML解析可能产生新的ID）
            const cloudBookmarksByUrl = new Map();
            cloudBookmarks.forEach(b => {
                cloudBookmarksByUrl.set(b.url, b);
            });

            // 2. 创建合并后的书签数组
            const merged = [];
            const processedUrls = new Set();

            // 3. 处理本地和云端都存在的书签：优先使用云端版本（云端是权威数据源）
            // lastSyncTime 用于判断本地书签是否是新增的（在最后一次同步之后创建的）
            
            localBookmarks.forEach(localBookmark => {
                const cloudBookmark = cloudBookmarksByUrl.get(localBookmark.url);
                if (cloudBookmark) {
                    // 如果云端存在，优先使用云端版本（包含最新的修改）
                    // 如果本地有updatedAt且比云端新，则使用本地版本，但需要合并云端的标签
                    const localTime = localBookmark.updatedAt ? new Date(localBookmark.updatedAt).getTime() : new Date(localBookmark.createdAt).getTime();
                    const cloudTime = cloudBookmark.updatedAt ? new Date(cloudBookmark.updatedAt).getTime() : new Date(cloudBookmark.createdAt).getTime();
                    
                    // 无论时间比较结果如何，标签总是优先使用云端版本（因为标签可能在其他设备上被更新）
                    // 但其他字段（title, url等）根据时间比较决定使用哪个版本
                    if (localTime > cloudTime) {
                        // 本地版本更新，使用本地版本，但标签必须使用云端版本
                        console.log(`书签 "${localBookmark.title}" 本地版本更新，保留本地版本，但标签使用云端版本`);
                        const mergedBookmark = { ...localBookmark };
                        // 标签总是优先使用云端版本（云端是标签的权威数据源）
                        if (cloudBookmark.tags && cloudBookmark.tags.length > 0) {
                            mergedBookmark.tags = [...cloudBookmark.tags];
                            console.log(`  使用云端标签: [${cloudBookmark.tags.join(', ')}]`);
                        } else if (localBookmark.tags && localBookmark.tags.length > 0) {
                            // 如果云端没有标签但本地有，保留本地标签
                            mergedBookmark.tags = [...localBookmark.tags];
                            console.log(`  使用本地标签: [${localBookmark.tags.join(', ')}]`);
                        } else {
                            mergedBookmark.tags = [];
                        }
                        merged.push(mergedBookmark);
                    } else {
                        // 云端版本更新或相同，完全使用云端版本（包括标签）
                        console.log(`书签 "${cloudBookmark.title}" 使用云端版本（云端更新或相同），标签: [${cloudBookmark.tags ? cloudBookmark.tags.join(', ') : ''}]`);
                        merged.push(cloudBookmark);
                    }
                    processedUrls.add(localBookmark.url);
                } else {
                    // 本地存在但云端不存在：检查是否是本地新增的（在最后一次同步之后创建的）
                    const bookmarkCreatedTime = new Date(localBookmark.createdAt).getTime();
                    const bookmarkUpdatedTime = localBookmark.updatedAt ? new Date(localBookmark.updatedAt).getTime() : bookmarkCreatedTime;
                    const bookmarkLatestTime = Math.max(bookmarkCreatedTime, bookmarkUpdatedTime);
                    
                    // 如果书签是在最后一次同步之后创建或修改的，说明是本地新增的，应该保留
                    if (bookmarkLatestTime > lastSyncTime) {
                        console.log(`书签 "${localBookmark.title}" 仅存在于本地且是新增的（在最后同步时间之后），保留`);
                        merged.push(localBookmark);
                    } else {
                        // 否则说明云端已删除，应该删除本地书签
                        console.log(`书签 "${localBookmark.title}" 在云端已删除，删除本地书签`);
                    }
                    processedUrls.add(localBookmark.url);
                }
            });

            // 4. 添加云端新增的书签（URL不在本地的）
            cloudBookmarks.forEach(cloudBookmark => {
                if (!processedUrls.has(cloudBookmark.url)) {
                    console.log(`书签 "${cloudBookmark.title}" 仅存在于云端，添加`);
                    merged.push(cloudBookmark);
                }
            });

            // 5. 按创建时间排序
            const result = merged.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            console.log(`合并后书签: ${result.length} 个`);
            console.log('=== 书签合并完成 ===');
            return result;
        }

        // 合并分类（修复删除同步问题和分类错乱问题）
        mergeCategories(localCategories, cloudCategories) {
            console.log('=== 开始合并分类 ===');
            console.log('本地分类:', localCategories.map(c => `${c.name}(${c.id}, 层级${c.level || 0})`));
            console.log('云端分类:', cloudCategories.map(c => `${c.name}(${c.id}, 层级${c.level || 0})`));

            // 1. 创建分类路径映射（用于识别相同的分类）
            const getFullPath = (category, categories) => {
                const path = [category.name];
                let current = category;
                while (current.parentId) {
                    const parent = categories.find(c => c.id === current.parentId);
                    if (parent) {
                        path.unshift(parent.name);
                        current = parent;
                    } else {
                        break;
                    }
                }
                return path.join('/');
            };

            // 2. 创建云端分类路径集合
            const cloudPaths = new Set(cloudCategories.map(c => getFullPath(c, cloudCategories)));

            // 3. 过滤本地分类，仅保留云端存在的路径（但保留默认分类）
            const merged = localCategories.filter(c => {
                if (c.id === 'default') return true;
                const path = getFullPath(c, localCategories);
                const shouldKeep = cloudPaths.has(path);
                console.log(`本地分类 "${c.name}"(路径:${path}): ${shouldKeep ? '保留' : '删除'}`);
                return shouldKeep;
            });

            // 4. 添加云端新增的分类（基于路径检查）
            cloudCategories.forEach(cloudCategory => {
                if (cloudCategory.id === 'default') return; // 跳过默认分类

                const cloudPath = getFullPath(cloudCategory, cloudCategories);
                const exists = merged.some(c => getFullPath(c, merged) === cloudPath);

                if (!exists) {
                    console.log(`添加云端新分类: "${cloudCategory.name}"(路径:${cloudPath})`);
                    merged.push(cloudCategory);
                }
            });

            // 5. 确保默认分类存在且为折叠状态
            if (!merged.some(c => c.id === 'default')) {
                console.log('添加默认分类');
                merged.unshift({
                    id: 'default',
                    name: '默认分类',
                    expanded: false,  // 改为 false，默认折叠
                    order: 0,
                    parentId: null,
                    level: 0,
                    createdAt: new Date().toISOString()
                });
            }

            // 6. 更新书签的分类ID映射（修复分类错乱的关键步骤）
            this.updateBookmarkCategoryMapping(merged, cloudCategories);

            // 7. 按层级和order排序
            const result = this.sortCategoriesHierarchically(merged);
            console.log('合并后分类:', result.map(c => `${c.name}(${c.id}, 层级${c.level || 0})`));
            console.log('=== 分类合并完成 ===');

            return result;
        }

        // 按层级排序分类
        sortCategoriesHierarchically(categories) {
            // 先按层级排序，再按order排序
            return categories.sort((a, b) => {
                const levelA = a.level || 0;
                const levelB = b.level || 0;

                if (levelA !== levelB) {
                    return levelA - levelB;
                }

                return (a.order || 0) - (b.order || 0);
            });
        }

        // 更新书签的分类ID映射（修复分类错乱的核心方法）
        updateBookmarkCategoryMapping(mergedCategories, cloudCategories) {
            console.log('=== 更新书签分类映射 ===');

            // 创建云端分类ID到分类路径的映射
            const cloudIdToPath = new Map();
            cloudCategories.forEach(category => {
                const path = this.getCategoryPath(category, cloudCategories);
                cloudIdToPath.set(category.id, path);
                console.log(`云端分类映射: ${category.id} -> ${path}`);
            });

            // 创建分类路径到合并后分类ID的映射
            const pathToMergedId = new Map();
            mergedCategories.forEach(category => {
                const path = this.getCategoryPath(category, mergedCategories);
                pathToMergedId.set(path, category.id);
                console.log(`合并后分类映射: ${path} -> ${category.id}`);
            });

            // 更新书签的分类ID
            let updatedCount = 0;
            this.bookmarks.forEach(bookmark => {
                const originalCategoryId = bookmark.categoryId;

                if (originalCategoryId && originalCategoryId !== 'default') {
                    // 首先尝试通过云端ID映射找到路径
                    let categoryPath = cloudIdToPath.get(originalCategoryId);

                    // 如果云端映射中没有找到，尝试在合并后的分类中直接查找
                    if (!categoryPath) {
                        const existingCategory = mergedCategories.find(c => c.id === originalCategoryId);
                        if (existingCategory) {
                            categoryPath = this.getCategoryPath(existingCategory, mergedCategories);
                        }
                    }

                    if (categoryPath) {
                        const newCategoryId = pathToMergedId.get(categoryPath);
                        if (newCategoryId && newCategoryId !== originalCategoryId) {
                            console.log(`书签 "${bookmark.title}" 分类映射: ${originalCategoryId} -> ${newCategoryId} (路径: ${categoryPath})`);
                            bookmark.categoryId = newCategoryId;
                            updatedCount++;
                        }
                    } else {
                        // 如果找不到对应的分类路径，放入默认分类
                        console.warn(`书签 "${bookmark.title}" 找不到分类 "${originalCategoryId}"，移动到默认分类`);
                        bookmark.categoryId = 'default';
                        updatedCount++;
                    }
                }
            });

            console.log(`=== 分类映射更新完成，共更新 ${updatedCount} 个书签的分类 ===`);
        }

        // 获取分类的完整路径
        getCategoryPath(category, categories) {
            const path = [category.name];
            let current = category;
            while (current.parentId) {
                const parent = categories.find(c => c.id === current.parentId);
                if (parent) {
                    path.unshift(parent.name);
                    current = parent;
                } else {
                    break;
                }
            }
            return path.join('/');
        }

        // 加载本地数据
        async loadLocalData() {
            // 首先尝试从HTML格式加载
            const htmlData = GM_getValue('bookmarks_html', '');
            if (htmlData) {
                console.log('从本地HTML格式加载书签...');
                try {
                    const { bookmarks, categories } = BookmarkHTMLConverter.parseFromHTML(htmlData);
                    this.bookmarks = bookmarks;
                    this.categories = categories;
                    console.log(`从HTML格式加载: ${categories.length} 个分类，${bookmarks.length} 个书签`);
                } catch (error) {
                    console.error('HTML格式解析失败，尝试JSON格式:', error);
                    await this.loadLegacyData();
                }
            } else {
                // 如果没有HTML数据，尝试从旧的JSON格式加载
                console.log('未找到HTML格式数据，尝试从JSON格式加载...');
                await this.loadLegacyData();
            }

            // 加载最后同步时间
            this.lastSyncTime = GM_getValue('last_sync_time', 0);
        }

        // 静默加载本地数据（用于多标签页同步）
        async loadLocalDataSilently() {
            await this.loadLocalData();
            this.updateUI();
        }

        // 加载旧的JSON格式数据（用于数据迁移）
        async loadLegacyData() {
            console.log('从JSON格式加载数据...');

            // 加载书签
            const savedBookmarks = GM_getValue('bookmarks', '[]');
            try {
                this.bookmarks = JSON.parse(savedBookmarks);
            } catch (error) {
                console.error('加载JSON书签失败:', error);
                this.bookmarks = [];
            }

            // 加载分类
            const savedCategories = GM_getValue('categories', '[]');
            try {
                this.categories = JSON.parse(savedCategories);
                if (this.categories.length === 0) {
                    this.categories = [
                        { id: 'default', name: '默认分类', expanded: false, order: 0, parentId: null, level: 0, createdAt: new Date().toISOString() }  // 改为 false
                    ];
                }
                // 确保分类有必要的属性，并设置为折叠状态
                this.categories.forEach((category, index) => {
                    if (typeof category.order === 'undefined') {
                        category.order = index;
                    }
                    if (typeof category.parentId === 'undefined') {
                        category.parentId = null;
                    }
                    if (typeof category.level === 'undefined') {
                        category.level = 0;
                    }
                    if (typeof category.expanded === 'undefined') {
                        category.expanded = false;  // 改为 false，默认折叠
                    } else {
                        category.expanded = false;  // 强制设置为折叠状态
                    }
                });
                // 按层级和order排序
                this.categories = this.sortCategoriesHierarchically(this.categories);
            } catch (error) {
                console.error('加载JSON分类失败:', error);
                this.categories = [
                    { id: 'default', name: '默认分类', expanded: false, order: 0, parentId: null, level: 0, createdAt: new Date().toISOString() }  // 改为 false
                ];
            }

            console.log(`从JSON格式加载: ${this.categories.length} 个分类，${this.bookmarks.length} 个书签`);

            // 如果有数据，立即转换为HTML格式保存
            if (this.bookmarks.length > 0 || this.categories.length > 1) {
                console.log('将JSON数据转换为HTML格式保存...');
                await this.saveLocalData();
                // 清理旧的JSON数据
                GM_deleteValue('bookmarks');
                GM_deleteValue('categories');
                console.log('数据迁移完成，已清理旧JSON数据');
            }
        }

        // 保存本地数据（HTML格式）
        async saveLocalData() {
            console.log('保存数据为HTML格式...');
            const htmlContent = BookmarkHTMLConverter.convertToHTML(this.bookmarks, this.categories);
            GM_setValue('bookmarks_html', htmlContent);
            console.log('HTML格式数据保存完成');
        }

        // 导入书签 - 支持多级分类（修复分类错乱问题）
        async importBookmarks(htmlContent) {
            try {
                console.log('=== 开始导入书签 ===');
                const { bookmarks, categories } = BookmarkParser.parseHTMLBookmarks(htmlContent);
                console.log(`解析结果: ${categories.length} 个分类，${bookmarks.length} 个书签`);

                // 记录导入前的状态
                const beforeImportCategoriesCount = this.categories.length;
                const beforeImportBookmarksCount = this.bookmarks.length;

                // 步骤1: 处理分类 - 基于分类路径去重并添加新分类
                console.log('=== 处理多级分类 ===');
                const existingPaths = new Set();
                this.categories.forEach(category => {
                    const path = this.getCategoryPath(category, this.categories);
                    existingPaths.add(path.toLowerCase());
                });

                const newCategories = categories.filter(c => {
                    if (c.id === 'default') return false; // 跳过默认分类

                    const path = this.getCategoryPath(c, categories);
                    const exists = existingPaths.has(path.toLowerCase());
                    console.log(`分类路径 "${path}": ${exists ? '已存在' : '新增'}`);
                    return !exists;
                });

                console.log(`需要添加的新分类数量: ${newCategories.length}`);

                // 创建分类ID映射表（导入分类ID -> 最终分类ID）
                const categoryIdMapping = new Map();
                categoryIdMapping.set('default', 'default'); // 默认分类映射

                // 为现有分类创建映射
                this.categories.forEach(category => {
                    const path = this.getCategoryPath(category, this.categories);
                    // 查找导入分类中是否有相同路径的分类
                    const importCategory = categories.find(c => {
                        const importPath = this.getCategoryPath(c, categories);
                        return importPath.toLowerCase() === path.toLowerCase();
                    });
                    if (importCategory) {
                        categoryIdMapping.set(importCategory.id, category.id);
                        console.log(`现有分类映射: ${importCategory.id} -> ${category.id} (路径: ${path})`);
                    }
                });

                if (newCategories.length > 0) {
                    // 重新计算新分类的order和ID
                    const maxOrder = Math.max(...this.categories.map(c => c.order || 0), -1);
                    newCategories.forEach((category, index) => {
                        const oldId = category.id;
                        // 生成新的唯一ID
                        category.id = 'imported_' + Date.now() + '_' + index;
                        category.order = maxOrder + 1 + index;
                        category.expanded = false;  // 确保新导入的分类默认为折叠状态

                        // 更新映射表
                        categoryIdMapping.set(oldId, category.id);

                        console.log(`新分类 "${category.name}" ID映射: ${oldId} -> ${category.id}, order: ${category.order}, 层级: ${category.level}`);
                    });

                    // 更新新分类的父分类ID
                    newCategories.forEach(category => {
                        if (category.parentId && categoryIdMapping.has(category.parentId)) {
                            const newParentId = categoryIdMapping.get(category.parentId);
                            console.log(`更新分类 "${category.name}" 父ID: ${category.parentId} -> ${newParentId}`);
                            category.parentId = newParentId;
                        }
                    });

                    this.categories = [...this.categories, ...newCategories];
                    this.categories = this.sortCategoriesHierarchically(this.categories);
                    console.log(`已添加 ${newCategories.length} 个新分类`);
                }

                // 步骤2: 处理书签分类映射
                console.log('=== 处理书签分类映射 ===');
                bookmarks.forEach(bookmark => {
                    const originalCategoryId = bookmark.categoryId;
                    console.log(`处理书签 "${bookmark.title}", 原分类ID: ${originalCategoryId}`);

                    if (categoryIdMapping.has(originalCategoryId)) {
                        const finalCategoryId = categoryIdMapping.get(originalCategoryId);
                        bookmark.categoryId = finalCategoryId;
                        console.log(`  -> 最终分类ID: ${finalCategoryId}`);
                    } else {
                        console.warn(`  -> 找不到分类ID "${originalCategoryId}" 的映射，放入默认分类`);
                        bookmark.categoryId = 'default';
                    }
                });

                // 步骤3: 合并书签 - 基于URL去重
                console.log('=== 合并书签 ===');
                const existingUrls = new Set(this.bookmarks.map(b => b.url));
                const newBookmarks = bookmarks.filter(b => {
                    const exists = existingUrls.has(b.url);
                    if (!exists) {
                        console.log(`新书签: "${b.title}" -> 分类ID: ${b.categoryId}`);
                    }
                    return !exists;
                });

                console.log(`需要添加的新书签数量: ${newBookmarks.length}`);

                if (newBookmarks.length > 0) {
                    this.bookmarks = [...this.bookmarks, ...newBookmarks];
                    console.log(`已添加 ${newBookmarks.length} 个新书签`);
                }

                // 保存数据
                await this.saveLocalData();

                // 验证书签分类分配情况
                console.log('=== 验证书签分类分配 ===');
                const categoryBookmarkCounts = new Map();
                this.bookmarks.forEach(bookmark => {
                    const count = categoryBookmarkCounts.get(bookmark.categoryId) || 0;
                    categoryBookmarkCounts.set(bookmark.categoryId, count + 1);
                });

                categoryBookmarkCounts.forEach((count, categoryId) => {
                    const category = this.categories.find(c => c.id === categoryId);
                    const categoryName = category ? category.name : '未知分类';
                    const categoryPath = category ? this.getCategoryPath(category, this.categories) : '未知路径';
                    console.log(`分类 "${categoryName}" (路径:${categoryPath}): ${count} 个书签`);
                });

                // 同步到云端
                if (this.syncEnabled) {
                    try {
                        await this.syncToCloud();
                        console.log('导入的数据已同步到云端');
                    } catch (error) {
                        console.warn('同步到云端失败:', error.message);
                    }
                }

                this.updateUI();

                const importedCategoriesCount = this.categories.length - beforeImportCategoriesCount;
                const importedBookmarksCount = this.bookmarks.length - beforeImportBookmarksCount;

                console.log('=== 导入完成 ===');
                console.log(`导入分类: ${importedCategoriesCount} 个`);
                console.log(`导入书签: ${importedBookmarksCount} 个`);
                console.log(`跳过重复书签: ${bookmarks.length - newBookmarks.length} 个`);

                return {
                    success: true,
                    importedBookmarks: importedBookmarksCount,
                    importedCategories: importedCategoriesCount,
                    skippedBookmarks: bookmarks.length - newBookmarks.length
                };
            } catch (error) {
                console.error('导入书签失败:', error);
                return {
                    success: false,
                    error: error.message
                };
            }
        }

        // 显示书签导入对话框
        showBookmarkImportDialog() {
            const dialog = document.createElement('div');
            const mobile = isMobile();

            dialog.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                z-index: 10001;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: ${mobile ? '20px' : '0'};
                box-sizing: border-box;
            `;

            dialog.innerHTML = `
                <div style="background: white; padding: ${mobile ? '25px' : '20px'}; border-radius: 8px; width: ${mobile ? '100%' : '450px'}; max-width: ${mobile ? '100%' : '90vw'}; max-height: 90vh; overflow-y: auto;">
                    <h3 style="margin: 0 0 ${mobile ? '20px' : '15px'} 0; font-size: ${mobile ? '20px' : '18px'};">导入书签</h3>

                    <div style="margin-bottom: ${mobile ? '20px' : '15px'};">
                        <label style="display: block; margin-bottom: ${mobile ? '8px' : '5px'}; font-weight: 500; font-size: ${mobile ? '16px' : '14px'};">选择书签文件:</label>
                        <input type="file" id="bookmark-file-input" accept=".html,.htm"
                               style="width: 100%; padding: ${mobile ? '12px' : '8px'}; border: 1px solid #ddd; border-radius: 4px; font-size: ${mobile ? '16px' : '14px'}; box-sizing: border-box;">
                        <div style="margin-top: ${mobile ? '8px' : '5px'}; font-size: ${mobile ? '14px' : '12px'}; color: #666;">
                            支持浏览器导出的HTML格式书签文件，自动识别多级分类结构，重复的书签和分类将被跳过，无分类书签归纳至默认分类。
                        </div>
                    </div>

                    <div id="import-status" style="display: none; margin-bottom: ${mobile ? '20px' : '15px'}; padding: ${mobile ? '12px' : '8px'}; border-radius: 4px; font-size: ${mobile ? '14px' : '12px'};"></div>

                    <div style="display: flex; gap: ${mobile ? '15px' : '10px'};">
                        <button id="import-confirm" style="flex: 1; padding: ${mobile ? '12px' : '8px'}; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: ${mobile ? '16px' : '14px'};" disabled>导入</button>
                        <button id="import-cancel" style="flex: 1; padding: ${mobile ? '12px' : '8px'}; background: #666; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: ${mobile ? '16px' : '14px'};">取消</button>
                    </div>
                </div>
            `;

            document.body.appendChild(dialog);

            const fileInput = document.getElementById('bookmark-file-input');
            const confirmBtn = document.getElementById('import-confirm');
            const cancelBtn = document.getElementById('import-cancel');
            const statusDiv = document.getElementById('import-status');

            let selectedFile = null;

            // 文件选择事件
            fileInput.addEventListener('change', (e) => {
                selectedFile = e.target.files[0];
                confirmBtn.disabled = !selectedFile;
            });

            // 显示状态信息
            const showStatus = (message, isError = false) => {
                statusDiv.textContent = message;
                statusDiv.style.display = 'block';
                statusDiv.style.background = isError ? '#ffebee' : '#e8f5e8';
                statusDiv.style.color = isError ? '#c62828' : '#2e7d32';
                statusDiv.style.border = `1px solid ${isError ? '#ef5350' : '#4caf50'}`;
            };

            // 导入确认
            confirmBtn.addEventListener('click', async () => {
                if (!selectedFile) return;

                try {
                    showStatus('正在读取文件...');

                    const reader = new FileReader();
                    reader.onload = async (e) => {
                        try {
                            showStatus('正在解析书签...');
                            const result = await this.importBookmarks(e.target.result);

                            if (result.success) {
                                showStatus(`导入成功！新增书签: ${result.importedBookmarks}个，新增分类: ${result.importedCategories}个${result.skippedBookmarks > 0 ? `，跳过重复书签: ${result.skippedBookmarks}个` : ''}，所有分类默认为折叠状态`);

                                setTimeout(() => {
                                    document.body.removeChild(dialog);
                                }, 2000);
                            } else {
                                showStatus(`导入失败: ${result.error}`, true);
                            }
                        } catch (error) {
                            showStatus(`导入失败: ${error.message}`, true);
                        }
                    };

                    reader.onerror = () => {
                        showStatus('文件读取失败', true);
                    };

                    reader.readAsText(selectedFile, 'UTF-8');
                } catch (error) {
                    showStatus(`导入失败: ${error.message}`, true);
                }
            });

            // 取消按钮
            cancelBtn.addEventListener('click', () => {
                document.body.removeChild(dialog);
            });

            // 点击背景关闭
            dialog.addEventListener('click', (e) => {
                if (e.target === dialog) {
                    document.body.removeChild(dialog);
                }
            });
        }

        // 导出书签为HTML格式
        exportBookmarks() {
            const htmlContent = BookmarkHTMLConverter.convertToHTML(this.bookmarks, this.categories);

            // 创建下载链接
            const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = `bookmarks_${new Date().getTime()}.html`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            console.log('书签导出完成');
        }

        // 批量管理模式相关方法
        toggleBatchMode() {
            this.batchMode = !this.batchMode;
            this.selectedBookmarks.clear();
            this.updateUI();
        }

        // 选择/取消选择书签
        toggleBookmarkSelection(bookmarkId) {
            if (this.selectedBookmarks.has(bookmarkId)) {
                this.selectedBookmarks.delete(bookmarkId);
            } else {
                this.selectedBookmarks.add(bookmarkId);
            }
            this.updateBatchModeUI();
        }

        // 全选/全不选
        selectAllBookmarks(selectAll = true) {
            this.selectedBookmarks.clear();
            if (selectAll) {
                // 获取当前显示的书签
                const searchQuery = document.getElementById('search-input')?.value || '';
                let visibleBookmarks;

                if (searchQuery) {
                    visibleBookmarks = this.searchBookmarks(searchQuery);
                } else {
                    visibleBookmarks = this.bookmarks;
                }

                visibleBookmarks.forEach(bookmark => {
                    this.selectedBookmarks.add(bookmark.id);
                });
            }
            this.updateBatchModeUI();
        }

        // 更新批量模式UI
        updateBatchModeUI() {
            // 更新选中状态
            document.querySelectorAll('[data-bookmark-checkbox]').forEach(checkbox => {
                const bookmarkId = checkbox.getAttribute('data-bookmark-checkbox');
                checkbox.checked = this.selectedBookmarks.has(bookmarkId);
            });

            // 更新批量操作按钮状态
            const batchButtons = document.getElementById('batch-operation-buttons');
            if (batchButtons) {
                const hasSelected = this.selectedBookmarks.size > 0;
                const buttons = batchButtons.querySelectorAll('button:not(#batch-select-all):not(#batch-select-none):not(#batch-mode-toggle)');
                buttons.forEach(button => {
                    button.disabled = !hasSelected;
                    button.style.opacity = hasSelected ? '1' : '0.5';
                });

                // 更新选中数量显示
                const countSpan = document.getElementById('selected-count');
                if (countSpan) {
                    countSpan.textContent = this.selectedBookmarks.size;
                }
            }
        }

        // 批量删除书签
        async batchDeleteBookmarks() {
            if (this.selectedBookmarks.size === 0) return;

            const selectedCount = this.selectedBookmarks.size;
            if (!confirm(`确定要删除选中的 ${selectedCount} 个书签吗？此操作不可撤销。`)) {
                return;
            }

            // 使用原子操作
            await this.multiTabSync.executeAtomicOperation(async () => {
                // 删除选中的书签
                this.bookmarks = this.bookmarks.filter(bookmark => !this.selectedBookmarks.has(bookmark.id));

                // 清空选择
                this.selectedBookmarks.clear();

                // 保存并同步
                await this.saveLocalData();

                if (this.syncEnabled) {
                    try {
                        await this.syncToCloud();
                    } catch (error) {
                        console.warn('同步到云端失败:', error.message);
                    }
                }

                return true;
            });

            this.updateUI();
            alert(`成功删除 ${selectedCount} 个书签！`);
        }

        // 批量移动书签
        batchMoveBookmarks() {
            if (this.selectedBookmarks.size === 0) return;

            this.showCategorySelectionDialog(async (categoryId) => {
                const selectedCount = this.selectedBookmarks.size;
                const category = this.categories.find(c => c.id === categoryId);
                const categoryName = category ? category.name : '未知分类';

                // 使用原子操作
                await this.multiTabSync.executeAtomicOperation(async () => {
                    // 移动选中的书签
                    this.bookmarks.forEach(bookmark => {
                        if (this.selectedBookmarks.has(bookmark.id)) {
                            bookmark.categoryId = categoryId;
                        }
                    });

                    // 清空选择
                    this.selectedBookmarks.clear();

                    // 保存并同步
                    await this.saveLocalData();

                    if (this.syncEnabled) {
                        try {
                            await this.syncToCloud();
                        } catch (error) {
                            console.warn('同步到云端失败:', error.message);
                        }
                    }

                    return true;
                });

                this.updateUI();
                alert(`成功将 ${selectedCount} 个书签移动到分类"${categoryName}"！`);
            });
        }

        // 计算书签列表的最大高度 - 修复滚动显示问题
        calculateBookmarkListMaxHeight() {
            const mobile = isMobile();

            // 获取视口高度
            const viewportHeight = window.innerHeight;

            // 计算面板的实际可用高度
            const panelMaxHeight = mobile ? viewportHeight * 0.9 : 600;

            // 计算头部区域的实际高度
            const headerElement = document.querySelector('#bookmark-panel > div:first-child');
            const headerHeight = headerElement ? headerElement.offsetHeight : (mobile ? 120 : 100);

            // 计算搜索框区域的实际高度
            const searchElement = document.querySelector('#bookmark-panel > div:nth-child(2)');
            const searchHeight = searchElement ? searchElement.offsetHeight : (mobile ? 60 : 50);

            // 计算批量操作按钮区域的实际高度
            const batchButtonsElement = document.getElementById('batch-operation-buttons');
            const batchButtonsHeight = (this.batchMode && batchButtonsElement) ?
                batchButtonsElement.offsetHeight : 0;

            // 预留底部内边距和滚动条空间
            const bottomPadding = mobile ? 30 : 20;

            // 计算书签列表的最大高度
            const maxHeight = panelMaxHeight - headerHeight - searchHeight - batchButtonsHeight - bottomPadding;

            // 确保最小高度
            const minHeight = mobile ? 200 : 150;

            console.log('高度计算:', {
                viewportHeight,
                panelMaxHeight,
                headerHeight,
                searchHeight,
                batchButtonsHeight,
                bottomPadding,
                calculatedMaxHeight: maxHeight,
                finalMaxHeight: Math.max(minHeight, maxHeight)
            });

            return Math.max(minHeight, maxHeight);
        }

        // 添加分类
        async addCategory(name, parentId = null) {
            return await this.multiTabSync.executeAtomicOperation(async () => {
                const parentCategory = parentId ? this.categories.find(c => c.id === parentId) : null;
                const level = parentCategory ? (parentCategory.level || 0) + 1 : 0;

                // 计算同级分类的最大order
                const siblingCategories = this.categories.filter(c => c.parentId === parentId);
                const maxOrder = siblingCategories.length > 0 ? Math.max(...siblingCategories.map(c => c.order || 0)) : -1;

                const category = {
                    id: Date.now().toString(),
                    name: name,
                    expanded: false,  // 改为 false，新分类默认折叠
                    order: maxOrder + 1,
                    parentId: parentId,
                    level: level,
                    createdAt: new Date().toISOString()
                };

                this.categories.push(category);
                this.categories = this.sortCategoriesHierarchically(this.categories);
                await this.saveLocalData();

                // 同步到云端
                if (this.syncEnabled) {
                    try {
                        await this.syncToCloud();
                    } catch (error) {
                        console.warn('同步分类到云端失败:', error.message);
                    }
                }

                this.updateUI();
                return category;
            });
        }

        // 删除分类
        async deleteCategory(id) {
            if (id === 'default') {
                alert('默认分类不能删除');
                return;
            }

            return await this.multiTabSync.executeAtomicOperation(async () => {
                // 获取要删除的分类及其所有子分类
                const categoriesToDelete = this.getAllChildCategories(id);
                categoriesToDelete.push(id);

                // 将这些分类下的书签移动到默认分类
                this.bookmarks.forEach(bookmark => {
                    if (categoriesToDelete.includes(bookmark.categoryId)) {
                        bookmark.categoryId = 'default';
                    }
                });

                // 删除分类
                this.categories = this.categories.filter(c => !categoriesToDelete.includes(c.id));
                await this.saveLocalData();

                // 同步到云端
                if (this.syncEnabled) {
                    try {
                        await this.syncToCloud();
                    } catch (error) {
                        console.warn('同步到云端失败:', error.message);
                    }
                }

                this.updateUI();
                return true;
            });
        }

        // 获取所有子分类ID
        getAllChildCategories(parentId) {
            const children = [];
            const directChildren = this.categories.filter(c => c.parentId === parentId);

            directChildren.forEach(child => {
                children.push(child.id);
                children.push(...this.getAllChildCategories(child.id));
            });

            return children;
        }

        // 重命名分类
        async renameCategory(id, newName) {
            return await this.multiTabSync.executeAtomicOperation(async () => {
                const category = this.categories.find(c => c.id === id);
                if (category) {
                    category.name = newName;
                    await this.saveLocalData();

                    // 同步到云端
                    if (this.syncEnabled) {
                        try {
                            await this.syncToCloud();
                        } catch (error) {
                            console.warn('同步分类到云端失败:', error.message);
                        }
                    }

                    this.updateUI();
                    return true;
                }
                return false;
            });
        }

        // 上移分类
        async moveCategoryUp(id) {
            return await this.multiTabSync.executeAtomicOperation(async () => {
                const category = this.categories.find(c => c.id === id);
                if (!category) return false;

                // 获取同级分类
                const siblings = this.categories.filter(c => c.parentId === category.parentId);
                siblings.sort((a, b) => (a.order || 0) - (b.order || 0));

                const currentIndex = siblings.findIndex(c => c.id === id);
                if (currentIndex > 0) {
                    // 交换order值
                    const temp = siblings[currentIndex].order;
                    siblings[currentIndex].order = siblings[currentIndex - 1].order;
                    siblings[currentIndex - 1].order = temp;

                    this.categories = this.sortCategoriesHierarchically(this.categories);
                    await this.saveLocalData();

                    // 同步到云端
                    if (this.syncEnabled) {
                        try {
                            await this.syncToCloud();
                        } catch (error) {
                            console.warn('同步到云端失败:', error.message);
                        }
                    }

                    this.updateUI();
                    return true;
                }
                return false;
            });
        }

        // 下移分类
        async moveCategoryDown(id) {
            return await this.multiTabSync.executeAtomicOperation(async () => {
                const category = this.categories.find(c => c.id === id);
                if (!category) return false;

                // 获取同级分类
                const siblings = this.categories.filter(c => c.parentId === category.parentId);
                siblings.sort((a, b) => (a.order || 0) - (b.order || 0));

                const currentIndex = siblings.findIndex(c => c.id === id);
                if (currentIndex < siblings.length - 1) {
                    // 交换order值
                    const temp = siblings[currentIndex].order;
                    siblings[currentIndex].order = siblings[currentIndex + 1].order;
                    siblings[currentIndex + 1].order = temp;

                    this.categories = this.sortCategoriesHierarchically(this.categories);
                    await this.saveLocalData();

                    // 同步到云端
                    if (this.syncEnabled) {
                        try {
                            await this.syncToCloud();
                        } catch (error) {
                            console.warn('同步到云端失败:', error.message);
                        }
                    }

                    this.updateUI();
                    return true;
                }
                return false;
            });
        }

        // 切换分类展开/折叠状态
        async toggleCategory(id) {
            const category = this.categories.find(c => c.id === id);
            if (category) {
                category.expanded = !category.expanded;
                await this.saveLocalData();
                this.updateUI();
            }
        }

        // 添加书签 - 修复多标签页覆盖问题
        async addBookmark(title, url, tags = [], categoryId = 'default') {
            return await this.multiTabSync.executeAtomicOperation(async () => {
                // 优化ID生成：增加随机字符串，避免ID重复
                const now = new Date().toISOString();
                const bookmark = {
                    id: Date.now().toString() + '_' + Math.random().toString(36).substr(2, 9),
                    title: title || document.title,
                    url: url || window.location.href,
                    tags: tags,
                    categoryId: categoryId,
                    createdAt: now,
                    updatedAt: now, // 新书签的updatedAt等于createdAt
                    domain: new URL(url || window.location.href).hostname
                };

                this.bookmarks.unshift(bookmark);
                await this.saveLocalData();

                // 同步到云端
                if (this.syncEnabled) {
                    try {
                        await this.syncToCloud();
                    } catch (error) {
                        console.warn('同步书签到云端失败:', error.message);
                    }
                }

                this.updateUI();
                return bookmark;
            });
        }

        // 编辑书签
        async editBookmark(id, title, url, tags) {
            return await this.multiTabSync.executeAtomicOperation(async () => {
                const bookmark = this.bookmarks.find(b => b.id === id);
                if (bookmark) {
                    bookmark.title = title;
                    bookmark.url = url;
                    bookmark.tags = tags;
                    bookmark.domain = new URL(url).hostname;
                    bookmark.updatedAt = new Date().toISOString(); // 添加更新时间
                    await this.saveLocalData();

                    // 同步到云端
                    if (this.syncEnabled) {
                        try {
                            await this.syncToCloud();
                        } catch (error) {
                            console.warn('同步到云端失败:', error.message);
                        }
                    }

                    this.updateUI();
                    return true;
                }
                return false;
            });
        }

        // 删除书签
        async deleteBookmark(id) {
            return await this.multiTabSync.executeAtomicOperation(async () => {
                this.bookmarks = this.bookmarks.filter(b => b.id !== id);
                await this.saveLocalData();

                // 同步到云端
                if (this.syncEnabled) {
                    try {
                        await this.syncToCloud();
                    } catch (error) {
                        console.warn('同步到云端失败:', error.message);
                    }
                }

                this.updateUI();
                return true;
            });
        }

        // 修改书签分类
        async moveBookmarkToCategory(bookmarkId, categoryId) {
            return await this.multiTabSync.executeAtomicOperation(async () => {
                const bookmark = this.bookmarks.find(b => b.id === bookmarkId);
                if (bookmark) {
                    bookmark.categoryId = categoryId;
                    bookmark.updatedAt = new Date().toISOString(); // 添加更新时间
                    await this.saveLocalData();

                    // 同步到云端
                    if (this.syncEnabled) {
                        try {
                            await this.syncToCloud();
                        } catch (error) {
                            console.warn('同步到云端失败:', error.message);
                        }
                    }

                    this.updateUI();
                    return true;
                }
                return false;
            });
        }

        // 搜索书签
        searchBookmarks(query) {
            if (!query) return this.bookmarks;

            const lowerQuery = query.toLowerCase();
            return this.bookmarks.filter(bookmark =>
                bookmark.title.toLowerCase().includes(lowerQuery) ||
                bookmark.url.toLowerCase().includes(lowerQuery) ||
                bookmark.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
            );
        }

        // 按分类获取书签
        getBookmarksByCategory(categoryId) {
            return this.bookmarks.filter(bookmark => bookmark.categoryId === categoryId);
        }

        // 格式化同步时间
        formatSyncTime(timestamp) {
            if (!timestamp) return '从未同步';

            const now = Date.now();
            const diff = now - timestamp;
            const minutes = Math.floor(diff / (1000 * 60));
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));

            if (minutes < 1) return '刚刚同步';
            if (minutes < 60) return `${minutes}分钟前同步`;
            if (hours < 24) return `${hours}小时前同步`;
            if (days < 7) return `${days}天前同步`;

            const date = new Date(timestamp);
            return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')} 同步`;
        }

        // 获取网站favicon
        getFaviconUrl(url) {
            try {
                const urlObj = new URL(url);
                return `${urlObj.protocol}//${urlObj.hostname}/favicon.ico`;
            } catch (error) {
                return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSIjQ0NDIiByeD0iMiIvPgo8L3N2Zz4K';
            }
        }

        // 创建UI
        createUI() {
            // 检查是否显示拖动图标
            if (this.getDragIconVisible()) {
                this.createFloatButton();
            }

            // 创建主面板（无论是否显示拖动图标都要创建）
            this.createPanel();
        }

        // 创建浮动按钮
        createFloatButton() {
            // 如果按钮已存在，先移除
            const existingBtn = document.getElementById('bookmark-float-btn');
            if (existingBtn) {
                existingBtn.remove();
            }

            const position = this.getButtonPosition();
            const floatBtn = document.createElement('div');
            floatBtn.id = 'bookmark-float-btn';
            floatBtn.innerHTML = '📚';

            const mobile = isMobile();
            const buttonSize = mobile ? '60px' : '50px';
            const fontSize = mobile ? '24px' : '20px';

            const opacity = this.getButtonOpacity();

            floatBtn.style.cssText = `
                position: fixed;
                top: ${position.y}px;
                right: ${position.x}px;
                width: ${buttonSize};
                height: ${buttonSize};
                background: #4CAF50;
                color: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: ${mobile ? 'pointer' : 'move'};
                z-index: 10000;
                font-size: ${fontSize};
                box-shadow: 0 2px 10px rgba(0,0,0,0.3);
                transition: all 0.3s ease;
                user-select: none;
                touch-action: none;
                opacity: ${opacity};
            `;

            // 添加拖动功能（支持触摸）
            this.makeDraggable(floatBtn);

            document.body.appendChild(floatBtn);
        }

        // 使元素可拖动（支持触摸和鼠标）
        makeDraggable(element) {
            let isDragging = false;
            let hasMoved = false;
            let startX, startY, startRight, startTop;

            // 统一的开始事件处理
            const handleStart = async (e) => {
                // 在拖动开始时进行密码验证
                const isVerified = await verifyPassword();
                if (!isVerified) {
                    return; // 验证失败，不执行拖动或点击
                }

                isDragging = true;
                hasMoved = false;

                // 获取触摸或鼠标位置
                const clientX = e.touches ? e.touches[0].clientX : e.clientX;
                const clientY = e.touches ? e.touches[0].clientY : e.clientY;

                startX = clientX;
                startY = clientY;

                const rect = element.getBoundingClientRect();
                startRight = window.innerWidth - rect.right;
                startTop = rect.top;

                element.style.cursor = 'grabbing';
                element.style.transition = 'none';
                element.style.opacity = '1';

                e.preventDefault();
                e.stopPropagation();
            };

            // 统一的移动事件处理
            const handleMove = (e) => {
                if (!isDragging) return;

                // 获取触摸或鼠标位置
                const clientX = e.touches ? e.touches[0].clientX : e.clientX;
                const clientY = e.touches ? e.touches[0].clientY : e.clientY;

                const deltaX = Math.abs(clientX - startX);
                const deltaY = Math.abs(clientY - startY);

                // 只有移动距离超过5px才认为是拖动
                if (deltaX > 5 || deltaY > 5) {
                    hasMoved = true;

                    const moveX = clientX - startX;
                    const moveY = clientY - startY;

                    const buttonSize = isMobile() ? 60 : 50;
                    const newRight = Math.max(0, Math.min(window.innerWidth - buttonSize, startRight - moveX));
                    const newTop = Math.max(0, Math.min(window.innerHeight - buttonSize, startTop + moveY));

                    element.style.right = newRight + 'px';
                    element.style.top = newTop + 'px';
                }

                e.preventDefault();
            };

            // 统一的结束事件处理
            const handleEnd = (e) => {
                if (isDragging) {
                    isDragging = false;
                    element.style.cursor = isMobile() ? 'pointer' : 'move';
                    element.style.transition = 'all 0.3s ease';
                    element.style.opacity = this.getButtonOpacity();

                    if (hasMoved) {
                        // 保存位置
                        const rect = element.getBoundingClientRect();
                        const x = window.innerWidth - rect.right;
                        const y = rect.top;
                        this.saveButtonPosition(x, y);
                    } else {
                        // 没有移动，触发点击事件
                        this.togglePanel();
                    }
                }
            };

            // 鼠标事件
            element.addEventListener('mousedown', handleStart);
            document.addEventListener('mousemove', handleMove);
            document.addEventListener('mouseup', handleEnd);

            // 触摸事件
            element.addEventListener('touchstart', handleStart, { passive: false });
            document.addEventListener('touchmove', handleMove, { passive: false });
            document.addEventListener('touchend', handleEnd);

            // 添加悬停效果（仅桌面端）
            if (!isMobile()) {
                element.addEventListener('mouseenter', () => {
                    if (!isDragging) {
                        element.style.transform = 'scale(1.1)';
                        element.style.boxShadow = '0 4px 20px rgba(0,0,0,0.4)';
                        element.style.opacity = '1';
                    }
                });

                element.addEventListener('mouseleave', () => {
                    if (!isDragging) {
                        element.style.transform = 'scale(1)';
                        element.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
                        element.style.opacity = this.getButtonOpacity();
                    }
                });
            }

            // 点击时变为不透明
            element.addEventListener('click', () => {
                element.style.opacity = '1';
                setTimeout(() => {
                    if (!element.matches(':hover')) {
                        element.style.opacity = this.getButtonOpacity();
                    }
                }, 200);
            });
        }

        // 创建主面板
        createPanel() {
            // 如果面板已存在，先移除
            const existingPanel = document.getElementById('bookmark-panel');
            if (existingPanel) {
                existingPanel.remove();
            }

            const panel = document.createElement('div');
            panel.id = 'bookmark-panel';

            const mobile = isMobile();
            const panelWidth = mobile ? '95vw' : '450px';
            const panelHeight = mobile ? '90vh' : '600px';
            const panelTop = mobile ? '5vh' : '80px';
            const panelRight = mobile ? '2.5vw' : '20px';

            panel.style.cssText = `
                position: fixed;
                top: ${panelTop};
                right: ${panelRight};
                width: ${panelWidth};
                max-width: ${mobile ? '95vw' : '450px'};
                max-height: ${panelHeight};
                background: white;
                border: 1px solid #ddd;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                z-index: 9999;
                display: none;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                overflow: hidden;
                flex-direction: column;
            `;

            const buttonPadding = mobile ? '8px 12px' : '6px 12px';
            const buttonFontSize = mobile ? '14px' : '12px';
            const headerPadding = mobile ? '20px' : '15px';
            const titleFontSize = mobile ? '18px' : '16px';

            panel.innerHTML = `
                <div style="padding: ${headerPadding}; border-bottom: 1px solid #eee; background: #f8f9fa; flex-shrink: 0;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: ${mobile ? '15px' : '10px'};">
                        <h3 style="margin: 0; color: #333; font-size: ${titleFontSize};">书签管理器</h3>
                        <div style="display: flex; align-items: center; gap: ${mobile ? '15px' : '10px'};">
                            <span id="sync-status-text" style="font-size: ${mobile ? '12px' : '11px'}; color: #666;">${this.syncEnabled ? this.formatSyncTime(this.lastSyncTime) : '未配置云同步'}</span>
                            <button id="close-panel-btn" style="background: none; border: none; font-size: 20px; cursor: pointer; color: #666; padding: 4px; line-height: 1;">×</button>
                        </div>
                    </div>
                    <div style="display: flex; gap: ${mobile ? '8px' : '5px'}; flex-wrap: wrap;">
                        <button id="add-bookmark-btn" style="flex: 1; min-width: ${mobile ? '120px' : '100px'}; padding: ${buttonPadding}; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: ${buttonFontSize};">添加当前页</button>
                        <button id="add-category-btn" style="padding: ${buttonPadding}; background: #FF9800; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: ${buttonFontSize};">📁 分类</button>
                        <button id="sync-settings-btn" style="padding: ${buttonPadding}; background: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: ${buttonFontSize};">⚙️ 设置</button>

                    </div>
                </div>

                <!-- 批量操作按钮区域 -->
                <div id="batch-operation-buttons" style="display: none; padding: ${mobile ? '15px' : '10px'}; border-bottom: 1px solid #eee; background: #f0f0f0; flex-shrink: 0;">
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: ${mobile ? '12px' : '8px'};">
                        <div style="display: flex; align-items: center; gap: ${mobile ? '10px' : '8px'};">
                            <span style="font-size: ${mobile ? '14px' : '12px'}; color: #333;">已选中: <span id="selected-count">0</span> 个</span>
                        </div>
                        <div style="display: flex; gap: ${mobile ? '8px' : '5px'};">

                            <button id="batch-select-all" style="padding: ${mobile ? '6px 10px' : '4px 8px'}; background: #2196F3; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: ${mobile ? '12px' : '11px'};">全选</button>
                            <button id="batch-select-none" style="padding: ${mobile ? '6px 10px' : '4px 8px'}; background: #666; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: ${mobile ? '12px' : '11px'};">全不选</button>
                            <button id="batch-mode-toggle" style="padding: ${buttonPadding}; background: #9C27B0; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: ${buttonFontSize};">📋 批量</button>
                        </div>
                    </div>
                    <div style="display: flex; gap: ${mobile ? '8px' : '5px'}; flex-wrap: wrap;">
                        <button id="batch-delete-btn" style="flex: 1; min-width: ${mobile ? '100px' : '80px'}; padding: ${mobile ? '8px 12px' : '6px 10px'}; background: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: ${mobile ? '14px' : '12px'}; opacity: 0.5;" disabled>批量删除</button>
                        <button id="batch-move-btn" style="flex: 1; min-width: ${mobile ? '100px' : '80px'}; padding: ${mobile ? '8px 12px' : '6px 10px'}; background: #FF9800; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: ${mobile ? '14px' : '12px'}; opacity: 0.5;" disabled>批量移动</button>
                    </div>
                </div>

                <div style="padding: ${mobile ? '15px' : '10px'}; flex-shrink: 0;">
                    <input type="text" id="search-input" placeholder="搜索书签..." style="width: 100%; padding: ${mobile ? '12px' : '8px'}; border: 1px solid #ddd; border-radius: 4px; font-size: ${mobile ? '16px' : '14px'}; box-sizing: border-box;">
                </div>
                <div id="bookmarks-list" style="flex: 1; overflow-y: auto; padding: 0 ${mobile ? '15px' : '10px'} ${mobile ? '15px' : '10px'}; position: relative;"></div>
            `;

            document.body.appendChild(panel);

            // 绑定事件
            document.getElementById('close-panel-btn').addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.togglePanel();
            });
            document.getElementById('add-bookmark-btn').addEventListener('click', () => this.showAddBookmarkDialog());
            document.getElementById('add-category-btn').addEventListener('click', () => this.showCategoryManagement());
            document.getElementById('sync-settings-btn').addEventListener('click', () => this.showSyncSettings());
            document.getElementById('search-input').addEventListener('input', (e) => this.handleSearch(e.target.value));

            // 绑定批量操作相关事件
            document.getElementById('batch-mode-toggle').addEventListener('click', () => this.toggleBatchMode());
            document.getElementById('batch-select-all').addEventListener('click', () => this.selectAllBookmarks(true));
            document.getElementById('batch-select-none').addEventListener('click', () => this.selectAllBookmarks(false));
            document.getElementById('batch-delete-btn').addEventListener('click', () => this.batchDeleteBookmarks());
            document.getElementById('batch-move-btn').addEventListener('click', () => this.batchMoveBookmarks());

            this.updateUI();
        }

        // 显示/隐藏面板
        async togglePanel() {
            // 在显示面板前进行密码验证
            const isVerified = await verifyPassword();
            if (!isVerified) {
                return; // 验证失败，不显示面板
            }

            const panel = document.getElementById('bookmark-panel');
            if (panel) {
                if (panel.style.display === 'none') {
                    panel.style.display = 'flex';
                    this.updateUI();
                } else {
                    panel.style.display = 'none';
                }
            }
        }

        // 显示面板（用于菜单命令）
        async showPanel() {
            // 在显示面板前进行密码验证
            const isVerified = await verifyPassword();
            if (!isVerified) {
                return; // 验证失败，不显示面板
            }

            const panel = document.getElementById('bookmark-panel');
            if (panel) {
                panel.style.display = 'flex';
                this.updateUI();
            }
        }

        // 更新UI
        updateUI() {
            const list = document.getElementById('bookmarks-list');
            if (!list) return;

            // 更新批量操作按钮显示状态
            const batchButtons = document.getElementById('batch-operation-buttons');
            const batchToggleBtn = document.getElementById('batch-mode-toggle');

            if (batchButtons && batchToggleBtn) {
                batchButtons.style.display = this.batchMode ? 'block' : 'none';
                batchToggleBtn.style.background = this.batchMode ? '#E91E63' : '#9C27B0';
                batchToggleBtn.textContent = this.batchMode ? ' 关闭批量 ✖' : '📋 批量';
            }

            // 动态计算书签列表的最大高度 - 延迟计算确保DOM更新完成
            setTimeout(() => {
                const maxHeight = this.calculateBookmarkListMaxHeight();
                list.style.maxHeight = maxHeight + 'px';
                console.log('设置书签列表最大高度:', maxHeight + 'px');
            }, 0);

            const searchQuery = document.getElementById('search-input')?.value || '';

            if (searchQuery) {
                // 搜索模式：显示所有匹配的书签
                const bookmarks = this.searchBookmarks(searchQuery);
                if (bookmarks.length === 0) {
                    list.innerHTML = '<div style="text-align: center; color: #666; padding: 20px;">未找到匹配的书签</div>';
                    return;
                }

                list.innerHTML = bookmarks.map(bookmark => this.renderBookmark(bookmark, true)).join('');
            } else {
                // 分类模式：按层级显示分类和书签
                let html = '';
                html += this.renderCategoryTree(this.categories);
                list.innerHTML = html;
            }

            // 重新绑定事件
            this.bindBookmarkEvents();

            // 更新同步状态
            const statusText = document.getElementById('sync-status-text');
            if (statusText) {
                statusText.textContent = this.syncEnabled ? this.formatSyncTime(this.lastSyncTime) : '未配置云同步';
            }

            // 如果是批量模式，更新UI状态
            if (this.batchMode) {
                this.updateBatchModeUI();
            }
        }

        // 渲染分类树
        renderCategoryTree(categories) {
            const mobile = isMobile();

            // 构建分类树结构
            const categoryMap = new Map();
            categories.forEach(category => {
                categoryMap.set(category.id, {
                    ...category,
                    children: []
                });
            });

            // 建立父子关系
            const rootCategories = [];
            categories.forEach(category => {
                const categoryNode = categoryMap.get(category.id);

                if (category.parentId && categoryMap.has(category.parentId)) {
                    const parent = categoryMap.get(category.parentId);
                    parent.children.push(categoryNode);
                } else {
                    rootCategories.push(categoryNode);
                }
            });

            // 排序函数
            const sortCategories = (cats) => {
                cats.sort((a, b) => (a.order || 0) - (b.order || 0));
                cats.forEach(cat => {
                    if (cat.children.length > 0) {
                        sortCategories(cat.children);
                    }
                });
            };

            sortCategories(rootCategories);

            // 渲染分类树
            const renderCategory = (category, level = 0) => {
                const isExpanded = category.expanded;
                const bookmarks = this.getBookmarksByCategory(category.id);
                const bookmarkCount = bookmarks.length;
                const hasChildren = category.children.length > 0;

                const indent = level * (mobile ? 20 : 15);

                let html = `<div class="category-container" style="margin-bottom: ${mobile ? '8px' : '4px'};">`;

                // 分类标题 - 移除sticky定位，避免遮挡问题
                html += `
                    <div class="category-header"
                         style="background: ${isExpanded ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f5f5f5'};
                                padding: ${mobile ? '10px' : '6px'};
                                margin-left: ${indent}px;
                                border: ${isExpanded ? '2px solid #5a67d8' : '1px solid #ddd'};
                                border-radius: 6px; cursor: pointer; transition: all 0.3s ease;
                                ${isExpanded ? 'box-shadow: 0 2px 8px rgba(0,0,0,0.15); font-weight: bold; text-shadow: 0 1px 2px rgba(0,0,0,0.5);' : ''}
                                margin-bottom: ${mobile ? '6px' : '3px'};"
                         data-category-toggle="${category.id}">
                        <div style="display: flex; align-items: center; justify-content: space-between;">
                            <div style="display: flex; align-items: center;">
                                <span style="margin-right: ${mobile ? '10px' : '6px'}; font-size: ${mobile ? '14px' : '12px'}; color: ${isExpanded ? 'white' : '#333'};">
                                    ${hasChildren || bookmarkCount > 0 ? (isExpanded ? '📂' : '📁') : '📄'}
                                </span>
                                <span style="font-weight: ${isExpanded ? 'bold' : '500'}; color: ${isExpanded ? 'white' : '#333'}; font-size: ${mobile ? '14px' : '12px'};">
                                    ${category.name}
                                </span>
                                <span style="margin-left: ${mobile ? '10px' : '6px'}; font-size: ${mobile ? '12px' : '10px'}; color: ${isExpanded ? 'rgba(255,255,255,0.8)' : '#666'};">
                                    (${bookmarkCount}${hasChildren ? `+${this.getTotalChildBookmarks(category)}` : ''})
                                </span>
                            </div>
                        </div>
                    </div>
                `;

                // 分类内容
                if (isExpanded) {
                    html += `<div class="category-content" style="margin-left: ${indent}px;">`;

                    // 先显示书签
                    if (bookmarks.length > 0) {
                        bookmarks.forEach(bookmark => {
                            html += this.renderBookmark(bookmark, false, level + 1);
                        });
                    }

                    // 再显示子分类
                    if (hasChildren) {
                        category.children.forEach(child => {
                            html += renderCategory(child, level + 1);
                        });
                    }

                    html += '</div>';
                }

                html += '</div>';
                return html;
            };

            let html = '';
            rootCategories.forEach(category => {
                html += renderCategory(category, 0);
            });

            return html;
        }

        // 获取分类及其所有子分类的书签总数
        getTotalChildBookmarks(category) {
            let total = 0;
            category.children.forEach(child => {
                total += this.getBookmarksByCategory(child.id).length;
                total += this.getTotalChildBookmarks(child);
            });
            return total;
        }

        // 渲染书签 - 增加底部边距，确保最后一个书签完全显示
        renderBookmark(bookmark, showCategory = false, level = 0) {
            const category = this.categories.find(c => c.id === bookmark.categoryId);
            const categoryName = category ? category.name : '未知分类';
            const mobile = isMobile();

            // 限制标题长度，防止换行
            const maxTitleLength = mobile ? 18 : 20;
            const displayTitle = bookmark.title.length > maxTitleLength
                ? bookmark.title.substring(0, maxTitleLength) + '...'
                : bookmark.title;

            // 获取favicon URL
            const faviconUrl = this.getFaviconUrl(bookmark.url);

            const indent = level * (mobile ? 20 : 15);

            // 批量模式下的复选框
            const checkboxHtml = this.batchMode ? `
                <div style="margin-right: ${mobile ? '12px' : '8px'}; display: flex; align-items: flex-start; padding-top: 2px;">
                    <input type="checkbox" data-bookmark-checkbox="${bookmark.id}"
                           style="width: ${mobile ?  '18px' : '16px'}; height: ${mobile ? '18px' : '16px'}; cursor: pointer;">
                </div>
            ` : '';

            // 增加底部边距，确保最后一个书签完全显示
            const bottomMargin = mobile ? '12px' : '8px';

            return `
                <div style="border: 1px solid #eee; border-radius: 6px; padding: ${mobile ? '12px' : '8px'}; margin-bottom: ${bottomMargin}; margin-left: ${indent}px;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                        ${checkboxHtml}
                        <div style="flex: 1; min-width: 0; margin-right: ${mobile ? '8px' : '6px'};">
                            <a href="${bookmark.url}" target="_blank"
                               title="${bookmark.title} - ${bookmark.url}"
                               style="color: #1976D2; text-decoration: none; font-weight: 500; font-size: ${mobile ? '14px' : '12px'}; display: flex; align-items: center; margin-bottom: ${mobile ? '6px' : '3px'}; line-height: 1.4; word-break: break-all;">
                               <img src="${faviconUrl}"
                                    style="width: 14px; height: 14px; margin-right: 6px; flex-shrink: 0; border-radius: 2px;"
                                    onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSIjQ0NDIiByeD0iMiIvPgo8L3N2Zz4K'">
                               ${displayTitle}
                            </a>
                            ${showCategory ? `<div style="font-size: ${mobile ? '11px' : '10px'}; color: #888; margin-bottom: ${mobile ? '6px' : '3px'};">分类: ${categoryName}</div>` : ''}
                            ${bookmark.tags.length > 0 ? `<div style="font-size: ${mobile ? '11px' : '10px'}; text-align: left;">${bookmark.tags.map(tag => `<span style="background: #4CAF50; color: #ffffff; padding: ${mobile ? '3px 6px' : '2px 4px'}; border-radius: 3px; margin-right: ${mobile ? '4px' : '3px'}; display: inline-block; margin-bottom: 2px; font-size: ${mobile ? '10px' : '9px'};">${tag}</span>`).join('')}</div>` : ''}
                        </div>
                        ${!this.batchMode ? `
                        <div style="display: flex; align-items: flex-end; position: relative;">
                            <button data-bookmark-settings="${bookmark.id}" style="color: white; border: none; border-radius: 3px; padding: ${mobile ? '6px 8px' : '3px 6px'}; cursor: pointer; font-size: ${mobile ? '14px' : '12px'}; white-space: nowrap; margin-bottom: ${mobile ? '6px' : '3px'};">⚙️</button>
                            <div id="bookmark-actions-${bookmark.id}" style="display: none; position: absolute; top: 100%; right: 0; background: white; border: 1px solid #ddd; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.15); z-index: 1000; min-width: ${mobile ? '180px' : '160px'};">
                                <div style="display: flex; flex-direction: row;">
                                    <button data-batch-mode-toggle="${bookmark.id}" style="white-space: nowrap; flex: 1; background: #9C27B0; color: white; border: none; padding: ${mobile ? '8px 10px' : '5px 8px'}; cursor: pointer; font-size: ${mobile ? '12px' : '10px'}; text-align: center; border-radius: 4px 0 0 4px;">批量</button>
                                    <button data-bookmark-edit="${bookmark.id}" style="white-space: nowrap; flex: 1; background: #4CAF50; color: white; border: none; padding: ${mobile ? '8px 10px' : '5px 8px'}; cursor: pointer; font-size: ${mobile ? '12px' : '10px'}; text-align: center;">编辑</button>
                                    <button data-bookmark-move="${bookmark.id}" style="white-space: nowrap; flex: 1; background: #FF9800; color: white; border: none; padding: ${mobile ? '8px 10px' : '5px 8px'}; cursor: pointer; font-size: ${mobile ? '12px' : '10px'}; text-align: center;">移动</button>
                                    <button data-bookmark-delete="${bookmark.id}" style="white-space: nowrap; flex: 1; background: #f44336; color: white; border: none; padding: ${mobile ? '8px 10px' : '5px 8px'}; cursor: pointer; font-size: ${mobile ? '12px' : '10px'}; text-align: center; border-radius: 0 4px 4px 0;">删除</button>
                                </div>
                            </div>
                        </div>
                        ` : ''}
                    </div>
                </div>

            `;
        }

        // 绑定书签相关事件
        bindBookmarkEvents() {
            // 绑定分类切换事件
            document.querySelectorAll('[data-category-toggle]').forEach(element => {
                element.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const categoryId = element.getAttribute('data-category-toggle');
                    this.toggleCategory(categoryId);
                });
            });

            // 绑定批量选择复选框事件
            document.querySelectorAll('[data-bookmark-checkbox]').forEach(checkbox => {
                checkbox.addEventListener('change', (e) => {
                    const bookmarkId = checkbox.getAttribute('data-bookmark-checkbox');
                    this.toggleBookmarkSelection(bookmarkId);
                });
            });

            // 绑定设置按钮事件
            document.querySelectorAll('[data-bookmark-settings]').forEach(element => {
                element.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const bookmarkId = element.getAttribute('data-bookmark-settings');
                    const actionsDiv = document.getElementById(`bookmark-actions-${bookmarkId}`);

                    // 先隐藏所有其他打开的操作按钮
                    document.querySelectorAll('[id^="bookmark-actions-"]').forEach(div => {
                        if (div.id !== `bookmark-actions-${bookmarkId}`) {
                            div.style.display = 'none';
                        }
                    });

                    // 切换当前操作按钮的显示状态
                    if (actionsDiv.style.display === 'none' || actionsDiv.style.display === '') {
                        actionsDiv.style.display = 'flex';
                        actionsDiv.style.flexDirection = 'column';
                    } else {
                        actionsDiv.style.display = 'none';
                    }
                });
            });

            // 绑定书签编辑事件
            document.querySelectorAll('[data-bookmark-edit]').forEach(element => {
                element.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const bookmarkId = element.getAttribute('data-bookmark-edit');
                    this.showEditBookmarkDialog(bookmarkId);
                });
            });

            // 绑定书签删除事件
            document.querySelectorAll('[data-bookmark-delete]').forEach(element => {
                element.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const bookmarkId = element.getAttribute('data-bookmark-delete');
                    if (confirm('确定要删除这个书签吗？')) {
                        this.deleteBookmark(bookmarkId);
                    }
                });
            });

            // 绑定书签移动事件
            document.querySelectorAll('[data-bookmark-move]').forEach(element => {
                element.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const bookmarkId = element.getAttribute('data-bookmark-move');
                    this.showMoveBookmarkDialog(bookmarkId);
                });
            });

            // 绑定单个书签的批量模式切换事件
            document.querySelectorAll('[data-batch-mode-toggle]').forEach(element => {
                element.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.toggleBatchMode();
                });
            });

            // 点击其他地方时隐藏操作按钮
            document.addEventListener('click', (e) => {
                if (!e.target.closest('[data-bookmark-settings]') && !e.target.closest('[id^="bookmark-actions-"]')) {
                    document.querySelectorAll('[id^="bookmark-actions-"]').forEach(div => {
                        div.style.display = 'none';
                    });
                }
            });
        }

        // 处理搜索
        handleSearch(query) {
            this.updateUI();
        }

        // 显示编辑书签对话框
        showEditBookmarkDialog(bookmarkId) {
            const bookmark = this.bookmarks.find(b => b.id === bookmarkId);
            if (!bookmark) return;

            const dialog = document.createElement('div');
            const mobile = isMobile();

            dialog.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                z-index: 10001;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: ${mobile ? '20px' : '0'};
                box-sizing: border-box;
            `;

            dialog.innerHTML = `
                <div style="background: white; padding: ${mobile ? '25px' : '20px'}; border-radius: 8px; width: ${mobile ? '100%' : '400px'}; max-width: ${mobile ? '100%' : '90vw'}; max-height: 90vh; overflow-y: auto;">
                    <h3 style="margin: 0 0 ${mobile ? '20px' : '15px'} 0; font-size: ${mobile ? '20px' : '18px'};">编辑书签</h3>
                    <div style="margin-bottom: ${mobile ? '20px' : '15px'};">
                        <label style="display: block; margin-bottom: ${mobile ? '8px' : '5px'}; font-weight: 500; font-size: ${mobile ? '16px' : '14px'};">标题:</label>
                        <input type="text" id="edit-bookmark-title" value="${bookmark.title}" style="width: 100%; padding: ${mobile ? '12px' : '8px'}; border: 1px solid #ddd; border-radius: 4px; font-size: ${mobile ? '16px' : '14px'}; box-sizing: border-box;">
                    </div>
                    <div style="margin-bottom: ${mobile ? '20px' : '15px'};">
                        <label style="display: block; margin-bottom: ${mobile ? '8px' : '5px'}; font-weight: 500; font-size: ${mobile ? '16px' : '14px'};">网址:</label>
                        <input type="url" id="edit-bookmark-url" value="${bookmark.url}" style="width: 100%; padding: ${mobile ? '12px' : '8px'}; border: 1px solid #ddd; border-radius: 4px; font-size: ${mobile ? '16px' : '14px'}; box-sizing: border-box;">
                    </div>
                    <div style="margin-bottom: ${mobile ? '25px' : '15px'};">
                        <label style="display: block; margin-bottom: ${mobile ? '8px' : '5px'}; font-weight: 500; font-size: ${mobile ? '16px' : '14px'};">标签 (用英文逗号分隔多个标签):</label>
                        <input type="text" id="edit-bookmark-tags" value="${bookmark.tags.join(', ')}" style="width: 100%; padding: ${mobile ? '12px' : '8px'}; border: 1px solid #ddd; border-radius: 4px; font-size: ${mobile ? '16px' : '14px'}; box-sizing: border-box;">
                    </div>
                    <div style="display: flex; gap: ${mobile ? '15px' : '10px'};">
                        <button id="save-bookmark-edit" style="flex: 1; padding: ${mobile ? '12px' : '8px'}; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: ${mobile ? '16px' : '14px'};">保存</button>
                        <button id="cancel-bookmark-edit" style="flex: 1; padding: ${mobile ? '12px' : '8px'}; background: #666; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: ${mobile ? '16px' : '14px'};">取消</button>
                    </div>
                </div>
            `;

            document.body.appendChild(dialog);

            document.getElementById('save-bookmark-edit').addEventListener('click', async () => {
                const title = document.getElementById('edit-bookmark-title').value.trim();
                const url = document.getElementById('edit-bookmark-url').value.trim();
                const tagsInput = document.getElementById('edit-bookmark-tags').value.trim();
                const tags = tagsInput ? tagsInput.split(',').map(t => t.trim()).filter(t => t) : [];

                if (title && url) {
                    try {
                        // 验证URL格式
                        new URL(url);
                        await this.editBookmark(bookmarkId, title, url, tags);
                        document.body.removeChild(dialog);
                    } catch (error) {
                        alert('请输入有效的网址');
                    }
                } else {
                    alert('标题和网址不能为空');
                }
            });

            document.getElementById('cancel-bookmark-edit').addEventListener('click', () => {
                document.body.removeChild(dialog);
            });

            dialog.addEventListener('click', (e) => {
                if (e.target === dialog) {
                    document.body.removeChild(dialog);
                }
            });
        }

        // 显示添加书签对话框
        showAddBookmarkDialog() {
            const dialog = document.createElement('div');
            const mobile = isMobile();

            dialog.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                z-index: 10001;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: ${mobile ? '20px' : '0'};
                box-sizing: border-box;
            `;

            const categoryOptions = this.renderCategoryOptions();

            dialog.innerHTML = `
                <div style="background: white; padding: ${mobile ? '25px' : '20px'}; border-radius: 8px; width: ${mobile ? '100%' : '400px'}; max-width: ${mobile ? '100%' : '90vw'}; max-height: 90vh; overflow-y: auto;">
                    <h3 style="margin: 0 0 ${mobile ? '20px' : '15px'} 0; font-size: ${mobile ? '20px' : '18px'};">添加书签</h3>
                    <div style="margin-bottom: ${mobile ? '20px' : '15px'};">
                        <label style="display: block; margin-bottom: ${mobile ? '8px' : '5px'}; font-weight: 500; font-size: ${mobile ? '16px' : '14px'};">标题:</label>
                        <input type="text" id="add-bookmark-title" value="${document.title}" style="width: 100%; padding: ${mobile ? '12px' : '8px'}; border: 1px solid #ddd; border-radius: 4px; font-size: ${mobile ? '16px' : '14px'}; box-sizing: border-box;">
                    </div>
                    <div style="margin-bottom: ${mobile ? '20px' : '15px'};">
                        <label style="display: block; margin-bottom: ${mobile ? '8px' : '5px'}; font-weight: 500; font-size: ${mobile ? '16px' : '14px'};">标签 (用逗号分隔):</label>
                        <input type="text" id="add-bookmark-tags" placeholder="标签1, 标签2" style="width: 100%; padding: ${mobile ? '12px' : '8px'}; border: 1px solid #ddd; border-radius: 4px; font-size: ${mobile ? '16px' : '14px'}; box-sizing: border-box;">
                    </div>
                    <div style="margin-bottom: ${mobile ? '25px' : '15px'};">
                        <label style="display: block; margin-bottom: ${mobile ? '8px' : '5px'}; font-weight: 500; font-size: ${mobile ? '16px' : '14px'};">分类:</label>
                        <select id="add-bookmark-category" style="width: 100%; padding: ${mobile ? '12px' : '8px'}; border: 1px solid #ddd; border-radius: 4px; font-size: ${mobile ? '16px' : '14px'}; box-sizing: border-box;">
                            ${categoryOptions}
                        </select>
                    </div>
                    <div style="display: flex; gap: ${mobile ? '15px' : '10px'};">
                        <button id="save-bookmark-add" style="flex: 1; padding: ${mobile ? '12px' : '8px'}; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: ${mobile ? '16px' : '14px'};">添加</button>
                        <button id="cancel-bookmark-add" style="flex: 1; padding: ${mobile ? '12px' : '8px'}; background: #666; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: ${mobile ? '16px' : '14px'};">取消</button>
                    </div>
                </div>
            `;

            document.body.appendChild(dialog);

            document.getElementById('save-bookmark-add').addEventListener('click', () => {
                const title = document.getElementById('add-bookmark-title').value.trim();
                const tagsInput = document.getElementById('add-bookmark-tags').value.trim();
                const categoryId = document.getElementById('add-bookmark-category').value;
                const tags = tagsInput ? tagsInput.split(',').map(t => t.trim()).filter(t => t) : [];

                if (title) {
                    this.addBookmark(title, window.location.href, tags, categoryId);
                    document.body.removeChild(dialog);
                }
            });

            document.getElementById('cancel-bookmark-add').addEventListener('click', () => {
                document.body.removeChild(dialog);
            });

            dialog.addEventListener('click', (e) => {
                if (e.target === dialog) {
                    document.body.removeChild(dialog);
                }
            });
        }

        // 渲染分类选项（支持层级显示）
        renderCategoryOptions() {
            // 构建分类树
            const categoryMap = new Map();
            this.categories.forEach(category => {
                categoryMap.set(category.id, {
                    ...category,
                    children: []
                });
            });

            const rootCategories = [];
            this.categories.forEach(category => {
                const categoryNode = categoryMap.get(category.id);

                if (category.parentId && categoryMap.has(category.parentId)) {
                    const parent = categoryMap.get(category.parentId);
                    parent.children.push(categoryNode);
                } else {
                    rootCategories.push(categoryNode);
                }
            });

            // 排序
            const sortCategories = (cats) => {
                cats.sort((a, b) => (a.order || 0) - (b.order || 0));
                cats.forEach(cat => {
                    if (cat.children.length > 0) {
                        sortCategories(cat.children);
                    }
                });
            };

            sortCategories(rootCategories);

            // 生成选项
            const renderOptions = (categories, level = 0) => {
                let options = '';
                const prefix = '　'.repeat(level); // 使用全角空格缩进

                categories.forEach(category => {
                    options += `<option value="${category.id}">${prefix}${category.name}</option>`;
                    if (category.children.length > 0) {
                        options += renderOptions(category.children, level + 1);
                    }
                });

                return options;
            };

            return renderOptions(rootCategories);
        }

        // 显示分类选择对话框
        showCategorySelectionDialog(callback) {
            const dialog = document.createElement('div');
            const mobile = isMobile();

            dialog.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                z-index: 10001;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: ${mobile ? '20px' : '0'};
                box-sizing: border-box;
            `;

            const categoryOptions = this.renderCategoryOptions();

            dialog.innerHTML = `
                <div style="background: white; padding: ${mobile ? '25px' : '20px'}; border-radius: 8px; width: ${mobile ? '100%' : '300px'}; max-width: ${mobile ? '100%' : '90vw'};">
                    <h3 style="margin: 0 0 ${mobile ? '20px' : '15px'} 0; font-size: ${mobile ? '20px' : '18px'};">选择分类</h3>
                    <select id="category-select" style="width: 100%; padding: ${mobile ? '12px' : '8px'}; border: 1px solid #ddd; border-radius: 4px; margin-bottom: ${mobile ? '20px' : '15px'}; font-size: ${mobile ? '16px' : '14px'}; box-sizing: border-box;">
                        ${categoryOptions}
                    </select>
                    <div style="display: flex; gap: ${mobile ? '15px' : '10px'};">
                        <button id="confirm-category" style="flex: 1; padding: ${mobile ? '12px' : '8px'}; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: ${mobile ? '16px' : '14px'};">确定</button>
                        <button id="cancel-category" style="flex: 1; padding: ${mobile ? '12px' : '8px'}; background: #666; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: ${mobile ? '16px' : '14px'};">取消</button>
                    </div>
                </div>
            `;

            document.body.appendChild(dialog);

            document.getElementById('confirm-category').addEventListener('click', () => {
                const selectedCategoryId = document.getElementById('category-select').value;
                callback(selectedCategoryId);
                document.body.removeChild(dialog);
            });

            document.getElementById('cancel-category').addEventListener('click', () => {
                document.body.removeChild(dialog);
            });

            dialog.addEventListener('click', (e) => {
                if (e.target === dialog) {
                    document.body.removeChild(dialog);
                }
            });
        }

        // 显示移动书签对话框
        showMoveBookmarkDialog(bookmarkId) {
            this.showCategorySelectionDialog((categoryId) => {
                this.moveBookmarkToCategory(bookmarkId, categoryId);
            });
        }

        // 显示分类管理对话框
        showCategoryManagement() {
            const dialog = document.createElement('div');
            const mobile = isMobile();

            dialog.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                z-index: 10001;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: ${mobile ? '20px' : '0'};
                box-sizing: border-box;
            `;

            dialog.innerHTML = `
                <div style="background: white; padding: ${mobile ? '25px' : '20px'}; border-radius: 8px; width: ${mobile ? '100%' : '500px'}; max-width: ${mobile ? '100%' : '90vw'}; max-height: 90vh; overflow-y: auto;">
                    <h3 style="margin: 0 0 ${mobile ? '20px' : '15px'} 0; font-size: ${mobile ? '20px' : '18px'};">多级分类管理</h3>

                    <div style="margin-bottom: ${mobile ? '20px' : '15px'}; padding: ${mobile ? '15px' : '10px'}; border: 1px solid #eee; border-radius: 6px;">
                        <h4 style="margin: 0 0 ${mobile ? '15px' : '10px'} 0; font-size: ${mobile ? '16px' : '14px'};">添加新分类</h4>
                        <div style="margin-bottom: ${mobile ? '15px' : '10px'};">
                            <label style="display: block; margin-bottom: ${mobile ? '8px' : '5px'}; font-weight: 500; font-size: ${mobile ? '14px' : '12px'};">分类名称:</label>
                            <input type="text" id="new-category-name" placeholder="输入分类名称" style="width: 100%; padding: ${mobile ? '12px' : '8px'}; border: 1px solid #ddd; border-radius: 4px; font-size: ${mobile ? '16px' : '14px'}; box-sizing: border-box;">
                        </div>
                        <div style="margin-bottom: ${mobile ? '15px' : '10px'};">
                            <label style="display: block; margin-bottom: ${mobile ? '8px' : '5px'}; font-weight: 500; font-size: ${mobile ? '14px' : '12px'};">父分类:</label>
                            <select id="parent-category-select" style="width: 100%; padding: ${mobile ? '12px' : '8px'}; border: 1px solid #ddd; border-radius: 4px; font-size: ${mobile ? '16px' : '14px'}; box-sizing: border-box;">
                                <option value="">无（作为根分类）</option>
                                ${this.renderCategoryOptions()}
                            </select>
                        </div>
                        <button id="add-new-category" style="width: 100%; padding: ${mobile ? '12px' : '8px'}; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: ${mobile ? '16px' : '14px'};">添加分类</button>
                    </div>

                    <div id="category-list" style="max-height: ${mobile ? '50vh' : '300px'}; overflow-y: auto; border: 1px solid #eee; border-radius: 4px; padding: ${mobile ? '15px' : '10px'};">
                        ${this.renderCategoryManagementList()}
                    </div>
                    <div style="margin-top: ${mobile ? '20px' : '15px'}; text-align: right;">
                        <button id="close-category-dialog" style="padding: ${mobile ? '12px 20px' : '8px 16px'}; background: #666; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: ${mobile ? '16px' : '14px'};">关闭</button>
                    </div>
                </div>
            `;

            document.body.appendChild(dialog);

            // 绑定添加分类事件
            document.getElementById('add-new-category').addEventListener('click', async () => {
                const name = document.getElementById('new-category-name').value.trim();
                const parentId = document.getElementById('parent-category-select').value || null;

                if (name) {
                    await this.addCategory(name, parentId);
                    document.getElementById('new-category-name').value = '';
                    document.getElementById('parent-category-select').value = '';

                    // 更新父分类选择器
                    document.getElementById('parent-category-select').innerHTML = `
                        <option value="">无（作为根分类）</option>
                        ${this.renderCategoryOptions()}
                    `;

                    // 更新分类列表
                    document.getElementById('category-list').innerHTML = this.renderCategoryManagementList();
                    this.bindCategoryManagementEvents();
                }
            });

            document.getElementById('close-category-dialog').addEventListener('click', () => {
                document.body.removeChild(dialog);
            });

            dialog.addEventListener('click', (e) => {
                if (e.target === dialog) {
                    document.body.removeChild(dialog);
                }
            });

            // 绑定分类管理事件
            this.bindCategoryManagementEvents();
        }

        // 绑定分类管理事件
        bindCategoryManagementEvents() {
            // 绑定上移事件
            document.querySelectorAll('[data-category-up]').forEach(element => {
                element.addEventListener('click', async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const categoryId = element.getAttribute('data-category-up');
                    await this.moveCategoryUp(categoryId);
                    document.getElementById('category-list').innerHTML = this.renderCategoryManagementList();
                    this.bindCategoryManagementEvents();
                });
            });

            // 绑定下移事件
            document.querySelectorAll('[data-category-down]').forEach(element => {
                element.addEventListener('click', async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const categoryId = element.getAttribute('data-category-down');
                    await this.moveCategoryDown(categoryId);
                    document.getElementById('category-list').innerHTML = this.renderCategoryManagementList();
                    this.bindCategoryManagementEvents();
                });
            });

            // 绑定重命名事件
            document.querySelectorAll('[data-category-mgmt-rename]').forEach(element => {
                element.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const categoryId = element.getAttribute('data-category-mgmt-rename');
                    this.showRenameCategoryDialog(categoryId);
                });
            });

            // 绑定删除事件
            document.querySelectorAll('[data-category-mgmt-delete]').forEach(element => {
                element.addEventListener('click', async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const categoryId = element.getAttribute('data-category-mgmt-delete');
                    const category = this.categories.find(c => c.id === categoryId);
                    const childCategories = this.getAllChildCategories(categoryId);
                    const totalBookmarks = this.getBookmarksByCategory(categoryId).length +
                                         childCategories.reduce((sum, childId) => sum + this.getBookmarksByCategory(childId).length, 0);

                    let confirmMessage = `确定要删除分类"${category.name}"吗？`;
                    if (childCategories.length > 0) {
                        confirmMessage += `\n这将同时删除 ${childCategories.length} 个子分类。`;
                    }
                    if (totalBookmarks > 0) {
                        confirmMessage += `\n共 ${totalBookmarks} 个书签将移动到默认分类。`;
                    }

                    if (confirm(confirmMessage)) {
                        await this.deleteCategory(categoryId);
                        document.getElementById('category-list').innerHTML = this.renderCategoryManagementList();
                        this.bindCategoryManagementEvents();
                    }
                });
            });
        }

        // 渲染分类管理列表
        renderCategoryManagementList() {
            const mobile = isMobile();

            // 构建分类树
            const categoryMap = new Map();
            this.categories.forEach(category => {
                categoryMap.set(category.id, {
                    ...category,
                    children: []
                });
            });

            const rootCategories = [];
            this.categories.forEach(category => {
                const categoryNode = categoryMap.get(category.id);

                if (category.parentId && categoryMap.has(category.parentId)) {
                    const parent = categoryMap.get(category.parentId);
                    parent.children.push(categoryNode);
                } else {
                    rootCategories.push(categoryNode);
                }
            });

            // 排序
            const sortCategories = (cats) => {
                cats.sort((a, b) => (a.order || 0) - (b.order || 0));
                cats.forEach(cat => {
                    if (cat.children.length > 0) {
                        sortCategories(cat.children);
                    }
                });
            };

            sortCategories(rootCategories);

            // 渲染分类树
            const renderCategory = (category, level = 0) => {
                const bookmarkCount = this.getBookmarksByCategory(category.id).length;
                const childBookmarkCount = this.getTotalChildBookmarks(category);
                const totalBookmarks = bookmarkCount + childBookmarkCount;

                const indent = level * (mobile ? 20 : 15);
                const prefix = '　'.repeat(level);

                // 获取同级分类以判断是否可以上移下移
                const siblings = this.categories.filter(c => c.parentId === category.parentId);
                siblings.sort((a, b) => (a.order || 0) - (b.order || 0));
                const currentIndex = siblings.findIndex(c => c.id === category.id);
                const isFirst = currentIndex === 0;
                const isLast = currentIndex === siblings.length - 1;

                let html = `
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: ${mobile ? '12px' : '8px'}; border-bottom: 1px solid #eee; margin-left: ${indent}px;">
                        <div style="flex: 1;">
                            <span style="font-weight: 500; font-size: ${mobile ? '16px' : '14px'};">${prefix}${category.name}</span>
                            <span style="margin-left: ${mobile ? '12px' : '8px'}; font-size: ${mobile ? '14px' : '12px'}; color: #666;">
                                (${totalBookmarks} 个书签${category.children.length > 0 ? `, ${category.children.length} 个子分类` : ''})
                            </span>
                        </div>
                        <div style="display: flex; gap: ${mobile ? '8px' : '4px'}; align-items: center;">
                            ${!isFirst ? `<button data-category-up="${category.id}" style="background: #2196F3; color: white; border: none; border-radius: 3px; padding: ${mobile ? '6px 10px' : '4px 8px'}; cursor: pointer; font-size: ${mobile ? '14px' : '11px'};">↑</button>` : ''}
                            ${!isLast ? `<button data-category-down="${category.id}" style="background: #2196F3; color: white; border: none; border-radius: 3px; padding: ${mobile ? '6px 10px' : '4px 8px'}; cursor: pointer; font-size: ${mobile ? '14px' : '11px'};">↓</button>` : ''}
                            ${category.id !== 'default' ? `
                                <button data-category-mgmt-rename="${category.id}" style="background: #FF9800; color: white; border: none; border-radius: 3px; padding: ${mobile ? '6px 10px' : '4px 8px'}; cursor: pointer; font-size: ${mobile ? '14px' : '11px'};">重命名</button>
                                <button data-category-mgmt-delete="${category.id}" style="background: #f44336; color: white; border: none; border-radius: 3px; padding: ${mobile ? '6px 10px' : '4px 8px'}; cursor: pointer; font-size: ${mobile ? '14px' : '11px'};">删除</button>
                            ` : `<span style="font-size: ${mobile ? '13px' : '11px'}; color: #999;">默认分类</span>`}
                        </div>
                    </div>
                `;

                // 渲染子分类
                if (category.children.length > 0) {
                    category.children.forEach(child => {
                        html += renderCategory(child, level + 1);
                    });
                }

                return html;
            };

            let html = '';
            rootCategories.forEach(category => {
                html += renderCategory(category, 0);
            });

            return html;
        }

        // 显示重命名分类对话框
        showRenameCategoryDialog(categoryId) {
            const category = this.categories.find(c => c.id === categoryId);
            if (!category) return;

            const dialog = document.createElement('div');
            const mobile = isMobile();

            dialog.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                z-index: 10002;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: ${mobile ? '20px' : '0'};
                box-sizing: border-box;
            `;

            dialog.innerHTML = `
                <div style="background: white; padding: ${mobile ? '25px' : '20px'}; border-radius: 8px; width: ${mobile ? '100%' : '350px'}; max-width: ${mobile ? '100%' : '90vw'};">
                    <h3 style="margin: 0 0 ${mobile ? '20px' : '15px'} 0; font-size: ${mobile ? '20px' : '18px'};">重命名分类</h3>
                    <input type="text" id="rename-category-input" value="${category.name}" style="width: 100%; padding: ${mobile ? '12px' : '8px'}; border: 1px solid #ddd; border-radius: 4px; margin-bottom: ${mobile ? '20px' : '15px'}; font-size: ${mobile ? '16px' : '14px'}; box-sizing: border-box;">
                    <div style="display: flex; gap: ${mobile ? '15px' : '10px'};">
                        <button id="confirm-rename" style="flex: 1; padding: ${mobile ? '12px' : '8px'}; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: ${mobile ? '16px' : '14px'};">确定</button>
                        <button id="cancel-rename" style="flex: 1; padding: ${mobile ? '12px' : '8px'}; background: #666; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: ${mobile ? '16px' : '14px'};">取消</button>
                    </div>
                </div>
            `;

            document.body.appendChild(dialog);

            const input = document.getElementById('rename-category-input');
            input.focus();
            input.select();

            document.getElementById('confirm-rename').addEventListener('click', async () => {
                const newName = input.value.trim();
                if (newName && newName !== category.name) {
                    await this.renameCategory(categoryId, newName);
                    document.getElementById('category-list').innerHTML = this.renderCategoryManagementList();
                    this.bindCategoryManagementEvents();
                }
                document.body.removeChild(dialog);
            });

            document.getElementById('cancel-rename').addEventListener('click', () => {
                document.body.removeChild(dialog);
            });

            dialog.addEventListener('click', (e) => {
                if (e.target === dialog) {
                    document.body.removeChild(dialog);
                }
            });

            // 回车确认
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    document.getElementById('confirm-rename').click();
                }
            });
        }

        // 显示同步设置
        showSyncSettings() {
            const config = this.getWebDAVConfig();
            const mobile = isMobile();

            const dialog = document.createElement('div');
            dialog.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                z-index: 10001;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: ${mobile ? '20px' : '0'};
                box-sizing: border-box;
            `;

            dialog.innerHTML = `
                <div style="background: white; padding: ${mobile ? '25px' : '20px'}; border-radius: 8px; width: ${mobile ? '100%' : '450px'}; max-width: ${mobile ? '100%' : '90vw'}; max-height: 90vh; overflow-y: auto;">
                    <h3 style="margin: 0 0 ${mobile ? '20px' : '15px'} 0; font-size: ${mobile ? '20px' : '18px'};">设置</h3>

                    <div style="margin-bottom: ${mobile ? '20px' : '15px'}; padding: ${mobile ? '15px' : '10px'}; border: 1px solid #eee; border-radius: 6px;">
                        <h4 style="margin: 0 0 ${mobile ? '15px' : '10px'} 0; font-size: ${mobile ? '18px' : '16px'};">界面设置</h4>
                        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: ${mobile ? '15px' : '10px'};">
                            <label style="font-size: ${mobile ? '16px' : '14px'};">显示拖动图标按钮</label>
                            <label style="position: relative; display: inline-block; width: 60px; height: 34px;">
                                <input type="checkbox" id="drag-icon-toggle" ${this.getDragIconVisible() ? 'checked' : ''} style="opacity: 0; width: 0; height: 0;">
                                <span style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: ${this.getDragIconVisible() ? '#4CAF50' : '#ccc'}; transition: .4s; border-radius: 34px;">
                                    <span style="position: absolute; content: ''; height: 26px; width: 26px; left: ${this.getDragIconVisible() ? '30px' : '4px'}; bottom: 4px; background-color: white; transition: .4s; border-radius: 50%;"></span>
                                </span>
                            </label>
                        </div>
                        <div style="display: flex; align-items: center; justify-content: space-between;">
                            <label style="font-size: ${mobile ? '16px' : '14px'};">拖动按钮图标透明度:</label>
                            <div style="display: flex; align-items: center; gap: 10px;">
                                <input type="range" id="opacity-slider" min="0.1" max="1" step="0.1" value="${this.getButtonOpacity()}" style="width: 100px;">
                                <span id="opacity-value" style="font-size: ${mobile ? '14px' : '12px'}; color: #666; min-width: 30px;">${this.getButtonOpacity()}</span>
                            </div>
                        </div>
                    </div>

                    <div style="margin-bottom: ${mobile ? '20px' : '15px'}; padding: ${mobile ? '15px' : '10px'}; border: 1px solid #eee; border-radius: 6px;">
                        <h4 style="margin: 0 0 ${mobile ? '15px' : '10px'} 0; font-size: ${mobile ? '18px' : '16px'};">WebDAV云同步设置</h4>

                        <div style="margin-bottom: ${mobile ? '15px' : '10px'};">
                            <label style="display: block; margin-bottom: ${mobile ? '8px' : '5px'}; font-weight: 500; font-size: ${mobile ? '16px' : '14px'};">服务器地址:</label>
                            <input type="text" id="webdav-url" value="${config.url}" placeholder="https://dav.jianguoyun.com/dav/" style="width: 100%; padding: ${mobile ? '12px' : '8px'}; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; font-size: ${mobile ? '16px' : '14px'};">
                        </div>

                        <div style="margin-bottom: ${mobile ? '15px' : '10px'};">
                            <label style="display: block; margin-bottom: ${mobile ? '8px' : '5px'}; font-weight: 500; font-size: ${mobile ? '16px' : '14px'};">用户名:</label>
                            <input type="text" id="webdav-username" value="${config.username}" style="width: 100%; padding: ${mobile ? '12px' : '8px'}; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; font-size: ${mobile ? '16px' : '14px'};">
                        </div>

                        <div style="margin-bottom: ${mobile ? '20px' : '15px'};">
                            <label style="display: block; margin-bottom: ${mobile ? '8px' : '5px'}; font-weight: 500; font-size: ${mobile ? '16px' : '14px'};">密码:</label>
                            <input type="password" id="webdav-password" value="${config.password}" style="width: 100%; padding: ${mobile ? '12px' : '8px'}; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; font-size: ${mobile ? '16px' : '14px'};">
                        </div>

                        <div style="display: flex; gap: ${mobile ? '10px' : '10px'}; margin-bottom: ${mobile ? '20px' : '15px'}; flex-wrap: wrap;">
                            <button id="test-connection" style="flex: 1; min-width: ${mobile ? '120px' : '80px'}; padding: ${mobile ? '12px' : '8px'}; background: #FF9800; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: ${mobile ? '14px' : '12px'};">测试连接</button>
                            <button id="sync-from-cloud" style="flex: 1; min-width: ${mobile ? '120px' : '80px'}; padding: ${mobile ? '12px' : '8px'}; background: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: ${mobile ? '14px' : '12px'};">从云端同步</button>
                            <button id="sync-to-cloud" style="flex: 1; min-width: ${mobile ? '120px' : '80px'}; padding: ${mobile ? '12px' : '8px'}; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: ${mobile ? '14px' : '12px'};">同步到云端</button>
                        </div>

                        <div style="display: flex; gap: ${mobile ? '10px' : '10px'}; margin-bottom: ${mobile ? '20px' : '15px'}; flex-wrap: wrap;">
                            <button id="import-bookmark-btn-settings" style="flex: 1; min-width: ${mobile ? '120px' : '80px'}; padding: ${mobile ? '12px' : '8px'}; background: #9C27B0; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: ${mobile ? '14px' : '12px'};">书签导入</button>
                            <button id="export-bookmark-btn-settings" style="flex: 1; min-width: ${mobile ? '120px' : '80px'}; padding: ${mobile ? '12px' : '8px'}; background: #607D8B; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: ${mobile ? '14px' : '12px'};">书签导出</button>
                        </div>

                    </div>

                    <div style="display: flex; gap: ${mobile ? '15px' : '10px'};">
                        <button id="save-config" style="flex: 1; padding: ${mobile ? '12px' : '8px'}; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: ${mobile ? '16px' : '14px'};">保存设置</button>
                        <button id="cancel-config" style="flex: 1; padding: ${mobile ? '12px' : '8px'}; background: #666; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: ${mobile ? '16px' : '14px'};">取消</button>
                    </div>

                    <div id="sync-status" style="margin-top: ${mobile ? '15px' : '10px'}; padding: ${mobile ? '12px' : '8px'}; border-radius: 4px; display: none; font-size: ${mobile ? '14px' : '12px'};"></div>
                </div>
            `;

            document.body.appendChild(dialog);

            // 绑定开关切换事件
            const toggle = document.getElementById('drag-icon-toggle');
            const toggleSlider = toggle.nextElementSibling;
            const toggleInner = toggleSlider.firstElementChild;

            toggle.addEventListener('change', () => {
                const isChecked = toggle.checked;
                toggleSlider.style.backgroundColor = isChecked ? '#4CAF50' : '#ccc';
                toggleInner.style.left = isChecked ? '30px' : '4px';
            });

            // 绑定透明度滑块事件
            const slider = document.getElementById('opacity-slider');
            const valueSpan = document.getElementById('opacity-value');

            slider.addEventListener('input', () => {
                const opacity = parseFloat(slider.value);
                valueSpan.textContent = opacity;
                this.saveButtonOpacity(opacity);
                this.updateFloatButtonOpacity(opacity);
            });

            // 绑定事件
            const showStatus = (message, isError = false) => {
                const status = document.getElementById('sync-status');
                status.textContent = message;
                status.style.display = 'block';
                status.style.background = isError ? '#ffebee' : '#e8f5e8';
                status.style.color = isError ? '#c62828' : '#2e7d32';
                status.style.border = `1px solid ${isError ? '#ef5350' : '#4caf50'}`;
            };

            document.getElementById('test-connection').addEventListener('click', async () => {
                const url = document.getElementById('webdav-url').value;
                const username = document.getElementById('webdav-username').value;
                const password = document.getElementById('webdav-password').value;

                if (!url || !username || !password) {
                    showStatus('请填写完整的连接信息', true);
                    return;
                }

                try {
                    showStatus('正在测试连接...');
                    this.saveWebDAVConfig(url, username, password);
                    const testClient = new WebDAVClient(url, username, password);
                    await testClient.testConnection();
                    await this.initWebDAV(url, username, password);
                    showStatus('连接测试成功！');
                } catch (error) {
                    showStatus(`连接失败: ${error.message}`, true);
                }
            });

            document.getElementById('sync-from-cloud').addEventListener('click', async () => {
                try {
                    showStatus('正在从云端同步...');
                    const success = await this.syncFromCloud();
                    if (success) {
                        showStatus('从云端同步成功！');
                    } else {
                        showStatus('云端暂无数据或同步失败', true);
                    }
                } catch (error) {
                    showStatus(`同步失败: ${error.message}`, true);
                }
            });

            document.getElementById('sync-to-cloud').addEventListener('click', async () => {
                try {
                    showStatus('正在同步到云端...');
                    await this.syncToCloud();
                    showStatus('同步到云端成功！');
                } catch (error) {
                    showStatus(`同步失败: ${error.message}`, true);
                }
            });

            // 绑定导入按钮事件
            document.getElementById('import-bookmark-btn-settings').addEventListener('click', () => {
                this.showBookmarkImportDialog();
            });

            // 绑定导出按钮事件
            document.getElementById('export-bookmark-btn-settings').addEventListener('click', () => {
                this.exportBookmarks();
                showStatus('书签导出成功！');
            });

            document.getElementById('save-config').addEventListener('click', () => {
                const url = document.getElementById('webdav-url').value;
                const username = document.getElementById('webdav-username').value;
                const password = document.getElementById('webdav-password').value;
                const dragIconVisible = document.getElementById('drag-icon-toggle').checked;

                this.saveWebDAVConfig(url, username, password);
                this.saveDragIconVisible(dragIconVisible);

                // 更新拖动图标显示状态
                const floatBtn = document.getElementById('bookmark-float-btn');
                if (dragIconVisible && !floatBtn) {
                    // 如果开启显示但按钮不存在，重新创建
                    this.createFloatButton();
                } else if (!dragIconVisible && floatBtn) {
                    // 如果关闭显示但按钮存在，移除按钮
                    floatBtn.remove();
                }

                showStatus('设置已保存');

                setTimeout(() => {
                    document.body.removeChild(dialog);
                    // 更新状态栏
                    const statusText = document.getElementById('sync-status-text');
                    if (statusText) {
                        statusText.textContent = this.syncEnabled ? this.formatSyncTime(this.lastSyncTime) : '未配置云同步';
                    }
                }, 1000);
            });

            document.getElementById('cancel-config').addEventListener('click', () => {
                document.body.removeChild(dialog);
            });

            // 点击背景关闭
            dialog.addEventListener('click', (e) => {
                if (e.target === dialog) {
                    document.body.removeChild(dialog);
                }
            });
        }

        // 注册菜单命令
        registerMenuCommands() {
            GM_registerMenuCommand('打开书签管理器', async () => {
                await this.showPanel();
            });

            GM_registerMenuCommand('添加当前页面到书签', () => {
                this.showAddBookmarkDialog();
            });

            GM_registerMenuCommand('导入书签', () => {
                this.showBookmarkImportDialog();
            });

            GM_registerMenuCommand('导出书签', () => {
                this.exportBookmarks();
            });

            GM_registerMenuCommand('功能设置', () => {
                this.showSyncSettings();
            });

            GM_registerMenuCommand('立即同步', async () => {
                try {
                    await this.syncFromCloud();
                    await this.syncToCloud();
                    alert('同步完成');
                } catch (error) {
                    alert('同步失败: ' + error.message);
                }
            });

            const targetUrl = 'https://www.cckdn.cn'; // 替换为你要跳转的网页 URL
            GM_registerMenuCommand('跳转到指定网页', () => {
                window.open(targetUrl, '_blank'); // 在新窗口中打开指定网页
            });
        }
    }

    // 代码完整性检查系统（代码保护）
    const CodeIntegrityCheck = (() => {
        const simpleHash = (str) => {
            let hash = 0;
            for (let i = 0; i < str.length; i++) {
                const char = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash;
            }
            return Math.abs(hash).toString(16);
        };

        const protectedFunctions = {
            API_URL_VALIDATOR: {
                code: JSON.stringify(API_URL_VALIDATOR),
                hash: null
            },
            verifyPasswordWithAPI: {
                code: verifyPasswordWithAPI.toString(),
                hash: null
            },
            showPasswordVerifyDialog: {
                code: showPasswordVerifyDialog.toString(),
                hash: null
            },
            needVerifyPassword: {
                code: needVerifyPassword.toString(),
                hash: null
            },
            verifyPassword: {
                code: verifyPassword.toString(),
                hash: null
            },
            getLastVerifyTime: {
                code: getLastVerifyTime.toString(),
                hash: null
            },
            saveLastVerifyTime: {
                code: saveLastVerifyTime.toString(),
                hash: null
            }
        };

        const calculateHashes = () => {
            Object.keys(protectedFunctions).forEach(key => {
                protectedFunctions[key].hash = simpleHash(protectedFunctions[key].code);
            });
            GM_setValue('code_hashes', JSON.stringify(
                Object.keys(protectedFunctions).reduce((acc, key) => {
                    acc[key] = protectedFunctions[key].hash;
                    return acc;
                }, {})
            ));
        };

        let isProtected = false;
        let tamperedDetected = false;

        const verifyIntegrity = () => {
            try {
                if (!API_URL_VALIDATOR.verify()) {
                    tamperedDetected = true;
                    GM_setValue('code_integrity_alert', `${new Date().toISOString()}: API_URL_VALIDATOR 已被篡改`);
                    throw new Error('代码完整性检查失败: API_URL_VALIDATOR 已被篡改');
                }

                const urlValidatorCode = JSON.stringify(API_URL_VALIDATOR);
                const urlValidatorHash = simpleHash(urlValidatorCode);
                if (urlValidatorHash !== protectedFunctions.API_URL_VALIDATOR.hash) {
                    tamperedDetected = true;
                    GM_setValue('code_integrity_alert', `${new Date().toISOString()}: API_URL_VALIDATOR 已被篡改`);
                    throw new Error('代码完整性检查失败: API_URL_VALIDATOR 已被篡改');
                }

                const functions = {
                    verifyPasswordWithAPI,
                    showPasswordVerifyDialog,
                    needVerifyPassword,
                    verifyPassword,
                    getLastVerifyTime,
                    saveLastVerifyTime
                };

                for (const [key, func] of Object.entries(functions)) {
                    const currentCode = func.toString();
                    const currentHash = simpleHash(currentCode);
                    const originalHash = protectedFunctions[key].hash;

                    if (currentHash !== originalHash) {
                        tamperedDetected = true;
                        GM_setValue('code_integrity_alert', `${new Date().toISOString()}: ${key} 已被篡改`);
                        throw new Error(`代码完整性检查失败: ${key} 已被篡改`);
                    }
                }
                return true;
            } catch (error) {
                console.error('代码完整性检查错误:', error.message);
                return false;
            }
        };

        const initializeProtection = () => {
            calculateHashes();
            isProtected = true;
        };

        const disableAllFunctions = () => {
            window.verifyPassword = async () => {
                alert('脚本已检测到被篡改，所有功能已禁用，请重新安装脚本');
                return false;
            };
            window.verifyPasswordWithAPI = async () => {
                throw new Error('脚本已被篡改，功能已禁用');
            };
            window.showPasswordVerifyDialog = async () => {
                throw new Error('脚本已被篡改，功能已禁用');
            };
        };

        const startMonitoring = () => {
            if (!isProtected) {
                console.warn('代码完整性检查: 保护未初始化');
                return;
            }

            setInterval(() => {
                if (!verifyIntegrity()) {
                    tamperedDetected = true;
                    console.error('检测到代码被篡改，脚本已禁用');
                    disableAllFunctions();
                }
            }, 2000);
        };

        return {
            initialize: initializeProtection,
            start: startMonitoring,
            verify: verifyIntegrity,
            isTampered: () => tamperedDetected
        };
    })();

    // 初始化代码保护
    CodeIntegrityCheck.initialize();

    // 启动前检查代码完整性
    const preStartCheck = CodeIntegrityCheck.verify();
    if (!preStartCheck) {
        console.error('初始化时代码完整性检查失败，脚本即将禁用');
        setTimeout(() => {
            alert('脚本检测到代码被篡改，所有功能已禁用');
            CodeIntegrityCheck.start();
        }, 1000);
    } else {
        // 代码完整性检查通过，启动监控
        CodeIntegrityCheck.start();
    }

    // 初始化书签管理器
    let bookmarkManager;

    // 等待页面加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            bookmarkManager = new BookmarkManager();
            window.bookmarkManager = bookmarkManager; // 全局访问
        });
    } else {
        bookmarkManager = new BookmarkManager();
        window.bookmarkManager = bookmarkManager; // 全局访问
    }

})();