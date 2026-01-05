// ==UserScript==
// @name         Kongquer
// @namespace    http://alphaoverall.com
// @version      1.25
// @description  Adds a number of commands to Kongregate chat
// @author       AlphaOverall
// @match        http://www.kongregate.com/games/*/*
// @downloadURL https://update.greasyfork.org/scripts/9913/Kongquer.user.js
// @updateURL https://update.greasyfork.org/scripts/9913/Kongquer.meta.js
// ==/UserScript==

//==========
// Kongquer
// http://alphaoverall.com
// by AlphaOverall (http://www.kongregate.com/accounts/AlphaOverall)
// Inspired by Kongregate Get (http://userscripts-mirror.org/scripts/review/56432)
//==========

var dom = (typeof unsafeWindow === "undefined"?window:unsafeWindow);

function init_kongquer(){
    function makeLink(user){
        return '<a href="#" onclick="holodeck.showMiniProfile(\'' + user + '\'); return false;">' + user + '</a>'; 
    }
    var holodeck = dom.holodeck;
    ChatDialogue = dom.ChatDialogue;
    //
    //Test command so you don't look stupid if script doesn't load
    //
    holodeck.addChatCommand("test", function(l,n){
        l.activeDialogue().displayUnsanitizedMessage("Kong Bot", "Script is active! Have fun...", {"class":"whisper received_whisper"}, {non_user: true});
        return false;
    });
    //
    //From original Kongregate Get script (http://userscripts-mirror.org/scripts/review/56432)
    //
    holodeck.addChatCommand("avg", function(l,n){
        var roomDetails = l.chatWindow().activeRoom();
        var allUsers = roomDetails.users();
        var allLevels = 0;
        for(var i=0; i < allUsers.length; i++){
            allLevels += allUsers[i]._level;
        }
        var avgLevel = Math.round(allLevels/allUsers.length*10)/10;
        l.activeDialogue().displayUnsanitizedMessage("Average Level in Room", avgLevel , {"class":"whisper received_whisper"}, {non_user: true});
        return false;
    });
    if(holodeck && ChatDialogue && !holodeck._chat_commands.mostplayed) {	
        //Credit goes entirely to Ventero for this command. Thanks for fixing the command after the Kongregate update, Vent :)
        holodeck.addChatCommand("mostplayed", function(l,n){
            var matchArr = n.match(/\/\S+\s+(\d+)/),
                dialog = l.activeDialogue(),
                gamesCount = 5,
                userList = dom.$A(l.chatWindow().activeRoom().users()),
                usersCount = userList.length;
            if(matchArr && matchArr[1]) gamesCount = matchArr[1];
            function p(count){
                return count == 1?"":"s";
            }
            var games = dom.$H();
            userList.each(function(user){
                console.log(user);
                var o = user._game_url;
                if(!games.get(o)){
                    games.set(o, {
                        title: user._game_title,
                        count: 0,
                        user: "",
                        url: o
                    });
                }
                games.get(o).count++;
                games.get(o).user = user.username;
            });

            var countArr = games.values().sort(function(a,b){
                return +b.count - +a.count;
            }).slice(0, gamesCount);
            var totalCount = games.size();

            dialog.displayUnsanitizedMessage("Kong Bot", usersCount+" user"+p(usersCount)+" playing "+totalCount+" different game" + p(totalCount), {"class":"whisper received_whisper"}, {non_user: true});
            dialog.displayUnsanitizedMessage("Kong Bot", gamesCount + " most played game" + p(gamesCount) + ":", {"class":"whisper received_whisper"}, {non_user: true});
            countArr.each(function(obj){
                dialog.displayUnsanitizedMessage("Kong Bot",
                                                 obj.count + " user" + p(obj.count) + " (" +
                                                 (obj.count > 1 ? "" : makeLink(obj.user) + ", ") +
                                                 (100*obj.count/usersCount).toFixed(1) + "%) " +
                                                 (obj.count > 1 ? "are" : "is") + ' playing <a href="' +
                                                 obj.url + '">' + obj.title + "</a>", {"class":"whisper received_whisper"}, {non_user: true});
            });
            return false;
        });
        holodeck._chat_commands.mp = holodeck._chat_commands.getmp = holodeck._chat_commands.mostplayed;
    }
    //
    //Rest by AlphaOverall
    //
    holodeck.addChatCommand("highlvl", function(l,n){
        var roomDetails = l.chatWindow().activeRoom();
        var allUsers = roomDetails.users();
        var highLevels = "";
        var highestLevel = 0;
        var count = 0;
        for(var i=0; i < allUsers.length; i++){
            if (allUsers[i]._level > highestLevel){
                highestLevel = allUsers[i]._level;
                highLevels = "<img src=\"" + allUsers[i]._chat_avatar_url + "\">" + makeLink(allUsers[i].username);
                count = 1;
            }
            else if (allUsers[i]._level == highestLevel){
                highLevels = highLevels + ", <img src=\"" + allUsers[i]._chat_avatar_url + "\">" + makeLink(allUsers[i].username);
                count+=1;
            }
        }
        l.activeDialogue().displayUnsanitizedMessage("Highest Level in Room", highestLevel + ", Usercount: " + count + ", Users: " + highLevels, {"class":"whisper received_whisper"}, {non_user: true});
        return false;
    });

    holodeck.addChatCommand("lowlvl", function(l,n){
        var roomDetails = l.chatWindow().activeRoom();
        var allUsers = roomDetails.users();
        var lowLevels = "";
        var lowestLevel = Infinity; //Just to makes sure :P
        var count = 0;
        for(var i=0; i < allUsers.length; i++){
            if (allUsers[i]._level < lowestLevel){
                lowestLevel = allUsers[i]._level;
                lowLevels = "<img src=\"" + allUsers[i]._chat_avatar_url + "\">" + makeLink(allUsers[i].username);
                count = 1;
            }
            else if (allUsers[i]._level == lowestLevel){
                count+=1;
                lowLevels = lowLevels + ", <img src=\"" + allUsers[i]._chat_avatar_url + "\">" + makeLink(allUsers[i].username);
            }
        }
        l.activeDialogue().displayUnsanitizedMessage("Lowest Level in Room", lowestLevel + ", Usercount: " + count + ", Users: " + lowLevels, {"class":"whisper received_whisper"}, {non_user: true});
        return false;
    });

    holodeck.addChatCommand("list", function(l,n){
        var roomDetails = l.chatWindow().activeRoom();
        var allUsers = roomDetails.users();
        var userList = "";
        var word = n.match(/^\/\S+\s+(.+)/);
        var count = 0;
        if (word){
            var toFind = word[1];
            for(var i=0; i < allUsers.length; i++){
                if (allUsers[i].username.toLowerCase().includes(toFind.toLowerCase())){
                    if (userList == ""){
                        userList = "<img src=\"" + allUsers[i]._chat_avatar_url + "\">" + makeLink(allUsers[i].username);
                        count = 1;
                    }
                    else{
                        count+=1;
                        userList = userList + ", <img src=\"" + allUsers[i]._chat_avatar_url + "\">" + makeLink(allUsers[i].username);
                    }
                }
            }
            l.activeDialogue().displayUnsanitizedMessage("Usernames Containing " + word[1], "Usercount: " + count + ", Users: " + userList, {"class":"whisper received_whisper"}, {non_user: true});
        }
        else{
            l.activeDialogue().displayUnsanitizedMessage("Kong Bot", "Please use this command like " + n + " cat", {"class":"whisper received_whisper"}, {non_user: true});
        }
        return false;
    });
    holodeck.addChatCommand("levels", function(l,n){
        var z = n.match(/^\/\S+\s+(.+)/);
        var roomDetails = l.chatWindow().activeRoom();
        var allUsers = roomDetails.users();
        if (z){
            var userLevels = "";
            var levelCount = [];
            var displaymessage = "";
            if (z[1].includes("-")){
                var inbetween = z[1].split("-");
                console.log(inbetween[0]);
                console.log(inbetween[1]);
                if (inbetween[0] < inbetween[1]){
                    for (var a=inbetween[0]; a <= inbetween[1]; a++){
                        levelCount.push(a);
                    }
                }
                else{
                    for (var a=inbetween[1]; a <= inbetween[0]; a++){
                        levelCount.push(a);
                    }
                }
                displaymessage = z[1];
            }
            else{
                var levelCount = z[1].split(" ");
                displaymessage = levelCount.join(", ");
            }
            console.log(levelCount);
            var count = 0;
            for (var b=0; b <= levelCount.length; b++){
                for(var i=0; i < allUsers.length; i++){
                    if (allUsers[i]._level == levelCount[b] && userLevels == ""){
                        userLevels = "<img src=\"" + allUsers[i]._chat_avatar_url + "\">" + makeLink(allUsers[i].username);
                        count = 1;
                    }
                    else if (allUsers[i]._level == levelCount[b]){
                        count+=1;
                        userLevels = userLevels + ", <img src=\"" + allUsers[i]._chat_avatar_url + "\">" + makeLink(allUsers[i].username);
                    }
                }
                
            }
            l.activeDialogue().displayUnsanitizedMessage("Level " + displaymessage, "Usercount: " + count + ", Users: " + userLevels, {"class":"whisper received_whisper"}, {non_user: true});
            return false;
        }
        else{
            var levelsList = [l._active_user._attributes._object.level];
            for(var j=0; j < allUsers.length; j++){
                for (var k=0; k <= allUsers[j]._level; k++){
                    if (allUsers[j]._level == k){
                        if (levelsList.indexOf(k) < 0){
                            levelsList.push(k);
                        }
                    }
                }
            }
            levelsList.sort(function(a, b){return a-b});
            l.activeDialogue().displayUnsanitizedMessage("Levels", levelsList.join(", "), {"class":"whisper received_whisper"}, {non_user: true});
            return false;
        }
    });
    
    holodeck.addChatCommand("developer", function(l,n){
        var roomDetails = l.chatWindow().activeRoom();
        var allUsers = roomDetails.users();
        var devs = [];
        for(var i=0; i < allUsers.length; i++){
            if (allUsers[i]._developer){
                devs.push(makeLink(allUsers[i].username));
            }
        }
        l.activeDialogue().displayUnsanitizedMessage("Developers in room", devs.join(", "), {"class":"whisper received_whisper"}, {non_user: true});
        return false;
    });

    holodeck.addChatCommand("admin", function(l,n){
        var roomDetails = l.chatWindow().activeRoom();
        var allUsers = roomDetails.users();
        var admins = [];
        for(var i=0; i < allUsers.length; i++){
            if (allUsers[i]._admin){
                admins.push(makeLink(allUsers[i].username));
            }
        }
        l.activeDialogue().displayUnsanitizedMessage("Admins in room", admins.join(", "), {"class":"whisper received_whisper"}, {non_user: true});
        return false;
    });
    
    holodeck.addChatCommand("moderator", function(l,n){
        var roomDetails = l.chatWindow().activeRoom();
        var allUsers = roomDetails.users();
        var mods = [];
        for(var i=0; i < allUsers.length; i++){
            if (allUsers[i]._moderator_room_ids.length > 0 || allUsers[i]._moderator_game_ids.length > 0){
                mods.push(allUsers[i].username);
            }
        }
        l.activeDialogue().displayUnsanitizedMessage("Mods in room", mods.join(", "), {"class":"whisper received_whisper"}, {non_user: true});
        return false;
    });
    
    //Simple commands that will show up in user info also
    holodeck.addChatCommand("id", function(l,n){
        var user = l._active_user._attributes._object;
        l.activeDialogue().displayUnsanitizedMessage("ID", user.id, {"class":"whisper received_whisper"}, {non_user: true});
        return false;
    });
    
    holodeck.addChatCommand("username", function(l,n){
        var user = l._active_user._attributes._object;
        l.activeDialogue().displayUnsanitizedMessage("Username", makeLink(user.username), {"class":"whisper received_whisper"}, {non_user: true});
        return false;
    });
    
    holodeck.addChatCommand("kreds", function(l,n){
        var user = l._active_user._attributes._object;
        l.activeDialogue().displayUnsanitizedMessage("Kreds", user.kreds_balance, {"class":"whisper received_whisper"}, {non_user: true});
        return false;
    });
    holodeck.addChatCommand("level", function(l,n){
        var user = l._active_user._attributes._object;
        l.activeDialogue().displayUnsanitizedMessage("Level", user.level, {"class":"whisper received_whisper"}, {non_user: true});
        return false;
    });
    
    holodeck.addChatCommand("age", function(l,n){
        var user = l._active_user._attributes._object;
        l.activeDialogue().displayUnsanitizedMessage("Age", user.age, {"class":"whisper received_whisper"}, {non_user: true});
        return false;
    });
    holodeck.addChatCommand("email", function(l,n){
        var user = l._active_user._attributes._object;
        l.activeDialogue().displayUnsanitizedMessage("Name/Email", user.sender_name_or_email, {"class":"whisper received_whisper"}, {non_user: true});
        return false;
    });
    
    holodeck.addChatCommand("user", function(l,n){
        var z = n.match(/^\/\S+\s+(.+)/);
        if (z){
            var roomDetails = l.chatWindow().activeRoom();
            var allUsers = roomDetails.users();
            for(var i=0; i < allUsers.length; i++){
                if (i == allUsers.length-1 && allUsers[i].username != z[1]){
                    l.activeDialogue().displayUnsanitizedMessage("Kong Bot", "User not in chat... Opening mini profile", {"class":"whisper received_whisper"}, {non_user: true});
                    holodeck.showMiniProfile(z[1]);
                    return false;
                }
                if (allUsers[i].username == z[1]){
                    var user = allUsers[i];
                    l.activeDialogue().displayUnsanitizedMessage("Username", "<img src=\""+user._chat_avatar_url+"\"></img>" + makeLink(user.username), {"class":"whisper received_whisper"}, {non_user: true});
                    l.activeDialogue().displayUnsanitizedMessage("Level", user._level, {"class":"whisper received_whisper"}, {non_user: true});
                    if (user._moderator_room_ids.length == 0 && user._moderator_game_ids.length == 0){
                        l.activeDialogue().displayUnsanitizedMessage("Admin/Moderator/Developer/Premium",user._admin+"/false/"+user._developer+"/"+user._premium, {"class":"whisper received_whisper"}, {non_user: true});
                    }
                    else{
                        l.activeDialogue().displayUnsanitizedMessage("Admin/Moderator/Developer/Premium",user._admin+"/true/"+user._developer+"/"+user._premium, {"class":"whisper received_whisper"}, {non_user: true});
                        if (!user._admin) {
                            l.activeDialogue().displayUnsanitizedMessage("Moderator Game Ids", user._moderator_game_ids.join(", "), {"class":"whisper received_whisper"}, {non_user: true});
                            l.activeDialogue().displayUnsanitizedMessage("Moderator Room Ids", user._moderator_room_ids.join(", "), {"class":"whisper received_whisper"}, {non_user: true});
                        }
                    }
                    l.activeDialogue().displayUnsanitizedMessage("Playing", "<a href=\"http://www.kongregate.com" + user._game_url + "\" target=\"_blank\">" + user._game_title + "</a>", {"class":"whisper received_whisper"}, {non_user: true});
                    l.activeDialogue().displayUnsanitizedMessage("Presence", user._presence, {"class":"whisper received_whisper"}, {non_user: true});
                    l.activeDialogue().displayUnsanitizedMessage("Role", user._role, {"class":"whisper received_whisper"}, {non_user: true});
                    return false;
                }
            }
        }
        else {
            var user = l._active_user._attributes._object;
            l.activeDialogue().displayUnsanitizedMessage("Username", "<img src=\""+user.avatar_url+"\">" + makeLink(user.username), {"class":"whisper received_whisper"}, {non_user: true});
            l.activeDialogue().displayUnsanitizedMessage("Age", user.age, {"class":"whisper received_whisper"}, {non_user: true});
            l.activeDialogue().displayUnsanitizedMessage("Admin/Moderator/Developer/Premium",user.admin+"/"+user.moderator+"/"+user.developer+"/"+user.premium, {"class":"whisper received_whisper"}, {non_user: true});
            l.activeDialogue().displayUnsanitizedMessage("ID", user.id, {"class":"whisper received_whisper"}, {non_user: true});
            l.activeDialogue().displayUnsanitizedMessage("Level", user.level, {"class":"whisper received_whisper"}, {non_user: true});
            l.activeDialogue().displayUnsanitizedMessage("Points for Next Level", user.points_away, {"class":"whisper received_whisper"}, {non_user: true});
            l.activeDialogue().displayUnsanitizedMessage("Total Points", user.points, {"class":"whisper received_whisper"}, {non_user: true});
            l.activeDialogue().displayUnsanitizedMessage("Last Level Up", user.last_levelup_at, {"class":"whisper received_whisper"}, {non_user: true});
            l.activeDialogue().displayUnsanitizedMessage("Kreds", user.kreds_balance, {"class":"whisper received_whisper"}, {non_user: true});
            l.activeDialogue().displayUnsanitizedMessage("Gameplays", user.gameplays_count, {"class":"whisper received_whisper"}, {non_user: true});
            l.activeDialogue().displayUnsanitizedMessage("Game Ratings", user.ratings_count, {"class":"whisper received_whisper"}, {non_user: true});
            l.activeDialogue().displayUnsanitizedMessage("BOTD Earned This Week", user.botds_this_week, {"class":"whisper received_whisper"}, {non_user: true});
            l.activeDialogue().displayUnsanitizedMessage("Name/Email", user.sender_name_or_email, {"class":"whisper received_whisper"}, {non_user: true});
            return false;
        }
    });

    holodeck.addChatCommand("available", function(l,n){
        var z = n.match(/^\/\S+\s+(.+)/);
        if (z){
            l.activeDialogue().displayUnsanitizedMessage("Kong Bot", "Availability of " + z[1] + ":<iframe src=\"httP://www.kongregate.com/accounts/availability?username=" + z[1] + "\" width=\"100%\" height=\"30\"></iframe>", {"class":"whisper received_whisper"}, {non_user: true});
        }
        return false;
    });
    
    holodeck.addChatCommand("info", function(l,n){
        var info = l._chat_window._active_room;
        var room = info._room;
        l.activeDialogue().displayUnsanitizedMessage("Room Name", room.name, {"class":"whisper received_whisper"}, {non_user: true});
        l.activeDialogue().displayUnsanitizedMessage("Room ID", room.id, {"class":"whisper received_whisper"}, {non_user: true});
        l.activeDialogue().displayUnsanitizedMessage("Room Owner", "<a href=\"http://www.kongregate.com/accounts/" + room.owner + "\" target=\"_blank\">" + room.owner + "</a>", {"class":"whisper received_whisper"}, {non_user: true});
        l.activeDialogue().displayUnsanitizedMessage("Room Type", room.type, {"class":"whisper received_whisper"}, {non_user: true});
        l.activeDialogue().displayUnsanitizedMessage("Favorite Room", info._favorite_room, {"class":"whisper received_whisper"}, {non_user: true});
        l.activeDialogue().displayUnsanitizedMessage("Users In Room", info._number_in_room_node.innerText, {"class":"whisper received_whisper"}, {non_user: true});
        l.activeDialogue().displayUnsanitizedMessage("Guests In Room", info._guests_in_room_node.innerText, {"class":"whisper received_whisper"}, {non_user: true});
        return false;
    });

    holodeck.addChatCommand("botd", function(l,n){
        var kbotd = l._active_user._attributes._object;
        var typeOf = "(easy)";
        if (kbotd.botd_reward_points == 5){//Do nothing
        }
        else if (kbotd.botd_reward_points == 15) {typeOf = "(medium)";}
        else if (kbotd.botd_reward_points == 30){typeOf = "(hard)";}
        else if (kbotd.botd_reward_points == 60){typeOf = "(impossible)";}
        else {typeOf = "Points: " + kbotd.botd_reward_points;} //Just in case
        l.activeDialogue().displayUnsanitizedMessage("BOTD", "<img src=\""+kbotd.botd_icon_uri+"\"></img>" + "<a href=\"" + kbotd.botd_game_uri + "\" target=\"_blank\">" + kbotd.botd_game_name + " - " + kbotd.botd_description + "</a> " + typeOf, {"class":"whisper received_whisper"}, {non_user: true});
        return false;
    });

    holodeck.addChatCommand("friends", function(l,n){
        var kongfriends = l._chat_window._friends;
        var final = [];
        for(var friend in kongfriends){
            final.push("<a href=\"http://www.kongregate.com/accounts/" + friend + "\" target=\"_blank\">" + friend + "</a>");
        }
        l.activeDialogue().displayUnsanitizedMessage("Friends", final.join(", "), {"class":"whisper received_whisper"}, {non_user: true});
        return false;
    });

    holodeck.addChatCommand("online", function(l,n){
        var online = document.getElementsByClassName("chat_actions_list")[0].childNodes[5];
        online.click();
        return false;
    });

    holodeck.addChatCommand("exit", function(l,n){
        close();
        return false;
    });

    holodeck.addChatCommand("open", function(l,n){
        var z = n.match(/^\/\S+\s+(.+)/);
        if (z[1]) {
            m = z[1].split(" ");
            if (m[0] == "accounts"){
                if (m[1]){
                    open("http://www.kongregate.com/accounts/" + m[1], "_blank");
                }
                else{
                    open("http://www.kongregate.com/accounts/" + l._active_user._attributes._object.username);
                }
            }
            else if (m[0] == "games"){
                if (m[1]) {
                    if (m[2]){
                        open("http://www.kongregate.com/games/" + m[1] + "/" + m[2], "_blank");
                    }
                    else{
                        l.activeDialogue().displayUnsanitizedMessage("Kong Bot", "No specified game", {"class":"whisper received_whisper"}, {non_user: true});
                    }
                }
                else{
                    l.activeDialogue().displayUnsanitizedMessage("Kong Bot", "No specified game creator", {"class":"whisper received_whisper"}, {non_user: true});
                }
            }
            else {
                open("http://www.kongregate.com/search?q=" + z[1], "_blank");
            }
        }
        else {
            open("http://www.kongregate.com/accounts/" + l._active_user._attributes._object.username);
        }
        return false;
    });

    holodeck.addChatCommand("khelp", function(l,n){
        open("http://www.kongregate.com/pages/help", "_blank");
        return false;
    });
    
    holodeck.addChatCommand("kong", function(l,n){
        open("http://www.kongregate.com", "_blank");
        return false;
    });
    holodeck.addChatCommand("help", function(l,n){
        open("http://www.alphaoverall.com", "_blank");
        return false;
    });
    holodeck.addChatCommand("signup", function(l,n){
        lightbox.prototype.initializeKongregateLightboxFromAjax('/accounts/new/behind_login?game_id=' + active_user.gameId(), { afterStaticContentLoad:lightbox.prototype.toggleRegistration });
        return false;
    });
    holodeck.addChatCommand("login", function(l,n){
        active_user.activateInlineLogin();
        return false;
    });
    holodeck.addChatCommand("signout", function(l,n){
        signoutFromSite();
        return false;
    });
    holodeck.addChatCommand("google", function(l,n){
        var z = n.match(/^\/\S+\s+(.+)/);
        if (z) {
            open("https://www.google.com/search?q=" + z[1], "_blank");
        }
        else {
            open("https://www.google.com", "_blank");
        }
        return false;
    });
    holodeck.addChatCommand("bing", function(l,n){
        var z = n.match(/^\/\S+\s+(.+)/);
        if (z) {
            open("https://www.bing.com/search?q=" + z[1], "_blank");
        }
        else {
            open("https://www.bing.com", "_blank");
        }
        return false;
    });
    holodeck.addChatCommand("yahoo", function(l,n){
        var z = n.match(/^\/\S+\s+(.+)/);
        if (z) {
            open("https://search.yahoo.com/search;_ylt=Aq7xBwaF.DQZx151DcVK87ybvZx4?p=" + z[1], "_blank");
        }
        else {
            open("https://www.yahoo.com", "_blank");
        }
        return false;
    });
    holodeck.addChatCommand("url", function(l,n){
        var z = n.match(/^\/\S+\s+(.+)/);
        if (z) {
            if (!z[1].includes("http://") && !z[1].includes("https://")){
                open("http://"+z[1], "_blank");
            }
            else {
                open(z[1], "_blank");
            }
        }
        else {
            l.activeDialogue().displayUnsanitizedMessage("Kong Bot", "Please use command like " + n + " https://www.google.com", {"class":"whisper received_whisper"}, {non_user: true});
        }
        return false;
    });
    
    holodeck.addChatCommand("calculator", function(l,n){
        var z = n.match(/^\/\S+\s+(.+)/);
        var output = "Nothing happened";
        if (z) {
            /*jshint multistr: true */
            if (z[1] == "help"){
                l.activeDialogue().displayUnsanitizedMessage("Math Commands", "+,-,*,<br>Math.abs(a) = absolute value of a<br>Math.acos(a) = arc cosine of a<br>\
Math.asin(a) = arc sine of a<br>Math.atan(a) = arc tangent of a<br>Math.atan2(a,b) = arc tangent of a/b<br>Math.ceil(a) = integer closest to a and not less than a<br>\
Math.cos(a) = cosine of a<br>Math.exp(a) = exponent of a (Math.E to the power a)<br>Math.floor(a) = integer closest to a, not greater than a<br>Math.log(a) = log of a base e<br>\
Math.max(a,b) = the maximum of a and b<br>Math.min(a,b) = the minimum of a and b<br>Math.pow(a,b) = a to the power b<br>Math.random() = pseudorandom number 0 to 1<br>\
Math.round(a) =  integer closest to a <br> Math.sin(a) = sine of a<br>Math.sqrt(a) = square root of a<br>Math.tan(a) = tangent of a", {"class":"whisper received_whisper"}, {non_user: true});
            }
            else{
                try {
                    output = eval(z[1]); //I know, I know, eval is evil
                    l.activeDialogue().displayUnsanitizedMessage("Calculation", z[1] + " = " + output, {"class":"whisper received_whisper"}, {non_user: true});
                }
                catch (err){
                    l.activeDialogue().displayUnsanitizedMessage("Kong Bot", err, {"class":"whisper received_whisper"}, {non_user: true});
                }
            }
        }
        else {
            l.activeDialogue().displayUnsanitizedMessage("Kong Bot", "Please use command like " + n + " 4+3-8*9/3^.5", {"class":"whisper received_whisper"}, {non_user: true});
        }
        console.log(output);
        return false;
    });
    holodeck.addChatCommand("youtube", function(l,n){
        var z = n.match(/^\/\S+\s+(.+)/);
        if (z) {
            var m = z[1].split(" ");
            if (m[0] == "embed"){
                var chatWindow = document.getElementsByClassName("chat_message_window");
                var chatWin;
                if (chatWindow[2] != undefined && chatWindow[2].offsetHeight > chatWindow[1].offsetHeight){
                    chatWin = chatWindow[2];
                }
                else {
                    chatWin = chatWindow[1];
                }
                var h = chatWin.offsetHeight;
                if (chatWin.offsetWidth > chatWin.offsetHeight) {
                    h = chatWin.offsetHeight;
                }
                else{
                    h = chatWin.offsetWidth*9/16; //YouTube 16:9 aspect ratio
                }
                if (m[1].includes("youtu.be/")){
                    l.activeDialogue().displayUnsanitizedMessage("YouTube", "<iframe src=\"https://www.youtube.com/embed/" + m[1].split("youtu.be/")[1] + "\" width=\"100%\" height=\"" + h +"\"></iframe>", {"class":"whisper received_whisper"}, {non_user: true});
                }
                else if (m[1].includes("youtube.com/watch?v=")){
                    l.activeDialogue().displayUnsanitizedMessage("YouTube", "<iframe src=\"https://www.youtube.com/embed/" + m[1].split("youtube.com/watch?v=")[1] + "\" width=\"100%\" height=\"" + h + "\"></iframe>", {"class":"whisper received_whisper"}, {non_user: true});
                }
                else{
                    l.activeDialogue().displayUnsanitizedMessage("YouTube", "Invalid YouTube video url", {"class":"whisper received_whisper"}, {non_user: true});
                }
            }
            else {
                open("https://www.youtube.com/results?search_query=" + z[1], "_blank");
            } 
        }
        else {
            open("https://www.youtube.com", "_blank");
        }
        return false;
    });
    holodeck.addChatCommand("mp3", function(l,n){
        var z = n.match(/^\/\S+\s+(.+)/);
        if (z) {
            l.activeDialogue().displayUnsanitizedMessage("MP3 Container", "<audio src=\"" + z[1] + "\" controls><embed src=\"" + z[1] + "\"	width=\"100%\" height=\"90\" loop=\"false\" autostart=\"true\"/>" +
                                                         "</audio>", {"class":"whisper received_whisper"}, {non_user: true});
        }
        else {
            l.activeDialogue().displayUnsanitizedMessage("MP3 Container", "Invalid mp3 url", {"class":"whisper received_whisper"}, {non_user: true});
        }
        return false;
    });
    holodeck.addChatCommand("time", function(l,n){
        var today = new Date(); 
        var format = today.getDate() + "/" + (today.getMonth()+1)  + "/" + today.getFullYear() + ", " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        l.activeDialogue().displayUnsanitizedMessage("Date/Time", format, {"class":"whisper received_whisper"}, {non_user: true});
        return false;
    });
    holodeck.addChatCommand("reload", function(l,n){
        location.reload();
        return false;
    });
    holodeck.addChatCommand("clear", function(l,n){
        holodeck._active_dialogue.clear();
        return false;
    });
    
    holodeck._chat_commands.lol = holodeck._chat_commands.hi = holodeck._chat_commands.hmm = holodeck._chat_commands.test;
    holodeck._chat_commands.userlist = holodeck._chat_commands.username = holodeck._chat_commands.list;
    holodeck._chat_commands.date = holodeck._chat_commands.datetime = holodeck._chat_commands.now = holodeck._chat_commands.time;
    holodeck._chat_commands.math = holodeck._chat_commands.calc = holodeck._chat_commands.calculator;
    holodeck._chat_commands.goto = holodeck._chat_commands.http = holodeck._chat_commands.www = holodeck._chat_commands.url;
    holodeck._chat_commands.lvl = holodeck._chat_commands.level;
    holodeck._chat_commands.konghelp = holodeck._chat_commands.kongregatehelp = holodeck._chat_commands.khelp;
    holodeck._chat_commands.kongregate = holodeck._chat_commands.kong;
    holodeck._chat_commands.avglvl = holodeck._chat_commands.alvl = holodeck._chat_commands.avg;
    holodeck._chat_commands.close = holodeck._chat_commands.exit;
    holodeck._chat_commands.roominfo = holodeck._chat_commands.info;
    holodeck._chat_commands.friendsonline = holodeck._chat_commands.online;
    holodeck._chat_commands.u = holodeck._chat_commands.me = holodeck._chat_commands.user;
    holodeck._chat_commands.admins = holodeck._chat_commands.administrator = holodeck._chat_commands.administrators = holodeck._chat_commands.admin;
    holodeck._chat_commands.dev = holodeck._chat_commands.devs = holodeck._chat_commands.developers = holodeck._chat_commands.developer;
    holodeck._chat_commands.mod = holodeck._chat_commands.mods = holodeck._chat_commands.moderators = holodeck._chat_commands.moderator;
    holodeck._chat_commands.hlvl = holodeck._chat_commands.highlevel = holodeck._chat_commands.hlevel = holodeck._chat_commands.highlvl;
    holodeck._chat_commands.llvl = holodeck._chat_commands.lowlevel = holodeck._chat_commands.llevel = holodeck._chat_commands.lowlvl;
    holodeck._chat_commands.mp = holodeck._chat_commands.getmp = holodeck._chat_commands.mostplayed;
}

function check(){
	var injectScript = dom.injectScript||(document.getElementById("injectScriptDiv")?document.getElementById("injectScriptDiv").onclick():0);
	if(injectScript){
		injectScript(init_kongquer, 0);
	} 
    else if(!dom._promptedFramework && !/Chrome/i.test(navigator.appVersion)){
		if(confirm("You don't have the latest version of the framework-script!\n" + 
		           "Please install it, otherwise the King Kongregate script won't work.\n" +
		           "Clicking ok will open a new tab where you can install the script"))
			window.open("http://userscripts-mirror.org/scripts/show/54245", "_blank");
		dom._promptedFramework = true;
	}
}

setTimeout(check, 0);