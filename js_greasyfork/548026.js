// ==UserScript==
// @name        Maven Central jar file download link
// @namespace   https://codeberg.org/kstover/userscripts
// @match       https://central.sonatype.com/artifact/*
// @icon        https://central.sonatype.com/favicon.ico
// @version     1.1
// @author      kstover
// @description Add a direct download link to .jar files on Maven Central
// @grant       none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/548026/Maven%20Central%20jar%20file%20download%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/548026/Maven%20Central%20jar%20file%20download%20link.meta.js
// ==/UserScript==

const TICK_MS = 2000;

const domParser = new DOMParser();

function waitForElement(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }
        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

function getAttribute(doc, attr) {
  const el = doc.querySelector(`project>${attr}`) || doc.querySelector(`project ${attr}`);
  if (el) { return el.innerHTML; }
}

function getUrl(){
  const pomFile = document.querySelector('[data-test="pom-file"]');
  if (!pomFile) {
    return;
  }
  const xml = domParser.parseFromString(pomFile.innerText, 'text/xml');
  let groupId = getAttribute(xml, 'groupId');
  const version = getAttribute(xml, 'version');
  const artifactId = getAttribute(xml, 'artifactId');
  if ((!groupId) || (!version) || (!artifactId)){
    return;
  }
  groupId = groupId.replaceAll('.', '/');
  return `https://repo1.maven.org/maven2/${groupId}/${artifactId}/${version}/${artifactId}-${version}.jar`;
}

function tick(){
  let a = document.querySelector('#direct-jar-link');
  if (!a) {
    a = document.createElement('a');
    a.id = 'direct-jar-link';
    a.style.background = 'lavender';
    a.style.color = 'darkcyan';
    document.querySelector('main').firstChild.insertAdjacentElement('afterend', a);
  }
  const url = getUrl();
  if (url) {
    a.href = url;
    a.innerText = `⬇ ${url}`;
  }
  setTimeout(tick, TICK_MS);
}

(async () => {
  await waitForElement('[data-test="version-dropdown"]');
  tick();
})();
