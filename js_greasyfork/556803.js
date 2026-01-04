// ==UserScript==
// @license MIT
// @name         MailScript
// @namespace    http://tampermonkey.net/
// @version      2025-11-07
// @description  Send bulk emails through Russian Post service and track numbers in alfaCRM
// @author       You
// @match        https://domini.s20.online/company/1/lead/*
// @match        https://domini.s20.online/company/1/lead
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/556803/MailScript.user.js
// @updateURL https://update.greasyfork.org/scripts/556803/MailScript.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let ids = [];
    let updUsrs = [];
    let token = "";
    let users = [];
    // Ошибка 1: window.addEventListener (с маленькой буквы)
    window.addEventListener('load', function() {
        addButtonToPage();
        addModalToPage();
        addLoadModalToPage();
        addClientAddressPage();
    });

    function addButtonToPage() {
        const targetElement = document.querySelector('div[class="ibox-content border-bottom"]');
        const button = document.createElement('div');
        button.className = 'btn btn-sm btn-w-m';
        button.innerHTML = 'Почта';
        button.style.cssText = `
            background: #A59BDF;
            color: #ffffff;
        `;

        // Добавляем кнопку на страницу
        targetElement.appendChild(button);

        // Добавляем обработчик клика для тестирования
        button.addEventListener('click', showModal);
    }

    function addClientAddressPage() {
        const modalAddrHTML = `
            <div id="customModalAddr" style="
                display: none;
                position: fixed;
                z-index: 1000;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0,0,0,0.5);
            ">
                <div style="
                    background-color: #A59BDF;
                    margin: 5% auto;
                    padding: 20px;
                    border-radius: 5px;
                    width: 80%;
                    max-height: 90vh;
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                ">
                    <p style="margin-bottom: 15px;">Проверьте адреса клиентов. В противном случае отправьте форму на исправление адреса</p>
                    <div id="addrList" style="
                        border-radius: 5px;
                        overflow-y: auto;
                        flex: 1;
                        padding: 10px;
                    "></div>
                    <div style="
                        display: flex;
                        justify-content: space-evenly;
                        margin-top: 20px;
                        flex-shrink: 0;
                    ">
                        <button id="confirmAddrBtn" style="
                            padding: 5px 15px;
                            cursor: pointer;
                        ">все верно, отправить</button>
                        <button id="cancelAddrBtn" style="
                            padding: 5px 15px;
                            cursor: pointer;
                        ">есть неверные адреса - отменить</button>
                    </div>
                </div>
            </div>
        `
        document.body.insertAdjacentHTML('beforeend', modalAddrHTML);

        document.getElementById('cancelAddrBtn').addEventListener('click', hideAddrModal);
        document.getElementById('confirmAddrBtn').addEventListener('click', trekers_to_users);
    }

    function addModalToPage() {
        const modalHTML = `
            <div id="customModal" style="
                display: none;
                position: fixed;
                z-index: 1000;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0,0,0,0.5);
            ">
                <div style="
                    background-color: #A59BDF;
                    margin: 5% auto;
                    padding: 20px;
                    border-radius: 5px;
                    width: 40%;
                    max-height: 80vh;
                    flex-direction: column;
                    text-align: center;
                    overflow-y: auto;
                ">
                    <p>Почтовый сервис</p>
                    <div id="leadsList" style="
                       border-radius: 5px;
                       overflow-y: auto;
                       flex: 1;
                       border: 2px solid #8A7FD9;
                       background: rgba(255,255,255,0.2);
                       max-height: 60vh;
                    "></div>
                    <button id="confirmBtn" style="
                        padding: 5px 15px;
                        margin-top: 10px;
                        cursor: pointer;
                    ">отправить</button>
                    <button id="cancelBtn" style="
                        padding: 5px 15px;
                        margin-top: 10px;
                        cursor: pointer;
                    ">отмена</button>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Закрытие по кнопке отмена
        document.getElementById('cancelBtn').addEventListener('click', hideModal);
        //переход на экран загрузки пока берутся клиенты из alfacrm
        document.getElementById('confirmBtn').addEventListener('click', sendMails);
    }

    function addLoadModalToPage() {
                const loadingModalHTML = `
                    <div id="loadingModal" style="
                        display: none;
                        position: fixed;
                        z-index: 1001;
                        left: 0;
                        top: 0;
                        width: 100%;
                        height: 100%;
                        background-color: rgba(0,0,0,0.5);
                    ">
                     <div style="
                         background-color: #A59BDF;
                         margin: 5% auto;
                         padding: 40px 20px;
                         border-radius: 5px;
                         width: 30%;
                         text-align: center;
                     ">
                    <p style="font-size: 18px; margin-bottom: 20px;">Загрузка...</p>
                    <div style="
                        width: 50px;
                        height: 50px;
                        border: 5px solid #f3f3f3;
                        border-top: 5px solid #3498db;
                        border-radius: 50%;
                        animation: spin 1s linear infinite;
                        margin: 0 auto;
                    "></div>
                    <p style="margin-top: 20px;">Пожалуйста, подождите, идет загрузка клиентов</p>
                </div>
            </div>

            <style>
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        `;

        // Добавляем окно загрузки на страницу
        document.body.insertAdjacentHTML('beforeend', loadingModalHTML);

        // Функции для управления окном загрузки
        function showLoadingModal() {
            document.getElementById('loadingModal').style.display = 'block';
        }

        function hideLoadingModal() {
            document.getElementById('loadingModal').style.display = 'none';
        }
    }


    function showModal() {
        ids = [];
        const targetCheckBoxes = document.querySelectorAll('input.kv-row-checkbox');
        targetCheckBoxes.forEach(checkbox => {
            console.log("find checkbox");
            if (checkbox.checked) {
                ids.push(checkbox.value);
            }});

        let names = [];
        ids.forEach(id => {
            const link= document.querySelector(`a[href*="id=${id}"]`);
            if (link) {
                const name = link.textContent.trim();
                names.push(name);
            }
        });

        const leadsList = document.getElementById('leadsList');
        if (names.length > 0) {
         leadsList.innerHTML =`<p>выбранные пользователи:</p>
             ${names.map(name =>
                                         `<p> - ${name}</p>`
                                         ).join('')}`
        } else {
            leadsList.innerHTML = `<p>не выбраны пользователи</p>`;
        }
        document.getElementById('customModal').style.display = 'block';
    }

    function hideModal() {
        document.getElementById('customModal').style.display = 'none';
    }

    function hideAddrModal() {
        document.getElementById('customModalAddr').style.display = 'none';
    }

    async function sendMails() {
        if (ids.length === 0) {
            alert("вы не выбрали пользователей");
            return
        }
        document.getElementById('customModal').style.display = 'none';
        document.getElementById('loadingModal').style.display = 'block';
        try {
            token = await getToken();
            console.log("Токен:", token);

            await new Promise(resolve => setTimeout(resolve, 2000));

            users = await alfacrm_get_users();
            console.log("Все операции завершены успешно!");
            console.log(users);
            const addrList = document.getElementById('addrList');
            addrList.innerHTML = users.map(user =>
                `
                <div style="
                    border: 2px solid #A59BDF;
                    border-radius: 10px;
                    padding: 15px;
                    margin: 10px 0;
                    background: rgba(255,255,255,0.2);
                ">
                    <h3 style="text-align: center; margin: 0 0 10px 0; font-size: 16px;">${user.name}</h3>
                    <div style="text-align: left; font-size: 14px;">
                        <p><strong>индекс:</strong> ${user.custom_mail_index || 'не указан'}</p>
                        <p><strong>регион:</strong> ${user.custom_region || 'не указан'}</p>
                        <p><strong>населенный пункт:</strong> ${user.custom_place || 'не указан'}</p>
                        <p><strong>улица:</strong> ${user.custom_street || 'не указан'}</p>
                        <p><strong>дом:</strong> ${user.custom_building || 'не указан'}</p>
                        ${user.custom_room ? `<p><strong>квартира:</strong> ${user.custom_room}</p>` : ''}
                    </div>
                </div>
                `).join('');

        } catch (error) {
            console.error("Произошла ошибка:", error);
            alert("Ошибка при отправке: " + error.message);
        } finally {
            document.getElementById('loadingModal').style.display = 'none';
            document.getElementById('customModalAddr').style.display = 'block';
        }
    }
    async function trekers_to_users() {
        let trekers = [];
        try {
            trekers = await mail_service_get_treker();
        } catch (error) {
            console.log("ошибка в получении трек номеров:", error);
            return
        }
        try {
            alfacrm_set_trekers(trekers);
        } catch (error) {
            alert("не удалось присовить трек номера");
            return
        }
        hideAddrModal();
        alert("трек номера успешно присвоены");

    }

    function alfacrm_set_trekers(trekers) {
        return new Promise((resolve, reject) => {
            const results = [];
            let currentIndex = 0;

            function sendNextRequest() {
                if (currentIndex >= ids.length) {
                    resolve(results);
                    return;
                }

                const id = ids[currentIndex];
                const url = "https://domini.s20.online/v2api/1/customer/update?id=" + id;
                const data = {"custom_trek_nomer": String(trekers[currentIndex].barcode)};

                GM_xmlhttpRequest({
                    method: 'POST',
                    url: url,
                    headers: {
                        'Content-Type': 'application/json',
                        'X-ALFACRM-TOKEN': token
                    },
                    data: JSON.stringify(data),
                    onload: function(response) {
                        try {
                            const jsonText = JSON.parse(response.responseText);
                            if (response.status === 200) {
                                results.push(jsonText);
                                currentIndex++;
                                setTimeout(sendNextRequest, 1000);
                            } else {
                                reject(new Error('Ошибка обновления пользователя: ' + response.responseText));
                            }
                        } catch (error) {
                            reject(error);
                        }
                    },
                    onerror: function(error) {
                        reject(error);
                    }
                });
            }
            sendNextRequest();
        });
    }

    function mail_service_get_treker() {
        return new Promise((resolve, reject) => {
            const mail_url = "https://otpravka-api.pochta.ru/2.0/user/backlog";
            const accessToken = "qxx3hsh9U0Z3eayD_Ic9dISQ8o9EUZxP";
            const authKey = "ZG9taW5pXzc0QG1haWwucnU6SXJpbmFLXzI0MTgl";
            let datas = [];
            let fail = false;
            users.forEach(user => {
                if (!user.custom_mail_index) fail = true;
                if (!user.custom_region) fail = true;
                if (!user.custom_place) fail = true;
                if (!user.custom_street) fail = true;
                if (!user.custom_building) fail = true;
                if (!user.name) fail = true;
                let data = {
                    "address-type-to": "DEFAULT",
                    "mail-type": "LETTER",
                    "mail-category": "ORDERED",
                    "mail-direct": 643,
                    "mass": 30,
                    "index-to": user.custom_mail_index,
                    "region-to": user.custom_region,
                    "place-to": user.custom_place,
                    "street-to": user.custom_street,
                    "house-to": user.custom_building,
                    "room-to": user.custom_room,
                    "recipient-name": user.name,
                    "envelope-type": "C4",
                    "postoffice-code": "454092",
                    "payment-method": "ONLINE_PAYMENT_MARK"
                }
                datas.push(data);
            });
            if (fail) {
                alert("не все пользователи имеют нужные поля");
                reject(new Error('Не все данные корректны'));
                return;
            } else {
            }
            console.log("данные для отправки на почту:", datas);

            GM_xmlhttpRequest({
                method: 'PUT',
                url: mail_url,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `AccessToken ${accessToken}`,
                    'X-User-Authorization': `Basic ${authKey}`,
                    'Accept': 'application/json;charset=UTF-8'
                },
                data: JSON.stringify(datas),
                onload: function(response) {
                    try {
                        const jsonText = JSON.parse(response.responseText);
                        if (response.status === 200 && jsonText) {
                            console.log("сам ответ", jsonText);
                            console.log("расшифровка", jsonText.result_id);
                            resolve(jsonText.orders);
                        } else {
                            alert("Не удалось загрузить пользователей. Попробуйте позже");
                            reject(new Error('Не удалось загрузить пользователей. Попробуйте позже' + response.responseText));
                        }
                    } catch (error) {
                        reject(error);
                    }
                },
                onerror: function(error) {
                    reject(error);
                }
            });
        });
    }

    async function alfacrm_get_users() {
        return new Promise((resolve, reject) => {
            const index_url = "https://domini.s20.online/v2api/1/customer/index";
            const data = {
                "is_study": 2,
                "id": ids
            }

            GM_xmlhttpRequest({
                method: 'POST',
                url: index_url,
                headers: {
                    'Content-Type': 'application/json',
                    'X-ALFACRM-TOKEN':token
                },
                data: JSON.stringify(data),
                onload: function(response) {
                    try {
                        const jsonText = JSON.parse(response.responseText);
                        if (response.status === 200 && jsonText.items) {
                            resolve(jsonText.items);
                        } else {
                            alert("Не удалось загрузить пользователей. Попробуйте позже");
                            reject(new Error('Не удалось загрузить пользователей. Попробуйте позже' + response.responseText));
                        }
                    } catch (error) {
                        reject(error);
                    }
                },
                onerror: function(error) {
                    reject(error);
                }
            });

        })
    }

    function getToken() {
        return new Promise((resolve, reject) => {
            const auth_url = 'https://domini.s20.online/v2api/auth/login';
            const data = {
                'email': 'izamex@mail.ru',
                'api_key': 'e76dfbc2-b723-11f0-bfab-3cecefbdd1ae'
            };

            GM_xmlhttpRequest({
                method: 'POST',
                url: auth_url,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(data),
                onload: function(response) {
                    try {
                        const jsonText = JSON.parse(response.responseText);
                        if (response.status === 200 && jsonText.token) {
                            resolve(jsonText.token);
                        } else {
                            alert("Не удалось получить доступ. Попробуйте позже");
                            reject(new Error('Не удалось получить доступ. Попробуйте позже' + response.responseText));
                        }
                    } catch (error) {
                        reject(error);
                    }
                },
                onerror: function(error) {
                    reject(error);
                }
            });
        });
    }

})();