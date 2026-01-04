// ==UserScript==
// @name         SEO Metadata Analyzer 2.1
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Displays and analyzes page title, meta description, and heading structure for SEO compliance
// @author       Your name
// @match        *://*/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561363/SEO%20Metadata%20Analyzer%2021.user.js
// @updateURL https://update.greasyfork.org/scripts/561363/SEO%20Metadata%20Analyzer%2021.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Don't run in iframes
    if (window.self !== window.top) {
        return;
    }

    // List of domains to exclude
    const excludedDomains = [
        'proton.me',
        'infomaniak.com',
        'google.com', 
        'google.fr', 
        'google.de', 
        'google.co.uk', 
        'google.it', 
        'google.es', 
        'google.nl', 
        'google.ca', 
        'google.com.au', 
        'google.com.br', 
        'google.co.jp', 
        'google.ru', 
        'google.cn', 
        'google.in', 
        'google.ie', 
        'google.se', 
        'google.pl', 
        'google.be', 
        'gmail.com',
        'docs.google.com',
        'drive.google.com',
        'sheets.google.com',
        'slides.google.com',
        'calendar.google.com',
        'mail.google.com',
        'meet.google.com',
        'chat.google.com',
        'classroom.google.com',
        'aistudio.google.com',
        'mail-edu.univ-fcomte.fr',
        'gemini.google.com',
        'notion.so',
        'notion.site',
        'notion.com',
        'notion.ai',
        'chat.openai.com',
        'chatgpt.com',
        'openai.com',
        'claude.ai',
        'anthropic.com',
        'mistral.ai',
        'perplexity.ai',
        'poe.com',
        'deepseek.com',
        'cohere.com',
        'huggingface.co',
        'phind.com',
        'you.com',
        'bard.google.com',
        'duet.google.com'
    ];

    // Check if current domain should be excluded
    const currentDomain = window.location.hostname;
    const currentPath = window.location.pathname;
    const isExcluded = excludedDomains.some(domain => 
        currentDomain === domain || currentDomain.endsWith('.' + domain)
    );

    // Check for WordPress admin (wp-admin) or PrestaShop admin (/admin)
    const isWordPressAdmin = currentPath.includes('wp-admin');
    const isPrestaShopAdmin = currentPath.includes('/admin');

    if (isExcluded || isWordPressAdmin || isPrestaShopAdmin) {
        console.log('SEO Analyzer: Skipping execution on excluded page:', currentDomain + currentPath);
        return;
    }

    console.log('SEO Analyzer script starting...');

    const createFloatingBox = () => {
        console.log('Creating floating box...');
        const box = document.createElement('div');
        box.id = 'seo-analyzer-box';
        
        // Get saved position and collapsed state from localStorage
        const savedData = JSON.parse(localStorage.getItem('seoAnalyzerData')) || {
            position: { top: '20px', right: '20px', left: 'auto' },
            isCollapsed: false
        };
        
        box.style.cssText = `
            position: fixed;
            top: ${savedData.position.top};
            right: ${savedData.position.right};
            left: ${savedData.position.left};
            padding: 12px;
            background: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            z-index: 999999;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            font-size: 13px;
            width: 280px;
            pointer-events: auto;
            border: 1px solid #f0f0f0;
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
            max-height: 80vh;
            overflow: hidden;
        `;

        // Store reference to the box
        box.dataset.isCollapsed = savedData.isCollapsed;
        return box;
    };

    const SEO_GUIDELINES = {
        title: {
            min: 30,
            max: 60,
            getMessage: (length) => {
                if (length < 30) return 'Too short';
                if (length > 60) return 'Too long';
                return 'Optimal length';
            },
            getColor: (length) => {
                if (length >= 30 && length <= 60) return '#10B981'; // Modern green
                return '#EF4444'; // Modern red
            }
        },
        description: {
            min: 120,
            max: 155,
            getMessage: (length) => {
                if (length < 120) return 'Too short';
                if (length > 155) return 'Too long';
                return 'Optimal length';
            },
            getColor: (length) => {
                if (length >= 120 && length <= 155) return '#10B981'; // Modern green
                return '#EF4444'; // Modern red
            }
        }
    };

    // Create copy button with tooltip
    const createCopyButton = () => {
        const button = document.createElement('button');
        button.style.cssText = `
            padding: 4px 8px;
            background: rgba(255,255,255,0.2);
            border: none;
            border-radius: 4px;
            color: white;
            cursor: pointer;
            font-size: 11px;
            transition: all 0.2s ease;
            margin-left: 8px;
        `;
        button.textContent = 'Copy';

        const tooltip = document.createElement('div');
        tooltip.style.cssText = `
            position: absolute;
            background: #333;
            color: white;
            padding: 6px 10px;
            border-radius: 4px;
            font-size: 11px;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.2s ease;
            white-space: nowrap;
            z-index: 1000000;
        `;
        document.body.appendChild(tooltip);

        let tooltipTimeout;

        const showTooltip = (message, x, y) => {
            tooltip.textContent = message;
            tooltip.style.left = `${x}px`;
            tooltip.style.top = `${y - 30}px`;
            tooltip.style.opacity = '1';
        };

        const hideTooltip = () => {
            tooltip.style.opacity = '0';
        };

        button.addEventListener('mouseover', (e) => {
            showTooltip('Click to copy', e.clientX, e.clientY);
        });

        button.addEventListener('mouseout', () => {
            hideTooltip();
        });

        return { button, showTooltip, hideTooltip };
    };

    const createSection = (title, content, length, guidelines) => {
        const section = document.createElement('div');
        section.style.cssText = `
            margin-bottom: 8px;
            padding: 10px;
            background-color: ${guidelines.getColor(length)};
            border-radius: 8px;
            color: white;
            font-size: 12px;
            line-height: 1.5;
            position: relative;
        `;

        const { button, showTooltip, hideTooltip } = createCopyButton();

        const headerDiv = document.createElement('div');
        headerDiv.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 6px;
        `;

        const titleSpan = document.createElement('strong');
        titleSpan.style.fontWeight = '600';
        titleSpan.textContent = title;

        const rightSection = document.createElement('div');
        rightSection.style.cssText = `
            display: flex;
            align-items: center;
        `;

        const lengthSpan = document.createElement('span');
        lengthSpan.style.cssText = `
            opacity: 0.9;
            padding: 2px 6px;
            background: rgba(255,255,255,0.2);
            border-radius: 4px;
        `;
        lengthSpan.textContent = `${length} chars`;

        button.addEventListener('click', async (e) => {
            e.stopPropagation();
            try {
                await navigator.clipboard.writeText(content);
                showTooltip('Copied!', e.clientX, e.clientY);
                button.style.backgroundColor = 'rgba(255,255,255,0.3)';
                setTimeout(() => {
                    hideTooltip();
                    button.style.backgroundColor = 'rgba(255,255,255,0.2)';
                }, 1500);
            } catch (err) {
                showTooltip('Failed to copy', e.clientX, e.clientY);
                setTimeout(hideTooltip, 1500);
            }
        });

        rightSection.appendChild(lengthSpan);
        rightSection.appendChild(button);
        headerDiv.appendChild(titleSpan);
        headerDiv.appendChild(rightSection);

        section.innerHTML = `
            <div style="margin: 8px 0; word-wrap: break-word;">
                ${content}
            </div>
            <div style="font-size: 11px; opacity: 0.9; margin-top: 6px; text-align: right; padding: 4px 6px; background: rgba(255,255,255,0.1); border-radius: 4px;">
                ${guidelines.getMessage(length)}
            </div>
        `;

        section.insertBefore(headerDiv, section.firstChild);

        return section;
    };

    const analyzeHeadingStructure = () => {
        const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
        const headingStructure = [];
        let previousLevel = 0;
        let hasErrors = false;

        headings.forEach(heading => {
            const level = parseInt(heading.tagName.substring(1));
            const text = heading.textContent.trim();
            const isError = level > previousLevel + 1;

            if (isError) {
                hasErrors = true;
            }

            headingStructure.push({
                tag: heading.tagName,
                level,
                text,
                isError,
                element: heading // Store reference to the actual DOM element
            });

            previousLevel = level;
        });

        return {
            headings: headingStructure,
            hasErrors
        };
    };

    const createHeadingStructureSection = (headingAnalysis) => {
        const section = document.createElement('div');
        section.style.cssText = `
            margin-bottom: 8px;
            padding: 10px;
            background-color: ${headingAnalysis.hasErrors ? '#F59E0B' : '#10B981'};
            border-radius: 8px;
            color: white;
            font-size: 12px;
            line-height: 1.5;
        `;

        const headerDiv = document.createElement('div');
        headerDiv.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 6px;
        `;

        const titleSpan = document.createElement('strong');
        titleSpan.style.fontWeight = '600';
        titleSpan.textContent = 'Heading Structure';

        const statusSpan = document.createElement('span');
        statusSpan.style.cssText = `
            opacity: 0.9;
            padding: 2px 6px;
            background: rgba(255,255,255,0.2);
            border-radius: 4px;
        `;
        statusSpan.textContent = headingAnalysis.hasErrors ? 'Issues found' : 'Valid structure';

        headerDiv.appendChild(titleSpan);
        headerDiv.appendChild(statusSpan);
        section.appendChild(headerDiv);

        const structureDiv = document.createElement('div');
        structureDiv.style.cssText = `
            margin-top: 8px;
            max-height: 200px;
            overflow-y: auto;
            background: rgba(255,255,255,0.1);
            border-radius: 6px;
            padding: 6px;
        `;

        if (headingAnalysis.headings.length === 0) {
            structureDiv.textContent = 'No headings found on the page';
            structureDiv.style.padding = '10px';
            structureDiv.style.textAlign = 'center';
            section.style.backgroundColor = '#EF4444';
            statusSpan.textContent = 'No headings';
        } else {
            headingAnalysis.headings.forEach(heading => {
                const headingDiv = document.createElement('div');
                headingDiv.style.cssText = `
                    padding: 4px 6px;
                    margin: 2px 0;
                    border-radius: 4px;
                    background: ${heading.isError ? 'rgba(239, 68, 68, 0.3)' : 'rgba(255,255,255,0.1)'};
                    border-left: 3px solid ${heading.isError ? '#EF4444' : '#10B981'};
                    font-family: monospace;
                    display: flex;
                    cursor: pointer;
                    transition: all 0.2s ease;
                `;

                headingDiv.addEventListener('mouseover', () => {
                    headingDiv.style.background = heading.isError ? 'rgba(239, 68, 68, 0.5)' : 'rgba(255,255,255,0.2)';
                });

                headingDiv.addEventListener('mouseout', () => {
                    headingDiv.style.background = heading.isError ? 'rgba(239, 68, 68, 0.3)' : 'rgba(255,255,255,0.1)';
                });

                headingDiv.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (heading.element) {
                        heading.element.scrollIntoView({
                            behavior: 'smooth',
                            block: 'center'
                        });
                        
                        // Highlight the heading temporarily
                        const originalBackground = heading.element.style.backgroundColor;
                        heading.element.style.backgroundColor = 'rgba(255, 255, 0, 0.3)';
                        heading.element.style.transition = 'background-color 0.5s ease';
                        
                        setTimeout(() => {
                            heading.element.style.backgroundColor = originalBackground || '';
                        }, 2000);
                    }
                });

                const tagSpan = document.createElement('span');
                tagSpan.style.cssText = `
                    display: inline-block;
                    width: 30px;
                    color: ${heading.isError ? '#EF4444' : '#A7F3D0'};
                    font-weight: ${heading.isError ? 'bold' : 'normal'};
                `;
                tagSpan.textContent = heading.tag;

                const textSpan = document.createElement('span');
                textSpan.style.cssText = `
                    margin-left: 8px;
                    flex-grow: 1;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                `;
                textSpan.textContent = heading.text;

                if (heading.isError) {
                    const errorSpan = document.createElement('span');
                    errorSpan.style.cssText = `
                        margin-left: 8px;
                        color: #FEE2E2;
                        font-size: 10px;
                        white-space: nowrap;
                    `;
                    errorSpan.textContent = '← Hierarchy jump';
                    headingDiv.appendChild(errorSpan);
                }

                headingDiv.appendChild(tagSpan);
                headingDiv.appendChild(textSpan);
                structureDiv.appendChild(headingDiv);
            });
        }

        section.appendChild(structureDiv);

        const summaryDiv = document.createElement('div');
        summaryDiv.style.cssText = `
            font-size: 11px;
            opacity: 0.9;
            margin-top: 6px;
            text-align: right;
            padding: 4px 6px;
            background: rgba(255,255,255,0.1);
            border-radius: 4px;
        `;

        if (headingAnalysis.headings.length === 0) {
            summaryDiv.textContent = 'No headings found - SEO issue';
        } else if (headingAnalysis.hasErrors) {
            summaryDiv.textContent = 'Heading hierarchy issues detected';
        } else {
            summaryDiv.textContent = 'Proper heading hierarchy';
        }

        section.appendChild(summaryDiv);

        return section;
    };

    const analyzeMetadata = () => {
        console.log('Analyzing metadata...');

        const existingBox = document.getElementById('seo-analyzer-box');
        if (existingBox) {
            existingBox.remove();
        }

        const title = document.title;
        const metaDescription = document.querySelector('meta[name="description"]')?.getAttribute('content') || 'No meta description found';
        const headingAnalysis = analyzeHeadingStructure();

        const titleLength = title.length;
        const descriptionLength = metaDescription.length;

        const box = createFloatingBox();
        const contentDiv = document.createElement('div');
        contentDiv.style.cssText = `
            transition: all 0.3s ease;
            overflow: hidden;
        `;

        const header = document.createElement('div');
        header.style.cssText = `
            margin-bottom: 12px;
            padding: 4px 0;
            font-weight: 600;
            font-size: 14px;
            color: #333;
            cursor: move;
            user-select: none;
            border-bottom: 1px solid #f0f0f0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;

        const titleSpan = document.createElement('span');
        titleSpan.textContent = 'SEO Analysis';

        const toggleButton = document.createElement('button');
        toggleButton.style.cssText = `
            background: none;
            border: none;
            cursor: pointer;
            font-size: 14px;
            color: #666;
            padding: 2px 6px;
            border-radius: 4px;
            transition: all 0.2s ease;
        `;
        toggleButton.textContent = '−';
        toggleButton.title = 'Collapse/Expand';

        header.appendChild(titleSpan);
        header.appendChild(toggleButton);
        box.appendChild(header);

        // Create content sections
        const titleSection = createSection('Title', title, titleLength, SEO_GUIDELINES.title);
        const descSection = createSection('Meta Description', metaDescription, descriptionLength, SEO_GUIDELINES.description);
        const headingSection = createHeadingStructureSection(headingAnalysis);

        contentDiv.appendChild(titleSection);
        contentDiv.appendChild(descSection);
        contentDiv.appendChild(headingSection);
        box.appendChild(contentDiv);

        document.body.appendChild(box);
        console.log('Box added to document body');

        // Check if collapsed state should be applied
        const isCollapsed = box.dataset.isCollapsed === 'true';
        if (isCollapsed) {
            contentDiv.style.maxHeight = '0';
            contentDiv.style.margin = '0';
            contentDiv.style.padding = '0';
            contentDiv.style.opacity = '0';
            toggleButton.textContent = '+';
        }

        // Make box draggable
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;

        const saveData = () => {
            const data = {
                position: {
                    top: box.style.top,
                    left: box.style.left,
                    right: box.style.right
                },
                isCollapsed: box.dataset.isCollapsed === 'true'
            };
            localStorage.setItem('seoAnalyzerData', JSON.stringify(data));
        };

        header.addEventListener('mousedown', (e) => {
            // Don't start dragging if clicking the toggle button
            if (e.target === toggleButton) return;
            
            isDragging = true;
            initialX = e.clientX - box.offsetLeft;
            initialY = e.clientY - box.offsetTop;
            header.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                
                // Update box position
                box.style.left = currentX + 'px';
                box.style.top = currentY + 'px';
                box.style.right = 'auto';
                
                // Save position while dragging for real-time updates
                saveData();
            }
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                header.style.cursor = 'move';
                // Final save when dragging stops
                saveData();
            }
        });

        // Toggle collapse/expand
        toggleButton.addEventListener('click', (e) => {
            e.stopPropagation();
            const isCollapsed = box.dataset.isCollapsed === 'true';
            
            if (isCollapsed) {
                // Expand
                contentDiv.style.maxHeight = '1000px';
                contentDiv.style.margin = '';
                contentDiv.style.padding = '';
                contentDiv.style.opacity = '1';
                toggleButton.textContent = '−';
                box.dataset.isCollapsed = 'false';
            } else {
                // Collapse
                contentDiv.style.maxHeight = '0';
                contentDiv.style.margin = '0';
                contentDiv.style.padding = '0';
                contentDiv.style.opacity = '0';
                toggleButton.textContent = '+';
                box.dataset.isCollapsed = 'true';
            }
            
            saveData();
        });
    };

    analyzeMetadata();
    window.addEventListener('load', analyzeMetadata);
    document.addEventListener('DOMContentLoaded', analyzeMetadata);

    const checkInterval = setInterval(() => {
        if (document.readyState === 'complete') {
            analyzeMetadata();
            clearInterval(checkInterval);
        }
    }, 1000);
})();