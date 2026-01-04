// ==UserScript==
// @name         Canvas User Joined Date
// @namespace    hacker09
// @version      1
// @description  Fetch each user's profile page on Canvas roster, extract the "Created" date, and add a new "Joined On" column reliably.
// @match        https://canvas.instructure.com/courses/*/users
// @icon         https://du11hjcvx0uqb.cloudfront.net/br/dist/images/favicon-e10d657a73.ico
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/553380/Canvas%20User%20Joined%20Date.user.js
// @updateURL https://update.greasyfork.org/scripts/553380/Canvas%20User%20Joined%20Date.meta.js
// ==/UserScript==

(function() {
  'use strict'

  let enrollmentData = [] //global array for debugging all td innerHTML
  let pending = 0 //counter for pending fetch requests

  function extractCreatedDate(tdInnerHTML) { //helper: extract Created date from td innerHTML
    let text = tdInnerHTML.replace(/<br\s*\/?>/gi, ' ') //replace <br> with space
    .replace(/<\/?[^>]+(>|$)/g, '') //remove all other HTML tags
    .replace(/\s+/g, ' ') //normalize multiple spaces to single space
    .trim(); //remove leading/trailing whitespace
    let match = text.match(/Created\s+(.+?)(?:\s+Completed|$)/i) //match "Created" followed by date until "Completed" or end
    if(!match) { //if first pattern fails
      match = text.match(/Created\s+(.+)/i) //fallback: grab everything after "Created"
    }
    return match ? match[1].trim() : 'N/A'; //return extracted date or N/A if not found
  }

  function processTable(){ //main function to process the roster table
    let header=document.querySelector("table.roster thead tr") //find table header row
    if(header && !document.querySelector("th.joined-on")) { //if header exists and joined column not added yet
      let th=document.createElement("th") //create new header cell
      th.className="joined-on" //add class for identification
      th.textContent="Joined On" //set header text
      th.scope="col" //add accessibility attribute
      let lastTh = header.querySelector('th:last-child') //find last header (admin links)
      header.insertBefore(th, lastTh) //insert before admin links column
    }

    let rows=document.querySelectorAll("tbody.collectionViewItems tr:not(.joined-processed)") //find unprocessed rows
    rows.forEach(row=>{ //iterate through each row
      row.classList.add("joined-processed") //mark row as processed
      let link=row.querySelector('a[href^="https://canvas.instructure.com/courses/"][href*="/users/"]') //find user profile link
      if(!link) return //skip if no link found

      let td=document.createElement("td") //create new data cell
      td.textContent="Loading..." //set loading text
      let lastTd = row.querySelector('td:last-child') //find last cell (admin links)
      row.insertBefore(td, lastTd) //insert before admin links cell

      pending++ //increment pending counter
      fetch(link.href).then(r=>r.text()).then(html=>{ //fetch user profile page
        let parser=new DOMParser() //create HTML parser
        let doc=parser.parseFromString(html,"text/html") //parse fetched HTML
        let cell=doc.querySelector('td[style*="width: 50%"]') //find enrollment info cell
        if(cell){ //if cell found
          enrollmentData.push(cell.innerHTML.trim()) //store full HTML for debugging
          td.textContent = extractCreatedDate(cell.innerHTML) //extract and display date
        } else { //if cell not found
          enrollmentData.push("NO TD FOUND") //log error for debugging
          td.textContent = "N/A" //display N/A
        }
      }).catch(()=>{ //handle fetch errors
        enrollmentData.push("FETCH ERROR") //log error for debugging
        td.textContent = "Error" //display error
      }).finally(()=>{ //always execute after fetch
        pending-- //decrement pending counter
        if(pending===0){ //if all requests completed
          console.log("All fetched td innerHTML:", enrollmentData) //log all data for debugging
        }
      })
    })
  }

  window.addEventListener('load', ()=>{ //wait for window load event
    setTimeout(processTable, 500) //delay to ensure dynamic content loaded
  })

  let observer=new MutationObserver(()=>{ //create observer for DOM changes
    clearTimeout(window.canvasJoinedDateTimeout) //clear previous timeout
    window.canvasJoinedDateTimeout = setTimeout(processTable, 100) //debounce with 100ms delay
  })

  if(document.readyState === 'loading') { //if document still loading
    document.addEventListener('DOMContentLoaded', ()=>{ //wait for DOM ready
      observer.observe(document.body,{childList:true,subtree:true}) //start observing body for changes
    })
  } else { //if document already loaded
    observer.observe(document.body,{childList:true,subtree:true}) //start observing immediately
  }
})()