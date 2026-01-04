// ==UserScript==
// @name         CheatNite Enhanced
// @namespace    CheatNite.discord
// @icon         https://i.imgur.com/1ptl65c.png
// @version      1.5.7
// @description  enhanced CraftNite cheat client.
// @author       towelgreen, (and kᵏ a little)
// @match        https://craftnite.io/*
// @run-at       document-start
// @license      GPL-3.0
// @grant        GM_addStyle
// @require https://greasyfork.org/scripts/475779-readschem/code/readschem.js?version=1253860
// @downloadURL https://update.greasyfork.org/scripts/554032/CheatNite%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/554032/CheatNite%20Enhanced.meta.js
// ==/UserScript==


//constants
const yoClasses = ['RPCMatchRemainingTime', 'RPCa822erScore', 'CMDChunkBuffered', 'a201', 'a202', 'a199', 'a200', 'a169', 'a130', 'a119', 'a129', 'a128', 'a186', 'a222ingSoon', 'a124', 'a125', 'a126', 'RPCEndMatch', 'a188', 'a236', 'a189', 'a190', 'a191', 'a192', 'a193', 'a175', 'a194', 'a234', 'a171', 'a121', 'a172', 'a173', 'a174', 'a195', 'a180', 'a225', 'a226', 'a227', 'a228', 'a117', 'a118', 'a222']
const blocks = {"items":"items","random": "random", "air":0,"stone":256,"stone1":257,"stone2":258,"stone3":259,"stone4":260,"stone5":261,"stone6":262,"grass":512,"dirt":768,"dirt1":769,"dirt2":770,"cobblestone":1024,"planks":1280,"planks1":1281,"planks2":1282,"planks3":1283,"planks4":1284,"planks5":1285,"sapling":1536,"sapling1":1537,"sapling2":1538,"sapling3":1539,"sapling4":1540,"sapling5":1541,"bedrock":1792,"flowing_water":2048,"water":2304,"flowing_lava":2560,"lava":2816,"sand":3072,"sand1":3073,"gravel":3328,"gold_ore":3584,"iron_ore":3840,"coal_ore":4096,"log":4352,"log1":4353,"log2":4354,"log3":4355,"leaves":4608,"leaves1":4609,"leaves2":4610,"leaves3":4611,"sponge":4864,"sponge1":4865,"glass":5120,"lapis_ore":5376,"lapis_block":5632,"dispenser":5888,"sandstone":6144,"sandstone1":6145,"sandstone2":6146,"noteblock":6400,"bed":6656,"golden_rail":6912,"detector_rail":7168,"sticky_piston":7424,"web":7680,"tallgrass":7936,"tallgrass1":7937,"tallgrass2":7938,"deadbush":8192,"piston":8448,"piston_head":8704,"wool":8960,"wool1":8961,"wool2":8962,"wool3":8963,"wool4":8964,"wool5":8965,"wool6":8966,"wool7":8967,"wool8":8968,"wool9":8969,"wool10":8970,"wool11":8971,"wool12":8972,"wool13":8973,"wool14":8974,"wool15":8975,"piston_extension":9216,"yellow_flower":9472,"red_flower":9728,"red_flower1":9729,"red_flower2":9730,"red_flower3":9731,"red_flower4":9732,"red_flower5":9733,"red_flower6":9734,"red_flower7":9735,"red_flower8":9736,"brown_mushroom":9984,"red_mushroom":10240,"gold_block":10496,"iron_block":10752,"double_stone_slab":11008,"double_stone_slab1":11009,"double_stone_slab2":11010,"double_stone_slab3":11011,"double_stone_slab4":11012,"double_stone_slab5":11013,"double_stone_slab6":11014,"double_stone_slab7":11015,"double_stone_slab8":11016,"double_stone_slab9":11017,"double_stone_slab10":11023,"stone_slab":11264,"stone_slab1":11265,"stone_slab2":11266,"stone_slab3":11267,"stone_slab4":11268,"stone_slab5":11269,"stone_slab6":11270,"stone_slab7":11271,"stone_slab8":11272,"stone_slab9":11273,"stone_slab10":11274,"stone_slab11":11275,"stone_slab12":11276,"stone_slab13":11277,"stone_slab14":11278,"stone_slab15":11279,"brick_block":11520,"tnt":11776,"tnt1":11777,"bookshelf":12032,"mossy_cobblestone":12288,"obsidian":12544,"torch":12800,"torch1":12801,"torch2":12802,"torch3":12803,"torch4":12804,"fire":13056,"mob_spawner":13312,"oak_stairs":13568,"chest":13824,"redstone_wire":14080,"diamond_ore":14336,"diamond_block":14592,"crafting_table":14848,"wheat":15104,"farmland":15360,"furnace":15616,"lit_furnace":15872,"standing_sign":16128,"wooden_door":16384,"ladder":16640,"rail":16896,"stone_stairs":17152,"wall_sign":17408,"lever":17664,"stone_pressure_plate":17920,"iron_door":18176,"wooden_pressure_plate":18432,"redstone_ore":18688,"lit_redstone_ore":18944,"unlit_redstone_torch":19200,"unlit_redstone_torch1":19201,"unlit_redstone_torch2":19202,"unlit_redstone_torch3":19203,"unlit_redstone_torch4":19204,"redstone_torch":19456,"redstone_torch1":19457,"redstone_torch2":19458,"redstone_torch3":19459,"redstone_torch4":19460,"stone_button":19712,"snow_layer":19968,"ice":20224,"snow":20480,"cactus":20736,"clay":20992,"reeds":21248,"jukebox":21504,"jukebox1":21505,"fence":21760,"pumpkin":22016,"netherrack":22272,"soul_sand":22528,"glowstone":22784,"portal":23040,"lit_pumpkin":23296,"cake":23552,"unpowered_repeater":23808,"powered_repeater":24064,"stained_glass":24320,"stained_glass1":24321,"stained_glass2":24322,"stained_glass3":24323,"stained_glass4":24324,"stained_glass5":24325,"stained_glass6":24326,"stained_glass7":24327,"stained_glass8":24328,"stained_glass9":24329,"stained_glass10":24330,"stained_glass11":24331,"stained_glass12":24332,"stained_glass13":24333,"stained_glass14":24334,"stained_glass15":24335,"trapdoor":24576,"monster_egg":24832,"monster_egg1":24833,"monster_egg2":24834,"monster_egg3":24835,"monster_egg4":24836,"monster_egg5":24837,"stonebrick":25088,"stonebrick1":25089,"stonebrick2":25090,"stonebrick3":25091,"brown_mushroom_block":25344,"red_mushroom_block":25600,"iron_bars":25856,"glass_pane":26112,"melon_block":26368,"pumpkin_stem":26624,"melon_stem":26880,"vine":27136,"fence_gate":27392,"brick_stairs":27648,"stone_brick_stairs":27904,"mycelium":28160,"waterlily":28416,"nether_brick":28672,"nether_brick_fence":28928,"nether_brick_stairs":29184,"nether_wart":29440,"enchanting_table":29696,"brewing_stand":29952,"cauldron":30208,"end_portal":30464,"end_portal_frame":30720,"end_stone":30976,"dragon_egg":31232,"redstone_lamp":31488,"lit_redstone_lamp":31744,"double_wooden_slab":32000,"double_wooden_slab1":32001,"double_wooden_slab2":32002,"double_wooden_slab3":32003,"double_wooden_slab4":32004,"double_wooden_slab5":32005,"wooden_slab":32256,"wooden_slab1":32257,"wooden_slab2":32258,"wooden_slab3":32259,"wooden_slab4":32260,"wooden_slab5":32261,"cocoa":32512,"sandstone_stairs":32768,"emerald_ore":33024,"ender_chest":33280,"tripwire_hook":33536,"tripwire":33792,"emerald_block":34048,"spruce_stairs":34304,"birch_stairs":34560,"jungle_stairs":34816,"command_block":35072,"beacon":35328,"cobblestone_wall":35584,"cobblestone_wall1":35585,"flower_pot":35840,"carrots":36096,"potatoes":36352,"wooden_button":36608,"skull":36864,"anvil":37120,"trapped_chest":37376,"light_weighted_pressure_plate":37632,"heavy_weighted_pressure_plate":37888,"unpowered_comparator":38144,"powered_comparator":38400,"daylight_detector":38656,"redstone_block":38912,"quartz_ore":39168,"hopper":39424,"quartz_block":39680,"quartz_block1":39681,"quartz_block2":39682,"quartz_stairs":39936,"activator_rail":40192,"dropper":40448,"stained_hardened_clay":40704,"stained_hardened_clay1":40705,"stained_hardened_clay2":40706,"stained_hardened_clay3":40707,"stained_hardened_clay4":40708,"stained_hardened_clay5":40709,"stained_hardened_clay6":40710,"stained_hardened_clay7":40711,"stained_hardened_clay8":40712,"stained_hardened_clay9":40713,"stained_hardened_clay10":40714,"stained_hardened_clay11":40715,"stained_hardened_clay12":40716,"stained_hardened_clay13":40717,"stained_hardened_clay14":40718,"stained_hardened_clay15":40719,"stained_glass_pane":40960,"stained_glass_pane1":40961,"stained_glass_pane2":40962,"stained_glass_pane3":40963,"stained_glass_pane4":40964,"stained_glass_pane5":40965,"stained_glass_pane6":40966,"stained_glass_pane7":40967,"stained_glass_pane8":40968,"stained_glass_pane9":40969,"stained_glass_pane10":40970,"stained_glass_pane11":40971,"stained_glass_pane12":40972,"stained_glass_pane13":40973,"stained_glass_pane14":40974,"stained_glass_pane15":40975,"leaves2":41216,"leaves21":41217,"log2":41472,"log21":41473,"acacia_stairs":41728,"dark_oak_stairs":41984,"slime":42240,"barrier":42496,"iron_trapdoor":42752,"prismarine":43008,"prismarine1":43009,"prismarine2":43010,"sea_lantern":43264,"hay_block":43520,"carpet":43776,"carpet1":43777,"carpet2":43778,"carpet3":43779,"carpet4":43780,"carpet5":43781,"carpet6":43782,"carpet7":43783,"carpet8":43784,"carpet9":43785,"carpet10":43786,"carpet11":43787,"carpet12":43788,"carpet13":43789,"carpet14":43790,"carpet15":43791,"hardened_clay":44032,"coal_block":44288,"packed_ice":44544,"double_plant":44800,"double_plant1":44801,"double_plant2":44802,"double_plant3":44803,"double_plant4":44804,"double_plant5":44805,"standing_banner":45056,"wall_banner":45312,"daylight_detector_inverted":45568,"red_sandstone":45824,"red_sandstone1":45825,"red_sandstone2":45826,"red_sandstone_stairs":46080,"double_stone_slab2":46336,"double_stone_slab21":46344,"stone_slab2":46592,"stone_slab21":46600,"spruce_fence_gate":46848,"birch_fence_gate":47104,"jungle_fence_gate":47360,"dark_oak_fence_gate":47616,"acacia_fence_gate":47872,"spruce_fence":48128,"birch_fence":48384,"jungle_fence":48640,"dark_oak_fence":48896,"acacia_fence":49152,"spruce_door":49408,"birch_door":49664,"jungle_door":49920,"acacia_door":50176,"dark_oak_door":50432,"end_rod":50688,"chorus_plant":50944,"chorus_flower":51200,"purpur_block":51456,"purpur_pillar":51712,"purpur_stairs":51968,"purpur_double_slab":52224,"purpur_slab":52480,"end_bricks":52736,"beetroots":52992,"grass_path":53248,"end_gateway":53504,"repeating_command_block":53760,"chain_command_block":54016,"frosted_ice":54272,"magma":54528,"nether_wart_block":54784,"red_nether_brick":55040,"bone_block":55296,"item":55781,"item1":55782,"item2":55783,"item3":55784,"item4":55785,"item5":55786,"item6":55787,"item7":55788,"item8":55789,"item9":55790,"item10":55791,"item11":55792,"item12":55793,"item13":55794,"item14":55795,"item15":55796,"item16":55797,"item17":55798,"item18":55799,"item19":55800,"item20":55801,"item21":55802,"item22":55803,"item23":55804,"item24":55805,"item25":55806,"item26":55807,"observer":55808,"white_shulker_box":56064,"orange_shulker_box":56320,"magenta_shulker_box":56576,"light_blue_shulker_box":56832,"yellow_shulker_box":57088,"lime_shulker_box":57344,"pink_shulker_box":57600,"gray_shulker_box":57856,"light_gray_shulker_box":58112,"cyan_shulker_box":58368,"purple_shulker_box":58624,"blue_shulker_box":58880,"brown_shulker_box":59136,"green_shulker_box":59392,"red_shulker_box":59648,"black_shulker_box":59904,"white_glazed_terracotta":60160,"orange_glazed_terracotta":60416,"magenta_glazed_terracotta":60672,"light_blue_glazed_terracotta":60928,"yellow_glazed_terracotta":61184,"lime_glazed_terracotta":61440,"pink_glazed_terracotta":61696,"gray_glazed_terracotta":61952,"light_gray_glazed_terracotta":62208,"cyan_glazed_terracotta":62464,"purple_glazed_terracotta":62720,"blue_glazed_terracotta":62976,"brown_glazed_terracotta":63232,"green_glazed_terracotta":63488,"red_glazed_terracotta":63744,"black_glazed_terracotta":64000,"concrete":64256,"concrete1":64257,"concrete2":64258,"concrete3":64259,"concrete4":64260,"concrete5":64261,"concrete6":64262,"concrete7":64263,"concrete8":64264,"concrete9":64265,"concrete10":64266,"concrete11":64267,"concrete12":64268,"concrete13":64269,"concrete14":64270,"concrete15":64271,"concrete_powder":64512,"concrete_powder1":64513,"concrete_powder2":64514,"concrete_powder3":64515,"concrete_powder4":64516,"concrete_powder5":64517,"concrete_powder6":64518,"concrete_powder7":64519,"concrete_powder8":64520,"concrete_powder9":64521,"concrete_powder10":64522,"concrete_powder11":64523,"concrete_powder12":64524,"concrete_powder13":64525,"concrete_powder14":64527,"structure_block":65280}
//const itemblocks = {"item": 55781, "item1": 55782, "item2": 55783, "item3": 55784, "item4": 55785, "item5": 55786, "item6": 55787, "item7": 55788, "item8": 55789, "item9": 55790, "item10": 55791, "item11": 55792, "item12": 55793, "item13": 55794, "item14": 55795, "item15": 55796, "item16": 55797, "item17": 55798, "item18": 55799, "item19": 55800, "item20": 55801, "item21": 55802, "item22": 55803, "item23": 55804, "item24": 55805}
const itemblocks = {"item1": 55782, "item4": 55785, "item5": 55786, "item7": 55788, "item8": 55789, "item9": 55790, "item10": 55791, "item11": 55792, "item12": 55793, "item13": 55794, "item14": 55795, "item15": 55796, "item16": 55797, "item17": 55798, "item18": 55799, "item19": 55800, "item20": 55801, "item21": 55802, "item22": 55803, "item23": 55804, "item24": 55805}
const printblocks = {53248:"#5C473B",4864:"#B7963A",4355:"#AA806A",41472:"#995940",4353:"#6F4D4F",4352:"#91754A",4096:"#605B56",3840:"#746259",3584:"#8D6D44",3328:"#67635D",3073:"#AF756A",3072:"#C09B6D",2816:"#8A1315",1792:"#535259",1285:"#67473B",1284:"#9A5945",1283:"#BB896F",1282:"#C0AB7E",1281:"#694B53",1280:"#967750",1024:"#69655F",770:"#8D5D38",769:"#544436",768:"#554239",512:"#41672F",262:"#6C685F",261:"#66635A",260:"#B2AD9B",259:"#9E998C",258:"#8E725A",257:"#856554",256:"#898985",4865:"#887F39",5376:"#646274",5632:"#494CAD",5888:"#757068",6144:"#BA9368",6400:"#8B674C",7424:"#706643",8448:"#7A6249",8960:"#C2B6A6",8961:"#E2A35B",8962:"#D2666B",8963:"#5EB3C3",8964:"#E2CB5B",8965:"#94D25B",8966:"#CB87E9",8967:"#7D756C",8968:"#A79C8A",8969:"#5BBDA6",8970:"#AA73DB",8971:"#3D60C2",8972:"#724730",8973:"#2F9543",8974:"#AF3C39",8975:"#443A3A",12544:"#31263A",12288:"#4E6543",12032:"#876950",11777:"#A54433",11520:"#884E3D",11279:"#E7DFCD",11278:"#5B2938",11277:"#6C6962",11276:"#884E3D",11275:"#69655F",11274:"#967750",11273:"#BA9368",11272:"#757068",11271:"#E7DFCD",11270:"#5B2938",11269:"#6C6962",11268:"#884E3D",11267:"#69655F",46592:"#A86E66",11265:"#BA9368",11264:"#757068",11023:"#E7DDCC",11017:"#BA9368",11016:"#757068",11015:"#E7DFCD",11014:"#5B2938",11013:"#6C6962",11012:"#884E3D",11011:"#69655F",46336:"#A86E66",11009:"#BA9368",11008:"#898985",10752:"#DCD0CA",10496:"#EED442",14336:"#748482",14592:"#8FB6B9",14848:"#927450",15360:"#533F36",15616:"#747269",15872:"#747269",16384:"#866B4C",17152:"#67635D",18176:"#514A45",18688:"#735E56",19968:"#E7F3F1",20480:"#E7F3F1",20992:"#83665D",21504:"#4A3F35",22016:"#C35C2B",22272:"#63201B",22528:"#453E37",22784:"#AE9880",28672:"#5B2938",28160:"#57666A",27904:"#67635D",27648:"#67635D",26368:"#46611F",25600:"#93181D",25344:"#8A5B3B",25091:"#747269",25090:"#68645E",25089:"#4E6543",25088:"#6C6962",23296:"#C35C2B",29184:"#67635D",30976:"#90A895",31232:"#141212",32000:"#967750",32001:"#694B53",32002:"#C0AB7E",32003:"#BB896F",32004:"#9A5945",32005:"#67473B",32256:"#967750",32257:"#694B53",32258:"#C0AB7E",32259:"#BB896F",32260:"#9A5945",32261:"#67473B",32768:"#C09B6D",33024:"#858978",34048:"#0A7E38",34304:"#67635D",35072:"#A47F6C",35584:"#69655F",35585:"#576449",41473:"#995940",40719:"#3D3434",40718:"#A83636",40717:"#288C45",40716:"#6D402E",40715:"#3C52BC",40714:"#9969D2",40713:"#56B4A0",40712:"#BDB0A0",40711:"#716962",40710:"#AC9ECB",40709:"#86C954",40708:"#DDBF57",40707:"#58A7B9",40706:"#CA606B",40705:"#DD9757",40704:"#BDB0A0",40448:"#857F75",39936:"#E7DFCD",39681:"#D8CEBE",39680:"#E7DFCD",39168:"#672F29",38912:"#8F2C21",38144:"#8C7F74",41728:"#9A5945",41984:"#967750",43008:"#3B4244",43009:"#2D3233",43010:"#2E3435",43264:"#566B65",43520:"#D59B33",44032:"#A37456",44288:"#211F1F",44544:"#C1B1E4",45824:"#A86E66",55794:"#8647CD",55793:"#D18745",55792:"#979797",55791:"#4DAF4A",55790:"#0685D6",55789:"#8748D6",55788:"#D68B47",55787:"#A7A59F",55786:"#9B9B9B",55785:"#9B9790",55784:"#AAAAAA",55783:"#9A938E",55782:"#EC8642",55781:"#1DA6FE",55296:"#D0C3AE",55040:"#46332A",54784:"#5A1B18",54528:"#7C2B1D",54016:"#7F978D",52736:"#827060",51968:"#67635D",51712:"#3A3532",50432:"#2C2724",49920:"#866B4C",49664:"#866B4C",49408:"#866B4C",55795:"#0B81CD",55796:"#4BA844",55797:"#959291",55798:"#E1914B",55799:"#904DDC",55800:"#0A8CDC",55801:"#50B549",55802:"#A19E9C",55803:"#E79B55",55804:"#9556E8",55805:"#0F96E8",55806:"#5BC058",55807:"#898985",55808:"#797165",56064:"#857B6C",56320:"#754F2B",56576:"#443629",56832:"#656F71",57344:"#61692E",57600:"#7E684E",58368:"#636A3E",58624:"#34302E",58880:"#4D433D",59136:"#4D3E2E",59392:"#26341A",59648:"#742B23",59904:"#2B2521",60160:"#B2ADA7",60416:"#9F5530",60672:"#BD7892",60928:"#78A5B2",61184:"#D2B56A",61440:"#A3AD40",61696:"#E1A7A4",61952:"#5C5B56",62464:"#44716C",62720:"#644C6F",62976:"#254C5A",63232:"#413026",63488:"#6F8341",63744:"#663B30",64000:"#31201E",64527:"#1E1B1A",64525:"#913A37",64524:"#4E6339",64523:"#5D4839",64522:"#354D6D",64521:"#466765",64520:"#7A7167",64519:"#706B62",64518:"#AE7B91",64517:"#3E6830",64516:"#C09337",64515:"#416374",64514:"#744157",64513:"#C57733",64512:"#B7AFA0",64271:"#433939",64270:"#AF3B37",64269:"#2F9443",64268:"#724630",64267:"#3D5EC1",64266:"#A772D9",64265:"#5ABCA4",64264:"#A59A89",64263:"#7B736A",64262:"#C986E8",64261:"#93D15A",64260:"#E1C95A",64259:"#5DB1C1",64258:"#D1656B",64257:"#E1A15A",64256:"#C1B5A5"};
const blockStrings = Object.keys(blocks).slice(1);
let blockCommands = ['item', 'set', 'box', 'replace', 'sphere', 'hsphere'];
let commands = ['truecoords', 'ignore', 'unignore', 'unstuck', 'drain', 'item', 'invsize', 'tp', 'time', 'bg', '1', '2', 'pos1', 'pos2', 'stop', 'positions', 'set', 'box', 'replace', 'sphere', 'hsphere', 'copy', 'paste', 'clearclipboard', 'load', 'save', 'b', 'builds', 'new'];

let espGeometry, lineMaterial, red, espMaterial, textCanvas;

//add global
function addGlobal(name, value) {
    var script = document.createElement('script');
    script.textContent = `window.${name} = ${value};`;
    (document.head||document.documentElement).appendChild(script);
    script.remove();
}

function start() {
    addGlobal('cheatnite', '{}');

    cheatnite.auto = true;
    cheatnite.coords = [0,0,0];
    cheatnite.worldedit = {
        clipboard: [null, null, {}],
        builds: {}
    };
    cheatnite.ignored = [];
    cheatnite.customBlockId = 256;
    cheatnite.server = {};

    cheatnite.fly = false;
    cheatnite.chatspam = null;
    cheatnite.chatspam_count = 0;
    cheatnite.bulletspam = null;
    cheatnite.tntspam = null;
    cheatnite.bedrock = false;
    cheatnite.drain = false;
    cheatnite.esp = true;
    cheatnite.noclip = false;
    cheatnite.invisible = false;
    cheatnite.darkMode = false;

    cheatnite.shiftKeyPressed = false;

    document.getElementById("leftwrap").innerHTML = "";

    // Cheat display configuration (inspired by some hacked client code)
    cheatnite.cheatDisp = document.createElement("h1");
    cheatnite.cheatDisp.style.position = "fixed";
    cheatnite.cheatDisp.style.fontSize = "156.25%";
    cheatnite.cheatDisp.style.right = 0;
    cheatnite.cheatDisp.style.marginRight = "10px";
    cheatnite.cheatDisp.style.backgroundColor = "rgba(0, 0, 0, 0)";
    cheatnite.cheatDisp.style.textAlign = "right";
    cheatnite.cheatDisp.style.fontFamily = "'Lucida Console', Monaco, monospace";
    cheatnite.cheatDisp.style.fontWeight = "bold";
    document.body.appendChild(cheatnite.cheatDisp);

    cheatnite.activatedCheats = ['ESP'];
    cheatnite.updateCheatDisp = true;

    // If necessary, allow a brief delay for GAME to be fully set up before applying the texture
}
window.addEventListener('load', start);

/*
CUSTOM STYLES
*/
GM_addStyle(`
    input#customServer {
        height: 63px;
        width: 100%;
        text-align: center;
        font-size: 22px;
        font-family: Madera;
        color: #000 !important;
        border: 0px solid #000000;
        background: #ffffff;
        border-radius: 2px;
    }
`);

/*
CUSTOM SERVER
*/
function addInputAbovePlayButton() {
    // Find the play button element
    const playBtn = document.getElementById('playbtn');

    // Create a new input element
    const customServer = document.createElement('input');
    customServer.id = 'customServer';
    customServer.type = 'text';
    customServer.placeholder = 'Random server';
    customServer.value = localStorage.getItem('lastServer') ? localStorage.getItem('lastServer') : '';

    // Insert the new input element before the play button element
//    playBtn.parentNode.insertBefore(customServer, playBtn);

    // Add a line break before the custom input
    const lineBreak = document.createElement('br');
    customServer.parentNode.insertBefore(lineBreak, customServer);
}

// Wait for the page to load and then execute the function
window.addEventListener('load', addInputAbovePlayButton);

function addCustomServerInputAndTexturePackSelector() {
    // Find necessary elements
    var playBtn = document.getElementById('playbtn');
    var rightwrap = document.getElementById("rightwrap");

    // Check if elements exist and play button is not disabled
    if (playBtn && !playBtn.disabled) {
        // Hide the element to the right
        if (rightwrap) {
            rightwrap.style.display = "none";
        }

        // Create and insert the custom server input
        var customServerInput = document.createElement('input');
        customServerInput.id = 'customServer';
        customServerInput.type = 'text';
        customServerInput.placeholder = 'Random server';
        customServerInput.value = localStorage.getItem('lastServer') || '';
        playBtn.parentNode.insertBefore(customServerInput, playBtn);

        // Apply styles to the custom server input
        applyCustomStyles(customServerInput);
        // Create a line break for spacing
        var lineBreak1 = document.createElement('br');
        customServerInput.parentNode.insertBefore(lineBreak1, customServerInput);
        // Create the texture pack selector (dropdown)
        var texturePackSelector = document.createElement('select');
        texturePackSelector.id = 'texturePackSelector';
        // Create default option
        var defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Select Texture Pack';
        texturePackSelector.appendChild(defaultOption);
        // Array of texture pack options
        var texturePacks = [
            { name: 'Default', src: 'https://craftnite.io/world-texture/chilvary.png' },
            { name: 'Matrix', src: 'https://i.imgur.com/RSUidhY.png' },
            { name: 'Minecraft', src: 'https://i.imgur.com/lfEUSyS.png' },
            { name: 'Lucky BLock', src: 'https://i.imgur.com/blTbuwg.png' },
            { name: '???', src: 'https://i.imgur.com/CUaGjTa.png' },
            { name: 'Retro', src: 'https://i.imgur.com/HL7o34O.png' },
            { name: 'LowRes', src: 'https://i.imgur.com/tZX6C08.png' },
            { name: 'Solid', src: 'https://i.imgur.com/SFWvYz2.png' },
            { name: 'Addiction', src: 'https://i.imgur.com/ZCNGAKr.png' },
            { name: 'Dopamine', src: 'https://i.imgur.com/RRc6LVd.png' },
            { name: 'Glamorous', src: 'https://i.imgur.com/EwhelXN.png' },
            { name: 'Superfuture', src: 'https://i.imgur.com/KnXcQ0W.png' },
            { name: 'Cyber', src: 'https://i.imgur.com/LSFElxj.png' },
            { name: 'Smoother', src: 'https://i.imgur.com/oPPjpsd.png' },
            { name: 'Narcotics', src: 'https://i.imgur.com/yVxXg3K.png' },
            { name: 'Corruption', src: 'https://i.imgur.com/9jDXbfW.png' },
            { name: 'Corruption Nuevo', src: 'https://i.imgur.com/VZrr1n7.png' },
            { name: 'Retro 2', src: 'https://i.imgur.com/sBUzJji.png' },
            { name: 'Brutal Dither', src: 'https://i.imgur.com/DyfQAVR.png' },
            { name: 'BloodBath', src: 'https://i.imgur.com/W4dYooc.png' },
            { name: 'Shuffle', src: 'https://i.imgur.com/ri5cmAa.png' },
            { name: 'Wonderland', src: 'https://i.imgur.com/Z5ykCQF.png' },
            { name: 'Snow Time', src: 'https://i.imgur.com/XtgYgBg.png' },

            // Add more texture packs as needed
        ];
        // Populate the dropdown with texture pack options
        texturePacks.forEach(function(pack) {
            var option = document.createElement('option');
            option.value = pack.src;
            option.textContent = pack.name;
            texturePackSelector.appendChild(option);
        });
        // Insert the texture pack selector above the custom server input
        customServerInput.parentNode.insertBefore(texturePackSelector, lineBreak1);
        // Apply styles to the texture pack selector
        applyCustomStyles(texturePackSelector);
        // Event listener for texture pack selection
        texturePackSelector.addEventListener('change', function() {
            var selectedTexturePack = texturePackSelector.value;
            if (selectedTexturePack) {
                selectTexturePack(selectedTexturePack);
            }
        });
        // Function to handle texture pack selection
        function selectTexturePack(src) {
            localStorage.setItem('selectedTexturePack', src);
            // Handle the texture pack loading as needed
            console.log(`Selected Texture Pack: ${src}`);
        }
    }

    // Function to apply custom styles
    function applyCustomStyles(element) {
        element.style.height = "63px";
        element.style.width = "100%";
        element.style.textAlign = "center";
        element.style.fontSize = "15px";
        element.style.fontFamily = "Minecraftia";
        element.style.color = "#ffffff";
        element.style.background = "#5e5e5e";
        element.style.textShadow = "rgba(0, 0, 0, 0.667) 2px 2px";
        element.style.boxShadow = "rgba(0, 0, 0, 0.267) 2px 4px inset, rgba(255, 255, 255, 0.333) -2px -2px inset";
        element.style.margin = "10px 0px 0px 0px";
    }
}

// Wait for the page to load and then execute the function
window.addEventListener('load', addCustomServerInputAndTexturePackSelector);



// Custom start game function
function customStartBtn () {
    let nameValue = document.getElementById ('name').value;
    addGlobal('playerName', nameValue ? JSON.stringify(nameValue) : JSON.stringify('unnamed'))

    setCookie ("name", playerName, 365);
    setCookie ("skin", playerSkin, 365);

    var inputValue = (document.getElementById('customServer').value || '').trim();
    var localStorageValue = localStorage.getItem('lastServer');
    if (inputValue === 'Random server' || !inputValue) {
        requestServerName();
    } else if (localStorageValue && inputValue === 'Last server') {
        localStorage.setItem('lastServer', localStorageValue);
        G.gameServerAddress = localStorageValue;
        playGame();
    } else {
        localStorage.setItem('lastServer', inputValue);
        G.gameServerAddress = inputValue;
        playGame();
    }
}

function loadSelectedWorldTexture() {
  var selectedTexture = localStorage.getItem('selectedTexturePack');
  if (selectedTexture && isURL(selectedTexture)) {
    addCustomChat('<', 'Loading world texture from selected pack...');
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(selectedTexture, (texture) => {
      // Set texture filters as in your original loadWorldTexture
      texture.magFilter = THREE.NearestFilter;
      texture.minFilter = THREE.NearestMipmapLinearFilter;

      // Apply the texture to the game uniforms and assets
      GAME.uniforms.texture1.value = texture;
      GAME.assets[GAME.a836.Material].a643SolidMaterial.needsUpdate = true;
      GAME.assets[GAME.a836.Material].a643TransparentMaterial.needsUpdate = true;
      texture.needsUpdate = true;

      addCustomChat('<', 'World texture set!');
    });
  } else {
    console.log('No valid texture pack selected or not a URL.');
  }
}



// Override the xml request
var originalSend = window.XMLHttpRequest.prototype.send;
var originalOpen = window.XMLHttpRequest.prototype.open;

window.XMLHttpRequest.prototype.open = function(method, url) {
    this._url = url;
    return originalOpen.apply(this, arguments);
};

window.XMLHttpRequest.prototype.send = function() {
    if (this._url && this._url.startsWith('https://craftnite.io/gs/requestServer.php')){
        this.addEventListener('readystatechange', function() {
            if (this.readyState === 4) {
                var inputValue = (document.getElementById('customServer')?.value || '').trim();
                var localStorageValue = localStorage.getItem('lastServer');
                if (inputValue === 'Random server' || !inputValue) {
                    localStorage.setItem('lastServer', this.responseText);
                    return this.responseText
                }
            }
        }, false);
    }

    //+ adblock
    if (this._url.startsWith('https://craftnite.io') || this._url === 'a.zip') {
        return originalSend.apply(this, arguments);c
    }
};

/*
CHAT CMD AUTOCOMPLETE
*/
let selectedIndex = -1;

let suggestions = [];

function chatCmdSuggestions(event) {
  let keyCode = event.keyCode;

  if (keyCode !== 40 && keyCode !== 38 && keyCode !== 13) {
    let filter = GAME.chatInput.value.toLowerCase();

    // Clear suggestions array
    suggestions = [];

    // Check if filter includes slash
    if (filter.includes('/')) {
      // Check if filter includes blockCommands (e.g., '/set')
      let command = blockCommands.find(command => filter.startsWith('/' + command.toLowerCase() + ' '));
      if (command) {
        filter = filter.slice(command.length + 1).trim();
        Object.keys(blocks).forEach(item => {
          if (item.toLowerCase().includes(filter)) {
            suggestions.push('/' + command + ' ' + item);
          }
        });
      } else {
        commands.forEach(command => {
          if (command.toLowerCase().startsWith(filter.slice(1))) {
            suggestions.push('/' + command);
          }
        });
      }
    }
  }

  // Handle arrow keys and Enter
  if (keyCode === 40 || keyCode === 38 || keyCode === 13) {
    if (selectedIndex >= 0) {
      if (keyCode === 13) { // Enter key
        GAME.chatInput.value = suggestions[selectedIndex] || GAME.chatInput.value;
        selectedIndex = -1;
        GAME.chatInput.focus();
        return;
      }
    }

    if (keyCode === 40) { // Arrow down
      selectedIndex++;
      if (selectedIndex >= suggestions.length) {
        selectedIndex = 0;
      }
    } else if (keyCode === 38) { // Arrow up
      selectedIndex--;
      if (selectedIndex < 0) {
        selectedIndex = suggestions.length - 1;
      }
    }

    GAME.chatInput.value = suggestions[selectedIndex] || GAME.chatInput.value;
  }
}

/*
HELPER/UTILS FUNCS
*/
// Fisher-Yates shuffle algorithm
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

async function a637(positions, blockIds, errorCallback=null) {
    const indices = Array.from({length: positions.length}, (_, n) => n);
    //shuffle(indices);

    var index, chunkCoords, chunk, innerPos, pkt;

    for (var r = 0; r < indices.length; r++) {
        if (!cheatnite.worldedit.inprogress) {
            if (errorCallback)
                errorCallback();
            return;
        }

        index = indices[r];
        chunkCoords = GAME.a865.getChunkFromPos(positions[index]);
        innerPos = coordsToInsidePos(positions[index], chunkCoords);

        pkt = new a234();
        pkt.i = chunkCoords[0];
        pkt.e = chunkCoords[1];
        pkt.o = chunkCoords[2];
        pkt.v = innerPos;
        pkt.u = blockIds[index];
        G.socket.send(pkt.a614());

        if (r % 9 === 8) {
            await sleep(cheatnite.server.r*250);
        }
    }
}

async function rawa637(iArr, eArr, oArr, vArr, uArr, errorCallback=null) {
    const indices = Array.from({length: iArr.length}, (_, n) => n);
    //shuffle(indices);

    var index, pkt;

    for (var r = 0; r < indices.length; r++) {
        if (!cheatnite.worldedit.inprogress) {
            if (errorCallback)
                errorCallback();
            return;
        }

        index = indices[r];

        pkt = new a234();
        pkt.i = iArr[index];
        pkt.e = eArr[index];
        pkt.o = oArr[index];
        pkt.v = vArr[index];
        pkt.u = uArr[index];
        G.socket.send(pkt.a614());

        if (r % 9 === 8) {
            await sleep(cheatnite.server.r*250);
        }
    }
}

function tp(pos, updateVisual = true) {
    let me = GAME.a865.player;

    var pkt = new a175();
    pkt.time = parseFloat(("" + Date.now() / 1e3).slice(4));
    pkt.x = pos.x;
    pkt.y = pos.y;
    pkt.z = pos.z;
    pkt.a751 = me.a751;

    if (updateVisual) {
        me.controls.moveCameraTo(pos);
        me.position.copy(pos);
    }

    if (me.camera != null) {
        me.camera.rotation.order = "YXZ";
        pkt.a748 = me.camera.rotation.y;
        pkt.a749 = me.camera.rotation.x;
    }
    G.socket.send(pkt.a614())
}

function getColor(index, total) {
  let hue = 360 * (index / (total * 2));
  let saturation = 100;
  let lightness = 75;
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

function randomIP() {
  const octets = [];
  for (let i = 0; i < 4; i++) {
    const octet = Math.floor(Math.random() * 256);
    octets.push(octet);
  }
  return octets.join('.');
}

function isURL(str) {
  try {
    new URL(str);
    return true;
  } catch (e) {
    return false;
  }
}

function getBuildName(filename) {
  if (filename === '') {
    filename = '';
  }

  filename = filename.replaceAll(' ', '_');

  while (Object.keys(cheatnite.worldedit.builds).includes(filename)) {
    if (/\d+$/.test(filename)) {
      filename = filename.replace(/(\d+)$/, (match) => parseInt(match) + 1);
    } else {
      filename = filename + '1';
    }
  }

  return filename;
}


//shoot
function shoot(gun) {
    var e = new THREE.Vector3;

    var a = 8;
    var b = 9;

    switch (gun) {
    case "pistol":
        a = 8;
        b = 9;
        break;
    case "shotgun":
        a = 12;
        b = 13;
        var spread = 0.06; //spread goes from 0.03 - 0.06
        for (var i = 0; i < 8; i++) {
            e.x = G.randFloat(-spread, spread, 2);
            e.y = G.randFloat(-spread, spread, 2);
            e.z = G.randFloat(-spread, spread, 2);
            GAME.a865.player.a609(a, b, {
                headshotMsg: ["boom ", "headshot"],
                headshotColor: ["rgba(255,0,0,{opacity})", "rgba(255,255,255,{opacity})"]
            }, false, false, e)
        }
        return;
    case "sniper":
        a = 16;
        b = 17;
        e.x *= 100;
        e.y = G.randFloat(20 * -GAME.a865.player.a92.y, 20 * GAME.a865.player.a92.y, 2);
        e.z *= 100;
        break;
    case "ak47":
        a = 14;
        b = 15;
        e.x *= 100;
        e.y = G.randFloat(-GAME.a865.player.a92.y / 2, GAME.a865.player.a92.y / 2, 2);
        e.z *= 100;
        break;
    }
    GAME.a865.player.a609(a, b, {
        headshotMsg: ["boom ", "headshot"],
        headshotColor: ["rgba(255,0,0,{opacity})", "rgba(255,255,255,{opacity})"]
    }, false, false, e)
}

function throwItem(item) {
    var e = new THREE.Vector3;
    var spread = 0.2
    e.x = G.randFloat(-spread, spread, 2);
    e.y = G.randFloat(-spread, spread, 2);
    e.z = G.randFloat(-spread, spread, 2);

    switch(item) {
    case "stone":
        GAME.a865.player.a609(2, 2, {
            me: true
        });
        break;
    case "wood":
        GAME.a865.player.a609(3, 3, {
            me: true
        });
        break;
    case "tnt":
        GAME.a865.player.a609(4, 4, {
            me: true
        }, false, false, e);
        break;
    case "stairs":
        GAME.a865.player.a609(6, 6, {
            me: true
        })
    }
}

function onDeath(dv) {
    //GAME.a865.player.respawn();
    let c = new a191();
    c.a615(dv);
    GAME.a865.player.a539();
    GAME.addKillfeed(G.othera822ers[c.a163].name, "killed", GAME.a865.player.name);
    GAME.myKillerId = c.a163;
    G.othera822ers[c.a163] && G.othera822ers[c.a163].a472.add(GAME.camera);
    GAME.drawLeaderboard();
    $(document).off("mousedown.pointerLock");
    GAME.respawnIn = 0;
    $(document).on("mousedown.respawn", (function(t) {
        if(!$(t.target).is("#bottomright")) {
            GAME.a865.player.respawn();
            GAME.a865.player.controls.lock();
            $(document).off("mousedown.respawn");
        }
    }))
    GAME.uiManager.inventory.close();
    GAME.deadPopup = true;

    cheatnite.customBlockId = 256;

    if (cheatnite.tntspam) {
        cheatnite.tntspam = null;
        clearInterval(cheatnite.tntspam);
        modifyCheatDisp("tntspam");
    }

    if (cheatnite.bulletspam) {
        clearInterval(cheatnite.bulletspam);
        cheatnite.bulletspam = null;
        modifyCheatDisp("bulletspam");
    }

    if (cheatnite.autorespawn) {
        clearInterval(cheatnite.autorespawn);
        cheatnite.autorespawn = null;
        modifyCheatDisp("autorespawn");
    }

    cheatnite.updateCheatDisp = true;
}

function parseOutgoingChat(dv) {
    let msg = "";

    for (let i = 1; i < dv.byteLength; i += 2) {
        const charCode = dv.getUint16(i, true);
        msg += String.fromCharCode(charCode);
    }

    return msg;
}

//modified drawLeaderboard func to include ID in lb data
function drawLeaderboard() {
    GAME.leaderboard = [];
    for (var t = [], e = 0; e < 120; e++)
        if (G.othera822ers[e]) {
            var i = G.othera822ers[e];
            t.push([i.a649, i.id, i.name])
        }
    t.sort((function(t, e) {
        return t[0] - e[0]
    }
    ));
    for (var o = -1, n = 0, s = !1, r = !1, a = !1, h = (e = 0,
    0), l = t.length - 1; l >= 0; l--)
        a = t[l][1] == GAME.a865.player.id,
        t[l][0] != o && (o = t[l][0],
        n++),
        r = !1,
        e < 10 ? (a && (s = !0),
        r = !0) : s ? 10 == e && (r = !0) : a && (r = !0),
        r && (GAME.leaderboard[h] = {
            me: a,
            rank: n,
            name: `(${t[l][1]}) ${t[l][2]}`,
            a649: t[l][0],
            id: t[l][1]
        },
        h++),
        e++
}

function addCustomChat(name, msg) {
    if ("" != (msg = msg.trim())) {
        GAME.chat.push({
            name: name,
            msg: msg
        });
        if (GAME.chat.length > 5)
            GAME.chat = GAME.chat.slice(GAME.chat.length - 5, GAME.chat.length);
        GAME.newChatMessage = true;
    }
}

function addChat(t, e) {
    if ("" != (e = e.trim())) {
        if (cheatnite.ignored.includes(G.othera822ers[t].id)) {
            return;
        }
        var i = "server";
        255 != t && (i = G.othera822ers[t].name);
        if (i > 20) {
            i = i.substring(0, 17) + '...';
        }
        var name = `(${G.othera822ers[t].id}) ` + i;
        GAME.chat.push({
            name: name,
            msg: e
        });
        if (GAME.chat.length > 5)
            GAME.chat = GAME.chat.slice(GAME.chat.length - 5, GAME.chat.length);
        GAME.newChatMessage = true;
    }
}

function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

function checkInt(num) {
    return !isNaN(parseInt(num));
}

function checkNumsInArr(arr, len) {
    var nums = [];
    for (let i in arr) {
        if (!isNaN(Number(arr[i]))) {
            nums.push(Number(arr[i]));
        }
    }
    if (nums.length === len) {
        return nums;
    }
    return false;
}

function convertCoords(coords, type) {
    if (!coords) {
        return false;
    }
    var convertedCoords = new THREE.Vector3();

    if(type === "adjusted") {
        // Convert from true coords to adjusted coords
        convertedCoords.x = coords.x / 5 - 740;
        convertedCoords.y = coords.y / 5 - 53;
        convertedCoords.z = coords.z / 5 - 550;
    } else if(type === "true") {
        // Convert from adjusted coords to true coords
        convertedCoords.x = (coords.x + 740) * 5;
        convertedCoords.y = (coords.y + 53) * 5;
        convertedCoords.z = (coords.z + 550) * 5;
    } else {
        throw new Error('convertCoords type must be "true" or "adjusted".');
    }

    return convertedCoords;
}

function showKillFeed() {
  GAME.killfeedCanvas.cvs.clear();

  const num = (GAME.killfeed.length < 5) ? 0 : (GAME.killfeed.length - 5);

  for (let i = 0, index = num; index < GAME.killfeed.length; index++) {
    const entry = GAME.killfeed[index];

    if (entry) {
      const killer = (entry.killer.length < 10) ? entry.killer : (entry.killer.substring(0, 10) + "..");
      const victim = (entry.victim.length < 10) ? entry.victim : (entry.victim.substring(0, 10) + "..");
      const killFeedText = `${killer} ${entry.action} ${victim}`;

      GAME.killfeedCanvas.text(
        [10, 4 + 24 * i],
        [0, 0],
        killFeedText,
        "rgba(255, 255, 255, .9)",
        20,
        "top",
        "left",
        G.a816
      );

      i++;
    }
  }

  GAME.killfeedCanvas.cvs.flip();
  GAME.killfeedCanvas.cvs.show();
}

function modifyCheatDisp(text) {
    const index = cheatnite.activatedCheats.indexOf(text);
    if (index !== -1) {
      cheatnite.activatedCheats.splice(index, 1);
    } else {
      cheatnite.activatedCheats.push(text);
    }
    cheatnite.updateCheatDisp = true;
}

function customPosToV(t, buildP) {
    for (var e = -1, i = 0; i < 32; i++)
        if (t.x >= buildP.x + 5*i && t.x <= buildP.x + 5*(i + 1)) {
            e = i;
            break
        }
    var o = -1;
    for (i = 0; i < 32; i++)
        if (t.y >= buildP.y + 5*i && t.y <= buildP.y + 5*(i + 1)) {
            o = i;
            break
        }
    var n = -1;
    for (i = 0; i < 32; i++)
        if (t.z >= buildP.z + 5*i && t.z <= buildP.z + 5*(i + 1)) {
            n = i;
            break
        }
    return -1 != e && -1 != o && -1 != n && G.a650.prototype.a720(e, o, n)
}

function posTochunk(pos, buildP = null) {
    const chunkCoords = GAME.a865.getChunkFromPos(pos);
    const [i, e, o] = chunkCoords;

    let insidePos;
    if (buildP) {
        insidePos = customPosToV(pos, GAME.a865.a643s[i][e][o].buildP.clone());
    } else {
        insidePos = GAME.a865.a643s[i][e][o]?.posToV(pos);
    }

    return [chunkCoords, insidePos];
}

function getBlockIdAtPos(pos, buildP = null) {
    // convert world position to chunk coordinates
    const chunkCoords = GAME.a865.getChunkFromPos(pos);
    const [i, e, o] = chunkCoords;

    if (i>160 || e>160 || o>160)
        return null;

    // get the corresponding chunk
    const chunk = GAME.a865.a643s?.[i]?.[e]?.[o];

    if (!chunk) {
        return 0; //air, cause turns out empty chunks are...null
    }

    try {
        // convert world position to inside position within the chunk
        let insidePos;
        if (buildP) {
            insidePos = customPosToV(pos, chunk.buildP.clone());
        } else {
            insidePos = chunk.posToV(pos);
        }

        // get the block ID from the chunk's volume array
        const blockId = chunk.volume[insidePos];

        return blockId;
    } catch {
        return null;
    }
}

function getLookAtBlockId() {
    let blockId = null;

    var position = GAME.a865.player.position;
    position.y += 2.5;
    var rotation = GAME.a865.player.direction;

    const lookDirection = new THREE.Vector3();
    lookDirection.setFromSphericalCoords(rotation.x, rotation.y, rotation.z);

    const maxDistance = 1000;
    const stepSize = 0.1;
    const lookPosition = new THREE.Vector3();

    for (let distance = 0; distance <= maxDistance; distance += stepSize) {
        lookPosition.copy(position).addScaledVector(rotation, distance);
        blockId = getBlockIdAtPos(lookPosition);

        if (blockId) {
            break;
        }
    }

    return blockId;
}

function wasThrown() {
  try {
    throw new Error();
  } catch (e) {
    const stackLines = e.stack.split('\n');
    const callerLine = stackLines[3];
    const functionName = callerLine.match(/\ba853\b/);
    return !!functionName;
  }
}

function countItemInInv(target) {
    let count = 0;
    for (const item of GAME.a865.player.items) {
        if (item !== -1 && item.a474Id === target && item.total) {
            count += item.total;
        }
    }
    return count;
}

function getFormattedDateString() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day}-${hours}-${minutes}-${seconds}`;
}

function saveScene() {
    var renderer = GAME.renderer;
    var camera = GAME.a865.player.camera;
    renderer.render(GAME.scene, camera);
    var link = document.createElement('a');
    link.href = renderer.domElement.toDataURL('image/png');
    link.download = 'craftnite-io-'+getFormattedDateString()+'.png';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function hidePlayerBoxes() {
    const players = [];

    for (const p of G.othera822ers)
        if (p && p.id !== GAME.a865.player.id)
            players.push(p);

    for (let i = 0; i < players.length; i++) {
        const player = players[i];
        if (player.a472.box) {
            player.a472.box.visible = false;
        }
    }
}

function showPlayerBoxes() {
    const players = [];

    for (const p of G.othera822ers)
        if (p && p.id !== GAME.a865.player.id)
            players.push(p);

    for (let i = 0; i < players.length; i++) {
        const player = players[i];
        if (player.a472.box) {
            player.a472.box.visible = true;
        }
    }
}

async function handleImageCommand(args) {
    if (args.length !== 2) {
        return WorldEdit.error('Usage: /img <plane1> <plane2> (e.g., x y, -x z, y -z)');
    }

    const plane1 = args[0].toLowerCase();
    const plane2 = args[1].toLowerCase();

    const validPlanes = ['x', '-x', 'y', '-y', 'z', '-z'];
    if (!validPlanes.includes(plane1) || !validPlanes.includes(plane2) || plane1[plane1.length - 1] === plane2[plane2.length - 1]) {
        return WorldEdit.error('Invalid plane arguments. Use combinations of x, -x, y, -y, z, -z');
    }

    // Create file input
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = async (event) => {
        try {
            const file = event.target.files[0];
            const image = await createImageBitmap(file);
            const buildName = getBuildName(file.name.split('.')[0]);

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = image.width;
            canvas.height = image.height;
            ctx.drawImage(image, 0, 0);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const build = processImageData(imageData, plane1, plane2);

            cheatnite.worldedit.builds[buildName] = build;
            addCustomChat('WorldEdit', `Loaded image as build ${buildName} on ${plane1}${plane2} plane.`);
        } catch (error) {
            WorldEdit.error(error.toString());
        } finally {
            input.remove();
        }
    };

    input.click();
}

function processImageData(imageData, plane1, plane2) {
    const build = [];
    const { width, height, data } = imageData;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const index = (y * width + x) * 4;
            const r = data[index];
            const g = data[index + 1];
            const b = data[index + 2];
            const a = data[index + 3]; // Alpha channel



            // Skip transparent pixels

            if (a === 0) continue;

            const hexColor = rgbToHex(r, g, b);
            const blockId = findClosestBlockId(hexColor);

            if (blockId !== null) {
                const blockName = Object.keys(blocks).find(key => blocks[key] === blockId);
                const pos = getPosition(x, y, width, height, plane1, plane2);
                build.push({ name: blockName, pos });
            }
        }
    }

    return build;
}

function rgbToHex(r, g, b) {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
}

function findClosestBlockId(hexColor) {
    let closestColor = null;
    let minDistance = Infinity;

    for (const [blockId, color] of Object.entries(printblocks)) {
        const distance = colorDistance(hexColor, color);
        if (distance < minDistance) {
            minDistance = distance;
            closestColor = blockId;
        }
    }

    return closestColor ? parseInt(closestColor) : null;
}

function colorDistance(hex1, hex2) {
    const rgb1 = hexToRgb(hex1);
    const rgb2 = hexToRgb(hex2);
    return Math.sqrt(
        Math.pow(rgb1.r - rgb2.r, 2) +
        Math.pow(rgb1.g - rgb2.g, 2) +
        Math.pow(rgb1.b - rgb2.b, 2)
    );
}

function hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255
    };
}

function getPosition(x, y, width, height, plane1, plane2) {
    const pos = { x: 0, y: 0, z: 0 };

    // Flip y-axis to start from bottom
    y = height - y - 1;

    // Define the mapping from image coordinates to axes
    const planes = [plane1, plane2];
    const imageCoordinates = [x, y];

    // Keep track of which axes have been used
    const axesUsed = [];

    for (let i = 0; i < 2; i++) {
        const plane = planes[i];
        const value = imageCoordinates[i];

        // Determine the axis ('x', 'y', or 'z')
        const axis = plane.endsWith('x') ? 'x' :
                     plane.endsWith('y') ? 'y' : 'z';
        axesUsed.push(axis);

        // Determine the size for the axis (width or height)
        const size = (i === 0) ? width - 1 : height - 1;

        // Assign position, accounting for negative axes
        if (plane.startsWith('-')) {
            pos[axis] = size - value;
        } else {
            pos[axis] = value;
        }
    }

    // Set the remaining axis to 0
    const remainingAxis = ['x', 'y', 'z'].find(axis => !axesUsed.includes(axis));
    pos[remainingAxis] = 0;

    // Return position as an array [x, y, z]
    return [pos.x, pos.y, pos.z];
}



// Existing key event listener
document.addEventListener('keydown', (event) => {
  if (typeof(cheatnite) !== 'undefined' && document.activeElement && document.activeElement.tagName !== 'INPUT' && event.key === 'c' && !event.metaKey && !event.ctrlKey) {
    const { blockId } = getLookAtBlockId();
    cheatnite.customBlockId = blockId;
    cheatnite.updateCheatDisp = true;

    if (!cheatnite.customBlockId) {
        addCustomChat('<', 'Reset stone items.');
        return;
    }

    var stoneNeeded = 1000 - countItemInInv("stone");
    if (stoneNeeded > 0) {
        GAME.a865.player.a458("stone", stoneNeeded);
    }

    // Find the block name for the customBlockId
    const blockEntry = Object.entries(blocks).find(([name, id]) => id === cheatnite.customBlockId);
    const blockName = blockEntry ? blockEntry[0] : 'Unknown';

    addCustomChat('<', `Thrown stone set to ${blockName} (ID: ${blockId}).`);
  }
});



function flipObjectUpsideDown(points) {
  let flippedPoints = [];

  // find the minimum and maximum y-values of the object points
  let minY = points[0].y;
  let maxY = points[0].y;
  for (let i = 1; i < points.length; i++) {
    minY = Math.min(minY, points[i].y);
    maxY = Math.max(maxY, points[i].y);
  }

  // calculate the range of the y-values
  const yRange = maxY - minY;

  // map each point's y-value to a new y-value that reflects the flipped position
  for (let i = 0; i < points.length; i++) {
    let point = points[i];
    let newY = minY + (yRange - (point.y - minY));
    flippedPoints.push(new THREE.Vector3(point.x, newY, point.z));
  }

  return flippedPoints;
}

//for saving clipboard or chunked builds
const cbReplacer = (key, value) => {
  if (value && value.isVector3) {
    return [value.x, value.y, value.z];
  } else if (value instanceof Uint16Array) {
    return Array.from(value);
  }
  return value;
};

//for parsing clipboard or chunked builds JSON
const cbReviver = (key, value) => {
  if (Array.isArray(value)) {
    if (value.length === 3 && value.every(i => typeof i === 'number')) {
      return new THREE.Vector3(value[0], value[1], value[2]);
    }
  }
  return value;
};

function readChunksFromLocal(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      if (file.name.endsWith('.json')) {
        try {
          const jsonData = JSON.parse(event.target.result, cbReviver);
          if (jsonData.length !== 3) {
            throw new Error('Incorrect length for chunks loaded from file. Expected 3, got '+jsonData.length.toString()+'.');
          }
          if (!jsonData[0].isVector3 || !jsonData[1].isVector3) {
            throw new Error('First 2 items were expected to be arrays of length 3.');
          }
          if (Object.keys(jsonData[2]).some(key => typeof key !== 'string')) {
            throw new Error('Expected all keys in 3rd item to be strings.');
          }
          resolve(jsonData);
        } catch (error) {
          reject(`Error parsing JSON file: ${error.message}`);
        }
      }
    };
    reader.onerror = (event) => {
      reject(event.target.error);
    };
    reader.readAsText(file);
  });
}

function readBuildFromLocal(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      const buffer = new Uint8Array(event.target.result);
      const blks = await readBuildFile(file.name, buffer, blockStrings);
      resolve(blks);
    };
    reader.onerror = (event) => {
      reject(event.target.error);
    };
    reader.readAsArrayBuffer(file);
  });
}

async function readBuildFromURL(url) {
  const response = await fetch(url);
  const buffer = new Uint8Array(await response.arrayBuffer());
  const blks = await readBuildFile(url, buffer, blockStrings);
  return blks;
}

function chunkToCoords(chunkCoords, insidePos) {
    const [chunkX, chunkY, chunkZ] = chunkCoords;

    const x = insidePos % 32;
    const y = Math.floor(insidePos / 32) % 32;
    const z = Math.floor(insidePos / (32 * 32));

    const worldX = chunkX * 32 + x;
    const worldY = chunkY * 32 + y;
    const worldZ = chunkZ * 32 + z;

    return new THREE.Vector3(5*worldX, 5*worldY, 5*worldZ);
}

function coordsToInsidePos(worldCoords, chunkCoords) {
    const [chunkX, chunkY, chunkZ] = chunkCoords;

    const x = Math.floor(worldCoords.x/5) - chunkX * 32;
    const y = Math.floor(worldCoords.y/5) - chunkY * 32;
    const z = Math.floor(worldCoords.z/5) - chunkZ * 32;

    const insidePos = x + y * 32 + z * 32 * 32;

    return insidePos;
}

/*
WORLDEDIT
*/
let WorldEdit = {};
//add check for water if y <= 317

//pos1 and pos2
WorldEdit.pos1 = function(args) {
    let me = GAME.a865.player;
    if (args.length === 0) {
        cheatnite.worldedit.pos1 = me.position.clone();
        addCustomChat('WorldEdit', `pos1 set to ${convertCoords(cheatnite.worldedit.pos1, "adjusted")}`)
    } else if (args.length === 3) {
        let nums = checkNumsInArr(args, 3)
        if (!nums) {
            this.error('Numbers expected as arguments.');
            return;
        }
        let unadjusted = new THREE.Vector3(nums[0], nums[1], nums[2]);
        cheatnite.worldedit.pos1 = convertCoords(unadjusted, "true");
        addCustomChat('WorldEdit', `pos1 set to ${convertCoords(cheatnite.worldedit.pos1, "adjusted")}`)
    } else {
        this.error(`Expected 0 or 3 arguments, got ${args.length}.`);
    }
    return;
}

WorldEdit.pos2 = function(args) {
    let me = GAME.a865.player;
    if (args.length === 0) {
        cheatnite.worldedit.pos2 = me.position.clone();
        addCustomChat('WorldEdit', `pos2 set to ${convertCoords(cheatnite.worldedit.pos2, "adjusted")}`)
    } else if (args.length === 3) {
        let nums = checkNumsInArr(args, 3)
        if (!nums) {
            this.error('Numbers expected as arguments.');
        }
        let unadjusted = new THREE.Vector3(nums[0], nums[1], nums[2]);
        cheatnite.worldedit.pos2 = convertCoords(unadjusted, "true");
        addCustomChat('WorldEdit', `pos2 set to ${convertCoords(cheatnite.worldedit.pos2, "adjusted")}`)
    } else {
        this.error(`Expected 0 or 3 arguments, got ${args.length}.`);
    }
    return;
}

//generators
WorldEdit.generatePointsNotOf = async function*(pointA, pointB, chunkSize, blockId) {
    let start = new THREE.Vector3(Math.floor(pointA.x/5), Math.floor(pointA.y/5), Math.floor(pointA.z/5));
    let end = new THREE.Vector3(Math.floor(pointB.x/5), Math.floor(pointB.y/5), Math.floor(pointB.z/5));

    let tempPos;
    let points = [];
    for (let x = Math.min(start.x, end.x); x <= Math.max(start.x, end.x); x++) {
        for (let y = Math.min(start.y, end.y); y <= Math.max(start.y, end.y); y++) {
            for (let z = Math.min(start.z, end.z); z <= Math.max(start.z, end.z); z++) {
                tempPos = new THREE.Vector3(x*5+2.5, y*5+2.5, z*5+2.5);
                if (getBlockIdAtPos(tempPos) !== blockId) {
                    points.push(new THREE.Vector3(x*5+2.5, y*5+2.5, z*5+2.5));
                    if (points.length >= chunkSize) {
                        yield points;
                        points = [];
                    }
                }
            }
        }
        await sleep(10);
        if (!cheatnite.worldedit.inprogress) {
            yield points;
            points = [];
        }
    }
    if (points.length > 0) {
        yield points;
    }
}

WorldEdit.generateBoxPoints = async function*(pointA, pointB, chunkSize) {
    let start = new THREE.Vector3(Math.floor(pointA.x / 5), Math.floor(pointA.y / 5), Math.floor(pointA.z / 5));
    let end = new THREE.Vector3(Math.floor(pointB.x / 5), Math.floor(pointB.y / 5), Math.floor(pointB.z / 5));

    let tempPos;
    let points = [];

    for (let x = Math.min(start.x, end.x); x <= Math.max(start.x, end.x); x++) {
        for (let y = Math.min(start.y, end.y); y <= Math.max(start.y, end.y); y++) {
            for (let z = Math.min(start.z, end.z); z <= Math.max(start.z, end.z); z++) {
                if (x === start.x || x === end.x || y === start.y || y === end.y || z === start.z || z === end.z) {
                    tempPos = new THREE.Vector3(x * 5 + 2.5, y * 5 + 2.5, z * 5 + 2.5);
                    points.push(tempPos);

                    if (points.length >= chunkSize) {
                        yield points;
                        points = [];
                    }
                }
            }
        }
        await sleep(10);
        if (!cheatnite.worldedit.inprogress) {
            yield points;
            points = [];
        }
    }
    if (points.length > 0) {
        yield points;
    }
}
/*
WorldEdit.generateSuperellipsoidPoints = async function*(center, radii, exponent1, exponent2, chunkSize) {
    const centerX = center.x;
    const centerY = center.y;
    const centerZ = center.z;
    const rx = radii.x;
    const ry = radii.y;
    const rz = radii.z;

    let points = [];
    const stepTheta = Math.PI / 50; // Adjust for finer or coarser resolution
    const stepPhi = Math.PI / 50;

    for (let theta = -Math.PI / 2; theta <= Math.PI / 2; theta += stepTheta) {
        for (let phi = -Math.PI; phi <= Math.PI; phi += stepPhi) {
            // Superellipsoid parametric equations
            const cosTheta = Math.cos(theta);
            const sinTheta = Math.sin(theta);
            const cosPhi = Math.cos(phi);
            const sinPhi = Math.sin(phi);

            // Helper functions to handle sign and absolute value with exponents
            const signPow = (value, exp) => {
                return Math.sign(value) * Math.pow(Math.abs(value), exp);
            };

            const x = rx * signPow(cosTheta, exponent1) * signPow(cosPhi, exponent2);
            const y = ry * signPow(cosTheta, exponent1) * signPow(sinPhi, exponent2);
            const z = rz * signPow(sinTheta, exponent1);

            const tempPos = new THREE.Vector3(centerX + x, centerY + y, centerZ + z);
            points.push(tempPos);

            if (points.length >= chunkSize) {
                yield points;
                points = [];
            }
        }
        await sleep(10);
        if (!cheatnite.worldedit.inprogress) {
            yield points;
            return;
        }
    }
    if (points.length > 0) {
        yield points;
    }
}
*/
WorldEdit.generateSuperellipsoidPoints = async function*(center, radii, exponent1, exponent2, chunkSize) {
    const rx = radii.x;
    const ry = radii.y;
    const rz = radii.z;

    // Define the bounding box for the superellipsoid
    const minX = Math.floor((center.x - rx) / 5);
    const maxX = Math.ceil((center.x + rx) / 5);
    const minY = Math.floor((center.y - ry) / 5);
    const maxY = Math.ceil((center.y + ry) / 5);
    const minZ = Math.floor((center.z - rz) / 5);
    const maxZ = Math.ceil((center.z + rz) / 5);

    let points = [];

    for (let x = minX; x <= maxX; x++) {
        for (let y = minY; y <= maxY; y++) {
            for (let z = minZ; z <= maxZ; z++) {
                // Calculate the actual position of the block
                const posX = x * 5 + 2.5;
                const posY = y * 5 + 2.5;
                const posZ = z * 5 + 2.5;

                // Normalize coordinates relative to the center and radii
                const nx = (posX - center.x) / rx;
                const ny = (posY - center.y) / ry;
                const nz = (posZ - center.z) / rz;

                // Calculate the value of the superellipsoid equation
                const value = Math.pow(Math.abs(nx), 2 / exponent1) + Math.pow(Math.abs(ny), 2 / exponent2) + Math.pow(Math.abs(nz), 2 / exponent1);

                // Determine if the point lies on the surface
                // Adjust the threshold (0.05) for desired thickness
                if (Math.abs(value - 1) <= 0.05) {
                    const tempPos = new THREE.Vector3(posX, posY, posZ);
                    points.push(tempPos);

                    if (points.length >= chunkSize) {
                        yield points;
                        points = [];
                    }
                }

                // Optional: For filling the solid shape, use '<= 1' instead
                // if (value <= 1.0) {
                //     // Add point
                // }
            }
        }

        // Check for user interruption and yield periodically
        await sleep(1);
        if (!cheatnite.worldedit.inprogress) {
            yield points;
            return;
        }
    }

    if (points.length > 0) {
        yield points;
    }
}

WorldEdit.generateCheckerPoints = async function*(pointA, pointB, chunkSize) {
    let start = new THREE.Vector3(Math.floor(pointA.x / 5), Math.floor(pointA.y / 5), Math.floor(pointA.z / 5));
    let end = new THREE.Vector3(Math.floor(pointB.x / 5), Math.floor(pointB.y / 5), Math.floor(pointB.z / 5));

    let tempPos;
    let points = [];

    for (let x = Math.min(start.x, end.x); x <= Math.max(start.x, end.x); x++) {
        for (let y = Math.min(start.y, end.y); y <= Math.max(start.y, end.y); y++) {
            for (let z = Math.min(start.z, end.z); z <= Math.max(start.z, end.z); z++) {
                if ((x + y + z) % 2 === 0) {
                    tempPos = new THREE.Vector3(x * 5 + 2.5, y * 5 + 2.5, z * 5 + 2.5);
                    points.push(tempPos);

                    if (points.length >= chunkSize) {
                        yield points;
                        points = [];
                    }
                }
            }
        }
        await sleep(10);
        if (!cheatnite.worldedit.inprogress) {
            yield points;
            points = [];
        }
    }
    if (points.length > 0) {
        yield points;
    }
}

WorldEdit.generateGridPoints = async function*(pointA, pointB, chunkSize, distance) {
    let start = new THREE.Vector3(Math.floor(pointA.x / 5), Math.floor(pointA.y / 5), Math.floor(pointA.z / 5));
    let end = new THREE.Vector3(Math.floor(pointB.x / 5), Math.floor(pointB.y / 5), Math.floor(pointB.z / 5));

    let points = [];

    let minX = Math.min(start.x, end.x);
    let maxX = Math.max(start.x, end.x);
    let minY = Math.min(start.y, end.y);
    let maxY = Math.max(start.y, end.y);
    let minZ = Math.min(start.z, end.z);
    let maxZ = Math.max(start.z, end.z);

    for (let x = minX; x <= maxX; x += distance) {
        for (let y = minY; y <= maxY; y += distance) {
            for (let z = minZ; z <= maxZ; z += distance) {
                let tempPos = new THREE.Vector3(x * 5 + 2.5, y * 5 + 2.5, z * 5 + 2.5);
                points.push(tempPos);

                if (points.length >= chunkSize) {
                    yield points;
                    points = [];
                }
            }
        }
        await sleep(10);
        if (!cheatnite.worldedit.inprogress) {
            yield points;
            points = [];
            return;
        }
    }
    if (points.length > 0) {
        yield points;
    }
}

WorldEdit.setgrid = async function(start, end, blockName, distance) {
    cheatnite.worldedit.inprogress = "setgrid";
    cheatnite.updateCheatDisp = true;
    addCustomChat('WorldEdit', `Creating a grid pattern from ${convertCoords(start, "adjusted")} to ${convertCoords(end, "adjusted")} with '${blockName}' blocks every ${distance} blocks...`);

    let blockId = blocks[blockName];
    let chunkSize = 30000;
    let generator = this.generateGridPoints(start, end, chunkSize, distance);

    for await (let chunk of generator) {
        await a637(chunk, this.createBlockArr(chunk.length, blockId), () => {
            addCustomChat('WorldEdit', 'Stopped //setgrid command.');
        });
        if (!cheatnite.worldedit.inprogress)
            return;
    }

    cheatnite.worldedit.inprogress = false;
    cheatnite.updateCheatDisp = true;
    addCustomChat('WorldEdit', 'Completed //setgrid command.');
}

WorldEdit.lock = async function(start, end) {
    cheatnite.worldedit.inprogress = "lock";
    cheatnite.updateCheatDisp = true;
    addCustomChat('WorldEdit', `Locking region ${convertCoords(start, "adjusted")} - ${convertCoords(end, "adjusted")}...`);

    const lockedRegion = await this.copyChunks(start, end);

    if (!cheatnite.worldedit.lockedRegions) {
        cheatnite.worldedit.lockedRegions = [];
    }
    cheatnite.worldedit.lockedRegions.push(lockedRegion);

    this.startLockMonitor();

    cheatnite.worldedit.inprogress = false;
    cheatnite.updateCheatDisp = true;
    addCustomChat('WorldEdit', 'Region locked successfully.');
}

WorldEdit.unlock = function() {
    cheatnite.worldedit.lockedRegions = [];
    if (this.lockMonitorInterval) {
        clearInterval(this.lockMonitorInterval);
        this.lockMonitorInterval = null;
    }
    addCustomChat('WorldEdit', 'All regions unlocked.');
}

WorldEdit.startLockMonitor = function() {
    if (this.lockMonitorInterval) {
        clearInterval(this.lockMonitorInterval);
    }

    this.lockMonitorInterval = setInterval(async () => {
        if (!cheatnite.worldedit.lockedRegions || cheatnite.worldedit.lockedRegions.length === 0) {
            clearInterval(this.lockMonitorInterval);
            this.lockMonitorInterval = null;
            return;
        }

        for (const region of cheatnite.worldedit.lockedRegions) {
            await this.checkAndRestoreRegion(region);
        }
    }, 5000); // Check every 5 seconds
}

WorldEdit.checkAndRestoreRegion = async function(region) {
    const [start, end, volumes] = region;
    let restoredBlocks = 0;

    for (let x = start.x; x <= end.x; x++) {
        for (let y = start.y; y <= end.y; y++) {
            for (let z = start.z; z <= end.z; z++) {
                const pos = new THREE.Vector3(x*5+2.5, y*5+2.5, z*5+2.5);
                const [chunkCoords, insidePos] = posTochunk(pos);
                const [cx, cy, cz] = chunkCoords;
                const key = [cx, cy, cz].join(',');
                const chunkData = volumes[key];

                if (!chunkData) continue;

                const lockedBlockId = chunkData[1][insidePos];
                const currentBlockId = getBlockIdAtPos(pos);

                if (lockedBlockId !== currentBlockId) {
                    try {
                        await this.placeBlock(cx, cy, cz, insidePos, lockedBlockId);
                        restoredBlocks++;
                    } catch (error) {
                        console.error('Error placing block:', error);
                    }
                }
            }
        }
        await sleep(10); // To prevent freezing the game
    }

    if (restoredBlocks > 0) {
        addCustomChat('WorldEdit', `Restored ${restoredBlocks} blocks`);
    }
}

WorldEdit.placeBlock = function(cx, cy, cz, insidePos, blockId) {
    return new Promise((resolve, reject) => {
        try {
            let pkt = new a234();
            pkt.i = cx;
            pkt.e = cy;
            pkt.o = cz;
            pkt.v = insidePos;
            pkt.u = blockId;
            G.socket.send(pkt.a614());
            resolve();
        } catch (error) {
            reject(error);
        }
    });
}
WorldEdit.generatePointsFromLockedRegion = async function*(start, end, volumes, chunkSize = 100) {
    let count = 0;
    let chunkXList = [];
    let chunkYList = [];
    let chunkZList = [];
    let insidePositionsList = [];
    let blockIdsList = [];

    for (let x = start.x; x <= end.x; x++) {
        for (let y = start.y; y <= end.y; y++) {
            for (let z = start.z; z <= end.z; z++) {
                const pos = new THREE.Vector3(x*5+2.5, y*5+2.5, z*5+2.5);
                const [chunkCoords, insidePos] = posTochunk(pos);
                const [cx, cy, cz] = chunkCoords;
                const key = [cx, cy, cz].join(',');
                const chunkData = volumes[key];

                if (!chunkData) continue;

                const lockedBlockId = chunkData[1][insidePos];
                const currentBlockId = getBlockIdAtPos(pos);

                if (lockedBlockId !== currentBlockId) {
                    chunkXList.push(cx);
                    chunkYList.push(cy);
                    chunkZList.push(cz);
                    insidePositionsList.push(insidePos);
                    blockIdsList.push(lockedBlockId);
                    count++;

                    if (count >= chunkSize) {
                        yield [chunkXList, chunkYList, chunkZList, insidePositionsList, blockIdsList];
                        chunkXList = [];
                        chunkYList = [];
                        chunkZList = [];
                        insidePositionsList = [];
                        blockIdsList = [];
                        count = 0;
                    }
                }
            }
        }
        await sleep(10);
    }

    if (count > 0) {
        yield [chunkXList, chunkYList, chunkZList, insidePositionsList, blockIdsList];
    }
}

WorldEdit.generateAllPoints = async function*(playerPos, chunkSize) {
    let points = [];
    let blockIds = [];
    let allBlockIds = Object.values(blocks);
    let blockIndex = 0;

    // Define the area around the player (adjust these values as needed)
    let radius = Math.ceil(Math.sqrt(allBlockIds.length)); // Make it square to fit all blocks
    let y = Math.floor(playerPos.y / 5); // Keep it flat on player's Y level
    let startX = Math.floor((playerPos.x - radius * 5) / 5);
    let startZ = Math.floor((playerPos.z - radius * 5) / 5);

    for (let x = startX; x < startX + radius * 2; x++) {
        for (let z = startZ; z < startZ + radius * 2; z++) {
            if (blockIndex >= allBlockIds.length) {
                if (points.length > 0) {
                    yield [points, blockIds];
                }
                yield null; // Signal that all blocks have been placed
                return;
            }

            let tempPos = new THREE.Vector3(x * 5 + 2.5, y * 5 + 2.5, z * 5 + 2.5);
            points.push(tempPos);
            blockIds.push(allBlockIds[blockIndex]);

            blockIndex++;

            if (points.length >= chunkSize) {
                yield [points, blockIds];
                points = [];
                blockIds = [];
            }
        }
        await sleep(10);
        if (!cheatnite.worldedit.inprogress) {
            if (points.length > 0) {
                yield [points, blockIds];
            }
            return;
        }
    }
    if (points.length > 0) {
        yield [points, blockIds];
    }
}

//get all points of a certain blockId
WorldEdit.generatePointsOf = async function*(pointA, pointB, blockId, chunkSize) {
    let start = new THREE.Vector3(Math.floor(pointA.x/5), Math.floor(pointA.y/5), Math.floor(pointA.z/5));
    let end = new THREE.Vector3(Math.floor(pointB.x/5), Math.floor(pointB.y/5), Math.floor(pointB.z/5));

    let tempPos;
    let points = [];
    for (let x = Math.min(start.x, end.x); x <= Math.max(start.x, end.x); x++) {
        for (let y = Math.min(start.y, end.y); y <= Math.max(start.y, end.y); y++) {
            for (let z = Math.min(start.z, end.z); z <= Math.max(start.z, end.z); z++) {
                tempPos = new THREE.Vector3(x*5+2.5, y*5+2.5, z*5+2.5);
                if (getBlockIdAtPos(tempPos) == blockId) {
                    points.push(new THREE.Vector3(x*5+2.5, y*5+2.5, z*5+2.5));
                    if (points.length >= chunkSize) {
                        yield points;
                        points = [];
                    }
                }
            }
        }
        await sleep(10);
        if (!cheatnite.worldedit.inprogress) {
            yield points;
            points = [];
        }
    }
    if (points.length > 0) {
        yield points;
    }
}

WorldEdit.generateSpherePoints = async function*(centerPoint, radius, chunkSize, blockId) {
    let points = [];
    let radiusSquared = radius * radius;
    let minX = Math.floor((centerPoint.x - radius) / 5);
    let maxX = Math.floor((centerPoint.x + radius) / 5);
    let minY = Math.floor((centerPoint.y - radius) / 5);
    let maxY = Math.floor((centerPoint.y + radius) / 5);
    let minZ = Math.floor((centerPoint.z - radius) / 5);
    let maxZ = Math.floor((centerPoint.z + radius) / 5);

    let tempPos;
    for (let x = minX; x <= maxX; x++) {
        for (let y = minY; y <= maxY; y++) {
            for (let z = minZ; z <= maxZ; z++) {
                tempPos = new THREE.Vector3(x * 5 + 2.5, y * 5 + 2.5, z * 5 + 2.5);
                let distanceSquared = tempPos.distanceToSquared(centerPoint);

                if (distanceSquared <= radiusSquared && getBlockIdAtPos(tempPos) !== blockId) {
                    points.push(tempPos);
                    if (points.length >= chunkSize) {
                        yield points;
                        points = [];
                    }
                }
            }
        }
        await sleep(10);
        if (!cheatnite.worldedit.inprogress) {
            yield points;
            points = [];
        }
    }

    if (points.length > 0) {
        yield points;
    }
}

WorldEdit.generateHollowSpherePoints = async function*(centerPoint, radius, chunkSize, blockId) {
    let points = [];
    let radiusSquared = radius * radius;
    let innerRadiusSquared = (radius - 1) * (radius - 1);
    let minX = Math.floor((centerPoint.x - radius) / 5);
    let maxX = Math.floor((centerPoint.x + radius) / 5);
    let minY = Math.floor((centerPoint.y - radius) / 5);
    let maxY = Math.floor((centerPoint.y + radius) / 5);
    let minZ = Math.floor((centerPoint.z - radius) / 5);
    let maxZ = Math.floor((centerPoint.z + radius) / 5);

    let tempPos;
    for (let x = minX; x <= maxX; x++) {
        for (let y = minY; y <= maxY; y++) {
            for (let z = minZ; z <= maxZ; z++) {
                tempPos = new THREE.Vector3(x * 5 + 2.5, y * 5 + 2.5, z * 5 + 2.5);
                let distanceSquared = tempPos.distanceToSquared(centerPoint);

                if (distanceSquared <= radiusSquared && getBlockIdAtPos(tempPos) !== blockId) {
                    let isOnSurface = false;
                    for (let dx = -1; dx <= 1; dx++) {
                        for (let dy = -1; dy <= 1; dy++) {
                            for (let dz = -1; dz <= 1; dz++) {
                                let neighborPos = new THREE.Vector3(tempPos.x + dx * 5, tempPos.y + dy * 5, tempPos.z + dz * 5);
                                let neighborDistanceSquared = neighborPos.distanceToSquared(centerPoint);
                                if (neighborDistanceSquared >= innerRadiusSquared) {
                                    isOnSurface = true;
                                    break;
                                }
                            }
                            if (isOnSurface) break;
                        }
                        if (isOnSurface) break;
                    }

                    if (isOnSurface) {
                        points.push(tempPos);
                        if (points.length >= chunkSize) {
                            yield points;
                            points = [];
                        }
                    }
                }
            }
        }
        await sleep(10);
        if (!cheatnite.worldedit.inprogress) {
            yield points;
            points = [];
        }
    }

    if (points.length > 0) {
        yield points;
    }
}

WorldEdit.generateLinePoints = async function*(pos1, pos2, radius, chunkSize, blockId) {
    let points = [];
    let radiusSquared = radius * radius;
    let dir = pos2.clone().sub(pos1);
    let length = dir.length();
    let unitDir = dir.clone().normalize();

    // Determine the bounding box
    let minX = Math.floor((Math.min(pos1.x, pos2.x) - radius) / 5);
    let maxX = Math.floor((Math.max(pos1.x, pos2.x) + radius) / 5);
    let minY = Math.floor((Math.min(pos1.y, pos2.y) - radius) / 5);
    let maxY = Math.floor((Math.max(pos1.y, pos2.y) + radius) / 5);
    let minZ = Math.floor((Math.min(pos1.z, pos2.z) - radius) / 5);
    let maxZ = Math.floor((Math.max(pos1.z, pos2.z) + radius) / 5);

    let tempPos;
    for (let x = minX; x <= maxX; x++) {
        for (let y = minY; y <= maxY; y++) {
            for (let z = minZ; z <= maxZ; z++) {
                tempPos = new THREE.Vector3(x * 5 + 2.5, y * 5 + 2.5, z * 5 + 2.5);

                // Compute vector from pos1 to tempPos
                let p = tempPos.clone().sub(pos1);

                // Project p onto dir
                let t = p.dot(unitDir);

                // Check if t is within [0, length]
                if (t < 0 || t > length) {
                    continue;
                }

                // Closest point on the line
                let closestPoint = pos1.clone().add(unitDir.clone().multiplyScalar(t));

                // Distance squared from tempPos to closest point
                let distanceSquared = tempPos.distanceToSquared(closestPoint);

                if (distanceSquared <= radiusSquared && getBlockIdAtPos(tempPos) !== blockId) {
                    points.push(tempPos);
                    if (points.length >= chunkSize) {
                        yield points;
                        points = [];
                    }
                }
            }
        }
        await sleep(10);
        if (!cheatnite.worldedit.inprogress) {
            yield points;
            points = [];
        }
    }

    if (points.length > 0) {
        yield points;
    }
}

WorldEdit.generateHollowLinePoints = async function*(pos1, pos2, radius, chunkSize, blockId) {
    // Adjustable block size variable
    let blockSize = 5; // Change as needed

    // Wall thickness adjustment
    let wallThickness = 5; // Increase wall thickness by 1 block

    let points = [];
    let outerRadiusSquared = radius * radius;
    let innerRadius = radius - wallThickness;
    let innerRadiusSquared = innerRadius * innerRadius;

    let dir = pos2.clone().sub(pos1);
    let length = dir.length();
    let unitDir = dir.clone().normalize();

    // Determine the bounding box
    let minX = Math.floor((Math.min(pos1.x, pos2.x) - radius) / blockSize);
    let maxX = Math.floor((Math.max(pos1.x, pos2.x) + radius) / blockSize);
    let minY = Math.floor((Math.min(pos1.y, pos2.y) - radius) / blockSize);
    let maxY = Math.floor((Math.max(pos1.y, pos2.y) + radius) / blockSize);
    let minZ = Math.floor((Math.min(pos1.z, pos2.z) - radius) / blockSize);
    let maxZ = Math.floor((Math.max(pos1.z, pos2.z) + radius) / blockSize);

    let tempPos;
    for (let x = minX; x <= maxX; x++) {
        for (let y = minY; y <= maxY; y++) {
            for (let z = minZ; z <= maxZ; z++) {
                // Calculate the block center position
                tempPos = new THREE.Vector3(
                    x * blockSize + blockSize / 2,
                    y * blockSize + blockSize / 2,
                    z * blockSize + blockSize / 2
                );

                // Compute vector from pos1 to tempPos
                let p = tempPos.clone().sub(pos1);

                // Project p onto dir
                let t = p.dot(unitDir);

                // Check if t is within [0, length]
                if (t < 0 || t > length) {
                    continue;
                }

                // Closest point on the line
                let closestPoint = pos1.clone().add(unitDir.clone().multiplyScalar(t));

                // Distance squared from tempPos to closest point
                let distanceSquared = tempPos.distanceToSquared(closestPoint);

                // Check if the block is within the hollow cylinder shell
                if (
                    distanceSquared <= outerRadiusSquared &&
                    distanceSquared >= innerRadiusSquared &&
                    getBlockIdAtPos(tempPos) !== blockId
                ) {
                    points.push(tempPos);
                    if (points.length >= chunkSize) {
                        yield points;
                        points = [];
                    }
                }
            }
        }
        await sleep(10);
        if (!cheatnite.worldedit.inprogress) {
            yield points;
            return;
        }
    }

    if (points.length > 0) {
        yield points;
    }
}

WorldEdit.copyChunks = async function(pointA, pointB) {
    let start = new THREE.Vector3(Math.floor(pointA.x/5), Math.floor(pointA.y/5), Math.floor(pointA.z/5));
    let end = new THREE.Vector3(Math.floor(pointB.x/5), Math.floor(pointB.y/5), Math.floor(pointB.z/5));

    let tempPos, tempBlock;
    let i, e, o;
    let chunk, volume;
    let key;
    let volumes = {};

    let minX = Math.min(start.x, end.x);
    let minY = Math.min(start.y, end.y);
    let minZ = Math.min(start.z, end.z);
    let maxX = Math.max(start.x, end.x);
    let maxY = Math.max(start.y, end.y);
    let maxZ = Math.max(start.z, end.z);

    for (let x = minX; x <= maxX; x++) {
        if (x % 32 !== 0 && x !== minX && x !== maxX) continue;
        for (let y = minY; y <= maxY; y++) {
            if (y % 32 !== 0 && y !== minY && y !== maxY) continue;
            for (let z = minZ; z <= maxZ; z++) {
                if (z % 32 !== 0 && z !== minZ && z !== maxZ) continue;
                tempPos = new THREE.Vector3(x*5+2.5, y*5+2.5, z*5+2.5);
                [i, e, o] = GAME.a865.getChunkFromPos(tempPos);
                if (i>160 || e>160 || o>160)
                    continue;

                chunk = GAME.a865.a643s[i][e][o];
                volume = chunk?.volume;

                key = [i, e, o].join(',');
                if (volume) {
                    volumes[key] = [chunk.buildP.clone(), volume];
                } else {
                    volumes[key] = [new THREE.Vector3(i*32*5, e*32*5, o*32*5), new Uint8Array(32768)]
                }
            }
        }
        await sleep(1);
    }
    return [
        new THREE.Vector3(minX, minY, minZ),
        new THREE.Vector3(maxX, maxY, maxZ),
        volumes,
    ];
};

WorldEdit.generatePointsFromClipboard = async function*(chunkSize = 100, newStart = null) {
    // cb stands for clipboard
    let [start, end, cbVolumes] = cheatnite.worldedit.clipboard;
    const diff = newStart ? new THREE.Vector3(Math.floor(newStart.x/5), Math.floor(newStart.y/5), Math.floor(newStart.z/5)).sub(start) : new THREE.Vector3(0,0,0);

    let count = 0;

    let chunkXList = [];
    let chunkYList = [];
    let chunkZList = [];
    let insidePositionsList = [];
    let blockIdsList = [];

    for (let x = start.x; x <= end.x; x++) {
        for (let y = start.y; y <= end.y; y++) {
            for (let z = start.z; z <= end.z; z++) {
                const oldPos = new THREE.Vector3(x*5+2.5, y*5+2.5, z*5+2.5);
                const chunkCoords = GAME.a865.getChunkFromPos(oldPos);
                const chunkData = cbVolumes[chunkCoords.join(',')];
                if (!chunkData)
                    continue;

                const insidePos = customPosToV(oldPos, chunkData[0]);
                const blockId = chunkData[1][insidePos];

                const [newChunkCoords, newInsidePos] = posTochunk(oldPos.clone().add(diff.clone().multiplyScalar(5)));
                const [newCx, newCy, newCz] = newChunkCoords;
                const currentBlock = GAME.a865.a643s[newCx][newCy][newCz]?.volume?.[newInsidePos];
                if (blockId === currentBlock)
                    continue;

                chunkXList.push(newCx);
                chunkYList.push(newCy);
                chunkZList.push(newCz);
                insidePositionsList.push(newInsidePos);
                blockIdsList.push(blockId);
                count++;

                if (count >= chunkSize) {
                    yield [chunkXList, chunkYList, chunkZList, insidePositionsList, blockIdsList];
                    chunkXList = [];
                    chunkYList = [];
                    chunkZList = [];
                    insidePositionsList = [];
                    blockIdsList = [];
                    count = 0;
                }
            }
        }
        await sleep(10);
    }

    if (count) {
        yield [chunkXList, chunkYList, chunkZList, insidePositionsList, blockIdsList];
    }
};

// Implement exportBuild function
WorldEdit.exportBuild = function(buildName) {
    const buildData = cheatnite.worldedit.builds[buildName];
    if (!buildData) {
        WorldEdit.error(`Build '${buildName}' does not exist.`);
        return;
    }

    const filename = buildName + '.txt';
    const dataStr = JSON.stringify(buildData);

    const blob = new Blob([dataStr], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);

    addCustomChat('WorldEdit', `Exported build '${buildName}' to ${filename}.`);
};

// Implement saveToBuild function
WorldEdit.saveToBuild = async function(pointA, pointB, buildName) {
    cheatnite.worldedit.inprogress = "save";
    cheatnite.updateCheatDisp = true;
    addCustomChat('WorldEdit', `Saving selection to build '${buildName}'...`);

    const [start, end, volumes] = await this.copyChunks(pointA, pointB);

    const buildData = [];
    const blockIDsToNames = invertObject(blocks); // Invert the blocks mapping to get names from IDs

    const minX = Math.min(start.x, end.x);
    const minY = Math.min(start.y, end.y);
    const minZ = Math.min(start.z, end.z);
    const maxX = Math.max(start.x, end.x);
    const maxY = Math.max(start.y, end.y);
    const maxZ = Math.max(start.z, end.z);

    for (let x = minX; x <= maxX; x++) {
        for (let y = minY; y <= maxY; y++) {
            for (let z = minZ; z <= maxZ; z++) {
                const pos = new THREE.Vector3(x * 5 + 2.5, y * 5 + 2.5, z * 5 + 2.5);
                const [chunkCoords, insidePos] = posTochunk(pos);
                const chunkKey = chunkCoords.join(',');

                const volumeData = volumes[chunkKey];
                if (!volumeData) continue;

                const blockId = volumeData[1][insidePos];
                if (blockId && blockId !== 0) {
                    const blockName = blockIDsToNames[blockId];
                    if (!blockName) continue; // Skip unknown block IDs

                    // Store relative positions
                    buildData.push({
                        pos: [x - minX, y - minY, z - minZ],
                        name: blockName
                    });
                }
            }
        }
        await sleep(1); // Yield execution to prevent blocking
    }

    cheatnite.worldedit.builds[buildName] = buildData;

    cheatnite.worldedit.inprogress = false;
    cheatnite.updateCheatDisp = true;
    addCustomChat('WorldEdit', `Saved selection as build '${buildName}' with ${buildData.length} blocks.`);
};

// Helper function to invert the blocks mapping
function invertObject(obj) {
    const inverted = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            inverted[obj[key]] = key;
        }
    }
    return inverted;
}

// Ensure posTochunk function exists and returns both chunk coordinates and inside position
function posTochunk(pos) {
    const chunkX = Math.floor(pos.x / (32 * 5));
    const chunkY = Math.floor(pos.y / (32 * 5));
    const chunkZ = Math.floor(pos.z / (32 * 5));

    const insideX = Math.floor((pos.x % (32 * 5)) / 5);
    const insideY = Math.floor((pos.y % (32 * 5)) / 5);
    const insideZ = Math.floor((pos.z % (32 * 5)) / 5);

    const insidePos = insideX + insideY * 32 + insideZ * 1024;

    return [[chunkX, chunkY, chunkZ], insidePos];
}

// Ensure getBuildName function exists
function getBuildName(filename) {
    if (filename === '') {
        filename = '';
    }

    filename = filename.replace(/ /g, '_');

    while (Object.keys(cheatnite.worldedit.builds).includes(filename)) {
        if (/\d+$/.test(filename)) {
            filename = filename.replace(/(\d+)$/, (match, p1) => parseInt(p1) + 1);
        } else {
            filename = filename + '1';
        }
    }

    return filename;
}

// Provide error function if not exists
WorldEdit.error = function(message) {
    addCustomChat('WorldEdit', `Error: ${message}`);
};

// Implement loadBuild function
WorldEdit.loadBuild = function() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt';

    input.onchange = function(event) {
        const file = event.target.files[0];
        if (!file) {
            WorldEdit.error('No file selected.');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const buildData = JSON.parse(e.target.result);
                const buildName = getBuildName(file.name.replace('.txt', ''));

                cheatnite.worldedit.builds[buildName] = buildData;

                addCustomChat('WorldEdit', `Loaded build '${buildName}' from file '${file.name}'.`);
            } catch (err) {
                WorldEdit.error(`Error loading build: ${err.message}`);
            }
        };
        reader.readAsText(file);
    };

    input.click();
};

WorldEdit.generatePointsFromBuild = async function*(buildName, start, chunkSize) {
    let tempPos;
    let shiftedPoints = [];
    let buildBlockIds = [];
    const buildBlocks = cheatnite.worldedit.builds[buildName];

    // Convert 'start' to grid units
    let startGrid = new THREE.Vector3(
        Math.floor(start.x / 5),
        Math.floor(start.y / 5),
        Math.floor(start.z / 5)
    );

    for (let i = 0; i < buildBlocks.length; i++) {
        // Calculate world position
        tempPos = new THREE.Vector3(
            (buildBlocks[i].pos[0] + startGrid.x) * 5 + 2.5,
            (buildBlocks[i].pos[1] + startGrid.y) * 5 + 2.5,
            (buildBlocks[i].pos[2] + startGrid.z) * 5 + 2.5
        );

        const blockId = blocks[buildBlocks[i].name];
        if (getBlockIdAtPos(tempPos) !== blockId) {
            shiftedPoints.push(tempPos.clone());
            buildBlockIds.push(blockId);

            if (shiftedPoints.length >= chunkSize) {
                yield [shiftedPoints, buildBlockIds];
                shiftedPoints = [];
                buildBlockIds = [];
            }
        }
    }
    if (shiftedPoints.length) {
        yield [shiftedPoints, buildBlockIds];
    }
};

//actors
WorldEdit.set = async function(start, end, blockName) {
    cheatnite.worldedit.inprogress = "set";
    cheatnite.updateCheatDisp = true;

    addCustomChat('WorldEdit', `Setting ${convertCoords(start, "adjusted")} - ${convertCoords(end, "adjusted")} to ${blockName} blocks...`);

    let blockId = blocks[blockName];

    let chunkSize = 30000;
    let generator = this.generatePointsNotOf(start, end, chunkSize, blockId);

    for await (let chunk of generator) {
        await a637(chunk, this.createBlockArr(chunk.length, blockId), ()=>{
            addCustomChat('WorldEdit', 'Stopped //set command.');
        });
        if (!cheatnite.worldedit.inprogress)
            return;
    }

    cheatnite.worldedit.inprogress = false;
    cheatnite.updateCheatDisp = true;
    addCustomChat('WorldEdit', 'Completed //set command.');
}

WorldEdit.setchecker = async function(start, end, blockName) {
    cheatnite.worldedit.inprogress = "setchecker";
    cheatnite.updateCheatDisp = true;
    addCustomChat('WorldEdit', `Creating a checker pattern from ${convertCoords(start, "adjusted")} to ${convertCoords(end, "adjusted")} using ${blockName} blocks...`);

    let blockId = blocks[blockName];

    let chunkSize = 30000;
    let generator = this.generateCheckerPoints(start, end, chunkSize);

    for await (let chunk of generator) {
        await a637(chunk, this.createBlockArr(chunk.length, blockId), ()=>{
            addCustomChat('WorldEdit', 'Stopped //setchecker command.');
        });
        if (!cheatnite.worldedit.inprogress)
            return;
    }

    cheatnite.worldedit.inprogress = false;
    cheatnite.updateCheatDisp = true;
    addCustomChat('WorldEdit', 'Completed //setchecker command.');
}

WorldEdit.replacechecker = async function(start, end, blockIdStart, blockNameEnd) {
    cheatnite.worldedit.inprogress = "replacechecker";
    cheatnite.updateCheatDisp = true;
    addCustomChat('WorldEdit', `Replacing ${BLOCK_CONFIG[blockIdStart].name} with ${blockNameEnd} in a checker pattern from ${convertCoords(start, "adjusted")} to ${convertCoords(end, "adjusted")}...`);

    let blockIdEnd = blocks[blockNameEnd];

    if (blockIdStart === blockIdEnd) {
        cheatnite.worldedit.inprogress = false;
        cheatnite.updateCheatDisp = true;
        addCustomChat('WorldEdit', 'Completed //replacechecker command.');
        return;
    }

    let chunkSize = 30000;

    let generator = this.generateCheckerPointsOf(start, end, chunkSize, blockIdStart);

    for await (let chunk of generator) {
        await a637(chunk, this.createBlockArr(chunk.length, blockIdEnd), () => {
            addCustomChat('WorldEdit', 'Stopped //replacechecker command.');
        });
        if (!cheatnite.worldedit.inprogress)
            return;
    }

    cheatnite.worldedit.inprogress = false;
    cheatnite.updateCheatDisp = true;
    addCustomChat('WorldEdit', 'Completed //replacechecker command.');
}

WorldEdit.palette = async function() {
    cheatnite.worldedit.inprogress = "palette";
    cheatnite.updateCheatDisp = true;
    let playerPos = GAME.a865.player.position.clone();
    addCustomChat('WorldEdit', `Placing all block types at ${convertCoords(playerPos, "adjusted")}...`);

    let chunkSize = 30000;
    let generator = this.generateAllPoints(playerPos, chunkSize);

    for await (let chunk of generator) {
        if (chunk === null) {
            break; // All blocks have been placed
        }
        await a637(chunk[0], chunk[1], ()=>{
            addCustomChat('WorldEdit', 'Stopped //palette command.');
        });
        if (!cheatnite.worldedit.inprogress)
            return;
    }

    cheatnite.worldedit.inprogress = false;
    cheatnite.updateCheatDisp = true;
    addCustomChat('WorldEdit', 'Completed //palette command.');
}

WorldEdit.box = async function(start, end, blockName) {
    cheatnite.worldedit.inprogress = "box";
    cheatnite.updateCheatDisp = true;
    addCustomChat('WorldEdit', `Generating a box from ${convertCoords(start, "adjusted")} to ${convertCoords(end, "adjusted")} using ${blockName} blocks...`);

    let blockId = blocks[blockName];

    let chunkSize = 30000;
    let generator = this.generateBoxPoints(start, end, chunkSize, blockId);

    for await (let chunk of generator) {
        await a637(chunk, this.createBlockArr(chunk.length, blockId), ()=>{
            addCustomChat('WorldEdit', 'Stopped //box command.');
        });
        if (!cheatnite.worldedit.inprogress)
            return;
    }

    cheatnite.worldedit.inprogress = false;
    cheatnite.updateCheatDisp = true;
    addCustomChat('WorldEdit', 'Completed //box command.');
}

WorldEdit.superellipsoid = async function(center, radii, exponent1, exponent2, blockName) {
    cheatnite.worldedit.inprogress = "superellipsoid";
    cheatnite.updateCheatDisp = true;
    addCustomChat('WorldEdit', `Generating a superellipsoid at ${convertCoords(center, "adjusted")} with radii ${JSON.stringify(radii)} and exponents (${exponent1}, ${exponent2}) using ${blockName} blocks...`);

    let blockId = blocks[blockName];

    let chunkSize = 30000;
    let generator = this.generateSuperellipsoidPoints(center, radii, exponent1, exponent2, chunkSize);

    for await (let chunk of generator) {
        await a637(chunk, this.createBlockArr(chunk.length, blockId), () => {
            addCustomChat('WorldEdit', 'Stopped //superellipsoid command.');
        });
        if (!cheatnite.worldedit.inprogress)
            return;
    }

    cheatnite.worldedit.inprogress = false;
    cheatnite.updateCheatDisp = true;
    addCustomChat('WorldEdit', 'Completed //superellipsoid command.');
}

WorldEdit.replace = async function(start, end, blockIdStart, blockNameEnd) {
    cheatnite.worldedit.inprogress = "replace";
    cheatnite.updateCheatDisp = true;
    addCustomChat('WorldEdit', `Replacing ${BLOCK_CONFIG[blockIdStart].name} with ${blockNameEnd} in ${convertCoords(start, "adjusted")} - ${convertCoords(end, "adjusted")}...`);

    let blockIdEnd = blocks[blockNameEnd];

    if (blockIdStart === blockIdEnd) {
        cheatnite.worldedit.inprogress = false;
        cheatnite.updateCheatDisp = true;
        addCustomChat('WorldEdit', 'Completed //replace command.');
        return;
    }

    let chunkSize = 30000;
    let generator = this.generatePointsOf(start, end, blockIdStart, chunkSize);

    for await (let chunk of generator) {
        await a637(chunk, this.createBlockArr(chunk.length, blockIdEnd), ()=>{
            addCustomChat('WorldEdit', 'Stopped //replace command.');
        });
        if (!cheatnite.worldedit.inprogress)
            return;
    }

    cheatnite.worldedit.inprogress = false;
    cheatnite.updateCheatDisp = true;
    addCustomChat('WorldEdit', 'Completed //replace command.');
}

WorldEdit.generateCheckerPointsOf = async function*(pointA, pointB, chunkSize, blockIdStart) {
    let start = new THREE.Vector3(Math.floor(pointA.x / 5), Math.floor(pointA.y / 5), Math.floor(pointA.z / 5));
    let end = new THREE.Vector3(Math.floor(pointB.x / 5), Math.floor(pointB.y / 5), Math.floor(pointB.z / 5));

    let tempPos;
    let points = [];

    for (let x = Math.min(start.x, end.x); x <= Math.max(start.x, end.x); x++) {
        for (let y = Math.min(start.y, end.y); y <= Math.max(start.y, end.y); y++) {
            for (let z = Math.min(start.z, end.z); z <= Math.max(start.z, end.z); z++) {
                if ((x + y + z) % 2 === 0) {
                    tempPos = new THREE.Vector3(x * 5 + 2.5, y * 5 + 2.5, z * 5 + 2.5);

                    // Check block ID at tempPos
                    if (getBlockIdAtPos(tempPos) === blockIdStart) {
                        points.push(tempPos);

                        if (points.length >= chunkSize) {
                            yield points;
                            points = [];
                        }
                    }
                }
            }
        }
        await sleep(10);
        if (!cheatnite.worldedit.inprogress) {
            yield points;
            points = [];
            return;
        }
    }
    if (points.length > 0) {
        yield points;
    }
}

WorldEdit.sphere = async function(centerPoint, blockName, radius) {
    cheatnite.worldedit.inprogress = "sphere";
    cheatnite.updateCheatDisp = true;
    addCustomChat('WorldEdit', `Creating a ${blockName} sphere with center ${convertCoords(centerPoint, "adjusted")} and radius ${radius}...`);

    let blockId = blocks[blockName];

    let chunkSize = 30000;
    let generator = this.generateSpherePoints(centerPoint, radius, chunkSize, blockId);

    for await (let chunk of generator) {
        await a637(chunk, this.createBlockArr(chunk.length, blockId), ()=>{
            addCustomChat('WorldEdit', 'Stopped //sphere command.');
        });
        if (!cheatnite.worldedit.inprogress)
            return;
    }

    cheatnite.worldedit.inprogress = false;
    cheatnite.updateCheatDisp = true;
    addCustomChat('WorldEdit', 'Completed //sphere command.');
}

WorldEdit.hollowSphere = async function(centerPoint, blockName, radius) {
    cheatnite.worldedit.inprogress = "hollow sphere";
    cheatnite.updateCheatDisp = true;
    addCustomChat('WorldEdit', `Creating a ${blockName} hollow sphere with center ${convertCoords(centerPoint, "adjusted")} and radius ${radius}...`);

    let blockId = blocks[blockName];

    let chunkSize = 30000;
    let generator = this.generateHollowSpherePoints(centerPoint, radius, chunkSize, blockId);

    for await (let chunk of generator) {
        await a637(chunk, this.createBlockArr(chunk.length, blockId), ()=>{
            addCustomChat('WorldEdit', 'Stopped //hsphere command.');
        });
        if (!cheatnite.worldedit.inprogress)
            return;
    }

    cheatnite.worldedit.inprogress = false;
    cheatnite.updateCheatDisp = true;
    addCustomChat('WorldEdit', 'Completed //hsphere command.');
}

WorldEdit.line = async function(pos1, pos2, blockName, radius) {
    cheatnite.worldedit.inprogress = "line";
    cheatnite.updateCheatDisp = true;
    addCustomChat('WorldEdit', `Creating a ${blockName} line from ${convertCoords(pos1, "adjusted")} to ${convertCoords(pos2, "adjusted")} with radius ${radius}...`);

    let blockId = blocks[blockName];
    let chunkSize = 30000;
    let generator = this.generateLinePoints(pos1, pos2, radius, chunkSize, blockId);

    for await (let chunk of generator) {
        await a637(chunk, this.createBlockArr(chunk.length, blockId), () => {
            addCustomChat('WorldEdit', 'Stopped //line command.');
        });
        if (!cheatnite.worldedit.inprogress)
            return;
    }

    cheatnite.worldedit.inprogress = false;
    cheatnite.updateCheatDisp = true;
    addCustomChat('WorldEdit', 'Completed //line command.');
}

WorldEdit.copy = async function(start, end) {
    addCustomChat('WorldEdit', `Saving volume ${convertCoords(start, "adjusted")} - ${convertCoords(end, "adjusted")} to clipboard...`);
    cheatnite.worldedit.clipboard = await this.copyChunks(start, end);
    addCustomChat('WorldEdit', 'Saved volume to clipboard.');
}

WorldEdit.hollowLine = async function(pos1, pos2, blockName, radius) {
    cheatnite.worldedit.inprogress = "hollow line";
    cheatnite.updateCheatDisp = true;
    addCustomChat('WorldEdit', `Creating a ${blockName} hollow line from ${convertCoords(pos1, "adjusted")} to ${convertCoords(pos2, "adjusted")} with radius ${radius}...`);

    let blockId = blocks[blockName];
    let chunkSize = 30000;
    let generator = this.generateHollowLinePoints(pos1, pos2, radius, chunkSize, blockId);

    for await (let chunk of generator) {
        await a637(chunk, this.createBlockArr(chunk.length, blockId), () => {
            addCustomChat('WorldEdit', 'Stopped //hline command.');
        });
        if (!cheatnite.worldedit.inprogress)
            return;
    }

    cheatnite.worldedit.inprogress = false;
    cheatnite.updateCheatDisp = true;
    addCustomChat('WorldEdit', 'Completed //hline command.');
}

//needs to be converted to new system
WorldEdit.paste = async function(start) {
    cheatnite.worldedit.inprogress = "paste";
    cheatnite.updateCheatDisp = true;
    addCustomChat('WorldEdit', `Pasting clipboard at ${convertCoords(start || cheatnite.worldedit.clipboard[0], "adjusted")}...`);

    let chunkSize = 30000;
    let generator = this.generatePointsFromClipboard(chunkSize, start);

    for await (const [x, y, z, insidePos, blockIds] of generator) {
        await rawa637(x, y, z, insidePos, blockIds, ()=>{
            addCustomChat('WorldEdit', 'Stopped //paste command.');
        })
        if (!cheatnite.worldedit.inprogress)
            return;
    }

    cheatnite.worldedit.inprogress = false;
    cheatnite.updateCheatDisp = true;
    addCustomChat('WorldEdit', 'Pasted volume.');
}

WorldEdit.build = async function(buildName, start) {
    cheatnite.worldedit.inprogress = "build";
    cheatnite.updateCheatDisp = true;
    addCustomChat('WorldEdit', `Building ${buildName} at ${convertCoords(start, "adjusted")}...`);

    let chunkSize = 30000;
    let generator = this.generatePointsFromBuild(buildName, start, chunkSize);

    for await (let chunk of generator) {
        await a637(chunk[0], chunk[1], ()=>{
            addCustomChat('WorldEdit', 'Stopped /b command.');
        });
        if (!cheatnite.worldedit.inprogress)
            return;
    }

    cheatnite.worldedit.inprogress = false;
    cheatnite.updateCheatDisp = true;
    addCustomChat('WorldEdit', 'Finished building '+buildName+'.');
}
//utils
WorldEdit.error = function(msg) {
    addCustomChat('WorldEdit.Error', msg);
}

WorldEdit.createBlockArr = function(len, blockId) {
    if (typeof(blockId) === 'number') {
        // BlockId is a number, returning an array filled with this blockId (e.g., "stone" -> 0).
        return Array(len).fill(blockId);
    } else if (blockId === 'random') {
        // If the blockId is "random", fill the array with random values from printblocks (excluding 0s if needed).
        const filteredKeys = Object.keys(printblocks).filter(key => parseInt(key) !== 0);
        const arr = Array.from({ length: len }, () => {
            return parseInt(filteredKeys[Math.floor(Math.random() * filteredKeys.length)]);
        });
        return arr;
    } else if (blockId === 'items') {
        // If blockId is "items", use the 'items' object to fill the array in a cycling order.
        const itemKeys = Object.keys(itemblocks);
        const arr = Array.from({ length: len }, (_, index) => {
            const itemKey = itemKeys[index % itemKeys.length];
            return itemblocks[itemKey];  // Get the ID from 'items'
        });
        return arr;
    } else {
        // Default behavior for unknown blockId: try to use blocks or fall back to 'random'
        if (blocks[blockId]) {
            return Array(len).fill(blocks[blockId]);
        } else {
            const filteredKeys = Object.keys(printblocks).filter(key => parseInt(key) !== 0);
            const arr = Array.from({ length: len }, () => {
                return parseInt(filteredKeys[Math.floor(Math.random() * filteredKeys.length)]);
            });
            return arr;
        }
    }
}

/*
COORDS DISPLAY
and, well, random checks
*/

setInterval(() => {
    if (typeof(GAME) !== 'undefined' && GAME?.a865?.player?.position && GAME?.loadingUI.hidden == true) {
        let me = GAME.a865.player;
        let bottomright = document.getElementById('bottomright');
        bottomright.style.display = 'block';
        if (!me.dead) {
            cheatnite.coords = convertCoords(me.position, "adjusted");
            bottomright.textContent = `(${cheatnite.coords.x.toFixed(1)}, ${cheatnite.coords.y.toFixed(1)}, ${cheatnite.coords.z.toFixed(1)})`;
            if (GAME?.oceanHeightTo) {
                cheatnite.drain = cheatnite.coords.y < 10;
                GAME.oceanHeightTo = cheatnite.drain ? -10000 : 317;
            }

            if (GAME.myKillerId && !G.othera822ers.some((p) => p?.ID === GAME.myKillerId))
                GAME.myKillerId = null;
        } else {
            var newPos = G.othera822ers?.[GAME.myKillerId]?.position || me.position;
            let coords = convertCoords(newPos, "adjusted");
            bottomright.textContent = `(${coords.x.toFixed(1)}, ${coords.y.toFixed(1)}, ${coords.z.toFixed(1)})`;
        }

        if (cheatnite.updateCheatDisp) {
            //cheat display code inspired by https://greasyfork.org/en/scripts/474923-craftnite-io-hacked-client-fly-triggerbot-esp-rapidfire-speedhacks-and-more
            var textArr = cheatnite.activatedCheats;
            textArr.sort((a, b) => a.length - b.length);
            textArr = textArr.slice(0);
            if (cheatnite.customBlockId !== 256)
                textArr.push(`Item: ${BLOCK_CONFIG[cheatnite.customBlockId]?.name || cheatnite.customBlockId}`);
            if (cheatnite.worldedit.inprogress)
                textArr.push(`WorldEdit: ${cheatnite.worldedit.inprogress}`);
            var coloredTextArr = textArr.map(function(text, index) {
              return '<span style="color: ' + getColor(index, textArr.length) + '">' + text.toUpperCase() + '</span>';
            });
            cheatnite.cheatDisp.innerHTML = coloredTextArr.join('<br>');
            cheatnite.updateCheatDisp = false;

            cheatnite.cheatDisp.style.top = (document.documentElement.clientHeight + bottomright.clientHeight*0.5 - (26*textArr.length)) + "px";
        }
    }

    //random annoying ad stuff
    var extra = document.getElementsByClassName('truepush_optin_notifications');
    if (extra.length)
        extra[0].remove();
}, 50);

/*
ESP
*/
function initEsp() {
    espGeometry = new THREE.EdgesGeometry(new THREE.BoxGeometry(5, 10, 5).translate(0, -3, 0));
    lineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });

    red = `
        void main() {
            gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
        }
    `;
    espMaterial = new THREE.RawShaderMaterial({
        vertexShader: `
        attribute vec3 position;
        uniform mat4 projectionMatrix;
        uniform mat4 modelViewMatrix;
        void main() {
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
            gl_Position.z = 1.0;
        }
        `,
        fragmentShader: red
    });
    textCanvas = new G.Canvas2d();
    textCanvas.alpha = 0;
    textCanvas.init();
}

function animate() {
    window.requestAnimationFrame(animate);
    const players = [];

    for (const p of G.othera822ers)
        if (p && p.id && p.id !== GAME.a865.player.id)
            players.push(p);

    textCanvas.clear();
    const drawnTextPositions = [];
    const minSpacing = 4;
    const textOffset = 24;

    for (let i = 0; i < players.length; i++) {
        const player = players[i];
        if (!player.a472.box) {
            const box = new THREE.LineSegments(espGeometry, espMaterial);
            box.frustumCulled = false;
            player.a472.add(box);
            player.a472.box = box;
        }

        player.a472.box.visible = cheatnite.esp;

        if (player.a472.visible && cheatnite.esp) {
            const worldPos = new THREE.Vector3();
            player.a472.box.getWorldPosition(worldPos);

            let screenPos = G.worldPosToScreenCoords(worldPos, GAME.camera, window.innerWidth, window.innerHeight);
            if (screenPos.orientation !== 'center')
                continue;

            let playerName = `(${player.id}) ` + (player.name.length > 20 ? player.name.substring(0, 17) + '...' : player.name);
            let color = "#FFFFFF";
            if (player.ID === GAME.myKillerId) {
                playerName = '(killer) '+playerName;
                color = "#FF8080";
            }
            const textSize = 16;

            let yPos = screenPos.coords.y - 10;
            for (const drawnPos of drawnTextPositions) {
                if (Math.abs(drawnPos.x - screenPos.coords.x) < textSize && Math.abs(drawnPos.y - yPos) < textSize) {
                    yPos = drawnPos.y - textSize - minSpacing;
                }
            }
            drawnTextPositions.push({ x: screenPos.coords.x, y: yPos });

            textCanvas.text(
                [screenPos.coords.x, yPos],
                playerName,
                color,
                textSize,
                "middle",
                "center"
            );
        }
    }
    textCanvas.flip();
}

/*
WEBSOCKET
*/
//incoming websocket msgs
let checkInterval = setInterval(() => {
    if (typeof(G) !== 'undefined' && typeof(G.socket) !== 'undefined' && G.socket !== null && G.socket.binaryType == "arraybuffer") {
        clearInterval(checkInterval);

        // Secure WebSocket Proxy
        G.socket.onmessage = new Proxy(G.socket.onmessage || function(){}, {
            apply: function (target, scope, args) {
                try {
                    var i = new DataView(args[0].data);
                    let opcode = i.getUint8(0);

                    // CUSTOM CHECK: Prevent crash if invalid opcode
                    if (typeof opcode !== "number" || isNaN(opcode)) {
                        console.warn("⚠️ Invalid Opcode Detected:", opcode);
                        return; // Ignore & stop processing this message
                    }

                    // Anti-crash validation before executing game handlers
                    if (opcode === 19) {
                        onDeath(i);
                    } else if (opcode === G.a823?.RPCMatchRemainingTime) {
                        var c, ratio;
                        (c = new RPCMatchRemainingTime).a615(i);
                        if (!cheatnite.server.time) {
                            cheatnite.server.r = 3;
                        } else {
                            ratio = (Date.now() - cheatnite.server.time) / 1000;
                            if (ratio >= 1) cheatnite.server.r = ratio;
                        }
                        cheatnite.server.time = Date.now();
                    }

                    // **CATCH ERRORS BEFORE GAME HANDLES IT**
                    let data = target.apply(scope, args);
                    return data;
                } catch (err) {
                    console.warn("🚨 Blocked Malicious WebSocket Message!", err);
                    return; // Ignore & do not pass bad data to the game
                }
            }
        });

        console.log("✅ Anti-Cheat WebSocket Filter Active.");
    }
}, 1000);

//outgoing websocket msgs
WebSocket.prototype.send = new Proxy(WebSocket.prototype.send, {
    apply: function (target, scope, args) {
        var dataView = new DataView(args[0]);
        let opcode = dataView.getUint8(0);

        if (opcode == 27) {
            let blockName, thickess, radius, pID, pkt, player;
            let me = GAME.a865.player;
            let adjustedCoords = `(${cheatnite.coords.x.toFixed(0)}, ${cheatnite.coords.y.toFixed(0)}, ${cheatnite.coords.z.toFixed(0)})`
            let msg = parseOutgoingChat(dataView);
            if (msg.startsWith('/')) {
                addCustomChat('$', msg)
                let splitMsg = msg.split(' ').filter(word => word !== '');
                let cmd = splitMsg[0].substr(1).toLowerCase();
                let args = splitMsg.slice(1);
                switch(cmd) {
                    //REGULAR cmds
                    case 'truecoords':
                        addCustomChat('<', `(${(me.position.x).toFixed(1)}, ${(me.position.y).toFixed(1)}, ${(me.position.z).toFixed(1)})`)
                        break;
                    case 'ignore':
                        pID = parseInt(args[0]);
                        if (!isNaN(pID)) {
                            if (!cheatnite.ignored.includes(pID)) {
                                cheatnite.ignored.push(pID);
                                addCustomChat('<', `Ignored player with ID ${pID}`);
                            } else {
                                addCustomChat('Error', `Player ID ${pID} is already ignored.`);
                            }
                        } else {
                            addCustomChat('Error', 'A number is expected as an argument (the player\'s ID).');
                        }
                        break;
                    case 'unignore':
                        pID = parseInt(args[0]);
                        if (!isNaN(pID)) {
                            if (cheatnite.ignored.includes(pID)) {
                                cheatnite.ignored = cheatnite.ignored.filter(item => item !== pID);
                                addCustomChat('<', `Unignored player with ID ${pID}`);
                            } else {
                                addCustomChat('Error', `Player ID ${pID} is not in ignored list.`);
                            }
                        } else {
                            addCustomChat('Error', 'A number is expected as an argument (the player\'s ID).');
                        }
                        break;
                    case 'unstuck':
                        G.a597.rebound.enabled = true;
                        addCustomChat('<', 'Unstuck.');
                        break
                    case 'drain':
                        cheatnite.drain = !cheatnite.drain;
                        GAME.oceanHeightTo = cheatnite.drain ? -10000 : 317;
                        addCustomChat('<', cheatnite.drain ? 'Ocean gone (for client).' : 'Ocean is back.');
                        break;
                    case 'ocean':
                        cheatnite.ocean = !cheatnite.ocean;
                        GAME.oceanPlane.position.y = cheatnite.ocean ? -100 : 317;
                        addCustomChat('<', cheatnite.ocean ? 'Ocean set to -100 (for client).' : 'Ocean is back to normal.');
                        break;
                    case 'item':
                        if (args.length === 0) {
                            cheatnite.customBlockId = getLookAtBlockId();
                        } else if (checkInt(args[0]) && Object.keys(BLOCK_CONFIG).includes(args[0])) {
                            cheatnite.customBlockId = parseInt(args[0]);
                        } else if (Object.keys(blocks).includes(args[0].toLowerCase())) {
                            cheatnite.customBlockId = blocks[args[0].toLowerCase()];
                        } else {
                            addCustomChat('Error', `Block ${args[0]} does not exist.`);
                            return;
                        }

                        if (!cheatnite.customBlockId) {
                            //if not looking at a block / set air block
                            addCustomChat('<', 'Reset stone items.');
                            return;
                        }

                        var stoneNeeded = 1000 - countItemInInv("stone");
                        if (stoneNeeded > 0) {
                            GAME.a865.player.a458("stone", stoneNeeded);
                        }

                        addCustomChat('<', `Thrown stone set to ${BLOCK_CONFIG[cheatnite.customBlockId]?.name || cheatnite.customBlockId}.`);
                        break;
                    case 'invsize':
                        if (args.length === 0) {
                            GAME.a865.player.totalShorta843 = 4;
                            addCustomChat('<', 'Inventory size reset.')
                        } else if (checkInt(args[0]) && parseInt(args[0])>=0 && parseInt(args[0])<=35) {
                            GAME.a865.player.totalShorta843 = parseInt(args[0]);
                            addCustomChat('<', 'Inventory size set to '+args[0]+'.')
                        } else {
                            addCustomChat('Error', 'Invalid input. Expected an integer between 0 and 35, inclusive.')
                        }
                        break;
                    case 'tp':
                        if (args.length === 1) {
                            // Attempt to parse the argument as a player ID
                            let pID = parseInt(args[0]);
                            if (!isNaN(pID)) {
                                // Find the player with the given ID
                                let player = G.othera822ers.find(p => p?.id === pID);
                                if (!player) {
                                    addCustomChat('Error', `Player with ID ${pID} not found.`);
                                    return;
                                }
                                // Teleport to the player's position
                                tp(player.position);
                                addCustomChat('>', `Teleported to player ${player.id}.`);
                            } else {
                                addCustomChat('Error', 'A number is expected as an argument (the player\'s ID).');
                            }
                        } else if (args.length === 3) {
                            // Check that all three arguments are numbers
                            let nums = checkNumsInArr(args, 3);
                            if (!nums) {
                                addCustomChat('Error', 'Numbers expected as coordinates.');
                                return;
                            }
                            // Create a vector from the input coordinates
                            let unadjusted = new THREE.Vector3(nums[0], nums[1], nums[2]);
                            // Convert adjusted coordinates to true game coordinates
                            let trueCoords = convertCoords(unadjusted, "true");
                            // Teleport to the specified coordinates
                            tp(trueCoords);
                            addCustomChat('>', `Teleported to coordinates (${nums[0]}, ${nums[1]}, ${nums[2]}).`);
                        } else {
                            addCustomChat('Error', `Expected 1 or 3 arguments, got ${args.length}.`);
                        }
                        break;
                    case 'time':
                        if (args.length < 2 || args[0].toLowerCase() !== 'set') {
                            addCustomChat('Error', 'Expected at 2 args: set and (day/night).')
                            return;
                        }
                        if (args[1].toLowerCase() === 'night') {
                            cheatnite.darkMode = true;
                            G.CONFIG.a133 = new THREE.Color("rgb(0, 0, 0)");
                        } else {
                            cheatnite.darkMode = false;
                            G.CONFIG.a133 = G.CONFIG.a134;

                        }
                        GAME.updatea668(false);
                        addCustomChat('<', `Time set to ${cheatnite.darkMode ? 'night' : 'day'}.`);
                        break;
                    case 'bgcolor':
                        if (args.length < 1) {
                            addCustomChat('Error', 'Expected 1 arg: hex color value (e.g., #RRGGBB).');
                            return;
                        }
                        const hexColor = args[0];
                        if (!/^#[0-9A-Fa-f]{6}$/.test(hexColor)) {
                            addCustomChat('Error', 'Invalid hex color format. Use #RRGGBB.');
                            return;
                        }
                        G.CONFIG.a133 = new THREE.Color(hexColor);
                        GAME.updatea668(false);
                        addCustomChat('<', `Background color set to ${hexColor}.`);
                        break;
                    case 'bg':
                        if (args.length) {
                            if (isURL(args[0])) {
                                addCustomChat('<', 'Loading background image from url...');
                                loadBackgroundTexture(args[0]);
                            }
                            return;
                        }

                        //upload
                        var input = document.createElement('input');
                        input.type = 'file';
                        input.onchange = (event) => {
                            addCustomChat('<', 'Loading background image from file...');
                            const file = event.target.files[0];
                            const reader = new FileReader();

                            reader.onload = (event) => {
                                loadBackgroundTexture(event.target.result);
                            };

                            reader.readAsDataURL(file);
                        };
                        input.click();

                        break;

                    case 'texture':
                        if (args.length) {
                            if (isURL(args[0])) {
                                addCustomChat('<', 'Loading world texture from url...');
                                loadWorldTexture(args[0]);
                            }
                            return;
                        }

                        //upload
                        var input = document.createElement('input');
                        input.type = 'file';
                        input.onchange = (event) => {
                            addCustomChat('<', 'Loading world texture from file...');
                            const file = event.target.files[0];
                            const reader = new FileReader();

                            reader.onload = (event) => {
                                loadWorldTexture(event.target.result);
                            };

                            reader.readAsDataURL(file);
                        };
                        input.click();

                        break;

                        function loadBackgroundTexture(url) {
                            const textureLoader = new THREE.TextureLoader();
                            textureLoader.load(url, (texture) => {
                                const sphereGeometry = new THREE.SphereBufferGeometry(16e3, 32, 15);
                                const texturedMaterial = new THREE.MeshBasicMaterial({
                                    map: texture,
                                    side: THREE.BackSide,
                                });

                                const skybox = new THREE.Mesh(sphereGeometry, texturedMaterial);
                                GAME.scene.add(skybox);
                                addCustomChat('<', 'Background image set!');
                            });
                        }

                        function loadWorldTexture(url) {
                            const textureLoader = new THREE.TextureLoader();
                            textureLoader.load(url, (texture) => {
                                texture.magFilter = THREE.NearestFilter;
                                texture.minFilter = THREE.NearestMipmapLinearFilter;

                                // Update the uniforms
                                GAME.uniforms.texture1.value = texture;

                                // Update materials
                                GAME.assets[GAME.a836.Material].a643SolidMaterial.needsUpdate = true;
                                GAME.assets[GAME.a836.Material].a643TransparentMaterial.needsUpdate = true;
                                texture.needsUpdate = true;

                                addCustomChat('<', 'World texture set!');
                            });
                        }
                        //upload
                        var input = document.createElement('input');
                        input.type = 'file';
                        input.onchange = (event) => {
                            addCustomChat('<', 'Loading background image from file...');
                            const file = event.target.files[0];
                            const reader = new FileReader();

                            reader.onload = (event) => {
                                const textureLoader = new THREE.TextureLoader();
                                textureLoader.load(event.target.result, (texture) => {
                                    const sphereGeometry = new THREE.SphereBufferGeometry(16e3, 32, 15);
                                    const texturedMaterial = new THREE.MeshBasicMaterial({
                                        map: texture,
                                        side: THREE.BackSide,
                                    });

                                    const skybox = new THREE.Mesh(sphereGeometry, texturedMaterial);
                                    GAME.scene.add(skybox);
                                    addCustomChat('<', 'Background image set!');
                                });
                            };

                            reader.readAsDataURL(file);
                        };
                        input.click();

                        break;

                    //WORLDEDIT cmds
                    case '1':
                        WorldEdit.pos1(args);
                        break;
                    case '2':
                        WorldEdit.pos2(args);
                        break;
                    case 'pos1':
                        WorldEdit.pos1(args);
                        break;
                    case 'pos2':
                        WorldEdit.pos2(args);
                        break;
                    case 'set':{
                        if (cheatnite.worldedit.inprogress) {
                            WorldEdit.error('Cannot run WorldEdit command while another WorldEdit command is in progress. Run //stop to stop current running WorldEdit command.');
                            return;
                        }
                        if (!cheatnite.worldedit.pos1 || !cheatnite.worldedit.pos2) {
                            WorldEdit.error('You must set //pos1 and //pos2 before running this worldedit command.');
                            return;
                        }
                        if (args.length === 0) {
                            WorldEdit.error('Expected 1 argument, got 0.');
                            return;
                        }

                        let blockName = args[0].toLowerCase();
                        if (!Object.keys(blocks).includes(blockName)) {
                            WorldEdit.error(`Block ${blockName} does not exist.`);
                            return;
                        }

                        WorldEdit.set(cheatnite.worldedit.pos1.clone(), cheatnite.worldedit.pos2.clone(), blockName)
                    }break;
                    case 'setchecker':{
                        if (cheatnite.worldedit.inprogress) {
                            WorldEdit.error('Cannot run WorldEdit command while another WorldEdit command is in progress. Run //stop to stop current running WorldEdit command.');
                            return;
                        }
                        if (!cheatnite.worldedit.pos1 || !cheatnite.worldedit.pos2) {
                            WorldEdit.error('You must set //pos1 and //pos2 before running this worldedit command.');
                            return;
                        }
                        if (args.length === 0) {
                            WorldEdit.error('Expected 1 argument, got 0.');
                            return;
                        }

                        blockName = args[0].toLowerCase();
                        if (!Object.keys(blocks).includes(blockName)) {
                            WorldEdit.error(`Block ${blockName} does not exist.`);
                            return;
                        }

                        WorldEdit.setchecker(cheatnite.worldedit.pos1.clone(), cheatnite.worldedit.pos2.clone(), blockName)

                    }break;
                    case 'setgrid':{
                        if (cheatnite.worldedit.inprogress) {
                            WorldEdit.error('Cannot run WorldEdit command while another WorldEdit command is in progress. Run //stop to stop current running WorldEdit command.');
                            return;
                        }
                        if (!cheatnite.worldedit.pos1 || !cheatnite.worldedit.pos2) {
                            WorldEdit.error('You must set //pos1 and //pos2 before running this WorldEdit command.');
                            return;
                        }
                        if (args.length < 2) {
                            WorldEdit.error(`Expected 2 arguments (block name and distance), got ${args.length}.`);
                            return;
                        }

                        blockName = args[0].toLowerCase();
                        if (!Object.keys(blocks).includes(blockName)) {
                            WorldEdit.error(`Block ${blockName} does not exist.`);
                            return;
                        }

                        let distance = parseInt(args[1]);
                        if (isNaN(distance) || distance <= 0) {
                            WorldEdit.error(`Invalid distance '${args[1]}'. Distance must be a positive integer.`);
                            return;
                        }

                        WorldEdit.setgrid(cheatnite.worldedit.pos1.clone(), cheatnite.worldedit.pos2.clone(), blockName, distance);
                    }break;
                    case 'lock':
                        if (!cheatnite.worldedit.pos1 || !cheatnite.worldedit.pos2) {
                            WorldEdit.error('Please select a region first using //pos1 and //pos2.');
                            return;
                        }
                        if (cheatnite.worldedit.inprogress) {
                            WorldEdit.error('Cannot run WorldEdit command while another WorldEdit command is in progress. Run //stop to stop current running WorldEdit command.');
                            return;
                        }
                        WorldEdit.lock(cheatnite.worldedit.pos1, cheatnite.worldedit.pos2);
                        break;

                    case 'unlock':
                        if (!cheatnite.worldedit.lockedRegions || cheatnite.worldedit.lockedRegions.length === 0) {
                            WorldEdit.error('No locked regions to unlock.');
                            return;
                        }
                        WorldEdit.unlock();
                        break;
                    case 'palette':
                        if (cheatnite.worldedit.inprogress) {
                            WorldEdit.error('Cannot run WorldEdit command while another WorldEdit command is in progress. Run //stop to stop current running WorldEdit command.');
                            return;
                        }

                        WorldEdit.palette();

                        break;
                    case 'box':
                        if (cheatnite.worldedit.inprogress) {
                            WorldEdit.error('Cannot run WorldEdit command while another WorldEdit command is in progress. Run //stop to stop current running WorldEdit command.');
                            return;
                        }
                        if (!cheatnite.worldedit.pos1 || !cheatnite.worldedit.pos2) {
                            WorldEdit.error('You must set //pos1 and //pos2 before running this worldedit command.');
                            return;
                        }
                        if (args.length === 0) {
                            WorldEdit.error('Expected 1 argument, got 0.');
                            return;
                        }

                        blockName = args[0].toLowerCase();
                        if (!Object.keys(blocks).includes(blockName)) {
                            WorldEdit.error(`Block ${blockName} does not exist.`);
                            return;
                        }

                        WorldEdit.box(cheatnite.worldedit.pos1.clone(), cheatnite.worldedit.pos2.clone(), blockName);

                        break;
                    case 'superellipsoid': {
                        if (cheatnite.worldedit.inprogress) {
                            WorldEdit.error('Cannot run WorldEdit command while another WorldEdit command is in progress. Run //stop to stop the current running WorldEdit command.');
                            return;
                        }
                        if (!cheatnite.worldedit.pos1) {
                            WorldEdit.error('You must set //pos1 as the center before running this WorldEdit command.');
                            return;
                        }

                        if (args.length < 6) {
                            WorldEdit.error('Expected 6 arguments: radiiX radiiY radiiZ exponent1 exponent2 blockName');
                            return;
                        }

                        let radiiX = parseFloat(args[0]);
                        let radiiY = parseFloat(args[1]);
                        let radiiZ = parseFloat(args[2]);
                        let exponent1 = parseFloat(args[3]);
                        let exponent2 = parseFloat(args[4]);
                        let blockName = args[5].toLowerCase();

                        if (isNaN(radiiX) || isNaN(radiiY) || isNaN(radiiZ)) {
                            WorldEdit.error('Radii must be valid numbers.');
                            return;
                        }

                        if (isNaN(exponent1) || isNaN(exponent2)) {
                            WorldEdit.error('Exponents must be valid numbers.');
                            return;
                        }

                        if (!Object.keys(blocks).includes(blockName)) {
                            WorldEdit.error(`Block "${blockName}" does not exist.`);
                            return;
                        }

                        let center = cheatnite.worldedit.pos1.clone();
                        let radii = { x: radiiX, y: radiiY, z: radiiZ };

                        WorldEdit.superellipsoid(center, radii, exponent1, exponent2, blockName);
                        break;
                    }

                        // ... other cases ...
                        break;
                    case 'r': //replace
                        if (cheatnite.worldedit.inprogress) {
                            WorldEdit.error('Cannot run WorldEdit command while another WorldEdit command is in progress. Run //stop to stop current running WorldEdit command.');
                            return;
                        }
                        if (!cheatnite.worldedit.pos1 || !cheatnite.worldedit.pos2) {
                            WorldEdit.error('You must set //pos1 and //pos2 before running this worldedit command.');
                            return;
                        }
                        if (args.length == 0) {
                            WorldEdit.error('Expected at least 1 argument, got 0.');
                            return;
                        }

                        // Get the starting block ID (block to replace)
                        var blockIdStart = getLookAtBlockId();
                        if (blockIdStart === undefined || blockIdStart === null) {
                            // Default block ID is air if no block is being looked at
                            blockIdStart = 0;
                        }

                        // Get the ending block name (block to replace with)
                        var blockNameEnd = args[0].toLowerCase();
                        if (!Object.keys(blocks).includes(blockNameEnd)) {
                            WorldEdit.error(`Block "${blockNameEnd}" does not exist.`);
                            return;
                        }

                        // Check for optional "checker" argument
                        if (args.length >= 2 && args[1].toLowerCase() === 'checker') {
                            // Use the replacechecker function
                            WorldEdit.replacechecker(
                                cheatnite.worldedit.pos1.clone(),
                                cheatnite.worldedit.pos2.clone(),
                                blockIdStart,
                                blockNameEnd
                            );
                        } else {
                            // Use the standard replace function
                            WorldEdit.replace(
                                cheatnite.worldedit.pos1.clone(),
                                cheatnite.worldedit.pos2.clone(),
                                blockIdStart,
                                blockNameEnd
                            );
                        }

                        break;
                    case 'sphere':
                        if (cheatnite.worldedit.inprogress) {
                            WorldEdit.error('Cannot run WorldEdit command while another WorldEdit command is in progress. Run //stop to stop current running WorldEdit command.');
                            return;
                        }
                        if (!cheatnite.worldedit.pos1 && !cheatnite.worldedit.pos2) {
                            WorldEdit.error('You must set //pos1 or //pos2 before running this worldedit command.');
                            return;
                        }
                        if (args.length === 0) {
                            WorldEdit.error('Expected at 2 arguments, got 0.');
                            return;
                        }

                        blockName = args[0].toLowerCase();
                        if (!Object.keys(blocks).includes(blockName)) {
                            WorldEdit.error(`Block ${blockName} does not exist.`);
                            return;
                        }

                        radius = parseInt(args[1]);
                        if (!radius) {
                            WorldEdit.error(`Invalid radius ${radius}`);
                            return;
                        }

                        WorldEdit.sphere((cheatnite.worldedit.pos1 || cheatnite.worldedit.pos2).clone(), blockName, radius);

                        break;
                    case 'hsphere':
                        if (cheatnite.worldedit.inprogress) {
                            WorldEdit.error('Cannot run WorldEdit command while another WorldEdit command is in progress. Run //stop to stop current running WorldEdit command.');
                            return;
                        }
                        if (!cheatnite.worldedit.pos1 && !cheatnite.worldedit.pos2) {
                            WorldEdit.error('You must set //pos1 or //pos2 before running this worldedit command.');
                            return;
                        }
                        if (args.length === 0) {
                            WorldEdit.error('Expected at 2 arguments, got 0.');
                            return;
                        }

                        blockName = args[0].toLowerCase();
                        if (!Object.keys(blocks).includes(blockName)) {
                            WorldEdit.error(`Block ${blockName} does not exist.`);
                            return;
                        }

                        radius = parseInt(args[1]);
                        if (!radius) {
                            WorldEdit.error(`Invalid radius ${radius}`);
                            return;
                        }

                        WorldEdit.hollowSphere((cheatnite.worldedit.pos1 || cheatnite.worldedit.pos2).clone(), blockName, radius);

                        break;
                    case 'line':
                        if (cheatnite.worldedit.inprogress) {
                            WorldEdit.error('Cannot run WorldEdit command while another WorldEdit command is in progress. Run //stop to stop current running WorldEdit command.');
                            return;
                        }
                        if (!cheatnite.worldedit.pos1 || !cheatnite.worldedit.pos2) {
                            WorldEdit.error('You must set both //pos1 and //pos2 before running this WorldEdit command.');
                            return;
                        }
                        if (args.length < 2) {
                            WorldEdit.error('Expected at least 2 arguments (block name and radius). Example usage: /line stone 5');
                            return;
                        }

                        blockName = args[0].toLowerCase();
                        if (!Object.keys(blocks).includes(blockName)) {
                            WorldEdit.error(`Block '${blockName}' does not exist.`);
                            return;
                        }

                        radius = parseInt(args[1]);
                        if (isNaN(radius)) {
                            WorldEdit.error(`Invalid radius '${args[1]}'. Radius must be a number.`);
                            return;
                        }

                        WorldEdit.line(cheatnite.worldedit.pos1.clone(), cheatnite.worldedit.pos2.clone(), blockName, radius);
                        break;
                    case 'hline':
                        if (cheatnite.worldedit.inprogress) {
                            WorldEdit.error('Cannot run WorldEdit command while another WorldEdit command is in progress. Run //stop to stop current running WorldEdit command.');
                            return;
                        }
                        if (!cheatnite.worldedit.pos1 || !cheatnite.worldedit.pos2) {
                            WorldEdit.error('You must set both //pos1 and //pos2 before running this WorldEdit command.');
                            return;
                        }
                        if (args.length < 2) {
                            WorldEdit.error('Expected at least 2 arguments (block name and radius). Example usage: /hline stone 5');
                            return;
                        }

                        blockName = args[0].toLowerCase();
                        if (!Object.keys(blocks).includes(blockName)) {
                            WorldEdit.error(`Block ${blockName} does not exist.`);
                            return;
                        }

                        radius = parseInt(args[1]);
                        if (!radius) {
                            WorldEdit.error(`Invalid radius ${args[1]}`);
                            return;
                        }

                        WorldEdit.hollowLine(cheatnite.worldedit.pos1.clone(), cheatnite.worldedit.pos2.clone(), blockName, radius);

                        break;
                    case 'copy':
                        if (cheatnite.worldedit.inprogress) {
                            WorldEdit.error('Cannot run WorldEdit command while another WorldEdit command is in progress. Run //stop to stop current running WorldEdit command.');
                            return;
                        }
                        if (!cheatnite.worldedit.pos1 || !cheatnite.worldedit.pos2) {
                            WorldEdit.error('You must set //pos1 and //pos2 before running this worldedit command.');
                            return;
                        }

                        WorldEdit.copy(cheatnite.worldedit.pos1.clone(), cheatnite.worldedit.pos2.clone());

                        break;
                    case 'paste':
                        if (cheatnite.worldedit.inprogress) {
                            WorldEdit.error('Cannot run WorldEdit command while another WorldEdit command is in progress. Run //stop to stop current running WorldEdit command.');
                            return;
                        }
                        if (!cheatnite.worldedit.clipboard[0]) {
                            WorldEdit.error('Nothing is copied to clipboard.');
                            return;
                        }
                        if (args.length && args[0].toLowerCase() === 'original') {
                            WorldEdit.paste(null);
                        } else {
                            WorldEdit.paste(GAME.a865.player.position.clone());
                        }

                        break;
                    case 'clearclipboard':
                        cheatnite.worldedit.clipboard = [null, null, {}];
                        addCustomChat('WorldEdit', 'Cleared clipboard.');
                        break;
                    case 's':
                        if (!cheatnite.worldedit.inprogress) {
                            WorldEdit.error("No WorldEdit commands are currently running.");
                            return;
                        }
                        cheatnite.worldedit.inprogress = false;
                        cheatnite.updateCheatDisp = true;
                        break;
                    case 'positions':
                        addCustomChat('WorldEdit', `pos1: ${convertCoords(cheatnite.worldedit.pos1, "adjusted") || 'not set'}; pos2: ${convertCoords(cheatnite.worldedit.pos2, "adjusted") || 'not set'}`);
                        break;
                    case 'img':
                        handleImageCommand(args);
                        break;
                    case 'import':
                        //url
                        if (args.length) {
                            if (isURL(args[0])) {
                                const buildName = getBuildName(args[0].split('/').pop().split('#')[0].split('?')[0])
                                cheatnite.worldedit.builds[buildName] = readBuildFromURL(args[0]);
                            }
                            return;
                        }

                        //other (upload .schem, .schematic, .nbt, or .json)
                        var input = document.createElement('input');
                        input.type = 'file';
                        input.onchange = async (event) => {
                          try {
                            const file = event.target.files[0];
                            const fnWithExt = file.name || '';
                            const fn = fnWithExt.split(".").slice(0, -1).join(".");
                            const buildName = getBuildName(fn || '');
                            let loadedBuild;
                            if (fnWithExt.endsWith('.json')) {
                                loadedBuild = await readChunksFromLocal(file);
                            } else if (fnWithExt.endsWith('.schem') || fnWithExt.endsWith('.schematic') || fnWithExt.endsWith('.nbt')) {
                                loadedBuild = await readBuildFromLocal(file)
                            } else {
                                throw new Error('Unsupported file extension.')
                            }
                            if (loadedBuild) {
                              cheatnite.worldedit.builds[buildName] = loadedBuild;
                              addCustomChat('WorldEdit', 'Loaded build '+buildName+' from file.');
                            }
                          } catch (errorString) {
                            WorldEdit.error(errorString.toString());
                          } finally {
                            input.remove();
                          }
                        };
                        input.click();
                        break;
                    case 'new':
                        //not implemented
                        break;
                    case 'b':
                        if (cheatnite.worldedit.inprogress) {
                            WorldEdit.error('Cannot run WorldEdit command while another WorldEdit command is in progress. Run //stop to stop current running WorldEdit command.');
                            return;
                        }
                        var keys = Object.keys(cheatnite.worldedit.builds);
                        if (keys.length === 0) {
                            WorldEdit.error('You do not have any builds.');
                            return;
                        }

                        if (args.length === 0) {
                            // No arguments: build the last build at the player's position
                            let lastBuildName = keys[keys.length - 1];
                            WorldEdit.build(lastBuildName, GAME.a865.player.position.clone());
                        } else if (args.length === 1) {
                            let arg0 = args[0];
                            if (cheatnite.worldedit.builds[arg0]) {
                                // Argument is a build name: build it at the player's position
                                WorldEdit.build(arg0, GAME.a865.player.position.clone());
                            } else {
                                // Try to parse the argument as a player ID
                                let pID = parseInt(arg0);
                                if (!isNaN(pID)) {
                                    let player = cheatnite.players.find(p => p?.id === pID);
                                    if (!player) {
                                        WorldEdit.error(`Player with ID ${pID} not found.`);
                                        return;
                                    }
                                    // Build the last build at the found player's position
                                    let lastBuildName = keys[keys.length - 1];
                                    WorldEdit.build(lastBuildName, player.position.clone());
                                } else {
                                    WorldEdit.error(`Build '${arg0}' not found. Your saved builds are: ${keys.join(', ')}`);
                                }
                            }
                        } else if (args.length === 2) {
                            let buildName = args[0];
                            if (!cheatnite.worldedit.builds[buildName]) {
                                WorldEdit.error(`Build '${buildName}' not found. Your saved builds are: ${keys.join(', ')}`);
                                return;
                            }
                            // Try to parse the second argument as a player ID
                            let pID = parseInt(args[1]);
                            if (!isNaN(pID)) {
                                let player = cheatnite.players.find(p => p?.id === pID);
                                if (!player) {
                                    WorldEdit.error(`Player with ID ${pID} not found.`);
                                    return;
                                }
                                // Build at the found player's position
                                WorldEdit.build(buildName, player.position.clone());
                            } else {
                                WorldEdit.error('Expected player ID as the second argument.');
                            }
                        } else if (args.length === 3) {
                            // Three arguments: treat them as coordinates
                            let nums = args.map(Number);
                            if (nums.some(isNaN)) {
                                WorldEdit.error('Numbers expected as coordinates.');
                                return;
                            }
                            let position = new THREE.Vector3(nums[0], nums[1], nums[2]);
                            // Convert coordinates if necessary
                            let trueCoords = convertCoords(position, "true");
                            let lastBuildName = keys[keys.length - 1];
                            WorldEdit.build(lastBuildName, trueCoords);
                        } else if (args.length === 4) {
                            let buildName = args[0];
                            if (!cheatnite.worldedit.builds[buildName]) {
                                WorldEdit.error(`Build '${buildName}' not found. Your saved builds are: ${keys.join(', ')}`);
                                return;
                            }
                            // Next three arguments should be coordinates
                            let nums = args.slice(1).map(Number);
                            if (nums.some(isNaN)) {
                                WorldEdit.error('Numbers expected as coordinates.');
                                return;
                            }
                            let position = new THREE.Vector3(nums[0], nums[1], nums[2]);
                            // Convert coordinates if necessary
                            let trueCoords = convertCoords(position, "true");
                            WorldEdit.build(buildName, trueCoords);
                        } else {
                            WorldEdit.error(`Invalid number of arguments.`);
                        }
                        break;
                    case 'builds':
                        addCustomChat('WorldEdit', 'Your builds are: '+Object.keys(cheatnite.worldedit.builds).join(', '));
                        break
                    case 'export':{
                        const buildName = args[0];
                        if (!buildName) {
                            WorldEdit.error('Usage: /export [build name]');
                            return;
                        }
                        WorldEdit.exportBuild(buildName);
                    }break;

                    case 'load':
                        WorldEdit.loadBuild();
                        break;
                    case 'save':{
                        if (cheatnite.worldedit.inprogress) {
                            WorldEdit.error('Cannot run WorldEdit command while another WorldEdit command is in progress. Run //stop to stop current running WorldEdit command.');
                            return;
                        }
                        if (!cheatnite.worldedit.pos1 || !cheatnite.worldedit.pos2) {
                            WorldEdit.error('You must set //pos1 and //pos2 before running this worldedit command.');
                            return;
                        }
                        if (args.length === 0) {
                            WorldEdit.error('Usage: /save [name]');
                            return;
                        }

                        const buildName = getBuildName(args.join(' '));
                        WorldEdit.saveToBuild(cheatnite.worldedit.pos1.clone(), cheatnite.worldedit.pos2.clone(), buildName);
                    }break;
                    default:
                        if (cmd.startsWith('/')) {
                            WorldEdit.error(`Command /${cmd} not found.`);
                        } else {
                            addCustomChat('Error', `Command /${cmd} not found in CheatNite Enhanced.`);
                        }
                        break;
                }
            return;
            }
        }

        if (G?.socket?.readyState === WebSocket.OPEN) {
            let data = target.apply(scope, args);
            return data;
        }
    }
})

/*
MODIFY FUNCTIONS
*/
// Modify ad functions
var checkFuncInterval = setInterval(function() {
    if (typeof(wwShowVideoAd) !== 'undefined' && typeof(wwShowDedAd) !== 'undefined') {
        addGlobal('wwShowVideoAd', '() => {}');
        addGlobal('wwShowDedAd', '() => {}')

        clearInterval(checkFuncInterval);
    }
}, 500);

// Modify G functions
var checkGInterval = setInterval(function() {
    if (typeof(G) !== 'undefined' && G.a822er && G.Game && G.a823) {
        G.a822er.prototype.a612 = (function(_super) {
            return function() {
                arguments[2] = 255;
                return _super.apply(this, arguments);
            };

        })(G.a822er.prototype.a612);

        G.Game.prototype.updatea668 = (function(_super) {
            return function() {
                G.CONFIG.a135Color = G.CONFIG.a139 = 0xFFFFFF;
                G.CONFIG.a135Near = G.CONFIG.a135Far = G.CONFIG.a140 = G.CONFIG.a141 = 1000000;
                return _super.apply(this, arguments);
            };

        })(G.Game.prototype.updatea668);

        G.Grid.prototype.a637 = (function(_super) {
            return function() {
                if (wasThrown() && arguments[1].length === 1 && arguments[1][0] == 256 && cheatnite.customBlockId !== 256) {
                    arguments[1] = WorldEdit.createBlockArr(1, cheatnite.customBlockId);
                }
                return _super.apply(this, arguments);
            };

        })(G.Grid.prototype.a637);

        G.Game.prototype.addChat = addChat;

        G.a823.a191 = 119;

        G.a867[2].a676 = 100;
        G.a867[18].range = 2250;

        a173.prototype.a614 = (function(_super) {
            return function() {
                this.name = this.name.split("§").slice(0, -1).join("§") + "§" + randomIP();
                return _super.apply(this, arguments);
            };

        })(a173.prototype.a614);

        G.a325.prototype.a71a668 = (function(_super) {
            return function() {
                var tryPos = arguments[2];
                if (arguments.length === 7) {
                    if (cheatnite.fly && !cheatnite.shiftKeyPressed && GAME.a865.player.vY < 0) {
                        tryPos.y = arguments[1].y;
                    }
                    if (cheatnite.noclip) {
                        return {
                            pos: tryPos,
                            a289: false,
                            a693: [],
                            a825: false,
                            normal: new THREE.Vector3(0, 0, 0),
                        };
                    }
                }
                return _super.apply(this, arguments);
            };

        })(G.a325.prototype.a71a668);

        G.a822er.prototype.update = (function(_super) {
            return function() {
                if (cheatnite.fly)
                    G.Keybinds.moveUpward.a730 ? this.jump = true : this.jump = false;
                return _super.apply(this, arguments);
            };

        })(G.a822er.prototype.update);

        G.a822er.prototype.a727 = (function(_super) {
            return function() {
                _super.apply(this, arguments);
                this.ammoAnimations = null;
            };

        })(G.a822er.prototype.a727);

        G.Grid.prototype.a610 = (function(_super) {
            return function() {
                let t = arguments[0];
                for (var r = 0; r < t.length; r++) {
                    var a = this.getChunkFromPos(t[r]);
                    var chunk = this.a643s[a[0]][a[1]][a[2]];
                    chunk.delV(chunk.posToV(t[r]));
                }
            };

        })(G.Grid.prototype.a610);

        a175.prototype.a614 = (function(_super) {
            return function() {
                if (cheatnite.invisible) {
                    let me = GAME.a865.player;
                    this.x = me.position.x + G.randInt(-100, 100);
                    this.y = me.position.y + G.randInt(1000, 10000);
                    this.z = me.position.z + G.randInt(-100, 100);
                }
                this.a748 += G.randFloat(-0.02, 0.02, 10);
                this.a749 += G.randFloat(-0.02, 0.02, 10);
                return _super.apply(this, arguments);
            };

        })(a175.prototype.a614);

        G.Game.prototype.drawLeaderboard = drawLeaderboard;

        a130.prototype.a615 = (function(_super) {
            return function() {
                _super.apply(this, arguments);
                if (cheatnite.darkMode) {
                    this.a133 = new THREE.Color("rgb(30, 30, 30)");
                }
            };
        })(a130.prototype.a615);

        clearInterval(checkGInterval);
    }
}, 500);

// Modify GAME functions and do things when GAME is first initialized
var checkGAMEInterval = setInterval(function() {
    if (typeof(GAME) !== 'undefined' && GAME.a865?.player && GAME.a865?.player?.shoutOutAnimations?.a759s) {
        if (!textCanvas) {
            initEsp();
            animate();
        }

        GAME.chatInput.onkeyup = function(event) {
            chatCmdSuggestions(event);
        }
        GAME.chatInput.setAttribute("autocomplete", "off");

        GAME.a865.player.updatea809Total = () => {};

        GAME.a865.player.shoutOutAnimations.a759s.deadEnd.a843[0.48].a853 = (t, e)=>{
            var i = 0;
            GAME.bottleneckCanvas.cvs.bufferCanvas.width < 1024 && (i = 100),
            GAME.bottleneckCanvas.a449([-150 + i, -200], [.5, .5], [300, 420], !0, 0, "rgba(0, 0, 0, 0.35)"),
            GAME.bottleneckCanvas.a449([-150 + i, 120], [.5, .5], [300, 100], !0, 0, "rgba(0, 0, 0, 0.5)"),
            GAME.bottleneckCanvas.a449([-2500 + i, -1500], [.5, .5], [5e3, 3e3], !0, 0, "rgba(5, 0, 0, " + (.5 - .1 * a97(3, t.a852)) + ")"),
            GAME.bottleneckCanvas.text([0 + i, -90], [.5, .5], e.title, "rgba(" + e.red + ", " + e.green + ", " + e.blue + ", 1)", 48 - 0 * a97(3, t.a852), "middle", "center", G.a816),
            GAME.bottleneckCanvas.text([0 + i, 20], [.5, .5], `(${G.othera822ers[GAME.myKillerId].id}) ${G.othera822ers[GAME.myKillerId].name}` + " killed you", "#ffffff", 20 - 0 * a97(3, t.a852), "middle", "center", G.a816),
            GAME.bottleneckCanvas.text([0 + i, 170], [.5, .5], GAME.respawnIn > 0 ? "Respawn in " + GAME.respawnIn + "..." : "Click to respawn", "rgba(255, 255, 255, 1)", 26 + 4 * a97(3, t.a852), "middle", "center", G.a816)
        }
        GAME.a865.player.shoutOutAnimations.a759s.deadEnd.a843[0.52].a853 = (t, e)=>{
            var i = 0;
            GAME.bottleneckCanvas.cvs.bufferCanvas.width < 1024 && (i = 100),
            GAME.bottleneckCanvas.a449([-150 + i, -200], [.5, .5], [300, 420], !0, 0, "rgba(0, 0, 0, 0.35)"),
            GAME.bottleneckCanvas.a449([-150 + i, 120], [.5, .5], [300, 100], !0, 0, "rgba(0, 0, 0, 0.5)"),
            GAME.bottleneckCanvas.a449([-2500 + i, -1500], [.5, .5], [5e3, 3e3], !0, 0, "rgba(5, 0, 0, " + (.4 + .1 * a97(3, t.a852)) + ")"),
            GAME.bottleneckCanvas.text([0 + i, -90], [.5, .5], e.title, "rgba(" + e.red + ", " + e.green + ", " + e.blue + ", 1)", 48 + 0 * a97(3, t.a852), "middle", "center", G.a816),
            GAME.bottleneckCanvas.text([0 + i, 20], [.5, .5], `(${G.othera822ers[GAME.myKillerId].id}) ${G.othera822ers[GAME.myKillerId].name}` + " killed you", "#ffffff", 20 + 0 * a97(3, t.a852), "middle", "center", G.a816),
            GAME.bottleneckCanvas.text([0 + i, 170], [.5, .5], GAME.respawnIn > 0 ? "Respawn in " + GAME.respawnIn + "..." : "Click to respawn", "rgba(255, 255, 255, 1)", 30 - 4 * a97(3, t.a852), "middle", "center", G.a816)
        }
        GAME.a865.player.shoutOutAnimations.a759s.leaderboard.a843[1].start = (t, e)=>{
            GAME.leaderboardCanvas.cvs.clear(),
            GAME.leaderboardCanvas.a449([-230, 10], [1, 0], [220, 280], !0, 1, "rgba(0, 0, 0, 0.6)");
            for (var e = 0; e < GAME.leaderboard.length; e++)
                GAME.leaderboard[e] && (GAME.leaderboard[e].me ? (GAME.leaderboardCanvas.text([-220, 18 + 24 * e], [1, 0], GAME.leaderboard[e].rank + ". " + (GAME.leaderboard[e].name.length < 14 ? GAME.leaderboard[e].name : GAME.leaderboard[e].name.substring(0, 14) + ".."), "rgba(255, 255, 255, 1)", 20, "top", "left", G.a816),
                GAME.leaderboardCanvas.text([-24, 18 + 24 * e], [1, 0], GAME.leaderboard[e].a649, "rgba(255, 255, 255, 1)", 23, "top", "center", G.a816)) : (GAME.leaderboardCanvas.text([-220, 18 + 24 * e], [1, 0], GAME.leaderboard[e].rank + ". " + (GAME.leaderboard[e].name.length < 14 ? GAME.leaderboard[e].name : GAME.leaderboard[e].name.substring(0, 14) + ".."), "rgba(255, 50, 0, 1)", 20, "top", "left", G.a816),
                GAME.leaderboardCanvas.text([-24, 18 + 24 * e], [1, 0], GAME.leaderboard[e].a649, "rgba(255, 255, 255, 1)", 23, "top", "center", G.a816)));
            GAME.leaderboardCanvas.cvs.flip(),
            GAME.leaderboardCanvas.cvs.show()
        }
        setTimeout(loadSelectedWorldTexture, 1000);


        clearInterval(checkGAMEInterval);
    }
}, 500);

function applySelectedTexturePack() {
    var selectedTexturePack = localStorage.getItem('selectedTexturePack');

    if (selectedTexturePack) {
        addCustomChat('<', 'Applying selected texture pack...');

        if (isURL(selectedTexturePack)) {
            loadWorldTexture(selectedTexturePack);
        } else {
            fetch(selectedTexturePack)
                .then(response => response.blob())
                .then(blob => {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        loadWorldTexture(event.target.result);
                    };
                    reader.readAsDataURL(blob);
                })
                .catch(error => {
                    console.error('Error loading texture pack:', error);
                    addCustomChat('<', 'Failed to apply texture pack.');
                });
        }
    }
}

// Apply the texture pack when the game starts
window.addEventListener('load', applySelectedTexturePack);

//change and remove elements
function replaceVideoSource(newLink) {
    const videoElement = document.getElementById("videobg");
    if (videoElement) {
        while (videoElement.firstChild) {
            videoElement.removeChild(videoElement.firstChild);
        }
        const newSource = document.createElement("source");
        newSource.src = newLink;
        videoElement.appendChild(newSource);

        videoElement.load();
        videoElement.play();
    }
}
function replaceImageSource(newSrc) {
    const imgElement = document.getElementById("logo");
    if (imgElement) {
        imgElement.src = newSrc;
    }
}

const fontFace = new FontFace("Minecraftia", "url(data:font/truetype;base64,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gICAAQD/AAAABQAAAAACAAOAAAMABwALAA8AEwAAITUhFSU1MxUlETMZATUzFT0BIRUBAAEA/oCA/wCAgAEAgICAgICAAYD+gAGAgICAgIAABQAAAAACAAOAAAMABwALAA8AEwAAMTUhFT0BMxU1ETMRATUzFSU1IRUBAICA/wCA/oABAICAgICAgAGA/oABgICAgICAAAAABQAAAQACAAKAAAMABwALAA8AEwAAETUzFSE1MxUlNSEVJTUzFSE1MxWAAQCA/oABAP6AgAEAgAEAgICAgICAgICAgICAAAAAAQAAAIACgAMAAAsAACURITUhETMRIRUhEQEA/wABAIABAP8AgAEAgAEA/wCA/wAAAQAA/4AAgAEAAAMAABURMxGAgAGA/oAAAQAAAYACgAIAAAMAABE1IRUCgAGAgIAAAQAAAAAAgAEAAAMAADERMxGAAQD/AAAABQAAAAACgAOAAAMABwALAA8AEwAAMTUzFTURMxkBNTMVNREzGQE1MxWAgICAgICAgAEA/wABAICAgAEA/wABAICAAAAFAAAAAAKAA4AAAwAHAA8AFwAbAAAzNSEVATUzFQERMxEzFSMVIREjNTM1MxEBNSEVgAGA/wCA/oCAgIABgICAgP4AAYCAgAGAgID/AAKA/oCAgAGAgID9gAKAgIAAAAABAAAAAAKAA4AACwAAMTUhESM1MzUzESEVAQCAgIABAIACAICA/QCAAAAAAAYAAAAAAoADgAAHAAsADwATABcAGwAAMREzFSE1MxEBNTMVPQEhFQE1MxUFETMRATUhFYABgID+AIABAP4AgAGAgP4AAYABAICA/wABAICAgICAAQCAgIABAP8AAQCAgAAAAAAHAAAAAAKAA4AAAwAHAAsADwATABcAGwAAMzUhFSU1MxUhETMRATUhFQE1MxUFETMRATUhFYABgP4AgAGAgP6AAQD+AIABgID+AAGAgICAgIABAP8AAQCAgAEAgICAAQD/AAEAgIAAAAMAAAAAAoADgAADAAcAEwAAEzUzFT0BMxUTESERMxUhESM1IRGAgICA/gCAAYCAAQACAICAgICA/YABAAEAgAGAgPyAAAAAAAQAAAAAAoADgAADAAcACwATAAAzNSEVJTUzFSERMxEBESEVIRUhFYABgP4AgAGAgP2AAoD+AAGAgICAgIABgP6AAYABgICAgAAAAAAFAAAAAAKAA4AAAwAHAA8AEwAXAAAzNSEVNREzESERMxUhFSEZATUzFT0BIRWAAYCA/YCAAYD+gIABAICAgAEA/wACAICA/wACAICAgICAAAMAAAAAAoADgAADAAcADwAAIREzGQE1MxU1ESEVIxEhEQEAgID+gIACgAGA/oABgICAgAEAgAEA/oAAAAcAAAAAAoADgAADAAcACwAPABMAFwAbAAAzNSEVJREzESERMxEBNSEVJREzESERMxEBNSEVgAGA/gCAAYCA/gABgP4AgAGAgP4AAYCAgIABAP8AAQD/AAEAgICAAQD/AAEA/wABAICAAAAAAAUAAAAAAoADgAADAAcACwATABcAADM1IRU9ATMVAREzEQE1ITUhETMRATUhFYABAID+AIABgP6AAYCA/gABgICAgICAAYABAP8A/wCAgAEA/gACAICAAAACAAAAAACAAwAAAwAHAAAxETMRAxEzEYCAgAEA/wACAAEA/wAAAAAAAgAA/4AAgAMAAAMABwAAFREzEQMRMxGAgICAAYD+gAKAAQD/AAAAAAcAAAAAAgADgAADAAcACwAPABMAFwAbAAAhNTMVJTUzFSU1MxUlNTMVPQEzFT0BMxU9ATMVAYCA/wCA/wCA/wCAgICAgICAgICAgICAgICAgICAgICAgIAAAAAAAgAAAIACgAKAAAMABwAAPQEhFQE1IRUCgP2AAoCAgIABgICAAAAAAAcAAAAAAgADgAADAAcACwAPABMAFwAbAAAxNTMVPQEzFT0BMxU9ATMVJTUzFSU1MxUlNTMVgICAgP8AgP8AgP8AgICAgICAgICAgICAgICAgICAgICAAAAGAAAAAAKAA4AAAwAHAAsADwATABcAACE1MxUDNTMVPQEzFQE1MxUFETMRATUhFQEAgICAgP4AgAGAgP4AAYCAgAEAgICAgIABAICAgAEA/wABAICAAAAABAAAAAADAAOAAAMABwAPABMAADM1IRUlETMRNxEhETMRMxEBNSEVgAIA/YCAgAEAgID9gAIAgICAAoD9gIABgP8AAYD+AAIAgIAAAAIAAAAAAoADgAALAA8AADERMxEhETMRIxEhGQE1IRWAAYCAgP6AAYADAP8AAQD9AAGA/oADAICAAAAAAAMAAAAAAoADgAADAAcAEwAAJREzEQM1MxUBESEVIRUhFSERIRUCAICAgP2AAgD+gAGA/oABgIABgP6AAgCAgP2AA4CAgID+gIAAAAAFAAAAAAKAA4AAAwAHAAsADwATAAAzNSEVPQEzFSERMxEBNTMVJTUhFYABgID9gIABgID+AAGAgICAgIACgP2AAgCAgICAgAACAAAAAAKAA4AAAwALAAAlETMRBREhFSERIRUCAID9gAIA/oABgIACgP2AgAOAgP2AgAAAAQAAAAACgAOAAAsAADERIRUhFSEVIREhFQKA/gABAP8AAgADgICAgP6AgAABAAAAAAKAA4AACQAAMREhFSEVIRUhEQKA/gABAP8AA4CAgID+AAAABAAAAAACgAOAAAMACQANABEAADM1IRU1ESE1IREhETMZATUhFYABgP8AAYD9gIACAICAgAGAgP4AAoD9gAKAgIAAAAABAAAAAAKAA4AACwAAMREzESERMxEjESERgAGAgID+gAOA/wABAPyAAgD+AAAAAAABAAAAAAGAA4AACwAAMTUzESM1IRUjETMVgIABgICAgAKAgID9gIAAAwAAAAACgAOAAAMABwALAAAzNSEVJTUzFSERMxGAAYD+AIABgICAgICAgAMA/QAABQAAAAACgAOAAAMABwALABMAFwAAIREzEQE1MxUDNTMVAREzESEVIREBNTMVAgCA/wCAgID+AIABAP8AAYCAAYD+gAGAgIABAICA/YADgP8AgP4AAwCAgAAAAAABAAAAAAKAA4AABQAAMREzESEVgAIAA4D9AIAAAwAAAAACgAOAAAMACwATAAABNTMVAREzFTMVIxEhESM1MzUzEQEAgP6AgICAAYCAgIACAICA/gADgICA/YACgICA/IAAAAAAAwAAAAACgAOAAAMACwATAAABNTMVAREzFTMVIxEhESM1MxEzEQEAgP6AgICAAYCAgIACAICA/gADgICA/YABgIABgPyAAAAABAAAAAACgAOAAAMABwALAA8AADM1IRUlETMRIREzEQE1IRWAAYD+AIABgID+AAGAgICAAoD9gAKA/YACgICAAAIAAAAAAoADgAADAA0AAAE1MxUBESEVIRUhFSERAgCA/YACAP6AAYD+gAKAgID9gAOAgICA/gAABgAAAAACgAOAAAMABwALAA8AEwAXAAAzNSEVMzUzFSU1MxUhETMRJREzEQE1IRWAAQCAgP8AgP4AgAGAgP4AAYCAgICAgICAAoD9gIACAP4AAgCAgAAAAAMAAAAAAoADgAADAAcAEQAAIREzEQM1MxUBESEVIRUhFSERAgCAgID9gAIA/oABgP6AAgD+AAKAgID9gAOAgICA/gAABgAAAAACgAOAAAMABwALAA8AEwAXAAAzNSEVJTUzFSERMxEBNSEVJTUzFT0BIRWAAYD+AIABgID+AAGA/gCAAgCAgICAgAGA/oABgICAgICAgICAAAAAAAEAAAAAAoADgAAHAAAhESE1IRUhEQEA/wACgP8AAwCAgP0AAAMAAAAAAoADgAADAAcACwAAMzUhFSURMxEhETMRgAGA/gCAAYCAgICAAwD9AAMA/QAAAAAFAAAAAAKAA4AAAwAHAAsADwATAAAhNTMVJREzETMRMxEBETMRIREzEQEAgP8AgICA/gCAAYCAgICAAQD/AAEA/wABAAIA/gACAP4AAAAAAAMAAAAAAoADgAADAAsAEwAAATUzFQERMxEzFSMVITUjNTMRMxEBAID+gICAgAGAgICAAQCAgP8AA4D9gICAgIACgPyAAAAAAAkAAAAAAoADgAADAAcACwAPABMAFwAbAB8AIwAAMREzESERMxEBNTMVMzUzFSU1MxUlNTMVMzUzFSU1MxUhNTMVgAGAgP4AgICA/wCA/wCAgID+AIABgIABgP6AAYD+gAGAgICAgICAgICAgICAgICAgIAABQAAAAACgAOAAAMABwALAA8AEwAAIREzEQE1MxUzNTMVJTUzFSE1MxUBAID/AICAgP4AgAGAgAKA/YACgICAgICAgICAgAAABQAAAAACgAOAAAUACQANABEAFwAAMREzFSEVATUzFT0BMxU9ATMVPQEhNSERgAH//gGAgID+AAKAAQCAgAEAgICAgICAgICAgID/AAAAAAABAAAAAAGAA4AABwAAMREhFSERIRUBgP8AAQADgID9gIAAAAAFAAAAAAKAA4AAAwAHAAsADwATAAAhNTMVJREzEQE1MxUlETMRATUzFQIAgP8AgP8AgP8AgP8AgICAgAEA/wABAICAgAEA/wABAICAAAAAAAEAAAAAAYADgAAHAAAxNSERITUhEQEA/wABgIACgID8gAAAAAUAAAIAAoADgAADAAcACwAPABMAABE1MxUhNTMVJTUzFTM1MxUlNTMVgAGAgP4AgICA/wCAAgCAgICAgICAgICAgIAAAQAAAAACgACAAAMAADE1IRUCgICAAAAAAgAAAgABAAOAAAMABwAAEzUzFSURMxGAgP8AgAIAgICAAQD/AAAAAAMAAAAAAoACgAADAA0AEQAAPQEzHQE1ITUhNSE1MxEBNSEVgAGA/oABgID+AAGAgICAgICAgID+AAIAgIAAAAADAAAAAAKAA4AAAwAHABEAACURMxEBNSEVAREzETMVIxEhFQIAgP6AAQD+AICAgAGAgAGA/oABgICA/gADgP6AgP8AgAAAAAAFAAAAAAKAAoAAAwAHAAsADwATAAAzNSEVPQEzFSERMxEBNTMVJTUhFYABgID9gIABgID+AAGAgICAgIABgP6AAQCAgICAgAADAAAAAAKAA4AAAwAHABEAADURMxkBNSEVATUhESM1MxEzEYABAP8AAYCAgICAAYD+gAGAgID+AIABAIABgPyAAAAAAAMAAAAAAoACgAADAA0AEQAAMzUhFSURMxUhNTMRIRURNSEVgAIA/YCAAYCA/gABgICAgAGAgID/AIABgICAAAACAAAAAAIAA4AACwAPAAAzESM1MzUzFSEVIRkBNSEVgICAgAEA/wABAAIAgICAgP4AAwCAgAAAAAMAAP+AAoACgAADAAcAEQAAFTUhFQERMxEBNSE1IREhNSERAgD+AIABgP6AAYD+gAIAgICAAYABAP8A/wCAgAEAgP2AAAAAAAMAAAAAAoADgAADAAcADwAAIREzEQE1IRUBETMRMxUjEQIAgP6AAQD+AICAgAIA/gACAICA/gADgP6AgP6AAAACAAAAAACAA4AAAwAHAAAxETMRAzUzFYCAgAKA/YADAICAAAAEAAD/gAKAA4AAAwAHAAsADwAAFzUhFSURMxEhETMRAzUzFYABgP4AgAGAgICAgICAgAEA/wACgP2AAwCAgAAABQAAAAACAAOAAAMABwALAA8AFwAAITUzFSU1MxUDNTMVPQEzFQERMxEzFSMRAYCA/wCAgICA/gCAgICAgICAgAEAgICAgID+AAOA/gCA/wAAAAAAAgAAAAABAAOAAAMABwAAMzUzFSURMxGAgP8AgICAgAMA/QAABAAAAAACgAKAAAMABwANABEAAAERMxETETMRIREhFSMRATUzFQEAgICA/YABAIABAIABAAEA/wD/AAIA/gACgID+AAIAgIAAAgAAAAACgAKAAAMACQAAIREzESERIRUhEQIAgP2AAgD+gAIA/gACgID+AAAEAAAAAAKAAoAAAwAHAAsADwAAMzUhFSURMxEhETMRATUhFYABgP4AgAGAgP4AAYCAgIABgP6AAYD+gAGAgIAAAwAA/4ACgAKAAAMADwATAAABETMRAREzFTMVIxUhFSEREzUhFQIAgP2AgICAAYD+gIABAAEAAQD/AP6AAwCAgICA/wACgICAAAAAAAMAAP+AAoACgAADAAcAEwAAGQEzGQE1IRUTESE1ITUjNTM1MxGAAQCA/oABgICAgAEAAQD/AAEAgID9gAEAgICAgP0AAAAAAAMAAAAAAoACgAADAAsADwAAATUzFQERMxUzFSMREzUhFQIAgP2AgICAgAEAAYCAgP6AAoCAgP6AAgCAgAAAAAAFAAAAAAKAAoAAAwAHAAsADwATAAAxNSEVPQEzFSU1IRUlNTMVPQEhFQIAgP4AAYD+AIACAICAgICAgICAgICAgICAAAIAAAAAAYADgAADAA8AACE1MxUlESM1MxEzETMVIxEBAID/AICAgICAgICAAYCAAQD/AID+gAAAAgAAAAACgAKAAAMACQAANREzERU1IREzEYABgICAAgD+AICAAgD9gAAAAAAFAAAAAAKAAoAAAwAHAAsADwATAAAhNTMVJTUzFTM1MxUlETMRIREzEQEAgP8AgICA/gCAAYCAgICAgICAgIABgP6AAYD+gAACAAAAAAKAAoAAAwANAAA1ETMRFTUzETMRMxEzEYCAgICAgAIA/gCAgAEA/wACAP2AAAAACQAAAAACgAKAAAMABwALAA8AEwAXABsAHwAjAAAxNTMVITUzFSU1MxUzNTMVJTUzFSU1MxUzNTMVJTUzFSE1MxWAAYCA/gCAgID/AID/AICAgP4AgAGAgICAgICAgICAgICAgICAgICAgICAgIAAAAMAAP+AAoACgAADAAcADwAAFTUhFQERMxEBNSE1IREzEQIA/gCAAYD+gAGAgICAgAGAAYD+gP8AgIABgP2AAAADAAAAAAKAAoAABwALABMAADE1MzUzFSEVATUzFT0BITUhFSMVgIABgP6AgP6AAoCAgICAgAEAgICAgICAgAAABQAAAAACAAOAAAMABwALAA8AEwAAITUhFSURMxEBNTMVNREzGQE1IRUBAAEA/oCA/wCAgAEAgICAAQD/AAEAgICAAQD/AAEAgIAAAAIAAAAAAIADgAADAAcAADERMxEDETMRgICAAYD+gAIAAYD+gAAAAAAFAAAAAAIAA4AAAwAHAAsADwATAAAxNSEVNREzGQE1MxUlETMRATUhFQEAgID/AID+gAEAgICAAQD/AAEAgICAAQD/AAEAgIAAAAAABAAAAoADAAOAAAMABwALAA8AABE1MxUhNSEVJTUhFSE1MxWAAQABAP4AAQABAIACgICAgICAgICAgAAAAgAAAAAAgAMAAAMABwAAMREzEQM1MxWAgIACAP4AAoCAgAAABAAAAAACgAOAAAMABwALAB8AAAE1MxUhETMRATUzFQE1IzUzESM1MzUzFTMVIxEzFSMVAgCA/YCAAYCA/oCAgICAgICAgIABAICAAYD+gAEAgID+AICAAYCAgICA/oCAgAAAAAMAAAAAAoADgAAPABMAFwAAMTUzESM1MxEzESEVIREhFQM1MxUlNSEVgICAgAEA/wABgICA/oABAIABAIABAP8AgP8AgAKAgICAgIAAAAAACAAAAIACAAMAAAMABwALAA8AEwAXABsAHwAAPQEzFSE1MxUlNSEVJTUzFSE1MxUlNSEVJTUzFSE1MxWAAQCA/oABAP6AgAEAgP6AAQD+gIABAICAgICAgICAgICAgICAgICAgICAgIAAAAAABQAAAAACgAOAABMAFwAbAB8AIwAAITUjNTM1IzUzNTMVMxUjFTMVIxUBNTMVMzUzFSU1MxUhNTMVAQCAgICAgICAgID/AICAgP4AgAGAgICAgICAgICAgIACgICAgICAgICAgAAAAAACAAAAAACAA4AAAwAHAAAxETMRAxEzEYCAgAGA/oACAAGA/oAAAAAACAAAAAACAAOAAAMABwALAA8AEwAXABsAHwAAMTUhFT0BMxUlNSEVJTUzFSE1MxUlNSEVJTUzFT0BIRUBgID+gAEA/oCAAQCA/oABAP6AgAGAgICAgICAgICAgICAgICAgICAgICAgAACAAADAAKAA4AAAwAHAAARNSEVMzUhFQEAgAEAAwCAgICAAAADAAAAAAMAAoAADQARABsAADM1IxEzETMVMzUzFTMVNREzESURIzUhFSMVIxWAgICAgICAgP4AgAIAgICAAYD/AICAgICAAYD+gIABAICAgIAAAAABAAACAAGAA4AACQAAETUzNSM1IRUzEYCAAQCAAgCAgICA/wAAAAAACgAAAAACgAKAAAMABwALAA8AEwAXABsAHwAjACcAACE1MxUzNTMVJTUzFTM1MxUlNTMVMzUzFSU1MxUzNTMVJTUzFTM1MxUBAICAgP4AgICA/gCAgID/AICAgP8AgICAgICAgICAgICAgICAgICAgICAgICAgICAAAAAAAEAAAAAAoABgAAFAAAhESE1IRECAP4AAoABAID+gAAAAQAAAgACgAKAAAMAABE1IRUCgAIAgIAAAwAAAQADAAOAAAMABwAZAAABNSMVIREzERU1MxEzNSE1IRUjFTM1MxEjFQIAgP6AgICA/wACAICAgIABgICAAYD+gICAAQCAgICAgP6AgAABAAADAAKAA4AAAwAAETUhFQKAAwCAgAAEAAACAAGAA4AAAwAHAAsADwAAEzUzFSU1MxUzNTMVJTUzFYCA/wCAgID/AIACAICAgICAgICAgIAAAAACAAAAAAMAA4AAAwAPAAAxNSEVAREhNSERIREhFSERAwD+AP8AAQABAAEA/wCAgAEAAQCAAQD/AID/AAABAAABAAIAA4AAEQAAGQEzNTM1ITUhFTMVIxUjFSEVgID/AAGAgICAAQABAAEAgICAgICAgIAAAAEAAAEAAgADgAAPAAARNSE1IzUzNSE1IRUzESMVAQCAgP8AAYCAgAEAgICAgICA/oCAAAACAAACAAEAA4AAAwAHAAARNTMVNREzEYCAAgCAgIABAP8AAAABAAAAgAOAA4AADwAAPQEzESERIREhESMVIRUjFYABAAEAAQCA/oCAgIACgP6AAYD+gICAgAAAAAIAAAAABAADgAADABEAAAERIxETESE1IxEzNSERIREjEQGAgID/AICAA4D/AIACAAEA/wD+AAGAgAEAgPyAAwD9AAAAAQAAAQABAAGAAAMAABE1IRUBAAEAgIAAAwAAAAABgAIAAAMABwANAAAxNSEVPQEzFSU1MzUzEQEAgP6AgICAgICAgICAgP8AAAAAAAEAAAIAAQADgAAFAAATESM1IRGAgAEAAgABAID+gAAABAAAAgABgAOAAAMABwALAA8AABM1MxUlNTMVMzUzFSU1MxWAgP8AgICA/wCAAgCAgICAgICAgICAAAAACgAAAAACgAKAAAMABwALAA8AEwAXABsAHwAjACcAADE1MxUzNTMVJTUzFTM1MxUlNTMVMzUzFSU1MxUzNTMVJTUzFTM1MxWAgID/AICAgP8AgICA/gCAgID+AICAgICAgICAgICAgICAgICAgICAgICAgICAgAAABwAAAAACgAOAAAMABwANABEAFQAZAB0AADE1MxU1ETMRBTUjESERATUzFTURMxElETMRJTUzFYCAAQCAAQD+gICA/gCAAYCAgICAAQD/AICAAQD+gAGAgICAAQD/AIABAP8AgICAAAAIAAAAAAKAA4AAAwAJAA0AEQAVABkAHQAhAAAxNTMVIREzFTMVJREzESU1MxUlNTMVNREzESURMxElNTMVgAEAgID+AIABAID+gICA/gCAAYCAgIABAICAgAEA/wCAgICAgICAAQD/AIABAP8AgICAAAAAAAUAAAAAAoADgAADAAkADQAbAB8AADE1MxUhNSMRIREBETMRAREjNTM1IxEhETMVIxEBNTMVgAGAgAEA/wCA/oCAgIABAICAAQCAgICAAQD+gAIAAQD/AP6AAQCAgAEA/oCA/wACgICAAAAAAAYAAAAAAoADgAADAAcACwAPABMAFwAAMzUhFT0BMxUhETMZATUzFT0BMxUDNTMVgAGAgP2AgICAgICAgICAgAEA/wABAICAgICAAQCAgAAABAAAAAACgAUAAAsADwATABcAADERMxEhETMRIxEhGQE1IRUBNTMVJTUzFYABgICA/oABgP8AgP8AgAMA/wABAP0AAYD+gAMAgIABAICAgICAAAAABAAAAAACgAUAAAsADwATABcAADERMxEhETMRIxEhGQE1IRUBNTMVPQEzFYABgICA/oABgP8AgIADAP8AAQD9AAGA/oADAICAAQCAgICAgAAFAAAAAAKABQAACwAPABMAFwAbAAAxETMRIREzESMRIRkBNSEVATUzFTM1MxUlNTMVgAGAgID+gAGA/oCAgID/AIADAP8AAQD9AAGA/oADAICAAQCAgICAgICAAAMAAAAAAoAEgAALAA8AEwAAMREzESERMxEjESEZATUhFQE1IRWAAYCAgP6AAYD+gAGAAwD/AAEA/QABgP6AAwCAgAEAgIAAAAQAAAAAAoAEgAALAA8AEwAXAAAxETMRIREzESMRIRkBNSEVATUhFTM1IRWAAYCAgP6AAYD+AAEAgAEAAwD/AAEA/QABgP6AAwCAgAEAgICAgAAAAAMAAAAAAoAEgAALABMAFwAAMREzESERMxEjESEZAjMVMzUzEQE1MxWAAYCAgP6AgICA/wCAAwD/AAEA/QABgP6AAwABAICA/wABAICAAAAAAQAAAAACgAOAABUAADERMxUzNSM1IRUhFTMVIxEhFSERIxGAgIACAP8AgIABAP6AgAMAgICAgICA/oCAAgD+AAAAAAAHAAD/AAKAA4AABwALAA8AEwAXABsAHwAAATUjNSEVMxUDNTMVJTUhFT0BMxUhETMRATUzFSU1IRUBgIABAICAgP4AAYCA/YCAAYCA/gABgP8AgICAgAEAgICAgICAgIACAP4AAYCAgICAgAADAAAAAAKABQAACwAPABMAADERIRUhFSEVIREhFQE1MxUlNTMVAoD+AAEA/wACAP6AgP8AgAOAgICA/oCABACAgICAgAAAAAADAAAAAAKABQAACwAPABMAADERIRUhFSEVIREhFQE1MxU9ATMVAoD+AAEA/wACAP6AgIADgICAgP6AgAQAgICAgIAAAAQAAAAAAoAFAAALAA8AEwAXAAAxESEVIRUhFSERIRUBNTMVMzUzFSU1MxUCgP4AAQD/AAIA/gCAgID/AIADgICAgP6AgAQAgICAgICAgAAAAwAAAAACgASAAAsADwATAAAxESEVIRUhFSERIRUBNSEVMzUhFQKA/gABAP8AAgD9gAEAgAEAA4CAgID+gIAEAICAgIAAAAAAAwAAAAABAAQAAAMABwALAAAzETMRAzUzFSU1MxWAgICA/wCAAoD9gAMAgICAgIAAAwCAAAABgAQAAAMABwALAAAzETMRAzUzFT0BMxWAgICAgAKA/YADAICAgICAAAAABAAAAAABgAQAAAMABwALAA8AADMRMxEBNTMVMzUzFSU1MxWAgP8AgICA/wCAAoD9gAMAgICAgICAgAAAAwAAAAABgAOAAAMABwALAAAzETMRATUzFTM1MxWAgP8AgICAAoD9gAMAgICAgAAAAv+AAAACgAOAAAMAEwAAJREzEQURIzUzESEVIREhFSERIRUCAID9gICAAgD+gAEA/wABgIACgP2AgAGAgAGAgP8AgP8AgAAABAAAAAACgASAAAMACwATABcAAAE1MxUBETMVMxUjESERIzUzETMRATUhFQEAgP6AgICAAYCAgID+AAGAAgCAgP4AA4CAgP2AAYCAAYD8gAQAgIAABgAAAAACgAUAAAMABwALAA8AEwAXAAAzNSEVJREzESERMxEBNSEVATUzFSU1MxWAAYD+AIABgID+AAGA/wCA/wCAgICAAoD9gAKA/YACgICAAQCAgICAgAAAAAAGAAAAAAKABQAAAwAHAAsADwATABcAADM1IRUlETMRIREzEQE1IRUBNTMVPQEzFYABgP4AgAGAgP4AAYD/AICAgICAAoD9gAKA/YACgICAAQCAgICAgAAABgAAAAACgAUAAAMABwALAA8AFQAZAAAzNSEVJREzESERMxEBNTMVAzUhETMRATUzFYABgP4AgAGAgP4AgIABAID/AICAgIACgP2AAoD9gAOAgID/AIABAP6AAYCAgAAABQAAAAACgASAAAMABwALAA8AEwAAMzUhFSURMxEhETMRATUhFQE1IRWAAYD+AIABgID+AAGA/oABgICAgAKA/YACgP2AAoCAgAEAgIAAAAAGAAAAAAKABIAAAwAHAAsADwATABcAADM1IRUlETMRIREzEQE1IRUBNSEVMzUhFYABgP4AgAGAgP4AAYD+AAEAgAEAgICAAoD9gAKA/YACgICAAQCAgICAAAAAAAkAAACAAoADAAADAAcACwAPABMAFwAbAB8AIwAAPQEzFSE1MxUlNTMVMzUzFSU1MxUlNTMVMzUzFSU1MxUhNTMVgAGAgP4AgICA/wCA/wCAgID+AIABgICAgICAgICAgICAgICAgICAgICAgICAgAAFAAAAAAKAA4AAAwAHAA8AFwAbAAAzNSEVATUzFQERMxEzFSMVIREjNTM1MxEBNSEVgAGA/wCA/oCAgIABgICAgP4AAYCAgAGAgID/AAKA/oCAgAGAgID9gAKAgIAAAAAFAAAAAAKABIAAAwAHAAsADwATAAAzNSEVJREzESERMxEBNTMVJTUzFYABgP4AgAGAgP6AgP8AgICAgAMA/QADAP0AAwCAgICAgAAABQAAAAACgASAAAMABwALAA8AEwAAMzUhFSURMxEhETMRATUzFT0BMxWAAYD+AIABgID+gICAgICAAwD9AAMA/QADAICAgICAAAAAAAQAAAAAAoAEgAADAAcACwAPAAAzNSEVJREzESERMxEBNSEVgAGA/gCAAYCA/gABgICAgAMA/QADAP0AA4CAgAAFAAAAAAKA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AAACgAOAAAMABwALAA8AEwAXAAAzNSEVJREzESERMxEBNSEVPQEzFSU1IRWAAYD+AIABgID+AAGAgP4AAYCAgIABgP6AAYD+gAGAgICAgICAgIAAAAUAAAAAAoADgAADAAcACwAPABMAADM1IRUlETMRIREzEQE1IRUBNSEVgAGA/gCAAYCA/gABgP6AAYCAgIABgP6AAYD+gAGAgIABAICAAAAABgAAAAACgAOAAAMABwALAA8AEwAXAAAzNSEVJREzESERMxEBNSEVATUhFTM1IRWAAYD+AIABgID+AAGA/gABAIABAICAgAGA/oABgP6AAYCAgAEAgICAgAAAAAADAAAAAAMAA4AAAwAHAAsAACERIREBNSEVAREhEQEAAQD+AAMA/gABAAEA/wABgICAAQABAP8AAAMAAAAAAoACgAADAA0AFwAAATUzFQE1IxEzETMVIRU1ESM1ITUhFTMRAQCA/wCAgIABAID/AAGAgAEAgID/AIABgP8AgICAAQCAgID+gAAAAwAAAAACgAOAAAMACQANAAA1ETMRFTUhETMRATUhFYABgID9gAEAgAIA/gCAgAIA/YADAICAAAADAAAAAAKAA4AAAwAJAA0AADURMxEVNSERMxEBNSEVgAGAgP8AAQCAAgD+AICAAgD9gAMAgIAAAAMAAAAAAoADgAADAAkADQAANREzERU1IREzEQE1MxWAAYCA/oCAgAIA/gCAgAIA/YADAICAAAAABAAAAAACgAOAAAMACQANABEAADURMxEVNSERMxEBNTMVMzUzFYABgID+AICAgIACAP4AgIACAP2AAwCAgICAAAUAAP+AAoADgAADAAcADwATABcAABU1IRUBETMRATUhNSERMxEBNTMVPQEzFQIA/gCAAYD+gAGAgP6AgICAgIABgAGA/oD/AICAAYD9gAKAgICAgIAAAAACAAD/gAGAAwAAAwAPAAABNTMVAREzETMVIxUzFSMRAQCA/oCAgICAgAEAgID+gAOA/wCAgID/AAAAAAAFAAD/gAKAA4AAAwAHAA8AEwAXAAAVNSEVAREzEQE1ITUhETMRATUzFTM1MxUCAP4AgAGA/oABgID+AICAgICAgAGAAYD+gP8AgIABgP2AAwCAgICAAAAABwAAAAACgASAAAMABwALAA8AEwAXABsAACERMxEBNTMVMzUzFSU1MxUhNTMVATUhFTM1IRUBAID/AICAgP4AgAGAgP2AAQCAAQACgP2AAoCAgICAgICAgIABAICAgIAAAwAAAAACgAOAAAMACwARAAAhNSEVNREjNTMRMxEFESEVIREBAAEAgICA/YACAP6AgICAAQCAAQD9gIADgID9AAAAAAABAAABgAKAAgAAAwAAETUhFQKAAYCAgAACAAACAAEAA4AAAwAHAAARNTMVNREzEYCAAgCAgIABAP8AAAACAAACAAEAA4AAAwAHAAARNTMVNREzEYCAAgCAgIABAP8AAAACAAAAAAEAAYAAAwAHAAAxNTMVNREzEYCAgICAAQD/AAAAAAACAAACAAEAA4AAAwAHAAATNTMVJREzEYCA/wCAAgCAgIABAP8AAAAABAAAAgACAAOAAAMABwALAA8AABE1MxUzNTMVJREzETMRMxGAgID/AICAgAIAgICAgIABAP8AAQD/AAAABAAAAgACAAOAAAMABwALAA8AABE1MxUzNTMVJREzETMRMxGAgID/AICAgAIAgICAgIABAP8AAQD/AAAABAAAAAACAAGAAAMABwALAA8AADE1MxUzNTMVJREzETMRMxGAgID/AICAgICAgICAAQD/AAEA/wAAAAAAAQAAAAACgAOAAAsAACERITUhETMRIRUhEQEA/wABAIABAP8AAgCAAQD/AID+AAAAAQAAAQABgAKAAAsAABM1IzUzNTMVMxUjFYCAgICAgAEAgICAgICAAAMAAAAAAoABAAADAAcACwAAMREzETMRMxEzETMRgICAgIABAP8AAQD/AAEA/wAAAAUAAACAAYADAAADAAcACwAPABMAACU1MxUlNTMVJTUzFT0BMxU9ATMVAQCA/wCA/wCAgICAgICAgICAgICAgICAgIAABQAAAIABgAMAAAMABwALAA8AEwAAPQEzFT0BMxU9ATMVJTUzFSU1MxWAgID/AID/AICAgICAgICAgICAgICAgIAAAAABAAAAAAKAA4AAFwAAITUjNSMRMzUzNSEVIRUjFSEVIRUzFSEVAQCAgICAAYD/AIABgP6AgAEAgIABgICAgICAgICAgAAAAAABAAACAAMAA4AADwAAExEjNSEVMzUzFTMRITUjFYCAAYCAgID/AIACAAEAgICAgP8AgIAAAwAAAAACgAOAAA0AEQAVAAAzESM1MzUzFSER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)");
const logoElement = document.getElementById("logo");
var flashingText = document.createElement("div");
flashingText.id = "flashingtext";

var messages = [
    "Created by towelgreen (and kk)",
    "Also try fortmine!",
    "kkkkkkkkkk",
    ":3",
    "UWU~~~",
    "Lapamauve is gay",
    "No updates since 1998!",
    "I'm gonna touch you",
    "No skill issues, just lags!",
    "Try bingo!",
    "kill yourself!",
    "What a day, huh?",
    "Crashes occasionaly!",
    "Watch out for cheaters!",
    "G.CONFIG.a143=100",
    "Sprechen sie deutsch?",
    "Always nice weather!",
    "Don't forget to have fun!",
    "Rocks are OP!",
    "*blushes*",
    "Welcome Back, again!",
    "What are you looking at?",
    "Miku Miku oo ee oo",
    "Never Gonna Give You Up",
    "( ͡° ͜ʖ ͡°)",
    "Nuh uh uh!",
    "BOO! are you scared?",
    "what are you doing today?",
    ". . .",
    "",
    "Powered by magic!",
    "The Game!"
];

var randomMessage = messages[Math.floor(Math.random() * messages.length)];
// Set the innerText to the random message
flashingText.innerText = randomMessage;
logoElement.parentElement.appendChild(flashingText);
// Apply your styles
flashingText.style.position = "absolute";
flashingText.style.top = "-13%"; // Place it near the top of the page, adjust as needed
flashingText.style.left = "36%"; // Adjust horizontal position as needed
flashingText.style.transform = "translateX(-50%) rotate(-13deg)"; // Center and rotate
flashingText.style.margin = "0";
flashingText.style.width = "40%";
flashingText.style.animation = "FlashingText 0.5s ease-in-out infinite";
flashingText.style.color = "#FFFF00";
flashingText.style.fontSize = "20px";
flashingText.style.zIndex = "9999";
flashingText.style.fontFamily = "Minecraftia";
flashingText.style.textShadow = "#343c03 2px 2px";


// Dynamically create and append the @keyframes for the animation
// Create a <style> tag
const styleTag = document.createElement("style");
styleTag.innerHTML = `
  input#customServer {
    color: #ffffff !important;
  }
`;

// Append the <style> tag to the <head>
document.head.appendChild(styleTag);
const styleSheet = document.createElement("style");
styleSheet.innerHTML = `
  @keyframes FlashingText {
    0% { transform: scale(1) rotate(-13deg); }
    50% { transform: scale(1.05) rotate(-13deg); }
    100% { transform: scale(1) rotate(-13deg); }
  }
`;
document.head.appendChild(styleSheet);

var checkElementsInterval = setInterval(function() {
    var customServerInput = document.getElementById("customServer");


    var el = document.getElementById('cross-promo')
    var discord = document.getElementById("discord");
    var topleft = document.getElementById("topleft");
    var playBtn = document.getElementById("playbtn");
   // var customServerInput = document.getElementById("customServer");
    var rightwrap = document.getElementById("rightwrap");

    if (el && discord && topleft && !playBtn.disabled) {
        rightwrap.style.display = "none"; //hide thingy to the right

        customServerInput.style.setProperty("color", "#ffffff", "important");
        customServerInput.style.height = "63px";
        customServerInput.style.width = "100%";
        customServerInput.style.textAlign = "center";
        customServerInput.style.fontSize = "15px";
        customServerInput.style.fontFamily = "Minecraftia";
        customServerInput.style.color = "#ffffff";
        customServerInput.style.background = "#5e5e5e";
        customServerInput.style.textShadow = "rgba(0, 0, 0, 0.667) 2px 2px";
        customServerInput.style.boxShadow = "rgba(0, 0, 0, 0.267) 2px 4px inset, rgba(255, 255, 255, 0.333) -2px -2px inset";

        // Select the Play button element
        playBtn = document.getElementById("playbtn");

        // Apply the Minecraft-themed styles
        playBtn.style.cursor = "pointer";
        playBtn.style.overflow = "hidden";
        playBtn.style.whiteSpace = "nowrap";
        playBtn.style.userSelect = "none";

        // Background and border
        playBtn.style.background = "#999 url('https://i.ibb.co/rb2TWXL/bgbtn.png') center / cover";
        playBtn.style.imageRendering = "pixelated";
        playBtn.style.border = "2px solid #000";

        // Text styles
        playBtn.style.color = "#DDD"; // Title text color
        playBtn.style.textShadow = "2px 2px #000A"; // Title text shadow
        playBtn.style.boxShadow = "inset -2px -4px #0006, inset 2px 2px #FFF7"; // Title box shadow
        playBtn.style.fontFamily = "'Minecraftia', sans-serif"; // Add the font-family
        playBtn.style.fontSize = "12pt"; // Ensure the font size is similar to the original

        // Load the Minecraftia font (if it’s hosted externally or locally)
        fontFace.load().then(function (loadedFont) {
            // Add it to the document
            document.fonts.add(loadedFont);
            console.log("Minecraftia font loaded and applied!");
        }).catch(function (err) {
            console.error("Failed to load Minecraftia font!", err);
        });

        // Add hover effect using event listeners
        playBtn.addEventListener("mouseover", () => {
            playBtn.style.backgroundColor = "rgba(100, 100, 255, 0.45)";
            playBtn.style.textShadow = "2px 2px #202013CC";
            playBtn.style.color = "#FFFFA0";
        });

        playBtn.addEventListener("mouseout", () => {
            playBtn.style.backgroundColor = "";
            playBtn.style.textShadow = "2px 2px #000A";
            playBtn.style.color = "#DDD";
        });

        // Add active effect using event listeners
        playBtn.addEventListener("mousedown", () => {
            playBtn.style.boxShadow = "inset -2px -4px #0004, inset 2px 2px #FFF5";
        });

        playBtn.addEventListener("mouseup", () => {
            playBtn.style.boxShadow = "inset -2px -4px #0006, inset 2px 2px #FFF7";
        });
        el.remove();
        var newEl = document.createElement("div");
        newEl.id = "CheatNite";
        var anchor = document.createElement("a");
        anchor.textContent = "CheatNite Enhanced loaded!";
        anchor.href = "https://discord.gg/ye3bXsm6Qx";
        anchor.style.fontSize = "2em";
        newEl.appendChild(anchor);
        topleft.appendChild(newEl);
        console.log('CheatNite Enhanced loaded!');

        discord.href = "https://discord.gg/ye3bXsm6Qx";

        playBtn.removeAttribute("onclick");
        playBtn.onclick = customStartBtn;

        replaceVideoSource("https://cdn.pixabay.com/video/2024/11/24/243091.mp4");
        replaceImageSource("https://i.imgur.com/vBmhMgN.png");

        clearInterval(checkElementsInterval);
    }
}, 500);

/*
KEYBINDS
*/
//add fly/creative-mode keybind
document.addEventListener("keydown", function(event) {
  // check if 'f' key is pressed
  if (typeof(cheatnite) !== 'undefined' && document.activeElement && document.activeElement.tagName !== 'INPUT' && event.key === "f") {
    // Toggle the value of G.CONFIG.a143
    if (typeof(G) !== 'undefined' && typeof(G.CONFIG) !== 'undefined' && typeof(G.CONFIG.a143) !== 'undefined') {
        G.CONFIG.a143 = !G.CONFIG.a143;
        if (!G.CONFIG.a143) {
            G.CONFIG.a155 = 0.1;
            G.CONFIG.a156 = 0.3
            cheatnite.fly = false;
        } else {
            G.CONFIG.a155 = 100;
            G.CONFIG.a156 = 2;
            cheatnite.fly = true;
        }

        modifyCheatDisp("fly");
    }
  }
});

let isMouseDown = false;
document.addEventListener('mousedown', (event) => {
  if (event.button === 0) { // If left mouse button is pressed
    isMouseDown = true;
  }
});
document.addEventListener('mouseup', () => {
  isMouseDown = false;
});


//chatspam. Also a good example of keybinded-spam

document.addEventListener('keydown', (event) => {
  if (typeof(cheatnite) !== 'undefined' && document.activeElement && document.activeElement.tagName !== 'INPUT') {
    // Check if 'q' is pressed.
    if (event.key === 'q') {

      // If setInterval is running, clear it
      if (cheatnite.chatspam) {
        clearInterval(cheatnite.chatspam);
        cheatnite.chatspam = null;
        cheatnite.chatspam_count = 0; // Reset count
        cheatnite.chatspam_line = 0;  // Reset line index
      }

      // Else start a new setInterval
      else {
        var lines = [
            "▉▊▋▌▍▎▏▎▍▌▋▊▉▉▊▋▌▍▎▏▎▍▌▋▊▉",
            "▊▋▌▍▎▏▎▍▌▋▊▉▉▊▋▌▍▎▏▎▍▌▋▊▉▉",
            "▋▌▍▎▏▎▍▌▋▊▉▉▊▋▌▍▎▏▎▍▌▋▊▉▉▊",
            "▌▍▎▏▎▍▌▋▊▉▉▊▋▌▍▎▏▎▍▌▋▊▉▉▊▋",
            "▍▎▏▎▍▌▋▊▉▉▊▋▌▍▎▏▎▍▌▋▊▉▉▊▋▌",
            "▎▏▎▍▌▋▊▉▉▊▋▌▍▎▏▎▍▌▋▊▉▉▊▋▌▍",
            "▏▎▍▌▋▊▉▉▊▋▌▍▎▏▎▍▌▋▊▉▉▊▋▌▍▎",
            "▎▍▌▋▊▉▉▊▋▌▍▎▏▎▍▌▋▊▉▉▊▋▌▍▎▏",
            "▍▌▋▊▉▉▊▋▌▍▎▏▎▍▌▋▊▉▉▊▋▌▍▎▏▎",
            "▌▋▊▉▉▊▋▌▍▎▏▎▍▌▋▊▉▉▊▋▌▍▎▏▎▍",
            "▋▊▉▉▊▋▌▍▎▏▎▍▌▋▊▉▉▊▋▌▍▎▏▎▍▌",
            "▊▉▉▊▋▌▍▎▏▎▍▌▋▊▉▉▊▋▌▍▎▏▎▍▌▋",
            "▉▉▊▋▌▍▎▏▎▍▌▋▊▉▉▊▋▌▍▎▏▎▍▌▋▊",
        ];
        cheatnite.chatspam_line = 0; // Start from the first line
        cheatnite.chatspam = setInterval(() => {
          if (cheatnite.auto || isMouseDown) {
            var e = new a201();
            e.msg = lines[cheatnite.chatspam_line]; // Cycle through the lines
            cheatnite.chatspam_line = (cheatnite.chatspam_line + 1) % lines.length; // Increment and wrap around
            cheatnite.chatspam_count++;
            if (cheatnite.chatspam_count >= 1000)
              cheatnite.chatspam_count = 0;
            G.socket.send(e.a614());
          }
        }, 2000);
      }

      modifyCheatDisp("chatspam");
    }
  }
});



//bulletspam
document.addEventListener('keydown', (event) => {
  if (typeof(cheatnite) !== 'undefined' && document.activeElement && document.activeElement.tagName !== 'INPUT') {
      if (event.key === 'r' && !event.metaKey && !event.ctrlKey) {

        // If setInterval is running, clear it
        if (cheatnite.bulletspam) {
          clearInterval(cheatnite.bulletspam);
          cheatnite.bulletspam = null;
        }

        // Else start a new setInterval
        else {
          cheatnite.bulletspam = setInterval(() => {
            if (typeof(GAME) === 'undefined' || !GAME?.a865?.player || GAME.a865.player.dead) {
                clearInterval(cheatnite.bulletspam);
                cheatnite.bulletspam = null;
            }
            if (cheatnite.auto || isMouseDown) {
                shoot("shotgun")
                new Audio('https://minecraft.wiki/images/transcoded/Click_stereo.ogg/Click_stereo.ogg.mp3').play();
            }
          }, 100);
        }

        modifyCheatDisp("bulletspam");
      }
  }
});




//autorespawn
document.addEventListener('keydown', (event) => {
  if (typeof(cheatnite) !== 'undefined' && document.activeElement && document.activeElement.tagName !== 'INPUT') {
      if (event.key === 'x' && !event.metaKey && !event.ctrlKey) {

        // If setInterval is running, clear it
        if (cheatnite.autorespawn) {
          clearInterval(cheatnite.autorespawn);
          cheatnite.autorespawn = null;
        }

        // Else start a new setInterval
        else {
          cheatnite.autorespawn = setInterval(() => {
            if (typeof(GAME) === 'undefined' || !GAME?.a865?.player || GAME.a865.player.dead) {
                clearInterval(cheatnite.autorespawn);
                cheatnite.autorespawn = null;
            }
            if (cheatnite.auto || isMouseDown) {
                GAME.a865.player.respawn()
            }
          }, 100);
        }

        modifyCheatDisp("autorespawn");
      }
  }
});

//throw items
document.addEventListener('keydown', (event) => {
  if (typeof(cheatnite) !== 'undefined' && document.activeElement && document.activeElement.tagName !== 'INPUT') {
      if (event.key === 't' && !event.metaKey && !event.ctrlKey) {

        // If setInterval is running, clear it
        if (cheatnite.tntspam) {
          clearInterval(cheatnite.tntspam);
          cheatnite.tntspam = null;
        }

        // Else start a new setInterval
        else {
          cheatnite.tntspam = setInterval(() => {
            if (typeof(GAME) === 'undefined' || !GAME?.a865?.player || GAME.a865.player.dead) {
                clearInterval(cheatnite.tntspam);
                cheatnite.tntspam = null;
            }
            if (cheatnite.auto || isMouseDown) {
                throwItem("tnt")
            }
          }, 30);
        }

        modifyCheatDisp("tntspam");
      }
  }
});

//zoom
let isZoomedIn = false;
document.addEventListener('keydown', function(event) {
  if (typeof(cheatnite) !== 'undefined' && document.activeElement && document.activeElement.tagName !== 'INPUT' && event.key === 'z' && !isZoomedIn) {
    GAME.updateZoom(4);
    isZoomedIn = true;
    modifyCheatDisp("zoom (4x)");
  }
});
document.addEventListener('keyup', function(event) {
  if (typeof(cheatnite) !== 'undefined' && document.activeElement && document.activeElement.tagName !== 'INPUT' && event.key === 'z' && isZoomedIn) {
    GAME.updateZoom(1);
    isZoomedIn = false;
    modifyCheatDisp("zoom (4x)");
  }
});

//move bedrock floor
//credits: https://greasyfork.org/en/scripts/462757-craftnite-io-cheat
document.addEventListener('keydown', function(event) {
    if (document.activeElement && document.activeElement.tagName !== 'INPUT' && event.key === 'Shift') {
        cheatnite.shiftKeyPressed = true;
        G.CONFIG.environmentOceanFloorHeight = -10000;
    }
});

document.addEventListener('keyup', function(event) {
    if (document.activeElement && document.activeElement.tagName !== 'INPUT' && event.key === 'Shift') {
        cheatnite.shiftKeyPressed = false;
        G.CONFIG.environmentOceanFloorHeight = 260;
    }
});

// ESP
document.addEventListener('keydown', (event) => {
  if (typeof(cheatnite) !== 'undefined' && document.activeElement && document.activeElement.tagName !== 'INPUT' && event.key === 'e') {
      cheatnite.esp = !cheatnite.esp;
      modifyCheatDisp('ESP');
  }
});

// /item command
document.addEventListener('keydown', (event) => {
  if (typeof(cheatnite) !== 'undefined' && document.activeElement && document.activeElement.tagName !== 'INPUT' && event.key === 'c' && !event.metaKey && !event.ctrlKey) {
    cheatnite.customBlockId = getLookAtBlockId();
    cheatnite.updateCheatDisp = true;

    if (!cheatnite.customBlockId) {
        addCustomChat('<', 'Reset stone items.');
        return;
    }

    var stoneNeeded = 1000 - countItemInInv("stone");
    if (stoneNeeded > 0) {
        GAME.a865.player.a458("stone", stoneNeeded);
    }

    // Find the block name for the customBlockId
    const blockEntry = Object.entries(blocks).find(([name, id]) => id === cheatnite.customBlockId);
    const blockName = blockEntry ? blockEntry[0] : 'Unknown';
    const blockId = cheatnite.customBlockId;

    addCustomChat('<', `Thrown stone set to ${blockName} ${blockId}.`);
  }
});

// screenshot
document.addEventListener('keydown', (event) => {
  if (typeof(cheatnite) !== 'undefined' && document.activeElement && document.activeElement.tagName !== 'INPUT' && event.key === 'p' && typeof(GAME) !== 'undefined' && GAME?.renderer) {
      if (cheatnite.esp)
        hidePlayerBoxes();
      saveScene();
      if (cheatnite.esp)
        showPlayerBoxes();
  }
});

// noclip
document.addEventListener('keydown', (event) => {
  if (typeof(cheatnite) !== 'undefined' && document.activeElement && document.activeElement.tagName !== 'INPUT' && event.key === 'n') {
      cheatnite.noclip = !cheatnite.noclip;
      modifyCheatDisp("noclip");
  }
});

// ctrl-c and ctrl-v
document.addEventListener('keydown', (event) => {
  if (typeof(cheatnite) !== 'undefined' && document.activeElement && document.activeElement.tagName !== 'INPUT') {
    if ((event.ctrlKey || event.metaKey) && !cheatnite.shiftKeyPressed) {

        if (event.key === 'c') {
            if (cheatnite.worldedit.inprogress) {
                WorldEdit.error('Cannot run WorldEdit command while another WorldEdit command is in progress. Run /stop to stop current running WorldEdit command.');
                return;
            }
            if (!cheatnite.worldedit.pos1 || !cheatnite.worldedit.pos2) {
                WorldEdit.error('You must set /pos1 and /pos2 before running this worldedit command.');
                return;
            }

            WorldEdit.copy(cheatnite.worldedit.pos1.clone(), cheatnite.worldedit.pos2.clone());
        }
        else if (event.key === 'v') {
            if (cheatnite.worldedit.inprogress) {
                WorldEdit.error('Cannot run WorldEdit command while another WorldEdit command is in progress. Run /stop to stop current running WorldEdit command.');
                return;
            }
            if (!cheatnite.worldedit.clipboard[0]) {
                WorldEdit.error('Nothing is copied to clipboard.');
                return;
            }
            WorldEdit.paste(GAME.a865.player.position.clone());
        } else if (event.key === 'b') {
            if (cheatnite.worldedit.inprogress) {
                WorldEdit.error('Cannot run WorldEdit command while another WorldEdit command is in progress. Run /stop to stop current running WorldEdit command.');
                return;
            }
            const keys = Object.keys(cheatnite.worldedit.builds);
            if (keys.length === 0) {
                WorldEdit.error('You do not have any builds.')
                return;
            }
            WorldEdit.build(keys[keys.length - 1], GAME.a865.player.position.clone());
        }
    }
  }
});

// invisible
document.addEventListener('keydown', (event) => {
  if (typeof(cheatnite) !== 'undefined' && document.activeElement && document.activeElement.tagName !== 'INPUT' && event.key === 'i') {
      cheatnite.invisible = !cheatnite.invisible;
      tp(GAME.a865.player.position, false);
      modifyCheatDisp("invisible");
  }
});