// ==UserScript==
// @name         NexusScript
// @name:ru      NexusScript для форума Nexus
// @description  Улучшенный скрипт для форума Nexus с шаблонами сообщений
// @description:ru Добавляет плавающую кнопку для быстрого доступа к шаблонам сообщений
// @namespace    https://greasyfork.org/users/1074007-renat2009
// @version      1.1.0
// @author       renat2009
// @match        https://forum.keeper-nexus.com/threads/*
// @grant        none
// @license      MIT
// @icon         https://img.icons8.com/color/96/000000/script.png
// @downloadURL https://update.greasyfork.org/scripts/562982/NexusScript.user.js
// @updateURL https://update.greasyfork.org/scripts/562982/NexusScript.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Инициализация базы данных
    let db = JSON.parse(localStorage.getItem('nexus_v17_db')) || {
        folders: [
            { 
                id: 111, 
                name: 'Общие', 
                templates: [
                    { id: 1, title: "Приветствие", content: "Здравствуйте!\n\n" },
                    { id: 2, title: "Благодарность", content: "Спасибо за помощь!\n\n" }
                ] 
            },
            { 
                id: 222, 
                name: 'Технические', 
                templates: [] 
            }
        ],
        activeFolderId: 111
    };

    let floatBtn = null;
    let isPanelOpen = false;
    let panel = null;

    // Стили
    const styles = `
        .nx-float-btn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 99999;
            background: linear-gradient(135deg, #FFA500, #FF8C00);
            color: #000;
            border: 2px solid #000;
            padding: 12px 24px;
            border-radius: 50px;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 6px 20px rgba(0,0,0,0.3);
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 16px;
            min-width: 120px;
            justify-content: center;
        }
        .nx-float-btn:hover {
            background: linear-gradient(135deg, #FF8C00, #FF7F00);
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.4);
        }
        .nx-float-btn:active {
            transform: translateY(0);
        }
        .nx-float-btn-icon {
            font-size: 22px;
            animation: pulse 2s infinite;
        }
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
        
        /* Панель шаблонов */
        .nx-panel {
            position: fixed;
            bottom: 80px;
            right: 20px;
            z-index: 99998;
            background: #ffffff;
            border: 2px solid #333;
            border-radius: 12px;
            padding: 20px;
            width: 350px;
            max-height: 500px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            display: none;
            overflow: hidden;
        }
        .nx-panel.open {
            display: block;
            animation: slideIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
        @keyframes slideIn {
            from { opacity: 0; transform: translateY(30px) scale(0.9); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }
        
        .nx-panel-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 2px solid #eee;
        }
        .nx-panel-title {
            font-weight: bold;
            font-size: 18px;
            color: #333;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .nx-close-btn {
            background: #ff4444;
            color: white;
            border: none;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.2s;
        }
        .nx-close-btn:hover {
            background: #ff0000;
        }
        
        .nx-folders {
            display: flex;
            gap: 8px;
            margin-bottom: 15px;
            flex-wrap: wrap;
        }
        .nx-folder-btn {
            padding: 6px 12px;
            background: #f0f0f0;
            border: 1px solid #ddd;
            border-radius: 6px;
            cursor: pointer;
            font-size: 13px;
            transition: all 0.2s;
        }
        .nx-folder-btn:hover {
            background: #e0e0e0;
        }
        .nx-folder-btn.active {
            background: #FFA500;
            color: black;
            font-weight: bold;
            border-color: #FF8C00;
        }
        
        .nx-templates-list {
            max-height: 300px;
            overflow-y: auto;
            margin-bottom: 15px;
            border: 1px solid #eee;
            border-radius: 8px;
            padding: 5px;
        }
        .nx-template-item {
            padding: 10px;
            border-bottom: 1px solid #f5f5f5;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: background 0.2s;
        }
        .nx-template-item:hover {
            background: #f9f9f9;
        }
        .nx-template-item:last-child {
            border-bottom: none;
        }
        .nx-template-title {
            font-weight: bold;
            color: #333;
        }
        .nx-template-preview {
            font-size: 12px;
            color: #666;
            margin-top: 3px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 200px;
        }
        .nx-template-use {
            background: #4CAF50;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            transition: background 0.2s;
        }
        .nx-template-use:hover {
            background: #45a049;
        }
        
        .nx-add-template {
            background: #2196F3;
            color: white;
            border: none;
            padding: 10px;
            border-radius: 6px;
            cursor: pointer;
            width: 100%;
            font-weight: bold;
            transition: background 0.2s;
            margin-top: 10px;
        }
        .nx-add-template:hover {
            background: #0b7dda;
        }
        
        /* Уведомления */
        .nx-notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 12px 24px;
            border-radius: 6px;
            z-index: 100000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: fadeInOut 3s ease;
        }
        @keyframes fadeInOut {
            0%, 100% { opacity: 0; transform: translateY(-20px); }
            10%, 90% { opacity: 1; transform: translateY(0); }
        }
    `;

    // Функции
    function saveDB() {
        localStorage.setItem('nexus_v17_db', JSON.stringify(db));
    }

    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'nx-notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    function getActiveFolder() {
        return db.folders.find(f => f.id === db.activeFolderId);
    }

    function createFloatButton() {
        if (floatBtn) return;
        
        floatBtn = document.createElement('div');
        floatBtn.className = 'nx-float-btn';
        floatBtn.innerHTML = '<span class="nx-float-btn-icon">⚡</span> Nexus';
        floatBtn.title = 'Открыть панель шаблонов (Ctrl+Shift+X)';
        
        floatBtn.addEventListener('click', togglePanel);
        document.body.appendChild(floatBtn);
        
        // Горячая клавиша
        document.addEventListener('keydown', function(e) {
            if (e.ctrlKey && e.shiftKey && e.key === 'X') {
                e.preventDefault();
                togglePanel();
            }
        });
    }

    function createPanel() {
        panel = document.createElement('div');
        panel.className = 'nx-panel';
        
        panel.innerHTML = `
            <div class="nx-panel-header">
                <div class="nx-panel-title">📁 Шаблоны сообщений</div>
                <button class="nx-close-btn">×</button>
            </div>
            <div class="nx-folders" id="nxFolders"></div>
            <div class="nx-templates-list" id="nxTemplates"></div>
            <button class="nx-add-template" id="nxAddTemplate">+ Добавить шаблон</button>
        `;
        
        document.body.appendChild(panel);
        
        // Закрытие
        panel.querySelector('.nx-close-btn').addEventListener('click', () => {
            isPanelOpen = false;
            panel.classList.remove('open');
        });
        
        // Добавление шаблона
        panel.querySelector('#nxAddTemplate').addEventListener('click', addTemplate);
        
        renderFolders();
        renderTemplates();
    }

    function togglePanel() {
        if (!panel) createPanel();
        
        isPanelOpen = !isPanelOpen;
        if (isPanelOpen) {
            panel.classList.add('open');
            renderTemplates();
        } else {
            panel.classList.remove('open');
        }
    }

    function renderFolders() {
        const container = document.getElementById('nxFolders');
        if (!container) return;
        
        container.innerHTML = '';
        
        db.folders.forEach(folder => {
            const btn = document.createElement('button');
            btn.className = `nx-folder-btn ${folder.id === db.activeFolderId ? 'active' : ''}`;
            btn.textContent = folder.name;
            btn.addEventListener('click', () => {
                db.activeFolderId = folder.id;
                saveDB();
                renderFolders();
                renderTemplates();
            });
            container.appendChild(btn);
        });
        
        // Кнопка добавления папки
        const addBtn = document.createElement('button');
        addBtn.className = 'nx-folder-btn';
        addBtn.textContent = '+ Папка';
        addBtn.title = 'Добавить папку';
        addBtn.addEventListener('click', () => {
            const name = prompt('Название новой папки:');
            if (name && name.trim()) {
                const newFolder = {
                    id: Date.now(),
                    name: name.trim(),
                    templates: []
                };
                db.folders.push(newFolder);
                saveDB();
                renderFolders();
                showNotification('Папка добавлена!');
            }
        });
        container.appendChild(addBtn);
    }

    function renderTemplates() {
        const container = document.getElementById('nxTemplates');
        const folder = getActiveFolder();
        
        if (!container || !folder) return;
        
        container.innerHTML = '';
        
        if (folder.templates.length === 0) {
            container.innerHTML = '<div style="text-align:center; color:#999; padding:30px 20px; font-style:italic;">Пока нет шаблонов в этой папке</div>';
            return;
        }
        
        folder.templates.forEach(template => {
            const item = document.createElement('div');
            item.className = 'nx-template-item';
            
            item.innerHTML = `
                <div style="flex: 1; min-width: 0;">
                    <div class="nx-template-title">${template.title}</div>
                    <div class="nx-template-preview">${template.content.replace(/\n/g, ' ').substring(0, 50)}${template.content.length > 50 ? '...' : ''}</div>
                </div>
                <button class="nx-template-use" data-id="${template.id}" title="Вставить в сообщение">Вставить</button>
            `;
            
            container.appendChild(item);
            
            // Вставка шаблона
            item.querySelector('.nx-template-use').addEventListener('click', (e) => {
                e.stopPropagation();
                insertTemplate(template.id);
            });
            
            // Редактирование по клику
            item.addEventListener('click', () => {
                editTemplate(template.id);
            });
        });
    }

    function addTemplate() {
        const title = prompt('Название шаблона:', 'Новый шаблон');
        if (!title || !title.trim()) return;
        
        const content = prompt('Текст шаблона:', 'Введите текст шаблона здесь...');
        if (!content || !content.trim()) return;
        
        const folder = getActiveFolder();
        const newTemplate = {
            id: Date.now(),
            title: title.trim(),
            content: content.trim()
        };
        
        folder.templates.push(newTemplate);
        saveDB();
        renderTemplates();
        showNotification('Шаблон добавлен!');
    }

    function editTemplate(templateId) {
        const folder = getActiveFolder();
        const template = folder.templates.find(t => t.id === templateId);
        if (!template) return;
        
        const newTitle = prompt('Новое название:', template.title);
        if (newTitle === null) return;
        
        const newContent = prompt('Новый текст:', template.content);
        if (newContent === null) return;
        
        template.title = newTitle.trim();
        template.content = newContent.trim();
        saveDB();
        renderTemplates();
        showNotification('Шаблон обновлён!');
    }

    function insertTemplate(templateId) {
        const folder = getActiveFolder();
        const template = folder.templates.find(t => t.id === templateId);
        if (!template) return;
        
        // Ищем поле ввода на странице форума
        const textarea = document.querySelector('textarea[name="message"]') || 
                         document.querySelector('textarea.bbCodeEditor') ||
                         document.querySelector('.fr-element.fr-view') ||
                         document.querySelector('[contenteditable="true"]');
        
        if (textarea) {
            if (textarea.tagName === 'TEXTAREA') {
                textarea.value += template.content;
                textarea.dispatchEvent(new Event('input', { bubbles: true }));
                textarea.focus();
            } else if (textarea.isContentEditable || textarea.contentEditable === 'true') {
                textarea.focus();
                document.execCommand('insertText', false, template.content);
            }
            showNotification('Шаблон "' + template.title + '" вставлен!');
            
            // Закрываем панель после вставки
            if (isPanelOpen) {
                togglePanel();
            }
        } else {
            showNotification('Не найдено поле для ввода текста');
        }
    }

    // Инициализация
    function init() {
        // Добавляем стили
        const styleEl = document.createElement('style');
        styleEl.textContent = styles;
        document.head.appendChild(styleEl);
        
        // Создаем кнопку
        setTimeout(() => {
            createFloatButton();
        }, 1000);
        
        console.log('⚡ NexusScript v1.1.0 успешно загружен!');
    }

    // Запуск
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();