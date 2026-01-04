// ==UserScript==
// @name         Claude Browser Automation Helpers
// @namespace    https://greasyfork.org/en/users/1409954-mevanlc
// @version      1.5
// @description  Helper functions for Claude browser automation - ChatGPT, BigQuery, and general web tools
// @author       mevanlc
// @match        https://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559807/Claude%20Browser%20Automation%20Helpers.user.js
// @updateURL https://update.greasyfork.org/scripts/559807/Claude%20Browser%20Automation%20Helpers.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==========================================
    // CHATGPT HELPERS
    // ==========================================
    const chatGPT = {
        getLastResponse: function() {
            const articles = document.querySelectorAll('article');
            if (!articles.length) return 'No messages found';
            const last = articles[articles.length - 1];
            const prose = last.querySelector('.prose');
            return prose ? prose.innerText : last.innerText;
        },

        getCodeBlocks: function() {
            const articles = document.querySelectorAll('article');
            if (!articles.length) return [];
            const last = articles[articles.length - 1];
            return Array.from(last.querySelectorAll('pre')).map(function(b) { return b.innerText; });
        },

        getCodeBlock: function(n) {
            const blocks = this.getCodeBlocks();
            return blocks[n] || 'No code block at index ' + n;
        },

        getAllMessages: function() {
            const msgs = [];
            document.querySelectorAll('article').forEach(function(a, i) {
                const prose = a.querySelector('.prose');
                const isUser = a.querySelector('[data-message-author-role="user"]') !== null;
                const text = prose ? prose.innerText : a.innerText;
                msgs.push({
                    index: i,
                    role: isUser ? 'user' : 'assistant',
                    preview: text.substring(0, 300),
                    full: text
                });
            });
            return msgs;
        },

        getAsMarkdown: function() {
            let md = '# ' + document.title + '\n\n';
            this.getAllMessages().forEach(function(m, i) {
                const num = Math.floor(i/2) + 1;
                if (m.role === 'user') {
                    md += '## User ' + num + '\n\n' + m.full + '\n\n';
                } else {
                    md += '## Assistant ' + num + '\n\n' + m.full + '\n\n';
                }
            });
            return md;
        },

        isGenerating: function() {
            return document.querySelector('button[aria-label="Stop generating"]') !== null;
        },

        waitForResponse: function(timeout) {
            timeout = timeout || 60000;
            const self = this;
            return new Promise(function(resolve) {
                const start = Date.now();
                const check = setInterval(function() {
                    if (!self.isGenerating() || Date.now() - start > timeout) {
                        clearInterval(check);
                        resolve(self.getLastResponse());
                    }
                }, 500);
            });
        },

        setMessage: function(text) {
            const editor = document.querySelector('textarea').parentNode.querySelector('[contenteditable]');
            if (!editor) return false;
            editor.innerText = text;
            editor.dispatchEvent(new Event('input', { bubbles: true }));
            return true;
        },

        sendMessage: function(text) {
            if (!this.setMessage(text)) return false;
            const btn = document.querySelector('button[data-testid="send-button"]');
            if (btn) { btn.click(); return true; }
            return false;
        }
    };

    // ==========================================
    // BIGQUERY HELPERS
    // ==========================================
    const bigQuery = {
        getEstimate: function() {
            const el = document.querySelector('.query-validation-status');
            return el ? el.innerText : 'No estimate found';
        },

        getQuery: function() {
            if (window.monaco) {
                const models = monaco.editor.getModels();
                return models.length ? models[0].getValue() : '';
            }
            const lines = document.querySelectorAll('.view-line');
            return Array.from(lines).map(function(l) { return l.textContent; }).join('\n');
        },

        hasErrors: function() {
            const status = document.querySelector('.query-validation-status');
            return status && status.innerText.toLowerCase().includes('error');
        },

        getResultsInfo: function() {
            const info = document.querySelector('[data-testid="query-results-info"]');
            return info ? info.innerText : 'No results info';
        }
    };

    // ==========================================
    // GENERAL DOM HELPERS
    // ==========================================
    const dom = {
        waitFor: function(selector, timeout) {
            timeout = timeout || 10000;
            return new Promise(function(resolve, reject) {
                const el = document.querySelector(selector);
                if (el) return resolve(el);
                const observer = new MutationObserver(function() {
                    const el = document.querySelector(selector);
                    if (el) { observer.disconnect(); resolve(el); }
                });
                observer.observe(document.body, {childList: true, subtree: true});
                setTimeout(function() { observer.disconnect(); reject('Timeout waiting for ' + selector); }, timeout);
            });
        },

        getText: function(selector) {
            const el = document.querySelector(selector);
            return el ? el.innerText.trim() : '';
        },

        getAllText: function(selector) {
            return Array.from(document.querySelectorAll(selector)).map(function(el) { return el.innerText.trim(); });
        },

        exists: function(selector) {
            return document.querySelector(selector) !== null;
        },

        getRect: function(selector) {
            const el = document.querySelector(selector);
            return el ? el.getBoundingClientRect() : null;
        }
    };

    // ==========================================
    // FORM HELPERS
    // ==========================================
    const forms = {
        setValue: function(selector, value) {
            const el = document.querySelector(selector);
            if (!el) return false;
            el.value = value;
            el.dispatchEvent(new Event('input', {bubbles: true}));
            el.dispatchEvent(new Event('change', {bubbles: true}));
            return true;
        },

        getFormData: function(formSelector) {
            const form = document.querySelector(formSelector);
            if (!form) return {};
            return Object.fromEntries(new FormData(form));
        }
    };

    // ==========================================
    // HELP SYSTEM
    // ==========================================
    const help = function() {
        return {
            _README: [ "# Claude Browser Helpers – Usage Guide",
                      "- **PREFER DOM INJECTION** over typing when entering text into web pages.",
                      "- DOM injection is faster and more reliable than simulating keystrokes.",
                      "- Use `forms.setValue()` for standard inputs, or site-specific methods like `chatGPT.setMessage()`.",
                      "- Ask the user for assistance if it is not obvious how to inject vs. type on a given page.",
                      "- Store frequently-used helper functions in window scope to avoid regenerating code.",
                      "- **BACKSLASH ESCAPING:** Use 4 backslashes in `javascript_tool` to get 1 in executed code:",
                      "- `/\\\\\\\\s+/` in tool becomes `/\\s+/` in browser.",
                      "- Access all helpers via: `window.claudeHelpers.{module}.{function}()`" ],
            _SKILLS: {
                title: "Gist-Hosted Skills (fetch when needed)",
                items: [
                    {
                        name: "Userscript Development Instructions",
                        url: "https://gist.githubusercontent.com/mike-clark-8192/c4f3d5d30a0a651014e84b503a3819e9/raw",
                        when: "When helping user write or modify userscripts/Tampermonkey scripts"
                    },
                    {
                        name: "Tampermonkey's user.js Reference Doc (verbose and technical)",
                        url: "https://www.tampermonkey.net/documentation.php",
                        when: "When doing advanced userscripting, especially involving GM.*/GM_* and Tampermonkey APIs"
                    },
                    {
                        name: "GreasyFork Publishing Guide",
                        url: "https://gist.githubusercontent.com/mike-clark-8192/0c2e3e7fa248c8c6688094b5d5ac9597/raw",
                        when: "When publishing or updating scripts on greasyfork.org"
                    }
                ]
            },            chatGPT: {
                _domains: ["chatgpt.com", "chat.openai.com"],
                getLastResponse: {
                    desc: 'Get text content of the last assistant message',
                    params: [],
                    returns: 'string'
                },
                getCodeBlocks: {
                    desc: 'Get all code blocks from the last assistant response',
                    params: [],
                    returns: 'string[]'
                },
                getCodeBlock: {
                    desc: 'Get a specific code block by index',
                    params: ['n: number - zero-based index'],
                    returns: 'string'
                },
                getAllMessages: {
                    desc: 'Get all messages with role and content info',
                    params: [],
                    returns: '{index, role, preview, full}[]'
                },
                getAsMarkdown: {
                    desc: 'Export entire conversation as markdown',
                    params: [],
                    returns: 'string'
                },
                isGenerating: {
                    desc: 'Check if ChatGPT is currently generating a response',
                    params: [],
                    returns: 'boolean'
                },
                waitForResponse: {
                    desc: 'Wait for response generation to complete',
                    params: ['timeout?: number - ms, default 60000'],
                    returns: 'Promise<string>'
                },
                setMessage: {
                    desc: 'Set text in the chat input box (does not send)',
                    params: ['text: string - message to set'],
                    returns: 'boolean - success'
                },
                sendMessage: {
                    desc: 'Set text and click send button',
                    params: ['text: string - message to send'],
                    returns: 'boolean - success'
                }
            },
            bigQuery: {
                _domains: ["console.cloud.google.com"],
                getEstimate: {
                    desc: 'Get the current query data estimate from status bar',
                    params: [],
                    returns: 'string'
                },
                getQuery: {
                    desc: 'Get the current query text from the editor',
                    params: [],
                    returns: 'string'
                },
                hasErrors: {
                    desc: 'Check if the current query has validation errors',
                    params: [],
                    returns: 'boolean'
                },
                getResultsInfo: {
                    desc: 'Get query results info (row count, etc)',
                    params: [],
                    returns: 'string'
                }
            },
            dom: {
                _domains: ["* (all sites)"],
                waitFor: {
                    desc: 'Wait for an element to appear in the DOM',
                    params: ['selector: string', 'timeout?: number - ms, default 10000'],
                    returns: 'Promise<Element>'
                },
                getText: {
                    desc: 'Get trimmed innerText of first matching element',
                    params: ['selector: string'],
                    returns: 'string'
                },
                getAllText: {
                    desc: 'Get trimmed innerText of all matching elements',
                    params: ['selector: string'],
                    returns: 'string[]'
                },
                exists: {
                    desc: 'Check if an element exists',
                    params: ['selector: string'],
                    returns: 'boolean'
                },
                getRect: {
                    desc: 'Get bounding rect of an element',
                    params: ['selector: string'],
                    returns: 'DOMRect | null'
                }
            },
            forms: {
                _domains: ["* (all sites)"],
                setValue: {
                    desc: 'Set input value with proper events (input + change)',
                    params: ['selector: string', 'value: string'],
                    returns: 'boolean - success'
                },
                getFormData: {
                    desc: 'Get all form field values as object',
                    params: ['formSelector: string'],
                    returns: 'object'
                }
            }
        };
    };

    // ==========================================
    // EXPOSE TO WINDOW
    // ==========================================
    window.claudeHelpers = {
        chatGPT: chatGPT,
        bigQuery: bigQuery,
        dom: dom,
        forms: forms,
        help: help,
        version: '1.1'
    };

    console.log(`Claude Browser Helpers ${GM_info.script.version} loaded! Access via window.claudeHelpers — use .help() for documentation`);
})();