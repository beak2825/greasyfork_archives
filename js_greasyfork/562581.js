// ==UserScript==
// @name         Codeforces Inline Submit
// @namespace    https://codeforces.com
// @version      1.0
// @description  Adds a submission form directly on Codeforces problem pages for quick code submission without leaving the page.
// @author       awad
// @license      GPL3
// @match        https://codeforces.com/contest/*/problem/*
// @match        https://codeforces.com/problemset/problem/*/*
// @match        https://codeforces.com/gym/*/problem/*
// @match        https://codeforces.com/group/*/contest/*/problem/*
// @grant        none
// @run-at       document-end
// @require      https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/codemirror.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/addon/mode/simple.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/mode/clike/clike.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/mode/python/python.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/mode/javascript/javascript.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/mode/ruby/ruby.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/mode/go/go.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/mode/rust/rust.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/mode/haskell/haskell.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/mode/htmlmixed/htmlmixed.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/mode/xml/xml.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/mode/css/css.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/mode/php/php.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/addon/edit/closebrackets.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/addon/edit/matchbrackets.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/addon/selection/active-line.min.js
// @downloadURL https://update.greasyfork.org/scripts/562581/Codeforces%20Inline%20Submit.user.js
// @updateURL https://update.greasyfork.org/scripts/562581/Codeforces%20Inline%20Submit.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* ───────────────────────────────────────────────────────────────────────
     * Load CodeMirror CSS
     * ─────────────────────────────────────────────────────────────────────── */

    const cmCSS = document.createElement('link');
    cmCSS.rel = 'stylesheet';
    cmCSS.href = 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/codemirror.min.css';
    document.head.appendChild(cmCSS);

    const cmTheme = document.createElement('link');
    cmTheme.rel = 'stylesheet';
    cmTheme.href = 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/theme/dracula.min.css';
    document.head.appendChild(cmTheme);

    /* ───────────────────────────────────────────────────────────────────────
     * Configuration
     * ─────────────────────────────────────────────────────────────────────── */

    const LANGUAGES = [
        { id: '89', name: 'GNU GCC C11 5.1.0', mode: 'text/x-csrc' },
        { id: '43', name: 'GNU GCC C11 5.1.0', mode: 'text/x-csrc' },
        { id: '80', name: 'Clang++20 Diagnostics', mode: 'text/x-c++src' },
        { id: '91', name: 'GNU G++23 14.2 (64 bit, winlibs)', mode: 'text/x-c++src' },
        { id: '73', name: 'GNU G++20 13.2 (64 bit, winlibs)', mode: 'text/x-c++src' },
        { id: '54', name: 'GNU G++17 7.3.0', mode: 'text/x-c++src' },
        { id: '52', name: 'Clang++17 Diagnostics', mode: 'text/x-c++src' },
        { id: '50', name: 'GNU G++14 6.4.0', mode: 'text/x-c++src' },
        { id: '31', name: 'Python 3.8.10', mode: 'python' },
        { id: '40', name: 'Python 2.7.18', mode: 'python' },
        { id: '41', name: 'PyPy 2.7.18 (7.3.9)', mode: 'python' },
        { id: '70', name: 'PyPy 3.10 (7.3.15, 64bit)', mode: 'python' },
        { id: '60', name: 'Java 21 64bit', mode: 'text/x-java' },
        { id: '87', name: 'Java 8 32bit', mode: 'text/x-java' },
        { id: '83', name: 'Kotlin 1.9.21', mode: 'text/x-kotlin' },
        { id: '65', name: 'C# 8, .NET Core 3.1', mode: 'text/x-csharp' },
        { id: '79', name: 'C# 10, .NET SDK 6.0', mode: 'text/x-csharp' },
        { id: '55', name: 'JavaScript V8 4.8.0', mode: 'javascript' },
        { id: '74', name: 'Node.js 15.8.0 (64bit)', mode: 'javascript' },
        { id: '67', name: 'Ruby 3.2.2', mode: 'ruby' },
        { id: '75', name: 'Rust 1.75.0 (2021)', mode: 'rust' },
        { id: '32', name: 'Go 1.22.2', mode: 'go' },
        { id: '64', name: 'Haskell GHC 8.10.1', mode: 'haskell' },
        { id: '61', name: 'PHP 8.1.7', mode: 'php' },
        { id: '12', name: 'Haskell GHC 8.10.1', mode: 'haskell' },
        { id: '36', name: 'Scala 3.4.0', mode: 'text/x-scala' },
    ];

    const STORAGE_KEY = 'cf-inline-submit-language';
    let codeEditor = null; // CodeMirror instance

    /* ───────────────────────────────────────────────────────────────────────
     * Utility Functions
     * ─────────────────────────────────────────────────────────────────────── */

    /**
     * Gets problem info from URL
     */
    function getProblemInfo() {
        const url = window.location.href;

        // Group contest problem: /group/{groupId}/contest/{contestId}/problem/{problemIndex}
        let match = url.match(/\/group\/([A-Za-z0-9]+)\/contest\/(\d+)\/problem\/([A-Za-z0-9]+)/);
        if (match) {
            return { groupId: match[1], contestId: match[2], problemIndex: match[3], type: 'group' };
        }

        // Contest problem: /contest/{contestId}/problem/{problemIndex}
        match = url.match(/\/contest\/(\d+)\/problem\/([A-Za-z0-9]+)/);
        if (match) {
            return { contestId: match[1], problemIndex: match[2], type: 'contest' };
        }

        // Gym problem: /gym/{contestId}/problem/{problemIndex}
        match = url.match(/\/gym\/(\d+)\/problem\/([A-Za-z0-9]+)/);
        if (match) {
            return { contestId: match[1], problemIndex: match[2], type: 'gym' };
        }

        // Problemset: /problemset/problem/{contestId}/{problemIndex}
        match = url.match(/\/problemset\/problem\/(\d+)\/([A-Za-z0-9]+)/);
        if (match) {
            return { contestId: match[1], problemIndex: match[2], type: 'problemset' };
        }

        return null;
    }

    /**
     * Gets CSRF token from the page
     */
    function getCsrfToken() {
        const meta = document.querySelector('meta[name="X-Csrf-Token"]');
        if (meta) return meta.getAttribute('content');

        // Try to find it in a form
        const csrfInput = document.querySelector('input[name="csrf_token"]');
        if (csrfInput) return csrfInput.value;

        // Try to find in script
        const scripts = document.querySelectorAll('script');
        for (const script of scripts) {
            const match = script.textContent.match(/csrf_token\s*[=:]\s*["']([^"']+)["']/);
            if (match) return match[1];
        }

        return null;
    }

    /**
     * Saves selected language to localStorage
     */
    function saveLanguage(langId) {
        localStorage.setItem(STORAGE_KEY, langId);
    }

    /**
     * Loads saved language from localStorage
     */
    function loadLanguage() {
        return localStorage.getItem(STORAGE_KEY) || '91'; // Default to G++23
    }

    /* ───────────────────────────────────────────────────────────────────────
     * UI Creation
     * ─────────────────────────────────────────────────────────────────────── */

    function createSubmitForm() {
        const problemInfo = getProblemInfo();
        if (!problemInfo) {
            console.log('Codeforces Inline Submit: Could not parse problem info from URL');
            return;
        }

        // Create floating button
        const floatingBtn = document.createElement('button');
        floatingBtn.id = 'cf-submit-floating-btn';
        floatingBtn.innerHTML = '📤 Submit';
        document.body.appendChild(floatingBtn);

        // Create popup overlay
        const overlay = document.createElement('div');
        overlay.id = 'cf-submit-overlay';
        overlay.innerHTML = `
            <style>
                #cf-submit-floating-btn {
                    position: fixed;
                    bottom: 30px;
                    right: 30px;
                    z-index: 99999;
                    padding: 14px 24px;
                    background: linear-gradient(135deg, #1a5cc8 0%, #1248a0 100%);
                    color: white;
                    border: none;
                    border-radius: 50px;
                    font-size: 15px;
                    font-weight: bold;
                    cursor: pointer;
                    box-shadow: 0 4px 15px rgba(26, 92, 200, 0.4);
                    transition: all 0.3s ease;
                    font-family: Verdana, Arial, sans-serif;
                }

                #cf-submit-floating-btn:hover {
                    transform: translateY(-3px) scale(1.05);
                    box-shadow: 0 6px 20px rgba(26, 92, 200, 0.5);
                }

                #cf-submit-floating-btn:active {
                    transform: translateY(-1px);
                }

                #cf-submit-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    z-index: 100000;
                    display: none;
                    justify-content: center;
                    align-items: center;
                    backdrop-filter: blur(3px);
                }

                #cf-submit-overlay.visible {
                    display: flex;
                }

                #cf-inline-submit-container {
                    width: 90%;
                    max-width: 700px;
                    max-height: 90vh;
                    overflow-y: auto;
                    padding: 25px;
                    background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%);
                    border: 1px solid #c5c5c5;
                    border-radius: 12px;
                    font-family: Verdana, Arial, sans-serif;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
                    animation: cf-popup-in 0.3s ease;
                }

                @keyframes cf-popup-in {
                    from {
                        opacity: 0;
                        transform: scale(0.9) translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }

                #cf-inline-submit-container .submit-header {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 15px;
                    padding-bottom: 10px;
                    border-bottom: 2px solid #1a5cc8;
                }

                #cf-inline-submit-container .submit-header h3 {
                    margin: 0;
                    color: #1a5cc8;
                    font-size: 16px;
                    font-weight: bold;
                }

                #cf-inline-submit-container .submit-header .problem-badge {
                    background: #1a5cc8;
                    color: white;
                    padding: 4px 12px;
                    border-radius: 4px;
                    font-size: 12px;
                    font-weight: bold;
                }

                #cf-inline-submit-container .form-row {
                    display: flex;
                    gap: 15px;
                    margin-bottom: 15px;
                    align-items: flex-start;
                }

                #cf-inline-submit-container .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
                }

                #cf-inline-submit-container label {
                    font-size: 12px;
                    color: #333;
                    font-weight: bold;
                }

                #cf-inline-submit-container select {
                    padding: 8px 12px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    font-size: 13px;
                    min-width: 250px;
                    background: white;
                    cursor: pointer;
                }

                #cf-inline-submit-container select:focus {
                    outline: none;
                    border-color: #1a5cc8;
                    box-shadow: 0 0 0 2px rgba(26, 92, 200, 0.2);
                }

                #cf-inline-submit-container textarea {
                    width: 100%;
                    min-height: 300px;
                    padding: 12px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
                    font-size: 13px;
                    line-height: 1.5;
                    resize: vertical;
                    background: #fafafa;
                    box-sizing: border-box;
                    display: none;
                }

                #cf-inline-submit-container .CodeMirror {
                    height: 350px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    font-size: 13px;
                    line-height: 1.5;
                }

                #cf-inline-submit-container .CodeMirror,
                #cf-inline-submit-container .CodeMirror * {
                    user-select: text !important;
                    -webkit-user-select: text !important;
                }

                #cf-inline-submit-container .CodeMirror-scroll {
                    min-height: 350px;
                }

                #cf-inline-submit-container .editor-container {
                    position: relative;
                    border-radius: 4px;
                    overflow: hidden;
                }

                #cf-inline-submit-container .editor-toolbar {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 8px 12px;
                    background: #2d2d2d;
                    border-bottom: 1px solid #444;
                }

                #cf-inline-submit-container .editor-toolbar .theme-toggle {
                    margin-left: auto;
                    padding: 4px 10px;
                    background: #444;
                    color: #fff;
                    border: none;
                    border-radius: 3px;
                    font-size: 11px;
                    cursor: pointer;
                    transition: background 0.2s;
                }

                #cf-inline-submit-container .editor-toolbar .theme-toggle:hover {
                    background: #555;
                }

                #cf-inline-submit-container .editor-toolbar span {
                    color: #aaa;
                    font-size: 11px;
                }

                #cf-inline-submit-container textarea:focus {
                    outline: none;
                    border-color: #1a5cc8;
                    box-shadow: 0 0 0 2px rgba(26, 92, 200, 0.2);
                    background: white;
                }

                #cf-inline-submit-container .button-row {
                    display: flex;
                    gap: 10px;
                    align-items: center;
                    margin-top: 15px;
                }

                #cf-inline-submit-container .submit-btn {
                    padding: 10px 25px;
                    background: linear-gradient(135deg, #1a5cc8 0%, #1248a0 100%);
                    color: white;
                    border: none;
                    border-radius: 5px;
                    font-size: 14px;
                    font-weight: bold;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    box-shadow: 0 2px 6px rgba(26, 92, 200, 0.3);
                }

                #cf-inline-submit-container .submit-btn:hover {
                    background: linear-gradient(135deg, #1248a0 0%, #0d3a80 100%);
                    box-shadow: 0 4px 10px rgba(26, 92, 200, 0.4);
                    transform: translateY(-1px);
                }

                #cf-inline-submit-container .submit-btn:disabled {
                    background: #999;
                    cursor: not-allowed;
                    transform: none;
                    box-shadow: none;
                }

                #cf-inline-submit-container .file-input-wrapper {
                    position: relative;
                }

                #cf-inline-submit-container .file-btn {
                    padding: 10px 20px;
                    background: #6c757d;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    font-size: 13px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                #cf-inline-submit-container .file-btn:hover {
                    background: #5a6268;
                }

                #cf-inline-submit-container .file-input {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    opacity: 0;
                    cursor: pointer;
                }

                #cf-inline-submit-container .status-message {
                    padding: 10px 15px;
                    border-radius: 4px;
                    font-size: 13px;
                    margin-top: 15px;
                    display: none;
                }

                #cf-inline-submit-container .status-message.success {
                    display: block;
                    background: #d4edda;
                    color: #155724;
                    border: 1px solid #c3e6cb;
                }

                #cf-inline-submit-container .status-message.error {
                    display: block;
                    background: #f8d7da;
                    color: #721c24;
                    border: 1px solid #f5c6cb;
                }

                #cf-inline-submit-container .status-message.loading {
                    display: block;
                    background: #d1ecf1;
                    color: #0c5460;
                    border: 1px solid #bee5eb;
                }

                #cf-inline-submit-container .toggle-btn {
                    background: none;
                    border: none;
                    color: #1a5cc8;
                    cursor: pointer;
                    font-size: 18px;
                    padding: 5px 10px;
                    margin-left: auto;
                    transition: all 0.2s ease;
                }

                #cf-inline-submit-container .toggle-btn:hover {
                    color: #dc3545;
                    transform: scale(1.1);
                }

                #cf-inline-submit-container .form-content {
                    overflow: hidden;
                }

                #cf-inline-submit-container .char-count {
                    font-size: 11px;
                    color: #666;
                    text-align: right;
                    margin-top: 5px;
                }

                #cf-inline-submit-container .submissions-link {
                    margin-left: auto;
                }

                #cf-inline-submit-container .submissions-link a {
                    color: #1a5cc8;
                    text-decoration: none;
                    font-size: 13px;
                }

                #cf-inline-submit-container .submissions-link a:hover {
                    text-decoration: underline;
                }

                #cf-inline-submit-container .verdict-container {
                    margin-top: 15px;
                    padding: 15px;
                    background: white;
                    border: 1px solid #ddd;
                    border-radius: 6px;
                    display: none;
                }

                #cf-inline-submit-container .verdict-container.visible {
                    display: block;
                }

                #cf-inline-submit-container .verdict-header {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 10px;
                    font-weight: bold;
                    font-size: 14px;
                }

                #cf-inline-submit-container .verdict-header .submission-id {
                    color: #1a5cc8;
                }

                #cf-inline-submit-container .verdict-status {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 10px 15px;
                    border-radius: 4px;
                    font-size: 14px;
                    font-weight: bold;
                }

                #cf-inline-submit-container .verdict-status.waiting {
                    background: #fff3cd;
                    color: #856404;
                    border: 1px solid #ffc107;
                }

                #cf-inline-submit-container .verdict-status.running {
                    background: #d1ecf1;
                    color: #0c5460;
                    border: 1px solid #17a2b8;
                }

                #cf-inline-submit-container .verdict-status.accepted {
                    background: #d4edda;
                    color: #155724;
                    border: 1px solid #28a745;
                }

                #cf-inline-submit-container .verdict-status.rejected {
                    background: #f8d7da;
                    color: #721c24;
                    border: 1px solid #dc3545;
                }

                #cf-inline-submit-container .verdict-status.compilation-error {
                    background: #e2e3e5;
                    color: #383d41;
                    border: 1px solid #6c757d;
                }

                #cf-inline-submit-container .verdict-details {
                    margin-top: 10px;
                    font-size: 12px;
                    color: #666;
                    display: flex;
                    gap: 20px;
                    flex-wrap: wrap;
                }

                #cf-inline-submit-container .verdict-details span {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }

                #cf-inline-submit-container .spinner {
                    display: inline-block;
                    width: 16px;
                    height: 16px;
                    border: 2px solid #ccc;
                    border-top-color: #1a5cc8;
                    border-radius: 50%;
                    animation: cf-spin 1s linear infinite;
                }

                @keyframes cf-spin {
                    to { transform: rotate(360deg); }
                }

                #cf-inline-submit-container .progress-bar {
                    height: 4px;
                    background: #e9ecef;
                    border-radius: 2px;
                    margin-top: 10px;
                    overflow: hidden;
                }

                #cf-inline-submit-container .progress-bar .progress {
                    height: 100%;
                    background: linear-gradient(90deg, #1a5cc8, #28a745);
                    transition: width 0.3s ease;
                    width: 0%;
                }
            </style>

            <div id="cf-inline-submit-container">
                <div class="submit-header">
                    <h3>📤 Quick Submit</h3>
                    <span class="problem-badge">Problem ${problemInfo.problemIndex}</span>
                    <div class="submissions-link">
                        <a href="${getSubmissionsUrl(problemInfo)}" target="_blank">View My Submissions →</a>
                    </div>
                    <button class="toggle-btn" id="cf-close-popup" title="Close">✕</button>
                </div>

                <div class="form-content" id="cf-form-content">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="cf-language">Language:</label>
                            <select id="cf-language">
                                ${LANGUAGES.map(lang =>
                                    `<option value="${lang.id}">${lang.name}</option>`
                                ).join('')}
                            </select>
                        </div>

                        <div class="form-group file-input-wrapper">
                            <label>&nbsp;</label>
                            <button class="file-btn">📁 Load from File</button>
                            <input type="file" class="file-input" id="cf-file-input" accept=".cpp,.c,.py,.java,.js,.kt,.rs,.go,.rb,.hs,.cs,.scala,.php,.txt">
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="cf-source-code">Source Code:</label>
                        <div class="editor-container">
                            <div class="editor-toolbar">
                                <span id="cf-editor-mode">Mode: C++</span>
                                <span id="cf-editor-lines">Lines: 0</span>
                                <button type="button" class="theme-toggle" id="cf-theme-toggle">🌙 Dark</button>
                            </div>
                            <textarea id="cf-source-code" placeholder="Paste your code here or load from file..."></textarea>
                        </div>
                        <div class="char-count"><span id="cf-char-count">0</span> characters</div>
                    </div>

                    <div class="button-row">
                        <button class="submit-btn" id="cf-submit-btn">🚀 Submit Solution</button>
                    </div>

                    <div class="status-message" id="cf-status-message"></div>

                    <div class="verdict-container" id="cf-verdict-container">
                        <div class="verdict-header">
                            <span>Submission</span>
                            <span class="submission-id" id="cf-submission-id">#</span>
                            <a href="#" id="cf-submission-link" target="_blank" style="margin-left: auto; font-size: 12px; color: #1a5cc8;">View Details →</a>
                        </div>
                        <div class="verdict-status waiting" id="cf-verdict-status">
                            <span class="spinner"></span>
                            <span id="cf-verdict-text">In queue...</span>
                        </div>
                        <div class="progress-bar" id="cf-progress-bar">
                            <div class="progress" id="cf-progress"></div>
                        </div>
                        <div class="verdict-details" id="cf-verdict-details">
                            <span id="cf-verdict-time">⏱️ Time: --</span>
                            <span id="cf-verdict-memory">💾 Memory: --</span>
                            <span id="cf-verdict-test">📝 Test: --</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        // Initialize event handlers
        initEventHandlers(problemInfo, floatingBtn, overlay);
    }

    /**
     * Gets the submissions URL for the current problem
     */
    function getSubmissionsUrl(problemInfo) {
        if (problemInfo.type === 'group') {
            return `/group/${problemInfo.groupId}/contest/${problemInfo.contestId}/my`;
        } else if (problemInfo.type === 'contest') {
            return `/contest/${problemInfo.contestId}/my`;
        } else if (problemInfo.type === 'gym') {
            return `/gym/${problemInfo.contestId}/my`;
        } else {
            return `/problemset/status?friends=on`;
        }
    }

    /**
     * Gets the CodeMirror mode for a language ID
     */
    function getLanguageMode(langId) {
        const lang = LANGUAGES.find(l => l.id === langId);
        return lang ? lang.mode : 'text/x-c++src';
    }

    /**
     * Initialize all event handlers
     */
    function initEventHandlers(problemInfo, floatingBtn, overlay) {
        const langSelect = document.getElementById('cf-language');
        const sourceCode = document.getElementById('cf-source-code');
        const submitBtn = document.getElementById('cf-submit-btn');
        const fileInput = document.getElementById('cf-file-input');
        const closeBtn = document.getElementById('cf-close-popup');
        const charCount = document.getElementById('cf-char-count');
        const statusMessage = document.getElementById('cf-status-message');
        const themeToggle = document.getElementById('cf-theme-toggle');
        const editorMode = document.getElementById('cf-editor-mode');
        const editorLines = document.getElementById('cf-editor-lines');

        let isDarkTheme = true;

        // Initialize CodeMirror
        const initCodeMirror = () => {
            if (typeof CodeMirror === 'undefined') {
                // CodeMirror not loaded yet, retry
                setTimeout(initCodeMirror, 100);
                return;
            }

            if (codeEditor) return; // Already initialized

            const savedLang = loadLanguage();
            const mode = getLanguageMode(savedLang);

            codeEditor = CodeMirror.fromTextArea(sourceCode, {
                mode: mode,
                theme: 'dracula',
                lineNumbers: true,
                indentUnit: 4,
                tabSize: 4,
                indentWithTabs: false,
                lineWrapping: false,
                matchBrackets: true,
                autoCloseBrackets: true,
                styleActiveLine: true,
                inputStyle: 'contenteditable', // Better paste support
                spellcheck: false,
                autocorrect: false,
                autocapitalize: false,
                extraKeys: {
                    'Tab': (cm) => {
                        if (cm.somethingSelected()) {
                            cm.indentSelection('add');
                        } else {
                            cm.replaceSelection('    ', 'end');
                        }
                    },
                    'Ctrl-Enter': () => {
                        submitBtn.click();
                    },
                    'Cmd-Enter': () => {
                        submitBtn.click();
                    }
                }
            });

            // Ensure paste works properly
            codeEditor.on('paste', (cm, e) => {
                // Let CodeMirror handle the paste naturally
                // This event handler ensures paste events are not blocked
            });

            // Update character count and line count on change
            codeEditor.on('change', () => {
                const code = codeEditor.getValue();
                charCount.textContent = code.length;
                editorLines.textContent = `Lines: ${codeEditor.lineCount()}`;
            });

            // Update mode display
            const langName = LANGUAGES.find(l => l.id === savedLang)?.name || 'C++';
            editorMode.textContent = `Mode: ${langName.split(' ')[0]}`;
        };

        // Open popup
        floatingBtn.addEventListener('click', () => {
            overlay.classList.add('visible');
            // Initialize CodeMirror when popup opens (lazy loading)
            setTimeout(() => {
                initCodeMirror();
                if (codeEditor) {
                    codeEditor.refresh();
                    codeEditor.focus();
                }
            }, 100);
        });

        // Prevent Codeforces page from intercepting keyboard events in the editor
        const container = document.getElementById('cf-inline-submit-container');
        container.addEventListener('keydown', (e) => {
            e.stopPropagation();
        });
        container.addEventListener('keypress', (e) => {
            e.stopPropagation();
        });
        container.addEventListener('keyup', (e) => {
            e.stopPropagation();
        });
        container.addEventListener('paste', (e) => {
            e.stopPropagation();
        });
        container.addEventListener('copy', (e) => {
            e.stopPropagation();
        });
        container.addEventListener('cut', (e) => {
            e.stopPropagation();
        });

        // Close popup - X button
        closeBtn.addEventListener('click', () => {
            overlay.classList.remove('visible');
        });

        // Close popup - click outside
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.remove('visible');
            }
        });

        // Close popup - Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && overlay.classList.contains('visible')) {
                overlay.classList.remove('visible');
            }
        });

        // Load saved language
        langSelect.value = loadLanguage();

        // Language change handler
        langSelect.addEventListener('change', () => {
            const langId = langSelect.value;
            saveLanguage(langId);

            // Update CodeMirror mode
            if (codeEditor) {
                const mode = getLanguageMode(langId);
                codeEditor.setOption('mode', mode);

                const langName = LANGUAGES.find(l => l.id === langId)?.name || 'C++';
                editorMode.textContent = `Mode: ${langName.split(' ')[0]}`;
            }
        });

        // Theme toggle
        themeToggle.addEventListener('click', () => {
            isDarkTheme = !isDarkTheme;
            if (codeEditor) {
                codeEditor.setOption('theme', isDarkTheme ? 'dracula' : 'default');
            }
            themeToggle.textContent = isDarkTheme ? '🌙 Dark' : '☀️ Light';
        });

        // File input handler
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    if (codeEditor) {
                        codeEditor.setValue(event.target.result);
                    } else {
                        sourceCode.value = event.target.result;
                    }
                    charCount.textContent = event.target.result.length;

                    // Auto-detect language from file extension
                    const ext = file.name.split('.').pop().toLowerCase();
                    const langMap = {
                        'cpp': '91', 'cc': '91', 'cxx': '91',
                        'c': '43',
                        'py': '70',
                        'java': '60',
                        'js': '74',
                        'kt': '83',
                        'rs': '75',
                        'go': '32',
                        'rb': '67',
                        'hs': '64',
                        'cs': '79',
                        'scala': '36',
                        'php': '61',
                    };
                    if (langMap[ext]) {
                        langSelect.value = langMap[ext];
                        saveLanguage(langMap[ext]);

                        // Update CodeMirror mode
                        if (codeEditor) {
                            const mode = getLanguageMode(langMap[ext]);
                            codeEditor.setOption('mode', mode);

                            const langName = LANGUAGES.find(l => l.id === langMap[ext])?.name || 'C++';
                            editorMode.textContent = `Mode: ${langName.split(' ')[0]}`;
                        }
                    }
                };
                reader.readAsText(file);
            }
        });

        // Submit handler
        submitBtn.addEventListener('click', async () => {
            const code = codeEditor ? codeEditor.getValue().trim() : sourceCode.value.trim();
            if (!code) {
                showStatus('error', 'Please enter your source code.');
                return;
            }

            const lang = langSelect.value;
            await submitSolution(problemInfo, lang, code, statusMessage, submitBtn);
        });
    }

    /**
     * Shows status message
     */
    function showStatus(type, message) {
        const statusMessage = document.getElementById('cf-status-message');
        statusMessage.className = 'status-message ' + type;
        statusMessage.innerHTML = message;
    }

    /**
     * Gets the submission details URL
     */
    function getSubmissionDetailsUrl(problemInfo, submissionId) {
        if (problemInfo.type === 'group') {
            return `/group/${problemInfo.groupId}/contest/${problemInfo.contestId}/submission/${submissionId}`;
        } else if (problemInfo.type === 'contest') {
            return `/contest/${problemInfo.contestId}/submission/${submissionId}`;
        } else if (problemInfo.type === 'gym') {
            return `/gym/${problemInfo.contestId}/submission/${submissionId}`;
        } else {
            return `/contest/${problemInfo.contestId}/submission/${submissionId}`;
        }
    }

    /**
     * Parses verdict class from verdict string
     */
    function getVerdictClass(verdict) {
        const v = verdict.toLowerCase();
        if (v.includes('accepted') || v === 'ok' || v === 'ac') {
            return 'accepted';
        } else if (v.includes('running') || v.includes('judging')) {
            return 'running';
        } else if (v.includes('queue') || v.includes('pending') || v.includes('waiting')) {
            return 'waiting';
        } else if (v.includes('compilation') || v.includes('compile')) {
            return 'compilation-error';
        } else {
            return 'rejected';
        }
    }

    /**
     * Check if verdict is final (not running/pending)
     */
    function isFinalVerdict(verdict) {
        const v = verdict.toLowerCase();
        return !v.includes('running') && !v.includes('queue') && !v.includes('pending') &&
               !v.includes('waiting') && !v.includes('judging') && v !== 'in queue' && v !== '';
    }

    /**
     * Updates the verdict UI
     */
    function updateVerdictUI(submissionId, verdict, time, memory, testNumber, passedTests, totalTests) {
        const container = document.getElementById('cf-verdict-container');
        const submissionIdEl = document.getElementById('cf-submission-id');
        const submissionLink = document.getElementById('cf-submission-link');
        const verdictStatus = document.getElementById('cf-verdict-status');
        const verdictText = document.getElementById('cf-verdict-text');
        const verdictTime = document.getElementById('cf-verdict-time');
        const verdictMemory = document.getElementById('cf-verdict-memory');
        const verdictTest = document.getElementById('cf-verdict-test');
        const progressBar = document.getElementById('cf-progress-bar');
        const progress = document.getElementById('cf-progress');

        container.classList.add('visible');
        submissionIdEl.textContent = `#${submissionId}`;

        const problemInfo = getProblemInfo();
        submissionLink.href = getSubmissionDetailsUrl(problemInfo, submissionId);

        // Update verdict status
        const verdictClass = getVerdictClass(verdict);
        verdictStatus.className = 'verdict-status ' + verdictClass;

        // Add/remove spinner based on status
        if (verdictClass === 'waiting' || verdictClass === 'running') {
            verdictText.innerHTML = `<span class="spinner"></span> ${verdict}`;
        } else {
            verdictText.textContent = verdict;
        }

        // Update details
        verdictTime.textContent = `⏱️ Time: ${time || '--'}`;
        verdictMemory.textContent = `💾 Memory: ${memory || '--'}`;

        if (testNumber) {
            verdictTest.textContent = `📝 Test: ${testNumber}`;
        } else {
            verdictTest.textContent = `📝 Test: --`;
        }

        // Update progress bar
        if (passedTests !== null && totalTests !== null && totalTests > 0) {
            const percent = Math.min(100, (passedTests / totalTests) * 100);
            progress.style.width = percent + '%';
            progressBar.style.display = 'block';
        } else if (verdictClass === 'accepted') {
            progress.style.width = '100%';
            progress.style.background = '#28a745';
        } else if (isFinalVerdict(verdict)) {
            progressBar.style.display = 'none';
        }
    }

    /**
     * Polls submission status from the my submissions page
     */
    async function pollSubmissionStatus(problemInfo, submissionId, maxAttempts = 120) {
        let attempts = 0;
        const pollInterval = 1000; // 1 second

        const poll = async () => {
            if (attempts >= maxAttempts) {
                showStatus('error', '⚠️ Status check timed out. Please check your submissions manually.');
                return;
            }
            attempts++;

            try {
                // Fetch the submissions page
                let statusUrl;
                if (problemInfo.type === 'group') {
                    statusUrl = `/group/${problemInfo.groupId}/contest/${problemInfo.contestId}/my`;
                } else if (problemInfo.type === 'contest') {
                    statusUrl = `/contest/${problemInfo.contestId}/my`;
                } else if (problemInfo.type === 'gym') {
                    statusUrl = `/gym/${problemInfo.contestId}/my`;
                } else {
                    statusUrl = `/contest/${problemInfo.contestId}/my`;
                }

                const response = await fetch(statusUrl, { credentials: 'include' });
                const html = await response.text();

                // Parse the HTML to find our submission
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');

                // Find the row with our submission ID
                const rows = doc.querySelectorAll('table.status-frame-datatable tbody tr, .datatable tbody tr');
                let found = false;

                for (const row of rows) {
                    const idCell = row.querySelector('td:first-child a, td:first-child');
                    if (!idCell) continue;

                    const rowId = idCell.textContent.trim();
                    if (rowId === submissionId || rowId === '#' + submissionId) {
                        found = true;

                        // Extract verdict
                        const verdictCell = row.querySelector('td.status-verdict-cell, td[class*="verdict"], .submissionVerdictWrapper');
                        let verdict = 'In queue';
                        let testNumber = null;

                        if (verdictCell) {
                            const waitingSpan = verdictCell.querySelector('.verdict-waiting, .waiting');
                            const verdictSpan = verdictCell.querySelector('.verdict-accepted, .verdict-rejected, .verdict-wrong-answer, [class*="verdict-"]');
                            const runningSpan = verdictCell.querySelector('.verdict-running, .running');

                            if (verdictSpan) {
                                verdict = verdictSpan.textContent.trim();
                            } else if (runningSpan) {
                                verdict = runningSpan.textContent.trim() || 'Running...';
                                // Try to extract test number
                                const testMatch = verdict.match(/(\d+)/);
                                if (testMatch) {
                                    testNumber = testMatch[1];
                                    verdict = `Running on test ${testNumber}`;
                                }
                            } else if (waitingSpan) {
                                verdict = waitingSpan.textContent.trim() || 'In queue';
                            } else {
                                verdict = verdictCell.textContent.trim().split('\n')[0].trim() || 'In queue';
                            }

                            // Try to get test number from "on test X" pattern
                            const onTestMatch = verdict.match(/on (?:pretest|test)\s*(\d+)/i);
                            if (onTestMatch) {
                                testNumber = onTestMatch[1];
                            }
                        }

                        // Extract time
                        const timeCell = row.querySelector('td.time-consumed-cell, td:nth-child(6)');
                        const time = timeCell ? timeCell.textContent.trim() : null;

                        // Extract memory
                        const memoryCell = row.querySelector('td.memory-consumed-cell, td:nth-child(7)');
                        const memory = memoryCell ? memoryCell.textContent.trim() : null;

                        // Update UI
                        updateVerdictUI(submissionId, verdict, time, memory, testNumber, null, null);

                        // Check if final verdict
                        if (isFinalVerdict(verdict)) {
                            if (getVerdictClass(verdict) === 'accepted') {
                                showStatus('success', '🎉 Accepted! Your solution passed all tests.');
                            } else {
                                showStatus('error', `❌ ${verdict}`);
                            }
                            return; // Stop polling
                        }

                        break;
                    }
                }

                if (!found) {
                    // Submission not found yet, might still be processing
                    updateVerdictUI(submissionId, 'In queue...', null, null, null, null, null);
                }

                // Continue polling
                setTimeout(poll, pollInterval);

            } catch (error) {
                console.error('Polling error:', error);
                // Continue polling despite errors
                setTimeout(poll, pollInterval);
            }
        };

        // Start polling
        poll();
    }

    /**
     * Submits the solution to Codeforces
     */
    async function submitSolution(problemInfo, languageId, sourceCode, statusEl, submitBtn) {
        submitBtn.disabled = true;
        showStatus('loading', '⏳ Submitting solution...');

        // Hide previous verdict
        const verdictContainer = document.getElementById('cf-verdict-container');
        verdictContainer.classList.remove('visible');

        try {
            const csrfToken = getCsrfToken();
            if (!csrfToken) {
                throw new Error('Could not find CSRF token. Please refresh the page and try again.');
            }

            // Build form data
            const formData = new FormData();
            formData.append('csrf_token', csrfToken);
            formData.append('action', 'submitSolutionFormSubmitted');
            formData.append('submittedProblemIndex', problemInfo.problemIndex);
            formData.append('programTypeId', languageId);
            formData.append('source', sourceCode);
            formData.append('tabSize', '4');
            formData.append('sourceFile', '');

            // Determine submit URL
            let submitUrl;
            if (problemInfo.type === 'group') {
                submitUrl = `/group/${problemInfo.groupId}/contest/${problemInfo.contestId}/submit`;
            } else if (problemInfo.type === 'contest') {
                submitUrl = `/contest/${problemInfo.contestId}/submit`;
            } else if (problemInfo.type === 'gym') {
                submitUrl = `/gym/${problemInfo.contestId}/submit`;
            } else {
                // Problemset submission
                formData.append('contestId', problemInfo.contestId);
                submitUrl = `/problemset/submit`;
            }

            // Submit via fetch
            const response = await fetch(submitUrl + '?csrf_token=' + csrfToken, {
                method: 'POST',
                body: formData,
                credentials: 'include',
            });

            if (response.ok) {
                const html = await response.text();

                // Check for specific error patterns in Codeforces responses
                // Look for error messages in spans with error class near form fields
                const errorPatterns = [
                    /class="error[^"]*"[^>]*>([^<]+)</gi,
                    /<span[^>]*class="[^"]*error[^"]*"[^>]*>([^<]+)</gi,
                    /for__source[^>]*>[^<]*<[^>]*class="[^"]*error[^"]*"[^>]*>([^<]+)</gi,
                ];

                let errorMessage = null;

                // Check for "You have submitted exactly the same code before"
                if (html.includes('You have submitted exactly the same code before')) {
                    showStatus('error', '⚠️ You have submitted exactly the same code before.');
                    return;
                }

                // Check for "Source code is too long"
                if (html.includes('Source code is too long')) {
                    showStatus('error', '⚠️ Source code is too long (max 64KB).');
                    return;
                }

                // Check for login required
                if (html.includes('You should be logged') || html.includes('Please log in') || html.includes('signin')) {
                    showStatus('error', '⚠️ You need to be logged in to submit. Please log in and try again.');
                    return;
                }

                // Check for "Submit is not available" (contest not started, etc.)
                if (html.includes('Submit is not available') || html.includes('not running')) {
                    showStatus('error', '⚠️ Submissions are not available for this contest.');
                    return;
                }

                // Try to extract submission ID from response
                let submissionId = null;

                // Method 1: From URL redirect (usually redirects to /my page)
                const urlMatch = response.url.match(/submission\/(\d+)/);
                if (urlMatch) {
                    submissionId = urlMatch[1];
                }

                // Method 2: Check if we're on the "my submissions" page (indicates success)
                const isOnMyPage = response.url.includes('/my') || response.url.includes('/status');

                // Method 3: From response HTML - look for submission ID in the status table
                if (!submissionId) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');

                    // Look for the first submission in the status table
                    const firstSubmission = doc.querySelector('table.status-frame-datatable tbody tr:first-child td:first-child a');
                    if (firstSubmission) {
                        const idText = firstSubmission.textContent.trim();
                        if (/^\d+$/.test(idText)) {
                            submissionId = idText;
                        }
                    }

                    // Also try data attributes
                    if (!submissionId) {
                        const dataSubmission = doc.querySelector('[data-submission-id]');
                        if (dataSubmission) {
                            submissionId = dataSubmission.getAttribute('data-submission-id');
                        }
                    }
                }

                // Method 4: Extract from submissionId in scripts or hidden fields
                if (!submissionId) {
                    const idMatch = html.match(/submissionId["'\s:=]+(\d+)/);
                    if (idMatch) {
                        submissionId = idMatch[1];
                    }
                }

                // Method 5: Look for data-submission-id attribute
                if (!submissionId) {
                    const attrMatch = html.match(/data-submission-id=["'](\d+)["']/);
                    if (attrMatch) {
                        submissionId = attrMatch[1];
                    }
                }

                if (submissionId) {
                    showStatus('loading', `📤 Submitted! Tracking submission #${submissionId}...`);

                    // Start real-time status polling
                    updateVerdictUI(submissionId, 'In queue...', null, null, null, null, null);
                    pollSubmissionStatus(problemInfo, submissionId);
                } else if (isOnMyPage) {
                    // We're on the submissions page but couldn't extract ID - still a success
                    showStatus('success', `
                        ✅ Solution submitted!
                        <br><a href="${getSubmissionsUrl(problemInfo)}" target="_blank">View submission status →</a>
                    `);

                    // Try to get the latest submission ID from the page we're on
                    setTimeout(async () => {
                        try {
                            const statusResponse = await fetch(getSubmissionsUrl(problemInfo), { credentials: 'include' });
                            const statusHtml = await statusResponse.text();
                            const parser = new DOMParser();
                            const doc = parser.parseFromString(statusHtml, 'text/html');
                            const firstSubmission = doc.querySelector('table.status-frame-datatable tbody tr:first-child td:first-child a');
                            if (firstSubmission) {
                                const idText = firstSubmission.textContent.trim();
                                if (/^\d+$/.test(idText)) {
                                    showStatus('loading', `📤 Tracking submission #${idText}...`);
                                    updateVerdictUI(idText, 'In queue...', null, null, null, null, null);
                                    pollSubmissionStatus(problemInfo, idText);
                                }
                            }
                        } catch (e) {
                            console.log('Could not fetch latest submission ID:', e);
                        }
                    }, 500);
                } else {
                    // Check if there's an actual form error displayed
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');
                    const errorSpan = doc.querySelector('.error, .errorMessage, [class*="error"]');

                    if (errorSpan && errorSpan.textContent.trim().length > 0 && errorSpan.textContent.trim().length < 200) {
                        const errText = errorSpan.textContent.trim();
                        // Make sure it's actually an error message, not just a class name
                        if (errText && !errText.includes('function') && !errText.includes('{')) {
                            showStatus('error', `❌ ${errText}`);
                            return;
                        }
                    }

                    // If we get here and there's no submission ID, assume success anyway
                    // (Codeforces sometimes doesn't redirect properly)
                    showStatus('success', `
                        ✅ Solution likely submitted!
                        <br><a href="${getSubmissionsUrl(problemInfo)}" target="_blank">Check submission status →</a>
                    `);
                }
            } else {
                throw new Error(`Server returned status ${response.status}`);
            }
        } catch (error) {
            console.error('Submission error:', error);
            showStatus('error', `❌ Error: ${error.message || 'Unknown error occurred. Please try again.'}`);
        } finally {
            submitBtn.disabled = false;
        }
    }

    /* ───────────────────────────────────────────────────────────────────────
     * Initialization
     * ─────────────────────────────────────────────────────────────────────── */

    // Wait for page to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createSubmitForm);
    } else {
        createSubmitForm();
    }

})();
