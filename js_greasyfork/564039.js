// ==UserScript==
// @author      daniel.z.tg
// @description Enables Stack Exchange Inc's own dark mode everywhere
// @grant       GM_addStyle
// @license     Unlicense
// @match       https://*.askubuntu.com/*
// @match       https://*.mathoverflow.net/*
// @match       https://*.serverfault.com/*
// @match       https://*.stackapps.com/*
// @match       https://*.stackexchange.com/*
// @match       https://*.stackoverflow.com/*
// @match       https://*.superuser.com/*
// @run-at      document-body
// @name        Stack Exchange global dark mode
// @namespace   https://github.com/danielzgtg
// @version     202601251134560001
// @downloadURL https://update.greasyfork.org/scripts/564039/Stack%20Exchange%20global%20dark%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/564039/Stack%20Exchange%20global%20dark%20mode.meta.js
// ==/UserScript==

/*
 * Inpsired by https://meta.stackexchange.com/a/407981/1373352
 * Features:
 * - Forcibly enables dark mode on all sites in the Stack Exchange network
 * - Unsets many site-specific customizations to recover legibility. A nice side effect is increased stylistic standardization
 * - Stably leaves legibile all SE sites I visit since mid-2025
 * - Works in Stack Exchange Chat too
 * - Cleans up remaining items like headers and footers to darken them
 * - Faster than Dark Reader and doesn't flash. Please disable it on these sites when using this userscript
 * - Hides cookie banners
 */

document.body.classList.add("theme-dark");

new MutationObserver(mutations => {
  for (const mutation of mutations) {
    mutation.addedNodes.forEach(node => node.classList?.remove("theme-light__forced"));
  }
}).observe(document.body, { childList: true });

GM_addStyle(`
/* Reset per-site customizations to the defaults that support dark mode */
body.unified-theme {
  --theme-background-color: var(--white);
  background-image: none;
  header * {
    --theme-header-foreground-color: var(--white);
  }
  footer {
    --theme-footer-background-color: var(--white);
    &, * {
      --theme-footer-text-color: var(--fc-dark);
      --theme-footer-link-color: var(--theme-link-color);
      --theme-footer-link-color-hover: var(--theme-link-color-hover);
    }
  }
  div.s-post-summary, a/*.question-hyperlink*/, a code {
    --theme-link-color: var(--theme-primary);
    --theme-link-color-hover: var(--theme-primary-500);
    --theme-link-color-visited: var(--theme-primary-600);
    --theme-post-title-color: var(--theme-link-color) !important;
    --theme-post-title-color-hover: var(--theme-link-color-hover) !important;
    --theme-post-title-color-visited: var(--theme-link-color-visited) !important;
    --theme-post-title-color-hover-visited: var(--theme-link-color-hover) !important;
  }
  a.s-tag {
	--theme-tag-border-color: var(--_ta-bg);
	--theme-tag-background-color: var(--black-150);
	--theme-tag-color: var(--black-500);
	--theme-tag-hover-border-color: var(--black-200);
	--theme-tag-hover-background-color: var(--black-200);
	--theme-tag-hover-color: var(--black-600);
  }
}
body.outside, body#chat-body {
  background: unset !important;
  background-color: var(--theme-background-color,var(--white)) !important;
  > #container, > #footer, div.footerwrap a, div.messages, a.signature, div#sidebar, div.msg-small {
    color:var(--fc-medium) !important;
  }
  div.messages {
    background-color: var(--black-150) !important;
    > div.reply-parent, div.reply-child, div.highlight {
      background-color: transparent !important;
      border: 1px solid yellow;
    }
  }
  div.ob-wikipedia {
    color: unset !important;
    background-color: unset !important;
    > div.ob-wikipedia-title > a {
      color: unset !important;
    }
  }
}
div#user-menu, body#chat-body div.popup {
  background-color: var(--black-150);
  color: var(--fc-medium);
  a.um-user-link:not(#a#b), span {
    color: var(--fc-medium) !important;
  }
}
#content {
  --theme-content-background-color: none;
}
header.s-topbar {
  --theme-topbar-accent-border: var(--theme-primary) !important;
  --theme-topbar-background-color: hsl(210,8%,5%) !important;
  --theme-topbar-item-background: transparent !important;
  --theme-topbar-item-background-hover: var(--black-200) !important;
  --theme-topbar-item-color: var(--black-400) !important;
  --theme-topbar-item-color-hover: var(--black-600) !important;
  --theme-topbar-search-background: hsl(210,8%,25%) !important;
  --theme-topbar-search-placeholder: var(--black-400) !important;
  --theme-topbar-select-background: transparent !important;
}
/* Hide cookie and Google banners */
div#onetrust-consent-sdk, div#credential_picker_container {
  display: none;
}
`);