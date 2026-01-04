// ==UserScript==
// @name         组件冲突快速查找工具
// @description  使用二分法半自动查找出错的组件。
// @version      1.0
// @author       1ra
// @include      /^https?://(bgm\.tv|bangumi\.tv|chii\.in)/.*$/
// @namespace    https://greasyfork.org/users/797249
// @license      unlicense
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/548600/%E7%BB%84%E4%BB%B6%E5%86%B2%E7%AA%81%E5%BF%AB%E9%80%9F%E6%9F%A5%E6%89%BE%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/548600/%E7%BB%84%E4%BB%B6%E5%86%B2%E7%AA%81%E5%BF%AB%E9%80%9F%E6%9F%A5%E6%89%BE%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==


(function() {
  "use strict";

  const w = unsafeWindow;
  const TEST_DELAY = 2000; // ms to wait after load before test_error()

  let sessionID = new URL(location.href).searchParams.get("bgd_session");
  let phase = undefined;
  let pool = undefined;
  let subset = undefined;
  let culprits = undefined;

  const saveState = (phase="", pool=null, subset=null, culprits=[]) => {
    let state = {
      phase: phase,
      pool: pool,
      subset: subset,
      culprits: culprits,
    };
    sessionStorage.setItem("bgd_" + sessionID, JSON.stringify(state));

    let u = new URL(location.href);
    u.searchParams.set("bgd_session", sessionID);
    location.replace(u.toString());
  };

  function initState()
  {
    sessionID = Math.random().toString(36).slice(2, 10);
    alert(`已开启组件查找模式：通过弹窗告诉脚本问题是否存在，脚本会（半）自动尝试新的组件组合直到找到目标组件。`);
    saveState();
  }
  if(!sessionID) initState();

  const restoreState = (()=> {
    const state = JSON.parse(sessionStorage.getItem("bgd_" + sessionID));
    phase = state["phase"];
    pool = state["pool"];
    subset = state["subset"];
    culprits = state["culprits"];
  })();

  const navigate = (nextPool, nextSubset, phase="search") => {
    //insert gadgetID lookup HERE
    saveState(phase, nextPool, nextSubset, phase ==="sanity" ? culprits.concat(nextPool) : culprits);
  };

  // Monkey-patching for debugging
  function intercept() {
    if (!w.chiiLib?.widget?.loader) {
      requestAnimationFrame(intercept);
      return;
    }

    let orig = w.chiiLib.widget.loader;
    w.chiiLib.widget.loader = function(list) {
      if (phase === "") {
        // Initialize binary search
        let full = list.filter(s=>!culprits.includes(s));
        let mid = Math.floor((full.length + 1) / 2);
        let left = full.slice(0, mid);
        navigate(full, left);
        return;
      }
      let scriptsToLoad = phase === "sanity" ? list.filter(s=>s!=pool[0]) : subset;
      return orig.call(this, scriptsToLoad);
    };
  }
  intercept();

  function test_error() {
    //return true; //testing purpose
    return confirm(`已切换新的组件组合。问题是否还存在？`);
  }

  w.addEventListener("load", () => {
    //return;//testing purpose
    if (!phase || phase === "done") return;

    setTimeout(() => {
      let hasError = test_error();
      console.log("Tested subset:", subset, "error?", hasError);
      let other = pool.filter(s => !subset.includes(s));
      let nextPool = hasError ? subset : other;

      if (phase === "sanity"){
        if(hasError && confirm(`已找到冲突组件ID：${pool[0]}\n是否继续查找？`)){
          return navigate([], [], "");
        }
        else {
          return finisher();
        }
      }

      if (nextPool.length === 0) {
        return culprits.length > 0 ? finisher() : alert(`无法找到冲突的组件！建议手动排查用户脚本。`);
      }
      //Perform sanity check after culprit identified
      if (nextPool.length === 1) {
        return navigate(nextPool, [], "sanity");
      }

      // Update search index
      let mid = Math.floor((nextPool.length + 1) / 2);
      let nextSubset = nextPool.slice(0, mid);
      return navigate(nextPool, nextSubset);
    }, TEST_DELAY);
  });

  const VERS_REGEX = /res_id=(\d+)/m;
  const versList=[];
  const gIDList=[];
  let i=0;
  function finisher(){
    if(i !== culprits.length) {
      let match = VERS_REGEX.exec(culprits[i]);
      if (match) {
        let versionID = VERS_REGEX.exec(culprits[i])[1];
        versList.push(versionID);
      }
      else console.log(`regex match failed: ${culprits[i]}`);
      i++;
      finisher();
    }
    else {
      $.get("/settings/gadgets", function(data){
        gadgetIDLookup($('.gadgetList li', $(data)), versList);
      });
    }
  }


  function gadgetIDLookup(gadgets, versList, i=0)
  {
    if(gadgets.length == i){ //Done
      alert(`已找到所有冲突组件: \n${gIDList.join("\n")}`);
      navigate([], [], "done");
      return;
    }

    //console.log($(gadgets).eq(i).attr("id"));
    let id = $(gadgets).eq(i).attr("id").split("_").pop();
    let callback = function(data) {
      let vDOM=$(data).find(".browserFull li a").first();
      if(vDOM.length>0){
        let versID = vDOM.attr("href").split("/").pop();
        if(versList.includes(versID)){
          gIDList.push(`[${id}] ${$(data).find("#header h1").text()}`);
        }
      }
      return gadgetIDLookup(gadgets, versList, i + 1);
    };
    $.get("/dev/app/"+id, callback);
  }
})();
