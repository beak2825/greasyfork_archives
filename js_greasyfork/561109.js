// ==UserScript==
// @name         Hide Collaborations in Youtube Subscriptions
// @namespace    https://github.com/rafaelmtrindade/yt-hide-subscription-collabs
// @version      2026-01-01
// @description  Removes videos by channels you're not subscribed to from your YouTube subscriptions feed.
// @author       Rafael Martins Trindade
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @match        https://www.youtube.com/feed/subscriptions
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/561109/Hide%20Collaborations%20in%20Youtube%20Subscriptions.user.js
// @updateURL https://update.greasyfork.org/scripts/561109/Hide%20Collaborations%20in%20Youtube%20Subscriptions.meta.js
// ==/UserScript==

(async function() {
  const SCRIPT_NAME = 'rmtrin.YtSubsFeedCleaner';
  const DEBUG_MODE = false;

  const YT_ALL_SUBSCRIPTIONS_URL = 'https://www.youtube.com/feed/channels';
  const YT_DATA_MARKER = 'ytInitialData = ';

  const YT_FEED_NOT_SIGNED_IN_SELECTOR = 'ytd-background-promo-renderer';
  const YT_FEED_SELECTOR = 'ytd-section-list-renderer > div#contents';
  const YT_FEED_CARD_TAGNAME = 'YTD-ITEM-SECTION-RENDERER';
  // ytd-item-section-renderer ytd-shelf-renderer #title-container a[title]
  const YT_FEED_CHANNEL_INFO_SELECTOR = 'ytd-shelf-renderer #title-container a[title]';

  const logger = (() => {
    const print = (fn, ...args) => {
      const tag = `[${new Date().toLocaleString()}][${SCRIPT_NAME}]`;
      fn(tag, ...args);
    }

    return {
      error(...args) {
        return print(console.error, ...args);
      },
      log(...args) {
        if (!DEBUG_MODE) return;
        return print(console.log, ...args);
      }
    };
  })();

  const UserSubscriptions = (() => {
    /** @type {Subscription[]} */
    let _subscriptions = [];

    const _init = {
      done: false,
      success: false,
    };

    const initialize = async () => {
      const notSignedInPromo = document.querySelector(YT_FEED_NOT_SIGNED_IN_SELECTOR);
      if (!notSignedInPromo) {
        try {
          const subsHtml = await _fetchYtSubsHtml();
          const subscriptions = _extractJsonFromYtSubsHtml(subsHtml);
          if (!subscriptions) throw new Error('Failed to read user subscription info');
          _subscriptions = subscriptions;
          _init.success = true;
        } catch (err) {
          logger.error(err);
        }
      }
      _init.done = true;
    };

    const _fetchYtSubsHtml = async () => {
      const options = { method: "GET" };
      try {
        const htmlStr = await fetch(YT_ALL_SUBSCRIPTIONS_URL, options).then(res => res.text());
        return htmlStr;
      } catch (err) {
        logger.error('Failed to fetch user subscriptions info');
        throw err;
      }
    };

    /** @param {string} html */
    const _extractJsonFromYtSubsHtml = (html) => {
      if (!html) return;

      const startIdx = html.indexOf(YT_DATA_MARKER);
      if (startIdx === -1) return;
      html = html.substring(startIdx + YT_DATA_MARKER.length);

      const endIdx = html.indexOf('</script>');
      if (endIdx === -1) return;
      html = html.substring(0, endIdx);

      const start = html.indexOf('{');
      const end = html.lastIndexOf('}');
      return _extractSubsFromYtJsonStr(html.substring(start, end + 1));
    };

    /** @param {string} jsonStr */
    const _extractSubsFromYtJsonStr = (jsonStr) => {
      const ytInitialData = JSON.parse(jsonStr);

      // ytInitialData.contents.twoColumnBrowseResultsRenderer.tabs[0].tabRenderer.content.sectionListRenderer.contents[0].itemSectionRenderer.contents[0].shelfRenderer.content.expandedShelfContentsRenderer.items
      const { sectionListRenderer } = ytInitialData.contents.twoColumnBrowseResultsRenderer.tabs[0].tabRenderer.content;
      const { shelfRenderer } = sectionListRenderer.contents[0].itemSectionRenderer.contents[0];
      const { items } = shelfRenderer.content.expandedShelfContentsRenderer;

      if (!items) return;

      /** @type {Subscription[]} */
      const subscriptions = items.map(({ channelRenderer }) => {
        const { title, subscriberCountText } = channelRenderer;
        return {
          title: title.simpleText,
          handle: subscriberCountText.simpleText,
        };
      });
      return subscriptions;
    };

    /**
     * @param {string} channel Channel name or handle to search for
     */
    const findSubscription = (channel) => {
      if (channel.startsWith('@')) {
        return _subscriptions.find((s) => s.handle === channel);
      }
      return _subscriptions.find((s) => s.title === channel);
    };

    /**
     * @param {string} channel Channel name or handle to verify
     */
    const isSubscribed = (channel) => {
      return !!findSubscription(channel);
    };

    return Object.freeze({
      get subscriptions() { return _subscriptions; },
      get initialized() { return _init.done; },
      get ready() { return _init.done && _init.success; },
      init: initialize,
      find: findSubscription,
      isSubscribed,
    });

    /**
     * @typedef {Object} Subscription
     * @prop {string} title
     * @prop {string} handle
     */
  })();

  /** @param {Element} cardNode */
  const validateFeedCard = (cardNode) => {
    if (cardNode.tagName !== YT_FEED_CARD_TAGNAME) return;

    const channelLink = cardNode.querySelector(YT_FEED_CHANNEL_INFO_SELECTOR);
    if (!channelLink) return;

    const title = channelLink.getAttribute('title');
    const handle = channelLink.getAttribute('href')?.slice(1);

    if (!UserSubscriptions.isSubscribed(title)) {
      logger.log('Not subscribed to', { title, handle });
      logger.log('Previous sibling: ', cardNode.previousElementSibling);
      logger.log('Removing from feed:', cardNode);
      cardNode.remove();
    }
  };

  const feedMutationObserver = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.type === 'childList' && m.addedNodes.length > 0) {
        logger.log(`Detected ${m.addedNodes.length} children added to subscriptions video feed`);
        m.addedNodes.forEach(validateFeedCard);
      }
    }
  });

  let retries = 10;
  const initializeObserver = () => {
    const subscriptionsFeedList = document.querySelector(YT_FEED_SELECTOR);
    if (!subscriptionsFeedList) {
      if (--retries > 0) setTimeout(() => initializeObserver(), 700);
      else logger.error('Failed to initialize mutation observer');
      return;
    }
    feedMutationObserver.observe(subscriptionsFeedList, { childList: true });
    logger.log('subscriptionsFeedObserver initialized.', retries);

    subscriptionsFeedList.querySelectorAll(YT_FEED_CARD_TAGNAME).forEach(validateFeedCard);
  }

  await UserSubscriptions.init();
  if (!UserSubscriptions.ready) return;
  logger.log('Loaded UserSubscriptions successfully, subscriptions:', UserSubscriptions.subscriptions);

  initializeObserver();
})();