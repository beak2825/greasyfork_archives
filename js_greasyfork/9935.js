// ==UserScript== 
// @name FAH Banner Fix
// @namespace http://jiggmin.com/member.php?12415
// @description Fixes Jiggmin's folding at home banner.
// @grant none
// @require http://code.jquery.com/jquery-1.9.1.js
// @include http://jiggmin.com/*
// @include http://www.jiggmin.com/*
// @version 2.0.1
// @downloadURL https://update.greasyfork.org/scripts/9935/FAH%20Banner%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/9935/FAH%20Banner%20Fix.meta.js
// ==/UserScript==

$('.signaturecontainer, blockquote.postcontent.restore, .blogbody.postcontainer, blockquote.postcontent.restore.preview, blockquote.posttext.restore').html(function(){
    // support for siggy, posts, blog posts and comments, PMs, siggy/blog/post/PM previews, etc. ^^^
    return $(this)
    .html()
    .replace(/\[fah_banner\]/g,'<embed width="150" height="55" wmode="opaque" flashvars="userName=')
    .replace(/\[\/fah_banner\]/g,'" src="http://jiggmin.com/folding_at_home/team_jiggmin_banner.swf?v2">');
});