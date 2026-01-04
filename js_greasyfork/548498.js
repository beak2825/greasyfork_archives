// ==UserScript==
// @name         Linear activity section scroller
// @namespace    http://tampermonkey.net/
// @version      2025-09-05.1
// @description  Automatically scrolls the activity section of a Linear issue page.
// @author       You
// @match        https://linear.app/transcend/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=linear.app
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/548498/Linear%20activity%20section%20scroller.user.js
// @updateURL https://update.greasyfork.org/scripts/548498/Linear%20activity%20section%20scroller.meta.js
// ==/UserScript==

const scrollToTopText = "↑ Scroll to Top";
const scrollToBottomText = "↓ Scroll to Bottom";
(function () {
  "use strict";
  const btnId = "scrollButton";
  let intervalId = null;

  // Inject styles for the scroll button
  const styleId = "linear-scroll-btn-style";
  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");
    style.id = styleId;
    style.innerHTML = `
      #${btnId} {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1000;
        background-color: rgba(255, 255, 255, 0.4);
        border: 1px solid rgba(255, 255, 255, 0.4);
        border-radius: .5em;
        padding: .3em .5em;
        cursor: pointer;
        transition: background 0.2s, border 0.2s;
      }
      #${btnId}:hover {
        background-color: rgba(255, 255, 255, 0.6);
      }
    `;
    document.head.appendChild(style);
  }

  const addScrollButton = () => {
    if (document.getElementById(btnId)) {
    //   clearInterval(intervalId);
      return; // button already exists
    }
    const activityContainer = document.querySelector(
      '[data-view-id="issue-view"]'
    );
    const [activityLabel] = [
      ...document.querySelectorAll(
        '[data-view-id="issue-view"] > div > div span'
      ),
    ].filter((el) => el.textContent?.toLowerCase() === "activity");
    if (!activityContainer || !activityLabel) {
      console.log("Activity section not found yet", {
        activityContainer,
        activityLabel,
      });
      return;
    }

    const scrollButton = document.createElement("button");
    scrollButton.innerText = isScrolledPastActivityLabel()
      ? scrollToTopText
      : scrollToBottomText;
    scrollButton.id = btnId;

    function isScrolledPastActivityLabel() {
      //   console.log({
      //     scrollTop: activityContainer.scrollTop,
      //     activityLabelOffsetTop: activityLabel.offsetTop,
      //     isPast: activityContainer.scrollTop > activityLabel.offsetTop,
      //   });
      return activityContainer.scrollTop > activityLabel.offsetTop;
    }
    function retryTimes(fn, times, interval, message) {
      let attempts = 0;
      const id = setInterval(() => {
        if (fn() === true || attempts >= times) {
          console.log(message, attempts);
          clearInterval(id);
        }
        attempts++;
      }, interval);
    }

    scrollButton.addEventListener("click", () => {
      // if we're past the activity label, scroll to it
      if (isScrolledPastActivityLabel()) {
        activityLabel.scrollIntoView({ behavior: "instant" });
      } else {
        // otherwise, scroll to the bottom
        retryTimes(
          () => {
            activityContainer.scrollTo({
              top: activityContainer.scrollHeight,
              behavior: "smooth",
            });
            if (
              Math.abs(
                activityContainer.scrollHeight -
                  activityContainer.scrollTop -
                  activityContainer.clientHeight
              ) < 10
            ) {
              console.log("Reached bottom, early exit");
              return true;
            }
          },
          30,
          500,
          "Scrolling to bottom attempt"
        );
      }
    });
    activityContainer.appendChild(scrollButton);
    activityContainer.addEventListener("scroll", () => {
      if (isScrolledPastActivityLabel()) {
        scrollButton.innerText = scrollToTopText;
      } else {
        scrollButton.innerText = scrollToBottomText;
      }
    });
  };
  intervalId = setInterval(addScrollButton, 1000);
})();
