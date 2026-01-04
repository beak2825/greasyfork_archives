// ==UserScript==
// @name         Multitool Supervisor-3
// @namespace    http://tampermonkey.net/
// @version      3
// @description  Multitool for Supervisor
// @author       You
// @match        *://*/Admin/CompareBag/EditBag/*
// @match        *://*//Admin/CompareBag/EditBag/*
// @match        *://*/Admin/MyCurrentTask/Active
// @match        *://*/Admin/PrefilterPictures*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=triplenext.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/556569/Multitool%20Supervisor-3.user.js
// @updateURL https://update.greasyfork.org/scripts/556569/Multitool%20Supervisor-3.meta.js
// ==/UserScript==

(function () {
    function createModal() {
        const existingModal = document.querySelector('.custom-modal-overlay');
        if (existingModal) {
            existingModal.remove();
            return;
        }

        const overlay = document.createElement('div');
        overlay.classList.add('custom-modal-overlay');
        Object.assign(overlay.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: '9999'
        });

        const modal = document.createElement('div');
        modal.classList.add('custom-modal');
        Object.assign(modal.style, {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#fff',
            borderRadius: '12px',
            boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.2)',
            padding: '25px',
            width: 'auto',
            zIndex: '10000',
            fontFamily: 'Arial, sans-serif',
            color: '#333'
        });

        modal.addEventListener('click', (event) => {
            event.stopPropagation();
        });

        overlay.addEventListener('click', (event) => {
            if (event.target === overlay) {
                overlay.remove();
            }
        });

        const checkboxContainer = document.createElement('div');
        Object.assign(checkboxContainer.style, {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '10px',
            marginBottom: '15px'
        });

        function createCheckbox(labelText, id, tooltipText, defaultValue = false) {
            const container = document.createElement('div');
            Object.assign(container.style, {
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#f8f9fa',
                padding: '8px 12px',
                borderRadius: '6px',
                position: 'relative'
            });

            container.addEventListener('mouseover', () => container.style.backgroundColor = '#e9ecef');
            container.addEventListener('mouseleave', () => container.style.backgroundColor = '#f8f9fa');

            const tooltip = document.createElement('span');
            tooltip.textContent = tooltipText;
            Object.assign(tooltip.style, {
                visibility: 'hidden',
    width: '200px', // Условная ширина модального окна
        height: '100px', // Условная высота модального окна
                backgroundColor: '#333',
                color: '#fff',
                textAlign: 'center',
                padding: '5px',
                borderRadius: '5px',
                position: 'absolute',
                left: '100%',
                top: '50%',
              transform: 'translateY(-50%) translateX(10px)', // Сдвигаем немного вправо
                whiteSpace: 'nowrap',
                fontSize: '12px',
                zIndex: '10'
            });


            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = id;

            // Если значение не сохранено в localStorage, используем значение по умолчанию
            const savedValue = localStorage.getItem(id);
            if (savedValue === null) {
                checkbox.checked = defaultValue;
                localStorage.setItem(id, defaultValue.toString());
            } else {
                checkbox.checked = savedValue === 'true';
            }

            checkbox.addEventListener('change', () => localStorage.setItem(id, checkbox.checked));

            Object.assign(checkbox.style, {
                width: '16px',
                height: '16px',
                margin: '0'
            });

            const label = document.createElement('span');
            label.textContent = labelText;
            Object.assign(label.style, {
                fontSize: '14px',
                lineHeight: '1',
                paddingLeft: '5px'
            });

            container.appendChild(checkbox);
            container.appendChild(label);
       //     container.appendChild(infoIcon);
           modal.appendChild(tooltip);
            return container;
        }

        checkboxContainer.appendChild(createCheckbox('Кроп', 'addBorder', 'Обрезка изображения по границам.'));
        checkboxContainer.appendChild(createCheckbox('Закраска', 'addClonedImage', 'Заполнение области цветом.'));
        checkboxContainer.appendChild(createCheckbox('Разметка по комнате', 'cloneSvgElement', 'Добавление разметки.'));
        checkboxContainer.appendChild(createCheckbox('AuditLog', 'auditLog', 'Логирование действий.'));
        checkboxContainer.appendChild(createCheckbox('AuditLog в окне', 'auditModalIframe', 'Открывать аудит в модальном окне.'));
        checkboxContainer.appendChild(createCheckbox('Тег', 'tag', 'Добавление тегов.'));
        checkboxContainer.appendChild(createCheckbox('Категория', 'category', 'Фильтрация по категориям.'));
        checkboxContainer.appendChild(createCheckbox('PrefilterComments', 'PrefilterComments', 'Фильтрация комментариев.'));
        checkboxContainer.appendChild(createCheckbox('PrefilterPictures', 'PrefilterPictures', 'Фильтрация изображений.'));
        checkboxContainer.appendChild(createCheckbox('FixSize', 'fixsize', 'FixSize'));
        checkboxContainer.appendChild(createCheckbox('Показать имена', 'showUserNames', 'Отображение имен пользователей в окнах тегов и категорий.'));
        checkboxContainer.appendChild(createCheckbox('Автооткрытие виджета', 'autoClickWidget', 'Автоматический клик по кнопке виджета при загрузке страницы.'));
        checkboxContainer.appendChild(createCheckbox('Только в активном таске', 'autoClickOnlyInActiveTask', 'Автоклик виджета работает только когда продукт в активном таске.', true));
        checkboxContainer.appendChild(createCheckbox('Позиция виджета', 'dialogPosition', 'Автоматическое применение сохраненной позиции виджета.'));
        checkboxContainer.appendChild(createCheckbox('Удалить Overlay ', 'Overlay', 'Удалить Overlay'));

        modal.appendChild(checkboxContainer);

        const filterContainer = document.createElement('div');
        Object.assign(filterContainer.style, { marginBottom: '15px' });

        const filterLabel = document.createElement('label');
        filterLabel.textContent = 'Префильтр';
        Object.assign(filterLabel.style, {
            fontSize: '14px',
            display: 'block',
            marginBottom: '5px',
        });
        filterContainer.appendChild(filterLabel);

        const filterInput = document.createElement('input');
        Object.assign(filterInput.style, {
            fontSize: '14px',
            border: '1px solid #ccc',
            borderRadius: '6px',
            outline: 'none',
            transition: 'border-color 0.3s'
        });
        filterInput.type = 'number';
        filterInput.id = 'prefilter';
        filterInput.min = '1';
        filterInput.max = '40';
        filterInput.value = localStorage.getItem('prefilter') || '';

        filterInput.addEventListener('focus', () => filterInput.style.borderColor = '#007BFF');
        filterInput.addEventListener('blur', () => filterInput.style.borderColor = '#ccc');
        filterInput.addEventListener('input', () => localStorage.setItem('prefilter', filterInput.value));

        filterContainer.appendChild(filterInput);
        modal.appendChild(filterContainer);

        
        // Настройки масштаба диалога
        const scaleContainer = document.createElement('div');
        Object.assign(scaleContainer.style, {
            marginBottom: '15px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
        });

        const scaleLabel = document.createElement('label');
        scaleLabel.textContent = 'Масштаб диалога';
        Object.assign(scaleLabel.style, {
            fontSize: '14px',
            fontWeight: 'bold'
        });
        scaleContainer.appendChild(scaleLabel);

        const scaleValueFromStorage = localStorage.getItem('dialogScale');
        if (scaleValueFromStorage === null) {
            localStorage.setItem('dialogScale', '100');
        }
        const currentScaleValue = localStorage.getItem('dialogScale') || '100';

        const scaleValueRow = document.createElement('div');
        Object.assign(scaleValueRow.style, {
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
        });

        const scaleInput = document.createElement('input');
        Object.assign(scaleInput.style, {
            flex: '1'
        });
        scaleInput.type = 'range';
        scaleInput.min = '50';
        scaleInput.max = '200';
        scaleInput.step = '5';
        scaleInput.value = currentScaleValue;

        const scaleValueLabel = document.createElement('span');
        scaleValueLabel.textContent = `${currentScaleValue}%`;
        Object.assign(scaleValueLabel.style, {
            fontSize: '13px',
            fontWeight: 'bold',
            minWidth: '55px',
            textAlign: 'right'
        });

        scaleInput.addEventListener('input', () => {
            const value = scaleInput.value;
            scaleValueLabel.textContent = `${value}%`;
            localStorage.setItem('dialogScale', value);

            if (typeof window.applyDialogScaleFromStorage === 'function') {
                window.applyDialogScaleFromStorage();
            }
        });

        scaleValueRow.appendChild(scaleInput);
        scaleValueRow.appendChild(scaleValueLabel);
        scaleContainer.appendChild(scaleValueRow);
        modal.appendChild(scaleContainer);

    function createColorPicker(labelText, id) {
        const container = document.createElement('div');
        Object.assign(container.style, {
            display: 'inline-block',
            marginRight: '15px',
            textAlign: 'center' // Выравнивание текста и элемента
        });

        const label = document.createElement('label');
        label.textContent = labelText;
        Object.assign(label.style, {
            fontSize: '14px',
            display: 'block',
            marginBottom: '5px',
            fontWeight: 'bold',
            color: '#333'
        });
        container.appendChild(label);

        const colorInput = document.createElement('input');
        colorInput.type = 'color';
        colorInput.id = id;
        colorInput.value = localStorage.getItem(id) || '#ffffff';
        colorInput.addEventListener('input', () => {
            localStorage.setItem(id, colorInput.value);
            applyBackgroundColors(); // Если нужно сразу обновлять фон
        });

        Object.assign(colorInput.style, {
            width: '40px',
            height: '40px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            padding: '5px',
            background: 'transparent',
            outline: 'none',
            transition: 'transform 0.2s ease',
        });

        colorInput.addEventListener('mouseenter', () => {
            colorInput.style.transform = 'scale(1.1)';
        });

        colorInput.addEventListener('mouseleave', () => {
            colorInput.style.transform = 'scale(1)';
        });

        container.appendChild(colorInput);
        return container;
    }

    // Обернем их в общий контейнер, чтобы они были в ряд
    const colorPickerContainer = document.createElement('div');
    Object.assign(colorPickerContainer.style, {
        display: 'flex',
        gap: '15px', // Отступ между элементами
        alignItems: 'center' // Выравнивание элементов по центру
    });

    colorPickerContainer.appendChild(createColorPicker('Цвет 1', 'colorPalette1'));
    colorPickerContainer.appendChild(createColorPicker('Цвет 2', 'colorPalette2'));

    modal.appendChild(colorPickerContainer);

        overlay.appendChild(modal);
        document.body.appendChild(overlay);


    }

    // Создаем элемент кнопки
    const button = document.createElement('button');
    button.innerText = 'Моя кнопка';

    // Создаем контейнер для SVG
    const svgButton = document.createElement('div');
    svgButton.style.position = 'fixed';
    svgButton.style.top = '5px';
    svgButton.style.left = '10px';
    svgButton.style.cursor = 'pointer';
    svgButton.style.zIndex = '10000';
    svgButton.innerHTML = `
    <svg height="35px" width="35px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 495 495" xml:space="preserve" fill="#000000" transform="matrix(-1, 0, 0, -1, 0, 0)rotate(90)"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path style="fill:#005ECE;" d="M495,297.5v-110h-68.21c-3.63-11.87-8.42-23.31-14.35-34.23l45.42-45.42l-77.78-77.79l-46.05,46.06 c-11.66-6.08-23.87-10.89-36.53-14.38V0h-50v152c52.66,0,95.5,42.84,95.5,95.5S300.16,343,247.5,343v152h60v-74.82 c10.09-3.4,19.85-7.66,29.23-12.74l50.42,50.42l77.79-77.78l-51.06-51.05c5.27-10.11,9.58-20.64,12.91-31.53H495z"></path> <path style="fill:#2488FF;" d="M152,247.5c0-52.66,42.84-95.5,95.5-95.5V0h-60v64.82c-12.42,4.18-24.32,9.65-35.61,16.36 l-44.04-44.04l-77.79,77.78l47.74,47.74c-5.28,11.19-9.41,22.83-12.36,34.84H0v110h71.58c3.93,10.63,8.81,20.85,14.6,30.61 l-49.04,49.04l77.78,77.79l52.74-52.75c9.62,4.54,19.59,8.24,29.84,11.06V495h50V343C194.84,343,152,300.16,152,247.5z"></path> </g> </g></svg>`;

    // Добавляем обработчик клика
    svgButton.addEventListener('click', function () {
        createModal();
    });

    // Добавляем SVG-кнопку на страницу
    document.body.appendChild(svgButton);


    // Ключ для локального хранилища
        const STORAGE_KEY = 'cropScriptEnabled';

        // Ищем кнопку по селектору
        const oldButton = document.querySelector('#svgRed_Content > div.red_footer.clearfix > div.switch-editor-buttons-wrapper > a:nth-child(3)');

        if (oldButton) {
            // Создаём новую кнопку, чтобы убрать старый функционал
            const newButton = oldButton.cloneNode(true);
            oldButton.replaceWith(newButton);

            // Загружаем состояние кнопки из локального хранилища
            const savedState = localStorage.getItem(STORAGE_KEY) === 'true';

            // Иконка для состояния "включено"
            const enabledIcon = document.createElement('img');
            enabledIcon.src = 'https://img.icons8.com/officel/80/crop.png';
            enabledIcon.alt = 'Crop Enabled';
            enabledIcon.style.width = '27px';
            enabledIcon.style.height = '27px';
            enabledIcon.title = 'Остановить Crop';
            enabledIcon.style.margin = 'auto';

            // Иконка для состояния "выключено"
            const disabledIcon = document.createElement('img');
            disabledIcon.src = 'https://img.icons8.com/office/40/unchecked-checkbox.png';
            disabledIcon.alt = 'Crop Disabled';
            disabledIcon.style.width = '27px';
            disabledIcon.style.height = '27px';
            disabledIcon.title = 'Посмотреть Crop';
            disabledIcon.style.margin = 'auto';

            // Удаляем текущие элементы внутри кнопки
            newButton.innerHTML = '';
            newButton.appendChild(savedState ? enabledIcon : disabledIcon);



    // Обработчик клика по кнопке
    newButton.addEventListener('click', (event) => {
        // Проверяем, зажат ли Alt
        if (event.altKey) {
            // Отменяем стандартное поведение кнопки
            event.preventDefault();

            // Создаём или закрываем модальное окно
            createModal();
        }
    });


            // Основной код с управлением
            let intervalId = null;

           const addBorder = () => {
        const addBorderFromStorage = localStorage.getItem('addBorder');

        const svg = document.querySelector('#canvas > svg');
        const image = document.querySelector('#canvas > svg > image');

        if (svg && image) {
            let borderRect = svg.querySelector('rect.border-rect');

            // Если прямоугольник ещё не создан, создаём его
            if (!borderRect) {
                const x = parseFloat(image.getAttribute('x')) || 0;
                const y = parseFloat(image.getAttribute('y')) || 0;
                const width = parseFloat(image.getAttribute('width')) || 0;
                const height = parseFloat(image.getAttribute('height')) || 0;

                borderRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                borderRect.setAttribute('x', x);
                borderRect.setAttribute('y', y);
                borderRect.setAttribute('width', width);
                borderRect.setAttribute('height', height);
                borderRect.setAttribute('stroke', 'black');
                borderRect.setAttribute('stroke-width', '1');
                borderRect.setAttribute('fill', 'none');
                borderRect.classList.add('border-rect');

                svg.insertBefore(borderRect, image);
            }

            // Управляем видимостью элемента в зависимости от параметра в локальном хранилище
            if (addBorderFromStorage === 'true') {
                borderRect.style.display = 'block'; // Показываем
            } else {
                borderRect.style.display = 'none'; // Скрываем
            }
        }
    };


          const addClonedImage = () => {
        const addClonedImageFromStorage = localStorage.getItem('addClonedImage');

        const svg = document.querySelector('#canvas > svg');
        const image = document.querySelector('#canvas > svg > image');
        const textureInput = document.querySelector('#Textures_Front__BgMaskImageUrl');
        const statusSelect = document.querySelector('#StatusId');

        // Проверяем, есть ли необходимые элементы
        if (svg && image && textureInput && statusSelect) {
            // Проверяем, выбрано ли значение "12" или "2" в статусе
            const selectedOption = statusSelect.querySelector('option[selected="selected"]');
            const isValidStatus = selectedOption && (selectedOption.value === "12" || selectedOption.value === "2");

            if (isValidStatus) {
                const newHref = textureInput.value; // Получить значение из input

                if (newHref) {
                    let clonedImage = svg.querySelector('image.cloned-image');

                    // Если клонированного элемента ещё нет, создаём его
                    if (!clonedImage) {
                        clonedImage = image.cloneNode(true);
                        clonedImage.classList.add('cloned-image');
                        clonedImage.setAttribute('opacity', '0.50');

                        // Вставить клонированный элемент после оригинального
                        image.insertAdjacentElement('afterend', clonedImage);
                    }

                    // Заменяем href на новое значение
                    clonedImage.setAttribute('href', newHref);

                    // Показываем или скрываем элемент в зависимости от значения в хранилище
                    if (addClonedImageFromStorage === 'true') {
                        clonedImage.style.display = 'block'; // Показываем
                    } else {
                        clonedImage.style.display = 'none'; // Скрываем
                    }
                }
            }
        }
    };

        const cloneSvgElement = () => {
        const cloneSvgElementFromStorage = localStorage.getItem('cloneSvgElement');

        const svgElement = document.querySelector('#background-rectangle-editor > svg');
        const canvas = document.querySelector('#canvas');
        const statusSelect = document.querySelector('#StatusId');

        if (svgElement && canvas && statusSelect) {
            // Проверяем, выбрано ли значение "12" или "2" в статусе
            const selectedOption = statusSelect.querySelector('option[selected="selected"]');
            const isValidStatus = selectedOption && (selectedOption.value === "12" || selectedOption.value === "2");

            if (isValidStatus) {
                // Проверяем, был ли уже добавлен клонированный элемент
                let clonedSvg = document.querySelector('.cloned-svg');
                if (!clonedSvg) {
                    // Клонируем SVG элемент
                    clonedSvg = svgElement.cloneNode(true);
                    clonedSvg.classList.add('cloned-svg'); // Добавляем класс для клонированного SVG

                    // Удаляем стиль cursor: move; у всех <ellipse> внутри клонированного SVG
                    const ellipses = clonedSvg.querySelectorAll('ellipse');
                    ellipses.forEach((ellipse) => {
                        ellipse.style.cursor = ''; // Удаляем стиль через style
                        ellipse.removeAttribute('style'); // Полностью удаляем атрибут style
                    });

                    // Проверяем, куда вставить клонированный SVG
                    const lastClonedImage = document.querySelector('image.cloned-image:last-of-type');
                    if (lastClonedImage) {
                        lastClonedImage.insertAdjacentElement('afterend', clonedSvg);
                    } else {
                        const borderRect = document.querySelector('rect.border-rect');
                        if (borderRect) {
                            const firstImageAfterBorderRect = borderRect.nextElementSibling?.tagName === 'image'
                                ? borderRect.nextElementSibling
                                : borderRect.nextElementSibling?.querySelector('image');
                            if (firstImageAfterBorderRect) {
                                firstImageAfterBorderRect.insertAdjacentElement('afterend', clonedSvg);
                            } else {
                                canvas.appendChild(clonedSvg); // Вставка в canvas, если других элементов нет
                            }
                        } else {
                            canvas.appendChild(clonedSvg);
                        }
                    }
                }

                // Управляем видимостью клонированного SVG в зависимости от значения в хранилище
                if (cloneSvgElementFromStorage === 'true') {
                    clonedSvg.style.display = 'block'; // Показываем
                } else {
                    clonedSvg.style.display = 'none'; // Скрываем
                }
            }
        }
    };




            const startScript = () => {
                intervalId = setInterval(() => {
                    // Проверяем, есть ли класс у #tng-product-ruler и включен ли скрипт
                    const tngProductRuler = document.querySelector('#tng-product-ruler');
                    if (tngProductRuler && tngProductRuler.classList.contains('switch-editor-button') && tngProductRuler.classList.contains('btn') && tngProductRuler.classList.contains('pull-left') && tngProductRuler.classList.contains('active')) {
                        addBorder();
                        addClonedImage();
                        cloneSvgElement(); // Клонируем SVG
                    }
                }, 250); // Проверяем каждую секунду
            };

            const stopScript = () => {
                if (intervalId) {
                    clearInterval(intervalId);
                    intervalId = null;
                }

                // Удаляем все элементы с классом 'border-rect' и 'cloned-image'
                document.querySelectorAll('.border-rect, .cloned-image, .cloned-svg').forEach(el => el.remove());
            };

            // Применяем сохранённое состояние
            if (savedState) {
                startScript();
            }

            newButton.addEventListener('click', (event) => {
        // Проверяем, зажата ли клавиша Alt
        if (event.altKey) {
            return; // Если Alt зажат, не выполняем дальнейшую логику
        }

        const isRunning = intervalId !== null;

        if (isRunning) {
            stopScript();
            newButton.replaceChild(disabledIcon, newButton.firstChild);
            localStorage.setItem(STORAGE_KEY, 'false');
        } else {
            startScript();
            newButton.replaceChild(enabledIcon, newButton.firstChild);
            localStorage.setItem(STORAGE_KEY, 'true');
        }
    });


            // Добавляем MutationObserver для отслеживания изменений в классе #tng-product-ruler
            const tngProductRuler = document.querySelector('#tng-product-ruler');
            if (tngProductRuler) {
                const observer = new MutationObserver(() => {
                    // Проверяем состояние cropScriptEnabled из локального хранилища
                    const isCropEnabled = localStorage.getItem(STORAGE_KEY) === 'true';

                    // Отслеживаем изменения в классе только если cropScriptEnabled === true
                    if (isCropEnabled) {
                        const hasClass = tngProductRuler.classList.contains('switch-editor-button') &&
                            tngProductRuler.classList.contains('btn') &&
                            tngProductRuler.classList.contains('pull-left') &&
                            tngProductRuler.classList.contains('active');

                        if (hasClass) {
                            startScript();
                        } else {
                            stopScript();
                        }
                    }
                });

                observer.observe(tngProductRuler, {
                    attributes: true,
                    attributeFilter: ['class']
                });
            }

            // Добавляем действия при наведении мыши
            newButton.addEventListener('mouseenter', () => {
                // Проверяем класс перед добавлением элементов
                const tngProductRuler = document.querySelector('#tng-product-ruler');
                if (tngProductRuler && tngProductRuler.classList.contains('switch-editor-button') && tngProductRuler.classList.contains('btn') && tngProductRuler.classList.contains('pull-left') && tngProductRuler.classList.contains('active')) {
                    addBorder();
                    addClonedImage();
                    cloneSvgElement(); // Клонируем SVG при наведении
                }
            });

            newButton.addEventListener('mouseleave', () => {
                if (!intervalId) {
                    // Удаляем только временные рамки и клонированные изображения, добавленные при наведении
                    document.querySelectorAll('.border-rect:not(.persistent), .cloned-image:not(.persistent), .cloned-svg').forEach(el => el.remove());
                }
            });
        }

    })();

    (function () {
        window.onload = function () {
            // Функция для имитации клика по элементу
            function clickElement(selector) {
                const element = document.querySelector(selector);
                if (element) {
                    element.click();
                } else {
                    console.log(`Элемент с селектором "${selector}" не найден.`);
                }
            }

            // Функция проверки наличия атрибута selected хотя бы у одного <option>
            function isAnyOptionSelected() {
                const statusElement = document.querySelector('#StatusId');
                if (!statusElement) return false; // Если #StatusId не найден, возвращаем false

                const optionValue12 = statusElement.querySelector('option[value="12"]');
                const optionValue2 = statusElement.querySelector('option[value="2"]');

                // Проверяем, что хотя бы один из <option> существует и имеет selected="selected"
                const isValue12Selected = optionValue12 && optionValue12.getAttribute('selected') === 'selected';
                const isValue2Selected = optionValue2 && optionValue2.getAttribute('selected') === 'selected';

                return isValue12Selected || isValue2Selected;
            }

            // Основная логика, проверяем условия и выполняем действия
            function checkConditionsAndClick() {
                // Проверяем наличие элемента с классом disabled
                const isDisabled = document.querySelector(
                    '#svgRed_Content > div.red_footer.clearfix > div.switch-editor-buttons-wrapper > a.switch-editor-button.btn.pull-left.disabled'
                );

                // Проверяем наличие класса "editorMode btn btn-default btn-primary" у селектора #btn-use-custom-editor
                const customEditorButton = document.querySelector('#btn-use-custom-editor');
                const hasRequiredClass =
                    customEditorButton && customEditorButton.classList.contains('editorMode') &&
                    customEditorButton.classList.contains('btn') &&
                    customEditorButton.classList.contains('btn-default') &&
                    customEditorButton.classList.contains('btn-primary');

                if (!isDisabled && isAnyOptionSelected() && hasRequiredClass) {
                    // Кликаем по первому элементу
                    clickElement('#svgRed_Content > div.red_footer.clearfix > div.switch-editor-buttons-wrapper > a:nth-child(5)');

                    // Ждём немного, чтобы клик успел сработать, и затем кликаем по второму элементу
                    setTimeout(() => {
                        clickElement('#tng-product-ruler');
                    }, 250); // Задержка (можно настроить по необходимости)

                    // Останавливаем проверку, так как условия выполнены
                    clearInterval(checkInterval);
                }
            }

            // Периодическая проверка условий
            const checkInterval = setInterval(checkConditionsAndClick, 250); // Проверяем каждые 200 мс
        };


            function createDraggableWindow(windowName) {
            const storedPosition = JSON.parse(localStorage.getItem(windowName)) || { top: 50, left: 50, width: 300, height: 200 };

            const windowDiv = document.createElement('div');
           windowDiv.id = windowName; // Добавляем id для каждого окна
            Object.assign(windowDiv.style, {
                position: 'absolute', // Элемент будет привязан к своему положению на странице

                top: `${storedPosition.top}px`,
                left: `${storedPosition.left}px`,
                width: `${storedPosition.width}px`,
                height: `${storedPosition.height}px`,
                backgroundColor: 'rgba(255, 255, 255, 0)',
                border: '0.5px solid rgba(0, 0, 0, 0.3)',
                paddingTop: '0px',
                zIndex: '0',
                overflow: 'auto',
                minWidth: '200px',
                minHeight: '33px',
                boxSizing: 'border-box',
                textAlign: 'left',
                fontFamily: 'Arial, sans-serif',
                resize: 'both',
                display: 'none',
                zIndex: '1' // Слой окна
            });

            const header = document.createElement('div');
            Object.assign(header.style, {
                width: '100%',
                height: '100%',
               // backgroundColor: '#ccc',
                backgroundColor: 'rgba(0, 0, 0, 0.0)',
                cursor: 'move',
                position: 'absolute',
                top: '0',
                left: '0',
                zIndex: '-1' // Хедер будет за содержимым

            });
            windowDiv.appendChild(header);

            const contentDiv = document.createElement('div');
            contentDiv.id = 'content';
            contentDiv.style.pointerEvents = 'auto';
            windowDiv.appendChild(contentDiv);

            document.body.appendChild(windowDiv);

            let offsetX, offsetY, isDragging = false;

            header.addEventListener('mousedown', (e) => {
                isDragging = true;
                offsetX = e.clientX - windowDiv.offsetLeft;
                offsetY = e.clientY - windowDiv.offsetTop;
                e.preventDefault();
            });

            document.addEventListener('mousemove', (e) => {
                if (isDragging) {
                    windowDiv.style.left = `${e.clientX - offsetX}px`;
                    windowDiv.style.top = `${e.clientY - offsetY}px`;
                    savePosition();
                }
            });

            document.addEventListener('mouseup', () => {
                isDragging = false;
            });

            windowDiv.addEventListener('mouseup', savePosition);
            windowDiv.addEventListener('resize', savePosition);

            function savePosition() {
                localStorage.setItem(windowName, JSON.stringify({
                    top: windowDiv.offsetTop,
                    left: windowDiv.offsetLeft,
                    width: windowDiv.offsetWidth,
                    height: windowDiv.offsetHeight
                }));
            }

            return contentDiv;
        }

        const contentDiv = createDraggableWindow('firstWindow'); // Первое окно для уникальных значений


    // Функция для добавления проверки видимости окон
    let lastWindowVisibilityState = null;

    function checkWindowVisibility() {
        // Проверяем, содержит ли текущий URL нужную строку
        const isEditBagPage = window.location.href.includes('Admin/CompareBag/EditBag');

        // Если страница не содержит 'Admin/CompareBag/EditBag', не показываем окна
        if (!isEditBagPage) {
            return;
        }

        // Проверяем значение для auditLog, tag и category в локальном хранилище
        const auditLogVisibility = JSON.parse(localStorage.getItem('auditLog')) ?? true;
        const tagVisibility = JSON.parse(localStorage.getItem('tag')) ?? true;
        const categoryVisibility = JSON.parse(localStorage.getItem('category')) ?? true;

        // Получаем окна по их id
        const firstWindow = document.querySelector('#firstWindow');
        const tagWindow = document.querySelector('#tagWindow');
        const categoryWindow = document.querySelector('#categoryWindow');

        // Создаем текущее состояние для сравнения
        const currentState = {
            firstWindow: !!firstWindow,
            tagWindow: !!tagWindow,
            categoryWindow: !!categoryWindow,
            tagVisibility,
            categoryVisibility,
            auditLogVisibility
        };

        // Логируем только при изменении состояния
        if (JSON.stringify(currentState) !== JSON.stringify(lastWindowVisibilityState)) {
            console.log('Изменение видимости окон:', currentState);
            lastWindowVisibilityState = currentState;
        }

        // Если окно не существует, не меняем его стиль
        if (firstWindow) {
            firstWindow.style.display = auditLogVisibility ? 'block' : 'none';
        }
        if (tagWindow) {
            tagWindow.style.display = tagVisibility ? 'block' : 'none';
        }
        if (categoryWindow) {
            categoryWindow.style.display = categoryVisibility ? 'block' : 'none';
        }
    }

    // Запускаем проверку видимости окон каждую секунду
    setInterval(checkWindowVisibility, 250);


    function addUniqueDivsForColumns() {
            const rows = Array.from(document.querySelectorAll('#RejectForm > thead > tr'));
            const uniqueValues = new Set();

            for (let i = rows.length - 1; i >= 1; i--) {
                const tds = rows[i].querySelectorAll('td');
                if (tds.length >= 4) {
                    const firstTdContent = tds[2].textContent.trim();
                    const textContent = tds[3].textContent.trim();
                    if (!uniqueValues.has(firstTdContent)) {
                        uniqueValues.add(firstTdContent);
                        const div = document.createElement('div');
                        div.innerHTML = `
                            <span style="color: red; font-size: 13px; font-weight: bold;">${firstTdContent}</span>:
                            <span style="color: blue; font-size: 13px; font-weight: bold;">${textContent}</span>
                        `;
                        div.style.padding = '4px';
                        div.style.margin = '5px';
                        div.style.boxShadow = '1px 1px 1px rgba(0, 0, 0, 0.3)';
                        div.style.cursor = 'pointer';
                        div.addEventListener('click', (event) => {
                            if (event.ctrlKey) {
                                const releaseHandler = (releaseEvent) => {
                                    if (!releaseEvent.ctrlKey) {
                                        handleClick(firstTdContent, textContent);
                                        document.removeEventListener('keyup', releaseHandler);
                                    }
                                };
                                document.addEventListener('keyup', releaseHandler);
                            } else {
                                handleClick(firstTdContent, textContent);
                            }
                        });
                        contentDiv.appendChild(div);
                    }
                }
            }
        }

        function handleClick(firstTdText, searchText) {
            const button = document.querySelector('#form-save > div.bag-details-wrapper.left-col > div.buttons > div:nth-child(6) > button.btn.btn-danger');
            if (button) {
                button.click();
                const rows = Array.from(document.querySelectorAll('#RejectForm > thead > tr'));
                for (const row of rows) {
                    const tds = row.querySelectorAll('td');
                    if (Array.from(tds).some(td => td.textContent.trim() === firstTdText)) {
                        const containsSearchText = Array.from(tds).some(td => td.textContent.trim() === searchText);
                        if (containsSearchText) {
                            const input = row.querySelector('td input');
                            if (input) {
                                input.click();
                                const seventhTdInput = row.querySelectorAll('td')[6].querySelector('input');
                                if (seventhTdInput) {
                                    seventhTdInput.focus();
                                }
                            }
                        }
                    }
                }
            }
        }

        addUniqueDivsForColumns();

        // Функция для добавления новых окон для тегов и категорий
        function addInfoWindows() {
            const tagWindow = createDraggableWindow('tagWindow'); // Окно для тегов
            const categoryWindow = createDraggableWindow('categoryWindow'); // Окно для категорий

            // Добавление стилей для текста
            const tagTextStyle = {
                color: 'red',
                fontSize: '12px',
                fontWeight: 'bold',
                margin: '1px 3px',
                padding: '1px',
                display: 'block',
                lineHeight: '1.2',
                wordWrap: 'break-word'
              //  borderBottom: '2px solid #d9534f'
            };

            const categoryTextStyle = {
                color: 'red',
                fontSize: '12px',
                fontWeight: 'bold',
                margin: '1px 3px',
                padding: '1px',
                display: 'block',
                lineHeight: '1.2',
                wordWrap: 'break-word'
               // borderBottom: '2px solid #5bc0de'
            };

            // Загружаем информацию
            const currentUrl = window.location.href;
            const id = currentUrl.split('/').pop();
            const newUrl = `https://tngadmin.triplenext.net/Admin/Audit/Product/${id}`;

            // Запрос на страницу
            fetch(newUrl)
                .then(response => response.text())
                .then(text => {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(text, 'text/html');

                    // Ищем конкретно таблицу с аудитом
                    const auditTable = doc.querySelector('#audit-by-username');
                    if (!auditTable) {
                        console.log('Таблица аудита не найдена');
                        return;
                    }
                    // Используем DOM API для точного извлечения данных
                    const rows = auditTable.querySelectorAll('tr:not(.table-header)');

                    const tagChanges = [];
                    const addedTags = [];
                    const removedTags = [];
                    const categories = [];

                    rows.forEach(row => {
                        const cells = row.querySelectorAll('td');
                        if (cells.length >= 7) {
                            const userName = cells[0].textContent.trim();
                            const eventType = cells[2].textContent.trim();
                            const noteCell = cells[6];
                            const noteText = noteCell.innerHTML;

                            // Пропускаем заголовок таблицы
                            if (userName === 'User') return;

                            // Ищем добавленные теги
                            if (noteText.includes('Added Tag:')) {
                                const tagMatch = noteText.match(/Added Tag:([^<]+)/);
                                if (tagMatch) {
                                    addedTags.push({
                                        user: userName,
                                        tag: tagMatch[1].trim()
                                    });
                                }
                            }

                            // Ищем удаленные теги
                            if (noteText.includes('Removed Tag:')) {
                                const tagMatch = noteText.match(/Removed Tag:([^<]+)/);
                                if (tagMatch) {
                                    removedTags.push({
                                        user: userName,
                                        tag: tagMatch[1].trim()
                                    });
                                }
                            }

                            // Ищем изменения тегов
                            if (noteText.includes('Tag changed from')) {
                                const tagMatch = noteText.match(/Tag changed from([^<]+)/);
                                if (tagMatch) {
                                    tagChanges.push({
                                        user: userName,
                                        change: tagMatch[1].trim()
                                    });
                                }
                            }

                            // Ищем изменения категорий
                            if (noteText.includes('Category:')) {
                                const categoryMatch = noteText.match(/Category:\s*([^<]+?)\s*-\s*&gt;\s*<b>([^<]+)<\/b>/);
                                if (categoryMatch) {
                                    const fromCategory = categoryMatch[1].trim();
                                    const toCategory = categoryMatch[2].trim();
                                    categories.push({
                                        user: userName,
                                        change: `${fromCategory} на ${toCategory}`
                                    });
                                }
                            }
                        }
                    });

                    console.log('Найдено через DOM API:', {
                        tagChanges: tagChanges.length,
                        addedTags: addedTags.length,
                        removedTags: removedTags.length,
                        categories: categories.length
                    });

                    // Отладочная информация для добавленных тегов
                    addedTags.forEach((item, index) => {
                        console.log(`Добавленный тег ${index + 1}:`, {
                            user: item.user,
                            tag: item.tag
                        });
                    });

                    // Отладочная информация для категорий
                    categories.forEach((item, index) => {
                        console.log(`Категория ${index + 1}:`, {
                            user: item.user,
                            change: item.change
                        });
                    });

                    // Функция для форматирования текста с именами пользователей
                    function formatWithUserName(text, userName) {
                        const showUserNames = localStorage.getItem('showUserNames') === 'true';
                        return showUserNames ? `${text} (${userName})` : text;
                    }

                    // Проверяем и выводим данные в tagWindow
                    let hasAnyTags = false;

                    // Сначала отображаем изменения тегов из tagChanges (если есть)
                    if (tagChanges.length > 0) {
                        hasAnyTags = true;
                        tagChanges.forEach(item => {
                            const tagText = item.change.replace(/<[^>]*>/g, '').trim().replace(/to/g, ' ---> ');
                            const tagDiv = document.createElement('div');
                            tagDiv.textContent = formatWithUserName(`Изменен тег: ${tagText}`, item.user);
                            Object.assign(tagDiv.style, tagTextStyle);
                            tagWindow.appendChild(tagDiv);
                        });
                    }

                    // Ищем пары удаленный-добавленный тег для отображения изменений
                    const tagPairs = [];
                    const processedAdded = new Set();
                    const processedRemoved = new Set();

                    // Простой алгоритм сопоставления: берем первый удаленный и первый добавленный
                    for (let i = 0; i < removedTags.length && i < addedTags.length; i++) {
                        if (processedRemoved.has(i) || processedAdded.has(i)) continue;

                        const removedItem = removedTags[i];
                        const addedItem = addedTags[i];

                        if (removedItem && addedItem) {
                            // Используем имя пользователя из удаленного тега (обычно они совпадают)
                            tagPairs.push({
                                from: removedItem.tag,
                                to: addedItem.tag,
                                user: removedItem.user
                            });
                            processedRemoved.add(i);
                            processedAdded.add(i);
                        }
                    }

                    // Отображаем изменения тегов в формате Male--->Female (KravchenkoOlena)
                    if (tagPairs.length > 0) {
                        hasAnyTags = true;
                        tagPairs.forEach((change, i) => {
                            console.log(`Изменение тега ${i + 1}: user = "${change.user}", from = "${change.from}", to = "${change.to}"`);
                            const tagDiv = document.createElement('div');
                            const changeText = `<span style="color: red;">${change.from}</span> ---> <span style="color: blue;">${change.to}</span>`;
                            tagDiv.innerHTML = formatWithUserName(changeText, change.user);
                            Object.assign(tagDiv.style, tagTextStyle);
                            tagWindow.appendChild(tagDiv);
                        });
                    }

                    // Отображаем оставшиеся добавленные теги (не входящие в пары)
                    addedTags.forEach((item, index) => {
                        if (processedAdded.has(index)) return;

                        console.log(`Добавленный тег: user = "${item.user}", tag = "${item.tag}"`);
                        const tagDiv = document.createElement('div');
                        const addedText = `Добавлен тег: <span style="color: blue;">${item.tag}</span>`;
                        tagDiv.innerHTML = formatWithUserName(addedText, item.user);
                        Object.assign(tagDiv.style, tagTextStyle);
                        tagWindow.appendChild(tagDiv);
                        hasAnyTags = true;
                    });

                    // Отображаем оставшиеся удаленные теги (не входящие в пары)
                    removedTags.forEach((item, index) => {
                        if (processedRemoved.has(index)) return;

                        const tagDiv = document.createElement('div');
                        tagDiv.textContent = formatWithUserName(`Удален тег: ${item.tag}`, item.user);
                        Object.assign(tagDiv.style, tagTextStyle);
                        tagWindow.appendChild(tagDiv);
                        hasAnyTags = true;
                    });

                    // Если ничего не найдено
                    if (!hasAnyTags) {
                        const tagDiv = document.createElement('div');
                        tagDiv.textContent = "Зашло с этим тегом";
                        Object.assign(tagDiv.style, tagTextStyle);
                        tagWindow.appendChild(tagDiv);
                        console.log('Показано сообщение "Зашло с этим тегом"');
                    } else {
                        console.log('Найдены теги для отображения:', {
                            changes: tagPairs.length,
                            changed: tagChanges.length,
                            added: addedTags.length,
                            removed: removedTags.length
                        });
                    }

                    // Проверяем и выводим данные в categoryWindow
                    if (categories.length > 0) {
                        console.log('Найдены категории:', categories.length);

                        categories.forEach((item, i) => {
                            console.log(`Категория ${i + 1}: userName = "${item.user}", change = "${item.change}"`);

                            const categoryDiv = document.createElement('div');
                            const categoryText = item.change.replace(/<[^>]*>/g, '').trim().replace(/-&gt;/g, 'на').replace(/&amp;/g, '&');
                            categoryDiv.textContent = formatWithUserName(`${i + 1}. ${categoryText}`, item.user);
                            Object.assign(categoryDiv.style, categoryTextStyle);
                            categoryWindow.appendChild(categoryDiv);
                        });
                    } else {
                        console.log('Категории не найдены, показываем "Категорию не меняли"');
                        const categoryDiv = document.createElement('div');
                        categoryDiv.textContent = "Категорию не меняли";
                        Object.assign(categoryDiv.style, categoryTextStyle);
                        categoryWindow.appendChild(categoryDiv);
                    }
                });
        }

        addInfoWindows();

        function createAuditIframeModal(url) {
            const modal = document.createElement('div');
            Object.assign(modal.style, {
                position: 'fixed',
                top: '0',
                left: '0',
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: '9999',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            });

            const box = document.createElement('div');
            Object.assign(box.style, {
                width: '80%',
                height: '80%',
                position: 'relative',
                backgroundColor: '#fff',
                borderRadius: '10px',
                overflow: 'hidden',
                boxShadow: '0 15px 40px rgba(0, 0, 0, 0.25)'
            });

            const iframe = document.createElement('iframe');
            iframe.src = url;
            Object.assign(iframe.style, {
                width: '100%',
                height: '100%',
                border: 'none'
            });

            const closeButton = document.createElement('button');
            closeButton.innerText = 'Закрыть';
            Object.assign(closeButton.style, {
                position: 'absolute',
                top: '10px',
                right: '20px',
                background: '#3079a3',
                color: '#fff',
                border: 'none',
                padding: '5px 10px',
                cursor: 'pointer',
                borderRadius: '4px',
                fontSize: '12px'
            });
            closeButton.addEventListener('click', () => modal.remove());

            box.appendChild(iframe);
            box.appendChild(closeButton);
            modal.appendChild(box);

            modal.addEventListener('click', (event) => {
                if (event.target === modal) {
                    modal.remove();
                }
            });

            document.body.appendChild(modal);
        }

        function auditLinkClickHandler(event) {
            if (localStorage.getItem('auditModalIframe') !== 'true') {
                return;
            }

            event.preventDefault();
            const url = event.currentTarget.href;
            createAuditIframeModal(url);
        }

        function setupAuditModalLink() {
            const auditLink = document.querySelector('#form-save > div.bag-details-wrapper.left-col > div.buttons > div.sRowBtn > div.auditLink > a');
            if (!auditLink || auditLink.dataset.auditModalBound === 'true') {
                return;
            }

            auditLink.addEventListener('click', auditLinkClickHandler);
            auditLink.dataset.auditModalBound = 'true';
        }

        setupAuditModalLink();

        const auditLinkObserver = new MutationObserver(() => {
            setupAuditModalLink();
        });
        auditLinkObserver.observe(document.body, { childList: true, subtree: true });

    // ВСТАВКА КОЛИЧЕСТВО ПРОДУКТОВ НА ПФ
    // Находим элемент по селектору
    let element = document.querySelector('#open-task-count');

    // Проверяем, существует ли элемент
    if (element) {
        // Получаем значение из локального хранилища
        let prefilterValue = localStorage.getItem('prefilter');

        // Проверяем, что значение существует и устанавливаем его
        if (prefilterValue) {
            element.value = prefilterValue;
            console.log('Значение value изменено на ' + prefilterValue);
        } else {
            console.log('Значение prefilter не найдено в локальном хранилище.');
        }
    } else {
        console.log('Элемент с селектором #open-task-count не найден.');
    }




        // Флаг для отслеживания изменений
        let scriptActive = false;
        let elementsCreated = false;

        function checkConditions() {
            const urlMatches = window.location.href.includes("PrefilterPictures");
            const storageEnabled = localStorage.getItem("PrefilterComments") === "true";

            const shouldActivate = urlMatches && storageEnabled;

            if (shouldActivate && !scriptActive) {
                scriptActive = true;
                initializeScript();
            } else if (!shouldActivate && scriptActive) {
                scriptActive = false;
                removeElements();
            }
        }

        function initializeScript() {
            if (elementsCreated) return; // Предотвращаем повторное создание элементов
            elementsCreated = true;

            /////////////////////////////////////////////////// Создание кнопки
            function createButton(text, id, top, comment, selectId) {
                let button = document.createElement('button');
                Object.assign(button, {
                    textContent: text,
                    id: id,
                    type: 'button',
                    className: 'created-by-script',
                    style: `
                        position: fixed;
                        top: ${top};
                        right: 10px;
                        z-index: 9999;
                        width: 130px;
                        height: 25px;
                        text-align: center;
                        border: none;
                        border-radius: 5px;
                        background-color: transparent;
                        color: black;
                        padding: 1px 0;
                        font-size: 10px;
                        cursor: pointer;
                    `,
                    onmouseover: () => button.style.backgroundColor = 'rgba(200, 200, 200, 0.5)',
                    onmouseout: () => button.style.backgroundColor = 'rgba(255, 255, 255, 0.5)',
                    ondblclick: function() {
                        let selectComments = $("#" + selectId);
                        if (selectComments.length) {
                            selectComments.empty();
                            selectComments.append(new Option(comment, comment, false, true)).trigger('chosen:updated');
                        }

                        let btn = document.getElementById("btnBadDimensions");
                        if (btn) btn.click();
                    }
                });

                document.body.appendChild(button);
            }

            /////////////////////////////////////////////////// Создание квадратов
            let heights = [75, 25, 50, 75];
            let offsets = heights.map((_, i) => heights.slice(0, i).reduce((a, b) => a + b + 5, 69));

            offsets.forEach((top, i) => {
                let div = document.createElement('div');
                div.className = 'created-element created-by-script';
                Object.assign(div.style, {
                    position: 'fixed',
                    top: `${top}px`,
                    right: '8px',
                    width: '132px',
                    height: `${heights[i]}px`,
                    backgroundColor: 'rgba(255, 255, 255, 0.5)',
                    border: '1px solid #33a6e8',
                    borderRadius: '5px'
                });

                document.body.appendChild(div);
            });

            /////////////////////////////////////////////////// Комментарии
            $(document).ready(function() {
                $("#SelectedComments").chosen();

                const buttonsData = [
                    ['Inappropriate Resolution', 'lowResolutionButton', '70px', 'Bad Image (inappropriate resolution and inability to remove the background)'],
                    ['Unusable Angle', 'unusableAngleButton', '95px', 'Bad Image (Unusable Angle and Pieces of products)'],
                    ['No Image on PDP', 'noImageOnPDPButton', '120px', 'No Image on PDP'],
                    ['Several Products (Set)', 'severalProductsButton', '150px', 'Several Products (Set)'],
                    ['No Dimensions on PDP', 'noDimensionsOnPDPButton', '180px', 'No Dimensions on PDP'],
                    ['Incorrect Dimensions', 'incorrectDimensionsButton', '205px', 'Incorrect Dimensions'],
                    ['(URL) not available', 'errorButton', '235px', 'Product detail page (URL) not available'],
                    ['Category not supported', 'wrongCategoryButton1', '260px', 'Category not supported'],
                    ['Not Supported', 'notSupportedButton1', '285px', 'Product Not Supported by Tangiblee']
                ];

                buttonsData.forEach(buttonData => createButton(...buttonData, 'SelectedComments'));
            });
        }

        function removeElements() {
            if (!elementsCreated) return;
            elementsCreated = false;

            // Удаляем созданные элементы
            document.querySelectorAll('.created-by-script').forEach(el => el.remove());
        }

        // Запуск проверки каждые 250 мс
        setInterval(checkConditions, 250);





    function shouldActivateScript() {
        return location.href.includes("PrefilterPictures") && localStorage.getItem("PrefilterPictures") === "true";
    }

    function setupScript() {
        if (!shouldActivateScript()) return;
    // Контейнер для изображений
    const imageContainer = document.createElement('div');
    imageContainer.style.position = 'fixed';
    imageContainer.style.top = '0';
    imageContainer.style.left = '0';
    imageContainer.style.width = '100vw';
    imageContainer.style.height = '100vh';
    imageContainer.style.zIndex = '10000';
    imageContainer.style.pointerEvents = 'none'; // Позволяет кликать сквозь контейнер
    document.body.appendChild(imageContainer);

    // Переменная для управления z-index
    let highestZIndex = 10000;

    // Функция обработки клика по изображению
    function handleImageClick(event, img) {
        if (!img) return;
        event.stopPropagation();

        let imageUrl = img.getAttribute('baseurl') || img.src;

        if (imageUrl.includes('ResizeImage')) {
            const urlParams = new URLSearchParams(imageUrl.split('?')[1]);
            imageUrl = decodeURIComponent(urlParams.get('sourceUrl'));
        }

        // Создаём контейнер для изображения
      // Получаем цвета из локального хранилища
    const colorPalette1 = localStorage.getItem('colorPalette1') || '#666';
    const colorPalette2 = localStorage.getItem('colorPalette2') || 'black';

    // Создаём контейнер для изображения
    const imgWrapper = document.createElement('div');
    Object.assign(imgWrapper.style, {
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        padding: '0px',
        borderRadius: '0px',
        boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)',
        backgroundImage: `
            linear-gradient(45deg, ${colorPalette1} 25%, transparent 25%, transparent 75%, ${colorPalette1} 75%, ${colorPalette1}),
            linear-gradient(45deg, ${colorPalette1} 25%, ${colorPalette2} 25%, ${colorPalette2} 75%, ${colorPalette1} 75%, ${colorPalette1})
        `,
        backgroundSize: '20px 20px',
        backgroundPosition: '0 0, 10px 10px',
        zIndex: highestZIndex++,
        cursor: 'pointer',
        pointerEvents: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'transform 0.1s',
    });


        // Крестик закрытия
        const closeButton = document.createElement('div');
        Object.assign(closeButton.style, {
            position: 'absolute',
            top: '5px',
            right: '5px',
            width: '25px',
            height: '25px',
            backgroundColor: '#42ace9',
            color: 'white',
            fontSize: '18px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            cursor: 'pointer',
        });
        closeButton.innerText = '×';
        closeButton.addEventListener('click', () => imgWrapper.remove());

        // Создаём изображение
        const imgTag = document.createElement('img');
        imgTag.src = imageUrl;
        Object.assign(imgTag.style, {
            maxWidth: '90vw',
            maxHeight: '90vh',
            borderRadius: '0px',
            cursor: 'grab',
        });
    // Добавляем обработчик двойного клика для закрытия изображения
            imgTag.addEventListener('dblclick', () => imgWrapper.remove());
        // Перетаскивание контейнера
        let isDragging = false;
        let offsetX = 0, offsetY = 0;

        imgWrapper.addEventListener('mousedown', (e) => {
            e.preventDefault();
            isDragging = true;
            offsetX = e.clientX - imgWrapper.offsetLeft;
            offsetY = e.clientY - imgWrapper.offsetTop;
            imgWrapper.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            imgWrapper.style.left = `${e.clientX - offsetX}px`;
            imgWrapper.style.top = `${e.clientY - offsetY}px`;
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            imgWrapper.style.cursor = 'pointer';
        });

        // Переключение z-index по клику
        imgWrapper.addEventListener('mousedown', () => {
            imgWrapper.style.zIndex = highestZIndex++;
        });

        // ЗУМИРОВАНИЕ ВСЕГО КОНТЕЙНЕРА
        let scale = 1;
        imgWrapper.addEventListener('wheel', (event) => {
            event.preventDefault();
            scale += event.deltaY * -0.0015;
            scale = Math.min(Math.max(0.5, scale), 3); // Ограничиваем зум от 50% до 300%
            imgWrapper.style.transform = `translate(-50%, -50%) scale(${scale})`;
        });

        // Добавляем элементы в контейнер
        imgWrapper.appendChild(imgTag);
        imgWrapper.appendChild(closeButton);
        imageContainer.appendChild(imgWrapper);
    }

    // Обработчик кликов для <img>
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('click', function (event) {
            handleImageClick(event, img);
        });
    });

    document.querySelectorAll('li').forEach(li => {
        li.addEventListener('click', function (event) {
            // Проверяем, был ли клик на <div>, <a> с классом или <button> с классом
            const div = li.querySelector('div');
            const a = li.querySelectorAll('a');
            const button = li.querySelectorAll('button');

            // Проверяем, был ли клик на элементе <div>, <a> или <button>
            if (
                (div && div.contains(event.target)) ||  // Клик внутри <div>
                [...a].some(anchor => anchor.contains(event.target)) ||  // Клик внутри <a>
                [...button].some(btn => btn.contains(event.target)) // Клик внутри <button>
            ) {
                return; // Если клик был на этих элементах, не открываем изображение
            }

            // Если клик не был внутри <div>, <a> или <button>, ищем картинку и вызываем handleImageClick
            const img = li.querySelector('img');
            if (img) {
                handleImageClick(event, img);
            }

        });
    });
    }

    let previousState = shouldActivateScript();
    setupScript();

    setInterval(() => {
        const currentState = shouldActivateScript();
        if (currentState !== previousState) {
            location.reload();
        }
        previousState = currentState;
    }, 250);

    //////////FIXSIZE


    (function () {
        let initialCheckCompleted = false;
        let observer = null;

        console.log("Скрипт запущен!");

        function checkFixsizeEnabled() {
            const fixsize = localStorage.getItem("fixsize");
            if (fixsize === "true") {
                console.log("Параметр fixsize включен, продолжаем выполнение скрипта.");
                checkInitialFixedSize();
            } else {
                console.log("Параметр fixsize отключен, скрипт не выполняется.");
            }
        }

        // Проверка на включение параметра fixsize
        function checkInitialFixedSize() {
            if (initialCheckCompleted) return;

            const canvasElement = document.querySelector("#canvas");
            const inputElement = document.querySelector("#edit-bag-header > table:nth-child(3) > tbody > tr:nth-child(2) > td:nth-child(10) > span > input.combo-value");

            if (canvasElement && canvasElement.textContent.includes("Fixed size:")) {
                console.log("Текст 'Fixed size:' найден");

                if (inputElement) {
                    console.log(`Текущее значение: ${inputElement.value}`);

                    if (inputElement.value === "0.1") {
                        console.log("Значение 0.1 — скрипт останавливается");
                        initialCheckCompleted = true;
                        return;
                    }

                    console.log("Значение НЕ 0.1 — изменяем стиль элемента");

                    setTimeout(() => {
                        const targetElement = document.querySelector("#edit-bag-header > table:nth-child(3) > tbody > tr:nth-child(1) > td:nth-child(10) > p");

                        if (targetElement) {
                            targetElement.style.backgroundColor = "red";
                            targetElement.style.color = "white";
                            console.log("Стиль успешно изменён");
                        } else {
                            console.log("Элемент не найден");
                        }

                        updateValueAndClick(inputElement);
                        initialCheckCompleted = true;
                    }, 100);
                }
            } else {
                console.log("Текст 'Fixed size:' НЕ найден, включаем наблюдатель");
                startObserver();
            }
        }

        function startObserver() {
            if (observer) return;

            observer = new MutationObserver(() => {
                const canvasElement = document.querySelector("#canvas");
                const inputElement = document.querySelector("#edit-bag-header > table:nth-child(3) > tbody > tr:nth-child(2) > td:nth-child(10) > span > input.combo-value");

                if (canvasElement && canvasElement.textContent.includes("Fixed size:") && inputElement) {
                    console.log("Текст 'Fixed size:' появился!");

                    console.log(`Текущее значение: ${inputElement.value}`);
                    if (inputElement.value !== "0.1") {
                        console.log("Значение НЕ 0.1 — обновляем и кликаем");
                        updateValueAndClick(inputElement);
                    } else {
                        console.log("Значение уже 0.1 — ничего не делаем");
                    }

                    console.log("Останавливаем наблюдатель");
                    observer.disconnect();
                    initialCheckCompleted = true;
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });
            console.log("Наблюдатель запущен...");
        }

        function updateValueAndClick(inputElement) {
            console.log("Меняем значение на 0.1...");

            // Обновляем скрытое поле value
            inputElement.value = "0.1";
            inputElement.dispatchEvent(new Event("input", { bubbles: true }));
            inputElement.dispatchEvent(new Event("change", { bubbles: true }));

            // Находим визуальное отображение значения и обновляем его
            const visualInputElement = document.querySelector("#edit-bag-header > table:nth-child(3) > tbody > tr:nth-child(2) > td:nth-child(10) > span > input.combo-text.validatebox-text");
            if (visualInputElement) {
                console.log("Обновляем визуальное отображение...");
                visualInputElement.value = "0.1";
                visualInputElement.dispatchEvent(new Event("input", { bubbles: true }));
                visualInputElement.dispatchEvent(new Event("change", { bubbles: true }));
            }
        }

        function waitForCanvas() {
            console.log("Ждём появления #canvas...");

            const interval = setInterval(() => {
                if (document.querySelector("#canvas")) {
                    console.log("#canvas найден, запускаем проверку!");
                    clearInterval(interval);
                    checkFixsizeEnabled();
                }
            }, 500);
        }

        function waitForButtonAndClick() {
            const buttonSelector = "#edit-bag-header > table:nth-child(3) > tbody > tr:nth-child(2) > td:nth-child(5) > a";
            const button = document.querySelector(buttonSelector);

            if (button && button.classList.contains("convert-numbers-to-measure-btn-active")) {
                console.log("Класс активен, кликаем по кнопке...");
                button.click();
            } else {
                console.log("Ожидаем появления нужного класса на кнопке...");
                const buttonObserver = new MutationObserver(() => {
                    if (button && button.classList.contains("convert-numbers-to-measure-btn-active")) {
                        console.log("Класс стал активным, кликаем по кнопке...");
                        button.click();
                        buttonObserver.disconnect(); // Останавливаем наблюдатель
                    }
                });

                buttonObserver.observe(button, { attributes: true, attributeFilter: ["class"] });
            }
        }

        waitForCanvas();
        waitForButtonAndClick();
    })();

    // Автоклик по виджету при загрузке страницы
    (function() {
        function autoClickWidget() {
            const autoClickEnabled = localStorage.getItem('autoClickWidget') === 'true';
            const onlyInActiveTask = localStorage.getItem('autoClickOnlyInActiveTask') === 'true';

            console.log('Автоклик: проверяем условия', {
                autoClickEnabled,
                onlyInActiveTask
            });

            if (autoClickEnabled) {
                // Проверяем, нужно ли работать только в активном таске
                if (onlyInActiveTask) {
                    const activeTaskMessage = document.querySelector('#moderation-task-message');
                    const statusSelect = document.querySelector('#StatusId');

                    // Проверяем наличие активного таска
                    const hasActiveTask = activeTaskMessage && activeTaskMessage.textContent.replace(/\s+/g, ' ').trim().includes('Product is in your active task');

                    // Проверяем статус ModerationComplete
                    const hasModerationCompleteStatus = (() => {
                        if (!statusSelect) {
                            return false;
                        }

                        const directValue = statusSelect.value;
                        if (directValue) {
                            return directValue === '12';
                        }

                        const selectedOption = Array.from(statusSelect.options || []).find(option => option.selected);
                        if (selectedOption) {
                            return selectedOption.value === '12';
                        }

                        const attrSelected = statusSelect.querySelector('option[selected="selected"]');
                        return attrSelected ? attrSelected.value === '12' : false;
                    })();

                    console.log('Автоклик: проверяем условия активного таска', {
                        hasActiveTask,
                        hasModerationCompleteStatus,
                        activeTaskMessageText: activeTaskMessage ? activeTaskMessage.textContent.trim() : 'не найден',
                        statusSelectValue: statusSelect ? statusSelect.value : 'не найден'
                    });

                    // Автоклик работает если есть активный таск И статус ModerationComplete
                    if (!hasActiveTask || !hasModerationCompleteStatus) {
                        console.log('Автоклик: продукт не в активном таске или статус не ModerationComplete, пропускаем');
                        return;
                    }
                }

                const widgetButton = document.querySelector('#btn-widget');
                if (widgetButton) {
                    console.log('Автоклик: кликаем по #btn-widget');
                    widgetButton.click();
                } else {
                    console.log('Автоклик: элемент #btn-widget не найден');
                }
            } else {
                console.log('Автоклик: функция отключена');
            }
        }

        // Запускаем автоклик при полной загрузке страницы
        if (document.readyState === 'complete') {
            autoClickWidget();
        } else {
            window.addEventListener('load', autoClickWidget);
        }
    })();
(function() {
    const OVERLAY_KEY = 'Overlay'; // ключ в localStorage

    // Проверяем, включена ли логика
    function isOverlayEnabled() {
        return localStorage.getItem(OVERLAY_KEY) === 'true';
    }

    // Функция для удаления overlay
    function removeOverlay(node) {
        if (!isOverlayEnabled()) return; // проверка перед удалением
        if (node.matches && node.matches('div.ui-widget-overlay.ui-front')) {
            node.remove();
            console.log('Overlay removed');
        }
    }

    // Сразу проверяем существующие overlay
    if (isOverlayEnabled()) {
        document.querySelectorAll('div.ui-widget-overlay.ui-front').forEach(removeOverlay);
    }

    // Отслеживаем появление новых overlay
    const observer = new MutationObserver((mutations) => {
        if (!isOverlayEnabled()) return;

        for (const mutation of mutations) {
            if (mutation.type === 'childList' && mutation.addedNodes.length) {
                mutation.addedNodes.forEach(node => {
                    if (node instanceof HTMLElement) removeOverlay(node);
                    // если внутри добавился overlay (nested)
                    node.querySelectorAll?.('div.ui-widget-overlay.ui-front').forEach(removeOverlay);
                });
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();


// ===============================
//  Позиция: временная (до перезагрузки) + постоянная при включении чекбокса
//  Сохранение масштаба (по желанию) — остаётся как было
// ===============================
(function () {
    const dialogSelector =
        'body > div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.ui-dialog-buttons.ui-draggable.ui-resizable';

    const POS_ENABLED_KEY = 'dialogPosition'; // если true -> persist в localStorage
    const POS_TOP_KEY = 'dialogTop';
    const POS_LEFT_KEY = 'dialogLeft';
    const SCALE_KEY = 'dialogScale';

    const SCALE_DEFAULT = 100;
    const SCALE_MIN = 50;
    const SCALE_MAX = 200;

    // временная позиция в памяти страницы (сброс при полной перезагрузке)
    // window.__dialogTempPos = { top: number, left: number }  // managed below

    const parsePx = val => (val == null || val === '') ? null : parseInt(val, 10);

    function normalizeScale(value) {
        value = Number(value);
        if (!Number.isFinite(value)) return SCALE_DEFAULT;
        return Math.min(SCALE_MAX, Math.max(SCALE_MIN, value));
    }

    // --- Helpers для чтения текущей позиции диалога ---
    function readInlineTopLeft(dialog) {
        const t = parsePx(dialog.style.top);
        const l = parsePx(dialog.style.left);
        return {
            top: t != null ? t : dialog.offsetTop,
            left: l != null ? l : dialog.offsetLeft
        };
    }

    // --- Сохранение позиции: либо в localStorage (если persist), либо в runtime переменной ---
    function savePositionState(dialog) {
        const pos = readInlineTopLeft(dialog);

        if (localStorage.getItem(POS_ENABLED_KEY) === 'true') {
            // persist permanently
            localStorage.setItem(POS_TOP_KEY, String(pos.top));
            localStorage.setItem(POS_LEFT_KEY, String(pos.left));

        } else {
            // временно — в памяти страницы (сбросится при reload)
            window.__dialogTempPos = { top: pos.top, left: pos.left };

        }
    }

    // --- Применить позицию к диалогу в момент инициализации ---
    function applyPositionOnInit(dialog) {
        // Если persist включён — используем localStorage (восстановление после перезагрузки).
        if (localStorage.getItem(POS_ENABLED_KEY) === 'true') {
            const top = localStorage.getItem(POS_TOP_KEY);
            const left = localStorage.getItem(POS_LEFT_KEY);
            if (top != null) dialog.style.top = top + 'px';
            if (left != null) dialog.style.left = left + 'px';

            return;
        }

        // Если persist выключен, но есть временная позиция в памяти страницы — применяем её
        if (window.__dialogTempPos && typeof window.__dialogTempPos.top !== 'undefined') {
            dialog.style.top = window.__dialogTempPos.top + 'px';
            dialog.style.left = window.__dialogTempPos.left + 'px';

            return;
        }


    }

    // --- Масштаб (оставил поведение как ранее: хранится в localStorage) ---
    function applyScale(dialog) {
        const stored = normalizeScale(localStorage.getItem(SCALE_KEY) ?? SCALE_DEFAULT);
        dialog.style.transformOrigin = 'top left';
        dialog.style.transform = `scale(${stored / 100})`;
        dialog.dataset.dialogScale = stored;
        // console.log('scale applied', stored);
    }

    // --- Drag logic: при движении обновляем inline top/left и сохраняем в нужное место ---
    function enableDragging(dialog) {
        const titlebar = dialog.querySelector('.ui-dialog-titlebar');
        const handle = titlebar || dialog;

        // Визуальный стиль для titlebar — чтобы он был видимым и перетаскиваемым
        if (titlebar) {
           titlebar.style.display = 'flex';
    titlebar.style.alignItems = 'center';
    titlebar.style.justifyContent = 'flex-start';
    titlebar.style.height = '20px';
    titlebar.style.padding = '0 8px';
    titlebar.style.cursor = 'move';
    titlebar.style.userSelect = 'none';

        } else {
            dialog.style.cursor = 'move';
        }

        let startX = 0, startY = 0, startLeft = 0, startTop = 0;
        let dragging = false;

        const onMouseMove = (e) => {
            if (!dragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            dialog.style.left = startLeft + dx + 'px';
            dialog.style.top = startTop + dy + 'px';
            // обновляем временную/постоянную позицию в зависимости от состояния чекбокса
            savePositionState(dialog);
        };

        const onMouseUp = () => {
            if (!dragging) return;
            dragging = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            // Один финальный save (на всякий)
            savePositionState(dialog);
        };

        handle.addEventListener('mousedown', (e) => {
            // если клик по area кнопок — игнорируем
            if (e.target.closest && e.target.closest('.ui-dialog-buttonpane')) return;

            dragging = true;
            startX = e.clientX;
            startY = e.clientY;
            const cur = readInlineTopLeft(dialog);
            startLeft = cur.left;
            startTop = cur.top;

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        // touch support
        handle.addEventListener('touchstart', (e) => {
            const t = e.touches[0];
            if (!t) return;
            if (e.target.closest && e.target.closest('.ui-dialog-buttonpane')) return;

            dragging = true;
            startX = t.clientX;
            startY = t.clientY;
            const cur = readInlineTopLeft(dialog);
            startLeft = cur.left;
            startTop = cur.top;

            const onTouchMove = (ev) => {
                if (!dragging) return;
                const tt = ev.touches[0];
                if (!tt) return;
                const dx = tt.clientX - startX;
                const dy = tt.clientY - startY;
                dialog.style.left = startLeft + dx + 'px';
                dialog.style.top = startTop + dy + 'px';
                savePositionState(dialog);
            };

            const onTouchEnd = () => {
                dragging = false;
                document.removeEventListener('touchmove', onTouchMove);
                document.removeEventListener('touchend', onTouchEnd);
                savePositionState(dialog);
            };

            document.addEventListener('touchmove', onTouchMove, { passive: false });
            document.addEventListener('touchend', onTouchEnd);
        });
    }

    // --- Чекбокс Save pos: переключает persistent режим ---
    function insertCheckbox(dialog) {
    const titlebar = dialog.querySelector('.ui-dialog-titlebar');
    if (!titlebar) return;

    // Если уже добавлено — пропускаем
    if (titlebar.querySelector('.dialog-pos-checkbox')) return;

    // Контейнер
    const wrapper = document.createElement('label');
    wrapper.style.display = 'flex';
    wrapper.style.alignItems = 'center';
    wrapper.style.gap = '6px';
    wrapper.style.fontSize = '12px';
    wrapper.style.userSelect = 'none';
    wrapper.style.cursor = 'default';
    wrapper.style.marginRight = '10px';  // маленький отступ справа

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'dialog-pos-checkbox';
    checkbox.checked = localStorage.getItem(POS_ENABLED_KEY) === 'true';


    wrapper.appendChild(checkbox);


    // ВСТАВЛЯЕМ СЛЕВА — перед первым дочерним элементом titlebar
    const first = titlebar.firstChild;
    titlebar.insertBefore(wrapper, first);

    // Логика переключения чекбокса
    checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
            // persist включён
            const pos = readInlineTopLeft(dialog);
            localStorage.setItem(POS_ENABLED_KEY, 'true');
            localStorage.setItem(POS_TOP_KEY, String(pos.top));
            localStorage.setItem(POS_LEFT_KEY, String(pos.left));
            console.log('✓ persistent save ENABLED', pos.top, pos.left);
        } else {
            // persist выключен
            localStorage.removeItem(POS_ENABLED_KEY);
            localStorage.removeItem(POS_TOP_KEY);
            localStorage.removeItem(POS_LEFT_KEY);
            console.log('✗ persistent save DISABLED (localStorage cleared)');
        }
    });
}


    // --- MutationObserver: при динамическом изменении стиля обновляем temp/persistent позицию ---
    function observeDialog(dialog) {
        // наблюдаем изменения атрибутов style, чтобы ловить внешние изменения (например sliders)
        const obs = new MutationObserver((mutations) => {
            // если стиль изменился — обновляем состояние (но не делаем лишних записей)
            for (const m of mutations) {
                if (m.type === 'attributes' && m.attributeName === 'style') {
                    savePositionState(dialog);
                    break;
                }
            }
        });

        obs.observe(dialog, {
            attributes: true,
            attributeFilter: ['style']
        });

        // также на событие mouseup/touchend — финальное сохранение
        dialog.addEventListener('mouseup', () => savePositionState(dialog));
        dialog.addEventListener('touchend', () => savePositionState(dialog));
    }

    // --- Инициализация диалога ---
    function initDialog(dialog) {
        if (!dialog) return;
        insertCheckbox(dialog);
        enableDragging(dialog);
        // сначала применяем позицию (либо persistent, либо temp-from-memory, либо ничего)
        applyPositionOnInit(dialog);
        applyScale(dialog);
        observeDialog(dialog);
    }

    function attemptInit() {
        const dialog = document.querySelector(dialogSelector);
        if (dialog) initDialog(dialog);
    }

    if (document.readyState === 'complete') {
        attemptInit();
    } else {
        window.addEventListener('load', attemptInit);
    }

    // следим за добавлением новых диалогов в DOM (SPA)
    const globalObs = new MutationObserver(() => attemptInit());
    globalObs.observe(document.body, { childList: true, subtree: true });

})();
 function applyZIndex() {
        const target = document.querySelector('body > div.navbar.navbar-static-top > div');
        if (target) {
            target.style.zIndex = '10';
        }
    }

    // Попробуем сразу
    applyZIndex();

    // И на случай динамической загрузки
    const observer = new MutationObserver(() => {
        applyZIndex();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    })();







    //Коментарии на модерации

    (function() {
        'use strict';

    ///////////////////////////////////////////////// Восстановление состояния видимости элементов при загрузке страницы
    window.addEventListener('load', function() {
        const buttonsVisibility = localStorage.getItem('buttonsVisibility');
        if (buttonsVisibility === 'hidden') {
            // Скрыть все элементы и кнопки, созданные данным скриптом
            const elementsAndButtonsToHide = document.querySelectorAll('.created-by-script');
            elementsAndButtonsToHide.forEach(function(element) {
                element.style.display = 'none';
            });
            // Скрываем кнопку "Скрыть все элементы" и отображаем кнопку "Показать скрытые элементы"
            hideElementsButton.style.display = 'none';
            showHiddenElementsButton.style.display = 'block';
        }
    });
    ///////////////////////////////////////////////// Создание кнопки
    function createButton(text, id, top, comment, selectId) {
        let button = document.createElement('button');
        button.classList.add('created-by-script');
        button.textContent = text;
        button.type = 'button';
        button.id = id;
        button.style.position = 'fixed';
        button.style.top = top;
        button.style.right = '10px';
        button.style.zIndex = '9999';
        button.style.width = '130px';
        button.style.height = '25px';
        button.style.textAlign = 'center';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.backgroundColor = 'transparent';
        button.style.color = 'black';
        button.style.padding = '1px 0';
        button.style.fontSize = '10px';
        button.style.cursor = 'pointer';
    ///////////////////////////////////////////////// Функция для двойного клика
    function performCommonActions() {
        let imageElement = document.querySelector(".box-item-image-holder > img[src*='yrulermgr.triplenext.net//Admin/comparebag/image?retailer']");
        if (imageElement) {
            imageElement.click();
            imageElement.click();

            let thumbnailElement = document.querySelector("#thumbs > ul > li > a.thumb > img");
            if (thumbnailElement) {
                let doubleClickEvent = new MouseEvent("dblclick", {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                thumbnailElement.dispatchEvent(doubleClickEvent);
            } else {
                console.error("Элемент с миниатюрой изображения не найден");
            }
        } else {
            console.error("Изображение не найдено или ссылка не соответствует ожидаемому URL");
        }

        updateAndConvert('CurrentDepth', '9');
        updateAndConvert('CurrentWidth', '9');
        updateAndConvert('CurrentHeight', '9');

        let button = document.querySelector(statusSelect.offsetParent !== null ? 'input#btn-save-and-next' : 'input#btn-save');
        if (button) {
            button.click();
        } else {
            console.log("Кнопка не найдена");
        }
    }

    // Получить элемент селектора статуса
    let statusSelect = document.getElementById("StatusId");

    // Добавить обработчик события для кнопки
    button.addEventListener('dblclick', function() {
        console.log("button double-clicked.");

        // Установить значение селектора в зависимости от видимости элемента статуса
        $("#StatusId").val(statusSelect.offsetParent !== null ? "5" : "6");

        performCommonActions();
    });

    ///////////////////////////////////////////////// Изменение цвета при наведении и убирании курсора
        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = 'rgba(200, 200, 200, 0.5)';
        });
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
        });

        button.addEventListener('click', function() {
        let selectComments = $("#" + selectId);
        let commentToAdd = comment; // Начальное значение комментария, которое будет добавлено

        // Получаем список уже выбранных комментариев
        let selectedComments = selectComments.val() || [];

        // Проверяем, есть ли уже выбранный комментарий в списке
        if (!selectedComments.includes(commentToAdd)) {
            // Если выбранный комментарий еще не добавлен, добавляем его
            selectedComments.push(commentToAdd);
            // Обновляем список выбранных комментариев
            selectComments.val(selectedComments).trigger('chosen:updated');
        } else {
            // Если выбранный комментарий уже есть в списке, ничего не делаем
            console.log('Комментарий уже выбран.');
        }
    });


        document.body.appendChild(button);
        return button;
    }

    ///////////////////////////////////////////////// Создание квадратов
    let heights = [75, 25, 50, 125, 25, 50];

    for (let i = 0; i < 6; i++) {
        let transparentSquare = document.createElement('div');
        transparentSquare.classList.add('created-element', 'created-by-script');
        transparentSquare.style.position = 'fixed';
        transparentSquare.style.top = (69 + heights.slice(0, i).reduce((a, b) => a + b + 5, 0)) + 'px'; //69
        transparentSquare.style.right = '8px';
        transparentSquare.style.width = '132px';
        transparentSquare.style.height = heights[i] + 'px';
        transparentSquare.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
        transparentSquare.style.border = '1px solid #33a6e8';
        transparentSquare.style.borderRadius = '5px';

        document.body.appendChild(transparentSquare);
    }
    ///////////////////////////////////////////////// Кнопки для скрытия и показа созданных елементов
    // Создание кнопки для скрытия всех элементов и кнопок, созданных скриптом
    const hideElementsButton = createButton('Скрыть комментарии', 'hideElementsButton', '12px');
    hideElementsButton.classList.add('created-by-script'); // Добавляем класс для идентификации кнопки
    hideElementsButton.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
    hideElementsButton.style.border = '2px solid #33a6e8';

    // Создание кнопки для показа всех скрытых элементов
    const showHiddenElementsButton = createButton('Открыть', 'showHiddenElementsButton', '12px');
    showHiddenElementsButton.classList.add('created-by-script'); // Добавляем класс для идентификации кнопки
    showHiddenElementsButton.style.display = 'none'; // Начально скрываем кнопку
    showHiddenElementsButton.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
    showHiddenElementsButton.style.border = '2px solid #33a6e8';

    // Добавление обработчика события для кнопки скрытия элементов и отображения кнопки "Показать скрытые элементы"
    hideElementsButton.addEventListener('click', function() {
        // Скрыть только элементы и кнопки, созданные данным скриптом
        const elementsAndButtonsToHide = document.querySelectorAll('.created-by-script');
        elementsAndButtonsToHide.forEach(function(element) {
            element.style.display = 'none';
        });

        // Сохраняем состояние видимости кнопок в локальном хранилище
        localStorage.setItem('buttonsVisibility', 'hidden');

        // Скрываем кнопку "Скрыть все элементы" и отображаем кнопку "Показать скрытые элементы"
        hideElementsButton.style.display = 'none';
        showHiddenElementsButton.style.display = 'block';
    });

    // Добавление обработчика события для кнопки "Показать скрытые элементы"
    showHiddenElementsButton.addEventListener('click', function() {
        // Показать все скрытые элементы и кнопки, созданные данным скриптом
        const elementsAndButtonsToShow = document.querySelectorAll('.created-by-script');
        elementsAndButtonsToShow.forEach(function(element) {
            element.style.display = 'block';
        });

        // Сохраняем состояние видимости кнопок в локальном хранилище
        localStorage.setItem('buttonsVisibility', 'visible');

        // Отображаем кнопку "Скрыть все элементы" и скрываем кнопку "Показать скрытые элементы"
        hideElementsButton.style.display = 'block';
        showHiddenElementsButton.style.display = 'none';
    });

    ///////////////////////////////////////////////// Комментарии
    $(document).ready(function() {
        $("#SelectedComments").chosen();


                const buttonsData = [
                    ['Inappropriate Resolution', 'lowResolutionButton', '70px', 'Bad Image (inappropriate resolution and inability to remove the background)'],
                    ['Unusable Angle', 'unusableAngleButton', '95px', 'Bad Image (Unusable Angle and Pieces of products)'],
                    ['No Image on PDP', 'noImageOnPDPButton', '120px', 'No Image on PDP'],

                    ['Several Products (Set)', 'severalProductsButton', '150px', 'Several Products (Set)'],

                    ['No Dimensions on PDP', 'noDimensionsOnPDPButton', '180px', 'No Dimensions on PDP'],
                    ['Incorrect Dimensions', 'incorrectDimensionsButton', '205px', 'Incorrect Dimensions'],

                    ['Scaled by width', 'scaledByWidthButton', '235px', 'Scaled by width, causes height decoration to appear disproportionate'],
                    ['Scaled by height', 'scaledByHeightButton', '260px', 'Scaled by height, causes width decoration to appear disproportionate'],
                    ['Only one dimension', 'oneDimensionButton', '285px', 'There is only one dimension on the PDP'],
                    ['No length on the PDP', 'noLengthOnThePDPButton', '310px', 'There is no length listed on the PDP'],
                    ['No depth on the PDP', 'noDepthOnThePDPButton', '335px', 'There is no depth listed on the PDP'],

                    ['(URL) not available', 'errorButton', '365px', 'Product detail page (URL) not available'],

                    ['Category not supported', 'wrongCategoryButton', '395px', 'Category not supported'],
                    ['Not Supported', 'notSupportedButton', '420px', 'Product Not Supported by Tangiblee'],
                ];
            // Создаем кнопки из данных
        for (const buttonData of buttonsData) {
            createButton(...buttonData, 'SelectedComments');
        }

    ///////////////////////////////////////////////// Кнопка "To Moderation"
    var buttonStyle = document.querySelector('.created-by-script').style;

    // Получаем элемент <select> по id
    let statusSelect = document.getElementById("StatusId");

    // Проверяем, скрыт ли элемент
    if (statusSelect.offsetParent === null) {
        // Элемент скрыт, создаем кнопку "To Moderation"
        var button = document.createElement("button");
        button.innerHTML = "To Moderation";
        button.id = "ModerationBtn";
        button.type = "button";

        // Добавляем обработчик события для двойного клика
        button.addEventListener('dblclick', function() {
            var select = document.getElementById("StatusId");
            select.value = "9";
            var event = new Event('change');
            select.dispatchEvent(event);

            let saveButton = document.querySelector('input#btn-save');
            if (saveButton) {
                saveButton.click();
            } else {
                console.log("Кнопка 'input#btn-save' не найдена");
            }
        });

        // Устанавливаем стили для кнопки
        Object.assign(button.style, {
            position: 'fixed',
            top: '450px', //450
            right: '10px',
            zIndex: '9999',
            width: '130px',
            height: '25px',
            textAlign: 'center',
            border: 'none',
            borderRadius: '5px',
            backgroundColor: 'rgb(61, 170, 233)',
            fontSize: '10px',
            cursor: 'pointer'
        });

        // Добавляем кнопку на страницу
        document.body.appendChild(button);
    }

    });

    ///////////////////////////////////////////////// Функция перевода см в инчи
    function updateAndConvert(parameterName, value) {
        let hiddenInputElement = document.querySelector('.cm-inputs .combo-value[name="' + parameterName + '"]');
        let visibleInputElement = document.querySelector('.cm-inputs .combo-text');

        if (hiddenInputElement && visibleInputElement) {
            if (hiddenInputElement.value === '0') { // Проверяем, равно ли значение скрытой ячейки 0
                hiddenInputElement.value = value;
                visibleInputElement.value = value;
                visibleInputElement.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
                let convertButton = document.querySelector('.convert-numbers-to-measure-btn');

                if (convertButton) {
                    convertButton.click();
                }
            } else {
                console.log("Скрытая ячейка не равна 0. Не вводить значение.");
            }
        } else {
            console.log("StatusId is hidden.");
        }
    }

    let statusSelect = document.querySelector('select#StatusId');



    ///////////////////////////////////////////////// Кнопка полной закраски
    const markerSizeButton = document.querySelector('a[href="javascript:tangiblee.webManager.backgroundMarker.setMarkerSize()"]');

    // Создать кнопку
    const fillCanvasButton = document.createElement('button');
    fillCanvasButton.type = 'button';
    fillCanvasButton.id = 'fillCanvasButton';
    fillCanvasButton.textContent = '';

    // Установить стили для кнопки
    fillCanvasButton.style.width = '30px';
    fillCanvasButton.style.height = '30px';
    fillCanvasButton.style.backgroundColor = '#99cc66';
    fillCanvasButton.style.border = '1px solid #cccccc';
    fillCanvasButton.style.borderRadius = '4px';

    // Вставить кнопку справа от элемента markerSizeButton
    markerSizeButton.parentNode.insertBefore(fillCanvasButton, markerSizeButton.nextSibling);

    // Добавить обработчик события 'click' для кнопки
    fillCanvasButton.addEventListener('click', () => {
        const self = tangiblee.webManager.backgroundMarker;
        const fillColor = "rgb(0, 250, 0)";

        self.canvasContext.clearRect(0, 0, self.canvas.width, self.canvas.height);
        self.canvasContext.fillStyle = fillColor;
        self.canvasContext.fillRect(0, 0, self.canvas.width, self.canvas.height);

        self.imageWasChanged = true;
        self.isSelectionCleared = false;
    });



    })();



    //ПЕРЕХОД НА ПДП

    (function() {
        'use strict';

        // Получаем текущий URL и обрабатываем его до знака ?
        const currentUrl = window.location.href.split('?')[0];

        // Ключ для хранения данных в localStorage
        const storageKey = 'scriptExecutionStatus';

        // Функция для выполнения действия
        function performAction() {
            // Найти элемент по селектору
            const linkElement = document.querySelector('#form-save > div.bag-details-wrapper.left-col > div.Link > a');

            if (linkElement) {
                // Создать событие нажатия кнопки мыши (mousedown)
                const mouseDownEvent = new MouseEvent('mousedown', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });

                // Отправить события в нужном порядке
                linkElement.dispatchEvent(mouseDownEvent);
            }
        }

        // Функция для проверки наличия элемента с определенным текстом и выполнения действия
        function checkAndPerform() {
            const moderationTaskMessage = document.querySelector('#moderation-task-message');

            if (moderationTaskMessage && moderationTaskMessage.textContent.includes('Product is in your active task')) {
                // Проверяем и обновляем состояние только если скрипт еще не выполнялся
                if (!isScriptExecuted()) {
                    performAction();
                    // Установить флаг в localStorage и удалить интервал
                    updateScriptExecutionStatus(true);
                    clearInterval(checkInterval);
                }
            }
        }

        // Функция для проверки, выполнен ли скрипт для текущего URL
        function isScriptExecuted() {
            const executionData = JSON.parse(localStorage.getItem(storageKey)) || {};
            return executionData[currentUrl] === true;
        }

        // Функция для обновления состояния выполнения скрипта в localStorage
        function updateScriptExecutionStatus(status) {
            const executionData = JSON.parse(localStorage.getItem(storageKey)) || {};
            executionData[currentUrl] = status;
            localStorage.setItem(storageKey, JSON.stringify(executionData));
        }

        // Функция для очистки данных в localStorage
        function clearExecutionStatus() {
            localStorage.removeItem(storageKey);
        }

        // Слушаем событие изменения localStorage для синхронизации между вкладками
        window.addEventListener('storage', (event) => {
            if (event.key === storageKey) {
                // Перепроверить текущее состояние
                if (isScriptExecuted()) {
                    clearInterval(checkInterval);
                }
            }
        });

        // Проверять наличие элемента и текст каждые 500 миллисекунд
        const checkInterval = setInterval(checkAndPerform, 500);

        // Очищать данные каждые 3600 миллисекунд (1 час)
        setInterval(clearExecutionStatus, 3600000);
    })();
