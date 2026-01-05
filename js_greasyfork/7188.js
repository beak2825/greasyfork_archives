// ==UserScript==
// @name        toqif
// @namespace   https://github.com/alick9188
// @description Export Thu ecard transactions to QIF file
// @include     http://ecard.tsinghua.edu.cn/user/UserExDetails.do
// @version     1.0
// @downloadURL https://update.greasyfork.org/scripts/7188/toqif.user.js
// @updateURL https://update.greasyfork.org/scripts/7188/toqif.meta.js
// ==/UserScript==

/*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */
var saveAs=saveAs||typeof navigator!=="undefined"&&navigator.msSaveOrOpenBlob&&navigator.msSaveOrOpenBlob.bind(navigator)||function(view){"use strict";if(typeof navigator!=="undefined"&&/MSIE [1-9]\./.test(navigator.userAgent)){return}var doc=view.document,get_URL=function(){return view.URL||view.webkitURL||view},save_link=doc.createElementNS("http://www.w3.org/1999/xhtml","a"),can_use_save_link="download"in save_link,click=function(node){var event=doc.createEvent("MouseEvents");event.initMouseEvent("click",true,false,view,0,0,0,0,0,false,false,false,false,0,null);node.dispatchEvent(event)},webkit_req_fs=view.webkitRequestFileSystem,req_fs=view.requestFileSystem||webkit_req_fs||view.mozRequestFileSystem,throw_outside=function(ex){(view.setImmediate||view.setTimeout)(function(){throw ex},0)},force_saveable_type="application/octet-stream",fs_min_size=0,arbitrary_revoke_timeout=500,revoke=function(file){var revoker=function(){if(typeof file==="string"){get_URL().revokeObjectURL(file)}else{file.remove()}};if(view.chrome){revoker()}else{setTimeout(revoker,arbitrary_revoke_timeout)}},dispatch=function(filesaver,event_types,event){event_types=[].concat(event_types);var i=event_types.length;while(i--){var listener=filesaver["on"+event_types[i]];if(typeof listener==="function"){try{listener.call(filesaver,event||filesaver)}catch(ex){throw_outside(ex)}}}},FileSaver=function(blob,name){var filesaver=this,type=blob.type,blob_changed=false,object_url,target_view,dispatch_all=function(){dispatch(filesaver,"writestart progress write writeend".split(" "))},fs_error=function(){if(blob_changed||!object_url){object_url=get_URL().createObjectURL(blob)}if(target_view){target_view.location.href=object_url}else{var new_tab=view.open(object_url,"_blank");if(new_tab==undefined&&typeof safari!=="undefined"){view.location.href=object_url}}filesaver.readyState=filesaver.DONE;dispatch_all();revoke(object_url)},abortable=function(func){return function(){if(filesaver.readyState!==filesaver.DONE){return func.apply(this,arguments)}}},create_if_not_found={create:true,exclusive:false},slice;filesaver.readyState=filesaver.INIT;if(!name){name="download"}if(can_use_save_link){object_url=get_URL().createObjectURL(blob);save_link.href=object_url;save_link.download=name;click(save_link);filesaver.readyState=filesaver.DONE;dispatch_all();revoke(object_url);return}if(view.chrome&&type&&type!==force_saveable_type){slice=blob.slice||blob.webkitSlice;blob=slice.call(blob,0,blob.size,force_saveable_type);blob_changed=true}if(webkit_req_fs&&name!=="download"){name+=".download"}if(type===force_saveable_type||webkit_req_fs){target_view=view}if(!req_fs){fs_error();return}fs_min_size+=blob.size;req_fs(view.TEMPORARY,fs_min_size,abortable(function(fs){fs.root.getDirectory("saved",create_if_not_found,abortable(function(dir){var save=function(){dir.getFile(name,create_if_not_found,abortable(function(file){file.createWriter(abortable(function(writer){writer.onwriteend=function(event){target_view.location.href=file.toURL();filesaver.readyState=filesaver.DONE;dispatch(filesaver,"writeend",event);revoke(file)};writer.onerror=function(){var error=writer.error;if(error.code!==error.ABORT_ERR){fs_error()}};"writestart progress write abort".split(" ").forEach(function(event){writer["on"+event]=filesaver["on"+event]});writer.write(blob);filesaver.abort=function(){writer.abort();filesaver.readyState=filesaver.DONE};filesaver.readyState=filesaver.WRITING}),fs_error)}),fs_error)};dir.getFile(name,{create:false},abortable(function(file){file.remove();save()}),abortable(function(ex){if(ex.code===ex.NOT_FOUND_ERR){save()}else{fs_error()}}))}),fs_error)}),fs_error)},FS_proto=FileSaver.prototype,saveAs=function(blob,name){return new FileSaver(blob,name)};FS_proto.abort=function(){var filesaver=this;filesaver.readyState=filesaver.DONE;dispatch(filesaver,"abort")};FS_proto.readyState=FS_proto.INIT=0;FS_proto.WRITING=1;FS_proto.DONE=2;FS_proto.error=FS_proto.onwritestart=FS_proto.onprogress=FS_proto.onwrite=FS_proto.onabort=FS_proto.onerror=FS_proto.onwriteend=null;return saveAs}(typeof self!=="undefined"&&self||typeof window!=="undefined"&&window||this.content);if(typeof module!=="undefined"&&module.exports){module.exports=saveAs}else if(typeof define!=="undefined"&&define!==null&&define.amd!=null){define([],function(){return saveAs})}

/*global saveAs: false, Blob: false, window: false */
// We follow the IIFE pattern.
(function () {
    "use strict";
    var t, tb, td;
    t = window.document.getElementsByClassName('table1')[1];
    tb = t.children[0]; // tbody which holds all data rows
    td = t.parentNode.parentNode.previousSibling.previousSibling.children[0];
    td.innerHTML = '<input type="button" id="toqif" value="QIF" />';
    td.style.textAlign = 'right';
    td.onclick = function () {
        var trs, filecontent, datetrancnt,
            k, tr, place, inout, termnum, date, tran,
            dateline, tranline, memoline, srcline, clearline, endline,
            today, b, name;
        trs = tb.getElementsByTagName('tr');
        filecontent = "!Type:Oth A\n";
        // Record the ordinal number of a transaction in a day.
        datetrancnt = {};
        for (k = 1; k < Math.min(trs.length, 21); k += 1) {
            tr = trs[k];
            place = tr.children[1].children[0].innerHTML;
            inout = tr.children[2].children[0].innerHTML;
            termnum = tr.children[3].children[0].innerHTML;
            date = tr.children[4].children[0].innerHTML;
            tran = tr.children[5].children[0].innerHTML;
            if (datetrancnt[date] === undefined) {
                datetrancnt[date] = 1;
            } else {
                datetrancnt[date] += 1;
            }
            if (place.trim() === '') {
                place = '未知地点';
            }
            dateline = "D" + date.split('-').reverse().join('/') + "\n";
            tranline = "T" + ((inout === '领取圈存' || inout === '支付宝充值') ? '+' : '-') + tran.substring(1) + "\n";
            memoline = "M" + datetrancnt[date] + '.在' + place + '终端' + termnum + inout + "\n";
            if (inout === '消费') {
                if (/超市/.test(place)) {
                    srcline = 'L[支出:食品杂货]\n';
                } else {
                    srcline = 'L[支出:用餐]\n';
                }
            } else if (inout === '领取圈存') {
                srcline = 'L[中国银行借记卡]\n';
            } else if (inout === '自助缴费(学生公寓水费)') {
                srcline = 'L[支出:水电费:水]\n';
            } else if (inout === '支付宝充值') {
                srcline = 'L[余额宝]\n';
            } else {
                srcline = 'L[支出:杂项]\n';
            }
            clearline = "CR\n";
            endline = "^\n";
            filecontent += dateline + tranline + memoline + srcline + clearline;
            filecontent += endline;
        }

        today = new Date();
        b = new Blob([filecontent], {type: 'text/plain;charset=utf-8'});
        name = '校园卡.qif';
        //console.log(filecontent);
        saveAs(b, name);
    };
}());
