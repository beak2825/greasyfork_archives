// ==UserScript==
// @name         知乎摸鱼版
// @namespace    http://tampermonkey.net/
// @version      1.05
// @icon         https://static.zhihu.com/heifetz/assets/apple-touch-icon-152.81060cab.png
// @description  图形设置：隐藏标题｜图片马赛克｜去侧边｜伪装标题｜官方暗黑模式一键切换
// @author       Jay628
// @match        https://www.zhihu.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554161/%E7%9F%A5%E4%B9%8E%E6%91%B8%E9%B1%BC%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/554161/%E7%9F%A5%E4%B9%8E%E6%91%B8%E9%B1%BC%E7%89%88.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* ==================== 1. 默认配置 ==================== */
    const DEFAULT = {
        hideHeader: true,      // 滚动隐藏问题标题栏
        imgMosaic : true,      // 图片马赛克
        hideSide  : true,      // 隐藏右侧边栏
        fakeTitle : true,      // 伪装标题
        titleText : 'Excel 在线文档 - 只读',
        darkMode  : false      // 官方暗黑模式
    };

    /* ==================== 2. 配置读写 ==================== */
    function getConf(key) { return GM_getValue(key, DEFAULT[key]); }
    function setConf(key, val) { GM_setValue(key, val); }

    /* ==================== 3. 官方主题切换（首次进入/手动切换） ==================== */
    (function ensureTheme(){
        const wantDark = getConf('darkMode');
        if (location.search.includes(`theme=${wantDark?'dark':'light'}`)) return; // 已是指定主题
        const url = new URL(location.href);
        url.searchParams.set('theme', wantDark?'dark':'light');
        location.replace(url);      // 整页跳转，让知乎真正加载主题样式
    })();

    /* ==================== 4. 图形设置面板 ==================== */
    function openSettingPanel() {
        const box = document.createElement('div');
        box.innerHTML = `
        <style>
#zh-fish-config{position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:9999;display:flex;align-items:center;justify-content:center;}
#zh-fish-config .panel{
    width:360px;
    border-radius:8px;
    padding:24px 28px;
    font-size:15px;
    line-height:1.8;
    box-shadow:0 8px 30px rgba(0,0,0,.25);
    background:#fff !important;          /* 强制白底 */
    color:#222 !important;               /* 默认黑字 */
}
#zh-fish-config h3{margin:0 0 16px;font-size:18px;}
#zh-fish-config .row{display:flex;align-items:center;justify-content:space-between;margin:10px 0;}
#zh-fish-config input[type=text]{width:100%;padding:6px 8px;border:1px solid #bbb;border-radius:4px;}
#zh-fish-config .buttons{display:flex;gap:12px;margin-top:20px;}
#zh-fish-config button{flex:1;padding:8px 0;border:none;border-radius:4px;cursor:pointer;font-size:15px;}
/* 伪装标题输入框：永远白底黑字 */
#zh-fish-config input#titleText {
    background: #fff !important;
    color: #000 !important;
    border-color: #bbb !important;
}

/* 保存按钮：蓝底白字 */
#zh-fish-config .save{background:#0066ff !important;color:#fff !important;}

/* 取消按钮：白底黑字 */
#zh-fish-config .cancel{background:#f0f0f0 !important;color:#333 !important;}

/* 暗黑页只改字色，不改背景 */
body[data-theme="dark"] #zh-fish-config .panel,
body.ZHiDark #zh-fish-config .panel{color:#eee !important;}
body[data-theme="dark"] #zh-fish-config input[type=text],
body.ZHiDark #zh-fish-config input[type=text]{color:#eee !important;}
</style>
        <div id="zh-fish-config"><div class="panel"><h3>知乎摸鱼脚本设置</h3>
        <div class="row"><label>滚动时隐藏问题标题栏</label><input type="checkbox" id="hideHeader" ${getConf('hideHeader')?'checked':''}></div>
        <div class="row"><label>图片先显示马赛克（点击后显示）</label><input type="checkbox" id="imgMosaic" ${getConf('imgMosaic')?'checked':''}></div>
        <div class="row"><label>隐藏右侧边栏（相关问题等）</label><input type="checkbox" id="hideSide" ${getConf('hideSide')?'checked':''}></div>
        <div class="row"><label>伪装页面标题（防摸鱼）</label><input type="checkbox" id="fakeTitle" ${getConf('fakeTitle')?'checked':''}></div>
        <div class="row"><label>开启官方暗黑模式</label><input type="checkbox" id="darkMode" ${getConf('darkMode')?'checked':''}></div>
        <div class="row"><label>伪装标题文字</label><input type="text" id="titleText" value="${getConf('titleText').replace(/"/g,'&quot;')}"></div>
        <div class="buttons"><button class="save">保存并刷新</button><button class="cancel">取消</button></div></div></div>`;
        document.body.appendChild(box);
        box.querySelector('.save').onclick = () => {
            ['hideHeader','imgMosaic','hideSide','fakeTitle','darkMode'].forEach(k=> setConf(k,box.querySelector('#'+k).checked));
            setConf('titleText',box.querySelector('#titleText').value.trim()||DEFAULT.titleText);
            box.remove(); location.reload();
        };
        box.querySelector('.cancel').onclick = () => box.remove();
    }
    GM_registerMenuCommand('⚙️ 摸鱼脚本设置', openSettingPanel);
    if (!GM_getValue('_inited',false)) { GM_setValue('_inited',true); openSettingPanel(); }

    /* ==================== 5. 功能实现 ==================== */
    const isQuestionPage = /^\/question\/\d+/.test(location.pathname);

    /* ① 滚动隐藏标题栏（仅问题页） */
    if (getConf('hideHeader') && isQuestionPage) {
        let lastScrollTop = 0;
        const headerSelector = '.QuestionHeader-main';
        function handleScroll() {
            const st = window.pageYOffset || document.documentElement.scrollTop;
            const header = document.querySelector(headerSelector);
            if (!header) return;
            if (st > lastScrollTop && st > 100) {
                header.style.transition = 'opacity 0.3s';
                header.style.opacity = '0';
                header.style.pointerEvents = 'none';
            } else {
                header.style.opacity = '1';
                header.style.pointerEvents = 'auto';
            }
            lastScrollTop = st <= 0 ? 0 : st;
        }
        window.addEventListener('scroll', handleScroll);
    }

    /* ② 图片马赛克（仅问题页） */
    if (getConf('imgMosaic') && isQuestionPage) {
        const STYLE_ID = 'zh-mosaic-style';
        const MOSAIC_CLASS = 'zh-mosaic-cover';
        function addMosaicStyles() {
            if (document.getElementById(STYLE_ID)) return;
            const style = document.createElement('style');
            style.id = STYLE_ID;
            style.textContent = `
                .${MOSAIC_CLASS}{position:relative;display:inline-block;}
                .${MOSAIC_CLASS}::before{content:'';position:absolute;inset:0;background:rgba(0,0,0,.35);backdrop-filter:blur(12px) grayscale(80%);z-index:1;cursor:pointer;}
                .${MOSAIC_CLASS}.revealed::before{display:none;}
            `;
            document.head.appendChild(style);
        }
        function applyMosaic(img) {
            if (img.dataset.mosaicApplied) return;
            img.dataset.mosaicApplied = '1';
            const par = img.parentElement;
            if (getComputedStyle(par).position === 'static') par.style.position = 'relative';
            par.classList.add(MOSAIC_CLASS);
            par.addEventListener('click', () => par.classList.add('revealed'), { once: true });
        }
        function processImages() {
            document.querySelectorAll('.RichContent-inner img, .QuestionAnswer-content img').forEach(img => {
                if (img.closest('video, [class*="Video"], [class*="video"], [class*="Player"], [class*="player"], [data-video], [data-zop-video], [class*="VideoPreview"], [class*="video-preview"], ._1fog6rx, ._1n8yr2n, ._w3ddjq, .css-bp306l')) return;
                applyMosaic(img);
            });
        }
        addMosaicStyles(); processImages();
        new MutationObserver(() => processImages()).observe(document.body, { childList: true, subtree: true });
    }

    /* ③ 隐藏右侧边栏（全站） */
    if (getConf('hideSide')) {
        const style = document.createElement('style');
        style.textContent = `
        .Question-sideColumn, .Card.QuestionHeader-actions, .Card.QuestionHeader-side, .Card.Question-sideColumn--light,
        [data-za-detail-view-path-module="RightSideBar"], .GlobalSideBar, .QuestionPage-sideBar { display:none !important; }
        `;
        document.head.appendChild(style);
    }

    /* ④ 伪装标题（全站） */
    if (getConf('fakeTitle')) {
        const fake = getConf('titleText');
        document.title = fake;
        new MutationObserver(() => { if (document.title !== fake) document.title = fake; })
            .observe(document.querySelector('title'), { childList: true, characterData: true, subtree: true });
        const originalPushState = history.pushState;
        history.pushState = function (...args) { originalPushState.apply(this, args); document.title = fake; };
    }
    /* ⑥ 每日自动随机伪装标题 */
(function dailyRandomTitle() {
    // 无害短语库，可继续追加
    const POOL = [
        'Excel 在线文档 - 只读',
        '工作台 - 待办事项',
        '邮件草稿箱 - Outlook',
        '会议纪要 - 模板',
        '数据透视表练习',
        '周报 - 第 21 周',
        '费用报销单',
        '培训资料 - 2025',
        '项目进度表 - 内部',
        '考勤异常说明',
        'VPN 使用指南',
        '入职手续清单',
        '离职交接表',
        '资产领用单',
        '印章申请流程',
        '预算表 - v3',
        '采购需求汇总',
        '客户信息更新',
        '合同审批单',
        '发票抬头维护',
        'OKR 复盘表',
        'KPI 指标说明',
        'SOP 标准文档',
        '内部知识库',
        '系统操作手册',
        '测试用例 - 登录模块',
        '需求文档 - PRD',
        '版本发布记录',
        'BUG 列表 - 本周',
        '代码 Review 记录',
        '接口文档 - Swagger',
        '数据库变更记录',
        '服务器巡检报告',
        '安全漏洞扫描报告',
        '运维值班表',
        '上线 checklist',
        '回滚方案 - 模板',
        '灾备演练报告',
        '带宽申请单',
        'SSL 证书续费',
        '域名备案资料',
        '云资源申请',
        'CDN 配置说明',
        'Docker 镜像清单',
        'Jenkins 构建日志',
        'Git 提交规范',
        'Sonar 扫描报告',
        '单元测试覆盖率',
        '性能压测报告',
        '埋点需求文档',
        'A/B 测试方案',
        '用户调研问卷',
        '竞品分析报告',
        'PRD 评审记录',
        'UI 走查意见',
        '设计规范 - V1.2',
        '图标库更新',
        '字体授权说明',
        '配色方案 - 2025',
        '原型图 - 登录页',
        '交互说明文档',
        '需求变更记录',
        '版本管理规范',
        'API 限流策略',
        '缓存更新方案',
        '数据库优化记录',
        '日志清理策略',
        '监控告警配置',
        '值班电话表 - 2025'
    ];

    const KEY_MANUAL = 'titleManual'; // 用户是否手动改过
    const KEY_DATE   = 'titleDate';   // 最后一次随机日期

    function isToday(ds) { return ds === new Date().toISOString().slice(0, 10); }
    function randomItem(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

    // 1. 如果用户手动输入过标题 → 不再自动随机
    if (GM_getValue(KEY_MANUAL, false)) return;

    // 2. 如果今天已随机过 → 直接用它
    const lastDate = GM_getValue(KEY_DATE, '');
    if (isToday(lastDate)) {
        const todayTitle = GM_getValue('titleText', '');
        if (todayTitle) { DEFAULT.titleText = todayTitle; return; }
    }

    // 3. 否则随机一条并写入配置
    const newTitle = randomItem(POOL);
    GM_setValue('titleText', newTitle);
    GM_setValue(KEY_DATE, new Date().toISOString().slice(0, 10));

    // 4. 立即生效（当前页）
    if (getConf('fakeTitle')) document.title = newTitle;
})();

/* 监听用户“手动输入” → 停止自动随机 */
const _origSetTitle = setConf;
setConf = function (key, val) {
    if (key === 'titleText' && val && typeof val === 'string' && val.trim() !== '') {
        GM_setValue('titleManual', true);   // 标记为手动
        GM_setValue(KEY_DATE, '');          // 清空日期，方便以后想恢复随机
    }
    _origSetTitle.apply(this, arguments);
};
})();