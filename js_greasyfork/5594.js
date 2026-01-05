// ==UserScript==
// @name        Fixed Preview Button for PMs
// @namespace   Selbi
// @include     http*://*fimfiction.net/manage_user/messages/*
// @version     2
// @description Adds a button to preview PMs. Fixed for the new update by arcum42.
// @downloadURL https://update.greasyfork.org/scripts/5594/Fixed%20Preview%20Button%20for%20PMs.user.js
// @updateURL https://update.greasyfork.org/scripts/5594/Fixed%20Preview%20Button%20for%20PMs.meta.js
// ==/UserScript==

var previewButton = '<a class="styled_button styled_button_blue" href="javascript:void(0);" id="preview_comment"><i class="fa fa-eye"></i> Preview Reply</a></div></div></form>';
var previewBox = '<div id="comment_preview" class="hidden" style="border-top:1px solid #BBB;"></div><script>$(document).on( "click", "#preview_comment", function( e ){$.post(\'/ajax/preview_comment.php\',{ "comment" : $("#comment_comment").val( ) },function( data ) { if ( "error" in data ){ShowErrorWindow( data.error );}else{ $("#comment_preview").html( data.comment ); $("#comment_preview").fadeIn( );}} );} );</script>';

$(".add_comment_toolbar .comment_processing").before(previewButton);
$(".add_comment_toolbar").after(previewBox);