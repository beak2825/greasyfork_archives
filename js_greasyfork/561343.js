// ==UserScript==
// @name         海角社区
// @version      1.0.2
// @description  🔥 解锁海角社区全部付费视频（包括短视频、封禁用户视频），去广告、自动展开帖子，不限次数观看、下载视频，可复制观看链接
// @namespace    海角社区
// @author       fanqiechaodan
// @match        *://*/videoplay/*
// @match        *://*/post/details/*
// @match        *://*.haijiao.com/*
// @match        *://hj251201*.*/*
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @require      https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.5.8/hls.min.js
// @require      https://cdn.jsdelivr.net/npm/jsencrypt@3.2.1/bin/jsencrypt.min.js
// @run-at       document-start
// @antifeature  payment
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561343/%E6%B5%B7%E8%A7%92%E7%A4%BE%E5%8C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/561343/%E6%B5%B7%E8%A7%92%E7%A4%BE%E5%8C%BA.meta.js
// ==/UserScript==


(function () {
    'use strict';

    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    let foundUrl = '';
    let isCopied = false;
    let detectionStopped = false;
    let hlsInstance = null;
    let isMinimized = isMobile;
    let m3u8Content = '';
    let isMember = false;
    function createStatusPanel() {

        const floatBtn = document.createElement('button');
        floatBtn.id = 'tsDetectorFloatBtn';
        floatBtn.textContent = '航海家';
        floatBtn.style.cssText = `
            position: fixed;
            bottom: ${isMobile ? '60px' : '120px'};
            right: 10px;
            width: auto;
            padding: 8px 12px;
            background: #3498db;
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 14px;
            cursor: pointer;
            z-index: 99998;
            display: ${isMobile ? 'block' : 'none'};
        `;
        document.body.appendChild(floatBtn);
        const panel = document.createElement('div');
        panel.id = 'tsDetectorPanel';
        panel.style.cssText = `
            position: fixed;
            ${isMobile ? 'bottom: 20px; left: 50%; transform: translateX(-50%); width: 90%; max-width: 350px;' : 'bottom: 20px; right: 20px; max-width: 350px;'}
            padding: 12px;
            background: #2c3e50;
            color: white;
            border-radius: 6px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            z-index: 99999;
            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
            font-size: 14px;
            transition: all 0.3s ease;
            display: ${isMobile ? 'none' : 'block'};
        `;

        panel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <strong>航海家</strong>
                <div>
                    <button id="minimizePanel" style="background: transparent; border: none; color: #ddd; cursor: pointer; margin-right: 5px;">—</button>
                </div>
            </div>
            <div id="detectionStatus" style="padding: 5px; background: rgba(255,255,255,0.1); border-radius: 3px; margin-bottom: 8px;">
                正在监控网络...
            </div>
            <div id="urlList" style="margin: 8px 0; max-height: 150px; overflow-y: auto; font-size: 13px;"></div>
            <div style="display: flex; gap: 6px; margin-top: 6px;">
              <button id="downloadBtn" style="flex: 1; padding: 6px; background: #314274; color: white; border: none; border-radius: 3px; cursor: pointer; display: none;">
                 下载
              </button>
              <button id="playBtn" style="flex: 1; padding: 6px; background: #1f77b4; color: white; border: none; border-radius: 3px; cursor: pointer; display: none;">
                播放
              </button>
            </div>
        `;
        document.body.appendChild(panel);

        document.getElementById('minimizePanel').addEventListener('click', () => {
            panel.style.display = 'none';
            floatBtn.style.display = 'block';
            isMinimized = true;
        });

        floatBtn.addEventListener('click', () => {
            panel.style.display = 'block';
            floatBtn.style.display = 'none';
            isMinimized = false;
        });

        document.getElementById('playBtn').addEventListener('click', () => {
            const token = localStorage.getItem('token');
            if (token === null) {
                foundUrl = [];
                openLoginModal();
                return;
            }
            if (!isMember) {
                const newWindow = window.open('', '_blank');
                newWindow.location.href = REGISTER_URL;
                return;
            }
            if (foundUrl.length > 0) {
                document.getElementById('playBtn').disabled = true;
                playFirstM3u8(foundUrl);
            }
        });
        document.getElementById('downloadBtn').addEventListener('click', async () => {
            const token = localStorage.getItem('token');
            if (token === null) {
                openLoginModal();
                return;
            }
            if (!isMember) {
                showToast("开通会员，无限观看");
                return;
            }
            let downloadUrl = await saveAndDownloadM3u8(m3u8Content);
            const newWindow = window.open('', '_blank');
            newWindow.location.href = 'https://getm3u8.com/?source=' + downloadUrl;
        });
        return panel;
    }
    let loginModal = null;
    GM_addStyle(`
        #loginModal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            overflow-y: auto;
            overflow-x: hidden;
            background-color: rgba(122, 122, 122, 0.5);
            z-index: 100000;
            display: none; /* 默认隐藏，打开时设为flex */
            justify-content: center;
            align-items: center;
        }
        #loginModalDialog {
            ${isMobile ? 'width: 90vw' : 'width: 350px'};
            max-width: 350px;
            max-height: 80vh;
            background-color: #ffffff;
            border-radius: 6px;
            display: flex;
            flex-direction: column;
            align-items: center;
            font-size: 14px;
            box-sizing: border-box;
        }
        #modal-content {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 10px;
            box-sizing: border-box;
        }
        #modal-header {
            width: 100%;
            padding: 10px;
            margin-bottom: 10px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        #modal-title {
            font-weight: 600;
            font-size: 20px;
            margin: 0;
        }
        #modal-body {
            width: 100%;
        }
        #loginForm {
            width: 100%;
            padding: 10px;
            display: flex;
            flex-direction: column;
            box-sizing: border-box;
        }
        #loginForm input {
            margin-bottom: 10px;
            padding: 10px;
            border-radius: 3px;
            border: 1px solid #ddd;
            height: 40px;
            background-color: #fff;
            box-sizing: border-box;
        }
        #loginButton {
            margin-bottom: 10px;
            padding: 10px;
            border-radius: 3px;
            -webkit-tap-highlight-color: transparent;
            height: 40px;
            border: none;
            cursor: pointer;
            background-color: #e64340;
            color: #fff;
            font-weight: 600;
            box-sizing: border-box;
        }
        #loginButton:hover {
            background-color: #d43936;
        }
        #registerLink {
            text-align: center;
        }
        #registerLink .a {
            cursor: pointer;
            color: #0066cc;
        }
        #registerLink .a:hover {
            color: #004999;
        }
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus {
            background-color: #fff !important;
            -webkit-box-shadow: 0 0 0px 1000px #fff inset !important;
            color: #333 !important;
            transition: background-color 5000s ease-in-out 0s;
        }
        .toast {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: rgba(0, 0, 0, 0.7);
            color: #fff;
            padding: 12px 24px;
            border-radius: 4px;
            font-size: 14px;
            z-index: 9999;
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .toast.show {
            opacity: 1;
        }
    `);
    function initLoginModal() {
        if (loginModal) return;
        loginModal = document.createElement('div');
        loginModal.id = 'loginModal';
        const loginModalDialog = document.createElement('div');
        loginModalDialog.id = 'loginModalDialog';
        loginModalDialog.innerHTML = `
            <div id="modal-content">
              <div id="modal-header">
                <h4 id="modal-title">枸杞快跑</h4>
              </div>
              <div id="modal-body">
                <form id="loginForm">
                  <input id="loginUserNameInput" type="text" placeholder="请输入用户名" autocomplete="username" required/>
                  <input id="loginPasswordInput" type="password" placeholder="请输入密码" autocomplete="current-password" required/>
                  <button id="loginButton" type="submit">登录</button>
                </form>
                <div id="registerLink">没有账号？<a href= ${REGISTER_URL} target = "_blank">立即注册</a></div>
              </div>
            </div>
        `;
        loginModal.appendChild(loginModalDialog);
        document.body.appendChild(loginModal);
        bindEvents();
    }
    function bindEvents() {
        const loginButton = document.getElementById('loginButton');
        const loginUserNameInput = document.getElementById('loginUserNameInput');
        const loginPasswordInput = document.getElementById('loginPasswordInput');
        const registerLink = document.getElementById('registerLink');

        loginButton.addEventListener('click', async () => {
            await login(loginUserNameInput.value.trim(), loginPasswordInput.value.trim());
        });

        loginModal.addEventListener('click', (e) => {
            if (e.target === loginModal) {
                closeLoginModal();
            }
        });
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            loginButton.click();
        });
    }

    async function rsaEncrypt(password) {
        try {
            const encrypt = new JSEncrypt();
            const publicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwe6NimtgRabrvb66gFDFigTiaA5kDGsHLxzTng5ORqeMqf2/qeTJl1QBN0HyDGdmeYkm8H8LgIB4fkLnFq5L5z99Uv/ep1kOOsBlvPoO8iw94Gv6JOKANaH+SdNndDtzgoKK4TVhgHULyvJyctxqArUkY7hw80zb20g8FbybF9kp14YIk47mzE5DfQH9W3niOhF1x57C45RfjEtHTanDWVPslAOtc/L9kNL2r70EBcKN69+f48tDu81m1cBerjfsMULFVzUVfLmgempCDceUqyGhy6pu379lN4vm/9YcTWaRB+D1971LOxJrilmNTpCxSm8BB3JNamdi7+jnkkKWHwIDAQAB
-----END PUBLIC KEY-----`;
            encrypt.setPublicKey(publicKey);
            const encryptedPassword = encrypt.encrypt(password);
            if (!encryptedPassword) {
                throw new Error('加密失败，可能是公钥格式错误或内容过长');
            }
            return encryptedPassword;
        } catch (error) {
            console.error('RSA加密出错：', error.message);
            return null;
        }
    }
    async function login(userName, passwords) {
        if (!userName || !passwords) {
            alert('请输入用户名和密码');
            return;
        }
        const password = await rsaEncrypt(passwords);
        const loginFormData = { userName, password };
        const loginButton = document.getElementById('loginButton');
        loginButton.style.disabled = true;
        try {
            const result = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: BASE_URL + '/api/user/login',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    data: JSON.stringify(loginFormData),
                    timeout: 30000,
                    onload: (response) => {
                        try {

                            if (response.status < 200 || response.status >= 300) {
                                reject(new Error(`请求失败，状态码：${response.status}`));
                                return;
                            }
                            const resData = JSON.parse(response.responseText);
                            resolve(resData);
                        } catch (parseErr) {
                            reject(new Error(`JSON解析失败：${parseErr.message}`));
                        }
                    },
                    onerror: (error) => {
                        reject(new Error(`网络请求失败：${error.message || '未知错误'}`));
                    },
                    ontimeout: () => {
                        reject(new Error('请求超时，请稍后重试'));
                    }
                });
            });
            if (result.code === 200) {
                showToast(`登录成功，欢迎${result.data.userName}`);
                localStorage.setItem('token', result.data.token);
                closeLoginModal();
                location.reload(true);
            } else {
                showToast(result.msg || '登录失败，请检查用户名或密码');
            }
        } catch (err) {
            console.error('登录异常：', err);
            showToast(err.message);
        }
        loginButton.style.disabled = false;
    }
    function openLoginModal() {
        initLoginModal();
        loginModal.style.display = 'flex';
        document.getElementById('loginUserNameInput')?.focus();
    };
    function closeLoginModal() {
        if (loginModal) {
            loginModal.style.display = 'none';
        }
    };
    function showToast(message, duration = 3000) {
        const toast = document.createElement('div');
        toast.style.position = 'fixed';
        toast.style.top = '20%';
        toast.style.left = '50%';
        toast.style.transform = 'translate(-50%, -50%)';
        toast.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        toast.style.color = '#fff';
        toast.style.padding = '12px 24px';
        toast.style.borderRadius = '4px';
        toast.style.fontSize = '14px';
        toast.style.zIndex = '9999';
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s ease';
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '1';
        }, 0);
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, duration);
    }
    async function saveAndDownloadM3u8(m3u8Content) {
        const token = localStorage.getItem('token');
        if (token === null) return;
        try {
            const result = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: BASE_URL + '/api/m3u8/save',
                    headers: {
                        'Content-Type': 'text/plain',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    data: m3u8Content,
                    timeout: 30000,
                    onload: function (response) {
                        try {
                            const resData = JSON.parse(response.responseText);
                            if (resData.success === false) {
                                showToast(resData.msg);
                                localStorage.removeItem('token');
                                openLoginModal();
                            }
                            resolve(resData);
                        } catch (parseErr) {
                            reject(new Error(`JSON 解析失败: ${parseErr.message}`));
                        }
                    },
                    onerror: function (error) {
                        reject(new Error(`请求失败: ${error.message || '网络错误'}`));
                    },
                    ontimeout: function () {
                        reject(new Error('请求超时'));
                    }
                });
            });
            if (result.code === 200) {
                return result.data;
            } else {
                showToast(result.msg);
                isMember = false;
            }
        } catch (err) {
            console.error('失败', err);
            alert(`操作失败: ${err.message}`);
        }
    }
    async function convertUrl(url) {
        const m3u8Url = BASE_URL + '/api/fetchM3u8?url=' + url;
        const token = localStorage.getItem('token');
        if (token === null) {
            return "请先点击播放键登录";
        }
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: m3u8Url,
                headers: {
                    'Content-Type': 'text/plain',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                onload: function (response) {
                    try {
                        if (response.status >= 200 && response.status < 300) {
                            const res = JSON.parse(response.responseText);
                            const content = res.data;
                            const blob = new Blob([content], {
                                type: 'application/vnd.apple.mpegurl'
                            });
                            isMember = true;
                            if (res.success == false) {

                                localStorage.
                                removeItem('token');

                            } else if (res.code !== 200) {
                                isMember = false;

                                resolve("请先点击播放按钮开通会员");
                            }
                            m3u8Content = content;
                            const tmpUrl = URL.createObjectURL(blob);
                            resolve(tmpUrl);
                        } else {
                            alert(new Error(`请求失败，状态码：${response.status}`));
                        }
                    } catch (e) {
                        alert('解析错误');
                    }
                },
                onerror: function (error) {
                    const errorMsg = `网络请求失败：${error.message || '未知错误'}`;
                    console.log("获取失败，错误为：" + errorMsg);
                    reject(new Error(errorMsg));
                },
                ontimeout: function () {
                    const errorMsg = "请求超时";
                    console.log("获取失败，错误为：" + errorMsg);
                    reject(new Error(errorMsg));
                }
            });
        });
    }

    async function addUrlAndPlay(url) {
        try {
            let blobUrl = await convertUrl(url);
            foundUrl = blobUrl;
            addUrl(foundUrl);
            isMinimizedTip();
        } catch (e) {
            console.error("调用失败", e);
        }
        document.getElementById('playBtn').style.display = 'inline-block';
        document.getElementById('downloadBtn').style.display = 'inline-block';
    }
    function isMinimizedTip() {
        if (isMinimized) {
            const tempTip = document.createElement('div');
            tempTip.style.cssText = `
                position: fixed;
                bottom: ${isMobile ? '60px' : '121px'};
                right: 10px;
                width: auto;
                padding: 8px 12px;
                background: #2ecc71;
                color: white;
                border: none;
                border-radius: 4px;
                font-size: 14px;
                z-index: 99999;
            `;
            tempTip.textContent = '已检测到链接';
            document.body.appendChild(tempTip);
            setTimeout(() => tempTip.remove(), 3000);
        }
    }
    function addUrl(m3u8Url) {
        const urlList = document.getElementById('urlList');
        if (urlList) {
            const item = document.createElement('div');
            item.style.cssText = `
                padding: 5px;
                margin: 3px 0;
                background: rgba(255,255,255,0.1);
                border-radius: 3px;
                word-break: break-all;
            `;
            item.innerHTML = `
                <div style="font-size: 12px; color: #bbb; margin-bottom: 2px;">链接地址:</div>
                <span style="margin-right: 5px;">${m3u8Url}</span>
                <button class="copyBtn" data-url="${m3u8Url}" style="background: #2ecc71; border: none; color: white; padding: 2px 5px; border-radius: 2px; font-size: 11px;">
                    复制
                </button>
            `;
            urlList.appendChild(item);
            updateStatus(`已检测到链接`);
            item.querySelector('.copyBtn').addEventListener('click', function () {
                const url = this.getAttribute('data-url');
                copyToClipboard(url);
                this.textContent = '已复制';
                setTimeout(() => { this.textContent = '复制' }, 2000);
            });
        }
    }
    function playFirstM3u8() {
        if (foundUrl.length === 0) return;

        let m3u8Url = foundUrl;
        const videoContainer = document.createElement('div');
        videoContainer.style.cssText = `
        position: fixed;
        width: 80%;
        max-height: 75vh;
        height: ${isMobile ? 'none' : '500px'};
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 99999;
        background: black;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0,0,0,0.5);
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow : auto;
        box-sizing: border-box; /* 加上这句！ */
    `;
        const closeButton = document.createElement('button');
        closeButton.innerHTML = '&times;';
        closeButton.style.cssText = `
        position: absolute;
        top: 5px;
        right: 10px;
        width: 30px;
        height: 30px;
        background: #ff4757;
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 20px;
        font-weight: bold;
        cursor: pointer;
        line-height: 1;
        opacity: 0.8;
        transition: opacity 0.2s;
        z-index: 100000;
    `;
        closeButton.title = '关闭';
        closeButton.addEventListener('click', () => {
            if (hlsInstance) {
                hlsInstance.destroy();
                hlsInstance = null;
            }
            video.pause();
            video.src = '';
            document.getElementById('playBtn').disabled = false;
            document.body.removeChild(videoContainer);
        });

        const video = document.createElement('video');
        video.style.width = '100%';
        video.style.height = '100%';
        video.style.objectFit = 'contain';
        video.controls = true;
        videoContainer.appendChild(video);
        videoContainer.appendChild(closeButton);
        if (Hls.isSupported()) {
            hlsInstance = new Hls();
            hlsInstance.loadSource(m3u8Url);
            hlsInstance.attachMedia(video);
            hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
                video.play().catch(() => {

                    document.body.addEventListener('click', () => {
                        video.play();

                    }, { once: true });
                });
            });

            hlsInstance.on(Hls.Events.ERROR, (event, data) => {
                if (data.fatal) {
                    switch (data.type) {
                        case Hls.ErrorTypes.NETWORK_ERROR:
                            console.error('网络错误，尝试恢复...');
                            hlsInstance.startLoad();
                            break;
                        case Hls.ErrorTypes.MEDIA_ERROR:
                            console.error('媒体错误');
                            hlsInstance.recoverMediaError();
                            break;
                        default:
                            console.error('不可恢复的错误');
                            hlsInstance.destroy();
                            break;
                    }
                }
            });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = m3u8Url;
            video.play().catch(() => {
                document.body.addEventListener('click', () => {
                    video.play();

                }, { once: true });
            });
        } else {
            alert('当前浏览器不支持HLS播放，请使用支持HLS的播放器（如 Chrome、Edge、Safari）');
            return;
        }
        const handleEscKey = (e) => {
            if (e.key === 'Escape') {
                if (hlsInstance) {
                    hlsInstance.destroy();
                    hlsInstance = null;
                }
                video.pause();
                video.src = '';
                document.getElementById('playBtn').disabled = false; document.body.removeChild(videoContainer);
                document.removeEventListener('keydown', handleEscKey);
            }
        };
        document.addEventListener('keydown', handleEscKey);
        document.body.appendChild(videoContainer);
        videoContainer.addEventListener('click', (e) => {
            if (e.target === videoContainer) {

            }
        });
    }

    const BASE_URL = 'https://gqkl.yidajichang.top';
    const REGISTER_URL = 'https://gqkp.yidajichang.top';

    function removeAds() {
        const adElement1 = document.querySelectorAll('.page-container');
        const adElement2 = document.querySelectorAll('.containeradvertising');
        const adElement3 = document.querySelectorAll('.van-overlay');
        const adElement4 = document.querySelectorAll('.topbanmer');
        const adElement5 = document.querySelectorAll('.bannerliststyle');
        const adElement6 = document.querySelector('.html-box');
        const adElement7 = document.querySelector('.html-bottom-box');
        const adElement8 = document.querySelector('.custom_carousel');
        const adElement9 = document.querySelector('.btnbox');

        if (adElement1.length > 0) adElement1.forEach(el => el.remove());
        if (adElement2.length > 0) adElement2.forEach(el => el.remove());
        if (adElement3.length > 0) adElement3.forEach(el => el.remove());
        if (adElement4.length > 0) adElement4.forEach(el => el.remove());
        if (adElement5.length > 0) adElement5.forEach(el => el.remove());
        if (adElement6) adElement6.classList.remove("ishide");
        if (adElement7) adElement7.remove();
        if (adElement8) adElement8.remove();
        if (adElement9) adElement9.remove();

        const allElementsGone =
              adElement1.length === 0 &&
              adElement2.length === 0 &&
              adElement3.length === 0 &&
              adElement4.length === 0 &&
              adElement5.length === 0 &&
              !adElement6 &&
              !adElement7 &&
              !adElement8 &&
              !adElement9;

        if (allElementsGone) {
            clearInterval(adCheckTimer);
        }
    }
    let adCheckTimer;
    function startObserver() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(() => removeAds());
        });
        observer.observe(document.body, { childList: true, subtree: true });
        removeAds();
    }
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", startObserver);
    } else {
        startObserver();
    }

    window.addEventListener('beforeunload', () => {
        if (adCheckTimer) clearInterval(adCheckTimer);
    });

    function copyToClipboard(text) {
        try {
            if (typeof GM_setClipboard === 'function') {
                GM_setClipboard(text);
                return;
            }

            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.left = '-9999px';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
        } catch (e) {
            console.error('复制失败:', e);
            updateStatus('复制失败，请手动复制');
        }
    }
    setInterval(function() {
        Function("debugger")();
    }, 50);
    function updateStatus(message) {
        const statusEl = document.getElementById('detectionStatus');
        if (statusEl) {
            statusEl.textContent = message;
        }
    }
    let mobilePreviewTimer = null;
    function reInit() {
        foundUrl = '';
        m3u8Content = '';
        isCopied = false;
        detectionStopped = false;
        document.getElementById('urlList').innerHTML = '';
        document.getElementById('detectionStatus').textContent = '正在监控网络...';
        document.getElementById('playBtn').style.display = 'none';
        document.getElementById('downloadBtn').style.display = 'none';

        if (isMobile) {
            clearTimeout(mobilePreviewTimer);
            mobilePreviewTimer = setTimeout(() => {
                const rawPreviewUrl = getPreviewUrl();
                const previewUrl = rawPreviewUrl ? rawPreviewUrl.trim() : '';
                const currentFoundUrl = foundUrl ? foundUrl.trim() : '';
                if (previewUrl && currentFoundUrl === '') {

                    addUrlAndPlay(previewUrl);
                    detectionStopped = true;
                }
            }, 5000);
        }
    }
    window.addEventListener('beforeunload', () => {
        clearTimeout(mobilePreviewTimer);
    });
    document.querySelectorAll('.jump-btn, .back-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            clearTimeout(mobilePreviewTimer);
        });
    });
    function listenSpaRouteChange() {
        const observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {

                if (window.location.href !== observer.oldUrl) {
                    observer.oldUrl = window.location.href;
                    reInit();
                }
            });
        });


        observer.observe(document.body, { childList: true, subtree: true });
        observer.oldUrl = window.location.href;
    }
    function getPreviewUrl() {


        const previewBtn = document.querySelector(".preview-btn");
        if (!previewBtn) {

            return;
        }
        const m3u8Url = previewBtn.getAttribute('data-url');
        if (!m3u8Url) {
            console.warn("未找到视频链接");
            return;
        }
        return m3u8Url;
    }
    function initNetworkMonitoring() {

        const originalFetch = window.fetch;
        const originalXhrOpen = XMLHttpRequest.prototype.open;
        const originalXhrSend = XMLHttpRequest.prototype.send;


        XMLHttpRequest.prototype.open = function (...args) {
            if (detectionStopped) {
                return originalXhrOpen.apply(this, args);
            }

            try {
                const url = args[1] || this.url;
                if (url && url.toLowerCase().endsWith('.m3u8')) {
                    addUrlAndPlay(url);
                    detectionStopped = true;
                }
            } catch (e) {
                console.error('XHR监控错误:', e);
            }

            return originalXhrOpen.apply(this, args);
        };
    }
    function init() {
        setTimeout(() => {
            createStatusPanel();
            initNetworkMonitoring();
        }, 1000);

        if (isMobile) {
            setTimeout(() => {
                if (getPreviewUrl()) {
                    let previewUrl = getPreviewUrl();
                    addUrlAndPlay(previewUrl);
                    detectionStopped = true;
                }
            }, 5000);
        }
        listenSpaRouteChange();
    }
    init();
})();