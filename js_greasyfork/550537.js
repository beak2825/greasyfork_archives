// ==UserScript==
// @name          AO3: Site Wizard
// @version       3.6
// @description   Make AO3 easier to read: customize fonts and sizes, set site colors, adjust work reader margins, fix spacing issues, and configure text alignment preferences.
// @author        Blackbatcat
// @match         *://archiveofourown.org/*
// @license       MIT
// @require       https://update.greasyfork.org/scripts/554170/1693013/AO3%3A%20Menu%20Helpers%20Library%20v2.js?v=2.1.6
// @grant         none
// @run-at        document-start
// @namespace https://greasyfork.org/users/1498004
// @downloadURL https://update.greasyfork.org/scripts/550537/AO3%3A%20Site%20Wizard.user.js
// @updateURL https://update.greasyfork.org/scripts/550537/AO3%3A%20Site%20Wizard.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // --- CONSTANTS ---
  const FORMATTER_CONFIG_KEY = "ao3_wizard_config";
  const DEFAULT_FORMATTER_CONFIG = {
    paragraphWidthPercent: 70,
    paragraphFontSizePercent: 100,
    paragraphTextAlign: "left",
    paragraphFontFamily: "",
    fixParagraphSpacing: true,
    paragraphGap: 1.286,
    siteFontFamily: "",
    siteFontWeight: "",
    siteFontSizePercent: 100,
    headerFontFamily: "",
    headerFontWeight: "",
    codeFontFamily: "",
    codeFontStyle: "normal",
    codeFontSize: "",
    expandCodeFontUsage: false,
    backgroundColor: "",
    textColor: "",
    headerColor: "",
    accentColor: "",
    logoColor: "",
  };

  const WORKS_PAGE_REGEX =
    /^https?:\/\/archiveofourown\.org\/(?:.*\/)?(works|chapters)(\/|$)/;

  // --- STATE ---
  let FORMATTER_CONFIG = { ...DEFAULT_FORMATTER_CONFIG };
  let cachedElements = {
    paraStyle: null,
    siteStyle: null,
  };

  // --- UTILITIES ---
  function getOrCreateStyle(id) {
    if (!document.head) return null;
    let style = document.getElementById(id);
    if (!style) {
      style = document.createElement("style");
      style.id = id;
      document.head.appendChild(style);
    }
    return style;
  }

  function loadFormatterConfig() {
    try {
      const saved = localStorage.getItem(FORMATTER_CONFIG_KEY);
      if (saved) {
        FORMATTER_CONFIG = {
          ...DEFAULT_FORMATTER_CONFIG,
          ...JSON.parse(saved),
        };
      }
    } catch (e) {
      console.error("Error loading config:", e);
    }
  }

  function saveFormatterConfig() {
    try {
      localStorage.setItem(
        FORMATTER_CONFIG_KEY,
        JSON.stringify(FORMATTER_CONFIG)
      );
    } catch (e) {
      console.error("Error saving config:", e);
    }
  }

  // --- APPLY STYLES ---
  function applyParagraphWidth() {
    if (!cachedElements.paraStyle) {
      cachedElements.paraStyle = getOrCreateStyle(
        "ao3-formatter-paragraph-style"
      );
      if (!cachedElements.paraStyle) return;
    }

    if (WORKS_PAGE_REGEX.test(window.location.href)) {
      const {
        paragraphWidthPercent,
        paragraphFontSizePercent,
        paragraphTextAlign,
        paragraphGap,
      } = FORMATTER_CONFIG;

      cachedElements.paraStyle.textContent = `
        #workskin p { text-align: ${paragraphTextAlign} !important; }
        ${
          paragraphTextAlign === "justify" || paragraphTextAlign === "left"
            ? `#workskin dd { text-align: ${paragraphTextAlign} !important; }`
            : ""
        }
        ${
          paragraphTextAlign === "justify" || paragraphTextAlign === "left"
            ? `#workskin blockquote { text-align: ${paragraphTextAlign} !important; }`
            : ""
        }
        #workskin {
          max-width: ${paragraphWidthPercent}vw !important;
          font-size: ${paragraphFontSizePercent}% !important;
        }
        #workskin p {
          margin-bottom: ${paragraphGap}em !important;
        }
        #workskin p[align] {
          text-align: ${paragraphTextAlign} !important;
        }
        ${
          paragraphTextAlign === "right"
            ? `
        #workskin ul, #workskin ol {
          direction: rtl !important;
          text-align: right !important;
        }
        #workskin li {
          text-align: right !important;
        }
        #workskin dl {
          direction: rtl !important;
        }
        #workskin dt, #workskin dd {
          text-align: right !important;
        }
        #workskin blockquote {
          text-align: right !important;
        }
        #workskin summary {
          text-align: right !important;
        }
        #workskin h1, #workskin h2, #workskin h3,
        #workskin h4, #workskin h5, #workskin h6 {
          text-align: right !important;
        }
        `
            : ""
        }
      `;

      const workskin = document.getElementById("workskin");
      if (workskin) {
        if (paragraphTextAlign === "right") {
          workskin.setAttribute("dir", "rtl");
        } else {
          workskin.removeAttribute("dir");
        }
      }
    } else {
      cachedElements.paraStyle.textContent = "";
    }

    applySiteWideStyles();
  }

  function applySiteWideStyles() {
    if (!cachedElements.siteStyle) {
      cachedElements.siteStyle = getOrCreateStyle("ao3-sitewide-style");
      if (!cachedElements.siteStyle) return;
    }

    const {
      siteFontSizePercent,
      siteFontFamily,
      siteFontWeight,
      headerFontFamily,
      headerFontWeight,
      paragraphFontFamily,
      codeFontFamily,
      codeFontStyle,
      codeFontSize,
      expandCodeFontUsage,
      backgroundColor,
      textColor,
      headerColor,
      accentColor,
    } = FORMATTER_CONFIG;

    const rules = [];

    rules.push(`html { font-size: ${siteFontSizePercent}% !important; }`);

    if (siteFontFamily) {
      if (expandCodeFontUsage) {
        rules.push(
          `body, body *:not(textarea):not(textarea *):not(code):not(pre):not(tt):not(kbd):not(samp):not(var), input:not([type="file"]), select, button:not(.comment-format button):not(ul.comment-format button) { font-family: ${siteFontFamily} !important; }`
        );
      } else {
        rules.push(
          `body, body *:not(code):not(pre):not(tt):not(kbd):not(samp):not(var), input:not([type="file"]), textarea:not(#skin_css):not(#floaty-textarea), select, button:not(.comment-format button):not(ul.comment-format button) { font-family: ${siteFontFamily} !important; }`
        );
      }
    }

    if (siteFontWeight) {
      const textareaSelector = expandCodeFontUsage
        ? ""
        : ", textarea:not(#skin_css):not(#floaty-textarea)";

      rules.push(
        `body, body *, input:not([type="file"])${textareaSelector}, select, button:not(.comment-format button):not(ul.comment-format button) { font-weight: ${siteFontWeight} !important; }`
      );
    }

    if (paragraphFontFamily) {
      const textareaExclusion = expandCodeFontUsage ? ":not(textarea)" : "";

      if (headerFontFamily) {
        rules.push(
          `#workskin:not(h1):not(h2):not(h3):not(h4):not(h5):not(h6),
           #workskin *:not(code):not(pre):not(tt):not(kbd):not(samp):not(var):not(h1):not(h2):not(h3):not(h4):not(h5):not(h6):not(h1 *):not(h2 *):not(h3 *):not(h4 *):not(h5 *):not(h6 *)${textareaExclusion} { font-family: ${paragraphFontFamily} !important; }`
        );
      } else {
        rules.push(
          `#workskin, #workskin *:not(code):not(pre):not(tt):not(kbd):not(samp):not(var)${textareaExclusion} { font-family: ${paragraphFontFamily} !important; }`
        );
      }
    }

    if (headerFontFamily) {
      rules.push(
        `h1, h1 *, h2, h2 *, h3, h3 *, h4, h4 *, h5, h5 *, h6, h6 *, .heading, .heading *,
         #workskin h1, #workskin h1 *, #workskin h2, #workskin h2 *, #workskin h3, #workskin h3 *,
         #workskin h4, #workskin h4 *, #workskin h5, #workskin h5 *, #workskin h6, #workskin h6 * { font-family: ${headerFontFamily} !important; }`
      );
    } else if (paragraphFontFamily) {
      rules.push(
        `#chapters h3.title,
         #chapters h3.byline.heading,
         .chapter .preface h3.title,
         .chapter .preface h3.byline.heading,
         .preface h3.title,
         .preface h3.byline { font-family: ${paragraphFontFamily} !important; }`
      );
    }

    if (headerFontWeight) {
      rules.push(
        `h1, h1 *, h2, h2 *, h3, h3 *, h4, h4 *, h5, h5 *, h6, h6 *, .heading, .heading *,
         #workskin h1, #workskin h1 *, #workskin h2, #workskin h2 *, #workskin h3, #workskin h3 *,
         #workskin h4, #workskin h4 *, #workskin h5, #workskin h5 *, #workskin h6, #workskin h6 * { font-weight: ${headerFontWeight} !important; }`
      );
    }

    const codeRules = [];
    if (codeFontFamily)
      codeRules.push(`font-family: ${codeFontFamily} !important`);
    if (codeFontStyle && codeFontStyle !== "normal")
      codeRules.push(`font-style: ${codeFontStyle} !important`);
    if (codeFontSize) codeRules.push(`font-size: ${codeFontSize} !important`);

    if (codeRules.length > 0) {
      const baseCodeSelectors =
        "code, code *, pre, pre *, tt, tt *, kbd, kbd *, samp, samp *, var, var *, textarea#skin_css, .css.module blockquote pre, #floaty-textarea, #workskin code, #workskin code *, #workskin pre, #workskin pre *, #workskin tt, #workskin tt *, #workskin kbd, #workskin kbd *, #workskin samp, #workskin samp *, #workskin var, #workskin var *";

      const codeSelectors = expandCodeFontUsage
        ? "code, code *, pre, pre *, tt, tt *, kbd, kbd *, samp, samp *, var, var *, textarea, textarea#skin_css, .css.module blockquote pre, #floaty-textarea, #workskin code, #workskin code *, #workskin pre, #workskin pre *, #workskin tt, #workskin tt *, #workskin kbd, #workskin kbd *, #workskin samp, #workskin samp *, #workskin var, #workskin var *, #workskin textarea"
        : baseCodeSelectors;

      rules.push(`${codeSelectors} { ${codeRules.join("; ")}; }`);
    }

    if (codeRules.length === 0) {
      rules.push(
        `code, code *, pre, pre *, tt, tt *, kbd, kbd *, samp, samp *, var, var *, #workskin code, #workskin code *, #workskin pre, #workskin pre *, #workskin tt, #workskin tt *, #workskin kbd, #workskin kbd *, #workskin samp, #workskin samp *, #workskin var, #workskin var * { font-family: monospace !important; }`
      );

      if (expandCodeFontUsage) {
        rules.push(
          `textarea, #workskin textarea { font-family: monospace !important; }`
        );
      }
    }

    rules.push(
      `#workskin .preface .title.heading,
       #workskin .preface .byline.heading,
       #workskin .preface .title,
       #workskin .preface .byline,
       #workskin .title.heading,
       #workskin .byline.heading {
         text-align: center !important;
         direction: ltr !important;
       }`
    );

    rules.push(
      `#workskin pre {
         text-align: left !important;
         direction: ltr !important;
       }`
    );

    rules.push(
      `#cmtFmtDialog #stdbutton label, ul.comment-format, ul.comment-format * { font-family: "FontAwesome", sans-serif !important; font-weight: normal !important; }`,
      `ul.actions.comment-format { text-align: left !important; }`
    );

    cachedElements.siteStyle.textContent = rules.join("\n");
    applyColorStyles();
  }

  function applyColorStyles() {
    const colorStyleId = "ao3-color-style";
    let colorStyle = document.getElementById(colorStyleId);

    const { backgroundColor, textColor, headerColor, accentColor, logoColor } =
      FORMATTER_CONFIG;

    // Remove existing color styles if all colors are blank
    if (
      !backgroundColor &&
      !textColor &&
      !headerColor &&
      !accentColor &&
      !logoColor
    ) {
      if (colorStyle) {
        colorStyle.remove();
      }
      return;
    }

    // Create style element if it doesn't exist
    if (!colorStyle) {
      colorStyle = getOrCreateStyle(colorStyleId);
      if (!colorStyle) return;
    }

    const rules = [];
    const rootVars = [];

    // Build CSS custom properties
    if (backgroundColor)
      rootVars.push(`--background-color: ${backgroundColor}`);
    if (textColor) rootVars.push(`--text-color: ${textColor}`);
    if (headerColor) rootVars.push(`--header-color: ${headerColor}`);
    if (accentColor) rootVars.push(`--accent-color: ${accentColor}`);
    if (logoColor) rootVars.push(`--logo-filter: ${logoColor}`);

    // Add single :root declaration
    if (rootVars.length > 0) {
      rules.push(`:root {\n    ${rootVars.join(";\n    ")};\n}`);
    }

    // Apply styles matching ao3_sw_colors.css structure exactly
    if (backgroundColor) {
      rules.push(`#outer {\n    background-color: var(--background-color);\n}`);
      rules.push(
        `.listbox .index {\n    background: var(--background-color);\n}`
      );
    }

    if (headerColor) {
      rules.push(`#header .primary,
#footer,
.autocomplete .dropdown ul li:hover,
.autocomplete .dropdown li.selected,
a.tag:hover,
.listbox .heading a.tag:visited:hover,
.splash .favorite li:nth-of-type(2n+1) a:hover,
.splash .favorite li:nth-of-type(2n+1) a:focus,
#tos_prompt .heading {
    background-image: none;
    background-color: var(--header-color);
}`);
    }

    if (textColor) {
      rules.push(`h2,
a,
a:link,
a:visited,
a:hover,
#header a,
#header a:visited,
#header .primary .open a,
#header .primary .dropdown:hover a,
#header .primary .dropdown a:focus,
#header .primary .menu a,
#dashboard a,
#dashboard span,
a.tag,
.listbox>.heading,
.listbox .heading a:visited,
.filters dt a:hover {
    color: var(--text-color);
}
.qtip-content, .notice:not(.required), .comment_notice, .kudos_notice, ul.notes, .caution, .notice a, .error, .comment_error, .kudos_error, .alert.flash, form .notice {
    color: #2a2a2a !important;
}`);
    }

    // Always apply white text to userscripts dropdown menu
    rules.push(`#scriptconfig > a:nth-child(1) {
    color: #fff !important;
}`);

    if (headerColor) {
      rules.push(`#dashboard,
#dashboard.own {
    border-color: var(--header-color);
}`);
    }

    if (accentColor) {
      rules.push(`#dashboard a:hover,
#dashboard .current,
li.relationships a {
    background: var(--accent-color);
}`);
    }

    if (accentColor) {
      rules.push(`table,
thead td,
#header .actions a:hover,
#header .actions a:focus,
#header .dropdown:hover a,
#header .open a,
#header .menu,
#small_login,
fieldset,
form dl,
fieldset dl dl,
fieldset fieldset fieldset,
fieldset fieldset dl dl,
.ui-sortable li,
.ui-sortable li:hover,
dd.hideme,
form blockquote.userstuff,
dl.index dd,
.statistics .index li:nth-of-type(2n),
.listbox,
fieldset fieldset.listbox,
.item dl.visibility,
.reading h4.viewed,
.comment h4.byline,
.splash .favorite li:nth-of-type(2n+1) a,
.splash .module div.account,
.search [role="tooltip"] {
    background: var(--accent-color);
    border-color: var(--accent-color);
}`);

      // Preserve box-shadow for fieldset elements
      rules.push(`fieldset {
    box-shadow: inset 1px 0 5px rgba(0, 0, 0, 0.5);
}`);
    }

    if (headerColor) {
      rules.push(`#header .heading a,
#header .user a:hover,
#header .user a:focus,
#dashboard a:hover,
.actions a:hover,
.actions button:hover,
.actions input:hover,
.actions a:focus,
.actions button:focus,
.actions input:focus,
label.action:hover,
.action:hover,
.action:focus,
a.cloud1,
a.cloud2,
a.cloud3,
a.cloud4,
a.cloud5,
a.cloud6,
a.cloud7,
a.cloud8,
a.work,
.blurb h4 a:link,
.splash .module h3,
.splash .browse li a::before {
    color: var(--header-color);
}`);
    }

    if (textColor) {
      rules.push(`body,
.toggled form,
.dynamic form,
.secondary,
.dropdown,
#header .search,
form dd.required,
.post .required .warnings,
dd.required,
.required .autocomplete,
span.series .divider,
.filters .expander,
.userstuff h2 {
    color: var(--text-color);
}`);
    }

    if (accentColor) {
      rules.push(`li.blurb,
fieldset,
form dl,
thead,
tfoot,
tfoot td,
th,
tr:hover,
col.name,
#dashboard ul,
.toggled form,
.dynamic form,
form.verbose legend,
.verbose form legend,
.secondary,
.work.navigation .download,
.javascript .work.navigation .download .secondary,
dl.meta,
.bookmark .user,
div.comment,
li.comment,
.comment div.icon,
.splash .news li,
.userstuff blockquote {
    border-color: var(--accent-color);
}`);
    }

    if (backgroundColor) {
      rules.push(`body,
.toggled form,
.dynamic form,
.secondary,
.dropdown,
th,
tr:hover,
col.name,
div.dynamic,
fieldset fieldset,
fieldset dl dl,
form blockquote.userstuff,
form.verbose legend,
.verbose form legend,
#modal,
.work.navigation .download,
.javascript .work.navigation .download .secondary,
.own,
.draft,
.draft .wrapper,
.unread,
.child,
.unwrangled,
.unreviewed,
.thread .even,
.listbox .index,
.nomination dt,
#tos_prompt {
    background: var(--background-color);
}`);
    }

    if (textColor) {
      rules.push(`form dt,
.filters .group dt.bookmarker,
.faq .categories h3,
.splash .module h3,
.userstuff h3 {
    border-color: var(--text-color);
}`);
    }

    if (logoColor) {
      rules.push(`#header .logo { filter: var(--logo-filter); }`);
    }

    colorStyle.textContent = rules.join("\n\n");
  }

  // --- PARAGRAPH SPACING FIX ---
  const fixParagraphSpacing = (() => {
    function removeLeadingBrs(userstuff) {
      userstuff.querySelectorAll("p").forEach((p) => {
        let changed = true;
        while (changed) {
          changed = false;
          if (p.firstChild?.tagName === "BR") {
            p.firstChild.remove();
            changed = true;
          } else if (
            p.firstChild?.nodeType === Node.TEXT_NODE &&
            !p.firstChild.textContent.trim()
          ) {
            p.firstChild.remove();
            changed = true;
          }
        }
      });
    }

    function removeTrailingBrs(userstuff) {
      userstuff.querySelectorAll("p").forEach((p) => {
        let changed = true;
        while (changed) {
          changed = false;
          if (p.lastChild?.tagName === "BR") {
            p.lastChild.remove();
            changed = true;
          } else if (
            p.lastChild?.nodeType === Node.TEXT_NODE &&
            !p.lastChild.textContent.trim()
          ) {
            p.lastChild.remove();
            changed = true;
          }
        }
      });
    }

    function removeEmptyParagraphs(userstuff) {
      userstuff.querySelectorAll("p").forEach((p) => {
        const content = p.textContent?.replace(/\u00A0/g, "").trim();
        if (!content && !p.querySelector("img, embed, iframe, video, br")) {
          p.remove();
        }
      });
    }

    function removeEmptyElement(el) {
      const content = el.textContent?.replace(/\u00A0/g, "").trim();
      if (
        !content &&
        el.tagName !== "BR" &&
        el.tagName !== "HR" &&
        !el.querySelector("img, embed, iframe, video")
      ) {
        el.remove();
      }
    }

    function reduceBrs(userstuff) {
      const brs = Array.from(userstuff.querySelectorAll("br"));

      for (let i = 0; i < brs.length; i++) {
        const br = brs[i];
        let consecutiveCount = 1;
        let nextNode = br.nextSibling;

        while (nextNode) {
          if (
            nextNode.nodeType === Node.ELEMENT_NODE &&
            nextNode.tagName === "BR"
          ) {
            consecutiveCount++;
            nextNode = nextNode.nextSibling;
          } else if (
            nextNode.nodeType === Node.TEXT_NODE &&
            !nextNode.textContent.trim()
          ) {
            nextNode = nextNode.nextSibling;
          } else {
            break;
          }
        }

        if (consecutiveCount >= 3) {
          let toRemove = consecutiveCount - 2;
          nextNode = br.nextSibling;

          while (toRemove > 0 && nextNode) {
            const current = nextNode;
            nextNode = nextNode.nextSibling;

            if (
              current.nodeType === Node.ELEMENT_NODE &&
              current.tagName === "BR"
            ) {
              current.remove();
              toRemove--;
            }
          }
        }
      }
    }

    const BLOCK_TAGS = [
      "div",
      "blockquote",
      "ul",
      "ol",
      "table",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
    ];

    return function () {
      if (!WORKS_PAGE_REGEX.test(window.location.href)) return;

      document
        .querySelectorAll(
          "#workskin .userstuff:not([data-formatter-spacing-fixed])"
        )
        .forEach((userstuff) => {
          userstuff.setAttribute("data-formatter-spacing-fixed", "true");

          removeLeadingBrs(userstuff);
          removeTrailingBrs(userstuff);
          removeEmptyParagraphs(userstuff);

          BLOCK_TAGS.forEach((tag) => {
            userstuff.querySelectorAll(tag).forEach((child) => {
              removeEmptyElement(child);
            });
          });

          reduceBrs(userstuff);
        });
    };
  })();

  // --- SETTINGS MENU ---
  function showFormatterMenu() {
    // Safety check: ensure library is loaded
    if (!window.AO3MenuHelpers) {
      console.error("[AO3: Site Wizard] Menu Helpers library not loaded");
      alert(
        "Error: Menu Helpers library not loaded. Please check your userscript manager."
      );
      return;
    }

    window.AO3MenuHelpers.removeAllDialogs();

    const dialog = window.AO3MenuHelpers.createDialog(
      "🪄 Site Wizard Settings 🪄",
      {
        maxWidth: "700px",
      }
    );

    // Site-Wide Display Section
    const siteSection = window.AO3MenuHelpers.createSection(
      "📱 Site-Wide Display"
    );

    const siteFontSize = window.AO3MenuHelpers.createSliderWithValue({
      id: "site-fontsize-input",
      label: "Base Font Size",
      min: 50,
      max: 200,
      step: 5,
      value: FORMATTER_CONFIG.siteFontSizePercent,
      unit: "%",
      tooltip:
        "Adjust the overall text size for the entire site (percentage of browser default)",
    });
    siteSection.appendChild(siteFontSize);

    const siteFontFamily = window.AO3MenuHelpers.createTextInput({
      id: "site-fontfamily-input",
      label: "General Text Font",
      value: FORMATTER_CONFIG.siteFontFamily,
      placeholder: "Figtree, sans-serif",
      tooltip: "Font for most site text",
    });

    const siteFontWeight = window.AO3MenuHelpers.createTextInput({
      id: "site-fontweight-input",
      label: "Font Weight",
      value: FORMATTER_CONFIG.siteFontWeight,
      placeholder: "400, normal",
      tooltip: "Boldness of general text",
    });

    const siteFontRow = window.AO3MenuHelpers.createTwoColumnLayout(
      siteFontFamily,
      siteFontWeight
    );
    siteSection.appendChild(siteFontRow);

    dialog.appendChild(siteSection);

    // Work Formatting Section
    const workSection =
      window.AO3MenuHelpers.createSection("📖 Work Formatting");

    const workWidth = window.AO3MenuHelpers.createSliderWithValue({
      id: "paragraph-width-slider",
      label: "Work Margin Width",
      min: 10,
      max: 100,
      step: 5,
      value: FORMATTER_CONFIG.paragraphWidthPercent,
      unit: "%",
      tooltip: "Maximum width of work reader",
    });
    workSection.appendChild(workWidth);

    const workFontSize = window.AO3MenuHelpers.createSliderWithValue({
      id: "paragraph-fontsize-slider",
      label: "Work Font Size",
      min: 50,
      max: 200,
      step: 5,
      value: FORMATTER_CONFIG.paragraphFontSizePercent,
      unit: "%",
      tooltip: "Size relative to site base size",
    });
    workSection.appendChild(workFontSize);

    const workFont = window.AO3MenuHelpers.createTextInput({
      id: "paragraph-fontfamily-input",
      label: "Work Font",
      value: FORMATTER_CONFIG.paragraphFontFamily,
      placeholder: "Figtree, sans-serif",
      tooltip: "Font family for reader",
    });
    workSection.appendChild(workFont);

    const textAlign = window.AO3MenuHelpers.createSelect({
      id: "paragraph-align-select",
      label: "Text Alignment",
      options: [
        {
          value: "left",
          label: "Left Aligned",
          selected: FORMATTER_CONFIG.paragraphTextAlign === "left",
        },
        {
          value: "justify",
          label: "Justified",
          selected: FORMATTER_CONFIG.paragraphTextAlign === "justify",
        },
        {
          value: "right",
          label: "Right Aligned",
          selected: FORMATTER_CONFIG.paragraphTextAlign === "right",
        },
      ],
      tooltip: "How text is aligned within paragraphs",
    });

    const lineSpacing = window.AO3MenuHelpers.createNumberInput({
      id: "paragraph-gap-input",
      label: "Line Spacing",
      value: FORMATTER_CONFIG.paragraphGap,
      min: 0,
      step: 0.1,
      tooltip:
        "Vertical space between paragraphs (multiplier). Default is 1.286.",
    });

    const alignSpacingRow = window.AO3MenuHelpers.createTwoColumnLayout(
      textAlign,
      lineSpacing
    );
    workSection.appendChild(alignSpacingRow);

    const fixSpacing = window.AO3MenuHelpers.createCheckbox({
      id: "fix-paragraph-spacing-checkbox",
      label: "Fix excessive paragraph spacing",
      checked: FORMATTER_CONFIG.fixParagraphSpacing,
      tooltip: "Remove unnecessary blank space between paragraphs",
    });
    workSection.appendChild(fixSpacing);

    dialog.appendChild(workSection);

    // Element-Specific Fonts Section
    const elementSection = window.AO3MenuHelpers.createSection(
      "🎯 Element-Specific Fonts"
    );

    const headerFont = window.AO3MenuHelpers.createTextInput({
      id: "header-fontfamily-input",
      label: "Header Font",
      value: FORMATTER_CONFIG.headerFontFamily,
      placeholder: "Figtree, sans-serif",
      tooltip: "Font for headings (H1-H6)",
    });

    const headerWeight = window.AO3MenuHelpers.createTextInput({
      id: "header-fontweight-input",
      label: "Header Weight",
      value: FORMATTER_CONFIG.headerFontWeight,
      placeholder: "700, bold",
      tooltip: "Boldness of header text",
    });

    const headerRow = window.AO3MenuHelpers.createTwoColumnLayout(
      headerFont,
      headerWeight
    );
    elementSection.appendChild(headerRow);

    const codeFont = window.AO3MenuHelpers.createTextInput({
      id: "code-fontfamily-input",
      label: "Code/Monospace Font",
      value: FORMATTER_CONFIG.codeFontFamily,
      placeholder: "Victor Mono Medium, monospace",
      tooltip: "Font for code blocks and preformatted text",
    });
    elementSection.appendChild(codeFont);

    const codeFontSize = window.AO3MenuHelpers.createTextInput({
      id: "code-fontsize-input",
      label: "Code Font Size",
      value: FORMATTER_CONFIG.codeFontSize,
      placeholder: "0.9em, 14px",
      tooltip: "Size relative to surrounding text",
    });

    const codeFontStyle = window.AO3MenuHelpers.createSelect({
      id: "code-fontstyle-select",
      label: "Code Font Style",
      options: [
        {
          value: "normal",
          label: "Normal",
          selected:
            !FORMATTER_CONFIG.codeFontStyle ||
            FORMATTER_CONFIG.codeFontStyle === "normal",
        },
        {
          value: "italic",
          label: "Italic",
          selected: FORMATTER_CONFIG.codeFontStyle === "italic",
        },
      ],
      tooltip: "Style for code text",
    });

    const codeRow = window.AO3MenuHelpers.createTwoColumnLayout(
      codeFontSize,
      codeFontStyle
    );
    elementSection.appendChild(codeRow);

    const expandCodeFont = window.AO3MenuHelpers.createCheckbox({
      id: "expand-code-font-checkbox",
      label: "Apply code font to comments",
      checked: FORMATTER_CONFIG.expandCodeFontUsage,
      tooltip:
        "Applies code font to all textareas. Requires a code/monospace font to be specified above.",
    });
    elementSection.appendChild(expandCodeFont);

    dialog.appendChild(elementSection);

    // Colors Section
    const colorSection = window.AO3MenuHelpers.createSection("🎨 Colors");

    const colorNotes = document.createElement("p");
    colorNotes.className = "notes";
    colorNotes.innerHTML =
      'You may wish to refer to this <a href="https://www.w3schools.com/colors/colors_names.asp">handy list of colors</a>.';
    colorSection.appendChild(colorNotes);

    const backgroundGroup = window.AO3MenuHelpers.createSettingGroup();
    backgroundGroup.appendChild(
      window.AO3MenuHelpers.createLabel(
        "Background Color",
        "sw_background_color"
      )
    );
    const backgroundInput = document.createElement("input");
    backgroundInput.type = "text";
    backgroundInput.id = "sw_background_color";
    backgroundInput.value = FORMATTER_CONFIG.backgroundColor;
    backgroundInput.placeholder = "#fff";
    backgroundGroup.appendChild(backgroundInput);

    const textGroup = window.AO3MenuHelpers.createSettingGroup();
    textGroup.appendChild(
      window.AO3MenuHelpers.createLabel("Text Color", "sw_foreground_color")
    );
    const textInput = document.createElement("input");
    textInput.type = "text";
    textInput.id = "sw_foreground_color";
    textInput.value = FORMATTER_CONFIG.textColor;
    textInput.placeholder = "#2a2a2a";
    textGroup.appendChild(textInput);

    const headerGroup = window.AO3MenuHelpers.createSettingGroup();
    headerGroup.appendChild(
      window.AO3MenuHelpers.createLabel("Header Color", "sw_headercolor")
    );
    const headerInput = document.createElement("input");
    headerInput.type = "text";
    headerInput.id = "sw_headercolor";
    headerInput.value = FORMATTER_CONFIG.headerColor;
    headerInput.placeholder = "#900";
    headerGroup.appendChild(headerInput);

    const accentGroup = window.AO3MenuHelpers.createSettingGroup();
    const accentLabel = window.AO3MenuHelpers.createLabel(
      "Accent Color ",
      "sw_accent_color"
    );
    const accentTooltip = window.AO3MenuHelpers.createTooltip(
      "Skins wizard accent color"
    );
    accentLabel.appendChild(accentTooltip);
    accentGroup.appendChild(accentLabel);
    const accentInput = document.createElement("input");
    accentInput.type = "text";
    accentInput.id = "sw_accent_color";
    accentInput.value = FORMATTER_CONFIG.accentColor;
    accentInput.placeholder = "#ddd";
    accentGroup.appendChild(accentInput);

    const firstRow = window.AO3MenuHelpers.createTwoColumnLayout(
      backgroundGroup,
      textGroup
    );
    colorSection.appendChild(firstRow);

    const secondRow = window.AO3MenuHelpers.createTwoColumnLayout(
      headerGroup,
      accentGroup
    );
    colorSection.appendChild(secondRow);

    const logoGroup = window.AO3MenuHelpers.createSettingGroup();
    const logoLabel = window.AO3MenuHelpers.createLabel(
      "Logo Color ",
      "sw_logo_color"
    );
    const logoTooltip = window.AO3MenuHelpers.createTooltip(
      "Change the color of the AO3 logo.Requires a CSS filter value (without 'filter:'). Generate at https://angel-rs.github.io/css-color-filter-generator/."
    );
    logoLabel.appendChild(logoTooltip);

    // Add clickable link emoji
    const linkEmoji = document.createElement("a");
    linkEmoji.href = "https://angel-rs.github.io/css-color-filter-generator/";
    linkEmoji.target = "_blank";
    linkEmoji.textContent = " 🔗";
    linkEmoji.style.marginLeft = "4px";
    linkEmoji.style.fontSize = "0.8em";
    logoLabel.appendChild(linkEmoji);
    logoGroup.appendChild(logoLabel);
    const logoInput = document.createElement("input");
    logoInput.type = "text";
    logoInput.id = "sw_logo_color";
    logoInput.value = FORMATTER_CONFIG.logoColor;
    logoInput.placeholder =
      "brightness(0) saturate(100%) invert(7%) sepia(83%) saturate(5831%) hue-rotate(358deg) brightness(108%) contrast(109%)";
    logoGroup.appendChild(logoInput);

    colorSection.appendChild(logoGroup);

    dialog.appendChild(colorSection);

    // Buttons
    const buttons = window.AO3MenuHelpers.createButtonGroup([
      { text: "Save", id: "formatter-save" },
      { text: "Cancel", id: "formatter-cancel" },
    ]);
    dialog.appendChild(buttons);

    // Reset Link
    const resetLink = window.AO3MenuHelpers.createResetLink(
      "Reset to Default Settings",
      () => {
        FORMATTER_CONFIG = { ...DEFAULT_FORMATTER_CONFIG };
        saveFormatterConfig();
        dialog.remove();
        applyParagraphWidth();
      }
    );
    dialog.appendChild(resetLink);

    // Export/Import Settings
    const exportBtn = document.createElement("button");
    exportBtn.id = "formatter-export";
    exportBtn.textContent = "Export Settings";
    exportBtn.style.marginRight = "8px";

    const fileInput = window.AO3MenuHelpers.createFileInput({
      id: "formatter-import",
      buttonText: "Import Settings",
      accept: "application/json",
      onChange: (file) => {
        const reader = new FileReader();
        reader.onload = function (evt) {
          try {
            const importedConfig = JSON.parse(evt.target.result);
            if (typeof importedConfig !== "object" || !importedConfig)
              throw new Error("Invalid JSON");
            const validConfig = { ...DEFAULT_FORMATTER_CONFIG };
            Object.keys(validConfig).forEach((key) => {
              if (importedConfig.hasOwnProperty(key))
                validConfig[key] = importedConfig[key];
            });
            FORMATTER_CONFIG = validConfig;
            saveFormatterConfig();
            alert("Settings imported! Reloading...");
            location.reload();
          } catch (err) {
            alert("Import failed: " + (err && err.message ? err.message : err));
          }
        };
        reader.readAsText(file);
      },
    });

    const importExportContainer = document.createElement("div");
    importExportContainer.className = "reset-link";
    importExportContainer.style.marginTop = "18px";
    importExportContainer.appendChild(exportBtn);
    importExportContainer.appendChild(fileInput.button);
    importExportContainer.appendChild(fileInput.input);
    dialog.appendChild(importExportContainer);

    exportBtn.addEventListener("click", function () {
      try {
        const now = new Date();
        const pad = (n) => n.toString().padStart(2, "0");
        const yyyy = now.getFullYear();
        const mm = pad(now.getMonth() + 1);
        const dd = pad(now.getDate());
        const dateStr = `${yyyy}-${mm}-${dd}`;
        const filename = `ao3_site_wizard_config_${dateStr}.json`;
        const blob = new Blob([JSON.stringify(FORMATTER_CONFIG, null, 2)], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }, 100);
      } catch (e) {
        alert("Export failed: " + (e && e.message ? e.message : e));
      }
    });

    // Event Handlers
    dialog.querySelector("#formatter-save").addEventListener("click", () => {
      FORMATTER_CONFIG.siteFontSizePercent =
        window.AO3MenuHelpers.getValue("site-fontsize-input") ||
        DEFAULT_FORMATTER_CONFIG.siteFontSizePercent;
      FORMATTER_CONFIG.siteFontFamily =
        window.AO3MenuHelpers.getValue("site-fontfamily-input") || "";
      FORMATTER_CONFIG.siteFontWeight =
        window.AO3MenuHelpers.getValue("site-fontweight-input") || "";
      FORMATTER_CONFIG.paragraphWidthPercent =
        window.AO3MenuHelpers.getValue("paragraph-width-slider") ||
        DEFAULT_FORMATTER_CONFIG.paragraphWidthPercent;
      FORMATTER_CONFIG.paragraphFontSizePercent =
        window.AO3MenuHelpers.getValue("paragraph-fontsize-slider") ||
        DEFAULT_FORMATTER_CONFIG.paragraphFontSizePercent;
      FORMATTER_CONFIG.paragraphTextAlign =
        window.AO3MenuHelpers.getValue("paragraph-align-select") ||
        DEFAULT_FORMATTER_CONFIG.paragraphTextAlign;
      FORMATTER_CONFIG.paragraphFontFamily =
        window.AO3MenuHelpers.getValue("paragraph-fontfamily-input") || "";
      FORMATTER_CONFIG.paragraphGap =
        window.AO3MenuHelpers.getValue("paragraph-gap-input") ||
        DEFAULT_FORMATTER_CONFIG.paragraphGap;
      FORMATTER_CONFIG.fixParagraphSpacing =
        window.AO3MenuHelpers.getValue("fix-paragraph-spacing-checkbox") ??
        false;
      FORMATTER_CONFIG.headerFontFamily =
        window.AO3MenuHelpers.getValue("header-fontfamily-input") || "";
      FORMATTER_CONFIG.headerFontWeight =
        window.AO3MenuHelpers.getValue("header-fontweight-input") || "";
      FORMATTER_CONFIG.codeFontFamily =
        window.AO3MenuHelpers.getValue("code-fontfamily-input") || "";
      FORMATTER_CONFIG.codeFontStyle =
        window.AO3MenuHelpers.getValue("code-fontstyle-select") || "normal";
      FORMATTER_CONFIG.codeFontSize =
        window.AO3MenuHelpers.getValue("code-fontsize-input") || "";
      FORMATTER_CONFIG.expandCodeFontUsage =
        window.AO3MenuHelpers.getValue("expand-code-font-checkbox") ?? false;
      FORMATTER_CONFIG.backgroundColor =
        window.AO3MenuHelpers.getValue("sw_background_color") || "";
      FORMATTER_CONFIG.textColor =
        window.AO3MenuHelpers.getValue("sw_foreground_color") || "";
      FORMATTER_CONFIG.headerColor =
        window.AO3MenuHelpers.getValue("sw_headercolor") || "";
      FORMATTER_CONFIG.accentColor =
        window.AO3MenuHelpers.getValue("sw_accent_color") || "";
      FORMATTER_CONFIG.logoColor =
        window.AO3MenuHelpers.getValue("sw_logo_color") || "";

      saveFormatterConfig();
      dialog.remove();
      applyParagraphWidth();
      applyColorStyles();

      if (FORMATTER_CONFIG.paragraphTextAlign === "right") {
        location.reload();
      }
    });

    dialog.querySelector("#formatter-cancel").addEventListener("click", () => {
      dialog.remove();
    });

    document.body.appendChild(dialog);
  }

  // --- SHARED MENU MANAGEMENT ---
  function initSharedMenu() {
    if (window.AO3MenuHelpers) {
      window.AO3MenuHelpers.addToSharedMenu({
        id: "opencfg_site_wizard",
        text: "Site Wizard",
        onClick: showFormatterMenu,
      });
    }
  }

  // --- INITIALIZATION ---
  loadFormatterConfig();
  console.log("[AO3: Site Wizard] loaded.");

  function initStyles() {
    if (document.head) {
      applyParagraphWidth();
    } else {
      const observer = new MutationObserver(() => {
        if (document.head) {
          observer.disconnect();
          applyParagraphWidth();
        }
      });
      observer.observe(document.documentElement, { childList: true });
    }
  }

  function runParagraphSpacingFixIfEnabled() {
    if (
      FORMATTER_CONFIG.fixParagraphSpacing &&
      WORKS_PAGE_REGEX.test(window.location.href)
    ) {
      fixParagraphSpacing();
    }
  }

  initStyles();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      runParagraphSpacingFixIfEnabled();
      initSharedMenu();
    });
  } else {
    runParagraphSpacingFixIfEnabled();
    initSharedMenu();
  }
})();
