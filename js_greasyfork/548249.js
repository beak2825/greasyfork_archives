// ==UserScript==
// @name         更简洁的Bing搜索主页
// @version      1.01
// @description  让bing搜索更简洁，隐藏热点、新闻、菜单栏、测验、页脚信息模块和锁定页面滑动。
// @match        *://*.bing.com/*
// @exclude       *://*.bing.com/search?*
// @run-at       document-start
// @grant        GM_addStyle
// @license GPL-3.0
// @namespace https://greasyfork.org/users/1511445
// @downloadURL https://update.greasyfork.org/scripts/548249/%E6%9B%B4%E7%AE%80%E6%B4%81%E7%9A%84Bing%E6%90%9C%E7%B4%A2%E4%B8%BB%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/548249/%E6%9B%B4%E7%AE%80%E6%B4%81%E7%9A%84Bing%E6%90%9C%E7%B4%A2%E4%B8%BB%E9%A1%B5.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /* ************* 0 = 开启 | 1 = 隐藏 ************* */
  const hideList = {
    vs:               1, // 下滑页面（禁止滚动后，也不可见）
    footer:           1, // 页脚（禁止滚动，也后不可见）
    mc_caro:          0, // 测验/背景图片/反馈（=1时，下面4个选项将会无效,且一起隐藏）
    hp_trivia_inner:  1, // 必应主页测验
    musCard:          0, // 背景图片切换
    musCardCont:      1, // 背景图片介绍
    sb_feedback:      0, // 底部反馈
  /*官方设置功能      =1时，隐藏且官方设置修改失效*/
    below_sbox:      1, //必应上的热点
    modules_wrapper: 1, //新闻和关注
    scopes:          1 //菜单栏
  };

  const hideScrollbar = 0; // 1 = 隐藏滚动条
  const lockScroll    = 1; // 1 = 彻底禁止滚动

  const hp_body   = 0; // 1 = 显示主页大图；0 = 隐藏并启用官方无图模式；3=默认官方设置
  const expandRow = 1; //1= 背景图片切换/信息固定左下角；0 = 默认（隐藏新闻和关注时，可能会导致位置处于页面中心）
  /* ************************************************ */

  const map = {
    vs: '.vs',
    footer: 'footer',
    mc_caro: '.mc_caro',
    hp_trivia_inner: '.hp_trivia_inner',
    musCard: '.musCard',
    musCardCont: '.musCardCont',
    sb_feedback: '#sb_feedback',
    below_sbox: '.below_sbox',
    modules_wrapper: '.modules_wrapper',
    scopes: '.scopes'
  };

  /* 1. 隐藏模块 */
  let css = Object.keys(hideList)
    .filter(k => hideList[k])
    .map(k => map[k])
    .join(', ') + ' { display: none !important; }';

  /* 2. 主页背景模式：只在 .hp_body 的 <div> 上切换类 */
    function setHpBg() {
        /* 拿第一个拥有 .hp_body 的 div（Bing 首页背景容器） */
        const hp = document.querySelector('div.hp_body');
        if (!hp) return;          // 还没渲染就等下次

        hp.classList.remove('hp_body', 'no_image'); // 先清旧类

        if (hp_body === 0) {
            hp.classList.add('hp_body');// 有图模式
        } else if(hp_body===1){
            hp.classList.add('hp_body', 'no_image'); // 无图模式
        }
    }

    /* 节点已存在就立即执行，否则等 DOM 出现 */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setHpBg);
    } else {
        setHpBg();
    }

    /* 若 Bing 后续整页替换，再补一次 */
    new MutationObserver(setHpBg).observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    /* 3. 展开/收起：1 = 强制收起（替换类名） */
    if (expandRow === 1) {
        // 提前抢在 Bing 渲染前改掉，避免闪烁
        const patchScrollCont = () => {
            const el = document.getElementById('scroll_cont');
            if (el) {
                el.className = 'scroll_cont show_none';
            } else {
                // 如果还没渲染，轮询一次
                requestAnimationFrame(patchScrollCont);
            }
        };
        // 立即执行
        patchScrollCont();
    }

  /* 4. 滚动条 / 滚动锁定 */
  if (lockScroll) {
    css += `
      html,body{overflow:hidden!important;height:100%!important;}
      ::-webkit-scrollbar{width:0!important;height:0!important;}
      html{scrollbar-width:none;-ms-overflow-style:none;}
    `;
  } else if (hideScrollbar) {
    css += `
      ::-webkit-scrollbar{width:0!important;height:0!important;}
      html{scrollbar-width:none;-ms-overflow-style:none;}
    `;
  }

  GM_addStyle(css);
})();