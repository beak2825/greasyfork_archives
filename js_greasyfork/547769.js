// ==UserScript==
// @name         SCR+
// @name:fr      SCR+
// @namespace    https://github.com/pierolb/scrplus
// @version      1.1
// @description  Enhances the Stepford County Railway website
// @description:fr  Améliore le site Stepford County Railway
// @author       PieroLB
// @match        https://stepfordcountyrailway.co.uk/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stepfordcountyrailway.co.uk
// @require      https://cdnjs.cloudflare.com/ajax/libs/microsoft-signalr/6.0.1/signalr.min.js
// @license      MIT
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/547769/SCR%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/547769/SCR%2B.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // SR Management

  const SR = { Meta: null, Realtime: null };

  SR.Meta = {
    connection: null,
    connect: function () {
      return new Promise((resolve, reject) => {
        if (this.connection) {
          try {
            if (
              typeof signalR !== "undefined" &&
              signalR.HubConnectionState &&
              this.connection.state === signalR.HubConnectionState.Connected
            ) {
              console.log("[SR - Meta] ℹ️ Connection already exists");
              return resolve({ status: "already-connected" });
            }
          } catch (e) {}

          console.log(
            "[SR - Meta] ℹ️ Connection object exists — attempting to start"
          );
          this.connection
            .start()
            .then(() => {
              console.log("[SR - Meta] ✅ Connected");
              resolve({ status: "connected" });
            })
            .catch((err) => {
              console.log("[SR - Meta] ❌ Connection failed. Error:", err);
              reject(err);
            });

          return;
        }

        // No existing connection: create and start a new one
        let builder = new signalR.HubConnectionBuilder().withUrl(
          "https://stepfordcountyrailway.co.uk/Push/Meta",
          {
            headers: {
              Cookie: document.cookie,
            },
          }
        );

        if (
          signalR &&
          signalR.protocols &&
          signalR.protocols.msgpack &&
          signalR.protocols.msgpack.MessagePackHubProtocol
        ) {
          builder = builder.withHubProtocol(
            new signalR.protocols.msgpack.MessagePackHubProtocol()
          );
        }

        this.connection = builder.build();

        this.connection
          .start()
          .then(() => {
            console.log("[SR - Meta] ✅ Connected");
            resolve({ status: "connected" });
          })
          .catch((err) => {
            console.log("[SR - Meta] ❌ Connection failed. Error:", err);
            reject(err);
          });
      });
    },
    routes: [
      { id: "R001", time: 18, points: 55, xp: 10 },
      { id: "R003", time: 25, points: 75, xp: 14 },
      { id: "R004", time: 19, points: 55, xp: 10 },
      { id: "R005", time: 21, points: 60, xp: 11 },
      { id: "R007", time: 12, points: 35, xp: 6 },
      { id: "R009", time: 28, points: 75, xp: 14 },
      { id: "R020", time: 10, points: 35, xp: 6 },
      { id: "R022", time: 10, points: 35, xp: 6 },
      { id: "R024", time: 44, points: 105, xp: 20 },
      { id: "R025", time: 35, points: 90, xp: 17 },
      { id: "R026", time: 44, points: 90, xp: 17 },
      { id: "R032", time: 17, points: 50, xp: 9 },
      { id: "R033", time: 19, points: 55, xp: 10 },
      { id: "R035", time: 39, points: 95, xp: 18 },
      { id: "R036", time: 45, points: 95, xp: 18 },
      { id: "R037", time: 20, points: 45, xp: 8 },
      { id: "R038", time: 16, points: 40, xp: 7 },
      { id: "R039", time: 14, points: 45, xp: 8 },
      { id: "R040", time: 22, points: 50, xp: 9 },
      { id: "R041", time: 4, points: 15, xp: 2 },
      { id: "R042", time: 22, points: 50, xp: 9 },
      { id: "R043", time: 4, points: 15, xp: 2 },
      { id: "R044", time: 15, points: 50, xp: 9 },
      { id: "R045", time: 26, points: 75, xp: 14 },
      { id: "R046", time: 23, points: 65, xp: 12 },
      { id: "R048", time: 16, points: 45, xp: 8 },
      { id: "R049", time: 5, points: 25, xp: 4 },
      { id: "R050", time: 21, points: 65, xp: 12 },
      { id: "R100", time: 7, points: 30, xp: 5 },
      { id: "R101", time: 7, points: 30, xp: 5 },
      { id: "R102", time: 18, points: 50, xp: 9 },
      { id: "R103", time: 14, points: 45, xp: 8 },
      { id: "R010", time: 11, points: 50, xp: 9 },
      { id: "R011", time: 11, points: 45, xp: 8 },
      { id: "R012", time: 13, points: 50, xp: 9 },
      { id: "R013", time: 5, points: 30, xp: 5 },
      { id: "R014", time: 16, points: 50, xp: 9 },
      { id: "R015", time: 5, points: 25, xp: 4 },
      { id: "R016", time: 10, points: 40, xp: 7 },
      { id: "R017", time: 14, points: 45, xp: 8 },
      { id: "R018", time: 16, points: 55, xp: 10 },
      { id: "R019", time: 5, points: 25, xp: 4 },
      { id: "R120", time: 13, points: 50, xp: 9 },
      { id: "R051", time: 8, points: 15, xp: 2 },
      { id: "R052", time: 13, points: 25, xp: 4 },
      { id: "R053", time: 16, points: 40, xp: 7 },
      { id: "R054", time: 11, points: 30, xp: 5 },
      { id: "R055", time: 16, points: 35, xp: 6 },
      { id: "R056", time: 8, points: 20, xp: 3 },
      { id: "R057", time: 13, points: 25, xp: 4 },
      { id: "R058", time: 13, points: 35, xp: 6 },
      { id: "R059", time: 14, points: 35, xp: 6 },
      { id: "R060", time: 10, points: 30, xp: 5 },
      { id: "R075", time: 6, points: 15, xp: 2 },
      { id: "R076", time: 13, points: 30, xp: 5 },
      { id: "R077", time: 23, points: 50, xp: 9 },
      { id: "R078", time: 22, points: 35, xp: 6 },
      { id: "R079", time: 6, points: 20, xp: 3 },
      { id: "R080", time: 20, points: 45, xp: 8 },
      { id: "R081", time: 17, points: 20, xp: 3 },
      { id: "R082", time: 19, points: 40, xp: 7 },
      { id: "R083", time: 24, points: 45, xp: 8 },
      { id: "R084", time: 27, points: 40, xp: 7 },
      { id: "R085", time: 20, points: 35, xp: 6 },
      { id: "R086", time: 14, points: 30, xp: 5 },
      { id: "R087", time: 17, points: 30, xp: 5 },
      { id: "R088", time: 24, points: 45, xp: 8 },
      { id: "R002", time: 17, points: 55, xp: 10 },
      { id: "R006", time: 21, points: 70, xp: 13 },
      { id: "R008", time: 19, points: 65, xp: 12 },
      { id: "R021", time: 8, points: 35, xp: 6 },
      { id: "R023", time: 14, points: 50, xp: 9 },
      { id: "R027", time: 13, points: 50, xp: 9 },
      { id: "R028", time: 8, points: 30, xp: 5 },
      { id: "R029", time: 4, points: 20, xp: 3 },
      { id: "R030", time: 21, points: 70, xp: 13 },
      { id: "R031", time: 16, points: 55, xp: 10 },
      { id: "R034", time: 21, points: 75, xp: 14 },
      { id: "R047", time: 10, points: 50, xp: 6 },
      { id: "R130", time: 17, points: 65, xp: 12 },
      { id: "R131", time: 11, points: 45, xp: 8 },
      { id: "R132", time: 13, points: 50, xp: 9 },
      { id: "R133", time: 22, points: 70, xp: 13 },
      { id: "R134", time: 7, points: 30, xp: 5 },
      { id: "R135", time: 18, points: 60, xp: 11 },
      { id: "R136", time: 20, points: 65, xp: 12 },
      { id: "R137", time: 25, points: 80, xp: 15 },
    ],
    stations: [],
    getGlobalData: function () {
      return new Promise((resolve, reject) => {
        this.connection
          .invoke("GetWorldViewModel")
          .then((response) => {
            const result = response.routes.routes.map((route) => {
              return {
                id: route.id,
                name: route.name,
                operator: route.operatorId,
                stations: route.stationsOnRoute,
              };
            });
            const merged = Object.values(
              [...this.routes, ...result].reduce((acc, obj) => {
                if (!acc[obj.id]) {
                  acc[obj.id] = { ...obj };
                } else {
                  acc[obj.id] = { ...acc[obj.id], ...obj }; // fusion des propriétés
                }
                return acc;
              }, {})
            );
            this.routes = merged;
            console.log("[SR - Meta] ✅ Routes getted");
            this.stations = response.stations.stations.map((station) => {
              return {
                id: station.id,
                name: station.name,
                operators: station.operatorIds,
              };
            });
            console.log("[SR - Meta] ✅ Stations getted");
            resolve();
          })
          .catch((err) => {
            console.log(
              "[SR - Meta] ❌ getGlobalData.GetWorldViewModel error :",
              err
            );
            reject();
          });
      });
    },
    servers: [],
    getServers: function () {
      return new Promise((resolve, reject) => {
        this.connection
          .invoke("GetOnlineServers")
          .then((response) => {
            if (response && response.servers) {
              this.servers = response.servers;
              console.log("[SR - Meta] ✅ Servers getted");
              resolve();
            } else {
              reject();
            }
          })
          .catch((err) => {
            console.log(
              "[SR - Meta] ❌ getGlobalData.GetWorldViewModel error :",
              err
            );
            reject();
          });
      });
    },
    getServer: function (serverId) {
      return new Promise((resolve, reject) => {
        this.connection
          .invoke("GetServer", serverId)
          .then((response) => {
            resolve(response);
          })
          .catch((err) => {
            console.error(
              "[SR - Meta] ❌ getPreciseData.GetOnlineServers error :",
              err
            );
            reject(err);
          });
      });
    },
    getLiveActivitiesByServer: function (serverId) {
      return new Promise((resolve, reject) => {
        this.connection
          .invoke("GetLiveActivitiesByServer", serverId)
          .then((response) => {
            resolve(response);
          })
          .catch((err) => {
            console.error(
              "[SR - Meta] ❌ getPreciseData.GetLiveActivitiesByServer error :",
              err
            );
            reject(err);
          });
      });
    },
    getPlayerCurrentActivity: function (playerId) {
      return new Promise((resolve, reject) => {
        this.connection
          .invoke("GetPlayerCurrentActivity", playerId)
          .then((response) => {
            resolve(response);
          })
          .catch((err) => {
            console.log("[SR - Meta] ❌ getPlayerCurrentActivity error :", err);
            reject(err);
          });
      });
    },
    getPlayersCurrentActivity: function (playerId1, playerId2) {
      return new Promise((resolve, reject) => {
        Promise.all([
          this.getPlayerCurrentActivity(playerId1),
          this.getPlayerCurrentActivity(playerId2),
        ])
          .then(([activity1, activity2]) => {
            resolve({ player1: activity1, player2: activity2 });
          })
          .catch((err) => {
            console.log(
              "[SR - Meta] ❌ getPlayersCurrentActivity error :",
              err
            );
            reject(err);
          });
      });
    },
    watchPlayerCurrentActivity: function (playerId, onUpdate) {
      const eventName = "GetPlayerCurrentActivity";
      const logPrefix = `[SR - Meta] ${eventName}`;

      return this.connect()
        .then(() => {
          this.connection.invoke(eventName, playerId).then((response) => {
            console.log(`${logPrefix} response:`, response);
            // if (typeof onUpdate === "function") {
            //   try {
            //     onUpdate(response);
            //   } catch (cbError) {
            //     console.log(`${logPrefix} callback error:`, cbError);
            //   }
            // }
            // return response;
          });
          this.connection.invoke(eventName, playerId).then((response) => {
            console.log(`${logPrefix} response:`, response);
            // if (typeof onUpdate === "function") {
            //   try {
            //     onUpdate(response);
            //   } catch (cbError) {
            //     console.log(`${logPrefix} callback error:`, cbError);
            //   }
            // }
            // return response;
          });
        })
        .catch((err) => {
          console.log(`${logPrefix} error:`, err);
          throw err;
        });
    },
    on: function (eventName, handler) {
      if (!this.connection) {
        console.log(
          "[SR - Meta] ⚠️ No connection available for event listener"
        );
        return;
      }
      this.connection.on(eventName, handler);
      console.log(`[SR - Meta] 👂 Listening to event: ${eventName}`);
    },
    off: function (eventName, handler) {
      if (!this.connection) return;
      this.connection.off(eventName, handler);
      console.log(`[SR - Meta] 🔇 Stopped listening to event: ${eventName}`);
    },
    getServersWithoutDispatcher: function (stationId) {
      return Promise.all(
        this.servers.map((server) => {
          return this.getServer(server.id).then((s) => {
            const hasDispatcher =
              s.liveActivitiesViewModel.serverDispatchers.some(
                (d) => d.stationId === stationId
              );
            return hasDispatcher ? null : server;
          });
        })
      ).then((results) => results.filter(Boolean));
    },
  };

  SR.Realtime = {
    connection: null,
    connect: function () {
      return new Promise((resolve, reject) => {
        if (this.connection) {
          try {
            if (
              typeof signalR !== "undefined" &&
              signalR.HubConnectionState &&
              this.connection.state === signalR.HubConnectionState.Connected
            ) {
              console.log("[SR - RealTime] ℹ️ Connection already exists");
              return resolve({ status: "already-connected" });
            }
          } catch (e) {}
          console.log(
            "[SR - RealTime] ℹ️ Connection object exists — attempting to start"
          );
          this.connection
            .start()
            .then(() => {
              console.log("[SR - RealTime] ✅ Connected");
              resolve({ status: "connected" });
            })
            .catch((err) => {
              console.log("[SR - RealTime] ❌ Connection failed. Error:", err);
              reject(err);
            });
          return;
        }
        // No existing connection: create and start a new one
        this.connection = new signalR.HubConnectionBuilder()
          .withUrl("https://stepfordcountyrailway.co.uk/Push/RealTime", {
            headers: {
              Cookie: document.cookie,
            },
          })
          .build();
        this.connection
          .start()
          .then(() => {
            console.log("[SR - RealTime] ✅ Connected");
            resolve({ status: "connected" });
          })
          .catch((err) => {
            console.log("[SR - RealTime] ❌ Connection failed. Error:", err);
            reject(err);
          });
      });
    },
    joinPlayerGroup: function (playerId) {
      return new Promise((resolve, reject) => {
        this.connection
          .invoke("JoinGroup", `Player:${playerId}`)
          .then((response) => {
            console.log(response);
            resolve();
          })
          .catch((err) => {
            console.log("[SR - RealTime] ❌ JoinGroup error :", err);
            reject();
          });
      });
    },
    joinRoleTaskGroup: function (taskId) {
      return new Promise((resolve, reject) => {
        this.connection
          .invoke("JoinGroup", `RoleTask:${taskId}`)
          .then((response) => {
            console.log(response);
            resolve();
          })
          .catch((err) => {
            console.log("[SR - RealTime] ❌ joinRoleTaskGroup error :", err);
            reject();
          });
      });
    },
  };

  // UI Interactions
  const convertClock = (e) => {
    e.parentElement.parentElement.removeAttribute("title");
    e.parentElement.parentElement.style.userSelect = "none";
    const formatDigit = (n) =>
      n.toString().length == 2 ? n.toString() : "0" + n;
    setInterval(() => {
      const d = new Date();
      const offsetHours = -d.getTimezoneOffset() / 60;
      const sign = offsetHours >= 0 ? "+" : "";
      e.textContent = `${formatDigit(d.getHours())}:${formatDigit(
        d.getMinutes()
      )}:${formatDigit(d.getSeconds())} (GMT${sign}${offsetHours})`;
    });
  };
  const convertTime = (e) => {
    const timeValueElem =
      e.parentElement.parentElement.querySelector(".fw-bolder.fs-4");
    const timeInMin = parseFloat(
      timeValueElem.textContent
        .replace(/[\s\u00A0\u202F]+/g, "")
        .replace("minutes", "")
        .replace(",", ".")
    );
    const hours = Math.floor(timeInMin / 60).toString();
    const minutes = Math.floor(timeInMin % 60).toString();
    timeValueElem.textContent = `${hours}h ${minutes}m`;
  };
  const convertDistance = (e) => {
    const distanceValueElem =
      e.parentElement.parentElement.querySelector(".fw-bolder.fs-4");
    const distanceInMiles = parseFloat(
      distanceValueElem.textContent
        .replace(/[\s\u00A0\u202F]+/g, "")
        .replace("miles", "")
        .replace(",", ".")
    );
    const distanceInKM = Math.round(distanceInMiles * 1.609344);
    distanceValueElem.textContent = `${distanceInKM} km`;
  };

  const clockLoop = setInterval(() => {
    if (
      document.querySelector(
        ".nav.my-2.justify-content-center .font-monospace.small"
      )
    ) {
      clearInterval(clockLoop);
      convertClock(
        document.querySelector(
          ".nav.my-2.justify-content-center .font-monospace.small"
        )
      );
    }
  });
  const mapLoop = setInterval(() => {
    if (document.querySelector(".order-2.order-lg-1.flex-fill")) {
      clearInterval(mapLoop);
      const div = document.createElement("div");
      div.className = "nav-item";
      const a = document.createElement("a");
      a.style.cursor = "pointer";
      a.className = "nav-link text-white";
      div.appendChild(a);
      const i = document.createElement("i");
      i.className = "bi bi-map";
      a.appendChild(i);
      a.innerHTML += " Map";
      document
        .querySelector(".order-2.order-lg-1.flex-fill .nav.me-auto")
        .appendChild(div);

      a.addEventListener("click", () => {
        const div = document.createElement("div");
        div.style =
          "z-index: 99999; position: fixed; top: 0; left: 0; width: 100%; height: 100%; display: flex; align-items:center; justify-content: center; background-color: rgba(0, 0, 0, 0.7)";
        document.body.appendChild(div);
        div.innerHTML =
          "<i style='color:white; font-size: 3rem'>Loading...</i>";
        div.addEventListener("click", (event) => {
          if (event.target === div) div.remove();
        });

        const img = document.createElement("img");
        img.src = "https://i.redd.it/qtwey1i9nxcg1.png";
        img.style.maxHeight = "90%";
        img.style.maxWidth = "90%";
        div.innerHTML = "";
        div.appendChild(img);

        const btns = document.createElement("div");
        btns.style =
          "display: flex; align-items:center; position: absolute; top:20px; right:20px; font-size: 20px";
        div.appendChild(btns);
        const btn1 = document.createElement("a");
        btn1.className = "bi bi-box-arrow-up-right";
        btn1.href =
          "https://www.reddit.com/r/stepfordcountyrailway/comments/1qax3si/scr_23_signalling_zones_map";
        btn1.style =
          "display: flex; align-items:center; margin-right: 10px; cursor: pointer; text-decoration: none; outline:none";
        btn1.target = "_blank";
        btns.appendChild(btn1);
        const btn2 = document.createElement("a");
        btn2.className = "bi bi-x-lg";
        btn2.style =
          "display: flex; align-items:center; cursor: pointer; text-decoration: none; outline:none";
        btns.appendChild(btn2);
        btn2.addEventListener("click", () => div.remove());
      });
    }
  });
  const guidesMenuLoop = setInterval(() => {
    if (document.querySelector(".order-2.order-lg-1.flex-fill")) {
      clearInterval(guidesMenuLoop);
      const div = document.createElement("div");
      div.className = "nav-item";
      const a = document.createElement("a");
      a.id = "guidesDropdown";
      a.href = "#";
      a.role = "button";
      a.setAttribute("data-bs-toggle", "dropdown");
      a.setAttribute("aria-haspopup", "true");
      a.setAttribute("aria-expanded", "false");
      a.className = "nav-link dropdown-toggle text-white";
      div.appendChild(a);
      const i = document.createElement("i");
      i.className = "bi bi-journal-text";
      a.appendChild(i);
      a.innerHTML += " Guides";
      document
        .querySelector(".order-2.order-lg-1.flex-fill .nav.me-auto")
        .appendChild(div);
      const ul = document.createElement("ul");
      ul.className = "dropdown-menu";
      ul.setAttribute("aria-labelledby", "guidesDropdown");
      div.appendChild(ul);
      const guidesList = [
        {
          name: "Driving Guide",
          href: "https://drive.google.com/file/d/1aRGR6RKKbgBI6C8rMs0x3HyZY9SOjcv-/view?usp=drivesdk",
          code: "QD",
        },
        {
          name: "Dispatcher Guide",
          href: "https://drive.google.com/file/d/1Ma-Z2MdD-jcdEhqDURk5Fh6yJuDoWGPN/view?usp=drivesdk",
          code: "DS",
        },
        {
          name: "Guard Guide",
          href: "https://drive.google.com/file/d/1w99tZ4CF96SxzUc5CT3qpDzGvFQomqUy/view?usp=drivesdk",
          code: "GD",
        },
        {
          name: "Signaller Guides",
          href: "https://drive.google.com/drive/u/0/folders/1RKv4ZPt-sj-swUzPYMFZqMr6oW3jHXUw",
          code: "SG",
        },
      ];
      // <span class="rank-sign rounded m-1 p-1 bg-gd" title="Guard">GD</span>
      for (const guide of guidesList) {
        const li = document.createElement("li");
        ul.appendChild(li);
        const a = document.createElement("a");
        a.className = "dropdown-item text-white";
        a.href = guide.href;
        a.target = "_blank";
        li.appendChild(a);
        const span = document.createElement("span");
        span.className = `rank-sign rounded p-1 bg-${guide.code.toLowerCase()}`;
        span.style =
          "margin-right: 6px; font-size: 12px; border-radius: 0.6rem !important";
        span.textContent = guide.code;
        a.appendChild(span);
        a.appendChild(document.createTextNode(guide.name));
      }
      // a.addEventListener("click", () => ul.classList.add("show"));
    }
  });

  var currentPage = "";
  const checkPageLoop = setInterval(() => {
    if (location.pathname.split("/")[1] === "Players") {
      if (currentPage !== "Players") {
        currentPage = "Players";
        const loop = setInterval(() => {
          if (
            document.querySelector(
              ".d-flex.flex-column.flex-row.h-100 .text-uppercase"
            )
          ) {
            clearInterval(loop);
            const usesMiles = () => {
              const locale = navigator.language || navigator.userLanguage;
              const mileCountries = ["US", "GB", "MM", "LR"];
              const country = locale.split("-")[1];
              return mileCountries.includes(country);
            };
            document
              .querySelectorAll(
                ".d-flex.flex-column.flex-row.h-100 .text-uppercase"
              )
              .forEach((e) => {
                if (
                  e.textContent === "Total Playtime" ||
                  e.textContent === "Driving Time" ||
                  e.textContent === "Dispatching Time" ||
                  e.textContent === "Guarding Time"
                ) {
                  convertTime(e);
                } else if (
                  e.textContent === "Distance Driven" &&
                  !usesMiles()
                ) {
                  convertDistance(e);
                }
              });
          }
        });
      }
    } else if (location.pathname.split("/")[1] === "Servers") {
      if (!location.pathname.split("/")[2]) {
        if (currentPage !== "Servers") {
          currentPage = "Servers";
          SR.Meta.connect().then(() =>
            SR.Meta.getGlobalData().then(() => SR.Meta.getServers())
          );
          const loop = setInterval(() => {
            if (
              document.querySelectorAll(
                ".row.row-cols-xl-3.row-cols-md-2.row-cols-1 > .col.mb-4"
              ).length > 0
            ) {
              clearInterval(loop);
              const div = document.createElement("div");
              div.className = "col-12 mb-4";
              div.style.fontSize = "1.2rem";
              document
                .querySelector(".col-12.mb-4")
                .parentElement.appendChild(div);
              const span = document.createElement("span");
              span.textContent = "Find a server without dispatchers in ";
              div.appendChild(span);
              const select = document.createElement("select");
              select.className = "form-control form-control-lg";
              select.style.width = "auto";
              select.style.display = "inline-block";
              select.style.marginLeft = "10px";
              div.appendChild(select);
              select.innerHTML = `<option value="null">No station selected</option>`;
              SR.Meta.stations
                .sort((a, b) => a.name > b.name)
                .forEach((station) => {
                  select.innerHTML += `<option value="${station.id}">${station.name}</option>`;
                });
              select.value = "null";
              const btn = document.createElement("button");
              btn.textContent = "Search";
              btn.className = "btn btn-lg btn-primary";
              btn.style.marginLeft = "10px";
              div.appendChild(btn);
              const counter = document.createElement("span");
              counter.style.marginLeft = "10px";
              counter.textContent = `${SR.Meta.servers.length}/${
                SR.Meta.servers.length
              } server${SR.Meta.servers.length > 1 ? "s" : ""}`;
              div.appendChild(counter);
              btn.addEventListener("click", () => {
                btn.textContent = "Loading...";
                if (select.value === "null") {
                  document
                    .querySelectorAll(
                      ".row.row-cols-xl-3.row-cols-md-2.row-cols-1 .col.mb-4"
                    )
                    .forEach((card) => (card.style.display = "block"));
                  counter.textContent = `${SR.Meta.servers.length}/${
                    SR.Meta.servers.length
                  } server${SR.Meta.servers.length > 1 ? "s" : ""}`;
                  btn.textContent = "Search";
                } else {
                  SR.Meta.getServersWithoutDispatcher(select.value).then(
                    (servers) => {
                      document
                        .querySelectorAll(
                          ".row.row-cols-xl-3.row-cols-md-2.row-cols-1 .col.mb-4"
                        )
                        .forEach((card) => {
                          const name = card
                            .querySelector(
                              ".card-header.fw-bold.d-flex.justify-content-between > span:first-child"
                            )
                            .textContent.replace("Server", "")
                            .replace(/[\s\u00A0\u202F]+/g, "");
                          if (!servers.find((s) => s.name === name)) {
                            card.style.display = "none";
                          } else {
                            card.style.display = "block";
                          }
                        });
                      counter.textContent = `${servers.length}/${
                        SR.Meta.servers.length
                      } server${servers.length > 1 ? "s" : ""}`;
                      btn.textContent = "Search";
                    }
                  );
                }
              });
            }
          });
        }
      }
    } else if (location.pathname.split("/")[1] === "Routes") {
      if (currentPage !== "Routes") {
        currentPage = "Routes";
        SR.Meta.connect().then(() =>
          SR.Meta.getGlobalData().then(() => {
            const loop = setInterval(() => {
              if (
                document.querySelectorAll(
                  ".row.row-cols-md-3.row-cols-2.g-4.mb-4 > .col"
                ).length > 0 &&
                document.querySelector(".py-4").textContent.trim() === "Routes"
              ) {
                clearInterval(loop);
                document.querySelector(
                  ".page > .container > .row:last-child"
                ).style = "overflow-y: auto; height: 61vh; margin-top: 0px";
                let routes = [];
                document
                  .querySelectorAll(
                    ".row.row-cols-md-3.row-cols-2.g-4.mb-4 > .col"
                  )
                  .forEach((card) => {
                    const header = card.querySelector(".card-header");
                    header.style.display = "flex";
                    if (header.childNodes[4]) {
                      header.childNodes[4].style =
                        "white-space: nowrap; overflow: hidden; text-overflow: ellipsis";
                    }
                    const routeId = header.childNodes[3].textContent.trim();
                    const route = SR.Meta.routes.find((r) => r.id === routeId);
                    route.card = card;
                    routes.push(route);
                    if (route && route.points && route.xp) {
                      const div = document.createElement("div");
                      div.style =
                        "margin-left: auto; text-align:right; white-space: nowrap; ";
                      const ppm =
                        Math.round((route.points / route.time) * 100) / 100;
                      const xppm =
                        Math.round((route.xp / route.time) * 100) / 100;
                      route.ppm = ppm;
                      route.xppm = xppm;
                      div.textContent = `PPM=${ppm} XPPM=${xppm}`;
                      header.appendChild(div);
                    }
                  });

                const div = document.createElement("div");
                div.className = "col-12 mb-4";
                div.style.fontSize = "1.2rem";
                document
                  .querySelector(".col-12.mb-4")
                  .parentElement.appendChild(div);
                const span = document.createElement("span");
                span.textContent = "Sort by : ";
                div.appendChild(span);
                const selectSort1 = document.createElement("select");
                selectSort1.className = "form-control form-control-lg";
                selectSort1.style.width = "auto";
                selectSort1.style.display = "inline-block";
                selectSort1.style.marginLeft = "10px";
                div.appendChild(selectSort1);
                ["ID", "PPM", "XPPM"].forEach((v) => {
                  selectSort1.innerHTML += `<option value="${v.toLowerCase()}">${v}</option>`;
                });
                const selectSort2 = document.createElement("select");
                selectSort2.className = "form-control form-control-lg";
                selectSort2.style.width = "auto";
                selectSort2.style.display = "inline-block";
                selectSort2.style.marginLeft = "10px";
                div.appendChild(selectSort2);
                ["Ascending", "Descending"].forEach((v) => {
                  selectSort2.innerHTML += `<option value="${v.toLowerCase()}">${v}</option>`;
                });
                selectSort1.addEventListener("change", () => updateList());
                selectSort2.addEventListener("change", () => updateList());

                const span2 = document.createElement("span");
                span2.textContent = "Filter by : ";
                span2.style.marginLeft = "20px";
                div.appendChild(span2);
                const selectFilter = document.createElement("div");
                selectFilter.className = "form-control form-control-lg";
                selectFilter.style.width = "auto";
                selectFilter.style.display = "inline-block";
                selectFilter.style.marginLeft = "10px";
                div.appendChild(selectFilter);

                [
                  { text: "Airlink", value: "AL" },
                  { text: "Connect", value: "CN" },
                  { text: "Express", value: "EX" },
                  { text: "Waterline", value: "WL" },
                  { text: "Metro", value: "MT" },
                ].forEach((f, i) => {
                  const label = document.createElement("label");
                  label.style.marginLeft = i != 0 ? "20px" : "0px";

                  const cb = document.createElement("input");
                  cb.type = "checkbox";
                  cb.checked = true;
                  cb.name = "fruits";
                  cb.value = f.value;

                  cb.addEventListener("input", () => updateList());

                  label.appendChild(cb);
                  label.append(" " + f.text);

                  selectFilter.appendChild(label);
                });

                const span3 = document.createElement("span");
                span3.textContent = "Averages : ";
                span3.style.marginLeft = "20px";
                div.appendChild(span3);

                document
                  .getElementById("SearchTerm")
                  .addEventListener("input", (event) => {
                    event.stopPropagation();
                    updateList();
                  });

                const normalize = (s) =>
                  (s ?? "")
                    .toString()
                    .toLowerCase()
                    .normalize("NFD")
                    .replace(/\p{Diacritic}/gu, "");

                const updateList = () => {
                  const term = normalize(
                    document.getElementById("SearchTerm").value.trim()
                  );
                  let filters = {
                    AL: true,
                    CN: true,
                    EX: true,
                    WL: true,
                    MT: true,
                  };
                  selectFilter
                    .querySelectorAll("input")
                    .forEach((f) => (filters[f.value] = f.checked));
                  document.querySelector(
                    ".row.row-cols-md-3.row-cols-2.g-4.mb-4"
                  ).innerHTML = "";
                  let n = 0;
                  let ppm = 0;
                  let xppm = 0;
                  [...routes]
                    .filter((r) => {
                      if (!filters[r.operator]) return false;
                      if (!term) return true;
                      const hay = normalize(`${r.id ?? ""} ${r.name ?? ""}`);
                      return hay.includes(term);
                    })
                    .sort((a, b) => {
                      let A;
                      let B;
                      if (selectSort1.value === "id") {
                        A = parseInt(a.id.replace("R", ""));
                        B = parseInt(b.id.replace("R", ""));
                      } else {
                        A = a[selectSort1.value];
                        B = b[selectSort1.value];
                      }
                      if (!A && !B) return 0;
                      if (!A) return 1;
                      if (!B) return -1;
                      return selectSort2.value === "ascending" ? A - B : B - A;
                    })
                    .forEach((route) => {
                      document
                        .querySelector(".row.row-cols-md-3.row-cols-2.g-4.mb-4")
                        .appendChild(route.card);
                      if (route.ppm && route.xppm) {
                        n++;
                        ppm += route.ppm;
                        xppm += route.xppm;
                      }
                    });
                  const averagePPM =
                    n != 0 ? Math.round((ppm / n) * 100) / 100 : 0;
                  const averageXPPM =
                    n != 0 ? Math.round((xppm / n) * 100) / 100 : 0;
                  span3.textContent = `Averages : PPM=${averagePPM} XPPM=${averageXPPM}`;
                };

                updateList();
              }
            });
          })
        );
      }
    } else if (location.pathname.split("/")[1] === "TrainTypes") {
      if (currentPage != "TrainTypes") {
        currentPage = "TrainTypes";
        const loop = setInterval(() => {
          if (
            document.querySelectorAll(
              ".row.row-cols-md-3.row-cols-2.g-4.mb-4 > .col"
            ).length > 0 &&
            document.querySelector(".py-4").textContent.trim() === "Train Types"
          ) {
            clearInterval(loop);
            const trainsToImgs = {
              "Airlink Shuttle (Class 345)": {
                Exterior:
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/d/dd/345Ext.png",
                Interior:
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/8/81/AL345IntStandard.png",
                "Interior (Side Seats)":
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/4/4e/AL345IntLongitudinal.png",
                Cab: "https://static.wikia.nocookie.net/scr-unofficial-main/images/c/c2/345meshcab.png",
                drawings: [
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/b/be/AL_345_Drawing.png",
                ],
                gallery: [
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/4/49/345.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/6/68/Class345.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/8/89/Testtrain.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/7/71/Class_345_clear_image.jpeg",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/5/5c/Class_345.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/5/56/14-08-22_Sneak_Peek.png",
                ],
              },
              "Class 143": {
                Exterior:
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/7/72/143meshout.png",
                Interior:
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/e/e7/143inside.png",
                Cab: "https://static.wikia.nocookie.net/scr-unofficial-main/images/7/7a/143meshcab.png",
                drawings: [
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/a/ac/WL143Diagram.png",
                ],
                gallery: [
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/c/cb/PacerSneakPeek.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/a/ab/Class_143_R011.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/8/83/Class143_terminate_greenslade.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/a/a5/Class_143_Express_for_2024_April_Fools.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/8/87/Class143SEExt.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/e/e6/Class143SEInt.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/8/87/StepfordCentralOverload.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/e/ea/EX143twBenton.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/b/b8/Class_143%40SUFC_during_2023_April_Fools.png",
                ],
              },
              "Class 156": {
                Exterior:
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/7/75/156ext.png",
                Interior:
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/a/ac/156int.png",
                Cab: "https://static.wikia.nocookie.net/scr-unofficial-main/images/d/d5/156cab.png",
                drawings: [
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/a/a8/156-4_Diagram.png",
                ],
                gallery: [
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/5/5e/16_03_24_Sneak_Peek.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/c/c5/18_04_24_Sneak_Peek.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/b/b0/SP7524.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/f/f3/Class_156_at_Carnalea_Bridge_%28Trailer%29.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/9/9c/Class_800_with_Class_156_on_Rayleigh_Bay.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/6/6e/Aslockby_station.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/2/20/TfS_156_L.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/7/7b/TfS_156_P.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/c/cb/CN_HeyAslockby_L.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/d/db/CN_Refurb156_L.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/0/0f/156-9.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/f/f7/Image_2025-01-19_001520787.png",
                ],
              },
              "Class 158": {
                Exterior:
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/e/ed/158v3-ext.png",
                Interior:
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/6/60/158v3-int.png",
                Cab: "https://static.wikia.nocookie.net/scr-unofficial-main/images/b/b6/158v3-cab.png",
                drawings: [
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/1/19/158-0-SC.png",
                ],
                gallery: [
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/3/31/Class_158_%40_Rocket_Parade.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/0/05/Class_158_Screenshot.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/7/70/Class_158_and_Class_331_trains_at_SAC.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/b/be/Class_158_Passing_New_Harrow.PNG",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/b/be/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88_2019-06-16_11.31.22.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/5/5d/158.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/1/19/158_158911.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/7/77/Screenshot_16.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/f/f2/158009_at_Woodhead_Lane.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/7/78/Connectfleet.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/7/73/20_Nov_23_Sneak_Peek.png",
                ],
              },
              "Class 165": {
                Exterior:
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/1/1e/165v3-ext.png",
                "Interior 1":
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/3/38/WLNetTurbo-int.png",
                "Interior 2":
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/b/b5/WLNetTurbo-int-PseudoFirst.png",
                Cab: "https://static.wikia.nocookie.net/scr-unofficial-main/images/5/59/WLNetTurbo-cab.png",
                gallery: [
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/9/9d/165.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/a/ae/Unknown-1587556893.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/2/20/Class_165_%40_Eden_Quay.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/d/d3/165165.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/2/24/5_Nov_23_Sneak_Peek.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/9/9a/Faradayold165.jpg",
                ],
              },
              "Class 166": {
                Exterior:
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/0/07/166v3-ext.png",
                "Interior 1":
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/3/38/WLNetTurbo-int.png",
                "Interior 2":
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/b/b5/WLNetTurbo-int-PseudoFirst.png",
                Cab: "https://static.wikia.nocookie.net/scr-unofficial-main/images/5/59/WLNetTurbo-cab.png",
                gallery: [
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/2/25/NG_Class_166.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/4/4f/166.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/d/d7/Class_166_%40_Ashlan_Park.png",
                ],
              },
              "Class 168": {
                Exterior:
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/6/62/168-ext.png",
                Interior:
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/4/47/168-int.png",
                Cab: "https://static.wikia.nocookie.net/scr-unofficial-main/images/3/31/168-cab.png",
                drawings: [
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/9/97/SC_168_Drawing.png",
                ],
                gallery: [
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/a/a9/Turbostar_Sneak.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/d/dc/Class_168_R034.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/4/4c/168Terminal2_%28NGv3%29.png",
                ],
              },
              "Class 170": {
                "Exterior (170/2)":
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/c/cf/1702-ext.png",
                "Exterior (170/4)":
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/c/c2/1704-ext.png",
                Interior:
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/7/70/170v4-int.png",
                Cab: "https://static.wikia.nocookie.net/scr-unofficial-main/images/2/2c/170v4-cab2.png",
                drawings: [
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/5/54/170-2-SC.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/0/0e/170-SC.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/d/d2/170-5-SC.png",
                ],
                gallery: [],
              },
              "Class 171": {
                Exterior:
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/9/9a/171out3.png",
                Interior:
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/4/4b/171in3.png",
                Cab: "https://static.wikia.nocookie.net/scr-unofficial-main/images/2/2c/170v4-cab2.png",
                drawings: [
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/4/44/171Refurbished.png",
                ],
                gallery: [
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/1/12/171-0.PNG",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/5/5d/Class_171.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/2/2f/171793.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/0/0e/Class_171_%40_West_Benton.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/b/bb/171.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/4/4a/2_Class_171s.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/3/3e/Waterline_Class_171_171XXX.jpg",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/6/65/Class_171_New_Livery.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/a/a9/Turbostar_Sneak.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/1/19/Class_171_R015.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/9/91/171Terminal2_%28NGv3%29.png",
                ],
              },
              "Class 180": {
                Exterior:
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/3/3e/SCR_Class_180_5_Car.png",
                "100M Livery Exterior":
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/a/ae/SCR_Class_180_5_Car_100_Mil..png",
                "Interior (First Class)":
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/3/35/SCR_Class_180_First_Class_Interior.png",
                "Interior (Standard Class)":
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/5/56/SCR_Class_180_Standard_Class_Interior.png",
                Cab: "https://static.wikia.nocookie.net/scr-unofficial-main/images/0/00/SCR_Class_180_Cab.png",
                drawings: [
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/6/6b/Class_180_Stepford_Express_Diagram.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/b/b3/Class_180_Stepford_Express_100M_Diagram.png",
                ],
                gallery: [
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/4/4b/180CoxlyNewtown_%28NGv3%29.png",
                ],
              },
              "Class 185": {
                Exterior:
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/3/37/Class_185_AL_v2.2.4_Ext.png",
                Interior:
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/2/2f/Class_185_CN_v2.2.4_Int.png",
                Cab: "https://static.wikia.nocookie.net/scr-unofficial-main/images/7/7c/Class_185_v2.2.4_Cab.png",
                "Interior (First Class)":
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/2/22/Class_185_AL_FC_v2.2.4_Int.png",
                "Interior (Standard Class)":
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/b/b2/Class_185_AL_SC_v2.2.4_Int.png",
                drawings: [
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/c/cb/185-SC.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/f/f4/AL185Drawing.png",
                ],
                gallery: [
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/9/9c/2_Class_185s.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/a/ac/NG_Airlink_Class_185.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/8/8b/Legacy_Class_185_AirLink.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/8/86/Legacy_Class_185_Connect.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/d/d9/New_Generated_Class_185.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/8/86/Class_185_%40_Airport_Terminal_2.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/3/38/0a.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/9/98/2_AirLink_185s.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/d/d3/Class_185_%40_Stepford_East.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/d/d3/Double_185.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/a/aa/Class185_rocket_parade.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/b/b6/185.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/4/47/RobloxScreenShot20210202_025922723_%282%29.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/b/b9/Class_185.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/e/e8/Class_185_and_345_at_AT2.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/0/0e/185AirportCentral_%28remesh%29.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/6/67/185StepfordEast_%28remesh%29.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/1/1b/185leaveT2.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/b/bd/SneakPeek191025.png",
                ],
              },
              "Class 195/2": {
                Exterior:
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/9/96/195CNmesh.png",
                Interior:
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/1/1f/195CNmeshin.png",
                Cab: "https://static.wikia.nocookie.net/scr-unofficial-main/images/b/b5/CivityMeshCab.png",
                drawings: [
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/f/f0/195-SC.png",
                ],
                gallery: [
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/7/7b/Class195-2LocalLEFT.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/8/8f/Class195-2LocalRIGHT.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/b/b7/195-0-Unrefurbished.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/8/8c/195-0-Refurbished.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/1/1b/195-1-Unrefurbished.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/6/63/195-1-Refurbished.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/0/03/SCR_Class_195_195135_FRD.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/4/40/Class_331_%26_Class_195.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/8/80/Class_19570_at_Greenslade.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/b/b2/SCR_Class_195_195036_Port_Benton.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/c/c1/Class_195_195031_R015.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/e/ec/NGv1_195.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/f/fa/Sneak_peek_2022-08-07.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/4/44/CivitySneakPeek.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/3/33/R040.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/4/4b/C195_at_Morganstown_Siding.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/5/59/Class195atEdenQuay.jpg",
                ],
              },
              "Class 195": {
                Exterior:
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/7/7f/195WLmesh.png",
                Interior:
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/9/94/195WLmeshin.png",
                Cab: "https://static.wikia.nocookie.net/scr-unofficial-main/images/b/b5/CivityMeshCab.png",
                drawings: [
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/8/8c/195-0-Refurbished.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/6/63/195-1-Refurbished.png",
                ],
                gallery: [
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/7/7b/Class195-2LocalLEFT.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/8/8f/Class195-2LocalRIGHT.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/b/b7/195-0-Unrefurbished.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/8/8c/195-0-Refurbished.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/1/1b/195-1-Unrefurbished.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/6/63/195-1-Refurbished.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/0/03/SCR_Class_195_195135_FRD.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/4/40/Class_331_%26_Class_195.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/8/80/Class_19570_at_Greenslade.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/b/b2/SCR_Class_195_195036_Port_Benton.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/c/c1/Class_195_195031_R015.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/e/ec/NGv1_195.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/f/fa/Sneak_peek_2022-08-07.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/4/44/CivitySneakPeek.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/3/33/R040.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/4/4b/C195_at_Morganstown_Siding.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/5/59/Class195atEdenQuay.jpg",
                ],
              },
              "Class 220": {
                Exterior:
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/8/8a/220ext.png",
                "Interior (First Class)":
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/a/a7/VoyagerIntFirst.png",
                "Interior (Standard Class)":
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/b/be/VoyagerIntStandard.png",
                Cab: "https://static.wikia.nocookie.net/scr-unofficial-main/images/f/f4/VoyagerCabRemesh.png",
                drawings: [
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/4/46/SCR_Ex_220_Game_Livery_Drawing.png",
                ],
                gallery: [
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/1/1d/SneakPeekTrainCouldBeExpress.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/a/ad/Unknown-3.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/2/28/Class_220_at_Northshore.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/2/20/220028.JPG",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/5/5b/220meshout.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/9/91/Class220Out.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/2/2c/VoyagerMesh.png",
                ],
              },
              "Class 221": {
                Exterior:
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/f/f7/221ext.png",
                "Interior (First Class)":
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/a/a7/VoyagerIntFirst.png",
                "Interior (Standard Class)":
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/b/be/VoyagerIntStandard.png",
                Cab: "https://static.wikia.nocookie.net/scr-unofficial-main/images/f/f4/VoyagerCabRemesh.png",
                drawings: [
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/6/60/SCR_Ex_221_Game_Ver.png",
                ],
                gallery: [
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/1/1d/SneakPeekTrainCouldBeExpress.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/a/ad/Unknown-3.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/2/21/221.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/a/af/Class_221.PNG",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/2/2c/VoyagerMesh.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/4/41/Class221_Mesh.png",
                ],
              },
              "Class 313": {
                Exterior:
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/f/fc/313_Exterior.png",
                Interior:
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/9/93/313_Interior.png",
                Cab: "https://static.wikia.nocookie.net/scr-unofficial-main/images/d/d1/313_Cab.png",
                gallery: [],
              },
              "Class 319": {
                Exterior:
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/7/7c/319ext.png",
                Interior:
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/8/84/319int.png",
                Cab: "https://static.wikia.nocookie.net/scr-unofficial-main/images/a/aa/319cab3.png",
                drawings: [
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/b/b2/SCR_319_Refurbished.png",
                ],
                gallery: [
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/2/29/NG_Class_319.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/4/46/Unknown-1-1.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/d/d1/319033.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/7/7b/Class_319_%40_Newry_Harbour.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/7/70/319.PNG",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/f/f7/04FebSneak2024Peek.jpg",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/3/39/T2Approach319.png",
                ],
              },
              "Class 321": {
                Exterior:
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/e/e2/321ext2.png",
                Interior:
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/5/5d/321int2.png",
                Cab: "https://static.wikia.nocookie.net/scr-unofficial-main/images/4/47/321cab3.png",
                gallery: [
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/1/1c/Sneak_Peek_06_03_24.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/4/46/Unknown-1-1.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/a/a7/321381.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/8/84/65425950-1C04-4776-85A6-C79B13B89B75.jpeg",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/9/9a/321364_at_Whitefield.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/d/dd/C321LeavingWN.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/4/4f/C321Fake1stClass.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/5/52/Class_321_%40_Whitefield.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/7/7a/321_%281%29.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/b/b2/Unknown-0.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/8/8c/Old_Class_321.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/b/b5/321_scr_i.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/9/9d/321_scr_ii.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/b/bc/Class_321-0.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/2/2e/321_SUNRISE1.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/d/df/321_NORMAL.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/b/ba/321oldlivery.png",
                ],
              },
              "Class 331/0": {
                Exterior:
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/8/85/3310mesh.png",
                Interior:
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/9/9d/331in.png",
                Cab: "https://static.wikia.nocookie.net/scr-unofficial-main/images/b/b5/CivityMeshCab.png",
                drawings: [
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/e/ed/331-0-SC.png",
                ],
                gallery: [
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/3/30/Next_Generation_Class_465_%26_Class_331_%26_New_Whitefield.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/2/2b/331001.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/4/40/Class_331_%26_Class_195.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/2/23/Class_331_%40_Stepford_East.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/0/04/331108.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/8/82/Class_331_%40_Whitefield.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/b/b6/331.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/a/a6/68039_331003.jpg",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/7/70/Class_158_and_Class_331_trains_at_SAC.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/f/f7/Class_331_331124_R038_LSR.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/3/3e/Class_331_%40_St_Helens_Bridge.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/4/44/CivitySneakPeek.png",
                ],
              },
              "Class 331/1": {
                Exterior:
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/0/02/3311mesh.png",
                Interior:
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/9/9d/331in.png",
                Cab: "https://static.wikia.nocookie.net/scr-unofficial-main/images/b/b5/CivityMeshCab.png",
                drawings: [
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/e/ed/331-0-SC.png",
                ],
                gallery: [
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/3/30/Next_Generation_Class_465_%26_Class_331_%26_New_Whitefield.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/2/2b/331001.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/4/40/Class_331_%26_Class_195.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/2/23/Class_331_%40_Stepford_East.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/0/04/331108.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/8/82/Class_331_%40_Whitefield.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/b/b6/331.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/a/a6/68039_331003.jpg",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/7/70/Class_158_and_Class_331_trains_at_SAC.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/f/f7/Class_331_331124_R038_LSR.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/3/3e/Class_331_%40_St_Helens_Bridge.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/4/44/CivitySneakPeek.png",
                ],
              },
              "Class 332": {
                Exterior:
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/2/27/332out3.png",
                "Interior (First Class)":
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/2/2f/332in1st4.png",
                "Interior (Standard Class)":
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/6/6c/332in2nd3.png",
                Cab: "https://static.wikia.nocookie.net/scr-unofficial-main/images/0/03/332cab3.png",
                drawings: [
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/6/64/AL3320Diagram.png",
                ],
                gallery: [
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/9/9c/NG_Class_333_and_Class_332.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/7/7c/RobloxScreenShot20200314_095431144.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/e/e4/Class_332_%40_Airport_Terminal_2.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/3/32/332-1.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/a/ae/Screenshot_%2897%29.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/a/a5/332.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/4/47/332-0.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/4/4c/RobloxScreenShot20190816_134945883_%282%29.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/7/7c/AirLink_Class_332.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/3/3e/Class_332_R056.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/0/03/332055-1.JPG",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/5/5b/Fishbowl_SneakPeek.jpg",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/e/e8/332Terminal2_%28NGv3%29.png",
                ],
              },
              "Class 333": {
                Exterior:
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/6/6f/333-ext.png",
                Interior:
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/4/4e/333-int.png",
                Cab: "https://static.wikia.nocookie.net/scr-unofficial-main/images/1/13/333-cab.png",
                drawings: [
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/8/83/CN333Diagram.png",
                ],
                gallery: [
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/9/9c/NG_Class_333_and_Class_332.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/6/6c/333076.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/d/d7/Class_333_%40_Elsemere_Pond.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/2/26/333_Connect.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/a/a8/Class_333_R031_Stepford_High_St.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/5/5b/Fishbowl_SneakPeek.jpg",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/0/09/Class_333_333046_R027.png",
                ],
              },
              "Class 350": {
                Exterior:
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/0/0d/Class_350_v2.2.2_Ext.png",
                "Interior (/1)":
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/7/77/Class_350-1_v2.2.2_Int.png",
                "Interior (/2)":
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/b/b1/Class_350-2_v2.2.2_Int.png",
                Cab: "https://static.wikia.nocookie.net/scr-unofficial-main/images/5/52/Class_350_v2.2.2_Cab.png",
                drawings: [
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/e/e9/350-SC.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/f/f0/350-2-SC.png",
                ],
                gallery: [
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/0/0a/Class_350_%40_Stepford_Airport_Central.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/4/46/Next_Generated_Class_350%2C_357%2C_and_360.jpeg",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/0/0d/RobloxScreenShot20191217_203548810-0.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/b/bf/Legacy_Class_350.jpeg",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/a/a4/Legacy_Class_350.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/3/3d/Legacy_Rainbow_Class_350.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/3/37/350.PNG",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/d/d8/DUO_350.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/e/e8/Class_350_350_%40_SV.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/b/bd/Screenshot_2021-01-30_at_5.18.46_PM.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/e/e6/350T2Coxly.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/e/e9/SneakPeek-250810.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/5/5c/350Edgemead_%28remesh%29.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/6/6c/350Westwyvern_%28remesh%29.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/b/bc/SneakPeek131025.png",
                ],
              },
              "Class 357": {
                Exterior:
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/2/21/357ext2.png",
                Interior:
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/c/c8/357int2.png",
                Cab: "https://static.wikia.nocookie.net/scr-unofficial-main/images/4/4a/357cab4.png",
                drawings: [
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/7/74/357-SC.png",
                ],
                gallery: [
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/3/33/357066.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/3/36/Class_357_Approaching_Stepford_Central.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/d/d9/Class_357_%40_Port_Benton.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/7/70/357080.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/6/68/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88_2019-06-26_9.41.21.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/4/46/Next_Generated_Class_350%2C_357%2C_and_360.jpeg",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/e/ec/Legacy_Class_357.jpeg",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/a/a3/Class_357.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/f/f2/Class_357_%40_City_Hospital.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/5/5b/Class_357_R024.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/f/fc/NGv3_Class-357.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/e/ef/357insunset.jpeg",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/1/1d/Sneak_Peek_11062024.png",
                ],
              },
              "Class 360/1": {
                Exterior:
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/a/a6/360Av4-ext.png",
                Cab: "https://static.wikia.nocookie.net/scr-unofficial-main/images/f/f8/360Av4-cab.png",
                "Interior (First Class)":
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/b/bf/360Av4-intFirst.png",
                "Interior (Standard Class)":
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/d/dd/360Av4-intSt.png",
                drawings: [
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/5/5b/3602Refurbished.png",
                ],
                gallery: [
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/4/46/Next_Generated_Class_350%2C_357%2C_and_360.jpeg",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/2/2b/Next-Gen_Class_360.PNG",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/c/cc/Legacy_Class_360.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/d/d9/Roblox_2_12_2019_1_52_36_AM.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/f/f9/NG_Class_360.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/3/3b/360285.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/5/5a/360_new_livery.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/3/3d/Class_802_And_Class_360_at_SC.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/e/e1/SneakPeek3July2022.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/f/ff/MeshedClass360InSneakPeek.jpeg",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/0/0d/CN_360_Special.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/9/98/360-5-SC.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/0/0c/SneakPeek-250824.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/1/13/360LeightonStepfordRoad_%28remesh%29.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/a/a6/360SaintHelensBridge_%28remesh%29.png",
                ],
              },
              "Class 360/2": {
                Exterior:
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/a/a6/360Av4-ext.png",
                Cab: "https://static.wikia.nocookie.net/scr-unofficial-main/images/f/f8/360Av4-cab.png",
                "Interior (First Class)":
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/b/bf/360Av4-intFirst.png",
                "Interior (Standard Class)":
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/d/dd/360Av4-intSt.png",
                drawings: [
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/5/5b/3602Refurbished.png",
                ],
                gallery: [
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/4/46/Next_Generated_Class_350%2C_357%2C_and_360.jpeg",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/2/2b/Next-Gen_Class_360.PNG",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/c/cc/Legacy_Class_360.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/d/d9/Roblox_2_12_2019_1_52_36_AM.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/f/f9/NG_Class_360.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/3/3b/360285.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/5/5a/360_new_livery.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/3/3d/Class_802_And_Class_360_at_SC.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/e/e1/SneakPeek3July2022.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/f/ff/MeshedClass360InSneakPeek.jpeg",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/0/0d/CN_360_Special.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/9/98/360-5-SC.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/0/0c/SneakPeek-250824.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/1/13/360LeightonStepfordRoad_%28remesh%29.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/a/a6/360SaintHelensBridge_%28remesh%29.png",
                ],
              },
              "Class 360": {
                Exterior:
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/d/d4/360Cv2-ext.png",
                Interior:
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/4/47/360Cv2-int.png",
                Cab: "https://static.wikia.nocookie.net/scr-unofficial-main/images/1/1f/360Cv2-cab.png",
                drawings: [
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/a/a2/360-0-SC.png",
                ],
                gallery: [
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/4/46/Next_Generated_Class_350%2C_357%2C_and_360.jpeg",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/2/2b/Next-Gen_Class_360.PNG",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/c/cc/Legacy_Class_360.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/d/d9/Roblox_2_12_2019_1_52_36_AM.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/f/f9/NG_Class_360.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/3/3b/360285.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/5/5a/360_new_livery.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/3/3d/Class_802_And_Class_360_at_SC.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/e/e1/SneakPeek3July2022.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/f/ff/MeshedClass360InSneakPeek.jpeg",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/0/0d/CN_360_Special.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/9/98/360-5-SC.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/0/0c/SneakPeek-250824.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/1/13/360LeightonStepfordRoad_%28remesh%29.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/a/a6/360SaintHelensBridge_%28remesh%29.png",
                ],
              },
              "Class 365": {
                Exterior:
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/d/db/365_exterior.png",
                Interior:
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/0/0e/Class_365_interior.png",
                Cab: "https://static.wikia.nocookie.net/scr-unofficial-main/images/9/95/Class_365_cab.png",
                drawings: [
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/5/5c/CN365Diagram.png",
                ],
                gallery: [
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/f/f7/AirportCentral365.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/0/0a/WaterNewton365.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/c/ce/Class365_121123.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/f/fb/15_Nov_23_Sneak_Peek.png",
                ],
              },
              "Class 377": {
                Exterior:
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/1/10/377meshout4.png",
                Interior:
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/0/04/377meshin4.png",
                Cab: "https://static.wikia.nocookie.net/scr-unofficial-main/images/0/01/Electrostarmeshcab.png",
                drawings: [
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/c/c3/377-SC.png",
                ],
                gallery: [
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/c/cd/New_Generated_Class_377.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/c/cf/Sneak_Peek_070619.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/6/6d/Class_377_%40_Bodin.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/e/ed/377_219.PNG",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/1/15/Xzlc91577037722.jpg",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/e/e0/377280.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/e/e0/Legacy_Class_377.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/a/a7/Legacy_Class_377.jpeg",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/9/9e/Upgraded_377_387.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/2/2f/Class_377_%40_Benton.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/f/fd/Screenshot_2020-10-29_105124.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/c/c8/Class_377_testing.jpg",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/e/ee/IMG_20201103_192902.jpg",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/5/5c/IMG_20201103_193036.jpg",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/b/bf/377709-1.JPG",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/b/b5/Benton.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/2/2e/Class_377-7.jpg",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/e/e9/Class377_at_WoodheadLaneSB.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/b/b2/Class_377_at_SHB.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/7/78/Class377atStepfordVictoria.png",
                ],
              },
              "Class 379": {
                Exterior:
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/c/cd/379meshout4.png",
                Interior:
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/4/44/379meshin4.png",
                Cab: "https://static.wikia.nocookie.net/scr-unofficial-main/images/0/01/Electrostarmeshcab.png",
                drawings: [
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/2/2b/379Refurbished.png",
                ],
                gallery: [
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/b/b4/New_Class_379_%28Waterline%29.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/7/76/Class_379_%40_Faraday_Road.PNG",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/9/90/379057.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/1/1e/Class_379.jpeg",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/c/cf/Sneak_Peek_070619.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/3/32/Waterline_379.PNG",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/0/02/379faraday.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/1/19/Class_379_R013_Port_Benton.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/e/e2/Ela4TCyXEAYbauV.jpg",
                ],
              },
              "Class 380": {
                Exterior:
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/a/ac/380meshout.png",
                Interior:
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/8/8b/380meshin.png",
                Cab: "https://static.wikia.nocookie.net/scr-unofficial-main/images/d/dc/380meshcab.png",
                drawings: [
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/b/b7/380-1-SC.png",
                ],
                gallery: [
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/4/44/NG_380_sneek_peak.jpg",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/1/1c/Unknown-1588636560.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/0/0f/NG_Class_380.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/9/93/First_Guard.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/3/3d/StepfordClass380.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/e/eb/380.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/e/e8/Class380.jpg",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/7/7a/Roblox_12_19_2018_10_46_36_PM.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/1/11/Roblox_13_09_2020_00_34_00.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/1/1f/Roblox_13_09_2020_00_37_57.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/f/f2/Roblox_13_09_2020_00_41_13.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/f/f9/Roblox_13_09_2020_00_40_58.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/1/17/380Mesh.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/5/51/Class380MeshOut.png",
                ],
              },
              "Class 385": {
                Exterior:
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/4/40/385-ext.png",
                Interior:
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/f/fb/385-int.png",
                Cab: "https://static.wikia.nocookie.net/scr-unofficial-main/images/a/a6/385-cab.png",
                drawings: [
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/9/9e/385-0-SC.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/b/b1/385-1-SC.png",
                ],
                gallery: [
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/5/59/SneakPeek-240411.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/6/62/SneakPeek-2024-04-22.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/1/14/SCR_Connect_385031_R021.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/4/48/CN_385_L.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/8/84/Class_385_R005_at_Benton.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/e/ea/SneakPeek261025.png",
                ],
              },
              "Class 387": {
                Exterior:
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/0/0e/387meshout4.png",
                "Interior (First Class)":
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/c/cf/387mesh1st4.png",
                "Interior (Standard Class)":
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/b/b2/387mesh2nd4.png",
                Cab: "https://static.wikia.nocookie.net/scr-unofficial-main/images/0/01/Electrostarmeshcab.png",
                drawings: [
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/f/f5/Class_387_Airlink.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/b/be/Class_387_Double_Airlink.png",
                ],
                gallery: [
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/e/e7/387222.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/7/7b/Class_387_%40_Leighton_Stepford_Road.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/3/38/Class_387_%40_Airport_Terminal_3.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/9/9a/Class_387_%28AirLink%29.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/7/78/387_fanmade_diagram.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/b/b8/078B1C43-9DD5-4505-92D4-0348978AEB54.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/c/cf/Sneak_Peek_070619.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/9/98/387_at_Airport_Parkway.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/b/b6/Electrostars.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/6/66/Class_387.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/b/b4/387_WaterLine.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/2/29/Class_387_Connect_Train_%28December_4%2C_2017%29.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/7/73/Screenshot_20191010-183539.jpg",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/9/9e/Upgraded_377_387.png",
                ],
              },
              "Class 390": {
                Exterior:
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/d/d1/390.png",
                "Interior (First Class)":
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/2/21/390FCInt.png",
                "Interior (Standard Class)":
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/c/c6/390SCInt.png",
                Cab: "https://static.wikia.nocookie.net/scr-unofficial-main/images/2/27/390Cab.png",
                drawings: [
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/b/b6/Class_390_Stepford_Express_Diagram.png",
                ],
                gallery: [
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/f/f2/16_12_24_Sneak_Peek.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/a/a6/Class_390-1_Faymere_Green_TMD_SB.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/e/e3/Class390llyn.jpg",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/c/cf/Class390WVY.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/4/44/Class390-Northshore.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/4/49/390_Platform_Extender.jpg",
                ],
              },
              "Class 397": {
                Exterior:
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/0/0f/Class397ALExt.png",
                "Interior (First Class)":
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/1/1f/Class397ALFirstClassInt.png",
                "Interior (Standard Class)":
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/4/42/Class397ALStandardClassInt.png",
                "Interior (Side Seats)":
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/5/58/Class397ALAccessibilitySeatingInt.png",
                Cab: "https://static.wikia.nocookie.net/scr-unofficial-main/images/0/08/Class397ALCab.png",
                drawings: [
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/3/3a/EX397Drawing.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/3/3a/AL397Diagram.png",
                ],
                gallery: [],
              },
              "Class 398": {
                Exterior:
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/b/b1/SCR2.3class398ext.png",
                Interior:
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/9/90/398interiorlol.png",
                Cab: "https://static.wikia.nocookie.net/scr-unofficial-main/images/8/8e/Version2.3398cab.png",
                drawings: [
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/1/1a/Class_398_Metro_Diagram.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/e/ed/Class_398_D_Metro_Diagram.png",
                ],
                gallery: [
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/a/ab/Class_398_teaser_screenshot.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/9/95/SneakPeek231125.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/e/e0/SneakPeek261125.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/c/cf/SneakPeek301125.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/f/f0/SneakPeek101225.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/6/67/398atCNwith3rdtoBarton.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/4/42/398_trailer.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/b/b1/SCR2.3class398ext.png",
                ],
              },
              "Class 555": {
                Exterior:
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/c/c2/Metro_Class_555_Exterior.png",
                Interior:
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/2/2e/Metro_Class_555_Interior.png",
                Cab: "https://static.wikia.nocookie.net/scr-unofficial-main/images/0/01/Metro_Class_555_Cab.png",
                drawings: [
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/3/31/Class_555_Metro_Diagram.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/f/f2/Class_555_D_Metro_Diagram.png",
                ],
                gallery: [
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/c/c3/Class_555_R023.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/d/d7/Class_555_arriving_at_Stepford_Central.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/d/dc/Class_555_passing_near_Whitefield_Lido.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/f/f5/555StepfordCentral_%28NGv3%29.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/b/b5/555WhitefieldLido_%28NGv3%29.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/1/17/Class555atBerrily.png",
                ],
              },
              "Class 68": {
                Exterior:
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/a/ae/Class_68_v3_Exterior.png",
                Interior:
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/7/75/Class_68_v3_Interior.png",
                Cab: "https://static.wikia.nocookie.net/scr-unofficial-main/images/f/f8/Class_68_v3_Cab.png",
                drawings: [
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/3/3e/CN68Drawing.png",
                ],
                gallery: [
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/3/3a/68_Door_Unlocked.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/d/d1/68_Door_Locked.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/7/70/5CDC725D-89CD-4C31-A9B8-0A83F56E27B2.jpeg",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/5/55/68.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/1/1f/Screen_Shot_2019-08-08_at_8.21.46_pm.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/0/0a/Screen_Shot_2019-08-08_at_8.27.06_pm.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/1/14/Class_68.PNG",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/e/e5/Class_68_Viaduct.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/5/53/Class_68_%40_Stepford_City.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/f/f2/NG_Class_68.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/1/1f/68edge.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/b/b8/Benton68.PNG",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/3/3a/Class_68_passing_Stepford_Cathederal.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/e/e3/Coxly.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/a/a6/68039_331003.jpg",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/1/15/Roblox_3_13_2019_10_50_49_PM.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/e/e5/Roblox_3_15_2019_6_41_51_AM.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/d/d2/Roblox_3_15_2019_6_37_43_AM.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/4/4d/Legacy_Class_68.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/8/83/Class_68_R036_Westercoast.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/1/19/68_at_Benton.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/a/ac/RobloxScreenShot20210123_123428270_%282%29.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/8/8a/Halloween_23_Sneak_Peek_1.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/0/09/Halloween_23_Sneak_Peek_2.png",
                ],
              },
              "Class 700": {
                Exterior:
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/f/fd/Class_700_v2.3.0_Ext.png",
                Interior:
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/6/63/Class_700_v2.3.0_Int.png",
                Cab: "https://static.wikia.nocookie.net/scr-unofficial-main/images/0/02/Class_700_v2.3.0_Cab.png",
                drawings: [
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/d/de/700-0-SC.png",
                ],
                gallery: [
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/b/bc/700.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/c/c7/700-Christmas.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/d/dd/700-TheOneThousand.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/8/82/700_Million_Special.jpg",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/4/45/7000_winter.jpeg",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/4/43/700_Christmas_Special.jpg",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/a/ac/Class_700.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/4/42/Class_700_%28Christmas%29.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/7/77/Class_700_%281k_group_members%29.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/8/85/X-mas_Class_700.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/0/0c/Screen_Shot_2019-05-27_at_10.34.09_am.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/3/33/700148.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/c/c8/700_2.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/2/2e/Legacy_185%2C_700%2C_350.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/0/0f/SneakPeek141225.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/c/c8/SneakPeek171225.png",
                ],
              },
              "Class 707": {
                Exterior:
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/6/65/707v4-ext.png",
                Interior:
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/a/af/707v4-int.png",
                Cab: "https://static.wikia.nocookie.net/scr-unofficial-main/images/4/4b/707v4-cab.png",
                drawings: [
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/f/f6/707-SC.png",
                ],
                gallery: [
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/f/f6/707_%28V1_4_3%29.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/9/9c/707058_at_Benton.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/e/ed/707_D.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/c/c9/707_N.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/6/6f/RobloxPlayerBeta_fTTFI3IDsW.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/a/a0/707_083.PNG",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/8/88/Class_707_%40_Edgemead.PNG",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/d/d7/Class_707s_at_Stepford_Central.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/6/67/RobloxPlayerBeta_ZD0jxqNgQ3.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/e/ec/RobloxPlayerBeta_CJhydY4TMw.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/4/44/Roblox_2_12_2019_10_39_46_AM.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/e/e3/Roblox_2_15_2019_11_59_57_PM.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/2/2e/Roblox_2_16_2019_12_04_08_AM.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/6/69/Class_707_pic_taken_on_May_1%2C_2019.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/a/ae/Class_707_at_West_Benton_%28NOT_STOPPING%29.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/d/d0/Class707.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/a/a9/707042.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/a/a8/Class_707_%40_Stepford_East.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/7/7b/46D9DA9C-4745-4324-A431-435DA5AA3730.jpeg",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/d/d9/Screenshot_2021-01-13_at_16.11.17.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/4/40/707_NGv3.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/b/b8/SneakPeek211125.png",
                ],
              },
              "Class 717": {
                Exterior:
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/a/a4/Class_717_v2_Ext.png",
                Interior:
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/d/d5/Class_717_v2_Int.png",
                Cab: "https://static.wikia.nocookie.net/scr-unofficial-main/images/7/7a/Class_717_v2_Cab.png",
                drawings: [
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/1/11/Class_717_Metro_Diagram.png",
                ],
                gallery: [
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/7/7f/C717_2022-02-26.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/6/6a/Class717.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/4/45/Class717Benton.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/4/4a/717EastBerrily.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/e/ec/Class_717_SHB.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/e/e3/AirportParkway717.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/2/2b/Class_717_R132.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/0/04/Class_717.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/c/c1/SCR_Class_717_Metro_High_Quality.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/b/b8/SneakPeek211125.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/8/8d/717_remesh_at_berrily.png",
                ],
              },
              "Class 720": {
                Exterior:
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/c/c1/720meshout.png",
                Interior:
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/a/a9/720meshin.png",
                Cab: "https://static.wikia.nocookie.net/scr-unofficial-main/images/7/77/720meshcab.png",
                gallery: [
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/a/a0/720-4Car-CN.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/b/b2/720-5Car-CN.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/4/43/720-5Car-CN-Refurbished.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/a/a3/720-SC.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/4/42/Class720NG.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/0/09/Class_720_R024_Northshore.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/5/50/720036.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/a/ac/Class_720.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/6/66/720.PNG",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/d/d0/Class720benton.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/9/90/Connect_701.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/6/6d/SCR_Connect_ad_2.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/0/03/Class_720_NG_V.2.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/0/0f/Class_720_%40_Leighton_City.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/8/81/Two_Class_720s.jpg",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/4/40/Sneak_Peek_13-11-2021.png",
                ],
              },
              "Class 730": {
                Exterior:
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/d/df/730meshcout.png",
                Interior:
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/f/ff/730meshcin.png",
                Cab: "https://static.wikia.nocookie.net/scr-unofficial-main/images/a/ac/730C-cab.png",
                drawings: [
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/e/e6/WL730Diagram.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/2/28/CN730Diagram.png",
                ],
                gallery: [
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/c/c0/Screenshot_2021-01-15_at_15.59.32.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/0/02/Unknown-1588250483.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/2/21/WaterLine_Class_730_NG_Benton.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/f/f9/NG_Class_730.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/1/18/730_%282%29.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/a/ae/730.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/6/62/Class_730.PNG",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/0/08/730.PNG",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/c/ce/730-0.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/1/10/Class_730_%40_Faraday_Road.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/0/09/Roblox_12_19_2018_10_36_16_PM.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/1/1f/Class_730_%40_Greenslade.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/5/57/ClassBTS.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/d/d9/Screenshot_2021-01-31_111626.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/b/bb/LSR730.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/c/c4/730Mesh_Exclusive91021.jpg",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/d/dd/730_GS.png",
                ],
              },
              "Class 745": {
                Exterior:
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/9/9d/SCR_Class_745_Airlink_High_Quality.png",
                "Interior (Standard Class)":
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/f/fd/745-interior.png",
                "Interior (First Class)":
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/b/bf/SCR_Class_745_Airlink_Interior_High_Quality.png",
                Cab: "https://static.wikia.nocookie.net/scr-unofficial-main/images/6/62/AirLink_Class_745_Cab.png",
                drawings: [
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/e/e4/Class_745_Airlink.png",
                ],
                gallery: [],
              },
              "Class 756": {
                Exterior:
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/f/fb/AL755-4_Exterior.png",
                Interior:
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/e/ed/AL755-4_Interior.png",
                Cab: "https://static.wikia.nocookie.net/scr-unofficial-main/images/a/ac/755v3Cab.png",
                drawings: [
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/a/af/7554.png",
                ],
                gallery: [
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/d/d6/755.3_out.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/9/92/755.4_out.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/a/a3/755out2.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/7/73/Meshed755.png",
                ],
              },
              "Class 777": {
                Exterior:
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/e/e0/777-ext2.png",
                Interior:
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/9/9c/777-int.png",
                Cab: "https://static.wikia.nocookie.net/scr-unofficial-main/images/6/63/777-cab.png",
                drawings: [
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/b/b9/Class_777_Metro_Diagram.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/8/81/Class_777_D_Metro_Diagram.png",
                ],
                gallery: [
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/8/8c/Class_777_R130.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/4/47/Sneak_Peek_NY_25.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/e/e9/Class_777_R028.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/a/a8/Class_777_PIS.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/5/52/Class_777_R133.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/0/0e/Class_777_R136.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/3/32/A_double_class_777_at_Stepford_Victoria_towards_Port_Benton.png",
                ],
              },
              "Class 800": {
                Exterior:
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/4/47/800ExtN.png",
                "Interior (First Class)":
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/2/21/801v3-int-1st.png",
                "Interior (Standard Class)":
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/d/d3/801v3-int-ord.png",
                Cab: "https://static.wikia.nocookie.net/scr-unofficial-main/images/4/44/801v3-cab.png",
                drawings: [
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/7/7f/Class_800_2_Stepford_Express.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/a/a4/Class_800_1_Stepford_Express.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/8/83/Class_800_2_D_Stepford_Express.png",
                ],
                gallery: [
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/3/31/80xEdgemead_%28NGv3%29.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/3/33/800CarnaleaBridge_%28NGv3%29.png",
                ],
              },
              "Class 801": {
                Exterior:
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/0/06/801ExtN.png",
                "Interior (First Class)":
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/2/21/801v3-int-1st.png",
                "Interior (Standard Class)":
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/d/d3/801v3-int-ord.png",
                Cab: "https://static.wikia.nocookie.net/scr-unofficial-main/images/4/44/801v3-cab.png",
                drawings: [
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/9/92/SCR_Ex_801_Game_Livery_Drawing.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/5/52/Class_801_2_Stepford_Express.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/6/6d/Class_801_1_D_Stepford_Express.png",
                ],
                gallery: [
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/3/3b/A-Trains.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/9/92/Class_802_%26_Class_801.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/9/95/2_A-Trains.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/1/1c/Class_801_%40_St_Helens_Bridge.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/d/dd/Class_801_%40_Northshore.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/c/c8/RobloxPlayerBeta_87MnABpGqw.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/6/6e/Class_801_at_Leighton_Depot.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/c/ca/Class_801_%26_Class_802.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/d/d1/Class_801.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/9/9b/Stepford_Express_Class_801.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/3/30/2_Class_801s.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/9/9d/RobloxScreenShot20191219_155631359.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/f/f6/Class_801_New.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/d/db/801_%40_viaduct_%40_new_harrow.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/7/7d/RobloxScreenShot20210105_153121862.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/3/31/80xEdgemead_%28NGv3%29.png",
                ],
              },
              "Class 802": {
                Exterior:
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/c/cd/802_ext_1_10_8.png",
                "Interior (First Class)":
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/9/91/AL_Class_802_1ST.png",
                "Interior (Standard Class)":
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/6/68/802_int_standard_1_10_8.png",
                Cab: "https://static.wikia.nocookie.net/scr-unofficial-main/images/4/44/801v3-cab.png",
                drawings: [
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/f/ff/Class_802_Airlink.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/2/2d/Class_802_D_Airlink.png",
                ],
                gallery: [
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/e/e6/802Refurbished.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/0/04/802_stepford_new.PNG",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/7/7d/802_sneak_peek.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/f/f3/Class_802_New_Livery_%40_Airport_Parkway.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/5/51/NG_Class_802.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/e/ec/Unknown_%2810%29.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/9/95/2_A-Trains.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/6/67/Game_Terminal_Class_802.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/2/26/Unknown-1-0.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/3/3b/A-Trains.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/c/ca/Class_801_%26_Class_802.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/f/f2/3_Class_802s_%40_Stepford_Central.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/e/e0/802_%281%29.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/1/18/AirLink_Class_802.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/f/f5/RobloxScreenShot20190816_133908604_%282%29.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/9/91/8126319D-353F-4BA2-A9AB-A18CC0432F9F.jpeg",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/b/b5/AirLink_Billboard.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/8/8c/Class802AtSC.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/6/6a/80x_SCR_panel_next_station.png",
                ],
              },
              "Class 91": {
                Exterior:
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/0/0d/Class_91_v2.3.0_Ext.png",
                "Interior (First Class)":
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/1/1b/Class_91_v2.3.0_Int_First.png",
                "Interior (Standard Class)":
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/f/fb/Class_91_v2.3.0_Int_Standard.png",
                Cab: "https://static.wikia.nocookie.net/scr-unofficial-main/images/c/c6/Class_91_v2.3.0_Cab.png",
                gallery: [],
              },
              HST: {
                Exterior:
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/c/cd/HSTv3-ext.png",
                "Exterior (Buffer variant)":
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/b/bd/HSTv3b-ext.png",
                "Interior (First Class)":
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/5/5d/HSTv3-intFirst.png",
                "Interior (Standard Class)":
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/c/c2/HSTv3-intStd.png",
                Cab: "https://static.wikia.nocookie.net/scr-unofficial-main/images/6/6d/HSTv3-cab.png",
                drawings: [
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/6/6e/EX43HSTStandard.png",
                ],
                gallery: [
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/5/5e/HST.PNG",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/7/7e/Class_43_Express.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/e/ef/RobloxScreenShot20191219_194326530.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/a/a4/Class_43%21.jpg",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/e/e7/Class_43_BB.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/8/8f/43005.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/4/4e/FullExpress.jpeg",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/e/e1/Llyn-by-the-Sea_Platform_View.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/2/21/RobloxPlayerBeta_L4UbBe7woI.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/f/fb/434343.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/3/38/Class_43_%40_SC.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/3/3f/IMG_20201106_205647.jpg",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/7/7a/Class43SP07022021.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/d/d1/Image_2021-02-12_104431.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/a/aa/Class43atnewry.jpeg",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/e/e5/43051.png",
                  "https://static.wikia.nocookie.net/scr-unofficial-main/images/1/1c/Sneak_Peek_08-07-2024.png",
                ],
              },
            };
            const fetchImg = (img, url) => {
              GM_xmlhttpRequest({
                method: "GET",
                url: url,
                headers: {
                  Referer: "https://scr-unofficial.fandom.com/",
                },
                responseType: "blob",
                onload(res) {
                  img.src = URL.createObjectURL(res.response);
                },
              });
            };
            const displayImgs = () => {
              for (const col of document.querySelectorAll(
                ".row.row-cols-md-3.row-cols-2.g-4.mb-4 > .col"
              )) {
                if (col.querySelector(".card > .card-body > .row > img"))
                  col.querySelector(".card > .card-body > .row > img").remove();
                const name = col.querySelector(
                  ".card > .card-header"
                ).textContent;
                let newName = name.trim();
                let imgs = trainsToImgs[newName] || null;
                if (!imgs) {
                  newName = newName.replace(/\s*\([^)]*\)/g, "");
                  imgs = trainsToImgs[newName] || null;
                  if (!imgs) {
                    newName = newName.split("/")[0];
                    imgs = trainsToImgs[newName] || null;
                  }
                }
                if (imgs) {
                  const row = col.querySelector(".card > .card-body > .row");
                  row.style = "margin-bottom: 0px !important";
                  const img = document.createElement("img");
                  fetchImg(img, Object.values(imgs)[0]);
                  row.appendChild(img);
                }
                const card = col.querySelector(".card");
                card.style.cursor = "pointer";
                card.title = "Click to see more photos";
                card.addEventListener("click", () => {
                  const bg = document.createElement("div");
                  bg.style =
                    "position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 9999; background-color: rgba(0,0,0,0.5) !important; display: flex; align-items: center; justify-content: center";
                  document.body.appendChild(bg);
                  const dialog = card.cloneNode(true);
                  dialog.style =
                    "max-height: 80vh !important; max-width: 50vw !important;";
                  bg.appendChild(dialog);
                  const header = dialog.querySelector(".card-header");
                  header.style =
                    "display: flex; flex-direction: row; align-items: center;";
                  const name = header.textContent;
                  header.innerHTML = "";
                  const div1 = document.createElement("div");
                  div1.style = "width: 100%";
                  div1.innerHTML = `<i class="bi bi-train-front"></i>${name}`;
                  header.appendChild(div1);
                  const div2 = document.createElement("div");
                  div2.innerHTML = `<i class="bi bi-x" style="font-size: 1.5rem; cursor: pointer"></i>`;
                  header.appendChild(div2);
                  div2.addEventListener("click", () => bg.remove());
                  bg.addEventListener("click", (event) => {
                    if (event.target === bg) bg.remove();
                  });
                  dialog.querySelector(".card-body > .row > img").remove();
                  const listImgs = document.createElement("div");
                  listImgs.style =
                    "width 100%; max-height: 50vh; overflow-y: auto";
                  dialog
                    .querySelector(".card-body > .row")
                    .appendChild(listImgs);
                  for (const url of Object.values(imgs).flat()) {
                    const i = document.createElement("img");
                    fetchImg(i, url);
                    i.style = "width: 100%; margin-bottom: 10px";
                    listImgs.appendChild(i);
                  }
                });
              }
            };
            function debounce(fn, delay) {
              let timer;
              return function (...args) {
                clearTimeout(timer);
                timer = setTimeout(() => {
                  fn.apply(this, args);
                }, delay);
              };
            }

            displayImgs();
            document
              .getElementById("SearchTerm")
              .addEventListener("input", debounce(displayImgs, 200));
          }
        });
      }
    } else {
      currentPage = "";
    }
  });
})();