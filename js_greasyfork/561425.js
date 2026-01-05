// ==UserScript==
// @name         Torrent Mod Toolkit
// @namespace    http://tampermonkey.net/
// @version      1.1.5
// @description  Common actions for torrent mods
// @icon         https://raw.githubusercontent.com/xzin-CoRK/torrent-mod-toolkit/refs/heads/main/hammer.png
// @author       xzin
// @match        https://*/*torrents*
// @match        https://*/*torrent*
// @match        https://*/details.php*
// @match        https://*/torrents.php*
// @match        https://*/details*
// @connect      mediainfo.okami.icu
// @connect      gitea.okami.icu
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle

// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/561425/Torrent%20Mod%20Toolkit.user.js
// @updateURL https://update.greasyfork.org/scripts/561425/Torrent%20Mod%20Toolkit.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const version = "1.1.5";

    var mediainfo;
    var uniqueId;
    var file_structure;
    var imdbId;
    var home_tracker_link;
    var isHidden = false;
    var activeTemplate = null;

    const ATH_SEARCH_URL = "https://aither.cc/torrents?imdbId=";
    const AVISTAZ_SEARCH_URL = "https://avistaz.to/movies?search=&imdb=";
    const BHD_SEARCH_URL = "https://beyond-hd.me/torrents/all?search=&doSearch=Search&imdb=";
    const BLU_SEARCH_URL = "https://blutopia.cc/torrents?imdbId=";
    const BTN_SEARCH_URL = "https://broadcasthe.net/torrents.php?tvdb=";
    const FL_SEARCH_URL = "https://filelist.io/browse.php?search=";
    const HDB_SEARCH_URL = "https://hdbits.org/browse.php?imdb=";
    const HDT_SEARCH_URL = "https://hd-torrents.org/torrents.php?active=0&options=2&search=";
    const HUNO_SEARCH_URL = "https://hawke.uno/torrents?imdbId=";
    const LST_SEARCH_URL = "https://lst.gg/torrents?imdbId=";
    const MTEAM_SEARCH_URL = "https://kp.m-team.cc/browse?keyword=https://www.imdb.com/title/";
    const MTV_SEARCH_URL = "https://www.morethantv.me/torrents/browse?searchtext=";
    const PHD_MOVIES_SEARCH_URL = "https://privatehd.to/movies?search=&imdb=";
    const PHD_TV_SEARCH_URL = "https://privatehd.to/tv-shows?search=&imdb=";
    const PTP_SEARCH_URL = "https://passthepopcorn.me/torrents.php?imdb=";
    const ULCX_SEARCH_URL = "https://upload.cx/torrents?imdbId="
    const OLDT_SEARCH_URL = "https://oldtoons.world/torrents?imdbId="
    const CHD_SEARCH_URL = "https://ptchdbits.co/torrents.php?search="
    const AUD_SEARCH_URL = "https://audiences.me/torrents.php?search="
    const HHAN_SEARCH_URL = "https://hhanclub.top/torrents.php?search="
    const ANT_SEARCH_URL = "https://anthelion.me/torrents.php?searchstr="

    const SRRDB_SEARCH_URL = `https://srrdb.com/browse/imdb:`;

    const CONFIG_URL = "https://gitea.okami.icu/Dooky/toolkit/raw/branch/main/config.json";

    const CONFIG_CACHE_DURATION = 24 * 60 * 60 * 1000;

    let homeTrackerConfig = [
        {
            url: ATH_SEARCH_URL,
            releaseGroups: ["ATELiER", "Headpatter", "Kitsune", "NAN0", "MainFrame"]
        },
        {
            url: AVISTAZ_SEARCH_URL,
            releaseGroups: ["AppleTor", "DUSKLiGHT", "HBO", "MrHulk"]
        },
        {
            url: BHD_SEARCH_URL,
            releaseGroups: ["BeyondHD", "BMF", "CRFW", "decibeL", "FLUX", "FraMeSToR", "HiFi", "NCmt", "MiU", "PHOENiX", "TheFarm"]
        },
        {
            url: BLU_SEARCH_URL,
            releaseGroups: ["BLURANiUM", "BLUTONiUM", "CultFilms™", "CultFilms", "PmP", "Tux", "WiLDCAT"]
        },
        {
            url: BTN_SEARCH_URL,
            releaseGroups: ["BTN", "CMRG", "iT00NZ", "LAZY", "NTb", "RAWR", "TVSmash"]
        },
        {
            url: FL_SEARCH_URL,
            releaseGroups: ["playBD", "playHD", "playWEB"]
        },
        {
            url: HDB_SEARCH_URL,
            releaseGroups: ["CALiGARi", "CasStudio", "Chotab", "Cinefeel", "CtrlHD", "DON", "EA", "EbP", "HaB", "HDMaNiAcS", "HiP", "KHN", "LoRD", "monkee", "NTG", "REBORN", "RO", "SbR", "SiGMA", "Skazhutin", "TayTO", "ViSUM", "VietHD", "WiLF", "WiHD", "ZoroSenpai", "ZQ"]
        },
        {
            url: HDT_SEARCH_URL,
            releaseGroups: ["KRaLiMaRKo", "HDT", "HiDt", "SPHD", "126811"]
        },
        {
            url: HUNO_SEARCH_URL,
            releaseGroups: ["HONE"]
        },
        {
            url: LST_SEARCH_URL,
            releaseGroups: ["coffee", "L0ST", "SQS", "Yuki"]
        },
        {
            url: MTEAM_SEARCH_URL,
            releaseGroups: ["MTeam", "MWeb"]
        },
        {
            url: MTV_SEARCH_URL,
            releaseGroups: ["hallowed", "TEPES", "PiRAMiDHEAD", "E.N.D", "SMURF", "WDYM", "VaLTiEL"]
        },
        {
            url: PHD_MOVIES_SEARCH_URL, // Default to movies, will be overridden if torrentType is 'tv'
            urlTv: PHD_TV_SEARCH_URL, // TV shows URL
            releaseGroups: ["EPSiLON", "TRiToN","SiGMA"]
        },
        {
            url: PTP_SEARCH_URL,
            releaseGroups: ["PTP", "HANDJOB"]
        },
        {
            url: ULCX_SEARCH_URL,
            releaseGroups: ["BLOOM", "REWiND"]
        },
        {
            url: OLDT_SEARCH_URL,
            releaseGroups: ["OldT"]
        },
        {
            url: HHAN_SEARCH_URL,
            releaseGroups: ["HHWEB"]
        },
        {
            url: CHD_SEARCH_URL,
            releaseGroups: ["CHDWEB"]
        },
        {
            url: AUD_SEARCH_URL,
            releaseGroups: ["ADWeb"]
        },
        {
            url: ANT_SEARCH_URL,
            releaseGroups: ["ANThELIa"]
        }
    ];

    function validateConfig(config) {
        if (!config || typeof config !== 'object') return false;
        if (!config.homeTrackers || !Array.isArray(config.homeTrackers)) return false;
        for (const tracker of config.homeTrackers) {
            if (!tracker.code || !tracker.url || !Array.isArray(tracker.releaseGroups)) {
                return false;
            }
        }

        return true;
    }

    function convertExternalConfigToInternal(externalConfig) {
        const internalConfig = [];

        for (const tracker of externalConfig.homeTrackers) {
            const entry = {
                url: tracker.url,
                releaseGroups: tracker.releaseGroups
            };

            if (tracker.urlTv) {
                entry.urlTv = tracker.urlTv;
            }

            if (tracker.extraParams) {
                entry.extraParams = tracker.extraParams;
            }

            internalConfig.push(entry);
        }

        return internalConfig;
    }

    function fetchExternalConfig(forceRefresh = false) {
        if (!CONFIG_URL) {
            return Promise.resolve({ config: null, fromCache: false });
        }

        if (!forceRefresh) {
            const cached = GM_getValue("tmt_config_cache", null);
            const cacheTime = GM_getValue("tmt_config_cache_time", 0);

            if (cached && cacheTime && (Date.now() - cacheTime < CONFIG_CACHE_DURATION)) {
                try {
                    const parsed = JSON.parse(cached);
                    if (validateConfig(parsed)) {
                        return Promise.resolve({ config: parsed, fromCache: true });
                    }
                } catch (e) {
                    console.warn("[TMT] Failed to parse cached config:", e);
                }
            }
        }

        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: CONFIG_URL + (CONFIG_URL.includes('?') ? '&' : '?') + '_t=' + Date.now(),
                onload: function(response) {
                    if (response.status === 200) {
                        try {
                            const config = JSON.parse(response.responseText);
                            if (validateConfig(config)) {
                                GM_setValue("tmt_config_cache", response.responseText);
                                GM_setValue("tmt_config_cache_time", Date.now());
                                resolve({ config: config, fromCache: false });
                            } else {
                                console.warn("[TMT] Invalid config structure, using hardcoded config");
                                resolve({ config: null, fromCache: false });
                            }
                        } catch (e) {
                            console.error("[TMT] Failed to parse config JSON:", e);
                            resolve({ config: null, fromCache: false });
                        }
                    } else {
                        console.warn("[TMT] Failed to fetch config, status:", response.status);
                        resolve({ config: null, fromCache: false });
                    }
                },
                onerror: function(error) {
                    console.error("[TMT] Error fetching config:", error);
                    resolve({ config: null, fromCache: false });
                }
            });
        });
    }

    var externalConfigData = null;

    /**
     * Builds the home tracker link based on current page data
     */
    function extractTVDB() {
        const tvdbElement = document.querySelector('li.meta__tvdb');
        if (!tvdbElement) return null;
        const link = tvdbElement.querySelector('a');
        if (!link || !link.href) return null;
        const match = link.href.match(/[?&]id=(\d+)/);
        return match ? match[1] : null;
    }

    function buildHomeTrackerLink() {
        if (!activeTemplate) return;

        const release_group = activeTemplate.extractReleaseGroup();
        if (!release_group) return;

        // Detect torrent type
        const torrentType = activeTemplate.extractTorrentType ? activeTemplate.extractTorrentType() : null;

        const trackerConfig = getHomeTrackerUrl(release_group, torrentType);
        if (trackerConfig && trackerConfig.url) {
            const btnReleaseGroups = ["BTN", "CMRG", "iT00NZ", "LAZY", "NTb", "RAWR", "TVSmash"];
            const isBTNReleaseGroup = btnReleaseGroups.includes(release_group);

            if (needsTitleSearch(release_group)) {
                const torrentTitle = extractTorrentTitle();
                if (torrentTitle) {
                    home_tracker_link = trackerConfig.url + encodeURIComponent(torrentTitle);
                    if (trackerConfig.extraParams) {
                        home_tracker_link += trackerConfig.extraParams;
                    }
                }
            } else if (isBTNReleaseGroup) {
                const tvdbId = extractTVDB();
                if (tvdbId) {
                    home_tracker_link = trackerConfig.url + tvdbId;
                    if (trackerConfig.extraParams) {
                        home_tracker_link += trackerConfig.extraParams;
                    }
                }
            } else if (imdbId) {
                home_tracker_link = trackerConfig.url + imdbId;

                if (trackerConfig.extraParams) {
                    home_tracker_link += trackerConfig.extraParams;
                }
            }
        }
    }

    function loadConfig(forceRefresh = false) {
        fetchExternalConfig(forceRefresh).then(result => {
            const { config: externalConfig, fromCache } = result;
            if (externalConfig) {
                const converted = convertExternalConfigToInternal(externalConfig);
                if (converted.length > 0) {
                    homeTrackerConfig = converted;
                    externalConfigData = externalConfig;
                    updateNeedsTitleSearch(externalConfig);

                    // Rebuild home tracker link with new config
                    buildHomeTrackerLink();

                    if (!fromCache) {
                        showToast("✓ Config updated from external source", 3000);
                    }
                    renderToolkit();
                }
            } else if (forceRefresh) {
                showToast("⚠ Using hardcoded config (external fetch failed)", 3000);
            }
        });
    }

    function getSearchUrlByCode(code) {
        if (externalConfigData && externalConfigData.homeTrackers) {
            const tracker = externalConfigData.homeTrackers.find(t => t.code === code);
            if (tracker) {
                return tracker.url;
            }
        }

        // Fallback to hardcoded URLs
        const hardcodedUrls = {
            "ATH": ATH_SEARCH_URL,
            "PTP": PTP_SEARCH_URL,
            "BTN": BTN_SEARCH_URL,
            "HDB": HDB_SEARCH_URL,
            "SRRDB": SRRDB_SEARCH_URL
        };

        return hardcodedUrls[code] || null;
    }

    function updateNeedsTitleSearch(externalConfig) {
        window.tmtTitleBasedTrackers = [];
        for (const tracker of externalConfig.homeTrackers) {
            if (tracker.needsTitleSearch) {
                window.tmtTitleBasedTrackers.push(...tracker.releaseGroups);
            }
        }
    }

    function forceRefreshConfig() {
        showToast("🔄 Fetching config...", 2000);
        loadConfig(true);
    }

    function getHomeTrackerUrl(releaseGroup, torrentType = null) {
        for (const config of homeTrackerConfig) {
            if (config.releaseGroups.includes(releaseGroup)) {
                const url = (config.urlTv && torrentType === 'tv') ? config.urlTv : config.url;
                return {
                    url: url,
                    extraParams: config.extraParams || null
                };
            }
        }
        return null;
    }

    function needsTitleSearch(releaseGroup) {
        if (window.tmtTitleBasedTrackers && window.tmtTitleBasedTrackers.length > 0) {
            return window.tmtTitleBasedTrackers.includes(releaseGroup);
        }
        const titleBasedTrackers = ["HHWEB", "ANThELIa"];
        return titleBasedTrackers.includes(releaseGroup);
    }

    function extractTorrentTitle() {
        if (file_structure) {
            const firstFilename = file_structure.split('\n')[0].trim();
            if (firstFilename) {
                let nameWithoutExt = firstFilename.replace(/\.(mkv|mp4|avi|m4v)$/i, '');
                nameWithoutExt = nameWithoutExt.replace(/[-.]([A-Za-z0-9]+)$/, '');
                const parts = nameWithoutExt.split('.');
                const titleParts = [];
                for (const part of parts) {
                    if (/^\d{4}$/.test(part) || /^\d+p$/i.test(part) || /^\d+i$/i.test(part) ||
                        /^(NF|AMZN|WEB|DL|WEB-DL|WEBRip|BluRay|Blu-ray|REMUX|UHD|HDR|DV|DDP|DD\+|DTS|AC3|AAC|H\.264|H\.265|x264|x265)/i.test(part)) {
                        break;
                    }
                    titleParts.push(part);
                }

                if (titleParts.length > 0) {
                    return titleParts.join(' ');
                }
            }
        }

        let title = document.querySelector("h1.torrent__name");

        if (!title) {
            title = document.querySelector("h1") ||
                    document.querySelector(".torrent-title h1") ||
                    document.querySelector("h2.torrent__name") ||
                    document.querySelector("h2");
        }

        if (!title) return null;

        const fullTitle = (title.innerText || title.textContent || "").trim();

        let cleanedTitle = fullTitle
            .replace(/\s*-\s*[A-Za-z0-9]+$/, '')
            .replace(/\.[A-Za-z0-9]+$/, '')
            .trim();
        const words = cleanedTitle.split(/\s+/);
        const titleWords = [];

        for (const word of words) {
            if (/^\d{4}$/.test(word) || /^\d+p$/i.test(word) || /^\d+i$/i.test(word) ||
                /^(NF|AMZN|WEB|DL|WEB-DL|WEBRip|BluRay|Blu-ray|REMUX|UHD|HDR|DV|DDP|DD\+|DTS|AC3|AAC|H\.264|H\.265|x264|x265)/i.test(word)) {
                break;
            }
            titleWords.push(word);
        }

        if (titleWords.length > 0) {
            return titleWords.join(' ');
        }

        return cleanedTitle;
    }
    /*
    * Helper function to create a toast notification element
    */
    function setupToast() {
        if (document.getElementById("tmt-toast-container")) return;

        const container = document.createElement("div");
        container.id = "tmt-toast-container";
        document.body.appendChild(container);
    }

    /*
    * Helper function to display messages via toast
    */
    function showToast(message, duration = 2500) {
        const container = document.getElementById("tmt-toast-container");
        if (!container) return;
        const toast = document.createElement("div");
        toast.className = "tmt-toast";
        toast.textContent = message;
        container.appendChild(toast);
        requestAnimationFrame(() => toast.classList.add("show"));
        setTimeout(() => {
            toast.classList.remove("show");
            toast.addEventListener("transitionend", () => toast.remove(), { once: true });
        }, duration);
    }

    function filterMkvFilenames(fileStructure) {
        if (!fileStructure) return null;
        const lines = fileStructure.split('\n')
            .map(line => line.trim())
            .filter(line => {
                if (!/\.mkv$/i.test(line)) return false;
                if (/\.sample\.mkv$/i.test(line) || /\.Sample\.mkv$/i.test(line) ||
                    /sample\.mkv$/i.test(line) || /Sample\.mkv$/i.test(line) ||
                    /\bsample\b/i.test(line)) {
                    return false;
                }
                return true;
            });

        return lines.length > 0 ? lines.join("\n") : null;
    }

    /*
    * Extract the unique ID from within mediainfo, if present
    */
    function extractUniqueId(mediainfo) {
        if (!mediainfo) return null;

        const match = mediainfo.match(/Unique\s+ID\s*[:\-]\s*([A-Za-z0-9]+(?:\.[A-Za-z0-9]+)?)/i);
        return match ? match[1].trim() : null;
    }

    function extractOMGSearchTitle() {
        const titleElement = document.querySelector("h1.torrent__name");
        if (!titleElement) return null;
        const fullTitle = (titleElement.innerText || titleElement.textContent || "").trim();
        if (!fullTitle) return null;
        let title = fullTitle;
        const akaIndex = title.search(/\s+AKA\s+/i);
        if (akaIndex !== -1) {
            const beforeAka = title.substring(0, akaIndex).trim();
            const afterAka = title.substring(akaIndex);
            const yearMatch = afterAka.match(/\b(19|20)\d{2}\b/);
            const seasonEpisodeMatch = afterAka.match(/\b(S\d+E\d+)\b/i);
            const seasonPackMatch = afterAka.match(/\b(S\d+)\b/i); // Season pack (S03 without episode)
            if (seasonEpisodeMatch) {
                title = beforeAka + ' ' + seasonEpisodeMatch[1];
            } else if (seasonPackMatch) {
                title = beforeAka + ' ' + seasonPackMatch[1];
            } else if (yearMatch) {
                title = beforeAka + ' ' + yearMatch[0];
            } else {
                title = beforeAka;
            }
        }

        const seriesMatch = title.match(/(.+?)\s+(S\d+E\d+)/i);
        if (seriesMatch) {
            const titlePart = seriesMatch[1].trim();
            const episodePart = seriesMatch[2];
            const beforeQuality = titlePart + ' ' + episodePart;
            return beforeQuality.split(/\s+\d{3,4}p|\s+\d{3,4}i|\s+(WEB|DL|WEB-DL|WEBRip|BluRay|Blu-ray|REMUX|UHD|HDR|DV|DDP|DD\+|DTS|AC3|AAC|H\.264|H\.265|x264|x265|CR|DSNP|NF|AMZN)/i)[0].trim();
        }
        const seasonPackMatch = title.match(/(.+?)\s+(S\d+)(?!E\d+)/i);
        if (seasonPackMatch) {
            const titlePart = seasonPackMatch[1].trim();
            const seasonPart = seasonPackMatch[2];
            const beforeQuality = titlePart + ' ' + seasonPart;
            return beforeQuality.split(/\s+\d{3,4}p|\s+\d{3,4}i|\s+(REPACK|JAPANESE|WEB|DL|WEB-DL|WEBRip|BluRay|Blu-ray|REMUX|UHD|HDR|DV|DDP|DD\+|DTS|AC3|AAC|H\.264|H\.265|x264|x265|CR|DSNP|NF|AMZN)/i)[0].trim();
        }
        const beforeQuality = title.split(/\s+\d{3,4}p|\s+\d{3,4}i|\s+(WEB|DL|WEB-DL|WEBRip|BluRay|Blu-ray|REMUX|UHD|HDR|DV|DDP|DD\+|DTS|AC3|AAC|H\.264|H\.265|x264|x265|CR|DSNP|NF|AMZN)/i)[0];
        const words = beforeQuality.trim().split(/\s+/);
        const titleWords = [];
        let foundYear = false;

        for (const word of words) {
            if (/^\d{4}$/.test(word)) {
                titleWords.push(word);
                foundYear = true;
                break;
            }
            titleWords.push(word);
        }

        if (!foundYear) {
            const yearMatch = fullTitle.match(/\b(19|20)\d{2}\b/);
            if (yearMatch) {
                titleWords.push(yearMatch[0]);
            }
        }

        return titleWords.length > 0 ? titleWords.join(' ') : null;
    }

    function extractAnimebytesSearchTitle() {
        const titleElement = document.querySelector("h1.torrent__name");
        if (!titleElement) return null;
        const fullTitle = (titleElement.innerText || titleElement.textContent || "").trim();
        if (!fullTitle) return null;
        let title = fullTitle;
        const akaIndex = title.search(/\s+AKA\s+/i);
        if (akaIndex !== -1) {
            title = title.substring(0, akaIndex).trim();
        }
        const seriesMatch = title.match(/(.+?)\s+(S\d+E\d+)/i);
        if (seriesMatch) {
            const titlePart = seriesMatch[1].trim();
            return titlePart.split(/\s+\d{3,4}p|\s+\d{3,4}i|\s+(WEB|DL|WEB-DL|WEBRip|BluRay|Blu-ray|REMUX|UHD|HDR|DV|DDP|DD\+|DTS|AC3|AAC|H\.264|H\.265|x264|x265|CR|DSNP|NF|AMZN|REPACK|JAPANESE)/i)[0].trim();
        }
        const seasonPackMatch = title.match(/(.+?)\s+(S\d+)(?!E\d+)/i);
        if (seasonPackMatch) {
            const titlePart = seasonPackMatch[1].trim();
            return titlePart.split(/\s+\d{3,4}p|\s+\d{3,4}i|\s+(REPACK|JAPANESE|WEB|DL|WEB-DL|WEBRip|BluRay|Blu-ray|REMUX|UHD|HDR|DV|DDP|DD\+|DTS|AC3|AAC|H\.264|H\.265|x264|x265|CR|DSNP|NF|AMZN)/i)[0].trim();
        }
        const beforeQuality = title.split(/\s+\d{3,4}p|\s+\d{3,4}i|\s+(WEB|DL|WEB-DL|WEBRip|BluRay|Blu-ray|REMUX|UHD|HDR|DV|DDP|DD\+|DTS|AC3|AAC|H\.264|H\.265|x264|x265|CR|DSNP|NF|AMZN|REPACK|JAPANESE)/i)[0];
        const words = beforeQuality.trim().split(/\s+/);
        const titleWords = [];
        for (const word of words) {
            if (/^\d{4}$/.test(word) || /^S\d+$/i.test(word)) {
                break;
            }
            if (/^(REPACK|JAPANESE)$/i.test(word)) {
                break;
            }
            titleWords.push(word);
        }

        return titleWords.length > 0 ? titleWords.join(' ') : null;
    }

    function extractResolution(mediainfo) {
        if (!mediainfo) return null;

        const widthMatch = mediainfo.match(/Width\s*[:\-]\s*([\d\s,]+)\s*pixels/i);
        const heightMatch = mediainfo.match(/Height\s*[:\-]\s*([\d\s,]+)\s*pixels/i);

        if (widthMatch && heightMatch) {
            const width = parseInt(widthMatch[1].replace(/[\s,]/g, ''));
            const height = parseInt(heightMatch[1].replace(/[\s,]/g, ''));

            if (width && height) {
                return {
                    width: width,
                    height: height
                };
            }
        }
        return null;
    }

    function getImageDimensions(imageUrl) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const timeout = setTimeout(() => {
                reject(new Error('Image load timeout'));
            }, 10000);

            img.onload = () => {
                clearTimeout(timeout);
                resolve({
                    width: img.naturalWidth,
                    height: img.naturalHeight
                });
            };
            img.onerror = () => {
                clearTimeout(timeout);
                reject(new Error('Failed to load image'));
            };
            img.src = imageUrl;
        });
    }

    async function checkScreenshotResolutions() {
        if (!window.location.hostname.includes('aither.cc')) {
            showToast("This feature only works on aither.cc");
            return;
        }

        if (!mediainfo) {
            showToast("No mediainfo found");
            return;
        }

        const mediainfoResolution = extractResolution(mediainfo);
        if (!mediainfoResolution) {
            showToast("Could not extract resolution from mediainfo");
            return;
        }

        const descriptionSection = document.querySelector('.panel__body.bbcode-rendered') ||
                                   document.querySelector('.bbcode-rendered') ||
                                   document.querySelector('section.panelV2 .panel__body');

        if (!descriptionSection) {
            showToast("Description section not found");
            return;
        }

        const images = descriptionSection.querySelectorAll('img');
        if (images.length === 0) {
            showToast("No images found in description");
            return;
        }

        showToast(`Checking ${images.length} image(s)...`, 2000);

        const results = [];

        for (const img of images) {
            let imageUrl = img.src || img.getAttribute('src');

            if (!imageUrl) continue;

            try {
                const dimensions = await getImageDimensions(imageUrl);
                const matches = dimensions.width === mediainfoResolution.width &&
                               dimensions.height === mediainfoResolution.height;

                results.push({
                    url: imageUrl,
                    width: dimensions.width,
                    height: dimensions.height,
                    matches: matches
                });
            } catch (e) {
                results.push({
                    url: imageUrl,
                    error: true
                });
            }
        }

        showResolutionComparison(mediainfoResolution, results);
    }

    function showResolutionComparison(mediainfoResolution, imageResults) {
        const existing = document.getElementById("tmt-resolution-check-display");
        if (existing) existing.remove();

        const display = document.createElement("div");
        display.id = "tmt-resolution-check-display";

        const matchCount = imageResults.filter(r => r.matches === true).length;
        const totalCount = imageResults.filter(r => !r.error).length;
        const allMatch = matchCount === totalCount && totalCount > 0;
        const hasResults = totalCount > 0;

        display.innerHTML = `
            <div class="header">
                <b>Resolution Check</b>
                <button id="tmt-close-resolution-check">×</button>
            </div>
            <div class="body">
                <div class="data-item">
                    <strong>MediaInfo Resolution:</strong><br>
                    <code>${mediainfoResolution.width} × ${mediainfoResolution.height}</code>
                </div>
                ${hasResults ? `
                <div class="comparison-boxes">
                    <div class="comparison-box ${allMatch ? 'match' : 'no-match'}">
                        <div class="comparison-label">Screenshot Match</div>
                        <div class="comparison-status">${allMatch ? `✓ ${matchCount}/${totalCount} Match` : `✗ ${matchCount}/${totalCount} Match`}</div>
                    </div>
                </div>
                ` : ''}
                <div class="image-results">
                    <strong>Screenshot Results:</strong>
                    ${imageResults.length === 0 ? '<div class="image-result error">No images found</div>' : imageResults.map((result, index) => {
                        if (result.error) {
                            return `<div class="image-result error">Image ${index + 1}: Failed to load</div>`;
                        }
                        const matchClass = result.matches ? 'match' : 'no-match';
                        return `<div class="image-result ${matchClass}">
                            Image ${index + 1}: ${result.width} × ${result.height}
                            ${result.matches ? '✓' : '✗'}
                        </div>`;
                    }).join('')}
                </div>
            </div>
        `;

        document.body.appendChild(display);

        document.getElementById("tmt-close-resolution-check").addEventListener("click", () => {
            display.remove();
        });

        setTimeout(() => {
            if (display.parentNode) {
                display.remove();
            }
        }, 30000);
    }


    /*
    * Inserts the toolkit into the DOM
    * It is necessary to have in its own function with the ability to re-render due to asynchronous nature of fetching mediainfo from HDB
    */
    function renderToolkit() {
        let existingToolkit = document.getElementById("torrentModToolkit");

        // Render element
        const toolkitDiv = document.createElement("div");
        toolkitDiv.id = "torrentModToolkit";

        let mediainfoDisabled = activeTemplate && mediainfo ? ``: ` disabled `;
        let uniqueIdDisabled = activeTemplate && uniqueId ? ``: ` disabled `;
        let fileStructureDisabled = activeTemplate && file_structure ? `` : ` disabled `;
        let homeTrackerDisabled = activeTemplate && home_tracker_link ? `` : ` disabled `;

        var mediainfoButtonHtml = `<button id="copyFullMediainfoBtn"` + mediainfoDisabled + `" >Copy mediainfo</button>`;
        var uniqueIdButtonHtml = `<button id="copyUniqueIDBtn"`+ uniqueIdDisabled +`">Copy Unique ID</button>`;
        var fileStructureButtonHtml = `<button id="copyFileStructureBtn"` + fileStructureDisabled + `>Copy file name(s)</button>`;
        var homeTrackerButtonHtml = `<button id="homeTrackerBtn"`+ homeTrackerDisabled +`>Go to home tracker</button>`;

        const isAither = window.location.hostname.includes('aither.cc');
        let resolutionCheckButtonHtml = '';
        if (isAither) {
            let resolutionCheckDisabled = (activeTemplate && mediainfo) ? `` : ` disabled `;
            resolutionCheckButtonHtml = `<button id="checkResolutionBtn"` + resolutionCheckDisabled + `>Check screenshot resolution</button>`;
        }

        let OMG_SEARCH_URL = '';
        let ANIMEBYTES_SEARCH_URL = '';
        const omgSearchTitle = extractOMGSearchTitle();
        const animebytesSearchTitle = extractAnimebytesSearchTitle();
        if (omgSearchTitle) {
            OMG_SEARCH_URL = `https://omgwtfnzbs.org/browse?search=${encodeURIComponent(omgSearchTitle)}`;
        }
        if (animebytesSearchTitle) {
            ANIMEBYTES_SEARCH_URL = `https://animebytes.tv/torrents.php?searchstr=${encodeURIComponent(animebytesSearchTitle)}&filter_cat[1]=1`;
        }

        const athUrl = getSearchUrlByCode("ATH") || ATH_SEARCH_URL;
        const ptpUrl = getSearchUrlByCode("PTP") || PTP_SEARCH_URL;
        const btnUrl = getSearchUrlByCode("BTN") || BTN_SEARCH_URL;
        const hdbUrl = getSearchUrlByCode("HDB") || HDB_SEARCH_URL;
        const bluUrl = getSearchUrlByCode("BLU") || BLU_SEARCH_URL;
        const bhdUrl = getSearchUrlByCode("BHD") || BHD_SEARCH_URL;
        const srrdbUrl = getSearchUrlByCode("SRRDB") || SRRDB_SEARCH_URL;

        const tvdbId = extractTVDB();

        toolkitDiv.innerHTML = `
        <div class="header">${CONFIG_URL ? `<a href="#" id="tmt-refresh-config" title="Force refresh config from external source"><img width="20" height="20" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAE/SURBVDhPvdSxSxxREMfxj3ELm1RqY9AmsfKsrMQ0gXQ22ulfcH/Gcn9CWnsRK68RtBZ7SZfYWZpGG+Hg8Gxm5TnsniKSLwzsm3m/Yd6b2ccHM5MdiUVsYSXWN7jEv7TvVXoYYoxJsnHEelnURR+jlkTZRtjP4kw/ia5RYzesDt8kjv0tJyjpFZU9YoAqbwpfje85kBkWlQ1ycAo/sZmdi0UDrjsqa2Mdd7jNx98pqqvLwBSWYowa3V8sfIpgM2fwu/juosIplgvfKk5m8Qvb+BKB+biT82hOGxM8RKc3wneEQzhIozLB8Ut9J3Wh2WmcFc6KwAXmXupaqYqZHEdjn/mMK/yJI7+FQVHEMAfFHX4t1j86xqeKZI+RbIS1vCmzF4Jpv15j/SzOzOO+pVHZRm9J1rCGk/c8X//tgX03Tz/1cLHeVV33AAAAAElFTkSuQmCC" /></a>` : ''}<div class="center"><b>Torrent Mod Toolkit v` + version + `</b></div><button id="toggleToolkitBtn">▼</button></div>
        <div class="body">
        <div class="center pad">
          <a href="${athUrl + imdbId}" id="athButton" target="_blank"><img width="20" height="20" title="ATH" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAFu0lEQVRYR5VXWUxVRxj+BcKi7NAaCiRIsQQlqAEpoIAgxgiYxmAkJNIUiA8YRCMiqwsoO4Y1QXxoEx6VHQooqyJla4I80ASxkIYHWSoSEChCofP9uacheu89x0m+HJj578w3/z67SPPQE0ueAu4CTio4iq+hgJnALgFz1c/fq76L4vuPwJTAGxV+F98hgX/VHYVNPh1fiYkkgZ8ErLQQ/JKlv4XwLwL5Avj7//EpgbNipWrHzb7kECWy0FSkwK+S8E4COLxOQFfTTra2thQWFkZHjhyhAwcO0L59+0hPT4/evXtHo6Oj9Pz5c2pubqapKVhA44ApfpBISASg6nFNKtfV1aVbt24xdHR0ZG/66NEjun79Oq2srGiShSa+gzkkAoXinwR10paWlpSYmEgGBgYUGhpK+/fv10oAt29sbOTDS0pKaG5uTpN8rlhIAQF4+4y62zs5OdGLFy/IxsaGNxkZGaHq6mpydHSkvXv3Un19PWskODiYzTAxMUHh4eFsIoyZmRny9fWlN28QEJ8NMPsGBHwE+jTRhN2joqLIwcGB1tbWmEBxcTEdPnyYyS0vL1NISAiNjY1RQkICnT59moyNjfnwiooKevv2rTaNeYFAvECJNqmgoCB6/PgxmZqa0s2bN+nDhw9UWVlJnp6e9PHjR3r16hXFxcXx+t27d2lzc5MuXrxIdXXwaa0jDgRwOEhoHSAQGBhI1tbWfFhZWRm5ubmxbwwPD9OVK1eovLycZmdnORJiYmLktsR6EQggJoPlpGtra8nf35+srKwoPj6eHczV1ZV2795NQ0NDdPXqVSotLWUCNTU1dPnyZbktsd4EAn8IuMhJNzQ0sEMhKq5du0ZFRUV08OBBtvfg4CDPgdT8/Dz7SWxsrNyWWB8DgWkBOznppqYmOn78OFlYWHCMP3jwgJMR7D4wMMBzILWwsMAauHTpktyWWP8LBOYFrOWkYVdowMzMjL29sLCQCeD//v5+unHjBpNaXFxk50PkKBhzILAsYCwn3NLSwhrAjXFYQUEBubi4sEn6+vo4OjC3tLREMFdkJFK+7FgGgQ0BJCOto62tjY4dO0YmJiZ8WF5eHhOAU758+ZKSkpIoPz+fMyAyYUREhNyWWN9UTODp06esgT179vBhubm5TABh2dvbSykpKTy3urpK0Nb58+cVE1Bkgvb2dtYAwg6HZWdnsw+AADJiWloaz62vrzOBc+fOKSHAJlDkhJ2dnUzA0NCQUlNTKSsriw4dOkTm5uZchtPT03kOWbC1tZXOnkV1lx3shIrCsKuri02gr6/Ph927d4/c3d3ZJ3p6euj27ds8t7W1RTDXmTNnZE+XwlBRIuru7iY/Pz+SeoPMzEzy8vIiIyMjwhpqAOZAoKOjg06dOqWEACciRakYakYeQPm9c+cOHyiZBObJyMhgDcAE0NbJkyeVEOBUrKgYwdNhAmgA6gaJEydOcEuGG+NwANURJgkICFBCgIuRbDnGTkg2Pj4+fCAIACjT0MizZ8/o/v377IToGaAtkFMwuBx7C/wmJ4yKd/ToUfZ69IZIx2jR4JSolOgDEZ7ojF6/fk3Ozs5yW2L9e6klQ9uisR6gNRsfH+fb4pYXLlzg3hD1YXt7m0MO7diTJ084RDGH30xOTmojMSsWuSXDwIMhUZM0bg2nwxeFxtvbm+zt7bkVh9N5eHjQ9PQ0p2RkQBQkyL9/Lz2Y1O6cI2ZTJQK4PdpyS00kqqqqOAmhBsDj0QlB1ch8dnZ2HH6oBcnJybSxscHFCHMaBl5HsNHCzodJiJhoEPjsYfLw4UNWOzZErON26kZOTg4XKkQKOubo6Gh1YniYIE22YvHTpxlI4GmmURPajKpgDTf/UTpcHQHM4ZUEf0BH8bWCTZWIwOF+FsADaGHnD9S9jqV1mMJDBel5/q3430AAz3L81kIlDG/bFpCe53D/CYE/BYYF8ERX6xD/ASJxPRuj85L2AAAAAElFTkSuQmCC" /></a>
          <a href="${ptpUrl + imdbId}" target="_blank"><img width="20" height="20" title="PTP" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADkAAAA5CAMAAAC7xnO3AAAAV1BMVEUAAAD///9oiM2CacFm5Mj/jGb842dn3auC3X/z82j/uWZw14xudcRwbsBmpdz83GZm4NBq26KP4Hrm9Wr/rmdmr91u2ZNmntln5L/902b/l2Zt1otnseEVRKmYAAAAeUlEQVRIx+3WtwqAMBCAYU2zpNlii+//nAZFCDooSIaQ+5fjhm89LoNCl7u+TpCvM8kopUNda81YVfVu78rS8rEtCkJI4/ZNKYSQkBJjfJerk4sv+SHnUxo1/ZMCJEiQIKOV8pKPe8s8aa317q3x7m2SxfUnxCWhAO24CSsei22B/wAAAABJRU5ErkJggg==" /></a>
          <a href="${btnUrl + tvdbId}" target="_blank"><img width="20" height="20" title="BTN" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwBAMAAAClLOS0AAAAJFBMVEUAAAAKfKcLodkJcJcKnNEKlMoKd6AKirsKc5wKhbQJkMQKga5GWjbDAAAAAXRSTlMAQObYZgAAAWJJREFUOMul0D1PwzAQBmCn0JSPJadKUImlsmCnyh9AkbsjlAjBVBbPZcrAAgvK2DVi6YIQmdj957DfxrGtBJbekNzdYzsXs72C8+H+iPP5X3AzCIdCDMP4H7jtH68fJ0VhIJhAzwPYYoRgHq6haTRwf2gOmJQlwG0ZdbBm7LLbYvIs0589LsuNXpXpsCDEcq6hrje7SnTzC7PmVCkDI13OLSCLiH4A9gZyfRIzoFTSnpy1kN+Zd0wEuBL5ElDgKgArHI2Ge7MjKUNomk8LrzjisWla+EJ9UFUdbBnu7tvCtQNc0QvqOE1XSO5xaQ6YlGwYEA6iuv4I4cHcJqBeh4BGH8a2oZQKYGIbF0qVPkQadgkR+fBMdI4k1pB40JURBVsigF1y5sCrYindlkhK+eTlMgnyNmZmFaH/3m1AWZlYEE2ReCPOKsQb4en/bOpFwoYFfRdT21+g7O9JWD8oTYntEb/z/32K0Kt3+AAAAABJRU5ErkJggg==" /></a>
          <a href="${hdbUrl + imdbId}" target="_blank"><img width="20" height="20" title="HDB" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgBAMAAACBVGfHAAAAGFBMVEVPZHWjt8exxNNfdIV1ipuNorP+/v7Y3+RqcToTAAAA4ElEQVQoz6XITW6DMBCG4ZF8AkjcrkEh2RpNLgA22RvhsEZqZy6QmOt3DKpUWVlUyuufT3qgzvoHVFlQVOmU6W4fFFmvoJYpZep6Az+z9z5WMxFx4T3okrXW8VnS5UKLQJg5BB+fMvqTdIAwsg4hNmNyajYIvxDO3xncBaaR1nWl08jTNN2XAYaeUk3PgxtuAq5n51w8yQzutrg/IPPxlcH5IdDtsA0dHdiOr2jjoWNrZ3mAHaO9xmNLa6QHCrRsEeOhJeIGEQGzXoAyZn8qLYJSYIxRW2AUSOkzkNrl/X4ALOVfoodI6RkAAAAASUVORK5CYII=" /></a>
          <a href="${bluUrl + imdbId}" target="_blank"><img width="20" height="20" title="BLU" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAGFBMVEUAAAABc90AaMX+//8AVcJElNyDtui51vILVXb+AAAAAXRSTlMAQObYZgAAAklJREFUSMeV1U1z2jAQBmBygHMkTLjWio3PoALXRrWdKx+GXksx+JzYcf5+d+uPXTuCmb6TyUyGR+uVNhaDXoabwd1shfLvfDwUQiilbhY5CQSQp1vlG6B8e3kC9Bi+nAAVoeVNpGmEu+HdtZmlraBeBcU5rwgovylPibVOlQpDxXrd8gJ7rZfGPRxkqExT48SAqyHe9Jp9XswOxTcADwy8IiiUZ/zsc+0A+NEFco9gCUu9MAf4pYLM9Rp+sLZnBb7Wf2AfCYK9TvrAOc60llA7VZAoQ7Bh5yCfPgKtHQDvCLw47YGodMZav0GVuUHRB06W4CYwywrgI34DGNVTenOdcwWqcQQSftGsZOmKDvCOpgOCFFAF6oO4dIAsX3ogShUHcYEqJ+AFDgfyl+iDi0HQ/r9+uII/ot6k8muAT+gC72o6YFqdFQE4RszsH3gQMnvhYGUMdoDDbEDZA8dEcVD3KCJdJzkZG5AwTJqW5RGubuMRoCZlQGBh+Ds+rEeVE1iHPeCuPDHVLO8cjGD1tKQWWZv0dsvjKeBg0QUoRMxBoboA43OQWoDA7q8Q3E1iA/DBMoQ8A1AdsG2HXUwuh12MA6crCEH77id7nCVUsgExhoV5mWnvrOcE2C0Y6Lk6p9EamvjOZkUXwOS6k+P5z6WJrokViNAVr8txobzQVODx603qr/NENXEHTUb8llJtbJe5s18ZumVt4nlh6LK3ibiwredbUbSBXk4cPP7XlxqJBkzgj5uC1tsCgA7QGgSDexkKuFzvi/4B/QXy6uI0Y3ArsgAAAABJRU5ErkJggg==" /></a>
          <a href="${bhdUrl + imdbId}" target="_blank"><img width="20" height="20" title="BHD" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABAAgMAAADXB5lNAAAADFBMVEUAAAAmaMr9/f+On/YhYNjYAAAAAXRSTlMAQObYZgAAAQxJREFUOMuF1M3NgkAQBmA5WIL9UIIHBhIPfPevBIxlUAIHh3DkbBUWISWYmBj3ndl3lTXOQeXJzk/iLBsLkXKTRCHyLhKCz1vAngcsPg7wyM6hYoYFezKHGcyRJLJQpFByClZFzfqKqhHaHhBrHmZ8R+gMYpP/wdo4LJOBd9Wz9wU0Or5DrWrgY6j6ZIC76iWBv0Vf8XCo1aI3aPCIMmFyZITOgA4wRWgBc4SGJQAochZALDIQUKRPoM7CDNghxaH6AocsDIAtYFwAe0Cnc6tTCqPIYlD4H9kGKAHH18cNEEY9cacADCwMo1rBaulWa/lrkysuP0uwKi8mYX3F8peQOV8uMo/kXwYU+/UEaSw57h3Xy84AAAAASUVORK5CYII=" /></a>
          <a href="${ANIMEBYTES_SEARCH_URL}" target="_blank"><img width="20" height="20" title="AB" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAElBMVEUAAADtEGrwLXzzXJr3ibb5r827H5vkAAAAAXRSTlMAQObYZgAAAWZJREFUSMeFld1xhDAMhNc/945MCjgzKQCSBiAVXPpvJheMkS3L431iTp9XK3EeIGWXFT39PAFHb33q9RgAHPSvoNbpbQC6tLf185jNQOOxEU0ADGXNIvvleuT6ybN8OsIOMsaWT2ykW6QDAqC1MgjgFjKnT4YNQKmcfj23lDbdpohF5goIKE6xWxPTlIEeSo9YDe3aHmIrPoptWuIhALGt5x1rrV59FSLyEG2OcE/+qghTLNNfDx2LHVYDEDmlEYDoMXUAx8ChAsjAR94KOiFmRDGm2GbIAGRKCaxdIM/bmzMDUxeIeZxavxIIIwfqjEn307PztmD0lCQAGcK1AK2dv5QlrUdkwFPWS+tARZxJvRml264YUJkncIISsMQEN6gvBhMrHo4qsSFLAmYEuBGAOALMCMAQOEaAGwEwIwBDwLaVpQKwyfrsSqDdVgAE4KOoM6B4zLyd6uMubkADAPvXsnz7qusfG/ZZ3SUO5DgAAAAASUVORK5CYII=" /></a>
          <a href="${srrdbUrl + imdbId}" target="_blank"><img width="20" height="20" title="srrDB" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAUVBMVEUAAAAAAAAAAAAAAAAAAAC7u7v///+ZzP/Mmf+Z/5n/mZn//2b/mWaMjIxymL6Ycr5yvnK+cnK+vky+ckxUcY1xVI1nZ2dUjVSNVFSNjTiNVDi2juC+AAAABHRSTlN9PL4AffGBGQAAAMlJREFUWMPtlzcOwzAQBElLVKZy/v9DjXVBLK5Q4StkyJxygJ3uCNAk1qRfY2xi7CtV8LLGpCqw1/EJ7ENFDDvcOTXEdMIdY02MRwhgzwU47LkAhz0XQqASwDUCuFoQAzHwtIDqmPTnrOBJga0viX6Dm9ucaGe4pSuIbgkB7LkAhz0X4LDnQgiUArhcAFcIYiAGnhZQHJPunH/oRbo/sHpH+BXOu4xw/jKAPRfgsOfCZcAJ4DJBDMTAPwR0x6Q/53u/rkb9+VZ//9+xTWbto7vDzQAAAABJRU5ErkJggg==" /></a>
          <a href="${OMG_SEARCH_URL}" target="_blank"><img width="20" height="20" title="OMG" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAACxIAAAsSAdLdfvwAAAItSURBVDhP7ZQ5b9wwEIW/ISVK8q609toGDOQA4gAGfHRp0uT/d2nSB46DOMfa68XKuiVOinXWF5LCSZlHEMS84XvDYoZyfHikKvwzmFuzp7g+1piHxF0Iei9eFX9scheGtei+GBS9J1ZEV+djjnUh8/uKD/lf8Z9fLUdHR6riKWyJJEArxF2M9RZFqWyJJopXSOoI8YYyLrHpKu9rJagCki4CBDk4PtB+syMaxfh2IIwdaqH6XOLHnmSaoI1igwCbGK5mCybPMtqrDucc6j3xJCY/W2KvAuT1231tw5ZwHqJ4rAlpNhqmB1OWs5z+U0coIcYYejew+26H0/en7Fzu0mkLBoZwYOtkk8sPlxjZEWRusHuW6E2MOwiIi4jBDBRfronjiGargSmEvaX8WrL9apvedkhiiJ47AJYXOdnhBKMKgQSIGObnc+q6Ay90ZY/TEFUlyC3aKqpQz2oWxQJ34qikoMwrqr6ibweGuseE1yF+rPgfA2mZUp/W1K4mnAQoEEQOMYahH1AUYy1plFF8KxiNRtAoEREb2wn52TXGzz2T3QyZGobS47KQbD9l9vECUjAvhS7tsHuWLusIppY2b5CF0OYd3ijjw5T8e85Gk6zappeOIfNICt11z3AxkMQJ7oWjKAucddRVTbQRUy1LkjhBxgIC2ivFecm4HxEQrAxvm1RBQW4aVR9Nzyqnq0u33J3f5d4si8rajBvxw7Xm9XbfxR8/h6fgv+Hf4ycOpP6O76NlNwAAAABJRU5ErkJggg==" /></a>
        </div>
        <div><span class="uid">UID: ${uniqueId ? uniqueId : ''}</span></div>
        ` + mediainfoButtonHtml + `
        ` + uniqueIdButtonHtml + `
        ` + fileStructureButtonHtml + `
        ` + homeTrackerButtonHtml + `
        ` + (resolutionCheckButtonHtml ? resolutionCheckButtonHtml : '') + `</div>`;

        if(existingToolkit) {
            existingToolkit.innerHTML = toolkitDiv.innerHTML
        } else {
            document.body.appendChild(toolkitDiv);
        }

        /* ---------------------------------------------------------------------
        * BUTTON HANDLERS
        * ---------------------------------------------------------------------
        */

        // Helper function to store data with force load flag
        function storeDataForForceLoad() {
            if (uniqueId || file_structure) {
                GM_setValue("tmt_search_data", {
                    uniqueId: uniqueId || null,
                    filename: file_structure || null,
                    timestamp: Date.now(),
                    forceLoad: true,
                    showOnAither: false
                });
            }
        }

        // Copy entire mediainfo block
        document.getElementById("copyFullMediainfoBtn").addEventListener("click", () => {
            if (!activeTemplate) return showToast("No template for this site");

            if (!mediainfo) return showToast("Mediainfo not found");

            GM_setClipboard(mediainfo);
            showToast("Mediainfo copied");
        });

        // Copy Unique ID
        document.getElementById("copyUniqueIDBtn").addEventListener("click", () => {
            if (!activeTemplate) return showToast("No template for this site");

            if (!mediainfo) return showToast("No mediainfo found");

            if (!uniqueId) return showToast("Unique ID not found");

            GM_setClipboard(uniqueId);
            showToast(`Unique ID copied`);
        });

        // Copy file structure
        document.getElementById("copyFileStructureBtn").addEventListener("click", () => {
            if (!activeTemplate) return showToast("No template for this site")

            GM_setClipboard(file_structure);
            showToast(`File structure copied`);
        })

        // Go to home tracker
        document.getElementById("homeTrackerBtn").addEventListener("click", () => {
            if (!activeTemplate) return showToast("No template for this site")

            // Store data for comparison on the home tracker page (for all sites)
            if (uniqueId || file_structure) {
                // Ensure mediainfo is extracted if not already available
                const mediainfoToStore = mediainfo || (activeTemplate.extractMediainfo ? activeTemplate.extractMediainfo() : null);
                GM_setValue("tmt_search_data", {
                    uniqueId: uniqueId || null,
                    filename: file_structure || null,
                    mediainfo: mediainfoToStore || null,
                    timestamp: Date.now(),
                    fromHomeTrackerButton: true,
                    forceLoad: true, // Force load comparison data on destination page
                    showOnAither: false
                });
            }

            window.open(home_tracker_link, '_blank')
        })

        // ATH button - store data when clicked (from any tracker) to compare on Aither
        const athButton = document.getElementById("athButton");
        if (athButton) {
            athButton.addEventListener("click", (e) => {
                if (!activeTemplate) {
                    e.preventDefault();
                    return showToast("No template for this site");
                }

                // Filter filename to only include .mkv files and exclude samples
                const filteredFilename = file_structure ? filterMkvFilenames(file_structure) : null;

                if (uniqueId || filteredFilename) {
                    // Ensure mediainfo is extracted if not already available
                    const mediainfoToStore = mediainfo || (activeTemplate.extractMediainfo ? activeTemplate.extractMediainfo() : null);
                    GM_setValue("tmt_search_data", {
                        uniqueId: uniqueId || null,
                        filename: filteredFilename || null,
                        mediainfo: mediainfoToStore || null,
                        timestamp: Date.now(),
                        fromAthButton: true,
                        showOnAither: true
                    });
                    showToast("Data stored for Aither comparison");
                } else {
                    showToast("No data to store (UID or filename missing)");
                }
            });
        }

        // Check screenshot resolution
        const checkResolutionBtn = document.getElementById("checkResolutionBtn");
        if (checkResolutionBtn) {
            checkResolutionBtn.addEventListener("click", () => {
                if (!activeTemplate) return showToast("No template for this site")
                checkScreenshotResolutions();
            })
        }

        // hide toolkit button
        document.getElementById("toggleToolkitBtn").addEventListener("click", (event) => {
            const toolkitBody = document.querySelector("#torrentModToolkit div.body");
            const toggleButton = event.currentTarget;

            if(toolkitBody && !isHidden) {
                toolkitBody.hidden = true;
                isHidden = true;
                toggleButton.textContent = "▲";

            } else if(toolkitBody && isHidden) {
                toolkitBody.hidden = false;
                isHidden = false;
                toggleButton.textContent = "▼";
            }
        })

        // Refresh config button
        const refreshConfigBtn = document.getElementById("tmt-refresh-config");
        if (refreshConfigBtn) {
            refreshConfigBtn.addEventListener("click", (e) => {
                e.preventDefault();
                forceRefreshConfig();
            });
        }

        // Add click handlers to all tracker link buttons (PTP, BTN, HDB, BLU, BHD, srrDB, OMG, Animebytes)
        // ATH button already has its own handler above
        const trackerButtons = document.querySelectorAll('.center.pad a[target="_blank"]');
        trackerButtons.forEach(button => {
            // Skip ATH button as it has its own handler
            if (button.id === 'athButton') return;

            button.addEventListener("click", () => {
                storeDataForForceLoad();
            });
        });
    }

    /* ---------------------------------------------------------------------
     * SITE TEMPLATE DEFINITIONS
     * ---------------------------------------------------------------------
     *
     * Each template defines:
     *  - domains: string[] — array of domain names this template handles (optional, used with matchDomains helper)
     *  - matches(url): boolean — decides if this module handles the current site
     *  - extractMediainfo(): string|null — copy the mediainfo based on CSS selector or make separate HTML call to retreive it
     *  - extractFileStructure() : string|null — copy the torrent page's file list
     *  - extractIMDB() : string|null — finds the imdb id
     *  - extractReleaseGroup() : string|null — finds the release group, if present
     */

    function matchDomains(url, domains) {
        try {
            const urlObj = new URL(url);
            const hostname = urlObj.hostname.toLowerCase();
            return domains.some(domain => {
                const domainLower = domain.toLowerCase();
                return hostname === domainLower || hostname.endsWith('.' + domainLower);
            });
        } catch (e) {
            return domains.some(domain => url.toLowerCase().includes(domain.toLowerCase()));
        }
    }

    const siteTemplates = [
        {
            name: "General UNIT3D Template",
            domains: ["aither.cc", "blutopia.cc", "lst.gg", "upload.cx", "oldtoons.world", "hawke.uno"],
            matches: function(url) { return matchDomains(url, this.domains); },
            extractMediainfo: () => {
                let el = document.querySelector(".torrent-mediainfo-dump pre code[x-ref='mediainfo']");
                if (el) return el.innerText.trim();

                el = document.querySelector(".torrent-mediainfo-dump pre.decoda-code code") ||
                     document.querySelector(".torrent-mediainfo-dump .decoda-code code");
                if (el) return el.innerText.trim();

                // Fallback: any code element inside torrent-mediainfo-dump
                el = document.querySelector(".torrent-mediainfo-dump code");
                return el ? el.innerText.trim() : null;
            },
            extractFileStructure: () => {
                // Try standard UNIT3D file list selector
                let files = document.querySelectorAll("div[data-tab='list'] tr td:nth-child(2)");
                if (files && files.length > 0) {
                    return Array.from(files)
                        .map(file => file.innerText.trim())
                        .join("\n");
                }

                // Fallback: try alternative selectors for different UNIT3D versions
                files = document.querySelectorAll("div[data-tab='list'] td:nth-child(2)");
                if (files && files.length > 0) {
                return Array.from(files)
                    .map(file => file.innerText.trim())
                    .join("\n");
                }

                const modal = document.querySelector("#myModal") || document.querySelector(".modal");
                if (modal) {
                    // Try list tab first (table structure) - most reliable
                    files = modal.querySelectorAll("table.table-striped tbody tr td:nth-child(2)");
                    if (files && files.length > 0) {
                        return Array.from(files)
                            .map(file => file.innerText.trim())
                            .join("\n");
                    }

                    // Fallback: any table in modal
                    files = modal.querySelectorAll("table tbody tr td:nth-child(2)");
                    if (files && files.length > 0) {
                        return Array.from(files)
                            .map(file => file.innerText.trim())
                            .join("\n");
                    }

                    const allSpans = modal.querySelectorAll("details summary span");
                    const fileNames = [];
                    allSpans.forEach(span => {
                        const text = span.innerText.trim();
                        if (text && /\.(mkv|mp4|avi|mov|webm|m4v|flv|wmv|mpg|mpeg|ts|m2ts|vob|iso)$/i.test(text)) {
                            const match = text.match(/([^\n]+\.(mkv|mp4|avi|mov|webm|m4v|flv|wmv|mpg|mpeg|ts|m2ts|vob|iso))/i);
                            if (match) {
                                fileNames.push(match[1].trim());
                            } else {
                                fileNames.push(text);
                            }
                        }
                    });
                    if (fileNames.length > 0) {
                        return [...new Set(fileNames)].join("\n");
                    }
                }

                return null;
            },
            extractIMDB: () => {
                // Try standard UNIT3D selector first
                let el = document.querySelector("li.meta__imdb a");
                if (el) {
                    const match = el.href.match(/tt\d{7,8}/);
                    if (match) return match[0];
                }
                let mediainfoEl = document.querySelector(".torrent-mediainfo-dump pre code[x-ref='mediainfo']") ||
                                  document.querySelector(".torrent-mediainfo-dump pre.decoda-code code") ||
                                  document.querySelector(".torrent-mediainfo-dump .decoda-code code") ||
                                  document.querySelector(".torrent-mediainfo-dump code");
                if (mediainfoEl) {
                    const mediainfoText = mediainfoEl.innerText || mediainfoEl.textContent;
                    const imdbMatch = mediainfoText.match(/IMDB\s*:\s*(tt\d{7,8})/i);
                    if (imdbMatch) return imdbMatch[1];
                }

                return null;
            },
            extractReleaseGroup: () => {
                // Try standard UNIT3D title selector
                let title = document.querySelector("h1.torrent__name");

                // Fallback: try alternative selectors
                if (!title) {
                    title = document.querySelector("h1") ||
                            document.querySelector(".torrent-title h1") ||
                            document.querySelector("h2.torrent__name");
                }

                if(!title) return null;

                const trimmed = (title.innerText || title.textContent || "").trim();
                const parts = trimmed.split('-');
                if (parts.length > 0) {
                    const lastPart = parts[parts.length - 1].trim();
                    const match = lastPart.match(/^([A-Za-z0-9]+)/);
                return match ? match[1] : null;
            }
                return null;
            },
            extractTorrentType: () => {
                if (!window.location.hostname.includes('aither.cc')) {
                    return null;
                }
                const tvIcon = document.querySelector("i.fa-tv, i.torrent-icon[title*='TV'], i.torrent-icon[title*='Show']");
                if (tvIcon) {
                    return 'tv';
                }
                const movieIcon = document.querySelector("i.fa-film, i.fa-movie, i.torrent-icon[title*='Movie']");
                if (movieIcon) {
                    return 'movie';
                }
                const typeText = document.body.innerText || document.body.textContent || '';
                if (/TV[- ]?Show|Series/i.test(typeText)) {
                    return 'tv';
                }
                if (/Movie|Film/i.test(typeText)) {
                    return 'movie';
                }
                const url = window.location.href.toLowerCase();
                if (url.includes('/tv') || url.includes('/series')) {
                    return 'tv';
                }
                if (url.includes('/movie') || url.includes('/film')) {
                    return 'movie';
                }

                return null;
            }
        },

        {
            name: "BHD Template",
            domains: ["beyond-hd.me"],
            matches: function(url) { return matchDomains(url, this.domains); },
            extractMediainfo: () => {
                const inline_view = document.querySelector("div.table-torrents tr.libraryinline pre.decoda-code code");
                const torrent_page_view = document.querySelector("div#stats-full pre.decoda-code code");

                return inline_view ? inline_view.innerText.trim() : torrent_page_view ? torrent_page_view.innerText.trim() : null;
            },
            extractFileStructure: () => {
                const match = window.location.href.match(/torrents\/[^.]+\.(\d+)$/);
                if(!match) return null;
                let torrentId = match[1].trim();
                let files = document.querySelectorAll('#modal_torrent_files' + torrentId + ' table tr td:nth-child(2)')
                if(!files) return null;

                const fileNames = Array.from(files)
                    .map(file => {
                        const raw = (file.innerText || file.textContent || "").trim();
                        if (!raw) return null;
                        const extMatch = raw.match(/([^\n]+\.(mkv|mp4|avi|m4v|m2ts|ts|vob|iso))/i);
                        if (extMatch) {
                            return extMatch[1].trim();
                        }
                        if (/-[A-Za-z0-9]+$/.test(raw) && raw.includes('.')) {
                            return raw + '.mkv';
                        }
                        return raw;
                    })
                    .filter(Boolean);

                return fileNames.length > 0 ? fileNames.join("\n") : null;
            },
            extractIMDB: () => {
                const el = document.querySelector("a[title='IMDB']");
                if(!el) return null;
                const match = el.href.match(/tt\d{7,8}/)
                return match ? match[0] : null;
            },
            extractReleaseGroup: () => {
                const title = document.querySelector("div#stats-quick div.text-main span.text-main");
                if(!title) return null;

                const match = title.innerText.match(/-([A-Za-z0-9]+)(\.mkv|\.mp4)?$/);
                return match ? match[1] : null;
            }
        },

        {
            name: "BTN Template",
            domains: ["broadcasthe.net"],
            matches: function(url) { return matchDomains(url, this.domains); },
            extractMediainfo: () => {
                const urlParams = new URLSearchParams(window.location.search);
                const torrentId = urlParams.get('torrentid');

                // First try to find within the specific torrent row
                let blockquotes = [];
                if (torrentId) {
                    const torrentRow = document.querySelector(`tr#torrent_${torrentId}`);
                    if (torrentRow) {
                        blockquotes = torrentRow.querySelectorAll('blockquote');
                    }
                }

                // If not found, search all blockquotes
                if (blockquotes.length === 0) {
                    blockquotes = document.querySelectorAll('blockquote');
                }

                for (const blockquote of blockquotes) {
                    const text = blockquote.textContent || blockquote.innerText || '';
                    if (text.includes('Unique ID') && text.includes('General')) {
                        return text.trim();
                    }
                }
                return null;
            },
            extractFileStructure: () => {
                const urlParams = new URLSearchParams(window.location.search);
                const torrentId = urlParams.get('torrentid');

                // Extract filenames from table (BTN strips hyphens, so we need to restore them)
                if (torrentId) {
                    const fileTable = document.querySelector(`tr#torrent_${torrentId} table tbody`);
                    if (fileTable) {
                        const files = fileTable.querySelectorAll('tr:not(.colhead_dark) td:first-child');
                        if (files && files.length > 0) {
                            const filenames = Array.from(files)
                                .map(file => {
                                    let filename = file.innerText.trim();
                                    filename = filename.replace(/\s+/g, '-');
                                    return filename;
                                })
                                .filter(f => f && f.endsWith('.mkv'));

                            if (filenames.length > 0) {
                                return filenames.join("\n");
                            }
                        }
                    }
                }

                return null;
            },
            extractIMDB: () => {
                const tvdbElement = document.querySelector('li.meta__tvdb');
                if (!tvdbElement) return null;
                const link = tvdbElement.querySelector('a');
                if (!link || !link.href) return null;
                const match = link.href.match(/[?&]id=(\d+)/);
                return match ? match[1] : null;
            },
            extractReleaseGroup: () => {
                const titleCells = document.querySelectorAll('td[colspan="3"]');
                for (const cell of titleCells) {
                    const text = cell.innerText || cell.textContent || '';
                    const cleanText = text.replace(/^»\s*/, '').trim();
                    const match = cleanText.match(/-([A-Za-z0-9]+)$/);
                    if (match) return match[1];
                }

                return null;
            }
        },

        {
            name: "HDB Template",
            domains: ["hdbits.org"],
            matches: function(url) { return matchDomains(url, this.domains); },
            extractMediainfo: () => {
                const urlParams = new URLSearchParams(window.location.search);
                const torrentId = urlParams.get('id');
                if(!torrentId) return null;

                GM_xmlhttpRequest({
                    method: "GET",
                    url: 'https://hdbits.org/details/mediainfo?id=' + torrentId,
                    onload: function(response) {
                        if (response.status !== 200) {
                            console.error("Failed to fetch:", response.status);
                            return;
                        }

                        mediainfo = response.responseText;
                        uniqueId = extractUniqueId(mediainfo);
                        renderToolkit();

                        // Trigger comparison after mediainfo is loaded
                        setTimeout(() => {
                            autoCompareTorrents();
                        }, 500);
                    }
                });

                return null;
            },
            extractFileStructure: () => {
                // First try to get files from table#details (for multiple files)
                const detailsTable = document.querySelector('table#details');
                if (detailsTable) {
                    // Look for download links in the table
                    const downloadLinks = detailsTable.querySelectorAll('a.js-download, a[href*="/download.php/"]');
                    if (downloadLinks && downloadLinks.length > 0) {
                        const filenames = Array.from(downloadLinks)
                            .map(link => {
                                const href = link.getAttribute('href') || '';
                                const filenameMatch = href.match(/\/([^\/]+\.(mkv|mp4|avi|m4v))\.torrent/);
                                if (filenameMatch) {
                                    return filenameMatch[1];
                                }
                                // Fallback to text content
                                const text = link.textContent || link.innerText || '';
                                const filename = text.replace(/\.torrent$/, '').trim();
                                return filename;
                            })
                            .filter(f => f && (f.toLowerCase().endsWith('.mkv') || f.toLowerCase().endsWith('.mp4') || f.toLowerCase().endsWith('.avi') || f.toLowerCase().endsWith('.m4v')));
                        if (filenames.length > 0) {
                            return filenames.join("\n");
                        }
                    }
                }

                // Fallback: try collapsable file list block
                const blocks = [...document.querySelectorAll("div.collapsable")];
                const fileListBlock = blocks.find(el => el.textContent.includes("File list"));
                if (fileListBlock && fileListBlock.nextElementSibling?.classList.contains("hideablecontent")) {
                    let files = fileListBlock.nextElementSibling.querySelectorAll('tr td:first-child');
                    if(files && files.length > 0) {
                        const filenames = Array.from(files)
                        .map(file => file.innerText.trim())
                            .filter(f => f && (f.toLowerCase().endsWith('.mkv') || f.toLowerCase().endsWith('.mp4') || f.toLowerCase().endsWith('.avi') || f.toLowerCase().endsWith('.m4v')));

                        if (filenames.length > 0) {
                            return filenames.join("\n");
                        }
                    }
                }

                // Final fallback: try js-download class (for single file)
                const singleFileLink = document.querySelector('a.js-download');
                if (singleFileLink) {
                    const href = singleFileLink.getAttribute('href') || '';
                    const filenameMatch = href.match(/\/([^\/]+\.(mkv|mp4|avi|m4v))\.torrent/);
                    if (filenameMatch) {
                        return filenameMatch[1];
                    }
                    const text = singleFileLink.textContent || singleFileLink.innerText || '';
                    const filename = text.replace(/\.torrent$/, '').trim();
                    if (filename && (filename.toLowerCase().endsWith('.mkv') || filename.toLowerCase().endsWith('.mp4') || filename.toLowerCase().endsWith('.avi') || filename.toLowerCase().endsWith('.m4v'))) {
                        return filename;
                    }
                }

                return null;
            },
            extractIMDB: () => {
                const links = [...document.querySelectorAll('a')];
                const imdbLink = links.find(el => el.href.includes("imdb.com"));
                if(!imdbLink) return null;
                const match = imdbLink.href.match(/tt\d{7,8}/)
                return match ? match[0] : null;
            },
            extractReleaseGroup: () => {
                const title = document.querySelector("div.torrent-title h1");
                if(!title) return null;
                const match = title.innerText.match(/-([A-Za-z0-9]+)$/);
                return match ? match[1] : null;
            }
        },

        {
            name: "Z Network Template",
            domains: ["avistaz.to", "privatehd.to", "cinemaz.to"],
            matches: function(url) { return matchDomains(url, this.domains); },
            extractMediainfo: () => {
                const el = document.querySelector("div#collapseMediaInfo pre");
                return el ? el.textContent.trim() : null;
            },
            extractFileStructure: () => {
                // First, try to extract from script tag (privatehd.to loads files dynamically)
                const scripts = document.querySelectorAll('script:not([src])');
                for (const script of scripts) {
                    const scriptText = script.textContent || script.innerText;
                    const torrentFilesIndex = scriptText.indexOf('Torrent.torrentFiles');
                    if (torrentFilesIndex === -1) continue;
                    const commaIndex = scriptText.indexOf(',', torrentFilesIndex);
                    if (commaIndex === -1) continue;
                    let startIndex = scriptText.indexOf('[', commaIndex);
                    let isArray = true;
                    if (startIndex === -1) {
                        startIndex = scriptText.indexOf('{', commaIndex);
                        isArray = false;
                    }
                    if (startIndex === -1) continue;
                    let depth = 0;
                    let endIndex = startIndex;
                    const openChar = isArray ? '[' : '{';
                    const closeChar = isArray ? ']' : '}';
                    for (let i = startIndex; i < scriptText.length; i++) {
                        if (scriptText[i] === openChar) depth++;
                        if (scriptText[i] === closeChar) depth--;
                        if (depth === 0) {
                            endIndex = i + 1;
                            break;
                        }
                    }

                    if (endIndex > startIndex) {
                        try {
                            const jsonStr = scriptText.substring(startIndex, endIndex);
                            const fileData = JSON.parse(jsonStr);
                            const fileNames = [];

                            // Recursive function to extract filenames from children
                            function extractFiles(node) {
                                if (node.children && Array.isArray(node.children)) {
                                    for (const child of node.children) {
                                        if (child.children === false) {
                                            const textMatch = child.text.match(/<span class="file-name">([^<]+)<\/span>/);
                                            if (textMatch) {
                                                const filename = textMatch[1].trim();
                                                if (filename.toLowerCase().endsWith('.mkv')) {
                                                    fileNames.push(filename);
                                                }
                                            }
                                        } else if (child.children && Array.isArray(child.children)) {
                                            extractFiles(child);
                                        }
                                    }
                                }
                            }

                            // Handle both array (movies) and object (series) structures
                            if (Array.isArray(fileData)) {
                                // Movies: flat array structure
                                for (const item of fileData) {
                                    if (item.text) {
                                        const textMatch = item.text.match(/<span class="file-name">([^<]+)<\/span>/);
                                        if (textMatch) {
                                            const filename = textMatch[1].trim();
                                            if (filename.toLowerCase().endsWith('.mkv')) {
                                                fileNames.push(filename);
                                            }
                                        }
                                    }
                                }
                            } else if (fileData && typeof fileData === 'object') {
                                // Series: nested structure
                                extractFiles(fileData);
                            }

                            if (fileNames.length > 0) {
                                return fileNames.join("\n");
                            }
                        } catch (e) {
                            continue;
                        }
                    }
                }

                return null;
            },
            extractIMDB: () => {
                const links = [...document.querySelectorAll('a')];
                const imdbLink = links.find(el => el.href.includes("imdb.com"));
                if(!imdbLink) return null;
                const match = imdbLink.href.match(/tt\d{7,8}/)
                return match ? match[0] : null;
            },
            extractReleaseGroup: () => {
                const title = document.querySelector("a.torrent-filename");
                if(!title) return null;

                const match = title.innerText.match(/-([A-Za-z0-9]+)$/);
                return match ? match[1] : null;
            }
        },

        {
            name: "FL Template",
            domains: ["filelist.io"],
            matches: function(url) { return matchDomains(url, this.domains); },
            extractMediainfo: () => {
                const urlParams = new URLSearchParams(window.location.search);
                const torrentId = urlParams.get('id');
                if(!torrentId) return null;

                GM_xmlhttpRequest({
                    method: "GET",
                    url: 'https://filelist.io/mediainfo.php?id=' + torrentId,
                    onload: function(response) {
                        if (response.status !== 200) {
                            console.error("Failed to fetch:", response.status);
                            return;
                        }

                        const parser = new DOMParser();
                        const doc = parser.parseFromString(response.responseText, "text/html");
                        const el = doc.querySelector("div.cblock-innercontent");

                        if(!el) return null;

                        mediainfo = el.innerText;
                        uniqueId = extractUniqueId(mediainfo);
                        renderToolkit();
                    }
                });
            },
            extractFileStructure: () => {
                const fileSpans = [...document.querySelectorAll("div.cblock-innercontent > div > div > span")];
                const fileSpan = fileSpans.find(el => el.innerText.includes("Files"));
                if(!fileSpan) return null;
                const temp = document.createElement("div");
                temp.innerHTML = fileSpan.getAttribute('data-original-title');
                const files = temp.querySelectorAll("div[align='left']");
                return Array.from(files)
                    .map(file => file.innerText.trim())
                    .join("\n");
            },
            extractIMDB: () => {
                const links = [...document.querySelectorAll('a')];
                const imdbLink = links.find(el => el.href.includes("imdb.com"));
                if(!imdbLink) return null;
                const match = imdbLink.href.match(/tt\d{7,8}/)
                return match ? match[0] : null;
            },
            extractReleaseGroup: () => {
                const title = document.querySelector("div.cblock-header h4");
                if(!title) return null;

                const match = title.innerText.match(/-([A-Za-z0-9]+)$/);
                return match ? match[1] : null;
            }
        },

         {
            name: "ANT Template",
            domains: ["anthelion.me"],
            matches: function(url) { return matchDomains(url, this.domains); },
            extractMediainfo: () => {
                const visibleTorrentRow = document.querySelector(`tr[id^="torrent_"].pad:not(.hidden)`);
                if (!visibleTorrentRow) return null;
                const match = visibleTorrentRow.id.match(/torrent_(\d+)/);
                if (!match) return null;
                const torrentId = match[1];
                const el = document.querySelector(`tr#torrent_${torrentId} blockquote.mediainfoRaw`);
                return el ? el.textContent.trim() : null;
            },
            extractFileStructure: () => {
                const visibleTorrentRow = document.querySelector(`tr[id^="torrent_"].pad:not(.hidden)`);
                if (!visibleTorrentRow) return null;
                const match = visibleTorrentRow.id.match(/torrent_(\d+)/);
                if (!match) return null;
                const torrentId = match[1];
                const files = document.querySelectorAll(`div#files_${torrentId} tr.row td:first-child`);
                if (!files || files.length === 0) return null;

                const filenames = Array.from(files)
                    .map(file => file.textContent || file.innerText || "")
                    .map(f => f.trim())
                    .filter(f => f.toLowerCase().endsWith('.mkv') || f.toLowerCase().match(/\.(mkv|mp4|avi|m4v|m2ts|ts|vob|iso)$/i));

                return filenames.length > 0 ? filenames.join("\n") : null;
            },
            extractIMDB: () => {
                const links = [...document.querySelectorAll('a')];
                const imdbLink = links.find(el => el.href && el.href.includes("imdb.com"));
                if(!imdbLink) return null;
                const match = imdbLink.href.match(/tt\d{7,8}/)
                return match ? match[0] : null;
            },
            extractReleaseGroup: () => {
                const visibleTorrentRow = document.querySelector(`tr[id^="torrent_"].pad:not(.hidden)`);
                if (!visibleTorrentRow) return null;
                const match = visibleTorrentRow.id.match(/torrent_(\d+)/);
                if (!match) return null;
                const torrentId = match[1];

                const title = document.querySelector(`tr#torrent_${torrentId} div.spoilerContainer input.spoilerButton`);
                if(!title) return null;

                const release_name = title.value || title.textContent || "";
                const match2 = release_name.match(/-([A-Za-z0-9]+)(\.mkv|\.mp4|\.avi)?$/);
                return match2 ? match2[1] : null;
            },
            getDOMHook: () => {
                return document.querySelector('table.torrent_table, table#torrent-table');
            }
        },

        {
            name: "MTV Template",
            domains: ["morethantv.me", "www.morethantv.me"],
            matches: function(url) { return matchDomains(url, this.domains); },
            extractMediainfo: () => {
                const el = document.querySelector("div.body div.mediainfo");
                return el ? el.textContent.trim() : null;
            },
            extractFileStructure: () => {
                const fileListDivs = document.querySelectorAll('div[id^="files_"]');

                for (const fileListDiv of fileListDivs) {
                    const rows = fileListDiv.querySelectorAll('tr:not(.rowa):not(.smallhead)');
                    if (rows.length > 0) {
                        const filenames = Array.from(rows)
                            .map(row => {
                                const firstCell = row.querySelector('td:first-child');
                                return firstCell ? firstCell.innerText.trim() : null;
                            })
                            .filter(filename => filename && filename.toLowerCase().endsWith('.mkv'));

                        if (filenames.length > 0) {
                            return filenames.join("\n");
                        }
                    }
                }
                const files = document.querySelectorAll('div#content div.body div.hidden tr:not(.rowa) td:first-child');
                if (files && files.length > 0) {
                    const filenames = Array.from(files)
                    .map(file => file.innerText.trim())
                        .filter(filename => filename && filename.toLowerCase().endsWith('.mkv'));
                    if (filenames.length > 0) {
                        return filenames.join("\n");
                    }
                }

                return null;
            },
            extractIMDB: () => {
                const links = [...document.querySelectorAll('a')];
                const imdbLink = links.find(el => el.href && el.href.includes("imdb.com"));
                if (!imdbLink) return null;
                const match = imdbLink.href.match(/tt\d{7,8}/);
                return match ? match[0] : null;
            },
            extractReleaseGroup: () => {
                const title = document.querySelector("div.body h1, div.body h2");
                if (!title) return null;
                const match = title.innerText.match(/-([A-Za-z0-9]+)$/);
                return match ? match[1] : null;
            }
        },

        {
            name: "OMGWTFNZBS Template",
            domains: ["omgwtfnzbs.org", "www.omgwtfnzbs.org"],
            matches: function(url) {
                if (!matchDomains(url, this.domains)) return false;
                try {
                    const urlObj = typeof url === 'string' ? new URL(url) : url;
                    return urlObj.pathname && urlObj.pathname.includes('/details');
                } catch (e) {
                    return false;
                }
            },
            extractMediainfo: () => {
                const nfoPre = document.querySelector('div.horizontal-scroll-wrapper.nfo pre');
                return nfoPre ? nfoPre.textContent.trim() : null;
            },
            extractFileStructure: () => {
                const nfoPre = document.querySelector('div.horizontal-scroll-wrapper.nfo pre');
                if (!nfoPre) return null;

                const mediainfo = nfoPre.textContent.trim();
                if (!mediainfo) return null;
                const completeNameMatch = mediainfo.match(/Complete name\s*:\s*(.+)/i);
                if (completeNameMatch && completeNameMatch[1]) {
                    const filename = completeNameMatch[1].trim();
                    if (filename.toLowerCase().endsWith('.mkv')) {
                        return filename;
                    }
                }

                return null;
            },
            extractIMDB: () => {
                const links = [...document.querySelectorAll('a')];
                const imdbLink = links.find(el => el.href && el.href.includes("imdb.com"));
                if (!imdbLink) return null;
                const match = imdbLink.href.match(/tt\d{7,8}/);
                return match ? match[0] : null;
            },
            extractReleaseGroup: () => {
                const titleElement = document.querySelector('span.fls a, span.fls');
                if (titleElement) {
                    const titleText = (titleElement.innerText || titleElement.textContent || "").trim();
                    const match = titleText.match(/[-.]([A-Za-z0-9]+)$/);
                    if (match) return match[1];
                }
                const nfoPre = document.querySelector('div.horizontal-scroll-wrapper.nfo pre');
                if (nfoPre) {
                    const mediainfo = nfoPre.textContent.trim();
                    const completeNameMatch = mediainfo.match(/Complete name\s*:\s*(.+)/i);
                    if (completeNameMatch && completeNameMatch[1]) {
                        const filename = completeNameMatch[1].trim();
                        const match = filename.match(/[-.]([A-Za-z0-9]+)\.mkv$/i);
                        if (match) return match[1];
                    }
                }

                return null;
            }
        },

        {
            name: "HDT Template",
            domains: ["hd-torrents.org"],
            matches: function(url) { return matchDomains(url, this.domains); },
            extractMediainfo: () => {
                const el = document.querySelector("div#technicalInfoHideShowTR font[face='consolas']");
                return el ? el.textContent.trim() : null;
            },
            extractFileStructure: () => {
                const filesDiv = document.querySelector('#files table.detailsright');
                if (filesDiv) {
                    const fileRows = filesDiv.querySelectorAll('tbody tr');
                    if (fileRows && fileRows.length > 1) {
                        const filenames = Array.from(fileRows)
                            .slice(1)
                            .map(row => {
                                const filenameCell = row.querySelector('td.detailsright');
                                return filenameCell ? filenameCell.textContent.trim() : null;
                            })
                            .filter(f => f && f.toLowerCase().endsWith('.mkv'));

                        if (filenames.length > 0) {
                            return filenames.join("\n");
                        }
                    }
                }

                return null;
            },
            extractIMDB: () => {
                const links = [...document.querySelectorAll('a')];
                const imdbLink = links.find(el => el.href.includes("imdb.com"));
                if(!imdbLink) return null;
                const match = imdbLink.href.match(/tt\d{7,8}/)
                return match ? match[0] : null;
            },
            extractReleaseGroup: () => {
                const title = document.querySelector("div#technicalInfoHideShowTR center font[size='4']");
                if(!title) return null;
                const match = title.innerText.match(/-([A-Za-z0-9]+)$/);
                return match ? match[1] : null;
            }
        },

        {
            name: "Animebytes Template",
            domains: ["animebytes.tv"],
            matches: function(url) { return matchDomains(url, this.domains); },
            extractMediainfo: () => {
                let el = document.querySelector(`tr[id^="torrent_"].pad:not(.hide) div[id*="_mediainfo"] div.codeBox pre`);
                if (el) return el.textContent.trim();
                el = document.querySelector(`tr[id^="torrent_"].pad:not(.hide) div[id*="_mediainfo"] pre`);
                if (el) return el.textContent.trim();
                el = document.querySelector("tr.pad:not(.hide) pre.mediainfo, tr.pad:not(.hide) pre.code, tr.pad:not(.hide) code.mediainfo, tr.pad:not(.hide) .mediainfo pre, tr.pad:not(.hide) .mediainfo code");
                if (el) return el.textContent.trim();
                el = document.querySelector("tr.pad:not(.hide) div[id*='mediainfo'] pre, tr.pad:not(.hide) div[id*='mediainfo'] code, tr.pad:not(.hide) div[class*='mediainfo'] pre, tr.pad:not(.hide) div[class*='mediainfo'] code");
                if (el) return el.textContent.trim();
                return null;
            },
            extractFileStructure: () => {
                let files = document.querySelectorAll(`tr[id^="torrent_"].pad:not(.hide) table[id*="filelist_"] tr:not(.colhead_dark) td:first-child`);
                if (files && files.length > 0) {
                    const fileNames = Array.from(files)
                        .map(file => {
                            const text = file.textContent || file.innerText || "";
                            const trimmed = text.trim();
                            if (trimmed.toLowerCase().endsWith('.mkv') || trimmed.toLowerCase().match(/\.(mkv|mp4|avi|m4v|m2ts|ts|vob|iso)$/i)) {
                                return trimmed;
                            }
                            return null;
                        })
                        .filter(f => f !== null);

                    if (fileNames.length > 0) {
                        return fileNames.join("\n");
                    }
                }

                return null;
            },
            extractIMDB: () => {
                const links = [...document.querySelectorAll('a')];
                const imdbLink = links.find(el => el.href && el.href.includes("imdb.com"));
                if (imdbLink) {
                    const match = imdbLink.href.match(/tt\d{7,8}/);
                    if (match) return match[0];
                }
                const imdbText = document.body.innerText || document.body.textContent || "";
                const imdbMatch = imdbText.match(/IMDB[:\s]+(tt\d{7,8})/i);
                if (imdbMatch) return imdbMatch[1];
                return null;
            },
            extractReleaseGroup: () => {
                let title = document.querySelector(`tr[id^="torrent_"].pad:not(.hide) a.torrent-info-link`);
                if (!title) {
                    title = document.querySelector("div#technicalInfoHideShowTR center font[size='4']") ||
                           document.querySelector("span.group_title strong a") ||
                           document.querySelector("h1, h2");
                }
                if (!title) return null;

                const release_name = title.textContent || title.innerText || "";
                const match = release_name.match(/-([A-Za-z0-9]+)(\.mkv|\.mp4|\.avi)?$/);
                return match ? match[1] : null;
            },
            getDOMHook: () => {
                return document.querySelector('table.torrent_table, table#torrent-table');
            }
        },

        {
            name: "PTP Template",
            matches: (url) => url.includes("passthepopcorn.me"),
            extractMediainfo: () => {
                const el = document.querySelector(`tr[id^="torrent_"]:not(.hidden) table.mediainfo + blockquote.spoiler`);

                return el ? el.textContent.trim() : null;
            },
            extractFileStructure: () => {
                const files = document.querySelectorAll(`tr[id^="torrent_"]:not(.hidden) div[id^="files_"] tr td:first-child`);
                if (!files) return null;

                return Array.from(files)
                    .map(file => file.innerText.trim())
                    .join("\n");
            },
            extractIMDB: () => {
                const links = [...document.querySelectorAll('a')];
                const imdbLink = links.find(el => el.href.includes("imdb.com"));
                if (!imdbLink) return null;
                const match = imdbLink.href.match(/tt\d{7,8}/)
                return match ? match[0] : null;
            },
            extractReleaseGroup: () => {
                const title = document.querySelector(`tr[id^="torrent_"]:not(.hidden) di.movie-page__torrent__panel div.bbcode-table-guard > a`);
                if (!title) return null;

                release_name = title.value;
                const match = release_name.match(/-([A-Za-z0-9]+)(\.mkv|\.mp4|\.avi)?$/);
                return match ? match[1] : null;
            },
            getDOMHook: () => {
                return document.querySelector('table#torrent-table');
            }
        }

    ];

    /* ---------------------------------------------------------------------
     * SELECT TEMPLATE BASED ON URL, THEN LOAD DATA
     * ---------------------------------------------------------------------
     */

    const currentURL = window.location.href;
    if (currentURL.includes('/similar/') || currentURL.includes('/moderation')) {
        return;
    }
    const url = new URL(currentURL);
    const isAnimebytes = url.hostname.includes('animebytes.tv');
    const isPTP = url.hostname.includes('passthepopcorn.me');
    const hasNumericIdInPath = /\/(torrents?|details)\/\d+/.test(url.pathname) ||
                               /\/(torrents?|details)\/.*\.\d+$/.test(url.pathname) ||
                               (/\/(details|torrents)\.php/.test(url.pathname) && url.searchParams.has('id')) || // Works for all sites including Animebytes and PTP with just id parameter
                               (url.pathname.includes('/details') && url.searchParams.has('id')); // For omgwtfnzbs.org
    if (!hasNumericIdInPath) {
        return;
    }

    activeTemplate = siteTemplates.find((m) => m.matches(currentURL)) || null;
    if (!activeTemplate && isAnimebytes) {
        activeTemplate = siteTemplates.find((m) => m.name === "Animebytes Template") || null;
    }
    const isAnthelion = url.hostname.includes('anthelion.me');
    if (!activeTemplate && isAnthelion) {
        activeTemplate = siteTemplates.find((m) => m.name === "ANT Template") || null;
    }
    if (!activeTemplate && isPTP) {
        activeTemplate = siteTemplates.find((m) => m.name === "PTP Template") || null;
    }
    if(activeTemplate && !isAnimebytes && !isAnthelion) {
        mediainfo = activeTemplate.extractMediainfo();
        uniqueId = extractUniqueId(mediainfo);
        file_structure = activeTemplate.extractFileStructure();
        imdbId = activeTemplate.extractIMDB();
        const release_group = activeTemplate.extractReleaseGroup();
        const torrentType = activeTemplate.extractTorrentType ? activeTemplate.extractTorrentType() : null;
        buildHomeTrackerLink();
        const isAither = window.location.hostname.includes('aither.cc');
        if (isAither && (uniqueId || file_structure)) {
            const existingData = GM_getValue("tmt_search_data", null);
            if (!existingData || !existingData.showOnAither) {
                GM_setValue("tmt_search_data", {
                    uniqueId: uniqueId || null,
                    filename: file_structure || null,
                    timestamp: Date.now(),
                    fromHomeTrackerButton: false, // Stored automatically, not from button click
                    showOnAither: false // Don't show on Aither when auto-stored
                });
            }
        }
    }

    /* ---------------------------------------------------------------------
     * AUTOMATIC TORRENT COMPARISON ON HOME TRACKER
     * ---------------------------------------------------------------------
     * When navigating from another tracker, automatically find matching torrents
     * using stored Unique ID and filename
     */
    function autoCompareTorrents() {
        const searchData = GM_getValue("tmt_search_data", null);
        if (!searchData) return;

        const isAither = window.location.hostname.includes('aither.cc');
        const isAnimebytes = window.location.hostname.includes('animebytes.tv');
        const isAnthelion = window.location.hostname.includes('anthelion.me');
        const isPTP = window.location.hostname.includes('passthepopcorn.me');
        if (searchData.forceLoad || searchData.fromHomeTrackerButton) {
        } else if (isAither) {
            if (!searchData.showOnAither) {
                return;
            }
        }

        if (Date.now() - searchData.timestamp > 5 * 60 * 1000) {
            GM_setValue("tmt_search_data", null);
            return;
        }

        const url = new URL(window.location.href);
        const hasNumericIdInPath = /\/(torrents?|details)\/\d+/.test(url.pathname) ||
                                   /\/(torrents?|details)\/.*\.\d+$/.test(url.pathname) ||
                                   (/\/(details|torrents)\.php/.test(url.pathname) && url.searchParams.has('id')) || // Works for all sites with id parameter
                                   (url.pathname.includes('/details') && url.searchParams.has('id')); // For omgwtfnzbs.org

        // Only show on individual torrent pages (has numeric ID in path, not search results with just imdbId)
        const isIndividualTorrent = hasNumericIdInPath;
        if (!isIndividualTorrent) {
            return;
        }

        if (isAnimebytes || isAnthelion || isPTP) {
            let visibleTorrentRow = null;
            if (isPTP) {
                // PTP uses tr[id^="torrent_"]:not(.hidden) (no .pad class)
                visibleTorrentRow = document.querySelector(`tr[id^="torrent_"]:not(.hidden)`);
            } else {
                // Animebytes/Anthelion use .pad class
                visibleTorrentRow = document.querySelector(`tr[id^="torrent_"].pad:not(.hide)`);
                if (!visibleTorrentRow) {
                    visibleTorrentRow = document.querySelector(`tr[id^="torrent_"].pad:not(.hidden)`);
                }
            }
            if (!visibleTorrentRow && !mediainfo && !file_structure) {
                return;
            }
        }

        const { uniqueId: storedUniqueId, filename: storedFilename } = searchData;
        const showAndCompare = () => {
            setTimeout(() => {
                showStoredDataDisplay(searchData);
                findMatchingTorrent(storedUniqueId, storedFilename);
            }, 1000);
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', showAndCompare);
        } else {
            showAndCompare();
        }
    }

    function showStoredDataDisplay(searchData) {
        const existing = document.getElementById("tmt-stored-data-display");
        if (existing) existing.remove();
        const { uniqueId: storedUniqueId, filename: storedFilename } = searchData;
        if (!storedUniqueId && !storedFilename) return;
        let currentUniqueId = uniqueId || null;
        let currentFilename = file_structure || null;
        if (activeTemplate && (!currentUniqueId || !currentFilename)) {
            if (!currentUniqueId) {
                const currentMediainfo = mediainfo || activeTemplate.extractMediainfo();
                if (currentMediainfo) {
                    currentUniqueId = extractUniqueId(currentMediainfo);
                }
            }
            if (!currentFilename) {
                currentFilename = activeTemplate.extractFileStructure();
            }
        }

        // Compare Unique IDs (case-insensitive)
        let uidMatch = false;
        if (storedUniqueId && currentUniqueId) {
            uidMatch = storedUniqueId.toLowerCase() === currentUniqueId.toLowerCase();
        }

        // Compare filenames (case-sensitive - exact match required)
        let filenameMatch = false;
        if (storedFilename && currentFilename) {
            const storedNormalized = storedFilename.trim().replace(/\s+/g, ' ');
            const currentNormalized = currentFilename.trim().replace(/\s+/g, ' ');

            // Check for exact match (case-sensitive)
            if (storedNormalized === currentNormalized) {
                filenameMatch = true;
            } else {
                // Check if all stored filename lines exactly match lines in current (case-sensitive)
                const storedLines = storedFilename.split('\n').map(f => f.trim()).filter(f => f.length > 0);
                const currentLines = currentFilename.split('\n').map(f => f.trim()).filter(f => f.length > 0);

                if (storedLines.length > 0 && currentLines.length > 0) {
                    // Check if all stored lines exactly match lines in current (case-sensitive)
                    const allFound = storedLines.every(storedLine => {
                        return currentLines.some(currentLine => currentLine === storedLine);
                    });
                    filenameMatch = allFound;
                }
            }
        }

        const display = document.createElement("div");
        display.id = "tmt-stored-data-display";
        display.innerHTML = `
            <div class="header">
                <b>Stored Comparison Data</b>
                <button id="tmt-close-stored-data">×</button>
            </div>
            <div class="body">
                ${storedUniqueId ? `<div><span class="uid">UID: ${storedUniqueId}</span></div>` : ''}
                ${storedFilename ? `<div class="data-item"><strong>File:</strong> <pre>${storedFilename.split('\n')[0]}</pre></div>` : ''}
                <div class="comparison-boxes">
                    <div class="comparison-box ${uidMatch ? 'match' : 'no-match'}">
                        <div class="comparison-label">UID Match</div>
                        <div class="comparison-status">${uidMatch ? '✓ Match' : '✗ No Match'}</div>
                    </div>
                    <div class="comparison-box ${filenameMatch ? 'match' : 'no-match'}">
                        <div class="comparison-label">Filename Match</div>
                        <div class="comparison-status">${filenameMatch ? '✓ Match' : '✗ No Match'}</div>
                    </div>
                </div>
                <div style="margin-top: 5px;">
                    <button id="btnMediainfoDiff">Mediainfo Diff</button>
                </div>
            </div>
        `;

        document.body.appendChild(display);

        // Close button handler - also clear stored data so it doesn't show again
        document.getElementById("tmt-close-stored-data").addEventListener("click", () => {
            GM_setValue("tmt_search_data", null);
            display.remove();
        });

        document.getElementById("btnMediainfoDiff").addEventListener("click", () => {
            const storedMediainfo = (searchData.mediainfo && searchData.mediainfo !== "null") ? searchData.mediainfo : "";
            const currentMediainfo = activeTemplate.extractMediainfo() || "";

            const body = `mediainfo=${encodeURIComponent(storedMediainfo)}&mediainfo=${encodeURIComponent(currentMediainfo)}`;

            GM_xmlhttpRequest({
                method: "POST",
                url: 'https://mediainfo.okami.icu/diff/create',
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                data: body,
                responseType: "text",
                onload: function(response) {
                    const html = response.responseText;
                    const doc = new DOMParser().parseFromString(html, "text/html");
                    const meta = doc.querySelector('meta[property="og:url"]');
                    const diffUrl = meta ? meta.getAttribute("content") : response.finalUrl;
                    if (diffUrl) window.open(diffUrl, "_blank");
                }
            });
        });

        setTimeout(() => {
            if (display.parentNode) {
                display.remove();
            }
        }, 120000);
    }

    function findMatchingTorrent(storedUniqueId, storedFilename) {
        if (!activeTemplate) return;

        let score = 0;
        let matchFound = false;

        // Compare current page's data with stored data
        // Use global mediainfo if available (for async sources like HDB), otherwise extract
        const currentMediainfo = mediainfo || activeTemplate.extractMediainfo();
        const currentUniqueId = currentMediainfo ? extractUniqueId(currentMediainfo) : null;
        const currentFilename = activeTemplate.extractFileStructure();

        // Compare Unique IDs (perfect match)
        if (storedUniqueId && currentUniqueId) {
            if (storedUniqueId.toLowerCase() === currentUniqueId.toLowerCase()) {
                score += 100;
                matchFound = true;
                highlightTorrentPage();
                GM_setValue("tmt_search_data", null);
                return;
            }
        }

        // Compare filenames
        if (storedFilename && currentFilename) {
            const storedParts = storedFilename.split('\n').map(f => f.trim()).filter(f => f.length > 0);
            const currentParts = currentFilename.split('\n').map(f => f.trim()).filter(f => f.length > 0);

            // Check for exact filename matches
            for (const storedPart of storedParts) {
                for (const currentPart of currentParts) {
                    if (storedPart === currentPart) {
                        score += 50;
                        matchFound = true;
                    } else if (storedPart.length > 10 && currentPart.includes(storedPart)) {
                        score += 20;
                        matchFound = true;
                    }
                }
            }
        }

        // Also check the page title/name for matches
        const titleElement = document.querySelector("h1.torrent__name") || document.querySelector("h1") || document.querySelector(".torrent-title h1");
        if (titleElement && storedFilename) {
            const titleText = titleElement.textContent || titleElement.innerText || '';
            const storedParts = storedFilename.split('\n').map(f => f.trim()).filter(f => f.length > 0);

            for (const storedPart of storedParts) {
                if (storedPart.length > 10 && titleText.includes(storedPart)) {
                    score += 15;
                    matchFound = true;
                }
            }
        }

        if (matchFound && score > 0) {
            showToast(`Match found! (Score: ${score})`, 5000);
            highlightTorrentPage();
            GM_setValue("tmt_search_data", null);
            }
        }

    function highlightTorrentPage() {
        const mainContent = document.querySelector("main") ||
                           document.querySelector(".torrent-details") ||
                           document.querySelector("article") ||
                           document.body;

        // Add highlight style
        mainContent.style.outline = '4px solid #ff9800';
        mainContent.style.outlineOffset = '4px';
        mainContent.style.transition = 'outline 0.3s';

        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Remove highlight after 10 seconds
        setTimeout(() => {
            mainContent.style.outline = '';
            mainContent.style.outlineOffset = '';
        }, 10000);
    }

    // Auto-compare for all sites except Animebytes and Anthelion (they use MutationObserver)
    if (!isAnimebytes && !isAnthelion) {
        autoCompareTorrents();
    }

    /* ---------------------------------------------------------------------
     * SET STYLES FOR FLOATING TOOLBAR UI
     * ---------------------------------------------------------------------
     */

    GM_addStyle(`
      #torrentModToolkit {
          position: fixed !important;
          bottom: 20px !important;
          right: 20px !important;
          background-color: #1e2332 !important;
          color: #fff !important;
          padding: 10px 14px !important;
          border-radius: 8px !important;
          border: none !important;
          border-color: transparent !important;
          font-size: 14px !important;
          z-index: 999999 !important;
          box-shadow: 0 2px 8px rgba(0,0,0,0.35) !important;
          min-width: 250px !important;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
      }

      #torrentModToolkit,
      #torrentModToolkit div,
      #torrentModToolkit span,
      #torrentModToolkit p,
      #torrentModToolkit a,
      #torrentModToolkit label {
          color: #fff !important;
      }

      #torrentModToolkit a:link,
      #torrentModToolkit a:visited,
      #torrentModToolkit a:hover,
      #torrentModToolkit a:active {
          color: #fff !important;
      }

      #torrentModToolkit * {
          box-sizing: border-box !important;
      }

      #torrentModToolkit .body,
      #torrentModToolkit .header {
          background: transparent !important;
          background-color: transparent !important;
      }

      #torrentModToolkit button {
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
          cursor: arrow !important;
      }

      #torrentModToolkit .header {
          display: flex !important;
          flex-direction: row !important;
          align-items: center !important;
          gap: 8px !important;
          background: transparent !important;
      }

      #torrentModToolkit .header .center {
         flex: 1 !important;
         text-align: center !important;
      }

      #torrentModToolkit .header button {
          margin-left: auto !important;
          flex-basis: 12px !important;
          font-weight: bold !important;
          background: none !important;
          color: #fff !important;
      }

      #torrentModToolkit .header a {
          display: inline-block !important;
          text-decoration: none !important;
      }

      #torrentModToolkit .center {
          text-align: center !important;
      }

       #torrentModToolkit .pad {
          padding: 3px !important;
      }

      #torrentModToolkit .uid {
         font-size: 12px !important;
         color: #fff !important;
      }

      #torrentModToolkit * {
          box-sizing: border-box !important;
      }

      #torrentModToolkit button:not([disabled]):hover {
          background: #2d6cd3 !important;
          cursor: pointer !important;
      }

      #torrentModToolkit button[disabled] {
          background: #181C25 !important;
      }

      #tmt-toast-container {
            position: fixed;
            bottom: 180px;
            right: 20px;
            z-index: 9999999;
            display: flex;
            flex-direction: column;
            gap: 10px;
            pointer-events: none; /* let clicks pass through */
        }

        .tmt-toast {
            min-width: 180px;
            max-width: 300px;
            background: rgba(0,0,0,0.85);
            color: #fff;
            padding: 10px 14px;
            border-radius: 6px;
            font-size: 13px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.3s ease, transform 0.3s ease;
            pointer-events: auto;
        }

        .tmt-toast.show {
            opacity: 1;
            transform: translateY(0);
        }

        #tmt-stored-data-display {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #1e2332;
            color: #fff;
            padding: 0;
            border-radius: 9.6px;
            font-size: 15.6px;
            z-index: 999998;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
            min-width: 384px;
            max-width: 384px;
            overflow: hidden;
        }

        #tmt-stored-data-display .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 9.6px 14.4px;
            border-bottom: 1px solid #2e3445;
            background: #2e3445;
        }

        #tmt-stored-data-display .header b {
            font-size: 14.4px;
        }

        #tmt-stored-data-display .header button {
            background: none;
            border: none;
            color: #fff;
            font-size: 24px;
            cursor: pointer;
            padding: 0;
            width: 28.8px;
            height: 28.8px;
            line-height: 24px;
            border-radius: 4.8px;
        }

        #tmt-stored-data-display .header button:hover {
            background: #3e4455;
        }

        #tmt-stored-data-display .body {
            padding: 12px 14.4px;
        }

        #tmt-stored-data-display .data-item {
            margin-bottom: 4.8px;
        }

        #tmt-stored-data-display .data-item:last-child {
            margin-bottom: 0;
        }

        #tmt-stored-data-display .data-item strong {
            display: block;
            margin-bottom: 2.4px;
            color: #a0a0a0;
            font-size: 10.8px;
            text-transform: uppercase;
        }

        #tmt-stored-data-display code {
            background: #0d1117;
            color: #e0e0e0;
            padding: 2.4px 4.8px;
            border-radius: 3.6px;
            font-family: 'Courier New', monospace;
            font-size: 10.8px;
            word-break: break-all;
            display: inline-block;
            max-width: 100%;
            line-height: 1.44;
        }

        #tmt-stored-data-display pre {
            background: #0d1117;
            color: #e0e0e0;
            padding: 4.8px 7.2px;
            border-radius: 3.6px;
            font-family: 'Courier New', monospace;
            font-size: 10.8px;
            margin: 0;
            white-space: pre-wrap;
            word-wrap: break-word;
            line-height: 1.56;
            max-width: 100%;
        }

        #tmt-stored-data-display .uid {
            font-size: 14.4px;
        }

        #tmt-stored-data-display .comparison-boxes {
            display: flex;
            gap: 4.8px;
            margin-top: 4.8px;
        }

        #tmt-stored-data-display .comparison-box {
            flex: 1;
            padding: 3.6px 4.8px;
            border-radius: 3.6px;
            text-align: center;
            border: 1px solid;
            transition: all 0.3s;
        }

        #tmt-stored-data-display .comparison-box.match {
            background: rgba(76, 175, 80, 0.2);
            border-color: #4caf50;
        }

        #tmt-stored-data-display .comparison-box.no-match {
            background: rgba(244, 67, 54, 0.2);
            border-color: #f44336;
        }

        #tmt-stored-data-display .comparison-label {
            font-size: 10.8px;
            text-transform: uppercase;
            color: #a0a0a0;
            margin-bottom: 2.4px;
            font-weight: bold;
        }

        #tmt-stored-data-display .comparison-status {
            font-size: 13.2px;
            font-weight: bold;
        }

        #tmt-stored-data-display .comparison-box.match .comparison-status {
            color: #4caf50;
        }

        #tmt-stored-data-display .comparison-box.no-match .comparison-status {
            color: #f44336;
        }

        #tmt-stored-data-display .body button {
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
        }

        #tmt-stored-data-display .body button:hover {
            background: #2d6cd3 !important;
            background-color: #2d6cd3 !important;
        }

        #tmt-resolution-check-display {
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
            max-width: 500px;
            max-height: 500px;
            overflow-y: auto;
        }

        #tmt-resolution-check-display .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 14px;
            border-bottom: 1px solid #2e3445;
            background: #2e3445;
        }

        #tmt-resolution-check-display .header b {
            font-size: 14px;
        }

        #tmt-resolution-check-display .header button {
            background: none;
            border: none;
            color: #fff;
            font-size: 20px;
            cursor: pointer;
            padding: 0;
            width: 24px;
            height: 24px;
            line-height: 20px;
            border-radius: 4px;
        }

        #tmt-resolution-check-display .header button:hover {
            background: #3e4455;
        }

        #tmt-resolution-check-display .body {
            padding: 14px;
        }

        #tmt-resolution-check-display .data-item {
            margin-bottom: 12px;
        }

        #tmt-resolution-check-display .data-item strong {
            display: block;
            margin-bottom: 6px;
            color: #a0a0a0;
            font-size: 12px;
            text-transform: uppercase;
        }

        #tmt-resolution-check-display code {
            background: #0d1117;
            padding: 4px 8px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            font-size: 12px;
        }

        #tmt-resolution-check-display .image-results {
            margin-top: 12px;
        }

        #tmt-resolution-check-display .image-results strong {
            display: block;
            margin-bottom: 8px;
            color: #a0a0a0;
            font-size: 12px;
            text-transform: uppercase;
        }

        #tmt-resolution-check-display .image-result {
            padding: 6px 8px;
            margin-bottom: 4px;
            border-radius: 4px;
            font-size: 12px;
            font-family: 'Courier New', monospace;
        }

        #tmt-resolution-check-display .image-result.match {
            background: rgba(76, 175, 80, 0.2);
            color: #4caf50;
        }

        #tmt-resolution-check-display .image-result.no-match {
            background: rgba(244, 67, 54, 0.2);
            color: #f44336;
        }

        #tmt-resolution-check-display .image-result.error {
            background: rgba(158, 158, 158, 0.2);
            color: #9e9e9e;
        }
    `);

    setupToast();
    loadConfig(false);
    function initToolkit() {
        const isAnimebytes = window.location.hostname.includes('animebytes.tv');
        const isAnthelion = window.location.hostname.includes('anthelion.me');
        const isPTP = window.location.hostname.includes('passthepopcorn.me');
        if (isAnimebytes || isAnthelion || isPTP) {
            const renderAnimebytesAnthelionPTP = () => {
                if (document.body) {
                    let visibleTorrentRow = null;
                    if (isPTP) {
                        visibleTorrentRow = document.querySelector(`tr[id^="torrent_"]:not(.hidden)`);
                    } else {
                        visibleTorrentRow = document.querySelector(`tr[id^="torrent_"].pad:not(.hide)`);
                        if (!visibleTorrentRow) {
                            visibleTorrentRow = document.querySelector(`tr[id^="torrent_"].pad:not(.hidden)`);
                        }
                    }
                    if (visibleTorrentRow && activeTemplate) {
                        mediainfo = activeTemplate.extractMediainfo();
                        uniqueId = extractUniqueId(mediainfo);
                        file_structure = activeTemplate.extractFileStructure();
                        imdbId = activeTemplate.extractIMDB();
                        const release_group = activeTemplate.extractReleaseGroup();
                        const torrentType = activeTemplate.extractTorrentType ? activeTemplate.extractTorrentType() : null;
                        buildHomeTrackerLink();
                        const isAither = window.location.hostname.includes('aither.cc');
                        if (isAither && (uniqueId || file_structure)) {
                            const existingData = GM_getValue("tmt_search_data", null);
                            if (!existingData || !existingData.showOnAither) {
                                GM_setValue("tmt_search_data", {
                                    uniqueId: uniqueId || null,
                                    filename: file_structure || null,
                                    timestamp: Date.now(),
                                    fromHomeTrackerButton: false,
                                    showOnAither: false
                                });
                            }
                        }

                        // Now that we have data, run the comparison
                        autoCompareTorrents();
                    }
                    // Render toolkit (with or without data)
                    renderToolkit();
                    const torrentTable = document.querySelector('table.torrent_table, table#torrent-table');
                    let observerKey = 'tmtObserver';
                    if (isAnimebytes) {
                        observerKey = 'tmtAnimebytesObserver';
                    } else if (isAnthelion) {
                        observerKey = 'tmtAnthelionObserver';
                    } else if (isPTP) {
                        observerKey = 'tmtPTPObserver';
                    }
                    if (torrentTable && !window[observerKey]) {
                        window[observerKey] = new MutationObserver(() => {
                            let newVisibleRow = null;
                            if (isPTP) {
                                // PTP uses tr[id^="torrent_"]:not(.hidden) (no .pad class)
                                newVisibleRow = document.querySelector(`tr[id^="torrent_"]:not(.hidden)`);
                            } else {
                                // Animebytes/Anthelion use .pad class
                                newVisibleRow = document.querySelector(`tr[id^="torrent_"].pad:not(.hide)`);
                                if (!newVisibleRow) {
                                    newVisibleRow = document.querySelector(`tr[id^="torrent_"].pad:not(.hidden)`);
                                }
                            }
                            if (newVisibleRow && activeTemplate) {
                                mediainfo = activeTemplate.extractMediainfo();
                                uniqueId = extractUniqueId(mediainfo);
                                file_structure = activeTemplate.extractFileStructure();
                                imdbId = activeTemplate.extractIMDB();
                                const release_group = activeTemplate.extractReleaseGroup();
                                const torrentType = activeTemplate.extractTorrentType ? activeTemplate.extractTorrentType() : null;
                                buildHomeTrackerLink();

                                const isAither = window.location.hostname.includes('aither.cc');
                                if (isAither && (uniqueId || file_structure)) {
                                    const existingData = GM_getValue("tmt_search_data", null);
                                    if (!existingData || !existingData.showOnAither) {
                                        GM_setValue("tmt_search_data", {
                                            uniqueId: uniqueId || null,
                                            filename: file_structure || null,
                                            timestamp: Date.now(),
                                            fromHomeTrackerButton: false,
                                            showOnAither: false
                                        });
                                    }
                                }

                                // Re-render toolkit with new data
                                renderToolkit();

                                // Run comparison now that we have data from the visible torrent
                                autoCompareTorrents();
                            }
                        });

                        // Observe the torrent table for changes
                        window[observerKey].observe(torrentTable, {
                            childList: true,
                            subtree: true,
                            attributes: true,
                            attributeFilter: ['class', 'style']
                        });
                    }
                } else {
                    // Retry if body doesn't exist yet
                    setTimeout(renderAnimebytesAnthelionPTP, 100);
                }
            };

            // Small delay to ensure dynamic content is loaded
            setTimeout(renderAnimebytesAnthelionPTP, 200);
        } else {
            if (document.body) {
                renderToolkit();
            } else {
                if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', renderToolkit);
                } else {
                    setTimeout(initToolkit, 100);
                }
            }
        }
    }

    initToolkit();


})();