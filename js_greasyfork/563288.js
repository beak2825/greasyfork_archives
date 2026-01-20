// ==UserScript==
// @name         Open ATI modules in New Tab
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license      MIT
// @description  Redirect navigation to ATI modules into a new tab instead of the current one
// @author       beepbopboop
// @match        *://student.atitesting.com/Products
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563288/Open%20ATI%20modules%20in%20New%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/563288/Open%20ATI%20modules%20in%20New%20Tab.meta.js
// ==/UserScript==


(function () {
    'use strict';

    // For normal modules like the Foundations ones
    const origPackageAJAXCall = Common.PackageAJAXCall;
    Common.PackageAJAXCall = function (Category, ServiceMethod, HttpVerbType, Data, ErrorFunction, DoneFunction, DontBlockUI, IncludeSessionKey) {
        if (ServiceMethod === 'TestPrepLMSActivity') {
            const NewDoneFunction = function (Content, Status, Result) {
                try {
                    window.open(Content.TestPrepLMSActivityResult, '_blank', 'noopener');
                }
                catch (e) {
                    Common.LogExceptionMessage(e.message);
                    ProductsVM.ErrorMessage(e.message);
                }
            }
            return origPackageAJAXCall(Category, ServiceMethod, HttpVerbType, Data, ErrorFunction, NewDoneFunction, DontBlockUI, IncludeSessionKey);
        }
        else {
            return origPackageAJAXCall(Category, ServiceMethod, HttpVerbType, Data, ErrorFunction, DoneFunction, DontBlockUI, IncludeSessionKey);
        }
    };

    // For things called 'Tutorial's: intercept Common.Navigate
    const origNavigate = Common.Navigate;
    Common.Navigate = function (NewAction, NewInternalAction) {
        if (NewAction === 'Tutorial') {
            window.open('https://student.atitesting.com/Tutorial', '_blank', 'noopener');
            return false;
        } else {
            return origNavigate(NewAction, NewInternalAction);
        }
    };

})();
