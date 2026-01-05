// ==UserScript==
// @name         Layui & Layer 修复整合版
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  同时引入 Layui 和 独立版 Layer，并修复 CSP 和 路径问题
// @license      MIT
// @match        https://www.toutiao.com/*
// @match        *://*/*
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        unsafeWindow
// @run-at       document-end
// @require      https://unpkg.com/jquery@3.6.0/dist/jquery.min.js
// @require      https://unpkg.com/layer-src@3.5.1/dist/layer.js
// @resource     layerCSS https://unpkg.com/layer-src@3.5.1/dist/theme/default/layer.css
// @require      https://unpkg.com/layui@2.6.8/dist/layui.js
// @resource     layuiCSS https://unpkg.com/layui@2.6.8/dist/css/layui.css
// @downloadURL https://update.greasyfork.org/scripts/558890/Layui%20%20Layer%20%E4%BF%AE%E5%A4%8D%E6%95%B4%E5%90%88%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/558890/Layui%20%20Layer%20%E4%BF%AE%E5%A4%8D%E6%95%B4%E5%90%88%E7%89%88.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    /**
     * 初始化 独立版 Layer 环境
     */
    function initLayerEnv() {
        var cssContent = GM_getResourceText("layerCSS");
        if (!cssContent) return; //以此防止报错
        var cdnBaseUrl = 'https://unpkg.com/layer-src@3.5.1/dist/theme/default/';
        // 修复 icon 和 loading 图片路径
        cssContent = cssContent.replace(/url\(['"]?icon\.png['"]?\)/g, `url("${cdnBaseUrl}icon.png")`);
        cssContent = cssContent.replace(/url\(['"]?loading-([0-9])\.gif['"]?\)/g, `url("${cdnBaseUrl}loading-$1.gif")`);
        GM_addStyle(cssContent);
        return window.layer; // 返回全局 layer
    };

    /**
     * 初始化 Layui 环境 (新增函数)
     */
    function initLayuiEnv() {
        var cssContent = GM_getResourceText("layuiCSS");
        if (!cssContent) {
            console.error('Layui CSS 未找到，请检查 @resource');
            return;
        }
        // 定义 Layui 2.6.8 的 CDN 根目录
        var cdnBaseUrl = 'https://unpkg.com/layui@2.6.8/dist/';
        // --- 核心修复：Layui 的字体图标 ---
        // Layui CSS 引用字体通常是 url(../font/iconfont.woff)
        // 我们将其替换为 url(https://.../font/iconfont.woff)
        cssContent = cssContent.replace(/\.\.\/font\//g, `${cdnBaseUrl}font/`);
        // 部分组件可能引用图片 (../images/)
        cssContent = cssContent.replace(/\.\.\/images\//g, `${cdnBaseUrl}images/`);
        GM_addStyle(cssContent);
        console.log('Layui CSS 及其字体路径已修复');
    };

    // --- 执行初始化 ---
    // 1. 等待 Layer 独立版修复完成
    await initLayerEnv();
    // 2. 等待 Layui 修复完成
    await initLayuiEnv();

    // 打印版本号
    console.log('Layui Version:', layui.v);
    console.log('Standalone Layer Version:', layer.v);

    // --- 测试与业务逻辑 ---
    if (location.host.includes('toutiao.com')) {
        // 测试 1: 使用独立版 Layer 弹窗
        layer.msg('独立版 Layer 正常！', { icon: 1, time: 2000 });
        // 向页面插入一个固定定位的测试框  测试图标
        $('body').append(`
        <div style="position: fixed; top: 150px; left: 20px; z-index: 999999; background: white; padding: 20px; border: 2px solid red; box-shadow: 0 0 10px rgba(0,0,0,0.3);">
            <h3>Layui 字体路径测试</h3>
            <hr>

            <!-- 测试 1：点赞图标 -->
            <button class="layui-btn layui-btn-danger">
                <i class="layui-icon layui-icon-praise"></i> 点赞 (layui-icon-praise)
            </button>

            <br><br>

            <!-- 测试 2：设置图标 -->
            <i class="layui-icon layui-icon-set-fill" style="font-size: 30px; color: #1E9FFF;"></i>
            <span>设置图标 (layui-icon-set-fill)</span>
        </div>`);

        // 测试 2: 使用 Layui 的组件 (例如 Layui 自己的 layer 或 按钮)
        // 注意：layui.use 是异步的
        layui.use(['layer', 'form'], function () {
            var layuiLayer = layui.layer;

            // 延时一下以免和上面的弹窗重叠
            setTimeout(function () {
                layuiLayer.msg('Layui 加载成功！', { icon: 6, time: 2000 });
            }, 2500);

        });
    }

})();