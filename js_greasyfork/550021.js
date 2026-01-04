// ==UserScript==
// @name         Github一键返回顶部
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Github返回顶部
// @author       JIAHE
// @match        https://github.com/*
// @grant        none
// @license      GPL-3.0 License
// @sandbox      JavaScript
// @run-at       document-end
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAACEUExURUxpcRgWFhsYGBgWFhcWFh8WFhoYGBgWFiUlJRcVFRkWFhgVFRgWFhgVFRsWFhgWFigeHhkWFv////////////r6+h4eHv///xcVFfLx8SMhIUNCQpSTk/r6+jY0NCknJ97e3ru7u+fn51BOTsPCwqGgoISDg6empmpoaK2srNDQ0FhXV3eXcCcAAAAXdFJOUwCBIZXMGP70BuRH2Ze/LpIMUunHkpQR34sfygAAAVpJREFUOMt1U+magjAMDAVb5BDU3W25b9T1/d9vaYpQKDs/rF9nSNJkArDA9ezQZ8wPbc8FE6eAiQUsOO1o19JolFibKCdHGHC0IJezOMD5snx/yE+KOYYr42fPSufSZyazqDoseTPw4lGJNOu6LBXVUPBG3lqYAOv/5ZwnNUfUifzBt8gkgfgINmjxOpgqUA147QWNaocLniqq3QsSVbQHNp45N/BAwoYQz9oUJEiE4GMGfoBSMj5gjeWRIMMqleD/CAzUHFqTLyjOA5zjNnwa4UCEZ2YK3khEcBXHjVBtEFeIZ6+NxYbPqWp1DLKV42t6Ujn2ydyiPi9nX0TTNAkVVZ/gozsl6FbrktkwaVvL2TRK0C8Ca7Hck7f5OBT6FFbLATkL2ugV0tm0RLM9fedDvhWstl8Wp9AFDjFX7yOY/lJrv8AkYuz7fuP8dv9izCYH+x3/LBnj9fYPBTpJDNzX+7cAAAAASUVORK5CYII=
// @downloadURL https://update.greasyfork.org/scripts/550021/Github%E4%B8%80%E9%94%AE%E8%BF%94%E5%9B%9E%E9%A1%B6%E9%83%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/550021/Github%E4%B8%80%E9%94%AE%E8%BF%94%E5%9B%9E%E9%A1%B6%E9%83%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let css=`
           .back2top {
            cursor: pointer;
           	bottom: 1vw;
           	position: fixed;
           	right: 1vw;
           	font-family: 'Open Sans', sans-serif;
           	padding: 0;
           	font-size: inherit;
           	color: inherit;
           	box-sizing: inherit;
           	backface-visibility: hidden;
           	-webkit-font-smoothing: antialiased;
           	text-decoration: none;
           	transition: all 0.35s;
           	transition-timing-function: cubic-bezier(0.31, -0.105, 0.43, 1.59);
           	display: inline-block;
           	background-color: #fff;
           	width: 50px;
           	height: 50px;
           	line-height: 50px;
           	margin: 0 10px;
           	text-align: center;
           	overflow: hidden;
           	border-radius: 28%;
           	box-shadow: 0 5px 15px -5px rgba(0,0,0,0.45);
           	opacity: 0.99;
           	background-position: center;
           	background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAAAXNSR0IArs4c6QAABYNJREFUeF7tncmuW0UQhv+W7yMgJJQ1m2TBgnkmzPOc7HgE1NWyxA6xYMXiysd5CpQwQxjCPENgA9KNxAuEBQ/AymrkKFfA1Y1d7T62T3X9Xledc/7//7rO4CmAL9cOBNfqKR4EwDkEBIAAOHfAuXxOAALg3AHn8jkBCIBzB5zL5wQgAM4dcC6fE4AAOHfAuXxOAALg3AHn8jkBCIBzB5zL5wQgAM4dcC6fE4AAOHfAuXxOAALg3AHn8jkBCIBzB5zL5wQgAM4dcC6fE4AAOHfAuXxOAALg3AHn8jkBCIBzB5zL5wQgAM4dcC6fE4AA+HNARF4B8AKAqwH8BuDlruu+8ucE/P1EjIh8CeCeQ8I+7hECV6cAEfkawF0LVro7CNwAICLfALhTMeZdQeACABH5FsAdivD3S9xA0DwAIvIdgNsLwncFQdMAiMgPAG5dIXw3EDQLQIzxxxDCLRXhu4CgSQBE5CcANyvC3wNwTFHX7DVBcwCIyM8AblKEujcajU7OZrPTniFoCgAR+QXADdrwd3d3L4zH46OeIWgGABH5FcD1JeHv13qGoAkAVln5B0HxCoF5AETkPIAbV1n5hMD4m0ExxvMhhF7C93o6MDsBSq/25xd8iilxqcTT6cAkACX3+fNbvZLwvU0CcwAUPOG7dJ+/SvieIDAFQMGz/erwvUBgBoCU0vc559sU5/HewvcAgQkACt7S7T381iEYPABDCL9lCAYNQMEneda28lt/WDRYAAo+w7ex8FucBIMEQPHp3f0sNh5+axAMDgARmX9B4+5tXO0r9vm/khaeGA4KgAVf2jiYzdZWfmvXBIMBwGL4LZwOBgFAjPGLEMJxxQgezMpvZRJsHQAR+RzAvZbDtzwJtgpASumznPN9LYRvFYKtASAinwK4v6XwLUKwFQBE5ByAB1oM3xoEGwcgxnguhNB0+JYg2CgAIvIJgAdbXvnW7g42BoCIfAzgIU/hW5gEGwEgxvhRCOFhj+EPHYK1AyAiHwJ4xHP4Q4ZgrQCklM7mnB9l+P86MLQ3kNYGQIzxbAiB4R9C/5AgWAsAIvIBgMe48q/swFAg6B2AlNL7OefHGf5yB4YAQa8AiMh7AJ5YLh2DfVdPcey9lmwbgt4AEJF3ATypcIfhHzBpmxD0AoCIvAPgKYavcOAKJduCoBoAEXkbwNMK6Vz5S0zaBgRVADB8BfaFJZuGYGUAYoxvhRCeUejjyleY9N+STUKwEgAi8iaAZxW6GL7CpMNKNgVBMQAppTdyzs8pdDF8hUmLSjYBQREAInIGwPMKXQxfYZKmZN0QqAFIKZ3OOZ9QHDTDV5hUUlICwWg0OlbyqygqAETkNQAvKQ6a4StMWqWkAIK9+S+nTSaTvzX7WQrAeDy+ajab/aXYGMNXmFRTooUg53zddDr9XbOvpQCIyPwPluZ/tLToxfA1bvdQo4Gg5DSgAeAaABcXHDvD7yHYkk0sgiCEcGYymZzUbm8pAPMNLfjiJsPXOt1z3WUIugPfr7jYdd2Rkl2pALgMwSkAL+5vPOf8+s7OzqslV5wlB8ZanQMxxhMhhKM55wvT6XR+m170UgMw32pK6UjO+VoAf3Rd92fRnlg8SAeKABikAh5UlQMEoMo++80EwH6GVQoIQJV99psJgP0MqxQQgCr77DcTAPsZVikgAFX22W8mAPYzrFJAAKrss99MAOxnWKWAAFTZZ7+ZANjPsEoBAaiyz34zAbCfYZUCAlBln/1mAmA/wyoFBKDKPvvNBMB+hlUKCECVffabCYD9DKsUEIAq++w3EwD7GVYpIABV9tlvJgD2M6xSQACq7LPfTADsZ1ilgABU2We/mQDYz7BKAQGoss9+MwGwn2GVAgJQZZ/9ZgJgP8MqBf8Aq+r9n3aJFIMAAAAASUVORK5CYII=');
           	background-repeat: no-repeat;
           	background-size: 50%;
           }
           .back2top:hover {
           background-color: var(--bgColor-muted);
           }
    `;
    document.getElementsByTagName('style')[0].textContent+=document.getElementsByTagName('style')[0].textContent+css; // 第一个style内容
    let body = document.querySelector('body');
    let a=document.createElement('i');
    a.className='back2top';
    a.style.display='none'
    body.appendChild(a);
    let now =document.documentElement.scrollTop||document.body.scrollTop;
    if(now>window.innerHeight){
       a.style.display='block';
    }
    a.onclick=function(){
        window.scrollTo({
           top: 0,
           behavior: 'smooth',
        });
      return false;
    }
    window.onscroll=function(){
      let t =document.documentElement.scrollTop||document.body.scrollTop;
      if(t > window.innerHeight){
          //滚动到完一页后显示回到顶部
          a.style.display='block';
      }else{
          a.style.display='none';
      }
    }
})();