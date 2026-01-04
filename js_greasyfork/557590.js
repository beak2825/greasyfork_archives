// ==UserScript==
// @name        Extract RSS feeds to OPML from Youtube Subscriptions
// @match       https://www.youtube.com/feed/channels
// @namespace   alee.ytrss
// @grant       none
// @version     1.0
// @author      aarron-lee
// @license     MIT
// @description this script creates an OPML file from your Youtube Subscriptions, navigate to https://www.youtube.com/feed/channels and follow the instructions
// @downloadURL https://update.greasyfork.org/scripts/557590/Extract%20RSS%20feeds%20to%20OPML%20from%20Youtube%20Subscriptions.user.js
// @updateURL https://update.greasyfork.org/scripts/557590/Extract%20RSS%20feeds%20to%20OPML%20from%20Youtube%20Subscriptions.meta.js
// ==/UserScript==

// this script creates an OPML file from your Youtube Subscriptions, found at https://www.youtube.com/feed/channels

// full credit to https://dhariri.com/2023/youtube-sub-download

function onClick() {
  var opmlData = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<opml version=\"1.0\">\n<body>\n<outline text=\"YouTube Subscriptions\" title=\"YouTube Subscriptions\">\n" + JSON.stringify(ytInitialData.contents).match(/"channelId":\s*"([^"]+)",\s*"title":\s*{\s*"simpleText":\s*"([^"]+)"\s*}/g).map(match => /"channelId":\s*"([^"]+)"/.exec(match)[1]).map(cid => `<outline type="rss" xmlUrl="https://www.youtube.com/feeds/videos.xml?channel_id=${cid}" />`).join('\n') + "\n</outline>\n</body>\n</opml>";
  var blob = new Blob([opmlData], { type: 'text/xml' });
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'subscriptions.opml';
  a.click();
}

function createContainerDiv() {
  const containerDiv = document.createElement('div');
  containerDiv.id = 'floatingContainer';

  const heading = document.createElement('h2');
  heading.textContent = 'Extract RSS Feeds';

  const paragraph = document.createElement('p');
  paragraph.textContent = 'READ THIS: make sure to scroll all the way to the bottom of the page and load all of your subscription channels first';

  const button = document.createElement('button');
  button.textContent = 'Extract OPML';
  button.id = 'dismissButton';

  containerDiv.appendChild(heading);
  containerDiv.appendChild(paragraph);
  containerDiv.appendChild(button);

  containerDiv.style.position = 'fixed';
  containerDiv.style.zIndex = '9999';
  containerDiv.style.top = '20px'; // Position 20px from the top
  containerDiv.style.left = '50%';
  containerDiv.style.transform = 'translateX(-50%)'; // Center horizontally

  containerDiv.style.backgroundColor = '#fff';
  containerDiv.style.border = '2px solid #007bff';
  containerDiv.style.padding = '20px';
  containerDiv.style.borderRadius = '8px';
  containerDiv.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
  containerDiv.style.textAlign = 'center';
  containerDiv.style.maxWidth = '300px';

  button.style.backgroundColor = '#007bff';
  button.style.color = 'white';
  button.style.border = 'none';
  button.style.padding = '8px 15px';
  button.style.borderRadius = '4px';
  button.style.marginTop = '10px';
  button.style.cursor = 'pointer';

  heading.style.color = '#007bff';

  button.addEventListener('click', onClick)

  return containerDiv
}

document.body.prepend(createContainerDiv());