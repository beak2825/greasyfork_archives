// ==UserScript==
// @name         Hero Arts Dark Elf
// @namespace    http://tampermonkey.net/
// @version      2025-12-25
// @description  Add arts to hero page in game DarkElf
// @author       You
// @match        https://www.darkelf.cz/heroes.asp?*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/560227/Hero%20Arts%20Dark%20Elf.user.js
// @updateURL https://update.greasyfork.org/scripts/560227/Hero%20Arts%20Dark%20Elf.meta.js
// ==/UserScript==
(async function() {
    console.log("fungujem")
    let a = []
    while(a.length == 0){
        a = Array.from(document.querySelectorAll('a[href^="heroes_names"]'))
        await new Promise(r => setTimeout(r, 1000));
    }
    let ids = a.map(x=>x.href.split('=')[1])
    console.log(ids)
    let promises = []

    ids.forEach(x=> promises.push(getDomFromUrl("https://www.darkelf.cz/artefacts_list.asp?h="+x,"GET")))

    let p = await Promise.all(promises)
    let arts = []
    p.forEach(x=>{
        let hero_name = x.querySelectorAll("td")[1].innerText
        console.log(hero_name)
        let arty = Array.from(x.querySelectorAll('th'))
        arty.shift()
        arty.shift()
        arty = arty.map(y=>y.innerText)
        arty = arty.filter(item => !item.includes("(0%"))
        arty.forEach(y=>arts.push([hero_name,y]))
    })
    console.log(arts)
    const tableHtml = `
  <table border="1">
    <thead>
      <tr>
        <th>Hero</th>
        <th>Art</th>
      </tr>
    </thead>
    <tbody>
      ${arts.map(row => `
        <tr>
          <td>${row[0]}</td>
          <td>${row[1]}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
`;
    document.querySelector("body").insertAdjacentHTML('beforeend', tableHtml);

    async function getDomFromUrl(url, method, body = undefined) {
        const getBlob = (url) => {
            return new Promise(function (resolve, reject) {
                let xhr = new XMLHttpRequest();
                xhr.open(method, url, true);
                if (method.toUpperCase() == 'POST') {
                    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                }
                xhr.responseType = 'blob';
                xhr.onload = function () {
                    let status = xhr.status;
                    if (status == 200) {
                        resolve(xhr.response);
                    } else {
                        reject(status);
                    }
                };
                xhr.send(body);
            });
        };
        const readWithFileReaderAndWindowsEncoding = (inputFile) => {
            const temporaryFileReader = new FileReader();

            return new Promise((resolve, reject) => {
                temporaryFileReader.onerror = () => {
                    temporaryFileReader.abort();
                    reject(new DOMException("Problem parsing input file."));
                };

                temporaryFileReader.onload = () => {
                    resolve(temporaryFileReader.result);
                };
                temporaryFileReader.readAsText(inputFile, 'windows-1250');
            });
        };
        let res = (await getBlob(url));
        let text = (await readWithFileReaderAndWindowsEncoding(res));
        let dom = new DOMParser().parseFromString(text, 'text/html');

        return dom;
    }
})();