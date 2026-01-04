// ==UserScript==
// @name         WritingTeam Implement Template Generator
// @namespace    http://retroachievements.org/
// @version      1.1
// @description  This script generates forum post templates for the WritingTeam to use when implementing a set
// @author       ChaoticAdventure + PS2Hagrid
// @match        https://retroachievements.org/forums/topic/*
// @icon         https://static.retroachievements.org/assets/images/favicon.webp
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552910/WritingTeam%20Implement%20Template%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/552910/WritingTeam%20Implement%20Template%20Generator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // will automatically switch to writingteam when you click the generate template button

    const teamDropdown = document.querySelector('select[name="postAsUserId"]');
    function checkAccount() {
        console.log("Checking account...");
        const submitButton = document.querySelector('button[type="submit"]');
        const dataRaw = document.querySelector("#app")
        let isWritingTeam = null;


        console.log("Submit button found:", submitButton);
        console.log("Data found:", dataRaw);
        console.log("Dropdown found:", teamDropdown);

        const dataJSON = JSON.parse(dataRaw.getAttribute('data-page'));
        const userName = dataJSON?.props?.auth?.user?.displayName;

        if (userName) {
            console.log("Username found:", userName);
            isWritingTeam = userName.includes("WritingTeam");
            console.log("Is WritingTeam:", isWritingTeam);
        }

        if (teamDropdown) {
            // Set the value to the one for WritingTeam
            const option = teamDropdown?.querySelector('option[value="783382"]');
            console.log("Has access to WritingTeam:", option);
            if (option) {
                return true
            }
        } else {
            if (isWritingTeam) {
                return isWritingTeam
            }
            else {
            console.warn('Select element not found.');
            }
        }
    }


 // This function adds a new dropdown on the "Start new message thread" page, including input fields and generate button for the template.
    function addDropdownAndFieldsNewMessage() {
    console.log("addDropdownAndFieldsNewMessage called");

    if (checkAccount() === true) {
        console.log("Account check passed, creating dropdown...");

        // Create new div.
        const newDiv = document.createElement("div");
        newDiv.className = "WritingTeam-Template-Generator";
        newDiv.style.marginTop = "10px";
        newDiv.style.padding = "10px";
        newDiv.style.border = "1px solid #ccc";
        newDiv.style.borderRadius = "5px";
        console.log("Created main div");

        // Create new select button.
        const menu = document.createElement("select");
        menu.style.marginBottom = "5px";
        menu.style.width = "100%";

        // Option 1.
        var option1 = document.createElement("option");
        option1.innerText = "Implement Template";
        menu.appendChild(option1);

        // Append dropdown to newDiv.
        newDiv.appendChild(menu);
        console.log("Added dropdown menu");

        //List of acceptable title changes
        const acceptedTitleChanges = document.createElement('span');
        acceptedTitleChanges.textContent = 'Title changes: improve generic titles/consistency, fix capitalization/grammar/punctuation, add style';
        //acceptedTitleChanges.classList.add("input-field");
        //acceptedTitleChanges.style.display = "block";
        acceptedTitleChanges.style.marginBottom = "5px";
        acceptedTitleChanges.style.width = "100%";
        acceptedTitleChanges.style.color = "#ffffff";
        newDiv.appendChild(acceptedTitleChanges);

        //Input Field 1 (Title Changes).
        const titleChanges = document.createElement("input");
        titleChanges.setAttribute("type", "text");
        titleChanges.setAttribute("placeholder", "Title changes:");
        titleChanges.classList.add("input-field");
        titleChanges.style.display = "block";
        titleChanges.style.marginBottom = "5px";
        titleChanges.style.width = "100%";
        newDiv.appendChild(titleChanges);

        //List of acceptable description changes
        const acceptedDescriptionChanges = document.createElement('span');
        acceptedDescriptionChanges.textContent = 'Description changes: improve clarity/consistency, fix capitalization/grammar/punctuation, remove unnecessary parentheses/brackets';
        //acceptedTitleChanges.classList.add("input-field");
        //acceptedTitleChanges.style.display = "block";
        acceptedDescriptionChanges.style.marginBottom = "5px";
        acceptedDescriptionChanges.style.width = "100%";
        acceptedDescriptionChanges.style.color = "#ffffff";
        newDiv.appendChild(acceptedDescriptionChanges);

        // Input Field 2 (Description Changes).
        const descriptionChanges = document.createElement("input");
        descriptionChanges.setAttribute("type", "text");
        descriptionChanges.setAttribute("placeholder", "Description changes:");
        descriptionChanges.classList.add("input-field");
        descriptionChanges.style.display = "block";
        descriptionChanges.style.marginBottom = "5px";
        descriptionChanges.style.width = "100%";
        newDiv.appendChild(descriptionChanges);

        // Input Field 3 (Writer).
        const writer = document.createElement("input");
        writer.setAttribute("type", "text");
        writer.setAttribute("placeholder", "Rewritten by:");
        writer.classList.add("input-field");
        writer.style.display = "block";
        writer.style.marginBottom = "5px";
        writer.style.width = "100%";
        newDiv.appendChild(writer);

        // Input Field 4 (Implementer).
        const implementer = document.createElement("input");
        implementer.setAttribute("type", "text");
        implementer.setAttribute("placeholder", "Implemented by:");
        implementer.classList.add("input-field");
        implementer.style.display = "block";
        implementer.style.marginBottom = "5px";
        implementer.style.width = "100%";
        newDiv.appendChild(implementer);
        console.log("Added input fields");

        // Input Field 3 (Changelog URL).
        const changelogURL = document.createElement("input");
        changelogURL.setAttribute("type", "text");
        changelogURL.setAttribute("placeholder", "URL:");
        changelogURL.classList.add("input-field");
        changelogURL.style.display = "block";
        changelogURL.style.marginBottom = "5px";
        changelogURL.style.width = "100%";
        newDiv.appendChild(changelogURL);

        // Generate Button.
        const generateButton = document.createElement("button");
        generateButton.type = "button"; // Prevent form submission.
        generateButton.innerHTML = "Generate template";
        generateButton.style.marginTop = "5px";
        generateButton.style.backgroundColor = "#4a5568"; // Darker gray.
        generateButton.style.color = "white";
        generateButton.style.padding = "5px 15px";
        generateButton.style.borderRadius = "4px";
        generateButton.style.border = "none";
        generateButton.style.cursor = "pointer";
        generateButton.addEventListener("click", function(e) {
            e.preventDefault(); // Extra prevention of default behavior.
            e.stopPropagation(); // Stop event from bubbling up.
            console.log("Generate button clicked");
            if (teamDropdown) {
                teamDropdown.value = '783382';

                // Dispatch a change event in case there's JS that reacts to it
                const event = new Event('change', { bubbles: true });
                teamDropdown.dispatchEvent(event);

                console.log('WritingTeam selected.');
            }
            pasteTemplateIntoTextArea();
        });
        // Add hover effect.
        generateButton.addEventListener("mouseenter", function() {
            this.style.backgroundColor = "#2d3748";
        });
        generateButton.addEventListener("mouseleave", function() {
            this.style.backgroundColor = "#4a5568";
        });
        newDiv.appendChild(generateButton);
        console.log("Added generate button");

        // Add new div below toolbar.
        const buttonToolbar = document.querySelector('.w-full.rounded.bg-embed.p-0');
        console.log("Button toolbar found:", buttonToolbar);

        if (buttonToolbar) {
            buttonToolbar.parentNode.insertBefore(newDiv, buttonToolbar.nextSibling);
            console.log("Template generator div inserted into DOM");
        } else {
            // Try alternative insertion point if toolbar not found.
            console.log("Toolbar not found, trying alternative insertion...");
            const messageForm = document.querySelector('form');
            if (messageForm) {
                messageForm.insertBefore(newDiv, messageForm.firstChild);
                console.log("Template generator div inserted at top of form");
            } else {
                console.log("ERROR: Could not find insertion point for template generator");
            }
        }
    } else {
        console.log("Account check failed - not adding dropdown");
    }
    return;
}

// This function adds a new dropdown on the "Reply to message thread" page, including a generate button for the template.
function addDropdownReply() {
    console.log("addDropdownReply called");

    if (checkAccount() === true) {
        console.log("Account check passed, creating reply dropdown...");

        // Create new div.
        const newDiv = document.createElement("div");
        newDiv.className = "WritingTeam-Template-Generator";
        newDiv.style.marginTop = "10px";
        newDiv.style.padding = "10px";
        newDiv.style.border = "1px solid #ccc";
        newDiv.style.borderRadius = "5px";

        // Create new select button.
        const menu = document.createElement("select");
        menu.style.marginBottom = "5px";
        menu.style.width = "100%";

        // Option 1.
        var option1 = document.createElement("option");
        option1.innerText = "Implement Template";
        menu.appendChild(option1);

        // Append dropdown to newDiv.
        newDiv.appendChild(menu);
        console.log("Added reply dropdown menu");

        // Generate Button.
        const generateButton = document.createElement("button");
        generateButton.type = "button"; // Prevent form submission.
        generateButton.innerHTML = "Generate template";
        generateButton.style.marginTop = "5px";
        generateButton.style.backgroundColor = "#4a5568"; // Darker gray.
        generateButton.style.color = "white";
        generateButton.style.padding = "5px 15px";
        generateButton.style.borderRadius = "4px";
        generateButton.style.border = "none";
        generateButton.style.cursor = "pointer";
        generateButton.addEventListener("click", function(e) {
            e.preventDefault(); // Extra prevention of default behavior.
            e.stopPropagation(); // Stop event from bubbling up.
            console.log("Generate reply button clicked");
            pasteTemplateIntoTextArea();
        });
        // Add hover effect.
        generateButton.addEventListener("mouseenter", function() {
            this.style.backgroundColor = "#2d3748";
        });
        generateButton.addEventListener("mouseleave", function() {
            this.style.backgroundColor = "#4a5568";
        });
        newDiv.appendChild(generateButton);

        // Add new div below toolbar.
        const buttonToolbar = document.querySelector('.w-full.rounded.bg-embed.p-2');
        console.log("Button toolbar found:", buttonToolbar);

        if (buttonToolbar) {
            buttonToolbar.parentNode.insertBefore(newDiv, buttonToolbar.nextSibling);
            console.log("Reply template generator div inserted into DOM");
        } else {
            // Try alternative insertion point if toolbar not found.
            console.log("Toolbar not found, trying alternative insertion...");
            const messageForm = document.querySelector('form');
            if (messageForm) {
                messageForm.insertBefore(newDiv, messageForm.firstChild);
                console.log("Reply template generator div inserted at top of form");
            } else {
                console.log("ERROR: Could not find insertion point for reply template generator");
            }
        }
    } else {
        console.log("Account check failed - not adding reply dropdown");
    }
    return;
}

function generateTemplateNewMessage() {
    console.log("generateTemplateNewMessage called");
    var newDiv = document.querySelector('.WritingTeam-Template-Generator');
    if (!newDiv) {
        console.log("ERROR: Template generator div not found");
        return "";
    }

    var inputFields = newDiv.querySelectorAll('input[type="text"]');
    console.log("Found input fields:", inputFields.length);

    // Get values of fields.
    //Old line: var developerNameField = inputFields[0].value;
    var devNameDiv = document.querySelector('.flex.flex-col.gap-1');
    console.log("Developer div found:", devNameDiv);

    var devName = "";
    if (devNameDiv) {
        var devNameSpan = devNameDiv.querySelector('span');
        if (devNameSpan) {
            devName = devNameSpan.textContent;
            console.log("Found username:", devName);
        }
    }

    var titleChanges = inputFields[0].value;
    var descriptionChanges = inputFields[1].value;
    var writer = inputFields[2].value;
    var implementer = inputFields[3].value;
    var changelogURL = inputFields[4].value;

    //console.log("Developer name:", developerNameField);
    console.log("Writer: ", writer);
    console.log("Implementer: ", implementer);
    console.log("Title changes: ", titleChanges);
    console.log("Description changes: ", descriptionChanges);
    console.log("Changelog URL: ", changelogURL);

    // Get value of select, and return template based on the value.
    var selectField = newDiv.querySelector('select');
    console.log("Selected option:", selectField.value);

    var titleField = document.querySelector('[name="title"]');
    console.log("Title field found:", titleField);

    if (selectField.value === "Implement Template") {
        return `This set's titles and descriptions have been updated by the Writing Team with the following changes:
- Changed titles to ${titleChanges}
- Changed descriptions to ${descriptionChanges}


Set rewritten by: [user=${writer}]
Implemented by: [user=${implementer}]


[url=${changelogURL}]Changelog[/url]`;
        }
        return "";
    }

// This function puts the template into the message box after the "Generate template" button was clicked.
function pasteTemplateIntoTextArea() {
    console.log("pasteTemplateIntoTextArea called");
    var template = "";

    if (document.URL.includes("https://retroachievements.org/forums/topic/")) {
        console.log("Generating template for new message");
        template = generateTemplateNewMessage();
    }

    console.log("Generated template:", template);

    if (template) {
        var textArea = document.querySelector('textarea[name="body"]');
        console.log("Textarea found:", textArea);

        if (textArea) {
            // Focus the textarea first.
            textArea.focus();

            // Set the value using native setter to bypass React.
            const nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
            nativeTextAreaValueSetter.call(textArea, template);

            // Trigger multiple events to ensure React notices the change.
            const inputEvent = new Event('input', { bubbles: true });
            const changeEvent = new Event('change', { bubbles: true });

            textArea.dispatchEvent(inputEvent);
            textArea.dispatchEvent(changeEvent);

            // Also try triggering a React-specific event if needed.
            const reactEvent = new Event('input', { bubbles: true, cancelable: true });
            textArea.dispatchEvent(reactEvent);

            console.log("Template pasted into textarea with React-compatible events");
            console.log("Textarea value after paste:", textArea.value.substring(0, 50) + "...");
        } else {
            console.log("ERROR: Could not find textarea element");
        }
    } else {
        console.log("No template generated");
    }
}


// Initialize the script when the page loads.
function init() {
    console.log("=== WritingTeam Template Generator Initializing ===");
    console.log("Current URL:", document.URL);
    console.log("Document ready state:", document.readyState);

    if (document.URL.includes("https://retroachievements.org/forums/topic/")) {
        console.log("Detected: Create new message page");
        addDropdownAndFieldsNewMessage();
    } else if (document.URL.includes("https://retroachievements.org/message-thread/")) {
        console.log("Detected: Reply to message thread page");
        addDropdownReply();
    } else {
        console.log("Not on a recognized page - script will not activate");
    }
}

// Run the initialization.
console.log("Script loaded, waiting for DOM...");

// Add a small delay to ensure DOM is fully loaded.
setTimeout(function() {
    console.log("Starting initialization after delay...");
    init();
}, 500);

})();