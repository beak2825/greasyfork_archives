// ==UserScript==
// @name         Tidy Tube
// @namespace    https://github.com/jaykeny/
// @version      1.4.0
// @description  A lightweight script to declutter YouTube by hiding videos for members and videos under a certain view count.
// @author       JayKeny
// @match        https://www.youtube.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/551895/Tidy%20Tube.user.js
// @updateURL https://update.greasyfork.org/scripts/551895/Tidy%20Tube.meta.js
// ==/UserScript==

// Settings
const SETTINGS = {
  hideMembersOnly: true,  // hide member videos
  minViews: 1000,         // hide normal videos under this view count
  hideLiveUnder: 100000,  // hide live streams with fewer viewers than this
  hideOlderThanMonths: 1, // hide videos older than this number of months
  hideWatched: true,      // hide videos with watched progress bar
  hidePlaylists: true,    // Hide playlist blocks in the feed
  hideFeedNudges: true,   // Hide feed nudges like "Looking for something different?"
};

// Translations
const TRANSLATIONS = {
  en: {
    membersOnly: ["Members only", "Exclusive Access"],
    views: /\bviews?\b/i,
    noViews: /no views?/i,
    watching: /([\d,.]+)\s*(K|M)?\s*watching/i,
    ago: /(\d+)\s+(second|minute|hour|day|week|month|year)s?\s+ago/i,
    units: {
      second: "second",
      minute: "minute",
      hour: "hour",
      day: "day",
      week: "week",
      month: "month",
      year: "year"
    }
  },
  fr: {
    membersOnly: ["Réservé aux membres", "Accès exclusif"],
    views: /\b(vues?)\b/i,
    noViews: /aucune? vue/i,
    watching: /([\d,.]+)\s*(K|M)?\s*(personnes)?\s*(regardent|en direct)/i,
    ago: /il y a\s+(\d+)\s+(seconde|minute|heure|jour|semaine|mois|an|année)s?/i,
    units: {
      seconde: "second",
      minute: "minute",
      heure: "hour",
      jour: "day",
      semaine: "week",
      mois: "month",
      an: "year",
      année: "year",
      ans: "year",
      années: "year"
    }
  }
};

const LANGUAGE = document.documentElement.lang.slice(0, 2) || "en";
const TRANSLATION = TRANSLATIONS[LANGUAGE] || TRANSLATIONS.en;


// Helper function to hide element + parent if applicable
function hideElement(el) {
  const parent = el.closest("ytd-rich-item-renderer") || el;
  parent.style.display = "none";
  parent.style.height = "0";
  parent.style.margin = "0";
  parent.style.padding = "0";
}

// Helper function to check video age
function isOlderThanMonths(text, months) {
  const match = text.match(TRANSLATION.ago);
  if (!match) return false;

  const value = parseInt(match[1], 10);
  const rawUnit = match[2].toLowerCase();
  const unit = TRANSLATION.units[rawUnit] || rawUnit;

  if (unit === "month" && value >= months) return true;
  if (unit === "year") return true;
  if (unit === "week" && value / 4 >= months) return true;
  if (unit === "day" && value / 30 >= months) return true;
  if (unit === "hour" && value / (24 * 30) >= months) return true;
  if (unit === "minute" && value / (60 * 24 * 30) >= months) return true;
  if (unit === "second" && value / (60 * 60 * 24 * 30) >= months) return true;

  return false;
}

// Get view count from the new YouTube layout
function getViewCount(el) {
  const viewText = Array.from(el.querySelectorAll('.yt-core-attributed-string, span[role="text"]'))
    .map(e => e.textContent.trim())
    .find(t => TRANSLATION.views.test(t));

  if (!viewText) return null;

  // Handle "No views"
  if (TRANSLATION.noViews.test(viewText)) return 0;

  // Match number before "views"
  const match = viewText.match(/([\d,.]+)\s*(K|M)?/i);
  if (!match) return null;

  let num = parseFloat(match[1].replace(/,/g, ""));
  const unit = match[2];
  if (unit === "K") num *= 1000;
  else if (unit === "M") num *= 1000000;

  return num;
}

// Checks if video is watched
function isWatched(el) {
  const progressBars = el.querySelectorAll("div.ytThumbnailOverlayProgressBarHostWatchedProgressBar");
  for (let bar of progressBars) {
    const segment = bar.querySelector("div");
    if (segment && parseFloat(segment.style.width) > 0) {
      return true;
    }
  }
  return false;
}

// Core filter logic
function filterVideos() {
  const isChannelVideosPage = location.pathname.includes("/videos");

  // Sections
  document.querySelectorAll("ytd-rich-section-renderer").forEach(function (section) {
    hideElement(section);
  });

  // Video pages
  document.querySelectorAll("yt-lockup-view-model").forEach(function (section) {
    const text = section.textContent;

    // Hide members-only videos
    if (SETTINGS.hideMembersOnly) {
      const isMembersOnly = Array.from(section.querySelectorAll('.yt-badge-shape__text'))
        .some(b => b.textContent.trim().toLowerCase().includes("members only"));

      if (isMembersOnly || text.includes("Members only")) {
        hideElement(section);
        return;
      }
    }

    // Hide videos under minViews
    const views = getViewCount(section.querySelector('.yt-lockup-view-model__metadata') || section);
    if (views !== null && views < SETTINGS.minViews) {
      hideElement(section);
      return;
    }

    // Hide live videos under hideLiveUnder
    const liveMatch = text.match(/([\d,.]+)\s*(K|M)?\s*watching/i);
    if (liveMatch) {
      let num = parseFloat(liveMatch[1].replace(/,/g, ""));
      const unit = liveMatch[2];
      if (unit === "K") num *= 1000;
      else if (unit === "M") num *= 1000000;
      if (num < SETTINGS.hideLiveUnder) {
        hideElement(section);
        return;
      }
    }

    // Hide older videos
    if (SETTINGS.hideOlderThanMonths && isOlderThanMonths(text, SETTINGS.hideOlderThanMonths)) {
      hideElement(section);
      return;
    }

    if (SETTINGS.hideWatched && isWatched(section)) {
      hideElement(section);
      return;
    }
  });

  // Home
  document.querySelectorAll("ytd-rich-item-renderer").forEach(function (el) {
    const text = el.textContent;

    // Channel Videos tab: only hide members-only content
    if (isChannelVideosPage && SETTINGS.hideMembersOnly) {
      if (TRANSLATION.membersOnly.some(term => text.toLowerCase().includes(term.toLowerCase())) || el.querySelector(".sponsorThumbnailLabelVisible")) {
        hideElement(el);
      }
      return;
    }

    // Hide playlists
    if (SETTINGS.hidePlaylists) {
      const hasPlaylistLink = Array.from(el.querySelectorAll('a')).some(a => a.href.includes('?list=') || a.href.includes('&list='));
      
      if (hasPlaylistLink) {
        hideElement(el);
        return;
      }
    }

    // Hide "feed nudge" suggestion sections like "Looking for something different?"
    if (SETTINGS.hideFeedNudges) {
      if (el.querySelector('ytd-feed-nudge-renderer')) {
        hideElement(el);
        return;
      }
    }

    // Hide members-only videos
    if (SETTINGS.hideMembersOnly) {
      if (TRANSLATION.membersOnly.some(term => text.toLowerCase().includes(term.toLowerCase())) || el.querySelector(".sponsorThumbnailLabelVisible")) {
        hideElement(el);
        return;
      }
    }

    // Hide videos under minViews
    const views = getViewCount(el);

    if (views !== null && views < SETTINGS.minViews) {
      hideElement(el);
      return;
    }

    // Hide live videos under hideLiveUnder
    const liveMatch = text.match(TRANSLATION.watching);

    if (liveMatch) {
      let num = parseFloat(liveMatch[1].replace(/,/g, ""));
      const unit = liveMatch[2];
      if (unit === "K") num *= 1000;
      else if (unit === "M") num *= 1000000;
      if (num < SETTINGS.hideLiveUnder) {
        hideElement(el);
        return;
      }
    }

    // Hide videos older than specified months
    if (SETTINGS.hideOlderThanMonths && isOlderThanMonths(text, SETTINGS.hideOlderThanMonths)) {
      hideElement(el);
      return;
    }

    // Hide watched videos
    if (SETTINGS.hideWatched && isWatched(el)) {
      hideElement(el);
      return;
    }
  });
}

// Run once and then watch for DOM changes
filterVideos();

const observer = new MutationObserver((mutations) => {
  for (let mutation of mutations) {
    if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
      filterVideos();
    }
  }
});
observer.observe(document.body, { childList: true, subtree: true });
