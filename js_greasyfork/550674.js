// ==UserScript==
// @name Комментарии и Информация из Битрикса | Сайды
// @namespace Violentmonkey Scripts
// @match https://a24.biz/order/*
// @match https://a24.biz/order/getoneorder/*
// @match https://avtor24.ru/order/*
// @match https://avtor24.ru/order/getoneorder/*
// @match https://avtor24.ru/home
// @match https://a24.biz/home
// @version 3.2
// @author Bekker
// @description Adds author info to A24 order summary and applies minimal CSS fixes
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/550674/%D0%9A%D0%BE%D0%BC%D0%BC%D0%B5%D0%BD%D1%82%D0%B0%D1%80%D0%B8%D0%B8%20%D0%B8%20%D0%98%D0%BD%D1%84%D0%BE%D1%80%D0%BC%D0%B0%D1%86%D0%B8%D1%8F%20%D0%B8%D0%B7%20%D0%91%D0%B8%D1%82%D1%80%D0%B8%D0%BA%D1%81%D0%B0%20%7C%20%D0%A1%D0%B0%D0%B9%D0%B4%D1%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/550674/%D0%9A%D0%BE%D0%BC%D0%BC%D0%B5%D0%BD%D1%82%D0%B0%D1%80%D0%B8%D0%B8%20%D0%B8%20%D0%98%D0%BD%D1%84%D0%BE%D1%80%D0%BC%D0%B0%D1%86%D0%B8%D1%8F%20%D0%B8%D0%B7%20%D0%91%D0%B8%D1%82%D1%80%D0%B8%D0%BA%D1%81%D0%B0%20%7C%20%D0%A1%D0%B0%D0%B9%D0%B4%D1%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('Скрипт запущен');
    const body = document.body;
    if (body && body.classList.contains('is-author')) {
    // Author mapping
    const authorMap = {
        'Альберт': {
            fullName: 'Альберт Будтуев',
            avatar: 'https://bx.cloudguru.us/upload/resize_cache/main/a38/axxtvm247rrzbp844bpevqlry779fkhu/200_200_2/%D1%84%D0%BE%D1%82%D0%BE1.jpg.png',
            userId: 7589
        },
        'Богдан': {
            fullName: 'Богдан Тирик',
            avatar: 'https://bx.cloudguru.us/upload/resize_cache/main/165/gu8wifq37um89n0rihqqank6gqddb8d0/200_200_2/2024-12-30%2011.14.54.jpg.png',
            userId: 9470
        },
        'Давид': {
            fullName: 'Давид Геворкян',
            avatar: 'https://bx.cloudguru.us/upload/resize_cache/main/53e/o5fcv6t319djwi5r8514k0vvgk1hnjbj/200_200_2/IMG_0775.png',
            userId: 5765
        },
        'Анастасия': {
            fullName: 'Анастасия Игнатенко',
            avatar: 'https://bx.cloudguru.us/upload/resize_cache/main/e49/k05mpu5ydjuw381qayo4fsi5frgaj6k5/200_200_2/8CscQfZRwN0.png',
            userId: 6433
        },
        'Алексей': {
            fullName: 'Алексей Усольцев',
            avatar: 'https://bx.cloudguru.us/upload/resize_cache/main/b49/6kjlhgtzeh0wu2gz4ho9bqgjh60zz1fc/200_200_2/%D1%84%D0%BC%D1%84.jpg.png',
            userId: 7706
        },
        'Андрей': {
            fullName: 'Андрей Кузьмин',
            avatar: 'https://bx.cloudguru.us/upload/resize_cache/main/27b/lkvo9x3srvhqhq7ii7e0rdo16nbux7mu/200_200_2/photo_2024-08-26_19-14-33.png',
            userId: 6416
        }
    };

    // Функция извлечения номера заказа из URL
    function getOrderNumber() {
        const regex = /\/(\d{8})(?:\/|\?|$)/;
        const match = window.location.href.match(regex);
        return match ? match[1] : null;
    }

    // Функция получения данных заказа
    async function getOrderData() {
        const orderNumber = getOrderNumber();
        if (!orderNumber) {
            console.error('Номер заказа не найден в URL');
            return null;
        }
        try {
            const data = await unsafeWindow.bitrixApi.findDeal(orderNumber);
            return data;
        } catch (e) {
            console.error('Ошибка получения данных заказа:', e);
            return null;
        }
    }

    // Функция проверки статуса работы автора
    function getAuthorWorkStatus(authorName) {
        try {
            const copywritersData = localStorage.getItem('copywritersData');
            if (!copywritersData) {
                return { isWorking: false, statusText: 'неизвестно', circleClass: 'status-circle-gray' };
            }
            const data = JSON.parse(copywritersData);
            const storedDate = data.date;
            const today = new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' }).replace('.', '/');
            if (!storedDate || storedDate !== today) {
                return { isWorking: false, statusText: 'данные устарели', circleClass: 'status-circle-gray' };
            }
            const copywriters = data.copywriters || [];
            const authorEntry = copywriters.find(c => c.startsWith(authorName));
            if (!authorEntry) {
                return { isWorking: false, statusText: 'не работает', circleClass: 'status-circle-gray' };
            }
            if (authorEntry.endsWith('0.5')) {
                return { isWorking: true, statusText: 'работает (полсмены)', circleClass: 'status-circle-orange' };
            } else if (authorEntry.endsWith('Д')) {
                return { isWorking: true, statusText: 'работает (дежурный)', circleClass: 'status-circle-blue' };
            } else if (authorEntry.endsWith('О')) {
                return { isWorking: false, statusText: 'В отпуске', circleClass: 'status-circle-red' };
            } else {
                return { isWorking: true, statusText: 'работает', circleClass: 'status-circle-green' };
            }
        } catch (e) {
            console.error('Ошибка при проверке статуса автора:', e);
            return { isWorking: false, statusText: 'неизвестно', circleClass: 'status-circle-gray' };
        }
    }

    // Функция для получения tooltip о работающих авторах
    function getWorkingAuthorsTooltip() {
        try {
            const copywritersData = localStorage.getItem('copywritersData');
            if (!copywritersData) {
                return 'Данные отсутствуют';
            }
            const data = JSON.parse(copywritersData);
            const storedDate = data.date;
            const today = new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' }).replace('.', '/');
            if (!storedDate || storedDate !== today) {
                return 'Данные устарели';
            }
            const copywriters = data.copywriters || [];
            const workingAuthors = [];
            const dutyAuthors = [];
            copywriters.forEach(author => {
                if (author.endsWith('0.5')) {
                    workingAuthors.push(author.replace(' 0.5', ' (полсмены)'));
                } else if (author.endsWith('Д')) {
                    dutyAuthors.push(author.replace(' Д', ''));
                } else if (!author.endsWith('О')) {
                    workingAuthors.push(author);
                }
            });
            let tooltipText = '';
            if (workingAuthors.length > 0) {
                tooltipText += `Работают: ${workingAuthors.join(', ')}`;
            }
            if (dutyAuthors.length > 0) {
                tooltipText += `${workingAuthors.length > 0 ? '\n' : ''}Дежурный: ${dutyAuthors.join(', ')}`;
            }
            if (tooltipText === '') {
                tooltipText = 'Нет работающих или дежурных авторов';
            }
            return tooltipText;
        } catch (e) {
            console.error('Ошибка при формировании tooltip:', e);
            return 'Ошибка при загрузке данных';
        }
    }

    // Функция создания секции автора
    function createAuthorSection(customerSection, labelText, name, avatar, withButton, buttonCommand, userId, ID) {
        const authorSection = customerSection.cloneNode(true);
        authorSection.style.marginTop = '15px';
        authorSection.classList.add('author');
        const label = authorSection.querySelector('.auctionOrder-customer_label');
        if (label) {
            label.textContent = labelText;
            label.style.fontWeight = 'bold';
        }
        const avatarContainer = authorSection.querySelector('.ui-avatar');
        if (avatarContainer) {
            if (avatar) {
                const avatarImg = avatarContainer.querySelector('.uikit-avatar-img');
                if (avatarImg) {
                    avatarImg.src = avatar;
                    avatarImg.alt = 'Author Image';
                }
            } else {
                const emojiSpan = document.createElement('span');
                emojiSpan.textContent = '👤';
                emojiSpan.style.fontSize = '24px';
                avatarContainer.innerHTML = '';
                avatarContainer.appendChild(emojiSpan);
            }
        }
        const nickname = authorSection.querySelector('.auctionOrder-customer_nickname');
        if (nickname) {
            nickname.textContent = name;
            if (userId) {
                nickname.title = 'Нажмите, чтобы упомянуть в комментариях';
                nickname.style.fontWeight = 'bolder';
            }
            if (avatar) {
                const workStatus = getAuthorWorkStatus(name.split(' ')[0]);
                const statusDiv = document.createElement('div');
                statusDiv.className = 'author-work-status';
                statusDiv.title = getWorkingAuthorsTooltip();
                statusDiv.innerHTML = `
                    <span class="status-circle ${workStatus.circleClass}"></span>
                    <span style="margin-left: 5px;">${workStatus.statusText}</span>
                `;
                const infoContainer = authorSection.querySelector('.auctionOrder-customer-info');
                if (infoContainer) {
                    infoContainer.appendChild(statusDiv);
                }
            }
        }
        if (withButton && nickname) {
            const infoContainer = authorSection.querySelector('.auctionOrder-customer-info');
            if (infoContainer) {
                const buttonContainer = document.createElement('div');
                const button = document.createElement('button');
                button.textContent = 'Открыть';
                button.style.backgroundColor = 'rgb(100, 53, 165)';
                button.style.color = 'rgb(255, 255, 255)';
                button.style.fontFamily = 'Circe';
                button.style.border = 'none';
                button.style.padding = '6px 12px';
                button.style.margin = '3px';
                button.style.cursor = 'pointer';
                button.style.borderRadius = '4px';
                button.style.fontSize = '12px';
                button.onclick = () => unsafeWindow.bitrixApi.openKartoshka();
                buttonContainer.appendChild(button);
                infoContainer.appendChild(buttonContainer);
            }
        }
        const footer = authorSection.querySelector('.auctionOrder-customer-info-footer');
        if (footer) {
            footer.remove();
        }
        return authorSection;
    }

    // Функция модификации summary заказа
    async function modifyOrderSummary(orderSummary, authorSections) {
        const orderData = await getOrderData();
        const customerSection = orderSummary.querySelector('div[class*="styled__CustomerStyled-sc-"]');
        if (!customerSection) {
            console.log('Customer section not found in summary');
            return null;
        }
        const labelPrefix = authorSections.length > 1 ? 'Автор #' : 'Автор';
        const sections = authorSections.map((author, index) => {
            return createAuthorSection(
                customerSection,
                authorSections.length > 1 ? `${labelPrefix}${index + 1}` : labelPrefix,
                author.name,
                author.avatar,
                author.withButton,
                author.buttonCommand,
                author.userId,
                orderData["ID Битрикс"]
            );
        });
        let insertAfter = customerSection;
        sections.forEach(section => {
            customerSection.parentNode.insertBefore(section, insertAfter.nextSibling);
            insertAfter = section;
        });
        return orderSummary;
    }
    let isProcessed = false;
    // Основная функция обработки summary
    async function processOrderSummary() {
        if (isProcessed) {
            console.log('processOrderSummary уже выполнен, пропускаем');
            return;
        }
        isProcessed = true;
        const orderData = await getOrderData();
        if (!orderData) {
            console.log('No order data found');
            return;
        }
        const authorSections = [];
        if (orderData['ID Картошка']) {
            const value = String(orderData['ID Картошка']).trim();
            if (/^\d{8}$/.test(value)) {
                authorSections.push({
                    name: `Автор на Картошке`,
                    avatar: null,
                    withButton: true,
                    buttonCommand: `Shmel open ${value}`,
                    userId: null
                });
            }
        }
        if (orderData['ГПТшник']) {
            const value = String(orderData['ГПТшник']).trim();
            if (authorMap[value]) {
                const authorInfo = authorMap[value];
                authorSections.push({
                    name: authorInfo.fullName,
                    avatar: authorInfo.avatar,
                    withButton: false,
                    userId: authorInfo.userId
                });
            }
        }
        if (authorSections.length === 0) {
            authorSections.push({
                name: 'Не гпт и не на Картошке',
                avatar: null,
                withButton: false,
                userId: null
            });
        }
        const orderSummary = document.querySelector('div[class*="styled__CustomerStyled-sc-"]').closest('div[class*="styled__OrderSummaryStyled-sc-"]');
        if (!orderSummary) {
            console.log('Order summary not found');
            return;
        }
        const clonedSummary = orderSummary.cloneNode(true);
        const modifiedSummary = await modifyOrderSummary(clonedSummary, authorSections);
        if (modifiedSummary) {
            orderSummary.parentNode.replaceChild(modifiedSummary, orderSummary);
        }
        const favotrash = document.querySelector('div[class*="styled__SidebarActionsStyled-sc"]');
        const tgtrash = document.querySelector('div[class*="styled__TelegramBannerStyled-sc"]');
        const recotrash = document.querySelector('div[class*="styled__RecommendationRequestStyled-sc"]');
        const dialog = document.querySelector('div[class*="styled__WorkAreaStyled-sc"]');
        const dialogscroll = document.querySelector('div[class*="styled__ScrollableStyled-sc"]');
        if (tgtrash) tgtrash.remove();
        if (favotrash) favotrash.remove();
        if (recotrash) recotrash.remove();
        if (dialog) dialog.style.padding = '10px';
        if (dialogscroll) dialogscroll.style.padding = '0px 3px 0px 0px;';
        const containerDivs = document.querySelectorAll('div[class*="styled__Container-sc"]');
        const sidebarDiv = document.querySelector('div[class*="styled__Sidebar-sc"]');
        if (sidebarDiv) sidebarDiv.style.rowGap = '10px';
        if (containerDivs.length >= 2) {
            containerDivs[0].style.gap = '10px';
            const diff = containerDivs[0].querySelector('img[role="presentation"]');
            if (diff) {
                diff.width = '100';
                diff.height = '100';
            }
            containerDivs[0].style.padding = '0px';
            containerDivs[1].style.gap = '10px';
        }
        const wcontainer = document.querySelector('div[class*="w-container"]');
        if (wcontainer) wcontainer.style.padding = '0 30px';
        const footer = document.querySelector('div[class*="a24-footer"]');
        if (footer) footer.remove();
        const body = document.body;
        const html = document.documentElement;
        const currentHeight = Math.max(
            body.scrollHeight,
            body.offsetHeight,
            html.clientHeight,
            html.scrollHeight,
            html.offsetHeight
        );
        body.style.height = `${currentHeight * 1.1}px`;
    }

    // Основной наблюдатель DOM
    function observeDOM() {
        const observer = new MutationObserver(async (mutations, obs) => {
            try {
                const customerSection = document.querySelector('div[class*="styled__CustomerStyled-sc-"]');
                if (customerSection) {
                    await processOrderSummary();
                    obs.disconnect();
                }
            } catch (error) {
                console.error('Error in MutationObserver callback:', error);
            }
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Стили
    const style = document.createElement('style');
    style.textContent = `
        .author-work-status {
            display: inline-flex;
            align-items: center;
            margin-top: 2px;
            font-size: 14px;
            font-weight: 400 !important;
            font-family: Circe, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
            color: rgb(13, 29, 74);
            unicode-bidi: isolate;
            -webkit-font-smoothing: antialiased;
        }
        .status-circle {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            border: 1px solid rgb(255, 255, 255);
            display: inline-block;
            vertical-align: middle;
        }
        .dialog-frame-scrollable {
            padding: 0px 3px 0px 0px !important;
            max-height: 999rem !important;
        }
        .status-circle-green {
            background-color: rgb(83, 256, 0);
        }
        .status-circle-gray {
            background-color: rgb(25, 28, 29);
        }
        .status-circle-blue {
            background-color: #007bff;
        }
        .status-circle-red {
            background-color: #8B0000;
        }
        .status-circle-orange {
            background-color: #fd7e14;
        }
    `;
    document.head.appendChild(style);

    // Запуск наблюдателя
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', observeDOM);
    } else {
        observeDOM();
    }
    } else {}
})();