// ==UserScript==
// @name		Panacea Concept Ad-Free PDF Downloader
// @description		Removes all ads and provides clean PDF download for Panacea Concept articles
// @version		1.1.1
// @match		https://*.panaceaconcept.in/*
// @require		https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js
// @namespace https://greasyfork.org/users/1536954
// @downloadURL https://update.greasyfork.org/scripts/556176/Panacea%20Concept%20Ad-Free%20PDF%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/556176/Panacea%20Concept%20Ad-Free%20PDF%20Downloader.meta.js
// ==/UserScript==
(function() {
    'use strict';

    console.log('Panacea Concept Ad-Free PDF Downloader - Starting');

    // Add custom styles
    const style = document.createElement('style');
    style.textContent = `
        /* Hide all ad-related elements */
        .adsbygoogle,
        .google-auto-placed,
        .ap_container,
        ins.adsbygoogle,
        .fc-message-root,
        .fc-monetization-dialog-container,
        .fc-dialog-overlay,
        iframe[id*="aswift"],
        iframe[title*="Advertisement"] {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            height: 0 !important;
            width: 0 !important;
        }

        /* PDF Download Button Styles */
        #pdf-download-btn {
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 9999;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 15px 25px;
            font-size: 16px;
            font-weight: bold;
            border-radius: 50px;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            transition: all 0.3s ease;
            font-family: Arial, sans-serif;
        }

        #pdf-download-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
            background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
        }

        #pdf-download-btn:active {
            transform: translateY(0);
        }

        #pdf-download-btn.downloading {
            background: #95a5a6;
            cursor: wait;
        }

        /* Clean up the content area for PDF */
        .entry-content {
            background: white;
            padding: 20px;
        }
    `;
    document.head.appendChild(style);
    console.log('Styles added');

    // Generate and download PDF
    async function generatePDF() {
        const button = document.getElementById('pdf-download-btn');
        button.classList.add('downloading');
        button.innerHTML = '⏳ Generating PDF...';
        console.log('Generating PDF...');

        try {
            const contentElement = document.querySelector('.entry-content');
            
            if (!contentElement) {
                alert('Could not find content to convert to PDF');
                return;
            }

            const clonedContent = contentElement.cloneNode(true);
            const adsInClone = clonedContent.querySelectorAll('.adsbygoogle, .google-auto-placed, .ap_container, ins.adsbygoogle');
            adsInClone.forEach(ad => ad.remove());

            const pageTitle = document.querySelector('.entry-title')?.textContent || 'document';
            const filename = pageTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.pdf';

            const opt = {
                margin: [15, 15, 15, 15],
                filename: filename,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { 
                    scale: 2,
                    useCORS: true,
                    logging: false,
                    letterRendering: true,
                    windowWidth: contentElement.scrollWidth,
                    windowHeight: contentElement.scrollHeight
                },
                jsPDF: { 
                    unit: 'mm', 
                    format: 'a4', 
                    orientation: 'portrait',
                    compress: true
                },
                pagebreak: { 
                    mode: ['avoid-all', 'css', 'legacy'],
                    before: '.page-break-before',
                    after: '.page-break-after',
                    avoid: ['tr', 'td', 'th', 'img']
                }
            };

            await html2pdf().set(opt).from(clonedContent).save();
            
            console.log('PDF generated successfully');
            button.innerHTML = '✅ PDF Downloaded!';
            
            setTimeout(() => {
                button.classList.remove('downloading');
                button.innerHTML = '📄 Download PDF';
            }, 3000);

        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Error generating PDF. Please try again.');
            button.classList.remove('downloading');
            button.innerHTML = '📄 Download PDF';
        }
    }

    // Function to remove all ads and unwanted elements
    function removeAds() {
        console.log('Removing ads...');
        
        // Remove Google AdSense ads
        const adsenseElements = document.querySelectorAll('.adsbygoogle, ins.adsbygoogle, .google-auto-placed, .ap_container');
        adsenseElements.forEach(ad => ad.remove());

        // Remove ad iframes
        const adIframes = document.querySelectorAll('iframe[id*="aswift"], iframe[title*="Advertisement"], iframe[aria-label*="Advertisement"]');
        adIframes.forEach(iframe => iframe.remove());

        // Remove floating dialog/popup ads
        const floatingAds = document.querySelectorAll('.fc-message-root, .fc-monetization-dialog-container, .fc-dialog-overlay, .fc-dialog');
        floatingAds.forEach(ad => ad.remove());

        // Remove any ad scripts
        const adScripts = document.querySelectorAll('script[src*="adsbygoogle"], script[src*="googlesyndication"]');
        adScripts.forEach(script => script.remove());

        // Remove common ad containers (but not our PDF button)
        const adContainers = document.querySelectorAll('[class*="ad-container"], [class*="advertisement"], [id*="ad-"], [class*="banner"]');
        adContainers.forEach(container => {
            // Skip our PDF button
            if (container.id === 'pdf-download-btn') {
                return;
            }
            if (container.offsetHeight > 0 || container.offsetWidth > 0) {
                container.remove();
            }
        });

        // Create PDF button if it doesn't exist
        if (!document.getElementById('pdf-download-btn')) {
            console.log('Creating PDF button inside removeAds...');
            const pdfButton = document.createElement('button');
            pdfButton.id = 'pdf-download-btn';
            pdfButton.innerHTML = '📄 Download PDF';
            pdfButton.addEventListener('click', generatePDF);
            document.body.appendChild(pdfButton);
            console.log('PDF button created!');
        }

        console.log('Ads removed');
    }

    // Remove ads immediately
    removeAds();

    // Observe DOM changes to remove dynamically loaded ads
    const observer = new MutationObserver(() => {
        const ads = document.querySelectorAll('.adsbygoogle, .google-auto-placed, .fc-message-root');
        if (ads.length > 0) {
            removeAds();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Remove ads periodically
    setTimeout(removeAds, 1000);
    setTimeout(removeAds, 3000);
    setTimeout(removeAds, 5000);

    console.log('Extension initialized');

})();