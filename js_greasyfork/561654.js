// ==UserScript==
// @name         TVDB Episode Matcher
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Match torrent episodes with TheTVDB data
// @author       Dooky
// @match        https://*/*torrents*
// @connect      api4.thetvdb.com
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @run-at       document-idle

// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/561654/TVDB%20Episode%20Matcher.user.js
// @updateURL https://update.greasyfork.org/scripts/561654/TVDB%20Episode%20Matcher.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const TVDB_API_BASE = "https://api4.thetvdb.com/v4";
    const TVDB_API_KEY_STORAGE = "tvdb_api_key";
    const TVDB_TOKEN_STORAGE = "tvdb_token";
    const TVDB_TOKEN_EXPIRY = "tvdb_token_expiry";

    function extractSeriesInfo() {
        const torrentNameEl = document.querySelector('h1.torrent__name');
        if (!torrentNameEl) return null;

        const fullText = torrentNameEl.textContent.trim();
        const akaMatch = fullText.match(/^(.+?)\s+AKA\s+/i);
        let seriesName = '';
        
        if (akaMatch) {
            seriesName = akaMatch[1].trim();
        } else {
            const seasonMatch = fullText.match(/^(.+?)\s+S(\d+)/i);
            if (seasonMatch) {
                seriesName = seasonMatch[1].trim();
            } else {
                return null;
            }
        }
        
        const seasonMatch = fullText.match(/S(?:eason\s*)?(\d+)/i);
        if (!seasonMatch) return null;
        
        const seasonNumber = parseInt(seasonMatch[1], 10);
        
        seriesName = seriesName
            .replace(/\s*\((\d{4})\)\s*$/, '')
            .replace(/\s+(\d{4})\s*$/, '')
            .replace(/^(\d{4})\s+/, '')
            .replace(/\s*\((\d{4})\)\s*/, ' ')
            .replace(/\s+\d{4}\s+/g, ' ')
            .trim();
        
        return {
            seriesName: seriesName,
            seasonNumber: seasonNumber,
            fullText: fullText
        };
    }

    function getAPIKey() {
        return GM_getValue(TVDB_API_KEY_STORAGE);
    }

    function showSettingsModal() {
        const modal = document.createElement('div');
        modal.className = 'tvdb-settings-modal';
        modal.style.display = 'block';
        
        const currentKey = getAPIKey() || '';
        const maskedKey = currentKey ? '*'.repeat(Math.min(currentKey.length, 20)) + (currentKey.length > 20 ? '...' : '') : '';
        
        modal.innerHTML = `
            <div class="tvdb-settings-modal-content">
                <span class="tvdb-modal-close">&times;</span>
                <h2>TVDB Episode Matcher Settings</h2>
                <form id="tvdb-settings-form">
                    <div class="tvdb-settings-form-group">
                        <label class="tvdb-settings-label" for="tvdb-api-key">TheTVDB API Key</label>
                        <input 
                            type="password" 
                            id="tvdb-api-key" 
                            class="tvdb-settings-input" 
                            placeholder="Enter your TheTVDB API key"
                            value="${currentKey}"
                        />
                        <div class="tvdb-settings-help">
                            ${currentKey ? `Current key: ${maskedKey} (enter new key to update)` : 'Get your API key at: '}
                            ${currentKey ? '' : '<a href="https://www.thetvdb.com/api-information/signup" target="_blank">https://www.thetvdb.com/api-information/signup</a>'}
                        </div>
                    </div>
                    <div class="tvdb-settings-status" id="tvdb-settings-status"></div>
                    <div class="tvdb-settings-buttons">
                        <button type="button" class="tvdb-matcher-button" id="tvdb-settings-test">Test Connection</button>
                        <button type="submit" class="tvdb-matcher-button">Save</button>
                        <button type="button" class="tvdb-matcher-button" style="background: #6c757d;" id="tvdb-settings-cancel">Cancel</button>
                    </div>
                </form>
            </div>
        `;

        const closeBtn = modal.querySelector('.tvdb-modal-close');
        const cancelBtn = modal.querySelector('#tvdb-settings-cancel');
        const form = modal.querySelector('#tvdb-settings-form');
        const testBtn = modal.querySelector('#tvdb-settings-test');
        const statusDiv = modal.querySelector('#tvdb-settings-status');
        const apiKeyInput = modal.querySelector('#tvdb-api-key');

        const closeModal = () => modal.remove();

        closeBtn.onclick = closeModal;
        cancelBtn.onclick = closeModal;

        modal.onclick = (e) => {
            if (e.target === modal) closeModal();
        };

        testBtn.onclick = async () => {
            const apiKey = apiKeyInput.value.trim();
            if (!apiKey) {
                showStatus('Please enter an API key first', 'error');
                return;
            }

            testBtn.disabled = true;
            testBtn.textContent = 'Testing...';
            showStatus('Testing connection...', 'success');

            try {
                const response = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: "POST",
                        url: `${TVDB_API_BASE}/login`,
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json"
                        },
                        data: JSON.stringify({ apikey: apiKey }),
                        onload: resolve,
                        onerror: reject
                    });
                });

                if (response.status === 200) {
                    showStatus('✓ Connection successful! API key is valid.', 'success');
                } else {
                    showStatus(`✗ Connection failed: ${response.status} ${response.statusText}`, 'error');
                }
            } catch (error) {
                showStatus(`✗ Connection error: ${error.message || error}`, 'error');
            } finally {
                testBtn.disabled = false;
                testBtn.textContent = 'Test Connection';
            }
        };

        form.onsubmit = (e) => {
            e.preventDefault();
            const apiKey = apiKeyInput.value.trim();
            
            if (!apiKey) {
                showStatus('Please enter an API key', 'error');
                return;
            }

            GM_setValue(TVDB_API_KEY_STORAGE, apiKey);
            GM_setValue(TVDB_TOKEN_STORAGE, '');
            GM_setValue(TVDB_TOKEN_EXPIRY, 0);
            
            showStatus('✓ Settings saved successfully!', 'success');
            
            setTimeout(closeModal, 1500);
        };

        function showStatus(message, type) {
            statusDiv.textContent = message;
            statusDiv.className = `tvdb-settings-status ${type}`;
            statusDiv.style.display = 'block';
        }

        document.body.appendChild(modal);
        apiKeyInput.focus();
    }

    function getTVDBToken() {
        return new Promise((resolve, reject) => {
            const cachedToken = GM_getValue(TVDB_TOKEN_STORAGE);
            const tokenExpiry = GM_getValue(TVDB_TOKEN_EXPIRY, 0);
            
            if (cachedToken && tokenExpiry > Date.now()) {
                resolve(cachedToken);
                return;
            }

            const apiKey = getAPIKey();
            if (!apiKey) {
                reject(new Error("API key is required. Please configure it in settings."));
                return;
            }

            GM_xmlhttpRequest({
                method: "POST",
                url: `${TVDB_API_BASE}/login`,
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                data: JSON.stringify({ apikey: apiKey }),
                onload: function(response) {
                    if (response.status === 200) {
                        try {
                            const data = JSON.parse(response.responseText);
                            if (data.data && data.data.token) {
                                const token = data.data.token;
                                GM_setValue(TVDB_TOKEN_STORAGE, token);
                                GM_setValue(TVDB_TOKEN_EXPIRY, Date.now() + (30 * 24 * 60 * 60 * 1000));
                                resolve(token);
                            } else {
                                reject(new Error("Invalid API response"));
                            }
                        } catch (e) {
                            reject(new Error("Failed to parse token response: " + e.message));
                        }
                    } else {
                        reject(new Error(`Failed to get token: ${response.status} ${response.statusText}`));
                    }
                },
                onerror: function(error) {
                    reject(new Error("Network error: " + error));
                }
            });
        });
    }

    function searchTVDBSeries(query, token) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: `${TVDB_API_BASE}/search?query=${encodeURIComponent(query)}&type=series`,
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json",
                    "Accept-Language": "eng"
                },
                onload: function(response) {
                    if (response.status === 200) {
                        try {
                            const data = JSON.parse(response.responseText);
                            resolve(data.data || []);
                        } catch (e) {
                            reject(new Error("Failed to parse search response: " + e.message));
                        }
                    } else {
                        reject(new Error(`Search failed: ${response.status} ${response.statusText}`));
                    }
                },
                onerror: function(error) {
                    reject(new Error("Network error: " + error));
                }
            });
        });
    }

    function getTVDBEpisodeDetails(episodeId, token) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: `${TVDB_API_BASE}/episodes/${episodeId}`,
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json",
                    "Accept-Language": "eng"
                },
                onload: function(response) {
                    if (response.status === 200) {
                        try {
                            const data = JSON.parse(response.responseText);
                            resolve(data.data || {});
                        } catch (e) {
                            reject(new Error("Failed to parse episode details: " + e.message));
                        }
                    } else {
                        reject(new Error(`Failed to get episode details: ${response.status} ${response.statusText}`));
                    }
                },
                onerror: function(error) {
                    reject(new Error("Network error: " + error));
                }
            });
        });
    }

    function getTVDBSeasonEpisodes(seriesId, seasonNumber, token) {
        return new Promise(async (resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: `${TVDB_API_BASE}/series/${seriesId}/episodes/default/${seasonNumber}`,
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json",
                    "Accept-Language": "eng"
                },
                onload: async function(response) {
                    if (response.status === 200) {
                        try {
                            const data = JSON.parse(response.responseText);
                            
                            let episodes = [];
                            if (data.data) {
                                if (Array.isArray(data.data)) {
                                    episodes = data.data;
                                } else if (data.data.episodes) {
                                    episodes = data.data.episodes;
                                } else if (data.data.episode) {
                                    episodes = [data.data.episode];
                                }
                            }
                            
                            if (episodes.length > 0) {
                                const needsDetails = episodes.some(ep => {
                                    const hasName = ep.nameTranslations?.eng || ep.nameTranslations?.en ||
                                                   ep.translations?.eng?.name || ep.translations?.en?.name ||
                                                   ep.name || ep.episodeName || ep.title || ep.episodeTitle;
                                    return !hasName && (ep.id || ep.episodeId || ep.episode_id);
                                });
                                
                                if (needsDetails) {
                                    try {
                                        const episodesWithDetails = await Promise.all(
                                            episodes.map(async (ep) => {
                                                const epId = ep.id || ep.episodeId || ep.episode_id;
                                                const hasName = ep.nameTranslations?.eng || ep.nameTranslations?.en ||
                                                               ep.translations?.eng?.name || ep.translations?.en?.name ||
                                                               ep.name || ep.episodeName || ep.title || ep.episodeTitle;
                                                if (epId && !hasName) {
                                                    try {
                                                        const details = await getTVDBEpisodeDetails(epId, token);
                                                        return { ...ep, ...details };
                                                    } catch (e) {
                                                        return ep;
                                                    }
                                                }
                                                return ep;
                                            })
                                        );
                                        episodes = episodesWithDetails;
                                    } catch (e) {
                                    }
                                }
                            }
                            
                            resolve({ episodes: episodes });
                        } catch (e) {
                            reject(new Error("Failed to parse episodes response: " + e.message));
                        }
                    } else {
                        reject(new Error(`Failed to get episodes: ${response.status} ${response.statusText}`));
                    }
                },
                onerror: function(error) {
                    reject(new Error("Network error: " + error));
                }
            });
        });
    }

    function getTVDBAbsoluteEpisodes(seriesId, token, page = 0) {
        return new Promise(async (resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: `${TVDB_API_BASE}/series/${seriesId}/episodes/absolute?page=${page}`,
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json",
                    "Accept-Language": "eng"
                },
                onload: async function(response) {
                    if (response.status === 200) {
                        try {
                            const data = JSON.parse(response.responseText);
                            
                            let episodes = [];
                            if (data.data) {
                                if (Array.isArray(data.data)) {
                                    episodes = data.data;
                                } else if (data.data.episodes) {
                                    episodes = data.data.episodes;
                                } else if (data.data.episode) {
                                    episodes = [data.data.episode];
                                }
                            }
                            
                            if (episodes.length > 0) {
                                const needsDetails = episodes.some(ep => {
                                    const hasName = ep.nameTranslations?.eng || ep.nameTranslations?.en ||
                                                   ep.translations?.eng?.name || ep.translations?.en?.name ||
                                                   ep.name || ep.episodeName || ep.title || ep.episodeTitle;
                                    return !hasName && (ep.id || ep.episodeId || ep.episode_id);
                                });
                                
                                if (needsDetails) {
                                    try {
                                        const episodesWithDetails = await Promise.all(
                                            episodes.map(async (ep) => {
                                                const epId = ep.id || ep.episodeId || ep.episode_id;
                                                const hasName = ep.nameTranslations?.eng || ep.nameTranslations?.en ||
                                                               ep.translations?.eng?.name || ep.translations?.en?.name ||
                                                               ep.name || ep.episodeName || ep.title || ep.episodeTitle;
                                                if (epId && !hasName) {
                                                    try {
                                                        const details = await getTVDBEpisodeDetails(epId, token);
                                                        return { ...ep, ...details };
                                                    } catch (e) {
                                                        return ep;
                                                    }
                                                }
                                                return ep;
                                            })
                                        );
                                        episodes = episodesWithDetails;
                                    } catch (e) {
                                    }
                                }
                            }
                            
                            resolve({ episodes: episodes, isAbsolute: true });
                        } catch (e) {
                            reject(new Error("Failed to parse episodes response: " + e.message));
                        }
                    } else {
                        reject(new Error(`Failed to get absolute episodes: ${response.status} ${response.statusText}`));
                    }
                },
                onerror: function(error) {
                    reject(new Error("Network error: " + error));
                }
            });
        });
    }

    function extractEpisodeFiles() {
        const files = [];
        const videoExtensions = ['.mkv', '.mp4', '.avi', '.m4v', '.mov', '.webm'];
        
        const dialog = document.querySelector('dialog.dialog.dialog--auto-width');
        
        if (dialog) {
            const hierarchyPanel = dialog.querySelector('[data-tab="hierarchy"]');
            if (hierarchyPanel) {
                const fileElements = hierarchyPanel.querySelectorAll('details summary span[style*="word-break"]');
                fileElements.forEach(el => {
                    const text = el.textContent.trim();
                    if (text && videoExtensions.some(ext => text.toLowerCase().includes(ext))) {
                        files.push(text);
                    }
                });
                
                if (files.length === 0) {
                    const allSummaries = hierarchyPanel.querySelectorAll('details summary');
                    allSummaries.forEach(summary => {
                        const text = summary.textContent.trim();
                        if (text.match(/[Ss]\d+[Ee]\d+/) && 
                            videoExtensions.some(ext => text.toLowerCase().includes(ext))) {
                            const match = text.match(/(.+\.(mkv|mp4|avi|m4v|mov|webm))$/i);
                            if (match && !files.includes(match[1])) {
                                files.push(match[1]);
                            }
                        }
                    });
                }
            }

            const listPanel = dialog.querySelector('[data-tab="list"]');
            if (listPanel) {
                const rows = listPanel.querySelectorAll('tbody tr');
                rows.forEach(row => {
                    const nameCell = row.querySelector('td:nth-child(2)');
                    if (nameCell) {
                        const text = nameCell.textContent.trim();
                        if (text && videoExtensions.some(ext => text.toLowerCase().includes(ext))) {
                            if (!files.includes(text)) {
                                files.push(text);
                            }
                        }
                    }
                });
            }

            if (files.length === 0) {
                const allText = dialog.textContent || dialog.innerText;
                const episodeMatches = allText.match(/[Ss]\d+[Ee]\d+.*?\.(mkv|mp4|avi|m4v|mov|webm)/gi);
                if (episodeMatches) {
                    episodeMatches.forEach(match => {
                        const fullMatch = match.match(/(.+\.(mkv|mp4|avi|m4v|mov|webm))$/i);
                        if (fullMatch && !files.includes(fullMatch[1])) {
                            files.push(fullMatch[1]);
                        }
                    });
                }
                
                if (files.length === 0) {
                    const bracketEpisodeMatches = allText.match(/\[[^\]]+\].*?- \d{2,3}(?:v\d+)?.*?\.(mkv|mp4|avi|m4v|mov|webm)/gi);
                    if (bracketEpisodeMatches) {
                        bracketEpisodeMatches.forEach(match => {
                            if (!files.includes(match)) {
                                files.push(match);
                            }
                        });
                    }
                }
            }
        }
        
        if (files.length === 0) {
            const allElements = document.querySelectorAll('*');
            const seenFiles = new Set();
            
            allElements.forEach(el => {
                const text = el.textContent || '';
                
                const seMatches = text.matchAll(/([Ss]\d+[Ee]\d+.*?\.(mkv|mp4|avi|m4v|mov|webm))/gi);
                for (const match of seMatches) {
                    if (!seenFiles.has(match[1])) {
                        seenFiles.add(match[1]);
                        files.push(match[1]);
                    }
                }
                
                const absMatches = text.matchAll(/((?:\[[^\]]+\]\s*)?[A-Za-z][A-Za-z0-9&]*[.\s\-]\d{2,3}(?:v\d+)?[\s\-\[(.].*?\.(mkv|mp4|avi|m4v|mov|webm))/gi);
                for (const match of absMatches) {
                    if (!seenFiles.has(match[1])) {
                        seenFiles.add(match[1]);
                        files.push(match[1]);
                    }
                }
            });
        }

        return files;
    }

    function parseEpisodeNumber(filename) {
        const combinedMatch = filename.match(/[Ss](\d+)[Ee](\d+)[-]?[Ee](\d+)/i);
        if (combinedMatch) {
            const season = parseInt(combinedMatch[1], 10);
            const ep1 = parseInt(combinedMatch[2], 10);
            const ep2 = parseInt(combinedMatch[3], 10);
            const episodes = [];
            for (let ep = ep1; ep <= ep2; ep++) {
                episodes.push({ season: season, episode: ep });
            }
            return episodes.length > 0 ? episodes : null;
        }
        
        const match = filename.match(/[Ss](\d+)[Ee](\d+)|(\d+)[xX](\d+)/);
        if (match) {
            return [{
                season: parseInt(match[1] || match[3], 10),
                episode: parseInt(match[2] || match[4], 10)
            }];
        }
        
        const absoluteMatch = filename.match(/[.\s\-](\d{2,4})(?:v\d+)?[\s\-]*[\[(]?(?:\d+p|DVD|BD|WEB|BluRay|FLAC|AAC|Hi10P|Hi10|x264|x265|HEVC)/i);
        if (absoluteMatch) {
            const epNum = parseInt(absoluteMatch[1], 10);
            if (epNum > 0 && epNum < 2000) {
                return [{
                    season: null,
                    episode: epNum,
                    isAbsolute: true
                }];
            }
        }
        
        const simpleAbsoluteMatch = filename.match(/^[A-Za-z][A-Za-z0-9\s]*[.\s\-](\d{2,3})[.\s\-]/);
        if (simpleAbsoluteMatch) {
            const epNum = parseInt(simpleAbsoluteMatch[1], 10);
            if (epNum > 0 && epNum < 1000) {
                return [{
                    season: null,
                    episode: epNum,
                    isAbsolute: true
                }];
            }
        }
        
        return null;
    }

    function extractEpisodeTitleFromFilename(filename) {
        const epMatch = filename.match(/[Ss]\d+[Ee]\d+(?:[-]?[Ee]\d+)?[.\s]+/i);
        if (!epMatch) return null;
        
        const afterEpisode = filename.substring(epMatch.index + epMatch[0].length);
        
        const qualityMarkers = [
            /\.\d+p/i,
            /\.\d+i/i,
            /\.WEB-DL/i,
            /\.WEBRip/i,
            /\.BLURAY/i,
            /\.DVD/i,
            /\.HDTV/i,
            /\.REPACK\d*/i,
            /\.PROPER/i,
            /\.-[A-Z0-9]+/i,
            /\.mkv$/i,
            /\.mp4$/i,
            /\.avi$/i,
            /\.m4v$/i,
            /\.mov$/i,
            /\.webm$/i
        ];
        
        let titleEnd = afterEpisode.length;
        for (const marker of qualityMarkers) {
            const match = afterEpisode.match(marker);
            if (match && match.index !== undefined && match.index < titleEnd) {
                titleEnd = match.index;
            }
        }
        
        let title = afterEpisode.substring(0, titleEnd);
        
        if (title.includes('.-.')) {
            const rawParts = title.split(/\.-\./);
            
            const titleParts = rawParts.map((part) => {
                let cleaned = part.replace(/\./g, ' ').trim();
                cleaned = cleaned.replace(/[-\s.]+$/g, '');
                return cleaned.trim();
            }).filter(part => {
                if (!part || part.length < 3) return false;
                if (/^\d{4}$/.test(part)) return false;
                const startsWithBracketedQuality = /^[\[(]\s*(2160p|1080p|720p|480p|4K|8K|BD|UHD|HDR|SDR|WEB-DL|WEB|NF|AMZN|ATVP|DSNP|HMAX|PCOK|STAN|H\.?265|H\.?264|HEVC|AVC|DDP|Atmos|DTS|AAC|FLAC|Opus)/i;
                if (startsWithBracketedQuality.test(part)) return false;
                const startsWithQuality = /^(\d+p|\d+i|1080p|720p|2160p|480p|360p|4K|8K|WEB-DL|WEBRip|BLURAY|DVD|HDTV|REPACK|PROPER|INTERNAL|LIMITED|EXTENDED|UNRATED|BD|NF|AMZN|ATVP|DSNP|HMAX|HDR|SDR|UHD|H\.?265|H\.?264|HEVC|AVC|DDP|Atmos|DTS|AAC|FLAC|Opus|Dual-Audio|German|Japanese|English|French|Spanish|Italian|Korean|Chinese)/i;
                if (startsWithQuality.test(part)) return false;
                const technicalWords = /(2160p|1080p|720p|480p|4K|8K|BD|UHD|HDR|SDR|WEB-DL|WEB|WEBRip|NF|AMZN|ATVP|DSNP|HMAX|PCOK|H265|H264|HEVC|AVC|x265|x264|DDP|Atmos|DTS|AAC|FLAC|Opus|Dual-Audio|German|Japanese|English|French|Spanish|Italian|Korean|Chinese|HONE|REMUX|BluRay)/gi;
                const strippedPart = part.replace(technicalWords, '').replace(/[\[\]().\-\s]+/g, ' ').trim();
                if (!strippedPart || strippedPart.length < 3) return false;
                const isHashOnly = /^[\s\[\]()]*[A-F0-9]{6,}[\s\[\]()]*$/i;
                if (isHashOnly.test(part)) return false;
                const words = part.split(/\s+/).filter(w => w.length > 0);
                if (words.length === 0) return false;
                const singleQualityTerm = /^(\d+p|\d+i|1080p|720p|2160p|4K|8K|WEB-DL|WEBRip|DL|BluRay|REMUX|UHD|HDR|BD|NF|AMZN|SDR|H265|H264|HEVC|AVC|DDP|Atmos|AAC|Opus)$/i;
                if (words.length === 1 && singleQualityTerm.test(words[0])) return false;
                return true;
            });
            
            return titleParts.length > 0 ? titleParts : null;
        }
        
        title = title.replace(/\./g, ' ').trim();
        title = title.replace(/[-\s.]+$/g, '');
        
        if (!title || title.length < 3) return null;
        if (/^\d{4}$/.test(title)) return null;
        
        const startsWithBracketedQuality = /^[\[(]\s*(2160p|1080p|720p|480p|4K|8K|BD|UHD|HDR|SDR|WEB-DL|WEB|NF|AMZN|ATVP|DSNP|HMAX|PCOK|STAN|H\.?265|H\.?264|HEVC|AVC|DDP|Atmos|DTS|AAC|FLAC|Opus)/i;
        if (startsWithBracketedQuality.test(title)) return null;
        
        const startsWithQuality = /^(\d+p|\d+i|1080p|720p|2160p|480p|360p|4K|8K|WEB-DL|WEBRip|BLURAY|DVD|HDTV|REPACK|PROPER|INTERNAL|LIMITED|EXTENDED|UNRATED|BD|NF|AMZN|ATVP|DSNP|HMAX|HDR|SDR|UHD|H\.?265|H\.?264|HEVC|AVC|DDP|Atmos|DTS|AAC|FLAC|Opus|Dual-Audio|German|Japanese|English|French|Spanish|Italian|Korean|Chinese)/i;
        if (startsWithQuality.test(title)) return null;
        
        const isOnlyTechnicalInfo = /^[\s\[\]()]*(\d+p|BD|NF|WEB-DL|WEB|H\.?265|H\.?264|HEVC|AVC|SDR|HDR|DDP|Atmos|AAC|Opus|Dual-Audio|German|Japanese|English|[A-F0-9]{6,8}|[A-Za-z0-9_-]+|[\s\[\]().\-])+[\s\[\]()]*$/i;
        const containsTitleWord = /[a-zA-Z]{4,}/;
        const technicalWords = /(2160p|1080p|720p|480p|4K|8K|BD|UHD|HDR|SDR|WEB-DL|WEB|WEBRip|NF|AMZN|ATVP|DSNP|HMAX|PCOK|H265|H264|HEVC|AVC|x265|x264|DDP|Atmos|DTS|AAC|FLAC|Opus|Dual-Audio|German|Japanese|English|French|Spanish|Italian|Korean|Chinese|HONE|REMUX|BluRay|MiB|GiB)/gi;
        const strippedTitle = title.replace(technicalWords, '').replace(/[\[\]().\-\s]+/g, ' ').trim();
        if (!strippedTitle || strippedTitle.length < 3) return null;
        
        const isHashOnly = /^[\s\[\]()]*[A-F0-9]{6,}[\s\[\]()]*$/i;
        if (isHashOnly.test(title)) return null;
        
        const words = title.split(/\s+/).filter(w => w.length > 0);
        if (words.length === 0) return null;
        const singleQualityTerm = /^(\d+p|\d+i|1080p|720p|2160p|4K|8K|WEB-DL|WEBRip|DL|BluRay|REMUX|UHD|HDR|BD|NF|AMZN|SDR|H265|H264|HEVC|AVC|DDP|Atmos|AAC|Opus)$/i;
        if (words.length === 1 && singleQualityTerm.test(words[0])) return null;
        
        return title;
    }

    function getEnglishSeriesName(series) {
        if (series.translations?.eng && typeof series.translations.eng === 'string') {
            return series.translations.eng;
        }
        if (series.translations?.en && typeof series.translations.en === 'string') {
            return series.translations.en;
        }
        
        if (series.translations?.eng?.name) return series.translations.eng.name;
        if (series.translations?.en?.name) return series.translations.en.name;
        
        if (series.nameTranslations?.eng) return series.nameTranslations.eng;
        if (series.nameTranslations?.en) return series.nameTranslations.en;
        
        if (series.overviewTranslations?.eng) return series.overviewTranslations.eng;
        
        if (series.aliases && Array.isArray(series.aliases)) {
            const englishAlias = series.aliases.find(a => 
                (a.language === 'eng' || a.language === 'en') && a.name
            );
            if (englishAlias) return englishAlias.name;
            
            const latinAlias = series.aliases.find(a => 
                a.name && /^[A-Za-z0-9\s\-':.,!?()]+$/.test(a.name)
            );
            if (latinAlias) return latinAlias.name;
        }
        
        if (series.extended_title) return series.extended_title;
        if (series.english_name) return series.english_name;
        if (series.englishName) return series.englishName;
        
        return series.name || series.seriesName || series.title;
    }

    function normalizeTitle(title) {
        return title.toLowerCase()
            .replace(/'/g, '')
            .replace(/[^\w\s]/g, '')
            .replace(/\s+/g, ' ')
            .trim();
    }

    function wordsSimilar(word1, word2) {
        if (word1 === word2) return true;
        if (word1.includes(word2) || word2.includes(word1)) return true;
        if (Math.abs(word1.length - word2.length) <= 2) {
            const chars1 = {};
            const chars2 = {};
            for (const c of word1) chars1[c] = (chars1[c] || 0) + 1;
            for (const c of word2) chars2[c] = (chars2[c] || 0) + 1;
            
            let commonChars = 0;
            for (const c in chars1) {
                if (chars2[c]) {
                    commonChars += Math.min(chars1[c], chars2[c]);
                }
            }
            
            const totalChars = Math.max(word1.length, word2.length);
            if (commonChars >= totalChars * 0.85) return true;
            
            let matchCount = 0;
            const minLen = Math.min(word1.length, word2.length);
            for (let i = 0; i < minLen; i++) {
                if (word1[i] === word2[i]) matchCount++;
            }
            if (matchCount >= minLen * 0.75) return true;
        }
        return false;
    }

    function titlesMatch(filenameTitle, tvdbTitle) {
        if (!filenameTitle || !tvdbTitle) return false;
        
        const normalizedFilename = normalizeTitle(filenameTitle);
        const normalizedTVDB = normalizeTitle(tvdbTitle);
        
        if (normalizedFilename === normalizedTVDB) return true;
        
        const tvdbWords = normalizedTVDB.split(/\s+/).filter(w => w.length > 0);
        const filenameWords = normalizedFilename.split(/\s+/).filter(w => w.length > 0);
        
        if (tvdbWords.length > 0 && filenameWords.length > 0) {
            const allWordsMatch = tvdbWords.every(tvdbWord => 
                filenameWords.some(filenameWord => 
                    filenameWord === tvdbWord || 
                    filenameWord.includes(tvdbWord) ||
                    tvdbWord.includes(filenameWord) ||
                    wordsSimilar(filenameWord, tvdbWord)
                )
            );
            
            const allFilenameWordsInTVDB = filenameWords.every(filenameWord =>
                tvdbWords.some(tvdbWord => 
                    tvdbWord === filenameWord || 
                    tvdbWord.includes(filenameWord) ||
                    filenameWord.includes(tvdbWord) ||
                    wordsSimilar(tvdbWord, filenameWord)
                )
            );
            
            if (allWordsMatch) return true;
            if (allFilenameWordsInTVDB && filenameWords.length <= tvdbWords.length + 2) return true;
        }
        
        if (normalizedFilename.includes(normalizedTVDB) || normalizedTVDB.includes(normalizedFilename)) {
            return true;
        }
        
        if (tvdbWords.length > 0 && filenameWords.length > 0) {
            const matchingWords = tvdbWords.filter(tvdbWord => 
                filenameWords.some(filenameWord => 
                    filenameWord === tvdbWord || 
                    filenameWord.startsWith(tvdbWord) || 
                    tvdbWord.startsWith(filenameWord) ||
                    wordsSimilar(filenameWord, tvdbWord)
                )
            ).length;
            
            if (matchingWords >= Math.ceil(tvdbWords.length * 0.8)) {
                return true;
            }
        }
        
        return false;
    }

    function showSeriesSelectionModal(seriesList, callback) {
        const modal = document.createElement('div');
        modal.className = 'tvdb-modal';
        modal.style.display = 'block';
        
        modal.innerHTML = `
            <div class="tvdb-modal-content">
                <span class="tvdb-modal-close">&times;</span>
                <h2>Select Series</h2>
                <p>Multiple series found. Please select the correct one:</p>
                <div id="tvdb-series-list"></div>
            </div>
        `;

        const seriesListDiv = modal.querySelector('#tvdb-series-list');
        seriesList.forEach(series => {
            const option = document.createElement('div');
            option.className = 'tvdb-series-option';
            option.innerHTML = `
                <strong>${getEnglishSeriesName(series)}</strong><br>
                <small>${series.year || 'N/A'} | ID: ${series.tvdb_id}</small>
            `;
            option.onclick = () => {
                modal.remove();
                callback(series);
            };
            seriesListDiv.appendChild(option);
        });

        const closeBtn = modal.querySelector('.tvdb-modal-close');
        closeBtn.onclick = () => modal.remove();

        modal.onclick = (e) => {
            if (e.target === modal) modal.remove();
        };

        document.body.appendChild(modal);
    }

    function compareEpisodes(tvdbEpisodes, fileEpisodes, isAbsoluteMode = false) {
        const results = [];
        
        const tvdbMap = new Map();
        tvdbEpisodes.forEach(ep => {
            let epNumber;
            if (isAbsoluteMode) {
                epNumber = ep.absoluteNumber || 
                           ep.airedEpisodeNumber ||
                           ep.number || 
                           ep.episodeNumber;
            } else {
                epNumber = ep.number || 
                           ep.episodeNumber || 
                           ep.episode || 
                           ep.airedEpisodeNumber || 
                           ep.episode_id ||
                           ep.episodeId ||
                           ep.episodeNumberInSeason ||
                           ep.episodeInSeason;
            }
            
            let epName = ep.nameTranslations?.eng ||
                        ep.nameTranslations?.en ||
                        ep.nameTranslations?.['en-US'] ||
                        ep.nameTranslations?.['en-GB'] ||
                        ep.episodeNameTranslations?.eng ||
                        ep.episodeNameTranslations?.en ||
                        ep.translations?.eng?.name ||
                        ep.translations?.en?.name ||
                        ep.translations?.['en-US']?.name ||
                        ep.translations?.['en-GB']?.name ||
                        ep.name || 
                        ep.episodeName || 
                        ep.title || 
                        ep.episodeTitle;
            
            if (!epName) {
                if (ep.nameTranslations && typeof ep.nameTranslations === 'object') {
                    epName = ep.nameTranslations.eng || 
                            ep.nameTranslations.en || 
                            ep.nameTranslations['en-US'] ||
                            ep.nameTranslations['en-GB'] ||
                            Object.values(ep.nameTranslations)[0];
                }
                if (!epName && ep.translations) {
                    if (Array.isArray(ep.translations)) {
                        const enTranslation = ep.translations.find(t => t.language === 'eng' || t.language === 'en');
                        epName = enTranslation?.name || ep.translations[0]?.name;
                    } else if (typeof ep.translations === 'object') {
                        epName = ep.translations.eng?.name ||
                                ep.translations.en?.name || 
                                ep.translations['en-US']?.name ||
                                ep.translations['en-GB']?.name ||
                                Object.values(ep.translations)[0]?.name;
                    }
                }
            }
            
            if (!epName) epName = '';
            
            if (epNumber) {
                tvdbMap.set(epNumber, {
                    number: epNumber,
                    name: epName || `Episode ${epNumber}`,
                    normalized: normalizeTitle(epName || '')
                });
            }
        });

        const fileMap = new Map();
        fileEpisodes.forEach(filename => {
            const epInfoList = parseEpisodeNumber(filename);
            if (epInfoList && Array.isArray(epInfoList)) {
                const extractedTitles = extractEpisodeTitleFromFilename(filename);
                const titleArray = Array.isArray(extractedTitles) ? extractedTitles : (extractedTitles ? [extractedTitles] : [null]);
                
                epInfoList.forEach((epInfo, index) => {
                    if (!fileMap.has(epInfo.episode)) {
                        fileMap.set(epInfo.episode, []);
                    }
                    let titleForEpisode = null;
                    if (index < titleArray.length) {
                        titleForEpisode = titleArray[index] || null;
                    }
                    if (!titleForEpisode && titleArray.length > 0 && titleArray[0]) {
                        titleForEpisode = titleArray[0];
                    }
                    fileMap.get(epInfo.episode).push({
                        filename: filename,
                        extractedTitle: titleForEpisode,
                        isCombined: epInfoList.length > 1
                    });
                });
            }
        });

        const allEpisodes = new Set([...tvdbMap.keys(), ...fileMap.keys()]);
        
        allEpisodes.forEach(epNum => {
            const tvdbEp = tvdbMap.get(epNum);
            const fileEps = fileMap.get(epNum) || [];
            
            if (tvdbEp && fileEps.length > 0) {
                let titleMatch = false;
                let titleMismatchFiles = [];
                let hasAnyTitle = false;
                let matchedTitle = null;
                
                fileEps.forEach(fileInfo => {
                    const filename = typeof fileInfo === 'string' ? fileInfo : fileInfo.filename;
                    let extractedTitle = typeof fileInfo === 'string' ? null : fileInfo.extractedTitle;
                    
                    if (!extractedTitle) {
                        extractedTitle = extractEpisodeTitleFromFilename(filename);
                    }
                    
                    let titleToMatch = null;
                    if (Array.isArray(extractedTitle)) {
                        for (const title of extractedTitle) {
                            if (title) {
                                if (titlesMatch(title, tvdbEp.name)) {
                                    titleMatch = true;
                                    titleToMatch = title;
                                    matchedTitle = title;
                                    break;
                                }
                            }
                        }
                        if (extractedTitle.length > 0 && extractedTitle.some(t => t !== null)) {
                            hasAnyTitle = true;
                        }
                        if (!titleToMatch && extractedTitle.length > 0) {
                            const nonNullTitles = extractedTitle.filter(t => t !== null);
                            if (nonNullTitles.length > 0) {
                                titleMismatchFiles.push({ 
                                    filename, 
                                    extractedTitle: nonNullTitles.length === 1 ? nonNullTitles[0] : nonNullTitles.join(' / ')
                                });
                            }
                        }
                    } else if (extractedTitle) {
                        titleToMatch = extractedTitle;
                        hasAnyTitle = true;
                        if (titlesMatch(extractedTitle, tvdbEp.name)) {
                            titleMatch = true;
                            matchedTitle = extractedTitle;
                        } else {
                            titleMismatchFiles.push({ 
                                filename, 
                                extractedTitle: extractedTitle
                            });
                        }
                    }
                });
                
                const status = !hasAnyTitle ? 'no_title' : 
                              (titleMatch && titleMismatchFiles.length === 0 ? 'match' : 'title_mismatch');
                
                results.push({
                    episode: epNum,
                    tvdbName: tvdbEp.name,
                    files: fileEps.map(f => typeof f === 'string' ? f : f.filename),
                    status: status,
                    titleMatch: titleMatch,
                    titleMismatches: titleMismatchFiles,
                    hasTitle: hasAnyTitle,
                    matchedTitle: matchedTitle
                });
            } else if (tvdbEp && fileEps.length === 0) {
                results.push({
                    episode: epNum,
                    tvdbName: tvdbEp.name,
                    files: [],
                    status: 'missing'
                });
            } else if (!tvdbEp && fileEps.length > 0) {
                results.push({
                    episode: epNum,
                    tvdbName: null,
                    files: fileEps.map(f => typeof f === 'string' ? f : f.filename),
                    status: 'extra'
                });
            }
        });

        return results.sort((a, b) => a.episode - b.episode);
    }

    function displayCountResults(fileCount, tvdbCount, seriesInfo) {
        const existing = document.getElementById("tvdb-results-display");
        if (existing) existing.remove();

        const display = document.createElement("div");
        display.id = "tvdb-results-display";

        const isComplete = fileCount >= tvdbCount;
        const summaryText = isComplete 
            ? `${fileCount}/${tvdbCount} episodes found (complete)`
            : `${fileCount}/${tvdbCount} episodes found`;

        const bodyContent = `
            <div class="data-item">
                <strong>Series:</strong> ${seriesInfo.seriesName} | Season: ${seriesInfo.seasonNumber}
            </div>
            <div class="data-item">
                <strong>Summary:</strong> ${summaryText}
            </div>
            <div class="data-item">
                <small>Using count comparison</small>
            </div>
        `;

        display.innerHTML = `
            <div class="header">
                <b>TVDB Episode Matcher</b>
                <button id="tvdb-close-results">×</button>
            </div>
            <div class="body">
                ${bodyContent}
            </div>
        `;

        document.body.appendChild(display);

        document.getElementById("tvdb-close-results").addEventListener("click", () => {
            display.remove();
        });

        setTimeout(() => {
            if (display.parentNode) {
                display.remove();
            }
        }, 120000);
    }

    function displayResults(results, seriesInfo, isAbsoluteMode = false) {
        const existing = document.getElementById("tvdb-results-display");
        if (existing) existing.remove();

        const display = document.createElement("div");
        display.id = "tvdb-results-display";

        const matchCount = results.filter(r => r.status === 'match').length;
        const titleMismatchCount = results.filter(r => r.status === 'title_mismatch').length;
        const noTitleCount = results.filter(r => r.status === 'no_title').length;
        const missingCount = results.filter(r => r.status === 'missing').length;
        const extraCount = results.filter(r => r.status === 'extra').length;
        
        const totalFound = matchCount + titleMismatchCount + noTitleCount;
        const totalExpected = matchCount + titleMismatchCount + noTitleCount + missingCount;
        const allNoTitles = noTitleCount > 0 && titleMismatchCount === 0 && matchCount === 0;
        
        const allMatched = matchCount > 0 && titleMismatchCount === 0 && noTitleCount === 0 && missingCount === 0 && extraCount === 0;
        let inOrder = false;
        if (allMatched) {
            const matchedEpisodes = results.filter(r => r.status === 'match').map(r => r.episode).sort((a, b) => a - b);
            const firstEp = matchedEpisodes[0];
            inOrder = matchedEpisodes.length > 0 && matchedEpisodes.every((ep, index) => ep === firstEp + index);
        }
        
        let summaryText;
        if (allMatched && inOrder) {
            summaryText = `${matchCount}/${matchCount} episodes in the right order`;
        } else if (allNoTitles && totalFound > 0) {
            summaryText = `No titles found but ${totalFound}/${totalExpected} episodes found`;
        } else {
            summaryText = `${matchCount} matched`;
            if (titleMismatchCount > 0) {
                summaryText += `, ${titleMismatchCount} title mismatch`;
            }
            if (noTitleCount > 0) {
                summaryText += `, ${noTitleCount} no title`;
            }
            summaryText += `, ${missingCount} missing, ${extraCount} extra episodes`;
        }

        const orderingInfo = isAbsoluteMode ? 'Absolute' : `Season: ${seriesInfo.seasonNumber}`;
        let bodyContent = `
            <div class="data-item">
                <strong>Series:</strong> ${seriesInfo.seriesName} | ${orderingInfo}
            </div>
            <div class="data-item">
                <strong>Summary:</strong> ${summaryText}
            </div>
        `;

        if (!(allMatched && inOrder) && !(allNoTitles && totalFound > 0)) {
            bodyContent += '<div class="tvdb-results">';
            results.forEach(result => {
                let content = `<div class="tvdb-episode-${result.status}">`;
                content += `<strong>Episode ${result.episode}:</strong> `;
                if (result.tvdbName) {
                    content += `"${result.tvdbName}" `;
                }
                
                if (result.status === 'match') {
                    const fileNames = result.files.map(f => {
                        const filename = typeof f === 'string' ? f : f.filename || f;
                        return filename.split('/').pop();
                    }).join(', ');
                    content += `✓ Found in files: ${fileNames}`;
                    
                    if (result.matchedTitle) {
                        content += `<div class="tvdb-title-info">✓ Title matches: "${result.matchedTitle}"</div>`;
                    } else {
                        const extractedTitle = result.files.length > 0 ? 
                            extractEpisodeTitleFromFilename(result.files[0]) : null;
                        if (extractedTitle) {
                            const titleDisplay = Array.isArray(extractedTitle) ? extractedTitle.join(', ') : extractedTitle;
                            content += `<div class="tvdb-title-info">✓ Title matches: "${titleDisplay}"</div>`;
                        }
                    }
                } else if (result.status === 'no_title') {
                    const fileNames = result.files.map(f => {
                        const filename = typeof f === 'string' ? f : f.filename || f;
                        return filename.split('/').pop();
                    }).join(', ');
                    content += `✓ Found in files (no title): ${fileNames}`;
                } else if (result.status === 'title_mismatch') {
                    const fileNames = result.files.map(f => {
                        const filename = typeof f === 'string' ? f : f.filename || f;
                        return filename.split('/').pop();
                    }).join(', ');
                    content += `⚠ Found in files but title mismatch: ${fileNames}`;
                    
                    if (result.titleMismatches && result.titleMismatches.length > 0) {
                        result.titleMismatches.forEach(mismatch => {
                            content += `<div class="tvdb-title-info">⚠ Filename title: "${mismatch.extractedTitle}" (expected: "${result.tvdbName}")</div>`;
                        });
                    } else {
                        const extractedTitle = result.files.length > 0 ? 
                            extractEpisodeTitleFromFilename(result.files[0]) : null;
                        if (extractedTitle) {
                            content += `<div class="tvdb-title-info">⚠ Filename title: "${extractedTitle}" (expected: "${result.tvdbName}")</div>`;
                        }
                    }
                } else if (result.status === 'missing') {
                    content += `✗ Not found in files`;
                } else if (result.status === 'extra') {
                    const fileNames = result.files.map(f => {
                        const filename = typeof f === 'string' ? f : f.filename || f;
                        return filename.split('/').pop();
                    }).join(', ');
                    content += `⚠ Extra file(s): ${fileNames}`;
                }
                content += `</div>`;
                bodyContent += content;
            });
            bodyContent += '</div>';
        }

        display.innerHTML = `
            <div class="header">
                <b>TVDB Episode Matcher</b>
                <button id="tvdb-close-results">×</button>
            </div>
            <div class="body">
                ${bodyContent}
            </div>
        `;

        document.body.appendChild(display);

        document.getElementById("tvdb-close-results").addEventListener("click", () => {
            display.remove();
        });

        setTimeout(() => {
            if (display.parentNode) {
                display.remove();
            }
        }, 120000);
    }

    async function processEpisodes() {
        const apiKey = getAPIKey();
        if (!apiKey) {
            alert("TheTVDB API key is not configured. Please configure it in settings.");
            showSettingsModal();
            return;
        }

        const seriesInfo = extractSeriesInfo();
        if (!seriesInfo) {
            alert("Could not extract series information from page");
            return;
        }

        try {
            const token = await getTVDBToken();

            let seriesList = await searchTVDBSeries(seriesInfo.seriesName, token);

            if (seriesList.length === 0) {
                alert("No series found on TheTVDB");
                return;
            }

            let selectedSeries = null;
            
            const exactMatch = seriesList.find(s => 
                normalizeTitle(getEnglishSeriesName(s)) === normalizeTitle(seriesInfo.seriesName)
            );

            if (exactMatch && seriesList.length === 1) {
                selectedSeries = exactMatch;
            } else if (exactMatch) {
                selectedSeries = exactMatch;
            } else if (seriesList.length === 1) {
                selectedSeries = seriesList[0];
            } else {
                await new Promise((resolve) => {
                    showSeriesSelectionModal(seriesList, (series) => {
                        selectedSeries = series;
                        resolve();
                    });
                });
            }

            if (!selectedSeries) {
                return;
            }

            const fileEpisodes = extractEpisodeFiles();
            
            if (fileEpisodes.length === 0) {
                alert("No episode files found on page. Please open the Files dialog first.");
                return;
            }
            
            const firstParsed = parseEpisodeNumber(fileEpisodes[0]);
            const isAbsoluteMode = firstParsed && firstParsed[0]?.isAbsolute;
            
            const seasonData = await getTVDBSeasonEpisodes(selectedSeries.tvdb_id, seriesInfo.seasonNumber, token);
            let tvdbEpisodes = seasonData.episodes || [];
            
            tvdbEpisodes = tvdbEpisodes.filter(ep => {
                const epSeason = ep.seasonNumber || ep.season || ep.season_id || ep.seasonId;
                return epSeason === seriesInfo.seasonNumber;
            });
            
            if (tvdbEpisodes.length === 0) {
                alert(`No episodes found for Season ${seriesInfo.seasonNumber}`);
                return;
            }

            if (isAbsoluteMode) {
                const fileCount = fileEpisodes.length;
                const tvdbCount = tvdbEpisodes.length;
                displayCountResults(fileCount, tvdbCount, seriesInfo);
            } else {
                const comparisonResults = compareEpisodes(tvdbEpisodes, fileEpisodes);
                displayResults(comparisonResults, seriesInfo);
            }

        } catch (error) {
            let errorMessage = error.message;
            if (errorMessage.includes("API key is required") || errorMessage.includes("Failed to get token")) {
                errorMessage += ". Please configure your API key in settings.";
                alert(errorMessage);
                showSettingsModal();
            } else {
                alert(`Error: ${errorMessage}`);
            }
        }
    }

    function createStyledButton(id, text, title, clickHandler) {
        var btn = document.createElement('button');
        btn.id = id;
        btn.className = 'form__button form__button--text';
        btn.textContent = text;
        if (title) btn.title = title;
        btn.style.cssText = 'background:#2e3445;border:none;color:#fff;padding:5px 10px;border-radius:4px;cursor:pointer;font-size:12px';
        
        btn.addEventListener('click', function(e) {
            e.stopImmediatePropagation();
            e.preventDefault();
            clickHandler();
        });
        
        btn.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#2d6cd3';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '#2e3445';
        });
        
        return btn;
    }

    function addMatchButton() {
        if (document.getElementById('tvdb-match-button')) return;

        var headings = document.querySelectorAll('h2.panel__heading');
        var autoModHeading = null;
        var moderationHeading = null;
        
        for (var i = 0; i < headings.length; i++) {
            var text = headings[i].textContent;
            if (text.indexOf('Auto Moderation') !== -1) {
                autoModHeading = headings[i];
            } else if (text.indexOf('Moderation') !== -1) {
                moderationHeading = headings[i];
            }
        }

        var targetHeading = autoModHeading || moderationHeading;
        if (!targetHeading) {
            setTimeout(addMatchButton, 1000);
            return;
        }

        var panelContainer = targetHeading.closest('div.panelV2') || targetHeading.closest('section.panelV2');
        if (!panelContainer) {
            setTimeout(addMatchButton, 1000);
            return;
        }

        var buttonsContainer = document.createElement('div');
        buttonsContainer.style.cssText = 'display:flex;align-items:center;justify-content:flex-end;gap:8px;margin-left:auto';
        buttonsContainer.addEventListener('click', function(e) {
            e.stopImmediatePropagation();
        });

        var matchButton = createStyledButton('tvdb-match-button', 'Match Episodes with TVDB', null, processEpisodes);
        var settingsButton = createStyledButton('tvdb-settings-button', '⚙', 'Configure TheTVDB API key', showSettingsModal);

        buttonsContainer.appendChild(matchButton);
        buttonsContainer.appendChild(settingsButton);

        targetHeading.style.cssText = 'display:flex;align-items:center;justify-content:space-between;width:100%;cursor:pointer';
        targetHeading.appendChild(buttonsContainer);
    }

    window.showTVDBSettings = showSettingsModal;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addMatchButton);
    } else {
        addMatchButton();
    }

    const observer = new MutationObserver(() => {
        if (!document.getElementById('tvdb-match-button') || !document.getElementById('tvdb-settings-button')) {
            addMatchButton();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    GM_addStyle(`
        .tvdb-matcher-container {
            margin: 8px 0;
            padding: 10px 14px;
            background-color: #1e2332 !important;
            color: #fff !important;
            border-radius: 8px;
            font-size: 13px;
            z-index: 999999 !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
            min-width: 250px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
        }

        .tvdb-matcher-container,
        .tvdb-matcher-container div,
        .tvdb-matcher-container span,
        .tvdb-matcher-container p,
        .tvdb-matcher-container a,
        .tvdb-matcher-container label {
            color: #fff !important;
        }

        .tvdb-matcher-container * {
            box-sizing: border-box !important;
        }

        .tvdb-matcher-title {
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 6px;
            color: #fff !important;
        }

        .tvdb-matcher-button {
            display: block !important;
            width: 100% !important;
            margin-top: 6px !important;
            padding: 6px !important;
            border: none !important;
            border-radius: 4px !important;
            background: #2e3445 !important;
            background-color: #2e3445 !important;
            color: white !important;
            font-size: 13px !important;
            cursor: pointer !important;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
        }

        .tvdb-matcher-button:hover:not(:disabled) {
            background: #2d6cd3 !important;
            background-color: #2d6cd3 !important;
        }

        .tvdb-matcher-button:disabled {
            background: #181C25 !important;
            background-color: #181C25 !important;
            cursor: not-allowed !important;
        }

        .tvdb-series-select {
            margin: 6px 0;
            padding: 6px;
            width: 100%;
            max-width: 500px;
            background: #2e3445;
            color: #fff;
            border: 1px solid #3e4455;
            border-radius: 4px;
        }

        .tvdb-results {
            margin-top: 8px;
            padding: 8px;
            background: #0d1117;
            border-radius: 4px;
            font-size: 12px;
        }

        #tvdb-results-display {
            position: fixed;
            top: 20px;
            left: 20px;
            background: #1e2332;
            color: #fff;
            padding: 0;
            border-radius: 8px;
            font-size: 13px;
            z-index: 999998;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
            min-width: 300px;
            max-width: 400px;
            max-height: 80vh;
            overflow-y: auto;
        }

        #tvdb-results-display .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 14px;
            border-bottom: 1px solid #2e3445;
            background: #2e3445;
        }

        #tvdb-results-display .header b {
            font-size: 14px;
        }

        #tvdb-results-display .header button {
            background: none;
            border: none;
            color: #fff;
            font-size: 24px;
            cursor: pointer;
            padding: 0;
            width: 28px;
            height: 28px;
            line-height: 24px;
            border-radius: 4px;
        }

        #tvdb-results-display .header button:hover {
            background: #3e4455;
        }

        #tvdb-results-display .body {
            padding: 12px 14px;
        }

        #tvdb-results-display .data-item {
            margin-bottom: 8px;
        }

        #tvdb-results-display .data-item:last-child {
            margin-bottom: 0;
        }

        #tvdb-results-display .data-item strong {
            display: block;
            margin-bottom: 4px;
            color: #a0a0a0;
            font-size: 11px;
            text-transform: uppercase;
        }

        #tvdb-results-display .tvdb-results {
            margin-top: 0;
            padding: 0;
            background: transparent;
        }

        #tvdb-results-display code {
            background: #0d1117;
            color: #e0e0e0;
            padding: 2px 5px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            font-size: 11px;
            word-break: break-all;
            display: inline-block;
            max-width: 100%;
            line-height: 1.4;
        }

        #tvdb-results-display pre {
            background: #0d1117;
            color: #e0e0e0;
            padding: 5px 8px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            font-size: 11px;
            margin: 0;
            white-space: pre-wrap;
            word-wrap: break-word;
            line-height: 1.5;
            max-width: 100%;
        }

        .tvdb-episode-match {
            color: #4caf50;
            margin: 3px 0;
            font-size: 12px;
        }

        .tvdb-episode-mismatch {
            color: #f44336;
            margin: 3px 0;
            font-size: 12px;
        }

        .tvdb-episode-missing {
            color: #ff9800;
            margin: 3px 0;
            font-size: 12px;
        }

        .tvdb-episode-title-match {
            color: #4caf50;
            margin: 3px 0;
            font-size: 12px;
        }

        .tvdb-episode-title-mismatch {
            color: #ff9800;
            margin: 3px 0;
            font-size: 12px;
        }

        .tvdb-episode-no_title {
            color: #4caf50;
            margin: 3px 0;
            font-size: 12px;
        }

        .tvdb-episode-extra {
            color: #ff9800;
            margin: 3px 0;
            font-size: 12px;
        }

        .tvdb-title-info {
            font-size: 11px;
            margin-left: 12px;
            color: #a0a0a0;
        }

        .tvdb-api-key-input {
            padding: 6px;
            margin: 5px 0;
            width: 100%;
            background: #2e3445;
            color: #fff;
            border: 1px solid #3e4455;
            border-radius: 4px;
            box-sizing: border-box;
        }

        .tvdb-modal {
            display: none;
            position: fixed;
            z-index: 1000000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
        }

        .tvdb-modal-content {
            background-color: #1e2332;
            color: #fff;
            margin: 15% auto;
            padding: 20px;
            border: 1px solid #2e3445;
            border-radius: 8px;
            width: 80%;
            max-width: 600px;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
        }

        .tvdb-modal-content * {
            color: #fff !important;
        }

        .tvdb-modal-close {
            color: #aaa;
            float: right;
            font-size: 28px;
            font-weight: bold;
            cursor: pointer;
            line-height: 20px;
        }

        .tvdb-modal-close:hover,
        .tvdb-modal-close:focus {
            color: #fff;
        }

        .tvdb-series-option {
            padding: 8px;
            margin: 4px 0;
            background: #2e3445;
            border: 1px solid #3e4455;
            border-radius: 4px;
            cursor: pointer;
            color: #fff;
        }

        .tvdb-series-option:hover {
            background: #3e4455;
        }

        .tvdb-settings-button {
            display: block !important;
            width: 100% !important;
            margin-top: 6px !important;
            padding: 6px !important;
            border: none !important;
            border-radius: 4px !important;
            background: #2e3445 !important;
            background-color: #2e3445 !important;
            color: white !important;
            font-size: 13px !important;
            cursor: pointer !important;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
        }

        .tvdb-settings-button:hover {
            background: #2d6cd3 !important;
            background-color: #2d6cd3 !important;
        }

        .tvdb-settings-modal {
            display: none;
            position: fixed;
            z-index: 1000001;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
        }

        .tvdb-settings-modal-content {
            background-color: #1e2332;
            color: #fff;
            margin: 10% auto;
            padding: 20px;
            border: 1px solid #2e3445;
            border-radius: 8px;
            width: 90%;
            max-width: 500px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
        }

        .tvdb-settings-modal-content * {
            color: #fff !important;
        }

        .tvdb-settings-form-group {
            margin: 12px 0;
        }

        .tvdb-settings-label {
            display: block;
            margin-bottom: 4px;
            font-weight: bold;
            color: #fff;
            font-size: 13px;
        }

        .tvdb-settings-input {
            width: 100%;
            padding: 6px;
            background: #2e3445;
            color: #fff;
            border: 1px solid #3e4455;
            border-radius: 4px;
            box-sizing: border-box;
        }

        .tvdb-settings-help {
            font-size: 12px;
            color: #a0a0a0;
            margin-top: 4px;
        }

        .tvdb-settings-help a {
            color: #2d6cd3 !important;
        }

        .tvdb-settings-buttons {
            margin-top: 16px;
            text-align: right;
        }

        .tvdb-settings-status {
            margin-top: 8px;
            padding: 6px;
            border-radius: 4px;
            display: none;
            font-size: 12px;
        }

        .tvdb-settings-status.success {
            background: rgba(76, 175, 80, 0.2);
            color: #4caf50;
            border: 1px solid #4caf50;
        }

        .tvdb-settings-status.error {
            background: rgba(244, 67, 54, 0.2);
            color: #f44336;
            border: 1px solid #f44336;
        }

        #tvdb-match-button,
        #tvdb-settings-button {
            background: #2e3445 !important;
            background-color: #2e3445 !important;
            color: white !important;
            border: none !important;
        }

        #tvdb-match-button:hover,
        #tvdb-settings-button:hover {
            background: #2d6cd3 !important;
            background-color: #2d6cd3 !important;
        }

        .tvdb-comparison-boxes {
            display: flex;
            gap: 5px;
            margin-top: 5px;
        }

        .tvdb-comparison-box {
            flex: 1;
            padding: 4px 5px;
            border-radius: 4px;
            text-align: center;
            border: 1px solid;
            transition: all 0.3s;
        }

        .tvdb-comparison-box.match {
            background: rgba(76, 175, 80, 0.2);
            border-color: #4caf50;
        }

        .tvdb-comparison-box.no-match {
            background: rgba(244, 67, 54, 0.2);
            border-color: #f44336;
        }

        .tvdb-comparison-label {
            font-size: 11px;
            text-transform: uppercase;
            color: #a0a0a0;
            margin-bottom: 2px;
            font-weight: bold;
        }

        .tvdb-comparison-status {
            font-size: 13px;
            font-weight: bold;
        }

        .tvdb-comparison-box.match .tvdb-comparison-status {
            color: #4caf50;
        }

        .tvdb-comparison-box.no-match .tvdb-comparison-status {
            color: #f44336;
        }
    `);

})();
