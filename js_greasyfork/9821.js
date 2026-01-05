// ==UserScript==
// @name        Extra Smileys
// @namespace   pxgamer
// @description Adds more smileys to KAT
// @include     *kickass.to/*
// @include     *kat.cr/*
// @author      pxgamer
// @version     2.11
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/9821/Extra%20Smileys.user.js
// @updateURL https://update.greasyfork.org/scripts/9821/Extra%20Smileys.meta.js
// ==/UserScript==


$(window).load(function(){
    // Settings
    var showFacebookReactions = true;
    // End Settings

    $('.bbedit-smileybar').append('<img title="Smoking" class="cusSmile" alt="smoke" src="https://pximg.xyz/images/e3f6c9546b0b85138856a654b6acee85.gif" />');
    $('.bbedit-smileybar').append('<img title="Headbanger" class="cusSmile" alt="headbang" src="https://pximg.xyz/images/96c98c900ddcd6c8b14177ffba06ed13.gif" />');
    $('.bbedit-smileybar').append('<img title="Mooning" class="cusSmile" alt="mooning" src="https://pximg.xyz/images/4bb967650d41ff6bcd58ac203a797235.gif" />');
    $('.bbedit-smileybar').append('<img title="Squirrel" class="cusSmile" alt="squirrel" src="https://pximg.xyz/images/3bd96c8fcc699c381f6263e295ad225b.gif" />');
    $('.bbedit-smileybar').append('<img title="Ninja" class="cusSmile" alt="ninja" src="https://pximg.xyz/images/0b914e135932cd0da66df267f2d84b34.gif" />');
    $('.bbedit-smileybar').append('<img title="Beer" class="cusSmile" alt="beer" src="https://pximg.xyz/images/6ad8bb13eb3b86c55f624073fd229599.gif" />');
    $('.bbedit-smileybar').append('<img title="Drink" class="cusSmile" alt="drink" src="https://pximg.xyz/images/8a6854009cf40e59a13fc22da1e2f8ae.gif" />');
    $('.bbedit-smileybar').append('<img title="Cake" class="cusSmile" alt="cake" src="https://pximg.xyz/images/9f53064bb76f3774b1c6247453afc715.gif" />');
    $('.bbedit-smileybar').append('<img title="Pizza" class="cusSmile" alt="pizza" src="https://pximg.xyz/images/7edc71a4e28a5b9aabb6e9aaec406a9a.gif" />');
    $('.bbedit-smileybar').append('<img title="Rain" class="cusSmile" alt="rain" src="https://pximg.xyz/images/b7a972fb35d04e321f553f29a31899c8.gif" />');
    $('.bbedit-smileybar').append('<img title="Mail" class="cusSmile" alt="mail" src="https://pximg.xyz/images/0637181b7e39d789e56e45806bc6ac9e.gif" />');
    $('.bbedit-smileybar').append('<img title="Music" class="cusSmile" alt="music" src="https://pximg.xyz/images/16457a3f98d886e7ecb1578f954b38c7.gif" />');
    $('.bbedit-smileybar').append('<img title="Phone" class="cusSmile" alt="phone" src="https://pximg.xyz/images/2534b7ba848c018453470f35d939abd3.gif" />');
    $('.bbedit-smileybar').append('<img title="Weed" class="cusSmile" alt="weed" src="https://pximg.xyz/images/95b0ba9220b7b028454762061b3de42b.gif" height="19px" width="19px" />');
    $('.bbedit-smileybar').append('<img title="MLP Headless" class="cusSmile" alt="mlph" src="https://pximg.xyz/images/0b1b423c2a1bde8e3d1f50d125c4808b.gif" height="19px" width="19px" />');
    $('.bbedit-smileybar').append('<img title="Coffee" class="cusSmile" alt="coffee" src="https://pximg.xyz/images/b9587160dd9dd695e26583af17287561.gif" />');
    $('.bbedit-smileybar').append('<img title="Puke" class="cusSmile" alt="puke" src="https://pximg.xyz/images/bf20c58502857123051dc81c7aa3d9be.gif" height="19px" width="19px" />');
    if (showFacebookReactions) {
        $('.bbedit-smileybar').append('<img title="Like" class="cusSmile" alt="like" src="https://pximg.xyz/images/3f1329531b8f6f711a48d2af49087c0a.gif" height="19px" width="19px" />');
        $('.bbedit-smileybar').append('<img title="Love" class="cusSmile" alt="love" src="https://pximg.xyz/images/56f517e6f066e780ebf811b7cdea1ad2.gif" height="19px" width="19px" />');
        $('.bbedit-smileybar').append('<img title="Haha" class="cusSmile" alt="haha" src="https://pximg.xyz/images/9fd8b1149f9849a5ff8bad6a68efe710.gif" height="19px" width="19px" />');
        $('.bbedit-smileybar').append('<img title="Yay" class="cusSmile" alt="yay" src="https://pximg.xyz/images/c4d463e867cb4cb7b646f90b16ca7dde.gif" height="19px" width="19px" />');
        $('.bbedit-smileybar').append('<img title="Wow" class="cusSmile" alt="wow" src="https://pximg.xyz/images/29987c9c302f9e384c875072bc8da501.gif" height="19px" width="19px" />');
        $('.bbedit-smileybar').append('<img title="Sad" class="cusSmile" alt="sad" src="https://pximg.xyz/images/b56edce73736263e324a3a7d70e4ce0d.gif" height="19px" width="19px" />');
        $('.bbedit-smileybar').append('<img title="Angry" class="cusSmile" alt="angry" src="https://pximg.xyz/images/5084d023faa8af5ee9bacfbfcfea7055.gif" height="19px" width="19px" />');
    }

    jQuery.fn.extend({
        insertAtCaret: function(myValue){
            return this.each(function(i) {
                if (document.selection) {
                    //For browsers like Internet Explorer
                    this.focus();
                    var sel = document.selection.createRange();
                    sel.text = myValue;
                    this.focus();
                }
                else if (this.selectionStart || this.selectionStart == '0') {
                    //For browsers like Firefox and Webkit based
                    var startPos = this.selectionStart;
                    var endPos = this.selectionEnd;
                    var scrollTop = this.scrollTop;
                    this.value = this.value.substring(0, startPos)+myValue+this.value.substring(endPos,this.value.length);
                    this.focus();
                    this.selectionStart = startPos + myValue.length;
                    this.selectionEnd = startPos + myValue.length;
                    this.scrollTop = scrollTop;
                } else {
                    this.value += myValue;
                    this.focus();
                }
            });
        }
    });

    $('.cusSmile').click(function(){ $('textarea',$(this).closest('form')).insertAtCaret( '[img width="19px" height="19px"]'+ $(this).attr('src') +'[/img]' );});
});
