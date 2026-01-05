// ==UserScript==
// @name        Tumblr. megaeditor extention
// @namespace   http://www.sharkpp.net/
// @version     0.1
// @description extention for Tumblr. megaeditor
// @author      sharkpp
// @copyright   2014, sharkpp
// @license     MIT License
// @match       https://www.tumblr.com/mega-editor/*
// @downloadURL https://update.greasyfork.org/scripts/6878/Tumblr%20megaeditor%20extention.user.js
// @updateURL https://update.greasyfork.org/scripts/6878/Tumblr%20megaeditor%20extention.meta.js
// ==/UserScript==
(function ()
{
    var navItem = document.evaluate('//*[@id="nav_archive"]/div[@class="editor_navigation"]', document,
                                    null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
        navItem = navItem.snapshotLength ? navItem.snapshotItem(0) : null;
    var elm, buttonSelectAll = document.createElement('div');
        buttonSelectAll.className = 'header_button';
        elm = buttonSelectAll.insertBefore(document.createElement('button'), null);
            elm.type = 'button';
            elm.className = 'chrome big_dark';
            elm = elm.insertBefore(document.createElement('div'), null);
                elm.className = 'chrome_button';
                elm.insertBefore(document.createElement('div'), null).className = 'chrome_button_left';
                elm.insertBefore(document.createTextNode('全て選択'), null);
                elm.insertBefore(document.createElement('div'), null).className = 'chrome_button_right';
        buttonSelectAll.onclick = function(){
                var selectItem = document.evaluate('//a[contains(@id,"post_")][contains(concat(" ",normalize-space(@class)," ")," highlighted ")]',
                                                   document,null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
                    selectItem = selectItem.snapshotLength ? selectItem.snapshotItem(0) : null;
                var items = document.evaluate('//a[contains(@id,"post_")]', document,
                                              null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
                for (var i = 0, item, selectRest = -1; item = items.snapshotItem(i); i++) {
                    if (-1 == selectRest && (!selectItem || item == selectItem)) {
                        selectRest = 100; // limitation of Tumblr. 
                    }
                    if (0 < selectRest) {
                        if (item != selectItem)
                            item.onclick();
                        selectRest--;
                    }
                }
            };

    navItem.insertBefore(buttonSelectAll, navItem.firstChild);
})();
