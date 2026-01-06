// ==UserScript==
// @name         Universal Ad Blocker Pro
// @namespace    https://github.com/yourusername/universal-ad-blocker
// @version      4.0.0
// @description  Comprehensive ad blocking across YouTube, Facebook, Twitter/X, Instagram, Reddit, news sites, and more. Blocks display ads, video ads, sponsored content, and tracking scripts.
// @author       Gorstak
// @license      MIT
// @match        *://*.youtube.com/*
// @match        *://*.facebook.com/*
// @match        *://*.twitter.com/*
// @match        *://*.x.com/*
// @match        *://*.instagram.com/*
// @match        *://*.reddit.com/*
// @match        *://*.twitch.tv/*
// @match        *://*.linkedin.com/*
// @match        *://*.pinterest.com/*
// @match        *://*.tiktok.com/*
// @match        *://*.news.google.com/*
// @match        *://*.cnn.com/*
// @match        *://*.forbes.com/*
// @match        *://*.nytimes.com/*
// @match        *://*.washingtonpost.com/*
// @match        *://*.theguardian.com/*
// @match        *://*.bbc.com/*
// @match        *://*.medium.com/*
// @match        *://*.fandom.com/*
// @match        *://*.wikia.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @run-at       document-start
// @homepage     https://github.com/yourusername/universal-ad-blocker
// @supportURL   https://github.com/yourusername/universal-ad-blocker/issues
// @downloadURL https://update.greasyfork.org/scripts/561518/Universal%20Ad%20Blocker%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/561518/Universal%20Ad%20Blocker%20Pro.meta.js
// ==/UserScript==

;(() => {
  console.log("[Universal Ad Blocker] Initializing...")

  // ========================================
  // NETWORK-LEVEL BLOCKING
  // ========================================

  // Common ad/tracking domains and patterns
  const blockedDomains = [
    // Ad networks
    "doubleclick.net",
    "googleadservices.com",
    "googlesyndication.com",
    "adservice.google.com",
    "amazon-adsystem.com",
    "taboola.com",
    "outbrain.com",
    "criteo.com",
    "scorecardresearch.com",
    "ads-twitter.com",
    "static.ads-twitter.com",
    "advertising.com",
    "adnxs.com",
    "pubmatic.com",
    "rubiconproject.com",
    "adsafeprotected.com",
    "moatads.com",
    "advertising.yahoo.com",
    "adtech.de",
    "adform.net",
    "serving-sys.com",
    // Analytics and tracking
    "google-analytics.com",
    "googletagmanager.com",
    "facebook.com/tr",
    "connect.facebook.net",
    "pixel.facebook.com",
    "analytics.twitter.com",
    "pixel.reddit.com",
    "ads.linkedin.com",
    "analytics.tiktok.com",
    "hotjar.com",
    "fullstory.com",
    "segment.io",
    "segment.com",
    "mixpanel.com",
    "amplitude.com",
  ]

  const blockedPatterns = [
    "/api/stats/ads",
    "/api/stats/atr",
    "/pagead/",
    "/ptracking",
    "/ad?",
    "/ads?",
    "/advert",
    "/sponsored",
    "/promotion",
    "/tracking",
    "/analytics",
    "/collect?",
    "/beacon",
    "/pixel",
    "/imp?",
    "/impression",
    "/click?",
    "ad_banner",
    "ad_frame",
    "sponsored_content",
    "promo_banner",
  ]

  // Override fetch
  const originalFetch = window.fetch
  window.fetch = function (...args) {
    const url = typeof args[0] === "string" ? args[0] : args[0]?.url || ""

    // Check if URL matches blocked domains or patterns
    if (
      blockedDomains.some((domain) => url.includes(domain)) ||
      blockedPatterns.some((pattern) => url.includes(pattern))
    ) {
      console.log("[Universal Ad Blocker] Blocked fetch:", url)
      return Promise.reject(new Error("Blocked by Universal Ad Blocker"))
    }

    return originalFetch.apply(this, args)
  }

  // Override XMLHttpRequest
  const originalOpen = XMLHttpRequest.prototype.open
  XMLHttpRequest.prototype.open = function (method, url, ...rest) {
    if (
      typeof url === "string" &&
      (blockedDomains.some((domain) => url.includes(domain)) ||
        blockedPatterns.some((pattern) => url.includes(pattern)))
    ) {
      console.log("[Universal Ad Blocker] Blocked XHR:", url)
      return
    }
    return originalOpen.call(this, method, url, ...rest)
  }

  // ========================================
  // YOUTUBE AD BLOCKING
  // ========================================

  function removeYouTubeAds() {
    // Skip ad buttons
    const skipButtons = document.querySelectorAll(
      ".ytp-ad-skip-button, .ytp-skip-ad-button, .ytp-ad-skip-button-modern, .ytp-skip-ad-button__text",
    )
    skipButtons.forEach((btn) => {
      if (btn && btn.click) btn.click()
    })

    // Remove ad overlay
    const adOverlay = document.querySelector(".ytp-ad-player-overlay")
    if (adOverlay) adOverlay.remove()

    const adPlayerOverlay = document.querySelector(".ytp-ad-player-overlay-instream-info")
    if (adPlayerOverlay) adPlayerOverlay.remove()

    // YouTube ad selectors
    const ytAdSelectors = [
      "ytd-display-ad-renderer",
      "ytd-promoted-sparkles-web-renderer",
      "ytd-promoted-video-renderer",
      "ytd-compact-promoted-video-renderer",
      "ytd-in-feed-ad-layout-renderer",
      "ytd-ad-slot-renderer",
      "ytd-banner-promo-renderer",
      "ytd-video-masthead-ad-v3-renderer",
      "ytd-primetime-promo-renderer",
      "ytd-statement-banner-renderer",
      "ytd-action-companion-ad-renderer",
      ".video-ads",
      ".ytp-ad-module",
      "#masthead-ad",
      ".ytd-mealbar-promo-renderer",
      "ytm-promoted-sparkles-web-renderer",
      "#player-ads",
      ".ytp-ad-text",
      ".ytp-ad-preview-container",
      ".ytp-ad-overlay-container",
      ".ytp-ad-image-overlay",
      "ytd-compact-promoted-item-renderer",
      "ytd-promoted-video-inline-renderer",
      ".ytd-promoted-video-renderer",
      ".ytd-display-ad-renderer",
      "#masthead-ad",
    ]

    ytAdSelectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((el) => el.remove())
    })

    const video = document.querySelector("video")
    if (video && video.duration) {
      const adContainer = document.querySelector(".video-ads")
      const adModule = document.querySelector(".ytp-ad-module")

      if (adContainer || adModule) {
        video.currentTime = video.duration
        video.playbackRate = 16
      }
    }
  }

  function overrideYouTubeAdConfig() {
    if (window.ytInitialPlayerResponse) {
      delete window.ytInitialPlayerResponse.adPlacements
      delete window.ytInitialPlayerResponse.playerAds
    }

    // Override ytInitialData ads
    if (window.ytInitialData) {
      try {
        const removeAdsFromObject = (obj) => {
          if (!obj || typeof obj !== "object") return

          for (const key in obj) {
            if (key.toLowerCase().includes("ad") || key.toLowerCase().includes("promo")) {
              delete obj[key]
            } else if (typeof obj[key] === "object") {
              removeAdsFromObject(obj[key])
            }
          }
        }

        removeAdsFromObject(window.ytInitialData)
      } catch (e) {
        console.log("[Universal Ad Blocker] Error removing ads from ytInitialData:", e)
      }
    }
  }

  if (window.location.hostname.includes("youtube.com")) {
    overrideYouTubeAdConfig()

    // Re-run on navigation
    let lastUrl = location.href
    new MutationObserver(() => {
      const url = location.href
      if (url !== lastUrl) {
        lastUrl = url
        overrideYouTubeAdConfig()
      }
    }).observe(document, { subtree: true, childList: true })
  }

  // ========================================
  // FACEBOOK/META AD BLOCKING
  // ========================================

  function removeFacebookAds() {
    const fbAdSelectors = [
      '[data-pagelet*="FeedUnit_"][data-pagelet*="ad"]',
      'div[data-testid="fbfeed_story"]:has([aria-label*="Sponsored"])',
      '[id^="hyperfeed_story_id_"]:has(a[href*="/ads/"])',
      'div[role="article"]:has(span:contains("Sponsored"))',
      'div[data-testid="story-subtilte"]:has(span:contains("Sponsored"))',
      '[data-ad-preview="previewContainer"]',
      "div[data-ad-comet-preview]",
    ]

    fbAdSelectors.forEach((selector) => {
      try {
        document.querySelectorAll(selector).forEach((el) => {
          const article = el.closest('[role="article"]') || el
          article.style.display = "none"
        })
      } catch (e) {
        /* Ignore selector errors */
      }
    })

    // Check for "Sponsored" text
    document.querySelectorAll("span, a").forEach((el) => {
      if (el.textContent.trim() === "Sponsored" || el.textContent.includes("Sponsored")) {
        const article = el.closest('[role="article"]')
        if (article) article.style.display = "none"
      }
    })
  }

  // ========================================
  // TWITTER/X AD BLOCKING
  // ========================================

  function removeTwitterAds() {
    const twitterAdSelectors = [
      '[data-testid="placementTracking"]',
      'div[data-testid^="cellInnerDiv"]:has(span:contains("Ad"))',
      'div[data-testid^="cellInnerDiv"]:has(span:contains("Promoted"))',
      '[data-testid="trend"]:has([aria-label*="Promoted"])',
      'div[role="complementary"] div:has(span:contains("Ad"))',
    ]

    twitterAdSelectors.forEach((selector) => {
      try {
        document.querySelectorAll(selector).forEach((el) => el.remove())
      } catch (e) {
        /* Ignore selector errors */
      }
    })

    // Check articles for promoted content
    document.querySelectorAll("article").forEach((article) => {
      const text = article.textContent
      if (text.includes("Promoted") || text.includes("Ad ·")) {
        article.style.display = "none"
      }
    })
  }

  // ========================================
  // REDDIT AD BLOCKING
  // ========================================

  function removeRedditAds() {
    const redditAdSelectors = [
      'div[data-promoted="true"]',
      'a[data-click-id="promoted"]',
      ".promotedlink",
      "shreddit-ad-post",
      '[slot="ad_top"]',
      '[slot="ad_main"]',
      'faceplate-tracker[source="ads"]',
      'div:has(> a[href*="/advertising"])',
    ]

    redditAdSelectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((el) => el.remove())
    })
  }

  // ========================================
  // INSTAGRAM AD BLOCKING
  // ========================================

  function removeInstagramAds() {
    document.querySelectorAll("article").forEach((article) => {
      const text = article.textContent
      if (text.includes("Sponsored")) {
        article.style.display = "none"
      }
    })
  }

  // ========================================
  // LINKEDIN AD BLOCKING
  // ========================================

  function removeLinkedInAds() {
    const linkedInAdSelectors = [
      ".feed-shared-update-v2--promoted",
      "div[data-ad-banner-id]",
      'div[data-is-sponsored="true"]',
      'span:contains("Promoted")',
    ]

    linkedInAdSelectors.forEach((selector) => {
      try {
        document.querySelectorAll(selector).forEach((el) => {
          const container = el.closest(".feed-shared-update-v2") || el
          container.remove()
        })
      } catch (e) {
        /* Ignore selector errors */
      }
    })
  }

  // ========================================
  // NEWS SITES AD BLOCKING
  // ========================================

  function removeNewsSiteAds() {
    const newsSiteAdSelectors = [
      ".ad",
      ".ads",
      ".advertisement",
      ".ad-container",
      ".ad-wrapper",
      ".ad-slot",
      ".ad-banner",
      ".ad-placeholder",
      '[id*="ad-"]',
      '[class*="ad-"]',
      '[id*="google_ads"]',
      '[class*="google_ads"]',
      "[data-ad-rendered]",
      'iframe[src*="doubleclick"]',
      'iframe[src*="googlesyndication"]',
      'div[id^="div-gpt-ad"]',
      ".sponsored-content",
      ".native-ad",
      ".promo-box",
      "[data-google-query-id]",
    ]

    newsSiteAdSelectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((el) => {
        // Don't remove if it's part of actual content
        if (!el.closest("article") || (el.offsetHeight < 1000 && el.querySelector('img[src*="ad"]'))) {
          el.remove()
        }
      })
    })
  }

  // ========================================
  // TWITCH AD BLOCKING
  // ========================================

  function removeTwitchAds() {
    const twitchAdSelectors = ['[data-a-target="video-ad-label"]', ".video-ad", ".advertisement-banner"]

    twitchAdSelectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((el) => el.remove())
    })
  }

  // ========================================
  // GENERIC AD BLOCKING
  // ========================================

  function removeGenericAds() {
    const genericAdSelectors = [
      // Common ad containers
      "ins.adsbygoogle",
      'iframe[id*="google_ads"]',
      'iframe[id*="aswift"]',
      'div[id*="taboola"]',
      'div[id*="outbrain"]',
      'div[class*="advert"]',
      'aside[class*="ad"]',
      '[aria-label*="advertisement"]',
      '[aria-label*="Advertisement"]',
      // Video ad overlays
      ".video-ad-overlay",
      ".preroll-ad",
      ".midroll-ad",
    ]

    genericAdSelectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((el) => el.remove())
    })
  }

  // ========================================
  // MASTER REMOVAL FUNCTION
  // ========================================

  function removeAllAds() {
    const hostname = window.location.hostname

    // Site-specific removal
    if (hostname.includes("youtube.com")) {
      removeYouTubeAds()
    } else if (hostname.includes("facebook.com")) {
      removeFacebookAds()
    } else if (hostname.includes("twitter.com") || hostname.includes("x.com")) {
      removeTwitterAds()
    } else if (hostname.includes("reddit.com")) {
      removeRedditAds()
    } else if (hostname.includes("instagram.com")) {
      removeInstagramAds()
    } else if (hostname.includes("linkedin.com")) {
      removeLinkedInAds()
    } else if (hostname.includes("twitch.tv")) {
      removeTwitchAds()
    } else {
      removeNewsSiteAds()
    }

    // Always run generic removal
    removeGenericAds()
  }

  // ========================================
  // INITIALIZATION
  // ========================================

  // Run immediately
  removeAllAds()

  const checkInterval = window.location.hostname.includes("youtube.com") ? 500 : 1000
  setInterval(removeAllAds, checkInterval)

  // Observer for dynamically loaded content
  if (document.body) {
    const observer = new MutationObserver(removeAllAds)
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })
  } else {
    // Wait for body to load
    document.addEventListener("DOMContentLoaded", () => {
      removeAllAds()
      const observer = new MutationObserver(removeAllAds)
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      })
    })
  }

  console.log("[Universal Ad Blocker] Initialized successfully")
})()
