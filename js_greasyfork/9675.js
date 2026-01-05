    /** Start, Helpers added by users.
     * Adds fetures, options to base script and can be easily removed if needed
     * Add description so anyone can see if they can use Function somewhere
     * Use "brackets" around function start and end //yourname
     */
//RottenMind, returns inventory space, use Inventory_bagspace(); gives current free bags slots, from MAC-NW function
    function Inventory_bagspace() {
        var _pbags = client.dataModel.model.ent.main.inventory.playerbags;
        var _bagUnused = 0;
        $.each(_pbags, function (bi, bag) {
            bag.slots.forEach(function (slot) {
                if (slot === null || !slot || slot === undefined) {
                    _bagUnused++;
                }
            });
        });
        return _bagUnused;
    }

    /** Count resouce in bags
     * edited by WloBeb
     * @param {string} name The name of resource
     */
    function countResource(name) {
        var count = 0;
        var _bags = unsafeWindow.client.dataModel.model.ent.main.inventory.bags;
        console.log("Checking bags for " + name);
        $.each(_bags, function (bi, bag) {
            bag.slots.forEach(function (slot) {
                if (slot && slot.name === name) {
                    count = count + slot.count;
                }
            });
        });
        return count;
    }
    /** Report error in GM for later  use
     * edited by RM
     *
     */
    function Epic_button_error() {
        var counter = GM_getValue('Epic_error', 0);
        // console.log('This script has been run ' + counter + ' times.');
        GM_setValue('Epic_error', ++counter);
        return counter;
    }
    function Array_undefine_error() {
        var counter = GM_getValue('Undefine_error', 0);
        // console.log('This script has been run ' + counter + ' times.');
        GM_setValue('Undefine_error', ++counter);
        return counter;
    }
// This just set Banker to character 1 if its not him all-ready
    function get_banker(){
        var me = GM_getValue("nw_charname0",0);
        var banker = GM_getValue("bankchar",0);
        //console.log(me, banker);
        if (me !== banker) {
            GM_setValue('bankchar', me);
            unsafeWindow.location.href = current_Gateway;
            return;
        }
    }
/**
 * Created by RM on 29.4.2015.
 * Runs daily SCA -rolls in GAteway Bot
 */
function dailySCA() {
    if (settings["dailySCA"]) {
        var char, today, thisday, thishour, dailyroll, dateforlastroll;
        char = settings["charcount"];
        today = new Date();
        thisday = today.getDate();
        thishour = today.getHours();
        dailyroll = GM_getValue("dailyswordcoast", 0);
        dateforlastroll = GM_getValue("dateforlastrolls", 0);
        //console.log(thisday, dateforlastroll, dailyroll, chardelay, thishour);
        if (thisday > dateforlastroll) {
            GM_setValue("dateforlastrolls", thisday);
            GM_setValue("dailyswordcoast", 0)
            dailyroll = 0;
        }
        if (dailyroll < (4 || undefined) && chardelay > 10000 * char && (thishour >= 14 || thishour >= 23)) {
            unsafeWindow.location.hash = unsafeWindow.location.hash.replace(/\)\/.+/, ')' + "/adventures");
            processSwordCoastDailies();
            dailyroll++;
            GM_setValue("dailyswordcoast", dailyroll);
            GM_getValue("dailyswordcoast", 0);
        }
    }
}

    /** End, Helpers added by users.*/