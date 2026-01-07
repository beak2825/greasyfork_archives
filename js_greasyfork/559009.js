// ==UserScript==
// @name         [Redlib] Error & PoW Redirector
// @include      /^https?:\/\/(?:lib|safe)?red(?:lib|dit)\./
// @include      /^https?:\/\/[il]\.opnxng\.com/
// @include      /^https?:\/\/(?:lr|oratrice)\.ptr\.moe/
// @match        https://lr.vern.cc/*
// @match        https://r.darklab.sh/*
// @match        https://red.artemislena.eu/*
// @match        https://rl.bloat.cat/*
// @match        https://snoo.habedieeh.re/*
// @noframes
// @run-at       document-start
// @inject-into  page
// @grant        GM_cookie.delete
// @grant        GM_deleteValue
// @grant        GM_deleteValues
// @grant        GM_getValues
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_setValues
// @grant        GM_unregisterMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @connect      raw.githubusercontent.com
// @namespace    Violentmonkey Scripts
// @author       SedapnyaTidur
// @version      1.0.11
// @license      MIT
// @revision     1/7/2026, 2:41:00 PM
// @description  Redirects instance of Redlib that having an error or has a Anubis/Cerberus/Cloudflare/GoAway check to another instance. The CSP for websites must be removed/modified using an addon for this script to work. To have a better effect make sure to reorder this script so it runs as soon as possible.
// @downloadURL https://update.greasyfork.org/scripts/559009/%5BRedlib%5D%20Error%20%20PoW%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/559009/%5BRedlib%5D%20Error%20%20PoW%20Redirector.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const window = unsafeWindow;
  let currentURL = window.location.href, blocked = false, hasChecked = false, redirectIntervalId = 0;

  // To block redirections to Anubis/Cerberus/Cloudflare/GoAway.
  const fetch = window.fetch;
  window.fetch = function(resource, options) {
    if (blocked) throw new Error();
    const url = (resource instanceof window.Request) ? resource.url : resource.toString();
    if (/\/\.(?:within\.website|cerberus|well-known)/.test(url)) {
      blocked = true;
      throw new Error();
    }
    fetch.apply(this, arguments);
  };
  const parse = window.JSON.parse;
  window.JSON.parse = function(text, reviver) {
    if (blocked) throw new Error();
    if (/(?:^\{"(?:userAgent|audioBoolean|challenge)":|\/\.(?:within\.website|cerberus|well-known)\/)/.test(text)) {
      blocked = true;
      throw new Error();
    }
    return parse.apply(this, arguments);
  };
  const replaceState = window.History.prototype.replaceState;
  window.History.prototype.replaceState = function(state, unused, url) {
    if (blocked) throw new Error();
    if (/(?:[?&]__(?:cf_chl|goaway)|\/\.(?:within\.website|cerberus|well-known)\/)/.test(url)) {
      blocked = true;
      throw new Error();
    }
    return replaceState.apply(this, arguments);
  };
  const pushState = window.History.prototype.pushState;
  window.History.prototype.pushState = function(state, unused, url) {
    if (blocked) throw new Error();
    if (/(?:[?&]__(?:cf_chl|goaway)|\/\.(?:within\.website|cerberus|well-known)\/)/.test(url)) {
      blocked = true;
      throw new Error();
    }
    return pushState.apply(this, arguments);
  };
  // failedHosts must be an array even though it is empty.
  let { failedHosts, currentHost, deleteCookies, externalOrigins, hideSettings, lastUpdate, preferOrigins, redirectHost, updateFrequency, workingSite } = GM_getValues({
    // Websites that always have a Anubis/Cerberus/GoAway check or redirect to Anubis/Cerberus/GoAway.
    failedHosts: [
      'redlib.thebunny.zone', // NOT RESPONDING IS SO PROBLEMATIC. NOT WORTH THE RISK.
      'lr.ptr.moe',
      'oratrice.ptr.moe',
    ],
    currentHost: undefined, // Current website's hostname.
    deleteCookies: true, // Delete sessionStorage, localStorage & cookies before redirect?.
    externalOrigins: undefined, // An array of origins from external source.
    hideSettings: true, // Hide settings in GM menu commands?
    lastUpdate: undefined, // When the external origins was updated.
    preferOrigins: 'external > local', // local, external, local > external, external > local.
    redirectHost: undefined, // Hostname that will be redirected to.
    updateFrequency: '30 minutes', // Update external origins when at least this much time has passed.
    workingSite: undefined, // Origin of working website.
  });

  const downloader = {
    abort: false,
    instance: undefined,
    timeoutId: 0
  };

  // Unload the page: navigate, reload, back_forward.
  window.addEventListener('beforeunload', function(event) {
    //if (currentHost) GM_deleteValues(['currentHost', 'redirectHost']); // Reload by user only not by a script.
    window.clearInterval(redirectIntervalId);
    window.clearTimeout(downloader.timeoutId);
    if (downloader.instance) downloader.instance.abort();
  }, true);

  const configs = [{
    query: ':scope > pre:first-child',
    texts: ['', 'Moved Permanently', 'Service has been shutdown']
  }, {
    query: ':scope > :is(main,div:first-child,article:first-child,center:first-child) > h1:first-child',
    texts: ["Making sure you're not a bot!", 'The Oratrice is rendering its judgment!', 'Oh noes!', "We’ll be back soon!", 'Performance Tracking', '504 Gateway Time-out', '503 Service Temporarily Unavailable', '502 Bad Gateway', 'ERROR']
  }, {
    query: ':scope > :first-child > :first-child > h1:first-child',
    texts: ["Making sure you're not a bot!", 'Checking you are not a bot', 'An Error Occurred']
  }, {
    query: ':scope > :first-child > :first-child > noscript',
    texts: ['challenge-error-text']
  }, {
    query: ':scope > main > div#error:first-child > :first-child',
    texts: ['Failed to parse page JSON data:', 'Reddit rate limit exceeded.', "Couldn't send request to Reddit:", 'Nothing here']
  }, {
    query: ':scope > #cf-wrapper:first-child > #cf-error-details:first-child > :first-child > :first-child > :first-child',
    // https://cloudflare-error-page-3th.pages.dev/
    texts: ['SSL handshake failed'] // Cloudflare error: server side.
  }];

  // Must be an array. Unfortunately, they are not up-to-date.
  const localOrigins = [
    'https://l.opnxng.com',
    //'https://oratrice.ptr.moe', // GONE 12/25/2025
    'https://red.artemislena.eu',
    'https://reddit.adminforge.de',
    'https://reddit.utsav2.dev',
    'https://redlib.4o1x5.dev',
    'https://redlib.catsarch.com',
    'https://redlib.ducks.party', // GONE, WORKS FINE ON 12/25/2025
    'https://redlib.frontendfriendly.xyz',
    'https://redlib.nadeko.net',
    'https://redlib.orangenet.cc',
    'https://redlib.perennialte.ch',
    'https://redlib.privacyredirect.com',
    'https://redlib.privadency.com',
    'https://redlib.private.coffee',
    'https://redlib.pussthecat.org',
    'https://redlib.reallyaweso.me',
    //'https://redlib.thebunny.zone', // NOT RESPONDING
    'https://redlib.tiekoetter.com',
    'https://rl.bloat.cat',
    'https://snoo.habedieeh.re',
    //'https://safereddit.com', // REDIRECTION LOOP TEST.
  ];

  // Day/Month/Year, Hours:Minutes:Seconds AM/PM
  // 7/12/2025, 4:43:36 PM
  // Returns a date string like above or a decimal numbers for minutes.
  const getDate = function(inMinutes) {
    const date = new Date();
    if (inMinutes) return (date.getFullYear() * 525949) + ((date.getMonth() + 1) * 43829) + (date.getDate() * 1440) + (date.getHours() * 60) + date.getMinutes();
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}, ${date.getHours() % 12 || 12}:${('0' + date.getMinutes()).slice(-2)}:${('0' + date.getSeconds()).slice(-2)} ${date.getHours() > 11 ? 'PM' : 'AM'}`;
  };

  const shouldUpdate = function(checkFailedOrigins) {
    if (!preferOrigins || !updateFrequency || preferOrigins === 'local') return false;
    if (checkFailedOrigins && preferOrigins === 'local > external') { // Have we tried all origins in localOrigins?
      for (const origin of localOrigins) {
        const host = origin.replace(/^https?:\/\/([^/]+).*$/, '$1');
        if (!failedHosts.includes(host)) return false;
      }
    }
    if (checkFailedOrigins && (!externalOrigins || !externalOrigins.length)) return true;
    if (checkFailedOrigins && preferOrigins === 'external > local') {
      for (const origin of externalOrigins) {
        const host = origin.replace(/^https?:\/\/([^/]+).*$/, '$1');
        if (!failedHosts.includes(host)) return false;
      }
    }
    if (!lastUpdate) return true;
    const elapsed = updateFrequency.toLowerCase().replace(/[ s]/g, '').replace(/(mi|h|d|mo|y).*$/, field => {
      return { minute:' 1',hour:' 60',day:' 1440',month:' 43829',year:' 525949' }[field]
    }).split(' ').reduce((sum, value) => sum * Number(value), 1);
    const values = lastUpdate.replace(/:[0-9]+\s+[APap][Mm]$/, '').split(/(?:\/|,\s+|:)/).map(Number);
    const clock24 = (/[Pp][Mm]$/.test(lastUpdate) && values[3] !== 12) ? 12 : 0;
    const past = (values[0] * 1440) + (values[1] * 43829) + (values[2] * 525949) + ((values[3] + clock24) * 60) + values[4];
    const now = getDate(true); // Get current date in minutes as late as possible.
    if (now - past >= elapsed) return true;
    return false;
  };

  // Download a json file. The returned javascript object/array/null have to be gotten using Promise.then.
  const download = function(url, retries = 1, timeout = 5000, waitInterval = 1000) {
    return new Promise(resolve => {
      if (!window.navigator.onLine) {
        resolve(null);
        return;
      }

      const configs = {
        anonymous: true, // No cookies. Privacy.
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Cache-Control': 'max-age=0, no-cache, no-store, must-revalidate, proxy-revalidate',
        },
        method: 'GET',
        responseType: 'json',
        timeout: timeout,
        url: url,
        onabort: function(response) {
          downloader.abort = true;
          downloader.instance = undefined;
          resolve(null);
        },
        ontimeout: function(response) {
          if (downloader.abort || retries <= 0) {
            downloader.instance = undefined;
            resolve(null);
            return;
          }
          downloader.timeoutId = window.setTimeout(() => {
            downloader.timeoutId = 0;
            download(url, --retries, timeout, waitInterval).then(resolve);
          }, waitInterval);
        },
        // Unfortunately, response argument does not have abort(), so it can't be canceled in HEADERS_RECEIVED without a GM_xmlhttpRequest instance.
        // Secondly, each response is a new object that does not shared across listeners. Adding new properties is useless.
        init: function() {
          this.onerror = this.onload = function(response) {
            if (!response.response && response.status >= 500 && !downloader.abort && retries > 0) {
              downloader.timeoutId = window.setTimeout(() => {
                downloader.timeoutId = 0;
                download(url, --retries, timeout, waitInterval).then(resolve);
              }, waitInterval);
              return;
            }
            resolve(response.response); // Can be null.
            downloader.instance = undefined;
          };
          return this;
        },
      }.init();
      downloader.instance = GM_xmlhttpRequest(configs);
    });
  };

  // Specifically for Reblib's json structure.
  const getReblib = function() {
    return new Promise(resolve => {
      const url = 'https://raw.githubusercontent.com/redlib-org/redlib-instances/refs/heads/main/instances.json';

      const setExternalOrigins = function(object) {
        if (!object || !object.instances) {
          resolve(false);
          return;
        }
        externalOrigins = []; // Reset the array. Delete all the old origins.
        for (const instance of object.instances) {
          if (!instance.url) continue;
          externalOrigins.push(instance.url);
        }
        if (externalOrigins.length) {
          GM_setValues({ externalOrigins: externalOrigins, lastUpdate: getDate(false) });
          resolve(true);
        } else {
          externalOrigins = undefined;
          resolve(false);
        }
      };
      // Cancel pending download.
      if (downloader.instance) {
        window.clearTimeout(downloader.timeoutId);
        downloader.instance.abort();
        downloader.instance = undefined;
        downloader.timeoutId = 0;
      }
      downloader.abort = false;
      download(url).then(setExternalOrigins);
    });
  };

  const expireCookies = function() {
    if (!deleteCookies) return;
    window.sessionStorage.clear();
    window.localStorage.clear();
    if (document.cookie) {
      // Can't expire/delete HttpOnly cookies this way.
      const host = window.location.hostname;
      const domain = host.replace(/^(?:[^.]+\.)*([^.]+\.[^.]+)$/, '$1');
      const skip = (domain === host);
      document.cookie.split('; ').forEach(cookie => {
        document.cookie = `${cookie};Path=/;Expires=Thu, 01 Jan 1970 00:00:01 GMT;Secure;HostOnly;`;
        document.cookie = `${cookie};Domain=${domain};Path=/;Expires=Thu, 01 Jan 1970 00:00:01 GMT;Secure;HostOnly;`;
        document.cookie = `${cookie};Domain=.${domain};Path=/;Expires=Thu, 01 Jan 1970 00:00:01 GMT;Secure;`;
        if (skip) return;
        document.cookie = `${cookie};Domain=${host};Path=/;Expires=Thu, 01 Jan 1970 00:00:01 GMT;Secure;HostOnly;`;
        document.cookie = `${cookie};Domain=.${host};Path=/;Expires=Thu, 01 Jan 1970 00:00:01 GMT;Secure;`;
      });
    }
    // For Tampermonkey. Not tested. Does it delete cookies for subdomains? Or how to delete them?
    // If it doesn't work, probably because it doesn't recognise "@grant GM_cookie.delete" but "@grant GM_cookie" only.
    // If so, then it is a security bug. Don't expect people to review the whole code thoroughly - A through Z.
    // Set <Config Mode> to <Advanced> and in <Security> category, change <Allow scripts to access cookies> to <All> to work.
    if (typeof(GM_cookie) !== 'undefined' && GM_cookie.delete) {
      GM_cookie.delete({ url: window.location.origin + '/' });
      GM_cookie.delete({ url: 'https://anubis.techaro.lol/' });
    }
  };

  const getNewUrl = function() {
    return new Promise(async resolve => {
      const location = new URL(currentURL);
      const hostname = location.hostname;
      // Save the failed hostname first before trying to redirect.
      if (!failedHosts.includes(hostname)) {
        failedHosts.push(hostname);
        GM_setValue('failedHosts', failedHosts);
      }
      // This is a must. The "redir=" in query can cause an infinite redirectiom loop.
      // https://oratrice.ptr.moe/.within.website/?redir=https%3A%2F%2Flr.ptr.moe%2Fr%2Fworldnews%2Fnew%3F
      // https://snoo.habedieeh.re/.within.website/x/cmd/anubis/api/pass-challenge?response=00dfda4398a2cf0fe692db546fff4ff3922b44ac545845f9dd11938d82f0a38c&nonce=21&redir=https%3A%2F%2Fsnoo.habedieeh.re%2F&elapsedTime=193
      // https://l.opnxng.com/r/worldnews/new?__cf_chl_rt_tk=eDk9eqEOCfOkswcBNxcKwYOXNe69zQ7463JZvkyL_sw-1765384843-1.0.1.1-Q48lQqRml97LuskqNrjHx6yuZGMrM.GaKDWOBDtsC20
      // https://redlib.nadeko.net/r/worldnews/new?__goaway_challenge=meta-refresh&__goaway_id=0cfc79fd2542edd56dc276cf1d0f65c1&__goaway_referer=https%3A%2F%2Fredlib.frontendfriendly.xyz%2F
      if (/^\/\.(?:within\.website|cerberus|well-known)\//.test(location.pathname)) { // Anubis/Cerberus/GoAway
        currentURL = location.origin + '/';
        const uri = window.decodeURIComponent(location.search);
        if (/[?&]redir=https?:\/\/[^/]+\/[^&]/.test(uri)) { // Absolute path
          currentURL += uri.match(/[?&]redir=https?:\/\/[^/]+\/([^&]+)/)[1];
        } else if (/[?&]redir=\/[^&]/.test(uri)) { // Relative path
          currentURL += uri.match(/[?&]redir=\/([^&]+)/)[1];
        }
      } else if (/[?&]__(?:cf_chl|goaway)/.test(location.search)) { // Cloudflare/GoAway
        currentURL = location.origin + location.pathname;
      }
      // Redirect to the last working website.
      if (workingSite && location.origin !== workingSite) {
        GM_setValues({
          currentHost: hostname,
          // Why not just /^https?:\/\/(.+)$/ you asked? In case you edited/added new origins and put a slash at the end e.g. https://a.b.c/
          redirectHost: workingSite.replace(/^https?:\/\/([^/]+).*$/, '$1')
        });
        currentHost = hostname; // For unload.
        resolve(currentURL.replace(/^https?:\/\/[^/]+/, workingSite));
        return;
      }
      if (workingSite) GM_deleteValue('workingSite');
      // local, external, local > external, external > local.
      const listsOfOrigins = preferOrigins.split(' > ').map(prefer => { return (prefer === 'local') ? localOrigins : externalOrigins });
      let uptodate = null;
      for (let i = 0; i < listsOfOrigins.length; ++i) {
        if (!listsOfOrigins[i]) {
          if (shouldUpdate(false)) uptodate = await getReblib();
          if (!externalOrigins) continue;
          listsOfOrigins[i] = externalOrigins;
          // Give the failed external origins another try after an update?
          const len = failedHosts.length;
          for (const origin of externalOrigins) {
            const index = failedHosts.indexOf(origin.replace(/^https?:\/\/([^/]+).*$/, '$1'));
            if (index > 0) failedHosts.splice(index, 1); // Exclude the first index.
          }
          if (len !== failedHosts.length) GM_setValue('failedHosts', failedHosts);
        }
        for (const origin of listsOfOrigins[i]) {
          const host = origin.replace(/^https?:\/\/([^/]+).*$/, '$1');
          if (hostname !== host && !failedHosts.includes(host)) {
            GM_setValues({ currentHost: hostname, redirectHost: host });
            currentHost = hostname; // For unload.
            resolve(currentURL.replace(/^https?:\/\/[^/]+/, origin));
            return;
          }
        }
        if (!uptodate && listsOfOrigins[i] === externalOrigins) {
          listsOfOrigins[i] = undefined;
          externalOrigins = undefined;
          --i;
        }
      }
      if (uptodate === false) { // JSON structure changed, file not found or download error.
        resolve(undefined);
        return;
      }
      resolve(null);
    });
  };

  const check = async function() {
    if (hasChecked) return;
    hasChecked = true;
    let retries = 1;
    for (const config of configs) {
      let target = document.body.querySelector(config.query);
      if (!target) continue;
      for (const text of config.texts) {
        if (!target.innerText.includes(text)) continue;
        window.stop();
        try { // Wakelock the screen. Don't let screen goes off. Can fail when being low on battery.
          await window.navigator.wakeLock.request('screen');
        } catch(e) {}
        const url = await getNewUrl();
        const path = config.query.replace(':scope', ':root > body').replace(/ [^ ]+$/, ' div#redirector');
        const div = document.createElement('div');
        const h1_1 = document.createElement('h1');
        const h1_2 = document.createElement('h1');
        const h1_3 = document.createElement('h1');
        const style = document.createElement('style');
        style.textContent = `${path + ' > *'} {
          display: block !important;
          font-family: sans-serif !important;
          font-size: 32px !important;
          font-weight: 700px !important;
          margin: 0px !important;
          text-align: center !important;
        }
        ${path + ' > :first-child'} {
          color: rgb(172,157,83) !important;
          overflow-wrap: break-word !important;
        }
        ${path + ' > :nth-child(2)'} {
          color: rgb(65,105,225) !important;
          overflow-wrap: break-word !important;
        }
        ${path + ' > :nth-child(3)'} {
          color: rgb(210,210,210) !important;
          text-shadow: -2px -2px 0 #000000, 2px -2px 0 #000000, -2px 2px 0 #000000, 2px 2px 0 #000000 !important;
          word-break: break-all !important;
        }`;
        document.head.appendChild(style);
        div.id = 'redirector';
        div.appendChild(h1_1);
        div.appendChild(h1_2);
        div.appendChild(h1_3);
        if (url === undefined) {
          h1_1.innerText = '⚠️ There was a problem getting alternative URLs of Reblib.';
        }
        if (!url) {
          h1_2.innerText = '💢 Failed to redirect!. All instances are broken.';
          h1_2.innerText += (preferOrigins === 'local') ? '\nTry again later.' : `\nTry again after ${updateFrequency}.`;
          style.textContent = style.textContent.replace(/rgb\(65,105,225\)/m, 'rgb(213,68,85)');
          target.replaceWith(div);
          return;
        }
        h1_2.innerText = 'Redirecting to another instance...';
        h1_3.innerText = `${url}`;
        target.replaceWith(div);
        expireCookies();
        redirectIntervalId = window.setInterval(past => { // For websites that are not responding.
          if (retries > 0) {
            h1_1.innerText = `⚠️ To-be-redirected server is not responding after ${Math.abs((Date.now() - past) / 1000)} seconds. Retrying: ${retries--}`;
            window.location.replace(url);
          } else {
            window.clearInterval(redirectIntervalId);
            redirectIntervalId = 0; // For unload.
            const host = url.replace(/^https?:\/\/([^/]+).*$/, '$1');
            if (!failedHosts.includes(host)) {
              failedHosts.push(host);
              GM_setValue('failedHosts', failedHosts);
            }
            GM_deleteValues(['currentHost', 'redirectHost']);
            window.location.reload(); // Re-run the script.
          }
        }, 10000, Date.now()); // 10 seconds. Is it too long?
        window.location.replace(url);
        return;
      }
    }

    // No redirection. Remember the current working website.
    workingSite = window.location.origin;
    GM_setValue('workingSite', workingSite);
    // Remove the hostname from failedHosts.
    const index = failedHosts.indexOf(window.location.hostname);
    if (index > 0) {
      failedHosts.splice(index, 1);
      GM_setValue('failedHosts', failedHosts);
    }
  };

  const checkRedirectionLoop = function() {
    if (!currentHost || window.performance.getEntriesByType('navigation')[0].type !== 'navigate') return;
    if (window.location.hostname === currentHost && !failedHosts.includes(redirectHost)) {
      failedHosts.push(redirectHost);
      GM_setValue('failedHosts', failedHosts);
    }
    GM_deleteValues(['currentHost', 'redirectHost']);
    currentHost = undefined; // For unload.
    redirectHost = undefined;
  };

  // === Execute this statement as soon as possible. ===
  if (document.readyState === 'loading') {
    checkRedirectionLoop();
    document.addEventListener('DOMContentLoaded', check, true);
    // Nah. I've decided not to download anything unnecessarily and should run check() as soon as possible.
    //if (shouldUpdate(true)) getReblib(); // Non-blocking.
    if (document.readyState !== 'loading' && !hasChecked) check(); // In case we missed the DOMContentLoaded call during checkRedirectionLoop().
  } else {
    checkRedirectionLoop();
    check();
  }

  // Script's menu commands here.
  const menu = [{
    title: 'Alternative URLs: 《{}》',
    choices: [ 'Locally', 'Externally', 'Prefer Locally, Fallback to Externally', 'Prefer Externally, Fallback to Locally' ],
    options: { id: '0', autoClose: false, title: 'Using alternative URLs in this script or get up-to-date alternative URLs from Redlib?' },
    init: function() {
      this.choices_ = this.choices.map(choice => choice.toLowerCase().split(' ').filter(field => /(?:local|external)/.test(field)).map(choice => choice.replace(/(local|external).*/, '$1')).join(' > '));
      this.index = this.choices_.indexOf(preferOrigins);
      this.title_ = this.title.replace('{}', this.choices[this.index]);
      if (!hideSettings) this.id = GM_registerMenuCommand(this.title_, this.click, this.options);
      return this;
    },
    click: function(event) {
      const object = menu[0];
      object.index = ++object.index & 3;
      object.title_ = object.title.replace('{}', object.choices[object.index]);
      preferOrigins = object.choices_[object.index];
      GM_setValue('preferOrigins', preferOrigins);
      menu.forEach(object => GM_unregisterMenuCommand(object.id));
      for (let i = 0; i < menu.length; ++i) {
        if (preferOrigins === 'local' && menu[i].title.startsWith('Update Frequency')) {
          menu[i].hide = true;
          continue;
        }
        menu[i].hide = false;
        menu[i].id = GM_registerMenuCommand(menu[i].title_, menu[i].click, menu[i].options);
      }
    },
  }.init(), {
    title: 'Update Frequency: 《{}》',
    // Adding or removing intervals is possible. "30 minutes" must be in choices.
    // Only minute(s)/hour(s)/day(s)/month(s) and year(s) are supported. Anything else will crash the script.
    // Big or small values are fine e.g. 5 minutes, 9999 Minutes, 99999MINUTES, 999 hour or 999Day. (Yes, grammar guru).
    choices: [ '30 minutes', '1 hour', '6 hours', '12 hours', '1 day', '1 month', '1 year' ],
    options: { id: '1', autoClose: false, title: 'How often to get new alternative URLs from Redlib after all the old URLs have failed?' },
    init: function() {
      this.index = this.choices.map(time => time.toLowerCase().replace(/[ s]/g, '')).indexOf(updateFrequency.toLowerCase().replace(/[ s]/g, ''));
      if (this.index < 0) { this.hide = true; return this; }
      this.title_ = this.title.replace('{}', this.choices[this.index]);
      if (preferOrigins === 'local') this.hide = true;
      if (!hideSettings && !this.hide) this.id = GM_registerMenuCommand(this.title_, this.click, this.options);
      return this;
    },
    click: function(event) {
      const object = menu[1];
      object.index = ++object.index % object.choices.length;
      object.title_ = object.title.replace('{}', object.choices[object.index]);
      updateFrequency = object.choices[object.index];
      GM_setValue('updateFrequency', updateFrequency);
      menu.forEach(object => GM_unregisterMenuCommand(object.id));
      for (let i = 0; i < menu.length; ++i) {
        menu[i].id = GM_registerMenuCommand(menu[i].title_, menu[i].click, menu[i].options);
      }
    },
  }.init(), {
    title: 'Delete SessionStorage, LocalStorage & Cookies: 《{}》',
    choices: [ 'Yes', 'No' ],
    options: { id: '2', autoClose: false, title: 'Delete sessionStorage, localStorage & cookies before redirecting?' },
    init: function() {
      this.index = Number(!deleteCookies);
      this.title_ = this.title.replace('{}', this.choices[this.index]);
      if (!hideSettings) this.id = GM_registerMenuCommand(this.title_, this.click, this.options);
      return this;
    },
    click: function(event) {
      const object = menu[2];
      object.index = ++object.index & 1;
      object.title_ = object.title.replace('{}', object.choices[object.index]);
      deleteCookies = !object.index;
      GM_setValue('deleteCookies', deleteCookies);
      menu.forEach(object => GM_unregisterMenuCommand(object.id));
      for (let i = 0; i < menu.length; ++i) {
        if (menu[i].hide) continue;
        menu[i].id = GM_registerMenuCommand(menu[i].title_, menu[i].click, menu[i].options);
      }
    },
  }.init(), {
    title: 'Redirect to This Website: 《{}》',
    choices: [ 'Yes', 'No' ],
    options: { id: '3', autoClose: false, title: "Yes: Redirect to this website. No: Don't redirect to this website." },
    init: function() {
      this.index = Number(failedHosts.includes(window.location.hostname));
      this.title_ = this.title.replace('{}', this.choices[this.index]);
      if (!hideSettings) this.id = GM_registerMenuCommand(this.title_, this.click, this.options);
      return this;
    },
    click: function(event) {
      const object = menu[3];
      object.index = ++object.index & 1;
      object.title_ = object.title.replace('{}', object.choices[object.index]);
      const index = failedHosts.indexOf(window.location.hostname);
      if (!object.index) {
        if (index > 0) {
          failedHosts.splice(index, 1);
          GM_setValue('failedHosts', failedHosts);
        }
      } else {
        if (index < 0) {
          failedHosts.push(window.location.hostname);
          GM_setValue('failedHosts', failedHosts);
        }
        if (workingSite === window.location.origin) {
          workingSite = undefined;
          GM_deleteValue('workingSite');
        }
      }
      menu.forEach(object => GM_unregisterMenuCommand(object.id));
      for (let i = 0; i < menu.length; ++i) {
        if (menu[i].hide) continue;
        menu[i].id = GM_registerMenuCommand(menu[i].title_, menu[i].click, menu[i].options);
      }
    },
  }.init(), {
    title: 'Factory Reset: 《{}》',
    choices: [ '💣💣💣', '💣💣', '💣', '💥💥💥' ],
    options: { id: '4', autoClose: false, title: 'Reset everything as if the script was a fresh install?' },
    init: function() {
      this.index = 0;
      this.title_ = this.title.replace('{}', this.choices[this.index]);
      if (!hideSettings) this.id = GM_registerMenuCommand(this.title_, this.click, this.options);
      return this;
    },
    click: function(event) {
      const object = menu[4];
      object.index = ++object.index % object.choices.length;
      object.title_ = object.title.replace('{}', object.choices[object.index]);
      if (!object.index) {
        object.options.autoClose = false;
        GM_deleteValues(['currentHost','deleteCookies','externalOrigins','failedHosts','hideSettings','lastUpdate','preferOrigins','redirectHost','updateFrequency','workingSite']);
        deleteCookies = true;
        failedHosts = [
          'redlib.thebunny.zone',
          'lr.ptr.moe',
          'oratrice.ptr.moe',
        ];
        hideSettings = true;
        preferOrigins = 'external > local';
        updateFrequency = '30 minutes';
        menu.forEach(object => GM_unregisterMenuCommand(object.id));
        for (let i = 0; i < menu.length; ++i) menu[i].init();
        return;
      }
      if (object.index === object.choices.length - 1) object.options.autoClose = true;
      menu.forEach(object => GM_unregisterMenuCommand(object.id));
      for (let i = 0; i < menu.length; ++i) {
        if (menu[i].hide) continue;
        menu[i].id = GM_registerMenuCommand(menu[i].title_, menu[i].click, menu[i].options);
      }
    },
  }.init(), {
    title: '{} Settings',
    choices: [ 'Show', 'Hide' ],
    options: { id: '5', autoClose: false, title: "Show or hide this script's settings." },
    init: function() {
      this.index = Number(!hideSettings);
      this.title_ = this.title.replace('{}', this.choices[this.index]);
      this.id = GM_registerMenuCommand(this.title_, this.click, this.options);
      return this;
    },
    click: function() {
      const object = menu[5];
      object.index = ++object.index & 1;
      object.title_ = object.title.replace('{}', object.choices[object.index]);
      hideSettings = !object.index;
      GM_setValue('hideSettings', hideSettings);
      menu.forEach(object => GM_unregisterMenuCommand(object.id));
      for (let i = (hideSettings) ? menu.length - 1 : 0; i < menu.length; ++i) {
        if (menu[i].hide) continue;
        menu[i].id = GM_registerMenuCommand(menu[i].title_, menu[i].click, menu[i].options);
      }
    },
  }.init()];

})();