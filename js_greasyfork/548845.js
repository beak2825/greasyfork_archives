// ==UserScript==
// @name         Arbor Full Year ICS Export
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Export Arbor timetable for the full year day by day, stops after 21 empty days (detecting end of school year)
// @match        *://*.arbor.sc/*
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/548845/Arbor%20Full%20Year%20ICS%20Export.user.js
// @updateURL https://update.greasyfork.org/scripts/548845/Arbor%20Full%20Year%20ICS%20Export.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function pad(n){return n<10?'0'+n:n}

    function formatDate(date){
        return date.getUTCFullYear().toString() +
            pad(date.getUTCMonth()+1) +
            pad(date.getUTCDate()) + 'T' +
            pad(date.getUTCHours()) +
            pad(date.getUTCMinutes()) +
            pad(date.getUTCSeconds()) + 'Z';
    }

    function generateICS(events){
        let ics = "BEGIN:VCALENDAR\nVERSION:2.0\nCALSCALE:GREGORIAN\n";
        events.forEach(e=>{
            ics += "BEGIN:VEVENT\n";
            ics += "SUMMARY:" + e.subject + "\n";
            ics += "LOCATION:" + e.location + "\n";
            ics += "DESCRIPTION:" + e.className + "\n";
            ics += "DTSTART:" + formatDate(e.start) + "\n";
            ics += "DTEND:" + formatDate(e.end) + "\n";
            ics += "END:VEVENT\n";
        });
        ics += "END:VCALENDAR";
        return ics;
    }

    function downloadICS(content, filename){
        let blob = new Blob([content], {type: "text/calendar"});
        let url = URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }

    function scrapeDay(){
        let events = [];
        let dateTd = document.querySelector('.mis-cal-day td[data-datetime]');
        let dateStr = dateTd ? dateTd.getAttribute('data-datetime').split(' ')[0] : new Date().toISOString().split('T')[0];

        document.querySelectorAll('.mis-cal-event').forEach(ev=>{
            try{
                let timeLoc = ev.querySelector('.mis-cal-event-time span')?.innerText || '';
                let [timePart, locPart] = timeLoc.split('|').map(s=>s.trim());
                if(!timePart) return;
                let [startTime,endTime] = timePart.split('-').map(t=>t.trim());
                let location = locPart ? locPart.replace('Location:','').trim() : '';

                let title = ev.querySelector('.title')?.innerText || '';
                let parts = title.split(':');
                let subject = parts[0]?.trim() || '';
                let className = parts.slice(1).join(':').trim();
                if(subject.includes("Year 12")) return;

                let start = new Date(dateStr + 'T' + startTime);
                let end = new Date(dateStr + 'T' + endTime);

                events.push({subject,className,location,start,end});
            }catch(e){console.error(e)}
        });
        return events;
    }

    async function scrapeFullYearByDay(){
        let allEvents = [];
        let emptyDays = 0;
        const maxEmptyDays = 21;
        const timeout = 1000 //time to wait before switching page in ms. Higher number will increase scan accuracy, but will drastically slow down. 500-1000 is a good setting here.
        let nextButton = document.getElementById('mis-button-1016'); // replace with actual next-day button if different

        while(nextButton && emptyDays < maxEmptyDays){
            let dayEvents = scrapeDay();
            if(dayEvents.length === 0){
                emptyDays++;
                console.log(`Empty day ${emptyDays} detected.`);
            } else {
                emptyDays = 0; // reset counter if day has events
                allEvents.push(...dayEvents);
            }

            console.log('Moving to next day...');
            nextButton.click();
            await new Promise(r=>setTimeout(r,timeout)); // wait 4s for page to load
            nextButton = document.getElementById('mis-button-1016');
        }

        // Add last scraped day if any
        let lastDayEvents = scrapeDay();
        if(lastDayEvents.length > 0){
            allEvents.push(...lastDayEvents);
        }

        let ics = generateICS(allEvents);
        downloadICS(ics, 'Arbor_Timetable.ics');
        alert('All days scraped (stopped after 21 empty days) and ICS downloaded!');
    }

    // Add button to start
    let btn = document.createElement('button');
    btn.innerText = 'Export Timetable';
    btn.style.position = 'fixed';
    btn.style.top = '10px';
    btn.style.right = '10px';
    btn.style.zIndex = 10000;
    btn.style.padding = '10px';
    btn.style.backgroundColor = '#2196F3';
    btn.style.color = 'white';
    btn.style.border = 'none';
    btn.style.borderRadius = '5px';
    btn.style.cursor = 'pointer';
    document.body.appendChild(btn);

    btn.addEventListener('click', scrapeFullYearByDay);
})();
