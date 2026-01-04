// ==UserScript==
// @name         zhan.TOEFL CSS modification
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  改善小站托福阅读体验部分字太小的问题
// @author       辣辣辣子鸡
// @match        https://top.zhan.com/toefl/read/practice.html*
// @match        https://top.zhan.com/toefl/read/start.html*
// @match        https://top.zhan.com/toefl/read/viewtext.html*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/552978/zhanTOEFL%20CSS%20modification.user.js
// @updateURL https://update.greasyfork.org/scripts/552978/zhanTOEFL%20CSS%20modification.meta.js
// ==/UserScript==

GM_addStyle(`
    .toefl_reading_content {
    width: 96% !important;
    left: 2% !important;
    }
    .toefl_reading_radio_right {
    padding: 0 !important;
    }

    /* 以下是字号调整，可以按照自己的需要修改 */
    /* 标题 */
    .read_title{
    font-size: 24px !important;
    }
    .title{
    font-size: 24px !important;
    }
    /* 正文 */
    .article {
    font-size: 22px !important;
    }
    /* 问题题干 */
    .toefl_reading_radio_left .question_option .q_tit {
    font-size: 20px !important;
    }
    /* 问题选项 */
    .question_option label {
    font-size: 20px !important;
    }
`)