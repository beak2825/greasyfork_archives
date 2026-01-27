// ==UserScript==
// @name         UMai Reservation Helper
// @namespace    umai.reserve.helper
// @version      1.3
// @description  helper quick reserve
// @author       Rizuwan
// @match        https://reservation.umai.io/en/widget/*
// @match        https://reservation.umai.io/en/widget/*?party_size=*&date=*
// @require      https://cdn.jsdelivr.net/npm/hotkeys-js@4.0.0/dist/hotkeys-js.min.js
// @run-at      document-start
// @grant       unsafeWindow
// @grant       GM_cookie
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/564007/UMai%20Reservation%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/564007/UMai%20Reservation%20Helper.meta.js
// ==/UserScript==

// (function() {
//     'use strict';
//     let pax = parseInt(localStorage.getItem('pax')) || 5;
//     setTimeout(() => {
//         location.href = location.href.replace(/party_size=\d+/, 'party_size=' + pax);
//         localStorage.setItem('pax', pax);
//         pax = pax === 8 ? 5 : 8;
//     }, 5000);
// })();

const vApiKey = 'd3b28a25-c040-4724-9f09-be8fba19df68';


const originalOpen = XMLHttpRequest.prototype.open;
const originalSend = XMLHttpRequest.prototype.send;
const originalSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;
var previousRandomPax;
var isRetry = false;

XMLHttpRequest.prototype.open = function(method, url, ...rest) {
    this._interceptedUrl = url;
    this._customHeaders = {};
    return originalOpen.call(this, method, url, ...rest);
};

XMLHttpRequest.prototype.setRequestHeader = function (header, value) {
    // Simpan semua header
    this._customHeaders[header.toLowerCase()] = value;

    // 🔁 Replace Venue-api-key
    if (header.toLowerCase() === 'venue-api-key') {
        value = vApiKey;
    }

    return originalSetRequestHeader.call(this, header, value);
};

XMLHttpRequest.prototype.send = function(...args) {
    this.addEventListener('load', function() {
        if (this._interceptedUrl.includes('api/v2/slots?party_size')) {
            delete localStorage._grecaptcha

            const guestFormData = {
                "firstName":"Mohd Rizuwan",
                "lastName":"Saar Idris",
                "email":"rizuwan86@gmail.com",
                    "phone":"+60193068828",
                    "birthday":"10/06/1804"
                }

                localStorage.guestFormData = JSON.stringify(guestFormData)
            setTimeout(() => {
                getRandomElementAndClick();
            }, 50);
        }
    });

    return originalSend.apply(this, args);
};

function hotkeyHandler() {
    hotkeys('alt+1,alt+2,alt+3,alt+5,alt+8,alt+9', function (event, handler){
        switch (handler.key) {
          case 'alt+1':
            const backButton = document.querySelector("button#ums-header-back");
            if (backButton) {
                backButton.click();

                setTimeout(() => {
                    isRetry = true;
                    getRandomElementAndClick();
                    setTimeout(() => {
                        isRetry = false;
                    }, 5000);
                }, 500);
            }

            else {
                getRandomElementAndClick();
            }
            break;

            case 'alt+2':
                delete localStorage._grecaptcha

                const guestFormData = {
                    "firstName":"Mohd Rizuwan",
                    "lastName":"Saar Idris",
                    "email":"rizuwan86@gmail.com",
                    "phone":"+60193068828",
                    "birthday":"10/06/1804"
                }

                localStorage.guestFormData = JSON.stringify(guestFormData)
                break;

            case 'alt+3':
                popupPax();
                break;

            case 'alt+5':
                const cookieDetails = {
                    name: "__cfwaitingroom_umai_landing_page_rembayung_l5",
                    url: "https://reservation.umai.io/en/widget/rembayung"
                };

                GM_cookie.delete(cookieDetails, function(error) {
                    if (error) {
                        console.error("❌ Gagal memadam cookie:", error);
                    } else {
                        console.log("✅ Cookie HttpOnly '" + cookieDetails.name + "' berjaya dipadam!");
                        location.reload();
                    }
                });
            break;
            case 'alt+8':

            GM_xmlhttpRequest({
                method: 'GET',
                url: 'https://rizuwan.xyz/apibot',
                onload: function(response) {
                    const cookie = response.responseText.split(" ")[2];

                    const cookieDetails = {
                        name: "__cfwaitingroom_umai_landing_page_rembayung_l5",
                        url: "https://reservation.umai.io/en/widget/rembayung",
                        value: cookie
                    };

                    GM_cookie.set(cookieDetails);
                }
            });
            break;
            case 'alt+9':

                GM_xmlhttpRequest({
                    method: 'GET',
                    url: 'https://rizuwan.xyz/apibot',
                    onload: function(response) {
                        const savedApiKey = response.responseText.split(" ")[0];
                        const apiKey = prompt("Enter API key for UMAI widget:", savedApiKey);

                        if (apiKey) {
                            unsafeWindow.umaiWidget.config({
                                apiKey: apiKey
                            });

                            unsafeWindow.umaiWidget.openWidget();
                        }
                    }
                });
            break;
        }
    })
}

const getRandomElementAndClick = () => {

    const getRandomElement = (elements) => {
        if (isRetry) {
            const randomIndex = Math.floor(Math.random() * elements.length);
            return elements[randomIndex];
        } else {
            const randomIndex = elements.length - 3 + Math.floor(Math.random() * 3);
            return elements[randomIndex];
        }
    };
    const randomElement = getRandomElement(document.querySelectorAll(".um-timeslot__button"));
    if (randomElement) {
        randomElement.click();

        setTimeout(() => {
            const checkbox = document.querySelector("#um-field-checkbox");
            delete localStorage._grecaptcha;

            if (checkbox) {
                checkbox.click();

                setTimeout(() => {
                    const buttons = Array.from(document.querySelectorAll('button'));
                    const proceedButton = document.querySelector("#ums-proceed-to-add-payment-details-button") || buttons.find(btn => btn.textContent.toLowerCase().includes('add payment details'));
                    if (proceedButton) {
                        proceedButton.click();
                    }
                }, 400);
            }
        }, 500);
    }
};

function popupPax() {
  const el = document.querySelector('#um-reservation-party-size');

  el.setAttribute('tabindex', '0');
  el.focus();

  el.dispatchEvent(new KeyboardEvent('keydown', {
    key: 'ArrowDown',
    code: 'ArrowDown',
    keyCode: 40,
    which: 40,
    bubbles: true,
    cancelable: true
  }));
  hotkeyHandler();

  setTimeout(() => {
    const getRandomPax = () => {
        let randomPax;
        do {
            randomPax = Math.floor(Math.random() * 3) + 6;
        } while (randomPax === previousRandomPax);
        previousRandomPax = randomPax;
        return randomPax;
    };
    document.querySelector(`#react-select-3-option-${getRandomPax() - 3}`).click();

  }, 300);
}

hotkeyHandler();