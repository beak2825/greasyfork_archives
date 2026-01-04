// ==UserScript==
// @name         havvingyy Hack - Craftnite multi hack
// @namespace    http://tampermonkey.net/
// @version      6.4
// @description  Show the power of havvingyy
// @author       havvingyy - CEO
// @match        https://craftnite.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=craftnite.io
// @grant        none
// @license      by-nd 4.0
// @require https://greasyfork.org/scripts/475779-readschem/code/readschem.js?version=1253860
// @downloadURL https://update.greasyfork.org/scripts/553783/havvingyy%20Hack%20-%20Craftnite%20multi%20hack.user.js
// @updateURL https://update.greasyfork.org/scripts/553783/havvingyy%20Hack%20-%20Craftnite%20multi%20hack.meta.js
// ==/UserScript==
 
//Everything designed and created by havvingyy
 
//dispose of old client (if any)
if(typeof client !== 'undefined') {
  client.dispose();
};
 
// Block definitions for custom placement
const blocks = {"random": "random", "air":0,"stone":256,"stone_granite":257,"stone_granite_smooth":258,"stone_diorite":259,"stone_diorite_smooth":260,"stone_andesite":261,"stone_andesite_smooth":262,"grass":512,"dirt":770,"coarse_dirt":769,"cobblestone":1024,"planks_oak":1280,"planks_spruce":1281,"planks_birch":1282,"planks_jungle":1283,"planks_acacia":1284,"planks_big_oak":1285,"sapling_oak":1536,"sapling_spruce":1537,"sapling_birch":1538,"sapling_jungle":1539,"sapling_acacia":1540,"sapling_roofed_oak":1541,"bedrock":1792,"flowing_water":2048,"water":2304,"flowing_lava":2560,"lava":2816,"sand":3072,"red_sand":3073,"gravel":3328,"gold_ore":3584,"iron_ore":3840,"coal_ore":4096,"log_oak":4352,"log_spruce":4353,"log_birch":4354,"log_jungle":4355,"leaves_oak":4608,"leaves_spruce":4609,"leaves_birch":4610,"leaves_jungle":4611,"sponge":4864,"sponge_wet":4865,"glass":5120,"lapis_ore":5376,"lapis_block":5632,"dispenser":5888,"sandstone_normal":6144,"sandstone_carved":6145,"sandstone_smooth":6146,"noteblock":6400,"bed":6656,"golden_rail":6912,"detector_rail":7168,"sticky_piston":7424,"web":7680,"double_plant_grass":7936,"fern":7938,"deadbush":8192,"piston":8448,"piston_head":8704,"wool_colored_white":8960,"wool_colored_orange":8961,"wool_colored_magenta":8962,"wool_colored_light_blue":8963,"wool_colored_yellow":8964,"wool_colored_lime":8965,"wool_colored_pink":8966,"wool_colored_gray":8967,"wool_colored_silver":8968,"wool_colored_cyan":8969,"wool_colored_purple":8970,"wool_colored_blue":8971,"wool_colored_brown":8972,"wool_colored_green":8973,"wool_colored_red":8974,"wool_colored_black":8975,"piston_extension":9216,"yellow_flower":9472,"flower_rose":9728,"flower_blue_orchid":9729,"flower_allium":9730,"flower_houstonia":9731,"flower_tulip_red":9732,"flower_tulip_orange":9733,"flower_tulip_white":9734,"flower_tulip_pink":9735,"flower_oxeye_daisy":9736,"brown_mushroom":9984,"red_mushroom":10240,"gold_block":10496,"iron_block":10752,"double_stone_slab":11008,"brick":11012,"stonebrick":11013,"nether_brick":11014,"quartz_block":39681,"stone_slab":11278,"quartz_block_chiseled":11023,"sandstone_top":11273,"quartz_block_top":11279,"brick_block":11520,"tnt":11777,"bookshelf":12032,"mossy_cobblestone":12288,"obsidian":12544,"torch":12804,"fire":13056,"mob_spawner":13312,"oak_stairs":13568,"chest":13824,"redstone_wire":14080,"diamond_ore":14336,"diamond_block":14592,"crafting_table":14848,"wheat":15104,"farmland":15360,"furnace":15616,"lit_furnace":15872,"standing_sign":16128,"wooden_door":16384,"ladder":16640,"rail":16896,"stone_stairs":17152,"wall_sign":17408,"lever":17664,"stone_pressure_plate":17920,"iron_door":18176,"wooden_pressure_plate":18432,"redstone_ore":18688,"lit_redstone_ore":18944,"unlit_redstone_torch":19204,"redstone_torch":19460,"stone_button":19712,"snow_layer":19968,"ice":20224,"snow":20480,"cactus":20736,"clay":20992,"reeds":21248,"jukebox":21505,"fence":21760,"pumpkin":22016,"netherrack":22272,"soul_sand":22528,"glowstone":22784,"portal":23040,"lit_pumpkin":23296,"cake":23552,"unpowered_repeater":23808,"powered_repeater":24064,"glass_white":24320,"glass_orange":24321,"glass_magenta":24322,"glass_light_blue":24323,"glass_yellow":24324,"glass_lime":24325,"glass_pink":24326,"glass_gray":24327,"stained_glass":24328,"glass_cyan":24329,"glass_purple":24330,"glass_blue":24331,"glass_brown":24332,"glass_green":24333,"glass_red":24334,"glass_black":24335,"trapdoor":24576,"monster_egg":24837,"stonebrick_mossy":25089,"stonebrick_cracked":25090,"stonebrick_carved":25091,"brown_mushroom_block":25344,"red_mushroom_block":25600,"iron_bars":25856,"glass_pane":26112,"melon_block":26368,"pumpkin_stem":26624,"melon_stem":26880,"vine":27136,"fence_gate":27392,"brick_stairs":27648,"stone_brick_stairs":27904,"mycelium":28160,"waterlily":28416,"nether_brick_fence":28928,"nether_brick_stairs":29184,"nether_wart":29440,"enchanting_table":29696,"brewing_stand":29952,"cauldron":30208,"end_portal":30464,"end_portal_frame":30720,"end_stone":30976,"dragon_egg":31232,"redstone_lamp":31488,"lit_redstone_lamp":31744,"double_wooden_slab":32000,"wooden_slab":32256,"cocoa":32512,"sandstone_stairs":32768,"emerald_ore":33024,"ender_chest":33280,"tripwire_hook":33536,"tripwire":33792,"emerald_block":34048,"spruce_stairs":34304,"birch_stairs":34560,"jungle_stairs":34816,"command_block":35072,"beacon":35328,"cobblestone_wall":35584,"cobblestone_mossy":35585,"flower_pot":35840,"carrots":36096,"potatoes":36352,"wooden_button":36608,"skull":36864,"anvil":37120,"trapped_chest":37376,"light_weighted_pressure_plate":37632,"heavy_weighted_pressure_plate":37888,"unpowered_comparator":38144,"powered_comparator":38400,"daylight_detector":38656,"redstone_block":38912,"quartz_ore":39168,"hopper":39424,"quartz_block_lines":39682,"quartz_stairs":39936,"activator_rail":40192,"dropper":40448,"hardened_clay_stained_white":40704,"hardened_clay_stained_orange":40705,"hardened_clay_stained_magenta":40706,"hardened_clay_stained_light_blue":40707,"hardened_clay_stained_yellow":40708,"hardened_clay_stained_lime":40709,"hardened_clay_stained_pink":40710,"hardened_clay_stained_gray":40711,"hardened_clay_stained_silver":40712,"hardened_clay_stained_cyan":40713,"hardened_clay_stained_purple":40714,"hardened_clay_stained_blue":40715,"hardened_clay_stained_brown":40716,"hardened_clay_stained_green":40717,"hardened_clay_stained_red":40718,"hardened_clay_stained_black":40719,"stained_glass_pane":40960,"leaves_acacia":41216,"leaves_big_oak":41217,"log2":41473,"acacia_stairs":41728,"dark_oak_stairs":41984,"slime":42240,"barrier":42496,"iron_trapdoor":42752,"prismarine_rough":43008,"prismarine_bricks":43009,"prismarine_dark":43010,"sea_lantern":43264,"hay_block":43520,"carpet":43791,"hardened_clay":44032,"coal_block":44288,"packed_ice":44544,"double_plant":44800,"double_plant_syringa_top":44801,"double_plant_paeonia_top":44805,"standing_banner":45056,"wall_banner":45312,"daylight_detector_inverted":45568,"red_sandstone_normal":45824,"red_sandstone_carved":45825,"red_sandstone_smooth":45826,"red_sandstone_stairs":46080,"double_stone_slab2":46336,"stone_slab2":46592,"spruce_fence_gate":46848,"birch_fence_gate":47104,"jungle_fence_gate":47360,"dark_oak_fence_gate":47616,"acacia_fence_gate":47872,"spruce_fence":48128,"birch_fence":48384,"jungle_fence":48640,"dark_oak_fence":48896,"acacia_fence":49152,"spruce_door":49408,"birch_door":49664,"jungle_door":49920,"acacia_door":50176,"dark_oak_door":50432,"end_rod":50688,"chorus_plant":50944,"chorus_flower":51200,"purpur_block":51456,"purpur_pillar":51712,"purpur_stairs":51968,"purpur_double_slab":52224,"purpur_slab":52480,"end_bricks":52736,"beetroots":52992,"grass_path":53248,"end_gateway":53504,"repeating_command_block":53760,"chain_command_block":54016,"frosted_ice":54272,"magma":54528,"nether_wart_block":54784,"red_nether_brick":55040,"bone_block":55296,"item-snowball-blue":55781,"item-tnt-yellow":55782,"item-woodplank-grey":55783,"item-stoneball-grey":55784,"item-stairs-grey":55785,"item-pistol-grey":55786,"item-pickaxe-grey":55787,"item-uri-yellow":55788,"item-uri-purple":55789,"item-uri-blue":55790,"item-uri-green":55791,"item-uri-grey":55792,"item-ak47-yellow":55793,"item-ak47-purple":55794,"item-ak47-blue":55795,"item-ak47-green":55796,"item-ak47-grey":55797,"item-shotgun-yellow":55798,"item-shotgun-purple":55799,"item-shotgun-blue":55800,"item-shotgun-green":55801,"item-shotgun-grey":55802,"item-sniper-yellow":55803,"item-sniper-purple":55804,"item-sniper-blue":55805,"item-sniper-green":55806,"item-sniper-grey":55807,"observer":55808,"white_shulker_box":56064,"orange_shulker_box":56320,"magenta_shulker_box":56576,"light_blue_shulker_box":56832,"yellow_shulker_box":57088,"lime_shulker_box":57344,"pink_shulker_box":57600,"gray_shulker_box":57856,"light_gray_shulker_box":58112,"cyan_shulker_box":58368,"purple_shulker_box":58624,"blue_shulker_box":58880,"brown_shulker_box":59136,"green_shulker_box":59392,"red_shulker_box":59648,"black_shulker_box":59904,"white_glazed_terracotta":60160,"orange_glazed_terracotta":60416,"magenta_glazed_terracotta":60672,"light_blue_glazed_terracotta":60928,"yellow_glazed_terracotta":61184,"lime_glazed_terracotta":61440,"pink_glazed_terracotta":61696,"gray_glazed_terracotta":61952,"light_gray_glazed_terracotta":62208,"cyan_glazed_terracotta":62464,"purple_glazed_terracotta":62720,"blue_glazed_terracotta":62976,"brown_glazed_terracotta":63232,"green_glazed_terracotta":63488,"red_glazed_terracotta":63744,"black_glazed_terracotta":64000,"concrete_white":64256,"concrete_orange":64257,"concrete_magenta":64258,"concrete_light_blue":64259,"concrete_yellow":64260,"concrete_lime":64261,"concrete_pink":64262,"concrete_gray":64263,"concrete_silver":64264,"concrete_cyan":64265,"concrete_purple":64266,"concrete_blue":64267,"concrete_brown":64268,"concrete_green":64269,"concrete_red":64270,"concrete_black":64271,"concrete_powder_white":64512,"concrete_powder_orange":64513,"concrete_powder_magenta":64514,"concrete_powder_light_blue":64515,"concrete_powder_yellow":64516,"concrete_powder_lime":64517,"concrete_powder_pink":64518,"concrete_powder_gray":64519,"concrete_powder_silver":64520,"concrete_powder_cyan":64521,"concrete_powder_blue":64522,"concrete_powder_brown":64523,"concrete_powder_green":64524,"concrete_powder_red":64525,"concrete_powder_black":64527,"structure_block":65280};
 
const blockStrings = Object.keys(blocks).slice(1);
let blockCommands = ['item', '/set', '/box', '/replace', '/sphere', '/hsphere', '/flag', '/pakistan', '/ufo', '/mosque', '/car', '/aircraft', '/house', '/name'];
let commands = ['truecoords', 'ignore', 'unignore', 'unstuck', 'drain', 'item', 'invsize', 'tp', 'time', 'bg', '/p1', '/p2', '/pos1', '/pos2', '/stop', '/positions', '/set', '/box', '/replace', '/sphere', '/hsphere', '/flag', '/pakistan', '/ufo', '/mosque', '/car', '/aircraft', '/house', '/name', '/copy', '/paste', '/clearclipboard', '/load', '/save', '/build', '/builds', '/new'];
 
// ESP variables from CODE 2
let espGeometry, lineMaterial, red, espMaterial, textCanvas;
 
// Chat suggestions from CODE 2
let selectedIndex = -1;
let suggestions = [];
 
function chatCmdSuggestions(event) {
  let keyCode = event.keyCode;
 
  if (keyCode !== 40 && keyCode !== 38 && keyCode !== 13) {
    let filter = GAME.chatInput.value.toLowerCase();
 
    suggestions = [];
 
    if (filter.includes('/')) {
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
 
  if (keyCode === 40 || keyCode === 38 || keyCode === 13) {
    if (selectedIndex >= 0) {
      if (keyCode === 13) {
        GAME.chatInput.value = suggestions[selectedIndex] || GAME.chatInput.value;
        selectedIndex = -1;
        GAME.chatInput.focus();
        return;
      }
    }
 
    if (keyCode === 40) {
      selectedIndex++;
      if (selectedIndex >= suggestions.length) {
        selectedIndex = 0;
      }
    } else if (keyCode === 38) {
      selectedIndex--;
      if (selectedIndex < 0) {
        selectedIndex = suggestions.length - 1;
      }
    }
 
    GAME.chatInput.value = suggestions[selectedIndex] || GAME.chatInput.value;
  }
}
 
// WorldEdit helper functions from CODE 2
function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}
 
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
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
        convertedCoords.x = coords.x / 5 - 740;
        convertedCoords.y = coords.y / 5 - 53;
        convertedCoords.z = coords.z / 5 - 550;
    } else if(type === "true") {
        convertedCoords.x = (coords.x + 740) * 5;
        convertedCoords.y = (coords.y + 53) * 5;
        convertedCoords.z = (coords.z + 550) * 5;
    } else {
        throw new Error('convertCoords type must be "true" or "adjusted".');
    }
 
    return convertedCoords;
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
    const chunkCoords = GAME.a865.getChunkFromPos(pos);
    const [i, e, o] = chunkCoords;
 
    if (i>160 || e>160 || o>160)
        return null;
 
    const chunk = GAME.a865.a643s?.[i]?.[e]?.[o];
 
    if (!chunk) {
        return 0;
    }
 
    try {
        let insidePos;
        if (buildP) {
            insidePos = customPosToV(pos, chunk.buildP.clone());
        } else {
            insidePos = chunk.posToV(pos);
        }
 
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
 
  while (Object.keys(client.worldedit.builds).includes(filename)) {
    if (/\d+$/.test(filename)) {
      filename = filename.replace(/(\d+)$/, (match) => parseInt(match) + 1);
    } else {
      filename = filename + '1';
    }
  }
 
  return filename;
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
 
function flipObjectUpsideDown(points) {
  let flippedPoints = [];
 
  let minY = points[0].y;
  let maxY = points[0].y;
  for (let i = 1; i < points.length; i++) {
    minY = Math.min(minY, points[i].y);
    maxY = Math.max(maxY, points[i].y);
  }
 
  const yRange = maxY - minY;
 
  for (let i = 0; i < points.length; i++) {
    let point = points[i];
    let newY = minY + (yRange - (point.y - minY));
    flippedPoints.push(new THREE.Vector3(point.x, newY, point.z));
  }
 
  return flippedPoints;
}
 
const cbReplacer = (key, value) => {
  if (value && value.isVector3) {
    return [value.x, value.y, value.z];
  } else if (value instanceof Uint16Array) {
    return Array.from(value);
  }
  return value;
};
 
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
 
async function a637(positions, blockIds, errorCallback=null) {
    const indices = Array.from({length: positions.length}, (_, n) => n);
    // REMOVED shuffle(indices); to fix random block loading
 
    var index, chunkCoords, chunk, innerPos, pkt;
 
    for (var r = 0; r < indices.length; r++) {
        if (!client.worldedit.inprogress) {
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
 
        if (r % 10 === 9) {
            await sleep(client.server.r*150);
        }
    }
}
 
async function rawa637(iArr, eArr, oArr, vArr, uArr, errorCallback=null) {
    const indices = Array.from({length: iArr.length}, (_, n) => n);
    // REMOVED shuffle(indices); to fix random block loading
 
    var index, pkt;
 
    for (var r = 0; r < indices.length; r++) {
        if (!client.worldedit.inprogress) {
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
 
        if (r % 10 === 9) {
            await sleep(client.server.r*150);
        }
    }
}
 
// Teleport function from CheatNite
function tp(pos, updateVisual = true) {
    if (!window.GAME || !GAME.a865 || !GAME.a865.player) return;
    
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
 
// Draw leaderboard with player IDs
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
 
// Chat functions from CODE 2
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
        if (client.ignored && client.ignored.includes(G.othera822ers[t].id)) {
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
 
// Helper functions
function parseOutgoingChat(dv) {
    let msg = "";
 
    for (let i = 1; i < dv.byteLength; i += 2) {
        const charCode = dv.getUint16(i, true);
        msg += String.fromCharCode(charCode);
    }
 
    return msg;
}
 
// ESP functions from CODE 2
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
 
        player.a472.box.visible = client.esp;
 
        if (player.a472.visible && client.esp) {
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
 
// WorldEdit object from CODE 2 - COMPLETE
let WorldEdit = {};
 
WorldEdit.pos1 = function(args) {
    let me = GAME.a865.player;
    if (args.length === 0) {
        client.worldedit.pos1 = me.position.clone();
        addCustomChat('WorldEdit', `pos1 set to ${convertCoords(client.worldedit.pos1, "adjusted")}`)
    } else if (args.length === 3) {
        let nums = checkNumsInArr(args, 3)
        if (!nums) {
            this.error('Numbers expected as arguments.');
            return;
        }
        let unadjusted = new THREE.Vector3(nums[0], nums[1], nums[2]);
        client.worldedit.pos1 = convertCoords(unadjusted, "true");
        addCustomChat('WorldEdit', `pos1 set to ${convertCoords(client.worldedit.pos1, "adjusted")}`)
    } else {
        this.error(`Expected 0 or 3 arguments, got ${args.length}.`);
    }
    return;
}
 
WorldEdit.pos2 = function(args) {
    let me = GAME.a865.player;
    if (args.length === 0) {
        client.worldedit.pos2 = me.position.clone();
        addCustomChat('WorldEdit', `pos2 set to ${convertCoords(client.worldedit.pos2, "adjusted")}`)
    } else if (args.length === 3) {
        let nums = checkNumsInArr(args, 3)
        if (!nums) {
            this.error('Numbers expected as arguments.');
        }
        let unadjusted = new THREE.Vector3(nums[0], nums[1], nums[2]);
        client.worldedit.pos2 = convertCoords(unadjusted, "true");
        addCustomChat('WorldEdit', `pos2 set to ${convertCoords(client.worldedit.pos2, "adjusted")}`)
    } else {
        this.error(`Expected 0 or 3 arguments, got ${args.length}.`);
    }
    return;
}
 
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
        if (!client.worldedit.inprogress) {
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
        if (!client.worldedit.inprogress) {
            yield points;
            points = [];
        }
    }
    if (points.length > 0) {
        yield points;
    }
}
 
WorldEdit.generateFlagPoints = async function*(pointA, pointB, chunkSize) {
    let start = new THREE.Vector3(Math.floor(pointA.x / 5), Math.floor(pointA.y / 5), Math.floor(pointA.z / 5));
    let end = new THREE.Vector3(Math.floor(pointB.x / 5), Math.floor(pointB.y / 5), Math.floor(pointB.z / 5));
 
    let minX = Math.min(start.x, end.x);
    let maxX = Math.max(start.x, end.x);
    let minY = Math.min(start.y, end.y);
    let maxY = Math.max(start.y, end.y);
    let minZ = Math.min(start.z, end.z);
    let maxZ = Math.max(start.z, end.z);
 
    // Calculate current dimensions
    let currentWidth = maxX - minX + 1;
    let currentHeight = maxY - minY + 1;
    let depth = maxZ - minZ + 1;
 
    // Force 1:2 ratio (height:width) - width should be twice the height
    let targetHeight, targetWidth;
    if (currentWidth > currentHeight * 2) {
        // Width is too big for 1:2 ratio, adjust width to fit height
        targetHeight = currentHeight;
        targetWidth = Math.floor(currentHeight * 2);
    } else {
        // Height is too big for 1:2 ratio, adjust height to fit width
        targetWidth = currentWidth;
        targetHeight = Math.floor(currentWidth / 2);
    }
 
    // Center the flag in the selection
    let centerX = Math.floor((minX + maxX) / 2);
    let centerY = Math.floor((minY + maxY) / 2);
    
    minX = centerX - Math.floor(targetWidth / 2);
    maxX = minX + targetWidth - 1;
    minY = centerY - Math.floor(targetHeight / 2);
    maxY = minY + targetHeight - 1;
 
    let width = targetWidth;
    let height = targetHeight;
 
    // Calculate stripe heights (divide flag into 3 equal horizontal stripes)
    // Green at top, white in middle, black at bottom
    let stripeHeight = Math.floor(height / 3);
    let greenStripeEnd = minY + stripeHeight - 1;
    let whiteStripeStart = greenStripeEnd + 1;
    let whiteStripeEnd = whiteStripeStart + stripeHeight - 1;
    let blackStripeStart = whiteStripeEnd + 1;
 
    // Triangle calculations (red triangle on the left side with flat side on left, point on right)
    let triangleWidth = Math.floor(width * 0.4); // Triangle takes up 40% of the flag width
 
    let points = [];
    let blockIds = [];
 
    for (let z = minZ; z <= maxZ; z++) {
        for (let y = minY; y <= maxY; y++) {
            for (let x = minX; x <= maxX; x++) {
                let tempPos = new THREE.Vector3(x * 5 + 2.5, y * 5 + 2.5, z * 5 + 2.5);
                let blockType;
 
                // Calculate relative positions
                let relativeX = x - minX;
                let relativeY = y - minY;
 
                // Check if we're in the red triangle area (left side with flat side on left, point on right)
                let isInTriangle = false;
                if (relativeX < triangleWidth) {
                    // Distance from right edge of triangle
                    let distFromRight = triangleWidth - 1 - relativeX;
                    // Calculate triangle bounds at this X position
                    let triangleHalfHeight = (distFromRight * height) / (2 * triangleWidth);
                    let centerY = height / 2;
                    let distFromCenterY = Math.abs(relativeY - centerY);
                    
                    isInTriangle = distFromCenterY <= triangleHalfHeight;
                }
                
                if (isInTriangle) {
                    // Red triangle area (left side)
                    blockType = blocks.wool_colored_red; // 8974
                } else {
                    // Horizontal stripes area
                    if (y <= greenStripeEnd) {
                        // Green stripe (top)
                        blockType = blocks.wool_colored_lime; // 8965
                    } else if (y <= whiteStripeEnd) {
                        // White stripe (middle)
                        blockType = blocks.wool_colored_white; // 8960
                    } else {
                        // Black stripe (bottom) - use concrete powder
                        blockType = blocks.concrete_powder_black; // 64527
                    }
                }
 
                points.push(tempPos);
                blockIds.push(blockType);
 
                if (points.length >= chunkSize) {
                    yield [points, blockIds];
                    points = [];
                    blockIds = [];
                }
            }
        }
        await sleep(1);
        if (!client.worldedit.inprogress) {
            yield [points, blockIds];
            points = [];
            blockIds = [];
        }
    }
 
    if (points.length > 0) {
        yield [points, blockIds];
    }
}
 
WorldEdit.generatePakistanFlagPoints = async function*(pointA, pointB, chunkSize) {
    let start = new THREE.Vector3(Math.floor(pointA.x / 5), Math.floor(pointA.y / 5), Math.floor(pointA.z / 5));
    let end = new THREE.Vector3(Math.floor(pointB.x / 5), Math.floor(pointB.y / 5), Math.floor(pointB.z / 5));
 
    let minX = Math.min(start.x, end.x);
    let maxX = Math.max(start.x, end.x);
    let minY = Math.min(start.y, end.y);
    let maxY = Math.max(start.y, end.y);
    let minZ = Math.min(start.z, end.z);
    let maxZ = Math.max(start.z, end.z);
 
    // Calculate current dimensions
    let currentWidth = maxX - minX + 1;
    let currentHeight = maxY - minY + 1;
    let depth = maxZ - minZ + 1;
 
    // Force 2:3 ratio (height:width) - width should be 1.5 times the height
    let targetHeight, targetWidth;
    if (currentWidth > currentHeight * 1.5) {
        // Width is too big for 2:3 ratio, adjust width to fit height
        targetHeight = currentHeight;
        targetWidth = Math.floor(currentHeight * 1.5);
    } else {
        // Height is too big for 2:3 ratio, adjust height to fit width
        targetWidth = currentWidth;
        targetHeight = Math.floor(currentWidth / 1.5);
    }
 
    // Center the flag in the selection
    let centerX = Math.floor((minX + maxX) / 2);
    let centerY = Math.floor((minY + maxY) / 2);
    
    minX = centerX - Math.floor(targetWidth / 2);
    maxX = minX + targetWidth - 1;
    minY = centerY - Math.floor(targetHeight / 2);
    maxY = minY + targetHeight - 1;
 
    let width = targetWidth;
    let height = targetHeight;
 
    // Calculate white section (left 1/4 of the flag)
    let whiteWidth = Math.floor(width * 0.25);
    let whiteEnd = minX + whiteWidth - 1;
    let greenStart = whiteEnd + 1;
 
    // Calculate center of green section for moon and star
    let greenCenterX = greenStart + Math.floor((maxX - greenStart) / 2);
    let greenCenterY = minY + Math.floor(height / 2);
 
    let points = [];
    let blockIds = [];
 
    for (let z = minZ; z <= maxZ; z++) {
        for (let y = minY; y <= maxY; y++) {
            for (let x = minX; x <= maxX; x++) {
                let tempPos = new THREE.Vector3(x * 5 + 2.5, y * 5 + 2.5, z * 5 + 2.5);
                let blockType;
 
                if (x <= whiteEnd) {
                    // White section (left side)
                    blockType = blocks.concrete_white; // 64256
                } else {
                    // Green section (right side)
                    blockType = blocks.concrete_powder_green; // 64524
                    
                    // Add crescent moon and star
                    let moonRadius = Math.min(width, height) * 0.15;
                    let starRadius = Math.min(width, height) * 0.08;
                    
                    // Crescent moon (offset slightly to the left of center)
                    let moonOffsetX = greenCenterX - Math.floor(moonRadius * 0.8);
                    let moonDistFromCenter = Math.sqrt((x - moonOffsetX) * (x - moonOffsetX) + (y - greenCenterY) * (y - greenCenterY));
                    let innerMoonOffsetX = moonOffsetX + Math.floor(moonRadius * 0.6);
                    let innerMoonDistFromCenter = Math.sqrt((x - innerMoonOffsetX) * (x - innerMoonOffsetX) + (y - greenCenterY) * (y - greenCenterY));
                    
                    if (moonDistFromCenter <= moonRadius && innerMoonDistFromCenter > moonRadius * 0.7) {
                        blockType = blocks.concrete_white; // 64256 - white crescent
                    }
                    
                    // Five-pointed star (to the right of the moon)
                    let starCenterX = greenCenterX + Math.floor(moonRadius * 1.2);
                    let starDistFromCenter = Math.sqrt((x - starCenterX) * (x - starCenterX) + (y - greenCenterY) * (y - greenCenterY));
                    
                    if (starDistFromCenter <= starRadius) {
                        // Improved star algorithm
                        let angle = Math.atan2(y - greenCenterY, x - starCenterX);
                        
                        // Normalize angle to 0-2π
                        if (angle < 0) angle += 2 * Math.PI;
                        
                        // 5-pointed star has 10 sections (5 points, 5 valleys)
                        let sectionAngle = (2 * Math.PI) / 10; // 36 degrees per section
                        let sectionIndex = Math.floor(angle / sectionAngle);
                        let angleInSection = angle - (sectionIndex * sectionAngle);
                        
                        // Calculate radius at this angle
                        let outerRadius = starRadius;
                        let innerRadius = starRadius * 0.4; // Inner points are 40% of outer radius
                        
                        let targetRadius;
                        if (sectionIndex % 2 === 0) {
                            // Outer point section - interpolate from outer to inner
                            let t = angleInSection / sectionAngle;
                            targetRadius = outerRadius * (1 - t) + innerRadius * t;
                        } else {
                            // Inner point section - interpolate from inner to outer
                            let t = angleInSection / sectionAngle;
                            targetRadius = innerRadius * (1 - t) + outerRadius * t;
                        }
                        
                        if (starDistFromCenter <= targetRadius) {
                            blockType = blocks.concrete_white; // 64256 - white star
                        }
                    }
                }
 
                points.push(tempPos);
                blockIds.push(blockType);
 
                if (points.length >= chunkSize) {
                    yield [points, blockIds];
                    points = [];
                    blockIds = [];
                }
            }
        }
        await sleep(1);
        if (!client.worldedit.inprogress) {
            yield [points, blockIds];
            points = [];
            blockIds = [];
        }
    }
 
    if (points.length > 0) {
        yield [points, blockIds];
    }
}
 
WorldEdit.generateMosquePoints = async function*(centerPoint, size, chunkSize) {
    let points = [];
    let blockIds = [];
    
    // Base dimensions from center point and size
    let centerX = Math.floor(centerPoint.x / 5);
    let centerY = Math.floor(centerPoint.y / 5);
    let centerZ = Math.floor(centerPoint.z / 5);
    
    // Simple mosque dimensions
    let width = size;
    let depth = Math.floor(size * 0.8);
    let wallHeight = Math.floor(size * 0.4);
    let domeRadius = Math.floor(size * 0.3);
    let minaretRadius = 2;
    let minaretHeight = wallHeight + Math.floor(size * 0.6); // Much taller minarets
    
    // Calculate bounds
    let minX = centerX - Math.floor(width / 2);
    let maxX = centerX + Math.floor(width / 2);
    let minZ = centerZ - Math.floor(depth / 2);
    let maxZ = centerZ + Math.floor(depth / 2);
    let baseY = centerY;
    
    // Simple minaret positions (just 2 minarets at front corners)
    let minaret1X = minX + 3;
    let minaret1Z = minZ + 3;
    let minaret2X = maxX - 3;
    let minaret2Z = minZ + 3;
    
    for (let y = baseY; y <= baseY + minaretHeight + 5; y++) {
        for (let x = minX - 5; x <= maxX + 5; x++) {
            for (let z = minZ - 5; z <= maxZ + 5; z++) {
                let tempPos = new THREE.Vector3(x * 5 + 2.5, y * 5 + 2.5, z * 5 + 2.5);
                let blockType = null;
                
                // Main building
                if (x >= minX && x <= maxX && z >= minZ && z <= maxZ && y >= baseY && y <= baseY + wallHeight) {
                    let isWall = (x === minX || x === maxX || z === minZ || z === maxZ);
                    
                    if (y === baseY) {
                        // Floor - yellow glazed terracotta
                        blockType = blocks.yellow_glazed_terracotta; // 61184
                    } else if (isWall) {
                        // Walls - quartz blocks
                        blockType = blocks.quartz_block; // 39681
                        
                        // Simple entrance at front center
                        if (z === minZ && x >= centerX - 2 && x <= centerX + 2 && y >= baseY + 1 && y <= baseY + 3) {
                            blockType = 0; // air - entrance
                        }
                    }
                    // Interior is completely hollow (no blocks placed)
                }
                
                // Roof - quartz blocks
                if (y === baseY + wallHeight + 1 && x >= minX && x <= maxX && z >= minZ && z <= maxZ) {
                    blockType = blocks.quartz_block; // 39681 - quartz roof
                }
                
                // Complete dome - filled semi-sphere
                if (y > baseY + wallHeight + 1) {
                    let distFromCenter = Math.sqrt((x - centerX) * (x - centerX) + (z - centerZ) * (z - centerZ));
                    let heightFromRoof = y - (baseY + wallHeight + 1);
                    
                    // Semi-sphere calculation - make it complete
                    let maxDomeHeight = domeRadius;
                    if (heightFromRoof <= maxDomeHeight) {
                        let sphereY = heightFromRoof;
                        let sphereRadius = Math.sqrt(Math.max(0, domeRadius * domeRadius - sphereY * sphereY));
                        
                        if (distFromCenter <= sphereRadius) {
                            blockType = blocks.quartz_block; // 39681 - complete quartz dome
                        }
                    }
                }
                
                // Tall minaret 1 with crescent top
                let dist1 = Math.sqrt((x - minaret1X) * (x - minaret1X) + (z - minaret1Z) * (z - minaret1Z));
                if (dist1 <= minaretRadius && y >= baseY && y <= baseY + minaretHeight) {
                    if (dist1 >= minaretRadius - 1) {
                        blockType = blocks.quartz_block; // 39681 - quartz minaret walls
                    } else if (y === baseY) {
                        blockType = blocks.yellow_glazed_terracotta; // 61184 - terracotta base
                    }
                    // Minaret interior is hollow
                    
                    // Crescent moon on top
                    if (y >= baseY + minaretHeight - 4 && y <= baseY + minaretHeight) {
                        let crescentHeight = y - (baseY + minaretHeight - 4);
                        // Create crescent shape
                        if (crescentHeight >= 2) {
                            // Top part of crescent
                            if (x === minaret1X + 1 && z === minaret1Z) {
                                blockType = blocks.gold_block; // 10496 - gold crescent
                            } else if (x === minaret1X && z === minaret1Z + 1) {
                                blockType = blocks.gold_block; // 10496 - gold crescent
                            } else if (x === minaret1X && z === minaret1Z - 1) {
                                blockType = blocks.gold_block; // 10496 - gold crescent
                            }
                        }
                    }
                }
                
                // Tall minaret 2 with crescent top
                let dist2 = Math.sqrt((x - minaret2X) * (x - minaret2X) + (z - minaret2Z) * (z - minaret2Z));
                if (dist2 <= minaretRadius && y >= baseY && y <= baseY + minaretHeight) {
                    if (dist2 >= minaretRadius - 1) {
                        blockType = blocks.quartz_block; // 39681 - quartz minaret walls
                    } else if (y === baseY) {
                        blockType = blocks.yellow_glazed_terracotta; // 61184 - terracotta base
                    }
                    // Minaret interior is hollow
                    
                    // Crescent moon on top
                    if (y >= baseY + minaretHeight - 4 && y <= baseY + minaretHeight) {
                        let crescentHeight = y - (baseY + minaretHeight - 4);
                        // Create crescent shape
                        if (crescentHeight >= 2) {
                            // Top part of crescent
                            if (x === minaret2X - 1 && z === minaret2Z) {
                                blockType = blocks.gold_block; // 10496 - gold crescent
                            } else if (x === minaret2X && z === minaret2Z + 1) {
                                blockType = blocks.gold_block; // 10496 - gold crescent
                            } else if (x === minaret2X && z === minaret2Z - 1) {
                                blockType = blocks.gold_block; // 10496 - gold crescent
                            }
                        }
                    }
                }
                
                if (blockType !== null) {
                    points.push(tempPos);
                    blockIds.push(blockType);
 
                    if (points.length >= chunkSize) {
                        yield [points, blockIds];
                        points = [];
                        blockIds = [];
                    }
                }
            }
        }
        await sleep(1);
        if (!client.worldedit.inprogress) {
            yield [points, blockIds];
            points = [];
            blockIds = [];
        }
    }
 
    if (points.length > 0) {
        yield [points, blockIds];
    }
}
 
WorldEdit.generateCarPoints = async function*(centerPoint, chunkSize) {
    let points = [];
    let blockIds = [];
    
    // Base dimensions from center point
    let centerX = Math.floor(centerPoint.x / 5);
    let centerY = Math.floor(centerPoint.y / 5);
    let centerZ = Math.floor(centerPoint.z / 5);
    
    // Simple car dimensions
    let carLength = 8;  // Length (Z direction)
    let carWidth = 4;   // Width (X direction)
    let carHeight = 3;  // Height
    
    // Calculate bounds
    let minX = centerX - Math.floor(carWidth / 2);
    let maxX = centerX + Math.floor(carWidth / 2);
    let minZ = centerZ - Math.floor(carLength / 2);
    let maxZ = centerZ + Math.floor(carLength / 2);
    let baseY = centerY;
    
    // Wheel positions
    let wheelPositions = [
        { x: minX, z: minZ + 1 },    // Front left
        { x: maxX, z: minZ + 1 },    // Front right
        { x: minX, z: maxZ - 1 },    // Back left
        { x: maxX, z: maxZ - 1 }     // Back right
    ];
    
    for (let y = baseY; y <= baseY + carHeight + 1; y++) {
        for (let x = minX - 1; x <= maxX + 1; x++) {
            for (let z = minZ - 1; z <= maxZ + 1; z++) {
                let tempPos = new THREE.Vector3(x * 5 + 2.5, y * 5 + 2.5, z * 5 + 2.5);
                let blockType = null;
                
                // Car body
                if (x >= minX && x <= maxX && z >= minZ && z <= maxZ && y >= baseY && y <= baseY + carHeight) {
                    // Main body
                    if (y === baseY) {
                        // Bottom of car
                        blockType = blocks.concrete_red; // 64270 - red bottom
                    } else if (y === baseY + carHeight) {
                        // Top of car (roof)
                        if (z >= minZ + 1 && z <= maxZ - 1) {
                            blockType = blocks.concrete_red; // 64270 - red roof
                        }
                    } else {
                        // Sides and body
                        let isWall = (x === minX || x === maxX || z === minZ || z === maxZ);
                        if (isWall) {
                            blockType = blocks.concrete_red; // 64270 - red body
                            
                            // Windows
                            if (y === baseY + 2 && ((z === minZ && x >= minX + 1 && x <= maxX - 1) || 
                                                   (z === maxZ && x >= minX + 1 && x <= maxX - 1) ||
                                                   (x === minX && z >= minZ + 2 && z <= maxZ - 2) ||
                                                   (x === maxX && z >= minZ + 2 && z <= maxZ - 2))) {
                                blockType = blocks.glass; // 5120 - windows
                            }
                        }
                    }
                }
                
                // Wheels
                for (let wheel of wheelPositions) {
                    let wheelDist = Math.sqrt((x - wheel.x) * (x - wheel.x) + (z - wheel.z) * (z - wheel.z));
                    if (wheelDist <= 1 && y === baseY) {
                        blockType = blocks.concrete_black; // 64271 - black wheels
                    }
                }
                
                // Headlights
                if (y === baseY + 1 && z === minZ - 1 && (x === minX || x === maxX)) {
                    blockType = blocks.concrete_white; // 64256 - white headlights
                }
                
                // Taillights
                if (y === baseY + 1 && z === maxZ + 1 && (x === minX || x === maxX)) {
                    blockType = blocks.concrete_red; // 64270 - red taillights
                }
                
                if (blockType !== null) {
                    points.push(tempPos);
                    blockIds.push(blockType);
 
                    if (points.length >= chunkSize) {
                        yield [points, blockIds];
                        points = [];
                        blockIds = [];
                    }
                }
            }
        }
        await sleep(1);
        if (!client.worldedit.inprogress) {
            yield [points, blockIds];
            points = [];
            blockIds = [];
        }
    }
 
    if (points.length > 0) {
        yield [points, blockIds];
    }
}
 
WorldEdit.generateUfoPoints = async function*(centerPoint, radius, chunkSize) {
    let points = [];
    let blockIds = [];
    
    // UFO dimensions based on radius
    let mainRadius = radius;
    let domeRadius = Math.floor(radius * 0.6); // Dome is smaller than main disc
    let mainHeight = Math.max(2, Math.floor(radius * 0.3)); // Main disc height
    let domeHeight = Math.max(2, Math.floor(radius * 0.4)); // Dome height
    
    // Y levels
    let baseY = Math.floor(centerPoint.y / 5);
    let mainBottomY = baseY;
    let mainTopY = baseY + mainHeight - 1;
    let domeBottomY = mainTopY;
    let domeTopY = domeBottomY + domeHeight - 1;
    
    let centerX = Math.floor(centerPoint.x / 5);
    let centerZ = Math.floor(centerPoint.z / 5);
    
    // Build the UFO layer by layer
    for (let y = mainBottomY; y <= domeTopY; y++) {
        for (let x = centerX - mainRadius; x <= centerX + mainRadius; x++) {
            for (let z = centerZ - mainRadius; z <= centerZ + mainRadius; z++) {
                let tempPos = new THREE.Vector3(x * 5 + 2.5, y * 5 + 2.5, z * 5 + 2.5);
                let blockType = null;
                
                let distFromCenter = Math.sqrt((x - centerX) * (x - centerX) + (z - centerZ) * (z - centerZ));
                
                // Main disc section
                if (y >= mainBottomY && y <= mainTopY) {
                    // Calculate radius for this layer (elliptical profile)
                    let layerProgress = (y - mainBottomY) / Math.max(1, mainHeight - 1);
                    let currentRadius;
                    
                    if (layerProgress <= 0.3) {
                        // Bottom 30% - narrow base
                        currentRadius = mainRadius * (0.4 + 0.6 * (layerProgress / 0.3));
                    } else if (layerProgress <= 0.7) {
                        // Middle 40% - full width
                        currentRadius = mainRadius;
                    } else {
                        // Top 30% - slightly narrower
                        currentRadius = mainRadius * (1.0 - 0.2 * ((layerProgress - 0.7) / 0.3));
                    }
                    
                    if (distFromCenter <= currentRadius) {
                        if (distFromCenter >= currentRadius - 1) {
                            // Outer hull
                            if (y === mainBottomY) {
                                blockType = blocks.concrete_powder_black; // 64527 - dark bottom
                            } else if (y === mainTopY) {
                                blockType = blocks.concrete_gray; // 64263 - gray top
                            } else {
                                blockType = blocks.iron_block; // 10752 - metallic sides
                            }
                        } else if (distFromCenter >= currentRadius - 2) {
                            // Inner structure
                            blockType = blocks.concrete_silver; // 64264 - silver inner layer
                        } else {
                            // Interior space with some details
                            if (y === mainBottomY + 1 && distFromCenter <= 2) {
                                blockType = blocks.redstone_block; // 38912 - central equipment
                            } else if (Math.floor(distFromCenter) === Math.floor(currentRadius * 0.7) && y === Math.floor((mainBottomY + mainTopY) / 2)) {
                                // Ring of equipment
                                blockType = blocks.iron_block; // 10752
                            } else {
                                blockType = 0; // air
                            }
                        }
                        
                        // Add lights around the perimeter
                        if (Math.floor(distFromCenter) === Math.floor(currentRadius - 1) && y === Math.floor((mainBottomY + mainTopY) / 2)) {
                            if ((x + z) % 4 === 0) {
                                blockType = blocks.redstone_lamp; // 31488 - lights
                            }
                        }
                    }
                }
                
                // Dome section
                if (y >= domeBottomY && y <= domeTopY) {
                    let domeLayerProgress = (y - domeBottomY) / Math.max(1, domeHeight - 1);
                    
                    // Dome has spherical profile
                    let domeCurrentRadius = domeRadius * Math.sqrt(1 - domeLayerProgress * domeLayerProgress);
                    
                    if (distFromCenter <= domeCurrentRadius) {
                        if (distFromCenter >= domeCurrentRadius - 1 || y === domeTopY) {
                            // Dome exterior - dark glass
                            blockType = blocks.glass_gray; // 24327 - dark glass dome
                        } else if (distFromCenter <= 2 && y >= domeTopY - 2) {
                            // Central beacon area
                            blockType = blocks.glowstone; // 22784 - bright light
                        } else {
                            // Dome interior - light glass or air
                            blockType = blocks.glass; // 5120 - clear interior
                        }
                    }
                }
                
                if (blockType !== null) {
                    points.push(tempPos);
                    blockIds.push(blockType);
 
                    if (points.length >= chunkSize) {
                        yield [points, blockIds];
                        points = [];
                        blockIds = [];
                    }
                }
            }
        }
        await sleep(1);
        if (!client.worldedit.inprogress) {
            yield [points, blockIds];
            points = [];
            blockIds = [];
        }
    }
 
    if (points.length > 0) {
        yield [points, blockIds];
    }
}
 
WorldEdit.generateAircraftPoints = async function*(centerPoint, size, chunkSize) {
    let points = [];
    let blockIds = [];
    
    // Base dimensions from center point and size
    let centerX = Math.floor(centerPoint.x / 5);
    let centerY = Math.floor(centerPoint.y / 5);
    let centerZ = Math.floor(centerPoint.z / 5);
    
    // Aircraft dimensions based on size
    let fuselageLength = size;
    let fuselageWidth = Math.max(3, Math.floor(size * 0.3));
    let fuselageHeight = Math.max(3, Math.floor(size * 0.25));
    let wingSpan = Math.floor(size * 0.8);
    let wingLength = Math.floor(size * 0.4);
    let tailHeight = Math.floor(size * 0.3);
    
    // Calculate bounds for fuselage
    let minX = centerX - Math.floor(fuselageWidth / 2);
    let maxX = centerX + Math.floor(fuselageWidth / 2);
    let minY = centerY;
    let maxY = centerY + fuselageHeight;
    let minZ = centerZ - Math.floor(fuselageLength / 2);
    let maxZ = centerZ + Math.floor(fuselageLength / 2);
    
    for (let y = minY; y <= maxY + tailHeight; y++) {
        for (let x = centerX - Math.floor(wingSpan / 2); x <= centerX + Math.floor(wingSpan / 2); x++) {
            for (let z = minZ; z <= maxZ; z++) {
                let tempPos = new THREE.Vector3(x * 5 + 2.5, y * 5 + 2.5, z * 5 + 2.5);
                let blockType = null;
                
                // Main fuselage (hollow)
                if (x >= minX && x <= maxX && z >= minZ && z <= maxZ && y >= minY && y <= maxY) {
                    let isWall = (x === minX || x === maxX || y === minY || y === maxY || z === minZ || z === maxZ);
                    
                    if (isWall) {
                        blockType = blocks.quartz_block; // 39681 - white fuselage
                        
                        // Cockpit windows at front
                        if (z === minZ && y === maxY - 1 && x >= minX + 1 && x <= maxX - 1) {
                            blockType = blocks.glass; // 5120 - cockpit window
                        }
                        
                        // Side windows
                        if ((x === minX || x === maxX) && y === maxY - 1 && z >= minZ + 2 && z <= maxZ - 3) {
                            if ((z - minZ) % 3 === 0) {
                                blockType = blocks.glass; // 5120 - side windows
                            }
                        }
                    }
                    // Interior is hollow (no blocks)
                }
                
                // Wings (main wings at middle of fuselage)
                let wingY = minY + Math.floor(fuselageHeight / 2);
                let wingStartZ = centerZ - Math.floor(wingLength / 2);
                let wingEndZ = centerZ + Math.floor(wingLength / 2);
                
                if (y === wingY && z >= wingStartZ && z <= wingEndZ) {
                    // Left wing
                    if (x >= centerX - Math.floor(wingSpan / 2) && x < minX) {
                        blockType = blocks.quartz_block; // 39681 - wing
                    }
                    // Right wing
                    if (x > maxX && x <= centerX + Math.floor(wingSpan / 2)) {
                        blockType = blocks.quartz_block; // 39681 - wing
                    }
                }
                
                // Wing thickness (make wings 2 blocks thick)
                if ((y === wingY - 1 || y === wingY + 1) && z >= wingStartZ && z <= wingEndZ) {
                    // Left wing
                    if (x >= centerX - Math.floor(wingSpan / 2) && x < minX) {
                        // Only outer edge for thickness
                        if (x === centerX - Math.floor(wingSpan / 2) || x === minX - 1) {
                            blockType = blocks.quartz_block; // 39681 - wing edge
                        }
                    }
                    // Right wing
                    if (x > maxX && x <= centerX + Math.floor(wingSpan / 2)) {
                        // Only outer edge for thickness
                        if (x === centerX + Math.floor(wingSpan / 2) || x === maxX + 1) {
                            blockType = blocks.quartz_block; // 39681 - wing edge
                        }
                    }
                }
                
                // Tail section (vertical stabilizer)
                let tailStartZ = maxZ - Math.floor(fuselageLength * 0.2);
                if (x >= minX && x <= maxX && z >= tailStartZ && z <= maxZ && y > maxY && y <= maxY + tailHeight) {
                    if (x === minX || x === maxX || y === maxY + tailHeight || z === tailStartZ || z === maxZ) {
                        blockType = blocks.quartz_block; // 39681 - tail
                    }
                }
                
                // Horizontal tail fins
                let horizontalTailY = maxY + Math.floor(tailHeight / 2);
                let horizontalTailSpan = Math.floor(fuselageWidth * 1.5);
                if (y === horizontalTailY && z >= tailStartZ && z <= maxZ) {
                    if (x >= centerX - horizontalTailSpan && x < minX) {
                        blockType = blocks.quartz_block; // 39681 - horizontal tail left
                    }
                    if (x > maxX && x <= centerX + horizontalTailSpan) {
                        blockType = blocks.quartz_block; // 39681 - horizontal tail right
                    }
                }
                
                // Propeller at front (simple cross shape)
                if (z === minZ - 1 && y === maxY - 1 && x === centerX) {
                    blockType = blocks.iron_block; // 10752 - propeller center
                }
                if (z === minZ - 1 && y === maxY - 1) {
                    if (x === centerX - 2 || x === centerX + 2) {
                        blockType = blocks.iron_block; // 10752 - propeller blades horizontal
                    }
                }
                if (z === minZ - 1 && x === centerX) {
                    if (y === maxY - 3 || y === maxY + 1) {
                        blockType = blocks.iron_block; // 10752 - propeller blades vertical
                    }
                }
                
                // Landing gear (simple blocks under fuselage)
                if (y === minY - 1) {
                    // Front gear
                    if (x === centerX && z === minZ + 2) {
                        blockType = blocks.iron_block; // 10752 - front landing gear
                    }
                    // Main gear (left and right)
                    if (z === centerZ + 1) {
                        if (x === minX - 1 || x === maxX + 1) {
                            blockType = blocks.iron_block; // 10752 - main landing gear
                        }
                    }
                }
                
                if (blockType !== null) {
                    points.push(tempPos);
                    blockIds.push(blockType);
 
                    if (points.length >= chunkSize) {
                        yield [points, blockIds];
                        points = [];
                        blockIds = [];
                    }
                }
            }
        }
        await sleep(1);
        if (!client.worldedit.inprogress) {
            yield [points, blockIds];
            points = [];
            blockIds = [];
        }
    }
 
    if (points.length > 0) {
        yield [points, blockIds];
    }
}
 
WorldEdit.generateHousePoints = async function*(centerPoint, size, chunkSize) {
    let points = [];
    let blockIds = [];
    
    // Base dimensions from center point and size
    let centerX = Math.floor(centerPoint.x / 5);
    let centerY = Math.floor(centerPoint.y / 5);
    let centerZ = Math.floor(centerPoint.z / 5);
    
    // House dimensions based on size
    let houseWidth = size;
    let houseDepth = Math.floor(size * 0.8);
    let wallHeight = Math.floor(size * 0.4);
    let roofHeight = Math.floor(size * 0.3);
    
    // Calculate bounds
    let minX = centerX - Math.floor(houseWidth / 2);
    let maxX = centerX + Math.floor(houseWidth / 2);
    let minZ = centerZ - Math.floor(houseDepth / 2);
    let maxZ = centerZ + Math.floor(houseDepth / 2);
    let baseY = centerY;
    
    for (let y = baseY; y <= baseY + wallHeight + roofHeight; y++) {
        for (let x = minX; x <= maxX; x++) {
            for (let z = minZ; z <= maxZ; z++) {
                let tempPos = new THREE.Vector3(x * 5 + 2.5, y * 5 + 2.5, z * 5 + 2.5);
                let blockType = null;
                
                // Foundation/Floor
                if (y === baseY) {
                    blockType = blocks.planks_oak; // 1280 - oak wood floor
                }
                
                // Walls (hollow house)
                else if (y > baseY && y <= baseY + wallHeight) {
                    let isWall = (x === minX || x === maxX || z === minZ || z === maxZ);
                    
                    if (isWall) {
                        blockType = blocks.planks_oak; // 1280 - oak wood walls
                        
                        // Door at front center
                        if (z === minZ && x >= centerX - 1 && x <= centerX + 1 && y >= baseY + 1 && y <= baseY + 2) {
                            blockType = 0; // air - door opening
                        }
                        
                        // Windows on sides and back
                        if (y === baseY + 2) {
                            // Left wall window
                            if (x === minX && z >= centerZ - 1 && z <= centerZ + 1) {
                                blockType = blocks.glass; // 5120 - window
                            }
                            // Right wall window
                            if (x === maxX && z >= centerZ - 1 && z <= centerZ + 1) {
                                blockType = blocks.glass; // 5120 - window
                            }
                            // Back wall windows
                            if (z === maxZ && (x >= minX + 2 && x <= minX + 4 || x >= maxX - 4 && x <= maxX - 2)) {
                                blockType = blocks.glass; // 5120 - window
                            }
                        }
                    }
                    // Interior is hollow (no blocks placed)
                }
                
                // Triangular roof
                else if (y > baseY + wallHeight) {
                    let roofLevel = y - (baseY + wallHeight);
                    
                    // Calculate roof slope - triangular roof peaks in the middle (X direction)
                    let distFromCenterX = Math.abs(x - centerX);
                    let maxDistAtThisLevel = Math.floor(houseWidth / 2) - roofLevel + 1;
                    
                    if (roofLevel <= roofHeight && distFromCenterX <= maxDistAtThisLevel && distFromCenterX >= 0) {
                        // Only place blocks on the roof surface (not solid)
                        let isRoofSurface = false;
                        
                        // Roof surface conditions
                        if (distFromCenterX === maxDistAtThisLevel || // Outer edge
                            distFromCenterX === 0 && roofLevel === roofHeight || // Peak
                            z === minZ || z === maxZ) { // Front and back edges
                            isRoofSurface = true;
                        }
                        
                        if (isRoofSurface) {
                            blockType = blocks.planks_oak; // 1280 - oak wood roof
                        }
                    }
                }
                
                // Chimney (small chimney on one side of roof)
                let chimneyX = maxX - 2;
                let chimneyZ = maxZ - 2;
                if (x >= chimneyX && x <= chimneyX + 1 && z >= chimneyZ && z <= chimneyZ + 1) {
                    if (y >= baseY + wallHeight && y <= baseY + wallHeight + roofHeight + 3) {
                        let isChimneyWall = (x === chimneyX || x === chimneyX + 1 || z === chimneyZ || z === chimneyZ + 1);
                        if (isChimneyWall) {
                            blockType = blocks.stonebrick; // 11013 - stone brick chimney
                        }
                        // Chimney is hollow inside
                    }
                }
                
                if (blockType !== null) {
                    points.push(tempPos);
                    blockIds.push(blockType);
 
                    if (points.length >= chunkSize) {
                        yield [points, blockIds];
                        points = [];
                        blockIds = [];
                    }
                }
            }
        }
        await sleep(1);
        if (!client.worldedit.inprogress) {
            yield [points, blockIds];
            points = [];
            blockIds = [];
        }
    }
 
    if (points.length > 0) {
        yield [points, blockIds];
    }
}
 
WorldEdit.generateNamePoints = async function*(centerPoint, blockName, chunkSize) {
    let points = [];
    let blockIds = [];
    
    let centerX = Math.floor(centerPoint.x / 5);
    let centerY = Math.floor(centerPoint.y / 5);
    let centerZ = Math.floor(centerPoint.z / 5);
    
    let blockId = blocks[blockName];
    if (!blockId) {
        blockId = blocks.stone; // fallback to stone
    }
    
    // Letter dimensions
    let letterHeight = 7;
    let letterWidth = 5;
    let letterSpacing = 2;
    let totalWidth = (4 * letterWidth) + (3 * letterSpacing); // 4 letters + 3 spaces
    
    // Starting position (center the whole text)
    let startX = centerX - Math.floor(totalWidth / 2);
    let startY = centerY;
    let startZ = centerZ;
    
    // Define letters H, A, V, V in a 5x7 grid
    const letterH = [
        [1,0,0,0,1],
        [1,0,0,0,1],
        [1,0,0,0,1],
        [1,1,1,1,1],
        [1,0,0,0,1],
        [1,0,0,0,1],
        [1,0,0,0,1]
    ];
    
    const letterA = [
        [0,1,1,1,0],
        [1,0,0,0,1],
        [1,0,0,0,1],
        [1,1,1,1,1],
        [1,0,0,0,1],
        [1,0,0,0,1],
        [1,0,0,0,1]
    ];
    
    const letterV = [
        [1,0,0,0,1],
        [1,0,0,0,1],
        [1,0,0,0,1],
        [1,0,0,0,1],
        [0,1,0,1,0],
        [0,1,0,1,0],
        [0,0,1,0,0]
    ];
    
    const letters = [letterH, letterA, letterV, letterV];
    
    // Generate each letter
    for (let letterIndex = 0; letterIndex < letters.length; letterIndex++) {
        let letter = letters[letterIndex];
        let letterStartX = startX + letterIndex * (letterWidth + letterSpacing);
        
        for (let row = 0; row < letterHeight; row++) {
            for (let col = 0; col < letterWidth; col++) {
                if (letter[row][col] === 1) {
                    let x = letterStartX + col;
                    let y = startY + (letterHeight - 1 - row); // Flip Y so text reads correctly
                    let z = startZ;
                    
                    let tempPos = new THREE.Vector3(x * 5 + 2.5, y * 5 + 2.5, z * 5 + 2.5);
                    points.push(tempPos);
                    blockIds.push(blockId);
                    
                    if (points.length >= chunkSize) {
                        yield [points, blockIds];
                        points = [];
                        blockIds = [];
                    }
                }
            }
        }
        
        await sleep(1);
        if (!client.worldedit.inprogress) {
            yield [points, blockIds];
            points = [];
            blockIds = [];
        }
    }
    
    if (points.length > 0) {
        yield [points, blockIds];
    }
}
 
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
        if (!client.worldedit.inprogress) {
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
        if (!client.worldedit.inprogress) {
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
                    // Check if this point is on the surface (hollow sphere logic)
                    let isOnSurface = false;
                    
                    // Simple hollow sphere check - if point is within outer radius but not within inner radius
                    if (distanceSquared > innerRadiusSquared) {
                        isOnSurface = true;
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
        if (!client.worldedit.inprogress) {
            yield points;
            points = [];
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
    let [start, end, cbVolumes] = client.worldedit.clipboard;
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
 
WorldEdit.generatePointsFromBuild = async function*(buildName, start, chunkSize) {
    let tempPos;
    let shiftedPoints = [];
    let buildBlockIds = [];
    const buildBlocks = client.worldedit.builds[buildName];
    for (let i = 0; i < buildBlocks.length; i++) {
        tempPos = new THREE.Vector3(
            buildBlocks[i].pos[0] * 5 + start.x,
            buildBlocks[i].pos[1] * 5 + start.y,
            buildBlocks[i].pos[2] * 5 + start.z
        )
        const blockId = blocks[buildBlocks[i].name];
        if (getBlockIdAtPos(tempPos) !== blockId) {
            shiftedPoints.push(tempPos.clone())
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
}
 
WorldEdit.set = async function(start, end, blockName) {
    client.worldedit.inprogress = "set";
    client.updateCheatDisp = true;
 
    addCustomChat('WorldEdit', `Setting ${convertCoords(start, "adjusted")} - ${convertCoords(end, "adjusted")} to ${blockName} blocks...`);
 
    let blockId = blocks[blockName];
 
    let chunkSize = 30000;
    let generator = this.generatePointsNotOf(start, end, chunkSize, blockId);
 
    for await (let chunk of generator) {
        await a637(chunk, this.createBlockArr(chunk.length, blockId), ()=>{
            addCustomChat('WorldEdit', 'Stopped //set command.');
        });
        if (!client.worldedit.inprogress)
            return;
    }
 
    client.worldedit.inprogress = false;
    client.updateCheatDisp = true;
    addCustomChat('WorldEdit', 'Completed //set command.');
}
 
WorldEdit.box = async function(start, end, blockName) {
    client.worldedit.inprogress = "box";
    client.updateCheatDisp = true;
    addCustomChat('WorldEdit', `Generating a box from ${convertCoords(start, "adjusted")} to ${convertCoords(end, "adjusted")} using ${blockName} blocks...`);
 
    let blockId = blocks[blockName];
 
    let chunkSize = 30000;
    let generator = this.generateBoxPoints(start, end, chunkSize, blockId);
 
    for await (let chunk of generator) {
        await a637(chunk, this.createBlockArr(chunk.length, blockId), ()=>{
            addCustomChat('WorldEdit', 'Stopped //box command.');
        });
        if (!client.worldedit.inprogress)
            return;
    }
 
    client.worldedit.inprogress = false;
    client.updateCheatDisp = true;
    addCustomChat('WorldEdit', 'Completed //box command.');
}
 
WorldEdit.flag = async function(start, end) {
    client.worldedit.inprogress = "flag";
    client.updateCheatDisp = true;
    addCustomChat('WorldEdit', `Creating Palestine flag from ${convertCoords(start, "adjusted")} to ${convertCoords(end, "adjusted")}...`);
 
    let chunkSize = 30000;
    let generator = this.generateFlagPoints(start, end, chunkSize);
 
    for await (let chunk of generator) {
        await a637(chunk[0], chunk[1], ()=>{
            addCustomChat('WorldEdit', 'Stopped //flag command.');
        });
        if (!client.worldedit.inprogress)
            return;
    }
 
    client.worldedit.inprogress = false;
    client.updateCheatDisp = true;
    addCustomChat('WorldEdit', 'Completed //flag command.');
}
 
WorldEdit.pakistanFlag = async function(start, end) {
    client.worldedit.inprogress = "pakistanFlag";
    client.updateCheatDisp = true;
    addCustomChat('WorldEdit', `Creating Pakistan flag from ${convertCoords(start, "adjusted")} to ${convertCoords(end, "adjusted")}...`);
 
    let chunkSize = 30000;
    let generator = this.generatePakistanFlagPoints(start, end, chunkSize);
 
    for await (let chunk of generator) {
        await a637(chunk[0], chunk[1], ()=>{
            addCustomChat('WorldEdit', 'Stopped //pakistan command.');
        });
        if (!client.worldedit.inprogress)
            return;
    }
 
    client.worldedit.inprogress = false;
    client.updateCheatDisp = true;
    addCustomChat('WorldEdit', 'Completed //pakistan command.');
}
 
WorldEdit.mosque = async function(centerPoint, size) {
    client.worldedit.inprogress = "mosque";
    client.updateCheatDisp = true;
    addCustomChat('WorldEdit', `Creating improved mosque at ${convertCoords(centerPoint, "adjusted")} with size ${size}...`);
 
    let chunkSize = 30000;
    let generator = this.generateMosquePoints(centerPoint, size, chunkSize);
 
    for await (let chunk of generator) {
        await a637(chunk[0], chunk[1], ()=>{
            addCustomChat('WorldEdit', 'Stopped //mosque command.');
        });
        if (!client.worldedit.inprogress)
            return;
    }
 
    client.worldedit.inprogress = false;
    client.updateCheatDisp = true;
    addCustomChat('WorldEdit', 'Completed improved //mosque command.');
}
 
WorldEdit.car = async function(centerPoint) {
    client.worldedit.inprogress = "car";
    client.updateCheatDisp = true;
    addCustomChat('WorldEdit', `Creating simple car at ${convertCoords(centerPoint, "adjusted")}...`);
 
    let chunkSize = 30000;
    let generator = this.generateCarPoints(centerPoint, chunkSize);
 
    for await (let chunk of generator) {
        await a637(chunk[0], chunk[1], ()=>{
            addCustomChat('WorldEdit', 'Stopped //car command.');
        });
        if (!client.worldedit.inprogress)
            return;
    }
 
    client.worldedit.inprogress = false;
    client.updateCheatDisp = true;
    addCustomChat('WorldEdit', 'Completed //car command.');
}
 
WorldEdit.ufo = async function(centerPoint, radius) {
    client.worldedit.inprogress = "ufo";
    client.updateCheatDisp = true;
    addCustomChat('WorldEdit', `Creating UFO at ${convertCoords(centerPoint, "adjusted")} with radius ${radius}...`);
 
    let chunkSize = 30000;
    let generator = this.generateUfoPoints(centerPoint, radius, chunkSize);
 
    for await (let chunk of generator) {
        await a637(chunk[0], chunk[1], ()=>{
            addCustomChat('WorldEdit', 'Stopped //ufo command.');
        });
        if (!client.worldedit.inprogress)
            return;
    }
 
    client.worldedit.inprogress = false;
    client.updateCheatDisp = true;
    addCustomChat('WorldEdit', 'Completed //ufo command.');
}
 
WorldEdit.aircraft = async function(centerPoint, size) {
    client.worldedit.inprogress = "aircraft";
    client.updateCheatDisp = true;
    addCustomChat('WorldEdit', `Creating aircraft at ${convertCoords(centerPoint, "adjusted")} with size ${size}...`);
 
    let chunkSize = 30000;
    let generator = this.generateAircraftPoints(centerPoint, size, chunkSize);
 
    for await (let chunk of generator) {
        await a637(chunk[0], chunk[1], ()=>{
            addCustomChat('WorldEdit', 'Stopped //aircraft command.');
        });
        if (!client.worldedit.inprogress)
            return;
    }
 
    client.worldedit.inprogress = false;
    client.updateCheatDisp = true;
    addCustomChat('WorldEdit', 'Completed //aircraft command.');
}
 
WorldEdit.house = async function(centerPoint, size) {
    client.worldedit.inprogress = "house";
    client.updateCheatDisp = true;
    addCustomChat('WorldEdit', `Creating house at ${convertCoords(centerPoint, "adjusted")} with size ${size}...`);
 
    let chunkSize = 30000;
    let generator = this.generateHousePoints(centerPoint, size, chunkSize);
 
    for await (let chunk of generator) {
        await a637(chunk[0], chunk[1], ()=>{
            addCustomChat('WorldEdit', 'Stopped //house command.');
        });
        if (!client.worldedit.inprogress)
            return;
    }
 
    client.worldedit.inprogress = false;
    client.updateCheatDisp = true;
    addCustomChat('WorldEdit', 'Completed //house command.');
}
 
WorldEdit.name = async function(centerPoint, blockName) {
    client.worldedit.inprogress = "name";
    client.updateCheatDisp = true;
    addCustomChat('WorldEdit', `Creating "H A V V" text at ${convertCoords(centerPoint, "adjusted")} using ${blockName} blocks...`);
 
    let chunkSize = 30000;
    let generator = this.generateNamePoints(centerPoint, blockName, chunkSize);
 
    for await (let chunk of generator) {
        await a637(chunk[0], chunk[1], ()=>{
            addCustomChat('WorldEdit', 'Stopped //name command.');
        });
        if (!client.worldedit.inprogress)
            return;
    }
 
    client.worldedit.inprogress = false;
    client.updateCheatDisp = true;
    addCustomChat('WorldEdit', 'Completed //name command.');
}
 
WorldEdit.replace = async function(start, end, blockIdStart, blockNameEnd) {
    client.worldedit.inprogress = "replace";
    client.updateCheatDisp = true;
    addCustomChat('WorldEdit', `Replacing ${BLOCK_CONFIG[blockIdStart].name} with ${blockNameEnd} in ${convertCoords(start, "adjusted")} - ${convertCoords(end, "adjusted")}...`);
 
    let blockIdEnd = blocks[blockNameEnd];
 
    if (blockIdStart === blockIdEnd) {
        client.worldedit.inprogress = false;
        client.updateCheatDisp = true;
        addCustomChat('WorldEdit', 'Completed //replace command.');
        return;
    }
 
    let chunkSize = 30000;
    let generator = this.generatePointsOf(start, end, blockIdStart, chunkSize);
 
    for await (let chunk of generator) {
        await a637(chunk, this.createBlockArr(chunk.length, blockIdEnd), ()=>{
            addCustomChat('WorldEdit', 'Stopped //replace command.');
        });
        if (!client.worldedit.inprogress)
            return;
    }
 
    client.worldedit.inprogress = false;
    client.updateCheatDisp = true;
    addCustomChat('WorldEdit', 'Completed //replace command.');
}
 
WorldEdit.sphere = async function(centerPoint, blockName, radius) {
    client.worldedit.inprogress = "sphere";
    client.updateCheatDisp = true;
    addCustomChat('WorldEdit', `Creating a ${blockName} sphere with center ${convertCoords(centerPoint, "adjusted")} and radius ${radius}...`);
 
    let blockId = blocks[blockName];
 
    let chunkSize = 30000;
    let generator = this.generateSpherePoints(centerPoint, radius, chunkSize, blockId);
 
    for await (let chunk of generator) {
        await a637(chunk, this.createBlockArr(chunk.length, blockId), ()=>{
            addCustomChat('WorldEdit', 'Stopped //sphere command.');
        });
        if (!client.worldedit.inprogress)
            return;
    }
 
    client.worldedit.inprogress = false;
    client.updateCheatDisp = true;
    addCustomChat('WorldEdit', 'Completed //sphere command.');
}
 
WorldEdit.hollowSphere = async function(centerPoint, blockName, radius) {
    client.worldedit.inprogress = "hollow sphere";
    client.updateCheatDisp = true;
    addCustomChat('WorldEdit', `Creating a ${blockName} hollow sphere with center ${convertCoords(centerPoint, "adjusted")} and radius ${radius}...`);
 
    let blockId = blocks[blockName];
 
    let chunkSize = 30000;
    let generator = this.generateHollowSpherePoints(centerPoint, radius, chunkSize, blockId);
 
    for await (let chunk of generator) {
        await a637(chunk, this.createBlockArr(chunk.length, blockId), ()=>{
            addCustomChat('WorldEdit', 'Stopped //hsphere command.');
        });
        if (!client.worldedit.inprogress)
            return;
    }
 
    client.worldedit.inprogress = false;
    client.updateCheatDisp = true;
    addCustomChat('WorldEdit', 'Completed //hsphere command.');
}
 
WorldEdit.copy = async function(start, end) {
    addCustomChat('WorldEdit', `Saving volume ${convertCoords(start, "adjusted")} - ${convertCoords(end, "adjusted")} to clipboard...`);
    client.worldedit.clipboard = await this.copyChunks(start, end);
    addCustomChat('WorldEdit', 'Saved volume to clipboard.');
}
 
WorldEdit.paste = async function(start) {
    client.worldedit.inprogress = "paste";
    client.updateCheatDisp = true;
    addCustomChat('WorldEdit', `Pasting clipboard at ${convertCoords(start || client.worldedit.clipboard[0], "adjusted")}...`);
 
    let chunkSize = 30000;
    let generator = this.generatePointsFromClipboard(chunkSize, start);
 
    for await (const [x, y, z, insidePos, blockIds] of generator) {
        await rawa637(x, y, z, insidePos, blockIds, ()=>{
            addCustomChat('WorldEdit', 'Stopped //paste command.');
        })
        if (!client.worldedit.inprogress)
            return;
    }
 
    client.worldedit.inprogress = false;
    client.updateCheatDisp = true;
    addCustomChat('WorldEdit', 'Pasted volume.');
}
 
WorldEdit.build = async function(buildName, start) {
    client.worldedit.inprogress = "build";
    client.updateCheatDisp = true;
    addCustomChat('WorldEdit', `Building ${buildName} at ${convertCoords(start, "adjusted")}...`);
 
    let chunkSize = 30000;
    let generator = this.generatePointsFromBuild(buildName, start, chunkSize);
 
    for await (let chunk of generator) {
        await a637(chunk[0], chunk[1], ()=>{
            addCustomChat('WorldEdit', 'Stopped //build command.');
        });
        if (!client.worldedit.inprogress)
            return;
    }
 
    client.worldedit.inprogress = false;
    client.updateCheatDisp = true;
    addCustomChat('WorldEdit', 'Finished building '+buildName+'.');
}
 
WorldEdit.error = function(msg) {
    addCustomChat('WorldEdit.Error', msg);
}
 
WorldEdit.createBlockArr = function(len, blockId) {
    if (typeof(blockId) === 'number') {
        return Array(len).fill(blockId);
    } else {
        const filteredKeys = Object.keys(BLOCK_CONFIG).filter(key => parseInt(key) !== 0);
        const arr = Array.from({ length: len }, () => {
          return parseInt(filteredKeys[Math.floor(Math.random() * filteredKeys.length)]);
        })
        return arr;
    }
}
 
function checkInt(num) {
    return !isNaN(parseInt(num));
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
    if (!GAME?.a865?.player?.items) return count;
    for (const item of GAME.a865.player.items) {
        if (item !== -1 && item.a474Id === target && item.total) {
            count += item.total;
        }
    }
    return count;
}
 
function getBlockName(blockId) {
    for (let [name, id] of Object.entries(blocks)) {
        if (id === blockId) {
            return name;
        }
    }
    return `Block_${blockId}`;
}
 
function modifyCheatDisp(text) {
    const index = client.activatedCheats.indexOf(text);
    if (index !== -1) {
        client.activatedCheats.splice(index, 1);
    } else {
        client.activatedCheats.push(text);
    }
    client.updateCheatDisp = true;
}
 
var client = {
  Hacks: [],
  version: "2.9",
  keyBinds: {},
  inGame: false,
  customBlockId: 256,
  blockMenuOpen: false,
  commandMenuOpen: false,
  manualDisconnect: false,
  server: {},
  messageSent: false,
  currentSelectedIndex: 0,
  menuElements: [],
  blockElements: [],
  commandElements: [],
  noclip: false,
  invisible: false,
  shiftKeyPressed: false,
  activatedCheats: [],
  updateCheatDisp: true,
  esp: true,
  ignored: [],
  worldedit: {
    pos1: null,
    pos2: null,
    inprogress: false,
    clipboard: [null, null, {}],
    builds: {}
  }
};
 
client.showMessageStatus = function(message, color = "#00ff00") {
    const statusElement = document.createElement("div");
    statusElement.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(50,50,50,0.9) 100%);
        color: ${color};
        padding: 12px 20px;
        border-radius: 8px;
        font-weight: bold;
        font-size: 16px;
        border: 2px solid ${color};
        z-index: 10001;
        box-shadow: 0 4px 15px rgba(0,0,0,0.5);
        animation: fadeInOut 3s ease-in-out;
    `;
    statusElement.textContent = message;
 
    // Add CSS animation
    if (!document.getElementById('statusAnimationStyle')) {
        const style = document.createElement('style');
        style.id = 'statusAnimationStyle';
        style.textContent = `
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
                20% { opacity: 1; transform: translateX(-50%) translateY(0px); }
                80% { opacity: 1; transform: translateX(-50%) translateY(0px); }
                100% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
            }
        `;
        document.head.appendChild(style);
    }
 
    document.body.appendChild(statusElement);
 
    setTimeout(() => {
        if (statusElement.parentNode) {
            statusElement.parentNode.removeChild(statusElement);
        }
    }, 3000);
};
 
client.createKeybindContainer = function() {
    const container = document.createElement("div");
    container.id = "keybindContainer";
    container.style.cssText = `
        position: fixed;
        top: 10px;
        left: 10px;
        background: linear-gradient(135deg, #a47346 0%, #8B5A2B 100%);
        border: 3px solid #3D2317;
        border-radius: 12px;
        z-index: 1000;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        transition: all 0.3s ease;
        max-width: 500px;
        overflow: hidden;
    `;
 
    const header = document.createElement("div");
    header.style.cssText = `
        background: linear-gradient(135deg, #d4a574 0%, #b8926a 100%);
        color: #2C1810;
        padding: 10px 15px;
        font-weight: bold;
        font-size: 16px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: space-between;
        user-select: none;
    `;
 
    const title = document.createElement("span");
    title.textContent = "⚡ KEYBINDS ⚡";
 
    const arrow = document.createElement("span");
    arrow.textContent = "▼";
    arrow.style.cssText = `
        transition: transform 0.3s ease;
        font-size: 14px;
    `;
 
    header.appendChild(title);
    header.appendChild(arrow);
 
    const content = document.createElement("div");
    content.id = "keybindContent";
    content.style.cssText = `
        padding: 15px;
        color: #f4e6d7;
        font-size: 14px;
        line-height: 1.5;
        max-height: 200px;
        overflow-y: auto;
        transition: max-height 0.3s ease, padding 0.3s ease;
    `;
 
    let isCollapsed = false;
 
    header.onclick = () => {
        isCollapsed = !isCollapsed;
        if (isCollapsed) {
            content.style.maxHeight = "0px";
            content.style.padding = "0 15px";
            arrow.style.transform = "rotate(-90deg)";
        } else {
            content.style.maxHeight = "200px";
            content.style.padding = "15px";
            arrow.style.transform = "rotate(0deg)";
        }
    };
 
    container.appendChild(header);
    container.appendChild(content);
    document.body.appendChild(container);
 
    client.keybindContainer = container;
    client.keybindContent = content;
};
 
client.updateKeybindContent = function() {
    if (!client.keybindContent) return;
 
    let html = `
        <div style="margin-bottom: 10px;">
            <span style="color: #d4a574; font-weight: bold;">6</span> - open menu<br>
            <span style="color: #d4a574; font-weight: bold;">5</span> - block menu<br>
            <span style="color: #d4a574; font-weight: bold;">7</span> - building commands<br>
            <span style="color: #d4a574; font-weight: bold;">ctrl+esc</span> - safe exit<br>
            <span style="color: #d4a574; font-weight: bold;">n</span> - noclip<br>
            <span style="color: #d4a574; font-weight: bold;">i</span> - invisible<br>
            <span style="color: #d4a574; font-weight: bold;">e</span> - ESP
        </div>
    `;
 
    for(let i = 0; i < client.Hacks.length; i++){
        if(client.Hacks[i].key == "no keybind") continue;
        html += `<span style='color: #a47346; font-weight: bold;'>${client.Hacks[i].key}</span> - ${client.Hacks[i].name}<br>`;
    }
 
    client.keybindContent.innerHTML = html;
};
 
client.Hack = class {
  constructor(enable, mainLoop, disable, name, description, key, delay, configurationDefinition){
    this.enable = function(){try {enable(this_);}catch(e){}; this.isEnabled = true};
    this.mainLoop = mainLoop;
    this.disable = function(){try {disable(this_);}catch(e){}; this.isEnabled = false};
    this.name = name;
    this.description = description;
    this.isEnabled = false;
    this.key = key;
 
    this.configurationDefinition = configurationDefinition;
    this.config = {};
    setTimeout(function() {
      this_.configurationDefinition && Object.keys(this_.configurationDefinition).forEach(function (e) {
           this_.config[e] = localStorage[this_.name] && JSON.parse(localStorage[this_.name]).config[e] ? JSON.parse(localStorage[this_.name]).config[e] : this_.configurationDefinition[e].defaultValue != undefined ? this_.configurationDefinition[e].defaultValue : (this_.configurationDefinition[e].possibleValues && this_.configurationDefinition[e].possibleValues[0] != undefined) ? this_.configurationDefinition[e].possibleValues[0] : false;
        });
    }, 1);
 
    client.keyBinds[this.key] = this.name;
    var this_ = this;
    if(!delay){
      delay = 10;
    };
    function loop(){
      if(this_.isEnabled && client){
        this_.mainLoop(this_);
      };
      setTimeout(loop, delay);
    };
    setTimeout(loop, 100);
    client.Hacks.push(this);
  };
};
 
client.createCommandMenu = function() {
    if (client.commandMenuOpen) {
        client.closeCommandMenu();
        return;
    }
 
    client.commandMenuOpen = true;
 
    // Create main menu container
    const menu = document.createElement("div");
    menu.id = "commandMenu";
    menu.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 70%;
        height: 80%;
        background: linear-gradient(135deg, #a47346 0%, #8B5A2B 50%, #6B4226 100%);
        border: 4px solid #3D2317;
        box-shadow: 0 0 30px rgba(164, 115, 70, 0.6), inset 0 0 20px rgba(255, 255, 255, 0.1);
        z-index: 10000;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        border-radius: 15px;
    `;
 
    // Create header
    const header = document.createElement("div");
    header.style.cssText = `
        background: linear-gradient(135deg, #d4a574 0%, #b8926a 50%, #a47346 100%);
        color: #2C1810;
        padding: 15px;
        text-align: center;
        font-size: 28px;
        font-weight: bold;
        border-bottom: 4px solid #3D2317;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        letter-spacing: 2px;
    `;
    header.textContent = "⚒️ BUILDING COMMANDS ⚒️";
 
    // Create scrollable content area
    const content = document.createElement("div");
    content.style.cssText = `
        flex: 1;
        overflow-y: auto;
        padding: 20px;
        background: linear-gradient(135deg, #a47346 0%, #8B5A2B 100%);
        color: #f4e6d7;
        font-size: 16px;
        line-height: 1.6;
    `;
 
    // Building commands information
    const commandsInfo = `
        <div style="margin-bottom: 25px; padding: 20px; background: linear-gradient(135deg, #8B5A2B 0%, #6B4226 100%); border-radius: 12px; border: 3px solid #3D2317;">
            <h3 style="color: #d4a574; font-size: 22px; margin-bottom: 15px; text-align: center;">📋 POSITION COMMANDS</h3>
            <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 15px; font-weight: 600;">
                <div style="color: #f4e6d7;"><strong>/p1</strong> or <strong>/pos1</strong></div>
                <div>Set first position at your current location</div>
                <div style="color: #f4e6d7;"><strong>/p1 x y z</strong></div>
                <div>Set first position at specific coordinates</div>
                <div style="color: #f4e6d7;"><strong>/p2</strong> or <strong>/pos2</strong></div>
                <div>Set second position at your current location</div>
                <div style="color: #f4e6d7;"><strong>/p2 x y z</strong></div>
                <div>Set second position at specific coordinates</div>
                <div style="color: #f4e6d7;"><strong>/positions</strong></div>
                <div>Show current position selections</div>
            </div>
        </div>
 
        <div style="margin-bottom: 25px; padding: 20px; background: linear-gradient(135deg, #8B5A2B 0%, #6B4226 100%); border-radius: 12px; border: 3px solid #3D2317;">
            <h3 style="color: #d4a574; font-size: 22px; margin-bottom: 15px; text-align: center;">🏗️ BUILDING COMMANDS</h3>
            <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 15px; font-weight: 600;">
                <div style="color: #f4e6d7;"><strong>/set &lt;block&gt;</strong></div>
                <div>Fill selected area with specified block</div>
                <div style="color: #f4e6d7;"><strong>/box &lt;block&gt;</strong></div>
                <div>Create hollow box outline with specified block</div>
                <div style="color: #f4e6d7;"><strong>/flag</strong></div>
                <div>Create Palestine flag in selected area with 1:2 ratio and correct colors</div>
                <div style="color: #f4e6d7;"><strong>/pakistan</strong></div>
                <div>Create Pakistan flag in selected area with 2:3 ratio, white section, green section, and crescent moon with star</div>
                <div style="color: #f4e6d7;"><strong>/mosque &lt;size&gt;</strong></div>
                <div>Create mosque at pos1 - quartz walls, yellow terracotta floor, tall minarets with crescents, complete dome</div>
                <div style="color: #f4e6d7;"><strong>/car</strong></div>
                <div>Create simple red car at pos1 with black wheels, windows, and lights</div>
                <div style="color: #f4e6d7;"><strong>/ufo &lt;radius&gt;</strong></div>
                <div>Create UFO at pos1 location with specified radius - always horizontal with proper saucer shape</div>
                <div style="color: #f4e6d7;"><strong>/aircraft &lt;size&gt;</strong></div>
                <div>Create airplane at pos1 with specified size - white fuselage, wings, propeller, landing gear (hollow)</div>
                <div style="color: #f4e6d7;"><strong>/house &lt;size&gt;</strong></div>
                <div>Create wooden house at pos1 with specified size - oak walls, triangular roof, windows, door, chimney (hollow)</div>
                <div style="color: #f4e6d7;"><strong>/name &lt;block&gt;</strong></div>
                <div>Write "H A V V" in the air at pos1 using specified block - permanent fixed shape</div>
                <div style="color: #f4e6d7;"><strong>/replace &lt;block&gt;</strong></div>
                <div>Replace blocks you're looking at with specified block</div>
                <div style="color: #f4e6d7;"><strong>/sphere &lt;block&gt; &lt;radius&gt;</strong></div>
                <div>Create sphere at pos1 location</div>
                <div style="color: #f4e6d7;"><strong>/hsphere &lt;block&gt; &lt;radius&gt;</strong></div>
                <div>Create hollow sphere at pos1 location</div>
            </div>
        </div>
 
        <div style="margin-bottom: 25px; padding: 20px; background: linear-gradient(135deg, #8B5A2B 0%, #6B4226 100%); border-radius: 12px; border: 3px solid #3D2317;">
            <h3 style="color: #d4a574; font-size: 22px; margin-bottom: 15px; text-align: center;">📋 CLIPBOARD COMMANDS</h3>
            <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 15px; font-weight: 600;">
                <div style="color: #f4e6d7;"><strong>/copy</strong></div>
                <div>Copy selected area to clipboard</div>
                <div style="color: #f4e6d7;"><strong>/paste</strong></div>
                <div>Paste clipboard at your current location</div>
                <div style="color: #f4e6d7;"><strong>/paste original</strong></div>
                <div>Paste clipboard at original location</div>
                <div style="color: #f4e6d7;"><strong>/clearclipboard</strong></div>
                <div>Clear the clipboard</div>
            </div>
        </div>
 
        <div style="margin-bottom: 25px; padding: 20px; background: linear-gradient(135deg, #8B5A2B 0%, #6B4226 100%); border-radius: 12px; border: 3px solid #3D2317;">
            <h3 style="color: #d4a574; font-size: 22px; margin-bottom: 15px; text-align: center;">💾 FILE COMMANDS</h3>
            <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 15px; font-weight: 600;">
                <div style="color: #f4e6d7;"><strong>/load</strong></div>
                <div>Load schematic file from your computer</div>
                <div style="color: #f4e6d7;"><strong>/load &lt;url&gt;</strong></div>
                <div>Load schematic from URL</div>
                <div style="color: #f4e6d7;"><strong>/build</strong></div>
                <div>Build last loaded schematic at your location</div>
                <div style="color: #f4e6d7;"><strong>/build &lt;name&gt;</strong></div>
                <div>Build specific loaded schematic</div>
                <div style="color: #f4e6d7;"><strong>/builds</strong></div>
                <div>List all loaded schematics</div>
            </div>
        </div>
 
        <div style="margin-bottom: 25px; padding: 20px; background: linear-gradient(135deg, #8B5A2B 0%, #6B4226 100%); border-radius: 12px; border: 3px solid #3D2317;">
            <h3 style="color: #d4a574; font-size: 22px; margin-bottom: 15px; text-align: center;">🎯 TELEPORT COMMANDS</h3>
            <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 15px; font-weight: 600;">
                <div style="color: #f4e6d7;"><strong>/tp &lt;playerID&gt;</strong></div>
                <div>Teleport to player with specified ID (see player names for IDs)</div>
            </div>
        </div>
 
        <div style="margin-bottom: 25px; padding: 20px; background: linear-gradient(135deg, #8B5A2B 0%, #6B4226 100%); border-radius: 12px; border: 3px solid #3D2317;">
            <h3 style="color: #d4a574; font-size: 22px; margin-bottom: 15px; text-align: center;">⚠️ CONTROL COMMANDS</h3>
            <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 15px; font-weight: 600;">
                <div style="color: #f4e6d7;"><strong>/stop</strong></div>
                <div>Stop current WorldEdit command</div>
            </div>
        </div>
 
        <div style="padding: 20px; background: linear-gradient(135deg, #d4a574 0%, #b8926a 100%); border-radius: 12px; border: 3px solid #3D2317; color: #2C1810;">
            <h3 style="font-size: 20px; margin-bottom: 15px; text-align: center;">💡 USAGE TIPS</h3>
            <ul style="list-style: none; padding: 0;">
                <li style="margin-bottom: 8px;">• Use block names like: stone, dirt, glass, tnt, etc.</li>
                <li style="margin-bottom: 8px;">• Set pos1 and pos2 before using area commands</li>
                <li style="margin-bottom: 8px;">• Commands work in chat - just type them and press Enter</li>
                <li style="margin-bottom: 8px;">• Use /stop to cancel long operations</li>
                <li style="margin-bottom: 8px;">• Player IDs are shown in brackets next to names</li>
                <li style="margin-bottom: 8px;">• /aircraft creates white airplane with hollow fuselage, wings, and propeller</li>
                <li style="margin-bottom: 8px;">• /house creates wooden house with triangular roof and chimney (hollow inside)</li>
                <li style="margin-bottom: 8px;">• /name writes "H A V V" text in block letters at pos1 location</li>
                <li style="margin-bottom: 8px;">• All new structures (aircraft, house, UFO, car, mosque) are hollow inside</li>
                <li>• Size parameter controls overall dimensions of the structure</li>
            </ul>
        </div>
    `;
 
    content.innerHTML = commandsInfo;
 
    // Create close button
    const closeBtn = document.createElement("button");
    closeBtn.textContent = "✕";
    closeBtn.style.cssText = `
        position: absolute;
        top: 15px;
        right: 20px;
        background: linear-gradient(135deg, #ff6b6b 0%, #ff5252 100%);
        color: white;
        border: 3px solid #d32f2f;
        width: 40px;
        height: 40px;
        font-size: 24px;
        font-weight: bold;
        cursor: pointer;
        border-radius: 50%;
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        transition: all 0.3s ease;
    `;
    closeBtn.onmouseover = () => {
        closeBtn.style.transform = "scale(1.1)";
        closeBtn.style.boxShadow = "0 6px 12px rgba(0,0,0,0.4)";
    };
    closeBtn.onmouseleave = () => {
        closeBtn.style.transform = "scale(1)";
        closeBtn.style.boxShadow = "0 4px 8px rgba(0,0,0,0.3)";
    };
    closeBtn.onclick = client.closeCommandMenu;
 
    menu.appendChild(header);
    menu.appendChild(closeBtn);
    menu.appendChild(content);
    document.body.appendChild(menu);
};
 
client.closeCommandMenu = function() {
    const menu = document.getElementById("commandMenu");
    if (menu) {
        menu.remove();
    }
    client.commandMenuOpen = false;
};
 
client.createBlockMenu = function() {
    if (client.blockMenuOpen) {
        client.closeBlockMenu();
        return;
    }
 
    client.blockMenuOpen = true;
    client.currentSelectedIndex = 0;
    client.blockElements = [];
 
    // Create main menu container
    const menu = document.createElement("div");
    menu.id = "blockMenu";
    menu.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 60%;
        height: 70%;
        background: linear-gradient(135deg, #a47346 0%, #8B5A2B 50%, #6B4226 100%);
        border: 4px solid #3D2317;
        box-shadow: 0 0 30px rgba(164, 115, 70, 0.6), inset 0 0 20px rgba(255, 255, 255, 0.1);
        z-index: 10000;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        border-radius: 15px;
    `;
 
    // Create header
    const header = document.createElement("div");
    header.style.cssText = `
        background: linear-gradient(135deg, #d4a574 0%, #b8926a 50%, #a47346 100%);
        color: #2C1810;
        padding: 15px;
        text-align: center;
        font-size: 28px;
        font-weight: bold;
        border-bottom: 4px solid #3D2317;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        letter-spacing: 2px;
    `;
    header.textContent = "✦ SELECT BLOCK TO PLACE ✦";
 
    // Create search input
    const searchContainer = document.createElement("div");
    searchContainer.style.cssText = `
        padding: 15px;
        border-bottom: 2px solid #3D2317;
        background: linear-gradient(135deg, #8B5A2B 0%, #6B4226 100%);
    `;
    const searchInput = document.createElement("input");
    searchInput.type = "text";
    searchInput.placeholder = "🔍 Search blocks... (Use Tab to navigate, Enter to select)";
    searchInput.style.cssText = `
        width: 100%;
        padding: 12px 15px;
        font-size: 16px;
        border: 3px solid #3D2317;
        background: linear-gradient(135deg, #f4e6d7 0%, #e8d5c4 100%);
        color: #2C1810;
        border-radius: 25px;
        font-weight: 600;
        box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
        transition: all 0.3s ease;
    `;
 
    // Create scrollable content area
    const content = document.createElement("div");
    content.style.cssText = `
        flex: 1;
        overflow-y: auto;
        padding: 15px;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        gap: 12px;
        align-content: start;
        background: linear-gradient(135deg, #a47346 0%, #8B5A2B 100%);
    `;
 
    // Create close button
    const closeBtn = document.createElement("button");
    closeBtn.textContent = "✕";
    closeBtn.style.cssText = `
        position: absolute;
        top: 15px;
        right: 20px;
        background: linear-gradient(135deg, #ff6b6b 0%, #ff5252 100%);
        color: white;
        border: 3px solid #d32f2f;
        width: 40px;
        height: 40px;
        font-size: 24px;
        font-weight: bold;
        cursor: pointer;
        border-radius: 50%;
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        transition: all 0.3s ease;
    `;
    closeBtn.onmouseover = () => {
        closeBtn.style.transform = "scale(1.1)";
        closeBtn.style.boxShadow = "0 6px 12px rgba(0,0,0,0.4)";
    };
    closeBtn.onmouseleave = () => {
        closeBtn.style.transform = "scale(1)";
        closeBtn.style.boxShadow = "0 4px 8px rgba(0,0,0,0.3)";
    };
    closeBtn.onclick = client.closeBlockMenu;
 
    // Function to populate blocks
    function populateBlocks(filter = "") {
        content.innerHTML = "";
        client.blockElements = [];
        const blockEntries = Object.entries(blocks).slice(1); // Skip "random"
 
        blockEntries
            .filter(([name]) => name.toLowerCase().includes(filter.toLowerCase()))
            .forEach(([name, id], index) => {
                const blockBtn = document.createElement("div");
                const isSelected = client.customBlockId === id;
                const isFocused = index === client.currentSelectedIndex;
 
                blockBtn.style.cssText = `
                    background: ${isSelected ?
                        'linear-gradient(135deg, #f4e6d7 0%, #e8d5c4 50%, #d4a574 100%)' :
                        isFocused ?
                        'linear-gradient(135deg, #8B5A2B 0%, #6B4226 50%, #5A3621 100%)' :
                        'linear-gradient(135deg, #6B4226 0%, #5A3621 50%, #4A2A1A 100%)'};
                    color: ${isSelected ? '#2C1810' : '#f4e6d7'};
                    padding: 15px;
                    border: 3px solid ${isSelected ? '#3D2317' : isFocused ? '#d4a574' : '#8B5A2B'};
                    cursor: pointer;
                    text-align: center;
                    font-size: 14px;
                    font-weight: 600;
                    word-wrap: break-word;
                    transition: all 0.3s ease;
                    border-radius: 12px;
                    box-shadow: ${isSelected ?
                        '0 6px 15px rgba(164, 115, 70, 0.4), inset 0 2px 4px rgba(255,255,255,0.2)' :
                        isFocused ?
                        '0 6px 12px rgba(212, 165, 116, 0.4), inset 0 2px 4px rgba(255,255,255,0.15)' :
                        '0 4px 8px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.1)'};
                    transform: ${isSelected ? 'scale(1.05)' : isFocused ? 'scale(1.02)' : 'scale(1)'};
                `;
 
                blockBtn.innerHTML = `
                    <div style="font-weight: bold; margin-bottom: 8px; text-transform: capitalize; letter-spacing: 1px;">
                        ${name.replace(/_/g, ' ')}
                    </div>
                    <div style="font-size: 12px; opacity: 0.8; font-weight: 500;">
                        ID: ${id}
                    </div>
                `;
 
                blockBtn.onclick = () => {
                    client.selectBlock(id);
                };
 
                content.appendChild(blockBtn);
                client.blockElements.push({element: blockBtn, id: id, name: name});
            });
    }
 
    client.selectBlock = function(id) {
        client.customBlockId = id;
 
        // Give player stone if needed
        if (window.GAME?.a865?.player?.a458) {
            const stoneNeeded = 1000 - countItemInInv("stone");
            if (stoneNeeded > 0) {
                GAME.a865.player.a458("stone", stoneNeeded);
            }
        }
 
        client.closeBlockMenu();
        client.updateStatus();
    };
 
    client.updateBlockSelection = function() {
        client.blockElements.forEach((block, index) => {
            const isSelected = client.customBlockId === block.id;
            const isFocused = index === client.currentSelectedIndex;
 
            block.element.style.background = isSelected ?
                'linear-gradient(135deg, #f4e6d7 0%, #e8d5c4 50%, #d4a574 100%)' :
                isFocused ?
                'linear-gradient(135deg, #8B5A2B 0%, #6B4226 50%, #5A3621 100%)' :
                'linear-gradient(135deg, #6B4226 0%, #5A3621 50%, #4A2A1A 100%)';
 
            block.element.style.borderColor = isSelected ? '#3D2317' : isFocused ? '#d4a574' : '#8B5A2B';
            block.element.style.transform = isSelected ? 'scale(1.05)' : isFocused ? 'scale(1.02)' : 'scale(1)';
            block.element.style.boxShadow = isSelected ?
                '0 6px 15px rgba(164, 115, 70, 0.4), inset 0 2px 4px rgba(255,255,255,0.2)' :
                isFocused ?
                '0 6px 12px rgba(212, 165, 116, 0.4), inset 0 2px 4px rgba(255,255,255,0.15)' :
                '0 4px 8px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.1)';
        });
 
        // Scroll to focused element
        if (client.blockElements[client.currentSelectedIndex]) {
            client.blockElements[client.currentSelectedIndex].element.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    };
 
    // Search functionality
    searchInput.oninput = (e) => {
        populateBlocks(e.target.value);
        client.currentSelectedIndex = 0;
        client.updateBlockSelection();
    };
 
    searchContainer.appendChild(searchInput);
    menu.appendChild(header);
    menu.appendChild(closeBtn);
    menu.appendChild(searchContainer);
    menu.appendChild(content);
    document.body.appendChild(menu);
 
    populateBlocks();
    client.updateBlockSelection();
    searchInput.focus();
};
 
client.closeBlockMenu = function() {
    const menu = document.getElementById("blockMenu");
    if (menu) {
        menu.remove();
    }
    client.blockMenuOpen = false;
    client.blockElements = [];
};
 
client.updateStatus = function() {
    const statusText = client.customBlockId !== 256 ? `Custom Block: ${getBlockName(client.customBlockId)}` : "";
    if (client.hackList) {
        setTimeout(() => {
            client.hackList.innerHTML = client.hackList.innerHTML;
        }, 10);
    }
};
 
client.MenuElement = class {
  constructor(Hacks, title, left, top){
    var menuElement = document.createElement("div");
    menuElement.style = "left:"+left+"; color: rgba(255, 255, 255, 1) !important; top:"+top+"; margin: 25px; text-align: center; background: linear-gradient(135deg, #a47346 0%, #8B5A2B 50%, #6B4226 100%) !important; font-family: inherit; width:20%; height: 60%; position: absolute; border: 4px solid #3D2317; border-radius: 15px; box-shadow: 0 0 20px rgba(164, 115, 70, 0.5), inset 0 0 15px rgba(255, 255, 255, 0.1);";
    menuElement.id = title;
    menuElement.innerHTML = "<div style='border-bottom: 4px solid #3D2317; padding: 8%; background: linear-gradient(135deg, #d4a574 0%, #b8926a 50%, #a47346 100%); font-size: 200%; color: #2C1810; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); letter-spacing: 1px;' id="+title+"header >"+title+"</div>";
    client.menuElement.appendChild(menuElement);
 
    for(let i = 0; i < Hacks.length; i++) {
      var part = document.createElement("div");
      part.style = 'border-bottom: 4px solid #3D2317; font-size: 200%; transition: all 0.3s ease; padding: 3%;';
      part.id = Hacks[i].name;
      part.tabIndex = 0; // Make focusable
 
      if(Hacks[i].configurationDefinition) {
        let random = Math.floor(Math.random()*1000000);
        part.innerHTML = "<null>"+Hacks[i].name+"</null><img style='width: 25px;float:right;cursor:pointer; filter: brightness(0.9) sepia(1) hue-rotate(25deg) saturate(1.2);' onmouseover='this.style.filter=`brightness(0.5) sepia(1) hue-rotate(25deg) saturate(1.2)`' onmouseleave='this.style.filter=`brightness(0.9) sepia(1) hue-rotate(25deg) saturate(1.2)`' id="+random+" src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEwAACxMBAJqcGAAAAu1JREFUeJzt2L1qFFEAhuEv0Ub8KawsBBuDVqK9pBS8g9yGhY2VVyEItl6AYqmdipb2NoJFEAOCXTDEwh+yyv7Nzu45c+Z54FS7xcfMvDuwCQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEBOlR4ww6Ukd5LcSrKd5EvZOSzgdJLbSXaTXE6yn+Sw6KIGnUnyKMmPJMcnzrsk1wvuYra7ST5l8p59T3IvyVbBXU3ZTvIikxf55DlIcrPYOqbZS3KU6fftYbFljdnL9IsskjrNi+P49+c7pQa25FnmByKSeiwSx5/zoNDGpnzIYhdbJOUtE8dxkidlZq5mu/SAfxws8d2LSV5FJCXsJXma5Z6fr2vaMir3s/gvkjdJGcu+Of6c3RJjW3MuyceIpFZd43gef/X25mqSzxFJbbrG8TbJhQJ7m7YTkdREHBUSSR3EUTGRlCWOARBJGeIYEJFsljgGSCSbIY4BE8l6iaMBIlkPcTREJP0SR4NE0g9xNEwkqxHHCIikG3GMiEiW0zWONxHHYIlkMeIYMZHMJw5EMoU4+Eskk8TBf0TyiziYauyRiIO5xhqJOFjY2CIRB0sbSyTioLPWIxEHK2s1EnHQm9YiEQe9ayUScbA2Q45EHAzOpiIRB4O17kjEweCtKxJx0Iy+I+kax+uIg0r1FYk4aNaqkYiD5nWN5FvEwUh0jUQcjMa6IxEHg7euSMRBM/qORBw0p69IxEGzVo1EHDSvayTiYDSWjUQcjM6ikYiD0ZoXiTgYvStJXmYyjKMkj5OcLbiLKbZKDxipa0luJDlM8j7Jftk5AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMzwEyaMP2qlEyFaAAAAAElFTkSuQmCC'>";
        setTimeout(function () {
          document.getElementById(random).onclick = function (event,element) {
            client.renderConfig(Hacks[i]);
          }
          document.getElementById(random).onmouseover = function () {
            client.followText = Hacks[i].name+" options";
          }
          document.getElementById(random).onmouseleave = function () {
            client.followText = "";
          }
        }, 10);
      } else {
        part.innerHTML = "<null>"+Hacks[i].name+"</null>";
      }
 
      document.getElementById(title).appendChild(part);
      client.menuElements.push(part);
 
      const toggleHack = () => {
        if(!window.GAME) {client.error("You must be in a game to enable hacks!"); return};
        if(!Hacks[i].isEnabled){
          Hacks[i].enable();
          document.getElementById(Hacks[i].name).style.background = "linear-gradient(135deg, #f4e6d7 0%, #e8d5c4 100%)";
          document.getElementById(Hacks[i].name).style.color = "#2C1810";
          document.getElementById(Hacks[i].name).style.fontWeight = "bold";
          document.getElementById(Hacks[i].name).style.textShadow = "1px 1px 2px rgba(0,0,0,0.2)";
        } else {
          Hacks[i].disable();
          document.getElementById(Hacks[i].name).style.background = "transparent";
          document.getElementById(Hacks[i].name).style.color = "rgba(255, 255, 255, 1)";
          document.getElementById(Hacks[i].name).style.fontWeight = "normal";
          document.getElementById(Hacks[i].name).style.textShadow = "none";
        };
      };
 
      document.getElementById(Hacks[i].name).addEventListener("mousedown", function (event){
        if(event.target!=document.getElementById(Hacks[i].name) && event.target!=document.getElementById(Hacks[i].name).children[0]) {
          return;
        }
        toggleHack();
      });
 
      document.getElementById(Hacks[i].name).addEventListener("keydown", function (event){
        if(event.key === 'Enter') {
          toggleHack();
        }
      });
 
      document.getElementById(Hacks[i].name).addEventListener("mouseover", function (event){
          if(event.target!=document.getElementById(Hacks[i].name) && event.target!=document.getElementById(Hacks[i].name).children[0]) {
            return;
          }
          if(!Hacks[i].isEnabled) {
            document.getElementById(Hacks[i].name).style.background = "linear-gradient(135deg, rgba(164, 115, 70, 0.3) 0%, rgba(139, 90, 43, 0.3) 100%)";
          }
          client.followText = Hacks[i].description;
      });
      document.getElementById(Hacks[i].name).addEventListener("mouseleave", function (event){
          if(event.target!=document.getElementById(Hacks[i].name) && event.target!=document.getElementById(Hacks[i].name).children[0]) {
            return;
          }
          if(!Hacks[i].isEnabled) {
            document.getElementById(Hacks[i].name).style.background = "transparent";
          }
          client.followText = "";
      });
    };
  };
};
 
client.menuToggled = 0;
client.menuElement = document.createElement("div");
document.body.appendChild(client.menuElement);
client.menuElement.id = "vhc-menu";
client.menuElement.style.width = "100%";
client.menuElement.style.height = "100%";
client.menuElement.style.background = "rgba(0, 0, 0, 0.5)";
client.menuElement.style.position = "absolute";
client.menuElement.style.zIndex = 1000;
client.menuElement.style.top = "0";
 
client.hackList = document.createElement("h1");
document.body.appendChild(client.hackList);
client.hackList.style.color = "#fff";
client.hackList.style.position = "fixed";
client.hackList.style.top = "40%";
client.hackList.innerHTML = "VHC version "+client.version+"<br>";
client.hackList.style.zIndex = 1000;
client.hackList.style.fontSize = "20px";
client.hackList.style.textAlign = "left";
client.hackList.style.textShadow = "2px 2px 4px rgba(0,0,0,0.5)";
client.hackList.style.fontWeight = "600";
 
client.errorElement = document.createElement("h1");
document.body.appendChild(client.errorElement);
client.errorElement.style.color = "#fff";
client.errorElement.style.position = "absolute";
client.errorElement.style.top = "10%";
client.errorElement.style.width = "10%";
client.errorElement.style.fontSize = "100%";
client.errorElement.style.left = "40%";
client.errorElement.style.border = "solid red 1px";
client.errorElement.style.borderRadius = "7px";
client.errorElement.style.backgroundColor = "red";
client.errorElement.innerHTML = "client.errorElement";
client.errorElement.style.opacity = 0;
client.errorElement.style.transition = "all 0.3s";
client.errorElement.style.zIndex = "1000";
 
client.followText = "";
client.follow = document.createElement("div");
client.follow.style.pointerEvents = "none";
client.follow.style.position = "absolute";
client.follow.style.minWidth = "10em";
client.follow.style.maxWidth = "20em";
client.follow.style.zIndex = "9999";
client.follow.style.background = "linear-gradient(135deg, #a47346 0%, #8B5A2B 100%)";
client.follow.style.color = "#f4e6d7";
client.follow.style.padding = "8px 12px";
client.follow.style.borderRadius = "8px";
client.follow.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)";
client.follow.style.fontWeight = "600";
client.follow.style.fontSize = "14px";
document.body.appendChild(client.follow);
document.body.addEventListener("mousemove", function (e){
    client.follow.innerHTML = client.followText;
    client.followText ? client.follow.style.border = "2px solid #3D2317" : client.follow.style.border = "";
    x = e.pageX;
    y = e.pageY;
    client.follow.style.left = (x+10)+"px";
    client.follow.style.top = (y+10)+"px";
    if(x+10 > innerWidth-client.follow.getBoundingClientRect().width) client.follow.style.left = (innerWidth-client.follow.getBoundingClientRect().width)+"px"
});
 
client.error = function (text) {
  var audio = document.createElement("Audio");
  audio.src = "files/assets/31197478/1/Error-UI.mp3";
  audio.play();
  client.errorElement.innerHTML = text;
  client.errorElement.style.opacity = 1;
  setTimeout(function(){client.errorElement.style.opacity = 0;}, 1000)
};
 
client.preventKicks = function() {
    // Store original WebSocket close handler
    if (window.G && G.socket) {
        const originalClose = G.socket.close;
        const originalOnClose = G.socket.onclose;
        const originalOnError = G.socket.onerror;
 
        // Override WebSocket close to prevent unwanted disconnections
        G.socket.close = function(code, reason) {
            // Only allow manual disconnects or specific codes
            if (client.manualDisconnect || code === 1000 || code === 1001) {
                return originalClose.call(this, code, reason);
            }
            console.log("Prevented auto-disconnect with code:", code, "reason:", reason);
            return false;
        };
 
        // Override onclose to handle reconnection
        G.socket.onclose = function(event) {
            if (!client.manualDisconnect && event.code !== 1000 && event.code !== 1001) {
                console.log("Attempting reconnection...");
                setTimeout(() => {
                    if (!client.manualDisconnect) {
                        location.reload();
                    }
                }, 2000);
                return;
            }
            if (originalOnClose) {
                return originalOnClose.call(this, event);
            }
        };
 
        // Override onerror to prevent error-based kicks
        G.socket.onerror = function(event) {
            console.log("WebSocket error prevented:", event);
            // Don't call original error handler to prevent kicks
            return false;
        };
    }
 
    // Hook into game disconnect function
    if (window.GAME) {
        const originalDisconnect = GAME.disconnect;
        GAME.disconnect = function() {
            if (client.manualDisconnect) {
                return originalDisconnect.call(this);
            }
            console.log("Prevented game disconnect");
            return false;
        };
    }
 
    // Prevent page unload unless manual
    window.addEventListener('beforeunload', function(e) {
        if (!client.manualDisconnect) {
            e.preventDefault();
            e.returnValue = '';
            return '';
        }
    });
 
    // Hook into potential kick packets
    if (window.WebSocket && WebSocket.prototype.send) {
        const originalSend = WebSocket.prototype.send;
        WebSocket.prototype.send = function(data) {
            // Check for kick/ban packets and block them
            if (data instanceof ArrayBuffer || data instanceof Uint8Array) {
                const view = new DataView(data instanceof ArrayBuffer ? data : data.buffer);
                const opcode = view.getUint8(0);
 
                // Block common kick/disconnect opcodes (adjust these based on game)
                const kickOpcodes = [254, 255, 200, 201, 202]; // Common disconnect opcodes
                if (kickOpcodes.includes(opcode)) {
                    console.log("Blocked potential kick packet with opcode:", opcode);
                    return;
                }
            }
 
            return originalSend.call(this, data);
        };
    }
 
    console.log("Anti-kick protection enabled");
};
 
client.safeDisconnect = function() {
    client.manualDisconnect = true;
    if (window.GAME && GAME.disconnect) {
        GAME.disconnect();
    } else {
        window.location.reload();
    }
};
 
client.hookBlockPlacement = function() {
    try {
        if (window.G && G.Grid && G.Grid.prototype.a637) {
            const originalA637 = G.Grid.prototype.a637;
            G.Grid.prototype.a637 = function() {
                if (wasThrown() && arguments[1].length === 1 && arguments[1][0] == 256 && client.customBlockId !== 256) {
                    arguments[1] = [client.customBlockId];
                }
                return originalA637.apply(this, arguments);
            };
        }
    } catch (e) {
        console.log("Block placement hook failed:", e);
    }
};
 
document.addEventListener("keydown", function(event) {
    // Handle menu navigation for command menu
    if (client.commandMenuOpen) {
        if (event.key === 'Escape') {
            client.closeCommandMenu();
            return;
        }
    }
 
    // Handle menu navigation for block menu
    if (client.blockMenuOpen && client.blockElements.length > 0) {
        if (event.key === 'Tab') {
            event.preventDefault();
            if (event.shiftKey) {
                client.currentSelectedIndex = (client.currentSelectedIndex - 1 + client.blockElements.length) % client.blockElements.length;
            } else {
                client.currentSelectedIndex = (client.currentSelectedIndex + 1) % client.blockElements.length;
            }
            client.updateBlockSelection();
            return;
        }
        if (event.key === 'Enter') {
            event.preventDefault();
            if (client.blockElements[client.currentSelectedIndex]) {
                client.selectBlock(client.blockElements[client.currentSelectedIndex].id);
            }
            return;
        }
        if (event.key === 'Escape') {
            client.closeBlockMenu();
            return;
        }
    }
 
    // Handle menu navigation for main menu
    if (client.menuToggled && client.menuElements.length > 0) {
        if (event.key === 'Tab') {
            event.preventDefault();
            const currentIndex = client.menuElements.findIndex(el => el === document.activeElement);
            let nextIndex;
 
            if (event.shiftKey) {
                nextIndex = currentIndex <= 0 ? client.menuElements.length - 1 : currentIndex - 1;
            } else {
                nextIndex = currentIndex >= client.menuElements.length - 1 ? 0 : currentIndex + 1;
            }
 
            client.menuElements[nextIndex].focus();
            return;
        }
    }
 
    // Handle noclip toggle
    if (event.key === 'n' && document.activeElement && document.activeElement.tagName !== 'INPUT') {
        client.noclip = !client.noclip;
        modifyCheatDisp("noclip");
        return;
    }
 
    // Handle invisible toggle
    if (event.key === 'i' && document.activeElement && document.activeElement.tagName !== 'INPUT') {
        client.invisible = !client.invisible;
        if (client.invisible && window.GAME && GAME.a865 && GAME.a865.player) {
            tp(GAME.a865.player.position, false);
        }
        modifyCheatDisp("invisible");
        return;
    }
 
    // Handle ESP toggle
    if (event.key === 'e' && document.activeElement && document.activeElement.tagName !== 'INPUT') {
        client.esp = !client.esp;
        modifyCheatDisp('ESP');
        return;
    }
 
    // Handle shift key for ocean floor
    if (event.key === 'Shift' && document.activeElement && document.activeElement.tagName !== 'INPUT') {
        client.shiftKeyPressed = true;
        if (window.G && G.CONFIG) {
            G.CONFIG.environmentOceanFloorHeight = -10000;
        }
        return;
    }
 
    if (event.key == "6") {
      client.menuToggled = !client.menuToggled;
      if(!client.menuToggled && client.inGame){if(client.menuToggled){GAME.uiManager.menuActive=false;};GAME.a865.player.controls.lock(); GAME.closea793(); GAME.inChat = false};
 
      // Focus first menu element when opening
      if (client.menuToggled && client.menuElements.length > 0) {
        setTimeout(() => {
          client.menuElements[0].focus();
        }, 100);
      }
    };
    if (event.key == "5") {
      if (!client.blockMenuOpen && document.activeElement.tagName !== 'INPUT') {
        event.preventDefault();
        client.createBlockMenu();
      }
    };
    if (event.key == "7") {
      if (!client.commandMenuOpen && document.activeElement.tagName !== 'INPUT') {
        event.preventDefault();
        client.createCommandMenu();
      }
    };
    if (event.key == "Escape" && event.ctrlKey) {
      client.safeDisconnect();
    };
    if (client.keyBinds[event.key]) {
      try {
        if(document.activeElement==document.getElementById("chat")) return;
      } catch (e) {}
      if(!client.inGame) {client.error("You must be in a game to enable hacks!"); return};
      for(let i = 0; i < client.Hacks.length; i++){
        if(client.Hacks[i].name == client.keyBinds[event.key]){
          if(client.Hacks[i].isEnabled){
            client.Hacks[i].disable();
            document.getElementById(client.Hacks[i].name).style.background = "transparent";
            document.getElementById(client.Hacks[i].name).style.color = "rgba(255, 255, 255, 1)";
            document.getElementById(client.Hacks[i].name).style.fontWeight = "normal";
            document.getElementById(client.Hacks[i].name).style.textShadow = "none";
          } else {
            client.Hacks[i].enable();
            document.getElementById(client.Hacks[i].name).style.background = "linear-gradient(135deg, #f4e6d7 0%, #e8d5c4 100%)";
            document.getElementById(client.Hacks[i].name).style.color = "#2C1810";
            document.getElementById(client.Hacks[i].name).style.fontWeight = "bold";
            document.getElementById(client.Hacks[i].name).style.textShadow = "1px 1px 2px rgba(0,0,0,0.2)";
          };
        };
      };
    };
});
 
// Handle shift key release
document.addEventListener("keyup", function(event) {
    if (event.key === 'Shift' && document.activeElement && document.activeElement.tagName !== 'INPUT') {
        client.shiftKeyPressed = false;
        if (window.G && G.CONFIG) {
            G.CONFIG.environmentOceanFloorHeight = 260;
        }
    }
});
 
client.MAIN = function() {
    let statusLine = client.customBlockId !== 256 ? `<br><span style="color: #d4a574; font-weight: bold;">Custom Block: ${getBlockName(client.customBlockId)}</span>` : "";
    
    // Add active cheats display
    let activeCheatsDisplay = "";
    if (client.activatedCheats.length > 0) {
        activeCheatsDisplay = `<br><span style="color: #00ff00; font-weight: bold;">Active: ${client.activatedCheats.join(", ")}</span>`;
    }
 
    // Add worldedit status
    let worldeditStatus = "";
    if (client.worldedit.inprogress) {
        worldeditStatus = `<br><span style="color: #ffaa00; font-weight: bold;">WorldEdit: ${client.worldedit.inprogress}</span>`;
    }
    
    client.hackList.innerHTML = "<span style='color: #d4a574; font-size: 24px; font-weight: bold;'>✦ HAVVINGYY HACK v"+client.version+" ✦</span>"+statusLine+activeCheatsDisplay+worldeditStatus+"<br>";
 
    for(let i = 0; i < client.Hacks.length; i++){
      if(client.Hacks[i].isEnabled){
        client.hackList.innerHTML += "<span style='color: #a47346; font-weight: bold;'>●</span> " + client.Hacks[i].name+(client.Hacks[i].type ? " <b style='color: #d4a574'>["+client.Hacks[i].type+"]</b>" : " ")+"<br>";
      };
    };
 
    if (client.menuToggled) {
        document.exitPointerLock();
        client.menuElement.style.display = "block";
    } else {
        client.menuElement.style.display = "none";
    }
    setTimeout(client.MAIN, 10);
};
client.dispose = function () {
  console.log("disposing of client version "+client.version);
  client.Hacks.forEach(hack => {
    if(hack.isEnabled) {
      hack.disable();
    };
  });
  for (element in client) {
    if (client[element] && client[element].outerHTML) {
      client[element].outerHTML = "";
    }
    delete client[element];
  };
  client = undefined;
};
client.renderConfig = function (hack) {
  var elem = document.getElementById(hack.name);
  if(!elem.children[2]) {
    var config = document.createElement("div");
    config.style.background = "linear-gradient(135deg, #d4a574 0%, #b8926a 100%)";
    config.style.border = "4px solid #3D2317";
    config.style.position = "fixed";
    config.style.width = "20%";
    config.style.marginLeft = "-4px";
    config.style.borderRadius = "8px";
    config.style.boxShadow = "0 6px 15px rgba(0,0,0,0.3)";
    config.innerHTML = "<div style='border-bottom:4px solid #3D2317; padding: 10px; color: #2C1810; font-weight: bold; text-align: center; font-size: 18px;'>⚙️ SETTINGS ⚙️</div><div></div>";
    elem.appendChild(config);
    var list = config.children[1];
    list.style.fontSize = "18px";
    list.style.padding = "15px";
    list.style.color = "#2C1810";
    list.style.fontWeight = "600";
 
    Object.values(hack.configurationDefinition).forEach(function(config, index){
        switch(config.type) {
            case 0:
                list.innerHTML += "<div style='margin: 10px 0;'>" + Object.keys(hack.configurationDefinition)[index]+" <input type='checkbox' style='transform: scale(1.2); margin-left: 8px;' id='"+Object.keys(hack.configurationDefinition)[index]+"' onchange='client.processConfigChange.call(this, client.Hacks["+client.Hacks.indexOf(hack)+"], "+index+")'></input></div>";
                setTimeout(function(){
                    document.getElementById(Object.keys(hack.configurationDefinition)[index]).checked = hack.config[Object.keys(hack.configurationDefinition)[index]];
                }, 10);
                break
            case 1:
                list.innerHTML += "<div style='margin: 10px 0;'>" + Object.keys(hack.configurationDefinition)[index]+" <select style='margin-left: 8px; padding: 4px; border: 2px solid #3D2317; border-radius: 4px; background: #f4e6d7;' id='"+Object.keys(hack.configurationDefinition)[index]+"' onchange='client.processConfigChange.call(this, client.Hacks["+client.Hacks.indexOf(hack)+"], "+index+")'></select></div>";
                config.possibleValues.forEach(function(possibleValue) {
                    document.getElementById(Object.keys(hack.configurationDefinition)[index]).innerHTML += "<option value='"+possibleValue+"'>"+possibleValue+"</option>";
                });
                setTimeout(function(){
                    document.getElementById(Object.keys(hack.configurationDefinition)[index]).value = hack.config[Object.keys(hack.configurationDefinition)[index]];
                }, 10);
                break
            case 2:
                list.innerHTML += "<div style='margin: 10px 0;'>" + Object.keys(hack.configurationDefinition)[index]+" <input style='margin-left: 8px; padding: 4px; border: 2px solid #3D2317; border-radius: 4px; background: #f4e6d7; width: 80px;' id='"+Object.keys(hack.configurationDefinition)[index]+"' onchange='client.processConfigChange.call(this, client.Hacks["+client.Hacks.indexOf(hack)+"], "+index+")'></input></div>";
                setTimeout(function(){
                    document.getElementById(Object.keys(hack.configurationDefinition)[index]).value = hack.config[Object.keys(hack.configurationDefinition)[index]];
                }, 10);
                break
        }
    });
  }
  if(elem.children[2].style.display == "block") {
    elem.children[2].style.display = "none";
    elem.children[1].style.transform = "rotate(0deg)";
  } else {
    elem.children[2].style.display = "block";
    elem.children[1].style.transform = "rotate(180deg)";
  }
}
client.processConfigChange = function (hack,index) {
    var value = this.type == "checkbox" ? this.checked : this.value;
    var configName = Object.keys(hack.config)[index];
    hack.config[configName]=value;
    localStorage[hack.name] = localStorage[hack.name] || "{\"config\":{}}";
    var newData = JSON.parse(localStorage[hack.name]);
    newData.config[configName] = value;
    localStorage[hack.name] = JSON.stringify(newData);
}
 
client.init = function() {
  console.log(client.version+" running on "+navigator.platform);
 
  client.preventKicks();
  client.hookBlockPlacement();
  client.createKeybindContainer();
 
  const hookInterval = setInterval(() => {
    if (window.G && G.Grid && G.Grid.prototype.a637) {
      client.hookBlockPlacement();
      clearInterval(hookInterval);
    }
  }, 1000);
 
  // Hook the core game functions for noclip, invisible, and leaderboard
  const hookGameInterval = setInterval(() => {
    if (typeof(G) !== 'undefined' && G.a325 && G.a325.prototype.a71a668) {
      
      // Hook collision detection for noclip
      G.a325.prototype.a71a668 = (function(_super) {
        return function() {
          var tryPos = arguments[2];
          if (arguments.length === 7) {
            if (client.noclip) {
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
 
      clearInterval(hookGameInterval);
    }
  }, 500);
 
  // Hook position packets for invisible with better error handling
  const hookPositionInterval = setInterval(() => {
    if (typeof(a175) !== 'undefined' && a175.prototype.a614) {
      
      a175.prototype.a614 = (function(_super) {
        return function() {
          try {
            if (client.invisible && window.GAME && GAME.a865 && GAME.a865.player) {
              let me = GAME.a865.player;
              // Add safe random functions with fallbacks
              const safeRandInt = (min, max) => {
                try {
                  return window.G && G.randInt ? G.randInt(min, max) : Math.floor(Math.random() * (max - min + 1)) + min;
                } catch(e) {
                  return Math.floor(Math.random() * (max - min + 1)) + min;
                }
              };
              
              const safeRandFloat = (min, max) => {
                try {
                  return window.G && G.randFloat ? G.randFloat(min, max) : Math.random() * (max - min) + min;
                } catch(e) {
                  return Math.random() * (max - min) + min;
                }
              };
              
              this.x = me.position.x + safeRandInt(-100, 100);
              this.y = me.position.y + safeRandInt(1000, 10000);
              this.z = me.position.z + safeRandInt(-100, 100);
              
              // Safe camera rotation modification
              if (this.a748 !== undefined) this.a748 += safeRandFloat(-0.02, 0.02);
              if (this.a749 !== undefined) this.a749 += safeRandFloat(-0.02, 0.02);
            }
          } catch(e) {
            console.log("Invisible hack error:", e);
          }
          return _super.apply(this, arguments);
        };
      })(a175.prototype.a614);
 
      clearInterval(hookPositionInterval);
    }
  }, 500);
 
  // Hook leaderboard to show player IDs
  const hookLeaderboardInterval = setInterval(() => {
    if (typeof(GAME) !== 'undefined' && GAME.drawLeaderboard) {
      GAME.drawLeaderboard = drawLeaderboard;
      clearInterval(hookLeaderboardInterval);
    }
  }, 500);
 
  // Initialize ESP when GAME is ready
  const hookESPInterval = setInterval(() => {
    if (typeof(GAME) !== 'undefined' && GAME.a865?.player && GAME.a865?.player?.shoutOutAnimations?.a759s) {
      if (!textCanvas) {
        initEsp();
        animate();
      }
      clearInterval(hookESPInterval);
    }
  }, 500);
 
  // Setup chat functions and hook chat to show player IDs
  const hookChatInterval = setInterval(() => {
    if (typeof(GAME) !== 'undefined' && GAME.chatInput && G.Game && G.Game.prototype.addChat) {
        GAME.chatInput.onkeyup = function(event) {
            chatCmdSuggestions(event);
        }
        GAME.chatInput.setAttribute("autocomplete", "off");
        
        G.Game.prototype.addChat = addChat;
        clearInterval(hookChatInterval);
    }
  }, 500);
 
  //hacks (added ESP back with CODE 2 implementation)
  var Fly = new client.Hack(function () {
    G.CONFIG.a143 = true;
  }, function () {
 
  }, function () {
    G.CONFIG.a143 = false;
  }, "Fly", "Enable flight", "f");
  var WaterLevel = new client.Hack(function (this_) {
    this_.a = GAME.oceanHeightTo
  }, function () {
    GAME.oceanHeightTo = Number(this.config["water level"]);
    this.type = this.config["water level"];
    if(!Number(this.config["water level"])) this.config["water level"] = this.oldlev;
    this.oldlev = this.config["water level"];
  }, function (this_) {
    GAME.oceanHeightTo = this_.a;
  }, "WaterLevel", "Change the water height on your side", "no keybind", false, {"water level":{defaultValue:260,type:2}});
  var SpeedHack = new client.Hack(function () {
 
  }, function () {
    if(G.Keybinds.moveForward.a730) GAME.a865.player.vZ=2.5;
  }, function () {
 
  }, "SpeedHack", "Increase walking speed", "v");
  var OneShotKill = new client.Hack(function (this_) {
    this_.originalDamage = G.a867[2].a676;
    this_.originalRange = G.a867[18].range;
    G.a867[2].a676 = 100;
    G.a867[18].range = 2250;
  }, function () {
    // One shot kill is always active when enabled
  }, function (this_) {
    G.a867[2].a676 = this_.originalDamage;
    G.a867[18].range = this_.originalRange;
  }, "OneShotKill", "All weapons deal maximum damage for instant kills", "k");
  var RapidFire = new client.Hack(function (this_) {
    if(!Date.now.a) {
      window.a = Date.now;
      Date.now=function(){
        function getStackTrace(){
          var obj = this;
          Error.captureStackTrace(obj, getStackTrace);
          return obj.stack;
        }
        if(getStackTrace().includes("a822er.update")) {
          return a.call(Date);
        } else {
          return a.call(Date)*(window.multiplier||1)-(window.warp||0);
        }
      }
      Date.now.a=true;
    }
  }, function () {
    this.type = this.config.multiplier+"x";
    if(this.oldmult != undefined && this.config.multiplier != this.oldmult) {
      if(!Number(this.config.multiplier)) this.config.multiplier = this.oldmult;
      window.warp = a.call(Date)-Date.now();
    }
    window.multiplier = this.config.multiplier;
    this.oldmult = this.config.multiplier;
  }, function (this_) {
    window.warp = a.call(Date)-Date.now();
    window.multiplier = 1;
  }, "RapidFire", "Shoot and reload faster", "no keybind", false, {multiplier:{defaultValue:2,type:2}});
  var InfAmmo = new client.Hack(function (this_) {
    this_.a = GAME.a865.player.updatea809Total;
    GAME.a865.player.updatea809Total = new Function;
  }, function () {
 
  }, function (this_) {
    GAME.a865.player.updatea809Total = this_.a;
  }, "InfAmmo", "Never run out of ammunition", "g");
  var TriggerBot = new client.Hack(function (this_) {
    this_.geometry = new THREE.BufferGeometry();
    this_.geometry.setFromPoints([new THREE.Vector3(0, 0, 0),new THREE.Vector3(0, 0, 1)]);
    this_.material = new THREE.LineBasicMaterial({
        depthTest: false,
        depthWrite: false,
        fog: false,
    });
    this_.hitboxes = [];
  }, function () {
    var chunks = [];
    GAME.scene.children.forEach(function(e) {
      if(e.type == "Mesh") {
        chunks.push(e);
      }
    });
     var this_ = this;
     G.othera822ers.forEach(function (player) {
        if(player && player.a240 && !player.hitbox_triggerBot) {
          var hitbox = new THREE.Mesh(new THREE.BoxGeometry);
          hitbox.scale.set(3,10,3);
          hitbox.renderOrder = 9999;
          hitbox.material.depthTest = false;
          hitbox.material.transparent = true;
          hitbox.material.opacity = 0;
          player.hitbox_triggerBot = hitbox;
          this_.hitboxes.push(hitbox);
          player.a240.add(hitbox);
          hitbox.visible = true;
          hitbox.player = player;
        }
    });
    this.raycaster = this.raycaster || new THREE.Raycaster();
    this.raycaster.set(GAME.a865.player.camera.position, vec=new THREE.Vector3(),GAME.a865.player.camera.getWorldDirection(vec),vec);
    var result = this.raycaster.intersectObjects(this.hitboxes.concat(chunks));
    if(result[0] && result[0].object.player && result[0].object.parent) {
      G.Keybinds.shoot.a730=true
      setTimeout(function () {
        G.Keybinds.shoot.a730=false;
      }, 10);
    }
  }, function (this_) {
    this_.hitboxes.forEach(function (hitbox) {
       hitbox.parent.remove(hitbox);
       delete hitbox.player.hitbox_triggerBot;
     });
     GAME.pointerLockEnabled=false;
  }, "TriggerBot", "Shoots your gun when automatically there is a player under your crosshair", "no keybind");
  var ESP = new client.Hack(function (this_) {
    client.esp = true;
    modifyCheatDisp('ESP');
  }, function () {
    // ESP functionality is handled by the animate() function
  }, function (this_) {
    client.esp = false;
    modifyCheatDisp('ESP');
  }, "ESP", "See players through walls with names and IDs!", "h");
  var InfoHUD = new client.Hack(function (this_){
    if(!this_.HUD) {
      this_.HUD = document.createElement("div");
      this_.HUD.style = "position: fixed; top: 2vh; right: 15vw; background: linear-gradient(135deg, rgba(164, 115, 70, 0.9) 0%, rgba(107, 66, 38, 0.9) 100%); border: 2px solid #3D2317; border-radius: 10px; padding: 15px; width: 20vw; color: #f4e6d7; font-weight: 600; box-shadow: 0 4px 15px rgba(0,0,0,0.3);"
    }
    document.body.appendChild(this_.HUD);
    this_.HUD.style.display = "block";
    this_.kills = this_.kills || 0;
    this_.old = this_.old || 0;
  }, function () {
      this.HUD.innerHTML = "<div style='color: #d4a574; font-weight: bold; margin-bottom: 8px; text-align: center;'>📊 PLAYER INFO 📊</div>Player position: <span style='color: #d4a574;'>X "+Math.trunc(GAME.a865.player.position.x*100)/100+" Y "+Math.trunc(GAME.a865.player.position.y*100)/100+" Z "+Math.trunc(GAME.a865.player.position.z*100)/100+"</span><br>Connected to: <span style='color: #d4a574;'>"+G.socket.url.split("/")[2]+"</span><br>Total kills: <span style='color: #d4a574;'>"+(this.kills+GAME.a865.player.a649)+"</span><br><span style='font-size: 12px; opacity: 0.8;'>"+new Date().toGMTString()+"</span>";
      if(GAME.a865.player.a649 == 0) {
        this.kills += this.old;
      }
      this.old = GAME.a865.player.a649;
  }, function (this_) {
      this_.HUD.style.display = "none";
  }, "InfoHUD", "Nice HUD for valuable info!", "j");
  var NoFog = new client.Hack(function (this_) {
    this_.a = GAME.a865.scene.fog.far;
    GAME.a865.scene.fog.far = Infinity;
  }, function () {
 
  }, function (this_) {
    GAME.a865.scene.fog.far = this_.a;
  }, "NoFog", "Get rid of the fog", "no keybind");
  var TeleportHack = new client.Hack(function () {
    // Store the original
  }, function () {
    // This hack allows teleporting to other players
    // The actual teleportation is done via chat commands
  }, function () {
    // Cleanup
  }, "Teleport", "Teleport to players using /tp [playerID] command", "no keybind");
  var NoClipHack = new client.Hack(function () {
    // Noclip is controlled by the global noclip variable
    client.noclip = true;
    modifyCheatDisp("noclip");
  }, function () {
    // Noclip functionality is handled by the collision detection hook
  }, function () {
    client.noclip = false;
    modifyCheatDisp("noclip");
  }, "NoClip", "Walk through walls and blocks", "no keybind");
  var InvisibleHack = new client.Hack(function () {
    // Invisible is controlled by the global invisible variable
    client.invisible = true;
    if (window.GAME && GAME.a865 && GAME.a865.player) {
        tp(GAME.a865.player.position, false);
    }
    modifyCheatDisp("invisible");
  }, function () {
    // Invisible functionality is handled by the position packet hook
  }, function () {
    client.invisible = false;
    modifyCheatDisp("invisible");
  }, "Invisible", "Hide your true position from other players", "no keybind");
  window.stophacks = new client.Hack(function () {
    client.Hacks.forEach(function (hack) {
      if(!hack.isEnabled) return
      hack.disable();
      document.getElementById(hack.name).style.background = "transparent";
      document.getElementById(hack.name).style.color = "rgba(255, 255, 255, 1)";
      document.getElementById(hack.name).style.fontWeight = "normal";
      document.getElementById(hack.name).style.textShadow = "none";
    });
  }, function () {
      stophacks.disable();
      document.getElementById(stophacks.name).style.background = "transparent";
      document.getElementById(stophacks.name).style.color = "rgba(255, 255, 255, 1)";
      document.getElementById(stophacks.name).style.fontWeight = "normal";
      document.getElementById(stophacks.name).style.textShadow = "none";
  }, function () {
 
  }, "Disable all hacks", "Disable all hacks", "z");
  //menu elements (ESP back in Render category)
  new client.MenuElement([Fly, WaterLevel, SpeedHack], "Movement", "0%", "0%");
  new client.MenuElement([OneShotKill, RapidFire, InfAmmo, TriggerBot], "Combat", "25%", "0%");
  new client.MenuElement([ESP, InfoHUD, NoFog], "Render", "50%", "0%");
  new client.MenuElement([TeleportHack, NoClipHack, InvisibleHack, stophacks], "Game", "75%", "0%");
 
  function tempLoop(){
    if(window.GAME) {
      client.inGame = true;
      client.preventKicks();
      GAME.disconnect=function(){if(!client.menuToggled){location.reload()}};
      try {
        var obj = JSON.parse(localStorage.config);
        client.Hacks.forEach(function (hack) {
         if(hack.name in obj) {
           hack.enable();
           document.getElementById(hack.name).style.background = "linear-gradient(135deg, #f4e6d7 0%, #e8d5c4 100%)";
           document.getElementById(hack.name).style.color = "#2C1810";
           document.getElementById(hack.name).style.fontWeight = "bold";
           document.getElementById(hack.name).style.textShadow = "1px 1px 2px rgba(0,0,0,0.2)";
         }
        });
      } catch (e) {}
      client.updateKeybindContent();
      return;
    }
    setTimeout(tempLoop, 1);
  }
  tempLoop();
  localStorage.config = localStorage.config || "{\"autoGG\":true}";
  client.MAIN();
};
 
// Socket message handler with improved error handling
let checkInterval = setInterval(() => {
    if (typeof(G) !== 'undefined' && typeof(G.socket) !== 'undefined' && G.socket !== null && G.socket.binaryType == "arraybuffer") {
        clearInterval(checkInterval);
        G.socket.onmessage = new Proxy(G.socket.onmessage || function(){}, {
            apply: function (target, scope, args) {
                try {
                    var i = new DataView(args[0].data);
                    let opcode = i.getUint8(0);
 
                    // Safe check for opcode and required objects
                    if (window.G && G.a823 && opcode === G.a823.RPCMatchRemainingTime && typeof RPCMatchRemainingTime !== 'undefined') {
                        var c, ratio;
                        try {
                            (c = new RPCMatchRemainingTime).a615(i);
                            if (!client.server.time) {
                                client.server.r = 3;
                            } else {
                                ratio = (Date.now() - client.server.time)/1000;
                                if (ratio >= 1)
                                    client.server.r = ratio;
                            }
                            client.server.time = Date.now();
                        } catch(e) {
                            console.log("RPC handling error:", e);
                        }
                    }
                } catch(e) {
                    // Silently handle packet parsing errors to prevent spam
                }
 
                let data = target.apply(scope, args);
                return data;
            }
        });
    }
}, 1000);
 
// Complete chat command handler with better error handling
WebSocket.prototype.send = new Proxy(WebSocket.prototype.send, {
    apply: function (target, scope, args) {
        try {
            var dataView = new DataView(args[0]);
            let opcode = dataView.getUint8(0);
 
            if (opcode == 27) {
                let blockName, thickess, radius, pID, pkt, player;
                let adjustedCoords = `(${client.coords?.x?.toFixed(0) || 0}, ${client.coords?.y?.toFixed(0) || 0}, ${client.coords?.z?.toFixed(0) || 0})`
                let msg = parseOutgoingChat(dataView);
                if (msg.startsWith('/')) {
                    addCustomChat('$', msg)
                    let splitMsg = msg.split(' ').filter(word => word !== '');
                    let cmd = splitMsg[0].substr(1).toLowerCase();
                    let args = splitMsg.slice(1);
                    switch(cmd) {
                        case 'tp':
                            pID = parseInt(args[0]);
                            if (!isNaN(pID)) {
                                player = G.othera822ers.find(p => p?.id === pID);
                                if (!player) {
                                    addCustomChat('Error', `Player with ID ${pID} not found.`);
                                    return
                                }
                                tp(player.position);
                                addCustomChat('>', `Teleported to ${player.id}.`)
                            } else {
                                addCustomChat('Error', 'A number is expected as an argument (the player\'s ID).');
                            }
                            break;
                        case 'item':
                            if (args.length === 0) {
                                client.customBlockId = getLookAtBlockId();
                            } else if (checkInt(args[0]) && Object.keys(BLOCK_CONFIG).includes(args[0])) {
                                client.customBlockId = parseInt(args[0]);
                            } else if (Object.keys(blocks).includes(args[0].toLowerCase())) {
                                client.customBlockId = blocks[args[0].toLowerCase()];
                            } else {
                                addCustomChat('Error', `Block ${args[0]} does not exist.`);
                                return;
                            }
 
                            if (!client.customBlockId) {
                                addCustomChat('<', 'Reset stone items.');
                                return;
                            }
 
                            var stoneNeeded = 1000 - countItemInInv("stone");
                            if (stoneNeeded > 0) {
                                GAME.a865.player.a458("stone", stoneNeeded);
                            }
 
                            addCustomChat('<', `Thrown stone set to ${BLOCK_CONFIG[client.customBlockId]?.name || client.customBlockId}.`);
                            break;
                        case '/p1':
                            WorldEdit.pos1(args);
                            break;
                        case '/p2':
                            WorldEdit.pos2(args);
                            break;
                        case '/pos1':
                            WorldEdit.pos1(args);
                            break;
                        case '/pos2':
                            WorldEdit.pos2(args);
                            break;
                        case '/set':
                            if (client.worldedit.inprogress) {
                                WorldEdit.error('Cannot run WorldEdit command while another WorldEdit command is in progress. Run //stop to stop current running WorldEdit command.');
                                return;
                            }
                            if (!client.worldedit.pos1 || !client.worldedit.pos2) {
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
 
                            WorldEdit.set(client.worldedit.pos1.clone(), client.worldedit.pos2.clone(), blockName)
 
                            break;
                        case '/box':
                            if (client.worldedit.inprogress) {
                                WorldEdit.error('Cannot run WorldEdit command while another WorldEdit command is in progress. Run //stop to stop current running WorldEdit command.');
                                return;
                            }
                            if (!client.worldedit.pos1 || !client.worldedit.pos2) {
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
 
                            WorldEdit.box(client.worldedit.pos1.clone(), client.worldedit.pos2.clone(), blockName);
 
                            break;
                        case '/flag':
                            if (client.worldedit.inprogress) {
                                WorldEdit.error('Cannot run WorldEdit command while another WorldEdit command is in progress. Run //stop to stop current running WorldEdit command.');
                                return;
                            }
                            if (!client.worldedit.pos1 || !client.worldedit.pos2) {
                                WorldEdit.error('You must set //pos1 and //pos2 before running this worldedit command.');
                                return;
                            }
 
                            WorldEdit.flag(client.worldedit.pos1.clone(), client.worldedit.pos2.clone());
 
                            break;
                        case '/pakistan':
                            if (client.worldedit.inprogress) {
                                WorldEdit.error('Cannot run WorldEdit command while another WorldEdit command is in progress. Run //stop to stop current running WorldEdit command.');
                                return;
                            }
                            if (!client.worldedit.pos1 || !client.worldedit.pos2) {
                                WorldEdit.error('You must set //pos1 and //pos2 before running this worldedit command.');
                                return;
                            }
 
                            WorldEdit.pakistanFlag(client.worldedit.pos1.clone(), client.worldedit.pos2.clone());
 
                            break;
                        case '/mosque':
                            if (client.worldedit.inprogress) {
                                WorldEdit.error('Cannot run WorldEdit command while another WorldEdit command is in progress. Run //stop to stop current running WorldEdit command.');
                                return;
                            }
                            if (!client.worldedit.pos1) {
                                WorldEdit.error('You must set //pos1 before running this worldedit command.');
                                return;
                            }
                            if (args.length === 0) {
                                WorldEdit.error('Expected 1 argument (size), got 0.');
                                return;
                            }
 
                            let size = parseInt(args[0]);
                            if (!size || size < 10) {
                                WorldEdit.error(`Invalid size ${size}. Size must be at least 10.`);
                                return;
                            }
 
                            WorldEdit.mosque(client.worldedit.pos1.clone(), size);
 
                            break;
                        case '/car':
                            if (client.worldedit.inprogress) {
                                WorldEdit.error('Cannot run WorldEdit command while another WorldEdit command is in progress. Run //stop to stop current running WorldEdit command.');
                                return;
                            }
                            if (!client.worldedit.pos1) {
                                WorldEdit.error('You must set //pos1 before running this worldedit command.');
                                return;
                            }
 
                            WorldEdit.car(client.worldedit.pos1.clone());
 
                            break;
                        case '/ufo':
                            if (client.worldedit.inprogress) {
                                WorldEdit.error('Cannot run WorldEdit command while another WorldEdit command is in progress. Run //stop to stop current running WorldEdit command.');
                                return;
                            }
                            if (!client.worldedit.pos1) {
                                WorldEdit.error('You must set //pos1 before running this worldedit command.');
                                return;
                            }
                            if (args.length === 0) {
                                WorldEdit.error('Expected 1 argument, got 0.');
                                return;
                            }
 
                            radius = parseInt(args[0]);
                            if (!radius) {
                                WorldEdit.error(`Invalid radius ${radius}`);
                                return;
                            }
 
                            WorldEdit.ufo(client.worldedit.pos1.clone(), radius);
 
                            break;
                        case '/aircraft':
                            if (client.worldedit.inprogress) {
                                WorldEdit.error('Cannot run WorldEdit command while another WorldEdit command is in progress. Run //stop to stop current running WorldEdit command.');
                                return;
                            }
                            if (!client.worldedit.pos1) {
                                WorldEdit.error('You must set //pos1 before running this worldedit command.');
                                return;
                            }
                            if (args.length === 0) {
                                WorldEdit.error('Expected 1 argument (size), got 0.');
                                return;
                            }
 
                            let aircraftSize = parseInt(args[0]);
                            if (!aircraftSize || aircraftSize < 10) {
                                WorldEdit.error(`Invalid size ${aircraftSize}. Size must be at least 10.`);
                                return;
                            }
 
                            WorldEdit.aircraft(client.worldedit.pos1.clone(), aircraftSize);
 
                            break;
                        case '/house':
                            if (client.worldedit.inprogress) {
                                WorldEdit.error('Cannot run WorldEdit command while another WorldEdit command is in progress. Run //stop to stop current running WorldEdit command.');
                                return;
                            }
                            if (!client.worldedit.pos1) {
                                WorldEdit.error('You must set //pos1 before running this worldedit command.');
                                return;
                            }
                            if (args.length === 0) {
                                WorldEdit.error('Expected 1 argument (size), got 0.');
                                return;
                            }
 
                            let houseSize = parseInt(args[0]);
                            if (!houseSize || houseSize < 10) {
                                WorldEdit.error(`Invalid size ${houseSize}. Size must be at least 10.`);
                                return;
                            }
 
                            WorldEdit.house(client.worldedit.pos1.clone(), houseSize);
 
                            break;
                        case '/name':
                            if (client.worldedit.inprogress) {
                                WorldEdit.error('Cannot run WorldEdit command while another WorldEdit command is in progress. Run //stop to stop current running WorldEdit command.');
                                return;
                            }
                            if (!client.worldedit.pos1) {
                                WorldEdit.error('You must set //pos1 before running this worldedit command.');
                                return;
                            }
                            if (args.length === 0) {
                                WorldEdit.error('Expected 1 argument (block name), got 0.');
                                return;
                            }
 
                            let nameBlockName = args[0].toLowerCase();
                            if (!Object.keys(blocks).includes(nameBlockName)) {
                                WorldEdit.error(`Block ${nameBlockName} does not exist.`);
                                return;
                            }
 
                            WorldEdit.name(client.worldedit.pos1.clone(), nameBlockName);
 
                            break;
                        case '/replace':
                            if (client.worldedit.inprogress) {
                                WorldEdit.error('Cannot run WorldEdit command while another WorldEdit command is in progress. Run //stop to stop current running WorldEdit command.');
                                return;
                            }
                            if (!client.worldedit.pos1 || !client.worldedit.pos2) {
                                WorldEdit.error('You must set //pos1 and //pos2 before running this worldedit command.');
                                return;
                            }
                            if (args.length == 0) {
                                WorldEdit.error('Expected at least 1 argument, got 0.');
                                return;
                            }
 
                            var blockIdStart = getLookAtBlockId();
                            if (!blockIdStart) {
                                blockIdStart = 0;
                            }
                            var blockNameEnd = args[0].toLowerCase();
                            if (!Object.keys(blocks).includes(blockNameEnd)) {
                                WorldEdit.error(`Block ${blockNameEnd} does not exist.`);
                                return;
                            }
 
                            WorldEdit.replace(client.worldedit.pos1.clone(), client.worldedit.pos2.clone(), blockIdStart, blockNameEnd);
 
                            break;
                        case '/sphere':
                            if (client.worldedit.inprogress) {
                                WorldEdit.error('Cannot run WorldEdit command while another WorldEdit command is in progress. Run //stop to stop current running WorldEdit command.');
                                return;
                            }
                            if (!client.worldedit.pos1) {
                                WorldEdit.error('You must set //pos1 before running this worldedit command.');
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
 
                            WorldEdit.sphere(client.worldedit.pos1.clone(), blockName, radius);
 
                            break;
                        case '/hsphere':
                            if (client.worldedit.inprogress) {
                                WorldEdit.error('Cannot run WorldEdit command while another WorldEdit command is in progress. Run //stop to stop current running WorldEdit command.');
                                return;
                            }
                            if (!client.worldedit.pos1) {
                                WorldEdit.error('You must set //pos1 before running this worldedit command.');
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
 
                            WorldEdit.hollowSphere(client.worldedit.pos1.clone(), blockName, radius);
 
                            break;
                        case '/copy':
                            if (client.worldedit.inprogress) {
                                WorldEdit.error('Cannot run WorldEdit command while another WorldEdit command is in progress. Run //stop to stop current running WorldEdit command.');
                                return;
                            }
                            if (!client.worldedit.pos1 || !client.worldedit.pos2) {
                                WorldEdit.error('You must set //pos1 and //pos2 before running this worldedit command.');
                                return;
                            }
 
                            WorldEdit.copy(client.worldedit.pos1.clone(), client.worldedit.pos2.clone());
 
                            break;
                        case '/paste':
                            if (client.worldedit.inprogress) {
                                WorldEdit.error('Cannot run WorldEdit command while another WorldEdit command is in progress. Run //stop to stop current running WorldEdit command.');
                                return;
                            }
                            if (!client.worldedit.clipboard[0]) {
                                WorldEdit.error('Nothing is copied to clipboard.');
                                return;
                            }
                            if (args.length && args[0].toLowerCase() === 'original') {
                                WorldEdit.paste(null);
                            } else {
                                WorldEdit.paste(GAME.a865.player.position.clone());
                            }
 
                            break;
                        case '/clearclipboard':
                            client.worldedit.clipboard = [null, null, {}];
                            addCustomChat('WorldEdit', 'Cleared clipboard.');
                            break;
                        case '/stop':
                            if (!client.worldedit.inprogress) {
                                WorldEdit.error("No WorldEdit commands are currently running.");
                                return;
                            }
                            client.worldedit.inprogress = false;
                            client.updateCheatDisp = true;
                            break;
                        case '/positions':
                            addCustomChat('WorldEdit', `pos1: ${convertCoords(client.worldedit.pos1, "adjusted") || 'not set'}; pos2: ${convertCoords(client.worldedit.pos2, "adjusted") || 'not set'}`);
                            break;
                        case '/load':
                            if (args.length) {
                                if (isURL(args[0])) {
                                    const buildName = getBuildName(args[0].split('/').pop().split('#')[0].split('?')[0])
                                    client.worldedit.builds[buildName] = readBuildFromURL(args[0]);
                                }
                                return;
                            }
 
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
                                  client.worldedit.builds[buildName] = loadedBuild;
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
                        case '/new':
                            //not implemented
                            break;
                        case '/build':
                            if (client.worldedit.inprogress) {
                                WorldEdit.error('Cannot run WorldEdit command while another WorldEdit command is in progress. Run //stop to stop current running WorldEdit command.');
                                return;
                            }
                            var keys = Object.keys(client.worldedit.builds);
                            if (keys.length === 0) {
                                WorldEdit.error('You do not have any builds.')
                                return;
                            }
                            if (args.length === 0) {
                                WorldEdit.build(Object.keys(client.worldedit.builds)[Object.keys(client.worldedit.builds).length - 1], GAME.a865.player.position.clone());
                                return;
                            }
                            if (!client.worldedit.builds[args[0]]) {
                                WorldEdit.error('Build '+args[0]+' not found. Your saved builds are: '+Object.keys(client.worldedit.builds).join(', '));
                                break;
                            }
                            WorldEdit.build(args[0], GAME.a865.player.position.clone());
                            break;
                        case '/builds':
                            addCustomChat('WorldEdit', 'Your builds are: '+Object.keys(client.worldedit.builds).join(', '));
                            break
                        case '/save':
                            //not implemented
                            break;
                        default:
                            // Let other chat messages through normally
                            return target.apply(scope, args);
                    }
                return; // Prevent command from being sent to chat
                }
            }
        } catch(e) {
            // Handle errors silently to prevent console spam
        }
 
        if (G?.socket?.readyState === WebSocket.OPEN) {
            let data = target.apply(scope, args);
            return data;
        }
    }
})
 
client.init()