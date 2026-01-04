// ==UserScript==
// @name           Real-Debrid Download Helper
// @namespace      http://tampermonkey.net/
// @version        1.0
// @author         UnderPL (original by kuehlschrank and updated version by Ramses)
// @description    Downloads files, copies URLs and queues magnet links.
// @include        http*
// @grant          GM_registerMenuCommand
// @grant          GM_openInTab
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_xmlhttpRequest
// @grant          GM_setClipboard
// @connect        real-debrid.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/558312/Real-Debrid%20Download%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/558312/Real-Debrid%20Download%20Helper.meta.js
// ==/UserScript==

'use strict';

// Will be set dynamically from Real-Debrid hosts/regex endpoint
var re = null;

// Cache key + TTL (1 week)
const RD_REGEX_CACHE_KEY = 'rd_regex_cache_v1';
const RD_REGEX_CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

// Cheap host-hint filter to avoid running the massive regex on every link.
let HOST_HINTS = [];

const PROCESSED_ATTR = 'data-adh-processed';

const DEFAULT_SERVICE = {
    headers: function (h) { return h; },
    magnet: null,
    post: null
};

const service = Object.assign({}, DEFAULT_SERVICE, {
    name: 'RealDebrid',
    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAMAAABhq6zVAAABEVBMVEUlJSUiISIaGhonJycdHR0pKipCQUJDQ0MzMzIBAgE6OTkwMDFubWknKCgxNTEpLCwqKSZKSkoUExoLJBI/Pz+GhX49PTu8u65nZmJ2dXDv7dionopraV8nLzImKiscKB4fHyYgMSYgMC4mJzMlLTkKCgwTIxczOywPDyMQHSQgJjs8OURUVE90gnPe3th+fnYmJClZWVfd2sq7t6iBgHj69+POzsyGknx4eHDX1cyQj4bb2tHCvreBfYLf3dR3d4Dr6dnJx7j19OzHxLZeXlz6+fBud28fHw+enYWioJLVzrmclX6lopLW09C9taTn5t+LhnklJRW0s5rX1L9ARk6urY40JRvRy7xZRDS+sqM3NjUYasLVAAAAlklEQVQI1xXBBRaCQAAFwA+C7BK2knZ3d3d33/8iPmfg9vnswr8guEGgKDyReCcviQgsOuUqRLkhSwTabFofWdZZbakidMNFT+b+QNmaH9pyfvx+drcr3fYgT+zD98t80nXfD71ZoYP7xdh0SwSBAjz58WPVLqY5MEmO8WRyWa835QDDciwXiSdi0TBAbIBLUUJBJ+/4AVyyEd2aDSSWAAAAAElFTkSuQmCC',
    headers: function (h) {
        const t = GM_getValue('realdebrid_token');
        if (t) h['Authorization'] = 'Bearer ' + t;
        return h;
    },
    magnet: 'http://www.real-debrid.com/torrents',
    api: function () {
        return 'https://api.real-debrid.com/rest/1.0/unrestrict/link';
    },
    post: 'link=%s',
    ref: 'https://www.real-debrid.com/',
    parse: function (text) {
        const o = JSON.parse(text);
        return {
            url: o.download ? o.download : null,
            size: o.filesize,
            error: o.error === 'bad_token'
                ? 'Bad API token - Click user script command "Set RealDebrid API token"'
                : o.error
        };
    }
});

function getCurrentService() {
    return service;
}

function normalizeRdPattern(pattern) {
    if (!pattern || typeof pattern !== 'string') return null;

    pattern = pattern.trim();

    // Real-Debrid patterns all use this form
    const proto = '(http|https):\\/\\/';

    const idx = pattern.indexOf(proto);
    if (idx >= 0) {
        // Keep only from the protocol onward, so it matches full URLs like https://host/...
        pattern = pattern.slice(idx);
    } else {
        // If for some reason there's no standard proto, bail out to avoid breaking the union regex
        return null;
    }

    return pattern;
}


function extractHostHintsFromPatterns(patterns) {
    const set = new Set();
    const domainRe = /([a-z0-9\-]+(?:\\\.[a-z0-9\-]+)+)/ig; // captures things like "uptobox\\.com", "mega\\.co\\.nz"

    patterns.forEach(p => {
        if (!p) return;
        let m;
        while ((m = domainRe.exec(p)) !== null) {
            const raw = m[1];
            // Convert "uptobox\\.com" -> "uptobox.com"
            const host = raw.replace(/\\\./g, '.');
            if (host && host.indexOf('.') !== -1) {
                set.add(host.toLowerCase());
            }
        }
    });

    return Array.from(set);
}

function buildUnionRegexFromPatterns(patterns) {
    if (!patterns || !patterns.length) return null;

    // Wrap each in a non-capturing group to keep precedence safe when joining with |
    const parts = patterns
        .map(normalizeRdPattern)
        .filter(Boolean);

    if (!parts.length) return null;

    const source = '(?:' + parts.join(')|(?:') + ')';

    try {
        return {
            regex: new RegExp(source, 'i'),
            source: source
        };
    } catch (e) {
        return null;
    }
}

function loadRdRegexCache() {
    const raw = GM_getValue(RD_REGEX_CACHE_KEY);
    if (!raw) return null;

    try {
        const cache = JSON.parse(raw);
        if (!cache || typeof cache !== 'object') return null;

        const age = Date.now() - (cache.ts || 0);
        if (age > RD_REGEX_CACHE_TTL_MS) {
            // Expired; we can still use it as a fallback for this run,
            // but we should refresh in the background.
            cache.expired = true;
        }
        return cache;
    } catch (e) {
        return null;
    }
}

function saveRdRegexCache(patterns, unionSource, hostHints) {
    try {
        const cache = {
            ts: Date.now(),
            patterns: patterns,
            union: unionSource,
            hostHints: hostHints
        };
        GM_setValue(RD_REGEX_CACHE_KEY, JSON.stringify(cache));
    } catch (e) {
    }
}

function fetchRdRegexList(callback) {
    GM_xmlhttpRequest({
        method: 'GET',
        url: 'https://api.real-debrid.com/rest/1.0/hosts/regex',
        onload: function (r) {
            try {
                const arr = JSON.parse(r.responseText);
                if (!Array.isArray(arr)) {
                    callback(new Error('Invalid RD regex response'), null);
                    return;
                }
                callback(null, arr);
            } catch (e) {
                callback(e, null);
            }
        },
        onerror: function () {
            callback(new Error('HTTP error'), null);
        }
    });
}

function applyRdPatternsAndUpdateCache(patterns) {
    if (!patterns || !patterns.length) return;

    const built = buildUnionRegexFromPatterns(patterns);
    if (!built || !built.regex) return;

    re = built.regex;

    const hints = extractHostHintsFromPatterns(patterns);
    HOST_HINTS = hints;

    saveRdRegexCache(patterns, built.source, hints);
}

function initRealDebridRegex() {
    // 1. Try cache
    const cache = loadRdRegexCache();
    if (cache && cache.union) {
        try {
            re = new RegExp(cache.union, 'i');
            HOST_HINTS = Array.isArray(cache.hostHints) ? cache.hostHints : [];
        } catch (e) {
        }
    }

    // 2. If cache missing or marked expired, refresh in background
    if (!cache || cache.expired || !cache.union) {
        fetchRdRegexList(function (err, patterns) {
            if (err || !patterns || !patterns.length) {
                return;
            }
            applyRdPatternsAndUpdateCache(patterns);
        });
    }
}

function forceRefreshRdRegex() {
    alert('Refreshing Real-Debrid host regex list from API...');
    fetchRdRegexList(function (err, patterns) {
        if (err || !patterns || !patterns.length) {
            alert('Failed to refresh Real-Debrid regex list (network or API error).');
            return;
        }
        applyRdPatternsAndUpdateCache(patterns);
        alert('Real-Debrid regex list has been refreshed. Reload the page to re-scan links.');
    });
}

function getAutoStart() {
    return !!GM_getValue('auto_start', true);
}

function toggleAutoStart() {
    const current = getAutoStart();
    GM_setValue('auto_start', !current);
    alert('Auto-start downloads is now ' + (!current ? 'ON' : 'OFF'));
}

function likelyHasFilehostUrl(href) {
    if (!href) return false;

    // If we don't have any hints yet, don't block matching – let the main regex handle it.
    if (!HOST_HINTS || HOST_HINTS.length === 0) return true;

    href = href.toLowerCase();
    for (let i = 0; i < HOST_HINTS.length; i++) {
        const hint = HOST_HINTS[i];
        if (hint && href.indexOf(hint) !== -1) return true;
    }
    return false;
}

function main() {
    if (re && typeof re.test === 'function' && re.test(location.href)) {
        window.setTimeout(insertBar, 1000);
    } else if (location.hash.indexOf('#magnet') === 0) {
        const inp = document.body.querySelector(
            'input[name="magnet"], input[name="url"], textarea[name="links"]'
        );
        if (inp) {
            inp.value = decodeURIComponent(location.hash.substr(1));
            location.hash = '';
            const btn = document.getElementById('downloadbutton');
            if (btn) {
                btn.click();
            } else if (inp.form) {
                inp.form.submit();
            }
        }
    } else {
        insertIcons(document.body);
        new MutationObserver(onMutations).observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['href']
        });
    }
}

function onMutations(muts) {
    for (let i = muts.length - 1, mut; i >= 0 && (mut = muts[i]); i--) {
        if (mut.type === 'attributes') {
            insertIcons(mut.target);
        } else {
            for (let j = mut.addedNodes.length - 1, node; j >= 0 && (node = mut.addedNodes[j]); j--) {
                if (node.nodeType === 1) insertIcons(node);
            }
        }
    }
}

function insertIcons(parent) {
    let list = parent.tagName === 'A'
        ? [parent]
        : parent.querySelectorAll(
            location.pathname.indexOf('/folder/') > -1 ? 'a[href]' : 'a[href^="http"]'
        );

    for (let i = list.length - 1, a; i >= 0 && (a = list[i]); i--) {
        const href = a.href;
        if (!href) continue;

        if (a.getAttribute(PROCESSED_ATTR) === '1') continue;

        // Quick host-hint prefilter to avoid hammering with huge regex on irrelevant links
        if (!likelyHasFilehostUrl(href)) continue;

        // Only apply the RD regex if it exists and compiled successfully.
        // If it's missing or broken, we still rely on HOST_HINTS.
        if (re && typeof re.test === 'function') {
            if (!re.test(href) || /\b(folder|ref)\b|translate\.google|webcache\.google/.test(href)) {
                continue;
            }
        } else {
            // No regex, but still skip obvious noise
            if (/\b(folder|ref)\b|translate\.google|webcache\.google/.test(href)) {
                continue;
            }
        }


        if (!insertIcon(a, onWebClick, '')) continue;

        a.setAttribute(PROCESSED_ATTR, '1');

        const tc = a.textContent;
        if (!tc) continue;

        if (/(?:k2s|keep2s(?:hare)?)\.cc\/file\/[a-z0-9]+$/i.test(href) &&
            /^[a-z0-9\., _-]+\.[a-z2-4]{3}$/i.test(tc)) {
            a.href += '/' + tc.trim().replace(/\s+/g, '_');
        }

        if (
            a.href.indexOf(tc) > -1 ||
            /^\s*download/i.test(tc) ||
            (re && typeof re.test === 'function' && re.test(tc))
        ) {
            const p = (a.search.length > 1 ? a.search.substr(1) : a.pathname).replace(/(\.html|\/)$/, '');
            const h = a.hostname;
            const fp = p.substr(p.lastIndexOf('/') + 1);
            if (fp) {
                a.textContent = fp + ' @ ' + h.substr(0, h.lastIndexOf('.')).replace('www.', '');
                a.title = tc;
            }
        }
    }

    list = parent.tagName === 'A' && parent.href.indexOf('magnet:') === 0
        ? [parent]
        : parent.querySelectorAll('a[href^="magnet:"]');

    for (let i = list.length - 1, a; i >= 0 && (a = list[i]); i--) {
        if (a.getAttribute(PROCESSED_ATTR) === '1') continue;
        insertIcon(a, onMagnetClick, '');
        a.setAttribute(PROCESSED_ATTR, '1');
    }
}

function insertIcon(a, handler, title) {
    const ns = a.nextElementSibling;
    if (a.classList.contains('adh-link') || (ns && ns.classList.contains('adh-link'))) return;

    if (!insertIcon.styled) {
        updateStyle();
        insertIcon.styled = true;
    }

    const icon = document.createElement('a');
    icon.className = 'adh-link adh-ready' + (handler === onMagnetClick ? ' adh-magnet' : '');

    if (handler === onWebClick) {
        icon.title = [
            'Click: unrestrict & open',
            'Ctrl+Click: unrestrict only',
            'Middle-click: copy direct URL(s)'
        ].join('\n');
    } else {
        icon.title = title || '';
    }

    icon.addEventListener('mousedown', handler);
    icon.addEventListener('click', drop);
    a.parentNode.insertBefore(icon, a.nextSibling);
    return true;
}

function updateStyle() {
    let style = document.getElementById('adh-style');
    let inserted = false;

    if (!style) {
        style = document.createElement('style');
        style.id = 'adh-style';
        style.type = 'text/css';
        document.head.appendChild(style);
        inserted = true;
    }

    const s = getCurrentService();

    style.textContent = '\
#adh-bar { position:fixed;z-index:2147483647;top:-1px;left:350px;right:350px;padding:0;height:20px;border-radius:0 0 5px 5px;background-color:white;border:1px solid gray;margin:0;text-align:center;font-weight:bold;font-family:sans-serif;color:black;font-size:14px;line-height:18px;text-shadow:none; }\
#adh-bar > a:first-of-type { display:none; }\
a.adh-link { display:inline-block!important; width:12px!important; height:12px!important; position:relative!important; bottom:-2px!important; margin:0 0 0 4px!important; box-sizing:content-box!important; border:1px solid gray!important; padding:0!important; box-shadow:none!important; border-radius:0!important; opacity:0.6; cursor:pointer; }\
a.adh-link:hover { opacity:1; }\
a.adh-ready { background: url(' + s.icon + ') no-repeat !important; }\
a.adh-busy { background: url(data:image/gif;base64,R0lGODlhDAAMAKIGAIForORZKAgSEz9PUFDH4AOeyf///wAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQJFAAGACwAAAAADAAMAAADK2g6rFbQseFgkU3ZCqfjhfc9XWYQaCqsQZuqrPsSq9AGmwLsoLMDPR1PkQAAIfkECRQABgAsAAAAAAwADAAAAyhoutX7qhX4JGsj68Cl3h32DVxAnEK6AOxJpMLaoqrCAq4F5c5+6o8EACH5BAkUAAYALAAAAAAMAAwAAAMqWGqsxcZB2VZ9kI0dOvjQNnTBB4Sc9wmsmDGs4L7xnBF4Thm5bvE9wi4BACH5BAkUAAYALAAAAAAMAAwAAAMrWGrc+qU5GKV5Io8NesvCNnTAp3EeIzZB26xMG7wb61pErj+Nvi8MX+6RAAAh+QQJFAAGACwAAAAADAAMAAADKlhqrMXGQdlWfZCNHTr40DZ0wQeEnPcJrJgxrOC+8ZwReE4ZuW7xPcIuAQAh+QQFFAAGACwAAAAADAAMAAADKGi61fuqFfgkayPrwKXeHfYNXECcQroA7EmkwtqiqsICrgXlzn7qjwQAOw==) no-repeat white !important; }\
a.adh-download { background: url(data:image/gif;base64,R0lGODlhDAAMALMKAHi2EqnbOnqzKFmbHYS7J3CrJFmOGWafHZLELaLVL////wAAAAAAAAAAAAAAAAAAACH5BAEAAAoALAAAAAAMAAwAAAQ7UElDq7zKpJ0MlkMiAMnwKSFBlGe6mtIhH4mazDKXIIh+KIUdb5goXAqBYc+IQfKKJ4UgERBEJQIrJgIAOw==) no-repeat white !important; }\
a.adh-magnet { ' + (s.magnet || GM_getValue('magnet') || !inserted ? '' : 'display:none!important;') + ' }\
a.adh-error { background:url(data:image/gif;base64,R0lGODlhDAAMAIAAAP///8wzACH5BAAAAAAALAAAAAAMAAwAAAIRjI+pGwBsHGwPSlvnvIzrfxQAOw==) no-repeat !important; }';
}

function insertBar() {
    updateStyle();
    const bar = document.createElement('div');
    bar.id = 'adh-bar';
    bar.textContent = 'Unrestricted direct link : ';
    const a = document.createElement('a');
    a.href = location.href;
    bar.appendChild(a);
    document.body.appendChild(bar);
    insertIcons(a);
}

function drop(e) {
    e.stopPropagation();
    e.preventDefault();
}

function onWebClick(e) {
    if (e.which > 2) return;
    drop(e);

    const sel = window.getSelection();

    if (sel.rangeCount && sel.getRangeAt(0).toString()) {
        const list = document.body.querySelectorAll('a.adh-link:not(.adh-download)');
        for (let i = list.length - 1, a; i >= 0 && (a = list[i]); i--) {
            if (sel.containsNode(a.previousSibling, true)) {
                unlock(a, false, true);
            }
        }
    } else if (e.which === 2) {
        // Middle-click = copy URL(s)
        unlock(this, false, true);
    } else {
        // Left click: start download unless Ctrl
        unlock(this, !e.ctrlKey, e.ctrlKey);
    }
}

function onMagnetClick(e) {
    e.stopPropagation();
    if (e.which !== 1) return;
    const s = getCurrentService();
    const urls = (GM_getValue('magnet') || s.magnet || '').split('|');
    const param = encodeURIComponent(this.previousSibling.href);
    for (let i = urls.length - 1, url; i >= 0 && (url = urls[i].trim()); i--) {
        GM_openInTab(
            url.indexOf('%s') > -1
                ? url.replace('%s', param)
                : url + '#' + param
        );
    }
}

async function unlock(a, start, copy) {
    a.className = 'adh-link adh-busy';

    if (copy && !requestUnrestrict.pending) {
        unlock.links = [];
    }

    const rawUrl = a.previousSibling.href.replace(/https?:\/\/(hide|blank)refer.com\/\?/, '');

    const data = await requestUnrestrict(rawUrl);

    if (data.error) {
        a.className = 'adh-link adh-error';
        a.title = data.error;
    } else {
        a.className = 'adh-link adh-download';
        a.href = data.url;
        a.removeEventListener('mousedown', onWebClick, false);
        a.removeEventListener('click', drop, false);
        a.title = data.size ? Math.round(parseInt(data.size, 10) / 1048576) + ' MB' : '';
        a.rel = 'noreferrer';
        if (copy) unlock.links.push(data.url);
        const autoStart = getAutoStart();
        if (start && autoStart) {
            location.href = data.url;
        }
    }

    if (!requestUnrestrict.pending && unlock.links && unlock.links.length) {
        const joined = unlock.links.join('\n');
        if (typeof GM_setClipboard === 'function') {
            GM_setClipboard(joined);
        } else {
            window.alert(joined);
        }
    }
}

function requestUnrestrict(url) {
    const s = getCurrentService();
    const headers = {
        Referer: s.ref,
        'Content-Type': s.post
            ? 'application/x-www-form-urlencoded; charset=UTF-8'
            : ''
    };

    if (typeof requestUnrestrict.pending === 'undefined') {
        requestUnrestrict.pending = 0;
    }
    requestUnrestrict.pending++;

    return new Promise((resolve) => {
        GM_xmlhttpRequest({
            method: s.post ? 'POST' : 'GET',
            url: s.api(url),
            data: s.post ? s.post.replace('%s', encodeURIComponent(url)) : null,
            headers: s.headers ? s.headers(headers) : headers,
            onload: function (r) {
                requestUnrestrict.pending--;
                try {
                    resolve(s.parse(r.responseText));
                } catch (ex) {
                    resolve({ error: 'Parse error' });
                }
            },
            onerror: function () {
                requestUnrestrict.pending--;
                resolve({ error: 'HTTP error' });
            }
        });
    });
}


function setMagnet() {
    const url = window.prompt(
        'Type URL for magnet links handling, ex. http://bytebx.com/add?url=%s.\n' +
        'Omit %s to activate automatic form fill. Use | to separate multiple URLs. ' +
        'Leave blank to restore default',
        GM_getValue('magnet', '')
    );
    if (typeof url === 'string') {
        GM_setValue('magnet', url.trim());
    }
}

function setRealDebridToken() {
    const t = window.prompt(
        'Type private API token. You can find it here : https://real-debrid.com/apitoken',
        GM_getValue('realdebrid_token')
    );
    if (typeof t === 'string') {
        GM_setValue('realdebrid_token', t.trim());
    }
}

// Register menu commands once in the top window only
if (window.top === window.self) {
    GM_registerMenuCommand('Set custom torrent converter', setMagnet);
    GM_registerMenuCommand('Set RealDebrid API token', setRealDebridToken);
    GM_registerMenuCommand('Toggle auto-start downloads', toggleAutoStart);
    GM_registerMenuCommand('Force refresh Real-Debrid host regex', forceRefreshRdRegex);
}

initRealDebridRegex();
window.setTimeout(main, 100);