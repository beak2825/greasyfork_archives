// ==UserScript==
// @name         Canvas Grades Submission Dates
// @namespace    hacker09
// @version      1
// @description  Adds submission dates to the Canvas gradebook, allows sorting, and adds a copy button on the dates.
// @match        https://canvas.instructure.com/courses/*/gradebook
// @icon         https://du11hjcvx0uqb.cloudfront.net/br/dist/images/favicon-e10d657a73.ico
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/553379/Canvas%20Grades%20Submission%20Dates.user.js
// @updateURL https://update.greasyfork.org/scripts/553379/Canvas%20Grades%20Submission%20Dates.meta.js
// ==/UserScript==

(function() { //starts the userscript execution
  'use strict'; //enforces stricter parsing and error handling in JavaScript

  const studentDataCache = {}; //creates an object to cache submission data for each student
  const fetchingStudents = new Set(); //creates a set to track students whose data is currently being fetched
  const processedHeaders = new Set(); //creates a set to track assignment headers that have already been modified
  let assignmentHeadersCache = {}; //creates an object to cache assignment IDs and their corresponding names

  function renderDatesOnVisibleRows() { //defines a function to update the DOM with cached submission data
    if (Object.keys(assignmentHeadersCache).length === 0) { //checks if the assignment headers have not yet been cached
      document.querySelectorAll('.slick-header-column.assignment').forEach(header => { //iterates over each assignment header element in the gradebook
        const nameEl = header.querySelector('.assignment-name'); //finds the element containing the assignment's name
        const idMatch = header.id.match(/assignment_(\d+)/); //extracts the numerical ID of the assignment from the header's ID attribute
        if (nameEl && idMatch) assignmentHeadersCache[idMatch[1]] = nameEl.textContent.trim(); //stores the assignment name in the cache, keyed by its ID
      }); //completes the iteration over assignment headers
    } //ends the check for cached headers

    document.querySelectorAll('.slick-row').forEach(row => { //iterates over each student row currently rendered in the gradebook
      const studentId = getStudentId(row); //retrieves the unique ID for the student in the current row
      if (studentId && studentDataCache[studentId]) { //checks if a student ID was found and if their submission data is in the cache
        updateStudentCells(row, studentId); //calls the function to inject the submission dates into the student's grade cells
      } //ends the check for cached student data
    }); //completes the iteration over student rows
  } //ends the definition of the renderDatesOnVisibleRows function

  async function loadAllStudentData() { //defines an asynchronous function to fetch all student data at once
    const courseIdMatch = window.location.pathname.match(/\/courses\/(\d+)/); //extracts the course ID from the current page's URL
    if (!courseIdMatch) return; //exits the function if a course ID could not be found in the URL
    const courseId = courseIdMatch[1]; //stores the captured course ID from the URL

    const usersResponse = await fetch(`/api/v1/courses/${courseId}/users?per_page=200&include[]=enrollments`); //fetches the list of all users enrolled in the course from the Canvas API
    const users = await usersResponse.json(); //parses the JSON response from the API into a JavaScript object
    const students = users.filter(user => user.enrollments.some(e => e.type === 'StudentEnrollment')); //filters the list of users to include only those with a student enrollment type

    const fetchPromises = students.map(student => //creates an array of promises, one for each student, to fetch their individual grade pages
                                       fetch(`/courses/${courseId}/grades/${student.id}`) //starts fetching the grade page for a specific student
                                       .then(res => res.text()) //converts the response body to text
                                       .then(html => { //processes the resulting HTML content
      const doc = new DOMParser().parseFromString(html, "text/html"); //parses the HTML string into a DOM document
      const submissions = {}; //initializes an object to hold the submission dates for the student
      doc.querySelectorAll('tr.student_assignment').forEach(subRow => { //iterates over each assignment row within the student's grade table
        const nameEl = subRow.querySelector('th.title a'); //finds the element containing the assignment's name
        const dateEl = subRow.querySelector('td.submitted'); //finds the table cell containing the submission date
        if (nameEl && dateEl) { //checks if both the name and date elements were successfully found
          submissions[nameEl.textContent.trim()] = dateEl.textContent.trim(); //stores the submission date, keyed by the assignment name
        } //ends the check for name and date elements
      }); //completes the iteration over assignment rows
      studentDataCache[student.id] = submissions; //adds the collected submission data for the student to the main cache
    }) //completes the processing for a single student's grades page
                                      ); //completes the creation of the promise array

    await Promise.all(fetchPromises); //waits for all the individual student grade page fetches to complete
    renderDatesOnVisibleRows(); //calls the function to display the now-cached data on the visible gradebook rows
  } //ends the definition of the loadAllStudentData function

  function getStudentId(row) { //defines a function to extract a student's ID from a table row element
    const match = row.className.match(/student_(\d+)/); //uses a regular expression to find the student ID in the row's class name
    return match ? match[1] : null; //returns the captured ID, or null if no match was found
  } //ends the definition of the getStudentId function

  function updateStudentCells(row, studentId) { //defines a function to inject submission dates into a student's grade cells
    const submissions = studentDataCache[studentId]; //retrieves the submission data for the specified student from the cache
    if (!submissions) return; //exits the function if no submission data is found for the student

    row.querySelectorAll('.slick-cell.assignment').forEach(cell => { //iterates over each assignment cell in the student's row
      const idMatch = cell.className.match(/assignment_(\d+)/); //extracts the assignment ID from the cell's class name
      if (!idMatch) return; //skips to the next cell if no assignment ID is found

      const assignmentId = idMatch[1]; //stores the captured assignment ID
      const assignmentName = assignmentHeadersCache[assignmentId]; //looks up the assignment name in the cache using its ID
      const submissionDate = submissions[assignmentName]; //retrieves the specific submission date using the assignment name
      const gradeCellContent = cell.querySelector('.Grid__GradeCell__Content'); //finds the container for the grade within the cell

      if (!gradeCellContent || gradeCellContent.querySelector('.submission-date')) return; //skips the cell if it has no content area or if a date has already been added

      const gradeSpan = gradeCellContent.querySelector('span.Grade'); //finds the specific element that displays the grade score
      const formattedDate = formatDate(submissionDate); //formats the submission date for display

      if (gradeSpan && formattedDate) { //checks if both the grade element and a formatted date exist
        const dateEl = document.createElement('span'); //creates a new span element for the date
        const gradeText = gradeSpan.textContent.trim(); //gets the current grade text from the grade element
        const fullTextToCopy = `${formattedDate} | ${gradeText}`; //combines the date and grade into a single string for copying

        dateEl.className = 'submission-date'; //assigns a class name to the new date element
        dateEl.textContent = `${formattedDate} | `; //sets the text content of the date element
        dateEl.title = 'Click to copy date and grade'; //adds a tooltip to the date element
        dateEl.style.cssText = 'font-size: 11px; color: #555; font-weight: normal; margin-right: 4px; cursor: pointer;'; //applies inline CSS styles to the date element

        dateEl.addEventListener('click', (e) => { //adds a click event listener to the date element
          e.stopPropagation(); //prevents the click from bubbling up and triggering the grade editor
          e.preventDefault(); //prevents any default browser action for the click event
          navigator.clipboard.writeText(fullTextToCopy).then(() => { //copies the combined date and grade text to the clipboard
            const originalText = dateEl.textContent; //saves the original text of the date element
            dateEl.textContent = 'Copied!'; //changes the text to "Copied!" to provide feedback
            setTimeout(() => { dateEl.textContent = originalText; }, 1000); //reverts the text back to the original after 1 second
          }); //ends the clipboard write operation
        }); //ends the click event listener setup

        gradeCellContent.insertBefore(dateEl, gradeSpan); //inserts the new date element into the DOM before the grade element
      } //ends the check for the grade element and formatted date
    }); //completes the iteration over the student's assignment cells
  } //ends the definition of the updateStudentCells function

  function formatDate(dateStr) { //defines a function to format the submission date string
    if (!dateStr || dateStr.trim() === '–' || dateStr.trim() === '') return ''; //returns an empty string if the date is null, empty, or a dash
    return dateStr.trim().split(' at ')[0]; //splits the date string by " at " and returns only the date part
  } //ends the definition of the formatDate function

  function parseDate(dateStr) { //defines a function to parse a date string into a Date object
    if (!dateStr || !dateStr.trim() || dateStr.includes('No Submission')) return null; //returns null for invalid or empty date strings
    const fullDateStr = `${dateStr}, ${new Date().getFullYear()}`; //appends the current year to the date string for accurate parsing
    const date = new Date(fullDateStr); //creates a new Date object from the string
    return isNaN(date) ? null : date; //returns the Date object, or null if it's invalid
  } //ends the definition of the parseDate function

  function initialize() { //defines the main initialization function for the script
    const observer = new MutationObserver(() => { //creates a MutationObserver to watch for changes in the DOM
      clearTimeout(window.canvasGradebookTimeout); //clears any previously scheduled execution to debounce the function
      window.canvasGradebookTimeout = setTimeout(renderDatesOnVisibleRows, 250); //schedules the rendering function to run after a short delay
    }); //ends the observer's callback setup
    observer.observe(document.body, { childList: true, subtree: true }); //starts observing the entire document body for changes

    const interval = setInterval(() => { //creates a polling interval to check for the gradebook's existence
      if (document.querySelector('#gradebook-grid-wrapper')) { //checks if the main gradebook container is present in the DOM
        clearInterval(interval); //stops the polling once the gradebook is found
        loadAllStudentData(); //calls the function to begin fetching all student data
      } //ends the check for the gradebook container
    }, 500); //sets the polling interval to 500 milliseconds
    setTimeout(() => clearInterval(interval), 15000); //sets a timeout to stop polling after 15 seconds to prevent infinite loops
  } //ends the definition of the initialize function

  initialize(); //calls the initialization function to start the script
})(); //ends the userscript execution