// ==UserScript==
// @name         getRelativeWeekday
// @namespace    https://github.com/nate-kean/
// @version      2026.1.8
// @description  Library for getting dates in the weeks around another date
// @author       Nate Kean
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// ==/UserScript==

// @ts-check

const Day = Object.freeze({
	SUNDAY: 0,
	MONDAY: 1,
	TUESDAY: 2,
	WEDNESDAY: 3,
	THURSDAY: 4,
	FRIDAY: 5,
	SATURDAY: 6,
});
/**
 * @typedef {typeof Day[keyof typeof Day]} DayT
 */

/**
 * NEXT: The next occurrence (always in the future)
 * LAST: The last occurrence (always in the past)
 * THIS: The nearest occurrence in the current week (Mon-Sun)
 */
const DateDir = Object.freeze({
	LAST: -1,
	THIS: 0,
	NEXT: 1,
});
/**
 * @typedef {typeof DateDir[keyof typeof DateDir]} DateDirT
 */


/**
 * Get a relative weekday from a target date.
 *
 * By Claude Sonnet 4.5:
 * https://claude.ai/public/artifacts/d666c5fe-6e91-4186-a46f-ae4eb046636e
 *
 * Manually ported to JavaScript because I was using this for a Python project
 * before
 *
 * @param {Date} targetDate Date to calculate from
 * @param {DayT} weekday
 * @param {DateDirT} direction
 * @param {boolean} includeToday whether to include targetDate if it matches weekday
 * @returns {Date}
 *
 * @example
 * // returns Sun Jan 12 2025 00:00:00
 * const target = new Date("01/15/2025");  // Wednesday
 * getRelativeWeekday(target, DateDir.LAST, Day.SUNDAY);
 * @example
 * // returns Thu Jan 16 2025 00:00:00
 * getRelativeWeekday(target, DateDir.THIS, Day.THURSDAY);
 * @example
 * // returns Thu Jan 23 2025 00:00:00
 * getRelativeWeekday(target, DateDir.NEXT, Day.THURSDAY);
*/
function getRelativeWeekday(
	targetDate,
	direction,
	weekday,
	includeToday = false,
) {
	const currentWeekday = targetDate.getDay();
	const result = new Date(targetDate);

	switch (direction) {
		case DateDir.LAST: {
			// Calculate days back to the target weekday
			let daysForward = (currentWeekday - weekday) % 7;  // Zero or negative
			if (daysForward === 0 && !includeToday) {
				// If this would make the result land on today, make it a week
				// ago instead
				daysForward = 7;
			}
			result.setDate(result.getDate() - daysForward);
			return result;
		}

		case DateDir.THIS: {
			// Find the date within the current week (Monday to Sunday)
			// Current week starts on the Monday of targetDate's week
			let daysForward = weekday - currentWeekday;  // Zero or positive
			if (daysForward === 0 && !includeToday) {
				// If this would make the result land on today, make it a week
				// from now instead
				daysForward = 7;
			}
			result.setDate(result.getDate() + daysForward);
			return result;
		}

		case DateDir.NEXT: {
			// Calculate days forward to the target weekday
			let daysForward = (weekday - currentWeekday) % 7;  // Zero or positive
			daysForward += 7;
			result.setDate(result.getDate() + daysForward);
			return result;
		}
	}
}
