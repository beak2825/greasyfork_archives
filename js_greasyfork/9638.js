// ==UserScript==
// @name          MixCloud Download
// @version       1.40
// @description   Simple script that adds a download button on mixcloud.com
// @author        FuSiOn
// @match         https://www.mixcloud.com/*
// @require       https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @grant         GM_download
// @grant         GM_addStyle
// @namespace https://greasyfork.org/users/10999
// @downloadURL https://update.greasyfork.org/scripts/9638/MixCloud%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/9638/MixCloud%20Download.meta.js
// ==/UserScript==
var DL_B64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAJdnBBZwAAADMAAAAzAGNXrToAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTUtMTAtMjRUMjA6MjQ6MjcrMDI6MDDJ+GNnAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE1LTEwLTI0VDIwOjI0OjI2KzAyOjAwHtLQbwAAACF0RVh0Q3JlYXRpb24gVGltZQAyMDE1OjEwOjI0IDIwOjI0OjQ1I9WmGwAAA6VJREFUaEPtms8rdFEYx597h8SC2dgzJNlK8wdINiJGyWJYUP4DYmWD4Q9QysYoYjMpW8rSAiuapojsKFEo+THv+z3vc3Tf686495yDGc2n5JznnvOc53vuufeeH2Nl/0IG2NnZof39fUqn0/T09MRWbyoqKqi5uZmi0Si1t7ezVQ9tIefn5zQxMcE5oufnZyovL+ecN+4y8/PzVFdXxzk1tITc3t7S2NgY54je3t7Itm3O5cdddmlpicLhMOeC46/VHGxubnLqH35FAHdZt6+gKAtBj+K5kGlVZF340vGjLOTm5oZTwe6EG2ddp8+gKEfw8vLCKXPo+FQWYlkWp8yh41N9TBQYJSGFRklIoaEsxNBc8z90fJbuSKFREvJrvuy/5mEPhUKcMoeOT2UhlZWVnDKHjs+cS91MJkPX19f0+voqxq4cv+g1LEnPzs4omUwKmymGhoYoEomIJTTaBQgPf2i3traWmpqahN2NpxAEOTk5ybnCYm5uToh14zm0UNCpXPaOzlI0KLIt2TZATF4iQN5dlKmpKTo5ORH7UD8J9slaWlpodnaWLR/J+7CjIhx8tuH2lfgRAXzta+HOnJ6ecu57aWho+FQE8L1Bt7CwQAcHB5z7HlpbW2l8fJxz+fEtBGxtbdHq6uqXfAyd4AGPx+PU09PDls8J9EGEYzTw8PDAFvPAd1ARIPCXHQ2Mjo7S/f09W8wBn/AdVAQINLScpFIpWllZMfZqxttpeHiYent72RIMZSEAYtbX17Wn9AhhcHBQWQRQnjQCNIwANPrCiAigJQQggIGBASUxqIO6uiKAthAQi8Wos7MzkBiURR3UNYERIWBkZITq6+t9TSxRBmVRxxQh27an19bW6PLyktra2tisRkdHBx0eHor1BHrc/RKQNsxgcW6oy+LiIi0vL9PR0RHZx8fHouG9vT2+rEcikRAHm15vMthwDWVMgJgROzQYG1pOcvV2Y2OjkTvhhS3HdHV1tfhvio2NDerr6+McifTMzAznzCBjhgarv78/i3M8rMNxRFxM4GgcQwtCbLmU1DnQ/ClkzNDwHv1PL2dVcMb8LqSsrIxTxYMzZlsukq6ursT/YkLGDA324+OjMGAavbu7Ky4UA4hVbopAgxWNRrP4tQ7e8ZK7uztxEQ+RvGPO/SWQb7nrvIZfAcG/E7cvJ7nakbFUVVVRTU2NsEkuLi7ISiaT2e3tbTYVJ11dXWRjfdzd3f2h14oBxIzY4/E4/QFXc7RoQ80nZQAAAABJRU5ErkJggg==';
var CSS    = '.card-cloudcast.card-cloudcast-block-icons .card-footer .button.card-button.light-icon {padding: 0 5px 0 39px;}\n' +
             '.button-download {border-bottom:none!important;border-top: none!important;background-size:45%;width:25px;background-repeat:no-repeat;background-position:12px;background-image:url("' + DL_B64 + '")}\n' +
             '.card-footer {display:flex;align-items:center;justify-content:center;}\n'
$(document).ready(function(){
    GM_addStyle(CSS);
    $('[m-preview]').each(function(){
       addDL(this)
    });
    $('.button-download').on('mouseenter',function(){
        $(this).append('<span class="tooltip top" style="margin-left: -32px;">Download</span>');
    });
    $('.button-download').on('mouseleave',function(){
        $('.tooltip',this).remove();
    });
});
$(document).on('DOMNodeInserted', function(e) {
    var element = e.target;
    if($(element).find('[m-preview]').length > 0 && $(element).find('.button-download').length === 0){
        addDL($('[m-preview]',element));
    }
});
function addDL(node){
    var container = $(node).parents('.container,.card-elements-container')[0],
        loc       = $(node).attr("m-preview")
                           .replace(/audiocdn\d+/,"stream13")
                           .replace(/mp3$/,"m4a")
                           .replace(/previews/,"c\/m4a\/64");
    $('.button-favorite',container).after("<a href='" + loc  + "' class='button card-button button-download cf ng-scope' m-tooltip='Download' download target='_blank'></a>");
}
if(typeof GM_download  !== 'undefined'){
    $(document).on('click','.button-download',function(e){
        e.preventDefault();
        var arg = { url: $(this).attr('href'),
                   name: $(this).parents('.card-elements-container').find('.card-cloudcast-title span').text() + ".m4a",
                   saveAs: true,
                   onerror: function(e){
                       if(e.details !== "USER_CANCELED"){
                           console.log(e);
                       }
                   }
                  };
        GM_download(arg);
    });
}