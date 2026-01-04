// ==UserScript==
// @name         Pillowfort Saved Tags
// @namespace    pillowfort
// @version      1.4
// @description  Save tags or groups of tags to reuse easily on Pillowfort. Inspired by XKit Rewritten's Quick Tags feature.
// @author       verersatz
// @match        https://www.pillowfort.social/*
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/551087/Pillowfort%20Saved%20Tags.user.js
// @updateURL https://update.greasyfork.org/scripts/551087/Pillowfort%20Saved%20Tags.meta.js
// ==/UserScript==

// create the saved tags button on the reblog modal
function createTagButton() {
    const tagButton = document.createElement('div');
    tagButton.classList.add("tag-button");
    tagButton.innerHTML = '<p class="tag-icon">&#127991;</p>';
    document.querySelector("div.submit-post-bkd div#publish-options-container").appendChild(tagButton);
};

// create the list of saved tags
function tagsList() {
    const tagSelect = document.createElement('div');
    tagSelect.classList.add('tag-select');
    tagSelect.innerHTML = '<ul></ul><p class="add-new">New + </p>';
    document.querySelector('div.tag-button').insertAdjacentElement('beforebegin', tagSelect);
};

// populate tags from localStorage
function displayTags() {
    const list = document.querySelector(".tag-select ul");
    list.innerHTML = "";
    for(var i = 0; i < localStorage.length; i++) {
         if(!localStorage.key(i).startsWith("tassel")) { // exclude in case user has tassel installed
             let li = document.createElement("li");
             li.textContent = localStorage.key(i);
             list.appendChild(li);
             let del = document.createElement("p");
             del.classList.add("delete-tags");
             del.setAttribute("data-group", li.textContent);
             del.textContent = "X";
             list.appendChild(del);
         }
    };
};

// insert tags on user click
function insertTags(name) {
    let tags = localStorage.getItem(name);
    const tagField = document.querySelector("input#tags");
    if(tagField.value == "") {
        tagField.value = tags;
    }
    else {
        tags = ", " + tags;
        tagField.value += tags;
    }
}

// create user input fields
function newEntry() {
    const userInput = document.createElement('div');
    userInput.classList.add('new-tag-form');
    userInput.innerHTML = `
    <form>
    <input type="text" id="tags-title" value="" placeholder="Tag group name"/>
    <p id="title-error" popover>Name already exists</p>
    <input type="text" id="new" value="" placeholder="Tag 1, Tag 2, Tag 3"/>
    <label for="new">+</label>
    <p id="tags-saved" popover>Saved!</p>
    </form>
    `;
    return userInput
};

// save new tag group
function saveNew() {
    const inputTitle = document.querySelector("input#tags-title").value;
    const inputTags = document.querySelector("input#new").value;
    if(inputTitle != "" && inputTags != "") {
        if(!localStorage.getItem(inputTitle)) {
               localStorage.setItem(inputTitle, inputTags);
               let popover = document.querySelector("#tags-saved");
               popover.showPopover();
               displayTags();
               setTimeout(() => {
                  popover.hidePopover();
               }, 2000);
               document.querySelector(".new-tag-form form").reset();
        }
        else {
           let popover = document.querySelector("#title-error");
           popover.showPopover();
        }
    }
}

// add CSS styles
function addStyle() {
    const style = document.createElement("style");
    style.innerHTML = `
        div.tag-button {
            display: inline;
        }
       .tag-icon {
            cursor: pointer;
            display: inline;
            margin-left: 20px;
            position: absolute;
            color: white;
            transform: rotate(130deg);
            font-size: 2.5em;
            font-weight: bold;
        }
        div.tag-select {
            display: none;
            bottom: 130%;
            position: absolute;
            right: -30%;
            max-width: 100%;
            color: white;
        }
         div.tag-select ul {
             display: inline;
             list-style-type: none;
        }
         div.tag-select ul li {
            background: #232b40;
            border: 1px solid gray;
            padding: 8px;
        }
        body.dark-theme div.tag-select ul li {
            background: #010102;
        }
         p.add-new {
            border: solid 1px gray;
            padding: 10px;
            background: #4a5677;
        }
        body.dark-theme p.add-new {
            background: #38383c;
        }
        .new-tag-form input {
            margin: 0;
            border: 1px solid #515151 !important;
            color: black;
        }
        body.dark-theme .new-tag-form input {
            color: white;
       }
       .new-tag-form form label {
            position: absolute;
            width: unset;
            margin-left: 10px;
            font-size: 1.3em;
            background: #232b40;
            padding: 5px;
            border: 1px solid gray;
        }
        body.dark-theme .new-tag-form form label {
            background: #010102;
        }
       #title-error {
            inset: unset;
            bottom: 105px;
            right: 940px;
            border-radius: 10px;
            padding: 6px;
        }
        #title-error::after {
            content: "\u{1F782}";
            position: relative;
            top: 50%;
            right: 0;
            transform: translateY(-50%);
            padding-left: 20px;
            font-size: 1.8rem;
            vertical-align: middle;
        }
        #tags-saved {
            inset: unset;
            bottom: 15%;
            right: 40%;
            padding: 10px;
            border-radius: 10px;
            background: #7ddb7d;
        }
        .delete-tags {
            position: absolute;
            right: -30px;
            margin-top: -30px;
            padding: 5px;
            font-size: 1rem;
            background: #9d5a5a;
            border-radius: 5px;
            border: 1px solid gray;
        }

        @media screen and (max-width: 768px) {
            .delete-tags {right:-10%;}
            .new-tag-form form label {margin-top:10px; margin-left:-10px;}
        }
     `;
    document.head.appendChild(style);
};

    // execute on page load, mostly event handling
window.addEventListener("load", (event) => {
    // click handling
    document.addEventListener("click", function(e) {
        if(e.target.nodeName == 'P' && e.target.classList.contains('delete-tags')) {
           if(confirm("Delete tag group?")) {
               localStorage.removeItem(e.target.getAttribute('data-group')); // delete tag group from local storage and redisplay on user click
               displayTags();
           }
       } else if (document.querySelector(".tag-select") && document.querySelector(".tag-select").contains(e.target)) { // if user clicks tag select menu, handle click
           if(document.querySelector("p.add-new") && document.querySelector("p.add-new").contains(e.target)) {
                   document.querySelector("p.add-new").replaceWith(newEntry()); // replace New + with user input fields
               } else if(document.querySelector(".new-tag-form label") && document.querySelector(".new-tag-form label").contains(e.target)) {
                   saveNew(); // save new tag group
               } else if(document.querySelector(".tag-select ul") && document.querySelector(".tag-select ul").contains(e.target)) {
                   if(!e.target.classList.contains("delete-tags")) {
                   insertTags(e.target.innerText); // click on existing tag group triggers insert
               }}
      } else if(document.querySelector('p.tag-icon') && document.querySelector('p.tag-icon').contains(e.target)) {
           let div = document.querySelector("div.tag-select");
           let divDisplay = getComputedStyle(div).display;
           if (divDisplay == "none") {div.style.display = "block";} // toggle the saved tags list on icon click
           else {div.style.display = "none";};
       }
 })
       // when the reblog modal opens, check if tag button exists and if not run setup functions
       const reblogModal = document.querySelector("div#reblog-modal");
       const reblogObserve = new ResizeObserver(entries => {
           for (const entry of entries) {
               if(!entry.contentRect.width == 0 && !document.querySelector(".tag-button")) {
                   createTagButton();
                   tagsList();
                   displayTags();
               }
           }});
       reblogObserve.observe(reblogModal);
      //change form fields back to New + button when the menu is dismissed
      if(document.querySelector("div.tag-select")) {
          const observer = new ResizeObserver(entries => {
           if(document.querySelector(".new-tag-form")) {
               const tagForm = document.querySelector(".new-tag-form");
               for (const entry of entries) {
                   if (entry.contentRect.width == 0) {tagForm.replaceWith(document.querySelector("p.add-new"));}
               }
           };
       });
       observer.observe(document.querySelector("div.tag-select"));
  }
  addStyle();
});