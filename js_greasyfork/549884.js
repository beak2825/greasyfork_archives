// ==UserScript==
// @name        Flight Rising: Better Scrying Workshop
// @namespace   https://github.com/dragonjpg
// @author      dragon.jpg
// @description based on a script by zombae (https://greasyfork.org/en/scripts/423730). adds next/previous buttons for each dropdown, the option to auto-scry on dropdown change, and a button to quickly copy a BBCode widget of the morphology image that links to its parameters. 
// @match       https://www1.flightrising.com/scrying/predict*
// @grant       none
// @version     1.0.0
// @license     MIT
// @icon        https://www.google.com/s2/favicons?sz=64&domain=flightrising.com
// @downloadURL https://update.greasyfork.org/scripts/549884/Flight%20Rising%3A%20Better%20Scrying%20Workshop.user.js
// @updateURL https://update.greasyfork.org/scripts/549884/Flight%20Rising%3A%20Better%20Scrying%20Workshop.meta.js
// ==/UserScript==

(function() {
  'use strict';

  console.log(`BETTER SCRYING WORKSHOP - a script by dragonjpg.\nbased on zombae's script "Flight Rising: Predict Morphology - Next Option + Image Code Copy"`);

  // set up some constants
  const morphologyOptionRows = document.querySelectorAll('.scry-options .common-row'), // all the rows of scry-options
    predictBtn = document.getElementById('scry-button');

  // add our css for the style to the page
  const head = document.head || document.getElementsByTagName('head')[0],
    style = document.createElement('style'),
    css = `
    .scry-options .common-column {
      display: flex;
      align-items: center;
      column-gap: 0.2rem;
    }
    .scry-options .common-column select {
      max-width: 75%;
    }
    .scry-options [data-button-type] {
      padding: 0 0.1rem !important;
      border-radius: 1px;
      display: inline-flex;
    }
    [data-button-type="down"] span {
      transform: rotate(90deg)
    }
    [data-button-type="up"] span {
      transform: rotate(-90deg)
    }
    #predict-morphology .scry-options .scry-shuffle {
      position: static;
    }
    #settings-checks {
      display: flex;
      align-content: center;
      grid-gap: 1em;
      background: var(--widget,#fff);
      padding: 0.5em;
      color: var(--text,#000);
      flex-wrap: wrap;
      box-sizing: border-box;
      border: 1px solid var(--borders, #ccc);
      border-radius: 8px;
      position: absolute;
      top: -15%;
      right: 2%;
    }
    #settings-checks label {
      display: inline-flex;
      grid-gap: 0.5em;
      align-items: center;
      cursor: pointer;
    }
    #quick-bbc-link {
      cursor: pointer;
      display: block;
      float: right;
      position: relative;
      margin-right: 3px;
    }
    #quick-bbc-link::before {
        content: '';
        height: 21px;
        width: 21px;
        position: absolute;
        z-index: 2;
        background: url('/static/layout/scryer/link.png');
        background-size: cover;
        bottom: -5px; right: -5px;
        pointer-events: none;
      }
      #quick-bbc-link::after {
        content: ''; width: 180px; height: auto; line-height: 130%;
        color: var(--text, #000); background: var(--tooltip-bg, #fff); border-radius: 10px;
        font-size: inherit; position: absolute; border:1px solid var(--borders, #888);box-shadow:rgba(0, 0, 0, 0.5) 1px 1px 6px;
        top: 100%; left: calc(50% - 100px); padding: 8px; box-sizing: border-box; z-index: 2;
      }
        #quick-bbc-link::after { display: none; content: 'Copy a BBCode Image Widget that links to these exact morphology parameters.'; }
        #quick-bbc-link:hover::after, #quick-bbc-link:focus::after { display: block; }
        #quick-bbc-link.copied-msg::after { content: 'Copied to clipboard!'; }
  `;
  head.appendChild(style);
  style.type = 'text/css';
  style.appendChild(document.createTextNode(css));

  // add options
  loadSettings();
  addWidgetButton();

  // loop over list of morphology options
  morphologyOptionRows.forEach((row) => {
    // grab the dropdown
    let selector = row.querySelector('select');

    // add event listeners for changing the dropdown by manual selection so auto-scry can still occur w/o using the buttons
    if (selector.getAttribute("name") != "breed") {
      selector.addEventListener("change",(event) => {
        if (autoScry() == true) {
          predict();
        }
      });
    } else { // breed gets a special one where we must wait for the other onchange event to finish resetting the gene lists, then it will auto-scry
      selector.addEventListener("change",(event) => {
        $.when($(selector).trigger('change')).then(function(){
          if (autoScry() == true) { predict() }
        });
      });
    }
    // add next/prev buttons to each row
    appendArrowButton( selector, false ); // up
    appendArrowButton( selector, true ); // down
  });

  // fn to create + append the buttons
  function appendArrowButton( selector, down ) {
    const arrowBtn = document.createElement('button');
    arrowBtn.innerHTML = '<span aria-hidden="true">➜</span>'; // im lazy so im just gonna use a transform to rotate a single arrow
    arrowBtn.setAttribute("aria-label", `${down ? "Next" : "Previous"} Option`);
    arrowBtn.setAttribute("data-button-type", down ? "down" : "up");

    arrowBtn.classList = "beigebutton thingbutton"; // style it like other buttons :)

    // add a click event
    arrowBtn.addEventListener("click",function (e) {
      changeDropdownValue(selector, down);
    });

    // im putting the next/prev options next to eachother on the right because i like it better
    selector.after(arrowBtn);
  }

  // select next/prev option, ignoring all disabled options
  function changeDropdownValue(selector, dir) {
    // get the direction, down or up
    const direction = dir ? 1 : -1;

    // grab the non-disabled options from the dropdown
    const collectionArr = Array
    .from(selector.options)
    .reduce((arr, opt, idx) => {
      if (!opt.disabled) arr.push(idx);
      return arr;
    }, []);

    // current pos & length of array
    const pos = collectionArr.indexOf(selector.selectedIndex);
    const length = collectionArr.length;

    // calculate next position
    const nextPos = (pos + direction + length) % length;

    // set selected index to new index
    selector.selectedIndex = collectionArr[nextPos];

    // use jquery to trigger the onchange event, because it won't reset genes properly if we don't when switching between breeds
    $.when($(selector).trigger('change')).then(function(){
      if (autoScry() == true) { predict() }
    });

  }

  function autoScry() {
    // get whether or not the auto scry box is checked
    return document.querySelector("#scryOnChange").parentNode.getAttribute("data-selected");
  }

  // load saved settings
  function loadSettings() {

    const settings = document.createElement('div'),
          setlist = [];
    settings.id = "settings-checks";

    setlist.push(createCheck('scryOnChange', 'Scry On Change', false));
    setlist.push(createCheck('growUp', 'Adult On Load', true));

    setlist.forEach(setting => {
      settings.appendChild(setting)
    })
    // put after predict btn
    predictBtn.after(settings);
  }

  // create checkbox el
  function createCheck( name, label, apply_on_load ) {
    let itemContainer = document.createElement('div'),
      getSavedVal = localStorage.getItem( name );

    itemContainer.innerHTML = `<label for="${name}"><span class="common-checkbox" data-selected="0"><input type="checkbox" id="${name}" name="${name}" /></span><span>${label}</span>`;

    let checkboxInput = itemContainer.querySelector("input");
    checkboxInput.checked = (getSavedVal == 'true' ) ? true : false;
    isChecked(checkboxInput);
    checkboxInput.addEventListener('click', (event) => { updateSetting(event); isChecked(checkboxInput);  });

    if (apply_on_load) {
      applySetting( name, getSavedVal );
    }

    return itemContainer;
  }

  // using logic of hoard setting checkboxes
  function isChecked(checkbox) {
    if (checkbox.checked) {
      checkbox.parentNode.setAttribute("data-selected",1)
    } else {
      checkbox.parentNode.setAttribute("data-selected",0)
    }
  }

  // apply setting logic if true
  function applySetting( name, returnVal ) {
    if ( name == 'growUp' && returnVal == 'true' ) {
      let ageVal = document.querySelector('select[name="age"]');
      if (ageVal.selectedIndex == 1 ) { ageVal.selectedIndex = 0 }
    }
  }

  // store
  function updateSetting( e ) {
    localStorage.setItem( e.target.name, e.target.checked );
  }

  // trigger predict
  function predict() {
    predictBtn.click();
  }

  // including my quick copy morphology widget directly in this script
  function addWidgetButton() {
    const quickButton = document.createElement("div");
    quickButton.id = "quick-bbc-link";
    quickButton.setAttribute("role","button");
    quickButton.setAttribute("tabindex","0");
    quickButton.innerHTML = `<img src="/static/layout/scryer/image.png" alt="Copy a BBCode Image Widget that links to these exact morphology parameters.">`;

    // add the new button after the morphology image copy button, which means it'll be the leftmost button
    document.querySelector("#morphology-image-link-tooltip").after(quickButton);

    // click event
    quickButton.addEventListener("click",function (e) {
        // get the info we need from the other two buttons + the alt text from the dragon image itself
        var url = document.querySelector("#morphology-link").getAttribute("href");
        var image = document.querySelector("#morphology-image-link").getAttribute("href");
        var alt = document.querySelector("#dragon-image img").getAttribute("alt");

        var bbcode = `[url=${url}][img alt="${alt}"]${image}[/img][/url]`;

        // copy the string to the clipboard using FR's existing function that the two original buttons use ;)
        if (frCopyToClipboard(bbcode)) {
            e.preventDefault();
            this.classList.add("copied-msg");
        }
    });
    // tab navigation support
    quickButton.addEventListener("keyup",function (e) {
      if (e.key === "Enter") {
        // get the info we need from the other two buttons + the alt text from the dragon image itself
        var url = document.querySelector("#morphology-link").getAttribute("href");
        var image = document.querySelector("#morphology-image-link").getAttribute("href");
        var alt = document.querySelector("#dragon-image img").getAttribute("alt");

        var bbcode = `[url=${url}][img alt="${alt}"]${image}[/img][/url]`;

        // copy the string to the clipboard using FR's existing function that the two original buttons use ;)
        if (frCopyToClipboard(bbcode)) {
          e.preventDefault();
          this.classList.add("copied-msg");
          this.focus();
        }
      }
    });
    // remove text when mousing out or focusing elsewhere w/ tab
    ['mouseleave', 'mouseenter', 'focusout'].forEach(function(event) {
      quickButton.addEventListener(event,function (e) {
        this.classList.remove("copied-msg");
        this.blur();
      });
    });
  }

})();

