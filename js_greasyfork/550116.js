// ==UserScript==
// @name         F-List Profile Editor Overhaul - Live Profile Preview
// @namespace    http://tampermonkey.net/
// @version      5.4
// @description  Adds a live side-panel preview for the character editor that fully inherits the site's theme and component styles.
// @author       Derby Falcon
// @match        *://*.f-list.net/character_edit.php*
// @grant        GM_addStyle
// @grant        unsafeWindow
// @run-at       document-start
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/550116/F-List%20Profile%20Editor%20Overhaul%20-%20Live%20Profile%20Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/550116/F-List%20Profile%20Editor%20Overhaul%20-%20Live%20Profile%20Preview.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Hide elements immediately to prevent FOUC (Flash of Unstyled Content)
    GM_addStyle(`
        #Sidebar, #Content, #Footer, #width-controls-header { /* Added #Footer and #width-controls-header */
            opacity: 0;
            transition: opacity 0.5s ease-in-out;
        }
    `);

    GM_addStyle(`
        /* Modern Toolbar Styles */
        .modern-toolbar {
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
            padding: 5px;
            background-color: #2a2525; /* Darker background for the toolbar */
            border: 1px solid #444;
            border-radius: 4px;
            margin-bottom: 10px;
            margin: 0 auto 10px auto; /* Center the toolbar and add bottom margin */
            max-width: fit-content; /* Allow toolbar to shrink to content width */
        }

        .toolbar-section {
            display: flex;
            gap: 2px;
            border-right: 1px solid #444;
            padding-right: 5px;
        }

        .toolbar-section:last-child {
            border-right: none;
            padding-right: 0;
        }

        .toolbar-button {
            background-color: #333;
            color: #ccc;
            border: 1px solid #555;
            padding: 5px 8px;
            border-radius: 3px;
            cursor: pointer;
            font-size: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background-color 0.2s, border-color 0.2s;
        }

        .toolbar-button:hover {
            background-color: #444;
            border-color: #777;
        }

        /* Apply original F-List toolbar icon classes directly to spans */
        .toolbar-button .ToolbarBold,
        .toolbar-button .ToolbarItalic,
        .toolbar-button .ToolbarUnderline,
        .toolbar-button .ToolbarJustify,
        .toolbar-button .ToolbarQuote,
        .toolbar-button .ToolbarLink,
        .toolbar-button .ToolbarColor,
        .toolbar-button .ToolbarIcon,
        .toolbar-button .ToolbarCollapse,
        .toolbar-button .ToolbarInline,
        .toolbar-button .ToolbarPreview { /* Assuming a class for preview if it exists */
            display: inline-block;
            width: 16px; /* Standard icon size */
            height: 16px; /* Standard icon size */
            background-repeat: no-repeat;
            background-position: center center;
            vertical-align: middle;
            /* Removed margin-right to center icons within buttons */
        }

        /* Specific styles for dropdown buttons */
        .toolbar-button .icon-unicode {
            display: inline-block;
            width: 16px;
            height: 16px;
            background-repeat: no-repeat;
            background-position: center center;
            vertical-align: middle;
            /* Removed margin-right to center icons within buttons */
        }

        .toolbar-button .ToolbarMonospace { background-image: url('https://static.f-list.net/images/toolbar/code.png'); } /* Assuming a code.png icon */

        .toolbar-button .icon-unicode { background-image: url('https://static.f-list.net/images/charimage/42347482.png'); }
        .toolbar-button .icon-smiley { background-image: url('https://static.f-list.net/images/charimage/42347340.png'); }


        .toolbar-button[data-action="preview"] {
            background-color: #78c624; /* F-List green */
            color: #fff;
            border-color: #6aa820;
        }

        .toolbar-button[data-action="preview"]:hover {
            background-color: #6aa820;
            border-color: #5c901c;
        }

        /* Dropdown specific styles */
        .dropdown-container {
            position: relative;
            display: inline-block;
        }

        .dropdown-content {
            display: none;
            position: absolute;
            background-color: #333;
            min-width: 250px;
            box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
            z-index: 1;
            border: 1px solid #555;
            padding: 5px;
            max-height: 200px;
            overflow-y: auto;
            left: 50%; /* Center the dropdown horizontally */
            transform: translateX(-50%); /* Adjust for half of its own width */
            top: 100%; /* Position below the button */
        }

        .smiley-dropdown-content {
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
            min-width: 200px;
        }

        .dropdown-content table {
            width: 100%;
            border-collapse: collapse;
        }

        .dropdown-content th, .dropdown-content td {
            text-align: left;
            padding: 5px;
            border-bottom: 1px solid #444;
        }

        .dropdown-content th {
            border-bottom: 1px solid #555;
        }

        .dropdown-content .cs {
            border: 1px solid #000;
            padding: 2px 5px;
            cursor: pointer;
            display: inline-block;
            min-width: 20px;
            text-align: center;
            background-color: #555;
        }

        .dropdown-content .smiley-button {
            background-color: transparent;
            padding: 2px;
            cursor: pointer;
        }

        .dropdown-content .smiley-button img {
            width: 24px;
            height: 24px;
            vertical-align: middle;
        }
    `);


    /* global $, unsafeWindow, GM_addStyle */

    // -------------------------------------------------
    // START: BBCode Parser (No changes in this section)
    // -------------------------------------------------
    const appendTextWithLineBreaks = (parent, text) => {
        if (!parent || typeof text !== 'string') return;

        const parts = text.split('\n');
        for (let i = 0; i < parts.length; i++) {
            if (parts[i].length > 0) {
                parent.appendChild(document.createTextNode(parts[i]));
            }
            if (i < parts.length - 1) {
                parent.appendChild(document.createElement('br'));
            }
        }
    };
    class BBCodeTag {
        noClosingTag = false;
        allowedTags = undefined;
        constructor(tag, tagList) { this.tag = tag; if (tagList !== undefined) this.setAllowedTags(tagList); }
        isAllowed(tag) { return this.allowedTags === undefined || this.allowedTags[tag] !== undefined; }
        setAllowedTags(allowed) { this.allowedTags = {}; for (const tag of allowed) this.allowedTags[tag] = true; }
    }
    class BBCodeSimpleTag extends BBCodeTag {
        constructor(tag, elementName, classes, tagList) { super(tag, tagList); this.elementName = elementName; this.classes = classes; }
        createElement(parser, parent, param) {
            const el = parser.createElement(this.elementName);
            if (this.classes !== undefined && this.classes.length > 0) { el.className = this.classes.join(' '); }
            parent.appendChild(el); return el;
        }
    }
    class BBCodeCustomTag extends BBCodeTag {
        constructor(tag, customCreator, tagList) { super(tag, tagList); this.customCreator = customCreator; }
        createElement(parser, parent, param) { return this.customCreator(parser, parent, param); }
    }
    class BBCodeTextTag extends BBCodeTag {
        constructor(tag, customCreator) { super(tag, []); this.customCreator = customCreator; }
        createElement(parser, parent, param, content) { return this.customCreator(parser, parent, param, content); }
    }
    class BBCodeParser {
        _tags = {}; _line = 1; _column = 1; _currentTag = { tag: '<root>', line: 1, column: 1 };
        addTag(impl) { this._tags[impl.tag] = impl; }
        createElement(tag) { return document.createElement(tag); }
        parseEverything(input) {
            const parent = this.createElement('span'); parent.className = 'bbcode';
            this.parse(input, 0, undefined, parent, () => true, 0); return parent;
        }
        parse(input, start, self, parent, isAllowed, depth) {
            let currentTag = this._currentTag;
            if (self !== undefined) {
                const parentAllowed = isAllowed; isAllowed = name => self.isAllowed(name) && parentAllowed(name);
                currentTag = this._currentTag = { tag: self.tag, line: this._line, column: this._column };
            }
            let tagStart = -1, paramStart = -1, mark = start;
            for (let i = start; i < input.length; ++i) {
                const c = input[i];
                if (c === '\n') { this._line++; this._column = 1; } else { this._column++; }
                if (c === '[') { tagStart = i; paramStart = -1;
                } else if (c === '=' && tagStart !== -1 && paramStart === -1) { paramStart = i;
                } else if (c === ']' && tagStart !== -1) {
                    const paramIndex = paramStart === -1 ? i : paramStart;
                    let tagKeyRaw = input.substring(tagStart + 1, paramIndex);
                    const close = tagKeyRaw.startsWith('/');
                    if (close) {
                        tagKeyRaw = tagKeyRaw.substr(1);
                    }
                    let tagKey = tagKeyRaw.trim().toLowerCase();
                    if (tagKey.length === 0) { tagStart = -1; continue; }
                    const param = paramStart > tagStart ? input.substring(paramStart + 1, i) : '';
                    if (this._tags[tagKey] === undefined) { tagStart = -1; continue; }
                    const tag = this._tags[tagKey];
                    if (!close) {
                        if (parent !== undefined) { appendTextWithLineBreaks(parent, input.substring(mark, tagStart)); }
                        mark = i + 1;
                        if (!isAllowed(tagKey) || parent === undefined || depth > 100) {
                            i = this.parse(input, i + 1, tag, undefined, isAllowed, depth + 1); mark = i + 1; continue;
                        }
                        if (tag instanceof BBCodeTextTag) {
                            const endPos = this.parse(input, i + 1, tag, undefined, isAllowed, depth + 1);
                            const closingTag = `[/${tag.tag}]`;
                            const contentEnd = input.indexOf(closingTag, mark);
                            const content = input.substring(mark, contentEnd !== -1 ? contentEnd : mark);
                            tag.createElement(this, parent, param.trim(), content);
                            i = contentEnd !== -1 ? contentEnd + closingTag.length - 1 : endPos; // Adjust i to skip the closing tag
                        } else {
                            const element = tag.createElement(this, parent, param.trim());
                            if (element !== undefined && !tag.noClosingTag) { i = this.parse(input, i + 1, tag, element, isAllowed, depth + 1); }
                        }
                        mark = i + 1; this._currentTag = currentTag;
                    } else if (self !== undefined && self.tag === tagKey) {
                        if (parent !== undefined) { appendTextWithLineBreaks(parent, input.substring(mark, tagStart)); }
                        return i;
                    } else if (close) {
                        tagStart = -1;
                        continue;
                    }
                    tagStart = -1;
                }
            }
            if (mark < input.length && parent !== undefined) { appendTextWithLineBreaks(parent, input.substring(mark)); }
            return input.length;
        }
    }
    // -------------------------------------------------
    // END: BBCode Parser
    // -------------------------------------------------

    // -------------------------------------------------
    // START: F-List Parser Configuration (No changes here)
    // -------------------------------------------------
    function createFListParser() {
        const parser = new BBCodeParser();
        parser.addTag(new BBCodeSimpleTag('b', 'b'));
        parser.addTag(new BBCodeSimpleTag('i', 'i'));
        parser.addTag(new BBCodeSimpleTag('u', 'u'));
        parser.addTag(new BBCodeSimpleTag('s', 's'));
        parser.addTag(new BBCodeSimpleTag('sup', 'sup'));
        parser.addTag(new BBCodeSimpleTag('sub', 'sub'));
        parser.addTag(new BBCodeSimpleTag('quote', 'blockquote'));
        const hrTag = new BBCodeSimpleTag('hr', 'hr');
        hrTag.noClosingTag = true;
        parser.addTag(hrTag);
        parser.addTag(new BBCodeCustomTag('center', (p, parent) => {
            const spanEl = p.createElement('span');
            spanEl.className = 'centertext';
            const divEl = p.createElement('div');
            spanEl.appendChild(divEl);
            parent.appendChild(spanEl);
            return divEl; // Return the div so content is parsed into it
        }));
        parser.addTag(new BBCodeCustomTag('right', (p, parent) => {
            const el = p.createElement('div'); el.style.textAlign = 'right'; parent.appendChild(el); return el;
        }));
        parser.addTag(new BBCodeCustomTag('justify', (p, parent) => {
            const el = p.createElement('div'); el.style.textAlign = 'justify'; parent.appendChild(el); return el;
        }));
        parser.addTag(new BBCodeCustomTag('left', (p, parent) => {
            const el = p.createElement('div'); el.style.textAlign = 'left'; parent.appendChild(el); return el;
        }));
        parser.addTag(new BBCodeCustomTag('indent', (p, parent) => {
            const el = p.createElement('div'); el.style.paddingLeft = '3em'; parent.appendChild(el); return el;
        }));
        parser.addTag(new BBCodeSimpleTag('big', 'span', ['bigtext']));
        parser.addTag(new BBCodeSimpleTag('small', 'span', ['smalltext']));
        parser.addTag(new BBCodeSimpleTag('heading', 'h2'));
        parser.addTag(new BBCodeCustomTag('color', (p, parent, param) => {
            const el = p.createElement('span'); // Changed from 'div' to 'span'
            if (/^(#([0-9a-f]{3}){1,2}|[a-z]+)$/i.test(param)) {
                const colorClassMap = {
                    'white': 'whitefont',
                    'red': 'redfont',
                    // Add other color mappings as needed based on F-List's CSS
                };
                const className = colorClassMap[param.toLowerCase()];
                if (className) {
                    el.className = className;
                } else {
                    el.style.color = param;
                }
                // Store the color value as a data attribute for potential nested handling
                el.setAttribute('data-color', param);
            }
            parent.appendChild(el); return el;
        }));
        parser.addTag(new BBCodeCustomTag('url', (p, parent, param) => {
            let url = param.trim();
            const a = p.createElement('a');
            a.target = '_blank';
            a.rel = 'noopener noreferrer nofollow';
            a.style.color = 'inherit'; // Inherit color by default

            if (!url) {
                // If no URL parameter, the content itself will be the URL.
                // The actual text content will be parsed into 'a' by the main parser.
                a.href = '#'; // Placeholder href
                parent.appendChild(a);
                return a; // Return 'a' so content is parsed into it
            }

            if (url.startsWith('http://') || url.startsWith('https://')) {
                a.href = url;
                parent.appendChild(a);

                const domainSpan = p.createElement('span');
                const domainMatch = url.match(/:\/\/(?:www\.)?([^\/]+)/);
                if (domainMatch) {
                    domainSpan.textContent = ` [${domainMatch[1]}]`;
                    domainSpan.style.fontSize = '0.8em';
                    parent.appendChild(domainSpan); // Append domain span to the parent, not the link itself
                }
                return a; // Return 'a' so content is parsed into it
            } else {
                // If URL is invalid, create a non-functional link and let content be parsed into it.
                a.href = '#';
                parent.appendChild(a);
                return a; // Return 'a' so content is parsed into it
            }
        }));
        parser.addTag(new BBCodeTextTag('img', (p, parent, param, content) => {
            const divEl = p.createElement('div'); // Create a div wrapper
            const img = p.createElement('img');
            img.className = 'ImageBlock'; // Apply the class

            if (param) {
                const inlines = unsafeWindow.FList.Inlines.inlines;
                const inlineData = inlines ? inlines[param] : null;
                if (inlineData) {
                    const { hash, extension } = inlineData;
                    img.src = `https://static.f-list.net/images/charinline/${hash.substring(0, 2)}/${hash.substring(2, 4)}/${hash}.${extension}`;
                    img.alt = content.trim();
                    divEl.appendChild(img); // Append img to div
                    parent.appendChild(divEl); // Append div to parent
                } else {
                    // Inline image not found or doesn't belong to account - display raw BBCode
                    appendTextWithLineBreaks(parent, `[img=${param}]${content}[/img]`);
                    return;
                }
            } else {
                const url = content.trim();
                if (url.startsWith('http://') || url.startsWith('https://')) {
                    img.src = url;
                    divEl.appendChild(img); // Append img to div
                    parent.appendChild(divEl); // Append div to parent
                }
                else {
                    appendTextWithLineBreaks(parent, `[img]${content}[/img]`);
                    return;
                }
            }
        }));
        const createUserTag = (p, parent, param, content) => {
            const name = content.trim(); if (!name) return;
            const a = p.createElement('a');
            a.href = `https://www.f-list.net/c/${encodeURIComponent(name)}`; a.target = '_blank'; a.className = 'character-icon';
            const img = p.createElement('img');
            img.src = `https://static.f-list.net/images/avatar/${name.toLowerCase().replace(/ /g, '%20')}.png`;
            img.style.cssText = 'width:50px; height:50px; vertical-align:middle; border: 0;'; // Removed margin-right
            a.appendChild(img); parent.appendChild(a);
        };
        parser.addTag(new BBCodeTextTag('icon', createUserTag));
        parser.addTag(new BBCodeTextTag('user', (p, parent, param, content) => {
            const name = content.trim(); if (!name) return;
            const a = p.createElement('a');
            a.href = `https://www.f-list.net/c/${encodeURIComponent(name)}`;
            a.target = '_blank';
            a.className = 'AvatarLink';
            appendTextWithLineBreaks(a, name);
            parent.appendChild(a);
        }));
        parser.addTag(new BBCodeCustomTag('collapse', (p, parent, param) => {
            const header = p.createElement('div');
            header.className = 'CollapseHeader';
            header.setAttribute('bound', 'true'); // Add bound attribute like website

            const headerText = p.createElement('div');
            headerText.className = 'CollapseHeaderText';

            const headerSpan = p.createElement('span');
            appendTextWithLineBreaks(headerSpan, param || '\u00A0');

            headerText.appendChild(headerSpan);
            header.appendChild(headerText);

            const block = p.createElement('div');
            block.className = 'CollapseBlock';

            parent.appendChild(header);
            parent.appendChild(block);

            $(header).on('click', function() {
                $(this).toggleClass('ExpandedHeader');
                $(block).slideToggle(200);
            });

            return block;
        }));
        parser.addTag(new BBCodeTextTag('noparse', (p, parent, param, content) => {
            appendTextWithLineBreaks(parent, content);
        }));
        parser.addTag(new BBCodeTextTag('session', (p, parent, param, content) => {
            const a = p.createElement('a');
            a.href = '#';
            a.onclick = () => false;
            a.className = 'SessionLink';
            a.textContent = content.trim();
            parent.appendChild(a);
        }));
        parser.addTag(new BBCodeTextTag('eicon', (p, parent, param, content) => {
            const img = p.createElement('img');
            img.src = `https://static.f-list.net/images/eicon/${content.trim().toLowerCase()}.gif`;
            img.className = 'eicon';
            img.style.width = '50px';
            img.style.height = '50px';
            parent.appendChild(img);
        }));
        return parser;
    }
    // -------------------------------------------------
    // END: F-List Parser Configuration
    // -------------------------------------------------

    function waitForElementAndRun() {
        const interval = setInterval(function() {
            const contentElement = document.getElementById('Content');
            const fListDefined = typeof unsafeWindow.FList !== 'undefined';
            const fListInlinesDefined = fListDefined && typeof unsafeWindow.FList.Inlines !== 'undefined';

            console.log(`F-List Live Preview: Waiting for elements. Content: ${!!contentElement}, FList: ${fListDefined}, FList.Inlines: ${fListInlinesDefined}`);

            if (contentElement && fListDefined && fListInlinesDefined) {
                clearInterval(interval);
                console.log("F-List Live Preview: All required elements found. Running main function.");
                main();
            }
        }, 100);
    }

    function main() {
        // --- KEY CHANGE: Updated CSS ---
        GM_addStyle(`
            #Sidebar {
                width: 40px !important;
                min-width: 40px !important;
                padding: 0 !important;
            }
            #Content {
                display: flex;
                gap: 10px;
            }
            #editor-wrapper {
                flex: 1;
                min-width: 300px;
                height: 85vh;
                overflow-y: auto;
                overflow-x: hidden; /* Prevent horizontal scrollbar */
                padding: 5px;
                box-sizing: border-box;
            }
            #editor-wrapper > form > table, #tabs {
                width: 100% !important;
                box-sizing: border-box;
            }
            #editor-wrapper .panel {
                margin-left: 0 !important;
                margin-right: 0 !important;
            }
            #live-preview-sidebar {
                flex: 0 0 auto; /* Don't grow or shrink, use explicit width */
                min-width: 300px;
                box-sizing: border-box;
                height: 85vh; /* Set a fixed height to prevent overlap */
                display: flex;
                flex-direction: column;
            }
            #live-preview-wrapper {
                flex: 1;
                display: flex;
                flex-direction: column;
                min-height: 0; /* Prevents flexbox overflow issues */
            }
            #preview-header {
                display: flex;
                flex-direction: column;
                gap: 10px;
                padding: 0 10px 10px 10px;
                color: #ccc;
            }
            .width-control {
                display: flex;
                align-items: center;
            }
            .width-control input[type=range] {
                flex: 1;
                margin: 0 10px;
            }
            .width-control .width-label {
                min-width: 45px;
                text-align: right;
            }
            #live-preview-content.panel {
                flex: 1;
                overflow: auto;
                overflow-x: auto; /* Move horizontal scroll to panel level */
                background-image: none !important;
                /* background-color is now set by JS for theme consistency */
                padding: 5px;
                box-sizing: border-box;
                min-width: 0; /* Allow the panel to shrink below content size */
            }
            #live-preview-content .character-description {
                transform-origin: top left;
                /* Scaling will be applied by JS */
                max-width: 100%;
                min-width: 659px; /* Start at default width of 659px */
                width: 100%; /* Fill available width */
                /* overflow-x: auto; REMOVED - scrollbar moved to panel level */
                line-height: 1.4;
                word-wrap: break-word;
            }
            #live-preview-content .character-description > * {
                max-width: 100%; /* Constrain all direct children to container width */
                box-sizing: border-box;
            }
            #live-preview-content .CollapseBlock {
                background-color: #4C4646;
                padding: 10px;
                margin: 0;
                width: 100%; /* Ensure collapse blocks fill container width */
                box-sizing: border-box;
                min-width: 100%; /* Maintain same width when expanded */
                max-width: 659px; /* Constrain to same width as content */
            }
            #live-preview-content .CollapseHeader {
                width: 100%; /* Ensure collapse headers fill container width */
                box-sizing: border-box;
                min-width: 100%; /* Maintain same width when collapsed */
                max-width: 659px; /* Constrain to same width as content */
            }
            #live-preview-content .CollapseHeaderText {
                width: 100%; /* Ensure header text fills the header */
                box-sizing: border-box;
            }
            #live-preview-content .CollapseHeaderText span {
                display: block;
                width: 100%;
                box-sizing: border-box;
            }
            #CharacterEditDescription {
                resize: vertical !important;
            }
            #live-preview-content h2 {
                color: #78c624 !important;
            }

            /* Custom styles for dropdown buttons and smiley icons */
            .unicode-dropdown-container .ToolbarButton,
            .smiley-dropdown-container .ToolbarButton {
                background-color: transparent !important; /* Ensure transparent background */
                display: flex !important;
                justify-content: center !important;
                align-items: center !important;
                padding: 5px 10px !important; /* Adjust padding as needed */
            }

            .unicode-dropdown-container .ToolbarButton img,
            .smiley-dropdown-container .ToolbarButton img {
                display: inline-block !important;
                vertical-align: middle !important;
                width: 16px !important;
                height: 16px !important;
            }


            /* Removed ToolbarUnicodeIcon and ToolbarSmileyIcon CSS as Bootstrap Icons are now used */

            .smiley-button {
                background-color: transparent !important;
                display: flex !important;
                justify-content: center !important;
                align-items: center !important;
                padding: 2px !important;
            }


            .smiley-button img {
                width: 24px; /* Ensure consistent size */
                height: 24px; /* Ensure consistent size */
                vertical-align: middle; /* Align image vertically */
            }
        `);

        const contentCell = document.getElementById('Content');
        const originalSidebar = document.getElementById('Sidebar');
        if (!contentCell || !originalSidebar) return;

        // Remove the content from the original sidebar, keeping it as a decorative element
        originalSidebar.innerHTML = '';

        // Create a new subheader for width controls below the navigation bar
        const widthControlsHeader = document.createElement('div');
        widthControlsHeader.id = 'width-controls-header';
        widthControlsHeader.style.padding = '10px';
        widthControlsHeader.style.backgroundColor = '#2A2525'; // Default F-List header color
        widthControlsHeader.style.borderBottom = '1px solid #444';
        widthControlsHeader.innerHTML = `
            <div class="width-control">
                <span>Content Scale:</span>
                <input type="range" id="content-width-slider" min="300" max="1200" value="659">
                <span class="width-label" id="content-width-label">659px</span>
            </div>
            <div class="width-control">
                <span>Panel Width:</span>
                <input type="range" id="panel-width-slider" min="300" max="1200" value="659">
                <span class="width-label" id="panel-width-label">659px</span>
            </div>`;

        // Insert the width controls header before the content cell
        contentCell.parentNode.insertBefore(widthControlsHeader, contentCell);

        // Create a wrapper for the existing editor content
        const editorWrapper = document.createElement('div');
        editorWrapper.id = 'editor-wrapper';

        // --- KEY CHANGE: Create a new sidebar that wraps the preview ---
        const previewSidebarWrapper = document.createElement('div');
        previewSidebarWrapper.id = 'live-preview-sidebar';

        // Get theme colors
        const sidebarStyle = window.getComputedStyle(originalSidebar);
        const contentStyle = window.getComputedStyle(contentCell);
        const originalSidebarColor = sidebarStyle.backgroundColor;
        const contentBackgroundColor = contentStyle.backgroundColor;

        // Apply themed colors to the new sidebar
        previewSidebarWrapper.style.backgroundColor = contentBackgroundColor;
        previewSidebarWrapper.style.padding = '10px';
        previewSidebarWrapper.style.borderLeft = sidebarStyle.borderLeft;

        // This inner wrapper holds the preview content itself
        const previewWrapper = document.createElement('div');
        previewWrapper.id = 'live-preview-wrapper';
        previewWrapper.innerHTML = `
            <div id="live-preview-content" class="panel"><div class="character-description" style="max-width: 659px;"></div></div>`;

        // Apply themed color to the inner panel
        const previewContentPanel = previewWrapper.querySelector('#live-preview-content');
        if (previewContentPanel) {
            previewContentPanel.style.backgroundColor = originalSidebarColor;
        }

        // Place the preview content inside the new styled sidebar
        previewSidebarWrapper.appendChild(previewWrapper);

        // Move all of the original editor content into its own wrapper
        while (contentCell.firstChild) {
            editorWrapper.appendChild(contentCell.firstChild);
        }

        // Add the editor and the new preview sidebar back to the main content area
        contentCell.appendChild(editorWrapper);
        contentCell.appendChild(previewSidebarWrapper);

        // --- KEY CHANGE: Make elements visible now that the layout is ready ---
        GM_addStyle('#Sidebar, #Content, #Footer, #width-controls-header { opacity: 1; }'); /* Added #Footer and #width-controls-header */

        // Get references to the textarea and the preview display area
        const descriptionTextarea = document.getElementById('CharacterEditDescription');
        const previewContentDiv = document.querySelector('#live-preview-content .character-description');
        const parser = createFListParser();

        let previewTimeout;
        const updatePreview = () => {
            const bbcode = descriptionTextarea.value;
            if (!bbcode.trim()) {
                previewContentDiv.innerHTML = '<em>Start typing to see a preview...</em>';
                return;
            }
            try {
                const parsedElement = parser.parseEverything(bbcode);
                previewContentDiv.innerHTML = '';
                previewContentDiv.appendChild(parsedElement);
            } catch (e) {
                console.error("F-List Live Preview: Error during parsing.", e);
                previewContentDiv.innerHTML = `<em style="color: red;">Error parsing BBCode. See console for details.</em>`;
            }
        };

        const debouncedUpdatePreview = () => {
            clearTimeout(previewTimeout);
            previewTimeout = setTimeout(updatePreview, 300);
        };

        descriptionTextarea.addEventListener('input', debouncedUpdatePreview);
        updatePreview();

        // Insert the new section for special unicode characters inside the "Basic details" tab
        let basicDetailsHeader = null;
        const h3Elements = editorWrapper.querySelectorAll('h3');
        for (const h3 of h3Elements) {
            if (h3.textContent.trim() === 'Basic details') {
                basicDetailsHeader = h3;
                break;
            }
        }

        if (basicDetailsHeader) {
            const basicDetailsContentDiv = basicDetailsHeader.nextElementSibling; // This is the ui-accordion-content div
            if (basicDetailsContentDiv) {

                const descriptionPanel = basicDetailsContentDiv.querySelector('.panel.form-element'); // The panel containing the textarea

                // New modern toolbar HTML
                const modernToolbarHtml = `
                    <div class="modern-toolbar">
                        <div class="toolbar-section">
                            <button type="button" class="toolbar-button" data-bbcode="b" title="Bold"><span class="ToolbarBold"></span></button>
                            <button type="button" class="toolbar-button" data-bbcode="i" title="Italic"><span class="ToolbarItalic"></span></button>
                            <button type="button" class="toolbar-button" data-bbcode="u" title="Underline"><span class="ToolbarUnderline"></span></button>
                            <button type="button" class="toolbar-button" data-bbcode="justify" title="Justify"><span class="ToolbarJustify"></span></button>
                            <button type="button" class="toolbar-button" data-bbcode="quote" title="Blockquote"><span class="ToolbarQuote"></span></button>
                        </div>
                        <div class="toolbar-section">
                            <button type="button" class="toolbar-button" data-bbcode="link" title="Link"><span class="ToolbarLink"></span></button>
                            <button type="button" class="toolbar-button" data-bbcode="color" title="Color"><span class="ToolbarColor"></span></button>
                            <button type="button" class="toolbar-button" data-bbcode="icon" title="Icon link"><span class="ToolbarIcon"></span></button>
                            <button type="button" class="toolbar-button" data-bbcode="collapse" title="Collapse"><span class="ToolbarCollapse"></span></button>
                            <button type="button" class="toolbar-button" data-bbcode="inline" title="Insert Inline"><span class="ToolbarInline"></span></button>
                        </div>
                        <div class="toolbar-section dropdown-container unicode-dropdown-section">
                            <!-- Unicode Dropdown will be inserted here by JS -->
                        </div>
                    </div>
                `;

                // Remove the old toolbar and insert the new one
                const oldToolbar = descriptionPanel.querySelector('.TextareaToolbar.MediumPanel');
                if (oldToolbar) {
                    oldToolbar.remove();
                }
                $(descriptionPanel).prepend(modernToolbarHtml);

                const newToolbar = descriptionPanel.querySelector('.modern-toolbar');

                const unicodeCharacters = [
                    { name: 'Zero Width Space (ZWSP)', char: '​' },
                    { name: 'Zero Width Joiner (ZWJ)', char: '‍' },
                    { name: 'Zero Width Non-Joiner (ZWNJ)', char: '‌' },
                    { name: 'Left-To-Right Mark (LTR)', char: '‎' },
                    { name: 'Right-To-Left Mark (RTL)', char: '‏' },
                    { name: 'En Quad (U+2000)', char: '\u2000' },
                    { name: 'Em Quad (U+2001)', char: '\u2001' },
                    { name: 'En Space (U+2002)', char: '\u2002' },
                    { name: 'Em Space (U+2003)', char: '\u2003' },
                    { name: 'Three-Per-Em Space (U+2004)', char: '\u2004' },
                    { name: 'Four-Per-Em Space (U+2005)', char: '\u2005' },
                    { name: 'Six-Per-Em Space (U+2006)', char: '\u2006' },
                    { name: 'Figure Space (U+2007)', char: '\u2007' },
                    { name: 'Punctuation Space (U+2008)', char: '\u2008' },
                    { name: 'Thin Space (U+2009)', char: '\u2009' },
                    { name: 'Hair Space (U+200A)', char: '\u200A' },
                    { name: 'Narrow No-Break Space (U+202F)', char: '\u202F' },
                    { name: 'Medium Mathematical Space (U+205F)', char: '\u205F' },
                    { name: 'Ideographic Space (U+3000)', char: '\u3000' }
                ];

                let unicodeDropdownHtml = `
                    <div class="unicode-dropdown-container dropdown-content">
                        <table id="non-printing-chars-table" class="alt-codes" style="width: 100%; border-collapse: collapse;">
                            <tbody>
                                <tr>
                                    <th style="text-align: left; padding: 5px; border-bottom: 1px solid #555;">Description</th>
                                    <th style="text-align: left; padding: 5px; border-bottom: 1px solid #555;">Click to Copy</th>
                                </tr>
                `;

                unicodeCharacters.forEach(item => {
                    unicodeDropdownHtml += `
                                <tr>
                                    <td style="padding: 5px; border-bottom: 1px solid #444;">${item.name}</td>
                                    <td style="padding: 5px; border-bottom: 1px solid #444;"><span class="cs" title="${item.name}" data-clipboard-text="${item.char}" style="border: 1px solid #000; padding: 2px 5px; cursor: pointer; display: inline-block; min-width: 20px; text-align: center; background-color: #555;">${item.char}</span></td>
                                </tr>
                    `;
                });

                unicodeDropdownHtml += `
                            </tbody>
                        </table>
                    </div>
                `;

                // START: Monospace Dropdown Implementation - Removed as per user feedback
                // START: Smiley Dropdown Implementation - Removed as per user feedback
                const smileyBox = descriptionPanel.querySelector('.SmileyBox');
                // Ensure the original smiley box is hidden, not removed, to prevent update errors.
                if (smileyBox) {
                    $(smileyBox).hide();
                }
                let smileyDropdownHtml = ''; // No smiley dropdown HTML needed in the new toolbar

                if (newToolbar) {
                    // Append dropdown buttons to the new toolbar
                    const unicodeDropdownButtonHtml = `<button id="unicode-dropdown-button" class="toolbar-button" title="Unicode Characters"><img src="https://static.f-list.net/images/charimage/42347482.png" style="width: 16px; height: 16px;" alt="Unicode Icon"></button>`;

                    $(newToolbar).find('.unicode-dropdown-section').prepend(unicodeDropdownButtonHtml);
                    $(newToolbar).find('.unicode-dropdown-section').append(unicodeDropdownHtml);
                    // Removed monospace and smiley dropdown buttons and content as per user feedback

                    // Add click handlers for the new toolbar buttons
                    $(newToolbar).on('click', '.toolbar-button', function(event) {
                        event.preventDefault();
                        const bbcode = $(this).data('bbcode');
                        const action = $(this).data('action');

                        if (action === 'preview') {
                            // Preview button is now outside the toolbar, handled separately
                        } else if (bbcode) {
                            switch (bbcode) {
                                case 'b':
                                    unsafeWindow.$('#CharacterEditDescription').insertAtCaret('[b]','[/b]');
                                    break;
                                case 'i':
                                    unsafeWindow.$('#CharacterEditDescription').insertAtCaret('[i]','[/i]');
                                    break;
                                case 'u':
                                    unsafeWindow.$('#CharacterEditDescription').insertAtCaret('[u]','[/u]');
                                    break;
                                case 'justify':
                                    unsafeWindow.$('#CharacterEditDescription').insertAtCaret('[justify]','[/justify]');
                                    break;
                                case 'quote':
                                    unsafeWindow.$('#CharacterEditDescription').insertAtCaret('[quote]','[/quote]');
                                    break;
                                case 'link':
                                    var linkurl=unsafeWindow.FList.Toolbars_createLink();
                                    if(linkurl!==-1){ unsafeWindow.$('#CharacterEditDescription').insertAtCaret('[url=' + linkurl + ']','[/url]'); }
                                    break;
                                case 'color':
                                    var colortext=unsafeWindow.FList.Toolbars_createColor();
                                    if(colortext!==-1){ unsafeWindow.$('#CharacterEditDescription').insertAtCaret('[color=' + colortext + ']','[/color]'); }
                                    break;
                                case 'icon':
                                    var icontext=unsafeWindow.FList.Toolbars_createIconLink();
                                    if(icontext!==-1){ unsafeWindow.$('#CharacterEditDescription').insertAtCaret('','[icon]' + icontext + '[/icon]'); }
                                    break;
                                case 'collapse':
                                    unsafeWindow.$('#CharacterEditDescription').insertAtCaret('[collapse=title]','[/collapse]');
                                    break;
                                case 'inline':
                                    unsafeWindow.FList.Toolbars_showInlines('CharacterEditDescription');
                                    break;
                            }
                        }
                    });

                    // Add dropdown toggle functionality for unicode
                    $(newToolbar).on('click', '#unicode-dropdown-button', function(event) {
                        event.preventDefault();
                        event.stopPropagation(); // Prevent event from bubbling up and causing form submission
                        const unicodeDropdown = $(newToolbar).find('.unicode-dropdown-container.dropdown-content');
                        unicodeDropdown.slideToggle(200);

                        // Centering logic for unicode dropdown relative to the textarea
                        const descriptionTextareaRect = descriptionTextarea.getBoundingClientRect();
                        const dropdownRect = unicodeDropdown.getBoundingClientRect();

                        const editorPanel = descriptionPanel; // The .panel.form-element
                        const editorPanelRect = editorPanel.getBoundingClientRect();

                        // Calculate left position relative to the editorPanel to center it over the textarea
                        const centeredLeft = (descriptionTextareaRect.left - editorPanelRect.left) + (descriptionTextareaRect.width / 2) - (dropdownRect.width / 2);

                        // Calculate top position to be just below the toolbar and above the textarea
                        const toolbarHeight = $(newToolbar).outerHeight(true);
                        const topPosition = toolbarHeight + 5; // 5px buffer below toolbar

                        unicodeDropdown.css({
                            left: `${centeredLeft}px`,
                            top: `${topPosition}px`,
                            position: 'absolute' // Ensure position is absolute for custom placement
                        });
                    });

                    // Removed monospace dropdown toggle functionality as per user feedback
                    // Removed smiley dropdown toggle functionality as per user feedback

                    // Close any dropdown if the user clicks outside of it
                    $(document).on('click', function(event) {
                        if (!$(event.target).closest('.modern-toolbar').length) {
                            $(newToolbar).find('.unicode-dropdown-container.dropdown-content').slideUp(200);
                            // Removed monospace dropdown close as it's no longer in the toolbar
                            // Removed smiley dropdown close as it's no longer in the toolbar
                        }
                    });

                    // Add click-to-copy functionality to the unicode table
                    $(newToolbar).find('#non-printing-chars-table').on('click', '.cs', function() {
                        const textToCopy = $(this).data('clipboard-text');
                        navigator.clipboard.writeText(textToCopy).then(() => {
                            const originalText = $(this).text();
                            $(this).text('Copied!');
                            setTimeout(() => {
                                $(this).text(originalText);
                            }, 1000);
                        }).catch(err => {
                            console.error('F-List Live Preview: Failed to copy text: ', err);
                        });
                    });

                    // Removed click functionality to monospace dropdown items as per user feedback
                    // Removed click functionality to smiley buttons as per user feedback
                }
            }
        }

        // Create and insert the new Preview button above the live preview container
        const previewButtonHtml = `
            <button type="button" id="live-preview-button" class="toolbar-button" title="Preview BBCode" style="margin-bottom: 10px;"><span class="ToolbarPreview"></span> Preview</button>
        `;
        const livePreviewSidebar = document.getElementById('live-preview-sidebar');
        if (livePreviewSidebar) {
            $(livePreviewSidebar).prepend(previewButtonHtml);
            $('#live-preview-button').on('click', function(event) {
                event.preventDefault();
                unsafeWindow.FList.Toolbars_instantPreview('#CharacterEditDescription');
            });
        }

        // Remove the "Description" label and its <br> tag
        const descriptionLabel = document.querySelector('.panel.form-element > span.simple-label');
        if (descriptionLabel && descriptionLabel.textContent.trim() === 'Description') {
            const brElement = descriptionLabel.nextElementSibling;
            if (brElement && brElement.tagName === 'BR') {
                brElement.remove();
            }
            descriptionLabel.remove();
        }

        // Modify the "Update Character" button to call our custom function
        const saveButton = document.getElementById('character-button-save');
        if (saveButton) {
            saveButton.onclick = function(event) {
                event.preventDefault(); // Prevent default link behavior
                unsafeWindow.CharacterSubmit(); // Call our overridden function
            };
        }


        const contentWidthSlider = document.getElementById('content-width-slider');
        const contentWidthLabel = document.getElementById('content-width-label');
        const panelWidthSlider = document.getElementById('panel-width-slider');
        const panelWidthLabel = document.getElementById('panel-width-label');
        const previewContent = document.querySelector('#live-preview-content .character-description');
        const previewSidebar = document.getElementById('live-preview-sidebar');

        if (contentWidthSlider && contentWidthLabel && previewContent) {
            contentWidthSlider.addEventListener('input', (event) => {
                const newWidth = event.target.value;
                const scaleFactor = newWidth / 659; // Calculate scale factor based on default 659px
                previewContent.style.transform = `scale(${scaleFactor})`;
                previewContent.style.transformOrigin = 'top left';
                previewContent.style.maxWidth = `${newWidth}px`;
                contentWidthLabel.textContent = `${newWidth}px`;
            });
        }

        if (panelWidthSlider && panelWidthLabel && previewSidebar) {
            panelWidthSlider.addEventListener('input', (event) => {
                const newWidth = event.target.value;
                previewSidebar.style.width = `${newWidth}px`;
                panelWidthLabel.textContent = `${newWidth}px`;
            });
        }

        // Enable double-click to edit for width labels
        const enableDoubleClickToEdit = (labelElement, sliderElement, applyWidthFunction) => {
            labelElement.addEventListener('dblclick', () => {
                const currentValue = parseInt(labelElement.textContent, 10);
                const input = document.createElement('input');
                input.type = 'number';
                input.value = currentValue;
                input.min = sliderElement.min;
                input.max = sliderElement.max;
                input.style.width = '60px'; // Adjust width as needed
                input.style.backgroundColor = '#2A2525'; // Match header background
                input.style.color = '#ccc'; // Match header text color
                input.style.border = '1px solid #444'; // Match header border
                input.style.padding = '2px';
                input.style.textAlign = 'right';

                labelElement.replaceWith(input);
                input.focus();

                const handleInput = () => {
                    let newValue = parseInt(input.value, 10);
                    if (isNaN(newValue)) {
                        newValue = parseInt(sliderElement.value, 10); // Revert to slider value if invalid
                    }
                    newValue = Math.max(parseInt(sliderElement.min, 10), Math.min(parseInt(sliderElement.max, 10), newValue));

                    sliderElement.value = newValue;
                    labelElement.textContent = `${newValue}px`;
                    applyWidthFunction(newValue); // Apply the width change
                    input.replaceWith(labelElement);
                };

                input.addEventListener('blur', handleInput);
                input.addEventListener('keydown', (event) => {
                    if (event.key === 'Enter') {
                        handleInput();
                    }
                });
            });
        };

        // Apply double-click to edit for content width
        enableDoubleClickToEdit(contentWidthLabel, contentWidthSlider, (width) => {
            const scaleFactor = width / 659;
            previewContent.style.transform = `scale(${scaleFactor})`;
            previewContent.style.transformOrigin = 'top left';
            previewContent.style.maxWidth = `${width}px`;
        });

        // Apply double-click to edit for panel width
        enableDoubleClickToEdit(panelWidthLabel, panelWidthSlider, (width) => {
            previewSidebar.style.width = `${width}px`;
        });


        console.log("F-List Live Preview script is active.");
    }

    waitForElementAndRun();
})();

