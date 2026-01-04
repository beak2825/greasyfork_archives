// ==UserScript==
// @name           Video Filter 1.17.25
// @version        1.17.25
// @license        MIT
// @description     video filter control panel (brightness, contrast, saturation, negativity, hue rotation)
// @match           https://www.twitch.tv/*
// @match           https://kick.com/*
// @match           https://www.youtube.com/watch*
// @icon            https://img.utdstc.com/icon/b0f/829/b0f82977d6e2d92ffc677cedf3d8112d2bce91859cd0afe0606507cdda68c07c:200
// @namespace       https://greasyfork.org/users/594536
// @downloadURL https://update.greasyfork.org/scripts/553903/Video%20Filter%2011725.user.js
// @updateURL https://update.greasyfork.org/scripts/553903/Video%20Filter%2011725.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Проверка: не запускать в iframe, чтобы избежать рекурсии
    if (window.self !== window.top) {
        return;
    }

    // Массив для хранения позиции панели
    let panelPosition = {
        x: window.innerWidth * 0.13,
        y: window.innerHeight * 0.6
    };

    // Текущий язык (по умолчанию русский)
    let currentLang = 'ru';

    // Объект переводов
    const translations = {
        ru: {
            brightness: 'Яркость',
            contrast: 'Контраст',
            saturate: 'Насыщенность',
            invert: 'Негатив',
            'hue-rotate': 'Поворот оттенков',
            reset: 'Сбросить',
            sepia: 'Сепия',
    red: 'Красный',
    blue: 'Синий',
    green: 'Зеленый',
    white: 'Белый',
    black: 'Черный'
        },
        en: {
            brightness: 'Brightness',
            contrast: 'Contrast',
            saturate: 'Saturation',
            invert: 'Negative',
            'hue-rotate': 'Hue Rotation',
            reset: 'Reset',
            sepia: 'Sepia',
    red: 'Red',
    blue: 'Blue',
    green: 'Green',
    white: 'White',
    black: 'Black'
        }
    };

    // Функция обновления языка
    function updateLanguage() {
       sliders.forEach(slider => {
       slider.label.textContent = `${translations[currentLang][slider.labelKey]}: `;
});
        resetButton.textContent = translations[currentLang].reset;
    }

    // Функция сохранения языка (с дебаунсом)
    let saveLangTimeout;
    function saveLanguage() {
        clearTimeout(saveLangTimeout);
        saveLangTimeout = setTimeout(() => {
            try {
                localStorage.setItem('videoFilterLang', currentLang);
                console.log('Язык сохранен');
            } catch (e) {
                console.error('Ошибка при сохранении языка:', e);
            }
        }, 800);
    }

    // Функция загрузки языка
    function loadLanguage() {
        try {
            const savedLang = localStorage.getItem('videoFilterLang');
            if (savedLang) {
                currentLang = savedLang;
                console.log('Язык загружен');
            }
        } catch (e) {
            console.error('Ошибка при загрузке языка:', e);
        }
    }

    // Функция сохранения положения панели
    function savePanelPosition() {
        try {
            localStorage.setItem('videoFilterPanelPosition', JSON.stringify(panelPosition));
        } catch (e) {
            console.error('Ошибка при сохранении позиции панели:', e);
        }
    }

    // Функция загрузки сохраненного положения
    function loadPanelPosition() {
        try {
            const savedPosition = localStorage.getItem('videoFilterPanelPosition');
            if (savedPosition) {
                const pos = JSON.parse(savedPosition);
                panelPosition = pos;
                currentX = pos.x;
                currentY = pos.y;
                controlPanel.style.left = pos.x + 'px';
                controlPanel.style.top = pos.y + 'px';
            }
        } catch (e) {
            console.error('Ошибка при загрузке позиции панели:', e);
        }
    }

    // Функция сохранения настроек фильтров (с дебаунсом)
    let saveTimeout;
    function saveFilterSettings() {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
            try {
                const settings = {};
                sliders.forEach(slider => {
                    settings[slider.filterType] = slider.input.value;
                });
                localStorage.setItem('videoFilterSettings', JSON.stringify(settings));
                console.log('Настройки фильтров сохранены');
            } catch (e) {
                console.error('Ошибка при сохранении настроек фильтров:', e);
            }
        }, 800);
    }

    // Функция загрузки настроек фильтров
    function loadFilterSettings() {
        try {
            const savedSettings = localStorage.getItem('videoFilterSettings');
            if (savedSettings) {
                const settings = JSON.parse(savedSettings);
                sliders.forEach(slider => {
                    if (settings[slider.filterType] !== undefined) {
                        slider.input.value = settings[slider.filterType];
                        slider.input.nextSibling.textContent = slider.input.value;
                    }
                });
                updateFilters();
                console.log('Настройки фильтров загружены');
            }
        } catch (e) {
            console.error('Ошибка при загрузке настроек фильтров:', e);
        }
    }

    // Создаем контейнер для панели управления
    const controlPanel = document.createElement('div');
    controlPanel.id = 'vidfiltr-control-Panel-xe5yuemxhj';
    controlPanel.style.display = 'none';
    controlPanel.style.position = 'fixed';
    controlPanel.style.top = '120px';
    controlPanel.style.zIndex = '9999';
    controlPanel.style.fontFamily = 'Arial, sans-serif';
    controlPanel.style.fontSize = '16px';
    controlPanel.style.boxShadow = 'rgb(75 191 191 / 24%) 0px 4px 10px 2px';
    controlPanel.style.userSelect = 'none';
    controlPanel.style.cursor = 'move';

    // Создаем заголовок панели (для перетаскивания)
    const header = document.createElement('div');
    header.id = 'panel-movedraggcursor-header-xe5yuemxhj';
    header.style.background = '#333';
    header.style.padding = '5px';
    header.style.borderRadius = '3px 3px 0 0';
    header.style.marginBottom = '5px';
    header.style.cursor = 'move';
    controlPanel.appendChild(header);

    // Контейнер для содержимого фильтров
    const contentContainer = document.createElement('div');
    contentContainer.id = 'filter-sliders-xe5-ye5e-yuemxhj';
    contentContainer.style.display = 'block';
    controlPanel.appendChild(contentContainer);

    // Создаем кнопку сворачивания
    const toggleButton = document.createElement('button');
    toggleButton.id = 'button-filtr-xe5-ye5e-yuemxhj';
    toggleButton.style.border = '1px solid #368c7f ';
    toggleButton.style.position = 'fixed';
    toggleButton.style.top = '10px';
    toggleButton.style.right = '34%';
    toggleButton.style.zIndex = '100500';
    toggleButton.style.background = ' #1e1e1e !important';
    toggleButton.style.color = ' #368c7f ';
    toggleButton.style.cursor = 'pointer';
    toggleButton.style.display = 'flex';
    toggleButton.style.alignItems = 'center';
    toggleButton.style.justifyContent = 'center';
    toggleButton.style.boxShadow = '0 0 5px rgba(0,0,0,0.3)!important';
    toggleButton.style.flexDirection = 'row';
    toggleButton.style.gap = '5px';
    toggleButton.style.padding = '5px';
    toggleButton.style.borderRadius = '20px';
    toggleButton.style.width = 'auto';
    toggleButton.style.height = '40px';

    let isPanelVisible = false;

    const videoIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    videoIcon.setAttribute('width', '20');
    videoIcon.setAttribute('height', '20');
    videoIcon.setAttribute('viewBox', '0 0 15 15');
    videoIcon.innerHTML = '<title>Video SVG Icon</title><path fill="currentColor" fill-rule="evenodd" d="M4.764 3.122A32.656 32.656 0 0 1 7.5 3c.94 0 1.868.049 2.736.122c1.044.088 1.72.148 2.236.27c.47.111.733.258.959.489c.024.025.06.063.082.09c.2.23.33.518.405 1.062c.08.583.082 1.343.082 2.492c0 1.135-.002 1.885-.082 2.46c-.074.536-.204.821-.405 1.054a2.276 2.276 0 0 1-.083.09c-.23.234-.49.379-.948.487c-.507.12-1.168.178-2.194.264c-.869.072-1.812.12-2.788.12c-.976 0-1.92-.048-2.788-.12c-1.026-.086-1.687-.144-2.194-.264c-.459-.108-.719-.253-.948-.487a2.299 2.299 0 0 1-.083-.09c-.2-.233-.33-.518-.405-1.054C1.002 9.41 1 8.66 1 7.525c0-1.149.002-1.91.082-2.492c.075-.544.205-.832.405-1.062c.023-.027.058-.065.082-.09c.226-.231.489-.378.959-.489c.517-.122 1.192-.182 2.236-.27M0 7.525c0-2.242 0-3.363.73-4.208c.036-.042.085-.095.124-.135c.78-.799 1.796-.885 3.826-1.056C5.57 2.05 6.527 2 7.5 2c.973 0 1.93.05 2.82.126c2.03.171 3.046.257 3.826 1.056c.039.04.087.093.124.135c.73.845.73 1.966.73 4.208c0 2.215 0 3.323-.731 4.168a3.243 3.243 0 0 1-.125.135c-.781.799-1.778.882-3.773 1.048C9.48 12.951 8.508 13 7.5 13s-1.98-.05-2.87-.124c-1.996-.166-2.993-.25-3.774-1.048a3.316 3.316 0 0 1-.125-.135C0 10.848 0 9.74 0 7.525m5.25-2.142a.25.25 0 0 1 .35-.23l4.828 2.118c.2.088.2.37 0 .458L5.6 9.846a.25.25 0 0 1-.35-.229z" clip-rule="evenodd"/>';
    toggleButton.appendChild(videoIcon);

    const filterIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    filterIcon.setAttribute('width', '20');
    filterIcon.setAttribute('height', '20');
    filterIcon.setAttribute('viewBox', '0 0 2048 2048');
    filterIcon.innerHTML = '<title>Filter-settings SVG Icon</title><path fill="currentColor" d="m1989 1369l49 119l-124 51q6 30 6 61t-6 61l124 51l-49 119l-124-52q-35 51-86 86l52 124l-119 49l-51-124q-30 6-61 6t-61-6l-51 124l-119-49l52-124q-51-35-86-86l-124 52l-49-119l124-51q-6-30-6-61t6-61l-124-51l49-119l124 52q35-51 86-86l-52-124l119-49l51 124q30-6 61-6t61 6l51-124l119 49l-52 124q51 35 86 86zm-197 231q0-40-15-75t-41-61t-61-41t-75-15t-75 15t-61 41t-41 61t-15 75t15 75t41 61t61 41t75 15t75-15t61-41t41-61t15-75M0 128h2048v219l-768 768q-10 10-26 23t-35 28t-37 27t-30 23v-155l768-768v-37H128v37l768 768v731h163q12 34 27 66t35 62H768v-805L0 347z"/>';
    toggleButton.appendChild(filterIcon);

    toggleButton.addEventListener('click', () => {
        isPanelVisible = !isPanelVisible;
        controlPanel.style.display = isPanelVisible ? 'block' : 'none';
    });

    // Создаем кнопку смены языка
    const langButton = document.createElement('button');
    langButton.id = 'btnn-lang-jr6ur6-nftd';
    langButton.style.marginBottom = '10px';
    langButton.style.padding = '5px 10px';
    langButton.style.background = ' #081a1b';
    langButton.style.color = ' #368c7f';
    langButton.style.border = '1px solid #368c7f';
    langButton.style.borderRadius = '10px';
    langButton.style.cursor = 'pointer';
    langButton.textContent = currentLang === 'ru' ? 'EN' : 'RU'; // Изначально на основе дефолтного
    contentContainer.appendChild(langButton);

    // Загружаем язык (обновит кнопку)
    loadLanguage();
    langButton.textContent = currentLang === 'ru' ? 'EN' : 'RU';

    // Обработчик для кнопки языка
    langButton.addEventListener('click', () => {
        currentLang = currentLang === 'ru' ? 'en' : 'ru';
        langButton.textContent = currentLang === 'ru' ? 'EN' : 'RU';
        updateLanguage();
        saveLanguage();
    });

    // Функция для создания ползунка (обновлено: использует текущий язык)
    function createSlider(labelKey, min, max, step, defaultValue, filterType, sliderId) {
        const container = document.createElement('div');
        container.id = 'createcontainer-Slider-j6rr6-jtru5r-o908ng';
        container.style.margin = '30px 0';

        const labelElement = document.createElement('label');
        labelElement.id = 'label-fltr-tht5-videofltrxX78x7eh6rej6r';
        labelElement.textContent = `${translations[currentLang][labelKey]}: `;
        labelElement.style.display = 'block';

        const input = document.createElement('input');
         input.id = 'range-5en8mh5e-filter-video';
        input.type = 'range';
        input.min = min;
        input.max = max;
        input.value = defaultValue;
        if (filterType === 'hue-rotate') {
        input.step = 0.001;   // Для поворота оттенков — крупный шаг, чтобы не было резких скачков
        } else {
        input.step = 0.001;  // Для всех остальных — средний шаг, снижает чувствительность
        }
        input.id = sliderId || 'vidfiltr-x6xnymux-g7xh8jhx-slider';

        const valueDisplay = document.createElement('span');
        valueDisplay.id = 'value-znachenie-levelfltr-Display';
        valueDisplay.textContent = defaultValue;
        valueDisplay.style.marginLeft = '10px';

        let updateTimeout;
input.addEventListener('input', () => {
    valueDisplay.textContent = input.value;
    clearTimeout(updateTimeout);
    updateTimeout = setTimeout(() => {
        updateFilters();
    }, 150);  // Дебаунс 150 мс — фильтры применяются не на каждое микродвижение
    saveFilterSettings();
});

        container.appendChild(labelElement);
        container.appendChild(input);
        container.appendChild(valueDisplay);
        contentContainer.appendChild(container);

        return { input, filterType, label: labelElement, labelKey};
    }

    function injectSliderStyles(sliderId) {
        const styleElement = document.createElement('style');
        styleElement.textContent = `
 input#${sliderId} {
      appearance: none !important;
      background: #0b2322 !important;
      border-radius: 8px;
      border: 1px solid #274d4a;
 }
#filter-sliders-xe5-ye5e-yuemxhj {
    z-index: 100000  !important;
    position: relative;
    top: -315px;
    height: 300px;
    width: 180px;
    left: -30%;
}
#panel-movedraggcursor-header-xe5yuemxhj {
    z-index: 1;
    position: relative;
    background: #1a3635 !important;
    top: -5px;
    height: 720px;
    width: 605px;
    left: -8px;
    border-radius: 8px !important;
}

#vidfiltr-control-Panel-xe5yuemxhj {
    width: 612px;
    height: 730px;
    display: block;
    position: fixed;
    top: 128.6px;
    background: rgb(30, 30, 30);
    color: rgb(54, 140, 127);
    padding: 10px;
    border-radius: 5px;
    border: 1px solid rgb(54, 140, 127);
    z-index: 9999;
    font-family: Arial, sans-serif;
    font-size: 16px;
    box-shadow: rgba(75, 191, 191, 0.24) 0px 4px 10px 2px;
    user-select: none;
    cursor: move;
    left: 1036.6px;
}

 #button-filtr-xe5-ye5e-yuemxhj:hover {
    scale: 1.5 !important;
}
 #resetsetngs-btnn-jr6780ur6-nftd {
    position: relative;
    top: -1210px;
    width: 95px;
    border: 1px solid rgb(54, 140, 127);
    border-radius: 10px;
    left: 345%;
}

input#vidfiltr-x6xnymux-g7xh8jhx-slider {
    appearance: none !important;
    background: #0b2322 !important;
    border-radius: 8px;
    border: 1px solid #274d4a;
    z-index: 500000  !important;
    height: 8px;
    width: 200px;
    left: 225px !important;
    position: relative;
    top: -2px;
}

input#vidfiltr-x6xnymux-g7xh8jhx-slider:hover {
    appearance: none !important;
    background: #2e1d34 !important;
    border-radius: 12px;
    border: 1px solid #5cc2db;
    z-index: 555000  !important;
}

#createcontainer-Slider-j6rr6-jtru5r-o908ng {
    z-index: 555555 !important;
    position: relative;
    top: -485px;
    left: 180px;
    height: 35px;
    width: 190px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: baseline;
    gap: 5px;
}

label#label-fltr-tht5-videofltrxX78x7eh6rej6r {
    width: 125px !important;
    left: 8px !important;
    top: 30px !important;
    border-bottom: inset;
    border-color: #2d4c51;
    border-width: 2px;
    border-radius: 5px;
    background: #182727;
    scale: 1.2;
    padding: 1px  5px;
    position: relative;
}

#resetsetngs-btnn-jr6780ur6-nftd:hover {
    background: rgb(46 66 73) !important;
    border-radius: 15px   !important;
    border: 1px solid #db975c;
    z-index: 555000  !important;
}

#btnn-lang-jr6ur6-nftd {
    position: relative;
    width: 55px;
    left: 345%;
    top: -120%;
}

#btnn-lang-jr6ur6-nftd:hover {
    background: rgb(13 42 73) !important;
    border-radius: 15px   !important;
    border: 1px solid #db975c;
    z-index: 555000  !important;
}


    input#vidfiltr-x6xnymux-g7xh8jhx-slider::-webkit-slider-track {
        background: #0b2322 !important;
        border-radius: 8px;
        height: 5px;
    }
    input#vidfiltr-x6xnymux-g7xh8jhx-slider::-webkit-slider-thumb {
        appearance: none !important;
        background: #368c7f !important;
        border: none;
        border-radius: 50%;
        width: 22px;
        height: 22px;
        cursor: pointer;
        margin-top:   1px;
    }
    input#vidfiltr-x6xnymux-g7xh8jhx-slider::-webkit-slider-thumb:hover {
        background: #172a31 !important;
        transform: scale(1.1);
         box-shadow: 0 2px 4px rgb(202 94 254 / 71%);
    }
span#value-znachenie-levelfltr-Display {
    position: relative;
    width: 45px;
    left: 75%;
    top: -15px !important;
}

    `;
        document.head.appendChild(styleElement);
    }

    // Вызов
    injectSliderStyles('vidfiltr-x6xnymux-g7xh8jhx-slider');

    // Создаем ползунки для каждого фильтра (используем ключи для переводов)
    const sliders = [
        createSlider('brightness', 0, 2, 0.01, 1, 'brightness'),
        createSlider('contrast', 0, 2, 0.01, 1, 'contrast'),
        createSlider('saturate', 0, 2, 0.01, 1, 'saturate'),
        createSlider('invert', 0, 1, 0.01, 0, 'invert'),
        createSlider('hue-rotate', 0, 360, 1, 0, 'hue-rotate'),
        createSlider('sepia', 0, 1, 0.01, 0, 'sepia'),
createSlider('red', 0, 1, 0.01, 0, 'red-tint'),
createSlider('blue', 0, 1, 0.01, 0, 'blue-tint'),
createSlider('green', 0, 1, 0.01, 0, 'green-tint'),
createSlider('white', 0, 1, 0.01, 0, 'white-tint'),
createSlider('black', 0, 1, 0.01, 0, 'black-tint')
    ];

    // Кнопка сброса (использует текущий язык)
    const resetButton = document.createElement('button');
      resetButton.id = 'resetsetngs-btnn-jr6780ur6-nftd';
    resetButton.textContent = translations[currentLang].reset;
    resetButton.style.marginTop = '10px';
    resetButton.style.padding = '5px 10px';
    resetButton.style.background = ' #0a2021';
    resetButton.style.color = 'rgb(209, 236, 232) ';
    resetButton.style.cursor = 'pointer';
    resetButton.addEventListener('click', () => {
                sliders.forEach(slider => {
            let defaultValue = 0;
            if (['hue-rotate',
                'invert'
            ].includes(slider.filterType)) {
                defaultValue = 0;
            } else if ([
                'red-tint',
                 'blue-tint',
                 'green-tint',
                 'white-tint',
                 'black-tint',
                 'sepia'
                ].includes(slider.filterType)) {
                defaultValue = 0;
            } else {
                defaultValue = 1;
            }
            slider.input.value = defaultValue;
            slider.input.nextSibling.textContent = slider.input.value;
        });
        updateFilters();
        saveFilterSettings();
    });
    contentContainer.appendChild(resetButton);

    // Функция обновления фильтров
        function updateFilters() {
        const videos = document.getElementsByTagName('video');
        if (videos.length === 0) return;

        const filterString = sliders.map(slider => {
            const value = parseFloat(slider.input.value);
            let filterPart;
            if (slider.filterType === 'red-tint') {
                filterPart = value > 0 ? `sepia(${value}) hue-rotate(0deg) saturate(${1 + value * 2})` : '';
            } else if (slider.filterType === 'blue-tint') {
                filterPart = value > 0 ? `sepia(${value}) hue-rotate(220deg) saturate(${1 + value * 2})` : '';
            } else if (slider.filterType === 'green-tint') {
                filterPart = value > 0 ? `sepia(${value}) hue-rotate(120deg) saturate(${1 + value * 2})` : '';
            } else if (slider.filterType === 'white-tint') {
                filterPart = value > 0 ? `grayscale(${value}) brightness(${1 + value * 3}) contrast(${1 + value * 2})` : '';
            } else if (slider.filterType === 'black-tint') {
                filterPart = value > 0 ? `grayscale(${value}) brightness(${1 - value * 2}) contrast(${1 + value})` : '';
            } else if (slider.filterType === 'sepia') {
                filterPart = value > 0 ? `sepia(${value})` : '';
            } else {
                const unit = slider.filterType === 'hue-rotate' ? 'deg' : '';
                filterPart = value > 0 || slider.filterType === 'brightness' || slider.filterType === 'contrast' || slider.filterType === 'saturate' ? `${slider.filterType}(${value}${unit})` : '';
            }
            return filterPart;
        }).filter(part => part !== '').join(' ');

        for (let video of videos) {
            video.style.filter = filterString;
        }
    }

    // Логика перетаскивания
    let isDragging = false;
    let currentX = panelPosition.x;
    let currentY = panelPosition.y;
    let initialX;
    let initialY;

    header.addEventListener('mousedown', startDragging);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDragging);

    function startDragging(e) {
        initialX = e.clientX - currentX;
        initialY = e.clientY - currentY;
        isDragging = true;
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            panelPosition.x = currentX;
            panelPosition.y = currentY;
            controlPanel.style.left = currentX + 'px';
            controlPanel.style.top = currentY + 'px';
            savePanelPosition();
        }
    }

    function stopDragging() {
        isDragging = false;
    }

    // Удаляем избыточную начальную позицию и загружаем сохраненную
    loadPanelPosition();
    loadFilterSettings();
    document.body.appendChild(controlPanel);
    document.body.appendChild(toggleButton);

    // Инициализация фильтров при загрузке
    updateFilters();

    // Наблюдатель за изменениями в DOM для обработки новых видео
    const observer = new MutationObserver(() => {
        updateFilters();
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();











