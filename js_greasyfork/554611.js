// ==UserScript==
// @name         Copy Jira Link
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  Jira should have supported this!
// @author       EnixCoda
// @match        https://*.atlassian.net/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554611/Copy%20Jira%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/554611/Copy%20Jira%20Link.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const datasetIds = {
    currentIssueBreadcrumbCopyIconButton: "issue.common.component.permalink-button.button.link-icon",
    contextMenuItemOfItem:
      "software-context-menu.ui.menu-renderer.context-menu-inner.context-menu-node.context-menu-item.context-menu-label",
    currentIssueTitle: "issue-field-single-line-text-inline-edit-heading.ui.single-line-text-heading.read-view",
    contextMenuWrapper: "software-context-menu.ui.context-menu.children-wrapper",
    currentIssueBreadcrumbItem: "issue.views.issue-base.foundation.breadcrumbs.current-issue.item",
    issueCardId: "platform-card.common.ui.key.key",
    issueCardTitle: "issue-field-single-line-text-readview-card.ui.single-line-text.container.box",
  };

  const testid = (id) => `[data-testid="${id}"]`;

  document.addEventListener(
    "click",
    (e) => {
      if ([datasetIds.currentIssueBreadcrumbCopyIconButton].includes(e.target.dataset.testid)) {
        const id = document.querySelector(testid(datasetIds.currentIssueBreadcrumbItem))?.textContent;
        const title = document.querySelector(testid(datasetIds.currentIssueTitle))?.textContent;
        const link = document.querySelector(testid(datasetIds.currentIssueBreadcrumbItem))?.href;
        setTimeout(() => {
          copy(id, title, link);
        }, 100);
        return;
      }

      if ([datasetIds.contextMenuItemOfItem].includes(e.target.dataset.testid)) {
        const contextMenuWrapper = queryClosestParent(e.target, testid(datasetIds.contextMenuWrapper));
        if (!contextMenuWrapper) return;
        const id = contextMenuWrapper.querySelector(testid(datasetIds.issueCardId))?.textContent;
        const link = contextMenuWrapper.querySelector(`${testid(datasetIds.issueCardId)} a`)?.href;
        const title = contextMenuWrapper.querySelector(testid(datasetIds.issueCardTitle))?.textContent;
        setTimeout(() => {
          copy(id, title, link);
        }, 100);
      }
    },
    true
  );

  function queryClosestParent(element, selector) {
    let el = element;
    while (el) {
      if (el.matches(selector)) {
        return el;
      }
      el = el.parentElement;
    }
    return null;
  }

  const encodeMarkdownComponent = (text) => text.replace(/[\[\]\(\)]/g, "\\$&");
  const md = (strings, ...values) =>
    strings.reduce(
      (result, string, i) => result + string + (i < values.length ? encodeMarkdownComponent(values[i]) : ""),
      ""
    );

  const encodeHtmlComponent = (text) =>
    text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  const html = (strings, ...values) =>
    strings.reduce(
      (result, string, i) => result + string + (i < values.length ? encodeHtmlComponent(values[i]) : ""),
      ""
    );

  async function copy(id, title, link) {
    if (!id || !title || !link) {
      console.warn("Copy Jira Link: missing id, title or link", { id, title, link });
    }

    const htmlContent = html`<a href="${link}">${id}; ${title}</a>`; // for HTML, put space after `;` to make it encoded properly
    const markdownContent = md`[${id}\\; ${title}](${link})`; // for markdown, putting space after `;` might cause linter error, e.g. GitHub input box. Here we use backslash to escape `;`
    const data = [
      ["text/html", htmlContent],
      ["text/plain", markdownContent],
      // ["text/markdown", markdown], // not supported
    ];

    console.debug("Copy Jira Link:", { htmlContent, markdownContent });

    // Edge does not support copy multiple items
    if (await canUseClipboardAPI()) {
      copyWithClipboardAPI(data);
    } else {
      copyWithExecCommand(data);
    }
  }

  async function canUseClipboardAPI() {
    return new Promise((resolve, reject) => {
      try {
        navigator.permissions
          .query({ name: "clipboard-write" })
          .then(({ state }) => state === "granted" || state === "prompt")
          .then(resolve, reject);
      } catch (err) {
        reject(err);
      }
    }).catch(() => false);
  }

  function copyWithClipboardAPI(data) {
    navigator.clipboard.write([
      new ClipboardItem(
        data.reduce((map, [type, value]) => {
          map[type] = new Blob([value], { type });
          return map;
        }, {})
      ),
    ]);
  }

  function copyWithExecCommand(data) {
    const handleCopyEvent = (e) => {
      data.forEach(([type, value]) => {
        e.clipboardData.setData(type, value);
      });
      e.preventDefault();
    };
    document.addEventListener("copy", handleCopyEvent);
    document.execCommand("copy");
    document.removeEventListener("copy", handleCopyEvent);
  }
})();
