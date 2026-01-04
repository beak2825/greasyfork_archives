// ==UserScript==
// @name        Free SaveMyExams
// @namespace   848226.xyz/scripts/free-savemyexams
// @match       http*://*.savemyexams.com/*
// @grant       none
// @version     1.4
// @author      vmd1
// @description A script to allow you to use SaveMyExams Notes + Exam Questions freely, without paying/having an account - and without any limitations.
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/557078/Free%20SaveMyExams.user.js
// @updateURL https://update.greasyfork.org/scripts/557078/Free%20SaveMyExams.meta.js
// ==/UserScript==

localStorage.removeItem("SME.topic-question-part-solution-views");
localStorage.removeItem("SME.revision-note-views");
localStorage.removeItem("SME.first-visited-at");
localStorage.removeItem("SME.first-viewed-topic-question-at");
localStorage.removeItem("SME.ai-marking-spotlight-seen");
localStorage.removeItem("SME.last-viewed-course");
localStorage.removeItem("SME.latest-resource-views");
localStorage.removeItem("SME.resource-referrer-url");
localStorage.removeItem("beacon");

function cleanUp() {
  const targets = document.querySelectorAll(
    '.limit-wall_wrapper__8cuMy, [data-testid="eq-view-limit-wall"]'
  );
  targets.forEach(el => el.remove());

  const blurred = document.querySelectorAll('div.Blur_blur__Q5tMa');
  blurred.forEach(div => div.classList.remove('Blur_blur__Q5tMa'));

  const featureCTAs = document.querySelectorAll('div.FeatureSliderCTA_container__1Rqfu');
  featureCTAs.forEach(div => div.remove());

  const ribbons = document.querySelectorAll('div.DownloadRibbon_wrapper__so48d');
  ribbons.forEach(div => div.remove());
}

cleanUp();

const observer = new MutationObserver(() => {
  cleanUp();
  localStorage.removeItem("SME.topic-question-part-solution-views");
  localStorage.removeItem("SME.revision-note-views");
  localStorage.removeItem("SME.first-visited-at");
  localStorage.removeItem("SME.first-viewed-topic-question-at");
  localStorage.removeItem("SME.ai-marking-spotlight-seen");
  localStorage.removeItem("SME.last-viewed-course");
  localStorage.removeItem("SME.latest-resource-views");
  localStorage.removeItem("SME.resource-referrer-url");
  localStorage.removeItem("beacon");
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});
