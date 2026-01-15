// ==UserScript==
// @name         Amazon Prime Video - Subtitle Downloader
// @description  Download subtitles from Amazon Prime Video (TTML2 + SRT conversion)
// @author       NunoFilipe93
// @license      MIT
// @version      1.0.0
// @namespace    https://github.com/NunoFilipe93/amazon-subtitle-downloader
// @match        https://*.amazon.com/*
// @match        https://*.amazon.de/*
// @match        https://*.amazon.co.uk/*
// @match        https://*.amazon.co.jp/*
// @match        https://*.primevideo.com/*
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/jszip@3.7.1/dist/jszip.min.js
// @require      https://cdn.jsdelivr.net/npm/file-saver-es@2.0.5/dist/FileSaver.min.js
// @run-at       document-start
// @icon         https://www.primevideo.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/562565/Amazon%20Prime%20Video%20-%20Subtitle%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/562565/Amazon%20Prime%20Video%20-%20Subtitle%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('[Amazon Prime Subtitle Downloader] v1.0.0 by NunoFilipe93');

    let playbackResourcesUrl = null;
    let currentPage = null;

    // ============================================
    // CONFIGURATION
    // ============================================

    let subtitleFormat = localStorage.getItem('APVSD_subtitle_format') || 'both';

    const FORMAT_NAMES = {
        'both': 'TTML2 + SRT',
        'srt': 'SRT only',
        'ttml2': 'TTML2 only'
    };

    const updateFormatText = () => {
        const formatElement = document.querySelector('#prime-subtitle-menu .format-option > span');
        if (formatElement) {
            formatElement.textContent = FORMAT_NAMES[subtitleFormat];
        }
    };

    const toggleSubtitleFormat = () => {
        const formats = ['both', 'srt', 'ttml2'];
        const currentIndex = formats.indexOf(subtitleFormat);
        subtitleFormat = formats[(currentIndex + 1) % formats.length];
        localStorage.setItem('APVSD_subtitle_format', subtitleFormat);
        updateFormatText();
    };

    // ============================================
    // UI MENU
    // ============================================

    const MENU_HTML = `
    <ol>
        <li class="header">Amazon Prime Subtitle Downloader</li>
        <li class="download-action">📥 Download Subtitles (ZIP)</li>
        <li class="format-option">Format: <span></span></li>
    </ol>
    `;

    const MENU_CSS = `
    #prime-subtitle-menu {
        position: fixed;
        display: none;
        width: 350px;
        top: 0;
        left: calc(50% - 175px);
        z-index: 99999999;
    }
    #prime-subtitle-menu ol {
        list-style: none;
        position: relative;
        width: 350px;
        background: linear-gradient(135deg, #232f3e, #131921);
        color: #fff;
        padding: 0;
        margin: 0;
        font-size: 14px;
        border-radius: 0 0 8px 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.5);
    }
    body:hover #prime-subtitle-menu {
        display: block;
    }
    #prime-subtitle-menu li {
        padding: 14px 20px;
        border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    #prime-subtitle-menu li.header {
        font-weight: bold;
        font-size: 15px;
        background: linear-gradient(135deg, #ff9900, #ff6600);
        text-align: center;
    }
    #prime-subtitle-menu li:not(.header):hover {
        background: rgba(255,153,0,0.2);
        cursor: pointer;
    }
    #prime-subtitle-menu li:not(.header) {
        display: none;
    }
    #prime-subtitle-menu:hover li {
        display: block;
    }
    #prime-subtitle-menu li:last-child {
        border-bottom: none;
        border-radius: 0 0 8px 8px;
    }
    `;

    // ============================================
    // TTML TO SRT CONVERSION
    // ============================================

    const parseTTMLLine = (line, parentStyle, styles) => {
        const topStyle = line.getAttribute("style") || parentStyle;
        let prefix = "";
        let suffix = "";
        let italic = line.getAttribute("tts:fontStyle") === "italic";
        let bold = line.getAttribute("tts:fontWeight") === "bold";
        let ruby = line.getAttribute("tts:ruby") === "text";

        if (topStyle !== null) {
            italic = italic || styles[topStyle][0];
            bold = bold || styles[topStyle][1];
            ruby = ruby || styles[topStyle][2];
        }

        if (italic) {
            prefix = "<i>";
            suffix = "</i>";
        }
        if (bold) {
            prefix += "<b>";
            suffix = "</b>" + suffix;
        }
        if (ruby) {
            prefix += "(";
            suffix = ")" + suffix;
        }

        let result = "";

        for (const node of line.childNodes) {
            if (node.nodeType === Node.ELEMENT_NODE) {
                const tagName = node.tagName.split(":").pop().toUpperCase();
                if (tagName === "BR") {
                    result += "\n";
                }
                else if (tagName === "SPAN") {
                    result += parseTTMLLine(node, topStyle, styles);
                }
                else {
                    console.warn("Unknown TTML node:", node);
                    throw new Error("Unknown node type");
                }
            }
            else if (node.nodeType === Node.TEXT_NODE) {
                result += prefix + node.textContent + suffix;
            }
        }

        return result;
    };

    const convertTTMLToSRT = (xmlString, languageCode) => {
        try {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlString, "text/xml");

            // Parse styles
            const styles = {};
            for (const style of xmlDoc.querySelectorAll("head styling style")) {
                const id = style.getAttribute("xml:id");
                if (id === null) throw new Error("Style ID not found");
                const italic = style.getAttribute("tts:fontStyle") === "italic";
                const bold = style.getAttribute("tts:fontWeight") === "bold";
                const ruby = style.getAttribute("tts:ruby") === "text";
                styles[id] = [italic, bold, ruby];
            }

            // Parse regions (for top positioning)
            const regionsTop = {};
            for (const region of xmlDoc.querySelectorAll("head layout region")) {
                const id = region.getAttribute("xml:id");
                if (id === null) throw new Error("Region ID not found");
                const origin = region.getAttribute("tts:origin") || "0% 80%";
                const position = parseInt(origin.match(/\s(\d+)%/)[1]);
                regionsTop[id] = position < 50;
            }

            const topStyle = xmlDoc.querySelector("body").getAttribute("style");
            const lines = [];
            const textarea = document.createElement("textarea");

            let subtitleIndex = 0;
            for (const paragraph of xmlDoc.querySelectorAll("body p")) {
                let parsedLine = parseTTMLLine(paragraph, topStyle, styles);

                if (parsedLine !== "") {
                    // RTL languages support (Arabic)
                    if (languageCode.startsWith("ar")) {
                        parsedLine = parsedLine.replace(/^(?!\u202B|\u200F)/gm, "\u202B");
                    }

                    // Decode HTML entities
                    textarea.innerHTML = parsedLine;
                    parsedLine = textarea.value;

                    // Remove excessive line breaks
                    parsedLine = parsedLine.replace(/\n{2,}/g, "\n");

                    // Top positioning for top subtitles
                    const region = paragraph.getAttribute("region");
                    if (regionsTop[region] === true) {
                        parsedLine = "{\\an8}" + parsedLine;
                    }

                    // Build SRT format
                    subtitleIndex++;
                    lines.push(subtitleIndex);
                    lines.push(
                        (paragraph.getAttribute("begin") + " --> " + paragraph.getAttribute("end"))
                            .replace(/\./g, ",")
                    );
                    lines.push(parsedLine);
                    lines.push("");
                }
            }

            return lines.join("\n");
        }
        catch (error) {
            console.error("TTML to SRT conversion error:", error);
            alert("Failed to parse subtitle file. Check console for details.");
            return null;
        }
    };

    const sanitizeFilename = (name) => {
        return name
            .replace(/[:*?"<>|\\\/]+/g, "_")
            .replace(/ /g, ".")
            .replace(/\.{2,}/g, ".");
    };

    // ============================================
    // PLAYBACK ENVELOPE EXTRACTION
    // ============================================

    function extractPlaybackEnvelope() {
        const scripts = document.querySelectorAll('script[type="text/template"]');

        for (const script of scripts) {
            try {
                const data = JSON.parse(script.innerHTML);
                const props = data.props.body[0].props;

                // Check ATF (Above The Fold) actions
                for (const [id, action] of Object.entries(props.atf.state.action.atf || {})) {
                    if (action.playbackActions?.main?.children) {
                        for (const child of action.playbackActions.main.children) {
                            if (child.playbackEnvelope) {
                                return child.playbackEnvelope;
                            }
                        }
                    }
                }

                // Check BTF (Below The Fold) actions
                for (const [id, action] of Object.entries(props.btf.state.action.btf || {})) {
                    if (action.playbackActions?.main?.children) {
                        for (const child of action.playbackActions.main.children) {
                            if (child.playbackEnvelope) {
                                return child.playbackEnvelope;
                            }
                        }
                    }
                }
            } catch (error) {
                // Continue to next script
                continue;
            }
        }

        return null;
    }

    // ============================================
    // EPISODE TITLE EXTRACTION
    // ============================================

    function getEpisodeTitle() {
        const playerTitle = document.querySelector('.atvwebplayersdk-title-text');
        const playerSubtitle = document.querySelector('.atvwebplayersdk-subtitle-text');

        let filename = 'Amazon_Prime_Video';

        if (playerTitle) {
            filename = playerTitle.textContent.trim();

            if (playerSubtitle) {
                const subtitle = playerSubtitle.textContent.trim();

                // Match pattern: "Season X, Ep. Y Episode Title"
                const match = subtitle.match(/Season\s+(\d+),\s*Ep\.\s*(\d+)\s*(.+)/i) ||
                             subtitle.match(/Temporada\s+(\d+),\s*Ep\.\s*(\d+)\s*(.+)/i);

                if (match) {
                    const season = match[1].padStart(2, '0');
                    const episode = match[2].padStart(2, '0');
                    const episodeTitle = match[3].trim();
                    filename = `${filename}.S${season}E${episode}.${episodeTitle}`;
                }
            }
        }

        return sanitizeFilename(filename);
    }

    // ============================================
    // API REQUESTS
    // ============================================

    async function fetchSubtitlesFromAPI() {
        // Default URL (EU region, Portuguese locale)
        if (!playbackResourcesUrl) {
            playbackResourcesUrl = 'https://atv-ps-eu.primevideo.com/playback/prs/GetVodPlaybackResources?deviceID=browser&deviceTypeID=AOAGZA014O5RE&gascEnabled=true&marketplaceID=A3K6Y4MI8GDYMT&uxLocale=pt_PT&firmware=1';
        }

        const playbackEnvelope = extractPlaybackEnvelope();

        if (!playbackEnvelope) {
            throw new Error('Playback envelope not found.\n\nPlease play the video and wait 2-3 seconds.');
        }

        const response = await fetch(playbackResourcesUrl, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "globalParameters": {
                    "deviceCapabilityFamily": "WebPlayer",
                    "playbackEnvelope": playbackEnvelope
                },
                "timedTextUrlsRequest": {
                    "supportedTimedTextFormats": ["TTMLv2", "DFXP"]
                }
            })
        });

        const data = await response.json();

        if (data.globalError) {
            throw new Error(data.globalError.message || data.globalError.code);
        }

        if (!data.timedTextUrls?.result?.subtitleUrls) {
            throw new Error('No subtitles available for this video');
        }

        return data.timedTextUrls.result.subtitleUrls;
    }

    // ============================================
    // DOWNLOAD HANDLER
    // ============================================

    async function downloadSubtitlesAsZIP() {
        try {
            console.log('[Download] Starting download process...');

            const subtitles = await fetchSubtitlesFromAPI();
            const filename = getEpisodeTitle();

            console.log('[Download] Creating ZIP archive...');
            const zip = new JSZip();
            let fileCount = 0;

            for (const subtitle of subtitles) {
                console.log('[Download] Processing:', subtitle.languageCode);

                const response = await fetch(subtitle.url);
                const content = await response.text();
                const languageCode = subtitle.languageCode.toLowerCase();

                // Add TTML2 format
                if (subtitleFormat === 'ttml2' || subtitleFormat === 'both') {
                    zip.file(`${filename}.${languageCode}.ttml2`, content);
                    fileCount++;
                }

                // Convert and add SRT format
                if (subtitleFormat === 'srt' || subtitleFormat === 'both') {
                    const srtContent = convertTTMLToSRT(content, languageCode);
                    if (srtContent) {
                        zip.file(`${filename}.${languageCode}.srt`, srtContent);
                        fileCount++;
                    }
                }

                // Small delay to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 100));
            }

            console.log('[Download] Generating ZIP file...');
            const zipBlob = await zip.generateAsync({ type: 'blob' });
            const formatSuffix = subtitleFormat === 'both' ? 'TTML2-SRT' : subtitleFormat.toUpperCase();
            saveAs(zipBlob, `${filename}.Subtitles.${formatSuffix}.zip`);

            console.log('[Download] Download completed successfully!');
            alert(`✅ Download complete!\n${fileCount} file(s)\n${subtitles.length} language(s)`);

        } catch (error) {
            console.error('[Download] Error:', error);
            alert(`Error: ${error.message}`);
        }
    }

    // ============================================
    // MENU MANAGEMENT
    // ============================================

    function createMenu() {
        if (document.querySelector('#prime-subtitle-menu')) return;

        const menu = document.createElement('div');
        menu.id = 'prime-subtitle-menu';
        menu.innerHTML = MENU_HTML;
        document.body.appendChild(menu);

        menu.querySelector('.download-action').addEventListener('click', downloadSubtitlesAsZIP);
        menu.querySelector('.format-option').addEventListener('click', toggleSubtitleFormat);

        updateFormatText();

        console.log('[Menu] Menu created successfully');
    }

    function showMenu() {
        const menu = document.querySelector('#prime-subtitle-menu');
        if (menu) {
            menu.style.display = '';
        }
    }

    function hideMenu() {
        const menu = document.querySelector('#prime-subtitle-menu');
        if (menu) {
            menu.style.display = 'none';
        }
    }

    // ============================================
    // PAGE DETECTION
    // ============================================

    function checkCurrentPage() {
        const path = window.location.pathname;
        const isVideoPage = path.includes('/watch') || path.includes('/detail');

        if (isVideoPage !== currentPage) {
            currentPage = isVideoPage;
            if (isVideoPage) {
                showMenu();
            } else {
                hideMenu();
            }
        }
    }

    // ============================================
    // URL INTERCEPTOR
    // ============================================

    const urlInterceptorInjection = () => {
        ((originalOpen, originalFetch) => {
            // Intercept XMLHttpRequest
            XMLHttpRequest.prototype.open = function() {
                if (arguments[1] && arguments[1].includes("/GetVodPlaybackResources?")) {
                    window.dispatchEvent(new CustomEvent("apvsd_url_captured", {
                        detail: { url: arguments[1] }
                    }));
                }
                originalOpen.apply(this, arguments);
            };

            // Intercept fetch API
            window.fetch = async (...args) => {
                const response = originalFetch(...args);
                if (args[0] && args[0].includes("/GetVodPlaybackResources?")) {
                    window.dispatchEvent(new CustomEvent("apvsd_url_captured", {
                        detail: { url: args[0] }
                    }));
                }
                return response;
            };
        })(XMLHttpRequest.prototype.open, window.fetch);
    };

    window.addEventListener("apvsd_url_captured", (event) => {
        playbackResourcesUrl = event.detail.url.split('&titleId=')[0];
        console.log('[URL] Playback URL captured successfully');
    }, false);

    // Inject interceptor into page context
    const scriptElement = document.createElement("script");
    scriptElement.textContent = "(" + urlInterceptorInjection.toString() + ")()";
    document.head.appendChild(scriptElement);
    document.head.removeChild(scriptElement);

    // Inject CSS styles
    const styleElement = document.createElement('style');
    styleElement.textContent = MENU_CSS;
    document.head.appendChild(styleElement);

    // ============================================
    // INITIALIZATION
    // ============================================

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createMenu);
    } else {
        createMenu();
    }

    // Monitor page changes
    window.addEventListener('popstate', checkCurrentPage);
    setInterval(checkCurrentPage, 1000);

    checkCurrentPage();

    console.log('[Init] Amazon Prime Subtitle Downloader initialized successfully');
    console.log('[Init] Hover over the top of the page to access the menu');

})();