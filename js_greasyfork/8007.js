// ==UserScript==
// @name         新浪博客图片取消延迟加载
// @namespace    https://greasyfork.org/users/4514
// @author       喵拉布丁
// @homepage     https://greasyfork.org/scripts/8007
// @description  用于取消新浪博客图片的延迟加载
// @include      http*://blog.sina.com.cn/s/blog_*.html*
// @version      1.1
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/8007/%E6%96%B0%E6%B5%AA%E5%8D%9A%E5%AE%A2%E5%9B%BE%E7%89%87%E5%8F%96%E6%B6%88%E5%BB%B6%E8%BF%9F%E5%8A%A0%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/8007/%E6%96%B0%E6%B5%AA%E5%8D%9A%E5%AE%A2%E5%9B%BE%E7%89%87%E5%8F%96%E6%B6%88%E5%BB%B6%E8%BF%9F%E5%8A%A0%E8%BD%BD.meta.js
// ==/UserScript==
for(var i in document.images) {
    var realSrc = document.images[i].getAttribute('real_src');
    if (realSrc) {
        document.images[i].src = realSrc;
    }
}