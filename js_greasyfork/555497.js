// ==UserScript==
// @name         Holotower Alt. Auto Updater
// @namespace    http://holotower.org/
// @version      1.1.3
// @author       anonymous
// @license      CC0
// @description  Alternative auto-updater that adjusts the update interval based on recent activity.
// @icon         https://boards.holotower.org/static/emotes/ina/_tehepero.png
// @match        *://boards.holotower.org/*
// @match        *://holotower.org/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/555497/Holotower%20Alt%20Auto%20Updater.user.js
// @updateURL https://update.greasyfork.org/scripts/555497/Holotower%20Alt%20Auto%20Updater.meta.js
// ==/UserScript==

$(document).ready(function () {
    'use strict';

    if (active_page != 'thread' || $('#ex_update').length > 0) {
        return;
    }

    const UPDATE_INTERVAL_CATEGORIES = [
        { maxAge: 5 * 60, minInterval: 5, maxInterval: 20 }, // <5 min
        { maxAge: 15 * 60, minInterval: 20, maxInterval: 60 },// 5–15 min
        { maxAge: 60 * 60, minInterval: 60, maxInterval: 180 }, // 15–60 min
        { maxAge: 3 * 60 * 60, minInterval: 180, maxInterval: 300 }, // 1–3h
        { maxAge: Infinity, minInterval: 300, maxInterval: 600 }, // >3h
    ];

    let autoUpdate;
    let countdown;
    let countdownHandle = null;

    const reset_interval = function () {
        countdown = get_next_update_interval(recent_post_timestamps);
        clearInterval(countdownHandle);

        countdownHandle = setInterval(decrement_timer, 1000);
        $exUpdateBtn.text('Update (' + countdown + 's)');
    };

    const decrement_timer = function () {
        if (countdown > 0) {
            countdown -= 1;
            $exUpdateBtn.text('Update (' + countdown + 's)');
        } else {
            if (autoUpdate) reset_interval();
            update();
        }
    };

    const datetime_to_timestamp = function (dt) {
        if (!dt) return 0;

        // for whatever reason, datetime is formatted YYYY-MM-DDTHH:MM:SS0 with a 0 at the end instead of YYYY-MM-DD HH:MM:SSZ
        if (dt.length === 20 && dt[dt.length - 1] === '0') {
            dt = dt.slice(0, 19) + 'Z';
        }
        return Date.parse(dt) / 1000;
    };

    const get_initial_recent_posts = function (posts_num = 5) {
        const times = $('.thread time');
        posts_num = Math.min(times.length, posts_num);
        const result = new Array(posts_num);

        for (let i = times.length - 1, r = 0; r < posts_num && i >= 0; i--) {
            let dt = times[i].getAttribute('datetime');
            result[r++] = datetime_to_timestamp(dt);
        }

        return result.reverse();
    };

    const get_next_update_interval = function (timestamps) {
        const now = Math.floor(Date.now() / 1000);

        if (!timestamps || timestamps.length === 0) return 60;

        const ages = [...timestamps]
            .filter(t => !isNaN(t))
            .sort((a, b) => a - b)
            .map(t => now - t);
        const n = ages.length;

        let weightedMin = 0;
        let weightedMax = 0;
        let totalWeight = 0;

        for (let i = 0; i < n; i++) {
            const age = ages[i];
            // power weighting: newest posts dominate
            const weight = Math.pow((i + 1) / n, 2.0);

            const category = UPDATE_INTERVAL_CATEGORIES.find(c => age <= c.maxAge);
            weightedMin += category.minInterval * weight;
            weightedMax += category.maxInterval * weight;
            totalWeight += weight;
        }

        const minI = weightedMin / totalWeight;
        const maxI = weightedMax / totalWeight;

        const newestAge = ages[n - 1];
        const scaleFactor = Math.min(newestAge / (15 * 60), 1);

        const interval = minI + (maxI - minI) * scaleFactor;

        return Math.round(interval);
    };

    const check_thread_active = function (firstCheck = false) {
        // Check for archived thread by the message from the Holotower Thread Status Updater script - solid
        if ($('#archived-msg').length > 0) {
            $exUpdateBtn.text('Thread Archived');
            $exUpdateBtn.attr('disabled', true);
            set_auto_update(false);
            return false;
        }

        // Check for archived thread by number of posts - unreliable (doesn't account for deleted posts)
        const MAX_POSTS_IN_THREAD = 1500;
        const postCount = parseInt($threadStatsPosts.text().trim());

        if (!isNaN(postCount) && postCount >= MAX_POSTS_IN_THREAD) {
            if (firstCheck) {
                // When the page is first loaded
                $exUpdateBtn.text('Thread Archived');
                $exUpdateBtn.attr('disabled', true);
                set_auto_update(false);
                return false;
            } else {
                // On subsequent checks
                if (!$('#ex_archive_warning').length) {
                    $exAutoScroll.parent().after('<span id="ex_archive_warning" class="quote" style="margin-left: 10px;">Thread may be archived - refresh page</span>');
                }
                $exUpdateBtn.attr('disabled', false);
                return true;
            }
        }

        // Deleted thread message by the built-in updater
        if ($updateSecs.text() == 'Thread deleted or pruned') {
            $exUpdateBtn.text('Thread deleted or pruned');
            $exUpdateBtn.attr('disabled', true);
            set_auto_update(false);
            return false;
        }

        return true;
    };

    // Update function called when clicking on button or automatically at intervals
    const update = function () {
        if (!check_thread_active(false)) return;
        $updateBtn.click();
    };

    // Set the value of autoUpdate and the Auto Update checkbox, used on initialization and thread archival/deletion
    const set_auto_update = function (value) {
        autoUpdate = value;
        $exAutoUpdate.prop('checked', autoUpdate);
        $exAutoUpdate.prop('disabled', !autoUpdate);
        if (autoUpdate) {
            reset_interval();
        } else {
            clearInterval(countdownHandle);
        }
    };

    // Add buttons
    $('#updater').before(
        $('<div id="ex_updater">').prepend(
            $('<label style="margin-right: 10px;">Auto</label>')
                .prepend(
                    $('<input type="checkbox" id="ex_auto_update">')
                        .change(function () {
                            autoUpdate = this.checked;
                            if (autoUpdate) {
                                reset_interval();
                            } else {
                                if (countdownHandle) {
                                    clearInterval(countdownHandle);
                                    $exUpdateBtn.text('Update');
                                }
                            }
                        })
                ),
            $('<button id="ex_update">Update</button>').click(function () {
                if (autoUpdate) reset_interval();
                update();
            }),
            $('<label style="margin-left: 6px;">Scroll to New posts</label>')
                .prepend(
                    $('<input type="checkbox" id="ex_autoscroll">').prop('checked', localStorage['autoScroll'] == 'true')
                        .change(function () {
                            $('input.auto-scroll').prop('checked', this.checked);
                        })
                ),
        )
    );

    const $exUpdateBtn = $('#ex_update');
    const $exAutoUpdate = $('#ex_auto_update');
    const $exAutoScroll = $('#ex_autoscroll');
    const $updateBtn = $('#update_thread');
    const $threadStatsPosts = $('#thread_stats_posts');
    const $updateSecs = $('#update_secs');

    const recent_post_timestamps = get_initial_recent_posts();

    // Disable the default auto updater, and hide the entire section
    $('#auto_update_status').prop('checked', false);
    $('#updater').hide();

    $(document).on('new_post', function (e, post) {
        try {
            const dt = $(post).find('time').attr('datetime');
            recent_post_timestamps.push(datetime_to_timestamp(dt));
            if (recent_post_timestamps.length > 5) recent_post_timestamps.shift();

            if (autoUpdate) reset_interval();
        }
        catch (error) { console.error("ExAutoUpdate error:", error) }
    });

    // Start the interval
    const updateSecs = parseInt($updateSecs.text());
    if (!isNaN(updateSecs)) {
        // Default updater is already running
        $exUpdateBtn.text('Update (wait)...');
        $exUpdateBtn.attr('disabled', true);
        $exAutoUpdate.prop('disabled', true);
        setTimeout(() => {
            if (!check_thread_active(true)) return;

            $exUpdateBtn.attr('disabled', false);
            set_auto_update(true);
        }, (updateSecs + 1) * 1000);
    } else {
        set_auto_update(true);
    }
});