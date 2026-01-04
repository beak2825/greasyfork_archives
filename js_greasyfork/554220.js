// ==UserScript==
// @name         Paper link to SJR + JIF
// @namespace    greasyfork.org
// @version      1.0
// @description  Hover DOI → show SJR, Quartile, H-Index & JIF in compact style (popup right + above cursor)
// @author       Bui Quoc Dung
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM.addStyle
// @connect      api.crossref.org
// @connect      scimagojr.com
// @connect      wos-journal.info
// @downloadURL https://update.greasyfork.org/scripts/554220/Paper%20link%20to%20SJR%20%2B%20JIF.user.js
// @updateURL https://update.greasyfork.org/scripts/554220/Paper%20link%20to%20SJR%20%2B%20JIF.meta.js
// ==/UserScript==

(function () {

  GM.addStyle(`
  .doi-enhancer-popup {
    position: absolute; z-index: 999999;
    background: #fff; border: 1px solid #ccc;
    border-radius: 6px; padding: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    font-family: sans-serif; font-size: 13px;
    max-width: 420px; line-height: 1.35em;
  }
  `);


  let currentPopup = null;
  let hideTimeout = null;

  function httpGet(url){
    return new Promise((res,rej)=>{
      GM_xmlhttpRequest({method:"GET",url,onload:res,onerror:rej,ontimeout:rej});
    });
  }

  function removeCurrentPopup(){ if(currentPopup) currentPopup.remove(); currentPopup=null; }

  function createPopup(x, y, doi) {
    removeCurrentPopup();
    const div = document.createElement("div");
    div.className = "doi-enhancer-popup";

    // tạm vị trí: bên phải + phía trên
    div.style.left = (x + 10) + "px";
    div.style.top  = (y - 150) + "px";

    div.innerHTML = `
      <div class="row-title" id="doi-row">${doi}</div>
      <div class="muted" id="journal-row">...</div>
      <div class="row-title" id="metric-row">SJR: ... | JIF: ...</div>
    `;
    document.body.appendChild(div);
    currentPopup = div;

    const h = div.offsetHeight;
    div.style.top = (y - h - 20) + "px";
  }

  async function fetchCrossref(doi) {
    try {
      const r = await httpGet(`https://api.crossref.org/works/${doi}`);
      const js = JSON.parse(r.responseText).message;
      return {
        journal: js["container-title"]?.[0] || "",
        publisher: js.publisher || "",
        issn: js.ISSN?.[0] || ""
      };
    } catch(e) { return {}; }
  }

  function querySJRByISSN(issn, cb){
    const SJR_SEARCH_URL = 'https://www.scimagojr.com/journalsearch.php?q=';
    const SJR_BASE_URL = 'https://www.scimagojr.com/';
    if(!issn) return cb(null);
    GM_xmlhttpRequest({
      method:'GET', url:SJR_SEARCH_URL+encodeURIComponent(issn),
      onload:res=>{
        const doc=new DOMParser().parseFromString(res.responseText,"text/html");
        const link=doc.querySelector('.search_results a'); if(!link) return cb(null);
        const url=SJR_BASE_URL+link.getAttribute('href');
        GM_xmlhttpRequest({
          method:'GET',url,
          onload:r2=>{
            const d=new DOMParser().parseFromString(r2.responseText,"text/html");
            const ps=d.querySelectorAll('p.hindexnumber'); if(ps.length<2) return cb(null);
            const sjr=ps[0].childNodes[0]?.textContent.trim();
            const quart=ps[0].querySelector('span')?.textContent.trim();
            const h=ps[1].textContent.trim();
            let text = sjr ? `SJR: ${sjr}` : "SJR: N/A";
            if(quart) text += ` (${quart})`;
            if(h) text += ` | H-index:  ${h}`;
            cb({text,link:url});
          },
          onerror:()=>cb(null)
        });
      },
      onerror:()=>cb(null)
    });
  }

  function queryJIFByISSN(issn,cb){
    const WOS_JOURNAL_URL = 'https://wos-journal.info/?jsearch=';
    if(!issn) return cb(null);
    GM_xmlhttpRequest({
      method:'GET', url:WOS_JOURNAL_URL+encodeURIComponent(issn),
      onload:res=>{
        const doc=new DOMParser().parseFromString(res.responseText,"text/html");
        const t=doc.querySelectorAll('.title.col-4.col-md-3');
        const c=doc.querySelectorAll('.content.col-8.col-md-9');
        if(!t.length||t.length!==c.length) return cb(null);
        let j=null;
        for(let i=0;i<t.length;i++){
          if(t[i].textContent.trim()==='Journal Impact Factor (JIF):'){
            j=c[i].textContent.trim(); break;
          }
        }
        cb(j && !isNaN(j) ? {value:j,link:WOS_JOURNAL_URL+issn} : null);
      },
      onerror:()=>cb(null)
    });
  }

  async function showPopup(a,doi,x,y){
    createPopup(x,y,doi);
    const info=await fetchCrossref(doi);
    if(!currentPopup) return;

    const jr = info.journal || "Unknown journal";
    const pb = info.publisher || "Unknown publisher";
    const is = info.issn || "N/A";
    currentPopup.querySelector("#journal-row").textContent = `${jr} — ${pb} — ISSN: ${is}`;

    let sjrText="SJR: ...", jifText="JIF: ...";

    querySJRByISSN(is,r=>{
      if(r && currentPopup) {
        sjrText = r.text;
        updateMetricRow();
      }
    });
    queryJIFByISSN(is,r=>{
      if(r && currentPopup) {
        jifText = `JIF: ${r.value}`;
        updateMetricRow();
      }
    });

    function updateMetricRow(){
      if(!currentPopup) return;
      currentPopup.querySelector("#metric-row").textContent = `${sjrText} | ${jifText}`;
    }
  }

  async function getDoiFromLink(linkElement) {
      const DOI_REGEX = /\b(10\.\d{4,}(?:\.\d+)*\/[^\s?#"]+)/i;

      if (linkElement.dataset.doi) return linkElement.dataset.doi;
      if (linkElement.dataset.doiFailed) return null;

      const url = linkElement.href.toLowerCase();
      const keywords = [
          'doi','article','journal','abs','content','abstract',
          'pubmed','document','fulltext','research','mdpi','springer'
      ];

      if (!keywords.some(k => url.includes(k))) {
          linkElement.dataset.doiFailed = 'true';
          return null;
      }

      const cleanDOI = doi => (doi.match(DOI_REGEX)?.[1]?.trim() ?? doi.trim()).replace(/\/(meta|full|abs|pdf)\/?$/i, "");

      let doi = url.match(DOI_REGEX)?.[1];

      if (!doi) {
          try {
              const res = await new Promise((resolve, reject) => {
                  GM_xmlhttpRequest({
                      method: 'GET',
                      url: linkElement.href,
                      onload: resolve,
                      onerror: reject,
                      ontimeout: reject
                  });
              });
              doi = res.responseText.match(DOI_REGEX)?.[1];
          } catch(e) {
          }
      }

      if (doi) {
          const final = cleanDOI(doi);
          linkElement.dataset.doi = final;
          return final;
      } else {
          linkElement.dataset.doiFailed = 'true';
          return null;
      }
  }
  document.addEventListener("mouseover",async e=>{
    const a=e.target.closest("a"); if(!a||!a.href) return;
    clearTimeout(hideTimeout); removeCurrentPopup();
    const doi=await getDoiFromLink(a); if(!doi) return;

    a.addEventListener("mouseleave",()=>hideTimeout=setTimeout(removeCurrentPopup,200));
    showPopup(a,doi,e.pageX,e.pageY);
  });

})();
