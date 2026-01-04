// ==UserScript==
// @name         F-list Character Exporter
// @namespace    https://github.com/FoundryBlaise/FlistCharExporter
// @version      1.0.0
// @description  Export and import F-list character profiles as JSON/ZIP files
// @author       Foundry Blaise
// @license      MIT
// @match        https://www.f-list.net/character_edit.php*
// @grant        GM_xmlhttpRequest
// @connect      static.f-list.net
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.9.1/jszip.min.js
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/560450/F-list%20Character%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/560450/F-list%20Character%20Exporter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const VERSION = '1.0.0';

    /**
     * Download a file using GM_xmlhttpRequest (bypasses CORS)
     */
    function gmFetch(url, timeoutMs = 30000) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                responseType: 'arraybuffer',
                timeout: timeoutMs,
                onload: (response) => {
                    if (response.status >= 200 && response.status < 300) {
                        resolve(response.response);
                    } else {
                        reject(new Error(`HTTP ${response.status}`));
                    }
                },
                onerror: () => reject(new Error('Network error')),
                ontimeout: () => reject(new Error('Request timed out')),
                onabort: () => reject(new Error('Request aborted'))
            });
        });
    }

    /**
     * Extract image data from the page
     */
    function extractImageData() {
        const images = [];

        const imageContainers = document.querySelectorAll('.character_image');
        imageContainers.forEach(container => {
            const preview = container.querySelector('.character_image_preview');
            const desc = container.querySelector('.character_image_description');
            const style = preview?.style.backgroundImage || '';
            const match = style.match(/url\(["']?(.*?)["']?\)/);
            const thumbUrl = match ? match[1] : null;
            const imageId = container.id.replace('image', '');

            if (thumbUrl && imageId) {
                const fullUrl = thumbUrl.replace('/charthumb/', '/charimage/');
                images.push({
                    id: imageId,
                    thumbUrl: thumbUrl,
                    fullUrl: fullUrl,
                    description: desc?.value || ''
                });
            }
        });

        const avatarImg = document.querySelector('img[src*="/images/avatar/"]');
        const avatar = avatarImg?.src || null;

        return { images, avatar };
    }

    /**
     * Extract inline image IDs from description text
     */
    function extractInlineIds(description) {
        if (!description) return [];
        const matches = description.matchAll(/\[img=(\d+)\]/gi);
        const ids = [...matches].map(m => m[1]);
        return [...new Set(ids)];
    }

    /**
     * Get inline image URLs by triggering the BBCode preview
     */
    async function getInlineUrlsFromPreview() {
        const descField = document.querySelector('[name="description"]');
        if (!descField || !descField.value.match(/\[img=\d+\]/i)) {
            return [];
        }

        const previewLink = document.querySelector('a[href*="Preview"]') ||
                           Array.from(document.querySelectorAll('a')).find(a => a.textContent.includes('Preview BBCode'));

        if (!previewLink) {
            console.warn('[F-list Exporter] Preview link not found');
            return [];
        }

        previewLink.click();

        return new Promise((resolve) => {
            let attempts = 0;
            const maxAttempts = 20;
            const checkInterval = setInterval(() => {
                attempts++;
                const inlineImgs = document.querySelectorAll('img[src*="charinline"]');

                if (inlineImgs.length > 0 || attempts >= maxAttempts) {
                    clearInterval(checkInterval);
                    const urls = Array.from(inlineImgs).map(img => img.src);
                    const closeBtn = document.querySelector('img[src*="cross-circle-frame"]');
                    if (closeBtn) closeBtn.click();
                    resolve(urls);
                }
            }, 200);
        });
    }

    /**
     * Show a simple status overlay
     */
    function showStatus(message) {
        let overlay = document.getElementById('flist-export-status');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'flist-export-status';
            overlay.style.cssText = `
                position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                background: #333; color: #fff; padding: 20px 40px; border-radius: 8px;
                z-index: 10001; font-size: 16px; text-align: center;
            `;
            document.body.appendChild(overlay);
        }
        overlay.textContent = message;
        return overlay;
    }

    function hideStatus() {
        const overlay = document.getElementById('flist-export-status');
        if (overlay) overlay.remove();
    }

    /**
     * Show export dialog with options
     */
    function showExportDialog(charName, imageCount, hasAvatar, inlineCount, onExport) {
        const overlay = document.createElement('div');
        overlay.id = 'flist-export-dialog';
        overlay.style.cssText = `
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.6); z-index: 10000;
            display: flex; align-items: center; justify-content: center;
        `;

        const dialog = document.createElement('div');
        dialog.style.cssText = `
            background: #2a2a2a; color: #fff; padding: 24px; border-radius: 8px;
            min-width: 320px; box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        `;

        const checkboxStyle = 'display: flex; align-items: center; gap: 10px; margin: 8px 0; cursor: pointer;';
        const disabledStyle = 'opacity: 0.5;';

        dialog.innerHTML = `
            <h3 style="margin: 0 0 16px 0; color: #4CAF50;">Export Character</h3>
            <p style="margin: 0 0 12px 0;">Export "${charName}"</p>
            <div style="border-top: 1px solid #444; padding-top: 12px;">
                <label style="${checkboxStyle} ${imageCount === 0 ? disabledStyle : ''}">
                    <input type="checkbox" id="export-images" ${imageCount === 0 ? 'disabled' : ''} style="width: 16px; height: 16px;">
                    <span>Include Images (${imageCount})</span>
                </label>
                <label style="${checkboxStyle} ${inlineCount === 0 ? disabledStyle : ''}">
                    <input type="checkbox" id="export-inlines" ${inlineCount === 0 ? 'disabled' : ''} style="width: 16px; height: 16px;">
                    <span>Include Inlines (${inlineCount}) - export only, no restore</span>
                </label>
            </div>

            <div style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 20px;">
                <button id="export-cancel" style="padding: 10px 20px; background: #666; color: #fff; border: none; border-radius: 4px; cursor: pointer;">Cancel</button>
                <button id="export-confirm" style="padding: 10px 20px; background: #4CAF50; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">Export ZIP</button>
            </div>
        `;

        overlay.appendChild(dialog);
        document.body.appendChild(overlay);

        document.getElementById('export-cancel').onclick = () => overlay.remove();
        document.getElementById('export-confirm').onclick = () => {
            const includeImages = document.getElementById('export-images')?.checked || false;
            const includeInlines = document.getElementById('export-inlines')?.checked || false;
            overlay.remove();
            onExport(includeImages, includeInlines);
        };
    }

    /**
     * Export as ZIP file using JSZip
     */
    async function exportAsZip(data, safeName, includeImages = false, includeInlines = false) {
        console.log('[F-list Exporter] JSZip available:', typeof JSZip);
        if (typeof JSZip === 'undefined') {
            alert('Error: JSZip library not loaded. Please reinstall the script.');
            hideStatus();
            return;
        }
        const zip = new JSZip();
        console.log('[F-list Exporter] JSZip instance created');
        const imageData = extractImageData();

        const inlineIds = extractInlineIds(data.character?.description || '');

        let inlineUrls = [];
        if (includeInlines) {
            showStatus('Checking for inline images...');
            inlineUrls = await getInlineUrlsFromPreview();
        }

        let downloaded = 0;
        let failed = 0;
        const total = (imageData.avatar ? 1 : 0) + (includeImages ? imageData.images.length : 0) + inlineUrls.length;

        console.log('[F-list Exporter] Starting export with', imageData.images.length, 'images,', inlineUrls.length, 'inlines');

        data.inlines = inlineIds;
        zip.file('character.json', JSON.stringify(data, null, 2));

        // Build download tasks
        const downloadTasks = [];

        if (imageData.avatar) {
            downloadTasks.push({
                type: 'avatar',
                url: imageData.avatar,
                filename: `avatar.${imageData.avatar.split('.').pop().split('?')[0] || 'png'}`
            });
        }

        if (includeImages) {
            imageData.images.forEach(img => {
                const ext = img.fullUrl.split('.').pop().split('?')[0] || 'png';
                downloadTasks.push({
                    type: 'image',
                    url: img.fullUrl,
                    filename: `images/${img.id}.${ext}`
                });
            });
        }

        inlineUrls.forEach(url => {
            const urlParts = url.split('/');
            const hashFilename = urlParts[urlParts.length - 1];
            downloadTasks.push({
                type: 'inline',
                url: url,
                filename: `inlines/${hashFilename}`
            });
        });

        // Download all files
        if (downloadTasks.length > 0) {
            showStatus(`Downloading ${total} files...`);

            const results = await Promise.allSettled(
                downloadTasks.map(async (task) => {
                    const arrayBuffer = await gmFetch(task.url);
                    return { task, data: arrayBuffer };
                })
            );

            results.forEach((result, index) => {
                if (result.status === 'fulfilled') {
                    const { task, data } = result.value;
                    zip.file(task.filename, data);
                    downloaded++;
                } else {
                    console.error(`[F-list Exporter] Failed to download:`, result.reason);
                    failed++;
                }
            });
        }

        showStatus('Creating ZIP file... 0%');
        console.log('[F-list Exporter] Generating ZIP...');

        try {
            const content = await zip.generateAsync(
                { type: 'blob', compression: 'STORE' },
                (metadata) => {
                    showStatus(`Creating ZIP file... ${Math.round(metadata.percent)}%`);
                }
            );
            console.log('[F-list Exporter] ZIP generated, size:', content.size);

            const dateStr = new Date().toISOString().slice(0, 10);
            const filename = `${safeName}_${dateStr}.zip`;

            const url = URL.createObjectURL(content);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 1000);

            hideStatus();
            console.log('[F-list Exporter] Export complete:', filename);
        } catch (err) {
            console.error('[F-list Exporter] ZIP generation failed:', err);
            alert('Error generating ZIP: ' + err.message);
            hideStatus();
        }
    }

    /**
     * Upload a single image to F-list
     */
    function uploadSingleImage(imageData, filename) {
        return new Promise((resolve, reject) => {
            const fileInput = document.getElementById('imagefile');
            if (!fileInput) {
                reject(new Error('Image file input not found'));
                return;
            }

            const beforeCount = document.querySelectorAll('.character_image').length;

            const mimeType = filename.endsWith('.png') ? 'image/png' :
                            filename.endsWith('.gif') ? 'image/gif' : 'image/jpeg';
            const blob = new Blob([imageData], { type: mimeType });
            const file = new File([blob], filename, { type: mimeType });

            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            fileInput.files = dataTransfer.files;

            let attempts = 0;
            const maxAttempts = 60;
            const checkInterval = setInterval(() => {
                attempts++;
                const afterCount = document.querySelectorAll('.character_image').length;

                if (afterCount > beforeCount) {
                    clearInterval(checkInterval);
                    const containers = document.querySelectorAll('.character_image');
                    const newContainer = containers[containers.length - 1];
                    const newId = newContainer?.id?.replace('image', '') || null;
                    resolve(newId);
                } else if (attempts >= maxAttempts) {
                    clearInterval(checkInterval);
                    reject(new Error('Upload timeout'));
                }
            }, 500);

            if (typeof uploadImage === 'function') {
                uploadImage();
            } else {
                clearInterval(checkInterval);
                reject(new Error('uploadImage function not found'));
            }
        });
    }

    /**
     * Upload avatar image
     */
    function uploadAvatar(imageData, filename) {
        return new Promise((resolve, reject) => {
            const fileInput = document.getElementById('avatar-file');
            if (!fileInput) {
                reject(new Error('Avatar file input not found'));
                return;
            }

            const mimeType = filename.endsWith('.png') ? 'image/png' :
                            filename.endsWith('.gif') ? 'image/gif' : 'image/jpeg';
            const blob = new Blob([imageData], { type: mimeType });
            const file = new File([blob], filename, { type: mimeType });

            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            fileInput.files = dataTransfer.files;

            console.log('[F-list Exporter] Avatar file set');
            resolve(true);
        });
    }

    /**
     * Import images from ZIP file
     */
    async function importImages(zip, imageMetadata, updateStatus) {
        let uploaded = 0;
        let failed = 0;
        const total = imageMetadata.list?.length || 0;

        for (let i = total - 1; i >= 0; i--) {
            const imgMeta = imageMetadata.list[i];
            const file = zip.file(imgMeta.filename);

            if (!file) {
                console.warn(`[F-list Exporter] Image not found: ${imgMeta.filename}`);
                failed++;
                continue;
            }

            updateStatus(`Uploading image ${total - i}/${total}...`);

            try {
                const imageData = await file.async('uint8array');
                const filename = imgMeta.filename.split('/').pop();
                const newId = await uploadSingleImage(imageData, filename);

                if (imgMeta.description && newId) {
                    const descInput = document.querySelector(`#image${newId} .character_image_description`);
                    if (descInput) descInput.value = imgMeta.description;
                }

                uploaded++;
            } catch (err) {
                console.error(`[F-list Exporter] Failed to upload:`, err);
                failed++;
            }
        }

        return { uploaded, failed, total };
    }

    /**
     * Delete all existing character images
     */
    async function deleteAllImages(updateStatus) {
        const imageContainers = document.querySelectorAll('.character_image');
        const total = imageContainers.length;

        if (total === 0) return 0;

        let deleted = 0;

        for (const container of imageContainers) {
            const imageId = container.id.replace('image', '');
            if (!imageId) continue;

            updateStatus(`Deleting image ${deleted + 1}/${total}...`);

            try {
                if (typeof deleteImage === 'function') {
                    deleteImage(imageId);

                    await new Promise((resolve, reject) => {
                        let attempts = 0;
                        const checkInterval = setInterval(() => {
                            attempts++;
                            if (!document.getElementById(`image${imageId}`)) {
                                clearInterval(checkInterval);
                                resolve();
                            } else if (attempts >= 20) {
                                clearInterval(checkInterval);
                                reject(new Error('Delete timeout'));
                            }
                        }, 500);
                    });

                    deleted++;
                }
            } catch (err) {
                console.error(`[F-list Exporter] Failed to delete image ${imageId}:`, err);
            }
        }

        return deleted;
    }

    /**
     * Extract all character data from the edit form
     */
    function extractCharacterData() {
        const form = document.getElementById('CharacterForm');
        if (!form) throw new Error('Character form not found');

        const data = {
            meta: { exportedAt: new Date().toISOString(), version: VERSION },
            character: {
                id: form.querySelector('[name="character_id"]')?.value,
                name: document.querySelector('h2')?.textContent?.replace('Editing ', '') || null,
                description: form.querySelector('[name="description"]')?.value,
                customTitle: form.querySelector('[name="custom_title"]')?.value
            },
            settings: {},
            infotags: {},
            kinks: {},
            customKinks: []
        };

        ['public', 'showtimezone', 'unbookmarkable', 'showbadges',
         'showfriends', 'customsfirst', 'moderate', 'showcharlist'].forEach(name => {
            const el = form.querySelector(`[name="${name}"]`);
            if (el) data.settings[name] = el.type === 'checkbox' ? el.checked : el.value;
        });

        form.querySelectorAll('[name^="info_"]').forEach(el => {
            if (el.value) data.infotags[el.name] = el.value;
        });

        form.querySelectorAll('[name^="fetish_"]').forEach(el => {
            data.kinks[el.name] = el.value;
        });

        const customNames = form.querySelectorAll('[name="customkinkname[]"]');
        const customDescs = form.querySelectorAll('[name="customkinkdescription[]"]');
        const customChoices = form.querySelectorAll('[name="customkinkchoice[]"]');
        const customIds = form.querySelectorAll('[name="customkinkid[]"]');

        for (let i = 0; i < customNames.length; i++) {
            if (customNames[i].value) {
                data.customKinks.push({
                    id: customIds[i]?.value || null,
                    name: customNames[i].value,
                    description: customDescs[i]?.value || '',
                    choice: customChoices[i]?.value || ''
                });
            }
        }

        return data;
    }

    /**
     * Export button click handler
     */
    function exportCharacter() {
        try {
            const data = extractCharacterData();
            const safeName = (data.character.name || 'character').replace(/[^a-z0-9]/gi, '_');
            const imageData = extractImageData();
            const imageCount = imageData.images.length;
            const hasAvatar = !!imageData.avatar;
            const inlineIds = extractInlineIds(data.character?.description || '');
            const inlineCount = inlineIds.length;

            data.images = {
                list: imageData.images.map((img, index) => ({
                    position: index,
                    filename: `images/${img.id}.${img.fullUrl.split('.').pop().split('?')[0] || 'png'}`,
                    description: img.description
                })),
                avatar: imageData.avatar ? {
                    filename: `avatar.${imageData.avatar.split('.').pop().split('?')[0] || 'png'}`
                } : null
            };

            showExportDialog(data.character.name || 'character', imageCount, hasAvatar, inlineCount, (includeImages, includeInlines) => {
                exportAsZip(data, safeName, includeImages, includeInlines)
                    .catch((err) => {
                        hideStatus();
                        alert('Export failed: ' + err.message);
                        console.error(err);
                    });
            });
        } catch (error) {
            alert('Export failed: ' + error.message);
            console.error(error);
        }
    }

    /**
     * Import character data into the form
     */
    function importCharacterData(data, options = {}) {
        const form = document.getElementById('CharacterForm');
        if (!form) throw new Error('Character form not found');

        const opts = {
            description: options.description !== false,
            settings: options.settings !== false,
            kinks: options.kinks !== false,
            customKinks: options.customKinks !== false
        };

        let imported = { fields: 0, kinks: 0, customKinks: 0, warnings: [] };

        if (opts.description) {
            const desc = form.querySelector('[name="description"]');
            if (desc) { desc.value = data.character?.description || ''; imported.fields++; }
            const title = form.querySelector('[name="custom_title"]');
            if (title) { title.value = data.character?.customTitle || ''; imported.fields++; }
        }

        if (opts.settings) {
            if (data.settings) {
                for (const [name, value] of Object.entries(data.settings)) {
                    const el = form.querySelector(`[name="${name}"]`);
                    if (el) {
                        if (el.type === 'checkbox') el.checked = !!value;
                        else el.value = value;
                        imported.fields++;
                    }
                }
            }

            const infotagFields = form.querySelectorAll('[name^="info_"]');
            if (data.infotags && Object.keys(data.infotags).length > 0) {
                for (const [name, value] of Object.entries(data.infotags)) {
                    const el = form.querySelector(`[name="${name}"]`);
                    if (el) { el.value = value; imported.fields++; }
                }
            } else {
                infotagFields.forEach(el => {
                    if (el.tagName === 'SELECT') el.selectedIndex = 0;
                    else el.value = '';
                    imported.fields++;
                });
            }
        }

        if (opts.kinks) {
            const kinkSelects = form.querySelectorAll('[name^="fetish_"]');
            if (data.kinks && Object.keys(data.kinks).length > 0) {
                for (const [name, value] of Object.entries(data.kinks)) {
                    const el = form.querySelector(`[name="${name}"]`);
                    if (el) { el.value = value; imported.kinks++; }
                }
            } else {
                kinkSelects.forEach(el => { el.value = 'undecided'; imported.kinks++; });
            }
        }

        if (opts.customKinks) {
            const existingContainers = document.querySelectorAll('[id^="CustomKink"]:not([id="CustomKinksList"]):not([id*="TEMPLATE"])');
            existingContainers.forEach(container => {
                const match = container.id.match(/CustomKink(\d+)/);
                if (match && typeof $ !== 'undefined' && typeof FList !== 'undefined') {
                    $('#' + container.id).remove();
                    FList.Subfetish.Data.removeCustom(match[1]);
                }
            });

            if (data.customKinks && data.customKinks.length > 0) {
                if (typeof FList !== 'undefined' && typeof FList.CharEditor_addKink === 'function') {
                    for (let i = 0; i < data.customKinks.length; i++) {
                        FList.CharEditor_addKink();
                    }

                    setTimeout(() => {
                        const customNames = form.querySelectorAll('[name="customkinkname[]"]');
                        const customDescs = form.querySelectorAll('[name="customkinkdescription[]"]');
                        const customChoices = form.querySelectorAll('[name="customkinkchoice[]"]');

                        data.customKinks.forEach((kink, i) => {
                            if (customNames[i]) {
                                customNames[i].value = kink.name;
                                if (customDescs[i]) customDescs[i].value = kink.description || '';
                                if (customChoices[i]) customChoices[i].value = kink.choice || 'undecided';
                            }
                        });
                    }, 100);

                    imported.customKinks = data.customKinks.length;
                } else {
                    imported.warnings.push('Could not access F-list API for custom kinks.');
                }
            }
        }

        return imported;
    }

    /**
     * Show import dialog with options
     */
    function showImportDialog(charName, currentCharName, exportDate, data, imageCount, currentImageCount, hasAvatar, onImport) {
        const overlay = document.createElement('div');
        overlay.id = 'flist-import-dialog';
        overlay.style.cssText = `
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.6); z-index: 10000;
            display: flex; align-items: center; justify-content: center;
        `;

        const dialog = document.createElement('div');
        dialog.style.cssText = `
            background: #2a2a2a; color: #fff; padding: 24px; border-radius: 8px;
            min-width: 320px; box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        `;

        const hasDescription = !!(data.character?.description || data.character?.customTitle);
        const hasSettings = !!(data.settings && Object.keys(data.settings).length > 0);
        const kinkCount = data.kinks ? Object.values(data.kinks).filter(v => v && v !== 'undecided').length : 0;
        const hasKinks = kinkCount > 0;
        const customKinkCount = data.customKinks?.length || 0;
        const hasCustomKinks = customKinkCount > 0;

        const checkboxStyle = 'display: flex; align-items: center; gap: 10px; margin: 8px 0; cursor: pointer;';
        const warningStyle = 'color: #ff9800; margin-left: 4px;';
        const nameMismatch = charName !== currentCharName;

        dialog.innerHTML = `
            <h3 style="margin: 0 0 16px 0; color: #2196F3;">Import Character</h3>
            <p style="margin: 0 0 8px 0;">Import "${charName}"</p>
            ${nameMismatch ? `
                <div style="margin: 0 0 12px 0; padding: 10px; background: #5c1a1a; border: 1px solid #f44336; border-radius: 4px;">
                    <p style="margin: 0 0 8px 0; color: #ff6b6b;"><strong>⚠ Warning:</strong> Backup is for "${charName}" but you are editing "${currentCharName}"</p>
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; color: #ff6b6b;">
                        <input type="checkbox" id="import-mismatch-confirm" style="width: 16px; height: 16px;">
                        <span>I understand and want to proceed anyway</span>
                    </label>
                </div>
            ` : ''}
            <p style="margin: 0 0 16px 0; font-size: 12px; color: #aaa;">Exported: ${exportDate}</p>

            <div style="border-top: 1px solid #444; padding-top: 12px; margin-top: 12px;">
                <label style="${checkboxStyle}">
                    <input type="checkbox" id="import-description" ${hasDescription ? 'checked' : ''} style="width: 16px; height: 16px;">
                    <span>Description & Title${!hasDescription ? '<span style="' + warningStyle + '" title="Empty - will clear existing">⚠</span>' : ''}</span>
                </label>
                <label style="${checkboxStyle}">
                    <input type="checkbox" id="import-settings" ${hasSettings ? 'checked' : ''} style="width: 16px; height: 16px;">
                    <span>Settings & Infotags${!hasSettings ? '<span style="' + warningStyle + '" title="Empty - will clear infotags">⚠</span>' : ''}</span>
                </label>
                <label style="${checkboxStyle}">
                    <input type="checkbox" id="import-kinks" ${hasKinks ? 'checked' : ''} style="width: 16px; height: 16px;">
                    <span>Kinks (${kinkCount})${!hasKinks ? '<span style="' + warningStyle + '" title="Empty - will reset all kinks">⚠</span>' : ''}</span>
                </label>
                <label style="${checkboxStyle}">
                    <input type="checkbox" id="import-customkinks" ${hasCustomKinks ? 'checked' : ''} style="width: 16px; height: 16px;">
                    <span>Custom Kinks (${customKinkCount})${!hasCustomKinks ? '<span style="' + warningStyle + '" title="Empty - will clear custom kinks">⚠</span>' : ''}</span>
                </label>
                <label style="${checkboxStyle}">
                    <input type="checkbox" id="import-avatar" ${hasAvatar ? 'checked' : ''} style="width: 16px; height: 16px;">
                    <span>Avatar${!hasAvatar ? '<span style="' + warningStyle + '" title="No avatar in backup">⚠</span>' : ''}</span>
                </label>
                <label style="${checkboxStyle}">
                    <input type="checkbox" id="import-images" ${imageCount > 0 ? 'checked' : ''} style="width: 16px; height: 16px;">
                    <span>Images (${imageCount})${imageCount === 0 ? '<span style="' + warningStyle + '" title="No images - check to delete existing">⚠</span>' : ''}</span>
                </label>
                <label style="${checkboxStyle} margin-left: 26px;">
                    <input type="checkbox" id="import-clear-images" style="width: 16px; height: 16px;">
                    <span style="color: #ff9800;">Clear existing images first (deleted on Import, not Save!)</span>
                </label>
                <div id="import-clear-warning" style="display: none; margin-left: 26px; margin-top: 4px; padding: 8px; background: #5c1a1a; border: 1px solid #f44336; border-radius: 4px;">
                    <p style="margin: 0 0 6px 0; color: #ff6b6b; font-size: 12px;"><strong>⚠ Warning:</strong> ${currentImageCount} existing images will be deleted and replaced with ${imageCount} from backup.</p>
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; color: #ff6b6b; font-size: 12px;">
                        <input type="checkbox" id="import-clear-confirm" style="width: 14px; height: 14px;">
                        <span>I understand this cannot be undone</span>
                    </label>
                </div>
            </div>

            <p style="font-size: 11px; color: #888; margin: 12px 0 0 0;">Note: Images will be uploaded one-by-one.</p>

            <div style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 20px;">
                <button id="import-cancel" style="padding: 10px 20px; background: #666; color: #fff; border: none; border-radius: 4px; cursor: pointer;">Cancel</button>
                <button id="import-confirm" style="padding: 10px 20px; background: #2196F3; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;" ${nameMismatch ? 'disabled' : ''}>Import</button>
            </div>
        `;

        overlay.appendChild(dialog);
        document.body.appendChild(overlay);

        const importBtn = document.getElementById('import-confirm');

        // Function to update Import button state based on confirmations
        const updateImportButton = () => {
            const mismatchCheckbox = document.getElementById('import-mismatch-confirm');
            const clearCheckbox = document.getElementById('import-clear-images');
            const clearConfirmCheckbox = document.getElementById('import-clear-confirm');

            const mismatchOk = !nameMismatch || (mismatchCheckbox && mismatchCheckbox.checked);
            const clearOk = !clearCheckbox.checked || (clearConfirmCheckbox && clearConfirmCheckbox.checked);
            const canImport = mismatchOk && clearOk;

            importBtn.disabled = !canImport;
            importBtn.style.opacity = canImport ? '1' : '0.5';
            importBtn.style.cursor = canImport ? 'pointer' : 'not-allowed';
        };

        // Handle name mismatch confirmation checkbox
        if (nameMismatch) {
            importBtn.style.opacity = '0.5';
            importBtn.style.cursor = 'not-allowed';
            document.getElementById('import-mismatch-confirm').onchange = updateImportButton;
        }

        // Handle clear images confirmation
        const clearImagesCheckbox = document.getElementById('import-clear-images');
        const clearWarning = document.getElementById('import-clear-warning');
        const clearConfirmCheckbox = document.getElementById('import-clear-confirm');

        clearImagesCheckbox.onchange = () => {
            clearWarning.style.display = clearImagesCheckbox.checked ? 'block' : 'none';
            if (!clearImagesCheckbox.checked) {
                clearConfirmCheckbox.checked = false;
            }
            updateImportButton();
        };
        clearConfirmCheckbox.onchange = updateImportButton;

        document.getElementById('import-cancel').onclick = () => overlay.remove();
        importBtn.onclick = () => {
            const options = {
                description: document.getElementById('import-description')?.checked || false,
                settings: document.getElementById('import-settings')?.checked || false,
                kinks: document.getElementById('import-kinks')?.checked || false,
                customKinks: document.getElementById('import-customkinks')?.checked || false,
                avatar: document.getElementById('import-avatar')?.checked || false,
                images: document.getElementById('import-images')?.checked || false,
                clearImages: document.getElementById('import-clear-images')?.checked || false
            };
            overlay.remove();
            onImport(options);
        };
    }

    /**
     * Handle file selection for import
     */
    function handleImportFile(event) {
        const file = event.target.files[0];
        if (!file) return;

        const isZip = file.name.toLowerCase().endsWith('.zip');

        if (isZip) {
            JSZip.loadAsync(file).then(async (zip) => {
                try {
                    const jsonFile = zip.file('character.json');
                    if (!jsonFile) throw new Error('character.json not found in ZIP');

                    const jsonText = await jsonFile.async('string');
                    const data = JSON.parse(jsonText);
                    const charName = data.character?.name || 'Unknown';
                    const currentCharName = document.querySelector('h2')?.textContent?.replace('Editing ', '') || 'Unknown';
                    const exportDate = data.meta?.exportedAt ? new Date(data.meta.exportedAt).toLocaleString() : 'Unknown';
                    const imageCount = data.images?.list?.length || 0;
                    const currentImageCount = document.querySelectorAll('.character_image').length;
                    const hasAvatar = !!data.images?.avatar;

                    showImportDialog(charName, currentCharName, exportDate, data, imageCount, currentImageCount, hasAvatar, async (options) => {
                        try {
                            const result = importCharacterData(data, options);

                            let imageResult = { uploaded: 0, failed: 0, total: 0 };
                            let avatarResult = { success: false };
                            let deletedCount = 0;

                            if (options.clearImages) {
                                deletedCount = await deleteAllImages(showStatus);
                            }

                            if (options.avatar && data.images?.avatar) {
                                showStatus('Uploading avatar...');
                                const avatarFile = zip.file(data.images.avatar.filename);
                                if (avatarFile) {
                                    try {
                                        const avatarData = await avatarFile.async('uint8array');
                                        await uploadAvatar(avatarData, data.images.avatar.filename.split('/').pop());
                                        avatarResult.success = true;
                                    } catch (err) {
                                        console.warn('[F-list Exporter] Avatar upload failed:', err);
                                    }
                                }
                            }

                            if (options.images && data.images?.list?.length > 0) {
                                imageResult = await importImages(zip, data.images, showStatus);
                            }

                            hideStatus();

                            let msg = `Import complete!\n\n`;
                            if (options.description) msg += `• ${result.fields} fields\n`;
                            if (options.kinks) msg += `• ${result.kinks} kinks\n`;
                            if (options.customKinks) msg += `• ${result.customKinks} custom kinks\n`;
                            if (options.avatar) msg += `• Avatar ${avatarResult.success ? 'uploaded' : 'failed'}\n`;
                            if (deletedCount > 0) msg += `• ${deletedCount} existing images cleared\n`;
                            if (options.images) {
                                msg += `• ${imageResult.uploaded}/${imageResult.total} images uploaded`;
                                if (imageResult.failed > 0) msg += ` (${imageResult.failed} failed)`;
                                msg += '\n';
                            }
                            if (result.warnings.length > 0) msg += `\nWarnings:\n${result.warnings.join('\n')}`;
                            msg += `\nRemember to click "Save" to save!`;

                            alert(msg);
                        } catch (error) {
                            hideStatus();
                            alert('Import failed: ' + error.message);
                            console.error(error);
                        }
                    });
                } catch (error) {
                    alert('Import failed: ' + error.message);
                    console.error(error);
                }
            }).catch(err => {
                alert('Failed to read ZIP: ' + err.message);
            });
        } else {
            // Handle JSON file
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const data = JSON.parse(e.target.result);
                    const charName = data.character?.name || 'Unknown';
                    const currentCharName = document.querySelector('h2')?.textContent?.replace('Editing ', '') || 'Unknown';
                    const exportDate = data.meta?.exportedAt ? new Date(data.meta.exportedAt).toLocaleString() : 'Unknown';
                    const imageCount = data.images?.list?.length || 0;
                    const currentImageCount = document.querySelectorAll('.character_image').length;
                    const hasAvatar = !!data.images?.avatar;

                    showImportDialog(charName, currentCharName, exportDate, data, imageCount, currentImageCount, hasAvatar, (options) => {
                        const result = importCharacterData(data, options);

                        let msg = `Import complete!\n\n`;
                        if (options.description) msg += `• ${result.fields} fields\n`;
                        if (options.kinks) msg += `• ${result.kinks} kinks\n`;
                        if (options.customKinks) msg += `• ${result.customKinks} custom kinks\n`;
                        if (result.warnings.length > 0) msg += `\nWarnings:\n${result.warnings.join('\n')}`;
                        msg += `\nRemember to click "Save" to save!`;

                        alert(msg);
                    });
                } catch (error) {
                    alert('Import failed: ' + error.message);
                    console.error(error);
                }
            };
            reader.readAsText(file);
        }

        event.target.value = '';
    }

    /**
     * Initialize the exporter
     */
    function init() {
        if (!document.getElementById('CharacterForm')) return;

        const btn = document.createElement('button');
        btn.textContent = 'Export Character';
        btn.style.cssText = `
            position: fixed; top: 10px; right: 10px; z-index: 9999;
            padding: 10px 20px; background: #4CAF50; color: white;
            border: none; border-radius: 4px; cursor: pointer; font-weight: bold;
        `;
        btn.onclick = exportCharacter;
        document.body.appendChild(btn);

        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json,.zip';
        fileInput.style.display = 'none';
        fileInput.onchange = handleImportFile;
        document.body.appendChild(fileInput);

        const importBtn = document.createElement('button');
        importBtn.textContent = 'Import Character';
        importBtn.style.cssText = `
            position: fixed; top: 10px; right: 180px; z-index: 9999;
            padding: 10px 20px; background: #2196F3; color: white;
            border: none; border-radius: 4px; cursor: pointer; font-weight: bold;
        `;
        importBtn.onclick = () => fileInput.click();
        document.body.appendChild(importBtn);

        console.log(`[F-list Exporter] Ready - v${VERSION}`);
    }

    init();
})();
