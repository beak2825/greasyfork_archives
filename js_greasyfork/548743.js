// ==UserScript==
// @name         Grand RP Profile Logs Navigator
// @namespace    Grand RP Profile Logs Navigator
// @version      2.6
// @description  Profile page log navigation dropdowns
// @author       Made with ❤️ by Tom Fresh
// @license      GNU General Public License v3.0
// @match        https://gta5grand.com/admin**/account/info/*
// @supportURL   https://greasyfork.org/de/scripts/548743-grand-rp-profile-logs-navigator
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/548743/Grand%20RP%20Profile%20Logs%20Navigator.user.js
// @updateURL https://update.greasyfork.org/scripts/548743/Grand%20RP%20Profile%20Logs%20Navigator.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    const CURRENT_VERSION = "2.6";
    const UPDATE_CHECK_URL = "https://greasyfork.org/de/scripts/548743-grand-rp-profile-logs-navigator";
    
    // Warten bis die Seite vollständig geladen ist
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initScript);
    } else {
        initScript();
    }
    
    function initScript() {
        // Prüfen ob wir uns auf der richtigen Seite befinden
        if (!window.location.href.includes('gta5grand.com/admin') || !window.location.href.includes('/account/info/')) return;
        
        // Update-Überprüfung bei jedem Seitenaufruf
        checkForUpdates();
        
        // Account ID aus URL extrahieren
        const accountId = extractAccountId();
        if (!accountId) {
            console.log('Profile Logs: Keine Account ID gefunden');
            return;
        }
        
        // Social Clubs extrahieren
        const socialClubs = extractSocialClubs();
        
        // Dropdowns hinzufügen
        addLogDropdowns(accountId, socialClubs);
    }
    
    function checkForUpdates() {
        // Version auf Greasyfork überprüfen
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://greasyfork.org/de/scripts/548743-grand-rp-profile-logs-navigator.json',
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    const latestVersion = data.version;
                    
                    if (latestVersion && compareVersions(latestVersion, CURRENT_VERSION) > 0) {
                        showUpdateNotification();
                    }
                } catch (e) {
                    console.log('Profile Logs Navigator: Fehler beim Überprüfen der Updates');
                }
            },
            onerror: function() {
                console.log('Profile Logs Navigator: Update-Überprüfung fehlgeschlagen');
            }
        });
    }
    
    function compareVersions(a, b) {
        const aParts = a.split('.').map(Number);
        const bParts = b.split('.').map(Number);
        
        for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
            const aPart = aParts[i] || 0;
            const bPart = bParts[i] || 0;
            
            if (aPart > bPart) return 1;
            if (aPart < bPart) return -1;
        }
        return 0;
    }
    
    function showUpdateNotification() {
        const updateDiv = document.createElement('div');
        updateDiv.className = 'alert alert-info';
        updateDiv.style.cssText = 'margin: 10px 0; padding: 10px; background: #d1ecf1; border: 1px solid #bee5eb; color: #0c5460; border-radius: 4px;';
        updateDiv.innerHTML = `
            <strong>Update verfügbar!</strong> 
            <a href="${UPDATE_CHECK_URL}" target="_blank" style="color: #0c5460; text-decoration: underline;">
                Neue Version des Profile Logs Navigator verfügbar
            </a>
        `;
        
        // Nach den Dropdowns einfügen
        const dropdownContainer = document.getElementById('profile-logs-container');
        if (dropdownContainer && dropdownContainer.nextSibling) {
            dropdownContainer.parentNode.insertBefore(updateDiv, dropdownContainer.nextSibling);
        } else if (dropdownContainer) {
            dropdownContainer.parentNode.appendChild(updateDiv);
        }
    }
    
    function extractCurrentServerPath() {
        // Aktuellen Server aus dem Dropdown extrahieren
        const serverSelect = document.getElementById('server-list');
        if (!serverSelect) {
            console.log('Profile Logs: Server-Dropdown nicht gefunden, verwende admin_de2 als Fallback');
            return 'admin_de2';
        }
        
        const selectedValue = serverSelect.value;
        let serverPath = 'admin_de2'; // Fallback
        
        // Mapping der Server-Werte zu Admin-Pfaden
        switch(selectedValue) {
            case "1": serverPath = "admin"; break;           // Server EN №1
            case "2": serverPath = "admin2"; break;          // Server EN №2
            case "12": serverPath = "admin3"; break;         // Server EN №3
            case "3": serverPath = "admin_de"; break;        // Server DE №1
            case "4": serverPath = "admin_de2"; break;       // Server DE №2
            case "8": serverPath = "admin_de3"; break;       // Server DE №3
            case "11": serverPath = "admin_de4"; break;      // Server DE №4
            case "5": serverPath = "admin_rs"; break;        // Server RS №1
            case "6": serverPath = "admin_it"; break;        // Server IT №1
            case "7": serverPath = "admin_fr"; break;        // Server FR №1
            case "9": serverPath = "admin_pt"; break;        // Server PT №1
            case "10": serverPath = "admin_es"; break;       // Server ES №1
            case "13": serverPath = "admin_jp"; break;       // Server JP №1
            default: serverPath = "admin_de2"; break;       // Fallback
        }
        
        console.log('Profile Logs: Aktueller Server-Pfad:', serverPath);
        return serverPath;
    }
    
    function extractAccountId() {
        // Account ID aus URL extrahieren
        const urlParts = window.location.pathname.split('/');
        const accountId = urlParts[urlParts.length - 1];
        
        // Prüfen ob es eine gültige Nummer ist
        if (accountId && /^\d+$/.test(accountId)) {
            return accountId;
        }
        
        return null;
    }
    
    function extractSocialClubs() {
        const socialClubs = [];
        
        // Social Clubs aus der Seite extrahieren
        const cardHeaders = document.querySelectorAll('.card-header h4');
        let socialClubCard = null;
        
        // Finde die richtige Card mit "Social clubs" Header
        cardHeaders.forEach(header => {
            if (header.textContent.trim() === 'Social clubs') {
                socialClubCard = header.closest('.card');
            }
        });
        
        if (socialClubCard) {
            const socialClubList = socialClubCard.querySelector('.nav-pills');
            
            if (socialClubList) {
                const listItems = socialClubList.querySelectorAll('li');
                listItems.forEach(item => {
                    const text = item.textContent.trim();
                    console.log('Social Club gefunden:', text); // Debug-Ausgabe
                    
                    if (text && text !== '') {
                        // Format: "cha0s_33 x5335" - wir wollen nur den ersten Teil vor dem Space
                        const socialClub = text.split(' ')[0];
                        if (socialClub && socialClub.length > 0) {
                            socialClubs.push(socialClub);
                        }
                    }
                });
            }
        }
        
        console.log('Extrahierte Social Clubs:', socialClubs); // Debug-Ausgabe
        return socialClubs;
    }
    
    function addLogDropdowns(accountId, socialClubs) {
        // Immer eine eigene "Profile Card (Senior+)" erstellen
        console.log('Profile Logs: Erstelle Profile Card (Senior+)');
        const addonCard = createProfileAddonCard();
        
        const cardBlock = addonCard.querySelector('.card-block');
        if (!cardBlock) return;
        
        // Container für unsere Dropdowns erstellen
        const dropdownContainer = document.createElement('div');
        dropdownContainer.id = 'profile-logs-container';
        dropdownContainer.style.cssText = 'margin-top: 0px;';
        
        // Account Logs Dropdown
        const accountLogsDropdown = createAccountLogsDropdown(accountId);
        dropdownContainer.appendChild(accountLogsDropdown);
        
        // Social Club Logs Dropdown (immer anzeigen, da mind. 1 Social Club vorhanden)
        const socialClubDropdown = createSocialClubDropdown(socialClubs);
        dropdownContainer.appendChild(socialClubDropdown);
        
        // Container in die Card einfügen
        cardBlock.appendChild(dropdownContainer);
        
        console.log('Profile Logs: Profile Card (Senior+) mit Dropdowns erstellt');
    }
    
    function createProfileAddonCard() {
        // Neue Profile Card (Senior+) erstellen
        const newCard = document.createElement('div');
        newCard.className = 'card';
        
        const cardHeader = document.createElement('div');
        cardHeader.className = 'card-header';
        
        const cardTitle = document.createElement('h4');
        cardTitle.textContent = 'Profile Card (Senior+)';
        
        const cardBlock = document.createElement('div');
        cardBlock.className = 'card-block';
        
        cardHeader.appendChild(cardTitle);
        newCard.appendChild(cardHeader);
        newCard.appendChild(cardBlock);
        
        // Card als allererstes Element in der linken Spalte einfügen
        const leftColumn = document.querySelector('.col-md-5.col-lg-3');
        if (leftColumn) {
            const navbar = leftColumn.querySelector('#inbox-nav');
            if (navbar) {
                // Als allererstes Element einfügen (vor allen anderen Cards)
                navbar.insertBefore(newCard, navbar.firstChild);
            } else {
                // Fallback: Direkt in die linke Spalte einfügen
                leftColumn.insertBefore(newCard, leftColumn.firstChild);
            }
        }
        
        console.log('Profile Logs: Profile Card (Senior+) ganz oben erstellt');
        return newCard;
    }
    
    function createAccountLogsDropdown(accountId) {
        const dropdown = document.createElement('div');
        dropdown.className = 'dropdown';
        dropdown.style.cssText = 'margin-bottom: 5px;';
        
        const button = document.createElement('button');
        button.className = 'btn btn-app-blue btn-block dropdown-toggle';
        button.type = 'button';
        button.setAttribute('data-toggle', 'dropdown');
        button.setAttribute('aria-haspopup', 'true');
        button.setAttribute('aria-expanded', 'false');
        button.textContent = 'Account Logs';
        button.innerHTML += ' <span class="caret"></span>';
        
        const menu = document.createElement('ul');
        menu.className = 'dropdown-menu';
        menu.style.cssText = 'width: 100%;';
        
        // Aktuellen Server-Pfad ermitteln
        const serverPath = extractCurrentServerPath();
        
        const logs = [
            { name: 'Money Logs', url: `https://gta5grand.com/${serverPath}/logs/money?page=1&nick=skip&accid=${accountId}&ip=skip&description=skip&othernick=skip` },
            { name: 'Inventory Logs', url: `https://gta5grand.com/${serverPath}/logs/inventory?page=1&nick=skip&id_item=skip&accid=${accountId}&action=skip&ip=skip` },
            { name: 'Family Logs', url: `https://gta5grand.com/${serverPath}/logs/fam?page=1&fam=skip&accid=${accountId}&actionid=skip` },
            { name: 'Authorization Logs', url: `https://gta5grand.com/${serverPath}/logs/authorization?page=1&nick=skip&accid=${accountId}&ip=skip&socialclub=skip` },
            { name: 'Killer Logs', url: `https://gta5grand.com/${serverPath}/logs/kill?page=1&killeraccid=${accountId}&playeraccid=skip` },
            { name: 'Victim Logs', url: `https://gta5grand.com/${serverPath}/logs/kill?page=1&killeraccid=skip&playeraccid=${accountId}` }
        ];
        
        logs.forEach(log => {
            const item = document.createElement('li');
            const link = document.createElement('a');
            link.href = log.url;
            link.target = '_blank';
            link.textContent = log.name;
            link.style.cssText = 'display: block; padding: 3px 20px; color: #333; text-decoration: none;';
            
            // Hover-Effekt
            link.addEventListener('mouseenter', function() {
                this.style.backgroundColor = '#f5f5f5';
            });
            link.addEventListener('mouseleave', function() {
                this.style.backgroundColor = 'transparent';
            });
            
            item.appendChild(link);
            menu.appendChild(item);
        });
        
        dropdown.appendChild(button);
        dropdown.appendChild(menu);
        
        return dropdown;
    }
    
    function createSocialClubDropdown(socialClubs) {
        const dropdown = document.createElement('div');
        dropdown.className = 'dropdown';
        dropdown.style.cssText = 'margin-bottom: 5px;';
        
        const button = document.createElement('button');
        button.className = 'btn btn-app-green btn-block dropdown-toggle';
        button.type = 'button';
        button.setAttribute('data-toggle', 'dropdown');
        button.setAttribute('aria-haspopup', 'true');
        button.setAttribute('aria-expanded', 'false');
        button.textContent = 'Social Club Logs';
        button.innerHTML += ' <span class="caret"></span>';
        
        const menu = document.createElement('ul');
        menu.className = 'dropdown-menu';
        menu.style.cssText = 'width: 100%;';
        
        // Aktuellen Server-Pfad ermitteln
        const serverPath = extractCurrentServerPath();
        
        socialClubs.forEach(socialClub => {
            const item = document.createElement('li');
            const link = document.createElement('a');
            link.href = `https://gta5grand.com/${serverPath}/logs/authorization?page=1&nick=skip&accid=skip&ip=skip&socialclub=${encodeURIComponent(socialClub)}`;
            link.target = '_blank';
            link.textContent = socialClub;
            link.style.cssText = 'display: block; padding: 3px 20px; color: #333; text-decoration: none;';
            
            // Hover-Effekt
            link.addEventListener('mouseenter', function() {
                this.style.backgroundColor = '#f5f5f5';
            });
            link.addEventListener('mouseleave', function() {
                this.style.backgroundColor = 'transparent';
            });
            
            item.appendChild(link);
            menu.appendChild(item);
        });
        
        dropdown.appendChild(button);
        dropdown.appendChild(menu);
        
        return dropdown;
    }
    
})();