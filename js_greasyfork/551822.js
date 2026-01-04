// ==UserScript==
// @name         Wanikani Leaderboard 2
// @namespace    http://tampermonkey.net/
// @version      2.0.6
// @description  Get levels from usernames and order them in a competitive list
// @author       crazyfluff, faraplay, Dani2
// @include      https://www.wanikani.com/dashboard
// @include      https://www.wanikani.com/
// @require      https://unpkg.com/sweetalert/dist/sweetalert.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/488876/Wanikani%20Leaderboard%202.user.js
// @updateURL https://update.greasyfork.org/scripts/488876/Wanikani%20Leaderboard%202.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //------------------------------
    // Wanikani Framework
    //------------------------------
    if (!window.wkof) {
        let response = confirm('WaniKani Leaderboard script requires WaniKani Open Framework.\n Click "OK" to be forwarded to installation instructions.');

        if (response) {
            window.location.href = 'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
        }

        return;
    }

    const config = {

    };

    wkof.include('Menu, Settings');
    wkof.ready('Menu, Settings').then(install_menu).then(install_settings);

    //------------------------------
    // Menu
    //------------------------------
    var settings_dialog;
    var defaults = {
        userOrderOption: 'key1',
        numberOfLeaderboardTabless: '1'
    };

    function install_menu() {
        wkof.Menu.insert_script_link({
            script_id: 'Leaderboard',
            name: 'Leaderboard',
            submenu:   'Settings',
            title:     'Leaderboard',
            on_click:  open_settings
        });
    }

    function open_settings() {
        settings_dialog.open();
    }
    function install_settings() {
        settings_dialog = new wkof.Settings({
            script_id: 'Leaderboard',
            name: 'Leaderboard',
            title: 'Leaderboard',
            on_save: process_settings,
            settings: {
                tabset_id: {
                    type: 'tabset',
                    content: {
                        page_id1: {type: 'page', label:  'Add user', hover_tip:'', content: {
                            addUser: {type:'input', label:'Add a user', hover_tip: 'Add a user to leaderboard', placeholder: 'username', validate: ''}
                        }},
                        page_id2: {type: 'page', label:  'Sort Order', hover_tip:'', content: {
                            'userOrderOption': {type: 'dropdown', label: 'Sorting order', hover_tip: 'Select how you want users to be ordered.', default:'keyDefault', full_width: true, on_change: changeSortOrder,
                                                content: {
                                                    keyDefault: '--Sort Order--',
                                                    key1: 'Level -> Burn% -> Name',
                                                    key2: 'Level -> Name',
                                                    key3: 'Burn% -> Level -> Name',
                                                    key4: 'Burn% -> Name',
                                                    key5: 'Name Ascending',
                                                    key6: 'Name Descending',
                                                }
                                               }
                        }},
                        page_id3: {type: 'page', label:  'Number of tables', hover_tip:'', content: {
                            'numberOfLeaderboardTabless': {type:'dropdown', label:'Number of leaderboard tables', hover_tip: 'The amount of tables the added users will be split between', default:'0', full_width: true,
                                                           on_change: changeNumberofTables,
                                                           content:{0:'--table nr.--', 1:'1 (Min)', 2:'2',3:'3'}},
                        }}
                    }
                }
            }
        });
        settings_dialog.load().then(function(){
            settings_dialog.save();
        });
    }
    function process_settings(){
        settings_dialog.save();
        addUser(wkof.settings.Leaderboard.addUser);
    }

    //manually delete cache
    function emptyList(){
        deleteLeaderboardRelatedCache().then(function() {
            usersInfoList = [];
            processArray();
        });
    }

    //------------------------------
    // Time
    //------------------------------

    var timeSinceLastRefresh = 1539614371504;
    var timeSinceLastRefreshText = '';

    function updateTimeSinceRefreshText (){
        let times = millisecondsToDayHourMinute(Date.now()-timeSinceLastRefresh);
        let daysPassed = times[0] === 1 ? ' day ' : ' days ';
        let hoursPassed = times[1] === 1 ? ' hour ' : ' hours ';
        let minutesPassed = times[2] === 1 ? ' minute ' : ' minutes ';
        timeSinceLastRefreshText = times[0] + daysPassed + times[1] + hoursPassed + times[2] + minutesPassed;
    }

    function millisecondsToDayHourMinute(time){
        let daysPassed = 24 * 60 * 60 * 1000,
            hoursPassed = 60 * 60 * 1000,
            day = Math.floor(time / daysPassed),
            hour = Math.floor( (time - day * daysPassed) / hoursPassed),
            minute = Math.round( (time - day * daysPassed - hour * hoursPassed) / 60000),
            pad = function(n){ return n < 10 && n != 0 ? '0' + n : n; };
        if( minute === 60 ){
            hour++;
            minute = 0;
        }
        if( hour === 24 ){
            day++;
            hour = 0;
        }
        return [day, pad(hour), pad(minute)];
    }

    //------------------------------
    // Caching
    //------------------------------

    //userlist
    var usersInfoList = [];
    var userSortingMethod = 'key1';
    var numberOfLeaderboardTables = '1';

    function saveUserListToCache(userList){
        wkof.file_cache.save('leaderboard_userList', userList).then(function(){
            //console.log('Save complete!');
        });
    }

    function getUserListFromCache(){
        return new Promise((resolve) => {
            wkof.file_cache.load('leaderboard_userList')
                .then(function(settings) {
                resolve(settings);
            }).catch(e => {
                console.log('Leaderboard - No cache found');
                resolve();
            });
        });
    }

    //not called anywhere is for debugging purposes
    function deleteLeaderboardRelatedCache(cacheName = null){
        return new Promise((resolve) => {
            if(cacheName){
                console.log('deleting: ' + cacheName);
                wkof.file_cache.delete(cacheName).then(function() {//delete specific cached file
                    resolve();
                });
            } else {
                console.log('deleting leaderboard related caches');
                wkof.file_cache.delete(/^leaderboard_/).then(function() {//delete all leaderboard related caching
                    resolve();
                });
            }
        });
    }

    //refresh time
    function getTimeSinceLastRefreshFromCache(){
        return new Promise((resolve) => {
            wkof.file_cache.load('leaderboard_timeSinceLastRefresh').then(function(settings) {
                resolve(settings);
            }).catch(e => {
                wkof.file_cache.save('leaderboard_timeSinceLastRefresh', Date.now()).then(function(){
                }).catch(e => {
                    console.log(e);
                });
                timeSinceLastRefreshText = '0 days 0 hours 0 minutes';
                resolve(Date.now());
            });
        });
    }

    function refreshDashboard(){
        wkof.file_cache.save('leaderboard_timeSinceLastRefresh', Date.now()).then(function(){
        }).catch(e => {
            console.log(e);
        });

        timeSinceLastRefreshText = '0 days 0 hours 0 minutes';
        processArray();
    }

    function saveSortingMethod(){
        wkof.file_cache.save('leaderboard_sortingMethod', userSortingMethod).then(function(){
            //console.log('Save complete! method:' + userSortingMethod);
        });
    }

    function getUserSortingMethodFromCache(){
        return new Promise((resolve) => {
            wkof.file_cache.load('leaderboard_sortingMethod').then(function(settings) {
                resolve(settings);
            }).catch(e => {
                userSortingMethod = 'key1';
                resolve();
            });
        });
    }

    function saveNumberOfLeaderboardTables(){
        wkof.file_cache.save('leaderboard_numberOfTables', numberOfLeaderboardTables).then(function(){
            //console.log('Save complete! nr of tables:' + numberOfLeaderboardTables);
        });
    }

    function getNumberOfLeaderboardTablesFromCache(){
        return new Promise((resolve) => {
            wkof.file_cache.load('leaderboard_numberOfTables').then(function(settings) {
                resolve(settings);
            }).catch(e => {
                numberOfLeaderboardTables = '1';
                resolve();
            });
        });
    }

    //------------------------------
    // Global variables
    //------------------------------
    const wkRealms = ['快', '苦', '死', '地獄', '天堂', '現実', '!!'];
    const wkRealmNames = ['Pleasant', 'Painful', 'Death', 'Hell', 'Paradise', 'Reality', 'Error'];
    const leaderboardColors = ['none', 'apprColor', 'guruColor', 'masterColor', 'enlightenedColor', 'burnedColor', 'errorColor'];

    //admin accounts, admin is any account with the Leader badge or a unique flair on the forums (list may be incomplete; users with no wk account like 'WaniMeKani' or 'system' are omitted)
    const adminNamesInfinity = ['viet', 'viet', 'Kristen', 'kristen', 'koichi', 'sam', 'oldbonsai', 'arpit.jalan', 'arpit', 'jenk', 'WaniKaniJavi', 'wanikanijavi', 'gomakuma'];//∞
    const adminNamesStar = ['TofuguKanae', 'tofugukanae', 'CyrusS', 'cyruss', 'mamimumason', 'a-regular-durtle', 'koichi-descended', 'RachelG', 'rachelg', 'arlo', 'camfugu', 'TofuguJenny', 'tofugujenny'];//★
    const adminNamesNone = ['dax', 'HAWK', 'hawk', 'blake.erickson', 'blake', 'CidPollendina', 'cidpollendina', 'Aya', 'aya', 'mamimumason'];//none

    const adminIdentifier = 'adminUserLeaderboard';
    const accountNotFoundMessage = ' (not found!)';

    //total number of WaniKani items
    const totalNumberOfWKItems = 8910;

    var toggleLeaderboardWidth0 = 0;
    var toggleLeaderboardWidth1 = 0;
    var toggleLeaderboardWidth2 = 0;
    var usersThatLeveledUp = '';

    //------------------------------
    // Get user information (name, level, avatar, realm)
    //------------------------------

    //determine what realm (pleasant, painful, etc.) a user is in
    function setRealm(userLevel){
        switch(Math.ceil(userLevel / 10) * 10) {
            case 70:
                return 5;//reality+
            case 60:
                return 5;//reality
            case 50:
                return 4;//heaven
            case 40:
                return 3;//hell
            case 30:
                return 2;//death
            case 20:
                return 1;//painful
            case 10:
                return 0;//pleasant
            default:
                return 6;//error
        }
    }

    async function checkIfUserAlreadyOnLeaderboard(name = ''){
        await delay();
        for (var i = 0; i < usersInfoList.length; i++){
            if(usersInfoList[i].name.toLowerCase() === name.toLowerCase() || usersInfoList[i].name.toLowerCase() === name+accountNotFoundMessage.toLowerCase()){
                return false;
                break;
            }
        }
        return true;
    }

    //add a single user
    async function addUser(name=''){
        let addUser = true;
        name = name.toLowerCase().split(' ').join('');
        checkIfUserAlreadyOnLeaderboard(name).then(
            async function(result){
                if(result){
                    //create default user info
                    const obj = {};
                    obj['name'] = name;
                    obj['level'] = 0;
                    obj['avatar_link'] = 'https://www.gravatar.com/avatar/65977e18f599e0319495b468c92b5179?s=300&d=https://cdn.wanikani.com/default-avatar-300x300-20121121.png';
                    obj['realm_number'] = 6;
                    obj['srs_distribution'] = [{}];
                    obj['wasUserFound'] = false;
                    obj['totalBurnPercentage'] = 0;

                    let object = [obj];
                    const promise = object.map(assignLevelAndAvatarFromWkProfile);//process a single user
                    await Promise.all(promise);

                    usersInfoList.push(object[0]);//add single user to the rest of the users

                    inference();
                } else{
                    if(typeof swal === "function"){
                        swal('A user with that name already exists in the list.');
                    } else{
                        alert('A user with that name already exists in the list.');
                    }
                }
            });
    }

    //delete a single user
    function deleteUser(name = ''){
        name = name.currentTarget.className.split(" ")[0];//get username from classnames
        for(var i = usersInfoList.length - 1; i >= 0; i--) {
            if(usersInfoList[i].name.split(accountNotFoundMessage).join('') === name) {
                usersInfoList.splice(i, 1);
            }
        }
        saveUserListToCache(usersInfoList);

        //if list empty reset refresh time to zero
        if(usersInfoList.length === 0){
            deleteLeaderboardRelatedCache();
            refreshDashboard();
        };

        createLeaderboard();
    }

    function changeSortOrder(){
        if(wkof.settings.Leaderboard.userOrderOption !== 'keyDefault'){
            userSortingMethod = wkof.settings.Leaderboard.userOrderOption;//save user chosen sorting method
        }
        saveSortingMethod();
        inference();
        settings_dialog.close();
    }

    function changeNumberofTables(){
        if(wkof.settings.Leaderboard.numberOfLeaderboardTabless !== '0'){
            numberOfLeaderboardTables = wkof.settings.Leaderboard.numberOfLeaderboardTabless;//save user chosen number of tables
        }
        saveNumberOfLeaderboardTables();
        createLeaderboard();
        settings_dialog.close();
    }

    //for sorting and saving userlist to cache
    function inference(){
        //determine sorting order for users
        switch(userSortingMethod) {
            case 'key1'://lv->burn->name
                usersInfoList.sort(function(a, b){
                    if(a.level !== b.level) {
                        return b.level - a.level;
                    }else if(a.totalBurnPercentage !== b.totalBurnPercentage) {
                        return b.totalBurnPercentage - a.totalBurnPercentage;
                    }else {
                        return a.name.localeCompare(b.name, 'en');
                    }
                });
                break;
            case 'key2'://lv->name
                usersInfoList.sort(function(a, b){
                    if(a.level !== b.level) {
                        return b.level - a.level;
                    }else {
                        return a.name.localeCompare(b.name, 'en');
                    }
                });
                break;
            case 'key3'://burn->lv->name
                usersInfoList.sort(function(a, b){
                    if(a.totalBurnPercentage !== b.totalBurnPercentage) {
                        return b.totalBurnPercentage - a.totalBurnPercentage;
                    }else if(a.level !== b.level) {
                        return b.level - a.level;
                    }else {
                        return a.name.localeCompare(b.name, 'en');
                    }
                });
                break;
            case 'key4'://burn->name
                usersInfoList.sort(function(a, b){
                    if(a.totalBurnPercentage !== b.totalBurnPercentage) {
                        return b.totalBurnPercentage - a.totalBurnPercentage;
                    }else {
                        return a.name.localeCompare(b.name, 'en');
                    }
                });
                break;
            case 'key5'://name ascending
                usersInfoList.sort(function(a, b){ return a.name.localeCompare(b.name, 'en');});
                break;
            case 'key6'://name descending
                usersInfoList.sort(function(a, b){ return b.name.localeCompare(a.name, 'en');});
                break;
        }

        saveUserListToCache(usersInfoList);//save sorting result and any added users

        createLeaderboard();//renew html
    }

    //throttle the requests a little
    function delay(){
        return new Promise(resolve => setTimeout(resolve, 250));
    }

    //get level, avatar, name and SRS stats from wk profile
    async function assignLevelAndAvatarFromWkProfile(item)
    {
        await delay();

        let xmlhttp;
        let userName = '';
        let userLevel = 0;
        let userGravatarLink = '';
        let srsCountsLabeled = [];
        let hasUserLeveledUp = false;
        let userFound = false;

        if (window.XMLHttpRequest)
        {// code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp=new XMLHttpRequest();

            xmlhttp.onreadystatechange= function()
            {
                if (xmlhttp.readyState==4 && xmlhttp.status==200)
                {
                    //we get user information from the profile page e.g. wanikani.com/users/koichi
                    let userNameStart = xmlhttp.responseText.indexOf("<title>WaniKani / Profile / ");
                    let userLevelStart = xmlhttp.responseText.indexOf("info-level\">Level");
                    if (userLevelStart == -1){
                        console.error('Could not find level for user ' + item.name);
                    }
                    let userGravatarStart = xmlhttp.responseText.indexOf("alt=\"Your avatar\" src=\"");
                    if (userGravatarStart == -1){
                        console.error('Could not find gravatar link for user ' + item.name);
                    }

                    //get username
                    for(let i = 28; i < (28+item.name.length); i++){
                        userName+=xmlhttp.responseText[userNameStart+i];
                    }

                    //check to see if user given name and web retrieved user name are equal
                    if(userName.toLowerCase() === item.name.toLowerCase()){
                        let firstChar = xmlhttp.responseText[userLevelStart+18];
                        let secondChar = xmlhttp.responseText[userLevelStart+19];

                        if (/\d/.test(firstChar) && /\d/.test(secondChar)) {
                            userLevel = firstChar + secondChar;
                        } else if (/\d/.test(firstChar)) {
                            userLevel = firstChar;
                        } else {
                            userLevel = 0;
                        }

                        if (userLevel[1] == ','){ userLevel = userLevel[0];}//remove comma from single digit levels.

                        //check to see if user is already on the leaderboards
                        let found = usersInfoList.find(function(element) {
                            return element.name === userName.toLowerCase();
                        });
                        if(found !== undefined){
                            //check to see if user has leveled up, so we can display that later
                            if(found.level < userLevel && found.level != 0){
                                usersThatLeveledUp += found.name + ' ' + found.level + ' -> ' + userLevel + ', \n';
                                hasUserLeveledUp = true;
                            }
                        }

                        //get gravatar link
                        for(let i = 23; i < 100; i++){
                            if (xmlhttp.responseText[userGravatarStart+i] == '"'){ break; }
                            userGravatarLink+=xmlhttp.responseText[userGravatarStart+i];

                        }

                        userFound = true;
                    } else { //a wanikani profile page didn't exist for this username and we got redirected to dashboard

                        //check to see if username is already on the leaderboards
                        /*let found = usersInfoList.find(function(element) {
                            return element.name === item.name;
                        });
                        //Account may have had a username change or been deleted
                        if(found !== undefined && item.wasUserFound){
                            alert(item.name + ' this username cannot be found. the account may have had a name change, been deleted or an error may have occured.');
                        }*/

                        userLevel = -1;
                        userGravatarLink = 'https://www.gravatar.com/avatar/65977e18f599e0319495b468c92b5179?s=300&d=https://cdn.wanikani.com/default-avatar-300x300-20121121.png';//default avatar
                        userFound = false;
                    }

                    //get SRS scores from HTML structure
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(xmlhttp.responseText, 'text/html');

                    // Find all item spread table rows
                    const rows = doc.querySelectorAll('.item-spread-table-row');

                    const obj = {};
                    const srsLevels = ['apprentice', 'guru', 'master', 'enlightened', 'burned'];

                    rows.forEach((row, index) => {
                        if (index >= srsLevels.length) return;

                        const counts = row.querySelectorAll('.item-spread-table-row__count');
                        const total = row.querySelector('.item-spread-table-row__total');

                        if (counts.length >= 3) {
                            const radical = parseInt(counts[0].textContent.trim()) || 0;
                            const kanji = parseInt(counts[1].textContent.trim()) || 0;
                            const vocabulary = parseInt(counts[2].textContent.trim()) || 0;
                            const totalCount = parseInt(total?.textContent.trim()) || 0;

                            // Map to the expected property names
                            const prefix = srsLevels[index] === 'apprentice' ? 'appr' :
                            srsLevels[index] === 'guru' ? 'guru' :
                            srsLevels[index] === 'master' ? 'master' :
                            srsLevels[index] === 'enlightened' ? 'enlight' : 'burn';

                            obj[prefix + 'Rad'] = radical;
                            obj[prefix + 'Kan'] = kanji;
                            obj[prefix + 'Voc'] = vocabulary;
                            obj[prefix + 'Total'] = totalCount;
                        }
                    });

                    srsCountsLabeled.push(obj);
                }
            }
            xmlhttp.open("GET", '/users/' + item.name, false);
            xmlhttp.send();
        }

        item.level = userLevel;//assign level
        item.avatar_link = userGravatarLink;//assign gravatarlink
        item.realm_number = setRealm(item.level);//assign realm
        item.srs_distribution = srsCountsLabeled;//assign SRS stats
        item.hasLeveledUp = hasUserLeveledUp;//whether or not user leveled up since last refresh
        item.wasUserFound = userFound;//whether the user name yielded result in the past (is used to detect name changes or deletion of account)
        item.totalBurnPercentage = Math.round((srsCountsLabeled[0].burnTotal/totalNumberOfWKItems*100) * 100) / 100;
    }

    function showLevelUps(){
        if(usersThatLeveledUp != ''){
            usersThatLeveledUp = usersThatLeveledUp.substring(0,usersThatLeveledUp.length-3);//remove the ', '

            if(typeof swal === "function"){
                swal('The following user(s) leveled up: \n', usersThatLeveledUp);
            } else{
                alert('The following user(s) leveled up: \n' + usersThatLeveledUp);
            }
            usersThatLeveledUp = '';
        }
    }

    async function processArray() {
        const loaderElements = document.querySelectorAll('.leaderboard_loader');
        loaderElements.forEach(el => el.style.display = 'inline');

        const leaderboardSpans = document.querySelectorAll('.leaderboardSpan');
        leaderboardSpans.forEach(el => el.classList.add('blurry-text'));

        //process array in parallel
        const promises = usersInfoList.map(assignLevelAndAvatarFromWkProfile);//refresh all
        await Promise.all(promises);

        showLevelUps();
        inference();
    }

    //not called anywhere is for debugging purposes
    /*async function testData(){
        const obj = {};
        obj['name'] = 'testing';
        obj['level'] = 1;
        obj['avatar_link'] = 'https://www.gravatar.com/avatar/65977e18f599e0319495b468c92b5179?s=300&d=https://cdn.wanikani.com/default-avatar-300x300-20121121.png';
        obj['realm_number'] = 1;
        obj['srs_distribution'] = [{}];
        obj['hasLeveledUp'] = false;

        let object = [obj];

        usersInfoList.push(object[0]);//add single user to the rest of the users

        inference();
    }*/

    function startup() {
        //for testing purposes
        //deleteLeaderboardRelatedCache();
        //testData();

        //get cache
        getTimeSinceLastRefreshFromCache().then(function(result) {
            timeSinceLastRefresh = result;
            updateTimeSinceRefreshText();
        });

        //get cache
        getUserSortingMethodFromCache().then(function(result) {
            userSortingMethod = result;
            if (userSortingMethod == null){
                userSortingMethod = 'key1';
            }
        });

        //get cache
        getNumberOfLeaderboardTablesFromCache().then(function(result) {
            numberOfLeaderboardTables = result;
            if (numberOfLeaderboardTables == null){
                numberOfLeaderboardTables = '1';
            }
        });

        //get cache
        getUserListFromCache().then(function(result) {
            if(result !== [] && result != undefined){
                usersInfoList = result;
                createLeaderboard();
            } else { //rebuilt anew
                //usersInfoList = usersInfoListTestData; //testing
                processArray();
            }
        });
    }

    //------------------------------
    // Styling
    //------------------------------

    const leaderboardTableCss = `
        /* Leaderboard Container */
        #leaderboard .community-banner-widget {
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        /* Leaderboard Title */
        #leaderboard .community-banner-widget h3.small-caps {
            font-size: 1.3em;
            font-weight: bold;
            margin-bottom: 5px;
            padding-bottom: 10px;
        }

        /* Table Styling */
        #leaderboard table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
        }

        #leaderboard table tbody tr {
            transition: all 0.3s ease;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        #leaderboard table tbody tr:hover {
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            z-index: 10;
            position: relative;
        }

        #leaderboard table tbody tr td {
            padding: 12px 15px;
            vertical-align: middle;
            transition: all 0.2s ease;
        }

        #leaderboard table tbody tr td:first-child {
            font-size: 1.3em;
            font-weight: bold;
            width: 50px;
            text-align: center;
        }

        #leaderboard table tbody tr td:nth-child(2) {
            font-weight: 500;
        }

        #leaderboard table tbody tr td:last-child {
            width: 60px;
        }

        /* Link Styling */
        #leaderboard table tbody tr td a {
            color: white;
            text-decoration: none;
            display: block;
            font-weight: 500;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
        }

        #leaderboard table tbody tr td a:hover {
            text-decoration: underline;
        }

        /* Icon Buttons */
        .leaderboard-settings,
        .leaderboard-refresh,
        .leaderboard-resize,
        .leaderboard-export {
            transition: all 0.2s ease;
            opacity: 0.8;
        }

        .leaderboard-settings:hover,
        .leaderboard-refresh:hover,
        .leaderboard-resize:hover,
        .leaderboard-export:hover {
            opacity: 1;
            transform: scale(1.15);
        }

        .leaderboard-refresh:active {
            animation: spin 1s ease-in-out;
        }

        /*COLORS - Enhanced with better gradients and effects*/

        .apprColor {
            background: linear-gradient(135deg, #ff0099 0%, #dd0093 100%);
            color: white;
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        .apprColor:hover {
            background: linear-gradient(135deg, #ff1aa8 0%, #ee00a4 100%);
        }

        .guruColor {
            background: linear-gradient(135deg, #aa00ff 0%, #9300dd 100%);
            color: white;
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        .guruColor:hover {
            background: linear-gradient(135deg, #bb11ff 0%, #a400ee 100%);
        }

        .masterColor {
            background: linear-gradient(135deg, #5571e2 0%, #2545C3 100%);
            color: white;
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        .masterColor:hover {
            background: linear-gradient(135deg, #6682f3 0%, #3656d4 100%);
        }

        .enlightenedColor {
            background: linear-gradient(135deg, #00aaff 0%, #0093dd 100%);
            color: white;
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        .enlightenedColor:hover {
            background: linear-gradient(135deg, #11bbff 0%, #00a4ee 100%);
        }

        .burnedColor {
            background: linear-gradient(135deg, #fbc550 0%, #faac05 100%);
            color: #333;
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }

        .burnedColor:hover {
            background: linear-gradient(135deg, #ffd661 0%, #ffbd16 100%);
        }

        .customColor1 {
            background: linear-gradient(135deg, #ee00a4 0%, #dd0093 100%);
            color: white;
        }

        .errorColor {
            background: linear-gradient(135deg, #c62828 0%, #8b0000 100%);
            color: white;
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        /* None Available State */
        .none-available {
            text-align: center;
            color: #666;
        }

        /*END COLORS*/

        /*used to move level*/
        .floatRight {
            float: right;
            margin-left: 8px;
        }

        /*TOOLTIP*/
        [tooltip]:before {
            /* needed - do not touch */
            content: attr(tooltip);
            position: absolute;
            opacity: 0;
            z-index: 100;

            /* customizable */
            transition: all 0.2s ease;
            padding: 10px 15px;
            color: white;
            background: rgba(0, 0, 0, 0.9);
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            font-size: 0.9em;
            white-space: nowrap;
            pointer-events: none;
        }

        [tooltip]:hover:before {
            opacity: 1;
            margin-top: -45px;
            margin-left: 10px;
        }

        /* Avatar specific tooltip positioning */
        td.leaderboard-userImg[tooltip]:hover:before {
            margin-left: -100px;
        }

        /* Realm tooltip styling - make it smaller */
        td[tooltip]:first-child:hover:before {
            font-size: 0.7em;
        }

        [tooltip]:not([tooltip-persistent]):before {
            pointer-events: none;
        }

        a.tooltipImg strong {
            line-height: 30px;
        }

        a.tooltipImg span {
            z-index: 10;
            display: none;
            padding: 7px 10px;
            margin-top: 30px;
            margin-left: -160px;
            width: 300px;
            line-height: 16px;
        }

        a.tooltipImg:hover span {
            display: inline;
            position: absolute;
            border: 2px solid #FFF;
            color: #EEE;
            background: #333 url(https://cdn.wanikani.com/default-avatar-300x300-20121121.png) repeat-x 0 0;
        }

        .callout {
            z-index: 20;
            position: absolute;
            border: 0;
            top: -14px;
            left: 120px;
        }

        a.tooltipImg span {
            border-radius: 8px;
            box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.4);
        }

        a.tooltipImg:before {
            pointer-events: none;
        }

        /*END TOOLTIP*/

        /*LEADERBOARD*/

        /* User Avatar Styling */
        td.leaderboard-userImg {
            cursor: pointer;
            transition: all 0.2s ease;
        }

        td.leaderboard-userImg:hover {
            transform: scale(1.1);
        }

        td.leaderboard-userImg > img {
            border-radius: 50%;
            width: 40px;
            height: 40px;
            max-height: 40px;
            border: 3px solid rgba(255, 255, 255, 0.3);
            transition: all 0.2s ease;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }

        td.leaderboard-userImg:hover > img {
            border-color: rgba(255, 255, 255, 0.8);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        }

        /* Achievement Icons */
        .icon-level-up,
        .icon-trophy {
            font-size: 1.3em;
            margin-right: 5px;
        }

        /* Loader Animation */
        #leaderboard_loader {
            border: 6px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top: 6px solid #3498db;
            width: 50px;
            height: 50px;
            animation: spin 1s linear infinite;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            display: none;
            z-index: 1000;
        }

        /* Safari */
        @-webkit-keyframes spin {
            0% { -webkit-transform: rotate(0deg); }
            100% { -webkit-transform: rotate(360deg); }
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        /* Blur Effect */
        .textshadow .blurry-text {
            color: transparent;
            text-shadow: 0 0 8px rgba(0, 0, 0, 0.5);
        }

        .blurry-text,
        .blurry-text section .small-caps,
        .blurry-text section table tbody tr,
        .blurry-text section table tbody tr td a span {
            color: transparent;
            text-shadow: 0 0 8px rgba(0, 0, 0, 0.5);
        }

        /* File Import */
        #leaderboard-files-import {
            width: 0.1px;
            height: 0.1px;
            opacity: 0;
            overflow: hidden;
            position: absolute;
            z-index: -1;
        }

        label[for="leaderboard-files-import"] {
            cursor: pointer;
            transition: all 0.2s ease;
            opacity: 0.8;
        }

        label[for="leaderboard-files-import"]:hover {
            opacity: 1;
            transform: scale(1.15);
        }

        .leaderboard-img-center {
            display: block;
            margin-left: auto;
            margin-right: auto;
        }

        /* See More Section */
        #leaderboard .see-more {
            background: rgba(0, 0, 0, 0.05);
            border-radius: 8px;
            padding: 10px;
            margin-top: 10px;
            font-size: 0.9em;
            color: #666;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
            #leaderboard table tbody tr td {
                padding: 8px 10px;
                font-size: 0.9em;
            }

            td.leaderboard-userImg > img {
                width: 30px;
                height: 30px;
            }
        }

        /*END LEADERBOARD*/
        `;

    var leaderboardStyling = document.createElement('style');
    leaderboardStyling.type='text/css';
    if(leaderboardStyling.styleSheet){
        leaderboardStyling.styleSheet.cssText = leaderboardTableCss;
    }else{
        leaderboardStyling.appendChild(document.createTextNode(leaderboardTableCss));
    }
    document.getElementsByTagName('head')[0].appendChild(leaderboardStyling);

    //------------------------------
    // Leaderboard
    //------------------------------

    function processImportedUsers(file) {
        let reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function(event){
            let csv = event.target.result;
            csv = csv.replace(/[^ -~]+/g,' ');//remove non printable characters
            csv = csv.split(',').join(' ');//in case multiple spreadsheet columns are used
            csv += ' ';

            let temp = '';
            let preExistingUsers = '';
            for (let i = 0; i < csv.length; i++){
                if (csv[i] !== ' ' || csv[i].length === 0) {
                    temp += csv[i];
                } else if (temp !== '') {
                    temp = temp.toLowerCase();

                    //check to see if user is already on the leaderboards
                    let isInList = false;
                    for (let j = 0; j < usersInfoList.length; j++){
                        if(usersInfoList[j].name.toLowerCase() === temp || usersInfoList[j].name.toLowerCase() === temp+accountNotFoundMessage.toLowerCase()){
                            isInList = true;
                            break;
                        }
                    }
                    if(!isInList){
                        //create default user info
                        const obj = {};
                        obj['name'] = temp;
                        obj['level'] = 0;
                        obj['avatar_link'] = 'https://www.gravatar.com/avatar/65977e18f599e0319495b468c92b5179?s=300&d=https://cdn.wanikani.com/default-avatar-300x300-20121121.png';
                        obj['realm_number'] = 6;
                        obj['srs_distribution'] = [{}];
                        obj['hasLeveledUp'] = false;
                        obj['wasUserFound'] = false;
                        obj['totalBurnPercentage'] = 0;

                        let object = [obj];
                        usersInfoList.push(object[0]);//add single user to the rest of the users
                    } else{
                        //the following user is already on the board
                        preExistingUsers += temp+', ';
                    }

                    temp = '';
                }
            }
            if(preExistingUsers != ''){
                preExistingUsers = preExistingUsers.substring(0,preExistingUsers.length-2);//remove the ', '

                //check if custom box was included succesfully
                if(typeof swal === "function"){
                    swal("The following username(s) already exist on the leaderboard:", preExistingUsers);
                } else{
                    alert('The following username(s) already exist on the leaderboard: \n'+preExistingUsers);
                }
            }
            processArray();
        };
        reader.onerror = function(){
            if(typeof swal === "function"){
                swal('Unable to read ' + file.fileName);
            } else{
                alert('Unable to read ' + file.fileName);
            }
        };
    }

    function importUsers(evt){
        // Check for the various File API support.
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            // All the File APIs are supported.
        } else {
            if(typeof swal === "function"){
                swal('The File APIs are not fully supported in this browser.');
            } else{
                alert('The File APIs are not fully supported in this browser.');
            }
        }

        var files = evt.target.files;
        var file = files[0];

        // read the file metadata
        if(file.type === 'application/vnd.ms-excel'){
            // read the file contents
            processImportedUsers(file);
        } else {
            if(typeof swal === "function"){
                swal('File type \'' + file.type + '\' is incorrect.', '\r\nUse a .cvs file.');
            } else{
                alert('File type \'' + file.type + '\' is incorrect. \r\nUse a .cvs file.');
            }
        }
    }

    function exportUsers(){
        let csvContent = "data:text/csv;charset=utf-8,";
        usersInfoList.forEach(function(infoArray, index){
            let dataString = infoArray.name;//+','+infoArray.level+',https://www.gravatar.com/avatar/'+infoArray.avatar_link+','+wkRealmNames[infoArray.realm_number]+','+infoArray.srs_distribution;
            csvContent += dataString + "\n";
        });
        if(usersInfoList.length != 0){
            let encodedUri = encodeURI(csvContent);
            let link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "my_leaderboard.csv");
            document.body.appendChild(link);
            link.click();
        } else {
            if(typeof swal === "function"){
                swal('There were no users to export.');
            } else{
                alert('There were no users to export.');
            }
        }
    }

    //see if account is an admin account
    function isAdmin(name){
        if(adminNamesInfinity.indexOf(name) !== -1){
            return 'sym-∞ ' + adminIdentifier;
        } else if (adminNamesStar.indexOf(name) !== -1) {
            return 'sym-★ ' + adminIdentifier;
        } else if (adminNamesNone.indexOf(name) !== -1){
            return 'sym- ' + adminIdentifier;
        }
        return '';//not an admin account
    }

    //change admin level to ∞ or ★ or ' ' on hover
    function adminHovering(){
        const adminUsers = document.querySelectorAll(".adminUserLeaderboard");
        adminUsers.forEach(element => {
            element.addEventListener('mouseenter', function() {
                let hoverSymbol = '∞';
                let symType = this.className.substring(0,5);
                switch(symType) {
                    case 'sym-∞':
                        hoverSymbol = '∞';
                        break;
                    case 'sym-★':
                        hoverSymbol = '★';
                        break;
                    default:
                        hoverSymbol = '';
                }
                const secondChild = this.children[1];
                if (secondChild) {
                    secondChild.textContent = hoverSymbol;
                }
            });

            element.addEventListener('mouseleave', function() {
                const secondChild = this.children[1];
                if (secondChild) {
                    const level = secondChild.className.substring(0,2);
                    secondChild.textContent = level;
                }
            });
        });
    };

    //change leaderboard width
    function updateWidth(evt){//change icon when widened
        let classname = document.getElementsByClassName('leaderboardSpan');

        switch(evt.target.tableParam) {
            case 0:
                if(toggleLeaderboardWidth0){
                    shortenTable(classname, evt.target.tableParam);
                    toggleLeaderboardWidth0 = 0;
                } else {
                    widenTable(classname, evt.target.tableParam);
                    toggleLeaderboardWidth0 = 1;
                }
                break;
            case 1:
                if(toggleLeaderboardWidth1){
                    shortenTable(classname, evt.target.tableParam);
                    toggleLeaderboardWidth1 = 0;
                } else {
                    widenTable(classname, evt.target.tableParam);
                    toggleLeaderboardWidth1 = 1;
                }
                break;
            case 2:
                if(toggleLeaderboardWidth2){
                    shortenTable(classname, evt.target.tableParam);
                    toggleLeaderboardWidth2 = 0;
                } else {
                    widenTable(classname, evt.target.tableParam);
                    toggleLeaderboardWidth2 = 1;
                }
                break;
        }
    }

    function widenTable(classname, number){
        classname[number].setAttribute("style", "width: 100%;");
        classname[number].setAttribute("title", "Shorten screen");
    }

    function shortenTable(classname, number){
        classname[number].setAttribute("style", "width: ;");
        classname[number].setAttribute("title", "Widen screen");
    }

    function createLeaderboard() {
        let sectionContents = "";
        let timeSinceLastRefreshHtml = '';

        //console.log(usersInfoList);

        //loop to create multiple tables
        for (var i = 0; i < numberOfLeaderboardTables; i++){
            let numberOfUsersPerTable = usersInfoList.length/numberOfLeaderboardTables;
            let startNumberTable = Math.ceil(numberOfUsersPerTable*i);
            let endNumberTable = Math.floor((usersInfoList.length/numberOfLeaderboardTables)*(i+1));

            /*console.log('LOOP NUMBER:');
            console.log(i);
            console.log('number of users:');
            console.log(usersInfoList.length);
            console.log('number of tables:');
            console.log(numberOfLeaderboardTables);
            console.log('number of users per table:');
            console.log(numberOfUsersPerTable);
            console.log('start number:');
            console.log(startNumberTable);
            console.log('end number:');
            console.log(endNumberTable);
            console.log('--------------------------------------------------------------');*/

            //if userlist has three tables, an odd number of users and this is not the final table, add a user to the end
            if (numberOfLeaderboardTables == 2 && usersInfoList.length%2 != 0 && endNumberTable != usersInfoList.length){
                endNumberTable++;
            }

            //if userlist has three tables and tablelenght not a root of three
            if (numberOfLeaderboardTables == 3 && usersInfoList.length%3 != 0 && endNumberTable != usersInfoList.length){
                endNumberTable++;
            }


            //if userlist has an even number of user, three tables and this is not the final table, add a user to the end
            //if (usersInfoList.length%2 != 1 && endNumberTable != usersInfoList.length && ){
            //     endNumberTable++;
            // }
            //

            //if this is not the final table add one more user to the end
            if(endNumberTable >= usersInfoList.length){
                //endNumberTable--;
            }

            //if this is not the final table add one more user to the end
            if(endNumberTable != usersInfoList.length){
                //endNumberTable++;
            }



            sectionContents += `
                <div class="dashboard__widget dashboard__widget--full">
                    <div class="community-banner-widget theme--default" style="display: flex; flex-direction: column; position: relative;">
                        <h3 class="small-caps">Leaderboard</h3>
                        <svg class="leaderboard-settings" title="Add user" style="position:absolute; top:10px; right:15px; width:20px; height:20px; cursor:pointer;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>

                        <svg class="leaderboard-refresh" title="Refresh leaderboard" style="position:absolute; top:10px; right:40px; width:20px; height:20px; cursor:pointer;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>

                        <svg class="leaderboard-export" title="Download leaderboard" style="position:absolute; top:10px; left:15px; width:20px; height:20px; cursor:pointer;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                        </svg>

                        <input type="file" id="leaderboard-files-import" name="files[]" accept=".csv" multiple /><label class="icon-circle-arrow-up" for="leaderboard-files-import" title="Upload leaderboard" style="position:absolute; top:7.5px; left:25px;"></label>
                        <div id="leaderboard_loader" class="leaderboard_loader"></div>
                        <table>
                           <tbody>`;
            //if no users have been added yet
            if(usersInfoList.length == 0){
                timeSinceLastRefreshText = '0 days 0 hours 0 minutes';
                sectionContents += `<tr class="none-available">
                                        <td>
                                        You haven't added any users yet.
                                        </td>
                                    </tr>`
                timeSinceLastRefreshHtml = ``;
            } else {
                timeSinceLastRefreshHtml = `<div class="see-more" style="margin-top: 10px;">
                                                <span class="small-caps" style="padding: 3.5px 15px 0px 15px;">Time since last refresh:</span>
                                                ${timeSinceLastRefreshText}
                                            </div>`;
            }
            for (var j = startNumberTable; j < endNumberTable; j++){
                //check if user is admin
                let adminClass = isAdmin(usersInfoList[j].name);

                //check if username was valid
                let userErrorNotFoundMessage = usersInfoList[j].wasUserFound ? '' : accountNotFoundMessage;

                //calculate burn percentage
                let burnTotal = usersInfoList[j].level != 3 ? `Total Burned: ${usersInfoList[j].srs_distribution[0].burnTotal}, ${usersInfoList[j].totalBurnPercentage}%` : '&#9888; Users without subscription will show as level 3.';

                //for user achievements
                let userCelebrationIcon = '';
                //has user leveled up?
                if(usersInfoList[j].hasLeveledUp){userCelebrationIcon = 'icon-level-up';}
                //does user have 100% burned?
                if(usersInfoList[j].totalBurnPercentage >= 100){userCelebrationIcon = 'icon-trophy';}

                let burnPercentageGradient = usersInfoList[j].realm_number === 5 ? `background: linear-gradient(to right,
                    #faac05,
                    #faac05 ${usersInfoList[j].totalBurnPercentage}%,
                    rgba(255,255,255) ${usersInfoList[j].totalBurnPercentage+1.25}%,
                    #fbc550 ${usersInfoList[j].totalBurnPercentage+2.5}%);` : '';

                sectionContents += `<tr class="${leaderboardColors[usersInfoList[j].realm_number]}" style="${burnPercentageGradient}">
                                        <td style="text-align:center;" tooltip="${wkRealmNames[usersInfoList[j].realm_number]}">
                                            <span>${wkRealms[usersInfoList[j].realm_number]}</span>
                                        </td>
                                        <td tooltip="${burnTotal}">
                                            <a href="users/${usersInfoList[j].name}" target="_blank" class="${adminClass}">
                                                <span>${usersInfoList[j].name + userErrorNotFoundMessage}</span>
                                                <span class="${usersInfoList[j].level} floatRight">${usersInfoList[j].level}</span>
                                                <i class="${userCelebrationIcon} floatRight"></i>
                                            </a>
                                        </td>
                                        <td class="${usersInfoList[j].name} leaderboard-userImg" tooltip="Remove user?">
                                            <img class="leaderboard-img-center" src="https://www.gravatar.com/avatar/${usersInfoList[j].avatar_link}?s=300&d=https://cdn.wanikani.com/default-avatar-300x300-20121121.png"/>
                                        </td>
                                    </tr>`;
            }
            sectionContents += `
                               </tbody>
                           </table>
                           ${timeSinceLastRefreshHtml}
                       </div>
                   </div>`;
        }
        let leaderboardTableStyle = '<div id="leaderboard" class="dashboard__row">';
        sectionContents += `</div>`;

        //check if leaderboards is already there
        if(document.getElementById("leaderboard")) {
            const existingLeaderboard = document.getElementById("leaderboard");
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = leaderboardTableStyle+sectionContents;
            existingLeaderboard.replaceWith(tempDiv.firstChild);
        } else {
            // const progressionSection = document.querySelector('div.level-progress-widget');
            // const srsProgressSection = document.querySelector('section.srs-progress');
            // const tempDiv = document.createElement('div');
            // tempDiv.innerHTML = leaderboardTableStyle + sectionContents;

            // if (progressionSection) {
            //     progressionSection.after(tempDiv.firstChild);
            //     console.log('inserted after progression section');
            //     console.log(progressionSection);
            //     console.log(tempDiv);
            //     console.log(sectionContents);
            // } else if (srsProgressSection) {
            //     srsProgressSection.after(tempDiv.firstChild);
            // }

            // Find all dashboard rows
            const dashboardRows = document.querySelectorAll('div.dashboard__row');

            // Check if we have at least 3 rows and if test row doesn't already exist
            if (dashboardRows.length >= 3) {
                const thirdRow = dashboardRows[2]; // Third row (0-indexed)

                // Create the new test row
                const leaderboard = document.createElement('div');
                leaderboard.innerHTML = leaderboardTableStyle + sectionContents;

                // Insert after the third row
                thirdRow.after(leaderboard);
            }


        }

        //eventlisteners
        let classname = document.getElementsByClassName('leaderboard-settings');
        for (let i = 0; i < classname.length; i++) {
            classname[i].addEventListener('click', open_settings);
        }
        classname = document.getElementsByClassName('leaderboard-refresh');
        for (let i = 0; i < classname.length; i++) {
            classname[i].addEventListener('click', refreshDashboard);
        }
        // classname = document.getElementsByClassName('leaderboard-resize');
        // for (let i = 0; i < classname.length; i++) {
        //     classname[i].addEventListener('click', updateWidth);
        //     classname[i].tableParam = i;
        // }
        classname = document.getElementsByClassName('leaderboard-export');
        for (let i = 0; i < classname.length; i++) {
            classname[i].addEventListener('click', exportUsers);
        }
        document.getElementById('leaderboard-files-import').addEventListener('change', importUsers);

        const leaderboardUserImgs = document.querySelectorAll('#leaderboard .leaderboard-userImg');
        leaderboardUserImgs.forEach(element => {
            element.addEventListener('click', deleteUser);
        });

        adminHovering();
    }

    startup();
})();
