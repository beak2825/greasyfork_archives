// ==UserScript==
// @name         Шифровальщик прога текст в брейнрот животные
// @namespace    http://tampermonkey.net/
// @version      4.4.4.4
// @description  Справа снизу там кнопка будет, кликнишеь
// @author       Твой батя педик
// @include      *://ok.ru/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
// @run-at       document-end
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/555771/%D0%A8%D0%B8%D1%84%D1%80%D0%BE%D0%B2%D0%B0%D0%BB%D1%8C%D1%89%D0%B8%D0%BA%20%D0%BF%D1%80%D0%BE%D0%B3%D0%B0%20%D1%82%D0%B5%D0%BA%D1%81%D1%82%20%D0%B2%20%D0%B1%D1%80%D0%B5%D0%B9%D0%BD%D1%80%D0%BE%D1%82%20%D0%B6%D0%B8%D0%B2%D0%BE%D1%82%D0%BD%D1%8B%D0%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/555771/%D0%A8%D0%B8%D1%84%D1%80%D0%BE%D0%B2%D0%B0%D0%BB%D1%8C%D1%89%D0%B8%D0%BA%20%D0%BF%D1%80%D0%BE%D0%B3%D0%B0%20%D1%82%D0%B5%D0%BA%D1%81%D1%82%20%D0%B2%20%D0%B1%D1%80%D0%B5%D0%B9%D0%BD%D1%80%D0%BE%D1%82%20%D0%B6%D0%B8%D0%B2%D0%BE%D1%82%D0%BD%D1%8B%D0%B5.meta.js
// ==/UserScript==

// Урод, в поисковик вбей сможешь найти других найти 🛹🐭🚬🐟🦈🐋🐳🐬🐡🦃
// Люблю тебя, дорогой пользователь

(function() {
    'use strict';

    const мяуКодировщик = {
        'A': '🐶', 'B': '🐱', 'C': '🐤', 'D': '🐹', 'E': '🐰', 'F': '🚬', 'G': '🐋', 'H': '🐼',
        'I': '🐨', 'J': '🐯', 'K': '🦁', 'L': '🐮', 'M': '🐷', 'N': '🐽', 'O': '🐸', 'P': '🐵',
        'Q': '🙈', 'R': '🙉', 'S': '🙊', 'T': '🐒', 'U': '🛹', 'V': '🐳', 'W': '🐦', 'X': '🐡',
        'Y': '🦆', 'Z': '🦅', 'a': '🦉', 'b': '🦇', 'c': '🐺', 'd': '🦈', 'e': '🐴', 'f': '🦄',
        'g': '🐝', 'h': '🪱', 'i': '🦋', 'j': '🐛', 'k': '🐬', 'l': '🐞', 'm': '🐜', 'n': '🪰',
        'o': '🪲', 'p': '🦗', 'q': '🕷', 'r': '🦂', 's': '🐟', 't': '🐍', 'u': '🦎', 'v': '🦖',
        'w': '🦕', 'x': '🐙', 'y': '🦑', 'z': '🦐', '0': '🦞', '1': '🦃', '2': '🐭', '3': '🐠',
        '4': '🐢', '5': '🐌', '6': '🐧', '7': '🐻', '8': '🐗', '9': '🐊', '+': '🐅', '/': '🐆', '=': '💀'
    };

    const пиписьДекодировщик = Object.fromEntries(
        Object.entries(мяуКодировщик).map(([ключик, животинка]) => [животинка, ключик])
    );

    function шифруемТекстВЖивотинки(текстулечка) {
        return текстулечка.split('').map(буковка => мяуКодировщик[буковка] || буковка).join('');
    }

    function расшифровкаЖивотинекВТекст(животныйТекст) {
        return Array.from(животныйТекст).map(животинка => пиписьДекодировщик[животинка] || животинка).join('');
    }

    function ШифруемСоединённое(текстулечка, пароликус) {
        try {
            const зашифрованныйМуж = CryptoJS.AES.encrypt(текстулечка, пароликус).toString();
            return шифруемТекстВЖивотинки(зашифрованныйМуж);
        } catch(e) {
            return 'Ошибка шифрования';
        }
    }

    function РасшифровкаСоединённое(животныйТекст, пароликус) {
        try {
            const зашифрованныйМуж = расшифровкаЖивотинекВТекст(животныйТекст);
            const байтики = CryptoJS.AES.decrypt(зашифрованныйМуж, пароликус);
            const расшифрованнаяТушка = байтики.toString(CryptoJS.enc.Utf8);
            
            if (!расшифрованнаяТушка) {
                return 'Ошибка: неверный пароль';
            }
            
            return расшифрованнаяТушка;
        } catch(e) {
            return 'Ошибка расшифровки';
        }
    }

    const стильХПяшка = `
        #xp-window {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 10000;
            width: 380px;
            background: linear-gradient(180deg, #0a246a 0%, #1084d7 100%);
            border: 2px solid;
            border-color: #dfdfdf #808080 #808080 #dfdfdf;
            box-shadow: 1px 1px 0 0 #ffffff inset;
            font-family: 'MS Sans Serif', Arial, sans-serif;
            font-size: 11px;
            color: #000;
            user-select: none;
            display: none;
        }

        #xp-window.visible {
            display: block;
        }

        #xp-title {
            background: linear-gradient(90deg, #000080 0%, #1084d7 100%);
            color: #fff;
            padding: 2px 2px 2px 4px;
            font-weight: bold;
            font-size: 11px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: move;
            height: 20px;
        }

        #xp-title-text {
            display: flex;
            align-items: center;
            gap: 4px;
        }

        #xp-close {
            width: 18px;
            height: 14px;
            background: linear-gradient(180deg, #dfdfdf 0%, #808080 100%);
            border: 1px solid;
            border-color: #dfdfdf #808080 #808080 #dfdfdf;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 10px;
            color: #000;
            font-weight: bold;
        }

        #xp-close:active {
            border-color: #808080 #dfdfdf #dfdfdf #808080;
        }

        #xp-content {
            background: #ecebeb;
            padding: 6px;
            border: 2px solid;
            border-color: #ffffff #808080 #808080 #ffffff;
        }

        .xp-group {
            background: linear-gradient(180deg, #0a246a 0%, #1084d7 100%);
            border: 2px solid;
            border-color: #dfdfdf #808080 #808080 #dfdfdf;
            padding: 4px;
            margin-bottom: 6px;
            color: #000;
            font-size: 10px;
            font-weight: bold;
        }

        .xp-group-label {
            position: relative;
            top: -8px;
            left: 4px;
            background: #ecebeb;
            padding: 0 2px;
            display: inline-block;
            color: #000;
        }

        .xp-textarea {
            width: 100%;
            height: 60px;
            padding: 3px;
            border: 2px solid;
            border-color: #808080 #dfdfdf #dfdfdf #808080;
            background: #fff;
            font-family: 'Courier New', monospace;
            font-size: 10px;
            color: #000;
            box-sizing: border-box;
            margin-bottom: 4px;
            resize: none;
        }

        .xp-textarea:focus {
            outline: none;
        }

        .xp-input {
            width: 100%;
            height: 20px;
            padding: 3px;
            border: 2px solid;
            border-color: #808080 #dfdfdf #dfdfdf #808080;
            background: #fff;
            font-family: 'MS Sans Serif', Arial, sans-serif;
            font-size: 10px;
            color: #000;
            box-sizing: border-box;
            margin-bottom: 4px;
        }

        .xp-input:focus {
            outline: none;
        }

        .xp-button-group {
            display: flex;
            gap: 4px;
            margin-bottom: 6px;
        }

        .xp-button {
            flex: 1;
            padding: 4px 8px;
            background: linear-gradient(180deg, #dfdfdf 0%, #808080 100%);
            border: 2px solid;
            border-color: #dfdfdf #808080 #808080 #dfdfdf;
            color: #000;
            font-family: 'MS Sans Serif', Arial, sans-serif;
            font-size: 11px;
            font-weight: bold;
            cursor: pointer;
            user-select: none;
            text-align: center;
            height: 22px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .xp-button:hover {
            background: linear-gradient(180deg, #e8e8e8 0%, #898989 100%);
        }

        .xp-button:active {
            border-color: #808080 #dfdfdf #dfdfdf #808080;
            background: linear-gradient(180deg, #c0c0c0 0%, #707070 100%);
        }

        .xp-info {
            background: #ecebeb;
            border: 1px solid #808080;
            padding: 4px;
            margin-bottom: 6px;
            font-size: 9px;
            color: #000;
            line-height: 1.4;
        }

        #xp-toggle {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            width: 32px;
            height: 32px;
            background: linear-gradient(180deg, #dfdfdf 0%, #808080 100%);
            border: 2px solid;
            border-color: #dfdfdf #808080 #808080 #dfdfdf;
            color: #000;
            font-size: 16px;
            cursor: pointer;
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: Arial, sans-serif;
        }

        #xp-toggle:hover {
            background: linear-gradient(180deg, #e8e8e8 0%, #898989 100%);
        }

        #xp-toggle:active {
            border-color: #808080 #dfdfdf #dfdfdf #808080;
        }
    `;

    GM_addStyle(стильХПяшка);

    function создайКрасивеньОкошечко() {
        const окошечко = document.createElement('div');
        окошечко.id = 'xp-window';

        const заголовочек = document.createElement('div');
        заголовочек.id = 'xp-title';
        заголовочек.innerHTML = `
            <div id="xp-title-text">
                <span style="font-size: 12px;">🎭</span>
                <span>МяуМяуМЯУ!!1!</span>
            </div>
            <div id="xp-close">×</div>
        `;

        const содержимочко = document.createElement('div');
        содержимочко.id = 'xp-content';

        const информашка = document.createElement('div');
        информашка.className = 'xp-info';
        информашка.innerHTML = '<h4><strong style="color: #000; font-weight: 900;">Слыш поц, Добавь меня в друзья в Одноклассники <u><a style="color:blue" href="https://ok.ru/profile/910108178260" target="_blank">КЛИК</a></u></strong></h4>';

        const группаПароля = document.createElement('div');
        группаПароля.className = 'xp-group';
        группаПароля.innerHTML = '<div class="xp-group-label">Пароль</div>';

        const пароликус = document.createElement('input');
        пароликус.type = 'password';
        пароликус.id = 'xp-password';
        пароликус.className = 'xp-input';
        пароликус.placeholder = 'ok.ru';
        пароликус.value = 'ok.ru';
        группаПароля.appendChild(пароликус);

        const группаВхода = document.createElement('div');
        группаВхода.className = 'xp-group';
        группаВхода.innerHTML = '<div class="xp-group-label">Входные данные</div>';

        const полеВвода = document.createElement('textarea');
        полеВвода.id = 'xp-input';
        полеВвода.className = 'xp-textarea';
        полеВвода.placeholder = 'Введите текст...';
        группаВхода.appendChild(полеВвода);

        const группаВывода = document.createElement('div');
        группаВывода.className = 'xp-group';
        группаВывода.innerHTML = '<div class="xp-group-label">Результат</div>';

        const полеВывода = document.createElement('textarea');
        полеВывода.id = 'xp-output';
        полеВывода.className = 'xp-textarea';
        полеВывода.readOnly = true;
        полеВывода.placeholder = 'Результат...';
        группаВывода.appendChild(полеВывода);

        let режимКодирования = true;

        function обновиТихонько() {
            if (!полеВвода.value) {
                полеВывода.value = '';
                return;
            }
            
            const пасспортик = пароликус.value || 'ok.ru';
            
            if (режимКодирования) {
                полеВывода.value = ШифруемСоединённое(полеВвода.value, пасспортик);
            } else {
                полеВывода.value = РасшифровкаСоединённое(полеВвода.value, пасспортик);
            }
        }

        полеВвода.addEventListener('input', обновиТихонько);
        пароликус.addEventListener('input', обновиТихонько);

        const группаКнопочек = document.createElement('div');
        группаКнопочек.className = 'xp-button-group';

        const кнопкаРежима = document.createElement('button');
        кнопкаРежима.className = 'xp-button';
        кнопкаРежима.textContent = 'Кодировать';
        кнопкаРежима.id = 'xp-mode-btn';
        кнопкаРежима.onclick = () => {
            режимКодирования = !режимКодирования;
            кнопкаРежима.textContent = режимКодирования ? 'Кодировать' : 'Декодировать';
            полеВвода.placeholder = режимКодирования ? 'Введите текст...' : 'Введите животные-код...';
            полеВывода.value = '';
            полеВвода.value = '';
            полеВвода.focus();
        };

        const кнопкаКопирования = document.createElement('button');
        кнопкаКопирования.className = 'xp-button';
        кнопкаКопирования.textContent = 'Копировать';
        кнопкаКопирования.onclick = () => {
            if (полеВывода.value) {
                navigator.clipboard.writeText(полеВывода.value);
                const оригинальнаяТекстина = кнопкаКопирования.textContent;
                кнопкаКопирования.textContent = 'OK!';
                setTimeout(() => кнопкаКопирования.textContent = оригинальнаяТекстина, 1500);
            }
        };

        группаКнопочек.appendChild(кнопкаРежима);
        группаКнопочек.appendChild(кнопкаКопирования);

        содержимочко.appendChild(информашка);
        содержимочко.appendChild(группаПароля);
        содержимочко.appendChild(группаВхода);
        содержимочко.appendChild(группаВывода);
        содержимочко.appendChild(группаКнопочек);

        окошечко.appendChild(заголовочек);
        окошечко.appendChild(содержимочко);
        document.body.appendChild(окошечко);

        document.getElementById('xp-close').onclick = () => {
            окошечко.classList.remove('visible');
        };

        let перетаскиваемся = false;
        let смещеньице_х = 0;
        let смещеньице_у = 0;

        заголовочек.addEventListener('mousedown', (e) => {
            перетаскиваемся = true;
            смещеньице_х = e.clientX - окошечко.offsetLeft;
            смещеньице_у = e.clientY - окошечко.offsetTop;
        });

        document.addEventListener('mousemove', (e) => {
            if (перетаскиваемся) {
                окошечко.style.left = (e.clientX - смещеньице_х) + 'px';
                окошечко.style.top = (e.clientY - смещеньице_у) + 'px';
                окошечко.style.bottom = 'auto';
                окошечко.style.right = 'auto';
            }
        });

        document.addEventListener('mouseup', () => {
            перетаскиваемся = false;
        });
    }

    function создайПушистуюКнопку() {
        const кнопка = document.createElement('button');
        кнопка.id = 'xp-toggle';
        кнопка.textContent = '🎭';
        кнопка.title = 'Буээээ Сукаэаэ';
        кнопка.onclick = () => {
            const окошечко = document.getElementById('xp-window');
            if (окошечко) {
                окошечко.classList.toggle('visible');
            }
        };
        document.body.appendChild(кнопка);
    }

    if (document.readyState === 'loading') {
        window.addEventListener('load', () => {
            создайКрасивеньОкошечко();
            создайПушистуюКнопку();
        });
    } else {
        создайКрасивеньОкошечко();
        создайПушистуюКнопку();
    }
})();
