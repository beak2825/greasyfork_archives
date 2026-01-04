// ==UserScript==
// @name         Lemonade Prompt Builder
// @namespace    http://tampermonkey.net/
// @version      9.0.4.3
// @description  Complete prompt builder for Lemonade AI with advanced features
// @author       Silverfox0338
// @match        https://lemonade.gg/code/*
// @match        https://*.lemonade.gg/code/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @license      CC-BY-NC-ND-4.0
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/557182/Lemonade%20Prompt%20Builder.user.js
// @updateURL https://update.greasyfork.org/scripts/557182/Lemonade%20Prompt%20Builder.meta.js
// ==/UserScript==

(function() {
    'use strict';
const CATEGORIES = window.LPB_CATEGORIES = {

    'large-systems': {
        name: 'Large Systems',
        description: 'Complete game systems from scratch',
        templates: {
            'inventory': {
                name: 'Inventory System',
                fields: [
                    { id: 'slots', label: 'Max Inventory Slots', type: 'number', default: '20', required: true },
                    { id: 'stackable', label: 'Stackable Items', type: 'radio', options: ['Yes', 'No'], default: 'Yes' },
                    { id: 'maxStack', label: 'Max Stack Size', type: 'number', default: '64', show_if: { field: 'stackable', value: 'Yes' } },
                    { id: 'dragDrop', label: 'Drag and Drop', type: 'radio', options: ['Yes', 'No'], default: 'Yes' },
                    { id: 'persistence', label: 'Save to DataStore', type: 'radio', options: ['Yes', 'No'], default: 'Yes' },
                    { id: 'features', label: 'Additional Features', type: 'textarea', placeholder: 'Search, filters, sorting, tooltips...' }
                ],
                generate: (d) => `Create an Inventory System with ${d.slots} slots.

STRUCTURE:
- LocalScript in StarterPlayerScripts (creates GUI, handles input)
- ModuleScript in ReplicatedStorage (shared inventory data structure)
- Script in ServerScriptService (validates changes, manages data)
- RemoteEvent in ReplicatedStorage for client-server communication

CLIENT (LocalScript):
1. Create ScreenGui with ${d.slots}-slot grid using Instance.new()
2. Each slot: ImageButton with ImageLabel (icon) and TextLabel (quantity)
${d.dragDrop === 'Yes' ? '3. Implement drag-drop: track dragging state, update positions with UserInputService' : ''}
4. Show tooltips on hover using MouseEnter/MouseLeave
5. Fire RemoteEvent for any inventory changes

SERVER (Script):
1. Store player inventories in a table
2. On RemoteEvent: validate the action, update server data, return result
3. Functions: AddItem(player, itemId, qty), RemoveItem(player, itemId, qty), MoveItem(player, from, to)
${d.stackable === 'Yes' ? `4. Stack items up to ${d.maxStack} per slot` : '4. One item per slot only'}
${d.persistence === 'Yes' ? `5. Save to DataStore on PlayerRemoving, load on PlayerAdded` : ''}
${d.features ? `\nExtra: ${d.features}` : ''}`
            },

            'shop': {
                name: 'Shop/Store System',
                fields: [
                    { id: 'currency', label: 'Currency Name', type: 'text', default: 'Coins', required: true },
                    { id: 'shopType', label: 'Shop Interface', type: 'select', options: ['GUI Menu', 'NPC Vendor', 'Both'], default: 'GUI Menu' },
                    { id: 'categories', label: 'Shop Categories', type: 'list', placeholder: 'Weapons, Tools, Cosmetics...', required: true },
                    { id: 'confirmPurchase', label: 'Purchase Confirmation', type: 'radio', options: ['Yes', 'No'], default: 'Yes' },
                    { id: 'persistence', label: 'Save Purchases', type: 'radio', options: ['Yes', 'No'], default: 'Yes' }
                ],
                generate: (d) => `Create a Shop System using ${d.currency} as currency.

STRUCTURE:
- LocalScript in StarterPlayerScripts (GUI creation and interaction)
- ModuleScript in ReplicatedStorage (item definitions with prices)
- Script in ServerScriptService (purchase validation)
- RemoteFunction in ReplicatedStorage for purchases

CLIENT (LocalScript):
1. Create ScreenGui with Instance.new(), parent to PlayerGui
2. Build shop frame with category tabs: ${d.categories ? d.categories.join(', ') : 'General'}
3. Display items as buttons showing: icon, name, price in ${d.currency}
${d.confirmPurchase === 'Yes' ? '4. Show confirmation popup before purchase' : '4. Purchase on single click'}
5. Call RemoteFunction to request purchase
6. Update GUI based on server response
${d.shopType.includes('NPC') ? '7. Add ProximityPrompt detection to open shop near NPCs' : ''}

SERVER (Script):
1. Handle RemoteFunction requests
2. Check player has enough ${d.currency}
3. Deduct ${d.currency} and grant item
4. Return success/failure to client
${d.persistence === 'Yes' ? '5. Save purchases and currency to DataStore' : ''}`
            },

            'combat': {
                name: 'Combat System',
                fields: [
                    { id: 'combatType', label: 'Combat Type', type: 'select', options: ['Melee', 'Ranged', 'Magic', 'Hybrid'], default: 'Melee' },
                    { id: 'hitDetection', label: 'Hit Detection', type: 'select', options: ['Raycast', 'Region3', 'Touched Event'], default: 'Raycast' },
                    { id: 'cooldown', label: 'Attack Cooldown (seconds)', type: 'number', default: '1' },
                    { id: 'animations', label: 'Attack Animations', type: 'radio', options: ['Yes', 'No'], default: 'Yes' },
                    { id: 'vfx', label: 'Visual Effects', type: 'radio', options: ['Yes (particles, sounds)', 'No'], default: 'Yes (particles, sounds)' }
                ],
                generate: (d) => `Create a ${d.combatType} Combat System.

STRUCTURE:
- LocalScript in StarterPlayerScripts (input, animations, effects)
- Script in ServerScriptService (hit validation, damage)
- RemoteEvent in ReplicatedStorage

CLIENT (LocalScript):
1. Detect attack input (mouse click or key)
2. Check local cooldown (${d.cooldown}s) before allowing attack
${d.animations === 'Yes' ? '3. Play attack animation using Animator:LoadAnimation()' : ''}
${d.vfx.includes('Yes') ? '4. Play sound and particle effects locally' : ''}
5. Fire RemoteEvent with attack data (position, direction)

SERVER (Script):
1. Track cooldowns per player in a table
2. Validate cooldown hasn't been bypassed
3. Perform ${d.hitDetection} from player's position
4. If hit enemy Humanoid: apply damage
5. Replicate effects to other clients if needed

${d.combatType === 'Melee' ? 'For melee: short raycast or small Region3 in front of player' : ''}
${d.combatType === 'Ranged' ? 'For ranged: raycast from camera through mouse position' : ''}
${d.combatType === 'Magic' ? 'For magic: spawn projectile part, move with RunService, check collisions' : ''}`
            },

            'datastore': {
                name: 'DataStore Manager',
                fields: [
                    { id: 'dataTypes', label: 'Data to Save', type: 'list', placeholder: 'Coins, Level, Inventory...', required: true },
                    { id: 'autoSave', label: 'Auto-Save Frequency', type: 'select', options: ['Every 1 minute', 'Every 5 minutes', 'Only on leave'], default: 'Every 5 minutes' },
                    { id: 'defaultData', label: 'Default Data Template', type: 'textarea', placeholder: '{ coins = 0, level = 1 }', required: true }
                ],
                generate: (d) => `Create a DataStore system.

LOCATION: Script in ServerScriptService

DATA TO SAVE:
${d.dataTypes ? d.dataTypes.map(t => `- ${t}`).join('\n') : '- PlayerData'}

DEFAULT TEMPLATE:
${d.defaultData}

IMPLEMENTATION:
1. Use DataStoreService:GetDataStore("PlayerData")
2. Create sessionData table to cache player data

LoadData(player):
- pcall GetAsync with player.UserId as key
- If no data exists, use default template
- Store in sessionData[player]

SaveData(player):
- pcall SetAsync with player.UserId and sessionData[player]
- Log any errors

EVENTS:
- PlayerAdded: call LoadData
- PlayerRemoving: call SaveData
- game:BindToClose: loop through all players and save

${d.autoSave !== 'Only on leave' ? `AUTO-SAVE:\n- Use while loop with ${d.autoSave === 'Every 1 minute' ? '60' : '300'} second wait\n- Save all players in sessionData` : ''}`
            },

            'leaderstats': {
                name: 'Leaderstats System',
                fields: [
                    { id: 'stats', label: 'Stats to Display', type: 'list', placeholder: 'Kills, Points, Level...', required: true },
                    { id: 'persistence', label: 'Save Stats', type: 'radio', options: ['Yes', 'No'], default: 'Yes' }
                ],
                generate: (d) => `Create a Leaderstats system.

LOCATION: Script in ServerScriptService

STATS: ${d.stats ? d.stats.join(', ') : 'Points'}

IMPLEMENTATION:
game.Players.PlayerAdded:Connect(function(player)
    -- Create leaderstats folder
    local leaderstats = Instance.new("Folder")
    leaderstats.Name = "leaderstats"
    leaderstats.Parent = player

${d.stats ? d.stats.map(s => `    -- Create ${s}\n    local ${s.toLowerCase().replace(/\s+/g, '')} = Instance.new("IntValue")\n    ${s.toLowerCase().replace(/\s+/g, '')}.Name = "${s}"\n    ${s.toLowerCase().replace(/\s+/g, '')}.Parent = leaderstats`).join('\n\n') : ''}
${d.persistence === 'Yes' ? '\n    -- Load saved values from DataStore here' : '\n    -- Initialize all to 0'}
end)
${d.persistence === 'Yes' ? '\nAdd PlayerRemoving to save values to DataStore.' : ''}`
            },

            'custom': {
                name: 'Custom Large System',
                fields: [
                    { id: 'systemName', label: 'System Name', type: 'text', required: true, placeholder: 'Quest System, Crafting, etc.' },
                    { id: 'purpose', label: 'System Purpose', type: 'textarea', required: true, placeholder: 'What should this system do?' },
                    { id: 'features', label: 'Features', type: 'list', placeholder: 'Feature 1, Feature 2...', required: true },
                    { id: 'gui', label: 'GUI Requirements', type: 'textarea', placeholder: 'Describe any UI needed' },
                    { id: 'dataStore', label: 'Data Persistence', type: 'radio', options: ['Yes', 'No'], default: 'No' }
                ],
                generate: (d) => `Create a ${d.systemName}.

PURPOSE: ${d.purpose}

FEATURES:
${d.features ? d.features.map((f, i) => `${i + 1}. ${f}`).join('\n') : ''}

STRUCTURE:
- LocalScript in StarterPlayerScripts (client logic${d.gui ? ', GUI' : ''})
- Script in ServerScriptService (server logic, validation)
- RemoteEvent/RemoteFunction in ReplicatedStorage
${d.gui ? `\nGUI (in LocalScript):\n${d.gui}\nCreate all UI elements using Instance.new()` : ''}
${d.dataStore === 'Yes' ? '\nDATA: Save relevant data to DataStore on PlayerRemoving, load on PlayerAdded' : ''}`
            }
        }
    },

    'bug-fixes': {
        name: 'Bug Fixes & Changes',
        description: 'Fix issues or modify existing code',
        templates: {
            'fix-bug': {
                name: 'Fix Specific Bug',
                fields: [
                    { id: 'system', label: 'Affected System', type: 'text', required: true, placeholder: 'Inventory System, Shop GUI...' },
                    { id: 'bug', label: 'Bug Description', type: 'textarea', required: true, placeholder: 'What is broken?' },
                    { id: 'expected', label: 'Expected Behavior', type: 'textarea', required: true, placeholder: 'What should happen?' },
                    { id: 'errors', label: 'Error Messages', type: 'textarea', placeholder: 'Paste any errors from Output' }
                ],
                generate: (d) => `Fix bug in ${d.system}.

PROBLEM: ${d.bug}

EXPECTED: ${d.expected}
${d.errors ? `\nERROR OUTPUT:\n${d.errors}` : ''}

Please identify the cause and provide the corrected code.`
            },

            'optimize': {
                name: 'Performance Optimization',
                fields: [
                    { id: 'system', label: 'System to Optimize', type: 'text', required: true },
                    { id: 'issue', label: 'Performance Issue', type: 'select', options: ['Lag/Low FPS', 'Memory Leak', 'Slow Script'], default: 'Lag/Low FPS' },
                    { id: 'description', label: 'Issue Description', type: 'textarea', required: true, placeholder: 'When does the lag occur?' }
                ],
                generate: (d) => `Optimize ${d.system} for ${d.issue.toLowerCase()}.

ISSUE: ${d.description}

Check for:
- Unnecessary loops or frequent GetChildren/FindFirstChild calls
- Missing connection disconnects (memory leaks)
- Heavy operations in RenderStepped (move to Heartbeat if possible)
- Objects not being Destroyed when removed

Provide optimized code with comments explaining changes.`
            },

            'add-feature': {
                name: 'Add Feature to Existing Code',
                fields: [
                    { id: 'system', label: 'System to Modify', type: 'text', required: true, placeholder: 'Shop System, Combat...' },
                    { id: 'feature', label: 'Feature to Add', type: 'textarea', required: true, placeholder: 'What should be added?' },
                    { id: 'preserve', label: 'Must Preserve', type: 'textarea', placeholder: 'What functionality must stay the same?' }
                ],
                generate: (d) => `Add feature to ${d.system}.

NEW FEATURE: ${d.feature}
${d.preserve ? `\nPRESERVE: ${d.preserve}` : ''}

Add this feature while keeping existing functionality intact. Show only the modified/new code sections.`
            },

            'custom': {
                name: 'Custom Bug Fix/Change',
                fields: [
                    { id: 'description', label: 'Description', type: 'textarea', required: true, placeholder: 'Describe what needs to change' }
                ],
                generate: (d) => d.description
            }
        }
    },

    'ui-systems': {
        name: 'UI & Interface',
        description: 'GUIs, menus, and visual interfaces',
        templates: {
            'main-menu': {
                name: 'Main Menu',
                fields: [
                    { id: 'buttons', label: 'Menu Buttons', type: 'list', placeholder: 'Play, Settings, Shop...', required: true },
                    { id: 'style', label: 'Menu Style', type: 'select', options: ['Modern', 'Minimal', 'Classic'], default: 'Modern' },
                    { id: 'animations', label: 'Button Animations', type: 'radio', options: ['Smooth tweens', 'Simple', 'None'], default: 'Smooth tweens' }
                ],
                generate: (d) => `Create a ${d.style} Main Menu.

LOCATION: LocalScript in StarterPlayerScripts

BUTTONS: ${d.buttons ? d.buttons.join(', ') : 'Play, Settings'}

IMPLEMENTATION:
1. Create ScreenGui with Instance.new(), parent to PlayerGui
2. Create main Frame centered on screen (use AnchorPoint 0.5, 0.5)
3. Add title TextLabel at top
4. Create buttons using Instance.new("TextButton") for each:
${d.buttons ? d.buttons.map(b => `   - ${b}`).join('\n') : '   - Play\n   - Settings'}
5. Use UIListLayout for vertical button arrangement
${d.animations === 'Smooth tweens' ? '6. Add hover effects: TweenService to scale buttons to 1.05 on MouseEnter, back to 1 on MouseLeave' : ''}
${d.animations === 'Simple' ? '6. Change BackgroundColor3 on hover' : ''}
7. Connect button.Activated to respective functions
8. Disable PlayerControls while menu is open (optional)`
            },

            'hud': {
                name: 'HUD/Overlay',
                fields: [
                    { id: 'elements', label: 'HUD Elements', type: 'list', placeholder: 'Health bar, coin counter...', required: true },
                    { id: 'position', label: 'HUD Position', type: 'select', options: ['Top', 'Bottom', 'Corners'], default: 'Top' }
                ],
                generate: (d) => `Create a HUD overlay.

LOCATION: LocalScript in StarterPlayerScripts

ELEMENTS: ${d.elements ? d.elements.join(', ') : 'Health, Coins'}

IMPLEMENTATION:
1. Create ScreenGui with Instance.new()
2. Create container Frame at ${d.position.toLowerCase()} of screen
3. For each element:
${d.elements ? d.elements.map(e => `   - ${e}: Frame with icon ImageLabel and value TextLabel`).join('\n') : ''}
4. Use UIListLayout for horizontal arrangement
5. Create update functions that change TextLabel.Text when values change
6. Connect to value changes:
   - Health: Humanoid.HealthChanged
   - Currency: leaderstats value.Changed
   - Other: appropriate events`
            },

            'notification': {
                name: 'Notification System',
                fields: [
                    { id: 'types', label: 'Notification Types', type: 'list', placeholder: 'Success, Error, Warning...', required: true },
                    { id: 'duration', label: 'Display Duration (seconds)', type: 'number', default: '3' }
                ],
                generate: (d) => `Create a Notification System.

LOCATION: LocalScript in StarterPlayerScripts

TYPES: ${d.types ? d.types.join(', ') : 'Info, Success, Error'}

IMPLEMENTATION:
1. Create ScreenGui with container Frame at top-right
2. Define colors for each type:
${d.types ? d.types.map(t => `   - ${t}: appropriate color`).join('\n') : '   - Success: green\n   - Error: red'}

ShowNotification(message, type) function:
1. Create notification Frame with Instance.new()
2. Add TextLabel with message
3. Set BackgroundColor3 based on type
4. Tween position from off-screen to visible
5. Wait ${d.duration} seconds
6. Tween out and Destroy

Use UIListLayout so multiple notifications stack properly.`
            },

            'inventory-gui': {
                name: 'Inventory GUI',
                fields: [
                    { id: 'layout', label: 'Layout', type: 'select', options: ['Grid', 'List', 'Hotbar'], default: 'Grid' },
                    { id: 'slots', label: 'Visible Slots', type: 'number', default: '20' },
                    { id: 'dragDrop', label: 'Drag and Drop', type: 'radio', options: ['Yes', 'No'], default: 'Yes' }
                ],
                generate: (d) => `Create an Inventory GUI with ${d.layout.toLowerCase()} layout.

LOCATION: LocalScript in StarterPlayerScripts

SLOTS: ${d.slots}

IMPLEMENTATION:
1. Create ScreenGui and main Frame
2. Create ${d.slots} slot frames using a loop
3. ${d.layout === 'Grid' ? 'Use UIGridLayout for grid arrangement' : d.layout === 'List' ? 'Use UIListLayout for vertical list' : 'Use UIListLayout horizontal for hotbar at bottom'}
4. Each slot contains:
   - ImageLabel for item icon
   - TextLabel for quantity (bottom-right corner)
   - Background that changes when selected/hovered
${d.dragDrop === 'Yes' ? `
DRAG AND DROP:
1. On MouseButton1Down: start drag, create clone following mouse
2. Track with UserInputService.InputChanged
3. On MouseButton1Up: check if over valid slot, swap items
4. Fire RemoteEvent to server to validate move` : ''}
5. Add tooltip Frame that shows item details on hover`
            },

            'settings-menu': {
                name: 'Settings Menu',
                fields: [
                    { id: 'settings', label: 'Settings', type: 'list', placeholder: 'Graphics, volume...', required: true },
                    { id: 'save', label: 'Save Settings', type: 'radio', options: ['Yes (DataStore)', 'Session only'], default: 'Yes (DataStore)' }
                ],
                generate: (d) => `Create a Settings Menu.

LOCATION: LocalScript in StarterPlayerScripts

SETTINGS: ${d.settings ? d.settings.join(', ') : 'Volume, Graphics'}

IMPLEMENTATION:
1. Create ScreenGui with centered Frame
2. Add title "Settings" at top
3. For each setting, create a row with:
   - Label (TextLabel)
   - Control (Slider for volume, Dropdown for graphics, Toggle for on/off)

CONTROLS:
- Slider: Frame with draggable inner Frame, calculate value from position
- Toggle: TextButton that switches between states
- Dropdown: TextButton that shows/hides list of options

4. Add "Save" and "Close" buttons at bottom
5. Apply settings when changed (adjust volume, graphics quality, etc.)
${d.save === 'Yes (DataStore)' ? '\n6. Fire RemoteEvent to save settings to DataStore\n7. Load saved settings on join via RemoteFunction' : ''}`
            },

            'custom': {
                name: 'Custom UI',
                fields: [
                    { id: 'guiName', label: 'GUI Name', type: 'text', required: true },
                    { id: 'purpose', label: 'GUI Purpose', type: 'textarea', required: true, placeholder: 'What should this GUI do?' },
                    { id: 'elements', label: 'UI Elements', type: 'list', placeholder: 'Buttons, frames, text...', required: true }
                ],
                generate: (d) => `Create ${d.guiName} GUI.

LOCATION: LocalScript in StarterPlayerScripts

PURPOSE: ${d.purpose}

ELEMENTS:
${d.elements ? d.elements.map(e => `- ${e}`).join('\n') : ''}

Create all elements using Instance.new(). Parent ScreenGui to PlayerGui.
Use TweenService for any animations. Connect button events with .Activated.`
            }
        }
    },

    'gameplay-features': {
        name: 'Gameplay Features',
        description: 'Common game mechanics and player systems',
        templates: {
            'teams': {
                name: 'Team System',
                fields: [
                    { id: 'teams', label: 'Team Names', type: 'list', placeholder: 'Red Team, Blue Team...', required: true },
                    { id: 'autoAssign', label: 'Auto-Assign Teams', type: 'radio', options: ['Yes - Random', 'Yes - Balanced', 'No - Manual'], default: 'Yes - Balanced' },
                    { id: 'teamColors', label: 'Custom Team Colors', type: 'radio', options: ['Yes', 'No'], default: 'No' },
                    { id: 'friendlyFire', label: 'Friendly Fire', type: 'radio', options: ['Enabled', 'Disabled'], default: 'Disabled' },
                    { id: 'spawnLocations', label: 'Team Spawn Points', type: 'radio', options: ['Yes', 'No'], default: 'Yes' }
                ],
                generate: (d) => `Create a Team System with: ${d.teams ? d.teams.join(', ') : 'Teams'}.

LOCATION: Script in ServerScriptService

SETUP:
1. Create Team instances in game.Teams for each: ${d.teams ? d.teams.join(', ') : 'team'}
${d.teamColors === 'Yes' ? '2. Set unique TeamColor for each team' : '2. Use default team colors'}
${d.spawnLocations === 'Yes' ? '3. Create SpawnLocation parts with matching TeamColor properties' : ''}

ASSIGNMENT:
${d.autoAssign === 'Yes - Random' ? 'On PlayerAdded: assign player to random team using math.random()' : ''}
${d.autoAssign === 'Yes - Balanced' ? 'On PlayerAdded: count players on each team, assign to team with fewest members' : ''}
${d.autoAssign === 'No - Manual' ? 'Create team selection GUI with buttons. On button click, fire RemoteEvent to set player.Team' : ''}

${d.friendlyFire === 'Disabled' ? 'FRIENDLY FIRE PREVENTION:\nIn damage script: check if attacker.Team == victim.Team, if yes cancel damage' : ''}

Players automatically spawn at their team's SpawnLocation and get team-colored name.`
            },

            'teleport': {
                name: 'Teleportation System',
                fields: [
                    { id: 'teleportType', label: 'Teleport Type', type: 'select', options: ['Part Proximity', 'GUI Button', 'Command', 'All'], default: 'Part Proximity' },
                    { id: 'destinations', label: 'Destination Names', type: 'list', placeholder: 'Lobby, Arena, Shop...', required: true },
                    { id: 'cooldown', label: 'Cooldown (seconds)', type: 'number', default: '5' },
                    { id: 'effect', label: 'Teleport Effect', type: 'radio', options: ['Particles + Sound', 'Simple fade', 'None'], default: 'Particles + Sound' }
                ],
                generate: (d) => `Create Teleportation System for: ${d.destinations ? d.destinations.join(', ') : 'locations'}.

STRUCTURE:
- Script in ServerScriptService
- Parts in Workspace marking each destination location
${d.teleportType.includes('GUI') || d.teleportType === 'All' ? '- LocalScript for teleport menu GUI' : ''}
- RemoteEvent for teleport requests

DESTINATIONS:
Place Parts at each location: ${d.destinations ? d.destinations.join(', ') : 'destinations'}
Name them clearly and save their CFrame positions

${d.teleportType.includes('Part') || d.teleportType === 'All' ? `PROXIMITY PADS:
Create teleport pads with ProximityPrompt
On Triggered: check ${d.cooldown}s cooldown, then teleport player to destination CFrame` : ''}

${d.teleportType.includes('GUI') || d.teleportType === 'All' ? `GUI MENU:
Create buttons for each destination
On click: fire RemoteEvent with destination name` : ''}

${d.teleportType.includes('Command') || d.teleportType === 'All' ? `CHAT COMMAND:
Listen for player.Chatted
Parse "/tp [destination]" commands
Validate and teleport` : ''}

COOLDOWN: Track last teleport time per player in table, require ${d.cooldown}s between uses

TELEPORT: Set player.Character.HumanoidRootPart.CFrame to destination + Vector3.new(0,3,0)

${d.effect === 'Particles + Sound' ? 'Add ParticleEmitter burst and sound at departure/arrival positions' : ''}
${d.effect === 'Simple fade' ? 'Fire RemoteEvent to client to show white fade in/out during teleport' : ''}`
            },

            'admin': {
                name: 'Admin Commands System',
                fields: [
                    { id: 'adminList', label: 'Admin User IDs', type: 'list', placeholder: '123456789, 987654321...', required: true },
                    { id: 'commands', label: 'Commands to Include', type: 'checkboxes',
                      options: ['Kick', 'Teleport', 'Give Item', 'Speed', 'Kill', 'Heal', 'Announce'],
                      default: [] },
                    { id: 'prefix', label: 'Command Prefix', type: 'text', default: ':', required: true },
                    { id: 'logging', label: 'Log Admin Actions', type: 'radio', options: ['Yes', 'No'], default: 'Yes' }
                ],
                generate: (d) => `Create Admin Commands System.

LOCATION: Script in ServerScriptService
PREFIX: ${d.prefix}
ADMINS: ${d.adminList ? d.adminList.join(', ') : 'Admin UserIds'}

SETUP:
1. Store admin UserIds in table
2. Create IsAdmin(player) function to check if player.UserId is in table
3. Connect to player.Chatted for each player
4. Parse messages starting with "${d.prefix}"

COMMANDS:
${d.commands.includes('Kick') ? `${d.prefix}kick [player] - Find player by name, call player:Kick()` : ''}
${d.commands.includes('Teleport') ? `${d.prefix}tp [player1] [player2] - Teleport player1 to player2's position` : ''}
${d.commands.includes('Give Item') ? `${d.prefix}give [player] [item] - Clone item from Storage to player's Backpack` : ''}
${d.commands.includes('Speed') ? `${d.prefix}speed [player] [value] - Set player.Character.Humanoid.WalkSpeed` : ''}
${d.commands.includes('Kill') ? `${d.prefix}kill [player] - Set player.Character.Humanoid.Health = 0` : ''}
${d.commands.includes('Heal') ? `${d.prefix}heal [player] - Set Health to MaxHealth` : ''}
${d.commands.includes('Announce') ? `${d.prefix}announce [message] - Fire RemoteEvent to all clients to show message` : ''}

Create FindPlayer(name) function to match partial player names
${d.logging === 'Yes' ? 'Print all command usage to console with admin name and target' : ''}`
            },

            'animations': {
                name: 'Animation Controller',
                fields: [
                    { id: 'animType', label: 'Animation Type', type: 'select',
                      options: ['Tool/Weapon Animations', 'Emotes/Gestures', 'Custom Movement'], default: 'Tool/Weapon Animations' },
                    { id: 'animations', label: 'Animation Names', type: 'list', placeholder: 'Swing, Slash, Block...', required: true },
                    { id: 'priority', label: 'Animation Priority', type: 'select',
                      options: ['Action', 'Movement', 'Core'], default: 'Action' },
                    { id: 'keybinds', label: 'Keyboard Controls', type: 'radio', options: ['Yes', 'No'], default: 'No' }
                ],
                generate: (d) => `Create Animation Controller for: ${d.animations ? d.animations.join(', ') : 'animations'}.

LOCATION: LocalScript in StarterPlayerScripts

SETUP:
1. Create Animation objects in ReplicatedStorage with AnimationId properties
2. Wait for character, get Humanoid's Animator
3. Use Animator:LoadAnimation() for each animation
4. Store loaded tracks in table with names: ${d.animations ? d.animations.join(', ') : 'animations'}
5. Set Priority to ${d.priority}

${d.animType === 'Tool/Weapon Animations' ? `TOOL TRIGGERS:
Detect when tool equipped (character.ChildAdded)
On tool.Activated: play attack animation
Cycle through multiple animations if needed` : ''}

${d.animType === 'Emotes/Gestures' ? `EMOTE BUTTONS:
Create GUI with button for each emote
On click: stop current animation, play selected emote` : ''}

${d.animType === 'Custom Movement' ? `MOVEMENT STATES:
Connect to Humanoid.Running and Humanoid.StateChanged
Play appropriate animations based on movement state` : ''}

${d.keybinds === 'Yes' ? `KEYBOARD CONTROLS:
Use UserInputService.InputBegan
Map keys to animations, add cooldown to prevent spam` : ''}

Control animations with track:Play() and track:Stop()`
            },

            'achievements': {
                name: 'Achievement System',
                fields: [
                    { id: 'achievements', label: 'Achievement Names', type: 'list', placeholder: 'First Win, 100 Coins, Level 10...', required: true },
                    { id: 'notifications', label: 'Achievement Notifications', type: 'radio', options: ['Yes', 'No'], default: 'Yes' },
                    { id: 'rewards', label: 'Give Rewards', type: 'radio', options: ['Yes (coins/items)', 'No'], default: 'No' },
                    { id: 'saving', label: 'Save Achievements', type: 'radio', options: ['Yes', 'No'], default: 'Yes' }
                ],
                generate: (d) => `Create Achievement System for: ${d.achievements ? d.achievements.join(', ') : 'achievements'}.

STRUCTURE:
- Script in ServerScriptService
- ModuleScript defining all achievements with descriptions${d.rewards === 'Yes (coins/items)' ? ' and rewards' : ''}
${d.notifications === 'Yes' ? '- LocalScript for notification popup\n- RemoteEvent to trigger popups' : ''}
${d.saving === 'Yes' ? '- DataStore to save earned achievements' : ''}

TRACKING:
${d.saving === 'Yes' ? 'Load/save earned achievements per player using DataStore' : 'Store earned achievements in session table (resets on leave)'}

GRANTING:
Create GrantAchievement(player, achievementName) function:
1. Check if already earned (prevent duplicates)
2. Add to player's achievements list
${d.rewards === 'Yes (coins/items)' ? '3. Award coins or items defined in achievement data' : ''}
${d.notifications === 'Yes' ? '4. Fire RemoteEvent to show popup on client' : ''}
${d.saving === 'Yes' ? '5. Save to DataStore' : ''}

TRIGGERS:
Call GrantAchievement() when player reaches milestones (wins game, collects 100 coins, reaches level, etc.)

${d.notifications === 'Yes' ? 'POPUP: Create GUI that tweens in from off-screen, shows achievement name/icon, displays 3-5 seconds, tweens out' : ''}`
            },

            'proximity': {
                name: 'Proximity Interaction',
                fields: [
                    { id: 'interactType', label: 'Interaction Type', type: 'select',
                      options: ['Collect Items', 'Open Doors', 'Talk to NPCs', 'Activate Objects'], default: 'Collect Items' },
                    { id: 'promptText', label: 'Prompt Text', type: 'text', default: 'Press E to interact', required: true },
                    { id: 'maxDistance', label: 'Interaction Range (studs)', type: 'number', default: '10' },
                    { id: 'holdDuration', label: 'Hold Duration (0 for instant)', type: 'number', default: '0' },
                    { id: 'objectTag', label: 'Tag for Interactive Objects', type: 'text', default: 'Interactable', required: true }
                ],
                generate: (d) => `Create Proximity Interaction for ${d.interactType}.

LOCATION: Script in ServerScriptService

SETUP:
1. Use CollectionService to find all objects tagged "${d.objectTag}"
2. For each object, create ProximityPrompt with:
   - ActionText = "${d.promptText}"
   - MaxActivationDistance = ${d.maxDistance}
   - HoldDuration = ${d.holdDuration}
   - KeyboardKeyCode = E

INTERACTION:
Connect to ProximityPrompt.Triggered for each object

${d.interactType === 'Collect Items' ? 'When triggered: add item to player inventory/stats, destroy object, play sound' : ''}
${d.interactType === 'Open Doors' ? 'When triggered: check if locked, if not tween door open, wait, tween closed' : ''}
${d.interactType === 'Talk to NPCs' ? 'When triggered: fire RemoteEvent with NPC dialogue, show on client GUI' : ''}
${d.interactType === 'Activate Objects' ? 'When triggered: toggle object state, trigger connected systems (buttons, levers, chests)' : ''}

Tag objects in Studio using CollectionService or Tag Editor plugin with "${d.objectTag}"`
            }
        }
    },

    'utilities': {
        name: 'Utilities & Helpers',
        description: 'Helper systems and convenience tools',
        templates: {
            'chatcommands': {
                name: 'Player Chat Commands',
                fields: [
                    { id: 'commands', label: 'Command Names', type: 'list', placeholder: 'help, stats, reset...', required: true },
                    { id: 'prefix', label: 'Command Prefix', type: 'text', default: '/', required: true },
                    { id: 'feedback', label: 'Command Feedback', type: 'radio', options: ['Chat messages', 'GUI notifications', 'Both'], default: 'Chat messages' }
                ],
                generate: (d) => `Create Chat Commands System.

PREFIX: ${d.prefix}
COMMANDS: ${d.commands ? d.commands.join(', ') : 'help, stats'}

LOCATION: Script in ServerScriptService

SETUP:
1. Connect to player.Chatted for each player
2. Check if message starts with "${d.prefix}"
3. Parse command name and arguments (split by spaces)

COMMANDS:
${d.commands ? d.commands.map(cmd => `${d.prefix}${cmd} - Define behavior for this command`).join('\n') : 'Define command functions'}

FEEDBACK:
${d.feedback === 'Chat messages' || d.feedback === 'Both' ? 'Send responses using game.StarterGui:SetCore("ChatMakeSystemMessage")' : ''}
${d.feedback === 'GUI notifications' || d.feedback === 'Both' ? 'Fire RemoteEvent to show GUI popup on client' : ''}

Add cooldown (1-2 seconds) to prevent spam
Show error for unknown commands or missing arguments`
            },

            'soundmanager': {
                name: 'Sound Manager',
                fields: [
                    { id: 'soundTypes', label: 'Sound Categories', type: 'list', placeholder: 'Music, SFX, Ambience...', required: true },
                    { id: 'volumeControl', label: 'Player Volume Control', type: 'radio', options: ['Yes', 'No'], default: 'Yes' },
                    { id: 'persistence', label: 'Save Volume Preferences', type: 'radio', options: ['Yes', 'No'], default: 'Yes' }
                ],
                generate: (d) => `Create Sound Manager System.

CATEGORIES: ${d.soundTypes ? d.soundTypes.join(', ') : 'Sound types'}

LOCATION: LocalScript in StarterPlayerScripts

STRUCTURE:
Organize sounds in ReplicatedStorage folders by category: ${d.soundTypes ? d.soundTypes.join(', ') : 'categories'}

PLAYING SOUNDS:
Create PlaySound(soundName, category) function:
1. Clone sound from storage
2. Set Volume based on category setting
3. Parent to SoundService or Workspace
4. Play and auto-destroy when ended

${d.volumeControl === 'Yes' ? `VOLUME CONTROLS:
Create settings GUI with slider for each category
When adjusted: update all playing sounds in that category
${d.persistence === 'Yes' ? 'Save settings to DataStore, load on join' : 'Settings reset on leave'}` : 'Use default volumes'}

Categories can be controlled independently (mute music but keep SFX)`
            },

            'servermessages': {
                name: 'Server Message System',
                fields: [
                    { id: 'messageTypes', label: 'Message Types', type: 'checkboxes',
                      options: ['Announcements', 'Warnings', 'Tips', 'Events'], default: ['Announcements'] },
                    { id: 'displayMethod', label: 'Display Method', type: 'select',
                      options: ['Top banner', 'Center screen', 'Chat messages'], default: 'Top banner' },
                    { id: 'duration', label: 'Display Duration (seconds)', type: 'number', default: '5' },
                    { id: 'colors', label: 'Color-Coded Types', type: 'radio', options: ['Yes', 'No'], default: 'Yes' }
                ],
                generate: (d) => `Create Server Message System.

TYPES: ${d.messageTypes ? d.messageTypes.join(', ') : 'Messages'}
DISPLAY: ${d.displayMethod}

STRUCTURE:
- Script in ServerScriptService (sends messages)
- LocalScript in StarterPlayerScripts (displays messages)
- RemoteEvent "ServerMessage"

SENDING (Server):
Create BroadcastMessage(text, type) function
Fire RemoteEvent:FireAllClients(text, type)

DISPLAYING (Client):
${d.displayMethod === 'Top banner' ? `Create banner Frame at top of screen
${d.colors === 'Yes' ? 'Color-code by message type' : ''}
Tween in, display ${d.duration}s, tween out` : ''}
${d.displayMethod === 'Center screen' ? `Create centered Frame with semi-transparent background
${d.colors === 'Yes' ? 'Border color by type' : ''}
Fade in, display ${d.duration}s, fade out` : ''}
${d.displayMethod === 'Chat messages' ? `Use StarterGui:SetCore("ChatMakeSystemMessage")
${d.colors === 'Yes' ? 'Set Color property by type' : ''}
Appears in chat window` : ''}

Queue multiple messages to prevent overlap
Allow admins to send custom messages with command`
            }
        }
    },

    'multiplayer-systems': {
        name: 'Multiplayer & Social',
        description: 'Player interaction and social features',
        templates: {
            'party': {
                name: 'Party/Group System',
                fields: [
                    { id: 'maxPartySize', label: 'Max Party Size', type: 'number', default: '4', required: true },
                    { id: 'partyLeader', label: 'Party Leader Privileges', type: 'checkboxes',
                      options: ['Kick members', 'Invite players', 'Start games'], default: [] },
                    { id: 'partyChat', label: 'Party-Only Chat', type: 'radio', options: ['Yes', 'No'], default: 'Yes' },
                    { id: 'partyGui', label: 'Party GUI', type: 'radio', options: ['Yes', 'No'], default: 'Yes' }
                ],
                generate: (d) => `Create Party System (max ${d.maxPartySize} members).

STRUCTURE:
- Script in ServerScriptService
- ModuleScript to store party data (parties table with leader and members)
- RemoteEvents for party actions

FUNCTIONS:
- CreateParty(player) - Make new party with player as leader
- InviteToParty(leader, targetName) - Send 30-second invite
- JoinParty(player, partyId) - Add player if under ${d.maxPartySize}
- LeaveParty(player) - Remove player from current party
${d.partyLeader.includes('Kick members') ? '- KickFromParty(leader, target) - Leader can remove members' : ''}

${d.partyChat === 'Yes' ? 'PARTY CHAT:\nListen for "/p [message]" in Chatted event, send only to party members' : ''}

${d.partyGui === 'Yes' ? `GUI:\nShow party member list, leader has crown icon, invite/leave buttons
${d.partyLeader.includes('Kick members') ? 'Leader sees kick buttons next to members' : ''}` : ''}

On PlayerRemoving: remove from party, promote new leader if needed, delete empty parties`
            },

            'trading': {
                name: 'Player Trading System',
                fields: [
                    { id: 'tradeableItems', label: 'What Can Be Traded', type: 'checkboxes',
                      options: ['Inventory items', 'Currency', 'Pets', 'Weapons'], default: ['Inventory items'] },
                    { id: 'tradeDistance', label: 'Max Trade Distance', type: 'number', default: '20' },
                    { id: 'confirmation', label: 'Confirmation Type', type: 'select',
                      options: ['Both players confirm', '5 second countdown', 'Instant'], default: 'Both players confirm' }
                ],
                generate: (d) => `Create Player Trading System.

TRADEABLE: ${d.tradeableItems ? d.tradeableItems.join(', ') : 'Items'}

STRUCTURE:
- Script in ServerScriptService
- LocalScript for trade window GUI
- RemoteEvents: RequestTrade, OfferItem, ConfirmTrade, CancelTrade

STARTING TRADE:
Player uses "/trade [name]" or proximity button
Check both players within ${d.tradeDistance} studs
Create trade session storing both players' offerings

TRADE WINDOW:
Split screen: your items (left) | their items (right)
Drag items to offer, fire OfferItem RemoteEvent
Server validates ownership and updates both windows

${d.confirmation === 'Both players confirm' ? 'CONFIRM: Both click Confirm to lock offerings, then both Accept to execute' : ''}
${d.confirmation === '5 second countdown' ? 'CONFIRM: 5 second countdown starts when both have items, auto-executes at 0' : ''}
${d.confirmation === 'Instant' ? 'CONFIRM: Instant trade when Trade button clicked' : ''}

EXECUTE:
Validate items still exist and players still in range
Swap items between inventories
Clear trade session and close windows`
            },

            'friends': {
                name: 'In-Game Friends System',
                fields: [
                    { id: 'features', label: 'Friend Features', type: 'checkboxes',
                      options: ['See online friends', 'Friend requests', 'Join friend server', 'Gift items'],
                      default: ['See online friends', 'Friend requests'] },
                    { id: 'maxFriends', label: 'Max Friends Per Player', type: 'number', default: '50' },
                    { id: 'persistence', label: 'Save Friend Lists', type: 'radio', options: ['Yes', 'No'], default: 'Yes' }
                ],
                generate: (d) => `Create Friends System (max ${d.maxFriends} friends).

STRUCTURE:
- Script in ServerScriptService
- LocalScript for friends GUI
${d.persistence === 'Yes' ? '- DataStore for friend lists' : ''}
- RemoteEvents for friend actions

${d.persistence === 'Yes' ? 'DATA: Save Friends table, PendingRequests, SentRequests per player' : 'SESSION DATA: Friends stored in table, resets on leave'}

${d.features.includes('Friend requests') ? `REQUESTS:
SendRequest(from, toName) - Add to receiver's PendingRequests
AcceptRequest(player, fromId) - Add both to each other's Friends lists
DeclineRequest(player, fromId) - Remove from pending` : ''}

${d.features.includes('See online friends') ? 'ONLINE STATUS: Check if friend UserIds are in game.Players, show with green dot' : ''}

${d.features.includes('Join friend server') ? 'JOIN FRIEND: Use TeleportService with MessagingService to get friend JobId' : ''}

${d.features.includes('Gift items') ? 'GIFTING: Select friend and item, send to their pending gifts inbox' : ''}

GUI: Tabs for friends list and requests, buttons to add/remove/join friends
Enforce ${d.maxFriends} friend limit`
            },

            'leaderboard': {
                name: 'Global Leaderboard',
                fields: [
                    { id: 'statType', label: 'Stat to Track', type: 'text', required: true, placeholder: 'Wins, Points, Time, Level...' },
                    { id: 'topCount', label: 'Show Top Players', type: 'number', default: '10' },
                    { id: 'updateFrequency', label: 'Update Frequency', type: 'select',
                      options: ['Real-time', 'Every 30 seconds', 'Every 5 minutes'], default: 'Every 30 seconds' },
                    { id: 'scope', label: 'Leaderboard Type', type: 'radio', options: ['Server-only', 'Global (all servers)'], default: 'Global (all servers)' }
                ],
                generate: (d) => `Create Leaderboard tracking ${d.statType} (top ${d.topCount}).

STRUCTURE:
- Script in ServerScriptService
${d.scope === 'Global (all servers)' ? '- OrderedDataStore for global rankings' : ''}
- LocalScript for leaderboard GUI
- RemoteFunction to get rankings

${d.scope === 'Global (all servers)' ? `GLOBAL:
Use OrderedDataStore:GetSortedAsync() to get top ${d.topCount}
Update OrderedDataStore when player's ${d.statType} changes
Use Players:GetNameFromUserIdAsync() for usernames` : `SERVER-ONLY:
Loop through game.Players, get ${d.statType} from leaderstats
Sort by value, return top ${d.topCount}`}

GUI:
Create ScrollingFrame with entries for each rank
Show: rank number, username, ${d.statType} value
Highlight current player's entry

${d.updateFrequency === 'Real-time' ? 'Update when any player\'s stat changes' : `Update every ${d.updateFrequency === 'Every 30 seconds' ? '30' : '300'} seconds`}`
            }
        }
    },

    'game-modes': {
        name: 'Game Modes',
        description: 'Complete game mode systems',
        templates: {
            'round': {
                name: 'Round-Based Game',
                fields: [
                    { id: 'roundDuration', label: 'Round Duration (seconds)', type: 'number', default: '180', required: true },
                    { id: 'intermission', label: 'Intermission Time (seconds)', type: 'number', default: '15' },
                    { id: 'minPlayers', label: 'Min Players to Start', type: 'number', default: '2' },
                    { id: 'winCondition', label: 'Win Condition', type: 'select',
                      options: ['Last player alive', 'Most points', 'Time runs out'], default: 'Last player alive' },
                    { id: 'rewards', label: 'Winner Rewards', type: 'radio', options: ['Yes', 'No'], default: 'Yes' }
                ],
                generate: (d) => `Create Round-Based Game (${d.roundDuration}s rounds, ${d.intermission}s intermission).

LOCATION: Script in ServerScriptService

ROUND LOOP:
1. WAITING: repeat until Players >= ${d.minPlayers}
2. INTERMISSION: countdown ${d.intermission} seconds
3. START: teleport players to arena, reset characters
4. ACTIVE: run for ${d.roundDuration}s or until win condition met
5. END: declare winner, award rewards, cleanup

WIN CONDITION:
${d.winCondition === 'Last player alive' ? 'Check alive players each loop, winner when only 1 remains' : ''}
${d.winCondition === 'Most points' ? 'At round end, find player with highest Points in leaderstats' : ''}
${d.winCondition === 'Time runs out' ? 'When timer reaches 0, surviving players win' : ''}

${d.rewards === 'Yes' ? 'REWARDS: Add to winner\'s leaderstats.Wins and Coins' : ''}

Use StringValue "Status" in ReplicatedStorage to show current phase
Loop continuously, resetting after each round`
            },

            'battle-royale': {
                name: 'Battle Royale Mode',
                fields: [
                    { id: 'shrinkingZone', label: 'Shrinking Safe Zone', type: 'radio', options: ['Yes', 'No'], default: 'Yes' },
                    { id: 'shrinkInterval', label: 'Zone Shrinks Every (seconds)', type: 'number', default: '60',
                      show_if: { field: 'shrinkingZone', value: 'Yes' } },
                    { id: 'lootSpawns', label: 'Random Loot', type: 'radio', options: ['Yes', 'No'], default: 'Yes' },
                    { id: 'startingPlayers', label: 'Min Players to Start', type: 'number', default: '10' },
                    { id: 'spectate', label: 'Spectate After Death', type: 'radio', options: ['Yes', 'No'], default: 'Yes' }
                ],
                generate: (d) => `Create Battle Royale Mode (min ${d.startingPlayers} players).

STRUCTURE:
- Script in ServerScriptService
${d.shrinkingZone === 'Yes' ? '- Part "SafeZone" in Workspace (transparent sphere)' : ''}
- Folder "SpawnPoints" with many spawn parts
${d.lootSpawns === 'Yes' ? '- Folder "LootItems" in ServerStorage' : ''}

START:
Wait for ${d.startingPlayers}+ players, teleport to random spawn points

${d.shrinkingZone === 'Yes' ? `SAFE ZONE:
Every ${d.shrinkInterval}s: tween SafeZone smaller and to new position
Players outside zone take 5 damage per second
Use RunService to check player distance from zone center` : ''}

${d.lootSpawns === 'Yes' ? 'LOOT: Spawn random items at loot points every 30s during match' : ''}

WIN: When only 1 player alive, award victory and coins

${d.spectate === 'Yes' ? 'SPECTATE: Dead players camera follows alive players' : 'Dead players wait in lobby'}

After winner declared, wait 10s and restart`
            },

            'tycoon': {
                name: 'Tycoon Game',
                fields: [
                    { id: 'claimMethod', label: 'How to Claim Tycoon', type: 'radio', options: ['Touch part', 'GUI button', 'Automatic'], default: 'Touch part' },
                    { id: 'moneyGen', label: 'Money Generation', type: 'select',
                      options: ['Droppers (physical coins)', 'Passive income', 'Both'], default: 'Droppers (physical coins)' },
                    { id: 'maxTycoons', label: 'Max Tycoons', type: 'number', default: '8' },
                    { id: 'saving', label: 'Save Progress', type: 'radio', options: ['Yes', 'No'], default: 'Yes' }
                ],
                generate: (d) => `Create Tycoon Game (${d.maxTycoons} tycoons).

SETUP:
Create ${d.maxTycoons} identical tycoon folders in Workspace
Each contains: Base, ClaimPart, Purchases folder, IntValue "Owner" (0=unclaimed), IntValue "Cash"

CLAIMING:
${d.claimMethod === 'Touch part' ? 'ClaimPart.Touched: if Owner==0, set Owner to player.UserId' : ''}
${d.claimMethod === 'GUI button' ? 'ProximityPrompt on ClaimPart to claim' : ''}
${d.claimMethod === 'Automatic' ? 'Auto-assign first unclaimed tycoon on PlayerAdded' : ''}

${d.moneyGen.includes('Droppers') ? `DROPPERS:
Loop spawning coin parts, on touch by owner: add to Cash, destroy coin` : ''}
${d.moneyGen.includes('Passive') ? `PASSIVE:
Loop adding 50 to Cash every 5 seconds` : ''}

PURCHASES:
Items in Purchases folder start invisible/non-solid
Create ProximityPrompt buttons with cost
On triggered: check owner, check Cash >= cost, deduct and unlock item

${d.saving === 'Yes' ? 'SAVE: DataStore tracks owned tycoon, Cash value, and purchased items' : 'RESET: On leave, reset Owner to 0'}`
            },

            'obby': {
                name: 'Obby/Parkour Course',
                fields: [
                    { id: 'stages', label: 'Number of Stages', type: 'number', default: '50', required: true },
                    { id: 'checkpoints', label: 'Checkpoint System', type: 'radio', options: ['Yes', 'No'], default: 'Yes' },
                    { id: 'timer', label: 'Show Completion Timer', type: 'radio', options: ['Yes', 'No'], default: 'Yes' },
                    { id: 'killBricks', label: 'Instant Kill Parts', type: 'radio', options: ['Yes', 'No'], default: 'Yes' },
                    { id: 'rewards', label: 'Stage Completion Rewards', type: 'radio', options: ['Yes (coins per stage)', 'No'], default: 'Yes (coins per stage)' }
                ],
                generate: (d) => `Create Obby with ${d.stages} stages.

STRUCTURE:
- Script in ServerScriptService
- ${d.stages} checkpoint parts in Workspace.Stages folder (named "1", "2", etc.)
${d.killBricks === 'Yes' ? '- Kill parts in KillBricks folder' : ''}

SETUP:
Create leaderstats.Stage (IntValue) starting at 1 for each player

${d.checkpoints === 'Yes' ? `CHECKPOINTS:
Each checkpoint: Part.Touched checks if player touched stage = their current stage + 1
If yes: update Stage value, set RespawnLocation to checkpoint
${d.rewards === 'Yes (coins per stage)' ? 'Award coins = stage * 10' : ''}
Stage ${d.stages} = completion, award bonus` : ''}

${d.killBricks === 'Yes' ? 'KILL BRICKS:\nPart.Touched: set Humanoid.Health = 0, player respawns at last checkpoint' : ''}

${d.timer === 'Yes' ? 'TIMER:\nLocalScript tracks time since spawn, displays in GUI, saves best time to OrderedDataStore' : ''}

Players respawn at their highest checkpoint reached`
            },

            'tag': {
                name: 'Tag/Chase Game',
                fields: [
                    { id: 'variant', label: 'Tag Type', type: 'select',
                      options: ['Classic Tag', 'Freeze Tag', 'Infection'], default: 'Classic Tag' },
                    { id: 'roundTime', label: 'Round Duration (seconds)', type: 'number', default: '120' },
                    { id: 'taggerBoost', label: 'Tagger Speed Boost', type: 'radio', options: ['Yes', 'No'], default: 'No' },
                    { id: 'safeZones', label: 'Temporary Safe Zones', type: 'radio', options: ['Yes', 'No'], default: 'No' }
                ],
                generate: (d) => `Create ${d.variant} game (${d.roundTime}s rounds).

STRUCTURE:
- Script in ServerScriptService
- RemoteEvents for tag updates
- LocalScript for visual effects

START:
Select random player as initial tagger
${d.variant === 'Infection' ? 'Create Survivors and Infected teams' : ''}
Mark tagger with red color${d.taggerBoost === 'Yes' ? ' and WalkSpeed 20' : ''}

${d.variant === 'Classic Tag' ? `TAGGING:
Use Touched event, when tagger touches player: transfer tagger status to new player` : ''}

${d.variant === 'Freeze Tag' ? `FREEZING:
Tagger touch freezes player (WalkSpeed=0, blue color)
Non-frozen players unfreeze by touching frozen players
Win: Tagger freezes all, or survivors last until timer ends` : ''}

${d.variant === 'Infection' ? `INFECTION:
Infected touch survivors to convert them to infected team
Win: All infected, or survivors last until timer` : ''}

${d.safeZones === 'Yes' ? 'SAFE ZONES: Parts where players can\'t be tagged, max 5s stay with 10s cooldown' : ''}

ROUND END:
Award coins based on performance, reset players, start new round`
            }
        }
    },

    'world-features': {
        name: 'World & Environment',
        description: 'Day/night cycles, weather, and world systems',
        templates: {
            'day-night': {
                name: 'Day/Night Cycle',
                fields: [
                    { id: 'cycleLength', label: 'Full Cycle Duration (minutes)', type: 'number', default: '20', required: true },
                    { id: 'startTime', label: 'Starting Time', type: 'select',
                      options: ['Dawn (6:00)', 'Noon (12:00)', 'Dusk (18:00)', 'Midnight (0:00)'], default: 'Noon (12:00)' },
                    { id: 'lighting', label: 'Lighting Changes', type: 'radio', options: ['Yes', 'No'], default: 'Yes' },
                    { id: 'effects', label: 'Time-Based Effects', type: 'checkboxes',
                      options: ['Street lights', 'Sky color changes', 'Spawn different NPCs'], default: [] }
                ],
                generate: (d) => `Create Day/Night Cycle (${d.cycleLength} minute cycle).

LOCATION: Script in ServerScriptService

SETUP:
Set Lighting.ClockTime to ${d.startTime === 'Dawn (6:00)' ? '6' : d.startTime === 'Noon (12:00)' ? '12' : d.startTime === 'Dusk (18:00)' ? '18' : '0'}

CYCLE:
Calculate: (24 hours * 60 minutes) / (${d.cycleLength} real minutes * 60 seconds) = minutes to add per second
Loop: add to ClockTime, wait 1 second, repeat

${d.lighting === 'Yes' ? 'LIGHTING:\nDay (6-18): Brightness 2, bright ambient\nNight (18-6): Brightness 0.5, dark blue ambient\nTween transitions smoothly' : ''}

${d.effects.includes('Street lights') ? 'STREET LIGHTS:\nTag lights with CollectionService, enable PointLight when ClockTime >= 18 or < 6' : ''}

${d.effects.includes('Sky color changes') ? 'SKY COLORS:\nTween Sky properties to match time (orange dawn, blue noon, red dusk, dark night)' : ''}

${d.effects.includes('Spawn different NPCs') ? 'NPCS:\nSpawn daytime NPCs (6-18), despawn and spawn nighttime NPCs (18-6)' : ''}`
            },

            'weather': {
                name: 'Dynamic Weather System',
                fields: [
                    { id: 'weatherTypes', label: 'Weather Types', type: 'checkboxes',
                      options: ['Rain', 'Snow', 'Fog', 'Thunderstorm', 'Sunny'], default: ['Rain', 'Sunny'], required: true },
                    { id: 'randomChanges', label: 'Random Weather Changes', type: 'radio', options: ['Yes', 'No'], default: 'Yes' },
                    { id: 'changeInterval', label: 'Weather Changes Every (minutes)', type: 'number', default: '5',
                      show_if: { field: 'randomChanges', value: 'Yes' } },
                    { id: 'effects', label: 'Weather Effects', type: 'radio', options: ['Visual only', 'Affects gameplay'], default: 'Visual only' }
                ],
                generate: (d) => `Create Weather System: ${d.weatherTypes ? d.weatherTypes.join(', ') : 'weather types'}.

LOCATION: Script in ServerScriptService

${d.weatherTypes.includes('Rain') ? 'RAIN: ParticleEmitter falling droplets, fog, gray lighting' + (d.effects === 'Affects gameplay' ? ', slippery ground' : '') : ''}
${d.weatherTypes.includes('Snow') ? 'SNOW: Snowflake particles (slower fall), white ambient' + (d.effects === 'Affects gameplay' ? ', reduced friction' : '') : ''}
${d.weatherTypes.includes('Fog') ? 'FOG: Lighting.FogEnd = 100' + (d.effects === 'Affects gameplay' ? ', reduced vision range' : '') : ''}
${d.weatherTypes.includes('Thunderstorm') ? 'STORM: Rain + random lightning flashes (Brightness spike) + thunder sounds' + (d.effects === 'Affects gameplay' ? ', lightning damage' : '') : ''}
${d.weatherTypes.includes('Sunny') ? 'SUNNY: Clear fog, high brightness, warm lighting, sun rays' + (d.effects === 'Affects gameplay' ? ', speed boost' : '') : ''}

${d.randomChanges === 'Yes' ? `RANDOM CHANGES:
Loop: wait ${d.changeInterval} minutes, pick random weather from list, activate it
Prevent same weather twice in a row` : 'MANUAL: Create SetWeather(weatherName) function for on-demand changes'}

Create activate/deactivate functions for each weather type`
            },

            'zones': {
                name: 'Map Zones/Regions',
                fields: [
                    { id: 'zones', label: 'Zone Names', type: 'list', placeholder: 'Safe Zone, PvP Arena, Shop District...', required: true },
                    { id: 'effects', label: 'Zone Effects', type: 'select',
                      options: ['Just show name', 'Enable/disable features', 'Apply buffs/debuffs'], default: 'Enable/disable features' },
                    { id: 'notifications', label: 'Entry/Exit Notifications', type: 'radio', options: ['Yes', 'No'], default: 'Yes' }
                ],
                generate: (d) => `Create Map Zones: ${d.zones ? d.zones.join(', ') : 'zones'}.

SETUP:
Create invisible Parts for each zone boundary
Name parts: ${d.zones ? d.zones.join(', ') : 'zone names'}
Add StringValue "ZoneType" with zone name
Parent to Workspace.Zones

DETECTION:
Use Part.Touched or Region3 to detect when players enter/exit zones
Track current zone per player

${d.effects === 'Just show name' ? 'DISPLAY: Update GUI showing current zone name' : ''}
${d.effects === 'Enable/disable features' ? 'FEATURES:\nSafe Zone: disable PvP, enable regen\nPvP Arena: enable combat, show kill feed\nShop: open shop GUI, reduce speed' : ''}
${d.effects === 'Apply buffs/debuffs' ? 'BUFFS: Define effects per zone (speed multiplier, damage multiplier, health regen, etc.)\nApply on enter, remove on exit' : ''}

${d.notifications === 'Yes' ? 'NOTIFICATIONS: Fire RemoteEvent on zone change, show "Entering [Zone]" popup' : ''}

Update GUI to show current zone, color-coded by danger level`
            },

            'teleporters': {
                name: 'Teleporter Network',
                fields: [
                    { id: 'teleporters', label: 'Teleporter Locations', type: 'list', placeholder: 'Spawn to Shop, Arena to Lobby...', required: true },
                    { id: 'teleportMethod', label: 'Activation Method', type: 'select',
                      options: ['Touch part', 'ProximityPrompt', 'GUI menu'], default: 'ProximityPrompt' },
                    { id: 'cooldown', label: 'Teleport Cooldown (seconds)', type: 'number', default: '3' },
                    { id: 'effect', label: 'Teleport Effect', type: 'radio', options: ['Particles and sound', 'Simple fade', 'Instant'], default: 'Particles and sound' }
                ],
                generate: (d) => `Create Teleporter Network: ${d.teleporters ? d.teleporters.join(' | ') : 'locations'}.

SETUP:
Create teleporter pads at each location
Add ObjectValue "Destination" pointing to target teleporter
${d.teleportMethod === 'ProximityPrompt' ? 'Add ProximityPrompt with "Teleport to [Name]"' : ''}

COOLDOWN:
Track last teleport time per player, require ${d.cooldown}s between uses

${d.teleportMethod === 'Touch part' ? 'TOUCH: Part.Touched checks cooldown then teleports' : ''}
${d.teleportMethod === 'ProximityPrompt' ? 'PROMPT: ProximityPrompt.Triggered checks cooldown then teleports' : ''}
${d.teleportMethod === 'GUI menu' ? 'GUI: Menu with destination buttons, fire RemoteEvent to teleport' : ''}

TELEPORT:
Set HumanoidRootPart.CFrame = destination.CFrame + Vector3.new(0,3,0)

${d.effect === 'Particles and sound' ? 'EFFECTS: ParticleEmitter burst + sound at departure and arrival' : ''}
${d.effect === 'Simple fade' ? 'EFFECTS: White screen fade in/out on client' : ''}
${d.effect === 'Instant' ? 'No effects, instant teleport' : ''}

Set up two-way or network (hub-and-spoke) teleporter layout`
            }
        }
    },

    'custom-templates': {
    name: 'Custom Templates',
    description: 'Your personally created templates',
    templates: {}
}
};
    const CONFIG = {
        MAX_HISTORY_ITEMS: 50,
        AUTO_SUBMIT_DEFAULT_DELAY: 500,
        TOAST_DURATION: 3000,
        PREVIEW_DEBOUNCE: 150,

        STORAGE_KEYS: {
    HISTORY: 'lemonade_history',
    FAVORITES: 'lemonade_favorites',
    TEMPLATE_STATS: 'lemonade_template_stats',
    AUTO_SUBMIT: 'autoSubmit',
    AUTO_SUBMIT_DELAY: 'autoSubmitDelay',
    THEME: 'theme',
    LAST_VIEW: 'lemonade_last_view',
    CUSTOM_TEMPLATES: 'lemonade_custom_templates',
    CREATOR_ID: 'lemonade_creator_id'
        }
    };

GM_addStyle(`
    #lpb-hammer-trigger {
        position: relative;
        transition: transform 0.2s ease, background-color 0.2s ease !important;
    }

    #lpb-hammer-trigger:hover {
        background: rgba(33, 150, 243, 0.15) !important;
    }

    #lpb-hammer-trigger:active {
        transform: rotate(-10deg) scale(0.95) !important;
    }

    #lpb-hammer-trigger svg {
        transition: all 0.2s ease;
    }


        .lpb-modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.85);
            z-index: 999999;
            align-items: center;
            justify-content: center;
        }

        .lpb-modal.active {
            display: flex;
        }

        .lpb-modal-content {
            background: #1a1a1a;
            border: 2px solid #2196F3;
            border-radius: 12px;
            width: 90%;
            max-width: 900px;
            max-height: 85vh;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            box-shadow: 0 8px 32px rgba(0,0,0,0.5);
        }

        [data-lpb-theme="light"] .lpb-modal-content {
            background: #ffffff;
            border-color: #2196F3;
        }

        [data-lpb-theme="light"] .lpb-header {
            background: #f5f5f5 !important;
            border-bottom-color: #e0e0e0 !important;
        }

        [data-lpb-theme="light"] .lpb-body {
            color: #333 !important;
        }

        [data-lpb-theme="light"] .lpb-category-card,
        [data-lpb-theme="light"] .lpb-template-card,
        [data-lpb-theme="light"] .lpb-history-item,
        [data-lpb-theme="light"] .lpb-settings-section {
            background: #f9f9f9 !important;
            border-color: #e0e0e0 !important;
        }

        [data-lpb-theme="light"] .lpb-input,
        [data-lpb-theme="light"] .lpb-select,
        [data-lpb-theme="light"] .lpb-textarea {
            background: #fff !important;
            border-color: #ccc !important;
            color: #333 !important;
        }

        [data-lpb-theme="light"] .lpb-preview-content {
            background: #f5f5f5 !important;
            color: #333 !important;
        }

        .lpb-header {
            padding: 20px 24px;
            border-bottom: 2px solid #2a2a2a;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #222;
        }

        .lpb-title {
            font-size: 20px;
            font-weight: 600;
            color: #2196F3;
            margin: 0;
            font-family: -apple-system, system-ui, sans-serif;
        }

        .lpb-close-btn {
            background: #333;
            border: none;
            color: #aaa;
            font-size: 24px;
            cursor: pointer;
            width: 36px;
            height: 36px;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
            line-height: 1;
        }

        .lpb-close-btn:hover {
            background: #2196F3;
            color: white;
        }

        .lpb-body {
            padding: 24px;
            overflow-y: auto;
            flex: 1;
            color: #ddd;
            font-family: -apple-system, system-ui, sans-serif;
        }

        .lpb-body::-webkit-scrollbar {
            width: 10px;
        }

        .lpb-body::-webkit-scrollbar-track {
            background: #222;
        }

        .lpb-body::-webkit-scrollbar-thumb {
            background: #2196F3;
            border-radius: 5px;
        }

        .lpb-tabs {
            display: flex;
            gap: 4px;
            margin-bottom: 24px;
            border-bottom: 2px solid #2a2a2a;
        }

        .lpb-tab {
            padding: 12px 24px;
            background: none;
            border: none;
            color: #777;
            cursor: pointer;
            font-weight: 600;
            font-size: 14px;
            border-bottom: 3px solid transparent;
            transition: all 0.2s;
            margin-bottom: -2px;
            font-family: inherit;
        }

        .lpb-tab:hover {
            color: #2196F3;
        }

        .lpb-tab.active {
            color: #2196F3;
            border-bottom-color: #2196F3;
        }

        .lpb-category-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 16px;
            margin-bottom: 20px;
        }

        .lpb-category-card {
            background: #242424;
            border: 2px solid #333;
            border-radius: 10px;
            padding: 24px;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .lpb-category-card:hover {
            border-color: #2196F3;
            transform: translateY(-4px);
            box-shadow: 0 6px 16px rgba(33,150,243,0.2);
        }

        .lpb-category-name {
            font-size: 18px;
            font-weight: 600;
            color: #fff;
            margin-bottom: 8px;
        }

        .lpb-category-desc {
            font-size: 13px;
            color: #888;
            line-height: 1.5;
        }

        .lpb-template-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
            gap: 14px;
        }

        .lpb-template-card {
            background: #242424;
            border: 2px solid #333;
            border-radius: 8px;
            padding: 18px;
            cursor: pointer;
            transition: all 0.2s;
            position: relative;
        }

        .lpb-template-card:hover {
            border-color: #2196F3;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(33,150,243,0.15);
        }

        .lpb-template-name {
            font-size: 15px;
            font-weight: 600;
            color: #fff;
        }

        .lpb-usage-badge {
            position: absolute;
            top: 8px;
            right: 8px;
            background: rgba(33,150,243,0.2);
            color: #2196F3;
            padding: 2px 8px;
            border-radius: 10px;
            font-size: 10px;
            font-weight: 600;
        }

        .lpb-back-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: #333;
            color: #ddd;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
            font-size: 13px;
            margin-bottom: 20px;
            transition: all 0.2s;
            font-family: inherit;
        }

        .lpb-back-btn:hover {
            background: #444;
        }

        .lpb-form-field {
            margin-bottom: 22px;
        }

        .lpb-label {
            display: block;
            font-weight: 600;
            margin-bottom: 8px;
            color: #2196F3;
            font-size: 14px;
        }

        .lpb-required {
            color: #f44336;
            margin-left: 4px;
        }

        .lpb-help-text {
            font-size: 12px;
            color: #777;
            margin-top: 6px;
            font-style: italic;
        }

        .lpb-input, .lpb-select, .lpb-textarea {
            width: 100%;
            background: #242424;
            border: 2px solid #333;
            border-radius: 6px;
            padding: 10px 14px;
            color: #ddd;
            font-size: 14px;
            font-family: inherit;
            transition: border-color 0.2s;
        }

        .lpb-input.lpb-error, .lpb-select.lpb-error, .lpb-textarea.lpb-error {
            border-color: #f44336;
        }

        .lpb-input:focus, .lpb-select:focus, .lpb-textarea:focus {
            outline: none;
            border-color: #2196F3;
        }

        .lpb-textarea {
            min-height: 90px;
            resize: vertical;
            font-family: 'Consolas', 'Monaco', monospace;
            line-height: 1.6;
        }

        .lpb-radio-group, .lpb-checkbox-group {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .lpb-radio-item, .lpb-checkbox-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px 12px;
            background: #242424;
            border: 2px solid #333;
            border-radius: 6px;
            cursor: pointer;
            transition: border-color 0.2s;
        }

        .lpb-radio-item:hover, .lpb-checkbox-item:hover {
            border-color: #2196F3;
        }

        .lpb-radio-item input, .lpb-checkbox-item input {
            cursor: pointer;
            width: 18px;
            height: 18px;
            margin: 0;
        }

        .lpb-radio-item label, .lpb-checkbox-item label {
            cursor: pointer;
            flex: 1;
            color: #ddd;
            margin: 0;
        }

        .lpb-list-wrapper {
            background: #242424;
            border: 2px solid #333;
            border-radius: 6px;
            padding: 14px;
        }

        .lpb-list-row {
            display: flex;
            gap: 8px;
            margin-bottom: 8px;
        }

        .lpb-list-input {
            flex: 1;
            background: #1a1a1a;
            border: 1px solid #444;
            border-radius: 4px;
            padding: 8px 10px;
            color: #ddd;
            font-size: 13px;
            font-family: inherit;
        }

        .lpb-list-input:focus {
            outline: none;
            border-color: #2196F3;
        }

        .lpb-list-remove {
            background: #333;
            border: 1px solid #555;
            color: #ddd;
            padding: 8px 14px;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 600;
            font-size: 13px;
            transition: all 0.2s;
            font-family: inherit;
        }

        .lpb-list-remove:hover {
            background: #f44336;
            border-color: #f44336;
        }

        .lpb-list-add {
            background: #2196F3;
            border: none;
            color: white;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 600;
            font-size: 13px;
            transition: all 0.2s;
            font-family: inherit;
        }

        .lpb-list-add:hover {
            background: #1976D2;
        }

        .lpb-preview {
            background: #0d0d0d;
            border: 2px solid #2196F3;
            border-radius: 8px;
            padding: 18px;
            margin-top: 24px;
        }

        .lpb-preview-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 14px;
            flex-wrap: wrap;
            gap: 10px;
        }

        .lpb-preview-title {
            font-weight: 600;
            color: #2196F3;
            font-size: 15px;
        }

        .lpb-preview-stats {
            display: flex;
            gap: 12px;
            align-items: center;
        }

        .lpb-char-count {
            font-size: 12px;
            color: #888;
        }

        .lpb-preview-content {
            font-family: 'Consolas', 'Monaco', monospace;
            font-size: 13px;
            line-height: 1.8;
            white-space: pre-wrap;
            color: #ccc;
            max-height: 400px;
            overflow-y: auto;
            background: #000;
            padding: 14px;
            border-radius: 6px;
        }

        .lpb-preview-content::-webkit-scrollbar {
            width: 8px;
        }

        .lpb-preview-content::-webkit-scrollbar-track {
            background: #111;
        }

        .lpb-preview-content::-webkit-scrollbar-thumb {
            background: #2196F3;
            border-radius: 4px;
        }

        .lpb-actions {
            display: flex;
            gap: 12px;
            margin-top: 24px;
            padding-top: 24px;
            border-top: 2px solid #2a2a2a;
        }

        .lpb-btn {
            flex: 1;
            background: linear-gradient(135deg, #2196F3, #1976D2);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            font-weight: 600;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.3s ease;
            font-family: inherit;
        }

        .lpb-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(33,150,243,0.3);
        }

        .lpb-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
        }

        .lpb-btn-secondary {
            background: #333;
            color: #ddd;
        }

        .lpb-btn-secondary:hover {
            background: #444;
            box-shadow: none;
        }

        .lpb-btn-small {
            padding: 8px 16px;
            font-size: 13px;
            flex: none;
        }

        .lpb-search-wrapper {
            margin-bottom: 20px;
        }

        .lpb-search-input {
            max-width: 400px;
        }

        .lpb-history-item {
            background: #242424;
            border: 2px solid #333;
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 12px;
            transition: all 0.2s;
        }

        .lpb-history-item:hover {
            border-color: #2196F3;
        }

        .lpb-history-top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }

        .lpb-history-info {
            display: flex;
            gap: 12px;
            align-items: center;
            flex-wrap: wrap;
        }

        .lpb-badge {
            background: rgba(33,150,243,0.2);
            color: #2196F3;
            padding: 4px 10px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
        }

        .lpb-custom-name {
            background: rgba(76,175,80,0.2);
            color: #4CAF50;
            padding: 4px 10px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 600;
        }

        .lpb-timestamp {
            font-size: 12px;
            color: #666;
        }

        .lpb-fav-btn {
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            transition: transform 0.2s;
            line-height: 1;
        }

        .lpb-fav-btn:hover {
            transform: scale(1.2);
        }

  .lpb-history-preview {
        font-size: 13px;
        color: #999;
        font-family: 'Consolas', monospace;
        cursor: pointer;
        user-select: none;
        display: flex;
        align-items: flex-start;
        gap: 8px;
        padding: 8px;
        border-radius: 4px;
        transition: background 0.2s;
    }

    .lpb-history-preview:hover {
        background: rgba(33,150,243,0.1);
    }

    .lpb-history-preview-text {
        flex: 1;
        overflow: hidden;
    }

    .lpb-history-preview-text.truncated {
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .lpb-history-preview-text.expanded {
        white-space: pre-wrap;
        max-height: 400px;
        overflow-y: auto;
        background: #0d0d0d;
        padding: 12px;
        border-radius: 4px;
        border: 1px solid #333;
    }

    .lpb-history-preview-text.expanded::-webkit-scrollbar {
        width: 8px;
    }

    .lpb-history-preview-text.expanded::-webkit-scrollbar-track {
        background: #111;
    }

    .lpb-history-preview-text.expanded::-webkit-scrollbar-thumb {
        background: #2196F3;
        border-radius: 4px;
    }

    .lpb-expand-icon {
        color: #2196F3;
        font-size: 12px;
        margin-top: 2px;
        flex-shrink: 0;
    }

        .lpb-edit-modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.9);
            z-index: 10000000;
            align-items: center;
            justify-content: center;
        }

        .lpb-edit-modal.active {
            display: flex;
        }

        .lpb-edit-modal-content {
            background: #1a1a1a;
            border: 2px solid #2196F3;
            border-radius: 12px;
            padding: 24px;
            width: 90%;
            max-width: 500px;
        }

        .lpb-edit-modal h3 {
            margin: 0 0 20px 0;
            color: #2196F3;
            font-size: 18px;
        }

        .lpb-edit-actions {
            display: flex;
            gap: 12px;
            margin-top: 20px;
        }

        .lpb-file-autocomplete {
            position: absolute;
            background: #1a1a1a;
            border: 2px solid #2196F3;
            border-radius: 8px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.5);
            max-height: 300px;
            overflow-y: auto;
            z-index: 10000001;
            min-width: 250px;
            display: none;
        }

        .lpb-file-autocomplete.active {
            display: block;
        }

        .lpb-file-autocomplete::-webkit-scrollbar {
            width: 8px;
        }

        .lpb-file-autocomplete::-webkit-scrollbar-track {
            background: #222;
        }

        .lpb-file-autocomplete::-webkit-scrollbar-thumb {
            background: #2196F3;
            border-radius: 4px;
        }

        .lpb-file-item {
            padding: 10px 14px;
            cursor: pointer;
            transition: background 0.2s;
            color: #ddd;
            font-size: 13px;
            font-family: 'Consolas', monospace;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .lpb-file-item:hover,
        .lpb-file-item.selected {
            background: #2196F3;
            color: white;
        }

        .lpb-file-icon {
            width: 16px;
            height: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
        }

        .lpb-file-name {
            flex: 1;
        }

        .lpb-file-path {
            font-size: 11px;
            opacity: 0.7;
        }

        .lpb-toast {
            position: fixed;
            bottom: 80px;
            left: 20px;
            background: linear-gradient(135deg, #2196F3, #1976D2);
            color: white;
            padding: 14px 24px;
            border-radius: 8px;
            font-weight: 600;
            box-shadow: 0 4px 16px rgba(0,0,0,0.3);
            z-index: 9999999;
            animation: lpb-slide-in 0.3s ease;
            font-family: -apple-system, system-ui, sans-serif;
        }

        .lpb-toast-error {
            background: linear-gradient(135deg, #f44336, #d32f2f) !important;
        }

        .lpb-toast-info {
            background: linear-gradient(135deg, #FF9800, #F57C00) !important;
        }

        .lpb-toast-success {
            background: linear-gradient(135deg, #4CAF50, #388E3C) !important;
        }

        @keyframes lpb-slide-in {
            from { transform: translateX(-300px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }

        @keyframes lpb-slide-out {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(-300px); opacity: 0; }
        }

        .lpb-empty {
            text-align: center;
            padding: 60px 20px;
            color: #666;
        }

        .lpb-field-hidden {
            display: none;
        }

        .lpb-settings-section {
            background: #242424;
            border: 2px solid #333;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 16px;
        }

        .lpb-settings-section h3 {
            margin: 0 0 16px 0;
            color: #2196F3;
            font-size: 16px;
        }

        .lpb-setting-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 0;
            border-bottom: 1px solid #333;
            gap: 16px;
        }

        .lpb-setting-item:last-child {
            border-bottom: none;
        }

        .lpb-setting-label {
            flex: 1;
        }

        .lpb-setting-label h4 {
            margin: 0 0 4px 0;
            color: #fff;
            font-size: 14px;
        }

        .lpb-setting-label p {
            margin: 0;
            color: #888;
            font-size: 12px;
        }

        .lpb-toggle-switch {
            position: relative;
            width: 50px;
            height: 26px;
            background: #333;
            border-radius: 13px;
            cursor: pointer;
            transition: background 0.3s;
            flex-shrink: 0;
        }

        .lpb-toggle-switch.active {
            background: #2196F3;
        }

        .lpb-toggle-switch::after {
            content: '';
            position: absolute;
            width: 22px;
            height: 22px;
            border-radius: 50%;
            background: white;
            top: 2px;
            left: 2px;
            transition: transform 0.3s;
        }

        .lpb-toggle-switch.active::after {
            transform: translateX(24px);
        }

        .lpb-slider {
            width: 100px;
        }

        .lpb-error-message {
            background: rgba(244, 67, 54, 0.1);
            border: 1px solid #f44336;
            color: #f44336;
            padding: 12px;
            border-radius: 6px;
            font-size: 13px;
            margin-top: 12px;
        }
        .lpb-file-icon {
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    flex-shrink: 0;
}

.lpb-file-icon img {
    width: 16px;
    height: 16px;
    object-fit: contain;
}

.lpb-file-name {
    flex: 1;
    font-size: 13px;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.lpb-file-path {
    font-size: 11px;
    opacity: 0.7;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
        @media (max-width: 768px) {
            .lpb-modal-content {
                width: 95%;
                max-height: 90vh;
            }

            .lpb-category-grid, .lpb-template-grid {
                grid-template-columns: 1fr;
            }

            .lpb-actions {
                flex-direction: column;
            }

            .lpb-btn {
                width: 100%;
            }

            .lpb-setting-item {
                flex-direction: column;
                align-items: flex-start;
            }
        }
    `);

    class Settings {
        constructor() {
            this.settings = {
                autoSubmit: GM_getValue(CONFIG.STORAGE_KEYS.AUTO_SUBMIT, false),
                autoSubmitDelay: GM_getValue(CONFIG.STORAGE_KEYS.AUTO_SUBMIT_DELAY, CONFIG.AUTO_SUBMIT_DEFAULT_DELAY),
                theme: GM_getValue(CONFIG.STORAGE_KEYS.THEME, 'dark')
            };
            this.applyTheme();
        }

        get(key) {
            return this.settings[key];
        }

        set(key, value) {
            this.settings[key] = value;
            GM_setValue(key, value);
        }

toggleAutoSubmit() {
    const newValue = !this.settings.autoSubmit;
    this.set(CONFIG.STORAGE_KEYS.AUTO_SUBMIT, newValue);
    this.settings.autoSubmit = newValue;
    return newValue;
}

        setAutoSubmitDelay(delay) {
            this.set(CONFIG.STORAGE_KEYS.AUTO_SUBMIT_DELAY, delay);
            this.settings.autoSubmitDelay = delay;
        }

        toggleTheme() {
            const newTheme = this.settings.theme === 'dark' ? 'light' : 'dark';
            this.set(CONFIG.STORAGE_KEYS.THEME, newTheme);
            this.settings.theme = newTheme;
            this.applyTheme();
            return newTheme;
        }

        applyTheme() {
            document.body.setAttribute('data-lpb-theme', this.settings.theme);
        }
    }

    class Storage {
        save(key, data) {
            GM_setValue(key, JSON.stringify(data));
        }

        load(key, defaultValue = null) {
            const data = GM_getValue(key);
            return data ? JSON.parse(data) : defaultValue;
        }
    }

    class PromptHistory {
        constructor() {
            this.storage = new Storage();
            this.items = this.storage.load(CONFIG.STORAGE_KEYS.HISTORY, []);
            this.favorites = this.storage.load(CONFIG.STORAGE_KEYS.FAVORITES, []);
            this.templateStats = this.storage.load(CONFIG.STORAGE_KEYS.TEMPLATE_STATS, {});
        }

        add(prompt, category, template, data) {
            const item = {
                id: Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                prompt,
                category,
                template,
                data,
                timestamp: Date.now(),
                customName: null
            };

            this.items.unshift(item);
            if (this.items.length > CONFIG.MAX_HISTORY_ITEMS) this.items.pop();

            const key = `${category}:${template}`;
            this.templateStats[key] = (this.templateStats[key] || 0) + 1;

            this.storage.save(CONFIG.STORAGE_KEYS.HISTORY, this.items);
            this.storage.save(CONFIG.STORAGE_KEYS.TEMPLATE_STATS, this.templateStats);
            return item;
        }

        toggleFavorite(id) {
            const index = this.favorites.indexOf(id);
            if (index > -1) {
                this.favorites.splice(index, 1);
            } else {
                this.favorites.push(id);
            }
            this.storage.save(CONFIG.STORAGE_KEYS.FAVORITES, this.favorites);
        }

        isFavorite(id) {
            return this.favorites.includes(id);
        }

        rename(id, newName) {
            const item = this.items.find(i => i.id === id);
            if (item) {
                item.customName = newName.trim() || null;
                this.storage.save(CONFIG.STORAGE_KEYS.HISTORY, this.items);
            }
        }

        remove(id) {
            this.items = this.items.filter(i => i.id !== id);
            this.favorites = this.favorites.filter(f => f !== id);
            this.storage.save(CONFIG.STORAGE_KEYS.HISTORY, this.items);
            this.storage.save(CONFIG.STORAGE_KEYS.FAVORITES, this.favorites);
        }

        getAll() {
            return this.items;
        }

        getFavorites() {
            return this.items.filter(i => this.favorites.includes(i.id));
        }

        getMostUsed(limit = 5) {
            return Object.entries(this.templateStats)
                .sort((a, b) => b[1] - a[1])
                .slice(0, limit);
        }

        getUsageCount(categoryKey, templateKey) {
            const key = `${categoryKey}:${templateKey}`;
            return this.templateStats[key] || 0;
        }
    }


class FileAutocomplete {
    constructor() {
        this.activeInput = null;
        this.dropdown = null;
        this.selectedIndex = 0;
        this.currentFiles = [];
        this.atPosition = -1;
        this.isMirroring = false;
        this.lemonadeTextarea = null;
        this.originalLemonadeValue = '';
        this.extractInterval = null;
        this.mirrorAttempts = 0;
        this.maxMirrorAttempts = 3;

        this.createDropdown();
        this.findLemonadeTextarea();
    }

    findLemonadeTextarea() {
        this.lemonadeTextarea = document.querySelector('textarea[name="chat-input"]');
        if (!this.lemonadeTextarea) {
            console.warn('Lemonade textarea not found');
        }
    }

    createDropdown() {
        this.dropdown = document.createElement('div');
        this.dropdown.className = 'lpb-file-autocomplete';
        this.dropdown.style.cssText = `
            position: fixed;
            background: #1a1a1a;
            border: 1px solid #333;
            border-radius: 8px;
            max-height: 320px;
            overflow-y: auto;
            z-index: 99999999;
            display: none;
            min-width: 300px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        document.body.appendChild(this.dropdown);
    }

    attach(input) {
        if (input.dataset.fileAutocompleteAttached) return;
        input.dataset.fileAutocompleteAttached = 'true';

        input.addEventListener('input', (e) => this.handleInput(e));
        input.addEventListener('keydown', (e) => this.handleKeydown(e));

        input.addEventListener('blur', (e) => {
            if (this.isMirroring) {
                return;
            }

            setTimeout(() => {
                if (this.dropdown.matches(':hover')) return;
                if (document.activeElement === input) return;
                this.hide();
            }, 200);
        });
    }

    async handleInput(e) {
        const input = e.target;
        const value = input.value;
        const cursorPos = input.selectionStart;

        const atIndex = value.lastIndexOf('@', cursorPos - 1);

        if (atIndex !== -1 && (atIndex === 0 || value[atIndex - 1] === ' ')) {
            const afterAt = value.substring(atIndex + 1, cursorPos);

            if (afterAt.includes(' ')) {
                this.stopMirroring();
                this.hide();
                return;
            }

            this.atPosition = atIndex;
            this.activeInput = input;

            if (!this.dropdown.classList.contains('active')) {
                this.showLoading(input);
                await this.mirrorToLemonade('@' + afterAt);
                this.startExtractingDropdown(input, afterAt);
            } else {
                await this.mirrorToLemonade('@' + afterAt);
                this.extractAndShowDropdown(input, afterAt);
            }
            return;
        }

        this.stopMirroring();
        this.hide();
    }

    async mirrorToLemonade(text) {
        if (!this.lemonadeTextarea) {
            this.findLemonadeTextarea();
            if (!this.lemonadeTextarea) {
                console.warn('Cannot mirror: Lemonade textarea not found');
                return;
            }
        }

        if (!this.isMirroring) {
            this.originalLemonadeValue = this.lemonadeTextarea.value;
            this.isMirroring = true;
            this.mirrorAttempts = 0;
        }

        const formInput = this.activeInput;

        try {
            this.lemonadeTextarea.focus();
            this.lemonadeTextarea.click();

            await new Promise(resolve => setTimeout(resolve, 50));

            const nativeTextareaSetter = Object.getOwnPropertyDescriptor(
                window.HTMLTextAreaElement.prototype,
                'value'
            ).set;
            nativeTextareaSetter.call(this.lemonadeTextarea, text);

            this.lemonadeTextarea.setSelectionRange(text.length, text.length);

            const eventTypes = [
                new Event('input', { bubbles: true, cancelable: true }),
                new Event('change', { bubbles: true, cancelable: true }),
                new InputEvent('input', {
                    data: text[text.length - 1] || '@',
                    inputType: 'insertText',
                    bubbles: true,
                    cancelable: true,
                    composed: true
                }),
                new KeyboardEvent('keydown', {
                    key: text[text.length - 1] || '@',
                    bubbles: true,
                    cancelable: true
                }),
                new KeyboardEvent('keyup', {
                    key: text[text.length - 1] || '@',
                    bubbles: true,
                    cancelable: true
                })
            ];

            eventTypes.forEach(event => {
                this.lemonadeTextarea.dispatchEvent(event);
            });

            setTimeout(() => {
                if (formInput) {
                    formInput.focus();

                    if (formInput.setSelectionRange) {
                        const cursorPos = formInput.selectionStart;
                        formInput.setSelectionRange(cursorPos, cursorPos);
                    }
                }
            }, 10);

            this.mirrorAttempts++;

        } catch (error) {
            console.error('Mirror error:', error);

            if (formInput) {
                formInput.focus();
            }
        }
    }

    startExtractingDropdown(input, query) {
        if (this.extractInterval) {
            clearInterval(this.extractInterval);
        }

        setTimeout(() => {
            this.extractAndShowDropdown(input, query);
        }, 300);

        this.extractInterval = setInterval(() => {
            this.extractAndShowDropdown(input, query);

            if (this.mirrorAttempts >= this.maxMirrorAttempts && this.currentFiles.length === 0) {
                clearInterval(this.extractInterval);
                this.extractInterval = null;
            }
        }, 300);
    }

    extractAndShowDropdown(input, query) {
        const lemonadeDropdown = document.querySelector('div.absolute.z-50') ||
                                document.querySelector('[role="listbox"]') ||
                                document.querySelector('div.shadow-lg');

        if (!lemonadeDropdown) {
            return;
        }

        const files = [];
        const fileItems = lemonadeDropdown.querySelectorAll('div.flex.items-center.gap-2.px-3.py-2.cursor-pointer') ||
                         lemonadeDropdown.querySelectorAll('div.cursor-pointer.transition-colors') ||
                         lemonadeDropdown.querySelectorAll('div[class*="cursor-pointer"]');

        fileItems.forEach((item) => {
            try {
                const textElements = item.querySelectorAll('div, span');
                let fileName = null;
                let filePath = null;

                for (let el of textElements) {
                    const text = el.textContent.trim();
                    if (text && text.length > 0 && text.length < 100) {
                        if (!fileName && !text.includes('/')) {
                            fileName = text;
                        } else if (text.includes('/')) {
                            filePath = text;
                        }
                    }
                }

                if (fileName) {
                    const img = item.querySelector('img');
                    const fileType = img ? img.getAttribute('alt') || 'File' : 'File';

                    files.push({
                        name: fileName,
                        path: filePath || '',
                        fullPath: filePath || fileName,
                        type: fileType
                    });
                }
            } catch (e) {}
        });

        if (files.length > 0) {
            this.currentFiles = files;
            this.show(input, query);
        }
    }

    showLoading(input) {
        this.activeInput = input;
        this.dropdown.innerHTML = `
            <div class="lpb-file-item" style="justify-content: center; opacity: 0.7; padding: 20px;">
                <div>
                    <div style="margin-bottom: 8px;">⏳ Loading files from Lemonade...</div>
                    <div style="font-size: 11px; opacity: 0.6;">This may take a few seconds</div>
                </div>
            </div>
        `;

        const rect = input.getBoundingClientRect();
        this.dropdown.style.left = `${rect.left}px`;
        this.dropdown.style.top = `${rect.bottom + 5}px`;
        this.dropdown.classList.add('active');
        this.dropdown.style.display = 'block';
    }

    show(input, query) {
        this.activeInput = input;
        this.selectedIndex = 0;

        const filteredFiles = query ? this.currentFiles.filter(f =>
            f.name.toLowerCase().includes(query.toLowerCase()) ||
            f.path.toLowerCase().includes(query.toLowerCase())
        ) : this.currentFiles;

        this.currentFiles = filteredFiles;

        if (this.currentFiles.length === 0) {
            this.dropdown.innerHTML = `
                <div class="lpb-file-item" style="justify-content: center; opacity: 0.7; padding: 16px;">
                    <div>
                        <div>No files found</div>
                        <div style="font-size: 11px; margin-top: 4px;">Try a different search term</div>
                    </div>
                </div>
            `;
            const rect = input.getBoundingClientRect();
            this.dropdown.style.left = `${rect.left}px`;
            this.dropdown.style.top = `${rect.bottom + 5}px`;
            this.dropdown.classList.add('active');
            this.dropdown.style.display = 'block';
            return;
        }

        const filesHtml = this.currentFiles.map((file, index) => `
            <div class="lpb-file-item ${index === 0 ? 'selected' : ''}" data-index="${index}" style="
                padding: 8px 12px;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 8px;
                background: ${index === 0 ? '#2196F3' : 'transparent'};
                color: ${index === 0 ? '#fff' : '#ddd'};
                font-family: -apple-system, system-ui, sans-serif;
                border-radius: 4px;
                transition: background 0.15s;
            ">
                <div class="lpb-file-icon" style="font-size: 16px;">${file.type === 'Script' ? '📜' : '📦'}</div>
                <div style="flex: 1; min-width: 0;">
                    <div class="lpb-file-name" style="font-weight: 500; font-size: 13px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${this.escapeHtml(file.name)}</div>
                    ${file.path ? `<div class="lpb-file-path" style="font-size: 11px; opacity: 0.6; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${this.escapeHtml(file.path)}</div>` : ''}
                </div>
            </div>
        `).join('');

        const footerHtml = `
            <div style="padding: 8px 12px; border-top: 1px solid #333; background: rgba(0,0,0,0.2); font-size: 11px; color: #888;">
                ${this.currentFiles.length} file${this.currentFiles.length !== 1 ? 's' : ''} • Use ↑↓ to navigate • Enter to select • Space to close
            </div>
        `;

        this.dropdown.innerHTML = filesHtml + footerHtml;

        this.dropdown.addEventListener('mousedown', (e) => {
            e.preventDefault();
            e.stopPropagation();
        });

        this.dropdown.querySelectorAll('.lpb-file-item[data-index]').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const index = parseInt(item.dataset.index);
                this.selectFile(this.currentFiles[index]);
            });

            item.addEventListener('mousedown', (e) => {
                e.preventDefault();
                e.stopPropagation();
            });

            item.addEventListener('mouseup', (e) => {
                e.preventDefault();
                e.stopPropagation();
            });
        });

        const rect = input.getBoundingClientRect();
        this.dropdown.style.left = `${rect.left}px`;
        this.dropdown.style.top = `${rect.bottom + 5}px`;
        this.dropdown.style.maxHeight = '320px';
        this.dropdown.classList.add('active');
        this.dropdown.style.display = 'block';
    }

    handleKeydown(e) {
        if (!this.dropdown.classList.contains('active')) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            this.selectedIndex = Math.min(this.selectedIndex + 1, this.currentFiles.length - 1);
            this.updateSelection();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
            this.updateSelection();
        } else if (e.key === 'Enter' || e.key === 'Tab') {
            if (this.currentFiles.length > 0) {
                e.preventDefault();
                this.selectFile(this.currentFiles[this.selectedIndex]);
            }
        } else if (e.key === 'Escape' || e.key === ' ') {
            e.preventDefault();
            this.stopMirroring();
            this.hide();
        }
    }

    updateSelection() {
        this.dropdown.querySelectorAll('.lpb-file-item[data-index]').forEach((item, index) => {
            const isSelected = index === this.selectedIndex;
            item.classList.toggle('selected', isSelected);
            item.style.background = isSelected ? '#2196F3' : 'transparent';
            item.style.color = isSelected ? '#fff' : '#ddd';
        });

        const selected = this.dropdown.querySelector('.lpb-file-item.selected');
        if (selected) {
            selected.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
    }

    selectFile(file) {
        if (!this.activeInput || this.atPosition === -1) return;

        const input = this.activeInput;
        const value = input.value;
        const cursorPos = input.selectionStart;

        const beforeAt = value.substring(0, this.atPosition);
        const afterCursor = value.substring(cursorPos);

        const fileRef = `@${file.name}`;
        const newValue = beforeAt + fileRef + ' ' + afterCursor;
        const newCursorPos = beforeAt.length + fileRef.length + 1;

        const nativeSetter = Object.getOwnPropertyDescriptor(
            input.constructor.prototype,
            'value'
        ).set;
        nativeSetter.call(input, newValue);

        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));

        this.clearLemonadeChat();

        this.hide();
        this.stopMirroring();

        input.focus();
        input.setSelectionRange(newCursorPos, newCursorPos);

        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 999999999;
            font-family: -apple-system, system-ui, sans-serif;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        `;
        toast.textContent = `✓ Added @${file.name}`;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2000);
    }

    clearLemonadeChat() {
        if (!this.lemonadeTextarea) return;

        setTimeout(() => {
            try {
                const nativeSetter = Object.getOwnPropertyDescriptor(
                    window.HTMLTextAreaElement.prototype,
                    'value'
                ).set;
                nativeSetter.call(this.lemonadeTextarea, '');

                this.lemonadeTextarea.dispatchEvent(new Event('input', { bubbles: true }));
                this.lemonadeTextarea.dispatchEvent(new Event('change', { bubbles: true }));

                this.lemonadeTextarea.dispatchEvent(new KeyboardEvent('keydown', {
                    key: 'Escape',
                    code: 'Escape',
                    keyCode: 27,
                    bubbles: false,
                    cancelable: true
                }));

                this.lemonadeTextarea.blur();

                this.isMirroring = false;
                this.mirrorAttempts = 0;
                this.originalLemonadeValue = '';

                console.log('[FileAutocomplete] Cleared Lemonade chat after delay');

            } catch (error) {
                console.error('Error clearing Lemonade chat:', error);
            }
        }, 500);
    }

    hide() {
        this.dropdown.classList.remove('active');
        this.dropdown.style.display = 'none';
        this.atPosition = -1;

        if (this.extractInterval) {
            clearInterval(this.extractInterval);
            this.extractInterval = null;
        }
    }

    stopMirroring() {
        if (this.extractInterval) {
            clearInterval(this.extractInterval);
            this.extractInterval = null;
        }

        if (this.isMirroring && this.lemonadeTextarea) {
            const nativeSetter = Object.getOwnPropertyDescriptor(
                window.HTMLTextAreaElement.prototype,
                'value'
            ).set;
            nativeSetter.call(this.lemonadeTextarea, '');

            this.lemonadeTextarea.dispatchEvent(new Event('input', { bubbles: true }));

            this.lemonadeTextarea.dispatchEvent(new KeyboardEvent('keydown', {
                key: 'Escape',
                code: 'Escape',
                keyCode: 27,
                bubbles: false,
                cancelable: true
            }));

            this.isMirroring = false;
            this.mirrorAttempts = 0;
        }
    }

    cleanup() {
        this.stopMirroring();
        this.hide();
    }

    escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    destroy() {
        this.stopMirroring();
        if (this.dropdown) {
            this.dropdown.remove();
        }
    }
}
const fileAutocomplete = new FileAutocomplete();

document.addEventListener('DOMContentLoaded', () => {
    const forumInput = document.querySelector('textarea[name="message"]');
    if (forumInput) {
        fileAutocomplete.attach(forumInput);
    }
});

const observer = new MutationObserver(() => {
    const forumInput = document.querySelector('textarea[name="message"]');
    if (forumInput && !forumInput.dataset.autocompleteAttached) {
        forumInput.dataset.autocompleteAttached = 'true';
        fileAutocomplete.attach(forumInput);
    }
});

observer.observe(document.body, { childList: true, subtree: true });

    class Utils {
        static log(message, data = null) {
            console.log(`[Lemonade Builder] ${message}`, data || '');
        }

        static showToast(message, type = 'success', duration = CONFIG.TOAST_DURATION) {
            const toast = document.createElement('div');
            toast.className = `lpb-toast lpb-toast-${type}`;
            toast.textContent = message;
            document.body.appendChild(toast);

            setTimeout(() => {
                toast.style.animation = 'lpb-slide-out 0.3s ease';
                setTimeout(() => toast.remove(), 300);
            }, duration);
        }

        static downloadFile(content, filename, type = 'text/plain') {
            const blob = new Blob([content], { type });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);
        }

        static escapeHtml(str) {
            const div = document.createElement('div');
            div.textContent = str;
            return div.innerHTML;
        }
    }

    class ViewState {
        constructor() {
            this.storage = new Storage();
        }

        save(state) {
            this.storage.save(CONFIG.STORAGE_KEYS.LAST_VIEW, state);
        }

        load() {
            return this.storage.load(CONFIG.STORAGE_KEYS.LAST_VIEW, { tab: 'categories', category: null });
        }
    }

class WorkflowManager {
    constructor() {
        this.storage = new Storage();
        this.workflows = this.storage.load('lemonade_workflows', []);
    }

    create(name, steps) {
        const workflow = {
            id: Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            name,
            steps,
            created: Date.now(),
            timesUsed: 0
        };
        this.workflows.push(workflow);
        this.save();
        return workflow;
    }

  execute(workflowId, ui) {
    const workflow = this.workflows.find(w => w.id === workflowId);
    if (!workflow) return;

    workflow.timesUsed++;
    this.save();

    let combinedPrompt = workflow.steps.map((step, index) => {
        const template = CATEGORIES[step.categoryKey].templates[step.templateKey];
        const prompt = template.generate(step.data);
        return `\n\n=== STEP ${index + 1}: ${template.name} ===\n${prompt}`;
    }).join('\n');

    ui.insertPromptText(combinedPrompt.trim(), true);
}

update(id, name, steps) {
    const workflow = this.workflows.find(w => w.id === id);
    if (workflow) {
        workflow.name = name;
        workflow.steps = steps;
        this.save();
        return workflow;
    }
    return null;
}

    getById(id) {
        return this.workflows.find(w => w.id === id);
    }

    save() {
        this.storage.save('lemonade_workflows', this.workflows);
    }

    getAll() {
        return this.workflows;
    }

    delete(id) {
        this.workflows = this.workflows.filter(w => w.id !== id);
        this.save();
    }
}
class CustomTemplateManager {
constructor() {
    this.storage = new Storage();
    this.templates = this.storage.load(CONFIG.STORAGE_KEYS.CUSTOM_TEMPLATES, {});
    this.creatorId = this.getOrCreateCreatorId();

    Object.entries(this.templates).forEach(([id, template]) => {
        if (template.editable === false && template.imported === undefined) {
            console.log('[LPB] Fixing missing imported flag for:', id);
            template.imported = true;
        }
    });
    this.save();

    this.loadTemplatesIntoCategories();
}

    getOrCreateCreatorId() {
        let id = this.storage.load(CONFIG.STORAGE_KEYS.CREATOR_ID);
        if (!id) {
            id = 'creator_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            this.storage.save(CONFIG.STORAGE_KEYS.CREATOR_ID, id);
        }
        return id;
    }

    getCreatorName() {
        return this.storage.load('lemonade_creator_name') || 'Anonymous';
    }

    setCreatorName(name) {
        this.storage.save('lemonade_creator_name', name);
    }

    loadTemplatesIntoCategories() {
        Object.entries(this.templates).forEach(([id, template]) => {
            this.addToCategory(id, template);
        });
    }

create(name, description, fields, generateFunction) {
    const templateId = 'custom_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

    const template = {
        id: templateId,
        name,
        description,
        fields,
        generateFunction,
        creatorId: this.creatorId,
        creatorName: this.getCreatorName(),
        created: Date.now(),
        timesUsed: 0,
        editable: true
    };

    this.templates[templateId] = template;
    this.save();
    this.addToCategory(templateId, template);
    return template;
}

addToCategory(templateId, template) {
    if (!CATEGORIES['custom-templates'].templates[templateId]) {
        try {
            const generateFn = new Function('d', `return (${template.generateFunction})(d);`);

            CATEGORIES['custom-templates'].templates[templateId] = {
                name: template.name,
                fields: template.fields,
                generate: generateFn,
                isCustom: true,
                creatorName: template.creatorName,
                creatorId: template.creatorId
            };
        } catch (e) {
            console.error('Error creating template function:', e);
        }
    }
}

addToCategory(templateId, template) {
    console.log('[LPB] Adding template to category:', templateId);
    console.log('[LPB] Template fields:', template.fields);
    console.log('[LPB] Conditional fields:', template.fields.filter(f => f.show_if));

    if (!CATEGORIES['custom-templates'].templates[templateId]) {
        try {
            const generateFn = new Function('d', `return (${template.generateFunction})(d);`);

            CATEGORIES['custom-templates'].templates[templateId] = {
                name: template.name,
                fields: template.fields,
                generate: generateFn,
                isCustom: true,
                creatorName: template.creatorName,
                creatorId: template.creatorId
            };

            console.log('[LPB] Template added to CATEGORIES successfully');
            console.log('[LPB] Fields in CATEGORIES:', CATEGORIES['custom-templates'].templates[templateId].fields);
        } catch (e) {
            console.error('Error creating template function:', e);
        }
    }
}

updateCategory(templateId, template) {
    if (CATEGORIES['custom-templates'].templates[templateId]) {
        try {
            const generateFn = new Function('d', `return (${template.generateFunction})(d);`);

            CATEGORIES['custom-templates'].templates[templateId] = {
                name: template.name,
                fields: template.fields,
                generate: generateFn,
                isCustom: true,
                creatorName: template.creatorName,
                creatorId: template.creatorId
            };
        } catch (e) {
            console.error('Error updating template function:', e);
        }
    }
}

delete(templateId) {
    const template = this.templates[templateId];
    if (!template) {
        return { error: 'Template not found' };
    }

    const canDelete = template.creatorId === this.creatorId || template.editable === false;

    if (!canDelete) {
        return { error: 'You can only delete templates you created or imported' };
    }

    delete this.templates[templateId];

    if (CATEGORIES['custom-templates'] && CATEGORIES['custom-templates'].templates[templateId]) {
        delete CATEGORIES['custom-templates'].templates[templateId];
    }

    this.save();
    return true;
}

    canEdit(templateId) {
    const template = this.templates[templateId];
    return template && template.creatorId === this.creatorId && !template.imported;
}

canDelete(templateId) {
    const template = this.templates[templateId];
    console.log('[LPB] canDelete check:', {
        templateId,
        exists: !!template,
        creatorId: template?.creatorId,
        myCreatorId: this.creatorId,
        imported: template?.imported,
        result: template && (template.creatorId === this.creatorId || template.imported)
    });
    return template && (template.creatorId === this.creatorId || template.imported);
}

    export(templateId) {
        const template = this.templates[templateId];
        if (!template) return null;

        const exportData = {
            name: template.name,
            description: template.description,
            fields: template.fields,
            generateFunction: template.generateFunction,
            creatorId: template.creatorId,
            creatorName: template.creatorName,
            version: '9.0.4.3.0'
        };

        return btoa(JSON.stringify(exportData));
    }

import(shareCode) {
    try {
        const data = JSON.parse(atob(shareCode));

        if (!data.name || !data.fields || !data.generateFunction) {
            throw new Error('Invalid template format');
        }

        const templateId = 'custom_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

        const template = {
            id: templateId,
            name: data.name,
            description: data.description || '',
            fields: data.fields,
            generateFunction: data.generateFunction,
            creatorId: data.creatorId,
            creatorName: data.creatorName || 'Unknown',
            created: Date.now(),
            timesUsed: 0,
            editable: false,
            imported: true
        };

        console.log('[LPB] Importing template with imported flag:', template.imported);

        this.templates[templateId] = template;
        this.save();

        console.log('[LPB] After save, checking template:', this.templates[templateId].imported);

        this.addToCategory(templateId, template);
        return template;

    } catch (error) {
        console.error('Import error:', error);
        return { error: 'Invalid template code' };
    }
}
    getAll() {
        return Object.values(this.templates);
    }

    getById(id) {
        return this.templates[id];
    }

    save() {
        this.storage.save(CONFIG.STORAGE_KEYS.CUSTOM_TEMPLATES, this.templates);
    }
}
    class UI {
        constructor() {
    this.history = new PromptHistory();
    this.settings = new Settings();
    this.viewState = new ViewState();
    this.fileAutocomplete = new FileAutocomplete();
    this.workflowManager = new WorkflowManager();
    this.customTemplateManager = new CustomTemplateManager();
    this.workflowBuilder = { active: false, steps: [] };
    this.currentCategory = null;
    this.currentTemplate = null;
    this.currentData = {};
    this.previewDebounceTimer = null;
    this.validationErrors = [];
    this.init();
}


init() {
    this.createTrigger();
    this.createMainModal();
    this.createFormModal();
    this.createEditModal();
    this.setupEvents();
    this.setupKeyboardShortcuts();

    Utils.showToast('Type @ in text fields to load and reference files', 'info', 4000);
}

createTrigger() {
    this.injectHammerButton();
}

injectHammerButton() {
    const injectButton = () => {
        const buttonGroup = document.querySelector('.relative.flex.items-center.gap-0.md\\:gap-1.ring-1.ring-white\\/10');

        if (!buttonGroup || document.getElementById('lpb-hammer-trigger')) {
            return;
        }

        const hammerBtn = document.createElement('button');
        hammerBtn.id = 'lpb-hammer-trigger';
        hammerBtn.type = 'button';
        hammerBtn.className = 'group relative flex h-10 w-10 md:h-9 md:w-9 items-center justify-center rounded-md transition-colors touch-manipulation overflow-visible text-muted-foreground hover:bg-white/5 active:bg-white/10';
        hammerBtn.setAttribute('aria-label', 'Prompt Builder');
        hammerBtn.setAttribute('title', 'Prompt Builder (Ctrl+Shift+P)');
        hammerBtn.setAttribute('data-state', 'closed');

        hammerBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-hammer h-5 w-5 md:h-[18px] md:w-[18px] opacity-60 relative z-10 text-muted-foreground transition-all duration-200 group-hover:opacity-100 group-active:scale-95" aria-hidden="true">
                <path d="m15 12-8.5 8.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 0 1 0-3L12 9"/>
                <path d="M17.64 15 22 10.64"/>
                <path d="m20.91 11.7-1.25-1.25c-.6-.6-.93-1.4-.93-2.25v-.86L16.01 4.6a5.56 5.56 0 0 0-3.94-1.64H9l.92.82A6.18 6.18 0 0 1 12 8.4v1.56l2 2h2.47l2.26 1.91"/>
            </svg>
        `;

        buttonGroup.appendChild(hammerBtn);

        hammerBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.showModal('main');
            this.restoreLastView();
        });

        Utils.log('Hammer button injected into button group');
    };

    injectButton();

    const observer = new MutationObserver(() => {
        if (!document.getElementById('lpb-hammer-trigger')) {
            injectButton();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

        createMainModal() {
            const modal = document.createElement('div');
            modal.id = 'lpb-main-modal';
            modal.className = 'lpb-modal';
            modal.innerHTML = `
                <div class="lpb-modal-content">
                    <div class="lpb-header">
                        <h2 class="lpb-title">Prompt Builder</h2>
                        <button class="lpb-close-btn" data-modal="main">×</button>
                    </div>
                    <div class="lpb-body">
                        <div class="lpb-tabs">
    <button class="lpb-tab active" data-tab="categories">Templates</button>
    <button class="lpb-tab" data-tab="history">History</button>
    <button class="lpb-tab" data-tab="favorites">Favorites</button>
    <button class="lpb-tab" data-tab="workflows">Workflows</button>
    <button class="lpb-tab" data-tab="custom-templates">Custom Templates</button>
    <button class="lpb-tab" data-tab="settings">Settings</button>
                        </div>
                        <div id="lpb-main-content"></div>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        }

        createFormModal() {
            const modal = document.createElement('div');
            modal.id = 'lpb-form-modal';
            modal.className = 'lpb-modal';
            modal.innerHTML = `
                <div class="lpb-modal-content">
                    <div class="lpb-header">
                        <h2 class="lpb-title" id="lpb-form-title">Template</h2>
                        <button class="lpb-close-btn" data-modal="form">×</button>
                    </div>
                    <div class="lpb-body">
                        <div id="lpb-form-content"></div>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        }

        createEditModal() {
            const modal = document.createElement('div');
            modal.id = 'lpb-edit-modal';
            modal.className = 'lpb-edit-modal';
            modal.innerHTML = `
                <div class="lpb-edit-modal-content">
                    <h3>Rename Prompt</h3>
                    <input type="text" class="lpb-input" id="lpb-edit-name-input" placeholder="Enter custom name...">
                    <div class="lpb-edit-actions">
                        <button class="lpb-btn lpb-btn-secondary" id="lpb-edit-cancel">Cancel</button>
                        <button class="lpb-btn" id="lpb-edit-save">Save</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });

            document.getElementById('lpb-edit-cancel').addEventListener('click', () => {
                modal.classList.remove('active');
            });
        }

        setupEvents() {
            document.querySelectorAll('.lpb-close-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const modal = e.target.dataset.modal;
                    if (this.fileAutocomplete) {
                        this.fileAutocomplete.cleanup();
                    }
                    this.hideModal(modal);
                    if (modal === 'main') {
                        this.saveCurrentView();
                    }
                });
            });

            document.querySelectorAll('.lpb-modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target.closest('.lpb-file-autocomplete')) {
            return;
        }

        if (e.target === modal) {
            modal.classList.remove('active');

            if (this.fileAutocomplete) {
                this.fileAutocomplete.cleanup();
            }

            if (modal.id === 'lpb-main-modal') {
                this.saveCurrentView();
            }
        }
    });
});

    document.querySelectorAll('.lpb-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            document.querySelectorAll('.lpb-tab').forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');

            const tabName = e.target.dataset.tab;
            if (tabName === 'categories') this.showCategories();
            else if (tabName === 'history') this.showHistory();
            else if (tabName === 'favorites') this.showFavorites();
            else if (tabName === 'workflows') this.showWorkflows();
            else if (tabName === 'custom-templates') this.showCustomTemplates();
            else if (tabName === 'settings') this.showSettings();
        });
    });
}

       setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'P') {
            e.preventDefault();
            this.showModal('main');
            this.restoreLastView();
        }

        if (e.key === 'Escape') {
            if (this.fileAutocomplete) {
                this.fileAutocomplete.cleanup();
            }

            if (document.getElementById('lpb-edit-modal').classList.contains('active')) {
                document.getElementById('lpb-edit-modal').classList.remove('active');
            } else if (document.getElementById('lpb-form-modal').classList.contains('active')) {
                this.hideModal('form');
            } else if (document.getElementById('lpb-main-modal').classList.contains('active')) {
                this.hideModal('main');
                this.saveCurrentView();
            }
        }
    });
}

        saveCurrentView() {
            const activeTab = document.querySelector('.lpb-tab.active');
            const state = {
                tab: activeTab ? activeTab.dataset.tab : 'categories',
                category: this.currentCategory
            };
            this.viewState.save(state);
        }

        restoreLastView() {
            const state = this.viewState.load();

            document.querySelectorAll('.lpb-tab').forEach(tab => {
                tab.classList.toggle('active', tab.dataset.tab === state.tab);
            });

            if (state.tab === 'categories') {
                if (state.category) {
                    this.showTemplates(state.category);
                } else {
                    this.showCategories();
                }
            } else if (state.tab === 'history') {
                this.showHistory();
            } else if (state.tab === 'favorites') {
                this.showFavorites();
            } else if (state.tab === 'settings') {
                this.showSettings();
            }
        }

        showModal(type) {
            const id = type === 'main' ? 'lpb-main-modal' : 'lpb-form-modal';
            document.getElementById(id).classList.add('active');
        }

        hideModal(type) {
            const id = type === 'main' ? 'lpb-main-modal' : 'lpb-form-modal';
            document.getElementById(id).classList.remove('active');
            if (this.fileAutocomplete) {
                this.fileAutocomplete.cleanup();
            }
        }
showCustomTemplates() {
    const content = document.getElementById('lpb-main-content');
    if (!content) {
        console.error('[LPB] Content element not found');
        return;
    }

    let templates = [];
    let creatorName = 'Anonymous';

    try {
        templates = this.customTemplateManager.getAll();
        creatorName = this.customTemplateManager.getCreatorName();
    } catch (e) {
        console.error('[LPB] Failed to get templates:', e);
        Utils.showToast('Failed to load custom templates', 'error');
    }

    const html = `
        <div style="background: rgba(33, 150, 243, 0.1); border: 1px solid #2196F3; border-radius: 6px; padding: 16px; margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <div>
                    <strong style="color: #2196F3;">Creator Name:</strong> ${Utils.escapeHtml(creatorName)}
                </div>
                <button class="lpb-btn lpb-btn-small" id="lpb-change-creator-name">Change Name</button>
            </div>
            <div style="font-size: 12px; color: #888;">
                Your creator ID protects your templates. Only you can edit templates you create.
            </div>
        </div>

        <div style="display: flex; gap: 12px; margin-bottom: 20px;">
            <button class="lpb-btn lpb-btn-small" id="lpb-create-template">+ Create Template</button>
            <button class="lpb-btn lpb-btn-small lpb-btn-secondary" id="lpb-import-template">Import Template</button>
        </div>

        ${templates.length === 0 ? '<div class="lpb-empty">No custom templates yet. Create one to get started!</div>' :
        templates.map(t => {
            const canEdit = this.customTemplateManager.canEdit(t.id);
            return `
                <div class="lpb-history-item">
                    <div class="lpb-history-top">
                        <div class="lpb-history-info">
                            <span class="lpb-badge">${Utils.escapeHtml(t.name)}</span>
                            <span class="lpb-timestamp">by ${Utils.escapeHtml(t.creatorName)} • Used ${t.timesUsed} times</span>
                            ${canEdit ? '<span style="color: #4CAF50; font-size: 11px; margin-left: 8px;">✓ You own this</span>' : '<span style="color: #FF9800; font-size: 11px; margin-left: 8px;">🔒 Read-only</span>'}
                        </div>
                    </div>
                    <div style="margin: 12px 0; font-size: 13px; color: #888;">
                        ${Utils.escapeHtml(t.description || 'No description')}
                    </div>
                    <div class="lpb-history-actions">
                        <button class="lpb-btn lpb-btn-small" data-id="${t.id}" data-action="use">Use Template</button>
<button class="lpb-btn lpb-btn-small lpb-btn-secondary" data-id="${t.id}" data-action="share">Share</button>
${canEdit ? `<button class="lpb-btn lpb-btn-small lpb-btn-secondary" data-id="${t.id}" data-action="edit">Edit</button>` : ''}
${this.customTemplateManager.canDelete(t.id) ? `<button class="lpb-btn lpb-btn-small lpb-btn-secondary" data-id="${t.id}" data-action="delete">Delete</button>` : ''}
                    </div>
                </div>
            `;
        }).join('')}
    `;

    content.innerHTML = html;

    const changeNameBtn = document.getElementById('lpb-change-creator-name');
    if (changeNameBtn) {
        changeNameBtn.addEventListener('click', () => {
            this.showChangeCreatorNameModal();
        });
    }

    const createBtn = document.getElementById('lpb-create-template');
    if (createBtn) {
        createBtn.addEventListener('click', () => {
            this.showTemplateBuilder();
        });
    }

    const importBtn = document.getElementById('lpb-import-template');
    if (importBtn) {
        importBtn.addEventListener('click', () => {
            this.showImportTemplateModal();
        });
    }

content.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        const action = e.target.dataset.action;

        try {
            if (action === 'use') {
                console.log('[LPB] Using template:', id);
                console.log('[LPB] Categories:', CATEGORIES['custom-templates']);
                console.log('[LPB] Template exists:', !!CATEGORIES['custom-templates']?.templates[id]);

                if (!CATEGORIES['custom-templates'] || !CATEGORIES['custom-templates'].templates[id]) {
                    Utils.showToast('Template not found - try refreshing', 'error');
                    console.error('[LPB] Template not in category:', id);

                    const template = this.customTemplateManager.getById(id);
                    if (template) {
                        console.log('[LPB] Found template, reloading into category');
                        this.customTemplateManager.addToCategory(id, template);

                        if (CATEGORIES['custom-templates']?.templates[id]) {
                            this.openTemplate('custom-templates', id);
                        } else {
                            Utils.showToast('Failed to load template', 'error');
                        }
                    }
                    return;
                }
                this.openTemplate('custom-templates', id);
            } else if (action === 'share') {
                this.showShareTemplateModal(id);
            } else if (action === 'edit') {
                this.showTemplateBuilder(id);
            } else if (action === 'delete') {
                if (confirm('Delete this template permanently?')) {
                    const result = this.customTemplateManager.delete(id);
                    if (result && result.error) {
                        Utils.showToast(result.error, 'error');
                    } else {
                        Utils.showToast('Template deleted', 'success');
                        this.showCustomTemplates();
                    }
                }
            }
        } catch (error) {
            console.error('[LPB] Action failed:', action, error);
            Utils.showToast('Error: ' + error.message, 'error');
        }
    });
});
}

showChangeCreatorNameModal() {
    const modal = document.createElement('div');
    modal.className = 'lpb-edit-modal active';
    modal.innerHTML = `
        <div class="lpb-edit-modal-content">
            <h3>Change Creator Name</h3>
            <p style="color: #888; font-size: 13px; margin-bottom: 16px;">This name will appear on all templates you create.</p>
            <input type="text" class="lpb-input" id="lpb-creator-name-input" placeholder="Enter your name..." value="${Utils.escapeHtml(this.customTemplateManager.getCreatorName())}">
            <div class="lpb-edit-actions">
                <button class="lpb-btn lpb-btn-secondary" id="lpb-creator-cancel">Cancel</button>
                <button class="lpb-btn" id="lpb-creator-save">Save</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    const input = modal.querySelector('#lpb-creator-name-input');
    if (input) {
        input.focus();
        input.select();
    }

    const cancelBtn = modal.querySelector('#lpb-creator-cancel');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            modal.remove();
        });
    }

    const saveBtn = modal.querySelector('#lpb-creator-save');
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            if (input) {
                const name = input.value.trim();
                if (name) {
                    this.customTemplateManager.setCreatorName(name);
                    modal.remove();
                    this.showCustomTemplates();
                    Utils.showToast('Creator name updated!', 'success');
                }
            }
        });
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

showTemplateBuilder(templateId = null) {
    const isEditing = !!templateId;
    const template = isEditing ? this.customTemplateManager.getById(templateId) : null;

    const content = document.getElementById('lpb-main-content');
    if (!content) return;

    content.innerHTML = `
        <div class="lpb-settings-section">
            <h3 style="margin-bottom: 20px; padding-bottom: 12px; border-bottom: 1px solid #333;">${isEditing ? 'Edit' : 'Create'} Custom Template</h3>

            <div style="display: flex; gap: 0; margin-bottom: 24px; border-radius: 8px; overflow: hidden; border: 2px solid #333; background: #1a1a1a;">
                <button class="lpb-mode-tab active" data-mode="beginner" style="flex: 1; padding: 14px 24px; background: linear-gradient(135deg, #4CAF50, #45a049); color: white; border: none; cursor: pointer; font-weight: 600; font-size: 14px; transition: all 0.3s;">
                    Beginner Mode
                </button>
                <button class="lpb-mode-tab" data-mode="advanced" style="flex: 1; padding: 14px 24px; background: transparent; color: #666; border: none; cursor: pointer; font-weight: 600; font-size: 14px; transition: all 0.3s;">
                    Advanced Mode
                </button>
            </div>

            <div id="lpb-beginner-section">
                <div style="background: linear-gradient(135deg, rgba(76, 175, 80, 0.1), rgba(76, 175, 80, 0.05)); border: 1px solid rgba(76, 175, 80, 0.3); border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                    <h4 style="margin: 0 0 12px 0; color: #4CAF50; font-size: 15px;">Quick Start Guide</h4>
                    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px;">
                        <div style="text-align: center; padding: 12px;">
                            <div style="width: 32px; height: 32px; background: #4CAF50; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 8px; font-weight: bold; color: white;">1</div>
                            <div style="color: #ccc; font-size: 12px;">Name your template</div>
                        </div>
                        <div style="text-align: center; padding: 12px;">
                            <div style="width: 32px; height: 32px; background: #4CAF50; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 8px; font-weight: bold; color: white;">2</div>
                            <div style="color: #ccc; font-size: 12px;">Add user questions</div>
                        </div>
                        <div style="text-align: center; padding: 12px;">
                            <div style="width: 32px; height: 32px; background: #4CAF50; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 8px; font-weight: bold; color: white;">3</div>
                            <div style="color: #ccc; font-size: 12px;">Write your prompt</div>
                        </div>
                        <div style="text-align: center; padding: 12px;">
                            <div style="width: 32px; height: 32px; background: #4CAF50; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 8px; font-weight: bold; color: white;">4</div>
                            <div style="color: #ccc; font-size: 12px;">Save and use</div>
                        </div>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 16px; margin-bottom: 20px;">
                    <div class="lpb-form-field" style="margin-bottom: 0;">
                        <label class="lpb-label">Template Name<span class="lpb-required">*</span></label>
                        <input type="text" id="lpb-template-name" class="lpb-input" placeholder="e.g., My Combat System" value="${isEditing && template ? Utils.escapeHtml(template.name) : ''}" style="background: #1e1e1e; border: 2px solid #333; padding: 12px 16px; font-size: 14px;">
                    </div>
                    <div class="lpb-form-field" style="margin-bottom: 0;">
                        <label class="lpb-label">Description</label>
                        <input type="text" id="lpb-template-desc" class="lpb-input" placeholder="Brief description" value="${isEditing && template ? Utils.escapeHtml(template.description) : ''}" style="background: #1e1e1e; border: 2px solid #333; padding: 12px 16px; font-size: 14px;">
                    </div>
                </div>

                <div style="background: #1a1a1a; border: 2px solid #333; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                        <h4 style="color: #4CAF50; margin: 0; font-size: 14px;">User Questions</h4>
                        <button class="lpb-btn lpb-btn-small" id="lpb-add-field" style="background: linear-gradient(135deg, #4CAF50, #45a049); border: none; padding: 8px 16px; font-size: 13px;">Add Question</button>
                    </div>
                    <div id="lpb-template-fields"></div>
                    <div id="lpb-no-fields-msg" style="text-align: center; padding: 32px; color: #666; font-size: 13px; border: 2px dashed #333; border-radius: 6px;">
                        No questions added yet. Click "Add Question" to start.
                    </div>
                </div>

                <div style="background: #1a1a1a; border: 2px solid #333; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                        <h4 style="color: #4CAF50; margin: 0; font-size: 14px;">Variable Reference</h4>
                        <span style="color: #666; font-size: 12px;">Click to copy</span>
                    </div>
                    <div id="lpb-variable-list" style="display: flex; flex-wrap: wrap; gap: 8px; min-height: 40px; padding: 12px; background: #0d0d0d; border-radius: 6px;">
                        <span style="color: #666; font-size: 13px;">Variables will appear here as you add questions</span>
                    </div>
                </div>

                <div class="lpb-form-field">
                    <label class="lpb-label">Prompt Template<span class="lpb-required">*</span></label>
                    <div style="background: rgba(255, 152, 0, 0.1); border-left: 3px solid #FF9800; padding: 12px 16px; margin-bottom: 12px; border-radius: 0 6px 6px 0;">
                        <span style="color: #FF9800; font-weight: 600;">Tip:</span>
                        <span style="color: #aaa; font-size: 13px; margin-left: 8px;">Click variables above to copy, then paste into your template</span>
                    </div>
<textarea id="lpb-template-generate" class="lpb-textarea" placeholder="(d) => \`Create a \${d.systemType} system.

Features:
- \${d.feature1}
- \${d.feature2}

Complexity: \${d.complexity}\`" style="min-height: 200px; font-family: 'Consolas', 'Monaco', monospace; font-size: 13px; line-height: 1.6; background: #0d0d0d; border: 2px solid #333; padding: 16px;">${isEditing && template ? Utils.escapeHtml(template.generateFunction) : ''}</textarea>
                </div>
            </div>

            <div id="lpb-advanced-section" style="display: none;">
                <div style="background: linear-gradient(135deg, rgba(156, 39, 176, 0.1), rgba(156, 39, 176, 0.05)); border: 1px solid rgba(156, 39, 176, 0.3); border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                    <h4 style="margin: 0 0 8px 0; color: #9C27B0; font-size: 15px;">Advanced Mode</h4>
                    <p style="margin: 0; color: #888; font-size: 13px;">Full control over field types, validation, defaults, and metadata.</p>
                </div>

                <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 16px; margin-bottom: 20px;">
                    <div class="lpb-form-field" style="margin-bottom: 0;">
                        <label class="lpb-label">Template Name<span class="lpb-required">*</span></label>
                        <input type="text" id="lpb-template-name-adv" class="lpb-input" placeholder="Template name" value="${isEditing && template ? Utils.escapeHtml(template.name) : ''}" style="background: #1e1e1e; border: 2px solid #333; padding: 12px 16px;">
                    </div>
                    <div class="lpb-form-field" style="margin-bottom: 0;">
                        <label class="lpb-label">Description</label>
                        <input type="text" id="lpb-template-desc-adv" class="lpb-input" placeholder="Brief description" value="${isEditing && template ? Utils.escapeHtml(template.description) : ''}" style="background: #1e1e1e; border: 2px solid #333; padding: 12px 16px;">
                    </div>
                </div>

                <div style="background: #1a1a1a; border: 2px solid #333; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                        <h4 style="color: #9C27B0; margin: 0; font-size: 14px;">Template Fields</h4>
                        <button class="lpb-btn lpb-btn-small" id="lpb-add-field-adv" style="background: linear-gradient(135deg, #9C27B0, #7B1FA2); border: none; padding: 8px 16px; font-size: 13px;">Add Field</button>
                    </div>
                    <div id="lpb-template-fields-adv"></div>
                    <div id="lpb-no-fields-msg-adv" style="text-align: center; padding: 32px; color: #666; font-size: 13px; border: 2px dashed #333; border-radius: 6px;">
                        No fields added yet. Click "Add Field" to start.
                    </div>
                </div>

                <div style="background: #1a1a1a; border: 2px solid #333; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                        <h4 style="color: #9C27B0; margin: 0; font-size: 14px;">Variable Reference</h4>
                        <span style="color: #666; font-size: 12px;">Click to copy</span>
                    </div>
                    <div id="lpb-variable-list-adv" style="display: flex; flex-wrap: wrap; gap: 8px; min-height: 40px; padding: 12px; background: #0d0d0d; border-radius: 6px;">
                        <span style="color: #666; font-size: 13px;">Variables will appear here as you add fields</span>
                    </div>
                </div>

<div class="lpb-form-field">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
        <label class="lpb-label" style="margin-bottom: 0;">Prompt Template<span class="lpb-required">*</span></label>
        <button class="lpb-btn lpb-btn-small" id="lpb-generate-ai-prompt-adv" style="background: linear-gradient(135deg, #FF6B35, #F7931E); padding: 6px 12px; font-size: 12px;">
            Generate AI Prompt
        </button>
    </div>
    <textarea id="lpb-template-generate-adv" class="lpb-textarea" placeholder="(d) => \`Your template here with \${d.variables}\`" style="min-height: 220px; font-family: 'Consolas', 'Monaco', monospace; font-size: 13px; line-height: 1.6; background: #0d0d0d; border: 2px solid #333; padding: 16px;">${isEditing && template ? Utils.escapeHtml(template.generateFunction) : ''}</textarea>
</div>
            </div>

            <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px; padding-top: 20px; border-top: 2px solid #333;">
                <button class="lpb-btn lpb-btn-secondary" id="lpb-template-cancel" style="padding: 12px 24px; font-size: 14px;">Cancel</button>
                <button class="lpb-btn" id="lpb-template-save" style="padding: 12px 32px; font-size: 14px; background: linear-gradient(135deg, #2196F3, #1976D2);">${isEditing ? 'Update' : 'Create'} Template</button>
            </div>
        </div>
    `;

    const modeTabs = content.querySelectorAll('.lpb-mode-tab');
    const beginnerSection = document.getElementById('lpb-beginner-section');
    const advancedSection = document.getElementById('lpb-advanced-section');

    modeTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const mode = tab.dataset.mode;

            modeTabs.forEach(t => {
                t.classList.remove('active');
                t.style.background = 'transparent';
                t.style.color = '#666';
            });

            tab.classList.add('active');
            if (mode === 'beginner') {
                tab.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
                tab.style.color = 'white';
                beginnerSection.style.display = 'block';
                advancedSection.style.display = 'none';
                this.syncFieldsBetweenModes('adv-to-beginner');
            } else {
                tab.style.background = 'linear-gradient(135deg, #9C27B0, #7B1FA2)';
                tab.style.color = 'white';
                beginnerSection.style.display = 'none';
                advancedSection.style.display = 'block';
                this.syncFieldsBetweenModes('beginner-to-adv');
            }
        });
    });

    if (isEditing && template && template.fields) {
    console.log('[LPB] Loading existing template fields:', template.fields);
    template.fields.forEach((field, index) => {
        try {
            this.addTemplateFieldSimple(field);
            this.addTemplateFieldAdvanced(field);
        } catch (error) {
            console.error('[LPB] Error loading field:', field, error);
        }
    });

    setTimeout(() => {
        this.updateAllConditionalDropdowns();
    }, 100);
}

    document.getElementById('lpb-add-field')?.addEventListener('click', () => this.addTemplateFieldSimple());
    document.getElementById('lpb-add-field-adv')?.addEventListener('click', () => this.addTemplateFieldAdvanced());
    document.getElementById('lpb-generate-ai-prompt-adv')?.addEventListener('click', () => this.showAIPromptGenerator());
    document.getElementById('lpb-template-cancel')?.addEventListener('click', () => this.showCustomTemplates());
    document.getElementById('lpb-template-save')?.addEventListener('click', () => this.saveCustomTemplate(templateId));

    this.updateVariableList();
    this.updateVariableListAdvanced();
}
showAIPromptGenerator() {
    const nameInput = document.getElementById('lpb-template-name-adv');
    const descInput = document.getElementById('lpb-template-desc-adv');
    const fieldsContainer = document.getElementById('lpb-template-fields-adv');

    const templateName = nameInput?.value.trim() || 'My Template';
    const templateDesc = descInput?.value.trim() || 'A custom template';

    const fields = [];
    fieldsContainer?.querySelectorAll('.lpb-template-field-adv').forEach(fieldDiv => {
        const idInput = fieldDiv.querySelector('.field-id');
        const labelInput = fieldDiv.querySelector('.field-label');
        const typeSelect = fieldDiv.querySelector('.field-type');
        const requiredSelect = fieldDiv.querySelector('.field-required');
        const defaultInput = fieldDiv.querySelector('.field-default');
        const placeholderInput = fieldDiv.querySelector('.field-placeholder');
        const optionsInput = fieldDiv.querySelector('.field-options');
        const helpInput = fieldDiv.querySelector('.field-help');
        const showWhenSelect = fieldDiv.querySelector('.field-show-when');
        const showWhenValueInput = fieldDiv.querySelector('.field-show-when-value');

        if (idInput && labelInput) {
            const field = {
                id: idInput.value.trim(),
                label: labelInput.value.trim(),
                type: typeSelect?.value || 'text',
                required: requiredSelect?.value === 'true',
                default: defaultInput?.value.trim() || '',
                placeholder: placeholderInput?.value.trim() || '',
                helpText: helpInput?.value.trim() || ''
            };

            if ((field.type === 'select' || field.type === 'radio') && optionsInput?.value.trim()) {
                field.options = optionsInput.value.split(',').map(o => o.trim()).filter(o => o);
            }

            if (showWhenSelect?.value && showWhenValueInput?.value.trim()) {
                field.show_if = {
                    field: showWhenSelect.value,
                    value: showWhenValueInput.value.trim()
                };
            }

            fields.push(field);
        }
    });

    if (fields.length === 0) {
        Utils.showToast('Please add at least one field first', 'error');
        return;
    }

    const aiPrompt = this.generateAIPromptText(templateName, templateDesc, fields);

    this.showAIPromptModal(aiPrompt, fields);
}

generateAIPromptText(templateName, templateDesc, fields) {
    const analysis = this.analyzeTemplateCapabilities(fields);

    const fieldDescriptions = fields.map(f => {
        let desc = `- ${f.id}: ${f.label} (${f.type})`;
        if (f.required) desc += ' [REQUIRED]';
        if (f.default) desc += ` [default: "${f.default}"]`;
        if (f.options) desc += ` [options: ${f.options.join(', ')}]`;
        if (f.show_if) desc += ` [shows when ${f.show_if.field} = "${f.show_if.value}"]`;
        if (f.helpText) desc += `\n  Description: ${f.helpText}`;
        return desc;
    }).join('\n');

    const variableList = fields.map(f => `\${d.${f.id}}`).join(', ');

    let warningsSection = '';
    if (analysis.warnings.length > 0) {
        warningsSection = `\n\n**⚠️ IMPORTANT LIMITATIONS:**
${analysis.warnings.map(w => `- ${w}`).join('\n')}

Please acknowledge these limitations in your response before generating the code.`;
    }

    const capabilitiesSection = `\n\n**✅ What This Template CAN Do:**
${analysis.capabilities.map(c => `- ${c}`).join('\n')}`;

    return `I need you to write a JavaScript template function for my custom Roblox Luau prompt builder.

**Template Name:** ${templateName}
**Description:** ${templateDesc}

**User Input Fields:**
${fieldDescriptions}
${capabilitiesSection}
${warningsSection}

**CRITICAL INSTRUCTIONS:**
1. **Keep it concise** - This is a PROMPT TEMPLATE, not a full tutorial
2. **Focus on structure** - Use sections like STRUCTURE:, IMPLEMENTATION:, FEATURES:
3. **Be directive** - Tell the AI what to create, don't explain how Roblox works
4. **Use variables efficiently** - Access field values using: ${variableList}
5. **Length limit** - Keep the output under 2000 characters. Be brief but clear.
6. **Conditional logic** - Handle show_if fields properly:
   - Only include content when the parent field matches the condition
   - Use: \${d.parentField === 'value' ? 'content to show' : ''}
7. **Optional fields** - Check existence: \${d.optionalField ? \`Content with \${d.optionalField}\` : ''}
8. **List fields** - Access as arrays: \${d.listField ? d.listField.join(', ') : ''}

**STYLE GUIDELINES:**
- Short, punchy sections (3-5 lines each max)
- Bullet points, not paragraphs
- Action-oriented language ("Create X", "Use Y", "Add Z")
- No unnecessary explanations or tutorials
- Template should guide the AI, not teach the user

**BAD Example (too verbose):**
\`\`\`
Create a combat system. First, you need to understand that Roblox uses a client-server architecture.
The client handles input and animations, while the server validates everything for security.
Let me explain how raycasting works in Roblox...
\`\`\`

**GOOD Example (concise):**
\`\`\`
Create a \${d.combatType} Combat System.

STRUCTURE:
- LocalScript: input, animations
- Script: validation, damage
- RemoteEvent for communication

COMBAT:
\${d.hitDetection === 'Raycast' ? 'Use Raycast from camera position' : 'Use Region3 detection'}
Cooldown: \${d.cooldown}s between attacks
\${d.vfx === 'Yes' ? 'Add particles and sound effects' : ''}
\`\`\`

**Return format:**
Return ONLY the function in this exact format:
\`\`\`javascript
(d) => \`Your concise template content here with \${d.fieldName} variables\`
\`\`\`

${analysis.warnings.length > 0 ? '\n**BEFORE generating the code, first tell the user about the limitations above and confirm they want to proceed with a simplified version.**' : ''}

Make it professional, concise, and ready to copy-paste. Maximum 2000 characters in the template string.`;
}

analyzeTemplateCapabilities(fields) {
    const capabilities = [];
    const warnings = [];

    const hasConditionals = fields.some(f => f.show_if);
    const hasLists = fields.some(f => f.type === 'list');
    const hasCheckboxes = fields.some(f => f.type === 'checkboxes' || f.type === 'checkbox');
    const hasSelects = fields.some(f => f.type === 'select' || f.type === 'radio');
    const hasNumbers = fields.some(f => f.type === 'number');
    const hasTextAreas = fields.some(f => f.type === 'textarea');
    const fieldCount = fields.length;

    if (hasConditionals) {
        capabilities.push('Show/hide content based on user selections (conditional logic)');
        const conditionalFields = fields.filter(f => f.show_if);
        capabilities.push(`Handle ${conditionalFields.length} conditional field(s) that only appear when conditions are met`);
    }

    if (hasLists) {
        capabilities.push('Process multiple items from list fields (arrays)');
    }

    if (hasCheckboxes) {
        capabilities.push('Handle multiple selections from checkboxes');
    }

    if (hasSelects) {
        capabilities.push('Adapt output based on dropdown/radio selections');
    }

    capabilities.push(`Work with ${fieldCount} user input${fieldCount !== 1 ? 's' : ''}`);
    capabilities.push('Generate structured Roblox Luau scripting prompts');
    capabilities.push('Include variable validation and defaults');

    if (fieldCount > 15) {
        warnings.push(`You have ${fieldCount} fields - the template may become complex. Consider simplifying or splitting into multiple templates.`);
    }

    if (hasConditionals) {
        const conditionalCount = fields.filter(f => f.show_if).length;
        if (conditionalCount > 5) {
            warnings.push(`You have ${conditionalCount} conditional fields - this adds complexity. Test thoroughly to ensure logic works correctly.`);
        }
    }

    const conditionalChains = this.findConditionalChains(fields);
    if (conditionalChains.maxDepth > 2) {
        warnings.push(`You have conditional fields that depend on other conditional fields (${conditionalChains.maxDepth} levels deep). This is advanced - make sure your logic is clear.`);
    }

    const unconstrained = fields.filter(f =>
        (f.type === 'text' || f.type === 'textarea') &&
        !f.required &&
        !f.default
    );
    if (unconstrained.length > 3) {
        warnings.push(`${unconstrained.length} optional text fields have no defaults. The template should handle empty values gracefully.`);
    }

    if (hasLists) {
        const listFields = fields.filter(f => f.type === 'list');
        capabilities.push('Note: List fields return arrays - use .join(", ") or .map() to format them');
        if (listFields.length > 3) {
            warnings.push(`You have ${listFields.length} list fields. Each requires array handling logic in the template.`);
        }
    }

    const hasDescription = fields.some(f => f.helpText && f.helpText.length > 10);
    if (!hasDescription && fieldCount > 5) {
        warnings.push('Consider adding "Help Text" to complex fields so the AI knows their purpose.');
    }

    return { capabilities, warnings };
}

findConditionalChains(fields) {
    const chains = {};
    let maxDepth = 0;

    fields.forEach(field => {
        if (field.show_if) {
            const parentField = field.show_if.field;
            if (!chains[parentField]) chains[parentField] = [];
            chains[parentField].push(field.id);
        }
    });

    const getDepth = (fieldId, visited = new Set()) => {
        if (visited.has(fieldId)) return 0;
        visited.add(fieldId);

        const children = chains[fieldId] || [];
        if (children.length === 0) return 0;

        return 1 + Math.max(...children.map(child => getDepth(child, new Set(visited))));
    };

    fields.forEach(field => {
        const depth = getDepth(field.id);
        maxDepth = Math.max(maxDepth, depth);
    });

    return { chains, maxDepth };
}

showAIPromptModal(aiPrompt, fields) {
    const analysis = this.analyzeTemplateCapabilities(fields);
    const modal = document.createElement('div');
    modal.className = 'lpb-edit-modal active';
    modal.style.zIndex = '10000001';

    const exampleOutput = this.generateExampleOutput(fields);

    let warningsHTML = '';
    if (analysis.warnings.length > 0) {
        warningsHTML = `
            <div style="background: linear-gradient(135deg, rgba(244, 67, 54, 0.1), rgba(244, 67, 54, 0.05)); border-left: 3px solid #f44336; padding: 16px; border-radius: 0 8px 8px 0; margin-bottom: 20px;">
                <h4 style="margin: 0 0 8px 0; color: #f44336; font-size: 14px;">⚠️ Limitations & Warnings</h4>
                <ul style="margin: 0; padding-left: 20px; color: #f44336; font-size: 13px; line-height: 1.8;">
                    ${analysis.warnings.map(w => `<li>${w}</li>`).join('')}
                </ul>
                <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(244, 67, 54, 0.3); color: #888; font-size: 12px;">
                    💡 The AI has been instructed about these limitations and will generate accordingly.
                </div>
            </div>
        `;
    }

    const capabilitiesHTML = `
        <div style="background: linear-gradient(135deg, rgba(76, 175, 80, 0.1), rgba(76, 175, 80, 0.05)); border-left: 3px solid #4CAF50; padding: 16px; border-radius: 0 8px 8px 0; margin-bottom: 20px;">
            <h4 style="margin: 0 0 8px 0; color: #4CAF50; font-size: 14px;">✅ Template Capabilities</h4>
            <ul style="margin: 0; padding-left: 20px; color: #4CAF50; font-size: 13px; line-height: 1.8;">
                ${analysis.capabilities.map(c => `<li>${c}</li>`).join('')}
            </ul>
        </div>
    `;

    modal.innerHTML = `
        <div class="lpb-edit-modal-content" style="max-width: 900px; max-height: 90vh; overflow-y: auto;">
            <h3 style="color: #FF6B35; margin-bottom: 16px;">✨ AI Prompt Generator</h3>

            <div style="background: linear-gradient(135deg, rgba(255, 107, 53, 0.1), rgba(247, 147, 30, 0.05)); border-left: 3px solid #FF6B35; padding: 16px; border-radius: 0 8px 8px 0; margin-bottom: 20px;">
                <h4 style="margin: 0 0 8px 0; color: #FF6B35; font-size: 14px;">📋 How to Use</h4>
                <ol style="margin: 0; padding-left: 20px; color: #aaa; font-size: 13px; line-height: 1.8;">
                    <li>Review the capabilities and warnings below</li>
                    <li>Copy the AI prompt</li>
                    <li>Paste it into ChatGPT, Claude, or any AI assistant</li>
                    <li>The AI will generate your template function code</li>
                    <li>Copy the generated function back into your template builder</li>
                    <li>Test with different inputs to verify it works!</li>
                </ol>
            </div>

            ${capabilitiesHTML}
            ${warningsHTML}

            <div style="margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <label style="color: #2196F3; font-weight: 600; font-size: 14px;">AI Prompt (Copy This)</label>
                    <button class="lpb-btn lpb-btn-small" id="lpb-copy-ai-prompt" style="background: linear-gradient(135deg, #4CAF50, #45a049);">
                       Copy Prompt
                    </button>
                </div>
                <textarea readonly class="lpb-textarea" id="lpb-ai-prompt-text" style="font-family: 'Consolas', monospace; font-size: 12px; min-height: 300px; max-height: 400px; background: #0d0d0d; color: #0f0; border: 2px solid #333;">${aiPrompt}</textarea>
            </div>

            <div style="margin-bottom: 20px;">
                <details style="background: #1a1a1a; border: 2px solid #333; border-radius: 8px; padding: 12px;">
                    <summary style="cursor: pointer; color: #2196F3; font-weight: 600; font-size: 13px; user-select: none;">
                        📘 Example Output (What the AI should generate)
                    </summary>
                    <div style="margin-top: 12px; padding: 12px; background: #0d0d0d; border-radius: 6px; font-family: 'Consolas', monospace; font-size: 11px; color: #888; overflow-x: auto; white-space: pre-wrap;">
${exampleOutput}
                    </div>
                </details>
            </div>

            <div style="background: rgba(33, 150, 243, 0.1); border-left: 3px solid #2196F3; padding: 12px; border-radius: 0 6px 6px 0; margin-bottom: 20px;">
                <div style="color: #2196F3; font-weight: 600; font-size: 12px; margin-bottom: 6px;">💡 Pro Tips</div>
                <ul style="margin: 0; padding-left: 20px; color: #888; font-size: 12px; line-height: 1.6;">
                    <li>The prompt is designed to keep output concise (under 2000 chars)</li>
                    <li>If output is too long, ask AI to "make it more concise"</li>
                    <li>If too short, ask to "add more detail to X section"</li>
                    <li>Test with different field values, especially conditionals</li>
                    <li>You can refine the AI's output by asking follow-up questions</li>
                    ${analysis.warnings.length > 0 ? '<li><strong>Important:</strong> The AI knows about your template\'s limitations</li>' : ''}
                </ul>
            </div>

            <div class="lpb-edit-actions">
                <button class="lpb-btn lpb-btn-secondary" id="lpb-ai-prompt-close">Close</button>
                <button class="lpb-btn" id="lpb-paste-to-template" style="background: linear-gradient(135deg, #9C27B0, #7B1FA2);">
                   I Have the Code - Paste It
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    const textarea = modal.querySelector('#lpb-ai-prompt-text');

    modal.querySelector('#lpb-copy-ai-prompt')?.addEventListener('click', () => {
        textarea.select();
        navigator.clipboard.writeText(aiPrompt);
        const toastMsg = analysis.warnings.length > 0
            ? 'Prompt copied! Note: AI has been warned about limitations.'
            : 'AI prompt copied! Paste it into ChatGPT or Claude';
        Utils.showToast(toastMsg, 'success', 4000);
    });

    modal.querySelector('#lpb-ai-prompt-close')?.addEventListener('click', () => {
        modal.remove();
    });

    modal.querySelector('#lpb-paste-to-template')?.addEventListener('click', () => {
        modal.remove();
        this.showPasteAICodeModal();
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });

    setTimeout(() => {
        textarea.select();
    }, 100);
}

showPasteAICodeModal() {
    const modal = document.createElement('div');
    modal.className = 'lpb-edit-modal active';
    modal.style.zIndex = '10000002';

    modal.innerHTML = `
        <div class="lpb-edit-modal-content" style="max-width: 700px;">
            <h3 style="color: #9C27B0;">📝 Paste AI-Generated Code</h3>
            <p style="color: #888; font-size: 13px; margin-bottom: 16px;">
                Paste the function code that the AI generated for you:
            </p>
            <textarea class="lpb-textarea" id="lpb-paste-ai-code" placeholder="(d) => \`Your generated template...\`" style="font-family: 'Consolas', monospace; font-size: 12px; min-height: 200px; background: #0d0d0d;"></textarea>
            <div id="lpb-paste-error" style="display: none; color: #f44336; font-size: 13px; margin-top: 12px;"></div>
            <div class="lpb-edit-actions">
                <button class="lpb-btn lpb-btn-secondary" id="lpb-paste-cancel">Cancel</button>
                <button class="lpb-btn" id="lpb-paste-insert" style="background: linear-gradient(135deg, #4CAF50, #45a049);">
                    Insert into Template
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    const textarea = modal.querySelector('#lpb-paste-ai-code');
    const errorDiv = modal.querySelector('#lpb-paste-error');

    modal.querySelector('#lpb-paste-cancel')?.addEventListener('click', () => {
        modal.remove();
    });

    modal.querySelector('#lpb-paste-insert')?.addEventListener('click', () => {
        let code = textarea.value.trim();

        if (!code) {
            errorDiv.textContent = 'Please paste the AI-generated code';
            errorDiv.style.display = 'block';
            return;
        }

        code = code.replace(/```javascript\n?/g, '').replace(/```\n?/g, '').trim();

        try {
            new Function('d', `return (${code})(d);`);
        } catch (e) {
            errorDiv.textContent = 'Invalid function code. Please check and try again. Error: ' + e.message;
            errorDiv.style.display = 'block';
            return;
        }

        const templateTextarea = document.getElementById('lpb-template-generate-adv');
        if (templateTextarea) {
            templateTextarea.value = code;
            templateTextarea.dispatchEvent(new Event('input', { bubbles: true }));
        }

        modal.remove();
        Utils.showToast('AI-generated code inserted! Review and save your template.', 'success', 4000);
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });

    textarea.focus();
}

generateExampleOutput(fields) {
    const vars = fields.map(f => `\${d.${f.id}}`).join(', ');
    return `(d) => \`Create a system.

STRUCTURE:
- Script in ServerScriptService
- LocalScript in StarterPlayerScripts

FEATURES:
${fields.map(f => `- \${d.${f.id}} (from ${f.label})`).join('\n')}

IMPLEMENTATION:
Use the variables like: ${vars}

Handle conditionals properly:
\${d.someField === 'Yes' ? 'Include this' : ''}

Make it detailed and professional!\``;
}
syncFieldsBetweenModes(direction) {
    const nameB = document.getElementById('lpb-template-name');
    const nameA = document.getElementById('lpb-template-name-adv');
    const descB = document.getElementById('lpb-template-desc');
    const descA = document.getElementById('lpb-template-desc-adv');
    const genB = document.getElementById('lpb-template-generate');
    const genA = document.getElementById('lpb-template-generate-adv');

    if (direction === 'beginner-to-adv') {
        if (nameB && nameA) nameA.value = nameB.value;
        if (descB && descA) descA.value = descB.value;
        if (genB && genA) genA.value = genB.value;
    } else {
        if (nameB && nameA) nameB.value = nameA.value;
        if (descB && descA) descB.value = descA.value;
        if (genB && genA) genB.value = genA.value;
    }
}

updateVariableList() {
    const container = document.getElementById('lpb-variable-list');
    const fieldsContainer = document.getElementById('lpb-template-fields');
    if (!container || !fieldsContainer) return;

    const fields = fieldsContainer.querySelectorAll('.lpb-template-field');

    if (fields.length === 0) {
        container.innerHTML = '<span style="color: #666; font-size: 13px;">Variables will appear here as you add questions</span>';
        return;
    }

    let html = '';
    fields.forEach(field => {
        const idInput = field.querySelector('.field-id');
        if (idInput && idInput.value.trim()) {
            const varName = idInput.value.trim();
            html += `<button class="lpb-var-btn" data-var="${varName}" style="background: linear-gradient(135deg, #4CAF50, #45a049); color: white; border: none; padding: 6px 12px; border-radius: 4px; font-family: 'Consolas', monospace; font-size: 12px; cursor: pointer; transition: all 0.2s;">\${d.${Utils.escapeHtml(varName)}}</button>`;
        }
    });

    container.innerHTML = html || '<span style="color: #666; font-size: 13px;">Add variable names to your questions</span>';

    container.querySelectorAll('.lpb-var-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const varText = '${d.' + btn.dataset.var + '}';
            navigator.clipboard.writeText(varText).then(() => {
                const original = btn.textContent;
                btn.textContent = 'Copied!';
                btn.style.background = '#333';
                setTimeout(() => {
                    btn.textContent = original;
                    btn.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
                }, 1000);
            });
        });
        btn.addEventListener('mouseenter', () => {
            btn.style.transform = 'scale(1.05)';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'scale(1)';
        });
    });
}

updateVariableListAdvanced() {
    const container = document.getElementById('lpb-variable-list-adv');
    const fieldsContainer = document.getElementById('lpb-template-fields-adv');
    if (!container || !fieldsContainer) return;

    const fields = fieldsContainer.querySelectorAll('.lpb-template-field-adv');

    if (fields.length === 0) {
        container.innerHTML = '<span style="color: #666; font-size: 13px;">Variables will appear here as you add fields</span>';
        return;
    }

    let html = '';
    fields.forEach(field => {
        const idInput = field.querySelector('.field-id');
        if (idInput && idInput.value.trim()) {
            const varName = idInput.value.trim();
            html += `<button class="lpb-var-btn-adv" data-var="${varName}" style="background: linear-gradient(135deg, #9C27B0, #7B1FA2); color: white; border: none; padding: 6px 12px; border-radius: 4px; font-family: 'Consolas', monospace; font-size: 12px; cursor: pointer; transition: all 0.2s;">\${d.${Utils.escapeHtml(varName)}}</button>`;
        }
    });

    container.innerHTML = html || '<span style="color: #666; font-size: 13px;">Add variable IDs to your fields</span>';

    container.querySelectorAll('.lpb-var-btn-adv').forEach(btn => {
        btn.addEventListener('click', () => {
            const varText = '${d.' + btn.dataset.var + '}';
            navigator.clipboard.writeText(varText).then(() => {
                const original = btn.textContent;
                btn.textContent = 'Copied!';
                btn.style.background = '#333';
                setTimeout(() => {
                    btn.textContent = original;
                    btn.style.background = 'linear-gradient(135deg, #9C27B0, #7B1FA2)';
                }, 1000);
            });
        });
        btn.addEventListener('mouseenter', () => {
            btn.style.transform = 'scale(1.05)';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'scale(1)';
        });
    });
}

addTemplateFieldSimple(existingField = null) {
    const container = document.getElementById('lpb-template-fields');
    const noFieldsMsg = document.getElementById('lpb-no-fields-msg');
    if (!container) return;

    if (noFieldsMsg) noFieldsMsg.style.display = 'none';

    const fieldIndex = container.children.length;

    const fieldDiv = document.createElement('div');
    fieldDiv.className = 'lpb-template-field';
    fieldDiv.style.cssText = 'margin-bottom: 12px; background: #0d0d0d; border: 2px solid #2a2a2a; border-radius: 8px; padding: 16px; transition: border-color 0.2s;';
    fieldDiv.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; padding-bottom: 10px; border-bottom: 1px solid #2a2a2a;">
            <span style="color: #4CAF50; font-weight: 600; font-size: 13px;">Question ${fieldIndex + 1}</span>
            <button class="lpb-btn lpb-btn-small" data-action="remove-field" style="background: transparent; color: #f44336; border: 1px solid #f44336; padding: 4px 12px; font-size: 11px; border-radius: 4px;">Remove</button>
        </div>

        <div style="display: grid; grid-template-columns: 140px 1fr; gap: 12px; margin-bottom: 12px;">
            <div>
                <label style="display: block; color: #888; font-size: 11px; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">Variable</label>
                <input type="text" class="lpb-input field-id" placeholder="myVar" value="${existingField ? Utils.escapeHtml(existingField.id) : ''}" style="font-family: 'Consolas', monospace; font-size: 13px; background: #1a1a1a; border: 2px solid #333; padding: 10px 12px;">
            </div>
            <div>
                <label style="display: block; color: #888; font-size: 11px; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">Question Text</label>
                <input type="text" class="lpb-input field-label" placeholder="What would you like to know?" value="${existingField ? Utils.escapeHtml(existingField.label) : ''}" style="background: #1a1a1a; border: 2px solid #333; padding: 10px 12px;">
            </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div>
                <label style="display: block; color: #888; font-size: 11px; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">Answer Type</label>
                <select class="lpb-select field-type" style="background: #1a1a1a; border: 2px solid #333; padding: 10px 12px; font-size: 13px;">
                    <option value="text" ${existingField?.type === 'text' ? 'selected' : ''}>Short Text</option>
                    <option value="textarea" ${existingField?.type === 'textarea' ? 'selected' : ''}>Long Text</option>
                    <option value="select" ${existingField?.type === 'select' ? 'selected' : ''}>Dropdown Menu</option>
                </select>
            </div>
            <div class="field-options-container" style="display: none;">
                <label style="display: block; color: #888; font-size: 11px; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">Options</label>
                <input type="text" class="lpb-input field-options" placeholder="Option1, Option2, Option3" value="${existingField?.options ? existingField.options.join(', ') : ''}" style="background: #1a1a1a; border: 2px solid #333; padding: 10px 12px;">
            </div>
        </div>
    `;

    container.appendChild(fieldDiv);

    fieldDiv.addEventListener('mouseenter', () => {
        fieldDiv.style.borderColor = '#4CAF50';
    });
    fieldDiv.addEventListener('mouseleave', () => {
        fieldDiv.style.borderColor = '#2a2a2a';
    });

    const typeSelect = fieldDiv.querySelector('.field-type');
    const optionsContainer = fieldDiv.querySelector('.field-options-container');
    const idInput = fieldDiv.querySelector('.field-id');

    typeSelect.addEventListener('change', () => {
        optionsContainer.style.display = typeSelect.value === 'select' ? 'block' : 'none';
    });
    if (existingField?.type === 'select') optionsContainer.style.display = 'block';

    idInput.addEventListener('input', () => this.updateVariableList());

    fieldDiv.querySelector('[data-action="remove-field"]').addEventListener('click', () => {
        fieldDiv.remove();
        this.updateVariableList();
        this.renumberFields('lpb-template-fields', 'Question');
        if (container.children.length === 0 && noFieldsMsg) {
            noFieldsMsg.style.display = 'block';
        }
    });

    this.updateVariableList();
}

addTemplateFieldAdvanced(existingField = null) {
    console.log('[LPB] addTemplateFieldAdvanced called with:', existingField);

    const container = document.getElementById('lpb-template-fields-adv');
    const noFieldsMsg = document.getElementById('lpb-no-fields-msg-adv');
    if (!container) {
        console.error('[LPB] Container not found');
        return;
    }

    if (noFieldsMsg) noFieldsMsg.style.display = 'none';

    const fieldIndex = container.children.length;

    const fieldDiv = document.createElement('div');
    fieldDiv.className = 'lpb-template-field-adv';
    fieldDiv.style.cssText = 'margin-bottom: 12px; background: #0d0d0d; border: 2px solid #2a2a2a; border-radius: 8px; padding: 16px; transition: border-color 0.2s;';

    const fieldId = existingField?.id || '';
    const fieldLabel = existingField?.label || '';
    const fieldType = existingField?.type || 'text';
    const fieldRequired = existingField?.required ? 'selected' : '';
    const fieldDefault = existingField?.default || '';
    const fieldPlaceholder = existingField?.placeholder || '';
    const fieldOptions = existingField?.options ? existingField.options.join(', ') : '';
    const fieldMin = existingField?.min || '';
    const fieldMax = existingField?.max || '';
    const fieldStep = existingField?.step || '';
    const fieldHelp = existingField?.helpText || '';
    const showIfField = existingField?.show_if?.field || '';
    const showIfValue = existingField?.show_if?.value || '';

    fieldDiv.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; padding-bottom: 10px; border-bottom: 1px solid #2a2a2a;">
            <span style="color: #9C27B0; font-weight: 600; font-size: 13px;">Field ${fieldIndex + 1}</span>
            <button class="lpb-btn lpb-btn-small" data-action="remove-field" style="background: transparent; color: #f44336; border: 1px solid #f44336; padding: 4px 12px; font-size: 11px; border-radius: 4px;">Remove</button>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 12px;">
            <div>
                <label style="display: block; color: #888; font-size: 11px; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">Variable ID</label>
                <input type="text" class="lpb-input field-id" placeholder="variableName" value="${Utils.escapeHtml(fieldId)}" style="font-family: 'Consolas', monospace; background: #1a1a1a; border: 2px solid #333; padding: 10px 12px;">
            </div>
            <div>
                <label style="display: block; color: #888; font-size: 11px; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">Label</label>
                <input type="text" class="lpb-input field-label" placeholder="Display Label" value="${Utils.escapeHtml(fieldLabel)}" style="background: #1a1a1a; border: 2px solid #333; padding: 10px 12px;">
            </div>
            <div>
                <label style="display: block; color: #888; font-size: 11px; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">Type</label>
                <select class="lpb-select field-type" style="background: #1a1a1a; border: 2px solid #333; padding: 10px 12px;">
                    <option value="text" ${fieldType === 'text' ? 'selected' : ''}>Text</option>
                    <option value="textarea" ${fieldType === 'textarea' ? 'selected' : ''}>Textarea</option>
                    <option value="number" ${fieldType === 'number' ? 'selected' : ''}>Number</option>
                    <option value="select" ${fieldType === 'select' ? 'selected' : ''}>Select</option>
                    <option value="radio" ${fieldType === 'radio' ? 'selected' : ''}>Radio</option>
                    <option value="checkbox" ${fieldType === 'checkbox' ? 'selected' : ''}>Checkbox</option>
                    <option value="list" ${fieldType === 'list' ? 'selected' : ''}>List (Multiple Items)</option>
                </select>
            </div>
        </div>

        <!-- Conditional Logic Section -->
        <div class="field-conditional-container" style="display: none; background: linear-gradient(135deg, rgba(255, 152, 0, 0.1), rgba(255, 152, 0, 0.05)); border-left: 3px solid #FF9800; padding: 12px; border-radius: 0 6px 6px 0; margin-bottom: 12px;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF9800" stroke-width="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                    <path d="M2 17l10 5 10-5"/>
                    <path d="M2 12l10 5 10-5"/>
                </svg>
                <span style="color: #FF9800; font-weight: 600; font-size: 12px;">Conditional Logic (Optional)</span>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                <div>
                    <label style="display: block; color: #888; font-size: 11px; margin-bottom: 6px;">Show this field when</label>
                    <select class="lpb-select field-show-when" style="background: #1a1a1a; border: 2px solid #333; padding: 8px 12px; font-size: 13px;">
                        <option value="">Always show</option>
                    </select>
                </div>
                <div>
                    <label style="display: block; color: #888; font-size: 11px; margin-bottom: 6px;">Equals this value</label>
                    <input type="text" class="lpb-input field-show-when-value" placeholder="e.g., Yes, true, 1" value="${Utils.escapeHtml(showIfValue)}" style="background: #1a1a1a; border: 2px solid #333; padding: 8px 12px; font-size: 13px;">
                </div>
            </div>
            <div style="margin-top: 8px; font-size: 11px; color: #888;">
                💡 Example: Show "Max Stack Size" only when "Stackable Items" equals "Yes"
            </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 12px;">
            <div>
                <label style="display: block; color: #888; font-size: 11px; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">Default</label>
                <input type="text" class="lpb-input field-default" placeholder="Default value" value="${Utils.escapeHtml(fieldDefault)}" style="background: #1a1a1a; border: 2px solid #333; padding: 10px 12px;">
            </div>
            <div>
                <label style="display: block; color: #888; font-size: 11px; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">Placeholder</label>
                <input type="text" class="lpb-input field-placeholder" placeholder="Placeholder text" value="${Utils.escapeHtml(fieldPlaceholder)}" style="background: #1a1a1a; border: 2px solid #333; padding: 10px 12px;">
            </div>
            <div>
                <label style="display: block; color: #888; font-size: 11px; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">Required</label>
                <select class="lpb-select field-required" style="background: #1a1a1a; border: 2px solid #333; padding: 10px 12px;">
                    <option value="false">Optional</option>
                    <option value="true" ${fieldRequired}>Required</option>
                </select>
            </div>
        </div>

        <div class="field-options-container" style="display: none; background: #1a1a1a; padding: 12px; border-radius: 6px; margin-bottom: 12px;">
            <label style="display: block; color: #888; font-size: 11px; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">Options (comma-separated)</label>
            <input type="text" class="lpb-input field-options" placeholder="Option1, Option2, Option3" value="${Utils.escapeHtml(fieldOptions)}" style="background: #0d0d0d; border: 2px solid #333; padding: 10px 12px;">
        </div>

        <div class="field-list-options" style="display: none; background: #1a1a1a; padding: 12px; border-radius: 6px; margin-bottom: 12px;">
            <label style="display: block; color: #888; font-size: 11px; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">List Item Placeholder</label>
            <input type="text" class="lpb-input field-list-placeholder" placeholder="e.g., Enter item..." value="${Utils.escapeHtml(fieldPlaceholder)}" style="background: #0d0d0d; border: 2px solid #333; padding: 10px 12px;">
            <div style="margin-top: 8px; font-size: 11px; color: #666;">
                Users can add multiple text entries, like menu buttons or feature lists
            </div>
        </div>

        <div class="field-number-options" style="display: none; background: #1a1a1a; padding: 12px; border-radius: 6px; margin-bottom: 12px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px;">
                <div>
                    <label style="display: block; color: #888; font-size: 11px; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">Min</label>
                    <input type="number" class="lpb-input field-min" placeholder="0" value="${fieldMin}" style="background: #0d0d0d; border: 2px solid #333; padding: 10px 12px;">
                </div>
                <div>
                    <label style="display: block; color: #888; font-size: 11px; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">Max</label>
                    <input type="number" class="lpb-input field-max" placeholder="100" value="${fieldMax}" style="background: #0d0d0d; border: 2px solid #333; padding: 10px 12px;">
                </div>
                <div>
                    <label style="display: block; color: #888; font-size: 11px; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">Step</label>
                    <input type="number" class="lpb-input field-step" placeholder="1" value="${fieldStep}" style="background: #0d0d0d; border: 2px solid #333; padding: 10px 12px;">
                </div>
            </div>
        </div>

        <div>
            <label style="display: block; color: #888; font-size: 11px; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">Help Text</label>
            <input type="text" class="lpb-input field-help" placeholder="Additional instructions" value="${Utils.escapeHtml(fieldHelp)}" style="background: #1a1a1a; border: 2px solid #333; padding: 10px 12px;">
        </div>
    `;

    container.appendChild(fieldDiv);

    fieldDiv.addEventListener('mouseenter', () => {
        fieldDiv.style.borderColor = '#9C27B0';
    });
    fieldDiv.addEventListener('mouseleave', () => {
        fieldDiv.style.borderColor = '#2a2a2a';
    });

    const typeSelect = fieldDiv.querySelector('.field-type');
    const optionsContainer = fieldDiv.querySelector('.field-options-container');
    const numberOptions = fieldDiv.querySelector('.field-number-options');
    const conditionalContainer = fieldDiv.querySelector('.field-conditional-container');
    const idInput = fieldDiv.querySelector('.field-id');
    const showWhenSelect = fieldDiv.querySelector('.field-show-when');

const updateVisibility = () => {
    const type = typeSelect.value;
    optionsContainer.style.display = ['select', 'radio'].includes(type) ? 'block' : 'none';
    numberOptions.style.display = ['number'].includes(type) ? 'block' : 'none';

    const listOptions = fieldDiv.querySelector('.field-list-options');
    if (listOptions) {
        listOptions.style.display = type === 'list' ? 'block' : 'none';
    }
};;

    typeSelect.addEventListener('change', updateVisibility);
    updateVisibility();

    const updateConditionalDropdown = () => {
        const allFields = Array.from(container.querySelectorAll('.lpb-template-field-adv'));
        const currentIndex = allFields.indexOf(fieldDiv);

        conditionalContainer.style.display = currentIndex > 0 ? 'block' : 'none';

        if (currentIndex === 0) {
            return;
        }

        showWhenSelect.innerHTML = '<option value="">Always show</option>';

        allFields.slice(0, currentIndex).forEach((prevField) => {
            const prevId = prevField.querySelector('.field-id').value.trim();
            const prevLabel = prevField.querySelector('.field-label').value.trim();
            const prevType = prevField.querySelector('.field-type').value;

            const canControl = ['select', 'radio', 'checkbox'].includes(prevType);

            if (prevId && canControl) {
                const optionEl = document.createElement('option');
                optionEl.value = prevId;
                optionEl.textContent = `${prevLabel || prevId} ✓`;

                if (existingField?.show_if?.field === prevId) {
                    optionEl.selected = true;
                }
                showWhenSelect.appendChild(optionEl);
            }
        });
    };

updateConditionalDropdown();

idInput.addEventListener('input', () => {
    this.updateVariableListAdvanced();
    this.updateAllConditionalDropdowns();
});

container.querySelectorAll('.lpb-template-field-adv').forEach(f => {
    if (f !== fieldDiv) {
        const allFields = Array.from(container.querySelectorAll('.lpb-template-field-adv'));
        const otherIndex = allFields.indexOf(f);
        if (otherIndex > 0) {
            const otherShowWhen = f.querySelector('.field-show-when');
            const otherConditional = f.querySelector('.field-conditional-container');
            if (otherShowWhen && otherConditional) {
                otherConditional.style.display = 'block';
                const currentVal = otherShowWhen.value;
                otherShowWhen.innerHTML = '<option value="">Always show</option>';

                allFields.slice(0, otherIndex).forEach(prevField => {
                    const prevId = prevField.querySelector('.field-id').value.trim();
                    const prevLabel = prevField.querySelector('.field-label').value.trim();
                    const prevType = prevField.querySelector('.field-type').value;
                    const canControl = ['select', 'radio', 'checkbox'].includes(prevType);

                    if (prevId && canControl) {
                        const opt = document.createElement('option');
                        opt.value = prevId;
                        opt.textContent = `${prevLabel || prevId} ✓`;
                        if (prevId === currentVal) opt.selected = true;
                        otherShowWhen.appendChild(opt);
                    }
                });
            }
        }
    }
});

typeSelect.addEventListener('change', () => {
    updateVisibility();
    this.updateAllConditionalDropdowns();
});

    fieldDiv.querySelector('[data-action="remove-field"]').addEventListener('click', () => {
        fieldDiv.remove();
        this.updateVariableListAdvanced();
        this.renumberFields('lpb-template-fields-adv', 'Field');

        container.querySelectorAll('.lpb-template-field-adv').forEach((f, idx) => {
            const conditional = f.querySelector('.field-conditional-container');
            if (conditional) {
                conditional.style.display = idx > 0 ? 'block' : 'none';
            }

            if (idx > 0) {
                const showWhen = f.querySelector('.field-show-when');
                if (showWhen) {
                    const allFields = Array.from(container.querySelectorAll('.lpb-template-field-adv'));
                    const currentVal = showWhen.value;

                    showWhen.innerHTML = '<option value="">Always show</option>';
                    allFields.slice(0, idx).forEach((prevField) => {
                        const prevId = prevField.querySelector('.field-id').value.trim();
                        const prevLabel = prevField.querySelector('.field-label').value.trim();
                        const prevType = prevField.querySelector('.field-type').value;
                        const canControl = ['select', 'radio', 'checkbox'].includes(prevType);

                        if (prevId && canControl) {
                            const opt = document.createElement('option');
                            opt.value = prevId;
                            opt.textContent = `${prevLabel || prevId} ✓`;
                            if (prevId === currentVal) opt.selected = true;
                            showWhen.appendChild(opt);
                        }
                    });
                }
            }
        });

        if (container.children.length === 0 && noFieldsMsg) {
            noFieldsMsg.style.display = 'block';
        }
    });

    this.updateVariableListAdvanced();
}
updateAllConditionalDropdowns() {
    console.log('[LPB] Updating all conditional dropdowns...');

    const container = document.getElementById('lpb-template-fields-adv');
    if (!container) return;

    const allFields = Array.from(container.querySelectorAll('.lpb-template-field-adv'));

    allFields.forEach((fieldDiv, currentIndex) => {
        const conditionalContainer = fieldDiv.querySelector('.field-conditional-container');
        const showWhenSelect = fieldDiv.querySelector('.field-show-when');

        if (!conditionalContainer || !showWhenSelect) return;

        if (currentIndex === 0) {
            conditionalContainer.style.display = 'none';
            return;
        }

        conditionalContainer.style.display = 'block';

        const currentValue = showWhenSelect.value;

        showWhenSelect.innerHTML = '<option value="">Always show</option>';

        allFields.slice(0, currentIndex).forEach((prevField) => {
            const prevId = prevField.querySelector('.field-id').value.trim();
            const prevLabel = prevField.querySelector('.field-label').value.trim();
            const prevType = prevField.querySelector('.field-type').value;

            const canControl = ['select', 'radio', 'checkbox'].includes(prevType);

            if (prevId && canControl) {
                const option = document.createElement('option');
                option.value = prevId;
                option.textContent = `${prevLabel || prevId} ✓`;

                if (prevId === currentValue) {
                    option.selected = true;
                }

                showWhenSelect.appendChild(option);
            }
        });

        console.log(`[LPB] Updated conditional dropdown for field ${currentIndex + 1}, found ${showWhenSelect.options.length - 1} controlling fields`);
    });
}
saveCustomTemplate(templateId = null) {
    const advancedSection = document.getElementById('lpb-advanced-section');
    const isAdvancedMode = advancedSection && advancedSection.style.display !== 'none';

    const nameInput = document.getElementById(isAdvancedMode ? 'lpb-template-name-adv' : 'lpb-template-name');
    const descInput = document.getElementById(isAdvancedMode ? 'lpb-template-desc-adv' : 'lpb-template-desc');
    const generateInput = document.getElementById(isAdvancedMode ? 'lpb-template-generate-adv' : 'lpb-template-generate');
    const fieldsContainer = document.getElementById(isAdvancedMode ? 'lpb-template-fields-adv' : 'lpb-template-fields');

    if (!nameInput || !generateInput || !fieldsContainer) {
        Utils.showToast('Form elements not found', 'error');
        return;
    }

    const name = nameInput.value.trim();
    const description = descInput ? descInput.value.trim() : '';
    const generateFunction = generateInput.value.trim();

    if (!name) {
        Utils.showToast('Please enter a template name', 'error');
        return;
    }

    if (!generateFunction) {
        Utils.showToast('Please enter a generate function', 'error');
        return;
    }

    const fields = [];
    let hasErrors = false;

    const fieldClass = isAdvancedMode ? '.lpb-template-field-adv' : '.lpb-template-field';

    fieldsContainer.querySelectorAll(fieldClass).forEach(fieldDiv => {
        const idInput = fieldDiv.querySelector('.field-id');
        const labelInput = fieldDiv.querySelector('.field-label');
        const typeSelect = fieldDiv.querySelector('.field-type');
        const requiredSelect = fieldDiv.querySelector('.field-required');
        const defaultInput = fieldDiv.querySelector('.field-default');
        const optionsInput = fieldDiv.querySelector('.field-options');

        if (!idInput || !labelInput) return;

        const id = idInput.value.trim();
        const label = labelInput.value.trim();

        if (!id || !label) {
            hasErrors = true;
            return;
        }

        const field = {
            id,
            label,
            type: typeSelect ? typeSelect.value : 'text',
            required: requiredSelect ? requiredSelect.value === 'true' : false,
            default: defaultInput ? defaultInput.value.trim() : ''
        };

        if ((field.type === 'select' || field.type === 'radio') && optionsInput) {
            const optionsValue = optionsInput.value.trim();
            if (optionsValue) {
                field.options = optionsValue.split(',').map(o => o.trim()).filter(o => o);
            }
        }

if (isAdvancedMode) {
    const placeholderInput = fieldDiv.querySelector('.field-placeholder');
    const helpInput = fieldDiv.querySelector('.field-help');
    const minInput = fieldDiv.querySelector('.field-min');
    const maxInput = fieldDiv.querySelector('.field-max');
    const stepInput = fieldDiv.querySelector('.field-step');
    const showWhenSelect = fieldDiv.querySelector('.field-show-when');
    const showWhenValueInput = fieldDiv.querySelector('.field-show-when-value');
    const listPlaceholder = fieldDiv.querySelector('.field-list-placeholder');

    if (placeholderInput && placeholderInput.value.trim()) {
        field.placeholder = placeholderInput.value.trim();
    }
    if (field.type === 'list' && listPlaceholder && listPlaceholder.value.trim()) {
        field.placeholder = listPlaceholder.value.trim();
    }
    if (helpInput && helpInput.value.trim()) {
        field.helpText = helpInput.value.trim();
    }
    if (minInput && minInput.value.trim()) {
        field.min = parseFloat(minInput.value);
    }
    if (maxInput && maxInput.value.trim()) {
        field.max = parseFloat(maxInput.value);
    }
    if (stepInput && stepInput.value.trim()) {
        field.step = parseFloat(stepInput.value);
    }

            if (showWhenSelect && showWhenSelect.value && showWhenValueInput && showWhenValueInput.value.trim()) {
                field.show_if = {
                    field: showWhenSelect.value,
                    value: showWhenValueInput.value.trim()
                };
                console.log('[LPB] Saving conditional logic for field:', field.id, field.show_if);
            }
        }

        fields.push(field);
    });

    if (hasErrors) {
        Utils.showToast('Some fields are missing ID or label', 'error');
        return;
    }

    if (fields.length === 0) {
        Utils.showToast('Please add at least one field', 'error');
        return;
    }

    try {
        new Function('d', `return (${generateFunction})(d);`);
    } catch (e) {
        Utils.showToast('Invalid generate function: ' + e.message, 'error');
        return;
    }

    try {
        if (templateId) {
            console.log('[LPB] Updating template:', templateId);
            console.log('[LPB] Fields with conditional logic:', fields.filter(f => f.show_if));

            const existingTemplate = this.customTemplateManager.getById(templateId);
            if (!existingTemplate) {
                Utils.showToast('Template not found', 'error');
                return;
            }

            existingTemplate.name = name;
            existingTemplate.description = description;
            existingTemplate.fields = fields;
            existingTemplate.generateFunction = generateFunction;

            this.customTemplateManager.templates[templateId] = existingTemplate;
            this.customTemplateManager.save();

            this.customTemplateManager.updateCategory(templateId, existingTemplate);

            Utils.showToast('Template updated!', 'success');
        } else {
            console.log('[LPB] Creating template');
            console.log('[LPB] Fields with conditional logic:', fields.filter(f => f.show_if));

            const newTemplate = this.customTemplateManager.create(name, description, fields, generateFunction);

            if (newTemplate) {
                console.log('[LPB] Loading new template into categories');
                this.customTemplateManager.addToCategory(newTemplate.id, newTemplate);
            }

            Utils.showToast('Template created!', 'success');
        }

        this.showCustomTemplates();
    } catch (error) {
        console.error('[LPB] Save failed:', error);
        Utils.showToast('Failed to save template: ' + error.message, 'error');
    }
}
showShareTemplateModal(templateId) {
    const shareCode = this.customTemplateManager.export(templateId);
    if (!shareCode) {
        Utils.showToast('Failed to export template', 'error');
        return;
    }

    const modal = document.createElement('div');
    modal.className = 'lpb-edit-modal active';
    modal.innerHTML = `
        <div class="lpb-edit-modal-content">
            <h3>Share Template</h3>
            <p style="color: #888; font-size: 13px; margin-bottom: 16px;">
                Copy this code and share it with others. Your creator ID is embedded to protect your ownership.
            </p>
            <textarea class="lpb-textarea" id="lpb-share-template-code" readonly style="font-family: monospace; font-size: 12px; min-height: 120px;">${shareCode}</textarea>
            <div class="lpb-edit-actions">
                <button class="lpb-btn lpb-btn-secondary" id="lpb-share-template-close">Close</button>
                <button class="lpb-btn" id="lpb-share-template-copy">Copy to Clipboard</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    const textarea = modal.querySelector('#lpb-share-template-code');
    if (textarea) {
        textarea.select();
    }

    const closeBtn = modal.querySelector('#lpb-share-template-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.remove();
        });
    }

    const copyBtn = modal.querySelector('#lpb-share-template-copy');
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            if (textarea) {
                textarea.select();
                navigator.clipboard.writeText(shareCode);
                Utils.showToast('Template code copied to clipboard!', 'success');
            }
        });
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

showImportTemplateModal() {
    const modal = document.createElement('div');
    modal.className = 'lpb-edit-modal active';
    modal.innerHTML = `
        <div class="lpb-edit-modal-content">
            <h3>Import Template</h3>
            <p style="color: #888; font-size: 13px; margin-bottom: 16px;">
                Paste the template code you received from someone:
            </p>
            <textarea class="lpb-textarea" id="lpb-import-template-code" placeholder="Paste template code here..." style="font-family: monospace; font-size: 12px; min-height: 120px;"></textarea>
            <div id="lpb-import-template-error" style="display: none; color: #f44336; font-size: 13px; margin-top: 12px;"></div>
            <div class="lpb-edit-actions">
                <button class="lpb-btn lpb-btn-secondary" id="lpb-import-template-close">Cancel</button>
                <button class="lpb-btn" id="lpb-import-template-add">Import Template</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    const textarea = modal.querySelector('#lpb-import-template-code');
    const errorDiv = modal.querySelector('#lpb-import-template-error');

    modal.querySelector('#lpb-import-template-close').addEventListener('click', () => {
        modal.remove();
    });

    modal.querySelector('#lpb-import-template-add').addEventListener('click', () => {
        const code = textarea.value.trim();

        if (!code) {
            errorDiv.textContent = 'Please paste a template code';
            errorDiv.style.display = 'block';
            return;
        }

        const result = this.customTemplateManager.import(code);

        if (result && result.error) {
            errorDiv.textContent = result.error;
            errorDiv.style.display = 'block';
        } else {
            modal.remove();
            Utils.showToast('Template imported successfully!', 'success');
            this.showCustomTemplates();
        }
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });

    textarea.focus();
}
renumberFields(containerId, label) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.querySelectorAll(':scope > div').forEach((field, index) => {
        const labelEl = field.querySelector('span');
        if (labelEl) {
            labelEl.textContent = `${label} ${index + 1}`;
        }
    });
}

showCustomTemplates() {
    const content = document.getElementById('lpb-main-content');
    if (!content) return;

    let templates = [];
    let creatorName = 'Anonymous';

    try {
        templates = this.customTemplateManager.getAll();
        creatorName = this.customTemplateManager.getCreatorName();
    } catch (e) {
        console.error('[LPB] Failed to get templates:', e);
    }

    const html = `
        <div style="background: linear-gradient(135deg, rgba(76, 175, 80, 0.1), rgba(76, 175, 80, 0.05)); border: 1px solid rgba(76, 175, 80, 0.3); border-radius: 8px; padding: 20px; margin-bottom: 24px;">
            <h4 style="margin: 0 0 8px 0; color: #4CAF50; font-size: 15px;">Custom Templates</h4>
            <p style="margin: 0; color: #888; font-size: 13px; line-height: 1.6;">
                Create reusable prompt templates with custom input fields. Build once, use anytime.
            </p>
        </div>

        <div style="background: #1a1a1a; border: 2px solid #333; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <span style="color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Creator Name</span>
                    <div style="color: #fff; font-size: 15px; font-weight: 600; margin-top: 4px;">${Utils.escapeHtml(creatorName)}</div>
                </div>
                <button class="lpb-btn lpb-btn-small lpb-btn-secondary" id="lpb-change-creator-name" style="padding: 8px 16px;">Change</button>
            </div>
        </div>

        <div style="display: flex; gap: 12px; margin-bottom: 24px;">
            <button class="lpb-btn" id="lpb-create-template" style="background: linear-gradient(135deg, #4CAF50, #45a049); padding: 12px 24px; font-size: 14px;">Create New Template</button>
            <button class="lpb-btn lpb-btn-secondary" id="lpb-import-template" style="padding: 12px 24px; font-size: 14px;">Import Template</button>
        </div>

        ${templates.length === 0 ? `
            <div style="text-align: center; padding: 48px 24px; background: #1a1a1a; border: 2px dashed #333; border-radius: 8px;">
                <div style="font-size: 14px; color: #888; margin-bottom: 8px;">No templates yet</div>
                <div style="font-size: 13px; color: #666;">Click "Create New Template" to get started</div>
            </div>
        ` : `
            <div style="display: grid; gap: 12px;">
                ${templates.map(t => {
                    const canEdit = this.customTemplateManager.canEdit(t.id);
                    return `
                        <div style="background: #1a1a1a; border: 2px solid #333; border-radius: 8px; padding: 20px; transition: border-color 0.2s;" onmouseenter="this.style.borderColor='#4CAF50'" onmouseleave="this.style.borderColor='#333'">
                            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                                <div>
                                    <div style="font-size: 16px; font-weight: 600; color: #fff; margin-bottom: 4px;">${Utils.escapeHtml(t.name)}</div>
                                    <div style="font-size: 12px; color: #666;">
                                        by ${Utils.escapeHtml(t.creatorName)} | Used ${t.timesUsed || 0} times
                                        ${canEdit ? '<span style="color: #4CAF50; margin-left: 8px;">Yours</span>' : ''}
                                    </div>
                                </div>
                            </div>
                            <p style="margin: 0 0 16px 0; font-size: 13px; color: #888; line-height: 1.5;">
                                ${Utils.escapeHtml(t.description || 'No description')}
                            </p>
                            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
    <button class="lpb-btn lpb-btn-small" data-id="${t.id}" data-action="use" style="background: linear-gradient(135deg, #2196F3, #1976D2);">Use Template</button>
    <button class="lpb-btn lpb-btn-small lpb-btn-secondary" data-id="${t.id}" data-action="share">Share</button>
    ${canEdit ? `<button class="lpb-btn lpb-btn-small lpb-btn-secondary" data-id="${t.id}" data-action="edit">Edit</button>` : ''}
    ${this.customTemplateManager.canDelete(t.id) ? `<button class="lpb-btn lpb-btn-small" data-id="${t.id}" data-action="delete" style="background: transparent; color: #f44336; border: 1px solid #f44336;">Delete</button>` : ''}
</div>
                        </div>
                    `;
                }).join('')}
            </div>
        `}
    `;

    content.innerHTML = html;

    document.getElementById('lpb-change-creator-name')?.addEventListener('click', () => this.showChangeCreatorNameModal());
    document.getElementById('lpb-create-template')?.addEventListener('click', () => this.showTemplateBuilder());
    document.getElementById('lpb-import-template')?.addEventListener('click', () => this.showImportTemplateModal());

    content.querySelectorAll('[data-action]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            const action = e.target.dataset.action;

            try {
                if (action === 'use') {
                    if (!CATEGORIES['custom-templates'] || !CATEGORIES['custom-templates'].templates[id]) {
                        Utils.showToast('Template not found - try refreshing', 'error');
                        return;
                    }
                    this.openTemplate('custom-templates', id);
                } else if (action === 'share') {
                    this.showShareTemplateModal(id);
                } else if (action === 'edit') {
                    this.showTemplateBuilder(id);
                } else if (action === 'delete') {
                    if (confirm('Delete this template permanently?')) {
                        const result = this.customTemplateManager.delete(id);
                        if (result && result.error) {
                            Utils.showToast(result.error, 'error');
                        } else {
                            Utils.showToast('Template deleted', 'success');
                            this.showCustomTemplates();
                        }
                    }
                }
            } catch (error) {
                console.error('[LPB] Action failed:', action, error);
                Utils.showToast('Error: ' + error.message, 'error');
            }
        });
    });
}
        showSettings() {
    const content = document.getElementById('lpb-main-content');

    content.innerHTML = `
        <div class="lpb-settings-section">
            <h3>Appearance</h3>
            <div class="lpb-setting-item">
                <div class="lpb-setting-label">
                    <h4>Theme</h4>
                    <p>Switch between dark and light mode</p>
                </div>
                <div class="lpb-toggle-switch ${this.settings.get('theme') === 'dark' ? 'active' : ''}" id="lpb-toggle-theme"></div>
            </div>
        </div>

        <div class="lpb-settings-section">
            <h3>Automation</h3>
            <div class="lpb-setting-item">
                <div class="lpb-setting-label">
                    <h4>Auto-Submit Prompts</h4>
                    <p>Automatically submit the prompt after inserting from history</p>
                </div>
                <div class="lpb-toggle-switch ${this.settings.get('autoSubmit') ? 'active' : ''}" id="lpb-toggle-autosubmit"></div>
            </div>
            <div class="lpb-setting-item">
                <div class="lpb-setting-label">
                    <h4>Auto-Submit Delay</h4>
                    <p>Wait time before submitting (milliseconds)</p>
                </div>
                <input type="number" class="lpb-input lpb-slider" id="lpb-autosubmit-delay" value="${this.settings.get('autoSubmitDelay')}" min="100" max="3000" step="100" style="width: 100px;">
            </div>
        </div>

        <div class="lpb-settings-section">
            <h3>File References</h3>
            <div class="lpb-setting-item">
                <div class="lpb-setting-label">
                    <h4>@ File Mentions</h4>
                    <p>Type @ in any text field to reference scripts/files from Lemonade's file system</p>
                </div>
            </div>
            <div class="lpb-setting-item">
                <div class="lpb-setting-label" style="font-size: 12px; color: #888;">
                    <strong>How it works:</strong> When you type @ in a text field, it mirrors your input to Lemonade's chat to trigger their file autocomplete, then extracts and shows you the files in a custom dropdown.
                </div>
            </div>
        </div>

        <div class="lpb-settings-section">
            <h3>Data Management</h3>
            <div class="lpb-setting-item">
                <div class="lpb-setting-label">
                    <h4>Export All Data</h4>
                    <p>Download all your prompts and settings</p>
                </div>
                <button class="lpb-btn lpb-btn-small" id="lpb-export-data">Export</button>
            </div>
            <div class="lpb-setting-item">
                <div class="lpb-setting-label">
                    <h4>Import Data</h4>
                    <p>Restore from a backup file</p>
                </div>
                <button class="lpb-btn lpb-btn-small" id="lpb-import-data">Import</button>
            </div>
            <div class="lpb-setting-item">
                <div class="lpb-setting-label">
                    <h4>Clear All History</h4>
                    <p>Delete all saved prompts and history</p>
                </div>
                <button class="lpb-btn lpb-btn-small lpb-btn-secondary" id="lpb-clear-all">Clear</button>
            </div>
        </div>

        <div class="lpb-settings-section">
            <h3>Statistics</h3>
            <div style="color: #888; font-size: 13px; line-height: 1.8;">
                <p style="margin: 8px 0;"> Total prompts created: <strong style="color: #2196F3;">${this.history.items.length}</strong></p>
                <p style="margin: 8px 0;"> Favorited prompts: <strong style="color: #2196F3;">${this.history.favorites.length}</strong></p>
                <p style="margin: 8px 0;"> Most used template: <strong style="color: #2196F3;">${this.getMostUsedTemplateName()}</strong></p>
            </div>
        </div>

        <div class="lpb-settings-section">
    <h3>About</h3>
    <p style="color: #888; font-size: 13px; line-height: 1.6;">
        <strong style="color: #2196F3;">Lemonade Prompt Builder v9.0.4.3</strong><br>
        Enhanced workflow for Roblox script generation with workflow automation<br>
        <br>
        <strong>Features:</strong><br>
        • 50+ pre-built templates across 9 categories<br>
        • Custom template creator with beginner & advanced modes<br>
        • Multi-step workflow builder with import/export<br>
        • File reference system (@mentions from Lemonade files)<br>
        • Conditional field logic (show/hide based on answers)<br>
        • History, favorites, and search<br>
        • Template sharing with import/export codes<br>
        • Auto-submit with configurable delay<br>
        • Dark/light themes<br>
        • Data export/import/backup<br>
        • Template usage statistics<br>
        <br>
        <strong>Keyboard Shortcuts:</strong><br>
        • Ctrl+Shift+P - Open builder<br>
        • Escape - Close modals<br>
        • @ in text fields - Reference files from Lemonade's file system<br>
        • Arrow keys - Navigate file autocomplete<br>
        • Enter/Tab - Select file from autocomplete<br>
        <br>
        <strong>Custom Templates:</strong><br>
        Create reusable templates with custom fields. Two modes:<br>
        <span style="color: #4CAF50;">▸ Beginner Mode:</span> Simple questions and answers<br>
        <span style="color: #9C27B0;">▸ Advanced Mode:</span> Full control with conditionals, validation, and metadata<br>
        Share templates via export codes with built-in creator attribution<br>
        <br>
        <strong>Workflows:</strong><br>
        Chain multiple templates together, save and share workflow codes with others, edit and reuse complex prompt sequences<br>
        <br>
        <strong>File References:</strong><br>
        Type @ in any text field to browse and attach files from Lemonade's workspace. The system mirrors your input to trigger Lemonade's file autocomplete, then presents files in a custom dropdown for easy selection.
    </p>
</div>
`;

    document.getElementById('lpb-toggle-theme')?.addEventListener('click', (e) => {
        const newTheme = this.settings.toggleTheme();
        e.target.classList.toggle('active', newTheme === 'dark');
        Utils.showToast(`Theme changed to ${newTheme} mode`, 'info');
    });

    document.getElementById('lpb-toggle-autosubmit')?.addEventListener('click', (e) => {
        const enabled = this.settings.toggleAutoSubmit();
        e.target.classList.toggle('active', enabled);
        Utils.showToast(enabled ? 'Auto-submit enabled' : 'Auto-submit disabled', 'info');
    });

    document.getElementById('lpb-autosubmit-delay')?.addEventListener('change', (e) => {
        this.settings.setAutoSubmitDelay(parseInt(e.target.value));
        Utils.showToast('Delay updated', 'success');
    });

    document.getElementById('lpb-export-data')?.addEventListener('click', () => {
        const data = {
            settings: this.settings.settings,
            history: this.history.items,
            favorites: this.history.favorites,
            templateStats: this.history.templateStats,
            exportDate: new Date().toISOString(),
            version: '9.0.4.3'
        };

        Utils.downloadFile(
            JSON.stringify(data, null, 2),
            `lemonade-builder-backup-${Date.now()}.json`,
            'application/json'
        );
        Utils.showToast('Data exported successfully', 'success');
    });

    document.getElementById('lpb-import-data')?.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result);

                    if (confirm('Import will overwrite current data. Continue?')) {
                        this.history.items = data.history || [];
                        this.history.favorites = data.favorites || [];
                        this.history.templateStats = data.templateStats || {};
                        this.history.storage.save(CONFIG.STORAGE_KEYS.HISTORY, this.history.items);
                        this.history.storage.save(CONFIG.STORAGE_KEYS.FAVORITES, this.history.favorites);
                        this.history.storage.save(CONFIG.STORAGE_KEYS.TEMPLATE_STATS, this.history.templateStats);

                        Object.keys(data.settings || {}).forEach(key => {
                            this.settings.set(key, data.settings[key]);
                        });

                        Utils.showToast('Data imported successfully!', 'success');
                        this.showSettings();
                    }
                } catch (err) {
                    Utils.showToast('Invalid backup file', 'error');
                    console.error('Import error:', err);
                }
            };
            reader.readAsText(file);
        };
        input.click();
    });

    document.getElementById('lpb-clear-all')?.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear ALL history and data? This cannot be undone!')) {
            this.history.items = [];
            this.history.favorites = [];
            this.history.templateStats = {};
            this.history.storage.save(CONFIG.STORAGE_KEYS.HISTORY, []);
            this.history.storage.save(CONFIG.STORAGE_KEYS.FAVORITES, []);
            this.history.storage.save(CONFIG.STORAGE_KEYS.TEMPLATE_STATS, {});
            Utils.showToast('All data cleared', 'success');
            this.showSettings();
        }
    });

            document.getElementById('lpb-import-data')?.addEventListener('click', () => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.json';
                input.onchange = (e) => {
                    const file = e.target.files[0];
                    if (!file) return;

                    const reader = new FileReader();
                    reader.onload = (event) => {
                        try {
                            const data = JSON.parse(event.target.result);

                            if (confirm('Import will overwrite current data. Continue?')) {
                                this.history.items = data.history || [];
                                this.history.favorites = data.favorites || [];
                                this.history.templateStats = data.templateStats || {};
                                this.history.storage.save(CONFIG.STORAGE_KEYS.HISTORY, this.history.items);
                                this.history.storage.save(CONFIG.STORAGE_KEYS.FAVORITES, this.history.favorites);
                                this.history.storage.save(CONFIG.STORAGE_KEYS.TEMPLATE_STATS, this.history.templateStats);

                                Object.keys(data.settings || {}).forEach(key => {
                                    this.settings.set(key, data.settings[key]);
                                });

                                Utils.showToast('Data imported successfully!', 'success');
                                this.showSettings();
                            }
                        } catch (err) {
                            Utils.showToast('Invalid backup file', 'error');
                            console.error('Import error:', err);
                        }
                    };
                    reader.readAsText(file);
                };
                input.click();
            });

            document.getElementById('lpb-clear-all')?.addEventListener('click', () => {
                if (confirm('Are you sure you want to clear ALL history and data? This cannot be undone!')) {
                    this.history.items = [];
                    this.history.favorites = [];
                    this.history.templateStats = {};
                    this.history.storage.save(CONFIG.STORAGE_KEYS.HISTORY, []);
                    this.history.storage.save(CONFIG.STORAGE_KEYS.FAVORITES, []);
                    this.history.storage.save(CONFIG.STORAGE_KEYS.TEMPLATE_STATS, {});
                    Utils.showToast('All data cleared', 'success');
                    this.showSettings();
                }
            });
        }

        getMostUsedTemplateName() {
            const mostUsed = this.history.getMostUsed(1);
            if (mostUsed.length === 0) return 'None';
            const [key, count] = mostUsed[0];
            const [category, template] = key.split(':');
            return `${template} (${count} uses)`;
        }
showWorkflows() {
    const content = document.getElementById('lpb-main-content');
    const workflows = this.workflowManager.getAll();

    const html = `
        <div style="background: rgba(255, 152, 0, 0.1); border: 1px solid #FF9800; border-radius: 6px; padding: 12px; margin-bottom: 20px; font-size: 13px; color: #FF9800;">
            ⚠️ Workflows are a new feature. If you encounter any bugs or issues, please let Silverfox0338 know!
        </div>
        <div style="display: flex; gap: 12px; margin-bottom: 20px;">
            <button class="lpb-btn lpb-btn-small" id="lpb-new-workflow">+ New Workflow</button>
            <button class="lpb-btn lpb-btn-small lpb-btn-secondary" id="lpb-import-workflow">Import Workflow</button>
        </div>
        ${workflows.length === 0 ? '<div class="lpb-empty">No workflows yet. Create one to chain multiple templates together!</div>' :
        workflows.map(w => `
            <div class="lpb-history-item">
                <div class="lpb-history-top">
                    <div class="lpb-history-info">
                        <span class="lpb-badge">${Utils.escapeHtml(w.name)}</span>
                        <span class="lpb-timestamp">${w.steps.length} steps • Used ${w.timesUsed} times</span>
                    </div>
                </div>
                <div style="margin: 12px 0; font-size: 13px; color: #888;">
                    ${w.steps.map((s, i) => {
                        const template = CATEGORIES[s.categoryKey].templates[s.templateKey];
                        return `${i + 1}. ${template.name}`;
                    }).join(' → ')}
                </div>
                <div class="lpb-history-actions">
                    <button class="lpb-btn lpb-btn-small" data-id="${w.id}" data-action="execute">Execute</button>
                    <button class="lpb-btn lpb-btn-small lpb-btn-secondary" data-id="${w.id}" data-action="share">Share</button>
                    <button class="lpb-btn lpb-btn-small lpb-btn-secondary" data-id="${w.id}" data-action="edit">Edit</button>
                    <button class="lpb-btn lpb-btn-small lpb-btn-secondary" data-id="${w.id}" data-action="delete">Delete</button>
                </div>
            </div>
        `).join('')}
    `;

    content.innerHTML = html;

    document.getElementById('lpb-new-workflow')?.addEventListener('click', () => {
    this.startWorkflowBuilder();
});

document.getElementById('lpb-import-workflow')?.addEventListener('click', () => {
    this.showImportWorkflowModal();
});

    content.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        const action = e.target.dataset.action;

        if (action === 'execute') {
            this.workflowManager.execute(id, this);
            this.hideModal('main');
            Utils.showToast('Workflow executed!', 'success');
        } else if (action === 'delete') {
            if (confirm('Delete this workflow?')) {
                this.workflowManager.delete(id);
                this.showWorkflows();
            }
        } else if (action === 'edit') {
            const workflow = this.workflowManager.getById(id);
            this.startWorkflowBuilder(workflow);
        } else if (action === 'share') {
            this.showShareWorkflowModal(id);
        }
    });
});
}

startWorkflowBuilder(existingWorkflow = null) {
    this.workflowBuilder.active = true;
    this.workflowBuilder.editingId = existingWorkflow?.id || null;
    this.workflowBuilder.steps = existingWorkflow ? JSON.parse(JSON.stringify(existingWorkflow.steps)) : [];

    const content = document.getElementById('lpb-main-content');
    content.innerHTML = `
        <div class="lpb-settings-section">
            <h3>${existingWorkflow ? 'Edit' : 'Create'} Workflow</h3>
            <div class="lpb-form-field">
                <label class="lpb-label">Workflow Name<span class="lpb-required">*</span></label>
                <input type="text" id="lpb-workflow-name" class="lpb-input" placeholder="e.g., Complete Inventory Setup" value="${existingWorkflow ? Utils.escapeHtml(existingWorkflow.name) : ''}">
            </div>

            <h4 style="color: #2196F3; margin-top: 24px;">Steps</h4>
            <div id="lpb-workflow-steps" style="margin: 16px 0;">
                <div class="lpb-empty">No steps added yet. Click "Add Step" to begin.</div>
            </div>

            <button class="lpb-btn lpb-btn-small" id="lpb-add-workflow-step">+ Add Step</button>

            <div class="lpb-actions" style="margin-top: 24px;">
                <button class="lpb-btn lpb-btn-secondary" id="lpb-cancel-workflow">Cancel</button>
                <button class="lpb-btn" id="lpb-save-workflow">${existingWorkflow ? 'Update' : 'Save'} Workflow</button>
            </div>
        </div>
    `;

    if (existingWorkflow && this.workflowBuilder.steps.length > 0) {
        const stepsContainer = document.getElementById('lpb-workflow-steps');
        stepsContainer.innerHTML = '';
        this.workflowBuilder.steps.forEach((step, index) => {
            this.renderWorkflowStep(index, step);
        });
    }

    document.getElementById('lpb-add-workflow-step')?.addEventListener('click', () => {
        this.addWorkflowStep();
    });

    document.getElementById('lpb-save-workflow')?.addEventListener('click', () => {
        this.saveWorkflow();
    });

    document.getElementById('lpb-cancel-workflow')?.addEventListener('click', () => {
        this.workflowBuilder.active = false;
        this.showWorkflows();
    });
}

addWorkflowStep(existingStep = null) {
    const stepIndex = this.workflowBuilder.steps.length;

    const content = document.getElementById('lpb-workflow-steps');
    if (content.querySelector('.lpb-empty')) {
        content.innerHTML = '';
    }

    this.renderWorkflowStep(stepIndex, existingStep);
}

renderWorkflowStep(stepIndex, existingStep = null) {
    const content = document.getElementById('lpb-workflow-steps');

    const stepDiv = document.createElement('div');
    stepDiv.className = 'lpb-history-item';
    stepDiv.dataset.stepIndex = stepIndex;

    const categoryKey = existingStep?.categoryKey || '';
    const templateKey = existingStep?.templateKey || '';

    stepDiv.innerHTML = `
        <div class="lpb-history-top">
            <div class="lpb-history-info">
                <span class="lpb-badge">Step ${stepIndex + 1}</span>
                ${existingStep ? `<span class="lpb-timestamp">${CATEGORIES[categoryKey].templates[templateKey].name}</span>` : ''}
            </div>
            <button class="lpb-fav-btn" data-step="${stepIndex}">×</button>
        </div>
        <div style="margin-top: 12px;">
            <select class="lpb-select" data-step="${stepIndex}" data-type="category">
                <option value="">Select Category...</option>
                ${Object.entries(CATEGORIES).map(([key, cat]) =>
                    `<option value="${key}" ${key === categoryKey ? 'selected' : ''}>${cat.name}</option>`
                ).join('')}
            </select>
            <div id="lpb-workflow-step-${stepIndex}-template" style="margin-top: 12px;"></div>
            <div id="lpb-workflow-step-${stepIndex}-form" style="margin-top: 12px;"></div>
        </div>
    `;

    content.appendChild(stepDiv);

    stepDiv.querySelector('.lpb-fav-btn').addEventListener('click', () => {
        if (confirm('Remove this step from the workflow?')) {
            stepDiv.remove();
            this.workflowBuilder.steps.splice(stepIndex, 1);
            this.reindexWorkflowSteps();
        }
    });

    const categorySelect = stepDiv.querySelector('select[data-type="category"]');
    categorySelect.addEventListener('change', (e) => {
        const selectedCategory = e.target.value;
        if (!selectedCategory) return;
        this.showWorkflowTemplateSelect(stepIndex, selectedCategory);
    });

    if (existingStep && categoryKey) {
        this.showWorkflowTemplateSelect(stepIndex, categoryKey, templateKey);
        if (templateKey) {
            this.showWorkflowStepForm(stepIndex, categoryKey, templateKey, existingStep.data);
        }
    }
}

reindexWorkflowSteps() {
    const content = document.getElementById('lpb-workflow-steps');
    const stepDivs = content.querySelectorAll('[data-step-index]');

    stepDivs.forEach((div, index) => {
        div.dataset.stepIndex = index;
        const badge = div.querySelector('.lpb-badge');
        if (badge) {
            badge.textContent = `Step ${index + 1}`;
        }
    });
}

showWorkflowTemplateSelect(stepIndex, categoryKey, selectedTemplate = '') {
    const templateDiv = document.getElementById(`lpb-workflow-step-${stepIndex}-template`);
    const templates = CATEGORIES[categoryKey].templates;

    templateDiv.innerHTML = `
        <select class="lpb-select" data-step="${stepIndex}" data-type="template">
            <option value="">Select Template...</option>
            ${Object.entries(templates).map(([key, tmpl]) =>
                `<option value="${key}" ${key === selectedTemplate ? 'selected' : ''}>${tmpl.name}</option>`
            ).join('')}
        </select>
        <button class="lpb-btn lpb-btn-small" style="margin-top: 8px;" data-step="${stepIndex}" data-action="configure">
            Configure Prompt
        </button>
    `;

    templateDiv.querySelector('select[data-type="template"]').addEventListener('change', (e) => {
        const templateKey = e.target.value;
        if (!templateKey) return;

        if (!this.workflowBuilder.steps[stepIndex]) {
            this.workflowBuilder.steps[stepIndex] = {};
        }
        this.workflowBuilder.steps[stepIndex].categoryKey = categoryKey;
        this.workflowBuilder.steps[stepIndex].templateKey = templateKey;
        this.workflowBuilder.steps[stepIndex].data = {};
    });

    templateDiv.querySelector('[data-action="configure"]').addEventListener('click', () => {
        const select = templateDiv.querySelector('select[data-type="template"]');
        const templateKey = select.value;

        if (!templateKey) {
            Utils.showToast('Please select a template first', 'error');
            return;
        }

        const existingData = this.workflowBuilder.steps[stepIndex]?.data || {};
        this.showWorkflowStepForm(stepIndex, categoryKey, templateKey, existingData);
    });
}

createWorkflowField(field, existingValue) {
    const wrapper = document.createElement('div');
    wrapper.className = 'lpb-form-field';
    wrapper.style.marginBottom = '16px';

    const label = document.createElement('label');
    label.className = 'lpb-label';
    label.innerHTML = Utils.escapeHtml(field.label) + (field.required ? '<span class="lpb-required">*</span>' : '');
    wrapper.appendChild(label);

    let input;

    if (field.type === 'text' || field.type === 'number') {
        input = document.createElement('input');
        input.type = field.type;
        input.className = 'lpb-input';
        input.value = existingValue !== undefined ? existingValue : (field.default || '');
        input.placeholder = field.placeholder || '';
        input.dataset.fieldId = field.id;
    } else if (field.type === 'textarea') {
        input = document.createElement('textarea');
        input.className = 'lpb-textarea';
        input.value = existingValue !== undefined ? existingValue : (field.default || '');
        input.placeholder = field.placeholder || '';
        input.dataset.fieldId = field.id;
        input.style.minHeight = '80px';
    } else if (field.type === 'select') {
        input = document.createElement('select');
        input.className = 'lpb-select';
        input.dataset.fieldId = field.id;
        field.options.forEach(opt => {
            const option = document.createElement('option');
            option.value = opt;
            option.textContent = opt;
            if (existingValue !== undefined) {
                if (opt === existingValue) option.selected = true;
            } else if (opt === field.default) {
                option.selected = true;
            }
            input.appendChild(option);
        });
    } else if (field.type === 'radio') {
        input = document.createElement('div');
        input.className = 'lpb-radio-group';
        input.dataset.fieldId = field.id;
        field.options.forEach((opt, i) => {
            const item = document.createElement('div');
            item.className = 'lpb-radio-item';

            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = `workflow_${field.id}`;
            radio.value = opt;
            radio.id = `workflow_${field.id}_${i}`;

            if (existingValue !== undefined) {
                if (opt === existingValue) radio.checked = true;
            } else if (opt === field.default) {
                radio.checked = true;
            }

            const lbl = document.createElement('label');
            lbl.htmlFor = radio.id;
            lbl.textContent = opt;

            item.appendChild(radio);
            item.appendChild(lbl);
            input.appendChild(item);
        });
    } else if (field.type === 'checkboxes') {
        input = document.createElement('div');
        input.className = 'lpb-checkbox-group';
        input.dataset.fieldId = field.id;
        field.options.forEach((opt, i) => {
            const item = document.createElement('div');
            item.className = 'lpb-checkbox-item';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = opt;
            checkbox.id = `workflow_${field.id}_${i}`;
            checkbox.dataset.parent = field.id;

            if (existingValue && Array.isArray(existingValue) && existingValue.includes(opt)) {
                checkbox.checked = true;
            }

            const lbl = document.createElement('label');
            lbl.htmlFor = checkbox.id;
            lbl.textContent = opt;

            item.appendChild(checkbox);
            item.appendChild(lbl);
            input.appendChild(item);
        });
    } else if (field.type === 'list') {
    input = this.createWorkflowListField(field.id, field.placeholder, existingValue);
}

    wrapper.appendChild(input);
    return wrapper;
}

createWorkflowListField(fieldId, placeholder, existingValues = []) {
    const wrapper = document.createElement('div');
    wrapper.className = 'lpb-list-wrapper';
    wrapper.dataset.fieldId = fieldId;

    const addRow = (value = '') => {
        const row = document.createElement('div');
        row.className = 'lpb-list-row';

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'lpb-list-input';
        input.placeholder = placeholder || '';
        input.value = value;
        input.addEventListener('input', () => {
            const event = new Event('input', { bubbles: true });
            wrapper.dispatchEvent(event);
        });
        this.fileAutocomplete.attach(input);

        const removeBtn = document.createElement('button');
        removeBtn.className = 'lpb-list-remove';
        removeBtn.textContent = 'Remove';
        removeBtn.onclick = () => {
            row.remove();
            const event = new Event('input', { bubbles: true });
            wrapper.dispatchEvent(event);
        };

        row.appendChild(input);
        row.appendChild(removeBtn);
        wrapper.insertBefore(row, addBtn);
    };

    const addBtn = document.createElement('button');
    addBtn.className = 'lpb-list-add';
    addBtn.textContent = 'Add Item';
    addBtn.onclick = () => addRow();

    wrapper.appendChild(addBtn);

    if (existingValues && existingValues.length > 0) {
        existingValues.forEach(val => addRow(val));
    } else {
        addRow();
    }

    return wrapper;
}

collectWorkflowStepData(stepIndex) {
    const container = document.getElementById(`lpb-workflow-step-${stepIndex}-fields`);
    const data = {};

    container.querySelectorAll('[data-field-id]').forEach(field => {
        const fieldId = field.dataset.fieldId;

        if (field.tagName === 'INPUT' || field.tagName === 'TEXTAREA' || field.tagName === 'SELECT') {
            data[fieldId] = field.value;
        } else if (field.classList.contains('lpb-radio-group')) {
            const checked = field.querySelector('input:checked');
            data[fieldId] = checked ? checked.value : '';
        } else if (field.classList.contains('lpb-checkbox-group')) {
            const checked = Array.from(field.querySelectorAll('input:checked'));
            data[fieldId] = checked.map(c => c.value);
        } else if (field.classList.contains('lpb-list-wrapper')) {
            const items = Array.from(field.querySelectorAll('.lpb-list-input'))
                .map(i => i.value.trim())
                .filter(v => v);
            data[fieldId] = items;
        }
    });

    return data;
}
showWorkflowStepForm(stepIndex, categoryKey, templateKey, existingData = {}) {
    const formContainer = document.getElementById(`lpb-workflow-step-${stepIndex}-form`);
    const template = CATEGORIES[categoryKey].templates[templateKey];

    const fieldsContainer = document.createElement('div');
    fieldsContainer.id = `lpb-workflow-step-${stepIndex}-fields`;
    fieldsContainer.style.cssText = `
        background: #1a1a1a;
        border: 2px solid #333;
        border-radius: 8px;
        padding: 16px;
        margin-top: 12px;
    `;

    const title = document.createElement('div');
    title.style.cssText = 'color: #2196F3; font-weight: 600; margin-bottom: 12px; font-size: 14px;';
    title.textContent = 'Configure: ' + template.name;
    fieldsContainer.appendChild(title);

    template.fields.forEach(field => {
        const fieldWrapper = this.createWorkflowField(field, existingData[field.id]);
        fieldsContainer.appendChild(fieldWrapper);

        setTimeout(() => {
            const inputs = fieldWrapper.querySelectorAll('input[type="text"], textarea');
            inputs.forEach(input => {
                if (this.fileAutocomplete) {
                    this.fileAutocomplete.attach(input);
                }
            });
        }, 100);
    });

    const saveBtn = document.createElement('button');
    saveBtn.className = 'lpb-btn lpb-btn-small';
    saveBtn.textContent = 'Save Step Configuration';
    saveBtn.style.marginTop = '16px';
    saveBtn.addEventListener('click', () => {
        const data = this.collectWorkflowStepData(stepIndex);

        if (!this.workflowBuilder.steps[stepIndex]) {
            this.workflowBuilder.steps[stepIndex] = {};
        }
        this.workflowBuilder.steps[stepIndex].categoryKey = categoryKey;
        this.workflowBuilder.steps[stepIndex].templateKey = templateKey;
        this.workflowBuilder.steps[stepIndex].data = data;

        Utils.showToast('Step configured!', 'success');

        const stepDiv = document.querySelector(`[data-step-index="${stepIndex}"]`);
        if (stepDiv) {
            const timestamp = stepDiv.querySelector('.lpb-timestamp');
            if (timestamp) {
                timestamp.textContent = template.name + ' ✓';
                timestamp.style.color = '#4CAF50';
            }
        }
    });
    fieldsContainer.appendChild(saveBtn);

    formContainer.innerHTML = '';
    formContainer.appendChild(fieldsContainer);
}

saveWorkflow() {
    const name = document.getElementById('lpb-workflow-name')?.value.trim();

    if (!name) {
        Utils.showToast('Please enter a workflow name', 'error');
        return;
    }

    if (this.workflowBuilder.steps.length === 0) {
        Utils.showToast('Please add at least one step', 'error');
        return;
    }

    const unconfiguredSteps = this.workflowBuilder.steps.filter(step => !step || !step.data || !step.categoryKey || !step.templateKey);
    if (unconfiguredSteps.length > 0) {
        Utils.showToast('Please configure all steps before saving', 'error');
        return;
    }

    if (this.workflowBuilder.editingId) {
        const updated = this.workflowManager.update(this.workflowBuilder.editingId, name, this.workflowBuilder.steps);
        if (updated) {
            Utils.showToast('Workflow updated!', 'success');
        } else {
            Utils.showToast('Error updating workflow', 'error');
            return;
        }
    } else {
        this.workflowManager.create(name, this.workflowBuilder.steps);
        Utils.showToast('Workflow created!', 'success');
    }

    this.workflowBuilder.active = false;
    this.workflowBuilder.editingId = null;
    this.workflowBuilder.steps = [];

    this.showWorkflows();
}

showShareWorkflowModal(workflowId) {
    const workflow = this.workflowManager.getById(workflowId);
    if (!workflow) return;

    const shareData = {
        name: workflow.name,
        steps: workflow.steps,
        version: '9.0.4.3'
    };

    const shareCode = btoa(JSON.stringify(shareData));

    const modal = document.createElement('div');
    modal.className = 'lpb-edit-modal active';
    modal.innerHTML = `
        <div class="lpb-edit-modal-content">
            <h3>Share Workflow</h3>
            <p style="color: #888; font-size: 13px; margin-bottom: 16px;">Copy this code and share it with others:</p>
            <textarea class="lpb-textarea" id="lpb-share-code" readonly style="font-family: monospace; font-size: 12px; min-height: 120px;">${shareCode}</textarea>
            <div class="lpb-edit-actions">
                <button class="lpb-btn lpb-btn-secondary" id="lpb-share-close">Close</button>
                <button class="lpb-btn" id="lpb-share-copy">Copy to Clipboard</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    const textarea = modal.querySelector('#lpb-share-code');
    textarea.select();

    modal.querySelector('#lpb-share-close').addEventListener('click', () => {
        modal.remove();
    });

    modal.querySelector('#lpb-share-copy').addEventListener('click', () => {
        textarea.select();
        navigator.clipboard.writeText(shareCode);
        Utils.showToast('Workflow code copied to clipboard!', 'success');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

showImportWorkflowModal() {
    const modal = document.createElement('div');
    modal.className = 'lpb-edit-modal active';
    modal.innerHTML = `
        <div class="lpb-edit-modal-content">
            <h3>Import Workflow</h3>
            <p style="color: #888; font-size: 13px; margin-bottom: 16px;">Paste the workflow code below:</p>
            <textarea class="lpb-textarea" id="lpb-import-code" placeholder="Paste workflow code here..." style="font-family: monospace; font-size: 12px; min-height: 120px;"></textarea>
            <div id="lpb-import-error" style="display: none; color: #f44336; font-size: 13px; margin-top: 12px;"></div>
            <div class="lpb-edit-actions">
                <button class="lpb-btn lpb-btn-secondary" id="lpb-import-close">Cancel</button>
                <button class="lpb-btn" id="lpb-import-add">Import Workflow</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    const textarea = modal.querySelector('#lpb-import-code');
    const errorDiv = modal.querySelector('#lpb-import-error');

    modal.querySelector('#lpb-import-close').addEventListener('click', () => {
        modal.remove();
    });

    modal.querySelector('#lpb-import-add').addEventListener('click', () => {
        const code = textarea.value.trim();

        if (!code) {
            errorDiv.textContent = 'Please paste a workflow code';
            errorDiv.style.display = 'block';
            return;
        }

        try {
            const shareData = JSON.parse(atob(code));

            if (!shareData.name || !shareData.steps || !Array.isArray(shareData.steps)) {
                throw new Error('Invalid workflow format');
            }

            for (const step of shareData.steps) {
                if (!step.categoryKey || !step.templateKey || !step.data) {
                    throw new Error('Invalid step format');
                }

                if (!CATEGORIES[step.categoryKey] || !CATEGORIES[step.categoryKey].templates[step.templateKey]) {
                    throw new Error(`Template not found: ${step.categoryKey}/${step.templateKey}`);
                }
            }

            const existingNames = this.workflowManager.getAll().map(w => w.name.toLowerCase());
            let finalName = shareData.name;
            let counter = 1;

            while (existingNames.includes(finalName.toLowerCase())) {
                finalName = `${shareData.name} (${counter})`;
                counter++;
            }

            this.workflowManager.create(finalName, shareData.steps);

            modal.remove();
            Utils.showToast(`Workflow "${finalName}" imported successfully!`, 'success');
            this.showWorkflows();

        } catch (error) {
            console.error('Import error:', error);
            errorDiv.textContent = 'Invalid workflow code. Please check and try again.';
            errorDiv.style.display = 'block';
        }
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });

    textarea.focus();
}
        showCategories() {
            const content = document.getElementById('lpb-main-content');

            const html = Object.entries(CATEGORIES).map(([key, cat]) => `
                <div class="lpb-category-card" data-category="${key}">
                    <div class="lpb-category-name">${cat.name}</div>
                    <div class="lpb-category-desc">${cat.description}</div>
                </div>
            `).join('');

            content.innerHTML = `<div class="lpb-category-grid">${html}</div>`;

            content.querySelectorAll('.lpb-category-card').forEach(card => {
                card.addEventListener('click', () => {
                    this.showTemplates(card.dataset.category);
                });
            });
        }

        showTemplates(categoryKey) {
            const content = document.getElementById('lpb-main-content');
            const category = CATEGORIES[categoryKey];
            this.currentCategory = categoryKey;

            const html = Object.entries(category.templates).map(([key, template]) => {
                const usageCount = this.history.getUsageCount(categoryKey, key);
                return `
                    <div class="lpb-template-card" data-template="${key}">
                        ${usageCount > 0 ? `<div class="lpb-usage-badge">${usageCount} uses</div>` : ''}
                        <div class="lpb-template-name">${template.name}</div>
                    </div>
                `;
            }).join('');

            content.innerHTML = `
                <button class="lpb-back-btn" id="lpb-back-to-categories">← Back to Categories</button>
                <div class="lpb-template-grid">${html}</div>
            `;

            document.getElementById('lpb-back-to-categories').addEventListener('click', () => {
                this.currentCategory = null;
                this.showCategories();
            });

            content.querySelectorAll('.lpb-template-card').forEach(card => {
                card.addEventListener('click', () => {
                    this.openTemplate(categoryKey, card.dataset.template);
                });
            });
        }

openTemplate(categoryKey, templateKey) {
    const template = CATEGORIES[categoryKey].templates[templateKey];

    if (!template) {
        Utils.showToast('Template not found', 'error');
        console.error('[LPB] Template not found:', categoryKey, templateKey);
        return;
    }

    this.currentTemplate = {
        categoryKey,
        templateKey,
        name: template.name,
        fields: template.fields,
        generate: template.generate
    };

    this.currentData = {};
    this.validationErrors = [];

    document.getElementById('lpb-form-title').textContent = template.name;
    this.renderForm(template.fields);

    this.hideModal('main');
    this.showModal('form');
    this.updatePreview();
}

renderForm(fields) {
    const container = document.getElementById('lpb-form-content');
    container.innerHTML = '';

    fields.forEach(field => {
        const fieldEl = this.createField(field);
        container.appendChild(fieldEl);
    });

    const preview = document.createElement('div');
    preview.className = 'lpb-preview';
    preview.innerHTML = `
        <div class="lpb-preview-header">
            <div class="lpb-preview-title">Generated Prompt</div>
            <div class="lpb-preview-stats">
                <div class="lpb-char-count" id="lpb-char-count"></div>
                <button class="lpb-btn lpb-btn-small" id="lpb-copy-btn">Copy</button>
            </div>
        </div>
        <div class="lpb-preview-content" id="lpb-preview-text">Fill out the form to generate prompt...</div>
    `;
    container.appendChild(preview);

    const actions = document.createElement('div');
    actions.className = 'lpb-actions';
    actions.innerHTML = `
        <button class="lpb-btn lpb-btn-secondary" id="lpb-back-to-templates">Back</button>
        <button class="lpb-btn" id="lpb-insert-btn">Insert Prompt</button>
    `;
    container.appendChild(actions);

    container.querySelectorAll('input, select, textarea').forEach(input => {
        input.addEventListener('input', () => {
            this.updateConditionals();
            this.updatePreview();
        });
        input.addEventListener('change', () => {
            this.updateConditionals();
            this.updatePreview();
        });

        if (input.tagName === 'TEXTAREA' || (input.tagName === 'INPUT' && input.type === 'text')) {
            this.fileAutocomplete.attach(input);
        }
    });

    container.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(input => {
        input.addEventListener('change', () => {
            this.updateConditionals();
            this.updatePreview();
        });
    });

    document.getElementById('lpb-back-to-templates').addEventListener('click', () => {
        this.hideModal('form');
        this.showModal('main');
        this.showTemplates(this.currentTemplate.categoryKey);
    });

    document.getElementById('lpb-insert-btn').addEventListener('click', () => {
        this.insertPrompt();
    });

    document.getElementById('lpb-copy-btn').addEventListener('click', () => {
        const text = document.getElementById('lpb-preview-text').textContent;
        navigator.clipboard.writeText(text);
        Utils.showToast('Copied to clipboard', 'success');
    });

    setTimeout(() => {
        this.updateConditionals();
    }, 100);
}

createField(field) {
    const wrapper = document.createElement('div');
    wrapper.className = 'lpb-form-field';
    wrapper.dataset.fieldId = field.id;

    if (field.show_if) {
        console.log('[LPB] Creating field with conditional:', field.id, field.show_if);
        wrapper.dataset.showIf = field.show_if.field;
        wrapper.dataset.showValue = field.show_if.value;
        wrapper.classList.add('lpb-field-hidden');
    }

    const label = document.createElement('label');
    label.className = 'lpb-label';
    label.innerHTML = Utils.escapeHtml(field.label) + (field.required ? '<span class="lpb-required">*</span>' : '');
    wrapper.appendChild(label);

    let input;

    if (field.type === 'text' || field.type === 'number') {
        input = document.createElement('input');
        input.type = field.type;
        input.className = 'lpb-input';
        input.value = field.default || '';
        input.placeholder = field.placeholder || '';
        input.dataset.field = field.id;
        input.dataset.required = field.required || false;

        if (field.min !== undefined) input.min = field.min;
        if (field.max !== undefined) input.max = field.max;
        if (field.step !== undefined) input.step = field.step;
    } else if (field.type === 'textarea') {
        input = document.createElement('textarea');
        input.className = 'lpb-textarea';
        input.value = field.default || '';
        input.placeholder = field.placeholder || '';
        input.dataset.field = field.id;
        input.dataset.required = field.required || false;
    } else if (field.type === 'select') {
        input = document.createElement('select');
        input.className = 'lpb-select';
        input.dataset.field = field.id;
        input.dataset.required = field.required || false;
        field.options.forEach(opt => {
            const option = document.createElement('option');
            option.value = opt;
            option.textContent = opt;
            if (opt === field.default) option.selected = true;
            input.appendChild(option);
        });
    } else if (field.type === 'radio') {
        input = document.createElement('div');
        input.className = 'lpb-radio-group';
        input.dataset.field = field.id;
        input.dataset.required = field.required || false;
        field.options.forEach((opt, i) => {
            const item = document.createElement('div');
            item.className = 'lpb-radio-item';

            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = field.id;
            radio.value = opt;
            radio.id = `${field.id}_${i}`;
            if (opt === field.default) radio.checked = true;

            const lbl = document.createElement('label');
            lbl.htmlFor = radio.id;
            lbl.textContent = opt;

            item.appendChild(radio);
            item.appendChild(lbl);
            input.appendChild(item);
        });
    } else if (field.type === 'checkbox' || field.type === 'checkboxes') {
        input = document.createElement('div');
        input.className = 'lpb-checkbox-group';
        input.dataset.field = field.id;
        input.dataset.required = field.required || false;
        field.options.forEach((opt, i) => {
            const item = document.createElement('div');
            item.className = 'lpb-checkbox-item';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = opt;
            checkbox.id = `${field.id}_${i}`;
            checkbox.dataset.parent = field.id;

            const lbl = document.createElement('label');
            lbl.htmlFor = checkbox.id;
            lbl.textContent = opt;

            item.appendChild(checkbox);
            item.appendChild(lbl);
            input.appendChild(item);
        });
} else if (field.type === 'list') {
    input = this.createListField(field.id, field.placeholder);
    input.dataset.required = field.required || false;
} else if (field.type === 'range') {
        input = document.createElement('input');
        input.type = 'range';
        input.className = 'lpb-input';
        input.value = field.default || field.min || 0;
        input.dataset.field = field.id;
        input.dataset.required = field.required || false;

        if (field.min !== undefined) input.min = field.min;
        if (field.max !== undefined) input.max = field.max;
        if (field.step !== undefined) input.step = field.step;

        const valueDisplay = document.createElement('span');
        valueDisplay.style.cssText = 'margin-left: 10px; color: #2196F3; font-weight: 600;';
        valueDisplay.textContent = input.value;
        input.addEventListener('input', () => {
            valueDisplay.textContent = input.value;
        });
        wrapper.appendChild(input);
        wrapper.appendChild(valueDisplay);
    }

    if (field.type !== 'range') {
        wrapper.appendChild(input);
    }

    if (field.helpText || field.help) {
        const help = document.createElement('div');
        help.className = 'lpb-help-text';
        help.textContent = field.helpText || field.help;
        wrapper.appendChild(help);
    }

    return wrapper;
}
        createListField(fieldId, placeholder, existingValues = []) {
    const wrapper = document.createElement('div');
    wrapper.className = 'lpb-list-wrapper';
    wrapper.dataset.field = fieldId;

    const addRow = (value = '') => {
        const row = document.createElement('div');
        row.className = 'lpb-list-row';

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'lpb-list-input';
        input.placeholder = placeholder || '';
        input.value = value;
        input.addEventListener('input', () => this.updatePreview());
        this.fileAutocomplete.attach(input);

        const removeBtn = document.createElement('button');
        removeBtn.className = 'lpb-list-remove';
        removeBtn.textContent = 'Remove';
        removeBtn.onclick = () => {
            row.remove();
            this.updatePreview();
        };

        row.appendChild(input);
        row.appendChild(removeBtn);
        wrapper.insertBefore(row, addBtn);
    };

    const addBtn = document.createElement('button');
addBtn.className = 'lpb-list-add';
addBtn.textContent = 'Add Item';
addBtn.onclick = () => addRow();

    wrapper.appendChild(addBtn);

    if (existingValues && Array.isArray(existingValues) && existingValues.length > 0) {
        existingValues.forEach(val => addRow(val));
    } else {
        addRow();
    }

    return wrapper;
}

updateConditionals(root = document) {
    const scope = root || document;

    const normalize = (v) => {
  if (v === undefined || v === null) return '';
  const s = String(v).trim().toLowerCase().replace(/\s+/g, '');

  if (['yes', 'y', 'true', '1', 'on'].includes(s)) return 'yes';
  if (['no', 'n', 'false', '0', 'off'].includes(s)) return 'no';

  return s;
};

const getControlValue = (control) => {
  if (!control) return { kind: 'empty', value: '' };

  if (control.dataset && control.dataset.fieldId && !control.dataset.field) {
    control =
      control.querySelector('[data-field]') ||
      control.querySelector('.lpb-radio-group, .lpb-checkbox-group, .lpb-list-wrapper, select, input, textarea') ||
      control;
  }

  if (control.tagName === 'SELECT' || control.tagName === 'INPUT' || control.tagName === 'TEXTAREA') {
    return { kind: 'scalar', value: control.value };
  }

  if (control.classList.contains('lpb-radio-group')) {
    const checked = control.querySelector('input:checked');
    return { kind: 'scalar', value: checked ? checked.value : '' };
  }

  if (control.classList.contains('lpb-checkbox-group')) {
    const checked = Array.from(control.querySelectorAll('input:checked')).map(c => c.value);
    return { kind: 'list', value: checked };
  }

  if (control.classList.contains('lpb-list-wrapper')) {
    const items = Array.from(control.querySelectorAll('.lpb-list-input'))
      .map(i => i.value.trim())
      .filter(v => v);
    return { kind: 'list', value: items };
  }

  return { kind: 'scalar', value: control.value || '' };
};

    const conditionalFields = Array.from(scope.querySelectorAll('[data-show-if]'));

    conditionalFields.forEach(fieldWrapper => {
        const targetField = fieldWrapper.dataset.showIf;
        const targetValueRaw = fieldWrapper.dataset.showValue;

        const control = scope.querySelector(`[data-field="${targetField}"], [data-field-id="${targetField}"]`) ||
                        document.querySelector(`[data-field="${targetField}"], [data-field-id="${targetField}"]`);

        if (!control) {
            console.warn('[LPB] Control field not found for conditional:', targetField);
            fieldWrapper.classList.add('lpb-field-hidden');
            return;
        }

        const { kind, value } = getControlValue(control);

        const targetNorm = normalize(targetValueRaw);

        let conditionMet = false;

        if (kind === 'list') {
            const list = Array.isArray(value) ? value : String(value).split(',');
            conditionMet = list.map(normalize).includes(targetNorm);
        } else {
            conditionMet = normalize(value) === targetNorm;
        }

        if (conditionMet) {
            fieldWrapper.classList.remove('lpb-field-hidden');
        } else {
            fieldWrapper.classList.add('lpb-field-hidden');

            const hiddenInput = fieldWrapper.querySelector('[data-field], [data-field-id]');
            if (hiddenInput) {
if (hiddenInput.tagName === 'INPUT' || hiddenInput.tagName === 'TEXTAREA' || hiddenInput.tagName === 'SELECT') {
    hiddenInput.value = '';
} else if (hiddenInput.classList.contains('lpb-radio-group')) {
    hiddenInput.querySelectorAll('input').forEach(r => { r.checked = false; });
} else if (hiddenInput.classList.contains('lpb-checkbox-group')) {
    hiddenInput.querySelectorAll('input').forEach(c => { c.checked = false; });
} else if (hiddenInput.classList.contains('lpb-list-wrapper')) {
    hiddenInput.querySelectorAll('.lpb-list-input').forEach(i => { i.value = ''; });
}
            }
        }
    });
}
collectData() {
    const data = {};

    document.querySelectorAll('[data-field]').forEach(field => {
        const fieldId = field.dataset.field;

        const wrapper = field.closest('[data-field-id]');
        if (wrapper && wrapper.classList.contains('lpb-field-hidden')) {
            return;
        }

        if (field.tagName === 'INPUT' || field.tagName === 'TEXTAREA' || field.tagName === 'SELECT') {
            data[fieldId] = field.value;
        } else if (field.classList.contains('lpb-radio-group')) {
            const checked = field.querySelector('input:checked');
            data[fieldId] = checked ? checked.value : '';
        } else if (field.classList.contains('lpb-checkbox-group')) {
            const checked = Array.from(field.querySelectorAll('input:checked'));
            data[fieldId] = checked.map(c => c.value);
        } else if (field.classList.contains('lpb-list-wrapper')) {
            const items = Array.from(field.querySelectorAll('.lpb-list-input'))
                .map(i => i.value.trim())
                .filter(v => v);
            data[fieldId] = items;
        }
    });

    return data;
}

validateForm(fields) {
    const data = this.collectData();
    const errors = [];

    document.querySelectorAll('.lpb-input, .lpb-select, .lpb-textarea').forEach(el => {
        el.classList.remove('lpb-error');
    });

    fields.forEach(field => {
        const fieldEl = document.querySelector(`[data-field-id="${field.id}"]`);

        if (fieldEl && fieldEl.classList.contains('lpb-field-hidden')) {
            return;
        }

        if (field.required) {
            const value = data[field.id];
            let isEmpty = false;

            if (Array.isArray(value)) {
                isEmpty = value.length === 0;
            } else if (typeof value === 'string') {
                isEmpty = value.trim() === '';
            } else {
                isEmpty = !value;
            }

            if (isEmpty) {
                errors.push(field.label);
                const input = document.querySelector(`[data-field="${field.id}"]`);
                if (input) input.classList.add('lpb-error');
            }
        }
    });

    if (errors.length > 0) {
        Utils.showToast(`Please fill required fields: ${errors.join(', ')}`, 'error', 5000);
        return false;
    }
    return true;
}

updatePreview() {
    clearTimeout(this.previewDebounceTimer);
    this.previewDebounceTimer = setTimeout(() => {
        this.currentData = this.collectData();

        try {
            const prompt = this.currentTemplate.generate(this.currentData);
            const previewEl = document.getElementById('lpb-preview-text');

            if (previewEl) {
                previewEl.textContent = prompt;

                const charCount = prompt.length;
                const wordCount = prompt.split(/\s+/).filter(Boolean).length;
                const countEl = document.getElementById('lpb-char-count');
                if (countEl) {
                    countEl.textContent = `${charCount} chars • ${wordCount} words`;
                }
            }
        } catch (error) {
            console.error('[LPB] Error generating preview:', error);
            const previewEl = document.getElementById('lpb-preview-text');
            if (previewEl) {
                previewEl.textContent = 'Error generating prompt. Check your template function.';
            }
        }
    }, CONFIG.PREVIEW_DEBOUNCE);
}

        insertPrompt() {
            if (!this.validateForm(this.currentTemplate.fields)) {
                return;
            }

            const prompt = document.getElementById('lpb-preview-text').textContent;
            this.history.add(
                prompt,
                this.currentTemplate.categoryKey,
                this.currentTemplate.name,
                this.currentData
            );
            this.insertPromptText(prompt);
        }

        async insertPromptText(prompt) {
            const input = this.findInput();

            if (!input) {
                Utils.showToast('Could not find input field', 'error');
                navigator.clipboard.writeText(prompt);
                Utils.showToast('Copied to clipboard instead', 'info');
                return;
            }

            try {
                const fileReferences = prompt.match(/@[\w\-\.]+/g);
                const hasFileRefs = fileReferences && fileReferences.length > 0;

                if (hasFileRefs) {
                    Utils.showToast(`Inserting prompt with ${fileReferences.length} file reference(s)...`, 'info', 2000);
                    await this.insertPromptWithFileRefs(input, prompt, fileReferences);
                } else {
                    await this.insertPromptNormally(input, prompt);
                }

            } catch (error) {
                console.error('Failed to insert prompt:', error);
                Utils.showToast('Failed to insert. Copied to clipboard.', 'error');
                navigator.clipboard.writeText(prompt);
            }
        }

        async insertPromptNormally(input, prompt) {
            input.click();
            input.focus();

            await new Promise(resolve => setTimeout(resolve, 100));

            try {
                const nativeTextareaSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
                const nativeInputSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;

                if (input.tagName === 'TEXTAREA' && nativeTextareaSetter) {
                    nativeTextareaSetter.call(input, prompt);
                } else if (input.tagName === 'INPUT' && nativeInputSetter) {
                    nativeInputSetter.call(input, prompt);
                } else {
                    input.value = prompt;
                }

                const events = ['input', 'change', 'keyup', 'keydown', 'keypress'];
                events.forEach(eventType => {
                    const event = new Event(eventType, { bubbles: true, cancelable: true });
                    input.dispatchEvent(event);
                });

                const inputEvent = new InputEvent('input', {
                    bubbles: true,
                    cancelable: true,
                    data: prompt
                });
                input.dispatchEvent(inputEvent);

                setTimeout(() => {
    if (input.setSelectionRange) {
        input.setSelectionRange(prompt.length, prompt.length);
    }
    input.focus();

    const autoSubmitEnabled = this.settings.get('autoSubmit');
    if (autoSubmitEnabled === true) {
        const delay = this.settings.get('autoSubmitDelay') || CONFIG.AUTO_SUBMIT_DEFAULT_DELAY;
        setTimeout(() => {
            this.autoSubmitPrompt();
        }, delay);
    }
}, 50);

                this.hideModal('form');
                this.hideModal('main');
                Utils.showToast('Prompt inserted successfully', 'success');
            } catch (e) {
                console.error('Insert error:', e);
                Utils.showToast('Error inserting prompt - copying to clipboard', 'error');
                navigator.clipboard.writeText(prompt);
            }
        }

        async insertPromptWithFileRefs(input, prompt, fileReferences) {
            this.hideModal('form');
            this.hideModal('main');

            input.click();
            input.focus();

            await new Promise(resolve => setTimeout(resolve, 1000));

            const parts = [];
            let lastIndex = 0;
            const atRegex = /@[\w\-\.]+/g;
            let match;

            while ((match = atRegex.exec(prompt)) !== null) {
                if (match.index > lastIndex) {
                    parts.push({
                        type: 'text',
                        content: prompt.substring(lastIndex, match.index)
                    });
                }
                parts.push({
                    type: 'file',
                    content: match[0]
                });
                lastIndex = match.index + match[0].length;
            }
            if (lastIndex < prompt.length) {
                parts.push({
                    type: 'text',
                    content: prompt.substring(lastIndex)
                });
            }

            try {
                const nativeSetter = Object.getOwnPropertyDescriptor(
                    window.HTMLTextAreaElement.prototype,
                    'value'
                ).set;

                for (let i = 0; i < parts.length; i++) {
                    const part = parts[i];

                    if (part.type === 'text') {
                        const currentValue = input.value;
                        nativeSetter.call(input, currentValue + part.content);
                        input.dispatchEvent(new Event('input', { bubbles: true }));
                        await new Promise(resolve => setTimeout(resolve, 200));
                    } else if (part.type === 'file') {
                        const fileName = part.content;

                        for (let char of fileName) {
                            const currentValue = input.value;
                            nativeSetter.call(input, currentValue + char);

                            input.dispatchEvent(new KeyboardEvent('keydown', {
                                key: char,
                                code: char === '@' ? 'Digit2' : `Key${char.toUpperCase()}`,
                                keyCode: char.charCodeAt(0),
                                bubbles: true,
                                cancelable: true,
                                composed: true
                            }));

                            input.dispatchEvent(new InputEvent('input', {
                                data: char,
                                inputType: 'insertText',
                                bubbles: true,
                                cancelable: false,
                                composed: true
                            }));

                            input.dispatchEvent(new KeyboardEvent('keyup', {
                                key: char,
                                code: char === '@' ? 'Digit2' : `Key${char.toUpperCase()}`,
                                keyCode: char.charCodeAt(0),
                                bubbles: true,
                                cancelable: true,
                                composed: true
                            }));

                            if (char === '@') {
                                await new Promise(resolve => setTimeout(resolve, 1500));
                            } else {
                                await new Promise(resolve => setTimeout(resolve, 80));
                            }
                        }

                        let dropdownFound = false;
                        let attempts = 0;
                        const maxAttempts = 40;

                        while (!dropdownFound && attempts < maxAttempts) {
                            await new Promise(resolve => setTimeout(resolve, 200));

                            const dropdown = document.querySelector('div.absolute.z-50') ||
                                           document.querySelector('[role="listbox"]') ||
                                           document.querySelector('div.shadow-lg');

                            if (dropdown && dropdown.offsetParent !== null) {
                                dropdownFound = true;
                                console.log('[LPB] Dropdown found! Waiting 3 seconds for files to load...');
                                await new Promise(resolve => setTimeout(resolve, 3000));
                            }

                            attempts++;
                        }

                        if (dropdownFound) {
                            input.focus();
                            input.click();
                            await new Promise(resolve => setTimeout(resolve, 500));

                            console.log('[LPB] Pressing Enter now...');

                            const enterDown = new KeyboardEvent('keydown', {
                                key: 'Enter',
                                code: 'Enter',
                                keyCode: 13,
                                which: 13,
                                bubbles: true,
                                cancelable: true,
                                composed: true
                            });

                            const enterUp = new KeyboardEvent('keyup', {
                                key: 'Enter',
                                code: 'Enter',
                                keyCode: 13,
                                which: 13,
                                bubbles: true,
                                cancelable: true,
                                composed: true
                            });

                            input.dispatchEvent(enterDown);
                            await new Promise(resolve => setTimeout(resolve, 200));
                            input.dispatchEvent(enterUp);

                            await new Promise(resolve => setTimeout(resolve, 1200));
                        } else {
                            console.warn('[LPB] Dropdown not found for', fileName);
                            Utils.showToast(`Could not attach ${fileName} - dropdown not found`, 'error', 3000);
                        }

                        const currentValue = input.value;
                        nativeSetter.call(input, currentValue + ' ');
                        input.dispatchEvent(new Event('input', { bubbles: true }));
                        await new Promise(resolve => setTimeout(resolve, 300));
                    }
                }

                input.dispatchEvent(new Event('change', { bubbles: true }));

                setTimeout(() => {
                    if (input.setSelectionRange) {
                        input.setSelectionRange(input.value.length, input.value.length);
                    }
                    input.focus();
                }, 300);

                Utils.showToast(`Prompt inserted with ${fileReferences.length} file(s)!`, 'success');

            } catch (e) {
                console.error('Insert with file refs error:', e);
                Utils.showToast('Error inserting prompt - copying to clipboard', 'error');
                navigator.clipboard.writeText(prompt);
            }
        }

        autoSubmitPrompt() {
            const submitBtn = this.findSubmitButton();
            if (submitBtn) {
                submitBtn.click();
                Utils.showToast('Prompt auto-submitted!', 'success');
            } else {
                Utils.log('Submit button not found');
            }
        }

        findSubmitButton() {
            const selectors = [
                'button[type="submit"]',
                'button[class*="send" i]',
                'button[class*="submit" i]',
                'button[aria-label*="send" i]',
                'button:has(svg[class*="send"])'
            ];

            for (const selector of selectors) {
                const btn = document.querySelector(selector);
                if (btn && btn.offsetParent !== null) {
                    return btn;
                }
            }

            const buttons = Array.from(document.querySelectorAll('button'));
            return buttons.find(btn =>
                btn.textContent.toLowerCase().includes('send') ||
                btn.textContent.toLowerCase().includes('submit') ||
                btn.innerHTML.includes('send')
            );
        }

        findInput() {
            const selectors = [
                'textarea[placeholder*="prompt" i]',
                'textarea[placeholder*="message" i]',
                'textarea[placeholder*="type" i]',
                'textarea',
                'input[type="text"]',
                '[contenteditable="true"]'
            ];

            for (const selector of selectors) {
                const element = document.querySelector(selector);
                if (element && element.offsetParent !== null) {
                    return element;
                }
            }

            return null;
        }

        showHistory() {
            const content = document.getElementById('lpb-main-content');

            const searchHTML = `
                <div class="lpb-search-wrapper">
                    <input type="text" id="lpb-history-search" class="lpb-input lpb-search-input"
                           placeholder="Search history..." />
                </div>
                <div id="lpb-history-results"></div>
            `;

            content.innerHTML = searchHTML;

            const renderResults = (items) => {
                const resultsDiv = document.getElementById('lpb-history-results');
                if (!resultsDiv) return;

                if (items.length === 0) {
                    resultsDiv.innerHTML = '<div class="lpb-empty">No items found</div>';
                    return;
                }

                this.renderHistoryItems(resultsDiv, items);
            };

            renderResults(this.history.getAll());

            document.getElementById('lpb-history-search')?.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase();
                const filtered = this.history.getAll().filter(item =>
                    item.prompt.toLowerCase().includes(query) ||
                    item.template.toLowerCase().includes(query) ||
                    item.category.toLowerCase().includes(query) ||
                    (item.customName && item.customName.toLowerCase().includes(query))
                );
                renderResults(filtered);
            });
        }

        showFavorites() {
            const content = document.getElementById('lpb-main-content');
            const items = this.history.getFavorites();

            if (items.length === 0) {
                content.innerHTML = '<div class="lpb-empty">No favorites yet</div>';
                return;
            }

            const container = document.createElement('div');
            this.renderHistoryItems(container, items);
            content.innerHTML = '';
            content.appendChild(container);
        }

        renderHistoryItems(container, items) {
    const html = items.map(item => {
        const isFav = this.history.isFavorite(item.id);
        const date = new Date(item.timestamp).toLocaleString();
        const displayName = item.customName || item.template;
        const truncatedPrompt = item.prompt.substring(0, 100);
        const needsTruncation = item.prompt.length > 100;

        return `
            <div class="lpb-history-item">
                <div class="lpb-history-top">
                    <div class="lpb-history-info">
                        ${item.customName
                            ? `<span class="lpb-custom-name">${Utils.escapeHtml(item.customName)}</span>`
                            : `<span class="lpb-badge">${Utils.escapeHtml(item.template)}</span>`
                        }
                        <span class="lpb-timestamp">${date}</span>
                    </div>
                    <button class="lpb-fav-btn" data-id="${item.id}" data-action="fav">${isFav ? '★' : '☆'}</button>
                </div>
                <div class="lpb-history-preview" data-id="${item.id}" data-action="expand">
                    <div class="lpb-history-preview-text truncated" data-full="${Utils.escapeHtml(item.prompt)}">
                        ${Utils.escapeHtml(truncatedPrompt)}${needsTruncation ? '...' : ''}
                    </div>
                    ${needsTruncation ? '<span class="lpb-expand-icon">▼</span>' : ''}
                </div>
                <div class="lpb-history-actions">
                    <button class="lpb-btn lpb-btn-small" data-id="${item.id}" data-action="use">Use</button>
                    <button class="lpb-btn lpb-btn-small lpb-btn-secondary" data-id="${item.id}" data-action="edit">Rename</button>
                    <button class="lpb-btn lpb-btn-small lpb-btn-secondary" data-id="${item.id}" data-action="copy">Copy</button>
                    <button class="lpb-btn lpb-btn-small lpb-btn-secondary" data-id="${item.id}" data-action="delete">Delete</button>
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = html;

    container.querySelectorAll('.lpb-history-preview').forEach(preview => {
        preview.addEventListener('click', (e) => {
            const textEl = preview.querySelector('.lpb-history-preview-text');
            const iconEl = preview.querySelector('.lpb-expand-icon');

            if (!textEl || !iconEl) return;

            const isExpanded = textEl.classList.contains('expanded');

            if (isExpanded) {
                const truncated = textEl.dataset.full.substring(0, 100);
                textEl.textContent = truncated + '...';
                textEl.classList.remove('expanded');
                textEl.classList.add('truncated');
                iconEl.textContent = '▼';
            } else {
                textEl.textContent = textEl.dataset.full;
                textEl.classList.remove('truncated');
                textEl.classList.add('expanded');
                iconEl.textContent = '▲';
            }
        });
    });

    container.querySelectorAll('[data-action]:not([data-action="expand"])').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = e.target.dataset.id;
            const action = e.target.dataset.action;
            this.handleHistoryAction(id, action);
        });
    });
}

        handleHistoryAction(id, action) {
            const item = this.history.items.find(i => i.id === id);
            if (!item) return;

            if (action === 'use') {
                this.insertPromptText(item.prompt);
            } else if (action === 'copy') {
                navigator.clipboard.writeText(item.prompt);
                Utils.showToast('Copied to clipboard', 'success');
            } else if (action === 'delete') {
                if (confirm('Delete this prompt from history?')) {
                    this.history.remove(id);
                    const activeTab = document.querySelector('.lpb-tab.active').dataset.tab;
                    if (activeTab === 'history') this.showHistory();
                    else if (activeTab === 'favorites') this.showFavorites();
                    Utils.showToast('Prompt deleted', 'info');
                }
            } else if (action === 'fav') {
                this.history.toggleFavorite(id);
                const activeTab = document.querySelector('.lpb-tab.active').dataset.tab;
                if (activeTab === 'history') this.showHistory();
                else if (activeTab === 'favorites') this.showFavorites();
            } else if (action === 'edit') {
                this.showEditModal(id, item.customName || item.template);
            }
        }

        showEditModal(id, currentName) {
            const modal = document.getElementById('lpb-edit-modal');
            const input = document.getElementById('lpb-edit-name-input');

            input.value = currentName;
            modal.classList.add('active');
            input.focus();
            input.select();

            const saveBtn = document.getElementById('lpb-edit-save');
            const newSaveBtn = saveBtn.cloneNode(true);
            saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn);

            newSaveBtn.addEventListener('click', () => {
                const newName = input.value.trim();
                if (newName) {
                    this.history.rename(id, newName);
                    modal.classList.remove('active');

                    const activeTab = document.querySelector('.lpb-tab.active').dataset.tab;
                    if (activeTab === 'history') this.showHistory();
                    else if (activeTab === 'favorites') this.showFavorites();

                    Utils.showToast('Prompt renamed', 'success');
                }
            });

            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    newSaveBtn.click();
                }
            });
        }
    }

    Utils.log('Initializing Lemonade Prompt Builder v9.0.4.3');
    new UI();
    Utils.log('Prompt Builder ready! Press Ctrl+Shift+P to open, type @ to mention files');
})();