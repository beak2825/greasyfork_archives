// ==UserScript==
// @name        nature direct download
// @namespace   minhill.com
// @description download Nature & sub Publications via CALIS access 直接下载Natue及其子刊
// @include     http://www.nature.com/*
// @include     https://www.nature.com/*
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/9604/nature%20direct%20download.user.js
// @updateURL https://update.greasyfork.org/scripts/9604/nature%20direct%20download.meta.js
// ==/UserScript==

//////////metainfo///////////////
var journalInfo={
    /*
    nature:{
        
        name:"nature",
        //citeReg:/nature.com\/(.*?)\/.*?\/v(\d*?)\/n(\d*?)\/.*?\/.*?(\d+)[a-z]*?\.ris/,
        citeReg:/nature.com\/(.*?)\/.*?\/v(\d*?)\/n(\d*?)\/.*?\/(.*?)\.ris/,
        directLink:"",
        insertNode:""
    },
    nclimate:{
        name:"nclimate",
        citeReg:/nature.com\/(.*?)\/.*?\/v(\d*?)\/n(\d*?)\/.*?\/(.*?)\.ris/,
        directLink:"",
        insertNode:""
    },
    ngeo:{
        name:"ngeo",
        citeReg:/nature.com\/(.*?)\/.*?\/v(\d*?)\/n(\d*?)\/.*?\/(.*?)\.ris/,
        directLink:"",
        insertNode:""        
    },*/
    common:{
        name:"common",
        citeReg:/nature.com\/(.*?)\/.*?\/v(\d*?)\/n(\d*?)\/.*?\/(.*?)\.ris/,
        directLink:"",
        insertNode:function(directLink){
            var insertParentNode = document.getElementsByClassName("tools")[0];
            insertParentNode.innerHTML += '<li id="directdownload" class="download-pdf">'+
                              '<a style="color:red" target="_blank" href="'+directLink+'">Direct download</a>'+
                              '</li>';
        }
    },
    common2:{
        name:"common2",
        citeReg:/nature.com\/(.*?)\/.*?\/v(\d*?)\/n(\d*?)\/.*?\/(.*?)\.ris/,
        directLink:"",
        insertNode:function(directLink){
            var insertParentNode = document.getElementsByClassName("links")[0];
            insertParentNode.innerHTML += '<li id="directdownload" class="permissions"><a style="color:red" target="_blank" href="'+directLink+'">Direct download via CALIS</li></a>';
        }
    },
    common3:{
        name:"common3",//为有PDF的情况，纯测试
        citeReg:/nature.com\/(.*?)\/.*?\/v(\d*?)\/n(\d*?)\/.*?\/(.*?)\.ris/,
        directLink:"",
        insertNode:function(directLink){
            var insertParentNode = document.getElementsByClassName("download-pdf")[0];
            insertParentNode.innerHTML += '<a style="color:red" id="directdownload" class="download-pdf" target="_blank" href="'+directLink+'">Direct download via CALIS</a>';
        }
    },
}

//var supportList=["nature","nclimate",""]
var metainfo={
    citationLink:null,
    type:null
}


////insert function
function insertPDFLink(citationLink,journal){
    //alert(citationLink);
    //var risElements=citationLink.match(/nature.com\/(.*?)\/.*?\/v(\d*?)\/n(\d*?)\/.*?\/(.*?).ris/);
    var risElements=citationLink.match(journal.citeReg);
    ///\/(.*?)\/.*?\/v(\d*?)\/n(\d*?)\/.*?\/\w*?(\d*?).ris/
    //alert(risElements[4]);
    var directLink = "http://fulltext.calis.edu.cn/nature/"+risElements[1]+"/"+risElements[2]+"/"+risElements[3]+"/"+risElements[4]+".pdf";
    journal.insertNode(directLink);
    //http://fulltext.calis.edu.cn/nature/nclimate/4/10/nclimate2357.pdf
    //alert(directLink);
    /*
    var insertParentNode = document.getElementsByClassName("tools")[0];
    //alert(insertParentNode.innerHTML);
    insertParentNode.innerHTML += '<li id="directdownload" class="download-pdf">'+
                              '<a target="_blank" href="'+directLink+'">直接下载</a>'+
                              '</li>';
    */
}
//////end////


/////////main////////////
if(document.getElementsByClassName("download-citation").length){
    metainfo.citationLink=document.getElementsByClassName("download-citation")[0].getElementsByTagName("a")[0].href;
    metainfo.type="common";
}
else if(document.getElementsByClassName("export-citation").length){
    metainfo.citationLink=document.getElementsByClassName("export-citation")[0].getElementsByTagName("a")[0].href;
    metainfo.type="common2";
}
else if(document.getElementsByClassName("supplementary").length){
    metainfo.citationLink=document.getElementById("articlenav").getElementsByClassName("supplementary")[0].getElementsByTagName("li")[0].getElementsByTagName("a")[0].href;
    metainfo.type="common3";
}


if(metainfo.citationLink){
    //alert(metainfo.citationLink);
    var journal = metainfo.citationLink.match(/nature.com\/(.*?)\//)[1].toString();
    if(journalInfo[journal]){
        insertPDFLink(metainfo.citationLink,journalInfo[journal]);
    }
    else{
        insertPDFLink(metainfo.citationLink,journalInfo[metainfo.type]);
    }
}
