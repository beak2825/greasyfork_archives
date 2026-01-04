// ==UserScript==
// @name         IYUU 全站辅种检测
// @namespace    iyuu-crossseed
// @version      1.0.9
// @description  实现在种子详情页显示该种在其他站点存在情况
// @author       guyuanwind
// @match        https://*/details.php*
// @match        http://*/details.php*
// @match        https://totheglory.im/t/*
// @match        http://totheglory.im/t/*
// @match        https://*.m-team.cc/detail/*
// @match        https://*.m-team.io/detail/*
// @match        https://*.m-team.vip/detail/*
// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @license      GPL-3.0
// @connect      2025.iyuu.cn
// @connect      *
// @connect      *.m-team.cc
// @connect      *.m-team.io
// @connect      *.m-team.vip
// @connect      api.m-team.cc
// @connect      api.m-team.io
// @connect      api.m-team.vip
// @downloadURL https://update.greasyfork.org/scripts/549126/IYUU%20%E5%85%A8%E7%AB%99%E8%BE%85%E7%A7%8D%E6%A3%80%E6%B5%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/549126/IYUU%20%E5%85%A8%E7%AB%99%E8%BE%85%E7%A7%8D%E6%A3%80%E6%B5%8B.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /*** 基础配置（逻辑保持不变） ***/
  const IYUU_TOKEN_DEFAULT = '';
  const AUTO_KEY = 'iyuu_auto_query_v1';
  const MTEAM_API_KEY = 'iyuu_mteam_api_key_v1';

  // 检测是否为MTeam站点
  function isMTeamSite() {
    return /m-team\.(cc|io|vip)/.test(window.location.hostname);
  }
  function getAutoQuery() {
    try { const v = GM_getValue(AUTO_KEY); if (typeof v === 'boolean') return v;
    } catch {}
    try { const v2 = localStorage.getItem(AUTO_KEY); if (v2 != null) return v2 === 'true';
    } catch {}
    return true;
  }
  function setAutoQuery(v) {
    try { GM_setValue(AUTO_KEY, !!v);
    } catch {}
    try { localStorage.setItem(AUTO_KEY, (!!v).toString());
    } catch {}
  }

  /*** 站点图标映射（逻辑保持不变） ***/
  const ICON_MAP = { sid: {
    1:'https://icon.xiaoge.org/images/pt/FRDS.png',2:'https://icon.xiaoge.org/images/pt/PTHOME.png',3:'https://icon.xiaoge.org/images/pt/M-Team.png',
    4:'https://icon.xiaoge.org/images/pt/HDsky.png',8:'https://icon.xiaoge.org/images/pt/btschool.png',6:'https://icon.xiaoge.org/images/pt/Pter.png',
    7:'https://icon.xiaoge.org/images/pt/HDHome.png',23:'https://icon.xiaoge.org/images/pt/Nvme.png',25:'https://icon.xiaoge.org/images/pt/CHDbits.png',
    33:'https://icon.xiaoge.org/images/pt/OpenCD.png',68:'https://icon.xiaoge.org/images/pt/Audiences.png',72:'https://icon.xiaoge.org/images/pt/HHCLUB.png',
    9:'https://icon.xiaoge.org/images/pt/OurBits.png',14:'https://icon.xiaoge.org/images/pt/TTG.png',86:'https://icon.xiaoge.org/images/pt/UBits.png',
    93:'https://icon.xiaoge.org/images/pt/agsv.png',89:'https://icon.xiaoge.org/images/pt/carpt.png',84:'https://icon.xiaoge.org/images/pt/cyanbug.png',
    90:'https://icon.xiaoge.org/images/pt/dajiao.png',51:'https://icon.xiaoge.org/images/pt/dicmusic.png',40:'https://icon.xiaoge.org/images/pt/discfan.png',
    64:'https://icon.xiaoge.org/images/pt/gpw.png',56:'https://icon.xiaoge.org/images/pt/haidan.png',29:'https://icon.xiaoge.org/images/pt/hdarea.png',
    105:'https://icon.xiaoge.org/images/pt/hddolby.png',57:'https://icon.xiaoge.org/images/pt/hdfans.png',97:'https://icon.xiaoge.org/images/pt/hdkyl.png',
    18:'https://icon.xiaoge.org/images/pt/nicept.png',88:'https://icon.xiaoge.org/images/pt/panda.png',94:'https://icon.xiaoge.org/images/pt/ptvicomo.png',
    95:'https://icon.xiaoge.org/images/pt/qingwapt.png',82:'https://icon.xiaoge.org/images/pt/rousi.png',24:'https://icon.xiaoge.org/images/pt/soulvoice.png',
    5:'https://icon.xiaoge.org/images/pt/tjupt.png',96:'https://icon.xiaoge.org/images/pt/xingtan.png',80:'https://icon.xiaoge.org/images/pt/zhuque.png',
    81:'https://icon.xiaoge.org/images/pt/zmpt.png' }, name:{} };
  function lookupIconURL({ sid, nickname, site }) {
    if (sid != null && ICON_MAP.sid[sid]) return ICON_MAP.sid[sid];
    const toKey = (s) => (s || '').toString().trim().toLowerCase();
    const n1 = toKey(nickname); const n2 = toKey(site);
    if (n1 && ICON_MAP.name[n1]) return ICON_MAP.name[n1];
    if (n2 && ICON_MAP.name[n2]) return ICON_MAP.name[n2];
    return null;
  }

  /*** 工具 ***/
  function addStyle(css){ try{ if(typeof GM_addStyle==='function') return GM_addStyle(css);}catch{} const s=document.createElement('style'); s.textContent=css; (document.head||document.documentElement).appendChild(s);
  }

  /*** 样式（适配不同站点） ***/
  const isMTeam = isMTeamSite();
  const baseStyles = `
    .iyuu-topbar{
      background: ${isMTeam ? 'rgba(255,255,255,0.95)' : 'rgba(9,14,28,.92)'};
      color: ${isMTeam ? '#262626' : '#fff'};
      border: ${isMTeam ? '1px solid #d9d9d9' : '1px solid #ffffff1a'};
      border-radius: ${isMTeam ? '8px' : '0'};
      backdrop-filter: blur(6px);
      width: ${isMTeam ? '100%' : '1200px'};
      max-width: ${isMTeam ? 'none' : '1200px'};
      margin: ${isMTeam ? '16px 0' : '0 auto'};
      padding: ${isMTeam ? '0 40px' : '0'};
      z-index: 999;
      position: relative;
      box-shadow: ${isMTeam ? '0 2px 8px rgba(0,0,0,0.1)' : 'none'};
    }
    .iyuu-topbar-inner{position:relative;display:block;padding:${isMTeam ? '16px 20px 80px 20px' : '10px 14px 66px 14px'};font:12.5px/1.45 system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial}
    .iyuu-header{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
    .iyuu-title{font-weight:700;margin-right:2px;white-space:nowrap;color:${isMTeam ? '#1890ff' : 'inherit'}}
    .iyuu-hash{opacity:.9;max-width:46vw;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;color:${isMTeam ? '#666' : 'inherit'}}
    .iyuu-msg{opacity:.9;color:${isMTeam ? '#999' : '#e5e7eb'};max-width:32vw;text-overflow:ellipsis;overflow:hidden;white-space:nowrap}
    .iyuu-divider{height:18px;width:1px;background:${isMTeam ? '#d9d9d9' : '#ffffff1a'};margin:0 4px}
    .iyuu-badge{font-size:12px;padding:2px 8px;border-radius:6px;background:#f59e0b;color:#221400}
    .iyuu-badge.ok{background:#52c41a;color:#fff}
    .iyuu-badge.no{background:#faad14;color:#fff}
    .iyuu-badge.err{background:#ff4d4f;color:#fff}
    .iyuu-top-right{position:absolute;right:${isMTeam ? '20px' : '14px'};top:${isMTeam ? '16px' : '10px'};display:flex;align-items:center;gap:8px;z-index:2;flex-wrap:wrap}
    .iyuu-input{display:flex;align-items:center;gap:6px;background:${isMTeam ? '#fafafa' : '#0f172a'};border:1px solid ${isMTeam ? '#d9d9d9' : '#243045'};border-radius:6px;padding:4px 8px}
    .iyuu-input input{width:160px;background:transparent;border:none;outline:none;color:${isMTeam ? '#262626' : '#cde3ff'};font-size:12px}
    .iyuu-token-mask{opacity:.85;font-size:12px}
    .iyuu-eye{cursor:pointer;user-select:none;opacity:.9}
    .iyuu-btn{padding:6px 12px;border-radius:6px;border:${isMTeam ? '1px solid #d9d9d9' : 'none'};cursor:pointer;background:${isMTeam ? '#fff' : '#1e293b'};color:${isMTeam ? '#262626' : '#fff'};font-size:12px;transition:all 0.3s}
    .iyuu-btn:hover{${isMTeam ? 'border-color:#1890ff;color:#1890ff' : 'filter:brightness(1.05)'}}
    .iyuu-top-spacer{height:44px}
    .iyuu-chips{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:10px;align-items:stretch;width:100%}
    .iyuu-chip{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;padding:8px 10px;border-radius:8px;background:${isMTeam ? '#fafafa' : '#0f172a'};border:1px solid ${isMTeam ? '#d9d9d9' : '#243045'};text-decoration:none;color:${isMTeam ? '#262626' : '#dbeafe'};min-height:68px;box-sizing:border-box;text-align:center;transition:all 0.3s}
    .iyuu-chip.ok{border-color:#52c41a;${isMTeam ? 'background:#f6ffed' : 'color:#dcfce7'}}
    .iyuu-chip:hover{${isMTeam ? 'border-color:#1890ff;box-shadow:0 2px 4px rgba(0,0,0,0.1)' : 'filter:brightness(1.05)'}}
    .iyuu-icon{width:28px;height:28px;display:block;object-fit:contain}
    .iyuu-label{display:block;line-height:1.22;font-size:13.5px}
    .iyuu-count{opacity:.85;font-size:10.5px}
    .iyuu-chip.noicon .iyuu-label{font-size:14.5px}
    .iyuu-empty{opacity:.85}
    .iyuu-foot-left,.iyuu-foot-right{position:absolute}
    .iyuu-foot-left{left:${isMTeam ? '20px' : '14px'};bottom:12px;display:flex;align-items:center;gap:8px}
    .iyuu-mode-text{opacity:.95;font-size:12.5px}
    .iyuu-switch{position:relative;display:inline-block;width:44px;height:22px;vertical-align:middle}
    .iyuu-switch input{opacity:0;width:0;height:0}
    .iyuu-slider{position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background:${isMTeam ? '#bfbfbf' : '#334155'};border-radius:999px;transition:.2s}
    .iyuu-slider:before{position:absolute;content:"";height:18px;width:18px;left:2px;top:2px;background:white;border-radius:50%;transition:.2s}
    .iyuu-switch input:checked + .iyuu-slider{background:${isMTeam ? '#1890ff' : '#22c55e'}}
    .iyuu-switch input:checked + .iyuu-slider:before{transform:translateX(22px)}
    #iyuu-manual-query{padding:9px 14px;font-size:12.5px;border-radius:6px;min-width:112px;box-shadow:0 2px 6px rgba(0,0,0,.22)}
    .iyuu-foot-right{right:${isMTeam ? '20px' : '14px'};bottom:10px}

    /* MTeam站点特殊样式 */
    ${isMTeam ? `
      #mteam-config {
        border-left: 1px solid #d9d9d9;
        padding-left: 12px;
        margin-left: 12px;
        transition: all 0.3s ease;
      }
      #mteam-status {
        border-left: 1px solid #52c41a;
        padding-left: 12px;
        margin-left: 12px;
        background: rgba(82, 196, 26, 0.1);
        border-radius: 4px;
        padding: 6px 12px;
        transition: all 0.3s ease;
      }
      #mteam-status .iyuu-token-mask {
        color: #52c41a;
        font-weight: 500;
      }
      #mteam-reconfig {
        background: rgba(24, 144, 255, 0.1);
        border: 1px solid #1890ff;
        color: #1890ff;
      }
        #mteam-reconfig:hover {
          background: #1890ff;
          color: white;
        }
        .iyuu-topbar {
          margin: 16px 0;
          border-radius: 8px;
          border: 1px solid #d9d9d9;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          background: #fafafa;
        }
        .iyuu-topbar-inner {
          padding: 16px 20px 80px 20px;
        }
        .iyuu-header {
          margin-bottom: 12px;
        }
        .iyuu-title {
          color: #1890ff;
          font-size: 16px;
        }
        .iyuu-hash {
          color: #666;
          font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
        }
        .iyuu-msg {
          color: #999;
        }
        .iyuu-badge {
          font-size: 12px;
          padding: 3px 8px;
          border-radius: 4px;
        }
        .iyuu-chips {
          margin-top: 12px;
        }
        .iyuu-chip {
          background: #fff;
          border: 1px solid #d9d9d9;
          color: #262626;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
          transition: all 0.3s ease;
        }
        .iyuu-chip:hover {
          border-color: #1890ff;
          box-shadow: 0 2px 4px rgba(24,144,255,0.15);
          transform: translateY(-1px);
        }
        .iyuu-chip.ok {
          border-color: #52c41a;
          background: #f6ffed;
        }
    ` : ''}

    @media (max-width:640px){
      .iyuu-input input{width:120px}
        .iyuu-hash{max-width:38vw}
        .iyuu-msg{max-width:28vw}
        .iyuu-top-right{flex-direction:column;gap:4px}
        .iyuu-topbar{margin:12px 0;border-radius:6px}
        .iyuu-topbar-inner{padding:12px 16px 60px 16px}
        .iyuu-title{font-size:14px}
        .iyuu-chips{grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:8px;margin-top:8px}
        .iyuu-chip{min-height:60px;padding:6px 8px}
        .iyuu-chip .iyuu-label{font-size:12px}
        .iyuu-chip .iyuu-count{font-size:9px}
        #mteam-config{border-left:none;padding-left:0;margin-left:0;padding-top:8px;border-top:1px solid #d9d9d9}
        #mteam-status{border-left:none;padding-left:0;margin-left:0;padding-top:8px;border-top:1px solid #52c41a;margin-top:8px}
    }
  `;
  addStyle(baseStyles);

  /*** DOM ***/
  const bar = document.createElement('div');
  bar.className = 'iyuu-topbar';

  // 根据站点类型和API Key状态构建不同的HTML
  function getMteamConfigHTML() {
    if (!isMTeamSite()) return '';

    const hasApiKey = !!getMTeamApiKey();
    const displayStyle = hasApiKey ? 'none' : 'block';

    return `
      <!-- MTeam API Key 配置 -->
      <div id="mteam-config" style="display: ${displayStyle}; margin-left: 10px;">
        <span>MTeam API：<span class="iyuu-token-mask" id="mteam-api-mask">（未设置）</span></span>
        <div class="iyuu-input">
          <input id="mteam-api-input" type="password" placeholder="请输入 MTeam API Key"/>
          <span class="iyuu-eye" id="mteam-eye" title="显示/隐藏">👁️</span>
        </div>
        <button class="iyuu-btn" id="mteam-save">保存API Key</button>
      </div>

      <!-- MTeam API Key 状态显示（已配置时显示） -->
      <div id="mteam-status" style="display: ${hasApiKey ? 'block' : 'none'}; margin-left: 10px;">
        <span>MTeam API：<span class="iyuu-token-mask" id="mteam-status-mask">✓ 已配置</span></span>
        <button class="iyuu-btn" id="mteam-reconfig" style="margin-left: 8px; padding: 4px 8px; font-size: 11px;">重新配置</button>
      </div>
    `;
  }

  const mteamConfigHTML = getMteamConfigHTML();

  bar.innerHTML = `
    <div class="iyuu-topbar-inner">
      <div class="iyuu-header">
        <span class="iyuu-title">IYUU 全站检测</span>
        <span class="iyuu-hash" id="iyuu-hash">hash: ——</span>
        <span class="iyuu-msg" id="iyuu-msg"></span>
        <span class="iyuu-divider"></span>
        <span class="iyuu-badge" id="iyuu-badge">待检测</span>
      </div>

      <div class="iyuu-top-right" id="iyuu-top-right">
        <span>Token：<span class="iyuu-token-mask" id="iyuu-token-mask"></span></span>
        <div class="iyuu-input">
          <input id="iyuu-token-input" type="password" placeholder="在此粘贴 IYUU Token"/>
          <span class="iyuu-eye" id="iyuu-eye" title="显示/隐藏">👁️</span>
        </div>
        <button class="iyuu-btn" id="iyuu-save">保存Token</button>
        ${mteamConfigHTML}
      </div>

      <div class="iyuu-top-spacer"></div>
      <div class="iyuu-chips" id="iyuu-chips"></div>

      <div class="iyuu-foot-left">
        <label class="iyuu-mode-text" id="iyuu-mode-label">自动查询</label>
        <label class="iyuu-switch" title="切换自动/手动查询">
          <input type="checkbox" id="iyuu-auto-toggle" />
          <span class="iyuu-slider"></span>
        </label>
      </div>

      <div class="iyuu-foot-right">
        <button class="iyuu-btn" id="iyuu-manual-query" style="display:none;">查询</button>
      </div>
    </div>
  `;

  // 为不同站点定制UI插入逻辑
  function insertUIBar() {
    // 检测憨憨站点（支持多个域名）
    if (window.location.hostname === 'hhanclub.top' || window.location.hostname === 'hhan.club') {
      // For hhanclub.top/hhan.club, place the bar below the main navigation bar.
      const navBar = document.getElementById('nav');
      if (navBar) {
          navBar.after(bar);
          return true;
      } else {
          console.error('[IYUU] 未找到憨憨站点的导航栏 (#nav)');
          return false;
      }
      } else if (isMTeamSite()) {
        // MTeam站点使用特殊的插入逻辑 - 放在用户信息栏下方
        console.log('[IYUU] 检测到MTeam站点，使用专用UI插入逻辑');

        // 优先查找底部用户信息栏（包含魔力值、邀请等信息）
        // 首先尝试精确匹配 MTeam 用户信息栏的特定结构
        let userInfoElement = null;

        // 方法1：直接查找包含特定 class 的元素（ant-row ant-row-space-between ant-row-middle）
        const antRowElements = document.querySelectorAll('.ant-row.ant-row-space-between.ant-row-middle');
        for (const element of antRowElements) {
          const text = element.textContent || '';
          if (text.includes('魔力值') && text.includes('邀請') && text.includes('分享率') &&
              text.includes('上傳量') && text.includes('下載量')) {
            console.log(`[IYUU] MTeam-通过ant-row找到用户信息栏: ${element.className}`);
            userInfoElement = element;
            break;
          }
        }

        // 方法2：如果找不到，使用文本匹配
        if (!userInfoElement) {
          const candidateElements = [
            ...document.querySelectorAll('.ant-row'),
            ...document.querySelectorAll('.px-\\[40px\\]'),
            ...document.querySelectorAll('div[class*="ant-space"]'),
            ...document.querySelectorAll('div')
          ];

          for (const element of candidateElements) {
            const text = element.textContent || '';

            // 避免匹配到过大或不相关的元素
            if (text.length > 2000 || text.length < 50 ||
                element.tagName === 'STYLE' || element.tagName === 'SCRIPT') {
              continue;
            }

            // 精确匹配 MTeam 用户信息栏的特征
            if (text.includes('魔力值') && text.includes('邀請') && text.includes('分享率') &&
                text.includes('上傳量') && text.includes('下載量') && text.includes('[退出]')) {

              // 验证元素是否可见且可操作
              if (element.offsetParent !== null && element.style.display !== 'none' &&
                  element.tagName !== 'HTML' && element.tagName !== 'BODY') {
                const className = element.className ? element.className.split(' ')[0] : 'no-class';
                console.log(`[IYUU] MTeam-通过文本匹配找到用户信息元素: ${element.tagName}.${className}`);
                userInfoElement = element;
                break;
              }
            }
          }
        }

        if (userInfoElement) {
          console.log('[IYUU] MTeam-找到用户信息栏，在其容器下方插入IYUU插件');
          const userClassName = userInfoElement.className ? userInfoElement.className.split(' ')[0] : 'no-class';
          console.log(`[IYUU] MTeam-目标元素: ${userInfoElement.tagName}.${userClassName}`);
          console.log('[IYUU] MTeam-文本预览:', userInfoElement.textContent.substring(0, 150));

          try {
            // 查找包含用户信息栏的最外层容器（px-[40px]）
            const outerContainer = userInfoElement.closest('div[class*="px-"]') ||
                                   userInfoElement.closest('div[class*="px"]') ||
                                   userInfoElement.parentElement;

            if (outerContainer && outerContainer !== userInfoElement) {
              const outerClassName = outerContainer.className ? outerContainer.className.split(' ')[0] : 'no-class';
              console.log(`[IYUU] MTeam-在外层容器后插入: ${outerContainer.tagName}.${outerClassName}`);
              outerContainer.after(bar);
            } else {
              console.log('[IYUU] MTeam-直接在用户信息栏后插入');
              userInfoElement.after(bar);
            }
            return true;
          } catch (e) {
            console.log('[IYUU] MTeam-初始插入失败:', e.message);
          }
        }

        // 如果没有找到用户信息栏，尝试其他选择器
        const selectors = [
          // 优先查找 MTeam 特有的结构
          'div[class*="px-"]', // MTeam 用户信息栏外层容器
          '.ant-row.ant-row-space-between', // MTeam 用户信息栏
          '.ant-divider.ant-divider-horizontal', // MTeam 分割线（可能在用户信息栏下方）
          // 传统查找选择器
          'table#mytable', // 原有的表格选择器
          'div[style*="padding-right"]', // 包含表格的容器
          '.ant-descriptions', // Ant Design描述组件
          'table[role="grid"]', // 其他可能的表格
          // 底部区域
          '[class*="footer"]', // 包含 footer 的类名
          'footer', // 底部标签
          '.ant-layout-footer', // Ant Design 底部
          // 备选位置
          '#app-content .w-full > div:last-child', // 主内容的最后一个子元素
          '#app-content .w-full > div:first-child', // 导航栏下方
          '#app-content .w-full', // 主内容区域
          '#app-content', // 应用内容区域
          '.ant-layout', // Ant Design布局
          '#root > div > div' // React根容器下级
        ];

        for (const selector of selectors) {
          const target = document.querySelector(selector);
          if (target) {
            // 验证元素安全性
            if (target.tagName === 'HTML' || target.tagName === 'BODY' ||
                target.tagName === 'HEAD' || target === document.documentElement) {
              console.log(`[IYUU] MTeam-跳过不安全的元素: ${selector}`);
              continue;
            }

            console.log(`[IYUU] MTeam-找到插入位置: ${selector}`);

            try {
              // 特殊处理：如果是底部固定元素，在其上方插入
              if (selector.includes('fixed') && selector.includes('bottom')) {
                target.before(bar);
                return true;
              }

            // 特殊处理：如果是 MTeam 特有结构
            if (selector.includes('px-') || selector.includes('ant-row') || selector.includes('ant-divider')) {
              // 对于 MTeam 特有结构，直接在后方插入
              target.after(bar);
              return true;
            }

            // 特殊处理：如果是表格或容器，在其后方插入
            if (selector.includes('mytable') || selector.includes('padding-right') || selector.includes('descriptions')) {
              const container = target.closest('div') || target;
              if (container && container.tagName !== 'HTML' && container.tagName !== 'BODY') {
                container.after(bar);
                return true;
              }
            }

              // 特殊处理：如果是最后一个子元素，在其后方插入
              if (selector.includes('last-child')) {
                target.after(bar);
                return true;
              }

              // 默认处理：在元素后方或内部插入
              if (selector === '#app-content .w-full > div:first-child') {
                target.after(bar);
              } else {
                target.appendChild(bar);
              }
              return true;
            } catch (e) {
              console.log(`[IYUU] MTeam-插入失败 (${selector}):`, e.message);
              continue;
            }
          }
        }

        console.error('[IYUU] MTeam-未找到合适的插入位置，尝试备用方案');

        // 备用方案：直接插入到body底部
        try {
          document.body.appendChild(bar);
          console.log('[IYUU] MTeam-使用备用方案成功');
          return true;
        } catch (e) {
          console.error('[IYUU] MTeam-备用方案也失败:', e.message);
          return false;
        }
    } else {
      // 其他站点使用原有逻辑
      const mainTitle = document.querySelector('h1#top') || document.querySelector('h1');
      if (mainTitle) {
          mainTitle.after(bar);
          return true;
      } else {
          console.error('[IYUU] 未找到主标题，无法插入功能栏。');
          return false;
      }
    }
  }

  // 尝试插入UI，如果失败则等待后重试
  function attemptUIInsertion(retryCount = 0) {
    const maxRetries = 15; // 增加重试次数以等待动态内容加载
    const retryDelay = isMTeamSite() ? 800 : 500; // MTeam站点增加等待时间

    if (insertUIBar()) {
      console.log('[IYUU] UI插入成功');
      // 如果是MTeam站点，初始化相关事件
      if (isMTeamSite()) {
        setTimeout(initMTeamEvents, 100);
        // 延迟查找用户信息栏并重新定位
        setTimeout(() => {
          console.log('[IYUU] MTeam-尝试重新定位到用户信息栏下方');
          repositionToUserInfoBar();
        }, 3000); // 3秒后尝试重新定位
      }
      return;
    }

    if (retryCount < maxRetries) {
      console.log(`[IYUU] UI插入失败，${retryDelay}ms后重试 (${retryCount + 1}/${maxRetries})`);
      setTimeout(() => attemptUIInsertion(retryCount + 1), retryDelay);
    } else {
      console.error('[IYUU] UI插入最终失败，将附加到页面末尾');
      (document.body || document.documentElement).appendChild(bar);
      // 即使在页面末尾，也要初始化MTeam事件
      if (isMTeamSite()) {
        setTimeout(initMTeamEvents, 100);
      }
    }
  }

  // MTeam站点专用：重新定位到用户信息栏下方
  function repositionToUserInfoBar() {
    if (!isMTeamSite()) return;

    const iyuuBar = document.querySelector('.iyuu-topbar');
    if (!iyuuBar) {
      console.log('[IYUU] MTeam-未找到IYUU插件栏');
      return;
    }

    console.log('[IYUU] MTeam-开始查找用户信息栏...');

    // 查找包含特定文本的用户信息栏
    const antRowElements = document.querySelectorAll('.ant-row.ant-row-space-between.ant-row-middle');
    console.log('[IYUU] MTeam-找到ant-row元素数量:', antRowElements.length);

    for (const element of antRowElements) {
      const text = element.textContent || '';

      if (text.includes('魔力值') && text.includes('邀請') && text.includes('分享率') &&
          text.includes('上傳量') && text.includes('下載量')) {

        console.log('[IYUU] MTeam-找到用户信息栏');

        try {
          const container = element.closest('div[class*="px-"]') || element.parentElement;
          if (container && container !== element) {
            container.after(iyuuBar);
          } else {
            element.after(iyuuBar);
          }
          console.log('[IYUU] MTeam-重新定位成功');
          return;
        } catch (e) {
          console.log('[IYUU] MTeam-重新定位失败:', e.message);
        }
        break;
      }
    }

    console.log('[IYUU] MTeam-未找到匹配的用户信息栏');
  }

  // 执行UI插入
  if (isMTeamSite()) {
    // MTeam站点需要等待React渲染完成
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
          attemptUIInsertion();
          initMTeamEvents();
        }, 1000);
      });
    } else {
      setTimeout(() => {
        attemptUIInsertion();
        initMTeamEvents();
      }, 1000);
    }
  } else {
    // 其他站点立即插入
    attemptUIInsertion();
  }

  // MTeam站点专用：页面跳转清理机制（不影响现有功能）
  if (isMTeamSite()) {
    // 检测是否为种子详情页
    function isCurrentPageTorrentDetails() {
      const pathname = window.location.pathname;
      const search = window.location.search;
      return /\/t\/\d+/.test(pathname) || 
             /\/detail\/\d+/.test(pathname) || 
             /\/torrent\/\d+/.test(pathname) || 
             /\/details\.php/.test(pathname) ||
             /[?&]id=\d+/.test(search);
    }

    // 清理面板的函数
    function cleanupIYUUPanel() {
      const iyuuBar = document.querySelector('.iyuu-topbar');
      if (iyuuBar && !isCurrentPageTorrentDetails()) {
        iyuuBar.remove();
        console.log('[IYUU] MTeam-页面跳转清理：已移除IYUU面板');
      }
    }

    // 设置URL变化监听（不影响现有插入逻辑）
    let lastUrl = window.location.href;
    
    // 监听pushState和replaceState
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    history.pushState = function(...args) {
      originalPushState.apply(history, args);
      setTimeout(cleanupIYUUPanel, 300);
    };
    
    history.replaceState = function(...args) {
      originalReplaceState.apply(history, args);
      setTimeout(cleanupIYUUPanel, 300);
    };
    
    // 监听popstate事件（浏览器前进/后退）
    window.addEventListener('popstate', () => {
      setTimeout(cleanupIYUUPanel, 300);
    });
    
    // 定期检查URL变化（备用方案）
    setInterval(() => {
      const currentUrl = window.location.href;
      if (currentUrl !== lastUrl) {
        lastUrl = currentUrl;
        setTimeout(cleanupIYUUPanel, 300);
      }
    }, 1000);
    
    console.log('[IYUU] MTeam-页面跳转清理机制已启动');
  }


  /*** 元素引用（去除多余空格以免 no-multi-spaces） ***/
  const chipsEl = bar.querySelector('#iyuu-chips');
  const badgeEl = bar.querySelector('#iyuu-badge');
  const tokenMaskEl = bar.querySelector('#iyuu-token-mask');
  const tokenInput = bar.querySelector('#iyuu-token-input');
  const eyeBtn = bar.querySelector('#iyuu-eye');
  const saveBtn = bar.querySelector('#iyuu-save');
  const hashEl = bar.querySelector('#iyuu-hash');
  const msgEl = bar.querySelector('#iyuu-msg');
  // 新增：与 hash 同行的提示位
  const autoToggle = bar.querySelector('#iyuu-auto-toggle');
  const modeLabel = bar.querySelector('#iyuu-mode-label');
  const manualBtn = bar.querySelector('#iyuu-manual-query');
  const setBadge = (cls, text) => { badgeEl.className = `iyuu-badge ${cls || ''}`.trim(); badgeEl.textContent = text; };
  const setMessage = (text = '') => { msgEl.textContent = text || ''; };
  /*** 将技术错误“翻译成人话”，避免显示 HTTP 429/403 等码 ***/
  function humanizeError(err) {
    const raw = String((err && err.message) || err || '').toLowerCase();
    // 常见网络情形识别
    if (raw.includes('429') || raw.includes('too many') || raw.includes('频率') || raw.includes('limit')) {
      return '请求频繁，请稍后再试。';
    }
    if (raw.includes('timeout') || raw.includes('time out') || raw.includes('timed out')) {
      return '网络超时，请稍后再试。';
    }
    if (raw.includes('403') || raw.includes('forbidden') || raw.includes('unauthorized') || raw.includes('401')) {
      return '访问被拒绝，可能是 Token 无效。';
    }
    if (raw.includes('network') || raw.includes('failed to fetch') || raw.includes('error') || raw.includes('http')) {
      return '网络出现问题，稍后重试或检查网络环境。';
    }
    // 默认兜底：不给出代码，只给通用说明
    return '请求失败，请稍后再试。';
  }

  /*** 站点卡片 ***/
  const addChip = ({ label, href, ok = true, count = 1, iconURL = null }) => {
    const a = document.createElement(href ? 'a' : 'div');
    a.className = `iyuu-chip ${ok ? 'ok' : ''} ${iconURL ? '' : 'noicon'}`.trim();
    if (href) { a.href = href;
    a.target = '_blank'; a.rel = 'noopener noreferrer'; }
    if (iconURL) { const img = document.createElement('img');
    img.className = 'iyuu-icon'; img.src = iconURL; img.alt = ''; a.appendChild(img); }
    const nameEl = document.createElement('span');
    nameEl.className = 'iyuu-label'; nameEl.textContent = label; a.appendChild(nameEl);
    if (ok && count > 1) { const cnt = document.createElement('span');
    cnt.className = 'iyuu-count'; cnt.textContent = `（${count}）`; a.appendChild(cnt); }
    chipsEl.appendChild(a);
  };
  const showEmpty = (msg = '') => {
    if (msg) {
      const span = document.createElement('span');
      span.className = 'iyuu-empty';
      span.textContent = msg;
      chipsEl.appendChild(span);
    }
  };

  /*** Token 存取（逻辑不变） ***/
  const TOKEN_KEY = 'iyuu_crossseed_token_v1';
  const SID_SHA1_CACHE_KEY = 'iyuu_sid_sha1_cache_v1';
  function getStoredToken(){ try { return GM_getValue(TOKEN_KEY, '') || ''; } catch{} try { return localStorage.getItem(TOKEN_KEY) ||
  ''; } catch{} return ''; }
  function setStoredToken(v){ try { GM_setValue(TOKEN_KEY, v || '');
  } catch{} try { localStorage.setItem(TOKEN_KEY, v || ''); } catch{} }
  function getToken(){ const t = getStoredToken();
  if (t) return t; if (IYUU_TOKEN_DEFAULT) return IYUU_TOKEN_DEFAULT; return ''; }

  // MTeam API Key 管理
  function getMTeamApiKey() {
    try { return GM_getValue(MTEAM_API_KEY, '') || ''; } catch{}
    try { return localStorage.getItem(MTEAM_API_KEY) || ''; } catch{}
    return '';
  }
  function setMTeamApiKey(key) {
    try { GM_setValue(MTEAM_API_KEY, key || ''); } catch{}
    try { localStorage.setItem(MTEAM_API_KEY, key || ''); } catch{}
  }
  function maskMTeamApiKey(key) {
    if (!key) return '（未设置）';
    if (key.length <= 8) return key;
    return `${key.slice(0, 4)}…${key.slice(-4)}`;
  }

  // 验证MTeam API Key的有效性
  async function validateMTeamApiKey() {
    try {
      const apiKey = getMTeamApiKey();
      if (!apiKey) {
        console.log('[IYUU] MTeam API Key为空，验证失败');
        return false;
      }

      console.log('[IYUU] 开始验证MTeam API Key有效性');

      const baseUrl = `${window.location.protocol}//${window.location.hostname}`;
      const apiBaseUrl = baseUrl.replace(/(.+?)\u002e/, "https://api.");

      // 使用一个简单的API调用来验证API Key有效性
      // 这里使用一个不存在的种子ID，如果API Key有效应该返回“种子不存在”而不是“参数错误”
      return new Promise((resolve) => {
        const formData = new FormData();
        formData.append('id', '999999999'); // 使用不存在的种子ID

        const headers = {
          'x-api-key': apiKey,
          'Referer': window.location.href
        };

        GM_xmlhttpRequest({
          method: 'POST',
          url: `${apiBaseUrl}/api/torrent/genDlToken`,
          data: formData,
          headers: headers,
          timeout: 10000,
          onload: (response) => {
            try {
              const data = JSON.parse(response.responseText);
              console.log('[IYUU] MTeam API Key验证响应:', data);

              // 如果返回的错误不是“参数错误”，说明API Key是有效的
              // 即使种子不存在，API Key有效的情况下也会返回其他错误信息
              if (data.code === 1 && data.message === '參數錯誤') {
                // 参数错误通常意味着API Key无效
                console.log('[IYUU] MTeam API Key验证失败：参数错误（API Key可能无效）');
                resolve(false);
              } else if (data.code === 1 && data.message && data.message.includes('不存在')) {
                // 种子不存在错误，说明API Key有效
                console.log('[IYUU] MTeam API Key验证成功：种子不存在错误（API Key有效）');
                resolve(true);
              } else if (data.code === '0') {
                // 意外成功，说明API Key有效
                console.log('[IYUU] MTeam API Key验证成功：意外返回成功');
                resolve(true);
              } else {
                // 其他错误，认为API Key有效但有其他问题
                console.log('[IYUU] MTeam API Key验证结果不明，默认为有效:', data.message);
                resolve(true);
              }
            } catch (e) {
              console.log('[IYUU] MTeam API Key验证响应解析失败:', e.message);
              resolve(false);
            }
          },
          onerror: (error) => {
            console.log('[IYUU] MTeam API Key验证请求失败:', error);
            resolve(false);
          },
          ontimeout: () => {
            console.log('[IYUU] MTeam API Key验证请求超时');
            resolve(false);
          }
        });
      });
    } catch (error) {
      console.log('[IYUU] MTeam API Key验证异常:', error.message);
      return false;
    }
  }
  function clearSidSha1Cache(){ try { GM_deleteValue && GM_deleteValue(SID_SHA1_CACHE_KEY);
  } catch{} try { localStorage.removeItem(SID_SHA1_CACHE_KEY); } catch{} }
  function maskToken(t){ if(!t) return '（未设置）'; if(t.length<=8) return t; return `${t.slice(0,4)}…${t.slice(-4)}`;
  }
  function updateTokenMask(){ const t = getToken(); tokenMaskEl.textContent = maskToken(t); }
  updateTokenMask();
  eyeBtn.addEventListener('click', () => { tokenInput.type = tokenInput.type === 'password' ? 'text' : 'password'; });
  saveBtn.addEventListener('click', () => {
    const v = (tokenInput.value || '').trim();
    if (!v) { tokenInput.focus(); return; }
    setStoredToken(v); clearSidSha1Cache(); updateTokenMask(); tokenInput.value = '';
    if (getAutoQuery()) runDetection(); else parseHashOnly();
  });

  // MTeam API Key 管理
  function updateMTeamApiMask() {
    const mteamApiMaskEl = document.getElementById('mteam-api-mask');
    if (mteamApiMaskEl) {
      const key = getMTeamApiKey();
      mteamApiMaskEl.textContent = maskMTeamApiKey(key);
    }
  }

  // 显示MTeam配置区域（首次配置或API Key无效时）
  function showMTeamConfigPrompt() {
    if (!isMTeamSite()) return;

    const mteamConfig = document.getElementById('mteam-config');
    const mteamStatus = document.getElementById('mteam-status');

    if (mteamConfig && mteamStatus) {
      mteamConfig.style.display = 'block';
      mteamStatus.style.display = 'none';

      const mteamInput = document.getElementById('mteam-api-input');
      if (mteamInput) {
        mteamInput.focus();
        mteamInput.placeholder = '请输入MTeam API Key';
      }
    }
  }

  // 隐藏MTeam配置区域（API Key有效时）
  function hideMTeamConfigPrompt() {
    if (!isMTeamSite()) return;

    const mteamConfig = document.getElementById('mteam-config');
    const mteamStatus = document.getElementById('mteam-status');

    if (mteamConfig && mteamStatus) {
      mteamConfig.style.display = 'none';
      mteamStatus.style.display = 'block';

      // 更新状态显示
      const statusMask = document.getElementById('mteam-status-mask');
      if (statusMask) {
        const apiKey = getMTeamApiKey();
        statusMask.textContent = `✓ ${maskMTeamApiKey(apiKey)}`;
      }
    }
  }

  // 初始化MTeam相关事件
  function initMTeamEvents() {
    if (!isMTeamSite()) return;

    const mteamEyeBtn = document.getElementById('mteam-eye');
    const mteamApiInput = document.getElementById('mteam-api-input');
    const mteamSaveBtn = document.getElementById('mteam-save');

    if (mteamEyeBtn && mteamApiInput && mteamSaveBtn) {
      console.log('[IYUU] 初始化MTeam配置事件');
      updateMTeamApiMask();

      mteamEyeBtn.addEventListener('click', () => {
        mteamApiInput.type = mteamApiInput.type === 'password' ? 'text' : 'password';
      });

      mteamSaveBtn.addEventListener('click', async () => {
        const key = (mteamApiInput.value || '').trim();
        if (!key) {
          mteamApiInput.focus();
          return;
        }

        // 显示保存中状态
        const originalText = mteamSaveBtn.textContent;
        mteamSaveBtn.textContent = '验证中...';
        mteamSaveBtn.disabled = true;

        try {
          // 保存API Key
          setMTeamApiKey(key);
          updateMTeamApiMask();
          mteamApiInput.value = '';
          console.log('[IYUU] MTeam API Key 已保存');

          // 验证API Key的有效性
          const isValid = await validateMTeamApiKey();
          if (isValid) {
            // API Key有效，隐藏配置区域
            hideMTeamConfigPrompt();
            console.log('[IYUU] MTeam API Key 验证成功，配置区域已隐藏');
            // 重新检测
            if (getAutoQuery()) runDetection(); else parseHashOnly();
          } else {
            // API Key无效，显示错误信息
            mteamApiInput.placeholder = 'API Key无效，请重新输入';
            mteamApiInput.focus();
            console.log('[IYUU] MTeam API Key 验证失败');
          }
        } catch (error) {
          console.error('[IYUU] MTeam API Key 验证错误:', error);
          mteamApiInput.placeholder = '验证失败，请重试';
        } finally {
          // 恢复按钮状态
          mteamSaveBtn.textContent = originalText;
          mteamSaveBtn.disabled = false;
        }
      });

      // 绑定重新配置按钮事件
      const mteamReconfigBtn = document.getElementById('mteam-reconfig');
      if (mteamReconfigBtn) {
        mteamReconfigBtn.addEventListener('click', () => {
          showMTeamConfigPrompt();
          console.log('[IYUU] 用户请求重新配置MTeam API Key');
        });
      }

      // 如果没有API Key或API Key无效，显示配置区域
      const hasApiKey = !!getMTeamApiKey();
      if (!hasApiKey) {
        console.log('[IYUU] MTeam站点未配置API Key，请配置');
        showMTeamConfigPrompt();
      } else {
        console.log('[IYUU] MTeam站点已配置API Key');
        // 在后台验证API Key有效性
        validateMTeamApiKey().then(isValid => {
          if (!isValid) {
            console.log('[IYUU] MTeam API Key已失效，显示配置区域');
            showMTeamConfigPrompt();
          }
        }).catch(error => {
          console.log('[IYUU] MTeam API Key验证失败:', error.message);
        });
      }
    } else {
      console.log('[IYUU] MTeam配置元素未找到，稍后重试');
      setTimeout(initMTeamEvents, 200);
    }
  }
  /*** MTeam专用功能 ***/
  // MTeam专用的hash提取函数（使用与 PT-depiler 完全一致的方式）
  async function extractMTeamInfoHash() {
    try {
      const torrentId = getMTeamTorrentId();
      if (!torrentId) {
        console.log('[IYUU] MTeam-无法获取种子ID');
        return '';
      }

      const apiKey = getMTeamApiKey();
      if (!apiKey) {
        console.log('[IYUU] MTeam-未配置API Key');
        return '';
      }

      console.log('[IYUU] MTeam-开始获取下载链接然后从.torrent文件提取hash, 种子ID:', torrentId);

      // 第一步：获取下载链接（与PT-depiler完全一致）
      const downloadUrl = await getMTeamDownloadURL();
      if (!downloadUrl) {
        console.log('[IYUU] MTeam-获取下载链接失败');
        return '';
      }

      console.log('[IYUU] MTeam-获取下载链接成功，开始从.torrent文件提取hash');

      // 第二步：从.torrent文件提取hash
      return new Promise((resolve) => {
        GM_xmlhttpRequest({
          method: 'GET',
          url: downloadUrl,
          responseType: 'arraybuffer',
          timeout: 30000,
          headers: { 'Referer': window.location.href },
          onload: async (response) => {
            try {
              console.log('[IYUU] MTeam-.torrent文件下载成功，开始解析hash');
              const hash = await computeInfohashFromTorrentBytes(response.response);
              if (hash && /^[a-fA-F0-9]{40}$/.test(hash)) {
                console.log('[IYUU] MTeam-从.torrent文件提取hash成功:', hash);
                resolve(hash.toLowerCase());
              } else {
                console.log('[IYUU] MTeam-无法从.torrent文件提取有效hash');
                resolve('');
              }
            } catch (e) {
              console.log('[IYUU] MTeam-解析.torrent文件失败:', e.message);
              resolve('');
            }
          },
          onerror: (error) => {
            console.log('[IYUU] MTeam-下载.torrent文件失败:', error);
            resolve('');
          },
          ontimeout: () => {
            console.log('[IYUU] MTeam-下载.torrent文件超时');
            resolve('');
          }
        });
      });
      } catch (e) {
        console.log('[IYUU] MTeam-提取hash异常:', e.message);
        // hash提取异常可能是API Key问题，显示配置区域
        setTimeout(() => showMTeamConfigPrompt(), 100);
        return '';
      }
  }

  // 获取MTeam种子ID
  function getMTeamTorrentId() {
    const match = window.location.pathname.match(/\/detail\/(\d+)/);
    return match ? match[1] : null;
  }

  /*** Hash 提取/.torrent 解析（逻辑不变） ***/
  const B32MAP = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  function base32ToHex(b32){
    b32 = (b32 || '').replace(/=+$/,'').toUpperCase();
    let bits = '', hex = '';
    for (const ch of b32){ const v = B32MAP.indexOf(ch); if(v<0) return '';
    bits += v.toString(2).padStart(5,'0'); }
    for (let i=0; i+8<=bits.length; i+=8) hex += parseInt(bits.slice(i,i+8),2).toString(16).padStart(2,'0');
    return hex;
  }

  function extractInfoHashEnhanced() {
    try {
      console.log('[IYUU] Hash提取-开始页面扫描');

      // 如果是MTeam站点，直接返回空，由专用函数处理
      if (isMTeamSite()) {
        console.log('[IYUU] 检测到MTeam站点，使用专用API提取');
        return '';
      }

      // 方法1: 扫描script标签
      for (const code of Array.from(document.scripts).map(s => s.textContent || '')) {
        const m = code.match(/['"]([a-fA-F0-9]{40})['"]/);
        if (m) {
          console.log('[IYUU] Hash提取-通过script找到:', m[1]);
          return m[1].toLowerCase();
        }
      }

      // 方法2: 扫描页面文本
      const m2 = (document.body.innerText || '').match(/\b([a-fA-F0-9]{40})\b/);
      if (m2) {
        console.log('[IYUU] Hash提取-通过页面文本找到:', m2[1]);
        return m2[1].toLowerCase();
      }

      // 方法3: URL参数
      const usp = new URL(location.href).searchParams;
      const urlHash = usp.get('infohash') || usp.get('hash');
      if (urlHash && /^[a-fA-F0-9]{40}$/.test(urlHash)) {
        console.log('[IYUU] Hash提取-通过URL参数找到:', urlHash);
        return urlHash.toLowerCase();
      }

      // 方法4: magnet链接
      for (const a of Array.from(document.querySelectorAll('a[href^="magnet:"]'))) {
        const u = new URL(a.getAttribute('href'));
        const xt = (u.searchParams.get('xt') || '').split(':').pop();
        if (!xt) continue;
        if (/^[a-fA-F0-9]{40}$/.test(xt)) {
          console.log('[IYUU] Hash提取-通过magnet链接找到:', xt);
          return xt.toLowerCase();
        }
        if (/^[A-Z2-7]{32}$/i.test(xt)) {
          const hex = base32ToHex(xt);
          if (hex && hex.length >= 40) {
            console.log('[IYUU] Hash提取-通过magnet(base32)找到:', hex.slice(0,40));
            return hex.slice(0,40).toLowerCase();
          }
        }
      }

      // 方法5: 特定属性
      const attrHex = document.querySelector('[data-infohash], [data-hash], [title*="infohash"], [title*="Info Hash"]');
      if (attrHex){
        const cands = [attrHex.getAttribute('data-infohash'), attrHex.getAttribute('data-hash'), attrHex.getAttribute('title')].filter(Boolean).join(' ');
        const m = cands.match(/\b([a-fA-F0-9]{40})\b/);
        if (m) {
          console.log('[IYUU] Hash提取-通过元素属性找到:', m[1]);
          return m[1].toLowerCase();
        }
      }

      console.log('[IYUU] Hash提取-页面扫描无结果');
    } catch(e) {
      console.log('[IYUU] Hash提取-页面扫描异常:', e.message);
    }
    return '';
  }

  // MTeam专用的下载链接获取函数
  async function getMTeamDownloadURL() {
    try {
      const torrentId = getMTeamTorrentId();
      if (!torrentId) {
        console.log('[IYUU] MTeam-无法获取种子ID');
        return '';
      }

      const apiKey = getMTeamApiKey();
      if (!apiKey) {
        console.log('[IYUU] MTeam-未配置API Key');
        return '';
      }

      const baseUrl = `${window.location.protocol}//${window.location.hostname}`;
      const apiBaseUrl = baseUrl.replace(/(.+?)\u002e/, "https://api.");

      return new Promise((resolve) => {
        // 使用与 PT-depiler 完全一致的请求格式：FormData + 删除Content-Type
        const formData = new FormData();
        formData.append('id', torrentId);

        console.log(`[IYUU] MTeam-下载链接请求参数: id=${torrentId}`);
        console.log(`[IYUU] MTeam-下载链接请求URL: ${apiBaseUrl}/api/torrent/genDlToken`);
        console.log(`[IYUU] MTeam-使用FormData格式发送请求`);

        // 构建请求头（不包含Content-Type，让浏览器自动设置boundary）
        const headers = {
          'x-api-key': apiKey,
          'Referer': window.location.href
        };

        GM_xmlhttpRequest({
          method: 'POST',
          url: `${apiBaseUrl}/api/torrent/genDlToken`,
          data: formData,
          headers: headers,
          timeout: 15000,
          onload: (response) => {
            try {
              console.log(`[IYUU] MTeam-下载链接API响应状态: ${response.status}`);
              console.log(`[IYUU] MTeam-下载链接API响应: ${response.responseText}`);

              const data = JSON.parse(response.responseText);
              // 使用与 PT-depiler 完全一致的响应检查逻辑
              if ((data.code === '0' || data.message === 'SUCCESS') && data.data) {
                console.log('[IYUU] MTeam-获取下载链接成功:', data.data);
                // 检查返回的是否为有效的HTTP URL
                if (typeof data.data === 'string' && data.data.startsWith('http')) {
                  resolve(data.data);
                } else {
                  console.log('[IYUU] MTeam-响应数据格式不正确:', data.data);
                  resolve('');
                }
              } else {
                console.log('[IYUU] MTeam-获取下载链接失败:', data.message || '未知错误', '错误代码:', data.code);
                // 如果是参数错误，可能是API Key无效，显示配置区域
                if (data.code === 1 && data.message === '參數錯誤') {
                  console.log('[IYUU] MTeam API Key可能无效，显示配置区域');
                  setTimeout(() => showMTeamConfigPrompt(), 100);
                }
                resolve('');
              }
            } catch (e) {
              console.log('[IYUU] MTeam-解析下载响应失败:', e.message);
              console.log('[IYUU] MTeam-原始下载响应:', response.responseText);
              resolve('');
            }
          },
          onerror: (error) => {
            console.log('[IYUU] MTeam-下载链接请求失败:', error);
            // 网络错误可能是API Key问题，显示配置区域
            setTimeout(() => showMTeamConfigPrompt(), 100);
            resolve('');
          },
          ontimeout: () => {
            console.log('[IYUU] MTeam-下载链接请求超时');
            resolve('');
          }
        });
      });
    } catch (e) {
      console.log('[IYUU] MTeam-获取下载链接异常:', e.message);
      return '';
    }
  }

  function findTorrentDownloadURL() {
    // 如果是MTeam站点，返回空，由专用函数处理
    if (isMTeamSite()) {
      console.log('[IYUU] MTeam站点使用API获取下载链接');
      return '';
    }

    const passkeyA = Array.from(document.querySelectorAll('a[href*="download.php?id="]'))
      .find(a => /passkey=/.test(a.getAttribute('href') || ''));
    if (passkeyA) return new URL(passkeyA.getAttribute('href'), location.href).href;
    const a = document.querySelector('a[href*="download.php?id="], a[href*="/download.php?id="]');
    if (a) return new URL(a.getAttribute('href'), location.href).href;
    // TTG站点支持: 查找 /dl/ 路径的torrent下载链接
    const ttgA = document.querySelector('a[href*="/dl/"][href$=".torrent"]');
    if (ttgA) return new URL(ttgA.getAttribute('href'), location.href).href;
    const byText = Array.from(document.querySelectorAll('a')).find(x => /下载种子|下载地址|\.torrent/i.test(x.textContent || ''));
    if (byText) return new URL(byText.getAttribute('href'), location.href).href;
    const onclickA = Array.from(document.querySelectorAll('a[onclick]')).find(x => /download\.php\?id=\d+/.test(x.getAttribute('onclick') || ''));
    if (onclickA) { const m = (onclickA.getAttribute('onclick') || '').match(/download\.php\?id=\d+/i);
    if (m) return new URL(m[0], location.href).href; }
    return '';
  }

  async function fetchInfohashFromTorrent() {
    let href = '';

    // 如果是MTeam站点，使用专用API获取下载链接
    if (isMTeamSite()) {
      if (!getMTeamApiKey()) {
        console.log('[IYUU] MTeam-未配置API Key，无法获取下载链接');
        return '';
      }
      try {
        href = await getMTeamDownloadURL();
        console.log('[IYUU] MTeam-获取下载链接成功:', href);
      } catch (e) {
        console.log('[IYUU] MTeam-获取下载链接异常:', e.message);
        // 异常可能是API Key问题，显示配置区域
        setTimeout(() => showMTeamConfigPrompt(), 100);
        return '';
      }
    } else {
      href = findTorrentDownloadURL();
    }

    console.log('[IYUU] Torrent下载-检测到下载链接:', href || '未找到');
    if (!href) return '';

    return new Promise((resolve) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url: href,
        responseType: 'arraybuffer',
        timeout: 30000,
        anonymous: false,
        headers: { Referer: location.href },
        onload: async (r) => {
          try {
            console.log('[IYUU] Torrent下载-HTTP状态:', r.status);
            console.log('[IYUU] Torrent下载-响应头:', r.responseHeaders);

            const headers = (r.responseHeaders || '').toLowerCase();
            if (headers.includes('content-type: text/html') && !headers.includes('application/x-bittorrent')) {
              console.log('[IYUU] Torrent下载-响应为HTML页面，非torrent文件');
              return resolve('');
            }

            const buf = r.response;
            if (!buf) {
              console.log('[IYUU] Torrent下载-响应体为空');
              return resolve('');
            }

            console.log('[IYUU] Torrent下载-文件大小:', buf.byteLength, 'bytes');
            console.log('[IYUU] Torrent下载-开始解析torrent文件');

            const ih = await computeInfohashFromTorrentBytes(buf);
            console.log('[IYUU] Torrent解析-结果:', ih || '解析失败');
            resolve(ih || '');
          } catch(e) {
            console.log('[IYUU] Torrent下载-解析异常:', e.message);
            resolve('');
          }
        },
        onerror: (e) => {
          console.log('[IYUU] Torrent下载-网络错误:', e);
          resolve('');
        },
        ontimeout: () => {
          console.log('[IYUU] Torrent下载-请求超时');
          resolve('');
        }
      });
    });
  }

  async function computeInfohashFromTorrentBytes(buf) {
    const b = new Uint8Array(buf);
    function readLen(pos) {
      let i = pos, len = 0;
      if (i >= b.length || b[i] < 0x30 || b[i] > 0x39) throw new Error('len: expect digit');
      while (i < b.length && b[i] >= 0x30 && b[i] <= 0x39) { len = len * 10 + (b[i] - 0x30);
      i++; }
      if (b[i] !== 0x3A) throw new Error('len: missing colon');
      return { len, next: i + 1 };
    }

    function readValueEnd(pos) {
      const c = b[pos];
      if (c === 0x69) { // int
        let i = pos + 1;
        if (b[i] === 0x2D) i++;
        if (i >= b.length || b[i] < 0x30 || b[i] > 0x39) throw new Error('int: expect digit');
        while (i < b.length && b[i] >= 0x30 && b[i] <= 0x39) i++;
        if (b[i] !== 0x65) throw new Error('int: missing e');
        return i + 1;
      }
      if (c === 0x6C) { // list
        let i = pos + 1;
        while (b[i] !== 0x65) { i = readValueEnd(i); }
        return i + 1;
      }
      if (c === 0x64) { // dict
        let i = pos + 1;
        while (b[i] !== 0x65) {
          const { len, next } = readLen(i);
          const keyStart = next, keyEnd = next + len;
          const key = new TextDecoder().decode(b.slice(keyStart, keyEnd));
          i = keyEnd;
          if (key === 'info') {
            const valStart = i;
            const valEnd = readValueEnd(i);
            const endPos = (typeof valEnd === 'number') ? valEnd : valEnd.end;
            const infoSlice = b.slice(valStart, endPos);
            return crypto.subtle.digest('SHA-1', infoSlice).then(d => {
              const hex = Array.from(new Uint8Array(d)).map(x => x.toString(16).padStart(2,'0')).join('');
              return { end: endPos, infohash: hex };
            });
          } else {
            i = readValueEnd(i);
          }
        }
        return i + 1;
      }
      if (c >= 0x30 && c <= 0x39) { // str
        const { len, next } = readLen(pos);
        return next + len;
      }
      throw new Error('value: bad prefix ' + c);
    }

    if (b[0] !== 0x64) throw new Error('torrent root not dict');
    let i = 1;
    while (b[i] !== 0x65) {
      const { len, next } = readLen(i);
      const keyStart = next, keyEnd = next + len;
      const key = new TextDecoder().decode(b.slice(keyStart, keyEnd));
      i = keyEnd;
      if (key === 'info') {
        const valStart = i;
        const out = await readValueEnd(i);
        if (typeof out === 'object' && out.infohash) return out.infohash;
        const infoSlice = b.slice(valStart, out);
        const d = await crypto.subtle.digest('SHA-1', infoSlice);
        return Array.from(new Uint8Array(d)).map(x => x.toString(16).padStart(2,'0')).join('');
      } else {
        i = await readValueEnd(i);
      }
    }
    return '';
  }

  /*** API 封装（逻辑不变） ***/
  const API_BASE = 'https://2025.iyuu.cn';
  const httpGet = (url, headers={}) => new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method:'GET', url, headers: Object.assign({'Token': getToken()}, headers), timeout: 20000,
      onload:r=> (r.status>=200 && r.status<300) ? resolve(r.responseText) : reject(new Error(`HTTP ${r.status}`)),
      onerror:reject, ontimeout:()=>reject(new Error('timeout'))
    });
  });
  const httpPost = (url, data, headers={}) => new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method:'POST', url, data, headers: Object.assign({'Token': getToken()}, headers), timeout: 20000,
      onload:r=> (r.status>=200 && r.status<300) ? resolve(r.responseText) : reject(new Error(`HTTP ${r.status}`)),
      onerror:reject, ontimeout:()=>reject(new Error('timeout'))
    });
  });
  async function sha1Hex(str){ const enc=new TextEncoder().encode(str); const buf=await crypto.subtle.digest('SHA-1', enc); return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,'0')).join('');
  }
  function loadSidSha1(){ try { const o=JSON.parse(localStorage.getItem('iyuu_sid_sha1_cache_v1')||'{}'); if(o.sid_sha1 && o.expire>Date.now()) return o.sid_sha1; } catch{} return null;
  }
  function saveSidSha1(v){ try { const seven=7*24*3600*1000; const o={sid_sha1:v, expire:Date.now()+seven}; localStorage.setItem('iyuu_sid_sha1_cache_v1', JSON.stringify(o));
  } catch{} }

  /*** 模式 UI 联动（逻辑不变） ***/
  function updateAutoQueryUI(){
    const isAuto = getAutoQuery();
    autoToggle.checked = isAuto;
    modeLabel.textContent = isAuto ? '自动查询' : '手动查询';
    manualBtn.style.display = isAuto ? 'none' : '';
  }

  /*** 手动模式：仅解析 hash（无“点击右下角查询”提示） ***/
  async function parseHashOnly() {
    chipsEl.innerHTML = '';
    setMessage('');

    let infohash = '';

    // 如果是MTeam站点，使用与 PT-depiler 一致的方式
    if (isMTeamSite()) {
      if (!getMTeamApiKey()) {
        setBadge('err','失败');
        hashEl.textContent = 'hash: 未识别';
        setMessage('MTeam站点需要配置API Key，请在右上角输入框中配置。');
        showEmpty();
        return;
      }
      try {
        // 使用新的hash提取方法（通过.torrent文件）
        infohash = await extractMTeamInfoHash();
        console.log('[IYUU] MTeam-hash提取结果:', infohash || '失败');

        // 如果hash提取失败，可能是API Key问题
        if (!infohash) {
          console.log('[IYUU] MTeam-hash提取失败，显示配置区域');
          setTimeout(() => showMTeamConfigPrompt(), 100);
        }
      } catch (e) {
        console.log('[IYUU] MTeam-hash提取异常:', e.message);
        // 异常情况下显示配置区域
        setTimeout(() => showMTeamConfigPrompt(), 100);
      }
    } else {
      infohash = extractInfoHashEnhanced();
      if (!infohash) {
        try {
          infohash = await fetchInfohashFromTorrent();
        } catch {}
      }
    }

    if (!infohash) {
      setBadge('err','失败');
      hashEl.textContent = 'hash: 未识别';
      if (isMTeamSite()) {
        setMessage('MTeam API调用失败，请检查API Key是否正确。');
      } else {
        setMessage('当前页面未能识别到 infohash。已尝试 .torrent 解析仍失败（可能为 v2-only 或下载被替换为 HTML）。');
      }
      showEmpty();
      return;
    }
    hashEl.textContent = `hash: ${infohash.slice(0,8)}…`;
    setBadge('', '待检测');
  }

  /*** 主流程（逻辑不变；错误提示人类化并放在hash同行） ***/
  async function runDetection(forceApi = false){
    const isAuto = getAutoQuery();
    if (!isAuto && !forceApi) { await parseHashOnly(); return; }

    chipsEl.innerHTML = '';
    setMessage('');

    let infohash = '';

    // 如果是MTeam站点，使用与 PT-depiler 一致的方式
    if (isMTeamSite()) {
      console.log('[IYUU] 步骤1-检测到MTeam站点');
      if (!getMTeamApiKey()) {
        setBadge('err','失败');
        setMessage('MTeam站点需要配置API Key，请在右上角输入框中配置。');
        showEmpty();
        return;
      }
      try {
        // 使用新的hash提取方法（通过.torrent文件）
        infohash = await extractMTeamInfoHash();
        console.log('[IYUU] 步骤1-MTeam hash提取结果:', infohash || '失败');

        // 如果hash提取失败，可能是API Key问题
        if (!infohash) {
          console.log('[IYUU] MTeam-hash提取失败，显示配置区域');
          setTimeout(() => showMTeamConfigPrompt(), 100);
        }
      } catch(e) {
        console.log('[IYUU] 步骤1-MTeam hash提取异常:', e.message);
        // 异常情况下显示配置区域
        setTimeout(() => showMTeamConfigPrompt(), 100);
      }
    } else {
      infohash = extractInfoHashEnhanced();
      console.log('[IYUU] 步骤1-页面提取 infohash:', infohash || '未找到');

      if (!infohash) {
        console.log('[IYUU] 步骤2-尝试从.torrent文件提取');
        try {
          infohash = await fetchInfohashFromTorrent();
          console.log('[IYUU] 步骤2-torrent文件提取结果:', infohash || '失败');
        } catch(e) {
          console.log('[IYUU] 步骤2-torrent提取异常:', e.message);
        }
      }
    }

    if (!infohash) {
      setBadge('err','失败');
      hashEl.textContent = 'hash: 未识别';
      if (isMTeamSite()) {
        setMessage('MTeam API调用失败，请检查API Key是否正确。');
      } else {
        setMessage('当前页面未能识别到 infohash。已尝试 .torrent 解析仍失败（可能为 v2-only 或下载被替换为 HTML）。');
      }
      showEmpty();
      return;
    } else {
      hashEl.textContent = `hash: ${infohash.slice(0,8)}…`;
      console.log('[IYUU] 步骤3-最终使用 infohash:', infohash);
    }

    const token = getToken();
    if (!token) {
      setBadge('err','失败');
      setMessage('请在右上角输入框粘贴 Token 并点击"保存Token"。');
      showEmpty();
      return;
    }

    try {
      setBadge('', '检测中');
      console.log('[IYUU] 步骤4-开始API检测流程');
      const sitesResp = JSON.parse(await httpGet(`${API_BASE}/reseed/sites/index`));
      if (sitesResp.code !== 0) throw new Error(sitesResp.msg || 'sites/index 失败');
      const sites = sitesResp.data?.sites ||
      [];
      const allSid = sites.map(s => s.id);
      console.log('[IYUU] 步骤4-获取站点列表成功，共', sites.length, '个站点');

      let sid_sha1 = loadSidSha1();
      if (!sid_sha1) {
        console.log('[IYUU] 步骤5-需要获取sid_sha1');
        const reportResp = JSON.parse(await httpPost(
          `${API_BASE}/reseed/sites/reportExisting`,
          JSON.stringify({ sid_list: allSid }),
          { 'Content-Type':'application/json' }
        ));
        if (reportResp.code !== 0) throw new Error(reportResp.msg || 'reportExisting 失败');
        sid_sha1 = reportResp.data?.sid_sha1; if (!sid_sha1) throw new Error('缺少 sid_sha1');
        saveSidSha1(sid_sha1);
        console.log('[IYUU] 步骤5-获取sid_sha1成功');
      } else {
        console.log('[IYUU] 步骤5-使用缓存的sid_sha1');
      }

      const hashes = [infohash].sort();
      const jsonStr = JSON.stringify(hashes);
      const sha1 = await sha1Hex(jsonStr);
      const timestamp = Math.floor(Date.now()/1000).toString();
      const version = '8.2.0';

      console.log('[IYUU] 步骤6-请求参数准备完成');
      console.log('[IYUU] - 查询hash:', infohash);
      console.log('[IYUU] - hash数组:', jsonStr);
      console.log('[IYUU] - SHA1签名:', sha1);
      console.log('[IYUU] - 时间戳:', timestamp);

      const form = new URLSearchParams();
      form.set('hash', jsonStr); form.set('sha1', sha1); form.set('sid_sha1', sid_sha1);
      form.set('timestamp', timestamp); form.set('version', version);

      console.log('[IYUU] 步骤7-发送辅种查询请求');
      const reseedResp = JSON.parse(await httpPost(
        `${API_BASE}/reseed/index/index`,
        form.toString(),
        { 'Content-Type': 'application/x-www-form-urlencoded' }
      ));
      console.log('[IYUU] 步骤7-API响应:', reseedResp);

      // 特殊处理：未查询到数据不算错误，是正常业务情况
      if (reseedResp.code === 400 && reseedResp.msg === '未查询到可辅种数据') {
        setBadge('no','未发现');
        setMessage('该种子暂无可辅种站点');
        showEmpty();
        console.log('[IYUU] 步骤7-正常结果：IYUU数据库中无此种子的辅种数据');
        return;
      }

      if (reseedResp.code !== 0) throw new Error(reseedResp.msg || 'reseed/index 失败');
      const data = reseedResp.data || {};
      const firstKey = Object.keys(data)[0];
      const items = (firstKey && data[firstKey]?.torrent) ? data[firstKey].torrent : [];
      console.log('[IYUU] 步骤8-解析结果');
      console.log('[IYUU] - 响应数据键:', Object.keys(data));
      console.log('[IYUU] - 第一个键:', firstKey);
      console.log('[IYUU] - 找到的种子数量:', items.length);
      if (!items.length) {
        setBadge('no','未发现');
        setMessage('该种子暂无可辅种站点');
        showEmpty();
        console.log('[IYUU] 步骤8-没有找到可辅种的站点');
        return;
      }

      setBadge('ok','已获取');

      const bySid = new Map();
      for (const t of items) {
        const sid = t.sid;
        if (!bySid.has(sid)) bySid.set(sid, []);
        bySid.get(sid).push(t);
      }

      for (const [sid, arr] of bySid.entries()) {
        const s = sites.find(x => x.id === sid);
        if (!s) continue;
        const id = arr[0].torrent_id;
        const scheme = (s.is_https === 0) ? 'http' : 'https';
        const details = (s.details_page || 'details.php?id={}').replace('{}', id);

        // 特殊处理MTeam站点的域名问题
        let baseUrl = s.base_url;
        if (s.base_url && s.base_url.includes('api.m-team.')) {
          baseUrl = s.base_url.replace('api.m-team.', 'kp.m-team.');
          console.log('[IYUU] MTeam域名修正:', s.base_url, '->', baseUrl);
        }

        const href = `${scheme}://${baseUrl}/${details}`;
        const iconURL = lookupIconURL({ sid, nickname: s.nickname, site: s.site });
        const label = s.nickname || s.site || String(sid);
        addChip({ label, href, ok: true, count: arr.length, iconURL });
      }
    } catch (e) {
      setBadge('err','失败');
      setMessage(humanizeError(e));
      showEmpty();
      // 不再把原始技术码暴露给用户
      try { console.error('[IYUU-crossseed]', e);
      } catch {}
    }
  }

  /*** 绑定与初始化（逻辑不变） ***/
  function initAutoToggle(){
    autoToggle.checked = getAutoQuery();
    updateAutoQueryUI();
    autoToggle.addEventListener('change', async () => {
      const willAuto = autoToggle.checked;
      setAutoQuery(willAuto);
      updateAutoQueryUI();
      if (willAuto) runDetection(); else parseHashOnly();
    });
  }

  manualBtn.addEventListener('click', () => { runDetection(true); });

  initAutoToggle();

  // 针对MTeam站点的特殊处理
    if (isMTeamSite()) {
      if (!getMTeamApiKey()) {
        setBadge('err','失败');
        setMessage('MTeam站点需要配置API Key，请在右上角输入框中配置。');
        showEmpty();
        // 显示配置区域
        setTimeout(() => showMTeamConfigPrompt(), 100);
      } else if (getToken()) {
        if (getAutoQuery()) runDetection(); else parseHashOnly();
      } else {
        setBadge('err','失败');
        setMessage('请在右上角输入框粘贴 IYUU Token 并点击“保存Token”。');
        showEmpty();
      }
  } else {
    // 其他站点的原有逻辑
    if (getToken()) {
      if (getAutoQuery()) runDetection(); else parseHashOnly();
    } else {
      setBadge('err','失败');
      setMessage('请在右上角输入框粘贴 Token 并点击“保存Token”。');
      showEmpty();
    }
  }
})();