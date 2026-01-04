// ==UserScript==
// @name         zjooc在浙学刷课-2.0
// @namespace    GAEE_Fixed_Spenerc_v2.0
// @version      5.4.0
// @description  将启动延时调整为6秒，确保网页完全加载后再运行，解决刷新后脚本不启动或报错的问题
// @match        https://www.zjooc.cn/*
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561387/zjooc%E5%9C%A8%E6%B5%99%E5%AD%A6%E5%88%B7%E8%AF%BE-20.user.js
// @updateURL https://update.greasyfork.org/scripts/561387/zjooc%E5%9C%A8%E6%B5%99%E5%AD%A6%E5%88%B7%E8%AF%BE-20.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ================= 配置区域 =================
    // 【修改点】：将启动时间从 3000 改为 6000 (6秒)
    // 这样能确保浏览器刷新完界面后，还有充足的缓冲时间
    var startTime = 6000;

    var IntervalTime = 2000; // 监测频率 (2秒检测一次)
    var Video_muted = true;  // 静音
    var Video_speed = 4;     // 默认倍速

    // ================= 全局变量 =================
    const urls = {'course':'https://www.zjooc.cn/ucenter/student/course/study/[A-Za-z0-9]+/plan/detail/[A-Za-z0-9]+'};
    var ListStudy_main = [];
    var ListStudy_view = [];
    var ListStudy_main_now;
    var ListStudy_view_now;
    var Interval;
    var LN = 0;
    var MN = 0;

    // UI 变量
    var logContainer = null;

    // === 检测状态变量 ===
    var MonitorState = {
        lastTime: -1,         // 上一次检测的视频时间
        stuckCount: 0,        // 卡顿计数器
        videoStartTime: 0     // 当前视频开始刷的时间戳
    };

    // ================= 核心：防暂停/后台播放模块 =================
    function enableBackgroundPlay() {
        try {
            Object.defineProperty(document, 'hidden', { value: false, writable: false });
            Object.defineProperty(document, 'visibilityState', { value: 'visible', writable: false });
            Object.defineProperty(document, 'webkitVisibilityState', { value: 'visible', writable: false });
        } catch (e) { console.log('Visibility API 劫持失败'); }

        var eventsToBlock = ['visibilitychange', 'webkitvisibilitychange', 'mozvisibilitychange', 'hasFocus', 'blur', 'focus', 'mouseleave', 'mouseout'];
        eventsToBlock.forEach(function(event) {
            window.addEventListener(event, function(e) {
                e.stopImmediatePropagation();
                e.stopPropagation();
            }, true);
        });
    }

    // ================= UI 界面模块 =================
    const cssStyles = `
        #zjooc-ui {
            font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
            position: fixed; top: 100px; right: 30px; width: 320px;
            background: #fff; border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,0.15);
            border: 1px solid #ebeef5; z-index: 999999; font-size: 14px; color: #606266;
            transition: opacity 0.3s;
        }
        #zjooc-head {
            padding: 12px 15px; border-bottom: 1px solid #ebeef5;
            background: #f5f7fa; border-radius: 8px 8px 0 0;
            display: flex; justify-content: space-between; align-items: center;
            cursor: move; user-select: none; font-weight: bold; color: #409eff;
        }
        .z-row { padding: 10px 15px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed #eee; }
        .z-btn-group { padding: 10px 15px; display: flex; justify-content: space-between; gap: 10px; }
        .z-btn {
            flex: 1; padding: 6px 0; text-align: center; border-radius: 4px; cursor: pointer;
            font-size: 12px; transition: 0.2s; border: 1px solid #dcdfe6; background: #fff;
        }
        .z-btn:hover { color: #409eff; border-color: #c6e2ff; background-color: #ecf5ff; }
        .z-btn.danger:hover { color: #f56c6c; border-color: #fde2e2; background-color: #fef0f0; }
        #zjooc-logs {
            height: 160px; overflow-y: auto; background: #282c34; color: #abb2bf;
            padding: 10px; font-family: Consolas, monospace; font-size: 12px;
            border-radius: 0 0 8px 8px; line-height: 1.5;
        }
        #zjooc-logs::-webkit-scrollbar { width: 6px; }
        #zjooc-logs::-webkit-scrollbar-thumb { background: #4b5263; border-radius: 3px; }
        input[type=range] { width: 100px; }
    `;

    function initUI() {
        if (document.getElementById('zjooc-ui')) return;
        const style = document.createElement('style'); style.innerHTML = cssStyles; document.head.appendChild(style);

        const div = document.createElement('div');
        div.id = 'zjooc-ui';
        div.innerHTML = `
            <div id="zjooc-head">
                <span> 在浙学刷课课课课课课 Pro v5.4</span>
                <span style="font-size:12px;color:#909399;cursor:pointer;" id="z-min">➖</span>
            </div>
            <div id="z-body">
                <div class="z-row">
                    <span>⚡ 播放倍速</span>
                    <div style="display:flex;align-items:center;">
                        <span id="speed-val" style="color:#f56c6c;font-weight:bold;margin-right:8px;">${Video_speed}x</span>
                        <input type="range" id="speed-range" min="1" max="16" step="0.5" value="${Video_speed}">
                    </div>
                </div>
                <div class="z-btn-group">
                    <button class="z-btn" id="btn-skip">⏭ 跳过当前</button>
                    <button class="z-btn danger" id="btn-reset">🔄 重置脚本</button>
                </div>
                <div id="zjooc-logs">
                    <div>✅ 等待网页视频加载 6秒（失败需要手动刷新，一般性能电脑没问题）</div>
                    <div>🛡️ 等待网页以及相关设置完全加载...</div>
                </div>
            </div>
        `;
        document.body.appendChild(div);

        logContainer = document.getElementById('zjooc-logs');

        document.getElementById('speed-range').oninput = function(e) {
            Video_speed = parseFloat(this.value);
            document.getElementById('speed-val').innerText = Video_speed + 'x';
            var video = document.querySelector('video');
            if(video) video.playbackRate = Video_speed;
            LOG(`倍速调整为: ${Video_speed}x`);
        };

        document.getElementById('btn-skip').onclick = function() {
            LOG("👉 人工干预：跳过当前小节");
            if (Interval) unsafeWindow.clearInterval(Interval);
            NEXT_VIEW();
        };

        document.getElementById('btn-reset').onclick = function() {
            LOG("🔄 正在重新获取目录...");
            MN = 0; LN = 0;
            GET_MAIN_LIST();
            GET_VIEW_LIST();
            ListStudy_main_now.click();
            LOG("重置完成");
        };

        var isMin = false;
        document.getElementById('z-min').onclick = function() {
            isMin = !isMin;
            document.getElementById('z-body').style.display = isMin ? 'none' : 'block';
            this.innerText = isMin ? '➕' : '➖';
        };

        var drag = document.getElementById('zjooc-head');
        var panel = document.getElementById('zjooc-ui');
        var isDown = false, x = 0, y = 0, l = 0, t = 0;
        drag.onmousedown = function(e) {
            x = e.clientX; y = e.clientY; l = panel.offsetLeft; t = panel.offsetTop; isDown = true;
            drag.style.cursor = 'grabbing';
        }
        window.onmousemove = function(e) {
            if (!isDown) return;
            var nx = e.clientX, ny = e.clientY;
            panel.style.left = l + (nx - x) + 'px';
            panel.style.top = t + (ny - y) + 'px';
            panel.style.right = 'auto';
        }
        window.onmouseup = function() { isDown = false; drag.style.cursor = 'move'; }
    }

    function LOG(info) {
        console.log(info);
        if (logContainer) {
            var time = new Date().toLocaleTimeString('zh-CN', { hour12: false });
            var div = document.createElement('div');
            if (typeof info === 'object') info = JSON.stringify(info);
            div.innerHTML = `<span style="color:#5c6370">[${time}]</span> ${info}`;
            logContainer.appendChild(div);
            logContainer.scrollTop = logContainer.scrollHeight;
        }
    }

    // ================= 原版逻辑 =================

    var url = unsafeWindow.location.href;
    var href = new RegExp(urls.course);

    enableBackgroundPlay();
    initUI();

    if(href.test(url)){
        unsafeWindow.setTimeout(function(){
            LOG("=========== 开始执行脚本 =========");
            for(var i=0;i<document.querySelectorAll('.el-submenu__title').length;i++){
                if(i>0) document.querySelectorAll('.el-submenu__title')[i].click();
            }

            GET_MAIN_LIST();
            LOG("------------");
            GET_VIEW_LIST();
            LOG("------------");

            if(ListStudy_main.length == 0){
                LOG("未检测到章节，可能需要刷新");
            }else{
                ListStudy_main_now.click();
                if(ListStudy_view.length == 0){
                    LOG("当前大章无内容，已完成");
                    NEXT_MAIN();
                }else{
                    ListStudy_view_now.click();
                    unsafeWindow.setTimeout(AUTO_COURSE, startTime);
                }
            }
        }, startTime); // 这里使用了新的 6000ms 延迟
    }

    function AUTO_COURSE(){
        if(Interval){
            unsafeWindow.clearInterval(Interval);
        }
        LOG("============= 开始刷课 ===========");
        if(ListStudy_view_now) LOG("当前课时: "+ListStudy_view_now.innerText);

        // 重置检测状态
        MonitorState.stuckCount = 0;
        MonitorState.lastTime = -1;
        MonitorState.videoStartTime = Date.now(); // 记录开始时间

        if(document.querySelector('iframe')){
            LOG("类型【文档/PPT】");
            var document_ok = document.querySelector('.contain-bottom').querySelectorAll('button.el-button.el-button--default');
            LOG("找到按钮数: " + document_ok.length);
            if(document_ok){
                for(var i=0;i<document_ok.length;i++) document_ok[i].click();
                LOG("正在执行文档点击");
            }
            LOG("============= 结束刷课 ===========");
            unsafeWindow.setTimeout(NEXT_VIEW, 3000);
        }else{
            LOG("类型【视频】");
            var video = document.querySelector('video');
            if(video){
                video.autoplay = "autoplay";
                video.muted = Video_muted;
                video.playbackRate = Video_speed;
                var p = document.querySelector('video');
                if(p) p.click();

                Interval = unsafeWindow.setInterval(VIDEO_OK, IntervalTime);
            } else {
                LOG("未找到Video标签，尝试下一节");
                NEXT_VIEW();
            }
        }
    }

    // 核心检测逻辑 (集成所有防护)
    function VIDEO_OK(){
        try{
            var video = document.querySelector('video');
            if (!video) return;

            // === 0. [新增] 10秒安全缓冲期 ===
            // 刚开始刷的前10秒，无论状态如何，都绝对不判定为结束
            if (Date.now() - MonitorState.videoStartTime < 10000) {
                if (video.paused) video.play();
                if(video.playbackRate != Video_speed) video.playbackRate = Video_speed;
                if(video.muted != true) video.muted = true;
                return;
            }

            // 1. 强制播放
            if (video.paused && !video.ended) {
                video.play();
            }

            // 2. 维持设置
            if(video.playbackRate != Video_speed) video.playbackRate = Video_speed;
            if(video.muted != true) video.muted = true;

            // === 3. 超时检测 (20分钟) ===
            if (Date.now() - MonitorState.videoStartTime > 1200000) {
                LOG("⚠️ 警告：当前视频耗时超过20分钟");
                LOG("🔄 正在强制跳过到下一节...");
                if (Interval) unsafeWindow.clearInterval(Interval);
                NEXT_VIEW();
                return;
            }

            // === 4. 卡顿检测 (刷新网页) ===
            if (Math.abs(video.currentTime - MonitorState.lastTime) < 0.1) {
                MonitorState.stuckCount++;
            } else {
                MonitorState.stuckCount = 0;
                MonitorState.lastTime = video.currentTime;
            }

            if (MonitorState.stuckCount >= 3) {
                LOG("⚠️ 检测到视频卡住超过5秒，执行刷新！");
                if (Interval) unsafeWindow.clearInterval(Interval);
                location.reload();
                return;
            }

            // 5. 进度检测
            var now, end;
            try {
                if (isNaN(video.duration) || video.duration < 1) {
                    return;
                }

                var bar = video.parentNode.children[2];
                var processBar = bar.children[7];
                var times = processBar.innerText.split('/');
                now = times[0].trim();
                end = times[1].trim();
            } catch(domErr) {
                if (video.ended) { now = 1; end = 1; }
                else { now = 0; end = 1; }
            }

            if(now == end || video.ended){
                if(Interval){
                    unsafeWindow.clearInterval(Interval);
                }
                LOG("============= 结束刷课 ===========");
                unsafeWindow.setTimeout(NEXT_VIEW, startTime);
            }
        } catch(err) {
            LOG("[ERROR] "+err);
            if(Interval){
                unsafeWindow.clearInterval(Interval);
            }
            unsafeWindow.setTimeout(NEXT_VIEW, startTime);
        }
    }

    function NEXT_MAIN(){
        MN += 1;
        if(MN >= ListStudy_main.length){
            LOG("全部完成");
            alert("🎉 本课程学习完毕");
        }else{
            ListStudy_main_now = ListStudy_main[MN];
            ListStudy_main_now.click();
            LOG("正在切换下一章节: " + ListStudy_main_now.innerText);
            unsafeWindow.setTimeout(function(){
                GET_VIEW_LIST();
                if(ListStudy_view.length == 0){
                    LOG("当前大章已完成");
                    NEXT_MAIN();
                }else{
                    ListStudy_view_now.click();
                    unsafeWindow.setTimeout(function(){AUTO_COURSE()}, startTime);
                }
            }, startTime);
        }
    }

    function NEXT_VIEW(){
        LN += 1;
        if(LN >= ListStudy_view.length){
            LOG("当前小节已完成，进入下一章");
            NEXT_MAIN();
        }else{
            ListStudy_view_now = ListStudy_view[LN];
            ListStudy_view_now.click();
            unsafeWindow.setTimeout(AUTO_COURSE, startTime);
        }
    }

    function GET_MAIN_LIST(){
        ListStudy_main = [];
        MN = 0;
        LOG("[正在获取章节列表...]");

        var main_list = document.querySelector('.base-asider ul[role="menubar"]');
        if(!main_list) return;

        for(var a=0; a<main_list.childElementCount; a++){
            var item = main_list.children[a];
            if(item.children.length > 1 && item.children[1].tagName == 'UL'){
                var sec_list = item.children[1];
                for(var b=0; b<sec_list.childElementCount; b++){
                    var _e = sec_list.children[b];
                    LOG("发现章节: " + _e.innerText);
                    ListStudy_main.push(_e);
                }
            } else {
                LOG("发现章节: " + item.innerText);
                ListStudy_main.push(item);
            }
        }

        if(ListStudy_main.length > 0) {
            ListStudy_main_now = ListStudy_main[0];
            ListStudy_main_now.click();
        }
    }

    function GET_VIEW_LIST(){
        ListStudy_view = [];
        LN = 0;
        LOG("[正在获取视频列表...]");

        var list = document.querySelector('.plan-detailvideo div[role="tablist"]');
        if(!list) return;

        for(var i=0; i<list.childElementCount; i++){
            var e = list.children[i];
            if(e.querySelector('i') && e.querySelector('i').classList.contains('complete'))
            {
                // 跳过已完成
            }else{
                LOG("待刷小节: " + e.innerText);
                ListStudy_view.push(e);
            }
        }

        if(ListStudy_view.length > 0) {
            ListStudy_view_now = ListStudy_view[0];
        }
    }

})();