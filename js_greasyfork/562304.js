// ==UserScript==
// @name         Joblist Efficiency
// @namespace    burgerdroid.joblistefficiency
// @version      0.1
// @license      MIT
// @description  Calculates and displays your Base Efficiency scores when looking at Joblist pages.
// @author       Burgerdroid
// @match        https://www.torn.com/joblist.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @downloadURL https://update.greasyfork.org/scripts/562304/Joblist%20Efficiency.user.js
// @updateURL https://update.greasyfork.org/scripts/562304/Joblist%20Efficiency.meta.js
// ==/UserScript==


function calc_efficiency(primary_stat, primary_required, secondary_stat, secondary_required)
{
    let primary_efficiency = Math.floor(Math.min(45, (45 / primary_required) * primary_stat) + Math.max(0, (5 * Math.log(primary_stat / primary_required) / Math.log(2))));
    let secondary_efficiency = Math.floor(Math.min(45, (45 / secondary_required) * secondary_stat) + Math.max(0, (5 * Math.log(secondary_stat / secondary_required) / Math.log(2))));
    let total_efficiency = primary_efficiency + secondary_efficiency;
    return total_efficiency;
}


function getJobEfficencyScores()
{
    let jobTable = document.querySelector('ul.rank-list');
    if (jobTable == null) return;
    let re_stat = new RegExp('([0-9,]+) (INT|END|MAN)');
    let i = 1

    while (jobTable.childNodes[i] != null) {
        let thisJob = jobTable.childNodes[i];
        let jobName =  thisJob.childNodes[1];
        let primary = thisJob.childNodes[3].childNodes[1].innerText.match(re_stat);
        let secondary = thisJob.childNodes[3].childNodes[3].innerText.match(re_stat);

        primary[1] = parseInt(primary[1].replace(/,/g,''));
        secondary[1] = parseInt(secondary[1].replace(/,/g,''));
        let score = calc_efficiency(myStats[primary[2]], primary[1], myStats[secondary[2]], secondary[1]);
        jobName.innerText = '(' + score + ') ' + jobName.innerText;
        i += 2;
    }
}

let myStats = {};

(function () {
    const key = "###PDA-APIKEY###";
	const apiUrl = `https://api.torn.com/user/?selections=workstats&key=${key}`;

    async function createPromise() {
	try {
		const response = await fetch(apiUrl, {});
		const parsedResponse = await response.json();
		return parsedResponse;
	} catch(error) {
		console.log(error)
	}
	}

    function getWorkStats(result)
    {
        console.log(result);
        myStats['MAN'] = parseInt(result['manual_labor']);
        myStats['INT'] = parseInt(result['intelligence']);
        myStats['END'] = parseInt(result['endurance']);
    }

    function runApiQuery()
    {
		createPromise().then(result => {
            getWorkStats(result);
		});
	}

    runApiQuery();
    setTimeout(getJobEfficencyScores, 2500);
})();

window.addEventListener('hashchange', (event) => {
    setTimeout(getJobEfficencyScores, 1000);
});