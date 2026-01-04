// ==UserScript==
// @name         OLM Helper Loader
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Loader script để tự động load và chạy OLM Helper từ thư mục olmhelper
// @author       cavoixanh1806
// @match        https://olm.vn/chu-de/*
// @match        https://olm.vn/lop-hoc-cua-toi
// @match        https://olm.vn/lop/*
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      cavoixanh1806.site
// @connect      cavoixanh.ddns.net
// @connect      *
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/556575/OLM%20Helper%20Loader.user.js
// @updateURL https://update.greasyfork.org/scripts/556575/OLM%20Helper%20Loader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // URL của file olm.js - thay đổi theo domain của bạn
    const OLM_JS_URL = 'https://cavoixanh1806.site/olmhelper/olm.js';
    // Hoặc dùng localhost nếu test local:
    // const OLM_JS_URL = 'http://localhost/olmhelper/olm.js';

    // Cache version để force reload khi cần
    const CACHE_VERSION = '1.0.0';
    const CACHE_KEY = 'olm_js_cache_' + CACHE_VERSION;

    function loadOLMHelper() {
        // Kiểm tra cache trước
        const cached = GM_getValue(CACHE_KEY, null);
        const cacheTimestamp = GM_getValue(CACHE_KEY + '_time', 0);
        const CACHE_DURATION = 3600000; // 1 giờ (có thể thay đổi)

        // Nếu có cache và chưa hết hạn, dùng cache
        if (cached && (Date.now() - cacheTimestamp < CACHE_DURATION)) {
            console.log('[OLM Loader] Đang load từ cache');
            executeScript(cached);
            return;
        }

        // Load từ server
        console.log('[OLM Loader] Đang load từ server:', OLM_JS_URL);
        GM_xmlhttpRequest({
            method: 'GET',
            url: OLM_JS_URL + '?v=' + Date.now(), // Thêm timestamp để bypass cache
            headers: {
                'Accept': 'application/javascript, text/javascript, */*'
            },
            onload: function(response) {
                if (response.status === 200) {
                    const scriptContent = response.responseText;
                    // Lưu vào cache
                    GM_setValue(CACHE_KEY, scriptContent);
                    GM_setValue(CACHE_KEY + '_time', Date.now());
                    console.log('[OLM Loader] Load script thành công');
                    executeScript(scriptContent);
                } else {
                    console.error('[OLM Loader] Không thể load script. Status:', response.status);
                    // Fallback: thử dùng cache cũ nếu có
                    if (cached) {
                        console.log('[OLM Loader] Dùng cache cũ làm fallback');
                        executeScript(cached);
                    }
                }
            },
            onerror: function(error) {
                console.error('[OLM Loader] Lỗi mạng:', error);
                // Fallback: thử dùng cache cũ nếu có
                if (cached) {
                    console.log('[OLM Loader] Dùng cache cũ làm fallback');
                    executeScript(cached);
                }
            }
        });
    }

    function executeScript(scriptContent) {
        try {
            console.log('[OLM Loader] Bắt đầu execute script, length:', scriptContent.length);
            
            // Loại bỏ phần header Tampermonkey (==UserScript== ... ==/UserScript==)
            let cleanScript = scriptContent;
            
            // Tìm và loại bỏ phần header
            const headerStart = cleanScript.indexOf('// ==UserScript==');
            const headerEnd = cleanScript.indexOf('// ==/UserScript==');
            
            if (headerStart !== -1 && headerEnd !== -1) {
                cleanScript = cleanScript.substring(headerEnd + '// ==/UserScript=='.length).trim();
                console.log('[OLM Loader] Đã loại bỏ header, script length:', cleanScript.length);
            }
            
            // Execute script trực tiếp trong Tampermonkey context
            // Sử dụng eval để execute trong cùng scope với Tampermonkey
            // Điều này đảm bảo các GM_* functions hoạt động đúng
            try {
                eval(cleanScript);
                console.log('[OLM Loader] Script đã được execute thành công bằng eval');
            } catch (evalError) {
                console.error('[OLM Loader] Lỗi khi dùng eval:', evalError);
                // Fallback: dùng Function constructor
                try {
                    const scriptFunction = new Function(cleanScript);
                    scriptFunction();
                    console.log('[OLM Loader] Script đã được execute thành công bằng Function constructor');
                } catch (funcError) {
                    console.error('[OLM Loader] Lỗi khi dùng Function constructor:', funcError);
                    throw funcError;
                }
            }
        } catch (error) {
            console.error('[OLM Loader] Lỗi khi execute script:', error);
            console.error('[OLM Loader] Error stack:', error.stack);
        }
    }

    // Chạy ngay khi script load (vì @run-at document-start)
    // Không cần chờ DOM vì olm.js sẽ tự xử lý
    console.log('[OLM Loader] Script loader đã được khởi động');
    loadOLMHelper();
})();

