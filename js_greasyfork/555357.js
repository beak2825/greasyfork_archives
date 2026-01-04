// ==UserScript==
// @name         Better Storygraph
// @namespace    https://cincodenada.com/
// @version      2025-10-31
// @description  Various visual improvements to StoryGraph
// @author       You
// @match        https://app.thestorygraph.com/stats/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=thestorygraph.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555357/Better%20Storygraph.user.js
// @updateURL https://update.greasyfork.org/scripts/555357/Better%20Storygraph.meta.js
// ==/UserScript==

/* global Chart */

function rateDiv(div) {
  const goodDivs = [50, 25, 10, 1]
  const divOrder = Math.floor(Math.log10(div))
  for(let order = divOrder; order > 1; order--) {
    for(let [i, d] of goodDivs.entries()) {
      if(div === d*Math.pow(10,order-1)) { return i+(divOrder-order)*goodDivs.length }
    }
  }
  const divBonus = divOrder - 1;
  for(let slice=1; slice<=4; slice++) {
    for(let [i, d] of goodDivs.entries()) {
        if(div === d/slice) { return i+(slice+divOrder)*goodDivs.length }
    }
  }
  return null
}

function* range_gen(a, b) {
    if(a==b) { return }
    const inc = Math.sign(b-a)
    for(let i=a; i<b; i+=inc) {
        yield i
    }
}
function range(a, b) { return [...range_gen(a, b)] }

async function ready(f, timeout=10) {
    const result = f();
    if(result) { return result }
    await new Promise((resolve) => setTimeout(resolve, timeout))
    return ready(f, timeout*2)
}

(async function() {
    'use strict';

    const ch = await ready(function() {
        if(typeof Chart === "undefined") { return false }
        if(Object.values(Chart.instances).length < 2) { return false }
        return Object.values(Chart.instances)
            .filter(ch => ch.data.datasets[0].label === "Books read")
            .filter(ch => ch.scales['pages-read-axis'].ticks.length > 2)
            .at(0)
    })

    const ls = ch.scales['books-read-axis']
    const rs = ch.scales['pages-read-axis']

    const numdivs = rs.ticks.length - 1;
    const subticks = range(0,rs.ticks.length)
    const expandCount = Math.round(numdivs*0.5)
    const expansions = range(0,expandCount+1).map(n => ls.max/(numdivs+n))
    const rated = expansions
    .map(rateDiv)
    .map(
        (r, i) => ({
            score: r === null ? null : r*(i+1),
            raw_score: r,
            scootch: i
        })
    )
    .filter(r => r.score != null)
    .sort((a, b) => a.score - b.score)

    console.log(expansions, rated)
    const winner = rated[0]

    console.log('Expanding range', winner)

    rs.options.ticks.suggestedMax = rs.max*(rs.ticks.length-1+winner.scootch)/(rs.ticks.length-1)
    ch.update()
})();