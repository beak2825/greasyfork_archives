// ==UserScript==
// @name           Custom search and highlighting aka (Ctrl+F)
// @namespace      http://tampermonkey.net/
// @version        2025-10-31.1.33
// @description    search and highlight  tool
// @author         kr6r5kugkkgk
// @match          *://*/*
// @license        MIT
// @run-at         document-idle
// @icon           https://i.pinimg.com/originals/79/09/89/7909897ceea2691e5a4942766c678ff3.png
// @downloadURL https://update.greasyfork.org/scripts/554369/Custom%20search%20and%20highlighting%20aka%20%28Ctrl%2BF%29.user.js
// @updateURL https://update.greasyfork.org/scripts/554369/Custom%20search%20and%20highlighting%20aka%20%28Ctrl%2BF%29.meta.js
// ==/UserScript==


(function() {
    'use strict';
    // Переменные для функционала
    let matches = [];
    let currentIndex = -1;
    // Переменные для настроек подсветки (по умолчанию)
    let settings = {
        highlightDefaultBg: 'rgb(52, 22, 86)',
        highlightCurrentBg: 'rgb(179, 117, 238)',
        highlightTextColor: 'rgb(232, 248, 101)',
        highlightBorderColor: 'rgb(139, 248, 194)',
        highlightBorderRadius: 12,
        highlightBorderThickness: 2,
        highlightDefaultOpacity: 0.8,  // Новое: прозрачность для обычного фона (0-1)
        highlightCurrentOpacity: 1.0,  // Новое: прозрачность для текущего фона (0-1)
        highlightPadding: 5 , 
        lang: 'ru'
 // Новое: padding в px для mark
    };
    const translations = {
    ru: {
        toggleTooltip: 'Свернуть/развернуть поисковую панель',
        searchPlaceholder: 'Поиск по странице...',
        settingsTitle: 'Настройки подсветки',
        defaultBg: 'Цвет фона (обычный):',
        defaultOpacity: 'Прозрачность обычного фона (0-1):',
        currentBg: 'Цвет фона (текущий):',
        currentOpacity: 'Прозрачность текущего фона (0-1):',
        textColor: 'Цвет текста:',
        borderColor: 'Цвет бордера:',
        borderRadius: 'Скругление (px):',
        borderThickness: 'Толщина бордера (px):',
        padding: 'Padding (px):',
        save: 'Сохранить',
        cancel: 'Отмена',
        lang: 'Язык интерфейса:'
    },
    en: {
        toggleTooltip: 'Toggle search-wrapper-panel' ,
        searchPlaceholder: 'Search page...',
        settingsTitle: 'Highlight settings',
        defaultBg: 'Default background:',
        defaultOpacity: 'Default opacity (0-1):',
        currentBg: 'Current background:',
        currentOpacity: 'Current opacity (0-1):',
        textColor: 'Text color:',
        borderColor: 'Border color:',
        borderRadius: 'Border radius (px):',
        borderThickness: 'Border thickness (px):',
        padding: 'Padding (px):',
        save: 'Save',
        cancel: 'Cancel',
        lang: 'Interface language:'
    }
};

    // Загрузка настроек из localStorage, если есть
    const savedSettings = localStorage.getItem('pageSearcherSettings');
    if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        settings = { ...settings, ...parsed };
    }
     // Функция для конвертации rgb в rgba с opacity
    function rgbToRgba(rgb, opacity) {
        if (rgb.startsWith('rgb(')) {
            const [r, g, b] = rgb.match(/\d+/g).map(Number);
            return `rgba(${r}, ${g}, ${b}, ${opacity})`;
        }
        return rgb;
    }
    // Функция применения настроек к существующим подсветкам
   function applySettings() {
        // Применяем к существующим matches
        matches.forEach((mark, i) => {
            if (!mark) return;
            const isCurrent = i === currentIndex;
            mark.style.color = settings.highlightTextColor;
            mark.style.border = `${settings.highlightBorderThickness}px solid ${settings.highlightBorderColor}`;
            mark.style.borderRadius = `${settings.highlightBorderRadius}px`;
            mark.style.padding = `${settings.highlightPadding}px`;
            mark.style.backgroundColor = rgbToRgba(
                isCurrent ? settings.highlightCurrentBg : settings.highlightDefaultBg,
                isCurrent ? settings.highlightCurrentOpacity : settings.highlightDefaultOpacity
            );
        });
        // Сохранение в localStorage
        localStorage.setItem('pageSearcherSettings', JSON.stringify(settings));
    }
    //===== Создание wrapper 
    const wrapper = document.createElement('div');
    wrapper.id = 'modifiedcstm-page-searcher-wrapper-r6ujr5jre5';
    wrapper.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        z-index: 999999 !important;
        display: flex;
        flex-direction: column;
        gap: 2px;
    `;
      //===== Кнопка сворачивания (всегда видна)
    const btnToggle = document.createElement('button');
    btnToggle.id = 'searche4nmx7hjn-toggle8nme5h-btnjre6';
    btnToggle.style.cssText  = ` 
               width: 30px;
               height: 30px;
               background: rgb(13, 61, 63);
               border: 1px solid rgb(139, 248, 194);
               border-radius: 5px;
               cursor: pointer;
               display: flex;
               align-items: center;
               justify-content: center;
               box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 10px;
               transition: background 0.3s;
               position: fixed;
               top: 1%;
               left: 58%;
               z-index: 999999 !important;
        `;
    // Обработчики для tooltip и клика
btnToggle.addEventListener('mouseenter', () => {
    tooltip.classList.add('show');
});
btnToggle.addEventListener('mouseleave', () => {
    tooltip.classList.remove('show');
});
btnToggle.addEventListener('click', () => {
    wrapper.classList.toggle('collapsed');
});

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('width', '16');
    svg.setAttribute('height', '16');
    svg.style.transition = 'transform 0.3s ease';
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M7 10l5 5 5-5z');
    path.setAttribute('fill', 'rgb(139, 248, 194)');
    svg.appendChild(path);
    btnToggle.appendChild(svg);
    // Создание кастомного tooltip
    const tooltip = document.createElement('div');
    tooltip.id = 'customherjr6-tooltip-toggle';
    tooltip.textContent = translations[settings.lang].toggleTooltip || 'Свернуть/развернуть поиск';  // Текст из translations (добавьте ключ, если ещё не)
    tooltip.style.cssText = `
        position: absolute;
        bottom: -35px;  /* Позиция относительно кнопки: снизу */
        left: 50%;
        transform: translateX(-50%);
    `;
    btnToggle.appendChild(tooltip);  // Вставляем tooltip как дочерний элемент кнопки
    // Стили для анимации и скрытия (убрали стили для mark, так как теперь inline)
    const style = document.createElement('style');
    style.textContent = `
/* Кастомный tooltip для кнопки сворачивания */
#customherjr6-tooltip-toggle {
    position: absolute;
    background: rgb(13, 61, 63);
    color: rgb(139, 248, 194);
    padding: 3px 7px;
    border-radius: 5px;
    border: 1px solid rgb(139, 248, 194);
    font-size: 12px;
    font-family: Arial, sans-serif;
    white-space: nowrap;
    z-index: 999999 !important
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease, visibility 0.3s ease;
    pointer-events: none;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.43);
}
#customherjr6-tooltip-toggle.show {
    opacity: 1;
    visibility: visible;
    z-index: 999999 !important
}
#searche4nmx7hjn-toggle8nme5h-btnjre6:hover #customherjr6-tooltip-toggle {
    display: block;
}
 #modifiedcstm-page-searcher-wrapper-r6ujr5jre5.collapsed #modifiedcstm-page-search-container-r6ujr5jre5 {
       display: none !important;
 }
 #searche4nmx7hjn-toggle8nme5h-btnjre6:hover {
      background: rgb(20, 80, 82);
 }
 #modifiedcstm-page-searcher-wrapper-r6ujr5jre5.collapsed #searche4nmx7hjn-toggle8nme5h-btnjre6 svg {
      transform: rotate(180deg);
 }
 input#input-searcj-on-paggeweb-text {
    background: #1f2a2f !important;
    border: 2px solid #46968d !important;
    color: antiquewhite !important;
 }
 #modifiedcstm-page-search-container-r6ujr5jre5 {
    display: flex !important;
}
 #searcherUp-btnUp-5en8h4w5en8m {
    padding: 5px !important;
    background: rgb(20 29 43) !important;
    color: rgb(139, 248, 194) !important;
    border: 1px solid rgb(139, 248, 194) !important;
    border-radius: 3px !important;
    cursor: pointer !important;
    width: 28px !important;
    height: 28px !important;
}

#searcherDown-btnDown-5en8h4w5en8m {
    padding: 5px !important;
    background: rgb(20 29 43) !important;
    color: rgb(139, 248, 194) !important;
    border: 1px solid rgb(139, 248, 194) !important;
    border-radius: 3px !important;
    cursor: pointer !important;
    width: 28px !important;
    height: 28px !important;
}

 #searche4nmx7hjn-toggle8nme5h-btnjre6:hover,
#searcherUp-btnUp-5en8h4w5en8m:hover,
#closeSsearchWrapper-8n5e85egh8n-he5hedhe5d:hover,
#searcherDown-btnDown-5en8h4w5en8m:hover,
#settings-btnCstm-page-searcher:hover {
      background-color: rgb(39 118 117 / 96%) !important;
    transform: scale(1.3)  !important;
    transition: all 0.3s ease  !important;
    fill: #70f4a4 !important;
}
 #settingsuje-modalhjer5mr6f-for-webSeracherfor {
    background: rgb(13, 61, 63) !important;
    border: 1px solid rgb(139, 248, 194) !important;
    border-radius: 5px !important;
    padding: 20px !important;
    width: 300px !important;
    color:rgb(255, 254, 221) !important;
    font-family: Arial, sans-serif !important;
    position: absolute !important;
    top: 105px !important;
}

button#save-settings ,  
button#cancel-settings,   
input#current-opacity,   
input#default-opacity,   
input#padding, 
input#border-thickness,  
input#border-radius,   
input#border-color,   
input#text-color,   
input#current-bg, 
select#lang-select,
input#default-bg  {
    appearance: none !important;
    padding: 3px !important;
    background: rgb(20 29 43) !important;
    color: rgb(190 255 246) !important;
    border: 1px solid rgb(139, 248, 194) !important;
    border-radius: 5px !important;  
}

button#save-settings:hover, 
button#cancel-settings:hover,  
input#current-opacity:hover,  
input#default-opacity:hover,  
input#padding:hover,
input#border-thickness:hover, 
input#border-radius:hover,  
input#border-color:hover,  
input#text-color:hover,  
input#current-bg:hover, 
input#default-bg:hover {
    appearance: none !important; 
    background: rgb(52, 77, 85) !important;
    color: rgb(139, 248, 194) !important;
    border: 1px solid rgb(139, 248, 194) !important;
    border-radius: 5px !important; 
    scale: 1.5 !important; 
} 
 select#lang-select:hover {
    appearance: none !important; 
    background: rgb(52, 77, 85) !important;
    color: rgb(139, 248, 194) !important;
    border: 1px solid rgb(139, 248, 194) !important;
    border-radius: 3px !important;  
} 

    `;
    document.head.appendChild(style);
    // Создание контейнера (внутри wrapper)
    const container = document.createElement('div');
    container.id = 'modifiedcstm-page-search-container-r6ujr5jre5';
    container.style.cssText = `
        background: rgb(13, 61, 63);
        border: 1px solid rgb(139, 248, 194);
        border-radius: 5px;
        padding: 5px;
        display: flex;
        align-items: center;
        gap: 5px;
        font-family: Arial, sans-serif;
        font-size: 14px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        position: relative;
        top: 45px;
        left: -150px;
    `;

    // Поле поиска
    const input = document.createElement('input');
    input.id = 'input-searcj-on-paggeweb-text';
    input.type = 'text';
    input.placeholder = translations[settings.lang].searchPlaceholder;

    input.style.cssText = 'padding: 5px; border: 1px solid #ccc; border-radius: 3px; width: 150px;';

      // Кнопки
    const btnNext = document.createElement('button');
    btnNext.id = 'searcherDown-btnDown-5en8h4w5en8m';
    btnNext.innerHTML = '↓';
    btnNext.style.cssText = 'padding: 5px; background: rgb(20 29 43); color: rgb(139, 248, 194); border: 1px solid rgb(139, 248, 194); border-radius: 3px; cursor: pointer; width: 28px; height: 28px;';

    const btnPrev = document.createElement('button');
    btnPrev.id = 'searcherUp-btnUp-5en8h4w5en8m';
    btnPrev.innerHTML = '↑';
    btnPrev.style.cssText = 'padding: 5px; background: rgb(20 29 43); color: rgb(139, 248, 194); border: 1px solid rgb(139, 248, 194); border-radius: 3px; cursor: pointer; width: 28px; height: 28px;';

    const btnClose = document.createElement('button');
     btnClose.id = 'closeSsearchWrapper-8n5e85egh8n-he5hedhe5d';
    btnClose.innerHTML = '×';
    btnClose.style.cssText = 'padding: 5px 8px; background: rgb(20 29 43); color: rgb(139, 248, 194); border: 1px solid rgb(139, 248, 194); border-radius: 3px; cursor: pointer; font-size: 16px; width: 28px; height: 28px;';

    // Кнопка настроек с SVG-иконкой шестеренки
    const btnSettings = document.createElement('button');
    btnSettings.id = 'settings-btnCstm-page-searcher';
    btnSettings.style.cssText = 'padding: 5px; background: rgb(20 29 43); color: rgb(139, 248, 194); border: 1px solid rgb(139, 248, 194); border-radius: 3px; cursor: pointer; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;';

    const svgSettings = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgSettings.setAttribute('viewBox', '0 0 24 24');
    svgSettings.setAttribute('width', '16');
    svgSettings.setAttribute('height', '16');
    const pathSettings = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pathSettings.setAttribute('d', 'M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.37-.29-.59-.22l-2.49.87c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-.87c-.23-.07-.47 0-.59.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.37.29.59.22l2.49-.87c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49.87c.23.07.47 0 .59-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z');
    pathSettings.setAttribute('fill', 'rgb(139, 248, 194)');
    svgSettings.appendChild(pathSettings);
    btnSettings.appendChild(svgSettings);

    // Обработчик для кнопки настроек
    btnSettings.addEventListener('click', () => {
        // Создание модального окна настроек
        const modal = document.createElement('div');
        modal.id = 'settings-modal-page-searcher';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 999999;
        `;
        const modalContent = document.createElement('div');
        modalContent.id = 'settingsuje-modalhjer5mr6f-for-webSeracherfor';
        modalContent.style.cssText = `
            background: rgb(13, 61, 63);
            border: 1px solid rgb(139, 248, 194);
            border-radius: 5px;
            padding: 20px;
            width: 300px;
            color: antiquewhite;
            font-family: Arial, sans-serif;
        `;
       modalContent.innerHTML = `
    <h3>${translations[settings.lang].settingsTitle}</h3>

    <label>${translations[settings.lang].defaultBg}
        <input type="color" id="default-bg" value="${rgbToHex(settings.highlightDefaultBg)}">
    </label><br><br>

    <label>${translations[settings.lang].defaultOpacity}
        <input type="number" id="default-opacity" value="${settings.highlightDefaultOpacity}" min="0" max="1" step="0.1">
    </label><br><br>

    <label>${translations[settings.lang].currentBg}
        <input type="color" id="current-bg" value="${rgbToHex(settings.highlightCurrentBg)}">
    </label><br><br>

    <label>${translations[settings.lang].currentOpacity}
        <input type="number" id="current-opacity" value="${settings.highlightCurrentOpacity}" min="0" max="1" step="0.1">
    </label><br><br>

    <label>${translations[settings.lang].textColor}
        <input type="color" id="text-color" value="${rgbToHex(settings.highlightTextColor)}">
    </label><br><br>

    <label>${translations[settings.lang].borderColor}
        <input type="color" id="border-color" value="${rgbToHex(settings.highlightBorderColor)}">
    </label><br><br>

    <label>${translations[settings.lang].borderRadius}
        <input type="number" id="border-radius" value="${settings.highlightBorderRadius}" min="0" max="50">
    </label><br><br>

    <label>${translations[settings.lang].borderThickness}
        <input type="number" id="border-thickness" value="${settings.highlightBorderThickness}" min="1" max="10">
    </label><br><br>

    <label>${translations[settings.lang].padding}
        <input type="number" id="padding" value="${settings.highlightPadding}" min="0" max="20">
    </label><br><br>

    <label>${translations[settings.lang].lang}
        <select id="lang-select">
            <option value="ru" ${settings.lang==='ru'?'selected':''}>Русский</option>
            <option value="en" ${settings.lang==='en'?'selected':''}>English</option>
        </select>
    </label><br><br>

    <button id="save-settings">${translations[settings.lang].save}</button>
    <button id="cancel-settings">${translations[settings.lang].cancel}</button>
`;

        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        // Обработчики в модальном окне
        document.getElementById('save-settings').addEventListener('click', () => {
            const defaultBgInput = document.getElementById('default-bg').value;
            const currentBgInput = document.getElementById('current-bg').value;
            const textColorInput = document.getElementById('text-color').value;
            const borderColorInput = document.getElementById('border-color').value;
            const defaultOpacityInput = document.getElementById('default-opacity').value;
            const currentOpacityInput = document.getElementById('current-opacity').value;
            settings.highlightDefaultBg = defaultBgInput ? hexToRgb(defaultBgInput) : settings.highlightDefaultBg;
            settings.highlightCurrentBg = currentBgInput ? hexToRgb(currentBgInput) : settings.highlightCurrentBg;
            settings.highlightTextColor = textColorInput ? hexToRgb(textColorInput) : settings.highlightTextColor;
            settings.highlightBorderColor = borderColorInput ? hexToRgb(borderColorInput) : settings.highlightBorderColor;
            settings.highlightBorderRadius = parseInt(document.getElementById('border-radius').value) || settings.highlightBorderRadius;
            settings.highlightBorderThickness = parseInt(document.getElementById('border-thickness').value) || settings.highlightBorderThickness;
            settings.highlightPadding = parseInt(document.getElementById('padding').value) || settings.highlightPadding;
            settings.lang = document.getElementById('lang-select').value; 
            settings.highlightDefaultOpacity = parseFloat(defaultOpacityInput) || settings.highlightDefaultOpacity;
            settings.highlightCurrentOpacity = parseFloat(currentOpacityInput) || settings.highlightCurrentOpacity;
            applySettings();
            // Пересоздаем подсветку, если нужно (или обновляем существующие)
            if (input.value.trim()) {
                searchAndHighlight(input.value);
            }
            input.placeholder = translations[settings.lang].searchPlaceholder;

            document.body.removeChild(modal);
        });
        document.getElementById('cancel-settings').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        // Закрытие по клику вне модала
        modal.addEventListener('click', (e) => {
            if (e.target === modal) document.body.removeChild(modal);
        });
    });

    container.appendChild(input);
    container.appendChild(btnPrev);
    container.appendChild(btnNext);
    container.appendChild(btnClose);
    container.appendChild(btnSettings); // Добавляем кнопку настроек рядом с контейнером
    wrapper.appendChild(btnToggle);
    wrapper.appendChild(container);
    wrapper.classList.add('collapsed');
    document.body.appendChild(wrapper);

      // Функция очистки подсветки
    function clearHighlights() {
        matches.forEach(mark => {
            const parent = mark.parentNode;
            if (!parent) return;
            parent.replaceChild(document.createTextNode(mark.textContent), mark);
            parent.normalize();
        });
        matches = [];
        currentIndex = -1;
    }

     // Функция поиска и подсветки
    function searchAndHighlight(query) {
        clearHighlights();
        if (!query.trim()) return;
        const regex = new RegExp(`(${query})`, 'gi');

        function walk(node) {
            if (node.nodeType === Node.TEXT_NODE && node.parentNode.tagName !== 'SCRIPT' && node.parentNode.tagName !== 'STYLE') {
                const text = node.textContent;
                const frag = document.createDocumentFragment();
                let lastIndex = 0;
                let match;
                while ((match = regex.exec(text)) !== null) {
                    if (match.index > lastIndex) {
                        frag.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
                    }
                    // Mark для совпадения
                    const mark = document.createElement('mark');
                    mark.id = 'markSearch-he5ngw4n-webpagebody';
                    mark.textContent = match[1];
                    mark.style.fontWeight = 'bold';
                    // Применяем стили подсветки
                    mark.style.color = settings.highlightTextColor;
                    mark.style.border = `${settings.highlightBorderThickness}px solid ${settings.highlightBorderColor}`;
                    mark.style.borderRadius = `${settings.highlightBorderRadius}px`;
                    mark.style.padding = `${settings.highlightPadding}px`;
                    mark.style.backgroundColor = rgbToRgba(settings.highlightDefaultBg, settings.highlightDefaultOpacity);
                    frag.appendChild(mark);
                    matches.push(mark);
                    lastIndex = match.index + match[1].length;
                }
                // Остаток текста
                if (lastIndex < text.length) {
                    frag.appendChild(document.createTextNode(text.slice(lastIndex)));
                }
                if (matches.length) node.parentNode.replaceChild(frag, node);
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                Array.from(node.childNodes).forEach(child => walk(child));
            }
        }

        walk(document.body);
    }


    // Функция навигации
    function navigate(direction) {
        if (!matches.length) return;
        currentIndex += direction;
        if (currentIndex >= matches.length) currentIndex = 0;
        if (currentIndex < 0) currentIndex = matches.length - 1;
        matches.forEach((m, i) => {
           if (m) {
                const isCurrent = i === currentIndex;
                m.style.backgroundColor = rgbToRgba(
                    isCurrent ? settings.highlightCurrentBg : settings.highlightDefaultBg,
                    isCurrent ? settings.highlightCurrentOpacity : settings.highlightDefaultOpacity
                );
            }
        });
        matches[currentIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

     // Обработчики событий
    input.addEventListener('input', e => searchAndHighlight(e.target.value));
    btnNext.addEventListener('click', () => navigate(1));
    btnPrev.addEventListener('click', () => navigate(-1));
    btnClose.addEventListener('click', () => {
        clearHighlights();
        wrapper.classList.add('collapsed');
        container.style.display = 'none';
    });

 // Горячие клавиши
    document.addEventListener('keydown', e => {
        if (e.ctrlKey && e.key === 'f') {
            e.preventDefault();
            wrapper.classList.remove('collapsed');
            input.focus();
        }
        if (!wrapper.classList.contains('collapsed') && container.style.display !== 'none' && input === document.activeElement) {
            if (e.key === 'Enter') navigate(e.shiftKey ? -1 : 1);
            if (e.key === 'Escape') btnClose.click();
        }
    });

   

     // Вспомогательные функции для цветов
    function rgbToHex(rgb) {
        if (rgb.startsWith('rgb(')) {
            const [r, g, b] = rgb.match(/\d+/g);
            return '#' + ((1 << 24) + (parseInt(r) << 16) + (parseInt(g) << 8) + parseInt(b)).toString(16).slice(1);
        }
        return rgb;
    }
    function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})` : hex;
    }
})();





