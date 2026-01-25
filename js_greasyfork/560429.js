// ==UserScript==
// @name         Torn Hire CR Merc [**]
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Hire a CR Merc Instantly (Desktop + PDA)
// @author       ShAdOwCrEsT [3929345]
// @match        https://www.torn.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @connect      api.torn.com
// @connect      merc.shadowcrest96.workers.dev
// @downloadURL https://update.greasyfork.org/scripts/560429/Torn%20Hire%20CR%20Merc%20%5B%2A%2A%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/560429/Torn%20Hire%20CR%20Merc%20%5B%2A%2A%5D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CLOUDFLARE_PROXY_URL = 'https://merc.shadowcrest96.workers.dev';
    const mercCooldowns = {};

    function isOnCooldown(targetId) {
        if (mercCooldowns[targetId]) {
            const timeLeft = mercCooldowns[targetId] - Date.now();
            if (timeLeft > 0) {
                const minutesLeft = Math.ceil(timeLeft / 60000);
                return minutesLeft;
            } else {
                delete mercCooldowns[targetId];
            }
        }
        return false;
    }

    function setCooldown(targetId) {
        mercCooldowns[targetId] = Date.now() + (5 * 60 * 1000);
    }

    function getApiKey() {
        let apiKey = GM_getValue('torn_api_key', '');
        if (!apiKey) {
            apiKey = prompt('Please enter your Public Torn API key:');
            if (apiKey) {
                GM_setValue('torn_api_key', apiKey);
            }
        }
        return apiKey;
    }

    function getUserData(apiKey, callback) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: `https://api.torn.com/user/?selections=basic&key=${apiKey}`,
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    callback(data);
                } catch (e) {
                    console.error('Failed to parse user data:', e);
                    callback(null);
                }
            },
            onerror: function() {
                console.error('Failed to fetch user data');
                callback(null);
            }
        });
    }

    function getTargetData(targetId, apiKey, callback) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: `https://api.torn.com/v2/user/${targetId}/profile?striptags=true&key=${apiKey}`,
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    if (data.error) {
                        callback(null, 'Invalid ID, check userid and try again');
                    } else {
                        callback(data.profile, null);
                    }
                } catch (e) {
                    console.error('Failed to parse target data:', e);
                    callback(null, 'Failed to parse data');
                }
            },
            onerror: function() {
                console.error('Failed to fetch target data');
                callback(null, 'Network error');
            }
        });
    }

    function sendToCloudflareProxy(requesterId, requesterName, requesterUrl, targetId, targetUrl, targetName, targetLevel, targetStatus) {
        const payload = {
            requesterId: requesterId,
            requesterName: requesterName,
            requesterUrl: requesterUrl,
            targetId: targetId,
            targetUrl: targetUrl,
            targetName: targetName,
            targetLevel: targetLevel,
            targetStatus: targetStatus
        };

        GM_xmlhttpRequest({
            method: 'POST',
            url: CLOUDFLARE_PROXY_URL,
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(payload),
            onload: function(response) {
                try {
                    const result = JSON.parse(response.responseText);
                    if (result.success) {
                        console.log('Request sent successfully through Cloudflare proxy');
                    } else {
                        console.error('Cloudflare proxy error:', result.error);
                        alert('Failed to send request. Please try again.');
                    }
                } catch (e) {
                    console.error('Failed to parse proxy response:', e);
                }
            },
            onerror: function(error) {
                console.error('Failed to send to Cloudflare proxy:', error);
                alert('Network error. Please check your connection.');
            }
        });
    }

    function createMobileDropdown(apiKey) {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            z-index: 99999;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        const dropdownBox = document.createElement('div');
        dropdownBox.style.cssText = `
            background: #2a2a2a;
            border: 2px solid #87CEEB;
            border-radius: 8px;
            padding: 20px;
            width: 80%;
            max-width: 300px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
        `;

        const selfMercOption = document.createElement('button');
        selfMercOption.textContent = 'Self Merc';
        selfMercOption.style.cssText = `
            display: block;
            width: 100%;
            padding: 15px 20px;
            margin: 10px 0;
            background: #87CEEB;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
            font-size: 16px;
            color: #000;
        `;

        const otherOption = document.createElement('button');
        otherOption.textContent = 'Merc Other';
        otherOption.style.cssText = `
            display: block;
            width: 100%;
            padding: 15px 20px;
            margin: 10px 0;
            background: #87CEEB;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
            font-size: 16px;
            color: #000;
        `;

        selfMercOption.onclick = function() {
            overlay.remove();

            getUserData(apiKey, function(userData) {
                if (!userData || !userData.player_id) {
                    alert('Failed to fetch user data. Please check your API key.');
                    return;
                }

                const cooldownLeft = isOnCooldown(userData.player_id);
                if (cooldownLeft) {
                    alert(`Please wait ${cooldownLeft} minute(s) before requesting self merc again.`);
                    return;
                }

                const finalTargetId = userData.player_id;
                const requesterProfileUrl = `https://www.torn.com/profiles.php?XID=${userData.player_id}`;
                const targetProfileUrl = `https://www.torn.com/profiles.php?XID=${finalTargetId}`;

                sendToCloudflareProxy(
                    userData.player_id,
                    userData.name,
                    requesterProfileUrl,
                    finalTargetId,
                    targetProfileUrl,
                    userData.name,
                    userData.level,
                    'Self'
                );
                setCooldown(finalTargetId);
                alert('Your request has been transferred, Please pay 4 xanax to the merc.');
            });
        };

        otherOption.onclick = function() {
            overlay.remove();
            const targetId = prompt('Enter the User ID of the person you want merc\'d:\n\nCost: 4 Xanax');

            if (!targetId || targetId.trim() === '') {
                return;
            }

            if (!/^\d+$/.test(targetId.trim())) {
                alert('Invalid User ID! Please enter numbers only.');
                return;
            }

            getUserData(apiKey, function(userData) {
                if (userData && userData.player_id && userData.name) {
                    getTargetData(targetId.trim(), apiKey, function(targetData, error) {
                        if (error || !targetData) {
                            alert(`Invalid User ID: ${error || 'User not found'}`);
                            return;
                        }

                        const cooldownLeft = isOnCooldown(targetId.trim());
                        if (cooldownLeft) {
                            alert(`Please wait ${cooldownLeft} minute(s) before requesting merc for this person again.`);
                            return;
                        }

                        const finalTargetId = targetId.trim();
                        const requesterProfileUrl = `https://www.torn.com/profiles.php?XID=${userData.player_id}`;
                        const targetProfileUrl = `https://www.torn.com/profiles.php?XID=${finalTargetId}`;

                        sendToCloudflareProxy(
                            userData.player_id,
                            userData.name,
                            requesterProfileUrl,
                            finalTargetId,
                            targetProfileUrl,
                            targetData.name,
                            targetData.level,
                            targetData.status?.description || 'Unknown'
                        );
                        setCooldown(finalTargetId);
                        alert('Your request has been transferred, Please pay 4 xanax to the merc.');
                    });
                } else {
                    alert('Failed to fetch user data. Please check your API key.');
                    GM_setValue('torn_api_key', '');
                }
            });
        };

        dropdownBox.appendChild(selfMercOption);
        dropdownBox.appendChild(otherOption);
        overlay.appendChild(dropdownBox);

        overlay.onclick = function(e) {
            if (e.target === overlay) {
                overlay.remove();
            }
        };

        document.body.appendChild(overlay);
    }

    function addProfileMercButton() {
        const urlParams = new URLSearchParams(window.location.search);
        const targetXID = urlParams.get('XID');

        if (!targetXID) return;

        const checkInterval = setInterval(() => {
            const buttonsList = document.querySelector('.buttons-list');

            if (buttonsList) {
                clearInterval(checkInterval);

                const buttonCount = buttonsList.querySelectorAll('.profile-button').length;

                if (buttonCount <= 2) {
                    return;
                }

                if (document.getElementById('merc-profile-button')) {
                    return;
                }

                const mercButton = document.createElement('a');
                mercButton.id = 'merc-profile-button';
                mercButton.className = 'profile-button profile-button-merc active';
                mercButton.setAttribute('role', 'button');
                mercButton.setAttribute('aria-label', 'Request Merc Service');
                mercButton.style.cssText = 'touch-action: manipulation; cursor: pointer;';

                mercButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="46" height="46" viewBox="0 0 46 46" class="icon___oJODA">
        <defs>
            <filter id="greyscale-filter">
                <feColorMatrix type="saturate" values="0"/>
                <feComponentTransfer>
                    <feFuncR type="linear" slope="1.0"/>
                    <feFuncG type="linear" slope="1.0"/>
                    <feFuncB type="linear" slope="1.0"/>
                </feComponentTransfer>
            </filter>
        </defs>
        <image href="https://factionimages.torn.com/8ec407bb-731b-d8be-1884314.png" x="-69" y="-69" width="184" height="184" filter="url(#greyscale-filter)" opacity="0.7"/>
    </svg>
`;
                mercButton.onclick = function(e) {
                    e.preventDefault();

                    const apiKey = getApiKey();
                    if (!apiKey) {
                        alert('API key is required!');
                        return;
                    }

                    const cooldownLeft = isOnCooldown(targetXID);
                    if (cooldownLeft) {
                        alert(`Please wait ${cooldownLeft} minute(s) before requesting merc for this person again.`);
                        return;
                    }

                    const confirmMerc = confirm('Do you want to merc this person?\n\nCost: 4 Xanax');

                    if (!confirmMerc) return;

                    getUserData(apiKey, function(userData) {
                        if (userData && userData.player_id && userData.name) {
                            const requesterProfileUrl = `https://www.torn.com/profiles.php?XID=${userData.player_id}`;
                            const targetProfileUrl = `https://www.torn.com/profiles.php?XID=${targetXID}`;

                            getTargetData(targetXID, apiKey, function(targetData, error) {
                                if (error || !targetData) {
                                    alert(`Invalid ID, check userid and try again`);
                                    return;
                                }

                                sendToCloudflareProxy(
                                    userData.player_id,
                                    userData.name,
                                    requesterProfileUrl,
                                    targetXID,
                                    targetProfileUrl,
                                    targetData.name,
                                    targetData.level,
                                    targetData.status?.description || 'Unknown'
                                );
                                setCooldown(targetXID);
                                alert('Your request has been transferred, Please pay 4 xanax to the merc.');
                            });
                        } else {
                            alert('Failed to fetch user data. Please check your API key.');
                            GM_setValue('torn_api_key', '');
                        }
                    });
                };

                buttonsList.appendChild(mercButton);
            }
        }, 500);

        setTimeout(() => clearInterval(checkInterval), 10000);
    }

    function addHireMercButtonPDA() {
        const checkInterval = setInterval(() => {
            const barsMobile = document.querySelector('.bars-mobile___PDyjE');

            if (barsMobile) {
                clearInterval(checkInterval);

                if (document.getElementById('cr-merc-bar-pda')) {
                    return;
                }

                const mercBar = document.createElement('a');
                mercBar.id = 'cr-merc-bar-pda';
                mercBar.className = 'bar___Bv5Ho bar-mobile___ptmyk';
                mercBar.href = '#';
                mercBar.tabIndex = 0;
                mercBar.style.cssText = `
                    background-color: #87CEEB;
                    cursor: pointer;
                `;

                const barStats = document.createElement('div');
                barStats.className = 'bar-stats____l994 bar-stats-flex___zntBu';
                barStats.style.cssText = `
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 8px;
                `;

                const label = document.createElement('p');
                label.textContent = 'CR';
                label.style.cssText = `
                    margin: 0;
                    font-weight: bold;
                    color: #000;
                    font-size: 14px;
                    font-family: 'Comic Sans MS', 'Brush Script MT', cursive;
                `;

                barStats.appendChild(label);
                mercBar.appendChild(barStats);

                mercBar.onclick = function(e) {
                    e.preventDefault();
                    const apiKey = getApiKey();
                    if (!apiKey) {
                        alert('API key is required!');
                        return;
                    }
                    createMobileDropdown(apiKey);
                };

                barsMobile.appendChild(mercBar);
            }
        }, 500);

        setTimeout(() => clearInterval(checkInterval), 10000);
    }

    function addHireMercButtonDesktop() {
        const checkInterval = setInterval(() => {
            const chainBar = document.querySelector('.chain-bar___vjdPL.bar-desktop___F8PEF');

            if (chainBar && chainBar.parentElement) {
                clearInterval(checkInterval);

                if (document.getElementById('hire-merc-button')) {
                    return;
                }

                const buttonContainer = document.createElement('div');
                buttonContainer.id = 'hire-merc-button';
                buttonContainer.style.cssText = `
                    margin: 10px 0;
                    text-align: center;
                `;

                const button = document.createElement('button');
                button.style.cssText = `
                    background-color: #87CEEB;
                    border: 2px solid #87CEEB;
                    border-radius: 5px;
                    padding: 8px 16px;
                    cursor: pointer;
                    font-size: 18px;
                    width: 90%;
                    position: relative;
                    font-family: 'Comic Sans MS', 'Brush Script MT', cursive;
                `;

                button.innerHTML = `
                    <span style="position: relative; z-index: 2; font-weight: normal; color: #000;">CR Mercs</span>
                `;

                button.onmouseover = function() {
                    this.style.backgroundColor = '#6BB6D6';
                };
                button.onmouseout = function() {
                    this.style.backgroundColor = '#87CEEB';
                };

                button.onclick = function() {
                    const apiKey = getApiKey();
                    if (!apiKey) {
                        alert('API key is required!');
                        return;
                    }

                    const dropdown = document.createElement('div');
                    dropdown.style.cssText = `
                        position: absolute;
                        background: #2a2a2a;
                        border: 2px solid #87CEEB;
                        border-radius: 5px;
                        padding: 5px;
                        z-index: 9999;
                        box-shadow: 0 4px 6px rgba(0,0,0,0.3);
                    `;

                    const selfMercOption = document.createElement('button');
                    selfMercOption.textContent = 'Self Merc';
                    selfMercOption.style.cssText = `
                        display: block;
                        width: 100%;
                        padding: 10px 20px;
                        margin: 5px 0;
                        background: #87CEEB;
                        border: none;
                        border-radius: 3px;
                        cursor: pointer;
                        font-weight: bold;
                        color: #000;
                    `;

                    const otherOption = document.createElement('button');
                    otherOption.textContent = 'Merc Other';
                    otherOption.style.cssText = `
                        display: block;
                        width: 100%;
                        padding: 10px 20px;
                        margin: 5px 0;
                        background: #87CEEB;
                        border: none;
                        border-radius: 3px;
                        cursor: pointer;
                        font-weight: bold;
                        color: #000;
                    `;

                    selfMercOption.onmouseover = function() { this.style.background = '#6BB6D6'; };
                    selfMercOption.onmouseout = function() { this.style.background = '#87CEEB'; };
                    otherOption.onmouseover = function() { this.style.background = '#6BB6D6'; };
                    otherOption.onmouseout = function() { this.style.background = '#87CEEB'; };

                    selfMercOption.onclick = function() {
                        dropdown.remove();

                        getUserData(apiKey, function(userData) {
                            if (!userData || !userData.player_id) {
                                alert('Failed to fetch user data. Please check your API key.');
                                return;
                            }

                            const cooldownLeft = isOnCooldown(userData.player_id);
                            if (cooldownLeft) {
                                alert(`Please wait ${cooldownLeft} minute(s) before requesting self merc again.`);
                                return;
                            }

                            const finalTargetId = userData.player_id;
                            const requesterProfileUrl = `https://www.torn.com/profiles.php?XID=${userData.player_id}`;
                            const targetProfileUrl = `https://www.torn.com/profiles.php?XID=${finalTargetId}`;

                            sendToCloudflareProxy(
                                userData.player_id,
                                userData.name,
                                requesterProfileUrl,
                                finalTargetId,
                                targetProfileUrl,
                                userData.name,
                                userData.level,
                                'Self'
                            );
                            setCooldown(finalTargetId);
                            alert('Your request has been transferred, Please pay 4 xanax to the merc.');
                        });
                    };

                    otherOption.onclick = function() {
                        dropdown.remove();
                        const targetId = prompt('Enter the User ID of the person you want merc\'d:\n\nCost: 4 Xanax');

                        if (!targetId || targetId.trim() === '') {
                            return;
                        }

                        if (!/^\d+$/.test(targetId.trim())) {
                            alert('Invalid User ID! Please enter numbers only.');
                            return;
                        }

                        getUserData(apiKey, function(userData) {
                            if (userData && userData.player_id && userData.name) {
                                getTargetData(targetId.trim(), apiKey, function(targetData, error) {
                                    if (error || !targetData) {
                                        alert(`Invalid User ID: ${error || 'User not found'}`);
                                        return;
                                    }

                                    const cooldownLeft = isOnCooldown(targetId.trim());
                                    if (cooldownLeft) {
                                        alert(`Please wait ${cooldownLeft} minute(s) before requesting merc for this person again.`);
                                        return;
                                    }

                                    const finalTargetId = targetId.trim();
                                    const requesterProfileUrl = `https://www.torn.com/profiles.php?XID=${userData.player_id}`;
                                    const targetProfileUrl = `https://www.torn.com/profiles.php?XID=${finalTargetId}`;

                                    sendToCloudflareProxy(
                                        userData.player_id,
                                        userData.name,
                                        requesterProfileUrl,
                                        finalTargetId,
                                        targetProfileUrl,
                                        targetData.name,
                                        targetData.level,
                                        targetData.status?.description || 'Unknown'
                                    );
                                    setCooldown(finalTargetId);
                                    alert('Your request has been transferred, Please pay 4 xanax to the merc.');
                                });
                            } else {
                                alert('Failed to fetch user data. Please check your API key.');
                                GM_setValue('torn_api_key', '');
                            }
                        });
                    };

                    dropdown.appendChild(selfMercOption);
                    dropdown.appendChild(otherOption);

                    const rect = button.getBoundingClientRect();
                    dropdown.style.position = 'fixed';
                    dropdown.style.top = (rect.bottom + 5) + 'px';
                    dropdown.style.left = rect.left + 'px';

                    document.body.appendChild(dropdown);

                    setTimeout(() => {
                        document.addEventListener('click', function closeDropdown(e) {
                            if (!dropdown.contains(e.target) && e.target !== button) {
                                dropdown.remove();
                                document.removeEventListener('click', closeDropdown);
                            }
                        });
                    }, 100);
                };

                buttonContainer.appendChild(button);
                chainBar.parentElement.insertBefore(buttonContainer, chainBar.nextSibling);
            }
        }, 500);

        setTimeout(() => clearInterval(checkInterval), 10000);
    }

    addHireMercButtonDesktop();
    addHireMercButtonPDA();
    addProfileMercButton();

    const observer = new MutationObserver(function(mutations) {
        addHireMercButtonDesktop();
        addHireMercButtonPDA();
        addProfileMercButton();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();