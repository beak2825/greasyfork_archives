// ==UserScript==
// @name         AO3: Mark For Later, Subscribe, Download from work lists
// @namespace    https://greasyfork.org/en/users/906106-escctrl
// @description  in work lists, have direct access to Mark For Later, Subscribe, and Download buttons
// @author       escctrl
// @version      1.2
// @match        *://*.archiveofourown.org/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560573/AO3%3A%20Mark%20For%20Later%2C%20Subscribe%2C%20Download%20from%20work%20lists.user.js
// @updateURL https://update.greasyfork.org/scripts/560573/AO3%3A%20Mark%20For%20Later%2C%20Subscribe%2C%20Download%20from%20work%20lists.meta.js
// ==/UserScript==

'use strict';

// utility to reduce verboseness
const q = (selector, node=document) => node.querySelector(selector);
const qa = (selector, node=document) => node.querySelectorAll(selector);
const ins = (n, l, html) => n.insertAdjacentHTML(l, html);

if (window.self !== window.top ||                 // stop if the script is running in an iFrame
    !q('body').classList.contains('logged-in') || // stop if not logged in
    qa('.index.group .blurb').length === 0 ) {    // stop if there's no work list
    return;
}
let auth = q('head meta[name="csrf-token"]').content; // grab the authenticity token
let user = q('#greeting li.dropdown > a[href^="/users/"]').href // grab the username-url
let btn = null; // placeholder for the button that was last clicked by user
let now = Date.now();

ins(q('head'), 'beforeend', `<style type="text/css">.index.group .blurb .work.actions { clear: both; }
.download li { padding-left: 0; }</style>`);

// hidden iframe so we don't refresh the page and lose our place
ins(q('body'), 'afterbegin', `<iframe name="hiddenframe" id="hiddenframe" style="display: none"></iframe>`);
let frame = q('#hiddenframe');

// is this the Mark For Later page?
let page = q('#main').classList.contains('readings-index') && qa('#main a[href$="readings?show=to-read"]').length === 0 ? "MFL" : "";

for (let work of qa('.index.group .blurb.group:not(.user)')) {

    // don't print buttons on own works
    if (work.classList.contains('own')) continue;

    let mfl = ``, sub = ``, dl = ``;

    // grab the work ID, or if it's not a work, the series ID
    let wID = work.className.match(/work-(\d+)/);

    if (wID === null) {
        let sID = work.className.match(/series-(\d+)/);

        // build the Subscribe button for Series
        sub = `<li class="subscribe">
        <form class="ajax-create-destroy" id="new_subscription" data-create-value="Subscribe" data-destroy-value="Unsubscribe" action="${user}/subscriptions"
            accept-charset="UTF-8" method="post" target="hiddenframe">
            <input type="hidden" name="authenticity_token" value="${auth}" autocomplete="off">
            <input autocomplete="off" type="hidden" value="${sID[1]}" name="subscription[subscribable_id]" id="subscription_subscribable_id">
            <input autocomplete="off" type="hidden" value="Series" name="subscription[subscribable_type]" id="subscription_subscribable_type">
            <input type="submit" name="commit" value="Subscribe">
        </form></li>`;
    }
    else {

        // build the Mark for Later button. on the MFL page, build instead the Mark as Read button
        mfl = `<li class="mark">
        <form class="button_to" method="post" target="hiddenframe" action="/works/${wID[1]}/${ (page === "MFL") ? "mark_as_read" : "mark_for_later" }">
            <input type="hidden" name="_method" value="patch" autocomplete="off">
            <input type="hidden" name="authenticity_token" value="${auth}">
            <button type="submit">${ (page === "MFL") ? "Mark as Read" : "Mark for Later" }</button>
        </form></li>`;

        // build the Subscribe button for Works
        sub = `<li class="subscribe">
        <form class="ajax-create-destroy" id="new_subscription" data-create-value="Subscribe" data-destroy-value="Unsubscribe" action="${user}/subscriptions"
            accept-charset="UTF-8" method="post" target="hiddenframe">
            <input type="hidden" name="authenticity_token" value="${auth}" autocomplete="off">
                <input autocomplete="off" type="hidden" value="${wID[1]}" name="subscription[subscribable_id]" id="subscription_subscribable_id">
                <input autocomplete="off" type="hidden" value="Work" name="subscription[subscribable_type]" id="subscription_subscribable_type">
            <input type="submit" name="commit" value="Subscribe">
        </form></li>`;

        // build the Download button
        let title = q('.heading a[href^="/works/"]', work).innerText;
        title = title.toLowerCase().replaceAll(/[^\w ]/ig, "").replaceAll(" ", "_");
        dl = `<li class="download"><noscript><h4 class="heading">Download</h4></noscript>
            <button class="collapsed">Download</button>
            <ul class="expandable secondary hidden">
                <li><a href="/downloads/${wID[1]}/${title}.azw3?updated_at=${now}">AZW3</a></li>
                <li><a href="/downloads/${wID[1]}/${title}.epub?updated_at=${now}">EPUB</a></li>
                <li><a href="/downloads/${wID[1]}/${title}.mobi?updated_at=${now}">MOBI</a></li>
                <li><a href="/downloads/${wID[1]}/${title}.pdf?updated_at=${now}">PDF</a></li>
                <li><a href="/downloads/${wID[1]}/${title}.html?updated_at=${now}">HTML</a></li>
            </ul>
        </li>`;
    }

    // add to the blurb
    if (qa('ul.actions', work).length === 0) {
        ins(work, 'beforeend', `<ul class="actions work navigation" role="navigation"></ul>`);
    }
    ins(qa('ul.actions', work)[0], 'afterbegin', mfl + sub + dl);
}

// remember which button was clicked last (delegated)
q('body').addEventListener('click', (e) => {
    if (e.target.closest('.mark [type=submit], .subscribe [type=submit]')) {
        btn = e.target;
    }
    else if (e.target.closest('.download button')) {
        btn = e.target;
        btn.classList.toggle('expanded');
        btn.classList.toggle('collapsed');
        btn.nextElementSibling.classList.toggle('hidden');
    }
});

// form submission gets sent to iframe. catch the response in there to display success/errors
frame.addEventListener("load", () => {
    let framedoc = frame.contentDocument || frame.contentWindow.document;
    if (framedoc.URL === "about:blank") return; // empty document when the frame first loads - ignore

    let response = qa('#main > .flash.notice', framedoc).item(0)?.innerText;
    // response contains .flash.notice -> AO3 tried to do the thing. check that it was successful
    if (response !== null && response.match(/^(You are now following|This work was added|This work was removed)/) !== null ) {
        // change the button text for success
        if (btn.tagName === "INPUT") btn.value = btn.value + " ✓";
        else btn.innerText = btn.innerText + " ✓";
        btn.title = "";
    }
    // response that doesn't contain a .flash.notice -> an error like retry later, cloudflare, or response with .flash.error
    else {
        // change the button text for error
        if (btn.tagName === "INPUT") btn.value = btn.value + " ✗";
        else btn.innerText = btn.innerText + " ✗";
        btn.title = "That didn't work. Please try again.";
    }
});