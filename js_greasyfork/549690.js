// ==UserScript==
// @name         Datanet: SQL Unsafe Function Detector
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Detect unsafe functions in SQL queries on DataCentral ETL pages
// @author       zhjy@amazon.com
// @match        https://datacentral.a2z.com/dw-platform/servlet/dwp/template/EtlViewExtractJobs.vm/job_profile_id/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549690/Datanet%3A%20SQL%20Unsafe%20Function%20Detector.user.js
// @updateURL https://update.greasyfork.org/scripts/549690/Datanet%3A%20SQL%20Unsafe%20Function%20Detector.meta.js
// ==/UserScript==

/*
REVISION HISTORY:
1 - 2025-09-16 - zhjy@ - Initial version
1.1 - 2025-09-16 - zhjy@ - Updated "match" to make it available to new Datanet UI
1.2 - 2025-09-16 - zhjy@ - Revert to 1.0
1.3 - 2025-09-16 - zhjy@ - Fixed performance issues by removing automatic monitoring, detection now only runs on button click
1.4 - 2025-09-16 - zhjy@ - Enhanced WHERE clause detection to identify complete WHERE clauses and JOIN ON clause extraction for improved accuracy.
1.5 - 2025-09-18 - zhjy@ - Fixed SQL text extraction; Modernized UI design; Refactored unsafe function detection logic
*/

(function() {
    'use strict';

    // Define unsafe functions by category
    const UNSAFE_FUNCTIONS = {
        'Date/Time Functions': [
            'DATE_TRUNC', 'DATE_PART', 'EXTRACT', 'TO_CHAR', 'ADD_MONTHS',
            'CONVERT_TIMEZONE', 'CURRENT_DATE', 'INTERVAL', 'TRUNC', '::DATE'
        ],
        'String Functions': [
            'LENGTH', 'LEFT', 'RIGHT', 'SUBSTR', 'POSITION', 'CONCAT', 'REPLACE'
        ],
        'String Matching Functions': [
            'SIMILAR TO', 'REGEXP_COUNT', 'LIKE'
        ],
        'Type Conversion Functions': [
            'CAST', 'TO_NUMBER', 'TO_DATE',
            '::DATE', '::TIMESTAMP', '::TIME', '::INTEGER', '::NUMERIC', '::TEXT', '::VARCHAR', '::CHAR', '::BOOLEAN'
        ],
        'Time Comparison Functions': [
            'TIME BETWEEN', 'EXTRACT.*EPOCH'
        ]
    };

    // Flatten all unsafe functions for easy lookup
    const ALL_UNSAFE_FUNCTIONS = Object.values(UNSAFE_FUNCTIONS).flat();

    // Define safe TO_DATE patterns that should not be flagged as unsafe
    const SAFE_TO_DATE_PATTERNS = [
        /to_date\s*\(\s*['"]\{RUN_DATE_YYYYMMDD\}['"],\s*['"]YYYYMMDD['"]\s*\)/gi,
        /to_date\s*\(\s*['"]\{RUN_DATE_YYYY-MM-DD\}['"],\s*['"]YYYY-MM-DD['"]\s*\)/gi,
        /to_date\s*\(\s*['"]\{RUN_DATE_YYYY\/MM\/DD\}['"],\s*['"]YYYY\/MM\/DD['"]\s*\)/gi
    ];

    // CSS styles for UI and highlighting
    const styles = `
        .unsafe-function-highlight {
            background-color: #fef3c7 !important;
            border-radius: 4px !important;
            padding: 1px 3px !important;
            font-weight: 600 !important;
            user-select: text !important;
            -webkit-user-select: text !important;
            -moz-user-select: text !important;
            -ms-user-select: text !important;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05) !important;
        }

        .unsafe-function-panel {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 380px;
            max-height: 520px;
            background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            z-index: 9999;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            overflow: hidden;
            backdrop-filter: blur(10px);
            border-top: 3px solid #334155;
        }

        .unsafe-function-panel-header {
            background: linear-gradient(135deg, #334155 0%, #475569 100%);
            color: white;
            padding: 16px 20px;
            font-weight: 600;
            font-size: 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            letter-spacing: -0.025em;
        }

        .unsafe-function-panel-content {
            padding: 20px;
            max-height: 420px;
            overflow-y: auto;
            scrollbar-width: thin;
            scrollbar-color: #cbd5e1 #f1f5f9;
        }

        .unsafe-function-panel-content::-webkit-scrollbar {
            width: 6px;
        }

        .unsafe-function-panel-content::-webkit-scrollbar-track {
            background: #f1f5f9;
            border-radius: 3px;
        }

        .unsafe-function-panel-content::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 3px;
        }

        .unsafe-function-panel-content::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
        }

        .unsafe-function-category {
            margin-bottom: 18px;
        }

        .unsafe-function-category:last-child {
            margin-bottom: 0;
        }

        .unsafe-function-category-title {
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 8px;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 6px;
            font-size: 14px;
            letter-spacing: -0.025em;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .unsafe-function-category-title::before {
            content: "⚠️";
            font-size: 16px;
        }

        .unsafe-function-item {
            margin: 6px 0;
            padding: 12px 16px;
            background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
            border: 1px solid #e2e8f0;
            border-left: 4px solid #f59e0b;
            border-radius: 8px;
            font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
            font-size: 13px;
            cursor: pointer;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            line-height: 1.5;
        }

        .unsafe-function-item:hover {
            background: linear-gradient(135deg, #fef3c7 0%, #fef9e7 100%);
            border-color: #f59e0b;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            transform: translateY(-1px);
        }

        .unsafe-function-item strong {
            color: #dc2626;
            font-weight: 700;
            font-size: 14px;
        }

        .unsafe-function-item small {
            color: #64748b;
            font-size: 12px;
            line-height: 1.4;
            margin-top: 4px;
            display: block;
        }

        .unsafe-function-item::after {
            content: "🔍";
            position: absolute;
            right: 12px;
            top: 50%;
            transform: translateY(-50%);
            opacity: 0;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            font-size: 16px;
        }

        .unsafe-function-item:hover::after {
            opacity: 1;
            transform: translateY(-50%) scale(1.1);
        }

        .temporary-line-flash {
            animation: lineFlash 2s ease-out;
        }

        @keyframes lineFlash {
            0% {
                background-color: rgba(51, 65, 85, 0.3) !important;
                box-shadow: 0 0 0 4px rgba(51, 65, 85, 0.2) !important;
            }
            50% {
                background-color: rgba(51, 65, 85, 0.2) !important;
                box-shadow: 0 0 0 2px rgba(51, 65, 85, 0.1) !important;
            }
            100% {
                background-color: rgba(245, 158, 11, 0.15) !important;
                box-shadow: none !important;
            }
        }

        .close-btn {
            background: rgba(255, 255, 255, 0.2);
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            padding: 0;
            width: 28px;
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 6px;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .close-btn:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: scale(1.05);
        }

        .toggle-btn {
            position: fixed;
            bottom: 24px;
            right: 24px;
            background: linear-gradient(135deg, #334155 0%, #475569 100%);
            color: white;
            border: none;
            padding: 14px 20px;
            border-radius: 12px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            z-index: 9998;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            letter-spacing: -0.025em;
            min-width: 200px;
            text-align: center;
        }

        .toggle-btn:hover {
            background: linear-gradient(135deg, #475569 0%, #64748b 100%);
            transform: translateY(-2px);
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        .toggle-btn:active {
            transform: translateY(0);
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }

        .no-unsafe-functions {
            color: #059669;
            font-style: normal;
            text-align: center;
            padding: 32px 20px;
            font-size: 15px;
            font-weight: 500;
            line-height: 1.6;
            background: linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%);
            border-radius: 8px;
            border: 1px solid #bbf7d0;
        }

        .no-unsafe-functions::before {
            content: "✅";
            display: block;
            font-size: 32px;
            margin-bottom: 12px;
        }
    `;

    // Add styles to page
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    let detectedFunctions = {};
    let panelVisible = false;
    let panel = null;
    let toggleBtn = null;
    let isScanning = false;
    let scanTimeout = null;
    let highlightStyleSheet = null; // Store dynamic highlight styles
    let highlightedLines = new Map(); // Store highlighted line information for persistence
    let highlightProtectionInterval = null; // Interval for highlight protection

    // Create unique key for deduplication
    function createUniqueKey(func) {
        return `${func.function}-${func.line}-${func.column}-${func.context.trim()}`;
    }

    // Deduplicate detected functions using unique keys
    function deduplicateDetections(detectedFunctions) {
        const deduplicatedFunctions = {};
        const seenKeys = new Set();

        Object.entries(detectedFunctions).forEach(([category, functions]) => {
            const uniqueFunctions = [];

            functions.forEach(func => {
                const uniqueKey = createUniqueKey(func);
                if (!seenKeys.has(uniqueKey)) {
                    seenKeys.add(uniqueKey);
                    uniqueFunctions.push(func);
                } else {
                    // Duplicate detection skipped
                }
            });

            if (uniqueFunctions.length > 0) {
                deduplicatedFunctions[category] = uniqueFunctions;
            }
        });

        return deduplicatedFunctions;
    }

    // Jump to line functionality - completely independent functions
    function jumpToLine(lineNumber, elementIndex) {
        try {
            // Find the correct CodeMirror instance
            const codeMirrorInstance = findCodeMirrorForLine(lineNumber, elementIndex);
            if (!codeMirrorInstance) {
                return false;
            }

            // Get the target line element
            const lines = codeMirrorInstance.querySelectorAll('.CodeMirror-line');
            const targetLineIndex = lineNumber - 1; // Convert to 0-based index

            if (targetLineIndex >= 0 && targetLineIndex < lines.length) {
                const targetLine = lines[targetLineIndex];

                // Scroll to the line with smooth behavior
                targetLine.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                    inline: 'nearest'
                });

                // Add temporary flash effect
                addTemporaryHighlight(targetLine);

                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error('Error in jumpToLine:', error);
            return false;
        }
    }

    function findCodeMirrorForLine(lineNumber, elementIndex) {
        try {
            // Strategy 1: Use elementIndex if provided
            if (typeof elementIndex === 'number') {
                const codeMirrorElements = document.querySelectorAll('.CodeMirror-scroll');
                if (elementIndex >= 0 && elementIndex < codeMirrorElements.length) {
                    return codeMirrorElements[elementIndex];
                }
            }

            // Strategy 2: Find CodeMirror instance that contains the line
            const allCodeMirrorElements = document.querySelectorAll('.CodeMirror-scroll');

            for (let element of allCodeMirrorElements) {
                const lines = element.querySelectorAll('.CodeMirror-line');
                if (lineNumber <= lines.length) {
                    return element;
                }
            }

            // Strategy 3: Return the first available CodeMirror instance
            return allCodeMirrorElements[0] || null;
        } catch (error) {
            console.error('Error in findCodeMirrorForLine:', error);
            return null;
        }
    }

    function addTemporaryHighlight(lineElement) {
        try {
            if (!lineElement) return;

            // Add flash animation class
            lineElement.classList.add('temporary-line-flash');

            // Remove the class after animation completes
            setTimeout(() => {
                if (lineElement && lineElement.classList) {
                    lineElement.classList.remove('temporary-line-flash');
                }
            }, 1500); // Match the animation duration
        } catch (error) {
            console.error('Error in addTemporaryHighlight:', error);
        }
    }

    function setupSummaryClickHandlers() {
        try {
            if (!panel) return;

            // Use event delegation to handle clicks on summary items
            panel.addEventListener('click', function(event) {
                // Check if clicked element is an unsafe function item
                const clickedItem = event.target.closest('.unsafe-function-item');
                if (!clickedItem) return;

                // Prevent event bubbling
                event.stopPropagation();

                // Extract line number from the item content
                const lineInfo = extractLineInfoFromItem(clickedItem);
                if (lineInfo) {
                    jumpToLine(lineInfo.line, lineInfo.elementIndex);
                }
            });
        } catch (error) {
            console.error('Error in setupSummaryClickHandlers:', error);
        }
    }

    function extractLineInfoFromItem(itemElement) {
        try {
            const text = itemElement.textContent || '';

            // Extract line number from text like "REPLACE at line 15:23"
            const lineMatch = text.match(/at line (\d+):(\d+)/);
            if (lineMatch) {
                const lineNumber = parseInt(lineMatch[1], 10);
                const columnNumber = parseInt(lineMatch[2], 10);

                // Try to find the corresponding elementIndex from detectedFunctions
                let elementIndex = 0; // Default to first element

                // Search through detectedFunctions to find matching entry
                Object.values(detectedFunctions).forEach(functions => {
                    functions.forEach(func => {
                        if (func.line === lineNumber && func.column === columnNumber) {
                            // Try to find elementIndex from highlightedLines
                            highlightedLines.forEach((highlightInfo, lineKey) => {
                                if (highlightInfo.lineNumber === lineNumber) {
                                    elementIndex = highlightInfo.elementIndex;
                                }
                            });
                        }
                    });
                });

                return {
                    line: lineNumber,
                    column: columnNumber,
                    elementIndex: elementIndex
                };
            }

            return null;
        } catch (error) {
            console.error('Error in extractLineInfoFromItem:', error);
            return null;
        }
    }

    // Split SQL text into individual statements by semicolon, handling quotes and comments
    function splitSQLStatements(sqlText) {
        const statements = [];
        let currentStatement = '';
        let i = 0;
        let inSingleQuote = false;
        let inDoubleQuote = false;
        let inMultiLineComment = false;
        let inSingleLineComment = false;
        let statementStartPosition = 0;

        // Clean the SQL text first - remove zero-width characters and normalize
        sqlText = sqlText.replace(/[\u200B-\u200D\uFEFF]/g, ''); // Remove zero-width characters
        sqlText = sqlText.replace(/\u00A0/g, ' '); // Replace non-breaking spaces with regular spaces

        while (i < sqlText.length) {
            const char = sqlText[i];
            const nextChar = i + 1 < sqlText.length ? sqlText[i + 1] : '';

            // Handle multi-line comments /* */
            if (!inSingleQuote && !inDoubleQuote && !inSingleLineComment) {
                if (char === '/' && nextChar === '*') {
                    inMultiLineComment = true;
                    currentStatement += char + nextChar;
                    i += 2;
                    continue;
                }
            }

            if (inMultiLineComment) {
                currentStatement += char;
                if (char === '*' && nextChar === '/') {
                    inMultiLineComment = false;
                    currentStatement += nextChar;
                    i += 2;
                    continue;
                }
                i++;
                continue;
            }

            // Handle single-line comments -- (improved to handle multiple dashes)
            if (!inSingleQuote && !inDoubleQuote && !inSingleLineComment) {
                if (char === '-' && nextChar === '-') {
                    inSingleLineComment = true;
                    currentStatement += char + nextChar;
                    i += 2;
                    continue;
                }
            }

            if (inSingleLineComment) {
                currentStatement += char;
                if (char === '\n' || char === '\r') {
                    inSingleLineComment = false;
                } else if (char === ';') {
                    // Special case: semicolon can end a single-line comment if there's no newline
                    // This handles cases where SQL statements are on the same line
                    inSingleLineComment = false;
                    // Don't increment i here, let the semicolon be processed normally
                    continue;
                }
                i++;
                continue;
            }

            // Handle string literals with escape sequence support
            if (!inMultiLineComment && !inSingleLineComment) {
                if (char === "'" && !inDoubleQuote) {
                    // Check for escaped quote
                    if (i > 0 && sqlText[i-1] === '\\') {
                        currentStatement += char;
                        i++;
                        continue;
                    }
                    inSingleQuote = !inSingleQuote;
                    currentStatement += char;
                    i++;
                    continue;
                } else if (char === '"' && !inSingleQuote) {
                    // Check for escaped quote
                    if (i > 0 && sqlText[i-1] === '\\') {
                        currentStatement += char;
                        i++;
                        continue;
                    }
                    inDoubleQuote = !inDoubleQuote;
                    currentStatement += char;
                    i++;
                    continue;
                }
            }

            // Handle semicolon (statement separator)
            if (!inSingleQuote && !inDoubleQuote && !inMultiLineComment && !inSingleLineComment && char === ';') {
                currentStatement += char;

                // Trim and add statement if it's not empty
                const trimmedStatement = currentStatement.trim();

                if (trimmedStatement && trimmedStatement !== ';') {
                    statements.push({
                        text: trimmedStatement,
                        startPosition: statementStartPosition,
                        endPosition: i + 1
                    });
                }

                // Reset for next statement - skip whitespace after semicolon
                currentStatement = '';
                i++;
                // Skip whitespace and newlines to find the start of next statement
                while (i < sqlText.length && /\s/.test(sqlText[i])) {
                    i++;
                }
                statementStartPosition = i;
                continue;
            }

            // Normal character
            currentStatement += char;
            i++;
        }

        // Add the last statement if it exists (improved handling)
        const trimmedStatement = currentStatement.trim();
        if (trimmedStatement) {
            statements.push({
                text: trimmedStatement,
                startPosition: statementStartPosition,
                endPosition: sqlText.length
            });
        }

        return statements;
    }

    // Remove SQL comments from text while preserving line structure
    function removeComments(sqlText) {
        let result = '';
        let i = 0;
        let inSingleQuote = false;
        let inDoubleQuote = false;
        let inMultiLineComment = false;

        while (i < sqlText.length) {
            const char = sqlText[i];
            const nextChar = i + 1 < sqlText.length ? sqlText[i + 1] : '';

            // Handle string literals (don't process comments inside strings)
            if (!inMultiLineComment) {
                if (char === "'" && !inDoubleQuote) {
                    inSingleQuote = !inSingleQuote;
                    result += char;
                    i++;
                    continue;
                } else if (char === '"' && !inSingleQuote) {
                    inDoubleQuote = !inDoubleQuote;
                    result += char;
                    i++;
                    continue;
                }
            }

            // Skip comment processing if we're inside a string literal
            if (inSingleQuote || inDoubleQuote) {
                result += char;
                i++;
                continue;
            }

            // Handle multi-line comments /* */
            if (!inMultiLineComment && char === '/' && nextChar === '*') {
                inMultiLineComment = true;
                result += '  '; // Replace with spaces to maintain positioning
                i += 2;
                continue;
            }

            if (inMultiLineComment) {
                if (char === '*' && nextChar === '/') {
                    inMultiLineComment = false;
                    result += '  '; // Replace with spaces
                    i += 2;
                    continue;
                } else if (char === '\n') {
                    result += char; // Preserve line breaks
                    i++;
                    continue;
                } else {
                    result += ' '; // Replace comment content with space
                    i++;
                    continue;
                }
            }

            // Handle single-line comments --
            if (char === '-' && nextChar === '-') {
                // Replace everything from -- to end of line with spaces
                while (i < sqlText.length && sqlText[i] !== '\n') {
                    result += ' ';
                    i++;
                }
                // Don't increment i here as we want to process the \n normally
                continue;
            }

            // Normal character
            result += char;
            i++;
        }

        return result;
    }

    // Check if a TO_DATE function call matches safe patterns
    function isSafeToDatePattern(expression) {
        // Reset all regex patterns before testing
        SAFE_TO_DATE_PATTERNS.forEach(pattern => {
            pattern.lastIndex = 0;
        });

        // Test against all safe patterns
        return SAFE_TO_DATE_PATTERNS.some(pattern => {
            pattern.lastIndex = 0; // Reset regex state
            return pattern.test(expression);
        });
    }

    // Extract complete TO_DATE function call from text around a match position
    function extractToDateFunctionCall(text, matchIndex) {
        // Find the start of the function call
        let start = matchIndex;
        while (start > 0 && text[start - 1] !== ' ' && text[start - 1] !== '\t' && text[start - 1] !== '\n' && text[start - 1] !== '(' && text[start - 1] !== ',') {
            start--;
        }

        // Find the end of the function call by matching parentheses
        let parenCount = 0;
        let end = matchIndex;
        let foundOpenParen = false;

        // Move to the opening parenthesis
        while (end < text.length) {
            if (text[end] === '(') {
                foundOpenParen = true;
                parenCount++;
                end++;
                break;
            } else if (text[end] === ' ' || text[end] === '\t') {
                end++;
            } else {
                end++;
            }
        }

        if (!foundOpenParen) {
            return text.substring(start, Math.min(start + 50, text.length)); // Fallback
        }

        // Find the matching closing parenthesis
        while (end < text.length && parenCount > 0) {
            if (text[end] === '(') {
                parenCount++;
            } else if (text[end] === ')') {
                parenCount--;
            }
            end++;
        }

        return text.substring(start, end).trim();
    }

    // Create regex patterns for detecting unsafe functions
    function createFunctionRegex(functionName) {
        // Handle special cases
        if (functionName === 'SIMILAR TO') {
            return new RegExp('\\bSIMILAR\\s+TO\\b', 'gi');
        }
        if (functionName === 'TIME BETWEEN') {
            return new RegExp('\\bTIME\\s+BETWEEN\\b', 'gi');
        }
        if (functionName === 'EXTRACT.*EPOCH') {
            return new RegExp('\\bEXTRACT\\s*\\([^)]*EPOCH[^)]*\\)', 'gi');
        }

        // Handle POSITION function which can have different syntax: POSITION(x IN y) or POSITION(x,y)
        if (functionName === 'POSITION') {
            return new RegExp('\\bPOSITION\\s*\\(', 'gi');
        }

        // Handle INTERVAL function - supports both INTERVAL(...) and INTERVAL 'value' formats
        if (functionName === 'INTERVAL') {
            return new RegExp('\\bINTERVAL\\s*(?:\\(|\'|\\d)', 'gi');
        }

        // Handle :: type conversion patterns (e.g., ::DATE, ::TEXT, ::INTEGER)
        // Allow any non-whitespace character before :: to handle cases like (expression)::date
        if (functionName.startsWith('::')) {
            const typeName = functionName.substring(2); // Remove the ::
            return new RegExp('[^\\s]::\\s*' + typeName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'gi');
        }

        // Standard function pattern: FUNCTION_NAME followed by opening parenthesis
        return new RegExp('\\b' + functionName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*\\(', 'gi');
    }

    // Parse comparison expressions and extract only the left side (field being compared)
    function parseComparisonExpression(condition) {
        const leftSideExpressions = [];

        // First, remove any nested SELECT...FROM statements from the condition
        const cleanedCondition = removeNestedSelectStatements(condition);

        // Handle BETWEEN operator specially
        const betweenMatch = cleanedCondition.match(/^(.+?)\s+BETWEEN\s+/i);
        if (betweenMatch) {
            leftSideExpressions.push(betweenMatch[1].trim());
            return leftSideExpressions;
        }

        // Handle IN operator with potential subqueries
        const inMatch = cleanedCondition.match(/^(.+?)\s+(?:NOT\s+)?IN\s*\(/i);
        if (inMatch) {
            leftSideExpressions.push(inMatch[1].trim());
            return leftSideExpressions;
        }

        // Handle EXISTS operator (left side is empty for EXISTS)
        if (cleanedCondition.match(/^\s*(?:NOT\s+)?EXISTS\s*\(/i)) {
            return leftSideExpressions; // No left side for EXISTS
        }

        // Handle standard comparison operators (=, >, <, >=, <=, !=, <>)
        // Use a more robust approach to handle nested parentheses in complex expressions
        let parenDepth = 0;
        let inQuotes = false;
        let quoteChar = '';
        let operatorIndex = -1;

        // Find the comparison operator at the top level (not inside parentheses or quotes)
        for (let i = 0; i < cleanedCondition.length; i++) {
            const char = cleanedCondition[i];

            // Handle quotes (including escaped quotes)
            if ((char === '"' || char === "'") && !inQuotes) {
                inQuotes = true;
                quoteChar = char;
            } else if (char === quoteChar && inQuotes) {
                // Check if it's escaped
                if (i > 0 && cleanedCondition[i-1] === '\\') {
                    continue; // Skip escaped quote
                }
                inQuotes = false;
                quoteChar = '';
            } else if (!inQuotes) {
                // Handle parentheses
                if (char === '(') {
                    parenDepth++;
                } else if (char === ')') {
                    parenDepth--;
                } else if (parenDepth === 0) {
                    // Check for comparison operators at top level
                    const remaining = cleanedCondition.substring(i);
                    // Include PostgreSQL regex operators: ~, ~*, !~, !~*
                    // Also include LIKE, ILIKE, SIMILAR TO
                    if (remaining.match(/^(>=|<=|<>|!=|!~\*|!~|~\*|~|>|<|=|\s+(?:NOT\s+)?(?:LIKE|ILIKE)\s+|\s+SIMILAR\s+TO\s+)/i)) {
                        operatorIndex = i;
                        break;
                    }
                }
            }
        }

        if (operatorIndex !== -1) {
            const leftSide = cleanedCondition.substring(0, operatorIndex).trim();
            if (leftSide) {
                leftSideExpressions.push(leftSide);
            }
        }

        return leftSideExpressions;
    }

    // Remove nested SELECT...FROM statements from a condition to avoid detecting unsafe functions within them
    function removeNestedSelectStatements(condition) {
        let result = condition;
        let changed = true;

        // Keep removing nested SELECT statements until no more are found
        while (changed) {
            changed = false;
            let parenDepth = 0;
            let inQuotes = false;
            let quoteChar = '';
            let selectStart = -1;

            for (let i = 0; i < result.length; i++) {
                const char = result[i];

                // Handle quotes
                if ((char === '"' || char === "'") && !inQuotes) {
                    inQuotes = true;
                    quoteChar = char;
                } else if (char === quoteChar && inQuotes) {
                    if (i > 0 && result[i-1] === '\\') {
                        continue; // Skip escaped quote
                    }
                    inQuotes = false;
                    quoteChar = '';
                } else if (!inQuotes) {
                    // Handle parentheses
                    if (char === '(') {
                        parenDepth++;
                        // Check if this starts a SELECT statement
                        const remaining = result.substring(i + 1).trim();
                        if (remaining.match(/^SELECT\s+/i) && selectStart === -1) {
                            selectStart = i;
                        }
                    } else if (char === ')') {
                        parenDepth--;
                        // If we're closing a SELECT statement
                        if (selectStart !== -1 && parenDepth === 0) {
                            // Replace the SELECT statement with placeholder
                            const beforeSelect = result.substring(0, selectStart);
                            const afterSelect = result.substring(i + 1);
                            result = beforeSelect + '(SUBQUERY_PLACEHOLDER)' + afterSelect;
                            changed = true;
                            break;
                        }
                    }
                }
            }
        }

        return result;
    }

    // Split WHERE clause into individual conditions, handling nested parentheses
    function splitWhereConditions(whereClause) {
        const conditions = [];
        let current = '';
        let parenDepth = 0;
        let inQuotes = false;
        let quoteChar = '';

        for (let i = 0; i < whereClause.length; i++) {
            const char = whereClause[i];
            const nextChars = whereClause.substr(i, 4).toUpperCase();

            // Handle quotes
            if ((char === '"' || char === "'") && !inQuotes) {
                inQuotes = true;
                quoteChar = char;
                current += char;
            } else if (char === quoteChar && inQuotes) {
                inQuotes = false;
                quoteChar = '';
                current += char;
            } else if (inQuotes) {
                current += char;
            } else {
                // Handle parentheses
                if (char === '(') {
                    parenDepth++;
                    current += char;
                } else if (char === ')') {
                    parenDepth--;
                    current += char;
                } else if (parenDepth === 0 && (nextChars === 'AND ' || nextChars === 'OR ')) {
                    // Found AND/OR at top level
                    if (current.trim()) {
                        conditions.push(current.trim());
                    }
                    current = '';
                    i += 3; // Skip past 'AND' or 'OR '
                } else {
                    current += char;
                }
            }
        }

        // Add the last condition
        if (current.trim()) {
            conditions.push(current.trim());
        }

        return conditions;
    }

    // Remove SELECT...FROM portion of statement to reduce false positives
    function removeSelectFromPortion(statement) {
        // Remove SELECT...FROM between content, keep FROM and after
        return statement.replace(/SELECT[\s\S]*?FROM\s+/i, 'FROM ');
    }

    function extractCompleteWhereClauses(statement) {
        // Remove SELECT...FROM part to reduce false positives
        let cleanedStatement = removeSelectFromPortion(statement);
        // Use non-greedy matching to extract WHERE clauses
        const whereRegex = /\bWHERE\s+([\s\S]*?)(?=\s+(?:GROUP\s+BY|ORDER\s+BY|HAVING|LIMIT|OFFSET|UNION|INTERSECT|EXCEPT|;|$))/gi;

        const whereClauses = [];
        let match;
        while ((match = whereRegex.exec(cleanedStatement)) !== null) {
            const whereClause = match[1].trim();
            if (whereClause) {
                const parts = splitAtUnmatchedParen(whereClause);
                whereClauses.push(...parts);
            }
        }

        return whereClauses;
    }

    // Helper function: Calculate statement line range boundaries
    function getStatementLineRange(statement, fullSqlText, lines) {
        try {
            // Strategy 1: Use character positions to find line boundaries
            const startPos = statement.startPosition;
            const endPos = statement.endPosition;

            let startLine = 1;
            let endLine = lines.length;
            let currentPos = 0;

            // Find start line by counting characters
            for (let i = 0; i < lines.length; i++) {
                const lineText = lines[i].textContent || '';
                const lineLength = lineText.length + 1; // +1 for newline character

                if (currentPos <= startPos && currentPos + lineLength > startPos) {
                    startLine = i + 1;
                }

                if (currentPos < endPos && currentPos + lineLength >= endPos) {
                    endLine = i + 1;
                    break;
                }

                currentPos += lineLength;
            }

            // Strategy 2: Fallback using content matching if position-based fails
            if (startLine === 1 && endLine === lines.length) {
                const statementLines = statement.text.split('\n');
                const firstStatementLine = statementLines[0].trim();
                const lastStatementLine = statementLines[statementLines.length - 1].trim();

                if (firstStatementLine) {
                    for (let i = 0; i < lines.length; i++) {
                        const lineText = (lines[i].textContent || '').trim();
                        if (lineText.includes(firstStatementLine) || firstStatementLine.includes(lineText)) {
                            startLine = i + 1;
                            break;
                        }
                    }
                }

                if (lastStatementLine && lastStatementLine !== firstStatementLine) {
                    for (let i = startLine - 1; i < lines.length; i++) {
                        const lineText = (lines[i].textContent || '').trim();
                        if (lineText.includes(lastStatementLine) || lastStatementLine.includes(lineText)) {
                            endLine = i + 1;
                            break;
                        }
                    }
                }
            }

            // Ensure valid range
            startLine = Math.max(1, startLine);
            endLine = Math.min(lines.length, Math.max(startLine, endLine));

            return { startLine, endLine };
        } catch (error) {
            console.error('Error calculating statement line range:', error);
            // Fallback to full range
            return { startLine: 1, endLine: lines.length };
        }
    }

    // Optimized function: Extract WHERE clauses with line number information (limited to statement range)
    function extractWhereClausesWithLineNumbers(statement, fullSqlText, lines) {
        const whereClauses = extractCompleteWhereClauses(statement.text);
        const clausesWithLineNumbers = [];

        // Get the line range for this statement to limit search scope
        const { startLine, endLine } = getStatementLineRange(statement, fullSqlText, lines);

        whereClauses.forEach(clause => {
            const clauseInfo = {
                text: clause,
                lineNumbers: []
            };

            // Only search within the statement's line range for better performance and accuracy
            for (let lineIndex = startLine - 1; lineIndex < endLine && lineIndex < lines.length; lineIndex++) {
                const line = lines[lineIndex];
                const lineText = line.textContent || '';
                const lineNumber = lineIndex + 1;

                // Check if this line belongs to the current statement and clause
                // Since we're already within the statement range, we can skip the expensive isLineInStatement check
                if (isLineMatchingClause(lineText, clause)) {
                    clauseInfo.lineNumbers.push({
                        lineNumber: lineNumber,
                        lineText: lineText.trim(),
                        lineElement: line
                    });
                }
            }

            if (clauseInfo.lineNumbers.length > 0) {
                clausesWithLineNumbers.push(clauseInfo);
            }
        });

        return clausesWithLineNumbers;
    }

    // Optimized function: Extract JOIN ON clauses with line number information (limited to statement range)
    function extractJoinOnClausesWithLineNumbers(statement, fullSqlText, lines) {
        const joinOnClauses = extractCompleteJoinOnClauses(statement.text);
        const clausesWithLineNumbers = [];

        // Get the line range for this statement to limit search scope
        const { startLine, endLine } = getStatementLineRange(statement, fullSqlText, lines);

        joinOnClauses.forEach(clause => {
            const clauseInfo = {
                text: clause,
                lineNumbers: []
            };

            // Only search within the statement's line range for better performance and accuracy
            for (let lineIndex = startLine - 1; lineIndex < endLine && lineIndex < lines.length; lineIndex++) {
                const line = lines[lineIndex];
                const lineText = line.textContent || '';
                const lineNumber = lineIndex + 1;

                // Check if this line belongs to the current statement and clause
                // Since we're already within the statement range, we can skip the expensive isLineInStatement check
                if (isLineMatchingClause(lineText, clause)) {
                    clauseInfo.lineNumbers.push({
                        lineNumber: lineNumber,
                        lineText: lineText.trim(),
                        lineElement: line
                    });
                }
            }

            if (clauseInfo.lineNumbers.length > 0) {
                clausesWithLineNumbers.push(clauseInfo);
            }
        });

        return clausesWithLineNumbers;
    }

    function splitAtUnmatchedParen(clause) {
        let results = [];
        let start = 0;
        let depth = 0;

        for (let i = 0; i < clause.length; i++) {
            const ch = clause[i];
            if (ch === "(") {
                depth++;
            } else if (ch === ")") {
                if (depth === 0) {
                    // find single )，end WHERE clause
                    results.push(clause.slice(start, i).trim());
                    start = i + 1;
                } else {
                    depth--;
                }
            }
        }

        const rest = clause.slice(start).trim();
        if (rest) results.push(rest);

        return results;
    }

    // Extract complete JOIN ON clauses from a SQL statement using regex
    function extractCompleteJoinOnClauses(statement) {
        // Remove SELECT...FROM part to reduce false positives
        let cleanedStatement = removeSelectFromPortion(statement);
        //console.log(cleanedStatement);
        cleanedStatement = cleanedStatement.replace(
            /\b(LEFT\s+JOIN|RIGHT\s+JOIN|INNER\s+JOIN|JOIN)\s+([\s\S]*?)\s+ON\s+/gi,
            '$1 TABLE_PLACEHOLDER ON '
        );

        //console.log(cleanedStatement);

        // Match various JOIN...ON patterns
        const joinOnRegex = /\b(INNER\s+JOIN|LEFT\s+(?:OUTER\s+)?JOIN|RIGHT\s+(?:OUTER\s+)?JOIN|FULL\s+(?:OUTER\s+)?JOIN|CROSS\s+JOIN|JOIN)\s+[\w.]+(?:\s+AS\s+\w+)?\s+ON\s+([\s\S]*?)(?=\s+(?:INNER\s+JOIN|LEFT\s+JOIN|RIGHT\s+JOIN|FULL\s+JOIN|CROSS\s+JOIN|JOIN|WHERE|GROUP\s+BY|ORDER\s+BY|HAVING|LIMIT|UNION|;|$))/gi;

        const joinOnClauses = [];
        let match;
        while ((match = joinOnRegex.exec(cleanedStatement)) !== null) {
            const onCondition = match[2].trim();
            if (onCondition) {
                joinOnClauses.push(onCondition);
            }
        }

        return joinOnClauses;
    }

    // Split clause into individual lines while preserving logical completeness
    function splitClauseIntoLines(clause) {
        if (!clause) return [];

        // Split by newlines first
        const rawLines = clause.split('\n');
        const processedLines = [];

        rawLines.forEach(line => {
            const trimmedLine = line.trim();

            // Skip empty lines and pure comment lines
            if (!trimmedLine || trimmedLine.startsWith('--')) {
                return;
            }

            // Remove inline comments but keep the main content
            const cleanedLine = trimmedLine.replace(/--.*$/, '').trim();
            if (cleanedLine) {
                processedLines.push(cleanedLine);
            }
        });

        return processedLines;
    }

    // Enhanced line matching with multiple strategies
    function isLineMatchingClause(lineText, clause) {

        const trimmedLine = lineText.trim();
        if (!trimmedLine) return false;

        // Remove comments from the line for comparison
        const cleanedLine = trimmedLine.replace(/--.*$/, '').trim();
        if (!cleanedLine) return false;
        const clauseLines = splitClauseIntoLines(clause);
        const filteredClauseLines = clauseLines.filter(line => line.length >= 5);

        /*
        // Strategy 1: Direct content matching in the complete clause
        if (clause.includes(trimmedLine) || clause.includes(cleanedLine)) {
            return true;
        }

        // Strategy 2: Normalized whitespace matching
        const normalizedLine = cleanedLine.replace(/\s+/g, ' ');
        const normalizedClause = clause.replace(/\s+/g, ' ');
        if (normalizedClause.includes(normalizedLine)) {
            return true;
        }

        // Strategy 3: Split clause into lines and check each line

        for (const clauseLine of clauseLines) {
            // Direct match
            if (clauseLine === cleanedLine || clauseLine === trimmedLine) {
                return true;
            }

            // Normalized match
            const normalizedClauseLine = clauseLine.replace(/\s+/g, ' ');
            if (normalizedClauseLine === normalizedLine) {
                return true;
            }

            // Partial match - check if the line is contained within a clause line
            if (clauseLine.includes(cleanedLine) || cleanedLine.includes(clauseLine)) {
                return true;
            }

            // Handle cases where the line might be a subset of a larger expression
            // For example, line: "user_id = 123" and clauseLine: "AND user_id = 123"
            if (clauseLine.includes(cleanedLine) &&
                (clauseLine.startsWith('AND ') || clauseLine.startsWith('OR ') ||
                 clauseLine.endsWith(' AND') || clauseLine.endsWith(' OR'))) {
                return true;
            }
        }*/

        // Strategy 4: Reverse check - see if any clause line is contained in the current line
        // This handles cases where the line has extra content like comments
        //console.log(`cleanedLine: ${cleanedLine}`);
        for (const clauseLine of filteredClauseLines) {
            if (cleanedLine.includes(clauseLine)) {
                return true;
            }
        }

        return false;
    }

    // Check if a line is within a complete WHERE clause
    function isLineInCompleteWhereClause(lineText, whereClauses) {
        const trimmedLine = lineText.trim();
        if (!trimmedLine) return false;

        return whereClauses.some(whereClause => {
            return isLineMatchingClause(lineText, whereClause);
        });
    }

    // Check if a line is within a complete JOIN ON clause
    function isLineInCompleteJoinOnClause(lineText, joinOnClauses) {
        const trimmedLine = lineText.trim();
        if (!trimmedLine) return false;

        return joinOnClauses.some(joinOnClause => {
            return isLineMatchingClause(lineText, joinOnClause);
        });
    }


    // Detect unsafe functions in SQL text (in WHERE and JOIN ON clauses) with accurate line numbers
    function detectUnsafeFunctions(sqlText, codeMirrorElement = null) {
        const detected = {};

        if (!codeMirrorElement) {
            return detected;
        }

        // Step 1: Split SQL text into individual statements
        const sqlStatements = splitSQLStatements(sqlText);
        console.log(`Split SQL into ${sqlStatements.length} statements:`, sqlStatements.map(s => s.text.substring(0, 50) + '...')); // Debug log

        // Get all CodeMirror lines
        const lines = codeMirrorElement.querySelectorAll('.CodeMirror-line');

        // Step 2: Process each SQL statement separately
        sqlStatements.forEach((statement, statementIndex) => {
            // Check if this statement contains any WHERE or JOIN ON patterns
            const hasRelevantClauses = /\b(WHERE|JOIN[\s\S]*?ON)\b/gi.test(statement.text);

            if (!hasRelevantClauses) {
                return; // No relevant clauses found in this statement
            }

            // Extract WHERE and JOIN ON clauses with line number information
            const whereClausesWithLines = extractWhereClausesWithLineNumbers(statement, sqlText, lines);
            const joinOnClausesWithLines = extractJoinOnClausesWithLineNumbers(statement, sqlText, lines);

            console.log(`Statement ${statementIndex + 1}: Found ${whereClausesWithLines.length} WHERE clauses and ${joinOnClausesWithLines.length} JOIN ON clauses`);

            // Process WHERE clauses
            whereClausesWithLines.forEach(clauseInfo => {
                clauseInfo.lineNumbers.forEach(lineInfo => {
                    // Remove comments from the line before processing
                    const cleanedLineText = removeComments(lineInfo.lineText);

                    // For WHERE clauses: extract only left-side expressions
                    const expressionsToCheck = extractLeftSideExpressionsFromLine(cleanedLineText);

                    // Check each expression for unsafe functions
                    expressionsToCheck.forEach(expression => {
                        Object.entries(UNSAFE_FUNCTIONS).forEach(([category, functions]) => {
                            functions.forEach(functionName => {
                                const regex = createFunctionRegex(functionName);
                                let match;

                                regex.lastIndex = 0; // Reset regex
                                while ((match = regex.exec(expression)) !== null) {
                                    // Special handling for TO_DATE function - check if it matches safe patterns
                                    if (functionName === 'TO_DATE') {
                                        // Extract the complete TO_DATE function call
                                        const toDateCall = extractToDateFunctionCall(expression, match.index);

                                        // Check if this TO_DATE call matches any safe patterns
                                        if (isSafeToDatePattern(toDateCall)) {
                                            //console.log(`Skipping safe TO_DATE pattern: ${toDateCall}`);
                                            continue; // Skip this detection as it's a safe pattern
                                        }
                                    }

                                    if (!detected[category]) {
                                        detected[category] = [];
                                    }

                                    // Calculate the actual column position in the original line
                                    const expressionStartInLine = cleanedLineText.indexOf(expression);
                                    const actualColumn = expressionStartInLine >= 0 ?
                                        expressionStartInLine + match.index + 1 :
                                        match.index + 1;

                                    detected[category].push({
                                        function: functionName,
                                        line: lineInfo.lineNumber,
                                        column: actualColumn,
                                        context: lineInfo.lineText, // Keep original line text for context display
                                        statementIndex: statementIndex // Track which statement this detection belongs to
                                    });
                                }
                            });
                        });
                    });
                });
            });

            // Process JOIN ON clauses
            joinOnClausesWithLines.forEach(clauseInfo => {
                clauseInfo.lineNumbers.forEach(lineInfo => {
                    // Remove comments from the line before processing
                    const cleanedLineText = removeComments(lineInfo.lineText);

                    // For JOIN ON clauses: check the entire line for unsafe functions
                    const expressionsToCheck = [cleanedLineText];

                    // Check each expression for unsafe functions
                    expressionsToCheck.forEach(expression => {
                        Object.entries(UNSAFE_FUNCTIONS).forEach(([category, functions]) => {
                            functions.forEach(functionName => {
                                const regex = createFunctionRegex(functionName);
                                let match;

                                regex.lastIndex = 0; // Reset regex
                                while ((match = regex.exec(expression)) !== null) {
                                    // Special handling for TO_DATE function - check if it matches safe patterns
                                    if (functionName === 'TO_DATE') {
                                        // Extract the complete TO_DATE function call
                                        const toDateCall = extractToDateFunctionCall(expression, match.index);

                                        // Check if this TO_DATE call matches any safe patterns
                                        if (isSafeToDatePattern(toDateCall)) {
                                            //console.log(`Skipping safe TO_DATE pattern: ${toDateCall}`);
                                            continue; // Skip this detection as it's a safe pattern
                                        }
                                    }

                                    if (!detected[category]) {
                                        detected[category] = [];
                                    }

                                    // Calculate the actual column position in the original line
                                    const expressionStartInLine = cleanedLineText.indexOf(expression);
                                    const actualColumn = expressionStartInLine >= 0 ?
                                        expressionStartInLine + match.index + 1 :
                                        match.index + 1;

                                    detected[category].push({
                                        function: functionName,
                                        line: lineInfo.lineNumber,
                                        column: actualColumn,
                                        context: lineInfo.lineText, // Keep original line text for context display
                                        statementIndex: statementIndex // Track which statement this detection belongs to
                                    });
                                }
                            });
                        });
                    });
                });
            });
        });

        return detected;
    }

    // Check if a line belongs to a specific SQL statement using improved content matching
    function isLineInStatement(lineText, fullSqlText, statement) {
        const trimmedLineText = lineText.trim();
        if (!trimmedLineText) return false;

        // Strategy 1: Check if the line content exists within the statement text
        if (statement.text.includes(trimmedLineText)) {
            return true;
        }

        // Strategy 2: Try normalized whitespace matching within the statement
        const normalizedLine = trimmedLineText.replace(/\s+/g, ' ');
        const normalizedStatement = statement.text.replace(/\s+/g, ' ');
        if (normalizedStatement.includes(normalizedLine)) {
            return true;
        }

        // Strategy 3: Check for partial matches with key SQL keywords from the line
        const sqlKeywords = ['SELECT', 'FROM', 'WHERE', 'JOIN', 'ON', 'AND', 'OR', 'CREATE', 'INSERT', 'UPDATE', 'DELETE'];
        const lineKeywords = sqlKeywords.filter(keyword => trimmedLineText.toUpperCase().includes(keyword));

        if (lineKeywords.length > 0) {
            // If the line contains SQL keywords, check if those keywords exist in the statement
            const hasMatchingKeywords = lineKeywords.every(keyword =>
                statement.text.toUpperCase().includes(keyword)
            );

            if (hasMatchingKeywords) {
                return true;
            }
        }

        // Strategy 4: Fallback to position-based matching (improved)
        let lineIndex = fullSqlText.indexOf(trimmedLineText);
        if (lineIndex === -1) {
            lineIndex = fullSqlText.replace(/\s+/g, ' ').indexOf(normalizedLine);
        }

        if (lineIndex !== -1) {
            const inRange = lineIndex >= statement.startPosition && lineIndex < statement.endPosition;
            return inRange;
        }

        return false;
    }

    // Extract left-side expressions from a single line of SQL
    function extractLeftSideExpressionsFromLine(lineText) {
        const leftSideExpressions = [];

        // Split the line by common logical operators while preserving the structure
        const conditions = splitLineConditions(lineText);

        conditions.forEach(condition => {
            // Check if condition contains comparison operators (including regex operators)
            if (/[=<>~]|BETWEEN/i.test(condition)) {
                // Parse the comparison and extract only the left side
                const leftSides = parseComparisonExpression(condition);
                leftSideExpressions.push(...leftSides);
            }
        });

        return leftSideExpressions;
    }

    // Split a line into individual conditions, similar to splitWhereConditions but for single lines
    function splitLineConditions(lineText) {
        const conditions = [];
        let current = '';
        let parenDepth = 0;
        let inQuotes = false;
        let quoteChar = '';

        for (let i = 0; i < lineText.length; i++) {
            const char = lineText[i];
            const nextChars = lineText.substr(i, 4).toUpperCase();

            // Handle quotes
            if ((char === '"' || char === "'") && !inQuotes) {
                inQuotes = true;
                quoteChar = char;
                current += char;
            } else if (char === quoteChar && inQuotes) {
                inQuotes = false;
                quoteChar = '';
                current += char;
            } else if (inQuotes) {
                current += char;
            } else {
                // Handle parentheses
                if (char === '(') {
                    parenDepth++;
                    current += char;
                } else if (char === ')') {
                    parenDepth--;
                    current += char;
                } else if (parenDepth === 0 && (nextChars === 'AND ' || nextChars === 'OR ')) {
                    // Found AND/OR at top level
                    if (current.trim()) {
                        conditions.push(current.trim());
                    }
                    current = '';
                    i += 3; // Skip past 'AND' or 'OR '
                } else {
                    current += char;
                }
            }
        }

        // Add the last condition
        if (current.trim()) {
            conditions.push(current.trim());
        }

        // If no conditions were found, return the entire line as a single condition
        if (conditions.length === 0 && lineText.trim()) {
            conditions.push(lineText.trim());
        }

        return conditions;
    }


    // Create summary panel
    function createSummaryPanel() {
        if (panel) {
            panel.remove();
        }

        panel = document.createElement('div');
        panel.className = 'unsafe-function-panel';
        panel.style.display = panelVisible ? 'block' : 'none';

        const header = document.createElement('div');
        header.className = 'unsafe-function-panel-header';
        header.innerHTML = `
            <span>Unsafe Functions</span>
            <button class="close-btn" onclick="this.parentElement.parentElement.style.display='none'">×</button>
        `;

        const content = document.createElement('div');
        content.className = 'unsafe-function-panel-content';

        const hasDetections = Object.keys(detectedFunctions).length > 0;

        if (!hasDetections) {
            content.innerHTML = '<div class="no-unsafe-functions">No unsafe functions detected in SQL queries.</div>';
        } else {
            Object.entries(detectedFunctions).forEach(([category, functions]) => {
                const categoryDiv = document.createElement('div');
                categoryDiv.className = 'unsafe-function-category';

                const titleDiv = document.createElement('div');
                titleDiv.className = 'unsafe-function-category-title';
                titleDiv.textContent = `${category} (${functions.length})`;
                categoryDiv.appendChild(titleDiv);

                functions.forEach(func => {
                    const itemDiv = document.createElement('div');
                    itemDiv.className = 'unsafe-function-item';
                    itemDiv.innerHTML = `
                        <strong>${func.function}</strong> at line ${func.line}:${func.column}<br>
                        <small>${func.context}</small>
                    `;
                    categoryDiv.appendChild(itemDiv);
                });

                content.appendChild(categoryDiv);
            });
        }

        panel.appendChild(header);
        panel.appendChild(content);
        document.body.appendChild(panel);

        // Set up click handlers for jump-to-line functionality (non-intrusive addition)
        setupSummaryClickHandlers();
    }

    // Create toggle button
    function createToggleButton() {
        if (toggleBtn) {
            toggleBtn.remove();
        }

        toggleBtn = document.createElement('button');
        toggleBtn.className = 'toggle-btn';
        toggleBtn.textContent = 'Unsafe Functions Detector';
        toggleBtn.title = 'Built by ARTS DE'
        toggleBtn.onclick = () => {
            panelVisible = !panelVisible;
            if (panel) {
                panel.style.display = panelVisible ? 'block' : 'none';
            }
            if (panelVisible) {
                scanForUnsafeFunctions();
            }
        };
        document.body.appendChild(toggleBtn);
    }

    // Extract SQL text from CodeMirror element, excluding gutter content
    function extractSQLText(codeMirrorElement) {
        // Get all CodeMirror-line elements directly from the original element
        const lines = codeMirrorElement.querySelectorAll('.CodeMirror-line');

        // Extract text from each line and join with newlines to preserve line structure
        const lineTexts = [];
        lines.forEach(line => {
            const lineText = line.textContent || line.innerText || '';
            lineTexts.push(lineText);
        });

        // Join lines with newline characters to maintain proper word boundaries
        return lineTexts.join('\n');
    }


    // Clear existing CSS-only highlights
    function clearCSSHighlights() {
        // Remove existing highlight stylesheet
        if (highlightStyleSheet) {
            highlightStyleSheet.remove();
            highlightStyleSheet = null;
        }

        // Remove ALL highlight classes and data attributes from ALL CodeMirror lines
        const allLines = document.querySelectorAll('.CodeMirror-line');
        allLines.forEach(line => {
            line.classList.remove('has-unsafe-function');
            line.removeAttribute('data-unsafe-function');
        });

        // Remove data attributes from CodeMirror elements
        const codeMirrorElements = document.querySelectorAll('.CodeMirror-scroll');
        codeMirrorElements.forEach(element => {
            element.removeAttribute('data-unsafe-functions');
        });

        // Force remove any remaining highlight styles by creating an empty stylesheet
        const cleanupStyleSheet = document.createElement('style');
        cleanupStyleSheet.id = 'unsafe-function-cleanup';
        cleanupStyleSheet.textContent = `
            .CodeMirror-line {
                background-color: transparent !important;
                border-left: none !important;
                padding-left: 0 !important;
            }
            .CodeMirror-line::after {
                display: none !important;
            }
        `;
        document.head.appendChild(cleanupStyleSheet);

        // Remove cleanup stylesheet after a brief moment
        setTimeout(() => {
            if (cleanupStyleSheet && cleanupStyleSheet.parentNode) {
                cleanupStyleSheet.remove();
            }
        }, 100);
    }

    // Apply robust highlighting with persistence and text selectability
    function applyCSSOnlyHighlighting(codeMirrorElement, elementIndex) {
        const fullSqlText = extractSQLText(codeMirrorElement);
        if (!fullSqlText) return;

        ////console.log('Full SQL Text:', fullSqlText.substring(0, 200) + '...'); // Debug log

        // Use the SAME logic as detectUnsafeFunctions to ensure consistency
        const detectedFunctions = detectUnsafeFunctions(fullSqlText, codeMirrorElement);

        ////console.log('Detection results:', detectedFunctions); // Debug log

        // If no unsafe functions detected, don't highlight anything
        if (Object.keys(detectedFunctions).length === 0) {
            ////console.log('No unsafe functions detected - skipping highlighting'); // Debug log
            return;
        }

        // Find all text nodes within CodeMirror lines
        const lines = codeMirrorElement.querySelectorAll('.CodeMirror-line');

        // Clear previous highlight tracking for this element
        highlightedLines.clear();

        // Split SQL into statements to get statement-specific clause ranges
        const sqlStatements = splitSQLStatements(fullSqlText);
        ////console.log(`Highlighting: Split SQL into ${sqlStatements.length} statements`); // Debug log

        // Directly highlight lines based on detection results
        Object.entries(detectedFunctions).forEach(([category, functions]) => {
            functions.forEach(func => {
                ////console.log(`Highlighting function: ${func.function} at line ${func.line} (statement ${func.statementIndex + 1})`); // Debug log

                // Find the specific line by line number (func.line is 1-based, array is 0-based)
                const targetLineIndex = func.line - 1;
                if (targetLineIndex >= 0 && targetLineIndex < lines.length) {
                    const line = lines[targetLineIndex];
                    const lineText = line.textContent || '';

                    // Get the statement this function belongs to
                    const statement = sqlStatements[func.statementIndex];
                    if (!statement) {
                        ////console.log(`Statement ${func.statementIndex} not found, skipping highlight`); // Debug log
                        return;
                    }

                    // Verify this line contains the function and is in relevant clause of the correct statement
                    const cleanedLineText = removeComments(lineText);
                    const functionRegex = createFunctionRegex(func.function);

                    // Extract complete WHERE and JOIN ON clauses for this statement
                    const whereClauses = extractCompleteWhereClauses(statement.text);
                    const joinOnClauses = extractCompleteJoinOnClauses(statement.text);

                    if (functionRegex.test(cleanedLineText) &&
                        isLineInStatement(lineText, fullSqlText, statement) &&
                        isLineInRelevantClause(lineText, statement.text, statement, whereClauses, joinOnClauses)) {

                        ////console.log(`Highlighting line ${func.line}: ${lineText.trim()} for function: ${func.function}`); // Debug log

                        // Apply both CSS class and inline styles for maximum persistence
                        line.classList.add('has-unsafe-function');

                        // Apply inline styles that are harder to override
                        line.style.setProperty('background-color', 'rgba(255, 235, 59, 0.3)', 'important');
                        line.style.setProperty('border-left', '3px solid #ff9800', 'important');
                        line.style.setProperty('padding-left', '5px', 'important');
                        line.style.setProperty('user-select', 'text', 'important');
                        line.style.setProperty('-webkit-user-select', 'text', 'important');
                        line.style.setProperty('-moz-user-select', 'text', 'important');
                        line.style.setProperty('-ms-user-select', 'text', 'important');

                        // Store multiple functions if they exist on the same line
                        const existingFunctions = line.getAttribute('data-unsafe-function') || '';
                        const functionList = existingFunctions ? existingFunctions.split(',') : [];
                        if (!functionList.includes(func.function)) {
                            functionList.push(func.function);
                            line.setAttribute('data-unsafe-function', functionList.join(','));
                        }

                        // Store highlight information for persistence tracking
                        const lineKey = `${elementIndex}-${func.line}`;
                        highlightedLines.set(lineKey, {
                            element: line,
                            functions: functionList,
                            lineNumber: func.line,
                            elementIndex: elementIndex
                        });
                    } else {
                        ////console.log(`Skipping highlight for line ${func.line}: function test=${functionRegex.test(cleanedLineText)}, inStatement=${isLineInStatement(lineText, fullSqlText, statement)}, inRelevantClause=${isLineInRelevantClause(lineText, statement.text, null)}`); // Debug log
                    }
                }
            });
        });

        // Generate CSS rules for highlighting
        generateHighlightCSS();

        // Start highlight protection if not already running
        startHighlightProtection();
    }

    // Note: findRelevantClauseRanges method removed - we now use semantic detection
    // instead of position-based range matching for better accuracy and maintainability

    // Check if a line is within a relevant clause (WHERE or JOIN ON) using content-based semantic detection
    function isLineInRelevantClause(lineText, fullSqlText, statement, whereClauses, joinOnClauses) {
        const cleanedLineText = removeComments(lineText.trim());
        if (!cleanedLineText) return false;

        // Method 1: Complete clause matching (more accurate)
        if (whereClauses && isLineInCompleteWhereClause(lineText, whereClauses)) {
            return true;
        }

        if (joinOnClauses && isLineInCompleteJoinOnClause(lineText, joinOnClauses)) {
            return true;
        }

        // Method 2: Fallback to semantic detection
        if (isWhereConditionLine(cleanedLineText)) {
            return true;
        }

        if (isJoinOnConditionLine(cleanedLineText)) {
            return true;
        }

        return false;
    }

    // Check if a line contains WHERE condition expressions
    function isWhereConditionLine(lineText) {
        const upperLineText = lineText.toUpperCase();

        // Skip if this looks like a SELECT statement or FROM clause
        if (upperLineText.includes('SELECT ') || upperLineText.includes('FROM ')) {
            // But allow if it's clearly a WHERE condition with SELECT in a subquery
            if (!upperLineText.includes('WHERE ')) {
                return false;
            }
        }

        // Skip if this is obviously a JOIN ON context
        if (isObviousJoinOnContext(lineText)) {
            return false;
        }

        // Skip if this is part of a CASE expression
        if (isCaseExpressionLine(lineText)) {
            return false;
        }

        // Skip if this is part of CREATE TABLE or other DDL statements
        if (isDDLContextLine(lineText)) {
            return false;
        }

        // Check for comparison operators
        const hasComparisonOperators = /[=<>!~]|BETWEEN|IN\s*\(|EXISTS\s*\(|LIKE|ILIKE|SIMILAR\s+TO/i.test(lineText);

        // Check for logical operators (but not in SELECT context)
        const hasLogicalOperators = /\b(AND|OR)\b/i.test(lineText) && !upperLineText.includes('SELECT ');

        // Check for WHERE keyword
        const hasWhereKeyword = /\bWHERE\b/i.test(lineText);

        // Check for common WHERE condition patterns
        const hasConditionPatterns = /\b(TRUNC|TO_DATE|EXTRACT|DATE_PART|CAST)\s*\(/i.test(lineText);

        const isWhereCondition = hasComparisonOperators || hasLogicalOperators || hasWhereKeyword || hasConditionPatterns;

        return isWhereCondition;
    }

    // Check if a line is obviously in JOIN ON context
    function isObviousJoinOnContext(lineText) {
        const upperLineText = lineText.toUpperCase();

        // Direct JOIN keywords with ON in the same line
        if (/\b(INNER\s+JOIN|LEFT\s+(?:OUTER\s+)?JOIN|RIGHT\s+(?:OUTER\s+)?JOIN|FULL\s+(?:OUTER\s+)?JOIN|CROSS\s+JOIN|JOIN)\b.*\bON\b/i.test(lineText)) {
            return true;
        }

        // Lines that start with JOIN keywords
        if (/^\s*(INNER\s+JOIN|LEFT\s+(?:OUTER\s+)?JOIN|RIGHT\s+(?:OUTER\s+)?JOIN|FULL\s+(?:OUTER\s+)?JOIN|CROSS\s+JOIN|JOIN)\b/i.test(lineText)) {
            return true;
        }

        // Lines that contain table.column = table.column patterns (typical JOIN conditions)
        // This pattern is more specific than general comparisons and strongly suggests JOIN context
        if (/\b\w+\.\w+\s*[=<>!]\s*\w+\.\w+\b/i.test(lineText)) {
            // Additional check: if the line also contains JOIN or ON keywords, it's definitely JOIN context
            if (/\b(JOIN|ON)\b/i.test(lineText)) {
                return true;
            }

            // Even without explicit JOIN/ON keywords, table.column = table.column is typically JOIN
            // But be more conservative - only if it doesn't contain WHERE keyword
            if (!upperLineText.includes('WHERE')) {
                return true;
            }
        }

        return false;
    }

    // Check if a line is part of a CASE expression
    function isCaseExpressionLine(lineText) {
        const upperLineText = lineText.toUpperCase().trim();

        // Direct CASE keywords
        if (/\b(CASE|WHEN|THEN|ELSE|END)\b/i.test(lineText)) {
            return true;
        }

        // Lines that are likely part of CASE expression context
        // Look for patterns like "WHEN condition" or "AND condition" following CASE
        if (/^\s*(WHEN\s+|AND\s+|OR\s+).*[=<>!~]/i.test(lineText)) {
            return true;
        }

        // Lines with comparison operators that start with logical operators (likely CASE conditions)
        if (/^\s*(AND|OR)\s+.*[=<>!~]/i.test(lineText)) {
            return true;
        }

        return false;
    }

    // Check if a line is in DDL (Data Definition Language) context
    function isDDLContextLine(lineText) {
        const upperLineText = lineText.toUpperCase();

        // DDL statement keywords
        if (/\b(CREATE\s+TABLE|ALTER\s+TABLE|DROP\s+TABLE|CREATE\s+INDEX|CREATE\s+VIEW)\b/i.test(lineText)) {
            return true;
        }

        // Column definition patterns in CREATE TABLE
        if (/\b(DISTKEY|SORTKEY|ENCODE|NOT\s+NULL|PRIMARY\s+KEY|FOREIGN\s+KEY)\b/i.test(lineText)) {
            return true;
        }

        // Table constraint patterns
        if (/^\s*--.*\b(table|column|constraint)\b/i.test(lineText)) {
            return true;
        }

        return false;
    }

    // Check if a line contains JOIN ON condition expressions
    function isJoinOnConditionLine(lineText) {
        const upperLineText = lineText.toUpperCase();

        // Check for JOIN ON keywords
        const hasJoinOnKeywords = /\b(JOIN|ON)\b/i.test(lineText);

        // Check for table join patterns (table.column = table.column)
        const hasJoinPatterns = /\w+\.\w+\s*[=<>!]\s*\w+\.\w+/i.test(lineText);

        // Check for comparison operators in JOIN context
        const hasComparisonInJoin = hasJoinOnKeywords && /[=<>!~]/i.test(lineText);

        const isJoinOnCondition = hasJoinOnKeywords || hasJoinPatterns || hasComparisonInJoin;

        return isJoinOnCondition;
    }


    // Generate dynamic CSS rules for highlighting unsafe functions
    function generateHighlightCSS() {
        // Remove existing highlight stylesheet
        if (highlightStyleSheet) {
            highlightStyleSheet.remove();
        }

        // Create new stylesheet for highlights
        highlightStyleSheet = document.createElement('style');
        highlightStyleSheet.id = 'unsafe-function-highlights';

        // Create CSS rules that highlight lines containing unsafe functions
        let cssRules = `
            .CodeMirror-line.has-unsafe-function {
                background: linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(251, 191, 36, 0.1) 100%) !important;
                border-left: 4px solid #f59e0b !important;
                padding-left: 8px !important;
                user-select: text !important;
                -webkit-user-select: text !important;
                -moz-user-select: text !important;
                -ms-user-select: text !important;
                position: relative !important;
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
            }

            .CodeMirror-line.has-unsafe-function:hover {
                background: linear-gradient(135deg, rgba(245, 158, 11, 0.25) 0%, rgba(251, 191, 36, 0.2) 100%) !important;
                border-left-color: #d97706 !important;
                box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.06) !important;
            }
        `;

        // Add specific highlighting for each unsafe function type
        ALL_UNSAFE_FUNCTIONS.forEach(functionName => {
            const escapedName = functionName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            cssRules += `
                .CodeMirror-line[data-unsafe-function*="${functionName}"] {
                    position: relative;
                }

                .CodeMirror-line[data-unsafe-function*="${functionName}"]::after {
                    content: "⚠️ ${functionName}";
                    position: absolute;
                    right: 12px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
                    color: white;
                    padding: 3px 8px;
                    border-radius: 6px;
                    font-size: 11px;
                    font-weight: 600;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    pointer-events: none;
                    z-index: 10;
                    box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.06);
                    opacity: 0.9;
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .CodeMirror-line[data-unsafe-function*="${functionName}"]:hover::after {
                    opacity: 1;
                    transform: translateY(-50%) scale(1.05);
                }
            `;
        });

        highlightStyleSheet.textContent = cssRules;
        document.head.appendChild(highlightStyleSheet);
    }

    // Main scanning function
    function scanForUnsafeFunctions() {
        if (isScanning) {
            return; // Prevent concurrent scans
        }

        isScanning = true;
        detectedFunctions = {};

        try {
            // Clear existing CSS highlights
            clearCSSHighlights();

            // Find all CodeMirror-scroll elements (top-level containers only to avoid duplicate scanning)
            const codeMirrorElements = document.querySelectorAll('.CodeMirror-scroll');

            codeMirrorElements.forEach((element, index) => {
                const sqlText = extractSQLText(element);
                if (sqlText && sqlText.trim()) {
                    // Pass the CodeMirror element to detectUnsafeFunctions for accurate line numbers
                    const detected = detectUnsafeFunctions(sqlText, element);

                    // Merge detected functions with comprehensive deduplication
                    Object.entries(detected).forEach(([category, functions]) => {
                        if (!detectedFunctions[category]) {
                            detectedFunctions[category] = [];
                        }

                        // Add all functions from this element
                        functions.forEach(func => {
                            detectedFunctions[category].push(func);
                        });
                    });

                    // Apply CSS-only highlighting to WHERE/AND clauses only
                    applyCSSOnlyHighlighting(element, index);
                }
            });

            // Apply comprehensive deduplication to the final results
            detectedFunctions = deduplicateDetections(detectedFunctions);

            createSummaryPanel();
        } finally {
            isScanning = false;
        }
    }

    // Highlight protection system - restores lost highlights
    function startHighlightProtection() {
        if (highlightProtectionInterval) {
            return; // Already running
        }

        highlightProtectionInterval = setInterval(() => {
            if (!panelVisible || highlightedLines.size === 0) {
                return;
            }

            // Check each highlighted line and restore if needed
            highlightedLines.forEach((highlightInfo, lineKey) => {
                const { element, functions, lineNumber, elementIndex } = highlightInfo;

                // Check if element still exists in DOM
                if (!document.contains(element)) {
                    highlightedLines.delete(lineKey);
                    return;
                }

                // Check if highlight styles are still applied
                const hasClass = element.classList.contains('has-unsafe-function');
                const hasInlineStyle = element.style.backgroundColor &&
                    element.style.backgroundColor.includes('255, 235, 59');

                if (!hasClass || !hasInlineStyle) {
                    // Restore CSS class
                    element.classList.add('has-unsafe-function');

                    // Restore inline styles
                    element.style.setProperty('background-color', 'rgba(255, 235, 59, 0.3)', 'important');
                    element.style.setProperty('border-left', '3px solid #ff9800', 'important');
                    element.style.setProperty('padding-left', '5px', 'important');
                    element.style.setProperty('user-select', 'text', 'important');
                    element.style.setProperty('-webkit-user-select', 'text', 'important');
                    element.style.setProperty('-moz-user-select', 'text', 'important');
                    element.style.setProperty('-ms-user-select', 'text', 'important');

                    // Restore data attribute
                    element.setAttribute('data-unsafe-function', functions.join(','));
                }
            });
        }, 500); // Check every 500ms
    }


    // Handle click events on CodeMirror lines to prevent highlight loss
    function setupClickProtection() {
        document.addEventListener('click', function(event) {
            const clickedLine = event.target.closest('.CodeMirror-line');
            if (clickedLine && clickedLine.classList.contains('has-unsafe-function')) {
                // Schedule highlight restoration after a short delay
                setTimeout(() => {
                    if (clickedLine.classList.contains('has-unsafe-function')) {
                        // Ensure inline styles are still applied
                        clickedLine.style.setProperty('background-color', 'rgba(255, 235, 59, 0.3)', 'important');
                        clickedLine.style.setProperty('border-left', '3px solid #ff9800', 'important');
                        clickedLine.style.setProperty('padding-left', '5px', 'important');
                        clickedLine.style.setProperty('user-select', 'text', 'important');
                        clickedLine.style.setProperty('-webkit-user-select', 'text', 'important');
                        clickedLine.style.setProperty('-moz-user-select', 'text', 'important');
                        clickedLine.style.setProperty('-ms-user-select', 'text', 'important');
                    }
                }, 50);
            }
        }, true); // Use capture phase to catch events early
    }

    // Debounced scan function
    function debouncedScan() {
        if (scanTimeout) {
            clearTimeout(scanTimeout);
        }
        scanTimeout = setTimeout(() => {
            if (panelVisible && !isScanning) {
                scanForUnsafeFunctions();
            }
        }, 300);
    }

    // Initialize the script
    function initialize() {
        createToggleButton();
        setupClickProtection();
    }

    // Wait for page to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

})();
