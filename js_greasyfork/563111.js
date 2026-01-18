// ==UserScript==
// @name        TorrentBD Torrents exporter
// @namespace   by Nabil (@JOYBOY)
// @match       https://www.torrentbd.com/account-details.php*
// @match       https://www.torrentbd.me/account-details.php*
// @match       https://www.torrentbd.net/account-details.php*
// @match       https://www.torrentbd.org/account-details.php*
// @match       https://www.torrentbd.com/download-history.php*
// @match       https://www.torrentbd.me/download-history.php*
// @match       https://www.torrentbd.net/download-history.php*
// @match       https://www.torrentbd.org/download-history.php*
// @grant       none
// @version     14.0
// @run-at      document-end
// @description Multi-page exporter with working clipboard, TXT save, and ZIP download
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/563111/TorrentBD%20Torrents%20exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/563111/TorrentBD%20Torrents%20exporter.meta.js
// ==/UserScript==

let k = 1;

const tableSelectors = [
    "table.torrents-table",
    "table.simple-data-table",
    "table.striped.boxed.notif-table"
];

let fields = [
    {
        name: "Name",
        id: "name",
        enabled: true,
        get: row => row.querySelector("a[href*='torrents-details.php']")?.innerText.trim() || "Unknown"
    },
    {
        name: "Size",
        id: "size",
        enabled: true,
        get: row => row.querySelectorAll("td")[5]?.innerText.trim() || "N/A"
    },
    {
        name: "Seeds",
        id: "seeds",
        enabled: true,
        get: row => row.querySelectorAll("td")[6]?.innerText.trim() || "0"
    },
    {
        name: "Leechers",
        id: "leechers",
        enabled: true,
        get: row => row.querySelectorAll("td")[7]?.innerText.trim() || "0"
    },
    {
        name: "Time",
        id: "time",
        enabled: true,
        get: row => {
            let spans = row.querySelectorAll("td span");
            return spans[1]?.innerText.trim() || "Unknown";
        }
    }
];

function extractFromCurrentPage() {
    let output = "";

    tableSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(table => {
            let rows = table.querySelectorAll("tbody tr");

            rows.forEach(row => {
                let linkElement = row.querySelector("a[href*='torrents-details.php?id=']");
                if (!linkElement) {
                    // Try download.php for download-history page
                    linkElement = row.querySelector("a[href*='download.php?id=']");
                    if (!linkElement) return;
                }

                let href = linkElement.getAttribute("href");
                let match = href.match(/id=(\d+)/);
                if (!match) return;

                let tid = match[1];

                let lines = [];

                let nameField = fields.find(f => f.id === "name");
                if (nameField && nameField.enabled) {
                    let name = nameField.get(row);
                    lines.push(`[${k}] ${name}`);
                }

                let details = [];

                fields.forEach(f => {
                    if (!f.enabled || f.id === "name") return;
                    details.push(`${f.name}: ${f.get(row)}`);
                });

                if (details.length) {
                    lines.push(details.join(" | "));
                }

                lines.push(`https://www.torrentbd.net/torrents-details.php?id=${tid}`);

                output += lines.join("\n") + "\n\n";

                k++;
            });
        });
    });

    return output;
}

function extractTorrentIDs() {
    let ids = [];

    tableSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(table => {
            let rows = table.querySelectorAll("tbody tr");

            rows.forEach(row => {
                let linkElement = row.querySelector("a[href*='torrents-details.php?id=']");
                let isDownloadPage = false;

                if (!linkElement) {
                    // Try download.php for download-history page
                    linkElement = row.querySelector("a[href*='download.php?id=']");
                    isDownloadPage = true;
                    if (!linkElement) return;
                }

                let href = linkElement.getAttribute("href");
                let match = href.match(/id=(\d+)/);
                if (match) {
                    let name = row.querySelector("a[href*='torrents-details.php'], a[href*='download.php']")?.innerText.trim() || `torrent_${match[1]}`;
                    ids.push({ id: match[1], name: name });
                }
            });
        });
    });

    return ids;
}

function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}

async function gatherAllPages() {
    k = 1;
    let result = "";

    let first = document.querySelector('li[title="Page 1"]');
    if (first) {
        first.click();
        await sleep(2000);
    }

    while (true) {
        result += extractFromCurrentPage();

        let next = document.querySelector('li[title="Next page"]');
        if (!next) break;

        next.click();
        await sleep(2000);
    }

    return result;
}

async function gatherAllTorrentIDs() {
    let allIds = [];

    let first = document.querySelector('li[title="Page 1"]');
    if (first) {
        first.click();
        await sleep(2000);
    }

    while (true) {
        allIds.push(...extractTorrentIDs());

        let next = document.querySelector('li[title="Next page"]');
        if (!next) break;

        next.click();
        await sleep(2000);
    }

    return allIds;
}

// ---------- LOAD JSZIP ----------

function loadJSZip() {
    return new Promise((resolve, reject) => {
        if (window.JSZip) {
            resolve(window.JSZip);
            return;
        }

        let script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
        script.onload = () => resolve(window.JSZip);
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// ---------- HELPER FUNCTIONS ----------

function getFilenameFromResponse(response) {
    let disposition = response.headers.get('Content-Disposition');
    if (disposition && disposition.includes('filename=')) {
        let matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(disposition);
        if (matches && matches[1]) {
            let filename = matches[1].replace(/['"]/g, '');
            // Decode if URL encoded
            try {
                filename = decodeURIComponent(filename);
            } catch (e) {
                // If decode fails, use as is
            }
            return filename;
        }
    }
    return null;
}

// ---------- NEW FUNCTIONS ----------

async function copyOutput() {
    let data = await gatherAllPages();

    try {
        await navigator.clipboard.writeText(data);
        showPopupWithText(data, "✓ Copied to clipboard automatically! You can also copy manually below:");
    } catch (e) {
        showPopupWithText(data, "Copy the text below:");
    }
}

function showPopupWithText(text, message) {
    // Create modal overlay
    let overlay = document.createElement("div");
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
    `;

    // Create modal box
    let modal = document.createElement("div");
    modal.style.cssText = `
        background: #2a2a2a;
        padding: 25px;
        border-radius: 8px;
        max-width: 600px;
        width: 90%;
        max-height: 80%;
        box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        border: 1px solid #3a3a3a;
    `;

    // Message
    let msg = document.createElement("div");
    msg.textContent = message;
    msg.style.cssText = `
        color: #28a745;
        margin-bottom: 15px;
        font-weight: bold;
        font-size: 14px;
    `;

    // Textarea
    let textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.cssText = `
        width: 100%;
        height: 300px;
        background: #1b1b1b;
        color: #e0e0e0;
        border: 1px solid #444;
        border-radius: 4px;
        padding: 10px;
        font-family: monospace;
        font-size: 12px;
        resize: vertical;
        margin-bottom: 15px;
    `;
    textarea.readOnly = true;

    // Close button
    let closeBtn = document.createElement("button");
    closeBtn.textContent = "Close";
    closeBtn.style.cssText = `
        background: #28a745;
        color: white;
        border: none;
        padding: 10px 24px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        transition: background 0.3s;
    `;
    closeBtn.onmouseover = () => closeBtn.style.background = "#218838";
    closeBtn.onmouseout = () => closeBtn.style.background = "#28a745";
    closeBtn.onclick = () => document.body.removeChild(overlay);

    modal.appendChild(msg);
    modal.appendChild(textarea);
    modal.appendChild(closeBtn);
    overlay.appendChild(modal);

    // Select text on click
    textarea.onclick = () => textarea.select();

    document.body.appendChild(overlay);

    // Auto-select text
    textarea.select();
}

async function saveAsTxt() {
    let data = await gatherAllPages();

    let blob = new Blob([data], { type: "text/plain" });

    let a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "torrents.txt";
    a.click();

    URL.revokeObjectURL(a.href);

    showToast("✓ File saved as torrents.txt", "#28a745");
}

async function downloadTorrentsAsZip() {
    try {
        showToast("Loading JSZip library...", "#17a2b8");
        let JSZip = await loadJSZip();

        showToast("Gathering torrent IDs from all pages...", "#17a2b8");
        let torrents = await gatherAllTorrentIDs();

        if (torrents.length === 0) {
            showToast("No torrents found!", "#dc3545");
            return;
        }

        showToast(`Downloading ${torrents.length} torrent files...`, "#17a2b8");

        let zip = new JSZip();
        let successCount = 0;
        let failCount = 0;

        for (let i = 0; i < torrents.length; i++) {
            let torrent = torrents[i];
            let downloadUrl = `https://www.torrentbd.net/download.php?id=${torrent.id}`;

            try {
                let response = await fetch(downloadUrl);
                if (response.ok) {
                    let blob = await response.blob();

                    // Get the actual filename from the server response
                    let filename = getFilenameFromResponse(response);

                    // If no filename from header, construct it with [TorrentBD] prefix
                    if (!filename) {
                        filename = `[TorrentBD]${sanitizeFilename(torrent.name)}.torrent`;
                    }

                    zip.file(filename, blob);
                    successCount++;
                } else {
                    failCount++;
                }
            } catch (e) {
                failCount++;
            }

            if ((i + 1) % 10 === 0) {
                showToast(`Progress: ${i + 1}/${torrents.length} processed...`, "#17a2b8");
            }

            // Small delay to avoid overwhelming the server
            await sleep(100);
        }

        showToast("Creating ZIP file...", "#17a2b8");
        let zipBlob = await zip.generateAsync({ type: "blob" });

        let a = document.createElement("a");
        a.href = URL.createObjectURL(zipBlob);
        a.download = "torrents.zip";
        a.click();

        URL.revokeObjectURL(a.href);

        showToast(`✓ Downloaded ${successCount} torrents (${failCount} failed)`, "#28a745");
    } catch (e) {
        showToast("Error: " + e.message, "#dc3545");
    }
}

function sanitizeFilename(name) {
    return name.replace(/[<>:"/\\|?*]/g, '_').substring(0, 150);
}

function showToast(message, color) {
    // Remove existing toast
    let existing = document.getElementById('torrent-export-toast');
    if (existing) existing.remove();

    let toast = document.createElement("div");
    toast.id = 'torrent-export-toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${color};
        color: white;
        padding: 15px 25px;
        border-radius: 6px;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        font-weight: 500;
        max-width: 400px;
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
        if (toast.parentNode) toast.remove();
    }, 4000);
}

// ---------- UI ----------

function buildUI() {
    // Try multiple container selectors for different pages
    let container = document.querySelector("#torrents") ||
                    document.querySelector(".card-panel.col.s12.overflow-x") ||
                    document.querySelector(".row");

    if (!container) {
        // Fallback: find the table and insert before it
        let table = document.querySelector("table.striped.boxed.notif-table");
        if (table) {
            container = table.parentElement;
        } else {
            return; // Can't find appropriate container
        }
    }

    let panel = document.createElement("div");
    panel.style.cssText = `
        text-align: center;
        margin: 15px 0;
        padding: 20px;
        background: #2a2a2a;
        border-radius: 8px;
        border: 1px solid #3a3a3a;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    `;

    // Toggle buttons section
    let toggleContainer = document.createElement("div");
    toggleContainer.style.cssText = `
        margin-bottom: 20px;
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        gap: 10px;
    `;

    fields.forEach(f => {
        let toggleBtn = document.createElement("button");
        toggleBtn.textContent = f.name;
        toggleBtn.dataset.fieldId = f.id;

        function updateButtonStyle() {
            if (f.enabled) {
                toggleBtn.style.cssText = `
                    background: #17a2b8;
                    color: white;
                    border: 2px solid #17a2b8;
                    padding: 8px 20px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 500;
                    transition: all 0.3s;
                    box-shadow: 0 2px 6px rgba(23,162,184,0.4);
                `;
            } else {
                toggleBtn.style.cssText = `
                    background: transparent;
                    color: #888;
                    border: 2px solid #444;
                    padding: 8px 20px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 500;
                    transition: all 0.3s;
                    box-shadow: none;
                `;
            }
        }

        updateButtonStyle();

        toggleBtn.onclick = () => {
            f.enabled = !f.enabled;
            updateButtonStyle();
        };

        toggleBtn.onmouseover = () => {
            if (f.enabled) {
                toggleBtn.style.background = "#138496";
                toggleBtn.style.transform = "translateY(-2px)";
                toggleBtn.style.boxShadow = "0 4px 12px rgba(23,162,184,0.5)";
            } else {
                toggleBtn.style.borderColor = "#666";
                toggleBtn.style.color = "#aaa";
            }
        };

        toggleBtn.onmouseout = () => {
            updateButtonStyle();
        };

        toggleContainer.appendChild(toggleBtn);
    });

    panel.appendChild(toggleContainer);

    // Buttons section
    let buttonContainer = document.createElement("div");
    buttonContainer.style.cssText = `
        display: flex;
        justify-content: center;
        gap: 12px;
        flex-wrap: wrap;
    `;

    // Copy button (now green)
    let copyBtn = document.createElement("button");
    copyBtn.textContent = "Copy";
    copyBtn.style.cssText = `
        background: #28a745;
        color: white;
        border: none;
        padding: 12px 28px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        transition: all 0.3s;
        box-shadow: 0 2px 6px rgba(40,167,69,0.3);
    `;
    copyBtn.onmouseover = () => {
        copyBtn.style.background = "#218838";
        copyBtn.style.transform = "translateY(-2px)";
        copyBtn.style.boxShadow = "0 4px 12px rgba(40,167,69,0.4)";
    };
    copyBtn.onmouseout = () => {
        copyBtn.style.background = "#28a745";
        copyBtn.style.transform = "translateY(0)";
        copyBtn.style.boxShadow = "0 2px 6px rgba(40,167,69,0.3)";
    };
    copyBtn.onclick = copyOutput;

    // Save as document button
    let txtBtn = document.createElement("button");
    txtBtn.textContent = "Save as document";
    txtBtn.style.cssText = `
        background: #28a745;
        color: white;
        border: none;
        padding: 12px 28px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        transition: all 0.3s;
        box-shadow: 0 2px 6px rgba(40,167,69,0.3);
    `;
    txtBtn.onmouseover = () => {
        txtBtn.style.background = "#218838";
        txtBtn.style.transform = "translateY(-2px)";
        txtBtn.style.boxShadow = "0 4px 12px rgba(40,167,69,0.4)";
    };
    txtBtn.onmouseout = () => {
        txtBtn.style.background = "#28a745";
        txtBtn.style.transform = "translateY(0)";
        txtBtn.style.boxShadow = "0 2px 6px rgba(40,167,69,0.3)";
    };
    txtBtn.onclick = saveAsTxt;

    // Download ZIP button
    let zipBtn = document.createElement("button");
    zipBtn.textContent = "Download Torrents (ZIP)";
    zipBtn.style.cssText = `
        background: #ffc107;
        color: #1b1b1b;
        border: none;
        padding: 12px 28px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        transition: all 0.3s;
        box-shadow: 0 2px 6px rgba(255,193,7,0.3);
    `;
    zipBtn.onmouseover = () => {
        zipBtn.style.background = "#e0a800";
        zipBtn.style.transform = "translateY(-2px)";
        zipBtn.style.boxShadow = "0 4px 12px rgba(255,193,7,0.4)";
    };
    zipBtn.onmouseout = () => {
        zipBtn.style.background = "#ffc107";
        zipBtn.style.transform = "translateY(0)";
        zipBtn.style.boxShadow = "0 2px 6px rgba(255,193,7,0.3)";
    };
    zipBtn.onclick = downloadTorrentsAsZip;

    buttonContainer.appendChild(copyBtn);
    buttonContainer.appendChild(txtBtn);
    buttonContainer.appendChild(zipBtn);
    panel.appendChild(buttonContainer);

    // Insert the panel at the beginning of the container
    if (container.firstChild) {
        container.insertBefore(panel, container.firstChild);
    } else {
        container.appendChild(panel);
    }
}

buildUI();
