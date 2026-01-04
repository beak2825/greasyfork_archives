// ==UserScript==
// @name         sugar
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  sugar糖心解析
// @author       lidiaoo
// @match        *://txh*.com/*
// @include      *://txh*.com/*
// @connect      *
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_log
// @run-at       document-start
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.js
// @downloadURL https://update.greasyfork.org/scripts/552451/sugar.user.js
// @updateURL https://update.greasyfork.org/scripts/552451/sugar.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ==================== Crypto-JS加载检测 ====================
    if (typeof window.CryptoJS === 'undefined') {
        alert('Crypto-JS加载失败，脚本无法运行！请检查网络或重新安装脚本。');
        GM_log('[ERROR]', '[油猴1.0][错误] Crypto-JS未加载：检查bootcdn访问或脚本猫外部资源权限');
        return;
    }
    const CryptoJS = window.CryptoJS;


    // ==================== GM_xmlhttpRequest可用性检测（脚本猫兼容） ====================
    if (typeof GM_xmlhttpRequest === 'undefined') {
        alert('GM_xmlhttpRequest未启用！请按提示配置脚本猫权限：\n1. 打开脚本猫→当前脚本→脚本设置\n2. 权限管理→勾选"跨域请求权限"\n3. 保存后刷新页面');
        GM_log('[ERROR]', '[油猴1.0][严重错误] GM_xmlhttpRequest不可用！脚本猫配置步骤：');
        GM_log('[ERROR]', '1. 点击浏览器右上角脚本猫图标→进入"我的脚本"');
        GM_log('[ERROR]', '2. 找到当前脚本→点击右侧"更多"→"脚本设置"');
        GM_log('[ERROR]', '3. 进入"权限管理"→勾选"跨域请求权限"和"GM_xmlhttpRequest权限"');
        GM_log('[ERROR]', '4. 关闭所有txh066.com标签页，重新打开');
        return;
    }
    // 替换GM_log：用console.log，脚本猫日志面板可查看
    GM_log('[INFO]', '[油猴1.0][成功] GM_xmlhttpRequest已启用，将用于解决CORS跨域');


  // ==================== 唯一的CONFIG配置 ====================
    const CONFIG = {
        aes: {
            key: 'fd14f9f8e38808fa',
        },
        playLinkApi: {
            url: 'https://quantumultx.me',
            timeout: 2000,
            maxAttempts: 30,
            retryDelay: 1000,
        },
        player: {
            onlinePlayer: 'https://m3u8player.org/player.html?url=',
            vlcProtocol: 'vlc://'
        },
        targetApis: [
            { match: '/h5/system/info', handler: handleSystemInfoApi },
            { match: '/h5/movie/block', handler: handleMovieBlockApi },
            { match: '/h5/user/info', handler: handleUserInfoApi },
            { match: '/h5/movie/detail', handler: handleMovieDetailApi },
            { match: '/h5/movie/search', handler: handleMovieSearchApi },
            { match: '/h5/danmaku/list', handler: handleDanmakuApi }
        ],
        script: {
            targetReg: /\/_nuxt\/[\w]+\.js$/,
            jumpCode: 'e&&(window.location.href="https://www.baidu.com")',
            marker: 'data-userscript-handled'
        }
    };

    // ==================== 工具函数：将CONFIG转换为注入脚本可用的字符串 ====================
    function getConfigString() {
        // 处理targetApis中的handler（保持函数名字符串）
        const targetApisStr = CONFIG.targetApis.map(api =>
            `{ match: '${api.match}', handler: ${api.handler} }`
        ).join(',');

        // 拼接完整CONFIG字符串（确保CryptoJS相关属性正确引用）
        return `const CONFIG = {
            aes: {
                key: '${CONFIG.aes.key}',
            },
            playLinkApi: {
                url: '${CONFIG.playLinkApi.url}',
                maxAttempts: ${CONFIG.playLinkApi.maxAttempts},
                retryDelay: ${CONFIG.playLinkApi.retryDelay},
            },
            player: {
                onlinePlayer: '${CONFIG.player.onlinePlayer}',
                vlcProtocol: '${CONFIG.player.vlcProtocol}'
            },
            targetApis: [
                { match: '/h5/system/info', handler: handleSystemInfoApi },
                { match: '/h5/movie/block', handler: handleMovieBlockApi },
                { match: '/h5/user/info', handler: handleUserInfoApi },
                { match: '/h5/movie/detail', handler: handleMovieDetailApi },
                { match: '/h5/movie/search', handler: handleMovieSearchApi },
                { match: '/h5/danmaku/list', handler: handleDanmakuApi }
            ],
        };`;
    }

    if (CONFIG.playLinkApi.url === 'undefined' || CONFIG.playLinkApi.url === '') {
        alert('请先填入解析地址');
        GM_log('[ERROR]', '[油猴1.0][错误] 请先填入解析地址');
        return;
    }

    // ==================== 禁止调试逻辑 ====================
    GM_log('[INFO]', '[油猴1.0] 脚本启动===============================================');

    // 禁用右键
    document.addEventListener('contextmenu', e => {
        e.preventDefault();
        GM_log('[INFO]', '[油猴1.0][禁止调试] 右键菜单已禁用');
    });

    // 禁用F12/快捷键
    document.addEventListener('keydown', e => {
        if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) || (e.ctrlKey && e.key === 'U')) {
            e.preventDefault();
            GM_log('[INFO]', '[油猴1.0][禁止调试] 开发者工具快捷键已禁用');
        }
    });

    // 拦截debugger
    window.debugger = () => GM_log('[INFO]', '[油猴1.0][禁止调试] debugger语句已拦截');

    // 处理noscript
    const handleNoscript = () => {
        document.querySelectorAll('noscript').forEach(tag => tag.style.display = 'none');
        GM_log('[INFO]', '[油猴1.0][处理noscript] 已隐藏noscript标签');
    };
    document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', handleNoscript) : handleNoscript();


    // ==================== AES工具函数 ====================
    function aesEcbDecrypt(cipherText) {
        try {
            const cipherParams = CryptoJS.lib.CipherParams.create({
                ciphertext: CryptoJS.enc.Base64.parse(cipherText)
            });
            const decrypted = CryptoJS.AES.decrypt(cipherParams, CryptoJS.enc.Utf8.parse(CONFIG.aes.key), {
                mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7
            });
            return decrypted.toString(CryptoJS.enc.Utf8);
        } catch (e) {
            GM_log('[ERROR]', `[油猴1.0][AES解密失败] ${e.message}`);
            throw e;
        }
    }

    function aesEcbEncrypt(plainText) {
        try {
            const paddedText = CryptoJS.enc.Utf8.parse(plainText);
            const encrypted = CryptoJS.AES.encrypt(paddedText, CryptoJS.enc.Utf8.parse(CONFIG.aes.key), {
                mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7
            });
            return encrypted.toString();
        } catch (e) {
            GM_log('[ERROR]', `[油猴1.0][AES加密失败] ${e.message}`);
            throw e;
        }
    }


    // ==================== 播放链接获取（脚本猫GM兼容） ====================
    async function getPlayLink(videoId) {
        GM_log('[INFO]', `[油猴1.0][播放链接] 开始获取（videoId：${videoId}），最多重试${CONFIG.playLinkApi.maxAttempts}次`);

        for (let attempt = 1; attempt <= CONFIG.playLinkApi.maxAttempts; attempt++) {
            try {
                let responseText = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'POST',
                        url: CONFIG.playLinkApi.url,
                        anonymous: true,
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        data: JSON.stringify({video_id: videoId}),
                        timeout: CONFIG.playLinkApi.timeout,
                        onload: (res) => {
                            GM_log('[INFO]', `[油猴1.0][播放链接] 第${attempt}次请求状态：${res.status}`);
                            if (res.status === 200) {
                                resolve(res.responseText);
                            } else {
                                reject(new Error(`服务器返回非200状态：${res.status}（响应：${res.responseText.slice(0, 100)}）`));
                            }
                        },
                        onerror: (err) => {
                            reject(new Error(`GM请求错误：${err.message}（可能是网络问题或服务器拒绝）`));
                        },
                        ontimeout: () => {
                            reject(new Error(`GM请求超时（${CONFIG.playLinkApi.url}）`));
                        }
                    });
                });

                // 解析JSON
                let result;
                try {
                    result = JSON.parse(responseText);
                } catch (parseErr) {
                    throw new Error(`响应JSON解析失败：${parseErr.message}（原始响应：${responseText.slice(0, 100)}）`);
                }

                // 校验播放链接
                if (result?.playLink && typeof result.playLink === 'string' && result.playLink.startsWith('http')) {
                    GM_log('[ERROR]', `[油猴1.0][播放链接] 第${attempt}次尝试成功：${result.playLink}`);
                    openPlayers(result.playLink);
                    // alert(`获取播放链接成功 ${result.playLink}`);
                    return result.playLink;
                } else {
                    throw new Error(`无有效playLink（响应：${JSON.stringify(result)}）`);
                }

            } catch (e) {
                GM_log('[ERROR]', `[油猴1.0][播放链接] 第${attempt}次尝试失败：${e.message}`);
                if (attempt < CONFIG.playLinkApi.maxAttempts) {
                    await new Promise(resolve => setTimeout(resolve, CONFIG.playLinkApi.retryDelay));
                }
            }
        }

        GM_log('[ERROR]', `[油猴1.0][播放链接] 已尝试${CONFIG.playLinkApi.maxAttempts}次，全部失败`);
        alert(`获取播放链接失败！请检查：1. 网络是否能访问 ${CONFIG.playLinkApi.url} 2. 刷新页面重试`);
        return "";
    }


    // ==================== 播放器唤起 ====================
    function openPlayers(playLink) {
        if (!playLink) return;
        try {
            const onlinePlayerUrl = CONFIG.player.onlinePlayer + encodeURIComponent(playLink);
            // 可以添加更多参数，如是否激活新标签页
            GM_openInTab(onlinePlayerUrl, {active: true});
            GM_log('[INFO]', `[油猴1.0][浏览器播放] 已打开浏览器播放：${onlinePlayerUrl}`);
        } catch (e) {
            GM_log('[ERROR]', `[油猴1.0][浏览器播放] 唤起浏览器播放失败：${e.message}`);
        }
        // try {
        // const vlcUrl = CONFIG.player.vlcProtocol + encodeURIComponent(playLink);
        //     // 可以添加更多参数，如是否激活新标签页
        //     GM_openInTab(vlcUrl, {active: false});
        //     GM_log('[INFO]',`[油猴1.0][播放器] 尝试唤起VLC：${vlcUrl}（需提前关联vlc://协议）`);
        // } catch (e) {
        //     GM_log('[ERROR]',`[油猴1.0][播放器] 唤起VLC失败：${e.message}`);
        // }
    }


    // ==================== API数据处理 ====================
    function handleUserInfoApi(decryptedStr) {
        try {
            GM_log('[INFO]', '[油猴1.0][用户信息API] 开始处理');
            let userData = JSON.parse(decryptedStr);
            userData.data.is_vip = 'y';
            userData.data.is_dark_vip = 'y';
            userData.data.exp_level = 6;
            userData.data.balance = '99999999';
            userData.data.balance_income = '99999999';
            userData.data.balance_freeze = '0';
            userData.data.group_end_time = '2999-09-09到期';
            userData.data.post_banner = [];
            userData.data.bottom_ads = [];
            userData.data.bottom_ad = {};
            userData.data.layer_ad = {};
            userData.data.layer_ads = [];
            userData.data.layer_app = [];
            userData.data.ad = {};
            userData.data.ads = [];
            userData.data.notice = '';
            userData.data.ad_auto_jump = 'n';
            userData.data.site_url = '';
            userData.data.dark_tips = '';
            //const playLink =  getPlayLink('33545');
            return JSON.stringify(userData);
        } catch (e) {
            GM_log('[ERROR]', `[油猴1.0][用户信息API处理失败] ${e.message}`);
            return decryptedStr;
        }
    }

    function handleSystemInfoApi(decryptedStr) {
        try {
            GM_log('[INFO]', '[油猴1.0][系统信息API] 开始处理');
            let systemData = JSON.parse(decryptedStr);
            systemData.data.post_banner = [];
            systemData.data.bottom_ads = [];
            systemData.data.bottom_ad = {};
            systemData.data.layer_ad = {};
            systemData.data.layer_ads = [];
            systemData.data.layer_app = [];
            systemData.data.ad = {};
            systemData.data.ads = [];
            systemData.data.notice = '';
            systemData.data.ad_auto_jump = 'y';
            systemData.data.ad_show_time = 0;
            systemData.data.site_url = '';
            systemData.data.dark_tips = '';

            return JSON.stringify(systemData);
        } catch (e) {
            GM_log('[ERROR]', `[油猴1.0][系统信息API处理失败] ${e.message}`);
            return decryptedStr;
        }
    }

    function handleMovieBlockApi(decryptedStr) {
        try {
            GM_log('[INFO]', '[油猴1.0][系统视频信息API] 开始处理');
            let movieData = JSON.parse(decryptedStr);
            movieData = {
                ...movieData, data: movieData.data.map(item => ({
                    ...item, ad: [] // 设为空数组
                }))
            };

            return JSON.stringify(movieData);
        } catch (e) {
            GM_log('[ERROR]', `[油猴1.0][系统视频信息API处理失败] ${e.message}`);
            return decryptedStr;
        }
    }

    function handleMovieDetailApi(decryptedStr) {
        try {
            GM_log('[INFO]', '[油猴1.0][电影详情API] 开始处理');
            let movieData = JSON.parse(decryptedStr);
            movieData.data.balance = '99999999';
            movieData.data.balance_income = '99999999';
            movieData.data.balance_freeze = '0';
            if (movieData?.data?.lines && movieData.data.lines.length >= 2) {
                const vipLine = movieData.data.lines[1];
                if (vipLine?.link) {
                    movieData.data.backup_link = vipLine.link;
                    movieData.data.play_link = vipLine.link;
                    GM_log('[INFO]', `[油猴1.0][电影详情API] 播放线路：切换为VIP线路 → ${vipLine.link.slice(0, 50)}...`);
                }
            }

            movieData.data.name = '[油猴]___视频id: ' + movieData.data.id + ' 名称: ' + movieData.data.name;
            movieData.data.exp_level = 0;
            movieData.data.ad = [];
            movieData.data.ads = [];
            movieData.data.ad_apps = [];
            movieData.data.has_buy = 'y';
            movieData.data.has_favorite = 'y';
            movieData.data.has_follow = 'y';
            movieData.data.has_love = 'y';
            movieData.data.pay_type = 'y';
            movieData.data.money = 0;
            movieData.data.play_ads = [];
            movieData.data.play_ad_auto_jump = 'y';
            movieData.data.play_ad_show_time = 0;

            const videoId = movieData?.data?.id;
            let origin_play_link = movieData.data.play_link;
            movieData.data.play_link = '';
            movieData.data.backup_link = '';
            // if (videoId) {
            //     const playLink = getPlayLink(videoId);
            //     if (playLink&&typeof playLink!=="undefined"&&playLink!=="") {
            //         const startStr = "/h5/m3u8/link";
            //         const startIndex = playLink.indexOf(startStr);
            //         if (startIndex !== -1) {
            //             // 从startStr开始截取到结尾（包含后续所有内容）
            //             const subLink = playLink.slice(startIndex);
            //             GM_log('[INFO]',subLink);
            //             // 输出: /h5/m3u8/link/567c5935bd1de50452f0d601a6ef634b.m3u8
            //             movieData.data.backup_link = subLink;
            //             movieData.data.play_link = subLink;
            //         }
            //     }else{
            //         movieData.data.play_link = origin_play_link;
            //         movieData.data.backup_link = origin_play_link;
            //     }
            // }
            return JSON.stringify(movieData);
        } catch (e) {
            GM_log('[ERROR]', `[油猴1.0][电影详情API处理失败] ${e.message}`);
            return decryptedStr;
        }
    }


    function handleMovieSearchApi(decryptedStr) {
        try {
            GM_log('[INFO]', '[油猴1.0][电影搜索API] 开始处理');
            let movieData = JSON.parse(decryptedStr);

            movieData.data = movieData.data.filter(item => item.type != 'ad');

            return JSON.stringify(movieData);
        } catch (e) {
            GM_log('[ERROR]', `[油猴1.0][电影搜索API处理失败] ${e.message}`);
            return decryptedStr;
        }
    }

    function handleDanmakuApi(decryptedStr) {
        try {
            GM_log('[INFO]', '[油猴1.0][电影danmakuAPI] 开始处理');
            let movieData = JSON.parse(decryptedStr);

            // movieData.data = [];

            return JSON.stringify(movieData);
        } catch (e) {
            GM_log('[ERROR]', `[油猴1.0][电影danmakuAPI处理失败] ${e.message}`);
            return decryptedStr;
        }
    }


    // ==================== API路由 ====================
    function routeApiHandler(requestUrl, originData) {
        let match = false
        for (const api of CONFIG.targetApis) {
            if (requestUrl.includes(api.match)) {
                try {
                    // 核心流程：解密→业务处理→加密
                    match = true
                    const decrypted = aesEcbDecrypt(originData);
                    GM_log('[INFO]', `[油猴1.0][API路由] 匹配成功：${api.match} → 执行${api.handler.name}`);
                    let resDataStr = api.handler(decrypted)
                    let res = aesEcbEncrypt(resDataStr);
                    const testDecrypted = aesEcbDecrypt(res);
                    return res
                } catch (e) {
                    GM_log('[ERROR]', `[油猴1.0][目标API处理出错：] ${e.message}`);
                    return originData;
                }
            }
        }
        if (!match) {
            GM_log('[INFO]', `[油猴1.0][API路由] 未匹配目标API：${requestUrl}`);
            return originData;
        }
    }


    // ==================== XHR拦截 ====================
    GM_log('[INFO]', '[油猴][XHR拦截] 启用新拦截方式（原型链重写）');
    const XHR = XMLHttpRequest;
    const nativeOpen = XHR.prototype.open;
    const nativeSend = XHR.prototype.send;
    XHR.prototype.open = function (method, url, ...args) {
        this._url = url;
        return nativeOpen.apply(this, [method, url, ...args]);
    };

    XHR.prototype.send = function (body) {
        const xhr = this;
        const userLoad = xhr.onload;
        const userReady = xhr.onreadystatechange;
        xhr.onload = null;
        xhr.onreadystatechange = null;
        xhr.addEventListener('readystatechange', async () => {
            if (xhr.readyState !== 4) return;
            try {
                const raw = (xhr.responseType === '' || xhr.responseType === 'text') ? xhr.responseText : xhr.response;
                const modified = routeApiHandler(xhr._url, raw);
                //await new Promise()
                Object.defineProperty(xhr, 'responseText', {
                    value: modified, writable: false, configurable: true
                });
                if (xhr.responseType === '' || xhr.responseType === 'text') {
                    Object.defineProperty(xhr, 'response', {
                        value: modified, writable: false, configurable: true
                    });
                }
                if (userReady) userReady.call(xhr);
                if (userLoad) userLoad.call(xhr);
            } catch (e) {
                GM_log('[ERROR]', '[XHR-rewrite] async error', e);
                if (userReady) userReady.call(xhr);
                if (userLoad) userLoad.call(xhr);
            }
        });
        nativeSend.call(xhr, body);
    };


    /* **************  注入工具  ************** */

    // 监听注入JS发送的"状态查询/更新"事件
    unsafeWindow.addEventListener('gmStateOperation', function (event) {
        const {type, data, callbackId} = event.detail;

        // 处理不同类型的操作
        switch (type) {
            // 查询当前活跃请求ID
            case 'query':
                const activeId = GM_getValue('activeRequestId', '');
                sendResponse(callbackId, {success: true, data: activeId});
                break;

            // 更新当前活跃请求ID（新请求覆盖旧请求）
            case 'update':
                GM_setValue('activeRequestId', data);
                sendResponse(callbackId, {success: true});
                break;

            // 清除活跃请求ID（请求完成）
            case 'clear':
                GM_setValue('activeRequestId', '');
                sendResponse(callbackId, {success: true});
                break;
        }
    });

    // 向注入JS发送响应（通过事件）
    function sendResponse(callbackId, response) {
        unsafeWindow.dispatchEvent(new CustomEvent('gmStateResponse', {
            detail: {
                callbackId: callbackId,
                response: response
            }
        }));
    }


    /* 0. 先给页面埋一个 script 标签，把抢 XHR 的代码塞进去 */
    const inject = (code) => {
        try {
            // 直接创建脚本标签，不等待DOM加载事件
            const s = document.createElement('script');
            s.textContent = code;

            // 优先插入head，若head未就绪则插入documentElement
            const target = document.head || document.documentElement;
            if (target) {
                target.appendChild(s);
                console.log('脚本注入成功（在fetch前）');
                return true;
            } else {
                console.error('注入失败：未找到合适的父节点');
                alert('注入失败：未找到合适的父节点')
                return false;
            }
        } catch (error) {
            console.error('注入失败：', error);
            alert('注入失败：', error)
            return false;
        }
    };

    /* **************  油猴沙箱端：监听+代发请求  ************** */
    window.addEventListener('TM_fetchPlayLink', function (e) {
        const {videoId, ticket} = e.detail;
        console.error('[TM][GM] 收到页面请求，videoId=' + videoId + ', ticket=' + ticket);
        GM_xmlhttpRequest({
            method: 'POST', url: CONFIG.playLinkApi.url, anonymous: true, headers: {
                'Content-Type': 'application/json'
            }, data: JSON.stringify({video_id: videoId}), timeout: CONFIG.playLinkApi.timeout, onload: (res) => {
                GM_log('[ERROR]', '[TM][GM] videoId' + videoId + ' 请求成功，状态=' + res.status + ', 长度=' + res.responseText.length + '响应' + res.responseText);
                window.dispatchEvent(new CustomEvent('TM_playLinkResult', {
                    detail: {ticket: ticket, ok: true, text: res.responseText}
                }));
            },
            onerror: function (err) {
                GM_log('[ERROR]', '[TM][GM] videoId' + videoId + ' 请求失败', err);
                window.dispatchEvent(new CustomEvent('TM_playLinkResult', {
                    detail: {ticket: ticket, ok: false}
                }));
            },
            ontimeout: function () {
                GM_log('[ERROR]', '[TM][GM] videoId' + videoId + ' 请求超时');
                window.dispatchEvent(new CustomEvent('TM_playLinkResult', {
                    detail: {ticket: ticket, ok: false}
                }));
            }
        });
    });
    /* **************  先把 CryptoJS 插进去  ************** */
    const cryptoScript = document.createElement('script');
    cryptoScript.src = 'https://cdn.bootcdn.net/ajax/libs/crypto-js/4.2.0/crypto-js.js';
    cryptoScript.onload = () => {
        /* **************  1. 所有主逻辑（CONFIG + 工具函数 + XHR 代理）  ************** */
        const mainLogic = `
        debugger
/* 复用主脚本的CONFIG配置 */
${getConfigString()}

/* ---------------- AES 工具 ---------------- */
function aesEcbDecrypt(cipherText){
  try{
    const cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: CryptoJS.enc.Base64.parse(cipherText)
    });
    const decrypted = CryptoJS.AES.decrypt(cipherParams, CryptoJS.enc.Utf8.parse(CONFIG.aes.key), {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  }catch(e){
    console.error('[TM][AES解密失败]', e);
    throw e;
  }
}
function aesEcbEncrypt(plainText){
  try{
    const encrypted = CryptoJS.AES.encrypt(plainText, CryptoJS.enc.Utf8.parse(CONFIG.aes.key), {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
  }catch(e){
    console.error('[TM][AES加密失败]', e);
    throw e;
  }
}
    // ==================== 6. 播放链接获取（脚本猫GM兼容） ====================
/* 2.1 工具：发消息给油猴并等待结果 */
  function askTampermonkey(videoId){
    return new Promise(function(resolve,reject){
      const ticket = Math.random().toString(36).slice(2);
      function listen(e){
        if(e.detail.ticket === ticket){
          window.removeEventListener('TM_playLinkResult', listen);
          e.detail.ok ? resolve(e.detail.text) : reject(new Error('GM 请求失败'));
        }
      }
      window.addEventListener('TM_playLinkResult', listen);
      window.dispatchEvent(new CustomEvent('TM_fetchPlayLink', {detail:{videoId:videoId, ticket:ticket}}));
    });
  }

  /* 2.2 你的 getPlayLink：只负责调度，不真正发请求 */
    // 与Tampermonkey通信的工具函数（封装事件调用）
    const gmState = {
        // 发送状态操作请求（返回Promise）
        request: function(type, data) {
            return new Promise((resolve) => {
                const callbackId = 'cb_' + Date.now() + Math.random().toString(36).slice(2);

                // 监听响应事件
                const handleResponse = function(event) {
                    if (event.detail.callbackId === callbackId) {
                        window.removeEventListener('gmStateResponse', handleResponse);
                        resolve(event.detail.response);
                    }
                };
                window.addEventListener('gmStateResponse', handleResponse);

                // 发送操作请求
                window.dispatchEvent(new CustomEvent('gmStateOperation', {
                    detail: { type, data, callbackId }
                }));
            });
        },

        // 查询当前活跃请求ID
        queryActiveId: function() {
            return this.request('query');
        },

        // 更新活跃请求ID
        updateActiveId: function(id) {
            return this.request('update', id);
        },

        // 清除活跃请求ID
        clearActiveId: function() {
            return this.request('clear');
        }
    };

    // /**
    //  * 获取播放链接（注入JS核心函数）
    //  * @param {string} videoId - 视频ID
    //  * @returns {Promise<string|null>}
    //  */
    // async function getPlayLinkAsync(videoId) {
    //     // 生成当前请求唯一标识
    //     const requestId = 'req_' + Date.now() + Math.random().toString(36).slice(2);
    //     console.log('[Injected] 发起新请求，videoId=' + videoId + '，requestId=' + requestId);

    //     // 通知外部更新活跃请求ID（覆盖旧请求）
    //     await gmState.updateActiveId(requestId);

    //     try {
    //         // 重试循环
    //         for (let attempt = 1; attempt <= CONFIG.playLinkApi.maxAttempts; attempt++) {
    //             // 检查当前活跃ID是否为自己（新请求会覆盖此值）
    //             const currentActiveId = (await gmState.queryActiveId()).data;
    //             if (currentActiveId !== requestId) {
    //                 console.error('[Injected] 检测到新请求，当前请求停止重试（videoId=' + videoId + ' 本requestId=' + requestId + '）');
    //                 return "";
    //             }

    //             try {
    //                 console.error('[Injected] 第' + attempt + '次尝试（videoId=' + videoId + ' 本requestId=' + requestId + '）');
    //                 const responseText = await askTampermonkey(videoId);
    //                 const responseJson = JSON.parse(responseText);

    //                 if (responseJson && responseJson.playLink && responseJson.playLink.indexOf('http') === 0) {
    //                 //debugger
    //                     console.error('[Injected] videoId=' + videoId + ' 成功获取播放链接：' + responseJson.playLink);
    //                     //openPlayers(responseJson.playLink);
    //                     // await gmState.clearActiveId(); // 清除状态
    //                     return responseJson.playLink;
    //                 }
    //             } catch (error) {
    //                 console.error('[Injected] videoId=' + videoId + ' 第' + attempt + '次尝试失败：' + error.message);
    //             }

    //             // 重试前等待
    //             await new Promise(resolve => setTimeout(resolve, CONFIG.playLinkApi.retryDelay));

    //             // 等待后再次检查活跃状态
    //             const activeAfterWait = (await gmState.queryActiveId()).data;
    //             if (activeAfterWait !== requestId) {
    //                 console.error('[Injected] videoId=' + videoId + ' 等待后检测到新请求，停止重试（requestId=' + requestId + '）');
    //                 return "";
    //             }
    //         }

    //         // 所有重试失败
    //         console.error('[Injected] videoId=' + videoId + ' 达到最大重试次数（requestId=' + requestId + '）');
    //         await gmState.clearActiveId();
    //         return "";
    //     } catch (error) {
    //         console.error('[Injected] videoId=' + videoId + ' 请求异常：' + error.message);
    //         // 仅当自己仍为活跃请求时才清除状态
    //         const currentActiveId = (await gmState.queryActiveId()).data;
    //         if (currentActiveId === requestId) {
    //             await gmState.clearActiveId();
    //         }
    //         return "";
    //     }
    // }


    /**
     * 获取播放链接（注入JS核心函数）
     * @param {string} videoId - 视频ID
     * @returns {Promise<string|null>}
     */
    async function getPlayLink(videoId) {
        // 生成当前请求唯一标识
        const requestId = 'req_' + Date.now() + Math.random().toString(36).slice(2);
        console.log('[Injected] 发起新请求，videoId=' + videoId + '，requestId=' + requestId);

        // 通知外部更新活跃请求ID（覆盖旧请求）
        // await gmState.updateActiveId(requestId);

        try {
            // 重试循环
            for (let attempt = 1; attempt <= CONFIG.playLinkApi.maxAttempts; attempt++) {
                // 检查当前活跃ID是否为自己（新请求会覆盖此值）
                const currentActiveId = (await gmState.queryActiveId()).data;
                // if (currentActiveId !== requestId) {
                //     console.error('[Injected] 检测到新请求，当前请求停止重试（videoId=' + videoId + ' 本requestId=' + requestId + '）');
                //     return "";
                // }

                try {
                    console.error('[Injected] 第' + attempt + '次尝试（videoId=' + videoId + ' 本requestId=' + requestId + '）');
                    const responseText = await askTampermonkey(videoId);
                    const responseJson = JSON.parse(responseText);

                    if (responseJson && responseJson.playLink && responseJson.playLink.indexOf('http') === 0) {
                    //debugger
                        console.error('[Injected] videoId=' + videoId + ' 成功获取播放链接：' + responseJson.playLink);
                        //openPlayers(responseJson.playLink);
                        // await gmState.clearActiveId(); // 清除状态
                        return responseJson.playLink;
                    }
                } catch (error) {
                    console.error('[Injected] videoId=' + videoId + ' 第' + attempt + '次尝试失败：' + error.message);
                }

                // 重试前等待
                await new Promise(resolve => setTimeout(resolve, CONFIG.playLinkApi.retryDelay));

                // // 等待后再次检查活跃状态
                // const activeAfterWait = (await gmState.queryActiveId()).data;
                // if (activeAfterWait !== requestId) {
                //     console.error('[Injected] videoId=' + videoId + ' 等待后检测到新请求，停止重试（requestId=' + requestId + '）');
                //     return "";
                // }
            }

            // 所有重试失败
            console.error('[Injected] videoId=' + videoId + ' 达到最大重试次数（requestId=' + requestId + '）');
            // await gmState.clearActiveId();
            return "";
        } catch (error) {
            console.error('[Injected] videoId=' + videoId + ' 请求异常：' + error.message);
            // 仅当自己仍为活跃请求时才清除状态
            // const currentActiveId = (await gmState.queryActiveId()).data;
            // if (currentActiveId === requestId) {
            //     await gmState.clearActiveId();
            // }
            return "";
        }
    }

async function handleUserInfoApi(decryptedStr) {
    try {
        console.log('[油猴1.0][用户信息API] 开始处理');
        let userData = JSON.parse(decryptedStr);
        userData.data.is_vip = 'y';
        userData.data.is_dark_vip = 'y';
        userData.data.exp_level = 6;
        userData.data.balance = '99999999';
        userData.data.balance_income = '99999999';
        userData.data.balance_freeze = '0';
        userData.data.group_end_time = '2999-09-09到期';
        userData.data.post_banner = [];
        userData.data.bottom_ads = [];
        userData.data.bottom_ad = {};
        userData.data.layer_ad = {};
        userData.data.layer_ads = [];
        userData.data.layer_app = [];
        userData.data.ad = {};
        userData.data.ads = [];
        userData.data.notice = '';
        userData.data.ad_auto_jump = 'n';
        userData.data.site_url = '';
        userData.data.dark_tips = '';
        return JSON.stringify(userData);
    } catch (e) {
        console.error('[油猴1.0][用户信息API处理失败]',e.message);
        return decryptedStr;
    }
}

async function handleSystemInfoApi(decryptedStr) {
    try {
        console.log('[油猴1.0][系统信息API] 开始处理');
        let systemData = JSON.parse(decryptedStr);
        systemData.data.post_banner = [];
        systemData.data.bottom_ads = [];
        systemData.data.bottom_ad = {};
        systemData.data.layer_ad = {};
        systemData.data.layer_ads = [];
        systemData.data.layer_app = [];
        systemData.data.ad = {};
        systemData.data.ads = [];
        systemData.data.notice = '';
        systemData.data.ad_auto_jump = 'y';
        systemData.data.ad_show_time = 0;
        systemData.data.site_url = '';
        systemData.data.dark_tips = '';
        return JSON.stringify(systemData);
    } catch (e) {
        console.error('[油猴1.0][系统信息API处理失败]',e.message);
        return decryptedStr;
    }
}
async function handleMovieBlockApi(decryptedStr) {
    try {
        console.log('[油猴1.0][系统视频信息API] 开始处理');
        let movieData = JSON.parse(decryptedStr);
        movieData = {
            ...movieData, data: movieData.data.map(item => ({
                ...item, ad: [] // 设为空数组
            }))
        };
        return JSON.stringify(movieData);
    } catch (e) {
        console.error('[油猴1.0][系统视频信息API处理失败]',e.message);
        return decryptedStr;
    }
}
async function handleMovieDetailApi(decryptedStr) {
    try {
        console.log('[油猴1.0][电影详情API] 开始处理');
        let movieData = JSON.parse(decryptedStr);
        movieData.data.balance = '99999999';
        movieData.data.balance_income = '99999999';
        movieData.data.balance_freeze = '0';
        // if (movieData?.data?.lines && movieData.data.lines.length >= 2) {
        //     const vipLine = movieData.data.lines[1];
        //     if (vipLine?.link) {
        //         movieData.data.backup_link = vipLine.link;
        //         movieData.data.play_link = vipLine.link;
        //         console.log('[油猴1.0][电影详情API] 播放线路：切换为VIP线路 → ',vipLine.link.slice(0, 50));
        //     }
        // }
        movieData.data.name = '[油猴]___视频id: ' +movieData.data.id + ' 名称: ' + movieData.data.name;
            movieData.data.exp_level = 0;
            movieData.data.ad = [];
            movieData.data.ads = [];
            movieData.data.ad_apps = [];
            movieData.data.has_buy = 'y';
            movieData.data.has_favorite = 'y';
            movieData.data.has_follow = 'y';
            movieData.data.has_love = 'y';
            movieData.data.pay_type = 'y';
            movieData.data.money = 0;
            movieData.data.play_ads = [];
            movieData.data.play_ad_auto_jump = 'y';
            movieData.data.play_ad_show_time = 0;
        const videoId = movieData?.data?.id;
        let origin_play_link = movieData.data.play_link;
        movieData.data.play_link = '';
        movieData.data.backup_link = '';
        if (videoId) {
            const playLink = await getPlayLink(videoId);
            //const playLink = '';
            if (playLink&&typeof playLink!=="undefined"&&playLink!=="") {
                 const startStr = "/h5/m3u8/link";
                 const startIndex = playLink.indexOf(startStr);
                 if (startIndex !== -1) {
                     // 从startStr开始截取到结尾（包含后续所有内容）
                     const subLink = playLink.slice(startIndex);
                     console.log(subLink);
                     // 输出: /h5/m3u8/link/567c5935bd1de50452f0d601a6ef634b.m3u8
                     movieData.data.backup_link = subLink;
                     movieData.data.play_link = subLink;
                 }
             }else{
                movieData.data.play_link = origin_play_link;
                movieData.data.backup_link = origin_play_link;
             }
        }
        // movieData.data.backup_link = '';
        // movieData.data.play_link = '';
        return JSON.stringify(movieData);
    } catch (e) {
        console.error('[油猴1.0][电影详情API处理失败]',e.message);
        return decryptedStr;
    }
}
async function handleMovieSearchApi(decryptedStr) {
    try {
        console.log('[油猴1.0][电影搜索API] 开始处理');
        let movieData = JSON.parse(decryptedStr);
        movieData.data = movieData.data.filter(item => item.type != 'ad');
        return JSON.stringify(movieData);
    } catch (e) {
        console.error('[油猴1.0][电影搜索API处理失败]',e.message);
        return decryptedStr;
    }
}
async function handleDanmakuApi(decryptedStr) {
    try {
        console.log('[油猴1.0][电影danmakuAPI] 开始处理');
        let movieData = JSON.parse(decryptedStr);
        // movieData.data = [];
        return JSON.stringify(movieData);
    } catch (e) {
        console.error('[油猴1.0][电影danmakuAPI处理失败]',e.message);
        return decryptedStr;
    }
}
    // ==================== API路由 ====================
    async function routeApiHandler(requestUrl, originData) {
        let match = false
        for (const api of CONFIG.targetApis) {
            if (requestUrl.includes(api.match)) {
                try {
                    // 核心流程：解密→业务处理→加密
                    match = true
                    const decrypted = aesEcbDecrypt(originData);
                    console.log('[油猴1.0][API路由] 匹配成功',api.match,' → 执行',api.handler.name);
                    let resDataStr = await api.handler(decrypted)
                    let res = aesEcbEncrypt(resDataStr);
                    const testDecrypted = aesEcbDecrypt(res);
                    return res
                } catch (e) {
                    console.error('[油猴1.0][目标API处理出错：]',e.message);
                    return originData;
                }
            }
        }
        if (!match) {
            console.log('[油猴1.0][API路由] 未匹配目标API：',requestUrl);
            return originData;
        }
    }

        function routeApiHandlerAddUrl(requestUrl, originData) {
        let match = false
        for (const api of CONFIG.targetApis) {
            if (requestUrl.includes(api.match)) {
                try {
                    // 核心流程：解密→业务处理→加密
                    match = true
                    const decryptedStr = aesEcbDecrypt(originData);
                    console.log('[油猴1.0][API路由] 匹配成功',api.match,' → 执行',api.handler.name);
                    let resDataStr = decryptedStr;
                    try {
                        console.log('[油猴1.0][API_URL增加] 开始处理');
                        let movieData = JSON.parse(decryptedStr);
                        movieData.api_url = requestUrl;
                         resDataStr = JSON.stringify(movieData);
                    } catch (e) {
                        console.error('[油猴1.0][API_URL增加处理失败]',e.message);
                    }
                    let res = aesEcbEncrypt(resDataStr);
                    const testDecrypted = aesEcbDecrypt(res);
                    return res
                } catch (e) {
                    console.error('[油猴1.0][目标API_URL增加处理出错：]',e.message);
                    return originData;
                }
            }
        }
        if (!match) {
            console.log('[油猴1.0][API_URL增加] 未匹配目标API：',requestUrl);
            return originData;
        }
    }

/* ---------------- XHR 代理 ---------------- */
    const XHR = XMLHttpRequest;
    const nativeOpen = XHR.prototype.open;
    const nativeSend = XHR.prototype.send;
    XHR.prototype.open = function (method, url, ...args) {
        this._url = url;
        return nativeOpen.apply(this, [method, url, ...args]);
    };

    XHR.prototype.send = function (body) {
        const xhr = this;
        const userLoad = xhr.onload;
        const userReady = xhr.onreadystatechange;
        xhr.onload = null;
        xhr.onreadystatechange = null;
        xhr.addEventListener('readystatechange', () => {
            if (xhr.readyState !== 4) return;
            try {
                const raw = (xhr.responseType === '' || xhr.responseType === 'text') ? xhr.responseText : xhr.response;
                const modified = routeApiHandlerAddUrl(xhr._url, raw);
                Object.defineProperty(xhr, 'responseText', {
                    value: modified, writable: false, configurable: true
                });
                if (xhr.responseType === '' || xhr.responseType === 'text') {
                    Object.defineProperty(xhr, 'response', {
                        value: modified, writable: false, configurable: true
                    });
                }
                if (userReady) userReady.call(xhr);
                if (userLoad) userLoad.call(xhr);
            } catch (e) {
                console.error('[XHR-rewrite] async error', e);
                if (userReady) userReady.call(xhr);
                if (userLoad) userLoad.call(xhr);
            }
        });
        //debugger
        nativeSend.call(xhr, body);
    };
`;
        inject(mainLogic);
    };
    cryptoScript.onerror = () => GM_log('[ERROR]', '[TM] CryptoJS 外部地址加载失败');
    document.documentElement.insertBefore(cryptoScript, document.documentElement.firstChild);

    // ==================== Fetch拦截 ====================
    const originalFetch = window.fetch;
    window.fetch = async function (input, init) {
        const request = input instanceof Request ? input : new Request(input, init);
        const requestUrl = request.url;

        const isTargetApi = CONFIG.targetApis.some(api => requestUrl.includes(api.match));
        if (!isTargetApi) return originalFetch.apply(this, arguments);

        GM_log('[INFO]', `[油猴1.0][Fetch监听] 处理目标API：${requestUrl}`);
        try {
            const originalRes = await originalFetch.apply(this, arguments);
            const resClone = originalRes.clone();
            const originData = await resClone.text();

            const data = await routeApiHandler(requestUrl, originData);

            return new Response(data, {
                status: originalRes.status, statusText: originalRes.statusText, headers: originalRes.headers
            });
        } catch (e) {
            GM_log('[ERROR]', `[油猴1.0][Fetch处理失败] API：${requestUrl} → ${e.message}`);
            alert(`[油猴1.0][Fetch处理失败] API：${requestUrl} → ${e.message}`)
            return originalFetch.apply(this, arguments);
        }
    };


    // ==================== Script处理 ====================
    async function handleScriptNode(originalScript) {
        const scriptUrl = originalScript.src;
        if (!scriptUrl || !CONFIG.script.targetReg.test(scriptUrl)) return;

        try {
            originalScript.parentNode?.removeChild(originalScript);
            GM_log('[INFO]', `[油猴1.0][Script处理] 移除原Nuxt脚本：${scriptUrl}`);

            const response = await fetch(scriptUrl);
            if (!response.ok) throw new Error(`脚本请求失败：${response.status}`);
            let scriptText = await response.text();

            const oldLength = scriptText.length;
            scriptText = scriptText.replace(CONFIG.script.jumpCode, '');
            if (scriptText.length != oldLength) {
                GM_log('[INFO]', `[油猴1.0][Script处理] 已移除跳转代码：${CONFIG.script.jumpCode}`);
            }
            // debugger

            GM_log('[INFO]', `[油猴1.0][Script处理] 已替换函数为异步函数`);
            const hasScriptTxt = scriptText.indexOf('请求体解析错误');
            if (hasScriptTxt !== -1) {
                const oldLength = scriptText.length;
                // scriptText = scriptText.replaceAll('"request",(function', '"request",(async function')
                scriptText = scriptText.replaceAll('transformResponse:function(e){try{return JSON.parse(e)}catch(e){}var n;try{var t=yn.decrypt(e,jn,{mode:xn}).toString(wn);n=JSON.parse(t)}catch(e){n={status:"n",error:"数据解析错误"}}return n}}).then((function(e){if(!e||"y"!==e.status)return Promise.reject(e);c(e.data)})).catch(', 'transformResponse:async function(e){try{return JSON.parse(e)}catch(e){}var n;try{var t=yn.decrypt(e,jn,{mode:xn}).toString(wn);n=JSON.parse(t)}catch(e){n={status:"n",error:"数据解析错误"}}return n}}).then((async function(e){if(!e||"y"!==e.status)return Promise.reject(e);let handled;let f=JSON.stringify(e);if(e.api_url&&typeof e.api_url!=="undefined"&&e.api_url!==""){try{let f=JSON.stringify(e);let res=aesEcbEncrypt(f);handled=await routeApiHandler(e.api_url,res);let dataDecrypted=aesEcbDecrypt(handled);let dataJson=JSON.parse(dataDecrypted);c(dataJson.data)}catch(ee){console.error(ee)}console.error("注入成功 会员视频链接覆写成功");}else{c(e.data)}})).catch(')
                if (scriptText.length != oldLength) {
                    console.log(`[油猴1.0][Script处理] 已移替换解析代码`);
                }
            }

            const newScript = document.createElement('script');
            newScript.setAttribute(CONFIG.script.marker, 'true');
            newScript.async = originalScript.async;
            newScript.defer = originalScript.defer;
            if (originalScript.crossOrigin) newScript.crossOrigin = originalScript.crossOrigin;

            const blob = new Blob([scriptText], {type: 'text/javascript'});
            newScript.src = URL.createObjectURL(blob);
            newScript.onload = () => URL.revokeObjectURL(blob);

            if (originalScript.parentNode) {
                originalScript.parentNode.insertBefore(newScript, originalScript);
            } else if (document.head) {
                document.head.appendChild(newScript);
            }
            GM_log('[INFO]', `[油猴1.0][Script处理完成] 注入修改后脚本：${scriptUrl}`);
        } catch (e) {
            GM_log('[ERROR]', `[油猴1.0][Script处理失败] ${scriptUrl} → ${e.message}`);
        }
    }

    const scriptObserver = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.tagName === 'SCRIPT' && CONFIG.script.targetReg.test(node.src) && !node.hasAttribute(CONFIG.script.marker)) {
                    handleScriptNode(node);
                }
            });
        });
    });
    scriptObserver.observe(document.documentElement, {childList: true, subtree: true});


    // ==================== 清理与初始化日志 ====================
    window.addEventListener('beforeunload', () => {
        scriptObserver.disconnect();
        GM_log('[INFO]', '[油猴1.0][清理] 停止Script DOM监听');
    });

    GM_log('[INFO]', '[油猴1.0][初始化完成] 脚本猫兼容修复：');
    GM_log('[INFO]', '✅ 已删除GM_log（脚本猫不支持），替换为console.log');
    GM_log('[INFO]', '✅ 保留GM_xmlhttpRequest（脚本猫支持，解决CORS）');
    GM_log('[INFO]', '✅ 日志查看：脚本猫图标→"日志"面板→选择当前脚本');
})();