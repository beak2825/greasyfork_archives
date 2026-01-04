// ==UserScript==
// @name         AUA Courses Plugin 
// @namespace    https://github.com/rezocrypt/aua-utils/
// @version      1.0.0
// @description  AUA Courses Plugin helps you find and filter courses more quickly and with greater flexibility.
// @match        https://auasonis.jenzabarcloud.com/GENSRsC.cfm*
// @run-at       document-end
// @grant        none
// @icon         https://aua.am/favicon.ico
// @author       rezocrypt 
// @license      GPL-3.0
// @supportURL   https://t.me/rezocrypt
// @downloadURL https://update.greasyfork.org/scripts/559586/AUA%20Courses%20Plugin.user.js
// @updateURL https://update.greasyfork.org/scripts/559586/AUA%20Courses%20Plugin.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // ----- Global Variables And Constants -----

    let courses = [];
    let matchingCourses = [];
    let showOnly = false;
    let checkedDays = [];

    const dayCheckboxes = {};
    const availableTimes = [];
    const timeCheckboxes = {};

    const AUA_BLUE = "#002147";

    // This function generates a params object for fetching courses. This is complex because Jenzabar
    // doesn't provide automaticaly correct semester and year parameters so we need to find it by
    // ourselves.
    function getRequestParams(year = null, semester = null) {
        // Defining semesters information
        const semesters = [
            {
                id: "spring",
                index: 3,
                coursesBegin: "January 19",
                coursesEnd: "May 14",
            },
            {
                id: "summer",
                index: 4,
                coursesBegin: "June 15",
                coursesEnd: "August 7",
            },
            {
                id: "fall",
                index: 1,
                coursesBegin: "August 20",
                coursesEnd: "December 9",
            },
        ];

        // Here will be final result stored
        let matchedSemester = null;

        // Finding out for which semester we must show courses now (which idk why jenzabar DIDN'T)
        semesters.forEach((semester, index) => {
            // Parsing dates
            const semesterEndDate = semester.coursesEnd;
            const nextSemesterEndDate =
                semesters[index + 1]?.coursesEnd || semesters[0].coursesEnd;

            // Getting date objects
            const startDate = new Date(`${semesterEndDate}, 1900`);
            const endDate = new Date(
                `${nextSemesterEndDate}, ${1900 + (semesters[index + 1] ? 0 : 1)}`,
            );

            // Defining current date to compare with something but with year 1900
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            let formattedYear = null;
            const compareDate = new Date(`${semesters[0].coursesEnd}, 1900`);

            // Setting full year for comparing
            currentDate.setFullYear(1900);

            // Comparing to get the full year for request which needs to be something like 202526
            if (currentDate <= compareDate) {
                formattedYear = `${currentYear - 1}${currentYear % 100}`;
            } else {
                formattedYear = `${currentYear}${(currentYear % 100) + 1}`;
            }

            // Then setting to one more year if it is actually in spring semester (its too complex here)
            currentDate.setFullYear(1900 + (currentDate <= compareDate ? 1 : 0));

            // Finally checking if we are between the ends of our semester and the following semester
            if (startDate <= currentDate && currentDate <= endDate) {
                matchedSemester = semesters[semesters[index + 1] ? index + 1 : 0];
                matchedSemester["year"] = formattedYear;
            }
        });

        /* EXAMPLE const params = {chkschyear: "202526", chkschsem: "3", search: "" }; */

        // Defining finally the parameters
        const params = {
            chkschyear: year || matchedSemester.year,
            chkschsem: semester || matchedSemester.index,
            search: "",
        };

        // Returning
        return params;
    }

    // Defining initial params for first load of the plugin
    const params = getRequestParams();


    // ========== HTML Generation and Manipulation Logic ==========

    // Here I decided to use one function to create the entire window to keep things organized
    // which is not done in gened-plugin.js.
    function createWindow() {
        // ----- Main Window Section -----

        // Creating main window element inside which everything will be placed
        const win = document.createElement("div");
        win.id = "aua-courses-plugin-window";
        win.style.cssText = `
            position: fixed;
            top: 100px;
            right: 100px;
            height: auto;
            max-height: 80vh;
            width: 300px;
            background: white;
            color: #fff;
            border: 1px solid #333;
            border-radius: 6px;
            font-size: 13px;
            overflow: auto;
            z-index: 999999;
            resize: both;     /* bottom-right corner resize */
        `;



        // ----- Header Section -----

        // Creating header
        const header = document.createElement("div");
        header.style.cssText = `
            background: ${AUA_BLUE};
            color: #ffffff;
            padding: 10px 8px 8px 8px;
            cursor: move;
            border-top-left-radius: 6px;
            border-top-right-radius: 6px;
            position: sticky;
            top: 0;
            z-index: 10;
        `;

        // Creating image container for AUA log
        const imageContainer = document.createElement("div");
        imageContainer.style.cssText = `
            display: flex;
            justify-content: center;
            margin-bottom: 5px;
        `;

        // Creating the actual image using aua.am/favicon.ico in case of change
        const image = document.createElement("img");
        image.src = "https://aua.am/favicon.ico";
        image.style.cssText = `
            width: 32px;
            height: 32px;
        `;
        imageContainer.appendChild(image);

        // Appending image container to header
        header.appendChild(imageContainer);

        // Creating header text for plugin
        const headerText = document.createElement("div");
        headerText.textContent = "AUA Courses Plugin";
        headerText.style.cssText = `
            font-size: 16px;
            font-weight: bold;
            margin-top: 4px;
            text-align: center;
        `;

        // Appending header text to header
        header.appendChild(headerText);

        // Movable behavior which lets to move window by dragging the header
        let dx, dy;
        header.onpointerdown = (e) => {
            dx = e.clientX - win.offsetLeft;
            dy = e.clientY - win.offsetTop;
            document.onpointermove = (e) => {
                win.style.left = e.clientX - dx + "px";
                win.style.top = e.clientY - dy + "px";
            };
            document.onpointerup = () => {
                document.onpointermove = null;
                document.onpointerup = null;
            };
        };

        // Close button of header 
        const closeButton = document.createElement("button");
        closeButton.textContent = "×";
        closeButton.title = "Close Window";
        closeButton.style.cssText = `
            position: absolute;
            top: 8px;
            right: 8px;
            width: 24px;
            height: 24px;
            border: none;
            background: #d32f2f;
            color: #fff;
            font-weight: bold;
            font-size: 16px;
            border-radius: 4px;
            cursor: pointer;
            line-height: 20px;
            text-align: center;
            padding: 0;
            transition: 0.2s;
        `;

        // Adding event listeners to close button for hover effect and click action
        closeButton.addEventListener("mouseenter", () => {
            closeButton.style.opacity = "0.8";
        });
        closeButton.addEventListener("mouseleave", () => {
            closeButton.style.opacity = "1";
        });
        closeButton.addEventListener("click", () => closeWindow());

        // Appending close button to header
        header.appendChild(closeButton);



        // ----- Content Section -----

        // Creating content container inside which will other interactive elements be placed
        const content = document.createElement("div");
        content.style.cssText = `
            padding: 10px;
            text-align: left;
            background: white;
            overflow: auto;
        `;



        // ----- Semester Section -----

        // Defining wrapper inside which will be semester title and select
        const semesterWrapper = document.createElement("div");
        semesterWrapper.style.cssText = `
            display: flex;
            align-items: center;
            margin-top: 10px;
            margin-bottom: 6px;
        `;

        // Defining semester title
        const semesterTitle = document.createElement("div");
        semesterTitle.textContent = "Semester";
        semesterTitle.style.cssText = `
            color: ${AUA_BLUE};
            font-weight: bold;
            font-size: 16px;
        `;

        // Appending semester title to wrapper
        semesterWrapper.appendChild(semesterTitle);

        // Defining semester select where will be semesters as options
        const selectSemester = document.createElement("select");
        selectSemester.id = "semesterSelect";
        selectSemester.style.cssText = `
            margin-left: auto;
            width: 120px;  // adjust width for semester
            border: 1px solid ${AUA_BLUE};
            border-radius: 4px;
            padding: 4px 6px;
            background: #ffffff;
            color: ${AUA_BLUE};
            font-weight: normal;
            font-size: 13px;
            cursor: pointer;
            transition: all 0.2s ease;
        `;

        // Defining semester options (for some reason semester values are 3,4,1 for spring, summer, fall)
        // ask to jenzabar why
        const semesters = [
            { value: "3", text: "Spring" },
            { value: "4", text: "Summer" },
            { value: "1", text: "Fall" },
        ];

        // Appending semesters as options to select
        semesters.forEach((sem) => {
            const opt = document.createElement("option");
            opt.value = sem.value;
            opt.textContent = sem.text;
            selectSemester.appendChild(opt);
        });


        // Append after 100ms to avoid JCF interference (otherwise JCF overrides it)
        setTimeout(() => {
            semesterWrapper.appendChild(selectSemester);
        }, 100);


        // Appending semesterWrapper to content
        content.appendChild(semesterWrapper);



        // ----- Year Section -----

        // Defining wrapper for year title and input
        const yearWrapper = document.createElement("div");
        yearWrapper.style.cssText = `
            display: flex;
            align-items: center;
            margin-top: 10px;
            margin-bottom: 6px;
        `;

        // Defining year title element
        const yearTitle = document.createElement("div");
        yearTitle.textContent = "Year";
        yearTitle.style.cssText = `
            color: ${AUA_BLUE};
            font-weight: bold;
            font-size: 16px;
        `;

        // Appending year title to wrapper
        yearWrapper.appendChild(yearTitle);

        // Defining year input element (first I was going to use select but 
        // someone may want to enter custom year like 202021 and that would be impossible.
        // So input is better here (at least I think so).    
        const inputYear = document.createElement("input");
        inputYear.id = "yearInput";
        inputYear.type = "text";
        inputYear.value = params.chkschyear;
        inputYear.style.cssText = `
            margin-left: auto;
            width: 120px;  
            border: 1px solid ${AUA_BLUE};
            border-radius: 4px;
            padding: 4px 6px;
            background: #ffffff;
            color: ${AUA_BLUE};
            font-weight: normal;
            font-size: 13px;
            box-sizing: border-box;
            cursor: text;
            transition: all 0.2s ease;
        `;

        // Appending year input to wrapper
        yearWrapper.appendChild(inputYear);

        // Append after 100ms to avoid JCF interference
        yearTitle.insertAdjacentElement("afterend", inputYear);

        // Appending yearWrapper to content
        content.appendChild(yearWrapper);


        // ----- Reload Button Section -----

        // This butto sends data to fetchCourses function to fetch courses with current semester and year
        // that user entered in inputs selectSemester and inputYear.
        const reloadButton = document.createElement("button");
        reloadButton.textContent = "Reload";
        reloadButton.style.cssText = `
            width: 100%;
            margin-top: 10px;
            margin-bottom: 5px;
            padding: 8px;
            border: 1px solid ${AUA_BLUE};
            background: #fff;
            cursor: pointer;
            color: ${AUA_BLUE};
            font-weight: bold;
            transition: all 0.2s ease;
        `;

        // Appending relad button to content
        content.appendChild(reloadButton);

        // Hover effect
        reloadButton.addEventListener("mouseenter", () => {
            reloadButton.style.background = AUA_BLUE;
            reloadButton.style.color = "#fff";
        });
        reloadButton.addEventListener("mouseleave", () => {
            reloadButton.style.background = "#fff";
            reloadButton.style.color = AUA_BLUE;
        });

        // Click effect
        reloadButton.addEventListener("mousedown", () => {
            reloadButton.style.transform = "scale(0.97)";
        });
        reloadButton.addEventListener("mouseup", () => {
            reloadButton.style.transform = "scale(1)";
        });

        // The event that calls fetchCourses function
        reloadButton.addEventListener("click", () => fetchCourses());



        // ----- Show Only Matching Button Section -----

        // This button shows only matching courses when clicked and hides non-matching ones.

        // Creates container for show only matching button
        const bottomContainer = document.createElement("div");
        bottomContainer.style.cssText = `
            margin-top: 5px;
            padding-top: 6px;
            text-align: center;
        `;

        // Creating the actual button
        const showOnlyButton = document.createElement("button");
        showOnlyButton.innerHTML = `
            Show only matching ( <span style="font-size: 12px;" id="matchedCount">0</span> )
        `;
        showOnlyButton.id = "showOnlyButton";
        showOnlyButton.style.cssText = `
            width: 100%;
            padding: 6px;
            border: 1px solid ${AUA_BLUE};
            border-radius: 4px;
            background: #ffffff;
            color: ${AUA_BLUE} !important;
            font-weight: bold;
            cursor: pointer;
            transition: 0.2s;
            margin-bottom: 15px;
        `;

        // Hover effect
        showOnlyButton.addEventListener("mouseenter", () => {
            showOnlyButton.style.background = AUA_BLUE;
            showOnlyButton.style.color = "#fff";
        });
        showOnlyButton.addEventListener("mouseleave", () => {
            if (!showOnly) {
                showOnlyButton.style.background = "#fff";
                showOnlyButton.style.color = AUA_BLUE;
            }
        });

        // Click effect
        showOnlyButton.addEventListener("mousedown", () => {
            showOnlyButton.style.transform = "scale(0.97)";
        });
        showOnlyButton.addEventListener("mouseup", () => {
            showOnlyButton.style.transform = "scale(1)";
        });

        // Toggle functionality
        showOnlyButton.addEventListener("click", () => {
            // Toggling showOnly variable
            showOnly = !showOnly;

            // Updating button styles based on state
            if (showOnly) {
                showOnlyButton.style.setProperty(
                    "background",
                    `${AUA_BLUE}`,
                    "important",
                );
                showOnlyButton.style.setProperty("color", "#ffffff", "important");
            } else {
                showOnlyButton.style.setProperty("background", "#ffffff", "important");
                showOnlyButton.style.setProperty("color", `${AUA_BLUE}`, "important");
            }

            // Finally calling highlightRows to apply the changes
            highlightRows();
        });

        // Appending show only button to bottom container and then to content
        bottomContainer.appendChild(showOnlyButton);
        content.appendChild(bottomContainer);



        // ----- Search Input Section -----

        // Creating search title
        const searchTitle = document.createElement("div");
        searchTitle.textContent = "Search";
        searchTitle.style.cssText = `
            font-size: 15px;
            font-weight: bold;
            color: #002147;
            margin-bottom: 4px;
        `;
        content.appendChild(searchTitle);

        // Creating search input
        const searchInput = document.createElement("input");
        searchInput.autofocus = true;
        searchInput.type = "text";
        searchInput.id = "searchInput";
        searchInput.placeholder = "Search keywords";
        searchInput.style.cssText = `
            width: 100%;
            box-sizing: border-box;
        `;

        // Using debounce to avoid too many calls while user is typing
        // so if it is typing like f r e s h m a n it won't call highlightRows
        // for each letter but only after user stops typing for 500ms
        let debounceTimer;
        searchInput.addEventListener("input", () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                highlightRows();
            }, 500); // 500ms delay after user stops typing
        });

        // Appending search input to content
        content.appendChild(searchInput);




        // ----- Clear Filters Button Section -----

        // This button clears all filters (search input, day checkboxes, time checkboxes)

        // Creating the actual button
        const clearFiltersButton = document.createElement("button");
        clearFiltersButton.textContent = "Clear Filters";
        clearFiltersButton.style.cssText = `
            width: 100%;
            margin-top: 15px;
            margin-bottom: 5px;
            padding: 8px;
            border: 1px solid ${AUA_BLUE};
            background: #fff;
            cursor: pointer;
            color: ${AUA_BLUE};
            font-weight: bold;
            transition: all 0.2s ease;
        `;

        // Appending clear filters button to content
        content.appendChild(clearFiltersButton);

        // Hover effect
        clearFiltersButton.addEventListener("mouseenter", () => {
            clearFiltersButton.style.background = AUA_BLUE;
            clearFiltersButton.style.color = "#fff";
        });
        clearFiltersButton.addEventListener("mouseleave", () => {
            clearFiltersButton.style.background = "#fff";
            clearFiltersButton.style.color = AUA_BLUE;
        });

        // Click effect
        clearFiltersButton.addEventListener("mousedown", () => {
            clearFiltersButton.style.transform = "scale(0.97)";
        });
        clearFiltersButton.addEventListener("mouseup", () => {
            clearFiltersButton.style.transform = "scale(1)";
        });

        // Call your function
        clearFiltersButton.addEventListener("click", () => clearFilters());




        // ----- Weekdays Filter (TOGGLE) Section -----

        // Weekdays title (clickable for toggle)
        const weekdaysTitle = document.createElement("div");
        weekdaysTitle.style.cssText = `
            color: ${AUA_BLUE};
            font-weight: bold;
            margin-top: 20px;
            margin-bottom: 6px;
            font-size: 16px;
            cursor: pointer;
            user-select: none;
            display: flex;
            align-items: center;
            gap: 6px;
        `;

        // Arrow for toggling the weekdays container as dropdown
        const arrow = document.createElement("span");
        arrow.textContent = "▾"; // open
        arrow.style.fontSize = "12px";

        // Title text (I played lot with Chatgpt that's why it is created separately two titles)
        const titleText = document.createElement("span");
        titleText.textContent = "Weekdays";

        // Appending arrow and title to weekdays title
        weekdaysTitle.appendChild(arrow);
        weekdaysTitle.appendChild(titleText);

        // Appending weekdays title to content
        content.appendChild(weekdaysTitle);

        // Creating container for weekdays' checkboxes
        const weekdaysContainer = document.createElement("div");
        weekdaysContainer.style.cssText = `
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 6px 12px;
            margin-bottom: 10px;
        `;

        // Appending weekdays container to content
        content.appendChild(weekdaysContainer);

        // Logic for toggling weekdays container when clicking the title
        let weekdaysVisible = true;
        weekdaysTitle.addEventListener("click", () => {
            weekdaysVisible = !weekdaysVisible;
            weekdaysContainer.style.display = weekdaysVisible ? "grid" : "none";
            arrow.textContent = weekdaysVisible ? "▾" : "▸";
        });

        // Weekday options (I used these codes because they are present in course times but
        // for names I think it is better to have full names. I haven't use to be determined
        // because it is too long and I do not know CSS good enough).
        const days = [
            { code: "MON", name: "Monday" },
            { code: "TUE", name: "Tuesday" },
            { code: "WED", name: "Wednesday" },
            { code: "THU", name: "Thursday" },
            { code: "FRI", name: "Friday" },
            { code: "SAT", name: "Saturday" },
            { code: "TBD", name: "Unknown" },
        ];

        // Creating checkboxes for each weekday using the days array and foreach
        days.forEach((day) => {
            // Creating label for checkbox and text
            const label = document.createElement("label");
            label.style.cssText = `
                display: flex;
                align-items: center;
                font-size: 13px;
                cursor: pointer;
                color: ${AUA_BLUE};
            `;

            // Creating the actual checkbox element
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.value = day.code;
            checkbox.style.marginRight = "6px";

            // Adding event listener to checkbox to update checkedDays and highlight rows when changed
            checkbox.addEventListener("change", () => highlightRows());

            // Appending checkbox and text to label
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(day.name));

            // Appending label to weekdays container
            weekdaysContainer.appendChild(label);

            // Storing checkbox in dayCheckboxes object for later use and reference
            dayCheckboxes[day.code] = checkbox;
        });





        // ----- Times Filter (TOGGLE) Section -----

        // This is actually complex thing. Depending on available times in courses matching
        // the search and weekdays filters, the available times checkboxes are generated 

        // Times title (clickable for toggle)
        const timesTitle = document.createElement("div");
        timesTitle.style.cssText = `
            color: ${AUA_BLUE};
            font-weight: bold;
            margin-top: 20px;
            margin-bottom: 6px;
            font-size: 16px;
            cursor: pointer;
            user-select: none;
            display: flex;
            align-items: center;
            gap: 6px;
`;

        // Arrow for toggling times container
        const timesArrow = document.createElement("span");
        timesArrow.textContent = "▸"; // collapsed initially
        timesArrow.style.fontSize = "12px";

        // Title text
        const timesText = document.createElement("span");
        timesText.textContent = "Times";

        // Appending arrow and title to times title
        timesTitle.appendChild(timesArrow);
        timesTitle.appendChild(timesText);

        // Appending times title to content
        content.appendChild(timesTitle);

        // Container for actual time options (checkboxes)
        const timesContainer = document.createElement("div");
        timesContainer.id = "timesContainer";
        timesContainer.style.cssText = `
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 6px;
            margin-bottom: 10px;
        `;

        // Appending times container to content
        content.appendChild(timesContainer);

        // Logic for toggling times container when clicking the title
        let timesVisible = false; // default not visible
        timesContainer.style.display = "none"; // hide initially
        timesTitle.addEventListener("click", () => {
            timesVisible = !timesVisible;
            timesContainer.style.display = timesVisible ? "grid" : "none";
            timesArrow.textContent = timesVisible ? "▾" : "▸";
        });







        // ----- Footer Section -----

        // This is footer part of the window which contains social icons (yet)
        const footer = document.createElement("div");
        footer.style.cssText = `
            width: 100%;
            background: #002147;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 14px;
            padding: 10px 0;
            border-bottom-left-radius: 6px;
            border-bottom-right-radius: 6px;
            box-sizing: border-box;
            flex-shrink: 0; /* keep footer height fixed */
        `;

        // Function to create clickable social icons
        function createIcon(src, title, url) {
            // Creating image element for icon
            const icon = document.createElement("img");
            icon.src = src;
            icon.style.cssText = `
                        width: 22px;
                        height: 22px;
                        filter: invert(1);
                        cursor: pointer;
                `;
            icon.title = title;

            // Adding click event to open the url in new tab
            icon.addEventListener("click", () => {
                window.open(url, "_blank");
            });

            // Returning the created icon element
            return icon;
        }

        // Creating GitHub icon using createIcon function
        const githubIcon = createIcon(
            "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/github.svg",
            "GitHub",
            "https://github.com/rezocrypt/aua-utils",
        );

        // Creating Telegram icon using createIcon function
        const telegramIcon = createIcon(
            "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/telegram.svg",
            "Telegram",
            "https://t.me/rezocrypt",
        );

        // Adding created social icons to footer
        footer.appendChild(githubIcon);
        footer.appendChild(telegramIcon);



        // ----- Window Assembly Section -----

        // Appending created sections to main window (only big sections because
        // smaller ones are already inside bigger ones)
        win.appendChild(header);
        win.appendChild(content);
        win.appendChild(footer);

        // Finally appending the window to body
        document.body.appendChild(win);
    }


    // ========== HTML Generation and Manipulation Logic ==========




    // ========== Logic Functionality ==========

    // This function is for clearing unnecessary things from the page before loading
    function clearFromUnnecessaryElements() {
        // This is main table where the rows will be REPLACED with new fetched ones (not clearing yet)
        const coursesDiv = document.querySelector(".table-responsive");

        // This form for search is not necessary and must be removed
        document.querySelector(".update-form")?.remove();

        // This heading text Courses By Semester is not necessary and must be removed
        document.querySelector(".heading-wrap")?.remove();
    }

    // Main function that is called when we got fetched
    function afterFetch(html) {
        // Preventing multiple fetches at the same time
        window.nowIsFetching = true;

        // Creating parser that parses the html content to doc variable
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        // Defining table that we got from fetch and table which we need to replace.
        const coursesTableParsed = doc.getElementById("crsbysemester");
        const coursesDiv = document.querySelector(".table-responsive");

        //Clearing original table content
        if (coursesDiv) {
            coursesDiv.innerHTML = "";
        }

        // Checking if both exist and replacing the original table with fetched one.
        if (coursesTableParsed && coursesDiv) {

            // Appending fetched table to the page (replacing with fetched courses)
            coursesDiv.appendChild(coursesTableParsed);

            // Updating courses array
            updateCoursesArray();
        } else {
            // In case of something went wrong but idk why code enters here because it calls afterFetch few times
            // Maybe because of fetchCourses being called multiple times.
            console.log("Either crsbysemester or table-responsive not found.");

            // Stopping loading animation
            stopLoadingAnimation();

            // Allowing new fetches
            window.nowIsFetching = false;
        }



        // ----- Setting Inputs to Current Semester and Year -----

        // Setting semester and year inputs to current values
        const selectSemester = document.querySelector("#semesterSelect"); // or your reference
        const inputYear = document.querySelector("#yearInput");

        // Change select to current semester and year (if by any reason they are empty)
        if (selectSemester.value === "") {
            selectSemester.value = params.chkschsem;
        }
        if (inputYear.value === "") {
            inputYear.value = params.chkschyear;
        }

        // Clearing elements that are not needed
        clearFromUnnecessaryElements();

        // Generating available times for courses
        generateAvailableTimesOfAllCourses();

        // Parsing available times to checkboxes
        parseAvailableTimesToCheckboxes(availableTimes);

        // Clicking show only matches button for by default showing only matching courses
        document.getElementById("showOnlyButton")?.click();

        // Stopping loading animation
        stopLoadingAnimation();

        // Allowing new fetches
        window.nowIsFetching = true;
    }

    // Fetching to same origin to request courses.
    // By default we get all courses because in params "search=" which means
    // send me all courses. Believe me, now browsers are fast enough in terms of 
    // rendering and performing network requests for each filter it will take 
    // decades. So fetching all courses once and then filtering them on client side is
    // the best approach here (at least I think so).
    async function fetchCourses() {
        // Starting loading animation
        startLoadingAnimation();

        // Getting current values from inputs
        const selectSemester = document.querySelector("#semesterSelect");
        const inputYear = document.querySelector("#yearInput");

        // Getting params from inputs
        const currentParams = getRequestParams(
            inputYear?.value || null,
            selectSemester?.value || null,
        );

        // Fetching with new params FETCH WORKS BECAUSE IT IS NOT CROSS-ORIGIN and that's
        // the reason why I chose to make plugin and not static website.
        fetch("https://auasonis.jenzabarcloud.com/GENSRsC.cfm", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams(currentParams),
        })
            .then((res) => res.text())
            .then(afterFetch)
            .catch((err) => console.log("Error fetching courses:", err));
    }

    // Update courses array from the table
    function updateCoursesArray() {

        // Getting all matching rows
        const rows = getRows();

        // Clearing previous courses
        courses = [];

        // Parsing each row to get course details
        rows.forEach((row) => {

            // Getting all cells in the row
            const cells = row.querySelectorAll("td");

            // Getting title and section spans
            const titleSpan = cells[0].querySelector(".title");
            const sectionSpan = cells[0].querySelector(".crsbysemester_course_id");

            // Defining the course data object where all parsed data will be stored
            const courseObj = {
                name: titleSpan?.textContent.trim() || "",
                code: sectionSpan?.textContent.replace(/[()]/g, "").trim() || "",
                section: cells[1]?.textContent.trim() || "",
                session: cells[2]?.textContent.trim() || "",
                credits: cells[3]?.textContent.trim() || "",
                campus: cells[4]?.textContent.trim() || "",
                instructor: cells[5]?.textContent.trim() || "",
                times: cells[6]?.textContent.trim() || "",
                takenSeats: cells[7]?.textContent.trim() || "",
                deliveryMethod: cells[10]?.textContent.trim() || "",
                location: cells[11]?.textContent.trim() || "",
            };

            // Pushing course object to courses array
            courses.push(courseObj);
        });
    }

    // Function for updating checked weekdays
    function updateCheckedWeekdays() {
        const checkboxKeywords = [];

        // Looping through dayCheckboxes to see which are checked
        // and marking each as keyword (because the codes that i used
        // are present in course times string)
        for (const code in dayCheckboxes) {
            // If checked, add to keywords
            if (dayCheckboxes[code].checked) {
                checkboxKeywords.push(code);
            }
        }

        // Finally updating checkedDays array with new keywords
        checkedDays = checkboxKeywords;
    }

    // Scrolling to nearest matching row
    function scrollToNearestMatching() {

        // Getting all matching rows
        const rows = getMatchingRows();

        // Scrolling to the first visible matching row
        for (const row of rows) {
            if (row.offsetParent !== null) {
                row.scrollIntoView({ behavior: "smooth", block: "center" });
                break;
            }
        }
    }

    // Variable to keep track of last scrolled index for Enter key navigation
    let lastScrolledIndex = -1;

    // Setting up Enter key navigation in search input
    function setupSearchInputEnterNavigation() {
        const searchInputElement = document.getElementById("searchInput");

        searchInputElement.addEventListener("keydown", (e) => {
            if (e.key !== "Enter") return;

            const rows = Array.from(getMatchingRows() || []).filter(row => row.offsetParent !== null);
            if (!rows.length) return;

            // Clear old temporary highlights
            rows.forEach(r => {
                if (r.dataset.tempHighlight === "true") {
                    // Restore the previous color stored in data attribute
                    r.style.backgroundColor = r.dataset.originalBg || "";
                    delete r.dataset.tempHighlight;
                    delete r.dataset.originalBg;
                }
            });

            // Update index
            if (e.shiftKey) {
                lastScrolledIndex = (lastScrolledIndex - 1 + rows.length) % rows.length;
            } else {
                lastScrolledIndex = (lastScrolledIndex + 1) % rows.length;
            }

            const row = rows[lastScrolledIndex];

            // Scroll to row
            row.scrollIntoView({ behavior: "smooth", block: "center" });

            // Temporary highlight
            row.dataset.tempHighlight = "true";
            // Store current color before temporary highlight
            row.dataset.originalBg = getComputedStyle(row).backgroundColor;
            row.style.backgroundColor = "#ffcc33";

            setTimeout(() => {
                row.style.backgroundColor = row.dataset.originalBg;
                delete row.dataset.tempHighlight;
                delete row.dataset.originalBg;
            }, 500);
        });
    }

    // Function for extracting the rows from courses table
    function getRows() {
        // Getting the table
        const table = document.getElementById("crsbysemester");

        // If table not found, return but for sure this will cause lot of errors
        if (!table) return;

        // Getting all rows with matching class
        const rows = table.querySelectorAll("tbody tr");

        // Returning the rows
        return rows;
    }

    // Function for extracting matching rows from courses table
    function getMatchingRows() {
        // Getting the table
        const table = document.getElementById("crsbysemester");

        // If table not found, return but for sure this will cause lot of errors
        if (!table) return;

        // Getting all rows with matching class
        const rows = table.querySelectorAll("tbody tr.matching");

        // Returning the rows
        return rows;
    }

    // Generating available times for courses. It goes through courses
    // and extracts times using regex and adds to availableTimes array
    // if they match the regex and are not already present.
    function generateAvailableTimesOfAllCourses() {
        courses.forEach((course) => {
            // Selecting the matching times using regex. So we will get extracted array 
            // of times like ["9:00am-10:15am", "11:00am-12:15pm"]
            const times = course.times.match(
                /\b\d{1,2}:\d{2}(?:am|pm)-\d{1,2}:\d{2}(?:am|pm)\b/gi,
            );

            // If no times found, skip
            if (times === null) return;

            // Adding each time to availableTimes if not already present
            times.forEach((time) => {
                if (!availableTimes.includes(time)) {
                    availableTimes.push(time);
                }
            });
        });

        // Sorting available times to be from earliest to latest but I forgot
        // to implement proper time sorting so it is just alphabetical for now
        // but I think it is not too complex to fix.
        availableTimes.sort();
    }

    // Parse avialbale times to checkboxes
    function parseAvailableTimesToCheckboxes(availableTimes) {

        // Getting times container where we will add/remove checkboxes
        const timesContainer = document.getElementById("timesContainer");

        // Remove unchecked checkboxes (like this is helpful when from old matching some
        // times are checked by user and its not good to remove them automatically)
        Object.keys(timeCheckboxes).forEach((time) => {
            const checkbox = timeCheckboxes[time];
            if (!checkbox.checked) {
                checkbox.parentElement.remove(); // remove label from DOM
                delete timeCheckboxes[time];
            }
        });

        // Add new checkboxes
        availableTimes.forEach((time) => {

            // Skip if already exists (or checked)
            if (timeCheckboxes[time]) {
                return;
            }

            // Creating label for checkbox and text
            const label = document.createElement("label");
            label.style.cssText = `
                display: flex;
                align-items: center;
                font-size: 13px;
                cursor: pointer;
                color: ${AUA_BLUE};
            `;

            // Creating the actual checkbox element
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.value = time;
            checkbox.style.marginRight = "6px";

            // Adding event listener to checkbox to update checkedDays and highlight rows when changed
            checkbox.addEventListener("change", () => highlightRows("time-filter"));

            // Appending checkbox and text to label
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(time));

            // Appending label to times container
            timesContainer.appendChild(label);

            // Storing checkbox in timeCheckboxes object for later use and reference
            timeCheckboxes[time] = checkbox;
        });

    }


    // Function for updating matched count
    function updateMatchedCount() {
        const matchedCountSpan = document.getElementById("matchedCount");
        if (matchedCountSpan) {
            matchedCountSpan.textContent = matchingCourses.length;
        }
    }

    // Function for closing the plugin window
    function closeWindow() {
        // Getting the window element
        const win = document.getElementById("aua-courses-plugin-window");
        if (win) win.remove();

        // Creating notification element to notify that this is one time action and after
        // refreshing it will still be enabled.
        const notif = document.createElement("div");
        notif.innerHTML = "⚠ Plugin not disabled! Disable it manually from the <b>Extension</b> or from <b>Tampermonkey</b>.";
        notif.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%) translateY(-20px);
            background: #fff3cd;
            color: #856404;
            padding: 10px 20px;
            border-left: 5px solid #ffc107;
            border-radius: 5px;
            font-size: 14px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.15);
            opacity: 0;
            transition: opacity 0.4s ease, transform 0.4s ease;
            z-index: 9999;
            max-width: 90%;
            text-align: center;
            font-family: sans-serif;
        `;

        // Appending notification to body
        document.body.appendChild(notif);

        // Triggering animation
        requestAnimationFrame(() => {
            notif.style.opacity = "1";
            notif.style.transform = "translateX(-50%) translateY(0)";
        });

        // Removing notification after 4 seconds
        setTimeout(() => {
            notif.style.opacity = "0";
            notif.style.transform = "translateX(-50%) translateY(-20px)";
            notif.addEventListener("transitionend", () => notif.remove());
        }, 4000);
    }


    // Function for clearing all filters
    function clearFilters() {
        // Clear search input
        const searchInput = document.getElementById("searchInput");
        if (searchInput) {
            searchInput.value = "";
        }

        // Clear day checkboxes
        for (const code in dayCheckboxes) {
            dayCheckboxes[code].checked = false;
        }

        // Clear time checkboxes
        for (const time in timeCheckboxes) {
            timeCheckboxes[time].checked = false;
        }

        // Update checked days
        updateCheckedWeekdays();

        // Highlight rows again
        highlightRows();
    }


    // Start loading animation (which is AUA logo just rotating in the middle with blue border)
    function startLoadingAnimation() {

        // If it exists already, do not create another
        if (document.getElementById("centerLoader")) return;

        // Creating the main loader element
        const loader = document.createElement("div");
        loader.id = "centerLoader";
        loader.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 50px;
            height: 50px;
            border: 5px solid #e0e0e0;
            border-top: 5px solid #002147;
            border-radius: 50%;
            animation: spinLoader 1s linear infinite;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        `;

        // Creating the image element inside loader
        const img = document.createElement("img");
        img.src = "https://play-lh.googleusercontent.com/lPU7TDhLFw2IfDxV_lEFw-YGSXnN7SgR-ybL4hQsNneceUR3mNxcwKV4NdZuKBf1daU=w240-h480-rw";
        img.style.cssText = `
            width: 80%;
            height: 80%;
            border-radius: 50%;
        `;

        // Appending image to loader
        loader.appendChild(img);

        // Appending loader to body
        document.body.appendChild(loader);

        // Adding keyframes for spin animation if not already present
        if (!document.getElementById("centerLoaderKeyframes")) {
            const style = document.createElement("style");
            style.id = "centerLoaderKeyframes";
            style.textContent = `
                @keyframes spinLoader {
                    0% { transform: translate(-50%, -50%) rotate(0deg); }
                    100% { transform: translate(-50%, -50%) rotate(360deg); }
                }
            `;

            // Appending style to head
            document.head.appendChild(style);
        }
    }

    // Function that stops loading animation (by just removing the loader element)
    function stopLoadingAnimation() {
        // Defining loader element
        const loader = document.getElementById("centerLoader");

        // Removing loader if exists
        if (loader) loader.remove();
    }

    // Function for highlighting rows based on search and filters
    function highlightRows(calledBy = null) {
        console.log("I at least entered highlightRows");
        // Defining array for available times
        let availableTimes = [];

        // Clearing previous matching courses
        matchingCourses = [];



        // ----- Search Input -----

        // Getting as text
        const searchInputText = document
            .getElementById("searchInput")
            .value.toLowerCase();

        // Extracting keywords from search input
        const searchInputKeywords = searchInputText
            .split(" ")
            .filter((kw) => kw.trim() !== "");



        // Updating checked weekdays
        updateCheckedWeekdays();

        // Getting matching rows
        const rows = getRows();

        // Iterating through rows and courses
        rows.forEach((row, index) => {
            const course = courses[index];
            let searchMatches = true;

            //------Search matching------

            // Checking each keyword from search input to see if it is present
            for (const keyword of searchInputKeywords) {
                const classKeywords = [];

                // Collect all fields to search in
                for (const key in course) {
                    if (course.hasOwnProperty(key)) {
                        classKeywords.push(course[key].toLowerCase());
                    }
                }

                // Check if keyword is found in any field
                let foundInAnyField = classKeywords.some((field) =>
                    field.includes(keyword),
                );

                // If keyword not found in any field, mark searchMatches as false
                if (!foundInAnyField && searchInputKeywords.length > 0) {
                    searchMatches = false;
                }
            }



            //------Weekdays matching------

            // The variable that will decide weather daysMatch has happend
            let daysMatch = false;

            // If no weekdays are checked, consider it a match (because maybe user just ignored that filter)
            if (checkedDays.length === 0) {
                daysMatch = true; // If no days are checked, consider it a match
            } else {
                for (const day of checkedDays) {
                    // If includes at least one checked day, it's a match
                    if (course.times.includes(day)) {
                        daysMatch = true;
                        break;
                    }
                }
            }



            //------Times matching------

            // The variable that will decide weather timesMatch has happend
            let timesMatch = false;

            // Getting checked times as array from timeCheckboxes where are only checked ones
            const checkedTimes = Object.keys(timeCheckboxes).filter(
                (time) => timeCheckboxes[time].checked,
            );

            // If no times are checked, consider it a match (because maybe user just ignored that filter)
            if (checkedTimes.length === 0) {
                timesMatch = true; // If no times are checked, consider it a match
            } else {
                for (const time of checkedTimes) {
                    if (course.times.includes(time)) {
                        timesMatch = true;
                        break;
                    }
                }
            }



            // ----- Final Decision -----

            // I think its best to check if all three matches are true. Also if you think it would 
            // be useful you can add option to choose AND/OR logic between these three filters but idk,
            // it will make everything more complicated.
            let finalMatch = searchMatches && (daysMatch && timesMatch);

            // The actual logic if finalMatch has happened
            if (finalMatch) {

                // Highlighting row if any filter is active (because if no filter is active, all rows are matching)
                if (!(searchInputKeywords.length === 0 && checkedDays.length === 0 && checkedTimes.length === 0)) {
                    row.style.setProperty("background-color", "#ffff99", "important"); // Highlight color
                }
                else {
                    row.style.setProperty("background-color", "", "important"); // Reset color
                }

                // Showing row
                row.style.display = "";

                // Adding matching class and removing not-matching class
                row.classList.add("matching");
                row.classList.remove("not-matching");

                // Adding course to matchingCourses array
                matchingCourses.push(course);

                // Extracting available times from matching courses only if not called by time-filter
                // because if one time checkbox is clicked it will remove all others from available times
                if (calledBy !== "time-filter") {
                    const times = course.times.match(
                        /\b\d{1,2}:\d{2}(?:am|pm)-\d{1,2}:\d{2}(?:am|pm)\b/gi,
                    );
                    if (times !== null) {
                        times.forEach((time) => {
                            if (!availableTimes.includes(time)) {
                                availableTimes.push(time);
                            }
                        });
                    }
                }
            } else {
                // Resetting any highlight
                row.style.setProperty("background-color", "", "important"); // Reset color
                row.style.display = showOnly ? "none" : ""; // Hide if show only matching is active

                // Adding not-matching class and removing matching class
                row.classList.add("not-matching");
                row.classList.remove("matching");
            }
        });


        // Scrolling to nearest matching row only if called not by time-filter
        scrollToNearestMatching();

        // After performing search
        availableTimes.sort();

        // Parsing available times to checkboxes only if not called by time-filter 
        // because it will remove all unchecked ones
        if (calledBy !== "time-filter") {
            parseAvailableTimesToCheckboxes(availableTimes);
        }

        // Updating matched count
        updateMatchedCount();
    }

    // Initializing the plugin
    updateCheckedWeekdays();
    fetchCourses();
    createWindow();
    setupSearchInputEnterNavigation();

})();
