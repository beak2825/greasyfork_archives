// ==UserScript==
// @name         Tot Batch Submission Tool (fixed)
// @namespace    tampermonkey.net/
// @version      0.73
// @description  Some controls to assist with coding ToT
// @author       David Elmkies (delmkies) // fixed by @NOWARATN
// @match        fclm-portal.amazon.com/employee/*
// @require      https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.js
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/555127/Tot%20Batch%20Submission%20Tool%20%28fixed%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555127/Tot%20Batch%20Submission%20Tool%20%28fixed%29.meta.js
// ==/UserScript==

//configure breaks (format: "01:00-01:30")
const break1 = "22:00-22:30";
const break2 = "02:00-02:30";
const break3 = "04:30-04:45";
const breaksEnabled = true;
window.globalThat = {};

const styles = `
    [v-cloak] { display: none; }
    .summary-section {
        margin-top: 10px;
        padding: 5px;
        border-top: 1px solid #ccc;
    }
    .message {
        color: #2f855a;
        margin: 5px 0;
        font-weight: bold;
        padding: 5px 10px;
        border-radius: 3px;
        background-color: #f0fff4;
        border: 1px solid #c6f6d5;
    }
    .message2 {
        color: #2a4365;
        margin: 5px 0;
        font-weight: bold;
        font-size: 14px;
        padding: 5px 10px;
        background-color: #ebf8ff;
        border-radius: 3px;
        border: 1px solid #bee3f8;
    }
`;





const styleElement = document.createElement('style');
styleElement.textContent = styles;
document.head.appendChild(styleElement);


function sublist(code, cb) {
    jediClient.getAllLaborFunctionsForLaborProcessId({
        ServiceName: 'FCLMJobEntryDomainInformationService',
        data: {
            laborProcessId: code
        },
        Method: 'GetAllLaborFunctionsForLaborProcessId',
        success: cb
    });
};

function submitTot(tots){
    var newProcess = window.vueInstance.selectedLaborProcess;
    var newFunction= window.vueInstance.selectedLaborFunction;
    var empId = document.getElementById("employeeId").value;
    var whId = document.getElementById("warehouseId").value;
    var startDate = document.getElementById("startDate").value;
    var startHour = document.getElementById("startHour").value;
    var startMinute = document.getElementById("startMinute").value;
    var endDate = document.getElementById("endDate").value;
    var endHour = document.getElementById("endHour").value;
    var endMinute = document.getElementById("endMinute").value;

    tots.forEach(function(tot){
        var enc = encodeURIComponent;
        var line = "startDate=" + enc(startDate) + "&startHour=" + enc(startHour) + "&startMinute=" + enc(startMinute) +
            "&endDate=" + enc(endDate) + "&endHour=" + enc(endHour) + "&endMinute=" + enc(endMinute) +
            "&employeeId=" + enc(empId) + "&warehouseId=" + enc(whId) + "&laborFuncStartTime=" + enc(tot[1]) + "&laborFuncEndTime=" + enc(tot[3]) +
            "&newLaborProcessId=" + enc(newProcess) + "&newLaborFunctionId=" + enc(newFunction);

        if(window.location.pathname.includes("ppa")){
            line = line.replace("warehouseId","oldWarehouseId");
            var loc = line.search("&newLaborProcessId");
            line = line.slice(0,loc)+"&warehouseId="+enc(whId)+line.slice(loc);
            loc = line.search("&newLaborFunctionId");
            line = line.slice(0,loc) + "&newJobRole=" + newFunction.replaceAll(" ", "+");
        }

        // Find the form element - updated selector
        var form = document.querySelector('form') || document;
        var actionUrl = form.action || window.location.href;

        $.ajax({
            url: actionUrl,
            type: 'POST',
            data: line,
            success: function(response){
                window.vueInstance.processResponse(response,tot[tot.length-1],newProcess,newFunction);
            }
        });
    });
};

function withinTimeSpan(query, spanStart, spanEnd){
    var q = query.split(":");
    var qHour = Number(q[0]);
    var qMin = Number(q[1]);
    for(var i = spanStart.getHours(); i <= spanEnd.getHours(); ){
        if( i == qHour){
            if( i == spanStart.getHours() && qMin < spanStart.getMinutes() ){
                return false;
            }
            if( i == spanEnd.getHours() && qMin > spanEnd.getMinutes()){
                return false;
            }
            return true;
        }
        if(i < 23) i++;
        else i = 0;
    }
    return false;
};

window.globalThat.sublist = sublist;
window.globalThat.submitTot = submitTot;

(function() {
    // Updated selector to find editable elements in the new structure
    var editables = document.querySelectorAll('.time-segment.editable');

    var editablesArray = [];
    var i;

    for(i = 0; i < editables.length; i++){
        // Check if parent has onclick with firePopup
        var parent = editables[i].parentNode;
        if(parent && parent.hasAttribute("onclick") &&
           parent.attributes.onclick.nodeValue.includes("firePopup")) {
            editablesArray.push(editables[i]);
        }
    }

    var parseFire = function(args) {
        return eval(
            args.replace('firePopup(', '[')
            .replace(');', ']')
            .replace(/\t/g, '')
            .replace(/\s/g,'')
        );
    };

    var totParams = editablesArray.map(ed => {
        var onclickValue = ed.parentNode.attributes.onclick.nodeValue;
        return parseFire(onclickValue);
    });

    window.globalThat.totParams = totParams;

    // Find or create content panel - updated to work with current structure
    var contentPanel = document.getElementById('content-panel') || document.body;
    var root = document.createElement('div');
    root.id='root';
    contentPanel.appendChild(root);

    window.vueInstance = new Vue({
        el: '#root',
        created() {
            console.log('Vue instance created');
            console.log('Initial totParams:', this.totParams);
            this.updateTotalDuration();
        },
        data: {
            totParams: totParams.map(params => {
                let newParams = [...params];
                newParams[6] = false; // explicitly set checkbox to false at index 6
                return newParams;
            }),
            processOptions: [],
            sublist: sublist,
            submitTot: function(tots) {
                console.log('Submitting tots:', tots);

                const currentProcess = this.selectedLaborProcess;
                const currentFunction = this.selectedLaborFunction;

                // Get form elements or use defaults
                const getElementValueOrDefault = (id, defaultValue) => {
                    const element = document.getElementById(id);
                    return element ? element.value : defaultValue;
                };

                const formData = {
                    empId: getElementValueOrDefault("employeeId", ""),
                    whId: getElementValueOrDefault("warehouseId", ""),
                    startDate: getElementValueOrDefault("startDate", ""),
                    startHour: getElementValueOrDefault("startHour", ""),
                    startMinute: getElementValueOrDefault("startMinute", ""),
                    endDate: getElementValueOrDefault("endDate", ""),
                    endHour: getElementValueOrDefault("endHour", ""),
                    endMinute: getElementValueOrDefault("endMinute", "")
                };

                tots.forEach((tot) => {
                    console.log('Processing tot:', tot);
                    var enc = encodeURIComponent;

                    // Pobierz poprzedni proces i rolę z danych tot
                    const previousProcess = tot[4] || '';
                    const previousRole = tot[5] || '';

                    var line = "startDate=" + enc(formData.startDate) +
                        "&startHour=" + enc(formData.startHour) +
                        "&startMinute=" + enc(formData.startMinute) +
                        "&endDate=" + enc(formData.endDate) +
                        "&endHour=" + enc(formData.endHour) +
                        "&endMinute=" + enc(formData.endMinute) +
                        "&employeeId=" + enc(formData.empId) +
                        "&warehouseId=" + enc(formData.whId) +
                        "&newLaborProcessId=" + enc(currentProcess) +
                        "&newLaborFunctionId=" + enc(currentFunction) +
                        "&laborFuncStartTime=" + enc(tot[1]) +
                        "&laborFuncEndTime=" + enc(tot[3]) +
                        "&previousLaborProcess=" + enc(previousProcess) +
                        "&previousJobRole=" + enc(previousRole.replace(/ /g, '+'));

                    if(window.location.pathname.includes("ppa")){
                        line = line.replace("warehouseId","oldWarehouseId");
                        var loc = line.search("&newLaborProcessId");
                        line = line.slice(0,loc)+"&warehouseId="+enc(formData.whId)+line.slice(loc);
                        loc = line.search("&newLaborFunctionId");
                        line = line.slice(0,loc) + "&newJobRole=" + currentFunction.replace(/ /g, '+');
                    }

                    console.log('Sending AJAX request with data:', line);

                    // Find the form element and its action URL
                    var form = document.querySelector('form');
                    var actionUrl = form ? form.action : window.location.href;

                    $.ajax({
                        url: actionUrl,
                        type: 'POST',
                        data: line,
                        success: (response) => {
                            console.log('Response received');
                            // Przekaż właściwy indeks
                            const index = tot.index !== undefined ? tot.index : this.totParams.indexOf(tot);
                            this.processResponse(response, index, currentProcess, currentFunction);
                        },

                        error: (xhr, status, error) => {
                            console.error('Error in AJAX request:', error);
                            this.message = "Error submitting: " + error;
                        }
                    });
                });
            },
            selectedLaborProcess: -1,
            functionOptions: [{laborFunctionId: -1, laborFunctionName: 'Choose Function'}],
            selectedLaborFunction: -1,
            message: "",
            message2: "",
            submittedlist: [],
            now: Date.now(),
            lastCodedProcess: "",
            lastCodedFunction: "",
            loadLastCoded: false,
        },
        mounted() {
            console.log('Vue mounted successfully');
            this.$nextTick(() => {
                console.log('Initial totParams:', JSON.stringify(this.totParams));
                this.updateTotalDuration();

                // Test reactivity
                setTimeout(() => {
                    console.log('Testing reactivity...');
                    if (this.totParams[0]) {
                        this.totParams[0][6] = !this.totParams[0][6];
                        console.log('Changed first checkbox to:', this.totParams[0][6]);
                    }
                }, 1000);
            });
        },
        watch: {
            selectedLaborProcess: {
                handler() {
                    this.newSubList();
                },
                immediate: true
            },
            selectedLaborFunction: {
                handler() {
                    // Zachowaj aktualny message2 przy zmianie funkcji
                    const currentMessage2 = this.message2;
                    this.$nextTick(() => {
                        this.message2 = currentMessage2;
                    });
                }
            },
            'totParams': {
                handler(newVal, oldVal) {
                    this.$nextTick(() => {
                        this.updateTotalDuration();
                    });
                },
                deep: true,
                immediate: true
            }
        },
        created: function(){
            console.log('Vue instance created');

            // Initialize process options - try multiple selectors
            var processSelect = document.getElementById('newLaborProcessId') ||
                document.querySelector('select[name="newLaborProcessId"]') ||
                document.querySelector('select');

            if(processSelect && processSelect.options) {
                this.processOptions = Array.from(processSelect.options).map(option => {
                    return {value: option.value, label: option.text};
                });
            } else {
                // Fallback - try to find process options in page data
                this.processOptions = [{value: -1, label: 'Choose Process'}];
            }

            var savedProcess = window.localStorage.getItem("totProcess");
            if(savedProcess != null){
                this.selectedLaborProcess = savedProcess;
            }

            var total = 0;
            var titleElements = document.getElementsByClassName("title");
            var title = titleElements.length > 0 ? titleElements[0] :
            document.querySelector('h1, h2, h3') ||
                document.querySelector('.ganttChart');

            if(title) {
                this.totParams.forEach(bar => (total += this.getDuration(bar[1],bar[3])));
                if(title.innerText) {
                    title.innerText = title.innerText + "("+Math.round(total)+"m)";
                }
            }

            this.$nextTick(() => {
                this.updateTotalDuration();
            });
        },
        computed: {
            displayMessage() {
                return this.message || '';
            },
            displayMessage2() {
                return this.message2 || '';
            }
        },
        methods: {
            formatTaskName: function(name) {
                return name || '';
            },

            safeSet: function(obj, index, value) {
                if (obj && typeof index !== 'undefined') {
                    this.$set(obj, index, value);
                }
            },
            formatDateTime: function(dateTimeStr) {
                if (!dateTimeStr || dateTimeStr.length === 0) return "(current)";

                // Zakładając format "MM/DD/YYYYhh:mm:ss"
                const date = dateTimeStr.substring(0, 10); // Wyciąga datę
                const time = dateTimeStr.substring(10); // Wyciąga czas

                return `${date} ${time}`; // Dodaje spację między datą a czasem
            },
            handleCheckboxChange: function(totRow, checked) {
                this.safeSet(this.totParams[totRow], 6, checked);
                this.$nextTick(() => {
                    this.updateTotalDuration();
                });
            },
            newSubList: function() {
                if(window.location.pathname.includes("ppaTimeDetails")){
                    if(typeof processes !== 'undefined') {
                        var selectedLabel = this.processOptions.filter(x => x.value == this.selectedLaborProcess)[0];
                        if(selectedLabel && processes[selectedLabel.label]) {
                            var funclist = processes[selectedLabel.label].attributes.job_role.sort();
                            this.functionOptions = [this.functionOptions[0]];
                            funclist.forEach(x => this.functionOptions.push({laborFunctionId: x,laborFunctionName: x}));
                            if(this.loadLastCoded){
                                var foundFunc = this.functionOptions.find(obj => obj.laborFunctionName === this.lastCodedFunction);
                                if(foundFunc) {
                                    this.selectedLaborFunction = foundFunc.laborFunctionId.toString();
                                }
                                this.loadLastCoded = false;
                            }
                        }
                    }
                } else {
                    this.seekFunctions(false);
                    return sublist(this.selectedLaborProcess, (result) => {
                        if(result && result.laborFunctions) {
                            this.functionOptions = result.laborFunctions.sort((a, b) => (a.laborFunctionName > b.laborFunctionName) ? 1 : -1 );
                            this.seekFunctions(true);
                        }
                    });
                }
            },

            updateTotalDuration: function() {
                var total = 0;
                this.totParams.forEach((bar, index) => {
                    // Sprawdzamy dokładny typ i wartość
                    const isChecked = bar[6] === true || bar[6] === 'true' || bar[6] === 1;
                    if (isChecked) {
                        const duration = this.getDuration(bar[1], bar[3]);
                        total += duration;
                    }
                });

                // Ustawiamy wiadomość bezpośrednio
                this.$set(this, 'message2', `Total selected: ${(Math.round(total*10)/10)} minutes`);
            },



            fireTots: function() {
                window.localStorage.setItem("totProcess", this.selectedLaborProcess);
                window.localStorage.setItem("totFunction", this.selectedLaborFunction);

                var totSend = this.totParams
                .map((tot, index) => ({...tot, index}))
                .filter(tot => tot[6] === true || tot[6] === 'true');

                console.log('Filtered tots to send:', totSend);

                if (this.selectedLaborProcess > 0 &&
                    (this.selectedLaborFunction.length == 0 ||
                     this.selectedLaborFunction > 0 ||
                     (window.location.pathname.includes("ppa") && this.selectedLaborFunction.length > 0))) {
                    this.submitTot(totSend);
                    this.message = "Submitting batch...";
                } else {
                    this.message = "Check process and function options before submitting!";
                }
            },

            loadLastCodedBar: function() {
                try {
                    // Znajdź wszystkie edytowalne segmenty
                    var editableSegments = Array.from(document.querySelectorAll('.time-segment.editable'));
                    console.log('Total editable segments:', editableSegments.length);

                    if (editableSegments.length > 0) {
                        // Usuń ostatni segment z listy (aktualny task)
                        var segments = editableSegments.slice(0, -1);
                        console.log('Segments without last one:', segments.length);

                        // Filtruj tylko edytowane segmenty
                        var editedSegments = segments.filter(segment =>
                                                             segment.closest('.function-seg.edited') !== null
                                                            );
                        console.log('Found edited segments (excluding last):', editedSegments.length);

                        if (editedSegments.length > 0) {
                            // Weź ostatni z edytowanych (ale nie aktualny task)
                            var targetSegment = editedSegments[editedSegments.length - 1];

                            if (targetSegment && targetSegment.parentNode) {
                                const onclickAttr = targetSegment.parentNode.getAttribute('onclick');

                                if (onclickAttr) {
                                    const params = this.parseFire(onclickAttr);
                                    console.log('Parsed params:', params);

                                    if (params && params.length >= 6) {
                                        const lcp = params[4]; // process name
                                        const lcf = params[5]; // function name

                                        console.log('Looking for process:', lcp, 'and function:', lcf);

                                        // Normalizuj nazwy (usuń spacje)
                                        const normalizedLcp = lcp.replace(/\s+/g, '');
                                        const normalizedLcf = lcf.replace(/\s+/g, '');

                                        // Znajdź proces ignorując spacje
                                        const processOption = this.processOptions.find(p =>
                                                                                       p.label.replace(/\s+/g, '') === normalizedLcp
                                                                                      );

                                        console.log('Found process option:', processOption);

                                        if (processOption) {
                                            this.selectedLaborProcess = processOption.value;

                                            setTimeout(() => {
                                                // Znajdź funkcję ignorując spacje
                                                const funcOption = this.functionOptions.find(f =>
                                                                                             f.laborFunctionName.replace(/\s+/g, '') === normalizedLcf
                                                                                            );

                                                if (funcOption) {
                                                    this.selectedLaborFunction = funcOption.laborFunctionId;
                                                    this.message = `Loaded previous task: ${processOption.label} - ${funcOption.laborFunctionName}`;
                                                } else {
                                                    this.message = "Found process but couldn't match function";
                                                    console.log('Available functions:', this.functionOptions.map(f => f.laborFunctionName));
                                                }
                                            }, 500);
                                        } else {
                                            this.message = "Couldn't match process name";
                                            console.log('Available processes:', this.processOptions.map(p => p.label));
                                        }
                                    }
                                }
                            }
                        } else {
                            this.message = "No previously edited tasks found (excluding current)";
                        }
                    } else {
                        this.message = "No editable tasks found";
                    }
                } catch (error) {
                    console.error('Error in loadLastCodedBar:', error);
                    this.message = "Error loading previous task";
                }
            },







            processResponse: function(response, totIndex, procId, funcId) {
                try {
                    console.log('Processing response with totIndex:', totIndex, 'procId:', procId, 'funcId:', funcId);

                    // Sprawdź czy totIndex jest prawidłowy
                    if (totIndex === undefined || !this.totParams[totIndex]) {
                        console.log('Invalid totIndex, trying to find matching tot...');
                        // Spróbuj znaleźć pasujący tot
                        totIndex = this.totParams.findIndex(tot => tot[6] === true || tot[6] === 'true');
                    }

                    // Jeśli nadal nie mamy prawidłowego indeksu, zakończ
                    if (totIndex === -1 || totIndex === undefined) {
                        console.error('Could not find valid totIndex');
                        this.message = "Task updated successfully, but couldn't update display";
                        return;
                    }

                    // Aktualizuj dane
                    var procOption = this.processOptions.find(x => x.value == procId);
                    var funcOption = this.functionOptions.find(x => x.laborFunctionId == Number(funcId));

                    if (procOption && funcOption) {
                        // Użyj Vue.set dla zagwarantowania reaktywności
                        this.$set(this.totParams[totIndex], 4, procOption.label);
                        this.$set(this.totParams[totIndex], 5, funcOption.laborFunctionName);

                        if (!this.submittedlist.includes(totIndex)) {
                            this.submittedlist.push(totIndex);
                        }

                        // Zachowaj informację o czasie
                        const currentMessage2 = this.message2;
                        this.$nextTick(() => {
                            this.message2 = currentMessage2;
                        });

                        // Spróbuj zamknąć dialog
                        setTimeout(() => {
                            const closeButton = document.querySelector('.ui-dialog-titlebar-close');
                            if (closeButton) {
                                closeButton.click();
                            }
                        }, 1000);

                        this.message = "Task updated successfully";

                        // Odśwież stronę po 2 sekundach (aby użytkownik zdążył zobaczyć komunikat)
                        setTimeout(() => {
                            window.location.reload();
                        }, 2000);
                    } else {
                        console.warn('Could not find matching process or function options');
                        this.message = "Task updated successfully";
                    }
                } catch (error) {
                    console.error('Error in processResponse:', error);
                    this.message = "Task updated successfully";

                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                }
            },




            seekFunctions: function(isDone) {
                if(!isDone){
                    this.functionOptions =[{laborFunctionId: -1, laborFunctionName: '-= Getting New Functions =-'}];
                    this.message = "Getting Functions...";
                } else {
                    this.message = "";
                    // Usuwamy czyszczenie message2
                    // this.message2 = "";
                    var savedFunction = null;

                    if(!this.loadLastCoded){
                        if(this.selectedLaborProcess == window.localStorage.getItem("totProcess")){
                            savedFunction = window.localStorage.getItem("totFunction");
                        }
                    } else {
                        var funcOption = this.functionOptions.find(obj => obj.laborFunctionName === this.lastCodedFunction);
                        if(funcOption) {
                            savedFunction = funcOption.laborFunctionId.toString();
                        }
                    }

                    if(savedFunction != null){
                        this.selectedLaborFunction = savedFunction;
                    }
                    this.loadLastCoded = false;
                }
            },

            getDuration: function(date1,date2) {
                date1 = new Date(date1);
                date2 = date2.length > 0 ? new Date(date2) : new Date(this.now);
                return Math.abs((date2 - date1)/60000);
            },

            breakIntersection: function(totStart,totEnd){
                if(!breaksEnabled){
                    return "";
                }

                var breaks = [break1.split('-'), break2.split('-'), break3.split('-')];
                totStart = new Date(totStart);
                totEnd = new Date(totEnd);
                var dayRollover = !(totStart.getDate() == totEnd.getDate() &&
                                    totStart.getMonth() == totEnd.getMonth() &&
                                    totStart.getYear() == totEnd.getYear());
                var barrange = [[totStart.getHours(),totStart.getMinutes()],[totEnd.getHours(),totEnd.getMinutes()]];

                var rangeDuration = function (timerange){
                    let h = timerange[1][0] - timerange[0][0];
                    let m = timerange[1][1] - timerange[0][1];
                    return h*60 + m;
                };

                for( var b of breaks){
                    var breakrange = [ b[0].split(':').map(x => Number(x)), b[1].split(':').map(x => Number(x))];
                    var newIntersect;

                    if(!dayRollover){
                        var min = ( breakrange[0][0]<barrange[0][0] || (breakrange[0][0] == barrange[0][0] && breakrange[0][1] < barrange[0][1]) ? breakrange : barrange);
                        var max = (min == breakrange ? barrange : breakrange);

                        if(min[1][0] < max[0][0] || (min[1][0] == max[0][0] && min[1][1] < max[0][1])){
                            newIntersect = null;
                        } else {
                            newIntersect = [[max[0][0],max[0][1]],(min[1][0] < max[1][0] || (min[1][0] == max[1][0] && min[1][1] < max[1][1])) ? min[1] : max[1]];
                        }

                        if(newIntersect){
                            if( rangeDuration(newIntersect) >= (rangeDuration(breakrange) - 5)){
                                return "Break" + b[0];
                            }
                        }
                    }
                }
                return "";
            },

            allTotDuration: function(){
                var total = 0;
                this.totParams.forEach(bar => (total += this.getDuration(bar[1],bar[3])));
                if(total>0){
                    return " " + (Math.round(total*10)/10).toString() + "m in " + this.totParams.length + " bars:";
                } else {
                    return " No editable time.";
                }
            },

            selectAllBars: function() {
                // Najpierw aktualizuj model danych
                this.totParams.forEach((tot, index) => {
                    this.$set(this.totParams[index], 6, true);
                });

                // Następnie wymuś aktualizację UI i przeliczenie sum
                this.$nextTick(() => {
                    this.updateTotalDuration();
                });
            },

            parseFire: function(args) {
                return eval(
                    args.replace('firePopup(', '[')
                    .replace(');', ']')
                    .replace(/\t/g, '')
                    .replace(/\s/g,'')
                );
            }
        },
        template: `
<div v-cloak>
    <div>
        <h3>Hi!{{allTotDuration()}}</h3>
        <table align="center">
        <tbody>
        <tr v-for="(tot, totRow) in totParams" :key="totRow">
        <td v-for="(attr, index) of tot" :key="index">
            <template v-if="index==6">
                <input type="checkbox"
                   :checked="Boolean(tot[index])"
                   @change="handleCheckboxChange(totRow, $event.target.checked)">
            </template>
            <template v-else-if="index > 6">
                <!-- Pomijamy wyświetlanie wartości po checkboxie -->
            </template>
            <template v-else-if="index==0 || index==2">
                {{formatDateTime(tot[index])}}
            </template>
            <template v-else-if="index==1">
                {{breakIntersection(tot[1],tot[3])}}
            </template>
            <template v-else-if="index==3">
                {{Math.round(getDuration(tot[1],tot[3])).toString()+"m"}}
            </template>
            <template v-else-if="index==4 || index==5">
                {{formatTaskName(attr)}}
            </template>
            <template v-else>
                {{ attr }}
            </template>
        </td>
        </tr>
        </tbody>
        </table>

            <div>
            <select v-model="selectedLaborProcess">
            <option v-for="process in processOptions" :value="process.value" :key="process.value">
            {{process.label}}
            </option>
            </select>
            <select v-model="selectedLaborFunction">
            <option v-for="func in functionOptions" :value="func.laborFunctionId" :key="func.laborFunctionId">
            {{func.laborFunctionName}}
            </option>
            </select>
            </div>
            <button @click="selectAllBars()">Select All</button>
            <button @click="loadLastCodedBar()">Prev. Task</button>
            <button @click="fireTots()">Submit</button>
       <div class="summary-section">
    <div :class="['message', {'success': submittedlist.length > 0}]" v-if="displayMessage">{{displayMessage}}</div>
    <div class="message2" v-if="displayMessage2">{{displayMessage2}}</div>
</div>
            </div>
            </div>`
    }).$mount(root);
})();