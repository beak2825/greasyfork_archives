// ==UserScript==
// @name Force Direct Media Access
// @namespace http://yoursite.example/<br/>// @version 1.0
// @description Cho phép mở trực tiếp file media từ link ngoài mà không cần truy cập web gốc
// @author You
// @match *://*/*
// @grant GM_xmlhttpRequest
// @grant GM_download
// @version 0.0.1.20250912071628
// @downloadURL https://update.greasyfork.org/scripts/549222/Force%20Direct%20Media%20Access.user.js
// @updateURL https://update.greasyfork.org/scripts/549222/Force%20Direct%20Media%20Access.meta.js
// ==/UserScript==
// @license GNU
(function() {
'use strict';

// Tìm tất cả link media (ảnh, video, audio)
const mediaExtensions = /\.(jpg|jpeg|png|gif|webp|mp4|webm|mp3|wav|ogg)$/i;

document.querySelectorAll("a[href]").forEach(link => {
const href = link.href;
if (mediaExtensions.test(href)) {
link.addEventListener("click", function(e) {
e.preventDefault();
// Mở trực tiếp file trong tab mới
window.open(href, "_blank");
});
}
});

// Tự động thay thế thẻ <img>, <video>, <audio> bị chặn CORS thành blob có thể xem
document.querySelectorAll("img, video, audio").forEach(el => {
if (el.src && mediaExtensions.test(el.src)) {
GM_xmlhttpRequest({
method: "GET",
url: el.src,
responseType: "blob",
onload: function(resp) {
let blobUrl = URL.createObjectURL(resp.response);
el.src = blobUrl;
}
});
}
});
})();