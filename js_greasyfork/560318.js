// ==UserScript==
// @name            Twitter/X Media Downloader
// @description     Download videos/pictures with one click | Automatically package them into a ZIP file for batch download
// @author          KanashiiWolf
// @namespace       https://wulf.nekoweb.org
// @homepage        https://wulf.nekoweb.org
// @supportURL      https://greasyfork.org/en/scripts/560318-twitter-x-media-downloader/feedback
// @license         MIT
// @icon            data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMwMGYzZmYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHlsZT0iYmFja2dyb3VuZDojMDAwIj48cGF0aCBkPSJNMTggNiA2IDE4Ii8+PHBhdGggZD0ibTYgNiAxMiAxMiIvPjwvc3ZnPg==
// @grant           GM_registerMenuCommand
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_download
// @grant           GM_xmlhttpRequest
// @match           https://x.com/*
// @match           https://twitter.com/*
// @version         1.0.3
// @require         https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js
// @downloadURL https://update.greasyfork.org/scripts/560318/TwitterX%20Media%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/560318/TwitterX%20Media%20Downloader.meta.js
// ==/UserScript==

/**
 * Code started from:
 * File: twitter-media-downloader.user.js
 * Project: UserScripts
 * Author: goemon2017,天音,Tiande,molanp,人民的勤务员@ChinaGodMan (china.qinwuyuan@gmail.com)
 * URL: https://github.com/ChinaGodMan/UserScripts
 * License: MIT License
 */

/* jshint esversion: 8 */

// ==========================================
// Constants & Configuration
// ==========================================
const FILENAME_PATTERN = '@{user-id}-{status-id}';
const INVALID_CHARS = { '\\': '＼', '/': '／', '|': '｜', '<': '＜', '>': '＞', ':': '：', '*': '＊', '?': '？', '"': '＂', '\u200b': '', '\u200c': '', '\u200d': '', '\u2060': '', '\ufeff': '', '🔞': '' };
// Selectors for media elements in the DOM
const MEDIA_SELECTOR = [
    'a[href*="/photo/1"]', 'div[role="progressbar"]', 'button[data-testid="playButton"]',
    'a[href="/settings/content_you_see"]', 'div.media-image-container', 'div.media-preview-container',
    'div[aria-labelledby]>div:first-child>div[role="button"][tabindex="0"]'
].join(',');

const TMD = (function () {
    // ==========================================
    // State Variables
    // ==========================================
    let lang, host, is_tweetdeck;
    let history_cache = new Set(); // Using Set for O(1) lookups and auto-deduplication

    // ==========================================
    // Helper Functions (Private)
    // ==========================================
    
    // Safely extract tweet ID from URL, handling params like ?newtwitter=true
    const getId = url => url.split('/status/').pop().split(/[/?#]/)[0];

    // Sanitize string for markdown/filenames
    const cleanText = str => str.replace(/([\\/|*?:"\u200b-\u200d\u2060\ufeff]|🔞)/g, c => INVALID_CHARS[c] || '');

    // Check if website is in dark mode
    const updateTheme = () => {
        let rgb = getComputedStyle(document.body).backgroundColor.match(/\d+/g);
        if (rgb && (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) < 128) {
            document.body.classList.add('tmd-dark');
        } else {
            document.body.classList.remove('tmd-dark');
        }
    };

    // ==========================================
    // Core Logic
    // ==========================================
    return {
        /**
         * Initialize the script, register menu commands, and start the observer.
         */
        init: async function () {
            // Wait 100ms to allow Old Twitter DOM injection to occur (if present)
            await new Promise(resolve => setTimeout(resolve, 100));

            // Check for #oldtwitter-version to prevent running on incompatible layouts
            if (document.querySelector('#oldtwitter-version')) {
                console.log('TMD: Old Twitter Layout detected. Aborting.');
                return;
            }

            // Fix: Bind 'this' to settings so it functions correctly when called from menu
            GM_registerMenuCommand((this.language[navigator.language] || this.language.en).settings, () => this.settings());
            GM_registerMenuCommand('Export History (Markdown)', async () => this.exportHistory());

            lang = this.language[document.querySelector('html').lang] || this.language.en;
            host = location.hostname;
            is_tweetdeck = host.indexOf('tweetdeck') >= 0;

            // Load history from storage into memory cache
            await this.history_load();

            document.head.insertAdjacentHTML('beforeend', '<style>' + this.css + '</style>');

            // Initial theme check
            updateTheme();

            // Observer to detect new tweets and theme changes
            new MutationObserver(ms => {
                ms.forEach(m => {
                    if (m.target === document.body && m.attributeName === 'style') updateTheme();
                    m.addedNodes.forEach(node => this.detect(node));
                });
            }).observe(document.body, { childList: true, subtree: true, attributes: true });

            // MANUAL SWEEP: Detect content that loaded during the 100ms delay
            document.querySelectorAll('article').forEach(article => this.addButtonTo(article));
            const existingMediaTabs = document.querySelectorAll('li[role="listitem"]');
            if (existingMediaTabs.length > 0) {
                this.addButtonToMedia(existingMediaTabs);
            }
        },

        // ==========================================
        // History Management (Refactored)
        // ==========================================
        
        history_load: async function() {
            // 1. Load standard GM storage
            let gm_data = await GM_getValue('download_history', []);
            
            // 2. Load legacy localStorage (migration path)
            let ls_data = JSON.parse(localStorage.getItem('history') || '[]');

            // 3. Merge into Set (Handles deduplication automatically)
            history_cache = new Set([...gm_data, ...ls_data]);

            // 4. Clean up legacy storage if found
            if (ls_data.length > 0) {
                localStorage.removeItem('history');
                await this.history_save();
            }
        },

        history_add: async function(val) {
            let prevSize = history_cache.size;
            
            // Handle both single string and array of strings
            if (Array.isArray(val)) {
                val.forEach(v => history_cache.add(v));
            } else {
                history_cache.add(val);
            }

            // Only write to disk if something actually changed
            if (history_cache.size > prevSize) {
                await this.history_save();
            }
        },

        history_save: async function() {
            // Convert Set back to Array for storage
            await GM_setValue('download_history', Array.from(history_cache));
        },

        history_clear: async function() {
            // 1. Clear memory cache
            history_cache.clear();
            
            // 2. Clear persistent storage
            await GM_setValue('download_history', []);
            
            // 3. Visual Feedback: Reset all "Completed" buttons on the page to "Download"
            document.querySelectorAll('.tmd-down.completed').forEach(btn => {
                this.status(btn, 'download', lang.download);
            });
        },

        // ==========================================
        // Export
        // ==========================================
        exportHistory: async function () {
            try {
                // Use cache for export
                const historyList = Array.from(history_cache);
                if (!historyList.length) return;

                const markdownContent = '# Twitter/X Media Downloader history\n\n' +
                    (await Promise.all(historyList.map(id => this.generateMarkdown(id)))).join('\n');

                const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `twitter_download_history_(${historyList.length}).md`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(link.href);
            } catch (error) {
                console.error('Error exporting history:', error);
                alert('An error occurred while exporting Markdown history.');
            }
        },

        generateMarkdown: async function (tweet_id, fetch = true) {
            // Skip individual image history entries (e.g., 12345_1) when generating generic tweet history
            if (tweet_id.includes('_')) return ''; 

            if (!fetch) return `[Tweet] - ${tweet_id} (https://x.com/i/web/status/${tweet_id})`;

            try {
                let json = await this.fetchJson(tweet_id);
                let tweet = json.quoted_status_result?.result?.legacy?.media || json.quoted_status_result?.result?.legacy || json.legacy;
                let user = json.core.user_results.result.legacy;
                
                // Clean inputs
                let user_name = cleanText(user.name);
                let full_text = cleanText(tweet.full_text.split('\n').join(' ').replace(/\s*https:\/\/t\.co\/\w+/g, ''));

                return `[${user_name} (@${user.screen_name})](https://x.com/i/web/status/${tweet_id})\n>  ${full_text}\n`;
            } catch (e) {
                return `[Error] - Could not fetch ${tweet_id}`;
            }
        },

        // ==========================================
        // DOM Detection & UI Injection
        // ==========================================
        detect: function (node) {
            // Standard: Check if node is ARTICLE or contains one
            let article = (node.tagName == 'ARTICLE' && node) || (node.tagName == 'DIV' && (node.querySelector('article') || node.closest('article')));
            if (article) this.addButtonTo(article);

            // Standard: Check if node is listitem (media tab)
            let listitems = (node.tagName == 'LI' && node.getAttribute('role') == 'listitem' && [node]) || (node.tagName == 'DIV' && node.querySelectorAll('li[role="listitem"]'));
            if (listitems) this.addButtonToMedia(listitems);
        },

        addButtonTo: function (article) {
            // Check for valid tweet link
            let statusLink = article.querySelector('a[href*="/status/"]');
            if (!statusLink) return;

            let status_id = getId(statusLink.href);
            
            // =================================================================
            // Main Button Logic (For Videos, GIFs, or Main Container)
            // =================================================================
            let media = article.querySelector(MEDIA_SELECTOR);
            if (media) {
                let btn_group = article.querySelector('div[role="group"]:last-of-type, ul.tweet-actions, ul.tweet-detail-actions');
                if (btn_group) {
                    let existingBtn = btn_group.querySelector('.tmd-down:not(.tmd-img)');
                    
                    // Cleanup Stale Button (Recycled DOM Node)
                    if (existingBtn && existingBtn.dataset.statusId !== status_id) {
                        existingBtn.remove();
                        existingBtn = null;
                    }

                    // Check history using Set
                    let is_exist = history_cache.has(status_id);

                    if (!existingBtn) {
                        // Create Button
                        let btn_share = Array.from(btn_group.querySelectorAll(':scope>div>div, li.tweet-action-item>a, li.tweet-detail-action-item>a')).pop().parentNode;
                        let btn_down = btn_share.cloneNode(true);
                        
                        btn_down.querySelector('button').removeAttribute('disabled');
                        
                        if (is_tweetdeck) {
                            btn_down.firstElementChild.innerHTML = `<svg viewBox="0 0 24 24" style="width: 18px; height: 18px;">${this.svg}</svg>`;
                            btn_down.firstElementChild.removeAttribute('rel');
                            btn_down.classList.replace('pull-left', 'pull-right');
                        } else {
                            btn_down.querySelector('svg').innerHTML = this.svg;
                        }

                        // Store ID on button for future staleness checks
                        btn_down.dataset.statusId = status_id;
                        this.status(btn_down, 'tmd-down');

                        // Insert
                        btn_group.insertBefore(btn_down, btn_share.nextSibling);
                        
                        // Setup logic
                        this.status(btn_down, is_exist ? 'completed' : 'download', is_exist ? lang.completed : lang.download);
                        btn_down.onclick = () => this.click(btn_down, status_id, is_exist);
                    } else {
                        // Button exists & ID matches: Update status
                        this.status(existingBtn, is_exist ? 'completed' : 'download', is_exist ? lang.completed : lang.download);
                        // Ensure click handler has latest state
                        existingBtn.onclick = () => this.click(existingBtn, status_id, is_exist);
                    }
                }
            }

            // =================================================================
            // Multiple Images Logic
            // =================================================================
            let imgs = article.querySelectorAll('a[href*="/photo/"]');
            if (imgs.length > 0) {
                let main_status_id = status_id;
                let all_images_downloaded = true;

                imgs.forEach(img => {
                    let urlParts = img.href.split('/status/');
                    if (urlParts.length < 2) return;

                    let specific_id = urlParts[1].split('/')[0];
                    let index = urlParts[1].split('/').pop().split(/[/?#]/)[0];
                    let img_uid = `${specific_id}_${index}`;
                    
                    // Check history using Set
                    let is_exist = history_cache.has(img_uid) || history_cache.has(specific_id);
                    if (!is_exist) all_images_downloaded = false;

                    let existingImgBtn = img.parentNode.querySelector('.tmd-down.tmd-img');

                    // Cleanup Stale Button (Recycled DOM Node)
                    if (existingImgBtn && existingImgBtn.dataset.imgUid !== img_uid) {
                        existingImgBtn.remove();
                        existingImgBtn = null;
                    }

                    if (!existingImgBtn) {
                        let btn_down = document.createElement('div');
                        // Use larger dimensions for image buttons (24px vs 18px)
                        btn_down.innerHTML = `<div><div><svg viewBox="0 0 24 24" style="width: 24px; height: 24px;">${this.svg}</svg></div></div>`;
                        btn_down.classList.add('tmd-down', 'tmd-img');
                        btn_down.dataset.imgUid = img_uid;
                        btn_down.dataset.statusId = specific_id;

                        this.status(btn_down, is_exist ? 'completed' : 'download');
                        
                        img.parentNode.classList.add('tmd-img-parent');
                        img.parentNode.appendChild(btn_down);
                        
                        btn_down.onclick = e => {
                            e.preventDefault();
                            e.stopPropagation();
                            // Re-check state on click
                            let current_exist = history_cache.has(img_uid) || history_cache.has(specific_id);
                            this.click(btn_down, specific_id, current_exist, index);
                        };
                    } else {
                         // Update status
                         this.status(existingImgBtn, is_exist ? 'completed' : 'download');
                    }
                });

                // Update Main Button if all images are done
                if (all_images_downloaded && media) {
                     let mainBtn = article.querySelector('.tmd-down:not(.tmd-img)');
                     if (mainBtn && !history_cache.has(main_status_id)) {
                         this.status(mainBtn, 'completed', lang.completed);
                     }
                }
            }
        },

        addButtonToMedia: function (listitems) {
            listitems.forEach(li => {
                let statusLink = li.querySelector('a[href*="/status/"]');
                if (!statusLink) return;

                let status_id = getId(statusLink.href);
                let is_exist = history_cache.has(status_id);
                
                let existingBtn = li.querySelector('.tmd-down.tmd-media');

                // Cleanup Stale Button
                if (existingBtn && existingBtn.dataset.statusId !== status_id) {
                    existingBtn.remove();
                    existingBtn = null;
                }

                if (!existingBtn) {
                    let btn_down = document.createElement('div');
                    btn_down.innerHTML = `<div><div><svg viewBox="0 0 24 24" style="width: 18px; height: 18px;">${this.svg}</svg></div></div>`;
                    btn_down.classList.add('tmd-down', 'tmd-media');
                    btn_down.dataset.statusId = status_id;
                    
                    this.status(btn_down, is_exist ? 'completed' : 'download', is_exist ? lang.completed : lang.download);
                    li.appendChild(btn_down);
                    btn_down.onclick = () => this.click(btn_down, status_id, is_exist);
                } else {
                    // Update status
                    this.status(existingBtn, is_exist ? 'completed' : 'download', is_exist ? lang.completed : lang.download);
                    existingBtn.onclick = () => this.click(existingBtn, status_id, is_exist);
                }
            });
        },

        // ==========================================
        // User Interactions
        // ==========================================
        selectTweetDialog: function (originalUser, quotedUser) {
            return new Promise(resolve => {
                const overlay = document.createElement('div');
                overlay.className = 'tmd-overlay';
                
                const dialog = document.createElement('div');
                dialog.className = 'tmd-modal';
                
                const title = document.createElement('h3');
                title.innerText = `${lang.choose}`;
                
                const container = document.createElement('div');
                container.style.cssText = 'display:flex;flex-direction:column;gap:12px;';

                const createBtn = (text, type) => {
                    const btn = document.createElement('button');
                    btn.textContent = text;
                    btn.className = `tmd-btn ${type || ''}`;
                    return btn;
                };

                const originalBtn = createBtn(`${lang.original} (by ${originalUser})`);
                originalBtn.onclick = () => { resolve('original'); overlay.remove(); };

                const quotedBtn = createBtn(`${lang.quote} (by ${quotedUser})`, 'secondary');
                quotedBtn.onclick = () => { resolve('quoted'); overlay.remove(); };

                const cancelBtn = createBtn(`${lang.cancel}`, 'text');
                cancelBtn.onclick = () => { resolve(null); overlay.remove(); };

                container.append(originalBtn, quotedBtn, cancelBtn);
                dialog.append(title, container);
                overlay.appendChild(dialog);
                document.body.appendChild(overlay);
                
                overlay.onclick = e => { if (e.target === overlay) { resolve(null); overlay.remove(); }};
            });
        },

        click: async function (btn, status_id, is_exist, index) {
            if (btn.classList.contains('loading')) return;
            this.status(btn, 'loading');

            let out = (await GM_getValue('filename', FILENAME_PATTERN)).split('\n').join('');
            let save_history = await GM_getValue('save_history', true);
            let json;
            
            try {
                json = await this.fetchJson(status_id);
            } catch (e) {
                return this.status(btn, 'failed', 'API Error');
            }

            // Check media availability
            let hasOriginal = json.legacy?.extended_entities?.media || json.legacy?.media;
            let quotedResult = json.quoted_status_result?.result;
            let hasQuoted = quotedResult?.legacy?.extended_entities?.media || quotedResult?.legacy?.media;

            let tweet, user;
            let download_id = status_id; // Default to the requested ID

            // If we have an index (specific photo download), we don't need the dialog.
            if (index) {
                if (hasOriginal) {
                     tweet = json.legacy;
                     user = json.core.user_results.result.legacy;
                } else if (hasQuoted) {
                     tweet = quotedResult.legacy;
                     user = quotedResult.core.user_results.result.legacy;
                     // In individual mode, status_id is usually correct, but let's be safe
                     download_id = tweet.id_str;
                } else {
                     return this.status(btn, 'failed', 'MEDIA_NOT_FOUND');
                }
            } else if (hasOriginal && hasQuoted) {
                let originalUser = `${json.core?.user_results?.result?.legacy?.name} @${json.core?.user_results?.result?.legacy?.screen_name}`;
                let quotedUser = `${quotedResult?.core?.user_results?.result?.legacy?.name} @${quotedResult?.core?.user_results?.result?.legacy?.screen_name}`;
                
                let choice = await this.selectTweetDialog(originalUser, quotedUser);
                if (!choice) return this.status(btn, 'download', lang.download);

                let target = choice === 'quoted' ? quotedResult : json;
                tweet = target.legacy;
                user = target.core.user_results.result.legacy;
                // Update ID if we switched targets
                download_id = tweet.id_str; 
            } else if (hasQuoted) {
                tweet = quotedResult.legacy;
                user = quotedResult.core.user_results.result.legacy;
                download_id = tweet.id_str;
            } else {
                tweet = json.legacy;
                user = json.core.user_results.result.legacy;
            }

            let datetime = out.match(/\{date-time(-local)?:[^{}]+\}/) ? out.match(/\{date-time(?:-local)?:([^{}]+)\}/)[1].replace(/[\\/|<>*?:"]/g, v => INVALID_CHARS[v] || '') : 'YYYYMMDD-hhmmss';
            let info = {
                'status-id': download_id, // Use actual ID
                'user-name': cleanText(user.name),
                'user-id': user.screen_name,
                'date-time': this.formatDate(tweet.created_at, datetime),
                'date-time-local': this.formatDate(tweet.created_at, datetime, true),
                'full-text': cleanText(tweet.full_text.split('\n').join(' ').replace(/\s*https:\/\/t\.co\/\w+/g, ''))
            };

            let medias = tweet.extended_entities?.media || tweet.media;
            
            if (json?.card) return this.status(btn, 'failed', 'Links not supported');
            if (!Array.isArray(medias)) return this.status(btn, 'failed', 'MEDIA_NOT_FOUND');

            let mediaToDownload = medias;
            let isIndividual = false;

            if (index) {
                let mediaIndex = parseInt(index) - 1; 
                if (medias[mediaIndex]) {
                    mediaToDownload = [medias[mediaIndex]];
                    isIndividual = true;
                } else {
                    return this.status(btn, 'failed', 'Invalid Media Index');
                }
            }

            if (mediaToDownload.length > 0) {
                // Generate ZIP name
                let zipName = out.replace(/\.?\{file-ext\}/, '').replace(/\{([^{}:]+)(:[^{}]+)?\}/g, (match, name) => info[name] || match);

                let tasks = mediaToDownload.map((media, i) => {
                    let url = media.type == 'photo' ? media.media_url_https + ':orig' : media.video_info.variants.filter(n => n.content_type == 'video/mp4').sort((a, b) => b.bitrate - a.bitrate)[0].url;
                    let ext = url.split('/').pop().split(/[:?]/).shift().split('.').pop();
                    // If individual, use index from arg, else loop index
                    let idx = isIndividual ? (parseInt(index) - 1) : i; 
                    let filename = (out.replace(/\.?\{file-ext\}/, '') + ((medias.length > 1 || index) && !out.match('{file-name}') ? '-' + idx : '') + '.' + ext).replace(/\{([^{}:]+)(:[^{}]+)?\}/g, (match, name) => info[name] || match);
                    return { url: url, name: filename };
                });

                // Completion Callback for History Sync
                const onDownloadComplete = async () => {
                    if (!save_history) return;

                    if (isIndividual) {
                        // 1. Save specific image history (e.g. 12345_1)
                        let imgUid = `${download_id}_${index}`;
                        await this.history_add(imgUid); 

                        // 2. Check if all sibling images are now downloaded
                        let article = btn.closest('article');
                        if (article) {
                            let allImgs = Array.from(article.querySelectorAll('.tmd-down.tmd-img'));
                            // Filter to only buttons belonging to THIS tweet (Using download_id)
                            let siblingImgs = allImgs.filter(b => b.dataset.statusId === download_id);
                            
                            // Check if all siblings are done (either just done, or in history)
                            let allDone = siblingImgs.every(b => {
                                let uid = b.dataset.imgUid;
                                return history_cache.has(uid) || history_cache.has(download_id);
                            });

                            if (allDone) {
                                // Mark main button for this specific ID as completed
                                let mainBtns = Array.from(article.querySelectorAll('.tmd-down:not(.tmd-img)'));
                                let targetMainBtn = mainBtns.find(b => b.dataset.statusId === download_id);
                                if (targetMainBtn) {
                                    this.status(targetMainBtn, 'completed', lang.completed);
                                    this.history_add(download_id); 
                                }
                            }
                        }
                    } else {
                        // Batch download
                        // 1. Save main ID (of the actual content downloaded)
                        this.history_add(download_id); 
                        
                        // 2. Save all individual IDs for this tweet
                        let individualIds = medias.map((_, i) => `${download_id}_${i+1}`);
                        this.history_add(individualIds);

                        // 3. Visual Sync: Update all individual buttons matching the downloaded ID
                        let article = btn.closest('article');
                        if (article) {
                            let allImgs = Array.from(article.querySelectorAll('.tmd-down.tmd-img'));
                            // Filter to match download_id so we don't color original images if we downloaded quoted (or vice versa)
                            allImgs.filter(b => b.dataset.statusId === download_id)
                                   .forEach(b => this.status(b, 'completed', lang.completed));
                            
                            // Also update any matching main buttons (e.g. if quoted tweet has its own container)
                            let allMainBtns = Array.from(article.querySelectorAll('.tmd-down:not(.tmd-img)'));
                            allMainBtns.filter(b => b.dataset.statusId === download_id)
                                       .forEach(b => this.status(b, 'completed', lang.completed));
                        }
                    }
                };

                this.downloader.add(tasks, btn, GM_getValue('enable_packaging', true) && !isIndividual, zipName, onDownloadComplete);
            } else {
                this.status(btn, 'failed', 'MEDIA_NOT_FOUND');
            }
        },

        // ==========================================
        // Download Module
        // ==========================================
        downloader: (function () {
            let tasks = [], thread = 0, failed = 0, notifier, has_failed = false;
            return {
                add: function (taskList, btn, packaging, zipName, onComplete) {
                    tasks.push(...taskList);
                    this.update();
                    
                    const handleComplete = () => {
                        this.status(btn, 'completed', lang.completed);
                        if (onComplete) onComplete();
                    };

                    // Packaging mode (Only if multiple files and enabled)
                    if (packaging && taskList.length > 1) {
                        let zip = new JSZip();
                        let promises = taskList.map(task => {
                            thread++; this.update();
                            return new Promise((resolve, reject) => {
                                GM_xmlhttpRequest({
                                    method: "GET",
                                    url: task.url,
                                    responseType: "arraybuffer",
                                    onload: (response) => {
                                        if (response.status >= 200 && response.status < 300) {
                                            zip.file(task.name, response.response);
                                            resolve();
                                        } else {
                                            reject(new Error(`HTTP ${response.status}`));
                                        }
                                    },
                                    onerror: (e) => reject(new Error("Network Error")),
                                    onabort: () => reject(new Error("Aborted"))
                                });
                            })
                            .then(() => {
                                tasks = tasks.filter(t => t.url !== task.url);
                            })
                            .catch(e => {
                                failed++;
                                tasks = tasks.filter(t => t.url !== task.url);
                                console.error(`Download failed for ${task.name}:`, e);
                            })
                            .finally(() => {
                                thread--;
                                this.update();
                            });
                        });

                        Promise.allSettled(promises).then(() => {
                            if (Object.keys(zip.files).length > 0) {
                                zip.generateAsync({ type: 'blob' }).then(content => {
                                    let a = document.createElement('a'); 
                                    a.href = URL.createObjectURL(content); 
                                    a.download = `${zipName}.zip`; 
                                    a.click();
                                    handleComplete();
                                    setTimeout(() => URL.revokeObjectURL(a.href), 60000);
                                }).catch(err => {
                                     console.error("ZIP Generation Error:", err);
                                     this.status(btn, 'failed', 'ZIP Error');
                                });
                            } else {
                                this.status(btn, 'failed', 'All downloads failed');
                            }
                        });

                    } else {
                        // Standard mode
                        taskList.forEach(task => {
                            thread++; this.update();
                            GM_download({
                                url: task.url, name: task.name,
                                onload: () => { 
                                    thread--; 
                                    tasks = tasks.filter(t => t.url !== task.url); 
                                    handleComplete(); 
                                    this.update(); 
                                },
                                onerror: e => { 
                                    thread--; failed++; 
                                    tasks = tasks.filter(t => t.url !== task.url); 
                                    this.status(btn, 'failed', e.details.current); 
                                    this.update(); 
                                }
                            });
                        });
                    }
                },
                status: function (btn, css, title, style) {
                    if (css) { btn.classList.remove('download', 'completed', 'loading', 'failed'); btn.classList.add(css); }
                    if (title) btn.title = title;
                    if (style) btn.style.cssText = style;
                },
                update: function () {
                    if (!notifier) {
                        notifier = document.createElement('div'); notifier.className = 'tmd-notifier'; notifier.title = 'Twitter Media Downloader';
                        notifier.innerHTML = '<label>0</label>|<label>0</label>'; document.body.appendChild(notifier);
                    }
                    if (failed > 0 && !has_failed) {
                        has_failed = true; notifier.innerHTML += '|';
                        let clear = document.createElement('label'); notifier.appendChild(clear);
                        clear.onclick = () => { notifier.innerHTML = '<label>0</label>|<label>0</label>'; failed = 0; has_failed = false; this.update(); };
                    }
                    notifier.firstChild.innerText = thread;
                    notifier.firstChild.nextElementSibling.innerText = tasks.length - thread - failed;
                    if (failed > 0) notifier.lastChild.innerText = failed;
                    notifier.classList.toggle('running', thread > 0 || tasks.length > 0 || failed > 0);
                }
            };
        })(),

        // ==========================================
        // Helper Functions
        // ==========================================
        status: function (btn, css, title, style) {
            if (css) { btn.classList.remove('download', 'completed', 'loading', 'failed'); btn.classList.add(css); }
            if (title) btn.title = title;
            if (style) btn.style.cssText = style;
        },

        settings: async function () {
            const $el = (p, t, c, k) => {
                let e = document.createElement(t);
                if (c !== undefined) {
                    if (t === 'input') {
                        if (c === 'checkbox') e.type = 'checkbox';
                        else e.value = c;
                    } else if (t === 'textarea') {
                        e.value = c;
                    } else {
                        e.innerHTML = c;
                    }
                }
                if (k) e.className = k;
                p.appendChild(e); return e;
            };

            let w = $el(document.body, 'div', '', 'tmd-overlay');
            let wc; w.onmousedown = e => wc = e.target == w; w.onmouseup = e => { if (wc && e.target == w) w.remove(); };

            let d = $el(w, 'div', '', 'tmd-modal');
            let t = $el(d, 'h3', lang.dialog.title);
            let o = $el(d, 'div', '', 'tmd-option-group');

            // Save History
            let shl = $el(o, 'label', lang.dialog.save_history, 'tmd-label');
            let shi = $el(shl, 'input', 'checkbox');
            shi.checked = await GM_getValue('save_history', true);
            shi.onchange = () => GM_setValue('save_history', shi.checked);

            let clr = $el(shl, 'label', lang.dialog.clear_history, 'tmd-link');
            clr.onclick = (e) => {
                e.preventDefault();
                if (confirm(lang.dialog.clear_confirm)) { 
                    this.history_clear(); // UPDATED
                }
            };

            // Packaging
            let sep = $el(o, 'label', lang.enable_packaging, 'tmd-label');
            let sepi = $el(sep, 'input', 'checkbox');
            sepi.checked = await GM_getValue('enable_packaging', true);
            sepi.onchange = () => GM_setValue('enable_packaging', sepi.checked);

            // Filename
            let fd = $el(d, 'div', '', 'tmd-option-group');
            $el(fd, 'label', lang.dialog.pattern, 'tmd-label');
            let fi = $el(fd, 'textarea', await GM_getValue('filename', FILENAME_PATTERN), 'tmd-textarea');
            fi.addEventListener('mousedown', e => e.stopPropagation()); // Prevent drag/selection issues if parent has listeners
            
            let ft = $el(fd, 'div', `
                <span class="tmd-tag" title="user name">{user-name}</span>
                <span class="tmd-tag" title="The user name after @ sign.">{user-id}</span>
                <span class="tmd-tag" title="example: 1234567890987654321">{status-id}</span>
                <span class="tmd-tag" title="{date-time} : Posted time in UTC.\n{date-time-local} : Your local time zone.\n\nDefault:\nYYYYMMDD-hhmmss => 20201231-235959\n\nExample of custom:\n{date-time:DD-MMM-YY hh.mm} => 31-DEC-21 23.59">{date-time}</span>
                <span class="tmd-tag" title="Text content in tweet.">{full-text}</span>
                <span class="tmd-tag" title="Type of &#34;video&#34; or &#34;photo&#34; or &#34;gif&#34;.">{file-type}</span>
                <span class="tmd-tag" title="Original filename from URL.">{file-name}</span>`, 'tmd-tags');
            
            ft.querySelectorAll('.tmd-tag').forEach(tag => {
                tag.onclick = () => {
                    let s = fi.selectionStart, e = fi.selectionEnd;
                    // Use textContent to get the text exactly as it is in the HTML, avoiding CSS transforms (uppercase)
                    let text = tag.textContent;
                    fi.value = fi.value.substring(0, s) + text + fi.value.substring(e);
                    fi.selectionStart = fi.selectionEnd = s + text.length; fi.focus();
                };
            });

            // Footer
            let footer = $el(d, 'div', '', 'tmd-footer');
            let saveBtn = $el(footer, 'button', lang.dialog.save, 'tmd-btn');
            saveBtn.onclick = async () => { await GM_setValue('filename', fi.value); w.remove(); };
        },

        fetchJson: async function (status_id) {
            let base = `https://${host}/i/api/graphql/2ICDjqPd81tulZcYrtpTuQ/TweetResultByRestId`;
            let vars = { tweetId: status_id, with_rux_injections: false, includePromotedContent: true, withCommunity: true, withQuickPromoteEligibilityTweetFields: true, withBirdwatchNotes: true, withVoice: true, withV2Timeline: true };
            let feats = { articles_preview_enabled: true, c9s_tweet_anatomy_moderator_badge_enabled: true, communities_web_enable_tweet_community_results_fetch: false, creator_subscriptions_quote_tweet_preview_enabled: false, creator_subscriptions_tweet_preview_api_enabled: false, freedom_of_speech_not_reach_fetch_enabled: true, graphql_is_translatable_rweb_tweet_is_translatable_enabled: true, longform_notetweets_consumption_enabled: false, longform_notetweets_inline_media_enabled: true, longform_notetweets_rich_text_read_enabled: false, premium_content_api_read_enabled: false, profile_label_improvements_pcf_label_in_post_enabled: true, responsive_web_edit_tweet_api_enabled: false, responsive_web_enhance_cards_enabled: false, responsive_web_graphql_exclude_directive_enabled: false, responsive_web_graphql_skip_user_profile_image_extensions_enabled: false, responsive_web_graphql_timeline_navigation_enabled: false, responsive_web_grok_analysis_button_from_backend: false, responsive_web_grok_analyze_button_fetch_trends_enabled: false, responsive_web_grok_analyze_post_followups_enabled: false, responsive_web_grok_image_annotation_enabled: false, responsive_web_grok_share_attachment_enabled: false, responsive_web_grok_show_grok_translated_post: false, responsive_web_jetfuel_frame: false, responsive_web_media_download_video_enabled: false, responsive_web_twitter_article_tweet_consumption_enabled: true, rweb_tipjar_consumption_enabled: true, rweb_video_screen_enabled: false, standardized_nudges_misinfo: true, tweet_awards_web_tipping_enabled: false, tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled: true, tweetypie_unmention_optimization_enabled: false, verified_phone_label_enabled: false, view_counts_everywhere_api_enabled: true };
            
            let c = this.getCookie();
            let h = { authorization: 'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA', 'x-twitter-active-user': 'yes', 'x-twitter-client-language': c.lang, 'x-csrf-token': c.ct0 };
            if (c.ct0?.length == 32) h['x-guest-token'] = c.gt;

            try {
                let url = encodeURI(`${base}?variables=${JSON.stringify(vars)}&features=${JSON.stringify(feats)}`);
                let r = await fetch(url, { headers: h });
                if (!r.ok) throw new Error('HTTP ' + r.status);
                let text = await r.text();
                if (!text) throw new Error('Empty response');
                let res = JSON.parse(text);
                return res.data.tweetResult.result.tweet || res.data.tweetResult.result;
            } catch (e) {
                console.error('API Error:', e);
                throw e;
            }
        },

        getCookie: function (name) {
            let c = {}; document.cookie.split(';').forEach(n => { let [k, v] = n.split('='); if (k && v) c[k.trim()] = v.trim(); });
            return name ? c[name] : c;
        },

        formatDate: function (i, o, tz) {
            let d = new Date(i);
            if (tz) d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
            let m = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
            let v = {
                YYYY: d.getUTCFullYear(), YY: d.getUTCFullYear(), MM: d.getUTCMonth() + 1, MMM: m[d.getUTCMonth()],
                DD: d.getUTCDate(), hh: d.getUTCHours(), mm: d.getUTCMinutes(), ss: d.getUTCSeconds(),
                h2: d.getUTCHours() % 12, ap: d.getUTCHours() < 12 ? 'AM' : 'PM'
            };
            return o.replace(/(YY(YY)?|MMM?|DD|hh|mm|ss|h2|ap)/g, n => ('0' + v[n]).toString().substr(-n.length));
        },

        // ==========================================
        // Assets & Locales
        // ==========================================
        language: {
            en: {
                download: 'Download', completed: 'Download Completed', settings: 'Settings',
                dialog: { title: 'Download Settings', save: 'Save', save_history: 'Remember download history', clear_history: '(Clear)', clear_confirm: 'Clear download history?', pattern: 'File Name Pattern' },
                enable_packaging: 'Package multiple files into a ZIP', original: 'Original Tweet', quote: 'Quoted Tweet', cancel: 'Cancel', choose: 'Select media to download'
            }
        },

        css: `
            :root {
                --tmd-bg: #ffffff;
                --tmd-bg-modal: rgba(255, 255, 255, 0.98);
                --tmd-text: #000000;
                --tmd-border: #000000;
                --tmd-hover: #ff003c;
                --tmd-accent: #ff003c; /* Cyber Red */
                --tmd-accent-hover: #c4002f;
                --tmd-text-btn: #ffffff;
                --tmd-shadow: 5px 5px 0px rgba(0,0,0,1);
                --tmd-radius: 0px;
                --tmd-font: "Courier New", monospace;
                
                /* State Colors (Light Mode) */
                --tmd-state-down: #00f3ff; /* Cyan */
                --tmd-state-done: #39ff14; /* Green */
                --tmd-state-load: #fdf500; /* Yellow */
                --tmd-state-fail: #ff003c; /* Red */
                --tmd-icon-color: #000000; /* Black icons */
                --tmd-shadow-color: #000000;
            }
            body.tmd-dark {
                --tmd-bg: #000000;
                --tmd-bg-modal: rgba(10, 10, 10, 0.95);
                --tmd-text: #00f3ff; /* Cyber Cyan */
                --tmd-border: #00f3ff;
                --tmd-hover: rgba(0, 243, 255, 0.2);
                --tmd-accent: #ffee00; /* Cyber Yellow */
                --tmd-accent-hover: #d4c600;
                --tmd-text-btn: #000000;
                --tmd-shadow: 0 0 15px rgba(0, 243, 255, 0.4);
                --tmd-radius: 2px;
                --tmd-font: "Consolas", "Monaco", monospace;
                
                /* State Colors (Dark Mode) */
                --tmd-state-down: #00f3ff;
                --tmd-state-done: #39ff14;
                --tmd-state-load: #fdf500;
                --tmd-state-fail: #ff003c;
                --tmd-icon-color: #000000;
                --tmd-shadow-color: #ffffff;
            }

            .tmd-down {margin-left: 12px; order: 99;}
            
            /* Define local scoped variable for the specific state */
            .tmd-down { --btn-color: var(--tmd-state-down); }
            .tmd-down.completed { --btn-color: var(--tmd-state-done); }
            .tmd-down.loading { --btn-color: var(--tmd-state-load); }
            .tmd-down.failed { --btn-color: var(--tmd-state-fail); }

            /* Specific Selector to Target Button Background */
            .tmd-down button > div {
                background-color: var(--btn-color) !important;
                border-radius: 0px !important;
                border: 2px solid var(--tmd-text) !important;
                box-shadow: 4px 4px 0px var(--tmd-shadow-color) !important;
                color: var(--tmd-icon-color) !important;
                opacity: 1 !important;
                transition: all 0.1s ease !important;
            }
            
            /* Specific Selector to Target Button Background Hover */
            .tmd-down button:hover > div {
                transform: translate(2px, 2px) !important;
                box-shadow: 2px 2px 0px var(--tmd-shadow-color) !important;
            }

            /* Specific Selector to Target SVG Icon Color */
            .tmd-down svg {
                color: var(--tmd-icon-color) !important;
                fill: var(--tmd-icon-color) !important;
                filter: none !important;
            }
            
            /* Ensure paths inherit the forced color */
            .tmd-down svg path, .tmd-down svg rect, .tmd-down svg circle {
                fill: currentColor !important;
                stroke: none !important;
            }
            
            /* Loading Spinner needs Stroke, not Fill */
            .tmd-down svg g.loading path, .tmd-down svg g.loading circle {
                fill: none !important;
                stroke: currentColor !important;
            }

            /* Media overlay buttons */
            .tmd-down.tmd-img {
                position: absolute; left: 10px; top: 10px; 
                z-index: 999;
                display: none; /* HIDDEN BY DEFAULT */
            }
            .tmd-img-parent:hover .tmd-down.tmd-img {
                display: block; /* SHOW ON HOVER */
            }
            .tmd-down.tmd-img > div {
                display: flex; border-radius: 0px; margin: 0;
                background-color: var(--btn-color);
                border: 2px solid var(--tmd-text);
                box-shadow: 3px 3px 0px var(--tmd-shadow-color);
                cursor: pointer;
                transition: all 0.1s ease;
            }
            .tmd-down.tmd-img:hover > div {
                transform: translate(1px, 1px);
                box-shadow: 2px 2px 0px var(--tmd-shadow-color);
                background-color: var(--tmd-accent-hover);
            }
            .tmd-down.tmd-img svg {
                width: 24px; height: 24px;
                color: var(--tmd-icon-color) !important;
                fill: var(--tmd-icon-color) !important;
                margin: 4px;
            }
            
            .tmd-down g {display: none;}
            .tmd-down.download g.download, .tmd-down.completed g.completed, .tmd-down.loading g.loading,.tmd-down.failed g.failed {display: unset;}
            .tmd-down.loading svg {animation: spin 1s linear infinite;}
            @keyframes spin {0% {transform: rotate(0deg);} 100% {transform: rotate(360deg);}}

            /* Modern Modal & Overlay */
            .tmd-overlay {
                position: fixed; left: 0; top: 0; width: 100%; height: 100%;
                background-color: rgba(0,0,0,0.4); z-index: 2147483647;
                backdrop-filter: blur(4px);
                display: flex; justify-content: center; align-items: center;
            }
            .tmd-modal {
                background: var(--tmd-bg-modal);
                color: var(--tmd-text);
                border: 2px solid var(--tmd-border);
                border-radius: var(--tmd-radius);
                padding: 24px;
                width: 400px;
                max-width: 90vw;
                box-shadow: var(--tmd-shadow);
                font-family: var(--tmd-font);
                backdrop-filter: blur(12px);
                display: flex; flex-direction: column;
                text-transform: uppercase;
                letter-spacing: 1px;
                z-index: 2147483647;
            }
            .tmd-modal h3 {
                margin: 0 0 20px 0; text-align: center;
                font-size: 20px; font-weight: 700;
                text-shadow: 0 0 5px var(--tmd-text);
            }
            
            /* Buttons */
            .tmd-btn {
                background: var(--tmd-accent); color: var(--tmd-text-btn);
                border: 1px solid var(--tmd-accent); border-radius: var(--tmd-radius);
                padding: 12px 24px; font-size: 15px; font-weight: 700;
                cursor: pointer; transition: 0.2s;
                width: 100%; text-align: center;
                margin-bottom: 8px;
                font-family: var(--tmd-font);
                text-transform: uppercase;
                letter-spacing: 1px;
                box-shadow: 0 0 10px var(--tmd-accent);
            }
            .tmd-btn:hover { 
                background-color: var(--tmd-accent-hover); 
                box-shadow: 0 0 20px var(--tmd-accent);
            }
            .tmd-btn.secondary {
                background: transparent; color: var(--tmd-accent);
                border: 1px solid var(--tmd-accent);
                box-shadow: none;
            }
            .tmd-btn.secondary:hover { 
                background-color: var(--tmd-hover); 
                box-shadow: 0 0 10px var(--tmd-accent);
            }
            .tmd-btn.text {
                background: transparent; color: var(--tmd-text);
                font-weight: 400; padding: 8px;
                border: none; box-shadow: none;
                opacity: 0.7;
            }
            .tmd-btn.text:hover { 
                opacity: 1; text-decoration: underline; 
                background: transparent; box-shadow: none;
            }

            /* Settings Styles */
            .tmd-option-group {
                border: 1px solid var(--tmd-border);
                border-radius: var(--tmd-radius);
                padding: 12px; margin-bottom: 12px;
                background: rgba(0,0,0,0.2);
            }
            .tmd-label {
                display: flex; justify-content: space-between; align-items: center;
                margin: 12px 0; font-size: 14px; font-weight: 600; cursor: pointer; color: var(--tmd-text);
            }
            .tmd-label input { 
                margin: 0; width: 16px; height: 16px; 
                accent-color: var(--tmd-accent);
                cursor: pointer;
            }
            .tmd-link {
                color: var(--tmd-accent); font-size: 12px; margin-left: 10px; 
                cursor: pointer; text-decoration: none; border-bottom: 1px dotted var(--tmd-accent);
            }
            .tmd-link:hover { color: var(--tmd-text); border-bottom-style: solid; }
            
            .tmd-textarea {
                width: 100%; min-height: 80px;
                background: rgba(0,0,0,0.3); color: var(--tmd-text);
                border: 1px solid var(--tmd-border);
                border-radius: var(--tmd-radius); padding: 8px;
                font-family: var(--tmd-font); font-size: 12px;
                margin-top: 8px; box-sizing: border-box;
                user-select: text !important;
                -webkit-user-select: text !important;
                cursor: text !important;
            }
            .tmd-textarea:focus { outline: none; border-color: var(--tmd-accent); box-shadow: 0 0 5px var(--tmd-accent); }
            
            .tmd-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 12px; }
            .tmd-tag {
                background-color: transparent;
                color: var(--tmd-accent);
                border: 1px solid var(--tmd-accent);
                padding: 4px 8px; border-radius: var(--tmd-radius);
                font-size: 11px; font-weight: 700; cursor: pointer;
                transition: 0.2s; font-family: var(--tmd-font);
            }
            .tmd-tag:hover { background-color: var(--tmd-accent); color: var(--tmd-text-btn); box-shadow: 0 0 8px var(--tmd-accent); }
            
            .tmd-footer { margin-top: 12px; }

            /* Notifier */
            .tmd-notifier {
                display: none; position: fixed; left: 20px; bottom: 20px;
                color: var(--tmd-text); background: var(--tmd-bg-modal);
                border: 2px solid var(--tmd-border); border-radius: var(--tmd-radius);
                padding: 10px 16px; font-size: 14px; font-weight: 600;
                box-shadow: var(--tmd-shadow);
                backdrop-filter: blur(10px); z-index: 9999;
                font-family: var(--tmd-font);
                text-transform: uppercase;
            }
            .tmd-notifier.running {display: flex; align-items: center; gap: 12px;}
            .tmd-notifier label {display: flex; align-items: center; gap: 6px;}
            .tmd-notifier label:before {content: ""; width: 16px; height: 16px; background-size: contain; background-repeat: no-repeat; opacity: 0.8;}
            .tmd-notifier label:nth-child(1):before {background-image:url("data:image/svg+xml;charset=utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 stroke=%22cyan%22 fill=%22none%22 stroke-width=%222%22><path d=%22M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83%22/></svg>"); animation: spin 2s linear infinite;}
            .tmd-notifier label:nth-child(2):before {background-image:url("data:image/svg+xml;charset=utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 stroke=%22lime%22 fill=%22none%22 stroke-width=%222%22><path d=%22M5 13l4 4L19 7%22/></svg>");}
            .tmd-notifier label:nth-child(3):before {background-image:url("data:image/svg+xml;charset=utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 stroke=%22red%22 fill=%22none%22 stroke-width=%222%22><path d=%22M18 6L6 18M6 6l12 12%22/></svg>");}
        `,

        css_ss: ``,

        svg: `
            <g class="download"><path d="M2 6 L6 2 H18 L22 6 V18 L18 22 H6 L2 18 Z M7 9 H12 V11 H7 Z M13 9 H17 V11 H13 Z M8 15 H16 V17 H8 Z" fill="currentColor" fill-rule="evenodd"/></g>
            <g class="completed"><path d="M2 6 L6 2 H18 L22 6 V18 L18 22 H6 L2 18 Z M6 6 L7 6 L8.5 7.5 L10 6 L11 6 L11 7 L9.5 8.5 L11 10 L11 11 L10 11 L8.5 9.5 L7 11 L6 11 L6 10 L7.5 8.5 L6 7 Z M13 6 L14 6 L15.5 7.5 L17 6 L18 6 L18 7 L16.5 8.5 L18 10 L18 11 L17 11 L15.5 9.5 L14 11 L13 11 L13 10 L14.5 8.5 L13 7 Z M7 15 H9 V16 H11 V17 H13 V16 H15 V15 H17 V16 H18 V18 H16 V17 H14 V18 H10 V17 H8 V18 H6 V16 H7 Z" fill="currentColor" fill-rule="evenodd"/></g>
            <g class="loading"><path d="M2 6 L6 2 H18 L22 6 V18 L18 22 H6 L2 18 Z M5 8 L8 5 H16 L19 8 V16 L16 19 H8 L5 16 Z" fill="currentColor" fill-rule="evenodd"><animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite" step="1"/></path><path d="M8 10 h2 v2 h-2 z M14 10 h2 v2 h-2 z" fill="currentColor" fill-rule="evenodd"/></g>
            <g class="failed"><path d="M2 6 L6 2 H18 L22 6 V18 L18 22 H6 L2 18 Z M6 8 H10 V12 H6 Z M14 8 H18 V12 H14 Z M11 14 H13 V16 H11 Z M7 18 H9 V21 H7 Z M11 18 H13 V21 H11 Z M15 18 H17 V21 H15 Z" fill="currentColor" fill-rule="evenodd"/></g>
        `
    };
})();

TMD.init();