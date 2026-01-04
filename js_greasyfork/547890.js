// ==UserScript==
// @name         SPL (SimplePatreonLoader) - Optimized
// @namespace    https://github.com/5f32797a
// @version      3.0
// @description  Enhanced Vimeo video loader with optimized performance, better architecture, and improved HLS download
// @match        https://vimeo.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_download
// @connect      vimeo.com
// @connect      *.vimeocdn.com
// @source       https://github.com/5f32797a/VimeoSPL
// @supportURL   https://github.com/5f32797a/VimeoSPL/issues
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/547890/SPL%20%28SimplePatreonLoader%29%20-%20Optimized.user.js
// @updateURL https://update.greasyfork.org/scripts/547890/SPL%20%28SimplePatreonLoader%29%20-%20Optimized.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * Application Configuration Manager
     */
    class ConfigManager {
        static defaults = {
            preferredQuality: 'auto',
            darkMode: true,
            loadTimeout: 60000,
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            maxConcurrentDownloads: 4,
            chunkSize: 4 * 1024 * 1024,
            retryAttempts: 3,
            retryDelay: 1000,
            debugMode: false
        };

        static get(key) {
            return GM_getValue(key, this.defaults[key]);
        }

        static set(key, value) {
            GM_setValue(key, value);
        }

        static getAll() {
            const config = {};
            Object.keys(this.defaults).forEach(key => {
                config[key] = this.get(key);
            });
            return config;
        }
    }

    /**
     * Optimized Logging Utility
     */
    class Logger {
        static levels = { ERROR: 0, WARN: 1, INFO: 2, DEBUG: 3 };
        static currentLevel = ConfigManager.get('debugMode') ? 3 : 2;

        static log(level, message, ...args) {
            if (this.levels[level] <= this.currentLevel) {
                const timestamp = new Date().toISOString();
                console[level.toLowerCase()](`[SPL ${timestamp}] ${message}`, ...args);
            }
        }

        static error(message, ...args) { this.log('ERROR', message, ...args); }
        static warn(message, ...args) { this.log('WARN', message, ...args); }
        static info(message, ...args) { this.log('INFO', message, ...args); }
        static debug(message, ...args) { this.log('DEBUG', message, ...args); }
    }

    /**
     * Utility Functions
     */
    class Utils {
        static formatBytes(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
        }

        static formatBitrate(bitrate) {
            if (!bitrate) return '';
            return bitrate >= 1000000 
                ? `${(bitrate / 1000000).toFixed(1)} Mbps`
                : `${Math.round(bitrate / 1000)} Kbps`;
        }

        static debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }

        static sanitizeFilename(filename) {
            return filename.replace(/[<>:"/\\|?*]/g, '_').trim();
        }

        static async sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        static createUUID() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                const r = Math.random() * 16 | 0;
                const v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }
    }

    /**
     * Enhanced URL Parser
     */
    class URLParser {
        static VIMEO_ID_PATTERNS = [
            /vimeo\.com\/(\d+)/,
            /player\.vimeo\.com\/video\/(\d+)/,
            /vimeo\.com\/video\/(\d+)/,
            /\/(\d+)(?:[/?#]|$)/
        ];

        static extractVideoId(url) {
            for (const pattern of this.VIMEO_ID_PATTERNS) {
                const match = url.match(pattern);
                if (match) return match[1];
            }
            throw new Error('Invalid Vimeo URL format');
        }

        static resolveUrl(url, base) {
            if (url.startsWith('http')) return url;
            
            try {
                return new URL(url, base).href;
            } catch {
                // Fallback for complex relative paths
                if (url.startsWith('/')) {
                    const baseUrl = new URL(base);
                    return `${baseUrl.protocol}//${baseUrl.host}${url}`;
                }
                const lastSlash = base.lastIndexOf('/');
                return base.substring(0, lastSlash + 1) + url;
            }
        }
    }

    /**
     * CSS Style Manager
     */
    class StyleManager {
        static styles = `
            @keyframes spl-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            @keyframes spl-fadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes spl-slideIn { from { transform: translateY(-20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            
            .spl-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); z-index: 9998; }
            .spl-container { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 9999; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
            .spl-spinner { border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; width: 40px; height: 40px; animation: spl-spin 1s linear infinite; margin: 0 auto 15px; }
            .spl-fade-in { animation: spl-fadeIn 0.5s ease-out; }
            .spl-slide-in { animation: spl-slideIn 0.3s ease-out; }
            
            .spl-player { position: fixed; top: 0; left: 0; width: 100%; height: 100%; display: flex; flex-direction: column; background: #1a1a1a; }
            .spl-controls { display: flex; justify-content: space-between; align-items: center; padding: 12px 20px; background: linear-gradient(135deg, #2c3e50, #34495e); color: white; box-shadow: 0 2px 10px rgba(0,0,0,0.3); }
            .spl-title { flex: 1; font-weight: 600; font-size: 16px; margin-right: 20px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
            .spl-button-group { display: flex; gap: 8px; }
            .spl-button { background: linear-gradient(135deg, #3498db, #2980b9); color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: 500; transition: all 0.2s ease; position: relative; overflow: hidden; }
            .spl-button:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3); }
            .spl-button:active { transform: translateY(0); }
            .spl-button.secondary { background: linear-gradient(135deg, #95a5a6, #7f8c8d); }
            .spl-button.danger { background: linear-gradient(135deg, #e74c3c, #c0392b); }
            
            .spl-dropdown { position: absolute; top: 100%; right: 0; min-width: 250px; background: #2c3e50; border-radius: 8px; box-shadow: 0 8px 32px rgba(0,0,0,0.4); z-index: 10000; opacity: 0; visibility: hidden; transform: translateY(-10px); transition: all 0.2s ease; }
            .spl-dropdown.active { opacity: 1; visibility: visible; transform: translateY(0); }
            .spl-dropdown-item { padding: 12px 16px; cursor: pointer; transition: background 0.2s ease; color: white; border-bottom: 1px solid rgba(255,255,255,0.1); }
            .spl-dropdown-item:hover { background: #3498db; }
            .spl-dropdown-item:last-child { border-bottom: none; border-radius: 0 0 8px 8px; }
            .spl-dropdown-item:first-child { border-radius: 8px 8px 0 0; }
            
            .spl-notification { position: fixed; bottom: 20px; right: 20px; min-width: 320px; max-width: 400px; background: #2c3e50; color: white; padding: 16px; border-radius: 8px; box-shadow: 0 8px 32px rgba(0,0,0,0.4); z-index: 10001; }
            .spl-notification.success { border-left: 4px solid #27ae60; }
            .spl-notification.error { border-left: 4px solid #e74c3c; }
            .spl-notification.info { border-left: 4px solid #3498db; }
            
            .spl-progress { width: 100%; height: 6px; background: rgba(255,255,255,0.2); border-radius: 3px; overflow: hidden; margin: 8px 0; }
            .spl-progress-bar { height: 100%; background: linear-gradient(90deg, #3498db, #2ecc71); transition: width 0.3s ease; border-radius: 3px; }
            
            .spl-dialog { background: #2c3e50; color: white; padding: 24px; border-radius: 12px; max-width: 600px; width: 90vw; max-height: 80vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.5); }
            .spl-dialog h3 { margin-top: 0; color: #3498db; font-size: 20px; }
            .spl-quality-option { padding: 12px 16px; margin: 8px 0; background: #34495e; border-radius: 6px; cursor: pointer; transition: all 0.2s ease; display: flex; justify-content: space-between; align-items: center; }
            .spl-quality-option:hover { background: #3498db; transform: translateX(4px); }
            .spl-audio-indicator { font-size: 12px; padding: 2px 8px; border-radius: 12px; font-weight: 500; }
            .spl-audio-indicator.has-audio { background: #27ae60; }
            .spl-audio-indicator.no-audio { background: #e74c3c; }
        `;

        static inject() {
            if (document.getElementById('spl-styles')) return;
            
            const styleSheet = document.createElement('style');
            styleSheet.id = 'spl-styles';
            styleSheet.textContent = this.styles;
            document.head.appendChild(styleSheet);
        }
    }

    /**
     * Video Source Extractor
     */
    class VideoExtractor {
        static CONFIG_PATTERNS = [
            /window\.vimeoPlayerSetup\s*=\s*({.+?});/s,
            /var\s+config\s*=\s*({.+?});/s,
            /window\.playerConfig\s*=\s*({.+?});/s,
            /playerConfig\s*[:=]\s*({.+?})[,;]/s,
            /"config"\s*:\s*({.+?})[,}]/s
        ];

        static HLS_PATTERNS = [
            /"url"\s*:\s*"(https:\/\/[^"]+\.m3u8[^"]*)"/g,
            /https:\/\/[^\s"']+\.m3u8[^\s"']*/g
        ];

        static async extract(htmlContent) {
            const sources = {
                hls: null,
                title: "Vimeo Video",
                quality: {},
                audioStreams: [],
                configUrl: null,
                iframeSrc: null
            };

            try {
                // Method 1: Extract from player config
                const config = this.extractPlayerConfig(htmlContent);
                if (config) {
                    this.extractFromConfig(config, sources);
                    if (sources.hls) return sources;
                }

                // Method 2: Direct HLS URL search
                const hlsUrl = this.extractDirectHLS(htmlContent);
                if (hlsUrl) {
                    sources.hls = hlsUrl;
                    return sources;
                }

                // Method 3: Config URL extraction
                const configUrl = this.extractConfigUrl(htmlContent);
                if (configUrl) {
                    sources.configUrl = configUrl;
                    return sources;
                }

                // Method 4: Iframe fallback
                const iframeSrc = this.extractIframeSrc(htmlContent);
                if (iframeSrc) {
                    sources.iframeSrc = iframeSrc;
                    return sources;
                }

                return null;
            } catch (error) {
                Logger.error('Video extraction failed:', error);
                return null;
            }
        }

        static extractPlayerConfig(htmlContent) {
            for (const pattern of this.CONFIG_PATTERNS) {
                const match = htmlContent.match(pattern);
                if (!match) continue;

                try {
                    let jsonStr = match[1]
                        .replace(/(\w+):/g, '"$1":')
                        .replace(/'/g, '"')
                        .replace(/,\s*}/g, '}')
                        .replace(/,\s*]/g, ']');
                    
                    const config = JSON.parse(jsonStr);
                    if (config && (config.request || config.video)) {
                        Logger.debug('Found player config');
                        return config;
                    }
                } catch (e) {
                    Logger.debug('Failed to parse config:', e.message);
                }
            }
            return null;
        }

        static extractFromConfig(config, sources) {
            if (config.video?.title) {
                sources.title = config.video.title;
            }

            if (config.request?.files?.hls) {
                const hlsConfig = config.request.files.hls;
                const hlsUrl = hlsConfig.cdns?.akfire_interconnect_quic?.url ||
                              hlsConfig.cdns?.[hlsConfig.default_cdn]?.url ||
                              hlsConfig.url;
                
                if (hlsUrl) {
                    sources.hls = hlsUrl;
                    Logger.info('Extracted HLS from config:', hlsUrl);
                }
            }

            // Extract audio streams from config
            if (config.request?.files?.dash?.streams) {
                const dashStreams = config.request.files.dash.streams;
                sources.audioStreams = dashStreams
                    .filter(stream => stream.profile?.includes('audio'))
                    .map(stream => ({
                        url: stream.url,
                        name: 'Audio Track',
                        language: stream.language || 'Unknown',
                        isAudioOnly: true,
                        bandwidth: stream.bandwidth
                    }));
            }

            // Extract progressive (MP4) files if available
            if (config.request?.files?.progressive) {
                const mp4Sources = config.request.files.progressive;
                mp4Sources.sort((a, b) => b.height - a.height);
                
                mp4Sources.forEach(source => {
                    sources.quality[`${source.height}p`] = {
                        url: source.url,
                        quality: `${source.height}p`,
                        format: 'mp4',
                        width: source.width,
                        height: source.height
                    };
                });
            }
        }

        static extractDirectHLS(htmlContent) {
            for (const pattern of this.HLS_PATTERNS) {
                const matches = [...htmlContent.matchAll(pattern)];
                if (matches.length > 0) {
                    const url = matches[0][1] || matches[0][0];
                    Logger.info('Found direct HLS URL:', url);
                    return url.replace(/\\u0026/g, '&');
                }
            }
            return null;
        }

        static extractConfigUrl(htmlContent) {
            const match = htmlContent.match(/(?:master\.json|player\.vimeo\.com\/video\/\d+\/config)[^"'\s]+/);
            if (match) {
                const url = 'https://' + match[0].replace(/^\/\//, '');
                Logger.debug('Found config URL:', url);
                return url;
            }
            return null;
        }

        static extractIframeSrc(htmlContent) {
            const match = htmlContent.match(/src=["']([^"']+player\.vimeo\.com\/video\/[^"']+)["']/);
            if (match) {
                Logger.debug('Found iframe src:', match[1]);
                return match[1];
            }
            return null;
        }
    }

    /**
     * Optimized HLS Parser and Downloader
     */
    class HLSManager {
        constructor() {
            this.activeDownloads = new Map();
            this.downloadQueue = [];
        }

        async parsePlaylist(m3u8Content, baseUrl) {
            if (m3u8Content.includes('#EXT-X-STREAM-INF')) {
                return this.parseMasterPlaylist(m3u8Content, baseUrl);
            } else {
                return this.parseMediaPlaylist(m3u8Content, baseUrl);
            }
        }

        parseMasterPlaylist(content, baseUrl) {
            const streams = [];
            const audioStreams = [];
            const lines = content.split('\n').map(line => line.trim());

            let currentStream = null;

            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];

                if (line.startsWith('#EXT-X-STREAM-INF:')) {
                    currentStream = this.parseStreamInfo(line);
                } else if (line.startsWith('#EXT-X-MEDIA:') && line.includes('TYPE=AUDIO')) {
                    const audioStream = this.parseAudioStream(line, baseUrl);
                    if (audioStream) audioStreams.push(audioStream);
                } else if (line && !line.startsWith('#') && currentStream) {
                    currentStream.url = URLParser.resolveUrl(line, baseUrl);
                    streams.push(currentStream);
                    currentStream = null;
                }
            }

            return {
                type: 'master',
                streams: streams.sort((a, b) => (b.bandwidth || 0) - (a.bandwidth || 0)),
                audioStreams
            };
        }

        parseStreamInfo(line) {
            const stream = { attributes: {}, type: 'video' };
            const attributesStr = line.substring(18);
            
            // More efficient attribute parsing
            const attrRegex = /([A-Z-]+)=(?:"([^"]*)"|([^,]*))/g;
            let match;
            
            while ((match = attrRegex.exec(attributesStr)) !== null) {
                const key = match[1];
                const value = match[2] || match[3];
                stream.attributes[key] = value;
            }

            // Extract common properties
            stream.resolution = stream.attributes.RESOLUTION;
            stream.bandwidth = parseInt(stream.attributes.BANDWIDTH) || 0;
            stream.frameRate = parseFloat(stream.attributes['FRAME-RATE']) || 0;
            stream.codecs = stream.attributes.CODECS;
            stream.audioGroup = stream.attributes.AUDIO;

            return stream;
        }

        parseAudioStream(line, baseUrl) {
            const attrRegex = /([A-Z-]+)=(?:"([^"]*)"|([^,]*))/g;
            const attributes = {};
            let match;

            while ((match = attrRegex.exec(line)) !== null) {
                attributes[match[1]] = match[2] || match[3];
            }

            if (attributes.URI) {
                return {
                    url: URLParser.resolveUrl(attributes.URI, baseUrl),
                    groupId: attributes['GROUP-ID'],
                    name: attributes.NAME || 'Audio Track',
                    language: attributes.LANGUAGE || 'Unknown',
                    isAudioOnly: true,
                    attributes
                };
            }
            return null;
        }

        parseMediaPlaylist(content, baseUrl) {
            const segments = [];
            const lines = content.split('\n').map(line => line.trim());
            let currentSegment = null;

            for (const line of lines) {
                if (line.startsWith('#EXTINF:')) {
                    const duration = parseFloat(line.substring(8).split(',')[0]);
                    currentSegment = { duration, url: '' };
                } else if (line && !line.startsWith('#') && currentSegment) {
                    currentSegment.url = URLParser.resolveUrl(line, baseUrl);
                    segments.push(currentSegment);
                    currentSegment = null;
                }
            }

            return { type: 'media', segments };
        }

        async fetchStreamData(m3u8Url) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: m3u8Url,
                    headers: {
                        'Referer': 'https://www.patreon.com',
                        'User-Agent': ConfigManager.get('userAgent')
                    },
                    onload: async (response) => {
                        if (response.status !== 200) {
                            reject(new Error(`HTTP ${response.status}`));
                            return;
                        }

                        try {
                            const data = await this.parsePlaylist(response.responseText, m3u8Url);
                            resolve(data);
                        } catch (error) {
                            reject(error);
                        }
                    },
                    onerror: reject
                });
            });
        }

        async downloadStream(m3u8Url, filename, progressCallback) {
            const downloadId = Utils.createUUID();
            this.activeDownloads.set(downloadId, { cancelled: false });

            try {
                progressCallback({ progress: 0, status: 'info', message: 'Analyzing stream...' });
                
                const streamData = await this.fetchStreamData(m3u8Url);
                const isAudioOnly = filename.endsWith('.m4a') || m3u8Url.includes('audio') || m3u8Url.includes('st=audio');
                
                if (streamData.type === 'master') {
                    // For master playlists, find the appropriate stream
                    let selectedStream;
                    
                    if (isAudioOnly && streamData.audioStreams && streamData.audioStreams.length > 0) {
                        // Select first audio stream for audio-only downloads
                        selectedStream = streamData.audioStreams[0];
                        progressCallback({ progress: 0, status: 'info', message: `Selected audio track: ${selectedStream.name || 'Audio Track'}` });
                    } else {
                        // Select highest quality video stream
                        selectedStream = streamData.streams[0];
                        if (!selectedStream) {
                            throw new Error('No streams found');
                        }
                        progressCallback({ progress: 0, status: 'info', message: `Selected quality: ${selectedStream.resolution || 'Unknown'}` });
                    }
                    
                    const mediaData = await this.fetchStreamData(selectedStream.url);
                    if (mediaData.type !== 'media') {
                        throw new Error('Invalid media playlist');
                    }
                    
                    await this.downloadSegments(mediaData.segments, filename, progressCallback, downloadId, isAudioOnly);
                } else {
                    // Direct media playlist
                    await this.downloadSegments(streamData.segments, filename, progressCallback, downloadId, isAudioOnly);
                }
            } catch (error) {
                progressCallback({ progress: 0, status: 'error', message: error.message });
            } finally {
                this.activeDownloads.delete(downloadId);
            }
        }

        async downloadSegments(segments, filename, progressCallback, downloadId, isAudioOnly = false) {
            const totalSegments = segments.length;
            const chunks = new Array(totalSegments);
            const maxConcurrent = ConfigManager.get('maxConcurrentDownloads');
            let completed = 0;
            let totalBytes = 0;

            const mediaType = isAudioOnly ? 'audio segments' : 'video segments';
            progressCallback({ progress: 0, status: 'info', message: `Downloading ${totalSegments} ${mediaType}...` });

            // Download segments in batches
            for (let i = 0; i < totalSegments; i += maxConcurrent) {
                if (this.activeDownloads.get(downloadId)?.cancelled) {
                    throw new Error('Download cancelled');
                }

                const batch = segments.slice(i, i + maxConcurrent);
                const promises = batch.map(async (segment, index) => {
                    const segmentIndex = i + index;
                    try {
                        const data = await this.downloadSegment(segment.url);
                        chunks[segmentIndex] = data;
                        totalBytes += data.byteLength;
                        completed++;
                        
                        progressCallback({
                            progress: completed / totalSegments,
                            status: 'progress',
                            message: `Downloaded ${completed}/${totalSegments} ${mediaType}`,
                            bytes: totalBytes
                        });
                    } catch (error) {
                        Logger.warn(`Failed to download segment ${segmentIndex}:`, error);
                        // Continue with other segments
                    }
                });

                await Promise.allSettled(promises);
            }

            // Combine segments
            progressCallback({ progress: 1, status: 'info', message: 'Combining segments...' });
            const combined = this.combineSegments(chunks.filter(Boolean));
            
            // Download the file
            this.saveFile(combined, filename, isAudioOnly);
            progressCallback({
                progress: 1,
                status: 'complete',
                message: 'Download complete!',
                size: combined.byteLength
            });
        }

        async downloadSegment(url) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    responseType: 'arraybuffer',
                    headers: {
                        'Referer': 'https://www.patreon.com',
                        'User-Agent': ConfigManager.get('userAgent')
                    },
                    onload: (response) => {
                        if (response.status === 200) {
                            resolve(response.response);
                        } else {
                            reject(new Error(`HTTP ${response.status}`));
                        }
                    },
                    onerror: reject
                });
            });
        }

        combineSegments(chunks) {
            const totalSize = chunks.reduce((sum, chunk) => sum + chunk.byteLength, 0);
            const combined = new Uint8Array(totalSize);
            let offset = 0;

            for (const chunk of chunks) {
                combined.set(new Uint8Array(chunk), offset);
                offset += chunk.byteLength;
            }

            return combined;
        }

        saveFile(data, filename, isAudioOnly = false) {
            // Determine correct MIME type based on file extension
            let mimeType = 'video/mp4';
            
            if (isAudioOnly || filename.endsWith('.m4a')) {
                mimeType = 'audio/mp4';
            } else if (filename.endsWith('.mp3')) {
                mimeType = 'audio/mpeg';
            } else if (filename.endsWith('.aac')) {
                mimeType = 'audio/aac';
            }
            
            const blob = new Blob([data], { type: mimeType });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = Utils.sanitizeFilename(filename);
            a.style.display = 'none';
            
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            setTimeout(() => URL.revokeObjectURL(url), 100);
        }

        cancelDownload(downloadId) {
            const download = this.activeDownloads.get(downloadId);
            if (download) {
                download.cancelled = true;
            }
        }
    }

    /**
     * UI Manager
     */
    class UIManager {
        constructor() {
            this.notifications = new Map();
            this.currentDialog = null;
        }

        showLoading(videoId) {
            const overlay = this.createElement('div', 'spl-overlay');
            const container = this.createElement('div', 'spl-container spl-fade-in');
            
            container.innerHTML = `
                <div style="text-align: center; color: white;">
                    <div class="spl-spinner"></div>
                    <div style="font-size: 18px; margin-bottom: 8px;">Loading Video ${videoId}</div>
                    <div id="spl-progress-text" style="color: #95a5a6;">Connecting to Vimeo...</div>
                </div>
            `;

            document.body.appendChild(overlay);
            document.body.appendChild(container);

            return {
                updateProgress: (text) => {
                    const progressEl = document.getElementById('spl-progress-text');
                    if (progressEl) progressEl.textContent = text;
                },
                remove: () => {
                    overlay.remove();
                    container.remove();
                }
            };
        }

        showVideoPlayer(videoUrl, videoId, videoSources) {
            document.body.innerHTML = '';
            document.documentElement.style.cssText = 'background: #1a1a1a; margin: 0; padding: 0;';

            const player = this.createElement('div', 'spl-player');
            
            const controls = this.createElement('div', 'spl-controls');
            controls.innerHTML = `
                <div class="spl-title">${videoSources.title || `Vimeo Video #${videoId}`}</div>
                <div class="spl-button-group">
                    <button id="spl-fullscreen" class="spl-button">⛶ Fullscreen</button>
                    <div style="position: relative;">
                        <button id="spl-download" class="spl-button">⬇ Download</button>
                        <div id="spl-download-dropdown" class="spl-dropdown"></div>
                    </div>
                    <button id="spl-refresh" class="spl-button secondary">↻ Refresh</button>
                </div>
            `;

            const iframe = this.createElement('iframe');
            iframe.src = videoUrl;
            iframe.style.cssText = 'flex: 1; width: 100%; border: none;';
            iframe.allowFullscreen = true;

            player.appendChild(controls);
            player.appendChild(iframe);
            document.body.appendChild(player);

            this.setupPlayerControls(videoId, videoSources);
        }

        setupPlayerControls(videoId, videoSources) {
            // Fullscreen
            document.getElementById('spl-fullscreen').onclick = () => {
                if (document.fullscreenElement) {
                    document.exitFullscreen();
                } else {
                    document.querySelector('.spl-player').requestFullscreen();
                }
            };

            // Refresh
            document.getElementById('spl-refresh').onclick = () => location.reload();

            // Download dropdown
            this.setupDownloadDropdown(videoId, videoSources);
        }

        setupDownloadDropdown(videoId, videoSources) {
            const downloadBtn = document.getElementById('spl-download');
            const dropdown = document.getElementById('spl-download-dropdown');

            const options = [];

            if (videoSources.hls) {
                options.push({
                    text: '🎬 Download Video (HLS)',
                    action: () => this.showQualityDialog(videoSources.hls, videoId, videoSources.title)
                });

                options.push({
                    text: '📄 Save HLS Stream (m3u8)',
                    action: () => this.saveM3U8File(videoSources.hls, `${videoSources.title || `vimeo-${videoId}`}.m3u8`)
                });

                options.push({
                    text: '📋 Copy Stream URL',
                    action: () => this.copyToClipboard(videoSources.hls, 'Stream URL copied!')
                });
            }

            // Add MP4 direct download options if available
            if (videoSources.quality && Object.keys(videoSources.quality).length > 0) {
                options.push({
                    text: '📹 Direct MP4 Downloads',
                    action: () => this.showMP4QualityDialog(videoSources.quality, videoId, videoSources.title)
                });
            }

            if (videoSources.configUrl && !videoSources.hls) {
                options.push({
                    text: '📋 Copy Config URL',
                    action: () => this.copyToClipboard(videoSources.configUrl, 'Config URL copied!')
                });
            }

            if (options.length === 0) {
                options.push({
                    text: '❓ Download Help',
                    action: () => this.showDownloadHelp(videoId)
                });
            }

            dropdown.innerHTML = options.map(opt => 
                `<div class="spl-dropdown-item">${opt.text}</div>`
            ).join('');

            dropdown.querySelectorAll('.spl-dropdown-item').forEach((item, index) => {
                item.onclick = () => {
                    dropdown.classList.remove('active');
                    options[index].action();
                };
            });

            downloadBtn.onclick = (e) => {
                e.stopPropagation();
                dropdown.classList.toggle('active');
            };

            document.addEventListener('click', (e) => {
                if (!downloadBtn.contains(e.target)) {
                    dropdown.classList.remove('active');
                }
            });
        }

        async showQualityDialog(m3u8Url, videoId, title) {
            const overlay = this.createElement('div', 'spl-overlay', {
                style: 'display: flex; align-items: center; justify-content: center;'
            });

            const dialog = this.createElement('div', 'spl-dialog spl-slide-in');
            dialog.innerHTML = `
                <h3>HLS Stream Download</h3>
                <p>Analyzing available qualities...</p>
                <div class="spl-spinner" style="margin: 20px auto;"></div>
                <div id="spl-quality-list"></div>
                <div id="spl-audio-list" style="margin-top: 15px; border-top: 1px solid #444; padding-top: 15px; display: none;">
                    <h4 style="margin-top: 0; color: #3498db;">🔊 Audio Tracks (Audio Only)</h4>
                    <div id="spl-audio-tracks"></div>
                </div>
                <div style="display: flex; justify-content: space-between; margin-top: 20px;">
                    <button id="spl-close-dialog" class="spl-button secondary">Close</button>
                    <button id="spl-download-best" class="spl-button">Download Best Quality</button>
                </div>
                <div style="margin-top: 15px; font-size: 12px; color: #95a5a6;">
                    <p><strong>💡 Audio Solutions:</strong></p>
                    <ul style="margin: 5px 0; padding-left: 20px;">
                        <li>🔊 <strong>Audio tracks above</strong> - Download audio separately as .m4a files</li>
                        <li>📄 <strong>Save HLS Stream</strong> - Use VLC player for guaranteed audio+video playback</li>
                        <li>📹 <strong>Direct MP4</strong> - Use menu option if available (includes audio)</li>
                    </ul>
                </div>
            `;

            overlay.appendChild(dialog);
            document.body.appendChild(overlay);
            this.currentDialog = overlay;

            // Close handlers
            document.getElementById('spl-close-dialog').onclick = () => this.closeDialog();
            document.getElementById('spl-download-best').onclick = () => {
                this.startDownload(m3u8Url, title || `vimeo-${videoId}.mp4`);
                this.closeDialog();
            };

            try {
                const hlsManager = new HLSManager();
                const streamData = await hlsManager.fetchStreamData(m3u8Url);
                
                dialog.querySelector('.spl-spinner').remove();
                dialog.querySelector('p').textContent = 'Select quality to download:';

                if (streamData.type === 'master' && streamData.streams.length > 0) {
                    this.populateQualityList(streamData, videoId, title);
                } else {
                    document.getElementById('spl-quality-list').innerHTML = '<p>No quality options found. Use "Download Best Quality" button.</p>';
                }
            } catch (error) {
                this.showError(`Failed to analyze stream: ${error.message}`);
                this.closeDialog();
            }
        }

        populateQualityList(streamData, videoId, title) {
            const qualityList = document.getElementById('spl-quality-list');
            const audioList = document.getElementById('spl-audio-list');
            const audioTracks = document.getElementById('spl-audio-tracks');
            
            // Filter video and audio streams
            const videoStreams = streamData.streams.filter(s => !s.isAudioOnly);
            const audioStreams = streamData.audioStreams || [];
            
            // Populate video quality options
            qualityList.innerHTML = videoStreams.map(stream => {
                const label = this.getQualityLabel(stream);
                const hasAudio = stream.codecs && stream.codecs.includes('mp4a');
                const audioClass = hasAudio ? 'has-audio' : 'no-audio';
                const audioText = hasAudio ? '✓ Audio' : '✗ No Audio';
                
                return `
                    <div class="spl-quality-option" data-url="${stream.url}" data-label="${label}">
                        <div>
                            <strong>${label}</strong>
                            <span class="spl-audio-indicator ${audioClass}">${audioText}</span>
                        </div>
                        <div>${Utils.formatBitrate(stream.bandwidth)}</div>
                    </div>
                `;
            }).join('');

            // Populate audio tracks if available
            if (audioStreams.length > 0) {
                audioList.style.display = 'block';
                audioTracks.innerHTML = audioStreams.map(audioStream => {
                    const audioName = audioStream.name || 'Audio Track';
                    const language = audioStream.language ? ` (${audioStream.language})` : '';
                    
                    return `
                        <div class="spl-quality-option" data-url="${audioStream.url}" data-label="audio" data-name="${audioName}">
                            <div>
                                <strong>🔊 ${audioName}${language}</strong>
                                <span class="spl-audio-indicator has-audio">Audio Only</span>
                            </div>
                            <div>Audio Track</div>
                        </div>
                    `;
                }).join('');

                // Add audio track click handlers
                audioTracks.querySelectorAll('.spl-quality-option').forEach(option => {
                    option.onclick = () => {
                        const url = option.dataset.url;
                        const audioName = option.dataset.name;
                        const filename = `${title || `vimeo-${videoId}`}_${audioName.replace(/[^a-zA-Z0-9]/g, '_')}.m4a`;
                        this.startDownload(url, filename);
                        this.closeDialog();
                    };
                });
            }

            // Add warning if no streams have audio
            const hasAnyAudio = videoStreams.some(s => s.codecs && s.codecs.includes('mp4a')) || audioStreams.length > 0;
            if (!hasAnyAudio) {
                const warningDiv = document.createElement('div');
                warningDiv.style.cssText = 'background: #e74c3c; color: white; padding: 12px; border-radius: 6px; margin: 10px 0;';
                warningDiv.innerHTML = `
                    <strong>⚠️ Audio Warning:</strong> No audio detected in any stream.
                    For guaranteed audio playback, use "Save HLS Stream" option and open in VLC player.
                `;
                qualityList.appendChild(warningDiv);
            }

            // Add video quality click handlers
            qualityList.querySelectorAll('.spl-quality-option').forEach(option => {
                option.onclick = () => {
                    const url = option.dataset.url;
                    const label = option.dataset.label;
                    const filename = `${title || `vimeo-${videoId}`}_${label}.mp4`;
                    this.startDownload(url, filename);
                    this.closeDialog();
                };
            });
        }

        getQualityLabel(stream) {
            if (stream.resolution) {
                const match = stream.resolution.match(/\d+x(\d+)/);
                if (match) {
                    let label = `${match[1]}p`;
                    if (stream.frameRate >= 50) {
                        label += ` ${Math.round(stream.frameRate)}fps`;
                    }
                    return label;
                }
                return stream.resolution;
            }
            return 'Unknown';
        }

        startDownload(url, filename) {
            const hlsManager = new HLSManager();
            const notificationId = this.showNotification({
                type: 'info',
                title: `Downloading ${filename}`,
                message: 'Preparing download...',
                persistent: true,
                showProgress: true
            });

            hlsManager.downloadStream(url, filename, ({ progress, status, message, bytes, size }) => {
                switch (status) {
                    case 'progress':
                        this.updateNotification(notificationId, {
                            message: `${Math.round(progress * 100)}% - ${message}`,
                            progress: progress
                        });
                        break;
                    case 'info':
                        this.updateNotification(notificationId, { message });
                        break;
                    case 'complete':
                        this.updateNotification(notificationId, {
                            type: 'success',
                            message: `Download complete! (${Utils.formatBytes(size)})`,
                            progress: 1,
                            autoClose: 5000
                        });
                        break;
                    case 'error':
                        this.updateNotification(notificationId, {
                            type: 'error',
                            message: `Error: ${message}`,
                            autoClose: 8000
                        });
                        break;
                }
            });
        }

        saveM3U8File(url, filename) {
            const content = `#EXTM3U\n#EXT-X-STREAM-INF:PROGRAM-ID=1\n${url}`;
            const blob = new Blob([content], { type: 'application/x-mpegurl' });
            const downloadUrl = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = Utils.sanitizeFilename(filename);
            a.click();
            
            setTimeout(() => URL.revokeObjectURL(downloadUrl), 100);
            
            this.showNotification({
                type: 'success',
                title: 'HLS Stream Saved',
                message: 'Open with VLC or similar player for best results',
                autoClose: 5000
            });
        }

        showMP4QualityDialog(qualityOptions, videoId, title) {
            const overlay = this.createElement('div', 'spl-overlay', {
                style: 'display: flex; align-items: center; justify-content: center;'
            });

            const dialog = this.createElement('div', 'spl-dialog spl-slide-in');
            dialog.innerHTML = `
                <h3>📹 Direct MP4 Downloads</h3>
                <p>Select quality to download directly (with guaranteed audio):</p>
                <div id="spl-mp4-quality-list"></div>
                <div style="display: flex; justify-content: space-between; margin-top: 20px;">
                    <button id="spl-close-mp4-dialog" class="spl-button secondary">Close</button>
                </div>
                <div style="margin-top: 15px; font-size: 12px; color: #95a5a6;">
                    <p><strong>✅ Advantage:</strong> MP4 files include both video and audio in a single file</p>
                </div>
            `;

            overlay.appendChild(dialog);
            document.body.appendChild(overlay);
            this.currentDialog = overlay;

            // Close handler
            document.getElementById('spl-close-mp4-dialog').onclick = () => this.closeDialog();

            // Populate MP4 quality options
            const mp4QualityList = document.getElementById('spl-mp4-quality-list');
            mp4QualityList.innerHTML = Object.values(qualityOptions).map(quality => {
                return `
                    <div class="spl-quality-option" data-url="${quality.url}" data-quality="${quality.quality}">
                        <div>
                            <strong>${quality.quality} (${quality.width}x${quality.height})</strong>
                            <span class="spl-audio-indicator has-audio">✓ Video + Audio</span>
                        </div>
                        <div>MP4 Direct</div>
                    </div>
                `;
            }).join('');

            // Add click handlers for MP4 downloads
            mp4QualityList.querySelectorAll('.spl-quality-option').forEach(option => {
                option.onclick = () => {
                    const url = option.dataset.url;
                    const quality = option.dataset.quality;
                    const filename = `${title || `vimeo-${videoId}`}_${quality}.mp4`;
                    this.downloadFile(url, filename);
                    this.closeDialog();
                };
            });
        }

        downloadFile(url, filename) {
            // Create download notification
            const notificationId = this.showNotification({
                type: 'info',
                title: `Downloading ${filename}`,
                message: 'Starting download...',
                persistent: true,
                showProgress: true
            });

            // Use XMLHttpRequest for progress tracking
            const xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.responseType = 'blob';

            xhr.onprogress = (e) => {
                if (e.lengthComputable) {
                    const progress = e.loaded / e.total;
                    const percent = Math.round(progress * 100);
                    this.updateNotification(notificationId, {
                        message: `Downloading: ${percent}% (${Utils.formatBytes(e.loaded)} / ${Utils.formatBytes(e.total)})`,
                        progress: progress
                    });
                } else {
                    this.updateNotification(notificationId, {
                        message: `Downloaded: ${Utils.formatBytes(e.loaded)}`
                    });
                }
            };

            xhr.onload = () => {
                if (xhr.status === 200) {
                    const blob = new Blob([xhr.response], { type: 'video/mp4' });
                    const downloadUrl = URL.createObjectURL(blob);
                    
                    const a = document.createElement('a');
                    a.href = downloadUrl;
                    a.download = Utils.sanitizeFilename(filename);
                    a.style.display = 'none';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    
                    setTimeout(() => URL.revokeObjectURL(downloadUrl), 100);

                    this.updateNotification(notificationId, {
                        type: 'success',
                        message: `Download complete! (${Utils.formatBytes(xhr.response.size)})`,
                        progress: 1,
                        autoClose: 5000
                    });
                } else {
                    this.updateNotification(notificationId, {
                        type: 'error',
                        message: `Download failed: HTTP ${xhr.status}`,
                        autoClose: 8000
                    });
                }
            };

            xhr.onerror = () => {
                this.updateNotification(notificationId, {
                    type: 'error',
                    message: 'Download failed: Network error',
                    autoClose: 8000
                });
            };

            xhr.send();
        }

        async copyToClipboard(text, successMessage) {
            try {
                await navigator.clipboard.writeText(text);
                this.showNotification({
                    type: 'success',
                    title: 'Copied!',
                    message: successMessage,
                    autoClose: 3000
                });
            } catch (error) {
                // Fallback
                const textarea = document.createElement('textarea');
                textarea.value = text;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                
                this.showNotification({
                    type: 'success',
                    title: 'Copied!',
                    message: successMessage,
                    autoClose: 3000
                });
            }
        }

        showNotification({ type = 'info', title, message, autoClose, persistent, showProgress }) {
            const id = Utils.createUUID();
            
            const notification = this.createElement('div', `spl-notification ${type} spl-slide-in`);
            notification.innerHTML = `
                <div style="font-weight: 600; margin-bottom: 4px;">${title}</div>
                <div style="color: rgba(255,255,255,0.9);">${message}</div>
                ${showProgress ? '<div class="spl-progress"><div class="spl-progress-bar" style="width: 0%;"></div></div>' : ''}
                ${!persistent ? '<div style="margin-top: 8px; text-align: right;"><button class="spl-button" style="padding: 4px 8px; font-size: 12px;">✕</button></div>' : ''}
            `;

            document.body.appendChild(notification);
            this.notifications.set(id, notification);

            if (!persistent) {
                const closeBtn = notification.querySelector('button');
                if (closeBtn) {
                    closeBtn.onclick = () => this.removeNotification(id);
                }
            }

            if (autoClose) {
                setTimeout(() => this.removeNotification(id), autoClose);
            }

            return id;
        }

        updateNotification(id, { type, message, progress, autoClose }) {
            const notification = this.notifications.get(id);
            if (!notification) return;

            if (type) {
                notification.className = `spl-notification ${type}`;
            }
            
            if (message) {
                const messageEl = notification.children[1];
                if (messageEl) messageEl.textContent = message;
            }
            
            if (progress !== undefined) {
                const progressBar = notification.querySelector('.spl-progress-bar');
                if (progressBar) {
                    progressBar.style.width = `${progress * 100}%`;
                }
            }
            
            if (autoClose) {
                setTimeout(() => this.removeNotification(id), autoClose);
            }
        }

        removeNotification(id) {
            const notification = this.notifications.get(id);
            if (notification) {
                notification.style.transform = 'translateX(100%)';
                notification.style.opacity = '0';
                setTimeout(() => {
                    notification.remove();
                    this.notifications.delete(id);
                }, 300);
            }
        }

        showDownloadHelp(videoId) {
            const overlay = this.createElement('div', 'spl-overlay', {
                style: 'display: flex; align-items: center; justify-content: center;'
            });

            const dialog = this.createElement('div', 'spl-dialog spl-slide-in');
            dialog.innerHTML = `
                <h3>Download Help</h3>
                <p>This video couldn't be automatically processed. Try these methods:</p>
                
                <h4>Method 1: Browser Developer Tools</h4>
                <ol>
                    <li>Press F12 to open Developer Tools</li>
                    <li>Go to the Network tab</li>
                    <li>Refresh the page and look for .mp4 or .m3u8 files</li>
                    <li>Right-click and save or copy the URL</li>
                </ol>
                
                <h4>Method 2: External Tools</h4>
                <ul>
                    <li>Use yt-dlp: <code>yt-dlp https://vimeo.com/${videoId}</code></li>
                    <li>Browser extensions like "Video DownloadHelper"</li>
                </ul>
                
                <button id="spl-close-help" class="spl-button" style="margin-top: 20px;">Close</button>
            `;

            overlay.appendChild(dialog);
            document.body.appendChild(overlay);
            this.currentDialog = overlay;

            document.getElementById('spl-close-help').onclick = () => this.closeDialog();
        }

        showError(message) {
            document.body.innerHTML = '';
            
            const container = this.createElement('div', 'spl-container spl-fade-in');
            container.innerHTML = `
                <div style="text-align: center; color: white;">
                    <div style="font-size: 48px; color: #e74c3c; margin-bottom: 20px;">⚠</div>
                    <h2 style="color: #e74c3c; margin: 0 0 10px 0;">Error</h2>
                    <p style="color: #ecf0f1; margin-bottom: 20px;">${message}</p>
                    <button class="spl-button" onclick="location.reload()">Try Again</button>
                </div>
            `;
            
            document.body.appendChild(container);
        }

        closeDialog() {
            if (this.currentDialog) {
                this.currentDialog.remove();
                this.currentDialog = null;
            }
        }

        createElement(tag, className = '', attributes = {}) {
            const element = document.createElement(tag);
            if (className) element.className = className;
            Object.assign(element, attributes);
            return element;
        }
    }

    /**
     * Main Application Class
     */
    class VimeoSPL {
        constructor() {
            this.ui = new UIManager();
            this.hlsManager = new HLSManager();
            this.loadingUI = null;
        }

        async init() {
            try {
                StyleManager.inject();
                
                if (!this.isRestrictedVideo()) {
                    Logger.debug('Not a restricted video page');
                    return;
                }

                const videoId = URLParser.extractVideoId(window.location.href);
                this.loadingUI = this.ui.showLoading(videoId);
                
                await this.loadVideo(videoId);
            } catch (error) {
                Logger.error('Initialization failed:', error);
                this.ui.showError(error.message);
            }
        }

        isRestrictedVideo() {
            const indicators = [
                '.exception_title.iris_header',
                '.private-content-banner',
                '[data-test-id="private-video-banner"]'
            ];

            if (indicators.some(selector => document.querySelector(selector))) {
                return true;
            }

            const pageText = document.body.textContent || '';
            const restrictedPhrases = [
                'This video is private',
                'because of its privacy settings',
                'content is available with',
                'Page not found',
                'Due to privacy settings'
            ];

            return restrictedPhrases.some(phrase => pageText.includes(phrase));
        }

        async loadVideo(videoId) {
            const timeout = ConfigManager.get('loadTimeout');
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Request timeout')), timeout)
            );

            try {
                this.loadingUI.updateProgress('Fetching video data...');
                
                const response = await Promise.race([
                    this.fetchVideoData(videoId),
                    timeoutPromise
                ]);

                this.loadingUI.updateProgress('Processing video...');
                
                const videoSources = await VideoExtractor.extract(response);
                if (!videoSources) {
                    throw new Error('No video sources found');
                }

                // Fetch additional config if needed
                if (!videoSources.hls && videoSources.configUrl) {
                    this.loadingUI.updateProgress('Fetching additional data...');
                    await this.fetchAdditionalConfig(videoSources);
                }

                // Setup video player
                const videoUrl = videoSources.iframeSrc || 
                    URL.createObjectURL(new Blob([response], { type: 'text/html' }));
                
                this.loadingUI.remove();
                this.ui.showVideoPlayer(videoUrl, videoId, videoSources);
                
                Logger.info('Video loaded successfully');
            } catch (error) {
                if (this.loadingUI) this.loadingUI.remove();
                throw error;
            }
        }

        async fetchVideoData(videoId) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: `https://player.vimeo.com/video/${videoId}`,
                    headers: {
                        'Referer': 'https://www.patreon.com',
                        'User-Agent': ConfigManager.get('userAgent'),
                        'Cache-Control': 'no-cache'
                    },
                    onload: (response) => {
                        if (response.status >= 400) {
                            reject(new Error(`Server error: ${response.status}`));
                            return;
                        }
                        resolve(response.responseText);
                    },
                    onerror: () => reject(new Error('Network error'))
                });
            });
        }

        async fetchAdditionalConfig(videoSources) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: videoSources.configUrl,
                    headers: {
                        'Referer': 'https://www.patreon.com',
                        'User-Agent': ConfigManager.get('userAgent'),
                        'Accept': 'application/json'
                    },
                    onload: (response) => {
                        try {
                            if (response.status >= 400) {
                                throw new Error(`Config request failed: ${response.status}`);
                            }

                            const config = JSON.parse(response.responseText);
                            VideoExtractor.extractFromConfig(config, videoSources);
                            resolve();
                        } catch (error) {
                            Logger.warn('Config parsing failed:', error);
                            resolve(); // Continue without config
                        }
                    },
                    onerror: () => {
                        Logger.warn('Config request failed');
                        resolve(); // Continue without config
                    }
                });
            });
        }
    }

    // Initialize the application
    const app = new VimeoSPL();
    
    // Robust initialization with retry logic
    const initWithRetry = async (attempts = 3) => {
        for (let i = 0; i < attempts; i++) {
            try {
                await app.init();
                break;
            } catch (error) {
                Logger.error(`Initialization attempt ${i + 1} failed:`, error);
                if (i === attempts - 1) {
                    // Final attempt failed
                    const ui = new UIManager();
                    StyleManager.inject();
                    ui.showError('Failed to initialize SPL. Please refresh the page.');
                } else {
                    // Wait before retry
                    await Utils.sleep(1000 * (i + 1));
                }
            }
        }
    };

    // Start initialization based on document state
    if (document.readyState === 'complete') {
        setTimeout(() => initWithRetry(), 500);
    } else {
        window.addEventListener('load', () => {
            setTimeout(() => initWithRetry(), 500);
        });
    }

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        // Cancel any active downloads
        if (app.hlsManager) {
            for (const [id] of app.hlsManager.activeDownloads) {
                app.hlsManager.cancelDownload(id);
            }
        }
    });

})();