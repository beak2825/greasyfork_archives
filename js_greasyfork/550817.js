// ==UserScript==
// @name:zh-CN      鉴赏家注入修复
// @name            Curator_Inject_Fix
// @namespace       https://blog.chrxw.com
// @supportURL      https://blog.chrxw.com/scripts.html
// @contributionURL https://afdian.com/@chr233
// @version         1.0
// @description     修复列表显示
// @description:zh-CN  修复列表显示
// @author          Chr_
// @include         https://store.steampowered.com/curator/*
// @license         AGPL-3.0
// @icon            https://blog.chrxw.com/favicon.ico
// @run-at          document-end
// @downloadURL https://update.greasyfork.org/scripts/550817/Curator_Inject_Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/550817/Curator_Inject_Fix.meta.js
// ==/UserScript==


// 包裹 elemLink，确保 elemLink[0] 始终可用
const originAlignMenu = AlignMenu;

AlignMenu = function newAlignMenu(elemLink, elemPopup, align, valign, bLinkHasBorder, elemAlternateAlignTo) {
    originAlignMenu([elemLink], elemPopup, align, valign, bLinkHasBorder, elemAlternateAlignTo);
}