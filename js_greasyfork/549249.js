// ==UserScript==
// @name         osu!stickers
// @namespace    http://tampermonkey.net/
// @license      MIT 
// @version      1
// @description  add stickers selector for the bbcode-editor
// @author       -Izuki-
// @match        https://osu.ppy.sh/*
// @icon         https://cdn-icons-png.freepik.com/512/7933/7933774.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549249/osu%21stickers.user.js
// @updateURL https://update.greasyfork.org/scripts/549249/osu%21stickers.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
        .custom-bbcode-button {
            width: 26px;
            height: 26px;
            border: none;
            border-radius: 4px;
            background-color: #ff66aa;
            color: white;
            cursor: pointer;
            margin-left: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            background-image: url(https://cdn-icons-png.freepik.com/512/7933/7933774.png);
            background-size: 80%;
            background-repeat: no-repeat;
            background-position: center;
        }

        .custom-bbcode-button:hover {
            background-color: #e05599;
        }

        .custom-grid-container {
            position: absolute;
            bottom: -90px;
            right: 30px;
            margin-top: 5px;
            width: 385px;
            height: 390px;
            background: white;
            border: 2px solid #ff66aa;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            display: none;
            flex-direction: column;
            align-items: center;
        }

        .custom-grid-container.visible {
            display: flex;
        }

        .grid-items-wrapper {
            display: grid;
            grid-template-columns: repeat(3, 110px);
            grid-auto-rows: 90px;
            gap: 10px;
            overflow-y: auto;
            flex: 1;
            margin-bottom: 10px;
            padding: 10px;
        }

        .grid-item {
            background-color: #f8f8f8;
            border: 1px solid #ddd;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            color: #666;
            transition: all 0.2s ease;
            cursor: pointer;
            overflow: hidden;
            position: relative;
            height: 90px;
        }

        .grid-item:hover {
            background-color: #ffeff7;
            border-color: #ff66aa;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(255, 102, 170, 0.2);
        }

        .grid-item img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
        }

        .button-container {
            position: relative;
            display: inline-block;
        }

        .add-sticker-button {
            background-color: #ff66aa;
            color: white;
            border: none;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.2s ease;
            height: 40px;
            width: 90%;
            margin-bottom: 5px;
        }

        .add-sticker-button:hover {
            background-color: #e05599;
            transform: translateY(-2px);
        }

        .sticker-input-modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border: 2px solid #ff66aa;
            border-radius: 8px;
            padding: 20px;
            z-index: 10001;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            min-width: 300px;
        }

        .sticker-input-modal h3 {
            margin: 0 0 15px 0;
            color: #ff66aa;
            text-align: center;
        }

        .sticker-input-modal input {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            margin-bottom: 15px;
            box-sizing: border-box;
            color: black;
        }

        .sticker-input-modal button {
            width: 100%;
            padding: 10px;
            background-color: #ff66aa;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
        }

        .sticker-input-modal button:hover {
            background-color: #e05599;
        }

        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 10000;
        }

        .empty-grid-message {
            grid-column: span 3;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #999;
            font-style: italic;
            text-align: center;
            height: 90px;
        }

        .delete-sticker-btn {
            position: absolute;
            top: 5px;
            right: 5px;
            width: 20px;
            height: 20px;
            background-color: #ff4444;
            color: white;
            border: none;
            border-radius: 50%;
            font-size: 12px;
            font-weight: bold;
            cursor: pointer;
            display: none;
            align-items: center;
            justify-content: center;
            padding: 0;
            z-index: 2;
            transition: all 0.2s ease;
        }

        .delete-sticker-btn:hover {
            background-color: #ff0000;
            transform: scale(1.1);
        }

        .grid-item:hover .delete-sticker-btn {
            display: flex;
        }

        .sticker-content {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            z-index: 1;
        }

        .grid-items-wrapper::-webkit-scrollbar {
            width: 8px;
        }

        .grid-items-wrapper::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 4px;
        }

        .grid-items-wrapper::-webkit-scrollbar-thumb {
            background: #ff66aa;
            border-radius: 4px;
        }

        .grid-items-wrapper::-webkit-scrollbar-thumb:hover {
            background: #e05599;
        }
    `;
    document.head.appendChild(style);

    let userStickers = JSON.parse(localStorage.getItem('osuStickers')) || [];
    let currentUrl = window.location.href;

    function addStickerButton() {
        const bbcodeHeader = document.querySelector('.bbcode-editor__header');
        if (bbcodeHeader && !bbcodeHeader.querySelector('.custom-bbcode-button')) {
            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'button-container';

            const customButton = document.createElement('button');
            customButton.className = 'custom-bbcode-button';
            customButton.title = 'osu!Stickers';

            const gridContainer = document.createElement('div');
            gridContainer.className = 'custom-grid-container';

            const gridWrapper = document.createElement('div');
            gridWrapper.className = 'grid-items-wrapper';

            const addButton = document.createElement('button');
            addButton.className = 'add-sticker-button';
            addButton.textContent = '+ Add Sticker';
            addButton.type = 'button'; // Важно: предотвращает сабмит формы
            addButton.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                showStickerInputModal();
            });

            function updateGrid() {
                gridWrapper.innerHTML = '';

                if (userStickers.length === 0) {
                    const emptyMessage = document.createElement('div');
                    emptyMessage.className = 'empty-grid-message';
                    emptyMessage.textContent = 'No stickers added yet. Click "+ Add Sticker" to add some!';
                    gridWrapper.appendChild(emptyMessage);
                } else {
                    userStickers.forEach((url, index) => {
                        const gridItem = document.createElement('div');
                        gridItem.className = 'grid-item';

                        const stickerContent = document.createElement('div');
                        stickerContent.className = 'sticker-content';

                        const img = document.createElement('img');
                        img.src = url;
                        img.alt = `Sticker ${index + 1}`;
                        img.loading = 'lazy';
                        img.style.pointerEvents = 'none';

                        const deleteBtn = document.createElement('button');
                        deleteBtn.className = 'delete-sticker-btn';
                        deleteBtn.innerHTML = '×';
                        deleteBtn.title = 'Delete sticker';

                        deleteBtn.addEventListener('click', function(e) {
                            e.stopPropagation();
                            if (confirm('Delete this sticker?')) {
                                userStickers.splice(index, 1);
                                localStorage.setItem('osuStickers', JSON.stringify(userStickers));
                                updateGrid();
                            }
                        });

                        stickerContent.addEventListener('click', function(e) {
                            e.preventDefault();
                            e.stopPropagation();
                            if (e.target !== deleteBtn) {
                                insertSticker(url);
                                gridContainer.classList.remove('visible');
                            }
                        });

                        stickerContent.appendChild(img);
                        gridItem.appendChild(stickerContent);
                        gridItem.appendChild(deleteBtn);
                        gridWrapper.appendChild(gridItem);
                    });
                }
            }

            function showStickerInputModal() {
                const overlay = document.createElement('div');
                overlay.className = 'modal-overlay';

                const modal = document.createElement('div');
                modal.className = 'sticker-input-modal';

                modal.innerHTML = `
                    <h3>Add Sticker</h3>
                    <input type="url" placeholder="Enter image URL" id="sticker-url-input">
                    <button type="button" id="add-sticker-btn">Add Sticker</button>
                `;

                document.body.appendChild(overlay);
                document.body.appendChild(modal);

                const input = modal.querySelector('#sticker-url-input');
                const addBtn = modal.querySelector('#add-sticker-btn');

                input.focus();

                function closeModal() {
                    document.body.removeChild(overlay);
                    document.body.removeChild(modal);
                }

                addBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    const url = input.value.trim();
                    if (url) {
                        userStickers.push(url);
                        localStorage.setItem('osuStickers', JSON.stringify(userStickers));
                        updateGrid();
                        closeModal();
                    }
                });

                overlay.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    closeModal();
                });

                input.addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        addBtn.click();
                    }
                });
            }

            updateGrid();

            gridContainer.appendChild(gridWrapper);
            gridContainer.appendChild(addButton);
            buttonContainer.appendChild(customButton);
            buttonContainer.appendChild(gridContainer);
            bbcodeHeader.appendChild(buttonContainer);

            function toggleGrid(e) {
                if (e) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                gridContainer.classList.toggle('visible');
            }

            customButton.addEventListener('click', function(e) {
                toggleGrid(e);
            });

            document.addEventListener('click', function(e) {
                if (!buttonContainer.contains(e.target) && gridContainer.classList.contains('visible')) {
                    gridContainer.classList.remove('visible');
                }
            });

            gridContainer.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        }
    }

    function insertSticker(url) {
        const textarea = document.querySelector('.js-forum-topic-reply--input');
        if (textarea) {
            const bbcode = `[img]${url}[/img]`;
            const startPos = textarea.selectionStart;
            const endPos = textarea.selectionEnd;
            const text = textarea.value;

            textarea.value = text.substring(0, startPos) + bbcode + text.substring(endPos, text.length);

            textarea.selectionStart = startPos + bbcode.length;
            textarea.selectionEnd = startPos + bbcode.length;

            textarea.focus();

            const event = new Event('input', { bubbles: true });
            textarea.dispatchEvent(event);
        }
    }

    function checkUrlChange() {
        const newUrl = window.location.href;
        if (newUrl !== currentUrl) {
            currentUrl = newUrl;

            const bbcodeHeader = document.querySelector('.bbcode-editor__header');
            if (bbcodeHeader) {
                const existingButton = bbcodeHeader.querySelector('.custom-bbcode-button');
                if (existingButton) {
                    existingButton.closest('.button-container').remove();
                }
                addStickerButton();
            }
        }
    }

    setTimeout(addStickerButton, 2000);

    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                checkUrlChange();
                addStickerButton();
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    setInterval(checkUrlChange, 1000);

})();