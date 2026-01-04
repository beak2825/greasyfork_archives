// ==UserScript==
// @name         Qwen File extension Drop Fixer for chat.qwen.ai
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Allows any file to be dropped on chat.qwen.ai by renaming it to .txt before sending
// @author       Qwen3-Coder
// @match        https://chat.qwen.ai/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558785/Qwen%20File%20extension%20Drop%20Fixer%20for%20chatqwenai.user.js
// @updateURL https://update.greasyfork.org/scripts/558785/Qwen%20File%20extension%20Drop%20Fixer%20for%20chatqwenai.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("Qwen File Drop Fixer (Final Attempt) loaded.");

    // Создаём "скрытый" DataTransfer для подмены
    const createModifiedDataTransfer = (originalFiles) => {
        const newDt = new DataTransfer();
        originalFiles.forEach(file => {
            let newName = file.name;
            if (!newName.toLowerCase().endsWith('.txt')) {
                newName += '.txt';
            }
            const newFile = new File([file], newName, {
                type: file.type || 'text/plain',
                lastModified: file.lastModified,
            });
            newDt.items.add(newFile);
        });
        return newDt;
    };

    // Обработчик drop
    const handleDrop = function(e) {
        // Проверяем, не обрабатывалось ли событие ранее (например, из-за всплытия)
        if (e.defaultPrevented) {
            console.log("Drop event already prevented by another handler or script.");
            return;
        }

        const files = Array.from(e.dataTransfer.files);
        if (files.length === 0) {
            console.log("No files in the drop event.");
            return;
        }

        console.log("Original files dropped:", files);

        // Создаём новый DataTransfer с изменёнными файлами
        const modifiedDataTransfer = createModifiedDataTransfer(files);

        // Пытаемся подменить dataTransfer в событии
        // Это работает не во всех браузерах/сценариях, но пробуем
        try {
            Object.defineProperty(e, 'dataTransfer', {
                value: modifiedDataTransfer,
                writable: true
            });
        } catch (err) {
            // Если не удалось подменить, создаём *новое* событие drop с изменёнными данными
            // Но отправляем его *в оригинальный target*, чтобы попасть в нужный обработчик
            console.warn("Could not modify original event's dataTransfer, creating a new one.", err);

            const newDropEvent = new DragEvent('drop', {
                dataTransfer: modifiedDataTransfer,
                bubbles: true,
                cancelable: true,
                clientX: e.clientX,
                clientY: e.clientY,
                screenX: e.screenX,
                screenY: e.screenY,
            });

            // Чтобы избежать рекурсии, добавляем свойство, которое можно проверить
            // Но используем его аккуратно
            newDropEvent._qwen_drop_fixer_processed = true;

            console.log("Dispatching new drop event with modified files to target.");
            e.target.dispatchEvent(newDropEvent);
            e.preventDefault(); // Останавливаем оригинальное
            return; // Выходим, чтобы не продолжать логику ниже
        }

        // Если удалось подменить dataTransfer, просто вызываем preventDefault
        // и позволяем оригинальному обработчику Qwen использовать изменённые файлы
        e.preventDefault();
        console.log("Successfully modified original event's dataTransfer. Allowing Qwen's handler to process.");
    };

    document.addEventListener('dragover', function(e) {
        e.preventDefault();
        e.stopPropagation();
    }, true);

    // ВАЖНО: используем capture, чтобы сработать раньше внутренних обработчиков
    document.addEventListener('drop', handleDrop, true);
})();
