// ==UserScript==
// @name         GGn Torrent File Dropzone Creator
// @namespace    https://gazellegames.net/
// @version      1.1.0
// @description  Adds a dropzone and folder selection button to create a private .torrent, preserving sub-folder structures.
// @author       VGTal
// @license      Unlicense
// @icon         https://gazellegames.net/favicon.ico
// @match        https://gazellegames.net/upload.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551012/GGn%20Torrent%20File%20Dropzone%20Creator.user.js
// @updateURL https://update.greasyfork.org/scripts/551012/GGn%20Torrent%20File%20Dropzone%20Creator.meta.js
// ==/UserScript==

/*
    --- Developer Hook ---

    This script provides a global callback hook system `window.tfdz_beforeTorrentAddHooks`
    that can be used by other scripts to intercept the created .torrent file before
    it's assigned to the final file input on the page.

    This is useful for inspecting metadata or modifying the .torrent file itself.
    Multiple hooks can be added from different scripts. They will be executed sequentially,
    with the output of one hook becoming the input for the next.

    Hook Registration:
    Hooks should be pushed to the `window.tfdz_beforeTorrentAddHooks` array.

    Hook Signature:
    `async function({ torrentFile, torrentMetadata, filesInfo })`

    Parameters:
    The hook receives a single object with the following properties:
    - `torrentFile` (File object): The generated .torrent file. This may have been modified by a previous hook.
    - `torrentMetadata` (object): The WebTorrent torrent object, containing info like `infoHash`, `name`, `files`, etc.
    - `filesInfo` (Array<object>): An array of objects representing the files in the torrent.
      Each object has the shape `{ path: string, filename: string, size: number, type: string, pages?: number }`.
      The `pages` property is included only for PDF files.

    Return Value:
    - (optional) A `File` object. If a new File object is returned, it will replace the
      original `torrentFile` for subsequent hooks and for the final output. If nothing
      is returned, the file from the previous step is used.

    Example Usage (in another UserScript):

    // Ensure the hooks array exists
    if (typeof window.tfdz_beforeTorrentAddHooks === 'undefined') {
        window.tfdz_beforeTorrentAddHooks = [];
    }

    window.tfdz_beforeTorrentAddHooks.push(async ({ torrentFile, filesInfo }) => {
        console.log('--- My Custom Hook ---');
        const pdfFiles = filesInfo.filter(f => f.pages);
        console.log(`Found ${pdfFiles.length} PDF(s).`);

        // Example: Rename the file
        const newFileName = `[HOOKED] ${torrentFile.name}`;
        const fileBuffer = await torrentFile.arrayBuffer();
        const modifiedFile = new File([fileBuffer], newFileName, {
            type: torrentFile.type,
            lastModified: Date.now()
        });

        // Return the modified file to replace the original for the next hook
        return modifiedFile;
    });
*/

(function() {
    'use strict';

    const PREFIX = 'tfdz-';

    const logDebug = (...messages) => {
        const css = 'background: #222; color: #36b2f9; font-weight: 900; padding: 2px 4px; border-radius: 2px;';
        console.debug('%c[Torrent Dropzone]', css, ...messages);
    };
    const logError = (...messages) => {
        const css = 'background: #c00; color: #fff; font-weight: 900; padding: 2px 4px; border-radius: 2px;';
        console.error('%c[Torrent Dropzone]', css, ...messages);
    };
    const logWarn = (...messages) => {
        const css = 'background: #f7a300; color: #000; font-weight: 900; padding: 2px 4px; border-radius: 2px;';
        console.warn('%c[Torrent Dropzone]', css, ...messages);
    };


    /**
     * Dynamically loads one or more scripts and returns a promise that resolves when all are loaded.
     * @param {string[]} urls - An array of script URLs to load.
     * @returns {Promise<void>} A promise that resolves when all scripts have loaded.
     */
    function loadScripts(urls) {
        const promises = urls.map(url => {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = url;
                script.onload = resolve;
                script.onerror = () => reject(new Error(`Failed to load script: ${url}`));
                document.head.appendChild(script);
            });
        });
        return Promise.all(promises);
    }

    /**
     * Recursively traverses a file system entry (file or directory) to collect all files.
     * This is for Chrome's FileSystem API.
     * @param {FileSystemEntry} entry - The file system entry to process.
     * @returns {Promise<File[]>} A promise that resolves with an array of File objects.
     */
    async function getAllFiles(entry) {
        const files = [];
        if (entry.isFile) {
            const file = await new Promise((resolve, reject) => entry.file(resolve, reject));
            // The `path` property is essential for the torrent creation library.
            file.path = entry.fullPath.substring(1); // remove leading '/'
            logDebug('Found file:', file.path);
            files.push(file);
        } else if (entry.isDirectory) {
            logDebug('Scanning directory:', entry.fullPath);
            const reader = entry.createReader();

            const readEntriesPromise = () => new Promise((resolve, reject) => {
                reader.readEntries(
                    entries => resolve(entries),
                    err => reject(err)
                );
            });

            let allEntries = [];
            let currentEntries;
            // readEntries has to be called until it returns an empty array.
            do {
                currentEntries = await readEntriesPromise();
                allEntries.push(...currentEntries);
            } while (currentEntries.length > 0);

            for (const subEntry of allEntries) {
                files.push(...await getAllFiles(subEntry));
            }
        }
        return files;
    }

    /**
     * Main function to set up the dropzone and event listeners.
     */
    function initializeDropzone() {
        logDebug('Initializing dropzone...');

        const targetTd = document.querySelector('#torrent_file td:nth-child(2)');
        const fileInput = document.querySelector('#file');
        const announceUriInput = document.querySelector('#announce_uri input');

        if (!targetTd) {
            logError('Target <td> inside #torrent_file not found.');
            return;
        }
        if (!fileInput) {
            logError('Target <input id="file"> not found.');
            return;
        }
        if (!announceUriInput) {
            logWarn('Announce URI input inside #announce_uri not found. Torrent will be created without a tracker.');
        }

        logDebug('Required elements found. Creating dropzone and button.');
        const dropzone = document.createElement('div');
        dropzone.id = `${PREFIX}dropzone`;
        dropzone.textContent = 'Drop files here (or a folder on Chrome)';
        targetTd.prepend(dropzone);

        const folderButton = document.createElement('button');
        folderButton.id = `${PREFIX}folder-select-btn`;
        folderButton.type = 'button';
        folderButton.textContent = 'Select Folder (Recommended)';
        dropzone.after(folderButton);

        const folderInput = document.createElement('input');
        folderInput.type = 'file';
        folderInput.webkitdirectory = true;
        folderInput.style.display = 'none';
        targetTd.appendChild(folderInput);

        const createTorrentFromFiles = async (files) => {
            if (files.length === 0) {
                dropzone.textContent = 'No files were selected or folder is empty. Please try again.';
                folderButton.style.display = 'block';
                logWarn('File processing requested, but no files were collected.');
                return;
            }

            logDebug(`Collected ${files.length} files. Starting torrent creation...`);

            dropzone.textContent = `Processing ${files.length} files, please wait...`;

            // Extract root folder name from the first file's path.
            let torrentName = 'torrent';
            if (files.length > 0 && files[0].path) {
                const firstPathParts = files[0].path.split('/');
                torrentName = firstPathParts[0];
                logDebug(`Root folder name: "${torrentName}"`);
            }

            const processedFiles = [];
            const filesInfo = [];

            for (const file of files) {
                const arrayBuffer = await file.arrayBuffer();

                let relativePathString = file.path;
                if (relativePathString.startsWith(torrentName + '/')) {
                    relativePathString = relativePathString.substring(torrentName.length + 1);
                }

                // Prepare file for WebTorrent
                const newFile = new File([arrayBuffer], relativePathString, {
                    type: file.type,
                    lastModified: file.lastModified
                });
                processedFiles.push(newFile);

                // Prepare file info for the hook
                const pathParts = relativePathString.split('/');
                const filename = pathParts.pop();
                const path = pathParts.join('/');
                const info = { path: path, filename: filename, size: file.size, type: file.type };

                if (file.name.toLowerCase().endsWith('.pdf') || file.type === 'application/pdf') {
                    try {
                        const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);
                        info.pages = pdfDoc.getPageCount();
                    } catch (e) {
                        logWarn(`Could not get page count for PDF "${file.name}":`, e.message);
                    }
                }
                filesInfo.push(info);
            }

            logDebug('Processed files with full paths as names:', processedFiles.map(f => f.name));

            const client = new WebTorrent();
            client.on('error', (err) => {
                logError('WebTorrent client error:', err.message);
                dropzone.textContent = `Error creating torrent: ${err.message}`;
                client.destroy();
            });

            const announceUrl = announceUriInput ? announceUriInput.value : '';
            const opts = {
                name: torrentName,
                private: true,
                announceList: announceUrl ? [[announceUrl]] : []
            };

            logDebug('Creating torrent with options:', opts);

            client.seed(processedFiles, opts, async (torrent) => {
                logDebug('Torrent created successfully!');
                let newTorrentFile = new File([torrent.torrentFile], `${torrent.name}.torrent`, {
                    type: 'application/x-bittorrent',
                    lastModified: Date.now()
                });

                // --- CALLBACK HOOK ---
                if (Array.isArray(window.tfdz_beforeTorrentAddHooks)) {
                    logDebug(`Executing ${window.tfdz_beforeTorrentAddHooks.length} hook(s)...`);
                    for (const hook of window.tfdz_beforeTorrentAddHooks) {
                        try {
                            const modifiedFile = await hook({
                                torrentFile: newTorrentFile,
                                torrentMetadata: torrent,
                                filesInfo: filesInfo
                            });
                            if (modifiedFile instanceof File) {
                                newTorrentFile = modifiedFile;
                                logDebug('A hook returned a modified torrent file.');
                            }
                        } catch (err) {
                            logError('Error in a beforeTorrentAddHook:', err);
                        }
                    }
                }

                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(newTorrentFile);
                fileInput.files = dataTransfer.files;
                fileInput.dispatchEvent(new Event('change', { bubbles: true }));

                dropzone.innerHTML = '';
                const successMessage = document.createElement('span');
                successMessage.textContent = `Success! "${newTorrentFile.name}" created. `;
                dropzone.appendChild(successMessage);

                const downloadButton = document.createElement('button');
                downloadButton.type = 'button';
                downloadButton.id = `${PREFIX}download-btn`;
                downloadButton.textContent = 'Download .torrent';
                dropzone.appendChild(downloadButton);

                downloadButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    const downloadLink = document.createElement('a');
                    downloadLink.href = URL.createObjectURL(newTorrentFile);
                    downloadLink.download = newTorrentFile.name;
                    document.body.appendChild(downloadLink);
                    downloadLink.click();
                    document.body.removeChild(downloadLink);
                    URL.revokeObjectURL(downloadLink.href);
                });

                logDebug('Torrent processing finished. Hash:', torrent.infoHash);
                client.destroy();
            });
        };

        folderButton.addEventListener('click', () => folderInput.click());

        folderInput.addEventListener('change', () => {
            const files = Array.from(folderInput.files);
            logDebug(`Processing ${files.length} files from folder picker.`);
            files.forEach(file => {
                file.path = file.webkitRelativePath;
            });
            createTorrentFromFiles(files);
            folderInput.value = '';
        });

        dropzone.addEventListener('dragover', (event) => {
            event.preventDefault();
            event.stopPropagation();
            dropzone.classList.add(`${PREFIX}active`);
            dropzone.textContent = 'Release to create torrent';
        });

        dropzone.addEventListener('dragleave', (event) => {
            event.preventDefault();
            event.stopPropagation();
            dropzone.classList.remove(`${PREFIX}active`);
            dropzone.textContent = 'Drop files here (or a folder on Chrome)';
        });

        dropzone.addEventListener('drop', async (event) => {
            event.preventDefault();
            event.stopPropagation();
            dropzone.classList.remove(`${PREFIX}active`);
            dropzone.textContent = 'Processing files...';

            const items = event.dataTransfer.items;
            let files = [];

            if (items && items.length > 0 && items[0].webkitGetAsEntry) {
                logDebug('Processing dropped items as FileSystemEntry (Chrome)...');
                const entries = Array.from(items)
                    .map(item => item.webkitGetAsEntry())
                    .filter(Boolean);
                for (const entry of entries) {
                    files.push(...await getAllFiles(entry));
                }
            } else {
                logDebug('Processing dropped items as simple FileList (Firefox/Fallback)...');
                files = Array.from(event.dataTransfer.files);
                if (files.some(f => f.size > 0 && !f.type)) {
                    logWarn('Likely a folder drop on Firefox. This is not supported for drag-drop.');
                    dropzone.textContent = 'Folder drag-and-drop is unreliable on Firefox. Please use the "Select Folder" button.';
                    return;
                }
            }
            createTorrentFromFiles(files);
        });

        const style = document.createElement('style');
        style.textContent = `
            #${PREFIX}dropzone {
                border: 3px dashed #888; border-radius: 8px; padding: 25px; text-align: center;
                font-family: sans-serif; color: #555; background-color: #f9f9f9; cursor: pointer;
                transition: background-color 0.2s ease, border-color 0.2s ease; margin-bottom: 0.5em;
            }
            #${PREFIX}dropzone.${PREFIX}active {
                border-color: #0d6efd; background-color: #e7f0fe; color: #0d6efd;
            }
            #${PREFIX}folder-select-btn {
                display: block; width: 100%; margin-bottom: 1em; padding: 10px; border: 1px solid #ccc;
                border-radius: 8px; cursor: pointer; background-color: #f0f0f0; color: #333;
                font-family: sans-serif; font-weight: bold; text-align: center; transition: background-color 0.2s ease;
            }
            #${PREFIX}folder-select-btn:hover { background-color: #e0e0e0; }
            #${PREFIX}download-btn {
                margin-left: 10px; padding: 5px 10px; border: 1px solid #ccc; border-radius: 4px;
                cursor: pointer; background-color: #f0f0f0;
            }
            #${PREFIX}download-btn:hover { background-color: #e0e0e0; }
            @media (prefers-color-scheme: dark) {
                #${PREFIX}dropzone { border-color: #777; color: #ccc; background-color: #333; }
                #${PREFIX}dropzone.${PREFIX}active { border-color: #3b8aff; background-color: #1a2c4e; color: #3b8aff; }
                #${PREFIX}folder-select-btn { background-color: #555; border-color: #888; color: #eee; }
                #${PREFIX}folder-select-btn:hover { background-color: #666; }
                #${PREFIX}download-btn { background-color: #555; border-color: #888; color: #eee; }
                #${PREFIX}download-btn:hover { background-color: #666; }
            }
        `;
        document.head.appendChild(style);
    }

    loadScripts([
        'https://cdn.jsdelivr.net/npm/webtorrent@latest/webtorrent.min.js',
        'https://cdn.jsdelivr.net/npm/pdf-lib/dist/pdf-lib.min.js'
    ]).then(initializeDropzone).catch(err => {
        logError('Failed to load required libraries.', err);
    });

})();

