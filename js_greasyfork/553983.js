// ==UserScript==
// @name         B站音频一键推送 TS3AudioBot
// @namespace    https://github.com/HuxiaoRoar/TS3AudioBot-Pusher/
// @homepage     https://github.com/HuxiaoRoar/TS3AudioBot-Pusher/
// @version      1.2.2
// @icon         https://djy.luotianyi.blue/icon/lty-b.jpg
// @description  提取BV信息→支持分P/合集批量操作→直接播放 或 加入队列
// @author       HuxiaoRoar
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/festival/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553983/B%E7%AB%99%E9%9F%B3%E9%A2%91%E4%B8%80%E9%94%AE%E6%8E%A8%E9%80%81%20TS3AudioBot.user.js
// @updateURL https://update.greasyfork.org/scripts/553983/B%E7%AB%99%E9%9F%B3%E9%A2%91%E4%B8%80%E9%94%AE%E6%8E%A8%E9%80%81%20TS3AudioBot.meta.js
// ==/UserScript==


(() => {
    'use strict';

    /* ========= 配置键名 ========= */
    const CFG_HOST = 'ts3ab_host'; // http://ip:port
    const CFG_BOT  = 'ts3ab_bot';  // 默认 0

    /* ---------- 注册菜单 ---------- */
    GM_registerMenuCommand('⚙️ 设置', openConfigPanel);

    /* ---------- 读取配置 ---------- */
    function getCfg(key, def = '') {
        return GM_getValue(key, def);
    }

    /* ---------- 配置面板 ---------- */
    function openConfigPanel() {
        const old = document.getElementById('tm_config_panel');
        if (old) old.remove();

        const panel = document.createElement('div');
        panel.id = 'tm_config_panel';
        Object.assign(panel.style, {
            position: 'fixed', zIndex: 99999, top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)', width: '320px', padding: '20px',
            background: '#fff', border: '1px solid #888', borderRadius: '12px',
            fontSize: '14px', fontFamily: 'sans-serif', color: '#333'
        });

        panel.innerHTML = `
            <h3 style="margin:0 0 10px">TS3AudioBot 配置</h3>
            <label>机器人地址<br><input id="cfg_host" type="text" placeholder="http://192.168.50.32:58913" style="width:100%;box-sizing:border-box;margin-bottom:8px;padding:4px;"></label>
            <label>机器人序号<br><input id="cfg_bot"  type="text" placeholder="0" style="width:100%;box-sizing:border-box;margin-bottom:8px;padding:4px;"></label>
            <div style="text-align:right">
                <button id="cfg_save" style="margin-right:6px;border:none;background:#007bff;color:#fff;padding:5px 12px;border-radius:4px;cursor:pointer;">保存</button>
                <button id="cfg_cancel" style="border:none;background:#6c757d;color:#fff;padding:5px 12px;border-radius:4px;cursor:pointer;">取消</button>
            </div>
        `;
        document.body.appendChild(panel);

        document.getElementById('cfg_host').value = getCfg(CFG_HOST, 'http://192.168.50.32:58913');
        document.getElementById('cfg_bot').value  = getCfg(CFG_BOT, '0');

        document.getElementById('cfg_save').onclick = () => {
            GM_setValue(CFG_HOST, document.getElementById('cfg_host').value.trim());
            GM_setValue(CFG_BOT,  document.getElementById('cfg_bot').value.trim());
            panel.remove();
            toast('✅ 已保存');
        };
        document.getElementById('cfg_cancel').onclick = () => panel.remove();
    }

    /* ---------- Toast 提示 ---------- */
    function toast(msg) {
        const t = document.createElement('div');
        Object.assign(t.style, {
            position: 'fixed', left: '50%', bottom: '30px', transform: 'translateX(-50%)',
            background: 'rgba(0,0,0,0.75)', color: '#fff', padding: '8px 14px',
            borderRadius: '4px', fontSize: '14px', zIndex: 99999
        });
        t.textContent = msg;
        document.body.appendChild(t);
        setTimeout(() => t.remove(), 1500);
    }

    /* ---------- 主按钮容器 (第一行) ---------- */
    const btnContainer = document.createElement('div');
    Object.assign(btnContainer.style, {
        position: 'fixed', top: '200px', right: '15px', zIndex: 9999,
        display: 'flex' // 使用flex布局让按钮并排
    });

    /* ---------- 创建按钮 (第一行) ---------- */
    const btnPlay = document.createElement('button');
    btnPlay.textContent = '直接播放';
    Object.assign(btnPlay.style, {
        background: '#00aeec', color: '#fff', border: 'none',
        borderTopLeftRadius: '6px', borderBottomLeftRadius: '6px',
        padding: '8px 12px', cursor: 'pointer', fontSize: '14px'
    });

    const btnAdd = document.createElement('button');
    btnAdd.textContent = '加入队列';
    Object.assign(btnAdd.style, {
        background: '#00aeec', color: '#fff', border: 'none',
        borderLeft: '1px solid #fff', // 添加一个分隔线
        borderTopRightRadius: '6px', borderBottomRightRadius: '6px',
        padding: '8px 12px', cursor: 'pointer', fontSize: '14px'
    });

    btnContainer.appendChild(btnPlay);
    btnContainer.appendChild(btnAdd);
    document.body.appendChild(btnContainer);

    /* ---------- 批量按钮容器 (第二行) ---------- */
    const btnContainerBatch = document.createElement('div');
    Object.assign(btnContainerBatch.style, {
        position: 'fixed', top: '240px', right: '15px', zIndex: 9999,
        display: 'none', // 默认隐藏
        flexDirection: 'flex' // 使用flex布局让按钮并排
    });

    /* ---------- 创建按钮 (第二行) ---------- */
const btnBatchPlay = document.createElement('button');
    btnBatchPlay.textContent = '批量播放';
    Object.assign(btnBatchPlay.style, {
        background: '#fb7299', color: '#fff', border: 'none',
        borderTopLeftRadius: '6px', // 【修改点】
        borderBottomLeftRadius: '6px', // 【修改点】
        padding: '8px 12px', cursor: 'pointer', fontSize: '14px'
    });

    const btnBatchAdd = document.createElement('button');
    btnBatchAdd.textContent = '批量添加';
    Object.assign(btnBatchAdd.style, {
        background: '#fb7299', color: '#fff', border: 'none',
        borderLeft: '1px solid #fff', // 【修改点】添加一个分隔线
        borderTopRightRadius: '6px', // 【修改点】
        borderBottomRightRadius: '6px', // 【修改点】
        padding: '8px 12px', cursor: 'pointer', fontSize: '14px'
    });

    btnContainerBatch.appendChild(btnBatchPlay);
    btnContainerBatch.appendChild(btnBatchAdd);
    document.body.appendChild(btnContainerBatch);


    /* ---------- 按钮状态管理 ---------- */
    const setAllButtonsState = (disabled) => {
        const opacity = disabled ? 0.7 : 1;
        
        // Row 1
        btnPlay.disabled = disabled;
        btnAdd.disabled = disabled;
        btnPlay.style.opacity = opacity;
        btnAdd.style.opacity = opacity;
        btnPlay.textContent = disabled ? '处理中...' : '直接播放';
        btnAdd.textContent = disabled ? '...' : '加入队列';

        // Row 2
        btnBatchPlay.disabled = disabled;
        btnBatchAdd.disabled = disabled;
        btnBatchPlay.style.opacity = opacity;
        btnBatchAdd.style.opacity = opacity;
        btnBatchPlay.textContent = disabled ? '处理中...' : '批量播放';
        btnBatchAdd.textContent = disabled ? '...' : '批量添加';
    };


    /* ---------- 核心请求逻辑 (第一行：播放/添加 *单个*) ---------- */
    const handleRequest = async (command) => {
        const host = getCfg(CFG_HOST);
        const bot  = getCfg(CFG_BOT, '0');

        if (!host) {
            toast('❌ 请先点击 Tampermonkey 扩展图标 -> 本脚本 -> 设置, 来配置机器人地址');
            openConfigPanel();
            return;
        }

        // 1. 取 BV
        const bvMatch = /(BV[a-zA-Z0-9]+)/.exec(location.href);
        if (!bvMatch) { toast('❌ 无法提取 BV'); return; }
        const bv = bvMatch[1];

        // 禁用所有按钮
        setAllButtonsState(true);

        try {
            // 2. 拿视频信息
            const info = await fetch(`https://api.bilibili.com/x/web-interface/view?bvid=${bv}`)
                .then(r => r.json());
            if (info.code !== 0) throw new Error('获取B站视频信息失败');


            // 3. 处理分P逻辑，生成最终发送内容
            let payload = bv; // 默认发送纯bv号 (用于单P视频)
            if (info.data.videos > 1) {
                // 如果是多P视频
                const urlParams = new URL(location.href).searchParams;
                const pageParam = urlParams.get('p');
                if (pageParam) {
                    // 如果URL中有p参数，例如 &p=2
                    payload = `${bv}-${pageParam}`;
                } else {
                    // 如果URL中没有p参数，说明是第1P
                    payload = `${bv}-1`;
                }
            }

            // 4. 构建请求URL
            // command 可以是 'v' (播放) 或 'add' (添加)
            const requestUrl = `${host}/api/bot/use/${bot}/(/b/${command}/${payload})`;
          //  console.log(`[TS3AudioBot Script] Sending request to: ${requestUrl}`); // 方便调试

            // 5. 发送请求
            await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: requestUrl,
                    onload: r => (r.status >= 200 && r.status < 300 ? resolve(r) : reject(new Error(`请求失败: ${r.statusText}`))),
                    onerror: err => reject(err)
                });
            });

            toast(`✅ 已发送: ${payload}`);
        } catch (e) {
            console.error('[TS3AudioBot Script]', e);
            toast(`❌ 失败: ${e.message}`);
        } finally {
            // 恢复所有按钮
            setAllButtonsState(false);
            // 重新初始化UI以防状态不一致 (例如在分P切换时)
            initializeUIForPage();
        }
    };

    /* ---------- 核心请求逻辑 (第二行：播放/添加 *批量*) ---------- */
    const handleBatchRequest = async (action) => {
        const host = getCfg(CFG_HOST);
        const bot  = getCfg(CFG_BOT, '0');

        if (!host) {
            toast('❌ 请先点击 Tampermonkey 扩展图标 -> 本脚本 -> 设置, 来配置机器人地址');
            openConfigPanel();
            return;
        }

        // 1. 取 BV
        const bvMatch = /(BV[a-zA-Z0-9]+)/.exec(location.href);
        if (!bvMatch) { toast('❌ 无法提取 BV'); return; }
        const bv = bvMatch[1];

        // 禁用所有按钮
        setAllButtonsState(true);

        try {
            // 2. 从DOM中获取状态 (已在 initializeUIForPage 中存入)
            const isCollection = btnContainerBatch.dataset.isCollection === 'true';
            const isMultiPart = btnContainerBatch.dataset.isMultiPart === 'true';

            // 3. 根据逻辑生成 command 和 payload
            let command, payload;
            payload = bv; // 基础 payload

            if (isCollection) {
                // 合集优先
                command = (action === 'play') ? 'vall' : 'addall';
            } else if (isMultiPart) {
                // 仅分P (非合集)
                command = (action === 'play') ? 'v' : 'add';
                payload = `${bv}-a`;
            } else {
                // 理论上不应该到这里，因为按钮是隐藏的
                throw new Error('批量按钮逻辑错误');
            }

            // 4. 构建请求URL
            const requestUrl = `${host}/api/bot/use/${bot}/(/b/${command}/${payload})`;
          //  console.log(`[TS3AudioBot Script] Sending BATCH request to: ${requestUrl}`); // 方便调试

            // 5. 发送请求
            await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: requestUrl,
                    onload: r => (r.status >= 200 && r.status < 300 ? resolve(r) : reject(new Error(`请求失败: ${r.statusText}`))),
                    onerror: err => reject(err)
                });
            });

            toast(`✅ 已发送批量请求: ${payload}`);
        } catch (e) {
            console.error('[TS3AudioBot Script]', e);
            toast(`❌ 失败: ${e.message}`);
        } finally {
            // 恢复所有按钮
            setAllButtonsState(false);
        }
    };


    /* ---------- 点击事件绑定 ---------- */
    // 左边按钮：直接播放
    btnPlay.onclick = () => handleRequest('v');

    // 右边按钮：加入队列
    btnAdd.onclick = () => handleRequest('add');

    // 批量播放
    btnBatchPlay.onclick = () => handleBatchRequest('play');

    // 批量添加
    btnBatchAdd.onclick = () => handleBatchRequest('add');


    /* ---------- 路由变化时重置按钮状态并检查UI ---------- */
    const initializeUIForPage = async () => {
        // 1. 重置所有按钮到初始状态
        setAllButtonsState(false);

        // 2. 默认隐藏批量按钮并清除状态
        btnContainerBatch.style.display = 'none';
        btnContainerBatch.dataset.isCollection = 'false';
        btnContainerBatch.dataset.isMultiPart = 'false';

        // 3. 获取BV
        const bvMatch = /(BV[a-zA-Z0-9]+)/.exec(location.href);
        if (!bvMatch) return; // 不是视频页
        const bv = bvMatch[1];

        // 4. 异步获取视频信息来决定是否显示批量按钮
        try {
            const info = await fetch(`https://api.bilibili.com/x/web-interface/view?bvid=${bv}`)
                .then(r => r.json());
            if (info.code !== 0) throw new Error('获取B站视频信息API失败');

            const data = info.data;
            // !!data.ugc_season 检查是否存在合集对象 (如 简介.json)
            const isCollection = !!data.ugc_season; 
            // data.videos > 1 检查是否为分P (如 分p.json)
            const isMultiPart = data.videos > 1; 

            // 5. 如果是合集 或 分P，则显示批量按钮
            if (isCollection || isMultiPart) {
               // console.log(`[TS3AudioBot Script] 合集: ${isCollection}, 分P: ${isMultiPart}`);
                btnContainerBatch.dataset.isCollection = isCollection;
                btnContainerBatch.dataset.isMultiPart = isMultiPart;
                btnContainerBatch.style.display = 'flex';
            }
        } catch (e) {
            console.error('[TS3AudioBot Script] 检查UI时获取信息失败:', e);
            // 获取失败则不显示批量按钮
        }
    };

    // 监听B站的单页应用路由变化
    let oldHref = document.location.href;
    const body = document.querySelector("body");
    const observer = new MutationObserver(mutations => {
        if (oldHref !== document.location.href) {
            oldHref = document.location.href;
            initializeUIForPage();
        }
    });
    observer.observe(body, { childList: true, subtree: true });

    // 首次加载时执行一次
    initializeUIForPage();

})();