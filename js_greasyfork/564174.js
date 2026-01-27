// ==UserScript==
// @name            Safari · Google 重定向
// @namespace       https://github.com/garinasset/SafariGoogleRedirect
// @version         1.0.1
//
// @description     在 Safari 浏览器中，自动将访问的"Google 中国"搜索页面（www.google.cn）重定向到国际版"Google"搜索页面（www.google.com），以避免因"Google 中国"的限制而无法正常使用搜索功能。
//
// @author          garinasset
// @license         MIT
//
// @homepageURL     https://github.com/garinasset/SafariGoogleRedirect
// @supportURL      https://github.com/garinasset/SafariGoogleRedirect/issues
//
// @match           http://www.google.cn/search*
// @match           https://www.google.cn/search*
//
// @run-at          document-start
//
// @downloadURL https://update.greasyfork.org/scripts/564174/Safari%20%C2%B7%20Google%20%E9%87%8D%E5%AE%9A%E5%90%91.user.js
// @updateURL https://update.greasyfork.org/scripts/564174/Safari%20%C2%B7%20Google%20%E9%87%8D%E5%AE%9A%E5%90%91.meta.js
// ==/UserScript==


(function() {
    const url = new URL(location.href);
    const q = url.searchParams.get('q');
    if (!q) return;

    // 构造最小 URL
    const cleanUrl = new URL('https://www.google.com/search');
    cleanUrl.searchParams.set('q', q);

    // 检测用户主题模式
    const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const background = isDark ? '#181818' : '#fff';
    const loaderBorder = isDark ? '#555' : '#f3f3f3';
    const loaderTop = isDark ? '#1a73e8' : '#4285f4';

    // 显示临时中间层页面（Logo + loading）并自适应主题
    document.documentElement.innerHTML = `
    <style>
    html, body { height: 100%; margin: 0; display: flex; justify-content: center; align-items: center; background: ${background}; font-family: Arial, sans-serif; }
    .container { text-align: center; }
    .logo { margin-bottom: 20px; }
    .loader {
      border: 4px solid ${loaderBorder}; 
      border-top: 4px solid ${loaderTop}; 
      border-radius: 50%; 
      width: 40px; 
      height: 40px; 
      animation: spin 1s linear infinite;
      margin: 0 auto;
    }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    </style>
    <div class="container">
      <img class="logo" src="https://www.google.cn/images/branding/googlelogo/2x/googlelogo_color_150x54dp.png" width="150" height="54" alt="Google">
      <div class="loader"></div>
    </div>
    `;

    // 延迟 0ms 跳转到最小 URL
    setTimeout(() => { location.replace(cleanUrl.toString()); }, 0);
})();
