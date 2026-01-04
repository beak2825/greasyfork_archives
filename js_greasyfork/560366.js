// ==UserScript==
// @name         Google Contacts - Adjustable Column Width with Tooltips
// @name:zh-CN   Google 通讯录 - 可调整列宽与工具提示
// @name:zh-TW   Google 通訊錄 - 可調整欄寬與工具提示
// @name:ja      Google 連絡先 - 調整可能な列幅とツールチップ
// @name:ko      Google 연락처 - 조정 가능한 열 너비 및 도구 설명
// @name:de      Google Kontos - Anpassbare Spaltenbreite mit Tooltips
// @name:fr      Google Contacts - Largeur de colonne adjustable avec info-bulles
// @name:es      Google Contacts - Ancho de columna ajustable con información sobre herramientas
// @name:it      Google Contatti - Larghezza colonna regolabile con suggerimenti
// @name:pt      Google Contacts - Largura de coluna ajustável com dicas de ferramenta
// @name:ru      Google Контакты - Настраиваемая ширина столбца с подсказками
// @name:ar      جهات اتصال Google - عرض عمود قابل للتعديل مع تلميحات أدوات
// @name:nl      Google Contacten - Aanpasbare kolombreedte met knopinfo
// @name:pl      Google Contacts - Regulowana szerokość kolumny z etykietkami narzędzi
// @name:tr      Google Kişiler - Araç İpuçlarıyla Ayarlanabilir Sütun Genişliği
// @name:vi      Google Danh bạ - Chiều rộng cột có thể điều chỉnh với chú thích công cụ
// @name:th      Google รายชื่อติดต่อ - ความกว้างคอลัมน์ปรับได้พร้อมเครื่องมือแนะนำ
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Make Google Contacts table columns resizable by dragging and show full content on hover
// @description:zh-CN  通过拖拽使 Google 通讯录表格列宽可调整，悬停时显示完整内容
// @description:zh-TW  透過拖曳使 Google 通訊錄表格欄寬可調整，懸停時顯示完整內容
// @description:ja     Google連絡先のテーブル列をドラッグでサイズ変更可能にし、ホバー時に全文を表示
// @description:ko     Google 연락처 테이블 열을 드래그로 크기 조절 가능하게 하고 호버 시 전체 내용 표시
// @description:de     Google Kontakte-Tabellenspalten durch Ziehen in der Größe anpassbar machen und vollen Inhalt beim Hovern anzeigen
// @description:fr     Rendre les colonnes du tableau Google Contacts redimensionnables par glisser-déposer et afficher le contenu complet au survol
// @description:es     Hacer que las columnas de la tabla de Google Contacts se puedan redimensionar arrastrando y mostrar el contenido completo al pasar el mouse
// @description:it     Rende ridimensionabili le colonne della tabella di Google Contatti trascinando e mostra il contenuto completo al passaggio del mouse
// @description:pt     Tornar as colunas da tabela do Google Contacts redimensionáveis por arrastar e mostrar o conteúdo completo ao passar o mouse
// @description:ru     Сделать столбцы таблицы Google Контакты изменяемыми путем перетаскивания и отображать полное содержимое при наведении
// @description:ar     جعل أعمدة جدول جهات اتصال Google قابلة لتغيير الحجم بالسحب وإظهار المحتوى الكامل عند التمرير
// @description:nl     Maak kolommen van de Google Contacten-tabel aanpasbaar door slepen en toon de volledige inhoud bij het aanwijzen
// @description:pl     Spraw, aby kolumny tabeli Google Contacts można było zmieniać rozmiar przez przeciąganie i wyświetlać pełną zawartość po najechaniu myszką
// @description:tr     Google Kişiler tablo sütunlarını sürükleme ile yeniden boyutlandırılabilir yapın ve üzerine gelindiğinde tam içeriği gösterin
// @description:vi     Làm cho các cột bảng Google Danh bạ có thể thay đổi kích thước bằng cách kéo và hiển thị đầy đủ nội dung khi di chuột qua
// @description:th     ทำให้คอลัมน์ตาราง Google รายชื่อติดต่อปรับขนาดได้ด้วยการลากและแสดงเนื้อหาทั้งหมดเมื่อวางเมาส์
// @author       aspen138
// @match        https://contacts.google.com/*
// @grant        none
// @license      MIT
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAEGklEQVR4Ae2bA5AcXRSF+7dt22bpN8JCPIht21yjsqXYmulCbBbCmY2dFGLbejfvpmaNmVeZzO3ZnK/qrLdf1Tndj7ctxwIAAAAAAAAANe2HLHfgL8sVHKq1TGuX1vmQdoV+NpT/5s7fRglQe82z2tQEbe4pLRWhTvH/3PnfuwC4Am0sd/BEjrHG4v/laxgCaq56Qhs3jU2MivhafE0QAQ02PK+7jwAbF1XxNfnaYcBA6wosNjLWQHxtDNClUSuYZW6qobiNYgDewK/aoFv3PABug9sqBHAHVrBBMRG3lQ/gXvcvGxNTcZshgCswPOYBcJtAQ/SAHhgPxzwAbpPbxlZD8Bs2RETcNvr/YGWxALht9P/BJmIBcNtY/QZ7iAXAbd/X4AnAGIAAMAvCOgBgJYy9IIDdUJwHAJyI4UwYoCoCdUEAlXGoDQVlujoaAAAAAAAAMGQavZPgo3qJfspKsmleoo/2dhxz5VjFwUfV5x32qLeab1fPNdgc8Qr4yTqb1YuNtqs3m+9R33U5qioPuapc6VSiaqXTflcardOfZ7pTqYsrlT6yyjrJNr2b7Kc+ST7aoY1XrCE+paqmnFCvNtka9Z3QZxtsVb90P6FqpSk2PbzSaJs7jRoPGEAPli3jffRdok22NvymlspRvayz0TM+TBC/9znLJpsEEf/lK9r0V5L8ND7H8Hx3vTbkQMxLUj5vf4CfBpMgUvlpiNc+3qXNPl3Y/P6Tb6pP2+1hQ0T0RrM9qnrKTZMQ5tYcQE9b8cKIEfRIgo+Gs9mFlaD1WXsJ8wuF0HwPD8IRh1ArjeZQPNQTpU2kp7TRi7RUMSqt2xHpjthck+7I+ebbtKYE83nALWSCvEwGZhYPzI7tdrT5C0synwfdV5tudVwAPDsyGJRZWx05KOf0+SWI5/lhzBATrxNMn4LGTpztqFJkcPeLPAVsrIm2Wk6h/0R6NWeqWZI6j7lqYIiMKiVcNQqhThJ9bDmBnEVWaao45KjjA+C9I5MAPJnUWb7fn0Lfa4NvhQvgiw57HR/AW833GgVQM4NmWNKE9nZUOPGuptMD4F1UwzXBOtmBdwq9l7OxFk7P1t/k+ACeqLPJdCA+KNv329SbzY1ED7qzHR/AA+5s0wBuSM/7t0cYgIERsjIMQImeZLGxCECI0DEiApCCz3AlA0AANi2QDQBPwB7JADAG+Om4YACYhmpTrwgGgIUYmyoQALYiBALAZpxkANiOlg8ABzLyAeBIUj4AHMrLB4CyFPkAUJglHwBKE+UDQHGu+VbEw96oHkmiPD3RpnU55gpUReAFjQSbupoEUGHwkWiaiFeU+I5ItGlZpAFwZfSHrXcZmoaX9MKH4KcuWkGtq5GEwK+fvqm7owc92TcNTIz711QBAAAAAAAAAABwGzu2xPmLj8HiAAAAAElFTkSuQmCC
// @downloadURL https://update.greasyfork.org/scripts/560366/Google%20Contacts%20-%20Adjustable%20Column%20Width%20with%20Tooltips.user.js
// @updateURL https://update.greasyfork.org/scripts/560366/Google%20Contacts%20-%20Adjustable%20Column%20Width%20with%20Tooltips.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isResizing = false;
    let currentColumn = null;
    let startX = 0;
    let startWidth = 0;
    const columnWidths = new Map();

    // Tooltip element
    let tooltip = null;
    let tooltipTimeout = null;

    function createTooltip() {
        if (tooltip) return;

        tooltip = document.createElement('div');
        tooltip.className = 'contacts-tooltip';
        tooltip.style.cssText = `
            position: fixed;
            background: rgba(0, 0, 0, 0.85);
            color: white;
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 13px;
            z-index: 10000;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.2s;
            max-width: 400px;
            word-wrap: break-word;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        `;
        document.body.appendChild(tooltip);
    }

    function showTooltip(text, x, y) {
        if (!text || !tooltip) return;

        tooltip.textContent = text;
        tooltip.style.opacity = '0';
        tooltip.style.display = 'block';

        // Position tooltip
        const tooltipRect = tooltip.getBoundingClientRect();
        let left = x + 10;
        let top = y + 10;

        // Adjust if tooltip goes off screen
        if (left + tooltipRect.width > window.innerWidth) {
            left = x - tooltipRect.width - 10;
        }
        if (top + tooltipRect.height > window.innerHeight) {
            top = y - tooltipRect.height - 10;
        }

        tooltip.style.left = left + 'px';
        tooltip.style.top = top + 'px';
        tooltip.style.opacity = '1';
    }

    function hideTooltip() {
        if (tooltip) {
            tooltip.style.opacity = '0';
            setTimeout(() => {
                if (tooltip) tooltip.style.display = 'none';
            }, 200);
        }
        if (tooltipTimeout) {
            clearTimeout(tooltipTimeout);
            tooltipTimeout = null;
        }
    }

    function addTooltipListeners() {
        // Add tooltip to all data cells in .JcPRM columns
        const dataColumns = document.querySelectorAll('.pkxbt > .JcPRM');

        dataColumns.forEach(column => {
            if (column.dataset.tooltipAdded) return;
            column.dataset.tooltipAdded = 'true';

            column.addEventListener('mouseenter', (e) => {
                // Get text content from the column
                const textContent = column.textContent.trim();
                const isOverflowing = column.scrollWidth > column.clientWidth ||
                                     column.scrollHeight > column.clientHeight;

                if (textContent && (isOverflowing || textContent.length > 30)) {
                    tooltipTimeout = setTimeout(() => {
                        showTooltip(textContent, e.clientX, e.clientY);
                    }, 500);
                }
            });

            column.addEventListener('mousemove', (e) => {
                if (tooltip && tooltip.style.opacity === '1') {
                    const left = e.clientX + 10;
                    const top = e.clientY + 10;
                    tooltip.style.left = left + 'px';
                    tooltip.style.top = top + 'px';
                }
            });

            column.addEventListener('mouseleave', () => {
                hideTooltip();
            });
        });

        // Add tooltip to specific data cells
        const dataCells = document.querySelectorAll('.AYDrSb, .phtrWd');
        dataCells.forEach(cell => {
            if (cell.dataset.tooltipCellAdded) return;
            cell.dataset.tooltipCellAdded = 'true';

            cell.addEventListener('mouseenter', (e) => {
                const textContent = cell.textContent.trim();
                const isOverflowing = cell.scrollWidth > cell.clientWidth ||
                                     cell.scrollHeight > cell.clientHeight;

                if (textContent && (isOverflowing || textContent.length > 30)) {
                    tooltipTimeout = setTimeout(() => {
                        showTooltip(textContent, e.clientX, e.clientY);
                    }, 500);
                }
            });

            cell.addEventListener('mousemove', (e) => {
                if (tooltip && tooltip.style.opacity === '1') {
                    const left = e.clientX + 10;
                    const top = e.clientY + 10;
                    tooltip.style.left = left + 'px';
                    tooltip.style.top = top + 'px';
                }
            });

            cell.addEventListener('mouseleave', () => {
                hideTooltip();
            });
        });

        // Add tooltip to contact names in the main button
        const nameElements = document.querySelectorAll('.d5NbRd-EScbFb-JIbuQc');
        nameElements.forEach(nameEl => {
            if (nameEl.dataset.tooltipNameAdded) return;
            nameEl.dataset.tooltipNameAdded = 'true';

            const nameText = nameEl.getAttribute('aria-label');
            if (nameText) {
                nameEl.addEventListener('mouseenter', (e) => {
                    tooltipTimeout = setTimeout(() => {
                        showTooltip(nameText, e.clientX, e.clientY);
                    }, 500);
                });

                nameEl.addEventListener('mousemove', (e) => {
                    if (tooltip && tooltip.style.opacity === '1') {
                        const left = e.clientX + 10;
                        const top = e.clientY + 10;
                        tooltip.style.left = left + 'px';
                        tooltip.style.top = top + 'px';
                    }
                });

                nameEl.addEventListener('mouseleave', () => {
                    hideTooltip();
                });
            }
        });
    }

    function addColumnSeparators() {
        // Add separators to header columns
        const headerColumns = document.querySelectorAll('.ca2xib');
        headerColumns.forEach((column, index) => {
            if (column.querySelector('.column-separator')) return;

            const separator = document.createElement('div');
            separator.className = 'column-separator';
            separator.style.cssText = `
                position: absolute;
                right: 0;
                top: 0;
                width: 1px;
                height: 100%;
                background: rgba(0, 0, 0, 0.12);
                pointer-events: none;
                z-index: 1;
            `;
            column.style.position = 'relative';
            column.appendChild(separator);
        });

        // Add separators to data rows
        const dataRows = document.querySelectorAll('.pkxbt');
        dataRows.forEach(row => {
            const dataCells = row.querySelectorAll('.JcPRM');
            dataCells.forEach((cell, index) => {
                if (cell.querySelector('.column-separator')) return;

                const separator = document.createElement('div');
                separator.className = 'column-separator';
                separator.style.cssText = `
                    position: absolute;
                    right: 0;
                    top: 0;
                    width: 1px;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.08);
                    pointer-events: none;
                    z-index: 1;
                `;
                cell.style.position = 'relative';
                cell.appendChild(separator);
            });
        });
    }

    function addResizeHandles() {
        const headerColumns = document.querySelectorAll('.ca2xib');

        headerColumns.forEach((column, index) => {
            if (column.querySelector('.resize-handle')) return;

            const handle = document.createElement('div');
            handle.className = 'resize-handle';
            handle.dataset.columnIndex = index;
            handle.style.cssText = `
                position: absolute;
                right: -2px;
                top: 0;
                width: 8px;
                height: 100%;
                cursor: col-resize;
                z-index: 1000;
                background: transparent;
            `;

            handle.addEventListener('mouseenter', () => {
                handle.style.background = 'rgba(66, 133, 244, 0.2)';
                handle.style.borderRight = '2px solid rgba(66, 133, 244, 0.6)';
            });

            handle.addEventListener('mouseleave', () => {
                if (!isResizing) {
                    handle.style.background = 'transparent';
                    handle.style.borderRight = 'none';
                }
            });

            handle.addEventListener('mousedown', (e) => {
                e.preventDefault();
                e.stopPropagation();
                isResizing = true;
                currentColumn = { element: column, index: index };
                startX = e.pageX;
                startWidth = column.offsetWidth;
                document.body.style.cursor = 'col-resize';
                document.body.style.userSelect = 'none';
                handle.style.background = 'rgba(66, 133, 244, 0.3)';
                handle.style.borderRight = '2px solid rgba(66, 133, 244, 0.8)';
            });

            column.style.position = 'relative';
            column.style.minWidth = '50px';
            column.appendChild(handle);
        });

        applyColumnWidths();
    }

    function applyColumnWidths() {
        columnWidths.forEach((width, index) => {
            // Apply to header
            const headerColumn = document.querySelectorAll('.ca2xib')[index];
            if (headerColumn) {
                headerColumn.style.width = width + 'px';
                headerColumn.style.minWidth = width + 'px';
                headerColumn.style.maxWidth = width + 'px';
                headerColumn.style.flexBasis = width + 'px';
                headerColumn.style.flexGrow = '0';
                headerColumn.style.flexShrink = '0';
            }

            // Apply to all data rows - target .pkxbt > .JcPRM
            const allDataColumns = document.querySelectorAll('.pkxbt > .JcPRM');
            allDataColumns.forEach(dataColumn => {
                const parent = dataColumn.parentElement;
                const siblings = Array.from(parent.children).filter(el => el.classList.contains('JcPRM'));
                const columnIndex = siblings.indexOf(dataColumn);

                if (columnIndex === index) {
                    dataColumn.style.width = width + 'px';
                    dataColumn.style.minWidth = width + 'px';
                    dataColumn.style.maxWidth = width + 'px';
                    dataColumn.style.flexBasis = width + 'px';
                    dataColumn.style.flexGrow = '0';
                    dataColumn.style.flexShrink = '0';
                    dataColumn.style.overflow = 'hidden';
                }
            });

            // Also apply to the checkbox columns
            const checkboxColumns = document.querySelectorAll('.Mqnmfe.JcPRM');
            checkboxColumns.forEach(col => {
                if (index === 0) {
                    col.style.width = width + 'px';
                    col.style.minWidth = width + 'px';
                    col.style.maxWidth = width + 'px';
                    col.style.flexBasis = width + 'px';
                    col.style.flexGrow = '0';
                    col.style.flexShrink = '0';
                }
            });
        });
    }

    function handleMouseMove(e) {
        if (!isResizing || !currentColumn) return;

        const diff = e.pageX - startX;
        const newWidth = Math.max(50, startWidth + diff);

        // Apply to header
        currentColumn.element.style.width = newWidth + 'px';
        currentColumn.element.style.minWidth = newWidth + 'px';
        currentColumn.element.style.maxWidth = newWidth + 'px';
        currentColumn.element.style.flexBasis = newWidth + 'px';
        currentColumn.element.style.flexGrow = '0';
        currentColumn.element.style.flexShrink = '0';

        columnWidths.set(currentColumn.index, newWidth);

        // Apply to all data columns - target .pkxbt > .JcPRM
        const allDataColumns = document.querySelectorAll('.pkxbt > .JcPRM');
        allDataColumns.forEach(dataColumn => {
            const parent = dataColumn.parentElement;
            const siblings = Array.from(parent.children).filter(el => el.classList.contains('JcPRM'));
            const columnIndex = siblings.indexOf(dataColumn);

            if (columnIndex === currentColumn.index) {
                dataColumn.style.width = newWidth + 'px';
                dataColumn.style.minWidth = newWidth + 'px';
                dataColumn.style.maxWidth = newWidth + 'px';
                dataColumn.style.flexBasis = newWidth + 'px';
                dataColumn.style.flexGrow = '0';
                dataColumn.style.flexShrink = '0';
                dataColumn.style.overflow = 'hidden';
            }
        });

        // Apply to checkbox columns if resizing first column
        if (currentColumn.index === 0) {
            const checkboxColumns = document.querySelectorAll('.Mqnmfe.JcPRM');
            checkboxColumns.forEach(col => {
                col.style.width = newWidth + 'px';
                col.style.minWidth = newWidth + 'px';
                col.style.maxWidth = newWidth + 'px';
                col.style.flexBasis = newWidth + 'px';
                col.style.flexGrow = '0';
                col.style.flexShrink = '0';
            });
        }
    }

    function handleMouseUp() {
        if (isResizing) {
            isResizing = false;
            currentColumn = null;
            document.body.style.cursor = '';
            document.body.style.userSelect = '';

            const handles = document.querySelectorAll('.resize-handle');
            handles.forEach(handle => {
                handle.style.background = 'transparent';
                handle.style.borderRight = 'none';
            });
        }
    }

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    const observer = new MutationObserver((mutations) => {
        let shouldUpdate = false;
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1 && (
                        node.classList?.contains('XXcuqd') ||
                        node.classList?.contains('pkxbt') ||
                        node.querySelector?.('.pkxbt')
                    )) {
                        shouldUpdate = true;
                    }
                });
            }
        });

        if (shouldUpdate) {
            // addResizeHandles();
            applyColumnWidths();
            addColumnSeparators();
            addTooltipListeners();
        }
    });

    const init = () => {
        const headerRow = document.querySelector('.dFPtBe');
        if (headerRow) {
            createTooltip();
            // addResizeHandles();
            addColumnSeparators();
            applyColumnWidths();
            addTooltipListeners();
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        } else {
            setTimeout(init, 500);
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

