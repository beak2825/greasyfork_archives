// ==UserScript==
// @name         zyBooks Challenge Exporter
// @namespace    https://github.com/GooglyBlox
// @version      1.0
// @description  Export zyBooks challenge activities in LLM-readable format
// @author       GooglyBlox
// @match        https://learn.zybooks.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552513/zyBooks%20Challenge%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/552513/zyBooks%20Challenge%20Exporter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function extractLatexFromMathJax(element) {
        const mathJaxContainers = element.querySelectorAll('mjx-container');
        const replacements = new Map();

        mathJaxContainers.forEach((container, index) => {
            const assistiveMath = container.querySelector('mjx-assistive-mml math');
            if (assistiveMath) {
                const latex = assistiveMath.getAttribute('data-latex');
                if (latex) {
                    const placeholder = `__LATEX_${index}__`;
                    replacements.set(placeholder, latex);
                    container.setAttribute('data-placeholder', placeholder);
                }
            }
        });

        let text = element.textContent;

        mathJaxContainers.forEach((container) => {
            const placeholder = container.getAttribute('data-placeholder');
            if (placeholder && replacements.has(placeholder)) {
                const latex = replacements.get(placeholder);
                text = text.replace(container.textContent, ` $${latex}$ `);
            }
        });

        return text.replace(/\s+/g, ' ').trim();
    }

    function getElementPosition(element) {
        const style = element.style;
        const top = parseFloat(style.top) || 0;
        const left = parseFloat(style.left) || 0;
        return { top, left };
    }

    function extractTableData(table) {
        const rows = table.querySelectorAll('tr');
        const tableData = [];

        rows.forEach((row) => {
            const cells = row.querySelectorAll('td, th');
            const rowData = [];

            cells.forEach((cell) => {
                const cellText = extractLatexFromMathJax(cell);
                rowData.push(cellText);
            });

            if (rowData.length > 0) {
                tableData.push(rowData);
            }
        });

        return tableData;
    }

    function formatTable(tableData) {
        if (tableData.length === 0) {
            return '';
        }

        const colWidths = [];
        for (let i = 0; i < tableData[0].length; i++) {
            let maxWidth = 0;
            tableData.forEach(row => {
                if (row[i]) {
                    maxWidth = Math.max(maxWidth, row[i].length);
                }
            });
            colWidths.push(Math.min(maxWidth, 80));
        }

        let output = '';
        tableData.forEach((row, rowIndex) => {
            const formattedRow = row.map((cell, colIndex) => {
                return cell.padEnd(colWidths[colIndex]);
            }).join(' | ');
            output += formattedRow + '\n';

            if (rowIndex === 0) {
                output += colWidths.map(w => '-'.repeat(w)).join('-+-') + '\n';
            }
        });

        return output;
    }

    function extractQuestionData() {
        const questionArea = document.querySelector('.question-area');
        if (!questionArea) {
            return null;
        }

        const textElements = questionArea.querySelectorAll('.text-element:not([aria-hidden="true"])');
        const dropdowns = questionArea.querySelectorAll('.dropdown select');
        const tables = questionArea.querySelectorAll('table');
        const checkboxes = questionArea.querySelectorAll('.zb-checkbox');

        let questionText = '';
        const checkboxLabels = [];

        textElements.forEach((element) => {
            const extractedText = extractLatexFromMathJax(element);
            if (extractedText && extractedText.length > 0) {
                const isLabel = (extractedText.includes(':') && extractedText.length < 20) ||
                               /\$.*:\$/.test(extractedText);

                if (isLabel) {
                    const position = getElementPosition(element);
                    checkboxLabels.push({
                        text: extractedText,
                        position: position
                    });
                } else {
                    questionText += extractedText + '\n\n';
                }
            }
        });

        const tableContent = [];
        tables.forEach((table) => {
            const tableData = extractTableData(table);
            if (tableData.length > 0) {
                tableContent.push(tableData);
            }
        });

        const dropdownData = [];
        dropdowns.forEach((select) => {
            const label = select.getAttribute('aria-label') || 'Unlabeled dropdown';
            const options = Array.from(select.options)
                .filter(opt => opt.value !== 'Pick')
                .map(opt => opt.value);

            const selectedValue = select.value !== 'Pick' ? select.value : 'Not selected';

            dropdownData.push({
                label: label,
                currentSelection: selectedValue,
                options: options
            });
        });

        const groupedCheckboxes = {};

        checkboxes.forEach((checkboxElement) => {
            const input = checkboxElement.querySelector('input[type="checkbox"]');
            const label = checkboxElement.querySelector('label');

            if (input && label) {
                const labelText = extractLatexFromMathJax(label);
                const isChecked = input.checked;
                const position = getElementPosition(checkboxElement);

                let closestLabel = 'Ungrouped';
                let minDistance = Infinity;

                checkboxLabels.forEach((labelInfo) => {
                    const horizontalDistance = Math.abs(position.left - labelInfo.position.left);
                    const verticalDistance = Math.abs(position.top - labelInfo.position.top);

                    if (position.top > labelInfo.position.top && verticalDistance < 200) {
                        if (horizontalDistance < minDistance) {
                            minDistance = horizontalDistance;
                            closestLabel = labelInfo.text;
                        }
                    }
                });

                if (!groupedCheckboxes[closestLabel]) {
                    groupedCheckboxes[closestLabel] = [];
                }

                groupedCheckboxes[closestLabel].push({
                    text: labelText,
                    checked: isChecked,
                    position: position
                });
            }
        });

        Object.keys(groupedCheckboxes).forEach(key => {
            groupedCheckboxes[key].sort((a, b) => a.position.top - b.position.top);
        });

        return {
            questionText: questionText.trim(),
            tables: tableContent,
            dropdowns: dropdownData,
            checkboxGroups: groupedCheckboxes
        };
    }

    function formatForExport(data) {
        if (!data) {
            return 'No question data found.';
        }

        let output = 'QUESTION:\n';
        output += '='.repeat(80) + '\n\n';
        output += data.questionText + '\n\n';

        if (data.tables.length > 0) {
            output += 'PROOF TABLE:\n';
            output += '='.repeat(80) + '\n\n';

            data.tables.forEach((tableData, index) => {
                if (index > 0) {
                    output += '\n';
                }
                output += formatTable(tableData);
            });

            output += '\n';
        }

        if (data.dropdowns.length > 0) {
            output += 'ANSWER CHOICES:\n';
            output += '='.repeat(80) + '\n\n';

            data.dropdowns.forEach((dropdown) => {
                output += `${dropdown.label}\n`;
                output += `Current Selection: ${dropdown.currentSelection}\n`;
                output += 'Options:\n';
                dropdown.options.forEach((option, optIndex) => {
                    output += `  ${optIndex + 1}. ${option}\n`;
                });
                output += '\n';
            });
        }

        if (Object.keys(data.checkboxGroups).length > 0) {
            output += 'CHECKBOX OPTIONS:\n';
            output += '='.repeat(80) + '\n\n';

            Object.keys(data.checkboxGroups).forEach((groupLabel) => {
                output += `${groupLabel}\n`;
                data.checkboxGroups[groupLabel].forEach((checkbox) => {
                    const status = checkbox.checked ? '[X]' : '[ ]';
                    output += `  ${status} ${checkbox.text}\n`;
                });
                output += '\n';
            });
        }

        return output;
    }

    function copyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();

        try {
            document.execCommand('copy');
            return true;
        } catch (err) {
            console.error('Failed to copy:', err);
            return false;
        } finally {
            document.body.removeChild(textarea);
        }
    }

    function createExportButton() {
        const button = document.createElement('button');
        button.textContent = 'Export';
        button.className = 'button zyante-progression-export-button';
        button.type = 'button';
        button.style.cssText = 'margin-left: 8px;';

        button.addEventListener('click', () => {
            const data = extractQuestionData();
            const formatted = formatForExport(data);

            if (copyToClipboard(formatted)) {
                const originalText = button.textContent;
                button.textContent = 'Copied!';
                setTimeout(() => {
                    button.textContent = originalText;
                }, 2000);
            } else {
                alert('Failed to copy to clipboard.');
            }
        });

        return button;
    }

    function insertExportButton() {
        const checkNextContainer = document.querySelector('.check-next-container');
        if (!checkNextContainer || document.querySelector('.zyante-progression-export-button')) {
            return false;
        }

        const firstDiv = checkNextContainer.querySelector('div');
        if (firstDiv) {
            const button = createExportButton();
            firstDiv.appendChild(button);
            return true;
        }

        return false;
    }

    function init() {
        const observer = new MutationObserver(() => {
            const progressionPlayer = document.querySelector('.ProgressionPlayer');
            if (progressionPlayer && !document.querySelector('.zyante-progression-export-button')) {
                insertExportButton();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        insertExportButton();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();