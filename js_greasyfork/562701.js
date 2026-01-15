// ==UserScript==
// @name         4chan Save to catbox
// @namespace    http://github.com/hangjeff
// @version      2026-01-15_10h26m
// @description  Save 4chan file to CatBox.moe
// @author       hangjeff
// @match        https://boards.4chan.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562701/4chan%20Save%20to%20catbox.user.js
// @updateURL https://update.greasyfork.org/scripts/562701/4chan%20Save%20to%20catbox.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let UserHash = ''; // Enter your own user hash here
document.querySelectorAll('.thread').forEach(thread => {
        let fileThumb = thread.querySelector('.fileThumb');
        if(fileThumb){
            let Komica_File_Url = 'https:' + fileThumb.getAttribute('href');
            let fileText = thread.querySelector('.fileText');

            if(Komica_File_Url.includes('.webm') || Komica_File_Url.includes('.mp4')){
                fileText.appendChild(Catbox_Create(Komica_File_Url, 'Video'));

            }
            else{
                // $(this).find('.fileText').first().append(WebArchive_Create(Komica_File_Url, 'Image'));
                fileText.appendChild(Catbox_Create(Komica_File_Url, 'Image'));
         
            }
        }

    })

   reply_Class_Read();
   document.addEventListener('click', event => {
       if (event.target.matches('.-expand-thread')) {
           setTimeout(() => {
               reply_Class_Read();
               console.log('Done!');
           }, 1000);
       }
   });

   function reply_Class_Read(){
       document.querySelectorAll('.reply').forEach(reply => {
               let fileThumb = reply.querySelector('.fileThumb');
               if (fileThumb && !reply.querySelector('.catboxForm')) {
                   let Komica_File_Url = 'https:' + fileThumb.getAttribute('href');
                   let fileText = reply.querySelector('.fileText');
                   if (fileThumb.getAttribute('href').includes('.webm') || fileThumb.getAttribute('href').includes('.mp4')) {
                       fileThumb.appendChild(Catbox_Create(Komica_File_Url, 'Video'));
                   }
                   else{
                       // $(this).find('.fileText').append(WebArchive_Create(Komica_File_Url, 'Image'));
                       fileText.appendChild(Catbox_Create(Komica_File_Url, 'Image'));
                   }
               }
       });
   }
    function Catbox_Create(myUrl, myTarget){
           let form = document.createElement('form');
           form.setAttribute('action', 'https://catbox.moe/user/api.php');
           form.setAttribute('method', 'POST');
           form.className = 'catboxForm';
           form.setAttribute('target', '_blank');
           form.setAttribute('enctype', 'multipart/form-data');

           let inputUser = document.createElement('input');
           inputUser.setAttribute('type', 'hidden');
           inputUser.setAttribute('name', 'userhash');
           inputUser.setAttribute('value', UserHash);
           let inputReqType = document.createElement('input');
           inputReqType.setAttribute('type', 'hidden');
           inputReqType.setAttribute('name', 'reqtype');
           inputReqType.setAttribute('value', 'urlupload');
           let inputUrl = document.createElement('input');
           inputUrl.setAttribute('type', 'hidden');
           inputUrl.setAttribute('name', 'url');
           inputUrl.setAttribute('value', myUrl);

           let inputSubmit = document.createElement('input');
           inputSubmit.setAttribute('type', 'submit');
           inputSubmit.setAttribute('value', 'Save ' + myTarget + ' to catbox');
           inputSubmit.style.backgroundColor = "#ADD8E6";
           inputSubmit.style.color = "#000000";

           form.appendChild(inputUser);
           form.appendChild(inputReqType);
           form.appendChild(inputUrl);
           form.appendChild(inputSubmit);

           return form;
    }
    // Your code here...
})();