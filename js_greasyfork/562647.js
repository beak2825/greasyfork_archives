// ==UserScript==
// @name         Torn Faction Armory Log Parser
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Parse Torn faction armory logs with color coding
// @author       Nova
// @match        https://www.torn.com/*
// @match        https://torn.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/562647/Torn%20Faction%20Armory%20Log%20Parser.user.js
// @updateURL https://update.greasyfork.org/scripts/562647/Torn%20Faction%20Armory%20Log%20Parser.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Parse the log data
    const rawData = `YOUR FACTION IS NOT IN A WAR RANK: SILVERRESPECT: 348,209No active chain0.00000:0000000000Main NewsAttackingFundsArmoryCrimesMembershipSpiderballz deposited 80 x Box of Chocolate Bars14:03:1114/01/26Hallout2010 deposited 205 x Bottle of Beer13:48:1314/01/26100ArcticMonkey used one of the faction's Blood Bag : B+ items13:40:0114/01/26100ArcticMonkey filled one of the faction's Empty Blood Bag items13:39:5914/01/26100ArcticMonkey filled one of the faction's Empty Blood Bag items13:39:5814/01/26100ArcticMonkey filled one of the faction's Empty Blood Bag items13:39:5714/01/26100ArcticMonkey used one of the faction's Lollipop items13:36:1214/01/26100ArcticMonkey used one of the faction's Lollipop items13:36:1114/01/26100ArcticMonkey used one of the faction's Lollipop items13:36:1014/01/26100ArcticMonkey used one of the faction's Lollipop items13:36:0914/01/26100ArcticMonkey used one of the faction's Lollipop items13:36:0914/01/26100ArcticMonkey used one of the faction's Lollipop items13:36:0814/01/26100ArcticMonkey used one of the faction's Lollipop items13:36:0714/01/26100ArcticMonkey used one of the faction's Lollipop items13:36:0614/01/26100ArcticMonkey used one of the faction's Lollipop items13:36:0514/01/26100ArcticMonkey used one of the faction's Lollipop items13:36:0514/01/26100ArcticMonkey used one of the faction's Lollipop items13:36:0414/01/26100ArcticMonkey used one of the faction's Lollipop items13:36:0314/01/26100ArcticMonkey used one of the faction's Lollipop items13:36:0214/01/26100ArcticMonkey used one of the faction's Lollipop items13:36:0214/01/26100ArcticMonkey used one of the faction's Lollipop items13:36:0114/01/26100ArcticMonkey used one of the faction's Lollipop items13:36:0114/01/26100ArcticMonkey used one of the faction's Lollipop items13:36:0014/01/26100ArcticMonkey used one of the faction's Lollipop items13:35:5914/01/26100ArcticMonkey used one of the faction's Lollipop items13:35:5914/01/26`;

    function parseLogs(data) {
        // Split the data into lines (approximate)
        const lines = [];
        let currentLine = '';
        
        // Pattern matching for log entries
        const patterns = [
            // Pattern 1: Username deposited XX x Item Name HH:MM:SS DD/MM/YY
            /([A-Za-z0-9_]+) deposited (\d+) x (.+?)(\d{1,2}:\d{2}:\d{2})(\d{2}\/\d{2}\/\d{2})/g,
            
            // Pattern 2: Username used one of the faction's Item Name items HH:MM:SS DD/MM/YY
            /([A-Za-z0-9_]+) used one of the faction['"]?s (.+?) items?(\d{1,2}:\d{2}:\d{2})(\d{2}\/\d{2}\/\d{2})/g,
            
            // Pattern 3: Username filled one of the faction's Item Name items HH:MM:SS DD/MM/YY
            /([A-Za-z0-9_]+) filled one of the faction['"]?s (.+?) items?(\d{1,2}:\d{2}:\d{2})(\d{2}\/\d{2}\/\d{2})/g,
        ];
        
        const logs = [];
        
        patterns.forEach(pattern => {
            let match;
            while ((match = pattern.exec(data)) !== null) {
                const username = match[1];
                let item = '';
                let quantity = '';
                let action = '';
                
                if (match[0].includes('deposited')) {
                    action = 'deposited';
                    quantity = match[2];
                    item = match[3].trim();
                } else if (match[0].includes('used')) {
                    action = 'used';
                    item = match[2].trim();
                } else if (match[0].includes('filled')) {
                    action = 'filled';
                    item = match[2].trim();
                }
                
                const time = match[match.length - 2];
                const date = match[match.length - 1];
                
                logs.push({
                    username,
                    item,
                    quantity,
                    action,
                    time,
                    date,
                    raw: match[0]
                });
            }
        });
        
        return logs;
    }

    function createDisplay() {
        const logs = parseLogs(rawData);
        
        // Create container
        const container = document.createElement('div');
        container.style.cssText = `
            position: fixed;
            top: 50px;
            right: 10px;
            width: 500px;
            max-height: 80vh;
            background: #1a1a1a;
            color: #fff;
            font-family: Arial, sans-serif;
            font-size: 12px;
            border: 2px solid #333;
            border-radius: 8px;
            z-index: 9999;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0,0,0,0.7);
        `;
        
        // Header
        const header = document.createElement('div');
        header.style.cssText = `
            background: #2a2a2a;
            padding: 10px 15px;
            font-weight: bold;
            font-size: 14px;
            border-bottom: 1px solid #444;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;
        header.innerHTML = `
            <span>📊 Torn Faction Armory Logs</span>
            <span style="color: #888; font-size: 11px;">${logs.length} entries</span>
        `;
        
        // Summary stats
        const stats = document.createElement('div');
        stats.style.cssText = `
            background: #222;
            padding: 8px 15px;
            font-size: 11px;
            border-bottom: 1px solid #333;
            display: flex;
            gap: 15px;
        `;
        
        const deposits = logs.filter(l => l.action === 'deposited').length;
        const uses = logs.filter(l => l.action === 'used').length;
        const fills = logs.filter(l => l.action === 'filled').length;
        
        stats.innerHTML = `
            <span style="color: #4CAF50;">📥 ${deposits} deposits</span>
            <span style="color: #F44336;">📤 ${uses} uses</span>
            <span style="color: #FF9800;">🔄 ${fills} fills</span>
        `;
        
        // Content
        const content = document.createElement('div');
        content.style.cssText = `
            padding: 10px;
            max-height: 400px;
            overflow-y: auto;
        `;
        
        // Create table
        const table = document.createElement('table');
        table.style.cssText = `
            width: 100%;
            border-collapse: collapse;
            font-size: 11px;
        `;
        
        // Table header
        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr style="background: #333;">
                <th style="padding: 8px; text-align: left; border-bottom: 1px solid #444;">Time</th>
                <th style="padding: 8px; text-align: left; border-bottom: 1px solid #444;">User</th>
                <th style="padding: 8px; text-align: left; border-bottom: 1px solid #444;">Action</th>
                <th style="padding: 8px; text-align: left; border-bottom: 1px solid #444;">Item</th>
                <th style="padding: 8px; text-align: left; border-bottom: 1px solid #444;">Qty</th>
            </tr>
        `;
        
        // Table body
        const tbody = document.createElement('tbody');
        
        logs.forEach(log => {
            const row = document.createElement('tr');
            row.style.cssText = `
                border-bottom: 1px solid #2a2a2a;
            `;
            
            // Determine color based on action
            let actionColor = '#888';
            let actionText = log.action;
            
            if (log.action === 'deposited') {
                actionColor = '#4CAF50'; // Green
                actionText = '📥 ' + actionText;
            } else if (log.action === 'used') {
                actionColor = '#F44336'; // Red
                actionText = '📤 ' + actionText;
            } else if (log.action === 'filled') {
                actionColor = '#FF9800'; // Orange
                actionText = '🔄 ' + actionText;
            }
            
            // Format item name
            let itemName = log.item;
            if (itemName.includes('items')) {
                itemName = itemName.replace('items', '').trim();
            }
            
            row.innerHTML = `
                <td style="padding: 8px; color: #aaa;">${log.time} ${log.date}</td>
                <td style="padding: 8px; font-weight: bold; color: #fff;">${log.username}</td>
                <td style="padding: 8px; color: ${actionColor}; font-weight: bold;">${actionText}</td>
                <td style="padding: 8px; color: #ddd;">${itemName}</td>
                <td style="padding: 8px; color: #aaa; text-align: center;">${log.quantity || '-'}</td>
            `;
            
            tbody.appendChild(row);
        });
        
        table.appendChild(thead);
        table.appendChild(tbody);
        content.appendChild(table);
        
        // Footer with actions
        const footer = document.createElement('div');
        footer.style.cssText = `
            background: #2a2a2a;
            padding: 10px 15px;
            border-top: 1px solid #444;
            display: flex;
            gap: 10px;
        `;
        
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Close';
        closeBtn.style.cssText = `
            background: #444;
            color: #fff;
            border: none;
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 11px;
        `;
        closeBtn.onclick = () => container.remove();
        
        const exportBtn = document.createElement('button');
        exportBtn.textContent = 'Export JSON';
        exportBtn.style.cssText = `
            background: #4CAF50;
            color: #fff;
            border: none;
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 11px;
        `;
        exportBtn.onclick = () => {
            console.log('Parsed Logs:', logs);
            navigator.clipboard.writeText(JSON.stringify(logs, null, 2));
            alert('Logs copied to clipboard and console!');
        };
        
        footer.appendChild(exportBtn);
        footer.appendChild(closeBtn);
        
        // Assemble container
        container.appendChild(header);
        container.appendChild(stats);
        container.appendChild(content);
        container.appendChild(footer);
        
        document.body.appendChild(container);
        
        return container;
    }

    // Create toggle button
    const toggleBtn = document.createElement('button');
    toggleBtn.textContent = '📊 Logs';
    toggleBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #0066cc;
        color: white;
        border: none;
        padding: 10px 15px;
        border-radius: 20px;
        cursor: pointer;
        z-index: 9998;
        font-size: 12px;
        font-weight: bold;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        transition: all 0.2s;
    `;
    
    toggleBtn.onmouseenter = () => {
        toggleBtn.style.background = '#0088ff';
        toggleBtn.style.transform = 'scale(1.05)';
    };
    
    toggleBtn.onmouseleave = () => {
        toggleBtn.style.background = '#0066cc';
        toggleBtn.style.transform = 'scale(1)';
    };
    
    let display = null;
    toggleBtn.onclick = () => {
        if (display && document.body.contains(display)) {
            display.remove();
            display = null;
        } else {
            display = createDisplay();
        }
    };
    
    document.body.appendChild(toggleBtn);

    // Also log to console
    console.log('=== Parsed Torn Armory Logs ===');
    const parsedLogs = parseLogs(rawData);
    console.table(parsedLogs.map(log => ({
        Time: `${log.time} ${log.date}`,
        User: log.username,
        Action: log.action,
        Item: log.item,
        Quantity: log.quantity || '-'
    })));

})();