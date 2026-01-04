// ==UserScript==
// @name         longcat Paste
// @description  a
// @match        *://longcat.chat/*
// @version 0.0.1.20251216152714
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/559122/longcat%20Paste.user.js
// @updateURL https://update.greasyfork.org/scripts/559122/longcat%20Paste.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let queueArray = [];
    let cycleInProgress = false;

    window.addEventListener("message", event => {

        const data = event.data;

        if (event.data === 'reload') {

            window.location.reload();

        }

        if (event.data && event.data.type === 'reasonButtonClicked') {
            document.querySelector('button[aria-label="Think"]').click();
            return;
        }

        if (event.data && event.data.type === 'newChatButtonClicked') {

            const customNewChatButton = document.querySelector('div.chat-icon-box');

            if (customNewChatButton) customNewChatButton.click();

            queueArray = [];
            cycleInProgress = false;
        }

        //grab style element

        let longcatCssStyleId = document.getElementById('longcatCssStyleId');

        let chatMessageInput = document.querySelector('div.page-footer');
        
        let chatMessageInputRule = 'div.page-footer {display: none !important;}';


        //let chatMessageInputBackdrop = document.querySelector('.chat-input-backdrop');

        //let chatMessageInputBackdropRule = '.chat-input-backdrop {display: none !important;}';
        
        let header = document.querySelector('div:has(> div > div > button[aria-label="Toggle sidebar"] > svg > path[d="M3 12h18"])');

        let headerCssRule = 'div:has(> div > div > button[aria-label="Toggle sidebar"] > svg > path[d="M3 12h18"]) {display: none !important;}'

        //if event data type is defaultChatMessageInputDisplay

        if (event.data?.type === 'defaultChatMessageInputDisplay') {
            console.log('default');

            if (chatMessageInput) {

                //delete the rule here
                longcatCssStyleId.innerHTML = longcatCssStyleId.innerHTML.replace(`${chatMessageInputRule}`, '')
                longcatCssStyleId.innerHTML = longcatCssStyleId.innerHTML.replace(`${chatMessageInputBackdropRule}`, '')

                longcatCssStyleId.innerHTML = longcatCssStyleId.innerHTML.replace(`${headerCssRule}`, '');

                //header.style.removeProperty('display');

                //return
                return;
            }
        }

        //if the event data type is customize chat message input display

        if (event.data?.type === 'customizeChatMessageInputDisplay') {
            console.log('customize');
            if (chatMessageInput) {

                console.log('chatMessageInput found')

                longcatCssStyleId.innerHTML += `${chatMessageInputRule}`

                longcatCssStyleId.innerHTML += `${chatMessageInputBackdropRule}`

                longcatCssStyleId.innerHTML += `${headerCssRule}`

                //header.style.display = 'none';

                //return
                return;
            }
        }


        if (event.data.type === "prompt" && event.data.content.trim()) {

            queueArray.push(event.data.content);

            console.log(cycleInProgress)

            function queue() {
                if (cycleInProgress || queueArray.length === 0) { return };

                cycleInProgress = true;
                const contentEditableDiv = document.querySelector('div[contenteditable="true"].tiptap.ProseMirror:has(> p)');
                if (!contentEditableDiv) return;

                /*const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
                        nativeInputValueSetter.call(textarea, queueArray[0]); // Set like the browser would*/

                contentEditableDiv.focus();
                //change the inner HTML
                contentEditableDiv.innerHTML = '<p>' + queueArray[0].replace(/\n/g, '<br>') + '</p>';

                // Now trigger a React-compatible InputEvent
                const inputEvent = new InputEvent('input', {
                    bubbles: true,
                    cancelable: true,
                    inputType: 'insertText',
                    data: queueArray[0],
                });

                contentEditableDiv.dispatchEvent(inputEvent);

                //console.log('lol')

                //we're going to have to move the mutation observer to be called outside any function
                //so that it can be called upon page load so that it can be used for multiple functions

                //if submit button exists
                if (document.querySelector('button[aria-label="Submit"]')) {

                    console.log('submit button exists: ', document.querySelector('button[aria-label="Submit"]'));

                    //click it
                    //document.querySelector('button[aria-label="Submit"]').click();

                    const interval = setInterval(() => {
                        const button = document.querySelector('button[aria-label="Submit"]');
                        if (button) {
                            console.log('submit button exists: ', button);

                            // Click the button programmatically
                            const event = new MouseEvent('click', {
                                view: window,
                                bubbles: true,
                                cancelable: true
                            });
                            button.dispatchEvent(event);

                            // Optional: trigger focus and other events if necessary
                            button.focus();
                            button.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                            button.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

                            // Once the button is clicked, stop the interval
                            clearInterval(interval);
                        }
                    }, 1); // Check every 100ms


                } else {

                    console.log('lol')

                    //watch for dom mutations
                    const targetNode = document.querySelector('button[aria-label="Submit"]');

                    const config = {
                        attributes: true
                    }

                    const callback = function (mutationList, observer) {
                        for (const mutation of mutationList) {
                            if (mutation.type === 'attributes') {
                                console.log('attribute changed: ', mutation.attributeName);
                            }
                        }
                    }

                    const observer = new MutationObserver(callback);

                    observer.observe(targetNode, config);
                }

                const stopButtonSelector = 'button[aria-label="Stop model response"]';

                let observer = new MutationObserver(function (mutationRecordArray) {
                    //for each mutation
                    mutationRecordArray.forEach(function (mutationRecord) {

                        mutationRecord.removedNodes.forEach((node) => {
                            console.log('removed node: ', node);

                            if (node.matches && node.matches(stopButtonSelector)) {
                                console.log('button with aria label stop model response has been removed');
                                //disconect the observer since the cycle has finished and a response has been generated
                                observer.disconnect();
                                //as the response has completed lets remove the first value in the queue which we presumably just got a
                                //response for
                                console.log(queueArray.shift())
                                //lets indicate theat the cycle has ended
                                cycleInProgress = false;
                                //lets call the queue function again to see if there are more items in the queue array
                                queue();
                            };
                        });
                    })
                })
                observer.observe(document.body, { childList: true, subtree: true })
            }
            queue();
        }
    });
})();