// ==UserScript==
// @name        Cuberealm.io Accounts+ account switcher
// @namespace   cooluser1481
// @match       https://cuberealm.io/*
// @version     1.1.4
// @author      cooluser1481
// @description The only account switcher you ever need! Easy access for alts and other accounts!
// @license     GPL3
// @downloadURL https://update.greasyfork.org/scripts/553907/Cuberealmio%20Accounts%2B%20account%20switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/553907/Cuberealmio%20Accounts%2B%20account%20switcher.meta.js
// ==/UserScript==

if(!localStorage.USSRstorage){localStorage.USSRstorage='[]';}
const USSRstyle = document.createElement('style');
USSRstyle.type = 'text/css';

/* this CSS was death :skull: */

/*all var start with USSR to avoind naming issues with other scripts + my ign is coolussr1481 + so everyone knows I made it >:). This is mostly for the bookmarklet form*/
let USSRcss = `
#UUSRcustomMenuContainer {
  display: flex;
  flex-direction: column;
  background-color: rgba(0,0,0,0.6);
}

#USSRcustomMenuContainer > div {
  background-color: #f1f1f1;
  margin: 10px;
  text-align: left;
  line-height: 60px;
  font-size: 30px;
  border: 2px solid black
    width: 50%;
    font-family:LanaPixel;
    padding:0px;
    background:none;
}

#USSRcustomButton, #USSRcustomButton > button {
    width: 100%;
    font-family:LanaPixel;
    padding-top:7px;
    display:inline; !important
}



#USSRcustomMenuContainer > div > button {
    width:100%;
    font-family:LanaPixel;
    padding:0px;
    background:rgba(0,0,0,0.8);
    height: 30px;
}

#USSRcustomMenuContainer > div > button:hover, #USSRcustomMenu > h2 > button:hover {
    background:rgba(75,75,75,0.8);
}

#USSRcustomMenu{
    padding-top:10px;
}

#USSRcustomMenu > h2 > button {
    text-align:right;
    align:right;
    float:right; 
    /*this move is called the, and I quote, "SO **** WITH IT! TAKE THIS YOU ****TY CSS :middle_finger:" */
    /*If you couldn't tell, I was super angry while doing the CSS*/
    /*The funniest part is that I think most of the right-align actually does stuff and needs all 3 or maybe only 2*/
    background:rgba(0,0,0,0.8);
    font-family:"LanaPixel";
}


`;

if (USSRstyle.styleSheet) {
    USSRstyle.styleSheet.cssText = USSRcss;
} else {
    USSRstyle.appendChild(document.createTextNode(USSRcss));
}

document.head.appendChild(USSRstyle);
        
        
        
        


let USSRdata = JSON.parse(localStorage.USSRstorage);
        
setInterval(create, 2);        
        
        
function create(){
 if(document.querySelector("div.sc-fHejqy.hSWXXr")&& !document.querySelector("#USSRcustomButton") && !location.href.includes("-")){ 
/*includes("-") makes sure it is not in a game ex. survival-us-1 or creative-eu-67 all contain dashes; however, the root/base/homepage does not*/
/*going to cuberealm.io/-  disables this script while also acting the same*/
/*ha, ("-") kinda looks like my face when I wrote this*/
/*what did I just say up there, that is a very nutral face, I wrote that while sleep deprived*/
/*holy yap*/

  const USSRcustomButton = document.createElement("div");
  USSRcustomButton.id = "USSRcustomButton";
  USSRcustomButton.style.width = "100%";
  USSRcustomButton.style.fontFamily = "LanaPixel";
  USSRcustomButton.innerHTML = "<button onclick='USSRclickedStart()' class='cisZZk'>User Settings+</button>";
  document.querySelector("div.sc-fHejqy.hSWXXr").append(USSRcustomButton);
 }
}
  function USSRclickedStart() {
  if(!document.querySelector("#USSRcustomMenu")){
    const USSRcustomMenu = document.createElement("div");
    USSRcustomMenu.id = "USSRcustomMenu";
    USSRcustomMenu.class = "sc-cCzLxZ iAOgZA";
    USSRcustomMenu.innerHTML = `
    <h2>Added Accounts<button onclick="USSRaddAccount()" class='cisZZk'>manage/add account</button></h2><br>
    <p>Accounts Found:</p>
    `;
    document.querySelector("div.sc-jsEeTM.dWzCKz").append(USSRcustomMenu);
    const USSRcustomMenuContainer = document.createElement("div");
    USSRcustomMenuContainer.id = "USSRcustomMenuContainer";
    USSRcustomMenu.appendChild(USSRcustomMenuContainer);
    
    
    if(USSRdata !== null){
        if(USSRdata.length!==0){
    for(let i=0; i<USSRdata.length; i++){
        const USSRelement = document.createElement("div");
        USSRelement.innerHTML = `<button onclick='USSRdoThing(${i})' class='cisZZk'>${USSRdata[i].name}</button>`;
        USSRcustomMenuContainer.appendChild(USSRelement);
    }} else {
        USSRnoAcc();
    }} else {USSRnoAcc(); USSRdata=[];}
  }
}

function USSRnoAcc(){
    const USSRelement = document.createElement("div");
    USSRelement.innerHTML = `<button class='cisZZk'><i>You have no accounts added, add one to get started</i></button>`;
    USSRcustomMenuContainer.appendChild(USSRelement);
}

function USSRaddAccount(){
    let USSRprompt = prompt("type \'current\' to add the current account, type \'token\' to add an account from a token, and type \'import\' or \'export\' to import or export accounts+ data");           
    switch(USSRprompt) {
  case "current":
    USSRdata.push({"token":USSRgetToken(localStorage.session), "name":document.querySelector("div.sc-blmEgr.gFuQFz").innerHTML});
    document.querySelector("div.sc-kFCroH.jMZOky").click();
    USSRsave();
    break;
  case "token":
    const USSRquickTemp = Math.random();
    localStorage.setItem("session_backup_" + USSRquickTemp, localStorage.session);
    let USSRprompt2 = prompt("enter the token. This should be the one taken from an export. Only inclue the part after \'token\' do not inclue the quotes");
    let USSRprompt3 = prompt("enter the name of this account");
    localStorage.session = `{"state":{"token":"${USSRprompt2}"},"version":1}`;
    USSRdata.push({"token":USSRprompt2, "name":USSRprompt3});
    USSRsave();
    alert("thank you for using accounts+ \nA backup of you account has been saved in local storage at: \"session_backup_" + USSRquickTemp + "\".\nThe page will reload when you click ok");
    window.location.reload();
    break;
  case "import":
      
        let USSRparsed;
    const USSRquickTemp2 = Math.random();
    localStorage.setItem("accounts_backup_" + USSRquickTemp2, localStorage.session);
    let USSRprompt4 = prompt("enter the full accounts+ save data. This should be the one taken from an export");
    try {
  USSRparsed = USSRprompt4 ? JSON.parse(USSRprompt4) : null;
  USSRdata = USSRparsed;
  USSRsave();
    alert("thank you for using accounts+ \nA backup of you account has been saved in local storage at: \"accounts_backup_" + USSRquickTemp2 + "\".\nThe page will reload when you click ok");
    window.location.reload();
} catch (error) {
  console.error('not a valid save data code. Make sure to include the \'{\' and \'}\' on each side');
  USSRparsed = null;
  break;
}
    break;
  case "export":
    const USSRdeath = window.open(); /*const name is my reaction when doing this*/
    USSRdeath.document.open("");
    USSRdeath.document.write(JSON.stringify(USSRdata));
    USSRdeath.document.close();
    break;
  case null: 
    return 0;
  case "":
    return 0;
  default:
    alert("sorry, \"" + USSRprompt + "\" is not one of the options :( \nall lowercase, btw");
}
    
}

function USSRgetToken(from){
let USSRdataObject;
try {
  USSRdataObject = from ? JSON.parse(from) : null;
} catch (error) {
  console.error('Error ):', error);
  USSRdataObject = null;
}
return USSRdataObject?.state?.token || null;
}

function USSRsave(){
    localStorage.USSRstorage = JSON.stringify(USSRdata);
}

/*ran out of naming ideas here + want to sleep*/
function USSRdoThing(thing){
    let USSRdoPrompt = prompt("editing: " + USSRdata[thing].name + " \n type \'use\' to switch to that account or \'export\' to export the token and name");
    switch(USSRdoPrompt) {
  case "use":
     const USSRquickTemp = Math.random();
    localStorage.setItem("session_backup_" + USSRquickTemp, localStorage.session);
    localStorage.session = `{"state":{"token":"${USSRdata[thing].token}"},"version":1}`;
    alert("thank you for using accounts+ \nA backup of you account has been saved in local storage at: \"session_backup_" + USSRquickTemp + "\".\nThe page will reload when you click ok");
    window.location.reload();
    break;
  case "export":
    const USSRdeath = window.open(); /*const name is my reaction when doing this*/
    USSRdeath.document.open("");
    USSRdeath.document.write(JSON.stringify(USSRdata[thing]));
    USSRdeath.document.close();
   break;
   
   /*so like, I kinda had to remove delete because it is not that useful, but also, it liked to del all accounts, sooo... U just have to export > remove the acc > re-Import*/
/*  case "delete":
      if(confirm("Are you sure you want to delete this account???")){
          if(prompt(`please type \'${USSRdata[thing].name}\' to continue.`) == USSRdata[thing].name){
              if(confirm('this is your final warning. Please ensure your account is backed up.')){
    const USSRquickTemp2 = Math.random();
    localStorage.setItem("deled_backup_" + USSRquickTemp2, JSON.stringify(USSRdata[thing]));
    USSRdata = USSRdata.slice(1, 1);
    USSRsave();
    alert("thank you for using accounts+ \n Well, too bad, we still saved a back up just in case in local storage at: \"deled_backup_" + USSRquickTemp2 + "\".\nThe page will reload when you click ok");
    console.log(JSON.stringify(USSRdata))
    window.location.reload();

              } else {
                  break;
              }
          } else {
              break;
          }
      }else{
          break;
      }
    break;*/
  case null: 
    return 0;
    break;
  case "":
    return 0;
    break;
  default:
    alert("sorry, \"" + USSRdoPrompt + "\" is not one of the options :( \nall lowercase, btw");
}
    
}