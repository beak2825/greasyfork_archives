// ==UserScript==
// @name        TurboGPT
// @namespace   https://turbogpt.up.railway.app
// @match       *://turbowarp.org/*
// @match       *://turbowarp.org/editor*
// @match       *://studio.penguinmod.com/*
// @match       *://studio.penguinmod.com/editor.html*
// @icon        https://turbogpt.up.railway.app/images/logo.png
// @grant       GM_addElement
// @grant       GM_addStyle
// @grant       GM_xmlhttpRequest
// @license     MIT
// @version     2.2.0
// @author      WayflexOfficial
// @description  Tool for chatting with AI for Turbowarp/PenguinMod related tasks.
// @downloadURL https://update.greasyfork.org/scripts/553309/TurboGPT.user.js
// @updateURL https://update.greasyfork.org/scripts/553309/TurboGPT.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const currentVersion = '2.2.0';
    const versionUrl = 'https://turbogpt.up.railway.app/version.txt';
    const updateUrl = 'https://turbogpt.up.railway.app/userscript/turbogpt.user.js';

    async function checkForUpdate() {
        const currentVersion = '2.2.0';
        const versionUrl = 'https://turbogpt.up.railway.app/version.txt';
        const updateUrl = 'https://turbogpt.up.railway.app/userscript/turbogpt.user.js';

        try {
            GM_xmlhttpRequest({
                method: "GET",
                url: versionUrl,
                headers: { "Cache-Control": "no-cache" },
                onload: function(response) {
                    if (response.status !== 200) return;

                    const latestVersion = response.responseText.trim();
                    if (latestVersion && latestVersion !== currentVersion) {
                        showUpdateAlert(latestVersion);
                    }
                },
                onerror: function(error) {
                    console.error('Update check failed:', error);
                }
            });
        } catch (error) {
            console.error('Update check failed:', error);
        }
    }

    function showUpdateAlert(latestVersion) {
        if (localStorage.getItem('hideTurboGPTUpdate')) return;

        const updateMessage = `🚀 A new version (v${latestVersion}) of TurboGPT is available!`;

        const updateDiv = document.createElement('div');
        updateDiv.style.position = 'fixed';
        updateDiv.style.bottom = '20px';
        updateDiv.style.right = '20px';
        updateDiv.style.backgroundColor = '#ffcc00';
        updateDiv.style.padding = '15px';
        updateDiv.style.borderRadius = '10px';
        updateDiv.style.boxShadow = '0px 4px 10px rgba(0,0,0,0.3)';
        updateDiv.style.zIndex = '9999';
        updateDiv.style.textAlign = 'center';
        updateDiv.style.opacity = '0';
        updateDiv.style.transition = 'opacity 0.5s ease-in-out';

        updateDiv.innerHTML = `
            <p style="margin: 0; font-size: 14px; font-weight: bold; color: black;">
                ${updateMessage}
            </p>
            <div style="margin-top: 10px; display: flex; justify-content: space-between;">
                <button id="updateNow" style="
                    background-color: green;
                    color: white;
                    padding: 6px 12px;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    margin-right: 5px;">
                    Update Now
                </button>
                <button id="neverShowUpdate" style="
                    background-color: red;
                    color: white;
                    padding: 6px 12px;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;">
                    Never Show Again
                </button>
            </div>
        `;

        document.body.appendChild(updateDiv);


        setTimeout(() => {
            updateDiv.style.opacity = '1';
        }, 100);

        document.getElementById('updateNow').addEventListener('click', function() {
            window.open('https://turbogpt.up.railway.app/userscript/turbogpt.user.js', '_blank');
            updateDiv.remove();
        });

        document.getElementById('neverShowUpdate').addEventListener('click', function() {
            localStorage.setItem('hideTurboGPTUpdate', 'true');
            updateDiv.remove();
        });
    }

    function injectTurboGPTButton() {
        if (document.querySelector('#turboGPTButton') && document.querySelector('#githubStarButton')) {
            return;
        }

        var feedbackButton = document.querySelector('.menu-bar_feedback-link_1BnAR');
        if (!feedbackButton) {
            return;
        }


        var chatGPTButton = document.createElement('button');
        chatGPTButton.id = 'turboGPTButton';
        chatGPTButton.className = feedbackButton.className;
        chatGPTButton.innerText = 'TurboGPT';
        chatGPTButton.style.width = getComputedStyle(feedbackButton).width;
        chatGPTButton.style.height = getComputedStyle(feedbackButton).height;
        chatGPTButton.style.backgroundColor = '#ffffff';
        chatGPTButton.style.color = '#ff4c4c';
        chatGPTButton.style.border = 'none';
        chatGPTButton.style.marginLeft = '10px';
        chatGPTButton.style.borderRadius = '5px';
        chatGPTButton.style.cursor = 'pointer';
        chatGPTButton.style.transition = 'background-color 0.3s';

        chatGPTButton.onmouseover = function() {
            chatGPTButton.style.backgroundColor = '#ffffff';
        };
        chatGPTButton.onmouseout = function() {
            chatGPTButton.style.backgroundColor = '#ffffff';
        };

        var githubStarButton = document.createElement('button');
        githubStarButton.id = 'githubStarButton';
        githubStarButton.className = feedbackButton.className;
        githubStarButton.innerText = '⭐Star on GitHub';
        githubStarButton.style.width = getComputedStyle(feedbackButton).width;
        githubStarButton.style.height = getComputedStyle(feedbackButton).height;
        githubStarButton.style.backgroundColor = '#ffffff';
        githubStarButton.style.color = '#ff4c4c';
        githubStarButton.style.border = 'none';
        githubStarButton.style.marginLeft = '10px';
        githubStarButton.style.borderRadius = '5px';
        githubStarButton.style.cursor = 'pointer';
        githubStarButton.style.transition = 'background-color 0.3s';

        githubStarButton.onmouseover = function() {
            githubStarButton.style.backgroundColor = '#ffffff';
        };
        githubStarButton.onmouseout = function() {
            githubStarButton.style.backgroundColor = '#ffffff';
        };

        githubStarButton.addEventListener('click', function() {
            window.open('https://github.com/TurboGPT-Dev/TurboGPT', '_blank', 'noopener,noreferrer');
        });

        var isPopupOpen = false;
        var popupContainer;
        var chatMessages = JSON.parse(localStorage.getItem('chatMessages')) || [];

        function saveMessages() {
            localStorage.setItem('chatMessages', JSON.stringify(chatMessages));
        }



        function openPopup() {
            if (isPopupOpen) {
                popupContainer.style.display = 'flex';
                return;
            }

            popupContainer = document.createElement('div');
            popupContainer.style.position = 'fixed';
            popupContainer.style.top = localStorage.getItem('popupTop') || '50px';
            popupContainer.style.left = localStorage.getItem('popupLeft') || '50px';
            popupContainer.style.backgroundColor = 'white';
            popupContainer.style.padding = '10px';
            popupContainer.style.borderRadius = '10px';
            popupContainer.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.3)';
            popupContainer.style.zIndex = '9999';
            popupContainer.style.width = '450px';
            popupContainer.style.height = '400px';
            popupContainer.style.overflow = 'hidden';
            popupContainer.style.display = 'flex';
            popupContainer.style.flexDirection = 'column';

            var popupHeader = document.createElement('div');
            popupHeader.style.display = 'flex';
            popupHeader.style.alignItems = 'center';
            popupHeader.style.justifyContent = 'space-between';
            popupHeader.style.padding = '10px';
            popupHeader.style.cursor = 'move';
            popupHeader.style.backgroundColor = '#007bff';
            popupHeader.style.color = 'white';
            popupHeader.style.borderRadius = '10px 10px 0 0';
            popupHeader.style.borderBottom = '1px solid #ccc';
            popupHeader.innerHTML = `TurboGPT <span style="color: white; font-size: 14px;">v${currentVersion}</span>`;


            function applyDarkModeSettings() {
                const isDarkMode = localStorage.getItem('darkMode') === 'true';

                if (isDarkMode) {

                    popupContainer.style.backgroundColor = '#2c2c2c';
                    popupContainer.style.border = 'none';
                    chatWindow.style.backgroundColor = '#3a3a3a';
                    chatWindow.style.color = '#fff';
                    chatWindow.style.border = 'none';
                    userInput.style.backgroundColor = '#474747';
                    userInput.style.color = '#fff';
                    userInput.style.border = 'none';
                    modelDropdown.style.backgroundColor = '#505050';
                    modelDropdown.style.color = '#fff';
                    modelDropdown.style.border = 'none';


                    if (document.getElementById('analyzePopup')) {
                        document.getElementById('analyzePopup').style.backgroundColor = '#2c2c2c';
                        document.getElementById('analyzePopup').style.color = '#fff';
                        document.getElementById('analyzePopup').style.border = 'none';


                        document.querySelectorAll('#analyzePopup h2').forEach(el => {
                            el.style.color = '#ddd';
                        });

                        document.querySelectorAll('#analyzePopup p').forEach(el => {
                            el.style.color = '#bbb';
                        });
                    }

                    if (document.getElementById('spritePromptAnalyze')) {
                        document.getElementById('spritePromptAnalyze').style.backgroundColor = '#474747';
                        document.getElementById('spritePromptAnalyze').style.color = '#fff';
                        document.getElementById('spritePromptAnalyze').style.border = 'none';
                    }

                    if (document.getElementById('dropArea')) {
                        document.getElementById('dropArea').style.backgroundColor = '#3a3a3a';
                        document.getElementById('dropArea').style.color = '#ddd';
                        document.getElementById('dropArea').style.border = '2px dashed #aaa';
                    }

                    darkModeButton.innerText = '☀️ Light';
                } else {

                    popupContainer.style.backgroundColor = 'white';
                    popupContainer.style.border = '1px solid #ccc';
                    chatWindow.style.backgroundColor = '#f9f9f9';
                    chatWindow.style.color = '#000';
                    chatWindow.style.border = '1px solid #ccc';
                    userInput.style.backgroundColor = 'white';
                    userInput.style.color = '#000';
                    userInput.style.border = '1px solid #ccc';
                    modelDropdown.style.backgroundColor = 'white';
                    modelDropdown.style.color = '#000';
                    modelDropdown.style.border = '1px solid #ccc';


                    if (document.getElementById('analyzePopup')) {
                        document.getElementById('analyzePopup').style.backgroundColor = '#fff';
                        document.getElementById('analyzePopup').style.color = '#000';
                        document.getElementById('analyzePopup').style.border = '1px solid #ccc';


                        document.querySelectorAll('#analyzePopup h2').forEach(el => {
                            el.style.color = '#333';
                        });

                        document.querySelectorAll('#analyzePopup p').forEach(el => {
                            el.style.color = '#555';
                        });
                    }

                    if (document.getElementById('spritePromptAnalyze')) {
                        document.getElementById('spritePromptAnalyze').style.backgroundColor = 'white';
                        document.getElementById('spritePromptAnalyze').style.color = '#000';
                        document.getElementById('spritePromptAnalyze').style.border = '1px solid #ccc';
                    }

                    if (document.getElementById('dropArea')) {
                        document.getElementById('dropArea').style.backgroundColor = '#f8f9fa';
                        document.getElementById('dropArea').style.color = '#007bff';
                        document.getElementById('dropArea').style.border = '2px dashed #007bff';
                    }

                    darkModeButton.innerText = '🌙 Dark';
                }
            }


            function toggleDarkMode() {
                const isDarkMode = localStorage.getItem('darkMode') === 'true';
                localStorage.setItem('darkMode', !isDarkMode);
                applyDarkModeSettings();
            }


            var darkModeButton = document.createElement('button');
            darkModeButton.innerText = '🌙 Dark Mode';
            darkModeButton.style.cursor = 'pointer';
            darkModeButton.style.backgroundColor = '#343a40';
            darkModeButton.style.border = 'none';
            darkModeButton.style.color = 'white';
            darkModeButton.style.fontSize = '14px';
            darkModeButton.style.width = '100px';
            darkModeButton.style.height = '30px';
            darkModeButton.style.borderRadius = '5px';
            darkModeButton.style.marginLeft = '5px';
            darkModeButton.style.transition = 'background-color 0.3s';

            darkModeButton.onmouseover = function () {
                darkModeButton.style.backgroundColor = '#495057';
            };
            darkModeButton.onmouseout = function () {
                darkModeButton.style.backgroundColor = '#343a40';
            };

            darkModeButton.addEventListener('click', toggleDarkMode);


            var apiKeyButton = document.createElement('button');
            apiKeyButton.innerText = 'API KEY';
            apiKeyButton.style.cursor = 'pointer';
            apiKeyButton.style.backgroundColor = '#ffc107';
            apiKeyButton.style.border = 'none';
            apiKeyButton.style.color = 'white';
            apiKeyButton.style.fontSize = '14px';
            apiKeyButton.style.width = '70px';
            apiKeyButton.style.height = '30px';
            apiKeyButton.style.borderRadius = '5px';
            apiKeyButton.style.marginLeft = '5px';
            apiKeyButton.style.transition = 'background-color 0.3s';

            apiKeyButton.onmouseover = function() {
                apiKeyButton.style.backgroundColor = '#e0a800';
            };
            apiKeyButton.onmouseout = function() {
                apiKeyButton.style.backgroundColor = '#ffc107';
            };


            apiKeyButton.addEventListener('click', async function() {
                var newApiKey = prompt('Enter your Gemini API Key:', localStorage.getItem('geminiApiKey') || '');

                if (newApiKey !== null && newApiKey.trim() !== '') {
                    newApiKey = newApiKey.trim();
                    if (await validateApiKey(newApiKey)) {
                        localStorage.setItem('geminiApiKey', newApiKey);
                        alert('✅ API Key saved and validated successfully!');
                    } else {
                        alert('❌ Invalid API Key. Please enter a valid Gemini API Key.');
                    }
                }
            });


            async function validateApiKey(apiKey) {
                try {
                    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            contents: [{ role: "user", parts: [{ text: "Hello" }] }]
                        })
                    });

                    if (!response.ok) {
                        return false;
                    }

                    const data = await response.json();
                    return data?.candidates?.length > 0;
                } catch (error) {
                    console.error('API Key Validation Error:', error);
                    return false;
                }
            }

            var closeButton = document.createElement('button');
            closeButton.innerHTML = '&times;';
            closeButton.style.cursor = 'pointer';
            closeButton.style.backgroundColor = '#dc3545';
            closeButton.style.border = 'none';
            closeButton.style.color = 'white';
            closeButton.style.fontSize = '20px';
            closeButton.style.width = '30px';
            closeButton.style.height = '30px';
            closeButton.style.borderRadius = '5px';
            closeButton.style.transition = 'background-color 0.3s';

            closeButton.onmouseover = function() {
                closeButton.style.backgroundColor = '#c82333';
            };
            closeButton.onmouseout = function() {
                closeButton.style.backgroundColor = '#dc3545';
            };

            closeButton.addEventListener('click', function() {
                popupContainer.style.display = 'none';
                isPopupOpen = false;
                saveMessages();
            });

            popupHeader.appendChild(apiKeyButton);
            popupHeader.appendChild(darkModeButton);
            popupHeader.appendChild(closeButton);

            var chatWindow = document.createElement('div');
            chatWindow.style.flex = '1';
            chatWindow.style.width = '100%';
            chatWindow.style.marginTop = '10px';
            chatWindow.style.border = '1px solid #ccc';
            chatWindow.style.overflowY = 'auto';
            chatWindow.style.padding = '5px';
            chatWindow.style.boxSizing = 'border-box';
            chatWindow.style.backgroundColor = '#f9f9f9';
            chatWindow.style.borderRadius = '5px';


            chatMessages = JSON.parse(localStorage.getItem('chatMessages')) || [];

            chatMessages.forEach(message => {
                var messageElement = document.createElement('div');
                messageElement.classList.add('message');
                messageElement.innerHTML = message;
                messageElement.style.border = '1px solid #ccc';
                messageElement.style.padding = '5px';
                messageElement.style.marginBottom = '5px';
                messageElement.style.width = '100%';
                messageElement.style.boxSizing = 'border-box';
                messageElement.style.borderRadius = '5px';
                messageElement.style.animation = 'fadeIn 0.5s';
                chatWindow.appendChild(messageElement);
            });

            var userInput = document.createElement('input');
            userInput.type = 'text';
            userInput.placeholder = 'Message TurboGPT...';
            userInput.style.width = '100%';
            userInput.style.marginTop = '10px';
            userInput.style.padding = '10px';
            userInput.style.border = '1px solid #ccc';
            userInput.style.borderRadius = '5px';
            userInput.style.boxSizing = 'border-box';

            var buttonContainer = document.createElement('div');
            buttonContainer.style.display = 'flex';
            buttonContainer.style.justifyContent = 'space-between';
            buttonContainer.style.marginTop = '10px';

            var sendButtonContainer = document.createElement('div');
            var shadowRoot = sendButtonContainer.attachShadow({ mode: 'open' });

            var bulmaLink = document.createElement('link');
            bulmaLink.rel = 'stylesheet';
            bulmaLink.href = 'https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css';
            shadowRoot.appendChild(bulmaLink);

            var customStyle = document.createElement('style');
            customStyle.textContent = `
              .button {
                  padding: 10px 20px !important;
                  background-color: #28a745 !important;
                  color: white !important;
                  border: none !important;
                  border-radius: 5px !important;
                  cursor: pointer !important;
                  flex: 1 !important;
                  margin-left: 5px !important;
                  transition: background-color 0.3s !important;
                  height: auto !important;
              }
            `;
            shadowRoot.appendChild(customStyle);

            var sendButton = document.createElement('button');
            sendButton.innerText = 'Send';
            sendButton.style.padding = '10px 20px';
            sendButton.style.backgroundColor = '#28a745';
            sendButton.style.color = 'white';
            sendButton.style.border = 'none';
            sendButton.style.borderRadius = '5px';
            sendButton.style.cursor = 'pointer';
            sendButton.style.flex = '1';
            sendButton.style.marginLeft = '5px';
            sendButton.style.transition = 'background-color 0.3s';
            sendButton.classList.add('button', 'is-primary');

            sendButton.onmouseover = function() {
                sendButton.style.backgroundColor = '#218838';
            };
            sendButton.onmouseout = function() {
                sendButton.style.backgroundColor = '#28a745';
            };

            var clearButton = document.createElement('button');
            clearButton.innerText = 'Clear';
            clearButton.style.padding = '10px 20px';
            clearButton.style.backgroundColor = '#ffc107';
            clearButton.style.color = 'white';
            clearButton.style.border = 'none';
            clearButton.style.borderRadius = '5px';
            clearButton.style.cursor = 'pointer';
            clearButton.style.flex = '1';
            clearButton.style.marginLeft = '5px';
            clearButton.style.transition = 'background-color 0.3s';

            clearButton.onmouseover = function() {
                clearButton.style.backgroundColor = '#e0a800';
            };
            clearButton.onmouseout = function() {
                clearButton.style.backgroundColor = '#ffc107';
            };

            clearButton.addEventListener('click', function() {
                chatMessages = [];
                localStorage.removeItem('chatMessages');
                while (chatWindow.firstChild) {
                    chatWindow.removeChild(chatWindow.firstChild);
                }
            });

            var analyzeSpriteButton = document.createElement('button');
            analyzeSpriteButton.innerText = 'Analyze Code';
            analyzeSpriteButton.style.padding = '10px 20x';
            analyzeSpriteButton.style.backgroundColor = '#17a2b8';
            analyzeSpriteButton.style.color = 'white';
            analyzeSpriteButton.style.border = 'none';
            analyzeSpriteButton.style.borderRadius = '5px';
            analyzeSpriteButton.style.cursor = 'pointer';
            analyzeSpriteButton.style.flex = '2';
            analyzeSpriteButton.style.marginLeft = '5px';
            analyzeSpriteButton.style.transition = 'background-color 0.3s';

            analyzeSpriteButton.onmouseover = function() {
                analyzeSpriteButton.style.backgroundColor = '#138496';
            };
            analyzeSpriteButton.onmouseout = function() {
                analyzeSpriteButton.style.backgroundColor = '#17a2b8';
            };

            analyzeSpriteButton.addEventListener('click', async function() {

                if (document.getElementById('analyzePopup')) return;


                const overlay = document.createElement('div');
                overlay.id = 'analyzeOverlay';
                overlay.style.position = 'fixed';
                overlay.style.top = '0';
                overlay.style.left = '0';
                overlay.style.width = '100%';
                overlay.style.height = '100%';
                overlay.style.background = 'rgba(0, 0, 0, 0.5)';
                overlay.style.zIndex = '9999';
                overlay.style.display = 'flex';
                overlay.style.justifyContent = 'center';
                overlay.style.alignItems = 'center';
                document.body.appendChild(overlay);


                const popup = document.createElement('div');
                popup.id = 'analyzePopup';
                popup.style.background = '#fff';
                popup.style.padding = '20px';
                popup.style.borderRadius = '10px';
                popup.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
                popup.style.width = '400px';
                popup.style.textAlign = 'center';
                popup.style.position = 'relative';
                popup.style.display = 'flex';
                popup.style.flexDirection = 'column';
                popup.style.gap = '10px';
                popup.style.overflow = 'hidden';
                popup.style.transition = 'transform 0.2s ease-in-out, opacity 0.2s';
                popup.style.transform = 'scale(1)';
                overlay.appendChild(popup);


                popup.innerHTML = `
                    <h2 style="margin: 0; font-size: 1.5rem; color: #333;">Analyze Code</h2>
                    <p style="font-size: 0.9rem; color: #666;">Upload a screenshot of your sprite code for analysis. (The model will be set to Gemini 1.5 Pro by default!)</p>

                    <textarea id="spritePromptAnalyze" placeholder="Enter your prompt..." rows="6"
                        style="width: 100%; padding: 10px; border: 1px solid #cccccc; border-radius: 5px; font-size: 1rem; box-sizing: border-box; resize: none; height: 140px;"></textarea>

                    <div id="dropArea" style="
                        border: 2px dashed #007bff;
                        padding: 20px;
                        cursor: pointer;
                        text-align: center;
                        font-size: 0.9rem;
                        color: #007bff;
                        border-radius: 5px;
                        background: #f8f9fa;
                    ">
                        Select or Paste a Screenshot Here
                        <input type="file" id="spriteImage" accept="image/*" style="display: none;">
                    </div>

                    <div style="display: flex; justify-content: space-between; margin-top: 15px;">
                        <button id="analyzeConfirm" style="
                            flex: 1; background: green; color: white; padding: 10px;
                            border: none; cursor: pointer; border-radius: 5px; font-size: 1rem;">Analyze</button>
                        <button id="analyzeClose" style="
                            flex: 1; background: red; color: white; padding: 10px;
                            border: none; cursor: pointer; border-radius: 5px; font-size: 1rem; margin-left: 10px;">Cancel</button>
                    </div>
                `;

                applyDarkModeSettings();

                const spriteImageInput = document.getElementById('spriteImage');
                const dropArea = document.getElementById('dropArea');

                function handlePopupPaste(e) {
                  const clipboardItems = e.clipboardData.items;
                  for (let item of clipboardItems) {
                    if (item.type.indexOf('image') !== -1) {
                      const blob = item.getAsFile();
                      const dt = new DataTransfer();
                      dt.items.add(blob);
                      spriteImageInput.files = dt.files;
                      handleImageUpload();
                      break;
                    }
                  }
                }

                document.addEventListener('paste', handlePopupPaste);

                dropArea.addEventListener('click', () => spriteImageInput.click());
                spriteImageInput.addEventListener('change', handleImageUpload);
                dropArea.addEventListener('dragover', (e) => {
                  e.preventDefault();
                  dropArea.style.background = '#e3f2fd';
                });
                dropArea.addEventListener('dragleave', () => {
                  dropArea.style.background = '#f8f9fa';
                });
                dropArea.addEventListener('drop', (e) => {
                  e.preventDefault();
                  dropArea.style.background = '#f8f9fa';
                  if (e.dataTransfer.files.length > 0) {
                    spriteImageInput.files = e.dataTransfer.files;
                    handleImageUpload();
                  }
                });

                function closeAnalyzePopup() {
                  document.removeEventListener('paste', handlePopupPaste);
                  overlay.style.opacity = '0';
                  setTimeout(() => {
                    document.body.removeChild(overlay);
                  }, 200);
                }

                overlay.addEventListener('click', function(event) {
                  if (event.target === overlay) closeAnalyzePopup();
                });
                document.getElementById('analyzeClose').addEventListener('click', closeAnalyzePopup);


                overlay.addEventListener('click', function(event) {
                    if (event.target === overlay) closeAnalyzePopup();
                });

                document.getElementById('analyzeClose').addEventListener('click', closeAnalyzePopup);


                spriteImageInput.addEventListener('change', handleImageUpload);


                dropArea.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    dropArea.style.background = '#e3f2fd';
                });

                dropArea.addEventListener('dragleave', () => {
                    dropArea.style.background = '#f8f9fa';
                });

                dropArea.addEventListener('drop', (e) => {
                    e.preventDefault();
                    dropArea.style.background = '#f8f9fa';
                    if (e.dataTransfer.files.length > 0) {
                        spriteImageInput.files = e.dataTransfer.files;
                        handleImageUpload();
                    }
                });


                function handleImageUpload() {
                    if (spriteImageInput.files.length > 0) {
                        dropArea.innerText = 'Image selected!';
                        dropArea.style.color = 'green';
                    }
                }

                document.getElementById('analyzeConfirm').addEventListener('click', async function() {
                    const userPrompt = document.getElementById('spritePromptAnalyze').value.trim();
                    const file = spriteImageInput.files[0];

                    if (!userPrompt) {
                        alert('Please enter a prompt.');
                        return;
                    }

                    if (!file) {
                        alert('Please upload an image.');
                        return;
                    }

                    const reader = new FileReader();

                    reader.onload = async function(event) {
                        const base64Image = event.target.result.split(',')[1];

                        const apiKey = localStorage.getItem('geminiApiKey')?.trim();
                        if (!apiKey) {
                            alert('Please enter your Gemini API key using the API KEY button.');
                            return;
                        }


                        const userMessageVisible = `${userPrompt}: [image]`;
                        chatMessages.push('<span class="user-prefix" style="color: green;">You:</span> ' + formatText(userMessageVisible));
                        const messageElement = document.createElement('div');
                        messageElement.classList.add('message');
                        messageElement.innerHTML = '<span class="user-prefix" style="color: green;">You:</span> ' + formatText(userMessageVisible);
                        messageElement.style.border = '1px solid #ccc';
                        messageElement.style.padding = '10px';
                        messageElement.style.marginBottom = '10px';
                        messageElement.style.borderRadius = '5px';
                        chatWindow.appendChild(messageElement);
                        saveMessages();
                        chatWindow.scrollTop = chatWindow.scrollHeight;

                        closeAnalyzePopup();

                        try {
                            const url = `https://generativelanguage.googleapis.com/v1beta/models/learnlm-1.5-pro-experimental:generateContent?key=${apiKey}`;

                            const headers = { "Content-Type": "application/json" };

                            const payload = {
                                "contents": [{
                                    "parts": [
                                        { "text": userPrompt },
                                        { "inline_data": { "mime_type": "image/png", "data": base64Image } }
                                    ]
                                }]
                            };

                            const response = await fetch(url, {
                                method: 'POST',
                                headers: headers,
                                body: JSON.stringify(payload)
                            });

                            const data = await response.json();

                            if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
                                const aiResponse = data.candidates[0].content.parts[0].text;

                                chatMessages.push('<span class="gpt-prefix" style="color: red;">TurboGPT:</span> ' + formatText(aiResponse));
                                const responseMessage = document.createElement('div');
                                responseMessage.classList.add('message');
                                responseMessage.innerHTML = '<span class="gpt-prefix" style="color: red;">TurboGPT:</span> ' + formatText(aiResponse);
                                responseMessage.style.border = '1px solid #ccc';
                                responseMessage.style.padding = '10px';
                                responseMessage.style.marginBottom = '10px';
                                responseMessage.style.borderRadius = '5px';
                                chatWindow.appendChild(responseMessage);
                                saveMessages();
                                chatWindow.scrollTop = chatWindow.scrollHeight;
                            }
                        } catch (error) {
                            console.error('Error:', error);
                        }
                    };

                    reader.readAsDataURL(file);
                });
            });

            var modelDropdown = document.createElement('select');
            modelDropdown.style.marginTop = '10px';
            modelDropdown.style.padding = '10px';
            modelDropdown.style.border = '1px solid #ccc';
            modelDropdown.style.borderRadius = '5px';
            modelDropdown.style.width = '100%';

            var models = [
                { value: 'gemini-1.5-pro', text: 'Gemini 1.5 Pro (Code & Logic)' },
                { value: 'gemini-1.5-flash', text: 'Gemini 1.5 Flash (Quick Output)' },
                { value: 'gemini-1.5-flash-8b', text: 'Gemini 1.5 Flash-8B (Efficient Variant)' },
                { value: 'gemini-2.0-flash', text: 'Gemini 2.0 Flash (Enhanced Reasoning)' },
            ];

            models.forEach(model => {
                var option = document.createElement('option');
                option.value = model.value;
                option.text = model.text;
                modelDropdown.appendChild(option);
            });


            function dragElement(element, dragHandle) {
                var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
                dragHandle.onmousedown = dragMouseDown;

                function dragMouseDown(e) {
                    e = e || window.event;
                    e.preventDefault();
                    pos3 = e.clientX;
                    pos4 = e.clientY;
                    document.onmouseup = closeDragElement;
                    document.onmousemove = elementDrag;
                }

                function elementDrag(e) {
                    e = e || window.event;
                    e.preventDefault();
                    pos1 = pos3 - e.clientX;
                    pos2 = pos4 - e.clientY;
                    pos3 = e.clientX;
                    pos4 = e.clientY;

                    var newTop = element.offsetTop - pos2;
                    var newLeft = element.offsetLeft - pos1;

                    if (newTop < 0) newTop = 0;
                    if (newLeft < 0) newLeft = 0;
                    if (newTop + element.offsetHeight > window.innerHeight) newTop = window.innerHeight - element.offsetHeight;
                    if (newLeft + element.offsetWidth > window.innerWidth) newLeft = window.innerWidth - element.offsetWidth;

                    element.style.top = newTop + "px";
                    element.style.left = newLeft + "px";
                }

                function closeDragElement() {
                    document.onmouseup = null;
                    document.onmousemove = null;
                    localStorage.setItem('popupTop', element.style.top);
                    localStorage.setItem('popupLeft', element.style.left);
                }
            }

            dragElement(popupContainer, popupHeader);


            function formatText(text) {
              text = text
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/`([^`]+)`/g, '<code>$1</code>')
                .replace(/"(.*?)"/g, '<span style="color: #639cff; font-style: italic;">"$1"</span>');

              let blocks = text.split(/\n\s*\n/);

              blocks = blocks.map(block => {
                let lines = block.split('\n').map(line => line.trim()).filter(line => line !== '');
                if (lines.every(line => /^\d+\./.test(line))) {
                  let listItems = lines.map(line => {
                    let content = line.replace(/^\d+\.\s*/, '');
                    return `<li>${content}</li>`;
                  });
                  return `<ol>${listItems.join('')}</ol>`;
                }
                else if (lines.every(line => /^[-*]\s/.test(line))) {
                  let listItems = lines.map(line => {
                    let content = line.replace(/^[-*]\s*/, '');
                    return `<li>${content}</li>`;
                  });
                  return `<ul>${listItems.join('')}</ul>`;
                }
                else {
                  let html = block.replace(/\n/g, '<br>');
                  return `<p>${html}</p>`;
                }
              });

              return blocks.join('');
            }


            function addMessageToChat(role, messageText) {
                const formattedMessage = formatText(messageText);

                const messageElement = document.createElement('div');
                messageElement.classList.add('message');

                if (role === "user") {
                    messageElement.innerHTML = '<span class="user-prefix" style="color: green;">You:</span> ' + formattedMessage;
                } else {
                    messageElement.innerHTML = '<span class="gpt-prefix" style="color: red;">TurboGPT:</span> ' + formattedMessage;
                }

                messageElement.style.border = '1px solid #ccc';
                messageElement.style.padding = '10px';
                messageElement.style.marginBottom = '10px';
                messageElement.style.borderRadius = '5px';
                messageElement.style.animation = 'fadeIn 0.5s';
                chatWindow.appendChild(messageElement);

                saveMessages();
                chatWindow.scrollTop = chatWindow.scrollHeight;
            }

            function saveMessages() {
                localStorage.setItem('chatMessages', JSON.stringify(chatMessages));
            }

            async function sendMessage() {
                sendButton.classList.add('is-loading');
                sendButton.disabled = true;

                const userMessage = userInput.value.trim();
                if (!userMessage) {
                    alert("You have to enter a prompt.");
                    sendButton.classList.remove('is-loading');
                    sendButton.disabled = false;
                    return;
                }

                const selectedModel = modelDropdown.value;
                const apiKey = localStorage.getItem('geminiApiKey')?.trim();
                if (!apiKey) {
                    alert('Please enter your Gemini API key using the API KEY button.');
                    return;
                }


                chatMessages.push('<span class="user-prefix" style="color: green;">You:</span> ' + formatText(userMessage));
                var messageElement = document.createElement('div');
                messageElement.classList.add('message');
                messageElement.innerHTML = '<span class="user-prefix" style="color: green;">You:</span> ' + formatText(userMessage);
                messageElement.style.border = '1px solid #ccc';
                messageElement.style.padding = '10px';
                messageElement.style.marginBottom = '10px';
                messageElement.style.borderRadius = '5px';
                chatWindow.appendChild(messageElement);
                userInput.value = '';
                saveMessages();
                chatWindow.scrollTop = chatWindow.scrollHeight;

                try {

                    const payload = {
                      contents: [
                        { role: "user", parts: [{ text: userMessage }] }
                      ]
                    };

                    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/${selectedModel}:generateContent?key=${apiKey}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });

                    if (!response.ok) {
                        throw new Error(`Error ${response.status}: ${response.statusText}`);
                    }

                    const data = await response.json();
                    const geminiResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response received.";

                    chatMessages.push('<span class="gpt-prefix" style="color: red;">TurboGPT (' + selectedModel + '):</span> ' + formatText(geminiResponse));
                    var responseMessage = document.createElement('div');
                    responseMessage.classList.add('message');
                    responseMessage.innerHTML = '<span class="gpt-prefix" style="color: red;">TurboGPT (' + selectedModel + '):</span> ' + formatText(geminiResponse);
                    responseMessage.style.border = '1px solid #ccc';
                    responseMessage.style.padding = '10px';
                    responseMessage.style.marginBottom = '10px';
                    responseMessage.style.borderRadius = '5px';
                    chatWindow.appendChild(responseMessage);
                    saveMessages();
                    chatWindow.scrollTop = chatWindow.scrollHeight;
                } catch (error) {
                    console.error('Error:', error);
                    chatMessages.push('Error: ' + error.message);
                    var errorMessage = document.createElement('div');
                    errorMessage.classList.add('message');
                    errorMessage.innerHTML = 'Error: ' + error.message;
                    errorMessage.style.border = '1px solid #e57373';
                    errorMessage.style.padding = '10px';
                    errorMessage.style.marginBottom = '10px';
                    errorMessage.style.borderRadius = '5px';
                    chatWindow.appendChild(errorMessage);
                    saveMessages();
                } finally {
                    sendButton.classList.remove('is-loading');
                    sendButton.disabled = false;
                }
            }

            sendButton.addEventListener('click', sendMessage);
            shadowRoot.appendChild(sendButton);

            userInput.addEventListener('keydown', function(event) {
                if (event.key === 'Enter') {
                    sendMessage();
                }
            });

            buttonContainer.appendChild(sendButtonContainer);
            buttonContainer.appendChild(clearButton);
            buttonContainer.appendChild(analyzeSpriteButton);

            popupContainer.appendChild(popupHeader);
            popupContainer.appendChild(chatWindow);
            popupContainer.appendChild(modelDropdown);
            popupContainer.appendChild(userInput);
            popupContainer.appendChild(buttonContainer);

            document.body.appendChild(popupContainer);

            applyDarkModeSettings();

            isPopupOpen = true;
        }

        chatGPTButton.addEventListener('click', openPopup);
        feedbackButton.parentNode.insertBefore(chatGPTButton, feedbackButton.nextSibling);
        feedbackButton.parentNode.insertBefore(githubStarButton, chatGPTButton.nextSibling);
    }

    checkForUpdate();
    injectTurboGPTButton();

    var observer = new MutationObserver(() => {
        injectTurboGPTButton();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    document.addEventListener('contextmenu', function(event) {
        event.preventDefault();
    });
})();

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = `
@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}
.message {
    animation: fadeIn 0.5s;
}
`;
document.head.appendChild(styleSheet);