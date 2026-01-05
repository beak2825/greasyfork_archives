// ==UserScript==
// @name         GitHub code review helper - open/hide diff on click
// @namespace    http://think.js/
// @version      0.3.4
// @description  Open/hide GitHub diff when clicking on diff header
// @include      http*://github.com/*/*/commit/*
// @include      http*://github.com/*/*/pull/*
// @include      http*://github.com/*/*/compare/*
// @grant none
// @copyright    2013+, Victor Homyakov
// @downloadURL https://update.greasyfork.org/scripts/8669/GitHub%20code%20review%20helper%20-%20openhide%20diff%20on%20click.user.js
// @updateURL https://update.greasyfork.org/scripts/8669/GitHub%20code%20review%20helper%20-%20openhide%20diff%20on%20click.meta.js
// ==/UserScript==

function hasClass(element, className) {
    return element && element.classList && element.classList.contains(className);
}

function isDiffHeader(element) {
    return hasClass(element, 'file-header');
}

function isDiffContent(element) {
    return hasClass(element, 'image') || hasClass(element, 'data') || hasClass(element, 'render-wrapper');
}

function toggle(element) {
    element.hidden = !element.hidden;
    element.style.display = element.hidden ? 'none' : '';
}

document.body.addEventListener('click', function(event) {
    var target = event.target;
    while (target) {
        if (hasClass(target, 'file-actions')) {
            break;
        }
        if (isDiffHeader(target)) {
            var next = target;

            next = next.nextElementSibling;
            if (isDiffContent(next)) {
                toggle(next);
            }

            next = next.nextElementSibling;
            if (isDiffContent(next)) {
                toggle(next);
            }

            break;
        }
        target = target.parentElement;
    }
});
