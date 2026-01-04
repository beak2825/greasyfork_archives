// ==UserScript==
// @name         Sample Userscript Greasy Fork Full
// @namespace    https://greasyfork.org/users/ahi/sample-userscript-full
// @version      1.0.0
// @description  Userscript mẫu đầy đủ metadata, hợp lệ tuyệt đối khi đăng Greasy Fork
// @author       Ahi
// @match        *://*/*
// @license      MIT
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/561166/Sample%20Userscript%20Greasy%20Fork%20Full.user.js
// @updateURL https://update.greasyfork.org/scripts/561166/Sample%20Userscript%20Greasy%20Fork%20Full.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Code JavaScript thực thi hợp lệ
    console.log('✅ Userscript Greasy Fork đang chạy');

    // Ví dụ thao tác DOM
    const banner = document.createElement('div');
    banner.textContent = 'Userscript hoạt động';
    banner.style.position = 'fixed';
    banner.style.top = '10px';
    banner.style.right = '10px';
    banner.style.background = '#222';
    banner.style.color = '#fff';
    banner.style.padding = '8px 12px';
    banner.style.borderRadius = '6px';
    banner.style.fontSize = '12px';
    banner.style.zIndex = '99999';

    document.body.appendChild(banner);
})();
