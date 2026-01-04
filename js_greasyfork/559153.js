// ==UserScript==
// @name         FFZ/Twitch Emote Picker - emote picker restyle Toggle
// @namespace    http://tampermonkey.net/
// @version      17122025
// @description  Adds a button to switch custom styles in the Twitch emoticons panel (FFZ)
// @author       gullampis810
// @match        https://www.twitch.tv/*
// @license      MIT
// @icon         https://greasyfork.s3.us-east-2.amazonaws.com/mpvcskmed1ygsfiram7nlaf9vnew
// @run-at       document-end
// @downloadURL
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/559153/FFZTwitch%20Emote%20Picker%20-%20emote%20picker%20restyle%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/559153/FFZTwitch%20Emote%20Picker%20-%20emote%20picker%20restyle%20Toggle.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let customStyleElement = null;
    let isStylesEnabled = false; // Styles enabled by default / true false По умолчанию стили включены
    let toggleButton = null;


    const customCSS = `
 /*-------------- emote-picker_FFZ_panel.css -------------*/

* {
     scrollbar-color: auto !important;
     scrollbar-width: auto !important;
}

.ffz-viewer-card.tw-border.tw-border-radius-medium.tw-c-background-base.tw-c-text-base.tw-elevation-2.tw-flex.tw-flex-column.viewer-card {
    z-index: 100000 !important;
}

/* ----------------- emote-picker__controls FFZ --------------------- */

.emote-picker__controls-container.tw-relative {
    bottom: 3px !important;
}

.emote-picker {
    width: 1070px !important;
    height: 100px !important;
    left: 24px !important;
    position: relative !important;
}

.ffz--emote-picker {
    position: relative !important;
    height: 785px !important;
    width: 1095px !important;
    max-width: 1500px !important;
    left: -243px !important;
}

.ffz--emote-picker.ffz--emote-picker__tall .emote-picker__nav-content-overflow,
.ffz--emote-picker.ffz--emote-picker__tall .emote-picker__tab-content {
    height: unset !important;
    max-height: 73rem !important;
}

.tw-absolute.ffz-attached.ffz-attached--right.ffz-attached--up {
    width: 857px !important;
    right: 368px !important;
    bottom: 533px !important;
}

.ffz-balloon.ffz-balloon--auto.tw-inline-block.tw-border-radius-large.tw-c-background-base.tw-c-text-inherit.tw-elevation-2.ffz--emote-picker.ffz--emote-picker__tall {
    top: 290px !important;
}

.ffz-attached--up {
    bottom: 510% !important;
}

.tw-border-b.tw-border-l.tw-border-r.tw-border-t.tw-border-radius-medium.tw-c-background-base.tw-elevation-1 {
    width: 60px !important;
    height: 200px !important;
    bottom: 6px !important;
    position: absolute !important;
    right: 5px !important;
}

.tw-absolute {
    position: absolute !important;
    height: 570px !important;
}


/*-------------- emote-picker_FFZ_panel.css -------------*/

    `;

    // Функция создания/обновления <style> элемента со стилями
    function applyStyles(enabled) {
        if (enabled) {
            if (!customStyleElement) {
                customStyleElement = document.createElement('style');
                customStyleElement.type = 'text/css';
                customStyleElement.id = 'custom-emote-picker-styles';
                customStyleElement.innerHTML = customCSS;
                document.head.appendChild(customStyleElement);
            }
        } else {
            if (customStyleElement) {
                customStyleElement.remove();
                customStyleElement = null;
            }
        }
    }

    // Функция переключения
    function toggleStyles() {
        isStylesEnabled = !isStylesEnabled;
        applyStyles(isStylesEnabled);
        toggleButton.textContent = isStylesEnabled ? 'Restyle Emote picker (0FF)' : 'Restyle Emote picker (0N)';
    }

    // Наблюдатель за появлением контейнера (панель эмотов появляется динамически)
    const observer = new MutationObserver(function(mutations) {
        const container = document.querySelector('.emote-picker__controls-container.tw-relative > .tw-border-t.tw-pd-1 > .tw-flex');
        if (container && !toggleButton) {
            // Создаём кнопку
            toggleButton = document.createElement('button');
            toggleButton.id = 'emote-picker_restyle_7tk6rmtf-container-bttn';
            toggleButton.type = 'button';
            toggleButton.className = 'tw-interactive tw-button tw-button--dropmenu ffz-button--hollow tw-mg-l-1';
            toggleButton.style.marginLeft = '10px';
            toggleButton.textContent = 'Restyle Emote picker (0FF)';
            toggleButton.onclick = toggleStyles;

            // Добавляем кнопку в контейнер (после тон пикера)
            const tonePicker = container.querySelector('.ffz--emoji-tone-picker');
            if (tonePicker && tonePicker.parentNode) {
                tonePicker.parentNode.parentNode.insertBefore(toggleButton, tonePicker.parentNode.nextSibling);
            } else {
                container.appendChild(toggleButton);
            }

            // Применяем стили по умолчанию
            applyStyles(false);
        }
    });

    // Запускаем наблюдатель
    observer.observe(document.body, { childList: true, subtree: true });
})();


(function() {
    const css = `

#emote-picker_restyle_7tk6rmtf-container-bttn {
    position: relative !important;
    background: linear-gradient(150deg, #194657, #41314f) !important;
    border: 2px solid !important;
    border-radius: 15px !important;
    padding: 8px  !important;
    color:   #a2d0b0 !important;
}

#emote-picker_restyle_7tk6rmtf-container-bttn:hover {
    position: relative !important;
    background: linear-gradient(150deg, #7fc1bb, #7f6b91) !important;
    border: 2px #a2d0b0  solid !important;
    border-radius: 15px !important;
    padding: 8px  !important;
    color:   #06170b !important;
}

    `;

    const styleElement = document.createElement('style');
    styleElement.type = 'text/css';
    styleElement.innerHTML = css;
    document.head.appendChild(styleElement);


})();



