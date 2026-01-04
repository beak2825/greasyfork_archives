// ==UserScript==
// @name         Claude Chat Exporter
// @name:zh-CN   Claude 聊天导出器
// @namespace    ChrisRaynor
// @version      0.3.0
// @description        Export Claude conversations to Markdown via a floating button.
// @description:zh-CN  通过悬浮按钮将 Claude 对话导出为 Markdown。
// @match        https://claude.ai/*
// @author       ChrisRaynor
// @run-at       document-idle
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555098/Claude%20Chat%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/555098/Claude%20Chat%20Exporter.meta.js
// ==/UserScript==

/* jshint esversion: 11 */

/*
MIT License
Copyright (c) 2024 Vishal Agarwal
Copyright (c) 2024 ChrisRaynor

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

(function injectClaudeExporter() {
  'use strict';

  const INJECT_FLAG = '__claude_chat_exporter_injected__';
  if (window[INJECT_FLAG]) {
    return;
  }
  window[INJECT_FLAG] = true;

  function main() {
    if (window.__CLAUDE_CHAT_EXPORTER_INITIALIZED__) {
      return;
    }
    window.__CLAUDE_CHAT_EXPORTER_INITIALIZED__ = true;

    function setupClaudeExporter() {
      const originalWriteTextRef = navigator.clipboard?.writeText;
      const originalWriteRef = navigator.clipboard?.write;
      const originalWriteText = originalWriteTextRef?.bind(navigator.clipboard);
      const originalWrite = originalWriteRef?.bind(navigator.clipboard);
      const capturedResponses = [];
      const humanMessages = [];
      let interceptorActive = false;
      let clipboardPatched = false;
      let statusDiv = null;
      let exportButton = null;
      let isExporting = false;

      const SELECTORS = {
        userMessage: '[data-testid="user-message"]',
        messageGroup: '.group',
        copyButton: 'button[data-testid="action-bar-copy"]',
        editTextarea: 'textarea',
        conversationTitle: '[data-testid="chat-title-button"] .truncate, button[data-testid="chat-title-button"] div.truncate'
      };

      const DELAYS = {
        hover: 50,
        edit: 150,
        copy: 100
      };

      const TIMEOUTS = {
        elementVisible: 1000,
        clipboardWait: 5000,
        clipboardStable: 1000,
        statusAutoHide: 3000,
        downloadCleanup: 100
      };

      function ensureStatusDiv() {
        if (statusDiv && document.body.contains(statusDiv)) {
          return statusDiv;
        }

        statusDiv = document.createElement('div');
        statusDiv.id = 'claude-export-status';
        statusDiv.style.cssText = `
          position: fixed; top: 10px; right: 10px; z-index: 2147483647;
          background: #2196F3; color: white; padding: 10px 15px;
          border-radius: 5px; font-family: monospace; font-size: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.3); max-width: 300px;
          display: none;
        `;
        document.body.appendChild(statusDiv);
        return statusDiv;
      }

      function updateStatus(message, background = '#2196F3') {
        const target = ensureStatusDiv();
        target.style.display = 'block';
        target.style.background = background;
        target.textContent = message;
      }

      function updateCountStatus() {
        updateStatus(`Human: ${humanMessages.length} | Claude: ${capturedResponses.length}`);
      }

      function removeStatus() {
        if (statusDiv && document.body.contains(statusDiv)) {
          document.body.removeChild(statusDiv);
        }
        statusDiv = null;
      }

      function ensureExportButton() {
        if (exportButton && document.body.contains(exportButton)) {
          return exportButton;
        }

        const existing = document.getElementById('claude-export-button');
        if (existing && document.body.contains(existing)) {
          exportButton = existing;
          return exportButton;
        }

        const button = document.createElement('button');
        button.id = 'claude-export-button';
        button.type = 'button';
        button.textContent = 'Export Claude Chat';
        button.style.cssText = `
          align-items: center;
          border: 1px solid #e5e5e5;
          border-radius: 35px;
          cursor: pointer;
          display: flex;
          font-size: 15px;
          justify-content: center;
          left: 50%;
          padding: 6px 18px;
          position: fixed;
          top: 12px;
          transform: translateX(-50%);
          z-index: 2147483647;
          background: #ffffff;
          color: #111111;
          box-shadow: 0 2px 6px rgba(0,0,0,0.15);
          gap: 6px;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        `;

        button.addEventListener('mouseenter', () => {
          button.style.boxShadow = '0 4px 10px rgba(0,0,0,0.2)';
        });

        button.addEventListener('mouseleave', () => {
          button.style.boxShadow = '0 2px 6px rgba(0,0,0,0.15)';
        });

        button.addEventListener('click', onExportButtonClick);

        (document.body || document.documentElement).appendChild(button);
        exportButton = button;
        return button;
      }

      function setButtonState(text, disabled = false) {
        const button = ensureExportButton();
        button.textContent = text;
        button.disabled = disabled;
        button.style.opacity = disabled ? '0.6' : '1';
        button.style.cursor = disabled ? 'not-allowed' : 'pointer';
      }

      async function onExportButtonClick() {
        if (isExporting) {
          return;
        }
        isExporting = true;
        capturedResponses.length = 0;
        humanMessages.length = 0;
        setButtonState('Exporting...', true);

        const success = await startExport();

        setButtonState(success ? 'Export Again' : 'Retry Export');
        isExporting = false;
      }

      function downloadMarkdown(content, filename) {
        const blob = new Blob([content], { type: 'text/markdown' });
        const a = document.createElement('a');
        const url = URL.createObjectURL(blob);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }, TIMEOUTS.downloadCleanup);
      }

      function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }

      function truncateFilename(value, maxChars = 80) {
        if (value.length <= maxChars) return value;
        return Array.from(value).slice(0, maxChars).join('');
      }

      function getConversationTitle() {
        const titleElement = document.querySelector(SELECTORS.conversationTitle);
        let title = titleElement?.textContent?.trim() || '';

        if (!title || title === 'Claude' || title.includes('New conversation')) {
          title = 'claude_conversation';
        }

        let sanitized = title
          .replace(/[<>:"/\\|?*]/g, '_')
          .replace(/\s+/g, '_')
          .replace(/_{2,}/g, '_')
          .replace(/^_+|_+$/g, '')
          .toLowerCase();

        if (!sanitized) {
          sanitized = 'claude_conversation';
        }

        return truncateFilename(sanitized);
      }

      function findEditButton(messageGroup) {
        if (!messageGroup) return null;
        // Edit 按钮隐藏在当前消息的浮动工具条里，只有在 group hover 时可见
        // 这里只在 messageGroup 内查找，避免误点其他消息的按钮
        const ariaLabelButton = messageGroup.querySelector('button[aria-label="Edit"]');
        if (ariaLabelButton) {
          return ariaLabelButton;
        }
        const fallback = Array.from(messageGroup.querySelectorAll('button')).find(btn =>
          btn.textContent.trim().toLowerCase() === 'edit'
        );
        return fallback || null;
      }

      async function waitForElementVisible(element, timeout = TIMEOUTS.elementVisible) {
        const interval = 50;
        let elapsed = 0;

        while (elapsed < timeout) {
          if (!element) {
            return false;
          }
          const styles = window.getComputedStyle(element);
          const visible = element.offsetParent !== null && styles.opacity !== '0' && styles.visibility !== 'hidden';
          if (visible) {
            return true;
          }
          await delay(interval);
          elapsed += interval;
        }
        return false;
      }

      async function extractMessageContent(messageContainer, messageIndex) {
        try {
          const messageGroup = messageContainer.closest(SELECTORS.messageGroup);
          if (!messageGroup) {
            console.warn(`Failed to extract message ${messageIndex + 1}:`, 'Message group not found');
            return null;
          }

          messageGroup.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
          await delay(DELAYS.hover);

          const editButton = findEditButton(messageGroup);

          if (editButton) {
            const ready = await waitForElementVisible(editButton);
            if (!ready) {
              console.warn(`Failed to extract message ${messageIndex + 1}:`, 'Edit button hidden');
              return null;
            }
            console.log(`📝 Extracting message ${messageIndex + 1} via edit`);
            editButton.click();
            await delay(DELAYS.edit);

            const editTextarea = messageGroup.querySelector(SELECTORS.editTextarea) || document.querySelector(SELECTORS.editTextarea);

            let content = '';
            if (editTextarea) {
              content = editTextarea.value;
            }

            const escapeTarget = editTextarea?.closest('[role="dialog"], form, .edit-container') || editTextarea || messageGroup;
            escapeTarget.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
            await delay(DELAYS.hover);

            if (content) return content;
          }

          console.warn(`Failed to extract message ${messageIndex + 1}:`, `Edit button not found`);
          return null;

        } catch (error) {
          console.warn(`Failed to extract message ${messageIndex + 1}:`, error);
          return null;
        } finally {
          const messageGroup = messageContainer.closest(SELECTORS.messageGroup);
          if (messageGroup) {
            messageGroup.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
          }
        }
      }

      async function extractAllHumanMessages() {
        console.log('🔄 Extracting human messages...');
        const userMessages = document.querySelectorAll(SELECTORS.userMessage);

        for (let i = 0; i < userMessages.length; i++) {
          const content = await extractMessageContent(userMessages[i], i);
          if (!content) {
            console.warn(`Skipping message ${i + 1}: empty content`);
            continue;
          }
          humanMessages.push({
            type: 'user',
            content: content,
            index: i
          });
          updateCountStatus();
        }

        console.log(`✅ Extracted ${humanMessages.length} human messages`);
      }

      function captureClaudeResponseText(text) {
        if (!interceptorActive || !text || text.length < 2) {
          return;
        }
        console.log(`📋 Captured Claude response ${capturedResponses.length + 1}`);
        capturedResponses.push({
          type: 'claude',
          content: text,
          timestamp: Date.now()
        });
        updateCountStatus();
      }

      function ensureClipboardInterceptor() {
        if (clipboardPatched || !navigator.clipboard) {
          return clipboardPatched;
        }

        if (originalWriteText) {
          navigator.clipboard.writeText = async function patchedWriteText(text) {
            captureClaudeResponseText(text);
            return originalWriteText(text);
          };
        }

        if (originalWrite) {
          navigator.clipboard.write = async function patchedWrite(data) {
            try {
              if (interceptorActive && Array.isArray(data)) {
                for (const item of data) {
                  if (item?.types?.includes('text/plain')) {
                    const blob = await item.getType('text/plain');
                    const text = await blob.text();
                    captureClaudeResponseText(text);
                    break;
                  }
                }
              }
            } catch (clipboardError) {
              console.warn('Failed to inspect clipboard payload:', clipboardError);
            }
            return originalWrite(data);
          };
        }

        clipboardPatched = true;
        return true;
      }

      function restoreClipboardInterceptor() {
        if (!clipboardPatched || !navigator.clipboard) {
          return;
        }
        if (originalWriteTextRef) {
          navigator.clipboard.writeText = originalWriteTextRef;
        }
        if (originalWriteRef) {
          navigator.clipboard.write = originalWriteRef;
        }
        clipboardPatched = false;
      }

      function triggerClaudeResponseCopySync() {
        const copyButtons = Array.from(document.querySelectorAll(SELECTORS.copyButton)).filter(btn => btn && btn.offsetParent !== null);

        if (copyButtons.length === 0) {
          throw new Error('No Claude copy buttons found!');
        }

        console.log(`🚀 Clicking ${copyButtons.length} Claude copy buttons...`);

        for (let i = 0; i < copyButtons.length; i++) {
          const button = copyButtons[i];
          try {
            button.scrollIntoView({ behavior: 'instant', block: 'nearest' });
            button.click();
            console.log(`🖱️ Clicked copy button ${i + 1}/${copyButtons.length}`);
          } catch (error) {
            console.warn(`Failed to click button ${i + 1}:`, error);
          }
        }

        return copyButtons.length;
      }

      function buildMarkdown() {
        let markdown = '# Conversation with Claude\n\n';
        const maxLength = Math.max(humanMessages.length, capturedResponses.length);

        for (let i = 0; i < maxLength; i++) {
          if (i < humanMessages.length && humanMessages[i].content) {
            markdown += `## Human:\n\n${humanMessages[i].content}\n\n---\n\n`;
          }
          if (i < capturedResponses.length) {
            markdown += `## Claude:\n\n${capturedResponses[i].content}\n\n---\n\n`;
          }
        }

        return markdown;
      }

      async function waitForClipboardOperations(expectedCount) {
        const checkInterval = 100;
        let elapsed = 0;
        let lastCount = 0;
        let stableDuration = 0;

        while (elapsed < TIMEOUTS.clipboardWait) {
          const currentCount = capturedResponses.length;
          if (currentCount >= expectedCount) {
            console.log(`✅ All ${expectedCount} responses captured in ${elapsed}ms`);
            return true;
          }

          if (currentCount === lastCount) {
            stableDuration += checkInterval;
            if (stableDuration >= TIMEOUTS.clipboardStable) {
              console.warn(`⚠️ Clipboard count stalled at ${currentCount}/${expectedCount}`);
              return false;
            }
          } else {
            stableDuration = 0;
            lastCount = currentCount;
          }

          await delay(checkInterval);
          elapsed += checkInterval;
        }

        console.warn(`⚠️ Timeout: Only captured ${capturedResponses.length}/${expectedCount} responses`);
        return false;
      }

      async function startExport() {
        if (!ensureClipboardInterceptor()) {
          updateStatus('Clipboard API unavailable', '#f44336');
          return false;
        }

        try {
          interceptorActive = true;
          updateStatus('Copying Claude responses...');
          const copyCount = triggerClaudeResponseCopySync();

          const clipboardPromise = waitForClipboardOperations(copyCount);

          updateStatus('Extracting human messages...');
          await extractAllHumanMessages();

          const clipboardComplete = await clipboardPromise;

          if (!clipboardComplete) {
            updateStatus('Warning: Some Claude responses were not captured', '#FFC107');
          }

          completeExport();
          return true;

        } catch (error) {
          interceptorActive = false;
          updateStatus(`Error: ${error.message}`, '#f44336');
          console.error('Export failed:', error);
          restoreClipboardInterceptor();
          return false;
        }
      }

      function completeExport() {
        interceptorActive = false;

        if (humanMessages.length === 0 && capturedResponses.length === 0) {
          updateStatus('No messages captured!', '#f44336');
          restoreClipboardInterceptor();
          return;
        }

        const markdown = buildMarkdown();
        const filename = `${getConversationTitle()}-${Date.now()}.md`;
        downloadMarkdown(markdown, filename);

        updateStatus(`✅ Downloaded: ${filename}`, '#4CAF50');
        restoreClipboardInterceptor();

        console.log('🎉 Export complete!');
        setTimeout(removeStatus, TIMEOUTS.statusAutoHide);
      }

      function init() {
        const initButton = () => ensureExportButton();
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', initButton, { once: true });
        } else {
          initButton();
        }
      }

      init();
    }

    setupClaudeExporter();
  }

  const script = document.createElement('script');
  script.textContent = `(${main.toString()})();`;
  document.documentElement.appendChild(script);
  script.remove();
})();
