// ==UserScript==
// @name        Board Games SE mana symbols
// @author      doppelgreener
// @namespace   https://greasyfork.org/en/users/5615-doppelgreener
// @description Convert mana symbols to MTG's icons on MTG questions.
// @supportURL  http://meta.boardgames.stackexchange.com/questions/1245/
// @grant       none
// @include     http://boardgames.stackexchange.com/questions/*
// @include     https://boardgames.stackexchange.com/questions/*
// @include     http://boardgames.meta.stackexchange.com/questions/*
// @include     https://boardgames.meta.stackexchange.com/questions/*
// @version     1.11.1
// @downloadURL https://update.greasyfork.org/scripts/7390/Board%20Games%20SE%20mana%20symbols.user.js
// @updateURL https://update.greasyfork.org/scripts/7390/Board%20Games%20SE%20mana%20symbols.meta.js
// ==/UserScript==

(function () {

    // For those wondering, this is called a protocol-relative URL.
    var spriteSheetUri = "//i.imgur.com/sQZMBlp.png";
    // This sprite sheet is double size to support screen zooming and high-res screens.
    // Part of this trick requires us overriding the size to half-size it.
    var spriteSheetSizeOverride = "169px";
    var symbolSizePx = 16;
    var symbolSpacingPx = 1;

    var manaSymbols = [
        {letter: '0', x: 0, y: 0, cls: 'n0'},
        {letter: '1', x: 1, y: 0, cls: 'n1'},
        {letter: '2', x: 2, y: 0, cls: 'n2'},
        {letter: '3', x: 3, y: 0, cls: 'n3'},
        {letter: '4', x: 4, y: 0, cls: 'n4'},
        {letter: '5', x: 5, y: 0, cls: 'n5'},
        {letter: '6', x: 6, y: 0, cls: 'n6'},
        {letter: '7', x: 7, y: 0, cls: 'n7'},
        {letter: '8', x: 8, y: 0, cls: 'n8'},
        {letter: '9', x: 9, y: 0, cls: 'n9'},
        {letter: '10', x: 0, y: 1, cls: 'n10'},
        {letter: '11', x: 1, y: 1, cls: 'n11'},
        {letter: '12', x: 2, y: 1, cls: 'n12'},
        {letter: '13', x: 3, y: 1, cls: 'n13'},
        {letter: '14', x: 4, y: 1, cls: 'n14'},
        {letter: '15', x: 5, y: 1, cls: 'n15'},
        {letter: '16', x: 6, y: 1, cls: 'n16'},
        {letter: '17', x: 7, y: 1, cls: 'n17'},
        {letter: '18', x: 8, y: 1, cls: 'n18'},
        {letter: '19', x: 9, y: 1, cls: 'n19'},
        {letter: '20', x: 0, y: 2, cls: 'n20'},
 
        {letter: 'X', x: 1, y: 2, cls: 'X'},
        {letter: 'Y', x: 2, y: 2, cls: 'Y'},
        {letter: 'Z', x: 3, y: 2, cls: 'Z'},
 
        {letter: 'W', x: 4, y: 2, cls: 'W'},
        {letter: 'U', x: 5, y: 2, cls: 'U'},
        {letter: 'B', x: 6, y: 2, cls: 'B'},
        {letter: 'R', x: 7, y: 2, cls: 'R'},
        {letter: 'G', x: 8, y: 2, cls: 'G'},
        {letter: 'S', x: 9, y: 2, cls: 'S'},
 
        // Hybrid mana proper aliases
        {letter: 'W/U', x: 0, y: 3, cls: 'WU'},
        {letter: 'W/B', x: 1, y: 3, cls: 'WB'},
        {letter: 'U/B', x: 2, y: 3, cls: 'UB'},
        {letter: 'U/R', x: 3, y: 3, cls: 'UR'},
        {letter: 'B/R', x: 4, y: 3, cls: 'BR'},
        {letter: 'B/G', x: 5, y: 3, cls: 'BG'},
        {letter: 'R/W', x: 6, y: 3, cls: 'RW'},
        {letter: 'R/G', x: 7, y: 3, cls: 'RG'},
        {letter: 'G/W', x: 8, y: 3, cls: 'GW'},
        {letter: 'G/U', x: 9, y: 3, cls: 'GU'},
 
        // Hybrid mana reverse aliases
        {letter: 'U/W', x: 0, y: 3, cls: 'WU'},
        {letter: 'B/W', x: 1, y: 3, cls: 'WB'},
        {letter: 'B/U', x: 2, y: 3, cls: 'UB'},
        {letter: 'R/U', x: 3, y: 3, cls: 'UR'},
        {letter: 'R/B', x: 4, y: 3, cls: 'BR'},
        {letter: 'G/B', x: 5, y: 3, cls: 'BG'},
        {letter: 'W/R', x: 6, y: 3, cls: 'RW'},
        {letter: 'G/R', x: 7, y: 3, cls: 'RG'},
        {letter: 'W/G', x: 8, y: 3, cls: 'GW'},
        {letter: 'U/G', x: 9, y: 3, cls: 'GU'},
 
        // 2/x hybrid mana
        {letter: '2/W', x: 0, y: 4, cls: 'TW'},
        {letter: '2/U', x: 1, y: 4, cls: 'TU'},
        {letter: '2/B', x: 2, y: 4, cls: 'TB'},
        {letter: '2/R', x: 3, y: 4, cls: 'TR'},
        {letter: '2/G', x: 4, y: 4, cls: 'TG'},
 
        // Phyrexian mana
        {letter: 'WP', x: 5, y: 4, cls: 'WP'},
        {letter: 'UP', x: 6, y: 4, cls: 'UP'},
        {letter: 'BP', x: 7, y: 4, cls: 'BP'},
        {letter: 'RP', x: 8, y: 4, cls: 'RP'},
        {letter: 'GP', x: 9, y: 4, cls: 'GP'},
 
        // Tap and untap
        {letter: 'T', x: 0, y: 5, cls: 'T'},
        {letter: 'Q', x: 1, y: 5, cls: 'Q'},

        // Colorless, Energy, raw Phyrexian symbol
        {letter: 'C', x: 2, y: 5, cls: 'C'},
        {letter: 'E', x: 3, y: 5, cls: 'E'},
        {letter: 'P', x: 4, y: 5, cls: 'P'}
    ];

    // Adds derivative data to each mana symbol entry.
    function primeManaSymbols() {
        for (var key in manaSymbols) {
            if (manaSymbols.hasOwnProperty(key)) {
                var symbol = manaSymbols[key];
                symbol.fullText = '{' + symbol.letter + '}';
            }
        }
    }

    // Creates the page's style sheet.
    function createStyleSheet() {
        var css = ".mana-symbol { display: inline-block; width: 16px; height: 16px; background: url('$SPRITES') no-repeat black; background-size: $SIZE; position: relative; top: 0.2em; box-shadow: 1px 1px 0px 0px #000; border-radius: 8px }"
            .replace('$SIZE', spriteSheetSizeOverride)
            .replace('$SPRITES', spriteSheetUri);
        css += "\n.mana-symbol + .mana-symbol { margin-left: 1px; }";
        css += "\n.mana-symbol.E { border-radius: 0; background-color: transparent; box-shadow: none; }";
        css += "\n.mana-symbol.P { border-radius: 0; background-color: transparent; box-shadow: none; }";
        css += "\n.mana-symbol .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); border: 0; }";

        var template = "\n.mana-symbol.$CLASS { background-position: $Xpx $Ypx }";

        var classesCreated = [];

        for (var key in manaSymbols) {
            if (manaSymbols.hasOwnProperty(key)) {
                var symbol = manaSymbols[key];

                if (classesCreated.indexOf(symbol.cls) >= 0) continue;
                classesCreated.push(symbol.cls);

                var xPos = -1 * (symbolSizePx + symbolSpacingPx) * symbol.x;
                var yPos = -1 * (symbolSizePx + symbolSpacingPx) * symbol.y;

                css += template
                    .replace('$CLASS', symbol.cls)
                    .replace('$X', xPos)
                    .replace('$Y', yPos);
            }
        }

        var styleElem = $('<style>').attr('id', 'mana-symbols-styling').text(css);
        $('head').append(styleElem);
    }

    var converter = (function () {
        // Creates a jQuery element representing a mana symbol.
        function createSymbolElement(symbol) {
            var symbolElement = $('<span>')
                .addClass('mana-symbol')
                .addClass(symbol.cls);

            var textAlternative = $('<span>')
                .addClass('sr-only')
                .text(symbol.fullText);

            symbolElement.append(textAlternative);

            return symbolElement;
        }

        // Adds mana symbols within the given text node.
        function processNode(node, nodeList) {
            // Here's a basic overview of how node processing works:
            // 1. Go through each text node on the document.
            //      jQuery offers us no utilities for doing this,
            //      so we're working directly with the DOM.
            // 2. Find any mention of a symbol, e.g.:
            //      "{T}: Add {G}{G} to your mana pool."
            // 3. Split the thing on the current symbol:
            //      "{T} Add ", "", " to your mana pool."
            // 4. Set the text node we were looking at to the final value in that list.
            // 5. Insert the current symbol before it.
            // 6. Insert the previous text node before that text node.
            // 7. Repeat for other text nodes.
            // 8. Repeat 2-7 for other symbols.
            if (node.nodeValue.indexOf('{') < 0) {
                return;
            }

            for (var key in manaSymbols) {
                var symbol = manaSymbols[key];
                var symbolText = symbol.fullText;
                var parts = node.nodeValue.split(symbolText);

                if (parts.length <= 1) continue;

                // Set the node to the value of the last part. We'll be inserting stuff before it.
                node.nodeValue = parts.pop();

                // Work backwards inserting new nodes, and this symbol between each.
                var lastNode = node;
                var parent = node.parentNode;
                var i = parts.length;
                while (i > 0) {
                    i--;
                    var part = parts[i];
                    var currentNode = document.createTextNode(part);
                    var htmlSymbol = createSymbolElement(symbol)[0];
                    parent.insertBefore(htmlSymbol, lastNode);
                    parent.insertBefore(currentNode, htmlSymbol);
                    nodeList.push(currentNode);
                    lastNode = currentNode;
                }
            }
        }

        return {
            processNode : processNode
        };
    })();

    var htmlParsing = (function () {
        // Returns all text nodes inside the given node (including the node itself).
        function findTextNodes(node) {
            var textNodes = [];

            var isCodeElement = node.nodeName && (node.nodeName.toUpperCase() === "CODE");
            if (isCodeElement) return textNodes;

            var isAlreadyParsed = (node.nodeType === Node.ELEMENT_NODE) && $(node).hasClass('mana-symbol');
            if (isAlreadyParsed) return textNodes;

            if (node.nodeType == Node.TEXT_NODE) {
                textNodes.push(node);
            } else {
                for (var i in node.childNodes) {
                    var child = node.childNodes[i];
                    var contents = findTextNodes(child);
                    textNodes = textNodes.concat(contents);
                }
            }
            return textNodes;
        }

        // Indicates whether a node has any pattern resembling a mana symbol.
        function mayContainManaSymbols(node) {
            var symbolRegex = /\{[0-9A-Z\/]{1,3}\}/;
            return ($(node).text().search(symbolRegex) >= 0);
        }

        // Checks for mana symbols in a DOM node and has them replaced.
        function prettify(node) {
            if (!mayContainManaSymbols(node)) return;
            var nodeList = findTextNodes(node);
            while (nodeList.length > 0) {
                var childNode = nodeList.shift();
                converter.processNode(childNode, nodeList);
            }
        }

        return {
            prettify: prettify
        };
    })();

    function viewingMtgQuestion() {
        var questionTags = $('.post-taglist', '#question');
        return $(".post-tag:contains('magic-the-gathering')", questionTags).length > 0;
    }

    function replaceInPosts() {
        $('.post-text').each(function() {
           htmlParsing.prettify(this);
        });
    }

    // Post preview replacement method thanks to Ilmari Karonen:
    // http://stackapps.com/a/6149/
    function replaceInEditorPreview() {
        function parse(text) {
            var content = $('<div>').html(text);
            htmlParsing.prettify(content[0]);
            return content.html();
        }

        StackExchange.ifUsing('editor', function () {
            StackExchange.MarkdownEditor.creationCallbacks.add(function (editor) {
                editor.getConverter().hooks.chain('postConversion', parse);
            });
        });
    }

    // Post editing replacement method thanks to Ilmari Karonen:
    // http://stackapps.com/a/6149/
    function replaceAfterChangeMade() {
        var urlRegex = /^\/posts\/(ajax-load-realtime|\d+\/edit-submit)\/|^\/review\/(next-task|task-reviewed)\b/;
        $(document).ajaxComplete(function (event, xhr, settings) {
            if (urlRegex.test(settings.url)) replaceInPosts();
        });
    }

    if (typeof StackExchange !== 'undefined') {
        StackExchange.ready(function() {
            if (viewingMtgQuestion()) {
                primeManaSymbols();
                createStyleSheet();

                replaceInPosts();
                replaceInEditorPreview();
                replaceAfterChangeMade();
            }
        });
    }

})();