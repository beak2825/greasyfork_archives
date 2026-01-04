// ==UserScript==
// @name         Простой Ридер Текста
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  Легковесный скрипт для чтения вслух текста со страниц. Чтение с места клика, регулировка скорости, базовый скроллинг.
// @author       You
// @match        *://*/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550387/%D0%9F%D1%80%D0%BE%D1%81%D1%82%D0%BE%D0%B9%20%D0%A0%D0%B8%D0%B4%D0%B5%D1%80%20%D0%A2%D0%B5%D0%BA%D1%81%D1%82%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/550387/%D0%9F%D1%80%D0%BE%D1%81%D1%82%D0%BE%D0%B9%20%D0%A0%D0%B8%D0%B4%D0%B5%D1%80%20%D0%A2%D0%B5%D0%BA%D1%81%D1%82%D0%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Функция для создания панели поддержки
    function createSupportPanel() {
        if (document.getElementById('ttsSupportPanel')) {
            return;
        }

        const supportPanel = document.createElement('div');
        supportPanel.id = 'ttsSupportPanel';
        supportPanel.innerHTML = `
            <div style="text-align: center; line-height: 1.3;">
                Если вам нравится скрипт, вы можете сделать добровольный взнос:<br>
                <a href="https://finance.ozon.ru/apps/sbp/ozonbankpay/01997254-f6d5-7d4c-8a72-15f9a62fea9d" 
                   target="_blank" 
                   style="color: #0066cc; text-decoration: none; font-weight: bold;">
                    Поддержать проект
                </a>
            </div>
        `;

        Object.assign(supportPanel.style, {
            position: 'fixed',
            bottom: '10px',
            right: '10px',
            background: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '8px 12px',
            fontSize: '11px',
            fontFamily: 'Arial, sans-serif',
            color: '#666',
            zIndex: '9999',
            maxWidth: '200px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            backdropFilter: 'blur(5px)',
            opacity: '0.8',
            transition: 'opacity 0.3s ease'
        });

        supportPanel.addEventListener('mouseenter', () => {
            supportPanel.style.opacity = '1';
        });

        supportPanel.addEventListener('mouseleave', () => {
            supportPanel.style.opacity = '0.8';
        });

        try {
            document.body.appendChild(supportPanel);
        } catch (e) {
            document.documentElement.appendChild(supportPanel);
        }

        return supportPanel;
    }

    // Функция для безопасного добавления панели
    function createControlPanel() {
        if (document.getElementById('ttsControlPanel')) {
            return;
        }

        const controlPanel = document.createElement('div');
        controlPanel.id = 'ttsControlPanel';
        controlPanel.innerHTML = `
            <div style="padding: 5px; cursor: move; border-bottom: 1px solid #ccc; background: #f0f0f0; border-radius: 5px 5px 0 0; font-size: 12px;">📢 Ридер Текста</div>
            <div style="padding: 5px;">
                <button id="ttsPlay" style="margin: 2px; padding: 5px;">▶️</button>
                <button id="ttsPause" style="margin: 2px; padding: 5px;">⏸️</button>
                <button id="ttsStop" style="margin: 2px; padding: 5px;">⏹️</button>
                <button id="ttsFaster" style="margin: 2px; padding: 5px; font-size: 10px;">⏩ +</button>
                <button id="ttsSlower" style="margin: 2px; padding: 5px; font-size: 10px;">⏪ -</button>
                <div style="margin-top: 5px; font-size: 11px; text-align: center;">
                    Скорость: <span id="speedValue">1.0</span>x
                </div>
                <button id="ttsResetSpeed" style="margin: 2px; padding: 3px; font-size: 9px; width: 100%;">Сбросить скорость</button>
            </div>
            <div style="padding: 5px; background: #f9f9f9; border-top: 1px solid #eee; font-size: 9px; text-align: center; color: #666;">
                Двойной клик по тексту для чтения с места
            </div>
        `;

        Object.assign(controlPanel.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: 'white',
            border: '1px solid #ccc',
            borderRadius: '5px',
            zIndex: '10000',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            userSelect: 'none',
            minWidth: '140px',
            fontFamily: 'Arial, sans-serif'
        });

        document.body.appendChild(controlPanel);

        return controlPanel;
    }

    // Функции для работы с localStorage
    function saveSettings() {
        try {
            localStorage.setItem('ttsReadingSpeed', currentRate.toString());
        } catch (e) {
            console.log('Не удалось сохранить настройки:', e);
        }
    }

    function loadSettings() {
        try {
            const savedSpeed = localStorage.getItem('ttsReadingSpeed');
            if (savedSpeed) {
                const speed = parseFloat(savedSpeed);
                if (speed >= 0.5 && speed <= 3.0) {
                    currentRate = speed;
                }
            }
        } catch (e) {
            console.log('Не удалось загрузить настройки:', e);
        }
    }

    // Ждем полной загрузки DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Переменные для управления речью
    let speechInstance = null;
    let isPaused = false;
    let currentRate = 1.0;
    let currentText = '';
    let isManualStop = false;
    let wordBoundaries = [];
    let currentWordIndex = 0;
    let speechStartTime = 0;
    let estimatedPosition = 0;

    function init() {
        setTimeout(() => {
            const controlPanel = createControlPanel();
            const supportPanel = createSupportPanel();
            if (controlPanel) {
                loadSettings();
                setupEventListeners();
                setupDoubleClickHandler();
                makePanelDraggable(controlPanel);
                updateSpeedDisplay();
            }
        }, 1000);
    }

    // Функция для настройки обработчика двойного клика
    function setupDoubleClickHandler() {
        document.addEventListener('dblclick', handleDoubleClick);
    }

    // Обработчик двойного клика
    function handleDoubleClick(event) {
        if (event.target.closest('#ttsControlPanel') || event.target.closest('#ttsSupportPanel')) {
            return;
        }

        const selection = window.getSelection();
        let targetElement = event.target;
        
        if (selection.toString().trim().length > 0) {
            const range = selection.getRangeAt(0);
            targetElement = range.commonAncestorContainer;
            
            if (targetElement.nodeType === Node.TEXT_NODE) {
                targetElement = targetElement.parentElement;
            }
        }

        const startPosition = findTextPosition(targetElement);
        if (startPosition !== -1) {
            playFromPosition(startPosition);
        }
    }

    // Находим позицию в тексте для начала чтения
    function findTextPosition(element) {
        if (!currentText) {
            currentText = extractMainText();
            if (!currentText) {
                alert('Сначала нажмите кнопку воспроизведения для извлечения текста');
                return -1;
            }
            wordBoundaries = calculateWordBoundaries(currentText);
        }

        const elementText = element.textContent || '';
        if (!elementText.trim()) return -1;

        const elementTextClean = cleanTextSimple(elementText);
        const position = currentText.indexOf(elementTextClean);
        
        if (position === -1) {
            const words = elementTextClean.split(/\s+/).filter(w => w.length > 2);
            if (words.length > 0) {
                for (let word of words) {
                    const wordPosition = currentText.indexOf(word);
                    if (wordPosition !== -1) {
                        return wordPosition;
                    }
                }
            }
            return -1;
        }

        return position;
    }

    // Функция для обновления отображения скорости
    function updateSpeedDisplay() {
        const speedElement = document.getElementById('speedValue');
        if (speedElement) {
            speedElement.textContent = currentRate.toFixed(1);
            if (currentRate > 1.0) {
                speedElement.style.color = '#e74c3c';
            } else if (currentRate < 1.0) {
                speedElement.style.color = '#3498db';
            } else {
                speedElement.style.color = '#2c3e50';
            }
        }
    }

    // ПРОСТАЯ функция для извлечения текста
    function extractMainText() {
        // Стратегия 1: Ищем по специфичным селекторам
        const selectors = [
            'article', 'main', '[role="main"]', '.article', '.story', '.news',
            '.content', '.post-content', '.article-content', '.news-content',
            '.entry-content', '.story-content', '.text-content', '.text'
        ];

        for (let selector of selectors) {
            const elements = document.querySelectorAll(selector);
            for (let element of elements) {
                if (isValidContentElement(element)) {
                    const text = extractCleanText(element);
                    if (text && text.length > 200) {
                        return text;
                    }
                }
            }
        }

        // Стратегия 2: Ищем самый большой текстовый блок
        const elements = document.querySelectorAll('p, div, section, article, main');
        let bestElement = null;
        let maxLength = 0;

        for (let element of elements) {
            if (isValidContentElement(element)) {
                const text = extractCleanText(element);
                if (text && text.length > maxLength) {
                    maxLength = text.length;
                    bestElement = element;
                }
            }
        }

        if (bestElement && maxLength > 300) {
            return extractCleanText(bestElement);
        }

        return null;
    }

    // Извлекаем чистый текст из элемента
    function extractCleanText(element) {
        const clone = element.cloneNode(true);
        removeUnwantedElements(clone);
        
        const paragraphs = clone.querySelectorAll('p, h1, h2, h3, h4, h5, h6');
        const textParts = [];
        
        for (let p of paragraphs) {
            const text = cleanTextSimple(p.textContent);
            if (text && text.length > 20) {
                textParts.push(text);
            }
        }
        
        return textParts.length > 0 ? textParts.join('\n\n') : cleanTextSimple(clone.textContent);
    }

    // УПРОЩЕННАЯ очистка текста
    function cleanTextSimple(text) {
        if (!text) return '';
        
        return text
            .replace(/https?:\/\/[^\s]+/g, '')
            .replace(/www\.[^\s]+/g, '')
            .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '')
            .replace(/\b[a-zA-Z]{1,2}\b/g, '')
            .replace(/[^\w\u0400-\u04FF\s\.\,\!\?\-\:\(\)«»]/g, '')
            .replace(/\s+/g, ' ')
            .replace(/\n+/g, ' ')
            .trim();
    }

    // Удаляем только очевидный мусор
    function removeUnwantedElements(element) {
        const unwantedSelectors = [
            'nav', 'header', 'footer', 'aside', 'menu',
            '.nav', '.navigation', '.header', '.footer', '.sidebar',
            '.menu', '.breadcrumb', '.pagination',
            '.ad', '.advertisement', '.banner', '.ads',
            '.social', '.share', '.comments', '.comment',
            'script', 'style', 'img', 'picture', 'video', 'audio', 'iframe'
        ];
        
        unwantedSelectors.forEach(selector => {
            const elements = element.querySelectorAll(selector);
            elements.forEach(el => el.remove());
        });
    }

    // Проверяем валидность контентного элемента
    function isValidContentElement(element) {
        if (!element || element.offsetParent === null) return false;
        
        const style = window.getComputedStyle(element);
        if (style.display === 'none' || style.visibility === 'hidden') return false;
        
        if (element.closest('nav, header, footer, aside, .nav, .header, .footer, .sidebar')) {
            return false;
        }
        
        return true;
    }

    // Функция для разбивки текста на слова
    function calculateWordBoundaries(text) {
        const words = text.split(/\s+/);
        const boundaries = [];
        let position = 0;
        
        for (let word of words) {
            if (word.trim()) {
                boundaries.push({
                    start: position,
                    end: position + word.length,
                    word: word
                });
                position += word.length + 1;
            }
        }
        
        return boundaries;
    }

    // Функция для оценки текущей позиции
    function estimateCurrentPosition() {
        if (!speechStartTime) return 0;
        
        const elapsedTime = (Date.now() - speechStartTime) / 1000;
        const estimatedChars = Math.floor(elapsedTime * currentRate * 12);
        
        return Math.min(estimatedChars, currentText.length);
    }

    // Функция для поиска текущего слова по позиции
    function findCurrentWordIndex(position) {
        for (let i = 0; i < wordBoundaries.length; i++) {
            if (position >= wordBoundaries[i].start && position < wordBoundaries[i].end) {
                return i;
            }
        }
        return Math.min(position, wordBoundaries.length - 1);
    }

    // Функция для начала чтения с позиции
    function playFromPosition(startPosition = 0) {
        if (!currentText) {
            currentText = extractMainText();
            if (!currentText || currentText.length < 50) {
                alert('Не удалось найти текст для чтения.');
                return;
            }
            wordBoundaries = calculateWordBoundaries(currentText);
        }

        const textToRead = currentText.substring(startPosition);
        if (textToRead.length < 10) return;

        speechSynthesis.cancel();

        speechInstance = new SpeechSynthesisUtterance(textToRead);
        speechInstance.lang = 'ru-RU';
        speechInstance.rate = currentRate;

        speechStartTime = Date.now();
        currentWordIndex = findCurrentWordIndex(startPosition);

        speechInstance.onend = () => {
            if (!isManualStop) {
                speechInstance = null;
                isPaused = false;
                currentWordIndex = 0;
            }
            isManualStop = false;
        };

        speechInstance.onerror = (event) => {
            if (!isManualStop && event.error !== 'interrupted') {
                console.error('Ошибка TTS:', event);
            }
            isManualStop = false;
        };

        isManualStop = false;
        speechSynthesis.speak(speechInstance);
    }

    // Основная функция чтения
    function playText() {
        if (isPaused && speechInstance) {
            speechSynthesis.resume();
            speechStartTime = Date.now() - (estimatedPosition / (currentRate * 12)) * 1000;
            isPaused = false;
            return;
        }

        if (speechSynthesis.speaking && !isPaused) {
            estimatedPosition = estimateCurrentPosition();
            playFromPosition(estimatedPosition);
            return;
        }

        currentText = extractMainText();
        if (!currentText || currentText.length < 50) {
            alert('Не удалось найти текст для чтения.');
            return;
        }

        wordBoundaries = calculateWordBoundaries(currentText);
        currentWordIndex = 0;
        playFromPosition(0);
    }

    function pauseSpeech() {
        if (speechSynthesis.speaking && !isPaused) {
            estimatedPosition = estimateCurrentPosition();
            speechSynthesis.pause();
            isPaused = true;
        }
    }

    function stopSpeech() {
        isManualStop = true;
        speechSynthesis.cancel();
        isPaused = false;
        speechInstance = null;
        currentWordIndex = 0;
    }

    function increaseSpeed() {
        if (currentRate < 3.0) {
            currentRate += 0.1;
            updateSpeedDisplay();
            saveSettings();
            
            if (speechSynthesis.speaking && !isPaused) {
                estimatedPosition = estimateCurrentPosition();
                playFromPosition(estimatedPosition);
            }
        }
    }

    function decreaseSpeed() {
        if (currentRate > 0.5) {
            currentRate -= 0.1;
            updateSpeedDisplay();
            saveSettings();
            
            if (speechSynthesis.speaking && !isPaused) {
                estimatedPosition = estimateCurrentPosition();
                playFromPosition(estimatedPosition);
            }
        }
    }

    function resetSpeedToDefault() {
        currentRate = 1.0;
        updateSpeedDisplay();
        saveSettings();
    }

    function setupEventListeners() {
        document.getElementById('ttsPlay').addEventListener('click', playText);
        document.getElementById('ttsPause').addEventListener('click', pauseSpeech);
        document.getElementById('ttsStop').addEventListener('click', stopSpeech);
        document.getElementById('ttsFaster').addEventListener('click', increaseSpeed);
        document.getElementById('ttsSlower').addEventListener('click', decreaseSpeed);
        document.getElementById('ttsResetSpeed').addEventListener('click', resetSpeedToDefault);
    }

    function makePanelDraggable(panel) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        const header = panel.querySelector('div');

        header.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            panel.style.top = (panel.offsetTop - pos2) + "px";
            panel.style.left = (panel.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
})();