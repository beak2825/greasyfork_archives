// ==UserScript==
// @name        Auto rating teachers TDTU
// @name:vi     Tự động đánh giá giảng viên TDTU
// @description Auto rating teachers on TDTU survey page
// @description:vi Tự động đánh giá giảng viên trên trang khảo sát TDTU
// @version     1.1.0
// @grant       none
// @author      anhkhoakz
// @icon        https://i.imgur.com/KeqRdMi.png
// @match       https://teaching-quality-survey.tdtu.edu.vn/*
// @license     AGPLv3; https://www.gnu.org/licenses/agpl-3.0.html#license-text
// @namespace 
// @downloadURL https://update.greasyfork.org/scripts/556540/Auto%20rating%20teachers%20TDTU.user.js
// @updateURL https://update.greasyfork.org/scripts/556540/Auto%20rating%20teachers%20TDTU.meta.js
// ==/UserScript==

(() => {"use strict";// src/auto-rating-teacher.ts
var RATING_INPUT_PATTERN = /^gv(\d+)_rd(\d+)_/;
var RatingConfig = {
  min: 3,
  max: 6
};
(() => {
  const randomRatingRange = RatingConfig.max - RatingConfig.min + 1;
  const CLICK_DELAY_MIN = 150;
  const CLICK_DELAY_MAX = 400;
  const generateRandomRating = () => {
    return Math.floor(Math.random() * randomRatingRange) + RatingConfig.min;
  };
  const randomDelay = () => {
    return Math.floor(Math.random() * (CLICK_DELAY_MAX - CLICK_DELAY_MIN + 1)) + CLICK_DELAY_MIN;
  };
  const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };
  const groupInputsByTeacher = (inputs) => {
    const groups = new Map;
    for (const input of Array.from(inputs)) {
      const match = input.id.match(RATING_INPUT_PATTERN);
      if (!match) {
        continue;
      }
      const teacherId = match[1];
      if (!teacherId) {
        continue;
      }
      const existingGroup = groups.get(teacherId);
      if (!existingGroup) {
        groups.set(teacherId, [input]);
        continue;
      }
      existingGroup.push(input);
    }
    return groups;
  };
  const createRatingPattern = (rating) => {
    return new RegExp(`^gv\\d+_rd${rating}_`);
  };
  const rateTeacher = async (inputs, rating) => {
    const pattern = createRatingPattern(rating);
    for (const input of inputs) {
      if (!pattern.test(input.id)) {
        continue;
      }
      input.click();
      await sleep(randomDelay());
    }
  };
  const processRatings = async () => {
    const ratingInputs = document.querySelectorAll('input[id^="gv"][id*="_rd"]');
    if (ratingInputs.length === 0) {
      return;
    }
    const teacherGroups = groupInputsByTeacher(ratingInputs);
    for (const [, inputs] of teacherGroups) {
      const rating = generateRandomRating();
      await rateTeacher(inputs, rating);
    }
  };
  const containsRatingInput = (element) => {
    if (element.querySelector('input[id^="gv"][id*="_rd"]')) {
      return true;
    }
    if (element instanceof HTMLInputElement && element.id.match(RATING_INPUT_PATTERN)) {
      return true;
    }
    return false;
  };
  const hasRatingInputInNodes = (nodes) => {
    for (const node of Array.from(nodes)) {
      if (node.nodeType !== Node.ELEMENT_NODE) {
        continue;
      }
      const element = node;
      if (containsRatingInput(element)) {
        return true;
      }
    }
    return false;
  };
  const observeForDynamicContent = () => {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type !== "childList") {
          continue;
        }
        if (!hasRatingInputInNodes(mutation.addedNodes)) {
          continue;
        }
        setTimeout(() => {
          processRatings();
        }, 300);
        return;
      }
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  };
  const main = () => {
    processRatings();
    observeForDynamicContent();
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", main);
    return;
  }
  main();
})();})();