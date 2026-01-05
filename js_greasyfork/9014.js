// ==UserScript==
// @name        Tumblr Image Size
// @description When directly viewing an image on Tumblr, ensures that the highest resolution image is loaded.
// @version     1.4
// @namespace   Dimethyl
// @include     /^https?://(\d+\.)?media\.tumblr\.com/(.+/)*tumblr_.+_\d+\.(jpe?g|gif|png|bmp)(\?.*)?$/
// @grant       GM.xmlHttpRequest
// @connect     amazonaws.com
// @downloadURL https://update.greasyfork.org/scripts/9014/Tumblr%20Image%20Size.user.js
// @updateURL https://update.greasyfork.org/scripts/9014/Tumblr%20Image%20Size.meta.js
// ==/UserScript==

var sizes = [ /*'_raw.',*/ '_1280.', '_540.', '_500.', '_400.', '_250.', '_100.' ];

function checkSize(index) {
    if (index >= sizes.length) return;
    var url = window.location.href;
    // if (index == 0) url = url.replace(/^(https?:\/\/)\d+\.media\.tumblr\.com(\/.*)$/, '$1' + 's3.amazonaws.com/data.tumblr.com' + '$2');
    url = url.replace(/(.*(?=_))_\d*\.(.*)/, '$1' + sizes[index] + '$2');
    if (url == window.location.href) return;
    GM.xmlHttpRequest({
        url: url,
        method: 'HEAD',
        onload: function(response) {
            if (response.status != 200) {
                checkSize(index + 1);
                return;
            }
            window.location.replace(url);
        },
        onerror: function(response) {
            checkSize(index + 1);
        }
    });
}

checkSize(0);