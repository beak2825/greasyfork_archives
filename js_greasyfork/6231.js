// ==UserScript==
// @name         v2ex帖子标题过滤器
// @namespace    http://blog.7xiaowu.cn/
// @version      0.1
// @description  自己改关键字
// @author       暗黑游侠
// downloadURL     http://blog.7xiaowu.cn/other/scripts/v2exfilter.js
// @match        https://www.v2ex.com/
// @match        https://v2ex.com/
// @match        http://www.v2ex.com/
// @match        http://v2ex.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/6231/v2ex%E5%B8%96%E5%AD%90%E6%A0%87%E9%A2%98%E8%BF%87%E6%BB%A4%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/6231/v2ex%E5%B8%96%E5%AD%90%E6%A0%87%E9%A2%98%E8%BF%87%E6%BB%A4%E5%99%A8.meta.js
// ==/UserScript==


$('.cell.item').each(function(){
    var ret = false ;
    var tstr ;
    $(this).find(".item_title").find("a").each( function(){
        tstr = $(this).html() ;
        if( tstr.toLocaleLowerCase().indexOf("inbox") > -1 ){
            ret = true ;
        }
    } );
    if( ret ){
        console.log("标题为:\"" + tstr + "\"的内容已被过滤");
        $(this).remove();
        
    }
});
