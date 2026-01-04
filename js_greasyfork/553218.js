// ==UserScript==
// @name NuGet.org – Compact Enhanced [Ath]
// @namespace athari
// @version 1.1.0
// @description Enhanced compact layout for NuGet (NuGet.org) which combines info from multiple tabs, colors icons etc.
// @author Athari (https://github.com/Athari)
// @homepageURL https://github.com/Athari/AthariUserCSS
// @supportURL https://github.com/Athari/AthariUserCSS/issues
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.nuget.org/*
// @downloadURL https://update.greasyfork.org/scripts/553218/NuGetorg%20%E2%80%93%20Compact%20Enhanced%20%5BAth%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/553218/NuGetorg%20%E2%80%93%20Compact%20Enhanced%20%5BAth%5D.meta.js
// ==/UserScript==

(function() {
let css = `
  html {
    scrollbar-gutter: stable;
    &[data-theme="dark"] {
      color-scheme: dark;
    }
  }
  body {
    display: flex;
    flex-flow: column;
    min-height: 100vh;
    line-height: 1.2;
  }

  nav.navbar {
    display: flex;
    place-items: center;
    margin-inline: 24px;
    #skipToContent {
      display: none;
    }
    .container,
    .row,
    .col-sm-12,
    #navbar,
    #search-bar-header {
      display: contents !important;
    }
    .input-group {
      margin-left: auto;
      min-width: 500px;
      display: flex;
    }
    .navbar-right {
      margin-left: auto;
      order: 10;
    }
    .input-group-addon, .input-group-btn {
      width: auto;
    }
  }

  #skippedToContent {
    flex: 1;
    font-size: 0;
    > * {
      font-size: 1.6rem;
    }
  }

  .list-packages {
    .package {
      margin: 0 -15px;
      padding: 1rem 15px;
      &:nth-child(2n+1) {
        background: #88888818;
      }
      .row {
        display: flex;
        flex-flow: row;
        .col-package-icon {
          width: 96px;
          height: 96px;
        }
        .icon-text {
          color: var(--neutralForeground3Hover);
        }
        .package-header {
          display: flex;
          flex-flow: row;
          gap: 0.7ch;
          .package-by {
            margin-left: auto;
          }
        }
        .package-tags {
          .icon-text {
            display: flex;
            flex-flow: row wrap;
            gap: 1ch;
          }
          a[title="View more tags"] {
            font-size: 0;
            &::after {
              content: "...";
              font-size: 1.5rem;
            }
          }
        }
        a[aria-label^="More information about "] {
          display: none;
        }
      }
    }
  }

  .page-package-details {
    display: flex;
    width: auto;
    > .row {
      display: contents;
    }
    .package-details-main {
      display: grid;
      align-content: flex-start;
      flex: 1;
      width: auto;
    }
    .package-details-info {
      width: 35rem;
      .download-info-row,
      .sidebar-links li {
        margin: .4em 0 !important;
      }
      .owner-list {
        display: flex;
        flex-flow: row wrap;
        gap: .3em 1em;
        margin: 0 0 1em 0;
        li {
          display: flex;
          margin: 0;
        }
        img {
          border-radius: 0;
        }
      }
    }
    .package-header {
      margin: 0;
      display: flex;
      flex-flow: row wrap;
      place-items: center;
      .package-title {
        display: contents;
        place-items: center;
        margin: .5em 0;
        h1 {
          margin: 0;
          .package-icon {
            width: 128px;
            height: 128px;
            margin: 8px 16px -72px 0;
          }
        }
      }
      > p /*Requires NuGet 2.12 or higher.*/ {
        display: none;
      }
      .framework-badges {
        margin: 0 0 0 auto;
      }
      .deprecation-container {
        display: contents;
        .alert {
          width: 100%;
        }
      }
      .alert,
      .install-tabs {
        margin: 0 0 0 calc(128px + 16px);
      }
      .alert {
        br {
          display: none;
        }
      }
      .install-tabs {
        width: 100%;
        .tab-pane.active {
          display: flex !important;
          flex-flow: row wrap !important;
          .package-manager-command-header {
            display: none !important;
          }
          .copy-button {
            margin-left: 16px;
          }
          .alert {
            display: none;
            width: auto;
          }
        }
      }
    }
    .body-tabs {
      margin: .5em 0;
      .nav-tabs {
        display: flex;
        li:has(> :is(#versions-body-tab)) {
          order: 10;
        }
        li:has(> :is(#usedby-body-tab)) {
          order: 20;
        }
        li:has(> :is(#supportedframeworks-body-tab, #dependencies-body-tab, #releasenotes-body-tab)) {
          order: 100;
        }
      }
      li.active {
        background: #88f3;
        a {
          color: lightskyblue;
        }
      }
    }
    .body-tab-content {
      display: flex;
      padding: 0 !important;
      &:has(#readme-tab.active) {
        display: grid;
        grid-template: auto 1fr / 1fr auto;
        grid-template-areas:
          "releasenotes dependencies"
          "readme       dependencies";
        gap: 0 24px;
        #releasenotes-tab {
          grid-area: releasenotes;
          display: block;
          max-height: 90vh;
          overflow: auto;
          border-bottom: solid 1px light-dark(#222, #ddd);
          margin: 0 0 1em 0;
          &::before {
            content: "Release Notes";
            display: block;
            margin: 0 0 .3em 0;
            font-weight: 300;
            font-size: 2.6rem;
          }
        }
        #readme-tab {
          grid-area: readme;
        }
        #dependencies-tab {
          grid-area: dependencies;
          display: block;
          width: max-content;
          max-width: 45rem;
          &::before {
            content: "Dependencies";
            display: block;
            margin: 0 0 .3em 0;
            font-weight: 300;
            font-size: 2.6rem;
          }
        }
      }
      &:has(#versions-tab.active) {
        display: grid;
        grid-template: auto 1fr / 1fr auto;
        grid-template-areas:
          "versions dependencies"
          "versions supportedframeworks";
        gap: 0 24px;
        #versions-tab {
          grid-area: versions;
          justify-self: flex-start;
        }
        #dependencies-tab {
          grid-area: dependencies;
          display: block;
          &::before {
            content: "Dependencies";
            display: block;
            margin: 0 0 .3em 0;
            font-weight: 300;
            font-size: 2.6rem;
          }
        }
        #supportedframeworks-tab {
          grid-area: supportedframeworks;
          display: block;
          max-width: 100rem;
          &::before {
            content: "Frameworks";
            display: block;
            margin: 0 0 .3em 0;
            font-weight: 300;
            font-size: 2.6rem;
          }
        }
      }
    }
    #readme-tab {
      flex: 1;
      h1, h2, h3, h4, h5, h6 {
        margin: .2em 0 .4em !important;
      }
      pre, code {
        white-space: pre-wrap;
        overflow-wrap: break-word;
      }
      .table {
        width: auto;
      }
      .alert-primary {
        background: #435;
        border-color: oklch(from #435 calc(l * 0.8) c h);
        color: #efd9fd;
      }
      .alert-info {
        background: #444;
        border-color: oklch(from #444 calc(l * 0.8) c h);
        color: #f4f4f4;
      }
      .alert-success {
        background: #3c763d;
        border-color: oklch(from #3c763d calc(l * 0.8) c h);
        color: #dff0d8;
      }
      .alert-warning {
        background: #432;
        border-color: oklch(from #432 calc(l * 0.8) c h);
        color: #fff4ce;
      }
      .alert-danger {
        background: #611;
        border-color: oklch(from #611 calc(l * 0.8) c h);
        color: #fde7e9;
      }
    }
    #versions-tab {
      #version-history:not(:has(.package-icon-cell:not(:empty))) {
        columns: 2;
      }
      :is(td, th):not(.package-icon-cell) {
        white-space: nowrap;
      }
      .package-icon-cell {
        text-align: left;
        justify-content: left;
        max-width: max-content;
        &:not(:empty) {
          min-width: 35rem;
        }
      }
      .package-icon {
        vertical-align: middle;
      }
      .tooltip-block, .tooltip-wrapper, .popover-content {
        display: contents !important;
      }
      .arrow {
        display: none;
      }
    }
    #dependencies-tab {
      .dependency-group a {
        font-weight: normal;
      }
    }
  }

  footer.footer {
    display: flex;
    flex-flow: row wrap;
    place-items: center;
    place-content: center;
    gap: 1rem 0.5rem;
    height: auto;
    .container,
    .row,
    .row-gap,
    .col-md-12,
    .footer-heading,
    p {
      display: contents;
    }
    .col-sm-4 {
      display: flex;
      place-items: baseline;
      gap: 24px;
      width: auto;
    }
    .nuget-logo-footer {
      margin-right: 24px;
    }
    p {
      color: #888;
    }
    ::before, ::after {
      content: none;
    }
  }
  .ms-Icon--ReadingMode::before,
  .ms-Icon--History::before {
    color: yellowgreen;
  }
  .ms-Icon--Globe::before {
    color: deepskyblue;
  }
  .ms-Icon--Certificate::before {
    color: orange;
  }
  .ms-Icon--Download::before,
  .ms-Icon--CloudDownload::before {
    color: skyblue;
  }
  .ms-Icon--FabricFolderSearch::before {
    color: gold;
  }
  .ms-Icon--Dictionary::before {
    color: palegreen;
  }
  .ms-Icon--Package::before {
    color: orange;
  }
  .ms-Icon--Packages::before {
    color: burlywood;
  }
  .ms-Icon--BranchFork2::before {
    color: deepskyblue;
  }
  .ms-Icon--Stopwatch::before {
    color: yellowgreen;
  }
  .ms-Icon--Info::before {
    color: dodgerblue !important;
  }
  .ms-Icon--Warning::before {
    color: yellow;
  }
  .ms-Icon--Flag::before {
    color: #c00;
  }
  .git-image-icon {
    filter: sepia(1) saturate(200) hue-rotate(70deg)  !important;
  }
  .nuget-trends-icon {
    filter: invert(1) brightness(0.6) sepia(1) saturate(2) hue-rotate(30deg) !important;
  }
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
