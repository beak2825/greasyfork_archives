// ==UserScript==
// @name         Faketube Premium
// @version      2025.12.13
// @description  This script will appearently forced to use the (fake) YouTube Premium by changing its logo and blocks all of its ads.
// @author       LegendCraftMC
// @license MIT
// @match        *://www.youtube.com/*
// @namespace    https://greasyfork.org/en/users/933798
// @icon         https://www.youtube.com/favicon.ico
// @unwrap
// @run-at       document-idle
// @unwrap
// @grant        none
// ==/UserScript==
(() => {
 
  let popupState = 0;
  let popupElement = null;
 
  const rate = 1;
 
  const Promise = (async () => { })().constructor;
 
  const PromiseExternal = ((resolve_, reject_) => {
    const h = (resolve, reject) => { resolve_ = resolve; reject_ = reject };
    return class PromiseExternal extends Promise {
      constructor(cb = h) {
        super(cb);
        if (cb === h) {
          /** @type {(value: any) => void} */
          this.resolve = resolve_;
          /** @type {(reason?: any) => void} */
          this.reject = reject_;
        }
      }
    };
  })();
 
  const insp = o => o ? (o.polymerController || o.inst || o || 0) : (o || 0);
 
  let vload = null;
 
  const fastSeekFn = HTMLVideoElement.prototype.fastSeek || null;
  const addEventListenerFn = HTMLElement.prototype.addEventListener;
  if (!addEventListenerFn) return;
  const removeEventListenerFn = HTMLElement.prototype.removeEventListener;
  if (!removeEventListenerFn) return;
 
  const ytPremiumPopupSelector = 'yt-mealbar-promo-renderer.style-scope.ytd-popup-container:not([hidden])';
 
  const DEBUG = 0;
 
  const rand = (a, b) => a + Math.random() * (b - a);
  const log = DEBUG ? console.log.bind(console) : () => 0;
 
  //$0.$['dismiss-button'].click()
  const ytPremiumPopupClose = function () {
    const popup = document.querySelector(ytPremiumPopupSelector);
    if (popup instanceof HTMLElement) {
      if (HTMLElement.prototype.closest.call(popup, '[hidden]')) return;
      const cnt = insp(popup);
      const btn = cnt.$ ? cnt.$['dismiss-button'] : 0;
      if (btn instanceof HTMLElement && HTMLElement.prototype.closest.call(btn, '[hidden]')) return;
      btn && btn.click();
    }
  }
 
  //div.video-ads.ytp-ad-module
  const clickSkip = function () {
    // ytp-ad-skip-button
    const isAdsContainerContainsButton = document.querySelector('.video-ads.ytp-ad-module button');
    if (isAdsContainerContainsButton) {
 
      const btnFilter = e => HTMLElement.prototype.matches.call(e, ".ytp-ad-overlay-close-button, .ytp-ad-skip-button-modern, .ytp-ad-skip-button") && !HTMLElement.prototype.closest.call(e, '[hidden]');
      const btns = [...document.querySelectorAll('.video-ads.ytp-ad-module button[class*="ytp-ad-"]')].filter(btnFilter);
      console.log('# of ads skip btns', btns.length);
      if (btns.length !== 1) return;
      const btn = btns[0];
      if (btn instanceof HTMLElement) {
        btn.click();
      }
 
    }
  };
 
  const adsEndHandlerHolder = function (evt) {
 
    adsEndHandler && adsEndHandler(evt);
 
  }
 
  let adsEndHandler = null;
 
 
  const videoPlayingHandler = async function (evt) {
    try {
 
      if (!evt || !evt.target || !evt.isTrusted || !(evt instanceof Event)) return;
      const video = evt.target;
 
      const checkPopup = popupState === 1;
      popupState = 0;
 
      const popupElementValue = popupElement;
      popupElement = null;
 
      if (video.duration < 0.8) return;
 
      await vload.then();
      if (!video.isConnected) return;
 
      const ytplayer = HTMLElement.prototype.closest.call(video, 'ytd-player, ytmusic-player');
      if (!ytplayer || !ytplayer.is) return;
 
      const ytplayerCnt = insp(ytplayer);
      const player_ = await (ytplayerCnt.player_ || ytplayer.player_ || ytplayerCnt.playerApi || ytplayer.playerApi || 0);
      if (!player_) return;
 
      if (typeof ytplayerCnt.getPlayer === 'function' && !ytplayerCnt.getPlayer()) {
        await new Promise(r => setTimeout(r, 40));
      }
      const playerController = await ytplayerCnt.getPlayer() || player_;
      if (!video.isConnected) return;
 
      if ('getPresentingPlayerType' in playerController && 'getDuration' in playerController) {
 
        const ppType = await playerController.getPresentingPlayerType();
 
        log('m02a', ppType);
        if (ppType === 1 || typeof ppType !== 'number') return; // ads shall be ppType === 2
        // const progressState = player_.getProgressState();
        // log('m02b', progressState);
        // if(!progressState) return;
        // const q = progressState.duration;
 
        // if (popupState === 1) console.debug('m05b:ytPremiumPopup', document.querySelector(ytPremiumPopupSelector))
 
        const q = video.duration;
 
        const ytDuration = await playerController.getDuration();
        log('m02c', q, ytDuration, Math.abs(ytDuration - q));
 
        if (q > 0.8 && ytDuration > 2.5 && Math.abs(ytDuration - q) > 1.4) {
          try {
            log('m02s', 'fastSeek', q);
            video.muted = true;
            const w = Math.round(rand(582, 637) * rate);
            const sq = q - w / 1000;
 
            adsEndHandler = null;
 
            const expired = Date.now() + 968;
 
            removeEventListenerFn.call(video, 'ended', adsEndHandlerHolder, false);
            removeEventListenerFn.call(video, 'suspend', adsEndHandlerHolder, false);
            removeEventListenerFn.call(video, 'durationchange', adsEndHandlerHolder, false);
            addEventListenerFn.call(video, 'ended', adsEndHandlerHolder, false);
            addEventListenerFn.call(video, 'suspend', adsEndHandlerHolder, false);
            addEventListenerFn.call(video, 'durationchange', adsEndHandlerHolder, false);
 
            adsEndHandler = async function (evt) {
              adsEndHandler = null;
 
              removeEventListenerFn.call(video, 'ended', adsEndHandlerHolder, false);
              removeEventListenerFn.call(video, 'suspend', adsEndHandlerHolder, false);
              removeEventListenerFn.call(video, 'durationchange', adsEndHandlerHolder, false);
 
              if (Date.now() < expired) {
 
                const delay = Math.round(rand(92, 117));
                await new Promise(r => setTimeout(r, delay));
 
                Promise.resolve().then(() => {
                  clickSkip();
                }).catch(console.warn);
 
                checkPopup && Promise.resolve().then(() => {
                  const currentPopup = document.querySelector(ytPremiumPopupSelector);
                  if (popupElementValue ? currentPopup === popupElementValue : currentPopup) {
                    ytPremiumPopupClose();
                  }
                }).catch(console.warn);
              }
 
            };
 
            if (fastSeekFn) fastSeekFn.call(video, sq);
            else video.currentTime = sq;
 
          } catch (e) {
            console.warn(e);
          }
        }
 
      }
 
    } catch (e) {
      console.warn(e);
    }
 
  };
 
  document.addEventListener('loadedmetadata', async function (evt) {
    try {
 
      if (!evt || !evt.target || !evt.isTrusted || !(evt instanceof Event)) return;
 
      const video = evt.target;
      if (video.nodeName !== "VIDEO") return;
      if (video.duration < 0.8) return;
      if (!video.matches('.video-stream.html5-main-video')) return;
 
      popupState = 0;
 
      vload = new PromiseExternal();
 
      popupElement = document.querySelector(ytPremiumPopupSelector);
 
      removeEventListenerFn.call(video, 'playing', videoPlayingHandler, { passive: true, capture: false });
 
      addEventListenerFn.call(video, 'playing', videoPlayingHandler, { passive: true, capture: false });
 
      popupState = 1;
 
      let trial = 6;
 
      await new Promise(resolve => {
 
        let io = new IntersectionObserver(entries => {
          if (trial-- <= 0 || (entries && entries.length >= 1 && video.matches('ytd-player video, ytmusic-player video'))) {
            resolve();
            io.disconnect();
            io = null;
          }
        });
        io.observe(video);
 
      });
 
      vload.resolve();
 
    } catch (e) {
      console.warn(e);
    }
 
  }, true);
 
})();
 
Object.defineProperties(document, { /*'hidden': {value: false},*/ 'webkitHidden': {value: false}, 'visibilityState': {value: 'visible'}, 'webkitVisibilityState': {value: 'visible'} });
 
setInterval(function(){
    document.dispatchEvent( new KeyboardEvent( 'keyup', { bubbles: true, cancelable: true, keyCode: 143, which: 143 } ) );
}, 60000);
 
(function() {
let css = `
/* REMOVE EVERY SINGLE ADVERTS, JUST EVERYWHERE */
ytd-action-companion-ad-renderer, ytd-display-ad-renderer, ytd-video-masthead-ad-advertiser-info-renderer, ytd-video-masthead-ad-primary-video-renderer, ytd-in-feed-ad-layout-renderer, ytd-ad-slot-renderer, yt-about-this-ad-renderer, yt-mealbar-promo-renderer, ytd-ad-slot-renderer, ytd-in-feed-ad-layout-renderer, .ytd-video-masthead-ad-v3-renderer, div#root.style-scope.ytd-display-ad-renderer.yt-simple-endpoint, div#sparkles-container.style-scope.ytd-promoted-sparkles-web-renderer, div#main-container.style-scope.ytd-promoted-video-renderer, div#player-ads.style-scope.ytd-watch-flexy, ad-slot-renderer, ytm-promoted-sparkles-web-renderer, masthead-ad, #masthead-ad, ytd-video-quality-promo-renderer, #yt-lang-alert-container, .YtmPaidContentOverlayHost, .ytd-primetime-promo-renderer, ytd-brand-video-singleton-renderer, #yt-feedback, #yt-hitchhiker-feedback, ytd-merch-shelf-renderer, ytd-enforcement-message-view-model, div[is-shared-heimdall], .ytShoppingTimelyShelfContentViewModelHost {
display: none !important;
}
 
ytd-watch-metadata.ytd-watch-flexy {
padding-bottom: 36px !important;
}

/* TURN NORMAL LOGO TO A FAKE PREMIUM LOGO */
[d*="M37.1384 18.8999V13.4399L40.6084 2.09994H38.0184L36.6984 7.24994C36.3984 8.42994 36.1284 9.65994 35.9284 10.7999H35.7684C35.6584 9.79994 35.3384 8.48994 35.0184 7.22994L33.7384 2.09994H31.1484L34.5684 13.4399V18.8999H37.1384Z"] {
d: path("M32.1819 2.10016V18.9002H34.7619V12.9102H35.4519C38.8019 12.9102 40.5619 11.1102 40.5619 7.57016V6.88016C40.5619 3.31016 39.0019 2.10016 35.7219 2.10016H32.1819ZM37.8619 7.63016C37.8619 10.0002 37.1419 11.0802 35.4019 11.0802H34.7619V3.95016H35.4519C37.4219 3.95016 37.8619 4.76016 37.8619 7.13016V7.63016Z")
}
[d*="M44.1003 6.29994C41.0703 6.29994 40.0303 8.04994 40.0303 11.8199V13.6099C40.0303 16.9899 40.6803 19.1099 44.0403 19.1099C47.3503 19.1099 48.0603 17.0899 48.0603 13.6099V11.8199C48.0603 8.44994 47.3803 6.29994 44.1003 6.29994ZM45.3903 14.7199C45.3903 16.3599 45.1003 17.3899 44.0503 17.3899C43.0203 17.3899 42.7303 16.3499 42.7303 14.7199V10.6799C42.7303 9.27994 42.9303 8.02994 44.0503 8.02994C45.2303 8.02994 45.3903 9.34994 45.3903 10.6799V14.7199Z"] {
d: path("M41.982 18.9002H44.532V10.0902C44.952 9.37016 45.992 9.05016 47.302 9.32016L47.462 6.33016C47.292 6.31016 47.142 6.29016 47.002 6.29016C45.802 6.29016 44.832 7.20016 44.342 8.86016H44.162L43.952 6.54016H41.982V18.9002Z")
}
[d*="M52.2713 19.0899C53.7313 19.0899 54.6413 18.4799 55.3913 17.3799H55.5013L55.6113 18.8999H57.6012V6.53994H54.9613V16.4699C54.6812 16.9599 54.0312 17.3199 53.4212 17.3199C52.6512 17.3199 52.4113 16.7099 52.4113 15.6899V6.53994H49.7812V15.8099C49.7812 17.8199 50.3613 19.0899 52.2713 19.0899Z"] {
d: path("M55.7461 11.5002C55.7461 8.52016 55.4461 6.31016 52.0161 6.31016C48.7861 6.31016 48.0661 8.46016 48.0661 11.6202V13.7902C48.0661 16.8702 48.7261 19.1102 51.9361 19.1102C54.4761 19.1102 55.7861 17.8402 55.6361 15.3802L53.3861 15.2602C53.3561 16.7802 53.0061 17.4002 51.9961 17.4002C50.7261 17.4002 50.6661 16.1902 50.6661 14.3902V13.5502H55.7461V11.5002ZM51.9561 7.97016C53.1761 7.97016 53.2661 9.12016 53.2661 11.0702V12.0802H50.6661V11.0702C50.6661 9.14016 50.7461 7.97016 51.9561 7.97016Z")
}
[d*="M62.8261 18.8999V4.14994H65.8661V2.09994H57.1761V4.14994H60.2161V18.8999H62.8261Z"] {
d: path("M60.1945 18.9002V8.92016C60.5745 8.39016 61.1945 8.07016 61.7945 8.07016C62.5645 8.07016 62.8445 8.61016 62.8445 9.69016V18.9002H65.5045L65.4845 8.93016C65.8545 8.37016 66.4845 8.04016 67.1045 8.04016C67.7745 8.04016 68.1445 8.61016 68.1445 9.69016V18.9002H70.8045V9.49016C70.8045 7.28016 70.0145 6.27016 68.3445 6.27016C67.1845 6.27016 66.1945 6.69016 65.2845 7.67016C64.9045 6.76016 64.1545 6.27016 63.0845 6.27016C61.8745 6.27016 60.7345 6.79016 59.9345 7.76016H59.7845L59.5945 6.54016H57.5445V18.9002H60.1945Z")
}
[d*="M67.8728 19.0899C69.3328 19.0899 70.2428 18.4799 70.9928 17.3799H71.1028L71.2128 18.8999H73.2028V6.53994H70.5628V16.4699C70.2828 16.9599 69.6328 17.3199 69.0228 17.3199C68.2528 17.3199 68.0128 16.7099 68.0128 15.6899V6.53994H65.3828V15.8099C65.3828 17.8199 65.9628 19.0899 67.8728 19.0899Z"] {
d: path("M74.0858 4.97016C74.9858 4.97016 75.4058 4.67016 75.4058 3.43016C75.4058 2.27016 74.9558 1.91016 74.0858 1.91016C73.2058 1.91016 72.7758 2.23016 72.7758 3.43016C72.7758 4.67016 73.1858 4.97016 74.0858 4.97016ZM72.8658 18.9002H75.3958V6.54016H72.8658V18.9002Z")
}
[d*="M80.6744 6.26994C79.3944 6.26994 78.4744 6.82994 77.8644 7.73994H77.7344C77.8144 6.53994 77.8744 5.51994 77.8744 4.70994V1.43994H75.3244L75.3144 12.1799L75.3244 18.8999H77.5444L77.7344 17.6999H77.8044C78.3944 18.5099 79.3044 19.0199 80.5144 19.0199C82.5244 19.0199 83.3844 17.2899 83.3844 13.6099V11.6999C83.3844 8.25994 82.9944 6.26994 80.6744 6.26994ZM80.7644 13.6099C80.7644 15.9099 80.4244 17.2799 79.3544 17.2799C78.8544 17.2799 78.1644 17.0399 77.8544 16.5899V9.23994C78.1244 8.53994 78.7244 8.02994 79.3944 8.02994C80.4744 8.02994 80.7644 9.33994 80.7644 11.7299V13.6099Z"] {
d: path("M79.9516 19.0902C81.4116 19.0902 82.3216 18.4802 83.0716 17.3802H83.1816L83.2916 18.9002H85.2816V6.54016H82.6416V16.4702C82.3616 16.9602 81.7116 17.3202 81.1016 17.3202C80.3316 17.3202 80.0916 16.7102 80.0916 15.6902V6.54016H77.4616V15.8102C77.4616 17.8202 78.0416 19.0902 79.9516 19.0902Z")
}
[d*="M92.6517 11.4999C92.6517 8.51994 92.3517 6.30994 88.9217 6.30994C85.6917 6.30994 84.9717 8.45994 84.9717 11.6199V13.7899C84.9717 16.8699 85.6317 19.1099 88.8417 19.1099C91.3817 19.1099 92.6917 17.8399 92.5417 15.3799L90.2917 15.2599C90.2617 16.7799 89.9117 17.3999 88.9017 17.3999C87.6317 17.3999 87.5717 16.1899 87.5717 14.3899V13.5499H92.6517V11.4999ZM88.8617 7.96994C90.0817 7.96994 90.1717 9.11994 90.1717 11.0699V12.0799H87.5717V11.0699C87.5717 9.13994 87.6517 7.96994 88.8617 7.96994Z"] {
d: path("M90.0031 18.9002V8.92016C90.3831 8.39016 91.0031 8.07016 91.6031 8.07016C92.3731 8.07016 92.6531 8.61016 92.6531 9.69016V18.9002H95.3131L95.2931 8.93016C95.6631 8.37016 96.2931 8.04016 96.9131 8.04016C97.5831 8.04016 97.9531 8.61016 97.9531 9.69016V18.9002H100.613V9.49016C100.613 7.28016 99.8231 6.27016 98.1531 6.27016C96.9931 6.27016 96.0031 6.69016 95.0931 7.67016C94.7131 6.76016 93.9631 6.27016 92.8931 6.27016C91.6831 6.27016 90.5431 6.79016 89.7431 7.76016H89.5931L89.4031 6.54016H87.3531V18.9002H90.0031Z")
}
svg[id="yt-ringo2-svg_yt10"] {
width: 113px !important
}
div.style-scope.ytd-topbar-logo-renderer span {
margin-left: -20px !important
}`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  let styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();