// ==UserScript==
// @name         PCD15
// @namespace    https://kcw.kddi.ne.jp
// @include      https://kcw.kddi.ne.jp/*
// @version      1.4.5
// @description  Just for fun :)
// @author       Galac
// @match        https://kcw.kddi.ne.jp/*
// @match        https://www.chatwork.com/*
// @grant        none
// @require      https://greasyfork.org/scripts/9683-rabbit-encrypt/code/Rabbit%20encrypt.js?version=50281

// @downloadURL https://update.greasyfork.org/scripts/9684/PCD15.user.js
// @updateURL https://update.greasyfork.org/scripts/9684/PCD15.meta.js
// ==/UserScript==

var passphrase = '';

function encrypt(mes) {
    if (passphrase != '') {
        var encrypted = CryptoJS.Rabbit.encrypt(mes, passphrase);
        return "Pcd15@" + encrypted;
    } else {
        return mes;
    }
}

function decrypt(textEncrypt) {
    if (passphrase != '') {
        try {
            var decrypted = CryptoJS.Rabbit.decrypt(textEncrypt, passphrase);
            return decrypted.toString(CryptoJS.enc.Utf8);
        } catch (e)
        {
            console.log("Error:" + e.message);
            return "Error format!";
        } 

    } else {
        return textEncrypt;
    }
}


function validUrl() { //just accept rooms, users with a filter
    var acceptLinks = ["rid19625982", "rid32581066","rid33506770"]; //array text of url acceptable
    var currentUrl = window.location.href;
    if (acceptLinks.length > 0){
        for (var i = 0; i< acceptLinks.length; i++){
            if (currentUrl.indexOf(acceptLinks[i]) != -1) {
                return true;
            }
        }
        return false;
    }
    else return false;
}
function convert(encrypt_text){
// check valid TO
var value='';
var valid_tag = ['[To' ,'[Reply'];
for(i=0;i<valid_tag.length;i++){
	if (encrypt_text.indexOf(valid_tag[i]) == 0){
		value += encrypt_text.substr(0, encrypt_text.indexOf("\n"));
        value += '\n';
		value += encrypt(encrypt_text.substr(encrypt_text.indexOf("\n")));
		return value;
	}
}
   if (encrypt_text.indexOf('[Quo') == 0) {
       console.log( encrypt_text.lastIndexOf('[/Quote]'));
        value += encrypt_text.substr(0, encrypt_text.lastIndexOf('[/Quote]')+8);
       console.log(encrypt_text.substr(encrypt_text.lastIndexOf('/Quote]')+8));
		value += encrypt(encrypt_text.substr(encrypt_text.lastIndexOf('/Quote]')+8));
		return value;
    }
return encrypt(encrypt_text);
}
$(function() {
    //Get Passphase
    //var url = "https://108.61.181.151/getpp";
    var url = "https://yourpigeon.biz/getpp";
    var data = {
        id :  '12345',
        pcode : '0000'
    }
    var puid = myid != null ? myid : '12345';
    data.id = puid;
    var pcodeToday = prompt("Private code today!");
    if (pcodeToday != null) {
        data.pcode = pcodeToday;
    }

    try {
        //Ajax get passphase
        $.ajax({
            type: "POST",
            url: url,
            data: data,
            dataType: 'json',
            success: function (result){
                if (result.status == "0") {
                    passphrase = result.data.pass_phase;
                }
            },
            error: function (){
                var winPr = window.open('http://108.61.181.151:3000/guide', '_blank');
                winPr.focus();
            }
        });
    } catch (e) {
        var winPr = window.open('http://108.61.181.151:3000/guide', '_blank');
        winPr.focus();
    }


    $('#_chatText').on('keydown', function(e){
        if (e.which == 13) {
            if (e.altKey) { // alt/option key is down
                if (validUrl()) {
                    //if (this.value.indexOf('Pcd15@') ==  -1 ) {
                        var encrT = convert(this.value);
                        this.value = encrT;
                        e.preventDefault();
                    //}
                }
            }
        }
    });
    $("#_chatContent").on('mouseover', 'div.chatTimeLineMessageArea', function(e){
        if (validUrl()) {
            //Add title
            var pre =$(e.target);
            if (!pre.attr('dataDec')){
                text = pre.clone().children().remove().end().text();
                if (text.indexOf('Pcd15@') != -1) {
                    var encrptVal = text.substr(text.indexOf('Pcd15@')+6);
                    var decryptVal = decrypt(encrptVal);
                    pre.attr('title', decryptVal);
                    pre.attr('dataDec', 1);
                }
            }
        }

    });

});
