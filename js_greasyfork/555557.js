// ==UserScript==
// @name         IvyLearn Discussion Progress
// @version      1.0
// @description  Shows progress on discussion assignments in IvyLearn
// @author       j01t3d
// @namespace    https://github.com/j01t3d/ivylearn-discussion-progress
// @match        https://ivylearn.ivytech.edu/courses/*/assignments
// @grant        GM_xmlhttpRequest
// @connect      ivylearn.ivytech.edu
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555557/IvyLearn%20Discussion%20Progress.user.js
// @updateURL https://update.greasyfork.org/scripts/555557/IvyLearn%20Discussion%20Progress.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const courseID = location.pathname.match(/courses\/(\d+)/)?.[1];

    let userID = 0;
    const discussionProgress = {};

    GM_xmlhttpRequest({
        method: "GET",
        url: "https://ivylearn.ivytech.edu/api/v1/users/self",
        onload: function(response) {
            const data = JSON.parse(response.responseText);
            userID = data.id;
            fetchDiscussions();
        }
    });

    function fetchDiscussions() {
        GM_xmlhttpRequest({
            method: "GET",
            url: `https://ivylearn.ivytech.edu/api/v1/courses/${courseID}/discussion_topics`,
            onload: function(response) {
                const topics = JSON.parse(response.responseText);
                const discussions = topics.filter(d => d.title && d.title.toLowerCase().includes("discussion"));

                if (discussions.length === 0) return;

                let completed = 0;
                discussions.forEach(d => {
                    fetchDiscussionProgress(d, () => {
                        completed++;
                        if (completed === discussions.length) {
                            waitForAssignments();
                        }
                    });
                });
            }
        });
    }

    function fetchDiscussionProgress(discussion, callback) {
        GM_xmlhttpRequest({
            method: "GET",
            url: `https://ivylearn.ivytech.edu/api/v1/courses/${courseID}/discussion_topics/${discussion.id}/view`,
            onload: function(resp) {
                const text = resp.responseText.trim();
                let initialPostMade = false;
                let replyCount = 0;

                if (text !== "require_initial_post") {
                    const data = JSON.parse(text);
                    const viewData = data.view || [];
                    viewData.forEach(post => {
                        if (post.user_id === userID) initialPostMade = true;
                        if (post.replies) {
                            post.replies.forEach(reply => {
                                if (reply.user_id === userID) replyCount++;
                            });
                        }
                    });
                }

                const totalPostsRequired = 4;
                const progress = Math.min(((initialPostMade ? 1 : 0) + replyCount) / totalPostsRequired, 1);
                discussionProgress[discussion.title.trim()] = Math.round(progress * 100);

                if (callback) callback();
            },
            onerror: function() {
                if (callback) callback();
            }
        });
    }

    function waitForAssignments() {
        let interval;

        const observer = new MutationObserver(() => {
            const assignments = document.querySelectorAll("li.assignment.sort-disabled.search_show");
            if (assignments.length > 0) {
                updateAssignmentDOM(assignments);
                observer.disconnect();
                clearInterval(interval);
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });

        interval = setInterval(() => {
            const assignments = document.querySelectorAll("li.assignment.sort-disabled.search_show");
            if (assignments.length > 0) {
                updateAssignmentDOM(assignments);
                clearInterval(interval);
                observer.disconnect();
            }
        }, 100);
    }

    function updateAssignmentDOM(assignments) {
        assignments.forEach(assignment => {
            const infoDiv = assignment.querySelector('.ig-info');
            if (!infoDiv) return;

            const titleElement = infoDiv.querySelector('.ig-title');
            if (!titleElement) return;

            const title = titleElement.textContent.trim();

            const matchKey = Object.keys(discussionProgress)
                .find(d => title.toLowerCase().includes(d.toLowerCase()));

            if (matchKey) {
                const score = discussionProgress[matchKey];
                const detailsDiv = infoDiv.querySelector('.ig-details.rendered');
                if (!detailsDiv) return;
                if (detailsDiv.querySelector('.assignment-percentage')) return;

                const percentageDiv = document.createElement('div');
                percentageDiv.className = 'ig-details__item assignment-percentage';

                const strong = document.createElement('strong');
                strong.textContent = `${score}%`;
                strong.style.color = score === 100 ? 'green' : 'red';

                percentageDiv.appendChild(strong);
                detailsDiv.appendChild(percentageDiv);
            }
        });
    }

})();
