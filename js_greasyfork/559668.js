// ==UserScript==
// @name         CloudLab SSH Config Generator
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Extract CloudLab node table and generate SSH config
// @author       Claude & MirageTurtle
// @match        https://www.cloudlab.us/status.php?uuid=*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/559668/CloudLab%20SSH%20Config%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/559668/CloudLab%20SSH%20Config%20Generator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add a button to trigger the export
    function addExportButton() {
        // Check if table exists
        const table = document.getElementById('listview_table');
        if (!table) return;

        // Check if button already exists
        if (document.getElementById('ssh-config-export-btn')) return;

        // Create button
        const button = document.createElement('button');
        button.id = 'ssh-config-export-btn';
        button.className = 'btn btn-success btn-xs';
        button.style.marginLeft = '10px';
        button.textContent = 'Export SSH Config';
        button.onclick = generateSSHConfig;

        // Find a good place to insert the button (next to other buttons)
        const refreshButton = document.getElementById('refresh_button');
        if (refreshButton) {
            refreshButton.parentNode.insertBefore(button, refreshButton.nextSibling);
        } else {
            // Fallback: insert at the top of the list view
            const listview = document.getElementById('listview');
            if (listview) {
                listview.insertBefore(button, listview.firstChild);
            }
        }
    }

    function generateSSHConfig() {
        const table = document.getElementById('listview_table');
        if (!table) {
            alert('Table not found!');
            return;
        }

        const tbody = table.querySelector('tbody');
        if (!tbody) {
            alert('Table body not found!');
            return;
        }

        const rows = tbody.querySelectorAll('tr');
        if (rows.length === 0) {
            alert('No data found in table!');
            return;
        }

        let configContent = '# CloudLab\n';
        configContent += 'host node*\n';
        configContent += '  user root\n';
        configContent += '  identityfile ~/.ssh/cloudlab.pub\n';
        configContent += '  IdentitiesOnly yes\n';
        configContent += '\n';

        // Extract data from each row
        rows.forEach(row => {
            const clientIdCell = row.querySelector('td[name="client_id"]');
            const sshUrlCell = row.querySelector('td[name="sshurl"]');

            if (clientIdCell && sshUrlCell) {
                const clientId = clientIdCell.textContent.trim();

                // Extract hostname from SSH URL
                // Format: ssh://user@c220g5-111024.wisc.cloudlab.us:22/
                // or: ssh user@c220g5-111024.wisc.cloudlab.us
                const sshLink = sshUrlCell.querySelector('a');
                let hostname = '';

                if (sshLink) {
                    const href = sshLink.getAttribute('href');
                    const text = sshLink.textContent.trim();

                    // Try to extract from href (ssh://user@hostname:port/)
                    if (href && href.startsWith('ssh://')) {
                        const match = href.match(/ssh:\/\/[^@]+@([^:\/]+)/);
                        if (match) {
                            hostname = match[1];
                        }
                    }

                    // Fallback: extract from text (ssh user@hostname)
                    if (!hostname && text) {
                        const match = text.match(/ssh\s+[^@]+@(\S+)/);
                        if (match) {
                            hostname = match[1];
                        }
                    }
                }

                // Another fallback: try to get from the node_id cell
                if (!hostname) {
                    const nodeIdCell = row.querySelector('td[name="node_id"] a');
                    if (nodeIdCell) {
                        hostname = nodeIdCell.textContent.trim();
                    }
                }

                if (hostname) {
                    configContent += `host ${clientId}\n`;
                    configContent += `  hostname ${hostname}\n`;
                }
            }
        });

        // Download the config file
        downloadFile('ssh_config_cloudlab', configContent);
    }

    function downloadFile(filename, content) {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }

    // Initialize: add button when page loads
    function init() {
        // Wait for the table to be loaded
        const observer = new MutationObserver((mutations, obs) => {
            const table = document.getElementById('listview_table');
            if (table) {
                addExportButton();
                // Don't disconnect observer in case table is reloaded
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Try to add button immediately if table already exists
        addExportButton();
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Also add button when tab is switched
    document.addEventListener('click', function(e) {
        if (e.target && e.target.id === 'show_listview_tab') {
            setTimeout(addExportButton, 500);
        }
    });

})();