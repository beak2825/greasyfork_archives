// ==UserScript==
// @name         GGn Mobygames Uploady
// @namespace    https://orbitalzero.ovh/scripts
// @version      0.37.1
// @match        https://gazellegames.net/upload.php
// @match      https://gazellegames.net/torrents.php?action=editgroup*
// @match      https://www.mobygames.com/*
// @match      http://www.mobygames.com/*
// @description  Uploady for mobygames
// @author       NeutronNoir, ZeDoCaixao, kdln
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @grant	 GM_xmlhttpRequest
// @require      https://code.jquery.com/jquery-3.1.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/554650/GGn%20Mobygames%20Uploady.user.js
// @updateURL https://update.greasyfork.org/scripts/554650/GGn%20Mobygames%20Uploady.meta.js
// ==/UserScript==

//code from https://greasyfork.org/scripts/23948-html2bbcode/code/HTML2BBCode.js
function html2bb(str) {
  if (typeof str === "undefined") return "";
  str = str.replace(/< *br *\/*>/g, "\n");
  str = str.replace(/< *u *>/g, "[u]");
  str = str.replace(/< *\/ *u *>/g, "[/u]");
  str = str.replace(/< *\/ *li *>/g, "");
  str = str.replace(/< *\/ *p *>/g, "\n\n");
  str = str.replace(/< * *p *>/g, "");
  str = str.replace(/< *\/ *em *>/g, "[/i]");
  str = str.replace(/< * *em *>/g, "[i]");
  str = str.replace(/< *li *>/g, "[*]");
  str = str.replace(/< *\/ *ul *>/g, "");
  str = str.replace(/< *ul *class=\\*\"bb_ul\\*\" *>/g, "");
  str = str.replace(/< *h2 *class=\"bb_tag\" *>/g, "[u]");
  str = str.replace(/< *\/ *h2 *>/g, "[/u]");
  str = str.replace(/< *strong *>/g, "[b]");
  str = str.replace(/< *\/ *strong *>/g, "[/b]");
  str = str.replace(/< *i *>/g, "[i]");
  str = str.replace(/< *\/ *i *>/g, "[/i]");
  str = str.replace(/\"/g, '"');
  str = str.replace(/< *img *src="([^"]*)" *>/g, "[img]$1[/img]");
  str = str.replace(/< *b *>/g, "[b]");
  str = str.replace(/< *\/ *b *>/g, "[/b]");
  str = str.replace(/< *a [^>]*>/g, "");
  str = str.replace(/< *\/ *a *>/g, "");
  str = str.replace(/< *cite *>/, "[i]");
  str = str.replace(/< *\/cite *>/, "[/i]");
  //Yeah, all these damn stars. Because people put spaces where they shouldn't.
  return str;
}

try {
  init();
} catch (err) {
  console.log(err);
}

function init() {
  if (window.location.hostname == "gazellegames.net") {
    if (window.location.pathname == "/upload.php") {
      var rls = window.location.hash.replace('#', ''); if (rls) {$('[name="empty_group"]').click(); $('[name="title"]').val(decodeURI(rls))}
      add_search_buttons();
    } else if (
      window.location.pathname == "/torrents.php" &&
      /action=editgroup/.test(window.location.search)
    ) {
      add_search_buttons_alt();
    }
    addPTPAllButton();
  } else if (window.location.href.endsWith('/specs/')) {
    handleSpecs();
  } else if (window.location.hostname == "www.mobygames.com") {
    add_validate_button();
  }

  GM_addStyle(button_css());
}

function addPTPAllButton() {
  $('[value="PTPImg It"]').first().after(
    '<input id="ptp_img_all" type="button" value="PTPImg all"/>',
  );
  $("#ptp_img_all").click(function () {
    $('[value="PTPImg It"]').click();
  })
}

function add_search_buttons() {
  $("input[name='title']").after(
    '<input id="moby_uploady_Search" type="button" value="Search MobyGames"/>',
  );
  $("#moby_uploady_Search").click(function() {
    var title = encodeURIComponent($("#title").val());

    window.open("https://www.mobygames.com/search/quick?q=" + title, "_blank"); //For every platform
  });

  $("#moby_uploady_Search").after(
    '<input id="moby_uploady_Validate" type="button" value="Validate MobyGames"/>',
  );

  $("#moby_uploady_Validate").click(async function() {
    var mobygames = JSON.parse((await GM_getValue("mobygames")) || "{}");
    console.log("=== GGn VALIDATION START ===");
    console.log("MobyGames data:", mobygames);
    console.log("Tags to set:", mobygames.tags);

    $("#aliases").val(mobygames.alternate_titles || "");
    $("#title").val(mobygames.title || "");
    $("input[name='tags']").val(mobygames.tags || "");
    console.log("Tags field value after setting:", $("input[name='tags']").val());
    $("#year").val(mobygames.year || "");
    $("#image").val(mobygames.cover || "");
    $("#album_desc").val(mobygames.description || "");

    var add_screen = $("a:contains('+')");
    if (mobygames.screenshots && mobygames.screenshots.length > 0) {
      mobygames.screenshots.forEach(function(screenshot, index) {
        if (index >= 16) return; //The site doesn't accept more than 16 screenshots
        if (index >= 3) add_screen.click(); //There's 3 screenshot boxes by default. If we need to add more, we do as if the user clicked on the "[+]" (for reasons mentioned above)
        $("[name='screens[]']").eq(index).val(screenshot); //Finally store the screenshot link in the right screen field.
      });
    }
    if(!$('[name="screens[]"]').last().val()) {
        $("a:contains('-')").click();
    }

    $("#platform").val(mobygames.platform || "");

    await GM_deleteValue("mobygames");
  });
}

function add_search_buttons_alt() {
  $("input[name='aliases']").after(
    '<input id="moby_uploady_Search" type="button" value="Search MobyGames"/>',
  );
  $("#moby_uploady_Search").click(function() {
    var title = encodeURIComponent($("[name='name']").val());

    window.open("https://www.mobygames.com/search/quick?q=" + title, "_blank"); //For every platform
  });

  //need to add a button to fill the inputs and stop gathering links
  $("#moby_uploady_Search").after(
    '<input id="moby_uploady_Validate" type="button" value="Validate Moby"/>',
  );
  $("#moby_uploady_Validate").after(
    '<input id="moby_uploady_Validate_desconly" type="button" value="Only Description"/>',
  );
  $("#moby_uploady_Validate_desconly").after(
    '<input id="moby_uploady_Validate_piconly" type="button" value="Only Screenshots"/>',
  );

  async function valiClick(addType) {

    var mobygames = JSON.parse((await GM_getValue("mobygames")) || "{}");
    console.log(mobygames);
    if(!addType || addType === 'piconly'){
      $("input[name='image']").val(mobygames.cover || "");
      var add_screen = $("a:contains('+')");
      if (mobygames.screenshots && mobygames.screenshots.length > 0) {
        mobygames.screenshots.forEach(function(screenshot, index) {
          if (index >= 16) return; //The site doesn't accept more than 16 screenshots
          if (index >= 3) add_screen.click(); //There's 3 screenshot boxes by default. If we need to add more, we do as if the user clicked on the "[+]" (for reasons mentioned above)
          $("[name='screens[]']").eq(index).val(screenshot); //Finally store the screenshot link in the right screen field.
        });
      }
    }
    if(!addType || addType === 'desconly'){
      $('[name="body"]').val(mobygames.description || "");
    }
    $('#mobygamesuri').val(mobygames.mobyurl || "");

    await GM_deleteValue("mobygames");
  }

  $("#moby_uploady_Validate").click(function () {
    valiClick(null)
  });
  $("#moby_uploady_Validate_desconly").click(function () {
    valiClick('desconly')
  });
  $("#moby_uploady_Validate_piconly").click(function () {
    valiClick('piconly')
  });
}

function get_covers(platformSlug) {
  return Promise.race([
    new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET",
        url: document.URL + "/covers/" + platformSlug,
        timeout: 10000, // 10 second timeout
        onload: (data) => {
          let imageUrl = $(data.responseText)
            .find("figcaption:contains('Front'):first")
            .prev()
            .attr("href");

          if (!imageUrl) {
            console.warn("No cover image URL found");
            resolve("");
            return;
          }

          // Fetch the actual cover image with timeout
          Promise.race([
            new Promise((resolve2, reject2) => {
              GM_xmlhttpRequest({
                method: "GET",
                url: imageUrl,
                timeout: 10000,
                onload: (data) => {
                  let image = $(data.responseText).find("figure img").attr("src");
                  resolve(image || "");
                },
                onerror: (error) => {
                  console.warn("Error fetching cover image:", error);
                  resolve("");
                },
                ontimeout: () => {
                  console.warn("Cover image fetch timeout");
                  resolve("");
                }
              });
            }),
            new Promise((_, reject2) => setTimeout(() => reject2(new Error("Cover image timeout")), 10000))
          ]).then(resolve).catch((err) => {
            console.warn("Cover fetch error:", err.message);
            resolve("");
          });
        },
        onerror: (error) => {
          console.warn("Error fetching cover page:", error);
          resolve("");
        },
        ontimeout: () => {
          console.warn("Cover page fetch timeout");
          resolve("");
        }
      });
    }),
    new Promise((_, reject) => setTimeout(() => reject(new Error("get_covers timeout")), 15000))
  ]).catch((err) => {
    console.warn("⚠️ Cover fetch timeout:", err.message);
    return "";
  });
}

function get_cover() {
  return new Promise(function(resolve, reject) {
    GM_xmlhttpRequest({
      method: "GET",
      url: $("#cover").attr("href"),
      onload: function(data) {
        let cover = "";
        cover = $(data.responseText).find("img[src*='covers']").attr("src");
        if (cover.indexOf("http") == -1)
          cover = "https://" + window.location.hostname + cover;
        resolve(cover);
      },
      onerror: function(error) {
        throw error;
      },
    });
  });
}

function get_screenshots(platformSlug, promos) {
  return Promise.race([
    new Promise(function(resolve, reject) {
      GM_xmlhttpRequest({
        method: "GET",
        url: promos ? document.URL + "/promo/" : document.URL + "/screenshots/" + platformSlug,
        timeout: 15000,
        onload: function(data) {
          let nbr_screenshots = 0;
          const screenshotPromises = $(data.responseText)
            .find("#main .img-holder a")
            .map(function() {
              let image_url = $(this).attr("href");

              if (image_url && image_url.includes("screenshots") && nbr_screenshots < 16) {
                nbr_screenshots++;
                return Promise.race([
                  new Promise(function(resolve, reject) {
                    GM_xmlhttpRequest({
                      method: "GET",
                      url: image_url,
                      timeout: 10000,
                      onload: function(data) {
                        console.log(image_url);
                        var screen = $(data.responseText)
                          .find("figure img")
                          .attr("src");
                        if (screen && screen.indexOf("http") == -1)
                          screen = "https://" + window.location.hostname + screen;
                        resolve(screen || null);
                      },
                      onerror: function(error) {
                        console.warn("Screenshot fetch error:", image_url, error);
                        resolve(null);
                      },
                      ontimeout: function() {
                        console.warn("Screenshot fetch timeout:", image_url);
                        resolve(null);
                      }
                    });
                  }),
                  new Promise((_, reject) => setTimeout(() => reject(new Error("Screenshot timeout")), 10000))
                ]).catch(() => null);
              }
              return null;
            })
            .get()
            .filter(p => p !== null);

          Promise.all(screenshotPromises)
            .then(screenshots => resolve(screenshots.filter(s => s !== null)))
            .catch(err => {
              console.warn("Error resolving screenshots:", err);
              resolve([]);
            });
        },
        onerror: function(error) {
          console.warn("Error fetching screenshot page:", error);
          resolve([]);
        },
        ontimeout: function() {
          console.warn("Screenshot page fetch timeout");
          resolve([]);
        }
      });
    }),
    new Promise((_, reject) => setTimeout(() => reject(new Error("get_screenshots timeout")), 30000))
  ]).catch(err => {
    console.warn("⚠️ Screenshot fetch timeout:", err.message);
    return [];
  });
}

// Global variable to store user-learned tags (loaded once per page)
let globalUserLearnedTags = null;
let globalUserLearnedTagsLoading = null;

// Load user-learned tags once and cache them
async function loadUserLearnedTags() {
  if (globalUserLearnedTags !== null) {
    return globalUserLearnedTags; // Already loaded
  }

  if (globalUserLearnedTagsLoading !== null) {
    return globalUserLearnedTagsLoading; // Already loading, wait for it
  }

  console.log("📂 Loading user-learned tag mappings from storage (one-time load)...");
  globalUserLearnedTagsLoading = (async () => {
    try {
      const storageStart = Date.now();
      const storedMappings = await Promise.race([
        GM_getValue("user_tag_mappings"),
        new Promise((_, reject) => setTimeout(() => reject(new Error("GM_getValue timeout")), 5000))
      ]);
      console.log(`✓ GM storage loaded in ${Date.now() - storageStart}ms`);

      if (storedMappings) {
        globalUserLearnedTags = JSON.parse(storedMappings);
        console.log(`✓ Loaded ${Object.keys(globalUserLearnedTags).length} user-learned tag mappings`);
      } else {
        console.log("ℹ️ No saved tag mappings found (first time use)");
        globalUserLearnedTags = {};
      }
    } catch (error) {
      console.warn("⚠️ Could not load user tag mappings:", error.message);
      globalUserLearnedTags = {};
    }
    return globalUserLearnedTags;
  })();

  return globalUserLearnedTagsLoading;
}

async function validate(platformSlug) {
  const startTime = Date.now();
  console.log(`\n🚀 VALIDATE START - Platform: ${platformSlug} - Time: ${new Date().toLocaleTimeString()}`);

  let h1 = document.querySelector('h1');
  h1.innerHTML += '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"> <i class="fa fa-spinner fa-spin fa-1x fa-fw"></i> ';
  const mobygames = {};

  try {
    console.log("📸 Fetching covers...");
    const coverStart = Date.now();
    const covers = await get_covers(platformSlug);
    console.log(`✓ Covers fetched in ${Date.now() - coverStart}ms`);
    mobygames.cover = covers;
  } catch (error) {
    console.error("❌ Error fetching covers:", error);
  }

  try {
    console.log("🖼️ Fetching screenshots...");
    const screenshotStart = Date.now();
    let screenshots = await get_screenshots(platformSlug, false);
    console.log(`✓ Screenshots fetched in ${Date.now() - screenshotStart}ms (${screenshots.length} found)`);
    if (screenshots.length == 0) {
      alert("There's no screenshots for platorm: " + platformSlug);
      mobygames.screenshots = [];
    } else {
      mobygames.screenshots = screenshots;
    }
  } catch (error) {
    console.error("❌ Error fetching screenshots:", error);
  }
  mobygames.mobyurl = window.location.href;
  try {
      let descriptionElement = $("#description-text");
      mobygames.description = descriptionElement.length
        ? "[align=center][b][u]About the game[/u][/b][/align]\n" +
          html2bb(
              descriptionElement
                .html()
                .replace(/[\n]*/g, "")
                .replace(/.*<h2>Description<\/h2>/g, "")
                .replace(/<div.*/g, "")
                .replace(/< *br *>/g, "\n")
          )
        : "";
  } catch (error) {
    console.error("Error accessing #description-text:", error);
    mobygames.description = "";
}

  var alternate_titles = [];
  $(".text-sm.text-normal.text-muted:contains('aka')")
    .find("span u")
    .each(function() {
      alternate_titles.push(
        $(this)
          .text()
          .replace(/[^"]*"([^"]*)".*/g, "$1"),
      );
    });
  mobygames.alternate_titles = alternate_titles.join(", ");

  var date = $("dt:contains('by Date')")
    .next()
    .children()
    .first()
    .children()
    .filter(function() {
      return $(this).find("span a").attr("href").includes(platformSlug);
    })
    .children()
    .first()
    .text();
  date = date || $('.info-release a[href$="#' + platformSlug + '"]').text().trim()

  mobygames.year = [date];

  var tags_array = [];

  // Try multiple selector strategies to extract tags
  console.log("=== TAG EXTRACTION START ===");

  // Strategy 1: Current method - dt:contains selectors
  console.log("Strategy 1: Trying dt:contains selectors...");
  $("dt:contains('Genre')")
    .next()
    .find("a")
    .each((o, obj) => {
      let arr = $(obj).text().split("/");
      arr.forEach((t) => {
        tags_array.push(t);
      });
    });

  $("dt:contains('Setting')")
    .next()
    .find("a")
    .each((o, obj) => {
      let arr = $(obj).text().split("/");
      arr.forEach((t) => {
        tags_array.push(t);
      });
    });

  $("dt:contains('Gameplay')")
    .next()
    .find("a")
    .each((o, obj) => {
      let arr = $(obj).text().split("/");
      arr.forEach((t) => {
        tags_array.push(t);
      });
    });

  $("dt:contains('Perspective')")
    .next()
    .find("a")
    .each((o, obj) => {
      let arr = $(obj).text().split("/");
      arr.forEach((t) => {
        tags_array.push(t);
      });
    });
  console.log("Strategy 1 result:", tags_array.length, "tags");

  // Strategy 2: Try finding by exact text match with dd siblings
  if (tags_array.length === 0) {
    console.log("Strategy 2: Trying dt/dd sibling selectors...");
    $("dt").each(function() {
      let dtText = $(this).text().trim();
      if (dtText === 'Genre' || dtText === 'Setting' || dtText === 'Gameplay' || dtText === 'Perspective') {
        console.log("Found", dtText, "section");
        $(this).next("dd").find("a").each(function() {
          let text = $(this).text().trim();
          console.log("  Found tag:", text);
          text.split("/").forEach(t => tags_array.push(t));
        });
      }
    });
    console.log("Strategy 2 result:", tags_array.length, "tags");
  }

  // Strategy 3: Try old #coreGameGenre selectors
  if (tags_array.length === 0) {
    console.log("Strategy 3: Trying #coreGameGenre selectors...");
    let genreTags = $("#coreGameGenre div:contains('Genre')").next().text().split(/[\/,]/);
    let settingTags = $("#coreGameGenre div:contains('Setting')").next().text().split(/[\/,]/);
    let gameplayTags = $("#coreGameGenre div:contains('Gameplay')").next().text().split(/[\/,]/);
    tags_array = tags_array.concat(genreTags).concat(settingTags).concat(gameplayTags);
    console.log("Strategy 3 result:", tags_array.length, "tags");
  }

  // Strategy 4: Look for any dl/dt/dd structure
  if (tags_array.length === 0) {
    console.log("Strategy 4: Searching all dl/dt/dd structures...");
    $("dl").each(function() {
      $(this).find("dt").each(function() {
        let dtText = $(this).text().trim().toLowerCase();
        if (dtText.includes('genre') || dtText.includes('setting') || dtText.includes('gameplay') || dtText.includes('perspective')) {
          console.log("Found potential section:", dtText);
          $(this).next("dd").find("a").each(function() {
            let text = $(this).text().trim();
            console.log("  Extracting:", text);
            text.split("/").forEach(t => tags_array.push(t));
          });
        }
      });
    });
    console.log("Strategy 4 result:", tags_array.length, "tags");
  }

  console.log("=== FINAL EXTRACTION: " + tags_array.length + " tags ===");
  console.log("Raw tags:", tags_array);
  console.log(`⏱️ Tag extraction took ${Date.now() - startTime}ms`);

  console.log("🏷️ Starting tag processing...");
  const tagProcessStart = Date.now();

  // Official GGn tags - parsed from taginfo.md (Games categories only)
  const officialGGnTags = new Set([
    // Gameplay/Genre
    'action', 'adventure', 'strategy', 'role.playing.game', 'puzzle', 'simulation',
    'casual', 'shooter', 'platform', 'arcade', 'visual.novel', 'sports', 'racing',
    'tactics', 'fighting', 'roguelike', 'educational', 'chess', 'board.game',
    'driving', 'management', 'beat.em.up', 'hidden.object', 'card.game', 'exploration',
    'sandbox', 'music', 'rhythm', 'interactive.fiction', 'stealth', 'party',
    'mini.game', 'trivia', 'time.management', 'wargame', 'pinball', 'game.show',
    'clicker', 'casino', 'dancing', 'pachinko', 'pong', 'runner', 'karaoke',
    'art.game', 'typing', 'fitness', 'logic', 'singing', 'idle', 'battle.royale',
    'drawing', 'combat', 'language', 'collectible.card', 'larp', 'trading.card.game',

    // Gameplay Subgenre
    'survival', 'open.world', 'shoot.em.up', 'dating.simulation', 'hack.and.slash',
    'metroidvania', 'dungeon.crawler', 'business.simulation', 'bullet.hell',
    'text.adventure', 'tower.defense', 'soccer', 'walking.simulation', 'kinetic.novel',
    'baseball', 'otome', 'life.simulation', 'mahjong', 'city.building',
    'vehicle.simulation', 'building', 'flight.simulation', 'construction.simulation',
    'basketball', 'match.3', 'agriculture', 'american.football', 'tiles', 'poker',
    'golf', 'fishing', 'vehicular.combat', '4x', 'government.simulation', 'wrestling',
    'rail.shooter', 'base.building', 'tennis', 'hockey', 'snooker', 'blackjack',
    'point.and.click', 'ice.hockey', 'real.time.strategy', 'turn.based.strategy',
    'bingo', 'slots', 'tricks', 'field.hockey', 'solitaire', 'grand.strategy',
    'shedding', 'rugby', 'cricket', 'volleyball', 'rummy', 'pool', 'darts',
    'matching', 'formula.1', 'collecting', 'bowling', 'auto.battler', 'badminton',
    'table.tennis', 'roguelite', 'souls.like', 'dodgeball', 'lacrosse', 'karting',
    'skateboarding', 'skiing', 'snowboarding', 'surfing', 'wakeboarding', 'bmx',
    'motocross', 'rallycross', 'stock.car', 'drag.racing', 'kart.racing',
    'off.road.racing', 'street.racing', 'futuristic.racing', 'combat.racing',
    'arcade.racing', 'simulation.racing', 'monster.truck', 'boat.racing',
    'truck.racing', 'atv.racing', 'snowmobile.racing', 'rally', 'gt',

    // Mechanics
    'point.and.click', 'turn.based.combat', 'crafting', 'procedural.generation',
    'permadeath', 'real.time', 'deck.building', 'turn.based', 'roguelite',
    'linear', 'quick.time.events', 'choices.matter', 'multiple.endings',
    'card.battler', 'collection', 'massively.multiplayer', 'multiplayer.online.battle.arena',
    'boss.rush', 'time.loop', 'twin.stick', 'loot', 'rpg.elements', 'branching.story',
    'creature.collector', 'class.based', 'level.editor', 'dialogue.choices',

    // Viewpoint
    'first.person', 'isometric', 'third.person', '2d', '3d', 'side.scrolling',
    'text.based', 'top.down', 'cinematic', 'over.the.shoulder', '2.5d', 'flip.screen',
    'split.screen', 'vr', 'augmented.reality',

    // Elements
    'co.op', 'singleplayer', 'online', 'competitive', 'local', 'atmospheric',
    'story.driven', 'pvp', 'pve', 'user.generated.content', 'multiplayer',
    'character.creation', 'moddable', 'controller.support', 'achievements',
    'save.system', 'skill.tree', 'day.night.cycle', 'seasonal', 'dynamic.weather',
    'economy', 'morality', 'relationship.system', 'dating',

    // Narrative
    'horror', 'comedy', 'drama', 'mystery', 'thriller', 'romance', 'slice.of.life',
    'tragedy', 'psychological', 'dark', 'wholesome', 'emotional', 'mature',
    'philosophical', 'political', 'historical', 'crime', 'espionage', 'war',
    'childrens', 'family.friendly', 'coming.of.age',

    // Setting
    'fantasy', 'science.fiction', 'space', 'post.apocalyptic', 'cyberpunk',
    'medieval', 'world.war.ii', 'steampunk', 'modern', 'contemporary', 'urban',
    'futuristic', 'prehistoric', 'ancient', 'wild.west', 'western', 'pirate',
    'underwater', 'jungle', 'desert', 'arctic', 'mountains', 'islands', 'coastal',
    'rural', 'suburban', 'dystopian', 'utopian', 'alternate.history', 'historical',
    'world.war.i', 'cold.war', 'vietnam.war', 'korean.war', 'interwar.period',
    'classical.antiquity', 'ancient.egypt', 'ancient.china', 'ancient.rome',
    'feudal.japan', 'aztec', 'mayan', 'victorian', 'edwardian', 'roaring.twenties',
    'great.depression', 'mythological', 'fairy.tale', 'folklore',

    // Adult
    'adult', 'eroge', 'nukige', 'sexual.content', 'nudity', 'ecchi', 'hentai',
    'yaoi', 'yuri', 'bara', 'otoko', 'shota', 'loli', 'futanari', 'netorare',
    'netori', 'netorase', 'incest', 'rape', 'tentacles', 'monster', 'pregnancy',
    'lactation', 'bdsm', 'urophilia', 'scatological',

    // Themes
    'zombies', 'vampires', 'werewolves', 'dragons', 'demons', 'angels', 'gods',
    'magic', 'witches', 'superheroes', 'aliens', 'robots', 'mecha', 'dinosaurs',
    'monsters', 'ghosts', 'ninjas', 'samurai', 'knights', 'wizards', 'pirates',
    'cowboys', 'detectives', 'spies', 'assassins', 'thieves', 'mercenaries',
    'gladiators', 'vikings', 'military', 'war', 'survival', 'exploration',
    'colonization', 'trading', 'crafting', 'farming', 'cooking', 'fishing',
    'hunting', 'racing', 'sports', 'gambling', 'heist', 'revenge', 'redemption',
    'betrayal', 'sacrifice', 'friendship', 'family', 'love', 'loss', 'death',
    'reincarnation', 'time.travel', 'parallel.worlds', 'female.protagonist',
    'male.protagonist', 'lgbtq.characters', 'anthropomorphic.animals', 'furry',
    'kemonomimi', 'catgirls', 'monster.girls', 'elves', 'dwarves', 'orcs',
    'animal.protagonist', 'cats', 'dogs', 'naval', 'tanks', 'aircraft', 'flying',
    'motorcycles', 'trucks', 'trains',

    // Visual Style
    'pixel.art', 'anime', '3dcg', 'cel.shading', 'realistic', 'stylized',
    'hand.drawn', 'comic.book', 'noir', 'minimalist', 'abstract', 'surreal',
    'photorealistic', 'cartoon', 'claymation', 'rotoscoped', 'voxel.art',
    'low.polygon', 'black.and.white', 'sepia', 'full.motion.video', 'live.action',
    'psx.style', 'retro', 'clay.animation',

    // Special
    'licensed', 'indie', 'remake', 'remaster', 'retro', 'demake', 'compilation',
    'collection', 'pack', 'cheats'
  ]);

  // Reference lists for smart tag splitting

  // Common compound tags that should always be split into components
  const compoundSplits = {
    'survival.horror': ['survival', 'horror'],
    'action.adventure': ['action', 'adventure'],
    'action.rpg': ['action', 'role.playing.game'],
    'tactical.rpg': ['tactics', 'role.playing.game']
  };

  const viewpointKeywords = [
    '1st.person', '3rd.person', 'behind.view', 'side.view',
    'top.down', 'diagonal.down', 'text.based', 'audio.game',
    'first.person', 'third.person', 'isometric', 'bird.s.eye'
  ];

  const mechanicKeywords = [
    'real.time', 'turn.based', 'point.and.click', 'roguelike',
    'roguelite', 'bullet.hell', 'twin.stick'
  ];

  // Minimal hardcoded aliases - ONLY for MobyGames-specific conversions that can't be auto-generated
  const tagAliases = {
    // MobyGames Perspective → GGn Viewpoint (these are unique to MobyGames format)
    '1st.person': 'first.person',
    '3rd.person': 'third.person',
    '3rd.person.other': 'third.person',
    'behind.view': 'third.person',
    'side.view': 'side.scrolling',
    'diagonal.down': 'isometric',
    'bird.s.eye': 'top.down',
    'text.based.spreadsheet': 'text.based',
    'audio.game': 'text.based',

    // Common abbreviations
    'rpg': 'role.playing.game',
    'fps': 'first.person.shooter',
    'rts': 'real.time.strategy',
    'tbs': 'turn.based.strategy',
    'mmo': 'massively.multiplayer',
    'mmorpg': 'massively.multiplayer',
    'moba': 'multiplayer.online.battle.arena',
    'jrpg': 'role.playing.game',
    'arpg': 'action.role.playing.game',
    'srpg': 'tactics',
    'shmup': 'shoot.em.up',
    'vn': 'visual.novel',

    // Common misspellings
    'rouge.like': 'roguelike',
    'rouge.lite': 'roguelite',
    'metroid.vania': 'metroidvania',
    'soulslike': 'souls.like',

    // Sci-fi variations
    'sci.fi': 'science.fiction',
    'scifi': 'science.fiction',

    // WWII variations
    'wwii': 'world.war.ii',
    'ww2': 'world.war.ii',
    'wwi': 'world.war.i',
    'ww1': 'world.war.i'
  };

  // Load user-learned tag mappings from GM storage (cached globally)
  const userLearnedTags = await loadUserLearnedTags();

  // Function to save a user's tag mapping choice
  async function saveUserTagMapping(normalizedTag, chosenTag) {
    console.log(`💾 Saving user mapping: "${normalizedTag}" → "${chosenTag}"`);
    userLearnedTags[normalizedTag] = chosenTag;
    globalUserLearnedTags[normalizedTag] = chosenTag; // Update global cache
    try {
      const saveStart = Date.now();
      await Promise.race([
        GM_setValue("user_tag_mappings", JSON.stringify(userLearnedTags)),
        new Promise((_, reject) => setTimeout(() => reject(new Error("GM_setValue timeout")), 5000))
      ]);
      console.log(`✓ Saved in ${Date.now() - saveStart}ms (Total: ${Object.keys(userLearnedTags).length} mappings)`);
    } catch (error) {
      console.error("❌ Failed to save user tag mapping:", error.message);
      alert(`Warning: Could not save tag mapping to storage: ${error.message}`);
    }
  }

  // Function to manage user-learned mappings
  async function manageUserMappings() {
    const mappingCount = Object.keys(userLearnedTags).length;

    if (mappingCount === 0) {
      await createModal(
        'User-Learned Tag Mappings',
        '<p>You have no saved tag mappings yet.</p><p style="color: #999; font-size: 12px;">When you map or split tags during review, they will be saved here for future use.</p>',
        [{ text: 'OK', value: true, class: 'moby-modal-button-primary' }]
      );
      return;
    }

    let listHTML = '<div class="moby-modal-list" style="max-height: 400px;">';
    Object.entries(userLearnedTags).forEach(([from, to], index) => {
      listHTML += `<div class="moby-modal-list-item">
        ${index + 1}. <strong>"${from}"</strong> → <strong style="color: #7cb342;">"${to}"</strong>
      </div>`;
    });
    listHTML += '</div>';

    const action = await createModal(
      `User-Learned Tag Mappings (${mappingCount})`,
      `<p>These are your saved tag mappings:</p>${listHTML}`,
      [
        { text: 'Keep All', value: 'keep', class: 'moby-modal-button-primary' },
        { text: 'Clear All', value: 'clear', class: 'moby-modal-button-secondary' }
      ]
    );

    if (action === 'clear') {
      const confirm = await createModal(
        'Confirm Clear All',
        `<p>Are you sure you want to clear all ${mappingCount} saved tag mappings?</p><p style="color: #ff9800;">This cannot be undone.</p>`,
        [
          { text: 'Yes, Clear All', value: true, class: 'moby-modal-button-secondary' },
          { text: 'Cancel', value: false, class: 'moby-modal-button-primary' }
        ]
      );

      if (confirm) {
        userLearnedTags = {};
        await GM_setValue("user_tag_mappings", JSON.stringify(userLearnedTags));
        console.log("Cleared all user tag mappings");
        await createModal(
          'Mappings Cleared',
          '<p style="color: #7cb342;">All user-learned tag mappings have been cleared.</p>',
          [{ text: 'OK', value: true, class: 'moby-modal-button-primary' }]
        );
      }
    }
  }

  // Levenshtein distance for fuzzy matching
  function levenshteinDistance(str1, str2) {
    const len1 = str1.length;
    const len2 = str2.length;
    const matrix = Array(len1 + 1).fill(null).map(() => Array(len2 + 1).fill(0));

    for (let i = 0; i <= len1; i++) matrix[i][0] = i;
    for (let j = 0; j <= len2; j++) matrix[0][j] = j;

    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,      // deletion
          matrix[i][j - 1] + 1,      // insertion
          matrix[i - 1][j - 1] + cost // substitution
        );
      }
    }

    return matrix[len1][len2];
  }

  // Find top fuzzy matches in official tags
  function findFuzzyMatches(tag, limit = 5, minConfidence = 0.4) {
    let matches = [];
    const maxDistance = Math.ceil(tag.length * 0.4); // Allow 40% character difference

    for (let officialTag of officialGGnTags) {
      // Exact match - return immediately
      if (tag === officialTag) {
        return [{ tag: officialTag, confidence: 1.0, method: 'exact' }];
      }

      let score = 0;
      let method = '';

      // Substring match
      if (officialTag.includes(tag) || tag.includes(officialTag)) {
        const longer = Math.max(tag.length, officialTag.length);
        const shorter = Math.min(tag.length, officialTag.length);
        score = shorter / longer;
        method = 'substring';
      }

      // Levenshtein distance (if no substring match or to get better score)
      const distance = levenshteinDistance(tag, officialTag);
      if (distance <= maxDistance) {
        const levScore = 1 - (distance / Math.max(tag.length, officialTag.length));
        if (levScore > score) {
          score = levScore;
          method = 'levenshtein';
        }
      }

      // Add to matches if above minimum confidence
      if (score >= minConfidence) {
        matches.push({ tag: officialTag, confidence: score, method });
      }
    }

    // Sort by confidence (highest first) and return top N
    matches.sort((a, b) => b.confidence - a.confidence);
    return matches.slice(0, limit);
  }

  // Smart tag processing function with validation
  var unmappedTags = []; // Track unmapped tags for user review

  function processTags(tag, originalTag) {
    if (!tag || tag.trim() === "") return [];

    // Normalize: trim, lowercase, replace spaces/hyphens with periods, remove parentheses
    tag = tag
      .trim()
      .toLowerCase()
      .replace(/[  -]/g, ".")
      .replace(/[\(\)]/g, "")
      .replace(/\.+/g, ".") // Replace multiple periods with single period
      .replace(/^\.|\.$/g, ""); // Remove leading/trailing periods

    if (tag === "") return [];

    const processedOriginal = originalTag || tag;

    // Step 1: Check if already in official list
    if (officialGGnTags.has(tag)) {
      console.log(`✓ Valid tag: "${tag}"`);
      return [tag];
    }

    // Step 2: Check user-learned tag mappings (highest priority after official tags)
    if (userLearnedTags[tag]) {
      const learnedMapping = userLearnedTags[tag];
      console.log(`★ User-learned: "${tag}" → "${learnedMapping}"`);

      // Check if the learned mapping is a split (contains comma)
      if (learnedMapping.includes(',')) {
        const splitTags = learnedMapping.split(',').map(t => t.trim()).filter(t => t.length > 0);
        console.log(`  ↔ Split: [${splitTags.join(', ')}]`);
        return splitTags;
      }

      return [learnedMapping];
    }

    // Step 3: Apply hardcoded aliases
    if (tagAliases[tag]) {
      tag = tagAliases[tag];
      console.log(`→ Alias: "${processedOriginal}" → "${tag}"`);
    }

    // Step 4: Check if aliased tag is valid
    if (officialGGnTags.has(tag)) {
      return [tag];
    }

    // Step 5: Check for known compound tags that should be split
    if (compoundSplits[tag]) {
      console.log(`↔ Split compound: "${tag}" → [${compoundSplits[tag].join(', ')}]`);
      return compoundSplits[tag];
    }

    // Step 6: Smart split logic for compound tags with keywords
    let results = [];

    // Check if tag contains a viewpoint keyword
    for (let viewpoint of viewpointKeywords) {
      if (tag.includes(viewpoint)) {
        results.push(viewpoint);
        let remainder = tag.replace(viewpoint, '').replace(/\.+/g, '.').replace(/^\.|\.$/g, '');
        if (remainder && remainder.length > 0) {
          results.push(remainder);
        }
        console.log(`↔ Split compound: "${tag}" → [${results.join(', ')}]`);
        return results;
      }
    }

    // Check if tag contains a mechanic keyword
    for (let mechanic of mechanicKeywords) {
      if (tag.includes(mechanic)) {
        results.push(mechanic);
        let remainder = tag.replace(mechanic, '').replace(/\.+/g, '.').replace(/^\.|\.$/g, '');
        if (remainder && remainder.length > 0) {
          results.push(remainder);
        }
        console.log(`↔ Split compound: "${tag}" → [${results.join(', ')}]`);
        return results;
      }
    }

    // Step 7: Try fuzzy matching - find multiple potential matches
    const matches = findFuzzyMatches(tag, 5, 0.4); // Top 5 matches, 40% minimum
    if (matches.length > 0) {
      console.log(`? Found ${matches.length} potential matches for "${tag}":`, matches.map(m => `${m.tag} (${Math.round(m.confidence * 100)}%)`));
      unmappedTags.push({
        original: processedOriginal,
        normalized: tag,
        suggestions: matches
      });
      return [tag]; // Return original for now, user will choose in review
    }

    // Step 8: No match found - track for user review
    console.warn(`⚠ No matches found for: "${tag}" (from "${processedOriginal}")`);
    unmappedTags.push({
      original: processedOriginal,
      normalized: tag,
      suggestions: []
    });
    return [tag];
  }

  var trimmed_tags_array = [];
  tags_array.forEach(function(tag) {
    let processed = processTags(tag, tag);
    processed.forEach(function(t) {
      if (t && !trimmed_tags_array.includes(t)) {
        trimmed_tags_array.push(t);
      }
    });
  });

  console.log("Final processed tags:", trimmed_tags_array);
  console.log(`⏱️ Tag processing took ${Date.now() - tagProcessStart}ms`);

  // Interactive review for unmapped/fuzzy-matched tags
  if (unmappedTags.length > 0) {
    console.log("⚠️ Tags needing review:", unmappedTags);
    console.log("🔍 Entering interactive tag review...");

    let listHTML = '<div class="moby-modal-list">';
    unmappedTags.forEach((ut, index) => {
      const hasSuggestions = ut.suggestions && ut.suggestions.length > 0;
      listHTML += `<div class="moby-modal-list-item">
        ${index + 1}. <strong>"${ut.original}"</strong>
        <br><span style="color: #666; font-size: 12px;">normalized: "${ut.normalized}"</span>`;

      if (hasSuggestions) {
        listHTML += `<br><span style="color: #7cb342; font-size: 11px;">✓ ${ut.suggestions.length} suggestion(s) available</span>`;
      } else {
        listHTML += `<br><span style="color: #ff9800; font-size: 11px;">⚠ No suggestions found</span>`;
      }

      listHTML += `</div>`;
    });
    listHTML += '</div>';

    const mappingCount = Object.keys(userLearnedTags).length;
    const mappingInfo = mappingCount > 0
      ? `<p style="margin-top: 10px; font-size: 12px; color: #7cb342;">★ You have ${mappingCount} saved tag mapping(s)</p>`
      : '';

    const bodyHTML = `
      <p>⚠️ The following tags need review:</p>
      ${listHTML}
      <p style="margin-top: 15px; font-size: 14px; color: #999;">
        Tags with suggestions have potential matches. Review each to select or customize.
      </p>
      ${mappingInfo}
    `;

    const shouldReview = await createModal(
      'Tag Review Required',
      bodyHTML,
      [
        { text: 'Review Each Tag', value: true, class: 'moby-modal-button-primary' },
        { text: 'Manage Mappings', value: 'manage', class: 'moby-modal-button' },
        { text: 'Keep All As-Is', value: false, class: 'moby-modal-button-secondary' }
      ]
    );

    if (shouldReview === 'manage') {
      // User wants to manage their saved mappings
      await manageUserMappings();
      // After managing, show the review dialog again
      return validate(platformSlug);
    }

    if (shouldReview) {
      // User wants to review individually
      let finalTags = trimmed_tags_array.filter(t => !unmappedTags.some(ut => ut.normalized === t));

      for (let i = 0; i < unmappedTags.length; i++) {
        let ut = unmappedTags[i];
        const hasSuggestions = ut.suggestions && ut.suggestions.length > 0;

        // Build suggestion buttons HTML
        let suggestionsHTML = '';
        if (hasSuggestions) {
          suggestionsHTML = '<div style="margin: 15px 0;"><p style="color: #7cb342; margin-bottom: 10px;"><strong>Suggested matches:</strong></p>';
          ut.suggestions.forEach((suggestion, idx) => {
            suggestionsHTML += `<button class="moby-suggestion-button" data-tag="${suggestion.tag}" style="display: block; width: 100%; margin: 5px 0; padding: 8px; background: #0f0f0f; border: 1px solid #2a2a2a; color: #ccc; text-align: left; cursor: pointer; font-family: monospace;">
              ${idx + 1}. <strong style="color: #7cb342;">${suggestion.tag}</strong>
              <span style="color: #999; float: right;">${Math.round(suggestion.confidence * 100)}% match</span>
            </button>`;
          });
          suggestionsHTML += '</div>';
        }

        const reviewBodyHTML = `
          <div class="moby-tag-review-item">
            <p><strong>Original:</strong> "${ut.original}"</p>
            <p><strong>Normalized:</strong> "${ut.normalized}"</p>
          </div>
          ${suggestionsHTML}
          <p style="margin-top: 15px; font-size: 14px; color: #999;">
            ${hasSuggestions ? 'Click a suggestion above, or enter a custom tag:' : 'No suggestions found. Enter a custom tag or keep/skip:'}
          </p>
        `;

        const userChoice = await createSelectOrInputModal(
          `Review Tag ${i + 1} of ${unmappedTags.length}`,
          reviewBodyHTML,
          ut.normalized,
          [
            { text: 'Keep / Use Custom', returnInput: true, class: 'moby-modal-button-primary' },
            { text: 'Split This Tag', value: '__SPLIT__', class: 'moby-modal-button' },
            { text: 'Skip This Tag', value: null, class: 'moby-modal-button-secondary' }
          ]
        );

        if (userChoice === '__SPLIT__') {
          // User wants to split the tag
          const splitPrompt = `
            <p>Enter the tags to split "${ut.normalized}" into, separated by commas:</p>
            <p style="font-size: 12px; color: #999;">Example: survival, horror</p>
          `;

          const splitInput = await createInputModal(
            'Split Tag',
            splitPrompt,
            ut.normalized.replace(/\./g, ', '),
            [
              { text: 'Split', returnInput: true, class: 'moby-modal-button-primary' },
              { text: 'Cancel', value: null, class: 'moby-modal-button-secondary' }
            ]
          );

          if (splitInput !== null) {
            // Split by commas and process each tag
            const splitTags = splitInput.split(',').map(t => {
              return t.trim().toLowerCase().replace(/[  -]/g, ".").replace(/[\(\)]/g, "");
            }).filter(t => t.length > 0);

            console.log(`Split tag: "${ut.normalized}" → [${splitTags.join(', ')}]`);

            // Save the split mapping for future use (stored as comma-separated string)
            await saveUserTagMapping(ut.normalized, splitTags.join(', '));

            splitTags.forEach(splitTag => {
              if (officialGGnTags.has(splitTag)) {
                console.log(`  ✓ "${splitTag}" is a valid official tag`);
              } else {
                console.warn(`  ⚠ "${splitTag}" is not in official tag list`);
              }

              if (!finalTags.includes(splitTag)) {
                finalTags.push(splitTag);
              }
            });
          } else {
            // User cancelled split, keep original
            console.log(`Split cancelled, kept tag: "${ut.normalized}"`);
            finalTags.push(ut.normalized);
          }
        } else if (userChoice === null) {
          // User pressed Skip - skip this tag
          console.log(`Skipped tag: "${ut.normalized}"`);
        } else if (userChoice.trim() === "" || userChoice === ut.normalized) {
          // User kept original
          console.log(`Kept tag: "${ut.normalized}"`);
          finalTags.push(ut.normalized);
        } else {
          // User entered a replacement or selected suggestion
          let replacement = userChoice.trim().toLowerCase().replace(/[  -]/g, ".").replace(/[\(\)]/g, "");
          console.log(`Replaced tag: "${ut.normalized}" → "${replacement}"`);

          // Save this mapping for future use (only if it's different from the original)
          if (replacement !== ut.normalized) {
            await saveUserTagMapping(ut.normalized, replacement);
          }

          // Check if replacement is valid
          if (officialGGnTags.has(replacement)) {
            console.log(`✓ Replacement is a valid official tag!`);
          } else {
            console.warn(`⚠ Replacement "${replacement}" is not in official tag list`);
          }

          if (!finalTags.includes(replacement)) {
            finalTags.push(replacement);
          }
        }
      }

      trimmed_tags_array = finalTags;
      console.log("Final tags after review:", trimmed_tags_array);
    } else {
      // User chose to include all unmapped tags as-is
      console.log("User chose to keep all unmapped tags as-is");
    }
  }

  mobygames.tags = trimmed_tags_array.join(", ");
  console.log("Tags string for GGn:", mobygames.tags);

  mobygames.title = $(".mb h1").get(0)?.innerText.trim();

  mobygames.platform = "";
  var platform = platformSlug;
  var platform_map = {
    "3do": "3DO",
    "3ds": "Nintendo 3DS",
    "adventure-vision": "Entex Adventure Vision",
    "amiga": "Commodore Amiga",
    "amiga-cd32": "Amiga CD32",
    "android": "Android",
    "apple2": "Apple II",
    "arcadia-2001": "Emerson Arcadia 2001",
    "atari-2600": "Atari 2600",
    "atari-5200": "Atari 5200",
    "atari-7800": "Atari 7800",
    "atari-st": "Atari ST",
    "c128": "Commodore 128",
    "c64": "Commodore 64",
    "casio-loopy": "Casio Loopy",
    "casio-pv-1000": "Casio PV-1000",
    "cd-i": "Philips CD-i",
    "channel-f": "Fairchild Channel F",
    "colecovision": "Colecovision",
    "commodore-16-plus4": "Commodore Plus-4",
    "cpc": "Amstrad CPC",
    "creativision": "CreatiVision",
    "dos": "DOS",
    "dreamcast": "Dreamcast",
    "dvd-player": "Interactive DVD",
    "hd-dvd-player": "Interactive DVD",
    "epoch-super-cassette-vision": "Epoch Super Casette Vision",
    "game-com": "Game.com",
    "game-gear": "Game Gear",
    "gameboy": "Game Boy",
    "gameboy-advance": "Game Boy Advance",
    "gameboy-color": "Game Boy Color",
    "gamecube": "Nintendo GameCube",
    "genesis": "Mega Drive",
    "gizmondo": "Gizmondo",
    "gp32": "GamePark GP32",
    "intellivision": "Mattel Intellivision",
    "iphone": "iOS",
    "ipad": "iOS",
    "jaguar": "Atari Jaguar",
    "linux": "Linux",
    "lynx": "Atari Lynx",
    "macintosh": "Mac",
    "memotech-mtx": "Memotech MTX",
    "msx": "MSX",
    "n64": "Nintendo 64",
    "neo-geo": "SNK Neo Geo",
    "neo-geo-pocket": "SNK Neo Geo Pocket",
    "nes": "NES",
    "new-nintendo-3ds": "New Nintendo 3DS",
    "ngage": "Nokia N-Gage",
    "nintendo-ds": "Nintendo DS",
    "oculus-quest": "Oculus Quest",
    "odyssey": "Magnavox-Phillips Odyssey",
    "odyssey-2": "Magnavox-Phillips Odyssey",
    "oric": "Tangerine Oric",
    "ouya": "Ouya",
    "pc-fx": "NEC PC-FX",
    "pc98": "NEC PC-98",
    "pippin": "Apple Bandai Pippin",
    "playstation": "PlayStation 1",
    "playstation-4": "PlayStation 4",
    "pokemon-mini": "Pokemon Mini",
    "ps-vita": "PlayStation Vita",
    "ps2": "PlayStation 2",
    "ps3": "PlayStation 3",
    "psp": "PlayStation Portable",
    "rca-studio-ii": "RCA Studio II",
    "sam-coupe": "Miles Gordon Sam Coupe",
    "sega-master-system": "Master System",
    "sega-pico": "Pico",
    "sega-saturn": "Saturn",
    "sg-1000": "SG-1000",
    "sharp-x1": "Sharp X1",
    "sharp-x68000": "Sharp X68000",
    "snes": "SNES",
    "super-acan": "Funtech Super Acan",
    "supergrafx": "NEC SuperGrafx",
    "supervision": "Watara Supervision",
    "switch": "Switch",
    "thomson-mo": "Thomson MO5",
    "turbo-grafx": "NEC TurboGrafx-16",
    "vectrex": "General Computer Vectrex",
    "vic-20": "Commodore VIC-20",
    "videopac-g7400": "Philips Videopac+",
    "virtual-boy": "Virtual Boy",
    "vsmile": "V.Smile",
    "wii": "Wii",
    "wii-u": "Wii U",
    "windows": "Windows",
    "wonderswan": "Bandai WonderSwan",
    "wonderswan-color": "Bandai WonderSwan Color",
    "xbox": "Xbox",
    "xbox360": "Xbox 360",
    "zx-spectrum": "ZX Spectrum",
    "default": "Retro - Other",
  };
  mobygames.platform = platform_map[platform] || platform_map['default'];

  console.log("=== FINAL MOBYGAMES OBJECT ===");
  console.log("Title:", mobygames.title);
  console.log("Platform:", mobygames.platform);
  console.log("Year:", mobygames.year);
  console.log("Tags:", mobygames.tags);
  console.log("Cover:", mobygames.cover ? "Yes" : "No");
  console.log("Screenshots:", mobygames.screenshots ? mobygames.screenshots.length : 0);
  console.log("Description length:", mobygames.description ? mobygames.description.length : 0);
  console.log("==============================");

  console.log("💾 Saving mobygames data to GM storage...");
  try {
    const finalSaveStart = Date.now();
    await Promise.race([
      GM_setValue("mobygames", JSON.stringify(mobygames)),
      new Promise((_, reject) => setTimeout(() => reject(new Error("GM_setValue timeout")), 5000))
    ]);
    console.log(`✓ Data saved to GM storage in ${Date.now() - finalSaveStart}ms`);
  } catch (error) {
    console.error("❌ Failed to save mobygames data:", error.message);
    alert(`Error: Could not save data to storage: ${error.message}\n\nPlease try clicking the button again.`);
    $('.fa-spinner').hide();
    return;
  }

  let specLink = $('a[href$="/specs/"]:not(.disabled)');
  let pcBased = mobygames.platform === "Windows" || mobygames.platform === "DOS";
  console.log("Spec link found:", specLink.length > 0);
  console.log("PC-based platform:", pcBased);

  console.log(`\n✅ VALIDATE COMPLETE - Total time: ${Date.now() - startTime}ms\n`);

  if (specLink.length && pcBased) {
    console.log("🔄 Redirecting to specs page...");
    window.location = specLink[0].href;
  } else {
    $('.fa-spinner').hide();
    alert("Uploady done! Tags: " + (mobygames.tags || "NONE"));
  }
}

async function handleSpecs() {
  await new Promise(r => setTimeout(r, 500));
  let mobygames = JSON.parse((await GM_getValue("mobygames")) || "{}");

  let os_index = $('tr:contains('+ mobygames.platform +')').index()
  let indexfilter = function(){
    return $(this).closest('tr').index() > os_index;
  }

  let specs = {};
  let spec_get_defs = {
      'OS': 'Minimum OS Class Required',
      'Processor': 'Minimum CPU Class Required',
      'Memory': 'Minimum RAM Required',
      'DirectX': 'Minimum DirectX Version Required'
  };
  for (let key in spec_get_defs) {
    specs[key] = $('td:contains('+spec_get_defs[key]+')').filter(indexfilter).first().next().text().trim();
  }
  Object.keys(specs).forEach((k) => !specs[k] && delete specs[k]);

  if (Object.keys(specs).length === 0)
    return;

  mobygames['description'] += "[quote][align=center][b][u]System Requirements[/u][/b][/align]\n";
  for (let key in specs) {
    mobygames['description'] += "[*][b]" + key + "[/b]: " + specs[key] + "\n"
  }
  mobygames['description'] += '[/quote]';
  await GM_setValue("mobygames", JSON.stringify(mobygames));
  alert("Uploady done !");
}

function add_validate_button() {
  if (typeof console != "undefined" && typeof console.log != "undefined")
    console.log("Adding button to window");
  // Get all platforms available
  let platforms = [];
  $("dt:contains('Releases by Date')")
    .next()
    .find("ul li")
    .each((i, platform) => {
      let platformAnchor = $(platform).find("span a");
      let platformUrl = $(platformAnchor).attr("href");
      let platformSlug = platformUrl.replace(/\/platform\/(.+)\//, "$1");

      let platformJson = {
        name: $(platformAnchor).text(),
        slug: platformSlug,
      };

      platforms.push(platformJson);
    });

  // Add a button per platform to the page
  platforms.forEach((platform, i) => {
    console.log(platform, "|", i);
    $("body").prepend(
      '<input type="button" style="top:' +
      i * 50 +
      'px" platform="' +
      platform.slug +
      '" class="platform" value="' +
      platform.name +
      '"/>',
    );
  });

  // If there's only one platform we add a default button
  if (platforms.length == 0) {
    let platformAnchor = $("dt:contains('Released')").next().find("a:last");
    let platformUrl = $(platformAnchor).attr("href");
    let platformSlug = platformUrl.replace(/\/platform\/(.+)\//, "$1");

    $("body").prepend(
      '<input type="button" style="top:' +
      0 +
      'px" platform="' +
      platformSlug +
      '" class="platform" value="' +
      platformSlug +
      '"/>',
    );
  }

  // Adding click event to every button with double-click protection
  let isProcessing = false;
  $(".platform").click(function() {
    const platformSlug = $(this).attr("platform");
    const buttonText = $(this).val();

    if (isProcessing) {
      console.warn(`⚠️ Already processing! Ignoring click on "${buttonText}" button.`);
      alert("Already processing a request. Please wait for it to complete.");
      return;
    }

    console.log(`🖱️ Button clicked: "${buttonText}" (platform: ${platformSlug})`);
    isProcessing = true;

    validate(platformSlug).finally(() => {
      isProcessing = false;
      console.log("🔓 Processing lock released");
    });
  });
}

function button_css(index) {
  return "input.platform {\
                position: fixed;\
                left: 0;\
                z-index: 999999;\
                cursor: pointer;\
                height: auto;\
                width: auto;\
                padding: 10px;\
                background-color: lightblue;\
            }\
            .moby-modal {\
                position: fixed;\
                top: 0;\
                left: 0;\
                width: 100%;\
                height: 100%;\
                background: rgba(0, 0, 0, 0.85);\
                z-index: 10000000;\
                display: flex;\
                align-items: center;\
                justify-content: center;\
            }\
            .moby-modal-content {\
                background: #1a1a1a;\
                border: 1px solid #2a2a2a;\
                border-radius: 3px;\
                padding: 20px;\
                max-width: 600px;\
                max-height: 80vh;\
                overflow-y: auto;\
                box-shadow: 0 0 20px rgba(0,0,0,0.8);\
            }\
            .moby-modal-header {\
                font-size: 16px;\
                font-weight: bold;\
                margin-bottom: 15px;\
                color: #7cb342;\
                border-bottom: 1px solid #2a2a2a;\
                padding-bottom: 10px;\
            }\
            .moby-modal-body {\
                margin-bottom: 20px;\
                color: #bbb;\
                line-height: 1.5;\
            }\
            .moby-modal-body p {\
                margin: 10px 0;\
            }\
            .moby-modal-list {\
                background: #0f0f0f;\
                border: 1px solid #2a2a2a;\
                padding: 10px;\
                margin: 10px 0;\
                max-height: 300px;\
                overflow-y: auto;\
            }\
            .moby-modal-list-item {\
                padding: 8px;\
                border-bottom: 1px solid #2a2a2a;\
                font-family: monospace;\
                color: #ccc;\
            }\
            .moby-modal-list-item:last-child {\
                border-bottom: none;\
            }\
            .moby-modal-list-item strong {\
                color: #7cb342;\
            }\
            .moby-modal-buttons {\
                display: flex;\
                gap: 10px;\
                justify-content: flex-end;\
                margin-top: 20px;\
                padding-top: 15px;\
                border-top: 1px solid #2a2a2a;\
            }\
            .moby-modal-button {\
                padding: 8px 16px;\
                border: 1px solid #2a2a2a;\
                background: #2a2a2a;\
                color: #ccc;\
                cursor: pointer;\
                font-size: 13px;\
                font-weight: normal;\
            }\
            .moby-modal-button:hover {\
                background: #333;\
                border-color: #3a3a3a;\
            }\
            .moby-modal-button-primary {\
                background: #7cb342;\
                border-color: #7cb342;\
                color: #000;\
            }\
            .moby-modal-button-primary:hover {\
                background: #8bc34a;\
                border-color: #8bc34a;\
            }\
            .moby-modal-button-secondary {\
                background: #c62828;\
                border-color: #c62828;\
                color: #fff;\
            }\
            .moby-modal-button-secondary:hover {\
                background: #d32f2f;\
                border-color: #d32f2f;\
            }\
            .moby-modal-input {\
                width: 100%;\
                padding: 8px;\
                border: 1px solid #2a2a2a;\
                background: #0f0f0f;\
                color: #ccc;\
                font-family: monospace;\
                margin: 10px 0;\
                box-sizing: border-box;\
            }\
            .moby-modal-input:focus {\
                outline: none;\
                border-color: #7cb342;\
            }\
            .moby-tag-review-item {\
                background: #0f0f0f;\
                border: 1px solid #2a2a2a;\
                border-left: 3px solid #7cb342;\
                padding: 12px;\
                margin: 10px 0;\
            }\
            .moby-tag-review-item p {\
                margin: 5px 0;\
                color: #bbb;\
            }\
            .moby-tag-review-item strong {\
                color: #7cb342;\
            }\
            .moby-suggestion-button:hover {\
                background: #1a1a1a !important;\
                border-color: #3a3a3a !important;\
            }";
}

// Custom modal dialog system
function createModal(title, body, buttons) {
  return new Promise((resolve) => {
    const modal = $('<div class="moby-modal"></div>');
    const content = $('<div class="moby-modal-content"></div>');

    const header = $(`<div class="moby-modal-header">${title}</div>`);
    const bodyDiv = $(`<div class="moby-modal-body">${body}</div>`);
    const buttonDiv = $('<div class="moby-modal-buttons"></div>');

    buttons.forEach(btn => {
      const button = $(`<button class="moby-modal-button ${btn.class || 'moby-modal-button-primary'}">${btn.text}</button>`);
      button.on('click', () => {
        modal.remove();
        resolve(btn.value);
      });
      buttonDiv.append(button);
    });

    content.append(header, bodyDiv, buttonDiv);
    modal.append(content);
    $('body').append(modal);
  });
}

function createInputModal(title, body, defaultValue, buttons) {
  return new Promise((resolve) => {
    const modal = $('<div class="moby-modal"></div>');
    const content = $('<div class="moby-modal-content"></div>');

    const header = $(`<div class="moby-modal-header">${title}</div>`);
    const bodyDiv = $(`<div class="moby-modal-body">${body}</div>`);
    const input = $(`<input type="text" class="moby-modal-input" value="${defaultValue || ''}" />`);
    const buttonDiv = $('<div class="moby-modal-buttons"></div>');

    buttons.forEach(btn => {
      const button = $(`<button class="moby-modal-button ${btn.class || 'moby-modal-button-primary'}">${btn.text}</button>`);
      button.on('click', () => {
        modal.remove();
        if (btn.returnInput) {
          resolve(input.val());
        } else {
          resolve(btn.value);
        }
      });
      buttonDiv.append(button);
    });

    // Enter key submits
    input.on('keypress', (e) => {
      if (e.which === 13) {
        modal.remove();
        resolve(input.val());
      }
    });

    bodyDiv.append(input);
    content.append(header, bodyDiv, buttonDiv);
    modal.append(content);
    $('body').append(modal);

    // Auto-focus input
    setTimeout(() => input.focus(), 100);
  });
}

function createSelectOrInputModal(title, body, defaultValue, buttons) {
  return new Promise((resolve) => {
    const modal = $('<div class="moby-modal"></div>');
    const content = $('<div class="moby-modal-content"></div>');

    const header = $(`<div class="moby-modal-header">${title}</div>`);
    const bodyDiv = $(`<div class="moby-modal-body">${body}</div>`);
    const input = $(`<input type="text" class="moby-modal-input" value="${defaultValue || ''}" />`);
    const buttonDiv = $('<div class="moby-modal-buttons"></div>');

    buttons.forEach(btn => {
      const button = $(`<button class="moby-modal-button ${btn.class || 'moby-modal-button-primary'}">${btn.text}</button>`);
      button.on('click', () => {
        modal.remove();
        if (btn.returnInput) {
          resolve(input.val());
        } else {
          resolve(btn.value);
        }
      });
      buttonDiv.append(button);
    });

    // Enter key submits
    input.on('keypress', (e) => {
      if (e.which === 13) {
        modal.remove();
        resolve(input.val());
      }
    });

    // Suggestion button clicks set input value and can submit
    bodyDiv.on('click', '.moby-suggestion-button', function(e) {
      e.preventDefault();
      const selectedTag = $(this).data('tag');
      input.val(selectedTag);
      input.focus();
      // Highlight the selected suggestion
      bodyDiv.find('.moby-suggestion-button').css('border-color', '#2a2a2a');
      $(this).css('border-color', '#7cb342');
    });

    bodyDiv.append(input);
    content.append(header, bodyDiv, buttonDiv);
    modal.append(content);
    $('body').append(modal);

    // Auto-focus input
    setTimeout(() => input.focus(), 100);
  });
}