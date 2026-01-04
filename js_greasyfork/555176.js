// ==UserScript==
// @name         Linux.do 论坛新帖聊天界面 CC版
// @namespace    https://linux.do/
// @version      3.3
// @description  论坛新帖聊天界面CC版 - TG聊天风格
// @author       Claude & Codex
// @match        https://linux.do/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555176/Linuxdo%20%E8%AE%BA%E5%9D%9B%E6%96%B0%E5%B8%96%E8%81%8A%E5%A4%A9%E7%95%8C%E9%9D%A2%20CC%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/555176/Linuxdo%20%E8%AE%BA%E5%9D%9B%E6%96%B0%E5%B8%96%E8%81%8A%E5%A4%A9%E7%95%8C%E9%9D%A2%20CC%E7%89%88.meta.js
// ==/UserScript==
(function(){
    'use strict';
    if (window.__LDCC_ASSISTANT__) return; window.__LDCC_ASSISTANT__ = true;

    const isCustomPage = window.location.pathname === '/mynew';
    // 自定义页面默认展开，其他页面继续最小化
    const startMinimized = !isCustomPage;

    // ---------- Configuration ----------
    const LDCC_STORAGE_KEYS='__ldcc_assistant_settings_v33';
    const LDCC_DEFAULT_CONFIG={ poll:30000, timeTick:1000, max:50, postRefresh:10000 };
    const LDCC_CONFIG=(()=>{
        const saved = GM_getValue(LDCC_STORAGE_KEYS, '{}');
        try{
            return {...LDCC_DEFAULT_CONFIG, ...(JSON.parse(saved)||{})};
        } catch {
            return {...LDCC_DEFAULT_CONFIG};
        }
    })();
    const LDCC_POLL_LIMITS={ min:5000, max:120000, step:5000 };

    function ldccPersistConfig(){
        try{
            GM_setValue(LDCC_STORAGE_KEYS, JSON.stringify(LDCC_CONFIG));
        }catch(err){
            console.warn('LDCC 配置保存失败:', err);
        }
    }

    function ldccUpdateConfig(update={}){
        Object.assign(LDCC_CONFIG, update);
        ldccPersistConfig();
    }

    const initialPoll=Math.min(LDCC_POLL_LIMITS.max, Math.max(LDCC_POLL_LIMITS.min, LDCC_CONFIG.poll));
    if (initialPoll!==LDCC_CONFIG.poll){
        LDCC_CONFIG.poll=initialPoll;
        ldccPersistConfig();
    }
    let pollingDelay=LDCC_CONFIG.poll;

    function ldccApplyPollInterval(ms){
        if (typeof ms!=='number' || Number.isNaN(ms)) return;
        const normalized=Math.min(
            LDCC_POLL_LIMITS.max,
            Math.max(LDCC_POLL_LIMITS.min, Math.round(ms/LDCC_POLL_LIMITS.step)*LDCC_POLL_LIMITS.step)
        );
        if (normalized===LDCC_CONFIG.poll) return;
        ldccUpdateConfig({ poll:normalized });
        pollingDelay=normalized;
        console.log(`[LDCC] 刷新间隔已调整为 ${Math.round(normalized/1000)} 秒`);
        if (typeof pollLdccChatList==='function'){
            pollLdccChatList(true);
        }
    }

    // ---------- Styles (TG聊天风格) ----------
    GM_addStyle(`
      :root{
        --ldcc-primary: #0088cc;
        --ldcc-primary-dark: #006699;
        --ldcc-bg-light: #f7f7f7;
        --ldcc-bg-dark: #ffffff;
        --ldcc-bg-message: #ffffff;
        --ldcc-bg-own: #dcf8c6;
        --ldcc-border: #e1e1e1;
        --ldcc-text-primary: #222222;
        --ldcc-text-secondary: #666666;
        --ldcc-text-muted: #999999;
        --ldcc-shadow: 0 1px 3px rgba(0,0,0,0.12);
        --ldcc-radius: 8px;
        --ldcc-radius-small: 6px;
        --ldcc-timestamp-color: #8a8a8a;
      }

      /* TG聊天风格主容器 */
      #ldcc-assistant-container{
        position:fixed;
        right:24px;
        bottom:24px;
        height:600px;
        width:500px;
        display:none; /* 默认隐藏，避免闪现 */
        flex-direction:column;
        z-index:2147483600;
        background:var(--ldcc-bg-dark);
        border:1px solid var(--ldcc-border);
        border-radius:var(--ldcc-radius);
        box-shadow:0 8px 32px rgba(0,0,0,0.15);
        overflow:hidden;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      }

      #ldcc-assistant-container.dragging{opacity:0.9;cursor:move;}
      #ldcc-assistant-container.resizing{cursor:nwse-resize;}

      /* 调整大小手柄 - 8方向 */
      .ldcc-resize-handle{
        position:absolute;
        background:transparent;
        z-index:15;
      }
      .ldcc-resize-handle.n{top:0;left:12px;right:12px;height:6px;cursor:ns-resize;}
      .ldcc-resize-handle.s{bottom:0;left:12px;right:12px;height:6px;cursor:ns-resize;}
      .ldcc-resize-handle.e{right:0;top:12px;bottom:12px;width:6px;cursor:ew-resize;}
      .ldcc-resize-handle.w{left:0;top:12px;bottom:12px;width:6px;cursor:ew-resize;}
      .ldcc-resize-handle.ne{top:0;right:0;width:12px;height:12px;cursor:nesw-resize;}
      .ldcc-resize-handle.nw{top:0;left:0;width:12px;height:12px;cursor:nwse-resize;}
      .ldcc-resize-handle.se{bottom:0;right:0;width:12px;height:12px;cursor:nwse-resize;}
      .ldcc-resize-handle.sw{bottom:0;left:0;width:12px;height:12px;cursor:nesw-resize;}

      /* TG风格头部 - 优化渐变和阴影 */
      #ldcc-main-header{
        background:linear-gradient(180deg, #53a9ff 0%, #2b5ce6 30%, #1e3c72 100%);
        color:white;
        padding:16px 20px;
        font-weight:700;
        font-size:16px;
        display:flex;
        justify-content:space-between;
        align-items:center;
        cursor:move;
        user-select:none;
        border-bottom:1px solid rgba(255,255,255,0.1);
        box-shadow:0 8px 32px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.2);
        text-shadow:0 1px 2px rgba(0,0,0,0.2);
        backdrop-filter:blur(10px);
        position:relative;
      }
      #ldcc-main-header::before{
        content:'';
        position:absolute;
        top:0;
        left:0;
        right:0;
        height:1px;
        background:linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
      }

      /* 头部操作按钮 - TG风格优化 */
      #ldcc-header-actions{
        display:flex;
        gap:16px;
        align-items:center;
      }
      #ldcc-refresh-btn,#ldcc-minimize-btn,#ldcc-close-btn,#ldcc-hub-btn{
        cursor:pointer;
        user-select:none;
        font-size:18px;
        opacity:0.9;
        transition:all 0.3s ease;
        padding:8px;
        border-radius:8px;
        background:rgba(255,255,255,0.15);
        border:1px solid rgba(255,255,255,0.2);
        box-shadow:0 2px 8px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.3);
        backdrop-filter:blur(5px);
      }
      #ldcc-refresh-btn:hover,#ldcc-minimize-btn:hover,#ldcc-close-btn:hover,#ldcc-hub-btn:hover{
        opacity:1;
        background:rgba(255,255,255,0.25);
        transform:translateY(-2px);
        box-shadow:0 4px 12px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.4);
      }

      /* 聊天主体布局 */
      #ldcc-main-panel{
        flex:1;
        display:flex;
        overflow:hidden;
        background:var(--ldcc-bg-light);
      }

      /* 左侧对话列表 - TG风格优化 */
      #ldcc-chat-list{
        width:300px;
        background:linear-gradient(180deg, #f8fafd 0%, #ffffff 100%);
        border-right:1px solid rgba(0,0,0,0.08);
        overflow-y:auto;
        display:flex;
        flex-direction:column;
        position:relative;
        box-shadow:inset -1px 0 0 rgba(0,0,0,0.05);
      }

      /* 左侧列表调整大小手柄 */
      .ldcc-chat-list-resize-handle{
        position:absolute;
        top:0;
        right:0;
        width:8px;
        height:100%;
        background:rgba(0,136,204,0.1);
        cursor:col-resize;
        z-index:1000;
        transition:background 0.2s ease;
        user-select:none;
      }
      .ldcc-chat-list-resize-handle:hover{
        background:var(--ldcc-primary);
        opacity:0.7;
      }
      .ldcc-chat-list-resize-handle::after{
        content:'';
        position:absolute;
        left:50%;
        top:50%;
        transform:translate(-50%, -50%);
        width:2px;
        height:20px;
        background:var(--ldcc-primary);
        border-radius:1px;
        opacity:0.8;
      }
      .ldcc-chat-list.resizing{
        user-select:none;
      }
      .ldcc-chat-list.resizing *{
        user-select:none;
        pointer-events:none;
      }

      /* 对话项 - TG风格优化 */
      .ldcc-chat-item{
        display:flex;
        padding:16px 18px;
        border-bottom:1px solid rgba(0,0,0,0.06);
        cursor:pointer;
        transition:all 0.3s ease;
        position:relative;
        background:linear-gradient(180deg, #ffffff 0%, #fafbfc 100%);
        margin:2px 8px;
        border-radius:12px;
        margin-bottom:8px;
        box-shadow:0 2px 8px rgba(0,0,0,0.04);
        border:1px solid rgba(0,0,0,0.06);
      }
      .ldcc-chat-item:hover{
        background:linear-gradient(180deg, #f8fafd 0%, #ffffff 100%);
        transform:translateX(4px);
        box-shadow:0 4px 16px rgba(0,0,0,0.08);
        border-color:rgba(43,92,230,0.2);
      }
      .ldcc-chat-item.active{
        background:linear-gradient(180deg, #e8f4ff 0%, #f0f8ff 100%);
        border-left:4px solid #2b5ce6;
        box-shadow:0 4px 20px rgba(43,92,230,0.15);
        border-color:rgba(43,92,230,0.3);
      }

      /* 未读消息提示 - TG风格优化 */
      .ldcc-chat-item.unread{
        background:linear-gradient(180deg, #e8f4ff 0%, #f0f8ff 100%);
        border-color:rgba(43,92,230,0.2);
        box-shadow:0 4px 16px rgba(43,92,230,0.1);
      }
      .ldcc-chat-item.unread::after{
        content:'';
        position:absolute;
        top:16px;
        right:16px;
        width:10px;
        height:10px;
        background:linear-gradient(135deg, #ff4757 0%, #ff3838 100%);
        border-radius:50%;
        box-shadow:0 3px 8px rgba(255,71,87,0.4), inset 0 1px 0 rgba(255,255,255,0.3);
        animation:ldcc-unread-pulse 2s ease-in-out infinite;
      }
      @keyframes ldcc-unread-pulse{
        0%, 100%{transform:scale(1); opacity:1;}
        50%{transform:scale(1.1); opacity:0.8;}
      }

      /* 对话头像 - TG风格动画 */
      .ldcc-chat-avatar{
        width:48px;
        height:48px;
        border-radius:50%;
        margin-right:14px;
        flex-shrink:0;
        border:2px solid rgba(0,0,0,0.08);
        background:linear-gradient(135deg, #f8fafd 0%, #ffffff 100%);
        display:flex;
        align-items:center;
        justify-content:center;
        font-size:20px;
        color:var(--ldcc-text-secondary);
        overflow:hidden;
        box-shadow:0 4px 12px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.8);
        transition:all 0.3s ease;
      }
      .ldcc-chat-avatar:hover{
        transform:scale(1.05);
        box-shadow:0 6px 16px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.9);
      }
      .ldcc-chat-avatar img{
        width:100%;
        height:100%;
        object-fit:cover;
        border-radius:50%;
        transition:transform 0.3s ease;
      }
      .ldcc-chat-avatar:hover img{
        transform:scale(1.1);
      }

      /* 对话内容 */
      .ldcc-chat-content{
        flex:1;
        min-width:0;
        overflow:hidden;
        padding-right:8px;
      }

      /* 打开原帖子按钮 - TG风格动画 */
      .ldcc-open-post-btn{
        position:absolute;
        top:45px;
        right:16px;
        width:28px;
        height:28px;
        background:linear-gradient(135deg, #2b5ce6 0%, #1e3c72 100%);
        color:white;
        border:none;
        border-radius:50%;
        cursor:pointer;
        display:flex;
        align-items:center;
        justify-content:center;
        font-size:13px;
        opacity:0.9;
        transition:all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        z-index:10;
        text-decoration:none;
        line-height:1;
        box-shadow:0 3px 12px rgba(43,92,230,0.3), inset 0 1px 0 rgba(255,255,255,0.2);
      }
      .ldcc-open-post-btn:hover{
        opacity:1;
        transform:scale(1.15) translateY(-2px);
        box-shadow:0 6px 20px rgba(43,92,230,0.4), inset 0 1px 0 rgba(255,255,255,0.3);
      }
      .ldcc-open-post-btn:active{
        transform:scale(1.05) translateY(-1px);
      }

      .ldcc-chat-title{
        font-size:14px;
        font-weight:600;
        color:var(--ldcc-text-primary);
        margin-bottom:6px;
        line-height:1.4;
        display:-webkit-box;
        -webkit-line-clamp:2;
        -webkit-box-orient:vertical;
        overflow:hidden;
        word-break:break-word;
        transition:color 0.3s ease;
      }
      .ldcc-chat-item:hover .ldcc-chat-title{
        color:#2b5ce6;
      }
      .ldcc-chat-item.active .ldcc-chat-title{
        color:#1e3c72;
        font-weight:700;
      }

      .ldcc-chat-preview{
        display:none; /* 隐藏预览，只显示标题 */
      }

      .ldcc-chat-time{
        font-size:11px;
        color:var(--ldcc-timestamp-color);
        position:absolute;
        top:47px;
        right:44px;
        background:rgba(255,255,255,0.9);
        padding:2px 6px;
        border-radius:10px;
      }

      /* 右侧聊天窗口 */
      #ldcc-chat-window{
        flex:1;
        display:flex;
        flex-direction:column;
        background:var(--ldcc-bg-dark);
      }

      /* 聊天头部 - TG风格优化 */
      #ldcc-chat-header{
        background:linear-gradient(180deg, #f8fafd 0%, #ffffff 50%, #f8fafd 100%);
        padding:16px 20px;
        border-bottom:1px solid rgba(0,0,0,0.08);
        display:flex;
        justify-content:space-between;
        align-items:center;
        cursor:move;
        user-select:none;
        box-shadow:0 4px 16px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8);
        backdrop-filter:blur(10px);
      }

      #ldcc-chat-title{
        font-size:16px;
        font-weight:600;
        color:var(--ldcc-text-primary);
        display:flex;
        align-items:center;
        gap:10px;
      }

      #ldcc-chat-actions{
        display:flex;
        gap:12px;
      }
      #ldcc-chat-refresh-btn,#ldcc-chat-close-btn,#ldcc-chat-open-btn{
        cursor:pointer;
        user-select:none;
        font-size:16px;
        color:var(--ldcc-text-secondary);
        transition:color 0.2s;
        padding:4px;
        border-radius:4px;
      }
      #ldcc-chat-refresh-btn:hover,#ldcc-chat-close-btn:hover,#ldcc-chat-open-btn:hover{
        color:var(--ldcc-primary);
        background:rgba(0,136,204,0.1);
      }

      /* 消息区域 - TG风格优化 */
      #ldcc-messages-container{
        flex:1;
        overflow-y:auto;
        padding:20px;
        background:linear-gradient(180deg, #f8fafd 0%, #ffffff 50%, #f8fafd 100%);
        display:flex;
        flex-direction:column;
        gap:16px;
        background-image:
          radial-gradient(circle at 20% 80%, rgba(43,92,230,0.03) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(43,92,230,0.03) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(43,92,230,0.02) 0%, transparent 50%);
      }

      /* 消息气泡 - TG风格优化 */
      .ldcc-message{
        display:flex;
        flex-direction:column;
        margin-bottom:16px;
        animation:ldcc-messageSlide 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        transition:all 0.3s ease;
      }
      .ldcc-message:hover{
        transform:translateY(-1px);
      }
      @keyframes ldcc-messageSlide{
        from{opacity:0;transform:translateY(20px) scale(0.95);}
        to{opacity:1;transform:translateY(0) scale(1);}
      }

      .ldcc-message-header{
        display:flex;
        align-items:center;
        gap:12px;
        margin-bottom:8px;
      }

      .ldcc-message-avatar{
        width:36px;
        height:36px;
        border-radius:50%;
        flex-shrink:0;
        border:2px solid var(--ldcc-border);
        background:var(--ldcc-bg-light);
        display:flex;
        align-items:center;
        justify-content:center;
        font-size:14px;
        color:var(--ldcc-text-secondary);
      }

      .ldcc-message-author-info{
        flex:1;
        display:flex;
        justify-content:space-between;
        align-items:center;
      }

      .ldcc-message-number{
        background:var(--ldcc-bg-light);
        color:var(--ldcc-text-secondary);
        font-size:11px;
        font-weight:600;
        padding:2px 6px;
        border-radius:4px;
        border:1px solid var(--ldcc-border);
      }

      .ldcc-message-content{
        max-width:70%;
        flex:1;
        min-width:0;
        overflow:hidden;
      }

      .ldcc-message-bubble{
        background:linear-gradient(135deg, #ffffff 0%, #fafbfc 100%);
        border-radius:18px;
        padding:14px 18px;
        box-shadow:0 3px 12px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.1);
        position:relative;
        word-wrap:break-word;
        line-height:1.5;
        max-width:100%;
        overflow:hidden;
        min-width:0;
        border:1px solid rgba(0,0,0,0.06);
        transition:all 0.3s ease;
      }
      .ldcc-message-bubble:hover{
        box-shadow:0 6px 20px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.15);
        transform:translateY(-1px);
      }

      .ldcc-message-bubble::before{
        content:'';
        position:absolute;
        top:12px;
        left:-10px;
        width:0;
        height:0;
        border-style:solid;
        border-width:0 10px 10px 0;
        border-color:transparent #ffffff transparent transparent;
        filter:drop-shadow(-2px 0 2px rgba(0,0,0,0.05));
      }

      .ldcc-message-header{
        display:flex;
        justify-content:space-between;
        align-items:center;
        margin-bottom:6px;
        font-size:12px;
        color:var(--ldcc-text-secondary);
      }

      .ldcc-message-author{
        font-weight:600;
        color:var(--ldcc-text-primary);
      }

      .ldcc-message-time{
        color:var(--ldcc-timestamp-color);
        background:rgba(0,0,0,0.05);
        padding:2px 6px;
        border-radius:10px;
      }

      .ldcc-message-text{
        color:var(--ldcc-text-primary);
        font-size:14px;
        line-height:1.5;
        word-wrap:break-word;
        overflow-wrap:break-word;
        max-width:100%;
        overflow:hidden;
      }
      .ldcc-message-text img{
        max-width:100%;
        height:auto;
        display:block;
        margin:8px 0;
      }
      .ldcc-message-text pre{
        background:#f8f9fa;
        border:1px solid #e9ecef;
        border-radius:4px;
        padding:12px;
        overflow-x:auto;
        max-width:100%;
        font-size:13px;
        line-height:1.4;
        white-space:pre-wrap;
        word-wrap:break-word;
      }
      .ldcc-message-text code{
        background:#f1f3f4;
        padding:2px 4px;
        border-radius:3px;
        font-size:13px;
        max-width:100%;
        word-wrap:break-word;
      }
      .ldcc-message-text blockquote{
        border-left:4px solid var(--ldcc-primary);
        margin:12px 0;
        padding:8px 12px;
        background:rgba(0,136,204,0.05);
        max-width:100%;
        word-wrap:break-word;
      }
      .ldcc-message-text table{
        max-width:100%;
        border-collapse:collapse;
        margin:8px 0;
        font-size:13px;
      }
      .ldcc-message-text table td,
      .ldcc-message-text table th{
        border:1px solid var(--ldcc-border);
        padding:6px 8px;
        word-wrap:break-word;
        max-width:150px;
      }
      .ldcc-message-text iframe{
        max-width:100%;
        height:auto;
        border:none;
      }
      .ldcc-message-text div,
      .ldcc-message-text p{
        max-width:100%;
        word-wrap:break-word;
        overflow-wrap:break-word;
        margin:8px 0;
      }
      .ldcc-message-text a{
        color:var(--ldcc-primary);
        text-decoration:none;
        word-wrap:break-word;
        max-width:100%;
        display:inline-block;
      }
      .ldcc-message-text a:hover{
        text-decoration:underline;
      }
      .ldcc-message-text * {
        max-width:100% !important;
        box-sizing:border-box;
      }
      .ldcc-message-text [style*="width"] {
        max-width:100% !important;
        width:auto !important;
      }
      .ldcc-message-text [style*="overflow"] {
        overflow:hidden !important;
      }

      /* 自己的消息 - TG风格优化 */
      .ldcc-message.own{
        flex-direction:row-reverse;
      }
      .ldcc-message.own .ldcc-message-avatar{
        margin-right:0;
        margin-left:12px;
      }
      .ldcc-message.own .ldcc-message-bubble{
        background:linear-gradient(135deg, #dcf8c6 0%, #d4eed8 100%);
        border-color:rgba(76,175,80,0.2);
        box-shadow:0 3px 12px rgba(76,175,80,0.15), 0 1px 3px rgba(76,175,80,0.2);
      }
      .ldcc-message.own .ldcc-message-bubble:hover{
        box-shadow:0 6px 20px rgba(76,175,80,0.2), 0 2px 6px rgba(76,175,80,0.25);
      }
      .ldcc-message.own .ldcc-message-bubble::before{
        left:auto;
        right:-10px;
        border-width:0 0 10px 10px;
        border-color:transparent transparent transparent #dcf8c6;
        filter:drop-shadow(2px 0 2px rgba(76,175,80,0.1));
      }

      /* 输入区域 - TG风格优化 */
      #ldcc-input-area{
        background:linear-gradient(180deg, #ffffff 0%, #f8fafd 100%);
        border-top:1px solid rgba(0,0,0,0.08);
        padding:20px;
        box-shadow:0 -4px 20px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8);
        backdrop-filter:blur(10px);
      }

      #ldcc-message-input{
        width:100%;
        background:linear-gradient(180deg, #ffffff 0%, #fafbfc 100%);
        border:1px solid rgba(0,0,0,0.08);
        border-radius:20px;
        padding:16px 20px;
        font-size:14px;
        font-family:inherit;
        resize:none;
        min-height:50px;
        max-height:120px;
        outline:none;
        transition:all 0.3s ease;
        box-shadow:inset 0 2px 4px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.04);
      }
      #ldcc-message-input:focus{
        border-color:rgba(43,92,230,0.4);
        box-shadow:inset 0 2px 4px rgba(0,0,0,0.04), 0 0 0 3px rgba(43,92,230,0.1), 0 4px 12px rgba(43,92,230,0.15);
        transform:translateY(-1px);
      }

      #ldcc-send-btn{
        background:linear-gradient(135deg, #2b5ce6 0%, #1e3c72 100%);
        color:white;
        border:none;
        border-radius:20px;
        padding:14px 24px;
        font-size:14px;
        font-weight:600;
        cursor:pointer;
        margin-top:12px;
        transition:all 0.3s ease;
        box-shadow:0 4px 16px rgba(43,92,230,0.3), inset 0 1px 0 rgba(255,255,255,0.2);
        text-shadow:0 1px 2px rgba(0,0,0,0.2);
        letter-spacing:0.3px;
      }
      #ldcc-send-btn:hover{
        background:linear-gradient(135deg, #3d6fe8 0%, #2b4a82 100%);
        transform:translateY(-2px);
        box-shadow:0 6px 20px rgba(43,92,230,0.4), inset 0 1px 0 rgba(255,255,255,0.3);
      }
      #ldcc-send-btn:active{
        transform:translateY(0);
      }
      #ldcc-send-btn:disabled{opacity:0.5;cursor:not-allowed;transform:none;box-shadow:0 2px 8px rgba(43,92,230,0.2);}

      /* 空状态 */
      .ldcc-empty-state{
        text-align:center;
        padding:60px 20px;
        color:var(--ldcc-text-secondary);
      }
      .ldcc-empty-icon{
        font-size:48px;
        margin-bottom:16px;
        opacity:0.5;
      }
      .ldcc-empty-text{
        font-size:16px;
        margin-bottom:8px;
      }
      .ldcc-empty-hint{
        font-size:14px;
        color:var(--ldcc-text-muted);
      }

      /* 时间显示 */
      #ldcc-current-time{
        font-size:11px;
        opacity:0.8;
        font-weight:400;
        background:rgba(255,255,255,0.2);
        padding:2px 6px;
        border-radius:3px;
      }

      /* 浮动按钮 */
      #ldcc-floating-btn{
        position:fixed;
        right:24px;
        bottom:24px;
        width:64px;
        height:64px;
        border-radius:50%;
        background:var(--ldcc-primary);
        border:none;
        box-shadow:0 6px 20px rgba(0,136,204,0.3);
        display:flex;
        align-items:center;
        justify-content:center;
        z-index:2147483601;
        opacity:1; /* 默认显示 */
        transition:all 0.3s ease;
        cursor:pointer;
        font-size:24px;
        color:white;
      }
      #ldcc-floating-btn.hidden{opacity:0;}
      #ldcc-floating-btn:hover{
        background:var(--ldcc-primary-dark);
        transform:scale(1.1);
        box-shadow:0 8px 28px rgba(0,136,204,0.4);
      }
      #ldcc-floating-btn.visible{
        animation:ldcc-float-bounce 2s ease-in-out infinite;
      }
      @keyframes ldcc-float-bounce{
        0%, 20%, 50%, 80%, 100%{transform:translateY(0);}
        40%{transform:translateY(-10px);}
        60%{transform:translateY(-5px);}
      }
      #ldcc-floating-btn.visible::after{
        content:attr(data-badge);
        position:absolute;
        top:-8px;
        right:-8px;
        background:#ff3b30;
        color:white;
        font-size:11px;
        padding:3px 6px;
        border-radius:10px;
        font-weight:bold;
        min-width:18px;
        text-align:center;
        line-height:1;
        animation:ldcc-pulse 1.5s ease-in-out infinite;
        display:none;
      }
      #ldcc-floating-btn.visible.has-notification::after{
        display:block;
      }
      #ldcc-floating-btn.visible.has-single::after{
        content:'!';
        padding:3px 5px;
      }
      @keyframes ldcc-pulse{
        0%{transform:scale(1); opacity:1;}
        50%{transform:scale(1.1); opacity:0.8;}
        100%{transform:scale(1); opacity:1;}
      }

      /* 滚动条样式 - TG风格优化 */
      ::-webkit-scrollbar {
        width:8px;
      }
      ::-webkit-scrollbar-track {
        background:rgba(0,0,0,0.02);
        border-radius:4px;
      }
      ::-webkit-scrollbar-thumb {
        background:linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.1) 100%);
        border-radius:4px;
        border:1px solid rgba(0,0,0,0.05);
        transition:all 0.3s ease;
      }
      ::-webkit-scrollbar-thumb:hover {
        background:linear-gradient(180deg, rgba(43,92,230,0.4) 0%, rgba(43,92,230,0.2) 100%);
        border-color:rgba(43,92,230,0.2);
      }
      ::-webkit-scrollbar-thumb:active {
        background:linear-gradient(180deg, rgba(43,92,230,0.5) 0%, rgba(43,92,230,0.3) 100%);
      }

      /* 额外的TG风格动画效果 */
      .ldcc-fade-in {
        animation:ldcc-fadeIn 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      }
      @keyframes ldcc-fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .ldcc-slide-in-right {
        animation:ldcc-slideInRight 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      }
      @keyframes ldcc-slideInRight {
        from { opacity: 0; transform: translateX(20px); }
        to { opacity: 1; transform: translateX(0); }
      }

      .ldcc-bounce-in {
        animation:ldcc-bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
      }
      @keyframes ldcc-bounceIn {
        0% { opacity: 0; transform: scale(0.3); }
        50% { opacity: 1; transform: scale(1.05); }
        70% { transform: scale(0.95); }
        100% { opacity: 1; transform: scale(1); }
      }

      /* 加载动画 */
      .ldcc-loading {
        display: inline-block;
        width: 20px;
        height: 20px;
        border: 2px solid rgba(43,92,230,0.3);
        border-radius: 50%;
        border-top-color: #2b5ce6;
        animation: ldcc-spin 1s ease-in-out infinite;
      }
      @keyframes ldcc-spin {
        to { transform: rotate(360deg); }
      }

      /* 消息输入时的打字指示器 */
      .ldcc-typing-indicator {
        display: flex;
        align-items: center;
        padding: 12px 16px;
        background: linear-gradient(135deg, #f8fafd 0%, #ffffff 100%);
        border-radius: 16px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        margin-bottom: 8px;
        max-width: 80px;
      }
      .ldcc-typing-indicator span {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #2b5ce6;
        margin: 0 2px;
        animation: ldcc-typing 1.4s ease-in-out infinite;
      }
      .ldcc-typing-indicator span:nth-child(1) { animation-delay: 0s; }
      .ldcc-typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
      .ldcc-typing-indicator span:nth-child(3) { animation-delay: 0.4s; }
      @keyframes ldcc-typing {
        0%, 60%, 100% { transform: translateY(0); opacity: 0.7; }
        30% { transform: translateY(-10px); opacity: 1; }
      }

      /* 自定义页面整体布局 - TG风格优化 - 窄顶部全屏展示 */
      body.ldcc-mynew-page{
        margin:0;
        padding:0;
        background:linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
        color:var(--ldcc-text-primary);
        height:100vh;
        overflow:hidden;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      }
      body.ldcc-mynew-page .ldcc-mynew-shell{
        display:flex;
        flex-direction:column;
        height:100vh;
        background:linear-gradient(180deg, #1e3c72 0%, #2a5298 100%);
      }
      body.ldcc-mynew-page .ldcc-mynew-header{
        background:linear-gradient(180deg, #2b5ce6 0%, #1e3c72 50%, #0f2347 100%);
        color:#fff;
        padding:12px 32px;
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:24px;
        box-shadow:0 4px 16px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.1);
        z-index:10;
        border-bottom:1px solid rgba(255,255,255,0.1);
        backdrop-filter:blur(10px);
        min-height:60px;
        flex-shrink:0;
      }
      body.ldcc-mynew-page .ldcc-mynew-logo{
        display:flex;
        align-items:center;
        gap:12px;
        font-size:18px;
        font-weight:800;
        letter-spacing:0.5px;
        text-shadow:0 2px 4px rgba(0,0,0,0.3);
      }
      body.ldcc-mynew-page .ldcc-mynew-logo span.icon{
        font-size:24px;
        filter:drop-shadow(0 2px 4px rgba(0,0,0,0.3));
        animation:ldcc-logo-glow 3s ease-in-out infinite;
      }
      @keyframes ldcc-logo-glow{
        0%, 100%{filter:drop-shadow(0 2px 4px rgba(0,0,0,0.3)) brightness(1);}
        50%{filter:drop-shadow(0 4px 8px rgba(43,92,230,0.6)) brightness(1.2);}
      }
      body.ldcc-mynew-page .ldcc-mynew-stats{
        display:flex;
        gap:16px;
        flex-wrap:wrap;
        align-items:center;
      }
      body.ldcc-mynew-page .ldcc-mynew-stat{
        background:linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%);
        padding:8px 12px;
        border-radius:12px;
        font-size:12px;
        display:flex;
        align-items:center;
        gap:6px;
        border:1px solid rgba(255,255,255,0.2);
        box-shadow:0 2px 8px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.3);
        backdrop-filter:blur(10px);
        transition:all 0.3s ease;
      }
      body.ldcc-mynew-page .ldcc-mynew-stat:hover{
        transform:translateY(-1px);
        box-shadow:0 4px 12px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.4);
        background:linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.15) 100%);
      }
      body.ldcc-mynew-page .ldcc-mynew-stat .label{
        opacity:0.9;
        font-size:11px;
        font-weight:500;
        text-transform:uppercase;
        letter-spacing:0.3px;
      }
      body.ldcc-mynew-page .ldcc-mynew-stat .value{
        font-size:16px;
        font-weight:700;
        text-shadow:0 1px 2px rgba(0,0,0,0.3);
      }
      body.ldcc-mynew-page .ldcc-mynew-actions{
        display:flex;
        align-items:center;
        gap:8px;
      }
      body.ldcc-mynew-page .ldcc-mynew-actions button{
        border:none;
        border-radius:999px;
        padding:8px 12px;
        font-size:12px;
        font-weight:600;
        cursor:pointer;
        background:linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.15) 100%);
        color:#fff;
        transition:all 0.3s ease;
        border:1px solid rgba(255,255,255,0.2);
        box-shadow:0 2px 8px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.3);
        text-shadow:0 1px 2px rgba(0,0,0,0.3);
        letter-spacing:0.2px;
      }
      body.ldcc-mynew-page .ldcc-mynew-actions button:hover{
        background:linear-gradient(135deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.25) 100%);
        transform:translateY(-1px);
        box-shadow:0 4px 12px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.4);
      }
      body.ldcc-mynew-page .ldcc-mynew-actions button:active{
        transform:translateY(0);
      }
      body.ldcc-mynew-page .ldcc-mynew-settings{
        display:flex;
        flex-direction:column;
        gap:6px;
        min-width:200px;
      }
      body.ldcc-mynew-page .ldcc-mynew-settings label{
        font-size:12px;
        font-weight:600;
        color:rgba(255,255,255,0.9);
        letter-spacing:0.5px;
        text-transform:uppercase;
      }
      body.ldcc-mynew-page .ldcc-mynew-slider{
        display:flex;
        align-items:center;
        gap:12px;
        padding:6px 12px;
        border-radius:999px;
        background:rgba(0,0,0,0.15);
        border:1px solid rgba(255,255,255,0.2);
        box-shadow:inset 0 1px 0 rgba(255,255,255,0.25);
      }
      body.ldcc-mynew-page .ldcc-mynew-slider input[type="range"]{
        flex:1;
        accent-color:#ffffff;
      }
      body.ldcc-mynew-page .ldcc-mynew-slider span{
        width:48px;
        text-align:right;
        font-weight:700;
        color:#ffffff;
        text-shadow:0 1px 2px rgba(0,0,0,0.3);
      }

            body.ldcc-mynew-page .ldcc-chat-toggle{
        display:none;
        justify-content:center;
        align-items:center;
        width:36px;
        height:36px;
        border-radius:50%;
        font-size:18px;
        background:linear-gradient(135deg, #ffffff 0%, #f0f4ff 100%);
        color:#2b5ce6;
        box-shadow:0 4px 12px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.8);
        border:1px solid rgba(255,255,255,0.3);
      }
      body.ldcc-mynew-page .ldcc-mynew-main{
        flex:1;
        padding:12px;
        display:flex;
        overflow:hidden;
        background:rgba(255,255,255,0.02);
      }
      body.ldcc-mynew-page #ldcc-assistant-container{
        position:relative;
        right:auto;
        bottom:auto;
        width:100%;
        height:100%;
        border-radius:16px;
        box-shadow:0 12px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1);
        border:1px solid rgba(255,255,255,0.1);
        backdrop-filter:blur(20px);
        background:rgba(255,255,255,0.98);
        overflow:hidden;
      }
      body.ldcc-mynew-page .ldcc-resize-handle{display:none;}
      body.ldcc-mynew-page #ldcc-main-header{
        cursor:default;
        background:linear-gradient(180deg, #53a9ff 0%, #0077cc 100%);
        box-shadow:0 2px 12px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.2);
        padding:12px 16px;
      }
      body.ldcc-mynew-page #ldcc-minimize-btn{display:none;}
      body.ldcc-mynew-page #ldcc-floating-btn{display:none!important;}
      body.ldcc-mynew-page #ldcc-main-panel{height:100%;}
      body.ldcc-mynew-page #ldcc-chat-list{
        width:420px;
        min-width:380px;
        background:linear-gradient(180deg, #f8fafd 0%, #ffffff 100%);
        border-right:1px solid rgba(0,0,0,0.06);
      }
      body.ldcc-mynew-page #ldcc-chat-window{
        flex:1;
        background:linear-gradient(180deg, #ffffff 0%, #f8fafd 100%);
        min-width:0; /* 防止flex溢出 */
      }

      @media (max-width: 1200px){
        body.ldcc-mynew-page #ldcc-chat-list{
          width:380px;
          min-width:340px;
        }
      }

      @media (max-width: 1024px){
        body.ldcc-mynew-page .ldcc-mynew-header{
          padding:10px 20px;
          gap:16px;
        }
        body.ldcc-mynew-page .ldcc-mynew-logo{
          font-size:16px;
        }
        body.ldcc-mynew-page .ldcc-mynew-logo span.icon{
          font-size:20px;
        }
        body.ldcc-mynew-page .ldcc-mynew-stats{
          gap:12px;
        }
        body.ldcc-mynew-page .ldcc-mynew-stat{
          padding:6px 10px;
          font-size:11px;
        }
        body.ldcc-mynew-page .ldcc-mynew-stat .value{
          font-size:14px;
        }
        body.ldcc-mynew-page .ldcc-mynew-actions button{
          padding:6px 10px;
          font-size:11px;
        }
        body.ldcc-mynew-page .ldcc-mynew-main{
          padding:8px;
        }
        body.ldcc-mynew-page #ldcc-chat-list{
          width:340px;
          min-width:300px;
        }
      }

      @media (max-width: 768px){
        body.ldcc-mynew-page .ldcc-mynew-header{
          padding:8px 16px;
          gap:12px;
          min-height:50px;
        }
        body.ldcc-mynew-page .ldcc-mynew-settings{
          width:100%;
        }
        body.ldcc-mynew-page .ldcc-mynew-main{
          padding:4px;
        }
        body.ldcc-mynew-page .ldcc-mynew-actions .ldcc-chat-toggle{
          display:flex;
          width:32px;
          height:32px;
          font-size:16px;
        }
        body.ldcc-mynew-page #ldcc-main-panel{
          position:relative;
        }
        body.ldcc-mynew-page #ldcc-chat-list{
          position:absolute;
          left:-100%;
          top:0;
          bottom:0;
          width:85%;
          max-width:300px;
          background:var(--ldcc-bg-dark);
          box-shadow:12px 0 24px rgba(0,0,0,0.15);
          transition:left 0.25s ease;
          z-index:20;
        }
        body.ldcc-mynew-page #ldcc-chat-list.show{
          left:0;
        }
        body.ldcc-mynew-page #ldcc-chat-window{
          width:100%;
        }
      }
    `);

    // ---------- DOM Structure ----------
    const ldccAssistantContainer=document.createElement('div');
    ldccAssistantContainer.id='ldcc-assistant-container';
    // 默认隐藏，避免闪现
    ldccAssistantContainer.style.display = 'none';
    ldccAssistantContainer.innerHTML=`
      <!-- 8方向调整大小手柄 -->
      <div class="ldcc-resize-handle n"></div>
      <div class="ldcc-resize-handle s"></div>
      <div class="ldcc-resize-handle e"></div>
      <div class="ldcc-resize-handle w"></div>
      <div class="ldcc-resize-handle ne"></div>
      <div class="ldcc-resize-handle nw"></div>
      <div class="ldcc-resize-handle se"></div>
      <div class="ldcc-resize-handle sw"></div>

      <!-- TG风格头部 -->
      <div id="ldcc-main-header">
        <div>💬 Linux.do 论坛助手 CC版</div>
        <div id="ldcc-header-actions">
          <span id="ldcc-current-time">--:--</span>
          <span id="ldcc-hub-btn" title="打开聊天中心">🏠</span>
          <span id="ldcc-refresh-btn" title="刷新列表">🔄</span>
          <span id="ldcc-minimize-btn" title="最小化到浮动图标">🗕</span>
        </div>
      </div>

      <!-- TG聊天主体 -->
      <div id="ldcc-main-panel">
        <!-- 左侧对话列表 -->
        <div id="ldcc-chat-list">
          <div class="ldcc-chat-list-resize-handle"></div>
          <div style="padding:16px;text-align:center;color:var(--ldcc-text-secondary);">
            <div style="font-size:32px;margin-bottom:8px;">💬</div>
            <div>正在加载对话...</div>
          </div>
        </div>

        <!-- 右侧聊天窗口 -->
        <div id="ldcc-chat-window">
          <div id="ldcc-chat-header">
            <div id="ldcc-chat-title">
              <span>选择一个对话开始聊天</span>
            </div>
            <div id="ldcc-chat-actions">
              <span id="ldcc-chat-open-btn" title="打开原帖子">🔗</span>
              <span id="ldcc-chat-refresh-btn" title="刷新消息">🔄</span>
              <span id="ldcc-chat-close-btn" title="关闭对话">✕</span>
            </div>
          </div>
          <div id="ldcc-messages-container">
            <div class="ldcc-empty-state">
              <div class="ldcc-empty-icon">💭</div>
              <div class="ldcc-empty-text">选择一个对话开始聊天</div>
              <div class="ldcc-empty-hint">从左侧列表中选择一个帖子</div>
            </div>
          </div>
          <div id="ldcc-input-area">
            <textarea id="ldcc-message-input" rows="2" placeholder="输入消息... (Enter发送，Shift+Enter换行)"></textarea>
            <button id="ldcc-send-btn">发送</button>
          </div>
        </div>
      </div>
    `;
    let ldccMyNewUI = null;
    if (isCustomPage) {
      ldccMyNewUI = setupLdccMyNewShell(ldccAssistantContainer);
    } else {
      document.body.appendChild(ldccAssistantContainer);
    }

    let ldccFloatingBtn=null;
    if (!isCustomPage) {
      ldccFloatingBtn=document.createElement('div');
      ldccFloatingBtn.id='ldcc-floating-btn';
      ldccFloatingBtn.innerHTML='💬';
      ldccFloatingBtn.title='点击打开 Linux.do 论坛助手';
      document.body.appendChild(ldccFloatingBtn);
    }

    // ---------- Element References ----------
    const ldccChatList=ldccAssistantContainer.querySelector('#ldcc-chat-list'),
          ldccChatWindow=ldccAssistantContainer.querySelector('#ldcc-chat-window'),
          ldccChatTitle=ldccAssistantContainer.querySelector('#ldcc-chat-title'),
          ldccMessagesContainer=ldccAssistantContainer.querySelector('#ldcc-messages-container'),
          ldccMessageInput=ldccAssistantContainer.querySelector('#ldcc-message-input'),
          ldccSendBtn=ldccAssistantContainer.querySelector('#ldcc-send-btn'),
          ldccChatRefreshBtn=ldccAssistantContainer.querySelector('#ldcc-chat-refresh-btn'),
          ldccChatCloseBtn=ldccAssistantContainer.querySelector('#ldcc-chat-close-btn'),
          ldccChatOpenBtn=ldccAssistantContainer.querySelector('#ldcc-chat-open-btn'),
          ldccMinimizeBtn=ldccAssistantContainer.querySelector('#ldcc-minimize-btn'),
          ldccRefreshBtn=ldccAssistantContainer.querySelector('#ldcc-refresh-btn'),
          ldccHubBtn=ldccAssistantContainer.querySelector('#ldcc-hub-btn'),
          ldccCurrentTimeEl=ldccAssistantContainer.querySelector('#ldcc-current-time'),
          ldccChatListResizeHandle=ldccAssistantContainer.querySelector('.ldcc-chat-list-resize-handle');

    if (ldccMyNewUI?.toggleBtn && ldccChatList) {
      ldccMyNewUI.toggleBtn.addEventListener('click', ()=>{
        ldccChatList.classList.toggle('show');
      });
    }
    if (ldccMyNewUI?.refreshBtn) {
      ldccMyNewUI.refreshBtn.addEventListener('click', ()=>pollLdccChatList(true));
    }
    if (ldccMyNewUI?.backBtn) {
      ldccMyNewUI.backBtn.addEventListener('click', ()=>{
        window.location.href='/';
      });
    }
    if (ldccMyNewUI?.pollInput && ldccMyNewUI?.pollValue) {
      const clampPollValue=(value)=>{
        if (typeof value!=='number' || Number.isNaN(value)) return LDCC_CONFIG.poll;
        return Math.min(LDCC_POLL_LIMITS.max, Math.max(LDCC_POLL_LIMITS.min, value));
      };
      const syncPollDisplay=(value)=>{
        ldccMyNewUI.pollValue.textContent = `${Math.round(value/1000)}秒`;
      };
      const initialValue=clampPollValue(LDCC_CONFIG.poll);
      ldccMyNewUI.pollInput.value=String(initialValue);
      syncPollDisplay(initialValue);
      ldccMyNewUI.pollInput.addEventListener('input', (e)=>{
        const nextValue=clampPollValue(Number(e.target.value));
        syncPollDisplay(nextValue);
      });
      ldccMyNewUI.pollInput.addEventListener('change', (e)=>{
        const nextValue=clampPollValue(Number(e.target.value));
        e.target.value=String(nextValue);
        syncPollDisplay(nextValue);
        ldccApplyPollInterval(nextValue);
      });
    }

    // ---------- Left Sidebar Resize Function ----------
    let isResizingChatList = false;
    let chatListStartX = 0;
    let chatListStartWidth = 0;

    if (ldccChatListResizeHandle) {
      ldccChatListResizeHandle.addEventListener('mousedown', (e) => {
          isResizingChatList = true;
          chatListStartX = e.clientX;
          chatListStartWidth = ldccChatList.offsetWidth;
          ldccChatList.classList.add('resizing');
          document.body.style.cursor = 'col-resize';
          document.body.style.userSelect = 'none';
          e.preventDefault();
          e.stopPropagation();
      });
    }

    // ---------- Drag and Resize Functions ----------
    let isDragging = false, isResizing = false;
    let dragOffset = {x: 0, y: 0};
    let initialSize = {width: 0, height: 0};
    let initialPos = {x: 0, y: 0};
    let currentResizeHandle = null;
    let isDraggingChatHeader = false;
    let chatHeaderDragOffset = {x: 0, y: 0};

    // 恢复保存的位置和大小
    function restoreLdccWindowState() {
        if (isCustomPage) return;
        const saved = GM_getValue('ldcc_assistant_position', null);
        if (saved) {
            ldccAssistantContainer.style.right = 'auto';
            ldccAssistantContainer.style.bottom = 'auto';
            ldccAssistantContainer.style.left = saved.x + 'px';
            ldccAssistantContainer.style.top = saved.y + 'px';
        }

        const savedSize = GM_getValue('ldcc_assistant_size', null);
        if (savedSize) {
            ldccAssistantContainer.style.width = savedSize.width + 'px';
            ldccAssistantContainer.style.height = savedSize.height + 'px';
        }

        // 恢复左侧列表宽度
        const savedChatListWidth = GM_getValue('ldcc_chat_list_width', null);
        if (savedChatListWidth) {
            ldccChatList.style.width = savedChatListWidth + 'px';
        }
    }

    // 保存位置和大小
    function saveLdccWindowState() {
        if (isCustomPage) return;
        const rect = ldccAssistantContainer.getBoundingClientRect();
        GM_setValue('ldcc_assistant_position', {x: rect.left, y: rect.top});
        GM_setValue('ldcc_assistant_size', {width: rect.width, height: rect.height});
        GM_setValue('ldcc_chat_list_width', ldccChatList.offsetWidth);
    }

    // 主面板拖动功能
    const ldccMainHeader = ldccAssistantContainer.querySelector('#ldcc-main-header');
    const ldccChatHeader = ldccAssistantContainer.querySelector('#ldcc-chat-header');
    const ldccResizeHandles = ldccAssistantContainer.querySelectorAll('.ldcc-resize-handle');

    if (!isCustomPage) {
        ldccMainHeader.addEventListener('mousedown', (e) => {
            if (e.target.closest('#ldcc-header-actions')) return;

            isDragging = true;
            ldccAssistantContainer.classList.add('dragging');
            const rect = ldccAssistantContainer.getBoundingClientRect();
            dragOffset.x = e.clientX - rect.left;
            dragOffset.y = e.clientY - rect.top;
            e.preventDefault();
        });

        // 聊天头部拖动功能
        ldccChatHeader.addEventListener('mousedown', (e) => {
            if (e.target.closest('#ldcc-chat-actions')) return;

            isDraggingChatHeader = true;
            const rect = ldccAssistantContainer.getBoundingClientRect();
            chatHeaderDragOffset.x = e.clientX - rect.left;
            chatHeaderDragOffset.y = e.clientY - rect.top;
            e.preventDefault();
        });

        // 8方向调整大小功能
        ldccResizeHandles.forEach(handle => {
            handle.addEventListener('mousedown', (e) => {
                isResizing = true;
                currentResizeHandle = handle.className.split(' ')[1];
                ldccAssistantContainer.classList.add('resizing');
                const rect = ldccAssistantContainer.getBoundingClientRect();
                initialSize.width = rect.width;
                initialSize.height = rect.height;
                initialPos.x = e.clientX;
                initialPos.y = e.clientY;
                initialPos.left = rect.left;
                initialPos.top = rect.top;
                e.preventDefault();
            });
        });
    }

    // 全局鼠标移动事件
    document.addEventListener('mousemove', (e) => {
        if (isResizingChatList) {
            const deltaX = e.clientX - chatListStartX;
            const newWidth = Math.max(200, Math.min(500, chatListStartWidth + deltaX));
            if (ldccChatList) {
                ldccChatList.style.width = newWidth + 'px';
            }
        }

        if (isCustomPage) return;
        if (isDragging) {
            const x = e.clientX - dragOffset.x;
            const y = e.clientY - dragOffset.y;

            ldccAssistantContainer.style.right = 'auto';
            ldccAssistantContainer.style.bottom = 'auto';
            ldccAssistantContainer.style.left = Math.max(0, Math.min(window.innerWidth - ldccAssistantContainer.offsetWidth, x)) + 'px';
            ldccAssistantContainer.style.top = Math.max(0, Math.min(window.innerHeight - ldccAssistantContainer.offsetHeight, y)) + 'px';
        } else if (isDraggingChatHeader) {
            const x = e.clientX - chatHeaderDragOffset.x;
            const y = e.clientY - chatHeaderDragOffset.y;

            ldccAssistantContainer.style.right = 'auto';
            ldccAssistantContainer.style.bottom = 'auto';
            ldccAssistantContainer.style.left = Math.max(0, Math.min(window.innerWidth - ldccAssistantContainer.offsetWidth, x)) + 'px';
            ldccAssistantContainer.style.top = Math.max(0, Math.min(window.innerHeight - ldccAssistantContainer.offsetHeight, y)) + 'px';
        } else if (isResizing && currentResizeHandle) {
            const deltaX = e.clientX - initialPos.x;
            const deltaY = e.clientY - initialPos.y;

            let newWidth = initialSize.width;
            let newHeight = initialSize.height;
            let newLeft = initialPos.left;
            let newTop = initialPos.top;

            switch(currentResizeHandle) {
                case 'e':
                    newWidth = Math.max(400, initialSize.width + deltaX);
                    break;
                case 'w':
                    newWidth = Math.max(400, initialSize.width - deltaX);
                    newLeft = initialPos.left + deltaX;
                    break;
                case 's':
                    newHeight = Math.max(400, initialSize.height + deltaY);
                    break;
                case 'n':
                    newHeight = Math.max(400, initialSize.height - deltaY);
                    newTop = initialPos.top + deltaY;
                    break;
                case 'se':
                    newWidth = Math.max(400, initialSize.width + deltaX);
                    newHeight = Math.max(400, initialSize.height + deltaY);
                    break;
                case 'sw':
                    newWidth = Math.max(400, initialSize.width - deltaX);
                    newHeight = Math.max(400, initialSize.height + deltaY);
                    newLeft = initialPos.left + deltaX;
                    break;
                case 'ne':
                    newWidth = Math.max(400, initialSize.width + deltaX);
                    newHeight = Math.max(400, initialSize.height - deltaY);
                    newTop = initialPos.top + deltaY;
                    break;
                case 'nw':
                    newWidth = Math.max(400, initialSize.width - deltaX);
                    newHeight = Math.max(400, initialSize.height - deltaY);
                    newLeft = initialPos.left + deltaX;
                    newTop = initialPos.top + deltaY;
                    break;
            }

            ldccAssistantContainer.style.width = newWidth + 'px';
            ldccAssistantContainer.style.height = newHeight + 'px';

            if (currentResizeHandle.includes('w') || currentResizeHandle.includes('n')) {
                ldccAssistantContainer.style.right = 'auto';
                ldccAssistantContainer.style.bottom = 'auto';
                ldccAssistantContainer.style.left = Math.max(0, newLeft) + 'px';
                ldccAssistantContainer.style.top = Math.max(0, newTop) + 'px';
            }
        }
    });

    // 全局鼠标释放事件
    document.addEventListener('mouseup', () => {
        if (isDragging || isResizing) {
            isDragging = false;
            isResizing = false;
            currentResizeHandle = null;
            ldccAssistantContainer.classList.remove('dragging', 'resizing');
            saveLdccWindowState();
        }
        if (isDraggingChatHeader) {
            isDraggingChatHeader = false;
            saveLdccWindowState();
        }
        if (isResizingChatList) {
            isResizingChatList = false;
            ldccChatList.classList.remove('resizing');
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
            saveLdccWindowState();
        }

        if (isCustomPage) return;
    });

    // ---------- Utility Functions ----------
    const ldccFormatTime = (timestamp)=>{
        const seconds = Math.floor((Date.now()-new Date(timestamp).getTime())/1000);
        if(seconds < 60) return seconds + '秒前';
        const minutes = Math.floor(seconds/60);
        if(minutes < 60) return minutes + '分钟前';
        const hours = Math.floor(minutes/60);
        if(hours < 24) return hours + '小时前';
        return Math.floor(hours/24) + '天前';
    };

    const ldccAddJitter = (value)=> Math.floor(value * (0.85 + Math.random()*0.3));

    const ldccBuildAvatarUrl = (template, size=36, letter='U') => {
      if (template) {
        let url = template.replace('{size}', size);
        if (url.startsWith('//')) url = location.protocol + url;
        if (url.startsWith('/'))  url = location.origin + url;
        return url;
      }
      return `https://ui-avatars.com/api/?name=${letter}&size=${size}&background=0088cc&color=fff`;
    };

    // 论坛中心功能
    ldccHubBtn.addEventListener('click', () => {
        window.open('/mynew', '_blank');
    });

    // ---------- Chat Data Management ----------
    let ldccChatListData=[], ldccSeenChats=new Set(), ldccChatsInitialized=false, ldccMaxCreatedTime=0;
    let isPolling=false, pendingImmediatePoll=false;
    let currentChatId=null, currentChatData=null;
    let chatMessages=new Map();

    // 通知系统
    let unreadCount = 0;
    let lastUnreadCount = 0;
    let hasUnreadNotifications = false;

    // 更新通知徽章
    function updateNotificationBadge() {
        if (!ldccFloatingBtn) return;
        if (ldccFloatingBtn.classList.contains('hidden')) {
            // 如果助手已经展开，不显示徽章
            return;
        }

        unreadCount = ldccChatListData.filter(chat => !ldccSeenChats.has(chat.id)).length;

        if (unreadCount > 0) {
            hasUnreadNotifications = true;
            ldccFloatingBtn.classList.add('has-notification');

            if (unreadCount === 1) {
                ldccFloatingBtn.classList.add('has-single');
                ldccFloatingBtn.removeAttribute('data-badge');
            } else {
                ldccFloatingBtn.classList.remove('has-single');
                ldccFloatingBtn.setAttribute('data-badge', unreadCount > 99 ? '99+' : unreadCount.toString());
            }
        } else {
            hasUnreadNotifications = false;
            ldccFloatingBtn.classList.remove('has-notification', 'has-single');
            ldccFloatingBtn.removeAttribute('data-badge');
        }

        // 如果通知数量变化，记录日志
        if (unreadCount !== lastUnreadCount) {
            console.log(`通知更新: ${lastUnreadCount} → ${unreadCount} 个新帖子`);
            lastUnreadCount = unreadCount;
        }
    }

    function renderLdccChatList(){
      ldccChatList.innerHTML = ldccChatListData.map((chat, index)=>{
        const isNew = !ldccSeenChats.has(chat.id);

        return `
          <div class="ldcc-chat-item ${isNew?'unread':''} ${currentChatId===chat.id?'active':''}" data-chat-id="${chat.id}">
            <div class="ldcc-chat-avatar">
              ${chat.avatar ? `<img src="${chat.avatar}" alt="${chat.username || '用户'}">` :
                `<img src="https://ui-avatars.com/api/?name=${encodeURIComponent(chat.username || 'User')}&size=42&background=0088cc&color=fff" alt="${chat.username || 'User'}">`}
            </div>
            <div class="ldcc-chat-content">
              <div class="ldcc-chat-title">${(chat.title||'').replace(/</g,'&lt;')}</div>
            </div>
            <div class="ldcc-chat-time">${ldccFormatTime(chat.created_at)}</div>
            <a href="/t/${chat.id}" target="_blank" class="ldcc-open-post-btn" title="打开原帖子">🔗</a>
          </div>
        `;
      }).join('');
      updateLdccMyNewStats();
    }

    function updateLdccMyNewStats(){
      if (!ldccMyNewUI || !ldccMyNewUI.stats) return;
      const { total, today, lastUpdate } = ldccMyNewUI.stats;
      if (total) total.textContent = ldccChatListData.length;
      if (today) {
        const todayCount = ldccChatListData.filter(t => {
          try{
            return new Date(t.created_at).toDateString() === new Date().toDateString();
          }catch {
            return false;
          }
        }).length;
        today.textContent = todayCount;
      }
      if (lastUpdate) {
        lastUpdate.textContent = new Date().toLocaleTimeString('zh-CN', {hour: '2-digit', minute: '2-digit'});
      }
    }

    async function pollLdccChatList(force=false){
      if (isPolling) {
        if (force) pendingImmediatePoll = true;
        return;
      }
      isPolling = true;
      try{
        // 获取更多帖子，分页获取
        const response1 = await fetch('/latest.json?_=1&page=0', {credentials:'same-origin'});
        if (response1.status===429) throw {rateLimit:true};
        const data1 = await response1.json();

        const response2 = await fetch('/latest.json?_=2&page=1', {credentials:'same-origin'});
        let data2 = {topic_list: {topics: []}};
        if (response2.ok) {
          data2 = await response2.json();
        }

        // 合并两页数据
        const allTopics = [...(data1?.topic_list?.topics||[]), ...(data2?.topic_list?.topics||[])];
        const topics = allTopics.map(t=>{
          // 获取帖子创建者信息 - 修复为正确获取原始发布者
          const creator = t.posters && t.posters.find(p => p.user && p.user.id === t.user_id);
          const username = creator ? creator.user.username : (t.last_poster_username || '匿名');
          const avatarTemplate = creator ? creator.user.avatar_template : null;

          return {
            id:t.id,
            title:t.title,
            created_at:t.created_at,
            last_posted_at:t.last_posted_at,
            reply_count:t.reply_count || 0,
            views:t.views || 0,
            like_count:t.like_count || 0,
            posters:t.posters || [],
            emoji: t.like_count > 10 ? '🔥' : (t.reply_count > 20 ? '💬' : (t.views > 100 ? '👁️' : '💭')),
            avatar: avatarTemplate ? avatarTemplate.replace('{size}', '42') : null,
            username: username
          };
        }).sort((a,b)=> new Date(b.created_at)-new Date(a.created_at));

        if (!ldccChatsInitialized){
          ldccChatListData = topics.slice(0, LDCC_CONFIG.max);
          ldccChatListData.forEach(chat=>{
            ldccSeenChats.add(chat.id);
            ldccMaxCreatedTime = Math.max(ldccMaxCreatedTime, new Date(chat.created_at).getTime());
          });
          ldccChatsInitialized = true;
          renderLdccChatList();
          updateNotificationBadge(); // 初始化时更新通知
        }else{
          const newChats = topics.filter(t=>
            !ldccSeenChats.has(t.id) && new Date(t.created_at).getTime() > ldccMaxCreatedTime
          ).sort((a,b)=> new Date(a.created_at)-new Date(b.created_at));

          if (newChats.length){
            // 新帖子先不标记为已读，让通知系统处理
            for (const newChat of newChats){
              ldccChatListData.unshift(newChat);
              ldccMaxCreatedTime = Math.max(ldccMaxCreatedTime, new Date(newChat.created_at).getTime());
            }
            if (ldccChatListData.length > LDCC_CONFIG.max) ldccChatListData.length = LDCC_CONFIG.max;
            renderLdccChatList();
            updateNotificationBadge(); // 有新帖子时更新通知
          }
        }
        updateLdccMyNewStats();
        pollingDelay = LDCC_CONFIG.poll;
      }catch(error){
        pollingDelay = Math.min(60000, Math.max(pollingDelay*2, LDCC_CONFIG.poll*2));
      }finally{
        isPolling = false;
        if (pendingImmediatePoll) {
          pendingImmediatePoll = false;
          pollLdccChatList();
          return;
        }
        const nextDelay = ldccAddJitter(pollingDelay);
        setTimeout(()=>pollLdccChatList(false), nextDelay);
      }
    }

    // ---------- Chat Functions ----------
    async function loadLdccChatMessages(chatId){
      if (!chatId) return;

      try{
        const response = await fetch(`/t/${chatId}.json?include_raw=0&_=${Date.now()}`, {credentials:'same-origin'});
        if (response.status===429) throw {rateLimit:true};
        if (!response.ok) throw new Error('HTTP '+response.status);
        const data = await response.json();

        const posts=data?.post_stream?.posts||[];
        if(!posts.length) return [];

        const messages = posts.map(post => ({
          id: post.id,
          author: post.username || '匿名',
          avatar: ldccBuildAvatarUrl(post.avatar_template, 36, (post.username||'U')[0] || 'U'),
          text: post.cooked || '',
          time: new Date(post.created_at).toLocaleTimeString('zh-CN', {hour: '2-digit', minute: '2-digit'}),
          isOwn: false, // 初始都不是自己的消息
          postNumber: post.post_number
        }));

        return messages;
      }catch(error){
        console.error('加载聊天消息失败:', error);
        return [];
      }
    }

    function renderLdccMessages(messages, scrollToBottom = false){
      if (!messages || messages.length === 0) {
        ldccMessagesContainer.innerHTML = `
          <div class="ldcc-empty-state">
            <div class="ldcc-empty-icon">📭</div>
            <div class="ldcc-empty-text">暂无消息</div>
            <div class="ldcc-empty-hint">这条帖子还没有回复</div>
          </div>
        `;
        return;
      }

      ldccMessagesContainer.innerHTML = messages.map(msg => `
        <div class="ldcc-message ${msg.isOwn ? 'own' : ''}">
          <div class="ldcc-message-header">
            <img src="${msg.avatar}" alt="${msg.author}" class="ldcc-message-avatar">
            <div class="ldcc-message-author-info">
              <span class="ldcc-message-author">${msg.author}</span>
              <span class="ldcc-message-time">${msg.time}</span>
              <span class="ldcc-message-number">#${msg.postNumber}</span>
            </div>
          </div>
          <div class="ldcc-message-content">
            <div class="ldcc-message-bubble">
              <div class="ldcc-message-text">${msg.text}</div>
            </div>
          </div>
        </div>
      `).join('');

      // 根据参数决定滚动位置
      if (scrollToBottom) {
        ldccMessagesContainer.scrollTop = ldccMessagesContainer.scrollHeight;
      } else {
        ldccMessagesContainer.scrollTop = 0;
      }
    }

    async function openLdccChat(chatId){
      currentChatId = chatId;
      currentChatData = ldccChatListData.find(c => c.id == chatId);

      if (!currentChatData) return;

      // 更新聊天头部
      ldccChatTitle.innerHTML = `
        <span>${currentChatData.emoji || '💬'}</span>
        <span>${currentChatData.title}</span>
      `;

      // 标记为已读
      ldccSeenChats.add(chatId);
      renderLdccChatList();

      // 加载消息
      const messages = chatMessages.get(chatId);
      if (messages) {
        renderLdccMessages(messages);
      } else {
        ldccMessagesContainer.innerHTML = `
          <div class="ldcc-empty-state">
            <div class="ldcc-empty-icon">🔄</div>
            <div class="ldcc-empty-text">正在加载消息...</div>
          </div>
        `;

        const loadedMessages = await loadLdccChatMessages(chatId);
        chatMessages.set(chatId, loadedMessages);
        renderLdccMessages(loadedMessages);
      }

      // 启用输入
      ldccMessageInput.disabled = false;
      ldccSendBtn.disabled = false;
    }

    function closeLdccChat(){
      currentChatId = null;
      currentChatData = null;

      ldccChatTitle.innerHTML = '<span>选择一个对话开始聊天</span>';
      ldccMessagesContainer.innerHTML = `
        <div class="ldcc-empty-state">
          <div class="ldcc-empty-icon">💭</div>
          <div class="ldcc-empty-text">选择一个对话开始聊天</div>
          <div class="ldcc-empty-hint">从左侧列表中选择一个帖子</div>
        </div>
      `;

      // 禁用输入
      ldccMessageInput.value = '';
      ldccMessageInput.disabled = true;
      ldccSendBtn.disabled = true;

      renderLdccChatList();
    }

    async function refreshLdccCurrentChat(){
      if (!currentChatId) return;

      const loadedMessages = await loadLdccChatMessages(currentChatId);
      chatMessages.set(currentChatId, loadedMessages);
      renderLdccMessages(loadedMessages);
    }

    async function sendLdccMessage(){
      if (!currentChatId) return;
      const messageText = ldccMessageInput.value.trim();
      if (!messageText) return;

      ldccSendBtn.disabled = true;

      // 获取CSRF Token - 参考a.js的实现
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content||'';
      if (!csrfToken) {
        alert('CSRF Token获取失败，请刷新页面重试');
        ldccSendBtn.disabled = false;
        return;
      }

      try{
        const response = await fetch('/posts.json',{
          method:'POST',
          credentials:'same-origin',
          headers:{
            'Content-Type':'application/json',
            'X-CSRF-Token':csrfToken,
            'X-Requested-With':'XMLHttpRequest'
          },
          body:JSON.stringify({
            raw:messageText,
            topic_id:Number(currentChatId)
          })
        });

        // 详细的错误处理 - 参考a.js
        if (response.status === 429) {
          throw new Error('发送太频繁，请稍后再试');
        }
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`发送失败 (${response.status}): ${errorText.substring(0, 100)}`);
        }

        // 清空输入框
        ldccMessageInput.value = '';
        ldccMessageInput.focus();

        // 立即刷新消息列表 - 参考a.js的立即刷新方式
        try {
          const loadedMessages = await loadLdccChatMessages(currentChatId);
          chatMessages.set(currentChatId, loadedMessages);
          renderLdccMessages(loadedMessages, true);
        } catch (refreshError) {
          console.warn('立即刷新失败，使用备用方案:', refreshError);
          // 备用方案：添加自己的消息到列表
          const ownMessage = {
            id: Date.now(),
            author: '我',
            avatar: `https://ui-avatars.com/api/?name=Me&size=36&background=dcf8c6&color=333`,
            text: messageText,
            time: new Date().toLocaleTimeString('zh-CN', {hour: '2-digit', minute: '2-digit'}),
            isOwn: true,
            postNumber: '新'
          };

          const messages = chatMessages.get(currentChatId) || [];
          messages.push(ownMessage);
          chatMessages.set(currentChatId, messages);
          renderLdccMessages(messages, true);

          // 延迟刷新完整消息列表
          setTimeout(refreshLdccCurrentChat, 1000);
        }

      }catch(error){
        console.error('发送消息失败:', error);
        alert(`发送失败: ${error.message || '请重试'}`);
      }finally{
        ldccSendBtn.disabled = false;
      }
    }

    // ---------- Event Listeners ----------
    ldccChatList.addEventListener('click', (e)=>{
      const chatItem = e.target.closest('.ldcc-chat-item');
      if(!chatItem) return;
      const chatId = chatItem.getAttribute('data-chat-id');
      openLdccChat(chatId);
      if (isCustomPage && window.innerWidth <= 768) {
        ldccChatList.classList.remove('show');
      }
    });

    ldccChatCloseBtn.addEventListener('click', (e)=>{ e.stopPropagation(); closeLdccChat(); });
    ldccChatRefreshBtn.addEventListener('click', refreshLdccCurrentChat);

    // 打开原帖子按钮
    ldccChatOpenBtn.addEventListener('click', (e)=>{
        e.stopPropagation();
        if (currentChatId) {
            window.open(`/t/${currentChatId}`, '_blank');
        }
    });

    // 消息输入事件
    ldccMessageInput.addEventListener('keydown', (e)=>{
      if (e.key==='Enter' && !e.shiftKey){
        e.preventDefault();
        sendLdccMessage();
      }
    });

    ldccSendBtn.addEventListener('click', sendLdccMessage);

    // Minimize functionality
    if (!isCustomPage && ldccMinimizeBtn && ldccFloatingBtn) {
      ldccMinimizeBtn.addEventListener('click', ()=>{
        ldccAssistantContainer.style.display='none';
        ldccFloatingBtn.classList.remove('hidden');
        ldccFloatingBtn.classList.add('visible');
        updateNotificationBadge(); // 最小化时更新通知徽章
      });

      ldccFloatingBtn.addEventListener('click', ()=>{
        ldccAssistantContainer.style.display='flex';
        ldccFloatingBtn.classList.add('hidden');
        ldccFloatingBtn.classList.remove('visible');

        // 展开时清零通知 - 将所有帖子标记为已读
        if (hasUnreadNotifications) {
          ldccChatListData.forEach(chat => {
            ldccSeenChats.add(chat.id);
          });
          hasUnreadNotifications = false;
          updateNotificationBadge();
          console.log('助手已展开，清零所有通知');
        }
      });
    }

    // Initialize
    if (!isCustomPage) {
      restoreLdccWindowState();
    }

    if (startMinimized) {
      if (ldccFloatingBtn) {
        ldccFloatingBtn.classList.add('visible');
        console.log('默认最小化模式，只显示浮动按钮');
      }
    } else {
      ldccAssistantContainer.style.display='flex';
    }

    pollLdccChatList();
    setInterval(()=>{
      if(ldccChatsInitialized) {
        ldccCurrentTimeEl.textContent = new Date().toLocaleTimeString('zh-CN', {hour: '2-digit', minute: '2-digit'});
      }
    }, LDCC_CONFIG.timeTick);

    if (ldccRefreshBtn) {
      ldccRefreshBtn.addEventListener('click', ()=>pollLdccChatList(true));
    }

    // 初始状态禁用输入
    ldccMessageInput.disabled = true;
    ldccSendBtn.disabled = true;

    // 调试信息
    console.log('脚本初始化完成');
    console.log('左侧列表元素:', ldccChatList);
    console.log('调整手柄:', ldccChatListResizeHandle);
    console.log('调整大小手柄z-index:', ldccChatListResizeHandle ? getComputedStyle(ldccChatListResizeHandle).zIndex : '未找到');

// ---------- MyNew Page Shell ----------
function setupLdccMyNewShell(container) {
    document.title = '💬 Linux.do 论坛助手 CC版 - TG聊天风格';
    const body = document.body;
    body.classList.add('ldcc-mynew-page');
    body.innerHTML = '';
    const shell = document.createElement('div');
    shell.className = 'ldcc-mynew-shell';
    shell.innerHTML = `
      <header class="ldcc-mynew-header">
        <div class="ldcc-mynew-logo">
          <span class="icon">💬</span>
          <div>Linux.do 论坛助手 CC版</div>
        </div>
        <div class="ldcc-mynew-stats">
          <div class="ldcc-mynew-stat">
            <span class="label">总数</span>
            <span class="value" id="ldcc-mynew-total">-</span>
          </div>
          <div class="ldcc-mynew-stat">
            <span class="label">今日</span>
            <span class="value" id="ldcc-mynew-today">-</span>
          </div>
          <div class="ldcc-mynew-stat">
            <span class="label">更新</span>
            <span class="value" id="ldcc-mynew-last-update">--:--</span>
          </div>
        </div>
        <div class="ldcc-mynew-settings">
          <label for="ldcc-mynew-poll-range">刷新间隔</label>
          <div class="ldcc-mynew-slider">
            <input type="range" min="${LDCC_POLL_LIMITS.min}" max="${LDCC_POLL_LIMITS.max}" step="${LDCC_POLL_LIMITS.step}" id="ldcc-mynew-poll-range" value="${LDCC_CONFIG.poll}">
            <span id="ldcc-mynew-poll-value">${Math.round(LDCC_CONFIG.poll/1000)}秒</span>
          </div>
        </div>
        <div class="ldcc-mynew-actions">
          <button id="ldcc-mynew-refresh" title="立即刷新">🔄</button>
          <button id="ldcc-mynew-back" title="返回论坛">🏠</button>
          <button id="ldcc-mynew-sidebar-toggle" class="ldcc-chat-toggle" title="切换对话列表">💬</button>
        </div>
      </header>
      <main class="ldcc-mynew-main"></main>
    `;
    body.appendChild(shell);
    const main = shell.querySelector('.ldcc-mynew-main');
    if (main) {
        main.appendChild(container);
        container.style.display = 'flex';
    }

    return {
        stats: {
            total: document.getElementById('ldcc-mynew-total'),
            today: document.getElementById('ldcc-mynew-today'),
            lastUpdate: document.getElementById('ldcc-mynew-last-update')
        },
        refreshBtn: document.getElementById('ldcc-mynew-refresh'),
        backBtn: document.getElementById('ldcc-mynew-back'),
        toggleBtn: document.getElementById('ldcc-mynew-sidebar-toggle'),
        pollInput: document.getElementById('ldcc-mynew-poll-range'),
        pollValue: document.getElementById('ldcc-mynew-poll-value')
    };
}




})();