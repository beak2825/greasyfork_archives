// ==UserScript==
// @name         Auto claim FreeLTC.in faucet (Cloudflare Turnstile)
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Automatically clicks Claim when Cloudflare Turnstile is solved and reloads when needed
// @author       You
// @match        https://freeltc.in/member/faucet
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/558453/Auto%20claim%20FreeLTCin%20faucet%20%28Cloudflare%20Turnstile%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558453/Auto%20claim%20FreeLTCin%20faucet%20%28Cloudflare%20Turnstile%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // إعدادات التكوين الجديدة
    const CONFIG = {
        // إعدادات Cloudflare Turnstile
        turnstile: {
            checkInterval: 500,     // كل 500 مللي ثانية
            maxChecks: 120,         // 60 ثانية (120 * 500ms)
            claimDelay: 1500        // تأخير 1.5 ثانية قبل النقر
        },
        // إعدادات إعادة التحميل
        reload: {
            targetText: "reload to claim",
            checkInterval: 3000,    // كل 3 ثوانٍ
            reloadDelay: 1500       // تأخير 1.5 ثانية قبل إعادة التحميل
        }
    };

    // متغيرات الحالة
    let isTurnstileSolved = false;
    let turnstileCheckCount = 0;
    let reloadCheckActive = true;

    console.log('[Auto Script] Script loaded successfully - Version 3.0 (Cloudflare Turnstile)');

    // ========== وظيفة مراقبة Cloudflare Turnstile ==========
    function startTurnstileMonitoring() {
        console.log('[Auto Turnstile] Starting Turnstile monitoring...');
        turnstileCheckCount = 0;
        isTurnstileSolved = false;

        function checkTurnstileStatus() {
            turnstileCheckCount++;

            // التوقف إذا تجاوزنا الحد الأقصى للمحاولات
            if (turnstileCheckCount > CONFIG.turnstile.maxChecks && !isTurnstileSolved) {
                console.log('[Auto Turnstile] Timeout - Stopping Turnstile checks');
                return;
            }

            console.log(`[Auto Turnstile] Check #${turnstileCheckCount}`);

            // الطريقة 1: التحقق من عنصر cf-turnstile
            const turnstileDivs = document.querySelectorAll('.cf-turnstile');
            if (turnstileDivs.length > 0) {
                console.log('[Auto Turnstile] Found cf-turnstile div(s)');
                
                turnstileDivs.forEach((div, index) => {
                    // التحقق من وجود iframe الخاص بـ Turnstile
                    const iframes = div.querySelectorAll('iframe');
                    
                    iframes.forEach(iframe => {
                        try {
                            // التحقق من محتوى الـ iframe
                            if (iframe.src && iframe.src.includes('cloudflare.com/turnstile')) {
                                console.log(`[Auto Turnstile] Found Turnstile iframe #${index + 1}`);
                                
                                // مراقبة سمات الـ iframe
                                const style = window.getComputedStyle(iframe);
                                if (style && style.display === 'none' && !isTurnstileSolved) {
                                    console.log('[Auto Turnstile] iframe hidden - likely solved!');
                                    isTurnstileSolved = true;
                                    clickClaimButton();
                                    return;
                                }
                            }
                        } catch(e) {
                            // تجاهل أخطاء cross-origin
                            console.log('[Auto Turnstile] Cross-origin error on iframe check');
                        }
                    });

                    // التحقق من حالة div نفسها
                    if (div.style && div.style.display === 'none' && !isTurnstileSolved) {
                        console.log('[Auto Turnstile] cf-turnstile div hidden - solved!');
                        isTurnstileSolved = true;
                        clickClaimButton();
                        return;
                    }
                });
            }

            // الطريقة 2: البحث عن توكن Turnstile في النماذج
            const forms = document.querySelectorAll('form');
            forms.forEach(form => {
                const inputs = form.querySelectorAll('input[type="hidden"]');
                inputs.forEach(input => {
                    if (input.name && (input.name.includes('cf_turnstile') || 
                        input.name.includes('cf-captcha') || 
                        input.name.includes('turnstile') ||
                        input.name.includes('captcha'))) {
                        
                        if (input.value && input.value.length > 50 && !isTurnstileSolved) {
                            console.log('[Auto Turnstile] Found Turnstile token in hidden input:', input.name);
                            isTurnstileSolved = true;
                            clickClaimButton();
                            return;
                        }
                    }
                });
            });

            // الطريقة 3: مراقبة تحميل وعمل Turnstile API
            if (typeof turnstile !== 'undefined' && !isTurnstileSolved) {
                try {
                    console.log('[Auto Turnstile] Turnstile API detected');
                    
                    // البحث عن جميع عناصر Turnstile في الصفحة
                    const turnstileWidgets = document.querySelectorAll('[data-sitekey]');
                    turnstileWidgets.forEach((widget, index) => {
                        try {
                            // محاولة الحصول على التوكن
                            const token = widget.getAttribute('data-callback-data');
                            if (token && token.length > 50 && !isTurnstileSolved) {
                                console.log('[Auto Turnstile] Found token in data-callback-data');
                                isTurnstileSolved = true;
                                clickClaimButton();
                                return;
                            }
                        } catch(e) {
                            // تجاهل الأخطاء
                        }
                    });
                } catch(e) {
                    console.log('[Auto Turnstile] Error checking Turnstile API:', e);
                }
            }

            // الطريقة 4: مراقبة التغيرات في DOM
            const interactiveElements = document.querySelectorAll('.cf-turnstile, [data-turnstile], iframe[src*="turnstile"]');
            interactiveElements.forEach(element => {
                const computedStyle = window.getComputedStyle(element);
                if (computedStyle && computedStyle.opacity === '0' && !isTurnstileSolved) {
                    console.log('[Auto Turnstile] Element has opacity 0 - likely solved');
                    isTurnstileSolved = true;
                    clickClaimButton();
                    return;
                }
            });

            // الاستمرار في المراقبة إذا لم يتم الحل
            if (!isTurnstileSolved) {
                setTimeout(checkTurnstileStatus, CONFIG.turnstile.checkInterval);
            }
        }

        // بدء المراقبة بعد تأخير قصير
        setTimeout(checkTurnstileStatus, 2000);
    }

    // ========== وظيفة النقر على زر Claim ==========
    function clickClaimButton() {
        console.log('[Auto Turnstile] Attempting to click Claim Now button...');

        setTimeout(() => {
            let claimButton = null;

            // البحث بالكلاس (من تحليل HTML)
            claimButton = document.querySelector('.btn-claim');

            // البحث بالنص
            if (!claimButton) {
                const buttons = document.querySelectorAll('button');
                buttons.forEach(button => {
                    const text = button.textContent || button.innerText || '';
                    if (text.toLowerCase().includes('claim now') || text.toLowerCase().includes('claim')) {
                        claimButton = button;
                    }
                });
            }

            // البحث في النماذج
            if (!claimButton) {
                const forms = document.querySelectorAll('form');
                forms.forEach(form => {
                    const submitButtons = form.querySelectorAll('button[type="submit"], input[type="submit"]');
                    submitButtons.forEach(button => {
                        claimButton = button;
                    });
                });
            }

            // النقر على الزر إذا وجد
            if (claimButton) {
                console.log('[Auto Turnstile] Found claim button');

                try {
                    // طريقة 1: استخدام click()
                    claimButton.click();

                    // طريقة 2: إنشاء حدث نقر
                    const clickEvent = new MouseEvent('click', {
                        bubbles: true,
                        cancelable: true,
                        view: window
                    });
                    claimButton.dispatchEvent(clickEvent);

                    // طريقة 3: تنفيذ submit للنموذج
                    const form = claimButton.closest('form');
                    if (form) {
                        form.submit();
                    }

                    console.log('[Auto Turnstile] Successfully clicked Claim Now button');
                    showSuccessMessage();

                } catch(error) {
                    console.error('[Auto Turnstile] Error clicking button:', error);
                }
            } else {
                console.log('[Auto Turnstile] Could not find Claim Now button');
                setTimeout(clickClaimButton, 1000);
            }
        }, CONFIG.turnstile.claimDelay);
    }

    // ========== وظيفة مراقبة إعادة التحميل ==========
    function startReloadMonitoring() {
        console.log('[Auto Reload] Starting reload monitoring...');

        // وظيفة التحقق من وجود النص
        function checkForReloadText() {
            if (!reloadCheckActive) return;

            const pageText = document.body.innerText || document.body.textContent;
            if (pageText.toLowerCase().includes(CONFIG.reload.targetText.toLowerCase())) {
                console.log(`[Auto Reload] Found "${CONFIG.reload.targetText}", will reload...`);
                
                // تعطيل المراقبة مؤقتاً
                reloadCheckActive = false;
                
                // إعادة التحميل بعد تأخير
                setTimeout(() => {
                    window.location.reload();
                }, CONFIG.reload.reloadDelay);
            }
        }

        // مراقبة تغييرات DOM
        const observer = new MutationObserver(function(mutations) {
            checkForReloadText();
        });

        // بدء مراقبة التغييرات في الصفحة
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });

        // التحقق عند تحميل الصفحة لأول مرة
        window.addEventListener('load', function() {
            setTimeout(checkForReloadText, 1000);
        });

        // التحقق بشكل دوري
        setInterval(checkForReloadText, CONFIG.reload.checkInterval);
    }

    // ========== وظائف مساعدة ==========
    function showSuccessMessage() {
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            z-index: 999999;
            font-family: Arial, sans-serif;
            font-weight: bold;
            font-size: 14px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            animation: slideIn 0.5s ease-out;
            border-left: 5px solid #4CAF50;
        `;
        message.innerHTML = `
            <div style="display: flex; align-items: center;">
                <span style="margin-right: 10px;">✅</span>
                <div>
                    <div style="font-size: 16px;">Cloudflare Turnstile Solved!</div>
                    <div style="font-size: 12px; opacity: 0.9;">Claiming rewards automatically...</div>
                </div>
            </div>
        `;
        document.body.appendChild(message);

        setTimeout(() => {
            message.style.animation = 'slideOut 0.5s ease-out';
            setTimeout(() => {
                if (message.parentNode) {
                    message.parentNode.removeChild(message);
                }
            }, 500);
        }, 4000);
    }

    // إضافة أنماط CSS
    function addStyles() {
        const styles = document.createElement('style');
        styles.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }

            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }

            @keyframes pulse {
                0% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.4); }
                70% { box-shadow: 0 0 0 10px rgba(76, 175, 80, 0); }
                100% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0); }
            }
        `;
        document.head.appendChild(styles);
    }

    // مراقبة DOM للعناصر الجديدة
    function setupDOMMonitoring() {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length > 0) {
                    const turnstileAdded = Array.from(mutation.addedNodes).some(node => {
                        if (node.nodeType === 1) {
                            return node.matches && (node.matches('.cf-turnstile') || node.querySelector('.cf-turnstile'));
                        }
                        return false;
                    });

                    if (turnstileAdded && !isTurnstileSolved) {
                        console.log('[Auto Script] New Turnstile detected');
                        startTurnstileMonitoring();
                    }
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // ========== بدء التحميل ==========
    function initializeScript() {
        console.log('[Auto Script] Initializing all functions...');
        
        // إضافة الأنماط
        addStyles();
        
        // إعداد مراقبة DOM
        setupDOMMonitoring();
        
        // بدء مراقبة Turnstile
        startTurnstileMonitoring();
        
        // بدء مراقبة إعادة التحميل
        startReloadMonitoring();
        
        console.log('[Auto Script] All functions initialized successfully');
    }

    // بدء التشغيل عندما تكون الصفحة جاهزة
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeScript);
    } else {
        initializeScript();
    }
})();