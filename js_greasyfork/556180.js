// ==UserScript==
// @name		Panacea Concept Ad Blocker & PDF Downloader
// @description		Blocks all ads, enables text copying, and adds PDF download with A4 formatting
// @version		1.0.1
// @match		https://*.panaceaconcept.in/*
// @grant		GM.getValue
// @grant		GM.setValue
// @require		https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js
// @require		https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js
// @namespace https://greasyfork.org/users/1536954
// @downloadURL https://update.greasyfork.org/scripts/556180/Panacea%20Concept%20Ad%20Blocker%20%20PDF%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/556180/Panacea%20Concept%20Ad%20Blocker%20%20PDF%20Downloader.meta.js
// ==/UserScript==
(function() {
    'use strict';

    console.log('Panacea Concept Ad Blocker & PDF Downloader - Extension loaded');

    // Initialize the extension
    function init() {
        blockAllAds();
        enableTextCopying();
        addPDFDownloadButton();
        observeDOMForNewAds();
        console.log('Extension initialized successfully');
    }

    // Block all ads on the page
    function blockAllAds() {
        console.log('Blocking ads...');
        
        // CSS to hide all ad-related elements
        const adBlockingCSS = `
            /* Google AdSense */
            .adsbygoogle,
            ins.adsbygoogle,
            .google-auto-placed,
            #aswift_1_host,
            #aswift_2_host,
            [id^="aswift_"],
            [id^="google_ads_"],
            .google-anno-skip,
            .goog-rtopics,
            
            /* Common ad containers */
            .ad, .ads, .advertisement, .banner-ad,
            [class*="ad-container"],
            [class*="ad-banner"],
            [class*="ad-wrapper"],
            [class*="advertisement"],
            [id*="ad-container"],
            [id*="ad-banner"],
            [id*="advertisement"],
            
            /* Floating and popup ads */
            [class*="floating-ad"],
            [class*="popup-ad"],
            [class*="overlay-ad"],
            [style*="position: fixed"][style*="z-index"],
            
            /* Ad scripts and iframes */
            iframe[src*="doubleclick"],
            iframe[src*="googlesyndication"],
            iframe[src*="googleadservices"],
            iframe[src*="ads"],
            
            /* Additional ad patterns */
            div[id*="google_ads"],
            div[class*="google-ad"],
            .sponsored,
            [data-ad-slot],
            [data-ad-format] {
                display: none !important;
                visibility: hidden !important;
                opacity: 0 !important;
                height: 0 !important;
                width: 0 !important;
                position: absolute !important;
                left: -9999px !important;
            }
            
            /* Remove ad spacing */
            body {
                margin: 0 !important;
            }
        `;
        
        TM_addStyle(adBlockingCSS);
        
        // Remove ad elements from DOM
        const adSelectors = [
            '.adsbygoogle',
            'ins.adsbygoogle',
            '.google-auto-placed',
            '[id^="aswift_"]',
            '[id^="google_ads_"]',
            '.google-anno-skip',
            '.goog-rtopics',
            'iframe[src*="doubleclick"]',
            'iframe[src*="googlesyndication"]',
            'iframe[src*="googleadservices"]',
            '[data-ad-slot]',
            '[data-ad-format]'
        ];
        
        adSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                console.log('Removing ad element:', selector);
                el.remove();
            });
        });
        
        console.log('Ads blocked successfully');
    }

    // Enable text copying on the website
    function enableTextCopying() {
        console.log('Enabling text copying...');
        
        // CSS to enable text selection
        const copyEnableCSS = `
            * {
                -webkit-user-select: text !important;
                -moz-user-select: text !important;
                -ms-user-select: text !important;
                user-select: text !important;
            }
            
            body {
                -webkit-touch-callout: default !important;
            }
        `;
        
        TM_addStyle(copyEnableCSS);
        
        // Remove copy protection event listeners
        const events = ['copy', 'cut', 'paste', 'contextmenu', 'selectstart', 'mousedown', 'mouseup', 'mousemove', 'keydown', 'keypress', 'keyup'];
        
        events.forEach(event => {
            document.addEventListener(event, function(e) {
                e.stopPropagation();
            }, true);
        });
        
        // Remove oncopy, oncut, onpaste attributes
        document.body.oncopy = null;
        document.body.oncut = null;
        document.body.onpaste = null;
        document.body.onselectstart = null;
        document.body.oncontextmenu = null;
        
        console.log('Text copying enabled successfully');
    }

    // Add PDF download button
    function addPDFDownloadButton() {
        console.log('Adding PDF download button...');
        
        // Create download button
        const downloadButton = document.createElement('button');
        downloadButton.id = 'pdf-download-btn';
        downloadButton.innerHTML = '📄 Download PDF';
        downloadButton.title = 'Download page as PDF (A4 format)';
        
        // Style the button
        const buttonCSS = `
            #pdf-download-btn {
                position: fixed;
                bottom: 30px;
                right: 30px;
                z-index: 999999;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                padding: 15px 25px;
                font-size: 16px;
                font-weight: bold;
                border-radius: 50px;
                cursor: pointer;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
                transition: all 0.3s ease;
                font-family: Arial, sans-serif;
            }
            
            #pdf-download-btn:hover {
                transform: translateY(-3px);
                box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
                background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
            }
            
            #pdf-download-btn:active {
                transform: translateY(-1px);
            }
            
            #pdf-loading-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                z-index: 9999999;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                color: white;
                font-family: Arial, sans-serif;
            }
            
            #pdf-loading-overlay .spinner {
                border: 5px solid #f3f3f3;
                border-top: 5px solid #667eea;
                border-radius: 50%;
                width: 60px;
                height: 60px;
                animation: spin 1s linear infinite;
                margin-bottom: 20px;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            #pdf-loading-overlay .message {
                font-size: 20px;
                font-weight: bold;
                margin-top: 10px;
            }
        `;
        
        TM_addStyle(buttonCSS);
        
        // Add click event to download PDF
        downloadButton.addEventListener('click', async function() {
            console.log('PDF download initiated');
            await generatePDF();
        });
        
        // Add button to page
        document.body.appendChild(downloadButton);
        console.log('PDF download button added successfully');
    }

    // Generate and download PDF
    async function generatePDF() {
        try {
            // Show loading overlay
            const loadingOverlay = document.createElement('div');
            loadingOverlay.id = 'pdf-loading-overlay';
            loadingOverlay.innerHTML = `
                <div class="spinner"></div>
                <div class="message">Generating PDF...</div>
                <div style="font-size: 14px; margin-top: 10px;">Please wait, this may take a moment</div>
            `;
            document.body.appendChild(loadingOverlay);
            
            console.log('Starting PDF generation...');
            
            // Get the main content area
            const contentArea = document.querySelector('#primary.content-area') || 
                               document.querySelector('main') || 
                               document.querySelector('article') || 
                               document.body;
            
            console.log('Content area selected:', contentArea);
            
            // Temporarily hide ads and unwanted elements for PDF
            const elementsToHide = document.querySelectorAll('.adsbygoogle, .google-auto-placed, #pdf-download-btn, header, nav, footer, .sidebar, [class*="ad-"], [id*="ad-"]');
            elementsToHide.forEach(el => {
                el.style.display = 'none';
            });
            
            // Create canvas from content
            const canvas = await html2canvas(contentArea, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff',
                windowWidth: 1200,
                windowHeight: document.documentElement.scrollHeight
            });
            
            console.log('Canvas created successfully');
            
            // Restore hidden elements
            elementsToHide.forEach(el => {
                el.style.display = '';
            });
            
            // A4 dimensions in mm
            const a4Width = 210;
            const a4Height = 297;
            
            // Create PDF with A4 size
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
                compress: true
            });
            
            // Calculate dimensions to fit A4
            const imgWidth = a4Width - 20; // 10mm margin on each side
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
            let heightLeft = imgHeight;
            let position = 10; // Top margin
            
            // Add image to PDF
            const imgData = canvas.toDataURL('image/jpeg', 0.95);
            
            // Add first page
            pdf.addImage(imgData, 'JPEG', 10, position, imgWidth, imgHeight);
            heightLeft -= (a4Height - 20);
            
            // Add additional pages if content is longer than one page
            while (heightLeft > 0) {
                position = heightLeft - imgHeight + 10;
                pdf.addPage();
                pdf.addImage(imgData, 'JPEG', 10, position, imgWidth, imgHeight);
                heightLeft -= (a4Height - 20);
            }
            
            // Generate filename from page title
            const pageTitle = document.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            const filename = `${pageTitle}_${Date.now()}.pdf`;
            
            // Save PDF
            pdf.save(filename);
            
            console.log('PDF generated and downloaded successfully:', filename);
            
            // Remove loading overlay
            loadingOverlay.remove();
            
            // Show success message
            showNotification('PDF downloaded successfully!', 'success');
            
        } catch (error) {
            console.error('Error generating PDF:', error);
            
            // Remove loading overlay
            const overlay = document.getElementById('pdf-loading-overlay');
            if (overlay) overlay.remove();
            
            showNotification('Error generating PDF. Please try again.', 'error');
        }
    }

    // Show notification
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 99999999;
            background: ${type === 'success' ? '#4CAF50' : '#f44336'};
            color: white;
            padding: 15px 25px;
            border-radius: 5px;
            font-family: Arial, sans-serif;
            font-size: 16px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Observe DOM for dynamically loaded ads
    function observeDOMForNewAds() {
        console.log('Setting up MutationObserver for dynamic ads...');
        
        const observer = new MutationObserver(debounce(function(mutations) {
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) { // Element node
                        // Check if the added node is an ad
                        if (node.classList && (
                            node.classList.contains('adsbygoogle') ||
                            node.classList.contains('google-auto-placed') ||
                            node.id && (node.id.includes('aswift_') || node.id.includes('google_ads_'))
                        )) {
                            console.log('Removing dynamically added ad:', node);
                            node.remove();
                        }
                        
                        // Check child nodes for ads
                        const adElements = node.querySelectorAll('.adsbygoogle, .google-auto-placed, [id^="aswift_"], [id^="google_ads_"]');
                        adElements.forEach(ad => {
                            console.log('Removing dynamically added ad (child):', ad);
                            ad.remove();
                        });
                    }
                });
            });
        }, 500));
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        console.log('MutationObserver set up successfully');
    }

    // Debounce function to limit observer callback frequency
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Wait for page to load and initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Also run after a short delay to catch late-loading ads
    setTimeout(() => {
        blockAllAds();
        console.log('Secondary ad blocking pass completed');
    }, 2000);

})();