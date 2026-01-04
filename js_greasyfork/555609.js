// ==UserScript==
// @name		PrepMart Unlimited Access
// @description		A new extension
// @version		1.1.1
// @match		https://*.prepmart.in/*
// @icon		https://www.prepmart.in/prepmart-favicon.png?1761906642
// @require		https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js
// @require		https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js
// @namespace https://greasyfork.org/users/1536954
// @downloadURL https://update.greasyfork.org/scripts/555609/PrepMart%20Unlimited%20Access.user.js
// @updateURL https://update.greasyfork.org/scripts/555609/PrepMart%20Unlimited%20Access.meta.js
// ==/UserScript==
(function() {
    'use strict';

    console.log('PrepMart Unlimited Access extension loaded');

    // Function to hide subscription popup
    function hideSubscriptionPopup() {
        const popup = document.querySelector('#subscriptionPopup');
        if (popup) {
            popup.style.display = 'none';
            popup.classList.remove('show');
            console.log('Subscription popup hidden');
        }

        // Remove modal backdrop if exists
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
            backdrop.remove();
            console.log('Modal backdrop removed');
        }

        // Restore body scroll
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
    }

    // Function to remove login button
    function removeLoginButton() {
        const loginButton = document.querySelector('.buttons a[href="/userLogin.php"]');
        if (loginButton) {
            loginButton.remove();
            console.log('Login button removed');
        }

        // Also remove the entire buttons div if it only contains login
        const buttonsDiv = document.querySelector('.buttons');
        if (buttonsDiv && buttonsDiv.children.length === 0) {
            buttonsDiv.remove();
            console.log('Empty buttons container removed');
        }
    }

    // Function to bypass question limits
    function bypassQuestionLimits() {
        // Remove any question limit overlays or restrictions
        const limitOverlays = document.querySelectorAll('[class*="limit"], [class*="restrict"], [id*="limit"], [id*="restrict"]');
        limitOverlays.forEach(overlay => {
            if (overlay.textContent.toLowerCase().includes('limit') || 
                overlay.textContent.toLowerCase().includes('subscribe') ||
                overlay.textContent.toLowerCase().includes('premium')) {
                overlay.remove();
                console.log('Question limit overlay removed:', overlay);
            }
        });

        // Unlock all questions by removing disabled states
        const disabledElements = document.querySelectorAll('[disabled], .disabled, [class*="locked"], [class*="premium"]');
        disabledElements.forEach(element => {
            element.removeAttribute('disabled');
            element.classList.remove('disabled', 'locked', 'premium');
        });

        // Make all links clickable
        const restrictedLinks = document.querySelectorAll('a[onclick*="subscribe"], a[onclick*="login"], a[onclick*="premium"]');
        restrictedLinks.forEach(link => {
            link.removeAttribute('onclick');
            link.style.pointerEvents = 'auto';
            link.style.opacity = '1';
        });

        console.log('Question limits bypassed');
    }

    // Function to remove subscription-related elements
    function removeSubscriptionElements() {
        // Remove any subscription banners or cards
        const subscriptionElements = document.querySelectorAll('[class*="subscription"], [class*="pricing"], [id*="subscription"], [id*="pricing"]');
        subscriptionElements.forEach(element => {
            // Don't remove the popup itself (we just hide it), but remove other subscription elements
            if (element.id !== 'subscriptionPopup') {
                element.remove();
                console.log('Subscription element removed:', element);
            }
        });
    }

    // Function to create and add download PDF button
    function addDownloadButton() {
        // Check if button already exists
        if (document.getElementById('prepmart-pdf-download-btn')) {
            console.log('Download button already exists');
            return;
        }

        // Create download button
        const downloadBtn = document.createElement('button');
        downloadBtn.id = 'prepmart-pdf-download-btn';
        downloadBtn.innerHTML = '📥 Download PDF';
        downloadBtn.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 9999;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            transition: all 0.3s ease;
        `;

        // Add hover effect
        downloadBtn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.3)';
        });

        downloadBtn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
        });

        // Add click handler
        downloadBtn.addEventListener('click', async function() {
            await downloadPageAsPDF();
        });

        document.body.appendChild(downloadBtn);
        console.log('Download PDF button added');
    }

    // Function to download page as PDF
    async function downloadPageAsPDF() {
        try {
            const downloadBtn = document.getElementById('prepmart-pdf-download-btn');
            const originalText = downloadBtn.innerHTML;
            downloadBtn.innerHTML = '⏳ Generating PDF...';
            downloadBtn.disabled = true;

            console.log('Starting PDF generation...');

            // Get the main content area
            const contentElement = document.querySelector('.container') || document.body;

            // Use html2canvas to capture the content
            const canvas = await html2canvas(contentElement, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff',
                windowWidth: contentElement.scrollWidth,
                windowHeight: contentElement.scrollHeight
            });

            console.log('Canvas created successfully');

            // A4 dimensions in mm
            const a4Width = 210;
            const a4Height = 297;

            // Create PDF with A4 dimensions
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            // Calculate dimensions to fit content on A4
            const imgWidth = a4Width;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            let heightLeft = imgHeight;
            let position = 0;

            // Add image to PDF
            const imgData = canvas.toDataURL('image/png');
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= a4Height;

            // Add new pages if content is longer than one page
            while (heightLeft > 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= a4Height;
            }

            // Generate filename from page title
            const pageTitle = document.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            const filename = `prepmart_${pageTitle}_${Date.now()}.pdf`;

            // Save the PDF
            pdf.save(filename);

            console.log('PDF downloaded successfully:', filename);

            // Reset button
            downloadBtn.innerHTML = '✅ Downloaded!';
            setTimeout(() => {
                downloadBtn.innerHTML = originalText;
                downloadBtn.disabled = false;
            }, 2000);

        } catch (error) {
            console.error('Error generating PDF:', error);
            const downloadBtn = document.getElementById('prepmart-pdf-download-btn');
            if (downloadBtn) {
                downloadBtn.innerHTML = '❌ Error - Try Again';
                downloadBtn.disabled = false;
                setTimeout(() => {
                    downloadBtn.innerHTML = '📥 Download PDF';
                }, 3000);
            }
        }
    }

    // Initialize the extension
    function init() {
        console.log('Initializing PrepMart Unlimited Access...');
        
        // Hide subscription popup immediately
        hideSubscriptionPopup();
        
        // Remove login button
        removeLoginButton();
        
        // Bypass question limits
        bypassQuestionLimits();
        
        // Remove subscription elements
        removeSubscriptionElements();

        // Add download PDF button
        addDownloadButton();
    }

    // Run on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Watch for dynamic content changes
    const observer = new MutationObserver(function() {
        // Check if subscription popup appears
        const popup = document.querySelector('#subscriptionPopup.show');
        if (popup) {
            hideSubscriptionPopup();
        }

        // Check if login button reappears
        const loginButton = document.querySelector('.buttons a[href="/userLogin.php"]');
        if (loginButton) {
            removeLoginButton();
        }

        // Continuously bypass any new restrictions
        bypassQuestionLimits();

        // Ensure download button exists
        addDownloadButton();
    });

    // Start observing the document
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'style']
    });

    // Prevent popup from showing via JavaScript
    window.addEventListener('load', function() {
        // Override Bootstrap modal show function if it exists
        if (typeof window.bootstrap !== 'undefined' && window.bootstrap.Modal) {
            const originalShow = window.bootstrap.Modal.prototype.show;
            window.bootstrap.Modal.prototype.show = function() {
                const modalElement = this._element;
                if (modalElement && modalElement.id === 'subscriptionPopup') {
                    console.log('Blocked subscription popup from showing');
                    return;
                }
                return originalShow.apply(this, arguments);
            };
        }
    });

    console.log('PrepMart Unlimited Access extension initialized successfully');
})();