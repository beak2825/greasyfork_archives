// ==UserScript==
// @name         multiplay 3rb.io two page switch Tab
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  نظام لاعبين مع    
// @match        https://3rb.io/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/561699/multiplay%203rbio%20two%20page%20switch%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/561699/multiplay%203rbio%20two%20page%20switch%20Tab.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // بدء النظام مباشرة
    setTimeout(init, 500);

    function init() {
        console.log('🔒 نظام اللاعب المزدوج مع sandbox');

        // منع التكرار
        if (window.dualPlayerSandbox) return;
        window.dualPlayerSandbox = true;

        // إنشاء النظام
        createSandboxSystem();
    }

    function createSandboxSystem() {
        // حالة النظام
        const state = {
            activePlayer: 1,
            systemActive: false,
            player2Loaded: false,
            isSwitching: false
        };

        // 1. زر التحكم
        const mainBtn = document.createElement('button');
        mainBtn.id = 'dualMainBtn';
        mainBtn.innerHTML = '🔘';
        mainBtn.title = 'نظام اللاعب المزدوج (Ctrl+D)';
        mainBtn.style.cssText = `
            position: fixed;
            top: 15px;
            right: 15px;
            width: 40px;
            height: 40px;
            background: #3498db;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            z-index: 10000;
            font-size: 20px;
            box-shadow: 0 3px 10px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
        `;

        // 2. حاوية اللاعب الثاني
        const player2Box = document.createElement('div');
        player2Box.id = 'player2Box';
        player2Box.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #000;
            z-index: 9998;
            display: none;
        `;

        // 3. iframe للاعب الثاني مع إعدادات sandbox محسنة
        const player2Frame = document.createElement('iframe');
        player2Frame.id = 'player2Frame';
        player2Frame.title = "لاعب 2 - نظام معزول";

        // إعداد sandbox محكم لمنع التحديث التلقائي
        player2Frame.sandbox = 'allow-scripts allow-same-origin allow-forms allow-popups allow-pointer-lock allow-downloads allow-modals';

        // إعدادات إضافية لمنع التحديث
        player2Frame.setAttribute('loading', 'eager');
        player2Frame.setAttribute('referrerpolicy', 'no-referrer');
        player2Frame.setAttribute('allow', 'fullscreen');

        player2Frame.style.cssText = `
            width: 100%;
            height: 100%;
            border: none;
            background: white;
        `;

        // 4. شريط الحالة
        const statusBar = document.createElement('div');
        statusBar.id = 'dualStatusBar';
        statusBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: linear-gradient(90deg, #2c3e50, #3498db);
            color: white;
            padding: 8px;
            font-size: 12px;
            text-align: center;
            z-index: 9999;
            display: none;
            font-family: Arial, sans-serif;
        `;

        // تجميع العناصر
        player2Box.appendChild(player2Frame);
        document.body.appendChild(mainBtn);
        document.body.appendChild(player2Box);
        document.body.appendChild(statusBar);

        // ===== الوظائف الأساسية =====

        // تحميل اللاعب الثاني مع منع التحديث
        function loadPlayer2() {
            if (state.player2Loaded) return;

            const cleanUrl = window.location.href.split('?')[0].split('#')[0];
            const newUrl = cleanUrl + '?dual=2&sandbox=1&t=' + Date.now();

            player2Frame.src = newUrl;
            state.player2Loaded = true;

            console.log('✅ تحميل اللاعب الثاني مع sandbox');
        }

        // حقن سكريبت لمنع التحديث داخل iframe
        function injectPreventionScript(iframe) {
            try {
                const iframeWindow = iframe.contentWindow;
                const iframeDoc = iframe.contentDocument;

                if (!iframeDoc || !iframeWindow) return;

                // سكريبت لمنع التحديث التلقائي داخل iframe
                const preventionScript = `
                    // منع التحديث التلقائي
                    (function() {
                        'use strict';

                        console.log('🔒 نظام منع التحديث مفعل في iframe');

                        // 1. منع حدث beforeunload لمنع إعادة التحميل
                        window.addEventListener('beforeunload', function(e) {
                            e.preventDefault();
                            e.returnValue = '';
                            return false;
                        });

                        // 2. منع النقر على الروابط التي تؤدي إلى تحديث الصفحة
                        document.addEventListener('click', function(e) {
                            let target = e.target;

                            // العثور على العنصر <a> الأقرب
                            while (target && target !== document && target.tagName !== 'A') {
                                target = target.parentNode;
                            }

                            if (target && target.tagName === 'A') {
                                const href = target.getAttribute('href') || '';

                                // إذا كان الرابط يؤدي إلى نفس الصفحة
                                if (href === '' || href === '#' || href.startsWith('javascript:') ||
                                    href.includes(window.location.pathname)) {
                                    // السماح بهذه الروابط
                                    return;
                                }

                                // إذا كان الرابط يؤدي إلى صفحة مختلفة، نمنعه
                                if (href && !target.target) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    console.log('⛔ منع التنقل إلى:', href);

                                    // إشعار المستخدم
                                    alert('⚠️ التنقل إلى صفحات خارجية معطل في وضع اللاعب الثاني');
                                    return false;
                                }
                            }
                        }, true);

                        // 3. منع إرسال النماذج التي تؤدي إلى تحديث
                        document.addEventListener('submit', function(e) {
                            if (e.target && e.target.tagName === 'FORM') {
                                const form = e.target;
                                if (form.getAttribute('target') !== '_blank') {
                                    console.log('⛔ منع إرسال النموذج');

                                    // يمكنك تعديل هذا بناءً على احتياجاتك
                                    const shouldAllow = confirm('هل تريد إرسال هذا النموذج؟');
                                    if (!shouldAllow) {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        return false;
                                    }
                                }
                            }
                        }, true);

                        // 4. منع window.location.reload و window.location.replace
                        const originalReload = window.location.reload;
                        window.location.reload = function() {
                            console.log('⛔ منع إعادة التحميل');
                            return false;
                        };

                        const originalReplace = window.location.replace;
                        window.location.replace = function(url) {
                            console.log('⛔ منع استبدال الصفحة:', url);
                            return false;
                        };

                        // 5. إضافة زر لإعادة التحميل اليدوي إذا لزم الأمر
                        const reloadBtn = document.createElement('button');
                        reloadBtn.innerHTML = '🔄';
                        reloadBtn.title = 'إعادة تحميل يدوي (Ctrl+R)';
                        reloadBtn.style.cssText = \`
                            position: fixed;
                            top: 10px;
                            right: 60px;
                            width: 30px;
                            height: 30px;
                            background: #3498db;
                            color: white;
                            border: none;
                            border-radius: 50%;
                            cursor: pointer;
                            z-index: 9999;
                            font-size: 16px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        \`;

                        reloadBtn.addEventListener('click', function(e) {
                            e.preventDefault();
                            e.stopPropagation();

                            if (confirm('هل تريد إعادة تحميل هذه الصفحة؟')) {
                                // استخدام طريقة آمنة لإعادة التحميل
                                window.location.href = window.location.href;
                            }
                        });

                        document.body.appendChild(reloadBtn);

                        // 6. إضافة رسالة ترحيبية
                        setTimeout(() => {
                            const welcomeMsg = document.createElement('div');
                            welcomeMsg.innerHTML = \`
                                <div style="
                                    position: fixed;
                                    top: 50px;
                                    right: 10px;
                                    background: rgba(52, 152, 219, 0.9);
                                    color: white;
                                    padding: 10px;
                                    border-radius: 5px;
                                    font-size: 12px;
                                    z-index: 9998;
                                    max-width: 200px;
                                    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                                ">
                                    🔒 وضع اللاعب الثاني<br>
                                    <small>التحديث التلقائي معطل</small>
                                </div>
                            \`;
                            document.body.appendChild(welcomeMsg);

                            setTimeout(() => {
                                welcomeMsg.style.opacity = '0';
                                welcomeMsg.style.transition = 'opacity 1s';
                                setTimeout(() => welcomeMsg.remove(), 1000);
                            }, 3000);
                        }, 1000);

                        console.log('✅ نظام منع التحديث جاهز');
                    })();
                `;

                // إنشاء عنصر سكريبت وحقنه
                const script = iframeDoc.createElement('script');
                script.textContent = preventionScript;
                iframeDoc.head.appendChild(script);

                console.log('✅ تم حقن سكريبت منع التحديث في iframe');

            } catch (error) {
                console.log('⚠️ لا يمكن حقن سكريبت في iframe:', error);
            }
        }

        // التركيز على لاعب معين
        function focusPlayer(playerNum) {
            if (playerNum === 1) {
                // التركيز على الصفحة الرئيسية
                window.focus();

                // محاولة التركيز على عنصر قابل للتركيز
                setTimeout(() => {
                    try {
                        const focusable = document.querySelector('button, input, textarea, select, [tabindex]:not([tabindex="-1"])');
                        if (focusable) {
                            focusable.focus();
                        }
                    } catch(e) {}
                }, 50);

            } else {
                // التركيز على iframe
                player2Frame.focus();

                // محاولة التركيز داخل iframe
                setTimeout(() => {
                    try {
                        const iframeWindow = player2Frame.contentWindow;
                        iframeWindow.focus();

                        // محاولة التركيز على عنصر داخل iframe
                        const iframeDoc = player2Frame.contentDocument;
                        if (iframeDoc) {
                            const iframeFocusable = iframeDoc.querySelector('button, input, textarea, select, [tabindex]:not([tabindex="-1"])');
                            if (iframeFocusable) {
                                iframeFocusable.focus();
                            }
                        }
                    } catch(e) {}
                }, 50);
            }
        }

        // التبديل بين اللاعبين
        function switchPlayer(playerNum) {
            if (!state.systemActive || state.isSwitching) return;

            state.isSwitching = true;
            console.log(`🔄 تبديل إلى لاعب ${playerNum}`);

            // تحديث الحالة
            state.activePlayer = playerNum;

            if (playerNum === 1) {
                // إخفاء اللاعب الثاني
                player2Box.style.display = 'none';
                statusBar.textContent = '👤 لاعب 1 نشط (Tab للتبديل)';

                // التركيز على اللاعب 1
                focusPlayer(1);

                // تحديث مظهر الزر
                mainBtn.style.background = '#3498db';
                mainBtn.innerHTML = '🔘';

            } else {
                // تحميل اللاعب الثاني إذا لم يكن محملاً
                if (!state.player2Loaded) {
                    loadPlayer2();
                }

                // إظهار اللاعب الثاني
                player2Box.style.display = 'block';
                statusBar.textContent = '👤 لاعب 2 نشط (Tab للتبديل)';
                statusBar.style.display = 'block';

                // التركيز على اللاعب 2
                focusPlayer(2);

                // تحديث مظهر الزر
                mainBtn.style.background = '#e74c3c';
                mainBtn.innerHTML = '🔴';
            }

            setTimeout(() => {
                state.isSwitching = false;
            }, 100);
        }

        // تبديل اللاعبين (وظيفة التبديل)
        function togglePlayer() {
            const nextPlayer = state.activePlayer === 1 ? 2 : 1;
            switchPlayer(nextPlayer);
        }

        // تشغيل/إيقاف النظام
        function toggleSystem() {
            state.systemActive = !state.systemActive;

            if (state.systemActive) {
                // تشغيل النظام
                console.log('✅ نظام اللاعب المزدوج مفعل');

                // تحميل اللاعب الثاني
                loadPlayer2();

                // البدء باللاعب 1
                state.activePlayer = 1;
                switchPlayer(1);

                // إظهار شريط الحالة
                statusBar.style.display = 'block';

                // إعداد مستمعات الأحداث
                setupEventListeners();

            } else {
                // إيقاف النظام
                console.log('❌ نظام اللاعب المزدوج معطل');

                // إخفاء العناصر
                player2Box.style.display = 'none';
                statusBar.style.display = 'none';

                // إعادة تعيين الزر
                mainBtn.style.background = '#3498db';
                mainBtn.innerHTML = '🔘';

                // إزالة مستمعات الأحداث
                removeEventListeners();
            }
        }

        // ===== معالجة الأحداث =====
        function setupEventListeners() {
            // أحداث لوحة المفاتيح للصفحة الرئيسية
            document.addEventListener('keydown', handleKeyDown);

            // حدث تحميل iframe لحقن سكريبت منع التحديث
            player2Frame.addEventListener('load', function() {
                console.log('📦 iframe محمل، حقن سكريبت منع التحديث...');

                // انتظر قليلاً ثم حقن السكريبت
                setTimeout(() => {
                    injectPreventionScript(player2Frame);
                }, 1000);

                // إعداد أحداث داخل iframe للتبديل
                setTimeout(() => {
                    try {
                        const iframeDoc = player2Frame.contentDocument;
                        const iframeWindow = player2Frame.contentWindow;

                        // سكريبت للتبديل من داخل iframe
                        const switchScript = `
                            // مستمع Tab داخل iframe
                            document.addEventListener('keydown', function(e) {
                                if (e.key === 'Tab' && !e.ctrlKey && !e.altKey) {
                                    e.preventDefault();
                                    e.stopPropagation();

                                    // إرسال رسالة للصفحة الرئيسية للتبديل
                                    window.parent.postMessage({
                                        type: 'DUAL_PLAYER_SWITCH',
                                        from: 'iframe',
                                        action: 'toggle'
                                    }, '*');
                                }

                                // Esc للعودة للاعب 1
                                if (e.key === 'Escape') {
                                    window.parent.postMessage({
                                        type: 'DUAL_PLAYER_SWITCH',
                                        from: 'iframe',
                                        action: 'switch_to_1'
                                    }, '*');
                                }
                            });

                            // مستمع النقر للتركيز
                            document.addEventListener('click', function() {
                                window.focus();
                            });
                        `;

                        const script = iframeDoc.createElement('script');
                        script.textContent = switchScript;
                        iframeDoc.head.appendChild(script);

                    } catch(e) {
                        console.log('⚠️ لا يمكن إضافة أحداث داخل iframe');
                    }
                }, 500);
            });

            // استقبال الرسائل من iframe
            window.addEventListener('message', function(event) {
                if (event.data && event.data.type === 'DUAL_PLAYER_SWITCH') {
                    if (event.data.action === 'toggle') {
                        togglePlayer();
                    } else if (event.data.action === 'switch_to_1') {
                        switchPlayer(1);
                    }
                }
            });
        }

        function removeEventListeners() {
            document.removeEventListener('keydown', handleKeyDown);
        }

        function handleKeyDown(e) {
            if (!state.systemActive) return;

            // Tab للتبديل
            if (e.key === 'Tab' && !e.ctrlKey && !e.altKey) {
                e.preventDefault();
                togglePlayer();
                return;
            }

            // Ctrl+D لتشغيل/إيقاف النظام
            if (e.ctrlKey && e.key === 'd') {
                e.preventDefault();
                toggleSystem();
                return;
            }

            // 1 للاعب 1
            if (e.key === '1' && !e.ctrlKey) {
                e.preventDefault();
                switchPlayer(1);
                return;
            }

            // 2 للاعب 2
            if (e.key === '2' && !e.ctrlKey) {
                e.preventDefault();
                switchPlayer(2);
                return;
            }

            // Esc للعودة للاعب 1
            if (e.key === 'Escape') {
                e.preventDefault();
                switchPlayer(1);
                return;
            }

            // F5 أو Ctrl+R لمنع التحديث في وضع اللاعب 2
            if ((e.key === 'F5' || (e.ctrlKey && e.key === 'r')) && state.activePlayer === 2) {
                e.preventDefault();
                alert('⚠️ التحديث معطل في وضع اللاعب الثاني');
                return;
            }
        }

        // ===== أحداث الأزرار =====
        mainBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            toggleSystem();
        });

        mainBtn.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.boxShadow = '0 5px 15px rgba(0,0,0,0.4)';
        });

        mainBtn.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = '0 3px 10px rgba(0,0,0,0.3)';
        });

        // ===== إضافة CSS =====
        const style = document.createElement('style');
        style.textContent = `
            #player2Box {
                transition: opacity 0.3s ease;
            }

            #dualStatusBar {
                transition: all 0.3s ease;
                font-weight: bold;
                text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
            }

            #dualMainBtn {
                transition: all 0.3s ease;
            }

            /* تحسين مظهر iframe */
            #player2Frame {
                transform: translateZ(0);
                backface-visibility: hidden;
            }

            /* تحذير عند محاولة التحديث */
            .refresh-warning {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(231, 76, 60, 0.9);
                color: white;
                padding: 20px;
                border-radius: 10px;
                z-index: 100000;
                text-align: center;
                box-shadow: 0 5px 30px rgba(0,0,0,0.5);
            }
        `;
        document.head.appendChild(style);

        console.log('✅ النظام مع sandbox جاهز! اضغط Ctrl+D للبدء');
    }
})();
