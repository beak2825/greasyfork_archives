// ==UserScript==
// @name          Bilibili DownloadX
// @version       1.1.1
// @description   Simple Bilibili video downloader with jQuery
// @author        Claude Assist
// @copyright     2025, Claude Assist
// @license       MIT
// @match         *://www.bilibili.com/video/av*
// @match         *://www.bilibili.com/video/BV*
// @match         *://www.bilibili.com/bangumi/play/ep*
// @match         *://www.bilibili.com/bangumi/play/ss*
// @match         *://www.bilibili.com/cheese/play/ep*
// @match         *://www.bilibili.com/cheese/play/ss*
// @require       https://static.hdslb.com/js/jquery.min.js
// @grant         none
// @namespace https://github.com/injahow/bilibili-download-only
// @downloadURL https://update.greasyfork.org/scripts/549490/Bilibili%20DownloadX.user.js
// @updateURL https://update.greasyfork.org/scripts/549490/Bilibili%20DownloadX.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ===== Configuration Settings =====
    const CONFIG = {
        // Download settings
        download_type: 'blob', // blob | rpc | ariang | web
        format: 'mp4', // mp4 | flv | dash
        base_api: 'https://api.bilibili.com/x/player/playurl', // Official Bilibili API

        // RPC settings (for RPC download)
        rpc_domain: 'http://localhost',
        rpc_port: '16800',
        rpc_token: '',
        rpc_dir: '',

        // AriaNG settings (for AriaNG download)
        ariang_host: 'http://ariang.injahow.com/',
        aria2c_connection_level: 'min', // min | mid | max

        // Other settings
        auto_download: false,
        video_quality: '80', // Default quality
        request_type: 'local' // local | remote
    };

    // ===== Quality Mapping Table =====
    const QUALITY_MAP = {
        "8K Ultra HD": 127,
        "4K Ultra HD": 120,
        "1080P 60fps": 116,
        "1080P High Bitrate": 112,
        "1080P HD": 80,
        "720P HD": 64,
        "480P SD": 32,
        "360P Smooth": 16,
        "Auto": 32
    };

    // ===== CDN Host Mapping =====
    const HOST_MAP = {
        local: null, // Local CDN
        bd: "upos-sz-mirrorbd.bilivideo.com",
        ks3: "upos-sz-mirrorks3.bilivideo.com",
        kodob: "upos-sz-mirrorkodob.bilivideo.com",
        cos: "upos-sz-mirrorcos.bilivideo.com",
        hk: "cn-hk-eq-bcache-01.bilivideo.com"
    };

    // ===== Message Display System =====
    class MessageSystem {
        static show(type, message) {
            const colors = {
                success: '#4caf50',
                error: '#f44336',
                warning: '#ff9800',
                info: '#2196f3'
            };

            // Create message container if not exists
            if (!$('#bp_messages')[0]) {
                $('body').append('<div id="bp_messages" style="position:fixed;top:20px;left:50%;transform:translateX(-50%);z-index:10000;"></div>');
            }

            const msgId = 'msg_' + Date.now();
            const msgElement = `<div id="${msgId}" style="background:${colors[type]};color:white;padding:10px 20px;border-radius:4px;margin:5px auto;opacity:0;transition:opacity 0.3s;">
                ${message}
            </div>`;

            $('#bp_messages').append(msgElement);

            // Show animation
            setTimeout(() => $(`#${msgId}`).css('opacity', '1'), 10);

            // Auto remove after 3 seconds
            setTimeout(() => $(`#${msgId}`).animate({opacity: 0}, 300, () => $(`#${msgId}`).remove()), 3000);
        }

        static confirm(message, onConfirm, onCancel) {
            const html = `
                <div id="bp_confirm" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:10001;">
                    <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background:white;padding:20px;border-radius:8px;min-width:300px;text-align:center;">
                        <p>${message}</p>
                        <button id="bp_confirm_yes" style="padding:8px 16px;margin:0 10px;background:#4caf50;color:white;border:none;border-radius:4px;cursor:pointer;">Confirm</button>
                        <button id="bp_confirm_no" style="padding:8px 16px;margin:0 10px;background:#f44336;color:white;border:none;border-radius:4px;cursor:pointer;">Cancel</button>
                    </div>
                </div>
            `;

            $('body').append(html);

            $('#bp_confirm_yes').click(() => {
                $('#bp_confirm').remove();
                if (onConfirm) onConfirm();
            });

            $('#bp_confirm_no').click(() => {
                $('#bp_confirm').remove();
                if (onCancel) onCancel();
            });
        }
    }

    // ===== Video Information Processor =====
    class VideoInfo {
        static getCurrentVideoInfo() {
            try {
                // Handle standard video pages
                if (window.__INITIAL_STATE__ && window.__INITIAL_STATE__.videoData) {
                    const state = window.__INITIAL_STATE__;
                    const currentPage = state.p || 1;
                    const pageData = state.videoData.pages?.[currentPage - 1] || state.videoData.pages?.[0];

                    return {
                        type: 'video',
                        aid: String(state.videoData.aid),
                        bvid: state.videoData.bvid,
                        cid: String(pageData?.cid || state.videoData.cid || 0),
                        epid: '',
                        sid: '',
                        title: pageData ? `${state.videoData.title} P${currentPage} ${pageData.part}` : state.videoData.title,
                        pages: state.videoData.pages?.length || 1,
                        currentPage: currentPage
                    };
                }

                // Handle bangumi/anime pages
                if (window.__INITIAL_STATE__ && window.__INITIAL_STATE__.epInfo) {
                    const state = window.__INITIAL_STATE__;
                    return {
                        type: 'bangumi',
                        aid: String(state.epInfo.aid),
                        bvid: state.epInfo.bvid,
                        cid: String(state.epInfo.cid),
                        epid: String(state.epInfo.id),
                        sid: String(state.mediaInfo?.season_id || ''),
                        title: state.epInfo.long_title ? `${state.mediaInfo.title} ${state.epInfo.title_format} ${state.epInfo.long_title}` : state.mediaInfo.title,
                        pages: 1
                    };
                }

                // Handle course pages
                if (window.__INITIAL_STATE__ && window.__INITIAL_STATE__.videoInfo) {
                    const state = window.__INITIAL_STATE__;
                    return {
                        type: 'cheese',
                        aid: String(state.videoInfo.aid),
                        bvid: state.videoInfo.bvid,
                        cid: String(state.videoInfo.cid),
                        epid: String(state.videoInfo.id),
                        sid: String(state.seasonInfo?.id || ''),
                        title: state.videoInfo.title,
                        pages: 1
                    };
                }

                // Parse from URL as fallback
                return this.parseFromURL();

            } catch (error) {
                console.error('Failed to get video info:', error);
                return this.parseFromURL();
            }
        }

        // Parse video info from URL
        static parseFromURL() {
            try {
                const url = window.location.href;
                const urlMatch = url.match(/\/(video|bangumi|cheese)\/(?:av(\d+)|BV([A-Za-z0-9]+)|ep(\d+)|ss(\d+))/);

                if (!urlMatch) return null;

                const [, type, avId, bvId, epId, ssId] = urlMatch;

                if (type === 'video') {
                    return {
                        type: 'video',
                        aid: avId || '',
                        bvid: bvId || '',
                        cid: '',
                        epid: '',
                        sid: '',
                        title: document.title.replace(' - bilibili', ''),
                        pages: 1
                    };
                } else if (type === 'bangumi') {
                    return {
                        type: 'bangumi',
                        aid: '',
                        bvid: '',
                        cid: '',
                        epid: epId || '',
                        sid: ssId || '',
                        title: document.title.replace(' - bilibili', ''),
                        pages: 1
                    };
                } else if (type === 'cheese') {
                    return {
                        type: 'cheese',
                        aid: '',
                        bvid: '',
                        cid: '',
                        epid: epId || '',
                        sid: ssId || '',
                        title: document.title.replace(' - bilibili', ''),
                        pages: 1
                    };
                }

                return null;
            } catch (error) {
                console.error('URL parsing failed:', error);
                return null;
            }
        }

        static getVideoQuality() {
            try {
                // Try to get current selected quality
                const qualitySelectors = [
                    'li.bpx-player-ctrl-quality-menu-item.bpx-state-active',
                    'li.squirtle-select-item.active',
                    '.bilibili-player-video-quality-menu-list .active'
                ];

                for (const selector of qualitySelectors) {
                    const element = $(selector);
                    if (element.length > 0) {
                        const quality = element.attr('data-value') || element.attr('data-qn');
                        if (quality) return quality;
                    }
                }

                // Get from player
                if (window.player && window.player.getQuality) {
                    return window.player.getQuality();
                }

                return CONFIG.video_quality;
            } catch (error) {
                console.warn('Failed to get quality:', error);
                return CONFIG.video_quality;
            }
        }

        // Get available quality options
        static getAvailableQualities() {
            try {
                const qualities = [];
                const qualityElements = $('li.bpx-player-ctrl-quality-menu-item, li.squirtle-select-item');

                qualityElements.each(function() {
                    const quality = $(this).attr('data-value') || $(this).attr('data-qn');
                    if (quality && !qualities.includes(quality)) {
                        qualities.push(quality);
                    }
                });

                return qualities.length > 0 ? qualities : ['80', '64', '32', '16'];
            } catch (error) {
                console.warn('Failed to get available qualities:', error);
                return ['80', '64', '32', '16'];
            }
        }
    }

    // ===== Download Core System =====
    class DownloadManager {
        constructor() {
            this.isDownloading = false;
            this.controller = null;
        }

        showProgress(message, percent, loaded, total) {
            const progressHtml = `
                <div style="margin: 8px 0; padding: 8px; background: #f8f9fa; border-radius: 6px; border-left: 3px solid #4caf50;">
                    <div style="font-size: 12px; color: #333; margin-bottom: 4px;">${message}</div>
                    <div style="width: 100%; background: #e0e0e0; height: 6px; border-radius: 3px; overflow: hidden;">
                        <div style="width: ${percent || 0}%; height: 100%; background: linear-gradient(90deg,#4caf50,#66bb6a); transition: width 0.3s;"></div>
                    </div>
                    <div style="font-size: 11px; margin-top: 4px; color: #666;">
                        ${loaded ? `${this.formatBytes(loaded)} / ${this.formatBytes(total)}` : ''}
                    </div>
                </div>
            `;

            // Add to download panel instead of floating
            if (!$('#bp_download_progress')[0]) {
                $('#bp_content').append('<div id="bp_download_progress"></div>');
            }

            $('#bp_download_progress').html(progressHtml);

            // Auto remove when complete
            if (percent >= 100) {
                setTimeout(() => {
                    $('#bp_download_progress').slideUp(300, function() {
                        $(this).remove();
                    });
                }, 2000);
            }
        }

        formatBytes(bytes) {
            if (bytes === 0) return '0 B';
            const k = 1024;
            const sizes = ['B', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
        }

        // Main download function - supports multiple download methods
        async download(url, filename, type = CONFIG.download_type) {
            if (this.isDownloading) {
                MessageSystem.show('warning', 'Download in progress, please wait');
                return;
            }

            this.isDownloading = true;
            filename = this.sanitizeFilename(filename);

            try {
                switch (type) {
                    case 'blob':
                        await this.downloadAsBlob(url, filename);
                        break;
                    case 'web':
                        this.downloadViaBrowser(url, filename);
                        break;
                    case 'rpc':
                        await this.downloadViaRPC(url, filename);
                        break;
                    case 'ariang':
                        this.downloadViaAriaNG(url, filename);
                        break;
                    default:
                        throw new Error('Unsupported download method');
                }

                MessageSystem.show('success', `Download task submitted: ${filename}`);
            } catch (error) {
                MessageSystem.show('error', `Download failed: ${error.message}`);
            } finally {
                this.isDownloading = false;
            }
        }

        // Blob download (recommended)
        async downloadAsBlob(url, filename) {
            return new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open('GET', url);
                xhr.responseType = 'blob';

                xhr.onprogress = (e) => {
                    if (e.lengthComputable) {
                        const percent = (e.loaded / e.total) * 100;
                        this.showProgress(`Downloading: ${filename}`, percent, e.loaded, e.total);
                    }
                };

                xhr.onload = () => {
                    if (xhr.status === 200) {
                        const blob = xhr.response;
                        this.saveBlob(blob, filename);
                        resolve();
                    } else {
                        reject(new Error(`HTTP ${xhr.status}`));
                    }
                };

                xhr.onerror = () => reject(new Error('Network connection failed'));
                xhr.send();
            });
        }

        // Direct browser download
        downloadViaBrowser(url, filename) {
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }

        // RPC download
        async downloadViaRPC(url, filename) {
            const taskData = {
                url: url,
                filename: filename,
                rpc_dir: CONFIG.rpc_dir
            };

            const rpcBody = {
                id: btoa(`BParse_${Date.now()}_${Math.random()}`),
                jsonrpc: '2.0',
                method: 'aria2.addUri',
                params: [
                    `token:${CONFIG.rpc_token}`,
                    [url],
                    {
                        out: filename,
                        dir: CONFIG.rpc_dir,
                        header: [`User-Agent: ${navigator.userAgent}`]
                    }
                ]
            };

            try {
                const response = await fetch(`${CONFIG.rpc_domain}:${CONFIG.rpc_port}/jsonrpc`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(rpcBody)
                });

                if (response.ok) {
                    MessageSystem.show('success', 'RPC download task submitted');
                } else {
                    throw new Error('RPC server response error');
                }
            } catch (error) {
                throw new Error(`RPC download failed: ${error.message}`);
            }
        }

        // AriaNG download
        downloadViaAriaNG(url, filename) {
            const ariaUrl = `${CONFIG.ariang_host}#!/new/task?url=${encodeURIComponent(btoa(url))}&out=${encodeURIComponent(filename)}`;
            window.open(ariaUrl, '_blank');
        }

        // Save blob to local
        saveBlob(blob, filename) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }

        // Sanitize filename
        sanitizeFilename(filename) {
            return filename.replace(/[\/\\*|<>:"?]/g, '_')
                          .replace(/／/g, '_')
                          .replace(/＼/g, '_')
                          .replace(/｜/g, '|')
                          .replace(/＜/g, '<')
                          .replace(/＞/g, '>')
                          .replace(/：/g, ':')
                          .replace(/＊/g, '*')
                          .replace(/？/g, '?')
                          .replace(/"/g, "'");
        }

        // Cancel download
        cancelDownload() {
            if (this.controller) {
                this.controller.abort();
                this.controller = null;
            }
            $('#bp_progress').remove();
            this.isDownloading = false;
        }
    }

    // ===== API Request System =====
    class APIRequest {
        constructor() {
            this.baseAPI = CONFIG.base_api;
            this.sessionId = Date.now() + Math.random();
            this.lastRequest = null;
            this.retryCount = 0;
            this.maxRetries = 3;
        }

        // Get video download URL
        async getVideoURL(videoInfo, quality = null) {
            const requestId = Date.now() + Math.random();

            const params = {
                avid: videoInfo.aid,
                bvid: videoInfo.bvid,
                cid: videoInfo.cid,
                qn: quality || VideoInfo.getVideoQuality(),
                fnver: 0,
                fnval: CONFIG.format === 'dash' ? 4048 : 0,
                fourk: 1,
                platform: 'html5',
                high_quality: 1
            };

            // Add bangumi specific parameters
            if (videoInfo.type === 'bangumi') {
                params.ep_id = videoInfo.epid;
                params.season_id = videoInfo.sid;
            }

            const apiUrl = this.buildAPIURL(params);

            try {
                MessageSystem.show('info', 'Requesting video URL...');

                const response = await this.makeRequest(apiUrl);
                const data = await response.json();

                if (data.code === 0 && (data.result || data.data)) {
                    return this.processVideoResult(data.result || data.data);
                } else if (data.code === -352) {
                    // Need to retry with backup method
                    return await this.retryWithBackup(videoInfo, quality);
                } else {
                    throw new Error(data.message || `API Error Code: ${data.code}`);
                }

            } catch (error) {
                MessageSystem.show('error', `API request failed: ${error.message}`);

                // Retry if attempts remaining
                if (this.retryCount < this.maxRetries) {
                    this.retryCount++;
                    MessageSystem.show('info', `Retrying (${this.retryCount}/${this.maxRetries})...`);
                    await this.delay(1000 * this.retryCount); // Incremental delay
                    return this.getVideoURL(videoInfo, quality);
                }

                throw error;
            }
        }

        // Send request - use XMLHttpRequest to avoid CORS issues
        async makeRequest(url) {
            return new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open('GET', url, true);
                xhr.withCredentials = true; // Include cookies

                // Set only safe headers
                xhr.setRequestHeader('Accept', 'application/json, text/plain, */*');

                xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4) {
                        if (xhr.status >= 200 && xhr.status < 300) {
                            try {
                                const data = JSON.parse(xhr.responseText);
                                resolve({
                                    ok: true,
                                    json: () => Promise.resolve(data)
                                });
                            } catch (e) {
                                resolve({
                                    ok: true,
                                    json: () => Promise.resolve({ code: -1, message: 'Response parsing failed' })
                                });
                            }
                        } else {
                            reject(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`));
                        }
                    }
                };

                xhr.onerror = function() {
                    reject(new Error('Network request failed'));
                };

                xhr.send();
            });
        }

        // Backup request method
        async retryWithBackup(videoInfo, quality) {
            MessageSystem.show('info', 'Trying backup request method...');

            const backupParams = {
                avid: videoInfo.aid,
                bvid: videoInfo.bvid,
                cid: videoInfo.cid,
                qn: quality || VideoInfo.getVideoQuality(),
                fnver: 0,
                fnval: CONFIG.format === 'dash' ? 4048 : 0,
                fourk: 1
            };

            const backupUrl = `https://api.bilibili.com/x/player/playurl?${this.buildQueryString(backupParams)}`;

            try {
                const response = await this.makeRequest(backupUrl);
                const data = await response.json();

                if (data.code === 0 && data.data) {
                    return this.processVideoResult(data.data);
                }
            } catch (error) {
                console.warn('Backup request also failed:', error);
            }

            throw new Error('All request methods failed');
        }

        // Delay function
        delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        // Build API URL
        buildAPIURL(params) {
            const queryString = Object.entries(params)
                .filter(([key, value]) => value !== '' && value !== null && value !== undefined)
                .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
                .join('&');

            return `${this.baseAPI}?${queryString}`;
        }

        // Build query string
        buildQueryString(params) {
            return Object.entries(params)
                .filter(([key, value]) => value !== '' && value !== null && value !== undefined)
                .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
                .join('&');
        }

        // Process API response result
        processVideoResult(result) {
            // Handle DASH format
            if (result.dash) {
                const videos = result.dash.video || [];
                const audios = result.dash.audio || [];

                if (videos.length === 0) {
                    throw new Error('No available video streams');
                }

                return {
                    type: 'dash',
                    video: this.selectBestMatch(videos),
                    audio: audios.length > 0 ? this.selectBestAudio(audios) : null,
                    quality: result.quality || result.dash.video[0].id
                };
            }

            // Handle normal format
            if (result.durl && result.durl.length > 0) {
                return {
                    type: 'normal',
                    url: result.durl[0].url,
                    backup_url: result.durl[0].backup_url || null,
                    quality: result.quality
                };
            }

            throw new Error('Unable to parse video URL');
        }

        // Select best matching video quality
        selectBestMatch(videos) {
            const targetQuality = parseInt(VideoInfo.getVideoQuality());

            // Sort by quality (high to low)
            videos.sort((a, b) => b.id - a.id);

            // Find best match
            for (const video of videos) {
                if (video.id <= targetQuality) {
                    return video.base_url;
                }
            }

            // If not found, select lowest quality
            return videos[videos.length - 1].base_url;
        }

        // Select best audio
        selectBestAudio(audios) {
            if (audios.length === 0) return null;

            // Prefer high quality audio
            audios.sort((a, b) => b.id - a.id);
            return audios[0].base_url;
        }
    }

    // ===== Download Queue System =====
    class DownloadQueue {
        constructor() {
            this.queue = [];
            this.isProcessing = false;
        }

        add(videoInfo) {
            // Check if already in queue
            const exists = this.queue.find(item => item.aid === videoInfo.aid && item.bvid === videoInfo.bvid);
            if (exists) {
                MessageSystem.show('warning', 'Video already in download queue');
                return;
            }

            this.queue.push({
                ...videoInfo,
                id: Date.now(),
                status: 'pending',
                addedAt: new Date()
            });

            this.updateUI();
            MessageSystem.show('success', `Added to queue: ${videoInfo.title}`);
        }

        remove(id) {
            this.queue = this.queue.filter(item => item.id !== id);
            this.updateUI();
        }

        updateUI() {
            const queueHtml = this.queue.map(item => `
                <div style="display:flex;align-items:flex-start;padding:5px 7px;border:1px solid #e0e0e0;border-radius:4px;margin-bottom:3px;background:#fafafa;min-height:28px;">
                    <div style="flex:1;min-width:0;margin-right:5px;max-width:calc(100% - 22px);">
                        <div style="font-size:10px;font-weight:500;color:#333;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;line-height:1.3;max-height:1.3em;">${item.title}</div>
                        <div style="font-size:9px;color:#666;margin-top:1px;">${item.status}</div>
                    </div>
                    <button onclick="window.BilibiliDownload.removeFromQueue(${item.id})" style="width:14px;height:14px;border-radius:50%;background:#ff4757;color:white;border:none;cursor:pointer;font-size:9px;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px;">×</button>
                </div>
            `).join('');

            if (!$('#bp_queue')[0]) {
                $('#bp_content').append('<div id="bp_queue" style="margin-top:8px;max-height:200px;overflow-y:auto;overflow-x:hidden;scrollbar-width:thin;scrollbar-color:#ccc #f0f0f0;"></div>');
            }

            $('#bp_queue').html(queueHtml || '<div style="text-align:center;color:#999;font-size:11px;padding:20px 10px;">No videos in queue</div>');

            // Adjust panel height based on content
            this.adjustPanelHeight();
        }

        adjustPanelHeight() {
            const queue = $('#bp_queue');
            const content = $('#bp_content');
            const panel = $('#bp_controls');

            if (queue.length && content.length && panel.length) {
                const queueHeight = Math.min(queue[0].scrollHeight, 200); // Match the new max-height
                const contentHeight = content[0].scrollHeight;
                const newHeight = Math.min(contentHeight + 40, 700); // Allow more height for better containment

                panel.css('max-height', newHeight + 'px');
            }
        }

        async processQueue() {
            if (this.isProcessing || this.queue.length === 0) return;

            this.isProcessing = true;

            for (const item of this.queue) {
                if (item.status === 'pending') {
                    try {
                        item.status = 'downloading';
                        this.updateUI();

                        // If cid is missing or pending, try to get it from the video page
                        let videoInfo = { ...item };
                        if (!item.cid || item.cid === '' || item.cid === 'pending') {
                            try {
                                item.status = 'getting_cid';
                                this.updateUI();

                                // Fetch the video page to get cid
                                const response = await fetch(item.url);
                                const html = await response.text();

                                // Extract cid from the HTML
                                const cidMatch = html.match(/"cid":(\d+)/) || html.match(/cid=(\d+)/);
                                if (cidMatch) {
                                    videoInfo.cid = cidMatch[1];
                                    MessageSystem.show('info', `Got CID: ${videoInfo.cid} for ${item.title}`);
                                } else {
                                    throw new Error('Could not extract CID from video page');
                                }
                            } catch (cidError) {
                                console.warn('Failed to get CID:', cidError);
                                item.status = 'failed';
                                this.updateUI();
                                continue;
                            }
                        }

                        const apiRequest = new APIRequest();
                        const videoData = await apiRequest.getVideoURL(videoInfo, CONFIG.video_quality);

                        const filename = `${videoInfo.title}.${CONFIG.format}`;
                        const downloadManager = new DownloadManager();

                        if (videoData.type === 'dash' && videoData.video && videoData.audio) {
                            await downloadManager.download(videoData.video, `video_temp.mp4`, CONFIG.download_type);
                            await downloadManager.download(videoData.audio, `audio_temp.m4a`, CONFIG.download_type);
                        } else {
                            await downloadManager.download(videoData.url, filename, CONFIG.download_type);
                        }

                        item.status = 'completed';
                        this.updateUI();

                    } catch (error) {
                        item.status = 'failed';
                        this.updateUI();
                        console.error('Download failed:', error);
                        MessageSystem.show('error', `Failed to download ${item.title}: ${error.message}`);
                    }
                }
            }

            this.isProcessing = false;
        }
    }

    // ===== UI Interface System =====
    class UIController {
        static init() {
            this.downloadQueue = new DownloadQueue();
            this.createFloatingButton();
            this.bindEvents();
            this.addVideoCardButtons();
        }

        static createFloatingButton() {
            const floatingHtml = `
                <div id="bp_floating" style="position:fixed;bottom:80px;right:20px;z-index:1000;">
                    <button id="bp_main_btn" style="width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;border:none;cursor:pointer;font-size:20px;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 20px rgba(102,126,234,0.4);transition:all 0.3s ease;backdrop-filter:blur(10px);">
                        📥
                    </button>
                </div>
            `;

            if (!$('#bp_floating')[0]) {
                $('body').append(floatingHtml);
            }
        }

        static createControls() {
            const controlsHtml = `
                <style>
                    #bp_controls.bp-dragging {
                        opacity: 0.9;
                        transform: rotate(2deg);
                        box-shadow: 0 8px 30px rgba(0,0,0,0.3);
                    }
                    #bp_controls.bp-dragging * {
                        pointer-events: none;
                    }
                </style>
                <div id="bp_controls" style="position:fixed;top:60px;right:20px;z-index:1000;background:white;padding:15px;border:1px solid #e0e0e0;border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,0.15);min-width:200px;max-width:280px;max-height:600px;backdrop-filter:blur(10px);transition:all 0.3s ease;display:none;">
                    <div id="bp_header" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;cursor:pointer;user-select:none;">
                        <h3 style="margin:0;font-size:14px;color:#333;font-weight:600;">📥 Download</h3>
                        <button id="bp_toggle" style="width:20px;height:20px;border-radius:50%;background:#f0f0f0;color:#666;border:none;cursor:pointer;font-size:11px;display:flex;align-items:center;justify-content:center;transition:all 0.2s;">−</button>
                    </div>

                    <div id="bp_content" style="transition:all 0.3s ease;">
                        <div style="margin-bottom:8px;">
                            <label style="display:block;font-size:12px;margin-bottom:3px;color:#555;font-weight:500;">Quality</label>
                            <select id="bp_quality" style="width:100%;padding:6px;border:1px solid #e0e0e0;border-radius:4px;font-size:12px;background:#fafafa;">
                                <option value="127">8K Ultra HD</option>
                                <option value="120">4K Ultra HD</option>
                                <option value="112">1080P High</option>
                                <option value="80" selected>1080P HD</option>
                                <option value="64">720P HD</option>
                                <option value="32">480P SD</option>
                                <option value="16">360P</option>
                            </select>
                        </div>

                        <div style="margin-bottom:8px;">
                            <label style="display:block;font-size:12px;margin-bottom:3px;color:#555;font-weight:500;">Format</label>
                            <select id="bp_format" style="width:100%;padding:6px;border:1px solid #e0e0e0;border-radius:4px;font-size:12px;background:#fafafa;">
                                <option value="mp4" selected>MP4</option>
                                <option value="dash">DASH</option>
                                <option value="flv">FLV</option>
                            </select>
                        </div>

                        <div style="margin-bottom:10px;">
                            <label style="display:block;font-size:12px;margin-bottom:3px;color:#555;font-weight:500;">Method</label>
                            <select id="bp_method" style="width:100%;padding:6px;border:1px solid #e0e0e0;border-radius:4px;font-size:12px;background:#fafafa;">
                                <option value="blob" selected>Direct</option>
                                <option value="rpc">RPC</option>
                                <option value="ariang">AriaNG</option>
                                <option value="web">Browser</option>
                            </select>
                        </div>

                        <button id="bp_download_video" style="width:100%;padding:8px;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;border:none;border-radius:6px;cursor:pointer;font-size:13px;font-weight:600;letter-spacing:0.5px;transition:all 0.2s;margin-bottom:8px;">🎬 Download Current</button>

                        <button id="bp_process_queue" style="width:100%;padding:6px;background:#4caf50;color:white;border:none;border-radius:4px;cursor:pointer;font-size:12px;font-weight:500;letter-spacing:0.5px;transition:all 0.2s;margin-bottom:8px;">▶ Start Queue</button>

                        <div id="bp_queue" style="max-height:200px;overflow-y:auto;border:1px solid #f0f0f0;border-radius:4px;padding:4px;background:#fafbfc;"></div>
                    </div>
                </div>
            `;

            if (!$('#bp_controls')[0]) {
                $('body').append(controlsHtml);
            }
        }

        static addVideoCardButtons() {
            // Add + buttons to video cards
            const addButtonsToCards = () => {
                $('.video-page-card-small').each(function() {
                    if (!$(this).find('.bp-add-btn').length) {
                        const addBtn = `
                            <button class="bp-add-btn" style="position:absolute;top:8px;right:8px;width:28px;height:28px;border-radius:50%;background:#4caf50;color:white;border:none;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;z-index:10;opacity:0;transition:opacity 0.2s;">+</button>
                        `;
                        $(this).css('position', 'relative').append(addBtn);
                    }
                });
            };

            // Initial add
            addButtonsToCards();

            // Re-add on dynamic content changes
            const observer = new MutationObserver(() => {
                addButtonsToCards();
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            // Hover effects
            $(document).on('mouseenter', '.video-page-card-small', function() {
                $(this).find('.bp-add-btn').css('opacity', '1');
            });

            $(document).on('mouseleave', '.video-page-card-small', function() {
                $(this).find('.bp-add-btn').css('opacity', '0');
            });

            // Click handler
            $(document).on('click', '.bp-add-btn', function(e) {
                e.preventDefault();
                e.stopPropagation();

                const card = $(this).closest('.video-page-card-small');
                const link = card.find('a[href*="/video/"]').first();
                const href = link.attr('href');

                if (href) {
                    // Extract video info from URL
                    const urlMatch = href.match(/\/video\/(av\d+|BV[A-Za-z0-9]+)/);
                    if (urlMatch) {
                        const videoId = urlMatch[1];
                        const title = card.find('.title').text().trim() || 'Unknown Title';

                        // Try to get cid from various sources
                        let cid = '';

                        // Try to get from data attributes
                        cid = card.attr('data-cid') || card.attr('data-aid') || '';

                        // If still no cid, try to get it from the video page data
                        if (!cid) {
                            // For now, we'll add to queue without cid and get it later
                            // This prevents the validation error
                            cid = 'pending'; // Special marker to get cid later
                        }

                        const videoInfo = {
                            type: 'video',
                            aid: videoId.startsWith('av') ? videoId.substring(2) : '',
                            bvid: videoId.startsWith('BV') ? videoId : '',
                            cid: cid,
                            title: title,
                            url: href
                        };

                        window.BilibiliDownload.addToQueue(videoInfo);
                    }
                }
            });
        }

        static bindEvents() {
            let isCollapsed = false;
            let panelVisible = false;
            let isDragging = false;
            let dragOffset = { x: 0, y: 0 };

            // Floating button click - show/hide panel
            $('#bp_main_btn').click(function() {
                if (!panelVisible) {
                    // Show panel
                    UIController.createControls();
                    $('#bp_controls').fadeIn(300);
                    panelVisible = true;
                } else {
                    // Hide panel
                    $('#bp_controls').fadeOut(300);
                    panelVisible = false;
                }
            });

            // Toggle show/hide - click on header (for when panel is visible)
            $(document).on('click', '#bp_header', function() {
                const content = $('#bp_content');
                const toggleBtn = $('#bp_toggle');

                if (isCollapsed) {
                    // Expand
                    content.slideDown(300);
                    toggleBtn.text('−');
                    toggleBtn.css('transform', 'rotate(0deg)');
                    isCollapsed = false;
                } else {
                    // Collapse
                    content.slideUp(300);
                    toggleBtn.text('+');
                    toggleBtn.css('transform', 'rotate(180deg)');
                    isCollapsed = true;
                }
            });

            // Drag functionality for the panel
            $(document).on('mousedown', '#bp_header', function(e) {
                if (e.target === $('#bp_toggle')[0]) return; // Don't drag if clicking toggle button

                isDragging = true;
                const panel = $('#bp_controls');
                const panelRect = panel[0].getBoundingClientRect();

                dragOffset.x = e.clientX - panelRect.left;
                dragOffset.y = e.clientY - panelRect.top;

                // Add dragging class for visual feedback
                panel.addClass('bp-dragging');
                panel.css('cursor', 'grabbing');

                // Prevent text selection during drag
                e.preventDefault();
                return false;
            });

            $(document).on('mousemove', function(e) {
                if (!isDragging) return;

                const panel = $('#bp_controls');
                const newX = e.clientX - dragOffset.x;
                const newY = e.clientY - dragOffset.y;

                // Keep panel within viewport bounds
                const maxX = window.innerWidth - panel.outerWidth();
                const maxY = window.innerHeight - panel.outerHeight();

                const clampedX = Math.max(0, Math.min(newX, maxX));
                const clampedY = Math.max(0, Math.min(newY, maxY));

                panel.css({
                    left: clampedX + 'px',
                    top: clampedY + 'px',
                    right: 'auto' // Override the fixed positioning
                });
            });

            $(document).on('mouseup', function() {
                if (isDragging) {
                    isDragging = false;
                    const panel = $('#bp_controls');
                    panel.removeClass('bp-dragging');
                    panel.css('cursor', '');
                }
            });

            // Add hover cursor for draggable header
            $(document).on('mouseenter', '#bp_header', function() {
                if (!isDragging) {
                    $(this).css('cursor', 'grab');
                }
            });

            $(document).on('mouseleave', '#bp_header', function() {
                if (!isDragging) {
                    $(this).css('cursor', '');
                }
            });

            // Download current video button
            $(document).on('click', '#bp_download_video', async function() {
                const videoInfo = VideoInfo.getCurrentVideoInfo();
                if (!videoInfo) {
                    MessageSystem.show('error', 'Unable to get video info');
                    return;
                }

                const quality = $('#bp_quality').val();
                const format = $('#bp_format').val();
                const method = $('#bp_method').val();

                try {
                    MessageSystem.show('info', `Requesting quality: ${quality}`);

                    // Update global config
                    CONFIG.video_quality = quality;
                    CONFIG.format = format;
                    CONFIG.download_type = method;

                    // Request video URL
                    const apiRequest = new APIRequest();
                    const videoData = await apiRequest.getVideoURL(videoInfo, quality);

                    // Filename
                    const filename = `${videoInfo.title}.${CONFIG.format}`;

                    // Download
                    const downloadManager = new DownloadManager();

                    if (videoData.type === 'dash' && videoData.video && videoData.audio) {
                        // DASH format needs merging
                        MessageSystem.confirm('DASH format requires merging video and audio, may take some time', async () => {
                            // Download and merge - need to extend download manager for merge logic
                            await downloadManager.download(videoData.video, `video_temp.mp4`, method);
                            await downloadManager.download(videoData.audio, `audio_temp.m4a`, method);
                            MessageSystem.show('info', 'Please use video editing software to manually merge video and audio files');
                        });
                    } else {
                        // Show download URL info
                        console.log('Download URL:', videoData.url);
                        console.log('Filename:', filename);
                        console.log('Download method:', method);

                        await downloadManager.download(videoData.url, filename, method);
                    }

                } catch (error) {
                    MessageSystem.show('error', `Download failed: ${error.message}`);
                }
            });

            // Process queue button
            $(document).on('click', '#bp_process_queue', async function() {
                if (UIController.downloadQueue.queue.length === 0) {
                    MessageSystem.show('warning', 'No videos in queue');
                    return;
                }

                $(this).prop('disabled', true).text('⏳ Processing...');
                await UIController.downloadQueue.processQueue();
                $(this).prop('disabled', false).text('▶ Start Queue');
            });
        }

        static updateVideoInfo(videoInfo) {
            if (videoInfo) {
                $('#bp_controls').prepend(`<div style="margin-bottom:10px;font-size:12px;color:#666;border-bottom:1px solid #eee;padding-bottom:5px;">${videoInfo.title}</div>`);
            }
        }
    }

    // ===== Initialize Script =====
    function initDownloadUserscript() {
        console.log('🎬 Bilibili Download Script v1.1.0 loading...');

        // Check if on supported page
        if (!isSupportedPage()) {
            console.log('Current page does not support download functionality');
            return;
        }

        // Initialize UI controls
        UIController.init();

        // Wait for page to fully load
        waitForPageLoad().then(() => {
            // Check current page and initialize
            let checkInterval = setInterval(() => {
                const videoInfo = VideoInfo.getCurrentVideoInfo();
                if (videoInfo && videoInfo.aid && videoInfo.cid) {
                    UIController.updateVideoInfo(videoInfo);
                    clearInterval(checkInterval);

                    MessageSystem.show('success', `Loaded! Current video: ${videoInfo.title}`);
                    console.log('Video info:', videoInfo);
                }
            }, 1000);

            // Show warning if video not detected after 10 seconds
            setTimeout(() => {
                if (!$('#bp_controls')[0]) {
                    MessageSystem.show('warning', 'This page may not support download functionality or video info has not loaded yet');
                }
            }, 10000);
        });
    }

    // Check if on supported page
    function isSupportedPage() {
        const supportedPatterns = [
            /www\.bilibili\.com\/video\/(av|BV)/,
            /www\.bilibili\.com\/bangumi\/play\/(ep|ss)/,
            /www\.bilibili\.com\/cheese\/play\/(ep|ss)/,
            /www\.bilibili\.com\/list\//
        ];

        return supportedPatterns.some(pattern => pattern.test(window.location.href));
    }

    // Wait for page to fully load
    function waitForPageLoad() {
        return new Promise((resolve) => {
            // If page is already complete
            if (document.readyState === 'complete') {
                resolve();
                return;
            }

            // Wait for page load event
            window.addEventListener('load', () => {
                // Extra wait time to ensure dynamic content loads
                setTimeout(resolve, 1000);
            });

            // Or listen for specific Bilibili elements
            const checkBilibiliElements = () => {
                if (window.__INITIAL_STATE__ ||
                    document.querySelector('.bpx-player-container') ||
                    document.querySelector('.player-container')) {
                    resolve();
                } else {
                    setTimeout(checkBilibiliElements, 500);
                }
            };

            // Start checking Bilibili elements after 2 seconds
            setTimeout(checkBilibiliElements, 2000);
        });
    }

    // ===== Start Script =====
    // Initialize after page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            // Extra wait to ensure all resources are loaded
            setTimeout(initDownloadUserscript, 500);
        });
    } else {
        // Page already loaded, initialize shortly
        setTimeout(initDownloadUserscript, 500);
    }

    // Add global object for developer debugging
    window.BilibiliDownload = {
        getVideoInfo: VideoInfo.getCurrentVideoInfo,
        getVideoURL: (videoInfo) => new APIRequest().getVideoURL(videoInfo),
        download: (url, filename, method) => new DownloadManager().download(url, filename, method),
        cancelDownload: () => new DownloadManager().cancelDownload(),
        addToQueue: (videoInfo) => UIController.downloadQueue.add(videoInfo),
        removeFromQueue: (id) => UIController.downloadQueue.remove(id),
        processQueue: () => UIController.downloadQueue.processQueue(),
        config: CONFIG
    };

})();
