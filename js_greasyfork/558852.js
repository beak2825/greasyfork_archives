// ==UserScript==
// @name         R34 Download Sorter
// @namespace    http://tampermonkey.net/
// @Author       Silk
// @version      6.21
// @description  Full Feature Set: Sorter, Mass Downloader, Focus Editor. Works on R34, Gelbooru, Safebooru, Realbooru, Xbooru, TBIB, Yande.re, Konachan, Rule34.us, E621.
// @match        https://rule34.xxx/*
// @match        https://safebooru.org/*
// @match        https://gelbooru.com/*
// @match        https://realbooru.com/*
// @match        https://xbooru.com/*
// @match        https://tbib.org/*
// @match        https://yande.re/*
// @match        https://konachan.com/*
// @match        https://konachan.net/*
// @match        https://rule34.us/*
// @match        https://e621.net/*
// @match        https://e926.net/*
// @grant        GM_download
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_info
// @downloadURL https://update.greasyfork.org/scripts/558852/R34%20Download%20Sorter.user.js
// @updateURL https://update.greasyfork.org/scripts/558852/R34%20Download%20Sorter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- DEFAULTS ---
    const DEFAULT_ROOT = "Booru_Downloads";
    const DEFAULT_RULES = `invisible_woman = Marvel/Invisible Woman`;
    const DEFAULT_FILENAME = "%artist% - %md5%.%ext%";
    const DEFAULT_SERIES_MAP = "overwatch_2 = Overwatch";
    const DEFAULT_CUSTOM_PATH = "%root%/%type%/%series%/%char%/%filename%";

    const DEFAULT_IGNORED_SERIES = "blizzard_entertainment\nnintendo\noriginal\nart_stream\nvideo_game_mechanics";
    const DEFAULT_IGNORED_CHARACTERS = "human\nelf\ndwarf\nunknown_character\noriginal_character\navatar_(player)";
    const DEFAULT_IGNORED_ARTISTS = "unknown_artist\nanonymous\ncommentary\nvoice_actor\neditor\ntranslator";

    const DEFAULT_TAGS_3D = "3d_animation\n3d_(artwork)\n3d\nsource_filmmaker\nsfm\nblender\ndaz_studio\ndaz3d\ndaz\nmikumikudance\nmmd\nxnalara\nkoikatsu\nhoney_select\nhoney_select_2\nvirt_a_mate\nvam\nunreal_engine\nunity\nmaya\ncinema_4d\n3d_scan";

    // --- HELPERS ---
    const normalizeTag = (str) => str.trim().toLowerCase().replace(/ /g, '_').replace(/[:\\/]/g, '');
    const stripSlashes = (str) => str.replace(/\//g, '').trim();

    function toTitleCase(str) {
        return str.replace(/_/g, ' ').replace(/\w\S*/g, (txt) => {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }

    function sanitizeFilename(str) {
    if (!str) return "";
    return str
        .replace(/[\\/:*?"<>|]/g, '')
        .replace(/\s+/g, ' ') // Collapse multiple spaces
        .replace(/^\.+|\.+$/g, '') // Remove leading/trailing periods
        .trim();
    }

    function getIdFromUrl(href) {
        if (!href) return null;
        const idMatch = href.match(/(?:id=|posts\/show\/|posts\/|r=posts\/view&id=)(\d+)/);
        if (idMatch && idMatch[1]) return idMatch[1];
        if (href.includes('/post/show/')) return href.split('/post/show/')[1].split('/')[0].split('?')[0];
        if (href.includes('/index.php/') && href.split('/').length > 0) return href.split('/').pop();
        return null;
    }

    function isMoebooru() {
        const h = window.location.hostname;
        return h.includes('yande.re') || h.includes('konachan');
    }

    function isRule34Us() {
        return window.location.hostname.includes('rule34.us');
    }

    function isE621() {
        return window.location.hostname.includes('e621.net') || window.location.hostname.includes('e926.net');
    }

    // --- DATA MANAGEMENT ---
    function loadRules() {
        const raw = GM_getValue('tag_rules', DEFAULT_RULES);
        const groups = {};
        if (!raw) return groups;
        const lines = raw.split('\n');
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line || line.startsWith('#')) continue;
            const parts = line.split('=');
            if (parts.length === 2) {
                const tag = parts[0].trim();
                const folder = parts[1].trim();
                if (!groups[folder]) groups[folder] = [];
                if (groups[folder].indexOf(tag) === -1) groups[folder].push(tag);
            }
        }
        return groups;
    }

    function saveRules(groups) {
        let lines = [];
        const sortedKeys = Object.keys(groups).sort();
        for (const folder of sortedKeys) {
            groups[folder].forEach(tag => lines.push(`${tag} = ${folder}`));
        }
        GM_setValue('tag_rules', lines.join('\n'));
    }

    function loadSeriesMap() {
        const raw = GM_getValue('series_map', DEFAULT_SERIES_MAP);
        const map = {};
        if (!raw) return map;
        raw.split('\n').forEach(line => {
            const parts = line.split('=');
            if (parts.length === 2) map[parts[0].trim()] = parts[1].trim();
        });
        return map;
    }

    function saveSeriesMap(mapStr) { GM_setValue('series_map', mapStr); }
    function getSeriesAlias(tag) { return loadSeriesMap()[tag] || null; }

    function getTagsForSeries(seriesName) {
        const map = loadSeriesMap();
        return Object.keys(map).filter(tag => map[tag] === seriesName);
    }

    function updateSeriesAliases(seriesName, newTagsArray) {
        const map = loadSeriesMap();
        Object.keys(map).forEach(key => { if (map[key] === seriesName) delete map[key]; });
        newTagsArray.forEach(tag => { const clean = normalizeTag(tag); if (clean) map[clean] = seriesName; });
        const lines = [];
        Object.entries(map).forEach(([tag, series]) => lines.push(`${tag} = ${series}`));
        saveSeriesMap(lines.join('\n'));
    }

    function loadList(key, def) {
        return new Set(GM_getValue(key, def).split('\n').map(t => normalizeTag(t)).filter(t => t.length > 0));
    }
    function loadIgnoredSeries() { return loadList('ignored_series', DEFAULT_IGNORED_SERIES); }
    function loadIgnoredCharacters() { return loadList('ignored_characters', DEFAULT_IGNORED_CHARACTERS); }
    function loadIgnoredArtists() { return loadList('ignored_artists', DEFAULT_IGNORED_ARTISTS); }
    function load3DTags() { return loadList('tags_3d', DEFAULT_TAGS_3D); }


    // --- LOGIC: MERGE & RENAME ---
    function renameUniverse(oldName, newName) {
        const rules = loadRules();
        const newRules = {};
        let changed = false;
        Object.entries(rules).forEach(([path, tags]) => {
            let finalPath = path;
            const parts = path.split('/');
            const currentUni = parts.length > 1 ? parts[0] : "Uncategorized";
            if (currentUni === oldName) {
                const remainder = parts.slice(1).join('/');
                finalPath = newName ? `${newName}/${remainder}` : remainder;
                changed = true;
            }
            if (newRules[finalPath]) {
                tags.forEach(t => { if (!newRules[finalPath].includes(t)) newRules[finalPath].push(t); });
            } else { newRules[finalPath] = tags; }
        });
        if (changed && newName) {
            const seriesTags = getTagsForSeries(oldName);
            if(seriesTags.length > 0) updateSeriesAliases(newName, seriesTags);
            saveRules(newRules);
        }
        return changed;
    }

    function updateEntryPath(oldPath, newPath) {
        const rules = loadRules();
        if (!rules[oldPath]) return false;
        const tagsToMove = rules[oldPath];
        delete rules[oldPath];
        if (rules[newPath]) {
            tagsToMove.forEach(t => { if (!rules[newPath].includes(t)) rules[newPath].push(t); });
        } else { rules[newPath] = tagsToMove; }
        saveRules(rules);
        return true;
    }

    function updateTagsForPath(path, newTagArray) {
        const rules = loadRules();
        if(rules[path]) {
            const cleanTags = [...new Set(newTagArray.map(t => normalizeTag(t)).filter(t => t.length > 0))];
            rules[path] = cleanTags;
            saveRules(rules);
        }
    }

    function removeTagFromPath(path, tagToRemove) {
        const rules = loadRules();
        if(rules[path]) {
            rules[path] = rules[path].filter(t => t !== tagToRemove);
            if(rules[path].length === 0) delete rules[path];
            saveRules(rules);
        }
    }

    function promoteTagToSubfolder(currentPath, tagToPromote, newSubfolderName) {
        const rules = loadRules();
        if(!rules[currentPath]) return;
        rules[currentPath] = rules[currentPath].filter(t => t !== tagToPromote);
        if(rules[currentPath].length === 0) delete rules[currentPath];
        const newPath = currentPath + "/" + newSubfolderName;
        if(!rules[newPath]) rules[newPath] = [];
        rules[newPath].push(tagToPromote);
        saveRules(rules);
    }

    // --- SCRAPERS & INFO ---
    function getPageMD5(doc = document) {
        const sidebar = doc.querySelector('#tag-sidebar, #tag-list, .sidebar, .content_left, .tag-list-left, #post-information');
        if (sidebar) {
            const textMatch = sidebar.textContent.match(/md5:\s*([a-f0-9]{32})/i);
            if (textMatch && textMatch[1]) return textMatch[1].toLowerCase();
        }
        if (isE621()) {
            const metaMD5 = doc.querySelector('meta[property="og:image:url"], meta[property="og:video:url"]');
            if (metaMD5 && metaMD5.content) {
                const urlParts = metaMD5.content.split('/');
                const filename = urlParts[urlParts.length - 1];
                const possibleMd5 = filename.split('.')[0];
                if (/^[a-f0-9]{32}$/i.test(possibleMd5)) return possibleMd5.toLowerCase();
            }
        }
        const links = doc.querySelectorAll('a[href*="/image/"], a[href*="/file/"], a[href*="id="]');
        for (let link of links) {
            const filename = link.href.split('/').pop();
            const possibleMd5 = filename.split('.')[0];
            if (/^[a-f0-9]{32}$/i.test(possibleMd5)) return possibleMd5.toLowerCase();
        }
        return null;
    }

    function isDownloaded(md5) {
        if (!GM_getValue('enable_md5_tracking', true)) return false;
        return md5 && GM_getValue('md5_history', []).includes(md5);
    }

    function addToHistory(md5) {
        if (!md5) return;
        if (!GM_getValue('enable_md5_tracking', true)) return;
        const history = GM_getValue('md5_history', []);
        if (!history.includes(md5)) {
            history.push(md5);
            GM_setValue('md5_history', history);
        }
    }

    function getTagsByType(type, doc = document) {
        let selector = `.tag-type-${type} a, li.tag-type-${type} a`;
        if (type === 'character') selector += `, a.model`;
        if (isRule34Us()) selector += `, li.${type}-tag a`;

        const allLinks = doc.querySelectorAll(selector);
        const cleanTags = [];

        // E621 specific data attributes with URI decoding fix
        if (isE621()) {
            let e621Type = type;
            if(type === 'general') e621Type = 'general';
            if(type === 'copyright') e621Type = 'copyright';
            if(type === 'character') e621Type = 'character';
            if(type === 'artist') e621Type = 'artist';
            if(type === 'metadata') e621Type = 'meta';

            const e621Items = doc.querySelectorAll(`li.tag-${e621Type}`);
            e621Items.forEach(li => {
                if (li.dataset.name) cleanTags.push(normalizeTag(decodeURIComponent(li.dataset.name)));
            });
            if(cleanTags.length > 0) return cleanTags;
        }

        allLinks.forEach(link => {
            if (link.href && link.href.includes('/wiki/')) return;
            const text = link.textContent.trim();
            if (text === '?' || text === '+' || text === '-' || text.length === 0) return;
            const tagMatch = text.match(/^(.*?)( \(\d+\))?$/);
            if (tagMatch && tagMatch[1]) {
                cleanTags.push(tagMatch[1]);
            }
        });
        return cleanTags;
    }

    function getAllTags(doc = document) {
        // E621 specific extraction via data-attributes with URI decoding
        if (isE621()) {
            const listItems = doc.querySelectorAll('li.tag-list-item');
            if (listItems.length > 0) {
                return Array.from(listItems).map(li => normalizeTag(decodeURIComponent(li.dataset.name))).filter(t => t);
            }
        }

        const els = doc.querySelectorAll(
            '#tag-sidebar li a, #tag-list li a, .sidebar li a, ' +
            '.content_left li a, .tag-list-left li a, ' +
            '#post-information li a, ' +
            '.tag-type-general a, .tag-type-artist a, .tag-type-character a, .tag-type-copyright a, .tag-type-metadata a'
        );
        return [...new Set(Array.from(els).map(el => {
            const text = el.textContent.trim();
            const tagMatch = text.match(/^(.*?)( \(\d+\))?$/);
            if (tagMatch && tagMatch[1] && tagMatch[1] !== '+' && tagMatch[1] !== '-') {
                return normalizeTag(tagMatch[1]);
            }
            return '';
        }).filter(t => t.length > 1))];
    }

    function getAllTagsWithTypes(doc = document) {
        const results = [];
        const types = ['character', 'copyright', 'artist', 'metadata', 'general'];
        types.forEach(type => {
            const rawTags = getTagsByType(type, doc);
            rawTags.forEach(text => {
                results.push({ text: text, normalized: normalizeTag(text), type: type });
            });
        });
        return results;
    }

    function getAllCharacterTagsOnPage(doc = document) {
        const raw = getTagsByType('character', doc).map(t => normalizeTag(t));
        const ignored = loadIgnoredCharacters();
        return raw.filter(t => !ignored.has(t));
    }

    function getAllCharacterTagsRaw(doc = document) {
        const pageCharTags = getTagsByType('character', doc).map(t => normalizeTag(t));
        const ignoredChars = loadIgnoredCharacters();
        return pageCharTags.filter(tag => !ignoredChars.has(tag));
    }

    function getUnknownCharacterTags(doc = document) {
        const rules = loadRules();
        const pageCharTags = getAllCharacterTagsRaw(doc);
        const ignoredChars = loadIgnoredCharacters();
        const knownTags = new Set();
        const wildcardRules = [];
        Object.values(rules).forEach(list => {
            list.forEach(t => {
                if (t.includes('*')) wildcardRules.push(t); else knownTags.add(t);
            });
        });
        return pageCharTags.filter(tag => {
            if (ignoredChars.has(tag)) return false;
            if (knownTags.has(tag)) return false;
            for (const rule of wildcardRules) {
                const regexStr = '^' + rule.split('*').map(s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('.*') + '$';
                if (new RegExp(regexStr).test(tag)) return false;
            }
            return true;
        });
    }

    function detectImageType(doc) {
        const allTags = getAllTagsWithTypes(doc).map(t => t.normalized);
        const tags3d = load3DTags();
        if(allTags.some(t => tags3d.has(t))) return "3D";
        return "2D";
    }

    function getAllSeriesMatches(doc = document) {
        const rawCopyrights = getTagsByType('copyright', doc);
        const blocked = loadIgnoredSeries();
        const matches = new Set();
        for (let raw of rawCopyrights) {
            let tag = normalizeTag(raw);
            if (blocked.has(tag)) continue;
            const mapped = getSeriesAlias(tag);
            if (mapped) {
                matches.add(mapped);
            } else {
                const cleanName = sanitizeFilename(stripSlashes(toTitleCase(tag)));
                if (cleanName.length > 0) matches.add(cleanName);
            }
        }
        return Array.from(matches);
    }

    function getBestSeriesMatch(doc = document) {
        const matches = getAllSeriesMatches(doc);
        return matches.length > 0 ? matches[0] : null;
    }

    // --- LOGIC: TARGETING ---
    function getTargetFolder(doc = document) {
        const rules = loadRules();
        const charTags = getAllCharacterTagsRaw(doc);
        const mappedChars = new Set();
        let matched = new Set();

        for (const [folder, tags] of Object.entries(rules)) {
            let ruleMatchFound = false;
            tags.forEach(t => {
                if(charTags.includes(t)) { mappedChars.add(t); ruleMatchFound = true; }
                else if (t.includes('*')) {
                    const regexStr = '^' + t.split('*').map(s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('.*') + '$';
                    const regex = new RegExp(regexStr);
                    const matches = charTags.filter(charTag => regex.test(charTag));
                    if (matches.length > 0) { matches.forEach(m => mappedChars.add(m)); ruleMatchFound = true; }
                }
            });
            if (ruleMatchFound) matched.add(folder);
        }

        const unmappedChars = charTags.filter(c => !mappedChars.has(c));
        let arr = Array.from(matched);
        arr = arr.filter(path => !arr.some(otherPath => otherPath !== path && otherPath.startsWith(path + "/")));
        arr.sort();

        if (arr.length > 0) {
            let finalPath = "";
            let seriesRep = "";
            if (arr.length === 1) {
                const parts = arr[0].split('/'); seriesRep = parts.length > 1 ? parts[0] : ""; finalPath = arr[0];
            } else {
                const splitPaths = arr.map(p => p.split('/'));
                const uniqueUniverses = new Set(); const names = [];
                splitPaths.forEach(parts => {
                    if (parts.length > 1) { uniqueUniverses.add(parts[0]); names.push(parts.slice(1).join(' ')); } else { names.push(parts[0]); }
                });
                const sortedUniverses = Array.from(uniqueUniverses).sort();
                const sortedNames = names.sort().join(' & ');
                if (sortedUniverses.length > 0) { finalPath = `${sortedUniverses.join(' & ')}/${sortedNames}`; } else { finalPath = sortedNames; }
                seriesRep = sortedUniverses.length > 0 ? sortedUniverses.join(' & ') : "";
            }
            return { name: finalPath, type: "match", series: seriesRep, unmapped: unmappedChars };
        }

        const uncategorizedMode = GM_getValue('uncategorized_mode', 'default');
        const autoSeries = getBestSeriesMatch(doc);
        const bestChar = charTags.length > 0 ? charTags.map(c => toTitleCase(c)).join(' & ') : null;

        if (uncategorizedMode === 'artist') {
            const ignoredArtists = loadIgnoredArtists();
            const artists = getTagsByType('artist', doc).map(a => normalizeTag(a)).filter(a => !ignoredArtists.has(a));
            const artistName = artists.length > 0 ? toTitleCase(artists[0]) : GM_getValue('fallback_artist_name', 'Unknown Artist');
            return { name: bestChar ? stripSlashes(bestChar) : stripSlashes(artistName), type: 'auto', series: stripSlashes(artistName) };
        }

        if (autoSeries) {
             let folderName = autoSeries;
             if(bestChar) folderName += "/" + stripSlashes(bestChar);
             return { name: folderName, type: "auto", series: autoSeries };
        }
        if (bestChar) { return { name: stripSlashes(bestChar), type: "auto", series: "" }; }
        return { name: "Uncategorized", type: "none", series: "" };
    }

    function generateFilename(doc, id, md5) {
        const pattern = GM_getValue('filename_pattern', DEFAULT_FILENAME);
        const ignoredArtists = loadIgnoredArtists();
        const artists = getTagsByType('artist', doc).filter(a => !ignoredArtists.has(normalizeTag(a)));
        const characters = getTagsByType('character', doc); const copyrights = getTagsByType('copyright', doc);
        const fallbackArtist = GM_getValue('fallback_artist_name', 'Unknown Artist');
        const artistStr = artists.length > 0 ? toTitleCase(artists[0]) : fallbackArtist;
        const charStr = characters.length > 0 ? toTitleCase(characters[0]) : "Unknown Character";
        const copyStr = copyrights.length > 0 ? toTitleCase(copyrights[0]) : "Unknown Series";
        let name = pattern.replace(/%artist%/g, sanitizeFilename(artistStr))
                          .replace(/%character%/g, sanitizeFilename(charStr))
                          .replace(/%copyright%/g, sanitizeFilename(copyStr))
                          .replace(/%id%/g, id)
                          .replace(/%md5%/g, md5 || 'unknown_md5')
                          .replace(/%ext%/g, "%ext%");
        return sanitizeFilename(name);
    }

    function downloadImage(characterFolder, force = false, manualType = null, forceSeries = false) {
        const currentMD5 = getPageMD5();
        if (!force && currentMD5 && isDownloaded(currentMD5)) { if (!confirm("File in history. Redownload?")) return; }

        let fileUrl = "";
        const originalLink = document.querySelector(
            'a#image-download-link, a.image-download-link, ' +
            'a[onclick*="javascript:show_original_image"], ' +
            'a[href*="/image/"], a[href*="/file/"], ' +
            'li a[href*=".png"], li a[href*=".jpg"], li a[href*=".jpeg"], li a[href*=".gif"], li a[href*=".webm"], li a[href*=".mp4"]'
        );
        if (originalLink && originalLink.href && !originalLink.href.includes('/wiki/')) fileUrl = originalLink.href;

        if (!fileUrl && isRule34Us()) {
            const r34UsOriginal = document.querySelector('a[href*="/images/"][href$=".png"], a[href*="/images/"][href$=".jpg"], a[href*="/images/"][href$=".gif"]');
            if (r34UsOriginal && r34UsOriginal.textContent.trim().toLowerCase().includes('original')) fileUrl = r34UsOriginal.href;
        }

        if (!fileUrl && isE621()) {
             const e621OriginalLink = document.querySelector('li#post-file-size a, #raw_image_container > a');
             if (e621OriginalLink && e621OriginalLink.href) fileUrl = e621OriginalLink.href;
        }

        if (!fileUrl) {
            const mainImage = document.querySelector('#image, #main_image, #img, .image-body img, #img-display');
            if (mainImage && mainImage.src) fileUrl = mainImage.src;
        }

        if (!fileUrl) {
            const mainVideo = document.querySelector('video#image, video.image-body, video#gelcomVideoPlayer');
            if (mainVideo) {
                const source = mainVideo.querySelector('source');
                if (source && source.src) fileUrl = source.src;
                else if (mainVideo.src) fileUrl = mainVideo.src;
            }
        }

        if (!fileUrl) return alert("No image or video found on this page.");

        const info = getTargetFolder();
        let root = GM_getValue('root_folder', DEFAULT_ROOT);
        const host = window.location.hostname;

        let sepSub = null;
        if (host.includes('realbooru') && GM_getValue('sep_realbooru', false)) sepSub = "Realbooru";
        else if (host.includes('safebooru') && GM_getValue('sep_safebooru', false)) sepSub = "Safebooru";
        else if (host.includes('gelbooru') && GM_getValue('sep_gelbooru', false)) sepSub = "Gelbooru";
        else if (host.includes('rule34.xxx') && GM_getValue('sep_rule34', false)) sepSub = "Rule34";
        else if (host.includes('xbooru') && GM_getValue('sep_xbooru', false)) sepSub = "Xbooru";
        else if (host.includes('tbib') && GM_getValue('sep_tbib', false)) sepSub = "TBIB";
        else if (host.includes('yande') && GM_getValue('sep_yande', false)) sepSub = "Yande";
        else if (host.includes('konachan') && GM_getValue('sep_konachan', false)) sepSub = "Konachan";
        else if (host.includes('rule34.us') && GM_getValue('sep_rule34us', false)) sepSub = "Rule34us";
        else if (isE621() && GM_getValue('sep_e621', false)) sepSub = "E621";

        if (sepSub) {
            root = root.replace(/\/$/, '') + '/' + sepSub;
        }

        const urlObj = new URL(fileUrl);
        const ext = urlObj.pathname.split('.').pop().split('?')[0];
        const id = new URLSearchParams(window.location.search).get('id') || getIdFromUrl(window.location.href);

        let filename = generateFilename(document, id, currentMD5);
        filename = filename.replace('%ext%', ext.toLowerCase());
        if(!filename.endsWith('.'+ext.toLowerCase())) filename += '.'+ext.toLowerCase();

        let finalPath = "";
        if (host.includes('realbooru')) {
            const charNameOnly = info.name.split('/').pop();
            finalPath = `${root}/${charNameOnly}/${filename}`;
        } else {
            const useCustom = GM_getValue('enable_custom_path', false);
            let typeVal = manualType || detectImageType(document);
            if (useCustom) {
                const pattern = GM_getValue('custom_path_pattern', DEFAULT_CUSTOM_PATH);
                let seriesVal = info.series || "";
                if (pattern.includes('%series%') && !seriesVal) { seriesVal = GM_getValue('fallback_series_name', '_Unsorted'); }
                let charPart = characterFolder;
                if (seriesVal && charPart.startsWith(seriesVal + '/')) { charPart = charPart.substring(seriesVal.length + 1); }
                let raw = pattern.replace(/%root%/g, root).replace(/%type%/g, typeVal).replace(/%series%/g, seriesVal).replace(/%char%/g, charPart).replace(/%filename%/g, filename);
                finalPath = raw.replace(/\/+/g, '/').replace(/\/$/, '');
            } else {
                const subMode = GM_getValue('subfolder_mode', 'none');
                const structMode = GM_getValue('folder_structure', 'full');
                const orderMode = GM_getValue('order_mode', 'path_first');
                let finalFolder = characterFolder;
                if (!forceSeries) {
                    if (structMode === 'flat') { const parts = characterFolder.split('/'); finalFolder = parts[parts.length - 1]; }
                    else if (structMode === 'nested') { const parts = finalFolder.split('/'); if (parts.length > 1) { finalFolder = parts.slice(1).join('/'); } }
                }
                let typeFolder = ""; if (subMode === 'split') typeFolder = "/" + typeVal;
                if (orderMode === 'type_first' && typeFolder) { finalPath = `${root}${typeFolder}/${finalFolder}/${filename}`; }
                else { finalPath = `${root}/${finalFolder}${typeFolder}/${filename}`; }
            }
        }

        const dlBtn = document.getElementById('r34-dl-btn'); if (dlBtn) dlBtn.innerText = '⏳ Downloading...';
        GM_download({
            url: fileUrl, name: finalPath, saveAs: false, conflictAction: 'overwrite',
            onload: () => { if (currentMD5) addToHistory(currentMD5); if(dlBtn) { dlBtn.innerText = '✔ Saved'; dlBtn.style.backgroundColor = '#28a745'; setTimeout(updateMainButton, 2000); } },
            onerror: (e) => {
                console.error(e);
                if(dlBtn) { dlBtn.innerText = '❌ Error'; dlBtn.style.backgroundColor = 'red'; }
                alert(`Download Error: ${e.error || 'Unknown'}`);
            }
        });
    }

    function downloadFromDocument(doc, item, onComplete) {
         const info = getTargetFolder(doc);
         let root = GM_getValue('root_folder', DEFAULT_ROOT);
         const host = window.location.hostname;

         let sepSub = null;
         if (host.includes('realbooru') && GM_getValue('sep_realbooru', false)) sepSub = "Realbooru";
         else if (host.includes('safebooru') && GM_getValue('sep_safebooru', false)) sepSub = "Safebooru";
         else if (host.includes('gelbooru') && GM_getValue('sep_gelbooru', false)) sepSub = "Gelbooru";
         else if (host.includes('rule34.xxx') && GM_getValue('sep_rule34', false)) sepSub = "Rule34";
         else if (host.includes('xbooru') && GM_getValue('sep_xbooru', false)) sepSub = "Xbooru";
         else if (host.includes('tbib') && GM_getValue('sep_tbib', false)) sepSub = "TBIB";
         else if (host.includes('yande') && GM_getValue('sep_yande', false)) sepSub = "Yande";
         else if (host.includes('konachan') && GM_getValue('sep_konachan', false)) sepSub = "Konachan";
         else if (host.includes('rule34.us') && GM_getValue('sep_rule34us', false)) sepSub = "Rule34us";
         else if (isE621() && GM_getValue('sep_e621', false)) sepSub = "E621";

        if (sepSub) {
             root = root.replace(/\/$/, '') + '/' + sepSub;
         }

         const urlObj = new URL(item.fileUrl);
         const ext = urlObj.pathname.split('.').pop().split('?')[0];
         let filename = generateFilename(doc, item.id, item.md5);
         filename = filename.replace('%ext%', ext.toLowerCase());
         if(!filename.endsWith('.'+ext.toLowerCase())) filename += '.'+ext.toLowerCase();

         let finalPath = "";
         if (host.includes('realbooru')) {
             const charNameOnly = info.name.split('/').pop();
             finalPath = `${root}/${charNameOnly}/${filename}`;
         } else {
             const useCustom = GM_getValue('enable_custom_path', false);
             let typeVal = item.manualType || item.autoType || detectImageType(doc);
             if (useCustom) {
                 const pattern = GM_getValue('custom_path_pattern', DEFAULT_CUSTOM_PATH);
                 let seriesVal = info.series || "";
                 if (pattern.includes('%series%') && !seriesVal) { seriesVal = GM_getValue('fallback_series_name', '_Unsorted'); }
                 let charPart = info.name;
                 if (seriesVal && charPart.startsWith(seriesVal + '/')) { charPart = charPart.substring(seriesVal.length + 1); }
                 let raw = pattern.replace(/%root%/g, root).replace(/%type%/g, typeVal).replace(/%series%/g, seriesVal).replace(/%char%/g, charPart).replace(/%filename%/g, filename);
                 finalPath = raw.replace(/\/+/g, '/').replace(/\/$/, '');
             } else {
                 const subMode = GM_getValue('subfolder_mode', 'none');
                 const structMode = GM_getValue('folder_structure', 'full');
                 const orderMode = GM_getValue('order_mode', 'path_first');
                 let finalFolder = info.name;
                 if (structMode === 'flat') { const parts = finalFolder.split('/'); finalFolder = parts[parts.length - 1]; }
                 else if (structMode === 'nested') { const parts = finalFolder.split('/'); if (parts.length > 1) { finalFolder = parts.slice(1).join('/'); } }
                 let typeFolder = ""; if (subMode === 'split') typeFolder = "/" + typeVal;
                 if (orderMode === 'type_first' && typeFolder) { finalPath = `${root}${typeFolder}/${finalFolder}/${filename}`; }
                 else { finalPath = `${root}/${finalFolder}${typeFolder}/${filename}`; }
             }
         }

         GM_download({
             url: item.fileUrl, name: finalPath, saveAs: false, conflictAction: 'overwrite',
             onload: () => { addToHistory(item.md5); if(onComplete) onComplete(true); },
             onerror: (e) => { if(onComplete) onComplete(false); }
         });
    }

    // --- FOCUS EDITOR ---
    function openFocusEditor(item, doc, onSave, onSingleDownload, navigation) {
        const overlay = document.createElement('div');
        Object.assign(overlay.style, { position:'fixed', top:'0', left:'0', width:'100%', height:'100%', backgroundColor:'rgba(0,0,0,0.95)', zIndex:'10020', display:'flex' });

        const cleanupAndClose = () => { document.removeEventListener('keydown', handleKeys); document.body.removeChild(overlay); };
        const handleKeys = (e) => {
            const activeTag = document.activeElement.tagName; const isInput = activeTag === 'INPUT' || activeTag === 'TEXTAREA';
            if (e.key === 'Escape') { cleanupAndClose(); }
            else if (e.code === 'Space' && !isInput) { e.preventDefault(); if (mediaNode && mediaNode.tagName === 'VIDEO') { mediaNode.paused ? mediaNode.play() : mediaNode.pause(); } }
            else if (!isInput && navigation) {
                if (e.key === 'ArrowRight' && navigation.hasNext) { cleanupAndClose(); navigation.goNext(); }
                else if (e.key === 'ArrowLeft' && navigation.hasPrev) { cleanupAndClose(); navigation.goPrev(); }
            }
        };
        document.addEventListener('keydown', handleKeys);

        const sidebar = document.createElement('div');
        Object.assign(sidebar.style, { width:'380px', backgroundColor:'#1a1a1a', borderRight:'1px solid #444', display:'flex', flexDirection:'column', padding:'20px', gap:'15px', overflowY:'auto' });

        const headerRow = document.createElement('div');
        Object.assign(headerRow.style, { display:'flex', justifyContent:'space-between', alignItems:'center', backgroundColor: 'transparent' });
        const titleSpan = document.createElement('h3'); titleSpan.innerText = "Focus Editor";
        Object.assign(titleSpan.style, { color: '#ddd', margin: '0', backgroundColor: 'transparent' });
        headerRow.appendChild(titleSpan);
        const settingsBtn = document.createElement('button'); settingsBtn.innerText = "⚙";
        Object.assign(settingsBtn.style, { background:'none', border:'none', color:'#888', cursor:'pointer', fontSize:'16px', marginLeft:'10px' });
        settingsBtn.onclick = () => { openSettingsMenu(); };
        headerRow.appendChild(settingsBtn);
        if(navigation) {
            const navSpan = document.createElement('span'); navSpan.innerText = `Post ${navigation.current + 1} / ${navigation.total}`; navSpan.style.color = '#777'; navSpan.style.fontSize = '12px'; navSpan.style.marginLeft = 'auto'; headerRow.appendChild(navSpan);
        }
        sidebar.appendChild(headerRow);

        const pathPreview = document.createElement('div');
        Object.assign(pathPreview.style, { fontSize:'11px', color:'#f39c12', border:'1px dashed #444', padding:'8px', borderRadius:'4px', wordBreak:'break-word', backgroundColor:'#222' });
        const refreshPathPreview = () => { const info = getTargetFolder(doc); pathPreview.innerHTML = `<strong>Current Path Result:</strong><br>${info.name}`; };
        refreshPathPreview(); sidebar.appendChild(pathPreview);

        const bestSeries = getBestSeriesMatch(doc) || "";
        const allChars = getAllCharacterTagsRaw(doc);
        const unknowns = getUnknownCharacterTags(doc);
        const rules = loadRules();
        const mappedTags = new Set();
        const wildcardRules = [];

        Object.values(rules).forEach(tags => { tags.forEach(t => { if (t.includes('*')) wildcardRules.push(t); else mappedTags.add(t); }); });
        const unmappedChars = allChars.filter(tag => { if (mappedTags.has(tag)) return false; for (const rule of wildcardRules) { const regexStr = '^' + rule.split('*').map(s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('.*') + '$'; if (new RegExp(regexStr).test(tag)) return false; } return true; });

        let defaultName = "";
        let activeTags = [];
        if (unmappedChars.length > 0) { defaultName = toTitleCase(unmappedChars[0]); activeTags = [...unmappedChars]; }
        else if (allChars.length > 0) { defaultName = toTitleCase(allChars[0]); activeTags = [...allChars]; }
        else { activeTags = [...unknowns]; }

        const inputContainer = document.createElement('div');
        Object.assign(inputContainer.style, { borderTop:'1px solid #444', paddingTop:'15px', backgroundColor:'transparent' });

        const rulePreview = document.createElement('div');
        Object.assign(rulePreview.style, { fontSize:'11px', color:'#00bc8c', marginBottom:'10px', fontStyle:'italic', backgroundColor:'transparent' });
        inputContainer.appendChild(rulePreview);

        const updateLiveRule = () => {
            let u = stripSlashes(uniInput.value.trim()); let f = stripSlashes(nameInput.value.trim());
            if(f) { const full = u ? `${u}/${f}` : f; rulePreview.innerHTML = `New Rule Target: <strong>${full}</strong>`; }
            else { rulePreview.innerHTML = `New Rule Target: (Type a name)`; }
        };

        const uniGroup = document.createElement('div'); Object.assign(uniGroup.style, { marginBottom:'10px', backgroundColor:'transparent' });
        const uniLabel = document.createElement('div'); uniLabel.innerText = "Universe / Copyright"; uniLabel.style.color = '#888'; uniLabel.style.fontSize = '12px'; uniLabel.style.backgroundColor = 'transparent';
        const uniWrapper = document.createElement('div'); Object.assign(uniWrapper.style, { display:'flex', gap:'5px', backgroundColor:'transparent' });
        const uniInput = document.createElement('input'); uniInput.placeholder = "Universe"; uniInput.value = bestSeries;
        Object.assign(uniInput.style, { flex:'1', padding:'8px', backgroundColor:'#111', color:'#fff', border:'1px solid #555', borderRadius:'4px' });
        uniInput.onkeyup = updateLiveRule;
        const autoBtn = document.createElement('button'); autoBtn.innerText = "↻"; autoBtn.title = "Cycle Auto";
        Object.assign(autoBtn.style, { padding:'0 12px', backgroundColor:'#444', color:'white', border:'none', cursor:'pointer', borderRadius:'4px' });
        const matches = getAllSeriesMatches(doc); let autoIdx = 0;
        autoBtn.onclick = () => { if(matches.length){ uniInput.value = stripSlashes(matches[autoIdx++ % matches.length]); updateLiveRule(); } };
        uniWrapper.appendChild(uniInput); uniWrapper.appendChild(autoBtn); uniGroup.appendChild(uniLabel); uniGroup.appendChild(uniWrapper); inputContainer.appendChild(uniGroup);

        const nameGroup = document.createElement('div'); Object.assign(nameGroup.style, { marginBottom:'10px', backgroundColor:'transparent' });
        const nameLabel = document.createElement('div'); nameLabel.innerText = "Character Name"; nameLabel.style.color = '#888'; nameLabel.style.fontSize = '12px'; nameLabel.style.backgroundColor = 'transparent';
        const nameInput = document.createElement('input'); nameInput.placeholder = "Character Name"; nameInput.value = defaultName;
        Object.assign(nameInput.style, { width:'100%', padding:'8px', backgroundColor:'#111', color:'#fff', border:'1px solid #555', borderRadius:'4px', boxSizing:'border-box' });
        nameInput.onkeyup = updateLiveRule;
        nameGroup.appendChild(nameLabel); nameGroup.appendChild(nameInput);

        const allPageCharacters = getAllCharacterTagsOnPage(doc);
        if (allPageCharacters.length > 0) {
            const charShortcutContainer = document.createElement('div');
            Object.assign(charShortcutContainer.style, { display:'flex', flexWrap:'wrap', gap:'5px', marginTop:'5px', backgroundColor:'transparent' });
            allPageCharacters.forEach(char => {
                const btn = document.createElement('button');
                btn.innerText = toTitleCase(char);
                const isUnmapped = unmappedChars.includes(char);
                const bgCol = isUnmapped ? '#d35400' : '#27ae60';
                Object.assign(btn.style, { fontSize:'10px', padding:'2px 6px', backgroundColor:bgCol, color:'white', border:'none', borderRadius:'3px', cursor:'pointer' });
                btn.title = "Set Name + Add Tag";
                btn.onclick = () => { nameInput.value = toTitleCase(char); if (!activeTags.includes(char)) { activeTags.push(char); renderPills(); } updateLiveRule(); };
                charShortcutContainer.appendChild(btn);
            });
            nameGroup.appendChild(charShortcutContainer);
        }
        inputContainer.appendChild(nameGroup);

        const tagsGroup = document.createElement('div'); Object.assign(tagsGroup.style, { marginBottom:'15px', backgroundColor:'transparent' });
        const tagsLabel = document.createElement('div'); tagsLabel.innerText = "Tags to Map"; tagsLabel.style.color = '#888'; tagsLabel.style.fontSize = '12px'; tagsLabel.style.backgroundColor = 'transparent';
        const pillsArea = document.createElement('div'); Object.assign(pillsArea.style, { display:'flex', flexDirection:'column', gap:'5px', backgroundColor:'transparent' });
        const activeTagsContainer = document.createElement('div');
        Object.assign(activeTagsContainer.style, { minHeight:'40px', padding:'5px', backgroundColor:'#1a1a1a', border:'1px solid #28a745', borderRadius:'4px', display:'flex', flexWrap:'wrap', gap:'4px' });
        const poolTagsContainer = document.createElement('div');
        Object.assign(poolTagsContainer.style, { minHeight:'40px', maxHeight:'150px', overflowY:'auto', padding:'5px', backgroundColor:'#111', border:'1px solid #444', borderRadius:'4px', display:'flex', flexWrap:'wrap', gap:'4px' });

        const renderPills = () => {
            activeTagsContainer.innerHTML = ''; poolTagsContainer.innerHTML = '';
            if(activeTags.length === 0) activeTagsContainer.innerHTML = '<span style="color:#555; font-size:10px; font-style:italic; padding:5px;">No tags selected...</span>';
            activeTags.forEach((tag, idx) => {
                const pill = document.createElement('span');
                Object.assign(pill.style, { backgroundColor:'#1e7e34', color:'white', fontSize:'11px', padding:'2px 6px', borderRadius:'3px', cursor:'pointer', display:'flex', alignItems:'center', border:'1px solid #28a745' });
                pill.innerHTML = `${tag} <span style="font-weight:bold; margin-left:5px;">×</span>`;
                pill.onclick = () => { activeTags.splice(idx, 1); renderPills(); };
                activeTagsContainer.appendChild(pill);
            });
            const pool = allPageCharacters.filter(t => !activeTags.includes(t));
            pool.forEach(tag => {
                const pill = document.createElement('span');
                Object.assign(pill.style, { backgroundColor:'#333', color:'#ccc', fontSize:'11px', padding:'2px 6px', borderRadius:'3px', cursor:'pointer', border:'1px solid #444' });
                pill.innerText = tag;
                pill.onclick = () => { activeTags.push(tag); renderPills(); };
                poolTagsContainer.appendChild(pill);
            });
        };
        const manualInput = document.createElement('input');
        manualInput.placeholder = 'Type tag manually & Enter...';
        Object.assign(manualInput.style, { border:'1px solid #444', background:'#111', color:'#fff', fontSize:'12px', padding:'4px', width:'100%' });
        manualInput.onkeydown = (e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); const val = manualInput.value.trim().replace(/,/g, ''); if (val && !activeTags.includes(val)) { activeTags.push(val); manualInput.value = ''; renderPills(); } } };

        renderPills();
        pillsArea.appendChild(activeTagsContainer); pillsArea.appendChild(manualInput);
        const poolLabel = document.createElement('div'); poolLabel.innerText = "Available Characters (Click to Add)"; poolLabel.style.fontSize = '10px'; poolLabel.style.color = '#777'; poolLabel.style.marginTop = '5px'; poolLabel.style.backgroundColor = 'transparent';
        pillsArea.appendChild(poolLabel); pillsArea.appendChild(poolTagsContainer);
        tagsGroup.appendChild(tagsLabel); tagsGroup.appendChild(pillsArea); inputContainer.appendChild(tagsGroup);

        const existingRulesContainer = document.createElement('div');
        Object.assign(existingRulesContainer.style, { backgroundColor:'#222', border:'1px solid #444', padding:'10px', borderRadius:'4px', marginBottom: '15px' });
        const existingHeader = document.createElement('div');
        existingHeader.innerHTML = "<strong>Active Rules on this Image:</strong>";
        existingHeader.style.marginBottom = '5px'; existingHeader.style.fontSize = '12px'; existingHeader.style.color = '#ccc'; existingHeader.style.backgroundColor = 'transparent';
        existingRulesContainer.appendChild(existingHeader);
        const rulesList = document.createElement('div');
        Object.assign(rulesList.style, { display:'flex', flexDirection:'column', gap:'5px', backgroundColor:'transparent' });
        existingRulesContainer.appendChild(rulesList);
        sidebar.appendChild(existingRulesContainer);

        const refreshMatchedRules = () => {
            rulesList.innerHTML = ''; const rules = loadRules(); const pageTags = getAllTags(doc); const matchesByFolder = {};
            Object.entries(rules).forEach(([folder, tags]) => {
                const intersect = tags.filter(t => pageTags.includes(t));
                if (intersect.length > 0) { if(!matchesByFolder[folder]) matchesByFolder[folder] = []; intersect.forEach(t => matchesByFolder[folder].push(t)); }
                tags.forEach(ruleTag => {
                    if (ruleTag.includes('*')) {
                        const regexStr = '^' + ruleTag.split('*').map(s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('.*') + '$';
                        const regex = new RegExp(regexStr);
                        const wildcardMatches = pageTags.filter(pt => regex.test(pt));
                        if (wildcardMatches.length > 0) { if(!matchesByFolder[folder]) matchesByFolder[folder] = []; wildcardMatches.forEach(wm => { const displayStr = `${wm} (via ${ruleTag})`; if (!matchesByFolder[folder].includes(displayStr)) matchesByFolder[folder].push(displayStr); }); }
                    }
                });
            });
            const folderKeys = Object.keys(matchesByFolder);
            if (folderKeys.length > 0) {
                folderKeys.forEach(folder => {
                    const matchedTags = [...new Set(matchesByFolder[folder])].sort().join(', ');
                    const row = document.createElement('div');
                    Object.assign(row.style, { display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:'11px', backgroundColor:'#333', padding:'5px', borderRadius:'3px' });
                    const infoSpan = document.createElement('span');
                    infoSpan.innerHTML = `<span style="color:#8fd3ff; margin-right:5px; word-break:break-word;">${matchedTags}</span> <span style="color:#aaa; white-space:nowrap;">→</span> <span style="color:#f39c12; margin-left:5px;">${folder}</span>`;
                    infoSpan.style.backgroundColor = 'transparent';
                    const editRuleBtn = document.createElement('span'); editRuleBtn.innerText = '✎ Edit';
                    Object.assign(editRuleBtn.style, { marginLeft:'8px', cursor:'pointer', color:'#aaa', border:'1px solid #555', padding:'2px 5px', borderRadius:'3px', fontSize:'10px', backgroundColor:'transparent' });
                    editRuleBtn.onclick = (e) => {
                        e.stopPropagation();
                        const currentRawTags = rules[folder] || [];
                        row.innerHTML = '';
                        Object.assign(row.style, { flexDirection: 'column', alignItems: 'stretch', gap: '5px', padding: '8px' });
                        const tagLabel = document.createElement('div'); tagLabel.innerText = "Tags (comma separated):"; tagLabel.style.color = '#888'; tagLabel.style.fontSize = '9px';
                        const tagInput = document.createElement('input'); tagInput.value = currentRawTags.join(', ');
                        Object.assign(tagInput.style, { width: '100%', backgroundColor: '#111', color: '#8fd3ff', border: '1px solid #555', fontSize: '11px', padding: '4px', boxSizing:'border-box' });
                        const folderLabel = document.createElement('div'); folderLabel.innerText = "Target Folder:"; folderLabel.style.color = '#888'; tagLabel.style.fontSize = '9px';
                        const pathInput = document.createElement('input'); pathInput.value = folder;
                        Object.assign(pathInput.style, { width: '100%', backgroundColor: '#111', color: '#f39c12', border: '1px solid #555', fontSize: '11px', padding: '4px', boxSizing:'border-box' });
                        const btnDiv = document.createElement('div'); Object.assign(btnDiv.style, { display: 'flex', gap: '5px', justifyContent: 'flex-end', marginTop:'5px' });
                        const saveInline = document.createElement('button'); saveInline.innerText = '💾 Save';
                        Object.assign(saveInline.style, { backgroundColor: '#28a745', color: 'white', border: 'none', padding: '3px 10px', borderRadius: '3px', cursor: 'pointer', fontSize: '10px' });
                        const cancelInline = document.createElement('button'); cancelInline.innerText = '✘ Cancel';
                        Object.assign(cancelInline.style, { backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '3px 10px', borderRadius: '3px', cursor: 'pointer', fontSize: '10px' });
                        saveInline.onclick = (evt) => {
                            evt.stopPropagation(); const newTagsStr = tagInput.value.trim(); const newPathStr = pathInput.value.trim();
                            if (newTagsStr && newPathStr) { if (folder !== newPathStr) delete rules[folder]; const newTags = newTagsStr.split(',').map(t => normalizeTag(t)).filter(t => t); rules[newPathStr] = newTags; saveRules(rules); refreshMatchedRules(); refreshPathPreview(); }
                        };
                        cancelInline.onclick = (evt) => { evt.stopPropagation(); refreshMatchedRules(); };
                        btnDiv.appendChild(cancelInline); btnDiv.appendChild(saveInline);
                        row.appendChild(tagLabel); row.appendChild(tagInput); row.appendChild(folderLabel); row.appendChild(pathInput); row.appendChild(btnDiv); tagInput.focus();
                    };
                    row.appendChild(infoSpan); row.appendChild(editRuleBtn); rulesList.appendChild(row);
                });
            } else { rulesList.innerHTML = '<span style="color:#666; font-style:italic; fontSize:11px; background-color:transparent;">No saved rules match this image.</span>'; }
        };
        refreshMatchedRules(); sidebar.appendChild(inputContainer); updateLiveRule();

        const saveBtn = document.createElement('button'); saveBtn.innerText = "Save Rule";
        Object.assign(saveBtn.style, { width:'100%', padding:'12px', backgroundColor:'#28a745', color:'white', border:'none', cursor:'pointer', fontWeight:'bold', borderRadius:'4px' });
        saveBtn.onclick = () => {
             let u = stripSlashes(uniInput.value.trim()); let f = stripSlashes(nameInput.value.trim());
             const finalTags = activeTags;
             if(f && finalTags.length > 0) {
                 if (u) f = `${u}/${f}`;
                 const groups = loadRules(); if(!groups[f]) groups[f] = [];
                 finalTags.forEach(rawTag => { const clean = normalizeTag(rawTag); if(clean && !groups[f].includes(clean)) groups[f].push(clean); });
                 saveRules(groups);
                 saveBtn.innerText = "✔ Rule Saved!"; saveBtn.style.backgroundColor = '#1e7e34';
                 setTimeout(() => { saveBtn.innerText = "Save Rule"; saveBtn.style.backgroundColor = '#28a745'; }, 1500);
                 refreshMatchedRules(); refreshPathPreview(); if(onSave) onSave();
             }
        };
        sidebar.appendChild(saveBtn);

        const typeGroup = document.createElement('div'); Object.assign(typeGroup.style, { marginTop:'15px', backgroundColor:'transparent' });
        const typeLabel = document.createElement('div'); typeLabel.innerText = "Force Type (This Image)"; typeLabel.style.color = '#888'; typeLabel.style.fontSize = '12px'; typeLabel.style.backgroundColor = 'transparent';
        const typeWrapper = document.createElement('div'); Object.assign(typeWrapper.style, { display:'flex', gap:'5px', backgroundColor:'transparent' });
        let manualType = item.manualType || null; const autoPrediction = detectImageType(doc);
        const makeTypeBtn = (txt, val, isAuto) => {
            const b = document.createElement('button');
            if(isAuto) b.innerText = `Auto (${autoPrediction})`; else b.innerText = txt;
            const isActive = (manualType === val);
            Object.assign(b.style, { flex:'1', padding:'6px', backgroundColor: isActive ? '#007bff' : '#333', color:'white', border:'1px solid #444', cursor:'pointer', borderRadius:'4px', fontSize:'11px' });
            b.onclick = () => { manualType = val; item.manualType = manualType; typeWrapper.innerHTML = ''; typeWrapper.appendChild(makeTypeBtn("Auto", null, true)); typeWrapper.appendChild(makeTypeBtn("2D", "2D", false)); typeWrapper.appendChild(makeTypeBtn("3D", "3D", false)); if(onSave) onSave(); };
            return b;
        };
        typeWrapper.appendChild(makeTypeBtn("Auto", null, true)); typeWrapper.appendChild(makeTypeBtn("2D", "2D", false)); typeWrapper.appendChild(makeTypeBtn("3D", "3D", false));
        typeGroup.appendChild(typeLabel); typeGroup.appendChild(typeWrapper); sidebar.appendChild(typeGroup);

        const dlBtn = document.createElement('button'); dlBtn.innerText = "⬇ Download This Image";
        Object.assign(dlBtn.style, { width:'100%', padding:'10px', backgroundColor:'#17a2b8', color:'white', border:'none', cursor:'pointer', fontWeight:'bold', borderRadius:'4px', marginTop:'15px' });
        dlBtn.onclick = () => { onSingleDownload(item); }; sidebar.appendChild(dlBtn);

        const closeBtn = document.createElement('button'); closeBtn.innerText = "Done / Close (Esc)";
        Object.assign(closeBtn.style, { width:'100%', padding:'10px', backgroundColor:'#dc3545', color:'white', border:'none', cursor:'pointer', borderRadius:'4px', marginTop:'auto' });
        closeBtn.onclick = cleanupAndClose; sidebar.appendChild(closeBtn);

        overlay.appendChild(sidebar);
        const imgContainer = document.createElement('div');
        Object.assign(imgContainer.style, { flex:'1', display:'flex', justifyContent:'center', alignItems:'center', overflow:'hidden', padding:'20px', backgroundColor:'#000' });

        let mediaNode;
        const mainVideo = doc.querySelector('video#image, video.image-body, video#gelcomVideoPlayer');
        const mainImage = doc.querySelector('img#image, img#main_image, img#img, .image-body img, #img-display');

        if (mainVideo) {
            mediaNode = document.createElement('video');
            mediaNode.controls = true; mediaNode.autoplay = true; mediaNode.loop = true;
            const source = mainVideo.querySelector('source');
            if (source && source.src) mediaNode.src = source.src;
            else if (mainVideo.src) mediaNode.src = mainVideo.src;
            Object.assign(mediaNode.style, { maxHeight:'95%', maxWidth:'95%', boxShadow:'0 0 20px black' });
        } else if (mainImage) {
            mediaNode = document.createElement('img');
            mediaNode.src = mainImage.src;
            Object.assign(mediaNode.style, { maxHeight:'95%', maxWidth:'95%', objectFit:'contain', boxShadow:'0 0 20px black' });
        } else {
            mediaNode = document.createElement('img');
            mediaNode.src = item.thumbUrl;
            Object.assign(mediaNode.style, { maxHeight:'95%', maxWidth:'95%', objectFit:'contain', boxShadow:'0 0 20px black' });
        }
        imgContainer.appendChild(mediaNode); overlay.appendChild(imgContainer);

        const rightSidebar = document.createElement('div');
        Object.assign(rightSidebar.style, { width:'220px', backgroundColor:'#1a1a1a', borderLeft:'1px solid #444', display:'flex', flexDirection:'column', padding:'10px', overflowY:'auto' });
        rightSidebar.innerHTML = `<h4 style="color:#ddd; margin:10px 0; background-color: transparent;">Post Tags</h4>`;
        const allTagsWithTypes = getAllTagsWithTypes(doc);
        allTagsWithTypes.forEach(t => {
            const tagSpan = document.createElement('div'); tagSpan.innerText = t.text;
            let col = '#888'; if(t.type === 'character') col = '#00aa00'; else if(t.type === 'copyright') col = '#dd00dd'; else if(t.type === 'artist') col = '#cc0000';
            Object.assign(tagSpan.style, { fontSize:'12px', color:col, padding:'4px', cursor:'pointer', borderBottom:'1px solid #222', backgroundColor: '#1a1a1a' });
            tagSpan.onmouseenter = () => { tagSpan.style.backgroundColor = '#333'; }; tagSpan.onmouseleave = () => { tagSpan.style.backgroundColor = '#1a1a1a'; };
            tagSpan.onclick = () => { if(!activeTags.includes(t.normalized)) { activeTags.push(t.normalized); renderPills(); } };
            rightSidebar.appendChild(tagSpan);
        });
        overlay.appendChild(rightSidebar); document.body.appendChild(overlay);
    }

    // --- MASS DOWNLOADER ---
    function openMassDownloader() {
        const overlay = document.createElement('div'); overlay.id = 'r34-mass-overlay';
        Object.assign(overlay.style, { position:'fixed', top:'0', left:'0', width:'100%', height:'100%', backgroundColor:'rgba(0,0,0,0.9)', zIndex:'10001', display:'flex', justifyContent:'center', alignItems:'center' });
        const container = document.createElement('div');
        Object.assign(container.style, { backgroundColor:'#222', color:'#fff', width:'98%', height:'95%', borderRadius:'8px', display:'flex', flexDirection:'column', border:'1px solid #444' });

        const header = document.createElement('div');
        Object.assign(header.style, { padding:'15px', borderBottom:'1px solid #444', display:'flex', justifyContent:'space-between', alignItems:'center' });
        header.innerHTML = `<span style="font-size:18px; font-weight:bold">Page Downloader</span>`;

        const controls = document.createElement('div');
        Object.assign(controls.style, { display:'flex', alignItems:'center' });
        const statusSpan = document.createElement('span');
        Object.assign(statusSpan.style, { marginRight:'20px', color:'#f39c12', fontWeight:'bold' });
        const rescanBtn = document.createElement('button'); rescanBtn.innerText = "Rescan Page";
        Object.assign(rescanBtn.style, { marginRight:'10px', padding:'5px 15px', cursor:'pointer', backgroundColor:'#007bff', color:'white', border:'none', borderRadius:'3px' });

        const forceContainer = document.createElement('div');
        Object.assign(forceContainer.style, { display:'flex', alignItems:'center', marginRight:'15px', fontSize:'11px', cursor:'pointer', backgroundColor:'#333', padding:'4px 8px', borderRadius:'3px', border:'1px solid #444' });
        const forceChk = document.createElement('input'); forceChk.type = 'checkbox'; forceChk.id = 'r34-force-dl';
        Object.assign(forceChk.style, { marginRight:'5px', cursor:'pointer' });
        const forceLabel = document.createElement('label'); forceLabel.htmlFor = 'r34-force-dl'; forceLabel.innerText = "Include Library"; forceLabel.style.cursor = 'pointer';
        forceContainer.appendChild(forceChk); forceContainer.appendChild(forceLabel);

        const selAllBtn = document.createElement('button'); selAllBtn.innerText = "Select All";
        Object.assign(selAllBtn.style, { marginRight:'5px', padding:'5px 10px', cursor:'pointer', backgroundColor:'#444', color:'white', border:'none', borderRadius:'3px', fontSize:'11px' });
        const deselBtn = document.createElement('button'); deselBtn.innerText = "Deselect All";
        Object.assign(deselBtn.style, { marginRight:'15px', padding:'5px 10px', cursor:'pointer', backgroundColor:'#444', color:'white', border:'none', borderRadius:'3px', fontSize:'11px' });
        const dlSelBtn = document.createElement('button'); dlSelBtn.innerText = "Download Selected (0)";
        Object.assign(dlSelBtn.style, { marginRight:'10px', padding:'5px 15px', cursor:'pointer', backgroundColor:'#17a2b8', color:'white', border:'none', borderRadius:'3px', opacity:'0.5', pointerEvents:'none' });
        const dlAllBtn = document.createElement('button'); dlAllBtn.innerText = "Download ALL (0)";
        Object.assign(dlAllBtn.style, { marginRight:'10px', padding:'5px 15px', cursor:'pointer', backgroundColor:'#28a745', color:'white', border:'none', borderRadius:'3px', opacity:'0.5', pointerEvents:'none' });
        const closeBtn = document.createElement('button'); closeBtn.innerText = "Close";
        Object.assign(closeBtn.style, { padding:'5px 15px', cursor:'pointer', backgroundColor:'#dc3545', color:'white', border:'none', borderRadius:'3px' });
        closeBtn.onclick = () => document.body.removeChild(overlay);

        controls.appendChild(statusSpan); controls.appendChild(rescanBtn); controls.appendChild(forceContainer); controls.appendChild(selAllBtn); controls.appendChild(deselBtn); controls.appendChild(dlSelBtn); controls.appendChild(dlAllBtn); controls.appendChild(closeBtn);
        header.appendChild(controls); container.appendChild(header);

        const grid = document.createElement('div');
        Object.assign(grid.style, { flex:'1', overflowY:'auto', padding:'20px', display:'grid', gridTemplateColumns:'repeat(7, 1fr)', gap:'10px', alignContent:'start' });
        container.appendChild(grid); overlay.appendChild(container); document.body.appendChild(overlay);

        const items = [];
        const executeDownload = (item, onComplete) => { downloadFromDocument(item.doc, item, onComplete); };
        const updateSelectionCount = () => {
            const selCount = items.filter(i => i.selected && i.status === 'ready').length;
            const readyCount = items.filter(i => i.status === 'ready').length;
            dlSelBtn.innerText = `Download Selected (${selCount})`; dlAllBtn.innerText = `Download ALL (${readyCount})`;
            dlSelBtn.style.opacity = selCount > 0 ? '1' : '0.5'; dlSelBtn.style.pointerEvents = selCount > 0 ? 'auto' : 'none';
            dlAllBtn.style.opacity = readyCount > 0 ? '1' : '0.5'; dlAllBtn.style.pointerEvents = readyCount > 0 ? 'auto' : 'none';
        };
        selAllBtn.onclick = () => { items.forEach(i => { if(i.status === 'ready') { i.selected = true; i.checkbox.checked = true; }}); updateSelectionCount(); };
        deselBtn.onclick = () => { items.forEach(i => { i.selected = false; i.checkbox.checked = false; }); updateSelectionCount(); };
        const updateItemStatus = (item, info, isDownloaded) => {
            item.info = info;
            const typeBadge = item.autoType === '3D' ? ' <span style="color:#d6aaff; font-weight:bold;">[3D]</span>' : ' <span style="color:#aaa;">[2D]</span>';
            const force = forceChk.checked;
            if (isDownloaded && !force) { item.statusText.innerText = "✔ In Library"; item.statusText.style.color = '#50fa7b'; item.status = 'done'; item.checkbox.style.display = 'none'; item.selected = false; }
            else {
                item.status = 'ready'; item.checkbox.style.display = 'block';
                if (isDownloaded && force) { item.statusText.innerHTML = `↻ Redownload${typeBadge}`; item.statusText.style.color = '#ffc107'; }
                else if (info.type === 'auto') { item.statusText.innerHTML = `${info.name}${typeBadge}`; item.statusText.style.color = '#fd7e14'; if(!item.selected) { item.selected = true; item.checkbox.checked = true; } }
                else if (info.type === 'match') { item.statusText.innerHTML = `${info.name}${typeBadge}`; item.statusText.style.color = '#007bff'; if(info.unmapped && info.unmapped.length > 0) { item.statusText.innerHTML += ` <span style="color:#d35400; font-weight:bold;">+ ${info.unmapped.map(toTitleCase).join(', ')}</span>`; } if(!item.selected) { item.selected = true; item.checkbox.checked = true; } }
                else { item.statusText.innerHTML = `Uncategorized${typeBadge}`; item.statusText.style.color = '#777'; item.selected = false; item.checkbox.checked = false; }
            }
            item.statusText.title = info.name; updateSelectionCount();
        };
        forceChk.onchange = () => { items.forEach(i => updateItemStatus(i, i.info, i.isDownloaded)); };
        const launchEditorForItem = (item) => {
            const idx = items.indexOf(item);
            openFocusEditor(item, item.doc, () => { const newInfo = getTargetFolder(item.doc); updateItemStatus(item, newInfo, item.isDownloaded); if(newInfo.type === 'match' && !item.isDownloaded) { item.selected = true; item.checkbox.checked = true; updateSelectionCount(); } }, (itm) => { item.statusText.innerText = "DL Single..."; executeDownload(itm, (success) => { if(success) { item.statusText.innerText = "✔ Saved"; item.statusText.style.color = '#50fa7b'; item.isDownloaded = true; item.status = 'done'; item.checkbox.style.display = 'none'; item.selected = false; updateSelectionCount(); } else { item.statusText.innerText = "Error"; } }); }, { current: idx, total: items.length, hasNext: (idx < items.length - 1), hasPrev: (idx > 0), goNext: () => launchEditorForItem(items[idx+1]), goPrev: () => launchEditorForItem(items[idx-1]) });
        };
        const runScan = async () => {
            statusSpan.innerText = "Scanning..."; grid.innerHTML = ''; items.length = 0;
            const thumbs = document.querySelectorAll(
                'a.thumb, .thumb a, .thumbnail-preview a, ' +             // General boorus
                'div[style*="height: 200px;"] > a, ' +                   // Rule34.us specific thumbnail container
                'a[href*="r=posts/view"][id], ' +                        // Rule34.us, check for link with ID and view param
                'article.thumbnail > a'                                  // E621 specific thumbnail classes
            );
            if(thumbs.length === 0) { statusSpan.innerText = "No images found."; return; }
            for(let thumb of thumbs) {
                let a = (thumb.tagName === 'A') ? thumb : thumb.querySelector('a');
                // For rule34.us snippet, 'a' is directly inside a div, not necessarily 'thumb'
                if (!a && (thumb.tagName === 'DIV' || thumb.tagName === 'ARTICLE')) {
                    a = thumb.querySelector('a[href*="id="], a[href*="/post/show/"], a[href*="r=posts/view"]');
                }

                if(!a || (!a.href.includes('id=') && !a.href.includes('/post/show/') && !a.href.includes('r=posts/view') && !a.href.match(/\/posts\/\d+/))) continue;
                const id = getIdFromUrl(a.href); if (!id) continue;
                const img = thumb.querySelector('img'); const thumbUrl = img ? img.src : '';
                const card = document.createElement('div'); Object.assign(card.style, { display:'flex', flexDirection:'column', backgroundColor:'#333', borderRadius:'4px', overflow:'hidden', boxShadow:'0 2px 5px rgba(0,0,0,0.5)', transition:'transform 0.1s', cursor:'pointer', height:'100%', position:'relative' });
                card.onmouseenter = () => card.style.transform = 'scale(1.03)'; card.onmouseleave = () => card.style.transform = 'scale(1)';
                const chk = document.createElement('input'); chk.type = 'checkbox'; Object.assign(chk.style, { position:'absolute', top:'5px', left:'5px', zIndex:'10', width:'18px', height:'18px', cursor:'pointer' });
                chk.onclick = (e) => { e.stopPropagation(); items.find(i=>i.id===id).selected = chk.checked; updateSelectionCount(); }; card.appendChild(chk);
                const imgDiv = document.createElement('div'); Object.assign(imgDiv.style, { width:'100%', height:'220px', overflow:'hidden', backgroundColor:'#000' });
                const cardImg = document.createElement('img'); cardImg.src = thumbUrl; Object.assign(cardImg.style, { width:'100%', height:'100%', objectFit:'contain' }); imgDiv.appendChild(cardImg);
                const infoDiv = document.createElement('div'); Object.assign(infoDiv.style, { padding:'5px', fontSize:'10px', textAlign:'center', backgroundColor:'#222', borderTop:'1px solid #444', minHeight:'35px', display:'flex', flexDirection:'column', justifyContent:'center' });
                const statusText = document.createElement('div'); statusText.innerText = "Waiting..."; statusText.style.color = '#777'; statusText.style.whiteSpace = 'nowrap'; statusText.style.overflow = 'hidden'; statusText.style.textOverflow = 'ellipsis'; infoDiv.appendChild(statusText);
                card.appendChild(imgDiv); card.appendChild(infoDiv); grid.appendChild(card);
                items.push({ id, card, status: 'waiting', statusText, thumbUrl, fileUrl: null, selected: false, checkbox: chk });
            }
            let processed = 0;
            for (let item of items) {
                if(!document.getElementById('r34-mass-overlay')) break;
                item.status = 'fetching'; item.statusText.innerText = "Fetching...";
                try {
                    let fetchUrl = `${window.location.origin}/index.php?page=post&s=view&id=${item.id}`;
                    if (isMoebooru()) { fetchUrl = `${window.location.origin}/post/show/${item.id}`; }
                    else if (isRule34Us()) { fetchUrl = `${window.location.origin}/index.php?r=posts/view&id=${item.id}`; }
                    else if (isE621()) { fetchUrl = `${window.location.origin}/posts/${item.id}`; }

                    const response = await fetch(fetchUrl); const text = await response.text(); const parser = new DOMParser(); const doc = parser.parseFromString(text, "text/html");
                    item.doc = doc;
                    item.md5 = getPageMD5(doc);
                    item.isDownloaded = isDownloaded(item.md5);
                    item.autoType = detectImageType(doc);

                    // --- ADDED THIS LINE TO FIX SCAN ERROR ---
                    const info = getTargetFolder(doc);
                    // ----------------------------------------

                    let tempFileUrl = "";
                    const originalLink = doc.querySelector('a#image-download-link, a.image-download-link, a[onclick*="javascript:show_original_image"], a[href*="/image/"], a[href*="/file/"]');
                    if (originalLink && originalLink.href && !originalLink.href.includes('/wiki/')) tempFileUrl = originalLink.href;

                    if (!tempFileUrl && isRule34Us()) {
                        const r34UsOriginal = doc.querySelector('a[href*="/images/"][href$=".png"], a[href*="/images/"][href$=".jpg"], a[href*="/images/"][href$=".gif"]');
                        if (r34UsOriginal && r34UsOriginal.textContent.trim().toLowerCase().includes('original')) {
                            tempFileUrl = r34UsOriginal.href;
                        }
                    }

                    if (!tempFileUrl && isE621()) {
                        const e621OriginalLink = doc.querySelector('li#post-file-size a, #raw_image_container > a');
                        if (e621OriginalLink && e621OriginalLink.href) tempFileUrl = e621OriginalLink.href;
                    }

                    if (!tempFileUrl) {
                        const mainImage = doc.querySelector('#image, #main_image, #img, .image-body img, #img-display');
                        if (mainImage && mainImage.src) tempFileUrl = mainImage.src;
                    }

                    if (!tempFileUrl) {
                        const mainVideo = doc.querySelector('video#image, video.image-body, video#gelcomVideoPlayer');
                        if (mainVideo) {
                            const source = mainVideo.querySelector('source');
                            if (source && source.src) tempFileUrl = source.src;
                            else if (mainVideo.src) tempFileUrl = mainVideo.src;
                        }
                    }
                    item.fileUrl = tempFileUrl;

                    item.card.onclick = (e) => { e.stopPropagation(); launchEditorForItem(item); }; updateItemStatus(item, info, item.isDownloaded);
                } catch (e) { console.error(`R34 Script: Error fetching post ${item.id}:`, e); item.statusText.innerText = "Error"; item.statusText.style.color = "red"; }
                processed++; statusSpan.innerText = `Scanned: ${processed}/${items.length}`;
                const sDelay = parseInt(GM_getValue('scan_delay', 500));
                await new Promise(r => setTimeout(r, sDelay));
            }
            statusSpan.innerText = `Ready: ${items.length}`;
        };
        rescanBtn.onclick = runScan;
        dlSelBtn.onclick = () => { const toDl = items.filter(i => i.selected && i.status === 'ready' && i.fileUrl); if(toDl.length === 0) return; if(!confirm(`Download ${toDl.length} selected images?`)) return; startDownloadLoop(toDl); };
        dlAllBtn.onclick = () => { const toDl = items.filter(i => i.status === 'ready' && i.fileUrl); if(toDl.length === 0) return; if(!confirm(`Download ALL ${toDl.length} ready images?`)) return; startDownloadLoop(toDl); };
        const startDownloadLoop = (queue) => {
            let idx = 0;
            const processNext = () => {
                if(idx >= queue.length) { dlSelBtn.innerText = "Finished"; dlAllBtn.innerText = "Finished"; return; }
                const item = queue[idx]; item.statusText.innerText = "⏳ Downloading..."; item.statusText.style.color = "#ccc";
                executeDownload(item, (success) => {
                    if(success) { item.statusText.innerText = "✔ Saved"; item.statusText.style.color = '#28a745'; item.checkbox.checked = false; item.selected = false; item.checkbox.style.display = 'none'; updateSelectionCount(); } else { item.statusText.innerText = "❌ Error"; item.statusText.style.color = 'red'; }
                    idx++; const userDelay = parseInt(GM_getValue('mass_dl_delay', 500)); const delay = userDelay + Math.random() * 250; setTimeout(processNext, delay);
                });
            }; processNext();
        };
        runScan();
    }

    // --- MAIN BUTTONS ---
    function updateMainButton() {
        const sidebar = document.querySelector('#tag-sidebar, #tag-list, .sidebar, .content_left, .tag-list-left, #post-information');
        if (!sidebar) return;

        const existingContainer = document.getElementById('r34-controls'); if(existingContainer) existingContainer.remove();
        const existingMass = document.getElementById('r34-mass-btn'); if(existingMass) existingMass.remove();

        const isView = window.location.href.includes('s=view') || window.location.href.includes('/post/show/') || window.location.href.includes('r=posts/view') || window.location.href.match(/\/posts\/\d+/);
        const isList = window.location.href.includes('s=list') || document.querySelector('.thumb, .thumbnail-preview, a.thumb') || window.location.href.includes('/post') || window.location.href.includes('r=posts/index') || window.location.href.includes('/posts');

        if (isView) {
            const info = getTargetFolder(); const currentMD5 = getPageMD5(); const inHistory = isDownloaded(currentMD5);
            const controls = document.createElement('div'); controls.id = 'r34-controls';
            Object.assign(controls.style, { display: 'flex', gap: '5px', marginBottom: '10px', flexWrap: 'wrap' });

            const dlBtn = document.createElement('button'); dlBtn.id = 'r34-dl-btn';
            Object.assign(dlBtn.style, { width: '100%', padding: '12px', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold', borderRadius: '4px', marginBottom: '5px' });
            dlBtn.onclick = (e) => { e.preventDefault(); downloadImage(info.name, e.shiftKey || inHistory); };

            let autoType = "2D"; const allTags = getAllTags(); const tags3d = load3DTags();
            if(allTags.some(t => tags3d.has(t))) autoType = "3D";

            if (inHistory) { dlBtn.innerText = `✔ In Library (Redownload?)`; dlBtn.style.backgroundColor = '#50fa7b'; dlBtn.style.color = '#222'; }
            else {
                let displayFolder = info.name;
                if (displayFolder.length > 30) displayFolder = displayFolder.substring(0, 27) + "...";
                const typeLabel = (GM_getValue('subfolder_mode') === 'split' || GM_getValue('enable_custom_path', false)) ? ` [${autoType}]` : '';
                if (info.type === "match") { dlBtn.innerText = `⬇ Save: ${displayFolder}` + typeLabel; dlBtn.style.backgroundColor = '#007bff'; }
                else if (info.type === "auto") { dlBtn.innerText = `⬇ Auto: ${displayFolder}` + typeLabel; dlBtn.style.backgroundColor = '#fd7e14'; }
                else { dlBtn.innerText = `⬇ Save (Uncategorized)` + typeLabel; dlBtn.style.backgroundColor = '#6c757d'; }
                dlBtn.title = `Full Path: ${info.name}`;
            }
            controls.appendChild(dlBtn);
            const preview = document.createElement('div'); preview.innerText = `Folder: ${info.name}`;
            Object.assign(preview.style, { fontSize:'10px', color:'#aaa', width:'100%', marginBottom:'5px', wordBreak:'break-all' });
            controls.appendChild(preview);
            const mkBtn = (txt, col, type, forceS) => {
                 const b = document.createElement('button'); b.innerText = txt;
                 Object.assign(b.style, { flex: '1', backgroundColor: col, color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', height: '30px' });
                 if(type === autoType && !forceS) b.style.border = '2px solid white';
                 b.onclick = (e) => { e.preventDefault(); downloadImage(info.name, e.shiftKey, type, forceS); };
                 return b;
            };
            if (GM_getValue('subfolder_mode') === 'split' || GM_getValue('enable_custom_path', false)) {
                 controls.appendChild(mkBtn('2D', '#17a2b8', '2D', false));
                 controls.appendChild(mkBtn('3D', '#6f42c1', '3D', false));
            }
            const unknownTags = getUnknownCharacterTags();
            if (unknownTags.length > 0) {
                const addBtn = document.createElement('button'); addBtn.innerText = '➕';
                Object.assign(addBtn.style, { width: '30px', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px', fontSize: '16px', height: '30px' });
                addBtn.onclick = (e) => {
                    e.preventDefault();
                    const bestSeries = getBestSeriesMatch();
                    openSettingsMenu(toTitleCase(unknownTags[0]), unknownTags.join(','), bestSeries || "");
                };
                controls.appendChild(addBtn);
            }
            const setBtn = document.createElement('button'); setBtn.innerText = '⚙';
            Object.assign(setBtn.style, { width: '30px', backgroundColor: '#343a40', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px', fontSize: '16px', height: '30px' });
            setBtn.onclick = (e) => {
                e.preventDefault();
                const bestSeries = getBestSeriesMatch() || "";
                openSettingsMenu("", "", bestSeries);
            };
            controls.appendChild(setBtn);
            sidebar.insertBefore(controls, sidebar.firstChild);
        }
        else if (isList && !isView) {
            const controls = document.createElement('div');
            Object.assign(controls.style, { marginBottom:'10px' });
            const massBtn = document.createElement('button');
            massBtn.id = 'r34-mass-btn';
            massBtn.innerText = "📥 Page Downloader";
            Object.assign(massBtn.style, { width: '100%', padding: '10px', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold', borderRadius: '4px', backgroundColor: '#6f42c1' });
            massBtn.onclick = (e) => { e.preventDefault(); openMassDownloader(); };
            controls.appendChild(massBtn);
            sidebar.insertBefore(controls, sidebar.firstChild);
        }
    }

    // --- UI HELPERS & SETTINGS BUILDER ---
    function createHelp(tooltipText) { const span = document.createElement('span'); span.innerText = '?'; Object.assign(span.style, { display: 'inline-block', marginLeft: '6px', backgroundColor: '#555', color: '#fff', width: '16px', height: '16px', borderRadius: '50%', textAlign: 'center', fontSize: '11px', lineHeight: '16px', cursor: 'help', fontWeight: 'bold' }); span.title = tooltipText; return span; }
    function makeEditable(container, value, placeholder, onSave) { container.innerHTML = ''; const input = document.createElement('input'); input.value = value; input.placeholder = placeholder; Object.assign(input.style, { width: '100%', padding: '2px 5px', fontSize: '13px', backgroundColor: '#111', color: '#fff', border: '1px solid #007bff', borderRadius:'3px' }); const finish = () => onSave(input.value.trim()); input.addEventListener('keydown', (e) => { if (e.key === 'Enter') finish(); if (e.key === 'Escape') onSave(null); }); input.addEventListener('blur', () => finish()); container.appendChild(input); input.focus(); }

    function openSettingsMenu(prefillFolder = "", prefillTag = "", prefillCategory = "", onCloseCallback = null) {
        const existing = document.getElementById('r34-settings-overlay'); if (existing) document.body.removeChild(existing);
        const overlay = document.createElement('div'); overlay.id = 'r34-settings-overlay';
        Object.assign(overlay.style, { position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', zIndex: '10100', display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(3px)' });
        const container = document.createElement('div');
        Object.assign(container.style, { backgroundColor: '#222', color: '#fff', width: '1000px', maxWidth: '95%', borderRadius: '10px', boxShadow: '0 10px 50px rgba(0,0,0,0.9)', border: '1px solid #444', display: 'flex', flexDirection: 'column', fontFamily: 'Arial, sans-serif', overflow: 'hidden', height: '90vh' });

        const header = document.createElement('div'); header.innerHTML = `<span style="font-size:18px">R34 Sorter Settings</span>`;
        Object.assign(header.style, { padding: '15px 20px', backgroundColor: '#007bff', fontWeight: 'bold' }); container.appendChild(header);
        const tabNav = document.createElement('div'); Object.assign(tabNav.style, { display:'flex', backgroundColor:'#2c3036', borderBottom:'1px solid #444' });
        const btnSettings = document.createElement('button'); btnSettings.innerText = "General Settings";
        Object.assign(btnSettings.style, { flex:'1', padding:'10px', background:'#444', border:'none', color:'#fff', cursor:'pointer', fontWeight:'bold', borderBottom:'3px solid #007bff' });
        const btnRules = document.createElement('button'); btnRules.innerText = "Rules & Filters";
        Object.assign(btnRules.style, { flex:'1', padding:'10px', background:'transparent', border:'none', color:'#aaa', cursor:'pointer', fontWeight:'bold', borderBottom:'3px solid transparent' });
        tabNav.appendChild(btnSettings); tabNav.appendChild(btnRules); container.appendChild(tabNav);
        const contentArea = document.createElement('div'); Object.assign(contentArea.style, { flex:'1', overflowY:'auto', display:'flex', flexDirection:'column' });

        // --- TAB 1: SETTINGS ---
        const tab1 = document.createElement('div'); Object.assign(tab1.style, { padding: '20px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px' });
        const createSetting = (label, help, configKey, defaultVal, options = null, isArea = false, previewFn = null, isCheckbox = false) => {
            const div = document.createElement('div'); const top = document.createElement('div'); top.innerHTML = `<span style="font-size:12px; color:#ccc">${label}</span>`;
            if(help) top.appendChild(createHelp(help)); div.appendChild(top); let input;
            if(isCheckbox) { const wrapper = document.createElement('div'); Object.assign(wrapper.style, { marginTop:'5px', display:'flex', alignItems:'center', gap:'10px' }); input = document.createElement('input'); input.type = 'checkbox'; input.checked = GM_getValue(configKey, defaultVal); input.onchange = () => { GM_setValue(configKey, input.checked); }; wrapper.appendChild(input); wrapper.appendChild(document.createTextNode(input.checked?"Enabled":"Disabled")); div.appendChild(wrapper); }
            else if(options) { input = document.createElement('select'); input.className = 'setting-input'; options.forEach(opt => { const o = document.createElement('option'); o.value = opt.val; o.innerText = opt.text; if(GM_getValue(configKey, defaultVal)===opt.val) o.selected=true; input.appendChild(o); }); input.onchange = () => GM_setValue(configKey, input.value); Object.assign(input.style, { width: '100%', padding: '4px', backgroundColor: '#111', color: '#fff', border:'1px solid #555' }); div.appendChild(input); }
            else if(isArea) { input = document.createElement('textarea'); input.className = 'setting-input'; input.value = GM_getValue(configKey, defaultVal); input.rows = 6; input.onchange = () => GM_setValue(configKey, input.value.trim()); Object.assign(input.style, { width: '100%', fontFamily:'monospace', fontSize:'11px', resize:'vertical', backgroundColor: '#111', color: '#fff', border:'1px solid #555' }); div.appendChild(input); }
            else { input = document.createElement('input'); input.className = 'setting-input'; input.value = GM_getValue(configKey, defaultVal); input.onchange = () => GM_setValue(configKey, input.value.trim()); if(previewFn) { input.onkeyup = previewFn; } Object.assign(input.style, { width: '100%', padding: '4px', backgroundColor: '#111', color: '#fff', border:'1px solid #555' }); div.appendChild(input); }
            if(previewFn) { const p = document.createElement('div'); p.className = 'fn-preview-box'; Object.assign(p.style, {fontSize:'11px', color:'#8fd3ff', marginTop:'3px'}); div.appendChild(p); setTimeout(previewFn, 10); } return div;
        };
        const fnPreview = () => { const p = document.querySelectorAll('.fn-preview-box')[0]; if(p) p.innerText = "Ex: " + generateFilename(document, '123', 'abc'); };
        tab1.appendChild(createSetting("Main Folder", "Location", "root_folder", DEFAULT_ROOT));
        tab1.appendChild(createSetting("Structure", "Mode", "folder_structure", "full", [{val:'full', text:'Full'},{val:'nested', text:'Nested'},{val:'flat', text:'Flat'}]));
        tab1.appendChild(createSetting("Sort Order", "Order", "order_mode", "path_first", [{val:'path_first', text:'Path > Type'},{val:'type_first', text:'Type > Path'}]));
        tab1.appendChild(createSetting("Subfolders", "Split?", "subfolder_mode", "none", [{val:'none', text:'No'},{val:'split', text:'Yes (2D/3D)'}]));
        tab1.appendChild(createSetting("Filename", "Pattern", "filename_pattern", DEFAULT_FILENAME, null, false, fnPreview));
        tab1.appendChild(createSetting("Batch Delay (ms)", "Time to wait between downloads to prevent bans. (Default: 500)", "mass_dl_delay", 500));
        tab1.appendChild(createSetting("Scan Delay (ms)", "Time to wait between fetching image details. (Default: 500)", "scan_delay", 500));
        const customPathPreview = () => {
            const previewBox = document.querySelector('.custom-path-preview-box'); const patternInput = document.querySelector('input[data-config-key="custom_path_pattern"]');
            if (previewBox && patternInput) { const pattern = patternInput.value; let examplePath = pattern.replace(/%root%/g, "Rule34").replace(/%series%/g, "Overwatch").replace(/%type%/g, "2D").replace(/%char%/g, "Widowmaker").replace(/%filename%/g, "12345.jpg"); previewBox.innerText = "Ex: " + examplePath.replace(/\/+/g, '/'); }
        };
        tab1.appendChild(createSetting("Enable Custom Path", "Overrides all other path settings with the pattern below.", "enable_custom_path", false, null, false, null, true));
        const customPathSetting = createSetting("Custom Path Pattern", "Define your own folder structure. Click the buttons below to build your path.", "custom_path_pattern", DEFAULT_CUSTOM_PATH, null, false, customPathPreview);
        const inputElement = customPathSetting.querySelector('input.setting-input'); if (inputElement) { inputElement.setAttribute('data-config-key', 'custom_path_pattern'); }
        const previewBox = customPathSetting.querySelector('.fn-preview-box'); if (previewBox) { previewBox.className = 'fn-preview-box custom-path-preview-box'; }
        const pathBuilderContainer = document.createElement('div');
        Object.assign(pathBuilderContainer.style, { display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '8px', padding: '8px', backgroundColor: '#1a1a1a', border: '1px solid #444', borderRadius: '4px' });
        const placeholders = ['%root%', '%series%', '%type%', '%char%', '%filename%', '/'];
        const insertAtCursor = (text) => { if (!inputElement) return; const start = inputElement.selectionStart; const end = inputElement.selectionEnd; const originalValue = inputElement.value; inputElement.value = originalValue.slice(0, start) + text + originalValue.slice(end); inputElement.selectionStart = inputElement.selectionEnd = start + text.length; inputElement.focus(); customPathPreview(); };
        placeholders.forEach(placeholder => { const pill = document.createElement('span'); pill.innerText = placeholder; Object.assign(pill.style, { padding: '3px 8px', backgroundColor: placeholder === '/' ? '#555' : '#007bff', color: 'white', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold', fontFamily: 'monospace' }); pill.title = `Click to add "${placeholder}" to the path`; pill.onclick = () => insertAtCursor(placeholder); pathBuilderContainer.appendChild(pill); });
        customPathSetting.appendChild(pathBuilderContainer); tab1.appendChild(customPathSetting);
        const uncategorizedSettingsContainer = document.createElement('div');
        Object.assign(uncategorizedSettingsContainer, { gridColumn: '1 / -1', borderTop: '1px solid #444', marginTop: '10px', paddingTop: '10px' });
        const ucTitle = document.createElement('h4'); ucTitle.innerText = "Uncategorized Image Handling"; Object.assign(ucTitle.style, { marginTop: 0, marginBottom: '10px', color: '#007bff' }); uncategorizedSettingsContainer.appendChild(ucTitle);
        const ucSettingsGrid = document.createElement('div'); Object.assign(ucSettingsGrid.style, { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' });
        ucSettingsGrid.appendChild(createSetting("Uncategorized Mode", "What to do when an image does not match any of your rules.", "uncategorized_mode", "default", [{val:'default', text:'Save to "Uncategorized" Folder'}, {val:'artist', text:'Save to Artist Folder'}]));
        ucSettingsGrid.appendChild(createSetting("Fallback Artist Name", "Folder name to use in 'Artist Mode' when no artist tag is found.", "fallback_artist_name", "Unknown Artist"));
        ucSettingsGrid.appendChild(createSetting("Fallback Series Name", "Folder name to use for the %series% placeholder when an image has no series/copyright tag.", "fallback_series_name", "_Unsorted"));
        uncategorizedSettingsContainer.appendChild(ucSettingsGrid); tab1.appendChild(uncategorizedSettingsContainer);

        const sepContainer = document.createElement('div');
        Object.assign(sepContainer.style, { gridColumn: '1 / -1', borderTop: '1px solid #444', marginTop: '10px', paddingTop: '10px' });
        const sepTitle = document.createElement('h4'); sepTitle.innerText = "Site Separation (Subfolders)";
        Object.assign(sepTitle.style, { marginTop: 0, marginBottom: '5px', color: '#007bff' }); sepContainer.appendChild(sepTitle);
        const sepDesc = document.createElement('div'); sepDesc.innerText = "Check specific sites to isolate their downloads into a subfolder (e.g. /Root/Realbooru/...). Unchecked sites will mix into the main root.";
        Object.assign(sepDesc.style, { fontSize:'11px', color:'#aaa', marginBottom:'10px' }); sepContainer.appendChild(sepDesc);
        const sepGrid = document.createElement('div'); Object.assign(sepGrid.style, { display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'10px' });
        const mkSep = (label, key) => { const w = document.createElement('div'); const c = document.createElement('input'); c.type = 'checkbox'; c.checked = GM_getValue(key, false); c.onchange = () => GM_setValue(key, c.checked); const l = document.createElement('span'); l.innerText = label; l.style.marginLeft = '5px'; w.appendChild(c); w.appendChild(l); return w; };
        sepGrid.appendChild(mkSep("Separate Realbooru", "sep_realbooru")); sepGrid.appendChild(mkSep("Separate Safebooru", "sep_safebooru")); sepGrid.appendChild(mkSep("Separate Gelbooru", "sep_gelbooru"));
        sepGrid.appendChild(mkSep("Separate Rule34", "sep_rule34")); sepGrid.appendChild(mkSep("Separate Xbooru", "sep_xbooru")); sepGrid.appendChild(mkSep("Separate TBIB", "sep_tbib"));
        sepGrid.appendChild(mkSep("Separate Yande.re", "sep_yande")); sepGrid.appendChild(mkSep("Separate Konachan", "sep_konachan")); sepGrid.appendChild(mkSep("Separate Rule34.us", "sep_rule34us"));
        sepGrid.appendChild(mkSep("Separate E621/E926", "sep_e621"));
        sepContainer.appendChild(sepGrid); tab1.appendChild(sepContainer);

        const historyContainer = document.createElement('div');
        Object.assign(historyContainer.style, { gridColumn: '1 / -1', borderTop: '1px solid #444', marginTop: '10px', paddingTop: '10px', display:'flex', flexDirection:'column', gap:'10px' });
        const historyTitle = document.createElement('h4'); historyTitle.innerText = "Download History (MD5 Cache)";
        Object.assign(historyTitle.style, { marginTop: 0, marginBottom: '5px', color: '#007bff' }); historyContainer.appendChild(historyTitle);
        historyContainer.appendChild(createSetting("Track Download History", "Remember downloaded files to prevent duplicates. Uncheck to disable.", "enable_md5_tracking", true, null, false, null, true));
        const clearRow = document.createElement('div');
        Object.assign(clearRow.style, { padding: '10px', backgroundColor: '#333', border: '1px solid #444', borderRadius:'4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' });
        const clearLabel = document.createElement('span'); clearLabel.innerHTML = "<strong>Clear History Cache</strong><br><span style='font-size:10px; color:#aaa'>If you deleted files from your disk, click this to reset their 'In Library' status.</span>";
        const clearBtn = document.createElement('button'); clearBtn.innerText = "🗑 Clear All History";
        Object.assign(clearBtn.style, { backgroundColor: '#d9534f', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', fontWeight:'bold' });
        clearBtn.onclick = () => { const count = GM_getValue('md5_history', []).length; if(confirm(`Are you sure you want to forget ${count} downloaded images?\n\nThis will allow you to download previously saved files again.`)) { GM_setValue('md5_history', []); alert("History Cleared."); clearBtn.innerText = "✔ Cleared"; } };
        clearRow.appendChild(clearLabel); clearRow.appendChild(clearBtn); historyContainer.appendChild(clearRow); tab1.appendChild(historyContainer);
        contentArea.appendChild(tab1);

        // --- TAB 2: RULES ---
        const tab2 = document.createElement('div'); Object.assign(tab2.style, { display:'none', flexDirection:'column', height:'100%' });
        const profileRow = document.createElement('div');
        Object.assign(profileRow.style, { padding: '10px 15px', backgroundColor: '#2a2a2a', borderBottom: '1px solid #444', display: 'flex', justifyContent: 'space-between', alignItems: 'center' });
        const profileLabel = document.createElement('div'); profileLabel.innerHTML = "<strong>Profile Management</strong> <span style='font-size:11px; color:#888'>(Rules, Filters, Aliases)</span>";
        const profileBtnGroup = document.createElement('div'); Object.assign(profileBtnGroup.style, { display: 'flex', gap: '10px' });
        const exportBtn = document.createElement('button'); exportBtn.innerText = "⬇ Export Profile";
        Object.assign(exportBtn.style, { padding: '5px 10px', backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' });
        const importBtn = document.createElement('button'); importBtn.innerText = "⬆ Import Profile";
        Object.assign(importBtn.style, { padding: '5px 10px', backgroundColor: '#f39c12', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' });
        exportBtn.onclick = () => {
            const data = { version: "6.2", timestamp: Date.now(), rules: loadRules(), aliases: loadSeriesMap(), filters: { ignored_series: [...loadIgnoredSeries()], ignored_characters: [...loadIgnoredCharacters()], ignored_artists: [...loadIgnoredArtists()], tags_3d: [...load3DTags()] } };
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `R34_Profile_${new Date().toISOString().slice(0, 10)}.json`; a.click(); URL.revokeObjectURL(url);
        };
        const fileInput = document.createElement('input'); fileInput.type = 'file'; fileInput.accept = '.json'; fileInput.style.display = 'none';
        fileInput.onchange = (e) => {
            const file = e.target.files[0]; if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
                try {
                    const imported = JSON.parse(ev.target.result);
                    if (!confirm("Import this profile? \n\nExisting rules for specific tags will be overwritten by the file.\nUnique local rules will be kept.")) return;
                    if (imported.rules) {
                        const currentRules = loadRules(); const reverseImportMap = new Map();
                        Object.entries(imported.rules).forEach(([folder, tags]) => { tags.forEach(t => reverseImportMap.set(t, folder)); });
                        Object.keys(currentRules).forEach(folder => { currentRules[folder] = currentRules[folder].filter(tag => !reverseImportMap.has(tag)); if (currentRules[folder].length === 0) delete currentRules[folder]; });
                        Object.entries(imported.rules).forEach(([folder, tags]) => { if (!currentRules[folder]) currentRules[folder] = []; tags.forEach(t => { if (!currentRules[folder].includes(t)) currentRules[folder].push(t); }); });
                        saveRules(currentRules);
                    }
                    if (imported.aliases) { const currentMap = loadSeriesMap(); Object.assign(currentMap, imported.aliases); const lines = []; Object.entries(currentMap).forEach(([tag, series]) => lines.push(`${tag} = ${series}`)); saveSeriesMap(lines.join('\n')); }
                    if (imported.filters) {
                        const mergeList = (key, importList) => { if (!importList) return; const current = new Set(GM_getValue(key, "").split('\n').filter(t => t.trim())); importList.forEach(t => current.add(t)); GM_setValue(key, Array.from(current).join('\n')); };
                        mergeList('ignored_series', imported.filters.ignored_series); mergeList('ignored_characters', imported.filters.ignored_characters); mergeList('ignored_artists', imported.filters.ignored_artists); mergeList('tags_3d', imported.filters.tags_3d);
                    }
                    alert("✔ Profile Imported Successfully!\nThe menu will now refresh."); openSettingsMenu();
                } catch (err) { console.error(err); alert("❌ Error parsing profile file."); }
            }; reader.readAsText(file); fileInput.value = '';
        };
        importBtn.onclick = () => fileInput.click();
        profileBtnGroup.appendChild(exportBtn); profileBtnGroup.appendChild(importBtn); profileRow.appendChild(profileLabel); profileRow.appendChild(profileBtnGroup); tab2.appendChild(profileRow);

        const blocklistRow = document.createElement('div'); Object.assign(blocklistRow.style, { display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:'10px', padding:'15px', backgroundColor:'#222', borderBottom:'1px solid #333' });
        blocklistRow.appendChild(createSetting("Ignored Series", "Prevents Bad Auto-Series Matches", "ignored_series", DEFAULT_IGNORED_SERIES, null, true));
        blocklistRow.appendChild(createSetting("Ignored Characters", "Only used if no other Character exists", "ignored_characters", DEFAULT_IGNORED_CHARACTERS, null, true));
        blocklistRow.appendChild(createSetting("Ignored Artists", "Excluded from Filenames", "ignored_artists", DEFAULT_IGNORED_ARTISTS, null, true));
        blocklistRow.appendChild(createSetting("3D Tags", "Tags that trigger 3D Mode", "tags_3d", DEFAULT_TAGS_3D, null, true));
        tab2.appendChild(blocklistRow);

        const addSection = document.createElement('div');
        Object.assign(addSection.style, { padding: '10px 15px', backgroundColor: '#2a2a2a', borderBottom: '1px solid #444', display:'flex', flexDirection:'column', gap:'10px' });
        const inputsRow = document.createElement('div'); Object.assign(inputsRow.style, { display:'flex', gap:'8px', alignItems:'center' });
        const uniInput = document.createElement('input'); uniInput.placeholder = 'Universe'; uniInput.value = prefillCategory; Object.assign(uniInput.style, { width:'100px', backgroundColor:'#111', color:'#fff', border:'1px solid #555', padding:'4px' });
        const autoUniBtn = document.createElement('button'); autoUniBtn.innerText = 'Auto'; Object.assign(autoUniBtn.style, { padding: '6px 10px', backgroundColor: '#444', color: 'white', border: 'none', borderRadius: '4px', cursor:'pointer', fontSize:'11px' });
        let autoUniIndex = 0; autoUniBtn.onclick = () => { const matches = getAllSeriesMatches(document); if(matches.length > 0) { uniInput.value = stripSlashes(matches[autoUniIndex % matches.length]); uniInput.style.backgroundColor = '#2c3e50'; autoUniIndex++; } else { alert("No copyright tag found."); } };
        const folderInput = document.createElement('input'); folderInput.placeholder = 'Name...'; folderInput.value = prefillFolder; Object.assign(folderInput.style, { flex:'1', backgroundColor:'#111', color:'#fff', border:'1px solid #555', padding:'4px' });
        const saveBtn = document.createElement('button'); saveBtn.innerText = 'ADD RULE'; Object.assign(saveBtn.style, { backgroundColor:'#28a745', color:'white', border:'none', padding:'0 15px', cursor:'pointer', fontWeight:'bold' });
        inputsRow.appendChild(autoUniBtn); inputsRow.appendChild(uniInput); inputsRow.appendChild(folderInput); inputsRow.appendChild(saveBtn); addSection.appendChild(inputsRow);

        let activeTags = prefillTag ? prefillTag.split(',').map(t=>t.trim()).filter(t=>t) : [];
        let allPageCharacters = []; const sidebar = document.querySelector('#tag-sidebar, #tag-list, .sidebar, .tag-list-left, #post-information'); if (sidebar) { allPageCharacters = getAllCharacterTagsOnPage(document); }
        if (allPageCharacters.length > 0) {
            const charShortcutContainer = document.createElement('div');
            Object.assign(charShortcutContainer.style, { display:'flex', flexWrap:'wrap', gap:'5px' });
            allPageCharacters.forEach(char => {
                const btn = document.createElement('button'); btn.innerText = toTitleCase(char);
                Object.assign(btn.style, { fontSize:'10px', padding:'2px 6px', backgroundColor:'#27ae60', color:'white', border:'none', borderRadius:'3px', cursor:'pointer' });
                btn.title = "Set Name + Add Tag"; btn.onclick = () => { folderInput.value = toTitleCase(char); if (!activeTags.includes(char)) { activeTags.push(char); renderAddPills(); } };
                charShortcutContainer.appendChild(btn);
            });
            addSection.appendChild(charShortcutContainer);
        }
        const pillsArea = document.createElement('div'); Object.assign(pillsArea.style, { display:'flex', flexDirection:'column', gap:'5px' });
        const activeTagsContainer = document.createElement('div'); Object.assign(activeTagsContainer.style, { minHeight:'30px', padding:'4px', backgroundColor:'#1a1a1a', border:'1px solid #28a745', borderRadius:'4px', display:'flex', flexWrap:'wrap', gap:'4px' });
        const poolTagsContainer = document.createElement('div'); Object.assign(poolTagsContainer.style, { maxHeight:'100px', overflowY:'auto', padding:'4px', backgroundColor:'#111', border:'1px solid #444', borderRadius:'4px', display:'flex', flexWrap:'wrap', gap:'4px' });
        const renderAddPills = () => {
            activeTagsContainer.innerHTML = ''; poolTagsContainer.innerHTML = '';
            if(activeTags.length === 0) activeTagsContainer.innerHTML = '<span style="color:#555; font-size:10px; font-style:italic; padding:2px;">No tags selected...</span>';
            activeTags.forEach((tag, idx) => {
                const pill = document.createElement('span'); Object.assign(pill.style, { backgroundColor:'#1e7e34', color:'white', fontSize:'11px', padding:'2px 6px', borderRadius:'3px', cursor:'pointer', display:'flex', alignItems:'center', border:'1px solid #28a745' });
                pill.innerHTML = `${tag} <span style="font-weight:bold; margin-left:5px;">×</span>`; pill.onclick = () => { activeTags.splice(idx, 1); renderAddPills(); }; activeTagsContainer.appendChild(pill);
            });
            const pool = allPageCharacters.filter(t => !activeTags.includes(t));
            if (pool.length > 0) { pool.forEach(tag => { const pill = document.createElement('span'); Object.assign(pill.style, { backgroundColor:'#333', color:'#ccc', fontSize:'11px', padding:'2px 6px', borderRadius:'3px', cursor:'pointer', border:'1px solid #444' }); pill.innerText = tag; pill.onclick = () => { activeTags.push(tag); renderAddPills(); }; poolTagsContainer.appendChild(pill); }); } else if (allPageCharacters.length > 0) { poolTagsContainer.innerHTML = '<span style="color:#555; font-size:10px; font-style:italic;">All detected characters used.</span>'; } else { poolTagsContainer.style.display = 'none'; }
        };
        const manualInput = document.createElement('input'); manualInput.placeholder = 'Type tag manually & Enter...';
        Object.assign(manualInput.style, { border:'1px solid #444', background:'#111', color:'#fff', fontSize:'12px', padding:'4px', width:'100%' });
        manualInput.onkeydown = (e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); const val = manualInput.value.trim().replace(/,/g, ''); if (val && !activeTags.includes(val)) { activeTags.push(val); manualInput.value = ''; renderAddPills(); } } };
        pillsArea.appendChild(activeTagsContainer); pillsArea.appendChild(manualInput);
        if(allPageCharacters.length > 0) { const poolLabel = document.createElement('div'); poolLabel.innerText = "Available Characters (Click to Add)"; poolLabel.style.fontSize = '10px'; poolLabel.style.color = '#777'; poolLabel.style.marginTop = '5px'; pillsArea.appendChild(poolLabel); pillsArea.appendChild(poolTagsContainer); }
        addSection.appendChild(pillsArea);
        saveBtn.onclick = () => { let u = stripSlashes(uniInput.value.trim()); let f = stripSlashes(folderInput.value.trim()); if(!f || activeTags.length === 0) return; if (u) f = `${u}/${f}`; const groups = loadRules(); if(!groups[f]) groups[f] = []; activeTags.forEach(rawTag => { const clean = normalizeTag(rawTag); if(clean && !groups[f].includes(clean)) groups[f].push(clean); }); saveRules(groups); folderInput.value = ''; activeTags = []; renderAddPills(); uniInput.value = ''; refreshList(); };
        renderAddPills(); tab2.appendChild(addSection);

        const searchRow = document.createElement('div'); Object.assign(searchRow.style, { padding: '10px 15px', backgroundColor: '#1f1f1f', borderBottom: '1px solid #333' });
        const searchInput = document.createElement('input'); searchInput.placeholder = "🔍 Search Rules..."; Object.assign(searchInput.style, { width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#111', color: '#fff' });
        searchInput.onkeyup = () => refreshList(); searchRow.appendChild(searchInput); tab2.appendChild(searchRow);

        const listArea = document.createElement('div'); Object.assign(listArea.style, { flex: '1', overflowY: 'auto', backgroundColor: '#181818' });

        function refreshList() {
            listArea.innerHTML = ''; const groups = loadRules(); const universes = {}; const uncategorized = {}; const filter = searchInput.value.trim().toLowerCase();
            Object.entries(groups).forEach(([fullPath, tags]) => { if (fullPath.includes('/')) { const parts = fullPath.split('/'); const uni = parts[0]; const remainder = parts.slice(1).join('/'); if (!universes[uni]) universes[uni] = []; universes[uni].push({ name: remainder, fullPath: fullPath, tags: tags }); } else { uncategorized[fullPath] = tags; } });
            const matchesFilter = (txt) => txt.toLowerCase().includes(filter);
            const renderRow = (container, currentUni, charName, fullPath, tags, isSkin = false) => {
                const row = document.createElement('div');
                Object.assign(row.style, { display: 'flex', borderBottom: '1px solid #2a2a2a', padding: '4px 15px', alignItems: 'center', backgroundColor: '#181818' });
                if (isSkin) { row.style.paddingLeft = '35px'; row.style.backgroundColor = '#1e1e1e'; }
                const charDiv = document.createElement('div');
                let displayName = charName;
                if(isSkin && charName.includes('/')) { displayName = charName.split('/').pop(); }
                charDiv.innerHTML = `${displayName} <span style="font-size:10px; color:#444; margin-left:3px;">✎</span>`;
                Object.assign(charDiv.style, { flex:'1', maxWidth:'200px', fontWeight: 'bold', color: isSkin ? '#6fb3d2' : '#8fd3ff', fontSize: isSkin ? '12px' : '13px', marginRight:'10px', cursor:'pointer', transition: '0.2s', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' });
                charDiv.onmouseenter = () => { charDiv.style.textDecoration = 'underline'; charDiv.style.color = '#fff'; };
                charDiv.onmouseleave = () => { charDiv.style.textDecoration = 'none'; charDiv.style.color = isSkin ? '#6fb3d2' : '#8fd3ff'; };
                charDiv.onclick = () => { makeEditable(charDiv, charName, "Name", (val) => { if (val === null) { charDiv.innerHTML = `${displayName} <span style="font-size:10px; color:#444; margin-left:3px;">✎</span>`; return; } const newPath = currentUni ? `${currentUni}/${val.trim()}` : val.trim(); if(newPath !== fullPath) { updateEntryPath(fullPath, newPath); refreshList(); } }); };

                const leftContainer = document.createElement('div');
                Object.assign(leftContainer.style, { display:'flex', alignItems:'center', width:'25%', marginRight:'10px' });

                if (isSkin) {
                    const spacer = document.createElement('div'); spacer.innerText = "↳";
                    Object.assign(spacer.style, { color:'#555', marginRight:'8px', minWidth:'30px', textAlign:'right', fontWeight:'bold' });
                    leftContainer.appendChild(spacer);
                } else if(!currentUni) {
                    const uniPill = document.createElement('div'); uniPill.innerText = "Root";
                    Object.assign(uniPill.style, { fontSize: '9px', backgroundColor: '#333', color: '#888', padding: '1px 4px', borderRadius: '3px', marginRight: '6px' });
                    leftContainer.appendChild(uniPill);
                }
                leftContainer.appendChild(charDiv); row.appendChild(leftContainer);

                const tagsDiv = document.createElement('div'); Object.assign(tagsDiv.style, { flex: '1', display: 'flex', flexWrap: 'wrap', gap: '4px', alignItems:'center' });
                tags.forEach(tag => {
                    const pill = document.createElement('span');
                    Object.assign(pill.style, { display:'inline-flex', alignItems:'center', backgroundColor: '#222', border: '1px solid #444', borderRadius: '4px', fontSize: '11px', overflow:'hidden' });
                    const promoteBtn = document.createElement('span'); promoteBtn.innerHTML = '📁';
                    Object.assign(promoteBtn.style, { padding: '1px 5px', color: '#f39c12', cursor:'pointer', borderRight:'1px solid #444', fontSize:'10px' });
                    promoteBtn.title = "Promote this tag to a Subfolder";
                    promoteBtn.onclick = () => { let suggestion = toTitleCase(tag.replace(/_/g, ' ')); const sub = prompt(`Promote tag "${tag}" to a subfolder?`, suggestion); if(sub) { promoteTagToSubfolder(fullPath, tag, sub); refreshList(); } };
                    const tagText = document.createElement('span'); tagText.innerText = tag;
                    Object.assign(tagText.style, { padding: '1px 6px', color: '#bbb', borderRight:'1px solid #444' });
                    const editBtn = document.createElement('span'); editBtn.innerText = '✎';
                    Object.assign(editBtn.style, { padding: '1px 5px', color: '#888', cursor:'pointer', borderRight: '1px solid #444', fontSize:'10px' });
                    editBtn.onclick = (e) => {
                        e.stopPropagation(); const input = document.createElement('input'); input.value = tag;
                        Object.assign(input.style, { width: Math.max(50, tag.length * 7) + 'px', backgroundColor: '#111', color: '#fff', border: '1px solid #007bff', padding: '0 2px', fontSize: '11px', borderRadius: '3px', height:'16px' });
                        const finishEdit = () => { const newVal = normalizeTag(input.value); if(newVal && newVal !== tag) { const r = loadRules(); if(r[fullPath]) { const idx = r[fullPath].indexOf(tag); if(idx !== -1) { r[fullPath][idx] = newVal; saveRules(r); refreshList(); } } } else { refreshList(); } };
                        input.addEventListener('keydown', (ev) => { if(ev.key === 'Enter') finishEdit(); if(ev.key === 'Escape') refreshList(); }); input.addEventListener('blur', finishEdit);
                        pill.replaceWith(input); input.focus();
                    };
                    const removeBtn = document.createElement('span'); removeBtn.innerText = '×';
                    Object.assign(removeBtn.style, { padding: '1px 5px', color: '#d9534f', cursor:'pointer', fontWeight:'bold' });
                    removeBtn.onclick = (e) => { e.stopPropagation(); removeTagFromPath(fullPath, tag); refreshList(); };
                    pill.appendChild(promoteBtn); pill.appendChild(tagText); pill.appendChild(editBtn); pill.appendChild(removeBtn); tagsDiv.appendChild(pill);
                });
                const plusTagsBtn = document.createElement('span'); plusTagsBtn.innerText = '+'; Object.assign(plusTagsBtn.style, { cursor: 'pointer', marginLeft: '5px', color: '#555', fontSize: '14px', fontWeight: 'bold' });
                plusTagsBtn.onclick = () => { const currentTagString = tags.join(', ') + (tags.length>0 ? ", " : ""); tagsDiv.innerHTML = ''; const input = document.createElement('input'); input.value = currentTagString; Object.assign(input.style, { width: '100%', backgroundColor: '#111', color: '#f39c12', border: '1px solid #28a745', padding: '4px', fontSize: '12px' }); const save = () => { const newTags = input.value.split(',').map(t => t.trim()).filter(t => t); updateTagsForPath(fullPath, newTags); refreshList(); }; input.addEventListener('keydown', (e) => { if(e.key === 'Enter') save(); if(e.key === 'Escape') refreshList(); }); input.addEventListener('blur', save); tagsDiv.appendChild(input); input.focus(); }; tagsDiv.appendChild(plusTagsBtn);
                const delBtn = document.createElement('button'); delBtn.innerText = '✕'; Object.assign(delBtn.style, { background: 'none', border: 'none', cursor: 'pointer', color:'#d9534f', marginLeft:'auto' }); delBtn.onclick = () => { if(confirm(`Delete "${charName}"?`)) { const g = loadRules(); delete g[fullPath]; saveRules(g); refreshList(); } };
                row.appendChild(tagsDiv); row.appendChild(delBtn); container.appendChild(row);
            };

            Object.entries(uncategorized).forEach(([folder, tags]) => { if(matchesFilter(folder) || tags.some(t => matchesFilter(t))) renderRow(listArea, null, folder, folder, tags); });
            Object.keys(universes).sort().forEach(uniName => {
                const seriesTags = getTagsForSeries(uniName); const uniMatches = matchesFilter(uniName); const aliasMatches = seriesTags.some(t => matchesFilter(t)); const items = universes[uniName]; const filteredItems = (uniMatches || aliasMatches) ? items : items.filter(item => matchesFilter(item.name) || item.tags.some(t => matchesFilter(t))); if (filteredItems.length === 0) return;
                const catContainer = document.createElement('div'); const catHeader = document.createElement('div'); Object.assign(catHeader.style, { padding: '8px 15px', backgroundColor: '#222', borderBottom:'1px solid #333', display:'flex', alignItems:'center' });
                const title = document.createElement('span'); title.innerText = uniName; Object.assign(title.style, { fontWeight:'bold', color:'#f39c12', marginRight:'10px', cursor:'pointer' }); title.onclick = () => { makeEditable(title, uniName, "Universe Name", (val) => { if (val !== null && val !== uniName) { renameUniverse(uniName, val); refreshList(); } else { title.innerText = uniName; } }); };
                const aliasSpan = document.createElement('span'); aliasSpan.innerText = seriesTags.length ? `[${seriesTags.join(', ')}]` : '[No Aliases]'; Object.assign(aliasSpan.style, { fontSize:'10px', color:'#777', cursor:'pointer' }); aliasSpan.onclick = () => { const currentStr = seriesTags.join(', '); catHeader.innerHTML = ''; const input = document.createElement('input'); input.value = currentStr; Object.assign(input.style, { width: '100%', backgroundColor: '#111', color: '#f39c12', border: '1px solid #f39c12', padding: '4px', fontSize: '12px' }); const save = () => { const newTags = input.value.split(',').map(t => t.trim()).filter(t => t); updateSeriesAliases(uniName, newTags); refreshList(); }; input.addEventListener('keydown', (e) => { if(e.key === 'Enter') save(); if(e.key === 'Escape') refreshList(); }); input.addEventListener('blur', save); catHeader.appendChild(input); input.focus(); };
                const plusAliasBtn = document.createElement('span'); plusAliasBtn.innerText = '+'; Object.assign(plusAliasBtn.style, { cursor: 'pointer', marginLeft: '8px', color: '#777', fontSize: '12px', fontWeight:'bold' }); plusAliasBtn.onclick = () => { const currentStr = seriesTags.join(', ') + (seriesTags.length > 0 ? ", " : ""); catHeader.innerHTML = ''; const input = document.createElement('input'); input.value = currentStr; Object.assign(input.style, { width: '100%', backgroundColor: '#111', color: '#f39c12', border: '1px solid #28a745', padding: '4px', fontSize: '12px' }); const save = () => { const newTags = input.value.split(',').map(t => t.trim()).filter(t => t); updateSeriesAliases(uniName, newTags); refreshList(); }; input.addEventListener('keydown', (e) => { if(e.key === 'Enter') save(); if(e.key === 'Escape') refreshList(); }); input.addEventListener('blur', save); catHeader.appendChild(input); input.focus(); };
                catHeader.appendChild(title); catHeader.appendChild(aliasSpan); catHeader.appendChild(plusAliasBtn); catContainer.appendChild(catHeader);

                const legendRow = document.createElement('div');
                Object.assign(legendRow.style, { display:'flex', padding:'2px 15px', fontSize:'9px', color:'#555', textTransform:'uppercase', letterSpacing:'1px', marginTop:'2px' });
                const legendLeft = document.createElement('div'); legendLeft.innerText = "Folder / Character Name"; legendLeft.style.width = '25%';
                const legendRight = document.createElement('div'); legendRight.innerText = "Trigger Tags (Aliases)"; legendRight.style.flex = '1';
                legendRow.appendChild(legendLeft); legendRow.appendChild(legendRight); catContainer.appendChild(legendRow);

                const lookup = {}; filteredItems.forEach(item => lookup[item.fullPath] = item); const roots = [];
                filteredItems.forEach(item => { item.children = []; const lastSlash = item.fullPath.lastIndexOf('/'); if (lastSlash > -1) { const parentPath = item.fullPath.substring(0, lastSlash); if (lookup[parentPath]) { lookup[parentPath].children.push(item); return; } } roots.push(item); }); roots.sort((a,b) => a.name.localeCompare(b.name)); Object.values(lookup).forEach(node => { if(node.children) node.children.sort((a,b) => a.name.localeCompare(b.name)); });
                roots.forEach(rootItem => { renderRow(catContainer, uniName, rootItem.name, rootItem.fullPath, rootItem.tags, false); if(rootItem.children) rootItem.children.forEach(child => renderRow(catContainer, uniName, child.name, child.fullPath, child.tags, true)); });
                listArea.appendChild(catContainer);
            });
        }
        tab2.appendChild(listArea); contentArea.appendChild(tab2); container.appendChild(contentArea);
        const footer = document.createElement('div'); Object.assign(footer.style, { padding: '10px', textAlign: 'right', borderTop: '1px solid #444', backgroundColor:'#222' });
        const closeBtn = document.createElement('button'); closeBtn.innerText = 'Done'; Object.assign(closeBtn.style, { padding: '5px 20px', fontWeight: 'bold', cursor:'pointer' });
        closeBtn.onclick = () => { document.body.removeChild(overlay); updateMainButton(); if(onCloseCallback) onCloseCallback(); };
        footer.appendChild(closeBtn); container.appendChild(footer);
        btnSettings.onclick = () => { tab1.style.display = 'grid'; tab2.style.display = 'none'; btnSettings.style.borderBottom = '3px solid #007bff'; btnRules.style.borderBottom = '3px solid transparent'; };
        btnRules.onclick = () => { tab1.style.display = 'none'; tab2.style.display = 'flex'; btnRules.style.borderBottom = '3px solid #007bff'; btnSettings.style.borderBottom = '3px solid transparent'; refreshList(); };
        overlay.appendChild(container); document.body.appendChild(overlay);
        if(prefillFolder) { btnRules.click(); } else { btnSettings.click(); }
    }

// --- SAVED SEARCHES (Fixed for e621 Textarea) ---
    function initSavedSearches() {
        if (document.getElementById('r34-saved-row')) return;
        // UPDATED: Added textarea selectors for e621
        const searchInput = document.querySelector('input[name="tags"], input[name="q"], textarea[name="tags"], textarea#tags');
        const sidebar = document.querySelector('#tag-sidebar, #tag-list, .sidebar, .content_left, .tag-list-left, #post-information');
        const searchForm = searchInput ? (searchInput.closest('form') || searchInput.parentNode) : null;
        if (!searchInput) return;

        const savedRow = document.createElement('div');
        savedRow.id = 'r34-saved-row';
        Object.assign(savedRow.style, { marginBottom: '8px', display:'flex', alignItems:'center', gap:'5px', fontFamily: 'Arial, sans-serif', flexWrap: 'wrap' });

        const style = document.createElement('style');
        style.innerHTML = `#r34-preset-btn { display: inline-block; padding: 3px 8px; background-color: #2b2b2b; border: 1px solid #444; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 12px; color: #aae5a4; user-select: none; transition: background 0.2s; } #r34-preset-btn:hover { background-color: #383838; border-color: #666; } #r34-preset-menu { display: none; position: absolute; z-index: 9999; background: #1f1f1f; border: 1px solid #444; border-radius: 5px; box-shadow: 0 4px 10px rgba(0,0,0,0.5); width: 300px; padding: 10px; margin-top: 2px; font-family: Verdana, sans-serif; font-size: 12px; text-align: left; color: #ddd; } .r34-preset-item { display: flex; justify-content: space-between; align-items: center; background: #2a2a2a; border: 1px solid #333; margin-bottom: 5px; padding: 5px; border-radius: 3px; cursor: pointer; } .r34-preset-item:hover { background: #333; border-color: #555; } .r34-preset-label { flex-grow: 1; font-weight: bold; color: #8fbbe6; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; } .r34-preset-del { color: #ff6666; font-weight: bold; padding: 0 5px; cursor: pointer; } .r34-preset-del:hover { background: #442222; border-radius: 3px; } .r34-preset-add-box { margin-top: 10px; padding-top: 10px; border-top: 1px solid #444; } .r34-inp { width: 100%; box-sizing: border-box; margin-bottom: 5px; padding: 5px; border: 1px solid #444; background: #2a2a2a; color: #eee; border-radius: 3px; } .r34-btn-small { width: 100%; padding: 5px; cursor: pointer; background: #333; border: 1px solid #555; color: #ddd; border-radius: 3px; } .r34-btn-small:hover { background: #444; } #r34-quick-save-btn { display: inline-block; padding: 3px 8px; background-color: #2b2b2b; border: 1px solid #444; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 12px; color: #ccc; user-select: none; transition: background 0.2s; } #r34-quick-save-btn:hover { background-color: #383838; border-color: #666; color: #fff; }`;
        document.head.appendChild(style);

        const PRESET_KEY = 'r34_saved_presets_v3'; const loadPresets = () => { try { return JSON.parse(localStorage.getItem(PRESET_KEY)) || []; } catch(e) { return []; } }; const savePresets = (data) => localStorage.setItem(PRESET_KEY, JSON.stringify(data));
        if (loadPresets().length === 0) { savePresets([{ label: "3D Software Mix", query: "( 3dcg ~ 3dx ~ 3d ~ 3d_* ~ daz_studio ~ daz3d ~ daz_3d ~ blender ~ blender_(software) ~ blender_cycles ~ blender_(artwork) ~ blender_eevee* ~ blender3d ~ blender3d ~ sfm ~ source_filmmaker ~ source_filmmaker_(artwork) )" }]); }
        const appendTag = (text) => { const currentVal = searchInput.value.trim(); searchInput.value = currentVal ? (currentVal + " " + text + " ") : (text + " "); searchInput.focus(); };

        const renderPresets = (listContainer) => {
            listContainer.innerHTML = ''; const data = loadPresets();
            if (data.length === 0) { listContainer.innerHTML = '<div style="padding:5px; color:#666; text-align:center;">No presets saved.</div>'; return; }
            data.forEach((item, index) => {
                const div = document.createElement('div'); div.className = 'r34-preset-item'; div.title = item.query;
                const label = document.createElement('div'); label.className = 'r34-preset-label'; label.innerText = item.label; label.onclick = () => appendTag(item.query);
                const del = document.createElement('div'); del.className = 'r34-preset-del'; del.innerText = '×'; del.onclick = (e) => { e.stopPropagation(); if(confirm('Delete "'+item.label+'"?')) { data.splice(index, 1); savePresets(data); renderPresets(listContainer); } };
                div.appendChild(label); div.appendChild(del); listContainer.appendChild(div);
            });
        };

        const btn = document.createElement('span'); btn.id = 'r34-preset-btn'; btn.innerText = '★ Saved Searches'; savedRow.appendChild(btn);
        const quickSaveBtn = document.createElement('span'); quickSaveBtn.id = 'r34-quick-save-btn'; quickSaveBtn.innerText = '+ Save Current'; quickSaveBtn.title = "Save text currently in search bar";
        quickSaveBtn.onclick = (e) => { e.preventDefault(); const currentQuery = searchInput.value.trim(); if(!currentQuery) { alert("Search bar is empty!"); return; } const name = prompt("Name this search:", "My Search"); if(name) { const data = loadPresets(); data.push({ label: name, query: currentQuery }); savePresets(data); alert("Saved!"); } };
        savedRow.appendChild(quickSaveBtn);

        if (sidebar) { sidebar.insertBefore(savedRow, sidebar.firstChild); }
        else if (searchForm && searchForm.nextSibling) { searchForm.parentNode.insertBefore(savedRow, searchForm.nextSibling); }
        else if (searchForm) { searchForm.parentNode.appendChild(savedRow); }

        const menu = document.createElement('div'); menu.id = 'r34-preset-menu'; menu.innerHTML = `<div id="r34-preset-list" style="max-height:200px; overflow-y:auto;"></div><div class="r34-preset-add-box"><input type="text" id="r34-new-label" class="r34-inp" placeholder="Name"><input type="text" id="r34-new-query" class="r34-inp" placeholder="Tags"><button id="r34-add-btn" class="r34-btn-small">+ Save New</button></div><div style="text-align:right; margin-top:5px;"><small style="color:#666; cursor:pointer;" onclick="document.getElementById('r34-preset-menu').style.display='none'">[Close]</small></div>`; document.body.appendChild(menu);
        btn.onclick = () => { if (menu.style.display === 'block') { menu.style.display = 'none'; return; } menu.style.display = 'block'; const rect = btn.getBoundingClientRect(); menu.style.top = (rect.bottom + (window.pageYOffset||document.documentElement.scrollTop) + 2) + 'px'; menu.style.left = (rect.left + (window.pageXOffset||document.documentElement.scrollLeft)) + 'px'; renderPresets(document.getElementById('r34-preset-list')); };
        document.getElementById('r34-add-btn').onclick = () => { const l = document.getElementById('r34-new-label').value; const q = document.getElementById('r34-new-query').value; if (l && q) { const data = loadPresets(); data.push({ label: l, query: q }); savePresets(data); renderPresets(document.getElementById('r34-preset-list')); document.getElementById('r34-new-label').value=''; document.getElementById('r34-new-query').value=''; } };
        document.addEventListener('click', (e) => { if (!menu.contains(e.target) && !btn.contains(e.target) && !quickSaveBtn.contains(e.target)) menu.style.display = 'none'; });
    }

// --- FAVORITE PILLS (Fixed for e621 Data Attributes & Textarea) ---
    function initFavoritePills() {
        if (document.getElementById('r34-fav-pills-wrapper')) return;

        // Fix 1: Search for textarea as well as input (e621 uses textarea)
        const searchInput = document.querySelector('input[name="tags"], input[name="q"], textarea[name="tags"], textarea#tags');
        if (!searchInput) return;

        const savedRow = document.getElementById('r34-saved-row');

        const wrapper = document.createElement('div');
        wrapper.id = 'r34-fav-pills-wrapper';
        Object.assign(wrapper.style, { marginBottom: '10px', fontFamily: 'Arial, sans-serif', border:'1px solid #333', borderRadius:'4px', backgroundColor:'#1a1a1a' });

        const header = document.createElement('div');
        const isCollapsed = GM_getValue('fav_collapsed', true);
        header.innerText = isCollapsed ? '▶ Show Favorite Tags' : '▼ Hide Favorite Tags';
        Object.assign(header.style, { padding:'5px 10px', fontSize:'11px', color:'#888', cursor:'pointer', backgroundColor:'#222', borderBottom: isCollapsed ? 'none' : '1px solid #333' });

        const container = document.createElement('div');
        container.id = 'r34-fav-pills';
        Object.assign(container.style, { display: isCollapsed ? 'none' : 'flex', flexWrap: 'wrap', gap: '3px', padding:'5px' });

        header.onclick = () => {
            const nowCollapsed = container.style.display !== 'none';
            container.style.display = nowCollapsed ? 'none' : 'flex';
            header.innerText = nowCollapsed ? '▶ Show Favorite Tags' : '▼ Hide Favorite Tags';
            header.style.borderBottom = nowCollapsed ? 'none' : '1px solid #333';
            GM_setValue('fav_collapsed', nowCollapsed);
        };

        const addInput = document.createElement('input');
        addInput.placeholder = "Add favorite tag...";
        Object.assign(addInput.style, { background: '#333', border: '1px solid #555', color: '#fff', fontSize: '10px', padding: '2px 5px', borderRadius: '3px', width: '100px' });

        const getFavs = () => GM_getValue('fav_pills', []);
        const saveFavs = (list) => GM_setValue('fav_pills', list);

        const renderPills = () => {
            Array.from(container.children).forEach(c => { if(c !== addInput) container.removeChild(c); });
            const pills = getFavs();
            pills.forEach(tag => {
                const cleanTag = tag.replace(/_/g, ' ');
                const pill = document.createElement('span');
                Object.assign(pill.style, { display: 'inline-flex', alignItems: 'center', background: '#222', border: '1px solid #444', borderRadius: '4px', padding: '1px 4px', fontSize: '10px', color: '#eee' });

                const link = document.createElement('a');
                link.innerText = cleanTag;
                link.title = "Click to Search";

                if (isMoebooru()) { link.href = `/post?tags=${tag}`; }
                else if (isRule34Us()) { link.href = `index.php?r=posts/index&q=${tag}`; }
                else if (isE621()) { link.href = `/posts?tags=${tag}`; }
                else { link.href = `index.php?page=post&s=list&tags=${tag}`; }

                Object.assign(link.style, { color: '#8cbaff', textDecoration: 'none', margin: '0 4px', cursor: 'pointer', maxWidth:'100px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' });

                const plusBtn = document.createElement('span'); plusBtn.innerText = '+'; plusBtn.title = "Add to current search";
                Object.assign(plusBtn.style, { cursor: 'pointer', color: '#6f6', fontWeight: 'bold', padding: '0 2px' });
                plusBtn.onclick = (e) => { e.preventDefault(); searchInput.value = (searchInput.value + ' ' + tag).trim(); };

                const minusBtn = document.createElement('span'); minusBtn.innerText = '-'; minusBtn.title = "Exclude from current search";
                Object.assign(minusBtn.style, { cursor: 'pointer', color: '#f66', fontWeight: 'bold', padding: '0 2px' });
                minusBtn.onclick = (e) => { e.preventDefault(); searchInput.value = (searchInput.value + ' -' + tag).trim(); };

                const removeBtn = document.createElement('span'); removeBtn.innerText = '×'; removeBtn.title = "Remove from favorites";
                Object.assign(removeBtn.style, { cursor: 'pointer', color: '#888', fontWeight: 'bold', marginLeft: '2px' });
                removeBtn.onmouseenter = () => removeBtn.style.color = '#f00'; removeBtn.onmouseleave = () => removeBtn.style.color = '#888';
                removeBtn.onclick = (e) => { e.preventDefault(); const newL = getFavs().filter(t => t !== tag); saveFavs(newL); renderPills(); };

                pill.appendChild(plusBtn); pill.appendChild(minusBtn); pill.appendChild(link); pill.appendChild(removeBtn); container.insertBefore(pill, addInput);
            });
        };

        const addTag = (val) => { if(!val) return; val = normalizeTag(val); const current = getFavs(); if(!current.includes(val)) { current.push(val); saveFavs(current); renderPills(); } };
        window.r34AddFavPill = addTag;
        addInput.addEventListener('keydown', (e) => { if(e.key === 'Enter') { e.preventDefault(); addTag(addInput.value); addInput.value = ''; } });

        container.appendChild(addInput);
        wrapper.appendChild(header);
        wrapper.appendChild(container);

        // Fix 2: Better placement logic for e621
        if (isE621()) {
            const tagHeader = document.querySelector('h5.tag-list-header') || document.querySelector('#tag-box h5');
            const tagBox = document.querySelector('section#tag-box');
            if (tagHeader && tagHeader.parentNode) { tagHeader.parentNode.insertBefore(wrapper, tagHeader); }
            else if (tagBox) { tagBox.insertBefore(wrapper, tagBox.firstChild); }
            else if (savedRow && savedRow.parentNode) { savedRow.parentNode.insertBefore(wrapper, savedRow.nextSibling); }
            else { const form = searchInput.closest('form'); if(form && form.parentNode) form.parentNode.insertBefore(wrapper, form); }
        } else {
            if(savedRow && savedRow.parentNode) { savedRow.parentNode.insertBefore(wrapper, savedRow.nextSibling); }
            else { let searchForm = searchInput.closest('form'); if(searchForm && searchForm.parentNode) searchForm.parentNode.appendChild(wrapper); }
        }

        renderPills();

        // --- SIDEBAR [+] BUTTONS ---
        const tagLinks = document.querySelectorAll(
            '#tag-sidebar li a, #tag-list li a, .sidebar li a, .tag-list-left li a, ' +
            '#post-information li a, ' +
            '.tag-list-item .tag-list-search'
        );

        tagLinks.forEach(link => {
            let tagValue = "";

            // Fix 3: Use data-name on e621 for accurate, decoded tag names
            if (isE621()) {
                const li = link.closest('li.tag-list-item');
                if (li && li.dataset.name) {
                    tagValue = decodeURIComponent(li.dataset.name);
                } else {
                    const nameSpan = link.querySelector('.tag-list-name');
                    if (nameSpan) tagValue = nameSpan.textContent.trim();
                }
            } else {
                tagValue = link.textContent.trim();
            }

            // Fallback for non-e621 or e621-fallback: remove "(123)" counts
            if (!isE621() || !link.closest('li.tag-list-item')) {
                const processedTextMatch = tagValue ? tagValue.match(/^(.*?)( \(\d+\))?$/) : null;
                if (processedTextMatch && processedTextMatch[1]) {
                    tagValue = processedTextMatch[1];
                }
            }

            if (!tagValue || tagValue === '?' || tagValue === '+' || tagValue === '-') return;
            if (link.parentNode.querySelector('.r34-sidebar-add')) return;

            const btn = document.createElement('span');
            btn.className = 'r34-sidebar-add';
            btn.innerText = '[+]';
            Object.assign(btn.style, { cursor:'pointer', fontSize:'9px', color:'#6f6', marginLeft:'3px', marginRight:'3px', display:'inline-block' });
            btn.title = "Add to Favorite Pills";

            const finalTag = normalizeTag(tagValue);

            btn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                window.r34AddFavPill(finalTag);
            };

            if(isE621()) {
               const actions = link.parentNode.querySelector('.tag-list-actions');
               if (actions) { actions.appendChild(btn); } else { link.after(btn); }
            } else {
               link.after(btn);
            }
        });
    }
    function setupQuickEdit() {
        document.addEventListener('keydown', async (e) => {
            if (e.key === 'Control' || e.key === 'Meta') {
                if (e.repeat) return;
                const allThumbs = Array.from(document.querySelectorAll(
                    'a.thumb, .thumb a, .thumbnail-preview a, ' +             // General boorus
                    'div[style*="height: 200px;"] > a, ' +                   // Rule34.us specific thumbnail container
                    'a[href*="r=posts/view"][id], ' +                        // Rule34.us, check for link with ID and view param
                    'article.thumbnail > a'                                  // E621 specific thumbnail classes
                ));
                if (allThumbs.length === 0) return;
                let hoveredLink = document.querySelector('a.thumb:hover, .thumb a:hover, .thumbnail-preview a:hover');
                // For rule34.us snippet, the a tag inside the div might be hovered
                if (!hoveredLink) {
                    hoveredLink = document.querySelector('div[style*="height: 200px;"] > a:hover, article.thumbnail > a:hover');
                }

                let clickedIndex = -1;
                if (!hoveredLink) { const enhancerContainer = document.querySelector('#thumbPlusPreviewContainer'); if (enhancerContainer && enhancerContainer.matches(':hover')) { hoveredLink = document.querySelector('#thumbPlusPreviewLink'); } }
                if (!hoveredLink) return; e.preventDefault(); e.stopPropagation();
                clickedIndex = allThumbs.findIndex(a => a.href === hoveredLink.href);
                if(clickedIndex === -1 && hoveredLink.id === 'thumbPlusPreviewLink') { clickedIndex = allThumbs.findIndex(a => a.href === hoveredLink.href); }
                if(clickedIndex === -1) return;
                launchEditorForIndex(clickedIndex, allThumbs);
            }
        });
    }

    async function launchEditorForIndex(index, allThumbs) {
        if(index < 0 || index >= allThumbs.length) return;
        const a = allThumbs[index];
        const id = getIdFromUrl(a.href); if (!id) return;
        const thumbImg = a.querySelector('img');
        if(thumbImg) thumbImg.style.opacity = '0.5';
        try {
            let fetchUrl = `${window.location.origin}/index.php?page=post&s=view&id=${id}`;
            if (isMoebooru()) { fetchUrl = `${window.location.origin}/post/show/${id}`; }
            else if (isRule34Us()) { fetchUrl = `${window.location.origin}/index.php?r=posts/view&id=${id}`; }
            else if (isE621()) { fetchUrl = `${window.location.origin}/posts/${id}`; }

            const response = await fetch(fetchUrl); const text = await response.text(); const parser = new DOMParser(); const doc = parser.parseFromString(text, "text/html");
            const item = { id: id, thumbUrl: thumbImg ? thumbImg.src : '', md5: getPageMD5(doc), manualType: null };

            // Re-use downloadImage's robust fileUrl logic
            let tempFileUrl = "";
            const originalLink = doc.querySelector('a#image-download-link, a.image-download-link, a[onclick*="javascript:show_original_image"], a[href*="/image/"], a[href*="/file/"]');
            if (originalLink && originalLink.href && !originalLink.href.includes('/wiki/')) tempFileUrl = originalLink.href;

            if (!tempFileUrl && isRule34Us()) {
                const r34UsOriginal = doc.querySelector('a[href*="/images/"][href$=".png"], a[href*="/images/"][href$=".jpg"], a[href*="/images/"][href$=".gif"]');
                if (r34UsOriginal && r34UsOriginal.textContent.trim().toLowerCase().includes('original')) {
                    tempFileUrl = r34UsOriginal.href;
                }
            }

            if (!tempFileUrl && isE621()) {
                const e621OriginalLink = doc.querySelector('li#post-file-size a, #raw_image_container > a');
                if (e621OriginalLink && e621OriginalLink.href) tempFileUrl = e621OriginalLink.href;
            }

            if (!tempFileUrl) {
                const mainImage = doc.querySelector('#image, #main_image, #img, .image-body img, #img-display');
                if (mainImage && mainImage.src) tempFileUrl = mainImage.src;
            }

            if (!tempFileUrl) {
                const mainVideo = doc.querySelector('video#image, video.image-body, video#gelcomVideoPlayer');
                if (mainVideo) {
                    const source = mainVideo.querySelector('source');
                    if (source && source.src) tempFileUrl = source.src;
                    else if (mainVideo.src) tempFileUrl = mainVideo.src;
                }
            }
            item.fileUrl = tempFileUrl;

            openFocusEditor(item, doc, () => { if(thumbImg) thumbImg.style.opacity = '1'; }, (itm) => { downloadFromDocument(doc, itm, (success) => { if(success && thumbImg) thumbImg.style.border = "3px solid #28a745"; }); }, { current: index, total: allThumbs.length, hasNext: (index < allThumbs.length - 1), hasPrev: (index > 0), goNext: () => launchEditorForIndex(index + 1, allThumbs), goPrev: () => launchEditorForIndex(index - 1, allThumbs) });
            if(thumbImg) thumbImg.style.opacity = '1';
        } catch(err) { console.error("R34 Script: Error during fetch", err); if(thumbImg) thumbImg.style.opacity = '1'; }
    }

    window.addEventListener('load', () => { updateMainButton(); initSavedSearches(); initFavoritePills(); });
    // Run after a short delay too, in case elements load dynamically
    setTimeout(() => { updateMainButton(); initSavedSearches(); initFavoritePills(); }, 1500);
    setupQuickEdit();
    GM_registerMenuCommand("Rule34 Sorter Settings", () => openSettingsMenu());
})();