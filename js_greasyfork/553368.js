// ==UserScript==
// @name         OldYTPlayer | YouTube Old Player UI Pre-2025 & Minimal Tweaks
// @namespace    https://greasyfork.org/
// @match        https://www.youtube.com/*
// @license      MIT
// @author       DudeAint
// @grant        none
// @run-at       document-start
// @description  Removes YouTube’s new “Delhi” player experiment flags to restore the old video player UI. In English, this userscript brings back the Youtube UI we all know and love. This was developed due to many users like myself wanting a free method to get rid of the new video player change Youtube has forced on us. This userscript also comes with Return Youtube Dislike, Skip Sponsored Segments via Sponsorblock & many tweaks, all of which are toggleable.
// @version      0.3.1
// @icon         https://files.catbox.moe/tac4lf.png
// @supportURL   http://greasyfork.org/en/scripts/553368-oldytplayer-youtube-old-player-ui-pre-2025-minimal-tweaks/feedback
// @downloadURL https://update.greasyfork.org/scripts/553368/OldYTPlayer%20%7C%20YouTube%20Old%20Player%20UI%20Pre-2025%20%20Minimal%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/553368/OldYTPlayer%20%7C%20YouTube%20Old%20Player%20UI%20Pre-2025%20%20Minimal%20Tweaks.meta.js
// ==/UserScript==

/*
Information & Set-Up

This userscript restores the old Youtube UI player (Remove "Delhi" Experiments flag) & Returns Youtube Dislikes & Skips Sponsored Segments via Sponsorblock.
You can view more about features reading below each setting or on the Greasyfork info page.

🧑‍💻 Supported Devices & Extensions:
You can use it on PC on Chrome/FireFox/Opera/Edge with Tampermonkey/Scriptcat/Violentmonkey [Free].
You can use it on MacOS on Safari with Stay for Safari [Free].
You can use it on iOS on Safari with Stay for Safari [Free].

Note: unfortunately, this will stop working when Youtube removes the old player UI.

Credits go to "Control Panel for Youtube" for finding this: https://github.com/insin/control-panel-for-youtube/

More information on features are on the main page.
You can use this code in your own projects, if you would like.
If you are reading, please give a good feedback on my page, as I update regularly.
*/

(function () {
  'use strict';

  try {

function wantsRefresh(cfg, cur, appl){ const mode = (cfg && typeof cfg.refreshToggle === 'string') ? cfg.refreshToggle : null; if (mode === 'onlyOff') return !!(appl && !cur); if (mode === 'onlyOn') return !!(!appl && cur); const prompt = (typeof cfg?.promptRefresh === 'boolean') ? cfg.promptRefresh : false; return !!(prompt && (cur !== appl)); }
function setAppliedIfOnlyOff(cfg, nowOn){ if (cfg?.refreshToggle === 'onlyOff' && nowOn) { appliedSet(cfg.id, true); } }

const CONFIG_TOGGLES = [
  {
    id: 'revert_player',
    name: 'Revert Old Youtube Player',
    desc: 'Restores the pre-2025 player UI and hides the new fullscreen UI. May require a refresh.',
    iconName: 'home',
    promptRefresh: true,
    onChange: (state) => {
      if (state) {
        robustRemoveDelhiFlagsWithRetries();
        applyFullscreenHideCSS();
      } else {
        removeFullscreenHideCSS();
      }
    }
  },

  {
    id: 'skip_sponsor_segments',
    name: 'Skip Sponsored Segments',
    desc: 'Skips promotional video content powered by SponsorBlock.',
    iconName: 'skip_next',
    refreshToggle: 'onlyOff', // only show refresh banner when turning OFF
    onChange: (on) => { on ? SponsorBlock.enable() : SponsorBlock.disable(); }
  },

  {
    id: 'enable_dislikes',
    name: 'Enable Dislikes',
    desc: 'Shows community dislike counts via Return YouTube Dislike.',
    iconName: 'thumb_down',
    refreshToggle: 'onlyOff', // only show refresh banner when turning OFF
    onChange: (on) => { try { on ? RYD.start() : RYD.stop(); } catch(_){} }
  }
];

/* =================== Setting blocks =================== */
const CONFIG_BLOCKS = [
  {
    type: 'block',
    id: 'annoyances',
    name: 'Annoyances',
    desc: 'Hide little nuisances in the player.',
    iconName: 'block',
    children: [
      {
        id: 'remove_ai_summary',
        name: 'Remove AI Summary',
        desc: 'Hides the AI-generated video summary block and the "Ask" AI button. No refresh needed.',
        iconName: 'summarize',
        promptRefresh: false,
        onChange: (on) => { if (on) applyRemoveAISummaryCSS(); else removeRemoveAISummaryCSS(); }
      },
      {
        id: 'remove_pink',
        name: 'Remove Pink Gradient',
        desc: 'Reverts the pink progress bar to the original YouTube color.',
        iconName: 'format_color_reset',
        promptRefresh: false,
        onChange: (on) => { if (on) applyRemovePinkCSS(); else removeRemovePinkCSS(); }
      },
      {
        id: 'hide_sponsored',
        name: 'Hide Sponsored Ads',
        desc: 'Hides ad panels, sponsored banners, paid content overlays, merch, offers, channel watermarks, and promoted sections.',
        iconName: 'money_off',
        promptRefresh: false,
        onChange: (on) => { if (on) applyHideSponsoredCSS(); else removeHideSponsoredCSS(); }
      },
      {
        id: 'hide_shorts',
        name: 'Hide Shorts',
        desc: 'Hides YouTube Shorts from home, search, side menu, related, and more.',
        iconName: 'hide_source',
        promptRefresh: false,
        onChange: (on) => { if (on) applyHideShortsCSS(); else removeHideShortsCSS(); }
      },
      {
        id: 'hide_share_thanks_clip',
        name: 'Hide Share/Thanks/Clip Buttons',
        desc: 'Hides Share, Thanks, and Clip buttons on video pages and menus.',
        iconName: 'ios_share',
        promptRefresh: false,
        onChange: (on) => { if (on) applyHideShareThanksClipCSS(); else removeHideShareThanksClipCSS(); }
      },
      {
        id: 'remove_hide_button',
        name: 'Remove Hide Button',
        desc: 'Hides the endscreen "Hide" button overlay shown at video end.',
        iconName: 'visibility_off',
        promptRefresh: false,
        onChange: (on)=>{ if(on) applyRemoveHideButtonCSS(); else removeRemoveHideButtonCSS(); }
      },
    ]
  },
  {
    type: 'block',
    id: 'tweaks',
    name: 'Tweaks',
    desc: 'Change the way Youtube looks.',
    iconName: 'tune',
    children: [
      {
        id: 'classic_likes',
        name: 'Classic Like/Dislike Buttons',
        desc: 'Restores the old YouTube-style like and dislike buttons across the site.',
        iconName: 'thumb_up',
        promptRefresh: false,
        onChange: (on) => { if (on) applyClassicLikesCSS(); else removeClassicLikesCSS(); }
      },
      {
        id: 'restore_miniplayer_button',
        name: 'Restore Miniplayer Button',
        desc: 'Adds a Miniplayer button next to the player size control (hidden in fullscreen).',
        iconName: 'picture_in_picture_alt',
        promptRefresh: false,
        onChange: (on) => { if (on) applyRestoreMiniplayerButton(); else removeRestoreMiniplayerButton(); }
      },
      {
        type: 'select',
        id: 'search_thumb_size',
        name: 'Search Thumbnails Size',
        desc: 'Adjusts thumbnail & avatar sizes on search pages.',
        iconName: 'photo_size_select_large',
        promptRefresh: false,
        options: [
          { value: 'small',  label: 'Small' },
          { value: 'medium', label: 'Medium' },
          { value: 'large',  label: 'Large (Default)' }
        ],
        default: 'large',
        onChange: (value) => { applySearchThumbSizeCSS(value); }
      },
      {
        type: 'select',
        id: 'minimum_grid_items',
        name: 'Minimum Grid Items Per Row',
        desc: 'Force a minimum number of videos per row on Home and Subscriptions pages.',
        iconName: 'view_column',
        promptRefresh: true,
        options: [
          { value: 'auto', label: 'Auto (Default)' },
          { value: '6',    label: '6 per row' },
          { value: '5',    label: '5 per row' },
          { value: '4',    label: '4 per row' },
          { value: '3',    label: '3 per row' },
          { value: '2',    label: '2 per row (may not work!)' }
        ],
        default: 'auto',
        onChange: (val) => applyMinimumGridItemsCSS(val)
      },
      {
        id: 'reset_configs',
        name: 'Reset All Settings',
        desc: 'Clears all saved preferences and restores default configuration. Refresh required.',
        iconName: 'restart_alt',
        promptRefresh: true,
        onChange: (on) => {
          if (!on) return;
          const confirmed = confirm('Reset all settings to default?');
          if (!confirmed) return;

          try {
            localStorage.clear();
            alert('All settings have been reset.');
            const refreshNow = confirm('Refresh YouTube now to apply changes?');
            if (refreshNow) {
              const tries = [
                () => location.reload(),
                () => { location.href = location.href; },
                () => window.location.reload(),
                () => { window.top && window.top.location && window.top.location.reload(); },
                () => history.go(0)
              ];
              (function chain(i){
                try { tries[i](); }
                catch (_) { if (i + 1 < tries.length) setTimeout(() => chain(i + 1), 30); }
              })(0);
            }
          } catch (e) {
            console.error('Error resetting configs:', e);
            alert('Something went wrong while resetting your settings.');
          }
        }
      },
    ]
  },

  /* =============== NEW CONDITIONAL BLOCK: SponsorBlock Tweaks =================
     Appears only when skip_sponsor_segments is ON. All toggles use refreshToggle: 'onlyOff'
  */
  {
    type: 'block',
    id: 'sb_tweaks',
    name: 'SponsorBlock Tweaks',
    desc: 'Edit and change specific skipped sections.',
    iconName: 'playlist_remove', // restored previous icon
    requiresToggle: 'skip_sponsor_segments', // UI will show/hide dynamically
    children: [
      { id: 'sb_cat_sponsor',        name: 'Sponsored segments',    desc: 'Paid promotions / sponsored segments', iconName: 'paid',                refreshToggle: 'onlyOff', onChange: () => SponsorBlock.refresh() },
      { id: 'sb_cat_intro',          name: 'Intro',                  desc: 'Intro sections of the video',          iconName: 'forward_to_inbox',    refreshToggle: 'onlyOff', onChange: () => SponsorBlock.refresh() },
      { id: 'sb_cat_outro',          name: 'Outro',                  desc: 'Outro sections of the video',          iconName: 'outbond',             refreshToggle: 'onlyOff', onChange: () => SponsorBlock.refresh() },
      { id: 'sb_cat_interaction',    name: 'Interaction',            desc: '"Like, comment, subscribe" requests',  iconName: 'thumbs_up_down',      refreshToggle: 'onlyOff', onChange: () => SponsorBlock.refresh() },
      { id: 'sb_cat_selfpromo',      name: 'Self-promo',             desc: 'Self-promotion segments',              iconName: 'campaign',            refreshToggle: 'onlyOff', onChange: () => SponsorBlock.refresh() },
      { id: 'sb_cat_music_offtopic', name: 'Music (off-topic)',      desc: 'Music segments that are off-topic',    iconName: 'music_off',           refreshToggle: 'onlyOff', onChange: () => SponsorBlock.refresh() },
      { id: 'sb_cat_preview',        name: 'Preview',                desc: 'Preview sections for upcoming content',iconName: 'preview',             refreshToggle: 'onlyOff', onChange: () => SponsorBlock.refresh() },
      { id: 'sb_cat_filler',         name: 'Filler',                 desc: 'Irrelevant or repetitive sections',    iconName: 'hourglass_empty',     refreshToggle: 'onlyOff', onChange: () => SponsorBlock.refresh() },
      { id: 'sb_cat_nonmusic',       name: 'Non-music in MV',        desc: 'Non-music segments in a music video',  iconName: 'music_note',          refreshToggle: 'onlyOff', onChange: () => SponsorBlock.refresh() },
      { id: 'sb_cat_unclear',        name: 'Unclear',                desc: 'Segments where the purpose is unclear', iconName: 'help_outline',        refreshToggle: 'onlyOff', onChange: () => SponsorBlock.refresh() },
    ]
  },

  /* =============== NEW CONDITIONAL BLOCK: Revert Old YouTube UI Tweaks ========
     Appears only when revert_player is ON.
  */
  {
    type: 'block',
    id: 'revert_ui_tweaks',
    name: 'Revert Old Youtube UI Tweaks',
    desc: 'Edit & tweak revert changes for the updated UI.',
    iconName: 'history',
    requiresToggle: 'revert_player',
    children: [
      {
        id: 'fs_hide_more_videos',
        name: 'Hide "More videos" grid (fullscreen)',
        desc: 'Removes the new "Delhi" fullscreen grid overlay. Refresh needed if hidden beforehand.',
        iconName: 'grid_view',
        promptRefresh: false,
          refreshToggle: 'onlyOff',
        onChange: () => { applyFullscreenHideCSS(); }
      },
      {
        id: 'fs_hide_quick_controls',
        name: 'Hide fullscreen quick controls',
        desc: 'Removes the quick action buttons overlay. Refresh needed if hidden beforehand.',
        iconName: 'smart_button',
        promptRefresh: false,
          refreshToggle: 'onlyOff',
        onChange: () => { applyFullscreenHideCSS(); }
      }
    ]
  }
];

/* ========= Defaults: main + SB categories + fullscreen-tweak toggles ========= */
const DEFAULT_CONFIG = {
  revert_player: true,
  skip_sponsor_segments: true,
  enable_dislikes: true,

  // SponsorBlock categories defaults
  sb_cat_sponsor: true,
  sb_cat_intro: false,
  sb_cat_outro: false,
  sb_cat_interaction: false,
  sb_cat_selfpromo: false,
  sb_cat_music_offtopic: false,
  sb_cat_preview: false,
  sb_cat_filler: false,
  sb_cat_nonmusic: false,
  sb_cat_unclear: false,

  // NEW: Fullscreen Delhi UI hide toggles (enabled by default)
  fs_hide_more_videos: true,
  fs_hide_quick_controls: true
};

/** Helper: flatten all toggles (booleans) including those inside blocks */
function getAllToggles(){
  const nested = [];
  for (const b of CONFIG_BLOCKS) {
    if (b && Array.isArray(b.children)) nested.push(...b.children.filter(c=>!c.type || c.type==='toggle'));
  }
  return [...CONFIG_TOGGLES, ...nested];
}

/** Fullscreen “Delhi” UI hide defaults (auto-applied when revert_player is ON) */
const HIDE_FULLSCREEN_CONFIG = {
  playerHideFullScreenMoreVideos: true,
  playerHideFullScreenControls:  true
};

/* ============================ STORAGE ========================= */
const STORAGE_PREFIX   = 'OldYTPlayer:toggle:'; // booleans only
const APPLIED_PREFIX   = 'OldYTPlayer:applied:'; // booleans only
const VALUE_PREFIX     = 'OldYTPlayer:value:';   // string values (selects, etc.)
const LS = window.localStorage;

// boolean toggles
function storageGet(id){ try{ return LS.getItem(STORAGE_PREFIX+id)==='1'; }catch(_){ return false; } }
function storageSet(id,v){ try{ LS.setItem(STORAGE_PREFIX+id, v?'1':'0'); }catch(_){} }
function storageHas(id){ try{ return LS.getItem(STORAGE_PREFIX+id)!==null; }catch(_){ return false; } }
function appliedGet(id){ try{ return LS.getItem(APPLIED_PREFIX+id)==='1'; }catch(_){ return storageGet(id); } }
function appliedSet(id,v){ try{ LS.setItem(APPLIED_PREFIX+id, v?'1':'0'); }catch(_){} }
function appliedSeedFromCurrent(){ for (const cfg of getAllToggles()) appliedSet(cfg.id, storageGet(cfg.id)); }
function ensureSbCategoryDefaults(){
  const keys = (SponsorBlock && SponsorBlock.KEY_TO_API) ? Object.keys(SponsorBlock.KEY_TO_API) : Object.keys(DEFAULT_CONFIG).filter(k=>k.startsWith('sb_cat_'));
  const anyPresent = keys.some(k => storageHas(k));
  if (!anyPresent){
    for (const k of keys){
      const def = Object.prototype.hasOwnProperty.call(DEFAULT_CONFIG, k) ? !!DEFAULT_CONFIG[k] : false;
      storageSet(k, def);
    }
  }
}

// value selects
function storageGetVal(id, def){ try{ const v=LS.getItem(VALUE_PREFIX+id); return v!==null ? v : def; }catch(_){ return def; } }
function storageSetVal(id, v){ try{ LS.setItem(VALUE_PREFIX+id, String(v)); }catch(_){} }
function storageHasVal(id){ try{ return LS.getItem(VALUE_PREFIX+id)!==null; }catch(_){ return false; } }

// seed toggle defaults if missing
for (const cfg of getAllToggles()){
  if (!storageHas(cfg.id)) {
    const def = Object.prototype.hasOwnProperty.call(DEFAULT_CONFIG, cfg.id) ? !!DEFAULT_CONFIG[cfg.id] : false;
    storageSet(cfg.id, def);
  }
}
// seed select defaults
for (const b of CONFIG_BLOCKS){
  if (!b.children) continue;
  for (const c of b.children){
    if (c && c.type==='select'){
      if (!storageHasVal(c.id)) storageSetVal(c.id, c.default);
    }
  }
}

/** Reset refresh state on every run (fresh load). */
appliedSeedFromCurrent();

/* ==================== DELHI FLAG REMOVAL =============== */
const DELHI_STYLE_RE = /ytp-fullscreen-(quick-actions|grid)/;
let didStripDelhiStyles = false;

function tryRemoveDelhiFlagsOnce() {
  try {
    const yt = window.yt;
    let mod = 0;
    if (yt && yt.config_ && yt.config_.WEB_PLAYER_CONTEXT_CONFIGS) {
      const cfgs = yt.config_.WEB_PLAYER_CONTEXT_CONFIGS;
      for (const k in cfgs) {
        const c = cfgs[k];
        if (c && typeof c.serializedExperimentFlags === 'string') {
          const before = c.serializedExperimentFlags;
          if (!before.includes('delhi_modern_web_player')) {
            if (before.includes('delhi_modern_web_player_icons')) {
              const after = before
                .replace(/&?delhi_modern_web_player_icons=true/g, '')
                .replace(/&&+/g, '&').replace(/^&+/, '').replace(/&+$/, '');
              if (after !== before) { c.serializedExperimentFlags = after; mod++; }
            }
          } else {
            const after = before
              .replace(/&?delhi_modern_web_player=true/g, '')
              .replace(/&?delhi_modern_web_player_icons=true/g, '')
              .replace(/&&+/g, '&').replace(/^&+/, '').replace(/&+$/, '');
            if (after !== before) { c.serializedExperimentFlags = after; mod++; }
          }
        }
      }
    }
    const removed = removeFullscreenQuickActions();
    return mod + (removed ? 1 : 0);
  } catch (_) { return 0; }
}

function removeFullscreenQuickActions() {
  let removed = false;
  const hasTargets = document.querySelector('.ytp-fullscreen-quick-actions, .ytp-fullscreen-grid');
  if (!didStripDelhiStyles || hasTargets) {
    const styles = document.getElementsByTagName('style');
    for (let i = styles.length - 1; i >= 0; i--) {
      const s = styles[i];
      try {
        const txt = s.textContent;
        if (txt && DELHI_STYLE_RE.test(txt)) {
          s.remove();
          removed = true;
          didStripDelhiStyles = true;
        }
      } catch(_) {}
    }
  }
  if (hasTargets) {
    const q = document.querySelectorAll('.ytp-fullscreen-quick-actions, .ytp-fullscreen-grid');
    for (let i=0;i<q.length;i++) { try{ q[i].remove(); removed = true; }catch(_){} }
  }
  return removed;
}

function robustRemoveDelhiFlagsWithRetries() {
  if (tryRemoveDelhiFlagsOnce() > 0) return true;
  let tries = 0, max = 60;
  const t = setInterval(() => { tries++; const n = tryRemoveDelhiFlagsOnce(); if (n > 0 || tries >= max) clearInterval(t); }, 200);
  const obs = new MutationObserver((muts) => {
    for (let i=0;i<muts.length;i++){
      const m = muts[i];
      for (let j=0;j<m.addedNodes.length;j++){
        const n = m.addedNodes[j];
        if (n && n.nodeType === 1) {
          const el = n;
          if (el.matches && (el.matches('.ytp-fullscreen-quick-actions, .ytp-fullscreen-grid') ||
             (el.tagName === 'STYLE' && DELHI_STYLE_RE.test(el.textContent||'')) )) { removeFullscreenQuickActions(); return; }
          if (el.querySelector && el.querySelector('.ytp-fullscreen-quick-actions, .ytp-fullscreen-grid')) { removeFullscreenQuickActions(); return; }
        }
      }
    }
  });
  obs.observe(document.documentElement, { childList:true, subtree:true });
  return false;
}

/* =============== Fullscreen hide CSS =============== */
const HIDE_STYLE_ID = 'oldytplayer-hide-fullscreen-css';

function isMobileUA(){ try{ return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent || ''); }catch(_){ return false; } }
function isDesktop(){ return !isMobileUA(); }

function applyFullscreenHideCSS() {
  removeFullscreenHideCSS();
  const desktop = isDesktop();
  const mobile  = !desktop;

  // NEW: use toggle-backed config (defaults true)
  const moreVideos = storageHas('fs_hide_more_videos') ? storageGet('fs_hide_more_videos') : HIDE_FULLSCREEN_CONFIG.playerHideFullScreenMoreVideos;
  const quickControls = storageHas('fs_hide_quick_controls') ? storageGet('fs_hide_quick_controls') : HIDE_FULLSCREEN_CONFIG.playerHideFullScreenControls;

  const hideCssSelectors = [];
  const cssRules = [];

  if (moreVideos) {
    if (desktop) {
      hideCssSelectors.push('.ytp-fullscreen-grid');
      cssRules.push(`
        #movie_player.ytp-delhi-modern { --ytp-grid-scroll-percentage: 0 !important; }
        .ytp-delhi-modern.ytp-grid-scrolling .ytp-chrome-bottom { bottom: 0 !important; opacity: 1 !important; }
        .ytp-delhi-modern .ytp-gradient-bottom { display: none !important; }
      `);
    }
  }
  if (quickControls) {
    if (desktop) hideCssSelectors.push('.ytp-fullscreen-quick-actions');
  }
  if (quickControls && moreVideos) {
    if (mobile) {
      cssRules.push(`
        body[faux-fullscreen="true"] .enable-fullscreen-controls.fs-watch-system .watch-page-progress-bar { bottom: 0 !important; }
        body[faux-fullscreen="true"] .enable-fullscreen-controls.fs-watch-system .player-controls-bottom { bottom: 30px !important; }
      `);
    }
  }

  const style = document.createElement('style'); style.id = HIDE_STYLE_ID;
  const hideBlock = hideCssSelectors.length ? `${hideCssSelectors.join(',\n')} { display: none !important; }` : '';
  const allCss = [hideBlock, ...cssRules].join('\n');
  try{ style.appendChild(document.createTextNode(allCss)); }catch(_){ style.textContent = allCss; }
  (document.head || document.documentElement).appendChild(style);
}
function removeFullscreenHideCSS() { const s = document.getElementById(HIDE_STYLE_ID); if (s) try{ s.remove(); }catch(_){} }

/* ==================== Remove AI Summary (CSS-only) ================== */
const AI_SUMMARY_STYLE_ID = 'oldytplayer-hide-aisummary-css';
function applyRemoveAISummaryCSS() {
  removeRemoveAISummaryCSS();
  const css = `
    ytd-expandable-metadata-renderer[has-video-summary] { display: none !important; }
    #flexible-item-buttons button[aria-label^="Ask" i],
    ytd-menu-renderer button[aria-label^="Ask" i] { display: none !important; }
  `;
  const style = document.createElement('style'); style.id = AI_SUMMARY_STYLE_ID;
  try { style.appendChild(document.createTextNode(css)); } catch(_) { style.textContent = css; }
  (document.head || document.documentElement).appendChild(style);
}
function removeRemoveAISummaryCSS() {
  const s = document.getElementById(AI_SUMMARY_STYLE_ID);
  if (s) try{ s.remove(); }catch(_){}
}

/* ==================== Hide Shorts Logic (CSS-only) ================== */
function applyHideShortsCSS() {
  const style = document.createElement('style');
  style.id = 'hide-shorts-style';

  const selectors = [];
  selectors.push('.HideShorts');

  if (isDesktop()) {
    selectors.push(
      `ytd-guide-entry-renderer:has(> a[title="Shorts"])`,
      `ytd-mini-guide-entry-renderer[aria-label="Shorts"]`,
      'ytd-rich-section-renderer:has(> #content > ytd-rich-shelf-renderer[is-shorts])',
      'ytd-browse[page-subtype="home"] ytd-rich-grid-group',
      'ytd-browse[page-subtype="home"] ytd-rich-item-renderer[is-slim-media][rendered-from-rich-grid]',
      `yt-chip-cloud-chip-renderer:has(> #chip-container > yt-formatted-string[title="Shorts"])`,
      'ytd-browse:not([page-subtype="history"]) ytd-reel-shelf-renderer',
      'ytd-search ytd-reel-shelf-renderer',
      'ytd-search grid-shelf-view-model',
      'ytd-browse:not([page-subtype="history"]) ytd-video-renderer:has(a[href^="/shorts"])',
      'ytd-search ytd-video-renderer:has(a[href^="/shorts"])',
      '#structured-description ytd-reel-shelf-renderer',
      '#related ytd-reel-shelf-renderer',
      '#related ytd-compact-video-renderer:has(a[href^="/shorts"])'
    );
  } else {
    selectors.push(
      'ytm-pivot-bar-item-renderer:has(> div.pivot-shorts)',
      'ytm-rich-section-renderer:has(ytm-reel-shelf-renderer)',
      'ytm-rich-section-renderer:has(ytm-shorts-lockup-view-model)',
      '.tab-content[tab-identifier="FEsubscriptions"] ytm-item-section-renderer:has(ytm-reel-shelf-renderer)',
      'ytm-search lazy-list > ytm-reel-shelf-renderer',
      'ytm-search ytm-video-with-context-renderer:has(a[href^="/shorts"])',
      'ytm-structured-description-content-renderer ytm-reel-shelf-renderer',
      'ytm-item-section-renderer[section-identifier="related-items"] ytm-video-with-context-renderer:has(a[href^="/shorts"])'
    );
  }

  style.textContent = selectors.map(sel => `${sel} { display: none !important; }`).join('\n');
  document.head.appendChild(style);
}
function removeHideShortsCSS() { document.getElementById('hide-shorts-style')?.remove(); }

/* ===================== Restore Miniplayer Button  ===== */
const OLDYT_MINIPLAYER_BTN_ID    = 'oldyt-miniplayer-button';
const OLDYT_MINIPLAYER_STYLE_ID  = 'oldyt-miniplayer-css';
const OLDYT_MINIPLAYER_OBS_KEY   = '__oldyt_miniplayer_observer';
const OLDYT_MINIPLAYER_RETRY_KEY = '__oldyt_miniplayer_retry';
const OLDYT_MINIPLAYER_NEW_PATH = 'M21.20 3.01C21.66 3.05 22.08 3.26 22.41 3.58C22.73 3.91 22.94 4.33 22.98 4.79L23 5V19C23.00 19.49 22.81 19.97 22.48 20.34C22.15 20.70 21.69 20.93 21.20 20.99L21 21H3L2.79 20.99C2.30 20.93 1.84 20.70 1.51 20.34C1.18 19.97 .99 19.49 1 19V13H3V19H21V5H11V3H21L21.20 3.01ZM1.29 3.29C1.10 3.48 1.00 3.73 1.00 4C1.00 4.26 1.10 4.51 1.29 4.70L5.58 9H3C2.73 9 2.48 9.10 2.29 9.29C2.10 9.48 2 9.73 2 10C2 10.26 2.10 10.51 2.29 10.70C2.48 10.89 2.73 11 3 11H9V5C9 4.73 8.89 4.48 8.70 4.29C8.51 4.10 8.26 4 8 4C7.73 4 7.48 4.10 7.29 4.29C7.10 4.48 7 4.73 7 5V7.58L2.70 3.29C2.51 3.10 2.26 3.00 2 3.00C1.73 3.00 1.48 3.10 1.29 3.29ZM19.10 11.00L19 11H12L11.89 11.00C11.66 11.02 11.45 11.13 11.29 11.29C11.13 11.45 11.02 11.66 11.00 11.89L11 12V17C10.99 17.24 11.09 17.48 11.25 17.67C11.42 17.85 11.65 17.96 11.89 17.99L12 18H19L19.10 17.99C19.34 17.96 19.57 17.85 19.74 17.67C19.90 17.48 20.00 17.24 20 17V12L19.99 11.89C19.97 11.66 19.87 11.45 19.70 11.29C19.54 11.13 19.33 11.02 19.10 11.00ZM13 16V13H18V16H13Z';
const OLDYT_MINIPLAYER_OLD_PATH = 'M25,17 L17,17 L17,23 L25,23 L25,17 L25,17 Z M29,25 L29,10.98 C29,9.88 28.1,9 27,9 L9,9 C7.9,9 7,9.88 7,10.98 L7,25 C7,26.1 7.9,27 9,27 L27,27 C28.1,27 29,26.1 29,25 L29,25 Z M27,25.02 L9,25.02 L9,10.97 L27,10.97 L27,25.02 L27,25.02 Z';

function oldytInsertMiniplayerButton() {
  if (document.getElementById(OLDYT_MINIPLAYER_BTN_ID)) return true;

  const sizeBtn = document.querySelector('.ytp-chrome-bottom .ytp-size-button');
  if (!sizeBtn || !sizeBtn.parentElement) return false;

  const btn = document.createElement('button');
  btn.id = OLDYT_MINIPLAYER_BTN_ID;
  btn.className = 'ytp-button';
  btn.title = '(i)';
  btn.setAttribute('aria-keyshortcuts', 'i');
  btn.style.display = 'inline-flex';
  btn.style.alignItems = 'center';
  btn.style.justifyContent = 'center';

  const isNewStyle = sizeBtn.parentElement.classList.contains('ytp-right-controls-right');

  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  if (isNewStyle) {
    svg.setAttribute('fill', 'none');
    svg.setAttribute('height', '24');
    svg.setAttribute('width', '24');
    svg.setAttribute('viewBox', '0 0 24 24');
    const path = document.createElementNS(svgNS, 'path');
    path.setAttribute('d', OLDYT_MINIPLAYER_NEW_PATH);
    path.setAttribute('fill', 'white');
    svg.appendChild(path);
  } else {
    svg.setAttribute('height', '100%');
    svg.setAttribute('width', '100%');
    svg.setAttribute('viewBox', '0 0 36 36');
    const path = document.createElementNS(svgNS, 'path');
    path.setAttribute('d', OLDYT_MINIPLAYER_OLD_PATH);
    path.setAttribute('fill', '#fff');
    path.setAttribute('fill-rule', 'evenodd');
    svg.appendChild(path);
  }
  btn.appendChild(svg);

  sizeBtn.parentElement.insertBefore(btn, sizeBtn);

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    document.dispatchEvent(new KeyboardEvent('keydown', {
      bubbles: true, cancelable: true, code: 'KeyI', key: 'i', keyCode: 73, which: 73
    }));
  }, { capture: true });

  return true;
}

function oldytEnsureMiniplayerButton() {
  if (window[OLDYT_MINIPLAYER_RETRY_KEY]) clearInterval(window[OLDYT_MINIPLAYER_RETRY_KEY]);
  let attempts = 0;
  window[OLDYT_MINIPLAYER_RETRY_KEY] = setInterval(() => {
    attempts++;
    if (oldytInsertMiniplayerButton() || attempts > 40) {
      clearInterval(window[OLDYT_MINIPLAYER_RETRY_KEY]);
      window[OLDYT_MINIPLAYER_RETRY_KEY] = null;
    }
  }, 250);

  const startObserver = () => {
    const target = document.body || document.documentElement;
    if (!target || !(target instanceof Node)) return false;

    if (window[OLDYT_MINIPLAYER_OBS_KEY]) window[OLDYT_MINIPLAYER_OBS_KEY].disconnect();
    const obs = new MutationObserver(() => {
      if (!document.getElementById(OLDYT_MINIPLAYER_BTN_ID)) {
        oldytInsertMiniplayerButton();
      }
    });
    try {
      obs.observe(target, { childList: true, subtree: true });
      window[OLDYT_MINIPLAYER_OBS_KEY] = obs;
      return true;
    } catch (_) {
      return false;
    }
  };

  if (!startObserver()) {
    let tries = 0;
    const t = setInterval(() => {
      tries++;
      if (startObserver() || tries > 40) clearInterval(t);
    }, 250);
  }
}

function applyRestoreMiniplayerButton() {
  removeRestoreMiniplayerButton();
  const css = `ytd-watch-flexy[fullscreen] #${OLDYT_MINIPLAYER_BTN_ID} { display: none !important; }`;
  const style = document.createElement('style');
  style.id = OLDYT_MINIPLAYER_STYLE_ID;
  try { style.appendChild(document.createTextNode(css)); } catch(_) { style.textContent = css; }
  (document.head || document.documentElement).appendChild(style);

  oldytEnsureMiniplayerButton();
}

function removeRestoreMiniplayerButton() {
  const s = document.getElementById(OLDYT_MINIPLAYER_STYLE_ID);
  if (s) try { s.remove(); } catch(_){}
  const b = document.getElementById(OLDYT_MINIPLAYER_BTN_ID);
  if (b) try { b.remove(); } catch(_){}
  if (window[OLDYT_MINIPLAYER_OBS_KEY]) {
    try { window[OLDYT_MINIPLAYER_OBS_KEY].disconnect(); }catch(_){}
    window[OLDYT_MINIPLAYER_OBS_KEY] = null;
  }
  if (window[OLDYT_MINIPLAYER_RETRY_KEY]) {
    clearInterval(window[OLDYT_MINIPLAYER_RETRY_KEY]);
    window[OLDYT_MINIPLAYER_RETRY_KEY] = null;
  }
}


/* ==================== SponsorBlock Logic (now category-aware) ============ */
const SponsorBlock = (() => {
  const API = 'https://api.sponsor.ajay.app/api/skipSegments';

  const KEY_TO_API = {
    sb_cat_sponsor: 'sponsor',
    sb_cat_intro: 'intro',
    sb_cat_outro: 'outro',
    sb_cat_interaction: 'interaction',
    sb_cat_selfpromo: 'selfpromo',
    sb_cat_music_offtopic: 'music_offtopic',
    sb_cat_preview: 'preview',
    sb_cat_filler: 'filler',
    sb_cat_nonmusic: 'nonmusic',
    sb_cat_unclear: 'unclear'
  };

  function getEnabledCategories(){
    const cats = [];
    for (const k in KEY_TO_API){
      if (storageGet(k)) cats.push(KEY_TO_API[k]);
    }
    // If no categories selected, treat as none (skip nothing)
    return cats;
  }

  let enabled = false;
  let cache = new Map(); // videoId -> merged segments
  let attachedVideo = null;
  let attachedHandler = null;
  let navHandler = null;
  let checkTimer = null;

  function getVideo() {
    return document.querySelector('video.html5-main-video') || document.querySelector('video');
  }
  function getVideoIdFromUrl() {
    try {
      const u = new URL(location.href);
      const v = u.searchParams.get('v');
      if (v) return v;
      const m = location.pathname.match(/\/shorts\/([^/?#]+)/);
      if (m) return m[1];
      const meta = document.querySelector('meta[itemprop="videoId"]');
      if (meta) return meta.getAttribute('content');
    } catch {}
    return null;
  }

  async function fetchSegments(videoId) {
    if (!videoId) return [];
    if (cache.has(videoId)) return cache.get(videoId);
    try {
      const cats = getEnabledCategories();
      if (!cats.length) { cache.set(videoId, []); return []; }
      const url = `${API}?videoID=${encodeURIComponent(videoId)}&categories=${encodeURIComponent(JSON.stringify(cats))}`;
      const res = await fetch(url, { method: 'GET', headers: { 'Accept': 'application/json' } });
      if (!res.ok) throw new Error('SB fetch failed');
      const data = await res.json();
      const segments = (Array.isArray(data) ? data : []).map(item => {
        const seg = item.segment || item.segments || [];
        const start = Number(seg[0]) || 0, end = Number(seg[1]) || 0;
        return end > start ? { start, end } : null;
      }).filter(Boolean).sort((a,b)=>a.start-b.start);

      // merge overlaps
      const merged = [];
      for (const s of segments) {
        const last = merged[merged.length-1];
        if (!last || s.start > last.end) merged.push({ ...s });
        else last.end = Math.max(last.end, s.end);
      }
      cache.set(videoId, merged);
      return merged;
    } catch {
      cache.set(videoId, []);
      return [];
    }
  }

  async function tryAttachForCurrentVideo() {
    if (!enabled) return;
    const vid = getVideo();
    const id  = getVideoIdFromUrl();
    if (!vid || !id) return;

    // Already wired?
    if (attachedVideo === vid) return;

    // Detach old
    detach();

    const segments = await fetchSegments(id);
    if (!segments || !segments.length) return;

    const handler = () => {
      const t = vid.currentTime || 0;
      for (const s of segments) {
        if (t >= s.start && t < s.end) {
          try { vid.currentTime = s.end + 0.05; } catch {}
          break;
        }
      }
    };
    vid.addEventListener('timeupdate', handler);
    attachedVideo = vid;
    attachedHandler = handler;

    const guard = setInterval(() => {
      if (!enabled) { clearInterval(guard); return; }
      if (!document.contains(vid) || vid !== getVideo()) {
        detach();
        clearInterval(guard);
      }
    }, 1500);
  }

  function detach() {
    if (attachedVideo && attachedHandler) {
      try { attachedVideo.removeEventListener('timeupdate', attachedHandler); } catch {}
    }
    attachedVideo = null;
    attachedHandler = null;
  }

  function enable() {
    if (enabled) return;
    enabled = true;
    cache.clear();
    tryAttachForCurrentVideo();

    navHandler = () => setTimeout(tryAttachForCurrentVideo, 600);
    window.addEventListener('yt-navigate-finish', navHandler, true);

    if (!checkTimer) {
      checkTimer = setInterval(() => {
        if (!enabled) return;
        tryAttachForCurrentVideo();
      }, 1800);
    }
  }

  function disable() {
    if (!enabled) return;
    enabled = false;
    window.removeEventListener('yt-navigate-finish', navHandler, true);
    navHandler = null;
    if (checkTimer) { clearInterval(checkTimer); checkTimer = null; }
    detach();
  }

  function refresh(){
    // Re-evaluate categories and current video
    cache.clear();
    detach();
    tryAttachForCurrentVideo();
  }

  return { enable, disable, refresh, KEY_TO_API };
})();

/* ==================== Hide Sponsored Logic (SOFT HIDE) ============ */
function applyHideSponsoredCSS() {
  const style = document.createElement('style');
  style.id = 'hide-sponsored-style';
  const soft = (sel) => `
${sel}{
  position:absolute !important;
  left:-99999px !important;
  top:auto !important;
  width:1px !important;
  height:1px !important;
  max-width:1px !important;
  max-height:1px !important;
  overflow:hidden !important;
  clip:rect(1px,1px,1px,1px) !important;
  clip-path: inset(50%) !important;
  white-space:nowrap !important;
  opacity:0.001 !important;
  pointer-events:none !important;
}
`;
  const softSelectorsDesktop = [
    '#player-ads',
    'ytd-ad-slot-renderer',
    'ytd-ad-slot-renderer.ytd-item-section-renderer',
    'ytd-search-pyv-renderer.ytd-item-section-renderer',
    '#items > ytd-ad-slot-renderer',
    '.ytp-ad-action-interstitial',
    '.ytp-paid-content-overlay'
  ];
  const hardSelectorsDesktop = [
    '#panels > ytd-engagement-panel-section-list-renderer',
    '.annotation.iv-branding',
    '#masthead-ad',
    '#ticket-shelf',
    'ytd-merch-shelf-renderer',
    '#offer-module',
    '#big-yoodle ytd-statement-banner-renderer',
    'ytd-rich-section-renderer:has(> #content > ytd-statement-banner-renderer)',
    'ytd-rich-section-renderer:has(> #content > ytd-rich-shelf-renderer[has-paygated-featured-badge])',
    'ytd-rich-section-renderer:has(> #content > ytd-brand-video-shelf-renderer)',
    'ytd-rich-section-renderer:has(> #content > ytd-brand-video-singleton-renderer)',
    'ytd-rich-section-renderer:has(> #content > ytd-inline-survey-renderer)',
    'tp-yt-paper-dialog:has(> #mealbar-promo-renderer)',
    '#below #panels'
  ];
  const softSelectorsMobile = [
    'ytm-paid-content-overlay-renderer',
    'ytm-companion-slot:has(> ytm-companion-ad-renderer)',
    'ytm-item-section-renderer:has(> lazy-list > ad-slot-renderer:only-child)',
    'ytm-item-section-renderer[section-identifier="related-items"] > lazy-list > ad-slot-renderer'
  ];
  const hardSelectorsMobile = [
    'ytm-statement-banner-renderer',
    'ytm-rich-item-renderer:has(> ad-slot-renderer)',
    '#ticket-shelf',
    'ytd-merch-shelf-renderer',
    '#offer-module',
    '.mealbar-promo-renderer',
    'ytm-search ytm-item-section-renderer:has(> lazy-list > ad-slot-renderer)'
  ];

  let css = '';
  if (isDesktop()) {
    css += softSelectorsDesktop.map(soft).join('\n');
    css += hardSelectorsDesktop.map(s => `${s}{display:none!important}`).join('\n');
  } else {
    css += softSelectorsMobile.map(soft).join('\n');
    css += hardSelectorsMobile.map(s => `${s}{display:none!important}`).join('\n');
  }
  if (storageGet('hide_share_thanks_clip')) {
    css += `\n#sponsor-button{position:absolute!important;left:-99999px!important;width:1px!important;height:1px!important;overflow:hidden!important;clip:rect(1px,1px,1px,1px)!important;clip-path:inset(50%)!important;opacity:0.001!important;pointer-events:none!important}`;
  }

  style.textContent = css;
  document.head.appendChild(style);
}
function removeHideSponsoredCSS() { document.getElementById('hide-sponsored-style')?.remove(); }

/* ==================== Hide Share Thanks Logic (CSS-only) ================== */
function applyHideShareThanksClipCSS() {
  const style = document.createElement('style');
  style.id = 'oldyt-hide-share-thanks-style';
  const selectors = [];

  if (isDesktop()) {
    selectors.push(
      'ytd-menu-renderer yt-button-view-model:has(> button-view-model > button[aria-label="Share"])',
      'ytd-menu-renderer yt-button-view-model:has(> button-view-model > button[aria-label="Thanks"])',
      'ytd-menu-renderer yt-button-view-model:has(> button-view-model > button[aria-label="Clip"])',
      'button.ytp-share-button',
      '.oldyt-hide-share-thanks-clip',
      '#share-button.ytd-reel-player-overlay-renderer',
      'yt-player-quick-action-buttons button[aria-label="Share"]'
    );
    if (storageGet('hide_sponsored')) {
      selectors.push('#sponsor-button');
    }
  } else {
    selectors.push(
      'ytm-slim-video-action-bar-renderer button-view-model:has(button[aria-label="Share"])',
      '.reel-player-overlay-actions .icon-shorts_share',
      'player-fullscreen-action-menu ytm-slim-metadata-button-renderer:has(button[aria-label="Share"])'
    );
  }
  style.textContent = selectors.map(sel => `${sel} { display: none !important; }`).join('\n');
  document.head.appendChild(style);
}
function removeHideShareThanksClipCSS() { document.getElementById('oldyt-hide-share-thanks-style')?.remove(); }

/* ==================== Remove Pink Logic (CSS-only) ================== */
function applyRemovePinkCSS() {
  const style = document.createElement('style');
  style.id = 'remove-pink-style';
  style.textContent = `
    .ytp-play-progress,
    .thumbnail-overlay-resume-playback-progress,
    .ytChapteredProgressBarChapteredPlayerBarChapterSeen,
    .ytChapteredProgressBarChapteredPlayerBarFill,
    .ytProgressBarLineProgressBarPlayed,
    .ytThumbnailOverlayProgressBarHostWatchedProgressBarSegment {
      background: #f03 !important;
    }
    .ytp-play-progress,
    #progress.ytd-thumbnail-overlay-resume-playback-renderer,
    .ytThumbnailOverlayProgressBarHostWatchedProgressBarSegment,
    .ytChapteredProgressBarChapteredPlayerBarChapterSeen,
    .ytChapteredProgressBarChapteredPlayerBarFill,
    .ytProgressBarLineProgressBarPlayed,
    #progress.yt-page-navigation-progress,
    .progress-bar-played.ytd-progress-bar-line {
      background: #f03 !important;
    }
  `;
  document.head.appendChild(style);
}
function removeRemovePinkCSS() { document.getElementById('remove-pink-style')?.remove(); }

/* ==================== Classic Likes Logic ================== */
async function applyClassicLikesCSS() {
  const imageSources = {
    LIKE: 'https://files.catbox.moe/svd509.png',
    DISLIKE: 'https://files.catbox.moe/dim7io.png',
    LIKE_PRESSED: 'https://files.catbox.moe/f3u3fg.png',
    DISLIKE_PRESSED: 'https://files.catbox.moe/a8szdc.png'
  };

  const cachedURLs = {};
  await Promise.all(Object.entries(imageSources).map(async ([key, src]) => {
    try {
      const resp = await fetch(src);
      if (!resp.ok) throw new Error(`Failed to fetch ${src}`);
      const blob = await resp.blob();
      cachedURLs[key] = URL.createObjectURL(blob);
    } catch (err) {
      console.error(`Error preloading ${src}:`, err);
      cachedURLs[key] = src;
    }
  }));

  const style = document.createElement('style');
  style.id = 'oldyt-classic-likes-style';
  style.textContent = `

  #endpoint[href="/playlist?list=LL"] yt-icon:first-of-type {
    content: url('${cachedURLs.LIKE}') !important;
    filter: contrast(0);
    height: 17px !important; width: 17px !important; padding-left: 3px !important;
    transform: rotate(-12deg);
  }
  ytd-guide-entry-renderer[active] #endpoint[href="/playlist?list=LL"] yt-icon:first-of-type { filter: invert(1); }

  /* LIKE BUTTONS */
  ytd-video-primary-info-renderer #top-level-buttons-computed > ytd-toggle-button-renderer:first-of-type > a > yt-icon-button > #button > yt-icon,
  #segmented-like-button yt-icon,
  like-button-view-model yt-icon {
    content: url('${cachedURLs.LIKE}') !important;
    top: 3px; filter: contrast(0);
    height: 17px !important; width: 17px !important;
    transform: rotate(-12deg);
  }

  /* DISLIKE BUTTONS */
  ytd-video-primary-info-renderer #top-level-buttons-computed > ytd-toggle-button-renderer:last-of-type > a > yt-icon-button > #button > yt-icon,
  #segmented-dislike-button yt-icon,
  dislike-button-view-model yt-icon,
  dislike-button-view-model .ytIconWrapperHost {
    content: url('${cachedURLs.DISLIKE}') !important;
    top: 3px; filter: contrast(0);
    height: 17px !important; width: 17px !important;
    transform: rotate(-12deg);
  }

  /* HOVER EFFECT */
  #top-level-buttons-computed > ytd-toggle-button-renderer:first-of-type > a > yt-icon-button > #button > yt-icon:hover,
  #top-level-buttons-computed > ytd-toggle-button-renderer:last-of-type > a > yt-icon-button > #button > yt-icon:hover,
  like-button-view-model yt-icon:hover,
  dislike-button-view-model .ytIconWrapperHost:hover,
  ytd-comment-action-buttons-renderer #like-button yt-icon:hover,
  ytd-toggle-button-renderer#like-button .ytIconWrapperHost:hover,
  ytd-comment-action-buttons-renderer #dislike-button yt-icon:hover,
  ytd-toggle-button-renderer#dislike-button .ytIconWrapperHost:hover {
    filter: contrast(0.25);
  }

  /* COMMENT LIKE BUTTONS */
  ytd-comment-action-buttons-renderer #like-button yt-icon,
  ytd-toggle-button-renderer#like-button yt-icon,
  ytd-toggle-button-renderer#like-button .ytIconWrapperHost > span {
    content: url('${cachedURLs.LIKE}') !important; filter: contrast(0);
    height: 17px !important; width: 17px !important;
    transform: rotate(-12deg);
  }

  /* COMMENT DISLIKE BUTTONS */
  ytd-comment-action-buttons-renderer #dislike-button yt-icon,
  ytd-toggle-button-renderer#dislike-button yt-icon,
  ytd-toggle-button-renderer#dislike-button .ytIconWrapperHost > span {
    content: url('${cachedURLs.DISLIKE}') !important; filter: contrast(0);
    height: 17px !important; width: 17px !important;
    transform: rotate(-12deg);
  }

  /* PRESSED LIKE BUTTON */
  ytd-video-primary-info-renderer #top-level-buttons-computed > ytd-toggle-button-renderer:first-of-type > a > yt-icon-button > #button[aria-pressed="true"] > yt-icon,
  ytd-comment-action-buttons-renderer #like-button #button[aria-pressed="true"] yt-icon,
  ytd-comment-action-buttons-renderer #like-button button[aria-pressed="true"] yt-icon,
  ytd-toggle-button-renderer#like-button button[aria-pressed="true"] yt-icon,
  ytd-toggle-button-renderer#like-button button[aria-pressed="true"] .ytIconWrapperHost > span,
  #segmented-like-button button[aria-pressed="true"] yt-icon,
  like-button-view-model button[aria-pressed="true"] yt-icon {
    content: url('${cachedURLs.LIKE_PRESSED}') !important; filter: contrast(1);
    transform: rotate(-12deg);
  }

  /* PRESSED DISLIKE BUTTON */
  ytd-video-primary-info-renderer #top-level-buttons-computed > ytd-toggle-button-renderer:last-of-type > a > yt-icon-button > #button[aria-pressed="true"] > yt-icon,
  ytd-comment-action-buttons-renderer #dislike-button #button[aria-pressed="true"] yt-icon,
  ytd-comment-action-buttons-renderer #dislike-button button[aria-pressed="true"] yt-icon,
  ytd-toggle-button-renderer#dislike-button button[aria-pressed="true"] yt-icon,
  ytd-toggle-button-renderer#dislike-button button[aria-pressed="true"] .ytIconWrapperHost > span,
  #segmented-dislike-button button[aria-pressed="true"] yt-icon,
  dislike-button-view-model button[aria-pressed="true"] .ytIconWrapperHost {
    content: url('${cachedURLs.DISLIKE_PRESSED}') !important; filter: contrast(1);
    transform: rotate(-12deg);
  }

  `;
  document.head.appendChild(style);
}
function removeClassicLikesCSS() { document.getElementById('oldyt-classic-likes-style')?.remove(); }

/* ==================== Hide endscreen "Hide" button ============= */
const HIDE_ENDSCREEN_BTN_STYLE_ID = 'oldytplayer-hide-endscreen-btn-css';
function applyRemoveHideButtonCSS(){
  removeRemoveHideButtonCSS();
  const css = `.ytp-ce-hide-button-container { display: none !important; }`;
  const st = document.createElement('style'); st.id = HIDE_ENDSCREEN_BTN_STYLE_ID;
  try{ st.appendChild(document.createTextNode(css)); }catch(_){ st.textContent = css; }
  (document.head||document.documentElement).appendChild(st);
}
function removeRemoveHideButtonCSS(){ document.getElementById(HIDE_ENDSCREEN_BTN_STYLE_ID)?.remove(); }

/* ==================== Grid Items (dropdown) ========= */
const GRID_ITEMS_STYLE_ID = 'oldytplayer-minimum-grid-css';
function applyMinimumGridItemsCSS(value) {
  removeMinimumGridItemsCSS();
  if (value === 'auto') return;
  const gridItemsPerRow = Number(value);
  if (isNaN(gridItemsPerRow)) return;

  const exclude = [];
  for (let i = 6; i > gridItemsPerRow; i--) exclude.push(`[elements-per-row="${i}"]`);

  const css = `
    ytd-browse:is([page-subtype="home"], [page-subtype="subscriptions"]) ytd-rich-grid-renderer${exclude.length ? `:not(${exclude.join(', ')})` : ''} {
      --ytd-rich-grid-items-per-row: ${gridItemsPerRow} !important;
    }
  `;
  const style = document.createElement('style');
  style.id = GRID_ITEMS_STYLE_ID;
  try { style.appendChild(document.createTextNode(css)); } catch { style.textContent = css; }
  (document.head || document.documentElement).appendChild(style);
}
function removeMinimumGridItemsCSS() { document.getElementById(GRID_ITEMS_STYLE_ID)?.remove(); }

/* ==================== NEW: Search thumbnail size (dropdown) ========= */
const SEARCH_THUMB_STYLE_ID = 'oldytplayer-search-thumb-css';
function applySearchThumbSizeCSS(size){
  removeSearchThumbSizeCSS();
  if (size === 'large') return;
  const px = ({ medium: 420, small: 360 }[size]) || 420;
  const css = `
    ytd-search ytd-video-renderer ytd-thumbnail.ytd-video-renderer,
    ytd-search yt-lockup-view-model .yt-lockup-view-model__content-image,
    ytd-search ytd-channel-renderer #avatar-section {
      max-width: ${px}px !important;
    }
  `;
  const st = document.createElement('style'); st.id = SEARCH_THUMB_STYLE_ID;
  try{ st.appendChild(document.createTextNode(css)); }catch(_){ st.textContent = css; }
  (document.head||document.documentElement).appendChild(st);
}
function removeSearchThumbSizeCSS(){ document.getElementById(SEARCH_THUMB_STYLE_ID)?.remove(); }

/* ==================== Return YouTube Dislike  ============== */
const RYD = (() => {
  const STATE = { OFF: 0, ON: 1 };
  let running = STATE.OFF;

  const CONFIG = {
    showUpdatePopup: false,
    disableVoteSubmission: false,
    disableLogging: true,
    coloredThumbs: false,
    coloredBar: false,
    colorTheme: "classic",
    numberDisplayFormat: "compactShort",
    numberDisplayRoundDown: true,
    tooltipPercentageMode: "none",
    numberDisplayReformatLikes: false,
    rateBarEnabled: false
  };

  const LIKED_STATE = 1, DISLIKED_STATE = 2, NEUTRAL_STATE = 3;
  let previousState = NEUTRAL_STATE, likesvalue = 0, dislikesvalue = 0, preNavigateLikeButton = null;

  let isMobile = false;
  const isShorts = () => location.pathname.startsWith("/shorts");
  let mobileDislikes = 0;

  let smartimationObserver = null, jsInitCheckTimer = null, mobileInterval = null;
  let onNavigateFinishRef = null, originalPush = null, wrappedHistory = false;
  let lastLikeBtn = null, lastDislikeBtn = null;

  const STYLE_ID = 'oldytplayer-ryd-style';
  function injectStyle(){
    if (document.getElementById(STYLE_ID)) return;
    const css = `
      #return-youtube-dislike-bar-container { background: var(--yt-spec-icon-disabled); border-radius: 2px; }
      #return-youtube-dislike-bar { background: var(--yt-spec-text-primary); border-radius: 2px; transition: all 0.15s ease-in-out; }
      .ryd-tooltip { position: absolute; display: block; height: 2px; bottom: -10px; }
      .ryd-tooltip-bar-container { width: 100%; height: 2px; position: absolute; padding-top: 6px; padding-bottom: 12px; top: -6px; }
      ytd-menu-renderer.ytd-watch-metadata { overflow-y: visible !important; }
      #top-level-buttons-computed { position: relative !important; }
    `;
    const st = document.createElement('style'); st.id = STYLE_ID;
    try { st.appendChild(document.createTextNode(css)); } catch(_) { st.textContent = css; }
    (document.head||document.documentElement).appendChild(st);
  }
  function removeStyle(){ document.getElementById(STYLE_ID)?.remove(); }

  function inViewport(el){ const r=el.getBoundingClientRect(),h=innerHeight||document.documentElement.clientHeight,w=innerWidth||document.documentElement.clientWidth; return !(r.top==0&&r.left==0&&r.bottom==0&&r.right==0)&&r.top>=0&&r.left>=0&&r.bottom<=h&&r.right<=w; }
  function getButtons(){
    if (isShorts()) { const q=document.querySelectorAll(isMobile?"ytm-like-button-renderer":"#like-button > ytd-like-button-renderer"); for (const el of q){ if(inViewport(el)) return el; } }
    if (isMobile) return document.querySelector(".slim-video-action-bar-actions .segmented-buttons") ?? document.querySelector(".slim-video-action-bar-actions");
    if (document.getElementById("menu-container")?.offsetParent === null){
      return document.querySelector("ytd-menu-renderer.ytd-watch-metadata > div") ?? document.querySelector("ytd-menu-renderer.ytd-video-primary-info-renderer > div");
    } else { return document.getElementById("menu-container")?.querySelector("#top-level-buttons-computed"); }
  }
  function getDislikeButton(){ const b=getButtons(); if(!b) return null; if (b.children[0]?.tagName==="YTD-SEGMENTED-LIKE-DISLIKE-BUTTON-RENDERER"){ return b.children[0].children[1] ?? document.querySelector("#segmented-dislike-button"); } else { return b.querySelector("segmented-like-dislike-button-view-model") ? b.querySelector("dislike-button-view-model") : b.children[1]; } }
  function getLikeButton(){ const b=getButtons(); if(!b) return null; return b.children[0].tagName==="YTD-SEGMENTED-LIKE-DISLIKE-BUTTON-RENDERER" ? (document.querySelector("#segmented-like-button") ?? b.children[0].children[0]) : (b.querySelector("like-button-view-model") ?? b.children[0]); }
  function getLikeTextContainer(){ const l=getLikeButton(); return l?.querySelector("#text") ?? l?.getElementsByTagName("yt-formatted-string")[0] ?? l?.querySelector("span[role='text']"); }
  function getDislikeTextContainer(){ const d=getDislikeButton(); let r=d?.querySelector("#text") ?? d?.getElementsByTagName("yt-formatted-string")[0] ?? d?.querySelector("span[role='text']"); if(!r){ const s=document.createElement('span'); s.id='text'; s.style.marginLeft='6px'; d?.querySelector('button')?.appendChild(s); d && (d.querySelector('button').style.width='auto'); r=s; } return r; }
  function getLikeCountFromButton(){ try{ if(location.pathname.startsWith('/shorts')) return false; const likeBtn=getLikeButton(); const el=likeBtn?.querySelector("yt-formatted-string#text") ?? likeBtn?.querySelector("button"); const s=el?.getAttribute("aria-label")?.replace(/\D/g,'') ?? ""; return s.length>0?parseInt(s):false; }catch{ return false; } }
  function roundDown(num){ if (num<1000) return num; const int=Math.floor(Math.log10(num)-2); const decimal=int+(int%3?1:0); const value=Math.floor(num/10**decimal); return value*10**decimal; }
  function numberFormat(n){ const display = CONFIG.numberDisplayRoundDown ? roundDown(n) : n; return Intl.NumberFormat(document.documentElement.lang||navigator.language||'en', {notation: CONFIG.numberDisplayFormat==='standard'?'standard':'compact', compactDisplay: CONFIG.numberDisplayFormat==='compactLong'?'long':'short'}).format(display); }

  function createRateBar(likes, dislikes){
    if (isMobile || !CONFIG.rateBarEnabled) return;
    let tip = document.querySelector('.ryd-tooltip');
    const wrap = getButtons(); if(!wrap) return;
    const widthPx = (getLikeButton()?.clientWidth || 52) + ((getDislikeButton()?.clientWidth) ?? 52);
    const widthPercent = likes+dislikes>0 ? (likes/(likes+dislikes))*100 : 50;

    if (!tip) {
      tip = document.createElement('div');
      tip.className = 'ryd-tooltip';
      const container = document.createElement('div');
      container.className = 'ryd-tooltip-bar-container';
      const barContainer = document.createElement('div');
      barContainer.id = 'return-youtube-dislike-bar-container';
      barContainer.style.width = '100%'; barContainer.style.height = '2px';
      const bar = document.createElement('div');
      bar.id = 'return-youtube-dislike-bar';
      bar.style.width = widthPercent + '%'; bar.style.height = '100%';
      barContainer.appendChild(bar); container.appendChild(barContainer); tip.appendChild(container);
      wrap.appendChild(tip);
      const topRow=document.getElementById('top-row'); if(topRow){ topRow.style.borderBottom="1px solid var(--yt-spec-10-percent-layer)"; topRow.style.paddingBottom="10px"; }
    } else {
      const bar=document.getElementById('return-youtube-dislike-bar'); if(bar) bar.style.width=widthPercent+"%";
    }
    tip.style.width = widthPx + 'px';
  }

  function setState(){
    const id = (()=>{
      const u=new URL(location.href), p=u.pathname;
      if (p.startsWith('/clip')) return (document.querySelector("meta[itemprop='videoId']")||document.querySelector("meta[itemprop='identifier']"))?.content;
      if (p.startsWith('/shorts')) return p.slice(8);
      return u.searchParams.get('v');
    })();
    if (!id) return;
    fetch(`https://returnyoutubedislikeapi.com/votes?videoId=${id}`).then(r=>r.json()).then(json=>{
      if (!json) return;
      const { dislikes, likes } = json;
      likesvalue = likes; dislikesvalue = dislikes;
      createRateBar(likes, dislikes);
      setDislikes(numberFormat(dislikes));
    }).catch(()=>{});
  }

  function setDislikes(n) {
    if (isMobile) { mobileDislikes = n; return; }
    const c = getDislikeTextContainer();
    if (!c) return;
    c.removeAttribute("is-empty");
    if (c.innerText !== n) c.innerText = n;
  }

  function updateDOMDislikes(){
    createRateBar(likesvalue, dislikesvalue);
    setDislikes(numberFormat(dislikesvalue));
  }
  function likeClicked(){ if(!!document.querySelector("#avatar-btn")){ if(previousState===1){ likesvalue--; } else if(previousState===2){ likesvalue++; dislikesvalue--; previousState=1; } else { likesvalue++; previousState=1; } updateDOMDislikes(); const n=getLikeCountFromButton(); if(n!==false) { const likeText=getLikeTextContainer(); if(likeText) likeText.innerText = numberFormat(n); } } }
  function dislikeClicked(){ if(!!document.querySelector("#avatar-btn")){ if(previousState===3){ dislikesvalue++; previousState=2; } else if(previousState===2){ dislikesvalue--; previousState=3; } else { likesvalue--; dislikesvalue++; previousState=2; const n=getLikeCountFromButton(); if(n!==false) { const likeText=getLikeTextContainer(); if(likeText) likeText.innerText = numberFormat(n); } } updateDOMDislikes(); } }

  function isVideoLoaded(){
    if (isMobile) return document.getElementById("player")?.getAttribute("loading")=="false";
    const u=new URL(location.href), p=u.pathname, vid = p.startsWith('/shorts')?p.slice(8):u.searchParams.get('v');
    return !!(document.querySelector(`ytd-watch-grid[video-id='${vid}']`) || document.querySelector(`ytd-watch-flexy[video-id='${vid}']`) || document.querySelector('#player[loading="false"]:not([hidden])'));
  }

  function setEventListeners(){
    function check(){ if (location.pathname.startsWith('/shorts') || (getButtons()?.offsetParent && isVideoLoaded())) {
      const buttons=getButtons(), dislikeButton=getDislikeButton(), likeBtn=getLikeButton();
      if (preNavigateLikeButton !== likeBtn && dislikeButton){
        try{
          likeBtn?.addEventListener('click', likeClicked, {passive:true});
          dislikeButton?.addEventListener('click', dislikeClicked, {passive:true});
          likeBtn?.addEventListener('touchstart', likeClicked, {passive:true});
          dislikeButton?.addEventListener('touchstart', dislikeClicked, {passive:true});
          dislikeButton?.addEventListener('focusin', updateDOMDislikes, {passive:true});
          dislikeButton?.addEventListener('focusout', updateDOMDislikes, {passive:true});
          preNavigateLikeButton = likeBtn; lastLikeBtn=likeBtn; lastDislikeBtn=dislikeButton;
          const smart = buttons?.querySelector("yt-smartimation");
          if (smart) { smartimationObserver && smartimationObserver.disconnect(); smartimationObserver=new MutationObserver(updateDOMDislikes); smartimationObserver.observe(smart,{attributes:true,subtree:true,childList:true}); }
        }catch{}
      }
      if (dislikeButton){ setState(); if (jsInitCheckTimer) { clearInterval(jsInitCheckTimer); jsInitCheckTimer=null; } }
    } }
    if (jsInitCheckTimer) clearInterval(jsInitCheckTimer);
    jsInitCheckTimer=setInterval(check, 111);
  }

  function onNavigateFinish(){ setEventListeners(); }
  function start(){
    if (running===STATE.ON) return;
    running=STATE.ON;
    isMobile = (location.hostname==='m.youtube.com');
    injectStyle();
    onNavigateFinishRef = onNavigateFinish;
    window.addEventListener('yt-navigate-finish', onNavigateFinishRef, true);
    setEventListeners();
    if (isMobile){
      if (!wrappedHistory){
        originalPush = history.pushState;
        history.pushState = function(...args){ setEventListeners(args[2]); return originalPush.apply(history,args); };
        wrappedHistory = true;
      }
      if (!mobileInterval){
        mobileInterval = setInterval(()=>{ const d=getDislikeButton(); if(!d) return; const t=d.querySelector(".button-renderer-text"); if (!t){ const c=getDislikeTextContainer(); if(c) c.innerText=mobileDislikes; } else { t.innerText=mobileDislikes; } }, 1000);
      }
    }
  }
  function stop(){
    if (running===STATE.OFF) return;
    running=STATE.OFF;
    if (onNavigateFinishRef){ window.removeEventListener('yt-navigate-finish', onNavigateFinishRef, true); onNavigateFinishRef=null; }
    if (wrappedHistory && originalPush){ history.pushState = originalPush; wrappedHistory=false; originalPush=null; }
    if (mobileInterval){ clearInterval(mobileInterval); mobileInterval=null; }
    try{ smartimationObserver && smartimationObserver.disconnect(); }catch(_){} smartimationObserver=null;
    try{
      lastLikeBtn && lastLikeBtn.removeEventListener('click', likeClicked);
      lastLikeBtn && lastLikeBtn.removeEventListener('touchstart', likeClicked);
      lastDislikeBtn && lastDislikeBtn.removeEventListener('click', dislikeClicked);
      lastDislikeBtn && lastDislikeBtn.removeEventListener('touchstart', dislikeClicked);
      lastDislikeBtn && lastDislikeBtn.removeEventListener('focusin', updateDOMDislikes);
      lastDislikeBtn && lastDislikeBtn.removeEventListener('focusout', updateDOMDislikes);
    }catch(_){}
    lastLikeBtn=lastDislikeBtn=null; preNavigateLikeButton=null;
    try{ const tip=document.querySelector('.ryd-tooltip'); tip && tip.remove(); const topRow=document.getElementById('top-row'); if(topRow){ topRow.style.borderBottom=''; topRow.style.paddingBottom=''; } }catch(_){}
    removeStyle();
  }
  return { start, stop };
})();

/* ========== Apply toggles/values immediately at load =============== */
if (storageGet('revert_player')) { robustRemoveDelhiFlagsWithRetries(); applyFullscreenHideCSS(); }
if (storageGet('remove_ai_summary')) applyRemoveAISummaryCSS();
if (storageGet('enable_dislikes')) RYD.start();
if (storageGet('remove_hide_button')) applyRemoveHideButtonCSS();
if (storageGet('remove_pink')) applyRemovePinkCSS();
if (storageGet('hide_sponsored')) applyHideSponsoredCSS();
if (storageGet('hide_shorts')) applyHideShortsCSS();
applySearchThumbSizeCSS(storageGetVal('search_thumb_size','medium'));
applyMinimumGridItemsCSS(storageGetVal('minimum_grid_items', 'auto'));
if (storageGet('hide_share_thanks_clip')) applyHideShareThanksClipCSS();
if (storageGet('classic_likes')) applyClassicLikesCSS();
if (storageGet('skip_sponsor_segments')) SponsorBlock.enable();
if (storageGet('restore_miniplayer_button')) applyRestoreMiniplayerButton();

/* ============================ DOM/STYLE ============================= */
const STYLE_ID = 'oldytplayer-style-v077';

function safeAppend(p,n){ try{ if(p && n && n.nodeType===1) p.appendChild(n); }catch(_){} }
function ensureMaterialIcons(){
  if (!document.querySelector('link[href*="fonts.googleapis.com/icon"]')){
    const link=document.createElement('link');
    link.rel='stylesheet';
    link.href='https://fonts.googleapis.com/icon?family=Material+Icons';
    (document.head||document.documentElement).appendChild(link);
  }
}
function injectStyles(){
  if (document.getElementById(STYLE_ID)) return;
  ensureMaterialIcons();
  const css = [
    '.oldyt-panel{width:101% !important;box-sizing:border-box;padding:6px 8px;min-height:120px;max-height:100%;display:flex;flex-direction:column;}',
    '.oldyt-top-row{display:flex;align-items:center;gap:8px;margin-bottom:8px;min-height:32px;flex:0 0 auto;}',
    '.oldyt-back{cursor:pointer;display:flex;align-items:center;gap:8px;font-weight:600;color:#fff;transition:color 0.2s ease,opacity 0.2s ease;}',
    '.oldyt-back:hover{color:#ff4e45;opacity:0.9;}',
    '.oldyt-back .material-icons{font-size:18px;transform:translateY(1px);transition:transform 0.2s ease;}',
    '.oldyt-back:hover .material-icons{transform:translateY(1.05) scale(1.05);}',
    '.oldyt-refresh-banner{margin-left:auto;background:#c62828;color:#fff;padding:6px 10px;border-radius:6px;display:flex;align-items:center;gap:8px;font-size:13px;}',
    '.oldyt-refresh-banner.hidden{display:none !important;}',
    '.oldyt-refresh-btn{background:transparent;border:1px solid rgba(255,255,255,0.2);color:#fff;padding:6px 8px;border-radius:4px;cursor:pointer;font-weight:600;}.oldyt-refresh-btn:hover{background:rgba(255,255,255,0.1);border-color:rgba(255,255,255,0.4);transform: scale(1.02);box-shadow:0 0 8px rgba(255,255,255,0.15)}',
    '.oldyt-list{display:flex;flex-direction:column;gap:6px;flex:1 1 auto;min-height:0;overflow-y:auto;overflow-x:hidden;padding-right:6px;-webkit-overflow-scrolling:touch;}',
    '.oldyt-item{display:flex;align-items:center;gap:12px;padding:8px;border-radius:8px;min-height:52px;}',
    '.oldyt-item:hover{background:rgba(255,255,255,0.05);transition:background .03s ease;}',
    '.oldyt-icon{width:32px;height:32px;min-width:32px;display:flex;align-items:center;justify-content:center;border-radius:6px;background:rgba(255,255,255,0.03)}',
    '.oldyt-icon img{width:18px;height:18px;}',
    '.oldyt-icon .material-icons{font-size:18px;}',
    '.oldyt-textcol{display:flex;flex-direction:column;gap:3px;flex:1 1 auto;min-width:0;}',
    '.oldyt-name{color:#fff;font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;cursor:pointer;}',
    '.oldyt-desc{color:rgba(255,255,255,0.78);font-size:12px;line-height:1;display:-webkit-box;-webkit-line-clamp:4;-webkit-box-orient:vertical;overflow:hidden;text-overflow:ellipsis;}',
    '.oldyt-rightcol{margin-left:12px;display:flex;align-items:center;justify-content:flex-end;min-width:26.5px;}',
    '.oldyt-rightcol.has-select{min-width:50px;}',
    '.oldyt-toggle{display:inline-block;width:40px;height:22px;border-radius:22px;background:#6b6b6b;position:relative;box-shadow:inset 0 -2px 0 rgba(0,0,0,0.12);transition:background .12s ease;min-width:40px; cursor: pointer;}',
    '.oldyt-toggle .oldyt-knob{position:absolute;top:3px;left:3px;width:16px;height:16px;border-radius:50%;background:#fff;box-shadow:0 1px 2px rgba(0,0,0,0.35);transition:left .12s ease;}',
    '.oldyt-toggle.on{background:#e53935;}',
    '.oldyt-toggle.on .oldyt-knob{left:21px;}',
    '.oldyt-change-badge{display:inline-flex;align-items:center;justify-content:center;width:18px;height:18px;border-radius:50%;background:#c62828;margin-left:8px;vertical-align:middle;flex:0 0 auto;}',
    '.oldyt-change-badge .material-icons{font-size:12px;color:#fff;}',
    '.oldyt-select{appearance:none;background:rgba(255,255,255,0.06);color:#fff;border:1px solid rgba(255,255,255,0.2);border-radius:6px;padding:4px 8px;font-size:12px;min-width:50px;cursor:pointer;}',
    '.oldyt-select:focus{outline:none;}',
    '.oldyt-list::-webkit-scrollbar{width:8px;height:8px;}',
    '.oldyt-list::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.06);border-radius:8px;}',
    /* NEW: conditional reason title */
    '.oldyt-conditional-title{margin:2px 0 6px 12px;font-size:12px;color:rgba(255,255,255,0.82)}',
    '.oldyt-conditional-title b{color:#fff;}'
  ].join('\n');
  const style=document.createElement('style'); style.id=STYLE_ID;
  try{ style.appendChild(document.createTextNode(css)); }catch(_){ style.textContent=css; }
  (document.head||document.documentElement).appendChild(style);
}
function makeMaterialIcon(name){
  const i=document.createElement('i');
  i.className='material-icons'; i.setAttribute('aria-hidden','true'); i.textContent=name;
  return i;
}

/* ===================== PENDING / BADGE CALC ======================== */
function computePendingMap(){
  const map={};
  for (const cfg of getAllToggles()){
    const cur=storageGet(cfg.id), appl=appliedGet(cfg.id);
    map[cfg.id] = wantsRefresh(cfg, cur, appl);
  }
  return map;
}
function anyPendingFromMap(m){ for (const k in m) if (m[k]) return true; return false; }
function computePendingMapForChildren(blockCfg){
  const map={};
  for(const cfg of (blockCfg.children||[])){
    if (cfg.type==='select') { map[cfg.id]=false; continue; }
    const cur=storageGet(cfg.id), appl=appliedGet(cfg.id);
    map[cfg.id]=wantsRefresh(cfg, cur, appl);
  }
  return map;
}

/* ==================== VIEWPORT / FOCUS HELPERS ===================== */
function isInsidePanel(panelEl, evt) {
  try{
    if (!panelEl || !evt) return false;
    const t = evt.target;
    if (t && panelEl.contains && panelEl.contains(t)) return true;
    if (t && t.closest && t.closest('.oldyt-panel')) return true;
    const p = (typeof evt.composedPath === 'function') ? evt.composedPath() : null;
    if (p && Array.isArray(p) && p.indexOf(panelEl) !== -1) return true;
    const r = panelEl.getBoundingClientRect && panelEl.getBoundingClientRect();
    let x=0,y=0;
    if (evt.touches && evt.touches[0]) { x=evt.touches[0].clientX; y=evt.touches[0].clientY; }
    else if (evt.clientX!=null && evt.clientY!=null) { x=evt.clientX; y=evt.clientY; }
    if (r && (x||y)) return (x>=r.left && x<=r.right && y>=r.top && y<=r.bottom);
  }catch(_){}
  return false;
}
function isMostlyInViewport(el, threshold = 0.1){
  if (!el || !el.getBoundingClientRect) return true;
  const r = el.getBoundingClientRect();
  const vw = window.innerWidth || document.documentElement.clientWidth;
  const vh = window.innerHeight || document.documentElement.clientHeight;
  const interW = Math.max(0, Math.min(r.right, vw) - Math.min(Math.max(r.left,0), vw));
  const interH = Math.max(0, Math.min(r.bottom, vh) - Math.min(Math.max(r.top,0), vh));
  const interA = interW * interH;
  const area = Math.max(1, r.width * r.height);
  return (interA / area) >= threshold;
}

/* ======================== BADGE (menu item) ======================== */
function createChangeBadge(){
  const b=document.createElement('span'); b.className='oldyt-change-badge';
  b.appendChild(makeMaterialIcon('autorenew')); return b;
}
function ensureMenuItemBadge(menuItem, contentDiv, show){
  if(!menuItem || !contentDiv) return;
  let badge = menuItem._oldytBadge;
  if (show){
    if(!badge){
      badge=createChangeBadge();
      contentDiv.insertBefore(badge, contentDiv.firstChild);
      menuItem._oldytBadge=badge;
    }
    badge.style.display='inline-flex';
  } else if (badge){
    badge.style.display='none';
  }
}

/* =================== PANEL / POPUP LIFECYCLE ======================= */
function buildSettingsBlockPanel(blockCfg, popup, panelMenu, parentPanel, menuItemRef, menuContentRef){
  injectStyles();

  const panel=document.createElement('div');
  panel.className='ytp-panel oldyt-panel';
  panel.setAttribute('role','menu');

  const topRow=document.createElement('div'); topRow.className='oldyt-top-row';

  const back=document.createElement('div'); back.className='oldyt-back'; back.setAttribute('role','button'); back.setAttribute('tabindex','0'); back.setAttribute('aria-label','Back');
  back.appendChild(makeMaterialIcon('arrow_back'));
  { const label=document.createElement('div'); label.textContent='Back'; back.appendChild(label); }
  topRow.appendChild(back);

  const title=document.createElement('div'); title.className='oldyt-name'; title.textContent=blockCfg.name||'Settings';
  title.style.cursor = 'pointer';
  topRow.appendChild(title);

  const banner=document.createElement('div'); banner.className='oldyt-refresh-banner hidden'; banner.setAttribute('role','alert');
  const bText=document.createElement('span'); bText.textContent='You must refresh now to apply changes.'; banner.appendChild(bText);

  const btn = document.createElement('button'); btn.className='oldyt-refresh-btn';
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  btn.textContent = isSafari ? 'Please Refresh' : 'Refresh now';
  function robustRefreshNow(){
    try{ for (const cfg of getAllToggles()) appliedSet(cfg.id, storageGet(cfg.id)); }catch(_){}
    try{ ensureMenuItemBadge(menuItemRef, menuContentRef, false); }catch(_){}
    try{ panel._detachOutsideHandlers && panel._detachOutsideHandlers(); }catch(_){}
    try{ panel._detachAutoCloseGuards && panel._detachAutoCloseGuards(); }catch(_){}
    const tries=[()=>location.reload(), ()=>{location.href=location.href;}, ()=>window.location.reload(), ()=>{window.top&&window.top.location&&window.top.location.reload();}, ()=>history.go(0)];
    (function chain(i){ try{ tries[i](); }catch(_){ if(i+1<tries.length) setTimeout(()=>chain(i+1),30); } })(0);
  }
  btn.addEventListener('click', robustRefreshNow, {passive:true});
  banner.appendChild(btn);

  topRow.appendChild(banner);
  panel.appendChild(topRow);

  const version = 'v0.3';
  topRow.style.position = 'relative';
  const versionTop = document.createElement('div');
  versionTop.textContent = version;
  Object.assign(versionTop.style, {
    position: 'absolute', top: '0px', right: '0px', fontSize: '10.5px', fontWeight: '500',
    color: 'rgba(255,255,255,0.65)',
    background: 'linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))',
    padding: '2px 6px', borderRadius: '5px', textShadow: '0 0 2px rgba(0,0,0,0.35)', boxShadow: '0 0 6px rgba(255,255,255,0.08), 0 0 4px rgba(0,0,0,0.25)',
    backdropFilter: 'blur(5px) saturate(120%)', WebkitBackdropFilter: 'blur(5px) saturate(120%)',
    pointerEvents: 'none', userSelect: 'none', zIndex: '2',
  });
  topRow.appendChild(versionTop);

  const list=document.createElement('div'); list.className='oldyt-list';
  const frag=document.createDocumentFragment();
  panel._pendingMap={};

  for (const cfg of (blockCfg.children||[])){
    const item=document.createElement('div'); item.className='oldyt-item';

    const iconWrap=document.createElement('div'); iconWrap.className='oldyt-icon';
    if(cfg.iconName) iconWrap.appendChild(makeMaterialIcon(cfg.iconName));
    else if (cfg.iconUrl){ const img=document.createElement('img'); img.src=cfg.iconUrl; img.alt=cfg.name||''; iconWrap.appendChild(img); }
    else iconWrap.appendChild(makeMaterialIcon('extension'));
    item.appendChild(iconWrap);

    const textcol=document.createElement('div'); textcol.className='oldyt-textcol';
    const name=document.createElement('div'); name.className='oldyt-name'; name.textContent=cfg.name||'Unnamed';
    const desc=document.createElement('div'); desc.className='oldyt-desc'; desc.textContent=cfg.desc||'';
    textcol.appendChild(name); textcol.appendChild(desc); item.appendChild(textcol);

    const rightcol=document.createElement('div'); rightcol.className='oldyt-rightcol';
    if (!cfg.type || cfg.type==='toggle'){
      const toggle=document.createElement('div'); toggle.className='oldyt-toggle'; toggle.id='oldyt-toggle-'+cfg.id; toggle.setAttribute('role','switch'); toggle.setAttribute('tabindex','0');
      const knob=document.createElement('div'); knob.className='oldyt-knob'; toggle.appendChild(knob);
      rightcol.appendChild(toggle); item.appendChild(rightcol);

      const cur=storageGet(cfg.id);
      if(cur){ toggle.classList.add('on'); toggle.setAttribute('aria-checked','true'); } else toggle.setAttribute('aria-checked','false');

      const handleToggle=()=>{
        const nowOn = !toggle.classList.contains('on');
        toggle.classList.toggle('on', nowOn);
        toggle.setAttribute('aria-checked', nowOn ? 'true':'false');
        storageSet(cfg.id, nowOn);
        setAppliedIfOnlyOff(cfg, nowOn);
        if (typeof cfg.onChange==='function'){ try{ cfg.onChange(nowOn, cfg.id); }catch(_){} }

        const need = wantsRefresh(cfg, nowOn, appliedGet(cfg.id));
        panel._pendingMap[cfg.id] = need;

        const localAny = anyPendingFromMap(panel._pendingMap);
        const globalAny = anyPendingFromMap(computePendingMap());
        panel._setRefreshVisible(localAny);
        ensureMenuItemBadge(menuItemRef, menuContentRef, globalAny);
      };

      toggle.addEventListener('click', (e)=>{ e.stopPropagation(); handleToggle(); }, {passive:true});
      toggle.addEventListener('keydown', (e)=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); e.stopPropagation(); handleToggle(); } }, {passive:false});
    } else if (cfg.type==='select'){
      rightcol.classList.add('has-select');
      const sel = document.createElement('select');
      sel.className = 'oldyt-select';
      const curVal = storageGetVal(cfg.id, cfg.default);
      for (const opt of (cfg.options||[])){
        const o = document.createElement('option');
        o.value = opt.value; o.textContent = opt.label;
        if (opt.value === curVal) o.selected = true;
        sel.appendChild(o);
      }
      sel.addEventListener('change', (e)=>{
        const v = e.target.value;
        storageSetVal(cfg.id, v);
        try{ typeof cfg.onChange==='function' && cfg.onChange(v, cfg.id); }catch(_){}
      }, {passive:true});

      rightcol.appendChild(sel);
      item.appendChild(rightcol);
    }

    frag.appendChild(item);
  }

  list.appendChild(frag);
  panel.appendChild(list);

  panel._setRefreshVisible = (v)=>{ if(v) banner.classList.remove('hidden'); else banner.classList.add('hidden'); };
  panel._recalcPending = ()=>{
    panel._pendingMap = computePendingMapForChildren(blockCfg);
    panel._setRefreshVisible(anyPendingFromMap(panel._pendingMap));
  };
  panel._recalcPending();

  function goBack(){
    openNestedInPopup(popup, panelMenu, parentPanel);
    const globalMap = computePendingMap();
    const globalAny = anyPendingFromMap(globalMap);
    parentPanel._pendingMap = globalMap;
    parentPanel._setRefreshVisible(globalAny);
    ensureMenuItemBadge(menuItemRef, menuContentRef, globalAny);
  }
  back.addEventListener('click', (e)=>{ e.preventDefault(); e.stopPropagation(); goBack(); }, {passive:false});
  back.addEventListener('keydown', (e)=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); e.stopPropagation(); goBack(); } }, {passive:false});

  panel._detachOutsideHandlers = null;
  panel._attachOutsideHandlers = function attach() {
    const panelEl = panel;
    const onDown = (e) => { const inside = isInsidePanel(panelEl, e); if (!inside) goBack(); };
    const onKeyDown = (e) => { if (e.key === 'Escape') goBack(); };
    function detach(){ document.removeEventListener('pointerdown', onDown, true); document.removeEventListener('mousedown', onDown, true); document.removeEventListener('touchstart', onDown, true); document.removeEventListener('keydown', onKeyDown, true); }
    if (window.PointerEvent) document.addEventListener('pointerdown', onDown, {capture:true, passive:true});
    document.addEventListener('mousedown', onDown, {capture:true, passive:true});
    document.addEventListener('touchstart', onDown, {capture:true, passive:true});
    document.addEventListener('keydown', onKeyDown, {capture:true, passive:true});
    panel._detachOutsideHandlers = detach;
  };

  panel._attachAutoCloseGuards = function attachAuto() {
    const player = document.getElementById('movie_player') || document.querySelector('.html5-video-player');
    let scrollTick = null;
    let io = null;

    const maybeClose = () => {
      if (!document.contains(panel)) return;
      const popupEl = popup;
      const ok = isMostlyInViewport(popupEl) && isMostlyInViewport(player || popupEl);
      if (!ok) goBack();
    };

    const onScroll = () => {
      if (scrollTick) return;
      scrollTick = requestAnimationFrame(() => { scrollTick = null; maybeClose(); });
    };
    window.addEventListener('scroll', onScroll, {passive:true, capture:true});
    window.addEventListener('resize', onScroll, {passive:true, capture:true});

    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver((entries) => {
        const vis = entries.some(e => e.isIntersecting);
        if (!vis) { goBack(); }
      }, { threshold: 0.01 });
      try { io.observe(popup); } catch(_){}
      if (player) { try { io.observe(player); } catch(_){} }
    }

    const onNavStart = () => goBack();
    const onFs = () => goBack();
    window.addEventListener('yt-navigate-start', onNavStart, true);
    document.addEventListener('fullscreenchange', onFs, true);

    panel._detachAutoCloseGuards = function detachAuto() {
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onScroll, true);
      window.removeEventListener('yt-navigate-start', onNavStart, true);
      document.removeEventListener('fullscreenchange', onFs, true);
      if (io) try { io.disconnect(); } catch(_){}
      io = null;
      if (scrollTick) cancelAnimationFrame(scrollTick);
      scrollTick = null;
    };
  };

  return panel;
}

/* -------- small helper to build a block menu-item (used for conditional blocks) -------- */
function buildBlockMenuItem(block, popup, panelMenu, parentPanel, menuItemRef, menuContentRef){
  const item=document.createElement('div'); item.className='oldyt-item';
  const iconWrap=document.createElement('div'); iconWrap.className='oldyt-icon';
  if (block.iconName) iconWrap.appendChild(makeMaterialIcon(block.iconName)); else iconWrap.appendChild(makeMaterialIcon('folder'));
  item.appendChild(iconWrap);

  const textcol=document.createElement('div'); textcol.className='oldyt-textcol';
  const name=document.createElement('div'); name.className='oldyt-name'; name.textContent=block.name||'Settings';
  const desc=document.createElement('div'); desc.className='oldyt-desc'; desc.textContent=block.desc||'';
  textcol.appendChild(name); textcol.appendChild(desc); item.appendChild(textcol);

  const rightcol=document.createElement('div'); rightcol.className='oldyt-rightcol';
  const arrow=document.createElement('div'); arrow.appendChild(makeMaterialIcon('chevron_right'));
  rightcol.appendChild(arrow); item.appendChild(rightcol);

  const openBlock = (ev)=>{
    if (ev){
      ev.preventDefault && ev.preventDefault();
      ev.stopPropagation && ev.stopPropagation();
      ev.stopImmediatePropagation && ev.stopImmediatePropagation();
    }
    parentPanel._detachOutsideHandlers && parentPanel._detachOutsideHandlers();
    const blockPanel = buildSettingsBlockPanel(block, popup, panelMenu, parentPanel, menuItemRef, menuContentRef);
    setTimeout(()=>{
      openNestedInPopup(popup, panelMenu, blockPanel);
      try { blockPanel.setAttribute('tabindex','-1'); blockPanel.focus({preventScroll:true}); } catch(_) {}
    }, 0);
  };

  item.addEventListener('pointerdown', (e)=>{ e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation(); }, {capture:true});
  item.addEventListener('click', openBlock, {capture:true});
  item.addEventListener('keydown', (e)=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); openBlock(e); } });

  return item;
}

function buildNestedPanel(popup, panelMenu, menuItemRef, menuContentRef){
  injectStyles();

  const panel=document.createElement('div');
  panel.className='ytp-panel oldyt-panel';
  panel.setAttribute('role','menu');

  const topRow=document.createElement('div'); topRow.className='oldyt-top-row';
  const back=document.createElement('div'); back.className='oldyt-back'; back.setAttribute('role','button'); back.setAttribute('tabindex','0'); back.setAttribute('aria-label','Back to settings');
  back.appendChild(makeMaterialIcon('arrow_back'));
  { const backLabel=document.createElement('div'); backLabel.textContent='Back'; back.appendChild(backLabel); }
  topRow.appendChild(back);

/* -------------------- What's new? pill (unchanged) -------------------- */
const whatsNewBtn = document.createElement('div');
whatsNewBtn.setAttribute('role','button');
whatsNewBtn.setAttribute('tabindex','0');
whatsNewBtn.setAttribute('aria-label',"What's new?");
whatsNewBtn.textContent = "What's new?";
Object.assign(whatsNewBtn.style, {
  marginLeft: '10px',
  padding: '3px 8px',
  borderRadius: '6px',
  fontSize: '11.5px',
  fontWeight: '600',
  color: 'rgba(255,255,255,0.9)',
  background: 'linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))',
  boxShadow: '0 0 6px rgba(255,255,255,0.08), 0 0 4px rgba(0,0,0,0.25)',
  backdropFilter: 'blur(5px) saturate(120%)',
  WebkitBackdropFilter: 'blur(5px) saturate(120%)',
  cursor: 'pointer',
  userSelect: 'none',
  lineHeight: '1',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px'
});
const wnDot = document.createElement('span');
Object.assign(wnDot.style, {
  width: '6px', height: '6px', borderRadius: '50%',
  background: '#ff4e45', boxShadow: '0 0 4px rgba(255,78,69,0.9)'
});
whatsNewBtn.appendChild(wnDot);

// Popover
const wnBubble = document.createElement('div');
wnBubble.setAttribute('role','dialog');
Object.assign(wnBubble.style, {
  position: 'absolute',
  zIndex: '3',
  minWidth: '260px',
  maxWidth: '360px',
  padding: '10px 12px',
  borderRadius: '10px',
  color: 'rgba(255,255,255,0.95)',
  background: 'linear-gradient(145deg, rgba(0,0,0,0.70), rgba(255,255,255,0.03))',
  boxShadow: '0 8px 22px rgba(0,0,0,0.45), inset 0 0 0 1px rgba(255,255,255,0.06)',
  backdropFilter: 'blur(8px) saturate(140%)',
  WebkitBackdropFilter: 'blur(8px) saturate(140%)',
  display: 'none',
  opacity: '0',
  transform: 'scale(0.86) translateY(6px)',
  willChange: 'transform, opacity'
});
const wnArrow = document.createElement('div');
Object.assign(wnArrow.style, {
  position: 'absolute',
  width: '12px', height: '12px',
  transform: 'rotate(45deg)',
  bottom: '-6px',
  left: 'calc(50% - 6px)',
  background: 'linear-gradient(145deg, rgba(0,0,0,0.70), rgba(255,255,255,0.03))',
  boxShadow: '0 8px 22px rgba(0,0,0,0.45), inset 0 0 0 1px rgba(255,255,255,0.06)',
  opacity: '0',
  willChange: 'transform, opacity'
});
wnBubble.appendChild(wnArrow);

// ---------- What's New (TrustedHTML-safe) ----------
const ttPolicy = (() => {
  try {
    if (window.trustedTypes) {
      return (window.__oytp_changelog_policy ||= trustedTypes.createPolicy('oytp-changelog', {
        createHTML: str => str // safe, static HTML only (<b> tags)
      }));
    }
  } catch (_) {}
  return null;
})();

const CHANGELOG = [
  '<b>Added:</b> “Revert Old YouTube UI” tweaks to unhide new fullscreen controls or video panels.',
  '<b>Added:</b> SponsorBlock Tweaks panel with customizable skip sections.',
  'New conditional settings also appear with a <i>“Visible because…”</i> title.',
  '<b>Fixed:</b> Dislikes and SponsorBlock toggles now show proper refresh reminders, on disable only.',
];

const ul = document.createElement('ul');
Object.assign(ul.style, {
  margin: '0',
  padding: '0 0 0 16px',
  fontSize: '12px',
  lineHeight: '1.4'
});

for (const item of CHANGELOG) {
  const li = document.createElement('li');
  if (ttPolicy) {
    li.innerHTML = ttPolicy.createHTML(item);
  } else {
    li.innerHTML = item;
  }
  ul.appendChild(li);
}
wnBubble.appendChild(ul);


topRow.appendChild(whatsNewBtn);
topRow.style.position = 'relative';
topRow.appendChild(wnBubble);

let hideTimer = null;

function placeBubble() {
  const btnRect = whatsNewBtn.getBoundingClientRect();
  const rowRect = topRow.getBoundingClientRect();
  wnBubble.style.display = 'block';
  wnBubble.style.opacity = '0';
  wnBubble.style.pointerEvents = 'none';
  requestAnimationFrame(() => {
    const bRect = wnBubble.getBoundingClientRect();
    const left = (btnRect.left + btnRect.width/2) - (bRect.width/2) - rowRect.left;
    const top  = (btnRect.top - bRect.height - 10) - rowRect.top;
    wnBubble.style.left = Math.max(0, left) + 'px';
    wnBubble.style.top  = Math.max(0, top) + 'px';
  });
}
function animateFromButton(open=true) {
  const btnRect = whatsNewBtn.getBoundingClientRect();
  const bRect = wnBubble.getBoundingClientRect();
  const originX = (btnRect.left + btnRect.width / 2) - bRect.left;
  const originY = (btnRect.top  + btnRect.height / 2) - bRect.top;
  wnBubble.style.transformOrigin = `${originX}px ${originY}px`;
  wnArrow.style.transformOrigin  = '50% 50%';
  const timing = { duration: 220, easing: 'cubic-bezier(.2,.85,.2,1)', fill: 'forwards' };
  if (open) {
    wnBubble.animate([{ opacity: 0, transform: 'scale(0.86) translateY(6px)' }, { opacity: 1, transform: 'scale(1) translateY(0px)' }], timing);
    wnArrow.animate([{ opacity: 0, transform: 'rotate(45deg) translateY(4px)' }, { opacity: 1, transform: 'rotate(45deg) translateY(0px)' }], timing);
    wnBubble.style.pointerEvents = 'auto';
  } else {
    const out = wnBubble.animate([{ opacity: 1, transform: 'scale(1) translateY(0px)' }, { opacity: 0, transform: 'scale(0.86) translateY(6px)' }], timing);
    wnArrow.animate([{ opacity: 1, transform: 'rotate(45deg) translateY(0px)' }, { opacity: 0, transform: 'rotate(45deg) translateY(4px)' }], timing);
    out.onfinish = () => {
      wnBubble.style.display = 'none';
      wnBubble.style.pointerEvents = 'none';
      wnBubble.style.opacity = '0';
      wnBubble.style.transform = 'scale(0.86) translateY(6px)';
    };
  }
}
function showBubble() { clearTimeout(hideTimer); placeBubble(); requestAnimationFrame(() => { requestAnimationFrame(() => { animateFromButton(true); }); }); }
function hideBubble() { clearTimeout(hideTimer); hideTimer = setTimeout(() => animateFromButton(false), 80); }

whatsNewBtn.addEventListener('mouseenter', showBubble, {passive:true});
whatsNewBtn.addEventListener('mouseleave', hideBubble, {passive:true});
wnBubble.addEventListener('mouseenter', () => clearTimeout(hideTimer), {passive:true});
wnBubble.addEventListener('mouseleave', hideBubble, {passive:true});
whatsNewBtn.addEventListener('click', (e) => {
  e.preventDefault(); e.stopPropagation();
  const hidden = (wnBubble.style.display === 'none' || wnBubble.style.display === '');
  if (hidden) { showBubble(); } else { animateFromButton(false); setTimeout(showBubble, 140); }
}, {passive:false});
whatsNewBtn.addEventListener('focus', showBubble, {passive:true});
whatsNewBtn.addEventListener('blur', hideBubble, {passive:true});
whatsNewBtn.addEventListener('keydown', (e) => { if (e.key==='Enter' || e.key === ' ') { e.preventDefault(); showBubble(); } }, {passive:false});
/* ------------------ end What's new ------------------ */

  const banner=document.createElement('div'); banner.className='oldyt-refresh-banner hidden'; banner.setAttribute('role','alert');
  const bText=document.createElement('span'); bText.textContent='You must refresh now to apply changes'; banner.appendChild(bText);
  const btn = document.createElement('button'); btn.className='oldyt-refresh-btn';
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  btn.textContent = isSafari ? 'Please Refresh' : 'Refresh now';
  function robustRefreshNow(){
    try{ for (const cfg of getAllToggles()) appliedSet(cfg.id, storageGet(cfg.id)); }catch(_){}
    try{ ensureMenuItemBadge(menuItemRef, menuContentRef, false); }catch(_){}
    try{ panel._detachOutsideHandlers && panel._detachOutsideHandlers(); }catch(_){}
    try{ panel._detachAutoCloseGuards && panel._detachAutoCloseGuards(); }catch(_){}
    const tries=[()=>location.reload(), ()=>{location.href=location.href;}, ()=>window.location.reload(), ()=>{window.top&&window.top.location&&window.top.location.reload();}, ()=>history.go(0)];
    (function chain(i){ try{ tries[i](); }catch(_){ if(i+1<tries.length) setTimeout(()=>chain(i+1),30); } })(0);
  }
  btn.addEventListener('click', robustRefreshNow, {passive:true});
  banner.appendChild(btn);
  topRow.appendChild(banner);
  panel.appendChild(topRow);

  const version = 'v0.3';
  topRow.style.position = 'relative';
  const versionTop = document.createElement('div'); versionTop.textContent = version;
  Object.assign(versionTop.style, {
    position: 'absolute', top: '0px', right: '0px', fontSize: '10.5px', fontWeight: '500',
    color: 'rgba(255,255,255,0.65)', background: 'linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))',
    padding: '2px 6px', borderRadius: '5px', textShadow: '0 0 2px rgba(0,0,0,0.35)', boxShadow: '0 0 6px rgba(255,255,255,0.08), 0 0 4px rgba(0,0,0,0.25)',
    backdropFilter: 'blur(5px) saturate(120%)', WebkitBackdropFilter: 'blur(5px) saturate(120%)', pointerEvents: 'none', userSelect: 'none', zIndex: '2',
  });
  topRow.appendChild(versionTop);

  const list=document.createElement('div'); list.className='oldyt-list';
  const frag=document.createDocumentFragment();
  panel._pendingMap={};

  /* -------- ROOT toggles -------- */
  const blockForConditional = []; // collect blocks that require a toggle
  for (const block of CONFIG_BLOCKS) { if (block.requiresToggle) blockForConditional.push(block); }

  const rootToggles = CONFIG_TOGGLES;
  const afterToggleHooks = []; // we’ll push updateConditionalBlocks to run on certain toggles

  function getToggleCfgById(id){ return CONFIG_TOGGLES.find(t=>t.id===id) || null; }

  for (const cfg of rootToggles){
    const item=document.createElement('div'); item.className='oldyt-item';

    const iconWrap=document.createElement('div'); iconWrap.className='oldyt-icon';
    if(cfg.iconName) iconWrap.appendChild(makeMaterialIcon(cfg.iconName));
    else if (cfg.iconUrl){ const img=document.createElement('img'); img.src=cfg.iconUrl; img.alt=cfg.name||''; iconWrap.appendChild(img); }
    else iconWrap.appendChild(makeMaterialIcon('extension'));
    item.appendChild(iconWrap);

    const textcol=document.createElement('div'); textcol.className='oldyt-textcol';
    const name=document.createElement('div'); name.className='oldyt-name'; name.textContent=cfg.name||'Unnamed';
    const desc=document.createElement('div'); desc.className='oldyt-desc'; desc.textContent=cfg.desc||'';
    textcol.appendChild(name); textcol.appendChild(desc); item.appendChild(textcol);

    const rightcol=document.createElement('div'); rightcol.className='oldyt-rightcol';
    const toggle=document.createElement('div'); toggle.className='oldyt-toggle'; toggle.id='oldyt-toggle-'+cfg.id; toggle.setAttribute('role','switch'); toggle.setAttribute('tabindex','0');
    const knob=document.createElement('div'); knob.className='oldyt-knob'; toggle.appendChild(knob);
    rightcol.appendChild(toggle); item.appendChild(rightcol);

    const cur=storageGet(cfg.id);
    if(cur){ toggle.classList.add('on'); toggle.setAttribute('aria-checked','true'); } else toggle.setAttribute('aria-checked','false');

    const handleToggle=()=>{
      const nowOn = !toggle.classList.contains('on');
      toggle.classList.toggle('on', nowOn);
      toggle.setAttribute('aria-checked', nowOn ? 'true':'false');
      storageSet(cfg.id, nowOn);
      setAppliedIfOnlyOff(cfg, nowOn);
      if (typeof cfg.onChange==='function'){ try{ cfg.onChange(nowOn, cfg.id); }catch(_){} }
      const need = wantsRefresh(cfg, nowOn, appliedGet(cfg.id));
      panel._pendingMap[cfg.id] = need;

      const any = anyPendingFromMap(panel._pendingMap);
      panel._setRefreshVisible(any);
      ensureMenuItemBadge(menuItemRef, menuContentRef, any);

      // If a root toggle controls conditional blocks, update them
      if (cfg.id === 'skip_sponsor_segments' || cfg.id === 'revert_player') {
        for (const hook of afterToggleHooks) try{ hook(); }catch(_){}
      }
    };

    toggle.addEventListener('click', (e)=>{ e.stopPropagation(); handleToggle(); }, {passive:true});
    toggle.addEventListener('keydown', (e)=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); e.stopPropagation(); handleToggle(); } }, {passive:false});

    frag.appendChild(item);
  }

  /* -------- Normal (always-visible) blocks -------- */
  for (const block of CONFIG_BLOCKS){
    if (block.requiresToggle) continue; // handled conditionally
    const item = buildBlockMenuItem(block, popup, panelMenu, panel, menuItemRef, menuContentRef);
    frag.appendChild(item);
  }

  /* -------- Conditional zone (e.g., SponsorBlock Tweaks, Revert UI Tweaks) -------- */
  const conditionalZone = document.createElement('div');
  conditionalZone.style.position = 'relative';

  // NEW: "Visible because you have {features} enabled." title just below the blocks
  const conditionalTitle = document.createElement('div');
  conditionalTitle.className = 'oldyt-conditional-title';
  conditionalTitle.style.display = 'none';
  frag.appendChild(conditionalTitle);
  frag.appendChild(conditionalZone);

  // Formatting helper to bold feature names and insert commas/and correctly
  function formatBoldList(arr){
    const bold = (s)=>`<b>${s}</b>`;
    if (!arr || !arr.length) return '';
    if (arr.length === 1) return bold(arr[0]);
    if (arr.length === 2) return `${bold(arr[0])} and ${bold(arr[1])}`;
    const allButLast = arr.slice(0,-1).map(bold).join(', ');
    return `${allButLast}, and ${bold(arr[arr.length-1])}`;
  }

  // Animation helpers (macOS-like zoom/fade)
  function animateIn(el){
    try{
      el.style.transformOrigin = '50% 0%';
      el.animate(
        [{opacity:0, transform:'scale(0.86) translateY(6px)'},
         {opacity:1, transform:'scale(1) translateY(0px)'}],
        {duration:220, easing:'cubic-bezier(.2,.85,.2,1)', fill:'forwards'}
      );
    }catch(_){}
  }
  function animateOutAndRemove(el){
    try{
      const a = el.animate(
        [{opacity:1, transform:'scale(1) translateY(0px)'},
         {opacity:0, transform:'scale(0.86) translateY(6px)'}],
        {duration:200, easing:'cubic-bezier(.2,.85,.2,1)', fill:'forwards'}
      );
      a.onfinish = ()=>{ try{ el.remove(); }catch(_){ el.style.display='none'; } };
    }catch(_){ try{ el.remove(); }catch(_){} }
  }

  const conditionalMap = new Map(); // block.id -> DOM node
function updateConditionalTitle() {
  const activeFeatureNames = [];

  for (const block of blockForConditional) {
    if (storageGet(block.requiresToggle)) {
      const t = getToggleCfgById(block.requiresToggle);
      if (t && t.name) activeFeatureNames.push(t.name);
    }
  }

  // Clear previous content safely
  conditionalTitle.textContent = '';

  if (activeFeatureNames.length) {
    conditionalTitle.style.display = '';

    // Build "Visible because you have X, Y, and Z enabled." safely
    const prefix = document.createTextNode('Visible because you have ');
    conditionalTitle.appendChild(prefix);

    activeFeatureNames.forEach((name, i) => {
      const bold = document.createElement('b');
      bold.textContent = name;
      conditionalTitle.appendChild(bold);

      if (i < activeFeatureNames.length - 1) {
        const sep = document.createTextNode(
          i === activeFeatureNames.length - 2 ? ' and ' : ', '
        );
        conditionalTitle.appendChild(sep);
      }
    });

    const suffix = document.createTextNode(' enabled:');
    conditionalTitle.appendChild(suffix);
  } else {
    conditionalTitle.style.display = 'none';
  }
}

  function updateConditionalBlocks(){
    for (const block of blockForConditional){
      const shouldShow = storageGet(block.requiresToggle);
      const has = conditionalMap.get(block.id);
      if (shouldShow && !has){
        const node = buildBlockMenuItem(block, popup, panelMenu, panel, menuItemRef, menuContentRef);
        node.style.opacity='0';
        node.style.transform='scale(0.86) translateY(6px)';
        conditionalZone.appendChild(node);
        requestAnimationFrame(()=>requestAnimationFrame(()=>animateIn(node)));
        conditionalMap.set(block.id, node);
      } else if (!shouldShow && has){
        conditionalMap.delete(block.id);
        animateOutAndRemove(has);
      }
    }
    updateConditionalTitle();
  }
  afterToggleHooks.push(updateConditionalBlocks);
  // Initial render
  updateConditionalBlocks();

  list.appendChild(frag);
  panel.appendChild(list);

  // Hide/Show refresh banner & "What's new?"
  panel._setRefreshVisible = (v)=>{
    if(v){
      banner.classList.remove('hidden');
      whatsNewBtn.style.display = 'none';
      hideBubble(true);
    } else {
      banner.classList.add('hidden');
      whatsNewBtn.style.display = 'inline-flex';
    }
  };

  function doBack(){
    const any = anyPendingFromMap(panel._pendingMap);
    restorePanelFromPopup(popup, panel);
    ensureMenuItemBadge(menuItemRef, menuContentRef, any);
  }
  back.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); doBack(); }, {passive:false});
  back.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); doBack(); } }, {passive:false});

  panel._detachOutsideHandlers = null;
  panel._attachOutsideHandlers = function attach() {
    const popupEl = popup;
    const panelEl = panel;

    const onDown = (e) => {
      const insidePanel = isInsidePanel(panelEl, e);
      const insidePopup = isInsidePanel(popupEl, e);
      if (insidePanel) return;
      if (insidePopup) { doBack(); } else { doBack(); }
    };
    const onFocusIn = (e) => {
      const insidePanel = isInsidePanel(panelEl, e);
      const insidePopup = isInsidePanel(popupEl, e);
      if (insidePanel) return;
      if (insidePopup) { doBack(); } else { doBack(); }
    };
    const onKeyDown = (e) => { if (e.key === 'Escape') doBack(); };

    function detach() {
      const cap = true;
      if (window.PointerEvent) document.removeEventListener('pointerdown', onDown, cap);
      document.removeEventListener('mousedown', onDown, cap);
      document.removeEventListener('touchstart', onDown, cap);
      document.removeEventListener('focusin', onFocusIn, cap);
      document.removeEventListener('keydown', onKeyDown, cap);
    }

    const cap = true;
    if (window.PointerEvent) document.addEventListener('pointerdown', onDown, {capture:cap, passive:true});
    document.addEventListener('mousedown', onDown, {capture:cap, passive:true});
    document.addEventListener('touchstart', onDown, {capture:cap, passive:true});
    document.addEventListener('focusin', onFocusIn, cap);
    document.addEventListener('keydown', onKeyDown, {capture:cap, passive:true});

    panel._detachOutsideHandlers = detach;
  };

  panel._attachAutoCloseGuards = function attachAuto() {
    const player = document.getElementById('movie_player') || document.querySelector('.html5-video-player');
    let scrollTick = null;
    let io = null;

    const close = () => doBack();

    const maybeClose = () => {
      if (!document.contains(panel)) return;
      const ok = isMostlyInViewport(popup) && isMostlyInViewport(player || popup);
      if (!ok) close();
    };

    const onScroll = () => {
      if (scrollTick) return;
      scrollTick = requestAnimationFrame(() => { scrollTick = null; maybeClose(); });
    };
    window.addEventListener('scroll', onScroll, {passive:true, capture:true});
    window.addEventListener('resize', onScroll, {passive:true, capture:true});

    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver((entries) => {
        const vis = entries.some(e => e.isIntersecting);
        if (!vis) close();
      }, { threshold: 0.01 });
      try { io.observe(popup); } catch(_){}
      if (player) { try { io.observe(player); } catch(_){} }
    }

    const onNavStart = () => close();
    const onFs = () => close();
    window.addEventListener('yt-navigate-start', onNavStart, true);
    document.addEventListener('fullscreenchange', onFs, true);

    // Also close if the player element drifts (layout shift)
    let baseRect = (player || popup).getBoundingClientRect();
    const driftCheck = setInterval(() => {
      if (!document.contains(panel)) { clearInterval(driftCheck); return; }
      const now = (player || popup).getBoundingClientRect();
      const drift = Math.abs(now.top - baseRect.top) + Math.abs(now.left - baseRect.left);
      if (drift > 32) { clearInterval(driftCheck); close(); }
    }, 600);

    panel._detachAutoCloseGuards = function detachAuto() {
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onScroll, true);
      window.removeEventListener('yt-navigate-start', onNavStart, true);
      document.removeEventListener('fullscreenchange', onFs, true);
      if (io) try { io.disconnect(); } catch(_){}
      io = null;
      clearInterval(driftCheck);
      if (scrollTick) cancelAnimationFrame(scrollTick);
      scrollTick = null;
    };
  };

  panel._pendingMap = computePendingMap();
  panel._setRefreshVisible(anyPendingFromMap(panel._pendingMap));

  return panel;
}

/* ===== menu injection + panel switching ===== */
function injectIntoPopup(popup){
  try{
    if(!popup || !(popup instanceof HTMLElement)) return;
    const panelMenu = popup.querySelector('.ytp-panel-menu') || popup.querySelector('.ytp-panel');
    if(!panelMenu) return;
    if(panelMenu.querySelector('.oldyt-menuitem')) return;

    injectStyles();

    const menuItem=document.createElement('div'); menuItem.className='ytp-menuitem oldyt-menuitem';
    menuItem.setAttribute('role','menuitem'); menuItem.setAttribute('tabindex','0'); menuItem.setAttribute('aria-haspopup','true');

    const iconDiv=document.createElement('div'); iconDiv.className='ytp-menuitem-icon';
    iconDiv.appendChild(makeMaterialIcon('settings')); menuItem.appendChild(iconDiv);

    const labelDiv=document.createElement('div'); labelDiv.className='ytp-menuitem-label'; labelDiv.textContent='OldYTPlayer'; menuItem.appendChild(labelDiv);

    const contentDiv=document.createElement('div'); contentDiv.className='ytp-menuitem-content';
    const tip=document.createElement('div'); tip.style.opacity='0.9'; tip.textContent='Tweak settings here';
    contentDiv.appendChild(tip); menuItem.appendChild(contentDiv);

    panelMenu.insertBefore(menuItem, panelMenu.firstChild || null);

    const nestedPanel = buildNestedPanel(popup, panelMenu, menuItem, contentDiv);

    const openHandler = (ev)=>{
      if (ev){ ev.preventDefault && ev.preventDefault(); ev.stopPropagation && ev.stopPropagation(); }
      nestedPanel._pendingMap = computePendingMap();
      nestedPanel._setRefreshVisible(anyPendingFromMap(nestedPanel._pendingMap));
      ensureMenuItemBadge(menuItem, contentDiv, anyPendingFromMap(nestedPanel._pendingMap));
      openNestedInPopup(popup, panelMenu, nestedPanel);
      ensureMenuItemBadge(menuItem, contentDiv, false);
      nestedPanel._attachOutsideHandlers && nestedPanel._attachOutsideHandlers();
      nestedPanel._attachAutoCloseGuards && nestedPanel._attachAutoCloseGuards();
    };

    menuItem.addEventListener('click', openHandler, {passive:false});
    menuItem.addEventListener('keydown', (e)=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); openHandler(e); } }, {passive:false});

    const popupObserver = new MutationObserver(()=>{
      try{
        if(!document.contains(popup) || (popup.style && popup.style.display==='none')){
          safeRestorePanel(panelMenu);
          const pend = computePendingMap(); ensureMenuItemBadge(menuItem, contentDiv, anyPendingFromMap(pend));
          popupObserver.disconnect();
        }
      }catch(_){}
    });
    popupObserver.observe(popup, { attributes:true, childList:true, subtree:false });

    const menuObserver = new MutationObserver(()=>{
      if(!panelMenu.contains(menuItem)){ menuObserver.disconnect(); setTimeout(()=>injectIntoPopup(popup), 120); }
    });
    menuObserver.observe(panelMenu, { childList:true, subtree:false });

    panelMenu._oldytInjected = { menuItem, nestedPanel, popupObserver, menuObserver };
  }catch(_) {}
}

function openNestedInPopup(_popup, panelMenu, newPanel){
  try{
    const current = panelMenu.querySelector('.oldyt-panel');
    if (current && current !== newPanel){
      if (current._detachOutsideHandlers) { try{ current._detachOutsideHandlers(); }catch(_){} }
      if (current._detachAutoCloseGuards) { try{ current._detachAutoCloseGuards(); }catch(_){} }
      try{ panelMenu.removeChild(current); }catch(_){}
    }

    Array.from(panelMenu.children).forEach(ch => {
      if (ch !== newPanel) { try { ch.style.display = 'none'; } catch(_){} }
    });

    if (!panelMenu.contains(newPanel)) panelMenu.appendChild(newPanel);
    panelMenu._oldytOpen = true;

    newPanel._attachOutsideHandlers && newPanel._attachOutsideHandlers();
    newPanel._attachAutoCloseGuards && newPanel._attachAutoCloseGuards();
  }catch(_){}
}

function restorePanelFromPopup(popup, _nestedPanel){
  const panelMenu = popup.querySelector('.ytp-panel-menu') || popup.querySelector('.ytp-panel');
  if(!panelMenu) return;
  safeRestorePanel(panelMenu);
}

function safeRestorePanel(panelMenu){
  if(!panelMenu) return;
  const nested = panelMenu.querySelector('.oldyt-panel');
  if (nested){
    if (nested._detachOutsideHandlers) { try{ nested._detachOutsideHandlers(); }catch(_){} }
    if (nested._detachAutoCloseGuards) { try{ nested._detachAutoCloseGuards(); }catch(_){} }
    try{ panelMenu.removeChild(nested); }catch(_) {}
  }
  const ch = panelMenu.children;
  for (let i=0;i<ch.length;i++){ try{ ch[i].style.display=''; }catch(_){} }
  panelMenu._oldytOpen = false;
}

/* ==================== GLOBAL INJECTION OBSERVER ===================== */
const processedPopups = new WeakSet();

function scanAndInjectAll(){
  injectStyles();
  const list = document.querySelectorAll('.ytp-popup.ytp-settings-menu');
  for (let i=0;i<list.length;i++){
    const p = list[i];
    if (!processedPopups.has(p)) {
      injectIntoPopup(p);
      processedPopups.add(p);
    }
  }
}
function startObserver(){
  setTimeout(scanAndInjectAll, 300);
  const mo=new MutationObserver((muts)=>{
    for (let i=0;i<muts.length;i++){
      const m = muts[i];
      for (let j=0;j<m.addedNodes.length;j++){
        const n = m.addedNodes[j];
        if(!(n && n.nodeType===1)) continue;
        const el = n;
        if (el.matches && el.matches('.ytp-popup.ytp-settings-menu')) {
          if (!processedPopups.has(el)) { injectIntoPopup(el); processedPopups.add(el); }
        } else if (el.querySelector) {
          const found = el.querySelectorAll('.ytp-popup.ytp-settings-menu');
          for (let k=0;k<found.length;k++){
            const p = found[k];
            if (!processedPopups.has(p)) { injectIntoPopup(p); processedPopups.add(p); }
          }
        }
      }
    }
  });
  mo.observe(document.documentElement, { childList:true, subtree:true });
  setInterval(scanAndInjectAll, 3000);
}
startObserver();

/* ==================== Little one-time intro glow ==================== */
(function() {
  const LS_KEY = 'oldytp_firstTime';
  if (localStorage.getItem(LS_KEY)) return;

  function waitForElement(selector, timeout = 10000) {
    return new Promise(resolve => {
      const tryStart = () => {
        const el = document.querySelector(selector);
        if (el) return resolve(el);
        if (!document.body) return requestAnimationFrame(tryStart);

        const obs = new MutationObserver(() => {
          const found = document.querySelector(selector);
          if (found) { obs.disconnect(); resolve(found); }
        });
        obs.observe(document.body, { childList: true, subtree: true });
        setTimeout(() => { obs.disconnect(); resolve(null); }, timeout);
      };
      tryStart();
    });
  }

  async function runIntro() {
    const settingsBtn = await waitForElement('.ytp-settings-button');
    if (!settingsBtn) return;

    const glow = document.createElement('div');
    glow.style.cssText = `
      position: fixed;
      border-radius: 50%;
      pointer-events: none;
      z-index: 999998;
      background: radial-gradient(circle, rgba(255,255,255,0.35) 0%, rgba(0,186,255,0.2) 40%, rgba(0,186,255,0) 70%);
      filter: blur(12px);
      transform: scale(1);
      animation: ps5Glow 1.4s infinite alternate ease-in-out;
    `;
    document.body.appendChild(glow);

    const style = document.createElement('style');
    style.textContent = `
      @keyframes ps5Glow {
        0% { transform: scale(0.85); opacity: 0.7; }
        50% { transform: scale(1.1); opacity: 1; }
        100% { transform: scale(0.95); opacity: 0.8; }
      }
    `;
    document.head.appendChild(style);

    let stopAnimation = false;
    function updateGlow() {
      if (stopAnimation) return;
      const rect = settingsBtn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2;
      glow.style.left = rect.left + rect.width / 2 - size / 2 + 'px';
      glow.style.top = rect.top + rect.height / 2 - size / 2 + 'px';
      glow.style.width = glow.style.height = size + 'px';
      requestAnimationFrame(updateGlow);
    }
    updateGlow();

    settingsBtn.addEventListener('click', () => {
      stopAnimation = true;
      glow.remove();
      style.remove();
      localStorage.setItem(LS_KEY, 'true');
    }, { once: true });
  }

  runIntro();
})();
ensureSbCategoryDefaults();
  } catch(err){ console.error('[OldYTPlayer] top-level error (Youtube may have updated.)', err); }
})();

/*
Credits go to "Control Panel for Youtube" for finding the Revert Youtube Player flag: https://github.com/insin/control-panel-for-youtube/

More information on features are on the main page.
You can use this code in your own projects, if you would like.
If you are reading, please give a good feedback on my page, as I update regularly.
*/