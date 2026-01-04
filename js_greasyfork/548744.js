// ==UserScript==
// @name         WME PLN Core - Utils
// @namespace    https://greasyfork.org/en/users/mincho77
// @version      9.0.0
// @description  Módulo de utilidades y cálculos para WME Place Normalizer. No funciona por sí solo.
// @author       mincho77
// @license      MIT
// @grant        none
// ==/UserScript==


function calculateDistance(lat1, lon1, lat2, lon2) 
{
    const earthRadiusMeters = 6371e3;
    const lat1Rad = lat1 * Math.PI / 180;
    const lat2Rad = lat2 * Math.PI / 180;
    const deltaLatRad = (lat2 - lat1) * Math.PI / 180;
    const deltaLonRad = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(deltaLatRad / 2) * Math.sin(deltaLatRad / 2) + Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(deltaLonRad / 2) * Math.sin(deltaLonRad / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusMeters * c;
}

function calculateAreaMeters(shape) 
{
    if (!shape || !shape.geometry) 
        {
        return null;
    }
    try 
    {
        if (shape.geometry.type === 'Polygon') 
        {
            const coordinates = shape.geometry.coordinates[0];
            if (!coordinates || !Array.isArray(coordinates) || coordinates.length < 3) 
            {
                return null;
            }
            let area = 0;
            for (let i = 0; i < coordinates.length - 1; i++) {
                if (!Array.isArray(coordinates[i]) || !Array.isArray(coordinates[i+1]) ||
                    coordinates[i].length < 2 || coordinates[i+1].length < 2) {
                    return null;
                }
                area += coordinates[i][0] * coordinates[i+1][1];
                area -= coordinates[i][1] * coordinates[i+1][0];
            }
            area = Math.abs(area) / 2;
            const metersPerDegree = 111319.9;
            return area * Math.pow(metersPerDegree, 2);
        }
    } catch (error) {
        plnLog('warn', '[utils] Error calculating area:', error);
        return null;
    }
    return null;
}

function checkForOverlappingHours(venueSDKObject) {
    if (!venueSDKObject || !venueSDKObject.openingHours) {
        return false;
    }
    const openingHours = venueSDKObject.openingHours;
    let hasOverlap = false;
    const timeToMinutes = (timeStr) => {
        if (typeof timeStr !== 'string' || !timeStr.includes(':')) return 0;
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
    };
    for (const day in openingHours.days) {
        const dayRanges = openingHours.days[day];
        if (Array.isArray(dayRanges) && dayRanges.length > 1) {
            const intervals = dayRanges.map(range => ({
                start: timeToMinutes(range.from),
                end: timeToMinutes(range.to)
            }));
            for (let i = 0; i < intervals.length; i++) {
                for (let j = i + 1; j < intervals.length; j++) {
                    const interval1 = intervals[i];
                    const interval2 = intervals[j];
                    if (interval1.start < interval2.end && interval1.end > interval2.start) {
                        hasOverlap = true;
                        break;
                    }
                }
                if (hasOverlap) break;
            }
        }
        if (hasOverlap) break;
    }
    return hasOverlap;
}

function getCurrentDateString() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function getCurrentISOWeekString() {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    const week1 = new Date(date.getFullYear(), 0, 4);
    const weekNumber = 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
    return `${date.getFullYear()}-${String(weekNumber).padStart(2, '0')}`;
}

function getCurrentMonthString() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
}

function getLevenshteinDistance(a, b) {
    const matrix = Array.from({ length: b.length + 1 }, (_, i) => Array.from({ length: a.length + 1 }, (_, j) => (i === 0 ? j : (j === 0 ? i : 0))));
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(matrix[i - 1][j] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j - 1] + 1);
            }
        }
    }
    return matrix[b.length][a.length];
}
// Alias para compatibilidad con llamados antiguos
function calculateLevenshteinDistance(a, b){
    return getLevenshteinDistance(a, b);
}

/**
 * Escapa un literal para uso seguro en expresiones regulares.
 * @param {string} string
 * @returns {string}
 */
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Similaridad normalizada [0..1] basada en Levenshtein.
 * @param {string} word1
 * @param {string} word2
 * @returns {number}
 */
function calculateSimilarity(word1, word2) {
    const w1_lower = String(word1 ?? '').toLowerCase();
    const w2_lower = String(word2 ?? '').toLowerCase();
    if (w1_lower !== w2_lower && removeDiacritics(w1_lower) === removeDiacritics(w2_lower)) {
        return 0.99;
    }
    const distance = getLevenshteinDistance(w1_lower, w2_lower);
    const maxLen = Math.max(w1_lower.length, w2_lower.length);
    if (maxLen === 0) return 1;
    return 1 - distance / maxLen;
}

function isDateWithinRange(editDate, filterRange) {
    if (!(editDate instanceof Date) || isNaN(editDate)) {
        return false;
    }
    const now = new Date();
    let cutoffDate = new Date();
    switch (filterRange) {
        case "all": return true;
        case "6_months": cutoffDate.setMonth(now.getMonth() - 6); break;
        case "3_months": cutoffDate.setMonth(now.getMonth() - 3); break;
        case "1_month": cutoffDate.setMonth(now.getMonth() - 1); break;
        case "1_week": cutoffDate.setDate(now.getDate() - 7); break;
        case "1_day": cutoffDate.setDate(now.getDate() - 1); break;
        default: return true;
    }
    return editDate >= cutoffDate;
}

function removeDiacritics(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/**
 * Escapa caracteres XML reservados (&, <, >, ", ').
 * @param {string} s
 * @returns {string}
 */
function xmlEscape(s)
{
    return String(s ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}// xmlEscape

function plnCapitalizeStart(str) {
    try { return String(str || '').replace(/^\s*([a-záéíóúñ])/iu, (m, c) => m.replace(c, c.toUpperCase())); } catch { return str; }
}

function plnCapitalizeAfterHyphen(str) {
    try { return String(str || '').replace(/(\s-\s*)([a-záéíóúñ])/giu, (m, sep, ch) => sep + ch.toUpperCase()); } catch (_) { return String(str || ''); }
}

function plnTitleCaseEs(str) {
    try {
        const STOP = new Set(['de', 'del', 'la', 'las', 'el', 'los', 'y', 'e', 'o', 'u', 'un', 'una', 'unos', 'unas', 'a', 'en', 'con', 'tras', 'por', 'al', 'lo']);
        const isAllCaps = w => w.length > 1 && w === w.toUpperCase();
        const cap = w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
        let i = 0;
        return String(str || '').replace(/([\p{L}\p{M}][\p{L}\p{M}\.'’]*)/gu, (m) => {
            const w = m, lw = w.toLowerCase(), atStart = (i === 0); i += w.length;
            if (isAllCaps(w)) return w;
            if (STOP.has(lw) && !atStart) return lw;
            return cap(w);
        });
    } catch { return str; }
}
// Función que aplica capitalización después de todas las reglas de "swap"
function plnPostSwapCap(str) 
{
    let out = String(str || '');
    out = plnTitleCaseEs(out);
    out = plnCapitalizeStart(out);
    out = plnCapitalizeAfterHyphen(out);
    return out.trim();
}// plnPostSwapCap
// Función para obtener el ID base de un lugar (sin sub-ID)
function plnGetBaseVenueId(id) 
{
    return String(id).split('.')[0];
}// plnGetBaseVenueId