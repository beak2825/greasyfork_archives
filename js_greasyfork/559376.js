// ==UserScript==
// @name         Claude/Grok/Arena | Conversation/Chat Markdown Export/Download
// @namespace    https://greasyfork.org/en/users/1462137-piknockyou
// @version      10.1
// @author       Piknockyou (vibe-coded)
// @license      AGPL-3.0
// @description  Export AI chat conversations to Markdown. Supports Claude.ai, Grok.com, and Arena.ai
// @match        *://claude.ai/*
// @match        *://grok.com/*
// @match        *://lmarena.ai/*
// @match        *://arena.ai/*
// @icon         data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23fff' stroke-width='2'><path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4'/><polyline points='7 10 12 15 17 10'/><line x1='12' y1='15' x2='12' y2='3'/></svg>
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @connect      claude.ai
// @connect      grok.com
// @connect      arena.ai
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/559376/ClaudeGrokArena%20%7C%20ConversationChat%20Markdown%20ExportDownload.user.js
// @updateURL https://update.greasyfork.org/scripts/559376/ClaudeGrokArena%20%7C%20ConversationChat%20Markdown%20ExportDownload.meta.js
// ==/UserScript==

// ═══════════════════════════════════════════════════════════════════════
// CHANGELOG
// ═══════════════════════════════════════════════════════════════════════
//
// v10.1
// - LMArena renamed to Arena

(function() {
    'use strict';

    // ═══════════════════════════════════════════════════════════════════════════
    // CONFIGURATION & PROVIDER REFERENCE
    // ═══════════════════════════════════════════════════════════════════════════
    //
    // This is the single source of truth for:
    //   1. All configuration flags and their default values
    //   2. Provider support matrix (which flags apply to which provider)
    //   3. Provider-specific behavior notes
    //   4. Guide for adding new providers
    //
    // ───────────────────────────────────────────────────────────────────────────
    // PROVIDER SUPPORT MATRIX
    // ───────────────────────────────────────────────────────────────────────────
    //
    // Legend:  C = Claude    G = Grok    L = Arena
    //          ✓ = Supported            · = Not applicable / No effect
    //
    // MESSAGE CONTENT                              C   G   L   Notes
    // ─────────────────────────────────────────────────────────────────
    // INCLUDE_USER_MESSAGES                        ✓   ✓   ✓
    // INCLUDE_ASSISTANT_MESSAGES                   ✓   ✓   ✓
    // INCLUDE_THINKING                             ✓   ·   ✓   [1]
    // COLLAPSIBLE_THINKING                         ✓   ·   ✓
    // INCLUDE_ATTACHMENTS                          ✓   ✓   ·
    // COLLAPSIBLE_ATTACHMENTS                      ✓   ✓   ·
    // INCLUDE_ARTIFACTS                            ✓   ·   ·
    // COLLAPSIBLE_ARTIFACTS                        ✓   ·   ·
    // INCLUDE_CODE_BLOCKS                          ✓   ✓   ✓
    // COLLAPSIBLE_CODE_BLOCKS                      ✓   ✓   ✓
    //
    // WEB SEARCH                                   C   G   L   Notes
    // ─────────────────────────────────────────────────────────────────
    // INCLUDE_SEARCH_QUERIES                       ✓   ·   ·   [2]
    // INCLUDE_SEARCH_RESULTS                       ✓   ·   ·   [2]
    // COLLAPSIBLE_SEARCH_RESULTS                   ✓   ·   ·
    // INCLUDE_SOURCES                              ✓   ·   ✓   [3]
    // INCLUDE_SOURCES_LIST                         ✓   ✓   ✓
    // COLLAPSIBLE_SOURCES_LIST                     ✓   ✓   ✓
    //
    // METADATA                                     C   G   L   Notes
    // ─────────────────────────────────────────────────────────────────
    // INCLUDE_MODEL_INFO                           ·   ✓   ✓   [4]
    // INCLUDE_THINKING_DURATION                    ·   ✓   ·
    // INCLUDE_TIMESTAMPS                           ✓   ✓   ✓
    // INCLUDE_MESSAGE_IDS                          ✓   ✓   ✓
    //
    // HEADER & FORMATTING                          C   G   L   Notes
    // ─────────────────────────────────────────────────────────────────
    // INCLUDE_HEADER                               ✓   ✓   ✓
    // INCLUDE_ACTIVE_LEAF_INFO                     ✓   ✓   ·   [5]
    // INCLUDE_TURN_NUMBERS                         ✓   ✓   ✓
    // COLLAPSIBLE_MESSAGES                         ✓   ✓   ✓
    //
    // BRANCHING                                    C   G   L   Notes
    // ─────────────────────────────────────────────────────────────────
    // CLAUDE_EXPORT_ALL_REGENERATIONS              ✓   ·   ·
    // GROK_EXPORT_ALL_REGENERATIONS                ·   ✓   ·
    //
    // ───────────────────────────────────────────────────────────────────────────
    // PROVIDER-SPECIFIC BEHAVIOR NOTES
    // ───────────────────────────────────────────────────────────────────────────
    //
    // [1] THINKING
    //     Claude:  "thinking" content blocks in API response
    //     Arena: "reasoning" field on assistant messages
    //     Grok:    No thinking content; use INCLUDE_THINKING_DURATION instead
    //
    // [2] SEARCH QUERIES & RESULTS (Claude only)
    //     Queries: tool_use blocks with name="web_search"
    //     Results: tool_result blocks containing fetched URLs
    //     These appear BEFORE the answer text in execution order
    //
    // [3] INLINE CITATIONS (INCLUDE_SOURCES)
    //     Claude:  [[Title]](url) superscripts at end_index positions
    //     Arena: [1], [2], [3] numeric superscripts at charLocation positions
    //     Grok:    No position data; inline citations not possible (list only)
    //
    // [4] MODEL INFO
    //     Claude:  Model name not reliably exposed in API
    //     Grok:    Available in response.model field
    //     Arena: Scraped from DOM (API only provides UUIDs)
    //              - Direct mode: Sequential assistant index mapping
    //              - Battle mode: participantPosition 'a'/'b' mapping
    //              - DOM uses flex-col-reverse; reversed for direct mode
    //
    // [5] ACTIVE LEAF INFO
    //     Claude:  current_leaf_message_uuid (conversation tree position)
    //     Grok:    Active rid from URL parameter (?rid=...)
    //     Arena: Linear conversation structure, no branching concept
    //
    // ───────────────────────────────────────────────────────────────────────────
    // ADDING A NEW PROVIDER — CHECKLIST
    // ───────────────────────────────────────────────────────────────────────────
    //
    // When implementing a new provider, complete ALL of the following steps:
    //
    // NOTE: First-run Onboarding Banner
    //   The script shows a one-time onboarding banner (dismissible) explaining:
    //     - Left-click export
    //     - Right-click settings
    //     - Right-drag move
    //     - Supported providers
    //
    //   Implementation is centralized in `OnboardingBanner`:
    //     - Declarative content in OnboardingBanner.CONTENT (single source of truth)
    //     - Styles injected once (idempotent) with OnboardingBanner.STYLES_ID
    //     - Provider icons loaded via FaviconLoader (CSP-safe) from CONTENT.providers
    //     - Dismissal uses CONFIG.HINT_DISMISSED_KEY (stored in localStorage)
    //
    //   When adding a new provider, update OnboardingBanner.CONTENT.providers array.
    //
    // STEP 1: GATHER INFORMATION
    //   □ Sample API/JSON response from the chat endpoint (DevTools → Network)
    //   □ Sample HTML of the chat page (if DOM scraping is needed)
    //   □ URL patterns for chat pages (e.g., /chat/{id}, /c/{id})
    //
    // STEP 2: IDENTIFY APPLICABLE FLAGS
    //   Review each CONFIG flag category and determine support:
    //   □ User/Assistant messages (almost always yes)
    //   □ Thinking/reasoning blocks (check for "reasoning", "thinking" fields)
    //   □ File attachments (uploaded files with content)
    //   □ Artifacts (code/content generation blocks)
    //   □ Web search (tool calls, search results, citations)
    //   □ Inline citations (requires position data like end_index, charLocation)
    //   □ Model info (in API response, or needs DOM scraping?)
    //   □ Timestamps, message IDs
    //   □ Branching/regenerations (conversation tree structure)
    //
    // STEP 3: UPDATE THIS FILE — CONFIG SECTION
    //   □ Update the PROVIDER SUPPORT MATRIX above (add column for new provider)
    //   □ Add any provider-specific flags (e.g., NEWPROVIDER_EXPORT_ALL_REGENS)
    //   □ Add behavior notes if the provider has unique handling
    //
    // STEP 4: UPDATE PROVIDER_FLAGS ARRAY
    //   □ Add new provider entry listing all applicable flag names
    //   □ Order flags logically (matches settings panel display order)
    //
    // STEP 5: UPDATE FLAG_METADATA
    //   □ Add provider-specific labels if wording differs (e.g., "Citations" vs "Sources")
    //   □ Add provider-specific tooltips explaining unique behavior
    //
    // STEP 6: IMPLEMENT PROVIDER MODULE
    //   Create provider object with required interface:
    //   □ name: string (display name, e.g., "NewProvider")
    //   □ hostPattern: RegExp (matches the site's domain)
    //   □ matches(url): boolean
    //   □ extractChatId(url): string | null
    //   □ fetchChat(chatId): Promise<object>
    //   □ generateMarkdown(data, settings): { content, filename, stats }
    //
    // STEP 7: REGISTER PROVIDER
    //   □ Add to Providers.list array
    //   □ Add @match directive to userscript header
    //
    // STEP 8: TEST
    //   □ Verify all applicable flags work correctly
    //   □ Test settings panel shows correct options
    //   □ Test export produces valid Markdown
    //
    // ═══════════════════════════════════════════════════════════════════════════

    const CONFIG = {
        // ─── Message Content ─────────────────────────────────────────────────
        INCLUDE_USER_MESSAGES: true,
        INCLUDE_ASSISTANT_MESSAGES: true,
        INCLUDE_THINKING: true,
        COLLAPSIBLE_THINKING: true,
        INCLUDE_ATTACHMENTS: true,
        COLLAPSIBLE_ATTACHMENTS: true,
        INCLUDE_ARTIFACTS: true,
        COLLAPSIBLE_ARTIFACTS: true,
        INCLUDE_CODE_BLOCKS: true,
        COLLAPSIBLE_CODE_BLOCKS: true,

        // ─── Web Search ──────────────────────────────────────────────────────
        INCLUDE_SEARCH_QUERIES: true,
        INCLUDE_SEARCH_RESULTS: false,        // Off by default (noisy raw data)
        COLLAPSIBLE_SEARCH_RESULTS: true,
        INCLUDE_SOURCES: true,                // Inline citation markers
        INCLUDE_SOURCES_LIST: true,           // Bibliography at end of message
        COLLAPSIBLE_SOURCES_LIST: true,

        // ─── Metadata ────────────────────────────────────────────────────────
        INCLUDE_MODEL_INFO: true,
        INCLUDE_THINKING_DURATION: false,
        INCLUDE_TIMESTAMPS: false,
        INCLUDE_MESSAGE_IDS: false,

        // ─── Header & Formatting ─────────────────────────────────────────────
        INCLUDE_HEADER: true,
        INCLUDE_ACTIVE_LEAF_INFO: true,
        INCLUDE_TURN_NUMBERS: true,
        COLLAPSIBLE_MESSAGES: false,

        // ─── Branching ───────────────────────────────────────────────────────
        CLAUDE_EXPORT_ALL_REGENERATIONS: false,
        GROK_EXPORT_ALL_REGENERATIONS: false,

        // ─── File Naming ─────────────────────────────────────────────────────
        FILENAME_MAX_LEN: 80,

        // ─── UI (Button) ─────────────────────────────────────────────────────
        BUTTON_SIZE: 50,
        BUTTON_COLOR_READY: '#22c55e',
        BUTTON_COLOR_LOADING: '#f59e0b',
        BUTTON_COLOR_ERROR: '#ef4444',
        Z_INDEX: 2147483647,
        POSITION_STORAGE_PREFIX: 'chat_export_pos_',
        SETTINGS_STORAGE_PREFIX: 'chat_export_config_',
        HINT_DISMISSED_KEY: 'chat_export_hint_dismissed',
        DEBUG: false
    };

    // Debug logging gate:
    // - When DEBUG is false, silence log/warn/info/debug (keep error enabled).
    // - This avoids noisy console output for normal users while preserving error visibility.
    const console = (() => {
        const real = (typeof window !== 'undefined' && window.console) ? window.console : null;
        const noop = () => {};
        if (!real) return { log: noop, warn: noop, info: noop, debug: noop, error: noop };
        if (CONFIG.DEBUG) return real;
        return {
            log: noop,
            warn: noop,
            info: noop,
            debug: noop,
            error: typeof real.error === 'function' ? real.error.bind(real) : noop
        };
    })();

    // ───────────────────────────────────────────────────────────────────────────
    // PROVIDER FLAG APPLICABILITY
    // ───────────────────────────────────────────────────────────────────────────
    // Maps CONFIG flags to providers for the settings panel UI.
    // Order determines display order in settings menu.
    // See PROVIDER SUPPORT MATRIX in CONFIG section for capability details.
    //
    const PROVIDER_FLAGS = {
        Claude: [
            'INCLUDE_USER_MESSAGES',
            'INCLUDE_ASSISTANT_MESSAGES',
            'INCLUDE_TURN_NUMBERS',
            'COLLAPSIBLE_MESSAGES',
            'INCLUDE_CODE_BLOCKS',
            'COLLAPSIBLE_CODE_BLOCKS',
            'INCLUDE_THINKING',
            'COLLAPSIBLE_THINKING',
            'INCLUDE_ATTACHMENTS',
            'COLLAPSIBLE_ATTACHMENTS',
            'INCLUDE_ARTIFACTS',
            'COLLAPSIBLE_ARTIFACTS',
            'INCLUDE_SEARCH_QUERIES',
            'INCLUDE_SEARCH_RESULTS',
            'COLLAPSIBLE_SEARCH_RESULTS',
            'INCLUDE_SOURCES',
            'INCLUDE_SOURCES_LIST',
            'COLLAPSIBLE_SOURCES_LIST',
            'INCLUDE_TIMESTAMPS',
            'INCLUDE_MESSAGE_IDS',
            'INCLUDE_HEADER',
            'INCLUDE_ACTIVE_LEAF_INFO',
            'CLAUDE_EXPORT_ALL_REGENERATIONS'
        ],
        Grok: [
            'INCLUDE_USER_MESSAGES',
            'INCLUDE_ASSISTANT_MESSAGES',
            'INCLUDE_TURN_NUMBERS',
            'COLLAPSIBLE_MESSAGES',
            'INCLUDE_CODE_BLOCKS',
            'COLLAPSIBLE_CODE_BLOCKS',
            'INCLUDE_ATTACHMENTS',
            'COLLAPSIBLE_ATTACHMENTS',
            'INCLUDE_SOURCES_LIST',
            'COLLAPSIBLE_SOURCES_LIST',
            'INCLUDE_MODEL_INFO',
            'INCLUDE_THINKING_DURATION',
            'INCLUDE_TIMESTAMPS',
            'INCLUDE_MESSAGE_IDS',
            'INCLUDE_HEADER',
            'INCLUDE_ACTIVE_LEAF_INFO',
            'GROK_EXPORT_ALL_REGENERATIONS'
        ],
        Arena: [
            'INCLUDE_USER_MESSAGES',
            'INCLUDE_ASSISTANT_MESSAGES',
            'INCLUDE_TURN_NUMBERS',
            'COLLAPSIBLE_MESSAGES',
            'INCLUDE_CODE_BLOCKS',
            'COLLAPSIBLE_CODE_BLOCKS',
            'INCLUDE_THINKING',
            'COLLAPSIBLE_THINKING',
            'INCLUDE_SOURCES',
            'INCLUDE_SOURCES_LIST',
            'COLLAPSIBLE_SOURCES_LIST',
            'INCLUDE_MODEL_INFO',
            'INCLUDE_TIMESTAMPS',
            'INCLUDE_MESSAGE_IDS',
            'INCLUDE_HEADER'
        ]
    };

    // Human-readable labels and grouping for settings UI
    const FLAG_METADATA = {
        // Group: Messages
        INCLUDE_USER_MESSAGES: { label: 'Include User Messages', group: 'Messages' },
        INCLUDE_ASSISTANT_MESSAGES: { label: 'Include Assistant Messages', group: 'Messages' },
        INCLUDE_TURN_NUMBERS: { label: 'Include Turn Numbers', group: 'Messages', tooltip: 'Add sequential numbers to message headers: [1] USER, [2] ASSISTANT, etc.' },
        COLLAPSIBLE_MESSAGES: { label: 'Collapsible Messages', group: 'Messages', tooltip: 'Wrap each message turn in a collapsible <details> section.' },

        // Group: Thinking
        INCLUDE_THINKING: { label: 'Include Thinking/Reasoning', group: 'Thinking' },
        COLLAPSIBLE_THINKING: { label: 'Collapsible Thinking', group: 'Thinking', indent: true },
        INCLUDE_THINKING_DURATION: { label: 'Show Thinking Duration', group: 'Thinking' },

        // Group: Attachments
        INCLUDE_ATTACHMENTS: { label: 'Include Attachments', group: 'Attachments' },
        COLLAPSIBLE_ATTACHMENTS: { label: 'Collapsible Attachments', group: 'Attachments', indent: true },

        // Group: Artifacts
        INCLUDE_ARTIFACTS: { label: 'Include Artifacts', group: 'Artifacts' },
        COLLAPSIBLE_ARTIFACTS: { label: 'Collapsible Artifacts', group: 'Artifacts', indent: true },

        // Group: Code
        INCLUDE_CODE_BLOCKS: { label: 'Include Code Blocks', group: 'Code' },
        COLLAPSIBLE_CODE_BLOCKS: { label: 'Collapsible Code Blocks', group: 'Code', indent: true },

        // Group: Web Search
        // Ordered by Execution Flow: Queries → Results → Inline → List
        INCLUDE_SEARCH_QUERIES: {
            label: 'Include Search Queries',
            group: 'Web Search',
            tooltip: 'Show the search terms Claude sent to the search engine.\nAppears as: 🔍 Searching: "query"'
        },
        INCLUDE_SEARCH_RESULTS: {
            label: 'Include Search Results',
            group: 'Web Search',
            tooltip: 'Show the raw list of URLs returned by the search engine.\nThis is the data Claude received before writing its answer.\n(Often noisy; disabled by default)'
        },
        COLLAPSIBLE_SEARCH_RESULTS: {
            label: 'Collapsible Search Results',
            group: 'Web Search',
            indent: true,
            tooltip: 'Wrap the raw search results in a collapsible <details> section.'
        },
        INCLUDE_SOURCES: {
            label: {
                Claude: 'Include Inline Citations',
                Arena: 'Include Inline Citations'
            },
            group: 'Web Search',
            tooltip: {
                Claude: 'Insert superscript citation markers into the message text.\nFormat: [[Title]](url) at each citation position.',
                Arena: 'Insert numbered superscript markers into the message text.\nFormat: [1], [2], etc. linking to the source URL.'
            }
        },
        INCLUDE_SOURCES_LIST: {
            label: 'Include Sources List',
            group: 'Web Search',
            tooltip: {
                Claude: 'Append a numbered bibliography at the end of the message.\nLists all cited sources for easy reference.',
                Arena: 'Append a numbered bibliography at the end of the message.\nLists all cited sources for easy reference.',
                Grok: 'Append the list of web sources at the end of the message.\n(Grok does not support inline citations.)'
            }
        },
        COLLAPSIBLE_SOURCES_LIST: {
            label: 'Collapsible Sources List',
            group: 'Web Search',
            indent: true,
            tooltip: 'Wrap the sources list in a collapsible <details> section.\nKeeps the export cleaner when there are many sources.'
        },

        // Group: Metadata
        INCLUDE_MODEL_INFO: { label: 'Show Model Names', group: 'Metadata' },
        INCLUDE_TIMESTAMPS: { label: 'Show Timestamps', group: 'Metadata' },
        INCLUDE_MESSAGE_IDS: { label: 'Show Message IDs', group: 'Metadata' },

        // Group: Header
        INCLUDE_HEADER: { label: 'Include Header', group: 'Header' },
        INCLUDE_ACTIVE_LEAF_INFO: { label: 'Show Active Leaf/Response ID', group: 'Header', indent: true },

        // Group: Branching
        CLAUDE_EXPORT_ALL_REGENERATIONS: {
            label: 'Export All Regenerations',
            group: 'Branching',
            tooltip: '• Enabled: export ALL messages chronologically, including regenerated responses\n• Disabled: export only the currently selected conversation path'
        },
        GROK_EXPORT_ALL_REGENERATIONS: {
            label: 'Export All Regenerations',
            group: 'Branching',
            tooltip: '• Enabled: export ALL responses chronologically, including regenerations\n• Disabled: export only the currently viewed response chain'
        }
    };

    // Group display order
    const FLAG_GROUP_ORDER = [
        'Messages', 'Code', 'Thinking', 'Attachments', 'Artifacts',
        'Web Search', 'Metadata', 'Header', 'Branching'
    ];

    // ═══════════════════════════════════════════════════════════════════════════
    // SETTINGS STORAGE (Per-Provider)
    // ═══════════════════════════════════════════════════════════════════════════
    const Settings = {
        /**
         * Load provider-specific settings and merge with base CONFIG.
         * @param {string} providerName - e.g., 'Claude', 'Grok', 'Arena'
         * @returns {object} - Merged settings object
         */
        load(providerName) {
            if (!providerName) {
                console.log('[Chat Exporter] Settings.load() called without provider, returning CONFIG');
                return { ...CONFIG };
            }

            try {
                const key = CONFIG.SETTINGS_STORAGE_PREFIX + providerName;
                const saved = GM_getValue(key, null);
                console.log('[Chat Exporter] Settings.load() for', providerName, '- raw storage:', saved);

                if (saved) {
                    const overrides = typeof saved === 'string' ? JSON.parse(saved) : saved;
                    const merged = { ...CONFIG, ...overrides };
                    console.log('[Chat Exporter] Settings.load() merged result - INCLUDE_USER_MESSAGES:', merged.INCLUDE_USER_MESSAGES, 'INCLUDE_ASSISTANT_MESSAGES:', merged.INCLUDE_ASSISTANT_MESSAGES);
                    return merged;
                }
            } catch (e) {
                console.warn('[Chat Exporter] Failed to load settings:', e);
            }

            console.log('[Chat Exporter] Settings.load() no overrides found, returning CONFIG defaults');
            return { ...CONFIG };
        },

        /**
         * Save provider-specific setting override.
         * @param {string} providerName
         * @param {string} flagName
         * @param {boolean} value
         */
        save(providerName, flagName, value) {
            if (!providerName) return;

            try {
                const key = CONFIG.SETTINGS_STORAGE_PREFIX + providerName;
                let overrides = {};

                const saved = GM_getValue(key, null);
                if (saved) {
                    overrides = typeof saved === 'string' ? JSON.parse(saved) : saved;
                }

                overrides[flagName] = value;
                GM_setValue(key, overrides);
                console.log('[Chat Exporter] Settings.save() -', flagName, '=', value, 'for', providerName);
                console.log('[Chat Exporter] Settings.save() - full overrides now:', overrides);
            } catch (e) {
                console.warn('[Chat Exporter] Failed to save settings:', e);
            }
        },

        /**
         * Get current effective value of a flag for a provider.
         * @param {string} providerName
         * @param {string} flagName
         * @returns {boolean}
         */
        get(providerName, flagName) {
            const settings = this.load(providerName);
            return settings[flagName];
        },

        /**
         * Reset all settings for a provider to defaults.
         * @param {string} providerName
         */
        reset(providerName) {
            if (!providerName) return;
            const key = CONFIG.SETTINGS_STORAGE_PREFIX + providerName;
            GM_deleteValue(key);
            console.log('[Chat Exporter] Settings.reset() - cleared all overrides for', providerName);
        }
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // UTILITY FUNCTIONS
    // ═══════════════════════════════════════════════════════════════════════════
    const Utils = {
        /**
         * Sanitize text for use in markdown (strips markdown special chars).
         * @param {string} s - Raw text
         * @param {string} fallback - Fallback if result is empty
         * @returns {string} - Sanitized text safe for markdown display
         */
        sanitize(s, fallback = 'Untitled') {
            if (!s) return fallback;
            return s.replace(/[\r\n]+/g, ' ')
                    .replace(/[#`*\[\]:\/\\?*|"<>;]/g, '')
                    .trim() || fallback;
        },

        /**
         * Sanitize for filename (applies sanitize + length limit + underscore spaces).
         * @param {string} s - Raw text
         * @param {string} fallback - Fallback if result is empty
         * @returns {string} - Safe filename (without extension)
         */
        sanitizeFilename(s, fallback = 'Export') {
            const clean = this.sanitize(s, fallback);
            return clean.substring(0, CONFIG.FILENAME_MAX_LEN).replace(/\s+/g, '_');
        },

        escapeHtml(s) {
            return String(s ?? '')
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
        },

        /**
         * Create a "safe" fenced code block that cannot be prematurely closed by
         * backticks inside the content (e.g. when a markdown file contains ```).
         * We choose a fence length of (max backtick run in content + 1).
         */
        makeCodeFence(content, lang = '') {
            const text = String(content ?? '').replace(/\r\n/g, '\n');
            const runs = text.match(/`+/g) || [];
            let maxRun = 0;
            for (const r of runs) {
                if (r.length > maxRun) maxRun = r.length;
            }

            const fenceLen = Math.max(3, maxRun + 1);
            const fence = '`'.repeat(fenceLen);
            const info = lang ? String(lang) : '';

            const body = text.endsWith('\n') ? text : (text + '\n');
            return `${fence}${info}\n${body}${fence}`;
        },

        /**
         * Format a thinking/reasoning block as markdown.
         * Used by Claude (thinking blocks) and Arena (reasoning field).
         * @param {string} thinking - Raw thinking/reasoning text
         * @returns {string} - Formatted markdown string
         */
        formatThinkingBlock(thinking, cfg = null) {
            if (!thinking) return '';
            const settings = cfg || CONFIG;

            const quoted = thinking.replace(/\n/g, '\n> ');

            if (settings.COLLAPSIBLE_THINKING) {
                return `<details>\n<summary><strong>💭 Thinking Process</strong></summary>\n\n> ${quoted}\n\n</details>\n\n`;
            } else {
                return `> **💭 Thinking:**\n> \n> ${quoted}\n\n`;
            }
        },

        /**
         * Process code blocks in text based on settings.
         * If INCLUDE_CODE_BLOCKS is false, removes all code blocks.
         * If COLLAPSIBLE_CODE_BLOCKS is true, wraps them in <details>.
         * Otherwise, leaves them as-is.
         * @param {string} text - Markdown text with code blocks
         * @param {object} cfg - Settings object
         * @returns {string} - Processed text
         */
        processCodeBlocks(text, cfg = null) {
            if (!text) return text;
            const settings = cfg || CONFIG;

            // If code blocks disabled, strip them entirely
            if (!settings.INCLUDE_CODE_BLOCKS) {
                return this.stripCodeBlocks(text);
            }

            // If not collapsible, return as-is
            if (!settings.COLLAPSIBLE_CODE_BLOCKS) {
                return text;
            }

            // Wrap in collapsible
            return this.wrapCodeBlocksCollapsible(text);
        },

        /**
         * Strip all fenced code blocks from text
         * @param {string} text - Markdown text with code blocks
         * @returns {string} - Text with code blocks removed
         */
        stripCodeBlocks(text) {
            if (!text) return text;

            const normalized = String(text).replace(/\r\n/g, '\n');
            const lines = normalized.split('\n');

            let out = [];
            let inFence = false;
            let fenceLen = 0;

            for (const line of lines) {
                const m = line.match(/^(`{3,})(.*)$/);
                if (m) {
                    const ticks = m[1];
                    if (!inFence) {
                        inFence = true;
                        fenceLen = ticks.length;
                    } else if (ticks.length >= fenceLen) {
                        inFence = false;
                        fenceLen = 0;
                    }
                    continue;
                }

                if (!inFence) {
                    out.push(line);
                }
            }

            return out.join('\n');
        },

        /**
         * Wrap code blocks (```...```) in collapsible <details> sections
         * @param {string} text - Markdown text with code blocks
         * @returns {string} - Text with code blocks wrapped in <details>
         */
        wrapCodeBlocksCollapsible(text) {
            if (!text) return text;

            const normalized = String(text).replace(/\r\n/g, '\n');

            // State machine to support BOTH:
            // - complete fenced blocks
            // - incomplete blocks (e.g., streaming/partial responses without a closing fence)
            // Also supports fences longer than 3 backticks (e.g. ````) and won't close early on ```
            const lines = normalized.split('\n');

            let out = [];
            let inFence = false;
            let fenceLen = 0;
            let fenceLang = '';
            let buf = [];

            const flushFence = (isTruncated) => {

                // Use first token only as fence info string (best practice for Markdown code fences)
                const safeLang = (fenceLang || '').trim().split(/\s+/)[0];
                const langLabel = safeLang ? ` (${safeLang})` : '';
                const lineCount = buf.length;

                const summary = `💻 Code Block${langLabel}${isTruncated ? ' — truncated' : ''} — ${lineCount} lines`;
                const fenced = this.makeCodeFence(buf.join('\n'), safeLang);

                out.push(
                    `<details>\n` +
                    `<summary><strong>${this.escapeHtml(summary)}</strong></summary>\n\n` +
                    `${fenced}\n\n` +
                    `</details>`
                );

                buf = [];
                fenceLen = 0;
                fenceLang = '';
            };

            for (const line of lines) {
                // Any fence of 3+ backticks at start of line
                const m = line.match(/^(`{3,})(.*)$/);
                if (m) {
                    const ticks = m[1];
                    const rest = (m[2] || '');

                    if (!inFence) {
                        // Opening fence
                        inFence = true;
                        fenceLen = ticks.length;
                        fenceLang = rest.trim();
                        buf = [];
                    } else {
                        // Closing fence: must be at least as long as opening fence
                        if (ticks.length >= fenceLen) {
                            inFence = false;
                            flushFence(false);
                        } else {
                            // Treat as content if it's a shorter fence inside a longer-fenced block
                            buf.push(line);
                        }
                    }
                    continue;
                }

                if (inFence) {
                    buf.push(line);
                } else {
                    out.push(line);
                }
            }

            // If message ended mid-fence (common with Grok partial responses), close it for export
            if (inFence) {
                flushFence(true);
            }

            return out.join('\n');
        }
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // PROVIDER: CLAUDE
    // ═══════════════════════════════════════════════════════════════════════════
    const ClaudeProvider = {
        name: 'Claude',
        hostPattern: /claude\.ai/,
        orgId: null,

        matches(url) {
            return this.hostPattern.test(url);
        },

        extractChatId(url) {
            const match = url.match(/\/chat\/([a-z0-9-]+)/);
            return match ? match[1] : null;
        },

        async getOrgId() {
            if (this.orgId) return this.orgId;
            const resp = await fetch('/api/organizations');
            if (!resp.ok) throw new Error('Failed to fetch Org ID');
            const orgs = await resp.json();
            if (orgs && orgs.length > 0) {
                this.orgId = orgs[0].uuid;
                return this.orgId;
            }
            throw new Error('No Organization found');
        },

        async fetchChat(chatId) {
            const orgId = await this.getOrgId();
            const url = `/api/organizations/${orgId}/chat_conversations/${chatId}?tree=True&rendering_mode=messages&render_all_tools=true&consistency=strong`;
            const resp = await fetch(url, {
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
            });
            if (!resp.ok) throw new Error(`API error: ${resp.status}`);
            return await resp.json();
        },

        generateMarkdown(data, settings = null) {
            // Use provider-specific settings if provided, otherwise fall back to CONFIG
            const cfg = settings || CONFIG;
            console.log('[Chat Exporter] ClaudeProvider.generateMarkdown() using cfg.INCLUDE_USER_MESSAGES:', cfg.INCLUDE_USER_MESSAGES, 'cfg.INCLUDE_ASSISTANT_MESSAGES:', cfg.INCLUDE_ASSISTANT_MESSAGES);

            const title = Utils.sanitize(data.name, 'Claude_Export');
            const activeLeaf = data?.current_leaf_message_uuid || null;

            let md = `# ${title}\n\n`;

            if (cfg.INCLUDE_HEADER) {
                md += `> **Provider:** Claude  \n`;
                md += `> **Date:** ${new Date().toLocaleString()}  \n`;
                md += `> **Source:** [Claude.ai](${location.href})  \n`;
                if (cfg.INCLUDE_ACTIVE_LEAF_INFO && activeLeaf) {
                    md += `> **Active leaf:** \`${activeLeaf}\`  \n`;
                }
                md += `\n---\n\n`;
            }

            if (!data.chat_messages) return { content: md, filename: 'empty.md', stats: { total: 0, exported: 0 } };

            // Claude conversations are a tree. Regenerations create siblings (same parent_message_uuid).
            // To export ONLY the currently selected path, walk parents from current_leaf_message_uuid.
            const ROOT_PARENT_UUID = '00000000-0000-4000-8000-000000000000';

            const byId = new Map();
            data.chat_messages.forEach(m => {
                if (m?.uuid) byId.set(m.uuid, m);
            });

            let messagesToExport = data.chat_messages;

            if (cfg.CLAUDE_EXPORT_ALL_REGENERATIONS) {
                // Export the full conversation history in chronological order.
                // This includes regenerated assistant replies (siblings) under the same parent.
                messagesToExport = (data.chat_messages || []).slice().sort((a, b) => {
                    const timeOrIndex = (m) => {
                        const t = m?.created_at ? new Date(m.created_at).getTime() : NaN;
                        if (Number.isFinite(t)) return t;
                        return (typeof m?.index === 'number') ? m.index : 0;
                    };

                    const ta = timeOrIndex(a);
                    const tb = timeOrIndex(b);
                    if (ta !== tb) return ta - tb;

                    const ia = (typeof a?.index === 'number') ? a.index : 0;
                    const ib = (typeof b?.index === 'number') ? b.index : 0;
                    if (ia !== ib) return ia - ib;

                    const ua = String(a?.uuid || '');
                    const ub = String(b?.uuid || '');
                    return ua.localeCompare(ub);
                });
            } else if (activeLeaf && byId.has(activeLeaf)) {
                const chain = [];
                const seen = new Set();
                let cur = byId.get(activeLeaf);

                while (cur && cur.uuid && !seen.has(cur.uuid)) {
                    seen.add(cur.uuid);
                    chain.push(cur);

                    const parentId = cur.parent_message_uuid;
                    if (!parentId || parentId === ROOT_PARENT_UUID) break;

                    cur = byId.get(parentId);
                    if (!cur) break;
                }

                chain.reverse();

                // Only use the chain if it looks sane (at least 1 message).
                if (chain.length > 0) {
                    messagesToExport = chain;
                }
            }

            // Track artifact state across the exported path so we can reconstruct "update" versions.
            // Key: artifact input.id, Value: { content, language, title, type }
            const artifactStateById = new Map();

            let turnNumber = 0;
            let exportedCount = 0;

            messagesToExport.forEach((msg) => {
                const isHuman = msg.sender === 'human';
                const role = isHuman ? 'USER' : 'CLAUDE';

                // Skip based on config
                if (isHuman && !cfg.INCLUDE_USER_MESSAGES) return;
                if (!isHuman && !cfg.INCLUDE_ASSISTANT_MESSAGES) return;

                turnNumber++;
                exportedCount++;

                // Build header with optional turn number
                let header = role;
                if (cfg.INCLUDE_TURN_NUMBERS) {
                    header = `[${turnNumber}] ${header}`;
                }

                if (cfg.COLLAPSIBLE_MESSAGES) {
                    md += `<details>\n<summary><strong>${header}</strong></summary>\n\n`;
                } else {
                    md += `## ${header}\n\n`;
                }

                // Optional: show timestamp
                if (cfg.INCLUDE_TIMESTAMPS && msg.created_at) {
                    md += `*${new Date(msg.created_at).toLocaleString()}*\n\n`;
                }

                // Optional: show message ID
                if (cfg.INCLUDE_MESSAGE_IDS && msg.uuid) {
                    md += `\`ID: ${msg.uuid}\`\n\n`;
                }

                // 1) Attachments (Files uploaded by user)
                // IMPORTANT: attachments can contain markdown with ``` fences and <details> tags.
                // To prevent breaking the outer export structure, we always wrap attachment content
                // in a "safe" fenced code block with a longer backtick fence.
                if (cfg.INCLUDE_ATTACHMENTS && msg.attachments?.length > 0) {
                    msg.attachments.forEach(att => {
                        if (att.extracted_content) {
                            const name = att.file_name || 'unnamed';
                            const raw = String(att.extracted_content ?? '').replace(/\r\n/g, '\n');

                            const lower = String(name).toLowerCase();
                            let lang = '';
                            if (lower.endsWith('.md') || lower.endsWith('.markdown')) lang = 'markdown';
                            else if (lower.endsWith('.txt')) lang = '';
                            else if (lower.endsWith('.ps1')) lang = 'powershell';
                            else if (lower.endsWith('.json')) lang = 'json';
                            else if (lower.endsWith('.yml') || lower.endsWith('.yaml')) lang = 'yaml';
                            else if (lower.endsWith('.js')) lang = 'javascript';
                            else if (lower.endsWith('.ts')) lang = 'typescript';
                            else if (lower.endsWith('.py')) lang = 'python';
                            else if (lower.endsWith('.bat') || lower.endsWith('.cmd')) lang = 'batch';

                            const fenced = Utils.makeCodeFence(raw, lang);

                            if (cfg.COLLAPSIBLE_ATTACHMENTS) {
                                md += `<details>\n<summary><strong>📎 Attached File: ${Utils.escapeHtml(name)}</strong></summary>\n\n${fenced}\n\n</details>\n\n`;
                            } else {
                                md += `**📎 Attached File: ${name}**\n\n${fenced}\n\n`;
                            }
                        }
                    });
                }

                // 2) Content array (Thinking, Text, Artifacts, Web search tool results)
                if (msg.content && Array.isArray(msg.content)) {
                    msg.content.forEach(block => {
                        if (block.type === 'text') {
                            let text = block.text || '';
                            let citations = [];

                            // Collect citations from this text block
                            if (block.citations?.length) {
                                const sortedCitations = [...block.citations]
                                    .filter(c => typeof c.end_index === 'number' && c.url)
                                    .sort((a, b) => b.end_index - a.end_index);

                                sortedCitations.forEach(c => {
                                    citations.unshift({
                                        title: c.title || c.url,
                                        url: c.url,
                                        source: c.metadata?.site_name || c.metadata?.site_domain || '',
                                        end_index: c.end_index
                                    });
                                });

                                // Insert inline citation markers (if enabled)
                                if (cfg.INCLUDE_SOURCES) {
                                    // Insert from end to start to preserve positions
                                    sortedCitations.forEach(c => {
                                        const pos = Math.min(c.end_index, text.length);
                                        const linkTitle = (c.title || 'source').replace(/\n/g, ' ').substring(0, 30);
                                        text = text.slice(0, pos) + `<sup>[[${linkTitle}](${c.url})]</sup>` + text.slice(pos);
                                    });
                                }
                            }

                            // Process code blocks based on settings
                            text = Utils.processCodeBlocks(text, cfg);

                            md += `${text}\n\n`;

                            // Add sources list section after this text block (if enabled)
                            if (cfg.INCLUDE_SOURCES_LIST && citations.length) {
                                if (cfg.COLLAPSIBLE_SOURCES_LIST) {
                                    md += `<details>\n<summary><strong>📚 Sources (${citations.length})</strong></summary>\n\n`;
                                    citations.forEach((c, idx) => {
                                        const t = (c.title || c.url).replace(/\n/g, ' ').trim();
                                        const s = c.source ? ` — ${c.source}` : '';
                                        md += `${idx + 1}. [${t}](${c.url})${s}\n`;
                                    });
                                    md += `\n</details>\n\n`;
                                } else {
                                    md += `**📚 Sources (${citations.length}):**\n\n`;
                                    citations.forEach((c, idx) => {
                                        const t = (c.title || c.url).replace(/\n/g, ' ').trim();
                                        const s = c.source ? ` — ${c.source}` : '';
                                        md += `${idx + 1}. [${t}](${c.url})${s}\n`;
                                    });
                                    md += `\n`;
                                }
                            }
                        }
                        else if (block.type === 'thinking' && cfg.INCLUDE_THINKING) {
                            md += Utils.formatThinkingBlock(block.thinking, cfg);
                        }
                        else if (block.type === 'tool_result' && block.name === 'web_search' && cfg.INCLUDE_SEARCH_RESULTS) {
                            // Web search results in block.content[] with { type: "knowledge", title, url, metadata }
                            const items = Array.isArray(block.content) ? block.content : [];
                            const searchResults = items.filter(it => it && it.url);

                            if (searchResults.length) {
                                if (cfg.COLLAPSIBLE_SEARCH_RESULTS) {
                                    md += `<details>\n<summary><strong>🔍 Search Results (${searchResults.length})</strong></summary>\n\n`;
                                    searchResults.forEach((it, idx) => {
                                        const title = (it.title || it.url || '').replace(/\n/g, ' ').trim();
                                        const source = it.metadata?.site_name || it.metadata?.site_domain || '';
                                        md += `${idx + 1}. [${title}](${it.url})${source ? ` — ${source}` : ''}\n`;
                                    });
                                    md += `\n</details>\n\n`;
                                } else {
                                    md += `**🔍 Search Results (${searchResults.length}):**\n\n`;
                                    searchResults.forEach((it, idx) => {
                                        const title = (it.title || it.url || '').replace(/\n/g, ' ').trim();
                                        const source = it.metadata?.site_name || it.metadata?.site_domain || '';
                                        md += `${idx + 1}. [${title}](${it.url})${source ? ` — ${source}` : ''}\n`;
                                    });
                                    md += `\n`;
                                }
                            }
                        }
                        else if (block.type === 'tool_use' && block.name === 'web_search' && cfg.INCLUDE_SEARCH_QUERIES) {
                            // Show the query
                            const q = block.input?.query;
                            if (q) {
                                md += `🔍 *Searching:* \`${q}\`\n\n`;
                            }
                        }
                        else if (block.type === 'tool_use' && block.name === 'artifacts' && cfg.INCLUDE_ARTIFACTS) {
                            const input = block.input || {};
                            const artId = input.id || 'artifact';
                            const command = input.command || '';
                            const version = input.version_uuid ? ` (${input.version_uuid.slice(0, 8)}...)` : '';

                            const normalizeNL = (s) => (typeof s === 'string' ? s.replace(/\r\n/g, '\n') : '');

                            // Get previous state for this artifact (if any)
                            const prevState = artifactStateById.get(artId) || { content: null, language: '', title: artId, type: '' };

                            // Current block may override title/language/type, or we inherit from previous
                            const artTitle = input.title || prevState.title || artId;
                            const artLang = input.language || prevState.language || '';
                            const artType = input.type || prevState.type || '';

                            let resolvedContent = '';
                            let resolvedLabel = '';

                            if (command === 'create' || command === 'rewrite') {
                                resolvedContent = normalizeNL(input.content || '');
                                resolvedLabel = command;
                            }
                            else if (command === 'update') {
                                const oldStr = normalizeNL(input.old_str || '');
                                const newStr = normalizeNL(input.new_str || '');
                                const currentContent = prevState.content ? normalizeNL(prevState.content) : null;

                                if (currentContent && oldStr && currentContent.includes(oldStr)) {
                                    resolvedContent = currentContent.replace(oldStr, newStr);
                                    resolvedLabel = 'update (reconstructed)';
                                } else {
                                    // Could not reconstruct; export the patch so it's not lost
                                    resolvedContent = `<<<<<<< OLD\n${oldStr}\n=======\n${newStr}\n>>>>>>> NEW`;
                                    resolvedLabel = 'update (patch only)';
                                }
                            }
                            else {
                                // Unknown artifact command; best-effort export
                                resolvedContent = normalizeNL(input.content || '');
                                resolvedLabel = command || 'artifact';
                            }

                            // Update stored state for this artifact ID
                            artifactStateById.set(artId, {
                                content: resolvedContent,
                                language: artLang,
                                title: artTitle,
                                type: artType
                            });

                            // Determine fence language: use stored/inherited language, fallback to 'diff' for patch-only
                            const fenceLang = (resolvedLabel.includes('patch')) ? 'diff' : artLang;
                            const headerSuffix = resolvedLabel ? ` — ${resolvedLabel}${version}` : version;
                            const codeBlock = Utils.makeCodeFence(resolvedContent, fenceLang);

                            if (cfg.COLLAPSIBLE_ARTIFACTS) {
                                // No ### for collapsible - it's inside <summary>
                                const artifactSummary = `📄 Artifact: ${artTitle}${headerSuffix}`;
                                md += `<details>\n<summary><strong>${artifactSummary}</strong></summary>\n\n${codeBlock}\n\n</details>\n\n`;
                            } else {
                                // Use ### header for non-collapsible
                                const artifactHeader = `### 📄 Artifact: ${artTitle}${headerSuffix}`;
                                md += `${artifactHeader}\n${codeBlock}\n\n`;
                            }
                        }
                    });
                }

                if (cfg.COLLAPSIBLE_MESSAGES) {
                    md += `</details>\n\n---\n\n`;
                } else {
                    md += `---\n\n`;
                }
            });

            return {
                content: md,
                filename: `${Utils.sanitizeFilename(title, 'Claude_Export')}.md`,
                stats: {
                    total: messagesToExport.length,
                    exported: exportedCount
                }
            };
        }
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // PROVIDER: GROK
    // ═══════════════════════════════════════════════════════════════════════════
    const GrokProvider = {
        name: 'Grok',
        hostPattern: /grok\.com/,

        matches(url) {
            return this.hostPattern.test(url);
        },

        extractChatId(url) {
            const match = url.match(/\/c\/([a-z0-9-]+)/);
            return match ? match[1] : null;
        },

        async fetchChat(chatId) {
            // Goal: export what you're CURRENTLY VIEWING.
            // Grok encodes the selected variant in the URL (?rid=...).
            const activeRid = new URLSearchParams(location.search).get('rid');

            // 1) Snapshot list from server
            const snapshotUrl = `/rest/app-chat/conversations/${chatId}/responses`;
            const snapshotResp = await fetch(snapshotUrl, {
                method: 'GET',
                headers: { 'Accept': 'application/json' },
                credentials: 'include',
                cache: 'no-store'
            });

            if (!snapshotResp.ok) throw new Error(`API error: ${snapshotResp.status}`);
            const snapshot = await snapshotResp.json();

            // 2) Build a set of IDs to hydrate (this is what load-responses expects)
            const ids = new Set();
            (snapshot.responses || []).forEach(r => { if (r?.responseId) ids.add(r.responseId); });
            (snapshot.inflightResponses || []).forEach(r => { if (r?.responseId) ids.add(r.responseId); });
            if (activeRid) ids.add(activeRid);

            // Useful on Grok: stores IDs you have viewed/selected in this browser profile
            try {
                const viewed = JSON.parse(localStorage.getItem('responseViewedMap') || '{}');
                Object.keys(viewed || {}).forEach(id => ids.add(id));
            } catch (e) { /* ignore */ }

            const loadUrl = `/rest/app-chat/conversations/${chatId}/load-responses`;

            const loadOnce = async () => {
                if (!ids.size) return null;
                try {
                    const resp = await fetch(loadUrl, {
                        method: 'POST',
                        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                        credentials: 'include',
                        cache: 'no-store',
                        body: JSON.stringify({ responseIds: Array.from(ids) })
                    });
                    if (!resp.ok) return null;
                    return await resp.json();
                } catch (e) {
                    return null;
                }
            };

            // Fetch file attachment content from assets.grok.com
            const fetchAttachmentContent = async (fileUri) => {
                if (!fileUri) return null;
                try {
                    const url = `https://assets.grok.com/${fileUri}`;
                    const resp = await fetch(url, {
                        method: 'GET',
                        credentials: 'include',
                        cache: 'no-store'
                    });
                    if (!resp.ok) return null;
                    return await resp.text();
                } catch (e) {
                    console.warn('[Grok Exporter] Failed to fetch attachment:', fileUri, e);
                    return null;
                }
            };

            // Resolve Ghost ID to real file path via bridge endpoint
            // Old conversations store attachment IDs that require translation
            const resolveGhostId = async (ghostId) => {
                if (!ghostId) return null;
                try {
                    const url = `/rest/assets/${ghostId}`;
                    const resp = await fetch(url, {
                        method: 'GET',
                        credentials: 'include',
                        cache: 'no-store'
                    });
                    if (!resp.ok) return null;
                    return await resp.json();
                } catch (e) {
                    console.warn('[Grok Exporter] Failed to resolve Ghost ID:', ghostId, e);
                    return null;
                }
            };

            let loaded = await loadOnce();

            // 3) Merge snapshot + hydrated responses by responseId
            const byId = new Map();
            const ingest = (arr) => {
                (arr || []).forEach(r => {
                    if (r && r.responseId) byId.set(r.responseId, r);
                });
            };

            ingest(snapshot.responses);
            ingest(snapshot.inflightResponses);
            ingest(loaded?.responses);

            // 4) If we have an active rid, try to ensure its ancestor chain is present
            // by adding missing parentResponseId values and re-hydrating a few times.
            if (activeRid && byId.has(activeRid)) {
                for (let i = 0; i < 6; i++) {
                    const missing = [];
                    let cur = byId.get(activeRid);
                    const seen = new Set();

                    while (cur && cur.responseId && !seen.has(cur.responseId)) {
                        seen.add(cur.responseId);
                        const pid = cur.parentResponseId;
                        if (pid && !byId.has(pid) && !ids.has(pid)) missing.push(pid);
                        if (!pid) break;
                        cur = byId.get(pid);
                    }

                    if (!missing.length) break;
                    missing.forEach(id => ids.add(id));

                    const more = await loadOnce();
                    ingest(more?.responses);
                }
            }

            const allResponses = Array.from(byId.values());

            // Resolve Ghost IDs for old conversations (The Repair Step)
            // Old conversations have fileAttachments (Ghost IDs) but empty fileAttachmentsMetadata
            for (const response of allResponses) {
                if (response.fileAttachments?.length > 0 && !response.fileAttachmentsMetadata?.length) {
                    response.fileAttachmentsMetadata = [];
                    for (const ghostId of response.fileAttachments) {
                        const assetData = await resolveGhostId(ghostId);
                        if (assetData && assetData.key) {
                            response.fileAttachmentsMetadata.push({
                                fileUri: assetData.key,
                                fileName: assetData.name || assetData.fileName || ghostId,
                                fileMimeType: assetData.mimeType || assetData.contentType || 'text/plain'
                            });
                        }
                    }
                }
            }

            // Fetch attachment contents for all responses
            for (const response of allResponses) {
                if (response.fileAttachmentsMetadata?.length > 0) {
                    for (const att of response.fileAttachmentsMetadata) {
                        if (att.fileUri) {
                            const content = await fetchAttachmentContent(att.fileUri);
                            if (content !== null) {
                                att.__fetchedContent = content;
                            }
                        }
                    }
                }
            }

            return {
                ...snapshot,
                responses: allResponses,
                __activeRid: activeRid
            };
        },

        cleanGrokMessage(text) {
            if (!text) return '';
            // Remove <grok:render> citation tags
            return text.replace(/<grok:render[^>]*>[\s\S]*?<\/grok:render>/g, '');
        },

        generateMarkdown(data, settings = null) {
            // Use provider-specific settings if provided, otherwise fall back to CONFIG
            const cfg = settings || CONFIG;
            console.log('[Chat Exporter] GrokProvider.generateMarkdown() using cfg.INCLUDE_USER_MESSAGES:', cfg.INCLUDE_USER_MESSAGES, 'cfg.INCLUDE_ASSISTANT_MESSAGES:', cfg.INCLUDE_ASSISTANT_MESSAGES);

            const activeRid = data?.__activeRid || new URLSearchParams(location.search).get('rid') || null;

            // Combine + de-dupe by responseId
            const combined = [
                ...(data.responses || []),
                ...(data.inflightResponses || [])
            ].filter(r => r && typeof r === 'object');

            const byId = new Map();
            combined.forEach(r => {
                if (r?.responseId) byId.set(r.responseId, r);
            });

            const buildChainFromRid = (rid) => {
                const chain = [];
                const seen = new Set();
                let cur = byId.get(rid);

                while (cur && cur.responseId && !seen.has(cur.responseId)) {
                    seen.add(cur.responseId);
                    chain.push(cur);
                    const pid = cur.parentResponseId;
                    if (!pid) break;
                    cur = byId.get(pid);
                }

                return chain.reverse();
            };

            let responses;
            if (cfg.GROK_EXPORT_ALL_REGENERATIONS) {
                // Export ALL responses chronologically, including regenerations
                responses = combined.slice().sort((a, b) => {
                    const ta = a?.createTime ? new Date(a.createTime).getTime() : 0;
                    const tb = b?.createTime ? new Date(b.createTime).getTime() : 0;
                    return ta - tb;
                });

                const seen = new Set();
                responses = responses.filter(r => {
                    const id = r?.responseId || `${r?.sender || 'unknown'}:${r?.createTime || ''}:${(r?.message || '').slice(0, 32)}`;
                    if (seen.has(id)) return false;
                    seen.add(id);
                    return true;
                });
            } else if (activeRid && byId.has(activeRid)) {
                // Export only the currently selected response chain
                responses = buildChainFromRid(activeRid);
            } else {
                // Fallback: no active rid, export all chronologically
                responses = combined.slice().sort((a, b) => {
                    const ta = a?.createTime ? new Date(a.createTime).getTime() : 0;
                    const tb = b?.createTime ? new Date(b.createTime).getTime() : 0;
                    return ta - tb;
                });

                const seen = new Set();
                responses = responses.filter(r => {
                    const id = r?.responseId || `${r?.sender || 'unknown'}:${r?.createTime || ''}:${(r?.message || '').slice(0, 32)}`;
                    if (seen.has(id)) return false;
                    seen.add(id);
                    return true;
                });
            }

            const firstHuman = responses.find(r => r.sender === 'human');
            const titleSource = firstHuman?.message?.substring(0, 60) || data?.title || 'Grok_Export';
            const title = Utils.sanitize(titleSource, 'Grok_Export');

            let md = `# ${title}\n\n`;

            if (cfg.INCLUDE_HEADER) {
                md += `> **Provider:** Grok  \n`;
                md += `> **Date:** ${new Date().toLocaleString()}  \n`;
                md += `> **Source:** [Grok.com](${location.href})  \n`;
                if (cfg.INCLUDE_ACTIVE_LEAF_INFO && activeRid) {
                    md += `> **Active Response (rid):** \`${activeRid}\`  \n`;
                }
                md += `\n---\n\n`;
            }

            if (!responses.length) return { content: md, filename: 'empty.md', stats: { total: 0, exported: 0, modelsDetected: 0, assistantCount: 0 } };

            let turnNumber = 0;
            let exportedCount = 0;
            let assistantCount = 0;
            const modelsFound = new Set();

            responses.forEach((msg) => {
                const isHuman = msg.sender === 'human';
                const role = isHuman ? 'USER' : 'GROK';

                // Skip based on config
                if (isHuman && !cfg.INCLUDE_USER_MESSAGES) return;
                if (!isHuman && !cfg.INCLUDE_ASSISTANT_MESSAGES) return;

                turnNumber++;
                exportedCount++;
                if (!isHuman) {
                    assistantCount++;
                    if (msg.model) modelsFound.add(msg.model);
                }

                // Build header with optional turn number
                let header = role;
                if (cfg.INCLUDE_TURN_NUMBERS) {
                    header = `[${turnNumber}] ${header}`;
                }

                if (cfg.COLLAPSIBLE_MESSAGES) {
                    md += `<details>\n<summary><strong>${header}</strong></summary>\n\n`;
                } else {
                    md += `## ${header}\n\n`;
                }

                // Optional: show timestamp
                if (cfg.INCLUDE_TIMESTAMPS && msg.createTime) {
                    md += `*${new Date(msg.createTime).toLocaleString()}*\n\n`;
                }

                // Optional: show message ID
                if (cfg.INCLUDE_MESSAGE_IDS && msg.responseId) {
                    md += `\`ID: ${msg.responseId}\`\n\n`;
                }

                // Model info for assistant
                if (cfg.INCLUDE_MODEL_INFO && !isHuman && msg.model) {
                    md += `*Model: ${msg.model}*\n\n`;
                }

                // Thinking duration
                if (cfg.INCLUDE_THINKING_DURATION && msg.thinkingStartTime && msg.thinkingEndTime) {
                    const start = new Date(msg.thinkingStartTime);
                    const end = new Date(msg.thinkingEndTime);
                    const duration = ((end - start) / 1000).toFixed(1);
                    md += `*💭 Thinking time: ${duration}s*\n\n`;
                }

                // File attachments (with fetched content if available)
                if (cfg.INCLUDE_ATTACHMENTS) {
                    // Handle file attachments with metadata (contains fetched content)
                    if (msg.fileAttachmentsMetadata?.length > 0) {
                        msg.fileAttachmentsMetadata.forEach(att => {
                            const name = att.fileName || 'Unknown file';
                            const mimeType = att.fileMimeType || '';
                            const content = att.__fetchedContent || null;

                            if (content) {
                                // Determine language hint from mime type or filename
                                let lang = '';
                                if (mimeType.includes('javascript')) lang = 'javascript';
                                else if (mimeType.includes('python')) lang = 'python';
                                else if (mimeType.includes('markdown')) lang = 'markdown';
                                else if (mimeType.includes('json')) lang = 'json';
                                else if (mimeType.includes('html')) lang = 'html';
                                else if (mimeType.includes('css')) lang = 'css';
                                else if (mimeType.includes('xml')) lang = 'xml';
                                else if (name.endsWith('.ps1')) lang = 'powershell';
                                else if (name.endsWith('.sh') || name.endsWith('.bash')) lang = 'bash';
                                else if (name.endsWith('.bat') || name.endsWith('.cmd')) lang = 'batch';
                                else if (name.endsWith('.ts')) lang = 'typescript';
                                else lang = mimeType.split('/')[1] || '';

                                const lineCount = (content.match(/\n/g) || []).length + 1;

                                const fenced = Utils.makeCodeFence(content, lang);

                                if (cfg.COLLAPSIBLE_ATTACHMENTS) {
                                    md += `<details>\n<summary><strong>📎 Attached File: ${Utils.escapeHtml(name)}</strong> (${lineCount} lines)</summary>\n\n${fenced}\n\n</details>\n\n`;
                                } else {
                                    md += `**📎 Attached File: ${name}** (${lineCount} lines)\n\n${fenced}\n\n`;
                                }
                            } else {
                                // Content not fetched
                                if (cfg.COLLAPSIBLE_ATTACHMENTS) {
                                    md += `<details>\n<summary><strong>📎 Attached: ${Utils.escapeHtml(name)}</strong></summary>\n\n*(File content could not be fetched)*\n\n</details>\n\n`;
                                } else {
                                    md += `> 📎 **Attached:** ${name}\n\n`;
                                }
                            }
                        });
                    }
                    // Fallback for old-style fileAttachments (just IDs, no metadata)
                    else if (msg.fileAttachments?.length > 0 && !msg.fileAttachmentsMetadata?.length) {
                        msg.fileAttachments.forEach(attId => {
                            if (cfg.COLLAPSIBLE_ATTACHMENTS) {
                                md += `<details>\n<summary><strong>📎 Attached: ${attId}</strong></summary>\n\n*(File content not available)*\n\n</details>\n\n`;
                            } else {
                                md += `> 📎 **Attached:** ${attId}\n\n`;
                            }
                        });
                    }

                    // Image attachments
                    if (msg.imageAttachments?.length > 0) {
                        const count = msg.imageAttachments.length;
                        if (cfg.COLLAPSIBLE_ATTACHMENTS) {
                            md += `<details>\n<summary><strong>🖼️ Images attached: ${count}</strong></summary>\n\n*(Image previews not available via API)*\n\n</details>\n\n`;
                        } else {
                            md += `> 🖼️ **Images attached:** ${count}\n\n`;
                        }
                    }
                }

                // Main message content (cleaned of citation tags)
                let cleanedMessage = this.cleanGrokMessage(msg.message);
                if (cleanedMessage) {
                    // Process code blocks based on settings
                    cleanedMessage = Utils.processCodeBlocks(cleanedMessage, cfg);
                    md += `${cleanedMessage}\n\n`;
                }

                // Sources - Grok uses webSearchResults (no inline capability, list only)
                if (cfg.INCLUDE_SOURCES_LIST && msg.webSearchResults?.length > 0) {
                    const results = msg.webSearchResults;
                    if (cfg.COLLAPSIBLE_SOURCES_LIST) {
                        md += `<details>\n<summary><strong>📚 Sources (${results.length})</strong></summary>\n\n`;
                        results.forEach((result, idx) => {
                            if (result.url) {
                                const title = (result.title || result.url).replace(/\n/g, ' ').trim();
                                const siteName = result.siteName ? ` — ${result.siteName}` : '';
                                md += `${idx + 1}. [${title}](${result.url})${siteName}\n`;
                                if (result.preview) {
                                    const preview = Utils.escapeHtml(result.preview.substring(0, 150).replace(/\n/g, ' ').trim());
                                    md += `   > ${preview}...\n\n`;
                                }
                            }
                        });
                        md += `</details>\n\n`;
                    } else {
                        md += `**📚 Sources (${results.length}):**\n\n`;
                        results.forEach((result, idx) => {
                            if (result.url) {
                                const title = (result.title || result.url).replace(/\n/g, ' ').trim();
                                const siteName = result.siteName ? ` — ${result.siteName}` : '';
                                md += `${idx + 1}. [${title}](${result.url})${siteName}\n`;
                                if (result.preview) {
                                    const preview = Utils.escapeHtml(result.preview.substring(0, 150).replace(/\n/g, ' ').trim());
                                    md += `   > ${preview}...\n\n`;
                                }
                            }
                        });
                        md += `\n`;
                    }
                }

                if (cfg.COLLAPSIBLE_MESSAGES) {
                    md += `</details>\n\n---\n\n`;
                } else {
                    md += `---\n\n`;
                }
            });

            return {
                content: md,
                filename: `${Utils.sanitizeFilename(title, 'Grok_Export')}.md`,
                stats: {
                    total: responses.length,
                    exported: exportedCount,
                    modelsDetected: modelsFound.size,
                    assistantCount: assistantCount
                }
            };
        }
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // PROVIDER: LMARENA
    // ═══════════════════════════════════════════════════════════════════════════
    const ArenaProvider = {
        name: 'Arena',
        hostPattern: /arena\.ai/,

        matches(url) {
            return this.hostPattern.test(url);
        },

        extractChatId(url) {
            // Handles: /c/{id}, /chat/{id}, /{locale}/c/{id}, /{locale}/chat/{id}
            const match = url.match(/\/(?:c|chat)\/([a-zA-Z0-9-]+)/);
            if (match && match[1] !== 'new') {
                return match[1];
            }
            return null;
        },

        async fetchChat(chatId) {
            const response = await fetch(`/api/evaluation/${chatId}`, {
                credentials: 'include',
                headers: { 'Accept': 'application/json' }
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();

            if (!data.messages || !Array.isArray(data.messages) || data.messages.length === 0) {
                throw new Error('No messages found');
            }

            return data;
        },

        /**
         * Extract model names from DOM in display order.
         * The API only provides model UUIDs, so we scrape the visible names.
         * These correspond 1:1 with assistant messages from the API.
         */
        getModelNamesFromDOM() {
            const selectors = [
                // Primary: sticky headers in message list showing model name
                'ol.mt-8 div.sticky span.truncate',
                'ol[class*="mt-8"] div[class*="sticky"] span[class*="truncate"]',
                // Fallback: any truncate span near model icons
                '[class*="bg-surface-primary"] [class*="sticky"] span.truncate'
            ];

            for (const selector of selectors) {
                const elements = document.querySelectorAll(selector);
                if (elements.length > 0) {
                    return [...elements]
                        .map(el => el.textContent?.trim())
                        .filter(Boolean);
                }
            }

            return [];
        },

        generateMarkdown(data, settings = null) {
            // Use provider-specific settings if provided, otherwise fall back to CONFIG
            const cfg = settings || CONFIG;
            console.log('[Chat Exporter] ArenaProvider.generateMarkdown() using cfg.INCLUDE_USER_MESSAGES:', cfg.INCLUDE_USER_MESSAGES, 'cfg.INCLUDE_ASSISTANT_MESSAGES:', cfg.INCLUDE_ASSISTANT_MESSAGES);

            // Use first user message as fallback title (like old Arena script)
            const firstUserMsg = data.messages?.find(m => m.role === 'user');
            const titleSource = data.title || firstUserMsg?.content?.substring(0, 60) || 'Arena_Export';
            const title = Utils.sanitize(titleSource, 'Arena_Export');
            const chatId = data.id || 'unknown';
            const createdAt = data.createdAt
                ? new Date(data.createdAt).toLocaleString()
                : new Date().toLocaleString();

            let md = `# ${title}\n\n`;

            if (cfg.INCLUDE_HEADER) {
                md += `> **Provider:** Arena  \n`;
                md += `> **Date:** ${createdAt}  \n`;
                md += `> **Chat ID:** \`${chatId}\`  \n`;
                md += `> **Source:** [Arena](${location.href})  \n`;
                md += `\n---\n\n`;
            }

            if (!data.messages || data.messages.length === 0) {
                return { content: md, filename: 'empty.md', stats: { total: 0, exported: 0, modelsDetected: 0, assistantCount: 0 } };
            }

            // Pre-process: assign turn numbers and detect battle mode (parallel responses)
            // Group messages by parent to detect parallel assistant responses
            const messagesByParent = new Map();
            data.messages.forEach(msg => {
                const parentKey = msg.parentMessageIds?.[0] || 'root';
                if (!messagesByParent.has(parentKey)) {
                    messagesByParent.set(parentKey, []);
                }
                messagesByParent.get(parentKey).push(msg);
            });

            // Assign turn numbers and battle position labels
            const processedMessages = [];
            let currentTurn = 0;

            data.messages.forEach(msg => {
                const parentKey = msg.parentMessageIds?.[0] || 'root';
                const siblings = messagesByParent.get(parentKey) || [];

                // Check if this is the first message in a group of siblings
                const isFirstInGroup = siblings[0]?.id === msg.id;

                if (isFirstInGroup) {
                    currentTurn++;
                }

                // Detect battle mode: multiple assistant messages with same parent
                const isBattle = siblings.length > 1 &&
                                msg.role === 'assistant' &&
                                siblings.filter(s => s.role === 'assistant').length > 1;

                const position = msg.participantPosition || '';
                const turnLabel = isBattle && position
                    ? `${currentTurn}${position.toUpperCase()}`
                    : `${currentTurn}`;

                processedMessages.push({
                    ...msg,
                    _turnNumber: currentTurn,
                    _turnLabel: turnLabel,
                    _isBattle: isBattle,
                    _position: position
                });
            });

            // Sort to ensure consistent ordering: within same turn, sort by participantPosition (a before b)
            processedMessages.sort((a, b) => {
                if (a._turnNumber !== b._turnNumber) {
                    return a._turnNumber - b._turnNumber;
                }
                // Within same turn, sort by position
                return (a._position || '').localeCompare(b._position || '');
            });

            // Detect mode from API response
            const isBattleMode = data.mode === 'battle';

            // Get model names from DOM
            // In direct mode: DOM uses flex-col-reverse (newest first), so reverse to get chronological order
            // In battle mode: DOM shows models side-by-side (A left, B right), no reversal needed
            const modelNamesFromDOM = cfg.INCLUDE_MODEL_INFO
                ? this.getModelNamesFromDOM()
                : [];

            // Only reverse for direct mode (chronological order needed)
            if (!isBattleMode && modelNamesFromDOM.length > 0) {
                modelNamesFromDOM.reverse();
            }

            // Build model name lookup function
            const getModelName = (msg, assistantIndex) => {
                if (!cfg.INCLUDE_MODEL_INFO || !modelNamesFromDOM.length) return null;

                if (isBattleMode) {
                    // Battle mode: use participantPosition to select model
                    // Position 'a' → first model, 'b' → second model
                    const pos = msg._position || '';
                    if (pos === 'a') return modelNamesFromDOM[0];
                    if (pos === 'b') return modelNamesFromDOM[1];
                    return null;
                } else {
                    // Direct mode: use sequential assistant message index
                    return modelNamesFromDOM[assistantIndex] || null;
                }
            };

            let exportedCount = 0;
            let assistantCount = 0;
            let assistantIndex = 0;

            processedMessages.forEach((msg) => {
                const isUser = msg.role === 'user';
                const role = isUser ? 'USER' : 'ASSISTANT';

                // Skip based on config
                if (isUser && !cfg.INCLUDE_USER_MESSAGES) return;
                if (!isUser && !cfg.INCLUDE_ASSISTANT_MESSAGES) return;

                exportedCount++;
                if (!isUser) assistantCount++;

                // Build role header with optional turn number and model name
                let roleHeader = role;
                if (cfg.INCLUDE_TURN_NUMBERS) {
                    roleHeader = `[${msg._turnLabel}] ${roleHeader}`;
                }
                if (!isUser && cfg.INCLUDE_MODEL_INFO) {
                    const modelName = getModelName(msg, assistantIndex);
                    if (modelName) {
                        roleHeader = `${roleHeader} (${modelName})`;
                    }
                    assistantIndex++;
                }

                if (cfg.COLLAPSIBLE_MESSAGES) {
                    md += `<details>\n<summary><strong>${roleHeader}</strong></summary>\n\n`;
                } else {
                    md += `## ${roleHeader}\n\n`;
                }

                // Optional: timestamp
                if (cfg.INCLUDE_TIMESTAMPS && msg.createdAt) {
                    md += `*${new Date(msg.createdAt).toLocaleString()}*\n\n`;
                }

                // Optional: message ID
                if (cfg.INCLUDE_MESSAGE_IDS && msg.id) {
                    md += `\`ID: ${msg.id}\`\n\n`;
                }

                // Reasoning/thinking block (Arena uses "reasoning" field)
                if (cfg.INCLUDE_THINKING && msg.reasoning) {
                    md += Utils.formatThinkingBlock(msg.reasoning, cfg);
                }

                // Main content with optional inline citations
                let content = msg.content || '';

                // Collect sources for this message
                let sources = [];
                if (msg.sources?.length > 0) {
                    sources = msg.sources.filter(s => s && s.url);

                    // Insert inline numeric superscript citations (if enabled)
                    if (cfg.INCLUDE_SOURCES && sources.length > 0) {
                        // Build insertions with source index (1-based)
                        const insertions = [];
                        sources.forEach((source, sourceIdx) => {
                            if (source.charLocation?.length > 0) {
                                source.charLocation.forEach(pos => {
                                    insertions.push({
                                        pos: pos,
                                        num: sourceIdx + 1,
                                        url: source.url
                                    });
                                });
                            }
                        });

                        // Sort: descending by position, then descending by num for same position
                        // This ensures [1][2][3] order when multiple sources cite same position
                        insertions.sort((a, b) => {
                            if (a.pos !== b.pos) return b.pos - a.pos;
                            return b.num - a.num;
                        });

                        // Insert numeric superscript links
                        insertions.forEach(ins => {
                            const insertPos = Math.min(ins.pos, content.length);
                            content = content.slice(0, insertPos) +
                                `<sup>[[${ins.num}](${ins.url})]</sup>` +
                                content.slice(insertPos);
                        });
                    }
                }

                content = Utils.processCodeBlocks(content, cfg);
                md += `${content}\n\n`;

                // Add sources list section after content (if enabled)
                if (cfg.INCLUDE_SOURCES_LIST && sources.length > 0) {
                    if (cfg.COLLAPSIBLE_SOURCES_LIST) {
                        md += `<details>\n<summary><strong>📚 Sources (${sources.length})</strong></summary>\n\n`;
                        sources.forEach((source, idx) => {
                            const title = (source.title || source.url).replace(/\n/g, ' ').trim();
                            md += `${idx + 1}. [${title}](${source.url})\n`;
                        });
                        md += `\n</details>\n\n`;
                    } else {
                        md += `**📚 Sources (${sources.length}):**\n\n`;
                        sources.forEach((source, idx) => {
                            const title = (source.title || source.url).replace(/\n/g, ' ').trim();
                            md += `${idx + 1}. [${title}](${source.url})\n`;
                        });
                        md += `\n`;
                    }
                }

                if (cfg.COLLAPSIBLE_MESSAGES) {
                    md += `</details>\n\n---\n\n`;
                } else {
                    md += `---\n\n`;
                }
            });

            return {
                content: md,
                filename: `${Utils.sanitizeFilename(title, 'Arena_Export')}.md`,
                stats: {
                    total: data.messages.length,
                    exported: exportedCount,
                    modelsDetected: modelNamesFromDOM.length,
                    assistantCount: assistantCount
                }
            };
        }
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // PROVIDER REGISTRY
    // ═══════════════════════════════════════════════════════════════════════════
    const Providers = {
        list: [ClaudeProvider, GrokProvider, ArenaProvider],

        detect() {
            const url = location.href;
            return this.list.find(p => p.matches(url)) || null;
        },

        getCurrent() {
            return this.detect();
        }
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // STATE
    // ═══════════════════════════════════════════════════════════════════════════
    const State = {
        error: null
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // SETTINGS PANEL (Shadow DOM Isolated)
    // ═══════════════════════════════════════════════════════════════════════════
    const PANEL_STYLES = `
        :host {
            all: initial;
        }
        * {
            box-sizing: border-box;
        }
        .settings-panel {
            position: fixed;
            background: #1f2937;
            border: 1px solid #374151;
            border-radius: 12px;
            font-family: system-ui, -apple-system, sans-serif;
            font-size: 13px;
            color: #e5e7eb;
            box-shadow: 0 8px 24px rgba(0,0,0,0.4);
            min-width: 260px;
            max-width: 320px;
            user-select: none;
            pointer-events: auto;
            z-index: 2147483647;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }
        .settings-panel .header {
            flex-shrink: 0;
            padding: 10px 16px;
            background: #111827;
            border-bottom: 1px solid #374151;
            border-radius: 12px 12px 0 0;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .settings-panel .header-title {
            font-weight: 600;
            font-size: 14px;
            color: #f9fafb;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .settings-panel .header-title .provider-badge {
            background: #22c55e;
            color: #fff;
            font-size: 10px;
            font-weight: 600;
            padding: 2px 6px;
            border-radius: 4px;
            text-transform: uppercase;
        }
        .settings-panel .close-button {
            width: 24px;
            height: 24px;
            border: none;
            background: transparent;
            color: #9ca3af;
            font-size: 18px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 6px;
            padding: 0;
            line-height: 1;
            transition: all 0.15s;
        }
        .settings-panel .close-button:hover {
            background: #374151;
            color: #f9fafb;
        }
        .settings-panel .content {
            flex: 1;
            overflow-y: auto;
            padding: 16px;
        }
        .settings-panel .content::-webkit-scrollbar {
            width: 6px;
        }
        .settings-panel .content::-webkit-scrollbar-track {
            background: #374151;
            border-radius: 3px;
        }
        .settings-panel .content::-webkit-scrollbar-thumb {
            background: #6b7280;
            border-radius: 3px;
        }
        .settings-panel .group {
            margin-bottom: 12px;
        }
        .settings-panel .group:last-child {
            margin-bottom: 0;
        }
        .settings-panel .group-title {
            font-size: 10px;
            font-weight: 600;
            color: #9ca3af;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 6px;
            padding-bottom: 4px;
            border-bottom: 1px solid #374151;
        }
        .settings-panel label {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 5px 0;
            cursor: pointer;
            transition: color 0.15s;
        }
        .settings-panel label:hover {
            color: #60a5fa;
        }
        .settings-panel label.indent {
            padding-left: 20px;
            font-size: 12px;
            color: #9ca3af;
        }
        .settings-panel label.indent:hover {
            color: #60a5fa;
        }
        .settings-panel label.disabled {
            opacity: 0.4;
            pointer-events: none;
        }
        .settings-panel label[data-tooltip] {
            position: relative;
        }
        .settings-panel label[data-tooltip]::after {
            content: attr(data-tooltip);
            position: absolute;
            visibility: hidden;
            opacity: 0;
            background: #111827;
            color: #d1d5db;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 11px;
            line-height: 1.4;
            max-width: 220px;
            width: max-content;
            white-space: pre-line;
            z-index: 100;
            left: 0;
            bottom: calc(100% + 6px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.4);
            border: 1px solid #374151;
            pointer-events: none;
            transition: opacity 0.15s ease-in-out, visibility 0.15s ease-in-out;
            transition-delay: 0s;
        }
        .settings-panel label[data-tooltip]:hover::after {
            visibility: visible;
            opacity: 1;
            transition-delay: 1s;
        }
        .settings-panel input[type="checkbox"] {
            width: 16px;
            height: 16px;
            cursor: pointer;
            accent-color: #22c55e;
            flex-shrink: 0;
        }
        .settings-panel .footer {
            flex-shrink: 0;
            padding: 12px 16px;
            border-top: 1px solid #374151;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 10px;
            background: #1f2937;
        }
        .settings-panel .kofi-button {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            background: #22c55e;
            color: #fff;
            border: none;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            text-decoration: none;
            transition: background 0.15s, transform 0.1s;
        }
        .settings-panel .kofi-button:hover {
            background: #16a34a;
            transform: translateY(-1px);
        }
        .settings-panel .reset-button {
            background: transparent;
            border: 1px solid #374151;
            color: #9ca3af;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.15s;
        }
        .settings-panel .reset-button:hover {
            background: #374151;
            color: #f9fafb;
            border-color: #4b5563;
        }
    `;

    const SettingsPanel = {
        shadowHost: null,
        shadowRoot: null,
        panel: null,
        isOpen: false,
        currentProvider: null,
        checkboxRefs: {},
        closeHandler: null,
        escapeHandler: null,

        init() {
            console.log('[Chat Exporter] SettingsPanel.init() called');

            if (this.shadowHost) {
                console.log('[Chat Exporter] Shadow host already exists');
                return;
            }

            this.shadowHost = document.createElement('div');
            this.shadowHost.id = 'chat-export-settings-host';
            Object.assign(this.shadowHost.style, {
                position: 'fixed',
                top: '0',
                left: '0',
                width: '0',
                height: '0',
                overflow: 'visible',
                zIndex: CONFIG.Z_INDEX.toString(),
                pointerEvents: 'none'
            });

            this.shadowRoot = this.shadowHost.attachShadow({ mode: 'closed' });
            console.log('[Chat Exporter] Shadow root created');

            const style = document.createElement('style');
            style.textContent = PANEL_STYLES;
            this.shadowRoot.appendChild(style);

            document.body.appendChild(this.shadowHost);
            console.log('[Chat Exporter] Shadow host appended to body');
        },

        buildPanel(providerName) {
            console.log('[Chat Exporter] buildPanel() for:', providerName);

            // Remove existing panel if any
            if (this.panel) {
                console.log('[Chat Exporter] Removing existing panel');
                this.panel.remove();
                this.panel = null;
            }
            this.checkboxRefs = {};

            const flags = PROVIDER_FLAGS[providerName] || [];
            console.log('[Chat Exporter] Flags for provider:', flags.length, flags);

            if (flags.length === 0) {
                console.warn('[Chat Exporter] No flags defined for provider:', providerName);
                return null;
            }

            this.panel = document.createElement('div');
            this.panel.className = 'settings-panel';

            // Header (fixed at top)
            const header = document.createElement('div');
            header.className = 'header';

            const headerTitle = document.createElement('div');
            headerTitle.className = 'header-title';
            headerTitle.innerHTML = `Export Settings <span class="provider-badge">${providerName}</span>`;

            const closeButton = document.createElement('button');
            closeButton.className = 'close-button';
            closeButton.textContent = '✕';
            closeButton.addEventListener('click', (e) => {
                e.stopPropagation();
                this.hide();
            });

            header.appendChild(headerTitle);
            header.appendChild(closeButton);
            this.panel.appendChild(header);

            // Content container (scrollable)
            const content = document.createElement('div');
            content.className = 'content';

            // Group flags by their group
            const groupedFlags = {};
            flags.forEach(flagName => {
                const meta = FLAG_METADATA[flagName];
                if (!meta) return;
                const group = meta.group || 'Other';
                if (!groupedFlags[group]) groupedFlags[group] = [];
                groupedFlags[group].push({ name: flagName, ...meta });
            });

            // Render groups in order
            FLAG_GROUP_ORDER.forEach(groupName => {
                const groupFlags = groupedFlags[groupName];
                if (!groupFlags || groupFlags.length === 0) return;

                const groupDiv = document.createElement('div');
                groupDiv.className = 'group';

                const groupTitle = document.createElement('div');
                groupTitle.className = 'group-title';
                groupTitle.textContent = groupName;
                groupDiv.appendChild(groupTitle);

                groupFlags.forEach(flag => {
                    const label = document.createElement('label');
                    if (flag.indent) label.classList.add('indent');

                    // Handle provider-specific tooltips
                    if (flag.tooltip) {
                        let tooltipText = flag.tooltip;
                        if (typeof flag.tooltip === 'object') {
                            // Provider-specific tooltip
                            tooltipText = flag.tooltip[providerName] || flag.tooltip.Claude || flag.tooltip.Grok || '';
                        }
                        if (tooltipText) {
                            label.setAttribute('data-tooltip', tooltipText);
                        }
                    }

                    // Resolve provider-specific label
                    let labelText = flag.label;
                    if (typeof flag.label === 'object') {
                        labelText = flag.label[providerName] || flag.label.Claude || flag.label.Grok || flag.name;
                    }

                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.id = `setting-${flag.name}`;
                    checkbox.checked = Settings.get(providerName, flag.name);

                    checkbox.addEventListener('change', (e) => {
                        e.stopPropagation();
                        const newValue = checkbox.checked;
                        console.log('[Chat Exporter] Setting changed:', flag.name, '=', newValue);
                        Settings.save(providerName, flag.name, newValue);
                        this.updateDependentStates(providerName);
                    });

                    const text = document.createTextNode(labelText);
                    label.appendChild(checkbox);
                    label.appendChild(text);
                    groupDiv.appendChild(label);

                    this.checkboxRefs[flag.name] = { checkbox, label };
                });

                content.appendChild(groupDiv);
            });

            this.panel.appendChild(content);

            // Footer with Ko-Fi button and reset button (fixed at bottom)
            const footer = document.createElement('div');
            footer.className = 'footer';

            const kofiLink = document.createElement('a');
            kofiLink.className = 'kofi-button';
            kofiLink.href = 'https://ko-fi.com/piknockyou';
            kofiLink.target = '_blank';
            kofiLink.rel = 'noopener noreferrer';
            kofiLink.title = 'Support this script on Ko-Fi';
            kofiLink.textContent = '☕ Support';
            kofiLink.addEventListener('click', (e) => {
                e.stopPropagation();
            });

            const resetButton = document.createElement('button');
            resetButton.className = 'reset-button';
            resetButton.textContent = 'Reset to Defaults';
            resetButton.addEventListener('click', (e) => {
                e.stopPropagation();
                console.log('[Chat Exporter] Resetting settings for:', providerName);
                Settings.reset(providerName);
                this.refreshCheckboxes(providerName);
            });

            footer.appendChild(kofiLink);
            footer.appendChild(resetButton);
            this.panel.appendChild(footer);

            // Block event propagation through panel
            this.panel.addEventListener('mousedown', (e) => e.stopPropagation());
            this.panel.addEventListener('mouseup', (e) => e.stopPropagation());
            this.panel.addEventListener('click', (e) => e.stopPropagation());

            this.shadowRoot.appendChild(this.panel);
            this.updateDependentStates(providerName);

            return this.panel;
        },

        updateDependentStates(providerName) {
            // Disable dependent checkboxes when parent is unchecked
            const settings = Settings.load(providerName);

            // COLLAPSIBLE_THINKING depends on INCLUDE_THINKING
            if (this.checkboxRefs.COLLAPSIBLE_THINKING) {
                const enabled = settings.INCLUDE_THINKING;
                this.checkboxRefs.COLLAPSIBLE_THINKING.label.classList.toggle('disabled', !enabled);
                this.checkboxRefs.COLLAPSIBLE_THINKING.checkbox.disabled = !enabled;
            }

            // COLLAPSIBLE_ATTACHMENTS depends on INCLUDE_ATTACHMENTS
            if (this.checkboxRefs.COLLAPSIBLE_ATTACHMENTS) {
                const enabled = settings.INCLUDE_ATTACHMENTS;
                this.checkboxRefs.COLLAPSIBLE_ATTACHMENTS.label.classList.toggle('disabled', !enabled);
                this.checkboxRefs.COLLAPSIBLE_ATTACHMENTS.checkbox.disabled = !enabled;
            }

            // COLLAPSIBLE_ARTIFACTS depends on INCLUDE_ARTIFACTS
            if (this.checkboxRefs.COLLAPSIBLE_ARTIFACTS) {
                const enabled = settings.INCLUDE_ARTIFACTS;
                this.checkboxRefs.COLLAPSIBLE_ARTIFACTS.label.classList.toggle('disabled', !enabled);
                this.checkboxRefs.COLLAPSIBLE_ARTIFACTS.checkbox.disabled = !enabled;
            }

            // COLLAPSIBLE_SEARCH_RESULTS depends on INCLUDE_SEARCH_RESULTS
            if (this.checkboxRefs.COLLAPSIBLE_SEARCH_RESULTS) {
                const enabled = settings.INCLUDE_SEARCH_RESULTS;
                this.checkboxRefs.COLLAPSIBLE_SEARCH_RESULTS.label.classList.toggle('disabled', !enabled);
                this.checkboxRefs.COLLAPSIBLE_SEARCH_RESULTS.checkbox.disabled = !enabled;
            }

            // COLLAPSIBLE_SOURCES_LIST depends on INCLUDE_SOURCES_LIST
            if (this.checkboxRefs.COLLAPSIBLE_SOURCES_LIST) {
                const enabled = settings.INCLUDE_SOURCES_LIST;
                this.checkboxRefs.COLLAPSIBLE_SOURCES_LIST.label.classList.toggle('disabled', !enabled);
                this.checkboxRefs.COLLAPSIBLE_SOURCES_LIST.checkbox.disabled = !enabled;
            }

            // COLLAPSIBLE_CODE_BLOCKS depends on INCLUDE_CODE_BLOCKS
            if (this.checkboxRefs.COLLAPSIBLE_CODE_BLOCKS) {
                const enabled = settings.INCLUDE_CODE_BLOCKS;
                this.checkboxRefs.COLLAPSIBLE_CODE_BLOCKS.label.classList.toggle('disabled', !enabled);
                this.checkboxRefs.COLLAPSIBLE_CODE_BLOCKS.checkbox.disabled = !enabled;
            }

            // INCLUDE_ACTIVE_LEAF_INFO depends on INCLUDE_HEADER
            if (this.checkboxRefs.INCLUDE_ACTIVE_LEAF_INFO) {
                const enabled = settings.INCLUDE_HEADER;
                this.checkboxRefs.INCLUDE_ACTIVE_LEAF_INFO.label.classList.toggle('disabled', !enabled);
                this.checkboxRefs.INCLUDE_ACTIVE_LEAF_INFO.checkbox.disabled = !enabled;
            }
        },

        refreshCheckboxes(providerName) {
            const settings = Settings.load(providerName);
            Object.keys(this.checkboxRefs).forEach(flagName => {
                const ref = this.checkboxRefs[flagName];
                if (ref && ref.checkbox) {
                    ref.checkbox.checked = settings[flagName];
                }
            });
            this.updateDependentStates(providerName);
        },

        /**
         * Calculate the best position for the panel that keeps it fully visible.
         * Hard rule: never go off-screen (top/bottom/left/right).
         * Behavior: prefer the placement that provides the MOST vertical space.
         */
        calculateBestPosition(anchorRect, panelWidth) {
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            const margin = 8;
            const minHeight = 150;

            // Available height within viewport bounds
            const fullHeight = vh - 2 * margin;

            // Available height above/below button while preserving margins
            const availAbove = anchorRect.top - 2 * margin;
            const availBelow = vh - anchorRect.bottom - 2 * margin;

            // Available width left/right of button while preserving margins
            const availRight = vw - anchorRect.right - 2 * margin;
            const availLeft = anchorRect.left - 2 * margin;

            const clampLeft = (left) => Math.max(margin, Math.min(left, vw - panelWidth - margin));

            // Align right edge of panel with right edge of anchor, clamped
            const alignedLeft = clampLeft(anchorRect.right - panelWidth);

            const candidates = [];

            // Right of button (full height)
            if (availRight >= panelWidth && fullHeight >= minHeight) {
                candidates.push({
                    kind: 'right',
                    left: anchorRect.right + margin,
                    top: margin,
                    height: fullHeight,
                    pref: 2
                });
            }

            // Left of button (full height)
            if (availLeft >= panelWidth && fullHeight >= minHeight) {
                candidates.push({
                    kind: 'left',
                    left: anchorRect.left - margin - panelWidth,
                    top: margin,
                    height: fullHeight,
                    pref: 1
                });
            }

            // Below button (max available below)
            if (availBelow >= minHeight) {
                candidates.push({
                    kind: 'below',
                    left: alignedLeft,
                    top: anchorRect.bottom + margin,
                    height: availBelow,
                    pref: 4
                });
            }

            // Above button (max available above)
            if (availAbove >= minHeight) {
                candidates.push({
                    kind: 'above',
                    left: alignedLeft,
                    top: margin,
                    height: availAbove,
                    pref: 3
                });
            }

            // Fallback: overlay (full height)
            if (candidates.length === 0) {
                candidates.push({
                    kind: 'overlay',
                    left: clampLeft((vw - panelWidth) / 2),
                    top: margin,
                    height: Math.max(minHeight, fullHeight),
                    pref: 0
                });
            }

            // Score: prioritize height, then preference
            candidates.sort((a, b) => {
                if (a.height !== b.height) return b.height - a.height;
                return b.pref - a.pref;
            });

            return candidates[0];
        },

        show(anchorElement, providerName) {
            console.log('[Chat Exporter] SettingsPanel.show() called for:', providerName);

            if (!this.shadowHost) {
                console.log('[Chat Exporter] Initializing shadow host...');
                this.init();
            }

            if (!document.body.contains(this.shadowHost)) {
                console.log('[Chat Exporter] Re-appending shadow host to body');
                document.body.appendChild(this.shadowHost);
            }

            this.currentProvider = providerName;
            console.log('[Chat Exporter] Building panel...');
            this.buildPanel(providerName);

            if (!this.panel) {
                console.warn('[Chat Exporter] No flags available for provider:', providerName);
                return;
            }

            // Get button position and calculate best panel position
            const rect = anchorElement.getBoundingClientRect();
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            const margin = 8;

            // Force a deterministic width that can never overflow the viewport
            const panelWidth = Math.max(220, Math.min(320, vw - 2 * margin));

            const pos = this.calculateBestPosition(rect, panelWidth);
            console.log('[Chat Exporter] Best position calculated:', pos);

            // Apply size - width fixed, height fits content up to max
            this.panel.style.width = `${panelWidth}px`;
            this.panel.style.maxWidth = `${panelWidth}px`;
            this.panel.style.minWidth = '0px';

            // Height: fit content, with max based on available space
            const maxH = Math.max(150, Math.min(pos.height, vh - 2 * margin));
            this.panel.style.height = 'auto';
            this.panel.style.maxHeight = `${maxH}px`;

            // Apply horizontal position
            this.panel.style.left = `${Math.max(margin, Math.min(pos.left, vw - panelWidth - margin))}px`;
            this.panel.style.right = 'auto';

            // Apply vertical position based on placement kind
            // Hard rule: never go off-screen. Also avoid "floating away" from the button.
            const setTop = (t) => {
                this.panel.style.top = `${Math.max(margin, Math.min(t, vh - margin))}px`;
                this.panel.style.bottom = 'auto';
            };
            const setBottom = (b) => {
                this.panel.style.bottom = `${Math.max(margin, Math.min(b, vh - margin))}px`;
                this.panel.style.top = 'auto';
            };

            if (pos.kind === 'below') {
                // Keep it adjacent to the button
                setTop(rect.bottom + margin);
            } else if (pos.kind === 'above') {
                // Keep it adjacent to the button (above)
                setBottom(vh - rect.top + margin);
            } else if (pos.kind === 'left' || pos.kind === 'right') {
                // Side placement: align near the button, but clamp to stay visible.
                setTop(rect.top);

                // Measure after maxHeight is applied so we can clamp precisely
                const h = this.panel.getBoundingClientRect().height;

                // If it would overflow at the bottom, try aligning the panel's bottom to the button's bottom
                if (rect.top + h + margin > vh) {
                    setBottom(vh - rect.bottom + margin);

                    // If that pushed it off-screen at the top, fall back to top margin
                    if (this.panel.getBoundingClientRect().top < margin) {
                        setTop(margin);
                    }
                } else {
                    // Otherwise, clamp top so the whole panel is visible, staying as close as possible to the button
                    const clampedTop = Math.max(margin, Math.min(rect.top, vh - h - margin));
                    setTop(clampedTop);
                }
            } else {
                // overlay fallback
                setTop(margin);
            }

            this.isOpen = true;
            console.log('[Chat Exporter] Panel is now open, isOpen:', this.isOpen);

            // Close handlers
            if (this.closeHandler) {
                document.removeEventListener('mousedown', this.closeHandler, true);
            }

            this.closeHandler = (e) => {
                if (!this.isOpen) return;
                const path = e.composedPath();
                if (path.includes(this.shadowHost)) return;
                if (e.target === anchorElement || anchorElement.contains(e.target)) return;
                this.hide();
            };

            this.escapeHandler = (e) => {
                if (e.key === 'Escape' && this.isOpen) {
                    this.hide();
                }
            };

            setTimeout(() => {
                document.addEventListener('mousedown', this.closeHandler, true);
                document.addEventListener('keydown', this.escapeHandler, true);
            }, 50);
        },

        hide() {
            if (this.panel) {
                this.panel.remove();
                this.panel = null;
            }
            this.isOpen = false;
            this.currentProvider = null;
            this.checkboxRefs = {};

            if (this.closeHandler) {
                document.removeEventListener('mousedown', this.closeHandler, true);
                this.closeHandler = null;
            }
            if (this.escapeHandler) {
                document.removeEventListener('keydown', this.escapeHandler, true);
                this.escapeHandler = null;
            }
        },

        toggle(anchorElement, providerName) {
            console.log('[Chat Exporter] SettingsPanel.toggle() - isOpen:', this.isOpen, 'currentProvider:', this.currentProvider, 'requested:', providerName);

            if (this.isOpen && this.currentProvider === providerName) {
                console.log('[Chat Exporter] Panel already open for this provider, hiding...');
                this.hide();
            } else {
                console.log('[Chat Exporter] Opening panel...');
                this.hide(); // Close any existing panel first
                this.show(anchorElement, providerName);
            }
        }
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // FAVICON LOADER (CSP Bypass via GM_xmlhttpRequest)
    // ═══════════════════════════════════════════════════════════════════════════
    const FaviconLoader = {
        cache: {},

        /**
         * Fetch a favicon URL and convert to base64 data URI.
         * Uses GM_xmlhttpRequest to bypass CSP restrictions.
         */
        fetchAsBase64(url) {
            return new Promise((resolve) => {
                // Check cache first
                if (this.cache[url]) {
                    resolve(this.cache[url]);
                    return;
                }

                try {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: url,
                        responseType: 'blob',
                        timeout: 5000,
                        onload: (response) => {
                            if (response.status !== 200) {
                                resolve(null);
                                return;
                            }
                            const reader = new FileReader();
                            reader.onload = () => {
                                const base64 = reader.result;
                                this.cache[url] = base64;
                                resolve(base64);
                            };
                            reader.onerror = () => resolve(null);
                            reader.readAsDataURL(response.response);
                        },
                        onerror: () => resolve(null),
                        ontimeout: () => resolve(null)
                    });
                } catch (e) {
                    resolve(null);
                }
            });
        },

        /**
         * Load favicon into an img element, bypassing CSP.
         */
        async load(imgElement, url, fallbackText) {
            const base64 = await this.fetchAsBase64(url);
            if (base64) {
                imgElement.src = base64;
            } else {
                // Fallback: show first letter
                imgElement.style.display = 'none';
                const parent = imgElement.parentElement;
                if (parent) {
                    const fallback = document.createElement('span');
                    fallback.textContent = fallbackText || '?';
                    fallback.style.cssText = 'font-size: 18px; font-weight: bold; color: #fff;';
                    parent.appendChild(fallback);
                }
            }
        }
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // ONBOARDING BANNER (First-run hint)
    // ═══════════════════════════════════════════════════════════════════════════
    //
    // DRY design:
    //   - Single style injector (idempotent)
    //   - Declarative content sections
    //   - Provider icons specified as data, loaded via FaviconLoader
    //
    const OnboardingBanner = {
        element: null,
        closeHandler: null,

        // Single source of truth for banner content
        CONTENT: {
            title: { icon: '📥', text: 'Multi-Provider Chat Exporter' },
            controls: [
                { icon: '🖱️', strong: 'Left-click', text: 'Export conversation to Markdown' },
                { icon: '⚙️', strong: 'Right-click', text: 'Open settings panel' },
                { icon: '✋', strong: 'Right-drag', text: 'Move button anywhere' }
            ],
            providers: [
                { id: 'claude', name: 'Claude.ai', favicon: 'https://claude.ai/favicon.ico', fallbackText: 'C' },
                { id: 'grok', name: 'Grok.com', favicon: 'https://grok.com/favicon.ico', fallbackText: 'G' },
                { id: 'arena', name: 'Arena.ai', favicon: 'https://arena.ai/favicon.ico', fallbackText: 'L' }
            ],
            features: [
                'User & Assistant Messages',
                'Turn Numbers',
                'Thinking/Reasoning Blocks',
                'Code Blocks',
                'File Attachments',
                'Artifacts',
                'Web Search Queries',
                'Search Results',
                'Inline Citations',
                'Sources Bibliography',
                'Collapsible Sections',
                'Model Names',
                'Timestamps',
                'Message IDs',
                'Regenerations/Branches',
                'Active Leaf/Response ID'
            ],
            footer: {
                checkboxId: 'onboarding-dismiss-forever',
                checkboxText: "Don't show again",
                buttonText: 'Got it!'
            }
        },

        STYLES_ID: 'chat-export-onboarding-styles',
        BANNER_ID: 'chat-export-onboarding',

        isDismissed() {
            // Use GM storage for cross-domain persistence
            return GM_getValue(CONFIG.HINT_DISMISSED_KEY, false) === true;
        },

        dismiss(permanent = false) {
            if (permanent) {
                GM_setValue(CONFIG.HINT_DISMISSED_KEY, true);
            }
            if (this.element) {
                this.element.style.opacity = '0';
                this.element.style.transform = 'translateY(10px)';
                setTimeout(() => {
                    this.element?.remove();
                    this.element = null;
                }, 200);
            }
            if (this.closeHandler) {
                document.removeEventListener('mousedown', this.closeHandler);
                this.closeHandler = null;
            }
        },

        injectStyles() {
            if (document.getElementById(this.STYLES_ID)) return;

            const style = document.createElement('style');
            style.id = this.STYLES_ID;
            style.textContent = `
                #${this.BANNER_ID} {
                    position: fixed;
                    background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
                    color: #fff;
                    padding: 16px 20px;
                    border-radius: 12px;
                    font-family: system-ui, -apple-system, sans-serif;
                    font-size: 13px;
                    z-index: ${CONFIG.Z_INDEX - 1};
                    box-shadow: 0 8px 32px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.1) inset;
                    line-height: 1.6;
                    max-width: 340px;
                    opacity: 0;
                    transform: translateY(10px);
                    transition: opacity 0.3s ease-out, transform 0.3s ease-out;
                }
                #${this.BANNER_ID}.visible {
                    opacity: 1;
                    transform: translateY(0);
                }
                #${this.BANNER_ID}.arrow-bottom::after {
                    content: '';
                    position: absolute;
                    bottom: -10px;
                    border-left: 12px solid transparent;
                    border-right: 12px solid transparent;
                    border-top: 12px solid #3b82f6;
                }
                #${this.BANNER_ID}.arrow-left::after { left: 24px; }
                #${this.BANNER_ID}.arrow-right::after { right: 24px; }
                #${this.BANNER_ID}.arrow-top::after {
                    content: '';
                    position: absolute;
                    top: -10px;
                    border-left: 12px solid transparent;
                    border-right: 12px solid transparent;
                    border-bottom: 12px solid #1e40af;
                }
                #${this.BANNER_ID} .hint-title {
                    font-weight: 700;
                    font-size: 15px;
                    margin-bottom: 14px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding-bottom: 12px;
                    border-bottom: 1px solid rgba(255,255,255,0.15);
                }
                #${this.BANNER_ID} .hint-title-icon {
                    font-size: 20px;
                }
                #${this.BANNER_ID} .hint-section {
                    margin-bottom: 14px;
                }
                #${this.BANNER_ID} .hint-section:last-of-type {
                    margin-bottom: 0;
                }
                #${this.BANNER_ID} .hint-section-title {
                    font-weight: 600;
                    font-size: 10px;
                    text-transform: uppercase;
                    letter-spacing: 0.8px;
                    opacity: 0.75;
                    margin-bottom: 8px;
                }
                #${this.BANNER_ID} .hint-list {
                    margin: 0;
                    padding: 0;
                    list-style: none;
                }
                #${this.BANNER_ID} .hint-list li {
                    padding: 4px 0;
                    display: flex;
                    align-items: flex-start;
                    gap: 10px;
                    font-size: 12.5px;
                }
                #${this.BANNER_ID} .hint-list-icon {
                    opacity: 0.8;
                    flex-shrink: 0;
                    width: 16px;
                    text-align: center;
                }
                #${this.BANNER_ID} .hint-list strong {
                    color: #bfdbfe;
                }
                #${this.BANNER_ID} .hint-providers {
                    display: flex;
                    gap: 16px;
                    align-items: center;
                    justify-content: center;
                    padding: 8px 0;
                }
                #${this.BANNER_ID} .hint-provider-icon {
                    position: relative;
                    width: 32px;
                    height: 32px;
                    background: rgba(255,255,255,0.15);
                    border-radius: 8px;
                    padding:  6px;
                    transition: all 0.2s ease;
                    cursor: help;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                #${this.BANNER_ID} .hint-provider-icon:hover {
                    background: rgba(255,255,255,0.25);
                    transform: translateY(-2px);
                }
                #${this.BANNER_ID} .hint-provider-icon img {
                    width: 100%;
                    height: 100%;
                    display: block;
                    border-radius: 4px;
                }
                #${this.BANNER_ID} .hint-provider-icon::after {
                    content: attr(data-name);
                    position: absolute;
                    bottom: calc(100% + 8px);
                    left: 50%;
                    transform: translateX(-50%);
                    background: #0f172a;
                    color: #f1f5f9;
                    padding: 6px 12px;
                    border-radius: 6px;
                    font-size: 11px;
                    font-weight: 600;
                    white-space: nowrap;
                    opacity: 0;
                    visibility: hidden;
                    transition: opacity 0.2s ease, visibility 0.2s ease;
                    pointer-events: none;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.4);
                }
                #${this.BANNER_ID} .hint-provider-icon:hover::after {
                    opacity: 1;
                    visibility: visible;
                }
                #${this.BANNER_ID} .hint-settings-preview {
                    font-size: 11.5px;
                    opacity: 0.9;
                    line-height: 1.6;
                }
                #${this.BANNER_ID} .hint-settings-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 6px 12px;
                    margin-top: 8px;
                }
                #${this.BANNER_ID} .hint-settings-item {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 11px;
                }
                #${this.BANNER_ID} .hint-settings-item::before {
                    content: '✓';
                    color: #93c5fd;
                    font-weight: bold;
                    flex-shrink: 0;
                }
                #${this.BANNER_ID} .hint-footer {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-top: 16px;
                    padding-top: 14px;
                    border-top: 1px solid rgba(255,255,255,0.15);
                }
                #${this.BANNER_ID} .hint-checkbox-label {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 11.5px;
                    opacity: 0.85;
                    cursor: pointer;
                    user-select: none;
                    transition: opacity 0.15s;
                }
                #${this.BANNER_ID} .hint-checkbox-label:hover {
                    opacity: 1;
                }
                #${this.BANNER_ID} .hint-checkbox-label input {
                    cursor: pointer;
                    accent-color: #93c5fd;
                    width: 14px;
                    height: 14px;
                }
                #${this.BANNER_ID} .hint-close {
                    background: rgba(255,255,255,0.2);
                    border: none;
                    color: #fff;
                    padding: 8px 20px;
                    border-radius: 6px;
                    font-size: 13px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background 0.15s, transform 0.1s;
                }
                #${this.BANNER_ID} .hint-close:hover {
                    background: rgba(255,255,255,0.3);
                }
                #${this.BANNER_ID} .hint-close:active {
                    transform: scale(0.97);
                }
            `;
            document.head.appendChild(style);
        },

        buildHtml() {
            const c = this.CONTENT;

            const controlsHtml = c.controls.map(item =>
                `<li><span class="hint-list-icon">${item.icon}</span><span><strong>${item.strong}</strong> — ${item.text}</span></li>`
            ).join('');

            const providersHtml = c.providers.map(p =>
                `<div class="hint-provider-icon" data-name="${Utils.escapeHtml(p.name)}">` +
                `<img id="onboarding-icon-${p.id}" src="" alt="${Utils.escapeHtml(p.name)}">` +
                `</div>`
            ).join('');

            const featuresHtml = c.features.map(f =>
                `<div class="hint-settings-item">${Utils.escapeHtml(f)}</div>`
            ).join('');

            return `
                <div class="hint-title">
                    <span class="hint-title-icon">${c.title.icon}</span>
                    <span>${Utils.escapeHtml(c.title.text)}</span>
                </div>

                <div class="hint-section">
                    <div class="hint-section-title">Button Controls</div>
                    <ul class="hint-list">
                        ${controlsHtml}
                    </ul>
                </div>

                <div class="hint-section">
                    <div class="hint-section-title">Supported Providers</div>
                    <div class="hint-providers">
                        ${providersHtml}
                    </div>
                </div>

                <div class="hint-section">
                    <div class="hint-section-title">Configurable Per Provider — Right-Click to Customize</div>
                    <div class="hint-settings-preview">
                        <div class="hint-settings-grid">
                            ${featuresHtml}
                        </div>
                    </div>
                </div>

                <div class="hint-footer">
                    <label class="hint-checkbox-label">
                        <input type="checkbox" id="${c.footer.checkboxId}">
                        ${Utils.escapeHtml(c.footer.checkboxText)}
                    </label>
                    <button class="hint-close">${Utils.escapeHtml(c.footer.buttonText)}</button>
                </div>
            `;
        },

        show(anchorEl) {
            if (this.isDismissed()) return;
            if (this.element) return;
            if (!anchorEl) return;

            this.injectStyles();

            const hint = document.createElement('div');
            hint.id = this.BANNER_ID;

            hint.innerHTML = this.buildHtml();

            document.body.appendChild(hint);
            this.element = hint;

            // Position hint relative to button
            const btnRect = anchorEl.getBoundingClientRect();
            const hintWidth = 340;
            const hintHeight = hint.offsetHeight;
            const margin = 16;
            const vw = window.innerWidth;
            const vh = window.innerHeight;

            // Determine if button is in top or bottom half
            const buttonInTopHalf = btnRect.top < vh / 2;
            // Determine if button is in left or right half
            const buttonInLeftHalf = btnRect.left < vw / 2;

            let top, left;
            let arrowVertical = 'bottom';
            let arrowHorizontal = buttonInLeftHalf ? 'left' : 'right';

            if (buttonInTopHalf) {
                // Position below button
                top = btnRect.bottom + margin;
                arrowVertical = 'top';
            } else {
                // Position above button
                top = btnRect.top - hintHeight - margin;
                arrowVertical = 'bottom';
            }

            if (buttonInLeftHalf) {
                // Align left edges
                left = Math.max(margin, btnRect.left - 10);
            } else {
                // Align right edges
                left = Math.min(vw - hintWidth - margin, btnRect.right - hintWidth + 10);
            }

            // Clamp to viewport
            top = Math.max(margin, Math.min(top, vh - hintHeight - margin));
            left = Math.max(margin, Math.min(left, vw - hintWidth - margin));

            hint.style.top = `${top}px`;
            hint.style.left = `${left}px`;
            hint.classList.add(`arrow-${arrowVertical}`, `arrow-${arrowHorizontal}`);

            // Animate in
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    hint.classList.add('visible');
                });
            });

            // Load favicons via CSP bypass (data-driven)
            this.CONTENT.providers.forEach(p => {
                const img = hint.querySelector(`#onboarding-icon-${p.id}`);
                if (img) FaviconLoader.load(img, p.favicon, p.fallbackText);
            });

            // Event handlers
            const checkbox = hint.querySelector(`#${this.CONTENT.footer.checkboxId}`);
            const closeBtn = hint.querySelector('.hint-close');

            const close = () => this.dismiss(checkbox?.checked || false);

            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                close();
            });

            // Close on outside click
            this.closeHandler = (e) => {
                if (!hint.contains(e.target) && e.target !== anchorEl && !anchorEl.contains(e.target)) {
                    close();
                }
            };

            setTimeout(() => {
                document.addEventListener('mousedown', this.closeHandler);
            }, 300);
        }
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // UI COMPONENTS
    // ═══════════════════════════════════════════════════════════════════════════
    const UI = {
        btn: null,
        isDragging: false,
        isExporting: false,
        dragMoved: false,

        init() {
            const btn = document.createElement('div');
            btn.id = 'chat-export-btn';
            btn.innerHTML = `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`;

            Object.assign(btn.style, {
                position: 'fixed',
                width: `${CONFIG.BUTTON_SIZE}px`,
                height: `${CONFIG.BUTTON_SIZE}px`,
                borderRadius: '50%',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: CONFIG.Z_INDEX,
                userSelect: 'none',
                transition: 'background-color 0.2s, transform 0.1s, opacity 0.2s',
                color: '#fff'
            });

            this.loadPosition(btn);

            // Left-click: Export
            btn.addEventListener('click', (e) => {
                console.log('[Chat Exporter] Left-click detected, isDragging:', this.isDragging);
                if (e.button === 0 && !this.isDragging) this.export();
            });

            // Right-click: Settings (if no drag) or Drag
            btn.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('[Chat Exporter] Context menu event, dragMoved:', this.dragMoved);

                // If we didn't drag, show settings
                if (!this.dragMoved) {
                    const provider = Providers.getCurrent();
                    console.log('[Chat Exporter] Provider for settings:', provider?.name);
                    if (provider) {
                        console.log('[Chat Exporter] Toggling settings panel for:', provider.name);
                        SettingsPanel.toggle(btn, provider.name);
                    } else {
                        console.warn('[Chat Exporter] No provider detected!');
                    }
                } else {
                    console.log('[Chat Exporter] Drag detected, skipping settings panel');
                }
                // Reset dragMoved for next interaction
                this.dragMoved = false;
            });

            btn.addEventListener('mousedown', (e) => {
                console.log('[Chat Exporter] Mousedown, button:', e.button);
                if (e.button === 2) {
                    e.preventDefault();
                    this.dragMoved = false;
                    this.startDrag(e);
                }
            });

            document.body.appendChild(btn);
            this.btn = btn;
            window.addEventListener('resize', () => this.applyPosition());
            this.update();

            // Show first-run onboarding banner after a short delay
            setTimeout(() => {
                if (this.btn && this.btn.style.display !== 'none') {
                    OnboardingBanner.show(this.btn);
                }
            }, 1200);
        },

        loadPosition(btn) {
            const provider = Providers.getCurrent();
            const key = CONFIG.POSITION_STORAGE_PREFIX + (provider?.name || 'default');
            const saved = GM_getValue(key, null);
            if (saved) {
                try {
                    const pos = typeof saved === 'string' ? JSON.parse(saved) : saved;
                    this.setPosition(btn, pos.ratioX, pos.ratioY);
                } catch (e) {
                    // Default: bottom-left corner
                    this.setPosition(btn, 0, 1);
                }
            } else {
                // Default: bottom-left corner
                this.setPosition(btn, 0, 1);
            }
        },

        setPosition(btn, rx, ry) {
            const maxX = window.innerWidth - CONFIG.BUTTON_SIZE;
            const maxY = window.innerHeight - CONFIG.BUTTON_SIZE;
            btn.style.left = `${Math.max(0, rx * maxX)}px`;
            btn.style.top = `${Math.max(0, ry * maxY)}px`;
        },

        applyPosition() {
            if (!this.btn) return;
            const provider = Providers.getCurrent();
            const key = CONFIG.POSITION_STORAGE_PREFIX + (provider?.name || 'default');
            const saved = GM_getValue(key, null);
            if (saved) {
                try {
                    const pos = typeof saved === 'string' ? JSON.parse(saved) : saved;
                    this.setPosition(this.btn, pos.ratioX, pos.ratioY);
                } catch (e) { /* ignore */ }
            }
        },

        startDrag(e) {
            this.isDragging = true;
            const rect = this.btn.getBoundingClientRect();
            const startX = e.clientX;
            const startY = e.clientY;
            const offX = e.clientX - rect.left;
            const offY = e.clientY - rect.top;

            const onMove = (ev) => {
                const dx = Math.abs(ev.clientX - startX);
                const dy = Math.abs(ev.clientY - startY);

                // Only start visual drag if moved more than 5px
                if (dx > 5 || dy > 5) {
                    this.dragMoved = true;
                    this.btn.style.cursor = 'grabbing';
                }

                if (this.dragMoved) {
                    const x = Math.max(0, Math.min(window.innerWidth - CONFIG.BUTTON_SIZE, ev.clientX - offX));
                    const y = Math.max(0, Math.min(window.innerHeight - CONFIG.BUTTON_SIZE, ev.clientY - offY));
                    this.btn.style.left = `${x}px`;
                    this.btn.style.top = `${y}px`;
                }
            };

            const onUp = () => {
                this.btn.style.cursor = 'pointer';
                document.removeEventListener('mousemove', onMove);
                document.removeEventListener('mouseup', onUp);

                if (this.dragMoved) {
                    const finalRect = this.btn.getBoundingClientRect();
                    const maxX = window.innerWidth - CONFIG.BUTTON_SIZE;
                    const maxY = window.innerHeight - CONFIG.BUTTON_SIZE;
                    const rx = maxX > 0 ? finalRect.left / maxX : 0.95;
                    const ry = maxY > 0 ? finalRect.top / maxY : 0.85;
                    const provider = Providers.getCurrent();
                    const key = CONFIG.POSITION_STORAGE_PREFIX + (provider?.name || 'default');
                    GM_setValue(key, { ratioX: rx, ratioY: ry });
                }

                setTimeout(() => {
                    this.isDragging = false;
                    // dragMoved is reset on next mousedown
                }, 50);
            };

            document.addEventListener('mousemove', onMove);
            document.addEventListener('mouseup', onUp);
        },

        update() {
            if (!this.btn) return;
            const provider = Providers.getCurrent();

            if (this.isExporting) {
                this.btn.style.backgroundColor = CONFIG.BUTTON_COLOR_LOADING;
                this.btn.title = 'Exporting...';
            } else if (State.error) {
                this.btn.style.backgroundColor = CONFIG.BUTTON_COLOR_ERROR;
                this.btn.title = `Error: ${State.error || 'Unknown'}. Click to retry.`;
            } else {
                this.btn.style.backgroundColor = CONFIG.BUTTON_COLOR_READY;
                this.btn.title = `Export to Markdown (${provider?.name || 'Unknown'})\nLeft-click: Export\nRight-click: Settings\nRight-drag: Move`;
            }
        },

        async export() {
            const provider = Providers.getCurrent();
            if (!provider) return this.toast('Unknown provider');

            const chatId = provider.extractChatId(location.href);
            if (!chatId) return this.toast('Open a chat first');

            // Close settings panel if open
            SettingsPanel.hide();

            this.isExporting = true;
            this.update();
            this.toast(`Fetching ${provider.name} data...`);

            try {
                const data = await provider.fetchChat(chatId);

                // Load provider-specific settings before generating markdown
                console.log('[Chat Exporter] Export starting for provider:', provider.name);
                const providerSettings = Settings.load(provider.name);
                console.log('[Chat Exporter] Exporting with settings:', {
                    INCLUDE_USER_MESSAGES: providerSettings.INCLUDE_USER_MESSAGES,
                    INCLUDE_ASSISTANT_MESSAGES: providerSettings.INCLUDE_ASSISTANT_MESSAGES,
                    INCLUDE_THINKING: providerSettings.INCLUDE_THINKING,
                    INCLUDE_HEADER: providerSettings.INCLUDE_HEADER
                });

                const { content, filename, stats } = provider.generateMarkdown(data, providerSettings);

                const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                a.click();
                URL.revokeObjectURL(url);

                // Build detailed success message
                let successMsg = `Exported ${stats?.exported || 0} messages`;
                if (stats?.modelsDetected !== undefined && stats?.assistantCount) {
                    successMsg += ` (${stats.modelsDetected}/${stats.assistantCount} models detected)`;
                }
                this.toast(successMsg);
                State.error = null;
            } catch (err) {
                State.error = err.message;
                this.toast(`Failed: ${err.message}`);
                console.error('[Chat Exporter]', err);
            } finally {
                this.isExporting = false;
                this.update();
            }
        },

        toast(msg) {
            // Remove existing toasts
            document.querySelectorAll('.chat-export-toast').forEach(el => el.remove());

            const el = document.createElement('div');
            el.className = 'chat-export-toast';
            el.textContent = msg;
            Object.assign(el.style, {
                position: 'fixed',
                bottom: '80px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: '#333',
                color: '#fff',
                padding: '10px 20px',
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: 'system-ui, sans-serif',
                zIndex: CONFIG.Z_INDEX,
                opacity: '0',
                transition: 'opacity 0.3s',
                pointerEvents: 'none'
            });
            document.body.appendChild(el);
            requestAnimationFrame(() => el.style.opacity = '1');
            setTimeout(() => {
                el.style.opacity = '0';
                setTimeout(() => el.remove(), 300);
            }, 2500);
        }
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // ROUTER / OBSERVER
    // ═══════════════════════════════════════════════════════════════════════════
    let lastUrl = location.href;

    const checkRouter = () => {
        const provider = Providers.getCurrent();
        if (!provider) {
            if (UI.btn) UI.btn.style.display = 'none';
            return;
        }

        const chatId = provider.extractChatId(location.href);
        if (UI.btn) {
            UI.btn.style.display = chatId ? 'flex' : 'none';
        }
        UI.update();
    };

    const init = () => {
        UI.init();
        checkRouter();

        // Poll for URL changes (handles SPA navigation)
        setInterval(() => {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                State.error = null;
                checkRouter();
            }
        }, 500);
    };

    // Start
    const bootstrap = () => {
        console.log('[Chat Exporter] Bootstrap starting...');
        console.log('[Chat Exporter] PROVIDER_FLAGS defined:', Object.keys(PROVIDER_FLAGS));
        console.log('[Chat Exporter] FLAG_METADATA keys:', Object.keys(FLAG_METADATA).length);

        const provider = Providers.getCurrent();
        console.log('[Chat Exporter] Current provider:', provider?.name || 'none');

        init();
        console.log('[Chat Exporter] Bootstrap complete');
    };

    if (document.body) {
        bootstrap();
    } else {
        window.addEventListener('DOMContentLoaded', bootstrap);
    }
})();