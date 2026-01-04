// ==UserScript==
// @name         To-Do List
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  To-Do list con modifica task, drag & drop, priorità, notifiche e temi
// @author       *ace*
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_notification
// @grant        window.focus
// @connect      self
// @downloadURL https://update.greasyfork.org/scripts/557272/To-Do%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/557272/To-Do%20List.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Carica i dati salvati
    let savedTodos = JSON.parse(GM_getValue('todos', '[]'));
    const savedPosition = GM_getValue('popupPosition', 'bottom-right');
    const savedTheme = GM_getValue('theme', 'light');

    // [NUOVO] Priorità task
    const priorities = [
        { name: 'Alta', color: '#f44336', value: 'high' },
        { name: 'Media', color: '#ff9800', value: 'medium' },
        { name: 'Bassa', color: '#4caf50', value: 'low' }
    ];

    // [NUOVO] Variabile per il drag & drop
    let draggedItem = null;

    // Crea il pulsante
    const button = document.createElement('button');
    button.textContent = '✓';
    button.style.position = 'fixed';
    button.style.zIndex = '9999';
    button.style.width = '40px';
    button.style.height = '40px';
    button.style.backgroundColor = '#6a5acd';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '50%';
    button.style.cursor = 'pointer';
    button.style.fontSize = '16px';
    button.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';

    // Crea il pop-up
    const popup = document.createElement('div');
    popup.style.position = 'fixed';
    popup.style.zIndex = '9999';
    popup.style.width = '320px';
    popup.style.borderRadius = '8px';
    popup.style.padding = '0';
    popup.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    popup.style.display = 'none';
    popup.style.fontFamily = 'Arial, sans-serif';
    popup.style.maxHeight = '500px';
    popup.style.overflow = 'hidden';
    popup.style.flexDirection = 'column';
    popup.style.backgroundColor = 'white';
    popup.style.transition = 'all 0.3s ease'; // [NUOVO] Animazione fluida

    // Header
    const header = document.createElement('div');
    header.style.padding = '12px 16px';
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.alignItems = 'center';
    header.style.fontWeight = 'bold';
    header.style.backgroundColor = '#6a5acd';
    header.style.color = 'white';

    const title = document.createElement('div');
    title.textContent = 'Todo List';

    const badge = document.createElement('div');
    badge.style.backgroundColor = 'rgba(255,255,255,0.2)';
    badge.style.color = 'white';
    badge.style.borderRadius = '10px';
    badge.style.padding = '2px 8px';
    badge.style.fontSize = '12px';

    const settingsIcon = document.createElement('button');
    settingsIcon.textContent = '⚙';
    settingsIcon.style.background = 'none';
    settingsIcon.style.border = 'none';
    settingsIcon.style.cursor = 'pointer';
    settingsIcon.style.fontSize = '16px';
    settingsIcon.style.marginLeft = '10px';
    settingsIcon.style.color = 'white';

    header.appendChild(title);
    header.appendChild(badge);
    header.appendChild(settingsIcon);
    popup.appendChild(header);

    // Menù impostazioni (nascosto)
    const settingsMenu = document.createElement('div');
    settingsMenu.style.margin = '10px 16px';
    settingsMenu.style.display = 'none';
    settingsMenu.style.padding = '12px';
    settingsMenu.style.borderRadius = '8px';
    settingsMenu.style.backgroundColor = '#f9f9f9';
    settingsMenu.style.gap = '12px';

    // Selettore tema
    const themeLabel = document.createElement('div');
    themeLabel.textContent = 'Tema:';
    themeLabel.style.fontSize = '12px';
    themeLabel.style.marginBottom = '6px';

    const themeButtons = document.createElement('div');
    themeButtons.style.display = 'flex';
    themeButtons.style.gap = '8px';

    const lightThemeButton = document.createElement('button');
    lightThemeButton.textContent = '☀ Chiaro';
    lightThemeButton.style.padding = '4px 10px';
    lightThemeButton.style.borderRadius = '16px';
    lightThemeButton.style.border = 'none';
    lightThemeButton.style.cursor = 'pointer';
    lightThemeButton.style.fontSize = '12px';

    const darkThemeButton = document.createElement('button');
    darkThemeButton.textContent = '🌙 Scuro';
    darkThemeButton.style.padding = '4px 10px';
    darkThemeButton.style.borderRadius = '16px';
    darkThemeButton.style.border = 'none';
    darkThemeButton.style.cursor = 'pointer';
    darkThemeButton.style.fontSize = '12px';

    themeButtons.appendChild(lightThemeButton);
    themeButtons.appendChild(darkThemeButton);

    // Selettore posizione
    const positionLabel = document.createElement('div');
    positionLabel.textContent = 'Posizione:';
    positionLabel.style.fontSize = '12px';
    positionLabel.style.marginTop = '12px';

    const positionButtons = document.createElement('div');
    positionButtons.style.display = 'flex';
    positionButtons.style.gap = '6px';
    positionButtons.style.flexWrap = 'wrap';
    positionButtons.style.marginTop = '6px';

    const positions = [
        { value: 'top-left', label: '↖' },
        { value: 'top-right', label: '↗' },
        { value: 'bottom-left', label: '↙' },
        { value: 'bottom-right', label: '↘' }
    ];

    positions.forEach(pos => {
        const posButton = document.createElement('button');
        posButton.textContent = pos.label;
        posButton.style.padding = '4px 8px';
        posButton.style.borderRadius = '16px';
        posButton.style.border = 'none';
        posButton.style.cursor = 'pointer';
        posButton.style.fontSize = '12px';
        posButton.dataset.value = pos.value;
        positionButtons.appendChild(posButton);
    });

    settingsMenu.appendChild(themeLabel);
    settingsMenu.appendChild(themeButtons);
    settingsMenu.appendChild(positionLabel);
    settingsMenu.appendChild(positionButtons);
    popup.appendChild(settingsMenu);

    // Barre di ricerca
    const searchContainer = document.createElement('div');
    searchContainer.style.padding = '8px 16px';
    searchContainer.style.display = 'flex';
    searchContainer.style.gap = '8px';

    const searchIcon = document.createElement('div');
    searchIcon.textContent = '🔍';
    searchIcon.style.fontSize = '16px';
    searchIcon.style.display = 'flex';
    searchIcon.style.alignItems = 'center';

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Cerca task...';
    searchInput.style.flexGrow = '1';
    searchInput.style.padding = '8px 12px';
    searchInput.style.borderRadius = '20px';
    searchInput.style.border = '1px solid #ccc';
    searchInput.style.fontSize = '14px';

    searchContainer.appendChild(searchIcon);
    searchContainer.appendChild(searchInput);
    popup.appendChild(searchContainer);

    // Lista task
    const list = document.createElement('div');
    list.id = 'todo-list';
    list.style.flexGrow = '1';
    list.style.overflowY = 'auto';
    list.style.padding = '8px 0';
    popup.appendChild(list);

    // Input nuovo task
    const inputContainer = document.createElement('div');
    inputContainer.style.padding = '12px 16px';
    inputContainer.style.borderTop = '1px solid #e0e0e0';
    inputContainer.style.display = 'flex';
    inputContainer.style.flexDirection = 'column';
    inputContainer.style.gap = '8px';

    const newTaskInput = document.createElement('input');
    newTaskInput.type = 'text';
    newTaskInput.placeholder = 'Nuovo task...';
    newTaskInput.style.padding = '10px 12px';
    newTaskInput.style.borderRadius = '20px';
    newTaskInput.style.border = '1px solid #ccc';
    newTaskInput.style.fontSize = '14px';

    // Tag colorati
    const tagContainer = document.createElement('div');
    tagContainer.style.display = 'flex';
    tagContainer.style.gap = '6px';
    tagContainer.style.flexWrap = 'wrap';

    const tags = [
        { name: 'Lavoro', color: '#2196F3' },
        { name: 'Personale', color: '#4CAF50' },
        { name: 'Studio', color: '#FF9800' },
        { name: 'Altro', color: '#9C27B0' }
    ];

    let selectedTag = 'Lavoro';

    tags.forEach(tag => {
        const tagButton = document.createElement('button');
        tagButton.textContent = tag.name;
        tagButton.style.padding = '4px 10px';
        tagButton.style.borderRadius = '16px';
        tagButton.style.border = 'none';
        tagButton.style.cursor = 'pointer';
        tagButton.style.fontSize = '12px';
        tagButton.style.backgroundColor = tag.color;
        tagButton.style.color = 'white';
        tagButton.dataset.tag = tag.name;
        tagContainer.appendChild(tagButton);
    });

    // [NUOVO] Selettore priorità
    const priorityContainer = document.createElement('div');
    priorityContainer.style.display = 'flex';
    priorityContainer.style.gap = '6px';
    priorityContainer.style.flexWrap = 'wrap';
    priorityContainer.style.marginTop = '6px';

    let selectedPriority = 'medium'; // Default

    priorities.forEach(priority => {
        const priorityButton = document.createElement('button');
        priorityButton.textContent = priority.name;
        priorityButton.style.padding = '4px 10px';
        priorityButton.style.borderRadius = '16px';
        priorityButton.style.border = 'none';
        priorityButton.style.cursor = 'pointer';
        priorityButton.style.fontSize = '12px';
        priorityButton.style.backgroundColor = priority.color;
        priorityButton.style.color = 'white';
        priorityButton.dataset.priority = priority.value;
        priorityContainer.appendChild(priorityButton);
    });

    // Data e pulsante aggiungi
    const dateContainer = document.createElement('div');
    dateContainer.style.display = 'flex';
    dateContainer.style.gap = '8px';

    const calendarIcon = document.createElement('button');
    calendarIcon.textContent = '📅';
    calendarIcon.style.padding = '6px';
    calendarIcon.style.borderRadius = '50%';
    calendarIcon.style.border = 'none';
    calendarIcon.style.cursor = 'pointer';
    calendarIcon.style.fontSize = '12px';

    const inputDate = document.createElement('input');
    inputDate.type = 'date';
    inputDate.style.display = 'none';
    inputDate.style.padding = '8px 12px';
    inputDate.style.borderRadius = '20px';
    inputDate.style.border = '1px solid #ccc';
    inputDate.style.flexGrow = '1';
    inputDate.style.fontSize = '14px';

    const addButton = document.createElement('button');
    addButton.textContent = 'Aggiungi';
    addButton.style.padding = '8px 16px';
    addButton.style.borderRadius = '20px';
    addButton.style.border = 'none';
    addButton.style.cursor = 'pointer';
    addButton.style.backgroundColor = '#6a5acd';
    addButton.style.color = 'white';
    addButton.style.fontSize = '14px';

    dateContainer.appendChild(calendarIcon);
    dateContainer.appendChild(inputDate);
    dateContainer.appendChild(addButton);

    inputContainer.appendChild(newTaskInput);
    inputContainer.appendChild(tagContainer);
    inputContainer.appendChild(priorityContainer); // [NUOVO]
    inputContainer.appendChild(dateContainer);
    popup.appendChild(inputContainer);

    // Pulsante "Cancella tutto"
    const clearButton = document.createElement('button');
    clearButton.textContent = 'Cancella tutto';
    clearButton.style.margin = '8px 16px 12px';
    clearButton.style.padding = '8px 16px';
    clearButton.style.borderRadius = '20px';
    clearButton.style.border = 'none';
    clearButton.style.cursor = 'pointer';
    clearButton.style.backgroundColor = '#f44336';
    clearButton.style.color = 'white';
    clearButton.style.fontSize = '14px';

    popup.appendChild(clearButton);

    // Aggiungi al body
    document.body.appendChild(button);
    document.body.appendChild(popup);

    // Applica il tema
    applyTheme(savedTheme);
    updatePopupPosition();

    // Funzione per applicare il tema
    function applyTheme(theme) {
        if (theme === 'dark') {
            popup.style.backgroundColor = '#2d2d3a';
            popup.style.color = '#e0e0e0';
            popup.style.border = '1px solid #6a5acd';
            header.style.backgroundColor = '#6a5acd';
            header.style.color = 'white';
            badge.style.backgroundColor = 'rgba(255,255,255,0.2)';
            badge.style.color = 'white';
            settingsMenu.style.backgroundColor = '#3a3a4a';
            newTaskInput.style.backgroundColor = '#3a3a4a';
            newTaskInput.style.color = '#e0e0e0';
            newTaskInput.style.borderColor = '#6a5acd';
            searchInput.style.backgroundColor = '#3a3a4a';
            searchInput.style.color = '#e0e0e0';
            searchInput.style.borderColor = '#6a5acd';
            inputDate.style.backgroundColor = '#3a3a4a';
            inputDate.style.color = '#e0e0e0';
            inputDate.style.borderColor = '#6a5acd';
            lightThemeButton.style.backgroundColor = '#444';
            lightThemeButton.style.color = 'white';
            darkThemeButton.style.backgroundColor = '#6a5acd';
            darkThemeButton.style.color = 'white';
            list.style.backgroundColor = '#2d2d3a';
        } else {
            popup.style.backgroundColor = 'white';
            popup.style.color = '#333';
            popup.style.border = '1px solid #e0e0e0';
            header.style.backgroundColor = '#6a5acd';
            header.style.color = 'white';
            badge.style.backgroundColor = 'rgba(255,255,255,0.2)';
            badge.style.color = 'white';
            settingsMenu.style.backgroundColor = '#f9f9f9';
            newTaskInput.style.backgroundColor = 'white';
            newTaskInput.style.color = '#333';
            newTaskInput.style.borderColor = '#ccc';
            searchInput.style.backgroundColor = 'white';
            searchInput.style.color = '#333';
            searchInput.style.borderColor = '#ccc';
            inputDate.style.backgroundColor = 'white';
            inputDate.style.color = '#333';
            inputDate.style.borderColor = '#ccc';
            lightThemeButton.style.backgroundColor = '#6a5acd';
            lightThemeButton.style.color = 'white';
            darkThemeButton.style.backgroundColor = '#444';
            darkThemeButton.style.color = 'white';
            list.style.backgroundColor = 'white';
        }
    }

    // Aggiorna posizione
    function updatePopupPosition() {
        const position = GM_getValue('popupPosition', 'bottom-right');
        positionButtons.querySelectorAll('button').forEach(btn => {
            btn.style.backgroundColor = btn.dataset.value === position ? '#6a5acd' : '#e0e0e0';
            btn.style.color = btn.dataset.value === position ? 'white' : '#333';
        });

        switch(position) {
            case 'top-left':
                popup.style.top = '20px';
                popup.style.left = '20px';
                button.style.top = '50px';
                button.style.left = '20px';
                break;
            case 'top-right':
                popup.style.top = '20px';
                popup.style.right = '20px';
                button.style.top = '50px';
                button.style.right = '20px';
                break;
            case 'bottom-left':
                popup.style.bottom = '20px';
                popup.style.left = '20px';
                button.style.bottom = '20px';
                button.style.left = '20px';
                break;
            case 'bottom-right':
                popup.style.bottom = '20px';
                popup.style.right = '20px';
                button.style.bottom = '20px';
                button.style.right = '20px';
                break;
        }
    }

    // Carica i task
    function loadTodos() {
        list.innerHTML = '';
        const searchTerm = searchInput.value.toLowerCase();
        savedTodos
            .filter(todo =>
                todo.text.toLowerCase().includes(searchTerm) ||
                todo.category.toLowerCase().includes(searchTerm) ||
                (todo.date && todo.date.includes(searchTerm))
            )
            .forEach((todo, index) => {
                addTodoToList(todo.text, todo.date, todo.category, todo.priority, index, todo.completed);
            });
        updateBadge();
        checkExpiredTasks();
    }

    // [NUOVO] Funzione per modificare una task
    function editTodo(index, newText) {
        savedTodos[index].text = newText;
        GM_setValue('todos', JSON.stringify(savedTodos));
        loadTodos();
    }

    // [NUOVO] Funzione per gestire il drag & drop
    function handleDragStart(e, index) {
        draggedItem = index;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', e.target);
    }

    function handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }

    function handleDrop(e, dropIndex) {
        e.preventDefault();
        if (draggedItem !== null && draggedItem !== dropIndex) {
            const draggedTodo = savedTodos[draggedItem];
            savedTodos.splice(draggedItem, 1);
            savedTodos.splice(dropIndex, 0, draggedTodo);
            GM_setValue('todos', JSON.stringify(savedTodos));
            loadTodos();
        }
    }

    // Aggiungi task alla lista
    function addTodoToList(text, date, category, priority, index, completed) {
        const todoItem = document.createElement('div');
        todoItem.style.display = 'flex';
        todoItem.style.alignItems = 'center';
        todoItem.style.padding = '12px 16px';
        todoItem.style.borderBottom = '1px solid rgba(0,0,0,0.1)';
        todoItem.draggable = true; // [NUOVO] Abilita drag & drop

        // [NUOVO] Eventi drag & drop
        todoItem.addEventListener('dragstart', (e) => handleDragStart(e, index));
        todoItem.addEventListener('dragover', handleDragOver);
        todoItem.addEventListener('drop', (e) => handleDrop(e, index));

        const todoText = document.createElement('span');
        todoText.textContent = text;
        todoText.style.flexGrow = '1';
        todoText.style.fontSize = '14px';
        todoText.style.cursor = 'pointer'; // [NUOVO] Cursore per indicare che è cliccabile
        todoText.style.wordBreak = 'break-word'; // [NUOVO] Testo su più righe
        if (completed) {
            todoText.style.textDecoration = 'line-through';
            todoText.style.opacity = '0.7';
        }

        // [NUOVO] Modifica task al click
        todoText.onclick = () => {
            const newText = prompt('Modifica task:', text);
            if (newText !== null && newText.trim() !== '') {
                editTodo(index, newText.trim());
            }
        };

        // [NUOVO] Indicatore priorità
        const todoPriority = document.createElement('span');
        todoPriority.style.width = '8px';
        todoPriority.style.height = '8px';
        todoPriority.style.borderRadius = '50%';
        todoPriority.style.marginRight = '8px';
        todoPriority.style.backgroundColor = priorities.find(p => p.value === priority)?.color || '#888';

        const todoTag = document.createElement('span');
        todoTag.textContent = category;
        todoTag.style.padding = '4px 8px';
        todoTag.style.borderRadius = '12px';
        todoTag.style.fontSize = '12px';
        todoTag.style.marginLeft = '8px';
        todoTag.style.color = 'white';
        todoTag.style.backgroundColor = tags.find(t => t.name === category)?.color || '#888';

        const todoDate = document.createElement('span');
        todoDate.textContent = date ? ` (${date})` : '';
        todoDate.style.fontSize = '12px';
        todoDate.style.color = '#888';
        todoDate.style.marginLeft = '8px';

        const deleteButton = document.createElement('button');
        deleteButton.textContent = '✕';
        deleteButton.style.background = 'none';
        deleteButton.style.border = 'none';
        deleteButton.style.color = '#ff8888';
        deleteButton.style.cursor = 'pointer';
        deleteButton.style.fontSize = '16px';
        deleteButton.style.marginRight = '8px';

        const doneButton = document.createElement('button');
        doneButton.style.width = '22px';
        doneButton.style.height = '22px';
        doneButton.style.minWidth = '22px';
        doneButton.style.minHeight = '22px';
        doneButton.style.borderRadius = '50%';
        doneButton.style.border = 'none';
        doneButton.style.cursor = 'pointer';
        doneButton.style.backgroundColor = completed ? '#4CAF50' : '#e0e0e0';
        doneButton.style.color = completed ? 'white' : 'transparent';
        doneButton.style.display = 'flex';
        doneButton.style.alignItems = 'center';
        doneButton.style.justifyContent = 'center';
        doneButton.textContent = completed ? '✓' : '';

        deleteButton.onclick = (e) => {
            e.stopPropagation();
            savedTodos.splice(index, 1);
            GM_setValue('todos', JSON.stringify(savedTodos));
            todoItem.remove();
            updateBadge();
        };

        doneButton.onclick = (e) => {
            e.stopPropagation();
            savedTodos[index].completed = !completed;
            GM_setValue('todos', JSON.stringify(savedTodos));
            todoItem.remove();
            addTodoToList(text, date, category, priority, index, !completed);
        };

        todoItem.appendChild(todoPriority); // [NUOVO]
        todoItem.appendChild(todoText);
        todoItem.appendChild(todoTag);
        todoItem.appendChild(todoDate);
        todoItem.appendChild(deleteButton);
        todoItem.appendChild(doneButton);
        list.appendChild(todoItem);
    }

    // Controlla task scadute
    function checkExpiredTasks() {
        const now = new Date();
        savedTodos.forEach(todo => {
            if (todo.date && !todo.completed) {
                const taskDate = new Date(todo.date);
                if (taskDate < now) {
                    showNotification(
                        `⏰ Task scaduta: "${todo.text}"`,
                        `La task "${todo.text}" (${todo.category}) è scaduta il ${todo.date}.`
                    );
                }
            }
        });
    }

    // Notifica
    function showNotification(title, text) {
        GM_notification({
            title: title,
            text: text,
            timeout: 5000,
            onclick: () => {
                popup.style.display = 'flex';
                window.focus();
            }
        });
    }

    // Aggiorna badge
    function updateBadge() {
        badge.textContent = savedTodos.length;
    }

    // Aggiungi nuovo task
    function addTodo() {
        const text = newTaskInput.value.trim();
        const date = inputDate.value;
        if (text) {
            savedTodos.push({
                text,
                date,
                category: selectedTag,
                priority: selectedPriority, // [NUOVO]
                completed: false
            });
            GM_setValue('todos', JSON.stringify(savedTodos));
            addTodoToList(text, date, selectedTag, selectedPriority, savedTodos.length - 1, false);
            newTaskInput.value = '';
            inputDate.value = '';
            updateBadge();
            checkExpiredTasks();
        }
    }

    // Event listeners
    settingsIcon.onclick = (e) => {
        e.stopPropagation();
        settingsMenu.style.display = settingsMenu.style.display === 'none' ? 'flex' : 'none';
    };

    lightThemeButton.onclick = (e) => {
        e.stopPropagation();
        GM_setValue('theme', 'light');
        applyTheme('light');
    };

    darkThemeButton.onclick = (e) => {
        e.stopPropagation();
        GM_setValue('theme', 'dark');
        applyTheme('dark');
    };

    positionButtons.querySelectorAll('button').forEach(btn => {
        btn.onclick = (e) => {
            e.stopPropagation();
            GM_setValue('popupPosition', btn.dataset.value);
            updatePopupPosition();
        };
    });

    tagContainer.querySelectorAll('button').forEach(btn => {
        btn.onclick = (e) => {
            e.stopPropagation();
            selectedTag = btn.dataset.tag;
            tagContainer.querySelectorAll('button').forEach(b => {
                b.style.opacity = b.dataset.tag === selectedTag ? '1' : '0.6';
            });
        };
    });

    // [NUOVO] Selettore priorità
    priorityContainer.querySelectorAll('button').forEach(btn => {
        btn.onclick = (e) => {
            e.stopPropagation();
            selectedPriority = btn.dataset.priority;
            priorityContainer.querySelectorAll('button').forEach(b => {
                b.style.opacity = b.dataset.priority === selectedPriority ? '1' : '0.6';
            });
        };
    });

    calendarIcon.onclick = (e) => {
        e.stopPropagation();
        inputDate.style.display = inputDate.style.display === 'none' ? 'block' : 'none';
    };

    searchInput.oninput = loadTodos;
    addButton.onclick = (e) => {
        e.stopPropagation();
        addTodo();
    };
    newTaskInput.onkeypress = (e) => {
        if (e.key === 'Enter') addTodo();
    };

    clearButton.onclick = (e) => {
        e.stopPropagation();
        if (confirm('Cancellare tutte le task?')) {
            GM_deleteValue('todos');
            savedTodos = [];
            list.innerHTML = '';
            updateBadge();
        }
    };

    button.onclick = () => {
        popup.style.display = popup.style.display === 'flex' ? 'none' : 'flex';
        if (popup.style.display === 'flex') loadTodos();
    };

    document.addEventListener('click', (e) => {
        if (!popup.contains(e.target) && e.target !== button) {
            popup.style.display = 'none';
        }
    });

    // Inizializza
    tagContainer.querySelector('[data-tag="Lavoro"]').style.opacity = '1';
    priorityContainer.querySelector('[data-priority="medium"]').style.opacity = '1'; // [NUOVO]
    loadTodos();
})();