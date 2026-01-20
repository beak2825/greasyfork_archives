// ==UserScript==
// @name         Umbraco Cloud Deployment Viewer
// @namespace    https://github.com/skttl/umbraco-userscripts
// @version      1.0.0
// @description  Comprehensive deployment monitoring interface for Umbraco Cloud with real-time logs and status tracking
// @author       skttl
// @homepage     https://github.com/skttl/umbraco-userscripts
// @supportURL   https://github.com/skttl/umbraco-userscripts/issues
// @license      MIT
// @include      /^https?:\/\/.*\.scm\..*\.umbraco\.io\/.*$/
// @icon         https://raw.githubusercontent.com/skttl/umbraco-userscripts/main/screenshots/deployment_status.png
// @grant        none
// @run-at       document-end
// @compatible   chrome Tampermonkey
// @compatible   firefox Tampermonkey
// @compatible   edge Tampermonkey
// @downloadURL https://update.greasyfork.org/scripts/563340/Umbraco%20Cloud%20Deployment%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/563340/Umbraco%20Cloud%20Deployment%20Viewer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isViewerActive = false;
    let logRefreshInterval = null;
    let currentDeploymentId = null;

    function addNavbarLink() {
        const navbar = document.querySelector('body > .navbar:first-child');
        if (!navbar) return;

        const navList = navbar.querySelector('.nav.navbar-nav');
        if (!navList || document.getElementById('deployment-nav-link')) return;

        const li = document.createElement('li');
        li.id = 'deployment-nav-link';

        const link = document.createElement('a');
        link.href = '#';
        link.textContent = 'Deployments';
        link.onclick = (e) => {
            e.preventDefault();
            toggleDeploymentViewer();
        };

        li.appendChild(link);
        navList.appendChild(li);
    }

    function toggleDeploymentViewer(skipHistory = false) {
        if (isViewerActive) {
            hideDeploymentViewer(skipHistory);
        } else {
            showDeploymentViewer(skipHistory);
        }
    }

    function showDeploymentViewer(skipHistory = false) {
        const navbar = document.querySelector('body > .navbar:first-child');
        if (!navbar) return;

        const navList = navbar.querySelector('.nav.navbar-nav');
        if (navList) {
            navList.querySelectorAll('li').forEach(li => li.classList.remove('active'));
        }

        window.dispatchEvent(new CustomEvent('viewer-change', { detail: { viewer: 'deployments' } }));

        const eventlogPanel = document.getElementById('eventlog-viewer-panel');
        if (eventlogPanel) {
            eventlogPanel.style.display = 'none';
        }

        let nextSibling = navbar.nextElementSibling;
        while (nextSibling) {
            if (nextSibling.id !== 'deployment-viewer-panel' && nextSibling.id !== 'eventlog-viewer-panel') {
                nextSibling.style.display = 'none';
            }
            nextSibling = nextSibling.nextElementSibling;
        }

        if (!document.getElementById('deployment-viewer-panel')) {
            createViewerPanel();
            fetchDeploymentData();
        } else {
            document.getElementById('deployment-viewer-panel').style.display = 'block';
        }

        isViewerActive = true;

        if (!skipHistory) {
            history.pushState({ view: 'deployments' }, 'Deployments', window.location.pathname + '?deployments');
        }
        
        updateNavbarState();
    }

    function hideDeploymentViewer(skipHistory = false) {
        const navbar = document.querySelector('body > .navbar:first-child');
        if (!navbar) return;

        stopLogRefresh();

        let nextSibling = navbar.nextElementSibling;
        while (nextSibling) {
            if (nextSibling.id !== 'deployment-viewer-panel') {
                nextSibling.style.display = '';
            }
            nextSibling = nextSibling.nextElementSibling;
        }

        const panel = document.getElementById('deployment-viewer-panel');
        if (panel) {
            panel.style.display = 'none';
        }

        isViewerActive = false;

        if (!skipHistory) {
            history.pushState({ view: null }, '', window.location.pathname);
        }
        
        updateNavbarState();
    }

    function createViewerPanel() {
        const panel = document.createElement('div');
        panel.id = 'deployment-viewer-panel';
        panel.className = 'container';
        panel.style.marginTop = '20px';

        const header = document.createElement('div');
        header.className = 'page-header';
        header.innerHTML = '<h1>Deployment Status</h1>';
        panel.appendChild(header);

        const btnGroup = document.createElement('div');
        btnGroup.className = 'btn-group';
        btnGroup.style.marginBottom = '20px';

        const refreshBtn = document.createElement('button');
        refreshBtn.className = 'btn btn-primary';
        refreshBtn.textContent = 'Refresh';
        refreshBtn.onclick = fetchDeploymentData;
        btnGroup.appendChild(refreshBtn);

        const triggerBtn = document.createElement('button');
        triggerBtn.className = 'btn btn-success';
        triggerBtn.textContent = 'Trigger New Deployment';
        triggerBtn.style.marginLeft = '10px';
        triggerBtn.onclick = triggerNewDeployment;
        btnGroup.appendChild(triggerBtn);

        panel.appendChild(btnGroup);

        const content = document.createElement('div');
        content.id = 'deployment-content';
        panel.appendChild(content);

        document.body.appendChild(panel);
    }

    function getStatusBadge(status) {
        const statusMap = {
            'Pending': { class: 'default' },
            'Building': { class: 'info' },
            'Deploying': { class: 'info' },
            'Failed': { class: 'danger' },
            'Success': { class: 'success' },
            'Loading': { class: 'default' }
        };
        const info = statusMap[status] || { class: 'default' };
        return `<span class="label label-${info.class}">${status}</span>`;
    }

    function getStatusText(numericStatus) {
        const statusMap = {
            0: 'Pending',
            1: 'Building',
            2: 'Deploying',
            3: 'Failed',
            4: 'Success'
        };
        return statusMap[numericStatus] || 'Unknown';
    }

    async function fetchDeploymentStatus(id) {
        try {
            const res = await fetch(`/api/vfs/site/deployments/${id}/status.xml`);
            if (!res.ok) return null;
            const text = await res.text();
            const parser = new DOMParser();
            const xml = parser.parseFromString(text, 'application/xml');
            
            return {
                id: xml.querySelector('id')?.textContent || id,
                status: xml.querySelector('status')?.textContent || 'Unknown',
                author: xml.querySelector('author')?.textContent || '',
                authorEmail: xml.querySelector('authorEmail')?.textContent || '',
                message: xml.querySelector('message')?.textContent || '',
                deployer: xml.querySelector('deployer')?.textContent || '',
                receivedTime: xml.querySelector('receivedTime')?.textContent || '',
                startTime: xml.querySelector('startTime')?.textContent || '',
                endTime: xml.querySelector('endTime')?.textContent || '',
                lastSuccessEndTime: xml.querySelector('lastSuccessEndTime')?.textContent || '',
                complete: xml.querySelector('complete')?.textContent || '',
                projectType: xml.querySelector('project_type')?.textContent || ''
            };
        } catch (err) {
            return null;
        }
    }

    function showDeploymentDetails(deployment, activeId) {
        const modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
        modal.style.zIndex = '10000';
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
        modal.onclick = (e) => {
            if (e.target === modal) modal.remove();
        };

        const isActive = deployment.id === activeId;
        const duration = deployment.startTime && deployment.endTime 
            ? formatDuration(deployment.startTime, deployment.endTime)
            : 'N/A';

        const dialog = document.createElement('div');
        dialog.className = 'panel panel-default';
        dialog.style.width = '80%';
        dialog.style.maxWidth = '800px';
        dialog.style.maxHeight = '90%';
        dialog.style.overflow = 'auto';
        dialog.style.margin = '0';

        dialog.innerHTML = `
            <div class="panel-heading">
                <h3 class="panel-title">
                    Deployment Details
                    ${isActive ? '<span class="label label-warning" style="margin-left: 10px;">ACTIVE</span>' : ''}
                    <button type="button" class="close" style="margin-top: -2px;">&times;</button>
                </h3>
            </div>
            <div class="panel-body">
                <div class="row">
                    <div class="col-md-6">
                        <p><strong>Status:</strong> ${getStatusBadge(deployment.status)}</p>
                        <p><strong>ID:</strong> <code>${deployment.id}</code></p>
                        <p><strong>Author:</strong> ${deployment.author} (${deployment.authorEmail})</p>
                        <p><strong>Message:</strong> ${deployment.message}</p>
                        <p><strong>Complete:</strong> ${deployment.complete}</p>
                        <p id="modal-files-count-${deployment.id}"><strong>Files:</strong> <span style="color: #999;">Loading...</span></p>
                    </div>
                    <div class="col-md-6">
                        <p><strong>Received:</strong> ${deployment.receivedTime ? new Date(deployment.receivedTime).toLocaleString() : 'N/A'}</p>
                        <p><strong>Started:</strong> ${deployment.startTime ? new Date(deployment.startTime).toLocaleString() : 'N/A'}</p>
                        <p><strong>Completed:</strong> ${deployment.endTime ? new Date(deployment.endTime).toLocaleString() : 'N/A'}</p>
                        <p><strong>Duration:</strong> ${duration}</p>
                        <p><strong>Project Type:</strong> ${deployment.projectType}</p>
                        <p><strong>Deployer:</strong> ${deployment.deployer}</p>
                    </div>
                </div>
                <hr>
                <h4>Deployment Log</h4>
                <div id="modal-log-${deployment.id}" style="max-height: 300px; overflow-y: auto; background-color: #f5f5f5; padding: 10px; font-family: Consolas, Monaco, monospace; font-size: 12px; border: 1px solid #ddd;">
                    <div style="color: #999;">Loading log...</div>
                </div>
            </div>
        `;

        const closeBtn = dialog.querySelector('.close');
        closeBtn.onclick = () => modal.remove();

        fetchDeploymentManifest(deployment.id).then(files => {
            const filesCountEl = document.getElementById(`modal-files-count-${deployment.id}`);
            if (filesCountEl && files) {
                filesCountEl.innerHTML = `<strong>Files:</strong> <a href="#" style="color: #337ab7;">${files.length} files</a>`;
                filesCountEl.querySelector('a').onclick = (e) => {
                    e.preventDefault();
                    modal.remove();
                    showManifestModal(files, deployment.id);
                };
            } else if (filesCountEl) {
                filesCountEl.innerHTML = '<strong>Files:</strong> <span style="color: #999;">N/A</span>';
            }
        });

        fetchDeploymentLog(deployment.id).then(logText => {
            const logContainer = document.getElementById(`modal-log-${deployment.id}`);
            if (logContainer && logText) {
                logContainer.innerHTML = '';
                const lines = logText.split('\n').filter(line => line.trim());
                
                lines.forEach(line => {
                    const parsed = parseLogLine(line);
                    if (!parsed) return;

                    const logLine = document.createElement('div');
                    logLine.style.padding = '2px 0';
                    logLine.style.borderBottom = '1px solid #e0e0e0';
                    
                    if (parsed.isIndented) {
                        logLine.style.paddingLeft = '40px';
                        logLine.style.backgroundColor = '#fafafa';
                    }

                    const time = new Date(parsed.timestamp);
                    const timeStr = time.toLocaleTimeString();

                    const timeSpan = document.createElement('span');
                    timeSpan.style.color = '#999';
                    timeSpan.style.marginRight = '10px';
                    timeSpan.textContent = timeStr;

                    const messageSpan = document.createElement('span');
                    messageSpan.textContent = parsed.message;
                    
                    if (parsed.message.toLowerCase().includes('error')) {
                        messageSpan.style.color = '#d9534f';
                        messageSpan.style.fontWeight = 'bold';
                    } else if (parsed.message.toLowerCase().includes('warning')) {
                        messageSpan.style.color = '#f0ad4e';
                    } else if (parsed.message.toLowerCase().includes('success')) {
                        messageSpan.style.color = '#5cb85c';
                        messageSpan.style.fontWeight = 'bold';
                    }

                    logLine.appendChild(timeSpan);
                    logLine.appendChild(messageSpan);
                    logContainer.appendChild(logLine);
                });

                logContainer.scrollTop = logContainer.scrollHeight;
            } else if (logContainer) {
                logContainer.innerHTML = '<div style="color: #999;">No log available</div>';
            }
        });

        modal.appendChild(dialog);
        document.body.appendChild(modal);
    }

    function formatDuration(start, end) {
        const startTime = new Date(start);
        const endTime = new Date(end);
        const duration = (endTime - startTime) / 1000;
        
        if (duration < 60) return `${Math.round(duration)}s`;
        if (duration < 3600) return `${Math.floor(duration / 60)}m ${Math.round(duration % 60)}s`;
        return `${Math.floor(duration / 3600)}h ${Math.floor((duration % 3600) / 60)}m`;
    }

    function renderLatestDeployment(statusData, activeId) {
        const isActive = statusData.id === activeId;

        const panel = document.createElement('div');
        const panelClass = statusData.status === 'Success' ? 'success' : statusData.status === 'Failed' ? 'danger' : 'info';
        panel.className = `panel panel-${panelClass}`;
        panel.style.marginBottom = '20px';

        const isValidTimeRange = statusData.startTime && statusData.endTime && 
                                 new Date(statusData.endTime) >= new Date(statusData.startTime);
        
        const duration = isValidTimeRange 
            ? formatDuration(statusData.startTime, statusData.endTime)
            : 'N/A';
        
        const completedTime = isValidTimeRange 
            ? new Date(statusData.endTime).toLocaleString()
            : 'N/A';

        panel.innerHTML = `
            <div class="panel-heading">
                <h3 class="panel-title">
                    Latest Deployment
                    ${isActive ? '<span class="label label-warning" style="margin-left: 10px;">ACTIVE</span>' : ''}
                </h3>
            </div>
            <div class="panel-body">
                <div class="row">
                    <div class="col-md-6">
                        <p><strong>Status:</strong> ${getStatusBadge(statusData.status)}</p>
                        <p><strong>ID:</strong> <code>${statusData.id}</code></p>
                        <p><strong>Author:</strong> ${statusData.author} (${statusData.authorEmail})</p>
                        <p><strong>Message:</strong> ${statusData.message}</p>
                        <p><strong>Complete:</strong> ${statusData.complete}</p>
                        <p id="files-count-${statusData.id}"><strong>Files:</strong> <span style="color: #999;">Loading...</span></p>
                    </div>
                    <div class="col-md-6">
                        <p><strong>Received:</strong> ${statusData.receivedTime ? new Date(statusData.receivedTime).toLocaleString() : 'N/A'}</p>
                        <p><strong>Started:</strong> ${statusData.startTime ? new Date(statusData.startTime).toLocaleString() : 'N/A'}</p>
                        <p><strong>Completed:</strong> ${completedTime}</p>
                        <p><strong>Duration:</strong> ${duration}</p>
                        <p><strong>Project Type:</strong> ${statusData.projectType}</p>
                        <p><strong>Deployer:</strong> ${statusData.deployer}</p>
                    </div>
                </div>
            </div>
        `;

        fetchDeploymentManifest(statusData.id).then(files => {
            const filesCountEl = document.getElementById(`files-count-${statusData.id}`);
            if (filesCountEl && files) {
                filesCountEl.innerHTML = `<strong>Files:</strong> <a href="#" style="color: #337ab7;">${files.length} files</a>`;
                filesCountEl.querySelector('a').onclick = (e) => {
                    e.preventDefault();
                    showManifestModal(files, statusData.id);
                };
            } else if (filesCountEl) {
                filesCountEl.innerHTML = '<strong>Files:</strong> <span style="color: #999;">N/A</span>';
            }
        });

        return panel;
    }

    async function fetchDeploymentLog(id) {
        try {
            const res = await fetch(`/api/vfs/site/deployments/${id}/log.log`);
            if (!res.ok) return null;
            const text = await res.text();
            return text;
        } catch (err) {
            return null;
        }
    }

    async function fetchDeploymentManifest(id) {
        try {
            const res = await fetch(`/api/vfs/site/deployments/${id}/manifest`);
            if (!res.ok) return null;
            const text = await res.text();
            return text.split('\n').filter(line => line.trim());
        } catch (err) {
            return null;
        }
    }

    function showManifestModal(files, deploymentId) {
        const modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
        modal.style.zIndex = '10000';
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
        modal.onclick = (e) => {
            if (e.target === modal) modal.remove();
        };

        const dialog = document.createElement('div');
        dialog.className = 'panel panel-default';
        dialog.style.width = '80%';
        dialog.style.maxWidth = '900px';
        dialog.style.maxHeight = '90%';
        dialog.style.overflow = 'hidden';
        dialog.style.margin = '0';
        dialog.style.display = 'flex';
        dialog.style.flexDirection = 'column';

        const header = document.createElement('div');
        header.className = 'panel-heading';
        header.innerHTML = `
            <h3 class="panel-title">
                Deployed Files (${files.length})
                <button type="button" class="close" style="margin-top: -2px;">&times;</button>
            </h3>
        `;
        dialog.appendChild(header);

        const body = document.createElement('div');
        body.className = 'panel-body';
        body.style.overflowY = 'auto';
        body.style.flex = '1';
        body.style.fontFamily = 'Consolas, Monaco, monospace';
        body.style.fontSize = '12px';

        const searchBox = document.createElement('input');
        searchBox.type = 'text';
        searchBox.className = 'form-control';
        searchBox.placeholder = 'Filter files...';
        searchBox.style.marginBottom = '10px';
        body.appendChild(searchBox);

        const fileList = document.createElement('div');
        fileList.id = 'manifest-file-list';
        body.appendChild(fileList);

        const renderFiles = (filter = '') => {
            const filteredFiles = filter 
                ? files.filter(f => f.toLowerCase().includes(filter.toLowerCase()))
                : files;

            fileList.innerHTML = '';

            const directories = {};
            const rootFiles = [];

            filteredFiles.forEach(file => {
                if (file.includes('\\') || file.includes('/')) {
                    const separator = file.includes('\\') ? '\\' : '/';
                    const parts = file.split(separator);
                    const dir = parts[0];
                    if (!directories[dir]) directories[dir] = [];
                    directories[dir].push(file);
                } else {
                    rootFiles.push(file);
                }
            });

            if (rootFiles.length > 0) {
                const rootHeader = document.createElement('div');
                rootHeader.style.fontWeight = 'bold';
                rootHeader.style.marginTop = '10px';
                rootHeader.style.marginBottom = '5px';
                rootHeader.style.color = '#333';
                rootHeader.textContent = `Root (${rootFiles.length} files)`;
                fileList.appendChild(rootHeader);

                rootFiles.forEach(file => {
                    const fileDiv = document.createElement('div');
                    fileDiv.style.padding = '2px 0 2px 20px';
                    fileDiv.style.color = '#666';
                    fileDiv.textContent = file;
                    fileList.appendChild(fileDiv);
                });
            }

            Object.keys(directories).sort().forEach(dir => {
                const dirHeader = document.createElement('div');
                dirHeader.style.fontWeight = 'bold';
                dirHeader.style.marginTop = '10px';
                dirHeader.style.marginBottom = '5px';
                dirHeader.style.color = '#333';
                dirHeader.style.cursor = 'pointer';
                dirHeader.innerHTML = `<span style="margin-right: 5px;">▼</span>${dir} (${directories[dir].length} files)`;
                
                const filesContainer = document.createElement('div');
                filesContainer.style.display = 'block';
                
                directories[dir].forEach(file => {
                    const fileDiv = document.createElement('div');
                    fileDiv.style.padding = '2px 0 2px 20px';
                    fileDiv.style.color = '#666';
                    fileDiv.textContent = file;
                    filesContainer.appendChild(fileDiv);
                });

                dirHeader.onclick = () => {
                    if (filesContainer.style.display === 'none') {
                        filesContainer.style.display = 'block';
                        dirHeader.innerHTML = `<span style="margin-right: 5px;">▼</span>${dir} (${directories[dir].length} files)`;
                    } else {
                        filesContainer.style.display = 'none';
                        dirHeader.innerHTML = `<span style="margin-right: 5px;">▶</span>${dir} (${directories[dir].length} files)`;
                    }
                };

                fileList.appendChild(dirHeader);
                fileList.appendChild(filesContainer);
            });

            if (filteredFiles.length === 0) {
                fileList.innerHTML = '<div style="color: #999; padding: 20px; text-align: center;">No files match the filter</div>';
            }
        };

        searchBox.oninput = (e) => renderFiles(e.target.value);
        renderFiles();

        dialog.appendChild(body);

        const closeBtn = dialog.querySelector('.close');
        closeBtn.onclick = () => modal.remove();

        modal.appendChild(dialog);
        document.body.appendChild(modal);
    }

    function parseLogLine(line) {
        const isIndented = line.startsWith('\t');
        const cleanLine = isIndented ? line.substring(1) : line;
        
        const parts = cleanLine.split(',');
        if (parts.length < 4) return null;
        
        const timestamp = parts[0];
        const message = parts.slice(1, -2).join(',');
        const level = parts[parts.length - 1];
        
        return {
            timestamp,
            message,
            level,
            isIndented
        };
    }

    function renderDeploymentLog(logText, deploymentId) {
        const panel = document.createElement('div');
        panel.className = 'panel panel-default';
        panel.style.marginBottom = '20px';
        panel.id = 'deployment-log-panel';

        const header = document.createElement('div');
        header.className = 'panel-heading';
        header.innerHTML = `
            <h3 class="panel-title">
                Deployment Log
                <span id="log-loading-indicator" style="margin-left: 10px; display: none;">
                    <span class="label label-warning">Loading...</span>
                </span>
                <div class="pull-right">
                    <button class="btn btn-xs btn-primary" id="auto-refresh-log-btn" style="margin-right: 5px;">Auto-refresh</button>
                    <button class="btn btn-xs btn-default" id="toggle-log-btn">Collapse</button>
                </div>
            </h3>
        `;
        panel.appendChild(header);

        const body = document.createElement('div');
        body.className = 'panel-body';
        body.id = 'log-panel-body';
        body.style.maxHeight = '500px';
        body.style.overflowY = 'auto';
        body.style.backgroundColor = '#f5f5f5';
        body.style.fontFamily = 'Consolas, Monaco, monospace';
        body.style.fontSize = '12px';

        const lines = logText.split('\n').filter(line => line.trim());
        
        lines.forEach(line => {
            const parsed = parseLogLine(line);
            if (!parsed) return;

            const logLine = document.createElement('div');
            logLine.style.padding = '2px 0';
            logLine.style.borderBottom = '1px solid #e0e0e0';
            
            if (parsed.isIndented) {
                logLine.style.paddingLeft = '40px';
                logLine.style.backgroundColor = '#fafafa';
            }

            const time = new Date(parsed.timestamp);
            const timeStr = time.toLocaleTimeString();

            const timeSpan = document.createElement('span');
            timeSpan.style.color = '#999';
            timeSpan.style.marginRight = '10px';
            timeSpan.textContent = timeStr;

            const messageSpan = document.createElement('span');
            messageSpan.textContent = parsed.message;
            
            if (parsed.message.toLowerCase().includes('error')) {
                messageSpan.style.color = '#d9534f';
                messageSpan.style.fontWeight = 'bold';
            } else if (parsed.message.toLowerCase().includes('warning')) {
                messageSpan.style.color = '#f0ad4e';
            } else if (parsed.message.toLowerCase().includes('success')) {
                messageSpan.style.color = '#5cb85c';
                messageSpan.style.fontWeight = 'bold';
            }

            logLine.appendChild(timeSpan);
            logLine.appendChild(messageSpan);
            body.appendChild(logLine);
        });

        panel.appendChild(body);

        currentDeploymentId = deploymentId;

        setTimeout(() => {
            const toggleBtn = document.getElementById('toggle-log-btn');
            const autoRefreshBtn = document.getElementById('auto-refresh-log-btn');
            const logBody = document.getElementById('log-panel-body');
            
            if (toggleBtn && logBody) {
                toggleBtn.onclick = () => {
                    if (logBody.style.display === 'none') {
                        logBody.style.display = 'block';
                        toggleBtn.textContent = 'Collapse';
                    } else {
                        logBody.style.display = 'none';
                        toggleBtn.textContent = 'Expand';
                    }
                };
                logBody.scrollTop = logBody.scrollHeight;
            }

            if (autoRefreshBtn) {
                autoRefreshBtn.onclick = () => {
                    if (logRefreshInterval) {
                        stopLogRefresh();
                    } else {
                        startLogRefresh();
                    }
                };
            }
        }, 0);

        return panel;
    }

    async function startLogRefresh() {
        const autoRefreshBtn = document.getElementById('auto-refresh-log-btn');
        
        if (autoRefreshBtn) {
            autoRefreshBtn.textContent = 'Stop Auto-refresh';
            autoRefreshBtn.className = 'btn btn-xs btn-danger';
        }

        if (currentDeploymentId) {
            await refreshLogAndStatus(currentDeploymentId);
        }

        logRefreshInterval = setInterval(async () => {
            if (currentDeploymentId) {
                await refreshLogAndStatus(currentDeploymentId);
            }
        }, 5000);
    }

    function stopLogRefresh() {
        const autoRefreshBtn = document.getElementById('auto-refresh-log-btn');
        
        if (logRefreshInterval) {
            clearInterval(logRefreshInterval);
            logRefreshInterval = null;
        }

        if (autoRefreshBtn) {
            autoRefreshBtn.textContent = 'Auto-refresh';
            autoRefreshBtn.className = 'btn btn-xs btn-primary';
        }
    }

    async function refreshLogContent(deploymentId) {
        const logBody = document.getElementById('log-panel-body');
        const loadingIndicator = document.getElementById('log-loading-indicator');
        if (!logBody) return;

        if (loadingIndicator) {
            loadingIndicator.style.display = 'inline';
        }

        const wasAtBottom = logBody.scrollHeight - logBody.scrollTop <= logBody.clientHeight + 50;

        const logText = await fetchDeploymentLog(deploymentId);
        if (!logText) return;

        logBody.innerHTML = '';

        const lines = logText.split('\n').filter(line => line.trim());
        
        lines.forEach(line => {
            const parsed = parseLogLine(line);
            if (!parsed) return;

            const logLine = document.createElement('div');
            logLine.style.padding = '2px 0';
            logLine.style.borderBottom = '1px solid #e0e0e0';
            
            if (parsed.isIndented) {
                logLine.style.paddingLeft = '40px';
                logLine.style.backgroundColor = '#fafafa';
            }

            const time = new Date(parsed.timestamp);
            const timeStr = time.toLocaleTimeString();

            const timeSpan = document.createElement('span');
            timeSpan.style.color = '#999';
            timeSpan.style.marginRight = '10px';
            timeSpan.textContent = timeStr;

            const messageSpan = document.createElement('span');
            messageSpan.textContent = parsed.message;
            
            if (parsed.message.toLowerCase().includes('error')) {
                messageSpan.style.color = '#d9534f';
                messageSpan.style.fontWeight = 'bold';
            } else if (parsed.message.toLowerCase().includes('warning')) {
                messageSpan.style.color = '#f0ad4e';
            } else if (parsed.message.toLowerCase().includes('success')) {
                messageSpan.style.color = '#5cb85c';
                messageSpan.style.fontWeight = 'bold';
            }

            logLine.appendChild(timeSpan);
            logLine.appendChild(messageSpan);
            logBody.appendChild(logLine);
        });

        if (wasAtBottom) {
            logBody.scrollTop = logBody.scrollHeight;
        }

        if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
        }
    }

    async function refreshLogAndStatus(deploymentId) {
        await refreshLogContent(deploymentId);
        
        const statusData = await fetchDeploymentStatus(deploymentId);
        
        if (statusData) {
            updateLatestDeploymentStatus(statusData);
            
            const allowedStatuses = ['Pending', 'Building', 'Deploying'];
            if (!allowedStatuses.includes(statusData.status)) {
                stopLogRefresh();
            }
        }
    }

    function updateLatestDeploymentStatus(statusData) {
        const latestPanel = document.querySelector('.panel.panel-success, .panel.panel-danger, .panel.panel-info');
        if (!latestPanel) return;
        
        const panelClass = statusData.status === 'Success' ? 'success' : statusData.status === 'Failed' ? 'danger' : 'info';
        latestPanel.className = `panel panel-${panelClass}`;
        
        const statusElements = latestPanel.querySelectorAll('p');
        statusElements.forEach(p => {
            const strong = p.querySelector('strong');
            if (!strong) return;
            
            const label = strong.textContent;
            if (label === 'Status:') {
                const statusBadge = p.querySelector('.label');
                if (statusBadge) {
                    p.innerHTML = `<strong>Status:</strong> ${getStatusBadge(statusData.status)}`;
                }
            } else if (label === 'Completed:') {
                const isValidTimeRange = statusData.startTime && statusData.endTime && 
                                         new Date(statusData.endTime) >= new Date(statusData.startTime);
                const completedTime = isValidTimeRange ? new Date(statusData.endTime).toLocaleString() : 'N/A';
                p.innerHTML = `<strong>Completed:</strong> ${completedTime}`;
            } else if (label === 'Duration:') {
                const isValidTimeRange = statusData.startTime && statusData.endTime && 
                                         new Date(statusData.endTime) >= new Date(statusData.startTime);
                const duration = isValidTimeRange ? formatDuration(statusData.startTime, statusData.endTime) : 'N/A';
                p.innerHTML = `<strong>Duration:</strong> ${duration}`;
            } else if (label === 'Complete:') {
                p.innerHTML = `<strong>Complete:</strong> ${statusData.complete}`;
            }
        });
    }

    function renderDeploymentList(deployments, activeId) {
        const container = document.createElement('div');
        
        const header = document.createElement('h2');
        header.textContent = 'Deployment History';
        header.style.marginTop = '30px';
        header.style.marginBottom = '15px';
        container.appendChild(header);

        if (deployments.length === 0) {
            const alert = document.createElement('div');
            alert.className = 'alert alert-info';
            alert.textContent = 'No deployment history found.';
            container.appendChild(alert);
            return container;
        }

        const table = document.createElement('table');
        table.className = 'table table-striped table-hover';
        table.innerHTML = `
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Status</th>
                    <th>Message</th>
                    <th>Date</th>
                    <th>Active</th>
                </tr>
            </thead>
            <tbody id="deployment-list-body"></tbody>
        `;
        container.appendChild(table);

        const tbody = table.querySelector('#deployment-list-body');
        
        deployments.forEach(dep => {
            const isActive = dep.id === activeId;
            const row = document.createElement('tr');
            row.style.cursor = 'pointer';
            if (isActive) {
                row.style.backgroundColor = '#fcf8e3';
                row.style.fontWeight = 'bold';
            }
            
            row.innerHTML = `
                <td><code>${dep.id.substring(0, 8)}</code></td>
                <td id="status-${dep.id}">${getStatusBadge('Loading')}</td>
                <td id="message-${dep.id}">Loading...</td>
                <td>${dep.date ? new Date(dep.date).toLocaleString() : 'Unknown'}</td>
                <td>${isActive ? '<span class="label label-warning">ACTIVE</span>' : ''}</td>
            `;
            
            row.onclick = async () => {
                const statusData = await fetchDeploymentStatus(dep.id);
                if (statusData) {
                    showDeploymentDetails(statusData, activeId);
                }
            };
            
            tbody.appendChild(row);
            
            fetchDeploymentStatus(dep.id).then(statusData => {
                if (statusData) {
                    const statusCell = document.getElementById(`status-${dep.id}`);
                    const messageCell = document.getElementById(`message-${dep.id}`);
                    if (statusCell) statusCell.innerHTML = getStatusBadge(statusData.status);
                    if (messageCell) messageCell.textContent = statusData.message || 'N/A';
                }
            });
        });

        return container;
    }

    async function triggerNewDeployment() {
        const triggerBtn = event.target;
        const originalText = triggerBtn.textContent;
        triggerBtn.disabled = true;
        triggerBtn.textContent = 'Triggering...';

        try {
            const responseFetch = fetch('/api/deployments', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            setTimeout(() => {
                const alert = document.createElement('div');
                alert.className = 'alert alert-success';
                alert.textContent = 'Deployment triggered successfully!';
                alert.style.position = 'fixed';
                alert.style.top = '70px';
                alert.style.right = '20px';
                alert.style.zIndex = '9999';
                alert.style.minWidth = '300px';
                document.body.appendChild(alert);
                
                setTimeout(() => alert.remove(), 3000);
                
                fetchDeploymentData();
            }, 500);

            const reponse = await responseFetch;
            if (response.ok) {
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
        } catch (err) {
            const alert = document.createElement('div');
            alert.className = 'alert alert-danger';
            alert.textContent = `Failed to trigger deployment: ${err.message}`;
            alert.style.position = 'fixed';
            alert.style.top = '70px';
            alert.style.right = '20px';
            alert.style.zIndex = '9999';
            alert.style.minWidth = '300px';
            document.body.appendChild(alert);
            
            setTimeout(() => alert.remove(), 5000);
        } finally {
            triggerBtn.disabled = false;
            triggerBtn.textContent = originalText;
        }
    }

    async function fetchDeploymentData() {
        const content = document.getElementById('deployment-content');
        content.innerHTML = '<div class="alert alert-info">Loading deployment data...</div>';

        try {
            const [activeRes, deploymentsRes] = await Promise.all([
                fetch('/api/vfs/site/deployments/active'),
                fetch('/api/vfs/site/deployments/')
            ]);

            let activeId = null;
            if (activeRes.ok) {
                activeId = (await activeRes.text()).trim();
            }

            let deployments = [];
            let latestDeploymentId = null;
            if (deploymentsRes.ok) {
                const items = await deploymentsRes.json();
                
                deployments = items
                    .filter(item => {
                        return item.mime === 'inode/directory' && 
                               item.name !== 'tools';
                    })
                    .map(item => {
                        return {
                            id: item.name,
                            date: item.mtime
                        };
                    })
                    .sort((a, b) => {
                        const dateA = new Date(a.date);
                        const dateB = new Date(b.date);
                        return dateB - dateA;
                    });
                
                if (deployments.length > 0) {
                    latestDeploymentId = deployments[0].id;
                }
            }

            content.innerHTML = '';

            if (latestDeploymentId) {
                const latestStatusData = await fetchDeploymentStatus(latestDeploymentId);
                
                if (latestStatusData) {
                    content.appendChild(renderLatestDeployment(latestStatusData, activeId));
                    
                    const logText = await fetchDeploymentLog(latestDeploymentId);
                    if (logText) {
                        content.appendChild(renderDeploymentLog(logText, latestDeploymentId));
                    } else {
                        const alert = document.createElement('div');
                        alert.className = 'alert alert-info';
                        alert.textContent = 'No deployment log available.';
                        alert.style.marginBottom = '20px';
                        content.appendChild(alert);
                    }
                } else {
                    const alert = document.createElement('div');
                    alert.className = 'alert alert-warning';
                    alert.textContent = 'Could not load latest deployment status.';
                    content.appendChild(alert);
                }
            } else {
                const alert = document.createElement('div');
                alert.className = 'alert alert-warning';
                alert.textContent = 'No deployments found.';
                content.appendChild(alert);
            }

            content.appendChild(renderDeploymentList(deployments, activeId));

        } catch (err) {
            content.innerHTML = `<div class="alert alert-danger">Failed to load deployment data: ${err.message}</div>`;
        }
    }

    function updateNavbarState() {
        const currentState = history.state;
        const deploymentLink = document.getElementById('deployment-nav-link');
        
        if (deploymentLink) {
            if (currentState && currentState.view === 'deployments') {
                deploymentLink.classList.add('active');
            } else {
                deploymentLink.classList.remove('active');
            }
        }
    }

    window.addEventListener('viewer-change', (event) => {
        if (event.detail.viewer !== 'deployments' && isViewerActive) {
            isViewerActive = false;
        }
    });

    window.addEventListener('load', () => {
        addNavbarLink();

        if (window.location.search.includes('deployments')) {
            showDeploymentViewer(true);
        }
        
        updateNavbarState();
    });

    window.addEventListener('popstate', (event) => {
        if (event.state && event.state.view === 'deployments') {
            if (!isViewerActive) {
                showDeploymentViewer(true);
            }
        } else if (event.state && event.state.view !== 'deployments') {
            if (isViewerActive) {
                hideDeploymentViewer(true);
            }
        } else if (!event.state || !event.state.view) {
            if (isViewerActive) {
                hideDeploymentViewer(true);
            }
        }
        
        updateNavbarState();
    });

})();
