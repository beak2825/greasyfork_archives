// ==UserScript==
// @name         Torn Item Custom Message by ShadowCrest
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Adding predefined templates while sending items.
// @author       ShAdOwCrEsT [3929345]
// @match        https://www.torn.com/item.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550952/Torn%20Item%20Custom%20Message%20by%20ShadowCrest.user.js
// @updateURL https://update.greasyfork.org/scripts/550952/Torn%20Item%20Custom%20Message%20by%20ShadowCrest.meta.js
// ==/UserScript==

// Made for Clouds [2982905]

(function() {
    'use strict';

    const messageTemplates = [
        { label: "Happy Jump ", text: "Happy Jump Insurance" },
        { label: "Xanax", text: "Xanax Insurance " },
        { label: "Ecstacy", text: "Ecstasy Insurance" },
        { label: "7-day ", text: "7-day Insurance " },
        { label: "Xanax Stack", hasSubmenu: true } // Submenu one
    ];

    const customSubmenu = [
        { label: "1st", text: "1st Xanax Stack Insurance" },
        { label: "2nd", text: "2nd Xanax Stack Insurance" },
        { label: "3rd", text: "3rd Xanax Stack Insurance" },
        { label: "4th", text: "4th Xanax Stack Insurance" }
    ];

    const optionColors = [
        "#ff751a",
        "#66ff66",
        "#ffcc00",
        "#9966ff",
        "#4da6ff"
    ];

    let dropdown = null;
    let submenuDropdown = null;

    function createTemplateButton() {
        const button = document.createElement('button');
        button.innerHTML = '▼';
        button.style.cssText = `
            width: 25px;
            height: 25px;
            background-color: #666;
            color: black;
            border: 1px solid #555;
            border-radius: 3px;
            cursor: pointer;
            font-size: 12px;
            margin-left: 5px;
            position: relative;
        `;
        button.type = 'button';
        return button;
    }

    function createSubmenu(targetInput) {
    const submenu = document.createElement('div');
    submenu.style.cssText = `
        position: absolute;
        top: 100%;
        left: 0%;
        background: #4da6ff;
        border: 1px solid #666;
        border-radius: 3px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        z-index: 2147483647;
        display: none;
        padding: 0; /* remove extra padding so borders align */
        display: flex;
        flex-direction: row;
        white-space: nowrap;
        min-width: 100%;  /* match parent option's width */
    `;

    customSubmenu.forEach((template, index) => {
        const option = document.createElement('div');
        option.textContent = template.label;
        option.style.cssText = `
            flex: 1;
            padding: 8px 9px;
            cursor: pointer;
            color: black;
            background: #4da6ff;
            text-align: center;
            ${index < customSubmenu.length - 1 ? 'border-right: 3px solid #999;' : ''}
        `;
        option.addEventListener('mouseenter', () => {
            option.style.backgroundColor = '#e0e0e0';
        });
        option.addEventListener('mouseleave', () => {
            option.style.backgroundColor = '#4da6ff';
        });
        option.addEventListener('click', () => {
            insertTemplate(template.text, targetInput);
            hideDropdown();
            hideSubmenu();
        });
        submenu.appendChild(option);
    });

    return submenu;
}



    function createDropdown(button) {
        const dropdownEl = document.createElement('div');
        dropdownEl.style.cssText = `
            position: fixed;
            background: #4da6ff;
            border: 1px solid #666;
            border-radius: 3px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            z-index: 2147483647;
            min-width: 150px;
            display: none;
        `;

        messageTemplates.forEach((template, index) => {
            const option = document.createElement('div');
            option.textContent = template.label;
            option.style.cssText = `
                padding: 8px 12px;
                cursor: pointer;
                color: black;
                background: ${optionColors[index]};
                position: relative;
                ${index < messageTemplates.length - 1 ? 'border-bottom: 3px solid #999;' : ''}
            `;

            if (template.hasSubmenu) {
                submenuDropdown = createSubmenu();
                option.appendChild(submenuDropdown);

                option.style.cursor = 'default';

                option.addEventListener('mouseenter', () => {
                    option.style.backgroundColor = '#e0e0e0';
                    showSubmenu();
                });
                option.addEventListener('mouseleave', () => {
                    option.style.backgroundColor = optionColors[index];
                });
            } else {
                option.addEventListener('mouseenter', () => {
                    option.style.backgroundColor = '#e0e0e0';
                    hideSubmenu();
                });
                option.addEventListener('mouseleave', () => {
                    option.style.backgroundColor = optionColors[index];
                });
                option.addEventListener('click', () => {
                    insertTemplate(template.text);
                    hideDropdown();
                });
            }

            dropdownEl.appendChild(option);
        });

        return dropdownEl;
    }

    function insertTemplate(text) {

        const messageInputs = document.querySelectorAll('input[name="tag"].message');
        messageInputs.forEach(input => {
            if (input.offsetHeight > 0 && input.offsetWidth > 0) {
                input.value = text;
                input.focus();
            }
        });

        const userIdInputs = document.querySelectorAll('input[aria-labelledby="wai-user-id"].user-id');
        userIdInputs.forEach(input => {
            if (input.offsetHeight > 0 && input.offsetWidth > 0) {
                input.value = "Clouds [2982905]";
            }
        });
    }

    function showDropdown() {
        if (dropdown) {
            dropdown.style.display = 'block';
        }
    }

    function hideDropdown() {
        if (dropdown) {
            dropdown.style.display = 'none';
        }
        hideSubmenu();
    }

    function showSubmenu() {
        if (submenuDropdown) {
            submenuDropdown.style.display = 'flex';
        }
    }

    function hideSubmenu() {
        if (submenuDropdown) {
            submenuDropdown.style.display = 'none';
        }
    }

    function addTemplateButton() {

        const messageInputs = document.querySelectorAll('input[name="tag"].message');

        if (messageInputs.length === 0) {
            console.log('Torn Message Templates: No message inputs found');
            return;
        }

        messageInputs.forEach((messageInput, index) => {

            if (messageInput.offsetHeight === 0 || messageInput.offsetWidth === 0) {
                return;
            }

            if (messageInput.parentNode.querySelector('.template-button-container')) {
                return;
            }

            console.log(`Torn Message Templates: Adding button to message input ${index + 1}`);

            const button = createTemplateButton();
            const dropdownForThisInput = createDropdown(button);

            const container = document.createElement('div');
            container.classList.add('template-button-container');
            container.style.cssText = `
                position: absolute;
                top: 2px;
                right: 2px;
                z-index: 1001;
            `;

            container.appendChild(button);
            document.body.appendChild(dropdownForThisInput);

            const inputParent = messageInput.parentNode;
            const computedStyle = window.getComputedStyle(inputParent);
            if (computedStyle.position === 'static') {
                inputParent.style.position = 'relative';
            }

            inputParent.appendChild(container);

            button.addEventListener('click', (e) => {
                function updateDropdownPosition() {
                    if (dropdownForThisInput.style.display === 'block') {
                        const buttonRect = button.getBoundingClientRect();
                        dropdownForThisInput.style.left = (buttonRect.left - 125) + 'px';
                        dropdownForThisInput.style.top = (buttonRect.bottom + 2) + 'px';
                    }
                }


                window.addEventListener('scroll', updateDropdownPosition);
                window.addEventListener('resize', updateDropdownPosition);

                e.preventDefault();
                e.stopPropagation();
                console.log('Torn Message Templates: Button clicked');

                const buttonRect = button.getBoundingClientRect();
                dropdownForThisInput.style.left = (buttonRect.left - 125) + 'px';
                dropdownForThisInput.style.top = (buttonRect.bottom + 2) + 'px';

                if (dropdownForThisInput.style.display === 'block') {
                    dropdownForThisInput.style.display = 'none';
                } else {
                    dropdownForThisInput.style.display = 'block';
                }
            });

            document.addEventListener('click', (e) => {
                if (!container.contains(e.target) && !dropdownForThisInput.contains(e.target)) {
                    dropdownForThisInput.style.display = 'none';
                }
            });
        });
    }

    function observeForMessageInput() {
        const observer = new MutationObserver((mutations) => {
            let shouldCheck = false;

            mutations.forEach((mutation) => {

                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {

                        if (node.tagName === 'INPUT' ||
                            (node.querySelector && node.querySelector('input[name="tag"].message'))) {
                            shouldCheck = true;
                        }
                    }
                });

                if (mutation.type === 'attributes' &&
                    mutation.target.tagName === 'INPUT' &&
                    mutation.target.name === 'tag') {
                    shouldCheck = true;
                }
            });

            if (shouldCheck) {
                setTimeout(addTemplateButton, 50);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'class']
        });
    }

    function monitorClicks() {
        document.addEventListener('click', (e) => {
            const target = e.target;

            if (target.textContent &&
                (target.textContent.toLowerCase().includes('message') ||
                 target.textContent.toLowerCase().includes('add') ||
                 target.classList.contains('msg') ||
                 target.id.includes('message'))) {

                setTimeout(addTemplateButton, 200);
                setTimeout(addTemplateButton, 500);
            }
        });
    }

    function initialize() {
        addTemplateButton();
        observeForMessageInput();
        monitorClicks();

        setInterval(addTemplateButton, 1000); //1 sec
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

})();