// ==UserScript==
// @name         Bilibili 专栏侧栏美化
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  完美适配新旧版！大屏自动固定(点击锁定无影响)，窄屏自动变为侧滑抽屉(可锁定常驻)；屏蔽原生通知；视觉统一胶囊风格。
// @author       Gemini Thought Partner
// @match        https://www.bilibili.com/read/*
// @match        https://www.bilibili.com/cv/*
// @match        https://www.bilibili.com/opus/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/561885/Bilibili%20%E4%B8%93%E6%A0%8F%E4%BE%A7%E6%A0%8F%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/561885/Bilibili%20%E4%B8%93%E6%A0%8F%E4%BE%A7%E6%A0%8F%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // ==========================================
  // 第一章：全局定义
  // ==========================================
  const IS_NEW_PAGE = location.href.indexOf('/opus/') > -1;
  const IS_OLD_PAGE = location.href.indexOf('/read/') > -1 || location.href.indexOf('/cv/') > -1;

  const ICONS = {
    full: '<svg viewBox="0 0 24 24"><path d="M15 3h6v6M14 10l6.1-6.1M9 21H3v-6M10 14l-6.1 6.1" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    exitFull: '<svg viewBox="0 0 24 24"><path d="M4 14h6v6M10 14L3 21M20 10h-6V4M14 10l7-7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    arrowRight: '<svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    lock: '<svg viewBox="0 0 24 24"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-9-2c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm4.5 9.77v1.73a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.73a2.002 2.002 0 0 1-.55-3.32 2 2 0 0 1 2.65 0 2.002 2.002 0 0 1-.55 3.32z" fill="currentColor"/></svg>',
    close: '<svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></line><line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></line></svg>',
    oldVer: '<svg viewBox="0 0 24 24"><path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" fill="currentColor"/></svg>',
    newVerSparkle: '<svg viewBox="0 0 1024 1024" width="24" height="24"><path d="M512 0l128 384 384 128-384 128-128 384-128-384-384-128 384-128z" fill="currentColor"></path></svg>',
    toTop: '<svg viewBox="0 0 24 24"><path d="M13 20h-2V8l-5.5 5.5-1.42-1.42L12 4.16l7.92 7.92-1.42 1.42L13 8v12z" fill="currentColor"/></svg>'
  };

  // ==========================================
  // 第二章：新版页面引擎 (Opus)
  // ==========================================
  function runNewPageLogic() {
      const cssNew = `
        html, body { overflow-x: hidden !important; width: 100% !important; max-width: none !important; }

        /* --- 侧栏容器基础样式 --- */
        .right-sidebar-wrap {
            display: block !important; visibility: visible !important;
            position: fixed !important;
            bottom: 60px !important;
            top: auto !important;
            margin: 0 !important;
            width: 50px !important; height: auto !important;
            z-index: 2147483640 !important; pointer-events: none !important;
            /* 动画只在 right 属性变化时生效，避免大屏下抖动 */
            transition: right 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), transform 0.3s ease, opacity 0.3s ease !important;
        }

        /* --- 【大屏模式】(宽 > 1200px) --- */
        /* 强制固定在文章旁边，忽略所有收起/隐藏指令 */
        @media screen and (min-width: 1200px) {
            .right-sidebar-wrap {
                left: 50% !important;
                right: auto !important;
                margin-left: 380px !important; /* 紧贴文章 */

                /* 关键：强制复原，无视 collapsed 类 */
                transform: none !important;
                opacity: 1 !important;
            }
        }

        /* --- 【窄屏/半屏模式】(宽 <= 1199px) --- */
        /* 启用侧滑抽屉逻辑 */
        @media screen and (max-width: 1199px) {
            .right-sidebar-wrap {
                left: auto !important;
                right: 20px !important; /* 默认贴边 */
                margin-left: 0 !important;
            }

            /* 收起状态 */
            .right-sidebar-wrap.gm-collapsed {
                transform: translateX(120%) !important;
                opacity: 0.5 !important;
            }

            /* 展开状态 (鼠标悬停 OR 锁定) */
            .right-sidebar-wrap.gm-hover-show,
            .right-sidebar-wrap.gm-locked {
                transform: translateX(0) !important;
                opacity: 1 !important;
            }
        }

        body.gm-immersive-mode .right-sidebar-wrap { zoom: 1.11111 !important; }

        /* 工具栏本体 */
        .side-toolbar {
            pointer-events: auto !important; width: 46px !important;
            background: #fff !important; border: 1px solid #e3e5e7 !important;
            border-radius: 10px !important; box-shadow: 0 4px 16px rgba(0,0,0,0.08) !important;
            padding: 8px 0 !important; display: flex !important; flex-direction: column !important;
            align-items: center !important; gap: 8px !important;
            height: auto !important; min-height: auto !important;
            position: relative !important; z-index: 2 !important;
        }
        .side-toolbar > div { display: contents !important; }

        /* 排序定义 */
        .side-toolbar .toolbar-item:has(.icon-share), .side-toolbar .toolbar-item.share { order: 1 !important; }
        #gm-immersive-btn { order: 2 !important; }
        .side-toolbar .toolbar-item:has(.icon-like), .side-toolbar .toolbar-item.like { order: 3 !important; }
        .side-toolbar .toolbar-item:has(.icon-coin), .side-toolbar .toolbar-item.coin { order: 4 !important; }
        .side-toolbar .toolbar-item:has(.icon-fav), .side-toolbar .toolbar-item.fav { order: 5 !important; }
        .opus-catalog-btn, .catalog { order: 6 !important; margin: 0 !important; width: 36px !important; height: 36px !important; background: transparent !important; border: none !important; display: flex !important; flex-direction: column !important; align-items: center !important; justify-content: center !important; }
        .opus-catalog-btn .iconfont { font-size: 22px !important; margin-bottom: 2px !important; }
        .opus-catalog-btn .text { font-size: 12px !important; line-height: 1 !important; }
        .side-toolbar .toolbar-item:has(.icon-comment), .side-toolbar .toolbar-item.comment { order: 7 !important; }
        #gm-btn-switch { order: 8 !important; }
        .side-toolbar__btn.backtop { order: 9 !important; }
        #gm-collapse-btn { order: 10 !important; margin-top: 8px !important; border-top: 1px solid #f6f6f6 !important; padding-top: 4px !important; }

        /* 按钮样式 */
        .side-toolbar__action, .side-toolbar__btn, #gm-immersive-btn, #gm-btn-switch, #gm-collapse-btn {
            width: 36px !important; height: auto !important; min-height: 36px !important;
            margin: 0 !important; padding: 4px 0 !important;
            display: flex !important; flex-direction: column !important; justify-content: center !important; align-items: center !important;
            border-radius: 6px !important; cursor: pointer !important; background: transparent !important; color: #61666d !important;
            transition: all 0.2s !important; position: relative !important; font-size: 12px !important; line-height: 1.2 !important; border: none !important;
        }
        .side-toolbar__action:hover, .side-toolbar__btn:hover, #gm-immersive-btn:hover, #gm-btn-switch:hover, #gm-collapse-btn:hover {
            background-color: #f1f2f3 !important; color: #00aeec !important;
        }
        .side-toolbar__action.is-active { color: #00aeec !important; }
        .side-toolbar__action svg, #gm-immersive-btn svg, #gm-btn-switch svg, #gm-collapse-btn svg { width: 22px !important; height: 22px !important; margin-bottom: 2px !important; }
        .side-toolbar__btn:not(.backtop) { display: none !important; }

        /* 感应条 */
        #gm-sidebar-trigger { position: fixed; top: 0; right: 0; bottom: 0; width: 25px; background: transparent; z-index: 2147483645; display: none; }

        /* 沉浸模式 */
        body.gm-immersive-mode { overflow-x: hidden !important; }
        body.gm-immersive-mode #app, body.gm-immersive-mode .opus-detail { width: 100% !important; max-width: none !important; margin: 0 !important; padding: 0 !important; }
        body.gm-immersive-mode .article-holder, body.gm-immersive-mode .opus-module-content { width: auto !important; max-width: none !important; margin: 0 auto !important; padding-top: 20px !important; background-color: var(--bg1) !important; }
        body.gm-immersive-mode .right-side-bar, body.gm-immersive-mode .left-side-bar { display: none !important; }
        body.gm-immersive-mode .right-sidebar-wrap { display: block !important; }

        /* 弹窗样式 */
        .opus-collection:not([style*="display: none"]), .collection-m-popover:not([style*="display: none"]),
        .bili-popup, .coin-popup, .toast-wrap, .bili-toast {
            position: fixed !important; right: 80px !important; bottom: 40px !important; top: auto !important; left: auto !important; transform: none !important;
            background-color: #ffffff !important; border: 1px solid #e3e5e7 !important; border-radius: 12px !important;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15) !important; z-index: 2147483647 !important; pointer-events: auto !important; display: flex !important; flex-direction: column !important;
        }
        .coin-popup { padding: 24px !important; width: 280px !important; text-align: center !important; }
        .coin-popup .title { font-size: 16px !important; font-weight: bold !important; display: block !important; }
        .coin-popup .close-btn-row { display: none !important; }
        .coin-popup .close-btn { position: absolute !important; top: 12px !important; right: 12px !important; width: 20px !important; height: 20px !important; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z' fill='%23ccc'/%3E%3C/svg%3E") !important; background-size: cover !important; cursor: pointer !important; }
        .opus-collection__content { flex: 1 !important; min-height: 100px !important; overflow-y: auto !important; background: #fff !important; }
        #gm-catalog-close { position: absolute; top: 15px; right: 15px; width: 28px; height: 28px; border-radius: 4px; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #999; }
        #gm-catalog-close:hover { background: #f1f2f3; color: #333; }
        #gm-catalog-backdrop { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: transparent; z-index: 2147483639; display: none; }
        #gm-catalog-backdrop.gm-active { display: block !important; }
        body.gm-immersive-mode .bili-popup, body.gm-immersive-mode .coin-popup, body.gm-immersive-mode .toast-wrap, body.gm-immersive-mode .opus-collection:not([style*="display: none"]), body.gm-immersive-mode .collection-m-popover:not([style*="display: none"]) { zoom: 1.11111 !important; }
      `;
      GM_addStyle(cssNew);

      // --- 功能函数 ---
      function moveCatalogButton() {
          const toolbar = document.querySelector(".side-toolbar");
          const catalogBtn = document.querySelector(".opus-catalog-btn") || document.querySelector(".catalog");
          if (toolbar && catalogBtn && catalogBtn.parentElement !== toolbar) { toolbar.appendChild(catalogBtn); }
      }

      function performSmartZoom() {
        const content = document.querySelector(".opus-module-content") || document.querySelector(".article-holder") || document.querySelector(".opus-detail");
        if (!content) return;
        const target = document.querySelector(".opus-detail") || content;
        target.style.zoom = "0.9";
        window.scrollTo({ left: 0, top: window.scrollY, behavior: "auto" });
        const contentW = content.offsetWidth;
        if (!contentW || contentW < 100) return;
        const sidebarSpace = 120;
        const viewportW = (window.innerWidth - sidebarSpace) / 0.9;
        let scale = viewportW / contentW;
        if (scale < 1.1) scale = 1.25;
        if (scale > 2.8) scale = 2.8;
        target.style.zoom = scale;
      }

      function toggleImmersive() {
        const btn = document.getElementById("gm-immersive-btn");
        const content = document.querySelector(".article-holder") || document.querySelector(".opus-detail");
        const target = document.querySelector(".opus-detail") || content;
        if (document.body.classList.contains("gm-immersive-mode")) {
          document.body.classList.remove("gm-immersive-mode");
          document.body.style.zoom = "";
          if (btn) btn.innerHTML = ICONS.full;
          if (target) target.style.zoom = "";
          GM_setValue("immersiveMode", false);
        } else {
          document.body.classList.add("gm-immersive-mode");
          document.body.style.zoom = "0.9";
          if (btn) btn.innerHTML = ICONS.exitFull;
          requestAnimationFrame(() => { performSmartZoom(); });
        }
      }

      function initSidebarInteraction() {
        const wrap = document.querySelector(".right-sidebar-wrap");
        if (!wrap) return;
        let trigger = document.getElementById("gm-sidebar-trigger");
        if (!trigger) {
          trigger = document.createElement("div");
          trigger.id = "gm-sidebar-trigger";
          document.body.appendChild(trigger);
          trigger.addEventListener("mouseenter", () => {
            if (wrap.classList.contains("gm-collapsed")) { wrap.classList.add("gm-hover-show"); }
          });
        }
        if (!document.getElementById("gm-collapse-btn")) {
          const container = document.querySelector(".side-toolbar");
          if (container) {
            const btn = document.createElement("div");
            btn.id = "gm-collapse-btn";
            btn.innerHTML = ICONS.lock; btn.title = "锁定/解锁自动收起";

            // 点击锁定按钮逻辑
            btn.onclick = () => {
              if (wrap.classList.contains("gm-locked")) {
                // 解锁 -> 恢复自动收起
                wrap.classList.remove("gm-locked");
                wrap.classList.add("gm-collapsed"); // 恢复收起状态
                wrap.classList.remove("gm-hover-show"); // 移除悬停显示
                trigger.style.display = "block"; // 启用感应
                btn.innerHTML = ICONS.lock;
                btn.title = "锁定侧边栏";
                btn.style.color = "";
              } else {
                // 锁定 -> 常驻显示
                wrap.classList.add("gm-locked");
                wrap.classList.remove("gm-collapsed");
                trigger.style.display = "none"; // 禁用感应
                btn.innerHTML = ICONS.arrowRight;
                btn.title = "收起侧边栏";
                btn.style.color = "#00aeec";
              }
            };
            container.appendChild(btn);
          }
        }
        // 初始化状态：窄屏下默认收起
        if (!wrap.classList.contains("gm-init-done")) {
          wrap.classList.add("gm-collapsed");
          wrap.classList.add("gm-init-done");
          if (trigger) trigger.style.display = "block";
        }
        wrap.addEventListener("mouseleave", () => {
          const catalog = document.querySelector(".opus-collection") || document.querySelector(".collection-m-popover");
          const isCatalogOpen = catalog && catalog.style.display !== "none";
          // 只有在没锁定且目录没打开的情况下才收回
          if (!wrap.classList.contains("gm-locked") && !isCatalogOpen) {
              wrap.classList.remove("gm-hover-show");
          }
        });
      }

      function injectSwitchButton() {
          const container = document.querySelector(".side-toolbar__box") || document.querySelector(".side-toolbar");
          if (!container) return;
          if (document.getElementById('gm-btn-switch')) return;
          const btn = document.createElement('div');
          btn.id = 'gm-btn-switch';
          btn.className = 'side-toolbar__action';
          btn.innerHTML = ICONS.oldVer + '<div style="font-size:12px;margin-top:-2px;">旧版</div>';
          btn.title = "切换到旧版布局";
          btn.onclick = () => {
              const nativeBtns = document.querySelectorAll('.side-toolbar__btn');
              for (let native of nativeBtns) {
                  if (native.innerText.includes('旧版')) { native.click(); return; }
              }
              showToast('未找到旧版入口');
          };
          container.appendChild(btn);
      }

      function injectElements() {
        const container = document.querySelector(".side-toolbar__box") || document.querySelector(".side-toolbar");
        if (!container) return;
        const sidebar = document.querySelector(".right-sidebar-wrap");
        if (sidebar && sidebar.parentElement !== document.body) document.body.appendChild(sidebar);
        moveCatalogButton(); initSidebarInteraction(); initCatalogEnhancer(); initGlobalClickObserver(); injectSwitchButton();
        if (!document.getElementById("gm-immersive-btn")) {
          const btn = document.createElement("div");
          btn.id = "gm-immersive-btn";
          btn.className = "side-toolbar__action";
          btn.innerHTML = ICONS.full; btn.title = "铺满/还原";
          btn.onclick = toggleImmersive;
          btn.style.minHeight = "36px"; btn.style.justifyContent = "center";
          container.appendChild(btn);
        }
      }

      const observer = new MutationObserver(() => { injectElements(); });
      observer.observe(document.body, { childList: true, subtree: true });
      window.addEventListener("resize", () => {
        if (document.body.classList.contains("gm-immersive-mode")) {
          clearTimeout(resizeTimer); resizeTimer = setTimeout(performSmartZoom, 100);
        }
      });
      setTimeout(() => { injectElements(); initCatalogEnhancer(); }, 1000);
  }

  // ==========================================
  // 第三章：旧版页面引擎 (Read/CV)
  // ==========================================
  function runOldPageLogic() {
      const cssOld = `
        /* 1. 胶囊化侧栏 */
        .right-side-bar {
            top: 70% !important; bottom: auto !important; transform: translateY(-50%) !important;
            transition: right 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.3s !important;
            zoom: 1 !important; overflow: visible !important;
            background: #fff !important; border: 1px solid #e3e5e7 !important;
            border-radius: 12px !important; box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
            padding: 8px 0 !important; width: 46px !important;
            display: flex !important; flex-direction: column !important; align-items: center !important; gap: 2px !important;
        }
        .right-side-bar .to-top { display: none !important; }
        .right-side-bar .side-toolbar { display: contents !important; }

        /* 2. 按钮排序 */
        .side-toolbar .toolbar-item:nth-child(1) { order: 10 !important; } /* 赞 */
        .side-toolbar .toolbar-item:nth-child(2) { order: 20 !important; } /* 币 */
        .side-toolbar .toolbar-item:nth-child(3) { order: 30 !important; } /* 藏 */
        .right-side-bar .catalog { order: 40 !important; margin: 0 !important; position: relative !important; } /* 目录 */
        .side-toolbar .toolbar-item:nth-child(4) { order: 50 !important; } /* 评 */
        #gm-btn-switch-new { order: 60 !important; } /* 新版 */
        #gm-btn-totop { order: 70 !important; } /* 顶部 */
        #gm-lock-btn { order: 80 !important; margin-top: 6px !important; border-top: 1px solid #f6f6f6 !important; padding-top: 4px !important; } /* 锁 */

        /* 3. 按钮透明化 */
        .gm-added-btn, .right-side-bar .catalog, .side-toolbar .toolbar-item {
            width: 36px !important; min-height: 36px !important; margin: 2px 0 !important;
            display: flex !important; flex-direction: column !important; justify-content: center !important; align-items: center !important;
            cursor: pointer !important; color: #61666d !important;
            background-color: transparent !important;
            border: none !important; box-shadow: none !important; border-radius: 6px !important;
            transition: all 0.2s !important; box-sizing: border-box !important; padding: 0 !important;
        }
        .gm-added-btn:hover, .right-side-bar .catalog:hover, .side-toolbar .toolbar-item:hover {
            color: #00aeec !important; background-color: #f1f2f3 !important;
        }
        .gm-added-btn svg { width: 24px; height: 24px; margin-bottom: 0px; display: block; }
        .gm-btn-text, .catalog-text, .toolbar-item__num {
            font-size: 12px !important; line-height: 1.2 !important; margin-top: 0px !important;
            transform: scale(0.9) !important; font-family: inherit !important; color: inherit !important;
        }
        .right-side-bar .catalog .iconfont { margin-bottom: 2px !important; font-size: 24px !important; }

        /* 4. 目录面板 (底部对齐) */
        .catalog-panel {
            position: absolute !important; right: 60px !important; top: auto !important; bottom: 0 !important;
            transform: none !important; max-height: 60vh !important; overflow-y: auto !important;
            scrollbar-width: thin; border-radius: 8px; background: #fff; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        /* 5. 侧滑抽屉 (窄屏 < 1300px) */
        @media screen and (max-width: 1300px) {
            .right-side-bar {
                position: fixed !important; right: -40px !important; width: 46px !important; z-index: 99999 !important; opacity: 0.2 !important;
            }
            /* 窄屏下：悬停 或 锁定 时显示 */
            .right-side-bar:hover, .right-side-bar.gm-locked { right: 0 !important; opacity: 1 !important; }
        }

        /* 大屏 > 1300px：强制显示，不允许半透明或隐藏 (为了体验一致性，虽然旧版本身也是常驻的，但防止CSS干扰) */
        @media screen and (min-width: 1301px) {
            .right-side-bar { right: auto !important; opacity: 1 !important; }
        }
      `;
      GM_addStyle(cssOld);

      function injectButtons() {
          const toolbar = document.querySelector(".side-toolbar");
          if (!toolbar) return;
          const container = document.querySelector(".right-side-bar");

          if (!document.getElementById("gm-btn-switch-new")) {
              const btnNew = document.createElement("div");
              btnNew.id = "gm-btn-switch-new";
              btnNew.className = "gm-added-btn";
              btnNew.innerHTML = ICONS.newVerSparkle + '<span class="gm-btn-text">新版</span>';
              btnNew.title = "切换回新版布局";
              btnNew.onclick = () => {
                  const url = new URL(window.location.href);
                  url.searchParams.delete('opus_fallback');
                  window.location.href = url.href;
              };
              toolbar.appendChild(btnNew);
          }

          if (!document.getElementById("gm-btn-totop")) {
              const btnTop = document.createElement("div");
              btnTop.id = "gm-btn-totop";
              btnTop.className = "gm-added-btn";
              btnTop.innerHTML = ICONS.toTop + '<span class="gm-btn-text">顶部</span>';
              btnTop.title = "回到顶部";
              btnTop.onclick = () => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
              };
              toolbar.appendChild(btnTop);
          }

          // 旧版锁定按钮逻辑 (窄屏才有效)
          if (!document.getElementById("gm-lock-btn") && container) {
              const lockBtn = document.createElement("div");
              lockBtn.id = "gm-lock-btn";
              lockBtn.className = "gm-added-btn";
              lockBtn.innerHTML = ICONS.lock;
              lockBtn.title = "锁定侧边栏(仅窄屏有效)";

              lockBtn.onclick = () => {
                  if (container.classList.contains("gm-locked")) {
                      container.classList.remove("gm-locked");
                      lockBtn.innerHTML = ICONS.lock;
                      lockBtn.style.color = "";
                  } else {
                      container.classList.add("gm-locked");
                      lockBtn.innerHTML = ICONS.arrowRight;
                      lockBtn.style.color = "#00aeec";
                  }
              };
              toolbar.appendChild(lockBtn);
          }
      }

      const observer = new MutationObserver(() => { injectButtons(); });
      observer.observe(document.body, { childList: true, subtree: true });
      setTimeout(injectButtons, 1000);
  }

  // ==========================================
  // 第四章：公共辅助 (Helpers)
  // ==========================================
  let resizeTimer;
  let toastTimer = null;

  function showToast(msg) {
      let toast = document.getElementById('gm-custom-toast');
      if (!toast) {
          const style = `
            #gm-custom-toast { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(0.95);
            background: #ffffff !important; color: #505050 !important; border: 1px solid #e3e5e7 !important; border-radius: 8px !important;
            box-shadow: 0 8px 24px rgba(0,0,0,0.12) !important; padding: 12px 24px; font-size: 14px; font-weight: bold;
            z-index: 2147483647; opacity: 0; visibility: hidden; pointer-events: none; transition: all 0.25s; }
            #gm-custom-toast.gm-show { opacity: 1; visibility: visible; transform: translate(-50%, -50%) scale(1); }
          `;
          GM_addStyle(style);
          toast = document.createElement('div');
          toast.id = 'gm-custom-toast';
          document.body.appendChild(toast);
      }
      toast.innerText = msg;
      requestAnimationFrame(() => toast.classList.add('gm-show'));
      if (toastTimer) clearTimeout(toastTimer);
      toastTimer = setTimeout(() => toast.classList.remove('gm-show'), 2000);
  }

  function initGlobalClickObserver() {
      if (!IS_NEW_PAGE) return;
      document.addEventListener('click', (e) => {
          const wrap = document.querySelector(".right-sidebar-wrap");
          const popup = document.querySelector(".opus-collection") || document.querySelector(".collection-m-popover");
          if (!wrap) return;
          const clickedInside = (wrap.contains(e.target)) || (popup && popup.contains(e.target));
          if (!clickedInside) {
              if (popup && popup.style.display !== 'none') {
                  const btn = document.querySelector(".side-toolbar__action.collection") || document.querySelector(".catalog");
                  if (btn) btn.click();
                  popup.style.display = 'none';
              }
              if (wrap.classList.contains("gm-collapsed")) {
                  wrap.classList.remove("gm-hover-show");
                  wrap.classList.remove("gm-catalog-open");
              }
          }
      });
  }

  function forceCloseCatalog() {
    const catalogBtn = document.querySelector(".side-toolbar__action.collection") || document.querySelector(".catalog") || document.querySelector(".m-catalog");
    if (catalogBtn) catalogBtn.click();
    const popup = document.querySelector(".opus-collection") || document.querySelector(".collection-m-popover");
    if (popup) popup.style.display = "none";
    document.getElementById("gm-catalog-backdrop").classList.remove("gm-active");
    const wrap = document.querySelector(".right-sidebar-wrap");
    if(wrap) { wrap.classList.remove("gm-catalog-open"); wrap.classList.remove("gm-hover-show"); }
  }

  function initCatalogEnhancer() {
    if (!IS_NEW_PAGE) return;
    let backdrop = document.getElementById("gm-catalog-backdrop");
    if (!backdrop) {
      backdrop = document.createElement("div");
      backdrop.id = "gm-catalog-backdrop";
      backdrop.onclick = forceCloseCatalog;
      document.body.appendChild(backdrop);
    }
    const wrap = document.querySelector(".right-sidebar-wrap");
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1 && node.classList && node.classList.contains("opus-collection__header")) {
              const popup = node.parentElement;
              if (popup) {
                if (!node.querySelector("#gm-catalog-close")) {
                  const closeBtn = document.createElement("div");
                  closeBtn.id = "gm-catalog-close";
                  closeBtn.innerHTML = ICONS.close;
                  closeBtn.onclick = (e) => { e.stopPropagation(); forceCloseCatalog(); };
                  node.appendChild(closeBtn);
                }
                const styleObserver = new MutationObserver(() => {
                  if (popup.style.display !== "none") {
                    backdrop.classList.add("gm-active");
                    if(wrap) wrap.classList.add("gm-catalog-open");
                  } else {
                    backdrop.classList.remove("gm-active");
                    if(wrap) wrap.classList.remove("gm-catalog-open");
                  }
                });
                styleObserver.observe(popup, { attributes: true, attributeFilter: ["style"] });
                if (popup.style.display !== "none") {
                  backdrop.classList.add("gm-active");
                  if(wrap) wrap.classList.add("gm-catalog-open");
                }
              }
            }
          });
        }
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  function initInterceptor() {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        const cls = (node.className || '').toString();
                        const txt = node.innerText || '';

                        // 拦截新版通用Toast
                        if (IS_NEW_PAGE && cls.includes('toast') && !cls.includes('popup')) {
                            if (txt.includes('硬币') || txt.includes('币')) return;
                            if (txt.length > 0 && txt.length < 50) {
                                showToast(txt);
                                node.style.display = 'none';
                            }
                        }
                    }
                });
            }
        });
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  }

  // ==========================================
  // 第五章：程序入口 (Main Entry)
  // ==========================================
  initInterceptor();

  if (IS_NEW_PAGE) {
      console.log('Bili Sidebar: Opus Mode');
      runNewPageLogic();
  } else if (IS_OLD_PAGE) {
      console.log('Bili Sidebar: Read/CV Mode');
      runOldPageLogic();
  }

})();