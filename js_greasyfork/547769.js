// ==UserScript==
// @name         SCR+
// @name:fr      SCR+
// @namespace    https://github.com/pierolb/scrplus
// @version      1.0.0
// @description  Enhances the Stepford County Railway website
// @description:fr  Améliore le site Stepford County Railway
// @author       PieroLB
// @match        https://stepfordcountyrailway.co.uk/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stepfordcountyrailway.co.uk
// @require      https://cdnjs.cloudflare.com/ajax/libs/microsoft-signalr/6.0.1/signalr.min.js
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547769/SCR%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/547769/SCR%2B.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const SR = {
    connection: null,
    connect: function () {
      return new Promise((resolve, reject) => {
        this.connection = new signalR.HubConnectionBuilder()
          .withUrl("https://stepfordcountyrailway.co.uk/Push/Meta", {
            headers: {
              Cookie: document.cookie,
            },
          })
          .build();
        this.connection
          .start()
          .then(() => {
            console.log("[SR] ✅ Connected");
            resolve();
          })
          .catch((err) => {
            console.log("[SR] ❌ Connection failed. Error:", err);
            reject();
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
            console.log("[SR] ✅ Routes getted");
            this.stations = response.stations.stations.map((station) => {
              return {
                id: station.id,
                name: station.name,
                operators: station.operatorIds,
              };
            });
            console.log("[SR] ✅ Stations getted");
            resolve();
          })
          .catch((err) => {
            console.log("[SR] ❌ getGlobalData.GetWorldViewModel error :", err);
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
              console.log("[SR] ✅ Servers getted");
              resolve();
            } else {
              reject();
            }
          })
          .catch((err) => {
            console.log("[SR] ❌ getGlobalData.GetWorldViewModel error :", err);
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
              "[SR] ❌ getPreciseData.GetOnlineServers error :",
              err
            );
            reject(err);
          });
      });
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
    const minutes = (timeInMin % 60).toString();
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
        const url =
          "https://scr-info.neocities.org/Resources/Signalling_Map.png";

        const img = document.createElement("img");
        img.src = url;
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
        btn1.href = url;
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
      if (currentPage !== "Servers") {
        currentPage = "Servers";
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
            SR.stations
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
            counter.textContent = `${SR.servers.length}/${
              SR.servers.length
            } server${SR.servers.length > 1 ? "s" : ""}`;
            div.appendChild(counter);
            btn.addEventListener("click", () => {
              btn.textContent = "Loading...";
              if (select.value === "null") {
                document
                  .querySelectorAll(
                    ".row.row-cols-xl-3.row-cols-md-2.row-cols-1 .col.mb-4"
                  )
                  .forEach((card) => (card.style.display = "block"));
                counter.textContent = `${SR.servers.length}/${
                  SR.servers.length
                } server${SR.servers.length > 1 ? "s" : ""}`;
                btn.textContent = "Search";
              } else {
                SR.getServersWithoutDispatcher(select.value).then((servers) => {
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
                    SR.servers.length
                  } server${servers.length > 1 ? "s" : ""}`;
                  btn.textContent = "Search";
                });
              }
            });
          }
        });
      }
    } else if (location.pathname.split("/")[1] === "Routes") {
      if (currentPage !== "Routes") {
        currentPage = "Routes";
        const loop = setInterval(() => {
          if (
            document.querySelectorAll(
              ".row.row-cols-md-3.row-cols-2.g-4.mb-4 > .col"
            ).length > 0
          ) {
            clearInterval(loop);
            setTimeout(() => {
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
                  const route = SR.routes.find((r) => r.id === routeId);
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
            }, 300);
          }
        });
      }
    } else {
      currentPage = "";
    }
  });

  SR.connect().then(() => SR.getGlobalData().then(() => SR.getServers()));
})();
