// ==UserScript==
// @name         Torn Company Employee Stat Comparator (Sweet Shop)
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Compares employee work stats to their current position requirements for a Sweet Shop on Torn City.
// @author       Gemini
// @match        https://www.torn.com/companies.php*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      api.torn.com
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/558252/Torn%20Company%20Employee%20Stat%20Comparator%20%28Sweet%20Shop%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558252/Torn%20Company%20Employee%20Stat%20Comparator%20%28Sweet%20Shop%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ===============================================
    //               CONFIGURATION SECTION
    // ===============================================

    // 1. *** IMPORTANT: REPLACE WITH YOUR COMPANY ID ***
    const COMPANY_ID = 0; // e.g., 12345

    // 2. OPTIONAL: You can enter your Limited Access API key here. If left blank or removed, the script will prompt you.
    const PRESET_API_KEY = "YOUR_API_KEY_HERE";

    // 3. *** IMPORTANT: REPLACE WITH YOUR COMPANY'S ACTUAL POSITION STAT REQUIREMENTS ***
    // (Values below are common requirements for a hypothetical 5-Star Sweet Shop. Adjust as needed!)
    // Stat Abbreviations: MAN (Manual Labor), INT (Intelligence), END (Endurance)
    const POSITION_REQUIREMENTS = {
        "Packer": { primary: "END", secondary: "MAN", primary_req: 12000, secondary_req: 8000 },
        "Cashier": { primary: "END", secondary: "INT", primary_req: 18000, secondary_req: 12000 },
        "Baker's Assistant": { primary: "INT", secondary: "END", primary_req: 24000, secondary_req: 16000 },
        "Baker": { primary: "INT", secondary: "END", primary_req: 36000, secondary_req: 24000 },
        "Head Baker": { primary: "INT", secondary: "END", primary_req: 50000, secondary_req: 33000 },
        // Add all other positions here (e.g., Marketing, Manager, Director)...
    };

    // ===============================================
    //               SCRIPT LOGIC SECTION
    // ===============================================

    const API_KEY_STORAGE_KEY = 'TornEmployeeStats_API_Key';
    let API_KEY = PRESET_API_KEY === "YOUR_API_KEY_HERE" ? GM_getValue(API_KEY_STORAGE_KEY, '') : PRESET_API_KEY;
    const TARGET_SELECTOR = '.content-title-text'; // A common element to insert the results before

    if (!COMPANY_ID || COMPANY_ID === 0) {
        alert("Torn Employee Script Error: Please set your COMPANY_ID in the script configuration.");
        return;
    }

    // --- Helper Functions ---

    function initializeApiKey() {
        if (API_KEY && API_KEY !== "YOUR_API_KEY_HERE") {
            GM_setValue(API_KEY_STORAGE_KEY, API_KEY); // Store preset key
            return true;
        }

        if (!API_KEY || API_KEY === "YOUR_API_KEY_HERE") {
            API_KEY = GM_getValue(API_KEY_STORAGE_KEY, '');
        }

        if (!API_KEY) {
            const tempKey = prompt("Please enter your Torn API Key (Limited Access required):");
            if (tempKey) {
                API_KEY = tempKey;
                GM_setValue(API_KEY_STORAGE_KEY, API_KEY);
                return true;
            } else {
                console.error("API Key not provided. Script aborted.");
                return false;
            }
        }
        return true;
    }

    function fetchCompanyData() {
        if (!initializeApiKey()) return;

        const apiUrl = `https://api.torn.com/company/${COMPANY_ID}?selections=employees&key=${API_KEY}`;
        
        console.log("Fetching data from Torn API...");

        GM_xmlhttpRequest({
            method: "GET",
            url: apiUrl,
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    if (data.error) {
                        console.error("Torn API Error:", data.error.error);
                        alert(`Torn API Error: ${data.error.error}. Check your API key and company ID.`);
                        return;
                    }
                    
                    processEmployeeData(data.company_employees);
                } catch (e) {
                    console.error("Error parsing API response:", e);
                }
            },
            onerror: function(response) {
                console.error("Network or API request error:", response);
            }
        });
    }

    function processEmployeeData(employees) {
        console.log("Processing Employee Data...");
        
        let resultsHtml = `
            <div style="margin-top: 10px; border: 1px solid #333; padding: 10px; background-color: #222;">
                <h3 style="margin-top: 0; color: #ff9900;">🍬 Sweet Shop Employee Stat Comparison 📊</h3>
                <table style="width: 100%; border-collapse: collapse; font-size: 12px; color: #ccc;">
                    <thead>
                        <tr style="background-color: #444;">
                            <th style="padding: 5px; text-align: left;">Employee</th>
                            <th style="padding: 5px; text-align: left;">Position</th>
                            <th style="padding: 5px; text-align: right;">Primary Stat</th>
                            <th style="padding: 5px; text-align: right;">Secondary Stat</th>
                            <th style="padding: 5px; text-align: left;">Details (Actual vs. Req)</th>
                        </tr>
                    </thead>
                    <tbody>`;

        for (const employeeId in employees) {
            const emp = employees[employeeId];
            const positionName = emp.position;
            const reqs = POSITION_REQUIREMENTS[positionName];

            if (!reqs) {
                // Skip if position requirements are not defined in the script config
                continue; 
            }

            // Map requirement keys to API keys
            const statMap = { 'MAN': 'manual_labor', 'INT': 'intelligence', 'END': 'endurance' };
            const primaryKey = statMap[reqs.primary];
            const secondaryKey = statMap[reqs.secondary];
            
            // Get employee's actual stats
            // The Torn API returns these as string representations of numbers, so we use || 0 for safety.
            const primaryStatValue = parseInt(emp[primaryKey]) || 0; 
            const secondaryStatValue = parseInt(emp[secondaryKey]) || 0;

            // Comparison Logic
            const primaryDiff = primaryStatValue - reqs.primary_req;
            const primaryColor = primaryDiff >= 0 ? '#00cc00' : '#cc0000'; // Green or Red
            
            const secondaryDiff = secondaryStatValue - reqs.secondary_req;
            const secondaryColor = secondaryDiff >= 0 ? '#00cc00' : '#cc0000'; // Green or Red

            let comparisonMessage = `
                <span style="color: ${primaryColor}; font-weight: bold;">${reqs.primary}</span>: ${primaryStatValue.toLocaleString()} / <span style="font-weight: normal;">Req ${reqs.primary_req.toLocaleString()}</span> (Diff: ${primaryDiff.toLocaleString()})<br>
                <span style="color: ${secondaryColor}; font-weight: bold;">${reqs.secondary}</span>: ${secondaryStatValue.toLocaleString()} / <span style="font-weight: normal;">Req ${reqs.secondary_req.toLocaleString()}</span> (Diff: ${secondaryDiff.toLocaleString()})
            `;

            // Add row to HTML table
            resultsHtml += `
                <tr style="border-top: 1px solid #444;">
                    <td style="padding: 5px;"><a href="/profiles.php?XID=${employeeId}" target="_blank" style="color: #66ccff;">${emp.name}</a></td>
                    <td style="padding: 5px;">${positionName}</td>
                    <td style="padding: 5px; text-align: right; color: ${primaryColor}">${primaryStatValue.toLocaleString()}</td>
                    <td style="padding: 5px; text-align: right; color: ${secondaryColor}">${secondaryStatValue.toLocaleString()}</td>
                    <td style="padding: 5px;">${comparisonMessage}</td>
                </tr>
            `;
        }
        
        resultsHtml += '</tbody></table></div>';
        
        // Find the target element and insert the results
        const targetElement = $(TARGET_SELECTOR).closest('.content-wrapper');
        if (targetElement.length) {
            targetElement.prepend(resultsHtml);
        } else {
            // Fallback for different page layouts
            $('#companies').prepend(resultsHtml);
        }
    }
    
    // --- Execution ---
    // Start the process only if we are on a company page
    if (window.location.href.includes('companies.php')) {
        $(document).ready(function() {
            fetchCompanyData();
        });
    }

})();