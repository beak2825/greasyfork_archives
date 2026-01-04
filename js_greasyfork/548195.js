// ==UserScript==
// @name        bilibili 自动网页全屏/宽屏
// @author      寻源千鹤
// @license MIT
// @namespace   nana_vao_script
// @description 自动网页全屏或宽屏（可配置）
// @version     1.35
// @include     http://www.bilibili.com/video/BV*
// @include     https://www.bilibili.com/video/BV*
// @include     https://www.bilibili.com/video/av*
// @include     http://bangumi.bilibili.com/anime/v/*
// @include     https://bangumi.bilibili.com/anime/v/*
// @include     https://www.bilibili.com/bangumi/play/*
// @include     https://www.bilibili.com/medialist/*
// @include     https://tv.cctv.com/live/*
// @include     https://www.bilibili.com/list/*
// @run-at      document-start
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// @grant       GM_registerMenuCommand
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/548195/bilibili%20%E8%87%AA%E5%8A%A8%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F%E5%AE%BD%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/548195/bilibili%20%E8%87%AA%E5%8A%A8%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F%E5%AE%BD%E5%B1%8F.meta.js
// ==/UserScript==

(function () {
    // 配置默认值
    const DEFAULT_CONFIG = {
        mode: 'fullscreen', // 'fullscreen' 或 'widescreen'
        enabled: true
    };
    
    // 获取配置，如果不存在则使用默认值
    function getConfig() {
        const config = GM_getValue('config');
        return config ? { ...DEFAULT_CONFIG, ...config } : DEFAULT_CONFIG;
    }
    
    // 保存配置
    function saveConfig(config) {
        GM_setValue('config', config);
    }
    
    // 显示配置对话框
    function showConfigDialog() {
        const currentConfig = getConfig();
        
        const html = `
            <div id="bilibili-config-dialog" style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                border: 2px solid #00a1d6;
                border-radius: 8px;
                padding: 20px;
                z-index: 999999;
                box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                font-family: Arial, sans-serif;
                min-width: 300px;
            ">
                <h3 style="margin: 0 0 15px 0; color: #00a1d6;">Bilibili 自动模式配置</h3>
                
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: bold;">模式选择：</label>
                    <select id="mode-select" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                        <option value="fullscreen" ${currentConfig.mode === 'fullscreen' ? 'selected' : ''}>自动网页全屏</option>
                        <option value="widescreen" ${currentConfig.mode === 'widescreen' ? 'selected' : ''}>自动宽屏</option>
                    </select>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <label style="display: flex; align-items: center;">
                        <input type="checkbox" id="enabled-checkbox" ${currentConfig.enabled ? 'checked' : ''} style="margin-right: 8px;">
                        启用自动模式
                    </label>
                </div>
                
                <div style="text-align: right;">
                    <button id="save-config" style="
                        background: #00a1d6;
                        color: white;
                        border: none;
                        padding: 8px 16px;
                        border-radius: 4px;
                        cursor: pointer;
                        margin-right: 10px;
                    ">保存</button>
                    <button id="cancel-config" style="
                        background: #ccc;
                        color: black;
                        border: none;
                        padding: 8px 16px;
                        border-radius: 4px;
                        cursor: pointer;
                    ">取消</button>
                </div>
            </div>
        `;
        
        // 添加遮罩层
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 999998;
        `;
        
        document.body.appendChild(overlay);
        document.body.insertAdjacentHTML('beforeend', html);
        
        // 事件处理
        document.getElementById('save-config').addEventListener('click', function() {
            const newConfig = {
                mode: document.getElementById('mode-select').value,
                enabled: document.getElementById('enabled-checkbox').checked
            };
            saveConfig(newConfig);
            closeDialog();
        });
        
        document.getElementById('cancel-config').addEventListener('click', closeDialog);
        overlay.addEventListener('click', closeDialog);
        
        function closeDialog() {
            document.getElementById('bilibili-config-dialog').remove();
            overlay.remove();
        }
    }
    
    // 注册菜单命令
    GM_registerMenuCommand('配置自动模式', showConfigDialog);
    
    // 获取之前存储的URL，用于防止重定向循环
    let url = GM_getValue('url');
    // 删除存储的URL，避免内存泄漏
    GM_deleteValue('url');
    
    // 处理番剧页面的特殊逻辑
    if (location.hostname == 'bangumi.bilibili.com') {
        // 如果当前URL与存储的URL相同，说明已经重定向过，避免无限循环
        if(url === location.href){
            return;
        }
        // 存储当前URL
        GM_setValue('url', location.href);
        // 等待DOM加载完成后执行重定向
        document.addEventListener('DOMContentLoaded', function () {
            // 停止页面加载
            window.stop();
            // 重定向到视频播放页面
            location.href = document.querySelector('.v-av-link').href;
        });
    } else {
        // 处理普通视频页面的逻辑
        try{
            // 注释掉的代码：设置本地存储项（可能用于某些功能）
            //localStorage.setItem('bilibililover', 'YESYESYES');
            //localStorage.setItem('defaulth5', '1');
        }catch(e){
            // 忽略本地存储设置错误
        }
        
        // 等待页面完全加载后执行
        window.addEventListener('load', function () {
            console.log("load success");
            // 获取页面的jQuery对象
            this.$ = unsafeWindow.jQuery;
            
            // 获取当前配置
            const config = getConfig();
            
            // 如果功能被禁用，直接返回
            if (!config.enabled) {
                console.log("Bilibili 自动模式已禁用");
                return;
            }
            
            // 根据配置模式选择要查找的元素
            let elementNames = [];
            
            if (config.mode === 'fullscreen') {
                // 网页全屏模式 - 定义需要查找的全屏按钮元素类名数组
                elementNames = [
                    "bpx-player-ctrl-web-enter",           // 新版播放器的网页全屏按钮
                    "bilibili-player-iconfont-web-fullscreen-off", // 旧版播放器的网页全屏按钮
                    "player_pagefullscreen_player",        // 另一种全屏按钮
                    "squirtle-pagefullscreen-inactive"     // 海龟播放器的全屏按钮
                ];
                console.log("启用自动网页全屏模式");
            } else if (config.mode === 'widescreen') {
                // 宽屏模式 - 定义需要查找的宽屏按钮元素类名数组
                elementNames = [
                    "bpx-player-ctrl-btn-icon bpx-player-ctrl-wide-enter", // 新版播放器的宽屏按钮
                    "bilibili-player-iconfont-wide-enter",  // 旧版播放器的宽屏按钮
                    "player_wide_player",                   // 另一种宽屏按钮
                    "squirtle-wide-inactive"                // 海龟播放器的宽屏按钮
                ];
                console.log("启用自动宽屏模式");
            }
            
            // 遍历所有可能的按钮类名，尝试点击
            for(var i = 0; i < elementNames.length; i++) {
                 waitElement(elementNames[i]);
            }
        });
    }

    /**
     * 等待元素出现并点击的函数
     * @param {string} elementName - 要查找的元素类名或ID
     */
    function waitElement(elementName) {
        // 获取页面的jQuery对象
        this.$ = unsafeWindow.jQuery;
        
        // 设置重试参数
        var _times = 20,        // 最大重试次数
            _interval = 1000,   // 重试间隔时间（毫秒）
            _self = document.getElementsByClassName(elementName)[0], // 尝试通过类名查找元素
            _iIntervalID;       // 定时器ID
        
        // 如果元素已经存在，直接点击
        if( _self != undefined){
            _self.click();
        } else {
            // 如果元素不存在，设置定时器等待元素出现
            _iIntervalID = setInterval(function() {
                // 如果重试次数用完，清除定时器
                if(!_times) {
                    clearInterval(_iIntervalID);
                }
                // 减少重试次数
                _times <= 0 || _times--;
                
                // 再次尝试通过类名查找元素
                _self = document.getElementsByClassName(elementName)[0];
                
                // 如果通过类名找不到，尝试通过ID查找
                if(_self == undefined) {
                   _self = document.getElementById(elementName);
                }
                
                // 如果找到元素，点击它并清除定时器
                if(_self != undefined){
                    _self.click();
                    clearInterval(_iIntervalID);
                }
            }, _interval);
        }
        return this;
    }
}) ();