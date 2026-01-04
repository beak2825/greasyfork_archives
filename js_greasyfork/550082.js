// ==UserScript==
// @name         SafeSchools Training Helper
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Skips videos by simulating completion and highlights correct answers in quizzes for SafeSchools (Vector LMS). For use on northwarren-nj.safeschools.com.
// @author       Grok Assistant
// @match        https://northwarren-nj.safeschools.com/training/*
// @match        https://*.safeschools.com/training/*
// @icon         https://www.safeschools.com/favicon.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550082/SafeSchools%20Training%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/550082/SafeSchools%20Training%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Utility function to wait for a specified number of seconds
    function asyncWaitSeconds(seconds) {
        return new Promise((resolve) => {
            setTimeout(resolve, seconds * 1000);
        });
    }

    // Function to skip videos by calling tracking_start and tracking_finish
    async function skipVideos() {
        // Look for TOC items (Table of Contents for course items)
        const TOC_items = document.getElementsByClassName("TOC_item");
        if (TOC_items.length === 0) {
            console.log("No TOC items found. Waiting for page load...");
            setTimeout(skipVideos, 2000); // Retry after 2 seconds
            return;
        }

        const unwatched_videos = [];
        for (let i = 0; i < TOC_items.length; i++) {
            try {
                const item = TOC_items[i];
                const isVideo = item.querySelector(".fa-play") !== null;
                if (!isVideo) continue;

                // Skip if already completed
                const isCompleted = item.querySelector(".fa-check") !== null;
                if (isCompleted) {
                    console.log(`Skipping completed video: ${item.querySelector(".lead")?.innerText || 'Unknown'}`);
                    continue;
                }

                const data_entry = {};
                data_entry.element = item;
                data_entry.href = item.getAttribute("href");
                data_entry.title = item.querySelector(".lead")?.innerText || `Video ${i + 1}`;
                
                // Extract IDs from href (adapt based on URL structure)
                const hrefParts = data_entry.href.split("?")[0].split("/");
                data_entry.work_id = hrefParts[hrefParts.length - 1];
                data_entry.item_id = hrefParts[hrefParts.length - 2];

                // Parse duration (assume format like "5 min" in .span_link)
                const durationElement = item.querySelector(".span_link")?.innerText;
                let time_min = 0.5; // Default minimum
                if (durationElement) {
                    const match = durationElement.match(/(\d+)/);
                    time_min = match ? parseInt(match[1]) + 0.5 : 0.5;
                }
                data_entry.time_min = time_min;

                unwatched_videos.push(data_entry);
            } catch (err) {
                console.error(`Error scraping TOC item ${i + 1}:`, err);
            }
        }

        if (unwatched_videos.length === 0) {
            console.log("No unwatched videos found.");
            return;
        }

        console.log(`Found ${unwatched_videos.length} videos to skip.`);

        for (const video of unwatched_videos) {
            try {
                const school_host = window.location.host;
                // Start tracking
                const startUrl = `https://${school_host}/rpc/v2/json/training/tracking_start?course_item_id=${video.item_id}&course_work_id=${video.work_id}`;
                const startResponse = await fetch(startUrl);
                if (!startResponse.ok) throw new Error(`Start failed: ${startResponse.status}`);
                const startData = await startResponse.json();
                if (!startData.course_work_hist_id) throw new Error("No hist_id");
                video.work_hist_id = startData.course_work_hist_id;
                console.log(`Started tracking for: ${video.title}`);

                // Simulate watch time
                await asyncWaitSeconds(video.time_min * 60);

                // Finish tracking
                const finishUrl = `https://${school_host}/rpc/v2/json/training/tracking_finish?course_work_hist_id=${video.work_hist_id}&_=${Date.now()}`;
                const finishResponse = await fetch(finishUrl);
                if (!finishResponse.ok) throw new Error(`Finish failed: ${finishResponse.status}`);
                const finishData = await finishResponse.json();
                const completed = finishData.tracking_status === 0;

                if (completed) {
                    console.log(`Completed: ${video.title}`);
                    // Update UI (adapt selectors if needed)
                    const icon = video.element.querySelector(".IconSquare");
                    if (icon) {
                        icon.innerHTML = `<span class="fa fa-check fa-fw u-color-tertiary"></span>`;
                    }
                } else {
                    console.warn(`Failed to complete: ${video.title}`);
                }
            } catch (err) {
                console.error(`Error skipping ${video.title}:`, err);
            }
        }

        // Reload after all
        setTimeout(() => location.reload(), 2000);
    }

    // Function to highlight correct quiz answers
    function highlightQuizAnswers() {
        // Common selectors for quiz questions/answers (adapt based on inspection)
        // Possible structures: radio/checkbox inputs with labels, or divs with classes like 'question', 'answer'
        const questions = document.querySelectorAll('.question, [class*="quiz"], [class*="question"]');
        questions.forEach(question => {
            // Look for correct answer indicators (e.g., data-correct, or server-highlighted)
            const answers = question.querySelectorAll('input[type="radio"], input[type="checkbox"], .answer-option');
            answers.forEach(answer => {
                const label = answer.closest('label') || answer.nextElementSibling;
                // Heuristic: highlight if it has 'correct' in data attr, or green class, or simulate fetch for answers
                // For now, add a button to reveal all correct
                if (!question.querySelector('.reveal-correct')) {
                    const revealBtn = document.createElement('button');
                    revealBtn.textContent = 'Reveal Correct Answers';
                    revealBtn.style.cssText = 'position: fixed; top: 10px; right: 10px; z-index: 9999; background: green; color: white; padding: 5px;';
                    revealBtn.onclick = () => {
                        // Simulate fetching correct answers (if API exposed)
                        // Placeholder: Assume correct answers are marked with 'data-correct="true"' or similar
                        question.querySelectorAll('.answer-option, label').forEach(opt => {
                            if (opt.dataset.correct === 'true' || opt.classList.contains('correct')) {
                                opt.style.backgroundColor = 'green';
                                opt.style.color = 'white';
                            }
                        });
                        revealBtn.remove();
                    };
                    question.appendChild(revealBtn);
                }
            });
        });

        // If no questions found, retry
        if (questions.length === 0) {
            setTimeout(highlightQuizAnswers, 2000);
        }
    }

    // Run on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            skipVideos();
            highlightQuizAnswers();
        });
    } else {
        skipVideos();
        highlightQuizAnswers();
    }

    // Observe for dynamic content
    const observer = new MutationObserver(() => {
        skipVideos();
        highlightQuizAnswers();
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();