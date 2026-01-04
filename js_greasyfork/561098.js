// ==UserScript==
// @name         MathOverflow/MSE Citation Helper
// @version      2.2.2
// @description  Improved citation finder for MathOverflow.
// @author       Asaf Karagila, aspen138
// @match        https://mathoverflow.net/*
// @match        https://math.stackexchange.com/*
// @grant        none
// @inject-into  page
// @icon         data:image/png;base64,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
// @namespace https://greasyfork.org/users/1177387
// @downloadURL https://update.greasyfork.org/scripts/561098/MathOverflowMSE%20Citation%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/561098/MathOverflowMSE%20Citation%20Helper.meta.js
// ==/UserScript==

const $ = window.jQuery;
const StackExchange = window.StackExchange;
const MathJax = window.MathJax;
const CH = StackExchange.citationHelper;

(function() {
    'use strict';

    StackExchange.citationHelper = (function () {

        var currentResult = false;

        return { init: init }; // Hoisting!

        function thingFinder(markdown, textareaContent, sentinel, thingName, things) {
            return markdown;
        }

        function init() {
            if (StackExchange.externalEditor) {
                StackExchange.externalEditor.init({
                    thingName: 'cite',
                    thingFinder: thingFinder,
                    buttonTooltip: 'Insert Citation 2.0',
                    buttonImageUrl: '/content/Sites/mathoverflow/img/cite-icon.svg',
                    onShow: function (editorClosed) {
                        $('#search-text').on('blur', runSearch).on('keypress', runSearchKey).focus();
                        $('#backlink').on('click', goBack);
                        currentResult = false;
                        $('#popup-cite .popup-submit').on('click', function () { if (currentResult) { listenMessage(currentResult); } });
                        window.addCitationHelper = editorClosed;

                        if (window.addEventListener) {
                            window.addEventListener('message', listenMessage, false);
                        } else {
                            window.attachEvent('onmessage', listenMessage);
                        }
                    },
                    onRemove: function () {
                        window.addCitationHelper = null;
                        try {
                            delete window.addCitationHelper;
                        } catch (e) { } // IE doesn't allow deleting from window
                    },
                    getDivContent: function (oldContent) {
                        return searchDialog();
                    }
                });
            }
        }

        // Prepare the search dialog
        function searchDialog() {

            if ($('.popup-cite').length > 0) { return; } // Abort if dialog already exists

            // Updated HTML with BibTeX container
            var popupHTML = '<div id="popup-cite" class="popup"><div class="popup-close"><a title="close this popup (or hit Esc)" href="javascript:void(0)">&times;</a></div><h2 class="popup-title-container handle"> <span class="popup-breadcrumbs"></span><span class="popup-title">Insert citation 2.0</span></h2><div id="pane-main" class="popup-pane popup-active-pane close-as-duplicate-pane" data-title="Insert Citation 2.0" data-breadcrumb="Cite"><input id="search-text" class="js-duplicate-search-field" type="text" style="width: 740px; z-index: 1; position: relative;"><div class="search-errors search-spinner"></div> <div class="original-display"> <div id="previewbox" style="display:none"><div><a href="javascript:void(0)" id=backlink>&lt; Back to results</a></div><div class="preview" ></div><div class="bibtex-container" style="margin-top:15px;"><h3 style="margin-bottom:8px;">BibTeX:</h3><textarea id="bibtex-output" readonly style="width:100%;min-height:120px;font-family:Consolas,Monaco,monospace;font-size:11px;padding:10px;border:1px solid #ccc;background-color:#f9f9f9;resize:vertical;"></textarea><button id="copy-bibtex" style="margin-top:8px;padding:6px 12px;cursor:pointer;background:#0095ff;color:white;border:none;border-radius:3px;">Copy BibTeX</button></div></div> <div class="list-container"> <div class="list-originals" id="results"> </div> </div> </div></div><div class="popup-actions"><input type="submit" id="cite-submit" class="popup-submit disabled-button" value="Insert Citation" disabled="disabled" style="cursor: default;"></div></div>';

            return popupHTML;
        }

        // The event handler for the message
        function listenMessage(msg) {
            window.addCitationHelper(getCitationHtml(msg), '\n\n' + getCitationHtml(msg));
            StackExchange.MarkdownEditor.refreshAllPreviews();
            StackExchange.helpers.closePopups();
        }

        function runSearchKey(e) {
            var key = (e.keyCode ? e.keyCode : e.which);
            if (key == 13) {
                runSearch();
            }
        }

        // Run a search
        function runSearch() {
            goBack();
            $('#popup-cite .search-spinner').removeSpinner().addSpinner();
            $.getJSON('https://zbmath.org/citationmatching/mathoverflow/v2', { 'q': $('#search-text').val() }, fetchCallback);
        }

        // Callback to run when search completes
        function fetchCallback(response) {
            var html = $('<div class="list">');
            response.results.forEach(res => {
                var zbl = res.zbl_link;

                var doi = res.external_ids.doi && res.external_ids.doi[0] ? "https://doi.org/"+res.external_ids.doi[0] : "";
                var arxiv = res.external_ids.arxiv && res.external_ids.arxiv[0] ? "https://arxiv.org/abs/"+res.external_ids.arxiv[0] : "";
                var authors = sanitizeForDisplay(res.authors.reduce((acc,val,i,arr) => acc + fixName(val) + (i+1 == arr.length ? "" : i+2 == arr.length ? " and " : ", "),""));
                var title = sanitizeForDisplay(res.title).replaceAll(/\\[\(\)\[\]]/gm,"$");
                var serial = res.serial ? res.serial : null;
                var source = serial ? sanitizeForDisplay("<i>"+(serial.short_title ? serial.short_title : serial.title)+"</i> <b>"+serial.volume+"</b>" + (serial.issue ? " ("+serial.issue+")" : "") + ", " +res.pagination + " (" + res.year+")") : res.source;
                var citationHtml = sanitizeForDisplay(source);

                var outputJSON = {
                    authors: authors,
                    title: title,
                    source: source,
                    zbl: zbl,
                    doi: doi,
                    arxiv: arxiv,
                    zbl_id: res.zbl_id,
                    // Store original data for BibTeX generation
                    originalData: res
                };

                var renderResult = $('<div class="item" style="float:none;padding:5px">')
                .html($('<div class="summary post-link" style="float:none;width:auto;font-weight:bold;">')
                      .text(title))
                .append('<br/>')
                .append($('<span class="body-summary" style="float:none"></span>')
                        .append(authors + '<br/>' + citationHtml + '<br/> Preview (opens in new tab): ')
                        .append(renderOptionalLink(doi, 'article'))
                        .append(renderOptionalLink(zbl, 'zbmath'))
                        .append(renderOptionalLink(arxiv, 'arxiv'))
                       )
                .click(loadResultCallback(doi, outputJSON))
                .hover(function () { $(this).css('background-color', '#e6e6e6') }, function () { $(this).css('background-color', '#fff') });

                html.append(renderResult);
                renderResult.find('a').on('click', function (e) { e.stopPropagation(); });
            })

            $('#results').html('').append(html);
            MathJax.Hub.Queue(['Typeset', MathJax.Hub, 'results']);
            $('#popup-cite .search-spinner').removeSpinner();
        }

        function fixName(name) {
            return name.split(",").reverse().reduce((a,v,i) => a+(i > 0 ? " " : "")+v.trim(),"")
        }

        function sanitizeForDisplay(html) {
            return StackExchange.MarkdownEditor.sanitizeHtml(html);
        }

        function renderOptionalLink(href, text) {
            if (href) {
                return $(sanitizeForDisplay($('<a>').attr('href', href).text(text + ' ').prop('outerHTML'))).attr('target', '_blank');
            } else {
                return '';
            }
        }

        function loadResultCallback(href, result) {
            return function (e) { e.preventDefault(); e.stopPropagation(); loadResult(e, href, result); return false; }
        }

        function loadResult(e, href, result) {
            $('#popup-cite .popup-submit').enable();
            currentResult = result;
            $('.list-container').hide();
            $('#popup-cite #previewbox').show();
            $('#popup-cite .preview').html($(e.target).closest('.item').html());

            // Generate and display BibTeX
            generateBibtex(result);
        }

        function generateBibtex(result) {
            var bibtex = '';
            var data = result.originalData;

            // Generate citation key from first author and year
            var firstAuthor = data.authors && data.authors[0] ? data.authors[0].split(',')[0].trim() : 'Unknown';
            var year = data.year || 'n.d.';
            var citeKey = firstAuthor.replace(/[^a-zA-Z]/g, '') + year;

            // Determine entry type
            var entryType = '@article';
            if (data.document_type) {
                if (data.document_type.toLowerCase().includes('book')) {
                    entryType = '@book';
                } else if (data.document_type.toLowerCase().includes('proceeding')) {
                    entryType = '@inproceedings';
                }
            }

            bibtex += entryType + '{' + citeKey + ',\n';

            // Author
            if (data.authors && data.authors.length > 0) {
                var authorList = data.authors.map(function(a) {
                    return a; // Authors are already in "Last, First" format
                }).join(' and ');
                bibtex += '  author = {' + authorList + '},\n';
            }

            // Title
            if (data.title) {
                bibtex += '  title = {' + data.title.replace(/\$/g, '$') + '},\n';
            }

            // Journal/Serial info
            if (data.serial) {
                if (data.serial.title) {
                    bibtex += '  journal = {' + data.serial.title + '},\n';
                }
                if (data.serial.volume) {
                    bibtex += '  volume = {' + data.serial.volume + '},\n';
                }
                if (data.serial.issue) {
                    bibtex += '  number = {' + data.serial.issue + '},\n';
                }
            }

            // Pages
            if (data.pagination) {
                bibtex += '  pages = {' + data.pagination + '},\n';
            }

            // Year
            if (data.year) {
                bibtex += '  year = {' + data.year + '},\n';
            }

            // DOI
            if (result.doi) {
                var doiStr = result.doi.replace('https://doi.org/', '');
                bibtex += '  doi = {' + doiStr + '},\n';
            }

            // arXiv
            if (result.arxiv) {
                var arxivId = result.arxiv.replace('https://arxiv.org/abs/', '');
                bibtex += '  eprint = {' + arxivId + '},\n';
                bibtex += '  archivePrefix = {arXiv},\n';
            }

            // Zbl number
            bibtex += '  zbl = {' + result.zbl_id + '},\n';
            bibtex += '  url = {' + result.zbl + '}\n';
            bibtex += '}';

            $('#bibtex-output').val(bibtex);

            // Setup copy button
            $('#copy-bibtex').off('click').on('click', function() {
                var $textarea = $('#bibtex-output');
                $textarea[0].select();
                $textarea[0].setSelectionRange(0, 99999); // For mobile

                try {
                    document.execCommand('copy');
                    var $btn = $(this);
                    var originalText = $btn.text();
                    $btn.text('Copied!').css('background', '#5eba7d');
                    setTimeout(function() {
                        $btn.text(originalText).css('background', '#0095ff');
                    }, 2000);
                } catch (err) {
                    alert('Failed to copy. Please select and copy manually.');
                }
            });
        }

        function goBack() {
            $('#popup-cite .search-spinner').removeSpinner();
            $('.list-container').show();
            $('#popup-cite #previewbox').hide();
            $('#popup-cite .popup-submit').disable();
        }

        function getCitationHtml(json) {
            var link = json.doi ? json.doi : json.arxiv ? json.arxiv : json.zbl;
            var cite = $('<cite>').attr('authors', json.authors)
            .append('_' + json.authors + '_, ')
            .append('[**' + json.title + '**](' + encodeURI(link) + ')' + (".,;".includes(json.title.slice(-1)) ? " " : ". "))
            .append(json.source + ' ([ZBL' + json.zbl_id + ']('+encodeURI(json.zbl) + ')' + (json.arxiv ? ', [arXiv:'+json.arxiv.substring(22)+']('+encodeURI(json.arxiv)+')' : '')+')')
            .append('.');

            var citeContainer = $('<span></span>').append(cite).html();

            return citeContainer;
        }
    })(); //end function call

    StackExchange.using('editor', function (){
        StackExchange.using('externalEditor', function (){
            if (CH == undefined) StackExchange.citationHelper.init();
            console.log("Citation Helper v2 is loaded!");
        });
    });})();