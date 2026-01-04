// ==UserScript==
// @name        Gmail Sender Utils
// @namespace   https://github.com/szhu
// @match       https://mail.google.com/mail/u/*
// @version     1.3
// @author      Sean Zhu
// @description Quickly drill down by sender or label in Gmail.
// @homepageURL https://gist.github.com/szhu/1d816086307c5de02bc9a2bb1cf01fe0
// @downloadURL https://update.greasyfork.org/scripts/560960/Gmail%20Sender%20Utils.user.js
// @updateURL https://update.greasyfork.org/scripts/560960/Gmail%20Sender%20Utils.meta.js
// ==/UserScript==

// This script does two things:
//
// (1) Search messages from sender or label
// ----------------------------------------
//
// In a message list, if you click the email sender or label, you'll be taken to
// a listing of all emails from this sender or with this label.
// - By default, we search in the current scope. For example, if you're
//   currently looking at a label and click on a sender, we'll search for all
//   emails with this label and from this sender.
// - To find all emails from this sender, hold down Alt/Option when clicking.
//
// (2) Show top sender domains
// ---------------------------
//
// When you're at a messages list, we show all the top-level domains of the
// senders in the current view, sorted by number of emails. This is useful for
// seeing who is sending you a lot of email!
// - You can click on a domain to just see email from that domain.
//
// How to install
// ==============
//
// RECOMMENDED INSTALLATION:
// 1. Install Tampermonkey: https://www.tampermonkey.net/
// 2. On this page, click Raw.
// 3. Tampermonkey should prompt you to install this userscript.
//
// IN CASE THAT DOESN'T WORK:
// 1. Install an extension that lets you run userscripts.
// 2. Create a new userscript, and paste this entire file.
//
// ALTERNATIVE INSTALLATION: If you don't want to install a extension just to be
// able to use this, you can install this tool as an extension itself:
// 1. Click "Download as ZIP".
// 2. Go to chrome://extensions, and turn on Developer Mode.
// 3. Drag the entire unzipped folder into the Chrome window.
//
// Installing as an extension works in Chromium browsers (Chrome, Edge, Opera,
// etc.). It may work in Firefox (please leave a comment if it doesn't). It will
// not work in Safari.
//
// After you're done, this script will work the next time you open a Gmail tab!

/**
 * Create a css`` template literal that doesn't do anything. This is useful for
 * syntax highlighting in editors.
 */
function css(strings, ...expressions) {
  let result = strings[0];
  for (let i = 1, l = strings.length; i < l; i++) {
    result += expressions[i - 1];
    result += strings[i];
  }
  return result;
}

document.addEventListener(
  "click",
  (e) => {
    let initialQuery = document.querySelector('[name="q"').value.split(" ")[0];
    if (!initialQuery && location.hash === "#inbox") {
      initialQuery = "in:inbox";
    }

    let additionalQuery;

    let labelEl = e.target.closest(".ar.as > .at");
    if (labelEl) {
      let label = labelEl.getAttribute("title");
      console.log(label);
      additionalQuery = `label:${label.replace(/[ {}&"()/|]/g, "-")}`;
      console.log(additionalQuery);
    }

    let emailEl = e.target.closest("[email]");
    if (emailEl) {
      additionalQuery = [
        "from:(" + emailEl.getAttribute("email") + ")",
        "to:(" + emailEl.getAttribute("email") + ")",
      ].join(" OR ");
    }

    if (additionalQuery) {
      let query = [e.altKey ? "" : initialQuery, additionalQuery].join(" ");
      location.hash =
        `#search/` + encodeURIComponent(query).replace(/%20/g, "+");
      e.stopPropagation();
    }
  },
  true
);

/**
 * Create element.
 *
 * @param {{
 *   tag?: string;
 *   children?: (string | Element)[];
 *  [key: string]: any;
 * } | string} tagChildrenAttributes
 * @param {(string | Element)[]} moreChildren
 */
function El(tagChildrenAttributes, ...moreChildren) {
  let {
    tag = "div",
    children = [],
    ...attributes
  } = typeof tagChildrenAttributes === "string"
    ? { tag: tagChildrenAttributes }
    : tagChildrenAttributes;

  // Create element.
  let el = document.createElement(tag);

  // Set attributes.
  for (let [key, value] of Object.entries(attributes)) {
    if (key.startsWith("on") && typeof value === "function") {
      el.addEventListener(key.slice(2), value);
    } else if (value == null || typeof value === "boolean") {
      if (value) {
        el.setAttribute(key, "");
      }
    } else {
      el.setAttribute(key, value);
    }
  }

  // Add children.
  for (let child of [...children, ...moreChildren]) {
    el.appendChild(
      typeof child === "string" //
        ? document.createTextNode(child)
        : child
    );
  }

  return el;
}

function Counter(array) {
  let count = {};
  counterAdd(count, array);
}

function counterAdd(count, array) {
  array.forEach((val) => (count[val] = (count[val] || 0) + 1));
  return count;
}

let lastScan = "";

let scan = () => {
  if (document.querySelector("#email-frequency-lock")?.checked) {
    return;
  }

  console.log("Scan triggered");

  let emails = [];
  for (let el of document.querySelectorAll(
    '[role="main"] [jsmodel="nXDxbd"] .yW [email]'
  )) {
    let email = el.getAttribute("email");
    let domain = email.match("(.*@)?(.*)")[2];
    // Remove all but the last two parts of the domain
    domain = domain.split(".").slice(-2).join(".");
    emails.push(email);
  }

  if (JSON.stringify(emails) === lastScan) {
    console.log("Same results as last time.");
    return;
  }
  lastScan = JSON.stringify(emails);

  let resetCounts = !document.querySelector("#email-frequency-keep")?.checked;
  console.log(resetCounts);
  if (!window.emailAddressCounts || resetCounts) {
    window.emailAddressCounts = {};
  }
  window.emailAddressCounts = counterAdd(window.emailAddressCounts, emails);

  let entries = Object.entries(window.emailAddressCounts).sort((a, b) => {
    let dCount = b[1] - a[1];
    if (dCount !== 0) {
      return dCount;
    }
    function domainFirst(email) {
      return email.replace(/^(.*)@([^@]+)$/, "$2: $1");
    }
    return domainFirst(a[0]).localeCompare(domainFirst(b[0]));
  });
  console.log(
    entries
      .slice(0, 10)
      .map(([email, count]) => {
        return `${count}: ${email}`;
      })
      .join("\n")
  );
  if (entries.length <= 1) {
    return;
  }

  let tbody = document.querySelector("#email-frequency-container tbody");
  if (!tbody) {
    let container = El(
      {
        tag: "div",
        id: "email-frequency-container",
        class: "TO",
        style: css`
        max-height: 30%;
        overflow-y: auto;
        padding: 10px 22px;
        margin-bottom: 13px;
        font: 0.875rem Roboto, RobotoDraft, Helvetica, Arial, sans-serif;
      `,
      },
      El(
        {
          tag: "table",
          style: css`table-layout: fixed; width: 100%;`,
        },
        El(
          { tag: "thead", class: "nU", style: "display: table-row-group;" },

          // The table's column widths come from this row.
          El(
            { tag: "tr", class: "n0" },
            El({
              tag: "td",
              style: css`width: 2ch; padding-right: 2ch;`,
            }),
            El("td")
          ),

          El(
            {
              tag: "tr",
              style: css`
                cursor: default;
              `,
              class: "aAv",
            },
            El(
              { tag: "td", colspan: 2 },
              El(
                {
                  tag: "div",
                  style: "display: flex; align-items: center; gap: 0.5ch;",
                },
                "Senders",
                El({ tag: "div", style: "flex-grow: 1" }),

                El(
                  {
                    tag: "label",
                    style:
                      "font-size: smaller;; cursor: pointer; display: inline-flex; gap: 0.5ch;",
                  },
                  El({
                    tag: "input",
                    type: "checkbox",
                    id: "email-frequency-keep",
                  }),
                  "Keep"
                ),
                El(
                  {
                    tag: "label",
                    style:
                      "font-size: smaller;; cursor: pointer; display: inline-flex; gap: 0.5ch;",
                  },
                  El({
                    tag: "input",
                    type: "checkbox",
                    id: "email-frequency-lock",
                  }),
                  "Lock"
                )
              )
            )
          )
        ),
        El({ tag: "tbody", class: "nU", style: "display: table-row-group;" })
      )
    );
    document
      .querySelector(".V3.aam")
      .insertAdjacentElement("afterend", container);
    tbody = container.querySelector("tbody");
  }
  while (tbody.firstChild) {
    tbody.firstChild.remove();
  }
  tbody.append(
    ...entries.map(([email, count]) =>
      El(
        {
          tag: "tr",
          email,
          style: css`
        cursor: pointer;
      `,
          class: "n0",
        },
        El({
          tag: "td",
          style: css`text-align: right; width: 2ch; padding-right: 2ch;`,
          children: ["" + count],
        }),
        El({
          tag: "td",
          style: css`overflow-x: hidden; text-overflow: ellipsis; white-space: nowrap;`,
          children: [email],
        })
      )
    )
  );

  return entries;
};

function watchElementForChanges(el, callback) {
  let observer = new MutationObserver(callback);
  observer.observe(el, {
    childList: true,
    subtree: true,
  });
}

async function main() {
  let container;
  while (!container) {
    container = document.querySelector(`[role="navigation"] + *`);
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  watchElementForChanges(container, scan);
  scan();
  console.log("Watching container:", container);
}

main();

console.log("Userscript loaded.");
