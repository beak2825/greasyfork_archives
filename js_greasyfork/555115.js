// ==UserScript==
// @name            Discord Server and Folder Hider
// @description     Hide servers or folders on Discord web, with optional ping-based visibility
// @version         1.0.0
// @author          mesityl
// @match           https://*.discord.com/app
// @match           https://*.discord.com/channels/*
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           unsafeWindow
// @run-at          document-end
// @license         MIT
// @namespace https://greasyfork.org/users/1535327
// @downloadURL https://update.greasyfork.org/scripts/555115/Discord%20Server%20and%20Folder%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/555115/Discord%20Server%20and%20Folder%20Hider.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'discord_hidden_servers';
    const STORAGE_KEY_PING = 'discord_hidden_servers_ping';
    const STORAGE_KEY_FOLDERS = 'discord_hidden_folders';
    const STORAGE_KEY_FOLDERS_PING = 'discord_hidden_folders_ping';

    // Storage utilities using Tampermonkey's GM API
    const storage = {
        getHidden() {
            return JSON.parse(GM_getValue(STORAGE_KEY, '[]'));
        },
        setHidden(guilds) {
            GM_setValue(STORAGE_KEY, JSON.stringify(guilds));
        },
        getHiddenPing() {
            return JSON.parse(GM_getValue(STORAGE_KEY_PING, '[]'));
        },
        setHiddenPing(guilds) {
            GM_setValue(STORAGE_KEY_PING, JSON.stringify(guilds));
        },
        getHiddenFolders() {
            return JSON.parse(GM_getValue(STORAGE_KEY_FOLDERS, '[]'));
        },
        setHiddenFolders(folders) {
            GM_setValue(STORAGE_KEY_FOLDERS, JSON.stringify(folders));
        },
        getHiddenFoldersPing() {
            return JSON.parse(GM_getValue(STORAGE_KEY_FOLDERS_PING, '[]'));
        },
        setHiddenFoldersPing(folders) {
            GM_setValue(STORAGE_KEY_FOLDERS_PING, JSON.stringify(folders));
        },
        hideServer(guildId) {
            const hidden = this.getHidden();
            if (!hidden.includes(guildId)) {
                hidden.push(guildId);
                this.setHidden(hidden);
            }
        },
        hideServerPing(guildId) {
            const hidden = this.getHiddenPing();
            if (!hidden.includes(guildId)) {
                hidden.push(guildId);
                this.setHiddenPing(hidden);
            }
        },
        hideFolder(folderId) {
            const hidden = this.getHiddenFolders();
            if (!hidden.includes(folderId)) {
                hidden.push(folderId);
                this.setHiddenFolders(hidden);
            }
        },
        hideFolderPing(folderId) {
            const hidden = this.getHiddenFoldersPing();
            if (!hidden.includes(folderId)) {
                hidden.push(folderId);
                this.setHiddenFoldersPing(hidden);
            }
        },
        unhideServer(guildId) {
            this.setHidden(this.getHidden().filter(id => id !== guildId));
            this.setHiddenPing(this.getHiddenPing().filter(id => id !== guildId));
        },
        unhideFolder(folderId) {
            this.setHiddenFolders(this.getHiddenFolders().filter(id => id !== folderId));
            this.setHiddenFoldersPing(this.getHiddenFoldersPing().filter(id => id !== folderId));
        },
        isHidden(guildId) {
            return this.getHidden().includes(guildId);
        },
        isHiddenPing(guildId) {
            return this.getHiddenPing().includes(guildId);
        },
        isFolderHidden(folderId) {
            return this.getHiddenFolders().includes(folderId);
        },
        isFolderHiddenPing(folderId) {
            return this.getHiddenFoldersPing().includes(folderId);
        }
    };

    // CSS to hide servers
    const style = document.createElement('style');
    style.textContent = `
        [data-guild-hidden="true"] {
            display: none !important;
        }
        [data-folder-items-hidden="true"] {
            display: none !important;
        }
        [data-folder-items-hidden="true"] + .folderGroupBackground__48112,
        [data-folder-items-hidden="true"] + [class*="folderGroupBackground"] {
            display: none !important;
        }
        .folderGroup__48112:has([data-folder-items-hidden="true"]) .folderGroupBackground__48112,
        [class*="folderGroup"]:has([data-folder-items-hidden="true"]) [class*="folderGroupBackground"] {
            display: none !important;
        }
        .server-hider-menu-item {
            color: var(--interactive-normal);
            cursor: pointer;
            padding: 6px 8px;
            border-radius: 2px;
            font-size: 14px;
            line-height: 18px;
        }
        .server-hider-menu-item:hover {
            background-color: var(--menu-item-default-hover-bg);
            color: var(--interactive-hover);
        }
    `;
    document.head.appendChild(style);

    // Apply hiding to server elements
    function applyHiding() {
        const hiddenServers = storage.getHidden();
        const hiddenPingServers = storage.getHiddenPing();
        const hiddenFolders = storage.getHiddenFolders();
        const hiddenFoldersPing = storage.getHiddenFoldersPing();

        // Hide individual servers
        document.querySelectorAll('[data-list-item-id^="guildsnav___"]').forEach(serverElement => {
            const guildId = serverElement.getAttribute('data-list-item-id')?.split('___')[1];
            if (!guildId) return;

            // Skip folder elements (they'll be handled separately)
            if (serverElement.querySelector('.folderButton__48112, [class*="folderButton"]')) {
                return;
            }

            // Find the actual listItem container to hide
            const listItem = serverElement.closest('.listItem__650eb, [class*="listItem"]');
            if (!listItem) return;

            // Check for pings - look in the entire listItem for badges
            // Check for various badge and unread indicator classes
            const hasPing = listItem.querySelector('[class*="numberBadge"], [class*="mentionsBadge"], [class*="unread"], [aria-label*="unread"], [aria-label*="mention"]') !== null;

            // Debug log for servers with issues
            if (hiddenPingServers.includes(guildId) && hasPing) {
                console.log('[Discord Server Hider] Server has ping, keeping visible:', guildId);
            }

            // Logic: Hide if fully hidden, OR if hidden-with-pings AND no pings
            if (hiddenServers.includes(guildId)) {
                listItem.setAttribute('data-guild-hidden', 'true');
            } else if (hiddenPingServers.includes(guildId) && !hasPing) {
                listItem.setAttribute('data-guild-hidden', 'true');
            } else {
                listItem.removeAttribute('data-guild-hidden');
            }
        });

        // Hide folders
        document.querySelectorAll('[data-list-item-id^="guildsnav___"]').forEach(element => {
            const folderId = element.getAttribute('data-list-item-id')?.split('___')[1];
            if (!folderId) return;

            // Check if this is a folder
            const folderButton = element.querySelector('.folderButton__48112, [class*="folderButton"]');
            if (!folderButton) return;

            // Find the actual listItem container to hide (folder header)
            const listItem = element.closest('.listItem__650eb, [class*="listItem"]');
            if (!listItem) return;

            // Check for pings in folder (check folder itself and expanded items)
            let hasPing = listItem.querySelector('[class*="numberBadge"], [class*="mentionsBadge"], [class*="unread"], [aria-label*="unread"], [aria-label*="mention"]') !== null;
            
            // Also check expanded folder items container
            const ariaOwns = folderButton.getAttribute('aria-owns');
            let folderItemsContainer = null;
            if (ariaOwns) {
                folderItemsContainer = document.getElementById(ariaOwns);
                if (folderItemsContainer) {
                    hasPing = hasPing || folderItemsContainer.querySelector('[class*="numberBadge"], [class*="mentionsBadge"], [class*="unread"], [aria-label*="unread"], [aria-label*="mention"]') !== null;
                }
            }

            // Apply hiding to folder header
            if (hiddenFolders.includes(folderId)) {
                listItem.setAttribute('data-guild-hidden', 'true');
            } else if (hiddenFoldersPing.includes(folderId) && !hasPing) {
                listItem.setAttribute('data-guild-hidden', 'true');
            } else {
                listItem.removeAttribute('data-guild-hidden');
            }

            // Also hide the expanded folder items container if it exists
            if (folderItemsContainer) {
                if (hiddenFolders.includes(folderId)) {
                    folderItemsContainer.setAttribute('data-folder-items-hidden', 'true');
                } else if (hiddenFoldersPing.includes(folderId) && !hasPing) {
                    folderItemsContainer.setAttribute('data-folder-items-hidden', 'true');
                } else {
                    folderItemsContainer.removeAttribute('data-folder-items-hidden');
                }
            }
        });

        // Additionally, hide all folder-items containers that should be hidden
        // This catches expanded folders even if we didn't process them above
        hiddenFolders.forEach(folderId => {
            const container = document.getElementById(`folder-items-${folderId}`);
            if (container) {
                container.setAttribute('data-folder-items-hidden', 'true');
            }
        });
        
        hiddenFoldersPing.forEach(folderId => {
            const container = document.getElementById(`folder-items-${folderId}`);
            if (container) {
                const hasPing = container.querySelector('[class*="numberBadge"], [class*="mentionsBadge"], [class*="unread"], [aria-label*="unread"], [aria-label*="mention"]') !== null;
                if (!hasPing) {
                    container.setAttribute('data-folder-items-hidden', 'true');
                } else {
                    container.removeAttribute('data-folder-items-hidden');
                }
            }
        });
    }

    // Get guild ID or folder ID from context menu target
    function getGuildIdFromTarget(target) {
        const serverElement = target.closest('[data-list-item-id^="guildsnav___"]');
        if (!serverElement) return null;

        const listItemId = serverElement.getAttribute('data-list-item-id');
        const id = listItemId?.split('___')[1] || null;
        
        // Check if this is a folder
        const isFolder = serverElement.querySelector('.folderButton__48112, [class*="folderButton"]') !== null;
        
        if (isFolder) {
            // Return folder ID with a marker
            return { type: 'folder', id };
        }
        
        // Skip if not a valid guild ID (should be a snowflake - 17-19 digits)
        if (id && !/^\d{17,19}$/.test(id)) {
            return null;
        }
        
        return { type: 'server', id };
    }

    // Inject menu items into Discord's context menu
    function injectMenuItems(menu, targetInfo) {
        if (!targetInfo || !targetInfo.id) return;
        
        const { type, id } = targetInfo;
        
        // Skip home
        if (id === 'home') return;

        // Prevent duplicate injection
        if (menu.querySelector('.server-hider-menu-item')) return;

        const isFolder = type === 'folder';
        const isHidden = isFolder ? storage.isFolderHidden(id) : storage.isHidden(id);
        const isHiddenPing = isFolder ? storage.isFolderHiddenPing(id) : storage.isHiddenPing(id);
        const itemType = isFolder ? 'Folder' : 'Server';

        // Find menu items container
        let menuGroup = menu.querySelector('[role="group"]') || menu;

        // Create our menu items
        const items = [];

        if (isHidden || isHiddenPing) {
            // Show unhide option
            const unhideItem = document.createElement('div');
            unhideItem.className = 'server-hider-menu-item';
            unhideItem.setAttribute('role', 'menuitem');
            unhideItem.textContent = `Unhide ${itemType}`;
            unhideItem.onclick = (e) => {
                e.stopPropagation();
                if (isFolder) {
                    storage.unhideFolder(id);
                } else {
                    storage.unhideServer(id);
                }
                applyHiding();
                document.querySelector('[class*="layerContainer"]')?.click();
            };
            items.push(unhideItem);
        } else {
            // Show hide options
            const hideItem = document.createElement('div');
            hideItem.className = 'server-hider-menu-item';
            hideItem.setAttribute('role', 'menuitem');
            hideItem.textContent = `Hide ${itemType}`;
            hideItem.onclick = (e) => {
                e.stopPropagation();
                if (isFolder) {
                    storage.hideFolder(id);
                } else {
                    storage.hideServer(id);
                }
                applyHiding();
                document.querySelector('[class*="layerContainer"]')?.click();
            };
            items.push(hideItem);

            const hidePingItem = document.createElement('div');
            hidePingItem.className = 'server-hider-menu-item';
            hidePingItem.setAttribute('role', 'menuitem');
            hidePingItem.textContent = `Hide ${itemType} (Keep Pings)`;
            hidePingItem.onclick = (e) => {
                e.stopPropagation();
                if (isFolder) {
                    storage.hideFolderPing(id);
                } else {
                    storage.hideServerPing(id);
                }
                applyHiding();
                document.querySelector('[class*="layerContainer"]')?.click();
            };
            items.push(hidePingItem);
        }

        // Add separator
        const separator = document.createElement('div');
        separator.setAttribute('role', 'separator');
        separator.style.cssText = 'height: 1px; background: var(--background-modifier-accent); margin: 4px 8px;';

        // Insert at the top
        items.forEach(item => menuGroup.insertBefore(item, menuGroup.firstChild));
        menuGroup.insertBefore(separator, menuGroup.firstChild);
    }

    // Track the target element for context menu
    let contextMenuTarget = null;
    document.addEventListener('contextmenu', (e) => {
        contextMenuTarget = e.target;
        const targetInfo = getGuildIdFromTarget(e.target);
        console.log('[Discord Server Hider] Context menu on:', targetInfo, e.target);
    }, true);

    // Watch for context menus appearing
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) {
                    // Look for context menu - Discord uses layerContainer
                    let menu = null;

                    if (node.querySelector) {
                        menu = node.querySelector('[role="menu"]');
                    }
                    if (!menu && node.getAttribute?.('role') === 'menu') {
                        menu = node;
                    }

                    if (menu && contextMenuTarget) {
                        const targetInfo = getGuildIdFromTarget(contextMenuTarget);
                        console.log('[Discord Server Hider] Menu found for:', targetInfo);
                        if (targetInfo && targetInfo.id) {
                            // Delay to ensure Discord's menu is fully rendered
                            setTimeout(() => injectMenuItems(menu, targetInfo), 50);
                        }
                    }
                }
            });
        });

        // Reapply hiding whenever DOM changes
        applyHiding();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Initial application
    applyHiding();

    // Reapply on navigation
    let lastUrl = location.href;
    setInterval(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            applyHiding();
        }
    }, 500);

    // Expose utility functions to window for easy access via console
    const hiderAPI = {
        listHidden() {
            const hidden = storage.getHidden();
            const hiddenPing = storage.getHiddenPing();
            const hiddenFolders = storage.getHiddenFolders();
            const hiddenFoldersPing = storage.getHiddenFoldersPing();
            console.log('═══════════════════════════════════════');
            console.log('Discord Server Hider - Hidden Items');
            console.log('═══════════════════════════════════════');
            console.log('\n📛 Fully Hidden Servers:');
            if (hidden.length === 0) {
                console.log('  (none)');
            } else {
                hidden.forEach((id, index) => {
                    console.log(`  ${index + 1}. Guild ID: ${id}`);
                });
            }
            console.log('\n🔔 Hidden Servers (Except Pings):');
            if (hiddenPing.length === 0) {
                console.log('  (none)');
            } else {
                hiddenPing.forEach((id, index) => {
                    console.log(`  ${index + 1}. Guild ID: ${id}`);
                });
            }
            console.log('\n📁 Fully Hidden Folders:');
            if (hiddenFolders.length === 0) {
                console.log('  (none)');
            } else {
                hiddenFolders.forEach((id, index) => {
                    console.log(`  ${index + 1}. Folder ID: ${id}`);
                });
            }
            console.log('\n📂 Hidden Folders (Except Pings):');
            if (hiddenFoldersPing.length === 0) {
                console.log('  (none)');
            } else {
                hiddenFoldersPing.forEach((id, index) => {
                    console.log(`  ${index + 1}. Folder ID: ${id}`);
                });
            }
            console.log('\n═══════════════════════════════════════');
            console.log('To unhide a server, use:');
            console.log('  discordServerHider.unhide("GUILD_ID")');
            console.log('To unhide a folder, use:');
            console.log('  discordServerHider.unhideFolder("FOLDER_ID")');
            console.log('To unhide all servers and folders, use:');
            console.log('  discordServerHider.unhideAll()');
            console.log('═══════════════════════════════════════\n');
            return { hidden, hiddenPing, hiddenFolders, hiddenFoldersPing };
        },
        unhide(guildId) {
            if (!guildId) {
                console.error('Please provide a guild ID: discordServerHider.unhide("GUILD_ID")');
                return;
            }
            storage.unhideServer(guildId);
            applyHiding();
            console.log(`✓ Server ${guildId} has been unhidden`);
        },
        unhideFolder(folderId) {
            if (!folderId) {
                console.error('Please provide a folder ID: discordServerHider.unhideFolder("FOLDER_ID")');
                return;
            }
            storage.unhideFolder(folderId);
            applyHiding();
            console.log(`✓ Folder ${folderId} has been unhidden`);
        },
        unhideAll() {
            const hidden = storage.getHidden();
            const hiddenPing = storage.getHiddenPing();
            const hiddenFolders = storage.getHiddenFolders();
            const hiddenFoldersPing = storage.getHiddenFoldersPing();
            const total = hidden.length + hiddenPing.length + hiddenFolders.length + hiddenFoldersPing.length;
            storage.setHidden([]);
            storage.setHiddenPing([]);
            storage.setHiddenFolders([]);
            storage.setHiddenFoldersPing([]);
            applyHiding();
            console.log(`✓ Unhidden ${total} item(s)`);
        },
        help() {
            console.log('═══════════════════════════════════════');
            console.log('Discord Server Hider - Console Commands');
            console.log('═══════════════════════════════════════');
            console.log('\nAvailable commands:');
            console.log('  discordServerHider.listHidden()');
            console.log('    → List all hidden servers and folders');
            console.log('\n  discordServerHider.unhide("GUILD_ID")');
            console.log('    → Unhide a specific server');
            console.log('\n  discordServerHider.unhideFolder("FOLDER_ID")');
            console.log('    → Unhide a specific folder');
            console.log('\n  discordServerHider.unhideAll()');
            console.log('    → Unhide all servers and folders');
            console.log('\n  discordServerHider.help()');
            console.log('    → Show this help message');
            console.log('═══════════════════════════════════════\n');
        }
    };
    
    // Use unsafeWindow to expose to the page context (required for Tampermonkey)
    if (typeof unsafeWindow !== 'undefined') {
        unsafeWindow.discordServerHider = hiderAPI;
    } else {
        window.discordServerHider = hiderAPI;
    }

    console.log('[Discord Server Hider] Loaded');
    console.log('[Discord Server Hider] Type "discordServerHider.help()" for console commands');
})();