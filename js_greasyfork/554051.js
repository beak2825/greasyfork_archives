// ==UserScript==
// @name         Payment Row Ticket Creator with Modal and Payment ID Logging
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  В строках таблицы с id, начинающимся на "payment_", добавляется кнопка "+". При клике на кнопку открывается модальное окно для выбора файлов и ввода комментария, а при отправке в консоль выводится id платежа (часть после "payment_").
// @match        https://admin.crimson.*.prd.maxbit.private/admin/players/*
// @match         https://admin.crimson.*.prd.maxbit.private/admin/-/payments
// @grant        GM_xmlhttpRequest
// @connect      your-domain.beget.example
// @downloadURL https://update.greasyfork.org/scripts/554051/Payment%20Row%20Ticket%20Creator%20with%20Modal%20and%20Payment%20ID%20Logging.user.js
// @updateURL https://update.greasyfork.org/scripts/554051/Payment%20Row%20Ticket%20Creator%20with%20Modal%20and%20Payment%20ID%20Logging.meta.js
// ==/UserScript==

(async function() {
    'use strict';
  function searchTicketsByCode(code, retries = 5, initialDelay = 300) {
  return new Promise((resolve, reject) => {
    const endpoint = "http://s29513cd.beget.tech/exists_ticket_new.php?code=" + encodeURIComponent(code);
    let currentAttempt = 0;
    let currentDelay = initialDelay;

    // Функция для выполнения запроса с экспоненциальной задержкой
    function attemptRequest() {
      GM_xmlhttpRequest({
        method: "GET",
        url: endpoint,
        onload: function(response) {
          if (response.status >= 200 && response.status < 300) {
            try {
              const data = JSON.parse(response.responseText);

              // Проверяем структуру ответа
              if (data.status === 'success' && typeof data.issuesCount !== 'undefined') {
                console.log("Успешный ответ от сервера:", data);
                resolve({
                  status: data.status,
                  issuesCount: data.issuesCount,
                  searchParameters: data.searchParameters || {
                    originalCode: code,
                    searchCode: code,
                    fieldId: 'unknown'
                  },
                  jqlQuery: data.jqlQuery || 'unknown'
                });
              } else if (data.error) {
                // Сервер вернул ошибку
                handleError(new Error(`Server error: ${data.error}`));
              } else {
                // Неожиданный формат ответа
                handleError(new Error("Invalid response format from server"));
              }
            } catch (e) {
              handleError(new Error(`JSON parse error: ${e.message}`));
            }
          } else {
            handleError(new Error(`HTTP error ${response.status}`));
          }
        },
        onerror: function(error) {
          handleError(error);
        }
      });
    }

    // Обработчик ошибок с повторными попытками
    function handleError(error) {
      console.error(`Attempt ${currentAttempt + 1}/${retries} failed:`, error.message);

      if (currentAttempt < retries - 1) {
        currentAttempt++;
        currentDelay = Math.min(currentDelay * 2, 5000); // Экспоненциальная задержка с максимум 5 сек
        console.log(`Retrying in ${currentDelay}ms...`);
        setTimeout(attemptRequest, currentDelay);
      } else {
        reject(new Error(`Failed after ${retries} attempts. Last error: ${error.message}`));
      }
    }

    // Начинаем первую попытку
    attemptRequest();
  });
}




// Пример использования функции:

 function getAgentIdByEmail(agentEmail, retries = 7, initialDelay = 300) {
  const endpoint = "http://s29513cd.beget.tech/user_email_new.php?email=" + encodeURIComponent(agentEmail);

  // Функция для выполнения запроса с экспоненциальной задержкой
  function attemptRequest(attempt, currentDelay) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET",
        url: endpoint,
        onload: function(response) {
          if (response.status >= 200 && response.status < 300) {
            try {
              const data = JSON.parse(response.responseText);
              console.log("Получен ответ:", data);

              // Проверка структуры ответа
              if (data.status === 'success' && data.data && data.data.accountId) {
                // Успешный ответ с accountId
                console.log("Успешно получены данные агента:", data.data);
                resolve(data.data);
              } else if (data.error) {
                // Ответ с ошибкой от сервера
                console.error("Ошибка сервера:", data.error);
                if (attempt < retries) {
                  const nextDelay = Math.min(currentDelay * 1.5, 2000); // Экспоненциальная задержка с максимум 2с
                  console.log(`Повторная попытка (${attempt + 1}/${retries}) через ${nextDelay} мс...`);
                  setTimeout(() => attemptRequest(attempt + 1, nextDelay).then(resolve).catch(reject), nextDelay);
                } else {
                  reject(new Error(`Сервер вернул ошибку: ${data.error}. Попытки исчерпаны.`));
                }
              } else {
                // Неожиданный формат ответа
                reject(new Error("Неверный формат ответа сервера"));
              }
            } catch (e) {
              console.error("Ошибка парсинга JSON:", e);
              reject(new Error("Ошибка парсинга JSON: " + e.message));
            }
          } else {
            // HTTP ошибка
            console.error("HTTP ошибка:", response.status);
            if (attempt < retries) {
              const nextDelay = Math.min(currentDelay * 1.5, 2000);
              console.log(`Повторная попытка (${attempt + 1}/${retries}) через ${nextDelay} мс...`);
              setTimeout(() => attemptRequest(attempt + 1, nextDelay).then(resolve).catch(reject), nextDelay);
            } else {
              reject(new Error(`HTTP ошибка ${response.status}. Попытки исчерпаны.`));
            }
          }
        },
        onerror: function(error) {
          console.error("Ошибка запроса:", error);
          if (attempt < retries) {
            const nextDelay = Math.min(currentDelay * 1.5, 2000);
            console.log(`Повторная попытка (${attempt + 1}/${retries}) через ${nextDelay} мс...`);
            setTimeout(() => attemptRequest(attempt + 1, nextDelay).then(resolve).catch(reject), nextDelay);
          } else {
            reject(new Error(`Ошибка запроса: ${error.message || 'Неизвестная ошибка'}. Попытки исчерпаны.`));
          }
        }
      });
    });
  }

  // Начинаем первую попытку
  return attemptRequest(0, initialDelay);
}

// Пример использования


      const domParser = new DOMParser()
  const fetchDataAndOutput = async (id) => {
        const href = `https://${window.location.host}/admin/payments/${id}`
        let data = await fetch(
            href,
            {
                headers: {
                    accept:
                        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                    "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
                    "cache-control": "max-age=0",
                    "sec-ch-ua":
                        '"Google Chrome";v="107", "Chromium";v="107", "Not=A?Brand";v="24"',
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": '"Windows"',
                    "sec-fetch-dest": "document",
                    "sec-fetch-mode": "navigate",
                    "sec-fetch-site": "same-origin",
                    "sec-fetch-user": "?1",
                    "upgrade-insecure-requests": "1",
                },
                referrer:
                    "https://marketing-izzi.lux-casino.co/admin/payments?q%5Buser_email_eq%5D=lipisinkand%40yandex.ru",
                referrerPolicy: "strict-origin-when-cross-origin",
                body: null,
                method: "GET",
                mode: "cors",
                credentials: "include",
            }
        )
        data = await data.text()
        const parsedData = await domParser.parseFromString(data, "text/html")
        const paymentSystem = parsedData.querySelector(".row.row-payment_system td").innerText
        const depositSum = parsedData.querySelector(".row.row-amount td").innerText
        const email = parsedData.querySelector(".row.row-user a").innerText
        const project = window.location.host.split(".")[2].toUpperCase()
        const code = parsedData.querySelector(".row.row-source_id td")?.innerText
        const transactionType = parsedData.querySelector("#page_title").innerText

        return {paymentSystem, href, depositSum, email, project, code, transactionType}

    }

    // Функция для создания модального окна, принимает paymentId
    function createModal(paymentId) {
        // Создаем затемненный фон (оверлей)
        const overlay = document.createElement("div");
        overlay.id = "modalOverlay";
        overlay.style.position = "fixed";
        overlay.style.top = "0";
        overlay.style.left = "0";
        overlay.style.width = "100%";
        overlay.style.height = "100%";
        overlay.style.backgroundColor = "rgba(0,0,0,0.5)";
        overlay.style.display = "flex";
        overlay.style.alignItems = "center";
        overlay.style.justifyContent = "center";
        overlay.style.zIndex = "10000";

        // Контейнер модального окна
        const modal = document.createElement("div");
        modal.id = "modalWindow";
        modal.style.backgroundColor = "#fff";
        modal.style.padding = "20px";
        modal.style.borderRadius = "8px";
        modal.style.boxShadow = "0 2px 8px rgba(0,0,0,0.3)";
        modal.style.width = "400px";
        modal.style.maxWidth = "90%";
        modal.style.position = "relative";

        // Заголовок окна
        const header = document.createElement("h2");
        header.textContent = "Создать тикет";
        header.style.marginTop = "0";
        modal.appendChild(header);

        // Поле выбора файлов
        const fileLabel = document.createElement("label");
        fileLabel.textContent = "Выберите файлы:";
        fileLabel.style.display = "block";
        fileLabel.style.marginBottom = "5px";
        modal.appendChild(fileLabel);

        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.multiple = true;
        fileInput.style.marginBottom = "15px";
        modal.appendChild(fileInput);

        // Поле для комментария
        const commentLabel = document.createElement("label");
        commentLabel.textContent = "Комментарий (будет в description):";
        commentLabel.style.display = "block";
        commentLabel.style.marginBottom = "5px";
        modal.appendChild(commentLabel);

        const commentTextarea = document.createElement("textarea");
        commentTextarea.rows = 4;
        commentTextarea.style.width = "100%";
        commentTextarea.style.marginBottom = "15px";
        modal.appendChild(commentTextarea);

        // Контейнер для кнопок
        const btnContainer = document.createElement("div");
        btnContainer.style.textAlign = "right";

        const submitBtn = document.createElement("button");
        submitBtn.textContent = "Отправить";
        submitBtn.style.marginRight = "10px";
        submitBtn.style.padding = "5px 10px";

        const cancelBtn = document.createElement("button");
        cancelBtn.textContent = "Отмена";
        cancelBtn.style.padding = "5px 10px";

        btnContainer.appendChild(submitBtn);
        btnContainer.appendChild(cancelBtn);
        modal.appendChild(btnContainer);

        overlay.appendChild(modal);

        // Функция закрытия модального окна
        function closeModal() {
            if (overlay && overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
        }

        // Обработчик кнопки "Отмена"
        cancelBtn.addEventListener("click", function() {
            closeModal();
        });

        // Обработчик клика вне модального окна
        overlay.addEventListener("click", function(event) {
            if (event.target === overlay) {
                closeModal();
            }
        });

        // Обработчик кнопки "Отправить"
        submitBtn.addEventListener("click", async function() {
            const comment = commentTextarea.value.trim();
            const files = fileInput.files;
            const {paymentSystem, href, depositSum, email, project, code, transactionType} = await fetchDataAndOutput(paymentId)
            let agentEmail
            if(!window.location.href.includes("payments")){
              agentEmail = document.querySelector("#current_user").innerText
            }else{
              agentEmail = document.querySelector('[data-menu-id="user"] span').innerText;
            }
            const {accountId, organizations} = await getAgentIdByEmail(agentEmail+"@jetmail.cc")
            const {issuesCount} = await searchTicketsByCode(href)
            const userID = window.location.href.split("/")[5]
            const ok = issuesCount>0?confirm("По этому платежу уже было направлено " + issuesCount + " запросов вы уверены?"):true
            const issueParameters = {}
            if(transactionType.toLowerCase()=="cashout" && paymentSystem.toLowerCase().includes("paygo")){
              issueParameters.issuetype = "10016"
              issueParameters.issuesection = "sup/3e238aad-2658-42d5-abdd-074f4fffad5d"
              issueParameters.securityLevel = "Payments Security level"
            }
            if(transactionType.toLowerCase()=="deposit" && paymentSystem.toLowerCase().includes("paygo")){
              issueParameters.issuetype = "10016"
              issueParameters.issuesection = "sup/3c2eb73d-bae1-443e-ae73-8063a8fd3464"
              issueParameters.securityLevel = "Payments Security level"
            }
          if(transactionType.toLowerCase()=="deposit" && !paymentSystem.toLowerCase().includes("paygo")){
              issueParameters.issuetype = "10011"
              issueParameters.issuesection = "sup/6ac4681c-34a1-4efc-8f90-5432302facf5"
              issueParameters.securityLevel = "Accounts security level"
            }
          if(transactionType.toLowerCase()=="cashout" && !paymentSystem.toLowerCase().includes("paygo")){
              issueParameters.issuetype = "10011"
              issueParameters.issuesection = "sup/b32bc27c-2c82-4466-8a56-0bed290b4e6c"
              issueParameters.securityLevel = "Accounts security level"
            }
            if(!ok)
              return
            closeModal();
            // Формируем JSON-пейлоад для создания тикета (description принимает комментарий)
            const payload = {
                "fields": {
                    "project": { "id": "10000" },
                    "issuetype": { "id": issueParameters.issuetype },
                    "customfield_10010": issueParameters.issuesection,
                    "reporter": { "id": accountId },
                    "customfield_10066": { "value": project },
                    "customfield_10002": [organizations[organizations.length-1]],
                    "customfield_10071": paymentSystem,
                    "customfield_10069": href,
                    "customfield_10070": depositSum,
                    "summary": email,
                    "customfield_10043":code,
                    "description": comment,
                    "security": { "name": issueParameters.securityLevel, }
                }
            };

            const jsonPayload = JSON.stringify(payload);

            // Создаем FormData и добавляем JSON-пейлоад и все выбранные файлы
            const formData = new FormData();
            formData.append("json", jsonPayload);
            if (files && files.length > 0) {
                for (let i = 0; i < files.length; i++) {
                    formData.append("file[]", files[i]);
                }
            }

            // Отправляем запрос через GM_xmlhttpRequest
            GM_xmlhttpRequest({
                method: "POST",
                url: "http://s29513cd.beget.tech/create_tiket.php", // Замените на URL вашего серверного скрипта
                data: formData,
                onload: function(response) {
                  const ticketID = JSON.parse(response.response)
                  console.log(response)
                  window.open(`https://supdeskt.atlassian.net/servicedesk/customer/portal/1/${ticketID.issueKey}`, '_blank')
                },
                onerror: function(error) {
                    console.error("Ошибка запроса:", error);
                    alert("Ошибка при создании тикета: " + error);
                }
            });

        });

        return overlay;
    }

    // Функция для добавления кнопки "+" в конец строки таблицы
    function addPlusButtonToRow(row) {
        // Создаем новую ячейку
        const cell = document.createElement("td");
        cell.classList.add("ant-table-cell")
        cell.style.width = "30px"
        // Извлекаем id платежа из строки: удаляем префикс "payment_"
        let paymentId
        if(!window.location.href.includes("payments")){
         paymentId = row.id.replace(/^payment_/, "");
        }else{
          paymentId = row.querySelector(".ant-table-cell a.link").innerText
        }
        // Создаем кнопку "+"
        const btn = document.createElement("button");
        btn.textContent = "+";
        // Увеличиваем размеры кнопки примерно в 1.3 раза
        btn.style.padding = "6.5px 13px"; // вместо 5px 10px
        btn.style.fontSize = "21px";      // вместо 16px
        btn.style.cursor = "pointer";
        // При клике на кнопку открывается модальное окно, в которое передается paymentId
        btn.addEventListener("click", function(event) {
            event.stopPropagation();
            event.preventDefault();
            const modalOverlay = createModal(paymentId);
            document.body.appendChild(modalOverlay);
        });

        cell.appendChild(btn);
        row.appendChild(cell);
    }

    // Функция для добавления заголовка "Тикет" в thead таблицы, если его еще нет
    function addTicketHeader(table) {
        let thead = table.querySelector("thead");
        if (!thead) {
            thead = document.createElement("thead");
            table.insertBefore(thead, table.firstChild);
        }
        if (thead.dataset.ticketHeaderAdded === "true") return;

        let headerRow = thead.querySelector("tr");
        if (!headerRow) {
            headerRow = document.createElement("tr");
            thead.appendChild(headerRow);
        }
        const th = document.createElement("th");
        th.style.width = "45px"
        th.classList.add("ant-table-cell")
        th.textContent = "Тикет";
        th.setAttribute("colstart", "11");
        th.setAttribute("colend", "11");

        headerRow.appendChild(th);
        thead.dataset.ticketHeaderAdded = "true";
    }

    // Функция для обработки строк таблицы с id, начинающимся на "payment_"
    function processPaymentRows() {
        let rows
        if(!window.location.href.includes("payments")){
           rows = document.querySelectorAll("tr[id^='payment_']");
        }else{
            rows = document.querySelectorAll(".ant-table-row.ant-table-row-level-0");
        }
        rows.forEach(row => {
            const table = row.closest("table");
            if (table) {
                addTicketHeader(table);
            }
            if (!row.querySelector("td > button")) {
                addPlusButtonToRow(row);
            }
        });
    }

    // Запускаем обработку сразу
    processPaymentRows();

    // Если строки добавляются динамически, повторяем обработку периодически
    setInterval(processPaymentRows, 3000);
})();
