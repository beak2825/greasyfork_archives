// ==UserScript==
// @name         tumblr rapid-er recommendations
// @namespace    http://shitpo.st/
// @version      1.0
// @description  opens posts' "rapid recommendations" automatically without liking the post
// @author       kevin hogeland
// @match        https://*.tumblr.com/dashboard*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js
// @require      https://cdn.jsdelivr.net/jquery.inview/0.2/jquery.inview.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/9687/tumblr%20rapid-er%20recommendations.user.js
// @updateURL https://update.greasyfork.org/scripts/9687/tumblr%20rapid-er%20recommendations.meta.js
// ==/UserScript==

var reqn = 0;
for (var i = 0;i<10000;i++) {
    try {
        if (require(i)().handleAction) {
            reqn = i;
            break;
        }
    } catch(err) {}
}

$(document).on('inview', '.post_control.like', function (event, isinview) {
    if (isinview) {
        require(reqn)().viewsLeft = 10000;
        var root_id = JSON.parse($(this).parents('.post').attr('data-json')).root_id;
        for (var n in Tumblr.Posts.models) {
            var model = Tumblr.Posts.models[n];
            if (model.get('root_id') == root_id) {
                require(reqn)().handleAction({
                    model: model,
                    action: 'like'
                })
                return;
            }
        }
    }
})