// ==UserScript==
// @name            GitLab Copy Task Name
// @description     Copy GitLab task names for Flow
// @namespace       Violentmonkey Scripts
// @version         0.2
// @author          Martijn van Berkel
// @match           https://gitlab.com/*/*/boards/*
// @match           https://gitlab.com/*/*/issues/*
// @match           http*://*/*/boards
// @match           http*://*/*/boards?*
// @match           http*://*/*/boards/*
// @match           http*://*/*/issues
// @match           http*://*/*/issues?*
// @match           http*://*/*/issues/*
// @require         https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/562394/GitLab%20Copy%20Task%20Name.user.js
// @updateURL https://update.greasyfork.org/scripts/562394/GitLab%20Copy%20Task%20Name.meta.js
// ==/UserScript==

function copyTaskName() {
    var issueId1 = $('[data-testid="work-item-drawer-ref-link"]').text().trim().split("#")[1];
    var issueId2 = $('.router-link-exact-active').text().trim().split("#")[1];
    var issueId3 = $('.router-link-active').text().trim().split("#")[1];
    var issueId = issueId1 || issueId2 || issueId3 || "";

    var issueName = $('[data-testid="work-item-title"]').text().trim();

    const labels = $('.js-labels .gl-label-text')
        .map(function () {
            return $(this).text().trim();
        })
        .get();

    const containsAndroid = labels.some(label =>
        label.includes('Android')
    );
    const containsiOS = labels.some(label =>
        label.includes('iOS')
    );
    const containsBackend = labels.some(label =>
        label.includes('Backend')
    );

    if (containsAndroid && containsiOS && containsBackend) {
        // ignore
    } else if (containsAndroid && containsiOS) {
        issueName = "(App) " + issueName;
    } else if (containsAndroid) {
        issueName = "(Android) " + issueName;
    } else if (containsiOS) {
        issueName = "(iOS) " + issueName;
    } else if (containsBackend) {
        issueName = "(Backend) " + issueName;
    }

    var taskName = "";

    if (issueId) {
        taskName = "#" + issueId + " - " + issueName;
    } else {
        taskName = issueName;
    }

    navigator.clipboard.writeText(taskName);

    $('#js-copy-task-name-label').text('Copied task name!');
}

var interval = setInterval(function() {
    var targetElement = $('[data-testid="work-item-edit-form-button"]');
    var buttonElement = $('#js-copy-task-name');

    if (targetElement.length > 0 && buttonElement.length === 0) {
        $('<button title="Copy task name" type="button" class="btn gl-button btn-default btn-md btn-default-secondary" id="js-copy-task-name"><!----> <!---->  <span class="gl-button-text" id="js-copy-task-name-label">Copy task name<!----></span></button>').insertBefore($('[data-testid="work-item-edit-form-button"]'));

        $(document).on("click", "#js-copy-task-name", function() {
            copyTaskName();
        });
    }
}, 500);