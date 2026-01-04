// ==UserScript==
// @name         new Linker MBSS
// @namespace    http://tishka.xyz/sdt
// @version      1.9.2
// @description  updated linker
// @author       .
// @match        https://support-admin-common-master.mbss.maxbit.private/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM.registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/554054/new%20Linker%20MBSS.user.js
// @updateURL https://update.greasyfork.org/scripts/554054/new%20Linker%20MBSS.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Конфигурация по умолчанию
    const defaultConfig = {
        colors: true,
        emailLinks: true,
        emailChatLinks: true,
        highlightIfMobile: false
    };

    // Загрузка конфигурации
    function loadConfig() {
        const config = {};
        for (const key in defaultConfig) {
            const value = GM_getValue(key, defaultConfig[key]);
            config[key] = value;
        }
        return config;
    }

    // Сохранение конфигурации
    function saveConfig(config) {
        for (const key in config) {
            GM_setValue(key, config[key]);
        }
    }

    // Создание меню настроек
    function createSettingsMenu() {
        const config = loadConfig();

        GM.registerMenuCommand('⚙️ Настройки скрипта', () => {
            const newConfig = {};

            newConfig.colors = confirm('Подсветка чата (верхняя строка)?\n\nOK - ВКЛ\nОтмена - ВЫКЛ') === config.colors ? config.colors : !config.colors;
            newConfig.emailLinks = confirm('Ссылка вместо почты или телефона в правом меню?\n\nOK - ВКЛ\nОтмена - ВЫКЛ') === config.emailLinks ? config.emailLinks : !config.emailLinks;
            newConfig.emailChatLinks = confirm('Ссылка вместо email адресов в чате?\n\nOK - ВКЛ\nОтмена - ВЫКЛ') === config.emailChatLinks ? config.emailChatLinks : !config.emailChatLinks;
            newConfig.highlightIfMobile = confirm('Подсветка при использовании телефона?\n\nOK - ВКЛ\nОтмена - ВЫКЛ') === config.highlightIfMobile ? config.highlightIfMobile : !config.highlightIfMobile;

            saveConfig(newConfig);
            alert('Настройки сохранены! Страница будет перезагружена.');
            location.reload();
        });
    }

    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

    const handleKeyboard = event => {
        if ((event.key === '/' || event.key === '.') && event.ctrlKey) {
            createSettingsMenu();
            // Открываем меню программно
            const settingsCommand = document.querySelector('a[href="javascript:GM.registerMenuCommand();"]');
            if (settingsCommand) {
                settingsCommand.click();
            }
        }
    };

    document.addEventListener('keyup', handleKeyboard);

    // Основной цикл работы скрипта
    async function mainLoop() {
        const chatEmailSelector = ".el-card__body .vac-text-last .vac-text-ellipsis";
        const chatProjectGroupSelector = ".detail-value";
        const chatBgSelector = ".vac-info-wrapper";

        while (true) {
            await sleep(100);

            // Получаем актуальные значения настроек
            const config = loadConfig();
            const isColorsEnabled = config.colors;
            const isEmailLinksEnabled = config.emailLinks;
            const isEmailChatLinksEnabled = config.emailChatLinks;
            const isMobileHighlightEnabled = config.highlightIfMobile;

            let projectGroupSelector;
            if (window.location.href.match(/chats/)) {
                projectGroupSelector = chatProjectGroupSelector;
            } else if (window.location.href.match(/archives/)) {
                projectGroupSelector = chatProjectGroupSelector;
            }

            if (!projectGroupSelector) continue;

            const chatEmailElem = document.querySelector(chatEmailSelector);
            const projectNameElems = document.querySelectorAll(projectGroupSelector);
            const projectNameElem = projectNameElems.length > 3 ? projectNameElems[3] : null;

            if (chatEmailElem && projectNameElem && isEmailLinksEnabled) {
                if (document.getElementById("enhancerLinkElem")) continue;

                const email = chatEmailElem.innerText;
                let currentProjectName = projectNameElem.innerText.split(" ")[0].toLowerCase();

                // Обработка специфики для проекта "sport"
                if (currentProjectName === "sport") {
                    const keywords = ["volna", "rox", "jet", "fresh", "sol", "izzi", "legzo", "starda", "drip", "monro", "irwin", "gizbo", "1go", "lex"];
                    const visitedPagesBlock = document.querySelector(`[data-testid="visited-pages"]`);
                    let visitedPagesList = visitedPagesBlock ? visitedPagesBlock.querySelectorAll("a") : [];

                    visitedPagesList.forEach(currentPage => {
                        let pageUrl = currentPage.href.split("/")[2];
                        keywords.forEach(keyword => {
                            if (pageUrl.match(keyword)) {
                                currentProjectName = keyword;
                            }
                        });
                    });
                }

                // Генерация ссылки на email или телефон
                const emailLink = email.startsWith("+") ?
                    `https://admin.crimson.${currentProjectName}.prd.maxbit.private/admin/players/find_user?filters[phone_number]=${email}&commit=Найти` :
                    `https://admin.crimson.${currentProjectName}.prd.maxbit.private/admin/players/find_user?filters[id_or_email]=${email}&commit=Найти`;

                const fullLinkElem = `<a id="enhancerLinkElem" target="_blank" href="${emailLink}">${email}</a>`;
                chatEmailElem.innerHTML = fullLinkElem;
            }

            // Обработка ссылок в чате
            if (projectNameElem && isEmailChatLinksEnabled) {
                let currentProjectName = projectNameElem.innerText.split(" ")[0].toLowerCase();
                const linksMail = document.querySelectorAll(`a[href^="mailto:"]`);

                linksMail.forEach(value => {
                    value.href = `https://admin.crimson.${currentProjectName}.prd.maxbit.private/admin/players/find_user?filters[id_or_email]=${value.href.split("mailto:")[1]}&commit=Найти`;
                });
            }

            // Подсветка в зависимости от проекта
            if (projectNameElem && isColorsEnabled) {
                const colorProjectName = projectNameElem.innerText.split(" ")[0].toLowerCase();
                const colors = {
                    legzo: "rgba(53, 60, 113, 50%)",
                    izzi: "rgb(58 145 183 / 50%)",
                    jet: "rgb(89 9 227 / 50%)",
                    sol: "rgb(253 153 10 / 50%)",
                    fresh: "rgb(10 250 110 / 50%)",
                    '1go': "rgb(243 28 1 / 50%)",
                    irwin: "rgb(130 0 255 / 50%)",
                    gizbo: "rgb(245 7 255 / 50%)",
                    lex: "rgb(211 194 143 / 50%)",
                    drip: "rgb(0 106 70 / 50%)",
                    starda: "rgb(200, 5, 34 / 80%)"
                };
                const chatBgElem = document.querySelector(chatBgSelector);
                if (chatBgElem && colors[colorProjectName]) {
                    chatBgElem.style.backgroundColor = colors[colorProjectName];
                }
            }

            // Подсветка для мобильных устройств
            if (isMobileHighlightEnabled) {
                if (window.location.href.match(/chats/) || window.location.href.match(/archives/)) {
                    const datablocksSelector = ".css-1hak7ay";
                    const useragentElemSelector = ".css-osp6nc";
                    const blocks = document.querySelectorAll(datablocksSelector);
                    let useragentElem;

                    blocks.forEach(value => {
                        if (value.innerText.match("User agent")) {
                            useragentElem = value.querySelector(useragentElemSelector);
                        }
                    });

                    const mobileRegex = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i;

                    const isMobile = useragent => mobileRegex.test(useragent);

                    if (useragentElem && isMobile(useragentElem.innerText)) {
                        if (!document.getElementById("enhancerMobileUserBadge")) {
                            const elem = document.querySelector(".fs-mask.css-128nwuf");
                            if (elem) {
                                elem.innerHTML += `<span id="enhancerMobileUserBadge" style="background-color:red;color:white;padding:4px 8px; text-align:center;border-radius:5px;">MOBILE</span>`;
                            }
                        }
                    }
                }
            }
        }
    }

    // Добавление кнопки Jira
    function addJiraButton() {
        const generalInfoBlock = document.querySelector('.el-card__body');
        const emailElement = document.querySelector('#enhancerLinkElem');

        if (generalInfoBlock && emailElement) {
            let jiraButton = document.getElementById('jiraButton');
            if (!jiraButton) {
                jiraButton = document.createElement('button');
                jiraButton.id = 'jiraButton';
                jiraButton.textContent = 'Jira';
                jiraButton.title = 'Ctrl + / для настроек';

                jiraButton.style.cssText = `
                    margin-top: 2px;
                    padding: 6px 13px;
                    background: linear-gradient(to bottom, #2E466E 5%, #415989 100%);
                    border-radius: 17px;
                    border: 1px solid #1F2F47;
                    display: inline-block;
                    cursor: pointer;
                    color: white;
                    font-family: Arial, sans-serif;
                    font-size: 15px;
                    text-shadow: 0px 1px 0px #263666;
                    box-shadow: inset 0px 0px 15px 3px #23395E;
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    z-index: 1000;
                `;
                generalInfoBlock.style.position = 'relative';
                generalInfoBlock.appendChild(jiraButton);
            }
            jiraButton.onclick = () => {
                const emailMatch = emailElement.textContent.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
                if (emailMatch) {
                    let email = emailMatch[0];
                    const patterns = [
                        /\.-|-\\.|-\.-/,
                        /[-_]{2,}/,
                        /_@/,
                    ];
                    const shouldReplace = patterns.some(regex => regex.test(email));
                    if (shouldReplace) {
                        email = email
                            .replace(/\.-|-\\.|-\.-/g, match => ' '.repeat(match.length))
                            .replace(/[-_]{2,}/g, match => ' '.repeat(match.length))
                            .replace(/_@/g, ' ');
                    }
                    navigator.clipboard.writeText(email).then(() => {
                        const searchUrl = `https://supdeskt.atlassian.net/servicedesk/customer/user/requests?filter=${encodeURIComponent(email)}&page=1&reporter=all&search=${encodeURIComponent(email)}`;
                        window.open(searchUrl, '_blank');
                    });
                }
            };
        }
    }

    // Ожидание появления элемента
    function waitForElement(selector, callback, interval = 500, timeout = 10000) {
        const startTime = Date.now();
        const checkElement = () => {
            const element = document.querySelector(selector);
            if (element) {
                callback(element);
            } else if (Date.now() - startTime < timeout) {
                setTimeout(checkElement, interval);
            }
        };
        checkElement();
    }

    // Инициализация
    function init() {
        console.log('MBSS Linker initialized! Use Ctrl + / for settings');
        createSettingsMenu();
        mainLoop();

        // Добавляем кнопку Jira
        waitForElement('.el-card__body', () => {
            addJiraButton();
            const observer = new MutationObserver(() => {
                addJiraButton();
            });
            observer.observe(document.body, { childList: true, subtree: true });
        });
    }

    // Запускаем после загрузки страницы
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();