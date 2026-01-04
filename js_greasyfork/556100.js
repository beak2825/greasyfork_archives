// ==UserScript==
// @name         shur2text - Forocoches Text Helper
// @namespace    https://github.com/MateoPalmeiro/shur2text
// @version      0.4.10
// @description  Popup flotante con editor de texto para Forocoches: Modo Técnico (BBCode) y Modo Visual (WYSIWYG). Movible, minimizable y con posicion recordada.
// @author       MateoPalmeiro
// @match        https://forocoches.com/foro/showthread.php*
// @match        https://forocoches.com/foro/newreply.php*
// @match        https://bbcode.ilma.dev/*
// @run-at       document-end
// @noframes
// @license      AGPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/556100/shur2text%20-%20Forocoches%20Text%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/556100/shur2text%20-%20Forocoches%20Text%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.top !== window.self) return;

    // --- Inyectar Estilos CSS ---
    var style = document.createElement('style');
    style.textContent = `
        /* Estilo base para los botones del modo visual */
        .fc-visual-button {
            border: 1px solid #555;
            background: #444;
            color: #fff;
            transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease;
            height: 26px;
            box-sizing: border-box;
            border-radius: 3px;
            cursor: pointer;
            font-size: 11px;
            padding: 3px;
        }
        /* Efecto al pasar el ratón */
        .fc-visual-button:hover {
            background: #5a5a5a;
            border-color: #777;
        }
        /* Estado ACTIVO */
        #fc-helper-visual-mode .is-active {
            background-color: #0a84ff !important; /* Azul brillante */
            border-color: #0077ff !important;   /* Borde azul */
            color: #fff !important;              /* Icono blanco */
        }
        /* Estilo para el dropdown de tamaño (Visual) */
        .fc-visual-select {
            height: 26px;
            box-sizing: border-box;
            border: 1px solid #555;
            background: #444;
            color: #fff;
            border-radius: 3px;
            font-size: 11px;
            padding: 0 2px;
        }
        /* --- Dropdown para modo técnico --- */
        .fc-tech-select {
            height: auto; /* Dejar que el padding decida */
            padding: 2px 4px;
            border: 1px solid #555;
            background: #444;
            color: #fff;
            border-radius: 3px;
            font-size: 11px;
            cursor: pointer;
        }

        /* --- Selector de Color --- */
        #fc-color-picker {
            display: none;
            position: absolute;
            top: 40px;
            left: 10px;
            right: 10px;
            background: #2a2a2a;
            border: 1px solid #777;
            border-radius: 6px;
            padding: 10px;
            z-index: 100000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        }
        #fc-color-swatches {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 5px;
            margin-bottom: 10px;
        }
        .fc-color-swatch {
            width: 100%;
            height: 28px;
            border: 1px solid #555;
            border-radius: 4px;
            cursor: pointer;
        }
        .fc-color-swatch:hover {
            border-color: #fff;
        }
        #fc-color-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 10px;
        }
        #fc-color-input {
            width: 60px;
            height: 30px;
            padding: 0 2px;
            border: 1px solid #555;
            background: #222;
            cursor: pointer;
        }
        #fc-color-confirm {
            background: #0a84ff;
            border: 1px solid #0077ff;
            color: #fff;
            padding: 4px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
        }
        #fc-color-cancel {
            background: none;
            border: none;
            color: #999;
            cursor: pointer;
            font-size: 11px;
        }
        #fc-color-cancel:hover {
            color: #fff;
        }

        /* --- Toast de Error --- */
        #fc-toast {
            position: fixed;
            bottom: -100px; /* Oculto por defecto */
            left: 50%;
            transform: translateX(-50%);
            background: #D32F2F; /* Rojo de error */
            color: #fff;
            padding: 12px 20px;
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.4);
            z-index: 100001; /* Encima de todo */
            transition: bottom 0.4s ease-in-out;
            font-size: 14px;
            font-weight: 500;
        }
        #fc-toast.show {
            bottom: 20px; /* Visible */
        }
    `;
    document.head.appendChild(style);


    // Claves de localStorage
    var STORAGE_KEY_POS = 'fc_popup_pos_v2';
    var STORAGE_KEY_MIN = 'fc_popup_min_v2';
    var STORAGE_KEY_MODE = 'fc_popup_mode_v2';
    var STORAGE_KEY_PREVIEW = 'fc_popup_preview_v1';

    // Estado global
    var currentMode = 'tech';
    var popup, header, content, techContainer, visualContainer, btnToggleMode;
    var inputArea, outputArea, visualEditor, visualToolbar;
    var btnUseResult, btnUndo;
    var btnTogglePreview, previewPanel, previewContentArea;
    var POPUP_WIDTH = 320;
    var onColorPickedCallback = null;
    var colorPickerDialog, colorPickerInput;
    var mythicalColors = [
        '#FFFFFF', '#C0C0C0', '#808080', '#000000', '#FF0000',
        '#FFFF00', '#00FF00', '#00FFFF', '#0000FF', '#FF00FF'
    ];
    var toastElement, toastTimer = null;

    // ------------------------------------------------------------
    // ICONOS SVG
    // ------------------------------------------------------------
    var ICONS = {
        undo: '<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z"></path></svg>',
        bold: '<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4.25-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9.5h-3.5v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"></path></svg>',
        italic: '<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z"></path></svg>',
        underline: '<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z"></path></svg>',
        strike: '<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M2 12v2h20v-2H2zm7.65-5.41c.64-.18 1.32-.27 2.03-.27 1.69 0 3.15.82 4.07 2.03.62.8 1 1.77 1.15 2.82H9.08c.03-.3.08-.59.16-.86.27-.92.8-1.68 1.5-2.2l.11-.08c.07-.05.15-.1.22-.15.06-.04.13-.07.19-.1L9.65 6.59zm-.15 7.82H17.5c-.13.8-.44 1.51-.88 2.06-.6.74-1.39 1.25-2.3 1.5-.96.26-2.03.3-3.15.08-.9-.18-1.7-.5-2.33-.94-.57-.4-.98-.86-1.23-1.37-.24-.48-.34-.98-.3-1.47.05-.6.2-1.15.43-1.64.04-.08.08-.16.12-.24l1.61 1.22c-.1.31-.15.63-.15.96 0 .42.1.8.28 1.12.2.34.48.6.81.78.37.19.8.3 1.27.3.71 0 1.36-.21 1.91-.62.3-.22.53-.5.69-.84.14-.3.22-.63.22-.98h-4.2v-1.82z"></path></svg>',
        quote: '<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M6 17h3l2-4V7H5v6h3l-2 4zm8 0h3l2-4V7h-6v6h3l-2 4z"></path></svg>',
        link: '<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"></path></svg>',
        color: '<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M17.75 3c-.27 0-.52.11-.7.29L15 5.33l4.37 4.37L21.41 7.66c.39-.39.39-1.02 0-1.41l-2.96-2.96c-.18-.18-.43-.29-.7-.29zM2.92 18.08l6.81-6.81 4.37 4.37-6.81 6.81H2.92v-4.37z"></path></svg>',
        size: '<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M3 12h3v7h3v-7h3V9H3v3zm15-5c0-1.66-1.34-3-3-3s-3 1.34-3 3 1.34 3 3 3 3-1.34 3-3zm-9 0c0-1.66-1.34-3-3-3S3 5.34 3 7s1.34 3 3 3 3-1.34 3-3zm12 5h-3v7h-3v-7h-3V9h9v3z"></path></svg>',
        list_ul: '<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z"></path></svg>',
        list_ol: '<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z"></path></svg>',
        code: '<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M9.4 16.6 4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0 4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"></path></svg>',
        spoiler: '<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5C21.27 7.61 17 4.5 12 4.5zm0 13c-3.04 0-5.5-2.46-5.5-5.5S8.96 6.5 12 6.5 17.5 8.96 17.5 12 15.04 17.5 12 17.5zM3 12c1.46-3.13 4.9-5.5 9-5.5s7.54 2.37 9 5.5c-1.46 3.13-4.9 5.5-9 5.5s-7.54-2.37-9-5.5zm12.5-1.5h-7v3h7v-3z" opacity=".5"></path><path d="M0 0h24v24H0V0zm0 0h24v24H0V0z" fill="none"></path></svg>',
        alignLeft: '<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M3 3v2h18V3H3zm0 8h12v2H3v-2zm0-4h18v2H3V7zm0 8h12v2H3v-2zm0 4h18v2H3v-2z"></path></svg>',
        alignCenter: '<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M3 3v2h18V3H3zm4 8h10v2H7v-2zm0-4h10v2H7V7zm-4 8h18v2H3v-2zm0 4h18v2H3v-2z"></path></svg>',
        alignRight: '<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M3 3v2h18V3H3zm8 8h10v2H11v-2zM3 7h18v2H3V7zm8 8h10v2H11v-2zm-8 4h18v2H3v-2z"></path></svg>',
        upper: '<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M3 20h18v-2H3v2zm1-4h16v-2H4v2zm-1-4h18v-2H3v2zm1-4h16V8H4v2zm-1-4h18V4H3v2z"></path></svg>',
        lower: '<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M3 20h18v-1H3v1zm1-2h16v-1H4v1zm-1-2h18v-1H3v1zm1-2h16v-1H4v1zm-1-2h18v-1H3v1zm1-2h16V9H4v1zm-1-2h18V7H3v1zm1-2h16V5H4v1zm-1-2h18V3H3v1z"></path></svg>',
        alt: '<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M3 20h18v-1H3v1zM4 17h16v-1H4v1zM3 14h18v-1H3v1zM4 11h16V10H4v1zM3 8h18V7H3v1zM4 5h16V4H4v1z"></path></svg>',
    };

    // Funciones de formato
    var fnBold = function(t) { return '[b]' + t + '[/b]'; };
    var fnItalic = function(t) { return '[i]' + t + '[/i]'; };
    var fnUnderline = function(t) { return '[u]' + t + '[/u]'; };
    var fnStrike = function(t) { return '[s]' + t + '[/s]'; };
    var fnQuote = function(t) { return '[quote]' + t + '[/quote]'; };
    var fnCode = function(t) { return '[code]' + t + '[/code]'; };
    var fnSpoiler = function(t) { return '[spoiler]' + t + '[/spoiler]'; };
    var fnLeft = function(t) { return '[left]' + t + '[/left]'; };
    var fnCenter = function(t) { return '[center]' + t + '[/center]'; };
    var fnRight = function(t) { return '[right]' + t + '[/right]'; };
    var fnUpper = function(t) { return t.toUpperCase(); };
    var fnLower = function(t) { return t.toLowerCase(); };
    var fnAlternating = function(t) {
        var res = '', useUpper = true;
        for (var i = 0; i < t.length; i++) {
            var ch = t.charAt(i);
            if (/[a-záéíóúüñ]/i.test(ch)) {
                res += useUpper ? ch.toUpperCase() : ch.toLowerCase();
                useUpper = !useUpper;
            } else { res += ch; }
        }
        return res;
    };
    // fnSize ya no se usa
    function makeList(text, ordered) {
        var lines = text.split(/\r?\n/).map(function(l) { return l.trim(); }).filter(function(l) { return l; });
        if (!lines.length) return '';
        var tag = ordered ? 'list=1' : 'list';
        return '[' + tag + ']\n' + lines.map(function(l) { return '[*]' + l; }).join('\n') + '\n[/' + tag + ']';
    }
    var fnList = function(t) { return makeList(t, false); };
    var fnListNum = function(t) { return makeList(t, true); };
    var fnUrl = function(t) {
        var url = prompt('Introduce la URL (vacio para usar el texto):', 'https://');
        if (url === null) return null;
        var trimmed = url.trim();
        if (trimmed === '') return '[url]' + t + '[/url]';
        return '[url=' + trimmed + ']' + t + '[/url]';
    };
    var fnNoFormat = function(t) { return t; };

    // ------------------------------------------------------------
    // Utilidad: Limpiar copias fantasma del popup en el iframe
    // ------------------------------------------------------------
    function setupIframeCleaner() {
        var iframe = document.getElementById('vB_Editor_QR_iframe');
        if (!iframe) return;
        var removeDup = function() {
            var doc;
            try { doc = iframe.contentDocument || (iframe.contentWindow && iframe.contentWindow.document); } catch (e) { return; }
            if (!doc) return;
            var ghost = doc.getElementById('fc-helper-popup');
            var ghost2 = doc.getElementById('fc-helper-preview');
            if (ghost && ghost.parentNode) { ghost.parentNode.removeChild(ghost); }
            if (ghost2 && ghost2.parentNode) { ghost2.parentNode.removeChild(ghost2); }
        };
        iframe.addEventListener('load', removeDup);
        removeDup();
        var intervalId = setInterval(function() {
            if (!document.body.contains(iframe)) { clearInterval(intervalId); return; }
            removeDup();
        }, 1500);
    }

    // --- Mostrar Toast de Error ---
    function showErrorToast(message) {
        if (!toastElement) return; // Si no se ha creado aún

        // Si ya hay un toast, limpiar su timer para que no se oculte
        if (toastTimer) {
            clearTimeout(toastTimer);
        }

        toastElement.textContent = message;
        toastElement.classList.add('show');

        // Ocultar después de 3 segundos
        toastTimer = setTimeout(function() {
            toastElement.classList.remove('show');
            toastTimer = null;
        }, 3000);
    }

    // ------------------------------------------------------------
    // Utilidad: Insertar texto en el editor de respuesta rapida
    // ------------------------------------------------------------
    function insertIntoEditor(text) {
        var iframe = document.getElementById('vB_Editor_QR_iframe');
        var textarea = document.getElementById('vB_Editor_QR_textarea');
        if (!iframe && !textarea) { showErrorToast('No se ha encontrado el editor de respuesta rápida.'); return; }
        // Modo WYSIWYG (iframe)
        if (iframe && iframe.contentDocument && iframe.contentDocument.body) {
            var body = iframe.contentDocument.body;
            try {
                iframe.contentWindow.focus();
                if (iframe.contentDocument.execCommand) {
                    var toInsert = (body.innerHTML.trim() ? '\n' : '') + text;
                    iframe.contentDocument.execCommand('insertText', false, toInsert);
                } else {
                    var extra = (body.innerHTML.trim() ? '\n' : '') + text;
                    var escaped = extra.split('\n').map(function(line) { return line === '' ? '<br>' : line.replace(/</g, '&lt;'); }).join('<br>');
                    body.innerHTML += escaped;
                }
            } catch (e) {
                console.error('Error insertando en iframe, usando fallback:', e);
                var extra2 = (body.innerHTML.trim() ? '\n' : '') + text;
                var escaped2 = extra2.split('\n').map(function(line) { return line === '' ? '<br>' : line.replace(/</g, '&lt;'); }).join('<br>');
                body.innerHTML += escaped2;
            }
            if (textarea) { textarea.value = (textarea.value || '') + (textarea.value ? '\n' : '') + text; }
            return;
        }
        // Modo solo textarea
        if (textarea) {
            textarea.value = (textarea.value || '') + (textarea.value ? '\n' : '') + text;
            textarea.focus();
            return;
        }
        showErrorToast('No se pudo insertar en el editor.');
    }

    // ------------------------------------------------------------
    // CONVERSORES HTML <-> BBCODE
    // ------------------------------------------------------------
    var conversions = [
        // --- REGLAS DE LISTA ---
        { bb: /\[\*\]\s?(.*?)(?=\n\[\*\]|\n\[\/list|\n\[\/list=1|$)/gi, html: '<li>$1</li>' },
        { bb: /\[list\]([\s\S]*?)\[\/list\]/gi, html: '<ul>$1</ul>' },
        { bb: /\[list=1\]([\s\S]*?)\[\/list=1\]/gi, html: '<ol>$1</ol>' },

        // --- RESTO DE REGLAS ---
        { bb: /\[b\]([\s\S]*?)\[\/b\]/gi, html: '<b>$1</b>' },
        { bb: /\[i\]([\s\S]*?)\[\/i\]/gi, html: '<i>$1</i>' },
        { bb: /\[u\]([\s\S]*?)\[\/u\]/gi, html: '<u>$1</u>' },
        { bb: /\[s\]([\s\S]*?)\[\/s\]/gi, html: '<s>$1</s>' },
        { bb: /\[quote\]([\s\S]*?)\[\/quote\]/gi, html: '<blockquote>$1</blockquote>' },
        { bb: /\[url\]([\s\S]*?)\[\/url\]/gi, html: '<a href="$1">$1</a>' },
        { bb: /\[url=(&quot;?)([\s\S]*?)\1\]([\s\S]*?)\[\/url\]/gi, html: '<a href="$2">$3</a>' },
        { bb: /\[color=(&quot;?)(.*?)\1\]([\s\S]*?)\[\/color\]/gi, html: '<font color="$2">$3</font>' },
        { bb: /\[size=(&quot;?)(.*?)\1\]([\s\S]*?)\[\/size\]/gi, html: '<font size="$2">$3</font>' },
        { bb: /\[left\]([\s\S]*?)\[\/left\]/gi, html: '<div align="left">$1</div>' },
        { bb: /\[center\]([\s\S]*?)\[\/center\]/gi, html: '<div align="center">$1</div>' },
        { bb: /\[right\]([\s\S]*?)\[\/right\]/gi, html: '<div align="right">$1</div>' },
        { bb: /\[code\]([\s\S]*?)\[\/code\]/gi, html: '<pre data-fc-code="true" style="background:#222; color:#eee; padding:4px; border-radius:3px; border:1px solid #444; font-family: monospace;">$1</pre>' },
        { bb: /\[spoiler\]([\s\S]*?)\[\/spoiler\]/gi, html: '<span data-fc-spoiler="true" style="background:#000; color:#000; border:1px solid #555; padding: 1px 3px;">$1</span>' },
        { bb: /\n/g, html: '<br>' }
    ];

    function bbcodeToHtml(bb) {
        if (!bb) return '';
        var html = bb;
        html = html.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        conversions.forEach(function(conv) {
            html = html.replace(conv.bb, conv.html);
        });
        // Limpiezas post-conversión
        html = html.replace(/<\/li><br>/gi, '</li>');
        html = html.replace(/<\/ul><br>/gi, '</ul>');
        html = html.replace(/<\/ol><br>/gi, '</ol>');
        html = html.replace(/<\/blockquote><br>/gi, '</blockquote>');
        html = html.replace(/<\/pre><br>/gi, '</pre>');
        html = html.replace(/<\/div><br>/gi, '</div>');
        return html;
    }

    function htmlToBbcode(html) {
        if (!html) return '';
        var bb = html;
        bb = bb.replace(/<br>\s*(<(div|blockquote|ul|ol|li|pre))/gi, '$1'); // Limpiar <br> antes de bloques
        bb = bb.replace(/(<\/(div|blockquote|ul|ol|li|pre)>)\s*<br>/gi, '$1\n'); // Limpiar <br> despues de bloques
        bb = bb.replace(/<b.*?>([\s\S]*?)<\/b>/gi, '[b]$1[/b]');
        bb = bb.replace(/<i.*?>([\s\S]*?)<\/i>/gi, '[i]$1[/i]');
        bb = bb.replace(/<u.*?>([\s\S]*?)<\/u>/gi, '[u]$1[/u]');
        bb = bb.replace(/<s.*?>([\s\S]*?)<\/s>/gi, '[s]$1[/s]');
        bb = bb.replace(/<blockquote.*?>([\s\S]*?)<\/blockquote>/gi, '[quote]$1[/quote]');
        bb = bb.replace(/<a href="([\s\S]*?)".*?>([\s\S]*?)<\/a>/gi, function(match, href, text) {
            return href === text ? '[url]' + text + '[/url]' : '[url="' + href + '"]' + text + '[/url]';
        });
        bb = bb.replace(/<font color="(.*?)".*?>([\s\S]*?)<\/font>/gi, '[color="$1"]$2[/color]');
        bb = bb.replace(/<font size="(.*?)".*?>([\s\S]*?)<\/font>/gi, '[size="$1"]$2[/size]');
        bb = bb.replace(/<ul.*?>([\s\S]*?)<\/ul>/gi, '[list]$1[/list]');
        bb = bb.replace(/<ol.*?>([\s\S]*?)<\/ol>/gi, '[list=1]$1[/list=1]');
        bb = bb.replace(/<li.*?>([\s\S]*?)<\/li>/gi, '[*]$1\n');
        bb = bb.replace(/<div align="left".*?>([\s\S]*?)<\/div>/gi, '[left]$1[/left]');
        bb = bb.replace(/<div align="center".*?>([\s\S]*?)<\/div>/gi, '[center]$1[/center]');
        bb = bb.replace(/<div align="right".*?>([\s\S]*?)<\/div>/gi, '[right]$1[/right]');
        bb = bb.replace(/<pre data-fc-code="true".*?>([\s\S]*?)<\/pre>/gi, '[code]$1[/code]');
        bb = bb.replace(/<span data-fc-spoiler="true".*?>([\s\S]*?)<\/span>/gi, '[spoiler]$1[/spoiler]');
        bb = bb.replace(/<br\s*\/?>/gi, '\n');
        bb = bb.replace(/<\/?[^>]+(>|$)/g, ""); // Quitar HTML restante
        bb = bb.replace(/\n\n\[\/(list|list=1)\]/gi, '\n[/$1]'); // Limpiar listas
        bb = bb.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&'); // De-escapar
        return bb.trim();
    }

    // ------------------------------------------------------------
    // CONSTRUCCION DE LA UI
    // ------------------------------------------------------------

    // --- Actualizar previsualización ---
    function updatePreview() {
        if (currentMode !== 'tech' || !previewContentArea) return;
        // La previsualización SIEMPRE muestra el resultado final (outputArea),
        // o el input si el output está vacío
        var bbcode = outputArea.value || inputArea.value || '';
        previewContentArea.innerHTML = bbcodeToHtml(bbcode);
    }

    // --- Mostrar selector de color ---
    function showColorPicker(callback) {
        onColorPickedCallback = callback;
        if (colorPickerDialog) {
            colorPickerDialog.style.display = 'block';
        }
    }

    // ------------------- MODO TECNICO (Original) ----------------
    function createTechModeContainer() {
        techContainer = document.createElement('div');
        techContainer.id = 'fc-helper-tech-mode';

        var toolbar = document.createElement('div');
        Object.assign(toolbar.style, { display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '4px' });

        // --- LOGICA DE TRANSFORMACION (CON SELECCION) ---
        function transformAndShow(transformFn) {
            var start = inputArea.selectionStart;
            var end = inputArea.selectionEnd;
            var fullText = inputArea.value;

            // Caso 1: Hay texto seleccionado
            if (start !== end) {
                var selectedText = fullText.substring(start, end);
                var formatted = transformFn(selectedText);
                if (formatted == null) return; // Operacion cancelada (ej. prompt)
                var resultText = fullText.substring(0, start) + formatted + fullText.substring(end);
                inputArea.value = resultText; // Actualizar input
                outputArea.value = resultText; // Actualizar output
                inputArea.focus();
                inputArea.setSelectionRange(start, start + formatted.length);
            }
            // Caso 2: No hay nada seleccionado
            else {
                if (!fullText) { showErrorToast('Escribe algo en "Texto base" primero.'); return; }
                var result = transformFn(fullText);
                if (result == null) return;
                if (outputArea) outputArea.value = result;
            }
            updatePreview(); // <-- Actualizar preview
        }

        function createTechToolButton(label, title, transformFn) {
            var btn = document.createElement('button');
            btn.type = 'button'; btn.textContent = label; btn.title = title;
            Object.assign(btn.style, { padding: '2px 4px', borderRadius: '3px', border: '1px solid #555', background: '#444', color: '#fff', cursor: 'pointer', fontSize: '11px' });
            if (transformFn) { // Solo añadir listener si hay funcion
                btn.addEventListener('click', function() { transformAndShow(transformFn); });
            }
            toolbar.appendChild(btn);
            return btn;
        }

        // --- Dropdown de Tamaño (Modo Técnico) ---
        function createTechSizeDropdown() {
            var select = document.createElement('select');
            select.title = 'Tamaño';
            select.className = 'fc-tech-select';

            var defaultSizes = ['Sz', '1', '2', '3', '4', '5', '6', '7'];
            defaultSizes.forEach(function(size, index) {
                var opt = document.createElement('option');
                opt.value = (index === 0) ? "" : size; // El 'valor' real
                opt.textContent = size;
                if (index === 0) {
                    opt.disabled = true;
                    opt.selected = true;
                }
                select.appendChild(opt);
            });

            select.addEventListener('change', function(e) {
                var size = e.target.value;
                if (!size) return; // No hacer nada si es la opción "Sz"

                // Definir la función de transformación específica para este tamaño
                var sizeTransformFn = function(t) {
                    return '[size=' + size + ']' + t + '[/size]';
                };

                // Usar la lógica existente para aplicar el formato
                transformAndShow(sizeTransformFn);

                // Resetear el dropdown
                e.target.selectedIndex = 0;
            });
            toolbar.appendChild(select);
        }

        // Crear botones tecnicos
        createTechToolButton('B', 'Negrita', fnBold);
        createTechToolButton('I', 'Italica', fnItalic);
        createTechToolButton('U', 'Subrayado', fnUnderline);
        createTechToolButton('S', 'Tachado', fnStrike);

        // --- BOTON DE COLOR (MODO TECNICO) ---
        var btnTechColor = createTechToolButton('Clr', 'Color [color]', null); // Sin funcion
        btnTechColor.addEventListener('click', function() {
            showColorPicker(function(color) {
                transformAndShow(function(t) { return '[color=' + color + ']' + t + '[/color]'; });
            });
        });

        createTechSizeDropdown(); // <-- NUEVO DROPDOWN

        createTechToolButton('Q', 'Cita [quote]', fnQuote);
        createTechToolButton('Code', 'Codigo [code]', fnCode);
        createTechToolButton('Sp', 'Spoiler [spoiler]', fnSpoiler);
        createTechToolButton('L', 'Alinear izquierda', fnLeft);
        createTechToolButton('C', 'Centrar', fnCenter);
        createTechToolButton('R', 'Alinear derecha', fnRight);
        createTechToolButton('•', 'Lista', fnList);
        createTechToolButton('1.', 'Lista numerada', fnListNum);
        createTechToolButton('URL', 'Enlace [url]', fnUrl);
        createTechToolButton('MAY', 'MAYUSCULAS', fnUpper);
        createTechToolButton('min', 'minusculas', fnLower);
        createTechToolButton('aA', 'Alternar mayus/minus', fnAlternating);
        createTechToolButton('Raw', 'Sin formato', fnNoFormat);

        // --- Areas de texto ---
        var labelIn = document.createElement('div');
        labelIn.textContent = 'Texto base (Técnico)';
        Object.assign(labelIn.style, { marginBottom: '2px', fontSize: '11px', opacity: '0.8' });
        inputArea = document.createElement('textarea');
        inputArea.placeholder = 'Escribe aquí tu texto en plano...';
        Object.assign(inputArea.style, { width: '100%', height: '70px', boxSizing: 'border-box', resize: 'vertical', borderRadius: '4px', border: '1px solid #444', background: '#111', color: '#eee', padding: '4px', marginBottom: '4px' });
        var labelOut = document.createElement('div');
        labelOut.textContent = 'Resultado (BBCode)';
        Object.assign(labelOut.style, { marginTop: '4px', marginBottom: '2px', fontSize: '11px', opacity: '0.8' });
        outputArea = document.createElement('textarea');
        outputArea.placeholder = 'Aquí aparecerá el texto formateado...';
        Object.assign(outputArea.style, { width: '100%', height: '80px', boxSizing: 'border-box', resize: 'vertical', borderRadius: '4px', border: '1px solid #444', background: '#111', color: '#eee', padding: '4px', marginBottom: '4px' });
        outputArea.spellcheck = false;

        // --- Actualizar output y preview en vivo ---
        inputArea.addEventListener('input', function() {
            outputArea.value = inputArea.value;
            updatePreview();
        });
        outputArea.addEventListener('input', function() {
            updatePreview(); // Sincronizar si se edita el output manualmente
        });

        // Montar contenedor tecnico
        techContainer.appendChild(toolbar);
        techContainer.appendChild(labelIn);
        techContainer.appendChild(inputArea);
        techContainer.appendChild(labelOut);
        techContainer.appendChild(outputArea);
        return techContainer;
    }

    // ------------------- MODO VISUAL (Nuevo) --------------------

    // --- FUNCION: Actualizar estado de botones ---
    function updateVisualToolbarState() {
        if (currentMode !== 'visual' || !visualToolbar) return;

        var sel = window.getSelection();
        if (!sel || sel.rangeCount === 0 || !visualEditor.contains(sel.anchorNode)) {
             visualToolbar.querySelectorAll('.fc-visual-button, .fc-visual-select').forEach(function(el) {
                el.classList.remove('is-active');
            });
            return;
        }

        var activeAlign = false;
        visualToolbar.querySelectorAll('.fc-visual-button, .fc-visual-select').forEach(function(el) {
            var command = el.dataset.command;
            var value = el.dataset.commandValue;
            var isActive = false;

            try {
                if (el.tagName === 'SELECT') {
                    if (command === 'fontSize') {
                        var currentSize = document.queryCommandValue('fontSize');
                        el.value = currentSize || "3"; // Reflejar tamaño actual o default
                    }
                    // No activar el dropdown
                } else if (command === 'formatBlock') {
                    var currentValue = document.queryCommandValue('formatBlock').toLowerCase();
                    isActive = (currentValue === value);
                } else if (command) {
                    isActive = document.queryCommandState(command);
                }
            } catch (e) { /* queryCommandState puede fallar */ }

            if (el.tagName === 'BUTTON') {
                el.classList.toggle('is-active', isActive);
            }

            if (isActive && (command === 'justifyLeft' || command === 'justifyCenter' || command === 'justifyRight')) {
                activeAlign = true;
            }
        });

        // Forzar 'align-left' si no hay otra alineación activa
        if (!activeAlign) {
            var leftBtn = visualToolbar.querySelector('button[data-command="justifyLeft"]');
            if (leftBtn) {
                leftBtn.classList.add('is-active');
            }
        }
    }

    // --- FUNCION: Aplicar comandos estándar (bold, italic, justify...) ---
    function applyStandardFormat(command, value) {
        visualEditor.focus();
        try { document.execCommand(command, false, value || null); } catch (e) { console.error("Error execCommand:", e); }
        syncVisualToOutput();
        updateVisualToolbarState();
    }

    // --- FUNCION: Aplicar comandos custom (spoiler, mayus, cita...) ---
    function applyCustomFormat(command) {
        visualEditor.focus();
        var sel = getVisualSelection();
        if (!sel) return; // No hay seleccion dentro del editor

        var range = sel.getRangeAt(0);

        // Comandos de reemplazo de texto
        if (command === 'customUpper' || command === 'customLower' || command === 'customAlt') {
            if (!sel.toString()) return; // No hacer nada si no hay texto seleccionado

            var text = range.toString();
            var replacementFn = (command === 'customUpper') ? fnUpper : (command === 'customLower') ? fnLower : fnAlternating;
            var newNode = document.createTextNode(replacementFn(text));

            range.deleteContents();
            range.insertNode(newNode);
        }
        // Comandos de "envoltura" (surround)
        else {
            if (!sel.toString()) return; // No envolver selecciones vacías

            var newNode;
            if (command === 'customSpoiler') {
                newNode = document.createElement('span');
                newNode.setAttribute('data-fc-spoiler', 'true');
                Object.assign(newNode.style, { background: '#000', color: '#000', border: '1px solid #555', padding: '1px 3px' });
            } else if (command === 'customCode') {
                newNode = document.createElement('pre');
                newNode.setAttribute('data-fc-code', 'true');
                Object.assign(newNode.style, { background: '#222', color: '#eee', padding: '4px', borderRadius: '3px', border: '1px solid #444', fontFamily: 'monospace' });
            } else if (command === 'customQuote') {
                newNode = document.createElement('blockquote');
            }

            if (newNode) {
                try {
                    // 'surroundContents' es lo mejor para preservar la alineación del bloque padre
                    newNode.appendChild(range.extractContents());
                    range.insertNode(newNode);
                } catch (e) {
                    console.error('Error surrounding contents:', e);
                    // Fallback (menos fiable para alineación)
                    document.execCommand('insertHTML', false, newNode.outerHTML);
                }
            }
        }

        syncVisualToOutput();
        updateVisualToolbarState();
    }


    function createVisualModeContainer() {
        visualContainer = document.createElement('div');
        visualContainer.id = 'fc-helper-visual-mode';

        visualToolbar = document.createElement('div'); // Asignar a la variable global
        Object.assign(visualToolbar.style, { display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '4px', background: '#2a2a2a', padding: '4px', borderRadius: '4px' });

        function getVisualSelection() {
            var sel = window.getSelection();
            if (sel.rangeCount > 0 && visualEditor.contains(sel.anchorNode)) {
                return sel;
            }
            return null;
        }

        function createVisualToolButton(title, icon, command, commandValue) {
            var btn = document.createElement('button');
            btn.type = 'button'; btn.innerHTML = icon; btn.title = title;
            btn.className = 'fc-visual-button'; // <-- USAR CLASE CSS
            Object.assign(btn.style, { width: '26px' }); // Ancho fijo para botones

            // Guardar el comando para el chequeo de estado
            if (command !== 'customSpoiler' && command !== 'customUpper' && command !== 'customLower' && command !== 'customAlt' &&
                command !== 'customQuote' && command !== 'customCode' &&
                command !== 'createLink' && command !== 'foreColor' && command !== 'fontSize' && command !== 'undo') {
                btn.dataset.command = command;
                if (commandValue) {
                    btn.dataset.commandValue = commandValue;
                }
            }

            btn.addEventListener('click', function(e) {
                e.preventDefault();
                // Separar lógica
                if (command.startsWith('custom')) {
                    applyCustomFormat(command);
                } else if (command === 'createLink') {
                    var url = prompt('Introduce la URL:', 'https://');
                    if (url) applyStandardFormat(command, url);
                } else if (command === 'foreColor') {
                    // --- BOTON DE COLOR (MODO VISUAL) ---
                    showColorPicker(function(color) {
                        applyStandardFormat('foreColor', color);
                    });
                } else {
                    applyStandardFormat(command, commandValue);
                }
            });
            visualToolbar.appendChild(btn);
            return btn;
        }

        // --- Botón de Tamaño (Dropdown) ---
        function createSizeDropdown() {
            var select = document.createElement('select');
            select.title = 'Tamaño';
            select.className = 'fc-visual-select'; // Clase para estilo
            select.dataset.command = 'fontSize'; // Para el actualizador de estado

            var defaultSizes = ['Tamaño', '1', '2', '3', '4', '5', '6', '7'];
            defaultSizes.forEach(function(size, index) {
                var opt = document.createElement('option');
                opt.value = (index === 0) ? "3" : size; // El 'valor' real
                opt.textContent = size;
                if (index === 0) {
                    opt.disabled = true;
                }
                if (size === '3') {
                    opt.selected = true; // Default
                }
                select.appendChild(opt);
            });

            select.addEventListener('change', function(e) {
                if(e.target.value) {
                    applyStandardFormat('fontSize', e.target.value);
                }
            });
            visualToolbar.appendChild(select);
        }

        // Crear botones visuales
        createVisualToolButton('Negrita', ICONS.bold, 'bold');
        createVisualToolButton('Cursiva', ICONS.italic, 'italic');
        createVisualToolButton('Subrayado', ICONS.underline, 'underline');
        createVisualToolButton('Tachado', ICONS.strike, 'strikeThrough');
        createVisualToolButton('Enlace', ICONS.link, 'createLink');
        createVisualToolButton('Color', ICONS.color, 'foreColor');
        createSizeDropdown();
        createVisualToolButton('Lista', ICONS.list_ul, 'insertUnorderedList');
        createVisualToolButton('Lista Num.', ICONS.list_ol, 'insertOrderedList');
        // Alineación
        createVisualToolButton('Alinear Izquierda', ICONS.alignLeft, 'justifyLeft');
        createVisualToolButton('Alinear Centro', ICONS.alignCenter, 'justifyCenter');
        createVisualToolButton('Alinear Derecha', ICONS.alignRight, 'justifyRight');
        // Comandos custom (para preservar alineación)
        createVisualToolButton('Cita', ICONS.quote, 'customQuote');
        createVisualToolButton('Código', ICONS.code, 'customCode');
        createVisualToolButton('Spoiler', ICONS.spoiler, 'customSpoiler');
        createVisualToolButton('MAYÚSCULAS', ICONS.upper, 'customUpper');
        createVisualToolButton('minúsculas', ICONS.lower, 'customLower');
        createVisualToolButton('Alternar', ICONS.alt, 'customAlt');


        // --- Area de edicion visual ---
        var labelVisual = document.createElement('div');
        labelVisual.textContent = 'Texto base (Visual)';
        Object.assign(labelVisual.style, { marginBottom: '2px', fontSize: '11px', opacity: '0.8' });
        visualEditor = document.createElement('div');
        visualEditor.contentEditable = 'true';
        visualEditor.setAttribute('role', 'textbox');
        Object.assign(visualEditor.style, {
            width: '100%',
            minHeight: '120px',
            boxSizing: 'border-box',
            resize: 'vertical',
            overflow: 'auto',
            borderRadius: '4px',
            border: '1px solid #444',
            background: '#111',
            color: '#eee',
            padding: '4px',
            marginBottom: '4px'
        });

        // --- Eventos para actualizar la UI de botones ---
        visualEditor.addEventListener('input', syncVisualToOutput);
        visualEditor.addEventListener('keyup', updateVisualToolbarState);
        visualEditor.addEventListener('mouseup', updateVisualToolbarState);
        visualEditor.addEventListener('focus', updateVisualToolbarState);
        visualEditor.addEventListener('blur', updateVisualToolbarState);
        visualEditor.addEventListener('click', updateVisualToolbarState);

        visualContainer.appendChild(visualToolbar);
        visualContainer.appendChild(labelVisual);
        visualContainer.appendChild(visualEditor);
        return visualContainer;
    }

    // ------------------------------------------------------------
    // Sincronizacion y Acciones Comunes
    // ------------------------------------------------------------
    function syncVisualToOutput() {
        if (outputArea) {
            outputArea.value = htmlToBbcode(visualEditor.innerHTML);
        }
    }

    function getOutputText() {
        if (outputArea && outputArea.value) { return outputArea.value; }
        if (currentMode === 'tech' && inputArea && inputArea.value) { return inputArea.value; }
        if (currentMode === 'visual' && visualEditor && visualEditor.innerHTML) { return htmlToBbcode(visualEditor.innerHTML); }
        return '';
    }

    function copyFromOutput() {
        var text = getOutputText();
        if (!text) { showErrorToast('No hay texto para copiar.'); return; }
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).catch(function(err) {
                console.error('Error al copiar:', err);
                showErrorToast('No se pudo copiar automáticamente.');
            });
        } else {
            try {
                outputArea.value = text;
                outputArea.select();
                document.execCommand('copy');
            } catch(e) {
                showErrorToast('Copia manual requerida (Ctrl+C).');
            }
        }
    }

    function insertFromOutput() {
        var text = getOutputText();
        if (!text) { showErrorToast('No hay texto para insertar.'); return; }
        insertIntoEditor(text);
    }

    // --- Mover la preview junto con el popup ---
    function setPreviewPosition(popupTop, popupLeft) {
        if (previewPanel) {
            previewPanel.style.top = popupTop + 'px';
            previewPanel.style.left = (popupLeft + POPUP_WIDTH + 2) + 'px'; // 2px de espacio
        }
    }

    // --- Construir el dialogo de color ---
    function createColorPicker() {
        colorPickerDialog = document.createElement('div');
        colorPickerDialog.id = 'fc-color-picker';

        // 1. Swatches (colores míticos)
        var swatchesContainer = document.createElement('div');
        swatchesContainer.id = 'fc-color-swatches';
        mythicalColors.forEach(function(color) {
            var swatch = document.createElement('button');
            swatch.className = 'fc-color-swatch';
            swatch.style.backgroundColor = color;
            swatch.dataset.color = color;
            swatch.addEventListener('click', function(e) {
                e.preventDefault();
                colorPickerInput.value = this.dataset.color;
            });
            swatchesContainer.appendChild(swatch);
        });

        // 2. Footer (picker nativo y botones)
        var footer = document.createElement('div');
        footer.id = 'fc-color-footer';

        colorPickerInput = document.createElement('input');
        colorPickerInput.type = 'color';
        colorPickerInput.id = 'fc-color-input';
        colorPickerInput.value = '#FF0000'; // Default

        var btnCancel = document.createElement('button');
        btnCancel.id = 'fc-color-cancel';
        btnCancel.textContent = 'Cancelar';
        btnCancel.addEventListener('click', function(e) {
            e.preventDefault();
            colorPickerDialog.style.display = 'none';
            onColorPickedCallback = null;
        });

        var btnConfirm = document.createElement('button');
        btnConfirm.id = 'fc-color-confirm';
        btnConfirm.textContent = 'Confirmar';
        btnConfirm.addEventListener('click', function(e) {
            e.preventDefault();
            if (onColorPickedCallback) {
                onColorPickedCallback(colorPickerInput.value);
            }
            colorPickerDialog.style.display = 'none';
            onColorPickedCallback = null;
        });

        footer.appendChild(btnCancel);
        footer.appendChild(colorPickerInput);
        footer.appendChild(btnConfirm);

        colorPickerDialog.appendChild(swatchesContainer);
        colorPickerDialog.appendChild(footer);

        return colorPickerDialog;
    }


    // ------------------------------------------------------------
    // Funcion principal: Crear el popup y gestionar modos
    // ------------------------------------------------------------
    function createPopup() {
        if (document.getElementById('fc-helper-popup')) return;

        // Recuperar estado
        var savedPos = null;
        try { savedPos = JSON.parse(localStorage.getItem(STORAGE_KEY_POS) || 'null'); } catch (e) { savedPos = null; }
        var savedMin = localStorage.getItem(STORAGE_KEY_MIN);
        var savedMode = localStorage.getItem(STORAGE_KEY_MODE);
        var savedPreview = localStorage.getItem(STORAGE_KEY_PREVIEW);
        currentMode = (savedMode === 'visual') ? 'visual' : 'tech';

        // Posicion
        var defaultTop = 80, defaultLeft = window.innerWidth - (POPUP_WIDTH + 40);
        var top = defaultTop, left = defaultLeft;
        if (savedPos && typeof savedPos.top === 'number' && typeof savedPos.left === 'number') { top = savedPos.top; left = savedPos.left; }
        var margin = 20, maxLeft = window.innerWidth - 200, maxTop = window.innerHeight - 80;
        if (left < margin) left = margin; if (top < margin) top = margin;
        if (left > maxLeft) left = maxLeft; if (top > maxTop) top = maxTop;

        // Contenedor principal
        popup = document.createElement('div');
        popup.id = 'fc-helper-popup';
        Object.assign(popup.style, {
            position: 'fixed', top: top + 'px', left: left + 'px', width: POPUP_WIDTH + 'px',
            background: 'rgba(20, 20, 20, 0.95)', color: '#fff', border: '1px solid #555',
            borderRadius: '6px', padding: '0', zIndex: '99999',
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            fontSize: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.6)'
        });

        // --- Cabecera ---
        header = document.createElement('div');
        Object.assign(header.style, { padding: '4px 8px', cursor: 'move', background: '#333', borderBottom: '1px solid #555', display: 'flex', alignItems: 'center', justifyContent: 'space-between', userSelect: 'none' });
        var title = document.createElement('span');
        title.textContent = 'shur2text';
        title.style.fontWeight = 'bold';
        var controls = document.createElement('div');

        btnTogglePreview = document.createElement('button');
        btnTogglePreview.title = 'Alternar previsualización';
        Object.assign(btnTogglePreview.style, { background: '#555', border: '1px solid #777', color: '#fff', cursor: 'pointer', fontSize: '11px', padding: '1px 4px', marginLeft: '8px', borderRadius: '3px' });

        btnToggleMode = document.createElement('button');
        btnToggleMode.title = 'Cambiar modo (Técnico / Visual)';
        Object.assign(btnToggleMode.style, { background: '#555', border: '1px solid #777', color: '#fff', cursor: 'pointer', fontSize: '11px', padding: '1px 4px', marginLeft: '8px', borderRadius: '3px' });

        var btnMinimize = document.createElement('button');
        btnMinimize.textContent = '–';
        Object.assign(btnMinimize.style, { background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '14px', padding: '0 4px', marginLeft: '8px' });

        controls.appendChild(btnTogglePreview);
        controls.appendChild(btnToggleMode);
        controls.appendChild(btnMinimize);
        header.appendChild(title);
        header.appendChild(controls);

        // --- Cuerpo ---
        content = document.createElement('div');
        Object.assign(content.style, { padding: '6px', display: (savedMin === 'true') ? 'none' : 'block' });

        // Crear los dos contenedores de modo
        techContainer = createTechModeContainer();
        visualContainer = createVisualModeContainer();
        content.appendChild(visualContainer);
        content.appendChild(techContainer);

        // --- Añadir el selector de color (oculto) ---
        var colorPicker = createColorPicker();
        content.appendChild(colorPicker); // Añadir al content para que se oculte al minimizar

        // --- Botones inferiores (GLOBALES Y DINAMICOS) ---
        var buttonsRow = document.createElement('div');
        Object.assign(buttonsRow.style, { marginTop: '4px', paddingTop: '6px', borderTop: '1px solid #333', display: 'flex', gap: '6px', justifyContent: 'space-between' });
        var btnCopy = document.createElement('button');
        btnCopy.textContent = 'Copiar';
        Object.assign(btnCopy.style, { flex: '1', padding: '4px', borderRadius: '4px', border: '1px solid #444', background: '#444', color: '#fff', cursor: 'pointer' });
        var btnInsert = document.createElement('button');
        btnInsert.textContent = 'Insertar';
        Object.assign(btnInsert.style, { flex: '1', padding: '4px', borderRadius: '4px', border: '1px solid #0077ff', background: '#0a84ff', color: '#fff', cursor: 'pointer' });
        btnUseResult = document.createElement('button');
        btnUseResult.textContent = '↑ Usar';
        btnUseResult.title = 'Pasar salida arriba';
        Object.assign(btnUseResult.style, { flex: '0 0 auto', padding: '4px', borderRadius: '4px', border: '1px solid #666', background: '#222', color: '#fff', cursor: 'pointer', fontSize: '11px', whiteSpace: 'nowrap' });
        btnUndo = document.createElement('button');
        btnUndo.innerHTML = ICONS.undo;
        btnUndo.title = 'Deshacer';
        btnUndo.className = 'fc-visual-button';
        Object.assign(btnUndo.style, { flex: '0 0 auto', padding: '4px', whiteSpace: 'nowrap', width: '26px' });
        btnUndo.dataset.command = "undo";
        buttonsRow.appendChild(btnCopy);
        buttonsRow.appendChild(btnInsert);
        buttonsRow.appendChild(btnUseResult);
        buttonsRow.appendChild(btnUndo);
        content.appendChild(buttonsRow); // Añadir la fila de botones al contenido

        // Acciones de botones
        btnCopy.addEventListener('click', copyFromOutput);
        btnInsert.addEventListener('click', insertFromOutput);
        btnUseResult.addEventListener('click', function() {
            var bbcodeOutput = outputArea.value || '';
            if (currentMode === 'tech') { inputArea.value = bbcodeOutput; updatePreview(); }
        });
        btnUndo.addEventListener('click', function(e) {
            e.preventDefault();
            if (currentMode === 'visual') { applyStandardFormat('undo'); }
        });

        // Montar popup
        popup.appendChild(header);
        popup.appendChild(content);
        document.body.appendChild(popup);

        // --- CREAR PANEL DE PREVISUALIZACIÓN ---
        previewPanel = document.createElement('div');
        previewPanel.id = 'fc-helper-preview';
        Object.assign(previewPanel.style, {
            position: 'fixed', top: top + 'px', left: (left + POPUP_WIDTH + 2) + 'px',
            width: POPUP_WIDTH + 'px',
            background: 'rgba(20, 20, 20, 0.95)', color: '#fff', border: '1px solid #555',
            borderRadius: '6px', zIndex: '99998',
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            fontSize: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.6)',
            display: 'none'
        });
        var previewHeader = document.createElement('div');
        Object.assign(previewHeader.style, { padding: '4px 8px', background: '#333', borderBottom: '1px solid #555', userSelect: 'none', fontWeight: 'bold' });
        previewHeader.textContent = 'Previsualización';
        previewContentArea = document.createElement('div');
        Object.assign(previewContentArea.style, {
            padding: '6px',
            height: '345px', // Altura fija para alinearlo con el editor
            overflowY: 'auto',
            background: '#111',
            borderBottomLeftRadius: '6px',
            borderBottomRightRadius: '6px'
        });
        previewPanel.appendChild(previewHeader);
        previewPanel.appendChild(previewContentArea);
        document.body.appendChild(previewPanel);

        // --- CREAR TOAST de Error (una sola vez) ---
        toastElement = document.createElement('div');
        toastElement.id = 'fc-toast';
        document.body.appendChild(toastElement);


        // --- Gestion de modo (Toggle) ---
        function setMode(mode) {
            currentMode = mode;
            var isTech = (mode === 'tech');

            techContainer.style.display = isTech ? 'block' : 'none';
            visualContainer.style.display = isTech ? 'none' : 'block';
            btnUseResult.style.display = isTech ? 'block' : 'none';
            btnUndo.style.display = isTech ? 'none' : 'block';
            btnTogglePreview.style.display = isTech ? 'inline-block' : 'none'; // Ocultar boton preview

            if (isTech) {
                // De Visual -> Téc
                var bbcode = htmlToBbcode(visualEditor.innerHTML);
                inputArea.value = bbcode;
                outputArea.value = bbcode;
                if (visualToolbar) {
                    visualToolbar.querySelectorAll('.is-active').forEach(function(el) {
                        el.classList.remove('is-active');
                    });
                }
                // Restaurar estado de preview
                setPreviewVisible(localStorage.getItem(STORAGE_KEY_PREVIEW) === 'true');
            } else {
                // De Téc -> Visual
                visualEditor.innerHTML = bbcodeToHtml(outputArea.value || inputArea.value);
                // Ocultar preview en modo visual
                setPreviewVisible(false);
                setTimeout(updateVisualToolbarState, 0);
            }
            btnToggleMode.textContent = isTech ? '[T]' : '[V]';
            localStorage.setItem(STORAGE_KEY_MODE, mode);
        }
        btnToggleMode.addEventListener('click', function(e) {
            e.stopPropagation();
            setMode(currentMode === 'tech' ? 'visual' : 'tech');
        });

        // --- Gestion de Preview (Toggle) ---
        function setPreviewVisible(isVisible) {
            // Solo mostrar si es visible Y estamos en modo tecnico
            var show = isVisible && currentMode === 'tech';

            previewPanel.style.display = show ? 'block' : 'none';
            btnTogglePreview.textContent = show ? '[><]' : '[<>]';
            btnTogglePreview.classList.toggle('is-active', show); // Ponerlo azul

            // Guardar preferencia solo si estamos en modo tecnico
            if (currentMode === 'tech') {
                localStorage.setItem(STORAGE_KEY_PREVIEW, isVisible ? 'true' : 'false');
            }

            if (show) {
                updatePreview();
            }
        }
        btnTogglePreview.addEventListener('click', function(e) {
            e.stopPropagation();
            var isCurrentlyVisible = previewPanel.style.display === 'block';
            setPreviewVisible(!isCurrentlyVisible);
        });

        // Setear modo inicial
        setMode(currentMode);

        // --- Drag & drop ---
        var isDragging = false;
        var offsetX = 0, offsetY = 0;
        header.addEventListener('mousedown', function(e) {
            if (e.target === btnMinimize || e.target === btnToggleMode || e.target === btnTogglePreview) return;
            isDragging = true;
            var rect = popup.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            e.preventDefault();
        });
        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            var newLeft = e.clientX - offsetX;
            var newTop = e.clientY - offsetY;

            popup.style.left = newLeft + 'px';
            popup.style.top = newTop + 'px';

            // Mover la preview junta
            setPreviewPosition(newTop, newLeft);
        });
        document.addEventListener('mouseup', function() {
            if (!isDragging) return;
            isDragging = false;
            var rect = popup.getBoundingClientRect();
            var pos = { left: rect.left, top: rect.top };
            try { localStorage.setItem(STORAGE_KEY_POS, JSON.stringify(pos)); } catch (e) { console.error('No se pudo guardar la posicion:', e); }
        });

        // --- Minimizar ---
        function setMinimized(isMin) {
            var isCurrentlyMinimized = content.style.display === 'none';
            if (isMin === isCurrentlyMinimized) return; // No hacer nada si ya está en ese estado

            content.style.display = isMin ? 'none' : 'block';
            btnMinimize.textContent = isMin ? '+' : '–';

            // Ocultar/mostrar preview al minimizar/maximizar
            if (isMin) {
                previewPanel.style.display = 'none'; // Ocultar siempre al minimizar
            } else {
                // Al restaurar, volvemos al estado guardado (solo si es modo tech)
                var showPreview = localStorage.getItem(STORAGE_KEY_PREVIEW) === 'true';
                setPreviewVisible(showPreview && currentMode === 'tech');
            }

            try { localStorage.setItem(STORAGE_KEY_MIN, isMin ? 'true' : 'false'); } catch (e) { console.error('No se pudo guardar el estado minimizado:', e); }
        }

        btnMinimize.addEventListener('click', function(e) {
            e.stopPropagation();
            var currentlyMinimized = content.style.display === 'none';
            setMinimized(!currentlyMinimized);
        });

        // --- Estado inicial de la preview y minimizado ---
        // (Asegurarse de que la posición inicial es correcta)
        setPreviewPosition(top, left);
        // El estado minimizado se setea ANTES de setear la preview
        setMinimized(savedMin === 'true');



        // Arrancar limpiador
        setupIframeCleaner();
    }

    // ------------------------------------------------------------
    // Lanzar
    // ------------------------------------------------------------
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        createPopup();
    } else {
        document.addEventListener('DOMContentLoaded', createPopup);
    }

})();
