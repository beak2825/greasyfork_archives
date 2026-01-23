// ==UserScript==
// @name         小红书无图显示
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  1. 标签栏伪装为工作分类(双行显示)；2. 详情页"标记"按钮+隐藏头像；3. 标题伪装；4. 自动图文；5. 隐藏Logo/去留白
// @author       吉米乃
// @match        https://www.xiaohongshu.com/*
// @icon         https://res-1.cdn.office.net/files/fabric-cdn-prod_20221209.001/assets/brand-icons/product/svg/excel_48x1.svg
// @license      MIT
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/563336/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E6%97%A0%E5%9B%BE%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/563336/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E6%97%A0%E5%9B%BE%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const config = {
        isListMode: GM_getValue('isListMode', true),
        noImageMode: GM_getValue('noImageMode', true)
    };

    // --- 配置区：伪装文案库 ---

    // 1. 列表标题伪装库 (随机抽取)
    const fakeTitles = [
        "2026年度Q1部门财务预算核查单",
        "关于加强供应链合规管理的会议纪要",
        "金发铝材采购项目成本分析报告",
        "华东区大客户销售数据季度汇总",
        "企业数字化转型战略规划草案V3.0",
        "人力资源部年度绩效考核指标拆解",
        "固定资产盘点与折旧明细表(2月)",
        "技术研发中心服务器扩容申请流程",
        "市场部竞品分析与投放策略复盘",
        "集团内部审计风险控制整改通知",
        "总经理办公室行政费用报销规范",
        "各部门Q2OKR目标设定与确认",
        "供应商资质审核与入库管理办法",
        "CRM系统客户满意度调查数据清洗",
        "2026年项目申报进度追踪表",
        "物流仓储成本优化与库存周转分析"
    ];

    // 2. 标签栏映射库 (精准替换)
    const tabMap = {
        "推荐": "年度汇总",
        "穿搭": "供应商名录",
        "美食": "后勤餐饮",
        "彩妆": "办公用品",
        "影视": "培训课件",
        "职场": "部门规章",
        "情感": "合作协议",
        "家居": "装修工程",
        "游戏": "系统测试",
        "旅行": "差旅报销",
        "健身": "工会福利",
        "母婴": "生育津贴",
        "宠物": "安保巡查",
        "科技": "IT运维",
        "汽车": "公车管理",
        "摄影": "档案扫描",
        "学习": "技能考核",
        "文教": "党建材料",
        "手作": "物料加工",
        "绘画": "设计草图",
        "音乐": "广播通知"
    };

    const injectStyles = () => {
        const css = `
            /* --- 1. 界面深度净化 (Logo & 底部) --- */
            .header-container .header-logo,
            #link-guide,
            img.header-logo,
            .header-container .logo-box,
            a[href*="explore"] .logo-img,
            a[href*="/"] .logo-img {
                display: none !important;
                width: 0 !important;
                height: 0 !important;
                opacity: 0 !important;
                visibility: hidden !important;
                pointer-events: none !important;
            }
            .footer, #footer, .info-container, .bottom-container { display: none !important; }
            #exploreFeeds, .feeds-container, .feeds-page, #mfContainer, .main-container, #app {
                height: auto !important;
                min-height: 0 !important;
                padding-bottom: 0 !important;
                margin-bottom: 0 !important;
            }
            body.xhs-list-mode {
                min-height: 0 !important;
                height: auto !important;
                overflow-y: auto !important;
            }

            /* --- 2. 列表模式核心重构 --- */
            body.xhs-list-mode .feeds-container {
                display: block !important;
                max-width: 800px !important;
                margin: 0 auto !important;
                padding-bottom: 40px !important;
            }
            body.xhs-list-mode .note-item {
                position: static !important;
                width: 100% !important;
                transform: none !important;
                margin-bottom: 15px !important;
                border-bottom: 1px solid #eee;
                padding-bottom: 15px !important;
            }
            body.xhs-list-mode .note-item .inner {
                display: flex !important;
                flex-direction: row !important;
                height: 120px !important;
                background: #fff;
                padding: 10px 15px !important;
            }
            body.xhs-list-mode .note-item .cover {
                width: 120px !important;
                height: 100% !important;
                flex-shrink: 0;
                border-radius: 4px;
                object-fit: cover;
                background: #f8f8f8;
            }
            body.xhs-no-image.xhs-list-mode .note-item .cover { display: none !important; }
            body.xhs-list-mode .note-item .footer {
                flex: 1;
                padding: 0 0 0 20px !important;
                display: flex !important;
                flex-direction: column !important;
                justify-content: space-between !important;
            }

            /* --- 3. 标题与文字样式调整 --- */
            body.xhs-list-mode .title {
                font-size: 16px !important;
                font-weight: bold !important;
                color: #222 !important;
                margin-bottom: 5px !important;
                line-height: 1.4 !important;
                white-space: nowrap !important;
                overflow: hidden !important;
                text-overflow: ellipsis !important;
            }
            body.xhs-list-mode .note-item .footer .author-wrapper {
                display: flex !important;
                align-items: center;
                justify-content: space-between;
                width: 100%;
            }
            body.xhs-list-mode .note-item .footer .author-wrapper .author-avatar { display: none !important; }
            body.xhs-list-mode .note-item .footer .author-wrapper .name {
                font-size: 13px !important;
                color: #666 !important;
                flex: 1;
                margin-right: 10px !important;
                display: -webkit-box !important;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2 !important;
                white-space: normal !important;
                overflow: hidden;
                line-height: 1.3 !important;
            }
            body.xhs-list-mode .note-item .footer .author-wrapper .interact-container {
                 display: flex !important;
                 align-items: center;
                 font-size: 12px !important;
                 color: #999 !important;
                 flex-shrink: 0;
            }

            /* --- 4. 详情页伪装 --- */
            .note-container .author-wrapper .avatar,
            .note-container .author-wrapper img,
            .note-container .author-wrapper .author-avatar {
                display: none !important;
            }
            /* 关注按钮改造为“标记” */
            .note-detail-follow-btn .reds-button-new {
                background: #fff !important;
                background-color: #fff !important;
                color: #333 !important;
                border: 1px solid #ccc !important;
                font-size: 0 !important;
                width: auto !important;
                min-width: 60px !important;
                height: 32px !important;
                padding: 0 10px !important;
                box-shadow: none !important;
            }
            .note-detail-follow-btn .reds-button-new::before {
                content: "标记";
                font-size: 14px !important;
                visibility: visible !important;
                display: block;
                font-weight: normal !important;
                text-align: center;
            }
            .note-detail-follow-btn .reds-button-new span {
                display: none !important;
            }

            /* --- 5. 标签栏(Tab) 伪装 - 核心新增 --- */

            /* 调整父容器高度以容纳双行文字 */
            .channel-container,
            .channel-scroll-container,
            #channel-container {
                height: auto !important;
                min-height: 50px !important;
                align-items: flex-start !important; /* 顶部对齐 */
                padding-top: 5px !important;
            }

            /* 改造单个标签样式 */
            .channel {
                display: flex !important;
                flex-direction: column !important; /* 垂直排列 */
                justify-content: center !important;
                align-items: center !important;
                line-height: 1.2 !important;
                height: auto !important;
                padding: 6px 16px !important;
                background: transparent !important;
            }

            /* 伪装后的主标题（工作术语） */
            .fake-tab-title {
                font-size: 15px !important;
                font-weight: 500 !important;
                color: #333 !important;
            }

            /* 激活状态的主标题 */
            .active .fake-tab-title {
                font-weight: bold !important;
                color: #1a73e8 !important; /* 类似Excel选中色/OA选中色 */
            }

            /* 真实副标题（原标签名） */
            .real-tab-title {
                font-size: 10px !important; /* 极小字 */
                color: #999 !important;
                margin-top: 2px !important;
                transform: scale(0.9);
            }

            /* --- 6. 辅助功能 --- */
            .xhs-img-mask {
                position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                background: #fafafa; display: flex; align-items: center; justify-content: center;
                cursor: pointer; z-index: 10; border: 1px dashed #ddd; color: #888; font-size: 12px;
            }
            .xhs-img-hidden { visibility: hidden !important; }
            .comment-item .avatar, .reply-item .avatar { display: none !important; }
            .comment-item .comment-picture { display: block !important; max-width: 200px; }

            #xhs-ctrl-panel {
                position: fixed; bottom: 40px; right: -150px; width: 150px;
                z-index: 10000; background: #fff; padding: 10px;
                border-radius: 8px 0 0 8px;
                box-shadow: -2px 4px 12px rgba(0,0,0,0.1); border: 1px solid #eee;
                transition: right 0.3s ease, opacity 0.3s ease; opacity: 0.6;
            }
            #xhs-ctrl-panel:hover { right: 0; opacity: 1; }
            #xhs-ctrl-panel::before {
                content: "⚙️"; position: absolute; left: -35px; top: 50%;
                transform: translateY(-50%); width: 35px; height: 35px;
                background: #fff; border-radius: 8px 0 0 8px;
                display: flex; align-items: center; justify-content: center;
                box-shadow: -2px 0 5px rgba(0,0,0,0.05); cursor: pointer;
            }
            .ctrl-btn { display: block; margin: 6px 0; cursor: pointer; font-size: 13px; color: #444; }
        `;
        GM_addStyle(css);
    };

    const disguiseTab = () => {
        document.title = "2026年度项目预算表.xlsx - Excel";
        const iconUrl = "https://res-1.cdn.office.net/files/fabric-cdn-prod_20221209.001/assets/brand-icons/product/svg/excel_48x1.svg";
        let link = document.querySelector("link[rel*='icon']");
        if (!link) {
            link = document.createElement('link');
            document.head.appendChild(link);
        }
        link.type = 'image/x-icon';
        link.rel = 'shortcut icon';
        link.href = iconUrl;
    };

    const autoClickGraphicFilter = () => {
        let attempts = 0;
        const timer = setInterval(() => {
            attempts++;
            const filterBtn = document.querySelector('#image-note-filter-el .graphic-filter');
            if (filterBtn) {
                filterBtn.click();
                clearInterval(timer);
            } else if (attempts >= 20) clearInterval(timer);
        }, 500);
    };

    // --- 核心逻辑：标题伪装 ---
    const handleTitleDisguise = () => {
        if (!config.isListMode) return;
        const items = document.querySelectorAll('.note-item:not([data-disguised])');
        items.forEach(item => {
            const titleEl = item.querySelector('.footer .title');
            const authorEl = item.querySelector('.footer .author-wrapper .name');
            if (titleEl && authorEl) {
                const realTitle = titleEl.innerText;
                const randomFake = fakeTitles[Math.floor(Math.random() * fakeTitles.length)];
                titleEl.innerText = randomFake;
                authorEl.innerText = realTitle;
                item.setAttribute('data-disguised', 'true');
            }
        });
    };

    // --- 核心逻辑：标签(Tab)伪装 ---
    const handleTabDisguise = () => {
        // 选择所有标签元素 (根据截图 .channel)
        const tabs = document.querySelectorAll('.channel:not([data-tab-disguised])');

        tabs.forEach(tab => {
            // 获取原生文本（去除空白）
            const realText = tab.innerText.trim();

            if (realText) {
                // 查找映射，找不到则默认显示"其他文档"
                const fakeText = tabMap[realText] || "其他文档";

                // 重构HTML结构：主标题 + 副标题
                tab.innerHTML = `
                    <div class="fake-tab-title">${fakeText}</div>
                    <div class="real-tab-title">${realText}</div>
                `;

                // 标记已处理
                tab.setAttribute('data-tab-disguised', 'true');
            }
        });
    };

    const handleImageMasking = () => {
        if (!config.noImageMode) return;
        const selector = '.media-container:not([data-processed]), .image-wrapper:not([data-processed]), .comment-picture:not([data-processed])';
        const containers = document.querySelectorAll(selector);
        containers.forEach(container => {
            const img = container.querySelector('img') || (container.tagName === 'IMG' ? container : null);
            if (img || container.style.backgroundImage) {
                container.setAttribute('data-processed', 'true');
                container.style.position = 'relative';
                if(img) img.classList.add('xhs-img-hidden');
                const mask = document.createElement('div');
                mask.className = 'xhs-img-mask';
                mask.innerText = '📊 数据加载中...';
                mask.onclick = (e) => {
                    e.stopPropagation();
                    if(img) img.classList.remove('xhs-img-hidden');
                    mask.remove();
                };
                container.appendChild(mask);
            }
        });
    };

    const updateUI = () => {
        document.body.classList.toggle('xhs-list-mode', config.isListMode);
        document.body.classList.toggle('xhs-no-image', config.noImageMode);
    };

    const init = () => {
        injectStyles();
        updateUI();
        disguiseTab();
        autoClickGraphicFilter();

        const observer = new MutationObserver(() => {
            updateUI();
            handleImageMasking();
            handleTitleDisguise();
            handleTabDisguise(); // 持续监听并伪装新出现的标签
            if (document.title !== "2026年度项目预算表.xlsx - Excel") {
                 document.title = "2026年度项目预算表.xlsx - Excel";
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });

        const panel = document.createElement('div');
        panel.id = 'xhs-ctrl-panel';
        panel.innerHTML = `
            <label class="ctrl-btn"><input type="checkbox" id="listToggle" ${config.isListMode ? 'checked' : ''}> 论坛列表模式</label>
            <label class="ctrl-btn"><input type="checkbox" id="imgToggle" ${config.noImageMode ? 'checked' : ''}> 点击显图模式</label>
        `;
        document.body.appendChild(panel);

        panel.querySelector('#listToggle').onchange = (e) => {
            config.isListMode = e.target.checked;
            GM_setValue('isListMode', config.isListMode);
            updateUI();
        };
        panel.querySelector('#imgToggle').onchange = (e) => {
            config.noImageMode = e.target.checked;
            GM_setValue('noImageMode', config.noImageMode);
            updateUI();
            if (!config.noImageMode) location.reload();
        };
    };

    init();
})();