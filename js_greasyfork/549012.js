// ==UserScript==
// @name        Iconfont icon-size
// @namespace   https://greasyfork.org/users/681572-q962
// @match       https://www.iconfont.cn/search/index*
// @grant       GM_addStyle
// @version     1.0
// @author      q962_
// @description 调整预览的图标大小
// @description:zh-CN 调整预览的图标大小
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/549012/Iconfont%20icon-size.user.js
// @updateURL https://update.greasyfork.org/scripts/549012/Iconfont%20icon-size.meta.js
// ==/UserScript==

let class_id = 'a' + Math.random().toString().substr(2);

GM_addStyle(`

  .${class_id}-input {
    width: 8em;
  }

`);

let styleElement;
function updateStyle(size){
  removeStyle();
  styleElement = GM_addStyle(`

    .icon-twrap > svg {
      width: ${size}px !important;
      height: ${size}px !important;
    }

  `);
}
function removeStyle(){
  if(styleElement) { styleElement.remove();styleElement = null; }
}

function CLASS(c){
  return class_id+'-'+c;
}

function AppendElem(){
  let wrapElem = document.querySelector('.block-search-filter-content');

  let inputElem = document.createElement('input');
  inputElem.type = 'number';
  inputElem.classList.add(CLASS('input'));
  inputElem.addEventListener("change", (event) => {
    updateStyle(inputElem.value);
  });

  let btn20Elem = document.createElement('button');
  btn20Elem.innerText = '20px';
  btn20Elem.addEventListener("click", (event) => {
    updateStyle(20);
  });
  let btn40Elem = document.createElement('button');
  btn40Elem.innerText = '40px';
  btn40Elem.addEventListener("click", (event) => {
    updateStyle(40);
  });

  let btnRemove = document.createElement('button');
  btnRemove.innerText = 'Default';
  btnRemove.addEventListener("click", (event) => {
    removeStyle();
  });

  wrapElem.insertBefore(inputElem, wrapElem.firstChild);
  wrapElem.insertBefore(btn20Elem, wrapElem.firstChild);
  wrapElem.insertBefore(btn40Elem, wrapElem.firstChild);
  wrapElem.insertBefore(btnRemove, wrapElem.firstChild);
}

////////////

let id=0;
id=setInterval(()=>{
  let wrapElem = document.querySelector('.block-search-filter-content');
  if(wrapElem) {
    AppendElem();
    clearInterval(id);
  }
}, 300);
