// ==UserScript==
// @name             Twitter(X): Select the Following tab
// @name:ja          Twitter(X): ホームでフォロー中タブを選択する
// @description      Simply select the "Following" (フォロー中) tab after the home of Twitter(X) is loaded.
// @description:ja   Twitter(X)のホームを開いた際にフォロー中タブを選択するだけのスクリプト
// @include     https://x.com/home
// @include     https://twitter.com/home
// @license      MIT
// @author           wettoast4
// @version          1.0
// @namespace https://greasyfork.org/users/1548650
// @downloadURL https://update.greasyfork.org/scripts/559076/Twitter%28X%29%3A%20Select%20the%20Following%20tab.user.js
// @updateURL https://update.greasyfork.org/scripts/559076/Twitter%28X%29%3A%20Select%20the%20Following%20tab.meta.js
// ==/UserScript==


// 残念ながらXのページは表示直後即座に読み込まれず@run-atでは徐々に追加されたタブが全部読み込まれたことを検知できないようなので、
// ページ表示後にタブが2つ以上つくられたことを検知してから2番目のフォロー中タブをクリックする

// そのままsetTimeout使うとディレクティブ違反とか言われるのでasyncとpromise使うようにした

// parameters
let cycle_count = 0;
const cycle_limit = 100;
const wait_ms = 1000; // waiting duration (milli seconds)

(async () => {
  // recursively check how many tabs loaded until  more than 2 tabs appear.
  while (document.querySelectorAll("div [role='tab']").length < 2 && cycle_count < cycle_limit) {
    await new Promise(resolve => setTimeout(resolve, wait_ms));
    cycle_count = cycle_count + 1;
  }
  // タブはrole=tabをもつdiv要素で、2つ目のタブが"フォロー中"タブ。これをクリックするだけ。(possibly the second div elem with role="tab" is the "following" tab. just find and click it)
  document.querySelectorAll("div [role='tab']")[1].click();

})();