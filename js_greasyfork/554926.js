// ==UserScript==
// @name         zyBooks Exercise Exporter
// @namespace    https://github.com/GooglyBlox
// @version      1.0
// @description  Export zyBooks exercise activities in LLM-readable format
// @author       GooglyBlox
// @match        https://learn.zybooks.com/zybook/*/chapter/*/section/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554926/zyBooks%20Exercise%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/554926/zyBooks%20Exercise%20Exporter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function extractLatexFromMathJax(element) {
        const clone = element.cloneNode(true);
        const mathJaxContainers = clone.querySelectorAll('mjx-container');

        mathJaxContainers.forEach((container) => {
            const assistiveMath = container.querySelector('mjx-assistive-mml math');
            if (assistiveMath) {
                const latex = assistiveMath.getAttribute('data-latex');
                if (latex) {
                    const textNode = document.createTextNode(` $${latex}$ `);
                    container.parentNode.replaceChild(textNode, container);
                }
            }
        });

        return clone.textContent.replace(/\s+/g, ' ').trim();
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
            colWidths.push(maxWidth);
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

    function extractQuestionTextWithTables(textElement) {
        const clone = textElement.cloneNode(true);
        const tables = clone.querySelectorAll('table');
        const tablePlaceholders = [];

        tables.forEach((table, index) => {
            const tableData = extractTableData(table);
            const formattedTable = formatTable(tableData);
            const placeholder = `__TABLE_${index}__`;
            tablePlaceholders.push({ placeholder, table: formattedTable });

            const placeholderNode = document.createTextNode(`\n${placeholder}\n`);
            table.parentNode.replaceChild(placeholderNode, table);
        });

        const mathJaxContainers = clone.querySelectorAll('mjx-container');
        mathJaxContainers.forEach((container) => {
            const assistiveMath = container.querySelector('mjx-assistive-mml math');
            if (assistiveMath) {
                const latex = assistiveMath.getAttribute('data-latex');
                if (latex) {
                    const textNode = document.createTextNode(` $${latex}$ `);
                    container.parentNode.replaceChild(textNode, container);
                }
            }
        });

        let text = clone.textContent.replace(/\s+/g, ' ').trim();

        tablePlaceholders.forEach(({ placeholder, table }) => {
            text = text.replace(placeholder, '\n\n' + table);
        });

        return text;
    }

    function extractExerciseData(exerciseContainer) {
        const titleElement = exerciseContainer.querySelector('.activity-title');
        const title = titleElement ? extractLatexFromMathJax(titleElement) : 'Exercise';

        const setupElement = exerciseContainer.querySelector('.setup');
        const setup = setupElement ? extractQuestionTextWithTables(setupElement) : '';

        const questions = [];
        const questionElements = exerciseContainer.querySelectorAll('.question-set-question.exercise-question');

        questionElements.forEach((questionElement) => {
            const partElement = questionElement.querySelector('.part');
            const part = partElement ? partElement.textContent.trim() : '';

            const textElement = questionElement.querySelector('.question .text');
            const questionText = textElement ? extractQuestionTextWithTables(textElement) : '';

            const solutionElement = questionElement.querySelector('.solution');
            let solutionText = '';
            if (solutionElement) {
                const solutionContent = solutionElement.querySelector('.solution-content');
                if (solutionContent) {
                    solutionText = extractQuestionTextWithTables(solutionContent);
                }
            }

            questions.push({
                part: part,
                question: questionText,
                solution: solutionText
            });
        });

        return {
            title: title,
            setup: setup,
            questions: questions
        };
    }

    function formatForExport(data) {
        if (!data) {
            return 'No exercise data found.';
        }

        let output = 'EXERCISE: ' + data.title + '\n';
        output += '='.repeat(80) + '\n\n';

        if (data.setup) {
            output += 'INSTRUCTIONS:\n';
            output += data.setup + '\n\n';
        }

        if (data.questions.length > 0) {
            output += 'QUESTIONS:\n';
            output += '='.repeat(80) + '\n\n';

            data.questions.forEach((q) => {
                if (q.part) {
                    output += q.part + '\n';
                }
                output += q.question + '\n';

                if (q.solution) {
                    output += '\nSOLUTION:\n';
                    output += q.solution + '\n';
                }

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

    function createExportButton(exerciseContainer) {
        const button = document.createElement('button');
        button.className = 'zb-button secondary icon-button-with-title zybooks-exercise-export-button';
        button.type = 'button';
        button.style.cssText = 'margin-left: 8px;';

        const iconDiv = document.createElement('div');
        const icon = document.createElement('i');
        icon.className = 'zb-icon material-icons med secondary';
        icon.textContent = 'file_download';
        icon.setAttribute('role', 'img');
        icon.setAttribute('aria-hidden', 'true');
        iconDiv.appendChild(icon);

        const titleSpan = document.createElement('span');
        titleSpan.className = 'title';
        titleSpan.textContent = 'Export';

        button.appendChild(iconDiv);
        button.appendChild(titleSpan);

        button.addEventListener('click', () => {
            const data = extractExerciseData(exerciseContainer);
            const formatted = formatForExport(data);

            if (copyToClipboard(formatted)) {
                const originalText = titleSpan.textContent;
                titleSpan.textContent = 'Copied!';
                setTimeout(() => {
                    titleSpan.textContent = originalText;
                }, 2000);
            } else {
                alert('Failed to copy to clipboard.');
            }
        });

        return button;
    }

    function insertExportButtons() {
        const exerciseContainers = document.querySelectorAll('.exercise-content-resource');

        exerciseContainers.forEach((exerciseContainer) => {
            if (exerciseContainer.querySelector('.zybooks-exercise-export-button')) {
                return;
            }

            const headerButtons = exerciseContainer.querySelector('.static-container-header .flex.ml-auto.justify-end');
            if (headerButtons) {
                const button = createExportButton(exerciseContainer);
                headerButtons.insertBefore(button, headerButtons.firstChild);
            }
        });
    }

    function init() {
        const observer = new MutationObserver(() => {
            insertExportButtons();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        insertExportButtons();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();