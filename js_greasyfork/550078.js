// ==UserScript==
// @name         Trakt.tv | Scheduled E-Mail Data Exports
// @description  Automatic trakt.tv backups for free users. On every trakt.tv visit a background e-mail data export is triggered, if one is overdue based on the specified cron expression (defaults to weekly). See README for details.
// @version      1.1.2
// @namespace    https://github.com/Fenn3c401
// @author       Fenn3c401
// @license      GPL-3.0-or-later
// @homepageURL  https://github.com/Fenn3c401/Trakt.tv-Userscript-Collection#readme
// @supportURL   https://github.com/Fenn3c401/Trakt.tv-Userscript-Collection/issues
// @icon         https://trakt.tv/assets/logos/logomark.square.gradient-b644b16c38ff775861b4b1f58c1230f6a097a2466ab33ae00445a505c33fcb91.svg
// @match        https://trakt.tv/*
// @match        https://classic.trakt.tv/*
// @run-at       document-start
// @require      https://cdn.jsdelivr.net/npm/croner@9.0.0/dist/croner.umd.min.js
// @grant        unsafeWindow
// @grant        GM_info
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/550078/Trakttv%20%7C%20Scheduled%20E-Mail%20Data%20Exports.user.js
// @updateURL https://update.greasyfork.org/scripts/550078/Trakttv%20%7C%20Scheduled%20E-Mail%20Data%20Exports.meta.js
// ==/UserScript==

/* README
### General
- You might want to consider the use of an e-mail filter, so as to e.g. automatically move the data export e-mails to a dedicated trakt-tv-data-exports folder.
- If you don't like the success toasts, you can turn them off by setting `toastOnSuccess` to `false` in the userscript storage tab *(note: only displayed after first run)*, there you can
    also specify your own [cron expression](https://crontab.guru/examples.html). E-Mail data exports have a cooldown period of 24 hours, there is no point in going below that with your cron expression.
*/


/* global Cron */

'use strict';

let $, toastr, userslug;

const gmStorage = { toastOnSuccess: true, cronExpr: '@weekly', lastRun: {}, ...(GM_getValue('scheduledEmailDataExports')) };
GM_setValue('scheduledEmailDataExports', gmStorage);

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
  success(msg, opt) { this._print('info', 'success', msg, { consoleStyles: 'color:#00c853;', toast: gmStorage.toastOnSuccess, ...opt }) },
  warning(msg, opt) { this._print('warn', 'warning', msg, opt) },
  error(msg, opt) { this._print('error', 'error', msg, opt) },
};

let cron;
try {
  cron = new Cron(gmStorage.cronExpr, {
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
} catch (err) {
  logger.error('Invalid cron expression. Exiting..', { data: err });
}


cron && window.addEventListener('turbo:load', async () => {
  $ ??= unsafeWindow.jQuery;
  toastr ??= unsafeWindow.toastr;
  userslug ??= unsafeWindow.Cookies?.get('trakt_userslug');
  if (!$ || !toastr || !userslug) return;

  const dateNow = new Date();

  if (!gmStorage.lastRun[userslug] || cron.nextRun(gmStorage.lastRun[userslug]) <= dateNow) {
    const realLastRun = await fetch('/settings/data').then((r) => r.text())
      .then((r) => $(new DOMParser().parseFromString(r, 'text/html')).find('#exporters .alert-success .format-date').attr('data-date'));

    if (realLastRun && cron.nextRun(realLastRun) > dateNow) {
      gmStorage.lastRun[userslug] = realLastRun;
      GM_setValue('scheduledEmailDataExports', gmStorage);
      return;
    }

    $.post('/settings/export_data').done(() => {
      gmStorage.lastRun[userslug] = dateNow.toISOString();
      GM_setValue('scheduledEmailDataExports', gmStorage);
      logger.success('Success. Your data export is processing. You will receive an e-mail when it is ready.');
    }).fail((xhr) => {
      if (xhr.status === 409) {
        gmStorage.lastRun[userslug] = dateNow.toISOString();
        GM_setValue('scheduledEmailDataExports', gmStorage);
        logger.warning(`Failed. Cooldown from previous export is still active. Will retry on next scheduled data export at: ${cron.nextRun(gmStorage.lastRun[userslug]).toISOString()}`);
      } else {
        logger.error(`Failed with status: ${xhr.status}. Reload page to try again.`, { data: xhr });
      }
    });
  }
});