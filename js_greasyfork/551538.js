// ==UserScript==
// @name         DeepWiki to Markdown
// @name:zh-CN   DeepWiki转Markdown
// @name:zh-TW   DeepWiki轉Markdown
// @name:ja      DeepWikiをMarkdownに変換
// @name:ko      DeepWiki를 Markdown으로
// @name:ru      DeepWiki в Markdown
// @name:es      DeepWiki a Markdown
// @name:fr      DeepWiki vers Markdown
// @name:de      DeepWiki zu Markdown
// @name:it      DeepWiki a Markdown
// @name:pt      DeepWiki para Markdown
// @name:ar      DeepWiki إلى Markdown
// @name:hi      DeepWiki से Markdown
// @name:tr      DeepWiki'den Markdown'a
// @name:vi      DeepWiki sang Markdown
// @name:th      DeepWiki เป็น Markdown
// @name:pl      DeepWiki do Markdown
// @name:nl      DeepWiki naar Markdown
// @name:sv      DeepWiki till Markdown
// @name:da      DeepWiki til Markdown
// @name:fi      DeepWiki Markdowniksi
// @name:no      DeepWiki til Markdown
// @name:el      DeepWiki σε Markdown
// @name:he      DeepWiki ל-Markdown
// @name:cs      DeepWiki do Markdownu
// @name:hu      DeepWiki Markdown formátumba
// @name:ro      DeepWiki în Markdown
// @name:id      DeepWiki ke Markdown
// @name:ms      DeepWiki ke Markdown
// @name:uk      DeepWiki у Markdown
// @name:bg      DeepWiki в Markdown
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Convert DeepWiki pages to Markdown format with diagram support
// @description:zh-CN  将DeepWiki页面转换为Markdown格式，支持图表转换
// @description:zh-TW  將DeepWiki頁面轉換為Markdown格式，支援圖表轉換
// @description:ja     DeepWikiページをMarkdown形式に変換し、図表変換をサポート
// @description:ko     DeepWiki 페이지를 Markdown 형식으로 변환하고 다이어그램 지원
// @description:ru     Конвертируйте страницы DeepWiki в формат Markdown с поддержкой диаграмм
// @description:es     Convierte páginas de DeepWiki a formato Markdown con soporte para diagramas
// @description:fr     Convertit les pages DeepWiki au format Markdown avec prise en charge des diagrammes
// @description:de     Konvertiert DeepWiki-Seiten in das Markdown-Format mit Diagrammunterstützung
// @description:it     Converti le pagine DeepWiki in formato Markdown con supporto per diagrammi
// @description:pt     Converte páginas DeepWiki para formato Markdown com suporte a diagramas
// @description:ar     تحويل صفحات DeepWiki إلى تنسيق Markdown مع دعم الرسوم البيانية
// @description:hi     DeepWiki पृष्ठों को Markdown प्रारूप में चित्र समर्थन के साथ रूपांतरित करें
// @description:tr     DeepWiki sayfalarını diyagram desteğiyle Markdown formatına dönüştürün
// @description:vi     Chuyển đổi trang DeepWiki sang định dạng Markdown với hỗ trợ sơ đồ
// @description:th     แปลงหน้า DeepWiki เป็นรูปแบบ Markdown พร้อมรองรับไดอะแกรม
// @description:pl     Konwertuj strony DeepWiki do formatu Markdown z obsługą diagramów
// @description:nl     Converteer DeepWiki-pagina's naar Markdown-indeling met diagramondersteuning
// @description:sv     Konvertera DeepWiki-sidor till Markdown-format med diagramstöd
// @description:da     Konverter DeepWiki-sider til Markdown-format med diagramunderstøttelse
// @description:fi     Muunna DeepWiki-sivut Markdown-muotoon kaavioiden tuella
// @description:no     Konverter DeepWiki-sider til Markdown-format med diagramstøtte
// @description:el     Μετατρέψτε τις σελίδες DeepWiki σε μορφή Markdown με υποστήριξη διαγραμμάτων
// @description:he     המר דפי DeepWiki לפורמט Markdown עם תמיכה בתרשימים
// @description:cs     Převést stránky DeepWiki do formátu Markdown s podporou diagramů
// @description:hu     Konvertálja a DeepWiki oldalakat Markdown formátumba diagramtámogatással
// @description:ro     Conversia paginilor DeepWiki în format Markdown cu suport pentru diagrame
// @description:id     Ubah halaman DeepWiki ke format Markdown dengan dukungan diagram
// @description:ms     Tukar halaman DeepWiki kepada format Markdown dengan sokongan rajah
// @description:uk     Перетворіть сторінки DeepWiki у формат Markdown із підтримкою діаграм
// @description:bg     Конвертирайте страниците на DeepWiki във формат Markdown с поддръжка на диаграми

// @author       zxmfke,aspen138
// @match        https://deepwiki.com/*
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @icon         https://deepwiki.com/icon.png?66aaf51e0e68c818
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551538/DeepWiki%20to%20Markdown.user.js
// @updateURL https://update.greasyfork.org/scripts/551538/DeepWiki%20to%20Markdown.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================== UTILITY FUNCTIONS ====================

    function downloadFile(content, filename, mimeType = 'text/markdown') {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 100);
    }

    // ==================== CONVERSION FUNCTIONS ====================

    // Function to auto-detect programming language from code content
    function detectCodeLanguage(codeText) {
        if (!codeText || codeText.trim().length < 10) return '';

        const code = codeText.trim();
        const firstLine = code.split('\n')[0].trim();
        const lines = code.split('\n');

        // JavaScript/TypeScript patterns
        if (code.includes('function ') || code.includes('const ') || code.includes('let ') ||
            code.includes('var ') || code.includes('=>') || code.includes('console.log') ||
            code.includes('require(') || code.includes('import ') || code.includes('export ')) {
            if (code.includes(': ') && (code.includes('interface ') || code.includes('type ') ||
                code.includes('enum ') || code.includes('implements '))) {
                return 'typescript';
            }
            return 'javascript';
        }

        // Python patterns
        if (code.includes('def ') || code.includes('import ') || code.includes('from ') ||
            code.includes('print(') || code.includes('if __name__') || code.includes('class ') ||
            firstLine.startsWith('#!') && firstLine.includes('python')) {
            return 'python';
        }

        // Java patterns
        if (code.includes('public class ') || code.includes('private ') || code.includes('public static void main') ||
            code.includes('System.out.println') || code.includes('import java.')) {
            return 'java';
        }

        // C# patterns
        if (code.includes('using System') || code.includes('namespace ') || code.includes('public class ') ||
            code.includes('Console.WriteLine') || code.includes('[Attribute]')) {
            return 'csharp';
        }

        // C/C++ patterns
        if (code.includes('#include') || code.includes('int main') || code.includes('printf(') ||
            code.includes('cout <<') || code.includes('std::')) {
            return code.includes('std::') || code.includes('cout') ? 'cpp' : 'c';
        }

        // Go patterns
        if (code.includes('package ') || code.includes('func ') || code.includes('import (') ||
            code.includes('fmt.Printf') || code.includes('go ')) {
            return 'go';
        }

        // Rust patterns
        if (code.includes('fn ') || code.includes('let mut') || code.includes('println!') ||
            code.includes('use std::') || code.includes('impl ')) {
            return 'rust';
        }

        // PHP patterns
        if (code.includes('<?php') || code.includes('$') && (code.includes('echo ') || code.includes('print '))) {
            return 'php';
        }

        // Ruby patterns
        if (code.includes('def ') && (code.includes('end') || code.includes('puts ') || code.includes('require '))) {
            return 'ruby';
        }

        // Shell/Bash patterns
        if (firstLine.startsWith('#!') && (firstLine.includes('bash') || firstLine.includes('sh')) ||
            code.includes('#!/bin/') || code.includes('echo ') && code.includes('$')) {
            return 'bash';
        }

        // SQL patterns
        if (code.match(/\b(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP)\b/i)) {
            return 'sql';
        }

        // CSS patterns
        if (code.includes('{') && code.includes('}') && code.includes(':') &&
            (code.includes('color:') || code.includes('margin:') || code.includes('padding:') || code.includes('#'))) {
            return 'css';
        }

        // HTML patterns
        if (code.includes('<') && code.includes('>') &&
            (code.includes('<!DOCTYPE') || code.includes('<html') || code.includes('<div') || code.includes('<p'))) {
            return 'html';
        }

        // XML patterns
        if (code.includes('<?xml') || (code.includes('<') && code.includes('>') && code.includes('</'))) {
            return 'xml';
        }

        // JSON patterns
        if (code.startsWith('{') && code.endsWith('}') || code.startsWith('[') && code.endsWith(']')) {
            try {
                JSON.parse(code);
                return 'json';
            } catch (e) {
                // Not valid JSON
            }
        }

        // YAML patterns
        if (lines.some(line => line.match(/^\s*\w+:\s*/) && !line.includes('{') && !line.includes(';'))) {
            return 'yaml';
        }

        // Markdown patterns
        if (code.includes('# ') || code.includes('## ') || code.includes('```') || code.includes('[') && code.includes('](')) {
            return 'markdown';
        }

        // Docker patterns
        if (firstLine.startsWith('FROM ') || code.includes('RUN ') || code.includes('COPY ') || code.includes('WORKDIR ')) {
            return 'dockerfile';
        }

        // Default fallback
        return '';
    }

    // Function for Flowchart
    function convertFlowchartSvgToMermaidText(svgElement) {
        if (!svgElement) return null;

        console.log("Starting flowchart conversion with hierarchical logic...");
        let mermaidCode = "flowchart TD\n\n";
        const nodes = {};
        const clusters = {};
        const parentMap = {}; // Maps a child SVG ID to its parent SVG ID
        const allElements = {}; // All nodes and clusters, for easy lookup

        // 1. Collect all nodes
        svgElement.querySelectorAll('g.node').forEach(nodeEl => {
            const svgId = nodeEl.id;
            if (!svgId) return;

            let textContent = "";
            const pElementForText = nodeEl.querySelector('.label foreignObject div > span > p, .label foreignObject div > p');
            if (pElementForText) {
                let rawParts = [];
                pElementForText.childNodes.forEach(child => {
                    if (child.nodeType === Node.TEXT_NODE) rawParts.push(child.textContent);
                    else if (child.nodeName.toUpperCase() === 'BR') rawParts.push('<br>');
                    else if (child.nodeType === Node.ELEMENT_NODE) rawParts.push(child.textContent || '');
                });
                textContent = rawParts.join('').trim().replace(/"/g, '#quot;');
            }
            if (!textContent.trim()) {
                const nodeLabel = nodeEl.querySelector('.nodeLabel, .label, foreignObject span, foreignObject div, text');
                if (nodeLabel && nodeLabel.textContent) {
                    textContent = nodeLabel.textContent.trim().replace(/"/g, '#quot;');
                }
            }

            let mermaidId = svgId.replace(/^flowchart-/, '').replace(/-\d+$/, '');

            const bbox = nodeEl.getBoundingClientRect();
            if (bbox.width > 0 || bbox.height > 0) {
                nodes[svgId] = {
                    type: 'node',
                    mermaidId: mermaidId,
                    text: textContent,
                    svgId: svgId,
                    bbox: bbox,
                };
                allElements[svgId] = nodes[svgId];
            }
        });

        // 2. Collect all clusters
        svgElement.querySelectorAll('g.cluster').forEach(clusterEl => {
            const svgId = clusterEl.id;
            if (!svgId) return;

            let title = "";
            const labelEl = clusterEl.querySelector('.cluster-label, .label');
            if (labelEl && labelEl.textContent) {
                title = labelEl.textContent.trim();
            }
            if (!title) {
                title = svgId;
            }

            const rect = clusterEl.querySelector('rect');
            const bbox = rect ? rect.getBoundingClientRect() : clusterEl.getBoundingClientRect();

            if (bbox.width > 0 || bbox.height > 0) {
                clusters[svgId] = {
                    type: 'cluster',
                    mermaidId: svgId, // Use stable SVG ID for mermaid ID
                    title: title,
                    svgId: svgId,
                    bbox: bbox,
                };
                allElements[svgId] = clusters[svgId];
            }
        });

        // 3. Build hierarchy (parentMap) by checking for geometric containment
        for (const childId in allElements) {
            const child = allElements[childId];
            let potentialParentId = null;
            let minArea = Infinity;

            for (const parentId in clusters) {
                if (childId === parentId) continue;
                const parent = clusters[parentId];

                if (child.bbox.left >= parent.bbox.left &&
                    child.bbox.right <= parent.bbox.right &&
                    child.bbox.top >= parent.bbox.top &&
                    child.bbox.bottom <= parent.bbox.bottom) {

                    const area = parent.bbox.width * parent.bbox.height;
                    if (area < minArea) {
                        minArea = area;
                        potentialParentId = parentId;
                    }
                }
            }
            if (potentialParentId) {
                parentMap[childId] = potentialParentId;
            }
        }

        // 4. Process edges and assign to their lowest common ancestor cluster
        const edges = [];
        const edgeLabels = {};
        svgElement.querySelectorAll('g.edgeLabel').forEach(labelEl => {
            const text = labelEl.textContent?.trim();
            const bbox = labelEl.getBoundingClientRect();
            if(text) {
                edgeLabels[labelEl.id] = {
                    text,
                    x: bbox.left + bbox.width / 2,
                    y: bbox.top + bbox.height / 2
                };
            }
        });

        svgElement.querySelectorAll('path.flowchart-link').forEach(path => {
            const pathId = path.id;
            if (!pathId) return;

            let sourceNode = null;
            let targetNode = null;
            let idParts = pathId.replace(/^(L_|FL_)/, '').split('_');
            if(idParts.length > 1 && idParts[idParts.length-1].match(/^\d+$/)){
                idParts.pop();
            }
            idParts = idParts.join('_');

            for (let i = 1; i < idParts.length; i++) {
                const potentialSourceName = idParts.substring(0,i);
                const potentialTargetName = idParts.substring(i);
                const foundSourceNode = Object.values(nodes).find(n => n.mermaidId === potentialSourceName);
                const foundTargetNode = Object.values(nodes).find(n => n.mermaidId === potentialTargetName);
                if(foundSourceNode && foundTargetNode){
                    sourceNode = foundSourceNode;
                    targetNode = foundTargetNode;
                    break;
                }
            }

            if (!sourceNode || !targetNode) { // Fallback for complex names
                const pathIdParts = pathId.replace(/^(L_|FL_)/, '').split('_');
                if(pathIdParts.length > 2){
                    for (let i = 1; i < pathIdParts.length; i++) {
                        const sName = pathIdParts.slice(0, i).join('_');
                        const tName = pathIdParts.slice(i, pathIdParts.length -1).join('_');
                        const foundSourceNode = Object.values(nodes).find(n => n.mermaidId === sName);
                        const foundTargetNode = Object.values(nodes).find(n => n.mermaidId === tName);
                        if(foundSourceNode && foundTargetNode){
                            sourceNode = foundSourceNode;
                            targetNode = foundTargetNode;
                            break;
                        }
                    }
                }
            }

            if (!sourceNode || !targetNode) {
                console.warn("Could not determine source/target for edge:", pathId);
                return;
            }

            let label = "";
            try {
                const totalLength = path.getTotalLength();
                if (totalLength > 0) {
                    const midPoint = path.getPointAtLength(totalLength / 2);
                    let closestLabel = null;
                    let closestDist = Infinity;
                    for (const labelId in edgeLabels) {
                        const currentLabel = edgeLabels[labelId];
                        const dist = Math.sqrt(Math.pow(currentLabel.x - midPoint.x, 2) + Math.pow(currentLabel.y - midPoint.y, 2));
                        if (dist < closestDist) {
                            closestDist = dist;
                            closestLabel = currentLabel;
                        }
                    }
                    if (closestLabel && closestDist < 75) {
                        label = closestLabel.text;
                    }
                }
            } catch (e) {
                console.error("Error matching label for edge " + pathId, e);
            }

            const labelPart = label ? `|"${label}"|` : "";
            const edgeText = `${sourceNode.mermaidId} -->${labelPart} ${targetNode.mermaidId}`;

            // Find Lowest Common Ancestor
            const sourceAncestors = [parentMap[sourceNode.svgId]];
            while (sourceAncestors[sourceAncestors.length - 1]) {
                sourceAncestors.push(parentMap[sourceAncestors[sourceAncestors.length - 1]]);
            }
            let lca = parentMap[targetNode.svgId];
            while (lca && !sourceAncestors.includes(lca)) {
                lca = parentMap[lca];
            }

            edges.push({ text: edgeText, parentId: lca || 'root' });
        });

        // 5. Generate Mermaid output
        const definedNodeMermaidIds = new Set();
        for (const svgId in nodes) {
            const node = nodes[svgId];
            if (!definedNodeMermaidIds.has(node.mermaidId)) {
                mermaidCode += `${node.mermaidId}["${node.text}"]\n`;
                definedNodeMermaidIds.add(node.mermaidId);
            }
        }
        mermaidCode += '\n';

        // Group children and edges by parent
        const childrenMap = {};
        const edgeMap = {};

        for (const childId in parentMap) {
            const parentId = parentMap[childId];
            if (!childrenMap[parentId]) childrenMap[parentId] = [];
            childrenMap[parentId].push(childId);
        }

        edges.forEach(edge => {
            const parentId = edge.parentId || 'root';
            if (!edgeMap[parentId]) edgeMap[parentId] = [];
            edgeMap[parentId].push(edge.text);
        });

        // Add top-level edges
        (edgeMap['root'] || []).forEach(edgeText => {
            mermaidCode += `${edgeText}\n`;
        });

        function buildSubgraphOutput(clusterId) {
            const cluster = clusters[clusterId];
            if (!cluster) return;

            mermaidCode += `\nsubgraph ${cluster.mermaidId} ["${cluster.title}"]\n`;

            const childItems = childrenMap[clusterId] || [];

            // Render nodes within this subgraph
            childItems.filter(id => nodes[id]).forEach(nodeId => {
                mermaidCode += `    ${nodes[nodeId].mermaidId}\n`;
            });

            // Render edges within this subgraph
            (edgeMap[clusterId] || []).forEach(edgeText => {
                mermaidCode += `    ${edgeText}\n`;
            });

            // Render nested subgraphs
            childItems.filter(id => clusters[id]).forEach(subClusterId => {
                buildSubgraphOutput(subClusterId);
            });

            mermaidCode += "end\n";
        }

        const topLevelClusters = Object.keys(clusters).filter(id => !parentMap[id]);
        topLevelClusters.forEach(buildSubgraphOutput);

        if (Object.keys(nodes).length === 0 && Object.keys(clusters).length === 0) return null;
        return '```mermaid\n' + mermaidCode.trim() + '\n```';
    }

    // Function for Class Diagram
    function convertClassDiagramSvgToMermaidText(svgElement) {
        if (!svgElement) return null;
        const mermaidLines = ['classDiagram'];
        const classData = {};

        // 1. Parse Classes and their geometric information
        svgElement.querySelectorAll('g.node.default[id^="classId-"]').forEach(node => {
            const classIdSvg = node.getAttribute('id');
            if (!classIdSvg) return;

            const classNameMatch = classIdSvg.match(/^classId-([^-]+(?:-[^-]+)*)-(\d+)$/);
            if (!classNameMatch) return;
            const className = classNameMatch[1];

            let cx = 0, cy = 0, halfWidth = 0, halfHeight = 0;
            const transform = node.getAttribute('transform');
            if (transform) {
                const match = transform.match(/translate\(([^,]+),\s*([^)]+)\)/);
                if (match) {
                    cx = parseFloat(match[1]);
                    cy = parseFloat(match[2]);
                }
            }
            const pathForBounds = node.querySelector('g.basic.label-container > path[d^="M-"]');
            if (pathForBounds) {
                const d = pathForBounds.getAttribute('d');
                const dMatch = d.match(/M-([0-9.]+)\s+-([0-9.]+)/); // Extracts W and H from M-W -H
                if (dMatch && dMatch.length >= 3) {
                    halfWidth = parseFloat(dMatch[1]);
                    halfHeight = parseFloat(dMatch[2]);
                }
            }

            if (!classData[className]) {
                classData[className] = {
                    stereotype: "",
                    members: [],
                    methods: [],
                    svgId: classIdSvg,
                    x: cx,
                    y: cy,
                    width: halfWidth * 2,
                    height: halfHeight * 2
                };
            }
            const stereotypeElem = node.querySelector('g.annotation-group.text foreignObject span.nodeLabel p, g.annotation-group.text foreignObject div p');
            if (stereotypeElem && stereotypeElem.textContent.trim()) {
                classData[className].stereotype = stereotypeElem.textContent.trim();
            }
            node.querySelectorAll('g.members-group.text g.label foreignObject span.nodeLabel p, g.members-group.text g.label foreignObject div p').forEach(m => {
                const txt = m.textContent.trim();
                if (txt) classData[className].members.push(txt);
            });
            node.querySelectorAll('g.methods-group.text g.label foreignObject span.nodeLabel p, g.methods-group.text g.label foreignObject div p').forEach(m => {
                const txt = m.textContent.trim();
                if (txt) classData[className].methods.push(txt);
            });
        });

        // 2. Parse Notes
        const notes = [];

        // Method 1: Find traditional rect.note and text.noteText
        svgElement.querySelectorAll('g').forEach(g => {
            const noteRect = g.querySelector('rect.note');
            const noteText = g.querySelector('text.noteText');

            if (noteRect && noteText) {
                const text = noteText.textContent.trim();
                const x = parseFloat(noteRect.getAttribute('x'));
                const y = parseFloat(noteRect.getAttribute('y'));
                const width = parseFloat(noteRect.getAttribute('width'));
                const height = parseFloat(noteRect.getAttribute('height'));

                if (text && !isNaN(x) && !isNaN(y)) {
                    notes.push({
                        text: text,
                        x: x,
                        y: y,
                        width: width || 0,
                        height: height || 0,
                        id: g.id || `note_${notes.length}`
                    });
                }
            }
        });

        // Method 2: Find other note formats (like node undefined type)
        svgElement.querySelectorAll('g.node.undefined, g[id^="note"]').forEach(g => {
            // Check if it's a note (by background color, id or other features)
            const hasNoteBackground = g.querySelector('path[fill="#fff5ad"], path[style*="#fff5ad"], path[style*="fill:#fff5ad"]');
            const isNoteId = g.id && g.id.includes('note');

            if (hasNoteBackground || isNoteId) {
                // Try to get text from foreignObject
                let text = '';
                const foreignObject = g.querySelector('foreignObject');
                if (foreignObject) {
                    const textEl = foreignObject.querySelector('p, span.nodeLabel, .nodeLabel');
                    if (textEl) {
                        text = textEl.textContent.trim();
                    }
                }

                // If no text found, try other selectors
                if (!text) {
                    const textEl = g.querySelector('text, .label text, tspan');
                    if (textEl) {
                        text = textEl.textContent.trim();
                    }
                }

                if (text) {
                    // Get position information
                    const transform = g.getAttribute('transform');
                    let x = 0, y = 0;
                    if (transform) {
                        const match = transform.match(/translate\(([^,]+),\s*([^)]+)\)/);
                        if (match) {
                            x = parseFloat(match[1]);
                            y = parseFloat(match[2]);
                        }
                    }

                    // Check if this note has already been added
                    const existingNote = notes.find(n => n.text === text && Math.abs(n.x - x) < 10 && Math.abs(n.y - y) < 10);
                    if (!existingNote) {
                        notes.push({
                            text: text,
                            x: x,
                            y: y,
                            width: 0,
                            height: 0,
                            id: g.id || `note_${notes.length}`
                        });
                    }
                }
            }
        });

        // 3. Parse Note-to-Class Connections
        const noteTargets = {}; // Maps note.id to target className
        const connectionThreshold = 50; // Increase connection threshold

        // Find note connection paths, support multiple path types
        const noteConnections = [
            ...svgElement.querySelectorAll('path.relation.edge-pattern-dotted'),
            ...svgElement.querySelectorAll('path[id^="edgeNote"]'),
            ...svgElement.querySelectorAll('path.edge-thickness-normal.edge-pattern-dotted')
        ];

        noteConnections.forEach(pathEl => {
            const dAttr = pathEl.getAttribute('d');
            if (!dAttr) return;

            // Improved path parsing, support Bezier curves
            const pathPoints = [];

            // Parse various path commands
            const commands = dAttr.match(/[A-Za-z][^A-Za-z]*/g) || [];
            let currentX = 0, currentY = 0;

            commands.forEach(cmd => {
                const parts = cmd.match(/[A-Za-z]|[-+]?\d*\.?\d+/g) || [];
                const type = parts[0];
                const coords = parts.slice(1).map(Number);

                switch(type.toUpperCase()) {
                    case 'M': // Move to
                        if (coords.length >= 2) {
                            currentX = coords[0];
                            currentY = coords[1];
                            pathPoints.push({x: currentX, y: currentY});
                        }
                        break;
                    case 'L': // Line to
                        for (let i = 0; i < coords.length; i += 2) {
                            if (coords[i+1] !== undefined) {
                                currentX = coords[i];
                                currentY = coords[i+1];
                                pathPoints.push({x: currentX, y: currentY});
                            }
                        }
                        break;
                    case 'C': // Cubic bezier
                        for (let i = 0; i < coords.length; i += 6) {
                            if (coords[i+5] !== undefined) {
                                // Get end point coordinates
                                currentX = coords[i+4];
                                currentY = coords[i+5];
                                pathPoints.push({x: currentX, y: currentY});
                            }
                        }
                        break;
                    case 'Q': // Quadratic bezier
                        for (let i = 0; i < coords.length; i += 4) {
                            if (coords[i+3] !== undefined) {
                                currentX = coords[i+2];
                                currentY = coords[i+3];
                                pathPoints.push({x: currentX, y: currentY});
                            }
                        }
                        break;
                }
            });

            if (pathPoints.length < 2) return;

            const pathStart = pathPoints[0];
            const pathEnd = pathPoints[pathPoints.length - 1];

            // Find the closest note to path start point
            let closestNote = null;
            let minDistToNote = Infinity;
            notes.forEach(note => {
                const dist = Math.sqrt(Math.pow(note.x - pathStart.x, 2) + Math.pow(note.y - pathStart.y, 2));
                if (dist < minDistToNote) {
                    minDistToNote = dist;
                    closestNote = note;
                }
            });

            // Find the closest class to path end point
            let targetClassName = null;
            let minDistToClass = Infinity;
            for (const currentClassName in classData) {
                const classInfo = classData[currentClassName];
                const classCenterX = classInfo.x;
                const classCenterY = classInfo.y;
                const classWidth = classInfo.width || 200; // Default width
                const classHeight = classInfo.height || 200; // Default height

                // Calculate distance from path end to class center
                const distToCenter = Math.sqrt(
                    Math.pow(pathEnd.x - classCenterX, 2) +
                    Math.pow(pathEnd.y - classCenterY, 2)
                );

                // Also calculate distance to class boundary
                const classLeft = classCenterX - classWidth/2;
                const classRight = classCenterX + classWidth/2;
                const classTop = classCenterY - classHeight/2;
                const classBottom = classCenterY + classHeight/2;

                const dx = Math.max(classLeft - pathEnd.x, 0, pathEnd.x - classRight);
                const dy = Math.max(classTop - pathEnd.y, 0, pathEnd.y - classBottom);
                const distToEdge = Math.sqrt(dx*dx + dy*dy);

                // Use the smaller distance as the judgment criterion
                const finalDist = Math.min(distToCenter, distToEdge + classWidth/4);

                if (finalDist < minDistToClass) {
                    minDistToClass = finalDist;
                    targetClassName = currentClassName;
                }
            }

            // Relax connection conditions
            if (closestNote && targetClassName &&
                minDistToNote < connectionThreshold &&
                minDistToClass < connectionThreshold * 2) {

                const existing = noteTargets[closestNote.id];
                const currentScore = minDistToNote + minDistToClass;

                if (!existing || currentScore < existing.score) {
                    noteTargets[closestNote.id] = {
                        name: targetClassName,
                        score: currentScore,
                        noteDistance: minDistToNote,
                        classDistance: minDistToClass
                    };
                }
            }
        });

        // 4. Add Note Definitions to Mermaid output
        const noteMermaidLines = [];
        notes.forEach(note => {
            const targetInfo = noteTargets[note.id];
            if (targetInfo && targetInfo.name) {
                noteMermaidLines.push(`    note for ${targetInfo.name} "${note.text}"`);
            } else {
                noteMermaidLines.push(`    note "${note.text}"`);
            }
        });
        // Insert notes after 'classDiagram' line
        if (noteMermaidLines.length > 0) {
            mermaidLines.splice(1, 0, ...noteMermaidLines);
        }

        // 5. Add Class Definitions
        for (const className in classData) {
            const data = classData[className];
            if (data.stereotype) {
                mermaidLines.push(`    class ${className} {`);
                mermaidLines.push(`        ${data.stereotype}`);
            } else {
                mermaidLines.push(`    class ${className} {`);
            }
            data.members.forEach(member => { mermaidLines.push(`        ${member}`); });
            data.methods.forEach(method => { mermaidLines.push(`        ${method}`); });
            mermaidLines.push('    }');
        }

        const pathElements = Array.from(svgElement.querySelectorAll('path.relation[id^="id_"]'));
        const labelElements = Array.from(svgElement.querySelectorAll('g.edgeLabels .edgeLabel foreignObject p'));

        pathElements.forEach((path, index) => {
            const id = path.getAttribute('id');
            if (!id || !id.startsWith('id_')) return;

            // Remove 'id_' prefix and trailing number (e.g., '_1')
            let namePart = id.substring(3).replace(/_\d+$/, '');

            const idParts = namePart.split('_');
            let fromClass = null;
            let toClass = null;

            // Iterate through possible split points to find valid class names
            for (let i = 1; i < idParts.length; i++) {
                const potentialFrom = idParts.slice(0, i).join('_');
                const potentialTo = idParts.slice(i).join('_');

                if (classData[potentialFrom] && classData[potentialTo]) {
                    fromClass = potentialFrom;
                    toClass = potentialTo;
                    break; // Found a valid pair
                }
            }

            if (!fromClass || !toClass) {
                console.error("Could not parse class relation from ID:", id);
                return; // Skip if we couldn't parse
            }

            // Get key attributes
            const markerEndAttr = path.getAttribute('marker-end') || "";
            const markerStartAttr = path.getAttribute('marker-start') || "";
            const pathClass = path.getAttribute('class') || "";

            // Determine line style: solid or dashed
            const isDashed = path.classList.contains('dashed-line') ||
                             path.classList.contains('dotted-line') ||
                             pathClass.includes('dashed') ||
                             pathClass.includes('dotted');
            const lineStyle = isDashed ? ".." : "--";

            let relationshipType = "";

            // Inheritance relation: <|-- or --|> (corrected inheritance relationship judgment)
            if (markerStartAttr.includes('extensionStart')) {
                // marker-start has extension, arrow at start point, means: toClass inherits fromClass
                if (isDashed) {
                    // Dashed inheritance (implementation relationship): fromClass <|.. toClass
                    relationshipType = `${fromClass} <|.. ${toClass}`;
                } else {
                    // Solid inheritance: fromClass <|-- toClass
                    relationshipType = `${fromClass} <|${lineStyle} ${toClass}`;
                }
            }
            else if (markerEndAttr.includes('extensionEnd')) {
                // marker-end has extension, arrow at end point, means: fromClass inherits toClass
                if (isDashed) {
                    // Dashed inheritance (implementation relationship): toClass <|.. fromClass
                    relationshipType = `${toClass} <|.. ${fromClass}`;
                } else {
                    // Solid inheritance: toClass <|-- fromClass
                    relationshipType = `${toClass} <|${lineStyle} ${fromClass}`;
                }
            }
            // Implementation relation: ..|> (corrected implementation relationship judgment)
            else if (markerStartAttr.includes('lollipopStart') || markerStartAttr.includes('implementStart')) {
                relationshipType = `${toClass} ..|> ${fromClass}`;
            }
            else if (markerEndAttr.includes('implementEnd') || markerEndAttr.includes('lollipopEnd') ||
                     (markerEndAttr.includes('interfaceEnd') && isDashed)) {
                relationshipType = `${fromClass} ..|> ${toClass}`;
            }
            // Composition relation: *-- (corrected composition relationship judgment)
            else if (markerStartAttr.includes('compositionStart')) {
                // marker-start has composition, diamond at start point, means: fromClass *-- toClass
                relationshipType = `${fromClass} *${lineStyle} ${toClass}`;
            }
            else if (markerEndAttr.includes('compositionEnd') ||
                     markerEndAttr.includes('diamondEnd') && markerEndAttr.includes('filled')) {
                relationshipType = `${toClass} *${lineStyle} ${fromClass}`;
            }
            // Aggregation relation: o-- (corrected aggregation relationship judgment)
            else if (markerStartAttr.includes('aggregationStart')) {
                // marker-start has aggregation, empty diamond at start point, means: toClass --o fromClass
                relationshipType = `${toClass} ${lineStyle}o ${fromClass}`;
            }
            else if (markerEndAttr.includes('aggregationEnd') ||
                     markerEndAttr.includes('diamondEnd') && !markerEndAttr.includes('filled')) {
                relationshipType = `${fromClass} o${lineStyle} ${toClass}`;
            }
            // Dependency relation: ..> or --> (corrected dependency relationship judgment)
            else if (markerStartAttr.includes('dependencyStart')) {
                if (isDashed) {
                    relationshipType = `${toClass} <.. ${fromClass}`;
                } else {
                    relationshipType = `${toClass} <-- ${fromClass}`;
                }
            }
            else if (markerEndAttr.includes('dependencyEnd')) {
                if (isDashed) {
                    relationshipType = `${fromClass} ..> ${toClass}`;
                } else {
                    relationshipType = `${fromClass} --> ${toClass}`;
                }
            }
            // Association relation: --> (corrected association relationship judgment)
            else if (markerStartAttr.includes('arrowStart') || markerStartAttr.includes('openStart')) {
                relationshipType = `${toClass} <${lineStyle} ${fromClass}`;
            }
            else if (markerEndAttr.includes('arrowEnd') || markerEndAttr.includes('openEnd')) {
                relationshipType = `${fromClass} ${lineStyle}> ${toClass}`;
            }
            // Arrowless solid line link: --
            else if (lineStyle === "--" && !markerEndAttr.includes('End') && !markerStartAttr.includes('Start')) {
                relationshipType = `${fromClass} -- ${toClass}`;
            }
            // Arrowless dashed line link: ..
            else if (lineStyle === ".." && !markerEndAttr.includes('End') && !markerStartAttr.includes('Start')) {
                relationshipType = `${fromClass} .. ${toClass}`;
            }
            // Default relation
            else {
                relationshipType = `${fromClass} ${lineStyle} ${toClass}`;
            }

            // Get relationship label text
            const labelText = (labelElements[index] && labelElements[index].textContent) ?
                               labelElements[index].textContent.trim() : "";

            if (relationshipType) {
                mermaidLines.push(`    ${relationshipType}${labelText ? ' : ' + labelText : ''}`);
            }
        });

        if (mermaidLines.length <= 1 && Object.keys(classData).length === 0 && notes.length === 0) return null;
        return '```mermaid\n' + mermaidLines.join('\n') + '\n```';
    }

    // Function for Sequence Diagram
    function convertSequenceDiagramSvgToMermaidText(svgElement) {
        if (!svgElement) return null;

        // 1. Parse participants
        const participants = [];
        console.log("Looking for sequence participants..."); // DEBUG

        // Find all participant text elements
        svgElement.querySelectorAll('text.actor-box').forEach((textEl) => {
            const name = textEl.textContent.trim().replace(/^"|"$/g, ''); // Remove quotes
            const x = parseFloat(textEl.getAttribute('x'));
            console.log("Found participant:", name, "at x:", x); // DEBUG
            if (name && !isNaN(x)) {
                participants.push({ name, x });
            }
        });

        console.log("Total participants found:", participants.length); // DEBUG
        participants.sort((a, b) => a.x - b.x);

        // Remove duplicate participants
        const uniqueParticipants = [];
        const seenNames = new Set();
        participants.forEach(p => {
            if (!seenNames.has(p.name)) {
                uniqueParticipants.push(p);
                seenNames.add(p.name);
            }
        });

        // 2. Parse Notes
        const notes = [];
        svgElement.querySelectorAll('g').forEach(g => {
            const noteRect = g.querySelector('rect.note');
            const noteText = g.querySelector('text.noteText');

            if (noteRect && noteText) {
                const text = noteText.textContent.trim();
                const x = parseFloat(noteRect.getAttribute('x'));
                const width = parseFloat(noteRect.getAttribute('width'));
                const leftX = x;
                const rightX = x + width;

                // Find all participants within note coverage range
                const coveredParticipants = [];
                uniqueParticipants.forEach(p => {
                    // Check if participant is within note's horizontal range
                    if (p.x >= leftX && p.x <= rightX) {
                        coveredParticipants.push(p);
                    }
                });

                // Sort by x coordinate
                coveredParticipants.sort((a, b) => a.x - b.x);

                if (coveredParticipants.length > 0) {
                    let noteTarget;
                    if (coveredParticipants.length === 1) {
                        // Single participant
                        noteTarget = coveredParticipants[0].name;
                    } else {
                        // Multiple participants, use first and last
                        const firstParticipant = coveredParticipants[0].name;
                        const lastParticipant = coveredParticipants[coveredParticipants.length - 1].name;
                        noteTarget = `${firstParticipant},${lastParticipant}`;
                    }

                    notes.push({
                        text: text,
                        target: noteTarget,
                        y: parseFloat(noteRect.getAttribute('y'))
                    });
                }
            }
        });

        // 3. Parse message lines and message text
        const messages = [];

        // Collect all message texts
        const messageTexts = [];
        svgElement.querySelectorAll('text.messageText').forEach(textEl => {
            const text = textEl.textContent.trim();
            const y = parseFloat(textEl.getAttribute('y'));
            const x = parseFloat(textEl.getAttribute('x'));
            if (text && !isNaN(y)) {
                messageTexts.push({ text, y, x });
            }
        });
        messageTexts.sort((a, b) => a.y - b.y);
        console.log("Found message texts:", messageTexts.length); // DEBUG

        // Collect all message lines
        const messageLines = [];
        svgElement.querySelectorAll('line.messageLine0, line.messageLine1').forEach(lineEl => {
            const x1 = parseFloat(lineEl.getAttribute('x1'));
            const y1 = parseFloat(lineEl.getAttribute('y1'));
            const x2 = parseFloat(lineEl.getAttribute('x2'));
            const y2 = parseFloat(lineEl.getAttribute('y2'));
            const isDashed = lineEl.classList.contains('messageLine1');

            if (!isNaN(x1) && !isNaN(y1) && !isNaN(x2) && !isNaN(y2)) {
                messageLines.push({ x1, y1, x2, y2, isDashed });
            }
        });

        // Collect all curved message paths (self messages)
        svgElement.querySelectorAll('path.messageLine0, path.messageLine1').forEach(pathEl => {
            const d = pathEl.getAttribute('d');
            const isDashed = pathEl.classList.contains('messageLine1');

            if (d) {
                // Parse path, check if it's a self message
                const moveMatch = d.match(/M\s*([^,\s]+)[,\s]+([^,\s]+)/);
                const endMatch = d.match(/([^,\s]+)[,\s]+([^,\s]+)$/);

                if (moveMatch && endMatch) {
                    const x1 = parseFloat(moveMatch[1]);
                    const y1 = parseFloat(moveMatch[2]);
                    const x2 = parseFloat(endMatch[1]);
                    const y2 = parseFloat(endMatch[2]);

                    // Check if it's a self message (start and end x coordinates are close)
                    if (Math.abs(x1 - x2) < 20) { // Allow some margin of error
                        messageLines.push({
                            x1, y1, x2, y2, isDashed,
                            isSelfMessage: true
                        });
                    }
                }
            }
        });

        messageLines.sort((a, b) => a.y1 - b.y1);
        console.log("Found message lines:", messageLines.length); // DEBUG

        // 4. Match message lines and message text
        for (let i = 0; i < Math.min(messageLines.length, messageTexts.length); i++) {
            const line = messageLines[i];
            const messageText = messageTexts[i];

            let fromParticipant = null;
            let toParticipant = null;

            if (line.isSelfMessage) {
                // Self message - find participant closest to x1
                let minDist = Infinity;
                for (const p of uniqueParticipants) {
                    const dist = Math.abs(p.x - line.x1);
                    if (dist < minDist) {
                        minDist = dist;
                        fromParticipant = toParticipant = p.name;
                    }
                }
            } else {
                // Find sender and receiver based on x coordinates
                let minDist1 = Infinity;
                for (const p of uniqueParticipants) {
                    const dist = Math.abs(p.x - line.x1);
                    if (dist < minDist1) {
                        minDist1 = dist;
                        fromParticipant = p.name;
                    }
                }

                let minDist2 = Infinity;
                for (const p of uniqueParticipants) {
                    const dist = Math.abs(p.x - line.x2);
                    if (dist < minDist2) {
                        minDist2 = dist;
                        toParticipant = p.name;
                    }
                }
            }

            if (fromParticipant && toParticipant) {
                // Determine arrow type
                let arrow;
                if (line.isDashed) {
                    arrow = '-->>'; // Dashed arrow
                } else {
                    arrow = '->>'; // Solid arrow
                }

                messages.push({
                    from: fromParticipant,
                    to: toParticipant,
                    text: messageText.text,
                    arrow: arrow,
                    y: line.y1,
                    isSelfMessage: line.isSelfMessage || false
                });

                console.log(`Message ${i + 1}: ${fromParticipant} ${arrow} ${toParticipant}: ${messageText.text}`); // DEBUG
            }
        }

        // 5. Parse loop areas
        const loops = [];
        const loopLines = svgElement.querySelectorAll('line.loopLine');
        if (loopLines.length >= 4) {
            const xs = Array.from(loopLines).map(line => [
                parseFloat(line.getAttribute('x1')),
                parseFloat(line.getAttribute('x2'))
            ]).flat();
            const ys = Array.from(loopLines).map(line => [
                parseFloat(line.getAttribute('y1')),
                parseFloat(line.getAttribute('y2'))
            ]).flat();

            const xMin = Math.min(...xs);
            const xMax = Math.max(...xs);
            const yMin = Math.min(...ys);
            const yMax = Math.max(...ys);

            let loopText = '';
            const loopTextEl = svgElement.querySelector('.loopText');
            if (loopTextEl) {
                loopText = loopTextEl.textContent.trim();
            }

            loops.push({ xMin, xMax, yMin, yMax, text: loopText });
            console.log("Found loop:", loopText, "from y", yMin, "to", yMax); // DEBUG
        }

        // 6. Generate Mermaid code
        let mermaidOutput = "sequenceDiagram\n";

        // Add participants
        uniqueParticipants.forEach(p => {
            mermaidOutput += `  participant ${p.name}\n`;
        });
        mermaidOutput += "\n";

        // Sort all events by y coordinate (messages, notes, loops)
        const events = [];

        messages.forEach(msg => {
            events.push({ type: 'message', y: msg.y, data: msg });
        });

        notes.forEach(note => {
            events.push({ type: 'note', y: note.y, data: note });
        });

        loops.forEach(loop => {
            events.push({ type: 'loop_start', y: loop.yMin - 1, data: loop });
            events.push({ type: 'loop_end', y: loop.yMax + 1, data: loop });
        });

        events.sort((a, b) => a.y - b.y);

        // Generate events
        let loopStack = [];
        events.forEach(event => {
            if (event.type === 'loop_start') {
                const text = event.data.text ? ` ${event.data.text}` : '';
                mermaidOutput += `  loop${text}\n`;
                loopStack.push(event.data);
            } else if (event.type === 'loop_end') {
                if (loopStack.length > 0) {
                    mermaidOutput += `  end\n`;
                    loopStack.pop();
                }
            } else if (event.type === 'note') {
                const indent = loopStack.length > 0 ? '  ' : '';
                mermaidOutput += `${indent}  note over ${event.data.target}: ${event.data.text}\n`;
            } else if (event.type === 'message') {
                const indent = loopStack.length > 0 ? '  ' : '';
                const msg = event.data;
                mermaidOutput += `${indent}  ${msg.from}${msg.arrow}${msg.to}: ${msg.text}\n`;
            }
        });

        // Close remaining loops
        while (loopStack.length > 0) {
            mermaidOutput += `  end\n`;
            loopStack.pop();
        }

        if (uniqueParticipants.length === 0 && messages.length === 0) return null;
        console.log("Sequence diagram conversion completed. Participants:", uniqueParticipants.length, "Messages:", messages.length, "Notes:", notes.length); // DEBUG
        console.log("Generated sequence mermaid code:", mermaidOutput.substring(0, 200) + "..."); // DEBUG
        return '```mermaid\n' + mermaidOutput.trim() + '\n```';
    }

    // Function for State Diagram
    function convertStateDiagramSvgToMermaidText(svgElement) {
        if (!svgElement) return null;

        console.log("Converting state diagram...");

        const nodes = [];

        // 1. Parse all states
        svgElement.querySelectorAll('g.node.statediagram-state').forEach(stateEl => {
            const stateName = stateEl.querySelector('foreignObject .nodeLabel p, foreignObject .nodeLabel span')?.textContent.trim();
            if (!stateName) return;

            const transform = stateEl.getAttribute('transform');
            const rect = stateEl.querySelector('rect.basic.label-container');
            if (!transform || !rect) return;

            const transformMatch = transform.match(/translate\(([^,]+),\s*([^)]+)\)/);
            if (!transformMatch) return;

            const tx = parseFloat(transformMatch[1]);
            const ty = parseFloat(transformMatch[2]);
            const rx = parseFloat(rect.getAttribute('x'));
            const ry = parseFloat(rect.getAttribute('y'));
            const width = parseFloat(rect.getAttribute('width'));
            const height = parseFloat(rect.getAttribute('height'));

            nodes.push({
                name: stateName,
                x1: tx + rx,
                y1: ty + ry,
                x2: tx + rx + width,
                y2: ty + ry + height
            });
            console.log(`Found State: ${stateName}`, nodes[nodes.length-1]);
        });

        // 2. Find start state
        const startStateEl = svgElement.querySelector('g.node.default circle.state-start');
        if (startStateEl) {
            const startGroup = startStateEl.closest('g.node');
            const transform = startGroup.getAttribute('transform');
            const transformMatch = transform.match(/translate\(([^,]+),\s*([^)]+)\)/);
            const r = parseFloat(startStateEl.getAttribute('r'));
            if (transformMatch && r) {
                const tx = parseFloat(transformMatch[1]);
                const ty = parseFloat(transformMatch[2]);
                nodes.push({
                    name: '[*]',
                    x1: tx - r,
                    y1: ty - r,
                    x2: tx + r,
                    y2: ty + r,
                    isSpecial: true
                });
                console.log("Found Start State", nodes[nodes.length-1]);
            }
        }

        // 3. Find end state
        svgElement.querySelectorAll('g.node.default').forEach(endGroup => {
            if (endGroup.querySelectorAll('path').length >= 2) {
                const transform = endGroup.getAttribute('transform');
                if(transform) {
                    const transformMatch = transform.match(/translate\(([^,]+),\s*([^)]+)\)/);
                    if (transformMatch) {
                        const tx = parseFloat(transformMatch[1]);
                        const ty = parseFloat(transformMatch[2]);
                        const r = 7; // Mermaid end circle radius is 7
                        nodes.push({
                            name: '[*]',
                            x1: tx - r,
                            y1: ty - r,
                            x2: tx + r,
                            y2: ty + r,
                            isSpecial: true
                        });
                        console.log("Found End State", nodes[nodes.length-1]);
                    }
                }
            }
        });

        // 4. Get all labels
        const labels = [];
        svgElement.querySelectorAll('g.edgeLabel').forEach(labelEl => {
            const text = labelEl.querySelector('foreignObject .edgeLabel p, foreignObject .edgeLabel span')?.textContent.trim().replace(/^"|"$/g, '');
            const transform = labelEl.getAttribute('transform');
            if (text && transform) {
                const match = transform.match(/translate\(([^,]+),\s*([^)]+)\)/);
                if (match) {
                    labels.push({
                        text: text,
                        x: parseFloat(match[1]),
                        y: parseFloat(match[2])
                    });
                }
            }
        });

        function getDistanceToBox(px, py, box) {
            const dx = Math.max(box.x1 - px, 0, px - box.x2);
            const dy = Math.max(box.y1 - py, 0, py - box.y2);
            return Math.sqrt(dx * dx + dy * dy);
        }

        function getDistance(x1, y1, x2, y2) {
            return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
        }

        const transitions = [];

        // 5. Process paths
        svgElement.querySelectorAll('path.transition').forEach(pathEl => {
            const dAttr = pathEl.getAttribute('d');
            if (!dAttr) return;

            const startMatch = dAttr.match(/M\s*([^,\s]+)[,\s]+([^,\s]+)/);
            // More robustly find the last coordinate pair in the d string
            const pathSegments = dAttr.split(/[A-Za-z]/);
            const lastSegment = pathSegments[pathSegments.length-1].trim();
            const endCoords = lastSegment.split(/[\s,]+/).map(parseFloat);

            if (!startMatch || endCoords.length < 2) return;

            const startX = parseFloat(startMatch[1]);
            const startY = parseFloat(startMatch[2]);
            const endX = endCoords[endCoords.length - 2];
            const endY = endCoords[endCoords.length - 1];

            let sourceNode = null, targetNode = null;
            let minSourceDist = Infinity, minTargetDist = Infinity;

            nodes.forEach(node => {
                const distToStart = getDistanceToBox(startX, startY, node);
                if (distToStart < minSourceDist) {
                    minSourceDist = distToStart;
                    sourceNode = node;
                }
                const distToEnd = getDistanceToBox(endX, endY, node);
                if (distToEnd < minTargetDist) {
                    minTargetDist = distToEnd;
                    targetNode = node;
                }
            });

            let transitionLabel = '';
            if (sourceNode && targetNode && (minSourceDist < 5) && (minTargetDist < 5)) {
                // Find label
                const midX = (startX + endX) / 2;
                const midY = (startY + endY) / 2;
                let closestLabel = null;
                let minLabelDist = Infinity;

                labels.forEach(label => {
                    const dist = getDistance(midX, midY, label.x, label.y);
                    if (dist < minLabelDist) {
                        minLabelDist = dist;
                        closestLabel = label;
                    }
                });

                if (closestLabel && minLabelDist < 150) { // Arbitrary threshold, seems to work
                    transitionLabel = closestLabel.text;
                }

                if(sourceNode === targetNode) return; // Ignore self-loops for now

                const newTransition = {
                    from: sourceNode.name,
                    to: targetNode.name,
                    label: transitionLabel
                };

                // Avoid adding duplicates
                if (!transitions.some(t => t.from === newTransition.from && t.to === newTransition.to && t.label === newTransition.label)) {
                    transitions.push(newTransition);
                }
            }
        });

        // 6. Generate Mermaid code
        let mermaidCode = "stateDiagram-v2\n";
        transitions.forEach(t => {
            let line = `    ${t.from} --> ${t.to}`;
            if (t.label) {
                line += ` : "${t.label}"`;
            }
            mermaidCode += line + '\n';
        });

        if (transitions.length === 0) return null;

        console.log("State diagram conversion completed. Transitions:", transitions.length);
        console.log("Generated state diagram mermaid code:", mermaidCode);

        return '```mermaid\n' + mermaidCode.trim() + '\n```';
    }

    // Main processNode function
    function processNode(node) {
        let resultMd = "";

        if (node.nodeType === Node.TEXT_NODE) {
            if (node.parentNode && node.parentNode.nodeName === 'PRE') { return node.textContent; }
            return node.textContent;
        }

        if (node.nodeType !== Node.ELEMENT_NODE) return "";

        const element = node;
        const style = window.getComputedStyle(element);

        if (
            (style.display === "none" || style.visibility === "hidden") &&
            !["DETAILS", "SUMMARY"].includes(element.nodeName)
        ) {
            return "";
        }

        if (element.matches('button, [role="button"], nav, footer, aside, script, style, noscript, iframe, embed, object, header')) {
            return "";
        }
        if (element.classList.contains("bg-input-dark") && element.querySelector("svg")){
            return "";
        }

        try {
            switch (element.nodeName) {
                case "P": {
                    let txt = "";
                    element.childNodes.forEach((c) => {
                        try { txt += processNode(c); } catch (e) { console.error("Error processing child of P:", c, e); txt += "[err]";}
                    });
                    txt = txt.trim();
                    if (txt.startsWith("```mermaid") && txt.endsWith("```")) {
                        resultMd = txt + "\n\n";
                    } else if (txt) {
                        resultMd = txt + "\n\n";
                    } else {
                        resultMd = "\n";
                    }
                    break;
                }
                case "H1": resultMd = (element.textContent.trim() ? `# ${element.textContent.trim()}\n\n` : ""); break;
                case "H2": resultMd = (element.textContent.trim() ? `## ${element.textContent.trim()}\n\n` : ""); break;
                case "H3": resultMd = (element.textContent.trim() ? `### ${element.textContent.trim()}\n\n` : ""); break;
                case "H4": resultMd = (element.textContent.trim() ? `#### ${element.textContent.trim()}\n\n` : ""); break;
                case "H5": resultMd = (element.textContent.trim() ? `##### ${element.textContent.trim()}\n\n` : ""); break;
                case "H6": resultMd = (element.textContent.trim() ? `###### ${element.textContent.trim()}\n\n` : ""); break;
                case "UL": {
                    let list = "";
                    const isSourceList = (
                        (element.previousElementSibling && /source/i.test(element.previousElementSibling.textContent)) ||
                        (element.parentElement && /source/i.test(element.parentElement.textContent)) ||
                        element.classList.contains('source-list')
                    );
                    element.querySelectorAll(":scope > li").forEach((li) => {
                        let liTxt = "";
                        li.childNodes.forEach((c) => { try { liTxt += processNode(c); } catch (e) { console.error("Error processing child of LI:", c, e); liTxt += "[err]";}});
                        if (isSourceList) {
                            liTxt = liTxt.trim().replace(/\n+/g, ' ');
                        } else {
                            liTxt = liTxt.trim().replace(/\n\n$/, "").replace(/^\n\n/, "");
                        }
                        if (liTxt) list += `* ${liTxt}\n`;
                    });
                    resultMd = list + (list ? "\n" : "");
                    break;
                }
                case "OL": {
                    let list = "";
                    let i = 1;
                    const isSourceList = (
                        (element.previousElementSibling && /source/i.test(element.previousElementSibling.textContent)) ||
                        (element.parentElement && /source/i.test(element.parentElement.textContent)) ||
                        element.classList.contains('source-list')
                    );
                    element.querySelectorAll(":scope > li").forEach((li) => {
                        let liTxt = "";
                        li.childNodes.forEach((c) => { try { liTxt += processNode(c); } catch (e) { console.error("Error processing child of LI:", c, e); liTxt += "[err]";}});
                        if (isSourceList) {
                            liTxt = liTxt.trim().replace(/\n+/g, ' ');
                        } else {
                            liTxt = liTxt.trim().replace(/\n\n$/, "").replace(/^\n\n/, "");
                        }
                        if (liTxt) {
                            list += `${i}. ${liTxt}\n`;
                            i++;
                        }
                    });
                    resultMd = list + (list ? "\n" : "");
                    break;
                }
                case "PRE": {
                    const svgElement = element.querySelector('svg[id^="mermaid-"]');
                    let mermaidOutput = null;

                    if (svgElement) {
                        const diagramTypeDesc = svgElement.getAttribute('aria-roledescription');
                        const diagramClass = svgElement.getAttribute('class');

                        console.log("Found SVG in PRE: desc=", diagramTypeDesc, "class=", diagramClass);
                        if (diagramTypeDesc && diagramTypeDesc.includes('flowchart')) {
                            console.log("Trying to convert flowchart...");
                            mermaidOutput = convertFlowchartSvgToMermaidText(svgElement);
                        } else if (diagramTypeDesc && diagramTypeDesc.includes('class')) {
                            console.log("Trying to convert class diagram...");
                            mermaidOutput = convertClassDiagramSvgToMermaidText(svgElement);
                        } else if (diagramTypeDesc && diagramTypeDesc.includes('sequence')) {
                            console.log("Trying to convert sequence diagram...");
                            mermaidOutput = convertSequenceDiagramSvgToMermaidText(svgElement);
                        } else if (diagramTypeDesc && diagramTypeDesc.includes('stateDiagram')) {
                            console.log("Trying to convert state diagram...");
                            mermaidOutput = convertStateDiagramSvgToMermaidText(svgElement);
                        } else if (diagramClass && diagramClass.includes('flowchart')) {
                            console.log("Trying to convert flowchart by class...");
                            mermaidOutput = convertFlowchartSvgToMermaidText(svgElement);
                        } else if (diagramClass && (diagramClass.includes('classDiagram') || diagramClass.includes('class'))) {
                            console.log("Trying to convert class diagram by class...");
                            mermaidOutput = convertClassDiagramSvgToMermaidText(svgElement);
                        } else if (diagramClass && (diagramClass.includes('sequenceDiagram') || diagramClass.includes('sequence'))) {
                            console.log("Trying to convert sequence diagram by class...");
                            mermaidOutput = convertSequenceDiagramSvgToMermaidText(svgElement);
                        } else if (diagramClass && (diagramClass.includes('statediagram') || diagramClass.includes('stateDiagram'))) {
                            console.log("Trying to convert state diagram by class...");
                            mermaidOutput = convertStateDiagramSvgToMermaidText(svgElement);
                        }

                        if (mermaidOutput) {
                            console.log("Successfully converted SVG to mermaid:", mermaidOutput.substring(0, 100) + "...");
                        } else {
                            console.log("Failed to convert SVG, using fallback");
                        }
                    }

                    if (mermaidOutput) {
                        resultMd = `\n${mermaidOutput}\n\n`;
                    } else {
                        const code = element.querySelector("code");
                        let lang = "";
                        let txt = "";
                        if (code) {
                            txt = code.textContent;
                            const cls = Array.from(code.classList).find((c) => c.startsWith("language-"));
                            if (cls) lang = cls.replace("language-", "");
                        } else {
                            txt = element.textContent;
                        }
                        if (!lang) {
                            const preCls = Array.from(element.classList).find((c) => c.startsWith("language-"));
                            if (preCls) lang = preCls.replace("language-", "");
                        }
                        if (!lang && txt.trim()) {
                            lang = detectCodeLanguage(txt);
                        }
                        resultMd = `\`\`\`${lang}\n${txt.trim()}\n\`\`\`\n\n`;
                    }
                    break;
                }
                case "A": {
                    const href = element.getAttribute("href");
                    let initialTextFromNodes = "";
                    element.childNodes.forEach(c => {
                        try {
                            initialTextFromNodes += processNode(c);
                        } catch (e) {
                            console.error("Error processing child of A:", c, e);
                            initialTextFromNodes += "[err]";
                        }
                    });
                    let text = initialTextFromNodes.trim();

                    if (!text && element.querySelector('img')) {
                        text = element.querySelector('img').alt || 'image';
                    }

                    if (href && (href.startsWith('http') || href.startsWith('https') || href.startsWith('/') || href.startsWith('#') || href.startsWith('mailto:'))) {

                        let finalLinkDisplayText = text;

                        const lineInfoMatch = href.match(/#L(\d+)(?:-L(\d+))?$/);

                        if (lineInfoMatch) {
                            const pathPart = href.substring(0, href.indexOf('#'));
                            let filenameFromPath = pathPart.substring(pathPart.lastIndexOf('/') + 1) || "link";

                            const startLine = lineInfoMatch[1];
                            const endLine = lineInfoMatch[2];

                            let displayFilename = filenameFromPath;

                            const trimmedInitialText = initialTextFromNodes.trim();
                            let textToParseForFilename = trimmedInitialText;

                            const isSourcesContext = trimmedInitialText.startsWith("Sources: [") && trimmedInitialText.endsWith("]");

                            if (isSourcesContext) {
                                const sourcesContentMatch = trimmedInitialText.match(/^Sources:\s+\[(.*)\]$/);
                                if (sourcesContentMatch && sourcesContentMatch[1]) {
                                    textToParseForFilename = sourcesContentMatch[1].trim();
                                }
                            }

                            const filenameHintMatch = textToParseForFilename.match(/^[\w\/\.-]+(?:\.\w+)?/);
                            if (filenameHintMatch && filenameHintMatch[0]) {
                                if (pathPart.includes(filenameHintMatch[0])) {
                                    displayFilename = filenameHintMatch[0];
                                }
                            }

                            let lineRefText;
                            if (endLine && endLine !== startLine) {
                                lineRefText = `L${startLine}-L${endLine}`;
                            } else {
                                lineRefText = `L${startLine}`;
                            }

                            let constructedText = `${displayFilename} ${lineRefText}`;

                            if (isSourcesContext) {
                                finalLinkDisplayText = `Sources: [${constructedText}]`;
                            } else {
                                finalLinkDisplayText = constructedText;
                            }
                        }

                        text = finalLinkDisplayText.trim() || (href ? href : "");

                        resultMd = `[${text}](${href})`;
                        if (window.getComputedStyle(element).display !== "inline") {
                            resultMd += "\n\n";
                        }
                    } else {
                        text = text.trim() || (href ? href : "");
                        resultMd = text;
                        if (window.getComputedStyle(element).display !== "inline" && text.trim()) {
                            resultMd += "\n\n";
                        }
                    }
                    break;
                }
                case "IMG":
                    if (element.closest && element.closest('a')) return "";
                    resultMd = (element.src ? `![${element.alt || ""}](${element.src})\n\n` : "");
                    break;
                case "BLOCKQUOTE": {
                    let qt = "";
                    element.childNodes.forEach((c) => { try { qt += processNode(c); } catch (e) { console.error("Error processing child of BLOCKQUOTE:", c, e); qt += "[err]";}});
                    const trimmedQt = qt.trim();
                    if (trimmedQt) {
                        resultMd = trimmedQt.split("\n").map((l) => `> ${l.trim() ? l : ''}`).filter(l => l.trim() !== '>').join("\n") + "\n\n";
                    } else {
                        resultMd = "";
                    }
                    break;
                }
                case "HR":
                    resultMd = "\n---\n\n";
                    break;
                case "STRONG":
                case "B": {
                    let st = "";
                    element.childNodes.forEach((c) => { try { st += processNode(c); } catch (e) { console.error("Error processing child of STRONG/B:", c, e); st += "[err]";}});
                    return `**${st.trim()}**`;
                }
                case "EM":
                case "I": {
                    let em = "";
                    element.childNodes.forEach((c) => { try { em += processNode(c); } catch (e) { console.error("Error processing child of EM/I:", c, e); em += "[err]";}});
                    return `*${em.trim()}*`;
                }
                case "CODE": {
                    if (element.parentNode && element.parentNode.nodeName === 'PRE') {
                        return element.textContent;
                    }
                    return `\`${element.textContent.trim()}\``;
                }
                case "BR":
                    if (element.parentNode && ['P', 'DIV', 'LI'].includes(element.parentNode.nodeName) ) {
                        const nextSibling = element.nextSibling;
                        if (!nextSibling || (nextSibling.nodeType === Node.TEXT_NODE && nextSibling.textContent.trim() !== '') || nextSibling.nodeType === Node.ELEMENT_NODE) {
                            return "  \n";
                        }
                    }
                    return "";
                case "TABLE": {
                    let tableMd = "";
                    const headerRows = Array.from(element.querySelectorAll(':scope > thead > tr, :scope > tr:first-child'));
                    const bodyRows = Array.from(element.querySelectorAll(':scope > tbody > tr'));
                    const allRows = Array.from(element.rows);

                    let rowsToProcessForHeader = headerRows;
                    if (headerRows.length === 0 && allRows.length > 0) {
                        rowsToProcessForHeader = [allRows[0]];
                    }

                    if (rowsToProcessForHeader.length > 0) {
                        const headerRowElement = rowsToProcessForHeader[0];
                        let headerContent = "|"; let separator = "|";
                        Array.from(headerRowElement.cells).forEach(cell => {
                            let cellText = ""; cell.childNodes.forEach(c => { try { cellText += processNode(c); } catch (e) { console.error("Error processing child of TH/TD (Header):", c, e); cellText += "[err]";}});
                            headerContent += ` ${cellText.trim().replace(/\|/g, "\\|")} |`; separator += ` --- |`;
                        });
                        tableMd += `${headerContent}\n${separator}\n`;
                    }

                    let rowsToProcessForBody = bodyRows;
                    if (bodyRows.length === 0 && allRows.length > (headerRows.length > 0 ? 1 : 0) ) {
                        rowsToProcessForBody = headerRows.length > 0 ? allRows.slice(1) : allRows;
                    }

                    rowsToProcessForBody.forEach(row => {
                        if (rowsToProcessForHeader.length > 0 && rowsToProcessForHeader.includes(row)) return;

                        let rowContent = "|";
                        Array.from(row.cells).forEach(cell => {
                            let cellText = ""; cell.childNodes.forEach(c => { try { cellText += processNode(c); } catch (e) { console.error("Error processing child of TH/TD (Body):", c, e); cellText += "[err]";}});
                            rowContent += ` ${cellText.trim().replace(/\|/g, "\\|").replace(/\n+/g, ' <br> ')} |`;
                        });
                        tableMd += `${rowContent}\n`;
                    });
                    resultMd = tableMd + (tableMd ? "\n" : "");
                    break;
                }
                case "THEAD": case "TBODY": case "TFOOT": case "TR": case "TH": case "TD":
                    return "";

                case "DETAILS": {
                    let summaryText = "Details"; const summaryElem = element.querySelector('summary');
                    if (summaryElem) { let tempSummary = ""; summaryElem.childNodes.forEach(c => { try { tempSummary += processNode(c); } catch (e) { console.error("Error processing child of SUMMARY:", c, e); tempSummary += "[err]";}}); summaryText = tempSummary.trim() || "Details"; }
                    let detailsContent = "";
                    Array.from(element.childNodes).forEach(child => { if (child.nodeName !== "SUMMARY") { try { detailsContent += processNode(child); } catch (e) { console.error("Error processing child of DETAILS:", c, e); detailsContent += "[err]";}}});
                    resultMd = `> **${summaryText}**\n${detailsContent.trim().split('\n').map(l => `> ${l}`).join('\n')}\n\n`;
                    break;
                }
                case "SUMMARY": return "";

                case "DIV":
                case "SPAN":
                case "SECTION":
                case "ARTICLE":
                case "MAIN":
                default: {
                    let txt = "";
                    element.childNodes.forEach((c) => { try { txt += processNode(c); } catch (e) { console.error("Error processing child of DEFAULT case:", c, element.nodeName, e); txt += "[err]";}});

                    const d = window.getComputedStyle(element);
                    const isBlock = ["block", "flex", "grid", "list-item", "table",
                                     "table-row-group", "table-header-group", "table-footer-group"].includes(d.display);

                    if (isBlock && txt.trim()) {
                        if (txt.endsWith('\n\n')) {
                            resultMd = txt;
                        } else if (txt.endsWith('\n')) {
                            resultMd = txt + '\n';
                        } else {
                            resultMd = txt.trimEnd() + "\n\n";
                        }
                    } else {
                        return txt;
                    }
                }
            }
        } catch (error) {
            console.error("Unhandled error in processNode for element:", element.nodeName, element, error);
            return `\n[ERROR_PROCESSING_ELEMENT: ${element.nodeName}]\n\n`;
        }
        return resultMd;
    }

    // ==================== MAIN CONVERSION FUNCTION ====================

    function convertPageToMarkdown() {
        try {
            const headTitle = document.title || "";
            const formattedHeadTitle = headTitle.replace(/[\/|]/g, '-').replace(/\s+/g, '-').replace('---','-');

            const title =
                document.querySelector('.container > div:nth-child(1) a[data-selected="true"]')?.textContent?.trim() ||
                document.querySelector(".container > div:nth-child(1) h1")?.textContent?.trim() ||
                document.querySelector("h1")?.textContent?.trim() ||
                "Untitled";

            const contentContainer =
                document.querySelector(".container > div:nth-child(2) .prose") ||
                document.querySelector(".container > div:nth-child(2) .prose-custom") ||
                document.querySelector(".container > div:nth-child(2)") ||
                document.body;

            let markdown = ``;
            let markdownTitle = title.replace(/\s+/g, '-');

            contentContainer.childNodes.forEach((child) => {
                markdown += processNode(child);
            });

            markdown = markdown.trim().replace(/\n{3,}/g, "\n\n");

            return {
                success: true,
                markdown,
                markdownTitle,
                headTitle: formattedHeadTitle
            };
        } catch (error) {
            console.error("Error converting to Markdown:", error);
            return { success: false, error: error.message };
        }
    }

    function extractAllPages() {
        try {
            const headTitle = document.title || "";
            const formattedHeadTitle = headTitle.replace(/[\/|]/g, '-').replace(/\s+/g, '-').replace('---','-');

            const baseUrl = window.location.origin;

            const sidebarLinks = Array.from(document.querySelectorAll('.border-r-border ul li a'));

            const pages = sidebarLinks.map(link => {
                return {
                    url: new URL(link.getAttribute('href'), baseUrl).href,
                    title: link.textContent.trim(),
                    selected: link.getAttribute('data-selected') === 'true'
                };
            });

            const currentPageTitle =
                document.querySelector('.container > div:nth-child(1) a[data-selected="true"]')?.textContent?.trim() ||
                document.querySelector(".container > div:nth-child(1) h1")?.textContent?.trim() ||
                document.querySelector("h1")?.textContent?.trim() ||
                "Untitled";

            return {
                success: true,
                pages: pages,
                currentTitle: currentPageTitle,
                baseUrl: baseUrl,
                headTitle: formattedHeadTitle
            };
        } catch (error) {
            console.error("Error extracting page links:", error);
            return { success: false, error: error.message };
        }
    }

    // ==================== UI INJECTION ====================

    function createUI() {
        // Create floating panel
        const panel = document.createElement('div');
        panel.id = 'deepwiki-md-panel';
        panel.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            border: 2px solid #4CAF50;
            border-radius: 8px;
            padding: 12px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            z-index: 10000;
            font-family: Arial, sans-serif;
            width: 200px;
        `;

        panel.innerHTML = `
            <div style="margin-bottom: 10px; font-weight: bold; color: #333;">DeepWiki to Markdown</div>
            <button id="dw-convert-btn" style="width: 100%; padding: 6px 10px; margin-bottom: 6px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">Convert Current Page</button>
            <button id="dw-batch-btn" style="width: 100%; padding: 6px 10px; margin-bottom: 6px; background: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">Batch Download All</button>
            <button id="dw-cancel-btn" style="width: 100%; padding: 6px 10px; margin-bottom: 6px; background: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 13px; display: none;">Cancel</button>
            <div id="dw-status" style="margin-top: 8px; font-size: 11px; color: #666; line-height: 1.3;"></div>
        `;

        document.body.appendChild(panel);

        // Event listeners
        document.getElementById('dw-convert-btn').addEventListener('click', handleConvertCurrent);
        document.getElementById('dw-batch-btn').addEventListener('click', handleBatchConvert);
        document.getElementById('dw-cancel-btn').addEventListener('click', handleCancel);
    }

    // ==================== EVENT HANDLERS ====================

    let isCancelled = false;
    let convertedPages = [];

    function updateStatus(message, type = 'info') {
        const statusEl = document.getElementById('dw-status');
        statusEl.textContent = message;
        statusEl.style.color = type === 'error' ? '#f44336' : (type === 'success' ? '#4CAF50' : '#666');
    }

    function handleConvertCurrent() {
        updateStatus('Converting page...', 'info');
        const result = convertPageToMarkdown();

        if (result.success) {
            const fileName = result.headTitle
                ? `${result.headTitle}-${result.markdownTitle}.md`
                : `${result.markdownTitle}.md`;

            downloadFile(result.markdown, fileName);
            updateStatus('Conversion successful! Downloading...', 'success');
        } else {
            updateStatus('Conversion failed: ' + result.error, 'error');
        }
    }

    async function handleBatchConvert() {
        isCancelled = false;
        document.getElementById('dw-cancel-btn').style.display = 'block';
        document.getElementById('dw-batch-btn').disabled = true;

        updateStatus('Extracting all page links...', 'info');

        const extractResult = extractAllPages();

        if (!extractResult.success) {
            updateStatus('Failed to extract page links: ' + extractResult.error, 'error');
            document.getElementById('dw-cancel-btn').style.display = 'none';
            document.getElementById('dw-batch-btn').disabled = false;
            return;
        }

        const allPages = extractResult.pages;
        const folderName = extractResult.headTitle || extractResult.currentTitle.replace(/\s+/g, '-');

        convertedPages = [];
        updateStatus(`Found ${allPages.length} pages, starting batch conversion`, 'info');

        let processedCount = 0;
        let errorCount = 0;

        for (const page of allPages) {
            if (isCancelled) {
                updateStatus(`Operation cancelled. Processed: ${processedCount}, Failed: ${errorCount}`, 'info');
                document.getElementById('dw-cancel-btn').style.display = 'none';
                document.getElementById('dw-batch-btn').disabled = false;
                return;
            }

            try {
                updateStatus(`Processing ${processedCount + 1}/${allPages.length}: ${page.title}`, 'info');

                // Fetch page content via AJAX
                const htmlContent = await fetchPageContent(page.url);

                if (!htmlContent) {
                    errorCount++;
                    console.error(`Failed to fetch page: ${page.title}`);
                    continue;
                }

                if (isCancelled) {
                    updateStatus(`Operation cancelled. Processed: ${processedCount}, Failed: ${errorCount}`, 'info');
                    document.getElementById('dw-cancel-btn').style.display = 'none';
                    document.getElementById('dw-batch-btn').disabled = false;
                    return;
                }

                // Parse and convert the fetched HTML
                const convertResult = convertHTMLToMarkdown(htmlContent);

                if (convertResult.success) {
                    convertedPages.push({
                        title: convertResult.markdownTitle || page.title.replace(/\s+/g, '-'),
                        content: convertResult.markdown
                    });
                    processedCount++;
                } else {
                    errorCount++;
                    console.error(`Page processing failed: ${page.title}`, convertResult.error);
                }
            } catch (err) {
                errorCount++;
                console.error(`Error processing page: ${page.title}`, err);
            }
        }

        if (!isCancelled && convertedPages.length > 0) {
            updateStatus(`Batch conversion complete! Success: ${processedCount}, Failed: ${errorCount}, Creating ZIP...`, 'success');
            await downloadAllPagesAsZip(folderName);
        }

        document.getElementById('dw-cancel-btn').style.display = 'none';
        document.getElementById('dw-batch-btn').disabled = false;
    }

    // Fetch page content using GM_xmlhttpRequest
    function fetchPageContent(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: function(response) {
                    if (response.status === 200) {
                        resolve(response.responseText);
                    } else {
                        console.error(`Failed to fetch ${url}: ${response.status}`);
                        resolve(null);
                    }
                },
                onerror: function(error) {
                    console.error(`Error fetching ${url}:`, error);
                    resolve(null);
                }
            });
        });
    }

    // Convert fetched HTML to Markdown
    function convertHTMLToMarkdown(htmlString) {
        try {
            // Create a temporary DOM parser
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlString, 'text/html');

            // Extract title
            const headTitle = doc.title || "";
            const formattedHeadTitle = headTitle.replace(/[\/|]/g, '-').replace(/\s+/g, '-').replace('---','-');

            const title =
                doc.querySelector('.container > div:nth-child(1) a[data-selected="true"]')?.textContent?.trim() ||
                doc.querySelector(".container > div:nth-child(1) h1")?.textContent?.trim() ||
                doc.querySelector("h1")?.textContent?.trim() ||
                "Untitled";

            const contentContainer =
                doc.querySelector(".container > div:nth-child(2) .prose") ||
                doc.querySelector(".container > div:nth-child(2) .prose-custom") ||
                doc.querySelector(".container > div:nth-child(2)") ||
                doc.body;

            let markdown = ``;
            let markdownTitle = title.replace(/\s+/g, '-');

            contentContainer.childNodes.forEach((child) => {
                markdown += processNodeFromDoc(child, doc);
            });

            markdown = markdown.trim().replace(/\n{3,}/g, "\n\n");

            return {
                success: true,
                markdown,
                markdownTitle,
                headTitle: formattedHeadTitle
            };
        } catch (error) {
            console.error("Error converting HTML to Markdown:", error);
            return { success: false, error: error.message };
        }
    }

    // Process node from parsed document (doesn't use getComputedStyle)
    function processNodeFromDoc(node, doc) {
        let resultMd = "";

        if (node.nodeType === Node.TEXT_NODE) {
            if (node.parentNode && node.parentNode.nodeName === 'PRE') { return node.textContent; }
            return node.textContent;
        }

        if (node.nodeType !== Node.ELEMENT_NODE) return "";

        const element = node;

        // Check style attribute for hidden elements
        const styleAttr = element.getAttribute('style') || '';
        if (styleAttr.includes('display: none') || styleAttr.includes('visibility: hidden')) {
            if (!["DETAILS", "SUMMARY"].includes(element.nodeName)) {
                return "";
            }
        }

        if (element.matches('button, [role="button"], nav, footer, aside, script, style, noscript, iframe, embed, object, header')) {
            return "";
        }
        if (element.classList.contains("bg-input-dark") && element.querySelector("svg")){
            return "";
        }

        try {
            switch (element.nodeName) {
                case "P": {
                    let txt = "";
                    element.childNodes.forEach((c) => {
                        try { txt += processNodeFromDoc(c, doc); } catch (e) { console.error("Error processing child of P:", c, e); txt += "[err]";}
                    });
                    txt = txt.trim();
                    if (txt.startsWith("```mermaid") && txt.endsWith("```")) {
                        resultMd = txt + "\n\n";
                    } else if (txt) {
                        resultMd = txt + "\n\n";
                    } else {
                        resultMd = "\n";
                    }
                    break;
                }
                case "H1": resultMd = (element.textContent.trim() ? `# ${element.textContent.trim()}\n\n` : ""); break;
                case "H2": resultMd = (element.textContent.trim() ? `## ${element.textContent.trim()}\n\n` : ""); break;
                case "H3": resultMd = (element.textContent.trim() ? `### ${element.textContent.trim()}\n\n` : ""); break;
                case "H4": resultMd = (element.textContent.trim() ? `#### ${element.textContent.trim()}\n\n` : ""); break;
                case "H5": resultMd = (element.textContent.trim() ? `##### ${element.textContent.trim()}\n\n` : ""); break;
                case "H6": resultMd = (element.textContent.trim() ? `###### ${element.textContent.trim()}\n\n` : ""); break;
                case "UL": {
                    let list = "";
                    const isSourceList = (
                        (element.previousElementSibling && /source/i.test(element.previousElementSibling.textContent)) ||
                        (element.parentElement && /source/i.test(element.parentElement.textContent)) ||
                        element.classList.contains('source-list')
                    );
                    element.querySelectorAll(":scope > li").forEach((li) => {
                        let liTxt = "";
                        li.childNodes.forEach((c) => { try { liTxt += processNodeFromDoc(c, doc); } catch (e) { console.error("Error processing child of LI:", c, e); liTxt += "[err]";}});
                        if (isSourceList) {
                            liTxt = liTxt.trim().replace(/\n+/g, ' ');
                        } else {
                            liTxt = liTxt.trim().replace(/\n\n$/, "").replace(/^\n\n/, "");
                        }
                        if (liTxt) list += `* ${liTxt}\n`;
                    });
                    resultMd = list + (list ? "\n" : "");
                    break;
                }
                case "OL": {
                    let list = "";
                    let i = 1;
                    const isSourceList = (
                        (element.previousElementSibling && /source/i.test(element.previousElementSibling.textContent)) ||
                        (element.parentElement && /source/i.test(element.parentElement.textContent)) ||
                        element.classList.contains('source-list')
                    );
                    element.querySelectorAll(":scope > li").forEach((li) => {
                        let liTxt = "";
                        li.childNodes.forEach((c) => { try { liTxt += processNodeFromDoc(c, doc); } catch (e) { console.error("Error processing child of LI:", c, e); liTxt += "[err]";}});
                        if (isSourceList) {
                            liTxt = liTxt.trim().replace(/\n+/g, ' ');
                        } else {
                            liTxt = liTxt.trim().replace(/\n\n$/, "").replace(/^\n\n/, "");
                        }
                        if (liTxt) {
                            list += `${i}. ${liTxt}\n`;
                            i++;
                        }
                    });
                    resultMd = list + (list ? "\n" : "");
                    break;
                }
                case "PRE": {
                    // For parsed HTML, skip complex SVG conversion (getBoundingClientRect won't work)
                    // Just extract code content instead
                    const code = element.querySelector("code");
                    let lang = "";
                    let txt = "";
                    if (code) {
                        txt = code.textContent;
                        const cls = Array.from(code.classList).find((c) => c.startsWith("language-"));
                        if (cls) lang = cls.replace("language-", "");
                    } else {
                        txt = element.textContent;
                    }
                    if (!lang) {
                        const preCls = Array.from(element.classList).find((c) => c.startsWith("language-"));
                        if (preCls) lang = preCls.replace("language-", "");
                    }
                    if (!lang && txt.trim()) {
                        lang = detectCodeLanguage(txt);
                    }

                    // Check if it's a mermaid diagram
                    const svgElement = element.querySelector('svg[id^="mermaid-"]');
                    if (svgElement && !lang) {
                        lang = 'mermaid';
                        // Try to extract mermaid code from data attribute or just mark as mermaid
                        txt = txt.trim() || '// Mermaid diagram - please view original page';
                    }

                    resultMd = `\`\`\`${lang}\n${txt.trim()}\n\`\`\`\n\n`;
                    break;
                }
                case "A": {
                    const href = element.getAttribute("href");
                    let initialTextFromNodes = "";
                    element.childNodes.forEach(c => {
                        try {
                            initialTextFromNodes += processNodeFromDoc(c, doc);
                        } catch (e) {
                            console.error("Error processing child of A:", c, e);
                            initialTextFromNodes += "[err]";
                        }
                    });
                    let text = initialTextFromNodes.trim();

                    if (!text && element.querySelector('img')) {
                        text = element.querySelector('img').alt || 'image';
                    }

                    if (href && (href.startsWith('http') || href.startsWith('https') || href.startsWith('/') || href.startsWith('#') || href.startsWith('mailto:'))) {
                        let finalLinkDisplayText = text;
                        const lineInfoMatch = href.match(/#L(\d+)(?:-L(\d+))?$/);

                        if (lineInfoMatch) {
                            const pathPart = href.substring(0, href.indexOf('#'));
                            let filenameFromPath = pathPart.substring(pathPart.lastIndexOf('/') + 1) || "link";
                            const startLine = lineInfoMatch[1];
                            const endLine = lineInfoMatch[2];
                            let displayFilename = filenameFromPath;
                            const trimmedInitialText = initialTextFromNodes.trim();
                            let textToParseForFilename = trimmedInitialText;
                            const isSourcesContext = trimmedInitialText.startsWith("Sources: [") && trimmedInitialText.endsWith("]");

                            if (isSourcesContext) {
                                const sourcesContentMatch = trimmedInitialText.match(/^Sources:\s+\[(.*)\]$/);
                                if (sourcesContentMatch && sourcesContentMatch[1]) {
                                    textToParseForFilename = sourcesContentMatch[1].trim();
                                }
                            }

                            const filenameHintMatch = textToParseForFilename.match(/^[\w\/\.-]+(?:\.\w+)?/);
                            if (filenameHintMatch && filenameHintMatch[0]) {
                                if (pathPart.includes(filenameHintMatch[0])) {
                                    displayFilename = filenameHintMatch[0];
                                }
                            }

                            let lineRefText;
                            if (endLine && endLine !== startLine) {
                                lineRefText = `L${startLine}-L${endLine}`;
                            } else {
                                lineRefText = `L${startLine}`;
                            }

                            let constructedText = `${displayFilename} ${lineRefText}`;

                            if (isSourcesContext) {
                                finalLinkDisplayText = `Sources: [${constructedText}]`;
                            } else {
                                finalLinkDisplayText = constructedText;
                            }
                        }

                        text = finalLinkDisplayText.trim() || (href ? href : "");
                        resultMd = `[${text}](${href})`;

                        // Check display style from style attribute
                        const displayStyle = element.getAttribute('style')?.includes('display') ?
                                           element.getAttribute('style').match(/display:\s*([^;]+)/)?.[1] : 'inline';
                        if (displayStyle !== "inline") {
                            resultMd += "\n\n";
                        }
                    } else {
                        text = text.trim() || (href ? href : "");
                        resultMd = text;
                        const displayStyle = element.getAttribute('style')?.includes('display') ?
                                           element.getAttribute('style').match(/display:\s*([^;]+)/)?.[1] : 'inline';
                        if (displayStyle !== "inline" && text.trim()) {
                            resultMd += "\n\n";
                        }
                    }
                    break;
                }
                case "IMG":
                    if (element.closest && element.closest('a')) return "";
                    resultMd = (element.src ? `![${element.alt || ""}](${element.src})\n\n` : "");
                    break;
                case "BLOCKQUOTE": {
                    let qt = "";
                    element.childNodes.forEach((c) => { try { qt += processNodeFromDoc(c, doc); } catch (e) { console.error("Error processing child of BLOCKQUOTE:", c, e); qt += "[err]";}});
                    const trimmedQt = qt.trim();
                    if (trimmedQt) {
                        resultMd = trimmedQt.split("\n").map((l) => `> ${l.trim() ? l : ''}`).filter(l => l.trim() !== '>').join("\n") + "\n\n";
                    } else {
                        resultMd = "";
                    }
                    break;
                }
                case "HR":
                    resultMd = "\n---\n\n";
                    break;
                case "STRONG":
                case "B": {
                    let st = "";
                    element.childNodes.forEach((c) => { try { st += processNodeFromDoc(c, doc); } catch (e) { console.error("Error processing child of STRONG/B:", c, e); st += "[err]";}});
                    return `**${st.trim()}**`;
                }
                case "EM":
                case "I": {
                    let em = "";
                    element.childNodes.forEach((c) => { try { em += processNodeFromDoc(c, doc); } catch (e) { console.error("Error processing child of EM/I:", c, e); em += "[err]";}});
                    return `*${em.trim()}*`;
                }
                case "CODE": {
                    if (element.parentNode && element.parentNode.nodeName === 'PRE') {
                        return element.textContent;
                    }
                    return `\`${element.textContent.trim()}\``;
                }
                case "BR":
                    if (element.parentNode && ['P', 'DIV', 'LI'].includes(element.parentNode.nodeName) ) {
                        const nextSibling = element.nextSibling;
                        if (!nextSibling || (nextSibling.nodeType === Node.TEXT_NODE && nextSibling.textContent.trim() !== '') || nextSibling.nodeType === Node.ELEMENT_NODE) {
                            return "  \n";
                        }
                    }
                    return "";
                case "TABLE": {
                    let tableMd = "";
                    const headerRows = Array.from(element.querySelectorAll(':scope > thead > tr, :scope > tr:first-child'));
                    const bodyRows = Array.from(element.querySelectorAll(':scope > tbody > tr'));
                    const allRows = Array.from(element.rows);

                    let rowsToProcessForHeader = headerRows;
                    if (headerRows.length === 0 && allRows.length > 0) {
                        rowsToProcessForHeader = [allRows[0]];
                    }

                    if (rowsToProcessForHeader.length > 0) {
                        const headerRowElement = rowsToProcessForHeader[0];
                        let headerContent = "|"; let separator = "|";
                        Array.from(headerRowElement.cells).forEach(cell => {
                            let cellText = ""; cell.childNodes.forEach(c => { try { cellText += processNodeFromDoc(c, doc); } catch (e) { console.error("Error processing child of TH/TD (Header):", c, e); cellText += "[err]";}});
                            headerContent += ` ${cellText.trim().replace(/\|/g, "\\|")} |`; separator += ` --- |`;
                        });
                        tableMd += `${headerContent}\n${separator}\n`;
                    }

                    let rowsToProcessForBody = bodyRows;
                    if (bodyRows.length === 0 && allRows.length > (headerRows.length > 0 ? 1 : 0) ) {
                        rowsToProcessForBody = headerRows.length > 0 ? allRows.slice(1) : allRows;
                    }

                    rowsToProcessForBody.forEach(row => {
                        if (rowsToProcessForHeader.length > 0 && rowsToProcessForHeader.includes(row)) return;

                        let rowContent = "|";
                        Array.from(row.cells).forEach(cell => {
                            let cellText = ""; cell.childNodes.forEach(c => { try { cellText += processNodeFromDoc(c, doc); } catch (e) { console.error("Error processing child of TH/TD (Body):", c, e); cellText += "[err]";}});
                            rowContent += ` ${cellText.trim().replace(/\|/g, "\\|").replace(/\n+/g, ' <br> ')} |`;
                        });
                        tableMd += `${rowContent}\n`;
                    });
                    resultMd = tableMd + (tableMd ? "\n" : "");
                    break;
                }
                case "THEAD": case "TBODY": case "TFOOT": case "TR": case "TH": case "TD":
                    return "";

                case "DETAILS": {
                    let summaryText = "Details"; const summaryElem = element.querySelector('summary');
                    if (summaryElem) { let tempSummary = ""; summaryElem.childNodes.forEach(c => { try { tempSummary += processNodeFromDoc(c, doc); } catch (e) { console.error("Error processing child of SUMMARY:", c, e); tempSummary += "[err]";}}); summaryText = tempSummary.trim() || "Details"; }
                    let detailsContent = "";
                    Array.from(element.childNodes).forEach(child => { if (child.nodeName !== "SUMMARY") { try { detailsContent += processNodeFromDoc(child, doc); } catch (e) { console.error("Error processing child of DETAILS:", c, e); detailsContent += "[err]";}}});
                    resultMd = `> **${summaryText}**\n${detailsContent.trim().split('\n').map(l => `> ${l}`).join('\n')}\n\n`;
                    break;
                }
                case "SUMMARY": return "";

                case "DIV":
                case "SPAN":
                case "SECTION":
                case "ARTICLE":
                case "MAIN":
                default: {
                    let txt = "";
                    element.childNodes.forEach((c) => { try { txt += processNodeFromDoc(c, doc); } catch (e) { console.error("Error processing child of DEFAULT case:", c, element.nodeName, e); txt += "[err]";}});

                    // Simple heuristic: block-level elements based on tag name
                    const blockElements = ["DIV", "SECTION", "ARTICLE", "MAIN", "HEADER", "FOOTER", "NAV", "ASIDE"];
                    const isBlock = blockElements.includes(element.nodeName);

                    if (isBlock && txt.trim()) {
                        if (txt.endsWith('\n\n')) {
                            resultMd = txt;
                        } else if (txt.endsWith('\n')) {
                            resultMd = txt + '\n';
                        } else {
                            resultMd = txt.trimEnd() + "\n\n";
                        }
                    } else {
                        return txt;
                    }
                }
            }
        } catch (error) {
            console.error("Unhandled error in processNodeFromDoc for element:", element.nodeName, element, error);
            return `\n[ERROR_PROCESSING_ELEMENT: ${element.nodeName}]\n\n`;
        }
        return resultMd;
    }

    function handleCancel() {
        isCancelled = true;
        updateStatus('Cancelling batch operation...', 'info');
        document.getElementById('dw-cancel-btn').style.display = 'none';
        document.getElementById('dw-batch-btn').disabled = false;
    }

    async function downloadAllPagesAsZip(folderName) {
        try {
            console.log('Preparing to download', convertedPages.length, 'files');
            updateStatus('Preparing downloads...', 'info');

            // Create index file
            let indexContent = `# ${folderName}\n\n## Content Index\n\n`;
            convertedPages.forEach(page => {
                indexContent += `- [${page.title}](${page.title}.md)\n`;
            });

            // Option 1: Download files individually with delay
            updateStatus('Downloading files individually (check your downloads folder)...', 'info');

            // Download README first
            console.log('Downloading README.md');
            downloadFile(indexContent, `${folderName}/README.md`);
            await new Promise(resolve => setTimeout(resolve, 500));

            // Download each markdown file with a delay to avoid browser blocking
            for (let i = 0; i < convertedPages.length; i++) {
                const page = convertedPages[i];
                console.log(`Downloading ${i + 1}/${convertedPages.length}: ${page.title}.md`);
                updateStatus(`Downloading ${i + 1}/${convertedPages.length}: ${page.title}.md`, 'info');

                downloadFile(page.content, `${folderName}/${page.title}.md`);

                // Small delay between downloads
                await new Promise(resolve => setTimeout(resolve, 300));
            }

            updateStatus(`Successfully downloaded ${convertedPages.length + 1} files! Check your downloads folder.`, 'success');
            console.log('All downloads complete!');

        } catch (error) {
            console.error('Error downloading files:', error);
            updateStatus('Error downloading files: ' + error.message, 'error');
        }
    }

    // ==================== INITIALIZATION ====================

    // Wait for page to fully load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createUI);
    } else {
        createUI();
    }

})();
