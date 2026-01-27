// ==UserScript==
// @name         yt-dlp Python-Downloader
// @namespace    https://greasyfork.org/en/users/1462137-piknockyou
// @version      9.29
// @author       Piknockyou (vibe-coded)
// @license      AGPL-3.0
// @description  Unified yt-dlp downloader - generates cross-platform Python scripts for video, audio, subtitles
//
// ═══════════════════════════════════════════════════════════════
// CHANGELOG
// ═══════════════════════════════════════════════════════════════
// v9.29
// - Added: Ko-Fi support button in context menu
//
// v9.28
// - Fixed: Vimeo now works reliably by using player URL + referer bypass
//
// v9.27
// - Improved: Output naming now uses yt-dlp metadata (title + id) for better filenames (Instagram, etc.)
// - Keeps current page-title fallback if metadata lookup fails
//
// v9.26
// - Fixed: Dailymotion now works (requires --impersonate to bypass Cloudflare)
// - Added IMPERSONATE_SITES config for sites needing browser impersonation
//
// v9.25
// - Fixed: Audio codec filter quotes no longer break Python syntax
// - Uses escaped quotes in generated format strings
//
// v9.24
// - Added: More video quality options (4K, 1440p, 240p, 144p)
// - Added: Medium audio quality option
// - Added: Audio codec preference (AAC for H.264, Opus for VP9/AV1)
// - Improved codec matching for better compatibility
//
// v9.23
// - Added: "Formats" button to list all available formats for current video
// - Shows yt-dlp --list-formats output in terminal
//
// v9.22
// - Fixed: Format string now includes /best fallback for combined-stream sites
// - TikTok, Twitter etc. no longer fail with "format not available"
//
// v9.21
// - Fixed: Combined-stream detection now works in merge+separate mode (CASE 4)
// - Splits combined stream before merge phase, so merge gets proper inputs
//
// v9.20
// - Fixed: Combined-stream sites now strip audio from video when both are separate
// - Detection: if we requested 2 formats but got 1 file, it's a combined stream
// - Uses ffmpeg remux (no re-encoding) to strip audio track from video
// - Sites with separate streams (YouTube) are unaffected
//
// v9.19
// - Fixed: Video+Audio separate mode now extracts audio when site has combined streams
// - TikTok, Twitter, etc. now correctly produce both video and audio files
// - Uses ffmpeg stream copy (no re-encoding) when extracting audio from video
//
// v9.18
// - Fixed: Audio-only mode now uses --extract-audio for sites without separate streams
// - Uses yt-dlp's native post-processor (ffmpeg) - no re-encoding, stream copy
// - Works reliably on TikTok, Twitter, and other video-only sites
//
// v9.17
// - Fixed: Right-click menu now works on TikTok and other sites with aggressive event handling
// - Fixed: Uses window-level capture to bypass shadow DOM event routing issues
//
// v9.16
// - Fixed: Subtitle check now handles empty output (not just "has no subtitles" message)
//
// v9.15
// - Fixed: Single-component merge no longer creates duplicate when Separate also selected
// - Fixed: Both mkvmerge and FFmpeg paths check for duplicate output in Phase 4
//
// v9.14
// - Fixed: FFmpeg fallback now merges already-downloaded temp files (no double download)
// - Fixed: Added ffmpeg availability check when mkvmerge not found
//
// v9.13
// - Fixed: wait_for_exit() now accepts optional error parameter (was causing crashes)
//
// v9.12
// - Fixed: Audio-only .mp4 files (Twitter/X HLS) now correctly identified
// - Fixed: Uses format_id hint ("audio" in filename) for stream detection
// - Fixed: ffprobe now used for .mp4 files too (not just .webm)
//
// v9.11
// - Changed: Thumbnails mode keeps original format (webp/jpg) instead of converting to PNG
// - Changed: Cleaner thumbnail output messaging
//
// v9.10
// - Fixed: Thumbnails mode now downloads only the best thumbnail (not all 42 variants)
//
// v9.9
// - Added: Thumbnails Only mode - downloads all video thumbnails as PNG
//
// v9.8
// - Cleanup: Removed unused run_command() from generated Python scripts
// - Cleanup: Removed unused GM_setClipboard grant
// - Cleanup: Removed empty mouseleave handler
// - Cleanup: Removed unused active opacity/scale config
// - Cleanup: Simplified wait_for_exit() (removed unused error parameter)
// - Cleanup: Updated Python header version string
//
// v9.7
// - Fixed: Codec label no longer displays on non-YouTube sites (display-only bug)
// - Fixed: Tooltip now shows codec preference on YouTube for consistency
// - Fixed: Comments mode only uses YouTube extractor args on YouTube
// - Cleanup: Removed unused needsMerge from getComponentStates()
//
// v9.6
// - Fixed: Codec selection now works (removed shell quotes that broke Python string literals)
//
// v9.5
// - Fixed: Separate mode now correctly names video/audio files (was using invalid template syntax)
// - Fixed: No-merge case now uses temp files + identification like merge case
//
// v9.4
// - Fixed: Skip subtitle prompt when video has no subtitles available
// - Fixed: Video/audio quality now falls back to best available if requested quality unavailable
// - Fixed: Audio-only merge uses native audio extension instead of .mkv
//
// v9.3
// - Fixed: Submenus now close when hovering over a different component row
//
// v9.2
// - Fixed: Submenu no longer closes when moving mouse from row to submenu (bridged hover gap)
// - Fixed: Selected buttons (Merge/Sep) no longer turn gray on hover
//
// v9.1
// - Fixed: JavaScript booleans (true/false) now correctly converted to Python (True/False)
// - Fixed: Generated scripts now execute properly on all platforms
//
// v9.0
// - Complete rewrite: now generates Python scripts instead of batch files
// - Cross-platform: works on Windows, Mac, and Linux
// - Same functionality as v8.4 batch version
// - Python 3 required (pre-installed on Mac/Linux, install on Windows)
// - Uses only Python standard library (no pip packages needed)
//
// v8.4
// - Refactored: Sites now default to full mkvmerge flow (supports Separate)
// - Added: COMBINED_STREAM_SITES blacklist for sites without separate streams
// - Fixed: Reddit, Twitter, etc. now properly support Merge+Separate
// - Note: Add sites to COMBINED_STREAM_SITES if they fail with "format not available"
//
// v8.3
// - Fixed: Non-YouTube sites now use format with /best fallback
// - Fixed: Livestorm and other HLS sites work again (combined streams)
// - Fixed: Non-YouTube sites skip complex merge flow, use yt-dlp native merge
// - Note: Merge/Separate options still work for YouTube; non-YouTube gets best available
//
// v8.2
// - Changed: Error prompts now require Enter key (not any key) to close
// - Uses "set /p" instead of "pause" for consistent behavior
//
// v8.1
// - Fixed: Removed invalid %(lang)s placeholder from subtitle template
// - Fixed: Subtitle files now correctly named as filename.en.srt (not filename.NA.en.srt)
// - Note: yt-dlp automatically inserts language code before extension
//
// v8.0
// - Complete rewrite of batch generation for all merge/separate combinations
// - Fixed: Subtitle glob patterns now match actual downloaded files
// - Fixed: Separate file naming (no temp prefix in output names)
// - Fixed: Video/audio detection using ffprobe for ambiguous formats
// - Fixed: Selective cleanup - only deletes temp files, preserves separate copies
// - Fixed: All 64 combinations of V/A/S × None/Merge/Sep/Both now work correctly
// - Added: Proper language preservation in subtitle filenames
// - Added: Robust file identification with subroutine-based processing
//
// v7.10
// - Fixed: Merge ON now sets ALL components to Merge (user deselects unwanted)
// - Fixed: Merge OFF only removes from clicked component
// - Fixed: Auto-cleanup when only 1 merge remains
//
// v7.9
// - Fixed: Merge OFF now only removes merge from clicked component
// - Fixed: Other components keep their merge when one is deselected
// - Fixed: Auto-cleanup only when going from 2 merges to 1 (can't merge alone)
// - Fixed: Merge ON adds to clicked + other enabled components if first merge
//
// v7.8
// - Fixed: Merge is now a global toggle - on for all or off for all
// - Fixed: Clicking Merge OFF on any component removes merge from ALL
// - Fixed: Auto-removes merge when only 1 component remains with merge
// - Fixed: Audio was incorrectly included in merge when set to Separate only
//
// v7.7
// - Fixed: Merge button always clickable - clicking sets ALL to merge
// - Fixed: Merge persists on remaining components when one is set to None/Sep
// - Fixed: Merge auto-removes only when single component left with merge
//
// v7.6
// - Fixed: Subtitles no longer downloaded twice in separate mode
// - Fixed: Deactivating Merge on one deactivates Merge on ALL
// - Fixed: Merge button disabled when only one component is enabled
// - Fixed: Submenus now available even when None is selected
// - Fixed: Panel width fits content
//
// v7.5
// - Redesigned output modes: Merge and Separate are now independent toggles
// - Removed "Both" button - now click Merge AND Sep to get both behaviors
// - Clicking Merge auto-activates Merge for all other enabled components
// - Fixed: No longer crashes when only subs want merge but no media to merge into
// - Simplified case logic in batch generation
//
// v7.4
// - Fixed: Crash when subs=Both but no media being merged
// - Fixed: Single yt-dlp call for media+subs (no duplicate metadata fetch)
// - Improved needsMerge logic to require actual media track to merge
//
// v7.3
// - Fixed: Batch window now waits for user confirmation after mkvmerge
// - Fixed: Merge with subtitles no longer crashes
// - Fixed: "Both" mode now correctly creates merged + separate files
// - Restructured batch flow to always reach pause at end
//
// v7.2
// - Fixed: Subtitle-only mode now uses --skip-download correctly
// - Fixed: Merge/Both buttons disabled when only one component selected
// - Reordered output buttons: Merge/Separate/Both/None
// - Improved stability and error handling
//
// v7.1
// - Restructured menu: Video/Audio/Subtitle rows with inline output modes
// - Detail submenus open on hover (disabled if output=None)
// - Menu stays open until clicking outside (even after download)
// - Removed error message - just grays out download button
// - Original subtitle format now default and first in list
//
// v7.0
// - Complete redesign: unified Media Download menu
// - New output modes: None/Merge/Separate/Both for each component
// - Removed interactive console prompts (D/E/ALL/ALLS quick-picks)
// - Removed subtitle source selection (always fetches all available)
// - Subtitle language selection remains in .bat file
// - DRY: shared subtitle format options across all modes
//
// ═══════════════════════════════════════════════════════════════
// SIMPLE SITES - Just add @match lines here, nothing else needed!
// ═══════════════════════════════════════════════════════════════
// @match        *://www.arte.tv/*/videos/*
// @match        *://www.dailymotion.com/*
// @match        *://www.facebook.com/*
// @match        *://www.instagram.com/*
// @match        *://www.reddit.com/*
// @match        *://soundcloud.com/*
// @match        *://www.tagesschau.de/*
// @match        *://www.tiktok.com/*
// @match        *://www.twitch.tv/*
// @match        *://twitter.com/*
// @match        *://vimeo.com/*
// @match        *://player.vimeo.com/*
// @match        *://www.youtube.com/*
// @match        *://x.com/*
//
// ═══════════════════════════════════════════════════════════════
// COMPLEX SITES - These need special extractors (defined below)
// ═══════════════════════════════════════════════════════════════
// @match        *://app.livestorm.co/*
// @icon         https://raw.githubusercontent.com/yt-dlp/yt-dlp/refs/heads/master/devscripts/logo.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/562255/yt-dlp%20Python-Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/562255/yt-dlp%20Python-Downloader.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ═══════════════════════════════════════════════════════════════
    // SITE-SPECIFIC URL CONDITIONS (SPA Support)
    // ═══════════════════════════════════════════════════════════════
    const SITE_CONDITIONS = {
        'www.reddit.com': (url) => /\/r\/[^/]+\/comments\/[^/]+/.test(url),
    };

    // ═══════════════════════════════════════════════════════════════
    // COMPLEX SITES - Only define sites that need special URL extraction
    // ═══════════════════════════════════════════════════════════════
    const COMPLEX_SITES = {
        'app.livestorm.co': {
            cookieFile: 'app.livestorm.co_cookies.txt',
            extractUrl: () => {
                const match = document.documentElement.innerHTML.match(/https:\\?\/\\?\/cdn\.livestorm\.co\\?\/[^"'\s]+\.m3u8[^"'\s]*/);
                return match ? { url: match[0].replace(/\\/g, '') } : { error: 'Video URL not found. Make sure the video is loaded.' };
            }
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // COMBINED STREAM SITES - Sites that only have muxed video+audio
    // These sites don't support Separate mode (no individual streams)
    // Add hostname here if download fails with "format not available"
    // ═══════════════════════════════════════════════════════════════
    const COMBINED_STREAM_SITES = [
        'app.livestorm.co',
        'cdn.livestorm.co',
        // Add more sites here as needed, e.g.:
        // 'some-hls-only-site.com',
    ];

    // ═══════════════════════════════════════════════════════════════
    // IMPERSONATE SITES - Sites that need --impersonate to bypass Cloudflare
    // These sites block requests without browser TLS fingerprinting
    // Requires curl_cffi: pip install "yt-dlp[curl-cffi]"
    // ═══════════════════════════════════════════════════════════════
    const IMPERSONATE_SITES = [
        'www.dailymotion.com',
        'dailymotion.com',
        // Add more sites here as needed
    ];

    // Helper to check if current site needs impersonation
    const needsImpersonation = () => IMPERSONATE_SITES.some(site =>
        window.location.hostname === site ||
        window.location.hostname.endsWith('.' + site)
    );

    // Sites that need a referer header to bypass anti-bot protection
    const REFERER_SITES = {
        'vimeo.com': 'https://vimeo.com/',
        'www.vimeo.com': 'https://vimeo.com/',
        'player.vimeo.com': 'https://vimeo.com/',
    };

    // Helper to get referer for current site
    const getReferer = () => REFERER_SITES[window.location.hostname] || '';

    // Helper to check if current site has combined streams only
    const isCombinedStreamSite = () => COMBINED_STREAM_SITES.some(site =>
        window.location.hostname === site ||
        window.location.hostname.endsWith('.' + site)
    );

    //================================================================================
    // CONFIGURATION
    //================================================================================

    // ═══════════════════════════════════════════════════════════════
    // OUTPUT MODES - Merge and Separate are independent toggles
    // Internal values: 'none', 'merge', 'separate', 'merge-separate'
    // ═══════════════════════════════════════════════════════════════
    const OUTPUT_MODES = [
        { id: 'none', label: 'None', desc: 'Do not download this component' },
        { id: 'merge', label: 'Merge', desc: 'Include in merged file' },
        { id: 'separate', label: 'Separate', desc: 'Keep as standalone file' },
        { id: 'merge-separate', label: 'Merge+Sep', desc: 'Merged AND separate file' },
    ];

    // Helper to check if output includes merge
    const hasMergeFlag = (output) => output === 'merge' || output === 'merge-separate';
    const hasSeparateFlag = (output) => output === 'separate' || output === 'merge-separate';
    const isEnabled = (output) => output !== 'none';

    // ═══════════════════════════════════════════════════════════════
    // VIDEO OPTIONS
    // ═══════════════════════════════════════════════════════════════
    const VIDEO_QUALITIES = [
        { id: 'best', label: 'Best', format: 'bestvideo' },
        { id: '2160p', label: '4K', format: 'bestvideo[height<=2160]/bestvideo' },
        { id: '1440p', label: '1440p', format: 'bestvideo[height<=1440]/bestvideo' },
        { id: '1080p', label: '1080p', format: 'bestvideo[height<=1080]/bestvideo' },
        { id: '720p', label: '720p', format: 'bestvideo[height<=720]/bestvideo' },
        { id: '480p', label: '480p', format: 'bestvideo[height<=480]/bestvideo' },
        { id: '360p', label: '360p', format: 'bestvideo[height<=360]/bestvideo' },
        { id: '240p', label: '240p', format: 'bestvideo[height<=240]/bestvideo' },
        { id: '144p', label: '144p', format: 'bestvideo[height<=144]/bestvideo' },
    ];

    const VIDEO_CODECS = [
        { id: 'default', label: 'Auto', sortArg: '', desc: 'Let yt-dlp choose best available' },
        { id: 'av1', label: 'AV1', sortArg: '-S vcodec:av01', desc: 'Most efficient, needs modern hardware' },
        { id: 'vp9', label: 'VP9', sortArg: '-S vcodec:vp9', desc: 'Good efficiency, wide support' },
        { id: 'h264', label: 'H.264', sortArg: '-S +vcodec:avc', desc: 'Maximum compatibility' },
    ];

    // ═══════════════════════════════════════════════════════════════
    // AUDIO OPTIONS
    // ═══════════════════════════════════════════════════════════════
    const AUDIO_QUALITIES = [
        { id: 'best', label: 'Best', format: 'bestaudio' },
        { id: 'medium', label: 'Medium', format: 'bestaudio[abr<=128]/bestaudio' },
        { id: 'worst', label: 'Smallest', format: 'worstaudio' },
    ];

    // Audio codec preference - matches audio codec to video codec for compatibility
    // Note: formatFilter uses single quotes to avoid breaking Python string literals
    const AUDIO_CODECS = [
        { id: 'auto', label: 'Auto', desc: 'Match video codec (AAC for H.264, Opus for VP9/AV1)' },
        { id: 'aac', label: 'AAC', desc: 'Best compatibility (.m4a)', formatFilter: "[acodec~='^mp4a']" },
        { id: 'opus', label: 'Opus', desc: 'Smaller files (.webm)', formatFilter: "[acodec='opus']" },
    ];

    // ═══════════════════════════════════════════════════════════════
    // SUBTITLE OPTIONS (Original first)
    // ═══════════════════════════════════════════════════════════════
    const SUBTITLE_FORMATS = [
        { id: 'original', label: 'Original', convertArg: '', desc: 'Keep original format' },
        { id: 'srt', label: 'SRT', convertArg: '--convert-subs srt', desc: 'Universal, widely supported' },
        { id: 'vtt', label: 'VTT', convertArg: '--convert-subs vtt', desc: 'Web standard format' },
        { id: 'ass', label: 'ASS', convertArg: '--convert-subs ass', desc: 'Advanced styling support' },
    ];

    // ═══════════════════════════════════════════════════════════════
    // STORAGE KEYS
    // ═══════════════════════════════════════════════════════════════
    const STORAGE_KEYS = {
        VIDEO_QUALITY: 'ytdlp_video_quality',
        VIDEO_CODEC: 'ytdlp_video_codec',
        VIDEO_OUTPUT: 'ytdlp_video_output',
        AUDIO_QUALITY: 'ytdlp_audio_quality',
        AUDIO_CODEC: 'ytdlp_audio_codec',
        AUDIO_OUTPUT: 'ytdlp_audio_output',
        SUBS_FORMAT: 'ytdlp_subs_format',
        SUBS_OUTPUT: 'ytdlp_subs_output',
    };

    // ═══════════════════════════════════════════════════════════════
    // DEFAULTS
    // ═══════════════════════════════════════════════════════════════
    const DEFAULTS = {
        VIDEO_QUALITY: 'best',
        VIDEO_CODEC: 'default',
        VIDEO_OUTPUT: 'merge',
        AUDIO_QUALITY: 'best',
        AUDIO_CODEC: 'auto',
        AUDIO_OUTPUT: 'merge',
        SUBS_FORMAT: 'original',
        SUBS_OUTPUT: 'none',
    };

    // ═══════════════════════════════════════════════════════════════
    // OVERWRITE EXISTING FILES
    // ═══════════════════════════════════════════════════════════════
    const FORCE_OVERWRITE = true;

    //================================================================================
    // STORAGE HELPERS
    //================================================================================

    function getStoredValue(key, defaultValue, validOptions = null) {
        try {
            const stored = GM_getValue(key, defaultValue);
            if (validOptions && !validOptions.some(v => v.id === stored)) {
                return defaultValue;
            }
            return stored;
        } catch (e) {
            return defaultValue;
        }
    }

    function setStoredValue(key, value) {
        try {
            GM_setValue(key, value);
        } catch (e) {
            console.warn('[yt-dlp] Failed to save setting:', e);
        }
    }

    // Getters
    const getVideoQuality = () => getStoredValue(STORAGE_KEYS.VIDEO_QUALITY, DEFAULTS.VIDEO_QUALITY, VIDEO_QUALITIES);
    const getVideoCodec = () => getStoredValue(STORAGE_KEYS.VIDEO_CODEC, DEFAULTS.VIDEO_CODEC, VIDEO_CODECS);
    const getVideoOutput = () => getStoredValue(STORAGE_KEYS.VIDEO_OUTPUT, DEFAULTS.VIDEO_OUTPUT, OUTPUT_MODES);
    const getAudioQuality = () => getStoredValue(STORAGE_KEYS.AUDIO_QUALITY, DEFAULTS.AUDIO_QUALITY, AUDIO_QUALITIES);
    const getAudioCodec = () => getStoredValue(STORAGE_KEYS.AUDIO_CODEC, DEFAULTS.AUDIO_CODEC, AUDIO_CODECS);
    const getAudioOutput = () => getStoredValue(STORAGE_KEYS.AUDIO_OUTPUT, DEFAULTS.AUDIO_OUTPUT, OUTPUT_MODES);
    const getSubsFormat = () => getStoredValue(STORAGE_KEYS.SUBS_FORMAT, DEFAULTS.SUBS_FORMAT, SUBTITLE_FORMATS);
    const getSubsOutput = () => getStoredValue(STORAGE_KEYS.SUBS_OUTPUT, DEFAULTS.SUBS_OUTPUT, OUTPUT_MODES);

    // Setters
    const setVideoQuality = (v) => setStoredValue(STORAGE_KEYS.VIDEO_QUALITY, v);
    const setVideoCodec = (v) => setStoredValue(STORAGE_KEYS.VIDEO_CODEC, v);
    const setVideoOutput = (v) => setStoredValue(STORAGE_KEYS.VIDEO_OUTPUT, v);
    const setAudioQuality = (v) => setStoredValue(STORAGE_KEYS.AUDIO_QUALITY, v);
    const setAudioCodec = (v) => setStoredValue(STORAGE_KEYS.AUDIO_CODEC, v);
    const setAudioOutput = (v) => setStoredValue(STORAGE_KEYS.AUDIO_OUTPUT, v);
    const setSubsFormat = (v) => setStoredValue(STORAGE_KEYS.SUBS_FORMAT, v);
    const setSubsOutput = (v) => setStoredValue(STORAGE_KEYS.SUBS_OUTPUT, v);

    // Helpers
    const findOption = (options, id) => options.find(o => o.id === id);
    const getLabel = (options, id) => findOption(options, id)?.label || options[0].label;
    const isYouTubeDomain = () => ['www.youtube.com', 'youtube.com', 'm.youtube.com'].includes(window.location.hostname);

    //================================================================================
    // VALIDATION & STATE HELPERS
    //================================================================================

    function getComponentStates() {
        const videoOut = getVideoOutput();
        const audioOut = getAudioOutput();
        const subsOut = getSubsOutput();

        const hasVideo = isEnabled(videoOut);
        const hasAudio = isEnabled(audioOut);
        const hasSubs = isEnabled(subsOut);

        const videoMerge = hasMergeFlag(videoOut);
        const audioMerge = hasMergeFlag(audioOut);
        const subsMerge = hasMergeFlag(subsOut);

        const videoSeparate = hasSeparateFlag(videoOut);
        const audioSeparate = hasSeparateFlag(audioOut);
        const subsSeparate = hasSeparateFlag(subsOut);

        const activeCount = [hasVideo, hasAudio, hasSubs].filter(Boolean).length;

        return {
            videoOut, audioOut, subsOut,
            hasVideo, hasAudio, hasSubs,
            videoMerge, audioMerge, subsMerge,
            videoSeparate, audioSeparate, subsSeparate,
            activeCount
        };
    }

    // Count how many components have merge flag
    function getMergeCount() {
        const videoOut = getVideoOutput();
        const audioOut = getAudioOutput();
        const subsOut = getSubsOutput();
        return [hasMergeFlag(videoOut), hasMergeFlag(audioOut), hasMergeFlag(subsOut)].filter(Boolean).length;
    }

    // Set ALL components to merge (preserving separate flags)
    function setAllToMerge() {
        const videoOut = getVideoOutput();
        const audioOut = getAudioOutput();
        const subsOut = getSubsOutput();

        setVideoOutput(hasSeparateFlag(videoOut) ? 'merge-separate' : 'merge');
        setAudioOutput(hasSeparateFlag(audioOut) ? 'merge-separate' : 'merge');
        setSubsOutput(hasSeparateFlag(subsOut) ? 'merge-separate' : 'merge');
    }

    // If only one component has merge, remove it (can't merge alone)
    function cleanupLoneMerge() {
        if (getMergeCount() === 1) {
            const videoOut = getVideoOutput();
            const audioOut = getAudioOutput();
            const subsOut = getSubsOutput();

            if (hasMergeFlag(videoOut)) {
                setVideoOutput(hasSeparateFlag(videoOut) ? 'separate' : 'none');
            }
            if (hasMergeFlag(audioOut)) {
                setAudioOutput(hasSeparateFlag(audioOut) ? 'separate' : 'none');
            }
            if (hasMergeFlag(subsOut)) {
                setSubsOutput(hasSeparateFlag(subsOut) ? 'separate' : 'none');
            }
        }
    }

    // Toggle merge for a component
    function toggleMerge(componentType, currentOutput, setter) {
        const hadMerge = hasMergeFlag(currentOutput);

        if (hadMerge) {
            // Clicking merge OFF: remove merge from THIS component only
            setter(hasSeparateFlag(currentOutput) ? 'separate' : 'none');
            // If only 1 merge remains after this, remove it too (can't merge alone)
            cleanupLoneMerge();
        } else {
            // Clicking merge ON: set ALL components to merge
            // User can deselect the ones they don't want
            setAllToMerge();
        }
    }

    // Toggle separate for a component
    function toggleSeparate(componentType, currentOutput, setter) {
        const hadMerge = hasMergeFlag(currentOutput);
        const hadSeparate = hasSeparateFlag(currentOutput);

        if (hadSeparate) {
            // Remove separate
            setter(hadMerge ? 'merge' : 'none');
        } else {
            // Add separate
            if (currentOutput === 'none') {
                setter('separate');
            } else {
                setter('merge-separate');
            }
        }
        // No need to cleanup here - separate doesn't affect merge count
    }

    // Set component to None
    function setToNone(setter) {
        setter('none');
        // After setting to none, check if only 1 merge left
        cleanupLoneMerge();
    }

    function validateSettings() {
        const state = getComponentStates();

        // Rule 1: At least one component must be non-None
        if (state.activeCount === 0) {
            return { valid: false };
        }

        return { valid: true };
    }

    //================================================================================
    // CONTEXT MENU
    //================================================================================

    const ContextMenu = {
        shadowHost: null,
        shadowRoot: null,
        element: null,
        isOpen: false,
        closeHandler: null,
        updateFunctions: [], // Store update functions for dynamic state

        getStyles() {
            return `
                :host { all: initial; }
                * { box-sizing: border-box; }

                .ytdlp-context-menu {
                    position: fixed;
                    background: #2d2d2d;
                    border: 1px solid #444;
                    border-radius: 8px;
                    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
                    padding: 8px;
                    z-index: 2147483647;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                    font-size: 13px;
                    color: #e0e0e0;
                    user-select: none;
                    pointer-events: auto;
                    display: none;
                    width: fit-content;
                }

                .ytdlp-context-menu.visible { display: block; }

                /* Component rows (Video, Audio, Subtitle) */
                .ytdlp-component-row {
                    padding: 8px 12px;
                    border-radius: 4px;
                    position: relative;
                    transition: background 0.15s;
                }

                .ytdlp-component-row:not(:last-child) {
                    border-bottom: 1px solid #3a3a3a;
                }

                .ytdlp-component-row:hover {
                    background: #3a3a3a;
                }



                .ytdlp-component-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 6px;
                }

                .ytdlp-component-title {
                    font-size: 11px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    color: #aaa;
                }

                .ytdlp-component-arrow {
                    font-size: 9px;
                    opacity: 0.5;
                    transition: opacity 0.15s;
                }

                .ytdlp-component-row:hover .ytdlp-component-arrow {
                    opacity: 1;
                }

                /* Output mode buttons */
                .ytdlp-output-modes {
                    display: flex;
                    gap: 4px;
                }

                .ytdlp-output-btn {
                    padding: 4px 8px;
                    font-size: 11px;
                    border-radius: 4px;
                    cursor: pointer;
                    background: #3a3a3a;
                    color: #999;
                    transition: all 0.15s;
                    border: 1px solid transparent;
                }

                .ytdlp-output-btn:hover:not(.disabled):not(.selected) {
                    background: #444;
                    color: #ccc;
                }

                .ytdlp-output-btn.selected {
                    background: #4a6da7;
                    color: #fff;
                    border-color: #5a7db7;
                }

                .ytdlp-output-btn.selected:hover {
                    background: #5a7db7;
                    border-color: #6a8dc7;
                }

                .ytdlp-output-btn.disabled {
                    opacity: 0.35;
                    cursor: not-allowed;
                    pointer-events: none;
                }

                .ytdlp-output-btn[data-tooltip] {
                    position: relative;
                }

                .ytdlp-output-btn[data-tooltip]:hover::before {
                    content: attr(data-tooltip);
                    position: absolute;
                    bottom: calc(100% + 6px);
                    left: 50%;
                    transform: translateX(-50%);
                    background: rgba(0, 0, 0, 0.9);
                    color: #fff;
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 10px;
                    white-space: nowrap;
                    z-index: 100;
                    pointer-events: none;
                }

                /* Detail submenu */
                .ytdlp-detail-submenu {
                    display: none;
                    position: absolute;
                    right: calc(100% + 4px);
                    top: 0;
                    background: #2d2d2d;
                    border: 1px solid #444;
                    border-radius: 8px;
                    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
                    padding: 8px;
                    min-width: 140px;
                }

                /* Invisible bridge to prevent hover loss when moving to submenu */
                .ytdlp-detail-submenu::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    right: -8px;
                    width: 12px;
                }

                .ytdlp-component-row.submenu-open .ytdlp-detail-submenu {
                    display: block;
                }

                .ytdlp-detail-section {
                    padding: 4px 0;
                }

                .ytdlp-detail-section:not(:last-child) {
                    border-bottom: 1px solid #3a3a3a;
                    margin-bottom: 4px;
                    padding-bottom: 8px;
                }

                .ytdlp-detail-header {
                    padding: 4px 10px;
                    font-size: 10px;
                    text-transform: uppercase;
                    color: #888;
                    letter-spacing: 0.5px;
                }

                .ytdlp-detail-item {
                    padding: 6px 10px;
                    font-size: 12px;
                    cursor: pointer;
                    border-radius: 4px;
                    transition: background 0.15s;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .ytdlp-detail-item:hover {
                    background: #3a3a3a;
                }

                .ytdlp-detail-item.selected::before {
                    content: '✓';
                    font-size: 10px;
                    color: #4CAF50;
                    width: 12px;
                }

                .ytdlp-detail-item:not(.selected)::before {
                    content: '';
                    width: 12px;
                    display: inline-block;
                }

                /* Simple menu row (Comments) */
                .ytdlp-menu-row {
                    display: flex;
                    align-items: center;
                    padding: 10px 12px;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: background 0.15s;
                }

                .ytdlp-menu-row:hover {
                    background: #3a3a3a;
                }

                .ytdlp-menu-row:not(:last-child) {
                    border-bottom: 1px solid #3a3a3a;
                }

                /* Download button */
                .ytdlp-download-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 10px 12px;
                    margin-top: 4px;
                    background: #4CAF50;
                    color: #fff;
                    font-weight: 500;
                    font-size: 13px;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: background 0.15s;
                }

                .ytdlp-download-btn:hover:not(.disabled) {
                    background: #43a047;
                }

                .ytdlp-download-btn.disabled {
                    background: #555;
                    cursor: not-allowed;
                    opacity: 0.6;
                }

                /* Support button */
                .ytdlp-support-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 8px 12px;
                    margin-top: 6px;
                    background: transparent;
                    border: 1px solid #444;
                    color: #888;
                    font-size: 12px;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: all 0.15s;
                    text-decoration: none;
                }

                .ytdlp-support-btn:hover {
                    background: #3a3a3a;
                    border-color: #4CAF50;
                    color: #4CAF50;
                }
            `;
        },

        init() {
            if (this.shadowHost) return;

            try {
                this.shadowHost = document.createElement('div');
                this.shadowHost.id = 'ytdlp-context-menu-host';
                Object.assign(this.shadowHost.style, {
                    position: 'fixed',
                    top: '0',
                    left: '0',
                    width: '0',
                    height: '0',
                    overflow: 'visible',
                    zIndex: '2147483647',
                    pointerEvents: 'none'
                });

                this.shadowRoot = this.shadowHost.attachShadow({ mode: 'open' });

                const style = document.createElement('style');
                style.textContent = this.getStyles();
                this.shadowRoot.appendChild(style);

                this.element = document.createElement('div');
                this.element.className = 'ytdlp-context-menu';
                this.shadowRoot.appendChild(this.element);

                document.body.appendChild(this.shadowHost);

                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape' && this.isOpen) this.hide();
                }, true);
            } catch (e) {
                console.error('[yt-dlp] Failed to init context menu:', e);
            }
        },

        show(x, y, onDownload) {
            if (!this.shadowHost) this.init();
            if (!this.element) return;

            this.isOpen = true;
            this.element.textContent = '';
            this.updateFunctions = [];

            const showCodecOption = isYouTubeDomain();
            let downloadBtn = null;

            // Master update function - updates all dynamic states
            const updateAllStates = () => {
                this.updateFunctions.forEach(fn => {
                    try { fn(); } catch (e) { console.warn('[yt-dlp] Update error:', e); }
                });
                updateDownloadState();
            };

            // Helper to update download button state
            const updateDownloadState = () => {
                if (downloadBtn) {
                    const valid = validateSettings().valid;
                    downloadBtn.classList.toggle('disabled', !valid);
                }
            };

            // Helper to build a component row (Video, Audio, Subtitle)
            const buildComponentRow = (title, componentType, outputGetter, outputSetter, detailBuilder) => {
                const row = document.createElement('div');
                row.className = 'ytdlp-component-row';

                // Header with title and arrow
                const header = document.createElement('div');
                header.className = 'ytdlp-component-header';

                const titleEl = document.createElement('span');
                titleEl.className = 'ytdlp-component-title';
                titleEl.textContent = title;
                header.appendChild(titleEl);

                const arrow = document.createElement('span');
                arrow.className = 'ytdlp-component-arrow';
                arrow.textContent = '◀';
                header.appendChild(arrow);

                row.appendChild(header);

                // Output mode buttons: [Merge] [Sep] [None]
                const modesContainer = document.createElement('div');
                modesContainer.className = 'ytdlp-output-modes';

                const mergeBtn = document.createElement('div');
                mergeBtn.className = 'ytdlp-output-btn';
                mergeBtn.textContent = 'Merge';
                mergeBtn.setAttribute('data-tooltip', 'Include in merged file (syncs with other components)');

                const sepBtn = document.createElement('div');
                sepBtn.className = 'ytdlp-output-btn';
                sepBtn.textContent = 'Sep';
                sepBtn.setAttribute('data-tooltip', 'Keep as standalone file');

                const noneBtn = document.createElement('div');
                noneBtn.className = 'ytdlp-output-btn';
                noneBtn.textContent = 'None';
                noneBtn.setAttribute('data-tooltip', 'Do not download this component');

                mergeBtn.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleMerge(componentType, outputGetter(), outputSetter);
                    updateAllStates();
                };

                sepBtn.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleSeparate(componentType, outputGetter(), outputSetter);
                    updateAllStates();
                };

                noneBtn.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setToNone(outputSetter);
                    updateAllStates();
                };

                modesContainer.appendChild(mergeBtn);
                modesContainer.appendChild(sepBtn);
                modesContainer.appendChild(noneBtn);
                row.appendChild(modesContainer);

                // Detail submenu
                const submenu = document.createElement('div');
                submenu.className = 'ytdlp-detail-submenu';
                detailBuilder(submenu);
                row.appendChild(submenu);

                // Update function for this row
                const updateRowState = () => {
                    const currentOutput = outputGetter();
                    const isMerge = hasMergeFlag(currentOutput);
                    const isSeparate = hasSeparateFlag(currentOutput);
                    const isNone = currentOutput === 'none';

                    // Update button states - Merge and Sep can both be selected
                    // Merge is ALWAYS clickable (clicking sets all to merge)
                    mergeBtn.classList.toggle('selected', isMerge);
                    sepBtn.classList.toggle('selected', isSeparate);
                    noneBtn.classList.toggle('selected', isNone);
                };

                // Register update function
                this.updateFunctions.push(updateRowState);
                updateRowState();

                // Hover to open submenu (always available)
                row.addEventListener('mouseenter', () => {
                    // Close all other submenus first
                    this.element.querySelectorAll('.ytdlp-component-row.submenu-open').forEach(r => {
                        if (r !== row) r.classList.remove('submenu-open');
                    });
                    row.classList.add('submenu-open');
                    requestAnimationFrame(() => {
                        try {
                            const rowRect = row.getBoundingClientRect();
                            const submenuRect = submenu.getBoundingClientRect();
                            submenu.style.top = '0';
                            submenu.style.bottom = '';
                            if (rowRect.top + submenuRect.height > window.innerHeight - 10) {
                                submenu.style.top = 'auto';
                                submenu.style.bottom = '0';
                            }
                        } catch (e) { /* ignore */ }
                    });
                });

                row.addEventListener('mouseleave', () => {
                    row.classList.remove('submenu-open');
                });

                return row;
            };

            // Helper to build detail items
            const buildDetailSection = (container, headerText, options, currentValueGetter, onSelect) => {
                const section = document.createElement('div');
                section.className = 'ytdlp-detail-section';

                const header = document.createElement('div');
                header.className = 'ytdlp-detail-header';
                header.textContent = headerText;
                section.appendChild(header);

                const items = [];

                options.forEach(opt => {
                    const item = document.createElement('div');
                    item.className = 'ytdlp-detail-item';
                    item.textContent = opt.label;

                    item.onclick = (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        items.forEach(el => el.classList.remove('selected'));
                        item.classList.add('selected');
                        onSelect(opt.id);
                    };

                    items.push(item);
                    section.appendChild(item);
                });

                // Update selection state
                const updateSelection = () => {
                    const currentValue = currentValueGetter();
                    items.forEach((item, index) => {
                        item.classList.toggle('selected', options[index].id === currentValue);
                    });
                };

                updateSelection();
                container.appendChild(section);
            };

            // ─────────────────────────────────────────────────────────────
            // VIDEO ROW
            // ─────────────────────────────────────────────────────────────
            const videoRow = buildComponentRow('VIDEO', 'video', getVideoOutput, setVideoOutput, (submenu) => {
                buildDetailSection(submenu, 'Quality', VIDEO_QUALITIES, getVideoQuality, setVideoQuality);
                if (showCodecOption) {
                    buildDetailSection(submenu, 'Codec', VIDEO_CODECS, getVideoCodec, setVideoCodec);
                }
            });
            this.element.appendChild(videoRow);

            // ─────────────────────────────────────────────────────────────
            // AUDIO ROW
            // ─────────────────────────────────────────────────────────────
            const audioRow = buildComponentRow('AUDIO', 'audio', getAudioOutput, setAudioOutput, (submenu) => {
                buildDetailSection(submenu, 'Quality', AUDIO_QUALITIES, getAudioQuality, setAudioQuality);
                if (showCodecOption) {
                    buildDetailSection(submenu, 'Codec', AUDIO_CODECS, getAudioCodec, setAudioCodec);
                }
            });
            this.element.appendChild(audioRow);

            // ─────────────────────────────────────────────────────────────
            // SUBTITLE ROW
            // ─────────────────────────────────────────────────────────────
            const subtitleRow = buildComponentRow('SUBTITLE', 'subs', getSubsOutput, setSubsOutput, (submenu) => {
                buildDetailSection(submenu, 'Format', SUBTITLE_FORMATS, getSubsFormat, setSubsFormat);
            });
            this.element.appendChild(subtitleRow);

            // ─────────────────────────────────────────────────────────────
            // COMMENTS ROW
            // ─────────────────────────────────────────────────────────────
            const commentsRow = document.createElement('div');
            commentsRow.className = 'ytdlp-menu-row';
            commentsRow.textContent = '💬 Comments Only';
            commentsRow.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                onDownload('comments');
            };
            this.element.appendChild(commentsRow);

            // ─────────────────────────────────────────────────────────────
            // THUMBNAILS ROW
            // ─────────────────────────────────────────────────────────────
            const thumbnailsRow = document.createElement('div');
            thumbnailsRow.className = 'ytdlp-menu-row';
            thumbnailsRow.textContent = '🖼️ Thumbnail';
            thumbnailsRow.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                onDownload('thumbnails');
            };
            this.element.appendChild(thumbnailsRow);

            // ─────────────────────────────────────────────────────────────
            // FORMATS ROW
            // ─────────────────────────────────────────────────────────────
            const formatsRow = document.createElement('div');
            formatsRow.className = 'ytdlp-menu-row';
            formatsRow.textContent = '📋 List Formats';
            formatsRow.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                onDownload('formats');
            };
            this.element.appendChild(formatsRow);

            // ─────────────────────────────────────────────────────────────
            // DOWNLOAD BUTTON
            // ─────────────────────────────────────────────────────────────
            downloadBtn = document.createElement('div');
            downloadBtn.className = 'ytdlp-download-btn';
            downloadBtn.textContent = '⬇ Download';

            downloadBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (downloadBtn.classList.contains('disabled')) return;
                if (!validateSettings().valid) return;
                onDownload('media');
            };

            this.element.appendChild(downloadBtn);
            updateDownloadState();

            // ─────────────────────────────────────────────────────────────
            // SUPPORT BUTTON
            // ─────────────────────────────────────────────────────────────
            const supportBtn = document.createElement('a');
            supportBtn.className = 'ytdlp-support-btn';
            supportBtn.href = 'https://ko-fi.com/piknockyou';
            supportBtn.target = '_blank';
            supportBtn.rel = 'noopener noreferrer';
            supportBtn.textContent = '☕ Support';
            supportBtn.title = 'Support this script on Ko-Fi';
            supportBtn.addEventListener('click', (e) => {
                e.stopPropagation();
            });

            this.element.appendChild(supportBtn);

            // Initial update of all states
            updateAllStates();

            // Position menu
            this.element.classList.add('visible');
            requestAnimationFrame(() => {
                try {
                    const rect = this.element.getBoundingClientRect();
                    let left = x - rect.width - 10;
                    let top = y;
                    if (left < 10) left = 10;
                    if (top + rect.height > window.innerHeight - 10) top = window.innerHeight - rect.height - 10;
                    if (top < 10) top = 10;
                    this.element.style.left = left + 'px';
                    this.element.style.top = top + 'px';
                } catch (e) {
                    this.element.style.left = '10px';
                    this.element.style.top = '10px';
                }
            });

            // Outside click handler (only way to close)
            if (this.closeHandler) {
                document.removeEventListener('mousedown', this.closeHandler, true);
            }
            const self = this;
            this.closeHandler = (e) => {
                if (!self.isOpen) return;
                try {
                    if (e.composedPath().includes(self.shadowHost)) return;
                } catch (err) {
                    // composedPath might fail in some edge cases
                    if (self.shadowHost.contains(e.target)) return;
                }
                self.hide();
            };
            setTimeout(() => document.addEventListener('mousedown', this.closeHandler, true), 100);
        },

        hide() {
            if (this.element) {
                this.element.classList.remove('visible');
            }
            this.isOpen = false;
            this.updateFunctions = [];
            if (this.closeHandler) {
                document.removeEventListener('mousedown', this.closeHandler, true);
                this.closeHandler = null;
            }
        },

        isVisible() { return this.isOpen; }
    };

    //================================================================================
    // PYTHON SCRIPT GENERATION
    //================================================================================

    const CONFIG_UI = {
        button: {
            size: 24,
            iconStyle: {
                shadow: { enabled: true, blur: 2, color: 'rgba(255, 255, 255, 0.8)' },
                background: { enabled: true, color: 'rgba(128, 128, 128, 0.25)', borderRadius: '50%' }
            },
            position: { vertical: 'bottom', horizontal: 'right', offsetX: 1, offsetY: 29 },
            opacity: { default: 0.15, hover: 1 },
            scale: { default: 1, hover: 1.1 },
            zIndex: 2147483646
        },
        timing: {
            doubleClickThreshold: 350,
            hideTemporarilyDuration: 5000,
            hoverCheckInterval: 100
        }
    };

    //================================================================================
    // GLOBAL STATE
    //================================================================================

    const hostname = window.location.hostname;
    const complex = COMPLEX_SITES[hostname];
    const siteCondition = SITE_CONDITIONS[hostname];
    const COOKIE_FILE = complex?.cookieFile || `${hostname}_cookies.txt`;

    let shadowRoot = null;
    let notificationElement = null;
    let containerElement = null;

    const STATE = {
        hidden: false,
        lastUrl: window.location.href,
        checkInterval: null
    };

    //================================================================================
    // HELPER FUNCTIONS
    //================================================================================

    const sanitize = (str, max = 80) =>
        (str || 'video').replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_').substring(0, max);

    function getVideoInfo() {
        let url = window.location.href;

        // Vimeo: convert main page URL to player URL for reliable extraction
        const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
        if (vimeoMatch && !url.includes('player.vimeo.com')) {
            url = `https://player.vimeo.com/video/${vimeoMatch[1]}`;
        }

        if (complex?.extractUrl) {
            const result = complex.extractUrl();
            if (result.error) return result;
            return { url: result.url, filename: sanitize(document.title), cookieFile: COOKIE_FILE };
        }
        return { url: url, filename: sanitize(document.title), cookieFile: COOKIE_FILE };
    }

    const getOverwriteFlag = () => FORCE_OVERWRITE ? '--force-overwrites' : '';

    // Helper to convert JS boolean to Python boolean string
    const pyBool = (val) => val ? 'True' : 'False';

    // ═══════════════════════════════════════════════════════════════
    // Python script header template
    // ═══════════════════════════════════════════════════════════════
    function getPythonHeader() {
        return `#!/usr/bin/env python3
"""
yt-dlp Media Downloader
Generated by yt-dlp Python-Downloader userscript
Cross-platform: Works on Windows, Mac, and Linux
Requires: Python 3.6+, yt-dlp
Optional: mkvmerge (for advanced merging), ffmpeg/ffprobe
"""

import subprocess
import sys
import os
import shutil
import random
from pathlib import Path
from glob import glob
import re

# ════════════════════════════════════════════════════════════════════════════════
# HELPER FUNCTIONS
# ════════════════════════════════════════════════════════════════════════════════

def print_header(title):
    """Print a formatted header."""
    print()
    print("=" * 60)
    print(f"  {title}")
    print("=" * 60)
    print()

def print_status(status, message):
    """Print a status message."""
    print(f"[{status}] {message}")

def check_command(cmd):
    """Check if a command is available in PATH."""
    return shutil.which(cmd) is not None

def sanitize_filename(name, max_len=120):
    """
    Make a filename safe across Windows/macOS/Linux while keeping it readable.
    Replaces forbidden characters, collapses whitespace, trims trailing dots/spaces, and limits length.
    """
    if not name:
        return "video"

    # Windows-forbidden + control chars
    name = re.sub(r'[<>:"/\\\\|?*\\x00-\\x1f]', "_", name)

    # Collapse whitespace
    name = re.sub(r'\\s+', " ", name).strip()

    # Windows doesn't like trailing dots/spaces
    name = name.rstrip(". ")

    if not name:
        return "video"

    if len(name) > max_len:
        name = name[:max_len].rstrip(". ")

    return name or "video"

def resolve_output_name(url, cookies_arg, fallback, needs_impersonate=False, impersonate_target="chrome", referer=""):
    """
    Resolve a better output base name using yt-dlp metadata (title + id).
    Falls back to the provided fallback name if anything fails.
    """
    try:
        cmd = ["yt-dlp", "--no-playlist", "--print", "%(title)s [%(id)s]"]

        if referer:
            cmd.extend(["--referer", referer])

        if needs_impersonate:
            cmd.extend(["--impersonate", impersonate_target])

        cmd.extend(cookies_arg)
        cmd.append(url)

        result = subprocess.run(cmd, capture_output=True, text=True)
        out = (result.stdout or "").strip()

        # Use last non-empty line (some extractors print extra stuff)
        lines = [l.strip() for l in out.splitlines() if l.strip()]
        if result.returncode == 0 and lines:
            return sanitize_filename(lines[-1])
    except Exception:
        pass

    return fallback

def wait_for_exit(error=False):
    """Wait for user to press Enter before exiting."""
    print()
    print("Press Enter to exit...")
    try:
        input()
    except:
        pass

def identify_file(filepath, has_ffprobe=False):
    """
    Identify if a file is video, audio, or subtitle based on extension and filename hints.
    Uses format_id in filename (e.g., 'hls-audio-128000') to detect audio streams.
    For ambiguous formats, uses ffprobe if available.
    Returns: 'video', 'audio', 'subtitle', or 'unknown'
    """
    path = Path(filepath)
    name = path.stem.lower()
    ext = path.suffix.lower()

    # Check for subtitle marker in filename
    if "_sub" in name:
        return "subtitle"

    # Check for audio marker in format_id (e.g., "hls-audio-128000-Audio")
    # This catches HLS audio streams that have .mp4 extension
    if "audio" in name and "video" not in name:
        return "audio"

    # Audio-only extensions
    audio_exts = {".m4a", ".mp3", ".opus", ".ogg", ".aac", ".flac", ".wav"}
    if ext in audio_exts:
        return "audio"

    # Unambiguous video extensions
    video_exts = {".mkv", ".avi", ".mov", ".flv", ".ts", ".3gp"}
    if ext in video_exts:
        return "video"

    # Ambiguous extensions (.webm and .mp4 can be video or audio-only)
    if ext in {".webm", ".mp4"}:
        if has_ffprobe:
            try:
                result = subprocess.run(
                    ["ffprobe", "-v", "error", "-select_streams", "v:0",
                     "-show_entries", "stream=codec_type", "-of", "csv=p=0", filepath],
                    capture_output=True, text=True, timeout=10
                )
                if "video" in result.stdout.lower():
                    return "video"
                else:
                    return "audio"
            except:
                pass
        # Fallback: assume video if we can't determine
        return "video"

    return "unknown"

def check_subtitles_available(url, cookies_arg):
    """
    Check if subtitles are available for the video.
    Returns (sub_lang, do_subs, sub_args) tuple.
    - sub_lang: the language code entered by user (or None)
    - do_subs: True if subtitles should be downloaded
    - sub_args: list of yt-dlp arguments for subtitles
    """
    print()
    print("[INFO] Checking for available subtitles...")

    result = subprocess.run(
        ["yt-dlp", "--list-subs"] + cookies_arg + [url],
        capture_output=True, text=True
    )

    combined_output = (result.stdout + result.stderr).lower()

    # Check if no subtitles available
    # yt-dlp may say "has no subtitles" OR just show nothing
    if "has no subtitles" in combined_output:
        print("[INFO] No subtitles available for this video")
        return None, False, []

    # Check if subtitles are actually listed (look for table indicator)
    if "available subtitles" not in combined_output:
        print("[INFO] No subtitles available for this video")
        return None, False, []

    # Subtitles are available - show them and prompt
    print()
    print_header("Available Subtitles")
    print(result.stdout)

    print()
    print("=" * 60)
    print("Enter language code (e.g., en, de, ja)")
    print("Or type 'all' for all languages")
    print("Or press Enter to skip subtitles")
    print("=" * 60)
    print()

    sub_lang = input("Language code: ").strip()

    if not sub_lang:
        print()
        print("Skipping subtitles...")
        return None, False, []

    return sub_lang, True, ["--write-subs", "--write-auto-subs", "--sub-langs", sub_lang]

`;
    }

    function generatePythonScript(url, filename, cookieFile, mode) {
        const overwriteFlag = getOverwriteFlag();

        // ═══════════════════════════════════════════════════════════════
        // COMMENTS MODE
        // ═══════════════════════════════════════════════════════════════
        if (mode === 'comments') {
            return `${getPythonHeader()}
# ════════════════════════════════════════════════════════════════════════════════
# CONFIGURATION
# ════════════════════════════════════════════════════════════════════════════════

URL = "${url}"
FILENAME = "${filename}"
COOKIE_FILE = "${cookieFile}"
OVERWRITE_FLAG = "${overwriteFlag}"

# ════════════════════════════════════════════════════════════════════════════════
# MAIN - Comments Download
# ════════════════════════════════════════════════════════════════════════════════

def main():
    # Change to script directory
    os.chdir(Path(__file__).parent)

    print_header("yt-dlp Comments Downloader")

    # Check for yt-dlp
    if not check_command("yt-dlp"):
        print_status("ERROR", "yt-dlp not found")
        print("Install: pip install yt-dlp")
        print("     or: brew install yt-dlp (Mac)")
        print("     or: winget install yt-dlp (Windows)")
        wait_for_exit()
        sys.exit(1)

    print_status("OK", "yt-dlp found")

    # Build command
    cmd = ["yt-dlp"]

    if OVERWRITE_FLAG:
        cmd.append(OVERWRITE_FLAG)

    # Add cookies if file exists
    if Path(COOKIE_FILE).exists():
        print_status("OK", "Cookie file found")
        cmd.extend(["--cookies", COOKIE_FILE])
    else:
        print_status("INFO", "No cookie file")

    print()
    print(f"URL: {URL}")
    print()

    # Add comment extraction arguments
    cmd.extend([
        URL,
        "--skip-download",
        "--write-comments",
        "--no-playlist",
        "-o", f"{FILENAME}.%(ext)s"
    ])

    # Add YouTube-specific comment sorting (only on YouTube)
    if "youtube.com" in URL or "youtu.be" in URL:
        cmd.insert(-2, "--extractor-args")
        cmd.insert(-2, "youtube:comment_sort=top;max_comments=all,all,all,all")

    # Run yt-dlp
    result = subprocess.run(cmd)

    print()
    if result.returncode != 0:
        print_status("ERROR", "Download failed")
        wait_for_exit()
        sys.exit(1)
    else:
        print_status("SUCCESS", "Comments downloaded!")
        wait_for_exit()

if __name__ == "__main__":
    main()
`;
        }

        // ═══════════════════════════════════════════════════════════════
        // FORMATS MODE
        // ═══════════════════════════════════════════════════════════════
        if (mode === 'formats') {
            return `${getPythonHeader()}
# ════════════════════════════════════════════════════════════════════════════════
# CONFIGURATION
# ════════════════════════════════════════════════════════════════════════════════

URL = "${url}"
COOKIE_FILE = "${cookieFile}"

# ════════════════════════════════════════════════════════════════════════════════
# MAIN - List Formats
# ════════════════════════════════════════════════════════════════════════════════

def main():
    # Change to script directory
    os.chdir(Path(__file__).parent)

    print_header("yt-dlp Format Listing")

    # Check for yt-dlp
    if not check_command("yt-dlp"):
        print_status("ERROR", "yt-dlp not found")
        print("Install: pip install yt-dlp")
        print("     or: brew install yt-dlp (Mac)")
        print("     or: winget install yt-dlp (Windows)")
        wait_for_exit()
        sys.exit(1)

    print_status("OK", "yt-dlp found")

    # Build command
    cmd = ["yt-dlp", "--list-formats"]

    # Add cookies if file exists
    if Path(COOKIE_FILE).exists():
        print_status("OK", "Cookie file found")
        cmd.extend(["--cookies", COOKIE_FILE])
    else:
        print_status("INFO", "No cookie file")

    cmd.append(URL)

    print()
    print(f"URL: {URL}")
    print()
    print("=" * 80)
    print()

    # Run yt-dlp
    result = subprocess.run(cmd)

    print()
    print("=" * 80)
    wait_for_exit()

if __name__ == "__main__":
    main()
`;
        }

        // ═══════════════════════════════════════════════════════════════
        // THUMBNAILS MODE
        // ═══════════════════════════════════════════════════════════════
        if (mode === 'thumbnails') {
            return `${getPythonHeader()}
# ════════════════════════════════════════════════════════════════════════════════
# CONFIGURATION
# ════════════════════════════════════════════════════════════════════════════════

URL = "${url}"
FILENAME = "${filename}"
COOKIE_FILE = "${cookieFile}"
OVERWRITE_FLAG = "${overwriteFlag}"

# ════════════════════════════════════════════════════════════════════════════════
# MAIN - Thumbnails Download
# ════════════════════════════════════════════════════════════════════════════════

def main():
    # Change to script directory
    os.chdir(Path(__file__).parent)

    print_header("yt-dlp Thumbnail Downloader")

    # Check for yt-dlp
    if not check_command("yt-dlp"):
        print_status("ERROR", "yt-dlp not found")
        print("Install: pip install yt-dlp")
        print("     or: brew install yt-dlp (Mac)")
        print("     or: winget install yt-dlp (Windows)")
        wait_for_exit()
        sys.exit(1)

    print_status("OK", "yt-dlp found")

    # Build command
    cmd = ["yt-dlp"]

    if OVERWRITE_FLAG:
        cmd.append(OVERWRITE_FLAG)

    # Add cookies if file exists
    if Path(COOKIE_FILE).exists():
        print_status("OK", "Cookie file found")
        cmd.extend(["--cookies", COOKIE_FILE])
    else:
        print_status("INFO", "No cookie file")

    print()
    print(f"URL: {URL}")
    print()

    # Add thumbnail extraction arguments
    # Uses --write-thumbnail for best quality single thumbnail
    # Keeps original format (webp/jpg) - no conversion needed
    cmd.extend([
        URL,
        "--skip-download",
        "--write-thumbnail",
        "--no-playlist",
        "-o", f"{FILENAME}.%(ext)s"
    ])

    print("Downloading best available thumbnail...")
    print("(yt-dlp probes from highest to lowest quality)")
    print()

    # Run yt-dlp
    result = subprocess.run(cmd)

    print()
    if result.returncode != 0:
        print_status("ERROR", "Download failed")
        wait_for_exit()
        sys.exit(1)
    else:
        # Find the downloaded thumbnail (could be .webp, .jpg, .png)
        thumbs = glob(f"{FILENAME}.webp") + glob(f"{FILENAME}.jpg") + glob(f"{FILENAME}.png")
        if thumbs:
            print_status("SUCCESS", f"Saved: {thumbs[0]}")
        else:
            print_status("WARNING", "Thumbnail file not found")
        wait_for_exit()

if __name__ == "__main__":
    main()
`;
        }

        // ═══════════════════════════════════════════════════════════════
        // MEDIA MODE
        // ═══════════════════════════════════════════════════════════════
        const videoQuality = getVideoQuality();
        const videoCodec = getVideoCodec();
        const videoOutput = getVideoOutput();
        const audioQuality = getAudioQuality();
        const audioOutput = getAudioOutput();
        const subsFormat = getSubsFormat();
        const subsOutput = getSubsOutput();

        const hasVideo = isEnabled(videoOutput);
        const hasAudio = isEnabled(audioOutput);
        const hasSubs = isEnabled(subsOutput);

        const videoMerge = hasMergeFlag(videoOutput);
        const videoSeparate = hasSeparateFlag(videoOutput);
        const audioMerge = hasMergeFlag(audioOutput);
        const audioSeparate = hasSeparateFlag(audioOutput);
        const subsMerge = hasMergeFlag(subsOutput);
        const subsSeparate = hasSeparateFlag(subsOutput);

        // needsMerge: at least 2 components have merge flag
        const mergeCount = [videoMerge, audioMerge, subsMerge].filter(Boolean).length;
        const needsMerge = mergeCount >= 2;

        // Build format string
        const videoFormat = findOption(VIDEO_QUALITIES, videoQuality)?.format || 'bestvideo';
        const codecArg = (hasVideo && isYouTubeDomain() && videoCodec !== 'default')
            ? findOption(VIDEO_CODECS, videoCodec)?.sortArg || ''
            : '';
        const subsConvertArg = findOption(SUBTITLE_FORMATS, subsFormat)?.convertArg || '';

        // Generate summary labels (codec only shown on YouTube)
        const showCodecInLabel = isYouTubeDomain() && videoCodec !== 'default';
        const videoLabel = hasVideo ? `${getLabel(VIDEO_QUALITIES, videoQuality)}${showCodecInLabel ? ` [${getLabel(VIDEO_CODECS, videoCodec)}]` : ''}` : 'None';
        const audioCodec = getAudioCodec();

        // Build audio format with codec filter
        // Note: Uses single quotes inside yt-dlp filter syntax to avoid breaking Python strings
        const buildAudioFormat = () => {
            const baseFormat = findOption(AUDIO_QUALITIES, audioQuality)?.format || 'bestaudio';
            if (!isYouTubeDomain() || audioCodec === 'auto') {
                // Auto mode on YouTube: match to video codec
                if (isYouTubeDomain() && hasVideo && videoCodec !== 'default') {
                    // H.264 pairs with AAC, VP9/AV1 pair with Opus
                    if (videoCodec === 'h264') {
                        return baseFormat.replace('bestaudio', "bestaudio[acodec~='^mp4a']") + '/' + baseFormat;
                    } else {
                        return baseFormat.replace('bestaudio', "bestaudio[acodec='opus']") + '/' + baseFormat;
                    }
                }
                return baseFormat;
            }
            // Explicit codec selection
            const codecFilter = findOption(AUDIO_CODECS, audioCodec)?.formatFilter || '';
            if (codecFilter && baseFormat.includes('bestaudio')) {
                return baseFormat.replace('bestaudio', 'bestaudio' + codecFilter) + '/' + baseFormat;
            }
            return baseFormat;
        };

        const audioFormat = buildAudioFormat();
        const showAudioCodecInLabel = isYouTubeDomain() && audioCodec !== 'auto';
        const audioLabel = hasAudio ? `${getLabel(AUDIO_QUALITIES, audioQuality)}${showAudioCodecInLabel ? ` [${getLabel(AUDIO_CODECS, audioCodec)}]` : ''}` : 'None';
        const subsLabel = hasSubs ? getLabel(SUBTITLE_FORMATS, subsFormat) : 'None';
        const getOutputLabel = (output) => getLabel(OUTPUT_MODES, output);

        // Determine merged output extension
        const mergedExt = (hasVideo && videoMerge) ? 'mkv' : 'mka';

        // Check if combined stream site
        const isCombined = isCombinedStreamSite();

        // Check if site needs impersonation
        const needsImpersonate = needsImpersonation();

        // Get referer for sites that need it (Vimeo, etc.)
        const referer = getReferer();

        return `${getPythonHeader()}
# ════════════════════════════════════════════════════════════════════════════════
# CONFIGURATION
# ════════════════════════════════════════════════════════════════════════════════

URL = "${url}"
FILENAME = "${filename}"
COOKIE_FILE = "${cookieFile}"
OVERWRITE_FLAG = "${overwriteFlag}"

# Component settings
HAS_VIDEO = ${pyBool(hasVideo)}
HAS_AUDIO = ${pyBool(hasAudio)}
HAS_SUBS = ${pyBool(hasSubs)}

VIDEO_MERGE = ${pyBool(videoMerge)}
VIDEO_SEPARATE = ${pyBool(videoSeparate)}
AUDIO_MERGE = ${pyBool(audioMerge)}
AUDIO_SEPARATE = ${pyBool(audioSeparate)}
SUBS_MERGE = ${pyBool(subsMerge)}
SUBS_SEPARATE = ${pyBool(subsSeparate)}

NEEDS_MERGE = ${pyBool(needsMerge)}
MERGED_EXT = "${mergedExt}"

VIDEO_FORMAT = "${videoFormat}"
AUDIO_FORMAT = "${audioFormat}"
CODEC_ARG = "${codecArg}"
SUBS_CONVERT_ARG = "${subsConvertArg}"

IS_COMBINED_STREAM_SITE = ${pyBool(isCombined)}

# Impersonation for Cloudflare bypass (Dailymotion, etc.)
NEEDS_IMPERSONATE = ${pyBool(needsImpersonate)}

# Referer bypass (Vimeo, etc.)
REFERER = "${referer}"

# Display labels
VIDEO_LABEL = "${videoLabel}"
AUDIO_LABEL = "${audioLabel}"
SUBS_LABEL = "${subsLabel}"
VIDEO_OUTPUT_LABEL = "${getOutputLabel(videoOutput)}"
AUDIO_OUTPUT_LABEL = "${getOutputLabel(audioOutput)}"
SUBS_OUTPUT_LABEL = "${getOutputLabel(subsOutput)}"

${generateDownloadFunction(url, filename, {
    hasVideo, hasAudio, hasSubs,
    videoMerge, videoSeparate, audioMerge, audioSeparate, subsMerge, subsSeparate,
    needsMerge,
    videoFormat, audioFormat, codecArg, subsConvertArg,
    mergedExt, isCombined
})}

if __name__ == "__main__":
    main()
`;
    }

    function generateDownloadFunction(url, filename, opts) {
        const {
            hasVideo, hasAudio, hasSubs,
            videoMerge, videoSeparate, audioMerge, audioSeparate, subsMerge, subsSeparate,
            needsMerge,
            videoFormat, audioFormat, codecArg, subsConvertArg,
            mergedExt, isCombined
        } = opts;

        // ═══════════════════════════════════════════════════════════════
        // CASE 1: Subtitles ONLY (no video, no audio)
        // ═══════════════════════════════════════════════════════════════
        if (!hasVideo && !hasAudio && hasSubs) {
            return `
# ════════════════════════════════════════════════════════════════════════════════
# MAIN - Subtitle Only Download
# ════════════════════════════════════════════════════════════════════════════════

def main():
    # Change to script directory
    os.chdir(Path(__file__).parent)

    print_header("yt-dlp Subtitle Downloader")

    # Check for yt-dlp
    if not check_command("yt-dlp"):
        print_status("ERROR", "yt-dlp not found")
        print("Install: pip install yt-dlp")
        wait_for_exit(error=True)
        sys.exit(1)

    print_status("OK", "yt-dlp found")

    # Check for cookies
    cookies_arg = []
    if Path(COOKIE_FILE).exists():
        print_status("OK", "Cookie file found")
        cookies_arg = ["--cookies", COOKIE_FILE]
    else:
        print_status("INFO", "No cookie file")

    print()
    print(f"URL: {URL}")

    # Check for subtitles and prompt if available
    sub_lang, do_subs, sub_args = check_subtitles_available(URL, cookies_arg)

    if not do_subs:
        print()
        print("No subtitles to download.")
        wait_for_exit()
        return

    print()
    print_header("Starting Download...")

    # Build command
    cmd = ["yt-dlp"]
    if OVERWRITE_FLAG:
        cmd.append(OVERWRITE_FLAG)
    cmd.extend(cookies_arg)
    cmd.extend([
        URL,
        "--skip-download"
    ])
    cmd.extend(sub_args)

    # Add subtitle conversion if specified
    if SUBS_CONVERT_ARG:
        cmd.extend(SUBS_CONVERT_ARG.split())

    cmd.extend(["-o", f"{FILENAME}.%(ext)s"])

    # Run download
    result = subprocess.run(cmd)

    print()
    if result.returncode != 0:
        print_status("ERROR", "Subtitle download failed")
        wait_for_exit(error=True)
        sys.exit(1)
    else:
        print_status("OK", "Subtitles downloaded")
        wait_for_exit()
`;
        }

        // ═══════════════════════════════════════════════════════════════
        // CASE 2: Combined stream sites (simpler approach)
        // ═══════════════════════════════════════════════════════════════
        if (isCombined) {
            let formatStr = 'bestvideo+bestaudio/best';
            if (hasVideo && !hasAudio) {
                formatStr = 'bestvideo/best';
            } else if (!hasVideo && hasAudio) {
                formatStr = 'bestaudio/best';
            }

            return `
# ════════════════════════════════════════════════════════════════════════════════
# MAIN - Combined Stream Site Download
# ════════════════════════════════════════════════════════════════════════════════

def main():
    # Change to script directory
    os.chdir(Path(__file__).parent)

    print_header("yt-dlp Media Downloader")

    print(f"URL: {URL}")
    print()
    print("Configuration:")
    print(f"  Video:     {VIDEO_LABEL} [{VIDEO_OUTPUT_LABEL}]")
    print(f"  Audio:     {AUDIO_LABEL} [{AUDIO_OUTPUT_LABEL}]")
    print(f"  Subtitles: {SUBS_LABEL} [{SUBS_OUTPUT_LABEL}]")
    print()
    print("=" * 60)

    # Check for yt-dlp
    if not check_command("yt-dlp"):
        print_status("ERROR", "yt-dlp not found")
        print("Install: pip install yt-dlp")
        wait_for_exit(error=True)
        sys.exit(1)

    print_status("OK", "yt-dlp found")

    # Check for cookies
    cookies_arg = []
    if Path(COOKIE_FILE).exists():
        print_status("OK", "Cookie file found")
        cookies_arg = ["--cookies", COOKIE_FILE]
    else:
        print_status("INFO", "No cookie file")

    # Resolve better base filename from yt-dlp metadata (helps on Instagram etc.)
    global FILENAME
    FILENAME = resolve_output_name(URL, cookies_arg, FILENAME, NEEDS_IMPERSONATE, "chrome", REFERER)
    print_status("INFO", f"Output name: {FILENAME}")

    # Handle subtitles
    sub_args = []
    do_subs = False

    if HAS_SUBS:
        sub_lang, do_subs, sub_args = check_subtitles_available(URL, cookies_arg)
        if do_subs and SUBS_CONVERT_ARG:
            sub_args.extend(SUBS_CONVERT_ARG.split())

    print()
    print_header("Starting Download...")
    print("Downloading from combined-stream site...")

    # Build command
    cmd = ["yt-dlp"]
    if OVERWRITE_FLAG:
        cmd.append(OVERWRITE_FLAG)

    if REFERER:
        cmd.extend(["--referer", REFERER])

    # Add impersonation for sites that need it (Dailymotion, etc.)
    if NEEDS_IMPERSONATE:
        cmd.extend(["--impersonate", "chrome"])

    cmd.extend(cookies_arg)
    cmd.extend([URL, "-f", "${formatStr}"])

    ${hasVideo ? 'cmd.extend(["--merge-output-format", "mkv"])' : '# No video, skip merge format'}

    if do_subs:
        cmd.extend(sub_args)
        cmd.append("--embed-subs")

    cmd.extend(["-o", f"{FILENAME}.%(ext)s"])

    # Run download
    result = subprocess.run(cmd)

    print()
    if result.returncode != 0:
        print_status("ERROR", "Download failed")
        wait_for_exit(error=True)
        sys.exit(1)
    else:
        print_status("OK", "Download complete")
        print()
        print(f"Saved to: {Path.cwd()}")
        wait_for_exit()
`;
        }

        // Build format list with /best fallback for combined-stream sites
        const formats = [];
        if (hasVideo) formats.push(videoFormat);
        if (hasAudio) formats.push(audioFormat);
        const formatStr = formats.length > 0 ? formats.join(',') + '/best' : 'best';

        // ═══════════════════════════════════════════════════════════════
        // CASE 3: No merging needed - direct download
        // ═══════════════════════════════════════════════════════════════
        if (!needsMerge) {
            return `
# ════════════════════════════════════════════════════════════════════════════════
# MAIN - Direct Download (No Merge)
# ════════════════════════════════════════════════════════════════════════════════

def main():
    # Change to script directory
    os.chdir(Path(__file__).parent)

    print_header("yt-dlp Media Downloader")

    print(f"URL: {URL}")
    print()
    print("Configuration:")
    print(f"  Video:     {VIDEO_LABEL} [{VIDEO_OUTPUT_LABEL}]")
    print(f"  Audio:     {AUDIO_LABEL} [{AUDIO_OUTPUT_LABEL}]")
    print(f"  Subtitles: {SUBS_LABEL} [{SUBS_OUTPUT_LABEL}]")
    print()
    print("=" * 60)

    # Check for yt-dlp
    if not check_command("yt-dlp"):
        print_status("ERROR", "yt-dlp not found")
        print("Install: pip install yt-dlp")
        wait_for_exit(error=True)
        sys.exit(1)

    print_status("OK", "yt-dlp found")

    # Check for ffprobe (for file identification)
    has_ffprobe = check_command("ffprobe")

    # Check for cookies
    cookies_arg = []
    if Path(COOKIE_FILE).exists():
        print_status("OK", "Cookie file found")
        cookies_arg = ["--cookies", COOKIE_FILE]
    else:
        print_status("INFO", "No cookie file")

    # Resolve better base filename from yt-dlp metadata
    global FILENAME
    FILENAME = resolve_output_name(URL, cookies_arg, FILENAME, NEEDS_IMPERSONATE, "chrome", REFERER)
    print_status("INFO", f"Output name: {FILENAME}")

    # Handle subtitles
    sub_args = []
    do_subs = False

    if HAS_SUBS:
        sub_lang, do_subs, sub_args = check_subtitles_available(URL, cookies_arg)
        if do_subs and SUBS_CONVERT_ARG:
            sub_args.extend(SUBS_CONVERT_ARG.split())

    print()
    print_header("Starting Download...")

    components = []
    if HAS_VIDEO:
        components.append("video")
    if HAS_AUDIO:
        components.append("audio")
    if do_subs:
        components.append("subtitles")

    print(f"Downloading {' + '.join(components)}...")

    ${hasVideo && hasAudio ? `
    # Both video AND audio - need to download to temp, identify, then rename
    temp_base = f"_ytdlp_tmp_{random.randint(10000, 99999)}"

    # Build command with temp output names
    cmd = ["yt-dlp"]
    if OVERWRITE_FLAG:
        cmd.append(OVERWRITE_FLAG)

    if REFERER:
        cmd.extend(["--referer", REFERER])

    # Add impersonation for sites that need it (Dailymotion, etc.)
    if NEEDS_IMPERSONATE:
        cmd.extend(["--impersonate", "chrome"])

    cmd.extend(cookies_arg)
    cmd.extend([URL, "-f", "${formatStr}"])

    # Add codec sorting if specified
    if CODEC_ARG:
        cmd.extend(CODEC_ARG.split())

    # Use format_id to differentiate files
    if do_subs:
        cmd.extend(sub_args)
        cmd.extend(["-o", f"{temp_base}.%(format_id)s.%(ext)s", "-o", f"subtitle:{temp_base}_sub.%(ext)s"])
    else:
        cmd.extend(["-o", f"{temp_base}.%(format_id)s.%(ext)s"])

    # Run download
    result = subprocess.run(cmd)

    if result.returncode != 0:
        print()
        print_status("ERROR", "Download failed")
        # Cleanup any temp files
        for f in glob(f"{temp_base}*.*"):
            try:
                os.remove(f)
            except:
                pass
        wait_for_exit(error=True)
        sys.exit(1)

    # Identify downloaded files
    print()
    print("Identifying downloaded files...")

    video_file = None
    audio_file = None
    subtitle_files = []

    for filepath in glob(f"{temp_base}*.*"):
        file_type = identify_file(filepath, has_ffprobe)
        basename = os.path.basename(filepath)

        if file_type == "subtitle":
            subtitle_files.append(filepath)
            print(f"  [SUB] {basename}")
        elif file_type == "video":
            video_file = filepath
            print(f"  [VIDEO] {basename}")
        elif file_type == "audio":
            audio_file = filepath
            print(f"  [AUDIO] {basename}")
        else:
            if video_file is None:
                video_file = filepath
                print(f"  [VIDEO] {basename} (assumed)")
            else:
                audio_file = filepath
                print(f"  [AUDIO] {basename} (assumed)")

    # Detect combined stream: we requested both video+audio but only got one file
    is_combined_stream = HAS_VIDEO and HAS_AUDIO and video_file and not audio_file

    # Copy/process to final names
    print()
    print("Creating output files...")

    if is_combined_stream:
        # Combined stream site (TikTok, Twitter, etc.)
        # Need to split the single file into separate video and audio
        print()
        print("[INFO] Site provided combined stream - splitting video and audio...")

        if not check_command("ffmpeg"):
            print_status("WARNING", "ffmpeg not found - cannot split streams")
            print("  Install ffmpeg to properly separate video and audio")
            # Fallback: just copy the combined file as video
            ext = Path(video_file).suffix
            dest = f"{FILENAME}.video{ext}"
            shutil.copy(video_file, dest)
            print_status("OK", f"Created: {dest} (contains audio)")
        else:
            video_ext = Path(video_file).suffix.lower()

            # Extract audio (no video, copy audio codec)
            audio_ext = "m4a" if video_ext == ".mp4" else "ogg" if video_ext == ".webm" else "m4a"
            audio_dest = f"{FILENAME}.audio.{audio_ext}"
            extract_audio = subprocess.run([
                "ffmpeg", "-y", "-i", video_file,
                "-vn", "-acodec", "copy",
                audio_dest
            ], capture_output=True, text=True)

            if extract_audio.returncode == 0:
                print_status("OK", f"Created: {audio_dest}")
            else:
                print_status("ERROR", "Audio extraction failed")

            # Strip audio from video (no audio, copy video codec)
            video_dest = f"{FILENAME}.video{video_ext}"
            strip_audio = subprocess.run([
                "ffmpeg", "-y", "-i", video_file,
                "-an", "-vcodec", "copy",
                video_dest
            ], capture_output=True, text=True)

            if strip_audio.returncode == 0:
                print_status("OK", f"Created: {video_dest}")
            else:
                print_status("ERROR", "Video extraction failed")
                # Fallback: copy original (with audio)
                shutil.copy(video_file, video_dest)
                print_status("OK", f"Created: {video_dest} (contains audio)")

    else:
        # Normal case: separate streams available (YouTube, etc.)
        if video_file:
            ext = Path(video_file).suffix
            dest = f"{FILENAME}.video{ext}"
            shutil.copy(video_file, dest)
            print_status("OK", f"Created: {dest}")

        if audio_file:
            ext = Path(audio_file).suffix
            dest = f"{FILENAME}.audio{ext}"
            shutil.copy(audio_file, dest)
            print_status("OK", f"Created: {dest}")

    for sub_file in subtitle_files:
        basename = os.path.basename(sub_file)
        if "_sub." in basename:
            lang_ext = basename.split("_sub.", 1)[1]
            dest = f"{FILENAME}.{lang_ext}"
            shutil.copy(sub_file, dest)
            print_status("OK", f"Created: {dest}")

    # Cleanup temp files
    cleaned = 0
    for f in glob(f"{temp_base}*.*"):
        try:
            os.remove(f)
            cleaned += 1
        except:
            pass
    print(f"  Cleaned up {cleaned} temp file(s)")

    print()
    print_status("OK", "Download complete")
    print()
    print(f"Saved to: {Path.cwd()}")
    wait_for_exit()
    ` : `
    # Single component - simple direct download
    cmd = ["yt-dlp"]
    if OVERWRITE_FLAG:
        cmd.append(OVERWRITE_FLAG)

    if REFERER:
        cmd.extend(["--referer", REFERER])

    # Add impersonation for sites that need it (Dailymotion, etc.)
    if NEEDS_IMPERSONATE:
        cmd.extend(["--impersonate", "chrome"])

    cmd.extend(cookies_arg)
    cmd.extend([URL, "-f", "${formatStr}"])

    # Add codec sorting if specified
    if CODEC_ARG:
        cmd.extend(CODEC_ARG.split())

    # Audio-only: use --extract-audio for sites without separate audio streams
    # This uses ffmpeg stream copy (no re-encoding) - fast and lossless
    if not HAS_VIDEO and HAS_AUDIO:
        cmd.extend(["--extract-audio", "--audio-quality", "0"])

    cmd.extend(["-o", f"{FILENAME}.%(ext)s"])

    # Add subtitle args if enabled
    if do_subs:
        cmd.extend(sub_args)
        cmd.extend(["-o", f"subtitle:{FILENAME}.%(ext)s"])

    # Run download
    result = subprocess.run(cmd)

    print()
    if result.returncode != 0:
        print_status("ERROR", "Download failed")
        wait_for_exit(error=True)
        sys.exit(1)
    else:
        print_status("OK", "Download complete")
        print()
        print(f"Saved to: {Path.cwd()}")
        wait_for_exit()
    `}
`;
        }

        // ═══════════════════════════════════════════════════════════════
        // CASE 4: Merging required - complex multi-phase download
        // ═══════════════════════════════════════════════════════════════
        return `
# ════════════════════════════════════════════════════════════════════════════════
# MAIN - Multi-Phase Download with Merge
# ════════════════════════════════════════════════════════════════════════════════

def main():
    # Change to script directory
    os.chdir(Path(__file__).parent)

    print_header("yt-dlp Media Downloader")

    print(f"URL: {URL}")
    print()
    print("Configuration:")
    print(f"  Video:     {VIDEO_LABEL} [{VIDEO_OUTPUT_LABEL}]")
    print(f"  Audio:     {AUDIO_LABEL} [{AUDIO_OUTPUT_LABEL}]")
    print(f"  Subtitles: {SUBS_LABEL} [{SUBS_OUTPUT_LABEL}]")
    print()
    print("=" * 60)

    # === Check tools ===
    if not check_command("yt-dlp"):
        print_status("ERROR", "yt-dlp not found")
        print("Install: pip install yt-dlp")
        wait_for_exit(error=True)
        sys.exit(1)

    print_status("OK", "yt-dlp found")

    # Check for cookies
    cookies_arg = []
    if Path(COOKIE_FILE).exists():
        print_status("OK", "Cookie file found")
        cookies_arg = ["--cookies", COOKIE_FILE]
    else:
        print_status("INFO", "No cookie file")

    # Resolve better base filename from yt-dlp metadata (helps on Instagram etc.)
    global FILENAME
    FILENAME = resolve_output_name(URL, cookies_arg, FILENAME, NEEDS_IMPERSONATE, "chrome", REFERER)
    print_status("INFO", f"Output name: {FILENAME}")

    # Check for mkvmerge
    has_mkvmerge = check_command("mkvmerge")
    if has_mkvmerge:
        print_status("OK", "mkvmerge found")
    else:
        print_status("INFO", "mkvmerge not found - using FFmpeg")

    # Check for ffprobe (for file identification)
    has_ffprobe = check_command("ffprobe")

    # Handle subtitles
    sub_args = []
    do_subs = False

    if HAS_SUBS:
        sub_lang, do_subs, sub_args = check_subtitles_available(URL, cookies_arg)
        if do_subs and SUBS_CONVERT_ARG:
            sub_args.extend(SUBS_CONVERT_ARG.split())

    print()
    print_header("Starting Download...")

    # Generate unique temp prefix
    temp_base = f"_ytdlp_tmp_{random.randint(10000, 99999)}"
    dl_error = False

    # ════════════════════════════════════════════════════════════════════════════
    # PHASE 1: Download all components in ONE call (single metadata fetch)
    # ════════════════════════════════════════════════════════════════════════════
    print()
    print("[PHASE 1] Downloading all components...")

    cmd = ["yt-dlp"]
    if OVERWRITE_FLAG:
        cmd.append(OVERWRITE_FLAG)

    if REFERER:
        cmd.extend(["--referer", REFERER])

    # Add impersonation for sites that need it (Dailymotion, etc.)
    if NEEDS_IMPERSONATE:
        cmd.extend(["--impersonate", "chrome"])

    cmd.extend(cookies_arg)
    cmd.extend([URL, "-f", "${formatStr}"])

    # Add codec sorting if specified
    if CODEC_ARG:
        cmd.extend(CODEC_ARG.split())

    # Add subtitle args if enabled
    if do_subs:
        cmd.extend(sub_args)
        cmd.extend(["-o", f"{temp_base}.%(format_id)s.%(ext)s", "-o", f"subtitle:{temp_base}_sub.%(ext)s"])
    else:
        cmd.extend(["-o", f"{temp_base}.%(format_id)s.%(ext)s"])

    result = subprocess.run(cmd)

    if result.returncode != 0:
        dl_error = True
        print()
        print_status("ERROR", "Download failed")
        # Cleanup any temp files
        for f in glob(f"{temp_base}*.*"):
            try:
                os.remove(f)
            except:
                pass
        wait_for_exit(error=True)
        sys.exit(1)

    # ════════════════════════════════════════════════════════════════════════════
    # PHASE 2: Identify downloaded files
    # ════════════════════════════════════════════════════════════════════════════
    print()
    print("[PHASE 2] Identifying downloaded files...")

    video_file = None
    audio_file = None
    subtitle_files = []

    for filepath in glob(f"{temp_base}*.*"):
        file_type = identify_file(filepath, has_ffprobe)
        basename = os.path.basename(filepath)

        if file_type == "subtitle":
            subtitle_files.append(filepath)
            print(f"  [SUB {len(subtitle_files)}] {basename}")
        elif file_type == "video":
            video_file = filepath
            print(f"  [VIDEO] {basename}")
        elif file_type == "audio":
            audio_file = filepath
            print(f"  [AUDIO] {basename}")
        else:
            # Unknown - try to categorize
            if video_file is None:
                video_file = filepath
                print(f"  [VIDEO] {basename} (assumed)")
            else:
                audio_file = filepath
                print(f"  [AUDIO] {basename} (assumed)")

    # Detect combined stream: we requested both video+audio but only got one file
    is_combined_stream = HAS_VIDEO and HAS_AUDIO and video_file and not audio_file

    if is_combined_stream:
        print()
        print("[INFO] Site provided combined stream - splitting before merge...")

        if not check_command("ffmpeg"):
            print_status("WARNING", "ffmpeg not found - cannot split streams")
            print("  Merge will only contain video track")
        else:
            video_ext = Path(video_file).suffix.lower()

            # Extract audio to separate file
            audio_ext = "m4a" if video_ext == ".mp4" else "ogg" if video_ext == ".webm" else "m4a"
            audio_file = f"{temp_base}.extracted_audio.{audio_ext}"
            extract_audio = subprocess.run([
                "ffmpeg", "-y", "-i", video_file,
                "-vn", "-acodec", "copy",
                audio_file
            ], capture_output=True, text=True)

            if extract_audio.returncode == 0:
                print_status("OK", f"Extracted audio: {os.path.basename(audio_file)}")
            else:
                print_status("ERROR", "Audio extraction failed")
                audio_file = None

            # Strip audio from video file (replace in place)
            video_only = f"{temp_base}.video_only{video_ext}"
            strip_audio = subprocess.run([
                "ffmpeg", "-y", "-i", video_file,
                "-an", "-vcodec", "copy",
                video_only
            ], capture_output=True, text=True)

            if strip_audio.returncode == 0:
                # Replace original with stripped version
                try:
                    os.remove(video_file)
                    video_file = video_only
                    print_status("OK", f"Stripped audio from video")
                except:
                    video_file = video_only
            else:
                print_status("WARNING", "Could not strip audio from video")
    else:
        # Normal case - verify we found expected files
        ${hasVideo ? `
        if not video_file:
            print_status("WARNING", "Expected video file not found")
        ` : ''}
        ${hasAudio ? `
        if not audio_file:
            print_status("WARNING", "Expected audio file not found")
        ` : ''}

    # ════════════════════════════════════════════════════════════════════════════
    # PHASE 3: Merge files (only components with Merge flag)
    # ════════════════════════════════════════════════════════════════════════════
    print()
    print("[PHASE 3] Merging selected components...")

    if has_mkvmerge:
        mkv_inputs = []
        merge_has_video = False
        merge_has_audio = False

        ${videoMerge && hasVideo ? `
        if video_file:
            mkv_inputs.append(video_file)
            merge_has_video = True
            print("  Adding to merge: VIDEO")
        ` : '# Video not included in merge'}

        ${audioMerge && hasAudio ? `
        if audio_file:
            mkv_inputs.append(audio_file)
            merge_has_audio = True
            print("  Adding to merge: AUDIO")
        ` : '# Audio not included in merge'}

        ${subsMerge && hasSubs ? `
        if do_subs:
            for sub_file in subtitle_files:
                mkv_inputs.append(sub_file)
                print(f"  Adding to merge: {os.path.basename(sub_file)}")
        ` : '# Subtitles not included in merge'}

        if len(mkv_inputs) >= 2:
            print()
            print("  Running mkvmerge...")

            # Determine actual extension based on what we have
            actual_ext = MERGED_EXT
            if not video_file and audio_file:
                # Audio only - use audio's native extension
                actual_ext = Path(audio_file).suffix.lstrip('.') or 'mka'

            merge_cmd = ["mkvmerge", "-o", f"{FILENAME}.{actual_ext}"] + mkv_inputs
            merge_result = subprocess.run(merge_cmd)

            if merge_result.returncode != 0:
                print_status("ERROR", "mkvmerge failed")
                dl_error = True
            else:
                print_status("OK", f"Created: {FILENAME}.{actual_ext}")

        elif len(mkv_inputs) == 1:
            # Only one component for merge - check if Phase 4 will create it as separate
            skip_direct_save = False
            if merge_has_video and VIDEO_SEPARATE:
                skip_direct_save = True
                print_status("INFO", "Only video for merge - will be saved as separate copy")
            elif merge_has_audio and AUDIO_SEPARATE:
                skip_direct_save = True
                print_status("INFO", "Only audio for merge - will be saved as separate copy")

            if not skip_direct_save:
                src_ext = Path(mkv_inputs[0]).suffix
                dest_file = f"{FILENAME}{src_ext}"
                print_status("INFO", "Only 1 component available - saving directly")
                shutil.copy(mkv_inputs[0], dest_file)
                print_status("OK", f"Created: {dest_file}")

        else:
            print_status("WARNING", "No components to merge")
            dl_error = True

    else:
        # FFmpeg fallback - merge already-downloaded temp files directly
        print("  mkvmerge not found - using FFmpeg to merge temp files...")

        if not check_command("ffmpeg"):
            print_status("ERROR", "Neither mkvmerge nor ffmpeg found!")
            print("  Install mkvmerge: https://mkvtoolnix.download/")
            print("  Or install ffmpeg: https://ffmpeg.org/download.html")
            dl_error = True
        else:
            # Build FFmpeg command to merge the temp files we already downloaded
            ffmpeg_cmd = ["ffmpeg", "-y"]  # -y to overwrite without prompting

            input_idx = 0
            map_args = []
            merge_has_video = False
            merge_has_audio = False

            ${videoMerge && hasVideo ? `
            if video_file:
                ffmpeg_cmd.extend(["-i", video_file])
                map_args.extend(["-map", f"{input_idx}:v"])
                input_idx += 1
                merge_has_video = True
            ` : '# Video not included in merge'}

            ${audioMerge && hasAudio ? `
            if audio_file:
                ffmpeg_cmd.extend(["-i", audio_file])
                map_args.extend(["-map", f"{input_idx}:a"])
                input_idx += 1
                merge_has_audio = True
            ` : '# Audio not included in merge'}

            ${subsMerge && hasSubs ? `
            if do_subs:
                for sub_file in subtitle_files:
                    ffmpeg_cmd.extend(["-i", sub_file])
                    map_args.extend(["-map", f"{input_idx}:s"])
                    input_idx += 1
            ` : '# Subtitles not included in merge'}

            if input_idx >= 2:
                ffmpeg_cmd.extend(["-c", "copy"])  # Copy streams without re-encoding
                ffmpeg_cmd.extend(map_args)

                # Determine output extension
                actual_ext = MERGED_EXT
                if not video_file and audio_file:
                    actual_ext = Path(audio_file).suffix.lstrip('.') or 'mka'

                output_file = f"{FILENAME}.{actual_ext}"
                ffmpeg_cmd.append(output_file)

                print()
                print(f"  Running FFmpeg merge...")
                ffmpeg_result = subprocess.run(ffmpeg_cmd, capture_output=True, text=True)

                if ffmpeg_result.returncode != 0:
                    print_status("ERROR", "FFmpeg merge failed")
                    if ffmpeg_result.stderr:
                        print(f"  {ffmpeg_result.stderr[:200]}")
                    dl_error = True
                else:
                    print_status("OK", f"Created: {output_file}")

            elif input_idx == 1:
                # Only one component for merge - check if Phase 4 will create it as separate
                skip_direct_save = False
                if merge_has_video and VIDEO_SEPARATE:
                    skip_direct_save = True
                    print_status("INFO", "Only video for merge - will be saved as separate copy")
                elif merge_has_audio and AUDIO_SEPARATE:
                    skip_direct_save = True
                    print_status("INFO", "Only audio for merge - will be saved as separate copy")

                if not skip_direct_save:
                    src_file = video_file if merge_has_video else audio_file
                    if src_file:
                        src_ext = Path(src_file).suffix
                        dest_file = f"{FILENAME}{src_ext}"
                        print_status("INFO", "Only 1 component - saving directly")
                        shutil.copy(src_file, dest_file)
                        print_status("OK", f"Created: {dest_file}")
                    else:
                        print_status("WARNING", "No components to merge")
                        dl_error = True
            else:
                print_status("WARNING", "No components to merge")
                dl_error = True

    # ════════════════════════════════════════════════════════════════════════════
    # PHASE 4: Copy files that need to be kept separately
    # ════════════════════════════════════════════════════════════════════════════
    print()
    print("[PHASE 4] Creating separate copies...")

    ${videoSeparate && hasVideo ? `
    if video_file:
        ext = Path(video_file).suffix
        dest = f"{FILENAME}.video{ext}"
        try:
            shutil.copy(video_file, dest)
            print_status("OK", f"Created: {dest}")
        except Exception as e:
            print_status("ERROR", f"Failed to copy video: {e}")
    ` : '# Video separate not requested'}

    ${audioSeparate && hasAudio ? `
    if audio_file:
        ext = Path(audio_file).suffix
        dest = f"{FILENAME}.audio{ext}"
        try:
            shutil.copy(audio_file, dest)
            print_status("OK", f"Created: {dest}")
        except Exception as e:
            print_status("ERROR", f"Failed to copy audio: {e}")
    ` : '# Audio separate not requested'}

    ${subsSeparate && hasSubs ? `
    if do_subs:
        for sub_file in subtitle_files:
            # Extract lang.ext from temp_sub.lang.ext
            basename = os.path.basename(sub_file)
            # Remove the temp prefix to get lang.ext
            if "_sub." in basename:
                lang_ext = basename.split("_sub.", 1)[1]
                dest = f"{FILENAME}.{lang_ext}"
                try:
                    shutil.copy(sub_file, dest)
                    print_status("OK", f"Created: {dest}")
                except Exception as e:
                    print_status("ERROR", f"Failed to copy subtitle: {e}")
    ` : '# Subtitle separate not requested'}

    # ════════════════════════════════════════════════════════════════════════════
    # PHASE 5: Cleanup temporary files
    # ════════════════════════════════════════════════════════════════════════════
    print()
    print("[PHASE 5] Cleaning up temporary files...")

    cleaned = 0
    for f in glob(f"{temp_base}*.*"):
        try:
            os.remove(f)
            cleaned += 1
        except:
            pass

    print(f"  Removed {cleaned} temporary file(s)")

    # Final status
    if dl_error:
        print()
        print("=" * 60)
        print("  [WARNING] Some operations may have failed - check messages above")
        print("=" * 60)
        wait_for_exit(error=True)
    else:
        print()
        print_status("SUCCESS", "Download complete!")
        print()
        print(f"Saved to: {Path.cwd()}")
        wait_for_exit()
`;
    }

    //================================================================================
    // NOTIFICATIONS
    //================================================================================

    function showNotification(message, type = 'info') {
        if (!shadowRoot || !notificationElement) return;
        try {
            notificationElement.classList.remove('show');
            notificationElement.textContent = message;
            notificationElement.setAttribute('data-type', type);
            void notificationElement.offsetWidth;
            notificationElement.classList.add('show');
            setTimeout(() => notificationElement.classList.remove('show'), 2500);
        } catch (e) {
            console.warn('[yt-dlp] Notification error:', e);
        }
    }

    //================================================================================
    // MAIN FUNCTIONS
    //================================================================================

    function executeDownload(mode) {
        const info = getVideoInfo();
        if (info.error) {
            showNotification(info.error, 'error');
            return;
        }

        if (mode === 'media') {
            const validation = validateSettings();
            if (!validation.valid) {
                showNotification('Select at least one component', 'error');
                return;
            }
        }

        if (window._ytdlpUpdateTooltip) window._ytdlpUpdateTooltip();

        const content = generatePythonScript(info.url, info.filename, info.cookieFile, mode);
        const scriptFilename = `dl_${info.filename}.py`;

        try {
            const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
            const blobUrl = URL.createObjectURL(blob);
            const a = Object.assign(document.createElement('a'), { href: blobUrl, download: scriptFilename });
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(blobUrl);
            showNotification('⬇ Downloading .py', 'info');
        } catch (e) {
            console.error("[yt-dlp] Download failed:", e);
            showNotification('Download failed', 'error');
        }
    }

    //================================================================================
    // VISIBILITY & SPA LOGIC
    //================================================================================

    function shouldBeVisible() {
        return !STATE.hidden && (!siteCondition || siteCondition(window.location.href));
    }

    function updateVisibility() {
        if (containerElement) {
            containerElement.classList.toggle('hidden', !shouldBeVisible());
        }
    }

    function handleUrlChange() {
        if (window.location.href !== STATE.lastUrl) {
            STATE.hidden = false;
            STATE.lastUrl = window.location.href;
            updateVisibility();
        }
    }

    function startSPAMonitoring() {
        ['pushState', 'replaceState'].forEach(method => {
            const original = history[method];
            history[method] = function(...args) {
                const result = original.apply(this, args);
                setTimeout(handleUrlChange, 0);
                return result;
            };
        });
        ['popstate', 'hashchange'].forEach(event =>
            window.addEventListener(event, () => setTimeout(handleUrlChange, 0))
        );
        STATE.checkInterval = setInterval(handleUrlChange, 500);
    }

    //================================================================================
    // STYLES
    //================================================================================

    function getStyles() {
        const { size, iconStyle, position: pos, opacity, scale, zIndex } = CONFIG_UI.button;
        const iconSize = size - 4;

        return `
            :host { all: initial; }
            * { box-sizing: border-box; }

            .ytdlp-container {
                position: fixed;
                ${pos.vertical}: ${pos.offsetY}px;
                ${pos.horizontal}: ${pos.offsetX}px;
                z-index: ${zIndex};
                pointer-events: auto;
                user-select: none;
            }

            .ytdlp-container.hidden { display: none !important; }

            .ytdlp-btn {
                position: relative;
                width: ${size}px;
                height: ${size}px;
                background: transparent;
                border: none;
                cursor: pointer;
                opacity: ${opacity.default};
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0;
                margin: 0;
                transform: scale(${scale.default});
                touch-action: manipulation;
                -webkit-tap-highlight-color: transparent;
            }

            .ytdlp-btn[data-hover="true"] { opacity: ${opacity.hover}; transform: scale(${scale.hover}); }

            .ytdlp-icon-container {
                display: flex;
                align-items: center;
                justify-content: center;
                width: ${size}px;
                height: ${size}px;
                border-radius: ${iconStyle.background.enabled ? iconStyle.background.borderRadius : '0'};
                background-color: ${iconStyle.background.enabled ? iconStyle.background.color : 'transparent'};
                pointer-events: none;
            }

            .ytdlp-icon {
                width: ${iconSize}px;
                height: ${iconSize}px;
                display: block;
                pointer-events: none;
                ${iconStyle.shadow.enabled ? `filter: drop-shadow(0 0 ${iconStyle.shadow.blur}px ${iconStyle.shadow.color}) drop-shadow(0 0 ${iconStyle.shadow.blur * 0.5}px ${iconStyle.shadow.color});` : ''}
            }

            .ytdlp-notification {
                position: fixed;
                ${pos.vertical}: ${pos.offsetY + size + 10}px;
                ${pos.horizontal}: ${pos.offsetX}px;
                padding: 8px 16px;
                color: white;
                border-radius: 6px;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                font-size: 13px;
                font-weight: 500;
                z-index: ${zIndex - 1};
                box-shadow: 0 3px 12px rgba(0,0,0,0.25);
                opacity: 0;
                transform: translateY(10px);
                transition: opacity 0.3s, transform 0.3s;
                pointer-events: none;
            }

            .ytdlp-notification.show { opacity: 1; transform: translateY(0); }
            .ytdlp-notification[data-type="success"] { background: #4CAF50; border: 1px solid #388E3C; }
            .ytdlp-notification[data-type="error"] { background: #f44336; border: 1px solid #c62828; }
            .ytdlp-notification[data-type="info"] { background: #2196F3; border: 1px solid #1565C0; }
            .ytdlp-notification[data-type="warning"] { background: #FF9800; border: 1px solid #EF6C00; }

            .ytdlp-btn::after {
                content: attr(data-tooltip);
                position: absolute;
                ${pos.horizontal === 'right' ? 'right' : 'left'}: ${size + 8}px;
                ${pos.vertical === 'bottom' ? 'bottom' : 'top'}: 0;
                background: rgba(30, 30, 30, 0.95);
                color: #fff;
                padding: 8px 12px;
                border-radius: 6px;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                font-size: 12px;
                line-height: 1.5;
                white-space: pre;
                pointer-events: none;
                opacity: 0;
                visibility: hidden;
                transition: opacity 0.15s ease, visibility 0.15s ease;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                z-index: ${zIndex + 1};
            }

            .ytdlp-btn[data-hover="true"]::after { opacity: 1; visibility: visible; }
        `;
    }

    //================================================================================
    // FLOATING BUTTON
    //================================================================================

    function addFloatingDownloadButton() {
        if (!document.body) return;

        try {
            const shadowHost = document.createElement('div');
            shadowHost.id = 'ytdlp-downloader-host';
            Object.assign(shadowHost.style, {
                position: 'fixed', top: '0', left: '0', width: '0', height: '0',
                overflow: 'visible', zIndex: CONFIG_UI.button.zIndex.toString(),
                pointerEvents: 'none', userSelect: 'none'
            });

            shadowRoot = shadowHost.attachShadow({ mode: 'closed' });
            shadowRoot.appendChild(Object.assign(document.createElement('style'), { textContent: getStyles() }));

            containerElement = Object.assign(document.createElement('div'), { className: 'ytdlp-container' });

            const btn = Object.assign(document.createElement('div'), { className: 'ytdlp-btn' });

            const updateTooltip = () => {
                const videoOut = getVideoOutput();
                const audioOut = getAudioOutput();
                const subsOut = getSubsOutput();

                const parts = [];
                if (videoOut !== 'none') {
                    const codecSuffix = (isYouTubeDomain() && getVideoCodec() !== 'default')
                        ? ` [${getLabel(VIDEO_CODECS, getVideoCodec())}]`
                        : '';
                    parts.push(`Video: ${getLabel(VIDEO_QUALITIES, getVideoQuality())}${codecSuffix} [${getLabel(OUTPUT_MODES, videoOut)}]`);
                }
                if (audioOut !== 'none') {
                    const audioCodecSuffix = (isYouTubeDomain() && getAudioCodec() !== 'auto')
                        ? ` [${getLabel(AUDIO_CODECS, getAudioCodec())}]`
                        : '';
                    parts.push(`Audio: ${getLabel(AUDIO_QUALITIES, getAudioQuality())}${audioCodecSuffix} [${getLabel(OUTPUT_MODES, audioOut)}]`);
                }
                if (subsOut !== 'none') {
                    parts.push(`Subs: ${getLabel(SUBTITLE_FORMATS, getSubsFormat())} [${getLabel(OUTPUT_MODES, subsOut)}]`);
                }
                if (parts.length === 0) {
                    parts.push('(Nothing selected)');
                }

                btn.setAttribute('data-tooltip', [
                    '𝘆𝘁-𝗱𝗹𝗽 𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱𝗲𝗿',
                    '',
                    ...parts,
                    '',
                    'Click: Download',
                    'Right-click: Options',
                    'Double-click: Hide 5s'
                ].join('\n'));
            };

            updateTooltip();
            window._ytdlpUpdateTooltip = updateTooltip;

            const iconContainer = Object.assign(document.createElement('div'), { className: 'ytdlp-icon-container' });
            const iconSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            ['class', 'ytdlp-icon', 'viewBox', '0 0 24 24', 'fill', 'none', 'stroke', '#555', 'stroke-width', '2', 'stroke-linecap', 'round', 'stroke-linejoin', 'round']
                .reduce((acc, val, i, arr) => (i % 2 === 0 && iconSvg.setAttribute(val, arr[i + 1]), acc), null);

            const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            [['x', '2'], ['y', '6'], ['width', '14'], ['height', '12'], ['rx', '2'], ['ry', '2']].forEach(([k, v]) => rect.setAttribute(k, v));

            const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            polygon.setAttribute('points', '22 8 16 12 22 16 22 8');

            iconSvg.append(rect, polygon);
            iconContainer.appendChild(iconSvg);
            btn.appendChild(iconContainer);
            containerElement.appendChild(btn);

            ContextMenu.init();
            shadowRoot.appendChild(containerElement);

            notificationElement = Object.assign(document.createElement('div'), { className: 'ytdlp-notification' });
            notificationElement.setAttribute('data-type', 'info');
            shadowRoot.appendChild(notificationElement);

            document.body.appendChild(shadowHost);

            //================================================================================
            // INTERACTION HANDLERS
            //================================================================================

            let lastClickTime = 0, hideTimeout = null;
            let hoverCheckInterval = null, lastMouseX = 0, lastMouseY = 0, isHovering = false;

            const setAttr = (attr, val) => btn.setAttribute(`data-${attr}`, val ? 'true' : 'false');
            const setHover = (val) => { if (isHovering !== val) { isHovering = val; setAttr('hover', val); } };

            const isInsideButton = (x, y) => {
                try {
                    const r = btn.getBoundingClientRect();
                    return x >= r.left - 2 && x <= r.right + 2 && y >= r.top - 2 && y <= r.bottom + 2;
                } catch (e) {
                    return false;
                }
            };

            const onGlobalMouseMove = (e) => { lastMouseX = e.clientX; lastMouseY = e.clientY; };

            const startHoverTracking = () => {
                if (hoverCheckInterval) return;
                document.addEventListener('mousemove', onGlobalMouseMove, { passive: true });
                hoverCheckInterval = setInterval(() => {
                    if (!isInsideButton(lastMouseX, lastMouseY)) { setHover(false); stopHoverTracking(); }
                }, CONFIG_UI.timing.hoverCheckInterval);
            };

            const stopHoverTracking = () => {
                if (hoverCheckInterval) { clearInterval(hoverCheckInterval); hoverCheckInterval = null; }
                document.removeEventListener('mousemove', onGlobalMouseMove);
            };

            btn.addEventListener('mouseenter', (e) => { lastMouseX = e.clientX; lastMouseY = e.clientY; setHover(true); startHoverTracking(); });

            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const now = Date.now();
                const timeSinceLastClick = now - lastClickTime;
                lastClickTime = now;

                if (ContextMenu.isVisible()) {
                    ContextMenu.hide();
                    return;
                }

                // Double-click to hide
                if (timeSinceLastClick < CONFIG_UI.timing.doubleClickThreshold) {
                    window.getSelection?.().removeAllRanges();
                    STATE.hidden = true;
                    stopHoverTracking();
                    setHover(false);
                    updateVisibility();
                    clearTimeout(hideTimeout);
                    hideTimeout = setTimeout(() => { STATE.hidden = false; updateVisibility(); }, CONFIG_UI.timing.hideTemporarilyDuration);
                    return;
                }

                // Single click - download with current settings
                executeDownload('media');
            });

            btn.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                e.stopPropagation();
                ContextMenu.show(e.clientX, e.clientY, (mode) => executeDownload(mode));
            });

            // Window-level contextmenu interceptor (capture phase)
            // This bypasses shadow DOM event routing issues on sites like TikTok
            window.addEventListener('contextmenu', (e) => {
                try {
                    const btnRect = btn.getBoundingClientRect();
                    // Check if right-click is within our button bounds (with small padding)
                    if (e.clientX >= btnRect.left - 2 && e.clientX <= btnRect.right + 2 &&
                        e.clientY >= btnRect.top - 2 && e.clientY <= btnRect.bottom + 2) {
                        e.preventDefault();
                        e.stopPropagation();
                        e.stopImmediatePropagation();
                        ContextMenu.show(e.clientX, e.clientY, (mode) => executeDownload(mode));
                        return false;
                    }
                } catch (err) {
                    // Ignore - button may not be ready
                }
            }, { capture: true });

            window.addEventListener('beforeunload', stopHoverTracking);

            updateVisibility();
            startSPAMonitoring();
            console.log('[yt-dlp Downloader] Initialized - Python edition');
        } catch (e) {
            console.error('[yt-dlp] Failed to initialize:', e);
        }
    }

    //================================================================================
    // INIT
    //================================================================================

    if (document.body) addFloatingDownloadButton();
    else document.addEventListener('DOMContentLoaded', addFloatingDownloadButton);

})();