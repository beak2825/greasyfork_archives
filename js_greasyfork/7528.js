// ==UserScript==
// @name       BlockTiebaAvatar
// @namespace  http://BlockTiebaAvatar.JMNSY/
// @version    0.1
// @description  我暂时不想在贴吧看到任何头像
// @match      http://tieba.baidu.com/*
// @license        GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @copyright  2014, JMNSY
// @downloadURL https://update.greasyfork.org/scripts/7528/BlockTiebaAvatar.user.js
// @updateURL https://update.greasyfork.org/scripts/7528/BlockTiebaAvatar.meta.js
// ==/UserScript==
$().ready(function(){
    $("img[src^='http://tb.himg.baidu.com/sys/portrait/item/']").attr("src","http://tb.himg.baidu.com/sys/portrait/item/3f4be991b0e68abde68ba4e59699685c");
});
