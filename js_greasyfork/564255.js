// ==UserScript==
// @name         Кнопки для Лолза
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Легко используем кнопки для Лолза!
// @author       Forest
// @match        https://lolz.live/*
// @match        https://zelenka.guru/*
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/564255/%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8%20%D0%B4%D0%BB%D1%8F%20%D0%9B%D0%BE%D0%BB%D0%B7%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/564255/%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8%20%D0%B4%D0%BB%D1%8F%20%D0%9B%D0%BE%D0%BB%D0%B7%D0%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addButtonToMenu() {
        let dropdownList = document.querySelector('.fr-dropdown-content ul.fr-dropdown-list');

        if (!dropdownList) return;
        if (document.querySelector('[data-cmd="lztButton"]')) return;

        let menuItem = document.createElement('li');
        menuItem.innerHTML = `
            <a class="fr-command" data-cmd="lztButton" style="cursor: pointer;">
                <i class="fal fa-square fa-fw" aria-hidden="true"></i>&nbsp;&nbsp;Кнопка
            </a>
        `;

        dropdownList.appendChild(menuItem);

        let btnLink = menuItem.querySelector('a');
        btnLink.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            openButtonGenerator();

            let insertBtn = document.querySelector('[data-cmd="lztInsert"]');
            if (insertBtn) {
                insertBtn.classList.remove('fr-active');
                insertBtn.setAttribute('aria-expanded', 'false');
            }

            let tippy = document.querySelector('[data-tippy-root]');
            if (tippy) {
                tippy.style.visibility = 'hidden';
            }
        };
    }

    function openButtonGenerator() {
        let existingModal = document.getElementById('lzt-btn-modal');
        if (existingModal) existingModal.remove();

        let modal = document.createElement('div');
        modal.id = 'lzt-btn-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.85);
            backdrop-filter: blur(8px);
            z-index: 99999;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.2s ease;
        `;

        let modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: #1e1e1e;
            border-radius: 16px;
            padding: 28px;
            max-width: 500px;
            width: 90%;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
            animation: slideUp 0.3s ease;
            border: 1px solid #333;
            position: relative;
        `;

        modalContent.innerHTML = `
            <button id="btn-close" style="position: absolute; top: 16px; right: 16px; width: 32px; height: 32px; background: #2a2a2a; color: #aaa; border: 1px solid #3a3a3a; border-radius: 8px; font-size: 16px; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; padding: 0;">
                <i class="fal fa-times"></i>
            </button>

            <h2 style="color: #fff; margin: 0 0 24px 0; font-size: 22px; font-weight: 600; display: flex; align-items: center; gap: 10px; padding-right: 40px;">
                <i class="fal fa-square" style="color: #667eea;"></i>
                Создать кнопку
            </h2>

            <div style="margin-bottom: 18px;">
                <label style="color: #aaa; display: block; margin-bottom: 8px; font-size: 13px; font-weight: 500;">
                    Текст на кнопке <span style="color: #555;">(макс. 50 символов)</span>
                </label>
                <input type="text" id="btn-text" placeholder="Напишите текст для кнопки" value="" maxlength="50"
                    style="width: 100%; padding: 11px 14px; background: #2a2a2a; border: 1px solid #3a3a3a; border-radius: 8px; color: #fff; font-size: 14px; box-sizing: border-box; transition: border 0.2s;">
                <div style="color: #555; font-size: 11px; margin-top: 4px; text-align: right;">
                    <span id="char-count">0</span>/50
                </div>
            </div>

            <div style="margin-bottom: 18px;">
                <label style="color: #aaa; display: block; margin-bottom: 8px; font-size: 13px; font-weight: 500;">
                    Ссылка
                </label>
                <input type="text" id="btn-url" placeholder="https://lolz.live/" value=""
                    style="width: 100%; padding: 11px 14px; background: #2a2a2a; border: 1px solid #3a3a3a; border-radius: 8px; color: #fff; font-size: 14px; box-sizing: border-box; transition: border 0.2s;">
            </div>

            <div style="margin-bottom: 22px;">
                <label style="color: #aaa; display: block; margin-bottom: 8px; font-size: 13px; font-weight: 500;">
                    Выравнивание
                </label>
                <div style="display: flex; gap: 8px;">
                    <button class="align-btn" data-align="left" style="flex: 1; padding: 10px; background: #2a2a2a; border: 1px solid #3a3a3a; border-radius: 8px; color: #aaa; cursor: pointer; transition: all 0.2s; font-size: 13px;">
                        <i class="fal fa-align-left"></i> Слева
                    </button>
                    <button class="align-btn active" data-align="center" style="flex: 1; padding: 10px; background: #667eea; border: 1px solid #667eea; border-radius: 8px; color: #fff; cursor: pointer; transition: all 0.2s; font-size: 13px;">
                        <i class="fal fa-align-center"></i> Центр
                    </button>
                    <button class="align-btn" data-align="right" style="flex: 1; padding: 10px; background: #2a2a2a; border: 1px solid #3a3a3a; border-radius: 8px; color: #aaa; cursor: pointer; transition: all 0.2s; font-size: 13px;">
                        <i class="fal fa-align-right"></i> Справа
                    </button>
                </div>
            </div>

            <div style="margin-bottom: 22px; padding: 18px; background: #2a2a2a; border-radius: 10px; border: 1px solid #3a3a3a;">
                <label style="color: #aaa; display: block; margin-bottom: 10px; font-size: 13px; font-weight: 500;">
                    Предпросмотр
                </label>
                <div id="btn-preview" style="text-align: center; color: #666;">
                    Введите текст и ссылку
                </div>
            </div>

            <div style="display: flex; gap: 10px;">
                <button id="btn-insert" style="flex: 1; padding: 12px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.3s ease;">
                    <i class="fal fa-check"></i> Вставить
                </button>
            </div>
        `;

        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        if (!document.getElementById('lzt-btn-styles')) {
            let style = document.createElement('style');
            style.id = 'lzt-btn-styles';
            style.textContent = `
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                #btn-text:focus, #btn-url:focus {
                    border-color: #667eea !important;
                    outline: none;
                }
                .align-btn:hover {
                    background: #3a3a3a !important;
                }
                #btn-insert:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
                }
                #btn-close:hover {
                    background: #3a3a3a !important;
                    border-color: #4a4a4a !important;
                }
            `;
            document.head.appendChild(style);
        }

        let textInput = document.getElementById('btn-text');
        let urlInput = document.getElementById('btn-url');
        let alignBtns = document.querySelectorAll('.align-btn');
        let preview = document.getElementById('btn-preview');
        let insertBtn = document.getElementById('btn-insert');
        let closeBtn = document.getElementById('btn-close');
        let charCount = document.getElementById('char-count');

        let currentAlign = 'center';

        textInput.oninput = () => {
            charCount.textContent = textInput.value.length;
            if (textInput.value.length > 40) {
                charCount.style.color = '#f5576c';
            } else {
                charCount.style.color = '#555';
            }
            updatePreview();
        };

        alignBtns.forEach(btn => {
            btn.onclick = () => {
                alignBtns.forEach(b => {
                    b.classList.remove('active');
                    b.style.background = '#2a2a2a';
                    b.style.borderColor = '#3a3a3a';
                    b.style.color = '#aaa';
                });
                btn.classList.add('active');
                btn.style.background = '#667eea';
                btn.style.borderColor = '#667eea';
                btn.style.color = '#fff';
                currentAlign = btn.getAttribute('data-align');
                updatePreview();
            };
        });

        function updatePreview() {
            let text = textInput.value;
            let url = urlInput.value;

            if (!text || !url) {
                preview.style.color = '#666';
                preview.textContent = 'Введите текст и ссылку';
                return;
            }

            preview.style.textAlign = currentAlign;
            preview.innerHTML = `
                <a href="${url}" target="_blank" class="button primary" style="margin-bottom: 10px; pointer-events: none;">
                    ${text}
                </a>
            `;
        }

        function generateBBCode() {
            let text = textInput.value;
            let url = urlInput.value;

            if (!text || !url) return null;

            let alignTag = currentAlign.toUpperCase();
            return `[${alignTag}][button=${url}]${text}[/button][/${alignTag}]`;
        }

        urlInput.oninput = updatePreview;

        insertBtn.onclick = () => {
            let bbCode = generateBBCode();

            if (!bbCode) {
                alert('Пожалуйста, заполните текст и ссылку');
                return;
            }

            let editor = document.querySelector('.fr-element.fr-view');

            if (editor) {
                let p = document.createElement('p');
                p.textContent = bbCode;
                editor.appendChild(p);
                editor.appendChild(document.createElement('br'));

                insertBtn.innerHTML = '<i class="fal fa-check"></i> Вставлено!';
                insertBtn.style.background = 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)';

                setTimeout(() => {
                    modal.remove();
                }, 800);
            } else {
                alert('Редактор не найден.');
            }
        };

        closeBtn.onclick = () => modal.remove();

        modalContent.onclick = (e) => {
            e.stopPropagation();
        };

        setTimeout(() => textInput.focus(), 100);
    }

    const observer = new MutationObserver((mutations) => {
        for (let mutation of mutations) {
            for (let node of mutation.addedNodes) {
                if (node.nodeType === 1) {
                    if (node.querySelector && node.querySelector('.fr-dropdown-list')) {
                        setTimeout(addButtonToMenu, 50);
                    }
                    if (node.classList && node.classList.contains('fr-dropdown-content')) {
                        setTimeout(addButtonToMenu, 50);
                    }
                }
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    setTimeout(addButtonToMenu, 1000);
    setTimeout(addButtonToMenu, 2000);

    console.log('LZT Button Generator активирован');
})();