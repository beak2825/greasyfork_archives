// ==UserScript==
// @name         Mamreader Plus
// @namespace    https://github.com/prateek-who/Mamreader-plus
// @version      0.9.1
// @description  Adds buttons on Goodreads pages to search authors/books/series on MAM
// @author       prateek-who
// @match        *://www.goodreads.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551053/Mamreader%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/551053/Mamreader%20Plus.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function addMamButtonToBookPage() {
    if (document.querySelector(".mam-book-page-button")) {
      console.log("[G+] Book page button already exists. Halting.");
      return;
    }
    console.log("[G+] Book page detected! Running script...");
    const bookTitle = document.querySelector('[data-testid="bookTitle"]')?.innerText;
    const authorNameElement = document.querySelector('[data-testid="name"]');
    const authorName = authorNameElement?.innerText;
    if (!bookTitle || !authorName) {
      console.error("[G+] Could not find title or author elements.");
      return;
    }
    const encodedQuery = encodeURIComponent(`${bookTitle} ${authorName}`);
    const mamSearchUrl = `https://www.myanonamouse.net/tor/browse.php?tor[text]=${encodedQuery}`;
    const buttonContainer = document.querySelector(".BookActions");
    if (!buttonContainer) {
      console.error("[G+] Could not find a container to add the button to.");
      return;
    }
    const buttonToClone = buttonContainer.querySelector("button");
    if (!buttonToClone) {
      console.error("[G+] Could not find a button to clone for styling.");
      return;
    }
    const mamButton = buttonToClone.cloneNode(true);
    mamButton.id = "mam-search-button-single";
    mamButton.innerText = "Search MAM";
    mamButton.onclick = () => window.open(mamSearchUrl, "_blank");
    Object.assign(mamButton.style, {
      marginTop: "8px",
      marginBottom: "8px",
      backgroundColor: "#ebc210",
      color: "black",
      borderColor: "#ebc210"
    });
    const icon = document.createElement("img");
    icon.src = "https://i.postimg.cc/nzMcQpSF/my-Anona-Mouse-logo.png";
    icon.alt = "icon";
    icon.style.width = "22px";
    icon.style.height = "22px";
    icon.style.marginRight = "12px";
    icon.style.verticalAlign = "middle";
    mamButton.prepend(icon);
    const originalColor = "#ebc210";
    const hoverColor = "#fbd011";
    icon.style.transition = "all 0.2s ease-in-out";
    mamButton.addEventListener("mouseenter", () => {
      mamButton.style.backgroundColor = hoverColor;
      icon.style.filter = "brightness(1.1)";
    });
    mamButton.addEventListener("mouseleave", () => {
      mamButton.style.backgroundColor = originalColor;
      icon.style.filter = "brightness(1)";
    });
    const wantToReadButtonContainer = buttonContainer.querySelector(
      ".BookActions__button"
    );
    if (wantToReadButtonContainer) {
      wantToReadButtonContainer.insertAdjacentElement("afterend", mamButton);
    } else {
      buttonContainer.appendChild(mamButton);
    }
    console.log("[G+] 'Search MAM' button added!");
    console.log("we are getting to adding the author follo button part..");
    const encodedAuthorQuery = encodeURIComponent(authorName);
    const mamAuthorSearchUrl = `https://www.myanonamouse.net/tor/browse.php?tor[text]=${encodedAuthorQuery}`;
    const followButtonContainer = document.querySelector(".AuthorFollowButton");
    if (!followButtonContainer) {
      console.log("[G+] Could not find follow button container for author search.");
      return;
    }
    const parentContainer = followButtonContainer.parentElement;
    if (!parentContainer) {
      console.log("[G+] Could not find parent container.");
      return;
    }
    parentContainer.style.display = "flex";
    parentContainer.style.alignItems = "center";
    parentContainer.style.gap = "8px";
    const authorButton = buttonToClone.cloneNode(true);
    authorButton.classList.add("mam-author-search-button");
    authorButton.innerText = "Search Author";
    authorButton.onclick = () => window.open(mamAuthorSearchUrl, "_blank");
    Object.assign(authorButton.style, {
      backgroundColor: "#ebc210",
      color: "black",
      borderColor: "#ebc210",
      whiteSpace: "normal",
      lineHeight: "1.1"
    });
    const authorIcon = document.createElement("img");
    authorIcon.src = "https://i.postimg.cc/nzMcQpSF/my-Anona-Mouse-logo.png";
    authorIcon.alt = "icon";
    authorIcon.style.width = "22px";
    authorIcon.style.height = "22px";
    authorIcon.style.marginRight = "12px";
    authorIcon.style.verticalAlign = "middle";
    authorButton.prepend(authorIcon);
    authorIcon.style.transition = "all 0.2s ease-in-out";
    authorButton.addEventListener("mouseenter", () => {
      authorButton.style.backgroundColor = hoverColor;
      authorIcon.style.filter = "brightness(1.1)";
    });
    authorButton.addEventListener("mouseleave", () => {
      authorButton.style.backgroundColor = originalColor;
      authorIcon.style.filter = "brightness(1)";
    });
    parentContainer.insertBefore(authorButton, followButtonContainer);
    console.log("[G+] 'Search Author' button added!");
  }

  function addMamButtonsToSeriesPage() {
    if (document.querySelector(".mam-search-button-series")) {
      console.log("[G+] Series buttons already added. Halting.");
      return;
    }
    console.log("[G+] Series page detected! Running script...");
    const allBooks = document.querySelectorAll(".responsiveBook");
    console.log(`[G+] Found ${allBooks.length} books on the page.`);
    for (const bookElement of allBooks) {
      try {
        const title = bookElement.querySelector('[itemprop="name"]')?.innerText ?? "";
        const author = bookElement.querySelector('[itemprop="author"] [itemprop="name"]')?.innerText ?? "";
        const actionsContainer = bookElement.querySelector(".objectLockupContent__actions");
        const buttonToClone = actionsContainer?.querySelector(".wantToReadButton button");
        if (title && author && actionsContainer && buttonToClone) {
          const encodedQuery = encodeURIComponent(`${title} ${author}`);
          const mamSearchUrl = `https://www.myanonamouse.net/tor/browse.php?tor[text]=${encodedQuery}`;
          const mamButton = buttonToClone.cloneNode(false);
          mamButton.innerText = "Search MAM";
          mamButton.className = " mam-search-button-series";
          Object.assign(mamButton.style, {
            marginTop: "4px",
            marginLeft: "8px",
            paddingTop: "2px",
            paddingLeft: "8px",
            paddingRight: "8px",
            backgroundColor: "#ebc210",
            color: "black",
            borderRadius: "0.25rem",
            border: "none",
            fontFamily: '"Lato", "Helvetica Neue", "Helvetica", sans-serif',
            fontSize: "14px",
            lineHeight: "1",
            height: "31px",
            width: "150px",
            cursor: "pointer"
          });
          const icon = document.createElement("img");
          icon.src = "https://i.postimg.cc/nzMcQpSF/my-Anona-Mouse-logo.png";
          icon.alt = "icon";
          icon.style.width = "16px";
          icon.style.height = "16px";
          icon.style.marginRight = "8px";
          icon.style.verticalAlign = "middle";
          mamButton.prepend(icon);
          const originalColor = "#ebc210";
          const hoverColor = "#d1a80e";
          mamButton.addEventListener("mouseenter", () => {
            mamButton.style.backgroundColor = hoverColor;
            icon.style.filter = "brightness(0.87)";
          });
          mamButton.addEventListener("mouseleave", () => {
            mamButton.style.backgroundColor = originalColor;
            icon.style.filter = "brightness(1)";
          });
          mamButton.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            window.open(mamSearchUrl, "_blank");
          };
          actionsContainer.appendChild(mamButton);
        }
      } catch (e) {
        console.error("Could not process a book entry, skipping.", bookElement);
      }
    }
    console.log("[G+] Finished adding series buttons!");
  }

  function addMamButtonToAuthorPage() {
    const addMainAuthorButton = () => {
      if (document.querySelector(".mam-search-button-author")) {
        console.log("[G+] Author button already added. Halting.");
        return;
      }
      const authorNameElem = document.querySelector("h1.authorName");
      if (!authorNameElem) return;
      const authorName = authorNameElem.innerText.trim();
      const mamSearchUrl = `https://www.myanonamouse.net/tor/browse.php?tor[text]=${encodeURIComponent(authorName)}`;
      const mamButton = document.createElement("button");
      mamButton.innerText = "Search Author";
      mamButton.className = "mam-search-button-author";
      Object.assign(mamButton.style, {
        padding: "8px 12px",
        backgroundColor: "#ebc210",
        color: "black",
        borderColor: "black",
        marginTop: "8px",
        borderRadius: "3px",
        border: "1px solid #969696ff",
        boxSizing: "border-box",
        display: "inline-block",
        fontFamily: '"Lato", "Helvetica Neue", "Helvetica", sans-serif',
        fontSize: "14px",
        height: "32px",
        width: "140px",
        lineHeight: "1",
        cursor: "pointer"
      });
      const icon = document.createElement("img");
      icon.src = "https://i.postimg.cc/nzMcQpSF/my-Anona-Mouse-logo.png";
      icon.alt = "icon";
      icon.className = "mam-icon";
      Object.assign(icon.style, {
        width: "16px",
        height: "16px",
        marginRight: "8px",
        verticalAlign: "middle"
      });
      mamButton.prepend(icon);
      mamButton.addEventListener("mouseenter", () => {
        mamButton.style.backgroundColor = "#d1a80e";
        icon.style.filter = "brightness(0.87)";
      });
      mamButton.addEventListener("mouseleave", () => {
        mamButton.style.backgroundColor = "#ebc210";
        icon.style.filter = "brightness(1)";
      });
      mamButton.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        window.open(mamSearchUrl, "_blank");
      };
      const followButtonContainer = document.querySelector(".authorFollowButtonContainer");
      if (followButtonContainer) {
        followButtonContainer.appendChild(mamButton);
      } else {
        authorNameElem.insertAdjacentElement("afterend", mamButton);
      }
      console.log("[G+] 'Search Author' button added!");
    };
    const addBookButtons = () => {
      if (!document.getElementById("mam-styles")) {
        const styles = `
        html.desktop .wtrButtonContainer {
          height: 80px !important;
          width: 140px !important;
        }

        .wtrButtonContainer .wtrUp {
          text-align: center;
          margin-top: 0px !important;
          padding: 0 !important;
          height: 20px !important;
        }

        .wtrToRead, .wtrExclusiveShelf, .wtrShelfButton {
          display: flex !important;
          justify-content: center !important;
          align-items: center !important;

          margin-top: 0px !important;
          height: 18px !important;
          line-height: 18px !important; 
          padding: 0 !important;
          padding-bottom: 0 !important;
          font-size: 11px !important;
          text-align: center;
        }

        .wtrButtonContainer .ratingStars {
          margin-top: 0px !important;
        }

        .mam-search-button {
          background-color: #ebc210;
          border: 1px solid #969696ff;
          border-radius: 3px;
          box-sizing: border-box;
          color: black;
          cursor: pointer;
          display: block;
          font-family: "Lato", "Helvetica Neue", "Helvetica", sans-serif;
          font-size: 11px;
          font-weight: bold;
          height: 20px;
          line-height: 18px;
          margin-top: 0px;
          padding: 0 12px;
          text-align: center;
          width: 100%;
          text-decoration: none;
        }

        .mam-search-button:hover {
          background-color: #d1a80e;
        }
    `;
        const styleSheet = document.createElement("style");
        styleSheet.id = "mam-styles";
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);
      }
      const allBooks = document.querySelectorAll(
        'tr[itemscope][itemtype="http://schema.org/Book"]'
      );
      for (const bookRow of allBooks) {
        try {
          const mainButtonContainer = bookRow.querySelector(
            ".wtrButtonContainer"
          );
          if (!mainButtonContainer) continue;
          if (mainButtonContainer.querySelector(".mam-search-button")) continue;
          const title = bookRow.querySelector('a.bookTitle span[itemprop="name"]')?.innerText.trim();
          const author = bookRow.querySelector('a.authorName span[itemprop="name"]')?.innerText.trim();
          if (!title || !author) continue;
          const encodedQuery = encodeURIComponent(`${title} ${author}`);
          const mamSearchUrl = `https://www.myanonamouse.net/tor/browse.php?tor[text]=${encodedQuery}`;
          const mamButton = document.createElement("button");
          mamButton.className = "mam-search-button";
          mamButton.innerText = "Search MAM";
          const icon = document.createElement("img");
          icon.src = "https://i.postimg.cc/nzMcQpSF/my-Anona-Mouse-logo.png";
          icon.alt = "icon";
          icon.style.width = "10px";
          icon.style.height = "10px";
          icon.style.lineHeight = "10px";
          icon.style.marginRight = "8px";
          icon.style.verticalAlign = "middle";
          mamButton.prepend(icon);
          mamButton.addEventListener("mouseenter", () => {
            icon.style.filter = "brightness(0.87)";
          });
          mamButton.addEventListener("mouseleave", () => {
            icon.style.filter = "brightness(1)";
          });
          mamButton.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            window.open(mamSearchUrl, "_blank");
          };
          const ratingDiv = mainButtonContainer.querySelector(".ratingStars");
          if (ratingDiv) {
            ratingDiv.insertAdjacentElement("afterend", mamButton);
          } else {
            mainButtonContainer.appendChild(mamButton);
          }
        } catch (e) {
          console.error("Could not process a book row, skipping.", { bookRow, e });
        }
      }
    };
    addMainAuthorButton();
    addBookButtons();
    console.log("[G+] Finished adding author page buttons!");
  }

  let currentPage = "";
  function runCheck() {
    const path = window.location.pathname;
    if (currentPage === path) return;
    if (path.includes("/book/show/") && document.querySelector('[data-testid="bookTitle"]')) {
      currentPage = path;
      addMamButtonToBookPage();
    } else if (path.includes("/series/") && document.querySelector(".responsiveSeriesHeader__title")) {
      currentPage = path;
      addMamButtonsToSeriesPage();
    } else if (path.includes("/author/show/") && document.querySelector("h1.authorName")) {
      currentPage = path;
      addMamButtonToAuthorPage();
    } else {
      currentPage = "";
    }
  }
  const observer = new MutationObserver(runCheck);
  observer.observe(document.body, { childList: true, subtree: true });
  runCheck();

})();
