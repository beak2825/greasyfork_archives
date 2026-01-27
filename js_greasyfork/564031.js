// ==UserScript==
// @name         MediaInfo CPU/GPU Detector v1.7 - Spécial Modération
// @version      1.7
// @description  Détection CPU/GPU 
// @namespace    https://greasyfork.org/users/1555347
// @author       Jukop22
// @match        https://www.sharewood.tv/*
// @grant        none
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/564031/MediaInfo%20CPUGPU%20Detector%20v17%20-%20Sp%C3%A9cial%20Mod%C3%A9ration.user.js
// @updateURL https://update.greasyfork.org/scripts/564031/MediaInfo%20CPUGPU%20Detector%20v17%20-%20Sp%C3%A9cial%20Mod%C3%A9ration.meta.js
// ==/UserScript==

(() => {
    'use strict';

    let popupElement = null;
    let vignetteElement = null;
    let nfoContainer = null;
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };

    // ----------- CONFIGURATION DES TEAMS -----------

    const FORBIDDEN_TEAMS = [
        'ACOOL', 'ASPHiXiAS', 'Avitech', 'Boheme', 'CINeHD', 'Cpasbien', 'CPB', 'CZ530', 'D0LL4R',
        'EXTREME', 'FGT', 'Firetown', 'FLOP', 'FLY3R', 'FTMVHD', 'FuN', 'GAÏA', 'GHZ', 'HDMIDIMADRIDI',
        'JiHeff', 'KILLERMIX', 'LUCKY', 'N3TFL1X', 'METALLIKA', 'EASPORTS', 'TSN999', 'MACK4',
        'NoelMaison', 'Champion9', 'BossBaby', 'Matmatha', 'Monchat', 'NEWCiNE', 'NOMAD', 'NORRIS',
        'PiCKLES', 'PREUMS', 'RARBG', 'R3MIX', 'ROLLED', 'RPZ', 'SHARKS', 'ShowFR', 'SUNS3T',
        'TicaDow', 'Torrent9', 'Tokushi', 'TOXIC', 'TVPSLO', 'TyHD', 'Wawa-Porno', 'ZT', 'ZW'
    ];

    const APPROVED_TEAMS = [
        'XANDER', 'QTZ', 'FW','FORWARD','AMEN','SUPPLY','THESYNDiCATE','[BATGirl]', 'DON', 'ViSION', 'CtrlHD', 'EbP', 'NTb', 'TayTO', 'FraMeSToR', 'SbR', 'D-Z0N3',
        'SA89', 'decibeL', 'NCmt', 'IDE', 'AMIABLE', 'SPARKS', 'GECKOS', 'DRONES', 'ROVERS',
        'PSYCHD', 'DEPRAViTY', 'SHORTBREWD', 'TfH', 'Arclight', 'Ulysse', 'JKB', 'STV', 'NERD',
        'FHD', 'QxR', 'Tigole', 'Silence', 'Joy', 'Thora', 'Coalgirls', 'Kamigami', 'KASHMIR',
        'A-TEAM', 'VietHD', 'BHDStudio', 'WiKi', 'BeAst', 'LoRD', 'HDAccess', 'HiFi', 'TENEBRE',
        'EPiC', 'Geek', 'HANDJOB', 'HANDJOB', 'HDMaNiAcS', 'iFT', 'KiNGS', 'LEGi0N', 'M@re', 'METIS',
        'MZABI', 'NOS', 'PCP', 'PTP', 'REEL', 'S9', 'SCENE', 'SDR', 'SIGMA', 'SiNNERS',
        'Skazat', 'SMURF', 'SNEAKY', 'SPiRiT', 'SwtyBlz', 'T@m', 'TERMINAL', 'THOR', 'THP',
        'TRiPS', 'UAV', 'VAD0K', 'VETHEL', 'VidiX', 'WASTE', 'WCP', 'XOR', 'YAWN', 'Z0N3',
        'ZED', 'ZEN', 'ZHD', 'ZIMMER', 'ZODIAC', 'ZOO'
    ];

    const DUBIOUS_TEAMS = [
        'YIFY', 'MeGusta', 'PSA', 'NanHD', 'Vyndros', 'GalaxyRG', 'TUTO', '1XBET', 'MeCal',
        'RMTeam', 'Pahe', 'MkvCage', 'ShAaNiG', 'JoyBell', 'TMB', 'STUTTERSHIT', 'SmiY', 'HevcBay',
        'UPiX', 'Xclusive', 'EVO', 'CMRG', 'WAVEY', 'VPPV', 'DDP', 'HaxRaw', 'Muvz', 'NIG',
        'DAtA', 'NOGRP', 'AFG', 'MiXED', 'Gano', 'SANTi', 'POOP', 'FUM', 'ETRG', 'XpoZ',
        'Ganool', 'Minishares', 'Micromkv', 'Snit', 'Superfast', 'Speedy', 'Nitro', 'Flash',
        'Turbo', 'Quick', 'LowBit', 'SmallSize', 'Tiny', 'Slim', 'Lite', 'Micro', 'Nano', 'Pico', 'Atom'
    ];

    const SCENE_TEAMS = [
        'GHOULS', 'VETO', 'AETHELRED', 'STRiFE', 'DEPTH', 'METCON', 'UNTOUCHABLES',
        'LOST', 'FLAME', 'DEFLATE', 'CADAVER', 'WAV', 'SGE', 'WEEB', 'REWARD', 'SHORTBREHD',
        'TCO', 'REPLiCA', 'GETiT', 'COCAIN', 'CBFM', 'CINEVIGILANTE', 'ANONYMOUS', 'ORiGHTS',
        'SNOW', 'PIGGIE', 'GMB', 'THeVuze', 'PLUTONiUM', 'VIUM', 'TiDE', 'YELLOWBiRD',
        'RiGHTS', 'HONE', 'STORM', 'PANOCOLA', 'L0ST', 'FUM', 'ASAP', 'BATV', 'KILLERS',
        'FLEET', 'DIMENSION', 'CRAVERS', 'TWEAK', 'TURBO', 'NOSCREENS', 'UTR',
        'Vyndros', 'HEVCBay', 'MeGusta', 'mSD', 'AFG', 'AViS', 'ION10', 'STRATOS', 'TARS', 'GGEZ',
        'aViATOR', 'PROPHET', 'RELOADED', 'SKIDROW', 'CODEX', 'CPY', 'HOODLUM', 'PLAZA',
        'DARKSiDERS', 'RAZOR1911', 'ENLIGHT', 'I_KNOW', 'BLOW', 'VESTiGE', 'COBOK', 'NTG',
        'MZONI', 'KOGi', 'TIGEB', 'RUSTED', 'FRATERNiTY', 'AJP', 'BHOCO', 'C4TV', 'DHD', 'OAL',
        'PFa', 'TayTo', 'FraMeSToR', 'EPSiLON', 'BORDURE', 'FDS', 'JpS', 'K4RTEL', 'L8N',
        'PUNK', 'RUX', 'SECTOR7', 'TFA', 'UNiQUE', 'VAMiRE', 'WAF', 'ZEUS', 'ZZG'
    ];

    // ----------- UTILITAIRES -----------

    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function isVideoCategory() {
        const rows = document.querySelectorAll('tr');
        for (let row of rows) {
            const firstTd = row.querySelector('td.col-sm-2');
            if (firstTd) {
                const label = firstTd.textContent.trim();
                const secondTd = row.querySelector('td:not(.col-sm-2)');
                if (secondTd) {
                    const value = secondTd.textContent.trim();
                    if (label.includes('Catégorie') && value.includes('Vidéos')) return true;
                    if (label.includes('Sous-Catégorie') && value.includes('Films XXX')) return true;
                }
            }
        }
        return false;
    }

    function findMediaInfo() {
        const slidingDiv = document.querySelector('.slidingDiv');
        if (slidingDiv) {
            nfoContainer = slidingDiv;
            const code = slidingDiv.querySelector('pre code, pre, code');
            if (code && code.textContent.trim().length > 50) return code;
        }
        const allCode = document.querySelectorAll('pre code, pre, code');
        for (let el of allCode) {
            if (el.textContent.trim().length > 50) {
                nfoContainer = el.closest('.slidingDiv') || el.parentElement;
                return el;
            }
        }
        return null;
    }

    function highlightWord(element, label, softwareName = null) {
        document.querySelectorAll('.mediainfo-highlight').forEach(span => {
            if (span.parentNode) span.outerHTML = span.textContent || '';
        });

        const fullText = element.textContent || '';
        const technicalMap = {
            'B-Frames': 'bframes', 'Refs': 'ref', 'ME=UMH': 'me', 'Psy-RD': 'psy-rd',
            'Psy-RDOQ': 'psy-rdoq', 'CRF': 'crf', 'NVENC': 'nvenc', 'Nvidia': 'nvidia',
            'MediaFoundation': 'mediafoundation', 'QSV / QuickSync': 'qsv|quicksync',
            'Encode': 'lavf', 'Remux': 'makemkv', 'Balayage': 'interlaced', 
            'Bitrate (Débit)': 'bit rate|débit', 'Ratio bit/Px': 'bits/\\(pixel\\*(?:frame|image)\\)',
            'Apple / iTunes': 'gop', 'Débit Max': 'débit maximum|maximum bit rate'
        };

        let searchTerm = label;
        if (label === 'Balayage') searchTerm = 'interlaced';
        else if (label === 'Remux') searchTerm = 'makemkv';
        else if (technicalMap[label]) searchTerm = technicalMap[label];
        else if (label === 'Encode' && softwareName) searchTerm = softwareName.split(' ')[0];

        const escapedTerm = escapeRegExp(searchTerm);
        const lowSearchTerm = searchTerm.toLowerCase();

        const highlightStyle = `background:#ffeb3b;color:#000;padding:0 2px;border-radius:3px;font-weight:700;border:1px solid #f57c00;line-height:1;`;

        let regex;
        const keysWithEquals = ['bframes', 'crf', 'me', 'psy-rd', 'psy-rdoq'];

        if (lowSearchTerm === 'x264' || lowSearchTerm === 'x265' || lowSearchTerm === 'lavf' || lowSearchTerm === 'makemkv') {
            const labels = "Writing library|library|application|encoder|codec|Bibliothèque|Bibliothèque utilisée|Outil utilisé|Application utilisée";
            regex = new RegExp(`([^\\n]*(?:${labels})\\s*:\\s*[^\\n]*?${escapedTerm}[^\\n]*|\\b${escapedTerm}\\b)`, 'gi');
        } 
        else if (lowSearchTerm === 'ref') {
            regex = new RegExp(`(\\bref\\s*=\\s*\\d+|[^\\n]*\\d+\\s*Ref\\s*Frames|[^\\n]*Reference\\s*frames\\s*:\\s*\\d+)`, 'gi');
        }
        else if (lowSearchTerm === 'bit rate|débit' || lowSearchTerm === 'bits/\\(pixel\\*(?:frame|image)\\)' || lowSearchTerm === 'débit maximum|maximum bit rate') {
            let pattern = '(?:Bit rate|Débit)';
            if (lowSearchTerm === 'bits/\\(pixel\\*(?:frame|image)\\)') pattern = 'Bits/\\(Pixel\\*(?:Frame|Image)\\)';
            if (lowSearchTerm === 'débit maximum|maximum bit rate') pattern = '(?:Débit maximum|Maximum bit rate)';
            
            regex = new RegExp(`(\\r?\\n|^)([^\\r\\n]*${pattern}\\s*:[^\\r\\n]*)`, 'gi');
            
            if (!regex.test(fullText)) return false;
            element.innerHTML = fullText.replace(regex, `$1<span id="target-highlight" class="mediainfo-highlight" style="${highlightStyle}">$2</span>`);
            return true;
        }
        else if (keysWithEquals.includes(lowSearchTerm)) {
            regex = new RegExp(`(\\b${escapedTerm}\\s*=\\s*[^\\s/;,]+)`, 'gi');
        } 
        else if (lowSearchTerm === 'interlaced') {
            regex = new RegExp(`(Scan (?:type|order|type, store method)\\s*:\\s*[^\\n]+(?:interlaced|field|separated)[^\\n]+)`, 'gi');
            if (!regex.test(fullText)) regex = new RegExp(`(interlaced|top field first|bottom field first|separated fields)`, 'gi');
        } 
        else if (lowSearchTerm === 'gop') {
            regex = new RegExp(`([^\\n]*GOP\\s*:\\s*[^\\n]*)`, 'gi');
        }
        else {
            regex = new RegExp(`([^\\s/;,]*(?:${escapedTerm})[^\\s/;,]*)`, 'gi');
        }

        if (!regex.test(fullText)) return false;

        element.innerHTML = fullText.replace(regex, `<span id="target-highlight" class="mediainfo-highlight" style="${highlightStyle}">$1</span>`);
        return true;
    }

    function openNfoAndScroll(word, softwareName = null) {
        const slidingDiv = document.querySelector('.slidingDiv');
        const nfoBtn = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent.includes('AFFICHER/CACHER LE NFO'));
        const isHidden = !slidingDiv || (window.getComputedStyle(slidingDiv).display === 'none');

        const executeScroll = () => {
            const mediaInfo = findMediaInfo();
            if (mediaInfo) {
                const found = highlightWord(mediaInfo, word, softwareName);
                const targetElement = document.getElementById('target-highlight');
                if (found && targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                } else {
                    mediaInfo.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        };

        if (isHidden && nfoBtn) {
            nfoBtn.click();
            setTimeout(executeScroll, 500);
        } else {
            executeScroll();
        }
    }

    function analyzeVideo(text) {
        const clean = text.toLowerCase();
        const lines = text.split('\n');
        let cluesFound = [];
        let teamInfo = { name: '', status: 'none' };

        let width = 0;
        const widthMatch = text.match(/(?:Width|Largeur)\s*:\s*([\d\s]+)/i);
        if (widthMatch) width = parseInt(widthMatch[1].replace(/\s/g, ''));

        let bitrateMb = 0;
        const bitrateMatch = text.match(/(?:^|\n)\s*(?:Bit rate|Débit)\s*:\s*([\d\s,.]+)\s*(kb\/s|mb\/s|kbps|mbps|mo\/s|ko\/s)/i);
        if (bitrateMatch) {
            let val = parseFloat(bitrateMatch[1].replace(/\s/g, '').replace(',', '.'));
            let unit = bitrateMatch[2].toLowerCase();
            bitrateMb = (unit.startsWith('k')) ? val / 1000 : val;
        }

        let ratioBitPx = 0;
        const ratioMatch = text.match(/Bits\/\(Pixel\*(?:Frame|Image)\)\s*:\s*([\d.]+)/i);
        if (ratioMatch) ratioBitPx = parseFloat(ratioMatch[1]);

        const nameLine = lines.find(l => /complete name|movie name|nom complet|titre du film/i.test(l.toLowerCase()));
        if (nameLine) {
            const contentAfterColon = nameLine.split(/:(.+)/)[1]?.trim() || '';
            const fileName = contentAfterColon.split('/').pop().split('\\').pop();
            const parts = fileName.split('-');
            if (parts.length > 1) {
                let rawTeamPart = parts[parts.length - 1].split('.')[0].trim();
                let potentialTeam = rawTeamPart.split(/[\s\(]/)[0].trim();
                
                if (potentialTeam) {
                    teamInfo.name = potentialTeam;
                    const lowTeam = potentialTeam.toLowerCase();
                    if (FORBIDDEN_TEAMS.some(t => t.toLowerCase() === lowTeam)) teamInfo.status = 'forbidden';
                    else if (APPROVED_TEAMS.some(t => t.toLowerCase() === lowTeam)) teamInfo.status = 'approved';
                    else if (DUBIOUS_TEAMS.some(t => t.toLowerCase() === lowTeam)) teamInfo.status = 'dubious';
                    else if (SCENE_TEAMS.some(t => t.toLowerCase() === lowTeam)) teamInfo.status = 'scene';
                    else teamInfo.status = 'untracked';
                }
            }
        }

        let status = {
            type: 'INCONNU',
            hasSettings: false,
            message: '',
            color: '#424242',
            gradient: 'linear-gradient(135deg, #757575, #424242)',
            borderColor: '#424242'
        };

        const settingsPatterns = ['encoding settings', 'paramètres d\'encode', 'paramètres d\'encodage', 'cabac=1', 'rc=crf', 'rc=2pass', 'rc=abr', 'cpuid=', 'rc='];
        status.hasSettings = settingsPatterns.some(p => clean.includes(p));

        const writingLibraryRegex = /(?:writing library|bibliothèque|outil utilisé).*?(x264|x265)/i;
        if (writingLibraryRegex.test(clean)) {
            status.type = 'CPU';
            status.gradient = 'linear-gradient(135deg, #00ff88, #00cc6a)';
            status.borderColor = '#00cc6a';
        }

        const gpuPatterns = [
            { label: 'NVENC', desc: 'Encode NVIDIA', reg: /nvenc/i },
            { label: 'Nvidia', desc: 'Détection GPU', reg: /nvidia/i },
            { label: 'MediaFoundation', desc: 'Windows (GPU)', reg: /mediafoundation/i },
            { label: 'QSV / QuickSync', desc: 'Intel (GPU)', reg: /qsv|quicksync|intel/i },
            { label: 'AMF', desc: 'AMD (GPU)', reg: /amf|vce|amd/i },
            { label: 'Handbrake GPU', desc: 'Encode matériel', reg: /encoder\s*:\s*nvenc/i }
        ];

        const cpuPatterns = [
            { label: 'x264', desc: 'Encodeur logiciel', reg: /x264/i }, { label: 'x265', desc: 'HEVC logiciel', reg: /x265/i },
            { label: 'CRF', desc: 'Qualité constante', reg: /rc=crf/i }, { label: 'Psy-RD', desc: 'Optimisation visuelle', reg: /psy-rd/i },
            { label: 'Psy-RDOQ', desc: 'Optimisation psychovisuelle', reg: /psy-rdoq/i }, { label: 'B-Frames', desc: 'Compression temporelle', reg: /bframes\s*=\s*\d+/i },
            { label: 'Refs', desc: 'Images de référence', reg: /ref\s*=\s*(\d+)|(\d+)\s*ref\s*frames|reference\s*frames\s*:\s*(\d+)/i },
            { label: 'ME=UMH', desc: 'Recherche complexe', reg: /me=umh/i }, { label: 'Encode', desc: 'Lavf (FFmpeg)', reg: /lavf\d*\.\d*\.\d*/i },
            { label: 'Encode', desc: 'HandBrake', reg: /handbrake/i }, { label: 'Encode', desc: 'MeGUI', reg: /megui/i },
            { label: 'Encode', desc: 'StaxRip', reg: /staxrip/i }, { label: 'Encode', desc: 'RipBot264', reg: /ripbot264/i },
            { label: 'Encode', desc: 'Wondershare', reg: /wondershare/i }, { label: 'Encode', desc: 'UniConverter', reg: /uniconverter/i },
            { label: 'Encode', desc: 'Format Factory', reg: /format factory/i }, { label: 'Encode', desc: 'ShanaEncoder', reg: /shanaencoder/i },
            { label: 'Encode', desc: 'ffmpeg', reg: /ffmpeg/i }, { label: 'Encode', desc: 'libavcodec', reg: /libavcodec/i },
            { label: 'Encode', desc: 'MEncoder', reg: /mencoder/i }, { label: 'Encode', desc: 'OBS', reg: /obs-bits|open broadcaster software/i },
            { label: 'Encode', desc: 'Capto', reg: /capto/i }, { label: 'Encode', desc: 'Bandicam', reg: /bandicam/i },
            { label: 'Remux', desc: 'Edité par MakeMKV', reg: /makemkv/i },
            { label: 'Balayage', desc: 'Interlacé (Entrelacé)', reg: /interlaced|top field first|bottom field first/i }
        ];

        gpuPatterns.forEach(p => { 
            if (p.reg.test(clean)) { 
                cluesFound.push(p); 
                status.type = 'GPU DETECTÉ'; 
                status.gradient = 'linear-gradient(135deg, #c31432, #240b36)'; 
                status.borderColor = '#c31432'; 
            } 
        });

        if (status.type !== 'GPU DETECTÉ' && status.type !== 'CPU') {
            cpuPatterns.forEach(p => { 
                const match = p.reg.exec(clean);
                if (match) {
                    let clue = { ...p };
                    if (p.label === 'Refs') { const val = match[1] || match[2] || match[3]; if (val) clue.refValue = parseInt(val); }
                    cluesFound.push(clue);
                }
            });
            const realCpuClues = cluesFound.filter(c => !['Encode', 'Remux', 'Balayage', 'Bitrate (Débit)', 'Ratio bit/Px'].includes(c.label));
            if (realCpuClues.length >= 2) { 
                status.type = 'CPU'; 
                status.gradient = 'linear-gradient(135deg, #00ff88, #00cc6a)'; 
                status.borderColor = '#00cc6a'; 
            }
        }

        if (status.type === 'CPU' && cluesFound.length === 0) {
             cpuPatterns.forEach(p => { 
                const match = p.reg.exec(clean);
                if (match) {
                    let clue = { ...p };
                    if (p.label === 'Refs') { const val = match[1] || match[2] || match[3]; if (val) clue.refValue = parseInt(val); }
                    cluesFound.push(clue);
                }
            });
        }

        let currentCodec = (clean.includes('x265') || clean.includes('hevc')) ? 'x265' : (clean.includes('x264') || clean.includes('avc')) ? 'x264' : '';

        const appleSignature = /cabac\s*\/\s*2\s*ref\s*frames/i.test(clean) && /gop\s*:\s*m=2,\s*n=20/i.test(clean);
        if (appleSignature) cluesFound.push({ label: 'Apple / iTunes', desc: 'Signature typique' });

        const maxBitrateMatch = text.match(/(?:Débit maximum|Maximum bit rate)\s*:\s*([\d\s,.]+)/i);
        if (maxBitrateMatch) cluesFound.push({ label: 'Débit Max', desc: 'débit bridé' });

        if (bitrateMb > 0) cluesFound.push({ label: 'Bitrate (Débit)', desc: `Débit : ${bitrateMb.toFixed(2)} Mb/s`, bitrate: bitrateMb, width: width, codec: currentCodec });
        if (ratioBitPx > 0) cluesFound.push({ label: 'Ratio bit/Px', desc: `Bits/(Px*Frame) : ${ratioBitPx.toFixed(3)}`, ratio: ratioBitPx, width: width, codec: currentCodec });

        if (teamInfo.status === 'forbidden') {
            status.message = "❌ TEAM INTERDITE !";
            status.gradient = 'linear-gradient(135deg, #ff416c, #ff4b2b)';
            status.borderColor = '#ff4b2b';
        } else if (teamInfo.status === 'dubious') {
            status.message = "⚠️ TEAM DOUTEUSE !";
            status.gradient = 'linear-gradient(135deg, #ff9966, #ff5e62)';
            status.borderColor = '#ff9966';
        } else if (status.type === 'GPU DETECTÉ') status.message = "❌ NON CONFORME !";
        else if (!status.hasSettings) {
            status.message = "⚠️ PARAMÈTRES MANQUANTS";
            if (status.type === 'INCONNU') {
                status.gradient = 'linear-gradient(135deg, #757575, #424242)'; 
                status.borderColor = '#424242';
            }
        } else status.message = "✅ PARAMÈTRES PRÉSENTS";

        if (teamInfo.status === 'none' && status.type === 'INCONNU') { teamInfo.name = 'NoTag'; teamInfo.status = 'unknown-display'; }

        return { ...status, clues: cluesFound, team: teamInfo };
    }

    function createPopup(analysis) {
        if (popupElement) return;
        const MAX_HEIGHT = Math.min(550, window.innerHeight * 0.85);
        popupElement = document.createElement('div');
        Object.assign(popupElement.style, {
            position: 'fixed', top: '80px', right: '20px', width: '280px', height: 'auto',
            maxHeight: MAX_HEIGHT + 'px', background: analysis.gradient, borderRadius: '20px',
            color: 'white', zIndex: 2147483647, backdropFilter: 'blur(20px)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)', border: `2px solid ${analysis.borderColor}`,
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            overflow: 'hidden', display: 'flex', flexDirection: 'column', opacity: 1,
            transition: 'all 0.6s cubic-bezier(0.25,0.46,0.45,0.94)'
        });

        const header = document.createElement('div');
        Object.assign(header.style, { padding: '18px 18px 24px', background: 'rgba(0,0,0,0.35)', borderBottom: '1px solid rgba(255,255,255,0.25)', cursor: 'move', textAlign: 'center', position: 'relative' });
        const title = document.createElement('div');
        Object.assign(title.style, { fontSize: '24px', fontWeight: 900, marginBottom: '4px', textShadow: '0 2px 10px rgba(0,0,0,0.6)' });
        title.textContent = analysis.type;
        header.appendChild(title);

        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '×';
        Object.assign(closeBtn.style, {
            position: 'absolute', top: '10px', right: '10px', width: '40px', height: '40px',
            border: '2px solid rgba(0,0,0,0.1)', background: '#ffffff', borderRadius: '50%',
            color: '#000000', fontSize: '28px', fontWeight: 900, cursor: 'pointer',
            transition: 'all 0.3s ease', lineHeight: '32px', textAlign: 'center',
            boxShadow: '0 4px 10px rgba(0,0,0,0.4)', zIndex: 2147483648
        });
        closeBtn.onclick = (e) => { e.stopPropagation(); popupElement.remove(); popupElement = null; createVignette(); };
        header.appendChild(closeBtn);
        popupElement.appendChild(header);

        const body = document.createElement('div');
        Object.assign(body.style, { padding: '12px 18px 18px', textAlign: 'center', overflowY: 'auto', flexGrow: '1', display: 'flex', flexDirection: 'column', gap: '10px' });

        const msg = document.createElement('div');
        Object.assign(msg.style, { fontSize: '13px', marginBottom: '5px', padding: '8px', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', fontWeight: 'bold', border: '1px solid rgba(255,255,255,0.1)' });
        msg.textContent = analysis.message;

        if (analysis.message) body.appendChild(msg);

        if (analysis.team.status !== 'none') {
            const teamBtn = document.createElement('button');
            let tBrd = 'rgba(255,255,255,0.7)', tBg = 'rgba(255,255,255,0.15)', tLbl = 'Team inconnue';
            
            // NOUVEAUTÉ v4.8 : Team rouge si cas INCONNU et team inconnue/NoTag
            if (analysis.team.status === 'forbidden') { 
                tBrd = '#ffffff'; tBg = '#ff0000'; tLbl = 'Team INTERDITE'; 
            }
            else if (analysis.type === 'INCONNU' && (analysis.team.status === 'untracked' || analysis.team.status === 'unknown-display')) {
                tBrd = '#ffffff'; tBg = '#ff0000'; tLbl = 'Team inconnue (Alerte)';
            }
            else if (analysis.team.status === 'untracked' || analysis.team.status === 'unknown-display') { 
                tBrd = 'rgba(255,255,255,0.5)'; tBg = 'rgba(100,100,100,0.5)'; tLbl = 'Team inconnue'; 
            }
            else if (analysis.team.status === 'dubious') { tBrd = '#ffffff'; tBg = '#ff9800'; tLbl = 'Team DOUTEUSE (À vérifier)'; }
            else if (analysis.team.status === 'approved') { tBrd = '#00ff88'; tBg = 'rgba(0,255,136,0.3)'; tLbl = 'Team approuvée'; }
            else if (analysis.team.status === 'scene') { tBrd = '#bb86fc'; tBg = 'rgba(187,134,252,0.3)'; tLbl = 'Team SCENE'; }

            Object.assign(teamBtn.style, {
                display: 'block', width: '100%', padding: '12px 14px', border: `3px solid ${tBrd}`,
                borderRadius: '16px', background: tBg, color: 'white', cursor: 'pointer',
                textAlign: 'center', marginBottom: '5px', boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
                transition: 'all 0.2s ease'
            });
            teamBtn.innerHTML = `<div style="font-weight:900; font-size:16px; text-shadow: 0 1px 4px rgba(0,0,0,0.6);">${analysis.team.name}</div><div style="font-size:11px; font-weight:bold; color: #fff;">${tLbl}</div>`;
            teamBtn.onclick = () => openNfoAndScroll(analysis.team.name);
            body.appendChild(teamBtn);
        }

        analysis.clues.forEach(clue => {
            const b = document.createElement('button');
            let btnBg = 'rgba(255,255,255,0.1)', btnBrd = 'rgba(255,255,255,0.3)', boxShadow = 'none';

            if (clue.label === 'NVENC') {
                btnBg = 'rgba(255, 0, 0, 0.3)';
                btnBrd = '#ff0000';
                boxShadow = '0 4px 12px rgba(255,0,0,0.3)';
            }
            else if ((clue.label === 'Refs' && clue.refValue >= 5) || clue.label === 'Remux' || clue.label === 'Source Directe (Remux)' || clue.label === 'Apple / iTunes') {
                btnBg = 'rgba(0, 255, 136, 0.25)';
                btnBrd = '#00ff88';
                boxShadow = '0 4px 12px rgba(0,255,136,0.3)';
            }
            else if ((clue.label === 'Refs' && clue.refValue <= 2) || clue.label === 'Débit Max') {
                btnBg = 'rgba(255, 235, 59, 0.25)';
                btnBrd = '#ffeb3b';
            }

            if (clue.label === 'Bitrate (Débit)') {
                const bVal = clue.bitrate, wVal = clue.width, codec = clue.codec;
                if (!codec) {
                    if (bVal < 10) { btnBg = 'rgba(255, 235, 59, 0.25)'; btnBrd = '#ffeb3b'; }
                    else if (bVal > 20) { btnBg = 'rgba(0, 255, 136, 0.25)'; btnBrd = '#00ff88'; boxShadow = '0 4px 12px rgba(0,255,136,0.3)'; }
                } else {
                    if (wVal <= 1920 && codec === 'x264') {
                        if (bVal < 4) { btnBg = 'rgba(255, 235, 59, 0.25)'; btnBrd = '#ffeb3b'; }
                        else if (bVal >= 7) { btnBg = 'rgba(0, 255, 136, 0.25)'; btnBrd = '#00ff88'; boxShadow = '0 4px 12px rgba(0,255,136,0.3)'; }
                    } else if (wVal <= 1920 && codec === 'x265') {
                        if (bVal < 2) { btnBg = 'rgba(255, 235, 59, 0.25)'; btnBrd = '#ffeb3b'; }
                        else if (bVal >= 5) { btnBg = 'rgba(0, 255, 136, 0.25)'; btnBrd = '#00ff88'; boxShadow = '0 4px 12px rgba(0,255,136,0.3)'; }
                    } else if (wVal >= 3000 && codec === 'x265') {
                        if (bVal < 10) { btnBg = 'rgba(255, 235, 59, 0.25)'; btnBrd = '#ffeb3b'; }
                        else if (bVal >= 19) { btnBg = 'rgba(0, 255, 136, 0.25)'; btnBrd = '#00ff88'; boxShadow = '0 4px 12px rgba(0,255,136,0.3)'; }
                    }
                }
            }

            if (clue.label === 'Ratio bit/Px') {
                const rVal = clue.ratio, wVal = clue.width, codec = clue.codec;
                if (!codec) {
                    if (rVal > 0.150) { 
                        btnBg = 'rgba(0, 255, 136, 0.25)'; 
                        btnBrd = '#00ff88'; 
                        boxShadow = '0 4px 12px rgba(0,255,136,0.3)'; 
                    }
                } else {
                    if (codec === 'x264' && wVal <= 1920) {
                        if (rVal < 0.070) { btnBg = 'rgba(255, 235, 59, 0.25)'; btnBrd = '#ffeb3b'; }
                        else if (rVal >= 0.120) { btnBg = 'rgba(0, 255, 136, 0.25)'; btnBrd = '#00ff88'; boxShadow = '0 4px 12px rgba(0,255,136,0.3)'; }
                    } else if (codec === 'x265' && wVal <= 1920) {
                        if (rVal < 0.035) { btnBg = 'rgba(255, 235, 59, 0.25)'; btnBrd = '#ffeb3b'; }
                        else if (rVal >= 0.080) { btnBg = 'rgba(0, 255, 136, 0.25)'; btnBrd = '#00ff88'; boxShadow = '0 4px 12px rgba(0,255,136,0.3)'; }
                    } else if (codec === 'x265' && wVal >= 3000) {
                        if (rVal < 0.020) { btnBg = 'rgba(255, 235, 59, 0.25)'; btnBrd = '#ffeb3b'; }
                        else if (rVal >= 0.060) { btnBg = 'rgba(0, 255, 136, 0.25)'; btnBrd = '#00ff88'; boxShadow = '0 4px 12px rgba(0,255,136,0.3)'; }
                    }
                }
            }

            Object.assign(b.style, {
                display: 'block', width: '100%', padding: '10px 14px', border: `2px solid ${btnBrd}`,
                borderRadius: '16px', background: btnBg, color: 'white',
                cursor: 'pointer', textAlign: 'center', transition: 'all 0.3s ease', boxShadow: boxShadow
            });
            
            const labelText = clue.label === 'Refs' ? `${clue.label} : ${clue.refValue}` : clue.label;
            const descText = clue.desc;
            b.innerHTML = `<div style="font-weight:800; font-size:14px; text-shadow: 0 1px 3px rgba(0,0,0,0.3);">${labelText}</div><div style="font-size:10px; opacity:0.8; font-weight:600;">${descText}</div>`;
            b.onclick = () => openNfoAndScroll(clue.label, clue.desc);
            body.appendChild(b);
        });

        popupElement.appendChild(body);
        document.body.appendChild(popupElement);

        header.onmousedown = (e) => { isDragging = true; dragOffset.x = e.clientX - popupElement.getBoundingClientRect().left; dragOffset.y = e.clientY - popupElement.getBoundingClientRect().top; popupElement.style.transition = 'none'; };
        document.onmousemove = (e) => { if (!isDragging) return; popupElement.style.left = (e.clientX - dragOffset.x) + 'px'; popupElement.style.top = (e.clientY - dragOffset.y) + 'px'; popupElement.style.right = 'auto'; };
        document.onmouseup = () => { isDragging = false; popupElement.style.transition = 'all 0.6s cubic-bezier(0.25,0.46,0.45,0.94)'; };
    }

    function createVignette() {
        if (vignetteElement) return;
        vignetteElement = document.createElement('div');
        Object.assign(vignetteElement.style, { position: 'fixed', top: '120px', right: '20px', width: '52px', height: '52px', borderRadius: '50%', background: 'linear-gradient(135deg, #4a90e2, #357abd)', border: '3px solid rgba(255,255,255,0.4)', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', zIndex: 2147483646, boxShadow: '0 8px 25px rgba(74,144,226,0.5)', fontWeight: 'bold', fontSize: '22px' });
        vignetteElement.textContent = 'ℹ️';
        vignetteElement.onclick = () => { vignetteElement.remove(); vignetteElement = null; init(); };
        document.body.appendChild(vignetteElement);
    }

    function init() {
        if (!isVideoCategory()) return;
        const mediaInfo = findMediaInfo();
        if (mediaInfo) createPopup(analyzeVideo(mediaInfo.textContent));
        else { const prez = document.querySelector('.prez-body'); if (prez) createPopup(analyzeVideo(prez.textContent)); }
    }

    window.addEventListener('load', () => { setTimeout(init, 800); setTimeout(init, 2000); });
})();