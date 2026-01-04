// ==UserScript==
// @name		Drawaria Word Office - Text Editor
// @description Word-style text editor: format text, insert images/tables, auto-save, all from the userscript menu.
// @version		1.0
// @match		https://drawaria.online/*
// @match		https://*.drawaria.online/*
// @icon		https://drawaria.online/favicon-32x32.png
// @grant       GM.setValue
// @grant       GM.getValue
// @grant       GM_registerMenuCommand
// @license MIT
// @namespace https://greasyfork.org/users/1088100
// @downloadURL https://update.greasyfork.org/scripts/550414/Drawaria%20Word%20Office%20-%20Text%20Editor.user.js
// @updateURL https://update.greasyfork.org/scripts/550414/Drawaria%20Word%20Office%20-%20Text%20Editor.meta.js
// ==/UserScript==
(function() {
    'use strict';

    console.log('Drawaria Word Processor initializing...');

    // Debounce function for performance optimization
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Function to create the Word-like text editor
    function createWordEditor() {
        console.log('Creating Word editor interface...');

        // Create main editor container
        const editorContainer = document.createElement('div');
        editorContainer.id = 'word-editor-container';
        editorContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 900px;
            height: 700px;
            background: #ffffff;
            border: 2px solid #d1d5db;
            border-radius: 12px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            z-index: 10000;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            display: flex;
            flex-direction: column;
            resize: both;
            overflow: hidden;
            min-width: 600px;
            min-height: 400px;
        `;

        // Create title bar
        const titleBar = document.createElement('div');
        titleBar.id = 'word-editor-titlebar';
        titleBar.style.cssText = `
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 12px 20px;
            font-weight: 600;
            font-size: 16px;
            border-radius: 10px 10px 0 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: move;
        `;
        titleBar.innerHTML = `
            <span>📝 Drawaria Word Office</span>
            <div>
                <button id="minimize-editor" style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 4px 8px; border-radius: 4px; margin-right: 8px; cursor: pointer;">−</button>
                <button id="close-editor" style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 4px 8px; border-radius: 4px; cursor: pointer;">×</button>
            </div>
        `;

        // Create toolbar
        const toolbar = document.createElement('div');
        toolbar.id = 'word-editor-toolbar';
        toolbar.style.cssText = `
            background: #f8fafc;
            border-bottom: 1px solid #e2e8f0;
            padding: 12px;
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            align-items: center;
        `;

        // Toolbar HTML with comprehensive formatting options
        toolbar.innerHTML = `
            <div style="display: flex; gap: 4px; align-items: center; margin-right: 12px;">
                <button class="toolbar-btn" data-command="undo" title="Undo">↶</button>
                <button class="toolbar-btn" data-command="redo" title="Redo">↷</button>
            </div>

            <div style="width: 1px; height: 24px; background: #cbd5e0; margin: 0 8px;"></div>

            <div style="display: flex; gap: 4px; align-items: center; margin-right: 12px;">
                <select id="font-family" style="padding: 4px 8px; border: 1px solid #cbd5e0; border-radius: 4px; font-size: 12px;">
                    <option value="Arial">Arial</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Helvetica">Helvetica</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Verdana">Verdana</option>
                    <option value="Courier New">Courier New</option>
                    <option value="Comic Sans MS">Comic Sans MS</option>
                </select>

                <select id="font-size" style="padding: 4px 8px; border: 1px solid #cbd5e0; border-radius: 4px; font-size: 12px; width: 60px;">
                    <option value="1">8</option>
                    <option value="2">10</option>
                    <option value="3" selected>12</option>
                    <option value="4">14</option>
                    <option value="5">18</option>
                    <option value="6">24</option>
                    <option value="7">36</option>
                </select>
            </div>

            <div style="width: 1px; height: 24px; background: #cbd5e0; margin: 0 8px;"></div>

            <div style="display: flex; gap: 4px; align-items: center; margin-right: 12px;">
                <button class="toolbar-btn format-btn" data-command="bold" title="Bold"><b>B</b></button>
                <button class="toolbar-btn format-btn" data-command="italic" title="Italic"><i>I</i></button>
                <button class="toolbar-btn format-btn" data-command="underline" title="Underline"><u>U</u></button>
                <button class="toolbar-btn format-btn" data-command="strikeThrough" title="Strikethrough"><s>S</s></button>
            </div>

            <div style="width: 1px; height: 24px; background: #cbd5e0; margin: 0 8px;"></div>

            <div style="display: flex; gap: 4px; align-items: center; margin-right: 12px;">
                <input type="color" id="text-color" value="#000000" title="Text Color" style="width: 32px; height: 28px; border: 1px solid #cbd5e0; border-radius: 4px; cursor: pointer;">
                <input type="color" id="bg-color" value="#ffffff" title="Highlight Color" style="width: 32px; height: 28px; border: 1px solid #cbd5e0; border-radius: 4px; cursor: pointer;">
            </div>

            <div style="width: 1px; height: 24px; background: #cbd5e0; margin: 0 8px;"></div>

            <div style="display: flex; gap: 4px; align-items: center; margin-right: 12px;">
                <button class="toolbar-btn format-btn" data-command="justifyLeft" title="Align Left">⬅</button>
                <button class="toolbar-btn format-btn" data-command="justifyCenter" title="Center">⬌</button>
                <button class="toolbar-btn format-btn" data-command="justifyRight" title="Align Right">➡</button>
                <button class="toolbar-btn format-btn" data-command="justifyFull" title="Justify">⬍</button>
            </div>

            <div style="width: 1px; height: 24px; background: #cbd5e0; margin: 0 8px;"></div>

            <div style="display: flex; gap: 4px; align-items: center; margin-right: 12px;">
                <button class="toolbar-btn" data-command="insertUnorderedList" title="Bullet List">• List</button>
                <button class="toolbar-btn" data-command="insertOrderedList" title="Numbered List">1. List</button>
                <button class="toolbar-btn" data-command="outdent" title="Decrease Indent">⬅ Indent</button>
                <button class="toolbar-btn" data-command="indent" title="Increase Indent">Indent ➡</button>
            </div>

            <div style="width: 1px; height: 24px; background: #cbd5e0; margin: 0 8px;"></div>

            <div style="display: flex; gap: 4px; align-items: center;">
                <button class="toolbar-btn" id="insert-table" title="Insert Table">📊 Table</button>
                <button class="toolbar-btn" id="insert-image" title="Insert Image">🖼️ Image</button>
                <button class="toolbar-btn" id="insert-link" title="Insert Link">🔗 Link</button>
            </div>

            <div style="width: 1px; height: 24px; background: #cbd5e0; margin: 0 8px;"></div>

            <div style="display: flex; gap: 4px; align-items: center;">
                <button class="toolbar-btn" id="save-file" title="Save Document">💾 Save</button>
                <button class="toolbar-btn" id="load-file" title="Load Document">📂 Load</button>
            </div>
        `;

        // Create editor content area
        const editorContent = document.createElement('div');
        editorContent.style.cssText = `
            flex: 1;
            display: flex;
            background: #f1f5f9;
            overflow: hidden;
        `;

        // Create document area (like Word's page view)
        const documentArea = document.createElement('div');
        documentArea.id = 'document-area';
        documentArea.style.cssText = `
            flex: 1;
            padding: 20px;
            overflow-y: auto;
            background: #f1f5f9;
            display: flex;
            flex-direction: column;
            align-items: center;
        `;

        // Create the actual document (paper-like)
        const documentElement = document.createElement('div');
        documentElement.contentEditable = true;
        documentElement.id = 'word-document';
        documentElement.style.cssText = `
            background: white;
            min-height: 800px;
            padding: 60px 80px;
            margin: 0 auto;
            width: 100%;
            max-width: 700px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            font-family: 'Times New Roman', serif;
            font-size: 12pt;
            line-height: 1.6;
            color: #1f2937;
            outline: none;
            position: relative;
        `;
        documentElement.innerHTML = `
            <h1 style="text-align: center; margin-bottom: 30px; color: #1f2937;">Document Title</h1>
            <p>Start typing your document here. This is a fully functional Microsoft Word-like editor with support for:</p>
            <ul>
                <li>Rich text formatting (bold, italic, underline)</li>
                <li>Font selection and sizing</li>
                <li>Text alignment and indentation</li>
                <li>Bullet points and numbered lists</li>
                <li>Tables and images</li>
                <li>Real-time editing</li>
            </ul>
            <p>Click anywhere to start editing!</p>
        `;

        // Create status bar
        const statusBar = document.createElement('div');
        statusBar.id = 'word-editor-status-bar';
        statusBar.style.cssText = `
            background: #f8fafc;
            border-top: 1px solid #e2e8f0;
            padding: 8px 20px;
            font-size: 12px;
            color: #64748b;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;
        statusBar.innerHTML = `
            <div id="status-info">Ready</div>
            <div id="document-stats">Words: 0 | Characters: 0</div>
        `;

        // Assemble the editor
        documentArea.appendChild(documentElement);
        editorContent.appendChild(documentArea);
        editorContainer.appendChild(titleBar);
        editorContainer.appendChild(toolbar);
        editorContainer.appendChild(editorContent);
        editorContainer.appendChild(statusBar);

        // Add CSS styles for toolbar buttons
        const style = document.createElement('style');
        style.textContent = `
            .toolbar-btn {
                background: white;
                border: 1px solid #cbd5e0;
                padding: 6px 12px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
                font-weight: 500;
                color: #374151;
                transition: all 0.2s;
            }

            .toolbar-btn:hover {
                background: #f3f4f6;
                border-color: #9ca3af;
            }

            .toolbar-btn:active, .toolbar-btn.active {
                background: #e5e7eb;
                border-color: #6b7280;
            }

            .format-btn.active {
                background: #3b82f6;
                color: white;
                border-color: #2563eb;
            }

            #word-document:focus {
                box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
            }

            #word-document table {
                border-collapse: collapse;
                width: 100%;
                margin: 10px 0;
            }

            #word-document table td, #word-document table th {
                border: 1px solid #cbd5e0;
                padding: 8px;
                text-align: left;
            }

            #word-document table th {
                background-color: #f8fafc;
                font-weight: bold;
            }

            #word-document img {
                max-width: 100%;
                height: auto;
                border-radius: 4px;
                margin: 10px 0;
            }

            #word-document a {
                color: #3b82f6;
                text-decoration: underline;
            }

            #word-document blockquote {
                border-left: 4px solid #e5e7eb;
                margin: 16px 0;
                padding-left: 16px;
                color: #6b7280;
                font-style: italic;
            }
        `;
        document.head.appendChild(style);

        return { editorContainer, documentElement, statusBar };
    }

    // Function to initialize the editor functionality
    function initializeEditor(editorContainer, documentElement, statusBar) {
        console.log('Initializing editor functionality...');

        // Make title bar draggable
        let isDragging = false;
        let dragOffset = { x: 0, y: 0 };
        const titleBar = editorContainer.querySelector('#word-editor-titlebar');
        titleBar.addEventListener('mousedown', (e) => {
            if (e.target.tagName === 'BUTTON') return;
            isDragging = true;
            const rect = editorContainer.getBoundingClientRect();
            dragOffset.x = e.clientX - rect.left;
            dragOffset.y = e.clientY - rect.top;
            document.addEventListener('mousemove', handleDrag);
            document.addEventListener('mouseup', stopDrag);
        });

        function handleDrag(e) {
            if (!isDragging) return;
            editorContainer.style.left = (e.clientX - dragOffset.x) + 'px';
            editorContainer.style.top = (e.clientY - dragOffset.y) + 'px';
            editorContainer.style.right = 'auto';
            editorContainer.style.bottom = 'auto';
        }

        function stopDrag() {
            isDragging = false;
            document.removeEventListener('mousemove', handleDrag);
            document.removeEventListener('mouseup', stopDrag);
        }

        // Close and minimize functionality
        document.getElementById('close-editor').addEventListener('click', () => {
            editorContainer.remove();
        });

        document.getElementById('minimize-editor').addEventListener('click', () => {
            const editorContent = editorContainer.querySelector('div:nth-child(3)');
            const toolbar = editorContainer.querySelector('#word-editor-toolbar');
            const statusBarElement = editorContainer.querySelector('#word-editor-status-bar');
            if (editorContent.style.display === 'none') {
                editorContent.style.display = 'flex';
                toolbar.style.display = 'flex';
                statusBarElement.style.display = 'flex';
                editorContainer.style.height = '700px';
            } else {
                editorContent.style.display = 'none';
                toolbar.style.display = 'none';
                statusBarElement.style.display = 'none';
                editorContainer.style.height = '50px';
            }
        });

        // Toolbar functionality
        const toolbar = editorContainer.querySelector('#word-editor-toolbar');

        // Format buttons
        toolbar.addEventListener('click', (e) => {
            const target = e.target.closest('.toolbar-btn');
            if (target) {
                const command = target.dataset.command;
                if (command) {
                    document.execCommand(command, false, null);
                    updateFormatButtons();
                    documentElement.focus();
                }
            }
        });

        // Font family and size
        const fontFamily = document.getElementById('font-family');
        const fontSize = document.getElementById('font-size');

        fontFamily.addEventListener('change', () => {
            document.execCommand('fontName', false, fontFamily.value);
            documentElement.focus();
        });

        fontSize.addEventListener('change', () => {
            document.execCommand('fontSize', false, fontSize.value);
            documentElement.focus();
        });

        // Color pickers
        const textColor = document.getElementById('text-color');
        const bgColor = document.getElementById('bg-color');

        textColor.addEventListener('change', () => {
            document.execCommand('foreColor', false, textColor.value);
            documentElement.focus();
        });

        bgColor.addEventListener('change', () => {
            document.execCommand('backColor', false, bgColor.value);
            documentElement.focus();
        });

        // Special buttons
        document.getElementById('insert-table').addEventListener('click', () => {
            const rows = prompt('Number of rows:', '3');
            const cols = prompt('Number of columns:', '3');
            if (rows && cols) {
                insertTable(parseInt(rows), parseInt(cols));
            }
        });

        document.getElementById('insert-image').addEventListener('click', () => {
            const url = prompt('Image URL:', 'https://');
            if (url && url !== 'https://') {
                insertImage(url);
            }
        });

        document.getElementById('insert-link').addEventListener('click', () => {
            const url = prompt('Link URL:', 'https://');
            const text = prompt('Link text:', 'Click here');
            if (url && url !== 'https://' && text) {
                insertLink(url, text);
            }
        });

        // Save and Load buttons
        document.getElementById('save-file').addEventListener('click', () => {
            saveFile();
        });

        document.getElementById('load-file').addEventListener('click', () => {
            loadFile();
        });

        // Update format buttons based on current selection
        function updateFormatButtons() {
            const formatButtons = toolbar.querySelectorAll('.format-btn');
            formatButtons.forEach(btn => {
                const command = btn.dataset.command;
                try {
                    if (document.queryCommandState(command)) {
                        btn.classList.add('active');
                    } else {
                        btn.classList.remove('active');
                    }
                } catch (e) {
                    console.error('Failed to query command state for:', command, e);
                }
            });
        }

        // Insert table function
        function insertTable(rows, cols) {
            let tableHTML = '<table><tbody>';
            for (let i = 0; i < rows; i++) {
                tableHTML += '<tr>';
                for (let j = 0; j < cols; j++) {
                    tableHTML += `<td>Cell</td>`;
                }
                tableHTML += '</tr>';
            }
            tableHTML += '</tbody></table><p></p>';
            document.execCommand('insertHTML', false, tableHTML);
            documentElement.focus();
        }

        // Insert image function
        function insertImage(url) {
            const imgHTML = `<img src="${url}" alt="Inserted image" style="max-width: 100%; height: auto;"><p></p>`;
            document.execCommand('insertHTML', false, imgHTML);
            documentElement.focus();
        }

        // Insert link function
        function insertLink(url, text) {
            const linkHTML = `<a href="${url}" target="_blank">${text}</a>`;
            document.execCommand('insertHTML', false, linkHTML);
            documentElement.focus();
        }

        // Save file to PC
        function saveFile() {
            const content = documentElement.innerHTML;
            const fileName = 'DrawariaWordOfficeDoc.html';
            const blob = new Blob([content], { type: 'text/html' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            updateStatusInfo('Document saved to PC!');
        }

        // Load file from PC
        function loadFile() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.html, .txt';
            input.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(event) {
                        documentElement.innerHTML = event.target.result;
                        updateStats();
                        updateStatusInfo('Document loaded from PC!');
                    };
                    reader.readAsText(file);
                }
            });
            input.click();
        }

        // Update status bar
        const updateStats = debounce(() => {
            const text = documentElement.textContent || documentElement.innerText || '';
            const words = text.trim().split(/\s+/).filter(word => word.length > 0).length;
            const characters = text.length;

            const statsElement = document.getElementById('document-stats');
            if (statsElement) {
                statsElement.textContent = `Words: ${words} | Characters: ${characters}`;
            }
        }, 300);

        const updateStatusInfo = (message) => {
            const statusInfo = document.getElementById('status-info');
            if (statusInfo) {
                statusInfo.textContent = message;
            }
        };

        // Document event listeners
        documentElement.addEventListener('input', () => {
            updateStats();
            updateStatusInfo('Editing...');
            saveDocument();
        });
        documentElement.addEventListener('keyup', updateFormatButtons);
        documentElement.addEventListener('mouseup', updateFormatButtons);
        documentElement.addEventListener('paste', () => {
            setTimeout(() => {
                updateStats();
            }, 0);
        });

        // Keyboard shortcuts
        documentElement.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key.toLowerCase()) {
                    case 'b':
                        e.preventDefault();
                        document.execCommand('bold');
                        updateFormatButtons();
                        break;
                    case 'i':
                        e.preventDefault();
                        document.execCommand('italic');
                        updateFormatButtons();
                        break;
                    case 'u':
                        e.preventDefault();
                        document.execCommand('underline');
                        updateFormatButtons();
                        break;
                    case 's':
                        e.preventDefault();
                        saveDocument();
                        break;
                }
            }
        });

        // Save document function (using GM storage)
        const saveDocument = debounce(async() => {
            try {
                if (typeof GM !== 'undefined' && GM.setValue) {
                    const content = documentElement.innerHTML;
                    await GM.setValue('drawaria_word_document', content);
                    updateStatusInfo('Document saved');
                } else {
                    updateStatusInfo('Save function not available');
                }
                console.log('Document auto-saved successfully');
                setTimeout(() => updateStatusInfo('Ready'), 2000);
            } catch (error) {
                console.error('Failed to save document:', error);
                updateStatusInfo('Save failed!');
            }
        }, 3000); // Auto-save after 3 seconds of inactivity

        // Load saved document (using GM storage)
        async function loadDocument() {
            try {
                if (typeof GM !== 'undefined' && GM.getValue) {
                    const savedContent = await GM.getValue('drawaria_word_document', null);
                    if (savedContent) {
                        documentElement.innerHTML = savedContent;
                        updateStats();
                        updateStatusInfo('Saved document loaded');
                        console.log('Saved document loaded successfully');
                    }
                }
                updateStatusInfo('Ready');
            } catch (error) {
                console.error('Failed to load saved document:', error);
                updateStatusInfo('Load failed!');
            }
        }

        // Load saved document on initialization
        loadDocument();

        // Initial stats update
        updateStats();
        updateFormatButtons();

        console.log('Word editor fully initialized and ready to use');
    }

    // Function to open the editor
    function openEditor() {
        const existingEditor = document.getElementById('word-editor-container');
        if (!existingEditor) {
            const { editorContainer, documentElement, statusBar } = createWordEditor();
            document.body.appendChild(editorContainer);
            initializeEditor(editorContainer, documentElement, statusBar);
        } else {
            console.log('Editor is already open.');
        }
    }

    // Function to close the editor
    function closeEditor() {
        const existingEditor = document.getElementById('word-editor-container');
        if (existingEditor) {
            existingEditor.remove();
        } else {
            console.log('Editor is not open.');
        }
    }

    // Main initialization function
    function init() {
        console.log('Drawaria Word Processor starting...');

        if (typeof GM_registerMenuCommand === 'undefined') {
            console.error('GM_registerMenuCommand is not available. Please ensure you are using a compatible userscript manager.');
            return;
        }

        // Register menu commands
        GM_registerMenuCommand('📂 Open Word Office', openEditor);
        GM_registerMenuCommand('❌ Close Word Office', closeEditor);

        console.log('Drawaria Word Processor initialized successfully! Use the userscript menu to open the editor.');
    }

    // Start the extension
    init();

})();