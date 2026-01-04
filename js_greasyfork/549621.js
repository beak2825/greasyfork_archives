// ==UserScript==
// @name        Torn Revive Blacklist
// @namespace   Violentmonkey Scripts
// @match       https://www.torn.com/*
// @grant       none
// @version     1.0
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @author      Bilbosaggings[2323763] (BillyBourbon)
// @description 8/25/2025, 7:08:36 PM - A userscript to allow users to mark players within a revive ban list similar to that of the Torn enemy and target lists.
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/549621/Torn%20Revive%20Blacklist.user.js
// @updateURL https://update.greasyfork.org/scripts/549621/Torn%20Revive%20Blacklist.meta.js
// ==/UserScript==

// =======================================================================================================================================

const LOCAL_STORAGE_KEY = "TornReviveBlacklistScript";
const COLOUR_LIST = [
  'Red',
  'Orange',
  'Gold',
  'Yellow',
  'Green',
  'Teal',
  'Cyan',
  'Blue',
  'Navy',
  'Purple',
  'Magenta',
  'Pink',
  'Brown',
  'Olive',
  'Gray',
  'Black',
];
const BAN_TYPE_LIST = ['disable', 'prompt'];

// =======================================================================================================================================

function waitForElement(selector){
  return new Promise((resolve) => {
    if(document.querySelector(selector)){
      resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver((mutations) => {
      if(document.querySelector(selector)){
        resolve(document.querySelector(selector));
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      subtree:true,
      childList:true,
    });
  });
}

const getCurrentTornUser = () => {
  // { playername, id, avatar, role }
  return JSON.parse(document.getElementById("torn-user").value);
};

const defaultFamilyTargetSettings = { targets: {}, updateTime: 0, url:null };
const defaultSettings = {
  catergories:[
    {
      name: 'Non Payer',
      colour: 'red',
      banType: 'disable'
    },
    {
      name: 'General Douchebag',
      colour: 'purple',
      banType: 'prompt'
    },
    {
      name: 'War Target',
      colour: 'black',
      banType: 'prompt'
    }
  ]
};

async function getScriptData(){
  const data = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '{}');

  if(!data.targets || typeof data.targets !== 'object') data.targets = {};

  if(!data.settings || typeof data.settings !== 'object') data.settings = defaultSettings;

  if(!data.familyTargets || typeof data.familyTargets !== 'object') data.familyTargets = defaultFamilyTargetSettings;

  window.userscriptDataObject = data;

  window.listOfDummies = await getReviveBlacklist();

  return data;
}

async function saveScriptData(data){
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  window.userscriptDataObject = data;

  await getReviveBlacklist(window.userscriptDataObject);
}

async function getReviveBlacklist() {
  const data = window.userscriptDataObject;
  let publicDumDums;

  if(data.familyTargets.url && data.familyTargets.url.length > 0 && new Date().getTime()/1000 >= (data.familyTargets.updateTime + (15 * 60))){
    try{
      publicDumDums = await fetchPublicDumDums(data.familyTargets.url);

      data.familyTargets.targets = publicDumDums;
      data.familyTargets.updateTime = Math.floor(new Date().getTime() / 1000);

      saveScriptData(data);
    } catch(err){
      console.error('Error Fetching family ban list... ',err);
    }
  } else{
    publicDumDums = data.familyTargets.targets;
  }

  Object.values(publicDumDums).forEach(o => o.banLevel = 'family');

  const personalDumDums = window.userscriptDataObject.targets;

  Object.values(personalDumDums).forEach(o => o.banLevel = 'personal');

  const obj = { ...publicDumDums, ...personalDumDums };

  window.listOfDummies = obj;

  return obj;
};

async function fetchPublicDumDums(baseUrl) {
  const endpoint = `/api/revive-ban-list`;
  const url = `${baseUrl}${endpoint}`;

  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: 'GET',
      url: url,
      headers: {
        'Accept': 'application/json'
      },
      onload: function (response) {
        try {
          const json = JSON.parse(response.responseText);
          resolve(json);
        } catch (err) {
          console.error('Failed to parse JSON:', err);
          reject(err);
        }
      },
      onerror: function (err) {
        console.error('Request failed:', err);
        reject(err);
      }
    });
  });
}

async function postPublicDumDum(target){
  const endpoint = `/api/revive-ban-list`;
  const url = `${window.userscriptDataObject.familyTargets.url}${endpoint}`;

  const payload = JSON.stringify({target, sender: getCurrentTornUser().id});

  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method:'POST',
      url: url,
      headers: {
        'Content-Type': 'application/json'
      },
      data: payload,
      onload: (res) => {
        try{
          const json = JSON.parse(res.responseText);
          console.log({json});
          resolve(json);
        } catch(err){
          console.error('Failed to parse JSON:', err);
          reject(err);
        }
      },
      onerror: function (err) {
        console.error('Request failed:', err);
        reject(err);
      }
    });
  });
}

// =======================================================================================================================================

// Setup observer to handle mini profiles
function createMiniProfileObserver(){
  console.log('Creating Observer to handle miniProfiles');
  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.target.id === "profile-mini-root") {
        const miniProfile = mutation.target.children[0];

        if (miniProfile === null || miniProfile === undefined) return;

        handleMiniProfile(miniProfile);
      }
    }
  });

  observer.observe(document.querySelector('body'), {
    childList: true,
    subtree: true,
  });

  console.log('Observer started to handle miniProfiles');
}

async function handleMiniProfile(profile) {
  // console.log('Handling Profile ', {profile});
  const wrapper = await waitForElement(".profile-mini-_userProfileWrapper___iIXVW");

  const profileLink = wrapper.querySelector(".profile-mini-_honorWrap___BHau4 > .profile-mini-_linkWrap___ZS6r9")?.href;
  const playerId = profileLink.match(/XID=(\d+)/)[1];
  const playerName = [...wrapper.querySelectorAll('.honor-text')].filter(x => x.classList.length === 1)[0].textContent ?? '';
  // console.log({playerId, playerName});

  const buttonsWrapper = wrapper.querySelector(".buttons-wrap");
  const buttonsList = buttonsWrapper.querySelector(".buttons-list");

  const reviveButton = buttonsList.querySelector(".profile-button-revive");

  insertAddTargetButton(buttonsWrapper, playerId, playerName);
};

function insertAddTargetButton(buttonsWrapper, playerId, playerName){
  const buttonsList = buttonsWrapper.querySelector(".buttons-list");
  const reviveButton = buttonsList.querySelector(".profile-button-revive");

  const addTargetButton = document.createElement('a');
  addTargetButton.classList.add('profile-button');
  addTargetButton.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="46" height="46">
    <!-- Person SVG from buttons   -->
    <g transform="translate(-50,0) scale(9)">
      <path d="M11,33.4v-1.1c0-2.2.2-3.4,2.7-4,2.9-.7,5.8-1.3,4.4-3.8-4.1-7.6-1.2-11.8,3.2-11.8s7.3,4.1,3.2,11.8c-1.3,2.5,1.4,3.1,4.4,3.8,2.6.6,2.7,1.9,2.7,4v1.1H11Z"/>
    </g>
    <!-- Revive SVG from buttons   -->
    <g transform="translate(175,25) scale(6)" fill="red">
      <g transform="translate(-860,-180)">
        <path d="M886.6,199.2a1.02,1.02,0,0,0-.8.5l-1.3,2.4-1.6-4.6a.871.871,0,0,0-.8-.6,1.05,1.05,0,0,0-.9.5l-1.1,2.6-1.7-10.2c-.1-.4-.5-.8-.9-.7a.961.961,0,0,0-.9.7l-1.5,11.9-1.2-6.4a.849.849,0,0,0-.8-.7.8.8,0,0,0-.9.5l-2,4.2H867v1.8h3.7a.891.891,0,0,0,.8-.5l1.1-2.2,1.8,9a.96.96,0,0,0,.9.7h0a.948.948,0,0,0,.9-.8l1.5-11.7,1.3,7.7a.849.849,0,0,0,.8.7.937.937,0,0,0,.9-.5l1.4-3.2,1.5,4.4a.871.871,0,0,0,.8.6,1.05,1.05,0,0,0,.9-.5l2-3.8h3.9v-1.8Z"/>
      </g>
    </g>
  </svg>
  `;

  handleReviveButton(reviveButton, playerId);

  buttonsList.appendChild(addTargetButton);

  if(window?.userscriptDataObject?.targets[playerId] && window?.userscriptDataObject?.targets[playerId].targetName !== playerName) {
    const data = window.userscriptDataObject;
    data.targets[playerId].targetName = playerName;
    saveScriptData(data);

    setTimeout(() => {builUIPanelPersonalBanList(); builUIPanelFamilyBanList();}, 0);
  }

  addTargetButton.addEventListener('click', () => {
    const data = window.userscriptDataObject;
    const currentUser = getCurrentTornUser();

    const originalButonListDisplayStyle = buttonsList.style.display;
    buttonsList.style.display = 'none';

    const inputBox = document.createElement('div');
    inputBox.style.cssText = 'display: flex; flex-direction: column; width: 100%; gap: 6px; align-items: stretch; flex: 1 1 auto; box-sizing: border-box;';
    inputBox.innerHTML = `
    <label>
      Reason:
      <input type="text" id="userScriptReasonInput" placeholder="Enter reason..." style="width: 100%; padding: 4px; box-sizing: border-box;" />
    </label>

    <label>
      Category:
      <select id="userScriptCategorySelect" style="width: 100%; padding: 4px; box-sizing: border-box;">
        <option value="General Douchebag" selected>General Douchebag</option>
        <option value="Non Payer">Non Payer</option>
        <option value="War Target">War Target</option>
      </select>
    </label>
    `;

    const inputBoxButtons = document.createElement('div');
    inputBoxButtons.style.cssText = 'display:flex; flex-direction:row; gap:8px;';

    const submitPersonalButton = document.createElement('button');
    submitPersonalButton.textContent = 'Personal';
    submitPersonalButton.classList.add('script-btn');

    const submitFactionButton = document.createElement('button');
    submitFactionButton.textContent = 'Family';
    submitFactionButton.classList.add('script-btn');

    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.classList.add('script-btn');
    cancelButton.style.background = 'red';

    submitPersonalButton.addEventListener('click', () => {
      data.targets[playerId] = {
        targetId:playerId,
        targetName: playerName,
        catergory:document.getElementById('userScriptCategorySelect')?.value || 'General Douchebag',
        reason:document.getElementById('userScriptReasonInput')?.value || '',
        banLevel:'personal',
        submitterId:currentUser.id,
        submitterName:currentUser.playername
      };

      saveScriptData(data);

      setTimeout(() => {
        handleReviveButton(reviveButton, playerId);
        builUIPanelPersonalBanList();
        buttonsList.style.display = originalButonListDisplayStyle;
        inputBox.remove();
      }, 0);
    });

    submitFactionButton.addEventListener('click', async () => {
      const obj = {
        targetId:playerId,
        targetName: playerName,
        catergory:document.getElementById('userScriptCategorySelect')?.value || 'General Douchebag',
        reason:document.getElementById('userScriptReasonInput')?.value || '',
        submitterId:currentUser.id,
        submitterName:currentUser.playername
      };

      await postPublicDumDum(obj);

      setTimeout(() => {
        buttonsList.style.display = originalButonListDisplayStyle;
        inputBox.remove();
      }, 0);
    });

    cancelButton.addEventListener('click', () => {
      buttonsList.style.display = originalButonListDisplayStyle;
      inputBox.remove();
    });

    inputBoxButtons.appendChild(submitPersonalButton);

    if(data?.familyTargets?.url && data.familyTargets.url.length > 0) inputBoxButtons.appendChild(submitFactionButton);

    inputBoxButtons.appendChild(cancelButton);

    inputBox.appendChild(inputBoxButtons);

    buttonsWrapper.appendChild(inputBox);
  });
}

function handleReviveButton(reviveButton, playerId){
  if(!reviveButton) return;
  if(reviveButton.style.display === 'none') return;

  const listOfDummies = window.listOfDummies;
  if (!listOfDummies[playerId]) return;

  const userDumDumEntry = listOfDummies[playerId];

  const settings = window.userscriptDataObject.settings;
  const catergory = settings.catergories.find(o => o.name.toLowerCase() === userDumDumEntry.catergory.toLowerCase());

  const buttonReason = `\n${userDumDumEntry.catergory}\nSubmitted By: ${userDumDumEntry.submitterId}\nReason: ${userDumDumEntry.reason}`;

  applyColourCross(reviveButton, catergory.colour);

  switch(catergory.banType.toLowerCase()){
  case('disable'):{
    reviveButton = disableButton(reviveButton);
    break;
  }
  case('prompt'):{
    reviveButton = doubleConfirmOnButton(reviveButton, `Are you absolutely sure?\n${buttonReason}`);
    break;
  }
  }

  reviveButton.setAttribute('title', buttonReason);
}

// =======================================================================================================================================

function disableButton(button){
  const clone = button.cloneNode(true);
  clone.style.pointerEvents = 'none';
  clone.style.opacity = '0.5';
  clone.setAttribute('aria-disabled', 'true');
  button.parentNode.replaceChild(clone, button);

  return clone;
}


function doubleConfirmOnButton(button, confirmMessage = 'Are you sure you want to revive this dum dum ?_?') {
  const proxyClick = (e) => {
    e.stopImmediatePropagation();
    e.preventDefault();

    if(button.dataset.active === 'true') return;
    button.dataset.active = 'true';

    const confirmationBox = document.createElement('div');
    confirmationBox.style.cssText = "display:flex;flex-direction:column; margin-top:10px; margin-left:10px; gap:10px; align-items:center; max-width:250px;";
    confirmationBox.innerHTML = `
      <span style="color:red;">${confirmMessage}</span>
      <button style="background:green; border-radius:8px;" id="confirmYes">YES</button>
      <button style="background:red; border-radius:8px;" id="confirmNo">NO</button>
    `;

    const parent = button.parentElement;
    const parentsParent = parent.parentElement;
    parentsParent.appendChild(confirmationBox);
    const originalDisplayStyle = parent.style.display;
    parent.style.display = 'none';

    confirmationBox.querySelector('#confirmYes').addEventListener('click', () => {
      button.removeEventListener('click', proxyClick, true);
      button.dataset.active = 'false';
      parent.style.display = originalDisplayStyle;

      const newClick = new MouseEvent('click', { bubbles: true, cancelable: true });
      button.dispatchEvent(newClick);
    });

    confirmationBox.querySelector('#confirmNo').addEventListener('click', () => {
      confirmationBox.remove();
      parent.style.display = originalDisplayStyle;

      button.dataset.active = 'false';
    });
  };

  button.addEventListener('click', proxyClick, true);

  return button;
}

function applyColourCross(element, color, opacity = 0.5, thickness = 10) {
  const encodedSVG = encodeURIComponent(`
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
          <line x1='0' y1='0' x2='100' y2='100' stroke='${color.toLowerCase()}' stroke-width='${thickness}' stroke-opacity='${opacity}'/>
          <line x1='100' y1='0' x2='0' y2='100' stroke='${color.toLowerCase()}' stroke-width='${thickness}' stroke-opacity='${opacity}'/>
    </svg>
  `);

  element.style.setProperty("background-image", `url("data:image/svg+xml;utf8,${encodedSVG}")`);
  element.style.setProperty("box-shadow", `0px 0px 2px 1px ${color.toLowerCase()}`);
}

// =======================================================================================================================================

// Handle special pages
function handlePages(){
  const pathname = window.location.pathname;
  console.log('Current Path: ', pathname);
  switch(pathname.toLowerCase()){
  case('/hospitalview.php'):{
    handleHospitalPage();
    break;
  }
  case('/profiles.php'):{
    handleProfilePage();
    break;
  }
  }
}

async function handleHospitalPage(){
  const wrapper = await waitForElement('.userlist-wrapper');

  // console.log('Hospital Wrapper: ', {wrapper});

  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      mutation.addedNodes.forEach(node => {
        if(node.tagName === 'LI'){
          const user = node.querySelector('a.user.name');

          if(user === null) return;

          const id = user.href.match(/XID=(\d+)/)[1];

          const button = node.querySelector('.revive');
          handleReviveButton(button, id);
        }
      });
    }
  });

  observer.observe(document.querySelector('.user-info-list-wrap'), {
    childList: true,
    subtree: true,
  });

  console.log('Observer started to handle Hospital page user list');
}

async function handleProfilePage(){
  // console.log('Handling Profile Page. ', {location: window.location});
  const wrapper = await waitForElement(".buttons-wrap");

  const playerId = window.location.search.match(/XID=(\d+)/)[1];
  const playerName = [...document.querySelectorAll('.honor-text')].filter(x => x.classList.length === 1)[0].textContent ?? '';

  insertAddTargetButton(wrapper, playerId, playerName);

  const personalTarget = window.userscriptDataObject.targets[playerId];
  const familyTarget = window.userscriptDataObject.familyTargets.targets[playerId];

  const profileWrapper = await waitForElement('.user-profile');

  const div = document.createElement('div');
  div.classList.add('profile-wrapper');
  div.classList.add('m-top10');

  const banReasonsTitle = document.createElement('div');
  banReasonsTitle.textContent = `Revive Ban List`;
  banReasonsTitle.classList.add('title-black');
  banReasonsTitle.classList.add('top-round');

  const banReasonsDiv = document.createElement('div');
  banReasonsDiv.classList.add('cont');
  banReasonsDiv.classList.add('bottom-round');
  banReasonsDiv.classList.add('profile-container');

  const personalBanReason = document.createElement('p');
  personalBanReason.textContent = 'This user isnt on your revive ban list';
  personalBanReason.classList.add('t-gray-9');
  personalBanReason.classList.add('p10');

  const familyBanReason = document.createElement('p');
  familyBanReason.textContent = 'This user isnt on your family revive ban list';
  familyBanReason.classList.add('t-gray-9');
  familyBanReason.classList.add('p10');

  if(personalTarget){
    personalBanReason.innerHTML = `Personal Revive Ban:<br>${personalTarget.targetName} [${personalTarget.targetId}] Was submitted by ${personalTarget.submitterName} [${personalTarget.submitterId}].<br>Ban Category: ${personalTarget.catergory} | Reason: ${personalTarget.reason}`;
  }
  if(familyTarget){
    familyBanReason.innerHTML = `Family Revive Ban:<br>${familyTarget.targetName} [${familyTarget.targetId}] Was submitted by ${familyTarget.submitterName} [${familyTarget.submitterId}].<br>Ban Category: ${familyTarget.catergory} | Reason: ${familyTarget.reason}`;
  }

  banReasonsDiv.appendChild(familyBanReason);
  banReasonsDiv.appendChild(personalBanReason);

  div.appendChild(banReasonsTitle);
  div.appendChild(banReasonsDiv);

  // profileWrapper.appendChild(div)
  profileWrapper.insertBefore(div, document.querySelector('.medals-wrapper'));
}

function insertUserscriptUI(){
  insertUserscriptUIPanel();

  builUIPanelPersonalBanList();
  builUIPanelFamilyBanList();
  buildUIPanelSettingsTable();

  addListenersToUI();
}

function insertUserscriptUIPanel(){
  const listOfDummies = window.listOfDummies;
  const personalDummies = Object.values(listOfDummies).filter(o => o.banLevel === 'personal');

  const panelHTML = `
      <div id="settings-panel">
        <div class="box">
          <div class="flex-row flex-gap flex-center">
            <h2>Ban Target</h2>
            <button class="script-btn" id="userScriptButtonClosePanel" style="background:red;">Close</button>
          </div>
          <div class="line-under"></div>
          <div class="flex-row flex-gap flex-center">
            <label class="lbl">
              Target ID:
              <input id="targetId" class="input-field" type="number" min="0"/>
            </label>
            <label class="lbl">
              Reason:
              <input id="reason" class="input-field" type="text"/>
            </label>
            <label class="lbl">
              Category:
              <select id="catergory">
                <option value="Non Payer">Non Payer</option>
                <option value="General Douchebag" selected>General Douchebag</option>
                <option value="War Target">War Target</option>
              </select>
            </label>
          </div>
          <div class="line-under"></div>
          <div class="flex-row flex-gap flex-center">
            <button id="addToPersonalList" class="script-btn">
              To Personal List
            </button>
            <button id="addToFamilyList" class="script-btn">
              To Family List
            </button>
            <p id="message-box" class="message-box"></p>
          </div>
          <div class="line-under"></div>
          <div class="flex-row flex-gap flex-center">
            <h2>Remove Target/s</h2>
            <label class="lbl">
              Target ID:
              <select id="removeTargetId">
                <option value="allTargets">All Targets</option>
                ${
  personalDummies.map(o => `<option value="${o.targetId}">${o.targetId}</option>`).join('')
}
              </select>
            </label>
            <button id="removeFromPersonalList" class="script-btn">
              Remove From Personal List
            </button>
          </div>
        </div>

        <div class="box">
          <h2>Personal Ban List</h2>
          <div class="line-under"></div>
          <div class="table-wrapper">
            <table class="table" >
              <thead>
                <tr>
                  <th>Target</th>
                  <th>Reason</th>
                  <th>Category</th>
                  <th>Remove</th>
                </tr>
              </thead>
              <tbody id="personalBanListBody">
              </tbody>
            </table>
          </div>
        </div>

        <div class="box">
          <h2>Family Ban List</h2>
          <div class="line-under"></div>
          <div class="table-wrapper">
            <table class="table">
              <thead>
                <tr>
                  <th>Target</th>
                  <th>Reason</th>
                  <th>Category</th>
                  <th>Submitter</th>
                </tr>
              </thead>
              <tbody id="familyBanListBody">
              </tbody>
            </table>
          </div>
        </div>

        <div class="box">
          <div>
            <h2>Settings</h2>
          <div class="line-under"></div>
            <div>
              <label class="lbl" style="margin: 0;">
                Set Family List Api URL:
                <input type="text" id="familyListApiUrlInput" class="input-field"/>
              </label>
              <button class="script-btn" id="setApiUrlButton">
                Set Api URL
              </button>
              <button class="script-btn" id="deleteApiUrlButton">
                Delete Api URL
              </button>
            </div>
          <div class="line-under"></div>
            <div>
              <label class="lbl" style="margin: 0;">
              New Category Name:
              <input type="text" id="newCategoryNameInput" class="input-field" placeholder="e.g. Melon, Dum Dum etc" />
            </label>
            <button class="script-btn" id="addNewCategoryButton">
              Add Category
            </button>
            </div>
          <div class="line-under"></div>
              <table class="table" id="userScriptSettingsTable">
              <thead>
                <tr>
                  <th>Ban Category</th>
                  <th>Cross Colour</th>
                  <th>Ban Type</th>
                </tr>
              </thead>
              <tbody>
              </tbody>
            </table>
          <div class="line-under"></div>
            <button class="script-btn" id="updateScriptSettings">
              Update Settings
            </button>
            <button class="script-btn" id="clearScriptData">
              Clear ALL Script Data
            </button>
          </div>
        </div>
      </div>
  `;

  const panel = document.createElement('div');
  panel.innerHTML = panelHTML;
  document.getElementById('mainContainer').appendChild(panel);
}

function setMessage(message){
  const p = document.querySelector('#message-box');
  p.textContent = message;
}

function builUIPanelPersonalBanList(){
  // console.log('Building Personal Ban Table Rows');
  const personalDummies = Object.values(window.listOfDummies).filter(o => o.banLevel === 'personal');
  const personalDummiesRowText = personalDummies.map(o => `
  <tr>
    <td><a href="/profiles.php?XID=${o.targetId}">${o.targetName}[${o.targetId}]</a></td>
    <td>${o.reason}</td>
    <td>${o.catergory}</td>
    <td><button class="removeTargetButton" id="removeRowsTarget" data-target-id="${o.targetId}">Remove</button></td>
  </tr>`).join('\n');

  const tbody = document.querySelector('#personalBanListBody');
  tbody.innerHTML = personalDummiesRowText;

  tbody.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', () => {
      const id = button.getAttribute('data-target-id');

      const data = window.userscriptDataObject;
      const name = data.targets[id].targetName;

      delete data.targets[id];
      saveScriptData(data);

      setTimeout(()=>{builUIPanelPersonalBanList();},0);

      setMessage(`Removed Target: ${name} [${id}]`);
    });
  });

}
function builUIPanelFamilyBanList(){
  // console.log('Building family ban list table');
  // console.log({dummies:window.listOfDummies})
  const familyDummies = Object.values(window.listOfDummies).filter(o => o.banLevel === 'family');
  const familyDummiesRowText = familyDummies.map(o => `
  <tr>
    <td><a href="https://www.torn.com/profiles.php?XID=${o.targetId}">${o.targetName}[${o.targetId}]</a></td>
    <td>${o.reason}</td>
    <td>${o.catergory}</td>
    <td>${o.submitterId}</td>
  </tr>`).join('\n');
  const tbody = document.querySelector('#familyBanListBody');
  tbody.innerHTML = familyDummiesRowText;
}

function buildUIPanelSettingsTable(){
  const settings = window.userscriptDataObject.settings;
  const settingsRowText = Object.values(settings.catergories).map(o => `<tr>
    <td>${o.name}</td>
    <td>
      <select>
        ${
  COLOUR_LIST.map(t => `<option value="${t}"${t === o.colour ? ' selected' : ''}>${t}</option>`).join('')
}
      </select>
    </td>
    <td>
      <select>
        ${
  BAN_TYPE_LIST.map(t => `<option value="${t}"${t === o.banType ? ' selected' : ''}>${t}</option>`).join('')
}
      </select>
    </td>
  </tr>`).join('');

  const tbody = document.querySelector('#userScriptSettingsTable > tbody');
  tbody.innerHTML = settingsRowText;
}

function addListenersToUI(){
  document.getElementById('addToPersonalList').addEventListener('click', () => addTargetToBanList('personal'));
  document.getElementById('addToFamilyList').addEventListener('click', () => addTargetToBanList('family'));
  document.getElementById('removeFromPersonalList').addEventListener('click', () => clearPersonalBanTarget());

  document.getElementById('updateScriptSettings').addEventListener('click', () => updateScriptSettings());
  document.getElementById('clearScriptData').addEventListener('click', () => localStorage.removeItem(LOCAL_STORAGE_KEY));

  document.getElementById('addNewCategoryButton').addEventListener('click', () => {
    const catergoryName = document.getElementById('newCategoryNameInput').value;
    const data = window.userscriptDataObject;
    const i = data.settings.catergories.findIndex(o => o.name.toLowerCase() === catergoryName.toLowerCase());

    if(i >= 0) return;

    data.settings.catergories.push({
      name: catergoryName,
      colour: 'red',
      banType: 'disable'
    });

    saveScriptData(data);

    setTimeout(() => {buildUIPanelSettingsTable();}, 0);

    setMessage(`Added New Category '${catergoryName}'`);
  });

  document.getElementById('setApiUrlButton').addEventListener('click', async () => {
    const url = document.getElementById('familyListApiUrlInput').value;

    const data = window.userscriptDataObject;
    data.familyTargets.url = url;

    await saveScriptData(data);

    setTimeout(() => {builUIPanelFamilyBanList();}, 0);

    setMessage(`Set Family Revive Ban List Api Url: '${url}'`);
  });

  document.getElementById('deleteApiUrlButton').addEventListener('click', () => {
    const data = window.userscriptDataObject;
    data.familyTargets = defaultFamilyTargetSettings;

    saveScriptData(data);

    setTimeout(() => {builUIPanelFamilyBanList();}, 0);

    setMessage('Removed Family Revive Ban List Api Url');
  });

  const toggleBtn = document.createElement('button');
  toggleBtn.innerHTML = `<span class="link-text" style="color:white;">Open Ban Settings</span>`;
  toggleBtn.id = 'banToggleButton';

  const li = document.createElement('li');
  li.classList.add('link');
  li.appendChild(toggleBtn);

  document.querySelector('.settings-menu').appendChild(li);

  toggleBtn.addEventListener('click', () => {
    const overlay = document.getElementById('settings-panel');

    overlay.style.display = (overlay.style.display === 'block' ? 'none' : 'block');
  });

  document.querySelector('#userScriptButtonClosePanel').addEventListener('click', () => document.getElementById('settings-panel').style.display = 'none');
}

// =======================================================================================================================================

function updateScriptSettings(){
  const settings = window.userscriptDataObject.settings;

  const settingsTable = document.querySelector('#userScriptSettingsTable');

  const [, ...rows] = tableToArray(settingsTable);
  rows.forEach(([cat, colour, type]) => {
    const i = settings.catergories.findIndex(o => o.name === cat);
    if(i >= 0){
      settings.catergories[i].colour = colour;
      settings.catergories[i].banType = type;
    } else{
      settings.catergories.push({name:cat, colour, banType:type});
    }
  });

  saveScriptData(window.userscriptDataObject);

  setMessage(`Updated Settings`);
}
function tableToArray(table){
  const rows = [];
  const tableRows = table.querySelectorAll('tr');

  tableRows.forEach(r => {
    const cells = Array.from(r.querySelectorAll('td, th')).map(c => c.querySelector('select') ? c.querySelector('select').value : c.textContent.trim());
    rows.push(cells);
  });

  return rows;
}
// =======================================================================================================================================

function addTargetToBanList(banLevel){
  const targetId = document.getElementById('targetId').value;
  const reason = document.getElementById('reason').value;
  const catergory = document.getElementById('catergory').value;

  const submitter = getCurrentTornUser();
  const submitterId = submitter.id;
  const submitterName = submitter.playername;

  const obj = { targetId, targetName:'', catergory, reason, banLevel, submitterId, submitterName };

  if(!targetId || targetId <= 0) {
    setMessage(`Error: Invalid Target ID Provided '${targetId}'`);
    return;
  }

  if(banLevel === 'family'){ /* empty */ } else{
    const data = window.userscriptDataObject;

    if(!data.targets[targetId]) data.targets[targetId] = obj;
    else {
      data.targets[targetId].catergory = catergory;
      if(reason.length > 0) data.targets[targetId].reason = reason;
    }

    saveScriptData(data);

    setTimeout(() => {builUIPanelPersonalBanList();}, 0);

    setMessage(`Added Target '${targetId}'`);
  }
}

function clearPersonalBanTarget(){
  const id = document.getElementById('removeTargetId').value;
  const data = window.userscriptDataObject;

  if(id === 'allTargets') {
    data.targets = {};
  } else{
    delete data.targets[id];
  }

  saveScriptData(data);

  setTimeout(() => {builUIPanelPersonalBanList();}, 0);

  setMessage(`Cleared Target '${id}'`);
}








GM_addStyle(`
  #settings-panel {
    display: none;
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100vh;
    z-index: 99999;
    background-color: rgba(0, 0, 0, 0.6);
    overflow-y: auto;
    padding: 32px 20px;
    box-sizing: border-box;
    border-radius: 8px;
    margin: auto;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.25);
  }

  #settings-panel *,
  #settings-panel *::before,
  #settings-panel *::after {
    box-sizing: border-box;
    font-family: Arial, sans-serif;
    color: #333;
  }

  #settings-panel h2 {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
  }

  .flex-row {
    display: flex;
    flex-direction: row;
  }
  .flex-col {
    display: flex;
    flex-direction: column;
  }
  .flex-center {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .flex-gap {
    gap: 16px;
  }

  .box {
    margin-bottom: 24px;
    padding: 16px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #fff;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  }

  .margin10 { 
    margin-top: 10px; 
  }

  .line-under {
    border-bottom: 1px solid #ccc;
    margin: 12px 0;
  }

  .message-box {
    border: 1px solid #444;
    width: 260px;
    max-height: 120px;
    min-height: 28px;
    overflow-y: auto;
    border-radius: 6px;
    color: #222;
    text-align: center;
    padding: 6px;
    background: #fafafa;
  }

  .lbl {
    display: block;
    font-size: 14px;
    font-weight: 500;
  }

  .input-field {
    width: 100%;
    max-width: 300px;
    padding: 8px 10px;
    font-size: 14px;
    border: 1px solid #bbb;
    border-radius: 4px;
    margin-bottom: 12px;
    transition: border-color 0.2s ease;
  }
  .input-field:focus {
    border-color: #00796b;
    outline: none;
    box-shadow: 0 0 0 2px rgba(0, 121, 107, 0.2);
  }
  select.input-field {
    width: auto;
  }

  .script-btn {
    font-size: 14px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    background-color: #00796b;
    color: white;
    padding: 8px 16px;
  }
  .script-btn:hover {
    filter: brightness(85%); /* makes any background 15% darker */
  }

  .script-btn:active {
    transform: scale(0.97);
  }

  #banToggleButtonX {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 999999;
    background-color: #333;
    border-radius: 6px;
    font-size: 14px;
    padding: 8px 12px;
    color: #fff;
  }
  #banToggleButtonX:hover {
    background-color: #000;
  }

  .table-wrapper {
    max-height: 240px;
    overflow-y: auto;
    border: 1px solid #ddd;
    border-radius: 6px;
    background: #fff;
  }

  .table {
    width: 100%;
    border-collapse: collapse;
    position: relative;
  }

  .table thead {
    position: sticky;
    top: 0;
    z-index: 10;
    background: #00796b;
    color: #fff;
  }

  .table th,
  .table td {
    padding: 10px 12px;
    text-align: left;
    font-size: 14px;
  }

  .table th {
    font-weight: 600;
    border-bottom: 2px solid #00796b;
  }

  .table td {
    border-bottom: 1px solid #eee;
  }

  .table tbody tr:nth-child(even) {
    background-color: #f9f9f9;
  }
  .table tbody tr:nth-child(odd) {
    background-color: #fff;
  }
  .table tbody tr:hover {
    background-color: #e0f7f5;
  }

  .removeTargetButton {
    margin: 2px;
    background-color: #d9534f;
    color: white;
    padding: 4px 10px;
    border-radius: 4px;
    font-size: 12px;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }
  .removeTargetButton:hover {
    background-color: #c9302c;
  }
`);



(async () => {
  console.log(`Starting ${LOCAL_STORAGE_KEY}...`);

  await getScriptData();

  createMiniProfileObserver();

  handlePages();

  insertUserscriptUI();
})();









