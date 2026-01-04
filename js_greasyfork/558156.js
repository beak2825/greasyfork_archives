// ==UserScript==
// @name        Ironwood RPG - Market Helper
// @namespace   Violentmonkey Scripts
// @match       https://ironwoodrpg.com/*
// @grant       none
// @version     1.1.1
// @author      Cascade
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ironwoodrpg.com
// @require      https://code.jquery.com/jquery-3.6.4.min.js
// @license MIT
// @description Adds undercut, overbid, and match buttons into price editing.
// @downloadURL https://update.greasyfork.org/scripts/558156/Ironwood%20RPG%20-%20Market%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/558156/Ironwood%20RPG%20-%20Market%20Helper.meta.js
// ==/UserScript==

//oh my god this script is trash
//no fr this is garbage

// FIREFOX FIX; REMOVED NAVIGATION API
setInterval(() => {
  if (location.href.includes('market')) {
    // wait a bit for the page to settle, then init
    waitTillLoad(150).then(() => waitTillLoad(50).then(init));
  }
}, 300);


setInterval(() => {
      if (window.location.href.indexOf("market") != -1){
        waitTillLoad(50).then(() => {init();});
      }
}, 1000);

function init(){
    let tabsRoot = document.querySelectorAll('div.tabs')[0];
    if(!tabsRoot) return;
    if(!tabsRoot.children[2]) return;
    if(!tabsRoot.children[2].classList.contains('tab-active')) return;

    waitTillLoad(50).then(() => {
          //let root = document.querySelectorAll("div.sticky.ng-star-inserted")[0];
          let root = document.querySelectorAll("market-listings-component")[0];

          if(!root) {return;}
          let preview = root.querySelectorAll("div.no-preview")[0];
          if(!preview){
            onSelectItem('');
          }
          if(!root || !preview) return;
          onElementRemoved(preview, onSelectItem);
    });
}

function onSelectItem(idk){
    let yespreview = document.querySelectorAll("div.preview")[0];
    if(!yespreview) return;
    let buttons = yespreview.querySelectorAll("div.buttons")[0];
    let editButton = buttons.children[0];
  //console.log(editButton)
    onElementTextContentChange(yespreview.querySelectorAll("div.name")[0], onSelectItem);
  if (!editButton || !editButton.textContent.includes("Edit")) return;
    editButton.removeEventListener('click', onEditPrice);
    editButton.addEventListener('click', onEditPrice);
}

var marketPriceNode;
var minPriceNode;
var eachNodeGroup;
function findAtt(){
    for (let i = 0, atts = $('header-component')[0].attributes, n = atts.length, arr = []; i < n; i++){
      if(atts[i].nodeName.includes('_ngcontent-')){
        return atts[i].nodeName;
        break;
      }
    }

}
window['callonEditPrice'] = function(){onEditPrice()}
function onEditPrice(){
    //let listingsBtn = $('div.tabs').find('button:contains("Listings")');
    //if(listingsBtn.length > 0 && listingsBtn[0].classList.contains('tab-active')) {} else {return};
    //let isMobile = !($('div.tabs').find('button:contains("Listings")').length > 0);


    //let modal = document.querySelectorAll("div.modal.route-nav")[0] // need to get the one that contains "Submit"
    // this is very cooked (should work with mobile though)
    let modal = $('div.modal.route-nav').filter((_, el) =>
      $(el).find('button[type="submit"].action').filter((_, b) => $(b).text().trim() === 'Submit').length > 0
    ).get(0);
    let editRoot = modal.querySelectorAll("div.preview")[0];

    console.log("onEditPrice editRoot ", editRoot)
    let ordering = editRoot.children[1].children[0].textContent.includes('uying');
    if(ordering){
      marketPriceNode = editRoot.children[2].childNodes[1];
      minPriceNode = editRoot.children[3].childNodes[1];
      eachNodeGroup = editRoot.children[4];
    }
    else {
      marketPriceNode = editRoot.children[3].childNodes[1];
      minPriceNode = editRoot.children[2].childNodes[1];
      eachNodeGroup = editRoot.children[4];
    }

    if(eachNodeGroup.querySelectorAll('button#mhBtn').length > 0) return;
    let undercutBtn = document.createElement('button');
    let matchBtn = document.createElement('button');
    eachNodeGroup.insertBefore(matchBtn, eachNodeGroup.children[1]);
    eachNodeGroup.insertBefore(undercutBtn, matchBtn);

    for (let i = 0, atts = eachNodeGroup.attributes, n = atts.length, arr = []; i < n; i++){
      if(atts[i].nodeName.includes('_ngcontent-')){
        undercutBtn.toggleAttribute(atts[i].nodeName);
        matchBtn.toggleAttribute(atts[i].nodeName);
        break;
      }
    }
    undercutBtn.setAttribute('class', 'myButton');
    matchBtn.setAttribute('class', 'myButton');
    undercutBtn.style = 'padding-left: 7px !important; padding-right: 7px !important;';
    matchBtn.style = 'padding-left: 7px !important; padding-right: 7px !important;';
    if(ordering)
      undercutBtn.textContent = "Override";
    else undercutBtn.textContent = "Undercut";
    matchBtn.textContent = "Match";
    undercutBtn.id = "utBtn";
    matchBtn.id = "mhBtn"

    if(!ordering && getMinPrice(ordering) == getMarketPrice(ordering)){
      undercutBtn.style = "display: none;";
    }
    else undercutBtn.disabled = false;
    matchBtn.disabled = false;
    matchBtn.removeEventListener('click', match);
    undercutBtn.removeEventListener('click', undercut);
    undercutBtn.removeEventListener('click', overbid);
    console.log(ordering + ' ordering')

    if(ordering)
      undercutBtn.addEventListener('click', overbid);
    else undercutBtn.addEventListener('click', undercut);
    matchBtn.addEventListener('click', match);
}
//credit pancake for function
function findPrice(name) {
    let v=$(`.modal .row:not(.item-description):contains("${name}")`).text();
    console.log('found price ' + v && v.length > 0 ? v :"error on " + name + " 0")
    return  v && v.length > 0 ? v :"error 0";
}
// function findMinPrice(){
//   let v = findPrice("Min & Max Price");
//   if(!v.includes("error")){
//     return v.split("–")[0].trim()
//   }
//   else return "error 0"
// }
function num(priceString) {
    let regex = /([\d,.]+)([kmbKMB])?/;
    let match = priceString.match(regex);

    if (!match) {
        throw new Error("Invalid price string format");
    }

    let numberPart = match[1]; // e.g., "103.2"
    let suffix = match[2] ? match[2].toLowerCase() : ''; // e.g., "k" (converted to lowercase)

    let numericValue = parseFloat(numberPart.replace(/[,]/g, ''));

    switch (suffix) {
        case 'k':
            numericValue *= 1_000;
            break;
        case 'm':
            numericValue *= 1_000_000;
            break;
        case 'b':
            numericValue *= 1_000_000_000;
            break;
    }

    return numericValue;
}

// unused now
function getMinPrice(ordering){
  //return num(findMinPrice());
  return 0;
}
function getMarketPrice(ordering){
  return num(findPrice(ordering ? 'Market Highest' : 'Market Lowest'));
}

function match (idk){
   let val = getMarketPrice(true);
    if(!(val && val != undefined)) val = getMarketPrice(false)
  let field = eachNodeGroup.querySelectorAll("input")[0];
  field.value = (val) + "";
  field.dispatchEvent(new Event("input", { bubbles: true }));
}

function undercut (idk, ordering){
  let field = eachNodeGroup.querySelectorAll("input")[0];
  field.value = (getMarketPrice(ordering) - 1) + "";
  field.dispatchEvent(new Event("input", { bubbles: true }));
}

function overbid (idk, ordering){
  let field = eachNodeGroup.querySelectorAll("input")[0];
  field.value = (getMarketPrice(true) + 1) + "";
  field.dispatchEvent(new Event("input", { bubbles: true }));
}

var removedMutationObserver;
function onElementRemoved(element, callback) {
  removedMutationObserver = new MutationObserver(function(mutations) {
    if(!document.body.contains(element)) {
      callback();
    }
  });
  removedMutationObserver.observe(element.parentElement, {childList: true});
}


var changeMutationObserver;
function onElementTextContentChange(element, callback){
    // Create a MutationObserver instance and specify the callback
    const observer = new MutationObserver((mutationsList) => {
        for (let mutation of mutationsList) {
            if (mutation.type === 'characterData') {
                callback();
                observer.disconnect();
            }
        }
    });

    // Configuration of the observer:
    const config = {
        childList: true,
        subtree: true,
        characterData: true
    };

    // Start observing the target node for configured mutations
    observer.observe(element, config);
}

function waitTillLoad(delay) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, delay);
  });
}
function sleep(ms) {return new Promise(resolve => setTimeout(resolve, ms))}
//ty Pancake for base of this function
//from here
async function addPriceButtons(type) {
    console.log(type)
    await sleep(50);

    const priceRowInput = $(await elementWatcherExists('.modal input[placeholder="Price"]', 300));
    const priceRowButtonsContainer = $('#market-component-price-buttons');

    const buttonsContainer = $('<div/>')
    .attr('id', 'market-component-price-buttons');

    if($('div.modal').find('span:contains("Each")').closest('div')[0].querySelector('#utBtn')) return;

    let undercutBtn = document.createElement('button');
    buttonsContainer.append(undercutBtn);

    undercutBtn.toggleAttribute(findAtt());

    undercutBtn.setAttribute('class', 'myButton');

    undercutBtn.style = 'padding-left: 7px !important; padding-right: 7px !important;';
    if(type === 'order')
        undercutBtn.textContent = "Override";
    else undercutBtn.textContent = "Undercut";
    undercutBtn.id = "utBtn";



    if(type === 'sell' && getMinPrice(type === 'order') == getMarketPrice(type === 'order')){
        undercutBtn.style = "display: none;";
    }
    else undercutBtn.disabled = false;
    eachNodeGroup = $('div.modal').find('span:contains("Each")').closest('div')[0];
    undercutBtn.removeEventListener('click', undercut);
    undercutBtn.removeEventListener('click', overbid);

    if(type === 'order')
        undercutBtn.addEventListener('click', overbid);
    else undercutBtn.addEventListener('click', undercut);

    $(priceRowInput).before(buttonsContainer);
}
$(document).on('click', 'market-list-component .search ~ button.row', () => addPriceButtons('sell'));
$(document).on('click', 'market-order-component .search ~ button.row', () => addPriceButtons('order'));

async function elementWatcherExists(selector, delay = 10, timeout = 5000, inverted = false) {
    const promiseWrapper = new Checking(() => {
        let result = $(selector)[0];
        return inverted ? !result : result;
    }, delay, timeout, `elementWatcher - exists - ${selector}`);
    return promiseWrapper;
}
    class Deferred {
        #name;
        #promise;
        resolve;
        reject;
        constructor(name) {
            this.#name = name;
            this.#promise = new Promise((resolve, reject) => {
                this.resolve = resolve;
                this.reject = reject;
            }).then(result => {
                return result;
            }).catch(error => {
                if(error) {
                    console.warn(error);
                    logService.error(`error in ${this.constructor.name} (${this.#name})`, error);
                }
                throw error;
            });
        }

        then() {
            this.#promise.then.apply(this.#promise, arguments);
            return this;
        }

        catch() {
            this.#promise.catch.apply(this.#promise, arguments);
            return this;
        }

        finally() {
            this.#promise.finally.apply(this.#promise, arguments);
            return this;
        }
    }
    class Expiring extends Deferred {
        constructor(timeout, name) {
            super(name);
            if(timeout <= 0) {
                return;
            }
            const timeoutReference = window.setTimeout(() => {
                this.reject(`Timed out after ${timeout} ms`);
            }, timeout);
            this.finally(() => {
                window.clearTimeout(timeoutReference)
            });
        }
    }
    class Checking extends Expiring {
        #checker;
        constructor(checker, interval, timeout, name) {
            super(timeout, name);
            this.#checker = checker;
            this.#check();
            const intervalReference = window.setInterval(this.#check.bind(this), interval);
            this.finally(() => {
                window.clearInterval(intervalReference)
            });
        }
        #check() {
            const checkResult = this.#checker();
            if(!checkResult) {
                return;
            }
            this.resolve(checkResult);
        }
    }

//to here

setTimeout(function() {
  //super dark #061a2e
  //dark #0d2234
  //regular #162b3c
  //light #1c2f40
    var css = `
        .myButton {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            height: 40px;
            font-weight: 600;
            letter-spacing: .25px;
            overflow: hidden;
          background-color: #1c2f40 !important;
          padding-left:30px !important;
          padding-right:30px !important;
          margin-right: 12px !important;
          margin-left: 0px !important;
          transition: 0.2s ease;
        }
        .myButton:hover {
          background-color: #65aadb !important;
        }
        `;

    var style = document.createElement('style');
    style.type = 'text/css';

    if (style.styleSheet) {
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }

    document.head.appendChild(style);

}, 500);