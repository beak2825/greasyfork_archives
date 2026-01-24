// ==UserScript==
// @name        Utilities for Kamadan Trade Chat
// @namespace   Violentmonkey Scripts
// @match       https://kamadan.gwtoolbox.com/*
// @version     1.0
// @author      Jertzukka
// @license     MIT
// @description Utilities for Kamadan Trade Chat by gwtoolbox in Guild Wars
// @run-at      document-start
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/563756/Utilities%20for%20Kamadan%20Trade%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/563756/Utilities%20for%20Kamadan%20Trade%20Chat.meta.js
// ==/UserScript==


// // // // // // Configuration // // // // // //

// Ignored users, format: ignorednames = ["Name1", "Name2", "Name3"];
ignorednames = [];

// Notification volume, format: audiovolume = 0.3;
notificationVolume = 0.5;

// Words to notify on case insensitive, format: alertwords = ["word1", "word2", "word3"];
alertwords = [];
// Color for highlighted messages, format: highlightColor = 'rgb(200,255,150)'; or 'rgb(50,100,50)'; for dark mode
highlightColor = 'rgb(200,255,150)';

// Disable visibility checks so notifications can play even if site is not visible, format: disableDisconnection = true;
disableDisconnection = true;

// Notification sound in base64 data format
notificationSound = "data:audio/wav;base64,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x7yReSWhCmZKxI4LsKJ6XZIvNg12//tAZPSDMP4H0/GPYEghIQouPw8VQ+wfS8Zl4Oh/BCi4nGQNNTNKDnEhEJ0ql8o9RFNwsfi1gky1h+FuhEUOcXH5fY8ju4Coy7uwAAAeEboMGmBEVuhEUzEToT2ecgJBxWCSz6tTa78C47eAAAAA3CZigBWraQsGSFgBFQgdhSoNG6e5BMu/YVXbuY0pkfhWE4EfMxGkwbEKG2oWUEw80pbR3UFz97oDBR4CbjwHkuQeAXImgPT/+zBE/YMxIghNe09hmh6hGj4zDwdDtCNJweGA4HeEqfi3iC1CQKEppXtXJptwFbqaAAAAkUGqZstbQwCHEK7g+u87nlw36rVLkDqoj+sHju7QAAAGVqnZggIAgrMwjCqSGF9WsVN4XnSVUC1YS0AcxMPILDM4XgQAAAAAAKcGXQaIBvdujCR7ZuBbAsilUlU40YC6xYFgeUE44Cz/+0Bk+gEw+ghTcw9guCdhOb9tgUUEvDU17LxIqI0FJzmNPISF0OgsPjIOMBa77j2QYipNe+8hxTJg0Lf4BCoSg5Gy+m0ulsrSIAAAAARdEaoQBYUUHBggwVnGgg7v2AAJDycwOJi9BsYMGNrK0pg5g9Ady2BoZw5RfEeBvgy4JwwMAzAzx4wLqCRBCNGTA1Z8A50Bpg4GVAEaTKBZHs8T47y4BmUADjoBhoIBQAR9dIyWy1Gho//7MGT7AzDjCNLxj2CoI2EJ3z8vIQN0IUXDYeDgfgRnOPywJINiAspBucGRQbdDcKVVsgvuKTIGLYLGLKFajlf33+LOGPFaE4NohBco5Q+f+3+8dJABzyXHaRIZYdI+COIP//+38ghESDE6MqRxDymRAiZBiCk0QIj///////5AC4S5IEFIEUVMQU1FMy4xMDBVVVVVVVVVVVVVVf/7MGT5gzEOCVDxOEhKHyEKXjMPA0OAHUvHseYgcIPpuGekJVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7gGT5AAEECM91YAAKIKE6bqwEAUlccTn5mAADZzvmdzdAQFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//sQZN2P8AAAf4cAAAgAAA/w4AABAAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU=";

// // // // // // // // // // // // // // // // //

sound = new Audio(notificationSound);
sound.volume = notificationVolume;

new MutationObserver((_, observer) => {
  const script = document.querySelectorAll('script[type=module]')[0];
  if (script) {
    script.remove();
    loadAndModifyScript(script.src);
    observer.disconnect();
  }
})
  .observe(document.documentElement, { childList: true, subtree: true });

function loadAndModifyScript(originalUrl) {
    GM_xmlhttpRequest({
        method: 'GET',
        url: originalUrl,
        onload: function(response) {
            if (response.status !== 200) {
                console.error('Failed to fetch script:', response.status);
                return;
            }

            let scriptContent = response.responseText;

            const updateRegex = /let data = json_parse\(message\);/;
            const newUpdateBody = `
            let data = json_parse(message);
            if (ignorednames.includes(data.s)) {
              console.log("Skipped", data.s);
              return;
            };
            alertwords.forEach((word) => {
              if(data.m && data.m.toLowerCase().includes(word.toLowerCase())) {
                sound.play();
              };
            });`;

            const redrawRegex = /const message = to_add\[i\];/;
            const newRedrawBody = `
            const message = to_add[i];
            if (ignorednames.includes(message.senderHtml())) {
              continue;
            };
            let alert = false;
            alertwords.forEach((word) => {
              if(message.messageHtml().toLowerCase().includes(word.toLowerCase())) {
                alert = true;
              };
            });
            `;

            const highlightRegex = /"row unanimated"/;
            const newHighlightBody = `"row unanimated" style="background-color:' + (alert ? highlightColor : "none") + '"`;

            scriptContent = scriptContent.replace(updateRegex, newUpdateBody).replace(redrawRegex, newRedrawBody).replace(highlightRegex, newHighlightBody);

            if (disableDisconnection) {
              const visibilityRegex = /this.disconnect\(\)/g;
              const newVisibilityBody = ``;
              scriptContent = scriptContent.replace(visibilityRegex, newVisibilityBody);
            }

            const newScript = document.createElement('script');
            newScript.type = 'module';
            newScript.textContent = scriptContent;
            newScript.setAttribute('crossorigin', '');

            (document.head || document.body || document.documentElement).appendChild(newScript);
            console.log('Modified script injected successfully');
        },
        onerror: function(err) {
            console.error('Error fetching script:', err);
        }
    });
}
