// ==UserScript==
// @name         万能复制解除
// @namespace    ikaikail@ikaikail.com
// @version      1.0
// @description  没有不可复制的文字！
// @author       iKaiKail
// @match        https://*/*
// @match        http://*/*
// @match        file:///*
// @icon         https://locbr-cn.oss-cn-hongkong.aliyuncs.com/wp-content/uploads/2025/12/9341b72b4ff6f9a268dc7de978e0feaa.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559673/%E4%B8%87%E8%83%BD%E5%A4%8D%E5%88%B6%E8%A7%A3%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/559673/%E4%B8%87%E8%83%BD%E5%A4%8D%E5%88%B6%E8%A7%A3%E9%99%A4.meta.js
// ==/UserScript==



(function() {
    'use strict';

    // Remove onselectstart attribute from body
    document.body.removeAttribute('onselectstart');
    
    // Override onselectstart to allow selection
    document.body.onselectstart = null;
    
    // Add CSS to allow text selection
    const style = document.createElement('style');
    style.textContent = `
        * {
            user-select: auto !important;
            -webkit-user-select: auto !important;
            -moz-user-select: auto !important;
            -ms-user-select: auto !important;
        }
        
        body {
            onselectstart: auto !important;
        }
        
        .whiteBg {
            user-select: auto !important;
        }
        
        .questionLi,
        .marking_content,
        .stem_answer,
        .answer_p {
            user-select: auto !important;
        }
    `;
    document.head.appendChild(style);
    
    // Override addChoice function if it exists to prevent interference
    if (typeof window.addChoice === 'function') {
        const originalAddChoice = window.addChoice;
        window.addChoice = function(element) {
            // Allow text selection before calling original function
            document.body.style.userSelect = 'auto';
            return originalAddChoice(element);
        };
    }
    
    // Enable context menu
    document.addEventListener('contextmenu', function(e) {
        e.stopPropagation();
    }, true);
    
    // Enable copy event
    document.addEventListener('copy', function(e) {
        e.stopPropagation();
    }, true);
    
    // Enable cut event  
    document.addEventListener('cut', function(e) {
        e.stopPropagation();
    }, true);
    
    // Enable paste event
    document.addEventListener('paste', function(e) {
        e.stopPropagation();
    }, true);
    
    // Remove watermark elements
    function removeWatermarks() {
        // Remove by class name
        const watermarkElements = document.querySelectorAll('.mask_div');
        watermarkElements.forEach(el => {
            el.remove();
        });
        
        // Remove by style characteristics
        const allElements = document.querySelectorAll('div');
        allElements.forEach(el => {
            const style = window.getComputedStyle(el);
            const id = el.id;
            
            // Check for watermark characteristics
            if (
                (id && id.includes('mask_div')) ||
                (style.transform && style.transform.includes('rotate')) ||
                (style.opacity === '0.4') ||
                (style.pointerEvents === 'none')
            ) {
                // Check if it contains text that looks like student info (name + number)
                const text = el.textContent.trim();
                if (text && /^[\u4e00-\u9fa5]+\d+$/.test(text)) {
                    el.remove();
                }
            }
        });
        
        // Also check for elements with ExamWaterMark content
        const examWaterMark = document.getElementById('ExamWaterMark');
        if (examWaterMark) {
            const waterMarkText = examWaterMark.value;
            const allDivs = document.querySelectorAll('div');
            allDivs.forEach(el => {
                if (el.textContent.includes(waterMarkText)) {
                    el.remove();
                }
            });
        }
    }
    
    // Run watermark removal immediately
    removeWatermarks();
    
    // Run again after a short delay to catch any dynamically added watermarks
    setTimeout(removeWatermarks, 1000);
    
    console.log('🐱 ScriptCat: Copy functionality enabled and watermarks removed');
})();