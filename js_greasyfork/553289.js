// ==UserScript==
// @name        Fullchan X_fixed_2
// @namespace   Violentmonkey Scripts
// @match        *://8chan.moe/*
// @match        *://8chan.se/*
// @match        *://8chan.cc/*
// @match        *://alephchvkipd2houttjirmgivro5pxullvcgm4c47ptm7mhubbja6kad.onion/*
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.deleteValue
// @grant        GM.listValues
// @run-at      document-end
// @version     1.30.1_fixed_2
// @author      vfyxe
// @description 8chan features script
// @downloadURL https://update.greasyfork.org/scripts/553289/Fullchan%20X_fixed_2.user.js
// @updateURL https://update.greasyfork.org/scripts/553289/Fullchan%20X_fixed_2.meta.js
// ==/UserScript==

class FullChanX {
  constructor() {
    this.element = null;
    this.settingsEl = null;
    this.settingsAll = null;
    this.settings = {};
    this.settingsThreadBanisher = {};
    this.settingsMascot = {};
    this.isThread = false;
    this.isDisclaimer = false;
  }

  async init() {
    this.element = document.querySelector('fullchan-x');
    this.settingsEl = window.fullChanXSettings;
    this.settingsAll = this.settingsEl?.settings;

    if (!this.settingsAll) {
      const savedSettings = await GM.getValue('fullchan-x-settings');
      if (savedSettings) {
        try {
          this.settingsAll = JSON.parse(savedSettings);
        } catch (error) {
          console.error('Failed to parse settings from GM storage', error);
          this.settingsAll = {};
        }
      } else {
        this.settingsAll = {};
      }
    }

    this.settings = this.settingsAll.main || {};
    this.settingsThreadBanisher = this.settingsAll.threadBanisher || {};
    this.settingsMascot = this.settingsAll.mascot || {};

    this.isThread = !!document.querySelector('.opCell');
    this.isDisclaimer = window.location.href.includes('disclaimer');

    Object.keys(this.settings).forEach(key => {
      if (typeof this.settings[key] === 'object' && this.settings[key] !== null) {
        this[key] = this.settings[key]?.value;
      } else {
        this[key] = this.settings[key];
      }
    });

    this.settingsButton = this.element.querySelector('#fcx-settings-btn');
    this.settingsButton.addEventListener('click', () => this.settingsEl.toggle());

    this.handleBoardLinks();
    this.styleUI();

    this.headerMenuEl = window.fullChanXHeaderMenu;
    if (this.headerMenuEl && this.settings.enableHeaderMenu) this.headerMenuEl.init();

    if (!this.isThread) {
      if (this.settingsThreadBanisher.enableThreadBanisher) this.banishThreads(this.settingsThreadBanisher);
      return;
    }

    this.quickReply = document.querySelector('#quick-reply');
    this.qrbody = document.querySelector('#qrbody');
    this.threadParent = document.querySelector('#divThreads');
    this.threadId = this.threadParent.querySelector('.opCell').id;
    this.thread = this.threadParent.querySelector('.divPosts');
    this.posts = [...this.thread.querySelectorAll('.postCell')];
    this.postOrder = 'default';
    this.postOrderSelect = this.element.querySelector('#thread-sort');
    this.myYousLabel = this.element.querySelector('.my-yous__label');
    this.yousContainer = this.element.querySelector('#my-yous');
    this.gallery = window.fullChanXGallery;
    this.galleryButton = this.element.querySelector('#fcx-gallery-btn');

    this.updateYous();
    this.observers();

    if (this.enableFileExtensions) this.handleTruncatedFilenames();
    if (this.settingsMascot.enableMascot) this.showMascot();

    if (this.settings.doNotShowLocation) {
      const checkbox = document.getElementById('qrcheckboxNoFlag');
      if (checkbox) checkbox.checked = true;
      checkbox.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  styleUI() {
    this.element.style.setProperty('--top', this.uiTopPosition);
    this.element.style.setProperty('--right', this.uiRightPosition);
    this.element.classList.toggle('fcx-in-nav', this.moveToNav);
    this.element.classList.toggle('fcx--dim', this.uiDimWhenInactive && !this.moveToNav);
    this.element.classList.toggle('fcx-page-thread', this.isThread);
    document.body.classList.toggle('fcx-replies-plus', this.enableEnhancedReplies);
    document.body.classList.toggle('fcx-hide-delete', this.hideDeletionBox);
    document.body.classList.toggle('fcx-hide-navbar', this.settings.hideNavbar);
    document.body.classList.toggle('fcx-icon-replies', this.settings.enableIconBacklinks);

    const style = document.createElement('style');
    if (this.hideDefaultBoards !== '' && this.hideDefaultBoards.toLowerCase() !== 'all') {
      style.textContent += '#navTopBoardsSpan{display:block!important;}';
    }
    document.body.appendChild(style);
  }

  checkRegexList(string, regexList) {
    const regexObjects = regexList.map(r => {
      const match = r.match(/^\/(.*)\/([gimsuy]*)$/);
      return match ? new RegExp(match[1], match[2]) : null;
    }).filter(Boolean);

    return regexObjects.some(regex => regex.test(string));
  }

  banishThreads(banisher) {
    if (window.location.pathname.includes('archives.js')) return; // FIX
    this.threadsContainer = document.querySelector('#divThreads');
    if (!this.threadsContainer) return;
    this.threadsContainer.classList.add('fcx-threads');

    const currentBoard = document.querySelector('#labelBoard')?.textContent.replace(/\//g, '');
    const boards = banisher.boards.value?.split(',') || [''];
    if (!boards.includes(currentBoard)) return;

    const minCharacters = banisher.minimumCharacters.value || 0;
    const banishTerms = banisher.banishTerms.value?.split('\n') || [];
    const banishAnchored = banisher.banishAnchored.value;
    const wlCyclical = banisher.whitelistCyclical.value;
    const wlReplyCount = parseInt(banisher.whitelistReplyCount.value);

    const banishSorter = (thread) => {
      if (thread.querySelector('.pinIndicator') || thread.classList.contains('fcx-sorted')) return;
      let shouldBanish = false;

      const isAnchored = thread.querySelector('.bumpLockIndicator');
      const isCyclical = thread.querySelector('.cyclicIndicator');
      const replyCount = parseInt(thread.querySelector('.labelReplies')?.textContent?.trim()) || 0;
      const threadSubject = thread.querySelector('.labelSubject')?.textContent?.trim() || '';
      const threadMessage = thread.querySelector('.divMessage')?.textContent?.trim() || '';
      const threadContent = threadSubject + ' ' + threadMessage;

      const hasMinChars = threadMessage.length > minCharacters;
      const hasWlReplyCount = replyCount > wlReplyCount;

      if (!hasMinChars) shouldBanish = true;
      if (isAnchored && banishAnchored) shouldBanish = true;
      if (isCyclical && wlCyclical) shouldBanish = false;
      if (hasWlReplyCount) shouldBanish = false;

      // run heavy regex process only if needed
      if (!shouldBanish && this.checkRegexList(threadContent, banishTerms)) shouldBanish = true;
      if (shouldBanish) thread.classList.add('shit-thread');
      thread.classList.add('fcx-sorted');
    };

    const banishThreads = () => {
      this.threads = this.threadsContainer.querySelectorAll('.catalogCell');
      this.threads.forEach(thread => banishSorter(thread));
    };
    banishThreads();

    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          banishThreads();
          break;
        }
      }
    });

    observer.observe(this.threadsContainer, { childList: true });
  }

  handleBoardLinks() {
    const navBoards = document.querySelector('#navTopBoardsSpan');
    const customBoardLinks = this.customBoardLinks?.toLowerCase().replace(/\s/g, '').split(',');
    console.log(customBoardLinks);
    let hideDefaultBoards = this.hideDefaultBoards?.toLowerCase().replace(/\s/g, '') || '';
    const urlCatalog = this.catalogBoardLinks ? '/catalog.html' : '';

    if (hideDefaultBoards === 'all') {
      document.body.classList.add('fcx-hide-navboard');
    } else {
      const waitForNavBoards = setInterval(() => {
        const navBoards = document.querySelector('#navTopBoardsSpan');
        if (!navBoards || !navBoards.querySelector('a')) return;

        clearInterval(waitForNavBoards);

        hideDefaultBoards = hideDefaultBoards.split(',');
        const defaultLinks = [...navBoards.querySelectorAll('a')];
        defaultLinks.forEach(link => {
          link.href += urlCatalog;
          const linkText = link.textContent;
          const shouldHide = hideDefaultBoards.includes(linkText) || customBoardLinks.includes(linkText);
          link.classList.toggle('fcx-hidden', shouldHide);
        });
      }, 50);

      if (this.customBoardLinks?.length > 0) {
        const customNav = document.createElement('span');
        customNav.classList = 'nav-boards nav-boards--custom';
        customNav.innerHTML = '<span>[</span>';

        customBoardLinks.forEach((board, index) => {
          const link = document.createElement('a');
          link.href = '/' + board + urlCatalog;
          link.textContent = board;
          customNav.appendChild(link);
          if (index < customBoardLinks.length - 1) customNav.innerHTML += '<span>/</span>';
        });

        customNav.innerHTML += '<span>]</span>';
        navBoards?.parentNode.insertBefore(customNav, navBoards);
      }
    }
  }

  observers() {
    this.postOrderSelect.addEventListener('change', (event) => {
      this.postOrder = event.target.value;
      this.assignPostOrder();
    });

    // Thread click
    this.threadParent.addEventListener('click', event => this.handleClick(event));

    // Your (You)s
    const observerCallback = (mutationsList, observer) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
          this.posts = [...this.thread.querySelectorAll('.postCell')];
          if (this.postOrder !== 'default') this.assignPostOrder();
          this.updateYous();
          this.gallery.updateGalleryImages();
          if (this.settings.enableFileExtensions) this.handleTruncatedFilenames();
        }
      }
    };
    const threadObserver = new MutationObserver(observerCallback);
    threadObserver.observe(this.thread, { childList: true, subtree: false });

    // Gallery
    this.galleryButton.addEventListener('click', () => this.gallery.open());
    this.myYousLabel.addEventListener('click', (event) => {
      if (this.myYousLabel.classList.contains('fcx-unseen')) {
        this.yousContainer.querySelector('.fcx-unseen').click();
      }
    });

    if (!this.enableEnhancedReplies) return;
    const setReplyLocation = (replyPreview) => {
      const parent = replyPreview.parentElement;
      if (!parent || (!parent.classList.contains('innerPost') && !parent.classList.contains('innerOP'))) return;
      if (parent.querySelector('.postInfo .panelBacklinks').style.display === 'none') return;
      const parentMessage = parent.querySelector('.divMessage');

      if (parentMessage && parentMessage.parentElement === parent) {
        parentMessage.insertAdjacentElement('beforebegin', replyPreview);
      }
    };

    const observer = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType !== 1) continue;

          if (node.classList.contains('.inlineQuote')) {
            const replyPreview = node.closest('.replyPreview');
            if (replyPreview) {
              setReplyLocation(replyPreview);
            }
          }
        }
      }
    });

    if (this.threadParent) observer.observe(this.threadParent, { childList: true, subtree: true });
  }

  handleClick(event) {
    const clicked = event.target;
    let replyLink = clicked.closest('.panelBacklinks a');
    const parentPost = clicked.closest('.innerPost, .innerOP');
    const closeButton = clicked.closest('.postInfo > a:first-child');
    const anonId = clicked.closest('.labelId');
    const addMascotButton = clicked.closest('.sizeLabel');

    if (closeButton) this.handleReplyCloseClick(closeButton, parentPost);
    if (replyLink) this.handleReplyClick(replyLink, parentPost);
    if (anonId && this.enableIdPostList) this.handleAnonIdClick(anonId, event);
    if (addMascotButton) this.handleAddMascotClick(addMascotButton, event);
  }

  handleAddMascotClick(button, event) {
    event.preventDefault();
    try {
      const parentEl = button.closest('.uploadDetails');

      if (!parentEl) return;
      const linkEl = parentEl.querySelector('.originalNameLink');
      const imageUrl = linkEl.href;
      const imageName = linkEl.textContent;

      this.settingsEl.addMascotFromPost(imageUrl, imageName, button);
    } catch (error) {
      console.log(error);
    }
  }

  handleReplyCloseClick(closeButton, parentPost) {
    const replyLink = document.querySelector(`[data-close-id="${closeButton.id}"]`);
    if (!replyLink) return;
    const linkParent = replyLink.closest('.innerPost, .innerOP');
    this.handleReplyClick(replyLink, linkParent);
  }

  handleReplyClick(replyLink, parentPost) {
    replyLink.classList.toggle('fcx-active');
    let replyColor = replyLink.dataset.color;
    const replyId = replyLink.href.split('#').pop();
    let replyPost = false;
    let labelId = false;

    const randomNum = () => `${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;

    if (!replyColor) {
      replyPost = document.querySelector(`#${CSS.escape(replyId)}`);
      labelId = replyPost?.querySelector('.labelId');
      replyColor = labelId?.textContent || randomNum();
      if (labelId) replyLink.dataset.hasId = true;
    }

    const linkQuote = [...parentPost.querySelectorAll('.replyPreview .linkQuote')]
      .find(link => link.textContent === replyId);
    if (!labelId && !replyLink.dataset.hasId) {
      linkQuote.style = `--active-color: #${replyColor};`;
      linkQuote.classList.add('fcx-active-color');
    }

    const closeId = randomNum();
    const closeButton = linkQuote?.closest('.innerPost').querySelector('.postInfo > a:first-child');
    if (closeButton) closeButton.id = closeId;

    replyLink.style = `--active-color: #${replyColor};`;
    replyLink.dataset.color = `${replyColor}`;
    replyLink.dataset.closeId = closeId;
  }

  handleAnonIdClick(anonId, event) {
    this.anonIdPosts?.remove();
    if (anonId === this.anonId) {
      this.anonId = null;
      return;
    }

    this.anonId = anonId;
    const anonIdText = anonId.textContent.substr(0, 6);
    this.anonIdPosts = document.createElement('div');
    this.anonIdPosts.classList = 'fcx-id-posts fcx-prevent-nesting';

    const match = window.location.pathname.match(/^\/[^/]+\/res\/\d+\.html/);
    const prepend = match ? `${match[0]}#` : '';

    const selector = `.postInfo:has(.labelId[style="background-color: #${anonIdText}"]) .linkQuote`;

    const match2 = prepend.match(/^\/([^\/]+)\/res\/(\d+)\.html/);

    const board = match2[1];
    const thread = match2[2];

    const postIds = [...this.threadParent.querySelectorAll(selector)].map(link => {
      const postId = link.getAttribute('href').split('#q').pop();
      const newLink = document.createElement('a');
      newLink.className = 'backLink postLink';
      newLink.href = prepend + postId;
      newLink.textContent = `>>${postId}`;

      newLink.dataset.targetUri = `${board}/${thread}#${postId}`;
      return newLink;
    });

    postIds.forEach(postId => this.anonIdPosts.appendChild(postId));
    anonId.insertAdjacentElement('afterend', this.anonIdPosts);

    this.setPostListeners(this.anonIdPosts);
  }

  setPostListeners(parentPost) {
    const postLinks = [...parentPost.querySelectorAll('.quoteLink')];

    const hoverPost = (event, link) => {
      const quoteId = link.href.split('#')[1];

      let existingPost = document.querySelector(`.nestedPost[data-quote-id="${quoteId}"]`)
        || link.closest(`.postCell[id="${quoteId}"]`);

      if (existingPost) {
        this.markedPost = existingPost.querySelector('.innerPost') || existingPost.querySelector('.innerOP');
        this.markedPost?.classList.add('markedPost');
        return;
      }

      const quotePost = document.getElementById(quoteId);

      //tooltips.removeIfExists();

      const tooltip = document.createElement('div');
      tooltip.className = 'quoteTooltip';
      document.body.appendChild(tooltip);

      const rect = link.getBoundingClientRect();
      if (!api.mobile) {
        if (rect.left > window.innerWidth / 2) {
          const right = window.innerWidth - rect.left - window.scrollX;
          tooltip.style.right = `${right}px`;
        } else {
          const left = rect.right + 10 + window.scrollX;
          tooltip.style.left = `${left}px`;
        }
      }

      tooltip.style.top = `${rect.top + window.scrollY}px`;
      tooltip.style.display = 'inline';

      tooltips.loadTooltip(tooltip, link.href, quoteId);
      tooltips.currentTooltip = tooltip;
    };

    const unHoverPost = (event, link) => {
      if (!tooltips.currentTooltip) {
        this.markedPost?.classList.remove('markedPost');
        return false;
      }

      if (tooltips.unmarkReply) {
        tooltips.currentTooltip.classList.remove('markedPost');
        Array.from(tooltips.currentTooltip.getElementsByClassName('.replyUnderline'))
          .forEach((a) => a.classList.remove('.replyUnderline'));
        tooltips.unmarkReply = false;
      } else {
        tooltips.currentTooltip.remove();
      }

      tooltips.currentTooltip = null;
    };

    const addHoverPost = (link => {
      link.addEventListener('mouseenter', (event) => tooltips.hoverHandler(link));
      //link.addEventListener('mouseleave', (event) => unHoverPost(event, link));
    });

    postLinks.forEach(link => addHoverPost(link));
  }

  handleTruncatedFilenames() {
    this.postFileNames = [...this.threadParent.querySelectorAll('.originalNameLink[download]:not([data-file-ext])')];
    this.postFileNames.forEach(fileName => {
      if (!fileName.textContent.includes('.')) return;
      const strings = fileName.textContent.split('.');
      const typeStr = `.${strings.pop()}`;
      const typeEl = document.createElement('a');
      typeEl.classList = ('file-ext originalNameLink');
      typeEl.textContent = typeStr;
      fileName.dataset.fileExt = typeStr;
      fileName.textContent = strings.join('.');
      fileName.parentNode.insertBefore(typeEl, fileName.nextSibling);
    });
  }

  assignPostOrder() {
    const postOrderReplies = (post) => {
      const replyCount = post.querySelectorAll('.panelBacklinks a').length;
      post.style.order = 100 - replyCount;
    };

    const postOrderCatbox = (post) => {
      const postContent = post.querySelector('.divMessage').textContent;
      const matches = postContent.match(/catbox\.moe/g);
      const catboxCount = matches ? matches.length : 0;
      post.style.order = 100 - catboxCount;
    };

    if (this.postOrder === 'default') {
      this.thread.style.display = 'block';
      return;
    }

    this.thread.style.display = 'flex';

    if (this.postOrder === 'replies') {
      this.posts.forEach(post => postOrderReplies(post));
    } else if (this.postOrder === 'catbox') {
      this.posts.forEach(post => postOrderCatbox(post));
    }
  }

  updateYous() {
    const yousSelector = (this.showYourPostsInMyYousList) ? '.yourPost .linkQuote, .quoteLink.you' : '.quotesYou:not(.yourPost) .quoteLink.you';
    this.yous = this.posts.filter(post => post.querySelector(yousSelector));
    this.yousLinks = this.yous.map(you => {
      const youLink = document.createElement('a');
      youLink.innerHTML = '>>' + you.id;
      if(this.showYourPostsInMyYousList) {
        const yourPost = you.querySelector('.youName');
        youLink.innerHTML = (yourPost) ? youLink.innerHTML + '&nbsp;(you)' : youLink.innerHTML + '&nbsp;(reply)';
      }
      youLink.href = '#' + you.id;
      return youLink;
    });

    let hasUnseenYous = false;
    this.setUnseenYous();
    this.markAllYourPostsAsSeen();

    this.yousContainer.innerHTML = '';
    this.yousLinks.forEach(you => {
      const youId = you.href.split('#')[1];
      if (!this.seenYous.includes(youId)) {
        you.classList.add('fcx-unseen');
        hasUnseenYous = true;
      }
      this.yousContainer.appendChild(you);
    });

    this.myYousLabel.classList.toggle('fcx-unseen', hasUnseenYous);

    if (this.replyTabIcon === '') return;
    const icon = this.replyTabIcon;
    document.title = hasUnseenYous
      ? document.title.startsWith(`${icon} `)
        ? document.title
        : `${icon} ${document.title}`
      : document.title.replace(new RegExp(`^${icon} `), '');
  }

  observeUnseenYou(you) {
    you.classList.add('fcx-observe-you');

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = you.id;
          you.classList.remove('fcx-observe-you');

          if (!this.seenYous.includes(id)) {
            this.seenYous.push(id);
            localStorage.setItem(this.seenKey, JSON.stringify(this.seenYous));
          }

          observer.unobserve(you);
          this.updateYous();
        }
      });
    }, { rootMargin: '0px', threshold: 0.001 });

    observer.observe(you);
  }

  setUnseenYous() {
    this.seenKey = `${this.threadId}-seen-yous`;
    this.seenYous = JSON.parse(localStorage.getItem(this.seenKey));

    if (!this.seenYous) {
      this.seenYous = [];
      localStorage.setItem(this.seenKey, JSON.stringify(this.seenYous));
    }

    this.unseenYous = this.yous.filter(you => !this.seenYous.includes(you.id));

    this.unseenYous.forEach(you => {
      if (!you.classList.contains('fcx-observe-you')) {
        this.observeUnseenYou(you);
      }
    });
  }

  markAllYourPostsAsSeen() {
    const allYourPosts = this.posts.filter(post => post.querySelector('.yourPost .linkQuote'));

    // Add all your post IDs to seenYous
    allYourPosts.forEach(post => {
      const postId = post.id;
      if (!this.seenYous.includes(postId)) {
        this.seenYous.push(postId);
      }
    });

    localStorage.setItem(this.seenKey, JSON.stringify(this.seenYous));
  }

  showMascot(mascotData) {
    let mascot = null;

    if (mascotData) {
      mascot = mascotData;
    } else {
      const mascotList = this.settingsEl?.savedMascots
        .filter(mascot => mascot.enabled);
      if (!mascotList || mascotList.length === 0) return;
      mascot = mascotList[Math.floor(Math.random() * mascotList.length)];
    }

    if (!mascot.image) return;

    if (!this.mascotEl) {
      this.mascotEl = document.createElement('img');
      this.mascotEl.classList.add('fcx-mascot');
      document.body.appendChild(this.mascotEl);
    }

    this.mascotEl.style = "";
    this.mascotEl.src = mascot.image;
    this.mascotEl.style.opacity = this.settingsMascot.opacity * 0.01;

    if (mascot.top) this.mascotEl.style.top = mascot.top;
    if (mascot.left) this.mascotEl.style.left = mascot.left;
    if (mascot.right) this.mascotEl.style.right = mascot.right;
    if (mascot.bottom) this.mascotEl.style.bottom = mascot.bottom;

    if (mascot.width) this.mascotEl.style.width = mascot.width;
    if (mascot.height) this.mascotEl.style.height = mascot.height;
    if (mascot.flipImage) this.mascotEl.style.transform = 'scaleX(-1)';
  }
}

class FullChanXSettings {
  constructor() {
    this.element = null;
    this.settingsKey = 'fullchan-x-settings';
    this.mascotKey = 'fullchan-x-mascots';
    this.inputs = [];
    this.settings = {};
    this.settingsTemplate = {
      main: {
        moveToNav: {
          info: 'Move Fullchan-X controls into the navbar.',
          type: 'checkbox',
          value: true
        },
        enableHeaderMenu: {
          info: "Replaces popup settings in header with dropdown menu",
          type: 'checkbox',
          value: false
        },
        enableEnhancedReplies: {
          info: "Enhances 8chan's native reply post previews.<p>Inline replies are now a <b>native feature</b> of 8chan, remember to enable them.</p>",
          type: 'checkbox',
          value: false
        },
        enableIconBacklinks: {
          info: "Display reply backlinks as icons.",
          type: 'checkbox',
          value: false
        },
        hideDeletionBox: {
          info: "Not much point in seeing this if you're not an mod.",
          type: 'checkbox',
          value: false
        },
        enableIdPostList: {
          info: "Show list of posts when clicking an ID.",
          type: 'checkbox',
          value: true
        },
        doNotShowLocation: {
          info: "Board with location option will be set to false by default.",
          type: 'checkbox',
          value: false
        },
        enableFileExtensions: {
          info: 'Always show filetype on shortened file names.',
          type: 'checkbox',
          value: true
        },
        showYourPostsInMyYousList: {
          info: 'Includes your own posts alongside replies to your posts in the "yous" list.',
          type: 'checkbox',
          value: false
        },
        customBoardLinks: {
          info: 'List of custom boards in nav (seperate by comma)',
          type: 'input',
          value: 'v,a,b'
        },
        hideDefaultBoards: {
          info: 'List of boards to remove from nav (seperate by comma). Set as "all" to remove all.',
          type: 'input',
          value: 'interracial,mlp'
        },
        catalogBoardLinks: {
          info: 'Redirect nav board links to catalog pages.',
          type: 'checkbox',
          value: true
        },
        uiTopPosition: {
          info: 'Position from top of screen e.g. 100px',
          type: 'input',
          value: '50px'
        },
        uiRightPosition: {
          info: 'Position from right of screen e.g. 100px',
          type: 'input',
          value: '25px'
        },
        uiDimWhenInactive: {
          info: 'Dim UI when not hovering with mouse.',
          type: 'checkbox',
          value: true
        },
        hideNavbar: {
          info: 'Hide navbar until hover.',
          type: 'checkbox',
          value: false
        },
        replyTabIcon: {
          info: 'Set the icon/text added to tab title when you get a new (You).',
          type: 'input',
          value: '❗'
        }
      },
      mascot: {
        enableMascot: {
          info: 'Enable mascot image.',
          type: 'checkbox',
          value: false
        },
        enableMascotAddButtons: {
          info: 'Add mascots-add button to post images.',
          type: 'checkbox',
          value: false
        },
        opacity: {
          info: 'Opacity (1 to 100)',
          type: 'input',
          inputType: 'number',
          value: '75'
        }
      },
      mascotImage: {
        id: {
          type: 'input',
          value: '',
        },
        enabled: {
          info: 'Enable this mascot.',
          type: 'checkbox',
          value: true
        },
        name: {
          info: 'Descriptive name',
          type: 'input',
          value: 'New Mascot'
        },
        image: {
          info: 'Image URL (8chan image recommended).',
          type: 'input',
          value: '/.static/logo.png'
        },
        flipImage: {
          info: 'Mirror the mascot image.',
          type: 'checkbox',
          value: false
        },
        width: {
          info: 'Width of image.',
          type: 'input',
          value: '300px'
        },
        height: {
          info: 'Height of image.',
          type: 'input',
          value: 'auto'
        },
        bottom: {
          info: 'Bottom position.',
          type: 'input',
          value: '0px'
        },
        right: {
          info: 'Right position.',
          type: 'input',
          value: '0px'
        },
        top: {
          info: 'Top position.',
          type: 'input',
          value: ''
        },
        left: {
          info: 'Left position.',
          type: 'input',
          value: ''
        }
      },
      threadBanisher: {
        enableThreadBanisher: {
          info: 'Banish shit threads to the bottom of the calalog.',
          type: 'checkbox',
          value: true
        },
        boards: {
          info: 'Banish theads on these boards (seperated by comma).',
          type: 'input',
          value: 'v,a'
        },
        minimumCharacters: {
          info: 'Minimum character requirements',
          type: 'input',
          inputType: 'number',
          value: 100
        },
        banishTerms: {
          info: `<p>Banish threads with these terms to the bottom of the catalog (new line per term).</p>
                <p>How to use regex: <a href="https://www.datacamp.com/cheat-sheet/regular-expresso" target="__blank">Regex Cheatsheet</a>.</p>
                <p>NOTE: word breaks (\\b) MUST be entered as double escapes (\\\\b), they will appear as (\\b) when saved.</p>
          `,
          type: 'textarea',
          value: '/\\bcuck\\b/i\n/\\bchud\\b/i\n/\\bblacked\\b/i\n/\\bnormie\\b/i\n/\\bincel\\b/i\n/\\btranny\\b/i\n/\\bslop\\b/i\n'
        },
        whitelistCyclical: {
          info: 'Whitelist cyclical threads.',
          type: 'checkbox',
          value: true
        },
        banishAnchored: {
          info: 'Banish anchored threads that are under minimum reply count.',
          type: 'checkbox',
          value: true
        },
        whitelistReplyCount: {
          info: 'Threads above this reply count (excluding those with banish terms) will be whitelisted.',
          type: 'input',
          inputType: 'number',
          value: 100
        },
      },
      defaultMascot: {
        enabled: true,
        id: '',
        name: 'New Mascot',
        image: '/.static/logo.png',
        flipImage: false,
        width: '300px',
        height: 'auto',
        bottom: '0px',
        right: '0px',
        top: '',
        left: '',
      }
    };
  }

  async init() {
    this.element = document.querySelector('fullchan-x-settings');
    this.fcx = window.fullChanX;
    this.settingsMainEl = this.element.querySelector('.fcxs-main');
    this.settingsThreadBanisherEl = this.element.querySelector('.fcxs-thread-banisher');
    this.settingsMascotEl = this.element.querySelector('.fcxs-mascot-settings');
    this.mascotListEl = this.element.querySelector('.fcxs-mascot-list');
    this.mascotSettingsTemplate = { ...this.settingsTemplate.mascotImage };
    this.currentMascotSettings = { ...this.settingsTemplate.defaultMascot };

    this.addMascotEl = this.element.querySelector('.fcxs-add-mascot-settings');
    this.saveMascotButton = this.element.querySelector('.fcxs-save-mascot');

    await this.getSavedSettings();
    await this.getSavedMascots();

    if (this.settings.main) {
      window.fullChanX.init();
      this.loaded = true;
    }

    this.buildSettingsOptions('main', 'settings', this.settingsMainEl);
    this.buildSettingsOptions('threadBanisher', 'settings', this.settingsThreadBanisherEl);
    this.buildSettingsOptions('mascot', 'settings', this.settingsMascotEl);
    this.buildSettingsOptions('mascotImage', 'mascotSettingsTemplate', this.addMascotEl);

    this.listeners();
    this.element.querySelector('.fcx-settings__close').addEventListener('click', () => this.close());

    document.body.classList.toggle('fcx-add-mascot-button', this.settings.mascot.enableMascotAddButtons);

    if (!this.loaded) window.fullChanX.init();
  }

  getRandomId() {
    return `id${Math.random().toString(36).substring(2, 8)}`;
  }

  async setSavedSettings(settingsKey, status) {
    console.log("SAVING", this.settings);
    await GM.setValue(settingsKey, JSON.stringify(this.settings));
    if (status === 'updated') this.element.classList.add('fcxs-updated');
  }

  async getSavedSettings() {
    let saved = JSON.parse(await GM.getValue(this.settingsKey, 'null'));

    if (!saved) {
      const localSaved = JSON.parse(localStorage.getItem(this.settingsKey));
      if (localSaved) {
        saved = localSaved;
        await GM.setValue(this.settingsKey, JSON.stringify(saved));
        localStorage.removeItem(this.settingsKey);
        console.log('[Fullchan-X] Migrated settings from localStorage to GM storage.');
      }
    }

    if (!saved) return;

    let migrated = false;
    for (const [sectionKey, sectionTemplate] of Object.entries(this.settingsTemplate)) {
      if (!saved[sectionKey]) {
        saved[sectionKey] = {};
      }
      for (const [key, defaultConfig] of Object.entries(sectionTemplate)) {
        if (saved[sectionKey][key] && typeof saved[sectionKey][key] === 'object' && 'value' in saved[sectionKey][key]) {
          // Old format detected, migrating it
          saved[sectionKey][key] = saved[sectionKey][key].value;
          migrated = true;
        }
      }
    }

    this.settings = saved;
    if (migrated) {
      console.log('[Fullchan-X] Migrated old settings to new format.');
      this.setSavedSettings(this.settingsKey, 'migrated');
    }

    console.log('SAVED SETTINGS:', this.settings);
  }

  async updateSavedMascot(mascot, status = 'updated') {
    const index = this.savedMascots.findIndex(objectMascot => objectMascot.id === mascot.id);
    if (index !== -1) {
      this.savedMascots[index] = mascot;
    } else {
      this.savedMascots.push(mascot);
    }
    await GM.setValue(this.mascotKey, JSON.stringify(this.savedMascots));
    this.element.classList.add(`fcxs-mascot-${status}`);
  }

  async getSavedMascots() {
    let savedMascots = JSON.parse(await GM.getValue(this.mascotKey, 'null'));

    if (!savedMascots) {
      const localSaved = JSON.parse(localStorage.getItem(this.mascotKey));
      if (localSaved) {
        savedMascots = localSaved;
        await GM.setValue(this.mascotKey, JSON.stringify(savedMascots));
        localStorage.removeItem(this.mascotKey);
        console.log('[Fullchan-X] Migrated mascots from localStorage to GM storage.');
      }
    }

    if (!(savedMascots?.length > 0)) {
      savedMascots = [
        {
          ...this.settingsTemplate.defaultMascot,
          name: 'Vivian',
          id: 'id0',
          image: '/.media/4283cdb87bc82b2617509306c6a50bd9d6d015f727f931fb4969b499508e2e7e.webp'
        }
      ];
    }

    this.savedMascots = savedMascots;
    this.savedMascots.forEach(mascot => this.addMascotCard(mascot));
  }

  addMascotCard(mascot, replaceId) {
    const card = document.createElement('div');
    card.classList = `fcxs-mascot-card${mascot.enabled ? '' : ' fcxs-mascot-card--disabled'}`;
    card.id = mascot.id;
    card.innerHTML = `
      <img src="${mascot.image}" loading="lazy">
      <div class="fcxs-mascot-card__name">
        <span>${mascot.name}</span>
      </div>
      <div class="fcxs-mascot-card__buttons">
        <button class="fcxs-mascot-card__button" name="edit">Edit</button>
        <button class="fcxs-mascot-card__button" name="delete">Delete</button>
      </div>
    `;
    if (replaceId) {
      const oldCard = this.mascotListEl.querySelector(`#${replaceId}`);
      if (oldCard) {
        this.mascotListEl.replaceChild(card, oldCard);
        return;
      }
    }
    this.mascotListEl.appendChild(card);
  }

  addMascotFromPost(imageUrl, imageName, fakeButtonEl) {
    const acceptedTypes = ['jpeg', 'jpg', 'gif', 'png', 'webp'];
    const noneTransparentTypes = ['jpeg', 'jpg'];
    const fileType = imageUrl.split('.').pop().toLowerCase();

    if (!acceptedTypes.includes(fileType)) {
      window.alert('This file type cannot be used as a mascot.');
      return;
    }

    try {
      const mascotUrl = imageUrl.includes('/.media/')
        ? '/.media/' + imageUrl.split('/.media/')[1]
        : imageUrl;

      this.currentMascotSettings = {
        ...this.settingsTemplate.defaultMascot,
        image: mascotUrl,
        name: imageName
      };

      this.handleSaveMascot();
      fakeButtonEl.classList.add('mascotAdded');

      if (noneTransparentTypes.includes(fileType)) {
        window.alert('Mascot added, but this file type does not support transparency.');
      }
    } catch (error) {
      console.error('Error adding mascot:', error);
      window.alert('Failed to add mascot. Please try again.');
    }
  }

  async handleSaveMascot(event) {
    const mascot = { ...this.currentMascotSettings };
    if (!mascot.id) mascot.id = this.getRandomId();
    const index = this.savedMascots.findIndex(m => m.id === mascot.id);

    if (index !== -1) {
      this.savedMascots[index] = mascot;
      this.addMascotCard(mascot, mascot.id);
    } else {
      this.savedMascots.push(mascot);
      this.addMascotCard(mascot);
    }

    await GM.setValue(this.mascotKey, JSON.stringify(this.savedMascots));
    this.element.classList.remove('fcxs--mascot-modal');
  }

  async handleMascotClick(clicked, event) {
    const mascotEl = clicked.closest('.fcxs-mascot-card');
    if (!mascotEl) return;
    const mascotId = mascotEl.id;
    const mascot = this.savedMascots.find(m => m.id === mascotId);
    const button = clicked.closest('.fcxs-mascot-card__button');
    const mascotTitle = clicked.closest('.fcxs-mascot-card__name');
    const mascotImg = clicked.closest('img');

    if (mascotTitle) {
      this.fcx.showMascot(mascot);
    } else if (mascotImg) {
      const updatedMascot = { ...mascot, enabled: !mascot.enabled };
      this.currentMascotSettings = { ...updatedMascot };
      this.handleSaveMascot();
      this.addMascotCard(updatedMascot, mascotId);
    } else if (button) {
      const buttonType = button.name;
      if (buttonType === 'delete') {
        this.savedMascots = this.savedMascots.filter(m => m.id !== mascotId);
        await GM.setValue(this.mascotKey, JSON.stringify(this.savedMascots));
        mascotEl.remove();
      } else if (buttonType === 'edit') {
        if (!mascot) return;
        this.element.classList.add('fcxs--mascot-modal');
        this.saveMascotButton.disabled = true;
        this.currentMascotSettings = { ...mascot };
        for (const key of Object.keys(this.currentMascotSettings)) {
          if (mascot[key] !== undefined) {
            const input = this.addMascotEl.querySelector(`[name="${key}"]`);
            if (input) {
              if (input.type === 'checkbox') {
                input.checked = mascot[key];
              } else {
                input.value = mascot[key];
              }
            }
          }
        }
      }
    }
  }

  handleClick(event) {
    const clicked = event.target;
    if (clicked.closest('.fcxs-mascot-card')) this.handleMascotClick(clicked, event);
    if (clicked.closest('.fcxs-close-mascot')) this.element.classList.remove('fcxs--mascot-modal');

    if (clicked.closest('.fcxs-mascot__new')) {
      this.currentMascotSettings = { ...this.settingsTemplate.defaultMascot };
      const mascot = this.currentMascotSettings;
      for (const key of Object.keys(this.currentMascotSettings)) {
        if (mascot[key] !== undefined) {
          const input = this.addMascotEl.querySelector(`[name="${key}"]`);
          if (input) {
            if (input.type === 'checkbox') {
              input.checked = mascot[key];
            } else {
              input.value = mascot[key];
            }
          }
        }
        this.element.classList.add('fcxs--mascot-modal');
        this.saveMascotButton.disabled = true;
      }
    }
  }

  listeners() {
    this.saveMascotButton.addEventListener('click', event => this.handleSaveMascot(event));
    this.element.addEventListener('click', event => this.handleClick(event));

    this.inputs.forEach(input => {
      input.addEventListener('change', () => {
        const settingsKey = input.dataset.settingsKey;
        if (settingsKey === 'mascotImage') {
          const value = input.type === 'checkbox' ? input.checked : input.value;
          this.currentMascotSettings[input.name] = value;
          this.saveMascotButton.disabled = false;
          this.fcx.showMascot(this.currentMascotSettings);
          return;
        }

        const settingsObject = this.settings[settingsKey];
        const key = input.name;
        const value = input.type === 'checkbox' ? input.checked : input.value;

        settingsObject[key] = value;
        this.setSavedSettings(this.settingsKey, 'updated');
      });
    });
  }

  buildSettingsOptions(settingsKey, parentKey, parent) {
    if (!parent) return;

    if (!this[parentKey][settingsKey]) this[parentKey][settingsKey] = { ...this.settingsTemplate[settingsKey] };
    const settingsObject = this[parentKey][settingsKey];

    Object.entries(this.settingsTemplate[settingsKey]).forEach(([key, config]) => {
      if (typeof settingsObject[key] === 'undefined') {
        settingsObject[key] = config.value ?? '';
      }

      const wrapper = document.createElement('div');
      const infoWrapper = document.createElement('div');
      wrapper.classList = (`fcx-setting fcx-setting--${key}`);
      infoWrapper.classList.add('fcx-setting__info');
      wrapper.appendChild(infoWrapper);

      const label = document.createElement('label');
      label.textContent = key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase());
      label.setAttribute('for', key);
      infoWrapper.appendChild(label);

      if (config.info) {
        const info = document.createElement('p');
        info.innerHTML = config.info;
        infoWrapper.appendChild(info);
      }

      let savedValue = settingsObject[key].value ?? settingsObject[key] ?? config.value;
      if (settingsObject[key]?.value) savedValue = settingsObject[key].value;

      let input;

      if (config.type === 'checkbox') {
        input = document.createElement('input');
        input.type = 'checkbox';
        input.checked = savedValue;
      } else if (config.type === 'textarea') {
        input = document.createElement('textarea');
        input.value = savedValue;
      } else if (config.type === 'input') {
        input = document.createElement('input');
        input.type = config.inputType || 'text';
        input.value = savedValue;
      } else if (config.type === 'select' && config.options) {
        input = document.createElement('select');
        const options = config.options.split(',');
        options.forEach(opt => {
          const option = document.createElement('option');
          option.value = opt;
          option.textContent = opt;
          if (opt === savedValue) option.selected = true;
          input.appendChild(option);
        });
      }

      if (input) {
        input.id = key;
        input.name = key;
        input.dataset.settingsKey = settingsKey;
        wrapper.appendChild(input);
        this.inputs.push(input);
        settingsObject[key] = input.type === 'checkbox' ? input.checked : input.value;
      }

      parent.appendChild(wrapper);
    });
  }

  open() {
    this.element.classList.add('open');
  }

  close() {
    this.element.classList.remove('open');
  }

  toggle() {
    this.element.classList.toggle('open');
  }
}

class FullChanXGallery {
  constructor() {
    this.element = null;
  }

  init() {
    this.element = document.querySelector('fullchan-x-gallery');
    this.fullchanX = window.fullChanX;
    this.imageContainer = this.element.querySelector('.gallery__images');
    this.mainImageContainer = this.element.querySelector('.gallery__main-image');
    this.mainImage = this.mainImageContainer.querySelector('img');
    this.sizeButtons = [...this.element.querySelectorAll('.gallery__scale-options .scale-option')];
    this.closeButton = this.element.querySelector('.gallery__close');
    this.listeners();
    this.addGalleryImages();
    this.initalized = true;
  }

  addGalleryImages() {
    this.thumbs = [...this.fullchanX.threadParent.querySelectorAll('.imgLink')].map(thumb => {
      return thumb.cloneNode(true);
    });

    this.thumbs.forEach(thumb => {
      this.imageContainer.appendChild(thumb);
    });
  }

  updateGalleryImages() {
    if (!this.initalized) return;

    const newThumbs = [...this.fullchanX.threadParent.querySelectorAll('.imgLink')].filter(thumb => {
      return !this.thumbs.find(thisThumb => thisThumb.href === thumb.href);
    }).map(thumb => {
      return thumb.cloneNode(true);
    });

    newThumbs.forEach(thumb => {
      this.thumbs.push(thumb);
      this.imageContainer.appendChild(thumb);
    });
  }

  listeners() {
    this.element.addEventListener('click', event => {
      const clicked = event.target;

      let imgLink = clicked.closest('.imgLink');
      if (imgLink?.dataset.filemime === 'video/webm') return;

      if (imgLink) {
        event.preventDefault();
        this.mainImage.src = imgLink.href;
      }

      this.mainImageContainer.classList.toggle('active', !!imgLink);

      const scaleButton = clicked.closest('.scale-option');
      if (scaleButton) {
        const scale = parseFloat(getComputedStyle(this.imageContainer).getPropertyValue('--scale')) || 1;
        const delta = scaleButton.id === 'fcxg-smaller' ? -0.1 : 0.1;
        const newScale = Math.max(0.1, scale + delta);
        this.imageContainer.style.setProperty('--scale', newScale.toFixed(2));
      }

      if (clicked.closest('.gallery__close')) this.close();
    });
  }

  open() {
    if (!this.initalized) this.init();
    this.element.classList.add('open');
    document.body.classList.add('fct-gallery-open');
  }

  close() {
    this.element.classList.remove('open');
    document.body.classList.remove('fct-gallery-open');
  }
}

class FullChanXHeaderMenu {
  constructor() {
    this.element = null;
  }

  init() {
    this.element = document.querySelector('fullchan-x-header-menu');
    document.body.classList.add('fcx-header-menu');
    this.menuContainer = this.element.querySelector('.fcxm__menu-container');
    this.menuButtonsContainer = this.element.querySelector('.fcxm__menu-tabs');

    this.menuIds = [
      'settingsMenu',
      'watchedMenu',
      'multiboardMenu',
    ];

    this.menuButtons = [...this.menuIds, 'helpMenu'].map(selector => {
      const menuName = selector.replace('#', '').replace('Menu', '');
      const button = document.createElement('button');
      button.dataset.target = selector;
      button.classList = `fcxm__menu-button fcxm__menu-button--${menuName}${menuName === 'settings' ? ' fcx-active' : ''}`;
      button.innerHTML = `<span>${menuName}</span>`;
      return button;
    });
    this.menuButtons.forEach(button => this.menuButtonsContainer.appendChild(button));

    this.menus = this.menuIds.map(selector => {
      return document.getElementById(selector);
    });
    this.menus[0]?.classList.add('fcx-active');

    if (!this.menus[0]) return;

    this.createHelpMenu();

    this.menus.forEach(menu => {
      this.menuContainer.appendChild(menu);
    });

    this.listeners();
  }

  listeners() {
    this.menuButtons.forEach(button => {
      button.addEventListener('mouseenter', () => this.toggleMenus(button));
    });

    this.menuTrigger = document.createElement('div');
    this.menuTrigger.classList = 'fcx-menu-trigger';
    this.mainNav = document.querySelector('#dynamicHeaderThread');
    this.mainNav.appendChild(this.menuTrigger);

    if (this.menuTrigger) {
      let hideTimeout;

      const activate = () => {
        clearTimeout(hideTimeout);
        this.element.classList.add('fcx-active');
        this.menuTrigger.classList.add('fcx-active');
      };

      const scheduleDeactivate = () => {
        hideTimeout = setTimeout(() => {
          this.element.classList.remove('fcx-active');
          this.menuTrigger.classList.remove('fcx-active');
        }, 300);
      };

      [this.menuTrigger, this.element].forEach(el => {
        console.log('el', el);
        el.addEventListener('mouseenter', activate);
        el.addEventListener('mouseleave', scheduleDeactivate);
      });
    }
  }

  toggleMenus(button) {
    const toggleElements = [...this.menuButtons, ...this.menus];
    toggleElements.forEach(el => {
      el.classList.toggle('fcx-active', el === button || el.id === button.dataset.target);
    });
  }

  async createHelpMenu() {
    this.helpMenu = document.createElement('div');
    this.helpMenu.id = "helpMenu";
    this.helpMenu.classList = 'floatingMenu';
    this.menuContainer.appendChild(this.helpMenu);
    this.menus.push(this.helpMenu);

    const response = await fetch('/.static/pages/posting.html');
    const htmlText = await response.text();
    const tempDoc = new DOMParser().parseFromString(htmlText, 'text/html');
    const titleWrapper = tempDoc.body.querySelector('.titleWrapper');
    if (titleWrapper) this.helpMenu.innerHTML = `
       <div class="fcxm__help-page-content">${titleWrapper.innerHTML}</div>
    `;
  }
}

// Initialize the application
(function() {
  'use strict';

  // Create fullchan-x header menu
  const fcxm = document.createElement('fullchan-x-header-menu');
  fcxm.innerHTML = `
    <div id="fcxm" class="fcxm">
      <div class="fcxm__menu-tabs"></div>
      <div class="fcxm__menu-container"></div>
    </div>
  `;
  document.body.appendChild(fcxm);

  // Create fullchan-x gallery
  const fcxg = document.createElement('fullchan-x-gallery');
  fcxg.innerHTML = `
    <div class="fcxg gallery">
      <button id="fcxg-close" class="gallery__close fullchan-x__option">Close</button>
      <div class="gallery__scale-options">
        <button id="fcxg-smaller" class="scale-option fullchan-x__option">-</button>
        <button id="fcxg-larger" class="scale-option fullchan-x__option">+</button>
      </div>
      <div id="fcxg-images" class="gallery__images" style="--scale:1.0"></div>
      <div id="fcxg-main-image" class="gallery__main-image">
        <img src="" />
      </div>
    </div>
  `;
  document.body.appendChild(fcxg);

  // Create fullchan-x element
  const fcx = document.createElement('fullchan-x');
  fcx.innerHTML = `
    <div class="fcx__controls">
      <button id="fcx-settings-btn" class="fullchan-x__option fcx-settings-toggle">
       <a>⚙️</a><span>Settings</span>
      </button>

      <div class="fullchan-x__option fullchan-x__sort thread-only">
        <a>☰</a>
        <select id="thread-sort">
          <option value="default">Default</option>
          <option value="replies">Replies</option>
          <option value="catbox">Catbox</option>
        </select>
      </div>

      <button id="fcx-gallery-btn" class="gallery__toggle fullchan-x__option thread-only">
        <a>🖼️</a><span>Gallery</span>
      </button>

      <div class="fcx__my-yous thread-only">
        <p class="my-yous__label fullchan-x__option"><a>💬</a><span>My (You)s</span></p>
        <div class="my-yous__yous fcx-prevent-nesting" id="my-yous"></div>
      </div>
    </div>
  `;
  (document.querySelector('.navHeader') || document.body).appendChild(fcx);

  // Create fullchan-x settings
  const fcxs = document.createElement('fullchan-x-settings');
  fcxs.innerHTML = `
    <div class="fcx-settings fcxs" data-tab="main">
      <header>
        <div class="fcxs__heading">
          <span class="fcx-settings__title">
            <img class="fcxs_logo" src="/.static/logo/logo_blue.png" height="25px" width="auto">
            <span>
              Fullchan-X Settings
            </span>
          </span>
          <button class="fcx-settings__close fullchan-x__option">Close</button>
        </div>

        <div class="fcx-settings__tab-buttons">
          <toggle-button class="fcx-toggle-button" data-target=".fcxs" data-set="tab" data-value="main">
            Main
          </toggle-button>
          <toggle-button class="fcx-toggle-button" data-target=".fcxs" data-set="tab" data-value="catalog">
            catalog
          </toggle-button>
          <toggle-button class="fcx-toggle-button" data-target=".fcxs" data-set="tab" data-value="mascot">
            Mascot
          </toggle-button>
        </div>
      </header>

      <main>
        <div class="fcxs__updated-message">
          <p>Settings updated, refresh page to apply</p>
          <button class="fcx-settings__location-reload fullchan-x__option">Reload page</button>
        </div>

        <div class="fcx-settings__settings">
          <div class="fcxs-main fcxs-tab"></div>
          <div class="fcxs-mascot fcxs-tab">
            <div class="fcxs-mascot-settings"></div>
            <div class="fcxs-mascot-list">
                <div class="fcxs-mascot__new">
                  <span>+</span>
                </div>
            </div>

            <p class="fcxs-tab__description">
              Go to <a href="/mascot/catalog.html" target="__blank">8chan.*/mascot/</a> to store or find new mascots.
            </p>
          </div>
          <div class="fcxs-catalog fcxs-tab">
            <div class="fcxs-thread-banisher"></div>
          </div>
        </div>
      </main>

      <footer>
      </footer>
    </div>

    <div class="fcxs-add-mascot">
      <button class="fcx-option fcxs-close-mascot">Close</button>
      <div class="fcxs-add-mascot-settings"></div>
      <button class="fcx-option fcxs-save-mascot" disabled>Save Mascot</button>
    </div>
  `;
  document.body.appendChild(fcxs);

  // Styles
  const style = document.createElement('style');
  style.innerHTML = `
    .fcx-hide-navboard #navTopBoardsSpan#navTopBoardsSpan#navTopBoardsSpan {
      display: none!important;
    }

    fullchan-x {
      --top: 50px;
      --right: 25px;
      background: var(--background-color);
      border: 1px solid var(--navbar-text-color);
      color: var(--link-color);
      font-size: 14px;
      z-index: 3;
    }

    toggle-button {
      cursor: pointer;
    }

    /* Fullchan-X in nav styles */
    .fcx-in-nav {
      padding: 0;
      border-width: 0;
      line-height: 20px;
      margin-right: 2px;
      background: none;
    }

    .fcx-in-nav .fcx__controls:before,
    .fcx-in-nav .fcx__controls:after {
      color: var(--navbar-text-color);
      font-size: 85%;
    }

    .fcx-in-nav .fcx__controls:before {
      content: "]";
    }

    .fcx-in-nav .fcx__controls:after {
      content: "[";
    }

    .fcx-in-nav .fcx__controls,
    .fcx-in-nav:hover .fcx__controls:hover {
      flex-direction: row-reverse;
    }

    .fcx-in-nav .fcx__controls .fullchan-x__option {
      padding: 0!important;
      justify-content: center;
      background: none;
      line-height: 0;
      max-width: 20px;
      min-width: 20px;
      translate: 0 1px;
      border: solid var(--navbar-text-color) 1px !important;
    }

    .fcx-in-nav .fcx__controls .fullchan-x__option:hover {
      border: solid var(--subject-color) 1px !important;
    }

    .fcx-in-nav .fullchan-x__sort > a {
      position: relative;
      margin-bottom: 1px;
    }

    .fcx-in-nav .fcx__controls > * {
      position: relative;
    }

    .fcx-in-nav .fcx__controls .fullchan-x__option > span,
    .fcx-in-nav .fcx__controls .fullchan-x__option:not(:hover) > select {
      display: none;
    }

    .fcx-in-nav .fcx__controls .fullchan-x__option > select {
      appearance: none;
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      font-size: 0;
    }

    .fcx-in-nav .fcx__controls .fullchan-x__option > select option {
      font-size: 12px;
    }

    .fcx-in-nav .my-yous__yous {
      position: absolute;
      left: 50%;
      translate: -50%;
      background: var(--background-color);
      border: 1px solid var(--navbar-text-color);
      padding: 14px;
    }

    .bottom-header .fcx-in-nav .my-yous__yous {
      top: 0;
      translate: -50% -100%;
    }

    /* Fullchan-X main styles */
    fullchan-x:not(.fcx-in-nav) {
      top: var(--top);
      right: var(--right);
      display: block;
      padding: 10px;
      position: fixed;
      display: block;
    }

    fullchan-x:not(.fcx-page-thread) .thread-only,
    fullchan-x:not(.fcx-page-catalog) .catalog-only {
      display: none!important;
    }

    fullchan-x:hover {
      z-index: 1000!important;
    }

    .navHeader:has(fullchan-x:hover) {
      z-index: 1000!important;
    }

    fullchan-x.fcx--dim:not(:hover) {
      opacity: 0.6;
    }

    .divPosts {
      flex-direction: column;
    }

    .fcx__controls {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    fullchan-x:not(:hover):not(:has(select:focus)) span,
    fullchan-x:not(:hover):not(:has(select:focus)) select {
      display: none;
      margin-left: 5px;
      z-index:3;
    }

    .fcx__controls span,
    .fcx__controls select {
      margin-left: 5px;
    }

    .fcx__controls select {
      cursor: pointer;
    }

    #thread-sort {
      border: none;
      background: none;
    }

    .my-yous__yous {
      display: none;
      flex-direction: column;
      padding-top: 10px;
      font-size: 8px;
      line-height: 1.6;
      max-height: calc(100vh - 220px - var(--top));
      overflow: auto;
    }

    .fcx__my-yous:hover .my-yous__yous {
      display: flex;
    }

    .fullchan-x__option,
    .fcx-option {
      display: flex;
      padding: 6px 8px;
      background: white;
      border: none !important;
      border-radius: 0.2rem;
      transition: all ease 150ms;
      cursor: pointer;
      margin: 0;
      font-weight: 400;
      text-align: left;
      min-width: 18px;
      min-height: 18px;
      align-items: center;
      color: #374369;
    }

    .fullchan-x__option,
    .fullchan-x__option select {
      font-size: 12px;
      font-weight: 400;
      color: #374369;
    }

    fullchan-x:not(:hover):not(:has(select:focus)) .fullchan-x__option {
      display: flex;
      justify-content: center;
    }

    #thread-sort {
      padding-right: 0;
    }

    #thread-sort:hover {
      display: block;
    }

    .innerPost:has(>.divMessage>.you),
    .innerPost:has(>.divMessage>*:not(div)>.you),
    .innerPost:has(>.divMessage>*:not(div)>*:not(div)>.you) {
      border-left: solid #dd003e 3px;
    }

    .innerPost.innerPost:has(>.postInfo>.youName),
    .innerOP.innerOP:has(>.postInfo>.youName) {
      border-left: solid #68b723 3px;
    }

    /* --- Nested quotes --- */
    .divMessage .nestedPost {
      display: inline-block;
      width: 100%;
      margin-bottom: 14px;
      white-space: normal!important;
      overflow-wrap: anywhere;
      margin-top: 0.5em;
      border: 1px solid var(--navbar-text-color);
    }

    .nestedPost .innerPost,
    .nestedPost .innerOP {
      width: 100%;
    }

    .nestedPost .imgLink .imgExpanded {
      width: auto!important;
      height: auto!important;
    }

    .my-yous__label.fcx-unseen {
      background: var(--link-hover-color)!important;
      color: white;
    }

    .my-yous__yous .fcx-unseen {
      font-weight: 900;
      color: var(--link-hover-color);
    }

    .panelBacklinks a.fcx-active {
      color: #dd003e;
    }

    /*--- Settings --- */
    fullchan-x-settings {
      color: var(--link-color);
      font-size: 14px;
    }

    .fcx-settings {
      display: block;
      position: fixed;
      top: 50vh;
      left: 50vw;
      translate: -50% -50%;
      padding: 0 0 20px;
      background: var(--background-color);
      border: 1px solid var(--navbar-text-color);
      border-radius: 8px;
      max-width: 480px;
      max-height: 80vh;
      overflow: auto;
      min-width: 500px;
      z-index: 1000;
    }

    .fcx-settings header {
      position: sticky;
      top: 0;
      padding-top: 20px;
      background: var(--background-color);
      z-index: 3;
    }

    fullchan-x-settings:not(.open) {
      display: none;
    }

    .fcxs__heading,
    .fcxs-tab,
    .fcxs footer {
      padding: 0 20px;
    }

    .fcx-settings header {
      margin: 0 0 15px;
      border-bottom: 1px solid var(--navbar-text-color);
    }

    .fcxs__heading {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 20px;
    }

    .fcx-settings__title {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 24px;
      font-size: 24px;
      letter-spacing: 0.04em;
    }

    .fcx-settings input[type="checkbox"] {
      cursor: pointer;
    }

    .fcxs_logo {
      .margin-top: -2px;
    }

    .fcx-settings__tab-buttons {
      border-top: 1px solid var(--navbar-text-color);
      display: flex;
      align-items: center;
    }

    .fcx-settings__tab-buttons toggle-button {
      flex: 1;
      padding: 15px;
      font-size: 14px;
    }

    .fcx-settings__tab-buttons toggle-button + toggle-button {
      border-left: 1px solid var(--navbar-text-color);
    }

    .fcx-settings__tab-buttons toggle-button:hover {
      color: var(--role-color);
    }

    fullchan-x-settings:not(.fcxs-updated) .fcxs__updated-message {
      display: none;
    }

    .fcxs:not([data-tab="main"]) .fcxs-main,
    .fcxs:not([data-tab="catalog"]) .fcxs-catalog,
    .fcxs:not([data-tab="mascot"]) .fcxs-mascot {
      display: none;
    }

    .fcxs[data-tab="main"] [data-value="main"],
    .fcxs[data-tab="catalog"] [data-value="catalog"],
    .fcxs[data-tab="mascot"] [data-value="mascot"] {
      font-weight: 700;
    }

    .fcx-setting {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
    }

    .fcx-setting__info {
      max-width: 60%;
    }

    .fcx-setting input[type="text"],
    .fcx-setting input[type="number"],
    .fcx-setting select,
    .fcx-setting textarea {
      padding: 4px 6px;
      min-width: 35%;
    }

    .fcx-setting textarea {
      min-height: 100px;
    }

    .fcx-setting label {
      font-weight: 600;
    }

    .fcx-setting p {
      margin: 6px 0 0;
      font-size: 12px;
    }

    .fcx-setting + .fcx-setting {
      border-top: 1px solid var(--navbar-text-color);
    }

    .fcxs__updated-message {
      margin: 10px 0;
      text-align: center;
    }

    .fcxs__updated-message p {
      font-size: 14px;
      color: var(--error);
    }

    .fcxs__updated-message button {
      margin: 14px auto 0;
    }

    .fcxs-tab__description {
      text-align: center;
      margin-top: 24px;
      font-size: 12px;
    }

    .fcxs-tab__description a {
      text-decoration: underline;
    }

    /* --- Gallery --- */
    .fct-gallery-open,
    body.fct-gallery-open,
    body.fct-gallery-open #mainPanel {
      overflow: hidden!important;
    }

    body.fct-gallery-open fullchan-x:not(.fcx-in-nav),
    body.fct-gallery-open #quick-reply {
      display: none!important;
    }

    fullchan-x-gallery {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      background: rgba(0,0,0,0.9);
      display: none;
      height: 100%;
      overflow: auto;
    }

    fullchan-x-gallery.open {
      display: block;
    }

    fullchan-x-gallery .gallery {
      padding: 50px 10px 0
    }

    fullchan-x-gallery .gallery__images {
      --scale: 1.0;
      display: flex;
      width: 100%;
      height: 100%;
      justify-content: center;
      align-content: flex-start;
      gap: 4px 8px;
      flex-wrap: wrap;
    }

    fullchan-x-gallery .imgLink {
      float: unset;
      display: block;
      zoom: var(--scale);
    }

    fullchan-x-gallery .imgLink img {
      border: solid white 1px;
    }

    fullchan-x-gallery .imgLink[data-filemime="video/webm"] img {
      border: solid #68b723 4px;
    }

    fullchan-x-gallery .gallery__close {
      border: solid 1px var(--background-color)!important;
      position: fixed;
      top: 60px;
      right: 35px;
      padding: 6px 14px;
      min-height: 30px;
      z-index: 10;
    }

    .fcxg .gallery__scale-options {
      position: fixed;
      bottom: 30px;
      right: 35px;
      display: flex;
      gap: 14px;
      z-index: 10;
    }

    .fcxg .gallery__scale-options .fullchan-x__option {
      border: solid 1px var(--background-color)!important;
      width: 35px;
      height: 35px;
      font-size: 18px;
      display: flex;
      justify-content: center;
    }

    .gallery__main-image {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      justify-content: center;
      align-content: center;
      background: rgba(0,0,0,0.5);
    }

    .gallery__main-image img {
      padding: 40px 10px 15px;
      height: auto;
      max-width: calc(100% - 20px);
      object-fit: contain;
    }

    .gallery__main-image.active {
      display: flex;
    }

    /*-- Truncated file extentions --*/
    .originalNameLink[data-file-ext] {
      display: inline-block;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      max-width: 65px;
    }

    .originalNameLink[data-file-ext]:hover {
      max-width: unset;
      white-space: normal;
      display: inline;
    }

    a[data-file-ext]:hover:after {
      content: attr(data-file-ext);
    }

    a[data-file-ext] + .file-ext {
      pointer-events: none;
    }

    a[data-file-ext]:hover + .file-ext {
      display: none;
    }

    /*-- Enhanced replies --*/
    .fcx-replies-plus .panelBacklinks a.fcx-active {
      --active-color: red;
      color: var(--active-color);
    }


    body:not(.fcx-icon-replies).fcx-replies-plus .panelBacklinks a.fcx-active,
    .fcx-replies-plus .replyPreview .linkQuote.fcx-active-color {
      background: var(--active-color);
      padding: 2px 4px 2px 3px;
      color: white!important;
      solid 1px var(--navbar-text-color);
      box-shadow: inset 0px 0px 0px 1px rgba(0,0,0,0.2);
      text-shadow: 0.5px 0.5px 0.5px #000,-0.5px 0.5px 0.5px #000,-0.5px -0.5px 0.5px #000,0.5px -0.5px 0.5px #000, 0px 0px 4px #000, 0px 0px 4px #000;
      background-image: linear-gradient(-45deg, rgba(0,0,0,0.2), rgba(255,255,255,0.2));
    }

    .fcx-replies-plus .replyPreview {
      padding-left: 40px;
      padding-right: 10px;
      margin-top: 10px;
    }

    .fcx-replies-plus .altBacklinks {
      background-color: unset;
    }

    .fcx-replies-plus .altBacklinks + .replyPreview {
      padding-left: 4px;
      padding-right: 0px;
      margin-top: 5px;
    }

    .fcx-replies-plus .replyPreview .inlineQuote + .inlineQuote {
      margin-top: 8px;
    }

    .fcx-replies-plus .inlineQuote .innerPost {
      border: solid 1px var(--navbar-text-color)
    }

    .fcx-replies-plus .quoteLink + .inlineQuote {
      margin-top: 6px;
    }

    .fcx-replies-plus .inlineQuote .postInfo > a:first-child {
      position: absolute;
      display: inline-block;
      font-size: 0;
      width: 14px;
      height: 14px;
      background: var(--link-color);
      border-radius: 50%;
      translate: 6px 0.5px;
    }

    .fcx-replies-plus .inlineQuote .postInfo > a:first-child:after {
      content: '+';
      display: block;
      position: absolute;
      left: 50%;
      top: 50%;
      font-size: 18px;
      color: var(--contrast-color);
      transform: translate(-50%, -50%) rotate(45deg);
      z-index: 1;
    }

    .fcx-replies-plus .inlineQuote .postInfo > a:first-child:hover {
      background: var(--link-hover-color);
    }

    .fcx-replies-plus .inlineQuote .hideButton {
      margin-left: 25px;
    }

    /*-- Nav Board Links --*/
    .nav-boards--custom {
      display: flex;
      gap: 3px;
    }

    .fcx-hidden,
    #navTopBoardsSpan.fcx-hidden ~ #navBoardsSpan,
    #navTopBoardsSpan.fcx-hidden ~ .nav-fade,
    #navTopBoardsSpan a.fcx-hidden + span {
      display: none;
    }

    /*-- Anon Unique ID posts --*/
    .postInfo .spanId {
      position: relative;
    }

    .fcx-id-posts {
      position: absolute;
      top: 0;
      left: 20px;
      translate: 0 calc(-100% - 5px);
      display: grid;
      grid-template-columns: repeat(8, 1fr);
      gap: 2px 5px;
      padding: 10px 12px 10px 10px;
      background: var(--background-color);
      border: 1px solid var(--navbar-text-color);
      /*width: max-content;*/
      z-index: 1;
      overflow-y: scroll;
      overflow-x: auto;
      scrollbar-color: var(--navbar-text-color) var(--background-color);
      max-height: 80vh;
    }

    @media only screen and (max-width: 1024px) {
      .fcx-id-posts {
        grid-template-columns: repeat(6, 1fr);
        max-height: 75vh;
        left: 15px;
      }
    }

    @media only screen and (max-width: 868px) {
      .fcx-id-posts {
        grid-template-columns: repeat(4, 1fr);
        max-height: 70vh;
        left: 10px;
        padding: 8px 10px 8px 8px;
      }
    }

    @media only screen and (max-width: 680px) {
      .fcx-id-posts {
        grid-template-columns: repeat(2, 1fr);
        max-height: 60vh;
        left: 5px;
        padding: 5px 8px 5px 5px;
        gap: 1px 3px;
      }
    }

    @media only screen and (max-width: 540px) {
      .fcx-id-posts {
        grid-template-columns: 1fr;
        max-height: 50vh;
        left: 2px;
        padding: 5px 8px 5px 5px;
        gap: 1px;
      }
    }

    .fcx-id-posts .nestedPost {
      pointer-events: none;
      width: auto;
    }

    /*-- Thread sorting --*/
    #divThreads.fcx-threads {
      display: flex!important;
      flex-wrap: wrap;
      justify-content: center;
    }

    .catalogCell.shit-thread {
      order: 10;
      filter: sepia(0.17);
    }

    .catalogCell.shit-thread .labelPage:after {
      content: " 💩";
    }

    /* Hide navbar */
    .fcx-hide-navbar .navHeader {
      --translateY: -100%;
      translate: 0 var(--translateY);
      transition: ease 300ms translate;
    }

    .bottom-header.fcx-hide-navbar .navHeader {
      --translateY: 100%;
    }

    .fcx-hide-navbar .navHeader:after {
      content: "";
      display: block;
      height: 100%;
      width: 100%;
      left: 0;
      position: absolute;
      top: 100%;
    }

    .fcx-hide-navbar .navHeader:hover {
      --translateY: -0%;
    }

    .bottom-header .fcx-hide-navbar .navHeader:not(:hover) {
      --translateY: 100%;
    }

    .bottom-header .fcx-hide-navbar .navHeader:after {
      top: -100%;
    }

    /* Extra styles */
    .fcx-hide-delete .postInfo .deletionCheckBox {
      display: none;
    }

    /*-- mascot --*/
    .fcx-mascot {
      position: fixed;
      z-index: -1;
    }

    .fct-gallery-open .fcx-mascot {
      display: none;
    }

    .fcxs-mascot-list {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 10px;
      margin: 25px 0 40px;
    }

    .fcxs-mascot__new,
    .fcxs-mascot-card {
      border: 1px solid var(--navbar-text-color);
      border-radius: 8px;
      position: relative;
      overflow: hidden;
      height: 170px;
      rgba(255,255,255,0.15);
      cursor: pointer;
    }

    .fcxs-mascot__new {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 50px;
    }

    .fcxs-mascot__new span {
      opacity: 0.6;
      transition: ease 150ms opacity;
    }

    .fcxs-mascot__new:hover span {
      opacity: 1;
    }

    .fcxs-mascot-card img {
      height: 100%;
      width: 100%;
      object-fit: contain;
      opacity: 0.7;
      transition: ease 150ms all;
    }

    .fcxs-mascot-card:hover img {
      opacity: 1;
    }

    .fcxs-mascot-card--disabled img {
      filter: grayscale(1);
      opacity: 0.4;
    }

    .fcxs-mascot-card--disabled:hover img {
      filter: grayscale(0.8);
      opacity: 0.6;
    }

    .fcxs-mascot-card__buttons {
      border-top: solid 1px var(--navbar-text-color);
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      display: flex;
      opacity: 0;
      transition: ease 150ms opacity;
    }

    .fcxs-mascot-card:hover .fcxs-mascot-card__buttons {
      opacity: 1;
     }

    .fcxs-mascot-card button {
      --background-opacity: 0.5;
      transition: ease 150ms all;
      flex: 1;
      margin: 0;
      border: none;
      padding: 6px 0;
      color: var(--link-color);
      background: rgba(255,255,255,var(--background-opacity));
    }

    .fcxs-mascot-card button + button {
      border-left: solid 1px var(--navbar-text-color);
    }

    .fcxs-mascot-card button:hover {
      --background-opacity: 1;
    }

    .fcxs-mascot-card__name {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      background: rgba(255,255,255,0.2);
      transition: ease 150ms background;
    }

    .fcxs-mascot-card__name:hover {
      background: rgba(255,255,255,0.6);
    }

    .fcxs-mascot-card__name span {
      display: block;
      width: auto;
      text-align: center;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      padding: 2px 10px;
    }

    .fcxs-mascot-card:hover span {
      white-space: normal;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      text-overflow: ellipsis;
      max-height: 54px;
      padding: 2px 0;
    }

    .fcxs-add-mascot {
      display: none;
      position: fixed;
      top: 50%;
      left: 50%;
      translate: -50% -50%;
      width: 390px;
      padding: 20px;
      background: var(--background-color);
      border: solid 1px var(--navbar-text-color);
      border-radius: 6px;
      z-index: 1001;
    }

    .fcxs-close-mascot {
      margin-left: auto;
    }

    .fcxs--mascot-modal .fcxs,
    .fcxs--mascot-modal .fcx-settings__settings{
      overflow: hidden;
    }

    .fcxs--mascot-modal .fcxs-add-mascot {
      display: block;
    }

    .fcxs--mascot-modal .fcxs:after {
      content: "";
      display: block;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 1000vh;
      background: rgba(0,0,0,0.5);
      z-index: 3;
    }

    .fcxs-add-mascot-settings {
      display: flex;
      flex-wrap: wrap;
      gap: 0 30px;
    }

    .fcxs-add-mascot-settings .fcx-setting {
      min-width: 40%;
      flex: 1;
    }

    .fcxs-add-mascot-settings .fcx-setting input {
      width: 40px;
      min-width: unset;
    }

    .fcxs-add-mascot-settings .fcx-setting--enabled,
    .fcxs-add-mascot-settings .fcx-setting--name,
    .fcxs-add-mascot-settings .fcx-setting--image,
    .fcxs-add-mascot-settings .fcx-setting--flipImage {
      max-width: 100%;
      width: 100%;
      flex: unset;
    }

    .fcxs-add-mascot-settings .fcx-setting--name input,
    .fcxs-add-mascot-settings .fcx-setting--image input {
      width: 62%;
    }

    .fcxs-add-mascot-settings .fcx-setting--enabled {
      border: none;
    }

    .fcxs-add-mascot-settings .fcx-setting--id {
      display: none;
    }

    .fcxs-save-mascot {
      margin: 20px auto 0;
      padding-left: 80px;
      padding-right: 80px;
    }

    .fcxs-save-mascot[disabled] {
      cursor: not-allowed;
      opacity: 0.4;
    }

    .fcx-add-mascot-button .uploadCell .sizeLabel {
      pointer-events: all;
      position: relative;
      z-index: 0;
      cursor: pointer;
    }

    .fcx-add-mascot-button .uploadCell:hover .sizeLabel {
      z-index: 1;
    }

    .fcx-add-mascot-button .uploadCell .sizeLabel:after {
      content: "+mascot";
      display: block;
      position: absolute;
      top: 50%;
      left: 0;
      transform: translateY(-50%);
      width: 100%;
      padding: 1px 0;
      text-align: center;
      border-radius: 3px;
      background: var(--contrast-color);
      border: 1px solid var(--text-color);
      cursor: pointer;
      opacity: 0;
      transition: ease 150ms opacity;
    }

    .fcx-add-mascot-button .uploadCell .sizeLabel.mascotAdded:after {
      content: "added!"
    }

    .fcx-add-mascot-button .uploadCell:hover .sizeLabel:after {
      opacity: 1;
    }

    .fcx-add-mascot-button .quoteTooltip {
      z-index: 3;
    }

    .extraMenuButton .floatingList,
    .postInfo .floatingList {
      z-index: 2;
    }

    /*-- Backlink icons --*/
    .fcx-icon-replies .panelBacklinks > a {
      font-size: 0;
      text-decoration: none;
      margin-left: -4px;
      display: inline-block;
      padding: 1px 3px;
    }

    .fcx-icon-replies .panelBacklinks > a:first-child {
      margin-left: 3px;
    }

    .fcx-icon-replies .panelBacklinks > a:after {
      display: inline-block;
      content: '▶';
      font-size: 10pt;
      rotate: 0deg;
      transition: ease 75ms all;
    }

    .fcx-icon-replies .opCell .panelBacklinks > a.fcx-active:after {
      rotate: 90deg;
      text-shadow: 0px 1px 0px #000, 1.8px 0px 0px #000, -0.8px -1.5px 0px #000, -0.8px 1.5px 0px #000;
    }

    /*-- 8chan jank CSS fix --*/
    .spoiler > .inlineQuote {
      color: initial!important;
    }
    .spoiler > .inlineQuote .quoteLink {
      color: #ff0000!important;
    }

    .spoiler > .inlineQuote .greenText {
      color: #429406!important;
    }

    .spoiler > .inlineQuote .spoiler  {
      color: #000!important;
    }

    #helpMenu {
      display: none;
    }

    @media only screen and (min-width: 813px) {
      .fcxm {
        position: fixed;
        display: flex;
        flex-direction: column;
        top: 25px;
        left: 0;
        width: 100%;
        min-height: 300px;
        max-height: 80vh;
        background: var(--contrast-color);
        border-bottom: 1px solid var(--horizon-sep-color);
        box-shadow: 0 5px 10px rgba(0,0,0,.5);
        translate: 0 -110%;
        transition: ease 150ms translate
      }

      .fcx-active > .fcxm {
        translate: 0 0%;
      }

      .fcxm__menu-tabs {
        display: flex;
        justify-content: center;
        margin-top: 20px;
        padding: 0 15px;
        border-bottom: 1px solid var(--horizon-sep-color);
      }

      .fcxm__menu-button {
        margin: 0;
        padding: 10px;
        min-width: 120px;
        border: 1px solid var(--horizon-sep-color);
        border-width: 1px 0 0 1px;
      }

      .fcxm__menu-button.fcx-active {
        background: var(--horizon-sep-color);
      }

      .fcxm__menu-button:last-child {
        border-width: 1px 1px 0 1px;
      }

      .fcxm__menu-container {
        flex: 1;
        position: relative;
        padding: 0 15px 25px;
        overflow: auto;
      }

      #fcxm .floatingMenu {
        display: none!important;
        box-shadow: none!important;
        position: static;
        background: none;
        border: none;
        height: 100%;
        width: 100%;
        padding: 0!important;
      }

      #fcxm .floatingMenu.fcx-active {
        display: block!important;
        min-height: 100%;
      }

      .fcxm .floatingMenu .handle,
      .fcxm .floatingMenu .handle + hr {
        display: none;
      }

      .fcxm .floatingContainer {
        resize: unset;
        height: 100%!important;
        width: 100%!important;
        background: rgba(0,0,0,0);
      }

      .fcxm #settingsMenu .settingsTab {
        text-align: center;
        color: var(--text-color);
        text-shadow: none;
        padding-top: 10px;
      }

      .fcxm #settingsMenu .floatingContainer > div:has(.settingsTab),
      .fcxm #settingsMenu .menuContentPanel {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        direction: rtl;
      }

      .fcxm #settingsMenu .menuContentPanel > * {
        direction: ltr;
      }

      .fcxm #settingsMenu .panelContents {
        display: block;
      }

      .fcxm #settingsMenu .panelContents:last-child > div {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .fcxm #settingsMenu .panelContents:last-child > div:has(input[type="range"]) {
        line-height: 2;
      }

      .fcxm #settingsMenu .panelContents:last-child > div select {
        font-size: 12px;
      }

      /*-- Help menu --*/
      .fcx-header-menu #helpMenu {
        height: 100%;
      }

      .fcxm__help-page-content {
        width: 100%;
        display: grid;
        grid-auto-columns: 1fr 1fr;
        margin: 0;
        gap: 12px;
        max-width: 1280px;
        margin: auto;
        padding-top: 20px;
      }

      .fcxm__help-page-content .titleFieldset {
        width: auto;
        grid-column-start: 2;
        margin: 0;
        border: none;
        font-size: 12px;
      }

      .fcxm__help-page-content .titleFieldset:nth-child(4) {
        grid-column-start: 1;
        grid-row-start: 1;
        grid-row-end: 5;
      }

      .fcxm__help-page-content .titleFieldset legend {
        font-size: 14px;
      }

      /*-- watch list columns --*/
      #fcxm #watchedMenu .floatingContainer,
      #fcxm #multiboardMenu .floatingContainer{
        overflow-x: auto;
        display: flex;
        width: 100%;
        max-width: unset;
        justify-content: center;
      }

      .fcx-header-menu #multiboardMenu .floatingContainer {
        padding-top: 20px;
      }

      .fcx-header-menu #watchedMenu table,
      .fcx-header-menu #multiboardMenu table {
        display: flex;
        flex-direction: column;
        height: 100%;
        flex-wrap: wrap;
        max-height: 450px;
        gap: 0 20px;
        align-content: center;
        padding-top: 20px;
      }

      .fcx-header-menu #multiboardMenu table {
        max-height: 350px;
      }

      .fcx-header-menu #watchedMenu table > tr,
      .fcx-header-menu #multiboardMenu table > tr {
        width: unset;
        max-width: 500px;
      }

      .fcx-header-menu #watchedMenu .watchedCellLabel,
      .fcx-header-menu #multiboardMenu td.mb-cell-string {
        padding-right: 40px;
      }

      .fcx-header-menu .watchedCellLabel a::before {
        color: var(--role-color);
      }

      .fcx-header-menu .watchedCellLabel:has(.watchedNotification:not(:empty)) a {
        color: var(--error);
      }

      .fcx-header-menu .settingsButton {
        display: inline-block;
        width: 12px;
        height: 100%;
      }

      .fcx-menu-trigger {
        position: absolute;
        left: 102px;
        top: 1px;
        height: calc(100% - 1px);
        width: 110px;
        z-index: 3000;
        border-radius: 6px;
      }

      .fcx-menu-trigger.fcx-active {
        box-shadow: inset 0px 0px 5px 0px var(--link-color);
      }
    }
  `;

  document.head.appendChild(style);
  document.body.appendChild(fcxs);

  // Initialize components
  const fullChanXSettings = new FullChanXSettings();
  const fullChanX = new FullChanX();
  const fullChanXGallery = new FullChanXGallery();
  const fullChanXHeaderMenu = new FullChanXHeaderMenu();

  const toggleButtons = document.querySelectorAll('.fcx-toggle-button');
  toggleButtons.forEach(button => {
    button.addEventListener('click', () => {
    const data = button.dataset;
    const target = data.target ? document.querySelector(data.target) : button;
    const value = data.value || 'active';

    if (data.set) {
      target.dataset[data.set] = value;
    } else {
      target.classList.toggle(value);
    }
    });
  });

  const reloadButton = document.querySelector('.fcx-settings__location-reload');
  reloadButton.addEventListener('click', () => {
    location.reload();
  });

  // Store instances globally for access if needed
  window.fullChanXSettings = fullChanXSettings;
  window.fullChanX = fullChanX;
  window.fullChanXGallery = fullChanXGallery;
  window.fullChanXHeaderMenu = fullChanXHeaderMenu;

  // Initialize settings first since other components depend on it
  fullChanXSettings.init();
})();

// Asuka and Eris (fantasy Asuka) are best girls