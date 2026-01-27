// ==UserScript==
// @name         Websim Local Sync - WebSocket Bridge
// @namespace    http://tampermonkey.net/
// @version      1.5.2
// @description  Zero-click local sync for Websim projects via WebSocket
// @author       Trey6383
// @match        https://websim.com/*
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/564093/Websim%20Local%20Sync%20-%20WebSocket%20Bridge.user.js
// @updateURL https://update.greasyfork.org/scripts/564093/Websim%20Local%20Sync%20-%20WebSocket%20Bridge.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const SYNC_VERSION = "1.5.2";
    console.log(`%c[Websim Bridge] Userscript ${SYNC_VERSION} active.`, "color: #3b82f6; font-weight: bold");

    async function getProjectState() {
        const pathParts = window.location.pathname.split('/').filter(p => p);
        if (pathParts.length < 1) return null;

        let slugOrId = pathParts[pathParts.length - 1];
        let version = null;

        if (!isNaN(slugOrId) && pathParts.length >= 2) {
            version = slugOrId;
            slugOrId = pathParts[pathParts.length - 2];
        }

        try {
            const projRes = await fetch(`/api/v1/projects/${slugOrId}`);
            if (!projRes.ok) return null;
            const projData = await projRes.json();
            const project = projData.project;
            const finalVersion = version || project.current_version || project.last_posted_version || 1;

            const assetRes = await fetch(`/api/v1/projects/${project.id}/revisions/${finalVersion}/assets`);
            const assetData = assetRes.ok ? await assetRes.json() : { assets: [] };

            return {
                projectId: project.id,
                version: parseInt(finalVersion),
                assets: assetData.assets || [],
                title: project.title
            };
        } catch (e) { return null; }
    }

    function showStatus(text, color = '#3b82f6') {
        let el = document.getElementById('websim-sync-status');
        if (!el) {
            el = document.createElement('div');
            el.id = 'websim-sync-status';
            Object.assign(el.style, {
                position: 'fixed', bottom: '20px', right: '20px', zIndex: '999999',
                padding: '10px 20px', borderRadius: '8px', color: 'white',
                fontWeight: 'bold', fontSize: '14px', pointerEvents: 'none',
                transition: 'opacity 0.3s', opacity: '0', boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
            });
            document.body.appendChild(el);
        }
        el.textContent = text;
        el.style.backgroundColor = color;
        el.style.opacity = '1';
        clearTimeout(el.timeout);
        el.timeout = setTimeout(() => { el.style.opacity = '0'; }, 5000);
    }

    let socket;
    let isActiveTab = true;

    window.addEventListener('focus', () => { isActiveTab = true; });
    window.addEventListener('blur', () => { isActiveTab = false; });

    function connect() {
        socket = new WebSocket('ws://localhost:38383');

        socket.onopen = async () => {
            console.log("%c[Websim Bridge] Socket opened.", "color: #10b981");
            const state = await getProjectState();
            socket.send(JSON.stringify({
                type: 'hello',
                syncVersion: SYNC_VERSION,
                focused: isActiveTab,
                url: window.location.href,
                projectState: state
            }));
        };

        socket.onmessage = async (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === 'push') {
                    await executePush(data.payload);
                } else if (data.type === 'create-init') {
                    await executeCreateInit();
                } else if (data.type === 'create-meta') {
                    await executeCreateMeta(data.payload);
                } else if (data.type === 'hello') {
                    const state = await getProjectState();
                    socket.send(JSON.stringify({
                        type: 'hello',
                        syncVersion: SYNC_VERSION,
                        focused: isActiveTab,
                        url: window.location.href,
                        projectState: state
                    }));
                } else if (data.type === 'pull-assets-list') {
                    const { projectId, version } = data.payload;
                    try {
                        const res = await fetch(`/api/v1/projects/${projectId}/revisions/${version}/assets`);
                        if (!res.ok) throw new Error(`Assets list fetch failed: ${res.status}`);
                        const assetsData = await res.json();
                        socket.send(JSON.stringify({
                            type: 'assets-list',
                            projectId,
                            version,
                            assets: assetsData.assets || []
                        }));
                    } catch (e) {
                        socket.send(JSON.stringify({ type: 'status', message: 'error', error: `List pull failed: ${e.message}` }));
                    }
                } else if (data.type === 'pull-asset') {
                    const { projectId, path } = data.payload;
                    try {
                        const url = `https://${projectId}.c.websim.com/${path}`;
                        const res = await fetch(url);
                        if (!res.ok) throw new Error(`Asset fetch failed: ${res.status} at ${url}`);
                        const blob = await res.blob();
                        const reader = new FileReader();
                        reader.onloadend = () => {
                            socket.send(JSON.stringify({
                                type: 'asset-data',
                                path: path,
                                content: reader.result.split(',')[1] // base64
                            }));
                        };
                        reader.readAsDataURL(blob);
                    } catch (e) {
                        socket.send(JSON.stringify({ type: 'status', message: 'error', error: `Pull failed: ${e.message}` }));
                    }
                }
            } catch (e) {
                console.error("[Websim Bridge] Error processing message:", e);
                socket.send(JSON.stringify({ type: 'status', message: 'error', error: e.message }));
            }
        };

        socket.onclose = () => {
            setTimeout(connect, 2000);
        };

        socket.onerror = (err) => {
            // Silently retry
        };
    }

    function b64ToUint8(b64) {
        const bin = atob(b64);
        const bytes = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) {
            bytes[i] = bin.charCodeAt(i);
        }
        return bytes;
    }

    let isSyncing = false;

    async function executePush(payload, isInternal = false) {
        if (isSyncing && !isInternal) {
            console.warn("[Websim Bridge] Push already in progress, skipping redundant request.");
            return;
        }
        if (!isInternal) isSyncing = true;

        let { projectId, parentVersion, files, title, slug, revisionId } = payload;
        const opName = (title || slug) ? "Sync" : "Push";

        console.log(`%c[Websim Bridge] Starting ${opName} for ${projectId}`, "color: #3b82f6; font-weight: bold");

        try {
            // 0. Metadata Update
            if (title || slug) {
                const patchBody = {};
                if (title) patchBody.title = title;
                if (slug) patchBody.slug = slug;
                await fetch(`/api/v1/projects/${projectId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(patchBody)
                });
            }

            // 1. Revision Resolution
            let nextVersion = parentVersion;
            let nextRevId = revisionId;

            if (!nextRevId) {
                socket.send(JSON.stringify({ type: 'progress', step: 1, label: 'Revision' }));
                const revRes = await fetch(`/api/v1/projects/${projectId}/revisions`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ parent_version: parentVersion })
                });

                if (revRes.status === 409) {
                    const listRes = await fetch(`/api/v1/projects/${projectId}/revisions`);
                    const listData = await listRes.json();
                    let revisions = [];
                    if (Array.isArray(listData)) revisions = listData;
                    else if (listData && Array.isArray(listData.revisions)) revisions = listData.revisions;
                    else if (listData && Array.isArray(listData.project_revisions)) revisions = listData.project_revisions;

                    const draft = revisions.find(r => r.draft);
                    if (!draft) throw new Error("Conflict: No draft found.");
                    nextVersion = draft.version;
                    nextRevId = draft.id;
                } else if (!revRes.ok) {
                    throw new Error(`Revision Err: ${revRes.status}`);
                } else {
                    const revData = await revRes.json();
                    nextVersion = revData.project_revision.version;
                    nextRevId = revData.project_revision.id;
                }
            }
            console.log(`[Websim Bridge] Target Version: v${nextVersion}, Rev: ${nextRevId}`);

            // 2. Asset Cleanup & Upload (The Nuclear Sweep)
            socket.send(JSON.stringify({ type: 'progress', step: 2, label: 'Assets' }));

            if (files && files.length > 0) {
                const existingRes = await fetch(`/api/v1/projects/${projectId}/revisions/${nextVersion}/assets`);
                const existingData = existingRes.ok ? await existingRes.json() : { assets: [] };
                const existingAssets = existingData.assets || [];

                const duplicatesToDelete = [];
                const assetMapJSON = [];
                const processedAssetIds = new Set();

                files.forEach(f => {
                    const fileName = f.path.split('/').pop();
                    const lastDotIndex = fileName.lastIndexOf('.');
                    const baseName = lastDotIndex !== -1 ? fileName.substring(0, lastDotIndex) : fileName;
                    const ext = lastDotIndex !== -1 ? fileName.substring(lastDotIndex + 1) : '';

                    // Escaped regex for multi-dot filenames
                    const escapedBase = baseName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    const duplicateRegex = new RegExp(`^${escapedBase}(\\s*\\(\\d+\\))?\\.${ext}$`, 'i');

                    const matches = existingAssets.filter(a => {
                        const aPath = a.path.split('/').pop();
                        return duplicateRegex.test(aPath);
                    });

                    const exactMatch = matches.find(m => m.path === f.path);
                    const duplicates = matches.filter(m => m.path !== f.path);

                    if (exactMatch) {
                        // Use existingAssetPath for reliable overwriting
                        assetMapJSON.push({ existingAssetPath: exactMatch.path, size: f.size });
                        processedAssetIds.add(exactMatch.id);
                    } else {
                        assetMapJSON.push({ path: f.path, size: f.size });
                    }

                    duplicates.forEach(d => {
                        if (!processedAssetIds.has(d.id)) {
                            duplicatesToDelete.push(d);
                            processedAssetIds.add(d.id);
                        }
                    });
                });

                // 2.1 Sequential DELETE (Clean Sweep)
                if (duplicatesToDelete.length > 0) {
                    console.log(`[Websim Bridge] Purging ${duplicatesToDelete.length} duplicates...`);
                    for (const asset of duplicatesToDelete) {
                        try {
                            const delRes = await fetch(`/api/v1/projects/${projectId}/revisions/${nextVersion}/assets/${encodeURIComponent(asset.path)}`, {
                                method: 'DELETE'
                            });
                            if (delRes.ok) console.log(`[Websim Bridge] Deleted: ${asset.path}`);
                        } catch (e) { console.error(`Failed to delete ${asset.path}`, e); }
                    }
                }

                // 2.2 Upload/Overwrite
                const formData = new FormData();
                formData.append('contents', JSON.stringify(assetMapJSON));

                assetMapJSON.forEach((entry, i) => {
                    // entry.existingAssetPath or entry.path
                    const targetPath = entry.existingAssetPath || entry.path;
                    const localFile = files.find(f => f.path === targetPath) || files[0];
                    formData.append(i.toString(), new Blob([b64ToUint8(localFile.content)]), targetPath);
                });

                console.log(`[Websim Bridge] Syncing ${assetMapJSON.length} primary assets...`);
                const assetRes = await fetch(`/api/v1/projects/${projectId}/revisions/${nextVersion}/assets`, {
                    method: 'POST',
                    body: formData
                });
                if (!assetRes.ok) {
                    const errText = await assetRes.text().catch(() => "No Body");
                    throw new Error(`Asset Sync Error (${assetRes.status}): ${errText.substring(0, 100)}`);
                }
            }

            // 3. Site Update (Publishing the Preview)
            socket.send(JSON.stringify({ type: 'progress', step: 3, label: 'Site' }));
            const indexFile = (files || []).find(f => f.path === 'index.html');
            if (indexFile) {
                const siteRes = await fetch('/api/v1/sites', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        content: new TextDecoder().decode(b64ToUint8(indexFile.content)),
                        project_id: projectId,
                        project_version: nextVersion,
                        project_revision_id: nextRevId,
                        prompt_data_override: { type: 'manual-edit', text: "Clean Push v1.5.2", data: null }
                    })
                });
                if (!siteRes.ok) console.warn("Site update failed", siteRes.status);
            }

            // 4. Finalize
            socket.send(JSON.stringify({ type: 'progress', step: 4, label: 'Finalizing' }));
            await fetch(`/api/v1/projects/${projectId}/revisions/${nextVersion}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ draft: false })
            });

            if (!isInternal) {
                showStatus(`Clean Sweep Success!`, '#10b981');
                let username = 'Trey6383';
                let slug = '';
                try {
                    const [userRes, projRes] = await Promise.all([
                        fetch('/api/v1/session'),
                        fetch(`/api/v1/projects/${projectId}`)
                    ]);
                    if (userRes.ok) username = (await userRes.json()).user?.username || username;
                    if (projRes.ok) slug = (await projRes.json()).project?.slug || '';
                } catch (e) { }

                socket.send(JSON.stringify({
                    type: 'status',
                    message: 'success',
                    version: nextVersion,
                    projectId,
                    username,
                    slug
                }));
            }
            return { version: nextVersion, revisionId: nextRevId };

        } catch (err) {
            console.error("[Websim Bridge] Sync Failure:", err);
            if (!isInternal) {
                showStatus(`Sync Error: ${err.message}`, '#ef4444');
                socket.send(JSON.stringify({ type: 'status', message: 'error', error: err.message }));
            }
            throw err;
        } finally {
            if (!isInternal) isSyncing = false;
        }
    }

    async function executeCreateInit() {
        try {
            const projRes = await fetch('/api/v1/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ visibility: 'public' })
            });
            const projData = await projRes.json();
            socket.send(JSON.stringify({
                type: 'assignment',
                projectId: projData.project.id,
                version: projData.project_revision.version || 1,
                revisionId: projData.project_revision.id
            }));
        } catch (err) {
            socket.send(JSON.stringify({ type: 'status', message: 'error', error: err.message }));
        }
    }

    async function executeCreateMeta(payload) {
        let { projectId, revisionId, version, files, title, slug } = payload;
        const v1 = version || 1;
        try {
            if (title || slug) {
                await fetch(`/api/v1/projects/${projectId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title, slug })
                });
            }
            const indexFile = (files || []).find(f => f.path === 'index.html');
            if (indexFile) {
                await fetch('/api/v1/sites', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        content: new TextDecoder().decode(b64ToUint8(indexFile.content)),
                        project_id: projectId,
                        project_version: v1,
                        project_revision_id: revisionId,
                        prompt_data_override: { type: 'manual-edit', text: 'Initialize', data: null }
                    })
                });
            }
            await fetch(`/api/v1/projects/${projectId}/revisions/${v1}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ draft: false })
            });
            const pushResult = await executePush({ projectId, parentVersion: v1, files }, true);
            let username = 'Trey6383';
            try {
                const userRes = await fetch('/api/v1/session');
                username = (await userRes.json()).user?.username || username;
            } catch (e) { }
            socket.send(JSON.stringify({
                type: 'status', message: 'created', projectId, version: pushResult.version, title, slug, username, files
            }));
            showStatus(`Created v${pushResult.version}`, '#10b981');
        } catch (err) {
            console.error("[Websim Bridge] Create Failure:", err);
            socket.send(JSON.stringify({ type: 'status', message: 'error', error: err.message }));
        }
    }

    connect();
})();
