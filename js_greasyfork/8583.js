// ==UserScript==
// @name        Tumblr. blog icon to bottom
// @namespace   http://www.sharkpp.net/
// @version     0.4
// @description Tumblr. blog icon to bottom in reblog form
// @author      sharkpp
// @copyright   2015, sharkpp
// @license     MIT License
// @include     https://www.tumblr.com/dashboard*
// @include     https://www.tumblr.com/reblog/*
// @include     https://www.tumblr.com/blog/*
// @include     https://www.tumblr.com/tagged/*
// @include     https://www.tumblr.com/search/*
// @downloadURL https://update.greasyfork.org/scripts/8583/Tumblr%20blog%20icon%20to%20bottom.user.js
// @updateURL https://update.greasyfork.org/scripts/8583/Tumblr%20blog%20icon%20to%20bottom.meta.js
// ==/UserScript==
(function ()
{
    var blogs = [];
    var evaluate = function (xpath, resultOnce) {
        resultOnce = undefined == typeof resultOnce ? false : resultOnce;
        var items = document.evaluate(xpath, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
        return resultOnce ? (items.snapshotLength ? items.snapshotItem(0) : null)
                          : items;
    };
    var fn = function () {
            var postContainer = evaluate('//*[@class="post-container"]', true);
            if (postContainer &&
                !postContainer.getAttribute('data-sharkpp-icon-bottom'))
            {
                postContainer.setAttribute('data-sharkpp-icon-bottom', true);
                //////////
                var elm;
                elm = evaluate('//*[@class="post-margin"]', true);
                elm.style.cssText = 'bottom:0; top:initial;';
                if (elm = evaluate('//*[contains(concat(" ",normalize-space(@class)," ")," post-content ")]', true)) { // old desigin
                    elm.style.cssText = 'top: 5px;';
                    elm = evaluate('//*[contains(concat(" ",normalize-space(@class)," ")," post-header ")]', true);
                    elm.style.cssText = 'position:absolute; bottom:5px; width:340px;';
                    elm = evaluate('//*[@class="post-form--controls"]/*[@class="controls-container"]', true);
                    elm.style.cssText = 'width:200px; margin-left:340px;';
                } else if (elm = evaluate('//*[contains(concat(" ",normalize-space(@class)," ")," post-form--form ")]', true)) {
                    elm.style.cssText = 'top: 5px;';
                    elm = evaluate('//*[contains(concat(" ",normalize-space(@class)," ")," post-form--header ")]', true);
                    elm.style.cssText = 'position:absolute; bottom:5px; width:340px;';
                    elm = evaluate('//*[@class="post-form--controls"]/*[@class="controls-container"]', true);
                    elm.style.cssText = 'width:200px; margin-left:340px;';
                }
            }
            setTimeout(fn, 1000);
        };
    setTimeout(fn, 1000);
})();
