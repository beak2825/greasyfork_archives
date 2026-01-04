// ==UserScript==
// @name         Jira Copy Ticket ID
// @namespace   urn://https://www.georgegillams.co.uk/api/greasemonkey/jira_copy_ticket_id
// @version      0.0.3
// @description  Add copy ID CTA to easily copy Jira ticket IDs and make copy buttons permanently visible
// @author       You
// @include      *atlassian.net*
// @exclude      none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=atlassian.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550216/Jira%20Copy%20Ticket%20ID.user.js
// @updateURL https://update.greasyfork.org/scripts/550216/Jira%20Copy%20Ticket%20ID.meta.js
// ==/UserScript==

function showToast(message) {
  // Remove any existing toast
  const existingToast = document.getElementById('jira-copy-toast');
  if (existingToast) {
    existingToast.remove();
  }

  // Create toast element
  const toast = document.createElement('div');
  toast.id = 'jira-copy-toast';
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: #00875a;
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    font-weight: 500;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 10000;
    opacity: 0;
    transform: translateX(100px);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    pointer-events: none;
  `;

  // Add toast to page
  document.body.appendChild(toast);

  // Animate in
  setTimeout(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(0)';
  }, 10);

  // Animate out and remove after 3 seconds
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100px)';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 3000);
}

function extractTicketId() {
  // Try to get ticket ID from URL first
  const urlMatch = window.location.pathname.match(/\/browse\/([A-Z]+-\d+)/);
  if (urlMatch) {
    return urlMatch[1];
  }

  // Fallback: try to get from the breadcrumb link
  const breadcrumbLink = document.querySelector(
    '[data-testid="issue.views.issue-base.foundation.breadcrumbs.current-issue.item"]',
  );
  if (breadcrumbLink) {
    const hrefMatch = breadcrumbLink.href.match(/\/browse\/([A-Z]+-\d+)/);
    if (hrefMatch) {
      return hrefMatch[1];
    }

    // Try getting from text content
    const textContent = breadcrumbLink.textContent.trim();
    if (/^[A-Z]+-\d+$/.test(textContent)) {
      return textContent;
    }
  }

  return null;
}

function makeCopyButtonsVisible() {
  // Find the copy link button wrapper and make it always visible
  const copyButtonWrapper = document.querySelector(
    '[data-testid="issue.common.component.permalink-button.button.copy-link-button-wrapper"]',
  );
  if (copyButtonWrapper) {
    // Remove any hover-only styles by adding permanent visibility
    copyButtonWrapper.style.opacity = '1';
    copyButtonWrapper.style.visibility = 'visible';
    copyButtonWrapper.style.transform = 'none';

    // Find any child elements that might be hidden and make them visible
    const hiddenElements = copyButtonWrapper.querySelectorAll('*');
    hiddenElements.forEach((el) => {
      if (el.style.opacity === '0' || el.style.visibility === 'hidden') {
        el.style.opacity = '1';
        el.style.visibility = 'visible';
      }
      // Also remove any transform styles that might hide elements
      if (el.style.transform && el.style.transform.includes('translate')) {
        el.style.transform = 'none';
      }
    });
  }
}

function processJiraPage() {
  // First, make existing copy buttons visible
  makeCopyButtonsVisible();

  // Find the copy link button wrapper
  const copyButtonWrapper = document.querySelector(
    '[data-testid="issue.common.component.permalink-button.button.copy-link-button-wrapper"]',
  );
  if (!copyButtonWrapper) {
    console.log('Copy button wrapper not found, retrying in 1 second...');
    setTimeout(processJiraPage, 1000);
    return;
  }

  // Check if we already added our button
  if (copyButtonWrapper.querySelector('.jira-copy-id-button')) {
    return;
  }

  // Create and add the copy ID button
  const copyIdButton = document.createElement('button');
  copyIdButton.textContent = 'Copy ID';
  copyIdButton.className = 'jira-copy-id-button';
  copyIdButton.style.cssText = `
            margin-left: 8px;
            padding: 4px 8px;
            background-color: #0052cc;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            transform: translateY(-1px);

            &:focus {
                background-color: #0747a6;
            }
            &:hover {
                background-color: #0747a6;
            }
            &:active {
                background-color: #0052cc;
            }
  `;

  // Add click handler
  copyIdButton.addEventListener('click', async function (e) {
    e.preventDefault();
    e.stopPropagation();

    // Extract ticket ID at the time of click to get current page's ticket
    const ticketId = extractTicketId();
    if (!ticketId) {
      console.error('Could not find ticket ID to copy');
      showToast('Error: Could not find ticket ID');
      return;
    }

    try {
      await navigator.clipboard.writeText(ticketId);
      showToast(`${ticketId} copied`);
      const originalText = this.textContent;
      this.textContent = 'Copied!';
      this.style.backgroundColor = '#00875a';

      setTimeout(() => {
        this.textContent = originalText;
        this.style.backgroundColor = '#0052cc';
      }, 1500);
    } catch (err) {
      console.error('Failed to copy: ', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = ticketId;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);

      showToast(`${ticketId} copied`);
      const originalText = this.textContent;
      this.textContent = 'Copied!';
      this.style.backgroundColor = '#00875a';

      setTimeout(() => {
        this.textContent = originalText;
        this.style.backgroundColor = '#0052cc';
      }, 1500);
    }
  });

  // Append the button to the wrapper
  copyButtonWrapper.appendChild(copyIdButton);
}

function checkAndAddCopyButton() {
  const copyButton = document.querySelector('.jira-copy-id-button');
  if (copyButton) {
    return;
  }

  processJiraPage();
}

function doWork() {
  // Wait for page to load, then process the Jira page
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkAndAddCopyButton);
  } else {
    // Document already loaded
    checkAndAddCopyButton();
  }

  // Also watch for navigation changes in single-page applications
  let lastUrl = location.href;
  new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      setTimeout(checkAndAddCopyButton, 500); // Small delay for page to update
    }
  }).observe(document, { subtree: true, childList: true });
}

doWork();

setInterval(checkAndAddCopyButton, 1000);
