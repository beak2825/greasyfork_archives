// ==UserScript==
// @name         ORANGE | Кнопки переходники между разделами
// @namespace    https://forum.blackrussia.online
// @version      0.0.8
// @description  Кнопки с автоматическим переносом
// @author       Dany_Forbs
// @match        https://forum.blackrussia.online/*
// @include      https://forum.blackrussia.online/
// @grant        none
// @license      MIT
// @icon         https://i.postimg.cc/nczLcDV9/i-1.jpg
// @downloadURL https://update.greasyfork.org/scripts/552055/ORANGE%20%7C%20%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8%20%D0%BF%D0%B5%D1%80%D0%B5%D1%85%D0%BE%D0%B4%D0%BD%D0%B8%D0%BA%D0%B8%20%D0%BC%D0%B5%D0%B6%D0%B4%D1%83%20%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB%D0%B0%D0%BC%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/552055/ORANGE%20%7C%20%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8%20%D0%BF%D0%B5%D1%80%D0%B5%D1%85%D0%BE%D0%B4%D0%BD%D0%B8%D0%BA%D0%B8%20%D0%BC%D0%B5%D0%B6%D0%B4%D1%83%20%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB%D0%B0%D0%BC%D0%B8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // Ждем загрузки DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    function init() {
        // Создаем контейнер для кнопок
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
            padding: 10px;
            margin: 10px 0;
            background: rgba(0, 0, 0, 0.05);
            border-radius: 8px;
            justify-content: flex-start;
            align-items: center;
            max-width: 100%;
            box-sizing: border-box;
        `;
        
        // Конфигурация кнопок
        const buttonConfigs = [
            { text: "ЖБ", href: "https://forum.blackrussia.online/forums/Жалобы-на-игроков.273/" },
            { text: "ОРГ", href: "https://forum.blackrussia.online/forums/Неофициальные-rp-организации.250/" },
            { text: "СИТ", href: "https://forum.blackrussia.online/forums/РП-ситуации.252/" },
            { text: "БИО", href: "https://forum.blackrussia.online/forums/РП-биографии.254/" },
            { text: "БИО ОДОБР", href: "https://forum.blackrussia.online/forums/Одобренные-биографии.278/" },
            { text: "БИО ОТКАЗ", href: "https://forum.blackrussia.online/forums/Неодобренные-биографии.280/" },
            { text: "ОБЩ ПРАВИЛА", href: "https://forum.blackrussia.online/threads/Общие-правила-серверов.312571/" },
            { text: "ГОСС ПРАВИЛА", href: "https://forum.blackrussia.online/threads/Общие-правила-для-государственных-организаций.655011/" },
            { text: "АРХИВ", href: "https://forum.blackrussia.online/threads/test.14011327/" },
            { text: "ID МАШИН", href: "https://forum.blackrussia.online/threads/id-транспортных-средств-новые-в-конце.13940012/" }
        ];
        
        // Создаем кнопки
        buttonConfigs.forEach(config => {
            const button = document.createElement('button');
            button.textContent = config.text;
            button.style.cssText = `
                color: #E6E6FA; 
                background-color: rgba(28, 28, 28, 0.8); 
                border: 1px solid #E6E6FA; 
                border-radius: 13px;
                padding: 8px 12px;
                cursor: pointer;
                white-space: nowrap;
                font-size: 12px;
                transition: all 0.3s ease;
                flex-shrink: 0;
            `;
            
            // Эффекты при наведении
            button.addEventListener('mouseenter', function() {
                this.style.backgroundColor = 'rgba(69, 69, 69, 0.8)';
                this.style.transform = 'translateY(-1px)';
            });
            
            button.addEventListener('mouseleave', function() {
                this.style.backgroundColor = 'rgba(28, 28, 28, 0.8)';
                this.style.transform = 'translateY(0)';
            });
            
            button.addEventListener('click', function(e) {
                e.preventDefault();
                window.location.href = config.href;
            });
            
            buttonContainer.appendChild(button);
        });
        
        // Вставляем контейнер с кнопками в нужное место
        const pageContent = document.querySelector('.pageContent');
        if (pageContent) {
            // Вставляем в начало pageContent
            pageContent.insertBefore(buttonContainer, pageContent.firstChild);
        } else {
            // Если pageContent не найден, вставляем в body
            document.body.insertBefore(buttonContainer, document.body.firstChild);
        }
        
        // Функция для адаптации под разные размеры экрана
        function adaptButtons() {
            const containerWidth = buttonContainer.offsetWidth;
            const buttons = buttonContainer.querySelectorAll('button');
            let currentRowWidth = 0;
            const gap = 5;
            
            buttons.forEach(button => {
                const buttonWidth = button.offsetWidth;
                
                if (currentRowWidth + buttonWidth + gap > containerWidth - 20) {
                    // Переносим на новую строку
                    button.style.marginLeft = '0';
                    currentRowWidth = buttonWidth;
                } else {
                    // Оставляем в текущей строке
                    if (currentRowWidth === 0) {
                        button.style.marginLeft = '0';
                    }
                    currentRowWidth += buttonWidth + gap;
                }
            });
        }
        
        // Вызываем адаптацию при загрузке и изменении размера окна
        adaptButtons();
        window.addEventListener('resize', adaptButtons);
        
        // Дополнительная проверка после полной загрузки страницы
        window.addEventListener('load', adaptButtons);
        
        // Адаптация для мобильных устройств
        function checkMobile() {
            if (window.innerWidth <= 768) {
                buttonContainer.style.justifyContent = 'center';
                buttonContainer.style.gap = '3px';
                buttonContainer.style.padding = '8px 5px';
            } else {
                buttonContainer.style.justifyContent = 'flex-start';
                buttonContainer.style.gap = '5px';
                buttonContainer.style.padding = '10px';
            }
            adaptButtons();
        }
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
    }
})();