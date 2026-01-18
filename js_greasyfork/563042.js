// ==UserScript==
// @name         ! Кнопки для Телефона
// @match        https://forum.blackrussia.online/*
// @version      1.0.7
// @license      none
// @namespace    Botir_Soliev https://vk.com/botsol
// @grant        GM_addStyle
// @icon         https://i.postimg.cc/sgKbLbj9/verify-icon-png.jpg
// @description  Кнопки с авторасстановкой и размерами
// @downloadURL
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/563042/%21%20%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8%20%D0%B4%D0%BB%D1%8F%20%D0%A2%D0%B5%D0%BB%D0%B5%D1%84%D0%BE%D0%BD%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/563042/%21%20%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8%20%D0%B4%D0%BB%D1%8F%20%D0%A2%D0%B5%D0%BB%D0%B5%D1%84%D0%BE%D0%BD%D0%B0.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const menuButtonPosition = {
        top: '10px',
        right: '80px',
    };

    GM_addStyle(`
    .menu-toggle-button {
        position: fixed;
        top: ${menuButtonPosition.top};
        right: ${menuButtonPosition.right};
        z-index: 10000;
        width: 60px;
        height: 35px;
        background-color: #333;
        color: white;
        border: none;
        border-radius: 5px;
        font-size: 14px;
        padding: 8px 12px;
        font-family: 'Roboto', sans-serif;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .menu-toggle-button:hover {
        background-color: #555;
    }

    .nav-button-container {
        position: fixed;
        left: 50%;
        top: 50px;
        transform: translateX(-50%);
        z-index: 9999;
        display: none;
        flex-wrap: wrap;
        justify-content: space-between;
        width: 95vw;
        max-width: 600px;
        max-height: 80vh;
        overflow-y: auto;
        padding: 15px;
        background-color: rgba(0, 0, 0, 0.9);
        border-radius: 10px;
        box-sizing: border-box;
    }

    .button-row {
        display: flex;
        justify-content: space-between;
        width: 100%;
        margin-bottom: 8px;
    }

    .custom-button {
        color: white;
        padding: 8px 4px;
        border: none;
        border-radius: 5px;
        font-size: 12px;
        cursor: pointer;
        box-shadow: 0 2px 2px rgba(0, 0, 0, 0.5);
        transition: background-color 0.3s, transform 0.2s;
        width: 32%;
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        box-sizing: border-box;
        font-family: 'Roboto', sans-serif;
        height: 35px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    }

    .custom-button:hover {
        opacity: 0.8;
        transform: scale(1.05);
    }

    @media (max-width: 768px) {
        .custom-button {
            font-size: 11px;
            padding: 6px 3px;
            height: 32px;
        }
    }

    @media (max-width: 480px) {
        .nav-button-container {
            width: 98vw;
            padding: 10px;
        }

        .custom-button {
            font-size: 10px;
            padding: 5px 2px;
            height: 30px;
        }
    }

    @media (max-width: 360px) {
        .custom-button {
            font-size: 9px;
            padding: 4px 1px;
            height: 28px;
        }
    }

    .nav-button-container::-webkit-scrollbar {
        width: 6px;
    }

    .nav-button-container::-webkit-scrollbar-track {
        background: rgba(255,255,255,0.1);
        border-radius: 3px;
    }

    .nav-button-container::-webkit-scrollbar-thumb {
        background: #ff4500;
        border-radius: 3px;
    }
    .nav-button-container::-webkit-scrollbar-thumb:hover {
        background: #333;
    }
`);

    const buttons = [
        {
            cat: '1',
            text: 'ОПС',
            link: 'https://forum.blackrussia.online/threads/Общие-правила-серверов.312571/',
            backgroundColor: '#FFFFFF',
            textColor: 'black',
            newTab: true,
        },
        {
            cat: '1',
            text: 'ФА',
            link: 'https://forum.blackrussia.online/members/.392625/',
            backgroundColor: '#FFFFFF',
            textColor: 'black',
//            newTab: true,
        },
        {
            cat: '1',
            text: 'АДМ.РАЗДЕЛ',
            link: 'https://forum.blackrussia.online/forums/Админ-раздел.1098/',
            backgroundColor: '#FFFFFF',
            textColor: 'black'
        },
        {
            cat: '2',
            text: 'Лидеры',
            link: 'https://forum.blackrussia.online/forums/Лидеры.3191/',
            backgroundColor: '#0000FF',
            textColor: 'White',
            newTab: true,
        },
        {
            cat: '2',
            text: 'Хелперка',
            link: 'https://forum.blackrussia.online/forums/Агенты-поддержки.3190/',
            backgroundColor: '#0000FF',
            textColor: 'White',
//            newTab: true,
        },

        {
            cat: '2',
            text: 'ЖБ.АДМ',
            link: 'https://forum.blackrussia.online/forums/Жалобы-на-администрацию.1122/',
            backgroundColor: '#0000FF',
            textColor: 'White'
        },
        {
            cat: '3',
            text: 'ЖБ.ЛИД',
            link: 'https://forum.blackrussia.online/forums/Жалобы-на-лидеров.1123/',
            backgroundColor: '#FF0000',
            textColor: 'White'
        },
        {
            cat: '3',
            text: 'ЖБ.ИГР',
            link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.1124/',
            backgroundColor: '#FF0000',
            textColor: 'White'
        },
        {
            cat: '3',
            text: 'ОБЖАЛ',
            link: 'https://forum.blackrussia.online/forums/Обжалование-наказаний.1125/',
            backgroundColor: '#FF0000',
            textColor: 'White'
        },

    ];

    const menuToggleButton = document.createElement('button');
    menuToggleButton.className = 'menu-toggle-button';
    menuToggleButton.textContent = 'Меню';
    document.body.appendChild(menuToggleButton);

    const container = document.createElement('div');
    container.className = 'nav-button-container';

    const groupedButtons = {};
    buttons.forEach(button => {
        if (!groupedButtons[button.cat]) {
            groupedButtons[button.cat] = [];
        }
        groupedButtons[button.cat].push(button);
    });

    Object.keys(groupedButtons).forEach(cat => {
        const row = document.createElement('div');
        row.className = 'button-row';

        groupedButtons[cat].forEach(buttonConfig => {
            const button = document.createElement('button');
            button.className = 'custom-button';
            button.textContent = buttonConfig.text;
            button.style.backgroundColor = buttonConfig.backgroundColor;
            button.style.color = buttonConfig.textColor;

            button.addEventListener('click', () => {
                if (buttonConfig.newTab) {
                    window.open(buttonConfig.link, '_blank');
                } else {
                    window.location.href = buttonConfig.link;
                }
            });

            row.appendChild(button);
        });

        container.appendChild(row);
    });

    document.body.appendChild(container);

    menuToggleButton.addEventListener('click', function() {
        const isVisible = container.style.display === 'flex';
        container.style.display = isVisible ? 'none' : 'flex';

        if (!isVisible) {
            setTimeout(() => {
                document.addEventListener('click', closeMenuOnClickOutside);
            }, 10);
        } else {
            document.removeEventListener('click', closeMenuOnClickOutside);
        }
    });

    function closeMenuOnClickOutside(event) {
        if (!container.contains(event.target) && event.target !== menuToggleButton) {
            container.style.display = 'none';
            document.removeEventListener('click', closeMenuOnClickOutside);
        }
    }

    window.addEventListener('resize', function() {
        container.style.display = 'none';
        document.removeEventListener('click', closeMenuOnClickOutside);
    });

})();