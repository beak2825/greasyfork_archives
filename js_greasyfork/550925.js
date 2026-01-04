// ==UserScript==
// @name        链接地址全在【当前/新建】标签页中打开（翻页除外）
// @namespace   Open in self/new tab.
// @match       *://*/*
// @grant       GM_registerMenuCommand
// @grant       GM_unregisterMenuCommand
// @grant       GM_getValue
// @grant       GM_setValue
// @version     0.0.4
// @author      稻米鼠 (恋恋修改：优化分页链接处理)
// @downloadURL https://update.greasyfork.org/scripts/550925/%E9%93%BE%E6%8E%A5%E5%9C%B0%E5%9D%80%E5%85%A8%E5%9C%A8%E3%80%90%E5%BD%93%E5%89%8D%E6%96%B0%E5%BB%BA%E3%80%91%E6%A0%87%E7%AD%BE%E9%A1%B5%E4%B8%AD%E6%89%93%E5%BC%80%EF%BC%88%E7%BF%BB%E9%A1%B5%E9%99%A4%E5%A4%96%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/550925/%E9%93%BE%E6%8E%A5%E5%9C%B0%E5%9D%80%E5%85%A8%E5%9C%A8%E3%80%90%E5%BD%93%E5%89%8D%E6%96%B0%E5%BB%BA%E3%80%91%E6%A0%87%E7%AD%BE%E9%A1%B5%E4%B8%AD%E6%89%93%E5%BC%80%EF%BC%88%E7%BF%BB%E9%A1%B5%E9%99%A4%E5%A4%96%EF%BC%89.meta.js
// @description 控制链接在当前或新标签页打开，分页链接始终在当前页打开// ==/UserScript==

/** 获取是否在新标签打开链接 **/
let isOpenInNewTab = GM_getValue('inNewPage', true);
console.log('是否在新标签打开:', isOpenInNewTab)
const menuNames = ['切换为：在新标签打开链接', '切换为：在当前标签打开链接']

/**
 * 判断是否为分页链接
 * 匹配类似 /page/3/、/page/4/ 这样的分页格式
 */
function isPaginationLink(url) {
    try {
        // 解析链接并获取路径部分
        const parsedUrl = new URL(url);
        const path = parsedUrl.pathname;
        
        // 匹配分页模式：/page/数字/ 或 /page/数字
        const paginationPattern = /\/page\/\d+(\/)?$/i;
        return paginationPattern.test(path);
    } catch (e) {
        return false;
    }
}

const main = ()=>{
    document.querySelectorAll('a').forEach(el=>{
        // 获取链接地址，优先使用href属性
        const linkUrl = el.href;
        
        // 如果是分页链接，强制在当前标签页打开
        if (isPaginationLink(linkUrl)) {
            el.target = '_self';
            return; // 跳过后续处理
        }
        
        // 非分页链接，根据用户设置处理
        if(isOpenInNewTab){
            if(/^_blank$/i.test(el.target)) return;
            el.target = '_blank';
        }else{
            if(/^(_self)?$/i.test(el.target)) return;
            el.target = '_self';
        }
    })
}

const init = (caption, captionRemove)=>{
    GM_unregisterMenuCommand(captionRemove);
    GM_registerMenuCommand(caption, ()=>{
        isOpenInNewTab = !isOpenInNewTab;
        GM_setValue('inNewPage', isOpenInNewTab);
        main();
        alert('当前页面立刻生效，其他页面刷新后生效。');
    });
}

// 初始化菜单
if(isOpenInNewTab){
    init(menuNames[1], menuNames[0]);
}else{
    init(menuNames[0], menuNames[1]);
}

// 初始执行
main();

// 监听DOM变化，处理动态加载的链接
document.addEventListener('DOMNodeInserted', (e)=>{
    main();
});

// 页面加载完成后再次执行
window.addEventListener('load', ()=>{
    main();
});
    