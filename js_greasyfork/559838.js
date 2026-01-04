// ==UserScript==
// @name         Twitch Channel Preview
// @namespace    dev.263
// @version      1.0.0
// @description  Replaces channel icons in the sidebar with live preview images.
// @author       Bastian Bräu
// @match        https://www.twitch.tv/*
// @grant        none
// @license      ISC
// @homepageURL  https://github.com/b263/user-scripts
// @supportURL   https://github.com/b263/user-scripts/issues
// @downloadURL https://update.greasyfork.org/scripts/559838/Twitch%20Channel%20Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/559838/Twitch%20Channel%20Preview.meta.js
// ==/UserScript==

function applyStyles(element, styles) {
  Object.entries(styles).forEach(([property, value]) => {
    element.style[property] = value;
  });
}

class Debug {
  static enabled = false;

  static _output(method, message, data = null) {
    if (!Debug.enabled) return;
    const timestamp = new Date().toLocaleTimeString();
    const args = [`[TwitchPreview ${timestamp}] ${message}`];
    if (data !== null) args.push(data);
    console[method](...args);
  }

  static log(message, data = null) {
    this._output('log', message, data);
  }

  static warn(message, data = null) {
    this._output('warn', message, data);
  }

  static error(message, data = null) {
    this._output('error', message, data);
  }
}

class SidebarCard {
  constructor(card) {
    this.card = card;
  }

  getChannelNameFromUrl(url) {
    return url.split('/').pop();
  }

  getDisplayName() {
    const nameElement = this.card.querySelector('p');
    return nameElement ? nameElement.textContent.trim() : null;
  }

  getChannelLink() {
    return this.card.querySelector('a[href^="/"]');
  }

  getHref() {
    const link = this.getChannelLink();
    return link?.getAttribute('href');
  }

  getChannelName() {
    const href = this.getHref();
    return href ? this.getChannelNameFromUrl(href) : null;
  }

  isLive() {
    const cardText = this.card.textContent.toLowerCase();
    const isLive = !cardText.includes('offline');
    Debug.log(
      `Channel live check - Display: ${this.getDisplayName()}, Text: "${cardText.substring(0, 100)}...", IsLive: ${isLive}`
    );
    return isLive;
  }

  isValid() {
    const href = this.getHref();
    const channelName = this.getChannelName();
    const displayName = this.getDisplayName();

    const checks = {
      hasChannelLink: !!this.getChannelLink(),
      hasValidHref: !(
        !href ||
        href === '/' ||
        href.includes('/directory') ||
        href.includes('/settings')
      ),
      hasChannelName: !(!channelName || channelName.length === 0),
      hasDisplayName: !!displayName,
    };

    const isValid = Object.values(checks).every(check => check);

    if (!isValid) {
      Debug.warn(
        `Invalid channel data - Display: "${displayName || 'NULL'}", Href: ${href}, Checks:`,
        checks
      );
    }

    return isValid;
  }
}

class CardState {
  static isProcessed(card) {
    return card.dataset.previewProcessed === 'true';
  }

  static markAsProcessed(card) {
    card.dataset.previewProcessed = 'true';
  }

  static unmarkAsProcessed(card) {
    card.removeAttribute('data-preview-processed');
  }

  static storeOriginalContent(card, href) {
    card.dataset.originalContent = card.innerHTML;
    card.dataset.channelLink = href;
  }

  static hasPreviewImage(card) {
    return !!card.querySelector('img[data-channel-name]');
  }
}

class ImageLoader {
  static waitForImageLoad(img) {
    return new Promise(resolve => {
      if (img.complete) {
        resolve();
      } else {
        const onLoad = () => {
          img.removeEventListener('load', onLoad);
          img.removeEventListener('error', onLoad);
          resolve();
        };
        img.addEventListener('load', onLoad);
        img.addEventListener('error', onLoad);
      }
    });
  }

  static handleImageLoad() {
    if (this.naturalWidth && this.naturalHeight) {
      if (this.naturalWidth < 100 || this.naturalHeight < 100) {
        this.style.opacity = '0.3';
        this.style.filter = 'grayscale(100%)';
      }
    }
  }

  static handleImageError() {
    this.style.opacity = '0.3';
    this.style.filter = 'grayscale(100%)';
  }
}

class UIBuilder {
  static createPreviewImage(channelName) {
    const img = document.createElement('img');
    img.dataset.channelName = channelName;
    img.src = `https://static-cdn.jtvnw.net/previews-ttv/live_user_${channelName}-320x180.jpg?t=${Date.now()}`;

    applyStyles(img, {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      borderRadius: '4px',
      transition: 'opacity 0.3s ease',
    });

    img.onload = ImageLoader.handleImageLoad.bind(img);
    img.onerror = ImageLoader.handleImageError.bind(img);

    return img;
  }

  static createChannelNameDisplay(displayName) {
    const nameDiv = document.createElement('div');
    nameDiv.textContent = displayName;

    applyStyles(nameDiv, {
      fontWeight: 'bold',
      padding: '4px 8px',
      textAlign: 'center',
    });

    return nameDiv;
  }

  static createLinkWrapper(href) {
    const linkWrapper = document.createElement('a');
    linkWrapper.href = href;

    applyStyles(linkWrapper, {
      display: 'block',
      width: '100%',
      height: '100%',
      textDecoration: 'none',
    });

    return linkWrapper;
  }

  static createContainer() {
    const container = document.createElement('div');

    applyStyles(container, {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    });

    return container;
  }

  static createImageContainer(previewImg) {
    const imageContainer = document.createElement('div');

    applyStyles(imageContainer, {
      flex: '1',
      overflow: 'hidden',
    });

    imageContainer.appendChild(previewImg);
    return imageContainer;
  }

  static buildPreviewCard(channelName, displayName, href) {
    const previewImg = this.createPreviewImage(channelName);
    const channelNameDiv = this.createChannelNameDisplay(displayName);
    const linkWrapper = this.createLinkWrapper(href);
    const container = this.createContainer();
    const imageContainer = this.createImageContainer(previewImg);

    container.appendChild(channelNameDiv);
    container.appendChild(imageContainer);
    linkWrapper.appendChild(container);

    return { linkWrapper, previewImg };
  }
}

class SidebarManager {
  static getSidebar() {
    return document.querySelector('.side-bar-contents');
  }

  static getSideNavCards() {
    const sidebar = this.getSidebar();
    const cards = sidebar
      ? Array.from(sidebar.querySelectorAll('.side-nav-card'))
      : [];

    Debug.log(`Found ${cards.length} sidebar cards`);
    return cards;
  }

  static getUnprocessedCards() {
    return document.querySelectorAll(
      '.side-nav-card:not([data-preview-processed])'
    );
  }

  static getProcessedCards() {
    return document.querySelectorAll('.side-nav-card[data-preview-processed]');
  }

  static getAllPreviewImages() {
    return document.querySelectorAll('img[data-channel-name]');
  }
}

class ChannelProcessor {
  static shouldSkipCard(channelData) {
    const checks = {
      isProcessed: CardState.isProcessed(channelData.card),
      isValid: channelData.isValid(),
      isLive: channelData.isLive(),
    };

    const shouldSkip = checks.isProcessed || !checks.isValid || !checks.isLive;

    if (shouldSkip) {
      const reason = checks.isProcessed
        ? 'already processed'
        : !checks.isValid
          ? 'invalid data'
          : !checks.isLive
            ? 'offline'
            : 'unknown';
      Debug.log(
        `Skipping card - Display: ${channelData.getDisplayName()}, Reason: ${reason}`
      );
    }

    return shouldSkip;
  }

  static async processCard(card) {
    const channelData = new SidebarCard(card);
    Debug.log(`Processing card - Display: ${channelData.getDisplayName()}`);

    if (this.shouldSkipCard(channelData)) {
      if (!channelData.isLive()) {
        CardState.markAsProcessed(card);
        Debug.log(
          `Marked offline card as processed - Display: ${channelData.getDisplayName()}`
        );
      }
      return;
    }

    Debug.log(
      `Building preview for channel - Display: ${channelData.getDisplayName()}, URL: ${channelData.getChannelName()}`
    );

    CardState.storeOriginalContent(card, channelData.getHref());

    const { linkWrapper, previewImg } = UIBuilder.buildPreviewCard(
      channelData.getChannelName(),
      channelData.getDisplayName(),
      channelData.getHref()
    );

    const originalChildren = Array.from(card.children);
    originalChildren.forEach(child => {
      child.style.display = 'none';
      child.style.visibility = 'hidden';
      child.style.position = 'absolute';
      child.style.left = '-9999px';
    });

    card.appendChild(linkWrapper);

    CardState.markAsProcessed(card);
    await ImageLoader.waitForImageLoad(previewImg);

    Debug.log(
      `Successfully processed card - Display: ${channelData.getDisplayName()}`
    );
  }

  static async processAllCards() {
    const cards = SidebarManager.getSideNavCards();
    Debug.log(`Starting to process ${cards.length} cards`);

    for (const card of cards) {
      await this.processCard(card);
    }

    Debug.log(`Finished processing all cards`);
  }

  static async updateExistingPreviews() {
    const previewImages = SidebarManager.getAllPreviewImages();

    for (const img of previewImages) {
      const channelName = img.dataset.channelName;
      if (channelName) {
        img.src = `https://static-cdn.jtvnw.net/previews-ttv/live_user_${channelName}-320x180.jpg?t=${Date.now()}`;
        await ImageLoader.waitForImageLoad(img);
      }
    }
  }

  static checkForOfflineToOnlineTransition() {
    const processedCards = SidebarManager.getProcessedCards();

    processedCards.forEach(card => {
      const channelData = new SidebarCard(card);
      if (channelData.isLive() && !CardState.hasPreviewImage(card)) {
        CardState.unmarkAsProcessed(card);
      }
    });
  }
}

class ChangeObserver {
  constructor() {
    this.debounceTimeout = 500;
    this.pollInterval = 5000;
    this.updateInterval = 30000;
    this.loadDelay = null;
    this.observer = null;
  }

  shouldProcessMutations(mutations) {
    return mutations.some(mutation => {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        return Array.from(mutation.addedNodes).some(node => {
          return (
            node.nodeType === 1 &&
            node.querySelector &&
            (node.querySelector('.side-nav-card') ||
              node.classList.contains('side-nav-card') ||
              node.closest('.side-bar-contents'))
          );
        });
      }

      return (
        mutation.type === 'characterData' ||
        (mutation.type === 'childList' &&
          mutation.target.matches &&
          mutation.target.matches('.side-nav-card, .side-nav-card *'))
      );
    });
  }

  handleMutations(mutations) {
    if (!this.shouldProcessMutations(mutations)) return;

    Debug.log('DOM mutations detected, scheduling card processing');

    clearTimeout(this.loadDelay);
    this.loadDelay = setTimeout(() => {
      const unprocessedCards = SidebarManager.getUnprocessedCards();
      Debug.log(
        `Found ${unprocessedCards.length} unprocessed cards after mutation`
      );

      ChannelProcessor.checkForOfflineToOnlineTransition();

      if (unprocessedCards.length > 0) {
        ChannelProcessor.processAllCards();
      }
    }, this.debounceTimeout);
  }

  checkForUnprocessedCards() {
    const cards = SidebarManager.getUnprocessedCards();
    if (cards.length > 0) {
      Debug.log(`Periodic check found ${cards.length} unprocessed cards`);
      ChannelProcessor.processAllCards();
    }
  }

  setupMutationObserver() {
    this.observer = new MutationObserver(this.handleMutations.bind(this));
    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  }

  setupIntervals() {
    setInterval(
      () => ChannelProcessor.updateExistingPreviews(),
      this.updateInterval
    );
    setInterval(() => this.checkForUnprocessedCards(), this.pollInterval);
  }

  init() {
    ChannelProcessor.processAllCards();
    this.setupIntervals();
    this.setupMutationObserver();
  }
}

const changeObserver = new ChangeObserver();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => changeObserver.init());
} else {
  changeObserver.init();
}
