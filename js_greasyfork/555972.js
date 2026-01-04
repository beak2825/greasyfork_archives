// ==UserScript==
// @name         simplify zhihu better
// @version      1.0
// @description         A cleaner Zhihu reading script based on “simplify zhihu”: hides headers, sidebars, login popups and centers the article content for better reading.
// @description:zh-CN   增强版知乎简化脚本，隐藏顶部栏、右侧作者卡片及干扰元素，并将专栏正文居中显示，提供更专注的阅读体验。
// @description:zh-CN   参考：[simplify zhihu](https://greasyfork.org/scripts/38774)
// @author       ztxdcyy@github
// @match        https://www.zhihu.com/question/*
// @match        https://www.zhihu.com/people/*
// @match        https://www.zhihu.com/topic/*
// @match        https://www.zhihu.com/search?*
// @match        https://zhuanlan.zhihu.com/*
// @match        https://www.zhihu.com/follow
// @match        https://zhuanlan.zhihu.com/p/*
// @license MIT 
// @grant        GM_log
// @grant        GM_addStyle
// @namespace https://greasyfork.org/users/1536646
// @downloadURL https://update.greasyfork.org/scripts/555972/simplify%20zhihu%20better.user.js
// @updateURL https://update.greasyfork.org/scripts/555972/simplify%20zhihu%20better.meta.js
// ==/UserScript==

(function() {
    GM_addStyle (`
.CommentEditor-input { display: none !important; }
.CommentEditor-singleButton { display: none !important; }

.Sticky.is-fixed { position: relative !important; }
.Sticky--holder { display: none !important; }

.Modal-backdrop{background-color: transparent;}
.signFlowModal{display:none !important;}

.Question-sideColumn--sticky { position: relative !important; }
.AppHeader { display: none !important; }
.GlobalSideBar { display: none !important; }
.Question-sideColumn { display: none !important; }
.AdblockBanner { display: none !important; }
.Post-SideActions { display: none !important; }
.Post-SideBar { display: none !important; }
.Post-SideBarSticky { display: none !important; }
.Post-Row-Content-right { display: none !important; }
.Card.AuthorCard { display: none !important; }
.Post-content { display: flex !important; justify-content: center !important; }
.Post-Row-Content { justify-content: center !important; }
.Post-Row-Content-left { padding-right: 0 !important; }
.Post-Row-Content-left-article { margin: 0 auto !important; }
.Post-Main.Post-NormalMain { margin: 0 auto !important; }
.Post-RichTextContainer { margin: 0 auto !important; }
    `);
    // 问题页面登录弹窗
    GM_addStyle (`
html { overflow: auto !important;}
.Modal-wrapper { display:none !important; }
.Modal-backdrop { display:none !important; background-color: transparent; }
.signFlowModal { display:none !important; }
    `);
    // 评论区隐藏输入框
    GM_addStyle (`
.CommentEditorV2--normal { display: none !important; }
.CommentEditor-singleButton { display: none !important; }
 `);
})();
