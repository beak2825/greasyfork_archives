// ==UserScript==
// @name         Honey Coupon Checker (No Spyware)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Check for Honey coupons on demand without tracking
// @author       Minoa
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @connect      d.joinhoney.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/561365/Honey%20Coupon%20Checker%20%28No%20Spyware%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561365/Honey%20Coupon%20Checker%20%28No%20Spyware%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add menu command to check coupons
    GM_registerMenuCommand('Check for Coupons', checkCoupons);

    async function checkCoupons() {
        const domain = window.location.hostname.replace('www.', '');
        
        try {
            showNotification('Searching for coupons...', 'loading');
            
            // Step 1: Get store ID by domain
            const partialUrl = `https://d.joinhoney.com/v3?operationName=ext_getStorePartialsByDomain&variables=${encodeURIComponent(JSON.stringify({domain}))}`;
            
            const partialData = await gmFetch(partialUrl);
            
            if (!partialData) {
                showNotification('This store is not supported by Honey', 'error');
                return;
            }
            
            const stores = partialData?.data?.getPartialURLsByDomain;
            
            if (!stores || stores.length === 0) {
                showNotification('This store is not supported by Honey', 'error');
                return;
            }
            
            const storeId = stores[0].storeId;
            
            // Step 2: Get store details and coupons
            const storeUrl = `https://d.joinhoney.com/v3?operationName=ext_getStoreById&variables=${encodeURIComponent(JSON.stringify({storeId, maxUGC: 3, successCount: 1}))}&operationVersion=18`;
            
            const storeData = await gmFetch(storeUrl);
            
            if (!storeData) {
                showNotification('This store is not supported by Honey', 'error');
                return;
            }
            
            const coupons = storeData?.data?.getStoreById?.publicCoupons;
            
            if (!coupons || coupons.length === 0) {
                showNotification('No coupons available', 'error');
                return;
            }
            
            // Extract and copy coupon codes
            const codes = coupons.map(c => c.code).join(', ');
            GM_setClipboard(codes);
            
            showNotification(`Copied ${coupons.length} coupon(s): ${codes}`, 'success');
            
        } catch (err) {
            console.error('Coupon check failed:', err);
            showNotification('Failed to fetch coupons', 'error');
        }
    }

    function gmFetch(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                headers: {
                    'accept': '*/*',
                    'content-type': 'application/json',
                    'service-name': 'honey-extension',
                    'service-version': '19.0.1'
                },
                onload: (response) => {
                    if (response.status === 404) {
                        resolve(null);
                        return;
                    }
                    try {
                        const data = JSON.parse(response.responseText);
                        resolve(data);
                    } catch (e) {
                        reject(e);
                    }
                },
                onerror: (error) => {
                    reject(error);
                },
                ontimeout: () => {
                    reject(new Error('Request timeout'));
                }
            });
        });
    }

    function showNotification(message, type = 'success') {
        // Remove existing notification if any
        const existing = document.getElementById('honey-checker-notification');
        if (existing) existing.remove();
        
        const notification = document.createElement('div');
        notification.id = 'honey-checker-notification';
        notification.innerHTML = `
            <div style="padding: 16px 20px; color: white; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 14px; font-weight: 500; letter-spacing: 0.3px;">
                ${message}
            </div>
            ${type !== 'loading' ? '<div style="position: absolute; bottom: 0; left: 0; width: 100%; height: 3px; background: rgba(255,255,255,0.3); overflow: hidden;"><div id="honey-progress-bar" style="height: 100%; background: rgba(255,255,255,0.8); width: 100%; animation: shrink 4s linear forwards;"></div></div>' : ''}
        `;
        
        const bgColor = type === 'loading' ? 'rgba(100, 100, 100, 0.95)' : 
                       type === 'error' ? 'rgba(220, 50, 50, 0.95)' : 
                       'rgba(40, 167, 69, 0.95)';
        
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            left: '20px',
            background: bgColor,
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 2px 8px rgba(0, 0, 0, 0.2)',
            zIndex: '999999',
            minWidth: '280px',
            maxWidth: '420px',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            animation: 'slideInLeft 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            overflow: 'hidden'
        });
        
        // Add CSS animations
        if (!document.getElementById('honey-checker-styles')) {
            const style = document.createElement('style');
            style.id = 'honey-checker-styles';
            style.textContent = `
                @keyframes slideInLeft {
                    from {
                        transform: translateX(-100%) scale(0.9);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0) scale(1);
                        opacity: 1;
                    }
                }
                @keyframes slideOutLeft {
                    from {
                        transform: translateX(0) scale(1);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(-100%) scale(0.9);
                        opacity: 0;
                    }
                }
                @keyframes shrink {
                    from { width: 100%; }
                    to { width: 0%; }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        // Auto-remove after 4 seconds (unless it's loading)
        if (type !== 'loading') {
            setTimeout(() => {
                notification.style.animation = 'slideOutLeft 0.3s cubic-bezier(0.6, 0, 0.8, 0.2)';
                setTimeout(() => notification.remove(), 300);
            }, 4000);
        }
    }
})();