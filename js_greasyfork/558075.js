// ==UserScript==
// @name         Torn Candy Sender
// @namespace    http://torn.com/
// @version      2.0
// @description  create button, send a qty of any specified candy item to a fixed recipient, including a custom message.
// @author       Deviyl
// @match        https://www.torn.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/558075/Torn%20Candy%20Sender.user.js
// @updateURL https://update.greasyfork.org/scripts/558075/Torn%20Candy%20Sender.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // #######################################################
    // ### CONFIGURATION: CHANGE THESE VALUES AS NEEDED! ###
    // #######################################################

    // Specify the exact name of the candy item (e.g., 'Pixie Sticks', 'Lollipop', etc.)
    const TARGET_ITEM_NAME = 'Pixie Sticks';

    // Specify the recipient name and ID (e.g., 'Deviyl [3722358]')
    const TARGET_RECIPIENT = 'Deviyl [3722358]';

    // Specify the quantity to send (set to '1' for a single item)
    const TARGET_QUANTITY = '1';

    // Specify the message to include
    const TARGET_MESSAGE = 'thanks';

    // Specify the URL Fragment for the tab list of items
    const URL_FRAGMENT = '#candy-items';
    const targetUrl = 'https://www.torn.com/item.php' + URL_FRAGMENT;




    // change event
    function dispatchChangeEvent(element) {
        const changeEvent = new Event('change', { bubbles: true });
        element.dispatchEvent(changeEvent);
    }

    // creates button
    function createButton() {
        const quickButton = document.createElement('button');
        quickButton.textContent = 'Send';
        quickButton.style.cssText = `
            position: fixed;
            top: 10px;
            left: 10px;
            z-index: 10000;
            padding: 5px 10px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            font-weight: bold;
        `;

        quickButton.addEventListener('click', function() {
            window.location.href = targetUrl;
        });

        if (document.body) {
            document.body.appendChild(quickButton);
        } else {
            document.addEventListener('DOMContentLoaded', () => document.body.appendChild(quickButton));
        }
    }

    // loads add message with custom message
    function AddAndFillMessage() {
        const messageLink = document.querySelector('a.action-message');

        if (messageLink) {
            messageLink.click();

            setTimeout(() => {
                const messageInput = document.querySelector('input[name="tag"]');
                if (messageInput) {
                    messageInput.value = TARGET_MESSAGE;
                    dispatchChangeEvent(messageInput);
                }
            }, 50);
        }
    }

    // loads user id and quantity
    function FillRecipientAndQuantity() {
        const recipientInput = document.querySelector('input[name="userID"]');
        const quantityInput = document.querySelector('input.amount.m-top5.input-money');

        if (recipientInput && quantityInput) {
            recipientInput.value = TARGET_RECIPIENT;
            quantityInput.value = TARGET_QUANTITY;

            // trigger 'change' events
            dispatchChangeEvent(recipientInput);
            dispatchChangeEvent(quantityInput);


            // adding the message
            setTimeout(AddAndFillMessage, 50);

        } else {
            setTimeout(FillRecipientAndQuantity, 100);
        }
    }

    // send item
    function ClickItemSend() {
        if (window.location.hash === URL_FRAGMENT) {
            const itemButton = document.querySelector(`button[aria-label="Send ${TARGET_ITEM_NAME}"]`);

            if (itemButton) {
                console.log(`Torn Sender: Found and automatically clicking "Send ${TARGET_ITEM_NAME}" button.`);
                itemButton.click();
                // After clicking, immediately start the process to auto-fill the details.
                setTimeout(FillRecipientAndQuantity, 50);
            } else {
                setTimeout(ClickItemSend, 500);
            }
        }
    }

    // --- Main Execution ---
    createButton();
    ClickItemSend();

})();