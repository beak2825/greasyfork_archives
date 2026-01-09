// ==UserScript==
// @name NedFox KHR Style
// @namespace NedFoxKHR
// @version 1.0.6
// @description Customize pack&ship style
// @author Kevin van der Bij
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match https://retailvista.net/bztrs/packingportal*
// @match https://retailvista.net/bztrs/packingportal/Identity/Account/Login*
// @downloadURL https://update.greasyfork.org/scripts/555698/NedFox%20KHR%20Style.user.js
// @updateURL https://update.greasyfork.org/scripts/555698/NedFox%20KHR%20Style.meta.js
// ==/UserScript==

(function() {
let css = "";
if (location.href.startsWith("https://retailvista.net/bztrs/packingportal")) {
  css += `
      .mainContainerBorder {
          border: 1px solid #3e5f42;
      }
      .footer {
          background-color:#3e5f42
      }
      .searchDialog {
          background-color:#EFF6F3
      }
      .btn-primary {
          background-color:#689f69;
          border-color:#689f69
      }
      .btn-primary:hover {
          background-color:#537f5f;
          border-color:#537f5f
      }
      .btn-primary:focus, .btn-primary.focus {
          box-shadow:0 0 0 0.2rem rgb(104 159 105 / 25%)
      }
      .btn-primary:not(:disabled):not(.disabled):active:focus, .btn-primary:not(:disabled):not(.disabled).active:focus, .show > .btn-primary.dropdown-toggle:focus {
          box-shadow:0 0 0 0.2rem rgb(104 159 105 / 25%)
      }
      .btn-primary:not(:disabled):not(.disabled).active, .btn-primary:not(:disabled):not(.disabled):active, .show > .btn-primary.dropdown-toggle {
          background-color:#537f5f;border-color:#537f5f
      }
      .backButton {
          background-color:#689f69
      }
      .form-control:focus {
          box-shadow:0 0 0 0.2rem rgb(104 159 105 / 25%);border-color:#537f5f
      }
      .searchCarrierDialog {
          background-color:#EFF6F3
      }
      .alert-info {
          color:#537f5f;background-color:#EFF6F3;border-color:#537f5f
      }
      .searchProductDialog {
          background-color:#EFF6F3
      }
      .retailvista-packing-ui .btn-outline-primary:not(:disabled):not(.disabled).active {
          background-color:#689f69
      }
      .retailvista-packing-ui .btn-outline-primary:not(:disabled):not(.disabled).active {
          border-color:#689f69
      }
      .btn-link{color:#689f69}.btn-link:hover {
          color:#689f69
      }
      .retailvista-packing-ui .btn-outline-primary {
          border-color:#689f69
      }
      .retailvista-packing-ui .btn-outline-primary .tab-parcelnumber {
          color:#689f69
      }
      .btn-outline-primary:not(:disabled):not(.disabled):active:focus, .btn-outline-primary:not(:disabled):not(.disabled).active:focus, .show > .btn-outline-primary.dropdown-toggle:focus {
          box-shadow:0 0 0 0.2rem rgb(104 159 105 / 25%)
      }
      .btn-outline-primary:not(:disabled):not(.disabled):active:focus, .btn-outline-primary:not(:disabled):not(.disabled).active:focus, .show > .btn-outline-primary.dropdown-toggle:focus {
          box-shadow:0 0 0 0.2rem rgb(104 159 105 / 25%)
      }
      .btn-outline-primary:not(:disabled):not(.disabled):active, .btn-outline-primary:not(:disabled):not(.disabled).active, .show > .btn-outline-primary.dropdown-toggle {
          background-color:#EFF6F3;
          border-color:#537f5f
      }
      .retailvista-packing-ui .btn-outline-primary:hover {
          background-color:#EFF6F3;
          border-color:#537f5f
      }
      .btn-outline-primary:focus, .btn-outline-primary.focus {
          box-shadow: 0 0 0 0.2rem rgba(0, 0, 0, 0);
      }
      .btn:focus, .btn.focus {
          box-shadow: 0 0 0 0.2rem rgba(0, 0, 0, 0);
      }
      .nfLogoLarge {
          height:170px
      }
      .nfLogoSmall {
          height:85px
      }
      img.nfLogoLarge {
          height: 0 !important;
          width: 0 !important;
          /* these numbers match the new image's dimensions */
          padding-left: 244px !important;
          padding-top: 120px !important;
          background: url("https://i.imgur.com/SDrWPUV.png") no-repeat !important;
      }
      img.nfLogoSmall {
          height: 0 !important;
          width: 0 !important;
          /* these numbers match the new image's dimensions */
          padding-left: 122px !important;
          padding-top: 60px !important;
          background: url("https://i.imgur.com/rtFhJGI.png") no-repeat !important;
      }
      #add-parcel > img {
          height: 0 !important;
          width: 0 !important;
          /* these numbers match the new image's dimensions */
          padding-left: 42px !important;
          padding-top: 42px !important;
          background: url("https://i.imgur.com/zJ9sNJR.png") no-repeat !important;
      }
      body > div > div > div > div.d-flex.flex-column.h-100 > div.row.nfmlcomp > div:nth-child(3) > div > div > img {
          height: 0 !important;
          width: 0 !important;
          /* these numbers match the new image's dimensions */
          padding-left: 204px !important;
          padding-top: 34px !important;
          background: url("https://i.imgur.com/xtIKtxu.png") no-repeat !important;
      }
      .text-muted {
          color: lightgray !important;
      }
      .form-control:disabled, .readonlyInput[readonly] {
          background-color: #eff6f3;
      }
  `;
}
if (location.href.startsWith("https://retailvista.net/bztrs/packingportal/Identity/Account/Login")) {
  css += `
          body > div > div > div > div > div:nth-child(1) > div > img {
          height: 0 !important;
          width: 0 !important;
          /* these numbers match the new image's dimensions */
          padding-left: 204px !important;
          padding-top: 34px !important;
          background: url("https://i.imgur.com/xtIKtxu.png") no-repeat !important;
      }
  `;
}
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
