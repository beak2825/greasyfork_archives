// ==UserScript==
    // @name       Epic Erepublik - EPIC TOURNAMENT
    // @version    1.11
    // @description  Automated epic fighting. USE THIS SCRIPT ONLY WHEN YOU ARE AFK AND IN ONLY 1 WINDOW/TAB WITH EREPUBLIK LAUNCHED, OTHERWISE IT WILL EAT YOUR ENERGY BARS. WHEN NOT NEEDED TURN IT OFF IN GREASEMONKEY ETC
    // @include      http://*.erepublik.com/*
    // @require    http://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js
    // @copyright  MISI
// @namespace https://greasyfork.org/users/5470
// @downloadURL https://update.greasyfork.org/scripts/6048/Epic%20Erepublik%20-%20EPIC%20TOURNAMENT.user.js
// @updateURL https://update.greasyfork.org/scripts/6048/Epic%20Erepublik%20-%20EPIC%20TOURNAMENT.meta.js
    // ==/UserScript==
    jQuery(document).ready(function () {
       
    var main_type;
    var military_type;
    var url;
    var hp;
    var max_hp;
    var rec_hp;
    var i;
     
     
    function main() {
        main_type = location.href.split("/")[4];
        military_type = location.href.split("/")[5];
        hp = erepublik.citizen.energy;
        max_hp = reset_health_to_recover;
        rec_hp = parseInt($(".tooltip_health_limit").html());
        rw = document.referrer.split("/")[4];
        $(".icon_energy_booster").click();
       
        if (main_type == "military") {
            if (military_type == "campaigns") {
               
    ////////////////////////
    //EPIC TOURNAMENT CODE//
    ////////////////////////    
               
                if ($("img").hasClass("isEpicBattle")) {
                    //epic battle, go all in.
                    epic_url = "http://www.erepublik.com" + $(".isEpicBattle").siblings().eq(7).attr("href");
                    location.href = epic_url;
                    console.log("Epic battle on.");
                   
    /////////////
    //ENDS HERE//
    /////////////
                   
                } else {
                    //let's burn some well to not waste refills
                    url = "http://www.erepublik.com" + $(".fight_button").eq(0).attr("href");
                    console.log(url);
                    if (url == "http://www.erepublik.comundefined")
                    {
                        location.href = "http://www.erepublik.com/en/military/campaigns";
                        console.log("something is wrong");
                    }
                    else if (url != "http://www.erepublik.comundefined")
                    {
                        location.href = url;
                    }
                            }
               
            }
        }
        if (military_type == "battlefield" || military_type == "battlefield-new") {
            battleFX.pop = function (){} //disable popups during  fighting
            //battle page, let's fight
    ////////////////////////
    //EPIC TOURNAMENT CODE//
    ////////////////////////        
             function wait () {
                 if (isFirstRequest) { //wait for xhr to complete
                     if (aoeBattleData.epicBattle) {
                   
                   
                   
                        // change location code
                        console.log("battle is epic");
                        setTimeout(function() {
                            changeloc = $("#change_location");
                                            changeloc.click();
                            console.log("trying to move");
             
                            if (mov = $("#move"))
                                            {
                                                    mov.click();
                                    console.log("changed location");
                            }
                        }, 500);
                        ///change location code
                        //epic battle, go all in
                        console.log("Epic Battle, vreme za pew pew pew!");
                         
                         
                        ////////////////////////////////////////////////////////////////////////
                        // With this code, you can pick a default weapon to use when fighting.//
                        // To use it, uncomment the if's below.                               //
                        // WHEN USING NEW BATTLEFIELD                                         //
                        // Pick your weapon by modifying the "weapon" variable.               //
                        // weapon equals -1 by default, which means Q0 weapon or no weapon.   //
                        // 10 is bazooka, 7 is Q7 weapon.                                     //
                        // WHEN USING OLD BATTLEFIELD                                         //
                        // Just replace the 'Q0' with the quality you prefer.                 //
                        // Q0 is no weapon, Q10 is bazooka, Q7 is Q7 weapon                   //
                        //                                                                    //
                        // WARNING: OLD BATTLEFIELD CODE REQUIRES EREPUBLIK STUFF++ SCRIPT!   //
                        // New Battlefield //                                                 //
                        ////////////////////////////////////////////////////////////////////////
                        //Uncomment from here . . .  
                        //if (military_type == "battlefield-new")
                        //{
                        //      $('#weapon_btn').click();
                        //      weapon = -1; //Edit here for weapon
                                                //      setTimeout(function(){
                                        //              $("li[class='q" + weapon + "']").click();
                                                //      }, 2000);
                        //};
                        // Old Battlefield //
                        //if (military_type == "battlefield")
                        //{
                        //    $("span:contains('Q0')").click(); //Edit the Q0 value here
                        //}
                        // . . . to here.
                        ////////////////////////////////////////////////////////////////////////
                         
                        t = setInterval(function() {
                            if (SERVER_DATA.points.defender >= 1800 || SERVER_DATA.points.attacker >= 1800) {
                            //battle finished, back to home page
                                location.href = "http://www.erepublik.com/en";
                            }
                            if (erepublik.citizen.energy < 50) {
                                //regen energy
                                if ($("#DailyConsumtionTrigger").hasClass("energy")) {
                                //energy bars, ignore
                                    location.href = "http://www.erepublik.com/en";
                                } else {
                                //let's eat food
                                    $("#DailyConsumtionTrigger").click();
                                }
                            }
 
                            $('#fight_btn').click();
                            console.log("Udar v Epic Battle");
                        }, 900);
                    } else if (reset_health_to_recover - parseInt($(".tooltip_health_limit").html()) <= 350) { //health to max      
            /////////////
            //ENDS HERE//
            /////////////
                            console.log("not epic");
                       
                        ////////////////////////////////////////////////////////////////////////
                        // With this code, you can pick a default weapon to use when fighting.//
                        // To use it, uncomment the if's below.                               //
                        // WHEN USING NEW BATTLEFIELD                                         //
                        // Pick your weapon by modifying the "weapon" variable.               //
                        // weapon equals -1 by default, which means Q0 weapon or no weapon.   //
                        // 10 is bazooka, 7 is Q7 weapon.                                     //
                        // WHEN USING OLD BATTLEFIELD                                         //
                        // Just replace the 'Q0' with the quality you prefer.                 //
                        // Q0 is no weapon, Q10 is bazooka, Q7 is Q7 weapon                   //
                        //                                                                    //
                        // WARNING: OLD BATTLEFIELD CODE REQUIRES EREPUBLIK STUFF++ SCRIPT!   //
                        // New Battlefield //                                                 //
                        ////////////////////////////////////////////////////////////////////////
                        //Uncomment from here . . .  
                        //if (military_type == "battlefield-new")
                        //{
                        //      $('#weapon_btn').click();
                        //      weapon = -1; //Edit here for weapon
                                                //      setTimeout(function(){
                                        //              $("li[class='q" + weapon + "']").click();
                                                //      }, 2000);
                        //};
                        // Old Battlefield //
                        //if (military_type == "battlefield")
                        //{
                        //    $("span:contains('Q0')").click(); //Edit the Q0 value here
                        //}
                        // . . . to here.
                        ////////////////////////////////////////////////////////////////////////
                       
                            setTimeout(function() {
                                    if (SERVER_DATA.points.defender >= 1800 || SERVER_DATA.points.attacker >= 1800) {
                                //battle finished, let's find another one
                                    location.href = "http://www.erepublik.com/en/military/campaigns";
                                    }
                                    i = 1;
                               
                                    t = setInterval(function() {
                                    if (erepublik.citizen.energy < 10) {
                                            location.href = "http://www.erepublik.com/en";
                                    }
                                    $('#fight_btn').click();
                                    console.log("hit");
                                    i++;
                                    if (i == 10) { //beshe 2
                                            setTimeout(function() {
                                            location.href = "http://www.erepublik.com/en";
                                            }, 1200);
                                    }
                                    }, 900);
                            }, 1000);
                        }
            ///////////////////////////////////////////////
            //THIS ELSE IS TO BE REMOVED AFTER TOURNAMENT//
            ///////////////////////////////////////////////            
                        else {
                             setTimeout(function() {
                                 console.log("back to main page");
                                    location.href = "http://www.erepublik.com/en";
                             }, 5000);
                        }
               
            } else {
               setTimeout(wait, 200);
            };
           
          }    
          wait();      
        }
       
        else if (main_type == "wars")
        {
            //join defenders if it is your citizenship country
            if (erepublik.citizen.country == 64 && (jQuery(".reversed:contains(Chile)").length > 0)) //To set your country, change "64" to your country's ID, and the "contains(Chile)" to "contains(COUNTRYNAME)
            {
                var addressValue = $(".reversed").attr("href");
                location.href = addressValue;
            }
            //join resistance by default
            else
            {
                var addressValue = $(".join").attr("href");
                location.href = addressValue;
            }
        } else {
            // we are on main page
            if (reset_health_to_recover - erepublik.citizen.energy >= 10 && parseInt($(".tooltip_health_limit").html()) >= 10) {
                if ($("#DailyConsumtionTrigger").hasClass("energy")) {
                    //energy bars, ignore
                } else {
                    //let's eat food
                    $("#DailyConsumtionTrigger").click();
                }
            }
    ///////////////////////////////////////////////
    //EDIT HERE TO CHANGE HEALTH TO HEALTH LIMIT//
    //THIS IS WHEN THE SCRIPT WILL FIGHT TO AVOID//
    //WASTING REFILLS. EDIT THE "600" VALUE      //
    ///////////////////////////////////////////////
           
    ////////////////////////
    //EPIC TOURNAMENT CODE//
    ////////////////////////        
            setTimeout(function() {
    //OLD CODE///////////////////////////////////////////////////////////////////////////////////////////////////////////
    //USE AFTER TOURNAMENT///////////////////////////////////////////////////////////////////////////////////////////////
    //            if (reset_health_to_recover - parseInt($(".tooltip_health_limit").html()) <= 500) { //beshe 200 /600///
    //                              //let's burn some well to not waste refills//////////////////////////////////////////////////////////        
    ///////////////////////////////////////////////
     //HERE YOU CAN SET A BATTLE WHERE THE SCRIPT//
    //WILL AUTOMATICALLY FIGHT WHEN YOU ARE ABOUT//
    //TO WASTE REFILL                            //
    //EDIT THE "erepublik bla bla/campaigns" LINE//
    ///////////////////////////////////////////////
           
                    location.href = "http://www.erepublik.com/en/military/campaigns"; //beshe CAMPAIGNS
    ////////////////////////
    //EPIC TOURNAMENT CODE//
    ////////////////////////
    //OLD CODE///////////////////////////////////////////////////////////////////////////////////////////////////////////
    //USE AFTER TOURNAMENT///////////////////////////////////////////////////////////////////////////////////////////////        
    //              } else {                                                                                               //
    //                //nothing to do, just refresh and relax                                                          //  
    //                location.href = "http://www.erepublik.com/en";                                                   //
    //            }                                                                                                    //
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////        
            }, 360000);
        }
    }
     
    function wait() {
        if ( unsafeWindow.jQuery === 'undefined') {
            setTimeout(wait, 100);
        } else {
            $ = unsafeWindow.jQuery;
            main();
        }
    }
    wait();
     
     
    });
    /////////////////////////////////////////////////////////////
    //CODE BELOW COLLECTS ALL ENERGY INCREASE ("TIMER") REWARDS//
    /////////////////////////////////////////////////////////////
     
     
    ////////////////////////////////////////////////
    //LEGACY CODE. PRESERVED IN CASE IT IS NEEDED///
    ////////////////////////////////////////////////
     
    /*function wait() {
      if (typeof unsafeWindow.jQuery == 'undefined') {
        setTimeout(wait, 100);
      } else {
        $ = unsafeWindow.jQuery;
        main();
      }
    }
    wait();
     
     
    function main() {
            main_type = location.href.split("/")[4];
            military_type = location.href.split("/")[5];
            hp = erepublik.citizen.energy;
            max_hp = reset_health_to_recover;
            rec_hp = parseInt($(".tooltip_health_limit").html());
           
            if (main_type == "military") {
                    //not main page
                    if (military_type == "campaigns") {
                            //battles list, check for epic battle
                                    //no epic battle
                                    if (reset_health_to_recover - erepublik.citizen.energy >= 10) {
                                            //let's burn some well to not waste refills
                                            url = "http://www.erepublik.com" + $(".fight_button[href*=military]").eq(0).attr("href");
                                            location.href = "http://www.erepublik.com/en/wars/show/40092";
                                    } else {
                                            //nothing to do, go back to main page
                                            location.href = "http://www.erepublik.com/en";
                                    }
                    }
         else if (military_type == "battlefield") {
                            //battle page, let's fight
                            setTimeout(function() {
                                    if (SERVER_DATA.points.defender >= 1800 || SERVER_DATA.points.attacker >= 1800) {
                                            //battle finished
                                            location.href = "http://www.erepublik.com/en";
                                    }
                                            //epic battle, go all in
                                            t = setInterval(function() {
                                                    if (erepublik.citizen.energy < 10) {
                                                            //regen energy
                                                            if ($("#DailyConsumtionTrigger").hasClass("energy")) {
                                                                    //energy bars, ignore
                                                                    location.href = "http://www.erepublik.com/en";
                                                            } else {
                                                                    //let's eat food
                                                                    $("#DailyConsumtionTrigger").click();
                                                            }
                                                    }
                                                    $('#fight_btn').click();
                                            }, 3000);
                            }, 3000);
                    }
            }
        else if (main_type == "wars")
            {
                //join resistance by default
                    var addressValue = $(".join").attr("href");
                    location.href = addressValue;
            } else {
                    // we are on main page
                    if (reset_health_to_recover - erepublik.citizen.energy >= 10 && parseInt($(".tooltip_health_limit").html()) >= 10) {
                            if ($("#DailyConsumtionTrigger").hasClass("energy")) {
                                    //energy bars, ignore
                            } else {
                                    //let's eat food
                                    $("#DailyConsumtionTrigger").click();
                            }
                    }
                    setTimeout(function() {
                            location.href = "http://www.erepublik.com/en/military/campaigns";
                    }, 300000);
            }
    }*/