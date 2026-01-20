// ==UserScript==
// @name         Kudu Event Log Viewer
// @namespace    https://github.com/skttl/umbraco-userscripts
// @version      1.0.0
// @description  Add a styled event log viewer inside Kudu for Umbraco Cloud
// @author       skttl
// @homepage     https://github.com/skttl/umbraco-userscripts
// @supportURL   https://github.com/skttl/umbraco-userscripts/issues
// @license      MIT
// @include      /^https?:\/\/.*\.scm\..*\.umbraco\.io\/.*$/
// @icon         https://raw.githubusercontent.com/skttl/umbraco-userscripts/main/screenshots/event_log_viewer.png
// @grant        none
// @run-at       document-end
// @compatible   chrome Tampermonkey
// @compatible   firefox Tampermonkey
// @compatible   edge Tampermonkey
// @downloadURL https://update.greasyfork.org/scripts/563341/Kudu%20Event%20Log%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/563341/Kudu%20Event%20Log%20Viewer.meta.js
// ==/UserScript==

    (function() {
        'use strict';

        let isViewerActive = false;
        let originalContent = null;

        function addNavbarLink() {
            const navbar = document.querySelector('body > .navbar:first-child');
            if (!navbar) return;

            const navList = navbar.querySelector('.nav.navbar-nav');
            if (!navList || document.getElementById('eventlog-nav-link')) return;

            const li = document.createElement('li');
            li.id = 'eventlog-nav-link';

            const link = document.createElement('a');
            link.href = '#';
            link.textContent = 'Event Log';
            link.onclick = (e) => {
                e.preventDefault();
                toggleEventLogViewer();
            };

            li.appendChild(link);
            navList.appendChild(li);
        }

        function toggleEventLogViewer(skipHistory = false) {
            if (isViewerActive) {
                hideEventLogViewer(skipHistory);
            } else {
                showEventLogViewer(skipHistory);
            }
        }

        function showEventLogViewer(skipHistory = false) {
            const navbar = document.querySelector('body > .navbar:first-child');
            if (!navbar) return;

            const navList = navbar.querySelector('.nav.navbar-nav');
            if (navList) {
                navList.querySelectorAll('li').forEach(li => li.classList.remove('active'));
            }

            window.dispatchEvent(new CustomEvent('viewer-change', { detail: { viewer: 'eventlog' } }));

            const deploymentPanel = document.getElementById('deployment-viewer-panel');
            if (deploymentPanel) {
                deploymentPanel.style.display = 'none';
            }

            let nextSibling = navbar.nextElementSibling;
            while (nextSibling) {
                if (nextSibling.id !== 'eventlog-viewer-panel' && nextSibling.id !== 'deployment-viewer-panel') {
                    nextSibling.style.display = 'none';
                }
                nextSibling = nextSibling.nextElementSibling;
            }

            if (!document.getElementById('eventlog-viewer-panel')) {
                createViewerPanel();
                fetchEventLog();
            } else {
                document.getElementById('eventlog-viewer-panel').style.display = 'block';
            }

            isViewerActive = true;

            if (!skipHistory) {
                history.pushState({ view: 'eventlog' }, 'Event Log', window.location.pathname + '?eventlog');
            }
            
            updateNavbarState();
        }

        function hideEventLogViewer(skipHistory = false) {
            const navbar = document.querySelector('body > .navbar:first-child');
            if (!navbar) return;

            let nextSibling = navbar.nextElementSibling;
            while (nextSibling) {
                if (nextSibling.id !== 'eventlog-viewer-panel') {
                    nextSibling.style.display = '';
                }
                nextSibling = nextSibling.nextElementSibling;
            }

            const panel = document.getElementById('eventlog-viewer-panel');
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
            panel.id = 'eventlog-viewer-panel';
            panel.className = 'container';
            panel.style.marginTop = '20px';

            const header = document.createElement('div');
            header.className = 'page-header';
            header.innerHTML = '<h1>Event Log Viewer</h1>';
            panel.appendChild(header);

            const btnGroup = document.createElement('div');
            btnGroup.className = 'btn-group';
            btnGroup.style.marginBottom = '20px';

            const loadBtn = document.createElement('button');
            loadBtn.className = 'btn btn-primary';
            loadBtn.textContent = 'Load Event Log';
            loadBtn.onclick = fetchEventLog;
            btnGroup.appendChild(loadBtn);

            panel.appendChild(btnGroup);

            const content = document.createElement('div');
            content.id = 'eventlog-content';
            panel.appendChild(content);

            document.body.appendChild(panel);
        }

        function levelColor(level) {
            switch(level) {
                case "2": return "#d9534f";
                case "3": return "#f0ad4e";
                case "4": return "#5bc0de";
                default: return "#999";
            }
        }

        function levelLabel(level) {
            switch(level) {
                case "2": return "danger";
                case "3": return "warning";
                case "4": return "info";
                default: return "default";
            }
        }

        function renderEvents(events) {
            const container = document.getElementById('eventlog-content');
            container.innerHTML = '';

            for (const event of events) {
                const level = event.querySelector('Level')?.textContent || '';
                const time = event.querySelector('TimeCreated')?.getAttribute('SystemTime') || '';
                const id = event.querySelector('EventID')?.textContent || '';
                const provider = event.querySelector('Provider')?.getAttribute('Name') || '';
                const computer = event.querySelector('Computer')?.textContent || '';

                const messages = [...event.querySelectorAll('EventData > Data')]
                    .map(d => `<li>${d.textContent}</li>`).join('');

                const panel = document.createElement('div');
                panel.className = `panel panel-${levelLabel(level)}`;
                panel.style.marginBottom = '15px';

                panel.innerHTML = `
                    <div class="panel-heading">
                        <h3 class="panel-title">
                            Event ${id} – ${provider}
                            <span class="pull-right" style="font-weight:normal; font-size:0.9em;">${new Date(time).toLocaleString()}</span>
                        </h3>
                    </div>
                    <div class="panel-body">
                        <p><strong>Computer:</strong> ${computer}</p>
                        ${messages ? `<ul>${messages}</ul>` : ''}
                    </div>
                `;
                container.appendChild(panel);
            }
        }

        async function fetchEventLog() {
            const url = '/api/vfs/LogFiles/eventlog.xml';
            const content = document.getElementById('eventlog-content');
            content.innerHTML = '<div class="alert alert-info">Loading...</div>';

            try {
                const res = await fetch(url);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const text = await res.text();
                const parser = new DOMParser();
                const xml = parser.parseFromString(text, 'application/xml');
                const events = [...xml.querySelectorAll('Event')];

                events.sort((a, b) => {
                    const ta = new Date(a.querySelector('TimeCreated')?.getAttribute('SystemTime'));
                    const tb = new Date(b.querySelector('TimeCreated')?.getAttribute('SystemTime'));
                    return tb - ta;
                });

                renderEvents(events);
            } catch (err) {
                content.innerHTML = `<div class="alert alert-danger">Failed to load events: ${err}</div>`;
            }
        }

        function updateNavbarState() {
            const currentState = history.state;
            const eventlogLink = document.getElementById('eventlog-nav-link');
            
            if (eventlogLink) {
                if (currentState && currentState.view === 'eventlog') {
                    eventlogLink.classList.add('active');
                } else {
                    eventlogLink.classList.remove('active');
                }
            }
        }

        window.addEventListener('viewer-change', (event) => {
            if (event.detail.viewer !== 'eventlog' && isViewerActive) {
                isViewerActive = false;
            }
        });

        window.addEventListener('load', () => {
            addNavbarLink();

            if (window.location.search.includes('eventlog')) {
                showEventLogViewer(true);
            }
            
            updateNavbarState();
        });

        window.addEventListener('popstate', (event) => {
            if (event.state && event.state.view === 'eventlog') {
                if (!isViewerActive) {
                    showEventLogViewer(true);
                }
            } else if (event.state && event.state.view !== 'eventlog') {
                if (isViewerActive) {
                    hideEventLogViewer(true);
                }
            } else if (!event.state || !event.state.view) {
                if (isViewerActive) {
                    hideEventLogViewer(true);
                }
            }
            
            updateNavbarState();
        });

    })();
