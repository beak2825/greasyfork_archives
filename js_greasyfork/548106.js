// ==UserScript==
// @name         Auto Fill Shipping Information
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Auto fill form fields on Zyxel Marketplace TradeUp Program Shipping Information page with multiple templates
// @author       Rick.Chen
// @match        https://beta.marketplace.zyxel.com/TradeUpProgram/Shipping
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/548106/Auto%20Fill%20Shipping%20Information.user.js
// @updateURL https://update.greasyfork.org/scripts/548106/Auto%20Fill%20Shipping%20Information.meta.js
// ==/UserScript==

/*
Changelog:

v1.0  - Auto fill in one template
v1.1  - Add debug function, only show console log/error when debug=1.
v1.2  - Add GUI icon
v1.3  - Add a Reset button to fix temporary storage bug
v1.4  - Add New/Delete button, user can add/delete template
*/

(function() {
    'use strict';

    // Set debug mode. 1: enable, 0: disable
    var debug = 1;

    // Default templates
    var defaultTemplates = {
        'USA user 1': {
            name: 'USA user 1',
            data: {
                firstName: 'SVD',
                lastName: 'TEST',
                company: 'ZYXEL',
                phone: '123',
                street1: 'North Miller Street',
                street2: '130',
                city: 'Anaheim',
                state: 'California',
                zip: '92806'
            }
        },
        'Error template': {
            name: 'Error Message',
            data: {
                firstName: 'Rick',
                lastName: 'Error',
                company: '',
                phone: '123',
                street1: '123',
                street2: 'Apt 4B',
                city: 'Los Angeles',
                state: 'California',
                zip: '00000'
            }
        },
        'empty template': {
            name: 'empty template',
            data: {
                firstName: '',
                lastName: '',
                company: '',
                phone: '',
                street1: '',
                street2: '',
                city: '',
                state: '',
                zip: ''
            }
        }
    };

    // Load templates from storage or use defaults
    var templates = GM_getValue('templates', defaultTemplates);
    var currentTemplate = GM_getValue('currentTemplate', 'template1');

    /**
     * Save templates to storage
     */
    function saveTemplates() {
        GM_setValue('templates', templates);
    }

    /**
     * Create template selector UI
     */
    function createTemplateSelector() {
        // Create container
        var container = document.createElement('div');
        container.id = 'template-selector';
        container.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: white;
            border: 2px solid #007bff;
            border-radius: 8px;
            padding: 15px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            z-index: 10000;
            font-family: Arial, sans-serif;
            min-width: 250px;
        `;

        // Create title
        var title = document.createElement('h3');
        title.textContent = 'Shipping Information Auto Fill';
        title.style.cssText = 'margin: 0 0 10px 0; color: #007bff; font-size: 16px;';
        container.appendChild(title);

        // Create template selector
        var select = document.createElement('select');
        select.id = 'template-select';
        select.style.cssText = `
            width: 100%;
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
            margin-bottom: 10px;
            font-size: 14px;
        `;

        // Add template options
        Object.keys(templates).forEach(function(templateKey) {
            var option = document.createElement('option');
            option.value = templateKey;
            option.textContent = templates[templateKey].name;
            if (templateKey === currentTemplate) {
                option.selected = true;
            }
            select.appendChild(option);
        });

        // Add change event listener
        select.addEventListener('change', function() {
            currentTemplate = this.value;
            GM_setValue('currentTemplate', currentTemplate);
            if (debug) console.log('Selected template:', currentTemplate);
        });

        container.appendChild(select);

        // Create fill button
        var fillButton = document.createElement('button');
        fillButton.textContent = '🚀 Fill Form';
        fillButton.style.cssText = `
            background: #007bff;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            margin-right: 5px;
        `;
        fillButton.addEventListener('click', function() {
            autoFillForm(templates[currentTemplate].data);
        });

        // Create edit button
        var editButton = document.createElement('button');
        editButton.textContent = '✏️ Edit';
        editButton.style.cssText = `
            background: #28a745;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        `;
        editButton.addEventListener('click', function() {
            showTemplateEditor();
        });

        // Create button container
        var buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = 'display: flex; gap: 5px;';
        buttonContainer.appendChild(fillButton);
        buttonContainer.appendChild(editButton);

        // Add new template button
        var newTemplateButton = document.createElement('button');
        newTemplateButton.textContent = '➕ New';
        newTemplateButton.style.cssText = `
            background: #17a2b8;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        `;
        newTemplateButton.addEventListener('click', function() {
            createNewTemplate();
        });
        buttonContainer.appendChild(newTemplateButton);

        // Create delete button
        var deleteButton = document.createElement('button');
        deleteButton.textContent = '🗑️ Delete';
        deleteButton.style.cssText = `
            background: #dc3545;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        `;
        deleteButton.addEventListener('click', function() {
            if (confirm('Are you sure you want to delete this template?')) {
                deleteCurrentTemplate();
            }
        });
        buttonContainer.appendChild(deleteButton);

        // Add reset button
        var resetButton = document.createElement('button');
        resetButton.textContent = '🔄 Reset All';
        resetButton.style.cssText = `
            background: #ffc107;
            color: #212529;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        `;
        resetButton.addEventListener('click', function() {
            if (confirm('Are you sure you want to reset all templates to default? This will delete all custom templates.')) {
                resetAllTemplates();
            }
        });
        buttonContainer.appendChild(resetButton);

        container.appendChild(buttonContainer);

        // Create close button
        var closeButton = document.createElement('button');
        closeButton.textContent = '✕';
        closeButton.style.cssText = `
            position: absolute;
            top: 5px;
            right: 5px;
            background: #dc3545;
            color: white;
            border: none;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 12px;
        `;
        closeButton.addEventListener('click', function() {
            container.remove();
            createFloatingButton();
        });
        container.appendChild(closeButton);

        // Add to page
        document.body.appendChild(container);
    }

    /**
     * Show template editor modal
     */
    function showTemplateEditor() {
        // Create modal overlay
        var overlay = document.createElement('div');
        overlay.id = 'template-editor-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 10001;
            display: flex;
            justify-content: center;
            align-items: center;
        `;

        // Create modal
        var modal = document.createElement('div');
        modal.style.cssText = `
            background: white;
            border-radius: 8px;
            padding: 20px;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
        `;

        var template = templates[currentTemplate];
        var data = template.data;

        modal.innerHTML = `
            <h3 style="margin: 0 0 20px 0; color: #007bff;">Edit Template: ${template.name}</h3>
            <div style="display: grid; gap: 10px;">
                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: bold;">Template Name</label>
                    <input type="text" id="template-name" value="${template.name}" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                </div>
                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: bold;">First Name</label>
                    <input type="text" id="edit-firstName" value="${data.firstName}" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                </div>
                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: bold;">Last Name</label>
                    <input type="text" id="edit-lastName" value="${data.lastName}" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                </div>
                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: bold;">Company/House Name</label>
                    <input type="text" id="edit-company" value="${data.company}" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                </div>
                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: bold;">Phone Number</label>
                    <input type="text" id="edit-phone" value="${data.phone}" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                </div>
                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: bold;">Street Address</label>
                    <input type="text" id="edit-street1" value="${data.street1}" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                </div>
                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: bold;"></label>
                    <input type="text" id="edit-street2" value="${data.street2}" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                </div>
                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: bold;">City</label>
                    <input type="text" id="edit-city" value="${data.city}" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                </div>
                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: bold;">State/Province</label>
                    <input type="text" id="edit-state" value="${data.state}" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                </div>
                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: bold;">Zip/Postal Code</label>
                    <input type="text" id="edit-zip" value="${data.zip}" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                </div>
            </div>
            <div style="display: flex; gap: 10px; margin-top: 20px;">
                <button id="save-template" style="background: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">Save</button>
                <button id="cancel-edit" style="background: #6c757d; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">Cancel</button>
            </div>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // Add event listeners
        document.getElementById('save-template').addEventListener('click', function() {
            // Update template data
            templates[currentTemplate].name = document.getElementById('template-name').value;
            templates[currentTemplate].data = {
                firstName: document.getElementById('edit-firstName').value,
                lastName: document.getElementById('edit-lastName').value,
                company: document.getElementById('edit-company').value,
                phone: document.getElementById('edit-phone').value,
                street1: document.getElementById('edit-street1').value,
                street2: document.getElementById('edit-street2').value,
                city: document.getElementById('edit-city').value,
                state: document.getElementById('edit-state').value,
                zip: document.getElementById('edit-zip').value
            };

            saveTemplates();
            overlay.remove();

            // Refresh template selector if it exists
            var existingSelector = document.getElementById('template-selector');
            if (existingSelector) {
                existingSelector.remove();
                createTemplateSelector();
            }

            // Remove floating button if it exists
            var existingFloatingButton = document.getElementById('template-floating-button');
            if (existingFloatingButton) {
                existingFloatingButton.remove();
            }

            if (debug) console.log('Template saved:', currentTemplate);
        });

        document.getElementById('cancel-edit').addEventListener('click', function() {
            overlay.remove();
        });

        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                overlay.remove();
            }
        });
    }

    /**
     * Auto fill form fields with predefined data
     * @param {Object} data - The data object containing field values
     */
    function autoFillForm(data) {
        if (debug) console.log('Starting auto fill process...');

        // Fill text input fields
        var textFields = {
            'firstName': data.firstName,
            'lastName': data.lastName,
            'company': data.company,
            'phone': data.phone,
            'street1': data.street1,
            'street2': data.street2,
            'city': data.city,
            'zip': data.zip
        };

        // Fill each text field
        Object.keys(textFields).forEach(function(fieldId) {
            var element = document.getElementById(fieldId);
            if (element) {
                element.value = textFields[fieldId];
                // Trigger change event to ensure form validation recognizes the change
                element.dispatchEvent(new Event('input', { bubbles: true }));
                element.dispatchEvent(new Event('change', { bubbles: true }));
                if (debug) console.log('Filled field:', fieldId, 'with value:', textFields[fieldId]);
            } else {
                if (debug) console.warn('Field not found:', fieldId);
            }
        });

        // Handle state dropdown selection
        var stateElement = document.getElementById('state');
        if (stateElement) {
            // Try to find the option with the specified text
            var options = stateElement.options;
            for (var i = 0; i < options.length; i++) {
                if (options[i].text === data.state) {
                    stateElement.selectedIndex = i;
                    stateElement.dispatchEvent(new Event('change', { bubbles: true }));
                    if (debug) console.log('Selected state:', data.state);
                    break;
                }
            }
        } else {
            if (debug) console.warn('State dropdown not found');
        }

        if (debug) console.log('Auto fill process completed');
    }

    /**
     * Create a new template
     */
    function createNewTemplate() {
        var templateCount = Object.keys(templates).length + 1;
        var newTemplateKey = 'template' + templateCount;

        // Create new template with default values
        templates[newTemplateKey] = {
            name: 'New Template ' + templateCount,
            data: {
                firstName: '',
                lastName: '',
                company: '',
                phone: '',
                street1: '',
                street2: '',
                city: '',
                state: '',
                zip: ''
            }
        };

        // Set as current template
        currentTemplate = newTemplateKey;
        GM_setValue('currentTemplate', currentTemplate);

        // Save templates
        saveTemplates();

        // Refresh template selector
        var existingSelector = document.getElementById('template-selector');
        if (existingSelector) {
            existingSelector.remove();
            createTemplateSelector();
        }

        // Show editor for the new template
        showTemplateEditor();

        if (debug) console.log('Created new template:', newTemplateKey);
    }

    /**
     * Delete current template
     */
    function deleteCurrentTemplate() {
        if (Object.keys(templates).length <= 1) {
            alert('Cannot delete the last template. Please create a new one first.');
            return;
        }

        delete templates[currentTemplate];

        // Set first available template as current
        var availableTemplates = Object.keys(templates);
        currentTemplate = availableTemplates[0];
        GM_setValue('currentTemplate', currentTemplate);

        // Save templates
        saveTemplates();

        // Refresh template selector
        var existingSelector = document.getElementById('template-selector');
        if (existingSelector) {
            existingSelector.remove();
            createTemplateSelector();
        }

        if (debug) console.log('Deleted template, current:', currentTemplate);
    }

    /**
     * Reset all templates to default
     */
    function resetAllTemplates() {
        // Reset templates to default
        templates = JSON.parse(JSON.stringify(defaultTemplates));
        currentTemplate = 'template1';

        // Save to storage
        GM_setValue('templates', templates);
        GM_setValue('currentTemplate', currentTemplate);

        // Refresh template selector
        var existingSelector = document.getElementById('template-selector');
        if (existingSelector) {
            existingSelector.remove();
            createTemplateSelector();
        }

        if (debug) console.log('All templates reset to default');
        alert('All templates have been reset to default values.');
    }

    /**
     * Create floating button to reopen template selector
     */
    function createFloatingButton() {
        var floatingButton = document.createElement('button');
        floatingButton.id = 'template-floating-button';
        floatingButton.textContent = '📝';
        floatingButton.title = 'Open Auto Fill Templates';
        floatingButton.style.cssText = `
            position: fixed;
            top: 70px;
            right: 40px;
            width: 50px;
            height: 50px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            font-size: 20px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            z-index: 9999;
            transition: all 0.3s ease;
        `;

        floatingButton.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.background = '#0056b3';
        });

        floatingButton.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.background = '#007bff';
        });

        floatingButton.addEventListener('click', function() {
            createTemplateSelector();
            this.remove();
        });

        document.body.appendChild(floatingButton);
    }

    /**
     * Wait for page to load and then create template selector
     */
    function waitForPageAndInit() {
        // Check if we're on the correct page
        if (window.location.href.includes('/TradeUpProgram/Shipping')) {
            // Create template selector
            createTemplateSelector();

            // Auto fill with current template if form is ready
            var firstNameField = document.getElementById('firstName');
            if (firstNameField) {
                autoFillForm(templates[currentTemplate].data);
            }
        }
    }

    // Start the process when page loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForPageAndInit);
    } else {
        waitForPageAndInit();
    }

})();