// ==UserScript==
// @name         Arabic Keyboard Remapper
// @namespace    http://tampermonkey.net/
// @version      5.1
// @description  Maps English keyboard to Arabic letters (QWERTY to Arabic layout)
// @author       Your Name
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/558158/Arabic%20Keyboard%20Remapper.user.js
// @updateURL https://update.greasyfork.org/scripts/558158/Arabic%20Keyboard%20Remapper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('===========================================');
    console.log('ARABIC KEYBOARD SCRIPT STARTING...');
    console.log('===========================================');

    // الخريطة الرئيسية - تخطيط لوحة المفاتيح القياسي
    var map = {
        // Row 1
        '`': 'ذ', '~': 'ّ',
        '1': '١', '!': '!',
        '2': '٢', '@': '"',
        '3': '٣', '#': '٣',
        '4': '٤', '$': '٤',
        '5': '٥', '%': '٥',
        '6': '٦', '^': '^',
        '7': '٧', '&': '&',
        '8': '٨', '*': '*',
        '9': '٩', '(': '(',
        '0': '٠', ')': ')',
        '-': '-', '_': '_',
        '=': '=', '+': '+',
        
        // Row 2 (QWERTY)
        'q': 'ض', 'Q': 'َ',      // Fatha
        'w': 'ص', 'W': 'ً',      // Fathatan
        'e': 'ث', 'E': 'ُ',      // Damma
        'r': 'ق', 'R': 'ٌ',      // Dammatan
        't': 'ف', 'T': 'لإ',     // Lam + Alef with Hamza below
        'y': 'غ', 'Y': 'إ',      // Alef with Hamza below
        'u': 'ع', 'U': '`',      // Hamza
        'i': 'ه', 'I': 'ِ',      // Kasra
        'o': 'خ', 'O': 'ٍ',      // Kasratan
        'p': 'ح', 'P': '؛',      // Arabic semicolon
        '[': 'ج', '{': '}',
        ']': 'د', '}': '{',
        '\\': '\\', '|': '|',
        
        // Row 3 (ASDF)
        'a': 'ش', 'A': 'ّ',      // Shadda
        's': 'س', 'S': 'ْ',      // Sukun
        'd': 'ي', 'D': ']',
        'f': 'ب', 'F': '[',
        'g': 'ل', 'G': 'لأ',     // Lam + Alef with Hamza above
        'h': 'ا', 'H': 'أ',      // Alef with Hamza above
        'j': 'ت', 'J': 'ـ',      // Tatweel
        'k': 'ن', 'K': '،',      // Arabic comma
        'l': 'م', 'L': '/',
        ';': 'ك', ':': ':',
        "'": 'ط', '"': '"',
        
        // Row 4 (ZXCV)
        'z': 'ئ', 'Z': '~',
        'x': 'ء', 'X': 'ْ',      // Sukun (alternative)
        'c': 'ؤ', 'C': '}',
        'v': 'ر', 'V': '{',
        'b': 'لا', 'B': 'لآ',    // Lam + Alef with Madda
        'n': 'ى', 'N': 'آ',      // Alef with Madda
        'm': 'ة', 'M': "'",
        ',': 'و', '<': ',',
        '.': 'ز', '>': '.',
        '/': 'ظ', '?': '؟'      // Arabic question mark
    };

    console.log('Map created with ' + Object.keys(map).length + ' entries');

    // قائمة بأنواع المدخلات المسموح بها
    var allowedInputTypes = [
        'text', 'password', 'search', 'email', 'url', 'tel', 'number'
    ];

    function isEditableElement(element) {
        // التحقق مما إذا كان العنصر قابل للتحرير
        if (element.isContentEditable) {
            return true;
        }
        
        if (element.tagName === 'TEXTAREA') {
            return true;
        }
        
        if (element.tagName === 'INPUT') {
            var type = element.type.toLowerCase();
            return allowedInputTypes.includes(type);
        }
        
        // للعناصر الأخرى مثل div[contenteditable="true"]
        if (element.hasAttribute('contenteditable') && 
            element.getAttribute('contenteditable').toLowerCase() === 'true') {
            return true;
        }
        
        return false;
    }

    function handleKeyDown(e) {
        // تجاهل التركيبات الخاصة (Ctrl, Alt, Win/Command)
        if (e.ctrlKey || e.altKey || e.metaKey) {
            return;
        }
        
        // تجاهل المفاتيح الوظيفية (F1-F12)
        if (e.key.length > 1 && ![' ', 'Enter', 'Tab'].includes(e.key)) {
            return;
        }

        var element = e.target;
        
        // التحقق مما إذا كان العنصر قابل للتحرير
        if (!isEditableElement(element)) {
            return;
        }
        
        // الحصول على المفتاح المضغوط
        var key = e.key;
        
        // التحقق مما إذا كان المفتاح موجود في الخريطة
        if (map.hasOwnProperty(key)) {
            e.preventDefault();
            e.stopImmediatePropagation();
            
            var arabicChar = map[key];
            
            if (element.isContentEditable || element.hasAttribute('contenteditable')) {
                // للعناصر القابلة للتحرير (contentEditable)
                try {
                    document.execCommand('insertText', false, arabicChar);
                } catch (error) {
                    // Fallback يدوي
                    var selection = window.getSelection();
                    if (selection.rangeCount > 0) {
                        var range = selection.getRangeAt(0);
                        range.deleteContents();
                        var textNode = document.createTextNode(arabicChar);
                        range.insertNode(textNode);
                        range.setStartAfter(textNode);
                        range.setEndAfter(textNode);
                        selection.removeAllRanges();
                        selection.addRange(range);
                    }
                }
            } else {
                // لحقول الإدخال العادية (input, textarea)
                var start = element.selectionStart;
                var end = element.selectionEnd;
                var value = element.value;
                
                // استبدال النص المحدد أو إدراج الحرف الجديد
                element.value = value.substring(0, start) + arabicChar + value.substring(end);
                
                // تحديث موضع المؤشر
                element.selectionStart = element.selectionEnd = start + arabicChar.length;
                
                // تشغيل الأحداث المطلوبة للتطبيقات الحديثة
                var events = ['input', 'change', 'keyup'];
                events.forEach(function(eventName) {
                    var event = new Event(eventName, {
                        bubbles: true,
                        cancelable: true
                    });
                    element.dispatchEvent(event);
                });
            }
            
            console.debug('Mapped: "' + key + '" → "' + arabicChar + '"');
        }
    }

    // إضافة المستمع للحدث
    document.addEventListener('keydown', handleKeyDown, {
        capture: true,
        passive: false
    });

    // دالة لتفعيل/تعطيل البرنامج النصي
    function toggleScript() {
        var isEnabled = !window.arabicKeyboardEnabled;
        window.arabicKeyboardEnabled = isEnabled;
        
        if (isEnabled) {
            document.addEventListener('keydown', handleKeyDown, {
                capture: true,
                passive: false
            });
            console.log('Arabic Keyboard: ENABLED');
        } else {
            document.removeEventListener('keydown', handleKeyDown, true);
            console.log('Arabic Keyboard: DISABLED');
        }
        
        // إشعار بصري مؤقت
        showNotification('Arabic Keyboard: ' + (isEnabled ? 'ENABLED' : 'DISABLED'));
    }

    // دالة لعرض إشعار
    function showNotification(message) {
        var notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            z-index: 10000;
            font-family: Arial, sans-serif;
            font-size: 14px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            transition: opacity 0.3s;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(function() {
            notification.style.opacity = '0';
            setTimeout(function() {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 2000);
    }

    // إضافة اختصار لوحة المفاتيح لتفعيل/تعطيل البرنامج (Ctrl+Alt+A)
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'a') {
            e.preventDefault();
            toggleScript();
        }
    });

    // تهيئة الحالة
    window.arabicKeyboardEnabled = true;

    console.log('===========================================');
    console.log('ARABIC KEYBOARD IS NOW ACTIVE!');
    console.log('Usage: Type in any text field to use Arabic keyboard mapping');
    console.log('Toggle: Press Ctrl+Alt+A to enable/disable');
    console.log('===========================================');

})();