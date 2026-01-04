// ==UserScript==
// @name         GitHub Retry Failed GitHub Jobs for PR
// @namespace    http://tampermonkey.net/
// @version      2.7
// @description  Adds a button to retry all failed jobs on a GitHub PR page
// @author       VEED
// @match        https://github.com/*/pull/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557212/GitHub%20Retry%20Failed%20GitHub%20Jobs%20for%20PR.user.js
// @updateURL https://update.greasyfork.org/scripts/557212/GitHub%20Retry%20Failed%20GitHub%20Jobs%20for%20PR.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const RETRY_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
    <path d="M1.705 8.005a.75.75 0 0 1 .834.656 5.5 5.5 0 0 0 9.592 2.97l-1.204-1.204a.25.25 0 0 1 .177-.427h3.646a.25.25 0 0 1 .25.25v3.646a.25.25 0 0 1-.427.177l-1.38-1.38A7.002 7.002 0 0 1 1.05 8.84a.75.75 0 0 1 .656-.834ZM8 2.5a5.487 5.487 0 0 0-4.131 1.869l1.204 1.204A.25.25 0 0 1 4.896 6H1.25A.25.25 0 0 1 1 5.75V2.104a.25.25 0 0 1 .427-.177l1.38 1.38A7.002 7.002 0 0 1 14.95 7.16a.75.75 0 0 1-1.49.178A5.5 5.5 0 0 0 8 2.5Z"/>
  </svg>`;

  const DEFAULT_TEXT = 'Retry Failed Jobs';
  const BUTTON_ID = 'retry-all-failed-btn';

  const COLORS = {
    default: '#6e3630',
    hover: '#5a2d28',
    loading: '#6e7681',
    success: '#238636',
  };

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function getRepoInfo() {
    const match = window.location.pathname.match(/\/([^/]+)\/([^/]+)\/pull\/\d+/);
    return match ? { owner: match[1], repo: match[2] } : null;
  }

  function extractRunIds() {
    const failedItems = document.querySelectorAll('li[aria-label*="failing"]');
    const runIds = new Set();

    failedItems.forEach((item) => {
      const link = item.querySelector('a[href*="/actions/runs/"]');
      if (link) {
        const match = link.href.match(/\/actions\/runs\/(\d+)/);
        if (match) {
          runIds.add(match[1]);
        }
      }
    });

    return Array.from(runIds);
  }

  function findButtonByText(container, pattern, visibleOnly = false) {
    return Array.from(container.querySelectorAll('button')).find(
      (btn) => pattern.test(btn.textContent) && (!visibleOnly || btn.offsetParent !== null)
    );
  }

  function setButtonState(button, text, color, disabled = false) {
    button.innerHTML = `${RETRY_ICON} ${text}`;
    button.style.backgroundColor = color;
    button.disabled = disabled;
  }

  function resetButton(button) {
    setButtonState(button, DEFAULT_TEXT, COLORS.default, false);
  }

  function addRetryButton() {
    if (document.querySelector(`#${BUTTON_ID}`)) return;

    const reviewsSection = document.querySelector('section[aria-label="Reviews"]');
    if (!reviewsSection) return;

    const sectionHeader = reviewsSection.querySelector('.MergeBoxSectionHeader-module__wrapper--zMA1Y');
    if (!sectionHeader) return;

    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = 'padding: 12px 16px; border-top: 1px solid var(--borderColor-muted);';

    const retryButton = document.createElement('button');
    retryButton.id = BUTTON_ID;
    retryButton.type = 'button';
    retryButton.style.cssText = `
      background-color: ${COLORS.default};
      color: white;
      border: none;
      padding: 5px 16px;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    `;
    retryButton.innerHTML = `${RETRY_ICON} ${DEFAULT_TEXT}`;
    retryButton.title = 'Click to retry all failed workflow jobs';

    retryButton.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      retryAllFailedJobs();
    });

    retryButton.addEventListener('mouseenter', () => {
      if (!retryButton.disabled) {
        retryButton.style.backgroundColor = COLORS.hover;
      }
    });
    retryButton.addEventListener('mouseleave', () => {
      if (!retryButton.disabled) {
        retryButton.style.backgroundColor = COLORS.default;
      }
    });

    buttonContainer.appendChild(retryButton);
    reviewsSection.appendChild(buttonContainer);
  }

  async function retryAllFailedJobs() {
    const button = document.querySelector(`#${BUTTON_ID}`);
    if (!button) return;

    setButtonState(button, 'Finding failed jobs...', COLORS.loading, true);

    try {
      const repoInfo = getRepoInfo();
      if (!repoInfo) {
        alert('Could not parse repository information from URL');
        return;
      }

      const runIds = extractRunIds();
      if (runIds.length === 0) {
        alert('No failed jobs found to retry.');
        return;
      }

      let succeeded = 0;
      let failed = 0;
      const errors = [];

      for (const runId of runIds) {
        setButtonState(button, `Retrying workflow ${succeeded + failed + 1}/${runIds.length}...`, COLORS.loading, true);

        try {
          const result = await rerunViaPopup(repoInfo, runId);
          if (result.success) {
            succeeded++;
            console.log(`Successfully triggered rerun for ${runId}`);
          } else {
            failed++;
            errors.push(`Run ${runId}: ${result.error}`);
          }
        } catch (e) {
          failed++;
          errors.push(`Run ${runId}: ${e.message}`);
        }

        await sleep(1000);
      }

      if (failed > 0) {
        console.error('Failed to retry some workflows:', errors);
        alert(
          `Retried ${succeeded} workflow(s). ${failed} failed.\n\nYou may need to retry manually from the Actions tab.\n\nErrors:\n${errors.join('\n')}`
        );
        resetButton(button);
      } else {
        setButtonState(button, `Retried ${succeeded} workflow(s)!`, COLORS.success, true);
        setTimeout(() => resetButton(button), 3000);
      }
    } catch (error) {
      console.error('Error retrying failed jobs:', error);
      alert(`Error: ${error.message}`);
      resetButton(button);
    }
  }

  async function rerunViaPopup(repoInfo, runId) {
    return new Promise((resolve) => {
      const actionsUrl = `https://github.com/${repoInfo.owner}/${repoInfo.repo}/actions/runs/${runId}`;
      const popup = window.open(actionsUrl, `rerun_${runId}`, 'width=1000,height=700,left=100,top=100');

      if (!popup) {
        resolve({ success: false, error: 'Popup blocked. Please allow popups for github.com' });
        return;
      }

      let attempts = 0;
      const maxAttempts = 40;

      const checkAndClick = setInterval(async () => {
        attempts++;

        try {
          if (popup.closed) {
            clearInterval(checkAndClick);
            resolve({ success: true, error: null });
            return;
          }

          const popupDoc = popup.document;

          const menuButton = findButtonByText(popupDoc, /Re-run jobs/i, true);

          if (menuButton) {
            clearInterval(checkAndClick);
            menuButton.click();

            await sleep(300);

            const retryButton = findButtonByText(popupDoc, /Re-run failed jobs/i);

            if (!retryButton) {
              popup.close();
              resolve({ success: false, error: 'Could not find "Re-run failed jobs" button' });
              return;
            }

            retryButton.click();
            await sleep(300);

            const dialog = popupDoc.querySelector('#rerun-dialog-failed');
            if (dialog) {
              const confirmButton = findButtonByText(dialog, /Re-run jobs/i);
              if (confirmButton) {
                confirmButton.click();
              }
            }

            await sleep(500);
            popup.close();
            resolve({ success: true, error: null });
            return;
          }

          if (attempts >= maxAttempts) {
            clearInterval(checkAndClick);
            popup.close();
            resolve({ success: false, error: 'Timeout waiting for re-run button' });
          }
        } catch (e) {
          if (attempts >= maxAttempts) {
            clearInterval(checkAndClick);
            popup.close();
            resolve({ success: false, error: `Could not access popup: ${e.message}` });
          }
        }
      }, 500);
    });
  }

  // Initialize
  setTimeout(addRetryButton, 1000);

  // Re-run when page content changes (GitHub uses SPA navigation)
  const observer = new MutationObserver(() => {
    setTimeout(addRetryButton, 500);
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
})();