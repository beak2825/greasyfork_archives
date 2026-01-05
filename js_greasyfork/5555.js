// ==UserScript==
// @name        Lovoo Verified Members
// @name:de		Lovoo Suche nach verifizierten Benutzern
// @description You can search verified Members
// @description:de Ermöglicht die Suche nach verifizierten Mitgliedern
// @namespace   lovoo.com
// @author      wehmoen
// @include     http*://www.lovoo.com/search
// @version     1.3.2
// @grant       none
// @license		MIT License (Expat)
// @homepageURL https://github.com/wehmoen/UserScipts
// @supportURL  https://github.com/wehmoen/
// @icon        https://raw.githubusercontent.com/wehmoen/UserScipts/master/icons/lovoo.ico
// @downloadURL https://update.greasyfork.org/scripts/5555/Lovoo%20Verified%20Members.user.js
// @updateURL https://update.greasyfork.org/scripts/5555/Lovoo%20Verified%20Members.meta.js
// ==/UserScript==
$(function () {
    
    var language = $("html").attr("lang");
    switch(language) {
        case 'de':
            var text = "Nur verifizierte Mitglieder";
            break;
        case 'en':
            var text = "Only verified members";
            break;
        default:
            throw new Error("unsuporrtet language " + language);
            break;
    }
    $('#isVerified').parent().parent().remove();
    $("label:contains('Aktivität und Qualität'),label:contains('Activity and status')").parent().append('<div class="checkbox"><label for="cIsVerified" class="text-normal space-right-sm ng-binding"><input type="checkbox" id="cIsVerified"></input>' + text + '</label></div>');
    $('*').mousemove(function () {
        if ($('#cIsVerified').prop('checked') == true) {
            $('.search-results').children('.ng-isolate-scope').children('.white-box').children('.thumbnail-box').children('.col-xs-3').each(function () {
                if (!$(this).children('.thumbnail-user').children('a').children('span[ng-if=\'user.verified\']').length) {
                    $(this).remove();
                }
            });
        }
    });
});
