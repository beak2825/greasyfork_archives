// ==UserScript==
// @name        自动浏览linux.do的帖子和话题
// @description 自动浏览linux.do的帖子和话题，智能滚动和加载检测，基于https://greasyfork.org/zh-CN/scripts/490382-%E8%87%AA%E5%8A%A8%E6%B5%8F%E8%A7%88linux-do-autobrowse-linux-do，二开
// @namespace   Violentmonkey Scripts
// @match       https://linux.do/*
// @match       https://*.linux.do/*
// @grant       GM_registerMenuCommand
// @grant       GM_unregisterMenuCommand
// @grant       GM_addStyle
// @run-at      document-idle
// @noframes
// @version     1.2.6
// @author      ryen & GPT-5
// @license     MIT
// @icon        https://www.google.com/s2/favicons?domain=linux.do
// @downloadURL https://update.greasyfork.org/scripts/548320/%E8%87%AA%E5%8A%A8%E6%B5%8F%E8%A7%88linuxdo%E7%9A%84%E5%B8%96%E5%AD%90%E5%92%8C%E8%AF%9D%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/548320/%E8%87%AA%E5%8A%A8%E6%B5%8F%E8%A7%88linuxdo%E7%9A%84%E5%B8%96%E5%AD%90%E5%92%8C%E8%AF%9D%E9%A2%98.meta.js
// ==/UserScript==

// 配置项
const CONFIG = {
    scroll: {
        minSpeed: 10,
        maxSpeed: 15,
        minDistance: 2,
        maxDistance: 4,
        checkInterval: 500,
        fastScrollChance: 0.08,
        fastScrollMin: 80,
        fastScrollMax: 200,

        // 人性化滚动参数（鼠标滚轮风格）
        wheelStepMin: 12,      // 单次滚轮步进（px）
        wheelStepMax: 45,
        wheelBurstMin: 3,      // 一次滚轮操作包含的步数
        wheelBurstMax: 8,
        wheelIntervalMin: 14,  // 步与步之间的间隔（ms），模拟帧
        wheelIntervalMax: 28,

        microPauseChance: 0.35,   // 突发后微停顿概率
        microPauseMin: 250,
        microPauseMax: 1100,

        upScrollChance: 0,        // 关闭上划回看
        upScrollMin: 20,
        upScrollMax: 90,

        longRestChance: 0.03,     // 偶发较长休息（模拟看手机/思考）
        longRestMin: 2500,
        longRestMax: 7000,

        dwellSelectors: 'h1, h2, h3, h4, h5, h6, img, pre, code, blockquote, .onebox, .lightbox',
        dwellMin: 800,
        dwellMax: 2000
    },
    time: {
        browseTime: 3600000,
        restTime: 600000,
        minPause: 300,
        maxPause: 500,
        loadWait: 1500,
    },
    article: {
        commentLimit: 1000,
        topicListLimit: 100,
        retryLimit: 3
    },

    mustRead: {
        posts: [
            {
                id: '1051',
                url: 'https://linux.do/t/topic/1051/'
            },
            {
                id: '5973',
                url: 'https://linux.do/t/topic/5973'
            },
            // 在这里添加更多文章
            {
                id: '102770',
                url: 'https://linux.do/t/topic/102770'
            },
            // 示例格式
            {
                id: '154010',
                url: 'https://linux.do/t/topic/154010'
            },
            {
                id: '149576',
                url: 'https://linux.do/t/topic/149576'
            },
            {
                id: '22118',
                url: 'https://linux.do/t/topic/22118'
            },
        ],
      likesNeeded: 5  // 需要点赞的数量
    }
};

// 工具函数
const Utils = {
    random: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,

    sleep: (ms) => new Promise(resolve => setTimeout(resolve, ms)),

    isPageLoaded: () => {
        const loadingElements = document.querySelectorAll('.loading, .infinite-scroll');
        return loadingElements.length === 0;
    },

    isNearBottom: () => {
        const {scrollHeight, clientHeight, scrollTop} = document.documentElement;
        return (scrollTop + clientHeight) >= (scrollHeight - 200);
    },

    debounce: (func, wait) => {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }
};

// 存储管理
const Storage = {
    get: (key, defaultValue = null) => {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : defaultValue;
        } catch {
            return defaultValue;
        }
    },
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Storage error:', error);
            return false;
        }
    }
};

// 默认设置（可在油猴弹窗中快捷开关）
const DEFAULT_SETTINGS = {
    enableMicroPause: true,
    enableLongRest: true,
    enableDwell: true,
    enableUpScroll: false, // 保持“取消回看”的默认
    speedPreset: 'normal',   // 可选: 'slow' | 'normal' | 'fast'
    // 概率参数（0~1）
    microPauseChance: 0.35,
    longRestChance: 0.03,
    upScrollChance: 0
};

const Settings = {
    key: 'autoBrowse_settings',
    load() {
        return Object.assign({}, DEFAULT_SETTINGS, Storage.get(this.key, {}));
    },
    save(newSettings) {
        Storage.set(this.key, newSettings);
    }
};

class BrowseController {
    constructor() {
        this.isScrolling = false;
        this.scrollInterval = null;
        this.pauseTimeout = null;
        this.accumulatedTime = Storage.get('accumulatedTime', 0);
        this.lastActionTime = Date.now();
        this.isTopicPage = window.location.href.includes("/t/topic/");
        this.autoRunning = Storage.get('autoRunning', false);
        this.topicList = Storage.get('topicList', []);
        this.firstUseChecked = Storage.get('firstUseChecked', false);
        this.likesCount = Storage.get('likesCount', 0);
        this.selectedPost = Storage.get('selectedPost', null);

        // 载入设置并应用
        this.settings = Settings.load();
        this.applySettings();

        // 菜单项句柄缓存
        this.menuItems = {};

        this.setupButton();

        // 注册油猴菜单
        this.registerMenu();

        // 绑定快捷键（Alt+Shift+A 开始/停止；Alt+Shift+S 设置）
        this.bindShortcuts();

        // 如果是第一次使用,先处理必读文章
        if (!this.firstUseChecked) {
            this.handleFirstUse();
        } else if (this.autoRunning) {
            if (this.isTopicPage) {
                this.startScrolling();
            } else {
                this.getLatestTopics().then(() => this.navigateNextTopic());
            }
        }
    }

    // 根据设置动态调整 CONFIG 行为
    applySettings() {
        // 概率项：读取设置并按开关启用（范围 0~1）
        const clamp01 = (v) => Math.max(0, Math.min(1, Number(v)) || 0);
        CONFIG.scroll.upScrollChance = this.settings.enableUpScroll ? clamp01(this.settings.upScrollChance) : 0;
        CONFIG.scroll.microPauseChance = this.settings.enableMicroPause ? clamp01(this.settings.microPauseChance) : 0;
        CONFIG.scroll.longRestChance = this.settings.enableLongRest ? clamp01(this.settings.longRestChance) : 0;

        // 驻留
        this.dwellEnabled = !!this.settings.enableDwell;

        // 速度预设：调整步进与间隔
        if (this.settings.speedPreset === 'slow') {
            CONFIG.scroll.wheelStepMin = 10;
            CONFIG.scroll.wheelStepMax = 28;
            CONFIG.scroll.wheelIntervalMin = 18;
            CONFIG.scroll.wheelIntervalMax = 35;
        } else if (this.settings.speedPreset === 'fast') {
            CONFIG.scroll.wheelStepMin = 20;
            CONFIG.scroll.wheelStepMax = 55;
            CONFIG.scroll.wheelIntervalMin = 10;
            CONFIG.scroll.wheelIntervalMax = 22;
        } else {
            // normal
            CONFIG.scroll.wheelStepMin = 12;
            CONFIG.scroll.wheelStepMax = 45;
            CONFIG.scroll.wheelIntervalMin = 14;
            CONFIG.scroll.wheelIntervalMax = 28;
        }
    }

    // 创建/更新控制按钮
    setupButton() {
        // 由于站点 CSP 禁止 inline-style，这里不设置任何样式，仅放置一个原生按钮。
        // 为提升可见性：
        // - 按钮拥有固定 id：ab-start-stop
        // - 始终插入到 <body> 最前面
        // - 若被页面移除（SPA 重渲染），将自动重建
        let btn = document.getElementById('ab-start-stop');
        if (!btn) {
            btn = document.createElement('button');
            btn.id = 'ab-start-stop';
            btn.type = 'button';
            btn.title = 'AutoBrowse 开始/停止（Alt+Shift+A）';
            btn.addEventListener('click', () => this.handleButtonClick());
        }
        btn.textContent = this.autoRunning ? '停止' : '开始阅读';
        btn.classList.toggle('ab-running', !!this.autoRunning);

        // 优先挂到“话题页右侧时间轴”以实现接近“右侧中部悬浮”的视觉位置（无需样式）
        // 话题页常见容器：.timeline-container 或 .topic-timeline
        const rightTimeline = this.isTopicPage && (document.querySelector('.timeline-container') || document.querySelector('.topic-timeline'));
        // 非话题页或不存在时间轴时，退化到站点头部（.d-header / header），再退到 body
        const header = document.querySelector('.d-header') || document.querySelector('header');
        let container = rightTimeline || header || document.body;
        if (!container.contains(btn)) {
            // 尽量作为容器的第一个元素，便于发现
            container.insertBefore(btn, container.firstChild || null);
        }
        this.button = btn;

        // 注入样式（右侧中部悬浮胶囊按钮），在严格 CSP 下尝试以 <style> 注入；若被拦截则忽略
        this.ensureButtonStyles();

        // 监听 body 变化，若按钮被移除则重建
        if (!this._btnObserver) {
            this._btnObserver = new MutationObserver(() => {
                const exists = document.getElementById('ab-start-stop');
                if (!exists) {
                    // 重建
                    const b = document.createElement('button');
                    b.id = 'ab-start-stop';
                    b.type = 'button';
                    b.title = 'AutoBrowse 开始/停止（Alt+Shift+A）';
                    b.textContent = this.autoRunning ? '停止' : '开始阅读';
                    b.classList.toggle('ab-running', !!this.autoRunning);
                    b.addEventListener('click', () => this.handleButtonClick());
                    const rt = this.isTopicPage && (document.querySelector('.timeline-container') || document.querySelector('.topic-timeline'));
                    const hdr = document.querySelector('.d-header') || document.querySelector('header');
                    const parent = rt || hdr || document.body;
                    parent.insertBefore(b, parent.firstChild || null);
                    this.button = b;
                }
            });
            const target = (this.isTopicPage && (document.querySelector('.timeline-container') || document.querySelector('.topic-timeline'))) 
                || document.querySelector('.d-header') 
                || document.querySelector('header') 
                || document.body;
            this._btnObserver.observe(target, { childList: true, subtree: true });
        }

        // 兜底定时器，防止极端情况下丢失
        if (!this._btnInterval) {
            this._btnInterval = setInterval(() => {
                const exists = document.getElementById('ab-start-stop');
                if (!exists) {
                    this.setupButton();
                }
            }, 3000);
        }
    }

    // 确保开始/停止按钮的样式被注入（右侧中部悬浮胶囊按钮）
    ensureButtonStyles() {
        try {
            if (this._styleInjected || document.getElementById('ab-style')) return;
            const css = `
            #ab-start-stop {
              position: fixed;
              top: 50%;
              right: 12px;
              transform: translateY(-50%);
              z-index: 2147483647;
              padding: 8px 14px;
              border-radius: 999px;
              border: 1px solid rgba(0,0,0,.12);
              background: #1f6feb;
              color: #fff;
              font: 600 14px/1 system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji";
              cursor: pointer;
              box-shadow: 0 6px 16px rgba(0,0,0,.12);
            }
            #ab-start-stop.ab-running {
              background: #d11a2a;
              border-color: rgba(0,0,0,.12);
            }
            #ab-start-stop:hover, #ab-start-stop:focus {
              filter: brightness(0.95);
              outline: none;
            }
            #ab-start-stop.ab-running:hover, #ab-start-stop.ab-running:focus {
              filter: brightness(0.92);
            }
            @media (max-width: 900px) {
              #ab-start-stop { right: 8px; padding: 7px 12px; }
            }`;
            if (typeof GM_addStyle === 'function') {
                GM_addStyle(css);
                this._styleInjected = true;
                return;
            }
            const style = document.createElement('style');
            style.id = 'ab-style';
            style.type = 'text/css';
            style.appendChild(document.createTextNode(css));
            document.documentElement.appendChild(style);
            this._styleInjected = true;
        } catch (e) {
            // 在严格 CSP 下可能被拦截，保持静默；按钮仍然可用
        }
    }

    // 在扩展图标弹出的菜单中提供快捷开关（动态标签），并提供“控制面板”入口
    registerMenu() {
        this.updateMenuCommands();
    }

    updateMenuCommands() {
        try {
            if (typeof GM_registerMenuCommand !== 'function') return;
            console.log('[autoBrowse] 注册菜单: GM_registerMenuCommand 可用');

            // 移除旧菜单
            if (typeof GM_unregisterMenuCommand === 'function' && this.menuItems) {
                Object.values(this.menuItems).forEach(id => {
                    try { GM_unregisterMenuCommand(id); } catch {}
                });
            }
            this.menuItems = {};
            console.log('[autoBrowse] 清理旧菜单完成, 开始注册新菜单');

            const s = this.settings;

            // 启动/停止（避免按钮受 CSP 影响不可见）
            this.menuItems.startStop = GM_registerMenuCommand(this.autoRunning ? '■ 停止' : '▶ 开始阅读', () => this.handleButtonClick());

            // 控制面板入口
            this.menuItems.controlPanel = GM_registerMenuCommand('⚙️ 打开控制面板', () => this.showControlPanel());
            console.log('[autoBrowse] 菜单已注册: 控制面板、开关与速度预设');

            // 快速开关（保留动态菜单）
            this.menuItems.microPause = GM_registerMenuCommand(`⏸ 微停顿：${s.enableMicroPause ? '开' : '关'}`, () => this.toggleSetting('enableMicroPause'));
            this.menuItems.longRest   = GM_registerMenuCommand(`😴 长休息：${s.enableLongRest ? '开' : '关'}`, () => this.toggleSetting('enableLongRest'));
            this.menuItems.dwell      = GM_registerMenuCommand(`📌 驻留元素：${s.enableDwell ? '开' : '关'}`, () => this.toggleSetting('enableDwell'));
            this.menuItems.upScroll   = GM_registerMenuCommand(`🔼 回看上划：${s.enableUpScroll ? '开' : '关'}`, () => this.toggleSetting('enableUpScroll'));
            this.menuItems.speed      = GM_registerMenuCommand(`🚀 速度预设：${s.speedPreset}`, () => {
                const order = ['slow', 'normal', 'fast'];
                const idx = order.indexOf(this.settings.speedPreset);
                this.settings.speedPreset = order[(idx + 1) % order.length];
                Settings.save(this.settings);
                this.applySettings();
                this.updateMenuCommands();
            });
        } catch (e) {
            console.warn('[autoBrowse] 注册菜单失败:', e);
        }
    }

    toggleSetting(key) {
        this.settings[key] = !this.settings[key];
        Settings.save(this.settings);
        this.applySettings();
        this.updateMenuCommands();
    }

    // 使用 <dialog> 构建控制面板，避免任何 inline-style 以绕过严苛 CSP
    showControlPanel() {
        const exist = document.getElementById('autoBrowse-control-panel');
        if (exist) exist.remove();

        const dlg = document.createElement('dialog');
        dlg.id = 'autoBrowse-control-panel';
        // 仅使用语义元素，不设置 style 属性；采用表格与分组布局，提升可读性与“视觉宽度”
        dlg.innerHTML = `
<form method="dialog" aria-label="AutoBrowse 控制面板">
  <header>
    <h2>AutoBrowse 控制面板</h2>
  </header>
  <section>
    <fieldset>
      <legend>滚动行为</legend>
      <table width="100%">
        <colgroup>
          <col span="1">
          <col span="1">
        </colgroup>
        <tbody>
          <tr>
            <td><label for="ab-speed">速度预设</label></td>
            <td>
              <select id="ab-speed">
                <option value="slow" ${this.settings.speedPreset==='slow'?'selected':''}>slow（慢速）</option>
                <option value="normal" ${this.settings.speedPreset==='normal'?'selected':''}>normal（默认）</option>
                <option value="fast" ${this.settings.speedPreset==='fast'?'selected':''}>fast（快速）</option>
              </select>
            </td>
          </tr>
          <tr>
            <td><label for="ab-micro">微停顿</label></td>
            <td>
              <input id="ab-micro" type="checkbox" ${this.settings.enableMicroPause ? 'checked' : ''}>
              <small>模拟滚动后短暂停留，更像真人浏览</small>
            </td>
          </tr>
          <tr>
            <td><label for="ab-microChance">微停顿概率</label></td>
            <td>
              <input id="ab-microChance" type="number" step="0.01" min="0" max="1" value="${this.settings.microPauseChance}">
              <small>0~1，数值越大越频繁</small>
            </td>
          </tr>
          <tr>
            <td><label for="ab-long">长休息</label></td>
            <td>
              <input id="ab-long" type="checkbox" ${this.settings.enableLongRest ? 'checked' : ''}>
              <small>偶尔进行较长休息，模拟思考/看手机</small>
            </td>
          </tr>
          <tr>
            <td><label for="ab-longChance">长休息概率</label></td>
            <td>
              <input id="ab-longChance" type="number" step="0.01" min="0" max="1" value="${this.settings.longRestChance}">
              <small>0~1，建议较小（如 0.03）</small>
            </td>
          </tr>
          <tr>
            <td><label for="ab-dwell">驻留可读元素</label></td>
            <td>
              <input id="ab-dwell" type="checkbox" ${this.settings.enableDwell ? 'checked' : ''}>
              <small>在标题/图片/代码块等位置稍作停留</small>
            </td>
          </tr>
          <tr>
            <td><label for="ab-up">回看上划</label></td>
            <td>
              <input id="ab-up" type="checkbox" ${this.settings.enableUpScroll ? 'checked' : ''}>
              <small>偶尔向上滚动回看</small>
            </td>
          </tr>
          <tr>
            <td><label for="ab-upChance">回看概率</label></td>
            <td>
              <input id="ab-upChance" type="number" step="0.01" min="0" max="1" value="${this.settings.upScrollChance}">
              <small>0~1，默认 0（关闭）</small>
            </td>
          </tr>
        </tbody>
      </table>
    </fieldset>

    <hr>
    <p><small>提示：按 Enter 立即保存，按 Esc 关闭面板。</small></p>
  </section>
  <menu>
    <button id="ab-cancel" value="cancel">取消</button>
    <button id="ab-save" value="default">保存</button>
  </menu>
</form>`;

        document.body.appendChild(dlg);
        if (typeof dlg.showModal === 'function') dlg.showModal();

        const close = () => { try { dlg.close(); } catch {} dlg.remove(); };
        dlg.querySelector('#ab-close').addEventListener('click', (e) => { e.preventDefault(); close(); });
        dlg.querySelector('#ab-cancel').addEventListener('click', (e) => { e.preventDefault(); close(); });
        dlg.querySelector('#ab-save').addEventListener('click', (e) => {
            e.preventDefault();
            const clamp01 = (v) => Math.max(0, Math.min(1, Number(v) || 0));
            const next = {
                enableMicroPause: dlg.querySelector('#ab-micro').checked,
                enableLongRest: dlg.querySelector('#ab-long').checked,
                enableDwell: dlg.querySelector('#ab-dwell').checked,
                enableUpScroll: dlg.querySelector('#ab-up').checked,
                speedPreset: dlg.querySelector('#ab-speed').value,
                microPauseChance: clamp01(dlg.querySelector('#ab-microChance').value),
                longRestChance: clamp01(dlg.querySelector('#ab-longChance').value),
                upScrollChance: clamp01(dlg.querySelector('#ab-upChance').value)
            };
            this.settings = Object.assign({}, this.settings, next);
            Settings.save(this.settings);
            this.applySettings();
            this.updateMenuCommands();
            close();
            window.location.reload();
        });
    }

    // 键盘快捷键，避免按钮受 CSP 限制不可见
    bindShortcuts() {
        window.addEventListener('keydown', (ev) => {
            // Alt+Shift+A 开始/停止
            if (ev.altKey && ev.shiftKey && (ev.key === 'A' || ev.key === 'a')) {
                ev.preventDefault();
                this.handleButtonClick();
            }
            // Alt+Shift+S 打开设置
            if (ev.altKey && ev.shiftKey && (ev.key === 'S' || ev.key === 's')) {
                ev.preventDefault();
                this.showControlPanel();
            }
        }, { passive: false });
    }

    async handleFirstUse() {
    if (!this.autoRunning) return; // 如果没有运行，直接返回

    // 如果还没有选择文章
    if (!this.selectedPost) {
        // 随机选择一篇必读文章
        const randomIndex = Math.floor(Math.random() * CONFIG.mustRead.posts.length);
        this.selectedPost = CONFIG.mustRead.posts[randomIndex];
        Storage.set('selectedPost', this.selectedPost);
        console.log(`随机选择文章: ${this.selectedPost.url}`);

        // 导航到选中的文章
        window.location.href = this.selectedPost.url;
        return;
    }

    const currentUrl = window.location.href;

    // 如果在选中的文章页面
    if (currentUrl.includes(this.selectedPost.url)) {
        console.log(`当前在选中的文章页面，已点赞数: ${this.likesCount}`);

        while (this.likesCount < CONFIG.mustRead.likesNeeded && this.autoRunning) {
            // 尝试点赞随机评论
            await this.likeRandomComment();

            if (this.likesCount >= CONFIG.mustRead.likesNeeded) {
                console.log('完成所需点赞数量，开始正常浏览');
                Storage.set('firstUseChecked', true);
                this.firstUseChecked = true;
                await this.getLatestTopics();
                await this.navigateNextTopic();
                break;
            }

            await Utils.sleep(1000); // 点赞间隔
        }
    } else {
        // 如果不在选中的文章页面，导航过去
        window.location.href = this.selectedPost.url;
    }
}

handleButtonClick() {
    if (this.isScrolling || this.autoRunning) {
        // 停止所有操作
        this.stopScrolling();
        this.autoRunning = false;
        Storage.set('autoRunning', false);
        if (this.button) {
            this.button.textContent = "开始阅读";
            this.button.classList.remove('ab-running');
        }
        // 刷新菜单文案
        this.updateMenuCommands();
    } else {
        // 开始运行
        this.autoRunning = true;
        Storage.set('autoRunning', true);
        if (this.button) {
            this.button.textContent = "停止";
            this.button.classList.add('ab-running');
        }
        // 刷新菜单文案
        this.updateMenuCommands();

        if (!this.firstUseChecked) {
            // 开始处理必读文章
            this.handleFirstUse();
        } else if (this.isTopicPage) {
            this.startScrolling();
        } else {
            this.getLatestTopics().then(() => this.navigateNextTopic());
        }
    }
}

async likeRandomComment() {
    if (!this.autoRunning) return false; // 如果停止运行，立即返回

    // 获取所有评论的点赞按钮
    const likeButtons = Array.from(document.querySelectorAll('.like-button, .like-count, [data-like-button], .discourse-reactions-reaction-button'))
        .filter(button =>
            button &&
            button.offsetParent !== null &&
            !button.classList.contains('has-like') &&
            !button.classList.contains('liked')
        );

    if (likeButtons.length > 0) {
        // 随机选择一个未点赞的按钮
        const randomButton = likeButtons[Math.floor(Math.random() * likeButtons.length)];
        // 滚动到按钮位置
        randomButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
        await Utils.sleep(1000);

        if (!this.autoRunning) return false; // 再次检查是否停止运行

        console.log('找到可点赞的评论，准备点赞');
        randomButton.click();
        this.likesCount++;
        Storage.set('likesCount', this.likesCount);
        await Utils.sleep(1000);
        return true;
    }

    // 如果找不到可点赞的按钮，往下滚动一段距离
    window.scrollBy({
        top: 500,
        behavior: 'smooth'
    });
    await Utils.sleep(1000);

    console.log('当前位置没有找到可点赞的评论，继续往下找');
    return false;
}

    async getLatestTopics() {
        let page = 1;
        let topicList = [];
        let retryCount = 0;

        while (topicList.length < CONFIG.article.topicListLimit && retryCount < CONFIG.article.retryLimit) {
            try {
                const response = await fetch(`https://linux.do/latest.json?no_definitions=true&page=${page}`);
                const data = await response.json();

                if (data?.topic_list?.topics) {
                    const filteredTopics = data.topic_list.topics.filter(topic =>
                        topic.posts_count < CONFIG.article.commentLimit
                    );
                    topicList.push(...filteredTopics);
                    page++;
                } else {
                    break;
                }
            } catch (error) {
                console.error('获取文章列表失败:', error);
                retryCount++;
                await Utils.sleep(1000);
            }
        }

        if (topicList.length > CONFIG.article.topicListLimit) {
            topicList = topicList.slice(0, CONFIG.article.topicListLimit);
        }

        this.topicList = topicList;
        Storage.set('topicList', topicList);
        console.log(`已获取 ${topicList.length} 篇文章`);
    }

    async getNextTopic() {
        if (this.topicList.length === 0) {
            await this.getLatestTopics();
        }

        if (this.topicList.length > 0) {
            const topic = this.topicList.shift();
            Storage.set('topicList', this.topicList);
            return topic;

        }

        return null;
    }

    async startScrolling() {
    if (this.isScrolling) return;

    this.isScrolling = true;
    if (this.button) {
        this.button.textContent = "停止";
        this.button.classList.add('ab-running');
    }
    this.lastActionTime = Date.now();

        while (this.isScrolling) {
            // 1) 鼠标滚轮“突发”滚动
            await this.performWheelBurst(1);

            // 2) 累计时间
            this.accumulateTime();

            // 3) 微停顿与偶发长休息（取消回看）
            await this.maybeMicroPause();
            await this.maybeLongRest();

            // 4) 对可读元素短驻留
            await this.maybeDwellOnReadable();

            // 5) 接近底部则尝试翻到下一篇
            if (Utils.isNearBottom()) {
                await Utils.sleep(600);
                if (Utils.isNearBottom() && Utils.isPageLoaded()) {
                    console.log("已到达页面底部，准备导航到下一篇文章...");
                    await Utils.sleep(800);
                    await this.navigateNextTopic();
                    break;
                }
            }
        }
    }

    // 模拟一次“滚轮突发”滚动（多步） direction: 1 向下, -1 向上
    async performWheelBurst(direction = 1) {
        const steps = Utils.random(CONFIG.scroll.wheelBurstMin, CONFIG.scroll.wheelBurstMax);
        for (let i = 0; i < steps && this.isScrolling; i++) {
            const step = Utils.random(CONFIG.scroll.wheelStepMin, CONFIG.scroll.wheelStepMax);
            const jitter = Utils.random(-2, 3); // 轻微抖动
            window.scrollBy({ top: direction * (step + jitter) });
            const interval = Utils.random(CONFIG.scroll.wheelIntervalMin, CONFIG.scroll.wheelIntervalMax);
            await Utils.sleep(interval);
        }
    }

    async maybeMicroPause() {
        if (Math.random() < CONFIG.scroll.microPauseChance) {
            const pause = Utils.random(CONFIG.scroll.microPauseMin, CONFIG.scroll.microPauseMax);
            await Utils.sleep(pause);
        }
    }

    async maybeLongRest() {
        if (Math.random() < CONFIG.scroll.longRestChance) {
            const rest = Utils.random(CONFIG.scroll.longRestMin, CONFIG.scroll.longRestMax);
            await Utils.sleep(rest);
        }
    }

    async maybeUpScroll() {
        if (Math.random() < CONFIG.scroll.upScrollChance) {
            const amount = Utils.random(CONFIG.scroll.upScrollMin, CONFIG.scroll.upScrollMax);
            // 上划通常步数少、幅度小
            await this.performWheelBurst(-1);
            // 再补一个更小的回看
            window.scrollBy({ top: -amount });
            await Utils.sleep(Utils.random(80, 160));
        }
    }

    async maybeDwellOnReadable() {
        if (!this.dwellEnabled) return;
        const el = this.findReadableElementNearCenter();
        if (!el) return;
        // 25% 概率驻留
        if (Math.random() < 0.25) {
            // 如果元素不在中心附近，则滚动至居中
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            await Utils.sleep(Utils.random(200, 400));
            const dwell = Utils.random(CONFIG.scroll.dwellMin, CONFIG.scroll.dwellMax);
            await Utils.sleep(dwell);
        }
    }

    findReadableElementNearCenter() {
        const selectors = CONFIG.scroll.dwellSelectors;
        const nodes = Array.from(document.querySelectorAll(selectors));
        if (!nodes.length) return null;

        const vh = window.innerHeight;
        const vw = window.innerWidth;
        const centerY = vh / 2;
        const centerX = vw / 2;

        let best = null;
        let bestScore = Infinity;

        for (const n of nodes) {
            const r = n.getBoundingClientRect();
            // 忽略不可见或非常小的元素
            if (r.width < 20 || r.height < 16) continue;
            if (r.bottom < 0 || r.top > vh) continue;

            const elCenterY = r.top + r.height / 2;
            const elCenterX = r.left + r.width / 2;
            const dy = Math.abs(elCenterY - centerY);
            const dx = Math.abs(elCenterX - centerX);
            const score = dy + dx * 0.3; // 垂直更重要

            if (score < bestScore) {
                bestScore = score;
                best = n;
            }
        }

        // 只在中心阈值内才认为值得驻留
        if (best && bestScore < 180) return best;
        return null;
    }

    async waitForPageLoad() {
        let attempts = 0;
        const maxAttempts = 5;
        while (attempts < maxAttempts) {
            if (Utils.isPageLoaded()) {
                return true;
            }
            await Utils.sleep(300);
            attempts++;
        }
        return false;
    }

    stopScrolling() {
        this.isScrolling = false;
        clearInterval(this.scrollInterval);
        clearTimeout(this.pauseTimeout);
        if (this.button) {
            this.button.textContent = "开始阅读";
            this.button.classList.remove('ab-running');
        }
    }

    accumulateTime() {
        const now = Date.now();
        this.accumulatedTime += now - this.lastActionTime;
        Storage.set('accumulatedTime', this.accumulatedTime);
        this.lastActionTime = now;

        if (this.accumulatedTime >= CONFIG.time.browseTime) {
            this.accumulatedTime = 0;
            Storage.set('accumulatedTime', 0);
            this.pauseForRest();
        }
    }

    async pauseForRest() {
        this.stopScrolling();
        console.log("休息10分钟...");
        await Utils.sleep(CONFIG.time.restTime);
        console.log("休息结束，继续浏览...");
        this.startScrolling();
    }

    async navigateNextTopic() {
        const nextTopic = await this.getNextTopic();
        if (nextTopic) {
            console.log("导航到新文章:", nextTopic.title);
            const url = nextTopic.last_read_post_number
                ? `https://linux.do/t/topic/${nextTopic.id}/${nextTopic.last_read_post_number}`
                : `https://linux.do/t/topic/${nextTopic.id}`;
            window.location.href = url;
        } else {
            console.log("没有更多文章，返回首页");
            window.location.href = "https://linux.do/latest";
        }
    }

    // 添加重置方法（可选，用于测试）
    resetFirstUse() {
        Storage.set('firstUseChecked', false);
        Storage.set('likesCount', 0);
        Storage.set('selectedPost', null);
        this.firstUseChecked = false;
        this.likesCount = 0;
        this.selectedPost = null;
        console.log('已重置首次使用状态');
    }
}

// 初始化
(function() {
    new BrowseController();
})();