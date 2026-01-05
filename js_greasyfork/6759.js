// ==UserScript==
// @name         WeiboCleaner
// @description  去掉微博广告
// @namespace    http://weibo.com/qiangtoutou
// @include      http://*weibo.com/*
// @grant        unsafeWindow
// @version      2015-12-06 17:04:00
// @downloadURL https://update.greasyfork.org/scripts/6759/WeiboCleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/6759/WeiboCleaner.meta.js
// ==/UserScript==
(function(){ 
    var $=function(selector){ 
        if(!(this instanceof $))return new $(selector);
        var list=document.querySelectorAll(selector);
        this.data= Array.prototype.slice.call(list);
        return this;
    }
    $.prototype={
        each:function(fn){
            for(var i=0,len=this.data.length;i<len;i++)    
                fn(this.data[i],i);
        },
        add:function(selector){
            this.data=this.data.concat($(selector).data);
            return this;
        },
        remove:function(){
            this.each(function(o){
                console.log(o,'被移除')
                o.remove();
            });
            return this;
        }
    }    
    setInterval(function(){
        $('#v6_pl_ad_bottomtip')
        .add('#v6_pl_rightmod_attfeed')//好友关注动态
        .add('#v6_pl_rightmod_rank')//亚洲好书榜实时趋势
        .add('#v6_pl_rightmod_updatev6')
        .add('#v6_TrustPagelet_Recom_MusicRank')
        .add('#v6_pl_content_biztips')
        .add('#v6_pl_rightmod_ads36')
        .add('#v6_pl_rightmod_ads35')
        .add('#WB_webim')
        .add('.WB_ad_tm2015')
        .add('[feedtype=ad]')
        .add('[node-type=feed_spread]')
        .add('#v6_trustPagelet_recom_member')
        .add('[node-type=recommendTopic]')
        .add('#v6_pl_rightmod_noticeboard').remove();
        
        $('#v6_pl_rightmod_recominfo>div').each(function(module){            
            var title=module.querySelector('.main_title a');
            if(title){
                var title=title.innerHTML;               
                '可能感兴趣的人,电影预售榜'.split(',').forEach(function(t){                   
                    if(title.indexOf(t)>-1){
                         console.log(module,'被移除')
                         module.remove();
                    }                    
                });               
            }
        });
    },400);
})();
