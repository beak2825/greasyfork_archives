// ==UserScript==
// @name         A24 Helper Advanced (Кирилл)
// @namespace    https://a24.biz/
// @version      3.3
// @description  Автоматизация входа и выхода с a24.biz (рабочая логика Tampermonkey)
// @author       Octothorp
// @match        file:///*
// @match        https://bx.cloudguru.us/crm/deal/details/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addValueChangeListener
// @connect      a24.biz
// @downloadURL https://update.greasyfork.org/scripts/554105/A24%20Helper%20Advanced%20%28%D0%9A%D0%B8%D1%80%D0%B8%D0%BB%D0%BB%29.user.js
// @updateURL https://update.greasyfork.org/scripts/554105/A24%20Helper%20Advanced%20%28%D0%9A%D0%B8%D1%80%D0%B8%D0%BB%D0%BB%29.meta.js
// ==/UserScript==

(function() {
  'use strict';

    const isBitrix = location.hostname.includes('bx.cloudguru.us');
    const isBibi   = location.protocol === 'file:';

    if (isBitrix) {
        const dealId = window.location.pathname.split('/').filter(Boolean).pop();
        if (!dealId || isNaN(dealId)) return;

        function createButton() {
            const container = document.querySelector('.crm-entity-stream-container-list');
            if (!container || container.querySelector('.open-in-bibi-btn')) return;

            const btn = document.createElement('button');
            btn.textContent = 'Открыть в Биби';
            btn.className = 'open-in-bibi-btn';
            btn.style.cssText = `
                display:block;
                margin:10px auto;
                padding:8px 16px;
                font-size:16px;
                border:2px solid #6c4f77;
                background:rgba(108,79,119,0.8);
                color:#fff;
                border-radius:6px;
                cursor:pointer;
            `;

            btn.addEventListener('click', async () => {
                const payload = { id: dealId, time: Date.now() };
                await GM_setValue('bibi_last_order', payload);
                console.log('[BIBI SYNC] Sent order:', payload);
            });

            container.insertBefore(btn, container.firstChild);
        }

        const observer = new MutationObserver(createButton);
        observer.observe(document.body, { childList: true, subtree: true });
        createButton();
    }

    if (isBibi) {

    async function getTokenKey(who) {
        if (who === "accounts") { return "https://script.google.com/macros/s/AKfycbwViulD8QsScjsJbuZkjMWGarWt3UTDGbBCF9ZrUZoWXtpCkYbAs2kMvTvcTbq0N4sg/exec" }
        else if (who === "calendar") { return "https://script.google.com/macros/s/AKfycbyVblkw9iO_JLNcbWgsFgr-0g4NlaDUwPTe4zqzwYWVYZLosxWjyWF0YfukHgpOWtnY/exec" }
        else if (who === "responses") { return "https://script.google.com/macros/s/AKfycbwwCRctNSBBNZKrVAS9-gIZB-umEZKRfe_8UNPTx7pnC5Y4rTnIczn1ce4Pq10vbR-x/exec" }
        else if (who === "api") { return "https://script.google.com/macros/s/AKfycbw8TbLRiQ5tkwOuoyNOdKg9tCPucmluZek3QR5kxyzstQXwkIR1ZBhVhtB5YMIP6Ji_/exec" } // https://script.google.com/macros/s/AKfycbw8TbLRiQ5tkwOuoyNOdKg9tCPucmluZek3QR5kxyzstQXwkIR1ZBhVhtB5YMIP6Ji_/exec
        else { return }
      }

    let requestCounter = 0;

    // Функция для преобразования DataURL в Blob
    function dataURLtoBlob(dataURL) {
        const [header, base64] = dataURL.split(",");
        const mime = header.match(/:(.*?);/)[1];
        const binary = atob(base64);
        const len = binary.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
        return new Blob([bytes], { type: mime });
    }

    let offerRequestCounter = 0;

// ФИНАЛЬНОЕ РЕШЕНИЕ - используем обычный fetch с FormData
async function addFileS(orderId, offerId, fileName, fileData) {
    console.log("📦 Отправка файла для оффера:", offerId, "имя:", fileName);

    if (!fileData || typeof fileData !== "string" || !fileData.startsWith("data:")) {
        throw new Error("Invalid fileData: expected DataURL string");
    }

    if (!offerId || !fileName || !orderId) {
        throw new Error("Параметры orderId, offerId и fileName обязательны");
    }

    const requestId = ++offerRequestCounter;
    console.log("📤 Отправка запроса #" + requestId);

    try {
        const fileBlob = dataURLtoBlob(fileData);
        console.log("🔄 Blob создан, размер:", fileBlob.size, "тип:", fileBlob.type);

        // Создаём FormData
        const formData = new FormData();
        formData.append('offerId', offerId);
        formData.append('file0', fileBlob, fileName);

        console.log("🌐 Отправляем через GM_xmlhttpRequest...");

        // GM_xmlhttpRequest с FormData
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error("Request timeout"));
            }, 30000);

            GM_xmlhttpRequest({
                method: "POST",
                url: "https://avtor24.ru/fileapi/upload/offer",
                headers: {
                    "Accept": "*/*",
                    "Accept-Language": "ru,en;q=0.9",
                    "X-Requested-With": "XMLHttpRequest",
                    "Referer": `https://avtor24.ru/order/${orderId}`
                },
                data: formData,
                onload: function(response) {
                    clearTimeout(timeout);
                    console.log("📨 Ответ:", response.status, response.statusText);

                    if (response.status === 200) {
                        try {
                            const result = JSON.parse(response.responseText);
                            console.log("✅ Успешно загружено:", result);
                            resolve(result);
                        } catch (parseError) {
                            console.error("❌ Ошибка парсинга ответа:", parseError);
                            reject(new Error("Failed to parse server response"));
                        }
                    } else {
                        console.error("❌ HTTP ошибка:", response.status, response.statusText);
                        reject(new Error(`HTTP ${response.status}: ${response.statusText}`));
                    }
                },
                onerror: function(error) {
                    clearTimeout(timeout);
                    console.error("❌ Ошибка сети:", error);
                    reject(new Error("Network error: " + JSON.stringify(error)));
                },
                ontimeout: function() {
                    clearTimeout(timeout);
                    console.error("❌ Таймаут запроса");
                    reject(new Error("Request timeout"));
                }
            });
        });
    } catch (error) {
        console.error("❌ Ошибка:", error);
        throw error;
    }
}


// Простое решение - GM_xmlhttpRequest поддерживает FormData напрямую!
async function sendFile(orderId, authorId, isFinal, fileName, fileData) {
    console.log("📁 Начало загрузки файла:", fileName, "для заказа:", orderId);

    if (!fileData || typeof fileData !== "string" || !fileData.startsWith("data:")) {
        throw new Error("Invalid fileData: expected DataURL string");
    }

    if (!orderId || !authorId || !fileName) {
        throw new Error("Все параметры обязательны: orderId, authorId, fileName");
    }

    const requestId = ++requestCounter;
    console.log("📤 Отправка запроса #" + requestId);

    try {
        const fileBlob = dataURLtoBlob(fileData);
        console.log("🔄 Blob создан, размер:", fileBlob.size, "тип:", fileBlob.type);

        // Создаём FormData
        const formData = new FormData();
        formData.append('order_id', orderId);
        formData.append('toAuthorId', authorId);
        formData.append('fileStatus', isFinal ? '1' : '0');
        formData.append('file0', fileBlob, fileName);

        console.log("🌐 Отправляем через GM_xmlhttpRequest...");

        // GM_xmlhttpRequest автоматически обработает FormData!
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error("Request timeout"));
            }, 30000);

            GM_xmlhttpRequest({
                method: "POST",
                url: "https://a24.biz/ajax/addComment",
                headers: {
                    "Accept": "*/*",
                    "Accept-Language": "ru,en;q=0.9",
                    "X-Requested-With": "XMLHttpRequest"
                },
                data: formData,  // Передаём FormData напрямую!
                onload: function(response) {
                    clearTimeout(timeout);
                    console.log("📨 Получен ответ:", response.status, response.statusText);

                    if (response.status === 200) {
                        try {
                            const result = JSON.parse(response.responseText);
                            console.log("✅ Ответ обработан:", result);

                            if (result.success) {
                                console.log("✅ Файл загружен успешно");
                                resolve(result);
                            } else {
                                console.error("❌ Сервер вернул ошибку:", result);
                                reject(new Error(result.error || result.message || "Server returned error"));
                            }
                        } catch (parseError) {
                            console.error("❌ Ошибка парсинга ответа:", parseError);
                            reject(new Error("Failed to parse server response: " + parseError.message));
                        }
                    } else {
                        console.error("❌ HTTP ошибка:", response.status, response.statusText);
                        reject(new Error(`HTTP ${response.status}: ${response.statusText}`));
                    }
                },
                onerror: function(error) {
                    clearTimeout(timeout);
                    console.error("❌ Ошибка сети:", error);
                    reject(new Error("Network error: " + JSON.stringify(error)));
                },
                ontimeout: function() {
                    clearTimeout(timeout);
                    console.error("❌ Таймаут запроса");
                    reject(new Error("Request timeout"));
                }
            });
        });
    } catch (error) {
        console.error("❌ Ошибка:", error);
        throw error;
    }
}

async function getOrderNotices(orderId) {
  return new Promise((resolve, reject) => {
    const body = `{\"operationName\":\"getOrderNotices\",\"variables\":{\"orderId\":\"${orderId}\"},\"query\":\"query getOrderNotices($orderId: ID!) {\\n  order(id: $orderId) {\\n    id\\n    notices {\\n      __typename\\n      ... on selectperformer {\\n        ...SelectPerformerFragment\\n        __typename\\n      }\\n      ... on requestdeadline {\\n        ...RequestDeadlineFragment\\n        __typename\\n      }\\n      ... on requesthalfperiod {\\n        ...RequestHalfPeriod\\n        __typename\\n      }\\n      ... on noticecomplain {\\n        ...NoticeComplainFragment\\n        __typename\\n      }\\n      ... on noticenofinishfile {\\n        ...NoticeNoFinishFileFragment\\n        __typename\\n      }\\n      ... on noticenofile {\\n        ...NoticeNoFileFragment\\n        __typename\\n      }\\n      ... on noticerejectcorrect {\\n        ...NoticeRejectCorrectFragment\\n        __typename\\n      }\\n      ... on noticeclosingcorrect {\\n        ...NoticeClosingCorrectFragment\\n        __typename\\n      }\\n      ... on noticefinishfile {\\n        ...NoticeFinishFileFragment\\n        __typename\\n      }\\n      ... on noticeexpirecorrect {\\n        ...NoticeExpireCorrectFragment\\n        __typename\\n      }\\n      ... on noticemakecorrect {\\n        ...NoticeMakeCorrectFragment\\n        __typename\\n      }\\n      ... on noticecancellationrequest {\\n        ...NoticeCancellationRequestFragment\\n        __typename\\n      }\\n      ... on noticecancellationrequestrejected {\\n        ...NoticeCancellationRequestRejectedFragment\\n        __typename\\n      }\\n      ... on noticecancellationrequestaccepted {\\n        ...NoticeCancellationRequestAcceptedFragment\\n        __typename\\n      }\\n      ... on noticeearlyacceptwork {\\n        ...NoticeEarlyAcceptWorkFragment\\n        __typename\\n      }\\n      ... on noticerecalculation {\\n        ...NoticeRecalculationFragment\\n        __typename\\n      }\\n      ... on noticewarrantyend {\\n        ...NoticeWarrantyEndFragment\\n        __typename\\n      }\\n      ... on noticestartwork {\\n        ...NoticeStartWorkFragment\\n        __typename\\n      }\\n      ... on noticependingpayment {\\n        ...NoticePendingPaymentFragment\\n        __typename\\n      }\\n      ... on noticefailedpayment {\\n        ...NoticeFailedPaymentFragment\\n        __typename\\n      }\\n      ... on noticehidden {\\n        ...NoticeHiddenFragment\\n        __typename\\n      }\\n      ... on noticeauthorsendbaninwork {\\n        ...NoticeAuthorSendBanInWorkFragment\\n        __typename\\n      }\\n      ... on noticecanrejectchooseauthor {\\n        ...NoticeCanRejectChooseAuthorFragment\\n        __typename\\n      }\\n      ... on noticeexpectpartpaypaidfull {\\n        ...NoticeExpectPartPayPaidFullFragment\\n        __typename\\n      }\\n      ... on noticeexpectpartpayextenddeadline {\\n        ...NoticeExpectPartPayExtendDeadlineFragment\\n        __typename\\n      }\\n      ... on noticecustomerrequestcall {\\n        ...NoticeCustomerRequestCallFragment\\n        __typename\\n      }\\n      ... on noticecalltoauthorresolveresult {\\n        ...NoticeCallToAuthorResolveResultFragment\\n        __typename\\n      }\\n      ... on reviewon50percentreject {\\n        ...ReviewOn50PercentRejectFragment\\n        __typename\\n      }\\n      ... on noticecorrectionafterwarrantyperiod {\\n        ...NoticeCorrectionAfterWarrantyPeriodFragment\\n        __typename\\n      }\\n      ... on noticerecalculationauthors {\\n        ...NoticeRecalculationAuthorsFragment\\n        __typename\\n      }\\n      ... on noticeauthorattachfinalfile {\\n        ...NoticeAuthorAttachFinalFileFragment\\n        __typename\\n      }\\n      ... on noticereturncustomer {\\n        ...NoticeReturnCustomerFragment\\n        __typename\\n      }\\n      ... on noticeauthorrejectstartwork {\\n        ...NoticeAuthorRejectStartWorkFragment\\n        __typename\\n      }\\n      ... on noticenps {\\n        ...NoticeRateNpsFragment\\n        __typename\\n      }\\n      ... on noticebnplpaymentfail {\\n        ...NoticeBnplPaymentFailFragment\\n        __typename\\n      }\\n      ... on noticebnplpaymentpending {\\n        ...NoticeBnplPaymentPendingFragment\\n        __typename\\n      }\\n      ... on noticebnplpaymentconfirmed {\\n        id\\n        __typename\\n      }\\n    }\\n    __typename\\n  }\\n}\\n\\nfragment NoticeAuthorAttachFinalFileFragment on noticeauthorattachfinalfile {\\n  id\\n  orderId\\n  price\\n  finalFile {\\n    filePath\\n    fileName\\n    __typename\\n  }\\n  prePaymentDebt\\n  reworks {\\n    id\\n    bid\\n    title\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment NoticeAuthorRejectStartWorkFragment on noticeauthorrejectstartwork {\\n  id\\n  orderId\\n  hidden\\n  authorRejectStartWork {\\n    id\\n    nickName\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment NoticeAuthorSendBanInWorkFragment on noticeauthorsendbaninwork {\\n  id\\n  orderId\\n  hidden\\n  __typename\\n}\\n\\nfragment NoticeCallToAuthorResolveResultFragment on noticecalltoauthorresolveresult {\\n  id\\n  orderId\\n  lastActiveCallComment\\n  __typename\\n}\\n\\nfragment NoticeCancellationRequestFragment on noticecancellationrequest {\\n  id\\n  orderId\\n  price\\n  cancellationRequestDate\\n  cancellationRequestReason\\n  cancellationRequesterId\\n  cancellationRequesterGroupId\\n  __typename\\n}\\n\\nfragment NoticeCancellationRequestAcceptedFragment on noticecancellationrequestaccepted {\\n  id\\n  orderId\\n  cancellationRequestDate\\n  cancellationRequestResolveDate\\n  cancellationRequestReason\\n  cancellationRequestStatus\\n  cancellationRequesterId\\n  cancellationRequesterGroupId\\n  hidden\\n  __typename\\n}\\n\\nfragment NoticeCancellationRequestRejectedFragment on noticecancellationrequestrejected {\\n  id\\n  orderId\\n  price\\n  cancellationRequestDate\\n  cancellationRequestResolveDate\\n  cancellationRequestReason\\n  cancellationRequestAnswer\\n  cancellationRequestStatus\\n  cancellationRequesterId\\n  cancellationRequesterGroupId\\n  __typename\\n}\\n\\nfragment NoticeCanRejectChooseAuthorFragment on noticecanrejectchooseauthor {\\n  id\\n  orderId\\n  author {\\n    id\\n    nickName\\n    __typename\\n  }\\n  diffTimeApproveChoosing {\\n    days\\n    daysText\\n    hours\\n    hoursText\\n    minutes\\n    minutesText\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment NoticeClosingCorrectFragment on noticeclosingcorrect {\\n  id\\n  orderId\\n  price\\n  partPrice\\n  dateWarrantyStart\\n  dateWarrantyEnd\\n  correctionsCount\\n  canAcceptOrder\\n  finalFile {\\n    fileName\\n    filePath\\n    __typename\\n  }\\n  reworks {\\n    id\\n    bid\\n    title\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment NoticeComplainFragment on noticecomplain {\\n  id\\n  orderId\\n  partPrice\\n  complainerGroupId\\n  complainDate\\n  complainFile {\\n    id\\n    fileName\\n    creation\\n    fileSizeInMb\\n    fileHash\\n    filePath\\n    __typename\\n  }\\n  customReason {\\n    name\\n    customer_comment\\n    performer_accept\\n    performer_comment\\n    __typename\\n  }\\n  complainStatus\\n  complainSubStatus\\n  complainSumWantCustomer\\n  complainSumWantPerformer\\n  complainCounterSumwant\\n  complainFinishedPercent\\n  complainAuthorAccept\\n  complainAuthorNoob\\n  complainerId\\n  authorsComment\\n  complainNonRefundableCommission\\n  reworks {\\n    id\\n    bid\\n    title\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment NoticeCorrectionAfterWarrantyPeriodFragment on noticecorrectionafterwarrantyperiod {\\n  id\\n  orderId\\n  price\\n  datePaid\\n  gradeHidden\\n  gradeComment\\n  gradeAnswer\\n  gradeCarma\\n  __typename\\n}\\n\\nfragment NoticeCustomerRequestCallFragment on noticecustomerrequestcall {\\n  id\\n  orderId\\n  __typename\\n}\\n\\nfragment NoticeEarlyAcceptWorkFragment on noticeearlyacceptwork {\\n  id\\n  orderId\\n  price\\n  datePaid\\n  gradeHidden\\n  gradeComment\\n  gradeAnswer\\n  gradeCarma\\n  reworks {\\n    id\\n    bid\\n    title\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment NoticeExpectPartPayExtendDeadlineFragment on noticeexpectpartpayextenddeadline {\\n  id\\n  orderId\\n  prePaymentDebt\\n  __typename\\n}\\n\\nfragment NoticeExpectPartPayPaidFullFragment on noticeexpectpartpaypaidfull {\\n  id\\n  orderId\\n  author {\\n    id\\n    nickName\\n    __typename\\n  }\\n  deadlineDate\\n  prePaymentSum\\n  prePaymentDebt\\n  waitStartWork\\n  __typename\\n}\\n\\nfragment NoticeExpireCorrectFragment on noticeexpirecorrect {\\n  id\\n  orderId\\n  price\\n  partPrice\\n  deadlineCorrection\\n  reworks {\\n    id\\n    bid\\n    title\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment NoticeFailedPaymentFragment on noticefailedpayment {\\n  id\\n  orderId\\n  selectedAuthor {\\n    id\\n    nickName\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment NoticeFinishFileFragment on noticefinishfile {\\n  id\\n  orderId\\n  partPrice\\n  dateWarrantyStart\\n  dateWarrantyEnd\\n  canAcceptOrder\\n  finalFile {\\n    id\\n    user_id\\n    fileName\\n    filePath\\n    creation\\n    fileSizeInMb\\n    creationReadable\\n    fileType\\n    __typename\\n  }\\n  reworks {\\n    id\\n    bid\\n    title\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment NoticeHiddenFragment on noticehidden {\\n  id\\n  orderId\\n  __typename\\n}\\n\\nfragment NoticeMakeCorrectFragment on noticemakecorrect {\\n  id\\n  orderId\\n  price\\n  daysForCorrections\\n  deadlineCorrection\\n  reworks {\\n    id\\n    bid\\n    title\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment NoticeNoFileFragment on noticenofile {\\n  id\\n  orderId\\n  partPrice\\n  reworks {\\n    id\\n    bid\\n    title\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment NoticeNoFinishFileFragment on noticenofinishfile {\\n  id\\n  orderId\\n  partPrice\\n  deadline\\n  reworks {\\n    id\\n    bid\\n    title\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment NoticeRateNpsFragment on noticenps {\\n  id\\n  __typename\\n}\\n\\nfragment NoticePendingPaymentFragment on noticependingpayment {\\n  id\\n  orderId\\n  offerId\\n  hidden\\n  selectedAuthor {\\n    id\\n    nickName\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment NoticeRecalculationFragment on noticerecalculation {\\n  id\\n  orderId\\n  price\\n  complainDate\\n  complainerId\\n  complainerGroupId\\n  complainOrderStage\\n  complainSumPaidCustomer\\n  complainClientReason\\n  gradeHidden\\n  gradeComment\\n  gradeAnswer\\n  gradeCarma\\n  hidden\\n  reworks {\\n    id\\n    bid\\n    title\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment NoticeRecalculationAuthorsFragment on noticerecalculationauthors {\\n  id\\n  orderId\\n  price\\n  complainDate\\n  complainerId\\n  complainerGroupId\\n  complainOrderStage\\n  complainSumPaidCustomer\\n  complainClientReason\\n  gradeHidden\\n  gradeComment\\n  gradeAnswer\\n  gradeCarma\\n  reworks {\\n    id\\n    bid\\n    title\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment NoticeRejectCorrectFragment on noticerejectcorrect {\\n  id\\n  orderId\\n  price\\n  partPrice\\n  dateWarrantyEnd\\n  reworks {\\n    id\\n    bid\\n    title\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment NoticeReturnCustomerFragment on noticereturncustomer {\\n  id\\n  bonusAmount\\n  orderId\\n  price\\n  bonusPercent\\n  __typename\\n}\\n\\nfragment NoticeStartWorkFragment on noticestartwork {\\n  id\\n  orderId\\n  deadline\\n  deadlinePhrase\\n  warrantyDays\\n  __typename\\n}\\n\\nfragment NoticeWarrantyEndFragment on noticewarrantyend {\\n  id\\n  orderId\\n  price\\n  datePaid\\n  warrantyDays\\n  gradeHidden\\n  gradeComment\\n  gradeAnswer\\n  gradeCarma\\n  reworks {\\n    id\\n    bid\\n    title\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment RequestDeadlineFragment on requestdeadline {\\n  id\\n  orderId\\n  partPrice\\n  requestNewDeadline\\n  newDeadlineReason\\n  reworks {\\n    id\\n    bid\\n    title\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment RequestHalfPeriod on requesthalfperiod {\\n  id\\n  orderId\\n  deadline\\n  deadlinePhrase\\n  warrantyDays\\n  __typename\\n}\\n\\nfragment ReviewOn50PercentRejectFragment on reviewon50percentreject {\\n  id\\n  orderId\\n  rejectAuthor {\\n    id\\n    nickName\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment SelectPerformerFragment on selectperformer {\\n  id\\n  orderId\\n  dateChoosePerformer\\n  paymentAmount\\n  price\\n  warrantyDays\\n  author {\\n    id\\n    nickName\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment NoticeBnplPaymentFailFragment on noticebnplpaymentfail {\\n  id\\n  orderId\\n  offerId\\n  __typename\\n}\\n\\nfragment NoticeBnplPaymentPendingFragment on noticebnplpaymentpending {\\n  id\\n  orderId\\n  offerId\\n  __typename\\n}\\n\"}`;

    GM_xmlhttpRequest({
      method: "POST",
      url: "https://avtor24.ru/graphqlapi",
      headers: {
        "accept": "*/*",
        "content-type": "application/json",
        "referer": "https://avtor24.ru/order/" + orderId,
        "x-requested-with": "XMLHttpRequest",
        "user-agent": navigator.userAgent
      },
      anonymous: false,
      data: body,
      onload: function (response) {
        try {
          const text = response.responseText || "";
          const data = JSON.parse(text);
          if (data?.data?.order) {
            console.log("✅ Успешный ответ GraphQL:", data.data.order);
            resolve(data.data.order);
          } else {
            console.warn("⚠️ Сервер не вернул order:", text);
            resolve(null);
          }
        } catch (err) {
          reject("Ошибка обработки ответа: " + err);
        }
      },
      onerror: function (err) {
        reject("Ошибка GraphQL-запроса: " + JSON.stringify(err));
      }
    });
  });
}






  // === Получение CSRF-токена ===
  async function getCsrfToken() {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET",
        url: "https://a24.biz/ajax/getCSRFToken/",
        headers: {
          "accept": "*/*",
          "accept-language": "ru,en;q=0.9",
          "x-requested-with": "XMLHttpRequest",
          "user-agent": navigator.userAgent,
          "referer": "https://a24.biz/login"
        },
        // важно: не responseType=json, а текст — чтобы не ломалось при HTML
        responseType: "text",
        anonymous: false,
        onload: function(response) {
          try {
            if (!response.responseText) {
              reject("❌ Пустой ответ от сервера");
              return;
            }

            const text = response.responseText.trim();
            let data = null;
            try {
              data = JSON.parse(text);
            } catch {
              console.warn("⚠️ Ответ не JSON, пришёл HTML:", text.slice(0, 200));
            }

            const token = data?.ci_csrf_token || data?.token || data?.csrf_token || null;
            if (token) {
              console.log("✅ CSRF токен:", token);
              resolve(token);
            } else {
              reject("❌ Токен не найден в ответе");
            }
          } catch (err) {
            reject("Ошибка парсинга CSRF: " + err);
          }
        },
        onerror: function(err) {
          reject("Ошибка при запросе CSRF: " + JSON.stringify(err));
        }
      });
    });
  }

async function getCsrfTokenS() {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET",
        url: "https://avtor24.ru/ajax/getCSRFToken/",
        headers: {
          "accept": "*/*",
          "accept-language": "ru,en;q=0.9",
          "x-requested-with": "XMLHttpRequest",
          "user-agent": navigator.userAgent,
          "referer": "https://avtor24.ru/login"
        },
        // важно: не responseType=json, а текст — чтобы не ломалось при HTML
        responseType: "text",
        anonymous: false,
        onload: function(response) {
          try {
            if (!response.responseText) {
              reject("❌ Пустой ответ от сервера");
              return;
            }

            const text = response.responseText.trim();
            let data = null;
            try {
              data = JSON.parse(text);
            } catch {
              console.warn("⚠️ Ответ не JSON, пришёл HTML:", text.slice(0, 200));
            }

            const token = data?.ci_csrf_token || data?.token || data?.csrf_token || null;
            if (token) {
              console.log("✅ CSRF токен:", token);
              resolve(token);
            } else {
              reject("❌ Токен не найден в ответе");
            }
          } catch (err) {
            reject("Ошибка парсинга CSRF: " + err);
          }
        },
        onerror: function(err) {
          reject("Ошибка при запросе CSRF: " + JSON.stringify(err));
        }
      });
    });
  }

  // === Вход ===
async function login(email, password, id, numforlock) {
  console.log("Выполняется вход с такими данными: ", email, password, id, numforlock);
  try {
    // --- Проверка активного профиля ---
    const profileResponse = await fetchProfile().catch(() => null);
    const currentProfileId = profileResponse?.data?.profile?.id;
    const currentProfileIdNum = Number(currentProfileId);
    const targetProfileIdNum = Number(id);

    if (currentProfileIdNum && currentProfileIdNum === targetProfileIdNum) {
      console.log("🟢 Уже вошли в нужный профиль, вход не требуется");
      return true;
    }

    if (currentProfileIdNum && currentProfileIdNum !== targetProfileIdNum) {
      console.log(`🔄 Активен другой профиль (${currentProfileIdNum}) а должен быть (${targetProfileIdNum}), выполняю выход...`);
      try {
        await logout();
        console.log("✅ Выход выполнен");
      } catch (logoutErr) {
        console.warn("⚠️ Ошибка при выходе:", logoutErr);
      }
    }

    // --- Получаем CSRF-токен и выполняем вход ---
    const csrfToken = await getCsrfToken();

    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "POST",
        url: "https://a24.biz/login",
        headers: {
          "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
          "content-type": "application/x-www-form-urlencoded",
          "user-agent": navigator.userAgent,
          "referer": "https://a24.biz/login",
          "x-requested-with": "XMLHttpRequest"
        },
        data: `ci_csrf_token=${encodeURIComponent(csrfToken)}&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
        anonymous: false,

        onload: async function(response) {
          const finalUrl = response.finalUrl || "";
          const text = response.responseText || "";

          // === Проверка редиректа на countrylock ===
          if (finalUrl.includes("/auth/countrylock")) {
            console.warn("⚠️ Требуется подтверждение по региону, отправляю 9521...");

            GM_xmlhttpRequest({
              method: "POST",
              url: "https://a24.biz/auth/countrylock/",
              headers: {
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
                "content-type": "application/x-www-form-urlencoded",
                "user-agent": navigator.userAgent,
                "referer": "https://a24.biz/auth/countrylock/",
                "x-requested-with": "XMLHttpRequest"
              },
              data: `num=${numforlock}`,
              anonymous: false,
              onload: function(r2) {
                const ok = r2.finalUrl && !r2.finalUrl.includes("/countrylock");
                if (ok || r2.responseText.includes("home") || r2.responseText.includes("Выход")) {
                  console.log("✅ Подтверждение региона успешно, вход завершён");
                  resolve(true);
                } else {
                  console.error("❌ Ошибка при подтверждении региона: ", r2);
                  resolve(false);
                }
              },
              onerror: err => reject("Ошибка при подтверждении: " + JSON.stringify(err))
            });
            return;
          }

          // === Проверка успешного входа ===
          const redirected = finalUrl && !finalUrl.includes("/login");
          console.log(response)
          if (redirected || text.includes("https://a24.biz/home") || text.includes("Выход")) {
            console.log("✅ Вход выполнен");
            resolve(true);
          } else {
            console.warn("⚠️ Неверный логин или пароль");
            resolve(false);
          }
        },

        onerror: function(err) {
          reject("Ошибка при входе: " + JSON.stringify(err));
        }
      });
    });

  } catch (err) {
    console.error("Ошибка входа:", err);
    throw err;
  }
}


async function loginS(email, password, id, numforlock) {
  console.log("Выполняется вход с такими данными: ", email, password, id, numforlock);
  try {
    // --- Проверка активного профиля ---
    const profileResponse = await fetchProfileS().catch(() => null);
    const currentProfileId = profileResponse?.data?.profile?.id;
    const currentProfileIdNum = Number(currentProfileId);
    const targetProfileIdNum = Number(id);
    const admin = await checkAdminS();

    if (currentProfileIdNum && currentProfileIdNum === targetProfileIdNum) {
      console.log("🟢 Уже вошли в нужный профиль, вход не требуется");
      return true;
    }

    if (currentProfileIdNum && currentProfileIdNum !== targetProfileIdNum) {
      console.log(`🔄 Активен другой профиль (${currentProfileIdNum}) а должен быть (${targetProfileIdNum}), выполняю выход...`);
      try {
        await logoutS();
        console.log("✅ Выход выполнен");
      } catch (logoutErr) {
        console.warn("⚠️ Ошибка при выходе:", logoutErr);
      }
    }

    if (admin) {
      await logoutS();
    }

    // --- Получаем CSRF-токен и выполняем вход ---
    const csrfToken = await getCsrfTokenS();

    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "POST",
        url: "https://avtor24.ru/login",
        headers: {
          "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
          "content-type": "application/x-www-form-urlencoded",
          "user-agent": navigator.userAgent,
          "referer": "https://avtor24.ru/login",
          "x-requested-with": "XMLHttpRequest"
        },
        data: `ci_csrf_token=${encodeURIComponent(csrfToken)}&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
        anonymous: false,

        onload: async function(response) {
          const finalUrl = response.finalUrl || "";
          const text = response.responseText || "";

          // === Проверка редиректа на countrylock ===
          if (finalUrl.includes("/auth/countrylock")) {
            console.warn("⚠️ Требуется подтверждение по региону, отправляю 9521...");

            GM_xmlhttpRequest({
              method: "POST",
              url: "https://avtor24.ru/auth/countrylock/",
              headers: {
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
                "content-type": "application/x-www-form-urlencoded",
                "user-agent": navigator.userAgent,
                "referer": "https://avtor24.ru/auth/countrylock/",
                "x-requested-with": "XMLHttpRequest"
              },
              data: `num=${numforlock}`,
              anonymous: false,
              onload: function(r2) {
                const ok = r2.finalUrl && !r2.finalUrl.includes("/countrylock");
                if (ok || r2.responseText.includes("home") || r2.responseText.includes("Выход")) {
                  console.log("✅ Подтверждение региона успешно, вход завершён");
                  resolve(true);
                } else {
                  console.error("❌ Ошибка при подтверждении региона: ", r2);
                  resolve(false);
                }
              },
              onerror: err => reject("Ошибка при подтверждении: " + JSON.stringify(err))
            });
            return;
          }

          // === Проверка успешного входа ===
          const redirected = finalUrl && !finalUrl.includes("/login");
          console.log(response)
          if (redirected || text.includes("https://avtor24.ru/home") || text.includes("Выход")) {
            console.log("✅ Вход выполнен");
            resolve(true);
          } else {
            console.warn("⚠️ Неверный логин или пароль");
            resolve(false);
          }
        },

        onerror: function(err) {
          reject("Ошибка при входе: " + JSON.stringify(err));
        }
      });
    });

  } catch (err) {
    console.error("Ошибка входа:", err);
    throw err;
  }
}

async function clearNotifications() {
  return new Promise((resolve, reject) => {
    const body =
      "{\"operationName\":\"clearNotifications\",\"variables\":{},\"query\":\"mutation clearNotifications {\\n  clearNotifications\\n}\\n\"}";

    GM_xmlhttpRequest({
      method: "POST",
      url: "https://avtor24.ru/graphqlapi",
      headers: {
        "accept": "*/*",
        "accept-language": "ru,en;q=0.9,en-GB;q=0.8,en-US;q=0.7",
        "content-type": "application/json",
        "priority": "u=1, i",
        "sec-ch-ua": "\"Microsoft Edge\";v=\"141\", \"Not?A_Brand\";v=\"8\", \"Chromium\";v=\"141\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "referer": "https://avtor24.ru/my/notifications",
        "x-requested-with": "XMLHttpRequest"
      },
      anonymous: false, // обязательно — чтобы запрос шёл с авторизацией (куки)
      data: body,
      onload: function (response) {
        console.log("GraphQL Response:", response.responseText);
        try {
          const parsed = JSON.parse(response.responseText);
          resolve(parsed?.data?.clearNotifications ?? null);
        } catch (e) {
          reject("Ошибка JSON.parse: " + e + " / " + response.responseText);
        }
      },
      onerror: function (error) {
        reject("Ошибка GraphQL clearNotifications: " + JSON.stringify(error));
      }
    });
  });
}


  // === Выход ===
  async function logout() {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET",
        url: "https://a24.biz/logout",
        headers: {
          "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
          "user-agent": navigator.userAgent,
          "referer": "https://a24.biz/dashboard"
        },
        anonymous: false,
        onload: function(response) {
          const redirected = response.finalUrl && response.finalUrl.includes("/login");
          const text = response.responseText || "";
          if (response.status === 200) {
            console.log("✅ Выход успешен");
            resolve(true);
          } else {
            console.warn("⚠️ Выход возможно не удался");
            resolve(false);
          }
        },
        onerror: function(err) {
          reject("Ошибка при выходе: " + JSON.stringify(err));
        }
      });
    });
  }

  async function logoutS() {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET",
        url: "https://avtor24.ru/logout",
        headers: {
          "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
          "user-agent": navigator.userAgent,
          "referer": "https://avtor24.ru/dashboard"
        },
        anonymous: false,
        onload: function(response) {
          const redirected = response.finalUrl && response.finalUrl.includes("/login");
          const text = response.responseText || "";
          if (response.status === 200) {
            console.log("✅ Выход успешен");
            resolve(true);
          } else {
            console.warn("⚠️ Выход возможно не удался");
            resolve(false);
          }
        },
        onerror: function(err) {
          reject("Ошибка при выходе: " + JSON.stringify(err));
        }
      });
    });
  }

  async function getOrderComposedStage(orderId) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "POST",
        url: "https://a24.biz/graphqlapi",
        headers: {
          "accept": "*/*",
          "content-type": "application/json",
          "user-agent": navigator.userAgent,
          "referer": "https://a24.biz/dashboard",
          "x-requested-with": "XMLHttpRequest"
        },
        data: JSON.stringify({
          operationName: "getOrderComposedStage",
          variables: { id: orderId },
          query: `query getOrderComposedStage($id: ID!) {
            order(id: $id) {
              id
              extendedStage
              __typename
            }
          }`
        }),
        anonymous: false,
        onload: function(response) {
          try {
            const text = response.responseText || "";
            const data = JSON.parse(text);
            if (data?.data?.order) {
              console.log("✅ Заказ найден:", data.data.order);
              resolve(data.data.order);
            } else {
              console.warn("⚠️ Не удалось получить заказ:", text);
              resolve(null);
            }
          } catch (err) {
            reject("Ошибка обработки GraphQL-ответа: " + err);
          }
        },
        onerror: function(err) {
          reject("Ошибка GraphQL-запроса: " + JSON.stringify(err));
        }
      });
    });
  }

  async function getOrder(orderId) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "POST",
        url: "https://a24.biz/graphqlapi",
        headers: {
          "accept": "*/*",
          "content-type": "application/json",
          "user-agent": navigator.userAgent,
          "referer": "https://a24.biz/dashboard",
          "x-requested-with": "XMLHttpRequest"
        },
        data: JSON.stringify({
          operationName: "getOrder",
          variables: { id: orderId },
          query: `query getOrder($id: ID!) {
            order(id: $id) {
              ...OrderDataFull
              __typename
            }
            dialog(orderId: $id) {
              ...OrderDataDialogRefresh
              __typename
            }
          }
          fragment OrderDataFull on order {
            ...OrderDataBase
            ...OrderDataRefresh
            __typename
          }
          fragment OrderDataBase on order {
            id
            title
            deadline
            description
            unique
            uniqueService { url name __typename }
            pagesTo
            customProperties {
              name
              value_id
              value_name
              __typename
            }
            customPropertiesSimpleElements {
              value
              name
              __typename
            }
            type {
              id
              name
              __typename
            }
            category {
              id
              name
              __typename
            }
            pagesFrom
            font
            interval
            creation
            warrantyPeriod: warranty_period
            customerFiles { ...fileFragment __typename }
            authorFiles { ...fileFragment __typename }
            authorOffer { bid }
            customer {
              id
              isOnline
              lastVisit
              nickName
              avatar(size: size50x50)
              __typename
            }
            __typename
          }
          fragment fileFragment on file {
            id
            name
            sizeInMb
            path
            hash
            type
            isFinal
            readableCreationUnixtime
            __typename
          }
          fragment OrderDataRefresh on order {
            id
            creation
            deadline
            extendedStage
            dateCorrectionStart
            deadlineCorrection
            dateWarrantyStart
            dateWarrantyEnd
            deadlineBeenPercent
            authorOffer { bid }
            amount {
              value
              paidSum
              detailed {
                __typename
                ... on orderprice { value __typename }
                ... on reworkprice { value title isPaid __typename }
              }
              __typename
            }
            ...orderNoticesFragment
            __typename
          }
          fragment orderNoticesFragment on order {
            noticeModels {
              __typename
              ... on noticecancellationrequest {
                id
                cancellationRequestReason
                remainingCancellationRequests
                __typename
              }
              ... on noticecancellationrequestrejected {
                id
                cancellationRequestDate
                cancellationRequestResolveDate
                cancellationRequestReason
                cancellationRequestAnswer
                cancellationRequestStatus
                cancellationRequesterId
                cancellationRequesterGroupId
                bid
                __typename
              }
              ... on noticecancellationrequestaccepted {
                id
                cancellationRequestDate
                cancellationRequestResolveDate
                cancellationRequestReason
                cancellationRequestStatus
                cancellationRequesterId
                cancellationRequesterGroupId
                hidden
                bid
                __typename
              }
              ... on noticeclosingcorrect {
                id
                correctionsCount
                dateWarrantyEnd
                lastFile { id fileName __typename }
                __typename
              }
              ... on noticerecalculationinprocess {
                id
                complain {
                  id
                  ts
                  status
                  sub_status
                  isCustomerSatisfied
                  isMainSumPaid
                  __typename
                }
                partPaymentAmountMissing
                __typename
              }
              ... on noticerejectedorder { id __typename }
              ... on noticestartwork { id startWorkDate __typename }
              ... on noticerequesthalfperiod { id deadline __typename }
              ... on noticerequestdeadline { id requestNewDeadline newDeadlineReason __typename }
              ... on noticenofinishfile { id __typename }
              ... on noticeattachfinalfile { id lastFile { id fileName __typename } __typename }
              ... on noticefinishfile { id lastFile { id fileName __typename } __typename }
              ... on noticenofile { id __typename }
              ... on noticemakecorrect { id correctionNote correctionDeadLine __typename }
              ... on noticerejectcorrect { id bid warrantyEndDate __typename }
              ... on noticeselectperformer { id choosePerformerDate customerNickname __typename }
              ... on noticeearlyacceptwork {
                id
                acceptOrderDate
                isShortOrder
                unFrozenDate
                grade {
                  id
                  canBeAnswered
                  hidden
                  isAdmin
                  comment
                  carma
                  answer
                  protestText
                  protestDate
                  __typename
                }
                __typename
              }
              ... on noticeexpirecorrect { id __typename }
              ... on noticerecalculation {
                id
                recalculateDate
                complain {
                  performSum
                  performReason
                  isMainSumPaid
                  author_refund_tax_info { amountWithoutOurTax __typename }
                  __typename
                }
                __typename
              }
              ... on noticewarrantyend {
                id
                warrantyEndDate
                warrantyPeriod
                grade {
                  id
                  canBeAnswered
                  hidden
                  isAdmin
                  comment
                  carma
                  answer
                  protestText
                  protestDate
                  __typename
                }
                __typename
              }
              ... on noticeexpectpartpaypaidfull {
                id
                deadline
                startWorkDate
                lastFile { id fileName __typename }
                __typename
              }
              ... on noticeexpectpartpayextenddeadline {
                id
                deadline
                lastFile { id fileName __typename }
                __typename
              }
              ... on defaultnoticetype { id __typename }
            }
            __typename
          }
          fragment OrderDataDialogRefresh on dialog {
            id
            canComment
            canUploadFile
            __typename
          }`
        }),
        anonymous: false,
        onload: function(response) {
          try {
            const text = response.responseText || "";
            const data = JSON.parse(text);
            if (data?.data?.order) {
              console.log("✅ getOrder:", data.data.order);
              resolve(data.data);
            } else {
              console.warn("⚠️ Ответ без данных:", text);
              resolve(null);
            }
          } catch (err) {
            reject("Ошибка обработки getOrder: " + err);
          }
        },
        onerror: function(err) {
          reject("Ошибка GraphQL getOrder: " + JSON.stringify(err));
        }
      });
    });
  }

async function orderMetaS(orderId){
  const orderMetaPromise = new Promise((resolve, reject) => {
  GM_xmlhttpRequest({
    method: "POST",
    url: "https://avtor24.ru/graphqlapi",
    headers: {
      "Accept": "*/*",
      "Content-Type": "application/json",
      "User-Agent": navigator.userAgent,
      "X-Requested-With": "XMLHttpRequest",
      "Referer": `https://avtor24.ru/order/${orderId}`
    },
    data: JSON.stringify({
      operationName: "orderMeta",
      variables: { id: String(orderId) },
      query: `
        query orderMeta($id: ID!) {
          order(id: $id) {
            ...OrderMeta
            __typename
          }
        }

        fragment OrderMeta on order {
          id
          title
          type
          typeId
          extendedStage
          category
          categoryId
          deadline
          isPremium
          agencyId
          agentInfo
          isOutdated
          isRejectedByPerformer
          premiumPrice
          dateWarrantyStart
          dateWarrantyEnd
          dateCorrectionStart
          deadlineCorrection
          withPaidAntiPlagiarism
          withAntiplagiarism
          stage
          isSpam
          isExpressOrder
          warrantyPeriod
          deadlineV2 {
            value
            editable
            range { start end __typename }
            __typename
          }
          offer {
            id
            bid
            user {
              id
              avatar(size: size50x50)
              online
              __typename
            }
            __typename
          }
          pagesFrom
          pagesTo
          description
          creation
          font
          interval
          unique
          uniqueOption
          isLongWarranty
          uniqueService { name __typename }
          files {
            id
            fileName
            filePath
            fileType
            fileSizeInMb
            canDeleteFile
            creation
            fileHash
            isFinal
            user_id
            __typename
          }
          budget
          uniqueType
          customerFiles { id fileName filePath __typename }
          customPropertiesSimpleElements {
            description name value __typename
          }
          customProperties {
            value_id value_name value_description name __typename
          }
          isCancellable
          substage
          isPrivate
          isNewTax
          __typename
        }
      `
    }),
    onload(response) {
      try {
        const metaData = JSON.parse(response.responseText);
        resolve(metaData?.data || null);
      } catch (e) {
        console.error("Ошибка парсинга JSON (orderMeta):", e);
        reject(new Error("Неверный формат ответа при orderMeta"));
      }
    },
    onerror(error) {
      console.error("Ошибка запроса orderMeta:", error);
      reject(error);
    }
  });
});

  const [orderMeta] = await Promise.all([
    orderMetaPromise
  ]);

  return {
    orderMeta
  };
}

async function getOrderS(orderId) {
  // 1. Внутренняя функция — получить offerId и данные orderComposedStage
  async function getOfferData(orderId) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "POST",
        url: "https://avtor24.ru/graphqlapi",
        headers: {
          "Accept": "*/*",
          "Content-Type": "application/json",
          "User-Agent": navigator.userAgent,
          "X-Requested-With": "XMLHttpRequest",
          "Referer": `https://avtor24.ru/order/${orderId}`
        },
        data: JSON.stringify({
          operationName: "orderComposedStage",
          variables: { id: String(orderId) },
          query: `
            query orderComposedStage($id: ID!) {
              order(id: $id) {
                id
                title
                extendedStage
                isSpam
                offers: offersLight { id __typename }
                hiddenOffers { id __typename }
                offer { id __typename }
                reworks { id __typename }
                amount { isMainSumPaid __typename }
                compositeGradeFinal
                compositeGradeAllow
                __typename
              }
            }
          `
        }),
        onload: function (response) {
          try {
            const data = JSON.parse(response.responseText);
            const orderData = data?.data?.order;
            const offerId = orderData?.offer?.id || null;
            if (!offerId) reject("offerId не найден");
            else resolve({ offerId, orderData });
          } catch (e) {
            console.error("Ошибка парсинга JSON:", e);
            reject(new Error("Неверный формат ответа при получении offerId"));
          }
        },
        onerror: function (error) {
          console.error("Ошибка запроса offerId:", error);
          reject(error);
        }
      });
    });
  }

  // 2. Основная часть — получаем offerId
  const { offerId, orderData } = await getOfferData(orderId);
  console.log("Получен offerId:", offerId);

  // 3. Получаем messages
  const messagesPromise = new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: "POST",
      url: "https://avtor24.ru/graphqlapi",
      headers: {
        "Accept": "*/*",
        "Content-Type": "application/json",
        "User-Agent": navigator.userAgent,
        "X-Requested-With": "XMLHttpRequest",
        "Referer": `https://avtor24.ru/order/${orderId}`
      },
      data: JSON.stringify({
        operationName: "messages",
        variables: { offerId: String(offerId), orderId: String(orderId) },
        query: `
          query messages($offerId: ID!, $orderId: ID!) {
            offer(id: $offerId) {
              id
              isBlockedChat
              daysToChatClosing
              comments {
                ...Comment
                __typename
              }
              __typename
            }
            order(id: $orderId) {
              id
              actions
              compositeGradeFinal
              compositeGradeAllow
              __typename
            }
          }

          fragment Comment on OfferComments {
            ... on offerevents { id type creation text __typename }
            ... on messages { ...Message __typename }
            ... on correctioncomment {
              id user_id text creation isAdminComment isRead watched
              files { id fileName fileHash fileType filePath fileSizeInMb isFinal __typename }
              __typename
            }
            ... on recommendationcomment {
              id user_id text creation isAdminComment isRead watched
              promoUrl isMobile performerNickName __typename
            }
            ... on pricerequest { ...PriceRequest __typename }
            ... on assistant { id text creation isRead showMobileButton __typename }
            __typename
          }

          fragment Message on messages {
            id user_id text creation isAdminComment isAutoHidden isRead watched
            senderAvatar(size: size50x50)
            files { id fileName fileHash fileType filePath fileSizeInMb isFinal __typename }
            __typename
          }

          fragment PriceRequest on pricerequest {
            id user_id text creation isAdminComment isRead watched isHidden __typename
          }
        `
      }),
      onload: function (response) {
        try {
          const messagesData = JSON.parse(response.responseText);
          resolve(messagesData?.data || null);
        } catch (e) {
          console.error("Ошибка парсинга JSON (messages):", e);
          reject(new Error("Неверный формат ответа при messages"));
        }
      },
      onerror: function (error) {
        console.error("Ошибка запроса messages:", error);
        reject(error);
      }
    });
  });

  const orderMetaPromise = new Promise((resolve, reject) => {
  GM_xmlhttpRequest({
    method: "POST",
    url: "https://avtor24.ru/graphqlapi",
    headers: {
      "Accept": "*/*",
      "Content-Type": "application/json",
      "User-Agent": navigator.userAgent,
      "X-Requested-With": "XMLHttpRequest",
      "Referer": `https://avtor24.ru/order/${orderId}`
    },
    data: JSON.stringify({
      operationName: "orderMeta",
      variables: { id: String(orderId) },
      query: `
        query orderMeta($id: ID!) {
          order(id: $id) {
            ...OrderMeta
            __typename
          }
        }

        fragment OrderMeta on order {
          id
          title
          type
          typeId
          extendedStage
          category
          categoryId
          deadline
          isPremium
          agencyId
          agentInfo
          isOutdated
          isRejectedByPerformer
          premiumPrice
          dateWarrantyStart
          dateWarrantyEnd
          dateCorrectionStart
          deadlineCorrection
          withPaidAntiPlagiarism
          withAntiplagiarism
          stage
          isSpam
          isExpressOrder
          warrantyPeriod
          deadlineV2 {
            value
            editable
            range { start end __typename }
            __typename
          }
          offer {
            id
            bid
            user {
              id
              avatar(size: size50x50)
              online
              __typename
            }
            __typename
          }
          pagesFrom
          pagesTo
          description
          creation
          font
          interval
          unique
          uniqueOption
          isLongWarranty
          uniqueService { name __typename }
          files {
            id
            fileName
            filePath
            fileType
            fileSizeInMb
            canDeleteFile
            creation
            fileHash
            isFinal
            user_id
            __typename
          }
          budget
          uniqueType
          customerFiles { id fileName filePath __typename }
          customPropertiesSimpleElements {
            description name value __typename
          }
          customProperties {
            value_id value_name value_description name __typename
          }
          isCancellable
          substage
          isPrivate
          isNewTax
          __typename
        }
      `
    }),
    onload(response) {
      try {
        const metaData = JSON.parse(response.responseText);
        resolve(metaData?.data || null);
      } catch (e) {
        console.error("Ошибка парсинга JSON (orderMeta):", e);
        reject(new Error("Неверный формат ответа при orderMeta"));
      }
    },
    onerror(error) {
      console.error("Ошибка запроса orderMeta:", error);
      reject(error);
    }
  });
});


  // 4. Получаем info (с тем же offerId)
  const infoPromise = new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: "POST",
      url: "https://avtor24.ru/graphqlapi",
      headers: {
        "Accept": "*/*",
        "Content-Type": "application/json",
        "User-Agent": navigator.userAgent,
        "X-Requested-With": "XMLHttpRequest",
        "Referer": `https://avtor24.ru/order/${orderId}`
      },
      data: JSON.stringify({
        operationName: "info",
        variables: {
          orderId: String(orderId),
          offerId: String(offerId),
          withPayment: false
        },
        query: `
          query info($orderId: ID!, $offerId: ID!, $withPayment: Boolean!) {
            payment @include(if: $withPayment) {
              invoice(offerId: $offerId, isPartPay: true) {
                total
                details {
                  __typename
                  ... on platformtax { value __typename }
                  ... on totalsum { value __typename }
                  ... on partpaycommission { value __typename }
                }
                secondPartPayInfo { deadline paid __typename }
                __typename
              }
              __typename
            }
            order(id: $orderId) {
              id
              isFirstPayedOrder
              offer {
                id
                bid
                ratingInfo { grade __typename }
                user {
                  id
                  nickName
                  avatar(size: size176x176)
                  online
                  onlineTimestamp
                  university
                  isUserVerify
                  isInBlacklist
                  __typename
                }
                __typename
              }
              amount {
                paidPercent
                paidSum
                value
                isMainSumPaid
                detailed {
                  __typename
                  ... on orderprice { value __typename }
                  ... on reworkprice { value title __typename }
                }
                __typename
              }
              __typename
            }
          }
        `
      }),
      onload: function (response) {
        try {
          const infoData = JSON.parse(response.responseText);
          resolve(infoData?.data || null);
        } catch (e) {
          console.error("Ошибка парсинга JSON (info):", e);
          reject(new Error("Неверный формат ответа при info"));
        }
      },
      onerror: function (error) {
        console.error("Ошибка запроса info:", error);
        reject(error);
      }
    });
  });

  // 5. Собираем всё вместе
  const [messages, info, orderMeta] = await Promise.all([
    messagesPromise,
    infoPromise,
    orderMetaPromise
  ]);

  return {
    orderId,
    offerId,
    orderComposedStage: orderData,
    messages,
    info,
    orderMeta
  };
}


async function addCommentS(orderId, offerId, text) {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: "POST",
      url: "https://avtor24.ru/graphqlapi",
      headers: {
        "Accept": "*/*",
        "Accept-Language": "ru,en;q=0.9,en-GB;q=0.8,en-US;q=0.7",
        "Content-Type": "application/json",
        "User-Agent": navigator.userAgent,
        "X-Requested-With": "XMLHttpRequest"
      },
      referrer: `https://avtor24.ru/order/${orderId}`,
      data: JSON.stringify({
        operationName: "sendMessage",
        variables: {
          offerId: Number(offerId),
          text: text,
          requestPrice: false
        },
        query: `
          mutation sendMessage($offerId: Int!, $text: String!, $requestPrice: Boolean) {
            addComment(offerId: $offerId, text: $text, isPriceRequestComment: $requestPrice) {
              ...Message
              __typename
            }
          }

          fragment Message on messages {
            id
            user_id
            text
            creation
            isAdminComment
            isAutoHidden
            isRead
            watched
            senderAvatar(size: size50x50)
            files {
              id
              fileName
              fileHash
              fileType
              filePath
              fileSizeInMb
              isFinal
              __typename
            }
            __typename
          }
        `
      }),
      onload: function (response) {
        try {
          const data = JSON.parse(response.responseText);
          console.log("✅ Comment sent:", data);
          resolve(data);
        } catch (e) {
          console.error("❌ JSON parse error:", e, response.responseText);
          reject(e);
        }
      },
      onerror: function (error) {
        console.error("❌ Request error:", error);
        reject(error);
      }
    });
  });
}



  // === GraphQL-мутATION: addComment ===
  async function addComment(orderId, text) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "POST",
        url: "https://a24.biz/graphqlapi",
        headers: {
          "Accept": "*/*",
          "Content-Type": "application/json",
          "User-Agent": navigator.userAgent,
          "X-Requested-With": "XMLHttpRequest",
          "Referer": `https://a24.biz/order/getoneorder/${orderId}`
        },
        data: JSON.stringify([
          {
            operationName: "addComment",
            variables: { orderId, text },
            query: `mutation addComment($orderId: ID!, $text: String!) {
              addComment(orderId: $orderId, text: $text) {
                __typename
                ...messageFragment
              }
            }
            fragment messageFragment on message {
              id
              user_id
              text
              creation
              isAdminComment
              isAutoHidden
              isRead
              watched
              files {
                id
                name
                hash
                type
                path
                sizeInMb
                isFinal
                __typename
              }
              __typename
            }`
          }
        ]),
        anonymous: false,
        onload: function (response) {
          try {
            const text = response.responseText || "";
            const data = JSON.parse(text);

            if (Array.isArray(data) && data[0]?.data?.addComment) {
              console.log("✅ Комментарий успешно добавлен:", data[0].data.addComment);
              resolve(data[0].data.addComment);
            } else {
              console.warn("⚠️ Ответ без данных:", text);
              resolve(null);
            }
          } catch (err) {
            reject("Ошибка обработки addComment: " + err);
          }
        },
        onerror: function (err) {
          reject("Ошибка GraphQL addComment: " + JSON.stringify(err));
        }
      });
    });
  }

async function getMessagesS(offerId, orderId) {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: "POST",
      url: "https://avtor24.ru/graphqlapi",
      headers: {
        "Accept": "*/*",
        "Content-Type": "application/json",
        "User-Agent": navigator.userAgent,
        "X-Requested-With": "XMLHttpRequest",
        "Referer": `https://avtor24.ru/order/${orderId}`
      },
      data: JSON.stringify({
        operationName: "messages",
        variables: {
          offerId: String(offerId),
          orderId: String(orderId)
        },
        query: `
          query messages($offerId: ID!, $orderId: ID!) {
            offer(id: $offerId) {
              id
              isBlockedChat
              daysToChatClosing
              comments {
                ...Comment
                __typename
              }
              __typename
            }
            order(id: $orderId) {
              id
              actions
              compositeGradeFinal
              compositeGradeAllow
              __typename
            }
          }

          fragment Comment on OfferComments {
            ... on offerevents { id type creation text __typename }
            ... on messages { ...Message __typename }
            ... on correctioncomment {
              id user_id text creation isAdminComment isRead watched
              files { id fileName fileHash fileType filePath fileSizeInMb isFinal __typename }
              __typename
            }
            ... on recommendationcomment {
              id user_id text creation isAdminComment isRead watched
              promoUrl isMobile performerNickName __typename
            }
            ... on pricerequest { ...PriceRequest __typename }
            ... on assistant { id text creation isRead showMobileButton __typename }
            __typename
          }

          fragment Message on messages {
            id user_id text creation isAdminComment isAutoHidden isRead watched
            senderAvatar(size: size50x50)
            files {
              id fileName fileHash fileType filePath fileSizeInMb isFinal __typename
            }
            __typename
          }

          fragment PriceRequest on pricerequest {
            id user_id text creation isAdminComment isRead watched isHidden __typename
          }
        `
      }),

      onload: function (response) {
        try {
          const parsed = JSON.parse(response.responseText);

          if (!parsed?.data) {
            reject(new Error("Ответ не содержит data"));
            return;
          }

          resolve(parsed.data);
        } catch (e) {
          console.error("Ошибка парсинга JSON (messages):", e);
          reject(new Error("Неверный формат ответа messages"));
        }
      },

      onerror: function (error) {
        console.error("Ошибка запроса messages:", error);
        reject(error);
      }
    });
  });
}

async function OfferRead(offerId) {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: "POST",
      url: "https://avtor24.ru/graphqlapi",
      headers: {
        "Accept": "*/*",
        "Content-Type": "application/json",
        "User-Agent": navigator.userAgent,
        "X-Requested-With": "XMLHttpRequest",
        "Referer": `https://avtor24.ru/order/${offerId}`
      },
      data: JSON.stringify({
        operationName: "readOffer",
        variables: { id: String(offerId) },
        query: `
          mutation readOffer($id: ID!) {
            readOffer(offerId: $id)
          }
        `
      }),

      onload: (response) => {
        try {
          const parsed = JSON.parse(response.responseText);

          if (!parsed) {
            reject(new Error("Пустой ответ от readOffer"));
            return;
          }
          console.log(parsed);
          resolve(parsed);
        } catch (err) {
          console.error("Ошибка парсинга JSON в OfferRead:", err);
          reject(err);
        }
      },

      onerror: (err) => {
        console.error("Ошибка запроса OfferRead:", err);
        reject(err);
      }
    });
  });
}


async function fetchOrdersAndNotifications(accountName) {
    // ------------------ 1. FETCH ORDERS ------------------
    async function fetchOrdersGM() {
      return new Promise((resolve, reject) => {
        let allOrders = [];
        let page = 1;
        let stop = false;
            function fetchPage() {
              GM_xmlhttpRequest({
                method: "POST",
                url: "https://a24.biz/ajax/getSpecificAuthorOrders",
                headers: {
                  "Accept": "application/json, text/javascript, */*; q=0.01",
                  "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                  "User-Agent": navigator.userAgent,
                  "Referer": "https://a24.biz/home/myorders",
                  "X-Requested-With": "XMLHttpRequest"
                },
                data: `page=${page}&active_page=-1&query=`,
                onload: function (response) {
                  if (response.status !== 200) {
                    reject(response);
                    return;
                  }

                  let data;
                  try {
                    data = JSON.parse(response.responseText);
                  } catch (e) {
                    console.error("Ошибка парсинга JSON:", e);
                    reject(e);
                    return;
                  }

                  const { commentCount, orders } = data;
                  const commentArray = Object.values(commentCount || {});

                  // Проверка условия остановки
                  if (commentArray.some(c => c.newCount === 0)) {
                    stop = true;
                  }

                  // Фильтруем комментарии с новыми сообщениями
                  const withNewComments = commentArray.filter(c => c.newCount > 0);

                  // Объединяем данные с заказами
                  const simplifiedData = withNewComments
                    .map((c, index) => {
                      const order = orders[index];
                      return order && order.status !== "В аукционе"
                        ? {
                            order_id: c.order_id,
                            message: `Новое сообщение +${c.newCount}`,
                          }
                        : null;
                    })
                    .filter(Boolean); // Убираем null-значения (те, что "В аукционе")

                  allOrders.push(...simplifiedData);

                  if (!stop) {
                    page++;
                    fetchPage();
                  } else {
                    resolve(allOrders);
                  }
                },
                onerror: function (err) {
                  console.error("Ошибка запроса:", err);
                  reject(err);
                }
              });
            }
        fetchPage(allOrders);
      });
      console.log()
    }
    // ------------------ 2. FETCH NOTIFICATIONS ------------------
    async function fetchNotifications() {
      const phrasesToRemove = [
        "Заказчик принял заказ",
        "Заказчик оставил положительный отзыв на заказ",
        "Гарантийный срок по заказу",
        "Заказчик отредактировал заказ",
        "Заказчик оставил негативный отзыв на заказ",
        "Администрация отклонила жалобу к заказу",
        "Заказчик предлагает вам обратить внимание на созданный им заказ",
        "Заказчик подтвердил начало гарантийного срока по заказу"
      ];
      function fetchPage(url) {
        return new Promise((resolve, reject) => {
          GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function(response) {
              if (response.status !== 200) {
                reject(`Failed to fetch ${url}: ${response.status}`);
                return;
              }
              const parser = new DOMParser();
              const doc = parser.parseFromString(response.responseText, 'text/html');
              const newItems = doc.querySelectorAll('.notice-history-item-new');
              const orders = [];
              newItems.forEach(item => {
                const titlesDiv = item.querySelector('.notice-titles');
                if (!titlesDiv) return;
                const textNode = titlesDiv.childNodes[0];
                let prefixText = '';
                if (textNode && textNode.nodeType === Node.TEXT_NODE) {
                  prefixText = textNode.textContent.trim();
                }
                if (phrasesToRemove.includes(prefixText)) return;
                const link = titlesDiv.querySelector('a');
                if (!link) return;
                const href = link.getAttribute('href');
                const orderIdMatch = href.match(/\/order\/getoneorder\/(\d{8})/);
                const orderId = orderIdMatch ? orderIdMatch[1] : null;
                if (orderId) {
                  orders.push({
                    order_id: orderId,
                    message: prefixText
                  });
                }
              });
              resolve(orders);
            },
            onerror: function(error) {
              reject(error);
            }
          });
        });
      }
      const pages = [1, 2];
      let allNotifications = [];
      for (const page of pages) {
        try {
          const orders = await fetchPage(`https://a24.biz/notifications/${page}`);
          allNotifications = allNotifications.concat(orders);
        } catch (e) {
          console.error(e);
        }
      }
      return allNotifications;
    }
    // ------------------ 3. ВЫПОЛНЕНИЕ ОБОИХ ------------------
    const [orders, notifications] = await Promise.all([
      fetchOrdersGM().catch(() => []),
      fetchNotifications().catch(() => [])
    ]);
    // ------------------ 4. ОБЪЕДИНЕНИЕ С ПРИОРИТЕТОМ ------------------
    const combinedMap = new Map();
    // Сначала заказы (низкий приоритет)
    for (const o of orders) {
      combinedMap.set(o.order_id, o);
    }
    // Потом уведомления (перезаписывают)
    for (const n of notifications) {
      combinedMap.set(n.order_id, n);
    }
    // Финальный массив
    const finalArray = Array.from(combinedMap.values());
    // Вставляем объект с именем аккаунта в начало
    finalArray.unshift({ account: accountName });
    // ------------------ 5. СОХРАНЕНИЕ ------------------
    if (finalArray.length > 1) {
      const count = finalArray.length - 1; // количество заказов
      const now = new Date();

      // Формат: День.МесяцМесяц.ГодГод ЧасЧас:МинутыМинуты
      const formattedDate = `${String(now.getDate()).padStart(2, '0')}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getFullYear()).slice(-2)} ${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}`;

      const filename = `Выгрузка с ${accountName} от ${formattedDate} (${count} заказ).json`;

      const jsonStr = JSON.stringify(finalArray, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      console.log(`✅ Сохранено ${count} записей (${accountName}) в ${filename}`);
    } else {
      console.log("⚠️ Нет данных для сохранения.");
    }
    return finalArray
  }

  const typeMap = {
    'bestoffer': 'Выбрали лучшее предложение',
    'newfinalfile': 'Новый финальный файл',
    'newfiveoffers': '5 новых объявлений',
    'newoffer': 'Новая ставка',
    'newtemporaryfile': 'Новый промежуточный файл',
    'newmessagefromactivechat': 'Новое сообщение',
    'closingcorrect': 'Если вам попался этот заказ отправьте мне что в нём не так потому что я не понимаю что это за тип',
    'rateperformerwarranty': 'Новый файл',
    'rateperformerfinish': 'Завершился заказ/Оценить автора',
    'rejectcorrect': 'Отклонение корректировки',
    'rejecthalfperiod': 'Автор потерял этот заказ на 50%',
    'requestlatedeadline': 'Просит продлить срок',
    'setanswergrade': 'Поставить оценку ответа? Странный тип если встретите напишите мне',
    'adminrecalculatecomplain': 'Совершён перерасчёт',
    'admincancelcomplain': 'Отклонён перерасчёт',
  };

  // ❌ Типы, которые нужно полностью игнорировать
  const excludeTypes = new Set([
    'adminrecalculatecomplain',
    'admincancelcomplain',
    'newoffer',
    'bestoffer',
    'newfiveoffers',
  ]);

  function getReadNotificationIds() {
    return new Set(); // пока отключаем фильтрацию
  }

  async function fetchOrdersAndNotificationsS(account) {
    const query = `
      query getNotifications($limit: Int = -1, $offset: Int = 0) {
        notifications(offset: $offset, limit: $limit) {
          ... on bestoffer { id isUnread created offerId orderId name avatar(size: size176x176) bid __typename }
          ... on newfinalfile { id isUnread created orderId avatar(size: size176x176) title name __typename }
          ... on newfiveoffers { id isUnread created orderId title __typename }
          ... on newmessagefromactivechat { id isUnread created offerId orderId name avatar(size: size176x176) title message __typename }
          ... on newoffer { id isUnread created offerId orderId name avatar(size: size176x176) bid message title __typename }
          ... on newtemporaryfile { id isUnread created orderId avatar(size: size176x176) title name offerId __typename }
          ... on closingcorrect { id isUnread created offerId orderId title name avatar(size: size176x176) __typename }
          ... on rateperformerwarranty { id isUnread created offerId orderId title __typename }
          ... on rateperformerfinish { id isUnread created offerId orderId title __typename }
          ... on rejectcorrect { id isUnread created offerId orderId title name avatar(size: size176x176) __typename }
          ... on rejecthalfperiod { id isUnread created offerId orderId title name avatar(size: size176x176) __typename }
          ... on requestlatedeadline { id isUnread created offerId orderId title name avatar(size: size176x176) __typename }
          ... on setanswergrade { id isUnread created offerId orderId title name avatar(size: size176x176) message __typename }
          ... on adminrecalculatecomplain { id isUnread created orderId title __typename }
          ... on admincancelcomplain { id isUnread created orderId title __typename }
          __typename
        }
      }
    `;

    console.log(`[fetchNotifications] Запрашиваем уведомления для аккаунта: ${account}`);

    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "POST",
        url: "https://avtor24.ru/graphqlapi",
        headers: {
            "accept": "*/*",
            "content-type": "application/json",
            "user-agent": navigator.userAgent,
            "x-requested-with": "XMLHttpRequest"
        },
        data: JSON.stringify({
          operationName: "getNotifications",
          query
        }),
        withCredentials: true,
        onload: function(response) {
          try {
            const data = JSON.parse(response.responseText);
            if (!data.data || !data.data.notifications) {
              console.warn("Нет данных в ответе GraphQL:", data);
              resolve([]);
              return;
            }

            const seenOrderIds = new Set();

            const notifications = data.data.notifications
              .filter(n => {
                if (excludeTypes.has(n.__typename)) return false;
                if (!n.orderId || seenOrderIds.has(n.orderId)) return false;
                seenOrderIds.add(n.orderId);
                return true;
              })
              .map(n => {
                const type = n.__typename;
                let message = typeMap[type] || "Неизвестный тип";

                if (type === "rejecthalfperiod" && n.avatar && n.name) {
                  const match = n.avatar.match(/\/(\d+)\.jpg/);
                  const authorId = match ? match[1] : "неизвестный";
                  message = `Автор (${n.name} [${authorId}]) потерял этот заказ на 50%`;
                }

                return {
                  order_id: n.orderId,
                  message
                };
              });

            // Финальный JSON с аккаунтом
            const result = [
              { account },
              ...notifications
            ];

            if (notifications.length > 0) {
            const count = notifications.length; // количество уведомлений
            const now = new Date();

            // Формат: День.МесяцМесяц.ГодГод ЧасЧас:МинутыМинуты
            const formattedDate = `${String(now.getDate()).padStart(2, '0')}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getFullYear()).slice(-2)} ${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}`;

            const filename = `Выгрузка с ${account} от ${formattedDate} (${count} заказ).json`;

            const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);

            console.log(`✅ Сохранено ${count} уведомлений (${account}) в файл: ${filename}`);
            clearNotifications();
          } else {
            console.log("⚠️ Нет новых уведомлений для сохранения.");
          }

          resolve(result);
          } catch (err) {
            console.error("Ошибка при обработке уведомлений:", err);
            reject(err);
          }
        },
        onerror: function(err) {
          console.error("Ошибка запроса:", err);
          reject(err);
        }
      });
    });
  }

async function getPlainMessages(orderId) {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: "POST",
            url: "https://a24.biz/graphqlapi",
            headers: {
                "accept": "*/*",
                "content-type": "application/json",
                "user-agent": navigator.userAgent,
                "referer": `https://a24.biz/order/getoneorder/${orderId}`,
                "x-requested-with": "XMLHttpRequest"
            },
            anonymous: false,
            data: JSON.stringify([{
                operationName: "getPlainMessages",
                variables: { orderId: orderId },
                query: `query getPlainMessages($orderId: ID!) {
                    dialog(orderId: $orderId) {
                        id
                        messages {
                            ...messageFragment
                            ...correctionFragment
                            ...recommendationFragment
                            ...pricerequestFragment
                            ...systemFragment
                            ...assistantFragment
                            __typename
                        }
                        __typename
                    }
                }
                fragment messageFragment on message {
                    id
                    user_id
                    text
                    creation
                    isAdminComment
                    isAutoHidden
                    isRead
                    watched
                    files { id name hash type path sizeInMb isFinal __typename }
                    __typename
                }
                fragment correctionFragment on correction {
                    id
                    user_id
                    text
                    creation
                    isAdminComment
                    isRead
                    watched
                    files { id name hash type path sizeInMb isFinal __typename }
                    __typename
                }
                fragment recommendationFragment on recommendation {
                    id
                    user_id
                    text
                    creation
                    isAdminComment
                    isRead
                    watched
                    promoUrl
                    isMobile
                    __typename
                }
                fragment pricerequestFragment on pricerequest {
                    id
                    user_id
                    text
                    creation
                    isAdminComment
                    isRead
                    watched
                    __typename
                }
                fragment systemFragment on system {
                    id
                    type
                    text
                    creation
                    __typename
                }
                fragment assistantFragment on assistant {
                    id
                    text
                    creation
                    isRead
                    __typename
                }`
            }]),
            onload: function(response) {
                try {
                    const text = response.responseText || "";
                    const data = JSON.parse(text);
                    if (data?.data?.dialog) {
                        resolve(data.data.dialog.messages);
                    } else {
                        console.warn("⚠️ Ответ без данных:", text);
                        resolve([]);
                    }
                } catch (err) {
                    reject("Ошибка обработки getPlainMessages: " + err);
                }
            },
            onerror: function(err) {
                reject("Ошибка GraphQL getPlainMessages: " + JSON.stringify(err));
            }
        });
    });
}

async function canIComment(orderId) {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: "POST",
            url: "https://a24.biz/graphqlapi?_dialog",
            headers: {
                "accept": "*/*",
                "content-type": "application/json",
                "user-agent": navigator.userAgent,
                "referer": `https://a24.biz/home/myorders?type=-2`,
                "x-requested-with": "XMLHttpRequest"
            },
            anonymous: false,
            data: JSON.stringify({
                operationName: "getDialog",
                variables: { orderId: orderId },
                query: `query getDialog($orderId: ID!) {
                    dialog(orderId: $orderId) {
                        canComment
                        canUploadFile
                        __typename
                    }
                }`
            }),
            onload: function(response) {
                try {
                    const text = response.responseText || "";
                    const data = JSON.parse(text);
                    if (data?.data?.dialog) {
                        resolve(data.data.dialog);
                    } else {
                        console.warn("⚠️ Ответ без данных:", text);
                        resolve(null);
                    }
                } catch (err) {
                    reject("Ошибка обработки getDialog: " + err);
                }
            },
            onerror: function(err) {
                reject("Ошибка GraphQL getDialog: " + JSON.stringify(err));
            }
        });
    });
}

async function fetchProfile() {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: "POST",
      url: "https://a24.biz/graphqlapi",
      headers: {
        "Content-Type": "application/json",
        "Accept": "*/*",
        "Referer": "https://a24.biz/home/myorders"
      },
      data: JSON.stringify({
        operationName: "getProfile",
        variables: {},
        query: `query getProfile {
          profile {
            id
          }
        }`
      }),
      credentials: "include", // Попытка отправить куки (может не работать)
      onload: function(response) {
        try {
          const data = JSON.parse(response.responseText);
          resolve(data);
        } catch (e) {
          console.error("Ошибка парсинга JSON:", e);
          reject(new Error("Неверный формат ответа"));
        }
      },
      onerror: function(error) {
        console.error("Ошибка запроса:", error);
        reject(error);
      }
    });
  });
}

async function fetchProfileS() {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: "POST",
      url: "https://avtor24.ru/graphqlapi",
      headers: {
        "Content-Type": "application/json",
        "Accept": "*/*",
        "Referer": "https://avtor24.ru/home/myorders"
      },
      data: JSON.stringify({
        operationName: "getProfile",
        variables: {},
        query: `query getProfile {
          profile {
            id
          }
        }`
      }),
      credentials: "include", // Попытка отправить куки (может не работать)
      onload: function(response) {
        try {
          const data = JSON.parse(response.responseText);
          resolve(data);
        } catch (e) {
          console.error("Ошибка парсинга JSON:", e);
          reject(new Error("Неверный формат ответа"));
        }
      },
      onerror: function(error) {
        console.error("Ошибка запроса:", error);
        reject(error);
      }
    });
  });
}

async function checkAdmin() {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: "GET",
      url: "https://avtor24.ru/admin_new",
      headers: {
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "user-agent": navigator.userAgent,
        "referer": "https://avtor24.ru/admin_new"
      },
      anonymous: false,
      onload: async function(response) {
        const finalUrl = response.finalUrl || "";
        const text = response.responseText || "";
        // Проверка наличия <h1>Доступ запрещен</h1>
        if (text.includes("<h1>Доступ запрещен</h1>")) {
          await logoutS();
          window.open(
              'https://avtor24.ru/login/',
              'Войти в админку', // Имя окна
              'width=1600,height=800,top=100,left=100,scrollbars=yes' // Параметры
          );
          resolve(false); // Не админ
        } else {
          resolve(true); // Админ
        }
      },
      onerror: function(err) {
        reject("Ошибка при запросе: " + JSON.stringify(err));
      }
    });
  });
}

async function checkAdminS() {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: "GET",
      url: "https://avtor24.ru/admin_new",
      headers: {
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "user-agent": navigator.userAgent,
        "referer": "https://avtor24.ru/admin_new"
      },
      anonymous: false,
      onload: async function(response) {
        const finalUrl = response.finalUrl || "";
        const text = response.responseText || "";
        // Проверка наличия <h1>Доступ запрещен</h1>
        if (text.includes("<h1>Доступ запрещен</h1>")) {
          resolve(false); // Не админ
        } else {
          resolve(true); // Админ
        }
      },
      onerror: function(err) {
        reject("Ошибка при запросе: " + JSON.stringify(err));
      }
    });
  });
}

async function getComplain(orderId) {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: "POST",
      url: "https://a24.biz/graphqlapi",
      headers: {
        "Accept": "*/*",
        "Accept-Language": "ru,en;q=0.9,en-GB;q=0.8,en-US;q=0.7",
        "Content-Type": "application/json",
        "Priority": "u=1, i",
        "Sec-CH-UA": "\"Microsoft Edge\";v=\"141\", \"Not?A_Brand\";v=\"8\", \"Chromium\";v=\"141\"",
        "Sec-CH-UA-Mobile": "?0",
        "Sec-CH-UA-Platform": "\"Windows\"",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
        "Referer": `https://a24.biz/order/getoneorder/${orderId}`
      },
      data: JSON.stringify([
        {
          operationName: "getRecalculation",
          variables: { orderId: String(orderId) },
          query: `query getRecalculation($orderId: ID!) {
            order(id: $orderId) {
              id
              complain {
                id
                status
                sub_status
                answer_ts
                isCustomerSatisfied
                reason_list {
                  name
                  customer_comment
                  performer_comment
                  performer_accept
                  __typename
                }
                sumwant
                file {
                  id
                  name: fileName
                  path: filePath
                  hash: fileHash
                  sizeInMb: fileSizeInMb
                  isFinal
                  readableCreationUnixtime: creation
                  type: fileType
                  __typename
                }
                counter_sumwant
                author_comment
                author_refund
                author_refund_tax_info {
                  amountWithoutOurTax
                  ourTax
                  __typename
                }
                isMainSumPaid
                __typename
              }
              __typename
            }
          }`
        }
      ]),
      onload: function (response) {
        try {
          const data = JSON.parse(response.responseText);
          resolve(data);
        } catch (e) {
          console.error("Ошибка парсинга JSON:", e);
          reject(new Error("Неверный формат ответа"));
        }
      },
      onerror: function (error) {
        console.error("Ошибка запроса:", error);
        reject(error);
      }
    });
  });
}

async function getReworkRequests(orderId) {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: "POST",
      url: "https://a24.biz/graphqlapi",
      headers: {
        "Accept": "*/*",
        "Accept-Language": "ru,en;q=0.9,en-GB;q=0.8,en-US;q=0.7",
        "Content-Type": "application/json",
        "Priority": "u=1, i",
        "Sec-CH-UA": "\"Chromium\";v=\"136\", \"Microsoft Edge\";v=\"136\", \"Not.A/Brand\";v=\"99\"",
        "Sec-CH-UA-Mobile": "?0",
        "Sec-CH-UA-Platform": "\"Windows\"",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
        "Referer": window.location.href
      },
      data: JSON.stringify([
        // === Запрос 1: getOrder ===
        {
          operationName: "getOrder",
          variables: { id: String(orderId) },
          query: `
            query getOrder($id: ID!) {
              order(id: $id) {
                amount {
                  value
                  paidSum
                  detailed {
                    __typename
                    ... on orderprice {
                      value
                    }
                    ... on reworkprice {
                      value
                      title
                      isPaid
                    }
                  }
                }
              }
            }
          `
        },

        // === Запрос 2: getOrderReworks ===
        {
          operationName: "getOrderReworks",
          variables: { orderId: String(orderId) },
          query: `
            query getOrderReworks($orderId: ID!) {
              order(id: $orderId) {
                id
                reworks {
                  ...reworkFragment
                  __typename
                }
                __typename
              }
            }

            fragment reworkFragment on rework {
              id
              title
              description
              stage
              bid
              isChangeDeadline
              deadline
              originBid
              finalBid
              withdrawAmount
              __typename
            }
          `
        },
      ]),
      onload: function (response) {
        try {
          const data = JSON.parse(response.responseText);
          // Объединяем три результата в один объект
          const [orderData, reworksData] = data.map(d => d?.data || {});

          const combined = {
            order: orderData.order || null,
            reworks: reworksData.order?.reworks || [],
          };

          resolve(combined);
        } catch (e) {
          console.error("Ошибка парсинга JSON:", e);
          reject(new Error("Неверный формат ответа"));
        }
      },
      onerror: function (error) {
        console.error("Ошибка запроса:", error);
        reject(error);
      }
    });
  });
}


async function declineCorrection(orderId) {
    return new Promise((resolve, reject) => {
        const body = `[{"operationName":"rejectCorrection","variables":{"orderId":${orderId}},"query":"mutation rejectCorrection($orderId: Int!) {\\n  rejectCorrection(orderId: $orderId)\\n}"}]`;

        GM_xmlhttpRequest({
            method: "POST",
            url: "https://a24.biz/graphqlapi",
            headers: {
                "accept": "*/*",
                "accept-language": "ru,en;q=0.9,en-GB;q=0.8,en-US;q=0.7",
                "content-type": "application/json",
                "priority": "u=1, i",
                "sec-ch-ua": "\"Microsoft Edge\";v=\"141\", \"Not?A_Brand\";v=\"8\", \"Chromium\";v=\"141\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "referer": `https://a24.biz/order/getoneorder/${orderId}`
            },
            anonymous: false,
            data: body,
            onload: function(response) {
                console.log("GraphQL Response:", response.responseText);
                try {
                    const parsed = JSON.parse(response.responseText);
                    if (parsed?.[0]?.data?.rejectCorrection !== undefined) {
                        resolve(parsed[0].data.rejectCorrection);
                    } else if (parsed?.data?.rejectCorrection !== undefined) {
                        resolve(parsed.data.rejectCorrection);
                    } else {
                        reject("Нет поля rejectCorrection в ответе: " + response.responseText);
                    }
                } catch (err) {
                    reject("Ошибка JSON.parse: " + err + " / " + response.responseText);
                }
            },
            onerror: function(err) {
                reject("Ошибка GraphQL declineCorrection: " + JSON.stringify(err));
            }
        });
    });
}




async function cancellation(accept, orderId, comment = null) {
    return new Promise((resolve, reject) => {
        let operationName, variables, query;
        if (accept) {
            operationName = "acceptCancellationRequest";
            variables = { orderId: orderId };
            query = `mutation acceptCancellationRequest($orderId: Int!) {
                acceptCancellationRequest(orderId: $orderId) {
                    id
                    isCancellable
                    __typename
                }
            }`;
        } else {
            if (!comment) {
                reject("Comment is required for rejection");
                return;
            }
            operationName = "rejectCancellationRequest";
            variables = { orderId: orderId, text: comment };
            query = `mutation rejectCancellationRequest($orderId: Int!, $text: String) {
                rejectCancellationRequest(orderId: $orderId, text: $text) {
                    id
                    isCancellable
                    __typename
                }
            }`;
        }

        GM_xmlhttpRequest({
            method: "POST",
            url: "https://a24.biz/graphqlapi",
            headers: {
                "accept": "*/*",
                "content-type": "application/json",
                "user-agent": navigator.userAgent,
                "x-requested-with": "XMLHttpRequest",
                "referer": `https://a24.biz/order/getoneorder/${orderId}`
            },
            anonymous: false,
            data: JSON.stringify([{
                operationName: operationName,
                variables: variables,
                query: query
            }]),
            onload: function(response) {
                try {
                    const text = response.responseText || "";
                    const data = JSON.parse(text);
                    if (data?.[0]?.data) {
                        const result = data[0].data[accept ? "acceptCancellationRequest" : "rejectCancellationRequest"];
                        resolve(result);
                    } else {
                        console.warn("⚠️ Ответ без данных:", text);
                        resolve(null);
                    }
                } catch (err) {
                    reject("Ошибка обработки cancellation: " + err);
                }
            },
            onerror: function(err) {
                reject("Ошибка GraphQL cancellation: " + JSON.stringify(err));
            }
        });
    });
}

async function requestRework(orderId, reworkBid, description) {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: "POST",
      url: "https://a24.biz/graphqlapi",
      headers: {
        "Accept": "*/*",
        "Accept-Language": "ru,en;q=0.9,en-GB;q=0.8,en-US;q=0.7",
        "Content-Type": "application/json",
        "Priority": "u=1, i",
        "Sec-CH-UA": "\"Chromium\";v=\"136\", \"Microsoft Edge\";v=\"136\", \"Not.A/Brand\";v=\"99\"",
        "Sec-CH-UA-Mobile": "?0",
        "Sec-CH-UA-Platform": "\"Windows\"",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
        "Referer": window.location.href
      },
      data: JSON.stringify({
        operationName: "createRework",
        variables: {
          bid: reworkBid,
          description: description,
          orderId: orderId
        },
        query: `
          mutation createRework($orderId: ID!, $description: String!, $bid: Int!, $deadline: Date) {
            createRework(
              orderId: $orderId
              description: $description
              bid: $bid
              deadline: $deadline
            ) {
              ...reworkFragment
              __typename
            }
          }

          fragment reworkFragment on rework {
            id
            title
            description
            stage
            bid
            isChangeDeadline
            deadline
            originBid
            finalBid
            withdrawAmount
            __typename
          }
        `
      }),
      onload: function (response) {
        try {
          const data = JSON.parse(response.responseText);
          resolve(data);
        } catch (e) {
          console.error("Ошибка парсинга JSON:", e);
          reject(new Error("Неверный формат ответа"));
        }
      },
      onerror: function (error) {
        console.error("Ошибка запроса:", error);
        reject(error);
      }
    });
  });
}

async function getBalance({
  type = 0,
  find_order_id = 0,
  dateFrom = "",
  dateTo = "",
  page = ""
} = {}) {
  const body = `type=${encodeURIComponent(type)}&find_order_id=${encodeURIComponent(find_order_id)}&dateFrom=${encodeURIComponent(dateFrom)}&dateTo=${encodeURIComponent(dateTo)}`;

  const url = page
    ? `https://a24.biz/home/balance/${encodeURIComponent(page)}?history`
    : "https://a24.biz/home/balance";

  const requestData = {
    method: "POST",
    url,
    headers: {
      "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "accept-language": "ru,en;q=0.9,en-GB;q=0.8,en-US;q=0.7",
      "cache-control": "max-age=0",
      "content-type": "application/x-www-form-urlencoded",
      "priority": "u=0, i",
      "sec-ch-ua": "\"Microsoft Edge\";v=\"141\", \"Not?A_Brand\";v=\"8\", \"Chromium\";v=\"141\"",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "\"Windows\"",
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
      "sec-fetch-site": "same-origin",
      "sec-fetch-user": "?1",
      "upgrade-insecure-requests": "1"
    },
    data: body,
    anonymous: false
  };

  console.log("🔹 Запрос getBalance:", requestData);

  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      ...requestData,
      onload: function(response) {
        resolve(response.responseText);
      },
      onerror: function(error) {
        reject(error);
      }
    });
  });
}


function getCurrentMonthDates() {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;

        // Получаем первый день месяца
        const firstDay = `01.${month.toString().padStart(2, '0')}.${year}`;

        // Получаем последний день месяца
        const lastDay = new Date(year, month, 0);
        const lastDayFormatted = `${lastDay.getDate().toString().padStart(2, '0')}.${month.toString().padStart(2, '0')}.${year}`;

        return {
            firstDay,
            lastDay: lastDayFormatted
        };
    }

    // Конфигурация URL для каждого аккаунта (с шаблонами для замены дат)
    const accountUrlTemplates = {
        '4211132': 'https://reselling.a24.cloud/crm/reports/report/view/40/?set_filter=Y&sort_id=4&sort_type=ASC&F_DATE_TYPE=all&F_DATE_FROM=&F_DATE_TO=&F_DATE_DAYS=&filter[0][1]=__FIRST_DAY__&filter[0][2]=__LAST_DAY__&filter[0][3][]=169&filter[0][4][]=355&filter[0][5][]=&save=Y',
        '4211265': 'https://reselling.a24.cloud/crm/reports/report/view/40/?set_filter=Y&sort_id=4&sort_type=ASC&F_DATE_TYPE=all&F_DATE_FROM=&F_DATE_TO=&F_DATE_DAYS=&filter[0][1]=__FIRST_DAY__&filter[0][2]=__LAST_DAY__&filter[0][3][]=170&filter[0][4][]=355&filter[0][5][]=&save=Y',
        '6292415': 'https://reselling.a24.cloud/crm/reports/report/view/40/?set_filter=Y&sort_id=4&sort_type=ASC&F_DATE_TYPE=all&F_DATE_FROM=&F_DATE_TO=&F_DATE_DAYS=&filter[0][1]=__FIRST_DAY__&filter[0][2]=__LAST_DAY__&filter[0][3][]=171&filter[0][4][]=355&filter[0][5][]=&save=Y'
    };

    const accountNames = {
        '4211132': 'Маша',
        '4211265': 'Стёпа',
        '6292415': 'Надя'
    };

    function formatNumber(value) {
        const num = value.replace(/\D+/g, '');
        return num.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + '₽';
    }

    function getCurrentAccountId() {
        const profileDiv = document.querySelector('.top-menu__profile');
        if (!profileDiv) {
            throw new Error('Не найден элемент .top-menu__profile');
        }
        const userId = profileDiv.getAttribute('data-userid');
        if (!userId || !accountUrlTemplates[userId]) {
            throw new Error(`Аккаунт с ID ${userId} не поддерживается.`);
        }
        return userId;
    }

    function extractLastNumericValue(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // 1. Находим конкретную таблицу отчета по ID
        const table = doc.getElementById('report-result-table');
        if (!table) {
            throw new Error('Таблица с ID "report-result-table" не найдена.');
        }

        // 2. Берем самую последнюю строку в теле таблицы (это и есть строка итогов)
        const lastRow = table.querySelector('tbody > tr:last-child');
        if (!lastRow) {
            throw new Error('Не удалось найти последнюю строку таблицы.');
        }

        // 3. Внутри последней строки ищем ячейку с нужным классом
        const targetCell = lastRow.querySelector('td.reports-numeric-column');

        if (!targetCell) {
            throw new Error('В последней строке не найдена ячейка "reports-numeric-column".');
        }

        // 4. Возвращаем текст, предварительно очистив от пробелов (если там "183 235")
        return targetCell.textContent.replace(/\s/g, '').trim();
    }

    function insertValueIntoBalancePage(value, accountId) {
        const balanceDiv = document.querySelector('.balance-how_money');
        if (!balanceDiv) {
            throw new Error('Элемент .balance-how_money не найден.');
        }
        const a24Value = document.querySelector('.balance-how_money').textContent.trim();
        balanceDiv.textContent = "A24: " + balanceDiv.textContent

        const oldContainer = document.querySelector('.crm-extracted-value');
        if (oldContainer) oldContainer.remove();

        const valueContainer = document.createElement('div');
        valueContainer.className = 'balance-how_money';
        valueContainer.textContent = `Б24: ${formatNumber(value)}`;
        valueContainer.style.cursor = 'pointer';
        valueContainer.addEventListener('click', function() {
            const textToCopy = `${accountNames[accountId]} Битрикс ${formatNumber(value)}\n${accountNames[accountId]} Автор ${a24Value}`;
            GM_setClipboard(textToCopy, 'text');
            valueContainer.style.color = 'green';
            setTimeout(function() {
                valueContainer.style.color = 'white';
            }, 1000);
        });

        balanceDiv.insertAdjacentElement('afterend', valueContainer);
    }

async function fetchBXBalance(accountId) {
    const { firstDay, lastDay } = getCurrentMonthDates();

    const reportUrl = accountUrlTemplates[accountId]
        .replace('__FIRST_DAY__', firstDay)
        .replace('__LAST_DAY__', lastDay);

    console.log(`🔹 [START] Запрос для: ${accountId}`);
    console.log(`🔗 URL: ${reportUrl}`);

    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: 'GET',
            url: reportUrl,
            timeout: 60000, // ⬆️ Увеличили до 60 секунд. Отчеты Битрикса бывают тугими.
            anonymous: false, // ❗ ВАЖНО: разрешает отправку кук (авторизации)
            headers: {
                // Притворяемся обычным браузером, чтобы сервер не блокировал "бота"
                "User-Agent": navigator.userAgent,
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
                "Cache-Control": "no-cache"
            },
            onload: function(response) {
                console.log(`✅ [RESPONSE] Статус: ${response.status}`);

                if (response.status !== 200) {
                    console.error('❌ Ошибка HTTP:', response.status);
                    // Если 401/403 - значит проблема с куками/авторизацией
                    reject(new Error(`HTTP Error: ${response.status}`));
                    return;
                }

                // Проверка на редирект (часто бывает при слетевшей сессии)
                if (response.finalUrl.includes('login') || response.responseText.includes('USER_LOGIN')) {
                    console.error('⛔ Скрипт перенаправлен на страницу входа. Нужно залогиниться в reselling.a24.cloud в этом браузере.');
                    reject(new Error('Auth Required'));
                    return;
                }

                try {
                    const value = extractLastNumericValue(response.responseText);
                    console.log(`💰 [SUCCESS] Значение: ${value}`);
                    resolve(value);
                } catch (e) {
                    console.error('💥 Ошибка парсинга:', e);
                    reject(e);
                }
            },
            onerror: function(error) {
                console.error('❌ Ошибка сети:', error);
                reject(new Error('Network Error'));
            },
            ontimeout: function() {
                console.error('⏰ Тайм-аут запроса (сервер не ответил за 60 сек)');
                reject(new Error('Request Timeout'));
            }
        });
    });
}

    async function AdminOperation(AdminData, url) {
      console.log("🔹 Запуск AdminOperation:");
      console.log("URL:", url);
      console.log("Данные:", AdminData);
      return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          method: 'POST',
          url: url,
          data: AdminData,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          onload: function(response) {
            console.log('Ответ сервера:', response.responseText);

            const isSuccess = /<div class="alert alert-success">[\s\S]*?Успешно выполнили операцию[\s\S]*?<\/div>/
              .test(response.responseText)
              ? 1
              : 0;

            if (!isSuccess) {
              console.warn("⚠️ Операция неуспешна. Открываю страницу:", url);
              window.open(url, "_blank");
            }

            resolve(isSuccess);
          },
          onerror: function(error) {
            console.error('Ошибка:', error);
            resolve(0); // Ошибку тоже считаем неуспешной операцией
          }
        });
      });
    }

async function acceptWork(orderId) {
  return new Promise((resolve, reject) => {
    const body =
      "{\"operationName\":\"acceptWork\",\"variables\":{\"orderId\":" +
      orderId +
      "},\"query\":\"mutation acceptWork($orderId: Int!) {\\n  acceptWork(orderId: $orderId) {\\n    id\\n    __typename\\n  }\\n}\\n\"}";

    GM_xmlhttpRequest({
      method: "POST",
      url: "https://avtor24.ru/graphqlapi",
      headers: {
        "accept": "*/*",
        "accept-language": "ru,en;q=0.9,en-GB;q=0.8,en-US;q=0.7",
        "content-type": "application/json",
        "priority": "u=1, i",
        "sec-ch-ua": "\"Microsoft Edge\";v=\"141\", \"Not?A_Brand\";v=\"8\", \"Chromium\";v=\"141\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "referer": `https://avtor24.ru/order/${orderId}`,
        "x-requested-with": "XMLHttpRequest"
      },
      anonymous: false,
      data: body,
      onload: function (response) {
        console.log("GraphQL Response:", response.responseText);
        try {
          const parsed = JSON.parse(response.responseText);
          resolve(parsed?.data?.acceptWork ?? null);
        } catch (e) {
          reject("Ошибка JSON.parse: " + e + " / " + response.responseText);
        }
      },
      onerror: function (error) {
        reject("Ошибка GraphQL acceptWork: " + JSON.stringify(error));
      }
    });
  });
}


async function startWarranty(orderId) {
  return new Promise((resolve, reject) => {
    const body =
      "{\"operationName\":\"changeStageToWarranty\",\"variables\":{\"orderId\":\"" +
      orderId +
      "\"},\"query\":\"mutation changeStageToWarranty($orderId: ID!) {\\n  changeStageToWarranty(orderId: $orderId)\\n}\\n\"}";

    GM_xmlhttpRequest({
      method: "POST",
      url: "https://avtor24.ru/graphqlapi",
      headers: {
        "accept": "*/*",
        "accept-language": "ru,en;q=0.9,en-GB;q=0.8,en-US;q=0.7",
        "content-type": "application/json",
        "priority": "u=1, i",
        "sec-ch-ua": "\"Microsoft Edge\";v=\"141\", \"Not?A_Brand\";v=\"8\", \"Chromium\";v=\"141\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "referer": `https://avtor24.ru/order/${orderId}`,
        "x-requested-with": "XMLHttpRequest"
      },
      anonymous: false,
      data: body,
      onload: function (response) {
        console.log("GraphQL Response:", response.responseText);
        try {
          const parsed = JSON.parse(response.responseText);
          resolve(parsed?.data?.changeStageToWarranty ?? null);
        } catch (e) {
          reject("Ошибка JSON.parse: " + e + " / " + response.responseText);
        }
      },
      onerror: function (error) {
        reject("Ошибка GraphQL startWarranty: " + JSON.stringify(error));
      }
    });
  });
}


async function backtoWork(orderId) {
  return new Promise((resolve, reject) => {
    // тело делаем строго как в fetch, без auto-JSON.stringify
    const body =
      "{\"operationName\":\"keepOrderInWork\",\"variables\":{\"orderId\":" +
      orderId +
      "},\"query\":\"mutation keepOrderInWork($orderId: Int!) {\\n  keepOrderInWork(orderId: $orderId)\\n}\\n\"}";

    GM_xmlhttpRequest({
      method: "POST",
      url: "https://avtor24.ru/graphqlapi",
      headers: {
        "accept": "*/*",
        "accept-language": "ru,en;q=0.9,en-GB;q=0.8,en-US;q=0.7",
        "content-type": "application/json",
        "priority": "u=1, i",
        "sec-ch-ua": "\"Microsoft Edge\";v=\"141\", \"Not?A_Brand\";v=\"8\", \"Chromium\";v=\"141\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "referer": `https://avtor24.ru/order/${orderId}`,
        "x-requested-with": "XMLHttpRequest"
      },
      anonymous: false,
      data: body,
      onload: function (response) {
        console.log("GraphQL Response:", response.responseText);
        try {
          const parsed = JSON.parse(response.responseText);
          resolve(parsed?.data?.keepOrderInWork ?? null);
        } catch (e) {
          reject("Ошибка JSON.parse: " + e + " / " + response.responseText);
        }
      },
      onerror: function (error) {
        reject("Ошибка GraphQL backToWork: " + JSON.stringify(error));
      }
    });
  });
}


async function startComplain(percent, authorNoob, comment, orderNumber) {
  return new Promise((resolve, reject) => {
    const body = "{\"operationName\":\"sendComplain\",\"variables\":{\"order\":" + orderNumber + ",\"authorNoob\":" + authorNoob + ",\"finishedPercent\":" + percent + ",\"phone\":\"+7-921-xxx-xx-21\",\"customReasons\":[{\"name\":\"Другое\",\"customer_comment\":\"" + comment + "\"}]},\"query\":\"mutation sendComplain($order: Int!, $authorNoob: Boolean!, $amount: Int, $finishedPercent: Int, $phone: String, $file: ID, $customReasons: [ComplainReasonInputType]) {\\n  addComplain(orderId: $order, authorNoob: $authorNoob, amount: $amount, finishedPercent: $finishedPercent, phone: $phone, file: $file, customReasons: $customReasons) {\\n    id\\n    __typename\\n  }\\n}\\n\"}";

    GM_xmlhttpRequest({
      method: "POST",
      url: "https://avtor24.ru/graphqlapi",
      headers: {
        "accept": "*/*",
        "accept-language": "ru,en;q=0.9,en-GB;q=0.8,en-US;q=0.7",
        "content-type": "application/json",
        "priority": "u=1, i",
        "sec-ch-ua": "\"Microsoft Edge\";v=\"141\", \"Not?A_Brand\";v=\"8\", \"Chromium\";v=\"141\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "referer": `https://avtor24.ru/order/${orderNumber}`
      },
      anonymous: false,
      data: body,
      onload: function (response) {
        console.log("GraphQL Response:", response.responseText);
        try {
          const data = JSON.parse(response.responseText);
          resolve(data);
        } catch (e) {
          reject("Ошибка JSON.parse: " + e + " / " + response.responseText);
        }
      },
      onerror: function (error) {
        reject("Ошибка GraphQL startComplain: " + JSON.stringify(error));
      }
    });
  });
}

async function getOffers(orderNumber) {
  return new Promise((resolve, reject) => {

    const body =
      "{\"operationName\":\"getOffers\",\"variables\":{\"orderId\":\"" +
      orderNumber +
      "\"},\"query\":\"query getOffers($orderId: ID!) {\\n  order(id: $orderId) {\\n    id\\n    categoryId\\n    offers {\\n      ...OfferFragment\\n      __typename\\n    }\\n    hiddenOffers {\\n      ...OfferFragment\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n" +
      "\\nfragment OfferFragment on offer {\\n  id\\n  isBestOffer\\n  countUnreadMessages(withAssistant: true)\\n  bid\\n  text\\n  estimatedBid\\n  creation\\n  isCustomerWroteToAuthor\\n  isPriceRequestWasSent\\n  isNewOffer\\n  isActiveDialog\\n  viewed\\n  outdated\\n  branding\\n  countMessages\\n  ratingInfo {\\n    responseTime\\n    grade\\n    countOrderFinished\\n    countReview\\n    durationPercent\\n    marks {\\n      name\\n      avg\\n      __typename\\n    }\\n    stats {\\n      negativeGrades\\n      positiveGrades\\n      countOrders\\n      name\\n      nameDative\\n      __typename\\n    }\\n    __typename\\n  }\\n  partPayConditions {\\n    ...PartialPaymentConditions\\n    __typename\\n  }\\n  BNPLConditions {\\n    isAvailable\\n    totalSum\\n    __typename\\n  }\\n  user {\\n    id\\n    nickName\\n    avatar(size: size176x176)\\n    university\\n    isUserVerify\\n    isFamiliar\\n    isFavorite\\n    online\\n    onlineTimestamp\\n    gradesCount(filters: [], subjects: [])\\n    note\\n    isInBlacklist\\n    level\\n    ...achievements\\n    __typename\\n  }\\n  lastMessage {\\n    __typename\\n    ...Comment\\n  }\\n  lastCommentFromPerformer {\\n    __typename\\n    ... on messages {\\n      ...Message\\n      __typename\\n    }\\n  }\\n  __typename\\n}\\n" +
      "\\nfragment Comment on OfferComments {\\n  ... on offerevents {\\n    id\\n    type\\n    creation\\n    text\\n    __typename\\n  }\\n  ... on messages {\\n    ...Message\\n    __typename\\n  }\\n  ... on correctioncomment {\\n    id\\n    user_id\\n    text\\n    creation\\n    isAdminComment\\n    isRead\\n    watched\\n    files {\\n      id\\n      fileName\\n      fileHash\\n      fileType\\n      filePath\\n      fileSizeInMb\\n      isFinal\\n      __typename\\n    }\\n    __typename\\n  }\\n  ... on recommendationcomment {\\n    id\\n    user_id\\n    text\\n    creation\\n    isAdminComment\\n    isRead\\n    watched\\n    promoUrl\\n    isMobile\\n    performerNickName\\n    __typename\\n  }\\n  ... on pricerequest {\\n    ...PriceRequest\\n    __typename\\n  }\\n  ... on assistant {\\n    id\\n    text\\n    creation\\n    isRead\\n    showMobileButton\\n    __typename\\n  }\\n  __typename\\n}\\n" +
      "\\nfragment Message on messages {\\n  id\\n  user_id\\n  text\\n  creation\\n  isAdminComment\\n  isAutoHidden\\n  isRead\\n  watched\\n  senderAvatar(size: size50x50)\\n  files {\\n    id\\n    fileName\\n    fileHash\\n    fileType\\n    filePath\\n    fileSizeInMb\\n    isFinal\\n    __typename\\n  }\\n  __typename\\n}\\n" +
      "\\nfragment PriceRequest on pricerequest {\\n  id\\n  user_id\\n  text\\n  creation\\n  isAdminComment\\n  isRead\\n  watched\\n  isHidden\\n  __typename\\n}\\n" +
      "\\nfragment achievements on author {\\n  achievements {\\n    __typename\\n    id\\n    description\\n    title\\n    promoId\\n    place\\n  }\\n  awardsList {\\n    __typename\\n    ... on dailyawards {\\n      text\\n      categories\\n      __typename\\n    }\\n    ... on monthlyawards {\\n      text\\n      __typename\\n    }\\n  }\\n  __typename\\n}\\n" +
      "\\nfragment PartialPaymentConditions on conditionsList {\\n  ... on availablecondition {\\n    partPayCommissionPercent\\n    partPayPercent\\n    firstTranceSum\\n    secondTranceSum\\n    canPayFirstTrance\\n    __typename\\n  }\\n  ... on exceededlimitcondition {\\n    countLimitPartPay\\n    partPayPercent\\n    __typename\\n  }\\n  ... on exceededlimitwithdebtcondition {\\n    missingSum\\n    countLimitPartPay\\n    partPayPercent\\n    __typename\\n  }\\n  ... on havedebtcondition {\\n    missingSum\\n    partPayPercent\\n    __typename\\n  }\\n  ... on haveunpaidcondition {\\n    missingSum\\n    partPayPercent\\n    __typename\\n  }\\n  __typename\\n}\\n\"}";

    GM_xmlhttpRequest({
      method: "POST",
      url: "https://avtor24.ru/graphqlapi",

      headers: {
        "accept": "*/*",
        "accept-language": "ru,en;q=0.9,en-GB;q=0.8,en-US;q=0.7",
        "content-type": "application/json",
        "priority": "u=1, i",
        "sec-ch-ua": "\"Chromium\";v=\"142\", \"Microsoft Edge\";v=\"142\", \"Not_A Brand\";v=\"99\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "referer": `https://avtor24.ru/order/${orderNumber}`
      },

      data: body,
      anonymous: false,

      onload: function (response) {
        try {
          resolve(JSON.parse(response.responseText));
        } catch (e) {
          reject("JSON.parse error: " + e + " / " + response.responseText);
        }
      },

      onerror: function (err) {
        reject("Ошибка GraphQL getOffers: " + JSON.stringify(err));
      }
    });
  });
}



// ФИНАЛЬНОЕ РЕШЕНИЕ - используем fetch с FormData для GraphQL
async function startCorrection(orderId, correctionText, fileName = "", fileData = "") {
    console.log("✏️ Начало отправки коррекции для заказа:", orderId);

    if (!orderId || !correctionText) {
        throw new Error("Параметры orderId и correctionText обязательны");
    }

    try {
        // Создаём FormData
        const formData = new FormData();
        formData.append('query', `mutation { addCorrect(orderId: ${orderId}, correctText: "${correctionText.replace(/"/g, '\\"')}") { id }}`);

        // Если есть файл, добавляем его
        if (fileData && typeof fileData === "string" && fileData.startsWith("data:")) {
            const fileBlob = dataURLtoBlob(fileData);
            console.log("📄 Файл преобразован в Blob:", fileBlob.size, "байт, тип:", fileBlob.type);
            formData.append('file0', fileBlob, fileName);
        }

        console.log("🌐 Отправляем запрос на /graphqlapi через GM_xmlhttpRequest");

        // GM_xmlhttpRequest с FormData
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error("Request timeout"));
            }, 30000);

            GM_xmlhttpRequest({
                method: "POST",
                url: "https://avtor24.ru/graphqlapi",
                headers: {
                    "Accept": "*/*",
                    "Accept-Language": "ru,en;q=0.9",
                    "X-Requested-With": "XMLHttpRequest"
                },
                data: formData,
                onload: function(response) {
                    clearTimeout(timeout);
                    console.log("📨 Ответ получен:", response.status, response.statusText);

                    if (response.status === 200) {
                        try {
                            const result = JSON.parse(response.responseText);
                            console.log("✅ Коррекция добавлена:", result);
                            resolve(result);
                        } catch (parseError) {
                            console.error("❌ Ошибка парсинга ответа:", parseError);
                            reject(new Error("Failed to parse server response"));
                        }
                    } else {
                        console.error("❌ HTTP ошибка:", response.status, response.statusText);
                        reject(new Error(`HTTP ${response.status}: ${response.statusText}`));
                    }
                },
                onerror: function(error) {
                    clearTimeout(timeout);
                    console.error("❌ Ошибка сети:", error);
                    reject(new Error("Network error: " + JSON.stringify(error)));
                },
                ontimeout: function() {
                    clearTimeout(timeout);
                    console.error("❌ Таймаут запроса");
                    reject(new Error("Request timeout"));
                }
            });
        });
    } catch (error) {
        console.error("❌ Ошибка:", error);
        throw error;
    }
}




    async function processMessages(orderId) {
      try {
        // 1️⃣ Первый запрос — получаем сообщения
        const getMessages = await new Promise((resolve, reject) => {
          GM_xmlhttpRequest({
            method: "POST",
            url: "https://a24.biz/graphqlapi",
            headers: {
              "accept": "*/*",
              "content-type": "application/json",
              "user-agent": navigator.userAgent,
              "x-requested-with": "XMLHttpRequest"
            },
            data: JSON.stringify([{
              operationName: "getPlainMessages",
              variables: { orderId: orderId },
              query: `query getPlainMessages($orderId: ID!) {
                  dialog(orderId: $orderId) {
                    id
                    messages {
                      ...messageFragment
                      ...correctionFragment
                      ...recommendationFragment
                      ...pricerequestFragment
                      ...systemFragment
                      ...assistantFragment
                      __typename
                    }
                    __typename
                  }
                }

                fragment messageFragment on message {
                  id
                  __typename
                }

                fragment correctionFragment on correction {
                  id
                  __typename
                }

                fragment recommendationFragment on recommendation {
                  id
                  __typename
                }

                fragment pricerequestFragment on pricerequest {
                  id
                  __typename
                }

                fragment systemFragment on system {
                  id
                  __typename
                }

                fragment assistantFragment on assistant {
                  id
                  __typename
                }`
            }]),
            anonymous: false,
            onload: function (response) {
              try {
                const data = JSON.parse(response.responseText);
                resolve(data);
              } catch (e) {
                reject(e);
              }
            },
            onerror: reject
          });
        });

        // Проверяем ответ
        if (!getMessages || getMessages.errors) {
          throw new Error(`Ошибка при получении сообщений: ${JSON.stringify(getMessages.errors)}`);
        }

        console.log("📥 Получен ответ API:", getMessages);

        // Достаём ID сообщений
        const messages = getMessages?.[0]?.data?.dialog?.messages || getMessages?.data?.dialog?.messages;
        if (!Array.isArray(messages)) {
          throw new Error("Ответ API не содержит массива messages");
        }

        const messageIds = messages
          .filter(msg => msg?.id !== null && msg?.id !== undefined)
          .map(msg => parseInt(msg.id));

        console.log("💬 Извлечённые ID сообщений для заказа", orderId, ":", messageIds);

        // 2️⃣ Второй запрос — удаляем сообщения
        if (messageIds.length > 0) {
          const deleteResponse = await new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
              method: "POST",
              url: "https://a24.biz/graphqlapi",
              headers: {
                "accept": "*/*",
                "content-type": "application/json",
                "user-agent": navigator.userAgent,
                "x-requested-with": "XMLHttpRequest"
              },
              data: JSON.stringify([{
                operationName: "deleteUnreadMessages",
                variables: {
                  messageIds: messageIds,
                  assistantIds: [],
                  shouldDeleteMessages: true,
                  shouldDeleteAssistantMessages: false
                },
                query: `mutation deleteUnreadMessages($messageIds: [Int]!, $assistantIds: [Int]!, $shouldDeleteMessages: Boolean!, $shouldDeleteAssistantMessages: Boolean!) {
                    read: deleteUnreadMessages(messageIds: $messageIds) @include(if: $shouldDeleteMessages)
                    readAssistant: deleteUnreadAssistantMessages(messageIds: $assistantIds) @include(if: $shouldDeleteAssistantMessages)
                }`
              }]),
              anonymous: false,
              onload: function (response) {
                try {
                  const data = JSON.parse(response.responseText);
                  resolve(data);
                } catch (e) {
                  reject(e);
                }
              },
              onerror: reject
            });
          });

          console.log("🗑️ Результат удаления сообщений:", deleteResponse);
        } else {
          console.log(`⚠️ Для заказа ${orderId} не найдено сообщений для удаления`);
        }
      } catch (error) {
        console.error(`❌ Ошибка при обработке сообщений для заказа ${orderId}:`, error);
      }
    }

      function mapToId(type, name) {
    // СЛОВАРЬ ПРЕДМЕТОВ
    const subjects = {
        "Дизайн": 1,
        "Журналистика": 2,
        "Искусство": 3,
        "История": 4,
        "Культурология": 5,
        "Литература": 6,
        "Международные отношения": 7,
        "Педагогика": 8,
        "Политология": 9,
        "Психология": 10,
        "Право и юриспруденция": 11,
        "Реклама и PR": 12,
        "Социология": 13,
        "Страноведение": 14,
        "Философия": 15,
        "Языкознание и филология": 16,
        "Языки (переводы)": 17,
        "Астрономия": 18,
        "Археология": 19,
        "Биология": 20,
        "География": 21,
        "Естествознание": 22,
        "Медицина": 23,
        "Химия": 24,
        "Экология": 25,
        "Геология": 26,
        "Высшая математика": 27,
        "Материаловедение": 28,
        "Машиностроение": 29,
        "Информатика": 30,
        "Механика": 31,
        "Программирование": 32,
        "Процессы и аппараты": 33,
        "Архитектура и строительство": 34,
        "Транспортные средства": 35,
        "Физика": 36,
        "Электроника, электротехника, радиотехника": 37,
        "Полиграфия": 38,
        "Издательское дело": 39,
        "Работа на компьютере": 40,
        "Теория машин и механизмов": 41,
        "Чертежи": 42,
        "Антикризисное управление": 43,
        "Банковское дело": 44,
        "Бухгалтерский учет и аудит": 45,
        "Торговое дело": 46,
        "Анализ хозяйственной деятельности": 47,
        "Государственное и муниципальное управление": 48,
        "Деловой этикет": 49,
        "Маркетинг": 50,
        "Международные рынки": 51,
        "Менеджмент": 52,
        "Микро-, макроэкономика": 53,
        "Налоги": 54,
        "Стандартизация": 55,
        "Статистика": 56,
        "Страхование": 57,
        "Управление персоналом": 58,
        "Логистика": 59,
        "Таможенное дело": 60,
        "Бизнес-планирование": 61,
        "Внешнеэкономическая деятельность": 62,
        "Деньги": 63,
        "Кредит": 64,
        "Гостиничное дело": 65,
        "Товароведение": 66,
        "Организационное развитие": 67,
        "Производственный маркетинг и менеджмент": 68,
        "Промышленный маркетинг и менеджмент": 69,
        "Стратегический менеджмент": 70,
        "Экономика": 71,
        "Финансы": 72,
        "Конфликтология": 73,
        "Документоведение и архивоведение": 74,
        "Библиотечно-информационная деятельность": 75,
        "Режиссура": 76,
        "Театроведение": 78,
        "Физическая культура": 79,
        "Этика": 80,
        "Музыка": 81,
        "Сервис": 82,
        "Туризм": 83,
        "Экономика труда": 84,
        "Ценообразование и оценка бизнеса": 85,
        "Информационные технологии": 86,
        "Радиофизика": 87,
        "Автоматизация технологических процессов": 88,
        "Информационная безопасность": 89,
        "Теплоэнергетика и теплотехника": 90,
        "Ядерная энергетика и теплофизика": 91,
        "Ядерные физика и технологии": 92,
        "Энергетическое машиностроение": 93,
        "Холодильная техника": 94,
        "Технологические машины и оборудование": 95,
        "Наноинженерия": 96,
        "Авиационная и ракетно-космическая техника": 97,
        "Морская техника": 98,
        "Приборостроение и оптотехника": 99,
        "Автоматика и управление": 100,
        "Технология продовольственных продуктов и товаров": 101,
        "Картография и геоинформатика": 102,
        "Гидрометеорология": 103,
        "Почвоведение": 104,
        "Геодезия": 105,
        "Нефтегазовое дело": 106,
        "Биотехнология": 107,
        "Воспроизводство и переработка лесных ресурсов": 108,
        "Безопасность жизнедеятельности": 109,
        "Природообустройство и водопользование": 110,
        "Сельское и рыбное хозяйство": 111,
        "Металлургия": 112,
        "Логика": 113,
        "Базы данных": 114,
        "Инвестиции": 115,
        "Экономика предприятия": 116,
        "Экономическая теория": 117,
        "Финансовый менеджмент": 118,
        "Экономический анализ": 119,
        "Менеджмент организации": 120,
        "Инновационный менеджмент": 121,
        "Теория управления": 122,
        "Эконометрика": 123,
        "Социальная работа": 124,
        "Хирургия": 125,
        "Ветеринария": 126,
        "Связи с общественностью": 127,
        "Теоретическая механика": 128,
        "Гидравлика": 129,
        "Телевидение": 130,
        "Начертательная геометрия": 131,
        "Сопротивление материалов": 132,
        "Геометрия": 133,
        "Черчение": 134,
        "Теория вероятностей": 135,
        "Метрология": 136,
        "Детали машин": 137,
        "Религия": 138,
        "Криминалистика": 139,
        "Русский язык": 140,
        "Рынок ценных бумаг": 141,
        "Военное дело": 145,
        "Актерское мастерство": 146,
        "Парикмахерское искусство": 147,
        "Текстильная промышленность": 148,
        "Железнодорожный транспорт": 149,
        "Краеведение": 150,
        "Инженерные сети и оборудование": 151,
        "Фармация": 152,
        "Микропроцессорная техника": 153,
        "Управление проектами": 154,
        "Управление качеством": 155,
        "Кулинария": 156,
        "Китайский язык": 157,
        "Английский язык": 158,
        "Другое": 159,
        "STATA": 192,
        "SPSS": 193,
        "EVIEWS": 194,
        "Французский язык": 195,
        "Немецкий язык": 196,
        "Сварка и сварочное производство": 197,
        "Пожарная безопасность": 198,
        "Теория игр": 199,
        "Агрохимия и агропочвоведение": 200,
        "Водные биоресурсы и аквакультура": 201,
        "Садоводство": 202,
        "Землеустройство и кадастр": 203,
        "Лингвистика": 204,
        "Дошкольное образование": 205,
        "Дефектология": 206,
        "Обществознание": 207,
        "Охрана труда": 208,
        "Эстетика": 209,
        "Проектная деятельность": 210,
        "Методика преподавания": 211,
        "Судостроение": 212,
        "Горное дело": 213,
        "Школьная математика": 214,
        "Искусственный интеллект": 215,
        "Анатомия": 216,
        "Стоматология": 217
    };

    // СЛОВАРЬ ТИПОВ РАБОТ
    const workTypes = {
        "Дипломная работа": 1,
        "Курсовая работа": 2,
        "Реферат": 3,
        "Магистерская диссертация": 4,
        "Отчёт по практике": 5,
        "Статья": 6,
        "Доклад": 7,
        "Рецензия": 8,
        "Контрольная работа": 9,
        "Монография": 10,
        "Решение задач": 11,
        "Бизнес-план": 12,
        "Ответы на вопросы": 13,
        "Творческая работа": 14,
        "Эссе": 15,
        "Чертёж": 16,
        "Сочинения": 17,
        "Перевод": 18,
        "Презентации": 19,
        "Набор текста": 20,
        "Другое": 21,
        "Повышение уникальности текста": 22,
        "Кандидатская диссертация": 23,
        "Копирайтинг": 24,
        "Лабораторная работа": 56,
        "Помощь on-line": 89,
        "Вычитка и рецензирование работ": 123,
        "Подбор темы работы": 124,
        "Маркетинговое исследование": 125,
        "Выпускная квалификационная работа": 126,
        "Задача по программированию": 127
    };

    if (type === "subject") {
        return subjects[name] ?? null;
    }
    if (type === "work") {
        return workTypes[name] ?? null;
    }
    return null;
}

async function newDeadline(orderId, ISO) {
  // opts = { refererSuffix: "?ord=success", useCsrf: true }

  // Формируем body **строкой** ровно в том формате, как в fetch
  const bodyString =
    '{"operationName":"changeDateDeadline","variables":{"orderId":' +
    Number(orderId) +
    ',"ISODate":"' +
    String(ISO) +
    '"},"query":"mutation changeDateDeadline($orderId: Int!, $ISODate: String!) {\\\\n  changeDateDeadline(orderId: $orderId, ISODate: $ISODate, doNotModifyDeadline: true) {\\\\n    ...OrderMeta\\\\n    __typename\\\\n  }\\\\n}\\\\n\\\\nfragment OrderMeta on order {\\\\n  id\\\\n  title\\\\n  type\\\\n  typeId\\\\n  extendedStage\\\\n  category\\\\n  categoryId\\\\n  deadline\\\\n  isPremium\\\\n  agencyId\\\\n  agentInfo\\\\n  isOutdated\\\\n  isRejectedByPerformer\\\\n  premiumPrice\\\\n  dateWarrantyStart\\\\n  dateWarrantyEnd\\\\n  dateCorrectionStart\\\\n  deadlineCorrection\\\\n  withPaidAntiPlagiarism\\\\n  withAntiplagiarism\\\\n  stage\\\\n  isSpam\\\\n  isExpressOrder\\\\n  warrantyPeriod\\\\n  deadlineV2 {\\\\n    value\\\\n    editable\\\\n    range { start end __typename }\\\\n    __typename\\\\n  }\\\\n  offer {\\\\n    id\\\\n    bid\\\\n    user { id avatar(size: size50x50) online __typename }\\\\n    __typename\\\\n  }\\\\n  pagesFrom\\\\n  pagesTo\\\\n  description\\\\n  creation\\\\n  font\\\\n  interval\\\\n  unique\\\\n  uniqueOption\\\\n  isLongWarranty\\\\n  uniqueService { name __typename }\\\\n  files { id fileName filePath fileType fileSizeInMb canDeleteFile creation fileHash isFinal user_id __typename }\\\\n  budget\\\\n  uniqueType\\\\n  customerFiles { id fileName filePath __typename }\\\\n  customPropertiesSimpleElements { description name value __typename }\\\\n  customProperties { value_id value_name value_description name __typename }\\\\n  isCancellable\\\\n  substage\\\\n  isPrivate\\\\n  isNewTax\\\\n  __typename\\\\n}\\\\n"}';

  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: "POST",
      url: "https://avtor24.ru/graphqlapi",
      headers: {
        "Accept": "*/*",
        "Content-Type": "application/json",
        "Accept-Language": "ru,en;q=0.9,en-GB;q=0.8,en-US;q=0.7",
        "User-Agent": navigator.userAgent,
        "X-Requested-With": "XMLHttpRequest",
        "Origin": "https://avtor24.ru",
        "Referer": `https://avtor24.ru/order/${orderId}`,
      },
      withCredentials: true,
      data: bodyString,
      onload(response) {
        try {
          const json = JSON.parse(response.responseText);
          console.log(json)
          if (json.errors) {
            console.error("GraphQL errors:", json.errors);
            return reject(json.errors);
          }
          resolve(json.data?.changeDateDeadline ?? json.data);
        } catch (e) {
          reject(e);
        }
      },
      onerror(err) {
        reject(err);
      }
    });
  });
}



async function updateOrder({
  id,
  title,
  typeName,
  categoryName,
  description,
  budget,
  agencyId,
  warrantyPeriod,
  pagesFrom,
  pagesTo,
  font,
  unique,
  originalitySystem,
  interval,
  selectedAuthors,
  forceAuction
}) {
  const order = {};
  const addIfExists = (k, v) => {
    if (v !== undefined && v !== null) order[k] = v;
  };

  // categoryName -> categoryId (must be string)
  if (categoryName) {
    const categoryId = mapToId("subject", categoryName);
    if (!categoryId) throw new Error(`Неизвестный предмет: "${categoryName}"`);
    order.categoryId = String(categoryId);
  }

  // typeName -> typeId (string)
  if (typeName) {
    const typeId = mapToId("work", typeName);
    if (!typeId) throw new Error(`Неизвестный тип работы: "${typeName}"`);
    order.typeId = String(typeId);
  }

  // direct fields
  addIfExists("title", title);
  addIfExists("description", description);
  addIfExists("font", font);
  addIfExists("unique", unique);
  addIfExists("pagesFrom", pagesFrom);
  addIfExists("pagesTo", pagesTo);
  addIfExists("interval", interval);
  addIfExists("forceAuction", forceAuction);

  if (budget !== undefined) order.budget = Number(budget);
  if (agencyId !== undefined) order.agencyId = String(agencyId);
  if (warrantyPeriod !== undefined) order.warrantyPeriod = String(warrantyPeriod);

  // selectedAuthors must remain an array of numbers
  if (Array.isArray(selectedAuthors))
    order.selectedAuthors = selectedAuthors.map(a => Number(a));

  // originalitySystem -> serviceTypeId (string)
  if (originalitySystem) {
    const originalityMap = {
      "etxt": "0", "etxт": "0", "etxt.ru": "0", "ETXT": "0",
      "Антиплагиат ВУЗ": "1", "Антиплагиат ВУЗ.ру": "1", "ВУЗ": "1", "Антиплагиат": "1"
    };
    if (!(originalitySystem in originalityMap)) {
      throw new Error(`Неизвестная система оригинальности: ${originalitySystem}. Используй "ETXT" или "Антиплагиат ВУЗ".`);
    }
    order.serviceTypeId = originalityMap[originalitySystem];
  }

  if (Object.keys(order).length === 0) {
    throw new Error("Нет полей для обновления — передай хотя бы одно поле для order.");
  }

  const body = {
    operationName: "updateOrder",
    variables: {
      id: String(id),       // ← ОБЯЗАТЕЛЬНО строка
      order
    },
    query: `
      mutation updateOrder($id: ID!, $order: OrderInputType) {
        updateOrder(id: $id, order: $order) {
          ...OrderMeta
          __typename
        }
      }

      fragment OrderMeta on order {
        id
        title
        type
        typeId
        extendedStage
        category
        categoryId
        deadline
        isPremium
        agencyId
        agentInfo
        isOutdated
        isRejectedByPerformer
        premiumPrice
        dateWarrantyStart
        dateWarrantyEnd
        dateCorrectionStart
        deadlineCorrection
        withPaidAntiPlagiarism
        withAntiplagiarism
        stage
        isSpam
        isExpressOrder
        warrantyPeriod
        deadlineV2 {
          value
          editable
          range {
            start
            end
            __typename
          }
          __typename
        }
        offer {
          id
          bid
          user {
            id
            avatar(size: size50x50)
            online
            __typename
          }
          __typename
        }
        pagesFrom
        pagesTo
        description
        creation
        font
        interval
        unique
        uniqueOption
        isLongWarranty
        uniqueService {
          name
          __typename
        }
        files {
          id
          fileName
          filePath
          fileType
          fileSizeInMb
          canDeleteFile
          creation
          fileHash
          isFinal
          user_id
          __typename
        }
        budget
        uniqueType
        customerFiles {
          id
          fileName
          filePath
          __typename
        }
        customPropertiesSimpleElements {
          description
          name
          value
          __typename
        }
        customProperties {
          value_id
          value_name
          value_description
          name
          __typename
        }
        isCancellable
        substage
        isPrivate
        isNewTax
        __typename
      }`
  };

  console.log("UPDATE ORDER: sending body:", JSON.stringify(body));

  return await new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: "POST",
      url: "https://avtor24.ru/graphqlapi",
      headers: {
        "Accept": "*/*",
        "Accept-Language": "ru,en;q=0.9",
        "Content-Type": "application/json",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
        "referer": "https://avtor24.ru/order/" + id + "?ord=success"
      },
      data: JSON.stringify(body),
      onload(response) {
        console.log("RAW RESPONSE:", response.responseText);
        let json;
        try {
          json = JSON.parse(response.responseText);
        } catch (e) {
          return reject("Invalid JSON: " + e.message);
        }

        if (json.errors) {
          console.error("GraphQL errors:", json.errors);
          return reject(json.errors.map(e => e.message).join("; "));
        }

        if (!json?.data?.updateOrder) {
          return reject("Invalid response: data.updateOrder not found");
        }

        resolve(json.data.updateOrder);
      },
      onerror(err) {
        reject(err);
      }
    });
  });
}







async function getAuctions(limit = 50, offset = 0) {

    async function request(limit, offset) {
        return await new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "POST",
                url: "https://avtor24.ru/graphqlapi",
                headers: {
                    "Accept": "*/*",
                    "Accept-Language": "ru,en;q=0.9,en-GB;q=0.8,en-US;q=0.7",
                    "Content-Type": "application/json",
                    "Priority": "u=1, i",
                    "Sec-Fetch-Dest": "empty",
                    "Sec-Fetch-Mode": "cors",
                    "Sec-Fetch-Site": "same-origin"
                },
                data: JSON.stringify({
                    operationName: "getMyOrders",
                    variables: {
                        limit,
                        offset,
                        filter: {
                            query: "",
                            page: "",
                            sort: "default",
                            stages: [0] // <-- ты используешь только аукционы
                        }
                    },
                    query: `
                        query getMyOrders($offset: Int!, $limit: Int!, $filter: MyOrdersFilterInputType!) {
                          myorders {
                            pages(extended: true) {
                              count
                              name
                            }
                            searchOrders(offset: $offset, limit: $limit, filter: $filter) {
                              count
                              orders {
                                id
                              }
                            }
                          }
                        }
                    `
                }),
                onload: function (response) {
                    try {
                        const json = JSON.parse(response.responseText);
                        if (!json?.data?.myorders) return reject("Invalid response");
                        resolve(json);
                    } catch (e) {
                        reject(e);
                    }
                },
                onerror: err => reject(err)
            });
        });
    }

    // 1) Делаем первый запрос
    let result = await request(limit, offset);

    const pages = result.data.myorders.pages;

    // 2) Ищем страницу "auction"
    const auctionPage = pages.find(p => p.name === "auction");

    if (!auctionPage) return result; // вдруг нет страницы

    const totalAuctions = auctionPage.count;

    // 3) Если аукционов больше лимита → делаем повторный запрос с большим лимитом
    if (totalAuctions > limit) {
        result = await request(totalAuctions, 0);
    }

    var finalresult = result.data.myorders.searchOrders.orders
    // 4) Возвращаем финальный полный результат
    return finalresult;
}



  async function dismissRecalculation(orderId) {
  return new Promise((resolve, reject) => {
    const body =
      "{\"operationName\":\"cancelComplain\",\"variables\":{\"orderId\":" +
      orderId +
      "},\"query\":\"mutation cancelComplain($orderId: Int!) {\\n  canceledComplainOrder: cancelComplain(orderId: $orderId) {\\n    id\\n    __typename\\n  }\\n}\\n\"}";

    GM_xmlhttpRequest({
      method: "POST",
      url: "https://avtor24.ru/graphqlapi",
      headers: {
        "accept": "*/*",
        "accept-language": "ru,en;q=0.9,en-GB;q=0.8,en-US;q=0.7",
        "content-type": "application/json",
        "priority": "u=1, i",
        "sec-ch-ua": "\"Microsoft Edge\";v=\"141\", \"Not?A_Brand\";v=\"8\", \"Chromium\";v=\"141\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "referer": `https://avtor24.ru/order/${orderId}`
      },
      anonymous: false, // обязательно, чтобы куки (сессия) были видны
      data: body,
      onload: function (response) {
        console.log("GraphQL Response:", response.responseText);
        try {
          const parsed = JSON.parse(response.responseText);
          // ожидаем структуру { data: { canceledComplainOrder: { id, __typename } } }
          resolve(parsed?.data?.canceledComplainOrder ?? null);
        } catch (e) {
          reject("Ошибка JSON.parse: " + e + " / " + response.responseText);
        }
      },
      onerror: function (error) {
        reject("Ошибка GraphQL dismissRecalculation: " + JSON.stringify(error));
      }
    });
  });
}

async function priceRequest(offerId) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      operationName: "requestPrice",
      variables: { offer: String(offerId) },
      query: `mutation requestPrice($offer: ID!) {
        sendPriceRequest(offerId: $offer) {
          id
          user_id
          text
          creation
          isAdminComment
          isRead
          watched
          isHidden
          __typename
        }
      }`
    });

    GM_xmlhttpRequest({
      method: "POST",
      url: "https://avtor24.ru/graphqlapi",
      headers: {
        "accept": "*/*",
        "accept-language": "ru,en;q=0.9,en-GB;q=0.8,en-US;q=0.7",
        "content-type": "application/json",
        "priority": "u=1, i",
        "sec-ch-ua": "\"Chromium\";v=\"142\", \"Microsoft Edge\";v=\"142\", \"Not_A Brand\";v=\"99\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "referer": `https://avtor24.ru/order/${offerId}?ord=success`
      },
      anonymous: false, // нужно для куки и авторизации
      data: body,

      onload: function (response) {
        console.log("GraphQL Response:", response.responseText);
        try {
          const parsed = JSON.parse(response.responseText);

          // Ожидаем структуру: { data: { sendPriceRequest: {...} } }
          resolve(parsed?.data?.sendPriceRequest ?? null);
        } catch (e) {
          reject("Ошибка JSON.parse: " + e + " / " + response.responseText);
        }
      },

      onerror: function (error) {
        reject("Ошибка GraphQL priceRequest: " + JSON.stringify(error));
      }
    });
  });
}


async function payWithBalance(offerId) {
    const url = "https://avtor24.ru/graphqlapi";

    const headers = {
        "Accept": "*/*",
        "Accept-Language": "ru,en;q=0.9,en-GB;q=0.8,en-US;q=0.7",
        "Content-Type": "application/json",
        "Priority": "u=1, i",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin"
    };

    // ---- 1. canPayWithBalance ----
    const canPay = await new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: "POST",
            url,
            headers,
            data: JSON.stringify({
                operationName: "canPayWithBalance",
                variables: { offerId: String(offerId), isPartPay: false },
                query: `query canPayWithBalance($offerId: ID!, $isPartPay: Boolean!) {
                    payment {
                        invoice(offerId: $offerId, isPartPay: $isPartPay) {
                            canPayWithBalance
                        }
                    }
                }`
            }),
            onload: res => {
                try {
                    const json = JSON.parse(res.responseText);
                    resolve(json.data.payment.invoice.canPayWithBalance);
                } catch (e) { reject(e); }
            },
            onerror: reject
        });
    });

    if (!canPay) {
        alert("❗ Пополните баланс");
        return false;
    }

    // ---- 2. attemptPayment ----
    const attemptOk = await new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: "POST",
            url,
            headers,
            data: JSON.stringify({
                operationName: "paymentAttempt",
                variables: { offerId: String(offerId), paymentMethod: 20 },
                query: `mutation paymentAttempt($offerId: ID!, $paymentMethod: Int) {
                    attemptPayment(offerId: $offerId, paymentMethod: $paymentMethod)
                }`
            }),
            onload: res => {
                try {
                    const json = JSON.parse(res.responseText);
                    resolve(json.data.attemptPayment === true);
                } catch (e) { reject(e); }
            },
            onerror: reject
        });
    });

    if (!attemptOk) {
        alert("❗ Ошибка attemptPayment");
        return false;
    }

    // ---- 3. hire ----
    const hireResult = await new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: "POST",
            url,
            headers,
            data: JSON.stringify({
                operationName: "hire",
                variables: { partial: false, id: Number(offerId) },
                query: `mutation hire($id: Int!, $partial: Boolean = false) {
                    acceptOffer(offerId: $id, partial: $partial) {
                        id
                        extendedStage
                        offer { id }
                    }
                }`
            }),
            onload: res => {
                try {
                    resolve(JSON.parse(res.responseText));
                } catch (e) { reject(e); }
            },
            onerror: reject
        });
    });

    console.log("Hire result:", hireResult);
    alert("✔ Заказ успешно принят");

    return true;
}

// Пример запуска
// payWithBalance(128421279);
let currentRequest = null;

function downloadFile(url, filename) {
    // Если уже есть активный запрос — отменяем
    if (currentRequest) {
        currentRequest.abort();
        currentRequest = null;
    }

    currentRequest = GM_xmlhttpRequest({
        method: "GET",
        url: url,
        responseType: "blob",

        onload: function (response) {
            currentRequest = null; // завершён
            try {
                const blob = response.response;
                const urlBlob = URL.createObjectURL(blob);

                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = urlBlob;
                a.download = filename;
                document.body.appendChild(a);

                a.click();

                document.body.removeChild(a);
                URL.revokeObjectURL(urlBlob);
            } catch (err) {
                console.error("Ошибка обработки файла:", err);
                window.location.href = url;
            }
        },

        onerror: function (err) {
            currentRequest = null;
            console.error("Ошибка GM_xmlhttpRequest:", err);
            window.location.href = url;
        },

        onabort: function () {
            console.log("Запрос отменён!");
        }
    });

    return currentRequest;
}

function getPreview(url, onload) {
  const referrer = new URL(url).origin + "/";

  GM_xmlhttpRequest({
    method: "GET",
    url: url,
    headers: {
      "accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
      "accept-language": "ru,en;q=0.9,en-GB;q=0.8,en-US;q=0.7",
      "priority": "u=1, i",
      "sec-ch-ua": "\"Chromium\";v=\"142\", \"Microsoft Edge\";v=\"142\", \"Not_A Brand\";v=\"99\"",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "\"Windows\"",
      "sec-fetch-dest": "image",
      "sec-fetch-mode": "no-cors",
      "sec-fetch-site": "cross-site",
      "sec-fetch-storage-access": "active",
      "referer": referrer
    },
    responseType: "blob",
    onload: function (response) {
      if (onload) onload(response);
    },
    onerror: function (err) {
      console.error("GM_xmlhttpRequest error:", err);
    }
  });
}

  // === Глобальный объект ===
  unsafeWindow.a24 = { updateOrder, getPreview, downloadFile, priceRequest, payWithBalance, processMessages, priceRequest, clearNotifications, orderMetaS, newDeadline, getAuctions, dismissRecalculation, checkAdmin, getMessagesS, acceptWork, startWarranty, startComplain, getOffers, OfferRead, addFileS, startCorrection, backtoWork, AdminOperation, fetchBXBalance, getBalance, declineCorrection, login, cancellation, logout, getCsrfToken, getOrderComposedStage, getOrder, sendFile, addComment, addCommentS, canIComment, fetchOrdersAndNotifications, getPlainMessages, fetchProfile, fetchProfileS, getComplain, getOrderNotices, getReworkRequests, requestRework, fetchOrdersAndNotificationsS, getTokenKey, getOrderS, loginS, logoutS };

      console.log('[BIBI SYNC] Watcher started');

      // Listen for any value changes from Bitrix
      GM_addValueChangeListener('bibi_last_order', (name, oldVal, newVal, remote) => {
          if (!remote) return; // ignore same-page writes

          console.log('[BIBI SYNC] Received new order:', newVal);

          if (typeof loadOrderById === 'function') {
              loadOrderById(newVal.id);
          } else {
              console.warn('[BIBI SYNC] loadOrderById() is not defined yet');
          }
      });

      // Optional: On startup, check if there’s already something saved
      GM_getValue('bibi_last_order').then(val => {
          if (val) console.log('[BIBI SYNC] Current stored order:', val);
      });

  console.log("🚀 A24 Helper Advanced (Fixed) загружен. Используй a24.login('email','пароль')");

    }
})();