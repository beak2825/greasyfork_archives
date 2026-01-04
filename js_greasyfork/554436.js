/**
 * 
    This is free and unencumbered software released into the public domain.

    Anyone is free to copy, modify, publish, use, compile, sell, or
    distribute this software, either in source code form or as a compiled
    binary, for any purpose, commercial or non-commercial, and by any
    means.

    In jurisdictions that recognize copyright laws, the author or authors
    of this software dedicate any and all copyright interest in the
    software to the public domain. We make this dedication for the benefit
    of the public at large and to the detriment of our heirs and
    successors. We intend this dedication to be an overt act of
    relinquishment in perpetuity of all present and future rights to this
    software under copyright law.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
    MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
    IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
    OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
    ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
    OTHER DEALINGS IN THE SOFTWARE.

    For more information, please refer to <https://unlicense.org>
 * 
 */
/* global GM */
var GM_lock = (tag, func) => {
  const COLLISION_INTERVAL = 500;
  const CLEANUP_VALUES = false; // optional
  const SHOW_LOG = false; // debug use

  return new Promise((resolve)=>{
    // const gmDelVal = GM.deleteValue ? (key) => GM.deleteValue(key) : (key) => Promise.resolve(GM_deleteValue(key));
    const gmDelVals = GM.deleteValues ? (key) => GM.deleteValues(key) : (key) => Promise.resolve(GM_deleteValues(key));
    // const gmGetVal = GM.getValue ? (key) => GM.getValue(key) : (key) => Promise.resolve(GM_getValue(key));
    // const gmGetVals = GM.getValues ? (key) => GM.getValues(key) : (key) => Promise.resolve(GM_getValues(key));
    const gmSetVal = GM.setValue ? (key, val) => GM.setValue(key, val) : (key, val) => Promise.resolve(GM_setValue(key, val));
    const vcLrAdd = GM_addValueChangeListener;
    const vcLrDel = GM_removeValueChangeListener; 
    const now = Date.now() + 1000000000000000;
    const ra = 3656158440062976;
    const rb = 9007199254740991;
    const rid = `${Math.floor(Math.random() * (rb - ra) + ra).toString(36)}`;
    const prefix = `GM_lock::${tag}::`;
    const id = `${now}_${rid}`; // `${prefix}idn${now}_${rid}`;
    let localLock = false;
    let ids = new Set();
    let prevT = 0;
    let cid = 0;
    let lrIdAct = 0;
    let lrIdNxt = 0;
    const getAckTime = () => {
      let now = Date.now();
      let r1 = Math.random() * 0.9;
      let ackTime = now + r1;
      if (ackTime < prevT + 2) {
        const lastTfloor = Math.floor(prevT);
        const r0 = prevT - lastTfloor;
        if (ackTime <= lastTfloor + 1) ackTime = lastTfloor + Math.max(r0, r1) + 0.0009765625; // 2^-10
      }
      return ackTime;
    }
    let action = async () => {
      try {
        await func();
      } catch (e) {
        Promise.resolve().then(console.error.bind(console, e));
      }
      SHOW_LOG && gmSetVal(`proc2_${id}`, Date.now());
      lrIdNxt && vcLrDel(lrIdNxt);
      lrIdNxt = 0;
      lrIdAct && vcLrDel(lrIdAct);
      lrIdAct = 0;
      func = null;
      action = null;
      let toCleanup = false;
      if (CLEANUP_VALUES) {
        ids.delete(id);
        if (!ids.size) {
          toCleanup = true;
        }
      }
      if (toCleanup) {
        await gmDelVals([`${prefix}ack`, `${prefix}nxt`]);
      } else {
        await gmSetVal(`${prefix}ack`, `1_${id}###${getAckTime()}`);
      }
      resolve();
    }
    const cf = () => {
      cid = 0;
      if (localLock) return;
      const list = [...ids];
      list.sort();
      if (list[0] === id) {
        SHOW_LOG && gmSetVal(`proc1_${id}`, Date.now());
        localLock = true;
        action && action();
      } else {
        localLock = true;
      }
    }
    lrIdAct = vcLrAdd(`${prefix}ack`, (_key, oldVal, newVal, _remote) => {
      // `${b}_${id}###${Date.now() + Math.random()}`
      if (newVal && newVal.length > id.length + 5) {
        const p = newVal.split("###");
        if (p.length === 2) {
          let bit = newVal[0];
          if (bit === "1") {
            localLock = false;
          }
          gmSetVal(`${prefix}nxt`, `${id}_${Date.now() + Math.random()}###${p[1]}`);
        }
      }else{
        console.warn(`GM_Lock: The 'ack' value get an unexpected change '${oldVal}' -> '${newVal}'.`);
      }
    });
    lrIdNxt = vcLrAdd(`${prefix}nxt`, (_key, oldVal, newVal, _remote) => {
      // `${id}_${Date.now() + Math.random()}###${p[1]}`
      if (newVal && `${newVal}`.length > id.length + 4) {
        newVal = `${newVal}`;
        const p = newVal.split("###");
        if (p.length === 2) {
          const currentT = +p[1];
          if (currentT > prevT) {
            prevT = currentT;
            ids.clear();
            cid && clearTimeout(cid);
            cid = setTimeout(cf, COLLISION_INTERVAL);
          }
          if (currentT === prevT) {
            ids.add(newVal.substring(0, id.length));
          }
        }
      } else {
        console.warn(`GM_Lock: The 'nxt' value get an unexpected change '${oldVal}' -> '${newVal}'.`);
      }
    });
    Promise.resolve().then(() => {
      gmSetVal(`${prefix}ack`, `0_${id}###${getAckTime()}`);
    });
  });
};