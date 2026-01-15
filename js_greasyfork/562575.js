// ==UserScript==
// @name         Default CR Templates
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Adds pre written CR template
// @author       yyashu@amazon.com
// @include      https://code.amazon.com/reviews/*
// @include      https://code.amazon.com/reviews/*/revisions/*
// @compatible   Greasemonkey
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/562575/Default%20CR%20Templates.user.js
// @updateURL https://update.greasyfork.org/scripts/562575/Default%20CR%20Templates.meta.js
// ==/UserScript==

/*
1.2 - Updated templates and improved error handling
1.1 - Added support to lock drop down when not in edit mode in CR
*/

var wikiLink = "https://w.amazon.com/bin/view/BuyberRiskPrevention/AccountIntegrity/Hawks/CR-Template/";
var genericTemplate;
var bugFixTemplate;
var featureTemplate;
var minimalTemplate;

function GM_wait() {
    // Wait for page elements to load
    if (typeof $("div.awsui-util-action-stripe-group").html() == 'undefined') {
        window.setTimeout(GM_wait, 100);
    }
    // Ensures that button is added only once
    else if ($("div.awsui-util-action-stripe-group").find('.dropdown-btns').length > 0) {
        window.setTimeout(GM_wait, 1000);
    }
    // Add the template functionality
    else {
        $ = unsafeWindow.jQuery;
        addCRTemplate();
        window.setTimeout(GM_wait, 1000);
    }
}

function addCRTemplate() {
    function insertCRTemplate(template) {
        var crDescription = $('#codex-description');
        if (crDescription.length > 0) {
            crDescription.val(template);
            crDescription.change();
        } else {
            console.error('CR description field not found');
        }
    }

    function addDefaultCRButton() {
        var actionStripe = $("div.awsui-util-action-stripe-group");

        var dropdownBtn = $('<awsui-button-dropdown text="CR Templates">' +
            '    <div class="awsui-button-dropdown-container">' +
            '        <awsui-button id="template-dropdown-btn">' +
            '            <button class="awsui-button awsui-button-variant-primary awsui-hover-child-icons">' +
            '                <span awsui-button-region="text">CR Templates</span>' +
            '                <awsui-icon class="awsui-button-icon awsui-button-icon-right">' +
            '                    <span class="awsui-icon awsui-icon-size-normal awsui-icon-variant-normal">' +
            '                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">' +
            '                            <polygon class="filled stroke-linejoin-round" points="4 5 12 5 8 11 4 5"></polygon>' +
            '                        </svg>' +
            '                    </span>' +
            '                </awsui-icon>' +
            '            </button>' +
            '            <div class="awsui-button-dropdown awsui-button-dropdown-wrapped dropdown-btns" style="width: 200px;">' +
            '                <ul id="generic-template" class="awsui-button-dropdown-items">' +
            '                    <li class="awsui-button-dropdown-item">Generic Template</li>' +
            '                </ul>' +
            '                <ul id="feature-template" class="awsui-button-dropdown-items">' +
            '                    <li class="awsui-button-dropdown-item">Feature Template</li>' +
            '                </ul>' +
            '                <ul id="bugfix-template" class="awsui-button-dropdown-items">' +
            '                    <li class="awsui-button-dropdown-item">Bug Fix Template</li>' +
            '                </ul>' +
            '                <ul id="minimal-template" class="awsui-button-dropdown-items">' +
            '                    <li class="awsui-button-dropdown-item">Minimal Template</li>' +
            '                </ul>' +
            '            </div>' +
            '        </awsui-button>' +
            '    </div>' +
            '</awsui-button-dropdown>');

        actionStripe.append(dropdownBtn);
        actionStripe.find('.dropdown-btns').hide();

        // Toggle dropdown visibility
        actionStripe.find('#template-dropdown-btn').click(function() {
            var editableElements = $("div.awsui-util-action-stripe-group").find('.awsui-hover-child-icons').length;

            if (actionStripe.find('.dropdown-btns').is(':visible')) {
                actionStripe.find('.dropdown-btns').hide();
            } else if (editableElements >= 3) { // Only show if in edit mode
                actionStripe.find('.dropdown-btns').show();
            }
        });

        // Template click handlers
        actionStripe.find('#generic-template').click(function() {
            insertCRTemplate(genericTemplate);
            actionStripe.find('.dropdown-btns').hide();
        });

        actionStripe.find('#feature-template').click(function() {
            insertCRTemplate(featureTemplate);
            actionStripe.find('.dropdown-btns').hide();
        });

        actionStripe.find('#bugfix-template').click(function() {
            insertCRTemplate(bugFixTemplate);
            actionStripe.find('.dropdown-btns').hide();
        });

        actionStripe.find('#minimal-template').click(function() {
            insertCRTemplate(minimalTemplate);
            actionStripe.find('.dropdown-btns').hide();
        });
    }

    function getTemplate() {
        GM_xmlhttpRequest({
            method: "GET",
            url: wikiLink,
            onload: function(response) {
                try {
                    genericTemplate = parse(response.responseText, "generic_template");
                    featureTemplate = parse(response.responseText, "feature_template");
                    bugFixTemplate = parse(response.responseText, "bugfix_template");
                    minimalTemplate = parse(response.responseText, "minimal_template");

                    console.log('Templates loaded successfully');
                } catch (error) {
                    console.error('Error loading templates:', error);
                    // Set fallback templates
                    setFallbackTemplates();
                }
            },
            onerror: function(error) {
                console.error('Failed to fetch templates from wiki:', error);
                setFallbackTemplates();
            }
        });
    }

    function parse(responseText, id) {
        try {
            var $html = $(responseText);
            var templateText = $html.find("#" + id).first().text();

            if (templateText.length > 0) {
                return templateText;
            } else {
                console.warn(`Template ${id} not found in wiki`);
                return getFallbackTemplate(id);
            }
        } catch (error) {
            console.error(`Error parsing template ${id}:`, error);
            return getFallbackTemplate(id);
        }
    }

    function setFallbackTemplates() {
        genericTemplate = getFallbackTemplate("generic_template");
        featureTemplate = getFallbackTemplate("feature_template");
        bugFixTemplate = getFallbackTemplate("bugfix_template");
        minimalTemplate = getFallbackTemplate("minimal_template");
    }

    function getFallbackTemplate(templateId) {
        const fallbackTemplates = {
            "generic_template": `### **Problem/Feature**
* Explain in detail about the Problem/Feature.

### **Solution/Implementation**
* Include information about the solution and changes made as part of this CR.

***

### **Issue/Feature**
* [SIM Issue](https://issues.amazon.com/issues/XXX-) - Brief description
* [Asana Task](https://app.asana.com/0/project/task) - Task description

***

### **Testing**
* Local: brazil-build + brazil-build release ✅
* Manual testing: [What you tested]

***

### **Screenshots**
* Before: ![Before](link)
* After: ![After](link)
* Testing: ![Test Results](link)

***

### **Links**
* [SIM](https://issues.amazon.com/issues/XXX-)
* [Asana](https://app.asana.com/0/project/task)`,

            "bugfix_template": `### **Problem/Feature**
* Explain in detail about the Problem/Feature.

### **Solution/Implementation**
* Include information about the solution and changes made as part of this CR.

***

### **Bug Description**
* Describe the bug and its impact

### **Root Cause**
* What caused the bug to occur

***

### **Issue/Feature**
* [SIM Issue](https://issues.amazon.com/issues/XXX-) - Bug report
* [Asana Task](https://app.asana.com/0/project/task) - Fix task

***

### **Testing**
* Local: brazil-build + brazil-build release ✅
* Bug reproduction: [How you reproduced the bug]
* Fix verification: [How you verified the fix]

***

### **Screenshots**
* Bug: ![Bug](Screenshot showing the bug)
* Fixed: ![Fixed](Screenshot showing fix working)`,

            "feature_template": `### **Problem/Feature**
* Explain in detail about the Problem/Feature.

### **Solution/Implementation**
* Include information about the solution and changes made as part of this CR.

***

### **Feature Description**
* Describe the new feature and its purpose

***

### **Issue/Feature**
* [SIM Issue](https://issues.amazon.com/issues/XXX-) - Feature request
* [Asana Task](https://app.asana.com/0/project/task) - Implementation task

***

### **Testing**
* Local: brazil-build + brazil-build release ✅
* Feature testing: [How you tested the new feature]

***

### **Screenshots**
* Feature: ![Feature](Screenshot of new feature)
* Testing: ![Tests](Screenshot of test results)`,

            "minimal_template": `### **Problem/Feature**
* Explain in detail about the Problem/Feature.

### **Solution/Implementation**
* Include information about the solution and changes made as part of this CR.

***

### **Issue/Feature**
* SIM: [Link](https://issues.amazon.com/issues/XXX-)
* Asana: [Link](https://app.asana.com/0/project/task)

### **Testing**
* Local: brazil-build + brazil-build release ✅

### **Screenshots**
* Before: ![Before](link)
* After: ![After](link)`
        };

        return fallbackTemplates[templateId] || "Error loading template";
    }

    // Initialize
    getTemplate();
    addDefaultCRButton();
}

// Start the script
GM_wait();
