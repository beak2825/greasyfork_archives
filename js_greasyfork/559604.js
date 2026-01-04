// ==UserScript==
// @name            Rule34.xxx Keyboard Shortcuts
// @namespace       861ddd094884eac5bea7a3b12e074f34
// @version         2.4
// @description     Keyboard shortcuts for rule34.xxx: search page navigation, post interactions, and more!
// @author          Anonymous, Claude 4.5 Sonnet, GitHub Copilot (GPT 5 mini, Claude 4.5 Haiku)
// @match           https://rule34.xxx/index.php?page=post&s=view&id=*
// @match           https://rule34.xxx/index.php?page=post&s=list*
// @match           https://rule34.xxx/index.php?page=gmail&s=view&id=*
// @match           https://rule34.xxx/index.php?page=comment&s=user&user=*
// @match           https://rule34.xxx/index.php?page=favorites&s=view&id=*
// @icon            https://www.google.com/s2/favicons?domain=rule34.xxx
// @grant           none
// @license         MIT-0
// @downloadURL https://update.greasyfork.org/scripts/559604/Rule34xxx%20Keyboard%20Shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/559604/Rule34xxx%20Keyboard%20Shortcuts.meta.js
// ==/UserScript==

// TODO:
// - Enhance 'show original' to be 'toggle between sample and original'
//   (possibly with the help of native 'resize image' button?)
// - Number keys
//   - for source and artist navigation
//   - for reverse image search
// - New note (N)

(function() {
    'use strict';

    const PARAMS = new URLSearchParams(window.location.search);
    const ITEMS_PER_PAGE = {
        'comment': 15,
        'post': 42,
        'favorites': 50,
    }

    // proxied buttons
    /////////////////////

    function _submitForm(event) {
        // ripped from danbooru app/javascript/src/javascripts/shortcuts.js
        $(event.target).parents("form").find('[type="submit"]').click();
        event.preventDefault();
    };

    function _voteUp(id) {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status !== 200) return false;
            const score = document.getElementById('psc' + id);
            score.innerHTML = parseInt(xhr.responseText);
        }
        xhr.open('GET', `/index.php?page=post&s=vote&id=${id}&type=up`, true);
        xhr.send(null);
    }

    function _addFave(id) {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status !== 200) return false;
            let noteElement = document.getElementById('notice');
            if (xhr.responseText == '1') {
                noteElement.innerHTML = 'Post already favorited';
            } else if (xhr.responseText == '2') {
                noteElement.innerHTML = 'You are not logged in';
            } else {
                noteElement.innerHTML = 'Post added to favorites';
            }
            noteElement.style.display = ''; // unhide
        }
        xhr.open('GET', `/public/addfav.php?id=${id}`, true);
        xhr.send(null);
    }

    function loadOriginal(elementId) {
        /*
            window.image = {
                'domain': 'https://wimg.rule34.xxx/',
                'width': 2048,
                'height': 1720,
                'dir': 2375,
                'img': '22588922742b34b9059544161a853b39.jpeg',
                'base_dir': 'images',
                'sample_dir': 'samples',
                'sample_width': '850',
                'sample_height': '714'
            };
        */

        const noteElement = document.getElementById('resized_notice');
        if (noteElement.style.display || !Note.sample) return;
        noteElement.style.display = 'none';

        // load original image and resize
        let element = document.getElementById(elementId);
        element.style.display = 'none';
        element.src = 'about:blank';
        element.width = image.width;
        element.height = image.height;
        element.src = [
            `${image.domain}/`,
            `${image.base_dir}/`,
            `${image.dir}/`,
            image.img
        ].join('')

        // reflow notes
        Note.all.invoke('adjustScale');
        Note.sample = false;

        // show original image
        element.style.display = '';
    }

    function openOriginal() {
        const linkList = document.querySelector('div.link-list');
        const anchors = Array.from(linkList.querySelectorAll('a[href]'));
        const anchor = (
            anchors.find(a =>
                a.textContent.includes('Original')
                && /\/images\//.test(a.href)
            )
        );
        const newTab = window.open(anchor.href, '_blank');
        newTab.focus();
    }

    // helpers
    /////////////

    function focusInput(formQuery, fieldQuery) {
        let form = document.querySelector(`form[name="${formQuery}"]`)
        if (!form) form = document.querySelector(`form[id="${formQuery}"]`)
        if (!form) form = document.querySelector(`form[action="${formQuery}"]`)
        if (!form) return null;
        let field = form.querySelector(`input[name="${fieldQuery}"]`);
        if (!field) field = form.querySelector(`input[id="${fieldQuery}"]`);
        if (!field) field = form.querySelector(`textarea[name="${fieldQuery}"]`);
        if (!field) field = form.querySelector(`textarea[id="${fieldQuery}"]`);
        if (!field) return null;
        field.focus();
        return field;
    }

    function clickAnchor(selector) {
        const anchor = document.querySelector(`a[href^='${selector}']`);
        anchor.click();
    }

    function unhideElement(id) {
        const element = document.getElementById(id);
        element.style.removeProperty('display');
    }

    function navigateToPage(pid) {
        const params = new URLSearchParams(window.location.search);
        params.set('pid', pid);
        window.location.href = `${window.location.pathname}?${params.toString()}`;
    }

    // key handlers
    //////////////////

    document.addEventListener('keydown', function(e) {
        if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
        if (e.ctrlKey || e.altKey || e.shiftKey || e.metaKey) return;
        // if (!PARAMS.has('page') && !PARAMS.has('s')) return;

        const page = PARAMS.get('page');
        const s = PARAMS.get('s');
        if ((page === 'post') && s) {
            // if (globalKeyHandler(e)) return;
            if (s === 'list') {
                navigationKeyHandler(e, page);
                searchPageKeyHandler(e);
            } else if (s === 'view' && PARAMS.has('id')) {
                postPageKeyHandler(e, PARAMS.get('id'));
            }
        } else if (page === 'gmail' && s === 'view') {
            mailDetailPageKeyHandler(e);
        } else if (
            (page === 'comment' && s === 'user')
            || (page === 'favorites' && s === 'view')
        ) {
            navigationKeyHandler(e, page);
        }
    });

    // function globalKeyHandler(e) {
    //     const key = e.key.toLowerCase();
    //     if (...) {
    //         ...
    //     } else {
    //         return false;
    //     }
    //     return true;
    // }

    function navigationKeyHandler(e, page) {
        let currentPid = null;
        const key = e.key.toLowerCase();
        if (['arrowleft', 'arrowright'].includes(key)) {
            const params = new URLSearchParams(window.location.search);
            currentPid = parseInt(params.get('pid')) || 0;
        }
        if (key === 'arrowleft') {
            if (currentPid === 0) return;
            e.preventDefault();
            const previous = Math.max(0, currentPid - ITEMS_PER_PAGE[page]);
            navigateToPage(previous);
        } else if (key === 'arrowright') {
            // abort if we're on the last page of the results
            let anchor = document.querySelector("a[name='lastpage']") || false;
            if (!anchor)
                anchor = document.querySelector("a[alt='last page']") || false;
            if (anchor === null)
                return;

            e.preventDefault();
            navigateToPage(currentPid + ITEMS_PER_PAGE[page]);
        }
    }

    function searchPageKeyHandler(e) {
        const key = e.key.toLowerCase();
        if (key === 'q') {
            e.preventDefault();
            const field = focusInput('index.php?page=search', 'tags');
            if (e.shiftKey) field.select();
        }
    }

    function postPageKeyHandler(e, id) {
        const key = e.key.toLowerCase();
        // submit (ctrl+return)
        if (e.ctrlKey && key === 'return') {
            _submitForm();
        // upvote (W/v)
        // TODO: repurpose v key for reflowing media to viewport
        } else if ((e.shiftKey && key === 'w') || key === 'v') {
            _voteUp(id);
        // add to favorites (f)
        } else if (key === 'f') {
            e.preventDefault(); // prevent fullscreen when video player focused
            _voteUp(id);
            _addFave(id);
        // comment (c)
        } else if (key === 'c') {
            e.preventDefault();
            unhideElement('comment_form');
            focusInput('comment_form', 'comment');
        // edit tags (e)
        } else if (key === 'e') {
            e.preventDefault();
            unhideElement('edit_form');
            focusInput('edit_form', 'tags');
        // upscale/load original (u/z)
        } else if (['u', 'z'].includes(key)) {
            loadOriginal('image');
        // open original in new foreground tab (o)
        } else if (key === 'o') {
            openOriginal();
        // view tag history (h)
        } else if (key === 'h') {
            window.location.href = [
                '/index.php?page=history',
                '&type=tag_history',
                `&id=${id}`
            ].join('');
        // cum on post (F/C)
        } else if (e.shiftKey && ['f', 'c'].includes(key)) {
            // TODO: reproduce logic
            iCame(id);
        // // open source (if assigned, in new foreground tab)
        // } else if (key === '1') {
        //     // ...
        // // search artist (if assigned, first tag link)
        // } else if (key === '2') {
        //     // ...
        // // search SauceNao (with original image link)
        // } else if (key === '3') {
        //     // ...
        // // search Fluffle (with original image link)
        // } else if (key === '4') {
        //     // ...
        }
    }

    function mailDetailPageKeyHandler(e) {
        const key = e.key.toLowerCase();
        // respond (r)
        if (key === 'r') {
            submitform();
        // report (R)
        } else if (e.shiftKey && key === 'r') {
            const selector = 'index.php?page=gmail&s=manage&action=report';
            clickAnchor(selector);
        // delete (D)
        } else if (e.shiftKey && key === 'd') {
            const selector = 'index.php?page=gmail&s=manage&action=delete';
            clickAnchor(selector);
        }
    }
})();