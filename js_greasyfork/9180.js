// ==UserScript==
// @name       解除网页内容无法选择和右键屏蔽的限制
// @namespace  https://greasyfork.org/users/3586-yechenyin
// @version    0.3
// @description  remove the limit of right key clicking and draging content to select
// @include      http://*
// @include      https://*
// @author     yechenyin
// @downloadURL https://update.greasyfork.org/scripts/9180/%E8%A7%A3%E9%99%A4%E7%BD%91%E9%A1%B5%E5%86%85%E5%AE%B9%E6%97%A0%E6%B3%95%E9%80%89%E6%8B%A9%E5%92%8C%E5%8F%B3%E9%94%AE%E5%B1%8F%E8%94%BD%E7%9A%84%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/9180/%E8%A7%A3%E9%99%A4%E7%BD%91%E9%A1%B5%E5%86%85%E5%AE%B9%E6%97%A0%E6%B3%95%E9%80%89%E6%8B%A9%E5%92%8C%E5%8F%B3%E9%94%AE%E5%B1%8F%E8%94%BD%E7%9A%84%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

var body = document.getElementsByTagName('body')[0];
body.removeAttribute('oncontextmenu');
body.removeAttribute('onselectstart');
body.removeAttribute('ondragstart');
body.removeAttribute('onmousedown');