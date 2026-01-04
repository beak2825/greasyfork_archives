// ==UserScript==
// @name         MBSS Templates Sidebar
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Sidebar for storing and using response templates for support operators
// @author       Your Name
// @match        https://support-admin-common-master.mbss.maxbit.private/*
// @require 	   https://greasyfork.org/scripts/28536-gm-config/code/GM_config.js?version=184529
// @require      https://cdnjs.cloudflare.com/ajax/libs/Sortable/1.15.0/Sortable.min.js
// @grant        GM.getValue
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM.setValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/554050/MBSS%20Templates%20Sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/554050/MBSS%20Templates%20Sidebar.meta.js
// ==/UserScript==

//1.1 зафиксированы цвета для темной темы чата
//1.2 улучшенная обработка текста + работа в чатах из тг (от a.rusakov)

function scriptsHelper() {
    'use strict';
    let config = {
        settings: {}
    }
    GM_config.init({
        id: 'MyConfig', // The id used for this instance of GM_config
        title: 'Настройки скрипта',
        // Fields object
        fields: {
            copy: {
                label: "Копировать скрипты",
                type: "checkbox",
                default: false
            }
        }
    });
    config.settings = {
        copy: GM_config.get('copy'),
    }
    const fontAwesomeLink = document.createElement('link');
    fontAwesomeLink.rel = 'stylesheet';
    fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css';
    document.head.appendChild(fontAwesomeLink);

    // CSS styles
    const styles = `
    #template-sidebar {
        position: fixed;
        left: 0;
        top: 0;
        width: 500px;
        height: 100%;
        background-color: #ffffff;
        border-right: 1px solid #ddd;
        box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
        z-index: 10000000;
        overflow-y: auto;
        transition: transform 0.3s ease;
        transform: translateX(-100%);
        color: #333333 !important; /* Фиксированный цвет текста */
    }

    #template-sidebar.open {
        transform: translateX(0);
    }

    #template-sidebar header {
        padding: 10px;
        background-color: #f5f5f5;
        border-bottom: 1px solid #ddd;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #333333 !important; /* Фиксированный цвет текста */
    }

    #template-sidebar h2 {
        margin: 0;
        font-size: 16px;
        color: #333333 !important; /* Фиксированный цвет текста */
    }

    #template-sidebar .close-btn {
        cursor: pointer;
        font-size: 20px;
        color: #333333 !important; /* Фиксированный цвет текста */
    }

    #template-sidebar .section {
        margin: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
        padding: 10px;
        position: relative;
        color: #333333 !important; /* Фиксированный цвет текста */
    }

    #template-sidebar .section h3 {
        margin: 0 0 5px 0;
        font-size: 14px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #333333 !important; /* Фиксированный цвет текста */
    }

    #template-sidebar .section .section-name {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #333333 !important; /* Фиксированный цвет текста */
    }

    #template-sidebar .template-text {
        color: #333333 !important; /* Фиксированный цвет текста */
    }

    /* Добавляем !important ко всем цветам текста */
    #template-sidebar,
    #template-sidebar * {
        color: #333333 !important;
    }

    /* Остальные стили остаются без изменений */
    #template-sidebar .btn-group {
        display: flex;
        align-items: center;
    }

    #template-sidebar .btn-group .btn-icon {
        margin-left: 5px;
    }

    #template-sidebar .templates {
        margin-top: 10px;
    }

    #template-sidebar .template {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 5px 5px 5px 0px;
        border: 1px solid #ddd;
        border-radius: 3px;
        margin-bottom: 5px;
        cursor: pointer;
        background-color: rgba(250, 250, 250, 0.7);
    }

    #template-sidebar .template:hover {
        background-color: rgba(240, 240, 240, 0.7);
    }

    #template-sidebar .template .template-text {
        padding:10px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        flex: 1;
    }

    #template-sidebar .template .delete-btn {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 14px;
        color: #dc3545;
        margin-left: 5px;
    }

    #template-sidebar .btn {
        cursor: pointer;
        background-color: #007bff;
        color: white !important; /* Фиксированный цвет текста кнопок */
        border: none;
        padding: 5px 10px;
        margin: 5px;
        border-radius: 3px;
        font-size: 14px;
    }

    .section-name {
        cursor:grab;
    }

    #template-sidebar .btn:hover {
        background-color: #0056b3;
    }

    #template-sidebar .btn-danger {
        background-color: #dc3545;
    }

    #template-sidebar .btn-danger:hover {
        background-color: #c82333;
    }

    #template-sidebar .btn-icon {
        background: none;
        border: 1px solid #ddd;
        cursor: pointer;
        font-size: 16px;
        padding: 5px;
        border-radius: 3px;
        color: #007bff !important; /* Фиксированный цвет иконок */
    }

    #template-sidebar .btn-icon:hover {
        color: #0056b3 !important;
        border-color: #0056b3;
    }

    #template-sidebar .btn-icon.delete-btn {
        color: #dc3545 !important;
        border-color: #dc3545;
    }

    #template-sidebar .btn-icon.delete-btn:hover {
        color: #c82333 !important;
        border-color: #c82333;
    }

    #template-toggle-btn {
        position: fixed;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        background-color: #007bff;
        color: white !important;
        border: none;
        padding: 10px;
        cursor: pointer;
        z-index: 10001;
    }

    #template-search {
        width: 100%;
        padding: 10px;
        box-sizing: border-box;
        border: 1px solid #ddd;
        margin-bottom: 10px;
        color: #333333 !important; /* Фиксированный цвет текста поиска */
        background-color: #ffffff !important; /* Фиксированный фон */
    }

    .tooltip {
        position: absolute;
        background-color: #333;
        color: #fff !important;
        padding: 5px 10px;
        border-radius: 4px;
        font-size: 12px;
        max-width: 250px;
        z-index: 100000000000000;
        opacity: 0;
        transition: opacity 0.3s;
        overflow-wrap: break-word;
    }

    .tooltip.show {
        opacity: 1;
    }

    .btn_group {
        display:flex;
        justify-content:center;
        column-gap:20px;
    }

    .sectionHeader {
        display:flex;
    }

    /* Принудительно устанавливаем цвет текста для всех элементов внутри сайдбара */
    #template-sidebar * {
        color: #333333 !important;
    }
`;

    GM_addStyle(styles);
    function setCursorToEnd(div) {
        div.focus();
        let sel = window.getSelection();
        sel.removeAllRanges();
        let range = document.createRange();
        range.selectNodeContents(div);
        range.collapse(false);
        sel.addRange(range);
    }
    function createModal() {
        const modal = document.createElement('div');
        modal.id = 'customHotkeyModal';
        modal.style.position = 'fixed';
        modal.style.top = '50%';
        modal.style.left = '50%';
        modal.style.transform = 'translate(-50%, -50%)';
        modal.style.backgroundColor = '#fff';
        modal.style.padding = '20px';
        modal.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
        modal.style.zIndex = '1000000000000000000000000000000000000';
        modal.style.display = 'none';

        const form = document.createElement('form');

        const labelHotkey = document.createElement('label');
        labelHotkey.textContent = 'Введите хоткей (например, Alt+X):';
        form.appendChild(labelHotkey);

        const inputHotkey = document.createElement('input');
        inputHotkey.type = 'text';
        inputHotkey.name = 'hotkey';
        form.appendChild(inputHotkey);

        const submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.style.cssText = "cursor:pointer;"
        submitButton.textContent = 'Сохранить';
        form.appendChild(submitButton);

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const hotkey = inputHotkey.value.toLowerCase();;
            const text = modal.getAttribute("data-to-insert")
            if (hotkey && text) {
                const hotkeys = GM_getValue('hotkeys', {});
                hotkeys[hotkey] = text;
                GM_setValue('hotkeys', hotkeys);
                inputHotkey.value = ""
                alert('Хоткей сохранен!');
                modal.style.display = 'none';
            } else {
                alert('Пожалуйста, заполните поле.');
            }
        });

        modal.appendChild(form);
        document.body.appendChild(modal);

        return modal;
    }

    const modal = createModal();

    // Функция для отображения модального окна
    function showModal(text) {
        modal.setAttribute("data-to-insert", text)
        modal.style.display = 'block';
    }

    // Регистрация команды меню для открытия модального окна
    if (typeof GM_registerMenuCommand !== 'undefined') {
        GM_registerMenuCommand('Добавить хоткей', showModal);
    } else {
        console.warn('GM_registerMenuCommand не поддерживается в этом окружении.');
    }

    // Функция для вставки текста по хоткею
    function setCursorToEnd(div) {
        div.focus();
        let sel = window.getSelection();
        sel.removeAllRanges();
        let range = document.createRange();
        range.selectNodeContents(div);
        range.collapse(false);
        sel.addRange(range);
    }


    // Обработчик для нажатия клавиш
    document.addEventListener('keydown', (e) => {
        const hotkeys = GM_getValue('hotkeys', {});
        const pressedKey = [
            e.ctrlKey ? 'ctrl' : '',
            e.altKey ? 'alt' : '',
            e.shiftKey ? 'shift' : '',
            e.metaKey ? 'meta' : '',
            e.key.toLowerCase()
        ].filter(Boolean).join('+');
        if (hotkeys[pressedKey]) {
            e.preventDefault();
            addScript(hotkeys[pressedKey]);
        }
    });
    // Create sidebar
    const sidebar = document.createElement('div');
    sidebar.id = 'template-sidebar';
    sidebar.innerHTML = `
        <header>
              <h2 id="openConfig">Шаблоны SDT</h2>
            <span class="close-btn">&times;</span>
        </header>
        <input type="text" id="template-search" placeholder="Поиск...">
        <div class="btn_group">
        <button class="btn" id="add-section-btn"> Добавить раздел</button>
        <button class="btn" id="load_mirrors"> Загрузить зеркала</button>
        <button class="btn" id="add_email"> Добавить почту</button>
        </div>
        <div id="template-content"></div>
    `;
    document.querySelector("body").appendChild(sidebar), 10000

    // Create toggle button
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'template-toggle-btn';
    toggleBtn.className = 'btn';
    toggleBtn.innerHTML = '<i class="fas fa-folder"></i>';
    document.body.appendChild(toggleBtn);

    // Event listeners
    document.querySelector('#template-toggle-btn').addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });

    document.querySelector('.close-btn').addEventListener('click', () => {
        sidebar.classList.remove('open');
    });

    document.querySelector('#add-section-btn').addEventListener('click', addSection);
    document.querySelector('#load_mirrors').addEventListener('click', extractProjectUrls)
    document.querySelector('#add_email').addEventListener('click', addEmail)
    document.querySelector('#openConfig').addEventListener('click', () => GM_config.open())
    document.querySelector('#template-search').addEventListener('input', (event) => {
        const searchTerm = event.target.value.toLowerCase();
        filterSections(searchTerm);
    });

    // Load sections and templates
    loadSections();
    createTooltip()
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    document.body.appendChild(tooltip);
    function loadSections() {
        GM.getValue('sections', []).then(sections => {
            const content = document.getElementById('template-content');
            content.innerHTML = '';

            // Create a sortable list for sections
            const sortable = new Sortable(content, {
                handle: '.section-name',
                animation: 150,
                onEnd: (evt) => {
                    // Update sections order after drag and drop
                    const newSections = Array.from(content.children).map((child, index) => ({
                        id: child.dataset.id,
                        name: child.querySelector('.section-name').textContent.trim(),
                        templates: sections.find(sec => sec.id === child.dataset.id).templates,
                        pinned: sections.find(sec => sec.id === child.dataset.id).pinned,
                        color: sections.find(sec => sec.id === child.dataset.id).color,
                    }));
                    GM.setValue('sections', newSections);
                },
            });

            // Render sections
            sections.forEach((section, index) => {
                const sectionDiv = createSectionElement(section.name, section.id, section.templates, section.color);
                content.appendChild(sectionDiv);
            });
        });
    }

    // Function to create section element
    function createSectionElement(name, id, templates, color) {
        const sectionDiv = document.createElement('div');
        sectionDiv.className = 'section';
        sectionDiv.style.backgroundColor = color ? hexToRGB(color, 0.5) : `rgba(250, 250, 250, 0.3)`;
        sectionDiv.dataset.id = id;
        sectionDiv.innerHTML = `
            <div class="sectionHeader">
            <h3 class="section-name">${name}</h3>
            <div class="btn-group">
                <input type="color" class="section-color" value="${color || '#ffffff'}">
                <button class="btn-icon add-btn" title="Add Template"><i class="fas fa-pen"></i></button>
                <button class="btn-icon delete-btn"><i class="fas fa-trash"></i></button>
            </div>
</div>
            <div class="templates"></div>
        `;
        templates.forEach((template, templateIndex) => {
            const templateDiv = document.createElement('div');
            templateDiv.className = 'template';
            templateDiv.style.backgroundColor = template.color ? hexToRGB(template.color, 0.5) : `rgba(250, 250, 250, 0.3)`;
            templateDiv.innerHTML = `
                                <div class="template-text">${shortenText(template.full)}</div>
                                <div style="display:flex; column-gap:5px;">
                                <button class="btn-icon delete-btn" title="Delete Template"><i class="fas fa-trash"></i></button>
                                <button class="btn-icon delete-btn" title="Delete Template"><i class="fas fa-plus"></i></button>
                                <input type="color" class="template-color" value="${template.color || '#ffffff'}"></div>
                                </div>
                            `;
            templateDiv.querySelector(".fa-plus").addEventListener('click', () => showModal(template.full));
            templateDiv.querySelector(".template-text").addEventListener('click', () => addScript(template.full));
            templateDiv.querySelector(".template-text").setAttribute(`data-tooltip`, template.full)
            templateDiv.querySelector('.delete-btn').addEventListener('click', () => deleteTemplate(id, template.id));
            templateDiv.querySelector('.template-color').addEventListener('change', (event) => changeTemplateColor(id, template.id, event.target.value));
            sectionDiv.querySelector('.templates').appendChild(templateDiv)
                ;

        });
        sectionDiv.querySelector('.section-color').addEventListener('change', (event) => changeSectionColor(id, event.target.value));
        sectionDiv.querySelector('.add-btn').addEventListener('click', () => {
            addTemplate(sectionDiv.dataset.id);
        });
        sectionDiv.querySelector('.delete-btn').addEventListener('click', () => {
            deleteSection(sectionDiv.dataset.id);
        });

        return sectionDiv;
    }
    function createFilteredSectionElement(name, id, templates, color, searchTerm) {
        const sectionDiv = document.createElement('div');
        sectionDiv.className = 'section';
        sectionDiv.style.backgroundColor = color ? hexToRGB(color, 0.5) : `rgba(250, 250, 250, 0.3)`;
        sectionDiv.dataset.id = id;
        sectionDiv.innerHTML = `
            <div class="sectionHeader">
            <h3 class="section-name">${name}</h3>
            <div class="btn-group">
                <input type="color" class="section-color" value="${color || '#ffffff'}">
                <button class="btn-icon add-btn" title="Add Template"><i class="fas fa-pen"></i></button>
                <button class="btn-icon delete-btn"><i class="fas fa-trash"></i></button>
            </div>
</div>
            <div class="templates"></div>
        `;
        templates.forEach((template, templateIndex) => {
            if (!template.full.toLowerCase().includes(searchTerm))
                return
            const templateDiv = document.createElement('div');
            templateDiv.className = 'template';
            templateDiv.style.backgroundColor = template.color ? hexToRGB(template.color, 0.5) : `rgba(250, 250, 250, 0.3)`;
            templateDiv.innerHTML = `
                                <div class="template-text">${shortenText(template.full)}</div>
                                <div style="display:flex; column-gap:5px;">
                                <button class="btn-icon delete-btn" title="Delete Template"><i class="fas fa-trash"></i></button>
                                <input type="color" class="template-color" value="${template.color || '#ffffff'}"></div>
                                </div>
                            `;

            templateDiv.querySelector('.delete-btn').addEventListener('click', () => deleteTemplate(id, template.id));
            templateDiv.querySelector(".template-text").addEventListener('click', () => addScript(template.full));
            templateDiv.querySelector(".template-text").setAttribute(`data-tooltip`, template.full)
            templateDiv.querySelector('.template-color').addEventListener('change', (event) => changeTemplateColor(id, template.id, event.target.value));
            sectionDiv.querySelector('.templates').appendChild(templateDiv);

        });
        sectionDiv.querySelector('.section-color').addEventListener('change', (event) => changeSectionColor(id, event.target.value));
        sectionDiv.querySelector('.add-btn').addEventListener('click', () => {
            addTemplate(sectionDiv.dataset.id);
        });
        sectionDiv.querySelector('.delete-btn').addEventListener('click', () => {
            deleteSection(sectionDiv.dataset.id);
        });

        return sectionDiv;
    }

    function filterSections(searchTerm) {
        GM.getValue('sections', []).then(sections => {
            const content = document.getElementById('template-content');
            content.innerHTML = '';

            // Create a sortable list for sections
            const sortable = new Sortable(content, {
                handle: '.section-name',
                animation: 150,
                onEnd: (evt) => {
                    // Update sections order after drag and drop
                    const newSections = Array.from(content.children).map((child, index) => ({
                        id: child.dataset.id,
                        name: child.querySelector('.section-name').textContent.trim(),
                        templates: sections.find(sec => sec.id === child.dataset.id).templates,
                        pinned: sections.find(sec => sec.id === child.dataset.id).pinned,
                        color: sections.find(sec => sec.id === child.dataset.id).color,
                    }));
                    GM.setValue('sections', newSections);
                },
            });

            // Render sections
            sections.forEach((section, index) => {
                if (section.templates.some(template => template.full.toLowerCase().includes(searchTerm))) {
                    const sectionDiv = createFilteredSectionElement(section.name, section.id, section.templates, section.color, searchTerm);
                    content.appendChild(sectionDiv);
                }
            });
        })
    }
    function generateUUID() {
        // Генерация 16-байтового массива случайных чисел
        let array = new Uint8Array(16);
        window.crypto.getRandomValues(array);

        // Преобразование массива в строку UUID
        let uuid = '';
        for (let i = 0; i < array.length; i++) {
            if (i === 6) {
                // Установка версии UUID на 4
                uuid += (array[i] & 0x0f | 0x40).toString(16);
            } else if (i === 8) {
                // Установка флага варианта UUID
                uuid += (array[i] & 0x3f | 0x80).toString(16);
            } else {
                // Добавление символа "-" в нужных позициях
                if (i === 4 || i === 6 || i === 8 || i === 10) {
                    uuid += '-';
                }
                uuid += (array[i] & 0xff).toString(16).padStart(2, '0');
            }
        }
        return uuid;
    }

    function addSection() {
        const sectionName = prompt('Введите название раздела:');
        if (sectionName) {
            GM.getValue('sections', []).then(sections => {
                sections.push({ id: generateUUID(), name: sectionName, templates: [], pinned: false });
                GM.setValue('sections', sections).then(loadSections);
            });
        }
    }
    function addEmail() {
        const projectName = prompt('Введите название проекта:');
        const email = prompt('Введите почту проекта:');
        if (projectName) {
            GM.getValue('emails', {}).then(emails => {
                emails[projectName] = email;
                GM.setValue('emails', emails).then(loadSections);
            });
        }
    }

    function deleteSection(sectionIndex) {
        if (confirm('Вы уверены, что желаете удалить данный раздел?')) {
            GM.getValue('sections', []).then(sections => {
                const newSections = sections.filter(elem => elem.id !== sectionIndex)
                GM.setValue('sections', newSections).then(loadSections);
            });
        }
    }
    function pinSection(sectionID) {
        GM.getValue('sections', []).then(sections => {
            const newSections = sections.map(elem => {
                if (elem.id == sectionID) {
                    elem.pinned = !elem.pinned
                }
                return elem
            })
            GM.setValue('sections', newSections).then(loadSections);
        });
    }

    function addTemplate(sectionIndex) {
        const fullText = prompt('Введите шаблон:');
        if (fullText) {
            GM.getValue('sections', []).then(sections => {
                const newSections = sections.map(elem => {
                    if (elem.id == sectionIndex) {
                        elem.templates.push({ id: generateUUID(), full: fullText, pinned: false });
                    }
                    return elem
                })
                GM.setValue('sections', newSections).then(loadSections);
            });
        }
    }

    function deleteTemplate(sectionIndex, templateIndex) {
        if (confirm('Вы уверены, что желаете удалить данный шаблон?')) {
            GM.getValue('sections', []).then(sections => {
                const newSections = sections.map(elem => {
                    const section = elem
                    if (section.id == sectionIndex) {
                        const templates = elem.templates.filter(template => template.id !== templateIndex)
                        section.templates = templates
                    }
                    return section
                })
                GM.setValue('sections', newSections).then(loadSections);
            });
        }
    }

    function shortenText(text) {
        const maxLength = 90;
        if (text.length > maxLength) {
            return text.substring(0, maxLength - 3) + '...';
        }
        return text;
    }
    function changeSectionColor(sectionIndex, color) {
        GM.getValue('sections', []).then(sections => {
            const newSections = sections.map(elem => {
                if (elem.id == sectionIndex) {
                    elem.color = color
                }
                return elem
            })
            GM.setValue('sections', newSections).then(loadSections);
        });
    }
    async function addScript(text) {
    const textBox = document.querySelector('#message_field');
    let script;

    if (
        text.includes("ПОЧТА") ||
        text.includes("ЗЕРКАЛА") ||
        text.includes("ЗЕРКАЛО1") ||
        text.includes("ЗЕРКАЛО2") ||
        text.includes("ЗЕРКАЛО3")
    ) {
        const project = document.querySelectorAll(".el-card__body")[1].querySelector(".detail-value").textContent.split(" ")[0]
        const urls = await loadProjectUrls();
console.log(project)
        const emails = await loadProjectEmails();
        script = text
            .replace("ПОЧТА", emails[project])
            .replace("ЗЕРКАЛА", urls[project].join(", "))
            .replace("ЗЕРКАЛО1", urls[project][0])
            .replace("ЗЕРКАЛО2", urls[project][1])
            .replace("ЗЕРКАЛО3", urls[project][2]);
    } else {
        script = text;
    }

    textBox.focus();
    textBox.value +=" " + script; // добавляем с новой строки, если что-то уже есть
    textBox.dispatchEvent(new Event('input', { bubbles: true }));
    textBox.dispatchEvent(new Event('change', { bubbles: true }));
    }
    const copyText = async (text) => {
        let script
        if (text.includes("ПОЧТА") || text.includes("ЗЕРКАЛА")) {
            const project = document.querySelectorAll(".el-card__body")[1].querySelector(".detail-value").textContent.split(" ")[0]
            const urls = await loadProjectUrls()
            const emails = await loadProjectEmails()
            script = text.replace("ПОЧТА", emails[project])
            script = script.replace("ЗЕРКАЛА", urls[project].join(", "))
        } else {
            script = text
        }
        setTimeout(async () => console.log(
            await window.navigator.clipboard.writeText(script)), 100)
    }

    function changeTemplateColor(sectionIndex, templateIndex, color) {
        GM.getValue('sections', []).then(sections => {
            const newSections = sections.map(elem => {
                const section = elem
                if (section.id == sectionIndex) {
                    const newTemplates = elem.templates.map(template => {
                        if (template.id == templateIndex)
                            template.color = color
                        return template
                    })
                    section.templates = newTemplates
                }
                return section
            })

            GM.setValue('sections', newSections).then(loadSections);
        })
    }
    function createTooltip() {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        document.body.appendChild(tooltip);

        document.addEventListener('mouseover', function (event) {
            const target = event.target;
            const tooltipText = target.getAttribute('data-tooltip');
            if (tooltipText) {
                tooltip.innerText = tooltipText;
                tooltip.style.top = (target.getBoundingClientRect().top + window.scrollY) + 'px';
                tooltip.style.left = (target.getBoundingClientRect().right + 10 + window.scrollX) + 70 + 'px';
                tooltip.classList.add('show');
            }
        });

        document.addEventListener('mouseout', function (event) {
            tooltip.classList.remove('show');
        });

        document.addEventListener('mousemove', function (event) {
            if (tooltip.classList.contains('show')) {
                tooltip.style.top = (event.clientY + 10 + window.scrollY) + 'px';
                tooltip.style.left = (event.clientX + 10 + window.scrollX) + 'px';
            }
        });
    }
    async function extractProjectUrls() {
        const text = prompt("Введите зеркала")
        // Создаем объект для хранения URL по проектам
        const projectUrls = {};

        // Регулярное выражение для поиска проектов и их URL
        const projectPattern = /(\w+):\s*((?:https?:\/\/\S+,\s*)*https?:\/\/\S+)/g;

        let match;
        // Перебираем все совпадения регулярного выражения
        while ((match = projectPattern.exec(text)) !== null) {
            const projectName = match[1];
            const urls = match[2].split(',').map(url => url.trim());

            // Сохраняем URL по проектам
            projectUrls[projectName] = urls;
        }

        await GM.setValue('projectUrls', projectUrls);
        return 1
    }
    async function loadProjectUrls() {
        const projectUrls = await GM.getValue('projectUrls', {});
        return projectUrls;
    }
    async function loadProjectEmails() {
        const projectEmails = await GM.getValue('emails', {});
        return projectEmails;
    }
    function hexToRGB(hex, alpha) {
        var r = parseInt(hex.slice(1, 3), 16),
            g = parseInt(hex.slice(3, 5), 16),
            b = parseInt(hex.slice(5, 7), 16);

        if (alpha) {
            return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
        } else {
            return "rgb(" + r + ", " + g + ", " + b + ")";
        }
    }
};


scriptsHelper()