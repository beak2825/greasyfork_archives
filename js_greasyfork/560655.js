// ==UserScript==
// @name         cf potd
// @namespace    http://tampermonkey.net/
// @version      2025-12-26
// @description  This Script will add A POTD link on codeforces
// @author       You
// @match        *://codeforces.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_log
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560655/cf%20potd.user.js
// @updateURL https://update.greasyfork.org/scripts/560655/cf%20potd.meta.js
// ==/UserScript==




/*
  DESIGN CHOICES:

  1) To avoid API calls during contest all calls will be done only when clicking "POTD" thus making clicking POTD a bit slower but keeping refresh fast thus no lag in contest
  2) POTD are use specific that is for each user POTD will be different as POTD depend on the user curr_rating
  3) POTD will be in range [curr_rating-neg_delta*100 , curr_rating+pos_delta*100] where curr_rating is rounded down. For example: if user is 1650 POTD can be of [1400,1500,1600,1700,1800]
     Please change neg_delta and pos_delta constant variables if you want to change distribution
  3) POTD will always be an unsolved problem Unlike Leetcode where POTD can be an already solved problem. As they follow a global POTD model but this is using a user specic POTD
  4) on solving POTD and clicking "POTD" again you will be given a new unsolved "POTD" this is done as I want the "POTD" link to work as both a POTD and a random problem Generator
*/

/*
 TODO:
  1) ADD STREAKS
  2) For logged in users remove solved problems //DONE
*/
const neg_delta=2,pos_delta=2; //Change if you want a different distribution
const codeforces_url = "https://codeforces.com";
const all_problems_url = `${codeforces_url}/api/problemset.problems`;
const users_url =`${codeforces_url}/api/user.info?handles=`
const users_status_url =`${codeforces_url}/api/user.status?handle=`
const default_user_name = "Enter";
const default_rating = 800;
const OK_verdict="OK";
let all_problems = [];//initialized by calling get_all_problems on clicking POTD
(async () => {
    function get_user_name_div(){
        const header_div = document.querySelector("#header");
        if (!header_div) return;

        const lang_chooser_div = header_div.querySelector(".lang-chooser");
        if (!lang_chooser_div) return;

        const user_name_div = lang_chooser_div.querySelectorAll(":scope > div")[1];
        return user_name_div;
    }
    function get_user_name() {
        const user_name_div = get_user_name_div();
        if (!user_name_div) return default_user_name;

        const user_name_a = user_name_div.querySelectorAll("a")[1];
        if (!user_name_a) return default_user_name;

        return user_name_a.textContent.trim();
    }
    async function make_ui_change(streak) {
        const user_name_div = get_user_name_div();

        const potd_link = document.createElement("a");
        potd_link.textContent = `POTD ${streak}`;
        potd_link.href = "#";

        potd_link.addEventListener("click", async (e) => {
            all_problems=await get_all_problems();
            e.preventDefault();
            const url = await get_potd_url(get_user_name());
            window.location.href = url;
        });

        user_name_div.prepend(document.createTextNode(" | "));
        user_name_div.prepend(potd_link);
    }

    function get_date_ist() {
        const now = new Date();
        const istOffset = 5.5 * 60; // minutes
        const istTime = new Date(now.getTime() + istOffset * 60 * 1000 - now.getTimezoneOffset() * 60 * 1000);
        const year = istTime.getFullYear();
        const month = String(istTime.getMonth() + 1).padStart(2, '0');
        const day = String(istTime.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function get_rating(rating) {
        if (!Number.isInteger(rating)) return 0;
        rating=Math.max(rating,default_rating);
        return Math.floor(rating / 100);
    }

    function get_problem_url(contest_id, problem_code) {
        return `${codeforces_url}/contest/${contest_id}/problem/${problem_code}`;
    }


    async function get_all_problems() {
        const key = `${get_date_ist()}_all_problems`;
        const value = GM_getValue(key, -1);
        if (value != -1) {
            console.log("using GM_getValue to get_all_problems");
            return value;
        }

        try {
            const response = await fetch(all_problems_url);
            if (!response.ok) throw new Error("Network response was not ok");
            const data = await response.json();
            const problems = data.result.problems;
            const ans = Array.from({ length: 50 }, () => []);
            for (let problem of problems) {
                const rating = get_rating(problem.rating);
                const contest_id = problem.contestId;
                const problem_code = problem.index;
                const problem_url = get_problem_url(contest_id, problem_code);
                ans[rating].push(problem_url);
            }
            GM_setValue(key, ans);
            return ans;
        } catch (err) {
            console.error("Error fetching problems:", err);
            return [];
        }
    }
    async function get_user_profile(user_name) {

        const url = `${users_url}${user_name}`;
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error("Network response was not ok");

            const data = await response.json();
            if (data.status !== "OK") throw new Error("API returned an error");
            return data.result[0];
        } catch (err) {
            console.error(`Error fetching profile for ${user_name}:`, err);
            return null;
        }
    }
    function get_potd_problems_around_rating(rating) {
        const potd_problems = [];

        for (let delta = -neg_delta; delta <= pos_delta; delta++) {
            const nrating = rating + delta;
            if (all_problems[nrating] && all_problems[nrating].length > 0) {
                potd_problems.push(...all_problems[nrating]);
            }
        }
        return potd_problems;
    }
    async function get_user_status(user_name){
        const url = `${users_status_url}${user_name}`;
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error("Network response was not ok");

            const data = await response.json();
            if (data.status !== "OK") throw new Error("API returned an error");
            return data.result;
        } catch (err) {
            console.error(`Error fetching profile for ${user_name}:`, err);
            return null;
        }
    }
    async function get_solved_problems(user_name){
        const solved = new Set();
        const user_statuses = await get_user_status(user_name);
        for (const sub of user_statuses) {
            if (sub.verdict === OK_verdict) {
                const p = sub.problem;
                const url=get_problem_url(p.contestId, p.index);
                solved.add(url);
            }
        }
        return solved;
    }
    function remove_solved_problems(solved_problems,problems){
        const unsolved_problems =[];
        for(const problem of problems){
            if(solved_problems.has(problem)){
                console.log("removing already solved: ",problem);
                continue;
            }
            unsolved_problems.push(problem);
        }
        return unsolved_problems;
    }
    async function get_potd_url(user_name) {
        const key = `${get_date_ist()}_potd_${user_name}`;
        const value = GM_getValue(key, -1);
        var flattened_problems;
        if(user_name==default_user_name){
            if(value !=-1){
                return value;
            }
            flattened_problems=all_problems.flat();
        }else{
            const solved_problems = await get_solved_problems(user_name);
            if(value !=-1 && !solved_problems.has(value)){
               return value; //if the user has not solved the previous POTD use it
            }
            const user_profile=await get_user_profile(user_name);
            const user_rating=get_rating(user_profile.rating);
            flattened_problems = get_potd_problems_around_rating(user_rating);
            flattened_problems = remove_solved_problems(solved_problems, flattened_problems);
        }
        const random_index = Math.floor(Math.random() * flattened_problems.length);
        GM_setValue(key, flattened_problems[random_index]);
        return flattened_problems[random_index];
    }
    var streak=""//change and implement calculating streak logic
    make_ui_change(streak);
})();
