// ==UserScript==
// @name         AO3 Enhanced Cover Generator with UI
// @namespace    http://tampermonkey.net/
// @version      4.2
// @description  Download EPUB/MOBI/PDF with customizable cover image
// @author       You
// @match        https://archiveofourown.org/works/*
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      archiveofourown.org
// @connect      *
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/556212/AO3%20Enhanced%20Cover%20Generator%20with%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/556212/AO3%20Enhanced%20Cover%20Generator%20with%20UI.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let jsZipPromise = null;
    const defaultSettings = {
        customImage: null,
        imageUrl: '',
        font: 'Arial',
        fileType: 'epub',
        backgroundColor: null,
        titleSize: 58,
        authorSize: 42,
        seriesSize: 34,
        wordCountLabelSize: 50,
        wordCountSize: 120,
        titleY: 200,
        authorY: 320,
        seriesY: 420,
        wordCountLabelY: 850,
        wordCountY: 1000
    };
    
    let currentSettings = { ...defaultSettings };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        jsZipPromise = loadJSZip();
        loadSavedSettings();
        injectStyles();
        
        const downloadList = document.querySelector('ul.work.navigation.actions');
        if (!downloadList) return;

        const li = document.createElement('li');
        li.classList.add('epub-cover-button');
        
        const link = document.createElement('a');
        link.textContent = 'Download with Cover';
        link.href = '#';
        link.style.cursor = 'pointer';
        link.style.opacity = '1';
        link.style.background = '#666';
        link.style.color = '#fff';
        link.style.padding = '0.25em 0.75em';
        link.style.borderRadius = '0.25em';
        link.style.display = 'inline-block';
        
        link.addEventListener('click', (e) => {
            e.preventDefault();
            showCustomizationModal();
        });

        li.appendChild(link);
        downloadList.appendChild(li);
    }

    function loadSavedSettings() {
        const savedSettings = GM_getValue('coverSettings', null);
        if (savedSettings) {
            try {
                const parsed = JSON.parse(savedSettings);
                Object.keys(parsed).forEach(key => {
                    if (key !== 'customImage' && key !== 'imageUrl' && key !== 'backgroundColor') {
                        currentSettings[key] = parsed[key];
                    }
                });
            } catch (e) {
                console.error('Error loading saved settings:', e);
            }
        }
    }

    function saveSettings() {
        const settingsToSave = { ...currentSettings };
        delete settingsToSave.customImage;
        delete settingsToSave.imageUrl;
        delete settingsToSave.backgroundColor;
        
        GM_setValue('coverSettings', JSON.stringify(settingsToSave));
    }
    
    function resetToDefaults() {
        Object.keys(defaultSettings).forEach(key => {
            if (key !== 'customImage' && key !== 'imageUrl' && key !== 'backgroundColor') {
                currentSettings[key] = defaultSettings[key];
            }
        });
        currentSettings.backgroundColor = null;
    }

    function injectStyles() {
        const style = document.createElement('style');
        
        const bodyStyles = window.getComputedStyle(document.body);
        const bgColor = bodyStyles.backgroundColor || '#fff';
        const textColor = bodyStyles.color || '#333';
        const linkColor = window.getComputedStyle(document.querySelector('a') || document.body).color || '#900';
        
        style.textContent = `
            .cover-modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.85);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
                padding: 1em;
            }
            
            .cover-modal {
                background: #1a1a1a;
                color: #e0e0e0;
                padding: 1em;
                border: 2px solid #444;
                border-radius: 0.5em;
                max-width: 85em;
                width: 100%;
                max-height: 95vh;
                overflow-y: auto;
                box-shadow: 0 0 30px rgba(0, 0, 0, 0.8);
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                font-size: 0.9em;
            }
            
            .cover-modal h2 {
                margin: 0 0 0.75em 0;
                padding-bottom: 0.5em;
                border-bottom: 2px solid #444;
                font-size: 1.3em;
                font-weight: bold;
                color: #fff;
            }
            
            .cover-modal h3 {
                margin: 1em 0 0.5em 0;
                font-size: 1em;
                font-weight: bold;
                border-bottom: 1px solid #333;
                padding-bottom: 0.25em;
                color: #ccc;
            }
            
            .cover-layout {
                display: grid;
                grid-template-columns: 1fr 400px;
                gap: 1.5em;
            }
            
            .cover-controls {
                display: flex;
                flex-direction: column;
                gap: 1em;
            }
            
            .cover-form-section {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 0.75em;
            }
            
            .cover-form-section-full {
                grid-column: 1 / -1;
            }
            
            .cover-form-group {
                margin-bottom: 0.5em;
            }
            
            .cover-form-group label {
                display: block;
                margin-bottom: 0.25em;
                font-weight: 600;
                font-size: 0.85em;
                color: #bbb;
            }
            
            .cover-form-group input[type="text"],
            .cover-form-group input[type="file"],
            .cover-form-group input[type="number"],
            .cover-form-group input[type="range"],
            .cover-form-group select {
                width: 100%;
                padding: 0.4em;
                border: 1px solid #444;
                background: #2a2a2a;
                color: #e0e0e0;
                border-radius: 0.25em;
                font-size: 0.9em;
                box-sizing: border-box;
                font-family: inherit;
            }
            
            .cover-form-group select {
                background: #2a2a2a;
                color: #e0e0e0;
                cursor: pointer;
            }
            
            .cover-form-group select option {
                background: #2a2a2a;
                color: #e0e0e0;
                padding: 0.5em;
            }
            
            .cover-form-group input[type="file"] {
                padding: 0.3em;
                cursor: pointer;
            }
            
            .cover-form-group input:focus,
            .cover-form-group select:focus {
                outline: 2px solid #3498db;
                outline-offset: 1px;
                border-color: #3498db;
            }
            
            .cover-slider-group {
                display: flex;
                align-items: center;
                gap: 0.5em;
            }
            
            .cover-slider-group input[type="range"] {
                flex: 1;
            }
            
            .cover-slider-group input[type="number"] {
                width: 4em;
                padding: 0.25em;
            }
            
            .cover-preview-container {
                position: sticky;
                top: 1em;
            }
            
            .cover-preview {
                text-align: center;
                background: #0a0a0a;
                padding: 1em;
                border-radius: 0.5em;
                border: 2px solid #333;
            }
            
            .cover-preview canvas {
                max-width: 100%;
                height: auto;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.6);
                border-radius: 0.25em;
            }
            
            .cover-buttons {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 0.5em;
                margin-top: 1em;
                padding-top: 1em;
                border-top: 2px solid #444;
                grid-column: 1 / -1;
            }
            
            .cover-btn {
                padding: 0.6em 1em;
                border: 1px solid #555;
                border-radius: 0.25em;
                font-size: 0.9em;
                cursor: pointer;
                transition: all 0.2s;
                font-weight: 600;
                font-family: inherit;
            }
            
            .cover-btn-primary {
                background: #900;
                color: #fff;
                border-color: #900;
            }
            
            .cover-btn-primary:hover:not(:disabled) {
                background: #b00;
                border-color: #b00;
            }
            
            .cover-btn-primary:disabled {
                background: #666;
                border-color: #666;
                cursor: not-allowed;
                opacity: 0.6;
            }
            
            .cover-btn-secondary {
                background: #444;
                color: #e0e0e0;
                border-color: #555;
            }
            
            .cover-btn-secondary:hover {
                background: #555;
                border-color: #666;
            }
            
            .cover-btn-save {
                background: #2980b9;
                color: #fff;
                border-color: #2980b9;
            }
            
            .cover-btn-save:hover {
                background: #3498db;
                border-color: #3498db;
            }
            
            .cover-btn-reset {
                background: #d35400;
                color: #fff;
                border-color: #d35400;
            }
            
            .cover-btn-reset:hover {
                background: #e67e22;
                border-color: #e67e22;
            }
            
            .cover-note {
                font-size: 0.8em;
                opacity: 0.7;
                margin-top: 0.25em;
                font-style: italic;
                color: #999;
            }
            
            .font-preview {
                margin-top: 0.5em;
                padding: 0.5em;
                background: #0a0a0a;
                color: #fff;
                border-radius: 0.25em;
                text-align: center;
                border: 1px solid #333;
                font-size: 1em;
            }
            
            @media (max-width: 1200px) {
                .cover-layout {
                    grid-template-columns: 1fr;
                }
                
                .cover-preview-container {
                    position: static;
                }
            }
        `;
        document.head.appendChild(style);
    }

    function showCustomizationModal() {
        const overlay = document.createElement('div');
        overlay.className = 'cover-modal-overlay';
        
        const modal = document.createElement('div');
        modal.className = 'cover-modal';
        
        const title = document.querySelector('h2.title')?.textContent.trim() || 'Untitled';
        const author = document.querySelector('a[rel="author"]')?.textContent.trim() || 'Anonymous';
        
        modal.innerHTML = `
            <h2>Customize Your Download</h2>
            
            <div class="cover-layout">
                <div class="cover-controls">
                    <div class="cover-form-section">
                        <div class="cover-form-group">
                            <label for="file-type">File Type:</label>
                            <select id="file-type">
                                <option value="epub" ${currentSettings.fileType === 'epub' ? 'selected' : ''}>EPUB</option>
                                <option value="mobi" ${currentSettings.fileType === 'mobi' ? 'selected' : ''}>MOBI</option>
                                <option value="pdf" ${currentSettings.fileType === 'pdf' ? 'selected' : ''}>PDF</option>
                                <option value="html" ${currentSettings.fileType === 'html' ? 'selected' : ''}>HTML</option>
                                <option value="azw3" ${currentSettings.fileType === 'azw3' ? 'selected' : ''}>AZW3</option>
                            </select>
                        </div>
                        
                        <div class="cover-form-group">
                            <label for="font-select">Font:</label>
                            <select id="font-select">
                                <option value="Arial" ${currentSettings.font === 'Arial' ? 'selected' : ''}>Arial</option>
                                <option value="Georgia" ${currentSettings.font === 'Georgia' ? 'selected' : ''}>Georgia (Serif)</option>
                                <option value="Times New Roman" ${currentSettings.font === 'Times New Roman' ? 'selected' : ''}>Times New Roman</option>
                                <option value="Courier New" ${currentSettings.font === 'Courier New' ? 'selected' : ''}>Courier New (Mono)</option>
                                <option value="Verdana" ${currentSettings.font === 'Verdana' ? 'selected' : ''}>Verdana</option>
                                <option value="Palatino" ${currentSettings.font === 'Palatino' ? 'selected' : ''}>Palatino</option>
                                <option value="Garamond" ${currentSettings.font === 'Garamond' ? 'selected' : ''}>Garamond</option>
                                <option value="Bookman" ${currentSettings.font === 'Bookman' ? 'selected' : ''}>Bookman</option>
                                <option value="Comic Sans MS" ${currentSettings.font === 'Comic Sans MS' ? 'selected' : ''}>Comic Sans MS</option>
                                <option value="Impact" ${currentSettings.font === 'Impact' ? 'selected' : ''}>Impact</option>
                            </select>
                            <div class="font-preview" id="font-preview" style="font-family: ${currentSettings.font};">
                                ${title}
                            </div>
                        </div>
                    </div>
                    
                    <div class="cover-form-section">
                        <div class="cover-form-group cover-form-section-full">
                            <label for="image-url">Cover Image URL (optional):</label>
                            <input type="text" id="image-url" placeholder="https://example.com/image.jpg">
                            <div class="cover-note">Leave blank for random color background</div>
                        </div>
                        
                        <div class="cover-form-group cover-form-section-full">
                            <label for="image-file">Or Upload Image:</label>
                            <input type="file" id="image-file" accept="image/*">
                        </div>
                    </div>
                    
                    <h3>Font Sizes</h3>
                    <div class="cover-form-section">
                        <div class="cover-form-group">
                            <label for="title-size">Title: <span id="title-size-val">${currentSettings.titleSize}</span>px</label>
                            <div class="cover-slider-group">
                                <input type="range" id="title-size" min="30" max="100" value="${currentSettings.titleSize}">
                                <input type="number" id="title-size-num" min="30" max="100" value="${currentSettings.titleSize}">
                            </div>
                        </div>
                        
                        <div class="cover-form-group">
                            <label for="author-size">Author: <span id="author-size-val">${currentSettings.authorSize}</span>px</label>
                            <div class="cover-slider-group">
                                <input type="range" id="author-size" min="20" max="80" value="${currentSettings.authorSize}">
                                <input type="number" id="author-size-num" min="20" max="80" value="${currentSettings.authorSize}">
                            </div>
                        </div>
                        
                        <div class="cover-form-group">
                            <label for="series-size">Series: <span id="series-size-val">${currentSettings.seriesSize}</span>px</label>
                            <div class="cover-slider-group">
                                <input type="range" id="series-size" min="20" max="60" value="${currentSettings.seriesSize}">
                                <input type="number" id="series-size-num" min="20" max="60" value="${currentSettings.seriesSize}">
                            </div>
                        </div>
                        
                        <div class="cover-form-group">
                            <label for="wordcount-label-size">Word Count Label: <span id="wordcount-label-size-val">${currentSettings.wordCountLabelSize}</span>px</label>
                            <div class="cover-slider-group">
                                <input type="range" id="wordcount-label-size" min="20" max="80" value="${currentSettings.wordCountLabelSize}">
                                <input type="number" id="wordcount-label-size-num" min="20" max="80" value="${currentSettings.wordCountLabelSize}">
                            </div>
                        </div>
                        
                        <div class="cover-form-group">
                            <label for="wordcount-size">Word Count: <span id="wordcount-size-val">${currentSettings.wordCountSize}</span>px</label>
                            <div class="cover-slider-group">
                                <input type="range" id="wordcount-size" min="60" max="200" value="${currentSettings.wordCountSize}">
                                <input type="number" id="wordcount-size-num" min="60" max="200" value="${currentSettings.wordCountSize}">
                            </div>
                        </div>
                    </div>
                    
                    <h3>Element Positions (Y-axis)</h3>
                    <div class="cover-form-section">
                        <div class="cover-form-group">
                            <label for="title-y">Title: <span id="title-y-val">${currentSettings.titleY}</span>px</label>
                            <div class="cover-slider-group">
                                <input type="range" id="title-y" min="100" max="400" value="${currentSettings.titleY}">
                                <input type="number" id="title-y-num" min="100" max="400" value="${currentSettings.titleY}">
                            </div>
                        </div>
                        
                        <div class="cover-form-group">
                            <label for="author-y">Author: <span id="author-y-val">${currentSettings.authorY}</span>px</label>
                            <div class="cover-slider-group">
                                <input type="range" id="author-y" min="150" max="500" value="${currentSettings.authorY}">
                                <input type="number" id="author-y-num" min="150" max="500" value="${currentSettings.authorY}">
                            </div>
                        </div>
                        
                        <div class="cover-form-group">
                            <label for="series-y">Series: <span id="series-y-val">${currentSettings.seriesY}</span>px</label>
                            <div class="cover-slider-group">
                                <input type="range" id="series-y" min="200" max="600" value="${currentSettings.seriesY}">
                                <input type="number" id="series-y-num" min="200" max="600" value="${currentSettings.seriesY}">
                            </div>
                        </div>
                        
                        <div class="cover-form-group">
                            <label for="wordcount-label-y">Word Count Label: <span id="wordcount-label-y-val">${currentSettings.wordCountLabelY}</span>px</label>
                            <div class="cover-slider-group">
                                <input type="range" id="wordcount-label-y" min="600" max="1100" value="${currentSettings.wordCountLabelY}">
                                <input type="number" id="wordcount-label-y-num" min="600" max="1100" value="${currentSettings.wordCountLabelY}">
                            </div>
                        </div>
                        
                        <div class="cover-form-group">
                            <label for="wordcount-y">Word Count: <span id="wordcount-y-val">${currentSettings.wordCountY}</span>px</label>
                            <div class="cover-slider-group">
                                <input type="range" id="wordcount-y" min="600" max="1100" value="${currentSettings.wordCountY}">
                                <input type="number" id="wordcount-y-num" min="600" max="1100" value="${currentSettings.wordCountY}">
                            </div>
                        </div>
                    </div>
                    
                    <div class="cover-buttons">
                        <button class="cover-btn cover-btn-secondary" id="cancel-btn">Cancel</button>
                        <button class="cover-btn cover-btn-reset" id="reset-btn">Reset to Default</button>
                        <button class="cover-btn cover-btn-save" id="save-btn">Save Settings</button>
                        <button class="cover-btn cover-btn-primary" id="generate-btn">Generate & Download</button>
                    </div>
                </div>
                
                <div class="cover-preview-container">
                    <div class="cover-preview">
                        <canvas id="preview-canvas" width="400" height="600"></canvas>
                    </div>
                </div>
            </div>
        `;
        
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
        
        // Setup event listeners
        const fileTypeSelect = modal.querySelector('#file-type');
        const fontSelect = modal.querySelector('#font-select');
        const imageUrlInput = modal.querySelector('#image-url');
        const imageFileInput = modal.querySelector('#image-file');
        const generateBtn = modal.querySelector('#generate-btn');
        const saveBtn = modal.querySelector('#save-btn');
        const resetBtn = modal.querySelector('#reset-btn');
        const cancelBtn = modal.querySelector('#cancel-btn');
        const fontPreview = modal.querySelector('#font-preview');
        
        // Setup slider controls
        const sliders = [
            { id: 'title-size', setting: 'titleSize' },
            { id: 'author-size', setting: 'authorSize' },
            { id: 'series-size', setting: 'seriesSize' },
            { id: 'wordcount-label-size', setting: 'wordCountLabelSize' },
            { id: 'wordcount-size', setting: 'wordCountSize' },
            { id: 'title-y', setting: 'titleY' },
            { id: 'author-y', setting: 'authorY' },
            { id: 'series-y', setting: 'seriesY' },
            { id: 'wordcount-label-y', setting: 'wordCountLabelY' },
            { id: 'wordcount-y', setting: 'wordCountY' }
        ];
        
        sliders.forEach(({ id, setting }) => {
            const slider = modal.querySelector(`#${id}`);
            const numberInput = modal.querySelector(`#${id}-num`);
            const valueDisplay = modal.querySelector(`#${id}-val`);
            
            const updateValue = (value) => {
                currentSettings[setting] = parseInt(value);
                slider.value = value;
                numberInput.value = value;
                valueDisplay.textContent = value;
                updatePreview();
            };
            
            slider.addEventListener('input', (e) => updateValue(e.target.value));
            numberInput.addEventListener('input', (e) => updateValue(e.target.value));
        });
        
        fontSelect.addEventListener('change', () => {
            currentSettings.font = fontSelect.value;
            fontPreview.style.fontFamily = fontSelect.value;
            updatePreview();
        });
        
        imageUrlInput.addEventListener('input', () => {
            currentSettings.imageUrl = imageUrlInput.value;
            currentSettings.customImage = null;
            updatePreview();
        });
        
        imageFileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    currentSettings.customImage = event.target.result;
                    currentSettings.imageUrl = '';
                    imageUrlInput.value = '';
                    updatePreview();
                };
                reader.readAsDataURL(file);
            }
        });
        
        fileTypeSelect.addEventListener('change', () => {
            currentSettings.fileType = fileTypeSelect.value;
        });
        
        resetBtn.addEventListener('click', () => {
            resetToDefaults();
            currentSettings.customImage = null;
            currentSettings.imageUrl = '';
            currentSettings.backgroundColor = null;
            document.body.removeChild(overlay);
            showCustomizationModal();
        });
        
        saveBtn.addEventListener('click', () => {
            saveSettings();
            saveBtn.textContent = 'Saved!';
            setTimeout(() => {
                saveBtn.textContent = 'Save Settings';
            }, 2000);
        });
        
        generateBtn.addEventListener('click', async () => {
            generateBtn.textContent = 'Generating...';
            generateBtn.disabled = true;
            
            try {
                await generateFile();
                document.body.removeChild(overlay);
            } catch (error) {
                console.error('Generation error:', error);
                alert('Error generating file: ' + error.message);
                generateBtn.textContent = 'Generate & Download';
                generateBtn.disabled = false;
            }
        });
        
        cancelBtn.addEventListener('click', () => {
            document.body.removeChild(overlay);
        });
        
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                document.body.removeChild(overlay);
            }
        });
        
        updatePreview();
    }

    function updatePreview() {
        const canvas = document.getElementById('preview-canvas');
        if (!canvas) return;
        
        const title = document.querySelector('h2.title')?.textContent.trim() || 'Untitled';
        const author = document.querySelector('a[rel="author"]')?.textContent.trim() || 'Anonymous';
        const series = document.querySelector('.series .position a')?.textContent.trim() || '';
        const wordCount = document.querySelector('dd.words')?.textContent.trim() || '0';
        
        const ctx = canvas.getContext('2d', { alpha: false });
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (currentSettings.customImage || currentSettings.imageUrl) {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            
            img.onload = function() {
                drawCover(ctx, canvas, img, title, author, series, wordCount);
            };
            
            img.onerror = function() {
                drawCoverWithColor(ctx, canvas, title, author, series, wordCount);
            };
            
            img.src = currentSettings.customImage || currentSettings.imageUrl;
        } else {
            drawCoverWithColor(ctx, canvas, title, author, series, wordCount);
        }
    }

    function drawCover(ctx, canvas, img, title, author, series, wordCount) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawText(ctx, canvas, title, author, series, wordCount);
    }

    function drawCoverWithColor(ctx, canvas, title, author, series, wordCount) {
        if (!currentSettings.backgroundColor) {
            currentSettings.backgroundColor = getRandomColor();
        }
        
        ctx.fillStyle = currentSettings.backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0.1)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        drawText(ctx, canvas, title, author, series, wordCount);
    }

    function drawText(ctx, canvas, title, author, series, wordCount) {
        const scale = canvas.width / 800;
        
        ctx.font = `${12 * scale}px ${currentSettings.font}, sans-serif`;
        ctx.fillStyle = '#cccccc';
        ctx.textAlign = 'center';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        ctx.shadowBlur = 5 * scale;
        ctx.shadowOffsetX = 2 * scale;
        ctx.shadowOffsetY = 2 * scale;
        ctx.fillText('Archive of Our Own', canvas.width / 2, 35 * scale);
        
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 2 * scale;
        ctx.strokeRect(20 * scale, 20 * scale, (canvas.width - 40 * scale), (canvas.height - 40 * scale));
        
        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${currentSettings.titleSize * scale}px ${currentSettings.font}, sans-serif`;
        ctx.textAlign = 'center';
        const titleLines = wrapText(ctx, title, canvas.width - 80 * scale);
        let y = currentSettings.titleY * scale;
        titleLines.forEach(line => {
            ctx.fillText(line, canvas.width / 2, y);
            y += (currentSettings.titleSize * 1.3) * scale;
        });
        
        ctx.font = `${currentSettings.authorSize * scale}px ${currentSettings.font}, sans-serif`;
        ctx.fillText(author, canvas.width / 2, currentSettings.authorY * scale);
        
        if (series) {
            ctx.font = `${currentSettings.seriesSize * scale}px ${currentSettings.font}, sans-serif`;
            ctx.fillStyle = '#e0e0e0';
            const seriesLines = wrapText(ctx, series, canvas.width - 80 * scale);
            let seriesY = currentSettings.seriesY * scale;
            seriesLines.forEach(line => {
                ctx.fillText(line, canvas.width / 2, seriesY);
                seriesY += (currentSettings.seriesSize * 1.4) * scale;
            });
        }
        
        ctx.fillStyle = '#ffffff';
        ctx.font = `${currentSettings.wordCountLabelSize * scale}px ${currentSettings.font}, sans-serif`;
        ctx.fillText('Word Count', canvas.width / 2, currentSettings.wordCountLabelY * scale);
        
        ctx.font = `bold ${currentSettings.wordCountSize * scale}px ${currentSettings.font}, sans-serif`;
        ctx.fillText(wordCount, canvas.width / 2, currentSettings.wordCountY * scale);
    }

    function getRandomColor() {
        const colors = [
            '#3d3447', '#2c3e50', '#34495e', '#16a085', '#27ae60',
            '#2980b9', '#8e44ad', '#c0392b', '#d35400', '#7f8c8d',
            '#1abc9c', '#3498db', '#9b59b6', '#e74c3c', '#f39c12'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    async function generateFile() {
        const title = document.querySelector('h2.title')?.textContent.trim() || 'Untitled';
        const author = document.querySelector('a[rel="author"]')?.textContent.trim() || 'Anonymous';
        const series = document.querySelector('.series .position a')?.textContent.trim() || '';
        const wordCount = document.querySelector('dd.words')?.textContent.trim() || '0';
        
        const workId = window.location.pathname.match(/\/works\/(\d+)/)?.[1];
        if (!workId) throw new Error('Could not find work ID');
        
        const fileUrl = `https://archiveofourown.org/downloads/${workId}/${sanitizeFilename(title)}.${currentSettings.fileType}`;
        
        if (currentSettings.fileType !== 'epub') {
            const fileBlob = await downloadWithGM(fileUrl);
            const fileLink = document.createElement('a');
            fileLink.href = URL.createObjectURL(fileBlob);
            fileLink.download = `${sanitizeFilename(title)}.${currentSettings.fileType}`;
            document.body.appendChild(fileLink);
            fileLink.click();
            document.body.removeChild(fileLink);
            
            const coverImage = await generateFullCoverImage(title, author, series, wordCount);
            const coverLink = document.createElement('a');
            coverLink.href = coverImage;
            coverLink.download = `${sanitizeFilename(title)}_cover.png`;
            document.body.appendChild(coverLink);
            coverLink.click();
            document.body.removeChild(coverLink);
            
            return;
        }
        
        const JSZip = await jsZipPromise;
        if (!JSZip) throw new Error('JSZip library failed to load');
        
        const [epubBlob, coverImage] = await Promise.all([
            downloadWithGM(fileUrl),
            generateFullCoverImage(title, author, series, wordCount)
        ]);
        
        const zip = await JSZip.loadAsync(epubBlob);
        
        const coverData = coverImage.split(',')[1];
        zip.file('cover.png', coverData, {base64: true});
        
        let contentOpf = await zip.file('content.opf').async('string');
        contentOpf = addCoverToOpf(contentOpf);
        zip.file('content.opf', contentOpf);
        
        const coverFiles = zip.file(/cover\.xhtml/i);
        if (coverFiles.length === 0) {
            zip.file('cover.xhtml', createCoverXhtml());
        }
        
        const newEpub = await zip.generateAsync({
            type: 'blob',
            mimeType: 'application/epub+zip',
            compression: 'DEFLATE',
            compressionOptions: { level: 6 }
        });
        
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(newEpub);
        downloadLink.download = `${sanitizeFilename(title)}_cover.epub`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        
        setTimeout(() => URL.revokeObjectURL(downloadLink.href), 1000);
    }

    function generateFullCoverImage(title, author, series, wordCount) {
        return new Promise((resolve, reject) => {
            const canvas = document.createElement('canvas');
            canvas.width = 800;
            canvas.height = 1200;
            const ctx = canvas.getContext('2d', { alpha: false });
            
            if (currentSettings.customImage || currentSettings.imageUrl) {
                const img = new Image();
                img.crossOrigin = 'anonymous';
                
                img.onload = function() {
                    ctx.drawImage(img, 0, 0, 800, 1200);
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
                    ctx.fillRect(0, 0, 800, 1200);
                    drawFullText(ctx, title, author, series, wordCount);
                    resolve(canvas.toDataURL('image/png'));
                };
                
                img.onerror = function() {
                    drawFullColorCover(ctx, title, author, series, wordCount);
                    resolve(canvas.toDataURL('image/png'));
                };
                
                img.src = currentSettings.customImage || currentSettings.imageUrl;
            } else {
                drawFullColorCover(ctx, title, author, series, wordCount);
                resolve(canvas.toDataURL('image/png'));
            }
        });
    }

    function drawFullColorCover(ctx, title, author, series, wordCount) {
        if (!currentSettings.backgroundColor) {
            currentSettings.backgroundColor = getRandomColor();
        }
        
        ctx.fillStyle = currentSettings.backgroundColor;
        ctx.fillRect(0, 0, 800, 1200);
        
        const gradient = ctx.createLinearGradient(0, 0, 0, 1200);
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0.1)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 800, 1200);
        
        drawFullText(ctx, title, author, series, wordCount);
    }

    function drawFullText(ctx, title, author, series, wordCount) {
        ctx.font = `22px ${currentSettings.font}, sans-serif`;
        ctx.fillStyle = '#cccccc';
        ctx.textAlign = 'center';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        ctx.shadowBlur = 5;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.fillText('Archive of Our Own', 400, 70);
        
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 2;
        ctx.strokeRect(40, 40, 720, 1120);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${currentSettings.titleSize}px ${currentSettings.font}, sans-serif`;
        ctx.textAlign = 'center';
        const titleLines = wrapText(ctx, title, 680);
        let y = currentSettings.titleY;
        titleLines.forEach(line => {
            ctx.fillText(line, 400, y);
            y += currentSettings.titleSize * 1.3;
        });
        
        ctx.font = `${currentSettings.authorSize}px ${currentSettings.font}, sans-serif`;
        ctx.fillText(author, 400, currentSettings.authorY);
        
        if (series) {
            ctx.font = `${currentSettings.seriesSize}px ${currentSettings.font}, sans-serif`;
            ctx.fillStyle = '#e0e0e0';
            const seriesLines = wrapText(ctx, series, 680);
            let seriesY = currentSettings.seriesY;
            seriesLines.forEach(line => {
                ctx.fillText(line, 400, seriesY);
                seriesY += currentSettings.seriesSize * 1.4;
            });
        }
        
        ctx.fillStyle = '#ffffff';
        ctx.font = `${currentSettings.wordCountLabelSize}px ${currentSettings.font}, sans-serif`;
        ctx.fillText('Word Count', 400, currentSettings.wordCountLabelY);
        
        ctx.font = `bold ${currentSettings.wordCountSize}px ${currentSettings.font}, sans-serif`;
        ctx.fillText(wordCount, 400, currentSettings.wordCountY);
    }

    function wrapText(ctx, text, maxWidth) {
        const words = text.split(' ');
        const lines = [];
        let currentLine = words[0];
        
        for (let i = 1; i < words.length; i++) {
            const word = words[i];
            const width = ctx.measureText(currentLine + ' ' + word).width;
            if (width < maxWidth) {
                currentLine += ' ' + word;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        }
        lines.push(currentLine);
        return lines;
    }

    function downloadWithGM(url) {
        return new Promise((resolve, reject) => {
            const gmXHR = typeof GM !== 'undefined' && GM.xmlHttpRequest ? GM.xmlHttpRequest : GM_xmlhttpRequest;
            
            gmXHR({
                method: 'GET',
                url: url,
                responseType: 'blob',
                timeout: 30000,
                onload: function(response) {
                    if (response.status === 200) {
                        resolve(response.response);
                    } else {
                        reject(new Error('Download failed with status: ' + response.status));
                    }
                },
                onerror: function(error) {
                    reject(new Error('Network error downloading file'));
                },
                ontimeout: function() {
                    reject(new Error('Download timed out'));
                }
            });
        });
    }

    function createCoverXhtml() {
        return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops">
<head>
    <title>Cover</title>
    <style type="text/css">
        body { margin: 0; padding: 0; text-align: center; }
        div { width: 100%; height: 100%; display: block; }
        img { max-width: 100%; max-height: 100%; margin: 0; padding: 0; }
    </style>
</head>
<body>
    <div>
        <img src="cover.png" alt="Cover Image"/>
    </div>
</body>
</html>`;
    }

    function addCoverToOpf(opfContent) {
        if (!opfContent.includes('id="cover-image"') && !opfContent.includes('cover.png')) {
            const manifestEnd = opfContent.indexOf('</manifest>');
            const coverItem = '    <item id="cover-image" href="cover.png" media-type="image/png"/>\n';
            opfContent = opfContent.slice(0, manifestEnd) + coverItem + opfContent.slice(manifestEnd);
        }
        
        if (!opfContent.includes('id="coverpage"') && !opfContent.includes('cover.xhtml')) {
            const manifestEnd = opfContent.indexOf('</manifest>');
            const coverXhtmlItem = '    <item id="coverpage" href="cover.xhtml" media-type="application/xhtml+xml"/>\n';
            opfContent = opfContent.slice(0, manifestEnd) + coverXhtmlItem + opfContent.slice(manifestEnd);
        }
        
        if (!opfContent.includes('name="cover"')) {
            const metadataEnd = opfContent.indexOf('</metadata>');
            const coverMeta = '    <meta name="cover" content="cover-image"/>\n';
            opfContent = opfContent.slice(0, metadataEnd) + coverMeta + opfContent.slice(metadataEnd);
        }
        
        if (!opfContent.includes('idref="coverpage"')) {
            const spineStart = opfContent.indexOf('<spine');
            const spineEnd = opfContent.indexOf('>', spineStart) + 1;
            const coverSpine = '\n    <itemref idref="coverpage" linear="yes"/>';
            opfContent = opfContent.slice(0, spineEnd) + coverSpine + opfContent.slice(spineEnd);
        }
        
        return opfContent;
    }

    function sanitizeFilename(name) {
        return name.replace(/[^a-z0-9_\-]/gi, '_').substring(0, 100);
    }

    function loadJSZip() {
        return new Promise((resolve, reject) => {
            if (typeof JSZip !== 'undefined') {
                resolve(JSZip);
                return;
            }
            
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
            script.crossOrigin = 'anonymous';
            
            script.onload = () => {
                let attempts = 0;
                const checkInterval = setInterval(() => {
                    attempts++;
                    
                    if (typeof JSZip !== 'undefined') {
                        clearInterval(checkInterval);
                        resolve(JSZip);
                    } else if (typeof window.JSZip !== 'undefined') {
                        clearInterval(checkInterval);
                        resolve(window.JSZip);
                    } else if (attempts > 20) {
                        clearInterval(checkInterval);
                        reject(new Error('JSZip loaded but not accessible'));
                    }
                }, 50);
            };
            
            script.onerror = (e) => {
                reject(new Error('Failed to load JSZip library'));
            };
            
            document.head.appendChild(script);
        });
    }
})();