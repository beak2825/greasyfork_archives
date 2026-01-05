// ==UserScript==
// @name       TheDailyWTF
// @namespace  http://local.host/I.Dont.Wanna.Post.One
// @version    0.5
// @description  Show hidden comment surprises for the dailywtf
// @match      http://thedailywtf.com/articles/*
// @copyright  2014+, Milton Zurita
// @downloadURL https://update.greasyfork.org/scripts/6123/TheDailyWTF.user.js
// @updateURL https://update.greasyfork.org/scripts/6123/TheDailyWTF.meta.js
// ==/UserScript==

if(jQuery) {
    var style="color:green;background:#CCFFCC;margin:2px;font-size:0.65em;"
    var lookFor='.article-body';
    var regEx = /<\!--(.+)-->/g
    $(window).load(function(){
        var target = $(lookFor);
        var result = $(lookFor).html().replace(regEx,'<span style="'+style+'">\$1</span>');
        target.html(result);
    });
}