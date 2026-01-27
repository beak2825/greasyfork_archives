// ==UserScript==
// @name         GitHub | Full Issue Thread Markdown Exporter/Downloader
// @namespace    https://greasyfork.org/en/users/1462137-piknockyou
// @version      2.1
// @author       Piknockyou
// @license      AGPL-3.0
// @description  Exports a complete GitHub issue (title, body, all comments, metadata) to clean Markdown via API. Features draggable FAB, Shadow DOM settings panel, and configurable output.
// @match        https://github.com/*/*/issues/*
// @icon         https://github.githubassets.com/favicons/favicon.svg
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/564123/GitHub%20%7C%20Full%20Issue%20Thread%20Markdown%20ExporterDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/564123/GitHub%20%7C%20Full%20Issue%20Thread%20Markdown%20ExporterDownloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ═══════════════════════════════════════════════════════════════════════════
    // CONFIGURATION & DEFAULTS
    // ═══════════════════════════════════════════════════════════════════════════

    const CONFIG = {
        // ─── Content Options ─────────────────────────────────────────────────
        INCLUDE_HEADER: true,              // Frontmatter with repo/issue info
        INCLUDE_LABELS: true,              // Show labels in header
        INCLUDE_ASSIGNEES: true,           // Show assignees in header
        INCLUDE_MILESTONE: true,           // Show milestone in header
        INCLUDE_TIMESTAMPS: true,          // Show created/updated times
        INCLUDE_AUTHOR_INFO: true,         // Show @username for issue/comments
        INCLUDE_REACTIONS: true,           // Show reaction counts
        INCLUDE_COMMENT_IDS: false,        // Show comment IDs (for linking)

        // ─── References (Deduped, Recommended) ─────────────────────────────
        INCLUDE_REFERENCES_SECTION: true,  // Adds a dedicated "References" section (recommended)
        REF_INCLUDE_CROSS_REFERENCED: true,// Uses timeline "cross-referenced" events as source of truth
        REF_INCLUDE_SAME_REPO: true,       // Include references within the same repo
        REF_INCLUDE_CROSS_REPO: true,      // Include references from other repos
        REF_INCLUDE_ISSUES: true,          // Include referenced Issues
        REF_INCLUDE_PRS: true,             // Include referenced Pull Requests
        REF_INCLUDE_DUPLICATES: true,      // Derive duplicates from cross-references with label "duplicate"
        REF_INCLUDE_COMMITS: true,         // Include commit references (timeline "referenced" events)
        REF_FETCH_COMMIT_DETAILS: false,   // Fetch commit message/details (extra API calls) — default OFF

        // ─── Timeline (Verbose / Audit Log) ───────────────────────────────
        INCLUDE_TIMELINE_SECTION: false,   // Adds optional verbose chronological timeline section
        TL_INCLUDE_CROSS_REFERENCED: true, // Include cross-referenced items in timeline
        TL_INCLUDE_REFERENCED: true,       // Include commit references in timeline
        TL_INCLUDE_RENAMED: true,          // Include title changes (renamed)
        TL_INCLUDE_LABEL_CHANGES: true,    // Include labeled/unlabeled
        TL_INCLUDE_PROJECT_V2: false,      // Include project v2 events (often low-detail)
        TL_INCLUDE_SUBSCRIBE_EVENTS: false,// Include subscribed/unsubscribed (noise)
        TL_INCLUDE_MENTIONED_EVENTS: false,// Include mentioned (noise)
        TL_INCLUDE_MARKED_DUPLICATE_EVENTS: true, // Include marked_as_duplicate events
        TL_INCLUDE_CLOSED_EVENTS: true,    // Include closed/reopened events

        COLLAPSIBLE_LONG_COMMENTS: false,  // Wrap comments >500 chars in <details>
        LONG_COMMENT_THRESHOLD: 500,       // Character threshold for collapsible

        // ─── Formatting ──────────────────────────────────────────────────────
        COMMENT_SEPARATOR: '---',          // Separator between comments
        USE_HTML_DETAILS: true,            // Use <details> tags (vs blockquotes)

        // ─── API Settings ────────────────────────────────────────────────────
        API_BASE: 'https://api.github.com',
        PER_PAGE: 100,                     // Max allowed by GitHub
        FETCH_DELAY_MS: 100,               // Delay between paginated requests
        REQUEST_TIMEOUT_MS: 30000,         // 30 second timeout

        // ─── UI Settings ─────────────────────────────────────────────────────
        BUTTON_SIZE: 50,
        BUTTON_COLOR_READY: '#238636',     // GitHub green
        BUTTON_COLOR_LOADING: '#f59e0b',   // Amber
        BUTTON_COLOR_ERROR: '#da3633',     // GitHub red
        BUTTON_COLOR_SUCCESS: '#238636',   // GitHub green
        Z_INDEX: 2147483647,
        POSITION_STORAGE_KEY: 'gh_issue_export_pos',
        SETTINGS_STORAGE_KEY: 'gh_issue_export_config',
        ONBOARDING_DISMISSED_KEY: 'gh_issue_export_onboarding_dismissed',

        // ─── Debug ───────────────────────────────────────────────────────────
        DEBUG: false
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // TRUSTED TYPES POLICY
    // ═══════════════════════════════════════════════════════════════════════════

    let trustedTypesPolicy = null;
    if (window.trustedTypes && window.trustedTypes.createPolicy) {
        try {
            trustedTypesPolicy = window.trustedTypes.createPolicy('gh-issue-export-policy', {
                createHTML: (string) => string
            });
        } catch (e) {
            // Policy may already exist or creation blocked
        }
    }

    /**
     * Safely set innerHTML with Trusted Types support
     */
    function safeSetInnerHTML(element, htmlString) {
        if (trustedTypesPolicy) {
            element.innerHTML = trustedTypesPolicy.createHTML(htmlString);
        } else {
            element.innerHTML = htmlString;
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // LOGGING
    // ═══════════════════════════════════════════════════════════════════════════

    const LOG_PREFIX = '[GH Issue Export]';

    const log = (...args) => {
        if (CONFIG.DEBUG) console.log(LOG_PREFIX, ...args);
    };

    const warn = (...args) => {
        console.warn(LOG_PREFIX, ...args);
    };

    const error = (...args) => {
        console.error(LOG_PREFIX, ...args);
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // SETTINGS STORAGE
    // ═══════════════════════════════════════════════════════════════════════════

    const Settings = {
        _cache: null,

        load() {
            if (this._cache) return this._cache;
            try {
                const saved = GM_getValue(CONFIG.SETTINGS_STORAGE_KEY, null);
                if (saved) {
                    const overrides = typeof saved === 'string' ? JSON.parse(saved) : saved;
                    this._cache = { ...CONFIG, ...overrides };
                    log('Settings loaded:', this._cache);
                    return this._cache;
                }
            } catch (e) {
                warn('Failed to load settings:', e);
            }
            this._cache = { ...CONFIG };
            return this._cache;
        },

        save(key, value) {
            try {
                let overrides = {};
                const saved = GM_getValue(CONFIG.SETTINGS_STORAGE_KEY, null);
                if (saved) {
                    overrides = typeof saved === 'string' ? JSON.parse(saved) : saved;
                }
                overrides[key] = value;
                GM_setValue(CONFIG.SETTINGS_STORAGE_KEY, overrides);
                this._cache = null; // Invalidate cache
                log('Setting saved:', key, '=', value);
            } catch (e) {
                warn('Failed to save setting:', e);
            }
        },

        get(key) {
            const settings = this.load();
            return settings[key];
        },

        reset() {
            GM_deleteValue(CONFIG.SETTINGS_STORAGE_KEY);
            this._cache = null;
            log('Settings reset to defaults');
        }
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // UTILITY FUNCTIONS
    // ═══════════════════════════════════════════════════════════════════════════

    const Utils = {
        /**
         * Extract owner, repo, and issue number from current URL
         */
        parseIssueUrl() {
            const match = window.location.pathname.match(/^\/([^\/]+)\/([^\/]+)\/issues\/(\d+)/);
            if (!match) return null;
            return {
                owner: match[1],
                repo: match[2],
                issueNumber: parseInt(match[3], 10)
            };
        },

        /**
         * Sanitize text for use as filename
         */
        sanitizeFilename(text, maxLen = 80) {
            if (!text) return 'github_issue';
            return text
                .replace(/[<>:"/\\|?*\x00-\x1f]/g, '')
                .replace(/\s+/g, '_')
                .replace(/_+/g, '_')
                .replace(/^_+|_+$/g, '')
                .trim()
                .substring(0, maxLen) || 'github_issue';
        },

        /**
         * Format ISO date to readable string
         */
        formatDate(isoString, includeTime = false) {
            if (!isoString) return '';
            try {
                const date = new Date(isoString);
                if (isNaN(date.getTime())) return isoString;

                const options = {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                };

                if (includeTime) {
                    options.hour = '2-digit';
                    options.minute = '2-digit';
                }

                return date.toLocaleDateString('en-US', options);
            } catch (e) {
                return isoString;
            }
        },

        /**
         * Format reactions object to emoji string
         */
        formatReactions(reactions) {
            if (!reactions) return '';

            const emojiMap = {
                '+1': '👍',
                '-1': '👎',
                'laugh': '😄',
                'hooray': '🎉',
                'confused': '😕',
                'heart': '❤️',
                'rocket': '🚀',
                'eyes': '👀'
            };

            const parts = [];
            for (const [key, emoji] of Object.entries(emojiMap)) {
                const count = reactions[key];
                if (count && count > 0) {
                    parts.push(`${emoji} ${count}`);
                }
            }

            return parts.join(' · ');
        },

        /**
         * Escape HTML entities
         */
        escapeHtml(text) {
            if (!text) return '';
            return String(text)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;');
        },

        /**
         * Create delay promise
         */
        delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // GITHUB API CLIENT
    // ═══════════════════════════════════════════════════════════════════════════

    const GitHubAPI = {
        /**
         * Make authenticated API request
         */
        async request(endpoint, options = {}) {
            const url = endpoint.startsWith('http')
                ? endpoint
                : `${CONFIG.API_BASE}${endpoint}`;

            const headers = {
                'Accept': 'application/vnd.github+json',
                'X-GitHub-Api-Version': '2022-11-28',
                ...options.headers
            };

            log('API Request:', url);

            // Our internal controller (timeout + optional external abort bridging)
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), CONFIG.REQUEST_TIMEOUT_MS);

            // If caller supplies an AbortSignal, bridge it into our controller
            // (so UI "Cancel export" actually aborts ongoing network requests)
            const externalSignal = options.signal;
            let onExternalAbort = null;
            if (externalSignal && typeof externalSignal.addEventListener === 'function') {
                if (externalSignal.aborted) {
                    controller.abort();
                } else {
                    onExternalAbort = () => controller.abort();
                    externalSignal.addEventListener('abort', onExternalAbort, { once: true });
                }
            }

            try {
                // Never pass caller's signal directly (we always use controller.signal)
                const { signal, ...restOptions } = options;

                const response = await fetch(url, {
                    ...restOptions,
                    headers,
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (onExternalAbort && externalSignal) {
                    try { externalSignal.removeEventListener('abort', onExternalAbort); } catch (e) {}
                }

                // Check rate limit
                const remaining = response.headers.get('X-RateLimit-Remaining');
                const resetTime = response.headers.get('X-RateLimit-Reset');

                if (remaining !== null) {
                    log(`Rate limit remaining: ${remaining}`);
                    if (parseInt(remaining, 10) < 5) {
                        const resetDate = new Date(parseInt(resetTime, 10) * 1000);
                        warn(`Rate limit nearly exhausted! Resets at ${resetDate.toLocaleTimeString()}`);
                    }
                }

                if (!response.ok) {
                    if (response.status === 403 && remaining === '0') {
                        throw new Error(`Rate limit exceeded. Resets at ${new Date(parseInt(resetTime, 10) * 1000).toLocaleTimeString()}`);
                    }
                    throw new Error(`API error: ${response.status} ${response.statusText}`);
                }

                return {
                    data: await response.json(),
                    headers: response.headers
                };
            } catch (err) {
                clearTimeout(timeoutId);

                if (onExternalAbort && externalSignal) {
                    try { externalSignal.removeEventListener('abort', onExternalAbort); } catch (e) {}
                }

                if (err.name === 'AbortError') {
                    // Prefer "Cancelled" if external aborted; otherwise timeout
                    if (externalSignal && externalSignal.aborted) {
                        throw new Error('Cancelled');
                    }
                    throw new Error('Request timeout');
                }
                throw err;
            }
        },

        /**
         * Fetch issue details
         */
        async fetchIssue(owner, repo, issueNumber, signal = null) {
            const endpoint = `/repos/${owner}/${repo}/issues/${issueNumber}`;
            const { data } = await this.request(endpoint, signal ? { signal } : {});
            return data;
        },

        /**
         * Fetch all comments with pagination
         */
        async fetchAllComments(owner, repo, issueNumber, onProgress = null, signal = null) {
            const allComments = [];
            let page = 1;
            let hasMore = true;

            while (hasMore) {
                const endpoint = `/repos/${owner}/${repo}/issues/${issueNumber}/comments?per_page=${CONFIG.PER_PAGE}&page=${page}`;
                const { data, headers } = await this.request(endpoint, signal ? { signal } : {});

                allComments.push(...data);

                if (onProgress) {
                    onProgress(allComments.length);
                }

                // Check for next page via Link header
                const linkHeader = headers.get('Link');
                hasMore = linkHeader && linkHeader.includes('rel="next"');

                if (hasMore) {
                    page++;
                    await Utils.delay(CONFIG.FETCH_DELAY_MS);
                }
            }

            log(`Fetched ${allComments.length} comments across ${page} pages`);
            return allComments;
        },

        /**
         * Fetch timeline events (optional)
         */
        async fetchTimeline(owner, repo, issueNumber, signal = null) {
            const allEvents = [];
            let page = 1;
            let hasMore = true;

            while (hasMore) {
                const endpoint = `/repos/${owner}/${repo}/issues/${issueNumber}/timeline?per_page=${CONFIG.PER_PAGE}&page=${page}`;
                try {
                    const { data, headers } = await this.request(endpoint, signal ? { signal } : {});
                    allEvents.push(...data);

                    const linkHeader = headers.get('Link');
                    hasMore = linkHeader && linkHeader.includes('rel="next"');

                    if (hasMore) {
                        page++;
                        await Utils.delay(CONFIG.FETCH_DELAY_MS);
                    }
                } catch (e) {
                    // Timeline API might not be available for all repos
                    warn('Timeline fetch failed:', e.message);
                    break;
                }
            }

            return allEvents;
        },

        /**
         * Fetch commit details (optional, extra API calls)
         */
        async fetchCommit(commitApiUrl, signal = null) {
            const { data } = await this.request(commitApiUrl, signal ? { signal } : {});
            return data;
        }
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // MARKDOWN GENERATOR
    // ═══════════════════════════════════════════════════════════════════════════

    const MarkdownGenerator = {
        /**
         * Generate complete Markdown document.
         * @param {object} issue GitHub issue object (REST)
         * @param {Array<object>} comments Issue comments (REST)
         * @param {Array<object>} timeline Timeline events (REST)
         * @param {object} commitDetailsBySha Optional map: sha -> { html_url, message }
         * @param {object|null} cfg Settings
         */
        generate(issue, comments, timeline = [], commitDetailsBySha = {}, cfg = null) {
            const settings = cfg || Settings.load();
            const parts = [];

            // Title
            parts.push(`# ${issue.title}\n`);

            // Header/Frontmatter
            if (settings.INCLUDE_HEADER) {
                parts.push(this.generateHeader(issue, settings));
            }

            parts.push('---\n');

            // Issue Description
            parts.push('## Description\n');

            if (settings.INCLUDE_AUTHOR_INFO) {
                const authorLine = `*Opened by [@${issue.user.login}](${issue.user.html_url})*`;
                if (settings.INCLUDE_TIMESTAMPS && issue.created_at) {
                    parts.push(`${authorLine} *on ${Utils.formatDate(issue.created_at)}*\n`);
                } else {
                    parts.push(`${authorLine}\n`);
                }
            }

            // Issue body (already Markdown)
            if (issue.body && issue.body.trim()) {
                parts.push(`\n${issue.body.trim()}\n`);
            } else {
                parts.push('\n*No description provided.*\n');
            }

            // Issue reactions
            if (settings.INCLUDE_REACTIONS && issue.reactions) {
                const reactionStr = Utils.formatReactions(issue.reactions);
                if (reactionStr) {
                    parts.push(`\n${reactionStr}\n`);
                }
            }

            // References (high signal, deduped)
            if (settings.INCLUDE_REFERENCES_SECTION && Array.isArray(timeline) && timeline.length > 0) {
                const refMd = this.generateReferencesSection(issue, timeline, commitDetailsBySha, settings);
                if (refMd) parts.push(refMd);
            }

            // Timeline (verbose / audit)
            if (settings.INCLUDE_TIMELINE_SECTION && Array.isArray(timeline) && timeline.length > 0) {
                const tlMd = this.generateTimelineSection(issue, timeline, commitDetailsBySha, settings);
                if (tlMd) parts.push(tlMd);
            }

            // Comments
            if (comments.length > 0) {
                parts.push('\n---\n');
                parts.push(`## Comments (${comments.length})\n`);

                comments.forEach((comment, index) => {
                    parts.push(this.generateComment(comment, index + 1, settings));

                    // Only add separators BETWEEN comments (not after the last one).
                    // This avoids redundant separators right before the export footer.
                    if (index !== comments.length - 1) {
                        parts.push(`\n${settings.COMMENT_SEPARATOR}\n`);
                    }
                });
            }

            // Footer
            parts.push('\n---\n');
            parts.push(`*Exported on ${new Date().toLocaleString()} from [${issue.html_url}](${issue.html_url})*\n`);

            return parts.join('\n');
        },

        /**
         * Generate header/frontmatter section
         */
        generateHeader(issue, settings) {
            const lines = [];

            // Parse owner/repo from URL
            const urlMatch = issue.html_url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
            const owner = urlMatch ? urlMatch[1] : '';
            const repo = urlMatch ? urlMatch[2] : '';

            lines.push(`> **Repository:** [${owner}/${repo}](https://github.com/${owner}/${repo})  `);
            lines.push(`> **Issue:** [#${issue.number}](${issue.html_url})  `);

            // State with appropriate styling
            const stateEmoji = issue.state === 'open' ? '🟢' : (issue.state_reason === 'completed' ? '🟣' : '🔴');
            const stateLabel = issue.state === 'closed'
                ? (issue.state_reason ? `closed (${issue.state_reason})` : 'closed')
                : 'open';
            lines.push(`> **State:** ${stateEmoji} ${stateLabel}  `);

            // Labels
            if (settings.INCLUDE_LABELS && issue.labels && issue.labels.length > 0) {
                const labelNames = issue.labels.map(l => `\`${l.name}\``).join(', ');
                lines.push(`> **Labels:** ${labelNames}  `);
            }

            // Assignees
            if (settings.INCLUDE_ASSIGNEES && issue.assignees && issue.assignees.length > 0) {
                const assigneeLinks = issue.assignees.map(a => `[@${a.login}](${a.html_url})`).join(', ');
                lines.push(`> **Assignees:** ${assigneeLinks}  `);
            }

            // Milestone
            if (settings.INCLUDE_MILESTONE && issue.milestone) {
                lines.push(`> **Milestone:** ${issue.milestone.title}  `);
            }

            // Timestamps
            if (settings.INCLUDE_TIMESTAMPS) {
                lines.push(`> **Created:** ${Utils.formatDate(issue.created_at)}  `);
                if (issue.updated_at && issue.updated_at !== issue.created_at) {
                    lines.push(`> **Updated:** ${Utils.formatDate(issue.updated_at)}  `);
                }
                if (issue.closed_at) {
                    lines.push(`> **Closed:** ${Utils.formatDate(issue.closed_at)}  `);
                }
            }

            lines.push('');
            return lines.join('\n');
        },

        /**
         * Generate a single comment block
         */
        generateComment(comment, index, settings) {
            const parts = [];

            // Comment header
            let header = `### Comment #${index}`;

            if (settings.INCLUDE_AUTHOR_INFO) {
                header += ` — [@${comment.user.login}](${comment.user.html_url})`;
            }

            if (settings.INCLUDE_TIMESTAMPS && comment.created_at) {
                header += ` · ${Utils.formatDate(comment.created_at)}`;
            }

            // Check if comment should be collapsible
            const isLong = settings.COLLAPSIBLE_LONG_COMMENTS &&
                          comment.body &&
                          comment.body.length > settings.LONG_COMMENT_THRESHOLD;

            if (isLong && settings.USE_HTML_DETAILS) {
                // Collapsible comment
                const preview = comment.body.substring(0, 100).replace(/\n/g, ' ') + '...';
                parts.push(`<details>`);
                parts.push(`<summary><strong>${header}</strong> — <em>${Utils.escapeHtml(preview)}</em></summary>\n`);
                parts.push(comment.body.trim());

                // Reactions inside details
                if (settings.INCLUDE_REACTIONS && comment.reactions) {
                    const reactionStr = Utils.formatReactions(comment.reactions);
                    if (reactionStr) {
                        parts.push(`\n${reactionStr}`);
                    }
                }

                parts.push(`\n</details>\n`);
            } else {
                // Normal comment
                parts.push(`${header}\n`);

                if (settings.INCLUDE_COMMENT_IDS) {
                    parts.push(`\`ID: ${comment.id}\`\n`);
                }

                parts.push(`\n${comment.body.trim()}\n`);

                // Reactions
                if (settings.INCLUDE_REACTIONS && comment.reactions) {
                    const reactionStr = Utils.formatReactions(comment.reactions);
                    if (reactionStr) {
                        parts.push(`\n${reactionStr}\n`);
                    }
                }
            }

            return parts.join('\n');
        },

        // ───────────────────────────────────────────────────────────────────
        // References (deduped, high signal)
        // ───────────────────────────────────────────────────────────────────

        _getCurrentRepoFullName(issue) {
            // Prefer parsing from html_url: https://github.com/owner/repo/issues/123
            const m = (issue?.html_url || '').match(/github\.com\/([^\/]+)\/([^\/]+)/);
            return m ? `${m[1]}/${m[2]}` : '';
        },

        _hasLabel(issueObj, labelName) {
            const labels = issueObj?.labels || [];
            const target = String(labelName || '').toLowerCase();
            return labels.some(l => String(l?.name || '').toLowerCase() === target);
        },

        _shortSha(sha) {
            const s = String(sha || '');
            return s.length > 7 ? s.slice(0, 7) : s;
        },

        _commitApiToHtmlUrl(commitApiUrl, sha) {
            // https://api.github.com/repos/OWNER/REPO/commits/SHA
            // -> https://github.com/OWNER/REPO/commit/SHA
            try {
                const m = String(commitApiUrl || '').match(/api\.github\.com\/repos\/([^\/]+)\/([^\/]+)\/commits\/([a-f0-9]+)/i);
                if (m) return `https://github.com/${m[1]}/${m[2]}/commit/${m[3]}`;
            } catch (e) {}
            if (sha) return `https://github.com/commit/${sha}`;
            return String(commitApiUrl || '');
        },

        generateReferencesSection(issue, timeline, commitDetailsBySha, settings) {
            if (!settings.REF_INCLUDE_CROSS_REFERENCED && !settings.REF_INCLUDE_COMMITS) return '';

            const currentRepo = this._getCurrentRepoFullName(issue);
            const lines = [];
            const sectionParts = [];

            // Collect cross references (issues + PRs)
            const crossRefs = (timeline || [])
                .filter(e => e && e.event === 'cross-referenced' && e.source && e.source.issue)
                .map(e => {
                    const src = e.source.issue;
                    const repoFull = src?.repository?.full_name || '';
                    const isSameRepo = currentRepo && repoFull ? (repoFull.toLowerCase() === currentRepo.toLowerCase()) : false;
                    const isPR = !!src?.pull_request;
                    const isDup = this._hasLabel(src, 'duplicate');

                    return {
                        created_at: e.created_at,
                        actor: e.actor?.login || '',
                        repoFull,
                        isSameRepo,
                        isPR,
                        isDup,
                        number: src.number,
                        title: src.title || '',
                        url: src.html_url || '',
                        state: src.state || '',
                        closed_at: src.closed_at || null,
                        merged_at: src.pull_request?.merged_at || null
                    };
                });

            const crossRefFiltered = [];
            if (settings.REF_INCLUDE_CROSS_REFERENCED) {
                for (const r of crossRefs) {
                    if (!r.url) continue;

                    // Same-repo vs cross-repo filters
                    if (r.isSameRepo && !settings.REF_INCLUDE_SAME_REPO) continue;
                    if (!r.isSameRepo && !settings.REF_INCLUDE_CROSS_REPO) continue;

                    // Issue vs PR filters
                    if (r.isPR && !settings.REF_INCLUDE_PRS) continue;
                    if (!r.isPR && !settings.REF_INCLUDE_ISSUES) continue;

                    // Duplicate filter (for "main" related lists we exclude duplicates if duplicates are enabled)
                    // We'll keep them and decide per-section below.
                    crossRefFiltered.push(r);
                }
            }

            // De-dupe by URL
            const dedupeByUrl = (arr) => {
                const seen = new Set();
                const out = [];
                for (const it of arr) {
                    if (!it.url) continue;
                    if (seen.has(it.url)) continue;
                    seen.add(it.url);
                    out.push(it);
                }
                return out;
            };

            const relatedPRs = dedupeByUrl(crossRefFiltered.filter(r => r.isPR && (!r.isDup || !settings.REF_INCLUDE_DUPLICATES)));
            const relatedIssues = dedupeByUrl(crossRefFiltered.filter(r => !r.isPR && (!r.isDup || !settings.REF_INCLUDE_DUPLICATES)));
            const duplicates = settings.REF_INCLUDE_DUPLICATES ? dedupeByUrl(crossRefFiltered.filter(r => r.isDup)) : [];

            // Commits (timeline referenced)
            const commits = [];
            if (settings.REF_INCLUDE_COMMITS) {
                const referencedEvents = (timeline || []).filter(e => e && e.event === 'referenced' && e.commit_id);
                const seenSha = new Set();
                for (const e of referencedEvents) {
                    const sha = String(e.commit_id || '');
                    if (!sha || seenSha.has(sha)) continue;
                    seenSha.add(sha);

                    const apiUrl = e.commit_url || '';
                    const htmlUrl = (commitDetailsBySha && commitDetailsBySha[sha] && commitDetailsBySha[sha].html_url)
                        ? commitDetailsBySha[sha].html_url
                        : this._commitApiToHtmlUrl(apiUrl, sha);

                    const fullMsg = (commitDetailsBySha && commitDetailsBySha[sha] && commitDetailsBySha[sha].message)
                        ? commitDetailsBySha[sha].message
                        : '';

                    const subject = fullMsg ? String(fullMsg).split('\n')[0].trim() : '';

                    commits.push({
                        sha,
                        htmlUrl,
                        subject
                    });
                }
            }

            // Build output only if we have something
            const hasAnything =
                relatedPRs.length || relatedIssues.length || duplicates.length || commits.length;

            if (!hasAnything) return '';

            sectionParts.push('\n---\n');
            sectionParts.push('## References\n');

            // Related PRs
            if (relatedPRs.length > 0) {
                sectionParts.push(`### Related Pull Requests (${relatedPRs.length})\n`);
                relatedPRs.forEach(pr => {
                    const repoPrefix = pr.repoFull ? `${pr.repoFull}#${pr.number}` : `#${pr.number}`;
                    const title = pr.title ? ` — ${pr.title}` : '';
                    const status = pr.merged_at ? ` (merged ${Utils.formatDate(pr.merged_at)})` : (pr.state ? ` (${pr.state})` : '');
                    sectionParts.push(`- [${repoPrefix}](${pr.url})${title}${status}`);
                });
                sectionParts.push('');
            }

            // Related Issues
            if (relatedIssues.length > 0) {
                sectionParts.push(`### Related Issues (${relatedIssues.length})\n`);
                relatedIssues.forEach(it => {
                    const repoPrefix = it.repoFull ? `${it.repoFull}#${it.number}` : `#${it.number}`;
                    const title = it.title ? ` — ${it.title}` : '';
                    const status = it.state ? ` (${it.state})` : '';
                    sectionParts.push(`- [${repoPrefix}](${it.url})${title}${status}`);
                });
                sectionParts.push('');
            }

            // Duplicates
            if (duplicates.length > 0) {
                sectionParts.push(`### Duplicates (${duplicates.length})\n`);
                duplicates.forEach(it => {
                    const repoPrefix = it.repoFull ? `${it.repoFull}#${it.number}` : `#${it.number}`;
                    const title = it.title ? ` — ${it.title}` : '';
                    const status = it.state ? ` (${it.state})` : '';
                    sectionParts.push(`- [${repoPrefix}](${it.url})${title}${status}`);
                });
                sectionParts.push('');
            }

            // Commits
            if (commits.length > 0) {
                sectionParts.push(`### Commits (${commits.length})\n`);
                commits.forEach(c => {
                    const short = this._shortSha(c.sha);
                    const subject = c.subject ? ` — ${c.subject}` : '';
                    sectionParts.push(`- [${short}](${c.htmlUrl})${subject}`);
                });
                sectionParts.push('');
            }

            lines.push(sectionParts.join('\n'));
            return lines.join('\n');
        },

        // ───────────────────────────────────────────────────────────────────
        // Timeline (verbose / audit log)
        // ───────────────────────────────────────────────────────────────────

        generateTimelineSection(issue, timeline, commitDetailsBySha, settings) {
            const events = (timeline || []).filter(Boolean);

            // Always exclude commented from timeline: we export comments separately
            const filtered = events.filter(e => e.event !== 'commented');

            const lines = [];
            lines.push('\n---\n');
            lines.push('## Timeline (Verbose)\n');

            const includeEvent = (ev) => {
                switch (ev.event) {
                    case 'cross-referenced': return !!settings.TL_INCLUDE_CROSS_REFERENCED;
                    case 'referenced': return !!settings.TL_INCLUDE_REFERENCED;
                    case 'renamed': return !!settings.TL_INCLUDE_RENAMED;
                    case 'labeled':
                    case 'unlabeled': return !!settings.TL_INCLUDE_LABEL_CHANGES;
                    case 'added_to_project_v2':
                    case 'project_v2_item_status_changed': return !!settings.TL_INCLUDE_PROJECT_V2;
                    case 'subscribed':
                    case 'unsubscribed': return !!settings.TL_INCLUDE_SUBSCRIBE_EVENTS;
                    case 'mentioned': return !!settings.TL_INCLUDE_MENTIONED_EVENTS;
                    case 'marked_as_duplicate': return !!settings.TL_INCLUDE_MARKED_DUPLICATE_EVENTS;
                    case 'closed':
                    case 'reopened': return !!settings.TL_INCLUDE_CLOSED_EVENTS;
                    default: return false;
                }
            };

            const fmtActor = (ev) => ev?.actor?.login ? `@${ev.actor.login}` : 'someone';
            const fmtDate = (ev) => ev?.created_at ? Utils.formatDate(ev.created_at) : '';

            const fmtCrossRef = (ev) => {
                const src = ev?.source?.issue;
                if (!src) return '🔗 Cross-referenced another issue/PR';
                const repoFull = src?.repository?.full_name || '';
                const num = src?.number != null ? `#${src.number}` : '';
                const title = src?.title ? ` — ${src.title}` : '';
                const isPR = !!src?.pull_request;
                const kind = isPR ? 'PR' : 'Issue';
                return `🔗 ${kind} referenced: ${repoFull}${num}${title} (${src?.html_url || ''})`;
            };

            const fmtReferencedCommit = (ev) => {
                const sha = String(ev?.commit_id || '');
                const short = sha ? (sha.length > 7 ? sha.slice(0, 7) : sha) : 'commit';
                const info = (sha && commitDetailsBySha && commitDetailsBySha[sha]) ? commitDetailsBySha[sha] : null;
                const htmlUrl = info?.html_url || this._commitApiToHtmlUrl(ev?.commit_url || '', sha);
                const subject = info?.message ? String(info.message).split('\n')[0].trim() : '';
                const extra = subject ? ` — ${subject}` : '';
                return `🔗 Commit referenced: ${short} (${htmlUrl})${extra}`;
            };

            const fmtEvent = (ev) => {
                const actor = fmtActor(ev);
                switch (ev.event) {
                    case 'renamed': {
                        const from = ev?.rename?.from || '';
                        const to = ev?.rename?.to || '';
                        return `✏️ ${actor} renamed: "${from}" → "${to}"`;
                    }
                    case 'labeled':
                        return `🏷️ ${actor} added label \`${ev.label?.name || 'unknown'}\``;
                    case 'unlabeled':
                        return `🏷️ ${actor} removed label \`${ev.label?.name || 'unknown'}\``;
                    case 'closed':
                        return `🔴 Closed by ${actor}`;
                    case 'reopened':
                        return `🟢 Reopened by ${actor}`;
                    case 'marked_as_duplicate':
                        return `🔁 ${actor} marked an issue as duplicate`;
                    case 'added_to_project_v2':
                        return `📌 ${actor} added to project (Project v2)`;
                    case 'project_v2_item_status_changed':
                        return `📌 ${actor} changed project status (Project v2)`;
                    case 'subscribed':
                        return `🔔 ${actor} subscribed`;
                    case 'unsubscribed':
                        return `🔕 ${actor} unsubscribed`;
                    case 'mentioned':
                        return `💬 ${actor} mentioned someone`;
                    case 'cross-referenced':
                        return fmtCrossRef(ev);
                    case 'referenced':
                        return fmtReferencedCommit(ev);
                    default:
                        return `${ev.event} by ${actor}`;
                }
            };

            const relevant = filtered.filter(includeEvent);
            if (relevant.length === 0) {
                lines.push('*No timeline events selected (or none available).*');
                lines.push('');
                return lines.join('\n');
            }

            relevant.forEach(ev => {
                const date = fmtDate(ev);
                const desc = fmtEvent(ev);
                lines.push(`- ${date}: ${desc}`);
            });

            lines.push('');
            return lines.join('\n');
        }
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
            user-select: none;
        }
        .settings-panel {
            position: fixed;
            background: #0d1117;
            border: 1px solid #30363d;
            border-radius: 12px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif;
            font-size: 13px;
            color: #e6edf3;
            box-shadow: 0 8px 24px rgba(0,0,0,0.4);
            min-width: 280px;
            max-width: 340px;
            user-select: none;
            pointer-events: auto;
            z-index: 2147483647;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            opacity: 0;
            transform: translateY(-8px);
            transition: opacity 0.15s ease-out, transform 0.15s ease-out;
        }
        .settings-panel.visible {
            opacity: 1;
            transform: translateY(0);
        }
        .settings-panel .header {
            flex-shrink: 0;
            padding: 12px 16px;
            background: #161b22;
            border-bottom: 1px solid #30363d;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .settings-panel .header-title {
            font-weight: 600;
            font-size: 14px;
            color: #f0f6fc;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .settings-panel .header-title .badge {
            background: #238636;
            color: #fff;
            font-size: 10px;
            font-weight: 600;
            padding: 2px 6px;
            border-radius: 4px;
        }
        .settings-panel .close-button {
            width: 24px;
            height: 24px;
            border: none;
            background: transparent;
            color: #8b949e;
            font-size: 18px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 6px;
            padding: 0;
            transition: all 0.15s;
        }
        .settings-panel .close-button:hover {
            background: #30363d;
            color: #f0f6fc;
        }
        .settings-panel .content {
            flex: 1;
            min-height: 0;
            overflow-y: auto;
            overscroll-behavior: contain;
            padding: 16px;
        }
        .settings-panel .content::-webkit-scrollbar {
            width: 8px;
        }
        .settings-panel .content::-webkit-scrollbar-track {
            background: #21262d;
            border-radius: 4px;
        }
        .settings-panel .content::-webkit-scrollbar-thumb {
            background: #484f58;
            border-radius: 4px;
        }
        .settings-panel .group {
            margin-bottom: 16px;
        }
        .settings-panel .group:last-child {
            margin-bottom: 0;
        }
        .settings-panel .group-title {
            font-size: 11px;
            font-weight: 600;
            color: #8b949e;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 8px;
            padding-bottom: 6px;
            border-bottom: 1px solid #21262d;
        }
        .settings-panel label {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 6px 0;
            cursor: pointer;
            transition: color 0.15s;
        }
        .settings-panel label:hover {
            color: #58a6ff;
        }
        .settings-panel label.indent {
            padding-left: 24px;
            font-size: 12px;
            color: #8b949e;
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
            background: #161b22;
            color: #e6edf3;
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
            border: 1px solid #30363d;
            pointer-events: none;
            transition: opacity 0.15s ease-in-out, visibility 0.15s ease-in-out;
            transition-delay: 0s;
        }
        .settings-panel label[data-tooltip]:hover::after {
            visibility: visible;
            opacity: 1;
            transition-delay: 0.8s;
        }
        .settings-panel input[type="checkbox"] {
            width: 16px;
            height: 16px;
            cursor: pointer;
            accent-color: #238636;
            flex-shrink: 0;
        }
        .settings-panel .footer {
            flex-shrink: 0;
            padding: 12px 16px;
            border-top: 1px solid #30363d;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 8px;
            background: #0d1117;
        }
        .settings-panel .btn {
            border: 1px solid #30363d;
            padding: 6px 14px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.15s;
        }
        .settings-panel .btn-secondary {
            background: transparent;
            color: #8b949e;
        }
        .settings-panel .btn-secondary:hover {
            background: #21262d;
            color: #f0f6fc;
            border-color: #484f58;
        }
        .settings-panel .btn-primary {
            background: #238636;
            color: #fff;
            border-color: #238636;
        }
        .settings-panel .btn-primary:hover {
            background: #2ea043;
            border-color: #2ea043;
        }
        .settings-panel .kofi-btn {
            display: flex;
            align-items: center;
            gap: 6px;
            background: #238636;
            color: #fff;
            border: 1px solid #238636;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 500;
            cursor: pointer;
            text-decoration: none;
            transition: all 0.15s;
        }
        .settings-panel .kofi-btn:hover {
            background: #2ea043;
            border-color: #2ea043;
        }

    `;

    const FLAG_METADATA = {
        // Content
        INCLUDE_HEADER: { label: 'Include Header', group: 'Content', tooltip: 'Show repository, issue number, state, labels at top' },
        INCLUDE_LABELS: { label: 'Show Labels', group: 'Content', indent: true },
        INCLUDE_ASSIGNEES: { label: 'Show Assignees', group: 'Content', indent: true },
        INCLUDE_MILESTONE: { label: 'Show Milestone', group: 'Content', indent: true },
        INCLUDE_AUTHOR_INFO: { label: 'Show Authors', group: 'Content', tooltip: 'Show @username for issue and comments' },
        INCLUDE_REACTIONS: { label: 'Show Reactions', group: 'Content', tooltip: 'Show 👍 ❤️ 🎉 counts' },

        // Timestamps
        INCLUDE_TIMESTAMPS: { label: 'Show Timestamps', group: 'Timestamps' },
        INCLUDE_COMMENT_IDS: { label: 'Show Comment IDs', group: 'Timestamps', tooltip: 'Useful for linking to specific comments' },

        // References (deduped)
        INCLUDE_REFERENCES_SECTION: { label: 'Include References Section', group: 'References', tooltip: 'Adds a deduped, high-signal References section (recommended).' },
        REF_INCLUDE_CROSS_REFERENCED: { label: 'Include Cross References', group: 'References', indent: true, tooltip: 'Use timeline "cross-referenced" events to list related issues/PRs.' },
        REF_INCLUDE_SAME_REPO: { label: 'Include Same-Repo References', group: 'References', indent: true },
        REF_INCLUDE_CROSS_REPO: { label: 'Include Cross-Repo References', group: 'References', indent: true },
        REF_INCLUDE_ISSUES: { label: 'Include Issues', group: 'References', indent: true },
        REF_INCLUDE_PRS: { label: 'Include Pull Requests', group: 'References', indent: true },
        REF_INCLUDE_DUPLICATES: { label: 'Include Duplicates (Derived)', group: 'References', indent: true, tooltip: 'Duplicates are derived from cross-referenced issues labeled "duplicate".' },
        REF_INCLUDE_COMMITS: { label: 'Include Commit References', group: 'References', indent: true, tooltip: 'Includes commit SHAs from timeline "referenced" events.' },
        REF_FETCH_COMMIT_DETAILS: { label: 'Fetch Commit Details (slower)', group: 'References', indent: true, tooltip: 'Fetches commit messages via commit_url (extra API calls). Default OFF.' },

        // Timeline (verbose)
        INCLUDE_TIMELINE_SECTION: { label: 'Include Timeline (Verbose)', group: 'Timeline', tooltip: 'Adds a chronological audit log. Usually noisier than References.' },
        TL_INCLUDE_CROSS_REFERENCED: { label: 'Cross References', group: 'Timeline', indent: true },
        TL_INCLUDE_REFERENCED: { label: 'Commit References', group: 'Timeline', indent: true },
        TL_INCLUDE_RENAMED: { label: 'Title Changes', group: 'Timeline', indent: true },
        TL_INCLUDE_LABEL_CHANGES: { label: 'Label Changes', group: 'Timeline', indent: true },
        TL_INCLUDE_PROJECT_V2: { label: 'Project v2 Events', group: 'Timeline', indent: true },
        TL_INCLUDE_SUBSCRIBE_EVENTS: { label: 'Subscribe Events', group: 'Timeline', indent: true },
        TL_INCLUDE_MENTIONED_EVENTS: { label: 'Mentioned Events', group: 'Timeline', indent: true },
        TL_INCLUDE_MARKED_DUPLICATE_EVENTS: { label: 'Marked as Duplicate', group: 'Timeline', indent: true },
        TL_INCLUDE_CLOSED_EVENTS: { label: 'Closed/Reopened', group: 'Timeline', indent: true },

        // Formatting
        COLLAPSIBLE_LONG_COMMENTS: { label: 'Collapse Long Comments', group: 'Formatting', tooltip: 'Wrap comments > 500 chars in <details>' }
    };

    const FLAG_GROUP_ORDER = ['Content', 'Timestamps', 'References', 'Timeline', 'Formatting'];

    const SettingsPanel = {
        shadowHost: null,
        shadowRoot: null,
        panel: null,
        isOpen: false,
        checkboxRefs: {},
        closeHandler: null,
        escapeHandler: null,

        init() {
            if (this.shadowHost) return;

            this.shadowHost = document.createElement('div');
            this.shadowHost.id = 'gh-issue-export-settings-host';
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

            const style = document.createElement('style');
            style.textContent = PANEL_STYLES;
            this.shadowRoot.appendChild(style);

            document.body.appendChild(this.shadowHost);
        },

        buildPanel() {
            if (this.panel) {
                this.panel.remove();
                this.panel = null;
            }
            this.checkboxRefs = {};

            this.panel = document.createElement('div');
            this.panel.className = 'settings-panel';

            // Header
            const header = document.createElement('div');
            header.className = 'header';

            const headerTitle = document.createElement('div');
            headerTitle.className = 'header-title';
            headerTitle.innerHTML = `<span>Export Settings</span><span class="badge">GitHub Issues</span>`;

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

            // Content
            const content = document.createElement('div');
            content.className = 'content';

            // Group flags
            const groupedFlags = {};
            Object.entries(FLAG_METADATA).forEach(([key, meta]) => {
                const group = meta.group || 'Other';
                if (!groupedFlags[group]) groupedFlags[group] = [];
                groupedFlags[group].push({ name: key, ...meta });
            });

            // Render groups
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
                    if (flag.tooltip) label.setAttribute('data-tooltip', flag.tooltip);

                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.id = `setting-${flag.name}`;
                    checkbox.checked = Settings.get(flag.name);

                    checkbox.addEventListener('change', (e) => {
                        e.stopPropagation();
                        Settings.save(flag.name, checkbox.checked);
                        this.updateDependentStates();
                    });

                    const text = document.createTextNode(flag.label);
                    label.appendChild(checkbox);
                    label.appendChild(text);
                    groupDiv.appendChild(label);

                    this.checkboxRefs[flag.name] = { checkbox, label };
                });

                content.appendChild(groupDiv);
            });

            this.panel.appendChild(content);

            // Footer
            const footer = document.createElement('div');
            footer.className = 'footer';

            const resetButton = document.createElement('button');
            resetButton.className = 'btn btn-secondary';
            resetButton.textContent = 'Reset';
            resetButton.addEventListener('click', (e) => {
                e.stopPropagation();
                Settings.reset();
                this.refreshCheckboxes();
            });

            // Ko-Fi donation button
            const kofiLink = document.createElement('a');
            kofiLink.className = 'kofi-btn';
            kofiLink.href = 'https://ko-fi.com/piknockyou';
            kofiLink.target = '_blank';
            kofiLink.rel = 'noopener noreferrer';
            kofiLink.title = 'Support this script on Ko-Fi';
            kofiLink.textContent = '☕ Support';
            kofiLink.addEventListener('click', (e) => {
                e.stopPropagation();
            });

            footer.appendChild(kofiLink);
            footer.appendChild(resetButton);
            this.panel.appendChild(footer);

            // Block events
            this.panel.addEventListener('mousedown', (e) => e.stopPropagation());
            this.panel.addEventListener('mouseup', (e) => e.stopPropagation());
            this.panel.addEventListener('click', (e) => e.stopPropagation());

            // Scroll containment - prevent page scroll when at panel boundaries
            this.panel.addEventListener('wheel', (e) => {
                const scrollable = e.target.closest('.content');
                if (scrollable) {
                    const isScrollable = scrollable.scrollHeight > scrollable.clientHeight;
                    const atTop = scrollable.scrollTop === 0;
                    const atBottom = scrollable.scrollTop + scrollable.clientHeight >= scrollable.scrollHeight - 1;

                    if (isScrollable) {
                        if ((e.deltaY < 0 && atTop) || (e.deltaY > 0 && atBottom)) {
                            e.preventDefault();
                        }
                    }
                }
                e.stopPropagation();
            }, { passive: false });

            this.shadowRoot.appendChild(this.panel);
            this.updateDependentStates();

            // Trigger animation
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    this.panel.classList.add('visible');
                });
            });

            return this.panel;
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

        updateDependentStates() {
            const settings = Settings.load();

            // Header sub-options depend on INCLUDE_HEADER
            ['INCLUDE_LABELS', 'INCLUDE_ASSIGNEES', 'INCLUDE_MILESTONE'].forEach(key => {
                if (this.checkboxRefs[key]) {
                    const enabled = settings.INCLUDE_HEADER;
                    this.checkboxRefs[key].label.classList.toggle('disabled', !enabled);
                    this.checkboxRefs[key].checkbox.disabled = !enabled;
                }
            });

            // References sub-options depend on INCLUDE_REFERENCES_SECTION
            const refSub = [
                'REF_INCLUDE_CROSS_REFERENCED',
                'REF_INCLUDE_SAME_REPO',
                'REF_INCLUDE_CROSS_REPO',
                'REF_INCLUDE_ISSUES',
                'REF_INCLUDE_PRS',
                'REF_INCLUDE_DUPLICATES',
                'REF_INCLUDE_COMMITS',
                'REF_FETCH_COMMIT_DETAILS'
            ];
            refSub.forEach(key => {
                if (this.checkboxRefs[key]) {
                    const enabled = settings.INCLUDE_REFERENCES_SECTION;
                    this.checkboxRefs[key].label.classList.toggle('disabled', !enabled);
                    this.checkboxRefs[key].checkbox.disabled = !enabled;
                }
            });

            // Cross-reference filters depend on REF_INCLUDE_CROSS_REFERENCED
            const crossRefSub = [
                'REF_INCLUDE_SAME_REPO',
                'REF_INCLUDE_CROSS_REPO',
                'REF_INCLUDE_ISSUES',
                'REF_INCLUDE_PRS',
                'REF_INCLUDE_DUPLICATES'
            ];
            crossRefSub.forEach(key => {
                if (this.checkboxRefs[key]) {
                    const enabled = settings.INCLUDE_REFERENCES_SECTION && settings.REF_INCLUDE_CROSS_REFERENCED;
                    this.checkboxRefs[key].label.classList.toggle('disabled', !enabled);
                    this.checkboxRefs[key].checkbox.disabled = !enabled;
                }
            });

            // Commit details depends on REF_INCLUDE_COMMITS
            if (this.checkboxRefs.REF_FETCH_COMMIT_DETAILS) {
                const enabled = settings.INCLUDE_REFERENCES_SECTION && settings.REF_INCLUDE_COMMITS;
                this.checkboxRefs.REF_FETCH_COMMIT_DETAILS.label.classList.toggle('disabled', !enabled);
                this.checkboxRefs.REF_FETCH_COMMIT_DETAILS.checkbox.disabled = !enabled;
            }

            // Timeline sub-options depend on INCLUDE_TIMELINE_SECTION
            const tlSub = [
                'TL_INCLUDE_CROSS_REFERENCED',
                'TL_INCLUDE_REFERENCED',
                'TL_INCLUDE_RENAMED',
                'TL_INCLUDE_LABEL_CHANGES',
                'TL_INCLUDE_PROJECT_V2',
                'TL_INCLUDE_SUBSCRIBE_EVENTS',
                'TL_INCLUDE_MENTIONED_EVENTS',
                'TL_INCLUDE_MARKED_DUPLICATE_EVENTS',
                'TL_INCLUDE_CLOSED_EVENTS'
            ];
            tlSub.forEach(key => {
                if (this.checkboxRefs[key]) {
                    const enabled = settings.INCLUDE_TIMELINE_SECTION;
                    this.checkboxRefs[key].label.classList.toggle('disabled', !enabled);
                    this.checkboxRefs[key].checkbox.disabled = !enabled;
                }
            });
        },

        refreshCheckboxes() {
            const settings = Settings.load();
            Object.keys(this.checkboxRefs).forEach(key => {
                const ref = this.checkboxRefs[key];
                if (ref && ref.checkbox) {
                    ref.checkbox.checked = settings[key];
                }
            });
            this.updateDependentStates();
        },

        show(anchorElement) {
            if (!this.shadowHost) this.init();
            if (!document.body.contains(this.shadowHost)) {
                document.body.appendChild(this.shadowHost);
            }

            this.buildPanel();

            if (!this.panel) return;

            // Get button position and calculate best panel position
            const rect = anchorElement.getBoundingClientRect();
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            const margin = 8;

            // Force a deterministic width that can never overflow the viewport
            const panelWidth = Math.max(220, Math.min(340, vw - 2 * margin));

            const pos = this.calculateBestPosition(rect, panelWidth);
            log('Best position calculated:', pos);

            // Apply size - width fixed, height auto with max
            this.panel.style.width = `${panelWidth}px`;
            this.panel.style.maxWidth = `${panelWidth}px`;
            this.panel.style.minWidth = '0px';
            this.panel.style.height = 'auto';
            this.panel.style.bottom = 'auto';

            // Apply horizontal position
            this.panel.style.left = `${Math.max(margin, Math.min(pos.left, vw - panelWidth - margin))}px`;
            this.panel.style.right = 'auto';

            // Apply vertical position and max-height based on placement kind
            if (pos.kind === 'below') {
                // Below button: anchor to button bottom, grow downward up to viewport bottom
                this.panel.style.top = `${rect.bottom + margin}px`;
                this.panel.style.maxHeight = `${vh - rect.bottom - 2 * margin}px`;
            } else if (pos.kind === 'above') {
                // Above button: anchor to button top, grow upward
                // Use bottom positioning so panel grows upward from anchor point
                this.panel.style.top = 'auto';
                this.panel.style.bottom = `${vh - rect.top + margin}px`;
                this.panel.style.maxHeight = `${rect.top - 2 * margin}px`;
            } else if (pos.kind === 'left' || pos.kind === 'right') {
                // Side placement: align top with button, but clamp to viewport
                // Max height is full viewport minus margins
                const maxH = vh - 2 * margin;
                this.panel.style.maxHeight = `${maxH}px`;

                // Start aligned with button top
                let top = rect.top;

                // Measure panel height after maxHeight is set
                this.panel.style.top = `${top}px`;
                const panelHeight = this.panel.getBoundingClientRect().height;

                // If panel would overflow bottom, shift it up
                if (top + panelHeight + margin > vh) {
                    top = vh - panelHeight - margin;
                }

                // Clamp to not go above viewport
                top = Math.max(margin, top);

                this.panel.style.top = `${top}px`;
            } else {
                // Overlay fallback: centered, full available height
                this.panel.style.top = `${margin}px`;
                this.panel.style.maxHeight = `${vh - 2 * margin}px`;
            }

            this.isOpen = true;

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
                // Animate out
                this.panel.classList.remove('visible');
                setTimeout(() => {
                    if (this.panel) {
                        this.panel.remove();
                        this.panel = null;
                    }
                }, 150);
            }
            this.isOpen = false;
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

        toggle(anchorElement) {
            if (this.isOpen) {
                this.hide();
            } else {
                this.show(anchorElement);
            }
        }
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // CUSTOM TOOLTIP (Material Design style, viewport-aware positioning)
    // ═══════════════════════════════════════════════════════════════════════════

    const Tooltip = {
        element: null,
        currentTarget: null,
        showTimeout: null,

        init() {
            if (this.element) return;

            this.element = document.createElement('div');
            this.element.id = 'gh-issue-export-tooltip';
            Object.assign(this.element.style, {
                position: 'fixed',
                background: '#161b22',
                border: '1px solid #30363d',
                borderRadius: '6px',
                padding: '8px 12px',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                fontSize: '12px',
                fontWeight: '500',
                color: '#e6edf3',
                boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                zIndex: (CONFIG.Z_INDEX + 1).toString(), // Above FAB
                pointerEvents: 'none',
                opacity: '0',
                visibility: 'hidden',
                transition: 'opacity 0.15s ease, visibility 0.15s ease',
                whiteSpace: 'pre-line',
                textAlign: 'center',
                lineHeight: '1.4',
                maxWidth: '280px'
            });

            document.body.appendChild(this.element);
        },

        /**
         * Calculate best position for tooltip that keeps it fully visible
         */
        calculatePosition(targetRect) {
            const margin = 8;
            const gap = 10; // Gap between target and tooltip

            // Measure tooltip (temporarily show off-screen to get dimensions)
            this.element.style.visibility = 'hidden';
            this.element.style.opacity = '0';
            this.element.style.left = '-9999px';
            this.element.style.top = '-9999px';

            const tooltipRect = this.element.getBoundingClientRect();
            const tooltipWidth = tooltipRect.width;
            const tooltipHeight = tooltipRect.height;

            const vw = window.innerWidth;
            const vh = window.innerHeight;

            // Available space in each direction
            const spaceAbove = targetRect.top - margin;
            const spaceBelow = vh - targetRect.bottom - margin;
            const spaceLeft = targetRect.left - margin;
            const spaceRight = vw - targetRect.right - margin;

            let left, top;

            // Prefer positioning above, then below, then sides
            if (spaceAbove >= tooltipHeight + gap) {
                // Above target
                top = targetRect.top - tooltipHeight - gap;
                left = targetRect.left + (targetRect.width / 2) - (tooltipWidth / 2);
            } else if (spaceBelow >= tooltipHeight + gap) {
                // Below target
                top = targetRect.bottom + gap;
                left = targetRect.left + (targetRect.width / 2) - (tooltipWidth / 2);
            } else if (spaceRight >= tooltipWidth + gap) {
                // Right of target
                left = targetRect.right + gap;
                top = targetRect.top + (targetRect.height / 2) - (tooltipHeight / 2);
            } else if (spaceLeft >= tooltipWidth + gap) {
                // Left of target
                left = targetRect.left - tooltipWidth - gap;
                top = targetRect.top + (targetRect.height / 2) - (tooltipHeight / 2);
            } else {
                // Fallback: center in viewport
                left = (vw - tooltipWidth) / 2;
                top = Math.max(margin, targetRect.top - tooltipHeight - gap);
            }

            // Clamp to viewport
            left = Math.max(margin, Math.min(left, vw - tooltipWidth - margin));
            top = Math.max(margin, Math.min(top, vh - tooltipHeight - margin));

            return { left, top };
        },

        show(target, text) {
            if (!this.element) this.init();

            this.currentTarget = target;
            this.element.textContent = text;

            const rect = target.getBoundingClientRect();
            const pos = this.calculatePosition(rect);

            this.element.style.left = `${pos.left}px`;
            this.element.style.top = `${pos.top}px`;
            this.element.style.visibility = 'visible';
            this.element.style.opacity = '1';
        },

        hide() {
            if (this.showTimeout) {
                clearTimeout(this.showTimeout);
                this.showTimeout = null;
            }
            if (this.element) {
                this.element.style.opacity = '0';
                this.element.style.visibility = 'hidden';
            }
            this.currentTarget = null;
        },

        scheduleShow(target, text, delay = 500) {
            this.hide();
            this.showTimeout = setTimeout(() => {
                this.show(target, text);
            }, delay);
        },

        destroy() {
            this.hide();
            if (this.element) {
                this.element.remove();
                this.element = null;
            }
        }
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // ONBOARDING BANNER (First-run hint)
    // ═══════════════════════════════════════════════════════════════════════════

    const OnboardingBanner = {
        element: null,

        isDismissed() {
            return GM_getValue(CONFIG.ONBOARDING_DISMISSED_KEY, false) === true;
        },

        dismiss(permanent = false) {
            if (permanent) {
                GM_setValue(CONFIG.ONBOARDING_DISMISSED_KEY, true);
            }
            if (this.element) {
                this.element.style.opacity = '0';
                this.element.style.transform = 'translateY(10px)';
                setTimeout(() => {
                    this.element?.remove();
                    this.element = null;
                }, 200);
            }
        },

        show(anchorEl) {
            if (this.isDismissed()) return;
            if (this.element) return;
            if (!anchorEl) return;

            const banner = document.createElement('div');
            banner.id = 'gh-issue-export-onboarding';

            Object.assign(banner.style, {
                position: 'fixed',
                background: 'linear-gradient(135deg, #238636 0%, #2ea043 100%)',
                color: '#fff',
                padding: '16px 20px',
                borderRadius: '12px',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                fontSize: '13px',
                zIndex: (CONFIG.Z_INDEX - 1).toString(),
                boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
                lineHeight: '1.6',
                maxWidth: '320px',
                opacity: '0',
                transform: 'translateY(10px)',
                transition: 'opacity 0.3s ease-out, transform 0.3s ease-out'
            });

            banner.innerHTML = `
                <div style="font-weight: 700; font-size: 14px; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 18px;">📥</span>
                    <span>GitHub Issue Exporter</span>
                </div>
                <div style="margin-bottom: 14px;">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                        <span>🖱️</span>
                        <span><strong>Left-click</strong> — Export to Markdown</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                        <span>⚙️</span>
                        <span><strong>Right-click</strong> — Open settings</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span>✋</span>
                        <span><strong>Right-drag</strong> — Move button</span>
                    </div>
                </div>
                <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.2);">
                    <label style="display: flex; align-items: center; gap: 6px; font-size: 11px; opacity: 0.9; cursor: pointer;">
                        <input type="checkbox" id="gh-onboarding-dismiss" style="cursor: pointer; accent-color: #fff; width: 14px; height: 14px;">
                        Don't show again
                    </label>
                    <button id="gh-onboarding-close" style="background: rgba(255,255,255,0.2); border: none; color: #fff; padding: 6px 14px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; transition: background 0.15s;">
                        Got it!
                    </button>
                </div>
            `;

            document.body.appendChild(banner);
            this.element = banner;

            // Position relative to button
            const btnRect = anchorEl.getBoundingClientRect();
            const bannerWidth = 320;
            const margin = 16;

            // Determine best position
            const buttonInTopHalf = btnRect.top < window.innerHeight / 2;
            const buttonInLeftHalf = btnRect.left < window.innerWidth / 2;

            let top, left;

            if (buttonInTopHalf) {
                top = btnRect.bottom + margin;
            } else {
                top = btnRect.top - banner.offsetHeight - margin;
            }

            if (buttonInLeftHalf) {
                left = Math.max(margin, btnRect.left - 10);
            } else {
                left = Math.min(window.innerWidth - bannerWidth - margin, btnRect.right - bannerWidth + 10);
            }

            // Clamp to viewport
            top = Math.max(margin, Math.min(top, window.innerHeight - banner.offsetHeight - margin));
            left = Math.max(margin, Math.min(left, window.innerWidth - bannerWidth - margin));

            banner.style.top = `${top}px`;
            banner.style.left = `${left}px`;

            // Animate in
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    banner.style.opacity = '1';
                    banner.style.transform = 'translateY(0)';
                });
            });

            // Event handlers
            const checkbox = banner.querySelector('#gh-onboarding-dismiss');
            const closeBtn = banner.querySelector('#gh-onboarding-close');

            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.dismiss(checkbox?.checked || false);
            });

            closeBtn.addEventListener('mouseenter', () => {
                closeBtn.style.background = 'rgba(255,255,255,0.3)';
            });
            closeBtn.addEventListener('mouseleave', () => {
                closeBtn.style.background = 'rgba(255,255,255,0.2)';
            });

            // Auto-dismiss after 15 seconds
            setTimeout(() => {
                if (this.element) {
                    this.dismiss(false);
                }
            }, 15000);
        }
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // UI COMPONENTS (Shadow DOM Isolated FAB)
    // ═══════════════════════════════════════════════════════════════════════════

    const UI = {
        shadowHost: null,
        shadowRoot: null,
        btn: null,
        dragOverlay: null,
        isDragging: false,
        isExporting: false,
        dragMoved: false,
        abortController: null,

        // SVG icons for different states
        ICONS: {
            download: `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>`,
            loading: `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" style="animation: gh-spin 1s linear infinite;">
                <circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="12"/>
            </svg>`,
            cancel: `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>`,
            success: `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="8 12 11 15 16 9"/>
            </svg>`,
            error: `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>`
        },

        init() {
            // Create Shadow DOM host for isolation
            this.shadowHost = document.createElement('div');
            this.shadowHost.id = 'gh-issue-export-host';
            Object.assign(this.shadowHost.style, {
                position: 'fixed',
                top: '0',
                left: '0',
                width: '0',
                height: '0',
                overflow: 'visible',
                zIndex: CONFIG.Z_INDEX.toString(),
                pointerEvents: 'none',
                // Selection prevention at host level
                userSelect: 'none',
                webkitUserSelect: 'none',
                msUserSelect: 'none',
                MozUserSelect: 'none'
            });

            this.shadowRoot = this.shadowHost.attachShadow({ mode: 'closed' });

            // Inject styles into shadow DOM
            const style = document.createElement('style');
            style.textContent = `
                :host {
                    all: initial;
                }
                * {
                    box-sizing: border-box;
                    user-select: none !important;
                }
                @keyframes gh-spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .fab {
                    position: fixed;
                    width: ${CONFIG.BUTTON_SIZE}px;
                    height: ${CONFIG.BUTTON_SIZE}px;
                    border-radius: 50%;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    user-select: none;
                    transition: background-color 0.2s, transform 0.1s;
                    color: #fff;
                    pointer-events: auto;
                }
                .fab:hover {
                    transform: scale(1.05);
                }
                .fab.dragging {
                    cursor: grabbing;
                    transform: scale(1.02);
                }
                .fab svg {
                    width: 24px;
                    height: 24px;
                }
            `;
            this.shadowRoot.appendChild(style);

            // Create FAB button
            const btn = document.createElement('div');
            btn.className = 'fab';
            safeSetInnerHTML(btn, this.ICONS.download);

            this.loadPosition(btn);

            // Left-click: Export or Abort
            btn.addEventListener('click', (e) => {
                if (e.button === 0 && !this.isDragging && !this.dragMoved) {
                    Tooltip.hide();
                    if (this.isExporting && this.abortController) {
                        this.abortController.abort();
                        this.toast('Export cancelled', 'info');
                    } else {
                        this.export();
                    }
                }
            });

            // Right-click: Settings (if no drag)
            btn.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                e.stopPropagation();
                Tooltip.hide();
                if (!this.dragMoved) {
                    SettingsPanel.toggle(btn);
                }
                this.dragMoved = false;
            });

            // Right-drag to move
            btn.addEventListener('mousedown', (e) => {
                if (e.button === 2) {
                    e.preventDefault();
                    this.dragMoved = false;
                    this.startDrag(e);
                }
            });

            // Hover: show custom tooltip
            btn.addEventListener('mouseenter', () => {
                if (!this.isDragging) {
                    if (!this.isExporting) {
                        Tooltip.scheduleShow(btn, 'Export Issue to Markdown\n\nLeft-click: Export\nRight-click: Settings\nRight-drag: Move', 600);
                    } else {
                        Tooltip.scheduleShow(btn, 'Click to cancel export', 300);
                    }
                }
            });

            btn.addEventListener('mouseleave', () => {
                if (!this.isDragging) {
                    Tooltip.hide();
                }
            });

            this.shadowRoot.appendChild(btn);
            document.body.appendChild(this.shadowHost);

            this.btn = btn;
            window.addEventListener('resize', () => this.applyPosition());
            this.updateButtonState('ready');

            // Show onboarding banner after short delay
            setTimeout(() => {
                OnboardingBanner.show(btn);
            }, 1000);
        },

        loadPosition(btn) {
            const saved = GM_getValue(CONFIG.POSITION_STORAGE_KEY, null);
            if (saved) {
                try {
                    const pos = typeof saved === 'string' ? JSON.parse(saved) : saved;
                    this.setPosition(btn, pos.ratioX, pos.ratioY);
                } catch (e) {
                    // Default: bottom-left
                    this.setPosition(btn, 0.02, 0.85);
                }
            } else {
                // Default: bottom-left
                this.setPosition(btn, 0.02, 0.85);
            }
        },

        setPosition(btn, rx, ry) {
            const maxX = window.innerWidth - CONFIG.BUTTON_SIZE - 10;
            const maxY = window.innerHeight - CONFIG.BUTTON_SIZE - 10;
            btn.style.left = `${Math.max(10, rx * maxX)}px`;
            btn.style.top = `${Math.max(10, ry * maxY)}px`;
        },

        applyPosition() {
            if (!this.btn) return;
            const saved = GM_getValue(CONFIG.POSITION_STORAGE_KEY, null);
            if (saved) {
                try {
                    const pos = typeof saved === 'string' ? JSON.parse(saved) : saved;
                    this.setPosition(this.btn, pos.ratioX, pos.ratioY);
                } catch (e) { /* ignore */ }
            }
        },

        /**
         * Create full-viewport overlay to capture all pointer events during drag
         */
        createDragOverlay() {
            const overlay = document.createElement('div');
            Object.assign(overlay.style, {
                position: 'fixed',
                top: '0',
                left: '0',
                width: '100vw',
                height: '100vh',
                zIndex: (CONFIG.Z_INDEX - 1).toString(),
                cursor: 'grabbing',
                background: 'transparent'
            });
            document.body.appendChild(overlay);
            return overlay;
        },

        startDrag(e) {
            this.isDragging = true;
            Tooltip.hide();

            const rect = this.btn.getBoundingClientRect();
            const startX = e.clientX;
            const startY = e.clientY;
            const offX = e.clientX - rect.left;
            const offY = e.clientY - rect.top;

            // Create overlay to prevent hover states on page elements
            this.dragOverlay = this.createDragOverlay();
            this.btn.classList.add('dragging');

            const onMove = (ev) => {
                ev.preventDefault();
                ev.stopPropagation();

                const dx = Math.abs(ev.clientX - startX);
                const dy = Math.abs(ev.clientY - startY);

                if (dx > 5 || dy > 5) {
                    this.dragMoved = true;
                }

                if (this.dragMoved) {
                    const x = Math.max(10, Math.min(window.innerWidth - CONFIG.BUTTON_SIZE - 10, ev.clientX - offX));
                    const y = Math.max(10, Math.min(window.innerHeight - CONFIG.BUTTON_SIZE - 10, ev.clientY - offY));
                    this.btn.style.left = `${x}px`;
                    this.btn.style.top = `${y}px`;
                }
            };

            const onUp = (ev) => {
                ev.preventDefault();
                ev.stopPropagation();

                // Remove overlay
                if (this.dragOverlay) {
                    this.dragOverlay.remove();
                    this.dragOverlay = null;
                }

                this.btn.classList.remove('dragging');
                document.removeEventListener('mousemove', onMove, true);
                document.removeEventListener('mouseup', onUp, true);

                if (this.dragMoved) {
                    const finalRect = this.btn.getBoundingClientRect();
                    const maxX = window.innerWidth - CONFIG.BUTTON_SIZE - 10;
                    const maxY = window.innerHeight - CONFIG.BUTTON_SIZE - 10;
                    const rx = maxX > 0 ? finalRect.left / maxX : 0.02;
                    const ry = maxY > 0 ? finalRect.top / maxY : 0.85;
                    GM_setValue(CONFIG.POSITION_STORAGE_KEY, { ratioX: rx, ratioY: ry });
                }

                // Delay clearing isDragging to prevent click from firing
                setTimeout(() => {
                    this.isDragging = false;
                }, 100);
            };

            // Use capture phase to intercept before page handlers
            document.addEventListener('mousemove', onMove, true);
            document.addEventListener('mouseup', onUp, true);
        },

        updateButtonState(state, message = '') {
            if (!this.btn) return;

            const colors = {
                ready: CONFIG.BUTTON_COLOR_READY,
                loading: CONFIG.BUTTON_COLOR_LOADING,
                success: CONFIG.BUTTON_COLOR_SUCCESS,
                error: CONFIG.BUTTON_COLOR_ERROR
            };

            const icons = {
                ready: this.ICONS.download,
                loading: this.ICONS.cancel,
                success: this.ICONS.success,
                error: this.ICONS.error
            };

            this.btn.style.backgroundColor = colors[state] || colors.ready;
            safeSetInnerHTML(this.btn, icons[state] || icons.ready);
        },

        async export() {
            const issueInfo = Utils.parseIssueUrl();
            if (!issueInfo) {
                this.toast('Not a valid issue page', 'error');
                return;
            }

            // Close settings and onboarding if open
            SettingsPanel.hide();
            OnboardingBanner.dismiss();

            this.isExporting = true;
            this.abortController = new AbortController();
            this.updateButtonState('loading');

            try {
                const { owner, repo, issueNumber } = issueInfo;
                const signal = this.abortController.signal;

                // Check for abort
                if (signal.aborted) throw new Error('Cancelled');

                // Fetch issue
                const issue = await GitHubAPI.fetchIssue(owner, repo, issueNumber, signal);

                if (signal.aborted) throw new Error('Cancelled');

                // Fetch comments
                let comments = [];
                if (issue.comments > 0) {
                    comments = await GitHubAPI.fetchAllComments(owner, repo, issueNumber, (count) => {
                        // Progress callback (optional)
                    }, signal);
                }

                if (signal.aborted) throw new Error('Cancelled');

                // Decide whether we need timeline at all
                const settings = Settings.load();

                const needsTimeline =
                    settings.INCLUDE_REFERENCES_SECTION ||
                    settings.INCLUDE_TIMELINE_SECTION;

                let timeline = [];
                if (needsTimeline) {
                    timeline = await GitHubAPI.fetchTimeline(owner, repo, issueNumber, signal);
                }

                if (signal.aborted) throw new Error('Cancelled');

                // Optional: Fetch commit details (extra API calls; default OFF)
                const commitDetailsBySha = {};
                if (needsTimeline && settings.INCLUDE_REFERENCES_SECTION && settings.REF_INCLUDE_COMMITS && settings.REF_FETCH_COMMIT_DETAILS) {
                    const referenced = (timeline || []).filter(e => e && e.event === 'referenced' && e.commit_id && e.commit_url);
                    const unique = new Map();
                    referenced.forEach(e => {
                        const sha = String(e.commit_id || '');
                        const url = String(e.commit_url || '');
                        if (sha && url && !unique.has(sha)) unique.set(sha, url);
                    });

                    for (const [sha, commitApiUrl] of unique.entries()) {
                        if (signal.aborted) throw new Error('Cancelled');

                        try {
                            const c = await GitHubAPI.fetchCommit(commitApiUrl, signal);
                            commitDetailsBySha[sha] = {
                                html_url: c?.html_url || null,
                                message: c?.commit?.message || null
                            };
                        } catch (e) {
                            // Graceful degrade: keep export working even if commit fetch fails / rate limit
                            warn('Commit fetch failed for', sha, e?.message || e);
                        }
                    }
                }

                if (signal.aborted) throw new Error('Cancelled');

                // Generate Markdown
                const markdown = MarkdownGenerator.generate(issue, comments, timeline, commitDetailsBySha, settings);

                // Download
                const filename = `${Utils.sanitizeFilename(issue.title)}_${owner}_${repo}_${issueNumber}.md`;
                this.downloadFile(markdown, filename);

                this.updateButtonState('success');
                this.toast(`Exported ${comments.length + 1} messages`, 'success');

                setTimeout(() => {
                    this.updateButtonState('ready');
                }, 2000);

            } catch (err) {
                if (err.message === 'Cancelled') {
                    this.updateButtonState('ready');
                } else {
                    error('Export failed:', err);
                    this.updateButtonState('error');
                    this.toast(`Export failed: ${err.message}`, 'error');

                    setTimeout(() => {
                        this.updateButtonState('ready');
                    }, 3000);
                }
            } finally {
                this.isExporting = false;
                this.abortController = null;
            }
        },

        downloadFile(content, filename) {
            const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        },

        toast(message, type = 'info') {
            // Remove existing toasts
            document.querySelectorAll('.gh-issue-export-toast').forEach(el => el.remove());

            const toast = document.createElement('div');
            toast.className = 'gh-issue-export-toast';
            toast.textContent = message;

            const bgColors = {
                info: '#1f6feb',
                success: '#238636',
                error: '#da3633'
            };

            // Position near the button if possible, with viewport awareness
            let bottom = '80px';
            let left = '50%';
            let transform = 'translateX(-50%)';

            if (this.btn) {
                const btnRect = this.btn.getBoundingClientRect();
                const margin = 20;
                const toastHeight = 50; // Approximate

                // Determine vertical position
                const spaceAbove = btnRect.top;
                const spaceBelow = window.innerHeight - btnRect.bottom;

                if (spaceBelow > toastHeight + margin) {
                    // Show below button
                    bottom = `${window.innerHeight - btnRect.bottom - toastHeight - margin}px`;
                } else if (spaceAbove > toastHeight + margin) {
                    // Show above button
                    bottom = `${window.innerHeight - btnRect.top + margin}px`;
                }

                // Horizontal alignment near button, clamped to viewport
                const toastWidth = 200; // Approximate
                let leftPos = btnRect.left + btnRect.width / 2;
                leftPos = Math.max(toastWidth / 2 + margin, Math.min(leftPos, window.innerWidth - toastWidth / 2 - margin));
                left = `${leftPos}px`;
            }

            Object.assign(toast.style, {
                position: 'fixed',
                bottom: bottom,
                left: left,
                transform: transform,
                background: bgColors[type] || bgColors.info,
                color: '#fff',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                fontWeight: '500',
                zIndex: CONFIG.Z_INDEX.toString(),
                opacity: '0',
                transition: 'opacity 0.3s, transform 0.3s',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                pointerEvents: 'none'
            });

            document.body.appendChild(toast);

            requestAnimationFrame(() => {
                toast.style.opacity = '1';
            });

            setTimeout(() => {
                toast.style.opacity = '0';
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        },

        /**
         * Clean up all UI elements
         */
        destroy() {
            Tooltip.destroy();

            if (this.dragOverlay) {
                this.dragOverlay.remove();
                this.dragOverlay = null;
            }

            if (this.shadowHost) {
                this.shadowHost.remove();
                this.shadowHost = null;
                this.shadowRoot = null;
                this.btn = null;
            }

            // Also clean up legacy non-shadow elements if they exist
            const legacyBtn = document.getElementById('gh-issue-export-btn');
            if (legacyBtn) legacyBtn.remove();

            const legacyTooltip = document.getElementById('gh-issue-export-tooltip');
            if (legacyTooltip) legacyTooltip.remove();
        }
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // INITIALIZATION
    // ═══════════════════════════════════════════════════════════════════════════

    const init = () => {
        // Only show on issue pages
        const issueInfo = Utils.parseIssueUrl();
        if (!issueInfo) {
            log('Not an issue page, skipping initialization');
            return;
        }

        log(`Initializing for ${issueInfo.owner}/${issueInfo.repo}#${issueInfo.issueNumber}`);

        UI.init();
    };

    // Wait for DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Handle SPA navigation with proper cleanup
    let lastUrl = location.href;
    const observer = new MutationObserver(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            log('Navigation detected:', location.href);

            // Clean up all existing UI elements
            UI.destroy();
            SettingsPanel.hide();
            OnboardingBanner.dismiss();

            // Re-initialize if on issue page
            setTimeout(init, 500);
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

})();