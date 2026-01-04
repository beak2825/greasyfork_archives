// ==UserScript==
// @name         Trakt.tv | Custom Profile Image
// @description  A custom profile image for free users. Like the vip feature, except this one only works locally. Uses the native set/reset buttons and changes the dashboard + settings background as well.
// @version      1.1.4
// @namespace    https://github.com/Fenn3c401
// @author       Fenn3c401
// @license      GPL-3.0-or-later
// @homepageURL  https://github.com/Fenn3c401/Trakt.tv-Userscript-Collection#readme
// @supportURL   https://github.com/Fenn3c401/Trakt.tv-Userscript-Collection/issues
// @icon         https://trakt.tv/assets/logos/logomark.square.gradient-b644b16c38ff775861b4b1f58c1230f6a097a2466ab33ae00445a505c33fcb91.svg
// @match        https://trakt.tv/*
// @match        https://classic.trakt.tv/*
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_info
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/557303/Trakttv%20%7C%20Custom%20Profile%20Image.user.js
// @updateURL https://update.greasyfork.org/scripts/557303/Trakttv%20%7C%20Custom%20Profile%20Image.meta.js
// ==/UserScript==


'use strict';

let $, toastr;

const logger = {
  _defaults: {
    title: GM_info.script.name.replace('Trakt.tv', 'Userscript'),
    toast: true,
    toastrOpt: { positionClass: 'toast-top-right', timeOut: 10000, progressBar: true },
    toastrStyles: '#toast-container#toast-container a { color: #fff !important; border-bottom: dotted 1px #fff; }',
  },
  _print(fnConsole, fnToastr, msg = '', opt = {}) {
    const { title = this._defaults.title, toast = this._defaults.toast, toastrOpt, toastrStyles = '', consoleStyles = '', data } = opt,
          fullToastrMsg = `${msg}${data !== undefined ? ' See console for details.' : ''}<style>${this._defaults.toastrStyles + toastrStyles}</style>`;
    console[fnConsole](`%c${title}: ${msg}`, consoleStyles, ...(data !== undefined ? [data] : []));
    if (toast) toastr[fnToastr](fullToastrMsg, title, { ...this._defaults.toastrOpt, ...toastrOpt });
  },
  info(msg, opt) { this._print('info', 'info', msg, opt) },
  success(msg, opt) { this._print('info', 'success', msg, { consoleStyles: 'color:#00c853;', ...opt }) },
  warning(msg, opt) { this._print('warn', 'warning', msg, opt) },
  error(msg, opt) { this._print('error', 'error', msg, opt) },
};

const gmStorage = { ...(GM_getValue('customProfileImage')) };
GM_setValue('customProfileImage', gmStorage);


let styles = addStyles();

window.addEventListener('turbo:load', () => {
  if (!/^\/(shows|movies|users|dashboard|settings|oauth\/(authorized_)?applications)/.test(location.pathname)) return;

  $ ??= unsafeWindow.jQuery;
  toastr ??= unsafeWindow.toastr;
  if (!$ || !toastr) return;

  const $coverWrapper = $('body.is-self #cover-wrapper'),
        $btnSetProfileImage = $('body.is-self #btn-set-profile-image'),
        $fullScreenshot = $('body:is(.shows, .movies) #summary-wrapper > .full-screenshot');

  if (gmStorage.imgUrl && $coverWrapper.length && $btnSetProfileImage.length) addUserPageElems($coverWrapper, $btnSetProfileImage);

  if ($fullScreenshot.length) {
    if ($fullScreenshot.attr('style')) addTitlePageElems($fullScreenshot);
    else {
      new MutationObserver((_muts, mutObs) => {
        mutObs.disconnect();
        addTitlePageElems($fullScreenshot);
      }).observe($fullScreenshot[0], { attributeFilter: ['style'] }); // native logic for selection of bg img (fanart vs screenshot) is quite complex
    }
  }
});


function addUserPageElems($coverWrapper, $btnSetProfileImage) {
  if ($coverWrapper.has('a.selected:contains("Profile")').length) {
    $coverWrapper.removeClass('slim')
      .find('> .poster-bg-wrapper').removeClass('poster-bg-wrapper').addClass('shade');

    if (!$coverWrapper.find('> #watching-now-wrapper').length) {
      $coverWrapper.find('> .container').before(
        `<div class="hidden-xs" id="fanart-info">` +
          `<a href="${gmStorage.info.url}">${gmStorage.info.title} <span class="year">${gmStorage.info.year}</span></a>` +
        `</div>`
      );
    }
  } else {
    $coverWrapper.find('> .poster-bg-wrapper').removeClass('poster-bg-wrapper').addClass('shadow-full-width');
  }

  $btnSetProfileImage.popover('destroy').popover({
    trigger: 'manual',
    container: 'body',
    placement: 'bottom',
    html: true,
    template:
      `<div class="popover remove reset-profile-image" role="tooltip">` +
        `<div class="arrow"></div>` +
        `<h3 class="popover-title"></h3>` +
        `<div class="popover-content"></div>` +
      `</div>`,
    title: 'Reset Profile Image?',
    content:
      `<button class="btn btn-primary less-rounded">Yes</button>` +
      `<button class="btn btn-cancel less-rounded" onclick="$(this).closest('.popover').popover('hide');">No</button>`,
  }).on('click', function() { $(this).popover('show'); })
    .find('.btn-text').text('Reset Profile Image');

  $('body').on('click', '.reset-profile-image .btn-primary', () => {
    ['imgUrl', 'info'].forEach((prop) => delete gmStorage[prop]);
    GM_setValue('customProfileImage', gmStorage);
    styles?.remove();
    logger.success('Custom profile image has been reset.');

    $btnSetProfileImage.popover('destroy').popover({
      trigger: 'hover',
      container: 'body',
      placement: 'bottom',
      html: true,
      template:
        `<div class="popover set-profile-image" role="tooltip">` +
          `<div class="arrow"></div>` +
          `<h3 class="popover-title"></h3>` +
          `<div class="popover-content"></div>` +
        `</div>`,
      content:
        `Showcase your favorite movie, show, season or episode and make it your profile header image! Here's how:<br><br>` +
        `<ol>` +
          `<li>Go to any <b>movie</b>, <b>show</b>, <b>season</b>, or <b>episode</b> page.</li>` +
          `<li>Click <b>Set Profile Image</b> in the sidebar.</li>` +
        `</ol>`,
    }).off('click')
      .find('.btn-text').text('Set Profile Image');

    $coverWrapper.addClass('slim')
      .find('> :is(.shade, .shadow-full-width)').removeClass('shade shadow-full-width').addClass('poster-bg-wrapper')
      .end().find('> #fanart-info').remove();
  });
}


function addTitlePageElems($fullScreenshot) {
  const fanartUrl = $fullScreenshot.css('background-image').match(/url\("?(?!.+?placeholders)(.+?)"?\)/)?.[1],
        $setProfImgBtns = $('[href="/vip/cover"]');

  const deactivateSetProfImgBtns = (reasonId) => {
    $setProfImgBtns.has('.fa')
      .parent().addClass('locked')
      .find('.text').unwrap()
      .append(`<div class="under-action">${['No fanart available', 'Already set'][reasonId]}</div>`);
    $setProfImgBtns.not(':has(.fa)')
      .off('click').on('click', (evt) => evt.preventDefault())
      .css({ 'color': '#bbb' })
      .find('.text').wrap('<s></s>');
  };

  if (!fanartUrl) deactivateSetProfImgBtns(0);
  else if (fanartUrl === gmStorage.imgUrl) deactivateSetProfImgBtns(1);
  else {
    $setProfImgBtns.on('click', (evt) => {
      evt.preventDefault();
      deactivateSetProfImgBtns(1);

      gmStorage.imgUrl = fanartUrl;
      gmStorage.info = {
        url: location.pathname,
        title: $('head title').text().match(/(.+?)(?: \([0-9]{4}\))? - Trakt/)[1],
        year: $('#summary-wrapper .year').text(),
      };
      GM_setValue('customProfileImage', gmStorage);
      styles?.remove();
      styles = addStyles();
      logger.success('Fanart is now set as custom profile image. Click here to see how it looks.', { toastrOpt: { onclick() { location.href = '/users/me'; } } });
    });
  }
}


function addStyles() {
  if (gmStorage.imgUrl) {
    return GM_addStyle(`
body.users.is-self #cover-wrapper:not(:has(> #watching-now-wrapper)) > .full-bg {
  background-image: url("${gmStorage.imgUrl}") !important;
}
@media (width <= 767px) and (orientation: portrait) {
  body.users.is-self #cover-wrapper:not(:has(> #watching-now-wrapper)) > .container {
    background-color: revert !important;
  }
}

body:is(.dashboard, .settings, .authorized_applications, .applications) #results-top-wrapper .poster-bg {
  background-image: url("${gmStorage.imgUrl}") !important;
  background-size: cover !important;
  background-position: 50% 20% !important;
  opacity: 0.7 !important;
  filter: revert !important;
}
  `);
  }
}