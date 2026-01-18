// ==UserScript==
// @name         YouTube Transcript/Caption/Subtitle Processor/Downloader powered by Gemini
// @namespace    https://greasyfork.org/en/users/1462137-piknockyou
// @version      4.3
// @author       Piknockyou (vibe-coded)
// @license      AGPL-3.0
// @description  Professional transcript processor with Gemini AI. Drag, resize, download transcripts (TXT/SRT/JSON), and process with AI. Get your free API key at https://aistudio.google.com/app/apikey
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      generativelanguage.googleapis.com
// @require      https://cdn.jsdelivr.net/npm/marked@17.0.1/lib/marked.umd.js
// @downloadURL https://update.greasyfork.org/scripts/563101/YouTube%20TranscriptCaptionSubtitle%20ProcessorDownloader%20powered%20by%20Gemini.user.js
// @updateURL https://update.greasyfork.org/scripts/563101/YouTube%20TranscriptCaptionSubtitle%20ProcessorDownloader%20powered%20by%20Gemini.meta.js
// ==/UserScript==

// INSPIRED by: greasyfork.org/en/scripts/538278-youtube-gemini-summarizer
// FROM: https: greasyfork.org/en/users/1478715-kobaltgit

(function () {
    'use strict';

    console.log('[YT-TP] Initializing YouTube Transcript Processor');

    // Create Trusted Types policy for YouTube's CSP
    let trustedTypesPolicy;
    if (window.trustedTypes && window.trustedTypes.createPolicy) {
        try {
            trustedTypesPolicy = window.trustedTypes.createPolicy('yttp-policy', {
                createHTML: (string) => string
            });
            console.log('[YT-TP] Trusted Types policy created');
        } catch (e) {
            console.warn('[YT-TP] Could not create Trusted Types policy:', e);
        }
    }

    // ============================================================
    // SECTION 1: CONFIGURATION
    // ============================================================
    const CONFIG = {
        PREFIX: 'yttp3_',
        GEMINI_API_BASE: 'https://generativelanguage.googleapis.com/v1beta/models',
        PANEL: {
            MIN_WIDTH: 380,
            MIN_HEIGHT: 350,
            DEFAULT_WIDTH: 480,
            DEFAULT_HEIGHT: 620,
            DEFAULT_TOP: 80,
            DEFAULT_LEFT: 60
        },
        BUTTON: {
            scale: 0.75,           // Range: 0.5 to 2.0
            opacity: 0.10,         // Range: 0.0 to 1.0 (opacity when not hovered)
            defaultBottom: 20,    // Default bottom position in pixels
            defaultLeft: 20       // Default left position in pixels
        },
        Z_INDEX: 2147483647
    };

    // Language selection is now done via YouTube's native transcript panel

    const PROVIDERS = [
        { id: 'gemini', name: 'Google Gemini' }
        // Future: OpenAI, Anthropic, etc.
    ];

    // ============================================================
    // SECTION 1.5: PAGE DETECTION
    // ============================================================
    const PageUtils = {
        /**
         * Check if current URL is a watch page (video or live)
         */
        isWatchPage() {
            const path = window.location.pathname;
            return path.startsWith('/watch') || path.startsWith('/live');
        },

        /**
         * Get current URL for comparison
         */
        getCurrentUrl() {
            return window.location.href;
        }
    };

    // Language selection is now done via YouTube's native transcript panel
    // ============================================================
    // SECTION 2: STATE MANAGEMENT
    // ============================================================
    const Storage = {
        get(key, defaultValue) {
            return GM_getValue(CONFIG.PREFIX + key, defaultValue);
        },
        set(key, value) {
            GM_setValue(CONFIG.PREFIX + key, value);
        }
    };

    const State = {
        // Persistent state (saved to storage)
        apiKeys: Storage.get('api_keys', {}),
        selectedProvider: Storage.get('provider', 'gemini'),
        selectedModel: Storage.get('model', ''),
        prompt: Storage.get('prompt', ''),
        panelVisible: Storage.get('panel_visible', false),
        darkMode: Storage.get('dark_mode', false),
        panelPosition: Storage.get('panel_position', {
            top: CONFIG.PANEL.DEFAULT_TOP,
            left: CONFIG.PANEL.DEFAULT_LEFT
        }),
        panelSize: Storage.get('panel_size', {
            width: CONFIG.PANEL.DEFAULT_WIDTH,
            height: null // Height is always reset on session start/reload
        }),
        buttonPosition: Storage.get('button_position', {
            bottom: CONFIG.BUTTON.defaultBottom,
            left: CONFIG.BUTTON.defaultLeft
        }),

        // Runtime state (not persisted)
        models: [],
        lastOutput: '',
        lastTranscript: null,

        // Methods
        save() {
            Storage.set('api_keys', this.apiKeys);
            Storage.set('provider', this.selectedProvider);
            Storage.set('model', this.selectedModel);
            Storage.set('prompt', this.prompt);
            Storage.set('panel_visible', this.panelVisible);
            Storage.set('dark_mode', this.darkMode);
            Storage.set('panel_position', this.panelPosition);
            Storage.set('panel_size', this.panelSize);
            Storage.set('button_position', this.buttonPosition);
        },

        getApiKey() {
            return this.apiKeys[this.selectedProvider] || '';
        },

        setApiKey(key) {
            this.apiKeys[this.selectedProvider] = key;
            this.save();
        }
    };

    // ============================================================
    // SECTION 3: TRANSCRIPT SERVICE
    // ============================================================

    /**
     * Unified Transcript Service
     * IMPORTANT: Always opens the transcript panel first, because:
     * - YouTube only loads transcript data when the panel is opened
     * - The API response is triggered by opening the panel
     * - This ensures we can extract data via API or DOM
     */
    const TranscriptService = {
        // Language name to code mapping
        LANG_MAP: {
            'english': 'en', 'german': 'de', 'french': 'fr', 'spanish': 'es',
            'portuguese': 'pt', 'italian': 'it', 'dutch': 'nl', 'russian': 'ru',
            'japanese': 'ja', 'korean': 'ko', 'chinese': 'zh', 'arabic': 'ar',
            'hindi': 'hi', 'hebrew': 'he', 'turkish': 'tr', 'polish': 'pl',
            'vietnamese': 'vi', 'thai': 'th', 'indonesian': 'id', 'czech': 'cs',
            'romanian': 'ro', 'hungarian': 'hu', 'greek': 'el', 'swedish': 'sv'
        },

        /**
         * Get YouTube client config
         */
        getClientConfig() {
            if (typeof window.ytcfg !== 'undefined' && window.ytcfg.get) {
                return {
                    clientName: window.ytcfg.get('INNERTUBE_CLIENT_NAME') || 'WEB',
                    clientVersion: window.ytcfg.get('INNERTUBE_CLIENT_VERSION') || '2.20240101.00.00'
                };
            }
            return { clientName: 'WEB', clientVersion: '2.20240101.00.00' };
        },

        /**
         * Map language name to code
         */
        getLanguageCode(langName) {
            if (!langName) return 'unknown';
            const lower = langName.toLowerCase();
            for (const [name, code] of Object.entries(this.LANG_MAP)) {
                if (lower.includes(name)) return code;
            }
            return 'unknown';
        },

        // ========== PANEL OPERATIONS ==========

        /**
         * Open the transcript panel (REQUIRED before any extraction)
         */
        async openPanel() {
            console.log('[YT-TP] Opening transcript panel...');

            // Check if already open with content
            let panel = document.querySelector(
                "ytd-engagement-panel-section-list-renderer[target-id='engagement-panel-searchable-transcript']"
            );

            if (panel) {
                const hasSegments = panel.querySelector('ytd-transcript-segment-renderer');
                if (hasSegments) {
                    console.log('[YT-TP] Panel already open with segments');
                    return panel;
                }
            }

            // Step 1: Click "More actions" menu button
            const menuButton = document.querySelector(
                'ytd-menu-renderer yt-button-shape button[aria-label="More actions"], ' +
                'button#button.style-scope.ytd-menu-renderer[aria-label="More actions"], ' +
                'ytd-video-primary-info-renderer button[aria-label="More actions"], ' +
                'button[aria-label*="More actions" i][aria-haspopup="true"]'
            );

            if (menuButton) {
                console.log('[YT-TP] Clicking menu button...');
                menuButton.click();
                await this.wait(700);
            } else {
                console.warn('[YT-TP] Menu button not found');
            }

            // Step 2: Find and click "Show transcript" option
            const transcriptLabels = [
                'show transcript', 'open transcript', 'transcript',
                'transkript anzeigen', 'transkript öffnen',
                'mostrar transcripción', 'abrir transcripción',
                'afficher la transcription',
                'показать расшифровку видео', 'расшифровка'
            ];

            const menuItems = document.querySelectorAll(
                'ytd-menu-service-item-renderer, ' +
                'tp-yt-paper-item, ' +
                'yt-formatted-string.style-scope.ytd-menu-service-item-renderer'
            );

            let clicked = false;
            for (const item of menuItems) {
                const text = item.textContent?.trim().toLowerCase();
                if (transcriptLabels.some(label => text === label || text?.includes(label))) {
                    console.log('[YT-TP] Clicking transcript option:', text);
                    item.click();
                    clicked = true;
                    break;
                }
            }

            // Step 3: Try alternative - description button
            if (!clicked) {
                const descButton = document.querySelector(
                    'button[aria-label*="transcript" i], ' +
                    '#description-inline-expander [aria-label*="transcript" i]'
                );
                if (descButton) {
                    console.log('[YT-TP] Clicking description transcript button');
                    descButton.click();
                    clicked = true;
                }
            }

            if (!clicked) {
                // Close menu if we opened it but couldn't find transcript
                document.body.click();
                throw new Error('Could not find transcript button');
            }

            // Step 4: Wait for panel to load
            console.log('[YT-TP] Waiting for panel to load...');
            await this.wait(2000);

            // Step 5: Verify panel loaded
            panel = document.querySelector(
                "ytd-engagement-panel-section-list-renderer[target-id='engagement-panel-searchable-transcript']"
            );

            if (!panel) {
                throw new Error('Transcript panel did not open');
            }

            // Wait a bit more for segments to render
            await this.wait(500);

            console.log('[YT-TP] Panel opened successfully');
            return panel;
        },

        /**
         * Detect selected language from panel UI
         */
        detectLanguageFromPanel(panel) {
            try {
                // Method 1: Language dropdown label
                const labelText = panel.querySelector('#label-text.yt-dropdown-menu');
                if (labelText) {
                    const name = labelText.textContent?.trim();
                    if (name) {
                        return {
                            languageName: name,
                            languageCode: this.getLanguageCode(name),
                            isAutoGenerated: name.toLowerCase().includes('auto')
                        };
                    }
                }

                // Method 2: Selected menu item (if dropdown is open)
                const selectedItem = panel.querySelector('[aria-selected="true"], .iron-selected');
                if (selectedItem) {
                    const name = selectedItem.textContent?.trim();
                    if (name) {
                        return {
                            languageName: name,
                            languageCode: this.getLanguageCode(name),
                            isAutoGenerated: name.toLowerCase().includes('auto')
                        };
                    }
                }
            } catch (e) {
                console.warn('[YT-TP] Language detection failed:', e);
            }

            return {
                languageName: 'Unknown',
                languageCode: 'unknown',
                isAutoGenerated: false
            };
        },

        // ========== EXTRACTION METHODS ==========

        /**
         * Method 1: Extract from DOM using targetId attribute
         * The targetId contains: {videoId}.{params}.{startMs}.{endMs}
         */
        extractFromDOMWithTargetId(panel) {
            console.log('[YT-TP] Trying DOM extraction with targetId...');

            const renderers = panel.querySelectorAll('ytd-transcript-segment-renderer');
            if (!renderers.length) return null;

            const segments = [];
            renderers.forEach(renderer => {
                // Try to get targetId which contains timing info
                const targetId = renderer.getAttribute('target-id') ||
                                 renderer.data?.targetId ||
                                 renderer.__data?.data?.targetId;

                const textEl = renderer.querySelector('.segment-text, yt-formatted-string');
                const text = textEl?.textContent?.trim();

                if (text) {
                    let startMs = 0, endMs = 0;

                    // Parse targetId: "videoId.params.startMs.endMs"
                    if (targetId) {
                        const parts = targetId.split('.');
                        if (parts.length >= 4) {
                            startMs = parseInt(parts[parts.length - 2], 10) || 0;
                            endMs = parseInt(parts[parts.length - 1], 10) || 0;
                        }
                    }

                    // Fallback: parse timestamp text
                    if (!startMs) {
                        const timeEl = renderer.querySelector('.segment-timestamp');
                        if (timeEl) {
                            startMs = this.parseTimeToMs(timeEl.textContent?.trim() || '0:00');
                        }
                    }

                    segments.push({ startMs, endMs: endMs || startMs + 5000, text });
                }
            });

            // Adjust end times if we only have start times
            for (let i = 0; i < segments.length - 1; i++) {
                if (segments[i].endMs <= segments[i].startMs) {
                    segments[i].endMs = segments[i + 1].startMs;
                }
            }

            if (segments.length > 0) {
                console.log(`[YT-TP] DOM targetId: ${segments.length} segments`);
                return segments;
            }

            return null;
        },

        /**
         * Method 2: Extract from DOM element's __data property
         * YouTube stores the full data object on elements
         */
        extractFromElementData(panel) {
            console.log('[YT-TP] Trying DOM __data extraction...');

            try {
                // Find the transcript renderer
                const transcriptRenderer = panel.querySelector('ytd-transcript-renderer');
                if (!transcriptRenderer) return null;

                // Access internal data
                const data = transcriptRenderer.__data?.data ||
                             transcriptRenderer.data ||
                             transcriptRenderer.__dataHost?.__data;

                if (!data) return null;

                // Navigate to segments
                const segmentList = data.content?.transcriptSearchPanelRenderer?.body?.transcriptSegmentListRenderer?.initialSegments;

                if (segmentList && Array.isArray(segmentList)) {
                    const segments = [];
                    for (const seg of segmentList) {
                        const renderer = seg.transcriptSegmentRenderer;
                        if (!renderer) continue;

                        const text = renderer.snippet?.runs?.map(r => r.text).join('') || '';
                        if (!text.trim()) continue;

                        segments.push({
                            startMs: parseInt(renderer.startMs, 10) || 0,
                            endMs: parseInt(renderer.endMs, 10) || 0,
                            text: text.trim()
                        });
                    }

                    if (segments.length > 0) {
                        console.log(`[YT-TP] __data extraction: ${segments.length} segments`);
                        return segments;
                    }
                }
            } catch (e) {
                console.warn('[YT-TP] __data extraction failed:', e);
            }

            return null;
        },

        /**
         * Method 3: Call YouTube API with params from panel
         */
        async extractViaAPI(panel) {
            console.log('[YT-TP] Trying YouTube API extraction...');

            // Find params in the panel's data
            let params = null;

            try {
                // Try to get params from transcript renderer's data
                const transcriptRenderer = panel.querySelector('ytd-transcript-renderer');
                if (transcriptRenderer) {
                    const data = transcriptRenderer.__data?.data ||
                                 transcriptRenderer.data;

                    // Look in search box
                    const searchParams = data?.content?.transcriptSearchPanelRenderer?.header
                        ?.transcriptSearchBoxRenderer?.onTextChangeCommand?.getTranscriptEndpoint?.params;

                    if (searchParams) {
                        params = searchParams;
                        console.log('[YT-TP] Found params in transcript renderer');
                    }
                }
            } catch (e) {
                console.warn('[YT-TP] Could not extract params from element data');
            }

            if (!params) {
                throw new Error('API params not found');
            }

            // Make the API call
            const config = this.getClientConfig();
            const response = await fetch('https://www.youtube.com/youtubei/v1/get_transcript?prettyPrint=false', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    context: { client: config },
                    params: params
                }),
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error(`API returned ${response.status}`);
            }

            const data = await response.json();
            return this.parseAPIResponse(data);
        },

        /**
         * Parse YouTube API response
         */
        parseAPIResponse(data) {
            const actions = data?.actions;
            if (!actions || !Array.isArray(actions)) return null;

            let segments = null;
            let langInfo = { languageName: 'Unknown', languageCode: 'unknown', isAutoGenerated: false };

            for (const action of actions) {
                const content = action?.updateEngagementPanelAction?.content?.transcriptRenderer?.content;
                if (!content) continue;

                const searchPanel = content.transcriptSearchPanelRenderer;
                if (!searchPanel) continue;

                // Get segments
                const segmentList = searchPanel.body?.transcriptSegmentListRenderer?.initialSegments;
                if (segmentList && Array.isArray(segmentList)) {
                    segments = [];
                    for (const seg of segmentList) {
                        const renderer = seg.transcriptSegmentRenderer;
                        if (!renderer) continue;

                        const text = renderer.snippet?.runs?.map(r => r.text).join('') || '';
                        if (!text.trim()) continue;

                        segments.push({
                            startMs: parseInt(renderer.startMs, 10) || 0,
                            endMs: parseInt(renderer.endMs, 10) || 0,
                            text: text.trim()
                        });
                    }
                }

                // Get language info from footer
                const footer = searchPanel.footer?.transcriptFooterRenderer;
                const menuItems = footer?.languageMenu?.sortFilterSubMenuRenderer?.subMenuItems;
                if (menuItems) {
                    const selected = menuItems.find(item => item.selected === true);
                    if (selected) {
                        langInfo = {
                            languageName: selected.title || 'Unknown',
                            languageCode: this.getLanguageCode(selected.title),
                            isAutoGenerated: selected.title?.toLowerCase().includes('auto') || false
                        };
                    }
                }
            }

            if (segments && segments.length > 0) {
                console.log(`[YT-TP] API extraction: ${segments.length} segments, language: ${langInfo.languageName}`);
                return { segments, ...langInfo };
            }

            return null;
        },

        /**
         * Method 4: Simple DOM text extraction (fallback)
         */
        extractPlainText(panel) {
            console.log('[YT-TP] Trying plain text extraction...');

            const selectors = [
                'ytd-transcript-segment-renderer .segment-text',
                'ytd-transcript-segment-renderer yt-formatted-string',
                '.cue-group .cue',
                '.ytd-transcript-body-renderer'
            ];

            for (const selector of selectors) {
                const elements = panel.querySelectorAll(selector);
                if (elements.length > 0) {
                    let text = '';
                    elements.forEach(el => {
                        text += (el.textContent || '').trim().replace(/\s+/g, ' ') + ' ';
                    });
                    text = text.trim();
                    if (text.length > 50) { // Sanity check
                        console.log(`[YT-TP] Plain text: ${text.length} characters`);
                        return text;
                    }
                }
            }

            return null;
        },

        /**
         * Method 5: Extract from window.ytInitialPlayerResponse (FINAL FALLBACK)
         * Bypasses the transcript panel entirely by accessing YouTube's internal
         * player data and fetching captions directly via the timedtext API.
         * This is crucial for reliability when YouTube's UI changes break panel detection.
         */
        extractFromPlayerResponse() {
            console.log('[YT-TP] Trying ytInitialPlayerResponse fallback...');

            return new Promise((resolve, reject) => {
                let playerResponse = null;
                try {
                    playerResponse = window.ytInitialPlayerResponse ||
                        (window.ytplayer?.config?.args?.player_response &&
                         JSON.parse(window.ytplayer.config.args.player_response));
                } catch (e) {
                    reject(new Error('Could not parse player response: ' + e.message));
                    return;
                }

                if (!playerResponse?.captions?.playerCaptionsTracklistRenderer?.captionTracks) {
                    reject(new Error('No caption tracks in player response'));
                    return;
                }

                const tracks = playerResponse.captions.playerCaptionsTracklistRenderer.captionTracks;
                if (!tracks.length) {
                    reject(new Error('Caption tracks array is empty'));
                    return;
                }

                // Priority: English ASR > any ASR > English manual > first available
                const chosenTrack =
                    tracks.find(t => t.kind === 'asr' && t.languageCode?.startsWith('en')) ||
                    tracks.find(t => t.kind === 'asr') ||
                    tracks.find(t => t.languageCode?.startsWith('en')) ||
                    tracks[0];

                if (!chosenTrack?.baseUrl) {
                    reject(new Error('No valid caption track URL found'));
                    return;
                }

                const langName = chosenTrack.name?.simpleText || chosenTrack.languageCode || 'Unknown';
                const langCode = chosenTrack.languageCode || 'unknown';
                const isAuto = chosenTrack.kind === 'asr';

                console.log(`[YT-TP] Fetching caption track: ${langName} (${langCode})`);

                GM_xmlhttpRequest({
                    method: 'GET',
                    url: chosenTrack.baseUrl + '&fmt=json3',
                    timeout: 15000,
                    onload: (response) => {
                        if (response.status !== 200) {
                            reject(new Error(`Caption fetch failed: HTTP ${response.status}`));
                            return;
                        }

                        try {
                            const data = JSON.parse(response.responseText);
                            const segments = [];

                            if (data.events) {
                                data.events.forEach(event => {
                                    if (event.segs) {
                                        const text = event.segs
                                            .map(seg => seg.utf8 || '')
                                            .join('')
                                            .replace(/\n/g, ' ')
                                            .trim();

                                        if (text) {
                                            segments.push({
                                                startMs: event.tStartMs || 0,
                                                endMs: (event.tStartMs || 0) + (event.dDurationMs || 0),
                                                text
                                            });
                                        }
                                    }
                                });
                            }

                            if (segments.length === 0) {
                                reject(new Error('No segments parsed from caption data'));
                                return;
                            }

                            console.log(`[YT-TP] Player response fallback: ${segments.length} segments`);
                            resolve({
                                segments,
                                languageName: langName,
                                languageCode: langCode,
                                isAutoGenerated: isAuto
                            });

                        } catch (e) {
                            reject(new Error('Failed to parse caption data: ' + e.message));
                        }
                    },
                    onerror: () => reject(new Error('Network error fetching captions')),
                    ontimeout: () => reject(new Error('Timeout fetching captions'))
                });
            });
        },

        // ========== UTILITY METHODS ==========

        wait(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        },

        parseTimeToMs(timeStr) {
            if (!timeStr) return 0;
            const parts = timeStr.split(':').map(p => parseInt(p, 10) || 0);
            if (parts.length === 2) return (parts[0] * 60 + parts[1]) * 1000;
            if (parts.length === 3) return (parts[0] * 3600 + parts[1] * 60 + parts[2]) * 1000;
            return 0;
        },

        extractTextFromSegments(segments) {
            if (!segments?.length) return '';
            return segments.map(s => s.text).join(' ').replace(/\s+/g, ' ').trim();
        },

        segmentsToSRT(segments) {
            if (!segments?.length) return '';

            const formatTime = (ms) => {
                const h = Math.floor(ms / 3600000);
                const m = Math.floor((ms % 3600000) / 60000);
                const s = Math.floor((ms % 60000) / 1000);
                const ms2 = ms % 1000;
                return `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')},${ms2.toString().padStart(3,'0')}`;
            };

            return segments.map((seg, i) =>
                `${i + 1}\n${formatTime(seg.startMs)} --> ${formatTime(seg.endMs)}\n${seg.text}\n`
            ).join('\n');
        },

        // ========== MAIN FETCH METHOD ==========

        /**
         * Main entry point - tries panel-based methods first, then player response fallback
         */
        async fetch() {
            console.log('[YT-TP] ========== Starting transcript fetch ==========');

            let panel = null;
            let langInfo = { languageName: 'Unknown', languageCode: 'unknown', isAutoGenerated: false };

            // Step 1: Try to open the panel (don't fail if it doesn't work)
            try {
                panel = await this.openPanel();
                langInfo = this.detectLanguageFromPanel(panel);
                console.log(`[YT-TP] Detected language: ${langInfo.languageName}`);
            } catch (e) {
                console.warn('[YT-TP] Could not open transcript panel:', e.message);
                // Continue to fallback methods
            }

            // Step 2: If panel opened, try panel-based extraction methods
            if (panel) {
                const methods = [
                    { name: 'api', fn: () => this.extractViaAPI(panel) },
                    { name: 'element-data', fn: () => this.extractFromElementData(panel) },
                    { name: 'dom-targetId', fn: () => this.extractFromDOMWithTargetId(panel) }
                ];

                for (const method of methods) {
                    try {
                        console.log(`[YT-TP] Trying: ${method.name}`);
                        const result = await method.fn();

                        if (result) {
                            const segments = result.segments || result;

                            if (Array.isArray(segments) && segments.length > 0) {
                                const finalResult = {
                                    segments,
                                    text: this.extractTextFromSegments(segments),
                                    languageName: result.languageName || langInfo.languageName,
                                    languageCode: result.languageCode || langInfo.languageCode,
                                    isAutoGenerated: result.isAutoGenerated ?? langInfo.isAutoGenerated,
                                    source: method.name
                                };

                                State.lastTranscript = finalResult;
                                console.log(`[YT-TP] ✓ Success with ${method.name}: ${segments.length} segments`);
                                return finalResult;
                            }
                        }
                    } catch (e) {
                        console.warn(`[YT-TP] ✗ ${method.name} failed:`, e.message);
                    }
                }

                // Step 3: Try plain text from panel
                console.log('[YT-TP] Trying plain text fallback...');
                const text = this.extractPlainText(panel);

                if (text) {
                    const result = {
                        segments: [],
                        text,
                        ...langInfo,
                        source: 'dom-text'
                    };

                    State.lastTranscript = result;
                    console.log(`[YT-TP] ✓ Plain text fallback: ${text.length} characters`);
                    return result;
                }
            }

            // Step 4: Final fallback - player response (doesn't require panel)
            try {
                console.log('[YT-TP] Trying player response fallback (no panel needed)...');
                const result = await this.extractFromPlayerResponse();

                if (result?.segments?.length > 0) {
                    const finalResult = {
                        segments: result.segments,
                        text: this.extractTextFromSegments(result.segments),
                        languageName: result.languageName,
                        languageCode: result.languageCode,
                        isAutoGenerated: result.isAutoGenerated,
                        source: 'player-response'
                    };

                    State.lastTranscript = finalResult;
                    console.log(`[YT-TP] ✓ Player response fallback: ${result.segments.length} segments`);
                    return finalResult;
                }
            } catch (e) {
                console.warn('[YT-TP] ✗ Player response fallback failed:', e.message);
            }

            throw new Error('All extraction methods failed. Video may not have captions available.');
        }
    };

    // ============================================================
    // SECTION 4: GEMINI API SERVICE
    // ============================================================
    const GeminiService = {
        /**
         * Fetch available models
         */
        async fetchModels(apiKey) {
            return new Promise((resolve, reject) => {
                if (!apiKey) {
                    reject(new Error('API key is required'));
                    return;
                }

                GM_xmlhttpRequest({
                    method: 'GET',
                    url: `${CONFIG.GEMINI_API_BASE}?key=${apiKey}`,
                    timeout: 15000,
                    onload: (response) => {
                        if (response.status !== 200) {
                            let errorMsg = `HTTP ${response.status}`;
                            try {
                                const data = JSON.parse(response.responseText);
                                if (data.error?.message) {
                                    errorMsg = data.error.message;
                                }
                            } catch (e) { }
                            reject(new Error(errorMsg));
                            return;
                        }

                        try {
                            const data = JSON.parse(response.responseText);

                            if (!data.models || !Array.isArray(data.models)) {
                                reject(new Error('Invalid API response: no models'));
                                return;
                            }

                            const models = data.models
                                .filter(m => m.supportedGenerationMethods?.includes('generateContent'))
                                .map(m => ({
                                    id: m.name,
                                    name: m.displayName || m.name,
                                    shortId: m.name.replace('models/', '')
                                }));

                            if (models.length === 0) {
                                reject(new Error('No compatible models found'));
                                return;
                            }

                            State.models = models;
                            resolve(models);
                        } catch (e) {
                            reject(new Error('Failed to parse models response: ' + e.message));
                        }
                    },
                    onerror: () => {
                        reject(new Error('Network error fetching models'));
                    },
                    ontimeout: () => {
                        reject(new Error('Timeout fetching models'));
                    }
                });
            });
        },

        /**
         * Process transcript with Gemini
         */
        async process(apiKey, modelId, prompt, transcript) {
            return new Promise((resolve, reject) => {
                if (!apiKey || !modelId) {
                    reject(new Error('API key and model are required'));
                    return;
                }

                const fullPrompt = prompt
                    ? `${prompt}\n\nTranscript:\n${transcript}`
                    : `Summarize this video transcript. Use Markdown formatting.\n\nTranscript:\n${transcript}`;

                const modelShortId = modelId.replace('models/', '');

                GM_xmlhttpRequest({
                    method: 'POST',
                    url: `${CONFIG.GEMINI_API_BASE}/${modelShortId}:generateContent?key=${apiKey}`,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify({
                        contents: [{
                            parts: [{ text: fullPrompt }]
                        }],
                        generationConfig: {
                            temperature: 0.7,
                            maxOutputTokens: 8192
                        }
                    }),
                    timeout: 60000,
                    onload: (response) => {
                        if (response.status !== 200) {
                            let errorMsg = `HTTP ${response.status}`;
                            try {
                                const data = JSON.parse(response.responseText);
                                if (data.error?.message) {
                                    errorMsg = data.error.message;
                                }
                            } catch (e) { }
                            reject(new Error(errorMsg));
                            return;
                        }

                        try {
                            const data = JSON.parse(response.responseText);

                            // Check for blocked content
                            if (data.promptFeedback?.blockReason) {
                                reject(new Error(`Content blocked: ${data.promptFeedback.blockReason}`));
                                return;
                            }

                            // Extract text from response
                            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

                            if (!text) {
                                reject(new Error('Empty response from Gemini'));
                                return;
                            }

                            State.lastOutput = text;
                            resolve(text);
                        } catch (e) {
                            reject(new Error('Failed to parse Gemini response: ' + e.message));
                        }
                    },
                    onerror: () => {
                        reject(new Error('Network error contacting Gemini'));
                    },
                    ontimeout: () => {
                        reject(new Error('Timeout waiting for Gemini response'));
                    }
                });
            });
        }
    };

    // ============================================================
    // SECTION 5: STYLES
    // ============================================================
    function injectStyles() {
        GM_addStyle(`
            /* ==================== TOGGLE BUTTON ==================== */
            #yttp-toggle-btn {
                position: fixed;
                z-index: 2147483647;
                padding: 6px 12px;
                background: #212121;
                color: #fff;
                border: 1px solid #333;
                border-radius: 20px;
                cursor: pointer;
                font-weight: bold;
                font-size: 12px;
                font-family: Roboto, Arial, sans-serif;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                transition: transform 0.3s ease, background 0.2s ease, opacity 0.3s ease;
                transform-origin: bottom left;
            }
            #yttp-toggle-btn:hover {
                background: #333;
                opacity: 1 !important;
            }
            #yttp-toggle-btn.dragging {
                cursor: grabbing;
                opacity: 1 !important;
            }
            #yttp-toggle-btn.page-hidden {
                display: none !important;
            }

            /* ==================== MAIN PANEL ==================== */
            #yttp-panel {
                position: fixed !important;
                z-index: 2147483646 !important;
                background: #ffffff !important;
                color: #1a1a1a !important;
                border-radius: 10px !important;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18) !important;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
                font-size: 12px !important;
                display: none;
                flex-direction: column;
                overflow: hidden;
                min-width: ${CONFIG.PANEL.MIN_WIDTH}px;
                min-height: ${CONFIG.PANEL.MIN_HEIGHT}px;
                max-height: 98vh;
                max-width: 98vw;
                transition: background 0.2s, color 0.2s, box-shadow 0.2s;
            }
            #yttp-panel.visible {
                display: flex !important;
            }

            /* ==================== DARK MODE ==================== */
            #yttp-panel.dark-mode {
                background: #1e1e1e !important;
                color: #e0e0e0 !important;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5) !important;
            }
            #yttp-panel.dark-mode .yttp-header {
                background: linear-gradient(135deg, #4c5c9e 0%, #5a3d7a 100%);
            }
            #yttp-panel.dark-mode .yttp-tabs {
                background: #252525;
                border-bottom-color: #3a3a3a;
            }
            #yttp-panel.dark-mode .yttp-tab {
                color: #aaa;
            }
            #yttp-panel.dark-mode .yttp-tab:hover {
                color: #ddd;
                background: rgba(255,255,255,0.05);
            }
            #yttp-panel.dark-mode .yttp-tab.active {
                color: #a5b4fc;
                border-bottom-color: #a5b4fc;
                background: #1e1e1e;
            }
            #yttp-panel.dark-mode .yttp-tab-content {
                background: #1e1e1e;
            }
            #yttp-panel.dark-mode .yttp-section-title {
                color: #888;
            }
            #yttp-panel.dark-mode #yttp-selected-language {
                color: #999;
            }
            #yttp-panel.dark-mode .yttp-input,
            #yttp-panel.dark-mode .yttp-select,
            #yttp-panel.dark-mode .yttp-textarea {
                background: #2a2a2a;
                border-color: #444;
                color: #e0e0e0;
            }
            #yttp-panel.dark-mode .yttp-input:focus,
            #yttp-panel.dark-mode .yttp-select:focus,
            #yttp-panel.dark-mode .yttp-textarea:focus {
                background: #333;
                border-color: #667eea;
                box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.25);
            }
            #yttp-panel.dark-mode .yttp-input::placeholder,
            #yttp-panel.dark-mode .yttp-textarea::placeholder {
                color: #666;
            }
            #yttp-panel.dark-mode .yttp-btn-secondary {
                background: #2d2d44;
                color: #a5b4fc;
                border-color: #4a4a6a;
            }
            #yttp-panel.dark-mode .yttp-btn-secondary:hover:not(:disabled) {
                background: #3a3a55;
                border-color: #6366f1;
            }
            #yttp-panel.dark-mode .yttp-divider {
                background: #3a3a3a;
            }
            #yttp-panel.dark-mode .yttp-output-content {
                background: #252525;
                border-color: #3a3a3a;
                color: #e0e0e0;
            }
            #yttp-panel.dark-mode .yttp-output-content code {
                background: #333;
                color: #f0f0f0;
            }
            #yttp-panel.dark-mode .yttp-output-content pre {
                background: #2a2a2a;
            }
            #yttp-panel.dark-mode .yttp-output-content blockquote {
                color: #aaa;
            }
            #yttp-panel.dark-mode .yttp-output-toolbar {
                border-top-color: #3a3a3a;
            }

            /* CONFIG MODE: Hide vertical resizers */
            #yttp-panel.yttp-mode-config .yttp-resize-n,
            #yttp-panel.yttp-mode-config .yttp-resize-s,
            #yttp-panel.yttp-mode-config .yttp-resize-nw,
            #yttp-panel.yttp-mode-config .yttp-resize-ne,
            #yttp-panel.yttp-mode-config .yttp-resize-sw,
            #yttp-panel.yttp-mode-config .yttp-resize-se {
                cursor: default;
            }
            #yttp-panel.yttp-mode-config .yttp-resize-e,
            #yttp-panel.yttp-mode-config .yttp-resize-w {
                cursor: ew-resize;
            }

            /* ==================== PANEL HEADER ==================== */
            .yttp-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 10px 14px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: #fff;
                cursor: move;
                user-select: none;
                flex-shrink: 0;
            }
            .yttp-header-title {
                font-size: 13px;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 6px;
            }
            .yttp-header-buttons {
                display: flex;
                gap: 6px;
            }
            .yttp-header-btn {
                width: 24px;
                height: 24px;
                border: none;
                border-radius: 5px;
                background: rgba(255, 255, 255, 0.2);
                color: #fff;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                transition: background 0.2s;
            }
            .yttp-header-btn:hover {
                background: rgba(255, 255, 255, 0.3);
            }

            /* ==================== FORM ELEMENTS ==================== */
            .yttp-section {
                display: flex;
                flex-direction: column;
                gap: 6px;
                margin-bottom: 12px;
            }
            .yttp-section-title {
                font-size: 10px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                color: #888;
                margin-bottom: 4px;
                display: flex;
                align-items: center;
                min-width: 0;
            }
            #yttp-selected-language {
                font-weight: 400;
                margin-left: 6px;
                color: #666;
                font-size: 10px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 50%;
                display: inline-block;
            }
            .yttp-row {
                display: flex;
                gap: 8px;
            }
            .yttp-row > * {
                flex: 1;
            }
            .yttp-input-group {
                display: flex;
                gap: 6px;
            }
            .yttp-input-group .yttp-input {
                flex: 1;
            }

            .yttp-input,
            .yttp-select,
            .yttp-textarea {
                width: 100%;
                padding: 7px 10px;
                border: 1px solid #ddd;
                border-radius: 6px;
                font-size: 12px;
                font-family: inherit;
                background: #fafafa;
                transition: border-color 0.2s, box-shadow 0.2s;
                box-sizing: border-box;
            }
            .yttp-input:focus,
            .yttp-select:focus,
            .yttp-textarea:focus {
                outline: none;
                border-color: #667eea;
                box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.15);
                background: #fff;
            }
            .yttp-textarea {
                resize: vertical;
                min-height: 56px;
            }

            /* ==================== BUTTONS ==================== */
            .yttp-btn {
                padding: 7px 12px;
                border: none;
                border-radius: 6px;
                font-size: 12px;
                font-weight: 600;
                font-family: inherit;
                cursor: pointer;
                transition: all 0.2s;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 5px;
            }
            .yttp-btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
            .yttp-btn:not(:disabled):active {
                transform: scale(0.96) translateY(1px);
                filter: brightness(0.9);
                box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
            }
            .yttp-btn {
                height: 30px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 100%;
            }

            .yttp-btn-primary {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: #fff;
            }
            .yttp-btn-primary:hover:not(:disabled) {
                box-shadow: 0 3px 10px rgba(102, 126, 234, 0.4);
                transform: translateY(-1px);
            }
            .yttp-btn-secondary {
                background: #eef2ff;
                color: #4f46e5;
                border: 1px solid #c7d2fe;
            }
            .yttp-btn-secondary:hover:not(:disabled) {
                background: #e0e7ff;
                border-color: #a5b4fc;
            }
            .yttp-btn-success {
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                color: #fff;
            }
            .yttp-btn-success:hover:not(:disabled) {
                box-shadow: 0 3px 10px rgba(16, 185, 129, 0.4);
            }
            .yttp-btn-sm {
                padding: 5px 10px;
                font-size: 11px;
                height: 26px;
            }
            .yttp-btn-group {
                display: flex;
                gap: 6px;
                flex-wrap: wrap;
            }
            .yttp-btn-group .yttp-btn {
                flex: 1;
                min-width: 70px;
            }
            .yttp-btn-group-4 .yttp-btn {
                flex: 1 1 0;
                min-width: 0;
                padding-left: 6px;
                padding-right: 6px;
            }

            /* ==================== STATUS ==================== */
            .yttp-tab-config .yttp-section:last-of-type {
                margin-bottom: 0;
            }

            /* Markdown styling */
            .yttp-output-content h1,
            .yttp-output-content h2,
            .yttp-output-content h3 {
                margin-top: 12px;
                margin-bottom: 6px;
                font-weight: 600;
            }
            .yttp-output-content h1:first-child,
            .yttp-output-content h2:first-child,
            .yttp-output-content h3:first-child {
                margin-top: 0;
            }
            .yttp-output-content p {
                margin: 6px 0;
            }
            .yttp-output-content ul,
            .yttp-output-content ol {
                margin: 6px 0;
                padding-left: 20px;
            }
            .yttp-output-content li {
                margin: 3px 0;
            }
            .yttp-output-content code {
                background: #f0f0f0;
                padding: 1px 5px;
                border-radius: 3px;
                font-family: 'Consolas', 'Monaco', monospace;
                font-size: 11px;
            }
            .yttp-output-content pre {
                background: #f5f5f5;
                padding: 10px;
                border-radius: 5px;
                overflow-x: auto;
                margin: 6px 0;
            }
            .yttp-output-content pre code {
                background: none;
                padding: 0;
            }
            .yttp-output-content blockquote {
                border-left: 3px solid #667eea;
                margin: 6px 0;
                padding-left: 10px;
                color: #666;
            }

            /* ==================== RESIZE HANDLES ==================== */
            .yttp-resize {
                position: absolute;
                background: transparent;
                z-index: 2147483647;
            }
            .yttp-resize-n { top: 0; left: 10px; right: 10px; height: 6px; cursor: n-resize; }
            .yttp-resize-s { bottom: 0; left: 10px; right: 10px; height: 6px; cursor: s-resize; }
            .yttp-resize-e { top: 10px; right: 0; bottom: 10px; width: 6px; cursor: e-resize; }
            .yttp-resize-w { top: 10px; left: 0; bottom: 10px; width: 6px; cursor: w-resize; }
            .yttp-resize-nw { top: 0; left: 0; width: 10px; height: 10px; cursor: nw-resize; }
            .yttp-resize-ne { top: 0; right: 0; width: 10px; height: 10px; cursor: ne-resize; }
            .yttp-resize-sw { bottom: 0; left: 0; width: 10px; height: 10px; cursor: sw-resize; }
            .yttp-resize-se { bottom: 0; right: 0; width: 10px; height: 10px; cursor: se-resize; }

            /* ==================== TABS ==================== */
            .yttp-tabs {
                display: flex;
                border-bottom: 2px solid #e0e0e0;
                background: #f8f9fa;
                padding: 0 6px;
            }
            .yttp-tab {
                flex: 1;
                padding: 8px 12px;
                border: none;
                background: transparent;
                color: #666;
                font-size: 12px;
                font-weight: 600;
                cursor: pointer;
                border-bottom: 2px solid transparent;
                margin-bottom: -2px;
                transition: all 0.2s ease;
            }
            .yttp-tab:hover {
                color: #333;
                background: rgba(0,0,0,0.03);
            }
            .yttp-tab.active {
                color: #667eea;
                border-bottom-color: #667eea;
                background: #fff;
            }

            /* ==================== TAB CONTENT ==================== */
            .yttp-tab-content {
                display: none;
                flex-direction: column;
                padding: 10px;
                flex: 1 1 auto;
                overflow-y: hidden;
                min-height: 0;
            }
            .yttp-tab-content.active {
                display: flex;
            }

            /* GROWTH LOGIC FOR CONFIG */
            #yttp-panel.yttp-mode-config .yttp-tab-config {
                overflow-y: visible;
                min-height: auto;
            }
            #yttp-panel.yttp-mode-config .yttp-tab-config.yttp-scroll-active {
                overflow-y: auto;
                min-height: 0;
            }

            /* ==================== OUTPUT TOOLBAR ==================== */
            .yttp-output-toolbar {
                display: flex;
                gap: 6px;
                padding-top: 10px;
                padding-bottom: 0px;
                border-top: 1px solid #eee;
                margin-top: 10px;
                margin-bottom: 0;
                flex-shrink: 0;
            }
            .yttp-output-toolbar .yttp-btn {
                flex: 1;
            }

            /* Output content adjusts to content */
            .yttp-tab-output .yttp-output-content {
                padding: 12px;
                background: #fafafa;
                border-radius: 6px;
                border: 1px solid #e0e0e0;
                overflow-y: auto;
                flex: 1 1 auto;
                min-height: 0;
                margin-bottom: 4px;
            }
            .yttp-tab-output .yttp-output-content:empty {
                min-height: 80px;
            }

            .yttp-tab-output.yttp-tab-content {
                display: none;
            }
            .yttp-tab-output.yttp-tab-content.active {
                display: flex;
                flex-direction: column;
                padding-bottom: 10px !important;
            }

            /* ==================== DIVIDER ==================== */
            .yttp-divider {
                height: 1px;
                background: #eee;
                margin: 4px 0;
            }
        `);
    }

    // ============================================================
    // SECTION 6: UI CLASS
    // ============================================================
    class UI {
        constructor() {
            this.toggleBtn = null;
            this.panel = null;
            this.elements = {};
            this.isDragging = false;
            this.isResizing = false;
            this.dragData = {};
            this.resizeData = {};
            this.buttonDragOccurred = false;
        }

        init() {
            console.log('[YT-TP] Creating UI...');
            injectStyles();
            this.createToggleButton();
            this.setupButtonDrag();
            this.createPanel();
            this.attachEventListeners();
            this.loadStateIntoUI();
            this.updateVisibility();

            // Apply dark mode if saved
            if (State.darkMode) {
                this.panel.classList.add('dark-mode');
                this.elements.darkModeBtn.textContent = '☀️';
            }

            if (State.panelVisible && PageUtils.isWatchPage()) {
                this.showPanel();
            }

            console.log('[YT-TP] UI ready');
        }

        createToggleButton() {
            this.toggleBtn = document.createElement('button');
            this.toggleBtn.id = 'yttp-toggle-btn';
            this.toggleBtn.textContent = '📝 Transcript';
            this.toggleBtn.title = 'Click: Open/close panel\nDrag: Move button position';

            // Apply saved/default position
            this.toggleBtn.style.left = State.buttonPosition.left + 'px';
            this.toggleBtn.style.bottom = State.buttonPosition.bottom + 'px';

            // Apply configured scale and opacity
            this.toggleBtn.style.transform = `scale(${CONFIG.BUTTON.scale})`;
            this.toggleBtn.style.opacity = CONFIG.BUTTON.opacity;

            // Click handler - will be modified by setupButtonDrag to prevent clicks after drag
            this.toggleBtn.addEventListener('click', (e) => {
                if (this.buttonDragOccurred) {
                    // Prevent toggle if we just finished dragging
                    this.buttonDragOccurred = false;
                    e.preventDefault();
                    e.stopPropagation();
                    return;
                }
                console.log('[YT-TP] Toggle button clicked');
                this.togglePanel();
            });

            document.body.appendChild(this.toggleBtn);
            console.log('[YT-TP] Toggle button created and attached to body');
        }

        setupButtonDrag() {
            let isDragging = false;
            let hasMoved = false;
            let startX, startY;
            let startLeft, startBottom;
            const DRAG_THRESHOLD = 5; // Pixels of movement before considered a drag

            const onMouseDown = (e) => {
                // Only respond to left mouse button
                if (e.button !== 0) return;

                isDragging = true;
                hasMoved = false;

                startX = e.clientX;
                startY = e.clientY;

                // Get current position
                const rect = this.toggleBtn.getBoundingClientRect();
                startLeft = rect.left;
                startBottom = window.innerHeight - rect.bottom;

                // Prevent text selection during drag
                document.body.style.userSelect = 'none';

                // Add dragging class for visual feedback
                this.toggleBtn.classList.add('dragging');

                // Attach document-level listeners
                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);

                e.preventDefault();
            };

            const onMouseMove = (e) => {
                if (!isDragging) return;

                const deltaX = e.clientX - startX;
                const deltaY = e.clientY - startY;

                // Check if we've moved enough to consider it a drag
                if (!hasMoved && (Math.abs(deltaX) > DRAG_THRESHOLD || Math.abs(deltaY) > DRAG_THRESHOLD)) {
                    hasMoved = true;
                }

                if (!hasMoved) return;

                // Calculate new position
                let newLeft = startLeft + deltaX;
                let newBottom = startBottom - deltaY; // Subtract because Y increases downward

                // Get button dimensions (accounting for scale)
                const scale = CONFIG.BUTTON.scale;
                const rect = this.toggleBtn.getBoundingClientRect();
                const buttonWidth = rect.width;
                const buttonHeight = rect.height;

                // Boundary constraints - keep button fully within viewport
                const maxLeft = window.innerWidth - buttonWidth;
                const maxBottom = window.innerHeight - buttonHeight;

                newLeft = Math.max(0, Math.min(newLeft, maxLeft));
                newBottom = Math.max(0, Math.min(newBottom, maxBottom));

                // Apply new position
                this.toggleBtn.style.left = newLeft + 'px';
                this.toggleBtn.style.bottom = newBottom + 'px';
            };

            const onMouseUp = (e) => {
                if (!isDragging) return;

                isDragging = false;

                // Remove document-level listeners
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);

                // Restore text selection
                document.body.style.userSelect = '';

                // Remove dragging class
                this.toggleBtn.classList.remove('dragging');

                if (hasMoved) {
                    // Save the new position
                    const rect = this.toggleBtn.getBoundingClientRect();
                    State.buttonPosition = {
                        left: rect.left,
                        bottom: window.innerHeight - rect.bottom
                    };
                    State.save();

                    // Flag to prevent the click event from firing
                    this.buttonDragOccurred = true;

                    // Reset flag after a short delay in case click doesn't fire
                    setTimeout(() => { this.buttonDragOccurred = false; }, 300);

                    console.log('[YT-TP] Button position saved:', State.buttonPosition);
                }
            };

            // Attach mousedown to the button
            this.toggleBtn.addEventListener('mousedown', onMouseDown);

            // Initialize the drag occurred flag
            this.buttonDragOccurred = false;

            console.log('[YT-TP] Button drag functionality initialized');
        }

        /**
         * Show or hide button and panel based on page type
         */
        updateVisibility() {
            const isWatch = PageUtils.isWatchPage();

            if (isWatch) {
                this.toggleBtn.classList.remove('page-hidden');
                console.log('[YT-TP] On watch page - button visible');
            } else {
                this.toggleBtn.classList.add('page-hidden');

                // If panel is open, close it when leaving watch page
                if (State.panelVisible) {
                    this.hidePanel();
                    console.log('[YT-TP] Left watch page - panel closed');
                }

                console.log('[YT-TP] Not on watch page - button hidden');
            }
        }

        createPanel() {
            this.panel = document.createElement('div');
            this.panel.id = 'yttp-panel';
            this.panel.classList.add('yttp-mode-config'); // Start in Config mode explicitly

            const htmlContent = `
                <!-- Header -->
                <div class="yttp-header">
                    <div class="yttp-header-title">
                        <span>📝</span>
                        <span>Transcript Processor</span>
                    </div>
                    <div class="yttp-header-buttons">
                        <button class="yttp-header-btn" id="yttp-dark-mode" title="Toggle Dark Mode">🌙</button>
                        <button class="yttp-header-btn" id="yttp-close" title="Close">×</button>
                    </div>
                </div>

                <!-- Tabs -->
                <div class="yttp-tabs">
                    <button class="yttp-tab active" id="yttp-tab-config">⚙️ Config</button>
                    <button class="yttp-tab" id="yttp-tab-output">📄 Output</button>
                </div>

                <!-- Config Tab Content -->
                <div class="yttp-tab-content yttp-tab-config active" id="yttp-content-config">
                    <!-- Provider & API Key -->
                    <div class="yttp-section">
                        <div class="yttp-section-title">API Configuration</div>
                        <div class="yttp-row">
                            <select class="yttp-select" id="yttp-provider">
                                ${PROVIDERS.map(p => `<option value="${p.id}">${p.name}</option>`).join('')}
                            </select>
                        </div>
                        <div class="yttp-input-group">
                            <input type="password" class="yttp-input" id="yttp-api-key" placeholder="Enter API key...">
                            <button class="yttp-btn yttp-btn-primary yttp-btn-sm" id="yttp-save-key">Save</button>
                            <button class="yttp-btn yttp-btn-primary yttp-btn-sm" id="yttp-fetch-models">Load Models</button>
                        </div>
                    </div>

                    <!-- Model Selection -->
                    <div class="yttp-section">
                        <div class="yttp-section-title">
                            Model
                            <span id="yttp-model-status" style="font-weight:normal; font-size: 11px; margin-left: 8px; color: #666;"></span>
                        </div>
                        <select class="yttp-select" id="yttp-model" disabled>
                            <option value="">Load models first...</option>
                        </select>
                    </div>

                    <!-- Language Selection -->
                    <div class="yttp-section">
                        <div class="yttp-section-title">
                            Transcript Language
                            <span id="yttp-selected-language" style="font-weight: 400; margin-left: 8px; color: #666; font-size: 11px;"></span>
                        </div>
                        <button class="yttp-btn yttp-btn-secondary" id="yttp-select-language" style="width: 100%;">
                            🌐 Select Language
                        </button>
                    </div>

                    <!-- Prompt -->
                    <div class="yttp-section">
                        <div class="yttp-section-title">Prompt (Optional)</div>
                        <textarea class="yttp-textarea" id="yttp-prompt" placeholder="Custom instructions for processing the transcript..."></textarea>
                    </div>

                    <div class="yttp-divider"></div>

                    <!-- Transcript Actions -->
                    <div class="yttp-section">
                        <div class="yttp-section-title">Transcript Actions</div>
                        <div class="yttp-btn-group yttp-btn-group-4">
                            <button class="yttp-btn yttp-btn-secondary" id="yttp-copy-text" title="Copy to Clipboard">📋</button>
                            <button class="yttp-btn yttp-btn-secondary" id="yttp-download-txt" title="Download TXT">TXT</button>
                            <button class="yttp-btn yttp-btn-secondary" id="yttp-download-srt" title="Download SRT">SRT</button>
                            <button class="yttp-btn yttp-btn-secondary" id="yttp-download-json" title="Download JSON">JSON</button>
                        </div>
                    </div>

                    <!-- AI Processing -->
                    <div class="yttp-section">
                        <div class="yttp-btn-group">
                            <button class="yttp-btn yttp-btn-success" id="yttp-process" disabled style="flex: 2;">
                                ▶ Process with AI
                            </button>
                        </div>
                    </div>

                </div>

                <!-- Output Tab Content -->
                <div class="yttp-tab-content yttp-tab-output" id="yttp-content-output">
                    <!-- Output Content (full height with scroll) -->
                    <div class="yttp-output-content" id="yttp-output"></div>

                    <!-- Output Actions (bottom bar) -->
                    <div class="yttp-output-toolbar">
                        <button class="yttp-btn yttp-btn-primary" id="yttp-copy-output">📋 Copy Output</button>
                        <button class="yttp-btn yttp-btn-primary" id="yttp-download-output">⬇ Download MD</button>
                    </div>
                </div>

                <!-- Resize Handles -->
                <div class="yttp-resize yttp-resize-n"></div>
                <div class="yttp-resize yttp-resize-s"></div>
                <div class="yttp-resize yttp-resize-e"></div>
                <div class="yttp-resize yttp-resize-w"></div>
                <div class="yttp-resize yttp-resize-nw"></div>
                <div class="yttp-resize yttp-resize-ne"></div>
                <div class="yttp-resize yttp-resize-sw"></div>
                <div class="yttp-resize yttp-resize-se"></div>
            `;

            // Use Trusted Types policy if available, otherwise fall back to direct assignment
            if (trustedTypesPolicy) {
                this.panel.innerHTML = trustedTypesPolicy.createHTML(htmlContent);
            } else {
                this.panel.innerHTML = htmlContent;
            }

            document.body.appendChild(this.panel);

            // Cache element references
            this.elements = {
                provider: document.getElementById('yttp-provider'),
                apiKey: document.getElementById('yttp-api-key'),
                model: document.getElementById('yttp-model'),
                prompt: document.getElementById('yttp-prompt'),
                modelStatus: document.getElementById('yttp-model-status'),
                output: document.getElementById('yttp-output'),
                processBtn: document.getElementById('yttp-process'),
                darkModeBtn: document.getElementById('yttp-dark-mode')
            };

            // Apply saved geometry
            this.applyPanelGeometry();
        }

        applyPanelGeometry() {
            const pos = State.panelPosition;
            const size = State.panelSize;

            // STRICT BOUNDARIES: Ensure initial position is completely visible
            const maxLeft = Math.max(0, window.innerWidth - size.width);
            const maxTop = Math.max(0, window.innerHeight - size.height); // Use actual height or default

            // Clamp position
            const safeLeft = Math.min(Math.max(0, pos.left), maxLeft);
            const safeTop = Math.min(Math.max(0, pos.top), maxTop);

            this.panel.style.left = safeLeft + 'px';
            this.panel.style.top = safeTop + 'px';
            this.panel.style.width = size.width + 'px';

            // ALWAYS reset height to auto on initial load (Config mode default)
            // This prevents inheriting a large height from a previous session's output tab
            this.panel.style.height = '';
            this.panel.style.minHeight = '';

            console.log('[YT-TP] Panel geometry applied:', { left: safeLeft, top: safeTop, width: size.width });
        }

        loadStateIntoUI() {
            this.elements.provider.value = State.selectedProvider;
            this.elements.apiKey.value = State.getApiKey();
            this.elements.prompt.value = State.prompt;

            // If we have a saved model, add it as an option
            if (State.selectedModel) {
                const opt = document.createElement('option');
                opt.value = State.selectedModel;
                opt.textContent = State.selectedModel.replace('models/', '');
                this.elements.model.replaceChildren();
                this.elements.model.appendChild(opt);
                this.elements.model.value = State.selectedModel;
            }

            this.updateProcessButton();
        }

        // Language is now detected at fetch time via TranscriptService.detectLanguageFromPanel()
        // The span is updated after successful fetch operations
        updateLanguageSpan(language) {
            const span = document.getElementById('yttp-selected-language');
            if (span) {
                span.textContent = language ? `(${language})` : '';
            }
        }

        attachEventListeners() {
            // Header buttons
            document.getElementById('yttp-close').addEventListener('click', () => this.hidePanel());
            this.elements.darkModeBtn.addEventListener('click', () => this.toggleDarkMode());

            // Double-click header to hide
            this.panel.querySelector('.yttp-header').addEventListener('dblclick', (e) => {
                if (!e.target.closest('.yttp-header-buttons')) {
                    this.hidePanel();
                }
            });

            // Prevent scroll propagation to page when hovering over panel
            this.panel.addEventListener('wheel', (e) => {
                const target = e.target.closest('.yttp-tab-content, .yttp-output-content');
                if (target) {
                    const isScrollable = target.scrollHeight > target.clientHeight;
                    const atTop = target.scrollTop === 0;
                    const atBottom = target.scrollTop + target.clientHeight >= target.scrollHeight - 1;

                    // Only stop propagation if element is scrollable and not at boundary
                    // or if scrolling would go "past" the boundary
                    if (isScrollable) {
                        if ((e.deltaY < 0 && atTop) || (e.deltaY > 0 && atBottom)) {
                            e.preventDefault();
                        }
                    }
                }
                e.stopPropagation();
            }, { passive: false });

            // Tab switching
            document.getElementById('yttp-tab-config').addEventListener('click', () => this.switchTab('config'));
            document.getElementById('yttp-tab-output').addEventListener('click', () => this.switchTab('output'));

            // Form controls - save on change
            document.getElementById('yttp-save-key').addEventListener('click', () => this.saveApiKey());
            document.getElementById('yttp-fetch-models').addEventListener('click', () => this.fetchModels());

            this.elements.provider.addEventListener('change', (e) => {
                State.selectedProvider = e.target.value;
                State.save();
                this.elements.apiKey.value = State.getApiKey();
                this.updateProcessButton();
            });

            this.elements.model.addEventListener('change', (e) => {
                State.selectedModel = e.target.value;
                State.save();
                this.updateProcessButton();
            });

            this.elements.prompt.addEventListener('input', (e) => {
                State.prompt = e.target.value;
                State.save();
            });

            // Language selection - opens YouTube's transcript panel
            document.getElementById('yttp-select-language').addEventListener('click', () => this.openLanguageSelector());

            // Transcript actions
            document.getElementById('yttp-copy-text').addEventListener('click', () => this.copyTranscriptText());
            document.getElementById('yttp-download-txt').addEventListener('click', () => this.downloadTXT());
            document.getElementById('yttp-download-srt').addEventListener('click', () => this.downloadSRT());
            document.getElementById('yttp-download-json').addEventListener('click', () => this.downloadJSON());

            // AI processing
            this.elements.processBtn.addEventListener('click', () => this.processWithAI());

            // Output actions
            document.getElementById('yttp-copy-output').addEventListener('click', () => this.copyOutput());
            document.getElementById('yttp-download-output').addEventListener('click', () => this.downloadOutput());

            // Drag & Resize
            this.setupDragAndResize();

            // Smart Resize Observer for Config Tab
            // Monitors panel height to switch between "Grow" and "Scroll" modes
            this.setupConfigResizeObserver();
        }

        setupConfigResizeObserver() {
            if (this.configObserver) return;

            const configContent = document.getElementById('yttp-content-config');

            this.configObserver = new ResizeObserver(entries => {
                if (!this.panel.classList.contains('yttp-mode-config')) return;

                for (const entry of entries) {
                    const rect = entry.contentRect;
                    // Check if we are close to the viewport max-height limit (98vh)
                    const viewportHeight = window.innerHeight;
                    const limit = viewportHeight * 0.98;
                    const threshold = 10; // px buffer

                    // If panel is hitting the ceiling (max-height), enable internal scrolling
                    if (rect.height >= limit - threshold) {
                        if (!configContent.classList.contains('yttp-scroll-active')) {
                            configContent.classList.add('yttp-scroll-active');
                            // Ensure buttons are visible/accessible via scroll
                        }
                    } else {
                        // Otherwise, allow normal growth (overflow visible)
                        // But ONLY remove if we are genuinely smaller than the limit
                        // (prevents flickering if content is right at the boundary)
                        if (configContent.scrollHeight <= limit - threshold) {
                            configContent.classList.remove('yttp-scroll-active');
                        }
                    }
                }
            });

            this.configObserver.observe(this.panel);
        }

        switchTab(tabName) {
            const isConfig = tabName === 'config';

            if (isConfig) {
                // Switching to CONFIG

                // Save current Output height before switching
                if (this.panel.style.height && this.panel.style.height !== 'auto') {
                    this.lastOutputHeight = this.panel.style.height;
                }

                // Update classes
                this.panel.classList.add('yttp-mode-config');
                this.panel.classList.remove('yttp-mode-output');

                // Update tab buttons & content
                document.getElementById('yttp-tab-config').classList.add('active');
                document.getElementById('yttp-tab-output').classList.remove('active');
                document.getElementById('yttp-content-config').classList.add('active');
                document.getElementById('yttp-content-output').classList.remove('active');

                // Reset to Auto Height for Config
                this.panel.style.height = '';
                this.panel.style.minHeight = '';

            } else {
                // Switching to OUTPUT

                // CRITICAL: Measure config height BEFORE changing visibility
                // This ensures minHeight is based on config tab, not output content
                const configHeight = this.panel.offsetHeight;

                // Now update classes and visibility
                this.panel.classList.remove('yttp-mode-config');
                this.panel.classList.add('yttp-mode-output');

                // Update tab buttons & content
                document.getElementById('yttp-tab-config').classList.remove('active');
                document.getElementById('yttp-tab-output').classList.add('active');
                document.getElementById('yttp-content-config').classList.remove('active');
                document.getElementById('yttp-content-output').classList.add('active');

                // Set minHeight based on config tab height (panel never shrinks below this)
                this.panel.style.minHeight = configHeight + 'px';

                // Restore last output height or use config height as starting point
                if (this.lastOutputHeight) {
                    this.panel.style.height = this.lastOutputHeight;
                } else {
                    this.panel.style.height = configHeight + 'px';
                }
            }
        }

        setupDragAndResize() {
            const header = this.panel.querySelector('.yttp-header');
            const resizers = this.panel.querySelectorAll('.yttp-resize');

            // Drag
            header.addEventListener('mousedown', (e) => {
                if (e.target.closest('.yttp-header-buttons')) return;

                this.isDragging = true;
                const rect = this.panel.getBoundingClientRect();
                this.dragData = {
                    startX: e.clientX,
                    startY: e.clientY,
                    startLeft: rect.left,
                    startTop: rect.top
                };
                document.body.style.userSelect = 'none';
                e.preventDefault();
            });

            // Resize
            resizers.forEach(handle => {
                handle.addEventListener('mousedown', (e) => {
                    const isConfig = this.panel.classList.contains('yttp-mode-config');

                    // Extract direction from class name (e.g., "yttp-resize yttp-resize-nw" → "nw")
                    const dirMatch = handle.className.match(/yttp-resize-(\w+)/);
                    const handleDir = dirMatch ? dirMatch[1] : '';

                    // CONFIG MODE RESTRICTION: Block pure vertical resizing (n, s edges only)
                    if (isConfig && (handleDir === 'n' || handleDir === 's')) {
                        return;
                    }

                    this.isResizing = true;
                    const rect = this.panel.getBoundingClientRect();

                    this.resizeData = {
                        startX: e.clientX,
                        startY: e.clientY,
                        startWidth: rect.width,
                        startHeight: rect.height,
                        startLeft: rect.left,
                        startTop: rect.top,
                        direction: handleDir
                    };
                    document.body.style.userSelect = 'none';
                    e.preventDefault();
                    e.stopPropagation();
                });
            });

            // Mouse move
            document.addEventListener('mousemove', (e) => {
                if (this.isDragging) {
                    const dx = e.clientX - this.dragData.startX;
                    const dy = e.clientY - this.dragData.startY;
                    let newLeft = this.dragData.startLeft + dx;
                    let newTop = this.dragData.startTop + dy;

                    // Get current dimensions
                    const rect = this.panel.getBoundingClientRect();
                    const width = rect.width;
                    const height = rect.height;

                    // STRICT BOUNDARIES: Keep entire panel within viewport
                    const maxLeft = window.innerWidth - width;
                    const maxTop = window.innerHeight - height;

                    newLeft = Math.max(0, Math.min(newLeft, maxLeft));
                    newTop = Math.max(0, Math.min(newTop, maxTop));

                    this.panel.style.left = newLeft + 'px';
                    this.panel.style.top = newTop + 'px';
                }

                if (this.isResizing) {
                    const dx = e.clientX - this.resizeData.startX;
                    let dy = e.clientY - this.resizeData.startY;
                    let dir = this.resizeData.direction;

                    const isConfig = this.panel.classList.contains('yttp-mode-config');

                    // CONFIG MODE RESTRICTION:
                    // Force dy = 0 and remove vertical components from direction
                    if (isConfig) {
                        dy = 0;
                        dir = dir.replace('n', '').replace('s', '');
                    }

                    let newWidth = this.resizeData.startWidth;
                    let newHeight = this.resizeData.startHeight;
                    let newLeft = this.resizeData.startLeft;
                    let newTop = this.resizeData.startTop;

                    // Calculate potential new dimensions/position
                    if (dir.includes('e')) newWidth = this.resizeData.startWidth + dx;
                    if (dir.includes('w')) {
                        newWidth = this.resizeData.startWidth - dx;
                        newLeft = this.resizeData.startLeft + dx;
                    }
                    if (dir.includes('s')) newHeight = this.resizeData.startHeight + dy;
                    if (dir.includes('n')) {
                        newHeight = this.resizeData.startHeight - dy;
                        newTop = this.resizeData.startTop + dy;
                    }

                    // Get effective minimum height (respect CSS minHeight in output mode)
                    let effectiveMinHeight = CONFIG.PANEL.MIN_HEIGHT;
                    if (!isConfig) {
                        const cssMinHeight = parseFloat(getComputedStyle(this.panel).minHeight) || 0;
                        effectiveMinHeight = Math.max(CONFIG.PANEL.MIN_HEIGHT, cssMinHeight);
                    }

                    // Enforce Min Size
                    if (newWidth < CONFIG.PANEL.MIN_WIDTH) {
                        newWidth = CONFIG.PANEL.MIN_WIDTH;
                        if (dir.includes('w')) newLeft = this.resizeData.startLeft + (this.resizeData.startWidth - CONFIG.PANEL.MIN_WIDTH);
                    }
                    if (newHeight < effectiveMinHeight) {
                        newHeight = effectiveMinHeight;
                        if (dir.includes('n')) newTop = this.resizeData.startTop + (this.resizeData.startHeight - effectiveMinHeight);
                    }

                    // Enforce Max Size (Viewport)
                    // 1. Right Edge Check
                    if (dir.includes('e') || !dir.includes('w')) {
                        const maxW = window.innerWidth - newLeft;
                        newWidth = Math.min(newWidth, maxW);
                    }

                    // 2. Bottom Edge Check
                    if (dir.includes('s') || !dir.includes('n')) {
                        const maxH = window.innerHeight - newTop;
                        newHeight = Math.min(newHeight, maxH);
                    }

                    // 3. Left Edge Check (moving left)
                    if (dir.includes('w')) {
                        if (newLeft < 0) {
                            newLeft = 0;
                            newWidth = this.resizeData.startLeft + this.resizeData.startWidth;
                        }
                    }

                    // 4. Top Edge Check (moving top)
                    if (dir.includes('n')) {
                        if (newTop < 0) {
                            newTop = 0;
                            newHeight = this.resizeData.startTop + this.resizeData.startHeight;
                        }
                    }

                    this.panel.style.width = newWidth + 'px';

                    // Set height only in output mode
                    if (!isConfig) {
                        this.panel.style.height = newHeight + 'px';
                    } else {
                        this.panel.style.height = '';
                    }

                    if (dir.includes('w')) {
                        this.panel.style.left = newLeft + 'px';
                    }
                    if (dir.includes('n')) {
                        this.panel.style.top = newTop + 'px';
                    }
                }
            });

            // Mouse up
            document.addEventListener('mouseup', () => {
                if (this.isDragging || this.isResizing) {
                    this.isDragging = false;
                    this.isResizing = false;
                    document.body.style.userSelect = '';

                    // Save position and size
                    const rect = this.panel.getBoundingClientRect();
                    State.panelPosition = { left: rect.left, top: rect.top };
                    State.panelSize = { width: rect.width, height: rect.height }; // height saved but not restored
                    State.save();
                }
            });
        }

        // ==================== UI Methods ====================

        togglePanel() {
            console.log('[YT-TP] togglePanel called, current state:', State.panelVisible);
            // Sync state with actual DOM state to handle edge cases
            const isActuallyVisible = this.panel.classList.contains('visible') ||
                                       getComputedStyle(this.panel).display !== 'none';

            if (isActuallyVisible) {
                this.hidePanel();
            } else {
                this.showPanel();
            }
        }

        showPanel() {
            console.log('[YT-TP] showPanel called');
            // Make button fully visible when panel is open
            this.toggleBtn.style.opacity = '1';
            this.panel.classList.add('visible');
            this.panel.style.display = 'flex';
            State.panelVisible = true;
            State.save();
            console.log('[YT-TP] Panel should now be visible');
        }

        hidePanel() {
            console.log('[YT-TP] hidePanel called');
            // Return button to configured opacity when panel is closed
            this.toggleBtn.style.opacity = CONFIG.BUTTON.opacity;
            this.panel.classList.remove('visible');
            this.panel.style.display = 'none';
            State.panelVisible = false;
            State.save();
        }

        toggleDarkMode() {
            State.darkMode = !State.darkMode;
            State.save();

            if (State.darkMode) {
                this.panel.classList.add('dark-mode');
                this.elements.darkModeBtn.textContent = '☀️';
            } else {
                this.panel.classList.remove('dark-mode');
                this.elements.darkModeBtn.textContent = '🌙';
            }
            console.log('[YT-TP] Dark mode:', State.darkMode);
        }

        showButtonFeedback(button, message, type = 'info', duration = 2000) {
            if (!button) return;

            // Store original state ONLY on first call (prevents capturing feedback styles)
            if (!button.dataset.originalText) {
                button.dataset.originalText = button.textContent;
                button.dataset.originalBackground = button.style.background || '';
                button.dataset.originalColor = button.style.color || '';
                button.dataset.originalBorderColor = button.style.borderColor || '';
            }

            // Clear any existing timeout
            if (button.dataset.timeoutId) {
                clearTimeout(parseInt(button.dataset.timeoutId));
                delete button.dataset.timeoutId;
            }

            // Set new state
            button.textContent = message;

            if (type === 'error') {
                button.style.background = '#ffebee';
                button.style.color = '#c62828';
                button.style.borderColor = '#c62828';
            } else if (type === 'success') {
                button.style.background = '#e8f5e9';
                button.style.color = '#2e7d32';
                button.style.borderColor = '#2e7d32';
            }
            // 'info' type: keep current styling (for "Loading..." states)

            // Revert after duration
            const timeoutId = setTimeout(() => {
                // Restore from stored originals
                button.textContent = button.dataset.originalText;
                button.style.background = button.dataset.originalBackground;
                button.style.color = button.dataset.originalColor;
                button.style.borderColor = button.dataset.originalBorderColor;

                // Clean up stored state so next feedback starts fresh
                delete button.dataset.originalText;
                delete button.dataset.originalBackground;
                delete button.dataset.originalColor;
                delete button.dataset.originalBorderColor;
                delete button.dataset.timeoutId;
            }, duration);

            button.dataset.timeoutId = timeoutId.toString();
        }

        updateProcessButton() {
            const hasApiKey = !!State.getApiKey();
            const hasModel = !!State.selectedModel && State.selectedModel !== '';
            this.elements.processBtn.disabled = !(hasApiKey && hasModel);
        }

        setOutput(text, isRtl = false) {
            this.elements.output.dir = isRtl ? 'rtl' : 'ltr';

            if (typeof marked !== 'undefined') {
                try {
                    const htmlString = marked.parse(text);

                    // Use Trusted Types policy if available
                    if (trustedTypesPolicy) {
                        this.elements.output.innerHTML = trustedTypesPolicy.createHTML(htmlString);
                    } else {
                        this.elements.output.innerHTML = htmlString;
                    }
                } catch (e) {
                    console.warn('[YT-TP] Failed to parse markdown:', e);
                    this.elements.output.textContent = text;
                }
            } else {
                console.warn('[YT-TP] Marked.js not loaded, displaying raw text');
                this.elements.output.textContent = text;
            }

            // Auto-switch to Output tab first (this sets min-height)
            this.switchTab('output');

            // Force recalculate height to fit content, clamped to window bottom
            // 1. Reset to auto to measure content
            this.panel.style.height = 'auto';

            // 2. Check if it fits
            const rect = this.panel.getBoundingClientRect();
            const maxH = window.innerHeight - rect.top;

            if (rect.height > maxH) {
                // Constraint hit
                this.panel.style.height = maxH + 'px';
            } else {
                // Fits fine, leave as auto? Or lock it?
                // User said "height ... independent", if we leave it auto it might shrink if we change width?
                // Better to lock it to the computed value so it stays stable
                this.panel.style.height = rect.height + 'px';
            }

            this.lastOutputHeight = this.panel.style.height; // Save this new auto-height
        }

        // ==================== Actions ====================

        saveApiKey() {
            const btn = document.getElementById('yttp-save-key');
            const key = this.elements.apiKey.value.trim();
            if (!key) {
                this.showButtonFeedback(btn, 'Enter key first', 'error');
                return;
            }
            State.setApiKey(key);
            this.showButtonFeedback(btn, 'Saved!', 'success');
        }

        async fetchModels() {
            const btn = document.getElementById('yttp-fetch-models');
            const apiKey = State.getApiKey();
            if (!apiKey) {
                this.showButtonFeedback(btn, 'Save API key first', 'error');
                return;
            }

            this.elements.modelStatus.textContent = 'Loading...';
            this.elements.modelStatus.style.color = '#666';

            try {
                const models = await GeminiService.fetchModels(apiKey);

                this.elements.model.replaceChildren();
                models.forEach(m => {
                    const opt = document.createElement('option');
                    opt.value = m.id;
                    opt.textContent = `${m.name} (${m.shortId})`;
                    this.elements.model.appendChild(opt);
                });
                this.elements.model.disabled = false;

                // Select saved model or find a flash model
                const savedModel = models.find(m => m.id === State.selectedModel);
                const flashModel = models.find(m => m.shortId.includes('flash'));
                const toSelect = savedModel || flashModel || models[0];

                if (toSelect) {
                    this.elements.model.value = toSelect.id;
                    State.selectedModel = toSelect.id;
                    State.save();
                }

                this.updateProcessButton();
                this.elements.modelStatus.textContent = `Loaded ${models.length} models`;
                this.elements.modelStatus.style.color = '#2e7d32'; // Success green

                // Clear success message after 3 seconds
                setTimeout(() => {
                    this.elements.modelStatus.textContent = '';
                }, 3000);

            } catch (e) {
                this.elements.modelStatus.textContent = 'Error loading models';
                this.elements.modelStatus.style.color = '#c62828'; // Error red
                console.error('[YT-TP] fetchModels error:', e);
                this.showButtonFeedback(btn, 'Error', 'error');
            }
        }

        async copyTranscriptText() {
            const btn = document.getElementById('yttp-copy-text');
            this.showButtonFeedback(btn, '...', 'info', 10000);

            try {
                const data = await TranscriptService.fetch();
                await navigator.clipboard.writeText(data.text);

                // Update language display
                if (data.languageName && data.languageName !== 'Unknown') {
                    this.updateLanguageSpan(data.languageName);
                }

                this.showButtonFeedback(btn, '✓', 'success');
            } catch (e) {
                this.showButtonFeedback(btn, '✗', 'error', 3000);
                console.error('[YT-TP] copyTranscriptText error:', e);
            }
        }

        async downloadTXT() {
            const btn = document.getElementById('yttp-download-txt');
            this.showButtonFeedback(btn, '...', 'info', 10000);

            try {
                const data = await TranscriptService.fetch();

                if (!data.text) {
                    this.showButtonFeedback(btn, 'No text', 'error', 3000);
                    return;
                }

                const langSuffix = data.languageCode && data.languageCode !== 'unknown'
                    ? `_${data.languageCode}` : '';
                this.downloadFile(data.text, this.getVideoTitle() + langSuffix + '.txt', 'text/plain');
                this.showButtonFeedback(btn, '✓', 'success');
            } catch (e) {
                this.showButtonFeedback(btn, '✗', 'error', 3000);
                console.error('[YT-TP] downloadTXT error:', e);
            }
        }

        async downloadSRT() {
            const btn = document.getElementById('yttp-download-srt');
            this.showButtonFeedback(btn, '...', 'info', 10000);

            try {
                const data = await TranscriptService.fetch();

                if (!data.segments?.length) {
                    this.showButtonFeedback(btn, 'No timestamps', 'error', 3000);
                    return;
                }

                const srt = TranscriptService.segmentsToSRT(data.segments);
                const langSuffix = data.languageCode && data.languageCode !== 'unknown'
                    ? `_${data.languageCode}` : '';
                this.downloadFile(srt, this.getVideoTitle() + langSuffix + '.srt', 'text/plain');
                this.showButtonFeedback(btn, '✓', 'success');
            } catch (e) {
                this.showButtonFeedback(btn, '✗', 'error', 3000);
                console.error('[YT-TP] downloadSRT error:', e);
            }
        }

        async downloadJSON() {
            const btn = document.getElementById('yttp-download-json');
            this.showButtonFeedback(btn, '...', 'info', 10000);

            try {
                const data = await TranscriptService.fetch();

                const output = {
                    videoTitle: this.getVideoTitle(),
                    videoUrl: window.location.href,
                    language: data.languageName || 'Unknown',
                    languageCode: data.languageCode || 'unknown',
                    isAutoGenerated: data.isAutoGenerated || false,
                    source: data.source,
                    fetchedAt: new Date().toISOString(),
                    segmentCount: data.segments?.length || 0,
                    segments: data.segments?.length > 0 ? data.segments : undefined,
                    text: data.text || ''
                };

                const langSuffix = data.languageCode && data.languageCode !== 'unknown'
                    ? `_${data.languageCode}` : '';
                this.downloadFile(
                    JSON.stringify(output, null, 2),
                    this.getVideoTitle() + langSuffix + '_transcript.json',
                    'application/json'
                );
                this.showButtonFeedback(btn, '✓', 'success');
            } catch (e) {
                this.showButtonFeedback(btn, '✗', 'error', 3000);
                console.error('[YT-TP] downloadJSON error:', e);
            }
        }

        async openLanguageSelector() {
            const btn = document.getElementById('yttp-select-language');

            try {
                this.showButtonFeedback(btn, 'Opening panel...', 'info', 5000);

                // Step 1: Open YouTube's transcript panel using the same logic as fetchFromPanel
                const threeDotsButton = document.querySelector('button#button.style-scope.ytd-menu-renderer[aria-label="More actions"], button.ytp-button[title="Settings"], button[aria-label*="More actions" i][aria-haspopup="true"]');

                if (threeDotsButton) {
                    threeDotsButton.click();
                    await new Promise(resolve => setTimeout(resolve, 600));
                }

                let transcriptButton = Array.from(document.querySelectorAll('yt-formatted-string, ytd-menu-service-item-renderer, tp-yt-paper-item, div.ytp-menuitem-label'))
                    .find(el => {
                        const text = el.textContent?.trim().toLowerCase();
                        return text === 'show transcript' || text === 'показать расшифровку видео' || text === 'расшифровка' || text === 'transkript anzeigen' || text === 'mostrar transcripción';
                    });

                if (transcriptButton) {
                    if (transcriptButton.closest('ytd-menu-popup-renderer') || transcriptButton.closest('.ytp-popup') || transcriptButton.closest('tp-yt-paper-listbox')) {
                        transcriptButton.click();
                    } else {
                        if (transcriptButton.offsetParent !== null) transcriptButton.click();
                    }
                } else {
                    const directTranscriptButton = document.querySelector('#description-inline-expander ytd-structured-description-content-renderer [aria-label*="transcript"], #description ytd-text-inline-expander [aria-label*="transcript"]');
                    if (directTranscriptButton) {
                        directTranscriptButton.click();
                    }
                }

                // Wait for panel to open
                await new Promise(resolve => setTimeout(resolve, 1500));

                // Step 2: Find and click the language dropdown in the transcript panel
                const transcriptPanel = document.querySelector("ytd-engagement-panel-section-list-renderer[target-id='engagement-panel-searchable-transcript']");

                if (transcriptPanel) {
                    // Find the language dropdown button in the footer
                    const languageButton = transcriptPanel.querySelector('ytd-transcript-footer-renderer yt-dropdown-menu tp-yt-paper-button');

                    if (languageButton && languageButton.offsetParent !== null) {
                        languageButton.click();
                        this.showButtonFeedback(btn, 'Select in YouTube Transcript Panel', 'success', 5000);
                    } else {
                        this.showButtonFeedback(btn, 'Select in YouTube Transcript Panel', 'success', 5000);
                    }
                } else {
                    this.showButtonFeedback(btn, 'Panel opened', 'success');
                }

            } catch (e) {
                this.showButtonFeedback(btn, 'Error opening', 'error');
                console.error('[YT-TP] openLanguageSelector error:', e);
            }
        }

        async processWithAI() {
            const btn = this.elements.processBtn;
            const apiKey = State.getApiKey();
            const modelId = State.selectedModel;

            if (!apiKey || !modelId) {
                this.showButtonFeedback(btn, 'Configure API & Model first', 'error');
                return;
            }

            btn.disabled = true;
            this.showButtonFeedback(btn, 'Fetching transcript...', 'info', 10000);

            try {
                const data = await TranscriptService.fetch();
                this.showButtonFeedback(btn, 'Processing...', 'info', 20000);

                const result = await GeminiService.process(
                    apiKey,
                    modelId,
                    State.prompt,
                    data.text
                );

                this.setOutput(result);
                this.showButtonFeedback(btn, 'Processing complete!', 'success');

            } catch (e) {
                this.showButtonFeedback(btn, 'Error: ' + e.message, 'error', 5000);
                console.error('[YT-TP] processWithAI error:', e);
            } finally {
                btn.disabled = false;
                this.updateProcessButton();
            }
        }

        async copyOutput() {
            const btn = document.getElementById('yttp-copy-output');
            if (!State.lastOutput) {
                this.showButtonFeedback(btn, 'No output!', 'error');
                return;
            }
            try {
                await navigator.clipboard.writeText(State.lastOutput);
                this.showButtonFeedback(btn, 'Copied!', 'success');
            } catch (e) {
                this.showButtonFeedback(btn, 'Failed', 'error');
            }
        }

        downloadOutput() {
            const btn = document.getElementById('yttp-download-output');
            if (!State.lastOutput) {
                this.showButtonFeedback(btn, 'No output!', 'error');
                return;
            }
            this.downloadFile(State.lastOutput, this.getVideoTitle() + '_summary.md', 'text/markdown');
            this.showButtonFeedback(btn, 'Downloaded!', 'success');
        }



        // ==================== Utilities ====================

        getVideoTitle() {
            return document.title
                .replace(/ - YouTube$/, '')
                .replace(/[<>:"/\\|?*]/g, '_')
                .substring(0, 100)
                .trim() || 'transcript';
        }

        downloadFile(content, filename, mimeType) {
            const blob = new Blob([content], { type: mimeType });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    }

    // ============================================================
    // SECTION 7: URL CHANGE DETECTION (SPA Navigation)
    // ============================================================
    function setupNavigationListener(ui) {
        let lastUrl = PageUtils.getCurrentUrl();

        // Check for URL changes (YouTube is a SPA)
        const urlObserver = new MutationObserver(() => {
            const currentUrl = PageUtils.getCurrentUrl();

            if (currentUrl !== lastUrl) {
                lastUrl = currentUrl;
                console.log('[YT-TP] Navigation detected:', currentUrl);

                // Update button/panel visibility based on new page
                ui.updateVisibility();

                // Reset transcript data for new video
                State.lastTranscript = null;
            }
        });

        urlObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // ============================================================
    // SECTION 8: INITIALIZATION
    // ============================================================
    function initialize() {
        // Prevent duplicate initialization
        if (document.getElementById('yttp-toggle-btn')) {
            console.log('[YT-TP] Already initialized, skipping');
            return;
        }

        const ui = new UI();
        ui.init();

        // Set up SPA navigation listener
        setupNavigationListener(ui);

        // Auto-fetch models if API key exists and on watch page
        if (State.getApiKey() && PageUtils.isWatchPage()) {
            setTimeout(() => {
                ui.fetchModels().catch(e => {
                    console.log('[YT-TP] Auto-fetch models skipped:', e.message);
                });
            }, 1000);
        }
    }

    // Wait for document to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

})();