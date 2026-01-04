// ==UserScript==
// @name         AtoZ OnCall Allowance Sheet Generator & Work Statistics
// @namespace    http://tampermonkey.net/
// @version      2.6
// @description  Combined tool for OnCall allowance management and work statistics from AtoZ
// @author       wmehedis
// @match        https://atoz.amazon.work/time/balance-ledger/TimeOff_ATPLUS_DE_CF_PaidAbsenceFlexDismantlingHour
// @grant        GM_xmlhttpRequest
// @connect      oncall-api.corp.amazon.com
// @connect      atoz-apps.amazon.work
// @downloadURL https://update.greasyfork.org/scripts/548227/AtoZ%20OnCall%20Allowance%20Sheet%20Generator%20%20Work%20Statistics.user.js
// @updateURL https://update.greasyfork.org/scripts/548227/AtoZ%20OnCall%20Allowance%20Sheet%20Generator%20%20Work%20Statistics.meta.js
// ==/UserScript==


(function () {
'use strict';

const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

    .punch-column-header {
        font-weight: 600;
        text-align: center;
        padding: 12px;
        font-family: 'Inter', sans-serif;
    }

    .combined-panel {
        position: fixed !important;
        right: 0 !important;
        top: 63px !important;
        z-index: 9999 !important;
        height: 100vh;
        width: 320px;
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        backdrop-filter: blur(10px);
        box-shadow: -10px 0 30px rgba(0,0,0,0.15);
        border-left: 1px solid rgba(255,255,255,0.2);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        font-family: 'Inter', sans-serif;
    }

    .punch-cell {
        font-size: 12px;
        text-align: center;
        padding: 8px;
        font-family: 'Inter', sans-serif;
        margin: 2px;
    }

    .punch-card {
        display: inline-block;
        background: rgba(255,255,255,0.9);
        border: 1px solid rgba(255,255,255,0.3);
        border-radius: 12px;
        padding: 6px 12px;
        margin: 2px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        backdrop-filter: blur(5px);
        transition: all 0.3s ease;
    }

    .punch-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    }

    .punch-out {
        color: #e74c3c;
        font-weight: 600;
    }

    .punch-in {
        color: #27ae60;
        font-weight: 600;
    }

    .panel-content {
        flex: 1;
        overflow-y: auto;
        padding: 18px;
        scrollbar-width: thin;
        scrollbar-color: rgba(0,0,0,0.2) transparent;
    }

    .panel-content::-webkit-scrollbar {
        width: 6px;
    }

    .panel-content::-webkit-scrollbar-track {
        background: transparent;
    }

    .panel-content::-webkit-scrollbar-thumb {
        background: rgba(0,0,0,0.2);
        border-radius: 3px;
    }

    .section {
        background: rgba(255,255,255,0.8);
        border-radius: 16px;
        padding: 12px;
        margin-bottom: 12px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.1);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.2);
        transition: all 0.3s ease;
    }

    .section:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 40px rgba(0,0,0,0.15);
    }

    .oncall-input {
        width: calc(50% - 8px) !important;
        margin: 8px 4px;
        padding: 12px;
        border: 2px solid rgba(255,255,255,0.3);
        border-radius: 12px;
        background: rgba(255,255,255,0.9);
        font-family: 'Inter', sans-serif;
        font-size: 14px;
        transition: all 0.3s ease;
    }

    .oncall-input:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        transform: translateY(-1px);
    }

    .action-button {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        padding: 14px 20px;
        border-radius: 12px;
        cursor: pointer;
        margin-top: 12px;
        width: 100%;
        font-family: 'Inter', sans-serif;
        font-weight: 600;
        font-size: 14px;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
    }

    .action-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
        background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
    }

    .action-button:active {
        transform: translateY(0);
    }

    .date-range {
        background: rgba(255,255,255,0.6);
        padding: 16px;
        border-radius: 12px;
        margin-bottom: 12px;
        border: 1px solid rgba(255,255,255,0.3);
        backdrop-filter: blur(5px);
    }

    .shift-type-container {
        margin-bottom: 12px;
        font-size: 13px;
    }

    .shift-type-container label {
        display: inline-flex;
        align-items: center;
        cursor: pointer;
        padding: 8px 12px;
        border-radius: 8px;
        transition: all 0.2s ease;
        font-weight: 500;
    }

    .shift-type-container label:hover {
        background: rgba(102, 126, 234, 0.1);
    }

    .shift-type-container input[type="radio"] {
        margin-right: 8px;
        accent-color: #667eea;
    }

    .main-content {
        margin-right: 320px;
    }

    .nav-header {
        margin-bottom: 18px;
        padding-bottom: 15px;
        border-bottom: 2px solid rgba(255,255,255,0.3);
        text-align: center;
    }

    .nav-header h3 {
        margin: 0;
        color: #2d3748;
        font-family: 'Inter', sans-serif;
        font-weight: 700;
        font-size: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    .content-wrapper {
        margin-bottom: 20px;
    }

    .footer {
        padding: 15px;
        background: rgba(255,255,255,0.9);
        backdrop-filter: blur(10px);
        border-top: 1px solid rgba(255,255,255,0.2);
        text-align: center;
        font-size: 11px;
        color: #666;
        flex-shrink: 0;
        width: 100%;
    }

    .creator-text {
        color: #666;
        display: inline-block;
        font-weight: 500;
    }

    .creator-text a {
        color: #667eea;
        text-decoration: none;
        font-weight: 600;
        transition: all 0.3s ease;
    }

    .creator-text a:hover {
        color: white;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 8px;
        padding: 4px 8px;
        margin: -4px -8px;
        transform: translateY(-1px);
    }

    .feature-request {
        color: #667eea;
        text-decoration: none;
        font-size: 12px;
        display: block;
        text-align: center;
        margin-top: 8px;
        font-weight: 500;
        transition: all 0.3s ease;
    }

    .feature-request:hover {
        color: #5a67d8;
        transform: translateY(-1px);
    }

    h4, h5 {
        font-family: 'Inter', sans-serif;
        font-weight: 700;
        color: #2d3748;
        margin-bottom: 10px;
        font-size: 14px;
    }

    @keyframes flash {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0.3; }
    }

    input, select {
        font-family: 'Inter', sans-serif;
    }

    .stats-card {
        background: rgba(255,255,255,0.7);
        border-radius: 12px;
        padding: 8px;
        margin-bottom: 6px;
        border: 1px solid rgba(255,255,255,0.3);
        backdrop-filter: blur(5px);
        transition: all 0.3s ease;
    }

    .stats-card:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }

    .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(8px);
        z-index: 99998;
        opacity: 0;
        transition: all 0.3s ease;
    }

    .modal-backdrop.show {
        opacity: 1;
    }
`;

function formatTime(dateTime) {
let time = new Date(dateTime).toLocaleTimeString([], {
hour: '2-digit',
minute: '2-digit',
hour12: false,
timeZone: 'Europe/Berlin'
});
return time === '00:00' ? '24:00' : time;
}

function getPunchesForDate(punchData, date) {
if (!punchData || !punchData.punchesTimeSegments) return [];
return punchData.punchesTimeSegments.filter(p =>
new Date(p.startDateTime).toDateString() === date.toDateString()
);
}

function injectStyles() {
    const styleSheet = document.createElement("style");
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
}
function fetchAPI(url) {
// For internal Amazon URLs, use regular fetch
if (url.includes('atoz-apps.amazon.work')) {
return fetch(url, {
headers: {
'accept': '/',
'x-atoz-client-id': 'ATOZ_TIMEOFF_SERVICE'
},
credentials: 'include'
}).then(response => response.json());
}

// For OnCall API, use GM_xmlhttpRequest
return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
        method: "GET",
        url: url,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        credentials: 'include',
        onload: function(response) {
            if (response.status >= 200 && response.status < 300) {
                try {
                    const data = JSON.parse(response.responseText);
                    resolve(data);
                } catch (e) {
                    reject(new Error('Failed to parse response'));
                }
            } else {
                reject(new Error(`API call failed: ${response.status} ${response.statusText}`));
            }
        },
        onerror: function(error) {
            reject(new Error('Network error occurred'));
        }
    });
});
}

async function getUserTeams(loginId) {
try {
const teams = await fetchAPI(`https://oncall-api.corp.amazon.com/teams?q=members:'${loginId}' OR owners:'${loginId}'`);
return teams;
} catch (error) {
console.error('Error fetching teams:', error);
return [];
}
}

async function fetchPunchData() {
try {
console.log('Attempting to fetch punch data...');
let employeeId = null;

    // Method 1: Try to get from URL
    const urlParams = new URLSearchParams(window.location.search);
    employeeId = urlParams.get('employeeId');

    // Method 2: Try to get from page content
    if (!employeeId) {
        const pageContent = document.documentElement.innerHTML;
        const matches = pageContent.match(/employeeId["']?\s*:\s*["']([A-Z0-9]+)["']/i) ||
                       pageContent.match(/employee_id["']?\s*:\s*["']([A-Z0-9]+)["']/i) ||
                       pageContent.match(/userId["']?\s*:\s*["']([A-Z0-9]+)["']/i);

        if (matches && matches[1]) {
            employeeId = matches[1];
            console.log('Found employee ID from page content:', employeeId);
        }
    }

    // Method 3: Try to get from meta tags
    if (!employeeId) {
        const metaTags = document.getElementsByTagName('meta');
        for (let tag of metaTags) {
            if (tag.getAttribute('name') === 'employee-id' ||
                tag.getAttribute('name') === 'user-id') {
                employeeId = tag.getAttribute('content');
                break;
            }
        }
    }

    // Method 4: Try to get from localStorage
    if (!employeeId) {
        try {
            const stored = localStorage.getItem('AtoZContext');
            if (stored) {
                const parsed = JSON.parse(stored);
                employeeId = parsed?.employee?.employeeId;
            }
        } catch (e) {
            console.log('Error reading from localStorage:', e);
        }
    }

    // If still no employee ID, try one last method
    if (!employeeId) {
        const scripts = document.getElementsByTagName('script');
        for (let script of scripts) {
            const content = script.textContent;
            const match = content.match(/employeeId["']?\s*:\s*["']([A-Z0-9]+)["']/i);
            if (match) {
                employeeId = match[1];
                break;
            }
        }
    }

    if (!employeeId) {
        console.error('Failed to find employee ID using all methods');
        return null;
    }

    console.log('Employee ID found:', employeeId);

    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 2);

    const url = `https://atoz-apps.amazon.work/apis/AtoZTimeoffService/punches?employeeId=${employeeId}&startDate=${startDate.toISOString().split('T')[0]}&endDate=${endDate.toISOString().split('T')[0]}`;

    console.log('Fetching punch data from URL:', url);

    const response = await fetch(url, {
        headers: {
            'accept': '*/*',
            'x-atoz-client-id': 'ATOZ_TIMEOFF_SERVICE'
        },
        credentials: 'include'
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Punch data received successfully');
    return data;

} catch (error) {
    console.error('Error in fetchPunchData:', error);
    return null;
}
}



function parseDate(text) {
    const match = text.match(/(\d+)\.\s+(\w+\.?)\s+(\d{4})/) || text.match(/(\w+)\s+(\d+),\s+(\d{4})/);
    if (!match) return null;

    const [_, part1, part2, year] = match;
    const day = part1.length <= 2 ? part1 : part2;
    const monthName = (part1.length <= 2 ? part2 : part1).replace('.', '');

    const months = {
        Jan: '01', January: '01',
        Feb: '02', February: '02',
        Mar: '03', March: '03',
        Apr: '04', April: '04',
        May: '05',
        Jun: '06', June: '06',
        Jul: '07', July: '07',
        Aug: '08', August: '08',
        Sep: '09', September: '09',
        Oct: '10', October: '10',
        Nov: '11', November: '11',
        Dec: '12', December: '12'
    };

    const month = months[monthName];
    if (!month) return null;

    return new Date(`${year}-${month}-${day.padStart(2, '0')}`);
}



function addPunchColumnHeader(table) {
    const headerRow = table.querySelector('thead tr');
    const th = document.createElement('th');
    th.className = 'punch-column-header';
    th.textContent = 'Punch Times';
    headerRow.appendChild(th);
}

function calculateWorkHours(inTime, outTime) {
    const start = new Date(`2000-01-01 ${inTime}`);
    const end = new Date(`2000-01-01 ${outTime}`);
    let totalHours = (end - start) / (1000 * 60 * 60);

    // Apply break time deductions
    if (totalHours < 6) {
        // No break deduction for less than 6 hours
    } else if (totalHours >= 9) {
        // 45 min break for 9+ hours
        totalHours -= 0.75;
    } else if (totalHours >= 6) {
        // 30 min break for 6+ hours
        totalHours -= 0.5;
    }

    return Math.round(totalHours * 100) / 100;
}

function exportToExcel(punchData) {
    const rows = [
        ['Date', 'Punch In', 'Punch Out', 'Hours Worked']
    ];

    const punchesByDate = {};
    punchData.punchesTimeSegments.forEach(punch => {
        const date = new Date(punch.startDateTime).toLocaleDateString();
        if (!punchesByDate[date]) {
            punchesByDate[date] = [];
        }
        punchesByDate[date].push(punch);
    });

    Object.entries(punchesByDate).forEach(([date, punches]) => {
        if (punches.length > 0) {
            const inTime = formatTime(punches[0].startDateTime);
            const outTime = formatTime(punches[punches.length - 1].endDateTime || punches[punches.length - 1].startDateTime);
            const hours = calculateWorkHours(inTime, outTime);
            rows.push([date, inTime, outTime, hours.toFixed(2)]);
        }
    });

    const csvContent = rows.map(row => row.join(',')).join('\n');
    downloadCSV(csvContent, 'AtoZ_punch_history.csv');
}

function downloadCSV(csvContent, filename) {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
function createCombinedPanel(punchData) {

// Adjust the main content area
const mainContent = document.querySelector('.container');
if (mainContent) {
    mainContent.classList.add('main-content');
}

const panel = document.createElement('div');
panel.className = 'combined-panel';
panel.innerHTML = `
    <div class="panel-content">
        <div class="nav-header">
            <h3>⚡ AtoZ Assistant</h3>
        </div>

        <div class="content-wrapper">
            <div class="section">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
                    <h4 style="margin: 0;">🕰️ Today's Time</h4>
                    <button id="today-info-btn" style="background: #667eea; color: white; border: none; border-radius: 50%; width: 20px; height: 20px; font-size: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-weight: bold; transition: all 0.3s ease;">i</button>
                </div>
                <div id="today-punch-content">
                    <div class="stats-card">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="font-weight: 400; color: #4a5568; font-size: 14px;">🟢 In</span>
                            <span id="punch-in-time" style="font-weight: 600; color: #27ae60; font-size: 14px;">--:--:--</span>
                        </div>
                    </div>
                    <div class="stats-card">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="font-weight: 400; color: #4a5568; font-size: 14px;">⏳ To 8h</span>
                            <span id="time-to-eight" style="font-weight: 600; color: #f39c12; font-size: 14px;">--h --m <span id="to-eight-seconds" style="font-size: 13px; opacity: 0.7;">0s</span></span>
                        </div>
                    </div>
                    <div class="stats-card">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="font-weight: 400; color: #4a5568; font-size: 14px;">⏱️ Worked</span>
                            <span id="worked-time" style="font-weight: 600; color: #f39c12; font-size: 14px;">0h 0m <span id="worked-seconds" style="font-size: 13px; opacity: 0.7;">0s</span></span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="section">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
                    <h4 style="margin: 0;">📈 My Work Stats</h4>
                    <button id="break-info-btn" style="background: #667eea; color: white; border: none; border-radius: 50%; width: 20px; height: 20px; font-size: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-weight: bold; transition: all 0.3s ease;">i</button>
                </div>
                <div id="stats-content">
                    <div class="stats-card">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="font-weight: 500; color: #4a5568;">🗓️ This Week</span>
                            <span id="weekly-hours" style="font-weight: 700; color: #667eea; font-size: 18px;">0.00</span>
                        </div>
                    </div>
                    <div class="stats-card">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="font-weight: 500; color: #4a5568;">📊 This Month</span>
                            <span id="monthly-hours" style="font-weight: 700; color: #667eea; font-size: 18px;">0.00</span>
                        </div>
                    </div>
                    <button id="export-punches" class="action-button">📊 Export Work Report</button>
                </div>
            </div>

            <div class="section">
                <h4>🏖️ Time Off Balance</h4>
                <div id="balance-content">
                    <div class="stats-card">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="font-weight: 500; color: #4a5568;">🌴 Vacation Days</span>
                            <span id="vacation-balance" style="font-weight: 700; color: #27ae60; font-size: 18px;">--</span>
                        </div>
                    </div>
                    <div class="stats-card">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="font-weight: 500; color: #4a5568;">⏰ Overtime Hours</span>
                            <span id="overtime-balance" style="font-weight: 700; color: #f39c12; font-size: 18px;">--</span>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    </div>
    <div class="footer">
        <span class="creator-text">💡 Built by <a href="https://phonetool.amazon.com/users/wmehedis" target="_blank">@wmehedis</a></span>
        <a href="mailto:wmehedis@amazon.de?subject=Feature Request - AtoZ Work Assistant"
           class="feature-request">
           🚀 Suggest Feature
        </a>
    </div>
`;

document.body.appendChild(panel);

// Initialize dates
const now = new Date();
const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

// Initialize dates (removed date range functionality)



// Initialize work statistics
updateWorkStatistics(punchData);

// Update today's punch display
updateTodaysPunchDisplay(punchData);
startPunchTimeUpdater();

// Fetch time off balances
fetchTimeOffBalances(punchData);

// Add event listeners
document.getElementById('export-punches').onclick = () => exportToExcel(punchData);

// Add break info button handler
document.getElementById('break-info-btn').onclick = () => {
    alert('Break Time Calculation:\n\n• Less than 6 hours: No break deducted\n• 6+ hours: 30 minutes break deducted\n• 9+ hours: 45 minutes break deducted\n\nThis follows German labor law requirements.');
};

// Add today's time info button handler
document.getElementById('today-info-btn').onclick = () => {
    alert('Today\'s Time Information:\n\n• In: Your punch-in time for today\n• To 8h: Time remaining to reach 8 hours or overtime if over 8h\n• Worked: Total hours worked today with break time deducted\n\nColor coding:\n• Orange: Less than 8 hours worked\n• Green: 8-9 hours worked (optimal)\n• Red flashing: Over 9 hours worked (alert)');
};

// Fetch time off balances
fetchTimeOffBalances(punchData);

// Update font styles for consistency
updateFontStyles();


}

function updateWorkStatistics(punchData) {
    const now = new Date();
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    let weeklyHours = 0;
    let monthlyHours = 0;

    punchData.punchesTimeSegments.forEach(punch => {
        const punchDate = new Date(punch.startDateTime);
        const inTime = formatTime(punch.startDateTime);
        const outTime = formatTime(punch.endDateTime || punch.startDateTime);
        const hours = calculateWorkHours(inTime, outTime);

        if (punchDate >= weekStart) {
            weeklyHours += hours;
        }
        if (punchDate >= monthStart) {
            monthlyHours += hours;
        }
    });

    document.getElementById('weekly-hours').textContent = formatHoursMinutes(weeklyHours);
    document.getElementById('monthly-hours').textContent = formatHoursMinutes(monthlyHours);
}

async function fetchTimeOffBalances(punchData) {
    try {
        const employeeId = getEmployeeIdFromPage();
        if (!employeeId) return;

        const now = new Date().toISOString();
        const url = `https://atoz-apps.amazon.work/apis/TAAPI/v1/time-away/balances?employeeId=${employeeId}&asOfDateTime=${now}&asOfDateTimeTimezone=UTC`;

        const response = await fetch(url, {
            headers: {
                'accept': '*/*',
                'x-atoz-client-id': 'ATOZ_TIMEOFF_SERVICE'
            },
            credentials: 'include'
        });

        if (response.ok) {
            const data = await response.json();
            updateBalanceDisplay(data);
        }
    } catch (error) {
        console.error('Balance fetch error:', error);
    }
}

function updateBalanceDisplay(balanceData) {
    let vacationDays = '--';
    let overtimeHours = '--';

    if (balanceData?.balances) {
        balanceData.balances.forEach(balance => {
            if (balance.balanceName.includes('VacationHours')) {
                vacationDays = balance.availableBalance.toFixed(1);
            } else if (balance.balanceName.includes('FlexDismantlingHour')) {
                overtimeHours = balance.availableBalance.toFixed(2);
            }
        });
    }

    document.getElementById('vacation-balance').textContent = vacationDays;
    document.getElementById('overtime-balance').textContent = overtimeHours === '--' ? '--' : formatHoursMinutes(parseFloat(overtimeHours));
}

function formatHoursMinutes(totalHours) {
    const hours = Math.floor(totalHours);
    const minutes = Math.round((totalHours - hours) * 60);
    return `${hours}h ${minutes}m`;
}

function updateTodaysPunchDisplay(punchData) {
    const today = new Date();
    const todayPunches = getPunchesForDate(punchData, today);

    if (todayPunches.length > 0) {
        const punchIn = new Date(todayPunches[0].startDateTime);
        const punchOut = todayPunches[todayPunches.length - 1].endDateTime ?
            new Date(todayPunches[todayPunches.length - 1].endDateTime) : null;

        document.getElementById('punch-in-time').textContent = formatTimeWithSeconds(punchIn);

        if (punchOut) {
            const hours = calculateWorkHours(formatTime(punchIn), formatTime(punchOut));
            document.getElementById('worked-time').textContent = formatHoursMinutes(hours);
            updateTimeToEight(hours, true);
        } else {
            updateTimeToEight(0, false);
        }
    }
}

function formatTimeWithSeconds(dateTime) {
    return new Date(dateTime).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: 'Europe/Berlin'
    });
}

function updateTimeToEight(currentHours, isPunchedOut) {
    const timeToEightElement = document.getElementById('time-to-eight');

    if (currentHours >= 8) {
        const overtime = currentHours - 8;
        const overtimeFormatted = formatHoursMinutes(overtime);
        timeToEightElement.innerHTML = `<span style="font-size: 12px;">+${overtimeFormatted}</span>`;
        timeToEightElement.style.color = '#27ae60';
    } else {
        const remaining = 8 - currentHours;
        timeToEightElement.textContent = formatHoursMinutes(remaining);
        timeToEightElement.style.color = '#f39c12';
    }
}

let startTime = null;

let alertSoundPlayed = false;

function startPunchTimeUpdater() {
    setInterval(() => {
        const punchInElement = document.getElementById('punch-in-time');
        const workedElement = document.getElementById('worked-time');

        if (punchInElement && punchInElement.textContent !== '--:--:--') {
            const today = new Date();
            const todayPunches = getPunchesForDate(window.punchData, today);
            const isPunchedOut = todayPunches.length > 0 && todayPunches[todayPunches.length - 1].endDateTime;

            if (!isPunchedOut) {
                if (!startTime) {
                    const punchInTime = punchInElement.textContent;
                    const [hours, minutes, seconds] = punchInTime.split(':');
                    startTime = new Date();
                    startTime.setHours(parseInt(hours), parseInt(minutes), parseInt(seconds));
                }

                const now = new Date();
                const workedMs = now - startTime;
                const totalSeconds = Math.floor(workedMs / 1000);
                const totalHours = totalSeconds / 3600;

                // Apply break time deductions for display
                let adjustedHours = totalHours;
                if (totalHours >= 9) {
                    adjustedHours -= 0.75; // 45 min break
                } else if (totalHours >= 6) {
                    adjustedHours -= 0.5; // 30 min break
                }

                // Calculate hours and minutes from adjusted time
                const hours = Math.floor(adjustedHours);
                const minutes = Math.floor((adjustedHours - hours) * 60);
                const seconds = totalSeconds % 60;

                // Color coding and alerts based on hours worked
                let color = '#f39c12'; // Orange for <8h
                let animation = '';

                if (totalHours >= 9) {
                    color = '#e74c3c'; // Red for 9h+
                    animation = 'flash 1s infinite';

                    // Sound alert at 9h 45m
                    if (totalHours >= 9.75 && !alertSoundPlayed) {
                        playAlertSound();
                        showNotification('Work Time Alert', 'You have worked 9h 45m. Remember to punch out!');
                        alertSoundPlayed = true;
                    }
                } else if (totalHours >= 8) {
                    color = '#27ae60'; // Green for 8-9h
                }

                workedElement.innerHTML = `${hours}h ${minutes}m <span style="font-size: 13px; opacity: 0.7;">${seconds}s</span>`;
                workedElement.style.color = color;
                workedElement.style.animation = animation;

                updateTimeToEightWithSeconds(totalSeconds);
            }
        }
    }, 1000);
}

function playAlertSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
}

function showNotification(title, message) {
    if ('Notification' in window) {
        if (Notification.permission === 'granted') {
            new Notification(title, { body: message, icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><text y="18" font-size="18">⏰</text></svg>' });
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    new Notification(title, { body: message });
                }
            });
        }
    }

    // Fallback: Browser alert
    setTimeout(() => alert(`${title}: ${message}`), 100);
}

function updateTimeToEightWithSeconds(totalWorkedSeconds) {
    const timeToEightElement = document.getElementById('time-to-eight');
    const eightHoursInSeconds = 8 * 3600;

    if (totalWorkedSeconds >= eightHoursInSeconds) {
        const overtimeSeconds = totalWorkedSeconds - eightHoursInSeconds;
        const hours = Math.floor(overtimeSeconds / 3600);
        const minutes = Math.floor((overtimeSeconds % 3600) / 60);
        const seconds = overtimeSeconds % 60;
        timeToEightElement.innerHTML = `<span style="font-size: 12px;">+${hours}h ${minutes}m <span style="font-size: 10px; opacity: 0.7; animation: pulse 0.5s ease-in-out;">${seconds}s</span></span>`;
        timeToEightElement.style.color = '#27ae60';
    } else {
        const remainingSeconds = eightHoursInSeconds - totalWorkedSeconds;
        const hours = Math.floor(remainingSeconds / 3600);
        const minutes = Math.floor((remainingSeconds % 3600) / 60);
        const seconds = remainingSeconds % 60;
        timeToEightElement.innerHTML = `${hours}h ${minutes}m <span style="font-size: 12px; opacity: 0.7; animation: pulse 0.5s ease-in-out;">${seconds}s</span>`;
        timeToEightElement.style.color = '#f39c12';
    }
}

function updateFontStyles() {
    // Update Work Stats section labels and values
    document.querySelectorAll('.stats-card').forEach(card => {
        const label = card.querySelector('span:first-child');
        const value = card.querySelector('span:last-child');

        if (label) {
            label.style.fontWeight = '400';
            label.style.fontSize = '14px';
        }

        if (value) {
            value.style.fontWeight = '600';
            value.style.fontSize = '14px';
        }
    });

    // Specific IDs
    ['weekly-hours', 'monthly-hours', 'vacation-balance', 'overtime-balance'].forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.style.fontWeight = '600';
            element.style.fontSize = '14px';
        }
    });
}

function getEmployeeIdFromPage() {
    const urlParams = new URLSearchParams(window.location.search);
    let employeeId = urlParams.get('employeeId');

    if (!employeeId) {
        const pageContent = document.documentElement.innerHTML;
        const matches = pageContent.match(/employeeId["']?\s*:\s*["']([A-Z0-9]+)["']/i);
        if (matches && matches[1]) {
            employeeId = matches[1];
        }
    }

    return employeeId;
}






async function processTable() {
console.log('Starting processTable');
try {
// Find the table
const table = document.querySelector('table[data-test-component="StencilTable"]');
if (!table) {
console.log('Table not found');
return;
}

    // Check if punch column already exists
    if (!table.querySelector('.punch-column-header')) {
        console.log('Found table, injecting styles');
        injectStyles();

        console.log('Adding punch column header');
        addPunchColumnHeader(table);
    }

    console.log('Fetching punch data');
    const punchData = await fetchPunchData();
    if (!punchData) {
        console.error('No punch data received');
        return;
    }

    // Store punch data globally for use in OnCall sheet generation
    window.punchData = punchData;
    console.log('Punch data received and stored globally:', punchData);

    console.log('Creating combined panel');
    // Remove existing panel if it exists
    const existingPanel = document.querySelector('.combined-panel');
    if (existingPanel) {
        existingPanel.remove();
    }
    createCombinedPanel(punchData);

    console.log('Adding OnCall button');
    injectOnCallButton();

    console.log('Processing table rows');
    const rows = table.querySelectorAll('tbody tr');
    rows.forEach((row, index) => {
        try {
            const dateCell = row.querySelector('.css-1vslykb');
            const dateText = dateCell?.querySelector('.css-1kgbsl4')?.textContent;
            console.log(`Processing row ${index}, date: ${dateText}`);

            const date = parseDate(dateText);
            const cell = document.createElement('td');
            cell.className = 'punch-cell';

            if (date) {
                const punches = getPunchesForDate(punchData, date);
                console.log(`Found ${punches.length} punches for ${dateText}`);

                if (punches.length > 0) {
                    const inTime = formatTime(punches[0].startDateTime);
                    const outTime = formatTime(
                        punches[punches.length - 1].endDateTime ||
                        punches[punches.length - 1].startDateTime
                    );

                    cell.innerHTML = `
                        <span class="punch-card">
                            In: <span class="punch-in">${inTime}</span>
                        </span>
                        <span class="punch-card">
                            Out: <span class="punch-out">${outTime}</span>
                        </span>
                    `;
                } else {
                    cell.textContent = '—';
                }
            } else {
                console.log(`Invalid date for row ${index}: ${dateText}`);
                cell.textContent = 'Invalid';
            }

            // Check if cell already exists
            const existingCell = row.querySelector('.punch-cell');
            if (existingCell) {
                console.log(`Replacing existing cell for row ${index}`);
                row.replaceChild(cell, existingCell);
            } else {
                console.log(`Adding new cell for row ${index}`);
                row.appendChild(cell);
            }
        } catch (rowError) {
            console.error(`Error processing row ${index}:`, rowError);
        }
    });

    // Update work statistics
    console.log('Updating work statistics');
    try {
        updateWorkStatistics(punchData);
    } catch (statsError) {
        console.error('Error updating work statistics:', statsError);
    }

    // Add mutation observer to handle dynamic updates
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                const newRows = Array.from(mutation.addedNodes)
                    .filter(node => node.nodeName === 'TR');

                if (newRows.length > 0) {
                    console.log('New rows detected, updating punch data');
                    newRows.forEach((row, index) => {
                        try {
                            const dateCell = row.querySelector('.css-1vslykb');
                            const dateText = dateCell?.querySelector('.css-1kgbsl4')?.textContent;
                            if (dateText) {
                                const date = parseDate(dateText);
                                if (date) {
                                    const punches = getPunchesForDate(punchData, date);
                                    const cell = document.createElement('td');
                                    cell.className = 'punch-cell';

                                    if (punches.length > 0) {
                                        const inTime = formatTime(punches[0].startDateTime);
                                        const outTime = formatTime(
                                            punches[punches.length - 1].endDateTime ||
                                            punches[punches.length - 1].startDateTime
                                        );

                                        cell.innerHTML = `
                                            <span class="punch-card">
                                                In: <span class="punch-in">${inTime}</span>
                                            </span>
                                            <span class="punch-card">
                                                Out: <span class="punch-out">${outTime}</span>
                                            </span>
                                        `;
                                    } else {
                                        cell.textContent = '—';
                                    }
                                    row.appendChild(cell);
                                }
                            }
                        } catch (error) {
                            console.error(`Error processing new row ${index}:`, error);
                        }
                    });
                }
            }
        });
    });

    // Start observing the table body
    const tbody = table.querySelector('tbody');
    if (tbody) {
        observer.observe(tbody, {
            childList: true,
            subtree: true
        });
    }

    // Store the observer in a global variable so it can be disconnected if needed
    window.tableObserver = observer;

    console.log('Table processing complete');
} catch (error) {
    console.error('Error in processTable:', error);
}
}

// Add event listener for DOM changes
const observeDOM = (function() {
const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

return function(obj, callback) {
    if (!obj || obj.nodeType !== 1) return;

    if (MutationObserver) {
        const obs = new MutationObserver((mutations, observer) => {
            callback(mutations);
        });
        obs.observe(obj, {
            childList: true,
            subtree: true
        });
    } else if (window.addEventListener) {
        obj.addEventListener('DOMNodeInserted', callback, false);
        obj.addEventListener('DOMNodeRemoved', callback, false);
    }
};
})();

// Initialize the script with retry mechanism

function injectOnCallDialog() {
const existingDialog = document.getElementById("oncall-dialog");
if (existingDialog) return;

const dialog = document.createElement("div");
dialog.id = "oncall-dialog";
dialog.style.cssText = `
    position: fixed;
    top: 80px;
    left: 50%;
    transform: translateX(-50%);
    background: white;
    border: 1px solid #ccc;
    border-radius: 16px;
    padding: 30px;
    z-index: 99999;
    width: 850px;
    max-height: 85vh;
    overflow-y: auto;
    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    font-family: 'Inter', sans-serif;
    backdrop-filter: blur(10px);
    opacity: 0;
    transform: translateX(-50%) translateY(-20px);
    transition: all 0.3s ease;
`;

dialog.innerHTML = `
    <div style="position: sticky; top: 0; background: white; z-index: 100; display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; padding: 15px; border-radius:15px; border-bottom: 2px solid #f1f5f9; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h3 style="margin: 0; font-family: 'Inter', sans-serif; font-weight: 700; color: #2d3748; font-size: 26px;">📋 My OnCall Schedule</h3>
        <button id="close-oncall-dialog" style="background: linear-gradient(135deg, #ff6b6b, #ee5a52); color: white; border: none; font-size: 18px; cursor: pointer; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease; box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);">×</button>
    </div>
    <div style="font-family: 'Inter', sans-serif; padding: 0 5px;">
        <div style="margin-bottom: 25px;">
            <label style="display: block; margin-bottom: 10px; font-weight: 600; color: #4a5568; font-size: 15px;">👤 Login ID:</label>
            <input type="text" id="oncall-loginId" placeholder="Enter your Amazon login" style="width: 100%; margin-bottom: 18px; padding: 14px; border: 2px solid #e2e8f0; border-radius: 12px; font-family: 'Inter', sans-serif; font-size: 14px; transition: all 0.3s ease;">
        </div>

        <div style="margin-bottom: 25px;">
            <label style="display: block; margin-bottom: 10px; font-weight: 600; color: #4a5568; font-size: 15px;">📆 Month:</label>
            <input type="month" id="oncall-monthSelect" style="width: 100%; margin-bottom: 18px; padding: 14px; border: 2px solid #e2e8f0; border-radius: 12px; font-family: 'Inter', sans-serif; font-size: 14px; transition: all 0.3s ease;">
        </div>

        <div style="margin: 25px 0; padding: 25px; background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1)); border-radius: 16px; border: 1px solid rgba(102, 126, 234, 0.2); transition: all 0.3s ease;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px;">
                <h4 style="margin: 0; font-weight: 600; color: #2d3748; font-size: 16px;">⚙️ Manual Time Override</h4>
                <label class="switch">
                    <input type="checkbox" id="manual-override-toggle">
                    <span class="slider round"></span>
                </label>
            </div>
            <div id="manual-override-section" style="display: none;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 25px;">
                    <div style="background: rgba(255,255,255,0.8); padding: 18px; border-radius: 12px; transition: all 0.3s ease; border: 1px solid rgba(255,255,255,0.5);">
                        <label style="display: block; margin-bottom: 10px; font-weight: 600; color: #4a5568; font-size: 14px;">🌅 Early Shift:</label>
                        <div style="display: flex; gap: 10px; margin-top: 10px;">
                            <input type="text" id="early-shift-start" placeholder="02:30" style="width: 85px; padding: 10px; border: 2px solid #e2e8f0; border-radius: 8px; font-family: 'Inter', sans-serif; transition: all 0.3s ease;" maxlength="5">
                            <input type="text" id="early-shift-end" placeholder="13:00" style="width: 85px; padding: 10px; border: 2px solid #e2e8f0; border-radius: 8px; font-family: 'Inter', sans-serif; transition: all 0.3s ease;" maxlength="5">
                        </div>
                        <small style="color: #718096; font-size: 12px; margin-top: 5px; display: block;">24hr format (e.g., 02:30)</small>
                    </div>
                    <div style="background: rgba(255,255,255,0.8); padding: 18px; border-radius: 12px; transition: all 0.3s ease; border: 1px solid rgba(255,255,255,0.5);">
                        <label style="display: block; margin-bottom: 10px; font-weight: 600; color: #4a5568; font-size: 14px;">🌙 Late Shift:</label>
                        <div style="display: flex; gap: 10px; margin-top: 10px;">
                            <input type="text" id="late-shift-start" placeholder="13:00" style="width: 85px; padding: 10px; border: 2px solid #e2e8f0; border-radius: 8px; font-family: 'Inter', sans-serif; transition: all 0.3s ease;" maxlength="5">
                            <input type="text" id="late-shift-end" placeholder="22:00" style="width: 85px; padding: 10px; border: 2px solid #e2e8f0; border-radius: 8px; font-family: 'Inter', sans-serif; transition: all 0.3s ease;" maxlength="5">
                        </div>
                        <small style="color: #718096; font-size: 12px; margin-top: 5px; display: block;">24hr format (e.g., 13:00)</small>
                    </div>
                </div>
            </div>
        </div>

        <div style="display: flex; gap: 15px; margin-top: 30px;">
            <button id="oncall-fetch" style="flex: 1; padding: 16px 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 12px; font-family: 'Inter', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3); font-size: 15px;">🔍 Load My Schedule</button>
            <button id="download-oncall-sheet" style="flex: 1; padding: 16px 24px; background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); color: white; border: none; border-radius: 12px; font-family: 'Inter', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(72, 187, 120, 0.3); font-size: 15px;" disabled>💾 Export Timesheet</button>
        </div>
    </div>
    <div id="oncall-debug" style="font-size: 13px; margin-top: 25px; background: rgba(255,255,255,0.9); padding: 18px; border-radius: 12px; border: 1px solid #e2e8f0; font-family: 'Inter', sans-serif;"></div>
    <div id="oncall-results" style="margin-top: 25px;"></div>
`;

// Add CSS for the toggle switch and hover effects
const style = document.createElement('style');
style.textContent = `
    .switch {
        position: relative;
        display: inline-block;
        width: 60px;
        height: 34px;
    }
    .switch input {
        opacity: 0;
        width: 0;
        height: 0;
    }
    .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        transition: .4s;
        border-radius: 34px;
    }
    .slider:before {
        position: absolute;
        content: "";
        height: 26px;
        width: 26px;
        left: 4px;
        bottom: 4px;
        background-color: white;
        transition: .4s;
        border-radius: 50%;
    }
    input:checked + .slider {
        background-color: #667eea;
    }
    input:checked + .slider:before {
        transform: translateX(26px);
    }
    #oncall-dialog input:hover {
        border-color: #667eea;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
    }
    #oncall-dialog button:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0,0,0,0.2);
    }
    #close-oncall-dialog:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
    }
    .manual-override-section > div:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0,0,0,0.1);
    }
`;
document.head.appendChild(style);
// Create backdrop
const backdrop = document.createElement('div');
backdrop.className = 'modal-backdrop';
backdrop.onclick = () => {
    backdrop.classList.remove('show');
    dialog.style.opacity = '0';
    dialog.style.transform = 'translateX(-50%) translateY(-20px)';
    setTimeout(() => {
        backdrop.remove();
        dialog.remove();
    }, 300);
};

document.body.appendChild(backdrop);
document.body.appendChild(dialog);

// Animate in
setTimeout(() => {
    backdrop.classList.add('show');
    dialog.style.opacity = '1';
    dialog.style.transform = 'translateX(-50%) translateY(0)';
}, 10);

// Create state tracker
const dialogState = {
    isOverrideEnabled: false
};

// Get elements
const toggleSwitch = document.getElementById("manual-override-toggle");
const overrideSection = document.getElementById("manual-override-section");

console.log("Initial elements state:", {
    toggleSwitch: toggleSwitch,
    overrideSection: overrideSection,
    toggleChecked: toggleSwitch?.checked,
    dialogState: dialogState
});

// Toggle event handler with state tracking
toggleSwitch.addEventListener('change', (event) => {
    dialogState.isOverrideEnabled = event.target.checked;

    console.log("Toggle changed:", {
        checked: event.target.checked,
        previousDisplay: overrideSection.style.display,
        dialogState: dialogState
    });

    overrideSection.style.display = event.target.checked ? "block" : "none";

    console.log("After display change:", {
        newDisplay: overrideSection.style.display,
        sectionVisible: overrideSection.offsetParent !== null,
        dialogState: dialogState
    });
});

// Add time format validation
function validateTimeInput(input) {
    input.addEventListener('input', function() {
        let value = this.value;
        if (value.length === 2 && !value.includes(':')) {
            this.value = value + ':';
        }

        const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (value && !timeRegex.test(value)) {
            this.style.borderColor = 'red';
        } else {
            this.style.borderColor = '';
        }
    });
}

// Apply validation to all time inputs
['early-shift-start', 'early-shift-end', 'late-shift-start', 'late-shift-end'].forEach(id => {
    validateTimeInput(document.getElementById(id));
});

// Download button handler with state check
document.getElementById("download-oncall-sheet").addEventListener('click', () => {
    // Read toggle state directly from element
    const isOverrideEnabled = toggleSwitch.checked;

    console.log("Download button clicked, override enabled:", isOverrideEnabled);

    // Create config using actual toggle state
    const config = {
        startHour: 6,
        isOverrideEnabled: isOverrideEnabled
    };

    // If override is enabled, collect the time values
    if (isOverrideEnabled) {
        config.overrideValues = {
            earlyShift: {
                start: document.getElementById('early-shift-start').value || '02:30',
                end: document.getElementById('early-shift-end').value || '13:00'
            },
            lateShift: {
                start: document.getElementById('late-shift-start').value || '13:00',
                end: document.getElementById('late-shift-end').value || '22:00'
            }
        };
    }

    console.log("Generated config:", config);

    generateOnCallSheetFromAPI(
        window.oncallScheduleData,
        window.punchData,
        document.getElementById("oncall-monthSelect").value,
        config
    );
});

// Close dialog handler
document.getElementById("close-oncall-dialog").onclick = () => {
    backdrop.classList.remove('show');
    dialog.style.opacity = '0';
    dialog.style.transform = 'translateX(-50%) translateY(-20px)';
    setTimeout(() => {
        backdrop.remove();
        dialog.remove();
    }, 300);
};

// Add hover effects to manual override cards
const overrideCards = dialog.querySelectorAll('#manual-override-section > div > div');
overrideCards.forEach(card => {
    card.classList.add('manual-override-section');
});

// Set initial month value
document.getElementById("oncall-monthSelect").value = new Date().toISOString().slice(0, 7);

// Fetch button handler
document.getElementById("oncall-fetch").onclick = () => {
    const loginId = document.getElementById("oncall-loginId").value.trim();
    const month = document.getElementById("oncall-monthSelect").value;
    const debugDiv = document.getElementById("oncall-debug");
    const resultsDiv = document.getElementById("oncall-results");

    // Validation with animated feedback
    if (!loginId) {
        debugDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px; padding: 10px; background: linear-gradient(135deg, rgba(255, 193, 7, 0.1), rgba(255, 152, 0, 0.1)); border-radius: 12px; animation: shake 0.5s;">
                <span style="font-size: 24px; animation: wiggle 1s infinite;">⚠️</span>
                <span style="font-weight: 600; color: #f39c12;">Please enter your Login ID to continue</span>
            </div>
            <style>
                @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
                @keyframes wiggle { 0%, 100% { transform: rotate(0deg); } 25% { transform: rotate(-10deg); } 75% { transform: rotate(10deg); } }
            </style>
        `;
        document.getElementById("oncall-loginId").focus();
        return;
    }

    if (!month) {
        debugDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px; padding: 10px; background: linear-gradient(135deg, rgba(255, 193, 7, 0.1), rgba(255, 152, 0, 0.1)); border-radius: 12px; animation: shake 0.5s;">
                <span style="font-size: 24px; animation: wiggle 1s infinite;">📅</span>
                <span style="font-weight: 600; color: #f39c12;">Please select which month to view</span>
            </div>
        `;
        document.getElementById("oncall-monthSelect").focus();
        return;
    }

    fetchScheduleData(loginId, month, debugDiv, resultsDiv);
};
}

function generateOnCallSheetFromAPI(scheduleData, punchData, monthValue, config) {
// Set default configuration if not provided
const defaultConfig = {
date: new Date().toLocaleDateString(),
startHour: 6,
isOverrideEnabled: false,
overrideValues: 'disabled'
};

// Merge provided config with defaults
const finalConfig = { ...defaultConfig, ...config };

console.log("Processing with configuration:", finalConfig);

const [year, month] = monthValue.split('-').map(num => parseInt(num));

// Headers for the CSV
const rows = [
    ['Date', '', 'One Shift', '', 'Double Shift', '', 'Notes'],
    ['', '', 'From', 'To', 'From', 'To', ''],
    ['', '', '(00:00)', '(24:00)', '(00:00)', '(24:00)', '']
];

// Create a map of dates and their shifts
const dateShifts = new Map();
const lastDay = new Date(year, month, 0).getDate();

// Initialize all dates in the month
for (let day = 1; day <= lastDay; day++) {
    const date = new Date(year, month - 1, day);
    const dateStr = date.toLocaleDateString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric'
    });
    dateShifts.set(dateStr, {
        oneShiftFrom: '',
        oneShiftTo: '',
        doubleShiftFrom: '',
        doubleShiftTo: '',
        notes: ''
    });
}

// Process schedule data with multi-day shift handling
scheduleData.forEach(entry => {
    if (entry.oncallShift) {
        const startDate = new Date(entry.oncallShift.startDateTime);
        const endDate = new Date(entry.oncallShift.endDateTime);
        const startHour = startDate.getHours();

        // Calculate all dates for this shift
        const dates = [];
        let currentDate = new Date(startDate);
        const endHour = endDate.getHours();
        let isMidnightCrossing = startHour >= 13 && (endHour <= 6 || endDate.getDate() !== startDate.getDate());

        // Check for manual override midnight crossing
        if (finalConfig.isOverrideEnabled && finalConfig.overrideValues && startHour >= 13) {
            const lateEndTime = finalConfig.overrideValues.lateShift.end;
            const [endH] = lateEndTime.split(':').map(Number);
            if (endH <= 6) {
                isMidnightCrossing = true;
            }
        }

        if (isMidnightCrossing && endDate.getDate() !== startDate.getDate()) {
            // For midnight crossing shifts, add both start and end dates
            if (startDate.getMonth() === month - 1) dates.push(new Date(startDate));
            if (endDate.getMonth() === month - 1) dates.push(new Date(endDate));
        } else {
            while (currentDate <= endDate) {
                if (currentDate.getMonth() === month - 1) {
                    dates.push(new Date(currentDate));
                }
                currentDate.setDate(currentDate.getDate() + 1);
            }
        }

        // Process each date in the shift
        dates.forEach((date, index) => {
            const dateStr = date.toLocaleDateString('en-US', {
                month: 'numeric',
                day: 'numeric',
                year: 'numeric'
            });

            const shiftData = dateShifts.get(dateStr);
            if (!shiftData) return;

            const isStartDate = index === 0;
            const isEndDate = index === dates.length - 1;
            const isMultiDayShift = dates.length > 1;
            // isMidnightCrossing already calculated above

            if (finalConfig.isOverrideEnabled && finalConfig.overrideValues) {
                const overrides = finalConfig.overrideValues;
                if (isMultiDayShift) {
                    if (isStartDate) {
                        // First day: use override start time or API time
                        const startTime = startHour < 13 ? overrides.earlyShift.start : overrides.lateShift.start;
                        shiftData.oneShiftFrom = startTime;
                        shiftData.oneShiftTo = '24:00:00';
                    } else if (isEndDate) {
                        // Last day: 00:00 to punch in or API end time
                        const punches = getPunchesForDate(punchData, date);
                        shiftData.oneShiftFrom = '0:00';
                        if (punches.length > 0) {
                            const punchIn = new Date(punches[0].startDateTime);
                            const apiEnd = new Date(endDate);
                            const earlierTime = punchIn < apiEnd ? punchIn : apiEnd;
                            shiftData.oneShiftTo = formatTime(earlierTime);
                        } else {
                            shiftData.oneShiftTo = formatTime(endDate);
                        }
                    } else {
                        // Middle days: 00:00 to 24:00
                        shiftData.oneShiftFrom = '0:00';
                        shiftData.oneShiftTo = '24:00:00';
                    }
                } else if (isMidnightCrossing && isStartDate) {
                    // Late shift crossing midnight with override - use punch out time
                    const punches = getPunchesForDate(punchData, startDate);
                    if (punches.length > 0) {
                        const punchOut = new Date(punches[punches.length - 1].endDateTime);
                        shiftData.doubleShiftFrom = formatTime(punchOut);
                    } else {
                        shiftData.doubleShiftFrom = '15:00';
                        shiftData.notes = 'No punch time found in AtoZ';
                    }
                    shiftData.doubleShiftTo = '24:00';

                    const nextDate = new Date(startDate);
                    nextDate.setDate(nextDate.getDate() + 1);
                    const nextDateStr = nextDate.toLocaleDateString('en-US', {
                        month: 'numeric',
                        day: 'numeric',
                        year: 'numeric'
                    });
                    const nextShiftData = dateShifts.get(nextDateStr);
                    if (nextShiftData) {
                        nextShiftData.oneShiftFrom = '00:00';
                        nextShiftData.oneShiftTo = overrides.lateShift.end;
                    }
                } else {
                    // Single day shifts with override
                    const punches = getPunchesForDate(punchData, date);

                    if (startHour < 13) {
                        // Early shift with override
                        shiftData.oneShiftFrom = overrides.earlyShift.start;
                        if (punches.length > 0) {
                            const punchIn = new Date(punches[0].startDateTime);
                            shiftData.oneShiftTo = formatTime(punchIn);
                        } else {
                            shiftData.oneShiftTo = overrides.earlyShift.end;
                            shiftData.notes = 'No punch time found in AtoZ';
                        }
                    } else {
                        // Late shift with override
                        if (punches.length > 0) {
                            const punchOut = new Date(punches[punches.length - 1].endDateTime);
                            shiftData.oneShiftFrom = formatTime(punchOut);
                        } else {
                            shiftData.oneShiftFrom = overrides.lateShift.start;
                            shiftData.notes = 'No punch time found in AtoZ';
                        }
                        shiftData.oneShiftTo = overrides.lateShift.end;
                    }
                }
            } else {
                if (isMultiDayShift) {
                    if (isStartDate) {
                        const punches = getPunchesForDate(punchData, startDate);
                        if (punches.length > 0) {
                            const punchIn = new Date(punches[0].startDateTime);
                            shiftData.oneShiftFrom = formatTime(startDate);
                            shiftData.oneShiftTo = '24:00:00';
                        } else {
                            shiftData.oneShiftFrom = formatTime(startDate);
                            shiftData.oneShiftTo = '24:00:00';
                        }
                    } else if (isEndDate) {
                        const punches = getPunchesForDate(punchData, endDate);
                        if (punches.length > 0) {
                            const punchIn = new Date(punches[0].startDateTime);
                            const oncallEnd = new Date(endDate);
                            const earlierTime = punchIn < oncallEnd ? punchIn : oncallEnd;
                            shiftData.oneShiftFrom = '0:00';
                            shiftData.oneShiftTo = formatTime(earlierTime) + ':00';
                        } else {
                            shiftData.oneShiftFrom = '0:00';
                            shiftData.oneShiftTo = formatTime(endDate) + ':00';
                        }
                    } else {
                        shiftData.oneShiftFrom = '0:00';
                        shiftData.oneShiftTo = '24:00:00';
                    }
                } else if (isMidnightCrossing && isStartDate) {
                    // Late shift crossing midnight - use punch times
                    const punches = getPunchesForDate(punchData, startDate);
                    if (punches.length > 0) {
                        const punchOut = new Date(punches[punches.length - 1].endDateTime);
                        shiftData.doubleShiftFrom = formatTime(punchOut);
                    } else {
                        shiftData.doubleShiftFrom = '15:00';
                        shiftData.notes = 'No punch time found in AtoZ';
                    }
                    shiftData.doubleShiftTo = '24:00';

                    const nextDate = new Date(startDate);
                    nextDate.setDate(nextDate.getDate() + 1);
                    const nextDateStr = nextDate.toLocaleDateString('en-US', {
                        month: 'numeric',
                        day: 'numeric',
                        year: 'numeric'
                    });
                    const nextShiftData = dateShifts.get(nextDateStr);
                    if (nextShiftData) {
                        nextShiftData.oneShiftFrom = '00:00';
                        nextShiftData.oneShiftTo = formatTime(endDate);
                    }
                } else {
                    const punches = getPunchesForDate(punchData, startDate);
                    if (startHour >= 13) {
                        if (punches.length > 0) {
                            const punchOut = new Date(punches[punches.length - 1].endDateTime);
                            shiftData.oneShiftFrom = formatTime(punchOut);
                        } else {
                            shiftData.oneShiftFrom = '15:00';
                            shiftData.notes = 'No punch time found in AtoZ';
                        }
                        shiftData.oneShiftTo = formatTime(endDate);
                    } else {
                        shiftData.oneShiftFrom = formatTime(startDate);
                        if (punches.length > 0) {
                            const punchIn = new Date(punches[0].startDateTime);
                            shiftData.oneShiftTo = formatTime(punchIn);
                        } else {
                            shiftData.oneShiftTo = formatTime(endDate);
                            shiftData.notes = 'No punch time found in AtoZ';
                        }
                    }
                }
            }
        });
    }
});

// Create rows in chronological order
const sortedDates = Array.from(dateShifts.keys()).sort((a, b) => new Date(a) - new Date(b));
sortedDates.forEach(dateStr => {
    const shiftData = dateShifts.get(dateStr);
    rows.push([
        dateStr,
        '',
        shiftData.oneShiftFrom,
        shiftData.oneShiftTo,
        shiftData.doubleShiftFrom,
        shiftData.doubleShiftTo,
        shiftData.notes
    ]);
});

// Convert to TSV and download
const tsvContent = rows.map(row => row.join('\t')).join('\n');
const blob = new Blob([tsvContent], { type: 'text/tab-separated-values;charset=utf-8' });
const url = URL.createObjectURL(blob);
const link = document.createElement('a');
link.setAttribute('href', url);
link.setAttribute('download', `Oncall_allowance_sheet_${monthValue}.xls`);
document.body.appendChild(link);
link.click();
document.body.removeChild(link);
}

async function fetchScheduleData(loginId, monthValue, debugDiv, resultsDiv) {
const loadingMessages = [
    { emoji: '🚀', text: 'Starting fetch process...', progress: 10 },
    { emoji: '📅', text: 'Setting up date range...', progress: 20 },
    { emoji: '🔍', text: 'Searching for your teams...', progress: 40 },
    { emoji: '⚡', text: 'Found teams! Fetching schedules...', progress: 60 },
    { emoji: '📊', text: 'Processing data...', progress: 80 },
    { emoji: '✨', text: 'Almost done...', progress: 95 }
];

let messageIndex = 0;
let progressInterval;
let messageTimeout;
let isProcessing = true;

const updateProgress = (targetProgress, currentMessage) => {
    if (!isProcessing) return;

    let currentProgress = messageIndex > 0 ? loadingMessages[messageIndex - 1].progress : 0;
    const increment = (targetProgress - currentProgress) / 20;

    progressInterval = setInterval(() => {
        if (!isProcessing) {
            clearInterval(progressInterval);
            return;
        }

        currentProgress += increment;
        if (currentProgress >= targetProgress) {
            currentProgress = targetProgress;
            clearInterval(progressInterval);
        }

        // Update message and emoji for each step, but preserve progress elements
        const existingProgressFill = document.getElementById('progress-fill');
        const existingProgressText = document.getElementById('progress-text');

        debugDiv.innerHTML = `
            <div style="padding: 15px; background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1)); border-radius: 12px; animation: pulse 2s infinite;">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px; min-height: 40px;">
                    <span id="debug-emoji" style="font-size: 24px; animation: debugBounce 1s infinite; display: inline-block; margin: 10px 0;">${currentMessage.emoji}</span>
                    <span id="debug-text" style="font-weight: 500; color: #4a5568;">${currentMessage.text}</span>
                </div>
                <div style="background: rgba(255,255,255,0.3); border-radius: 10px; height: 8px; overflow: hidden;">
                    <div id="progress-fill" style="background: linear-gradient(90deg, #667eea, #764ba2); height: 100%; width: ${currentProgress}%; transition: width 0.3s ease; border-radius: 10px;"></div>
                </div>
                <div id="progress-text" style="text-align: center; margin-top: 5px; font-size: 12px; color: #667eea; font-weight: 600;">${Math.round(currentProgress)}%</div>
            </div>
            <style>
                @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
                @keyframes debugBounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
            </style>
        `;

        // Update only progress during interval
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');
        if (progressFill && progressText) {
            progressFill.style.width = `${currentProgress}%`;
            progressText.textContent = `${Math.round(currentProgress)}%`;
        }

        // Also animate the results div icon with separate style
        resultsDiv.innerHTML = `<div style="text-align: center; padding: 30px 20px; color: #667eea; font-weight: 500;">
            <div style="min-height: 50px; display: flex; align-items: center; justify-content: center; margin-bottom: 10px;">
                <span style="font-size: 32px; animation: loadingBounce 1s infinite; display: inline-block;">🔄</span>
            </div>
            Loading your OnCall data...
            <style>
                @keyframes loadingBounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
            </style>
        </div>`;
    }, 50);
};

const showNextMessage = () => {
    if (messageIndex < loadingMessages.length && isProcessing) {
        const msg = loadingMessages[messageIndex];
        updateProgress(msg.progress, msg);
        messageIndex++;
        messageTimeout = setTimeout(showNextMessage, 1000);
    }
};

showNextMessage();
resultsDiv.innerHTML = `<div style="text-align: center; padding: 30px 20px; color: #667eea; font-weight: 500;">
    <div style="min-height: 50px; display: flex; align-items: center; justify-content: center; margin-bottom: 10px;">
        <span style="font-size: 32px; animation: initialBounce 1s infinite; display: inline-block;">🔄</span>
    </div>
    Loading your OnCall data...
    <style>
        @keyframes initialBounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
    </style>
</div>`;

try {
    const [year, month] = monthValue.split('-').map(num => parseInt(num));
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const lastDay = new Date(year, month, 0).getDate();
    const endDate = `${year}-${String(month).padStart(2, '0')}-${lastDay}`;

    const teamsResponse = await getUserTeams(loginId);

    if (!teamsResponse || teamsResponse.length === 0) {
        isProcessing = false;
        clearInterval(progressInterval);
        clearTimeout(messageTimeout);
        throw new Error('No teams found for this user');
    }

    const teamNames = teamsResponse.map(team => team.rawTeamName);
    const scheduleUrl = `https://oncall-api.corp.amazon.com/teams/${teamNames.join(',')}/schedules/detailed?memberFilterList=${loginId}&from=${startDate}&to=${endDate}&timeZone=Europe/Berlin`;

    const scheduleResponse = await fetchAPI(scheduleUrl);

    // Store schedule data and enable download button
    window.oncallScheduleData = scheduleResponse;
    const downloadButton = document.getElementById('download-oncall-sheet');
    downloadButton.disabled = false;

    let allData = {};

    scheduleResponse.forEach(entry => {
        if (entry.oncallShift && entry.shiftDetails) {
            const teamName = entry.shiftDetails.teamName;
            const shift = entry.oncallShift;

            if (shift.oncallMember && shift.oncallMember.includes(loginId)) {
                if (!allData[teamName]) {
                    allData[teamName] = [];
                }

                const isDuplicate = allData[teamName].some(existingShift =>
                    existingShift.startDateTime === shift.startDateTime &&
                    existingShift.endDateTime === shift.endDateTime
                );

                if (!isDuplicate) {
                    allData[teamName].push({
                        startDateTime: shift.startDateTime,
                        endDateTime: shift.endDateTime,
                        oncallMember: [loginId],
                        shiftType: shift.shiftType || 'regular'
                    });
                }
            }
        }
    });

    isProcessing = false;
    clearInterval(progressInterval);
    clearTimeout(messageTimeout);
    debugDiv.innerHTML = `
        <div style="padding: 15px; background: linear-gradient(135deg, rgba(39, 174, 96, 0.1), rgba(46, 125, 50, 0.1)); border-radius: 12px;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                <span style="font-size: 24px; animation: celebration 2s infinite;">🎉</span>
                <span style="font-weight: 600; color: #27ae60;">Success! Data loaded and calendar generated!</span>
            </div>
            <div style="background: rgba(255,255,255,0.3); border-radius: 10px; height: 8px; overflow: hidden;">
                <div style="background: linear-gradient(90deg, #27ae60, #2ecc71); height: 100%; width: 100%; border-radius: 10px;"></div>
            </div>
            <div style="text-align: center; margin-top: 5px; font-size: 12px; color: #27ae60; font-weight: 600;">100% Complete! 🚀</div>
        </div>
        <style>
            @keyframes celebration { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.2); } }
        </style>
    `;

    if (Object.keys(allData).length > 0) {
        let resultsHtml = `
            <div style="font-family: Arial;">
                <div style="display: flex; gap: 20px;">
                    <div style="flex: 1;">
                        ${generateCalendarView(allData, month, year)}
                    </div>
                </div>
            </div>
        `;
        resultsDiv.innerHTML = resultsHtml;
    } else {
        resultsDiv.innerHTML = 'No shifts found for the selected user and period';
        document.getElementById('download-oncall-sheet').disabled = true;
    }
} catch (error) {
    isProcessing = false;
    clearInterval(progressInterval);
    clearTimeout(messageTimeout);

    // Determine error type and show appropriate message
    let errorEmoji = '❌';
    let errorTitle = 'Oops! Something went wrong';
    let errorSuggestion = 'Please try again or check your connection';

    if (error.message.includes('teams')) {
        errorEmoji = '👥';
        errorTitle = 'No teams found';
        errorSuggestion = 'Make sure your Login ID is correct and you\'re part of an OnCall team';
    } else if (error.message.includes('Network')) {
        errorEmoji = '🌐';
        errorTitle = 'Connection issue';
        errorSuggestion = 'Check your internet connection and try again';
    } else if (error.message.includes('API')) {
        errorEmoji = '🔧';
        errorTitle = 'Service temporarily unavailable';
        errorSuggestion = 'The OnCall API might be down. Please try again later';
    }

    debugDiv.innerHTML = `
        <div style="padding: 15px; background: linear-gradient(135deg, rgba(231, 76, 60, 0.1), rgba(192, 57, 43, 0.1)); border-radius: 12px; animation: shake 0.5s;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                <span style="font-size: 24px; animation: wiggle 1s infinite;">${errorEmoji}</span>
                <span style="font-weight: 600; color: #e74c3c;">${errorTitle}</span>
            </div>
            <div style="background: rgba(255,255,255,0.3); border-radius: 10px; height: 8px; overflow: hidden;">
                <div style="background: linear-gradient(90deg, #e74c3c, #c0392b); height: 100%; width: 100%; border-radius: 10px;"></div>
            </div>
            <div style="text-align: center; margin-top: 8px; font-size: 12px; color: #e74c3c; font-weight: 500;">${errorSuggestion}</div>
        </div>
        <style>
            @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
            @keyframes wiggle { 0%, 100% { transform: rotate(0deg); } 25% { transform: rotate(-10deg); } 75% { transform: rotate(10deg); } }
        </style>
    `;

    resultsDiv.innerHTML = `
        <div style="text-align: center; padding: 20px; color: #e74c3c; font-weight: 500;">
            <div style="font-size: 48px; margin-bottom: 10px;">😅</div>
            <div>Don't worry, these things happen!</div>
            <small style="color: #666;">Check the info above and give it another try</small>
        </div>`;
    document.getElementById('download-oncall-sheet').disabled = true;
}
}

function injectOnCallButton() {
const panel = document.querySelector(".combined-panel .panel-content");
if (!panel || document.getElementById("oncall-show-btn")) return;
const btn = document.createElement("button");
btn.id = "oncall-show-btn";
btn.className = "action-button";
btn.textContent = "📋 View My OnCall Schedule";
btn.onclick = injectOnCallDialog;
panel.appendChild(btn);
}
// Add this at the top of your script, right after 'use strict'
if (document.readyState === 'loading') {
document.addEventListener('DOMContentLoaded', initialize);
} else {
initialize();
}
function generateCalendarView(allData, month, year) {
const firstDay = new Date(year, month - 1, 1);
const lastDay = new Date(year, month, 0);
const daysInMonth = lastDay.getDate();

    let calendarHtml = `
        <div style="margin-bottom: 30px; background: linear-gradient(135deg, rgba(255,255,255,0.9), rgba(248,250,252,0.9)); border-radius: 20px; padding: 25px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); backdrop-filter: blur(10px);">
            <h4 style="text-align: center; margin-bottom: 25px; font-family: 'Inter', sans-serif; font-weight: 700; font-size: 24px; color: #2d3748;">📅 ${new Date(year, month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}</h4>
            <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px; margin-bottom: 8px;">
                <div style="text-align: center; font-weight: 600; padding: 12px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 12px; font-family: 'Inter', sans-serif;">Mon</div>
                <div style="text-align: center; font-weight: 600; padding: 12px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 12px; font-family: 'Inter', sans-serif;">Tue</div>
                <div style="text-align: center; font-weight: 600; padding: 12px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 12px; font-family: 'Inter', sans-serif;">Wed</div>
                <div style="text-align: center; font-weight: 600; padding: 12px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 12px; font-family: 'Inter', sans-serif;">Thu</div>
                <div style="text-align: center; font-weight: 600; padding: 12px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 12px; font-family: 'Inter', sans-serif;">Fri</div>
                <div style="text-align: center; font-weight: 600; padding: 12px; background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%); color: white; border-radius: 12px; font-family: 'Inter', sans-serif;">Sat</div>
                <div style="text-align: center; font-weight: 600; padding: 12px; background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%); color: white; border-radius: 12px; font-family: 'Inter', sans-serif;">Sun</div>
            </div>
            <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px;">
    `;

    let firstDayOfWeek = firstDay.getDay() || 7;
    for (let i = 1; i < firstDayOfWeek; i++) {
        calendarHtml += `<div style="padding: 5px; background: #f5f5f5; min-height: 100px;"></div>`;
    }

    function formatTime(dateTimeStr) {
        return new Date(dateTimeStr).toLocaleTimeString('de-DE', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            timeZone: 'Europe/Berlin'
        });
    }

    function getDateKey(date) {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    }

    let shiftsByDate = {};
    Object.entries(allData).forEach(([teamName, shifts]) => {
        shifts.forEach(shift => {
            const startDate = new Date(shift.startDateTime);
            const endDate = new Date(shift.endDateTime);

            // Calculate dates for the shift
            const dates = [];
            let currentDate = new Date(startDate);

            // Add all dates between start and end (inclusive)
            while (currentDate <= endDate) {
                if (currentDate.getMonth() === month - 1) {
                    dates.push(new Date(currentDate));
                }
                currentDate.setDate(currentDate.getDate() + 1);
            }

            // Process each date
            dates.forEach((date, index) => {
                const dateKey = getDateKey(date);
                const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                const isMultiDayShift = dates.length > 1;

                // Skip single-day shifts on weekends
                if (isWeekend && !isMultiDayShift) return;

                if (!shiftsByDate[dateKey]) {
                    shiftsByDate[dateKey] = [];
                }

                let timeDisplay;
                const isStartDate = index === 0;
                const isEndDate = index === dates.length - 1;

                if (dates.length === 1) {
                    // Single day shift
                    timeDisplay = `${formatTime(startDate)} → ${formatTime(endDate)}`;
                } else if (isStartDate) {
                    // First day of multi-day shift
                    timeDisplay = `${formatTime(startDate)} → 24:00`;
                } else if (isEndDate) {
                    // Last day of multi-day shift
                    timeDisplay = `00:00 → ${formatTime(endDate)}`;
                } else {
                    // Middle days of multi-day shift
                    timeDisplay = '00:00 → 24:00';
                }

                shiftsByDate[dateKey].push({
                    ...shift,
                    teamName,
                    isMultiDay: isMultiDayShift,
                    displayTime: timeDisplay
                });
            });
        });
    });

    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month - 1, day);
        const dateKey = getDateKey(date);
        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
        const shiftsForDay = shiftsByDate[dateKey] || [];

        let consolidatedShifts = {};
        shiftsForDay.forEach(shift => {
            const shiftKey = `${shift.displayTime}`;
            if (!consolidatedShifts[shiftKey]) {
                consolidatedShifts[shiftKey] = {
                    time: shift.displayTime,
                    teams: [shift.teamName],
                    isMultiDay: shift.isMultiDay
                };
            } else if (!consolidatedShifts[shiftKey].teams.includes(shift.teamName)) {
                consolidatedShifts[shiftKey].teams.push(shift.teamName);
            }
        });

        calendarHtml += `
            <div style="padding: 12px; background: ${isWeekend ? 'linear-gradient(135deg, rgba(231, 76, 60, 0.05), rgba(192, 57, 43, 0.05))' : 'rgba(255,255,255,0.8)'};
                        min-height: 120px; border-radius: 12px; border: 1px solid ${isWeekend ? 'rgba(231, 76, 60, 0.2)' : 'rgba(226, 232, 240, 0.5)'}; overflow-y: auto; transition: all 0.3s ease;">
                <div style="font-weight: 700; margin-bottom: 8px; color: ${isWeekend ? '#e74c3c' : '#2d3748'}; font-family: 'Inter', sans-serif; font-size: 16px;">
                    ${day}
                </div>
                ${Object.values(consolidatedShifts).map(shift => `
                    <div style="margin-bottom: 6px; padding: 8px;
                                background: ${shift.isMultiDay ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))' : (isWeekend ? 'rgba(231, 76, 60, 0.1)' : 'rgba(248, 250, 252, 0.8)')};
                                border-radius: 8px; font-size: 11px; font-family: 'Inter', sans-serif;
                                ${shift.isMultiDay ? 'border-left: 3px solid #667eea;' : 'border: 1px solid rgba(226, 232, 240, 0.5);'}
                                transition: all 0.2s ease;">
                        <div style="color: #667eea; font-weight: 600; margin-bottom: 2px;">${shift.teams.join(', ')}</div>
                        <div style="color: #4a5568; font-weight: 500;">${shift.time}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    calendarHtml += '</div></div></div>';
    return calendarHtml;
}
function initialize() {
// Wrap the initialization code in a try-catch block
try {
let attempts = 0;
const maxAttempts = 30;

    function tryInit() {
        attempts++;
        console.log(`Initialization attempt ${attempts}`);

        const table = document.querySelector('table[data-test-component="StencilTable"]');
        if (table) {
            console.log('Table found, starting script');
            processTable();
            return;
        }

        if (attempts < maxAttempts) {
            setTimeout(tryInit, 1000);
        } else {
            console.log('Max attempts reached, trying alternative initialization...');
            const altTable = document.querySelector('table');
            if (altTable) {
                console.log('Found table with alternative selector, starting script');
                processTable();
            } else {
                console.log('Script initialization failed completely');
            }
        }
    }

    setTimeout(tryInit, 2000);
} catch (error) {
    console.error('Error during initialization:', error);
}
}

// SECOND TEST 1: Adding more comments
// SECOND TEST 2: Verifying code updates work
// SECOND TEST 3: This is the second batch
// SECOND TEST 4: File modification test
// SECOND TEST 5: End of file comments
// UPDATED: Fixed Excel output with Notes column and continuous shift handling

})();