// ==UserScript==
// @name         Quick Shop Check
// @namespace    animeafk.xyz
// @version      1.0
// @description  Simple shop file checker
// @author       Support
// @match        *://animeafk.xyz/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/561960/Quick%20Shop%20Check.user.js
// @updateURL https://update.greasyfork.org/scripts/561960/Quick%20Shop%20Check.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // Tạo nút đơn giản
    const btn = document.createElement('button');
    btn.innerHTML = '🔍';
    btn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 40px;
        height: 40px;
        background: #667eea;
        border-radius: 50%;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        z-index: 9999;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    `;
    
    btn.onclick = () => {
        const results = [];
        
        // Chỉ check 3 thứ đơn giản
        // 1. Tất cả script files
        document.querySelectorAll('script[src]').forEach(s => {
            if (s.src.includes('animeafk.xyz')) {
                results.push(`JS: ${s.src.split('/').pop()}`);
            }
        });
        
        // 2. Tìm text "shop" trong page
        if (document.body.innerText.toLowerCase().includes('shop')) {
            results.push('Found "shop" in page text');
        }
        
        // 3. Check localStorage keys
        try {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key.toLowerCase().includes('shop')) {
                    results.push(`Storage: ${key}`);
                }
            }
        } catch(e) {}
        
        // Hiển thị kết quả
        alert(`Found ${results.length} items:\n\n${results.join('\n') || 'Nothing found'}`);
    };
    
    document.body.appendChild(btn);
})();