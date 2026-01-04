// ==UserScript==
// @name        Template
// @version     1.0
// @author      100000011101
// @description provide scratch when create new script
// @match       http://image.baidu.com/search/index*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @namespace https://greasyfork.org/users/160178
// @downloadURL https://update.greasyfork.org/scripts/554624/Template.user.js
// @updateURL https://update.greasyfork.org/scripts/554624/Template.meta.js
// ==/UserScript==

;(function () {
  // check https://www.javbus.com/SIMM-905 jQuery.fn.jquery
  //   compare:
  //   - $.noConflict()
  //   - $.noConflict(true)
  $.noConflict(true)
  jQuery(document).ready($ => {
    const internalCSS = styles =>
      $(`<style type="text/css">${styles}</style>`).appendTo("head")

    const externalCSS = href =>
      $(`<link href="${href}" rel="stylesheet"></link>"`).appendTo("head")

    const styles = ``

    $(document).ready(() => {
      internalCSS(styles)
    })
  })
})()
