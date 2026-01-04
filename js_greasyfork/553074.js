// ==UserScript==
// @name         京东Cookie快速登录
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  输入京东Cookie快速登录
// @author       默默无名
// @match        https://*.jd.com/*
// @grant        GM_xmlhttpRequest
// @connect      api.m.jd.com
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/553074/%E4%BA%AC%E4%B8%9CCookie%E5%BF%AB%E9%80%9F%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/553074/%E4%BA%AC%E4%B8%9CCookie%E5%BF%AB%E9%80%9F%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';


    // 等待body加载完成后创建UI
    function initUI() {
        if (!document.body) {
            setTimeout(initUI, 100);
            return;
        }
        
        // 创建按钮容器
        const btnContainer = document.createElement('div');
        btnContainer.className = 'jd-btn-container';
        btnContainer.setAttribute('data-jd-cookie-script', 'true');
        btnContainer.style.cssText = 'position:fixed;bottom:100px;right:20px;z-index:9999;display:flex;flex-direction:column;gap:10px';
        document.body.appendChild(btnContainer);

        // 创建悬浮按钮
        const floatBtn = document.createElement('div');
    floatBtn.innerHTML = '🔑';
    floatBtn.className = 'jd-cookie-login-btn';
    floatBtn.setAttribute('data-jd-cookie-script', 'true');
    floatBtn.style.cssText = 'width:50px;height:50px;background:linear-gradient(135deg,#e4393c,#ff6b6b);color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:move;box-shadow:0 4px 12px rgba(228,57,60,0.4);font-size:24px;user-select:none';
    btnContainer.appendChild(floatBtn);

    // 创建主页按钮
    const homeBtn = document.createElement('div');
    homeBtn.innerHTML = '🏠';
    homeBtn.className = 'jd-home-btn';
    homeBtn.setAttribute('data-jd-cookie-script', 'true');
    homeBtn.style.cssText = 'width:50px;height:50px;background:linear-gradient(135deg,#4CAF50,#66BB6A);color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 4px 12px rgba(76,175,80,0.4);font-size:24px;user-select:none';
    homeBtn.title = '跳转京东主页';
    homeBtn.onclick = () => {
        const homeUrl = localStorage.getItem('jd_home_url') || 'https://m.jd.com';
        window.location.href = homeUrl;
    };
    btnContainer.appendChild(homeBtn);

    // 创建URL导航按钮
    const urlNavBtn = document.createElement('div');
    urlNavBtn.innerHTML = '🌐';
    urlNavBtn.className = 'jd-url-nav-btn';
    urlNavBtn.setAttribute('data-jd-cookie-script', 'true');
    urlNavBtn.style.cssText = 'width:50px;height:50px;background:linear-gradient(135deg,#2196F3,#64B5F6);color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 4px 12px rgba(33,150,243,0.4);font-size:24px;user-select:none';
    urlNavBtn.title = 'URL导航';
    btnContainer.insertBefore(urlNavBtn, floatBtn);

    // 创建URL导航面板
    const urlPanel = document.createElement('div');
    urlPanel.className = 'jd-url-nav-panel';
    urlPanel.setAttribute('data-jd-cookie-script', 'true');
    urlPanel.style.cssText = 'position:fixed;width:320px;background:#fff;border-radius:12px;box-shadow:0 8px 32px rgba(0,0,0,0.15);z-index:9999;display:none;overflow:hidden';
    // 从localStorage读取保存的设置
    const savedHomeUrl = localStorage.getItem('jd_home_url') || 'https://m.jd.com';
    
    urlPanel.innerHTML = `
        <div style="background:linear-gradient(135deg,#2196F3,#64B5F6);color:#fff;padding:15px;font-weight:bold;font-size:16px">URL导航</div>
        <div style="padding:15px">
            <button id="jdUrlBack" style="width:100%;height:36px;background:#f5f5f5;color:#333;border:none;border-radius:6px;cursor:pointer;font-weight:bold;margin-bottom:10px">← 返回上一页</button>
            <input type="text" id="jdUrlInput" value="${window.location.href}" style="width:100%;height:36px;border:1px solid #e0e0e0;border-radius:6px;padding:0 10px;font-size:12px;outline:none;box-sizing:border-box;margin-bottom:10px" placeholder="输入网址后按回车跳转">
            <button id="jdUrlGo" style="width:100%;height:36px;background:linear-gradient(135deg,#2196F3,#64B5F6);color:#fff;border:none;border-radius:6px;cursor:pointer;font-weight:bold;margin-bottom:10px">跳转</button>
            
            <div style="border-top:1px solid #e0e0e0;padding-top:10px">
                <div style="font-size:12px;color:#666;margin-bottom:8px">🏠 主页设置</div>
                <input type="text" id="jdHomeUrlInput" value="${savedHomeUrl}" style="width:100%;height:32px;border:1px solid #e0e0e0;border-radius:6px;padding:0 10px;font-size:12px;outline:none;box-sizing:border-box;margin-bottom:8px" placeholder="设置主页URL">
                <button id="jdSaveHomeUrl" style="width:100%;height:32px;background:#4CAF50;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:12px;font-weight:bold;margin-bottom:8px">保存主页设置</button>
                <div id="jdHomeUrlMsg" style="display:none;padding:8px;background:#d4edda;color:#155724;border-radius:6px;font-size:12px;text-align:center"></div>
            </div>
        </div>
        `;
        document.body.appendChild(urlPanel);

        // 更新URL面板位置
        function updateUrlPanelPosition() {
        const containerRect = btnContainer.getBoundingClientRect();
        const panelWidth = 320;
        const screenWidth = window.innerWidth;
        const isLeftSide = containerRect.left < screenWidth / 2;
        
        if (isLeftSide) {
            urlPanel.style.left = (containerRect.right - 30) + 'px';
            urlPanel.style.right = 'auto';
        } else {
            urlPanel.style.right = (screenWidth - containerRect.left - 30) + 'px';
            urlPanel.style.left = 'auto';
        }
        urlPanel.style.bottom = (window.innerHeight - containerRect.top + 10) + 'px';
    }

    // URL导航按钮点击事件
    urlNavBtn.onclick = () => {
        if (urlPanel.style.display === 'none') {
            updateUrlPanelPosition();
            urlPanel.style.display = 'block';
            panel.style.display = 'none'; // 关闭Cookie面板
        } else {
            urlPanel.style.display = 'none';
        }
    };

    // URL跳转功能
    const urlInput = document.getElementById('jdUrlInput');
    const urlGoBtn = document.getElementById('jdUrlGo');
    const urlBackBtn = document.getElementById('jdUrlBack');
    
    urlGoBtn.onclick = () => {
        const url = urlInput.value.trim();
        if (url) window.location.href = url;
    };
    
    urlBackBtn.onclick = () => {
        window.history.back();
    };
    
    urlInput.onkeypress = (e) => {
        if (e.key === 'Enter') {
            const url = urlInput.value.trim();
            if (url) window.location.href = url;
        }
    };

    // 主页设置功能
    const homeUrlInput = document.getElementById('jdHomeUrlInput');
    const saveHomeUrlBtn = document.getElementById('jdSaveHomeUrl');
    const homeUrlMsg = document.getElementById('jdHomeUrlMsg');
    
    saveHomeUrlBtn.onclick = () => {
        const homeUrl = homeUrlInput.value.trim();
        if (homeUrl) {
            localStorage.setItem('jd_home_url', homeUrl);
            homeUrlMsg.textContent = '✓ 主页设置已保存';
            homeUrlMsg.style.display = 'block';
            setTimeout(() => {
                homeUrlMsg.style.display = 'none';
            }, 2000);
        }
    };

    // 拖动功能
    let isDragging = false;
    let startX, startY, startLeft, startTop;

    floatBtn.onmousedown = function(e) {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        startLeft = btnContainer.offsetLeft;
        startTop = btnContainer.offsetTop;
        e.preventDefault();
    };

    document.onmousemove = function(e) {
        if (!isDragging) return;
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        
        // 计算新位置
        let newLeft = startLeft + deltaX;
        let newTop = startTop + deltaY;
        
        // 设置边距限制（10px）
        const margin = 10;
        const containerWidth = btnContainer.offsetWidth;
        const containerHeight = btnContainer.offsetHeight;
        const maxLeft = window.innerWidth - containerWidth - margin;
        const maxTop = window.innerHeight - containerHeight - margin;
        
        // 限制在可视范围内
        newLeft = Math.max(margin, Math.min(newLeft, maxLeft));
        newTop = Math.max(margin, Math.min(newTop, maxTop));
        
        btnContainer.style.left = newLeft + 'px';
        btnContainer.style.top = newTop + 'px';
        btnContainer.style.right = 'auto';
        btnContainer.style.bottom = 'auto';
        updatePanelPosition();
    };

    document.onmouseup = function(e) {
        if (isDragging) {
            isDragging = false;
            // 如果没有移动，则视为点击
            if (Math.abs(e.clientX - startX) < 5 && Math.abs(e.clientY - startY) < 5) {
                togglePanel();
            }
        }
    };

    // 创建登录面板
    const panel = document.createElement('div');
    panel.className = 'jd-cookie-login-panel';
    panel.setAttribute('data-jd-cookie-script', 'true');
    panel.style.cssText = 'position:fixed;width:320px;background:#fff;border-radius:12px;box-shadow:0 8px 32px rgba(0,0,0,0.15);z-index:9999;display:none;overflow:hidden';
    panel.innerHTML = `
        <div style="background:linear-gradient(135deg,#e4393c,#ff6b6b);color:#fff;padding:15px;font-weight:bold;font-size:16px">京东Cookie登录</div>
        <div style="padding:15px">
            <textarea id="jdCookieInput" placeholder="粘贴完整Cookie（pt_key=xxx;pt_pin=xxx;...）" style="width:100%;height:100px;border:1px solid #e0e0e0;border-radius:6px;padding:10px;font-size:12px;resize:none;box-sizing:border-box"></textarea>
            <button id="jdLoginBtn" style="width:100%;margin-top:10px;padding:12px;background:linear-gradient(135deg,#e4393c,#ff6b6b);color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:14px;font-weight:bold">注入并登录</button>
            <div id="jdUserInfo" style="margin-top:10px;padding:10px;background:#f5f5f5;border-radius:6px;font-size:12px;display:none"></div>
            <div id="jdDetailInfo" style="margin-top:10px;padding:10px;background:#fff3cd;border-radius:6px;font-size:11px;display:none;line-height:1.6"></div>
        </div>
        `;
        document.body.appendChild(panel);

        // 更新面板位置
        function updatePanelPosition() {
        const containerRect = btnContainer.getBoundingClientRect();
        const panelWidth = 320;
        const screenWidth = window.innerWidth;
        
        // 判断按钮在屏幕左侧还是右侧
        const isLeftSide = containerRect.left < screenWidth / 2;
        
        if (isLeftSide) {
            // 左侧：从左向右展开
            panel.style.left = (containerRect.right - 30) + 'px';
            panel.style.right = 'auto';
        } else {
            // 右侧：从右向左展开
            panel.style.right = (screenWidth - containerRect.left - 30) + 'px';
            panel.style.left = 'auto';
        }
        
        panel.style.bottom = (window.innerHeight - containerRect.top + 10) + 'px';
    }

    // 切换Cookie面板显示
    function togglePanel() {
        if (panel.style.display === 'none') {
            updatePanelPosition();
            panel.style.display = 'block';
            urlPanel.style.display = 'none'; // 关闭URL面板
        } else {
            panel.style.display = 'none';
        }
    }

    // 获取Cookie详细信息
    function getCookieDetails() {
        const cookies = document.cookie.split(';').reduce((acc, cookie) => {
            const [name, value] = cookie.trim().split('=');
            if (name) acc[name] = value;
            return acc;
        }, {});

        return {
            ptPin: cookies.pt_pin ? decodeURIComponent(cookies.pt_pin) : null,
            ptKey: cookies.pt_key ? cookies.pt_key.substring(0, 20) + '...' : null,
            hasLogin: !!(cookies.pt_pin && cookies.pt_key),
            cookieCount: Object.keys(cookies).length
        };
    }

    // 检查登录状态（调用京东API）
    async function checkLoginStatus() {
        try {
            const response = await fetch('https://plogin.m.jd.com/cgi-bin/ml/islogin', {
                method: 'GET',
                credentials: 'include'
            });
            
            const data = await response.json();
            return data.islogin === "1";
        } catch (e) {
            console.error('检查登录状态失败:', e);
            const loginSelectors = ['.nickname', '.user-name', '#loginbar .nickname'];
            for (const selector of loginSelectors) {
                const el = document.querySelector(selector);
                if (el && el.textContent.trim()) {
                    return true;
                }
            }
            return false;
        }
    }


    // 显示用户信息
    async function showUserInfo() {
        const details = getCookieDetails();
        const infoDiv = document.getElementById('jdUserInfo');
        const detailDiv = document.getElementById('jdDetailInfo');
        
        if (!infoDiv || !detailDiv) return;
        
        const isLoggedIn = await checkLoginStatus();

        if (details.ptPin) {
            if (isLoggedIn) {
                let userInfoHTML = `✅ 已登录账号：<strong>${details.ptPin}</strong>`;
                infoDiv.innerHTML = userInfoHTML;
                infoDiv.style.display = 'block';
            } else {
                infoDiv.style.display = 'none';
            }
            
            const statusColor = isLoggedIn ? '#28a745' : '#dc3545';
            const statusText = isLoggedIn ? '有效' : '失效';
            
            let detailHTML = `
                <div><strong>📊 账号信息</strong></div>
                <div>账号: ${details.ptPin} <span style="color:${statusColor}">(${statusText})</span></div>
            `;
            
            
            detailDiv.innerHTML = detailHTML;
            detailDiv.style.display = 'block';
        } else {
            infoDiv.style.display = 'none';
            detailDiv.style.display = 'none';
        }
    }

    // 页面加载时检查登录状态
    // 等待DOM完全加载后再显示用户信息
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(showUserInfo, 1000);
        });
    } else {
        setTimeout(showUserInfo, 1000);
    }
    

    // 登录按钮点击事件
    document.getElementById('jdLoginBtn').onclick = function() {
        const cookieStr = document.getElementById('jdCookieInput').value.trim();
        if (!cookieStr) {
            alert('请输入Cookie');
            return;
        }

        // 解析并注入Cookie
        const cookieObj = {};
        const currentDomain = window.location.hostname;
        
        cookieStr.split(';').forEach(cookie => {
            const [name, value] = cookie.trim().split('=');
            if (name && value) {
                cookieObj[name] = value;
                const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toUTCString();
                
                // jd.com域名
                document.cookie = `${name}=${value};domain=.jd.com;path=/;expires=${expires}`;
                document.cookie = `${name}=${value};domain=jd.com;path=/;expires=${expires}`;
                document.cookie = `${name}=${value};path=/;expires=${expires}`;
            }
        });

        // 验证关键Cookie是否注入成功
        const hasKey = document.cookie.includes('pt_key=');
        const hasPin = document.cookie.includes('pt_pin=');
        
        if (hasKey && hasPin) {
            showUserInfo();
            alert('Cookie已注入，即将刷新页面');
            setTimeout(() => location.reload(), 500);
        } else {
            alert('Cookie注入可能失败，请检查Cookie格式是否正确\n必须包含 pt_key 和 pt_pin');
        }
    };

    // 移除特定的京东弹窗
    function removePopups() {
        // 移除扫码提示弹窗
        document.querySelectorAll('.halo-pcprompt-hint').forEach(el => {
            const text = el.textContent || '';
            if (text.includes('扫描二维码') || text.includes('移动设备')) {
                el.remove();
            }
        });

        // 移除"前往京东APP"弹窗
        document.querySelectorAll('.modal__header__title, [class*="modal"]').forEach(el => {
            const text = el.textContent || '';
            if (text.includes('前往京东APP') || text.includes('查看更多个人信息')) {
                // 移除整个modal容器
                let parent = el.parentElement;
                while (parent && !parent.classList.contains('modal') && parent.parentElement) {
                    parent = parent.parentElement;
                }
                if (parent && parent.classList.contains('modal')) {
                    parent.remove();
                } else {
                    el.closest('[class*="modal"]')?.remove();
                }
            }
        });

        // 移除相关的遮罩层
        document.querySelectorAll('[class*="mask"], [class*="overlay"]').forEach(el => {
            if (el.hasAttribute('data-jd-cookie-script')) return;
            const style = window.getComputedStyle(el);
            if (style.position === 'fixed' && style.zIndex > 100) {
                const hasVisibleModal = document.querySelector('.modal:not([style*="display: none"])');
                if (!hasVisibleModal) {
                    el.remove();
                }
            }
        });
    }

    // 页面加载后移除弹窗（使用防抖优化性能）
    let removeTimer;
    function debouncedRemovePopups() {
        clearTimeout(removeTimer);
        removeTimer = setTimeout(removePopups, 100);
    }

        removePopups();
        
        // 监听DOM变化，使用防抖避免频繁执行
        const observer = new MutationObserver(debouncedRemovePopups);
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    // 启动UI初始化
    initUI();
})();