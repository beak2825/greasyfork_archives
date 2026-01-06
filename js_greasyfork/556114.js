// ==UserScript==
// @name         Content Validator
// @namespace    https://github.com/MajaBukvic/Scripts
// @version      3.1
// @description  Validates Watson SOP content based on standardized rules, accessibility, and CSS compliance
// @author       Maja Bukvic
// @match        https://share.amazon.com/sites/amazonwatson/*
// @grant        GM_download
// @license      MIT
// @supportURL   https://github.com/MajaBukvic/Scripts/issues
// @homepage     https://github.com/MajaBukvic/Scripts/tree/main/Content-validator
// @downloadURL https://update.greasyfork.org/scripts/556114/Content%20Validator.user.js
// @updateURL https://update.greasyfork.org/scripts/556114/Content%20Validator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ===========================================
    // USAGE LOGGING CONFIGURATION
    // ===========================================

    const LOG_CONFIG = {
        siteUrl: 'https://share.amazon.com/sites/amazonwatson',
        listName: 'TampermonkeyUsageLog',
        entityType: 'SP.Data.TampermonkeyUsageLogListItem',
        scriptName: 'Content Validator',

        // Internal column names from SharePoint
        columns: {
            title: 'Title',
            username: 'tg5f',
            action: 'aflk',
            pageUrl: 'k3hk',
            scriptName: 'pk8k'
        }
    };

    // ===========================================
    // USAGE LOGGING FUNCTIONS
    // ===========================================

    function logUsage(action) {
        try {
            fetch(LOG_CONFIG.siteUrl + '/_api/contextinfo', {
                method: 'POST',
                headers: { 'Accept': 'application/json;odata=verbose' },
                credentials: 'include'
            })
            .then(function(r) { return r.json(); })
            .then(function(digestData) {
                var digest = digestData.d.GetContextWebInformation.FormDigestValue;
                var listUrl = LOG_CONFIG.siteUrl + "/_api/web/lists/getbytitle('" + LOG_CONFIG.listName + "')/items";

                var itemData = {
                    '__metadata': { 'type': LOG_CONFIG.entityType }
                };

                // Use internal column names
                itemData[LOG_CONFIG.columns.title] = new Date().toISOString();
                itemData[LOG_CONFIG.columns.username] = getLogUsername();
                itemData[LOG_CONFIG.columns.action] = action;
                itemData[LOG_CONFIG.columns.pageUrl] = window.location.href.substring(0, 250);
                itemData[LOG_CONFIG.columns.scriptName] = LOG_CONFIG.scriptName;

                return fetch(listUrl, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json;odata=verbose',
                        'Content-Type': 'application/json;odata=verbose',
                        'X-RequestDigest': digest
                    },
                    credentials: 'include',
                    body: JSON.stringify(itemData)
                });
            })
            .then(function(r) {
                if (r.ok) {
                    console.log('Usage logged:', action);
                }
            })
            .catch(function(e) {
                // Fail silently - don't break the main script
                console.log('Usage logging skipped');
            });
        } catch (e) {
            // Fail silently
        }
    }

    function getLogUsername() {
        // Try SharePoint context first
        if (typeof _spPageContextInfo !== 'undefined') {
            if (_spPageContextInfo.userDisplayName) {
                return _spPageContextInfo.userDisplayName;
            }
            if (_spPageContextInfo.userLoginName) {
                return _spPageContextInfo.userLoginName;
            }
        }

        // Try common page elements
        var selectors = ['.ms-core-menu-title', '#USER_NAME', '.user-name', '#userDisplayName'];
        for (var i = 0; i < selectors.length; i++) {
            var el = document.querySelector(selectors[i]);
            if (el && el.textContent.trim()) {
                return el.textContent.trim();
            }
        }

        return 'unknown';
    }

    // ===========================================
    // CONFIGURATION
    // ===========================================

    const CONFIG = {
        // Core stylesheets - at least ONE must be present
        coreStylesheets: [
            'watson-sop-standard.css',
            'interactive_features.css',
            'buttons.css',
            'function_menu.css'
        ],

        // Table stylesheets - required if tables exist
        tableStylesheets: [
            'grey_2_tone.css',
            'whitetable.css',
            'keytermstable.css',
            'definitiontable.css'
        ],

        // System stylesheets to ignore
        systemStylesheets: [
            'madcap',
            'corev15',
            'core.css',
            'controls',
            'search',
            'sprite',
            'skinsupport'
        ],

        // Standard button classes
        buttonClasses: [
            'button--1', 'button--2', 'button--3', 'button--4',
            'animated_button_red', 'animated_button_green',
            'collapsebtn', 'expandbtn', 'pulsing_button',
            'update-button', 'collapsible', 'collapsible-hide',
            'tablinks', 'dropbtn', 'filter-button'
        ],

        // Standard callout classes
        calloutClasses: [
            'example', 'exception', 'bestPractice', 'note', 'tip',
            'warning', 'important', 'SOPupdate', 'quote',
            'annotation', 'accessibility', 'template'
        ],

        // Standard image classes
        imageClasses: [
            'flowchart', 'zoom', 'flag', 'icon', 'no_border', 'tiny'
        ],

        // Standard colored margin classes
        coloredMarginClasses: [
            'green', 'blue', 'orange', 'pink', 'red', 'yellow',
            'purple', 'darkblue', 'darkgreen', 'hotpink', 'aqua', 'sage'
        ],

        // Standard emphasis box classes
        emphasisBoxClasses: [
            'orangeBox', 'blueBox', 'greyBox', 'inkBox'
        ],

        // Standard list classes
        listClasses: [
            'disc', 'Square', 'Circle', 'Important_reminders'
        ],

        // Non-standard fonts to flag
        nonStandardFonts: [
            'Arial', 'Helvetica', 'Calibri', 'Times New Roman',
            'Verdana', 'Georgia', 'Tahoma', 'Comic Sans'
        ],

        // Deprecated HTML attributes
        deprecatedAttributes: [
            { attr: 'align', suggestion: 'Use CSS text-align or margin instead' },
            { attr: 'valign', suggestion: 'Use CSS vertical-align instead' },
            { attr: 'bgcolor', suggestion: 'Use CSS background-color instead' },
            { attr: 'hspace', suggestion: 'Use CSS margin instead' },
            { attr: 'vspace', suggestion: 'Use CSS margin instead' },
            { attr: 'nowrap', suggestion: 'Use CSS white-space: nowrap instead' },
            { attr: 'background', suggestion: 'Use CSS background-image instead' }
        ]
    };

    // ===========================================
    // INITIALIZATION
    // ===========================================

    function addValidationButton() {
        const menuContainer = document.querySelector('div[style*="position:relative;float:right;right:25px;padding-top:7px;"]');

        if (menuContainer) {
            const span = document.createElement('span');
            const link = document.createElement('a');
            link.className = 'watson-menu-link';
            link.href = '#';
            link.style.cursor = 'pointer';
            link.innerHTML = '🔍 Validate Content';

            link.addEventListener('click', (e) => {
                e.preventDefault();
                validateAndExport();
            });

            span.appendChild(link);

            const exportContainer = document.getElementById('exportLinkContainer');
            if (exportContainer) {
                exportContainer.parentNode.insertBefore(span, exportContainer.nextSibling);
            } else {
                menuContainer.appendChild(span);
            }
        }
    }

    function initScript() {
        addValidationButton();

        // Log script load
        logUsage('script_loaded');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initScript);
    } else {
        initScript();
    }

    // ===========================================
    // MAIN VALIDATION FUNCTION
    // ===========================================

    function validateAndExport() {
        // Log validation start
        logUsage('validation_started');

        const issues = [];
        console.log('=== Content Validator v3.1 Starting ===');

        // Find ALL content containers
        const allContentContainers = document.querySelectorAll('div.ms-rtestate-field');
        console.log('Validator: Found', allContentContainers.length, 'ms-rtestate-field containers');

        if (allContentContainers.length === 0) {
            alert('Could not find any div.ms-rtestate-field containers on this page!');
            return;
        }

        // Find WatsonSOPBody and WatsonSOPSource
        let watsonBody = null;
        let watsonSource = null;

        // Search all containers
        allContentContainers.forEach((container, index) => {
            const body = container.querySelector('.WatsonSOPBody');
            if (body) {
                console.log('Validator: Found WatsonSOPBody in container', index);
                watsonBody = body;
            }

            const source = container.querySelector('#WatsonSOPSource');
            if (source) {
                watsonSource = source;
            }
        });

        // Fallback: search entire document
        if (!watsonBody) {
            watsonBody = document.querySelector('.WatsonSOPBody');
        }
        if (!watsonSource) {
            watsonSource = document.querySelector('#WatsonSOPSource');
        }

        console.log('Validator: WatsonSOPBody found:', !!watsonBody);
        console.log('Validator: WatsonSOPSource found:', !!watsonSource);

        // ===========================================
        // STYLESHEET VALIDATION
        // ===========================================
        validateStylesheets(allContentContainers, watsonBody, issues);

        // ===========================================
        // WATSON SOP SOURCE VALIDATION
        // ===========================================
        validateWatsonSOPSource(watsonSource, allContentContainers, issues);

        // ===========================================
        // WATSON SOP BODY VALIDATION
        // ===========================================
        if (!watsonBody) {
            // Check if incorrectly used as ID
            let watsonBodyAsId = document.querySelector('#WatsonSOPBody');

            if (watsonBodyAsId) {
                issues.push({
                    type: 'Structure',
                    element: '#WatsonSOPBody',
                    issue: 'WatsonSOPBody incorrectly used as ID instead of class',
                    required: true,
                    suggestion: 'Change <div id="WatsonSOPBody"> to <div class="WatsonSOPBody">',
                    location: getElementLocation(watsonBodyAsId)
                });
                watsonBody = watsonBodyAsId;
            } else {
                issues.push({
                    type: 'Structure',
                    element: '.WatsonSOPBody',
                    issue: 'Missing div.WatsonSOPBody',
                    required: true,
                    suggestion: 'Add <div class="WatsonSOPBody">SOP content</div>',
                    location: ''
                });
            }
        }

        if (watsonBody) {
            // Check for inline styles on WatsonSOPBody
            if (watsonBody.hasAttribute('style')) {
                issues.push({
                    type: 'Structure',
                    element: '.WatsonSOPBody',
                    issue: 'WatsonSOPBody has inline styles',
                    required: true,
                    suggestion: 'Remove inline styles from WatsonSOPBody div',
                    location: getElementLocation(watsonBody)
                });
            }

            // Parse content for validation
            const parser = new DOMParser();
            const tempDoc = parser.parseFromString('<div>' + watsonBody.innerHTML + '</div>', 'text/html');
            const parsedBody = tempDoc.body.firstChild;

            // Remove WatsonByline elements
            const bylineElements = parsedBody.querySelectorAll('div.WatsonByline');
            bylineElements.forEach(el => el.remove());

            console.log('Validator: Content parsed, length:', parsedBody.innerHTML.length);

            // Run all validations
            runAllValidations(parsedBody, issues);
        }

        // Output results
        console.log('=== Validation Complete ===');
        console.log('Total issues found:', issues.length);

        // Log validation complete with issue count
        logUsage('validation_complete_' + issues.length + '_issues');

        if (issues.length > 0) {
            exportToCSV(issues);
        } else {
            alert('No issues found in the content!');
        }
    }

    function runAllValidations(doc, issues) {
        // Watson SOP Structure
        console.log('--- Watson SOP Structure Validations ---');
        validateFloatingTOCStructure(doc, issues);
        validateClassIdUsage(doc, issues);

        // Watson Content Rules
        console.log('--- Watson Content Rules ---');
        validateSemanticTags(doc, issues);
        validateHeadingHierarchy(doc, issues);
        validateTableStructure(doc, issues);
        validateListConsistency(doc, issues);
        validateCallOuts(doc, issues);
        validateUIElements(doc, issues);
        validateBlurbs(doc, issues);
        validateContentRatios(doc, issues);
        validateOrderedListsStartingWithIf(doc, issues);
        validateFloatingText(doc, issues);

        // Standard HTML Checks
        console.log('--- Standard HTML Checks ---');
        validateStandardHTML(doc, issues);
        validateDeprecatedAttributes(doc, issues);
        validateInternalLinks(doc, issues);

        // Accessibility Checks
        console.log('--- Accessibility Checks ---');
        validateAccessibility(doc, issues);

        // Image and Link Checks
        console.log('--- Image and Link Checks ---');
        validateImages(doc, issues);
        validateLinks(doc, issues);

        // CSS Compliance Checks
        console.log('--- CSS Compliance Checks ---');
        validateCSSCompliance(doc, issues);

        // Content Quality Checks
        console.log('--- Content Quality Checks ---');
        validateContentQuality(doc, issues);

        // Inline Style Checks
        console.log('--- Inline Style Checks ---');
        validateInlineStyles(doc, issues);
    }

    // ===========================================
    // STYLESHEET VALIDATION
    // ===========================================

    function validateStylesheets(containers, watsonBody, issues) {
        const allApprovedStylesheets = [...CONFIG.coreStylesheets, ...CONFIG.tableStylesheets];
        const linkedStylesheets = [];

        // Collect stylesheets from all containers
        containers.forEach(container => {
            const linkTags = container.querySelectorAll('link[rel="stylesheet"]');
            linkTags.forEach(link => {
                const href = link.getAttribute('href');
                if (href) {
                    const filename = href.split('/').pop().split('?')[0].toLowerCase();
                    if (!linkedStylesheets.some(s => s.filename === filename)) {
                        linkedStylesheets.push({ filename, fullHref: href });
                    }
                }
            });
        });

        // Also check document head
        document.querySelectorAll('head link[rel="stylesheet"]').forEach(link => {
            const href = link.getAttribute('href');
            if (href) {
                const filename = href.split('/').pop().split('?')[0].toLowerCase();
                if (!linkedStylesheets.some(s => s.filename === filename)) {
                    linkedStylesheets.push({ filename, fullHref: href });
                }
            }
        });

        console.log('Validator: Found', linkedStylesheets.length, 'stylesheets');

        // Check for core stylesheet
        const hasCoreStylesheet = linkedStylesheets.some(sheet =>
            CONFIG.coreStylesheets.some(core => sheet.filename === core)
        );

        if (!hasCoreStylesheet) {
            issues.push({
                type: 'CSS',
                element: '<link rel="stylesheet">',
                issue: 'Missing required core stylesheet',
                required: true,
                suggestion: `Add at least one: ${CONFIG.coreStylesheets.map(s => s.replace('.css', '')).join(', ')}`,
                location: ''
            });
        }

        // Check for table stylesheet if tables exist
        if (watsonBody) {
            const tables = watsonBody.querySelectorAll('table');
            if (tables.length > 0) {
                const hasTableStylesheet = linkedStylesheets.some(sheet =>
                    CONFIG.tableStylesheets.some(tableCSS => sheet.filename === tableCSS)
                );

                if (!hasTableStylesheet) {
                    issues.push({
                        type: 'CSS',
                        element: 'Table stylesheet',
                        issue: `Found ${tables.length} table(s) but no table stylesheet linked`,
                        required: true,
                        suggestion: `Add one: ${CONFIG.tableStylesheets.map(s => s.replace('.css', '')).join(', ')}`,
                        location: ''
                    });
                }
            }
        }

        // Flag non-approved stylesheets
        containers.forEach(container => {
            container.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
                const href = link.getAttribute('href');
                if (href) {
                    const filename = href.split('/').pop().split('?')[0].toLowerCase();
                    const isApproved = allApprovedStylesheets.some(approved => filename === approved);
                    const isSystem = CONFIG.systemStylesheets.some(sys =>
                        filename.includes(sys) || href.toLowerCase().includes(sys)
                    );

                    if (!isApproved && !isSystem) {
                        const alreadyFlagged = issues.some(i => i.element === `<link href="${filename}">`);
                        if (!alreadyFlagged) {
                            issues.push({
                                type: 'CSS',
                                element: `<link href="${filename}">`,
                                issue: `Non-standardized stylesheet: ${filename}`,
                                required: true,
                                suggestion: 'Replace with an approved stylesheet',
                                location: href
                            });
                        }
                    }
                }
            });
        });
    }

    // ===========================================
    // WATSON SOP SOURCE VALIDATION
    // ===========================================

    function validateWatsonSOPSource(watsonSource, containers, issues) {
        // Check for class instead of ID
        let watsonSourceAsClass = null;
        containers.forEach(container => {
            const sourceAsClass = container.querySelector('.WatsonSOPSource');
            if (sourceAsClass) watsonSourceAsClass = sourceAsClass;
        });

        if (!watsonSourceAsClass) {
            watsonSourceAsClass = document.querySelector('.WatsonSOPSource');
        }

        if (watsonSourceAsClass && !watsonSource) {
            issues.push({
                type: 'Structure',
                element: '.WatsonSOPSource',
                issue: 'WatsonSOPSource incorrectly used as class instead of ID',
                required: true,
                suggestion: 'Change <div class="WatsonSOPSource"> to <div id="WatsonSOPSource">',
                location: getElementLocation(watsonSourceAsClass)
            });
            watsonSource = watsonSourceAsClass;
        } else if (!watsonSource && !watsonSourceAsClass) {
            issues.push({
                type: 'Structure',
                element: '#WatsonSOPSource',
                issue: 'Missing #WatsonSOPSource element',
                required: true,
                suggestion: 'Add <div id="WatsonSOPSource">version history link</div>',
                location: ''
            });
            return;
        }

        if (watsonSource) {
            // Check inline styles (allow display:none)
            const styleAttr = watsonSource.getAttribute('style');
            if (styleAttr) {
                const normalizedStyle = styleAttr.toLowerCase().replace(/\s/g, '').replace(/;$/, '');
                if (normalizedStyle !== 'display:none') {
                    issues.push({
                        type: 'Structure',
                        element: '#WatsonSOPSource',
                        issue: 'WatsonSOPSource has inline styles other than display:none',
                        required: true,
                        suggestion: 'Remove inline styles (display:none is acceptable)',
                        location: getElementLocation(watsonSource)
                    });
                }
            }

            // Check URL ends with .htm
            const content = watsonSource.textContent.trim();
            if (content && content.toLowerCase().includes('.aspx')) {
                issues.push({
                    type: 'Structure',
                    element: '#WatsonSOPSource',
                    issue: 'Version history URL ends with .aspx instead of .htm',
                    required: true,
                    suggestion: 'Change URL from .aspx to .htm',
                    location: content
                });
            }

            // Check for comments
            let hasComments = false;
            watsonSource.childNodes.forEach(node => {
                if (node.nodeType === 8) hasComments = true;
            });

            if (hasComments) {
                issues.push({
                    type: 'Structure',
                    element: '#WatsonSOPSource',
                    issue: 'WatsonSOPSource contains comments',
                    required: true,
                    suggestion: 'Remove comments from WatsonSOPSource',
                    location: ''
                });
            }
        }
    }

    // ===========================================
    // FLOATING TOC STRUCTURE VALIDATION
    // ===========================================

    function validateFloatingTOCStructure(doc, issues) {
        const colTOC = doc.querySelector('#col-TOC');
        const colBody = doc.querySelector('#col-body');
        const row = doc.querySelector('.row');
        const toc = doc.querySelector('#toc');

        if (!colTOC && !colBody && !row && !toc) {
            return; // No TOC structure
        }

        // Check row is class not ID
        const rowAsId = doc.querySelector('[id="row"]');
        if (rowAsId && !rowAsId.classList.contains('row')) {
            issues.push({
                type: 'Structure',
                element: '#row',
                issue: 'row incorrectly used as ID instead of class',
                required: true,
                suggestion: 'Change <div id="row"> to <div class="row">',
                location: getElementLocation(rowAsId)
            });
        }

        if (!row && (colTOC || colBody)) {
            issues.push({
                type: 'Structure',
                element: '.row',
                issue: 'Missing div.row when col-TOC or col-body present',
                required: true,
                suggestion: 'Add <div class="row"> to contain #col-TOC and #col-body',
                location: ''
            });
        }

        if (row) {
            if (colTOC && !row.contains(colTOC)) {
                issues.push({
                    type: 'Structure',
                    element: '#col-TOC',
                    issue: '#col-TOC must be inside div.row',
                    required: true,
                    suggestion: 'Move #col-TOC inside div.row',
                    location: getElementLocation(colTOC)
                });
            }

            if (colBody && !row.contains(colBody)) {
                issues.push({
                    type: 'Structure',
                    element: '#col-body',
                    issue: '#col-body must be inside div.row',
                    required: true,
                    suggestion: 'Move #col-body inside div.row',
                    location: getElementLocation(colBody)
                });
            }

            if (colTOC) {
                const sticky = colTOC.querySelector('.sticky');
                if (!sticky) {
                    issues.push({
                        type: 'Structure',
                        element: '.sticky',
                        issue: 'Missing .sticky div inside #col-TOC',
                        required: true,
                        suggestion: 'Add <div class="sticky"> inside #col-TOC',
                        location: getElementLocation(colTOC)
                    });
                } else if (toc && !sticky.contains(toc)) {
                    issues.push({
                        type: 'Structure',
                        element: '#toc',
                        issue: '#toc must be inside .sticky',
                        required: true,
                        suggestion: 'Move #toc inside .sticky div',
                        location: getElementLocation(toc)
                    });
                }
            }
        }
    }

    // ===========================================
    // CLASS/ID USAGE VALIDATION
    // ===========================================

    function validateClassIdUsage(doc, issues) {
        // toc should be ID
        doc.querySelectorAll('.toc').forEach(el => {
            if (el.id !== 'toc') {
                issues.push({
                    type: 'Structure',
                    element: '.toc',
                    issue: 'toc incorrectly used as class instead of ID',
                    required: true,
                    suggestion: 'Change <div class="toc"> to <div id="toc">',
                    location: getElementLocation(el)
                });
            }
        });

        // col-TOC should be ID
        doc.querySelectorAll('.col-TOC').forEach(el => {
            if (el.id !== 'col-TOC') {
                issues.push({
                    type: 'Structure',
                    element: '.col-TOC',
                    issue: 'col-TOC incorrectly used as class instead of ID',
                    required: true,
                    suggestion: 'Change <div class="col-TOC"> to <div id="col-TOC">',
                    location: getElementLocation(el)
                });
            }
        });

        // col-body should be ID
        doc.querySelectorAll('.col-body').forEach(el => {
            if (el.id !== 'col-body') {
                issues.push({
                    type: 'Structure',
                    element: '.col-body',
                    issue: 'col-body incorrectly used as class instead of ID',
                    required: true,
                    suggestion: 'Change <div class="col-body"> to <div id="col-body">',
                    location: getElementLocation(el)
                });
            }
        });
    }

    // ===========================================
    // SEMANTIC TAGS VALIDATION
    // ===========================================

    function validateSemanticTags(doc, issues) {
        // Check for <b> tags
        const bTags = doc.querySelectorAll('b');
        if (bTags.length > 0) {
            issues.push({
                type: 'Structure',
                element: '<b>',
                issue: `Found ${bTags.length} <b> tag(s) - should use <strong>`,
                required: true,
                suggestion: 'Replace <b> with <strong> for semantic HTML',
                location: getElementLocation(bTags[0])
            });
        }

        // Check for <i> tags (exclude font icons)
        const iTags = doc.querySelectorAll('i');
        const nonIconITags = Array.from(iTags).filter(el => {
            const className = el.className || '';
            return !className.includes('fa') && !className.includes('icon');
        });

        if (nonIconITags.length > 0) {
            issues.push({
                type: 'Structure',
                element: '<i>',
                issue: `Found ${nonIconITags.length} <i> tag(s) - should use <em>`,
                required: true,
                suggestion: 'Replace <i> with <em> for semantic HTML (font icons excluded)',
                location: getElementLocation(nonIconITags[0])
            });
        }
    }

    // ===========================================
    // HEADING HIERARCHY VALIDATION
    // ===========================================

    function validateHeadingHierarchy(doc, issues) {
        const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
        let previousLevel = 0;

        headings.forEach((heading) => {
            const currentLevel = parseInt(heading.tagName.charAt(1));

            if (previousLevel > 0 && currentLevel > previousLevel + 1) {
                issues.push({
                    type: 'Structure',
                    element: heading.tagName,
                    issue: `Heading hierarchy violated: h${previousLevel} to h${currentLevel} (skipped level)`,
                    required: true,
                    suggestion: `After h${previousLevel}, use h${previousLevel + 1}, not h${currentLevel}`,
                    location: `${heading.tagName}: ${heading.textContent.substring(0, 50)}`
                });
            }

            previousLevel = currentLevel;
        });

        // Check for multiple h1 tags
        const h1Tags = doc.querySelectorAll('h1');
        if (h1Tags.length > 1) {
            issues.push({
                type: 'Structure',
                element: '<h1>',
                issue: `Found ${h1Tags.length} <h1> tags - should only have one`,
                required: true,
                suggestion: 'Use only one <h1> per page',
                location: getElementLocation(h1Tags[1])
            });
        }
    }

    // ===========================================
    // TABLE STRUCTURE VALIDATION (ENHANCED)
    // ===========================================

    function validateTableStructure(doc, issues) {
        const tables = doc.querySelectorAll('table');

        tables.forEach((table, index) => {
            const tableNum = index + 1;

            // Check for table header
            const thead = table.querySelector('thead');
            const thElements = table.querySelectorAll('th');

            if (!thead && thElements.length === 0) {
                issues.push({
                    type: 'Structure',
                    element: `table[${tableNum}]`,
                    issue: 'Table missing header (no <thead> or <th>)',
                    required: true,
                    suggestion: 'Add <thead> with <th> elements',
                    location: getElementLocation(table)
                });
            }

            // Check for deprecated attributes
            const deprecatedTableAttrs = ['border', 'cellpadding', 'width', 'height', 'bgcolor', 'align'];

            deprecatedTableAttrs.forEach(attr => {
                if (table.hasAttribute(attr)) {
                    issues.push({
                        type: 'HTML',
                        element: `table[${tableNum}]`,
                        issue: `Table has deprecated "${attr}" attribute`,
                        required: true,
                        suggestion: `Remove ${attr} attribute and use CSS instead`,
                        location: `${attr}="${table.getAttribute(attr)}"`
                    });
                }
            });

            // Check for bgcolor on rows/cells
            const bgcolorElements = table.querySelectorAll('[bgcolor]');
            if (bgcolorElements.length > 0) {
                issues.push({
                    type: 'HTML',
                    element: `table[${tableNum}]`,
                    issue: `Found ${bgcolorElements.length} element(s) with deprecated "bgcolor"`,
                    required: true,
                    suggestion: 'Use CSS background-color instead',
                    location: ''
                });
            }

            // Check for valign
            const valignElements = table.querySelectorAll('[valign]');
            if (valignElements.length > 0) {
                issues.push({
                    type: 'HTML',
                    element: `table[${tableNum}]`,
                    issue: `Found ${valignElements.length} element(s) with deprecated "valign"`,
                    required: true,
                    suggestion: 'Use CSS vertical-align instead',
                    location: ''
                });
            }

            // Check for nested tables
            const nestedTables = table.querySelectorAll('table');
            if (nestedTables.length > 0) {
                issues.push({
                    type: 'Structure',
                    element: `table[${tableNum}]`,
                    issue: `Table contains ${nestedTables.length} nested table(s)`,
                    required: false,
                    suggestion: 'Avoid nested tables - use CSS grid/flexbox',
                    location: ''
                });
            }

            // Check for inconsistent column count
            const rows = table.querySelectorAll('tr');
            if (rows.length > 1) {
                const columnCounts = [];
                rows.forEach((row, rowIndex) => {
                    let colCount = 0;
                    row.querySelectorAll('td, th').forEach(cell => {
                        colCount += parseInt(cell.getAttribute('colspan')) || 1;
                    });
                    if (colCount > 0) {
                        columnCounts.push({ row: rowIndex + 1, count: colCount });
                    }
                });

                const uniqueCounts = [...new Set(columnCounts.map(c => c.count))];
                if (uniqueCounts.length > 1) {
                    const maxCount = Math.max(...uniqueCounts);
                    const inconsistentRows = columnCounts.filter(c => c.count !== maxCount).map(c => c.row);

                    if (inconsistentRows.length > 0 && inconsistentRows.length < rows.length * 0.5) {
                        issues.push({
                            type: 'Structure',
                            element: `table[${tableNum}]`,
                            issue: `Inconsistent column count in rows: ${inconsistentRows.slice(0, 5).join(', ')}`,
                            required: false,
                            suggestion: 'Ensure all rows have same column count (accounting for colspan). Merging cells can produce incosistent results for content comparison and users of AT.',
                            location: ''
                        });
                    }
                }
            }

            // Check for empty rows
            let emptyRowCount = 0;
            rows.forEach(row => {
                const cells = row.querySelectorAll('td, th');
                const hasContent = Array.from(cells).some(cell => cell.textContent.trim().length > 0);
                if (!hasContent && cells.length > 0) {
                    emptyRowCount++;
                }
            });

            if (emptyRowCount > 0) {
                issues.push({
                    type: 'Structure',
                    element: `table[${tableNum}]`,
                    issue: `Table has ${emptyRowCount} empty row(s)`,
                    required: false,
                    suggestion: 'Remove empty rows or add content',
                    location: ''
                });
            }

            // Check for single-row/single-column tables
            const dataRows = table.querySelectorAll('tbody tr, table > tr');
            if (dataRows.length === 1 && !thead) {
                issues.push({
                    type: 'Structure',
                    element: `table[${tableNum}]`,
                    issue: 'Single-row table - might be misused for layout',
                    required: false,
                    suggestion: 'Consider if a table is appropriate here or if you can use different formatting',
                    location: ''
                });
            }

            if (rows.length > 0) {
                const firstRowCells = rows[0].querySelectorAll('td, th');
                let totalCols = 0;
                firstRowCells.forEach(cell => {
                    totalCols += parseInt(cell.getAttribute('colspan')) || 1;
                });

                if (totalCols === 1 && rows.length > 2) {
                    issues.push({
                        type: 'Structure',
                        element: `table[${tableNum}]`,
                        issue: 'Single-column table - might be misused for layout',
                        required: false,
                        suggestion: 'Consider using a list or different formats instead',
                        location: ''
                    });
                }

                if (totalCols > 6) {
                    issues.push({
                        type: 'Structure',
                        element: `table[${tableNum}]`,
                        issue: `Table has ${totalCols} columns - may be hard to read`,
                        required: false,
                        suggestion: 'Consider splitting into multiple tables',
                        location: ''
                    });
                }
            }

            // Check for excessive inline styles on cells
            const cellsWithStyles = table.querySelectorAll('td[style], th[style]');
            if (cellsWithStyles.length > 10) {
                issues.push({
                    type: 'CSS Compliance',
                    element: `table[${tableNum}]`,
                    issue: `Table has ${cellsWithStyles.length} cells with inline styles`,
                    required: false,
                    suggestion: 'Use CSS classes instead of cell formatting for consistency',
                    location: ''
                });
            }

            // Check for consistent <p> tag usage
            const cells = table.querySelectorAll('td');
            if (cells.length > 1) {
                const cellsWithP = Array.from(cells).filter(cell => cell.querySelector('p'));
                const cellsWithoutP = Array.from(cells).filter(cell =>
                    !cell.querySelector('p') && cell.textContent.trim().length > 0
                );

                if (cellsWithP.length > 0 && cellsWithoutP.length > 0) {
                    const total = cellsWithP.length + cellsWithoutP.length;
                    if (Math.min(cellsWithP.length, cellsWithoutP.length) > total * 0.2) {
                        issues.push({
                            type: 'Structure',
                            element: `table[${tableNum}]`,
                            issue: `Inconsistent <p> usage (${cellsWithP.length} with, ${cellsWithoutP.length} without)`,
                            required: false,
                            suggestion: 'Be consistent with <p> tags in cells',
                            location: ''
                        });
                    }
                }
            }
        });
    }

    // ===========================================
    // LIST CONSISTENCY VALIDATION
    // ===========================================

    function validateListConsistency(doc, issues) {
        const lists = doc.querySelectorAll('ol, ul');

        lists.forEach((list, index) => {
            const listItems = list.querySelectorAll(':scope > li');
            if (listItems.length < 2) return;

            let itemsWithP = 0;
            let itemsWithoutP = 0;

            listItems.forEach(li => {
                if (li.querySelector(':scope > p')) {
                    itemsWithP++;
                } else if (li.textContent.trim().length > 0) {
                    itemsWithoutP++;
                }
            });

            if (itemsWithP > 0 && itemsWithoutP > 0) {
                const total = itemsWithP + itemsWithoutP;
                if (Math.min(itemsWithP, itemsWithoutP) > total * 0.2) {
                    issues.push({
                        type: 'Structure',
                        element: `${list.tagName.toLowerCase()}[${index + 1}]`,
                        issue: `Inconsistent <p> usage (${itemsWithP} with, ${itemsWithoutP} without)`,
                        required: false,
                        suggestion: 'Be consistent with <p> tags in list items',
                        location: ''
                    });
                }
            }
        });
    }

    // ===========================================
    // CALLOUT VALIDATION
    // ===========================================

    function validateCallOuts(doc, issues) {
        const selector = CONFIG.calloutClasses.map(c => `div.${c}`).join(', ');
        const callouts = doc.querySelectorAll(selector);

        callouts.forEach((callout) => {
            const innerHTML = callout.innerHTML.trim();
            const startsWithStrong = /^<strong/i.test(innerHTML);

            if (!startsWithStrong) {
                const className = Array.from(callout.classList).find(c => CONFIG.calloutClasses.includes(c));
                issues.push({
                    type: 'Structure',
                    element: `div.${className}`,
                    issue: 'Call-out may be missing intro text in <strong>',
                    required: true,
                    suggestion: `It looks like your call-out is missing an introductory text or it is different from what was intended. If so, add <strong>${className.charAt(0).toUpperCase() + className.slice(1)}:</strong> at the beginning.`,
                    location: getElementLocation(callout)
                });
            }
        });
    }

    // ===========================================
    // UI ELEMENTS VALIDATION
    // ===========================================

    function validateUIElements(doc, issues) {
        const html = doc.innerHTML;
        const uiPatternRegex = /(Click|Select|Choose|Press|Navigate to|Open|Tap|Double-click)\s+<strong(?![^>]*class\s*=\s*["'][^"']*\bui\b[^"']*["'])[^>]*>([^<]+)<\/strong>/gi;

        let match;
        const foundIssues = new Set();
        let count = 0;

        while ((match = uiPatternRegex.exec(html)) !== null && count < 10) {
            const elementName = match[2].trim();
            if (!foundIssues.has(elementName) && elementName.length < 50 && !elementName.includes('_')) {
                foundIssues.add(elementName);
                count++;
                issues.push({
                    type: 'Structure',
                    element: '<strong>',
                    issue: `UI element "${elementName}" should use <strong class="ui">`,
                    required: true,
                    suggestion: `If this is indeed a UI element that user interacts with, change to <strong class="ui">${elementName}</strong>`,
                    location: `"${match[1]} ${elementName}"`
                });
            }
        }
    }

    // ===========================================
    // BLURB VALIDATION
    // ===========================================

    function validateBlurbs(doc, issues) {
        const html = doc.innerHTML;
        const blurbPattern = /<strong(?![^>]*class\s*=\s*["'][^"']*\bblurb\b[^"']*["'])[^>]*>([a-zA-Z][a-zA-Z0-9]*_[a-zA-Z0-9_]+)<\/strong>/gi;

        let match;
        const foundBlurbs = new Set();

        while ((match = blurbPattern.exec(html)) !== null) {
            const blurbName = match[1].trim();
            if (!foundBlurbs.has(blurbName)) {
                foundBlurbs.add(blurbName);
                issues.push({
                    type: 'Structure',
                    element: '<strong>',
                    issue: `Blurb "${blurbName}" should use <strong class="blurb">`,
                    required: true,
                    suggestion: `This looks like a blurb title. If so, change to <strong class="blurb">${blurbName}</strong>.`,
                    location: `Blurb: ${blurbName}`
                });
            }
        }

        // Check <b> tags with blurb patterns
        const bBlurbPattern = /<b>([a-zA-Z][a-zA-Z0-9]*_[a-zA-Z0-9_]+)<\/b>/gi;
        while ((match = bBlurbPattern.exec(html)) !== null) {
            const blurbName = match[1].trim();
            if (!foundBlurbs.has(blurbName)) {
                foundBlurbs.add(blurbName);
                issues.push({
                    type: 'Structure',
                    element: '<b>',
                    issue: `Blurb "${blurbName}" uses <b> instead of <strong class="blurb">`,
                    required: true,
                    suggestion: `This looks like a blurb title. If so, change to <strong class="blurb">${blurbName}</strong>.`,
                    location: `Blurb: ${blurbName}`
                });
            }
        }
    }

    // ===========================================
    // CONTENT RATIOS VALIDATION
    // ===========================================

    function validateContentRatios(doc, issues) {
        const totalText = doc.textContent.length;
        if (totalText < 500) return;

        // Table ratio
        const tables = doc.querySelectorAll('table');
        let tableTextLength = 0;
        tables.forEach(table => tableTextLength += table.textContent.length);

        const tableRatio = tableTextLength / totalText;
        if (tableRatio > 0.3) {
            issues.push({
                type: 'Structure',
                element: 'tables',
                issue: `More than 30% content in tables (${Math.round(tableRatio * 100)}%)`,
                required: false,
                suggestion: 'Consider reducing table usage',
                location: ''
            });
        }

        // Callout ratio
        const selector = CONFIG.calloutClasses.map(c => `div.${c}`).join(', ');
        const callouts = doc.querySelectorAll(selector);
        let calloutTextLength = 0;
        callouts.forEach(callout => calloutTextLength += callout.textContent.length);

        const calloutRatio = calloutTextLength / totalText;
        if (calloutRatio > 0.3) {
            issues.push({
                type: 'Structure',
                element: 'callouts',
                issue: `More than 30% content in call-outs (${Math.round(calloutRatio * 100)}%)`,
                required: false,
                suggestion: 'Consider reducing call-out usage',
                location: ''
            });
        }

        // Consecutive callouts
        if (callouts.length > 2) {
            let maxConsecutive = 1;
            let currentConsecutive = 1;

            for (let i = 1; i < callouts.length; i++) {
                const prev = callouts[i - 1];
                const curr = callouts[i];

                if (prev.parentElement === curr.parentElement) {
                    let sibling = prev.nextElementSibling;
                    let foundContent = false;

                    while (sibling && sibling !== curr) {
                        if (sibling.textContent.trim().length > 20) {
                            foundContent = true;
                            break;
                        }
                        sibling = sibling.nextElementSibling;
                    }

                    if (!foundContent) {
                        currentConsecutive++;
                        maxConsecutive = Math.max(maxConsecutive, currentConsecutive);
                    } else {
                        currentConsecutive = 1;
                    }
                } else {
                    currentConsecutive = 1;
                }
            }

            if (maxConsecutive > 2) {
                issues.push({
                    type: 'Structure',
                    element: 'callouts',
                    issue: `Found ${maxConsecutive} consecutive call-outs`,
                    required: false,
                    suggestion: 'Avoid more than 2 consecutive call-outs',
                    location: ''
                });
            }
        }
    }

    // ===========================================
    // ORDERED LISTS STARTING WITH IF
    // ===========================================

    function validateOrderedListsStartingWithIf(doc, issues) {
        const orderedLists = doc.querySelectorAll('ol');

        orderedLists.forEach((ol, index) => {
            const listItems = ol.querySelectorAll(':scope > li');
            let ifCount = 0;

            listItems.forEach(li => {
                const text = li.textContent.trim().toLowerCase();
                if (text.startsWith('if ') || text.startsWith('if:') || text.startsWith('if,')) {
                    ifCount++;
                }
            });

            if (ifCount >= 2) {
                issues.push({
                    type: 'Structure',
                    element: `ol[${index + 1}]`,
                    issue: `Ordered list has ${ifCount} items starting with "If"`,
                    required: false,
                    suggestion: 'Consider restructuring conditional steps',
                    location: ''
                });
            }
        });
    }

    // ===========================================
    // FLOATING TEXT VALIDATION
    // ===========================================

    function validateFloatingText(doc, issues) {
        const containers = [
            { element: doc, name: 'WatsonSOPBody' },
            { element: doc.querySelector('#col-body'), name: '#col-body' }
        ];

        containers.forEach(({ element, name }) => {
            if (!element) return;

            Array.from(element.childNodes).forEach(node => {
                if (node.nodeType === 3) {
                    const text = node.textContent.trim();
                    if (text.length > 30) {
                        issues.push({
                            type: 'Structure',
                            element: 'floating text',
                            issue: `Unwrapped text in ${name}`,
                            required: true,
                            suggestion: 'Wrap text in <p>, <div>, etc.',
                            location: `"${text.substring(0, 50)}..."`
                        });
                    }
                }
            });
        });
    }

    // ===========================================
    // STANDARD HTML VALIDATION
    // ===========================================

    function validateStandardHTML(doc, issues) {
        // Deprecated tags
        const deprecatedTags = ['font', 'center', 'marquee', 'blink', 'strike'];

        deprecatedTags.forEach(tag => {
            const elements = doc.querySelectorAll(tag);
            if (elements.length > 0) {
                issues.push({
                    type: 'HTML',
                    element: `<${tag}>`,
                    issue: `Found ${elements.length} deprecated <${tag}> tag(s)`,
                    required: true,
                    suggestion: 'Use modern HTML/CSS alternatives',
                    location: getElementLocation(elements[0])
                });
            }
        });

        // Empty lists
        doc.querySelectorAll('ul, ol').forEach(list => {
            if (list.querySelectorAll('li').length === 0) {
                issues.push({
                    type: 'HTML',
                    element: `<${list.tagName.toLowerCase()}>`,
                    issue: 'Empty list detected',
                    required: true,
                    suggestion: 'Remove empty list or add items',
                    location: getElementLocation(list)
                });
            }
        });

        // Multiple <br> tags
        const html = doc.innerHTML;
        const brMatches = html.match(/<br\s*\/?>\s*<br\s*\/?>/gi);
        if (brMatches && brMatches.length > 3) {
            issues.push({
                type: 'HTML',
                element: '<br><br>',
                issue: `Found ${brMatches.length} consecutive <br> pairs`,
                required: false,
                suggestion: 'Use CSS margins/padding instead',
                location: ''
            });
        }

        // Multiple <hr> tags
        const hrMatches = html.match(/<hr\s*\/?>\s*<hr\s*\/?>/gi);
        if (hrMatches && hrMatches.length > 3) {
            issues.push({
                type: 'HTML',
                element: '<hr><hr>',
                issue: `Found ${hrMatches.length} consecutive <hr> pairs`,
                required: false,
                suggestion: 'Use consistent singular line breaks (hr)',
                location: ''
            });
        }

        // MS Office markup
        if (/mso-[a-zA-Z-]+:/gi.test(html)) {
            issues.push({
                type: 'HTML',
                element: 'mso-* styles',
                issue: 'Microsoft Office styles detected',
                required: true,
                suggestion: 'Paste as plain text to remove Office formatting',
                location: ''
            });
        }

        // Duplicate IDs
        const idCounts = {};
        doc.querySelectorAll('[id]').forEach(el => {
            const id = el.id;
            if (id) idCounts[id] = (idCounts[id] || 0) + 1;
        });

        Object.keys(idCounts).forEach(id => {
            if (idCounts[id] > 1) {
                issues.push({
                    type: 'HTML',
                    element: `id="${id}"`,
                    issue: `Duplicate ID: "${id}" appears ${idCounts[id]} times`,
                    required: true,
                    suggestion: 'IDs must be unique',
                    location: ''
                });
            }
        });
    }

    // ===========================================
    // DEPRECATED ATTRIBUTES VALIDATION
    // ===========================================

    function validateDeprecatedAttributes(doc, issues) {
        CONFIG.deprecatedAttributes.forEach(({ attr, suggestion }) => {
            const foundElements = doc.querySelectorAll(`[${attr}]`);
            if (foundElements.length > 0) {
                issues.push({
                    type: 'HTML',
                    element: `[${attr}]`,
                    issue: `Found ${foundElements.length} element(s) with deprecated "${attr}"`,
                    required: true,
                    suggestion: suggestion,
                    location: getElementLocation(foundElements[0])
                });
            }
        });
    }

    // ===========================================
    // INTERNAL LINKS VALIDATION
    // ===========================================

    function validateInternalLinks(doc, issues) {
        const internalLinks = doc.querySelectorAll('a[href^="#"]');
        const brokenLinks = [];

        internalLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href !== '#') {
                const targetId = href.substring(1);
                const target = doc.querySelector(`[id="${targetId}"], [name="${targetId}"]`);
                if (!target) {
                    brokenLinks.push({
                        href: href,
                        text: link.textContent.trim().substring(0, 30)
                    });
                }
            }
        });

        if (brokenLinks.length > 0) {
            const display = brokenLinks.slice(0, 5);
            issues.push({
                type: 'HTML',
                element: '<a href="#">',
                issue: `Found ${brokenLinks.length} broken internal link(s)`,
                required: true,
                suggestion: 'Ensure links point to existing id/name attributes',
                location: display.map(l => `${l.href}`).join(', ')
            });
        }
    }

    // ===========================================
    // ACCESSIBILITY VALIDATION
    // ===========================================

    function validateAccessibility(doc, issues) {
        // Images without alt
        const imagesNoAlt = doc.querySelectorAll('img:not([alt])');
        if (imagesNoAlt.length > 0) {
            issues.push({
                type: 'Accessibility',
                element: '<img>',
                issue: `Found ${imagesNoAlt.length} image(s) missing alt attribute`,
                required: true,
                suggestion: 'Add descriptive alt text',
                location: getElementLocation(imagesNoAlt[0])
            });
        }

        // Images with empty alt
        const imagesEmptyAlt = doc.querySelectorAll('img[alt=""]');
        if (imagesEmptyAlt.length > 0) {
            issues.push({
                type: 'Accessibility',
                element: '<img alt="">',
                issue: `Found ${imagesEmptyAlt.length} image(s) with empty alt`,
                required: false,
                suggestion: 'Verify these are decorative images',
                location: ''
            });
        }

        // iframes without title
        const iframesNoTitle = doc.querySelectorAll('iframe:not([title])');
        if (iframesNoTitle.length > 0) {
            issues.push({
                type: 'Accessibility',
                element: '<iframe>',
                issue: `Found ${iframesNoTitle.length} iframe(s) missing title`,
                required: true,
                suggestion: 'Add title attribute',
                location: ''
            });
        }

        // Videos without controls
        const videosNoControls = doc.querySelectorAll('video:not([controls])');
        if (videosNoControls.length > 0) {
            issues.push({
                type: 'Accessibility',
                element: '<video>',
                issue: `Found ${videosNoControls.length} video(s) missing controls`,
                required: true,
                suggestion: 'Add controls attribute',
                location: ''
            });
        }

        // Audio without controls
        const audioNoControls = doc.querySelectorAll('audio:not([controls])');
        if (audioNoControls.length > 0) {
            issues.push({
                type: 'Accessibility',
                element: '<audio>',
                issue: `Found ${audioNoControls.length} audio element(s) missing controls`,
                required: true,
                suggestion: 'Add controls attribute',
                location: ''
            });
        }

        // Links without href (exclude bookmarks with name/id)
        const linksNoHref = doc.querySelectorAll('a:not([href]):not([name]):not([id])');
        if (linksNoHref.length > 0) {
            issues.push({
                type: 'Accessibility',
                element: '<a>',
                issue: `Found ${linksNoHref.length} anchor(s) missing href (not bookmarks)`,
                required: true,
                suggestion: 'Add href or use <button>',
                location: ''
            });
        }

        // Table headers without scope
        const thNoScope = doc.querySelectorAll('th:not([scope])');
        if (thNoScope.length > 5) {
            issues.push({
                type: 'Accessibility',
                element: '<th>',
                issue: `Found ${thNoScope.length} table header(s) missing scope`,
                required: false,
                suggestion: 'Add scope="col" or scope="row"',
                location: ''
            });
        }

        // Buttons without accessible name
        let emptyButtons = 0;
        doc.querySelectorAll('button').forEach(button => {
            const hasText = button.textContent.trim();
            const hasAriaLabel = button.hasAttribute('aria-label');
            const hasTitle = button.hasAttribute('title');
            if (!hasText && !hasAriaLabel && !hasTitle) {
                emptyButtons++;
            }
        });

        if (emptyButtons > 0) {
            issues.push({
                type: 'Accessibility',
                element: '<button>',
                issue: `Found ${emptyButtons} button(s) without accessible name`,
                required: true,
                suggestion: 'Add text, aria-label, or title',
                location: ''
            });
        }

        // Generic link text
        const genericTexts = ['click here', 'here', 'read more', 'learn more', 'more', 'link'];
        let genericLinkCount = 0;

        doc.querySelectorAll('a[href]').forEach(link => {
            const text = link.textContent.trim().toLowerCase();
            if (genericTexts.includes(text)) {
                genericLinkCount++;
            }
        });

        if (genericLinkCount > 0) {
            issues.push({
                type: 'Accessibility',
                element: '<a>',
                issue: `Found ${genericLinkCount} link(s) with generic text`,
                required: false,
                suggestion: 'Use descriptive link text',
                location: ''
            });
        }
    }

    // ===========================================
    // IMAGE VALIDATION
    // ===========================================

    function validateImages(doc, issues) {
        const images = doc.querySelectorAll('img');
        let imagesWithInlineBorder = 0;
        let imagesWithInlineSize = 0;
        let imagesWithBorderAttr = 0;
        let imagesWithAlignAttr = 0;

        images.forEach(img => {
            const style = img.getAttribute('style') || '';

            if (style.includes('border')) imagesWithInlineBorder++;
            if (style.includes('width') || style.includes('height')) imagesWithInlineSize++;
            if (img.hasAttribute('border')) imagesWithBorderAttr++;
            if (img.hasAttribute('align')) imagesWithAlignAttr++;
        });

        if (imagesWithInlineBorder > 0) {
            issues.push({
                type: 'CSS Compliance',
                element: '<img style="border">',
                issue: `Found ${imagesWithInlineBorder} image(s) with inline border`,
                required: false,
                suggestion: 'Use img.no_border class or standard CSS',
                location: ''
            });
        }

        if (imagesWithInlineSize > 3) {
            issues.push({
                type: 'CSS Compliance',
                element: '<img style="width/height">',
                issue: `Found ${imagesWithInlineSize} image(s) with inline sizing`,
                required: false,
                suggestion: 'Use image classes (tiny, icon, flag, flowchart)',
                location: ''
            });
        }

        if (imagesWithBorderAttr > 0) {
            issues.push({
                type: 'HTML',
                element: '<img border="">',
                issue: `Found ${imagesWithBorderAttr} image(s) with deprecated border attr`,
                required: true,
                suggestion: 'Remove border attribute, use CSS',
                location: ''
            });
        }

        if (imagesWithAlignAttr > 0) {
            issues.push({
                type: 'HTML',
                element: '<img align="">',
                issue: `Found ${imagesWithAlignAttr} image(s) with deprecated align attr`,
                required: true,
                suggestion: 'Remove align attribute, use CSS',
                location: ''
            });
        }
    }

    // ===========================================
    // LINK VALIDATION
    // ===========================================

    function validateLinks(doc, issues) {
        const links = doc.querySelectorAll('a[href]');
        let aspxLinks = 0;
        let httpLinks = 0;
        let emptyTextLinks = 0;

        links.forEach(link => {
            const href = link.getAttribute('href');
            const text = link.textContent.trim();

            if (href && href.toLowerCase().includes('.aspx')) {
                aspxLinks++;
            }

            if (href && href.startsWith('http://') && !href.includes('localhost')) {
                httpLinks++;
            }

            if (!text && !link.querySelector('img') && !link.hasAttribute('aria-label') &&
                !link.hasAttribute('name') && !link.hasAttribute('id')) {
                emptyTextLinks++;
            }
        });

        if (httpLinks > 0) {
            issues.push({
                type: 'Security',
                element: '<a href="http://">',
                issue: `Found ${httpLinks} link(s) using insecure http://`,
                required: true,
                suggestion: 'Update to https://',
                location: ''
            });
        }

        if (emptyTextLinks > 0) {
            issues.push({
                type: 'Accessibility',
                element: '<a>',
                issue: `Found ${emptyTextLinks} link(s) with no text content`,
                required: true,
                suggestion: 'Add descriptive text or aria-label',
                location: ''
            });
        }
    }

    // ===========================================
    // CSS COMPLIANCE VALIDATION
    // ===========================================

    function validateCSSCompliance(doc, issues) {
        validateButtonUsage(doc, issues);
        validateCalloutCSS(doc, issues);
        validateColoredMargins(doc, issues);
        validateInteractiveElements(doc, issues);
        validateTypography(doc, issues);
        validateListClasses(doc, issues);
        validateLayoutContainers(doc, issues);
        validateEmphasisBoxes(doc, issues);
        validateSemanticSpans(doc, issues);
    }

    function validateButtonUsage(doc, issues) {
        const buttons = doc.querySelectorAll('button');
        let buttonsWithoutClass = 0;
        let buttonsWithInlineStyles = 0;

        buttons.forEach(button => {
            const classes = button.className.split(' ').filter(c => c.trim());
            const hasStandardClass = classes.some(cls => CONFIG.buttonClasses.includes(cls));

            if (!hasStandardClass && classes.length === 0) {
                buttonsWithoutClass++;
            }

            const style = button.getAttribute('style') || '';
            if (style.includes('background') || style.includes('color') ||
                style.includes('border') || style.includes('font')) {
                buttonsWithInlineStyles++;
            }
        });

        if (buttonsWithoutClass > 0) {
            issues.push({
                type: 'CSS Compliance',
                element: '<button>',
                issue: `Found ${buttonsWithoutClass} button(s) without standard class`,
                required: false,
                suggestion: 'Use: button--1/2/3/4, animated_button_red/green, update-button, etc.',
                location: ''
            });
        }

        if (buttonsWithInlineStyles > 0) {
            issues.push({
                type: 'CSS Compliance',
                element: '<button style="">',
                issue: `Found ${buttonsWithInlineStyles} button(s) with inline styles`,
                required: true,
                suggestion: 'Use standard button classes from Buttons.css',
                location: ''
            });
        }
    }

    function validateCalloutCSS(doc, issues) {
        // Check for non-standard callout divs
        const allDivs = doc.querySelectorAll('div');
        let nonStandardCallouts = 0;

        allDivs.forEach(div => {
            const style = (div.getAttribute('style') || '').toLowerCase();
            if ((style.includes('background-color') || style.includes('background:')) &&
                (style.includes('border') || style.includes('padding'))) {
                const hasStandardClass = CONFIG.calloutClasses.some(cls => div.classList.contains(cls));
                if (!hasStandardClass) {
                    nonStandardCallouts++;
                }
            }
        });

        if (nonStandardCallouts > 0) {
            issues.push({
                type: 'CSS Compliance',
                element: '<div style="background...">',
                issue: `Found ${nonStandardCallouts} non-standard callout div(s)`,
                required: true,
                suggestion: `Use standard classes: ${CONFIG.calloutClasses.join(', ')}`,
                location: ''
            });
        }

        // Check callouts for overriding styles
        const selector = CONFIG.calloutClasses.map(c => `div.${c}`).join(', ');
        doc.querySelectorAll(selector).forEach(callout => {
            const style = callout.getAttribute('style') || '';
            if (style.includes('background') || style.includes('border-color')) {
                issues.push({
                    type: 'CSS Compliance',
                    element: `div.${callout.className.split(' ')[0]}`,
                    issue: 'Callout has inline styles overriding standard CSS',
                    required: true,
                    suggestion: 'Remove inline background/border styles',
                    location: getElementLocation(callout)
                });
            }
        });
    }

    function validateColoredMargins(doc, issues) {
        // Check for inline border-left styles
        const divsWithBorderLeft = doc.querySelectorAll('div[style*="border-left"]');
        let nonStandardBorderLeft = 0;

        divsWithBorderLeft.forEach(div => {
            const hasStandardClass = CONFIG.coloredMarginClasses.some(color => div.classList.contains(color));
            if (!hasStandardClass) {
                nonStandardBorderLeft++;
            }
        });

        if (nonStandardBorderLeft > 0) {
            issues.push({
                type: 'CSS Compliance',
                element: '<div style="border-left...">',
                issue: `Found ${nonStandardBorderLeft} div(s) with inline border-left`,
                required: true,
                suggestion: `Use standard classes: ${CONFIG.coloredMarginClasses.join(', ')}`,
                location: ''
            });
        }
    }

    function validateInteractiveElements(doc, issues) {
        // Collapsible sections
        const collapsibles = doc.querySelectorAll('.collapsible, .collapsible-hide');

        collapsibles.forEach(collapsible => {
            if (collapsible.tagName !== 'BUTTON' && !collapsible.tagName.match(/^H[1-6]$/)) {
                issues.push({
                    type: 'CSS Compliance',
                    element: '.collapsible',
                    issue: `Collapsible is <${collapsible.tagName.toLowerCase()}> instead of <button> or heading`,
                    required: false,
                    suggestion: 'Use <button class="collapsible"> or <h4 class="collapsible">',
                    location: ''
                });
            }

            if (!collapsible.hasAttribute('aria-expanded')) {
                issues.push({
                    type: 'Accessibility',
                    element: '.collapsible',
                    issue: 'Collapsible missing aria-expanded',
                    required: false,
                    suggestion: 'Add aria-expanded="false"',
                    location: ''
                });
            }

            const nextSibling = collapsible.nextElementSibling;
            if (!nextSibling || !nextSibling.classList.contains('collapsed')) {
                issues.push({
                    type: 'Structure',
                    element: '.collapsible',
                    issue: 'Collapsible not followed by .collapsed div',
                    required: true,
                    suggestion: 'Add <div class="collapsed">content</div> after',
                    location: ''
                });
            }
        });

        // Flip cards
        doc.querySelectorAll('.flip-card').forEach(card => {
            if (!card.querySelector('.flip-card-inner')) {
                issues.push({
                    type: 'Structure',
                    element: '.flip-card',
                    issue: 'Flip card missing .flip-card-inner',
                    required: true,
                    suggestion: 'Add <div class="flip-card-inner">',
                    location: ''
                });
            }

            if (!card.querySelector('.flip-card-front') || !card.querySelector('.flip-card-back')) {
                issues.push({
                    type: 'Structure',
                    element: '.flip-card',
                    issue: 'Flip card missing front or back',
                    required: true,
                    suggestion: 'Add .flip-card-front and .flip-card-back',
                    location: ''
                });
            }

            if (!card.hasAttribute('tabindex')) {
                issues.push({
                    type: 'Accessibility',
                    element: '.flip-card',
                    issue: 'Flip card missing tabindex',
                    required: false,
                    suggestion: 'Add tabindex="0"',
                    location: ''
                });
            }
        });

        // Tabs
        doc.querySelectorAll('.tab').forEach(tab => {
            const buttons = tab.querySelectorAll('button');
            buttons.forEach(button => {
                if (!button.classList.contains('tablinks')) {
                    issues.push({
                        type: 'CSS Compliance',
                        element: '.tab button',
                        issue: 'Tab button missing .tablinks class',
                        required: false,
                        suggestion: 'Add class="tablinks"',
                        location: ''
                    });
                }
            });
        });

        // Dropdowns
        doc.querySelectorAll('.dropdown').forEach(dropdown => {
            if (!dropdown.querySelector('.dropdown-content')) {
                issues.push({
                    type: 'Structure',
                    element: '.dropdown',
                    issue: 'Dropdown missing .dropdown-content',
                    required: true,
                    suggestion: 'Add <div class="dropdown-content">',
                    location: ''
                });
            }
        });
    }

    function validateTypography(doc, issues) {
        const html = doc.innerHTML;

        // Non-standard fonts
        CONFIG.nonStandardFonts.forEach(font => {
            const fontRegex = new RegExp(`font-family[^;]*${font}`, 'gi');
            if (fontRegex.test(html)) {
                issues.push({
                    type: 'CSS Compliance',
                    element: `font-family: ${font}`,
                    issue: `Non-standard font "${font}" detected`,
                    required: true,
                    suggestion: 'Use "Amazon Ember" as defined in CSS',
                    location: ''
                });
            }
        });

        // Pixel font sizes
        const pxFontSizes = html.match(/font-size\s*:\s*\d+px/gi);
        if (pxFontSizes && pxFontSizes.length > 3) {
            issues.push({
                type: 'CSS Compliance',
                element: 'font-size: px',
                issue: `Found ${pxFontSizes.length} inline px font-size declarations`,
                required: false,
                suggestion: 'Use rem units (1rem, 0.875rem, etc.) or CSS',
                location: ''
            });
        }

        // Inline colors
        const inlineColors = html.match(/\bcolor\s*:\s*#[0-9a-fA-F]{3,6}/gi);
        if (inlineColors && inlineColors.length > 5) {
            issues.push({
                type: 'CSS Compliance',
                element: 'color: #...',
                issue: `Found ${inlineColors.length} inline color declarations`,
                required: false,
                suggestion: 'Use CSS classes or CSS variables',
                location: ''
            });
        }

        // Headings with inline styles
        const headingsWithStyles = doc.querySelectorAll('h1[style], h2[style], h3[style], h4[style], h5[style], h6[style]');
        if (headingsWithStyles.length > 0) {
            issues.push({
                type: 'CSS Compliance',
                element: '<h1-h6 style="">',
                issue: `Found ${headingsWithStyles.length} heading(s) with inline styles`,
                required: true,
                suggestion: 'Use standard CSS heading styles',
                location: ''
            });
        }
    }

    function validateListClasses(doc, issues) {
        // Lists with inline list-style
        const listsWithInlineStyle = doc.querySelectorAll('ul[style*="list-style"], ol[style*="list-style"]');
        if (listsWithInlineStyle.length > 0) {
            issues.push({
                type: 'CSS Compliance',
                element: '<ul/ol style="list-style">',
                issue: `Found ${listsWithInlineStyle.length} list(s) with inline list-style`,
                required: false,
                suggestion: `Use standard classes: ${CONFIG.listClasses.join(', ')}`,
                location: ''
            });
        }

        // DO/DO_NOT items not in list
        doc.querySelectorAll('li.DO, li.DO_NOT').forEach(item => {
            if (!item.closest('ul, ol')) {
                issues.push({
                    type: 'Structure',
                    element: `li.${item.className}`,
                    issue: 'DO/DO_NOT item not inside a list',
                    required: true,
                    suggestion: 'Place inside <ul> or <ol>',
                    location: ''
                });
            }
        });
    }

    function validateLayoutContainers(doc, issues) {
        // Horizontal containers
        doc.querySelectorAll('.LayoutContainerHorizontal').forEach(container => {
            const children = container.querySelectorAll('.horizontalContainer');
            if (children.length === 0) {
                issues.push({
                    type: 'Structure',
                    element: '.LayoutContainerHorizontal',
                    issue: 'No .horizontalContainer children',
                    required: true,
                    suggestion: 'Add <div class="horizontalContainer"> children',
                    location: ''
                });
            }

            children.forEach(child => {
                const style = child.getAttribute('style') || '';
                if (style.includes('width') && style.includes('px')) {
                    issues.push({
                        type: 'CSS Compliance',
                        element: '.horizontalContainer',
                        issue: 'Fixed pixel width on container',
                        required: false,
                        suggestion: 'Let CSS handle responsive sizing',
                        location: ''
                    });
                }
            });
        });

        // Row containers
        doc.querySelectorAll('.row').forEach(row => {
            const style = row.getAttribute('style') || '';
            if (style.includes('width')) {
                issues.push({
                    type: 'CSS Compliance',
                    element: '.row',
                    issue: 'Row has inline width style',
                    required: false,
                    suggestion: '.row should be 100% as defined in CSS',
                    location: ''
                });
            }
        });
    }

    function validateEmphasisBoxes(doc, issues) {
        // Non-standard box divs
        const divsWithBorder = doc.querySelectorAll('div[style*="border:"], div[style*="border-color"]');
        let nonStandardBoxes = 0;

        divsWithBorder.forEach(div => {
            const style = div.getAttribute('style') || '';
            const hasStandardClass = CONFIG.emphasisBoxClasses.some(cls => div.classList.contains(cls));
            const isCallout = CONFIG.calloutClasses.some(cls => div.classList.contains(cls));
            const isColoredMargin = CONFIG.coloredMarginClasses.some(cls => div.classList.contains(cls));

            if ((style.includes('border-radius') || style.includes('padding')) &&
                !hasStandardClass && !isCallout && !isColoredMargin) {
                nonStandardBoxes++;
            }
        });

        if (nonStandardBoxes > 0) {
            issues.push({
                type: 'CSS Compliance',
                element: '<div style="border...">',
                issue: `Found ${nonStandardBoxes} non-standard box div(s)`,
                required: false,
                suggestion: `Use: ${CONFIG.emphasisBoxClasses.join(', ')}`,
                location: ''
            });
        }
    }

    function validateSemanticSpans(doc, issues) {
        // Inline italic spans
        const italicSpans = doc.querySelectorAll('span[style*="italic"]');
        if (italicSpans.length > 0) {
            issues.push({
                type: 'CSS Compliance',
                element: '<span style="font-style:italic">',
                issue: `Found ${italicSpans.length} span(s) with inline italic`,
                required: true,
                suggestion: 'Use <em> tag instead',
                location: ''
            });
        }

        // Inline bold spans
        const boldSpans = doc.querySelectorAll('span[style*="bold"], span[style*="font-weight"]');
        if (boldSpans.length > 0) {
            issues.push({
                type: 'CSS Compliance',
                element: '<span style="font-weight:bold">',
                issue: `Found ${boldSpans.length} span(s) with inline bold`,
                required: true,
                suggestion: 'Use <strong> with appropriate class',
                location: ''
            });
        }
    }

    // ===========================================
    // CONTENT QUALITY VALIDATION
    // ===========================================

    function validateContentQuality(doc, issues) {
        // Long paragraphs
        let longParagraphs = 0;
        doc.querySelectorAll('p').forEach(p => {
            const wordCount = p.textContent.trim().split(/\s+/).length;
            if (wordCount > 150) longParagraphs++;
        });

        if (longParagraphs > 0) {
            issues.push({
                type: 'Content',
                element: '<p>',
                issue: `Found ${longParagraphs} paragraph(s) with 150+ words`,
                required: false,
                suggestion: 'Break into smaller paragraphs',
                location: ''
            });
        }

        // Long headings
        let longHeadings = 0;
        doc.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(h => {
            if (h.textContent.trim().length > 80) longHeadings++;
        });

        if (longHeadings > 0) {
            issues.push({
                type: 'Content',
                element: '<h1-h6>',
                issue: `Found ${longHeadings} heading(s) longer than 80 characters`,
                required: false,
                suggestion: 'Keep headings concise',
                location: ''
            });
        }

        // Empty paragraphs
        let emptyParagraphs = 0;
        doc.querySelectorAll('p').forEach(p => {
            if (!p.textContent.trim() && p.children.length === 0) emptyParagraphs++;
        });

                if (emptyParagraphs > 2) {
            issues.push({
                type: 'HTML',
                element: '<p>',
                issue: `Found ${emptyParagraphs} empty paragraph(s)`,
                required: false,
                suggestion: 'Remove empty paragraphs or use CSS margins',
                location: ''
            });
        }

        // Placeholder text
        const allText = doc.textContent;
        const placeholderPatterns = [
            { pattern: /lorem ipsum/i, name: 'Lorem Ipsum' },
            { pattern: /\[insert.*?\]/i, name: '[Insert...]' },
            { pattern: /\[add.*?\]/i, name: '[Add...]' },
            { pattern: /\[todo\]/i, name: '[TODO]' },
            { pattern: /\[placeholder\]/i, name: '[Placeholder]' },
            { pattern: /xxxx+/i, name: 'XXXX' },
            { pattern: /\btbd\b/i, name: 'TBD' }
        ];

        placeholderPatterns.forEach(({ pattern, name }) => {
            if (pattern.test(allText)) {
                issues.push({
                    type: 'Content',
                    element: 'text',
                    issue: `Possible placeholder text found: ${name}`,
                    required: true,
                    suggestion: 'Replace placeholder with actual content',
                    location: ''
                });
            }
        });

        // Deeply nested lists (4+ levels)
        const deeplyNestedLists = doc.querySelectorAll('ul ul ul ul, ol ol ol ol, ul ol ol ol, ol ul ul ul');
        if (deeplyNestedLists.length > 0) {
            issues.push({
                type: 'Structure',
                element: '<ul>/<ol>',
                issue: `Found ${deeplyNestedLists.length} list(s) nested 4+ levels`,
                required: false,
                suggestion: 'Consider restructuring for better readability',
                location: ''
            });
        }

        // Very long lists (more than 15 items at top level)
        doc.querySelectorAll('ul, ol').forEach((list, index) => {
            // Only check top-level lists (not nested)
            if (!list.parentElement.closest('ul, ol')) {
                const directItems = list.querySelectorAll(':scope > li');
                if (directItems.length > 15) {
                    issues.push({
                        type: 'Content',
                        element: `${list.tagName.toLowerCase()}[${index + 1}]`,
                        issue: `List has ${directItems.length} items (more than 15)`,
                        required: false,
                        suggestion: 'Consider breaking into smaller lists with subheadings',
                        location: ''
                    });
                }
            }
        });
    }

    // ===========================================
    // INLINE STYLES VALIDATION
    // ===========================================

    function validateInlineStyles(doc, issues) {
        const elementsWithStyles = doc.querySelectorAll('[style]');
        let totalInlineStyles = elementsWithStyles.length;
        let importantCount = 0;
        let outlineNoneCount = 0;
        let displayNoneCount = 0;
        let positionAbsoluteCount = 0;

        elementsWithStyles.forEach(el => {
            const style = (el.getAttribute('style') || '').toLowerCase();

            if (style.includes('!important')) importantCount++;
            if (style.includes('outline') && style.includes('none')) outlineNoneCount++;
            if (style.includes('display') && style.includes('none')) displayNoneCount++;
            if (style.includes('position') && style.includes('absolute')) positionAbsoluteCount++;
        });

        // Only flag if excessive inline styles
        if (totalInlineStyles > 50) {
            issues.push({
                type: 'CSS',
                element: 'style=""',
                issue: `Found ${totalInlineStyles} elements with inline styles`,
                required: false,
                suggestion: 'Consider moving styles to CSS classes',
                location: ''
            });
        }

        if (importantCount > 0) {
            issues.push({
                type: 'CSS',
                element: '!important',
                issue: `Found ${importantCount} use(s) of !important`,
                required: true,
                suggestion: 'Avoid !important - fix CSS cascade instead',
                location: ''
            });
        }

        if (outlineNoneCount > 0) {
            issues.push({
                type: 'Accessibility',
                element: 'outline: none',
                issue: `Found ${outlineNoneCount} element(s) with outline:none`,
                required: true,
                suggestion: 'Do not remove focus outlines',
                location: ''
            });
        }

        if (displayNoneCount > 5) {
            issues.push({
                type: 'CSS',
                element: 'display: none',
                issue: `Found ${displayNoneCount} element(s) with display:none`,
                required: false,
                suggestion: 'Review hidden elements for appropriateness',
                location: ''
            });
        }

        if (positionAbsoluteCount > 3) {
            issues.push({
                type: 'CSS',
                element: 'position: absolute',
                issue: `Found ${positionAbsoluteCount} element(s) with position:absolute`,
                required: false,
                suggestion: 'Absolute positioning may break responsive layout',
                location: ''
            });
        }
    }

    // ===========================================
    // UTILITY FUNCTIONS
    // ===========================================

    function getElementLocation(element) {
        if (!element) return '';

        try {
            let html = element.outerHTML || '';
            if (html.length > 150) {
                const tagEnd = html.indexOf('>');
                if (tagEnd > 0 && tagEnd < 150) {
                    html = html.substring(0, tagEnd + 1) + '...';
                } else {
                    html = html.substring(0, 150) + '...';
                }
            }
            return html;
        } catch (e) {
            return '';
        }
    }

    function exportToCSV(issues) {
        try {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const headers = ['Type', 'Element', 'Issue', 'Required', 'Suggestion', 'Location'];

            const csvContent = [
                headers.join(','),
                ...issues.map(issue => [
                    issue.type,
                    issue.element,
                    issue.issue,
                    issue.required ? 'Yes' : 'No',
                    issue.suggestion,
                    issue.location || 'N/A'
                ].map(field => `"${String(field).replace(/"/g, '""').replace(/\n/g, ' ')}"`).join(','))
            ].join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
            const pageTitle = document.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            const filename = `content-validation_${pageTitle}_${timestamp}.csv`;

            GM_download({
                url: URL.createObjectURL(blob),
                name: filename
            });

            const summary = summarizeIssues(issues);
            alert(`Validation complete!\n\n${summary}\n\nReport saved as: ${filename}`);
        } catch (e) {
            console.error('Error exporting to CSV:', e);
            // Fallback: show issues in console
            console.table(issues);
            alert('Error creating CSV. Check console for results.');
        }
    }

    function summarizeIssues(issues) {
        const summary = {};
        const requiredCount = issues.filter(i => i.required).length;

        issues.forEach(issue => {
            if (!summary[issue.type]) {
                summary[issue.type] = 0;
            }
            summary[issue.type]++;
        });

        let summaryText = `Found ${issues.length} total issues (${requiredCount} required fixes):\n`;
        for (const [type, count] of Object.entries(summary).sort((a, b) => b[1] - a[1])) {
            summaryText += `\n• ${type}: ${count}`;
        }

        return summaryText;
    }

})();
