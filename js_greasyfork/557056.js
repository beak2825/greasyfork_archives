// ==UserScript==
// @name         ReadTheory: Proficiency Leaderboard
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Leaderboard for classes who practice with readtheory.org
// @author       https://greasyfork.org/en/users/567951-stuart-saddler
// @match        https://readtheory.org/app/teacher/reports
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557056/ReadTheory%3A%20Proficiency%20Leaderboard.user.js
// @updateURL https://update.greasyfork.org/scripts/557056/ReadTheory%3A%20Proficiency%20Leaderboard.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var GRADE_WEIGHT = 0.05;
    var DEFAULT_THRESHOLD = 7;

    var showThresholdOnly = false;
    var quizThreshold = DEFAULT_THRESHOLD;

    function init() {
        var btn = document.createElement('button');
        btn.innerHTML = '⚖️ True Proficiency Score';
        Object.assign(btn.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: '99999',
            padding: '12px 24px',
            backgroundColor: '#8e44ad',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            fontFamily: 'Segoe UI, sans-serif',
            transition: 'background 0.2s'
        });
        btn.onmouseover = function() {
            btn.style.backgroundColor = '#9b59b6';
        };
        btn.onmouseout = function() {
            btn.style.backgroundColor = '#8e44ad';
        };
        btn.onclick = runExtraction;
        document.body.appendChild(btn);
    }

    function runExtraction() {
        var containers = document.querySelectorAll('.highcharts-container');
        if (containers.length === 0) {
            alert("No charts found. Please scroll down to load ALL charts (Quizzes, Grade Level, Knowledge Points).");
            return;
        }

        var studentMap = {};
        var chartsFound = 0;

        containers.forEach(function(container) {
            var parent = container.parentNode;
            var vue = parent.__vue__;
            if (!vue || !vue.chart) return;

            var chart = vue.chart;
            var categories = chart.xAxis && chart.xAxis[0] ? chart.xAxis[0].categories : null;
            var seriesList = chart.series;
            if (!categories || !seriesList || seriesList.length === 0) return;

            var firstSeries = seriesList[0].name;
            var metric = null;
            if (firstSeries === "Above pretest level" || firstSeries === "Quizzes Taken") metric = 'quizzes';
            else if (firstSeries === "Current Grade Level") metric = 'grade';
            else if (firstSeries === "Total Knowledge points") metric = 'knowledge';
            if (!metric) return;
            chartsFound++;

            categories.forEach(function(name, i) {
                if (!studentMap[name]) studentMap[name] = {
                    name: name,
                    grade: 0,
                    knowledge: 0,
                    quizzes: 0
                };
                var val = 0;
                if (metric === 'quizzes') {
                    seriesList.forEach(function(s) {
                        var p = s.data[i];
                        var v = (typeof p === 'object') ?
                            ((p.y != null ? p.y : (p.options && p.options.y != null ? p.options.y : 0))) :
                            (p || 0);
                        val += v;
                    });
                } else {
                    var p = seriesList[0].data[i];
                    val = (typeof p === 'object') ?
                        ((p.y != null ? p.y : (p.options && p.options.y != null ? p.options.y : 0))) :
                        (p || 0);
                }
                if (metric === 'grade') studentMap[name].grade = val;
                if (metric === 'knowledge') studentMap[name].knowledge = val;
                if (metric === 'quizzes') studentMap[name].quizzes = val;
            });
        });

        if (chartsFound < 3) {
            alert("Some charts missing. Please scroll to 'Quizzes Taken', 'Grade Level', and 'Knowledge Points'.");
            return;
        }

        var results = Object.keys(studentMap)
            .map(function(name) {
                var s = studentMap[name];
                if (!(s.knowledge > 0 && s.quizzes > 0)) return null;
                var efficiency = s.knowledge / s.quizzes;
                var gradeBonus = Math.max(0, s.grade - 1);
                var multiplier = 1 + (gradeBonus * GRADE_WEIGHT);
                var finalScore = efficiency * multiplier;
                var out = Object.assign({}, s);
                out.efficiency = efficiency.toFixed(1);
                out.multStr = multiplier.toFixed(2) + 'x';
                out.adjustedScore = Math.round(finalScore * 10);
                return out;
            })
            .filter(function(s) {
                return s;
            })
            .sort(function(a, b) {
                return b.adjustedScore - a.adjustedScore;
            });

        showUI(results, quizThreshold, showThresholdOnly);
    }

    function showUI(data, quizThreshold, showThresholdOnly) {
        var id = 'rt-toggle-modal';
        if (document.getElementById(id)) document.getElementById(id).remove();

        var modal = document.createElement('div');
        modal.id = id;
        Object.assign(modal.style, {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '97%',
            maxWidth: '1000px',
            maxHeight: '95vh',
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
            zIndex: '100000',
            display: 'flex',
            flexDirection: 'column',
            fontFamily: 'Segoe UI, sans-serif'
        });

        var controls = '' +
            '<div style="display:flex; flex-wrap:wrap; gap:30px; align-items:center; justify-content:space-between; padding:16px 20px; background:#8e44ad; color:white; border-radius:12px 12px 0 0;">' +
            '<div>' +
            '<h2 style="margin:0 0 2px 0; font-size:20px;">⚖️ Proficiency Leaderboard</h2>' +
            '<div style="font-size:13px; opacity:0.9; margin-top:2px;">' +
            'Formula: <span style="background:rgba(0,0,0,0.2); padding:2px 6px; border-radius:4px;">(KP ÷ Quizzes) × (1 + (Grade-1) × ' + GRADE_WEIGHT + ')</span>' +
            '</div>' +
            '</div>' +
            '<div style="display:flex; gap:10px; align-items:center;">' +
            '<label style="font-size:14px; margin-right:8px;">' +
            '<input type="checkbox" id="rt-threshold-toggle"' + (showThresholdOnly ? ' checked' : '') + ' style="margin-right:5px;">' +
            'Only show students with ' +
            '</label>' +
            '<input type="number" min="1" max="99" value="' + quizThreshold + '" id="rt-threshold-input" style="width:55px; border-radius:4px; border:1px solid #aaa; padding:4px 6px; text-align:center;">' +
            '<span style="font-size:14px;">quizzes or more</span>' +
            '</div>' +
            '<button id="rt-close" style="cursor:pointer; background:none; border:none; color:white; font-size:28px;">&times;</button>' +
            '</div>';

        var qualified = data;
        var notQualified = [];
        if (showThresholdOnly) {
            qualified = data.filter(function(s) {
                return s.quizzes >= quizThreshold;
            });
            notQualified = data.filter(function(s) {
                return s.quizzes < quizThreshold;
            });
        }

        var tableRows = function(arr) {
            return arr.map(function(s, i) {
                return '' +
                    '<tr style="border-bottom:1px solid #f1f2f6; background:' + (i % 2 === 0 ? '#fff' : '#fcfcfc') + ';">' +
                    '<td style="padding:12px; text-align:center; color:#b2bec3; font-weight:bold;">' + (i + 1) + '</td>' +
                    '<td style="padding:12px; font-weight:600; color:#2d3436;">' + s.name + '</td>' +
                    '<td style="padding:12px;">' + s.grade.toFixed(2) + '</td>' +
                    '<td style="padding:12px; color:#636e72;">' + s.quizzes + '</td>' +
                    '<td style="padding:12px; color:#636e72;">' + s.knowledge + '</td>' +
                    '<td style="padding:12px; color:#0984e3; font-weight:500;">' + s.efficiency + '</td>' +
                    '<td style="padding:12px; color:#e17055; font-family:monospace;">' + s.multStr + '</td>' +
                    '<td style="padding:12px; font-weight:bold; color:#8e44ad;">' + s.adjustedScore + '</td>' +
                    '</tr>';
            }).join('');
        };

        var mainTable = '' +
            '<table style="width:100%; border-collapse:collapse; font-size:14px;">' +
            '<thead style="background:#f8f9fa; position:sticky; top:0; border-bottom:2px solid #dfe6e9;">' +
            '<tr>' +
            '<th style="padding:15px;">Rank</th>' +
            '<th style="padding:15px; text-align:left;">Student</th>' +
            '<th style="padding:15px; text-align:left;">Grade</th>' +
            '<th style="padding:15px; text-align:left;">Quiz</th>' +
            '<th style="padding:15px; text-align:left;">KP</th>' +
            '<th style="padding:15px; text-align:left; color:#0984e3;">Pts/Quiz</th>' +
            '<th style="padding:15px; text-align:left; color:#d35400;">Diff. Mult</th>' +
            '<th style="padding:15px; text-align:left; color:#8e44ad;">Score</th>' +
            '</tr>' +
            '</thead>' +
            '<tbody>' +
            tableRows(qualified) +
            '</tbody>' +
            '</table>';

        var notQualifiedTable = notQualified.length ? (
            '<div style="margin:20px 0 0 0; border-radius:10px; padding:12px; background:#f6ecfa; border:1px solid #e5d7fa;">' +
            '<div style="color:#8e44ad; font-size:16px; font-weight:bold; margin-bottom:10px;">' +
            'Practice More to Qualify (' + quizThreshold + '+ quizzes required)' +
            '</div>' +
            '<table style="width:100%; border-collapse:collapse; font-size:14px;">' +
            '<thead style="background:#f8f9fa;">' +
            '<tr>' +
            '<th style="padding:10px;">Rank</th>' +
            '<th style="padding:10px; text-align:left;">Student</th>' +
            '<th style="padding:10px; text-align:left;">Grade</th>' +
            '<th style="padding:10px; text-align:left;">Quiz</th>' +
            '<th style="padding:10px; text-align:left;">KP</th>' +
            '<th style="padding:10px; text-align:left; color:#0984e3;">Pts/Quiz</th>' +
            '<th style="padding:10px; text-align:left;">Mult</th>' +
            '<th style="padding:10px; text-align:left; color:#8e44ad;">Score</th>' +
            '</tr>' +
            '</thead>' +
            '<tbody>' +
            tableRows(notQualified) +
            '</tbody>' +
            '</table>' +
            '</div>'
        ) : '';

        var content = '' +
            '<div style="overflow-y:auto; flex-grow:1; padding:0 0 24px 0;">' +
            mainTable +
            notQualifiedTable +
            '</div>';

        var footer = '' +
            '<div style="padding:15px; background:#f8f9fa; border-top:1px solid #eee; text-align:right; border-radius:0 0 12px 12px;">' +
            '<button id="rt-dl-csv" style="padding:10px 20px; background:#00b894; color:white; border:none; border-radius:6px; cursor:pointer; font-weight:600; box-shadow:0 2px 5px rgba(0,0,0,0.1);">📥 Download CSV</button>' +
            '</div>';

        modal.innerHTML = controls + content + footer;
        document.body.appendChild(modal);

        document.getElementById('rt-dl-csv').onclick = function() {
            var rows = qualified.concat(notQualified);
            var csv = ['Rank,Name,Grade,Quizzes,Total KP,Pts Per Quiz,Multiplier,Proficiency Score']
                .concat(rows.map(function(s, i) {
                    return (i + 1) + ',"' + s.name + '",' + s.grade + ',' + s.quizzes + ',' + s.knowledge + ',' + s.efficiency + ',' + s.multStr + ',' + s.adjustedScore;
                }))
                .join('\n');
            var a = document.createElement('a');
            a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
            a.download = 'ReadTheory_Leaderboard.csv';
            a.click();
        };

        document.getElementById('rt-close').onclick = function() {
            modal.remove();
        };
        document.getElementById('rt-threshold-toggle').onchange = function(e) {
            showThresholdOnly = e.target.checked;
            showUI(data, quizThreshold, showThresholdOnly);
        };
        document.getElementById('rt-threshold-input').onchange = function(e) {
            var val = parseInt(e.target.value, 10);
            if (isNaN(val) || val < 1) val = 1;
            quizThreshold = val;
            showUI(data, quizThreshold, showThresholdOnly);
        };
    }

    setTimeout(init, 1500);

})();