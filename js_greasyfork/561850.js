// ==UserScript==
// @name         salesDrive_send_to_print
// @namespace    http://tampermonkey.net/
// @version      1.03
// @description  Відправка замовлення на пошту при статусі "В друці"
// @author       LanNet
// @match        https://e-oboi.salesdrive.me/ua/index.html?formId=1*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=salesdrive.me
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561850/salesDrive_send_to_print.user.js
// @updateURL https://update.greasyfork.org/scripts/561850/salesDrive_send_to_print.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 🔹 НАЛАШТУВАННЯ: URL вашого PHP скрипта для відправки email
    // Замініть на реальний URL, де ви розмістите send_order_email.php
    const EMAIL_API_URL = 'https://e-oboi.com/send_order_email.php';
    
    // Email для тесту (якщо потрібно змінити)
    // const TEST_EMAIL = 'rds.lannet@gmail.com';

    // Зберігаємо оброблені рядки, щоб не додавати кнопки повторно
    const processedRows = new Set();

    // Функція для завантаження PDF файлу та конвертації в base64
    async function downloadPDFAsBase64(url) {
        try {
            // Якщо URL відносний, додаємо домен
            let fullUrl = url;
            if (url.startsWith('/')) {
                fullUrl = window.location.origin + url;
            }
            
            console.log('Завантаження PDF з URL:', fullUrl);
            
            // Додаємо credentials для завантаження (якщо потрібна авторизація)
            const response = await fetch(fullUrl, {
                method: 'GET',
                credentials: 'include', // Включаємо cookies для авторизації
                headers: {
                    'Accept': 'application/pdf, */*'
                }
            });
            
            console.log('Відповідь від сервера:', response.status, response.statusText);
            console.log('Content-Type:', response.headers.get('content-type'));
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Помилка завантаження PDF:', response.status, errorText.substring(0, 200));
                throw new Error('Помилка завантаження PDF: ' + response.status + ' ' + response.statusText);
            }
            
            const blob = await response.blob();
            console.log('PDF blob отримано, розмір:', blob.size, 'bytes, тип:', blob.type);
            
            // Перевіряємо, чи це дійсно PDF
            if (!blob.type.includes('pdf') && blob.size > 0) {
                console.warn('Отриманий файл може не бути PDF. Тип:', blob.type);
            }
            
            // Конвертуємо blob в base64
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64 = reader.result.split(',')[1]; // Прибираємо префікс data:application/pdf;base64,
                    console.log('PDF конвертовано в base64, довжина:', base64.length);
                    resolve(base64);
                };
                reader.onerror = (error) => {
                    console.error('Помилка читання blob:', error);
                    reject(error);
                };
                reader.readAsDataURL(blob);
            });
        } catch (error) {
            console.error('Помилка завантаження PDF:', error);
            return null;
        }
    }

    // Функція для завантаження PDF для замовлення (викликається тільки при відправці)
    async function loadPDFForOrder(orderData) {
        if (!orderData.ttn || !orderData.pdfHref) {
            console.log('ℹ️ ТТН або посилання на PDF відсутні, PDF не буде завантажено');
            orderData.ttnPdfBase64 = null;
            orderData.ttnPdfFileName = '';
            return;
        }

        try {
            console.log('📥 Завантаження PDF з посилання:', orderData.pdfHref);
            const pdfBase64 = await downloadPDFAsBase64(orderData.pdfHref);
            if (pdfBase64) {
                orderData.ttnPdfBase64 = pdfBase64;
                // Формуємо назву файлу: TTN_НОМЕР_ЗАМОВЛЕННЯ.pdf
                const fileNameOrderNumber = orderData.orderNumber || orderData.ttn || 'unknown';
                orderData.ttnPdfFileName = `TTN_${fileNameOrderNumber}.pdf`;
                console.log('✅ PDF успішно завантажено, розмір:', (pdfBase64.length / 1024).toFixed(2), 'KB');
                console.log('✅ Назва файлу PDF:', orderData.ttnPdfFileName);
            } else {
                console.warn('⚠️ Не вдалося завантажити PDF, але продовжуємо без вкладення');
                orderData.ttnPdfBase64 = null;
                orderData.ttnPdfFileName = '';
            }
        } catch (error) {
            console.error('❌ Помилка завантаження PDF:', error);
            orderData.ttnPdfBase64 = null;
            orderData.ttnPdfFileName = '';
        }
    }

    // Функція для визначення відправника (виробництва)
    function getSenderInfo(row) {
        let senderName = '';
        let senderEmail = '';
        let pdfPathType = 'print-marking'; // 'print-marking' або 'print'
        
        // Шукаємо відправника
        let senderElement = null;
        if (row) {
            // Для таблиці замовлень
            senderElement = row.querySelector('div[attr-field-name="ord_delivery_sender"]') ||
                           row.querySelector('div.stylized-select[attr-field-name="ord_delivery_sender"]');
        } else {
            // Для сторінки деталей - спробуємо різні селектори
            // Спочатку шукаємо через form-group з лейблом "Відправник"
            const formGroups = document.querySelectorAll('.form-group');
            for (const formGroup of formGroups) {
                const label = formGroup.querySelector('label.text-right');
                if (label && label.textContent.trim() === 'Відправник') {
                    senderElement = formGroup.querySelector('div[attr-field-name="idEntity"]') ||
                                  formGroup.querySelector('div.stylized-select[attr-field-name="idEntity"]');
                    if (senderElement) {
                        console.log('✅ Знайдено відправника через form-group з лейблом "Відправник"');
                        break;
                    }
                }
            }
            
            // Якщо не знайшли через form-group, шукаємо напряму
            if (!senderElement) {
                senderElement = document.querySelector('div[attr-field-name="idEntity"]') ||
                               document.querySelector('div.stylized-select[attr-field-name="idEntity"]') ||
                               document.querySelector('.stylized-select[attr-field-name="idEntity"]');
            }
            
            // Якщо все ще не знайшли, шукаємо в contact-wrapper-inner
            if (!senderElement) {
                const contactWrapper = document.querySelector('.contact-wrapper-inner');
                if (contactWrapper) {
                    senderElement = contactWrapper.querySelector('div[attr-field-name="idEntity"]') ||
                                  contactWrapper.querySelector('div.stylized-select[attr-field-name="idEntity"]');
                }
            }
        }
        
        if (senderElement) {
            senderName = senderElement.textContent.trim();
            console.log('✅ Знайдено відправника:', senderName);
            
            // Визначаємо налаштування залежно від відправника
            if (senderName.includes('Харків Оленка') || senderName.includes('Харків')) {
                senderEmail = 'ekvatorprint@gmail.com';
                pdfPathType = 'print-marking'; // /print-marking/ТТН/7/
            } else if (senderName.includes('Київ Оленка') || senderName.includes('Київ')) {
                senderEmail = 'shirokoformat1@gmail.com';
                pdfPathType = 'print'; // /print/ТТН/7/
            } else if (senderName.includes('Луцьк Оленка') || senderName.includes('Луцьк')) {
                senderEmail = 'hataprinting@gmail.com';
                pdfPathType = 'print-marking'; // /print-marking/ТТН/7/
            } else {
                // За замовчуванням (якщо не визначено)
                senderEmail = 'rds.lannet@gmail.com';
                pdfPathType = 'print-marking';
            }
        } else {
            console.log('⚠️ Відправник не знайдено в getSenderInfo');
        }
        
        return {
            name: senderName,
            email: senderEmail,
            pdfPathType: pdfPathType
        };
    }

    // Функція для збору даних про замовлення
    async function collectOrderData(row) {
        const data = {
            orderNumber: '',
            comment: '',
            ttn: '',
            ttnPdfBase64: null,
            ttnPdfFileName: '',
            pdfHref: null, // Посилання на PDF (без завантаження)
            fileLink: '',
            orderLink: window.location.href,
            senderName: '',
            senderEmail: ''
        };
        
        // Визначаємо відправника
        const senderInfo = getSenderInfo(row);
        data.senderName = senderInfo.name;
        data.senderEmail = senderInfo.email;
        console.log('📧 Відправник:', senderInfo.name, '-> Email:', senderInfo.email, '-> PDF тип:', senderInfo.pdfPathType);

        // Знаходимо номер замовлення
        // 1. Спочатку шукаємо в заголовку сторінки h1.left.ng-binding.ng-scope (найнадійніший спосіб)
        const orderElement = document.querySelector('h1.left.ng-binding.ng-scope');
        
        if (orderElement) {
            const orderText = orderElement.textContent || '';
            console.log('Текст заголовку h1:', orderText);
            // Беремо перше число з тексту (як в інших скриптах)
            const orderNumberMatch = orderText.match(/\d+/);
            if (orderNumberMatch) {
                data.orderNumber = orderNumberMatch[0];
                console.log('✅ Знайдено номер замовлення в заголовку h1:', data.orderNumber);
            }
        }

        // 2. Якщо не знайшли в h1, шукаємо в рядку таблиці (якщо це таблиця замовлень)
        if (!data.orderNumber && row) {
            // Шукаємо в поточному рядку
            const idElementInRow = row.querySelector('div[attr-field-name="id"]');
            if (idElementInRow) {
                const idText = idElementInRow.textContent.trim().replace(/\s+/g, '');
                console.log('Знайдено id в рядку:', idText);
                // Перевіряємо, чи це не ТТН (ТТН зазвичай 13-14 цифр) і не занадто коротке
                if (idText && idText.length >= 3 && idText.length < 13 && /^\d+$/.test(idText)) {
                    data.orderNumber = idText;
                    console.log('✅ Знайдено номер замовлення в рядку таблиці:', data.orderNumber);
                }
            }
        }

        // 3. Якщо не знайшли, шукаємо в URL (hash або query параметри)
        if (!data.orderNumber) {
            // Шукаємо в hash частині URL: #/order/index або #/order/6924
            const hashMatch = window.location.hash.match(/order[\/#](\d+)/);
            if (hashMatch) {
                data.orderNumber = hashMatch[1];
                console.log('✅ Знайдено номер замовлення в hash URL:', data.orderNumber);
            } else {
                // Шукаємо в query параметрах або шляху
                const urlMatch = window.location.href.match(/[\/=](\d{3,})/);
                if (urlMatch) {
                    const foundNumber = urlMatch[1];
                    // Перевіряємо, чи це не ТТН
                    if (foundNumber.length < 13) {
                        data.orderNumber = foundNumber;
                        console.log('✅ Знайдено номер замовлення в URL:', data.orderNumber);
                    }
                }
            }
        }

        // Фінальна перевірка - якщо номер замовлення не знайдено, виводимо попередження
        if (!data.orderNumber) {
            console.warn('⚠️ Номер замовлення не знайдено! URL:', window.location.href);
        } else {
            console.log('📋 Фінальний номер замовлення:', data.orderNumber);
        }

        // Знаходимо коментар - шукаємо в ячейці з attr-field-name="comment"
        const commentSelectors = [
            'div[attr-field-name="comment"]',
            'div.click-editable[attr-field-name="comment"]',
            'td.column-editable div[attr-field-name="comment"]'
        ];
        
        for (const selector of commentSelectors) {
            const commentElement = (row && row.querySelector(selector)) || document.querySelector(selector);
            if (commentElement) {
                // Отримуємо текст коментаря, ігноруючи іконки редагування
                let commentText = '';
                
                // Якщо це textarea або input, беремо value
                if (commentElement.tagName === 'TEXTAREA' || commentElement.tagName === 'INPUT') {
                    commentText = commentElement.value || '';
                } else {
                    // Якщо це div, беремо textContent, але виключаємо іконки редагування
                    const clone = commentElement.cloneNode(true);
                    // Видаляємо всі .wrapper-editable-icon та .click-editable-icon
                    clone.querySelectorAll('.wrapper-editable-icon, .click-editable-icon, .editable-icon').forEach(el => el.remove());
                    commentText = clone.textContent || '';
                }
                
                if (commentText.trim()) {
                    data.comment = commentText.trim();
                    console.log('✅ Знайдено коментар:', data.comment.substring(0, 50) + (data.comment.length > 50 ? '...' : ''));
                    break;
                }
            }
        }
        
        // Якщо коментар не знайдено або пустий, залишаємо порожнім
        if (!data.comment || !data.comment.trim()) {
            console.log('ℹ️ Коментар не знайдено або він пустий');
            data.comment = '';
        }

        // ВАЖЛИВО: Шукаємо ТТН залежно від контексту
        // Для таблиці замовлень (row !== null) - шукаємо в novaposhta-inner
        // Для детальної сторінки (row === null) - шукаємо в полі EN
        let pdfHref = null; // Оголошуємо змінну для посилання на PDF
        let hasTTN = false;
        
        if (row) {
            // Для таблиці замовлень - шукаємо ТТН в novaposhta-inner
            const novaPoshtaInner = row.querySelector('.novaposhta-inner');
            if (novaPoshtaInner) {
                // Шукаємо посилання з ТТН
                const ttnLink = novaPoshtaInner.querySelector('a.link-name-field[href*="novaposhta.ua/tracking"]');
                if (ttnLink) {
                    const ttnHref = ttnLink.getAttribute('href');
                    const ttnMatch = ttnHref.match(/novaposhta\.ua\/tracking\/(\d{10,15})(?:\/|\?|$)/);
                    if (ttnMatch) {
                        data.ttn = ttnMatch[1];
                        hasTTN = true;
                        console.log('✅ Знайдено ТТН в novaposhta-inner для таблиці:', data.ttn);
                    } else {
                        // Якщо не знайшли в href, шукаємо в тексті посилання
                        const ttnText = ttnLink.textContent.trim();
                        const ttnFromText = ttnText.match(/\b(\d{13,14})\b/);
                        if (ttnFromText) {
                            data.ttn = ttnFromText[1];
                            hasTTN = true;
                            console.log('✅ Знайдено ТТН в тексті посилання novaposhta-inner:', data.ttn);
                        }
                    }
                }
            }
            
            if (!hasTTN) {
                console.log('ℹ️ ТТН не знайдено в novaposhta-inner для таблиці замовлень');
            }
        } else {
            // Для детальної сторінки - спочатку шукаємо ТТН в новій структурі (form-group з лейблом "ТТН")
            // Це структура, яка з'являється після створення ТТН
            let ttnFound = false;
            
            // Шукаємо form-group з лейблом "ТТН"
            const formGroups = document.querySelectorAll('.form-group');
            for (const formGroup of formGroups) {
                const label = formGroup.querySelector('label.text-right');
                if (label && label.textContent.trim() === 'ТТН') {
                    // Знаходимо посилання з ТТН
                    const ttnLink = formGroup.querySelector('a[href*="novaposhta.ua/tracking"]');
                    if (ttnLink) {
                        // Витягуємо ТТН з href або з тексту посилання
                        const ttnHref = ttnLink.getAttribute('href');
                        const ttnMatch = ttnHref.match(/novaposhta\.ua\/tracking\/(\d{13,14})(?:\/|\?|$)/);
                        if (ttnMatch) {
                            data.ttn = ttnMatch[1];
                            hasTTN = true;
                            ttnFound = true;
                            console.log('✅ Знайдено ТТН в новій структурі (form-group з лейблом "ТТН"):', data.ttn);
                            break;
                        } else {
                            // Якщо не знайшли в href, шукаємо в тексті посилання
                            const ttnText = ttnLink.textContent.trim();
                            const ttnFromText = ttnText.match(/\b(\d{13,14})\b/);
                            if (ttnFromText) {
                                data.ttn = ttnFromText[1];
                                hasTTN = true;
                                ttnFound = true;
                                console.log('✅ Знайдено ТТН в тексті посилання (form-group з лейблом "ТТН"):', data.ttn);
                                break;
                            }
                        }
                    }
                }
            }
            
            // Якщо не знайшли в новій структурі, шукаємо в полі EN (старий спосіб)
            if (!ttnFound) {
                const enElement = document.querySelector('div[attr-field-name="EN"]');
                if (enElement) {
                    // Перевіряємо, чи поле EN порожнє (має клас ph-is-empty)
                    const isEmpty = enElement.querySelector('.ph-is-empty') || enElement.classList.contains('ph-is-empty');
                    
                    if (!isEmpty) {
                        // Якщо поле не порожнє, витягуємо ТТН з нього
                        const enText = enElement.textContent.trim();
                        // Шукаємо ТТН (13-14 цифр)
                        const ttnMatch = enText.match(/\b(\d{13,14})\b/);
                        if (ttnMatch) {
                            data.ttn = ttnMatch[1];
                            hasTTN = true;
                            console.log('✅ Знайдено ТТН в полі EN на детальній сторінці:', data.ttn);
                        } else {
                            console.log('ℹ️ Поле EN не порожнє, але ТТН не знайдено в тексті:', enText);
                        }
                    } else {
                        console.log('ℹ️ Поле EN порожнє (ph-is-empty), ТТН відсутній');
                    }
                } else {
                    console.log('ℹ️ Поле EN не знайдено на детальній сторінці');
                }
            }
        }
        
        // Якщо ТТН не знайдено, встановлюємо порожнє значення
        if (!hasTTN) {
            console.log('ℹ️ ТТН не знайдено, встановлюємо порожнє значення');
            data.ttn = ''; // Явно встановлюємо порожнє значення
        }
        
        // Очищаємо ТТН від зайвих символів та перевіряємо формат (тільки якщо ТТН є)
        if (data.ttn && data.ttn.trim() !== '') {
            // Прибираємо всі нецифрові символи
            const originalTtn = data.ttn;
            data.ttn = data.ttn.replace(/\D/g, '');
            
            // Перевіряємо, чи ТТН має правильну довжину (13-14 цифр)
            if (data.ttn.length < 13 || data.ttn.length > 14) {
                console.warn('ТТН має некоректну довжину:', data.ttn);
                // Спробуємо знайти правильний ТТН всередині (починається з 2 або 5)
                const correctTtnMatch = data.ttn.match(/([25]\d{12,13})/);
                if (correctTtnMatch) {
                    data.ttn = correctTtnMatch[1];
                    console.log('Виправлено ТТН:', originalTtn, '->', data.ttn);
                } else {
                    // Якщо не знайшли правильний формат, спробуємо взяти останні 13-14 цифр
                    if (data.ttn.length > 14) {
                        data.ttn = data.ttn.slice(-14);
                        console.log('Взято останні 14 цифр:', data.ttn);
                    }
                }
            }
            
            // Якщо ТТН починається не з 2 або 5, але має правильну довжину, залишаємо як є
            // (можуть бути інші формати ТТН)
            console.log('Фінальний ТТН:', data.ttn);
            
            // Якщо ТТН змінився, перегенеруємо посилання на PDF
            if (pdfHref && originalTtn !== data.ttn) {
                pdfHref = null; // Скидаємо, щоб перегенерувати
            }
        }

        // Генеруємо посилання на PDF ТІЛЬКИ якщо є ТТН
        if (data.ttn && data.ttn.trim() !== '') {
            const formIdMatch = window.location.href.match(/[?&]formId=(\d+)/);
            const formId = formIdMatch ? formIdMatch[1] : '1';
            const novaPoshtaId = '7';
            const pdfType = senderInfo.pdfPathType; // 'print-marking' для Харків/Луцьк, 'print' для Київ
            
            // Генеруємо повне посилання на PDF з правильним типом
            pdfHref = `https://e-oboi.salesdrive.me/nova-poshta/${pdfType}/${data.ttn}/${novaPoshtaId}/?formId=${formId}`;
            console.log('✅ Згенеровано посилання на PDF:', pdfHref, '(тип:', pdfType + ', відправник:', senderInfo.name + ')');
        } else {
            console.log('ℹ️ ТТН відсутній, посилання на PDF не генерується');
            pdfHref = null;
        }
        
        // Зберігаємо посилання на PDF для подальшого використання
        data.pdfHref = pdfHref || null;

        // Знаходимо посилання на файл
        // ВАЖЛИВО: Файл має бути саме в полі fajl, а не в інших місцях
        const fajlElement = (row && row.querySelector('div[attr-field-name="fajl"]')) ||
                           document.querySelector('div[attr-field-name="fajl"]');
        
        // Перевіряємо, чи файл є в полі fajl
        if (fajlElement) {
            // Якщо елемент містить ph-is-empty, файлу немає
            if (fajlElement.querySelector('.ph-is-empty')) {
                console.log('ℹ️ Файл відсутній в полі fajl (ph-is-empty знайдено)');
                data.fileLink = ''; // Встановлюємо порожнє значення
            } else {
                // Шукаємо посилання на файл в полі fajl
                const fileLinkElement = fajlElement.querySelector('a.link-field') ||
                                       fajlElement.querySelector('a');
                
                if (fileLinkElement) {
                    const fileHref = fileLinkElement.getAttribute('href');
                    if (fileHref) {
                        data.fileLink = fileHref;
                        console.log('✅ Знайдено посилання на файл в attr-field-name="fajl":', data.fileLink);
                    } else {
                        console.log('ℹ️ Файл не знайдено в полі fajl (немає посилання)');
                        data.fileLink = '';
                    }
                } else {
                    console.log('ℹ️ Файл не знайдено в полі fajl (немає посилання)');
                    data.fileLink = '';
                }
            }
        } else {
            console.log('ℹ️ Поле fajl не знайдено');
            data.fileLink = '';
        }
        
        // НЕ шукаємо файл в інших місцях (коментар, зображення тощо)
        // Файл має бути саме в полі fajl

        // НЕ шукаємо файл в інших місцях (коментар, зображення, textarea)
        // Файл має бути саме в полі fajl

        return data;
    }

    // Функція для відправки даних на сервер
    async function sendOrderToEmail(orderData) {
        try {
            // Логування даних перед відправкою
            console.log('📤 Відправляємо дані на сервер:');
            console.log('  - Номер замовлення:', orderData.orderNumber);
            console.log('  - ТТН:', orderData.ttn);
            console.log('  - PDF посилання:', orderData.pdfHref || '(немає)');
            console.log('  - PDF файл:', orderData.ttnPdfFileName || '(немає)');
            console.log('  - PDF base64 довжина:', orderData.ttnPdfBase64 ? orderData.ttnPdfBase64.length : 0);
            console.log('  - Посилання на файл:', orderData.fileLink);
            console.log('  - Коментар:', orderData.comment ? orderData.comment.substring(0, 50) + '...' : '(немає)');
            
            const response = await fetch(EMAIL_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
                cache: 'no-store',  // Запобігаємо кешуванню
                credentials: 'omit', // Не відправляємо cookies для CORS
                mode: 'cors'         // Явно вказуємо CORS режим
            });

            const result = await response.json();
            console.log('Відповідь від сервера:', result);
            
            if (result.success) {
                return { success: true, message: result.message || 'Email успішно відправлено' };
            } else {
                return { success: false, message: result.error || 'Помилка відправки' };
            }
        } catch (error) {
            console.error('Помилка відправки:', error);
            return { success: false, message: 'Помилка мережі: ' + error.message };
        }
    }

    // URL до JSON файлу з відправленими замовленнями
    const SENT_ORDERS_JSON_URL = 'https://e-oboi.com/sent_orders.json';
    
    // Кеш для JSON файлу (щоб не завантажувати його кожного разу)
    let sentOrdersCache = null;
    let sentOrdersCacheTime = 0;
    const CACHE_DURATION = 30000; // 30 секунд кешування

    // Функція для перевірки статусу замовлення (читає безпосередньо з JSON файлу)
    async function checkOrderStatus(orderNumber) {
        if (!orderNumber) {
            console.log('❌ checkOrderStatus: номер замовлення не вказано');
            return { isSent: false };
        }
        
        try {
            // Перевіряємо кеш
            const now = Date.now();
            if (sentOrdersCache && (now - sentOrdersCacheTime) < CACHE_DURATION) {
                console.log('🔍 Використовуємо кеш для перевірки статусу замовлення:', orderNumber);
            } else {
                // Завантажуємо JSON файл
                console.log('🔍 Завантаження sent_orders.json для перевірки статусу замовлення:', orderNumber);
                const response = await fetch(SENT_ORDERS_JSON_URL, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                    },
                    cache: 'no-store',  // Запобігаємо кешуванню
                    credentials: 'omit', // Не відправляємо cookies для CORS
                    mode: 'cors'         // Явно вказуємо CORS режим
                });
                
                console.log('🔍 Статус відповіді:', response.status, response.statusText);
                
                if (!response.ok) {
                    console.error('❌ Помилка HTTP при завантаженні JSON:', response.status);
                    const errorText = await response.text();
                    console.error('❌ Тіло помилки:', errorText);
                    // Якщо не вдалося завантажити, але є кеш - використовуємо його
                    if (sentOrdersCache) {
                        console.log('⚠️ Використовуємо старий кеш через помилку завантаження');
                    } else {
                        return { isSent: false };
                    }
                } else {
                    const jsonData = await response.json();
                    sentOrdersCache = jsonData;
                    sentOrdersCacheTime = now;
                    console.log('✅ JSON файл завантажено, кількість записів:', Object.keys(jsonData).length);
                }
            }
            
            // Перевіряємо, чи є замовлення в JSON
            // JSON має структуру: { "orderNumber": { "date": "...", "timestamp": ... } }
            const orderKeyString = String(orderNumber);
            const orderKeyInt = parseInt(orderNumber, 10);
            
            let orderData = null;
            
            // Перевіряємо обидва варіанти ключа (string і int)
            if (sentOrdersCache[orderKeyString]) {
                orderData = sentOrdersCache[orderKeyString];
            } else if (sentOrdersCache[orderKeyInt]) {
                orderData = sentOrdersCache[orderKeyInt];
            } else {
                // Також перевіряємо всі ключі (на випадок, якщо вони збережені в іншому форматі)
                for (const key in sentOrdersCache) {
                    const keyStr = String(key);
                    const keyInt = parseInt(key, 10);
                    if (keyStr === orderKeyString || keyInt === orderKeyInt) {
                        orderData = sentOrdersCache[key];
                        break;
                    }
                }
            }
            
            if (orderData) {
                const sentDate = orderData.date || orderData.timestamp || null;
                console.log('✅ Замовлення знайдено в JSON, дата відправки:', sentDate);
                return { isSent: true, sentDate: sentDate };
            } else {
                console.log('ℹ️ Замовлення не знайдено в JSON');
                return { isSent: false };
            }
        } catch (error) {
            console.error('❌ Помилка перевірки статусу замовлення:', error);
            // Якщо є кеш, використовуємо його
            if (sentOrdersCache) {
                console.log('⚠️ Використовуємо кеш через помилку');
                const orderKeyString = String(orderNumber);
                const orderKeyInt = parseInt(orderNumber, 10);
                if (sentOrdersCache[orderKeyString] || sentOrdersCache[orderKeyInt]) {
                    const orderData = sentOrdersCache[orderKeyString] || sentOrdersCache[orderKeyInt];
                    const sentDate = orderData.date || orderData.timestamp || null;
                    return { isSent: true, sentDate: sentDate };
                }
            }
            return { isSent: false };
        }
    }

    // Функція для зміни статусу замовлення на "В друці"
    async function changeOrderStatusToVDruci(statusBadge, row) {
        try {
            // Шукаємо контейнер .click-editable з attr-field-name="statusId"
            let clickEditable = null;
            
            // Спочатку шукаємо в рядку
            if (row) {
                clickEditable = row.querySelector('.click-editable[attr-field-name="statusId"]') ||
                              row.querySelector('div[attr-field-name="statusId"]');
            }
            
            // Якщо не знайшли в рядку, шукаємо через statusBadge
            if (!clickEditable) {
                let parent = statusBadge.parentElement;
                while (parent && parent !== document.body) {
                    if (parent.classList.contains('click-editable') && 
                        parent.getAttribute('attr-field-name') === 'statusId') {
                        clickEditable = parent;
                        break;
                    }
                    parent = parent.parentElement;
                }
            }
            
            // Якщо все ще не знайшли, шукаємо в рядку через td
            if (!clickEditable && row) {
                const td = row.querySelector('td.column-editable');
                if (td) {
                    clickEditable = td.querySelector('.click-editable[attr-field-name="statusId"]');
                }
            }
            
            if (!clickEditable) {
                console.warn('⚠️ Не знайдено .click-editable з attr-field-name="statusId"');
                return;
            }
            
            // Шукаємо кнопку редагування в .wrapper-editable-icon поруч з .click-editable
            // Кнопка знаходиться в тому ж td, що і .click-editable
            let editButton = null;
            
            // Шукаємо кнопку редагування різними способами
            // 1. Шукаємо в тому ж батьківському елементі (td) - для таблиці замовлень
            if (clickEditable) {
                const parentTd = clickEditable.closest('td');
                if (parentTd) {
                    editButton = parentTd.querySelector('.wrapper-editable-icon .click-editable-icon') ||
                               parentTd.querySelector('.click-editable-icon') ||
                               parentTd.querySelector('.editable-icon');
                }
            }
            
            // 2. Якщо не знайшли, шукаємо в рядку - для таблиці замовлень
            if (!editButton && row) {
                editButton = row.querySelector('.wrapper-editable-icon .click-editable-icon') ||
                           row.querySelector('.click-editable-icon');
            }
            
            // 3. Якщо не знайшли і це сторінка деталей (row === null), шукаємо в form-group
            if (!editButton && !row && clickEditable) {
                const formGroup = clickEditable.closest('.form-group');
                if (formGroup) {
                    // На сторінці деталей кнопка редагування може бути поруч з click-editable
                    // Шукаємо в батьківському контейнері form-group
                    editButton = formGroup.querySelector('.wrapper-editable-icon .click-editable-icon') ||
                               formGroup.querySelector('.click-editable-icon') ||
                               formGroup.querySelector('.editable-icon');
                }
            }
            
            // 4. Якщо все ще не знайшли, спробуємо знайти через батьківські елементи clickEditable
            if (!editButton && clickEditable) {
                let parent = clickEditable.parentElement;
                let searchDepth = 0;
                while (parent && parent !== document.body && searchDepth < 5) {
                    editButton = parent.querySelector('.wrapper-editable-icon .click-editable-icon') ||
                               parent.querySelector('.click-editable-icon') ||
                               parent.querySelector('.editable-icon');
                    if (editButton) break;
                    parent = parent.parentElement;
                    searchDepth++;
                }
            }
            
            if (!editButton) {
                // На сторінці деталей можна спробувати клікнути безпосередньо на click-editable
                if (!row) {
                    console.log('ℹ️ Кнопка редагування не знайдена, клікаємо безпосередньо на click-editable');
                    clickEditable.click();
                    await new Promise(resolve => setTimeout(resolve, 600));
                } else {
                    console.warn('⚠️ Не знайдено кнопку редагування (.click-editable-icon)');
                    return;
                }
            } else {
                // Клікаємо на кнопку редагування
                editButton.click();
                
                // Чекаємо, поки відкриється редактор
                await new Promise(resolve => setTimeout(resolve, 600));
            }
            
            // Тепер шукаємо select з id="statusField" або select з ng-model="term['statusId']"
            const statusSelect = document.querySelector('#statusField') ||
                               document.querySelector('select[ng-model*="statusId"]') ||
                               document.querySelector('.termform-editable-order-status select') ||
                               document.querySelector('select[p-select2][ng-model*="statusId"]');
            
            if (!statusSelect) {
                console.warn('⚠️ Не знайдено select для статусу після відкриття редактора');
                return;
            }
            
            // Знаходимо опцію "В друці" зі значенням "number:4"
            const options = statusSelect.querySelectorAll('option');
            let vdruciOption = null;
            
            for (const option of options) {
                const optionText = option.textContent.trim();
                const optionValue = option.value;
                if ((optionText === 'В друці' || optionText.toLowerCase().includes('в друці')) ||
                    optionValue === 'number:4' || optionValue === '4') {
                    vdruciOption = option;
                    break;
                }
            }
            
            if (!vdruciOption) {
                console.warn('⚠️ Не знайдено опцію "В друці" в select');
                return;
            }
            
            // Встановлюємо значення select
            statusSelect.value = vdruciOption.value;
            
            // Тригеримо зміну для AngularJS
            const changeEvent = new Event('change', { bubbles: true, cancelable: true });
            statusSelect.dispatchEvent(changeEvent);
            
            // Також тригеримо input event
            const inputEvent = new Event('input', { bubbles: true, cancelable: true });
            statusSelect.dispatchEvent(inputEvent);
            
            // Якщо є AngularJS, викликаємо $apply
            if (window.angular) {
                try {
                    const scope = angular.element(statusSelect).scope();
                    if (scope) {
                        scope.$apply();
                    }
                } catch (e) {
                    console.log('Не вдалося викликати $apply:', e);
                }
            }
            
            // Викликаємо updateReference() якщо він є
            try {
                const scope = angular.element(statusSelect).scope();
                if (scope && typeof scope.updateReference === 'function') {
                    scope.updateReference();
                }
            } catch (e) {
                console.log('Не вдалося викликати updateReference:', e);
            }
            
            // Чекаємо трохи
            await new Promise(resolve => setTimeout(resolve, 200));
            
            // Оновлюємо select2 відображення, якщо він використовується
            if (statusSelect.classList.contains('select2-hidden-accessible')) {
                // Знаходимо select2 container
                const select2Container = document.querySelector('.select2-container.select2-container--open') ||
                                       document.querySelector('.select2-container');
                if (select2Container) {
                    // Клікаємо на select2 для відкриття dropdown (якщо ще не відкритий)
                    const select2Selection = select2Container.querySelector('.select2-selection');
                    if (select2Selection && !select2Container.classList.contains('select2-container--open')) {
                        select2Selection.click();
                        await new Promise(resolve => setTimeout(resolve, 300));
                    }
                    
                    // Знаходимо опцію "В друці" в dropdown
                    const select2Dropdown = document.querySelector('.select2-dropdown');
                    if (select2Dropdown) {
                        const select2Options = select2Dropdown.querySelectorAll('.select2-results__option');
                        for (const option of select2Options) {
                            const optionText = option.textContent.trim();
                            if (optionText === 'В друці' || optionText.toLowerCase().includes('в друці')) {
                                option.click();
                                await new Promise(resolve => setTimeout(resolve, 300));
                                break;
                            }
                        }
                    }
                }
            }
            
            // Оновлюємо текст статусу
            statusBadge.textContent = 'В друці';
            
            console.log('✅ Статус замовлення змінено на "В друці"');
            
        } catch (error) {
            console.error('❌ Помилка зміни статусу:', error);
        }
    }

    // Функція для створення кнопки "Подати в друк"
    async function createSendToPrintButton(row, statusBadge) {
        // Перевіряємо, чи row не null
        if (!row) {
            console.warn('⚠️ row є null в createSendToPrintButton');
            return;
        }
        
        // Перевіряємо, чи вже додали кнопку
        if (row.querySelector('.send-to-print-btn')) {
            return;
        }
        
        // Перевіряємо наявність файлу перед показом кнопки
        const tempData = await collectOrderData(row);
        if (!tempData.fileLink || tempData.fileLink.trim() === '') {
            console.log('ℹ️ Файл не знайдено, кнопка "Подати" не відображається');
            return;
        }
        console.log('✅ Файл знайдено:', tempData.fileLink);

        // Якщо statusBadge не передано, шукаємо його
        if (!statusBadge) {
            if (row) {
                statusBadge = row.querySelector('.status-badge') ||
                             row.querySelector('span.status-badge') ||
                             row.querySelector('[class*="status"]');
            }
        }
        
        if (!statusBadge) return;

        const statusText = statusBadge.textContent.trim();
        // Перевіряємо статус "Готуємо" для показу кнопки "Подати"
        // Або "В друці" для показу кнопки "Відправлено"
        const isGotuemo = statusText === 'Готуємо' || statusText.toLowerCase().includes('готуємо');
        const isVDruci = statusText === 'В друці' || statusText.toLowerCase().includes('в друці');
        
        if (!isGotuemo && !isVDruci) return;

        // Перевіряємо, чи вибрано відправника (виробництво)
        // Якщо відправник не вибраний (порожній або "---"), не показуємо кнопку
        const senderElement = (row && row.querySelector('div[attr-field-name="ord_delivery_sender"]')) ||
                              (row && row.querySelector('div.stylized-select[attr-field-name="ord_delivery_sender"]'));
        
        if (senderElement) {
            const senderText = senderElement.textContent.trim();
            // Перевіряємо, чи відправник порожній або "---"
            if (!senderText || senderText === '' || senderText === '---' || senderText.toLowerCase() === '---') {
                console.log('ℹ️ Відправник (виробництво) не вибрано, кнопка "Подати" не відображається');
                return;
            }
            console.log('✅ Відправник (виробництво) вибрано:', senderText);
        } else {
            // Якщо елемент не знайдено, також не показуємо кнопку (на всяк випадок)
            console.log('⚠️ Елемент відправника (виробництва) не знайдено, кнопка "Подати" не відображається');
            return;
        }

        // Знаходимо номер замовлення для перевірки статусу
        const orderElement = document.querySelector('h1.left.ng-binding.ng-scope');
        let orderNumber = '';
        if (orderElement) {
            const orderText = orderElement.textContent || '';
            const orderNumberMatch = orderText.match(/\d+/);
            if (orderNumberMatch) {
                orderNumber = orderNumberMatch[0];
            }
        }
        
        // Якщо не знайшли в h1, шукаємо в рядку
        if (!orderNumber && row) {
            const idElementInRow = row.querySelector('div[attr-field-name="id"]');
            if (idElementInRow) {
                const idText = idElementInRow.textContent.trim().replace(/\s+/g, '');
                if (idText && idText.length >= 3 && idText.length < 13 && /^\d+$/.test(idText)) {
                    orderNumber = idText;
                }
            }
        }

        // Перевіряємо статус замовлення
        let orderStatus = { isSent: false };
        if (orderNumber) {
            orderStatus = await checkOrderStatus(orderNumber);
        }

        // Створюємо контейнер для кнопки
        const buttonContainer = document.createElement('div');
        buttonContainer.style.marginTop = '5px';

        // Створюємо кнопку
        const button = document.createElement('button');
        button.className = 'send-to-print-btn btn btn-sm';
        
        // Визначаємо, яку кнопку показувати залежно від статусу та стану відправки
        const currentStatusText = statusBadge.textContent.trim();
        const isVDruciCurrent = currentStatusText === 'В друці' || currentStatusText.toLowerCase().includes('в друці');
        
        // ВАЖЛИВО: Якщо замовлення вже відправлено, завжди показуємо "Відправлено" незалежно від статусу
        // Якщо статус "Готуємо" або "В друці" і не відправлене - показуємо "Подати"
        if (orderStatus.isSent) {
            button.textContent = 'Відправлено';
            button.style.backgroundColor = '#37a3df';
            button.style.borderColor = '#37a3df';
            button.style.color = '#fff';
            button.disabled = false; // Дозволяємо натискання
            button.style.cursor = 'pointer';
            button.style.opacity = '1';
            
            // Додаємо підказку з датою відправки
            if (orderStatus.sentDate) {
                button.title = `Відправлено: ${orderStatus.sentDate}`;
            }
        } else {
            // Для статусу "Готуємо" або "В друці" (якщо ще не відправлено) - показуємо "Подати"
            button.textContent = 'Подати';
            button.style.backgroundColor = '#b9b9b9';
            button.style.borderColor = '#b9b9b9';
            button.style.color = '#fff';
            button.style.cursor = 'pointer';
        }
        
        button.style.marginTop = '5px';
        button.style.padding = '2px 5px';
        button.style.fontSize = '12px';
        button.style.borderRadius = '4px';
        button.style.border = '1px solid';

        // Додаємо обробник події для обох випадків
        button.addEventListener('click', async function(e) {
            e.preventDefault();
            e.stopPropagation();

            // Зберігаємо початковий стан кнопки для відновлення при скасуванні
            const originalButtonText = button.textContent;
            const originalButtonBg = button.style.backgroundColor;
            const originalButtonBorder = button.style.borderColor;

            // Блокуємо кнопку під час відправки
            button.disabled = true;
            button.textContent = '⏳ Збір даних...';
            button.style.opacity = '0.6';

            try {
                // Збираємо дані про замовлення (БЕЗ завантаження PDF)
                const orderData = await collectOrderData(row);

                // Перевіряємо, чи є ТТН
                const hasTTN = orderData.ttn && orderData.ttn.trim() !== '';
                
                // Оновлюємо статус замовлення перед перевіркою (на випадок, якщо статус змінився)
                if (orderData.orderNumber) {
                    const currentStatus = await checkOrderStatus(orderData.orderNumber);
                    orderStatus.isSent = currentStatus.isSent;
                }
                
                // Якщо замовлення вже відправлене, питаємо про повторну відправку
                if (orderStatus.isSent) {
                    let resendMessage = 'Відправити повторно?';
                    if (!hasTTN) {
                        resendMessage = 'Відправити повторно без ТТН?';
                    }
                    const resend = confirm(resendMessage);
                    if (!resend) {
                        // Повертаємо кнопку в початковий стан
                        button.disabled = false;
                        button.textContent = originalButtonText;
                        button.style.backgroundColor = originalButtonBg;
                        button.style.borderColor = originalButtonBorder;
                        button.style.opacity = '1';
                        return;
                    }
                } else {
                    // Якщо замовлення не відправлене, питаємо про відправку
                    let confirmMessage = 'Чи готові подати замовлення?';
                    if (!hasTTN) {
                        confirmMessage = 'Подати замовлення без ТТН?';
                    }
                    const confirmSend = confirm(confirmMessage);
                    if (!confirmSend) {
                        // Повертаємо кнопку в початковий стан
                        button.disabled = false;
                        button.textContent = originalButtonText;
                        button.style.backgroundColor = originalButtonBg;
                        button.style.borderColor = originalButtonBorder;
                        button.style.opacity = '1';
                        return;
                    }
                }

                // Завантажуємо PDF тільки якщо є ТТН (після підтвердження відправки)
                if (hasTTN && orderData.ttn) {
                    // ВАЖЛИВО: Перегенеруємо посилання на PDF з правильним типом відповідно до відправника
                    const senderInfo = getSenderInfo(row);
                    const formIdMatch = window.location.href.match(/[?&]formId=(\d+)/);
                    const formId = formIdMatch ? formIdMatch[1] : '1';
                    const novaPoshtaId = '7';
                    const pdfType = senderInfo.pdfPathType; // 'print-marking' для Харків, 'print' для Київ
                    
                    // Завжди генеруємо повне посилання на PDF з правильним типом
                    orderData.pdfHref = `https://e-oboi.salesdrive.me/nova-poshta/${pdfType}/${orderData.ttn}/${novaPoshtaId}/?formId=${formId}`;
                    console.log('✅ Перегенеровано посилання на PDF:', orderData.pdfHref, '(тип:', pdfType + ', відправник:', senderInfo.name + ')');
                    
                    button.textContent = '⏳ Завантаження PDF...';
                    await loadPDFForOrder(orderData);
                } else {
                    // Якщо ТТН немає, очищаємо PDF дані
                    orderData.ttnPdfBase64 = null;
                    orderData.ttnPdfFileName = '';
                    console.log('⚠️ ТТН не знайдено, відправляємо без PDF вкладення');
                }

                // Відправляємо на email
                button.textContent = '⏳ Відправляється...';
                const result = await sendOrderToEmail(orderData);

                // Показуємо результат
                if (result.success) {
                    // Змінюємо статус замовлення на "В друці" (якщо статус був "Готуємо")
                    const currentStatusTextAfter = statusBadge.textContent.trim();
                    const isGotuemoAfter = currentStatusTextAfter === 'Готуємо' || currentStatusTextAfter.toLowerCase().includes('готуємо');
                    if (isGotuemoAfter) {
                        await changeOrderStatusToVDruci(statusBadge, row);
                    }
                    
                    // Інвалідуємо кеш статусу замовлення, щоб перезавантажити актуальні дані
                    sentOrdersCache = null;
                    sentOrdersCacheTime = 0;
                    
                    // Чекаємо трохи, щоб сервер встиг оновити JSON файл
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    
                    // Перевіряємо статус замовлення після відправки
                    if (orderData.orderNumber) {
                        const updatedStatus = await checkOrderStatus(orderData.orderNumber);
                        orderStatus.isSent = updatedStatus.isSent;
                        console.log('✅ Статус замовлення оновлено після відправки:', updatedStatus);
                    }
                    
                    button.textContent = 'Відправлено';
                    button.style.backgroundColor = '#37a3df';
                    button.style.borderColor = '#37a3df';
                    button.disabled = false; // Дозволяємо повторну відправку
                    button.style.cursor = 'pointer';
                    button.style.opacity = '1';
                    
                    // Формуємо повідомлення про вкладення
                    let successMessage = 'Email успішно відправлено на виробництво!';
                    if (orderData.ttnPdfFileName) {
                        successMessage += `\nPDF маркування ТТН додано як вкладення: ${orderData.ttnPdfFileName}`;
                    }
                    
                    // Показуємо повідомлення
                    showNotification(successMessage, 'success');
                    
                    // Додаємо підказку з датою відправки
                    const sentDate = new Date().toLocaleString('uk-UA');
                    button.title = `Відправлено: ${sentDate}`;
                } else {
                    button.textContent = '❌ Помилка';
                    button.style.backgroundColor = '#dc3545';
                    button.style.borderColor = '#dc3545';
                    
                    showNotification('Помилка відправки: ' + result.message, 'error');
                    
                    // Через 3 секунди повертаємо кнопку в правильний стан
                    setTimeout(() => {
                        if (orderStatus.isSent) {
                            button.textContent = 'Відправлено';
                            button.style.backgroundColor = '#37a3df';
                            button.style.borderColor = '#37a3df';
                        } else {
                            button.textContent = 'Подати';
                            button.style.backgroundColor = '#b9b9b9';
                            button.style.borderColor = '#b9b9b9';
                        }
                        button.disabled = false;
                        button.style.opacity = '1';
                    }, 3000);
                }
            } catch (error) {
                console.error('Помилка при зборі даних або відправці:', error);
                button.textContent = '❌ Помилка';
                button.style.backgroundColor = '#dc3545';
                button.style.borderColor = '#dc3545';
                
                showNotification('Помилка: ' + error.message, 'error');
                
                // Повертаємо кнопку в правильний стан залежно від статусу
                setTimeout(() => {
                    if (orderStatus.isSent) {
                        button.textContent = 'Відправлено';
                        button.style.backgroundColor = '#37a3df';
                        button.style.borderColor = '#37a3df';
                    } else {
                        button.textContent = 'Подати';
                        button.style.backgroundColor = '#b9b9b9';
                        button.style.borderColor = '#b9b9b9';
                    }
                    button.disabled = false;
                    button.style.opacity = '1';
                }, 3000);
            }
        });

        buttonContainer.appendChild(button);
        
        // Вставляємо кнопку після статусу
        statusBadge.parentNode.insertBefore(buttonContainer, statusBadge.nextSibling);
    }

    // Функція для показу повідомлень
    function showNotification(message, type) {
        // Видаляємо попереднє повідомлення, якщо є
        const existingNotification = document.querySelector('.send-to-print-notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = 'send-to-print-notification';
        notification.textContent = message;
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.padding = '15px 20px';
        notification.style.borderRadius = '5px';
        notification.style.zIndex = '999999';
        notification.style.fontSize = '14px';
        notification.style.fontWeight = 'bold';
        notification.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        notification.style.maxWidth = '400px';
        notification.style.wordWrap = 'break-word';

        if (type === 'success') {
            notification.style.backgroundColor = '#d4edda';
            notification.style.color = '#155724';
            notification.style.border = '1px solid #c3e6cb';
        } else {
            notification.style.backgroundColor = '#f8d7da';
            notification.style.color = '#721c24';
            notification.style.border = '1px solid #f5c6cb';
        }

        document.body.appendChild(notification);

        // Автоматично прибираємо через 5 секунд
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.5s';
            setTimeout(() => notification.remove(), 500);
        }, 5000);
    }

    // Флаг для відстеження обробки сторінки деталей
    let isProcessingDetailsPage = false;
    let detailsPageProcessed = false;
    let lastProcessedUrl = window.location.href;

    // Функція для обробки всіх рядків зі статусом "В друці"
    // Функція для перевірки, чи сторінка готова до обробки
    function isPageReady() {
        // Перевіряємо, чи завантажився основний контент
        const bodyContent = document.body && document.body.innerHTML.trim().length > 100;
        const hasAngularApp = document.querySelector('[ng-app]') !== null || 
                             document.querySelector('[ng-controller]') !== null ||
                             document.querySelector('[ng-view]') !== null ||
                             document.querySelector('[ng-repeat]') !== null;
        return bodyContent && hasAngularApp;
    }

    async function processRowsWithStatus() {
        // Перевіряємо, чи сторінка готова до обробки
        if (!isPageReady()) {
            console.log('⏳ Сторінка ще не готова, чекаємо...');
            // Чекаємо трохи і повторюємо спробу
            setTimeout(() => {
                processRowsWithStatus().catch(error => {
                    console.error('Помилка в processRowsWithStatus (retry after wait):', error);
                });
            }, 500);
            return;
        }
        
        // Шукаємо всі рядки в таблиці замовлень
        const rows = document.querySelectorAll('tr.price-to-order, tr[ng-repeat*="order"], tr[ng-repeat*="item"]');
        
        // Використовуємо for...of для підтримки await
        for (const row of rows) {
            // Перевіряємо, чи вже обробляли цей рядок
            const rowId = row.getAttribute('data-order-id') || 
                         row.querySelector('div[attr-field-name="id"]')?.textContent?.trim() ||
                         row.getAttribute('ng-repeat') ||
                         row.className + row.textContent.substring(0, 50);
            
            if (processedRows.has(rowId)) {
                continue;
            }

            // Шукаємо статус в різних місцях
            const statusBadge = row.querySelector('.status-badge') ||
                               row.querySelector('span.status-badge') ||
                               row.querySelector('td .badge') ||
                               row.querySelector('[class*="status"]');
            
            if (statusBadge) {
                const statusText = statusBadge.textContent.trim();
                const isGotuemo = statusText === 'Готуємо' || statusText.toLowerCase().includes('готуємо');
                const isVDruci = statusText === 'В друці' || statusText.toLowerCase().includes('в друці');
                
                if (isGotuemo || isVDruci) {
                    await createSendToPrintButton(row, statusBadge);
                    processedRows.add(rowId);
                }
            }
        }

        // Також перевіряємо окремі елементи статусу, якщо вони не в рядках таблиці
        const statusBadges = document.querySelectorAll('.status-badge:not(.send-to-print-processed)');
        for (const badge of statusBadges) {
            const statusText = badge.textContent.trim();
            const isGotuemo = statusText === 'Готуємо' || statusText.toLowerCase().includes('готуємо');
            const isVDruci = statusText === 'В друці' || statusText.toLowerCase().includes('в друці');
            
            if (isGotuemo || isVDruci) {
                const row = badge.closest('tr') || badge.closest('div') || badge.parentElement;
                if (row && !row.querySelector('.send-to-print-btn')) {
                    await createSendToPrintButton(row, badge);
                    badge.classList.add('send-to-print-processed');
                }
            }
        }

        // Обробка сторінки деталей замовлення (форма зі статусом)
        // Перевіряємо, чи вже обробляли сторінку деталей, щоб уникнути подвійної обробки
        if (!isProcessingDetailsPage && !detailsPageProcessed) {
            isProcessingDetailsPage = true;
            try {
                await processOrderDetailsPage();
                detailsPageProcessed = true;
            } catch (error) {
                console.error('Помилка обробки сторінки деталей:', error);
            } finally {
                isProcessingDetailsPage = false;
            }
        }
    }

    // Функція для очікування появи елемента
    async function waitForElement(selector, timeout = 5000, interval = 100) {
        const startTime = Date.now();
        while (Date.now() - startTime < timeout) {
            const element = document.querySelector(selector);
            if (element) {
                return element;
            }
            await new Promise(resolve => setTimeout(resolve, interval));
        }
        return null;
    }

    // ОПТИМІЗОВАНА функція для швидкої перевірки файлу через DOM
    function checkFileExists() {
        const fajlElement = document.querySelector('div[attr-field-name="fajl"]');
        if (!fajlElement) return false;
        
        const hasEmpty = fajlElement.classList.contains('ph-is-empty') || fajlElement.querySelector('.ph-is-empty');
        const spanElement = fajlElement.querySelector('span');
        const hasLink = (spanElement && (spanElement.querySelector('a.link-field') || spanElement.querySelector('a[href]'))) ||
                       fajlElement.querySelector('a.link-field') || fajlElement.querySelector('a[href]');
        
        return !!hasLink && !hasEmpty;
    }
    
    // ОПТИМІЗОВАНА функція для перевірки всіх умов
    function checkAllConditions() {
        // Перевірка файлу
        const hasFile = checkFileExists();
        
        // Перевірка статусу
        const statusBadge = document.querySelector('.status-badge');
        const statusOk = statusBadge && (statusBadge.textContent.trim() === 'Готуємо' || 
                                         statusBadge.textContent.trim() === 'В друці' ||
                                         statusBadge.textContent.trim().toLowerCase().includes('готуємо') ||
                                         statusBadge.textContent.trim().toLowerCase().includes('в друці'));
        
        // Перевірка відправника (використовуємо ту саму логіку, що і в getSenderInfo)
        let senderElement = null;
        
        // Спочатку шукаємо через contact-wrapper-inner (найчастіше там знаходиться)
        const contactWrapper = document.querySelector('.contact-wrapper-inner');
        if (contactWrapper) {
            senderElement = contactWrapper.querySelector('div[attr-field-name="idEntity"]') ||
                          contactWrapper.querySelector('div.stylized-select[attr-field-name="idEntity"]');
        }
        
        // Якщо не знайшли, шукаємо через form-group з лейблом "Відправник"
        if (!senderElement) {
            const formGroups = document.querySelectorAll('.form-group');
            for (const formGroup of formGroups) {
                const label = formGroup.querySelector('label.text-right');
                if (label && label.textContent.trim() === 'Відправник') {
                    senderElement = formGroup.querySelector('div[attr-field-name="idEntity"]') ||
                                  formGroup.querySelector('div.stylized-select[attr-field-name="idEntity"]');
                    if (senderElement) break;
                }
            }
        }
        
        // Якщо все ще не знайшли, шукаємо напряму
        if (!senderElement) {
            senderElement = document.querySelector('div[attr-field-name="idEntity"]') ||
                           document.querySelector('div.stylized-select[attr-field-name="idEntity"]') ||
                           document.querySelector('.stylized-select[attr-field-name="idEntity"]');
        }
        
        const senderOk = senderElement && senderElement.textContent.trim() !== '' && 
                        senderElement.textContent.trim() !== '---' &&
                        senderElement.textContent.trim().toLowerCase() !== '---' &&
                        !senderElement.textContent.trim().includes('ph-is-empty');
        
        return { hasFile, statusOk: !!statusOk, senderOk: !!senderOk };
    }
    
    // ПРОСТА функція для перевірки всіх умов та оновлення кнопки
    // Викликається при будь-яких змінах на сторінці деталей
    async function checkAndUpdateButton() {
        // Перевіряємо, чи це сторінка деталей
        if (!window.location.href.includes('#/order/update/') && !window.location.href.includes('#/order/create/')) {
            return;
        }
        
        if (isProcessingDetailsPage) {
            return; // Не виконуємо під час обробки
        }
        
        try {
            // Даємо трохи часу, щоб DOM встиг оновитися (особливо для відправника)
            await new Promise(resolve => setTimeout(resolve, 300));
            
            const conditions = checkAllConditions();
            
            // Отримуємо номер замовлення для перевірки статусу
            const orderElement = document.querySelector('h1.left.ng-binding.ng-scope');
            let orderNumber = '';
            if (orderElement) {
                const orderText = orderElement.textContent || '';
                const orderNumberMatch = orderText.match(/\d+/);
                if (orderNumberMatch) {
                    orderNumber = orderNumberMatch[0];
                }
            }
            
            // Перевіряємо статус замовлення
            let orderStatus = { isSent: false };
            if (orderNumber) {
                orderStatus = await checkOrderStatus(orderNumber);
            }
            
            // Показуємо кнопку, якщо всі умови виконані АБО замовлення вже відправлене
            const shouldShow = (conditions.hasFile && conditions.statusOk && conditions.senderOk) || orderStatus.isSent;
            
            console.log('🔍 checkAndUpdateButton: файл=', conditions.hasFile, 'статус=', conditions.statusOk, 'відправник=', conditions.senderOk, 'відправлено=', orderStatus.isSent, 'показувати=', shouldShow);
            
            const existingButton = document.querySelector('.send-to-print-btn');
            const printFormGroup = document.getElementById('send-to-print-form-group');
            
            if (shouldShow) {
                // Всі умови виконані або замовлення вже відправлене - показуємо кнопку
                console.log('✅ Умови виконані або замовлення відправлене, показуємо кнопку');
                if (printFormGroup) {
                    printFormGroup.style.display = '';
                }
                if (!existingButton && !isProcessingDetailsPage) {
                    detailsPageProcessed = false;
                    await processOrderDetailsPage();
                } else if (existingButton) {
                    // Оновлюємо існуючу кнопку, якщо замовлення вже відправлене
                    if (orderStatus.isSent) {
                        existingButton.textContent = 'Відправлено';
                        existingButton.style.backgroundColor = '#37a3df';
                        existingButton.style.borderColor = '#37a3df';
                        existingButton.style.color = '#fff';
                        existingButton.disabled = false;
                        existingButton.style.cursor = 'pointer';
                        existingButton.style.opacity = '1';
                        if (orderStatus.sentDate) {
                            existingButton.title = `Відправлено: ${orderStatus.sentDate}`;
                        }
                    } else {
                        // Якщо не відправлене, перевіряємо умови
                        if (conditions.hasFile && conditions.statusOk && conditions.senderOk) {
                            existingButton.textContent = 'Подати';
                            existingButton.style.backgroundColor = '#b9b9b9';
                            existingButton.style.borderColor = '#b9b9b9';
                            existingButton.style.color = '#fff';
                            existingButton.disabled = false;
                            existingButton.style.cursor = 'pointer';
                            existingButton.style.opacity = '1';
                            existingButton.title = '';
                        }
                    }
                }
            } else {
                // Умови не виконані - ховаємо кнопку
                console.log('❌ Умови не виконані, ховаємо кнопку');
                if (printFormGroup) {
                    printFormGroup.style.display = 'none';
                }
            }
        } catch (error) {
            console.error('❌ Помилка в checkAndUpdateButton:', error);
        }
    }
    
    // Робимо функцію доступною глобально
    window.checkAndUpdateButton = checkAndUpdateButton;
    
    // Функція для налаштування спостерігача (залишаємо для сумісності)
    function setupFajlObserver() {
        // Перевіряємо, чи вже створено Observer (щоб не створювати дублікати)
        if (window.fajlObserverSetup) {
            return;
        }
        window.fajlObserverSetup = true;
        
        // Знаходимо елемент fajl
        const fajlElement = document.querySelector('div[attr-field-name="fajl"]');
        if (fajlElement) {
            console.log('✅ Знайдено елемент fajl для MutationObserver');
            
            const fajlObserver = new MutationObserver(async (mutations) => {
                // Перевіряємо, чи змінився вміст поля fajl
                let shouldCheck = false;
                for (const mutation of mutations) {
                    // Відстежуємо всі зміни: додавання/видалення елементів, зміни атрибутів, зміни тексту
                    if (mutation.type === 'childList' || mutation.type === 'attributes' || mutation.type === 'characterData') {
                        shouldCheck = true;
                        console.log('🔄 Виявлено зміну типу:', mutation.type, 'в полі fajl');
                        break;
                    }
                }
                
                if (shouldCheck) {
                    // Дебаунс - чекаємо 800мс після останньої зміни (збільшено для стабільності)
                    // Це дає час AngularJS оновити DOM
                    clearTimeout(fajlObserver.timeout);
                    fajlObserver.timeout = setTimeout(checkAndUpdateButton, 800);
                }
            });
            
            // Спостерігаємо за змінами в полі fajl та всіх дочірніх елементах
            try {
                fajlObserver.observe(fajlElement, {
                    childList: true,
                    subtree: true,
                    attributes: true,
                    attributeOldValue: false,
                    characterData: true
                });
                console.log('✅ MutationObserver активовано для поля fajl');
            } catch (error) {
                console.warn('⚠️ Помилка при створенні MutationObserver для fajl:', error);
            }
            
            // Також додаємо обробник подій для кліку на кнопку редагування
            const editButton = fajlElement.querySelector('.uri-edit-icon, .click-editable-icon, .glyphicon-edit');
            if (editButton) {
                editButton.addEventListener('click', () => {
                    console.log('🖱️ Клік на кнопку редагування fajl, чекаємо зміни...');
                    // Чекаємо більше, щоб AngularJS встиг оновити DOM після закриття редактора
                    setTimeout(checkAndUpdateButton, 1500);
                });
            }
            
            // Спостерігаємо за змінами в батьківському елементі теж
            const clickEditable = fajlElement.closest('.click-editable');
            if (clickEditable) {
                const parentObserver = new MutationObserver(async (mutations) => {
                    let shouldCheck = false;
                    for (const mutation of mutations) {
                        if (mutation.type === 'childList' || mutation.type === 'attributes') {
                            shouldCheck = true;
                            break;
                        }
                    }
                        if (shouldCheck) {
                            clearTimeout(parentObserver.timeout);
                            parentObserver.timeout = setTimeout(checkAndUpdateButton, 800);
                        }
                });
                try {
                    parentObserver.observe(clickEditable, {
                        childList: true,
                        subtree: true,
                        attributes: true
                    });
                    console.log('✅ Додатковий MutationObserver активовано для батьківського елемента fajl');
                } catch (error) {
                    console.warn('⚠️ Помилка при створенні додаткового MutationObserver:', error);
                }
            }
            
            // Періодична перевірка (кожні 2 секунди)
            const periodicCheck = setInterval(() => {
                const currentFajlElement = document.querySelector('div[attr-field-name="fajl"]');
                if (!currentFajlElement || !currentFajlElement.isConnected) {
                    clearInterval(periodicCheck);
                    return;
                }
                
                const hasEmpty = currentFajlElement.querySelector('.ph-is-empty');
                const hasLink = currentFajlElement.querySelector('a.link-field');
                const printFormGroup = document.getElementById('send-to-print-form-group');
                
                if (printFormGroup) {
                    const shouldShow = !hasEmpty && hasLink;
                    const isVisible = printFormGroup.style.display !== 'none';
                    
                    if (shouldShow && !isVisible) {
                        console.log('🔄 Періодична перевірка: файл знайдено, показуємо кнопку');
                        checkAndUpdateButton();
                    } else if (!shouldShow && isVisible) {
                        console.log('🔄 Періодична перевірка: файл відсутній, приховуємо кнопку');
                        checkAndUpdateButton();
                    }
                }
            }, 2000);
        } else {
            console.log('ℹ️ Елемент fajl не знайдено для MutationObserver');
        }
    }
    
    // Функція для обробки сторінки деталей замовлення
    async function processOrderDetailsPage() {
        // ЗАХИСТ ВІД ДУБЛІКАТІВ: перевіряємо флаг обробки
        if (isProcessingDetailsPage) {
            console.log('ℹ️ processOrderDetailsPage вже виконується, пропускаємо');
            return;
        }
        
        // Встановлюємо флаг обробки одразу
        isProcessingDetailsPage = true;
        
        try {
            // ЗАХИСТ ВІД ДУБЛІКАТІВ: перевіряємо, чи кнопка вже існує
            const existingButtonCheck = document.querySelector('.send-to-print-btn');
            const existingFormGroupCheck = document.getElementById('send-to-print-form-group');
            if (existingButtonCheck && existingFormGroupCheck) {
                console.log('ℹ️ Кнопка вже існує, не створюємо дублікат');
                return; // Не створюємо дублікат
            }
            
            // Додаткова перевірка: якщо є кнопки, але немає form-group, видаляємо їх
            const allButtons = document.querySelectorAll('.send-to-print-btn');
            if (allButtons.length > 0 && !existingFormGroupCheck) {
                console.log('⚠️ Знайдено кнопки без form-group, видаляємо їх');
                allButtons.forEach(btn => {
                    const container = btn.parentElement;
                    if (container && container.style.marginTop === '5px') {
                        container.remove();
                    } else {
                        btn.remove();
                    }
                });
            }
            
            // Додаткова перевірка: чекаємо, поки сторінка повністю завантажиться
        // Перевіряємо наявність основних елементів перед початком обробки
        let pageReady = false;
        for (let i = 0; i < 10; i++) {
            const hasStatus = document.querySelector('div[attr-field-name="statusId"]') !== null;
            const hasBody = document.body && document.body.innerHTML.trim().length > 1000;
            if (hasStatus && hasBody) {
                pageReady = true;
                break;
            }
            await new Promise(resolve => setTimeout(resolve, 200));
        }
        
        if (!pageReady) {
            console.log('⏳ Сторінка ще не готова, чекаємо...');
            // Чекаємо ще трохи
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        // Спочатку чекаємо, поки з'явиться елемент зі статусом (з різними селекторами)
        // Використовуємо функцію очікування, щоб не пропустити елемент, якщо він завантажується пізніше
        // Збільшуємо таймаут до 5 секунд для AngularJS навігації
        let statusContainer = await waitForElement('div.stylized-select[attr-field-name="statusId"]', 5000) ||
                             await waitForElement('div.click-editable[attr-field-name="statusId"]', 5000) ||
                             await waitForElement('div[attr-field-name="statusId"]', 5000);
        
        // Якщо не знайшли, шукаємо через form-group з лейблом "Статус" (з кількома спробами)
        if (!statusContainer) {
            // Чекаємо, поки з'являться form-group (з кількома спробами)
            for (let attempt = 0; attempt < 5; attempt++) {
                await new Promise(resolve => setTimeout(resolve, 300));
                const formGroups = document.querySelectorAll('.form-group');
                for (const formGroup of formGroups) {
                    const label = formGroup.querySelector('label.text-right');
                    if (label && label.textContent.trim() === 'Статус') {
                        statusContainer = formGroup.querySelector('div[attr-field-name="statusId"]');
                        if (statusContainer) {
                            console.log('✅ Знайдено статус через form-group з лейблом "Статус" (спроба ' + (attempt + 1) + ')');
                            break;
                        }
                    }
                }
                if (statusContainer) break;
            }
        }
        
        // Якщо все ще не знайшли, шукаємо через контейнер форми
        if (!statusContainer) {
            const formContainer = await waitForElement('.wrapper-inner-form-column-container', 3000) ||
                                await waitForElement('.order-edit-fields-group .wrapper-inner-form-column-container', 3000);
            
            if (formContainer) {
                statusContainer = formContainer.querySelector('div[attr-field-name="statusId"]');
            }
        }
        
        if (!statusContainer) {
            console.log('ℹ️ Елемент статусу не знайдено на сторінці деталей після очікування');
            // Додаткова діагностика
            const allStatusElements = document.querySelectorAll('[attr-field-name="statusId"]');
            console.log('Знайдено елементів з attr-field-name="statusId":', allStatusElements.length);
            if (allStatusElements.length > 0) {
                console.log('Перший знайдений елемент:', allStatusElements[0]);
            }
            return;
        }
        
        console.log('✅ Знайдено елемент статусу на сторінці деталей');

        // Перевіряємо, чи кнопка вже існує
        if (document.querySelector('.send-to-print-btn')) {
            return;
        }
        
        const existingPrintFormGroup = document.getElementById('send-to-print-form-group');

        // Знаходимо status-badge
        const statusBadge = statusContainer.querySelector('.status-badge');
        if (!statusBadge) {
            console.log('ℹ️ Status-badge не знайдено');
            return;
        }

        const statusText = statusBadge.textContent.trim();
        const isGotuemo = statusText === 'Готуємо' || statusText.toLowerCase().includes('готуємо');
        const isVDruci = statusText === 'В друці' || statusText.toLowerCase().includes('в друці');
        
        if (!isGotuemo && !isVDruci) {
            console.log('ℹ️ Статус не "Готуємо" або "В друці":', statusText);
            return;
        }

        // Перевіряємо наявність файлу (використовуємо оптимізовану функцію)
        const hasFile = checkFileExists();
        
        if (!hasFile) {
            if (existingPrintFormGroup) {
                existingPrintFormGroup.style.display = 'none';
            }
            setupFajlObserver(); // Створюємо Observer для відстеження додавання файлу
            return;
        }

        // Перевіряємо, чи вибрано відправника (виробництво) на сторінці деталей
        // На детальній сторінці відправник має attr-field-name="idEntity"
        // Використовуємо простий цикл з перевірками та затримками (надійніше, ніж MutationObserver)
        let senderElement = null;
        const maxAttempts = 20; // 20 спроб по 300мс = 6 секунд
        
        console.log('🔍 Починаємо пошук відправника...');
        
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            // Функція для пошуку відправника
            const findSenderElement = () => {
                // Спочатку шукаємо через contact-wrapper-inner (найчастіше там знаходиться)
                const contactWrapper = document.querySelector('.contact-wrapper-inner');
                if (contactWrapper) {
                    const element = contactWrapper.querySelector('div[attr-field-name="idEntity"]') ||
                                  contactWrapper.querySelector('div.stylized-select[attr-field-name="idEntity"]');
                    if (element) {
                        const text = element.textContent.trim();
                        if (text && text !== '' && text !== '---' && !text.includes('ph-is-empty')) {
                            return element;
                        }
                    }
                }
                
                // Шукаємо через form-group з лейблом "Відправник"
                const formGroups = document.querySelectorAll('.form-group');
                for (const formGroup of formGroups) {
                    const label = formGroup.querySelector('label.text-right');
                    if (label && label.textContent.trim() === 'Відправник') {
                        const element = formGroup.querySelector('div[attr-field-name="idEntity"]') ||
                                      formGroup.querySelector('div.stylized-select[attr-field-name="idEntity"]');
                        if (element) {
                            const text = element.textContent.trim();
                            if (text && text !== '' && text !== '---' && !text.includes('ph-is-empty')) {
                                return element;
                            }
                        }
                    }
                }
                
                // Шукаємо напряму
                const elements = document.querySelectorAll('div[attr-field-name="idEntity"], div.stylized-select[attr-field-name="idEntity"], .stylized-select[attr-field-name="idEntity"]');
                for (const element of elements) {
                    const text = element.textContent.trim();
                    if (text && text !== '' && text !== '---' && !text.includes('ph-is-empty')) {
                        return element;
                    }
                }
                
                return null;
            };
            
            senderElement = findSenderElement();
            
            if (senderElement) {
                console.log('✅ Знайдено відправника на спробі ' + (attempt + 1) + ':', senderElement.textContent.trim());
                break;
            }
            
            // Чекаємо перед наступною спробою
            if (attempt < maxAttempts - 1) {
                await new Promise(resolve => setTimeout(resolve, 300));
            }
        }
        
        if (senderElement) {
            const senderText = senderElement.textContent.trim();
            // Видаляємо зайві пробіли та перевіряємо
            const cleanSenderText = senderText.replace(/\s+/g, ' ').trim();
            if (!cleanSenderText || cleanSenderText === '' || cleanSenderText === '---' || cleanSenderText.toLowerCase() === '---') {
                console.log('ℹ️ Відправник (виробництво) не вибрано на сторінці деталей, кнопка "Подати" не відображається');
                return;
            }
            console.log('✅ Відправник (виробництво) вибрано на сторінці деталей:', cleanSenderText);
        } else {
            console.log('⚠️ Елемент відправника (виробництва) не знайдено на сторінці деталей після ' + maxAttempts + ' спроб, кнопка "Подати" не відображається');
            return;
        }

        // Знаходимо номер замовлення
        const orderElement = document.querySelector('h1.left.ng-binding.ng-scope');
        let orderNumber = '';
        if (orderElement) {
            const orderText = orderElement.textContent || '';
            const orderNumberMatch = orderText.match(/\d+/);
            if (orderNumberMatch) {
                orderNumber = orderNumberMatch[0];
            }
        }

        // Перевіряємо статус замовлення
        let orderStatus = { isSent: false };
        if (orderNumber) {
            orderStatus = await checkOrderStatus(orderNumber);
        }

        // Створюємо контейнер для кнопки
        const buttonContainer = document.createElement('div');
        buttonContainer.style.marginTop = '5px';
        buttonContainer.style.textAlign = 'center';

        // Створюємо кнопку
        const button = document.createElement('button');
        button.className = 'send-to-print-btn btn btn-sm';
        
        // Визначаємо, яку кнопку показувати
        // ВАЖЛИВО: Якщо замовлення вже відправлено, завжди показуємо "Відправлено" незалежно від статусу
        if (orderStatus.isSent) {
            button.textContent = 'Відправлено';
            button.style.backgroundColor = '#37a3df';
            button.style.borderColor = '#37a3df';
            button.style.color = '#fff';
            button.disabled = false;
            button.style.cursor = 'pointer';
            button.style.opacity = '1';
            
            if (orderStatus.sentDate) {
                button.title = `Відправлено: ${orderStatus.sentDate}`;
            }
        } else {
            button.textContent = 'Подати';
            button.style.backgroundColor = '#b9b9b9';
            button.style.borderColor = '#b9b9b9';
            button.style.color = '#fff';
            button.style.cursor = 'pointer';
        }
        
        button.style.marginTop = '5px';
        button.style.padding = '2px 5px';
        button.style.fontSize = '12px';
        button.style.borderRadius = '4px';
        button.style.border = '1px solid';

        // Додаємо обробник події (використовуємо ту саму логіку, що й для таблиці)
        button.addEventListener('click', async function(e) {
            e.preventDefault();
            e.stopPropagation();

            const originalButtonText = button.textContent;
            const originalButtonBg = button.style.backgroundColor;
            const originalButtonBorder = button.style.borderColor;

            button.disabled = true;
            button.textContent = '⏳ Збір даних...';
            button.style.opacity = '0.6';

            try {
                // На сторінці деталей row = null, функція collectOrderData це обробить
                // Збираємо дані про замовлення (БЕЗ завантаження PDF)
                const orderData = await collectOrderData(null);

                const hasTTN = orderData.ttn && orderData.ttn.trim() !== '';
                
                // Оновлюємо статус перед перевіркою
                if (orderData.orderNumber) {
                    const currentStatus = await checkOrderStatus(orderData.orderNumber);
                    orderStatus.isSent = currentStatus.isSent;
                }
                
                if (orderStatus.isSent) {
                    let resendMessage = 'Відправити повторно?';
                    if (!hasTTN) {
                        resendMessage = 'Відправити повторно без ТТН?';
                    }
                    const resend = confirm(resendMessage);
                    if (!resend) {
                        button.disabled = false;
                        button.textContent = originalButtonText;
                        button.style.backgroundColor = originalButtonBg;
                        button.style.borderColor = originalButtonBorder;
                        button.style.opacity = '1';
                        return;
                    }
                } else {
                    let confirmMessage = 'Чи готові подати замовлення?';
                    if (!hasTTN) {
                        confirmMessage = 'Подати замовлення без ТТН?';
                    }
                    const confirmSend = confirm(confirmMessage);
                    if (!confirmSend) {
                        button.disabled = false;
                        button.textContent = originalButtonText;
                        button.style.backgroundColor = originalButtonBg;
                        button.style.borderColor = originalButtonBorder;
                        button.style.opacity = '1';
                        return;
                    }
                }

                // Завантажуємо PDF тільки якщо є ТТН (після підтвердження відправки)
                if (hasTTN && orderData.ttn) {
                    // ВАЖЛИВО: Перегенеруємо посилання на PDF з правильним типом відповідно до відправника
                    const senderInfo = getSenderInfo(null); // На сторінці деталей row = null
                    const formIdMatch = window.location.href.match(/[?&]formId=(\d+)/);
                    const formId = formIdMatch ? formIdMatch[1] : '1';
                    const novaPoshtaId = '7';
                    const pdfType = senderInfo.pdfPathType; // 'print-marking' для Харків, 'print' для Київ
                    
                    // Завжди генеруємо повне посилання на PDF з правильним типом
                    orderData.pdfHref = `https://e-oboi.salesdrive.me/nova-poshta/${pdfType}/${orderData.ttn}/${novaPoshtaId}/?formId=${formId}`;
                    console.log('✅ Перегенеровано посилання на PDF:', orderData.pdfHref, '(тип:', pdfType + ', відправник:', senderInfo.name + ')');
                    
                    button.textContent = '⏳ Завантаження PDF...';
                    await loadPDFForOrder(orderData);
                } else {
                    // Якщо ТТН немає, очищаємо PDF дані
                    orderData.ttnPdfBase64 = null;
                    orderData.ttnPdfFileName = '';
                    console.log('⚠️ ТТН не знайдено, відправляємо без PDF вкладення');
                }

                button.textContent = '⏳ Відправляється...';
                const result = await sendOrderToEmail(orderData);

                if (result.success) {
                    const currentStatusTextAfter = statusBadge.textContent.trim();
                    const isGotuemoAfter = currentStatusTextAfter === 'Готуємо' || currentStatusTextAfter.toLowerCase().includes('готуємо');
                    if (isGotuemoAfter) {
                        await changeOrderStatusToVDruci(statusBadge, null);
                    }
                    
                    // Інвалідуємо кеш статусу замовлення, щоб перезавантажити актуальні дані
                    sentOrdersCache = null;
                    sentOrdersCacheTime = 0;
                    
                    // Чекаємо трохи, щоб сервер встиг оновити JSON файл
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    
                    // Перевіряємо статус замовлення після відправки
                    if (orderData.orderNumber) {
                        const updatedStatus = await checkOrderStatus(orderData.orderNumber);
                        orderStatus.isSent = updatedStatus.isSent;
                        console.log('✅ Статус замовлення оновлено після відправки:', updatedStatus);
                    }
                    
                    button.textContent = 'Відправлено';
                    button.style.backgroundColor = '#37a3df';
                    button.style.borderColor = '#37a3df';
                    button.disabled = false;
                    button.style.cursor = 'pointer';
                    button.style.opacity = '1';
                    
                    // Оновлюємо кнопку через checkAndUpdateButton для сторінки деталей
                    if (typeof window.checkAndUpdateButton === 'function') {
                        await new Promise(resolve => setTimeout(resolve, 500));
                        await window.checkAndUpdateButton();
                    }
                    
                    let successMessage = 'Email успішно відправлено на виробництво!';
                    if (orderData.ttnPdfFileName) {
                        successMessage += `\nPDF маркування ТТН додано як вкладення: ${orderData.ttnPdfFileName}`;
                    }
                    
                    showNotification(successMessage, 'success');
                    
                    const sentDate = new Date().toLocaleString('uk-UA');
                    button.title = `Відправлено: ${sentDate}`;
                } else {
                    button.textContent = '❌ Помилка';
                    button.style.backgroundColor = '#dc3545';
                    button.style.borderColor = '#dc3545';
                    
                    showNotification('Помилка відправки: ' + result.message, 'error');
                    
                    setTimeout(() => {
                        if (orderStatus.isSent) {
                            button.textContent = 'Відправлено';
                            button.style.backgroundColor = '#37a3df';
                            button.style.borderColor = '#37a3df';
                        } else {
                            button.textContent = 'Подати';
                            button.style.backgroundColor = '#b9b9b9';
                            button.style.borderColor = '#b9b9b9';
                        }
                        button.disabled = false;
                        button.style.opacity = '1';
                    }, 3000);
                }
            } catch (error) {
                console.error('Помилка при зборі даних або відправці:', error);
                button.textContent = '❌ Помилка';
                button.style.backgroundColor = '#dc3545';
                button.style.borderColor = '#dc3545';
                
                showNotification('Помилка: ' + error.message, 'error');
                
                setTimeout(() => {
                    if (orderStatus.isSent) {
                        button.textContent = 'Відправлено';
                        button.style.backgroundColor = '#37a3df';
                        button.style.borderColor = '#37a3df';
                    } else {
                        button.textContent = 'Подати';
                        button.style.backgroundColor = '#b9b9b9';
                        button.style.borderColor = '#b9b9b9';
                    }
                    button.disabled = false;
                    button.style.opacity = '1';
                }, 3000);
            }
        });

        // ФІНАЛЬНА перевірка перед створенням кнопки (після всіх очікувань)
        // Видаляємо всі існуючі кнопки, якщо вони є (захист від дублікатів)
        const allExistingButtons = document.querySelectorAll('.send-to-print-btn');
        if (allExistingButtons.length > 0) {
            console.log('⚠️ Знайдено ' + allExistingButtons.length + ' існуючих кнопок, видаляємо їх перед створенням нової');
            allExistingButtons.forEach(btn => {
                const container = btn.parentElement;
                if (container && (container.style.marginTop === '5px' || container.classList.contains('form-group'))) {
                    // Якщо це контейнер з кнопкою, видаляємо весь контейнер
                    if (container.id === 'send-to-print-form-group') {
                        container.remove();
                    } else if (container.tagName === 'DIV' && container.style.marginTop === '5px') {
                        container.remove();
                    } else {
                        btn.remove();
                    }
                } else {
                    btn.remove();
                }
            });
        }
        
        // Перевіряємо, чи form-group вже існує
        const existingPrintFormGroupCheck = document.getElementById('send-to-print-form-group');
        if (existingPrintFormGroupCheck) {
            console.log('ℹ️ Form-group вже існує, видаляємо його');
            existingPrintFormGroupCheck.remove();
        }
        
        // Додаємо кнопку під статусом у вигляді нового form-group з лейблом "Друк:"
        // Шукаємо батьківський form-group зі статусом
        const statusFormGroup = statusContainer.closest('.form-group');
        if (statusFormGroup) {
            // Створюємо новий form-group для кнопки "Друк:"
            const printFormGroup = document.createElement('div');
            printFormGroup.className = 'form-group';
            printFormGroup.id = 'send-to-print-form-group'; // ID для легкого пошуку
            
            // Створюємо лейбл "Друк:"
            const label = document.createElement('label');
            label.className = 'text-right';
            label.textContent = 'Друк:';
            
            // Створюємо контейнер для кнопки
            const buttonWrapper = document.createElement('div');
            buttonWrapper.style.marginTop = '-7px';
            buttonWrapper.appendChild(button);
            
            // Додаємо лейбл та кнопку в form-group
            printFormGroup.appendChild(label);
            printFormGroup.appendChild(buttonWrapper);
            
            // Вставляємо новий form-group після form-group зі статусом
            // Якщо старий form-group існує, видаляємо його
            if (existingPrintFormGroup && existingPrintFormGroup !== printFormGroup) {
                existingPrintFormGroup.remove();
            }
            statusFormGroup.parentNode.insertBefore(printFormGroup, statusFormGroup.nextSibling);
            console.log('✅ Кнопка "Подати" додана в новий form-group "Друк:" на сторінці деталей замовлення');
            
            // Створюємо MutationObserver для відстеження змін у полі fajl
            setupFajlObserver();
        } else {
            // Якщо form-group не знайдено, додаємо безпосередньо після statusContainer
            statusContainer.parentNode.insertBefore(buttonContainer, statusContainer.nextSibling);
            buttonContainer.appendChild(button);
            console.log('✅ Кнопка додана після statusContainer (form-group не знайдено)');
        }
        
        // Позначаємо, що сторінка оброблена
        detailsPageProcessed = true;
        } finally {
            // Завжди скидаємо флаг обробки, навіть якщо виникла помилка
            isProcessingDetailsPage = false;
        }
    }

    // Захист від зациклення - debounce для обробки змін
    let processTimeout = null;
    let isProcessing = false;
    
    // Спостерігач за змінами в DOM з debounce
    const observer = new MutationObserver((mutations) => {
        // Перевіряємо, чи додалися нові елементи, пов'язані зі сторінкою деталей
        let shouldProcess = false;
        for (const mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === 1) { // Element node
                        // Перевіряємо, чи це елементи, пов'язані зі сторінкою деталей
                        if (node.querySelector && (
                            node.querySelector('[attr-field-name="statusId"]') ||
                            node.querySelector('[attr-field-name="idEntity"]') ||
                            node.querySelector('.contact-wrapper-inner') ||
                            node.matches && node.matches('[attr-field-name="statusId"]') ||
                            node.matches && node.matches('[attr-field-name="idEntity"]')
                        )) {
                            shouldProcess = true;
                            break;
                        }
                    }
                }
                if (shouldProcess) break;
            }
        }
        
        // Перевіряємо, чи з'явився новий form-group з ТТН (після створення ТТН)
        if (!shouldProcess) {
            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === 1) { // Element node
                            // Перевіряємо, чи це form-group з лейблом "ТТН"
                            if (node.matches && node.matches('.form-group')) {
                                const label = node.querySelector('label.text-right');
                                if (label && label.textContent.trim() === 'ТТН') {
                                    const ttnLink = node.querySelector('a[href*="novaposhta.ua/tracking"]');
                                    if (ttnLink) {
                                        shouldProcess = true;
                                        console.log('🔄 Виявлено появу нового form-group з ТТН');
                                        break;
                                    }
                                }
                            }
                            // Також перевіряємо дочірні елементи
                            if (node.querySelector && node.querySelector('.form-group label.text-right')) {
                                const formGroups = node.querySelectorAll('.form-group');
                                for (const formGroup of formGroups) {
                                    const label = formGroup.querySelector('label.text-right');
                                    if (label && label.textContent.trim() === 'ТТН') {
                                        const ttnLink = formGroup.querySelector('a[href*="novaposhta.ua/tracking"]');
                                        if (ttnLink) {
                                            shouldProcess = true;
                                            console.log('🔄 Виявлено появу нового form-group з ТТН (в дочірньому елементі)');
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                        if (shouldProcess) break;
                    }
                }
                if (shouldProcess) break;
            }
        }
        
        // Якщо це сторінка деталей і з'явився ТТН, також викликаємо checkAndUpdateButton
        const isDetailsPage = window.location.href.includes('#/order/update/') || window.location.href.includes('#/order/create/');
        if (isDetailsPage && shouldProcess) {
            // Перевіряємо, чи дійсно з'явився ТТН
            const ttnFormGroup = document.querySelector('.form-group label.text-right');
            if (ttnFormGroup && ttnFormGroup.textContent.trim() === 'ТТН') {
                const ttnLink = ttnFormGroup.closest('.form-group')?.querySelector('a[href*="novaposhta.ua/tracking"]');
                if (ttnLink) {
                    console.log('🔄 Виявлено ТТН на сторінці деталей, викликаємо checkAndUpdateButton');
                    // Викликаємо checkAndUpdateButton для перевірки умов (файл, відправник, статус)
                    setTimeout(() => {
                        if (typeof window.checkAndUpdateButton === 'function') {
                            window.checkAndUpdateButton().catch(error => {
                                console.error('Помилка в checkAndUpdateButton (після появи ТТН):', error);
                            });
                        }
                    }, 500);
                }
            }
        }
        
        // Очищаємо попередній таймер
        if (processTimeout) {
            clearTimeout(processTimeout);
        }
        
        // Встановлюємо новий таймер (чекаємо 500мс після останньої зміни)
        processTimeout = setTimeout(() => {
            if (!isProcessing) {
                isProcessing = true;
                processRowsWithStatus().catch(error => {
                    console.error('Помилка в processRowsWithStatus (observer):', error);
                }).finally(() => {
                    isProcessing = false;
                });
            }
        }, shouldProcess ? 300 : 500); // Менша затримка, якщо знайшли релевантні елементи
    });

    // Функція для перевірки зміни URL (для AngularJS навігації)
    function checkUrlChange() {
        const currentUrl = window.location.href;
        if (currentUrl !== lastProcessedUrl) {
            console.log('🔄 Виявлено зміну URL, скидаємо флаги обробки та запускаємо обробку');
            lastProcessedUrl = currentUrl;
            detailsPageProcessed = false;
            isProcessingDetailsPage = false;
            
            // Запускаємо обробку після зміни URL (з кількома спробами для AngularJS)
            setTimeout(() => {
                processRowsWithStatus().catch(error => {
                    console.error('Помилка в processRowsWithStatus (checkUrlChange):', error);
                });
            }, 500);
            
            // Додаткова спроба через 1.5 секунди
            setTimeout(() => {
                processRowsWithStatus().catch(error => {
                    console.error('Помилка в processRowsWithStatus (checkUrlChange retry):', error);
                });
            }, 1500);
            
            // Ще одна спроба через 3 секунди
            setTimeout(() => {
                processRowsWithStatus().catch(error => {
                    console.error('Помилка в processRowsWithStatus (checkUrlChange retry 2):', error);
                });
            }, 3000);
            
            // Остання спроба через 5 секунд
            setTimeout(() => {
                processRowsWithStatus().catch(error => {
                    console.error('Помилка в processRowsWithStatus (checkUrlChange retry 3):', error);
                });
            }, 5000);
        }
    }

    // Запускаємо обробку при завантаженні сторінки
    window.addEventListener('load', () => {
        processRowsWithStatus().catch(error => {
            console.error('Помилка в processRowsWithStatus (load):', error);
        });
    });

    // Обробка зміни hash (для AngularJS навігації)
    window.addEventListener('hashchange', () => {
        console.log('🔄 Виявлено зміну hash, скидаємо флаги обробки');
        detailsPageProcessed = false;
        isProcessingDetailsPage = false;
        lastProcessedUrl = window.location.href;
        // Запускаємо обробку після зміни hash (з кількома спробами та збільшеними затримками)
        setTimeout(() => {
            processRowsWithStatus().catch(error => {
                console.error('Помилка в processRowsWithStatus (hashchange):', error);
            });
        }, 500);
        
        // Додаткова спроба через 1.5 секунди
        setTimeout(() => {
            processRowsWithStatus().catch(error => {
                console.error('Помилка в processRowsWithStatus (hashchange retry):', error);
            });
        }, 1500);
        
        // Ще одна спроба через 3 секунди (для повільних завантажень)
        setTimeout(() => {
            processRowsWithStatus().catch(error => {
                console.error('Помилка в processRowsWithStatus (hashchange retry 2):', error);
            });
        }, 3000);
        
        // Остання спроба через 5 секунд (для дуже повільних завантажень)
        setTimeout(() => {
            processRowsWithStatus().catch(error => {
                console.error('Помилка в processRowsWithStatus (hashchange retry 3):', error);
            });
        }, 5000);
    });

    // Спостерігаємо за змінами в DOM
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    // Спостерігач для відправника та файлу на сторінці деталей
    let detailsPageCheckTimeout = null;
    
    function setupDetailsPageObservers() {
        // Перевіряємо, чи це сторінка деталей
        if (!window.location.href.includes('#/order/update/') && !window.location.href.includes('#/order/create/')) {
            return;
        }
        
        // Знаходимо елемент відправника
        const senderElement = document.querySelector('div[attr-field-name="idEntity"]') ||
                             document.querySelector('.contact-wrapper-inner div[attr-field-name="idEntity"]');
        
        // Знаходимо елемент файлу
        const fajlElement = document.querySelector('div[attr-field-name="fajl"]');
        
        // Функція для виклику перевірки
        const triggerCheck = () => {
            if (detailsPageCheckTimeout) {
                clearTimeout(detailsPageCheckTimeout);
            }
            
            detailsPageCheckTimeout = setTimeout(() => {
                if (typeof window.checkAndUpdateButton === 'function') {
                    console.log('🔄 Зміна в відправнику або файлі, викликаємо checkAndUpdateButton');
                    window.checkAndUpdateButton().catch(error => {
                        console.error('Помилка в checkAndUpdateButton:', error);
                    });
                }
            }, 800);
        };
        
        // Спостерігач для відправника
        if (senderElement) {
            const senderObserver = new MutationObserver((mutations) => {
                let shouldCheck = false;
                for (const mutation of mutations) {
                    if (mutation.type === 'childList' || mutation.type === 'characterData' || 
                        (mutation.type === 'attributes' && mutation.attributeName === 'class')) {
                        shouldCheck = true;
                        break;
                    }
                }
                if (shouldCheck) {
                    console.log('🔄 Виявлено зміну в відправнику');
                    triggerCheck();
                }
            });
            
            try {
                senderObserver.observe(senderElement, {
                    childList: true,
                    subtree: true,
                    characterData: true,
                    attributes: true,
                    attributeFilter: ['class']
                });
                console.log('✅ Спостерігач для відправника активовано');
            } catch (error) {
                console.warn('⚠️ Помилка при створенні спостерігача для відправника:', error);
            }
        } else {
            console.log('ℹ️ Елемент відправника не знайдено, спробуємо пізніше');
            // Спробуємо через 1 секунду
            setTimeout(setupDetailsPageObservers, 1000);
        }
        
        // Спостерігач для файлу (якщо ще не налаштовано через setupFajlObserver)
        if (fajlElement && !window.fajlObserverSetup) {
            const fajlObserver = new MutationObserver((mutations) => {
                let shouldCheck = false;
                for (const mutation of mutations) {
                    if (mutation.type === 'childList' || mutation.type === 'characterData' || 
                        (mutation.type === 'attributes' && mutation.attributeName === 'class')) {
                        shouldCheck = true;
                        break;
                    }
                }
                if (shouldCheck) {
                    console.log('🔄 Виявлено зміну в файлі');
                    triggerCheck();
                }
            });
            
            try {
                fajlObserver.observe(fajlElement, {
                    childList: true,
                    subtree: true,
                    characterData: true,
                    attributes: true,
                    attributeFilter: ['class']
                });
                console.log('✅ Спостерігач для файлу активовано');
            } catch (error) {
                console.warn('⚠️ Помилка при створенні спостерігача для файлу:', error);
            }
        }
        
        // Спостерігач для ТТН - відстежує появу form-group з ТТН
        // Шукаємо контейнер, де може з'явитися ТТН (наприклад, форма замовлення)
        const orderForm = document.querySelector('.form-horizontal') || 
                         document.querySelector('form') || 
                         document.querySelector('.order-details') ||
                         document.body;
        
        if (orderForm && !window.ttnObserverSetup) {
            window.ttnObserverSetup = true;
            const ttnObserver = new MutationObserver((mutations) => {
                let shouldCheck = false;
                for (const mutation of mutations) {
                    if (mutation.type === 'childList') {
                        for (const node of mutation.addedNodes) {
                            if (node.nodeType === 1) { // Element node
                                // Перевіряємо, чи це form-group з лейблом "ТТН"
                                if (node.matches && node.matches('.form-group')) {
                                    const label = node.querySelector('label.text-right');
                                    if (label && label.textContent.trim() === 'ТТН') {
                                        const ttnLink = node.querySelector('a[href*="novaposhta.ua/tracking"]');
                                        if (ttnLink) {
                                            shouldCheck = true;
                                            console.log('🔄 Виявлено появу form-group з ТТН на сторінці деталей');
                                            break;
                                        }
                                    }
                                }
                                // Також перевіряємо дочірні елементи
                                if (node.querySelector && node.querySelector('.form-group label.text-right')) {
                                    const formGroups = node.querySelectorAll('.form-group');
                                    for (const formGroup of formGroups) {
                                        const label = formGroup.querySelector('label.text-right');
                                        if (label && label.textContent.trim() === 'ТТН') {
                                            const ttnLink = formGroup.querySelector('a[href*="novaposhta.ua/tracking"]');
                                            if (ttnLink) {
                                                shouldCheck = true;
                                                console.log('🔄 Виявлено появу form-group з ТТН (в дочірньому елементі) на сторінці деталей');
                                                break;
                                            }
                                        }
                                    }
                                }
                            }
                            if (shouldCheck) break;
                        }
                    }
                    if (shouldCheck) break;
                }
                
                if (shouldCheck) {
                    console.log('🔄 Виявлено появу ТТН, викликаємо checkAndUpdateButton для перевірки умов');
                    triggerCheck();
                }
            });
            
            try {
                ttnObserver.observe(orderForm, {
                    childList: true,
                    subtree: true
                });
                console.log('✅ Спостерігач для ТТН активовано');
            } catch (error) {
                console.warn('⚠️ Помилка при створенні спостерігача для ТТН:', error);
            }
        }
    }
    
    // Запускаємо налаштування спостерігачів
    setupDetailsPageObservers();
    
    // Також перезапускаємо при навігації
    window.addEventListener('hashchange', () => {
        setTimeout(setupDetailsPageObservers, 500);
    });

    // Перевіряємо зміну URL періодично (на випадок, якщо hashchange не спрацьовує)
    setInterval(checkUrlChange, 1000);

    // Також запускаємо обробку одразу
    processRowsWithStatus().catch(error => {
        console.error('Помилка в processRowsWithStatus (initial):', error);
    });
})();