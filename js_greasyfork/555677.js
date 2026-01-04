// ==UserScript==
// @name         GC Assist
// @description  A userscript to enhance the geocaching.com experience.
// @author       Konano
// @version      0.0.2
// @license      GNU General Public License v3.0
// @supportURL   https://github.com/Konano/GC-Assist/issues
// @namespace    https://github.com/Konano
// @run-at       document-end
// @match        https://www.geocaching.com/geocache/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555677/GC%20Assist.user.js
// @updateURL https://update.greasyfork.org/scripts/555677/GC%20Assist.meta.js
// ==/UserScript==
(function () {
    'use strict';
    const appendCssStyle = (css, name, id) => {
        if (!css) return;
        const tag = document.head;
        if (!tag) return;
        const style = document.createElement('style');
        style.textContent = `GCAssist{} ${css}`;
        tag.appendChild(style);
    };
    const appendMetaId = (id) => {
        const head = document.head;
        const meta = document.createElement('meta');
        meta.id = id;
        head.appendChild(meta);
    };
    const injectPageScript = (scriptContent, tagName = 'head', idName) => {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.textContent = scriptContent;
        const pageHead = document.querySelector(tagName);
        console.log(tagName, idName);
        pageHead.appendChild(script);
    };
    const dlc = (output) => {
        if (output?.trim()) console.info(`GCAssist: ${output}`);
    };
    const logError = (module = 'Unknown Module', error = {}) => {
        const { message = 'No message', stack = '', stacktrace = '' } = error;
        const error_msg =
            `GCAssist_ERROR - ${module} - ${window.location.href}: ${message}` +
            '\nStacktrace:\n' +
            stack +
            (stacktrace ? '\n' + stacktrace : '');
        console?.error(error_msg);
    };
    const isPage = (name) => {
        let status = false;
        const url = document.location.pathname;
        {
            const isCacheDetails = /^\/(seek\/cache_details\.aspx|geocache\/)/.test(url);
            const hasNoSubmitOrGoBack = !document.querySelector('#cspSubmit') && !document.querySelector('#cspGoBack');
            if (isCacheDetails && hasNoSubmitOrGoBack) {
                status = true;
            }
            if (/^\/geocache\/.*\/log/.test(url)) status = false;
            if (document.querySelectorAll('.UnpublishedCacheSearchWidget').length > 0) status = false;
        }
        return status;
    };
    const mainGCInit = () => {
        dlc('START mainGCInit');
        const waitingForUserData = (waitCount = 0) => {
            if (typeof headerSettings !== 'undefined' && headerSettings?.username) {
                dlc('Global user data headerSettings found');
                user_me = headerSettings.username ?? user_me;
                user_avatarUrl = headerSettings.avatarUrl ?? user_avatarUrl;
                user_locale = headerSettings.locale ?? user_locale;
                user_findCount = headerSettings.findCount ?? user_findCount;
                user_isBasic = headerSettings.isBasic ?? user_isBasic;
            }
            if (typeof chromeSettings !== 'undefined' && chromeSettings?.username) {
                dlc('Global user data chromeSettings found');
                user_me = chromeSettings.username ?? user_me;
                user_avatarUrl = chromeSettings.avatarUrl ?? user_avatarUrl;
                user_locale = chromeSettings.locale ?? user_locale;
                user_findCount = chromeSettings.findCount ?? user_findCount;
                user_isBasic = chromeSettings.isBasic ?? user_isBasic;
            }
            if (typeof _gcUser !== 'undefined' && _gcUser?.username) {
                dlc('Global user data _gcUser found');
                user_me = _gcUser.username ?? user_me;
                if (_gcUser.image?.imageUrl) user_avatarUrl = _gcUser.image.imageUrl.replace(/\{0\}/, 'avatar');
                user_locale = _gcUser.locale ?? user_locale;
                user_findCount = _gcUser.findCount ?? user_findCount;
                if (_gcUser.membershipLevel === 1) user_isBasic = true;
            }
            const nextDataText = $('#__NEXT_DATA__')?.[0]?.innerText;
            if (nextDataText) {
                try {
                    const userdata = JSON.parse(nextDataText);
                    const gcUser = userdata?.props?.pageProps?.gcUser;
                    if (gcUser?.username) {
                        dlc('Global user data userdata.props.pageProps.gcUser found');
                        user_me = gcUser.username ?? user_me;
                        if (gcUser.image?.imageUrl) user_avatarUrl = gcUser.image.imageUrl.replace(/\{0\}/, 'avatar');
                        user_locale = gcUser.locale ?? user_locale;
                        user_findCount = gcUser.findCount ?? user_findCount;
                        if (gcUser.membershipLevel === 1) user_isBasic = true;
                    }
                } catch (e) {
                    logError("Determine user data for id '__NEXT_DATA__'", e);
                }
            }
            if ([user_me, user_avatarUrl, user_locale, user_findCount].every((v) => v !== false)) {
                dlc('All global user data found');
                dlc(`- username: ${user_me} / avatarUrl: ${user_avatarUrl}`);
                dlc(`- findCount: ${user_findCount} / locale: ${user_locale} / isBasic: ${user_isBasic}`);
                mainGC();
            } else if (waitCount < 200) {
                setTimeout(() => waitingForUserData(waitCount + 1), 50);
            } else {
                dlc('STOP not all global user data found');
                dlc(`- username: ${user_me} / avatarUrl: ${user_avatarUrl}`);
                dlc(`- findCount: ${user_findCount} / locale: ${user_locale} / isBasic: ${user_isBasic}`);
            }
        };
        dlc('START waitingForUserData');
        waitingForUserData();
    };
    const mainGC = () => {
        dlc('START mainGC');
        showThumbnails();
    };
    const isMemberInPmoCache = () => isPage() && !!document.querySelector('#premium-upgrade-widget');
    const showThumbnails = () => {
        try {
            const placeToolTip = (element, stop) => {
                $('a.ga_thumb_img:hover span').position({
                    my: 'center bottom',
                    at: 'center top',
                    of: 'a.ga_thumb_img:hover',
                    collision: 'flipfit flipfit',
                });
                if (!stop) {
                    $('a.ga_thumb_img:hover span img').on('load', () => placeToolTip(element, true));
                }
            };
            function buildThumb(link, href, title, showName, topSp) {
                const hrefLarge = /\/large\//.test(href) ? href : href.replace(/\/cache\//, '/cache/large/');
                link.classList.add('ga_thumb_img');
                link.href = hrefLarge.replace(/\/large\//, '/');
                link.onmouseover = placeToolTip;
                let html = `<img src="${hrefLarge.replace(/\/large\//, '/thumb/')}" title="${title}">`;
                if (showName) html += `<br>${title}`;
                const thumbLarge = hrefLarge.replace(/\/large\//, '/thumb/large/');
                html += `<span>#top#<img class="ga_large_img" src="${thumbLarge}" /><br>#bot#</span>`;
                html = html.replace('#top#', '').replace('#bot#', title);
                link.innerHTML = html;
            }
            let css = '';
            if (isPage('cache_listing') && !isMemberInPmoCache()) {
                if (true) {
                    let newImTpl =
                        "<a class='tb_images lnk ga_thumb_img' onmouseover='placeToolTip;' rel='fb_images_${LogID}' href='https://img.geocaching.com/cache/log/${FileName}' title='<span class=&quot;LogImgTitle&quot;>${Name} &nbsp;</span><span class=&quot;LogImgLink&quot;> <a target=&quot;_blank&quot; href=&quot;/seek/log.aspx?LID=${LogID}&amp;IID=${ImageGuid}&quot;>View Log</a></span><br><span class=&quot;LogImgDescription&quot;>${Descr}</span>'>" +
                        "<img title='${Name}' alt='${Name}' src='https://img.geocaching.com/cache/log/thumb/${FileName}'/> " +
                        "<span title=''>#top#<img title='${Descr}' class='ga_large_img' src='https://img.geocaching.com/cache/log/thumb/large/${FileName}'><br>#bot#</span>" +
                        '</a>';
                    newImTpl = newImTpl.replace('#top#', '').replace('#bot#', '${Name}');
                    const code = `
                    function ga_updateTmpl(waitCount) {
                    if (typeof $ !== 'undefined' && typeof $.template !== 'undefined') {
                        delete $.template['tmplCacheLogImages'];
                        $.template("tmplCacheLogImages", "${newImTpl}");
                    } else {
                        waitCount++;
                        if (waitCount <= 50) setTimeout(() => ga_updateTmpl(waitCount), 200);
                    }
                    }
                    ga_updateTmpl(0);
                    ${placeToolTip.toString()}
                `;
                    injectPageScript(code, 'body');
                }
                css += '.CachePageImages li { margin-bottom: 12px; background: unset; padding-left: 0px; }';
                const links = $('.CachePageImages').find('a[href*="img.geocaching.com/cache/"]');
                links.each((i, link) => buildThumb(link, link.href, link.innerHTML, true, '-70px'));
            }
            css += `
        a.ga_thumb_img:hover { white-space: unset; position: relative; }
        a.ga_thumb_img { overflow: visible !important; display: unset !important; max-width: none !important; }
        /* Limit anchor width to its intrinsic content (image + optional caption) inside flex column */
        .LogImagesTable a.ga_thumb_img { display: inline-block !important; width: auto !important; max-width: none !important; align-self: flex-start; }
        a.ga_thumb_img span { white-space: unset !important; visibility: hidden; position: absolute; top: -310px; left: 0px; padding: 2px; text-decoration: none; text-align: left; vertical-align: top; }
        a.ga_thumb_img:hover span { visibility: visible; z-index: 9999; border: 1px solid #8c9e65; background-color: #dfe1d2; text-decoration: none !important; }
        a.ga_thumb_img:hover img { margin-bottom: -4px; }
        a.ga_thumb_img img { margin-bottom: -4px; height: 75px; }
        .ga_large_img { height: unset !important; vertical-align: unset !important; margin-right: 0 !important; max-height: ${settings_hover_image_max_size}px; max-width: ${settings_hover_image_max_size}px; }
        .Clear.LogContent.markdown-output { overflow: visible !important; }
        .Clear.LogContent.markdown-output .LogImagesTable { overflow: visible !important; }
        `;
            appendCssStyle(css);
        } catch (e) {
            logError('Show Thumbnails', e);
        }
    };
    const variablesInit = (t) => {
        dlc('START variablesInit');
        t.user_me = false;
        t.user_isBasic = false;
        t.user_avatarUrl = false;
        t.user_findCount = false;
        t.user_locale = false;
        t.settings_hover_image_max_size = 600;
    };
    const main = (t) => {
        checksBeforeRunning();
        quitOnAdFrames()
            .then(() => variablesInit(t))
            .then(() => {
                const handleBodyContentFound = (observer) => {
                    dlc('BodyContent found');
                    dlc(`URL: ${document.location.href}`);
                    if (observer) observer.disconnect();
                    const url = document.location.href;
                    if (url.match(/^https:\/\/www\.geocaching\.com/)) mainGCInit();
                };
                const observeBodyContent = () => {
                    const targetNode = document.body;
                    const config = { childList: true, subtree: false };
                    const callback = (mutationsList, observer) => {
                        if (document.body.children.length > 1) {
                            handleBodyContentFound(observer);
                        }
                    };
                    const observer = new MutationObserver(callback);
                    observer.observe(targetNode, config);
                    if (document.body.children.length > 1) {
                        handleBodyContentFound(observer);
                    }
                };
                dlc('START observeBodyContent');
                observeBodyContent();
            });
    };
    const checksBeforeRunning = () => {
        /*if (typeof GM.info != "undefined" && typeof GM.info.scriptHandler != "undefined" && GM.info.scriptHandler == 'Greasemonkey') {
            var text = 'Sorry, the script GC little helper II does not run with script manager Greasemonkey. Please use the script manager Tampermonkey or an other similar script manager.\n\nDo you want to see the "Tips for the installation"?\n ';
            var url = 'https://github.com/2Abendsegler/GClh/blob/master/docu/tips_installation.md#en';
            if (window.confirm(text)) window.open(url, '_blank');
            throw Error('Abort because of GClh II installation under script manager Greasemonkey.');
        }
        if (document.getElementsByTagName('head')[0] && document.getElementById('GClh_II_running')) {
            var text = 'Sorry, the script GC little helper II is already running. Please make sure that it runs only once.\n\nDo you want to see tips on how this could happen and what you can do about it?';
            var url = 'https://github.com/2Abendsegler/GClh/blob/master/docu/faq.md#1-en';
            if (window.confirm(text)) window.open(url, '_blank');
            throw Error('Abort because of GClh II already running.');
        } else */ appendMetaId('GC_Assist_running');
    };
    const quitOnAdFrames = () => {
        dlc('START quitOnAdFrames');
        return new Promise((resolve, reject) => {
            const { name } = window;
            if (!name || !name) {
                resolve();
            } else {
                reject();
            }
        });
    };
    main(globalThis);
    dlc('GCAssist main.js loaded.');
})();
