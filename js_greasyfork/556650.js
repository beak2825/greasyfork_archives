// ==UserScript==
// @namespace   zhihu_zhuanlan_redirect_mobile
// @version     1.0.0
// @license     MIT
// @auther      MZ
// @name        知乎移动端专栏重定向
// @match       https://www.zhihu.com/oia/articles/*
// @description 知乎移动端，阅读专栏点击文章时，跳转到下载页面后会重定向至你点击的文章，功能简单专一
// @downloadURL https://update.greasyfork.org/scripts/556650/%E7%9F%A5%E4%B9%8E%E7%A7%BB%E5%8A%A8%E7%AB%AF%E4%B8%93%E6%A0%8F%E9%87%8D%E5%AE%9A%E5%90%91.user.js
// @updateURL https://update.greasyfork.org/scripts/556650/%E7%9F%A5%E4%B9%8E%E7%A7%BB%E5%8A%A8%E7%AB%AF%E4%B8%93%E6%A0%8F%E9%87%8D%E5%AE%9A%E5%90%91.meta.js
// ==/UserScript==

// 检查当前URL是否匹配目标模式
 if (window.location.href.match(/https:\/\/www\.zhihu\.com\/oia\/articles\/(\d+)/)) {
    
// 提取文章ID
 const articleId = window.location.href.match(/https:\/\/www\.zhihu\.com\/oia\/articles\/(\d+)/)[1];
    
 console.log('提取到的文章ID:', articleId);
    
// 构建新的URL并跳转
 const newUrl = `https://zhuanlan.zhihu.com/p/${articleId}`;
 window.location.href = newUrl;
    
// 可选：添加跳转确认（如果需要）
// if (confirm(`是否跳转到: ${newUrl}`)) {
//     window.location.href = newUrl;
// }
 }