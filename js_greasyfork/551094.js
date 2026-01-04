// ==UserScript==
// @name         Jig Chat
// @namespace    http://tampermonkey.net/
// @version      1.2.0
// @description  Talk to Jig.
// @author       Todd Coleman
// @match        https://*.workamajig.com/*
// @license MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=workamajig.com
// @downloadURL https://update.greasyfork.org/scripts/551094/Jig%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/551094/Jig%20Chat.meta.js
// ==/UserScript==
(function () {
    'use strict';

    // ============================================================
    // CONFIGURATION
    // ============================================================
    const webhookUrl = "https://n8n.devhart.com/webhook/d0bd0548-52af-49f6-aba6-362bcf4e9ea0/chat";
    const n8nSessionKey = "n8n-chat/sessionId";

    // ============================================================
    // STYLES - These will be embedded during build
    // ============================================================
    const CHAT_WRAPPER_STYLES = `/* Modern glassmorphism chat container with gradient border */
.n8n-chat-wrapper {
    position: fixed !important;
    bottom: 90px !important;
    right: 90px !important;
    width: 420px !important;
    height: 600px !important;
    z-index: 9999 !important;
    isolation: isolate !important;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif !important;
    border-radius: 24px 24px 5px 5px !important;
    overflow: hidden !important;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.85)) !important;
    backdrop-filter: blur(20px) saturate(180%) !important;
    -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
    box-shadow:
        0 0 0 1px rgba(0, 0, 0, 0.06),
        0 20px 60px rgba(0, 0, 0, 0.12),
        0 8px 25px rgba(0, 0, 0, 0.08) !important;
    animation: slideInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
    transform-origin: bottom right !important;
}

@keyframes slideInUp {
    from {
        opacity: 0;
        transform: translateY(20px) scale(0.95);
    }

    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

/* Let n8n chat use its own styles */
#n8n-chat {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}

/* Ensure input area is visible */
#n8n-chat form,
#n8n-chat [class*="input"],
#n8n-chat [class*="Input"] {
    flex-shrink: 0;
    min-height: 60px;
}`;
    const PULSE_ANIMATION_STYLES = `/* Subtle pulse animation for the floating button */
@keyframes pulse {

    0%,
    100% {
        transform: scale(1);
        box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4), 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    50% {
        transform: scale(1.05);
        box-shadow: 0 12px 32px rgba(102, 126, 234, 0.5), 0 6px 16px rgba(0, 0, 0, 0.15);
    }
}

@keyframes gentlePulse {

    0%,
    100% {
        transform: scale(1);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
    }

    50% {
        transform: scale(1.05);
        box-shadow: 0 12px 30px rgba(0, 0, 0, 0.18);
    }
}

.n8n-chat-button {
    animation: gentlePulse 2s ease-in-out infinite !important;
}`;
    const SHADOW_DOM_STYLES = `/* Styles for shadow DOM to ensure clean isolation */
:host {
    all: initial;
    display: contents;
}

* {
    box-sizing: border-box;
}

/* Enable text selection in chat messages */
#n8n-chat,
#n8n-chat * {
    user-select: text !important;
    -webkit-user-select: text !important;
    -moz-user-select: text !important;
    -ms-user-select: text !important;
}

/* Keep buttons and interactive elements unselectable */
#n8n-chat button,
#n8n-chat input,
#n8n-chat textarea {
    user-select: auto !important;
    -webkit-user-select: auto !important;
}

/* Define CSS variables at the root of shadow DOM */
.jig-n8n-chat {
    /* Base colors */
    --chat--color-primary: #e74266;
    --chat--color-primary-shade-50: #db4061;
    --chat--color-primary-shade-100: #cf3c5c;
    --chat--color-secondary: #20b69e;
    --chat--color-secondary-shade-50: #1ca08a;
    --chat--color-white: #fff;
    --chat--color-light: #f2f4f8;
    --chat--color-light-shade-50: #e6e9f1;
    --chat--color-light-shade-100: #c2c5cc;
    --chat--color-medium: #d2d4d9;
    --chat--color-dark: #101330;
    --chat--color-typing: #667eea;

    /* Spacing and sizing */
    --chat--spacing: 1rem;
    --chat--border-radius: 0.5rem;

    /* Footer */
    --chat--footer--background: var(--chat--color-white);
    --chat--footer--color: var(--chat--color-dark);

    /* Messages */
    --chat--message--font-size: 1.125rem;
    --chat--message--padding: var(--chat--spacing);
    --chat--message--border-radius: var(--chat--border-radius);
    --chat--message-line-height: 1.6;
    --chat--message--margin-bottom: calc(var(--chat--spacing) * 1);
    --chat--message--bot--background: var(--chat--color-white);
    --chat--message--bot--color: var(--chat--color-dark);
    --chat--message--bot--border: 1px solid rgba(102, 126, 234, 0.2);
    --chat--message--user--background: var(--chat--color-secondary);
    --chat--message--user--border: none;
    --chat--message--pre--background: rgba(0, 0, 0, .05);
    --chat--messages-list--padding: var(--chat--spacing);
}

/* Wrapper to contain everything */
.jig-n8n-chat {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
}

/* Chat container styles */
#n8n-chat {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: linear-gradient(to bottom, #f8f9fa 0%, #ffffff 100%);
    overflow: hidden;
    /* Prevent whole container from scrolling */
    position: relative;
}

/* Override n8n's default layout to prevent scrolling */
#n8n-chat .chat-layout,
#n8n-chat [class*="layout"] {
    overflow-y: hidden !important;
    overflow-x: hidden !important;
    display: flex !important;
    flex-direction: column !important;
    height: 100% !important;
}

/* Make the chat body scrollable and take remaining space */
#n8n-chat [class*="chat-body"],
#n8n-chat .chat-body,
#n8n-chat [class*="messages"] {
    flex: 1 1 auto !important;
    overflow-y: auto !important;
    overflow-x: hidden !important;
    min-height: 0 !important;
}

/* Keep header fixed at top */
#n8n-chat [class*="chat-header"],
#n8n-chat .chat-header {
    flex-shrink: 0 !important;
    flex-grow: 0 !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: center !important;
    padding: 2rem 1rem 1.5rem 2rem !important;
    min-height: 100px !important;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Keep footer/input container fixed at bottom */
#n8n-chat [class*="chat-footer"],
#n8n-chat .chat-footer,
#n8n-chat [class*="input-container"],
#n8n-chat .chat-input {
    flex-shrink: 0 !important;
    flex-grow: 0 !important;
    position: sticky !important;
    bottom: 0 !important;
    z-index: 10 !important;
    margin-left: 5px;
}

#n8n-chat form,
#n8n-chat [class*="input"],
#n8n-chat [class*="Input"] {
    flex-shrink: 0 !important;
    min-height: 60px;
}

/* File attachment container - prevent overflow and ensure visibility */
#n8n-chat [class*="chat-files"],
#n8n-chat .chat-files {
    max-height: 120px !important;
    overflow-y: auto !important;
    overflow-x: hidden !important;
    padding: 0.5rem !important;
    background: rgb(100, 98, 98) !important;
    flex-shrink: 0 !important;
}

/* Ensure the entire input section (with files) doesn't get cut off */
#n8n-chat [class*="chat-input"] {
    max-height: 50vh !important;
    overflow-y: auto !important;
}

/* Enhanced input styling */
#n8n-chat input,
#n8n-chat textarea {
    color: #1a1a1a !important;
    font-size: 16px !important;
    font-weight: 400 !important;
    line-height: 1.6 !important;
}

#n8n-chat input::placeholder,
#n8n-chat textarea::placeholder {
    color: #94a3b8 !important;
    font-weight: 400 !important;
}

/* Improved message text readability */
#n8n-chat [class*="chat-message"],
#n8n-chat [class*="message"] {
    font-size: 1.125rem !important;
    line-height: 1.6 !important;
}

#n8n-chat [class*="chat-message"] p,
#n8n-chat [class*="message"] p {
    font-size: 1.125rem !important;
    line-height: 1.6 !important;
    margin-bottom: 0.75rem !important;
}

#n8n-chat [class*="chat-message"] code,
#n8n-chat [class*="message"] code {
    font-size: 1rem !important;
}

/* Header button container for better layout */
.header-buttons {
    position: absolute;
    top: 16px;
    right: 16px;
    display: flex;
    gap: 8px;
    z-index: 1001;
}

/* Elevated New Session button with glassmorphism */
.new-session-btn {
    cursor: pointer;
    font-size: 11px;
    font-weight: 600;
    padding: 9px 14px;
    background: rgba(255, 255, 255, 0.25);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.4);
    border-radius: 10px;
    text-transform: none;
    letter-spacing: 0.3px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    backdrop-filter: blur(12px) saturate(180%);
    -webkit-backdrop-filter: blur(12px) saturate(180%);
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    gap: 5px;
    white-space: nowrap;
}

.new-session-btn::before {
    content: '✨';
    font-size: 13px;
}

.new-session-btn:hover {
    background: rgba(255, 255, 255, 0.35);
    border-color: rgba(255, 255, 255, 0.6);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.new-session-btn:active {
    transform: translateY(0px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Close button with modern styling */
.close-chat-btn {
    cursor: pointer;
    font-size: 20px;
    font-weight: 400;
    width: 36px;
    height: 36px;
    padding: 0;
    background: rgba(255, 255, 255, 0.2);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 10px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    backdrop-filter: blur(12px) saturate(180%);
    -webkit-backdrop-filter: blur(12px) saturate(180%);
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
    flex-shrink: 0;
    padding-bottom: 2px;
}

.close-chat-btn:hover {
    background: rgba(255, 255, 255, 0.35);
    border-color: rgba(255, 255, 255, 0.6);
    transform: scale(1.05) rotate(90deg);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.close-chat-btn:active {
    transform: scale(0.95) rotate(90deg);
}

/* Enhanced message bubbles with modern styling */
#n8n-chat [class*="message"] {
    animation: messageSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes messageSlideIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Smooth scrollbar styling */
#n8n-chat [class*="chat-body"]::-webkit-scrollbar {
    width: 6px;
}

#n8n-chat [class*="chat-body"]::-webkit-scrollbar-track {
    background: transparent;
}

#n8n-chat [class*="chat-body"]::-webkit-scrollbar-thumb {
    background: rgba(102, 126, 234, 0.3);
    border-radius: 3px;
    transition: background 0.2s;
}

#n8n-chat [class*="chat-body"]::-webkit-scrollbar-thumb:hover {
    background: rgba(102, 126, 234, 0.5);
}

/* Enhanced input container with border gradient */
#n8n-chat [class*="input-container"],
#n8n-chat form {
    background: white !important;
    border-top: 1px solid rgba(102, 126, 234, 0.15) !important;
    padding: 16px !important;
    backdrop-filter: blur(10px) !important;
}

/* Send button enhancement */
#n8n-chat button[type="submit"] {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3) !important;
}

#n8n-chat button[type="submit"]:hover {
    transform: scale(1.05) !important;
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4) !important;
}

/* Title styling enhancement */
#n8n-chat [class*="title"],
#n8n-chat [class*="header"] h1 {
    color: white !important;
    font-weight: 700 !important;
    font-size: 2rem !important;
    letter-spacing: -0.5px !important;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
    z-index: 1 !important;
    position: relative !important;
    margin: 0 0 0.5rem 0 !important;
    text-align: left !important;
}

/* Subtitle styling - make it visible */
#n8n-chat [class*="subtitle"],
#n8n-chat [class*="header"] h2,
#n8n-chat [class*="header"] p {
    color: rgba(255, 255, 255, 0.9) !important;
    font-weight: 400 !important;
    font-size: 1.125rem !important;
    letter-spacing: 0.2px !important;
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.1) !important;
    z-index: 1 !important;
    position: relative !important;
    margin: 0 !important;
    text-align: left !important;
    opacity: 1 !important;
    display: block !important;
    visibility: visible !important;
}

/* Typing indicator bubbles - ensure they're visible with bouncing animation */
#n8n-chat [class*="typing"] [class*="circle"] {
    background-color: var(--chat--color-typing) !important;
    animation: typingBounce 1.4s ease-in-out infinite !important;
}

/* Stagger the animation for each bubble */
#n8n-chat [class*="typing"] [class*="circle"]:nth-child(1) {
    animation-delay: 0s !important;
}

#n8n-chat [class*="typing"] [class*="circle"]:nth-child(2) {
    animation-delay: 0.2s !important;
}

#n8n-chat [class*="typing"] [class*="circle"]:nth-child(3) {
    animation-delay: 0.4s !important;
}

/* Bouncing animation keyframes */
@keyframes typingBounce {

    0%,
    60%,
    100% {
        transform: translateY(0);
    }

    30% {
        transform: translateY(-10px);
    }
}`;
    const SLIDE_OUT_ANIMATION_STYLES = `/* Smooth slide-out animation when closing */
@keyframes slideOut {
    from {
        opacity: 1;
        transform: translateY(0) scale(1);
    }

    to {
        opacity: 0;
        transform: translateY(20px) scale(0.95);
    }
}

.n8n-chat-wrapper.closing {
    animation: slideOut 0.3s cubic-bezier(0.4, 0, 1, 1) forwards !important;
}`;
    const JIG_N8N_STYLE = `.jig-n8n-chat {
  /*! Package version @n8n/chat@0.60.0 */
}
.jig-n8n-chat :root {
  --chat--color-primary: #e74266;
  --chat--color-primary-shade-50: #db4061;
  --chat--color-primary-shade-100: #cf3c5c;
  --chat--color-secondary: #20b69e;
  --chat--color-secondary-shade-50: #1ca08a;
  --chat--color-white: #fff;
  --chat--color-light: #f2f4f8;
  --chat--color-light-shade-50: #e6e9f1;
  --chat--color-light-shade-100: #c2c5cc;
  --chat--color-medium: #d2d4d9;
  --chat--color-dark: #101330;
  --chat--color-disabled: #d2d4d9;
  --chat--color-typing: #404040;
  --chat--spacing: 1rem;
  --chat--border-radius: .25rem;
  --chat--transition-duration: .15s;
  --chat--font-family: (-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif);
  --chat--window--width: 400px;
  --chat--window--height: 600px;
  --chat--window--bottom: var(--chat--spacing);
  --chat--window--right: var(--chat--spacing);
  --chat--window--z-index: 9999;
  --chat--window--border: 1px solid var(--chat--color-light-shade-50);
  --chat--window--border-radius: var(--chat--border-radius);
  --chat--window--margin-bottom: var(--chat--spacing);
  --chat--header-height: auto;
  --chat--header--padding: var(--chat--spacing);
  --chat--header--background: var(--chat--color-dark);
  --chat--header--color: var(--chat--color-light);
  --chat--header--border-top: none;
  --chat--header--border-bottom: none;
  --chat--header--border-left: none;
  --chat--header--border-right: none;
  --chat--heading--font-size: 2em;
  --chat--subtitle--font-size: inherit;
  --chat--subtitle--line-height: 1.8;
  --chat--message--font-size: 1rem;
  --chat--message--padding: var(--chat--spacing);
  --chat--message--border-radius: var(--chat--border-radius);
  --chat--message-line-height: 1.5;
  --chat--message--margin-bottom: calc(var(--chat--spacing) * 1);
  --chat--message--bot--background: var(--chat--color-white);
  --chat--message--bot--color: var(--chat--color-dark);
  --chat--message--bot--border: none;
  --chat--message--user--background: var(--chat--color-secondary);
  --chat--message--user--color: var(--chat--color-white);
  --chat--message--user--border: none;
  --chat--message--pre--background: rgba(0, 0, 0, .05);
  --chat--messages-list--padding: var(--chat--spacing);
  --chat--toggle--size: 64px;
  --chat--toggle--width: var(--chat--toggle--size);
  --chat--toggle--height: var(--chat--toggle--size);
  --chat--toggle--border-radius: 50%;
  --chat--toggle--background: var(--chat--color-primary);
  --chat--toggle--hover--background: var(--chat--color-primary-shade-50);
  --chat--toggle--active--background: var(--chat--color-primary-shade-100);
  --chat--toggle--color: var(--chat--color-white);
  --chat--textarea--height: 50px;
  --chat--textarea--max-height: 30rem;
  --chat--input--font-size: inherit;
  --chat--input--border: 0;
  --chat--input--border-radius: 0;
  --chat--input--padding: .8rem;
  --chat--input--background: var(--chat--color-white);
  --chat--input--text-color: initial;
  --chat--input--line-height: 1.5;
  --chat--input--placeholder--font-size: var(--chat--input--font-size);
  --chat--input--border-active: 0;
  --chat--input--left--panel--width: 2rem;
  --chat--button--color: var(--chat--color-light);
  --chat--button--background: var(--chat--color-primary);
  --chat--button--padding: calc(var(--chat--spacing) * 1 / 2) var(--chat--spacing);
  --chat--button--border-radius: var(--chat--border-radius);
  --chat--button--hover--color: var(--chat--color-light);
  --chat--button--hover--background: var(--chat--color-primary-shade-50);
  --chat--close--button--color-hover: var(--chat--color-primary);
  --chat--input--send--button--background: var(--chat--color-white);
  --chat--input--send--button--color: var(--chat--color-secondary);
  --chat--input--send--button--background-hover: var(--chat--color-primary-shade-50);
  --chat--input--send--button--color-hover: var(--chat--color-secondary-shade-50);
  --chat--input--file--button--background: var(--chat--color-white);
  --chat--input--file--button--color: var(--chat--color-secondary);
  --chat--input--file--button--background-hover: var(--chat--input--file--button--background);
  --chat--input--file--button--color-hover: var(--chat--color-secondary-shade-50);
  --chat--files-spacing: .25rem;
  --chat--body--background: var(--chat--color-light);
  --chat--footer--background: var(--chat--color-light);
  --chat--footer--color: var(--chat--color-dark) ;
}
.jig-n8n-chat pre code.hljs {
  display: block;
  overflow-x: auto;
  padding: 1em;
}
.jig-n8n-chat code.hljs {
  padding: 3px 5px;
}
.jig-n8n-chat {
  /*!
    Theme: GitHub
    Description: Light theme as seen on github.com
    Author: github.com
    Maintainer: @Hirse
    Updated: 2021-05-15

    Outdated base version: https://github.com/primer/github-syntax-light
    Current colors taken from GitHub's CSS
  */
}
.jig-n8n-chat .hljs {
  color: #24292e;
  background: #fff;
}
.jig-n8n-chat .hljs-doctag,
.jig-n8n-chat .hljs-keyword,
.jig-n8n-chat .hljs-meta .hljs-keyword,
.jig-n8n-chat .hljs-template-tag,
.jig-n8n-chat .hljs-template-variable,
.jig-n8n-chat .hljs-type,
.jig-n8n-chat .hljs-variable.language_ {
  color: #d73a49;
}
.jig-n8n-chat .hljs-title,
.jig-n8n-chat .hljs-title.class_,
.jig-n8n-chat .hljs-title.class_.inherited__,
.jig-n8n-chat .hljs-title.function_ {
  color: #6f42c1;
}
.jig-n8n-chat .hljs-attr,
.jig-n8n-chat .hljs-attribute,
.jig-n8n-chat .hljs-literal,
.jig-n8n-chat .hljs-meta,
.jig-n8n-chat .hljs-number,
.jig-n8n-chat .hljs-operator,
.jig-n8n-chat .hljs-variable,
.jig-n8n-chat .hljs-selector-attr,
.jig-n8n-chat .hljs-selector-class,
.jig-n8n-chat .hljs-selector-id {
  color: #005cc5;
}
.jig-n8n-chat .hljs-regexp,
.jig-n8n-chat .hljs-string,
.jig-n8n-chat .hljs-meta .hljs-string {
  color: #032f62;
}
.jig-n8n-chat .hljs-built_in,
.jig-n8n-chat .hljs-symbol {
  color: #e36209;
}
.jig-n8n-chat .hljs-comment,
.jig-n8n-chat .hljs-code,
.jig-n8n-chat .hljs-formula {
  color: #6a737d;
}
.jig-n8n-chat .hljs-name,
.jig-n8n-chat .hljs-quote,
.jig-n8n-chat .hljs-selector-tag,
.jig-n8n-chat .hljs-selector-pseudo {
  color: #22863a;
}
.jig-n8n-chat .hljs-subst {
  color: #24292e;
}
.jig-n8n-chat .hljs-section {
  color: #005cc5;
  font-weight: 700;
}
.jig-n8n-chat .hljs-bullet {
  color: #735c0f;
}
.jig-n8n-chat .hljs-emphasis {
  color: #24292e;
  font-style: italic;
}
.jig-n8n-chat .hljs-strong {
  color: #24292e;
  font-weight: 700;
}
.jig-n8n-chat .hljs-addition {
  color: #22863a;
  background-color: #f0fff4;
}
.jig-n8n-chat .hljs-deletion {
  color: #b31d28;
  background-color: #ffeef0;
}
.jig-n8n-chat body[data-theme=dark] pre code.hljs {
  display: block;
  overflow-x: auto;
  padding: 1em;
}
.jig-n8n-chat body[data-theme=dark] code.hljs {
  padding: 3px 5px;
}
.jig-n8n-chat body[data-theme=dark] .hljs {
  color: #adbac7;
  background: #22272e;
}
.jig-n8n-chat body[data-theme=dark] .hljs-doctag,
.jig-n8n-chat body[data-theme=dark] .hljs-keyword,
.jig-n8n-chat body[data-theme=dark] .hljs-meta .hljs-keyword,
.jig-n8n-chat body[data-theme=dark] .hljs-template-tag,
.jig-n8n-chat body[data-theme=dark] .hljs-template-variable,
.jig-n8n-chat body[data-theme=dark] .hljs-type,
.jig-n8n-chat body[data-theme=dark] .hljs-variable.language_ {
  color: #f47067;
}
.jig-n8n-chat body[data-theme=dark] .hljs-title,
.jig-n8n-chat body[data-theme=dark] .hljs-title.class_,
.jig-n8n-chat body[data-theme=dark] .hljs-title.class_.inherited__,
.jig-n8n-chat body[data-theme=dark] .hljs-title.function_ {
  color: #dcbdfb;
}
.jig-n8n-chat body[data-theme=dark] .hljs-attr,
.jig-n8n-chat body[data-theme=dark] .hljs-attribute,
.jig-n8n-chat body[data-theme=dark] .hljs-literal,
.jig-n8n-chat body[data-theme=dark] .hljs-meta,
.jig-n8n-chat body[data-theme=dark] .hljs-number,
.jig-n8n-chat body[data-theme=dark] .hljs-operator,
.jig-n8n-chat body[data-theme=dark] .hljs-variable,
.jig-n8n-chat body[data-theme=dark] .hljs-selector-attr,
.jig-n8n-chat body[data-theme=dark] .hljs-selector-class,
.jig-n8n-chat body[data-theme=dark] .hljs-selector-id {
  color: #6cb6ff;
}
.jig-n8n-chat body[data-theme=dark] .hljs-regexp,
.jig-n8n-chat body[data-theme=dark] .hljs-string,
.jig-n8n-chat body[data-theme=dark] .hljs-meta .hljs-string {
  color: #96d0ff;
}
.jig-n8n-chat body[data-theme=dark] .hljs-built_in,
.jig-n8n-chat body[data-theme=dark] .hljs-symbol {
  color: #f69d50;
}
.jig-n8n-chat body[data-theme=dark] .hljs-comment,
.jig-n8n-chat body[data-theme=dark] .hljs-code,
.jig-n8n-chat body[data-theme=dark] .hljs-formula {
  color: #768390;
}
.jig-n8n-chat body[data-theme=dark] .hljs-name,
.jig-n8n-chat body[data-theme=dark] .hljs-quote,
.jig-n8n-chat body[data-theme=dark] .hljs-selector-tag,
.jig-n8n-chat body[data-theme=dark] .hljs-selector-pseudo {
  color: #8ddb8c;
}
.jig-n8n-chat body[data-theme=dark] .hljs-subst {
  color: #adbac7;
}
.jig-n8n-chat body[data-theme=dark] .hljs-section {
  color: #316dca;
  font-weight: 700;
}
.jig-n8n-chat body[data-theme=dark] .hljs-bullet {
  color: #eac55f;
}
.jig-n8n-chat body[data-theme=dark] .hljs-emphasis {
  color: #adbac7;
  font-style: italic;
}
.jig-n8n-chat body[data-theme=dark] .hljs-strong {
  color: #adbac7;
  font-weight: 700;
}
.jig-n8n-chat body[data-theme=dark] .hljs-addition {
  color: #b4f1b4;
  background-color: #1b4721;
}
.jig-n8n-chat body[data-theme=dark] .hljs-deletion {
  color: #ffd8d3;
  background-color: #78191b;
}
@media (prefers-color-scheme: dark) {
  .jig-n8n-chat body pre code.hljs {
    display: block;
    overflow-x: auto;
    padding: 1em;
  }
  .jig-n8n-chat body code.hljs {
    padding: 3px 5px;
  }
  .jig-n8n-chat body .hljs {
    color: #adbac7;
    background: #22272e;
  }
  .jig-n8n-chat body .hljs-doctag,
  .jig-n8n-chat body .hljs-keyword,
  .jig-n8n-chat body .hljs-meta .hljs-keyword,
  .jig-n8n-chat body .hljs-template-tag,
  .jig-n8n-chat body .hljs-template-variable,
  .jig-n8n-chat body .hljs-type,
  .jig-n8n-chat body .hljs-variable.language_ {
    color: #f47067;
  }
  .jig-n8n-chat body .hljs-title,
  .jig-n8n-chat body .hljs-title.class_,
  .jig-n8n-chat body .hljs-title.class_.inherited__,
  .jig-n8n-chat body .hljs-title.function_ {
    color: #dcbdfb;
  }
  .jig-n8n-chat body .hljs-attr,
  .jig-n8n-chat body .hljs-attribute,
  .jig-n8n-chat body .hljs-literal,
  .jig-n8n-chat body .hljs-meta,
  .jig-n8n-chat body .hljs-number,
  .jig-n8n-chat body .hljs-operator,
  .jig-n8n-chat body .hljs-variable,
  .jig-n8n-chat body .hljs-selector-attr,
  .jig-n8n-chat body .hljs-selector-class,
  .jig-n8n-chat body .hljs-selector-id {
    color: #6cb6ff;
  }
  .jig-n8n-chat body .hljs-regexp,
  .jig-n8n-chat body .hljs-string,
  .jig-n8n-chat body .hljs-meta .hljs-string {
    color: #96d0ff;
  }
  .jig-n8n-chat body .hljs-built_in,
  .jig-n8n-chat body .hljs-symbol {
    color: #f69d50;
  }
  .jig-n8n-chat body .hljs-comment,
  .jig-n8n-chat body .hljs-code,
  .jig-n8n-chat body .hljs-formula {
    color: #768390;
  }
  .jig-n8n-chat body .hljs-name,
  .jig-n8n-chat body .hljs-quote,
  .jig-n8n-chat body .hljs-selector-tag,
  .jig-n8n-chat body .hljs-selector-pseudo {
    color: #8ddb8c;
  }
  .jig-n8n-chat body .hljs-subst {
    color: #adbac7;
  }
  .jig-n8n-chat body .hljs-section {
    color: #316dca;
    font-weight: 700;
  }
  .jig-n8n-chat body .hljs-bullet {
    color: #eac55f;
  }
  .jig-n8n-chat body .hljs-emphasis {
    color: #adbac7;
    font-style: italic;
  }
  .jig-n8n-chat body .hljs-strong {
    color: #adbac7;
    font-weight: 700;
  }
  .jig-n8n-chat body .hljs-addition {
    color: #b4f1b4;
    background-color: #1b4721;
  }
  .jig-n8n-chat body .hljs-deletion {
    color: #ffd8d3;
    background-color: #78191b;
  }
}
.jig-n8n-chat .chat-message-markdown {
  line-height: 1.4;
  -webkit-text-size-adjust: 100%;
  word-break: break-word;
}
.jig-n8n-chat .chat-message-markdown *,
.jig-n8n-chat .chat-message-markdown :before,
.jig-n8n-chat .chat-message-markdown :after {
  box-sizing: border-box;
}
.jig-n8n-chat .chat-message-markdown :before,
.jig-n8n-chat .chat-message-markdown :after {
  text-decoration: inherit;
  vertical-align: inherit;
}
.jig-n8n-chat .chat-message-markdown body,
.jig-n8n-chat .chat-message-markdown dl dl,
.jig-n8n-chat .chat-message-markdown dl ol,
.jig-n8n-chat .chat-message-markdown dl ul,
.jig-n8n-chat .chat-message-markdown ol dl,
.jig-n8n-chat .chat-message-markdown ul dl,
.jig-n8n-chat .chat-message-markdown ol ol,
.jig-n8n-chat .chat-message-markdown ol ul,
.jig-n8n-chat .chat-message-markdown ul ol,
.jig-n8n-chat .chat-message-markdown ul ul,
.jig-n8n-chat .chat-message-markdown button,
.jig-n8n-chat .chat-message-markdown input,
.jig-n8n-chat .chat-message-markdown select,
.jig-n8n-chat .chat-message-markdown textarea {
  margin: 0;
}
.jig-n8n-chat .chat-message-markdown hr {
  overflow: visible;
  height: 0;
}
.jig-n8n-chat .chat-message-markdown main,
.jig-n8n-chat .chat-message-markdown details {
  display: block;
}
.jig-n8n-chat .chat-message-markdown summary {
  display: list-item;
}
.jig-n8n-chat .chat-message-markdown nav ol,
.jig-n8n-chat .chat-message-markdown nav ul {
  list-style: none;
  padding: 0;
}
.jig-n8n-chat .chat-message-markdown pre,
.jig-n8n-chat .chat-message-markdown code,
.jig-n8n-chat .chat-message-markdown kbd,
.jig-n8n-chat .chat-message-markdown samp {
  font-family: var(--font-family-monospace), "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  font-size: 1em;
}
.jig-n8n-chat .chat-message-markdown abbr[title] {
  cursor: help;
  text-decoration: underline;
  -webkit-text-decoration: underline dotted;
  text-decoration: underline dotted;
}
.jig-n8n-chat .chat-message-markdown b,
.jig-n8n-chat .chat-message-markdown strong {
  font-weight: var(--font-weight-bold);
}
.jig-n8n-chat .chat-message-markdown small {
  font-size: 80%;
  opacity: 0.8;
}
.jig-n8n-chat .chat-message-markdown audio,
.jig-n8n-chat .chat-message-markdown canvas,
.jig-n8n-chat .chat-message-markdown iframe,
.jig-n8n-chat .chat-message-markdown img,
.jig-n8n-chat .chat-message-markdown svg,
.jig-n8n-chat .chat-message-markdown video {
  vertical-align: middle;
}
.jig-n8n-chat .chat-message-markdown iframe {
  border-style: none;
}
.jig-n8n-chat .chat-message-markdown svg:not([fill]) {
  fill: currentColor;
}
.jig-n8n-chat .chat-message-markdown svg:not(:root) {
  overflow: hidden;
}
.jig-n8n-chat .chat-message-markdown button,
.jig-n8n-chat .chat-message-markdown input {
  overflow: visible;
}
.jig-n8n-chat .chat-message-markdown button,
.jig-n8n-chat .chat-message-markdown select {
  text-transform: none;
}
.jig-n8n-chat .chat-message-markdown button,
.jig-n8n-chat .chat-message-markdown [type=button],
.jig-n8n-chat .chat-message-markdown [type=reset],
.jig-n8n-chat .chat-message-markdown [type=submit] {
  -webkit-appearance: button;
}
.jig-n8n-chat .chat-message-markdown fieldset {
  border: 1px solid #666;
  padding: 0.35em 0.75em 0.625em;
}
.jig-n8n-chat .chat-message-markdown legend {
  color: inherit;
  display: table;
  max-width: 100%;
  white-space: normal;
}
.jig-n8n-chat .chat-message-markdown progress {
  display: inline-block;
  vertical-align: baseline;
}
.jig-n8n-chat .chat-message-markdown textarea {
  overflow: auto;
  resize: vertical;
}
.jig-n8n-chat .chat-message-markdown [type=search] {
  outline-offset: -2px;
  -webkit-appearance: textfield;
}
.jig-n8n-chat .chat-message-markdown ::-webkit-inner-spin-button,
.jig-n8n-chat .chat-message-markdown ::-webkit-outer-spin-button {
  height: auto;
}
.jig-n8n-chat .chat-message-markdown ::-webkit-input-placeholder {
  color: inherit;
  opacity: 0.54;
}
.jig-n8n-chat .chat-message-markdown ::-webkit-search-decoration {
  -webkit-appearance: none;
}
.jig-n8n-chat .chat-message-markdown ::-webkit-file-upload-button {
  font: inherit;
  -webkit-appearance: button;
}
.jig-n8n-chat .chat-message-markdown ::-moz-focus-inner {
  border-style: none;
  padding: 0;
}
.jig-n8n-chat .chat-message-markdown :-moz-focusring {
  outline: 1px dotted ButtonText;
}
.jig-n8n-chat .chat-message-markdown :-moz-ui-invalid {
  box-shadow: none;
}
.jig-n8n-chat .chat-message-markdown [aria-busy=true] {
  cursor: progress;
}
.jig-n8n-chat .chat-message-markdown [aria-controls] {
  cursor: pointer;
}
.jig-n8n-chat .chat-message-markdown [aria-disabled=true],
.jig-n8n-chat .chat-message-markdown [disabled] {
  cursor: not-allowed;
}
.jig-n8n-chat .chat-message-markdown [aria-hidden=false][hidden] {
  display: inline;
  display: initial;
}
.jig-n8n-chat .chat-message-markdown [aria-hidden=false][hidden]:not(:focus) {
  clip: rect(0, 0, 0, 0);
  position: absolute;
}
@media print {
  .jig-n8n-chat .chat-message-markdown a[href^=http]:after {
    content: " (" attr(href) ")";
  }
}
.jig-n8n-chat .chat-message-markdown :root {
  --background-main: #fefefe;
  --background-element: #eee;
  --background-inverted: #282a36;
  --text-main: #1f1f1f;
  --text-alt: #333;
  --text-inverted: #fefefe;
  --border-element: #282a36;
  --theme: #7a283a;
  --theme-light: hsl(0, 25%, 65%);
  --theme-dark: hsl(0, 25%, 45%) ;
}
.jig-n8n-chat .chat-message-markdown body {
  margin: auto;
  max-width: 36rem;
  min-height: 100%;
  overflow-x: hidden;
  background: var(--background-main);
  color: var(--text-main);
}
.jig-n8n-chat .chat-message-markdown h1,
.jig-n8n-chat .chat-message-markdown h2,
.jig-n8n-chat .chat-message-markdown h3,
.jig-n8n-chat .chat-message-markdown h4,
.jig-n8n-chat .chat-message-markdown h5,
.jig-n8n-chat .chat-message-markdown h6 {
  margin: 2rem 0 0.8em;
}
.jig-n8n-chat .chat-message-markdown h1 {
  font-size: 2.441rem;
  line-height: 1.1;
}
.jig-n8n-chat .chat-message-markdown h2 {
  font-size: 1.953rem;
  line-height: 1.15;
}
.jig-n8n-chat .chat-message-markdown h3 {
  font-size: 1.563rem;
  line-height: 1.2;
}
.jig-n8n-chat .chat-message-markdown h4 {
  font-size: 1.25rem;
  line-height: 1.3;
}
.jig-n8n-chat .chat-message-markdown h5,
.jig-n8n-chat .chat-message-markdown h6 {
  font-size: 1rem;
  line-height: 1.4;
}
.jig-n8n-chat .chat-message-markdown p,
.jig-n8n-chat .chat-message-markdown ul,
.jig-n8n-chat .chat-message-markdown ol,
.jig-n8n-chat .chat-message-markdown figure {
  margin: 0.6rem 0 1.2rem;
}
.jig-n8n-chat .chat-message-markdown h1 span,
.jig-n8n-chat .chat-message-markdown h2 span,
.jig-n8n-chat .chat-message-markdown h3 span,
.jig-n8n-chat .chat-message-markdown h4 span,
.jig-n8n-chat .chat-message-markdown h5 span,
.jig-n8n-chat .chat-message-markdown h6 span {
  display: block;
  font-size: 1em;
  font-style: italic;
  font-weight: var(--font-weight-regular);
  line-height: 1.3;
  margin-top: 0.3em;
}
.jig-n8n-chat .chat-message-markdown h1 span {
  font-size: 0.6em;
}
.jig-n8n-chat .chat-message-markdown h2 span {
  font-size: 0.7em;
}
.jig-n8n-chat .chat-message-markdown h3 span {
  font-size: 0.8em;
}
.jig-n8n-chat .chat-message-markdown h4 span {
  font-size: 0.9em;
}
.jig-n8n-chat .chat-message-markdown mark {
  background: pink;
  padding: 0.1em 0.15em;
}
.jig-n8n-chat .chat-message-markdown pre {
  -moz-tab-size: 4;
  -o-tab-size: 4;
  tab-size: 4;
}
.jig-n8n-chat .chat-message-markdown ins {
  text-decoration: none;
  font-weight: var(--font-weight-bold);
}
.jig-n8n-chat .chat-message-markdown blockquote {
  border-left: 0.3rem solid #7a283a;
  border-left: 0.3rem solid var(--theme);
  margin: 0.6rem 0 1.2rem;
  padding-left: 2rem;
}
.jig-n8n-chat .chat-message-markdown blockquote p {
  font-size: 1.2em;
  font-style: italic;
}
.jig-n8n-chat .chat-message-markdown figure {
  margin: 0;
}
.jig-n8n-chat .chat-message-markdown a {
  color: #7a283a;
  color: var(--theme);
  text-decoration: underline;
}
.jig-n8n-chat .chat-message-markdown a:hover {
  color: #bc8f8f;
  color: var(--theme-light);
}
.jig-n8n-chat .chat-message-markdown a:active {
  color: #8f5656;
  color: var(--theme-dark);
}
.jig-n8n-chat .chat-message-markdown :focus {
  outline: 3px solid hsl(0, 25%, 65%);
  outline: 3px solid var(--theme-light);
  outline-offset: 3px;
}
.jig-n8n-chat .chat-message-markdown input {
  background: #eee;
  background: var(--background-element);
  padding: 0.5rem 0.65rem;
  border-radius: 0.5rem;
  border: 2px solid #282a36;
  border: 2px solid var(--border-element);
  font-size: 1rem;
}
.jig-n8n-chat .chat-message-markdown kbd,
.jig-n8n-chat .chat-message-markdown code {
  padding: 0.1em 0.25em;
  border-radius: 0.2rem;
  -webkit-box-decoration-break: clone;
  box-decoration-break: clone;
}
.jig-n8n-chat .chat-message-markdown kbd > kbd {
  padding-left: 0;
  padding-right: 0;
}
.jig-n8n-chat .chat-message-markdown pre code {
  display: block;
  padding: 0 0 0.5rem 0.5rem;
  word-break: normal;
  overflow-x: auto;
}
.jig-n8n-chat .chat-message-markdown [tabindex="-1"]:focus {
  outline: none;
}
.jig-n8n-chat .chat-message-markdown [hidden] {
  display: none;
}
.jig-n8n-chat .chat-message-markdown [aria-disabled],
.jig-n8n-chat .chat-message-markdown [disabled] {
  cursor: not-allowed !important;
  pointer-events: none !important;
}
.jig-n8n-chat .chat-message-markdown a[href^="#"]:after {
  content: "";
}
.jig-n8n-chat .chat-message-markdown body > a:first-child {
  background: #7a283a;
  background: var(--theme);
  border-radius: 0.2rem;
  color: #fefefe;
  color: var(--text-inverted);
  padding: 0.3em 0.5em;
  position: absolute;
  top: -10rem;
}
.jig-n8n-chat .chat-message-markdown body > a:first-child:focus {
  top: 1rem;
}
.jig-n8n-chat .chat-message-markdown ul,
.jig-n8n-chat .chat-message-markdown ol {
  padding-left: 1.5rem;
  margin-bottom: 1rem;
}
.jig-n8n-chat .chat-message-markdown ul li,
.jig-n8n-chat .chat-message-markdown ol li {
  margin-bottom: 0.5rem;
}
.jig-n8n-chat .n8n-chat pre code.hljs {
  display: block;
  overflow-x: auto;
  padding: 1em;
}
.jig-n8n-chat .n8n-chat code.hljs {
  padding: 3px 5px;
}
.jig-n8n-chat .n8n-chat .hljs {
  color: #24292e;
  background: #fff;
}
.jig-n8n-chat .n8n-chat .hljs-doctag,
.jig-n8n-chat .n8n-chat .hljs-keyword,
.jig-n8n-chat .n8n-chat .hljs-meta .hljs-keyword,
.jig-n8n-chat .n8n-chat .hljs-template-tag,
.jig-n8n-chat .n8n-chat .hljs-template-variable,
.jig-n8n-chat .n8n-chat .hljs-type,
.jig-n8n-chat .n8n-chat .hljs-variable.language_ {
  color: #d73a49;
}
.jig-n8n-chat .n8n-chat .hljs-title,
.jig-n8n-chat .n8n-chat .hljs-title.class_,
.jig-n8n-chat .n8n-chat .hljs-title.class_.inherited__,
.jig-n8n-chat .n8n-chat .hljs-title.function_ {
  color: #6f42c1;
}
.jig-n8n-chat .n8n-chat .hljs-attr,
.jig-n8n-chat .n8n-chat .hljs-attribute,
.jig-n8n-chat .n8n-chat .hljs-literal,
.jig-n8n-chat .n8n-chat .hljs-meta,
.jig-n8n-chat .n8n-chat .hljs-number,
.jig-n8n-chat .n8n-chat .hljs-operator,
.jig-n8n-chat .n8n-chat .hljs-variable,
.jig-n8n-chat .n8n-chat .hljs-selector-attr,
.jig-n8n-chat .n8n-chat .hljs-selector-class,
.jig-n8n-chat .n8n-chat .hljs-selector-id {
  color: #005cc5;
}
.jig-n8n-chat .n8n-chat .hljs-regexp,
.jig-n8n-chat .n8n-chat .hljs-string,
.jig-n8n-chat .n8n-chat .hljs-meta .hljs-string {
  color: #032f62;
}
.jig-n8n-chat .n8n-chat .hljs-built_in,
.jig-n8n-chat .n8n-chat .hljs-symbol {
  color: #e36209;
}
.jig-n8n-chat .n8n-chat .hljs-comment,
.jig-n8n-chat .n8n-chat .hljs-code,
.jig-n8n-chat .n8n-chat .hljs-formula {
  color: #6a737d;
}
.jig-n8n-chat .n8n-chat .hljs-name,
.jig-n8n-chat .n8n-chat .hljs-quote,
.jig-n8n-chat .n8n-chat .hljs-selector-tag,
.jig-n8n-chat .n8n-chat .hljs-selector-pseudo {
  color: #22863a;
}
.jig-n8n-chat .n8n-chat .hljs-subst {
  color: #24292e;
}
.jig-n8n-chat .n8n-chat .hljs-section {
  color: #005cc5;
  font-weight: 700;
}
.jig-n8n-chat .n8n-chat .hljs-bullet {
  color: #735c0f;
}
.jig-n8n-chat .n8n-chat .hljs-emphasis {
  color: #24292e;
  font-style: italic;
}
.jig-n8n-chat .n8n-chat .hljs-strong {
  color: #24292e;
  font-weight: 700;
}
.jig-n8n-chat .n8n-chat .hljs-addition {
  color: #22863a;
  background-color: #f0fff4;
}
.jig-n8n-chat .n8n-chat .hljs-deletion {
  color: #b31d28;
  background-color: #ffeef0;
}
.jig-n8n-chat .chat-button {
  display: inline-flex;
  text-align: center;
  vertical-align: middle;
  -webkit-user-select: none;
  user-select: none;
  color: var(--chat--button--color);
  background-color: var(--chat--button--background);
  border: 1px solid transparent;
  padding: var(--chat--button--padding);
  font-size: 1rem;
  line-height: 1.5;
  border-radius: var(--chat--button--border-radius);
  transition: color var(--chat--transition-duration) ease-in-out, background-color var(--chat--transition-duration) ease-in-out, border-color var(--chat--transition-duration) ease-in-out, box-shadow var(--chat--transition-duration) ease-in-out;
  cursor: pointer;
}
.jig-n8n-chat .chat-button:hover {
  color: var(--chat--button--hover--color);
  background-color: var(--chat--button--hover--background);
  text-decoration: none;
}
.jig-n8n-chat .chat-button:focus {
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.2509803922);
}
.jig-n8n-chat .chat-button:disabled {
  opacity: 0.65;
}
.jig-n8n-chat .chat-get-started {
  padding-top: var(--chat--spacing);
  padding-bottom: var(--chat--spacing);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.jig-n8n-chat .chat-powered-by {
  text-align: center;
}
.jig-n8n-chat .chat-powered-by a {
  color: var(--chat--color-primary);
  text-decoration: none;
}
.jig-n8n-chat .chat-get-started-footer {
  padding: var(--chat--spacing);
}
.jig-n8n-chat .chat-file[data-v-e0d57af7] {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  width: fit-content;
  max-width: 15rem;
  padding: 0.5rem;
  border-radius: 0.25rem;
  gap: 0.25rem;
  font-size: 0.75rem;
  background: #fff;
  color: var(--chat--color-dark);
  border: 1px solid var(--chat--color-dark);
  cursor: pointer;
}
.jig-n8n-chat .chat-file-name-tooltip[data-v-e0d57af7] {
  overflow: hidden;
}
.jig-n8n-chat .chat-file-name[data-v-e0d57af7] {
  overflow: hidden;
  max-width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0;
}
.jig-n8n-chat .chat-file-delete[data-v-e0d57af7],
.jig-n8n-chat .chat-file-preview[data-v-e0d57af7] {
  background: none;
  border: none;
  display: block;
  cursor: pointer;
  flex-shrink: 0;
}
.jig-n8n-chat .chat-file-delete[data-v-e0d57af7] {
  position: relative;
}
.jig-n8n-chat .chat-file-delete[data-v-e0d57af7]:hover {
  color: red;
}
.jig-n8n-chat .chat-file-delete[data-v-e0d57af7]:before {
  content: "";
  position: absolute;
  top: -10px;
  right: -10px;
  bottom: -10px;
  left: -10px;
}
.jig-n8n-chat .chat-input[data-v-040531b3] {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  flex-direction: column;
  position: relative;
}
.jig-n8n-chat .chat-input[data-v-040531b3] * {
  box-sizing: border-box;
}
.jig-n8n-chat .chat-inputs[data-v-040531b3] {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
}
.jig-n8n-chat .chat-inputs textarea[data-v-040531b3] {
  font-family: inherit;
  font-size: var(--chat--input--font-size);
  width: 100%;
  border: var(--chat--input--border, 0);
  border-radius: var(--chat--input--border-radius);
  padding: var(--chat--input--padding);
  min-height: var(--chat--textarea--height, 2.5rem);
  max-height: var(--chat--textarea--max-height);
  height: var(--chat--textarea--height, 2.5rem);
  resize: none;
  overflow-y: auto;
  background: var(--chat--input--background, white);
  color: var(--chat--input--text-color, initial);
  outline: none;
  line-height: var(--chat--input--line-height, 1.5);
}
.jig-n8n-chat .chat-inputs textarea[data-v-040531b3]::placeholder {
  font-size: var(--chat--input--placeholder--font-size, var(--chat--input--font-size));
}
.jig-n8n-chat .chat-inputs textarea[data-v-040531b3]:focus,
.jig-n8n-chat .chat-inputs textarea[data-v-040531b3]:hover {
  border-color: var(--chat--input--border-active, 0);
}
.jig-n8n-chat .chat-inputs-controls[data-v-040531b3] {
  display: flex;
}
.jig-n8n-chat .chat-input-send-button[data-v-040531b3],
.jig-n8n-chat .chat-input-file-button[data-v-040531b3] {
  height: var(--chat--textarea--height);
  width: var(--chat--textarea--height);
  background: var(--chat--input--send--button--background, white);
  cursor: pointer;
  color: var(--chat--input--send--button--color, var(--chat--color-secondary));
  border: 0;
  font-size: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: color var(--chat--transition-duration) ease;
}
.jig-n8n-chat .chat-input-send-button svg[data-v-040531b3],
.jig-n8n-chat .chat-input-file-button svg[data-v-040531b3] {
  min-width: fit-content;
}
.jig-n8n-chat .chat-input-send-button[disabled][data-v-040531b3],
.jig-n8n-chat .chat-input-file-button[disabled][data-v-040531b3] {
  cursor: no-drop;
  color: var(--chat--color-disabled);
}
.jig-n8n-chat .chat-input-send-button .chat-input-send-button[data-v-040531b3]:hover,
.jig-n8n-chat .chat-input-send-button .chat-input-send-button[data-v-040531b3]:focus,
.jig-n8n-chat .chat-input-file-button .chat-input-send-button[data-v-040531b3]:hover,
.jig-n8n-chat .chat-input-file-button .chat-input-send-button[data-v-040531b3]:focus {
  background: var(--chat--input--send--button--background-hover, var(--chat--input--send--button--background));
  color: var(--chat--input--send--button--color-hover);
}
.jig-n8n-chat .chat-input-file-button[data-v-040531b3] {
  background: var(--chat--input--file--button--background, white);
  color: var(--chat--input--file--button--color);
}
.jig-n8n-chat .chat-input-file-button[data-v-040531b3]:hover {
  background: var(--chat--input--file--button--background-hover);
  color: var(--chat--input--file--button--color-hover);
}
.jig-n8n-chat .chat-files[data-v-040531b3] {
  display: flex;
  overflow-x: hidden;
  overflow-y: auto;
  width: 100%;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: var(--chat--files-spacing);
}
.jig-n8n-chat .chat-input-left-panel[data-v-040531b3] {
  width: var(--chat--input--left--panel--width);
  margin-left: 0.4rem;
}
.jig-n8n-chat .chat-layout {
  width: 100%;
  height: 100%;
  display: flex;
  overflow-y: auto;
  flex-direction: column;
  font-family: var(--chat--font-family);
}
.jig-n8n-chat .chat-layout .chat-header {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1em;
  height: var(--chat--header-height);
  padding: var(--chat--header--padding);
  background: var(--chat--header--background);
  color: var(--chat--header--color);
  border-top: var(--chat--header--border-top);
  border-bottom: var(--chat--header--border-bottom);
  border-left: var(--chat--header--border-left);
  border-right: var(--chat--header--border-right);
}
.jig-n8n-chat .chat-layout .chat-header h1 {
  font-size: var(--chat--heading--font-size);
  color: var(--chat--header--color);
}
.jig-n8n-chat .chat-layout .chat-header p {
  font-size: var(--chat--subtitle--font-size);
  line-height: var(--chat--subtitle--line-height);
}
.jig-n8n-chat .chat-layout .chat-body {
  background: var(--chat--body--background);
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  position: relative;
  min-height: 100px;
}
.jig-n8n-chat .chat-layout .chat-footer {
  border-top: 1px solid var(--chat--color-light-shade-100);
  background: var(--chat--footer--background);
  color: var(--chat--footer--color);
}
.jig-n8n-chat ._strokeWidth_fqxq5_1 rect,
.jig-n8n-chat ._strokeWidth_fqxq5_1 path {
  stroke-width: var(--n8n-icon-stroke-width);
}
.jig-n8n-chat ._spin_fqxq5_6 {
  animation: _spin_fqxq5_6 1s linear infinite;
}
@keyframes _spin_fqxq5_6 {
  0% {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
.jig-n8n-chat .lds-ring {
  display: inline-block;
  position: relative;
  width: 48px;
  height: 48px;
}
.jig-n8n-chat .lds-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 48px;
  height: 48px;
  border: 4px solid var(--color-foreground-xlight);
  border-radius: 50%;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: var(--color-primary) transparent transparent transparent;
}
.jig-n8n-chat .lds-ring div:nth-child(1) {
  animation-delay: -0.45s;
}
.jig-n8n-chat .lds-ring div:nth-child(2) {
  animation-delay: -0.3s;
}
.jig-n8n-chat .lds-ring div:nth-child(3) {
  animation-delay: -0.15s;
}
@keyframes lds-ring {
  0% {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
.jig-n8n-chat .el-button {
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  border: var(--border-width-base) var(--button-border-color, var(--color-button-primary-border)) var(--border-style-base) !important;
  color: var(--button-font-color, var(--color-button-primary-font)) !important;
  background-color: var(--button-background-color, var(--color-button-primary-background)) !important;
  font-weight: var(--font-weight-medium) !important;
  border-radius: var(--button-border-radius, 4px) !important;
  padding: var(--button-padding-vertical, var(--spacing-xs)) var(--button-padding-horizontal, var(--spacing-m)) !important;
  font-size: var(--button-font-size, var(--font-size-s)) !important;
  -webkit-appearance: none;
  text-align: center;
  box-sizing: border-box;
  outline: none;
  margin: 0;
  transition: all 0.3s, padding 0s, width 0s, height 0s;
  gap: var(--spacing-3xs);
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  --button-padding-vertical: var(--spacing-2xs);
  --button-padding-horizontal: var(--spacing-xs);
  --button-font-size: var(--font-size-2xs) ;
}
.jig-n8n-chat .el-button a {
  color: var(--button-font-color, var(--color-button-primary-font)) !important;
}
.jig-n8n-chat .el-button:hover {
  color: var(--button-hover-font-color, var(--color-button-primary-font)) !important;
  border-color: var(--button-hover-border-color, var(--color-button-primary-hover-active-border)) !important;
  background-color: var(--button-hover-background-color, var(--color-button-primary-hover-active-focus-background)) !important;
}
.jig-n8n-chat .el-button:hover a {
  color: var(--button-hover-font-color, var(--color-button-primary-font)) !important;
}
.jig-n8n-chat .el-button:active,
.jig-n8n-chat .el-button.active {
  color: var(--button-active-font-color, var(--color-button-primary-font)) !important;
  border-color: var(--button-active-border-color, var(--color-button-primary-hover-active-border)) !important;
  background-color: var(--button-active-background-color, var(--color-button-primary-hover-active-focus-background)) !important;
  outline: none;
}
.jig-n8n-chat .el-button:active a,
.jig-n8n-chat .el-button.active a {
  color: var(--button-active-font-color, var(--color-button-primary-font)) !important;
}
.jig-n8n-chat .el-button:focus-visible:not(:active, .active) {
  color: var(--button-focus-font-color, var(--color-button-primary-font)) !important;
  border-color: var(--button-focus-border-color, var(--color-button-primary-border)) !important;
  background-color: var(--button-focus-background-color, var(--color-button-primary-hover-active-focus-background)) !important;
  outline: 3px solid var(--button-focus-outline-color, var(--color-button-primary-focus-outline)) !important;
}
.jig-n8n-chat .el-button:focus-visible:not(:active, .active) a {
  color: var(--button-focus-font-color, var(--color-button-primary-font)) !important;
}
.jig-n8n-chat .el-button.disabled,
.jig-n8n-chat .el-button.disabled:hover,
.jig-n8n-chat .el-button.disabled:active,
.jig-n8n-chat .el-button.disabled:focus-visible {
  color: var(--button-disabled-font-color, var(--color-button-primary-disabled-font));
  border-color: var(--button-disabled-border-color, var(--color-button-primary-disabled-border));
  background-color: var(--button-disabled-background-color, var(--color-button-primary-disabled-background));
}
.jig-n8n-chat .el-button.disabled a,
.jig-n8n-chat .el-button.disabled:hover a,
.jig-n8n-chat .el-button.disabled:active a,
.jig-n8n-chat .el-button.disabled:focus-visible a {
  color: var(--button-disabled-font-color, var(--color-button-primary-disabled-font));
}
.jig-n8n-chat .el-button .loading,
.jig-n8n-chat .el-button .loading:hover,
.jig-n8n-chat .el-button .loading:active,
.jig-n8n-chat .el-button .loading:focus-visible {
  color: var(--button-loading-font-color, var(--color-button-primary-font));
  border-color: var(--button-loading-border-color, var(--color-button-primary-border));
  background-color: var(--button-loading-background-color, var(--color-button-primary-background));
}
.jig-n8n-chat .el-button .loading a,
.jig-n8n-chat .el-button .loading:hover a,
.jig-n8n-chat .el-button .loading:active a,
.jig-n8n-chat .el-button .loading:focus-visible a {
  color: var(--button-loading-font-color, var(--color-button-primary-font));
}
.jig-n8n-chat .el-button::-moz-focus-inner {
  border: 0;
}
.jig-n8n-chat .el-button > i {
  display: none;
}
.jig-n8n-chat .el-button > span {
  display: flex;
  justify-content: center;
  align-items: center;
}
.jig-n8n-chat .el-button + .el-button {
  margin-left: var(--spacing-2xs);
}
.jig-n8n-chat .el-button.btn--cancel,
.jig-n8n-chat .el-button.el-color-dropdown__link-btn {
  --button-font-color: var(--color-button-secondary-font);
  --button-border-color: var(--color-button-secondary-border);
  --button-background-color: var(--color-button-secondary-background);
  --button-hover-font-color: var(--color-button-secondary-hover-active-focus-font);
  --button-hover-border-color: var(--color-button-secondary-hover-active-focus-border);
  --button-hover-background-color: var(--color-button-secondary-hover-background);
  --button-active-font-color: var(--color-button-secondary-hover-active-focus-font);
  --button-active-border-color: var(--color-button-secondary-hover-active-focus-border);
  --button-active-background-color: var(--color-button-secondary-active-focus-background);
  --button-focus-font-color: var(--color-button-secondary-hover-active-focus-font);
  --button-focus-border-color: var(--color-button-secondary-hover-active-focus-border);
  --button-focus-background-color: var(--color-button-secondary-active-focus-background);
  --button-focus-outline-color: var(--color-button-secondary-focus-outline);
  --button-disabled-font-color: var(--color-button-secondary-disabled-font);
  --button-disabled-border-color: var(--color-button-secondary-disabled-border);
  --button-disabled-background-color: var(--color-button-secondary-background);
  --button-loading-font-color: var(--color-button-secondary-loading-font);
  --button-loading-border-color: var(--color-button-secondary-loading-border);
  --button-loading-background-color: var(--color-button-secondary-loading-background) ;
}
.jig-n8n-chat ._button_slkfq_115 {
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  border: var(--border-width-base) var(--button-border-color, var(--color-button-primary-border)) var(--border-style-base);
  color: var(--button-font-color, var(--color-button-primary-font));
  background-color: var(--button-background-color, var(--color-button-primary-background));
  font-weight: var(--font-weight-medium);
  border-radius: var(--button-border-radius, 4px);
  padding: var(--button-padding-vertical, var(--spacing-xs)) var(--button-padding-horizontal, var(--spacing-m));
  font-size: var(--button-font-size, var(--font-size-s));
  -webkit-appearance: none;
  text-align: center;
  box-sizing: border-box;
  outline: none;
  margin: 0;
  transition: all 0.3s, padding 0s, width 0s, height 0s;
  gap: var(--spacing-3xs);
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}
.jig-n8n-chat ._button_slkfq_115 a {
  color: var(--button-font-color, var(--color-button-primary-font));
}
.jig-n8n-chat ._button_slkfq_115:hover {
  color: var(--button-hover-font-color, var(--color-button-primary-font));
  border-color: var(--button-hover-border-color, var(--color-button-primary-hover-active-border));
  background-color: var(--button-hover-background-color, var(--color-button-primary-hover-active-focus-background));
}
.jig-n8n-chat ._button_slkfq_115:hover a {
  color: var(--button-hover-font-color, var(--color-button-primary-font));
}
.jig-n8n-chat ._button_slkfq_115:active,
.jig-n8n-chat ._button_slkfq_115._active_slkfq_149 {
  color: var(--button-active-font-color, var(--color-button-primary-font));
  border-color: var(--button-active-border-color, var(--color-button-primary-hover-active-border));
  background-color: var(--button-active-background-color, var(--color-button-primary-hover-active-focus-background));
  outline: none;
}
.jig-n8n-chat ._button_slkfq_115:active a,
.jig-n8n-chat ._button_slkfq_115._active_slkfq_149 a {
  color: var(--button-active-font-color, var(--color-button-primary-font));
}
.jig-n8n-chat ._button_slkfq_115:focus-visible:not(:active, ._active_slkfq_149) {
  color: var(--button-focus-font-color, var(--color-button-primary-font));
  border-color: var(--button-focus-border-color, var(--color-button-primary-border));
  background-color: var(--button-focus-background-color, var(--color-button-primary-hover-active-focus-background));
  outline: 3px solid var(--button-focus-outline-color, var(--color-button-primary-focus-outline));
}
.jig-n8n-chat ._button_slkfq_115:focus-visible:not(:active, ._active_slkfq_149) a {
  color: var(--button-focus-font-color, var(--color-button-primary-font));
}
.jig-n8n-chat ._button_slkfq_115._disabled_slkfq_167,
.jig-n8n-chat ._button_slkfq_115._disabled_slkfq_167:hover,
.jig-n8n-chat ._button_slkfq_115._disabled_slkfq_167:active,
.jig-n8n-chat ._button_slkfq_115._disabled_slkfq_167:focus-visible {
  color: var(--button-disabled-font-color, var(--color-button-primary-disabled-font));
  border-color: var(--button-disabled-border-color, var(--color-button-primary-disabled-border));
  background-color: var(--button-disabled-background-color, var(--color-button-primary-disabled-background));
}
.jig-n8n-chat ._button_slkfq_115._disabled_slkfq_167 a,
.jig-n8n-chat ._button_slkfq_115._disabled_slkfq_167:hover a,
.jig-n8n-chat ._button_slkfq_115._disabled_slkfq_167:active a,
.jig-n8n-chat ._button_slkfq_115._disabled_slkfq_167:focus-visible a {
  color: var(--button-disabled-font-color, var(--color-button-primary-disabled-font));
}
.jig-n8n-chat ._button_slkfq_115 ._loading_slkfq_175,
.jig-n8n-chat ._button_slkfq_115 ._loading_slkfq_175:hover,
.jig-n8n-chat ._button_slkfq_115 ._loading_slkfq_175:active,
.jig-n8n-chat ._button_slkfq_115 ._loading_slkfq_175:focus-visible {
  color: var(--button-loading-font-color, var(--color-button-primary-font));
  border-color: var(--button-loading-border-color, var(--color-button-primary-border));
  background-color: var(--button-loading-background-color, var(--color-button-primary-background));
}
.jig-n8n-chat ._button_slkfq_115 ._loading_slkfq_175 a,
.jig-n8n-chat ._button_slkfq_115 ._loading_slkfq_175:hover a,
.jig-n8n-chat ._button_slkfq_115 ._loading_slkfq_175:active a,
.jig-n8n-chat ._button_slkfq_115 ._loading_slkfq_175:focus-visible a {
  color: var(--button-loading-font-color, var(--color-button-primary-font));
}
.jig-n8n-chat ._button_slkfq_115::-moz-focus-inner {
  border: 0;
}
.jig-n8n-chat ._button_slkfq_115 > i {
  display: none;
}
.jig-n8n-chat ._button_slkfq_115 > span {
  display: flex;
  justify-content: center;
  align-items: center;
}
.jig-n8n-chat ._secondary_slkfq_198 {
  --button-font-color: var(--color-button-secondary-font);
  --button-border-color: var(--color-button-secondary-border);
  --button-background-color: var(--color-button-secondary-background);
  --button-hover-font-color: var(--color-button-secondary-hover-active-focus-font);
  --button-hover-border-color: var(--color-button-secondary-hover-active-focus-border);
  --button-hover-background-color: var(--color-button-secondary-hover-background);
  --button-active-font-color: var(--color-button-secondary-hover-active-focus-font);
  --button-active-border-color: var(--color-button-secondary-hover-active-focus-border);
  --button-active-background-color: var(--color-button-secondary-active-focus-background);
  --button-focus-font-color: var(--color-button-secondary-hover-active-focus-font);
  --button-focus-border-color: var(--color-button-secondary-hover-active-focus-border);
  --button-focus-background-color: var(--color-button-secondary-active-focus-background);
  --button-focus-outline-color: var(--color-button-secondary-focus-outline);
  --button-disabled-font-color: var(--color-button-secondary-disabled-font);
  --button-disabled-border-color: var(--color-button-secondary-disabled-border);
  --button-disabled-background-color: var(--color-button-secondary-background);
  --button-loading-font-color: var(--color-button-secondary-loading-font);
  --button-loading-border-color: var(--color-button-secondary-loading-border);
  --button-loading-background-color: var(--color-button-secondary-loading-background) ;
}
.jig-n8n-chat ._highlight_slkfq_220 {
  --button-font-color: var(--color-button-highlight-font);
  --button-border-color: var(--color-button-highlight-border);
  --button-background-color: var(--color-button-highlight-background);
  --button-hover-font-color: var(--color-button-highlight-hover-active-focus-font);
  --button-hover-border-color: var(--color-button-highlight-hover-active-focus-border);
  --button-hover-background-color: var(--color-button-highlight-hover-background);
  --button-active-font-color: var(--color-button-highlight-hover-active-focus-font);
  --button-active-border-color: var(--color-button-highlight-hover-active-focus-border);
  --button-active-background-color: var(--color-button-highlight-active-focus-background);
  --button-focus-font-color: var(--color-button-highlight-hover-active-focus-font);
  --button-focus-border-color: var(--color-button-highlight-hover-active-focus-border);
  --button-focus-background-color: var(--color-button-highlight-active-focus-background);
  --button-focus-outline-color: var(--color-button-highlight-focus-outline);
  --button-disabled-font-color: var(--color-button-highlight-disabled-font);
  --button-disabled-border-color: var(--color-button-highlight-disabled-border);
  --button-disabled-background-color: var(--color-button-highlight-disabled-background);
  --button-loading-font-color: var(--color-button-highlight-loading-font);
  --button-loading-border-color: var(--color-button-highlight-loading-border);
  --button-loading-background-color: var(--color-button-highlight-loading-background) ;
}
.jig-n8n-chat ._tertiary_slkfq_242 {
  --button-font-color: var(--color-button-secondary-font);
  --button-border-color: var(--color-button-secondary-border);
  --button-background-color: var(--color-button-secondary-background);
  --button-hover-font-color: var(--color-button-secondary-hover-active-focus-font);
  --button-hover-border-color: var(--color-button-secondary-hover-active-focus-border);
  --button-hover-background-color: var(--color-button-secondary-hover-background);
  --button-active-font-color: var(--color-button-secondary-hover-active-focus-font);
  --button-active-border-color: var(--color-button-secondary-hover-active-focus-border);
  --button-active-background-color: var(--color-button-secondary-active-focus-background);
  --button-focus-font-color: var(--color-button-secondary-hover-active-focus-font);
  --button-focus-border-color: var(--color-button-secondary-hover-active-focus-border);
  --button-focus-background-color: var(--color-button-secondary-active-focus-background);
  --button-focus-outline-color: var(--color-button-secondary-focus-outline);
  --button-disabled-font-color: var(--color-button-secondary-disabled-font);
  --button-disabled-border-color: var(--color-button-secondary-disabled-border);
  --button-disabled-background-color: var(--color-button-secondary-background);
  --button-loading-font-color: var(--color-button-secondary-loading-font);
  --button-loading-border-color: var(--color-button-secondary-loading-border);
  --button-loading-background-color: var(--color-button-secondary-loading-background) ;
}
.jig-n8n-chat ._success_slkfq_264 {
  --button-font-color: var(--color-button-success-font);
  --button-border-color: var(--color-success);
  --button-background-color: var(--color-success);
  --button-hover-font-color: var(--color-button-success-font);
  --button-hover-border-color: var(--color-success-shade-1);
  --button-hover-background-color: var(--color-success-shade-1);
  --button-active-font-color: var(--color-button-success-font);
  --button-active-border-color: var(--color-success-shade-1);
  --button-active-background-color: var(--color-success-shade-1);
  --button-focus-font-color: var(--color-button-success-font);
  --button-focus-border-color: var(--color-success);
  --button-focus-background-color: var(--color-success);
  --button-focus-outline-color: var(--color-success-light);
  --button-disabled-font-color: var(--color-button-success-disabled-font);
  --button-disabled-border-color: var(--color-success-tint-1);
  --button-disabled-background-color: var(--color-success-tint-1);
  --button-loading-font-color: var(--color-button-success-font);
  --button-loading-border-color: var(--color-success);
  --button-loading-background-color: var(--color-success) ;
}
.jig-n8n-chat ._warning_slkfq_286 {
  --button-font-color: var(--color-button-warning-font);
  --button-border-color: var(--color-warning);
  --button-background-color: var(--color-warning);
  --button-hover-font-color: var(--color-button-warning-font);
  --button-hover-border-color: var(--color-warning-shade-1);
  --button-hover-background-color: var(--color-warning-shade-1);
  --button-active-font-color: var(--color-button-warning-font);
  --button-active-border-color: var(--color-warning-shade-1);
  --button-active-background-color: var(--color-warning-shade-1);
  --button-focus-font-color: var(--color-button-warning-font);
  --button-focus-border-color: var(--color-warning);
  --button-focus-background-color: var(--color-warning);
  --button-focus-outline-color: var(--color-warning-tint-1);
  --button-disabled-font-color: var(--color-button-warning-disabled-font);
  --button-disabled-border-color: var(--color-warning-tint-1);
  --button-disabled-background-color: var(--color-warning-tint-1);
  --button-loading-font-color: var(--color-button-warning-font);
  --button-loading-border-color: var(--color-warning);
  --button-loading-background-color: var(--color-warning) ;
}
.jig-n8n-chat ._danger_slkfq_308 {
  --button-font-color: var(--color-button-danger-font);
  --button-border-color: var(--color-button-danger-border);
  --button-background-color: var(--color-danger);
  --button-hover-font-color: var(--color-button-danger-font);
  --button-hover-border-color: var(--color-danger-shade-1);
  --button-hover-background-color: var(--color-danger-shade-1);
  --button-active-font-color: var(--color-button-danger-font);
  --button-active-border-color: var(--color-danger-shade-1);
  --button-active-background-color: var(--color-danger-shade-1);
  --button-focus-font-color: var(--color-button-danger-font);
  --button-focus-border-color: var(--color-danger);
  --button-focus-background-color: var(--color-danger);
  --button-focus-outline-color: var(--color-button-danger-focus-outline);
  --button-disabled-font-color: var(--color-button-danger-disabled-font);
  --button-disabled-border-color: var(--color-button-danger-disabled-border);
  --button-disabled-background-color: var(--color-button-danger-disabled-background);
  --button-loading-font-color: var(--color-button-danger-font);
  --button-loading-border-color: var(--color-danger);
  --button-loading-background-color: var(--color-danger) ;
}
.jig-n8n-chat ._xmini_slkfq_333 {
  --button-padding-vertical: var(--spacing-4xs);
  --button-padding-horizontal: var(--spacing-3xs);
  --button-font-size: var(--font-size-3xs) ;
}
.jig-n8n-chat ._xmini_slkfq_333._square_slkfq_338 {
  height: 22px;
  width: 22px;
}
.jig-n8n-chat ._mini_slkfq_343 {
  --button-padding-vertical: var(--spacing-4xs);
  --button-padding-horizontal: var(--spacing-2xs);
  --button-font-size: var(--font-size-2xs) ;
}
.jig-n8n-chat ._mini_slkfq_343._square_slkfq_338 {
  height: 22px;
  width: 22px;
}
.jig-n8n-chat ._small_slkfq_353 {
  --button-padding-vertical: var(--spacing-3xs);
  --button-padding-horizontal: var(--spacing-xs);
  --button-font-size: var(--font-size-2xs) ;
}
.jig-n8n-chat ._small_slkfq_353._square_slkfq_338 {
  height: 26px;
  width: 26px;
}
.jig-n8n-chat ._medium_slkfq_363 {
  --button-padding-vertical: var(--spacing-2xs);
  --button-padding-horizontal: var(--spacing-xs);
  --button-font-size: var(--font-size-2xs) ;
}
.jig-n8n-chat ._medium_slkfq_363._square_slkfq_338 {
  height: 30px;
  width: 30px;
}
.jig-n8n-chat ._large_slkfq_373._square_slkfq_338 {
  height: 42px;
  width: 42px;
}
.jig-n8n-chat ._xlarge_slkfq_378 {
  --button-padding-vertical: var(--spacing-xs);
  --button-padding-horizontal: var(--spacing-s);
  --button-font-size: var(--font-size-m) ;
}
.jig-n8n-chat ._xlarge_slkfq_378._square_slkfq_338 {
  height: 46px;
  width: 46px;
}
.jig-n8n-chat ._outline_slkfq_391 {
  --button-background-color: transparent;
  --button-disabled-background-color: transparent ;
}
.jig-n8n-chat ._outline_slkfq_391._primary_slkfq_395 {
  --button-font-color: var(--color-primary);
  --button-disabled-font-color: var(--color-primary-tint-1);
  --button-disabled-border-color: var(--color-primary-tint-1);
  --button-disabled-background-color: transparent ;
}
.jig-n8n-chat ._outline_slkfq_391._success_slkfq_264 {
  --button-font-color: var(--color-success);
  --button-border-color: var(--color-success);
  --button-hover-border-color: var(--color-success);
  --button-hover-background-color: var(--color-success);
  --button-active-background-color: var(--color-success);
  --button-disabled-font-color: var(--color-success-light);
  --button-disabled-border-color: var(--color-success-light);
  --button-disabled-background-color: transparent ;
}
.jig-n8n-chat ._outline_slkfq_391._warning_slkfq_286 {
  --button-font-color: var(--color-warning);
  --button-border-color: var(--color-warning);
  --button-hover-border-color: var(--color-warning);
  --button-hover-background-color: var(--color-warning);
  --button-active-background-color: var(--color-warning);
  --button-disabled-font-color: var(--color-warning-tint-1);
  --button-disabled-border-color: var(--color-warning-tint-1);
  --button-disabled-background-color: transparent ;
}
.jig-n8n-chat ._outline_slkfq_391._danger_slkfq_308 {
  --button-font-color: var(--color-danger);
  --button-border-color: var(--color-danger);
  --button-hover-border-color: var(--color-danger);
  --button-hover-background-color: var(--color-danger);
  --button-active-background-color: var(--color-danger);
  --button-disabled-font-color: var(--color-danger-tint-1);
  --button-disabled-border-color: var(--color-danger-tint-1);
  --button-disabled-background-color: transparent ;
}
.jig-n8n-chat ._text_slkfq_432 {
  --button-font-color: var(--color-text-button-secondary-font);
  --button-border-color: transparent;
  --button-background-color: transparent;
  --button-hover-border-color: transparent;
  --button-hover-background-color: transparent;
  --button-active-border-color: transparent;
  --button-active-background-color: transparent;
  --button-focus-border-color: transparent;
  --button-focus-background-color: transparent;
  --button-disabled-border-color: transparent;
  --button-disabled-background-color: transparent ;
}
.jig-n8n-chat ._text_slkfq_432:focus {
  outline: 0;
}
.jig-n8n-chat ._text_slkfq_432._primary_slkfq_395 {
  --button-font-color: var(--color-primary);
  --button-hover-font-color: var(--color-primary-shade-1);
  --button-active-font-color: var(--color-primary-shade-1);
  --button-focus-font-color: var(--color-primary);
  --button-disabled-font-color: var(--color-primary-tint-1) ;
}
.jig-n8n-chat ._text_slkfq_432._success_slkfq_264 {
  --button-font-color: var(--color-success);
  --button-hover-font-color: var(--color-success-shade-1);
  --button-active-font-color: var(--color-success-shade-1);
  --button-focus-font-color: var(--color-success);
  --button-disabled-font-color: var(--color-success-light) ;
}
.jig-n8n-chat ._text_slkfq_432._warning_slkfq_286 {
  --button-font-color: var(--color-warning);
  --button-hover-font-color: var(--color-warning-shade-1);
  --button-active-font-color: var(--color-warning-shade-1);
  --button-focus-font-color: var(--color-warning);
  --button-disabled-font-color: var(--color-warning-tint-1) ;
}
.jig-n8n-chat ._text_slkfq_432._danger_slkfq_308 {
  --button-font-color: var(--color-danger);
  --button-hover-font-color: var(--color-danger-shade-1);
  --button-active-font-color: var(--color-danger-shade-1);
  --button-focus-font-color: var(--color-danger);
  --button-disabled-font-color: var(--color-danger-tint-1) ;
}
.jig-n8n-chat ._text_slkfq_432:hover {
  text-decoration: underline;
}
.jig-n8n-chat ._loading_slkfq_175 {
  position: relative;
  pointer-events: none;
}
.jig-n8n-chat ._loading_slkfq_175:before {
  pointer-events: none;
  content: "";
  position: absolute;
  left: -1px;
  top: -1px;
  right: -1px;
  bottom: -1px;
  border-radius: inherit;
}
.jig-n8n-chat ._disabled_slkfq_167,
.jig-n8n-chat ._disabled_slkfq_167:hover,
.jig-n8n-chat ._disabled_slkfq_167:active,
.jig-n8n-chat ._disabled_slkfq_167:focus {
  cursor: not-allowed;
  background-image: none;
}
.jig-n8n-chat ._transparent_slkfq_500 {
  --button-background-color: transparent;
  --button-active-background-color: transparent ;
}
.jig-n8n-chat ._withIcon_slkfq_505,
.jig-n8n-chat ._icon_slkfq_511 {
  display: inline-flex;
  justify-content: center;
  align-items: center;
}
.jig-n8n-chat ._icon_slkfq_511 svg {
  display: block;
}
.jig-n8n-chat ._block_slkfq_520 {
  width: 100%;
}
.jig-n8n-chat ._float-left_slkfq_524 {
  float: left;
}
.jig-n8n-chat ._float-right_slkfq_528 {
  float: right;
}
.jig-n8n-chat ._bold_ushv1_1 {
  font-weight: var(--font-weight-medium);
}
.jig-n8n-chat ._regular_ushv1_5 {
  font-weight: var(--font-weight-regular);
}
.jig-n8n-chat ._size-xlarge_ushv1_9 {
  font-size: var(--font-size-xl);
  line-height: var(--font-line-height-xloose);
}
.jig-n8n-chat ._size-large_ushv1_14 {
  font-size: var(--font-size-m);
  line-height: var(--font-line-height-xloose);
}
.jig-n8n-chat ._size-medium_ushv1_19 {
  font-size: var(--font-size-s);
  line-height: var(--font-line-height-loose);
}
.jig-n8n-chat ._size-small_ushv1_24 {
  font-size: var(--font-size-2xs);
  line-height: var(--font-line-height-loose);
}
.jig-n8n-chat ._size-xsmall_ushv1_29 {
  font-size: var(--font-size-3xs);
  line-height: var(--font-line-height-compact);
}
.jig-n8n-chat ._compact_ushv1_34 {
  line-height: 1;
}
.jig-n8n-chat ._primary_ushv1_38 {
  color: var(--color-primary);
}
.jig-n8n-chat ._secondary_ushv1_42 {
  color: var(--color-secondary);
}
.jig-n8n-chat ._text-dark_ushv1_46 {
  color: var(--color-text-dark);
}
.jig-n8n-chat ._text-base_ushv1_50 {
  color: var(--color-text-base);
}
.jig-n8n-chat ._text-light_ushv1_54 {
  color: var(--color-text-light);
}
.jig-n8n-chat ._text-xlight_ushv1_58 {
  color: var(--color-text-xlight);
}
.jig-n8n-chat ._danger_ushv1_62 {
  color: var(--color-text-danger);
}
.jig-n8n-chat ._success_ushv1_66 {
  color: var(--color-success);
}
.jig-n8n-chat ._warning_ushv1_70 {
  color: var(--color-warning);
}
.jig-n8n-chat ._foreground-dark_ushv1_74 {
  color: var(--color-foreground-dark);
}
.jig-n8n-chat ._foreground-xdark_ushv1_78 {
  color: var(--color-foreground-xdark);
}
.jig-n8n-chat ._align-left_ushv1_82 {
  text-align: left;
}
.jig-n8n-chat ._align-right_ushv1_86 {
  text-align: right;
}
.jig-n8n-chat ._align-center_ushv1_90 {
  text-align: center;
}
.jig-n8n-chat ._xlarge_ddtui_1 {
  --input-font-size: var(--font-size-m) ;
}
.jig-n8n-chat ._xlarge_ddtui_1 input {
  height: 48px;
}
.jig-n8n-chat .blinking-cursor {
  display: inline-block;
  height: var(--font-size-m);
  width: var(--spacing-3xs);
  border-radius: var(--border-radius-small);
  margin-left: var(--spacing-4xs);
  animation: 1s blink step-end infinite;
}
@keyframes blink {
  0%, to {
    background-color: transparent;
  }
  50% {
    background-color: var(--color-foreground-xdark);
  }
}
.jig-n8n-chat .n8n-loading-custom.el-skeleton,
.jig-n8n-chat .n8n-loading-custom.el-skeleton .el-skeleton__item {
  width: 100%;
  height: 100%;
}
.jig-n8n-chat .recycle-scroller-wrapper {
  height: 100%;
  width: 100%;
  overflow: auto;
  flex: 1 1 auto;
}
.jig-n8n-chat .recycle-scroller {
  width: 100%;
  display: block;
  position: relative;
}
.jig-n8n-chat .recycle-scroller-items-wrapper {
  position: absolute;
  width: 100%;
}
.jig-n8n-chat .recycle-scroller-item {
  display: flex;
  position: relative;
  width: 100%;
}
.jig-n8n-chat .sticky-textarea {
  height: calc(100% - var(--spacing-l));
  padding: var(--spacing-2xs) var(--spacing-2xs) 0 var(--spacing-2xs);
  cursor: default;
}
.jig-n8n-chat .sticky-textarea .el-textarea {
  height: 100%;
}
.jig-n8n-chat .sticky-textarea .el-textarea .el-textarea__inner {
  height: 100%;
  resize: unset;
}
.jig-n8n-chat .full-height {
  height: calc(100% - var(--spacing-2xs));
}
.jig-n8n-chat ul.user-stack-list {
  border: none;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-s);
  padding-bottom: var(--spacing-2xs);
}
.jig-n8n-chat ul.user-stack-list .el-dropdown-menu__item {
  line-height: var(--font-line-height-regular);
}
.jig-n8n-chat ul.user-stack-list li:hover {
  color: currentColor !important;
}
.jig-n8n-chat .user-stack-popper {
  border: 1px solid var(--border-color-light);
  border-radius: var(--border-radius-base);
  padding: var(--spacing-5xs) 0;
  box-shadow: 0 2px 8px rgba(68, 28, 23, 0.1019607843);
  background-color: var(--color-background-xlight);
}
.jig-n8n-chat .command-bar-enter-active {
  transition: opacity 0.2s ease-out, transform 0.2s ease-out;
}
.jig-n8n-chat .command-bar-leave-active {
  transition: opacity 0.15s ease-in, transform 0.15s ease-in;
}
.jig-n8n-chat .command-bar-enter-from {
  opacity: 0;
  transform: translate(-50%) translateY(-20px) scale(0.95);
}
.jig-n8n-chat .command-bar-leave-to {
  opacity: 0;
  transform: translate(-50%) translateY(-10px) scale(0.98);
}
.jig-n8n-chat .command-bar-enter-to,
.jig-n8n-chat .command-bar-leave-from {
  opacity: 1;
  transform: translate(-50%) translateY(0) scale(1);
}
.jig-n8n-chat .chat-message {
  display: block;
  position: relative;
  max-width: fit-content;
  font-size: var(--chat--message--font-size);
  padding: var(--chat--message--padding);
  border-radius: var(--chat--message--border-radius);
  scroll-margin: 3rem;
}
.jig-n8n-chat .chat-message .chat-message-actions {
  position: absolute;
  bottom: calc(100% - 0.5rem);
  left: 0;
  opacity: 0;
  transform: translateY(-0.25rem);
  display: flex;
  gap: 1rem;
}
.jig-n8n-chat .chat-message.chat-message-from-user .chat-message-actions {
  left: auto;
  right: 0;
}
.jig-n8n-chat .chat-message:hover .chat-message-actions {
  opacity: 1;
}
.jig-n8n-chat .chat-message p {
  line-height: var(--chat--message-line-height);
  word-wrap: break-word;
}
.jig-n8n-chat .chat-message + .chat-message {
  margin-top: var(--chat--message--margin-bottom);
}
.jig-n8n-chat .chat-message.chat-message-from-user + .chat-message.chat-message-from-bot,
.jig-n8n-chat .chat-message.chat-message-from-bot + .chat-message.chat-message-from-user {
  margin-top: var(--chat--spacing);
}
.jig-n8n-chat .chat-message.chat-message-from-bot {
  color: var(--chat--message--bot--color);
  border-bottom-left-radius: 0;
}
.jig-n8n-chat .chat-message.chat-message-from-bot:not(.chat-message-transparent) {
  background-color: var(--chat--message--bot--background);
  border: var(--chat--message--bot--border);
}
.jig-n8n-chat .chat-message.chat-message-from-user {
  color: var(--chat--message--user--color);
  margin-left: auto;
  border-bottom-right-radius: 0;
}
.jig-n8n-chat .chat-message.chat-message-from-user:not(.chat-message-transparent) {
  background-color: var(--chat--message--user--background);
  border: var(--chat--message--user--border);
}
.jig-n8n-chat .chat-message > .chat-message-markdown {
  display: block;
  box-sizing: border-box;
  font-size: inherit;
}
.jig-n8n-chat .chat-message > .chat-message-markdown > *:first-child {
  margin-top: 0;
}
.jig-n8n-chat .chat-message > .chat-message-markdown > *:last-child {
  margin-bottom: 0;
}
.jig-n8n-chat .chat-message > .chat-message-markdown pre {
  font-family: inherit;
  font-size: inherit;
  margin: 0;
  white-space: pre-wrap;
  box-sizing: border-box;
  padding: var(--chat--spacing);
  background: var(--chat--message--pre--background);
  border-radius: var(--chat--border-radius);
}
.jig-n8n-chat .chat-message .chat-message-files {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  padding-top: 0.5rem;
}
.jig-n8n-chat .chat-window-wrapper {
  position: fixed;
  display: flex;
  flex-direction: column;
  bottom: var(--chat--window--bottom);
  right: var(--chat--window--right);
  z-index: var(--chat--window--z-index);
  max-width: calc(100% - var(--chat--window--right, var(--chat--spacing)) * 2);
  max-height: calc(100% - var(--chat--window--bottom, var(--chat--spacing)) * 2);
}
.jig-n8n-chat .chat-window-wrapper .chat-window {
  display: flex;
  width: var(--chat--window--width);
  height: var(--chat--window--height);
  max-width: 100%;
  max-height: 100%;
  border: var(--chat--window--border, 1px solid var(--chat--color-light-shade-100));
  border-radius: var(--chat--window--border-radius, var(--chat--border-radius));
  margin-bottom: var(--chat--window--margin-bottom, var(--chat--spacing));
  overflow: hidden;
  transform-origin: bottom right;
}
.jig-n8n-chat .chat-window-wrapper .chat-window .chat-layout {
  width: auto;
  height: auto;
  flex: 1;
}
.jig-n8n-chat .chat-window-wrapper .chat-window-toggle {
  flex: 0 0 auto;
  background: var(--chat--toggle--background);
  color: var(--chat--toggle--color);
  cursor: pointer;
  width: var(--chat--toggle--width);
  height: var(--chat--toggle--height);
  border-radius: var(--chat--toggle--border-radius, 50%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
  transition: transform var(--chat--transition-duration) ease, background var(--chat--transition-duration) ease;
}
.jig-n8n-chat .chat-window-wrapper .chat-window-toggle:hover,
.jig-n8n-chat .chat-window-wrapper .chat-window-toggle:focus {
  transform: scale(1.05);
  background: var(--chat--toggle--hover--background);
}
.jig-n8n-chat .chat-window-wrapper .chat-window-toggle:active {
  transform: scale(0.95);
  background: var(--chat--toggle--active--background);
}
.jig-n8n-chat .chat-window-transition-enter-active,
.jig-n8n-chat .chat-window-transition-leave-active {
  transition: transform var(--chat--transition-duration) ease, opacity var(--chat--transition-duration) ease;
}
.jig-n8n-chat .chat-window-transition-enter-from,
.jig-n8n-chat .chat-window-transition-leave-to {
  transform: scale(0);
  opacity: 0;
}
.jig-n8n-chat .chat-window-toggle-transition-enter-active,
.jig-n8n-chat .chat-window-toggle-transition-leave-active {
  transition: opacity var(--chat--transition-duration) ease;
}
.jig-n8n-chat .chat-window-toggle-transition-enter-from,
.jig-n8n-chat .chat-window-toggle-transition-leave-to {
  opacity: 0;
}
.jig-n8n-chat .chat-message-typing {
  max-width: 80px;
}
.jig-n8n-chat .chat-message-typing.chat-message-typing-animation-scaling .chat-message-typing-circle {
  animation: chat-message-typing-animation-scaling 0.8s ease-in-out infinite;
  animation-delay: 3.6s;
}
.jig-n8n-chat .chat-message-typing.chat-message-typing-animation-bouncing .chat-message-typing-circle {
  animation: chat-message-typing-animation-bouncing 0.8s ease-in-out infinite;
  animation-delay: 3.6s;
}
.jig-n8n-chat .chat-message-typing .chat-message-typing-body {
  display: flex;
  justify-content: center;
  align-items: center;
}
.jig-n8n-chat .chat-message-typing .chat-message-typing-circle {
  display: block;
  height: 10px;
  width: 10px;
  border-radius: 50%;
  background-color: var(--chat--color-typing);
  margin: 3px;
}
.jig-n8n-chat .chat-message-typing .chat-message-typing-circle:nth-child(1) {
  animation-delay: 0ms;
}
.jig-n8n-chat .chat-message-typing .chat-message-typing-circle:nth-child(2) {
  animation-delay: 333ms;
}
.jig-n8n-chat .chat-message-typing .chat-message-typing-circle:nth-child(3) {
  animation-delay: 666ms;
}
@keyframes chat-message-typing-animation-scaling {
  0% {
    transform: scale(1);
  }
  33% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.4);
  }
  to {
    transform: scale(1);
  }
}
@keyframes chat-message-typing-animation-bouncing {
  0% {
    transform: translateY(0);
  }
  33% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
  to {
    transform: translateY(0);
  }
}
.jig-n8n-chat .chat-messages-list {
  margin-top: auto;
  display: block;
  padding: var(--chat--messages-list--padding);
}
.jig-n8n-chat .empty-container {
  container-type: size;
  display: flex;
  align-items: center;
  justify-content: center;
}
.jig-n8n-chat .empty-container p {
  max-width: 16em;
  margin: 0;
}
.jig-n8n-chat .empty {
  text-align: center;
  color: var(--color-text-base);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);
  padding-inline: var(--spacing-m);
  padding-bottom: var(--spacing-l);
  overflow: hidden;
}
.jig-n8n-chat .emptyIcon {
  zoom: 2.5;
  color: var(--color-button-secondary-border);
}
@container (height < 150px) {
  .jig-n8n-chat .empty {
    flex-direction: row;
    text-align: left;
  }
  .jig-n8n-chat .emptyIcon {
    zoom: 1.5;
  }
}
.jig-n8n-chat .chat-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.jig-n8n-chat .chat-close-button {
  display: flex;
  border: none;
  background: none;
  cursor: pointer;
}
.jig-n8n-chat .chat-close-button:hover {
  color: var(--chat--close--button--color-hover, var(--chat--color-primary));
}

/*# sourceMappingURL=jig-n8n-style.css.map */
`;

    // ============================================================
    // N8N CHAT CDN URL
    // ============================================================
    const N8N_CHAT_CDN_URL = 'https://cdn.jsdelivr.net/npm/@n8n/chat@0.60.0/dist/chat.bundle.es.js';

    // ============================================================
    // FUNCTIONS
    // ============================================================

    // Function to clear n8n's session and start fresh
    function clearN8nSession() {
        localStorage.removeItem(n8nSessionKey);
        console.log('Cleared n8n chat session');
    }

    // Add custom CSS to isolate n8n chat from Workamajig styles
    const style = document.createElement('style');
    style.textContent = CHAT_WRAPPER_STYLES;
    document.head.appendChild(style);

    // Create a simple chat container and add it to the page
    function initChat() {
        // Create chat toggle button (outside shadow DOM) with gradient and glow
        const chatToggleBtn = document.createElement("button");
        chatToggleBtn.className = "chat-toggle-btn";
        chatToggleBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="30" height="30">
                <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z"/>
            </svg>
        `;
        chatToggleBtn.style.position = "fixed";
        chatToggleBtn.style.bottom = "24px";
        chatToggleBtn.style.right = "24px";
        chatToggleBtn.style.width = "68px";
        chatToggleBtn.style.height = "68px";
        chatToggleBtn.style.borderRadius = "50%";
        chatToggleBtn.style.background = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
        chatToggleBtn.style.border = "none";
        chatToggleBtn.style.cursor = "pointer";
        chatToggleBtn.style.boxShadow = "0 8px 24px rgba(102, 126, 234, 0.4), 0 4px 12px rgba(0, 0, 0, 0.1)";
        chatToggleBtn.style.zIndex = "10002";
        chatToggleBtn.style.display = "flex";
        chatToggleBtn.style.alignItems = "center";
        chatToggleBtn.style.justifyContent = "center";
        chatToggleBtn.style.transition = "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
        chatToggleBtn.style.overflow = "hidden";
        chatToggleBtn.title = "Open Chat";

        // Add pulse animation
        chatToggleBtn.style.animation = "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite";
        const pulseKeyframes = document.createElement("style");
        pulseKeyframes.textContent = PULSE_ANIMATION_STYLES;
        document.head.appendChild(pulseKeyframes);

        // Enhanced hover effect with scale and glow
        chatToggleBtn.onmouseenter = () => {
            chatToggleBtn.style.transform = "scale(1.08) rotate(-5deg)";
            chatToggleBtn.style.boxShadow = "0 12px 32px rgba(102, 126, 234, 0.5), 0 6px 16px rgba(0, 0, 0, 0.15)";
            chatToggleBtn.style.animation = "none";
        };
        chatToggleBtn.onmouseleave = () => {
            chatToggleBtn.style.transform = "scale(1) rotate(0deg)";
            chatToggleBtn.style.boxShadow = "0 8px 24px rgba(102, 126, 234, 0.4), 0 4px 12px rgba(0, 0, 0, 0.1)";
            chatToggleBtn.style.animation = "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite";
        };

        // Create a host element for the shadow DOM
        const shadowHost = document.createElement("div");
        shadowHost.className = "n8n-chat-wrapper jig-n8n-chat";
        shadowHost.style.display = "none"; // Hidden by default

        // Attach shadow DOM
        const shadowRoot = shadowHost.attachShadow({ mode: 'open' });

        // Add all styles to the shadow DOM
        const shadowStyle = document.createElement('style');
        shadowStyle.textContent = JIG_N8N_STYLE + '\n\n' + SHADOW_DOM_STYLES + '\n\n' + SLIDE_OUT_ANIMATION_STYLES;
        shadowRoot.appendChild(shadowStyle);

        // Create a wrapper div with the namespace class INSIDE shadow DOM
        const shadowWrapper = document.createElement("div");
        shadowWrapper.className = "jig-n8n-chat";
        shadowRoot.appendChild(shadowWrapper);

        // Create header buttons container
        const headerButtons = document.createElement("div");
        headerButtons.className = "header-buttons";

        // New Session button (inside shadow DOM)
        const newSessionBtn = document.createElement("button");
        newSessionBtn.className = "new-session-btn";
        newSessionBtn.innerHTML = "New Session";
        newSessionBtn.title = "Start a new chat session";
        headerButtons.appendChild(newSessionBtn);

        // Close button (inside shadow DOM)
        const closeBtn = document.createElement("button");
        closeBtn.className = "close-chat-btn";
        closeBtn.innerHTML = "✕";
        closeBtn.title = "Close chat";
        headerButtons.appendChild(closeBtn);

        shadowWrapper.appendChild(headerButtons);

        // Create a container div for the n8n chat inside the shadow DOM
        const chatContainer = document.createElement("div");
        chatContainer.id = "n8n-chat";
        shadowWrapper.appendChild(chatContainer);

        let chatInstance = null;
        let hasScrolledToBottom = false; // Track if we've scrolled on first open

        // Function to scroll chat to bottom
        function scrollChatToBottom() {
            const messagesList = shadowRoot.querySelector('[class*="chat-messages-list"]');
            if (messagesList && messagesList.scrollHeight > 0) {
                messagesList.scrollTo({ top: messagesList.scrollHeight, behavior: 'smooth' });
                return true;
            }
            return false;
        }

        // Function to scroll to bottom on first open (with retry logic)
        function setupFirstScrollObserver() {
            if (hasScrolledToBottom) return;

            let attempts = 0;
            const maxAttempts = 20; // Try for 2 seconds max (20 * 100ms)

            const scrollInterval = setInterval(() => {
                attempts++;
                const messagesList = shadowRoot.querySelector('[class*="chat-messages-list"]');
                
                if (messagesList) {
                    const scrollHeight = messagesList.scrollHeight;
                    const clientHeight = messagesList.clientHeight;
                    const messages = shadowRoot.querySelectorAll('[class*="chat-message"]');
                    const scrollableContent = scrollHeight - clientHeight;
                    
                    // Wait until we have messages AND scrollable content (at least 50px to be safe)
                    if (messages.length > 0 && scrollableContent > 50) {
                        if (scrollChatToBottom()) {
                            hasScrolledToBottom = true;
                            clearInterval(scrollInterval);
                        }
                    }
                }

                // Stop after max attempts
                if (attempts >= maxAttempts) {
                    clearInterval(scrollInterval);
                }
            }, 100); // Check every 100ms
        }

        // Function to initialize/reinitialize chat using embedded bundle
        async function createChatInstance() {
            chatContainer.innerHTML = '';

            try {
                // Import from CDN
                const { createChat } = await import(N8N_CHAT_CDN_URL);

                chatInstance = createChat({
                    webhookUrl: webhookUrl,
                    target: shadowRoot.querySelector('#n8n-chat'),
                    mode: 'fullscreen',
                    loadPreviousSession: true,
                    allowFileUploads: true,
                    showWelcomeScreen: false,
                    allowedFilesMimeTypes: 'image/*,text/plain,application/pdf',
                    initialMessages: [
                        'Hey there! 👋',
                        'I\'m Jiggy, your Workamajig AI assistant. I can help you with projects, timesheets, tasks, and answer questions about the system. What can I help you with today?'
                    ],
                    i18n: {
                        en: {
                            title: '🤖 Jiggy',
                            subtitle: 'Your AI Assistant',
                            footer: '',
                            getStarted: '✨ Start New Chat',
                            inputPlaceholder: 'Ask me anything about Workamajig...',
                        },
                    }
                });

                console.log('Chat initialized');
            } catch (error) {
                console.error('Failed to load n8n chat SDK:', error);
            }
        }

        // Close button click handler
        closeBtn.addEventListener("click", () => {
            shadowHost.style.animation = "slideOutDown 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
            const slideOutKeyframes = document.createElement("style");
            slideOutKeyframes.textContent = SLIDE_OUT_ANIMATION_STYLES;
            shadowRoot.appendChild(slideOutKeyframes);

            setTimeout(() => {
                shadowHost.style.display = "none";
                shadowHost.style.animation = "";
                chatToggleBtn.style.display = "flex";
                chatToggleBtn.title = "Open Chat";
            }, 300);
        });

        // New Session button click handler
        newSessionBtn.addEventListener("click", () => {
            clearN8nSession();
            hasScrolledToBottom = false; // Reset scroll flag for new session
            createChatInstance();
        });

        // Toggle chat visibility with smooth animation
        chatToggleBtn.addEventListener("click", () => {
            const isOpen = shadowHost.style.display !== "none";
            if (isOpen) {
                closeBtn.click();
            } else {
                shadowHost.style.display = "block";
                chatToggleBtn.title = "Close Chat";

                // Only scroll to bottom on first open
                if (!hasScrolledToBottom) {
                    setupFirstScrollObserver();
                }
            }
        });

        // Add close functionality - clicking outside or ESC key
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && shadowHost.style.display !== "none") {
                shadowHost.style.display = "none";
                chatToggleBtn.style.display = "flex";
            }
        });

        // Add to page
        document.body.appendChild(chatToggleBtn);
        document.body.appendChild(shadowHost);

        // Initialize the chat (hidden, will show when user clicks toggle)
        setTimeout(() => {
            createChatInstance();
        }, 1000);
    }

    // Initialize when page loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initChat);
    } else {
        initChat();
    }
})();
