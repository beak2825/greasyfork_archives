// ==UserScript==
// @name        Disney+ UHD
// @namespace   @SomeDevStuff
// @version     1.0
// @description A script to force Disney+ to display the 2160p video track and Atmos audio.
// @author      SomeDev
// @match       https://www.disneyplus.com/*
// @run-at      document-start
// @grant       none
// @license MIT2
// @downloadURL https://update.greasyfork.org/scripts/564143/Disney%2B%20UHD.user.js
// @updateURL https://update.greasyfork.org/scripts/564143/Disney%2B%20UHD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        maxResolution: '4k',
        allowUpscale: false,
        headroomPercent: 10,
        forceMaxBitrate: false,

        // Swap eac-3 URIs with Atmos URIs
        swapToAtmos: true,

        // Convert Audio Description to regular language track
        adAsLanguage: true,

        // Disable HDR formats (force SDR/HEVC)
        disableHDR10: false,
        disableDolbyVision: true,

        debug: true
    };

    console.log('Disney+ UHD enabled');

    // ============================================
    // Screen Detection (Improved)
    // ============================================

    const screenInfo = {
        physicalWidth: 0,
        physicalHeight: 0,
        maxStreamWidth: 3840,
        tier: '4K UHD',
        detected: false
    };

    // Standard video resolutions for matching
    const RESOLUTION_TIERS = [
        { name: '4K UHD',   streamWidth: 3840, standards: [
            { w: 3840, h: 2160 }, // 16:9 4K
            { w: 4096, h: 2160 }, // DCI 4K
            { w: 3840, h: 1600 }, // 21:9 4K ultrawide
            { w: 3840, h: 2400 }, // 16:10 4K
        ]},
        { name: '1440p QHD', streamWidth: 2560, standards: [
            { w: 2560, h: 1440 }, // 16:9 1440p
            { w: 3440, h: 1440 }, // 21:9 ultrawide
            { w: 2560, h: 1600 }, // 16:10
            { w: 2560, h: 1080 }, // 21:9 (use width)
        ]},
        { name: '1080p FHD', streamWidth: 1920, standards: [
            { w: 1920, h: 1080 }, // 16:9 1080p
            { w: 1920, h: 1200 }, // 16:10
            { w: 2560, h: 1080 }, // 21:9 ultrawide (height-based would be wrong)
            { w: 2048, h: 1080 }, // 2K DCI
        ]},
        { name: '720p HD',  streamWidth: 1280, standards: [
            { w: 1280, h: 720 },  // 16:9 720p
            { w: 1280, h: 800 },  // 16:10
            { w: 1366, h: 768 },  // common laptop
            { w: 1440, h: 900 },  // 16:10
        ]},
        { name: '480p SD',  streamWidth: 854, standards: [
            { w: 854, h: 480 },   // 16:9 480p
            { w: 800, h: 600 },   // 4:3
            { w: 1024, h: 768 },  // 4:3
        ]}
    ];

    function detectScreen() {
        if (screenInfo.detected && CONFIG.maxResolution !== 'auto') return;

        const ratio = window.devicePixelRatio || 1;
        screenInfo.physicalWidth = Math.round(window.screen.width * ratio);
        screenInfo.physicalHeight = Math.round(window.screen.height * ratio);

        const w = screenInfo.physicalWidth;
        const h = screenInfo.physicalHeight;
        const aspectRatio = w / h;

        if (CONFIG.maxResolution === 'auto') {
            const headroom = 1 + (CONFIG.headroomPercent / 100);

            // Determine which dimension to use based on aspect ratio
            // For ultrawide (21:9 = 2.33+), use HEIGHT as the limiting factor
            // For standard/tall screens, use WIDTH
            let referenceDimension;
            let dimensionType;

            if (aspectRatio >= 2.0) {
                // Ultrawide: height is the limiting factor
                // Scale height to equivalent 16:9 width
                referenceDimension = h * (16/9);
                dimensionType = 'height-based (ultrawide)';
            } else if (aspectRatio <= 1.4) {
                // Tall/portrait or 4:3: width is limiting
                referenceDimension = w;
                dimensionType = 'width-based (tall/4:3)';
            } else {
                // Standard 16:9 to 16:10 range: use width directly
                referenceDimension = w;
                dimensionType = 'width-based (standard)';
            }

            console.log(`[Screen] 📐 ${w}x${h} (${aspectRatio.toFixed(2)}) → ${dimensionType}: ${Math.round(referenceDimension)}px`);

            // Match to resolution tier
            if (referenceDimension >= 2880 / headroom) {
                screenInfo.maxStreamWidth = 3840;
                screenInfo.tier = '4K UHD';
            } else if (referenceDimension >= 1920 / headroom) {
                screenInfo.maxStreamWidth = 2560;
                screenInfo.tier = '1440p QHD';
            } else if (referenceDimension >= 1440 / headroom) {
                screenInfo.maxStreamWidth = 1920;
                screenInfo.tier = '1080p FHD';
            } else if (referenceDimension >= 960 / headroom) {
                screenInfo.maxStreamWidth = 1280;
                screenInfo.tier = '720p HD';
            } else {
                screenInfo.maxStreamWidth = 854;
                screenInfo.tier = '480p SD';
            }

            // Special case handling for common resolutions
            // 1920x1200 should be 1080p class (using width)
            if (w === 1920 && h >= 1080 && h <= 1200) {
                screenInfo.maxStreamWidth = 1920;
                screenInfo.tier = '1080p FHD';
            }
            // 2560x1080 ultrawide should be 1080p class (using height)
            else if (w === 2560 && h === 1080) {
                screenInfo.maxStreamWidth = 1920;
                screenInfo.tier = '1080p FHD';
            }
            // 3440x1440 ultrawide should be 1440p class
            else if (w === 3440 && h === 1440) {
                screenInfo.maxStreamWidth = 2560;
                screenInfo.tier = '1440p QHD';
            }
            // 3840x1600 ultrawide should be 4K class
            else if (w === 3840 && h >= 1600) {
                screenInfo.maxStreamWidth = 3840;
                screenInfo.tier = '4K UHD';
            }

            if (CONFIG.allowUpscale && screenInfo.maxStreamWidth < 3840) {
                screenInfo.maxStreamWidth = Math.min(3840, screenInfo.maxStreamWidth * 2);
                screenInfo.tier += ' (upscale)';
            }
        } else {
            const overrides = {
                '4k': 3840, '1440p': 2560, '1080p': 1920, '720p': 1280, '480p': 854
            };
            screenInfo.maxStreamWidth = overrides[CONFIG.maxResolution.toLowerCase()] || 1920;
            screenInfo.tier = CONFIG.maxResolution + ' (forced)';
        }

        screenInfo.detected = true;
        console.log('[Screen] 🖥️', screenInfo.tier, `(${screenInfo.physicalWidth}x${screenInfo.physicalHeight}) → Stream: ${screenInfo.maxStreamWidth}p`);
    }

    detectScreen();

    // ============================================
    // Capability Detection
    // ============================================

    const capabilities = {
        dolbyVision: false,
        hdr10: false,
        hevc: false,
        eac3: false,
        detected: false
    };

    function detectCapabilities() {
        if (capabilities.detected) return;
        if (typeof MediaSource === 'undefined') return;

        capabilities.dolbyVision = ['dvh1.05.06', 'dvh1.05.03', 'dvh1.08.06'].some(c =>
            MediaSource.isTypeSupported(`video/mp4; codecs="${c}"`));
        capabilities.hdr10 = MediaSource.isTypeSupported('video/mp4; codecs="hvc1.2.4.L150.90"');
        capabilities.hevc = MediaSource.isTypeSupported('video/mp4; codecs="hvc1.2.4.L120.90"') ||
                           capabilities.hdr10 || capabilities.dolbyVision;
        capabilities.eac3 = MediaSource.isTypeSupported('audio/mp4; codecs="ec-3"');

        capabilities.detected = true;
        console.log('[Capabilities] 🔍 DV:', capabilities.dolbyVision, '| HDR10:', capabilities.hdr10,
                    '| HEVC:', capabilities.hevc, '| EC-3:', capabilities.eac3);
    }

    detectCapabilities();

    // ============================================
    // DRM - PlayReady Hardware
    // ============================================

    const originalRMKSA = navigator.requestMediaKeySystemAccess.bind(navigator);

    navigator.requestMediaKeySystemAccess = async function(keySystem, configs) {
        if (!keySystem.includes('playready')) {
            return originalRMKSA(keySystem, configs);
        }

        const videoCodecs = [];
        if (capabilities.dolbyVision && !CONFIG.disableDolbyVision) {
            videoCodecs.push('dvh1.05.06', 'dvh1.05.03');
        }
        if (capabilities.hdr10 && !CONFIG.disableHDR10) {
            videoCodecs.push('hvc1.2.4.L150.90');
        }
        if (capabilities.hevc) {
            videoCodecs.push('hvc1.2.4.L120.90');
        }
        videoCodecs.push('avc1.640028');

        const enhancedConfigs = configs.map(config => ({
            ...config,
            videoCapabilities: videoCodecs.map(c => ({
                contentType: `video/mp4; codecs="${c}"`,
                robustness: "3000"
            })),
            audioCapabilities: [
                { contentType: 'audio/mp4; codecs="ec-3"', robustness: "3000" },
                { contentType: 'audio/mp4; codecs="mp4a.40.2"', robustness: "3000" }
            ]
        }));

        for (const ks of ['com.microsoft.playready.hardware', 'com.microsoft.playready.recommendation', 'com.microsoft.playready']) {
            try {
                const access = await originalRMKSA(ks, enhancedConfigs);
                console.log('[DRM] ✅', ks);
                return access;
            } catch (e) {}
        }

        return originalRMKSA(keySystem, configs);
    };

    // ============================================
    // Network Interception - Fetch
    // ============================================

    const originalFetch = window.fetch;
    window.fetch = async function(input, init) {
        let url = typeof input === 'string' ? input : input.url;

        // CTR-Regular → CTR-High upgrade
        if (url?.includes('ctr-regular')) {
            url = url.replace('ctr-regular', 'ctr-high');
            console.log('[Fetch] 📡 CTR-High upgrade');
            input = typeof input === 'string' ? url : new Request(url, input);
        }

        // Manifest interception
        if (url?.includes('ctr-all-') && url.includes('.m3u8')) {
            if (url.includes('?')) {
                url = url.split('?')[0];
                input = typeof input === 'string' ? url : new Request(url, input);
            }

            const response = await originalFetch.call(window, input, init);
            const text = await response.text();
            const filtered = filterManifest(text);

            return new Response(filtered, {
                status: response.status,
                statusText: response.statusText,
                headers: response.headers
            });
        }

        return originalFetch.call(window, input, init);
    };

    // ============================================
    // Network Interception - XHR
    // ============================================

    const originalXHROpen = XMLHttpRequest.prototype.open;
    const originalXHRSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function(method, url, ...args) {
        this._url = url;

        if (url?.includes('ctr-regular')) {
            url = url.replace('ctr-regular', 'ctr-high');
            console.log('[XHR] 📡 CTR-High upgrade');
            arguments[1] = url;
        }

        if (url?.includes('ctr-all-') && url.includes('.m3u8') && url.includes('?')) {
            arguments[1] = url.split('?')[0];
            this._filterM3u8 = true;
        }

        return originalXHROpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function(data) {
        if (this._filterM3u8) {
            this.addEventListener('load', function() {
                if (this.responseText) {
                    const filtered = filterManifest(this.responseText);
                    Object.defineProperty(this, 'responseText', { value: filtered });
                    Object.defineProperty(this, 'response', { value: filtered });
                }
            });
        }

        if (data && typeof data === 'string' && data.includes('1280x720')) {
            const maxRes = screenInfo.maxStreamWidth >= 3840 ? '3840x2160' :
                          screenInfo.maxStreamWidth >= 2560 ? '2560x1440' :
                          screenInfo.maxStreamWidth >= 1920 ? '1920x1080' : '1280x720';
            data = data.replace(/1280x720/g, maxRes);
            console.log('[XHR] 📐 Resolution:', maxRes);
        }

        return originalXHRSend.call(this, data);
    };

    // ============================================
    // Simple Atmos Swap
    // ============================================

    function swapAtmosURIs(lines) {
        const atmosURIs = {};

        for (const line of lines) {
            if (line.includes('TYPE=AUDIO') && line.includes('GROUP-ID="atmos"')) {
                const lang = line.match(/LANGUAGE="([^"]+)"/)?.[1];
                const uri = line.match(/URI="([^"]+)"/)?.[1];
                const channels = line.match(/CHANNELS="([^"]+)"/)?.[1] || '';

                if (lang && uri && (channels.includes('JOC') || uri.includes('1000k'))) {
                    atmosURIs[lang] = uri;
                }
            }
        }

        if (Object.keys(atmosURIs).length === 0) {
            console.log('[Swap] ⚠️ No Atmos tracks found');
            return lines;
        }

        console.log('[Swap] 🎭 Atmos URIs found:', Object.keys(atmosURIs).join(', '));

        let swapped = 0;
        const newLines = lines.map(line => {
            if (line.includes('TYPE=AUDIO') && line.includes('GROUP-ID="eac-3"')) {
                const lang = line.match(/LANGUAGE="([^"]+)"/)?.[1];
                const currentUri = line.match(/URI="([^"]+)"/)?.[1];

                // Skip AD tracks
                if (line.includes('describes-video') || line.includes('[Audio Description]')) {
                    return line;
                }

                if (lang && atmosURIs[lang] && currentUri) {
                    const newLine = line.replace(`URI="${currentUri}"`, `URI="${atmosURIs[lang]}"`);
                    swapped++;
                    console.log(`[Swap]   🔄 ${lang}: 256k → 1000k (Atmos)`);
                    return newLine;
                }
            }
            return line;
        });

        console.log(`[Swap] ✅ Swapped ${swapped} tracks to Atmos`);
        return newLines;
    }

    // ============================================
    // Convert Audio Description to Language
    // ============================================

    function convertADtoLanguage(lines) {
        let converted = 0;

        const newLines = lines.map(line => {
            if (!line.includes('TYPE=AUDIO')) return line;

            const isAD = line.includes('public.accessibility.describes-video') ||
                        line.includes('describes-video') ||
                        line.match(/NAME="[^"]*\[Audio Description\][^"]*"/i);

            if (!isAD) return line;

            let modified = line;

            const langMatch = modified.match(/LANGUAGE="([^"]+)"/);
            if (langMatch) {
                const baseLang = langMatch[1];
                modified = modified.replace(`LANGUAGE="${baseLang}"`, `LANGUAGE="${baseLang}-ad"`);
            }

            modified = modified.replace(/,?CHARACTERISTICS="[^"]*describes-video[^"]*"/g, '');
            modified = modified.replace(/,?CHARACTERISTICS="public\.accessibility\.[^"]*"/g, '');
            modified = modified.replace(/,,+/g, ',');
            modified = modified.replace(/,\s*,/g, ',');

            const newLang = modified.match(/LANGUAGE="([^"]+)"/)?.[1];
            const newName = modified.match(/NAME="([^"]+)"/)?.[1];

            converted++;
            console.log(`[AD] 👁️→🗣️ ${newLang}: "${newName}"`);

            return modified;
        });

        if (converted > 0) {
            console.log(`[AD] ✅ Converted ${converted} AD tracks to languages`);
        }

        return newLines;
    }

    // ============================================
    // Manifest Filter
    // ============================================

    function filterManifest(m3u8) {
        if (!m3u8?.includes('#EXTM3U')) return m3u8;
        detectCapabilities();
        detectScreen();

        let lines = m3u8.split('\n');

        // STEP 1: Swap eac-3 URIs with Atmos URIs
        if (CONFIG.swapToAtmos && capabilities.eac3) {
            lines = swapAtmosURIs(lines);
        }

        // STEP 2: Convert Audio Description to Language
        if (CONFIG.adAsLanguage) {
            lines = convertADtoLanguage(lines);
        }

        // STEP 3: Choose audio group
        const audioGroups = new Set();
        for (const line of lines) {
            if (line.includes('TYPE=AUDIO')) {
                const groupId = line.match(/GROUP-ID="([^"]+)"/)?.[1];
                if (groupId) audioGroups.add(groupId);
            }
        }

        let selectedAudioGroup = '';
        if (capabilities.eac3 && audioGroups.has('eac-3')) {
            selectedAudioGroup = 'eac-3';
        } else if (audioGroups.has('aac-128k')) {
            selectedAudioGroup = 'aac-128k';
        } else {
            selectedAudioGroup = [...audioGroups][0] || '';
        }

        console.log('[Audio] 🎯 Selected:', selectedAudioGroup);

        // STEP 4: Parse video streams
        const streams = { dv: [], hdr10: [], hevc: [], avc: [] };

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (!line.startsWith('#EXT-X-STREAM-INF')) continue;

            const nextLine = lines[i + 1] || '';
            const bandwidth = parseInt(line.match(/BANDWIDTH=(\d+)/)?.[1] || '0');
            const resolution = line.match(/RESOLUTION=(\d+x\d+)/)?.[1] || '';
            const audioGroup = line.match(/AUDIO="([^"]+)"/)?.[1] || '';
            const width = parseInt(resolution.split('x')[0]) || 0;

            const info = { line, nextLine, bandwidth, resolution, width, audioGroup, index: i };

            if (nextLine.includes('DOLBY_VISION') || line.includes('dvh1')) {
                streams.dv.push(info);
            } else if (nextLine.includes('HDR_HDR10') || line.includes('VIDEO-RANGE=PQ')) {
                streams.hdr10.push(info);
            } else if (line.includes('hvc1') || line.includes('hev1')) {
                streams.hevc.push(info);
            } else {
                streams.avc.push(info);
            }
        }

        console.log('[Video] 📊 DV:', streams.dv.length, '| HDR10:', streams.hdr10.length,
                    '| HEVC:', streams.hevc.length, '| AVC:', streams.avc.length);

        // STEP 5: Select best video
        let selected = [];
        let videoType = '';

        if (capabilities.dolbyVision && streams.dv.length && !CONFIG.disableDolbyVision) {
            selected = streams.dv; videoType = 'DV';
        } else if (capabilities.hdr10 && streams.hdr10.length && !CONFIG.disableHDR10) {
            selected = streams.hdr10; videoType = 'HDR10';
        } else if (capabilities.hevc && streams.hevc.length) {
            selected = streams.hevc; videoType = 'HEVC';
        } else {
            selected = streams.avc; videoType = 'AVC';
        }

        if (CONFIG.disableHDR10 && streams.hdr10.length) {
            console.log('[Video] ⛔ HDR10 disabled by config');
        }
        if (CONFIG.disableDolbyVision && streams.dv.length) {
            console.log('[Video] ⛔ Dolby Vision disabled by config');
        }

        // Filter by audio group
        if (selectedAudioGroup) {
            const filtered = selected.filter(s => s.audioGroup === selectedAudioGroup);
            if (filtered.length) selected = filtered;
        }

        if (!selected.length) {
            console.log('[Manifest] ⚠️ No streams found');
            return lines.join('\n');
        }

        // Filter by resolution
        const maxWidth = screenInfo.maxStreamWidth;
        if (!CONFIG.forceMaxBitrate) {
            const resFiltered = selected.filter(s => s.width <= maxWidth);
            if (resFiltered.length) selected = resFiltered;
        }

        // Pick highest bandwidth at best resolution
        selected.sort((a, b) => b.width - a.width || b.bandwidth - a.bandwidth);
        const best = selected[0];

        console.log('[Video] 🎯', videoType, best.resolution, (best.bandwidth / 1000000).toFixed(1) + 'Mbps');

        // STEP 6: Build final manifest
        const result = [];
        const keepVideo = new Set([best.index, best.index + 1]);
        let audioCount = 0;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            if (line.startsWith('#EXT-X-STREAM-INF')) {
                if (keepVideo.has(i)) {
                    result.push(line);
                    result.push(lines[++i]);
                } else {
                    i++;
                }
            } else if (line.includes('TYPE=AUDIO')) {
                const groupId = line.match(/GROUP-ID="([^"]+)"/)?.[1];
                if (groupId === selectedAudioGroup) {
                    result.push(line);
                    audioCount++;
                }
            } else {
                result.push(line);
            }
        }

        console.log('[Audio] ✅', audioCount, 'tracks');
        console.log('[Manifest] ✅ Done');

        return result.join('\n');
    }

    console.log('[Disney+ UHD] ✅ Ready |', screenInfo.tier);
    console.log('[Disney+ UHD] 🎭 Atmos Swap:', CONFIG.swapToAtmos ? 'ON' : 'OFF');
    console.log('[Disney+ UHD] 👁️ AD as Language:', CONFIG.adAsLanguage ? 'ON' : 'OFF');
    console.log('[Disney+ UHD] ⛔ Disable HDR10:', CONFIG.disableHDR10 ? 'ON' : 'OFF');
    console.log('[Disney+ UHD] ⛔ Disable Dolby Vision:', CONFIG.disableDolbyVision ? 'ON' : 'OFF');

})();