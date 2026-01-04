// ==UserScript==
// @name         OpenWebUI Fullscreen Chat Messages
// @name:zh-CN   OpenWebUI多模型对话全屏查看
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Add fullscreen functionality to chat messages in Open Web-UI
// @description:zh-CN 让Open WebUI的多模型对话能全屏展示
// @author       Van
// @match        https://ai.huzi-baozi.com/c/*  //注意修改为你自己的域名
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552440/OpenWebUI%20Fullscreen%20Chat%20Messages.user.js
// @updateURL https://update.greasyfork.org/scripts/552440/OpenWebUI%20Fullscreen%20Chat%20Messages.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Create and inject CSS for the fullscreen functionality
  const style = document.createElement('style');
  style.textContent = `
        .fullscreen-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            opacity: 0;
            transform: scale(0.8);
            transition: all 0.3s ease;
        }

        @media (prefers-color-scheme: dark) {
            .fullscreen-overlay {
                background: rgba(0, 0, 0, 0.95);
            }
        }

        .fullscreen-overlay.active {
            opacity: 1;
            transform: scale(1);
        }

        .fullscreen-content {
            max-width: 90%;
            max-height: 90%;
            overflow: auto;
            background: white;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 0 30px rgba(255, 255, 255, 0.2);
        }

        @media (prefers-color-scheme: dark) {
            .fullscreen-content {
                background: #1a1a1a;
                color: #ffffff;
                box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
            }
        }

        .fullscreen-content blockquote {
            border-left: 4px solid #ccc;
            margin: 1em 0;
            padding: 0.5em 1em;
            background: #f9f9f9;
            color: #666;
            font-style: italic;
        }

        @media (prefers-color-scheme: dark) {
            .fullscreen-content blockquote {
                border-left-color: #555;
                background: #2a2a2a;
                color: #aaa;
            }
        }

        .fullscreen-close {
            position: absolute;
            top: 20px;
            right: 20px;
            color: white;
            font-size: 30px;
            cursor: pointer;
            background: none;
            border: none;
            z-index: 10001;
        }

        @media (prefers-color-scheme: dark) {
            .fullscreen-close {
                color: #ddd;
            }
        }

        .fullscreen-icon {
            position: absolute;
            top: 10px;
            right: 10px;
            cursor: pointer;
            z-index: 9999;
            // background: rgba(255, 255, 255, 0.8);
            border-radius: 50%;
            padding: 5px;
            transition: opacity 0.3s ease;
            opacity: 0;
        }

        .fullscreen-icon.bottom-right {
            top: auto;
            bottom: 10px;
            right: 10px;
        }

        .message-container:hover .fullscreen-icon {
            opacity: 1;
        }

        .fullscreen-icon.bottom-right {
            top: auto;
            bottom: 10px;
        }

        .fullscreen-icon svg {
            width: 20px;
            height: 20px;
        }

        .snap-center {
            position: relative;
        }
    `;
  document.head.appendChild(style);

  // Create fullscreen icon SVG
  function createFullscreenIcon() {
    const icon = document.createElement('div');
    icon.className = 'fullscreen-icon';
    icon.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
            </svg>
        `;
    return icon;
  }

  // Create fullscreen overlay
  function createFullscreenOverlay(content) {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'fullscreen-overlay markdown-prose';

    // Create close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'fullscreen-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.addEventListener('click', () => {
      overlay.classList.remove('active');
      setTimeout(() => {
        document.body.removeChild(overlay);
      }, 300);
    });

    // Create content container
    const contentContainer = document.createElement('div');
    contentContainer.className = 'fullscreen-content';
    contentContainer.innerHTML = content;

    // Add elements to overlay
    overlay.appendChild(closeBtn);
    overlay.appendChild(contentContainer);

    // Add to document
    document.body.appendChild(overlay);

    // Trigger animation
    setTimeout(() => {
      overlay.classList.add('active');
    }, 10);

    // Close with ESC key
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        closeBtn.click();
        document.removeEventListener('keydown', handleEsc);
      }
    };
    document.addEventListener('keydown', handleEsc);

    return overlay;
  }

  // Add fullscreen icon to message containers
  function addFullscreenIcons() {
    // Select all message containers with IDs starting with "message-"
    const messageContainers = document.querySelectorAll('[id^="message-"]');

    messageContainers.forEach(container => {
      // Skip if icon already exists
      if (container.querySelector('.fullscreen-icon')) return;

      // Skip the message input container
      if (container.id === 'message-input-container') return;

      // Add class for styling
      container.classList.add('message-container');

      // Create and add icon
      const icon = createFullscreenIcon();
      container.appendChild(icon);

      // Create and add bottom-right icon
      const bottomRightIcon = createFullscreenIcon();
      bottomRightIcon.classList.add('bottom-right');
      container.appendChild(bottomRightIcon);

      // Add click event
      icon.addEventListener('click', (e) => {
        e.stopPropagation();

        // Get content to display fullscreen
        const contentContainer = container.querySelector('.chat-assistant');
        if (contentContainer) {
          createFullscreenOverlay(contentContainer.innerHTML);
        }
      });

      // Add click event for bottom-right icon
      bottomRightIcon.addEventListener('click', (e) => {
        e.stopPropagation();

        // Get content to display fullscreen
        const contentContainer = container.querySelector('.chat-assistant');
        if (contentContainer) {
          createFullscreenOverlay(contentContainer.innerHTML);
        }
      });
    });
  }

  // Initialize the script
  function init() {
    // Add icons to existing messages
    addFullscreenIcons();

    // Watch for new messages and add icons to them
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) { // Element node
              // Check if this is a message container or contains message containers
              if (node.id && node.id.startsWith('message-')) {
                // Skip the message input container
                if (node.id === 'message-input-container') return;

                // Add class for styling
                node.classList.add('message-container');

                // Add icon if not already present
                if (!node.querySelector('.fullscreen-icon')) {
                  const icon = createFullscreenIcon();
                  node.appendChild(icon);

                  icon.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const contentContainer = node.querySelector('.chat-assistant');
                    if (contentContainer) {
                      createFullscreenOverlay(contentContainer.innerHTML);
                    }
                  });

                  // Create and add bottom-right icon for new messages
                  const bottomRightIcon = createFullscreenIcon();
                  bottomRightIcon.classList.add('bottom-right');
                  node.appendChild(bottomRightIcon);

                  // Add click event for bottom-right icon
                  bottomRightIcon.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const contentContainer = node.querySelector('.chat-assistant');
                    if (contentContainer) {
                      createFullscreenOverlay(contentContainer.innerHTML);
                    }
                  });
                }
              }
            }
          });
        }
      });
    });

    // Start observing
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // Run initialization when page is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();