// ==UserScript==
// @name         rtao userscript by nytralis
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description does his work 
// @author       nytralis
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      montelopiuy.pythonanywhere.com
// @downloadURL https://update.greasyfork.org/scripts/558211/rtao%20userscript%20by%20nytralis.user.js
// @updateURL https://update.greasyfork.org/scripts/558211/rtao%20userscript%20by%20nytralis.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const API_URL = 'https://montelopiuy.pythonanywhere.com';
    
    // Magnifique CSS avec animations et gradients
    GM_addStyle(`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        * {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        .bypass-lock-btn {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            border-radius: 16px;
            width: 64px;
            height: 64px;
            cursor: pointer;
            box-shadow: 0 8px 32px rgba(102, 126, 234, 0.4);
            z-index: 999999;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28px;
            overflow: hidden;
        }
        
        .bypass-lock-btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
            transition: left 0.5s;
            pointer-events: none;
        }
        
        .bypass-lock-btn:hover::before {
            left: 100%;
        }
        
        .bypass-lock-btn:hover {
            transform: scale(1.15) rotate(5deg);
            box-shadow: 0 12px 48px rgba(102, 126, 234, 0.6);
        }
        
        .bypass-lock-btn:active {
            transform: scale(0.95) rotate(-5deg);
        }
        
        .bypass-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.85);
            backdrop-filter: blur(10px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000000;
            animation: fadeIn 0.3s ease;
        }
        
        @keyframes fadeIn {
            from { 
                opacity: 0;
                backdrop-filter: blur(0px);
            }
            to { 
                opacity: 1;
                backdrop-filter: blur(10px);
            }
        }
        
        .bypass-modal-content {
            background: linear-gradient(135deg, #1e1e2e 0%, #2d2d44 100%);
            border-radius: 24px;
            padding: 40px;
            max-width: 560px;
            width: 90%;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
            border: 1px solid rgba(255, 255, 255, 0.1);
            animation: slideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            position: relative;
            overflow: hidden;
        }
        
        .bypass-modal-content::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%);
            animation: rotate 20s linear infinite;
        }
        
        @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        
        @keyframes slideUp {
            from {
                transform: translateY(100px) scale(0.9);
                opacity: 0;
            }
            to {
                transform: translateY(0) scale(1);
                opacity: 1;
            }
        }
        
        .bypass-modal-header {
            font-size: 32px;
            font-weight: 800;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 24px;
            text-align: center;
            position: relative;
            z-index: 1;
            letter-spacing: -0.5px;
        }
        
        .bypass-modal-body {
            color: #b4b4c5;
            font-size: 16px;
            line-height: 1.6;
            text-align: center;
            position: relative;
            z-index: 1;
        }
        
        .bypass-status {
            margin: 24px 0;
            padding: 24px;
            background: rgba(42, 42, 62, 0.6);
            backdrop-filter: blur(10px);
            border-radius: 16px;
            border: 1px solid rgba(255, 255, 255, 0.05);
            color: #fff;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        
        .bypass-status::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.1), transparent);
            animation: shimmer 2s infinite;
        }
        
        @keyframes shimmer {
            to { left: 100%; }
        }
        
        .bypass-loading {
            display: inline-block;
            width: 24px;
            height: 24px;
            border: 3px solid rgba(102, 126, 234, 0.3);
            border-radius: 50%;
            border-top-color: #667eea;
            animation: spin 0.8s linear infinite;
            margin-right: 12px;
            vertical-align: middle;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        
        .bypass-result {
            margin-top: 20px;
            padding: 24px;
            background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
            border-radius: 16px;
            color: #fff;
            font-weight: 600;
            word-break: break-all;
            box-shadow: 0 8px 24px rgba(46, 204, 113, 0.3);
            animation: successPop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            position: relative;
            overflow: hidden;
        }
        
        @keyframes successPop {
            0% {
                transform: scale(0.8);
                opacity: 0;
            }
            50% {
                transform: scale(1.05);
            }
            100% {
                transform: scale(1);
                opacity: 1;
            }
        }
        
        .bypass-result::before {
            content: '✓';
            position: absolute;
            top: -20px;
            right: -20px;
            font-size: 120px;
            opacity: 0.1;
            font-weight: bold;
        }
        
        .bypass-key-text {
            font-size: 15px;
            line-height: 1.6;
            position: relative;
            z-index: 1;
        }
        
        .bypass-error {
            margin-top: 20px;
            padding: 24px;
            background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
            border-radius: 16px;
            color: #fff;
            font-weight: 600;
            box-shadow: 0 8px 24px rgba(231, 76, 60, 0.3);
            animation: errorShake 0.5s ease;
        }
        
        @keyframes errorShake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
        }
        
        .bypass-button-group {
            display: flex;
            gap: 12px;
            margin-top: 24px;
            justify-content: center;
            flex-wrap: wrap;
        }
        
        .bypass-close-btn, .bypass-copy-btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            padding: 14px 32px;
            border-radius: 12px;
            color: #fff;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
            position: relative;
            overflow: hidden;
        }
        
        .bypass-copy-btn {
            background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
            box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
        }
        
        .bypass-close-btn::before, .bypass-copy-btn::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.2);
            transform: translate(-50%, -50%);
            transition: width 0.6s, height 0.6s;
        }
        
        .bypass-close-btn:hover::before, .bypass-copy-btn:hover::before {
            width: 300px;
            height: 300px;
        }
        
        .bypass-close-btn:hover, .bypass-copy-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
        }
        
        .bypass-copy-btn:hover {
            box-shadow: 0 6px 20px rgba(52, 152, 219, 0.5);
        }
        
        .bypass-close-btn:active, .bypass-copy-btn:active {
            transform: translateY(0);
        }
        
        .bypass-countdown {
            margin-top: 16px;
            font-size: 14px;
            color: #95a5a6;
            font-weight: 500;
        }
        
        .bypass-redirect-bar {
            height: 4px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 2px;
            overflow: hidden;
            margin-top: 12px;
        }
        
        .bypass-redirect-progress {
            height: 100%;
            background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
            border-radius: 2px;
            animation: progressBar 5s linear forwards;
        }
        
        @keyframes progressBar {
            from { width: 100%; }
            to { width: 0%; }
        }
    `);

    // Créer le bouton cadenas
    function createLockButton() {
        const btn = document.createElement('button');
        btn.className = 'bypass-lock-btn';
        btn.innerHTML = '🔒';
        btn.title = 'Bypass this link';
        
        btn.addEventListener('click', handleBypass);
        document.body.appendChild(btn);
    }

    // Créer le modal
    function createModal() {
        const modal = document.createElement('div');
        modal.className = 'bypass-modal';
        modal.innerHTML = `
            <div class="bypass-modal-content">
                <div class="bypass-modal-header">
                    🔓 Bypass in Progress
                </div>
                <div class="bypass-modal-body">
                    <div class="bypass-status">
                        <span class="bypass-loading"></span>
                        <span id="bypass-status-text">Sending link to server...</span>
                    </div>
                    <div id="bypass-result-container"></div>
                </div>
                <div class="bypass-button-group">
                    <button class="bypass-close-btn" onclick="this.closest('.bypass-modal').remove()">
                        Close
                    </button>
                </div>
            </div>
        `;
        
        // Fermer en cliquant à l'extérieur
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        return modal;
    }

    // Nettoyer la clé
    function cleanKey(key) {
        // Retirer les ``` au début et à la fin
        return key.replace(/^```|```$/g, '').trim();
    }

    // Vérifier si c'est un lien
    function isURL(str) {
        try {
            new URL(str);
            return true;
        } catch {
            return false;
        }
    }

    // Copier dans le presse-papier
    function copyToClipboard(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            return navigator.clipboard.writeText(text);
        } else {
            // Fallback pour les navigateurs plus anciens
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            try {
                document.execCommand('copy');
                document.body.removeChild(textarea);
                return Promise.resolve();
            } catch (err) {
                document.body.removeChild(textarea);
                return Promise.reject(err);
            }
        }
    }

    // Auto-redirection avec countdown
    function startRedirectCountdown(url, container) {
        let seconds = 5;
        const countdownDiv = document.createElement('div');
        countdownDiv.className = 'bypass-countdown';
        countdownDiv.innerHTML = `Redirecting in <strong>${seconds}</strong> seconds...`;
        container.appendChild(countdownDiv);
        
        const progressBar = document.createElement('div');
        progressBar.className = 'bypass-redirect-bar';
        progressBar.innerHTML = '<div class="bypass-redirect-progress"></div>';
        container.appendChild(progressBar);
        
        const interval = setInterval(() => {
            seconds--;
            if (seconds > 0) {
                countdownDiv.innerHTML = `Redirecting in <strong>${seconds}</strong> seconds...`;
            } else {
                clearInterval(interval);
                window.location.href = url;
            }
        }, 1000);
    }

    // Gérer le bypass
    async function handleBypass() {
        const currentUrl = window.location.href;
        const modal = createModal();
        document.body.appendChild(modal);
        
        const statusText = document.getElementById('bypass-status-text');
        const resultContainer = document.getElementById('bypass-result-container');
        
        try {
            // Étape 1: Envoyer le lien
            statusText.textContent = 'Sending link to server...';
            
            const response = await fetch(`${API_URL}/bypass`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ link: currentUrl })
            });
            
            if (!response.ok) {
                throw new Error('Failed to send link to server');
            }
            
            const data = await response.json();
            const requestId = data.request_id;
            
            // Étape 2: Attendre le résultat
            statusText.textContent = 'Bypassing... This may take a few seconds';
            
            let attempts = 0;
            const maxAttempts = 60; // 60 secondes max
            
            const checkResult = async () => {
                if (attempts >= maxAttempts) {
                    throw new Error('Timeout: Bypass took too long');
                }
                
                const resultResponse = await fetch(`${API_URL}/result/${requestId}`);
                const resultData = await resultResponse.json();
                
                if (resultData.status === 'completed') {
                    // Succès!
                    const rawKey = resultData.key;
                    const cleanedKey = cleanKey(rawKey);
                    
                    statusText.textContent = '✅ Bypass successful!';
                    document.querySelector('.bypass-loading').style.display = 'none';
                    
                    const isLink = isURL(cleanedKey);
                    
                    resultContainer.innerHTML = `
                        <div class="bypass-result">
                            <div class="bypass-key-text">🔑 Key: ${cleanedKey}</div>
                        </div>
                    `;
                    
                    // Ajouter le bouton copier
                    const buttonGroup = document.querySelector('.bypass-button-group');
                    const copyBtn = document.createElement('button');
                    copyBtn.className = 'bypass-copy-btn';
                    copyBtn.textContent = 'Copy Key';
                    copyBtn.onclick = () => {
                        copyToClipboard(cleanedKey).then(() => {
                            copyBtn.textContent = '✓ Copied!';
                            setTimeout(() => {
                                copyBtn.textContent = 'Copy Key';
                            }, 2000);
                        }).catch(() => {
                            alert('Failed to copy. Please copy manually.');
                        });
                    };
                    buttonGroup.insertBefore(copyBtn, buttonGroup.firstChild);
                    
                    // Si c'est un lien, démarrer le countdown
                    if (isLink) {
                        startRedirectCountdown(cleanedKey, resultContainer);
                    }
                    
                } else if (resultData.status === 'error') {
                    throw new Error(resultData.error || 'Unknown error occurred');
                } else {
                    // Toujours en attente
                    attempts++;
                    setTimeout(checkResult, 1000);
                }
            };
            
            await checkResult();
            
        } catch (error) {
            console.error('Bypass error:', error);
            statusText.textContent = '❌ Error';
            document.querySelector('.bypass-loading').style.display = 'none';
            
            resultContainer.innerHTML = `
                <div class="bypass-error">
                    ${error.message || 'An error occurred during bypass'}
                </div>
            `;
        }
    }

    // Initialiser quand la page est chargée
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createLockButton);
    } else {
        createLockButton();
    }

})();