// ==UserScript==
// @name         DjinniAutomation
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      1.2
// @description  Djinni candidates automation
// @author       You
// @match        https://djinni.co/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at       document-idle
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/550762/DjinniAutomation.user.js
// @updateURL https://update.greasyfork.org/scripts/550762/DjinniAutomation.meta.js
// ==/UserScript==

const BASIC_URL = 'https://personin4-backend.cml.team/';

let TOKEN = localStorage.getItem('persona-token');
let projectId = null;
let vacancyId = null;

const IS_DARK_THEME = document.getElementsByTagName('body')[0].classList.contains('dark-theme');

class PersonaApp {
    static login(login, password) {
        const url = BASIC_URL + 'auth/login';
        return new Promise((resolve, reject) => {
            const xhr = new gmxhr();
            xhr.open('POST', url, true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Access-Control-Allow-Origin', BASIC_URL);
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    resolve(JSON.parse(xhr.responseText ?? "{\"status\": 404, \"message\": \"User not found with email: unknown\"}"));
                }
            };
            xhr.send(JSON.stringify({email: login, password: password}));
        });
    }

    static ping() {
        const url = BASIC_URL + 'auth/current-user';
        return new Promise((resolve) => {
            const xhr = new XMLHttpRequest();

            xhr.open('GET', url, true);
            xhr.setRequestHeader('Authorization', `Bearer ${TOKEN}`);
            xhr.setRequestHeader('Access-Control-Allow-Origin', BASIC_URL);
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    resolve(xhr.status === 200);
                }
            };
            xhr.send();
        });
    }

    static clipApplicant(submitRequest) {
        const url = BASIC_URL + 'djinni';
        return new Promise((resolve, reject) => {
            const xhr = new gmxhr();
            xhr.open('POST', url, true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Authorization', `Bearer ${TOKEN}`);
            xhr.setRequestHeader('Access-Control-Allow-Origin', BASIC_URL);
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        resolve(JSON.parse(xhr.responseText));
                    } else {
                        reject(new Error('Bad request'));
                    }
                }
            };
            xhr.send(JSON.stringify(submitRequest));
        });
    }

    static getExistingApplicant(submitRequest) {
        const url = BASIC_URL + 'djinni/existing-applicant';
        return new Promise((resolve, reject) => {
            const xhr = new gmxhr();
            xhr.open('POST', url, true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Authorization', `Bearer ${TOKEN}`);
            xhr.setRequestHeader('Access-Control-Allow-Origin', BASIC_URL);
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        resolve(JSON.parse(xhr.responseText));
                    } else {
                        resolve(null);
                    }
                }
            };
            xhr.send(JSON.stringify(submitRequest));
        });
    }

    static updateExistingApplicant(submitRequest) {
        const url = BASIC_URL + 'djinni/applicant';
        return new Promise((resolve, reject) => {
            const xhr = new gmxhr();
            xhr.open('PATCH', url, true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Authorization', `Bearer ${TOKEN}`);
            xhr.setRequestHeader('Access-Control-Allow-Origin', BASIC_URL);
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        resolve(JSON.parse(xhr.responseText));
                    } else {
                        reject(new Error('Bad request'));
                    }
                }
            };
            xhr.send(JSON.stringify(submitRequest));
        });
    }


    static getProjects() {
        const url = BASIC_URL + 'api/v2/projects';
        return new Promise((resolve, reject) => {
            const xhr = new gmxhr();
            xhr.open('GET', url, true);
            xhr.setRequestHeader('Authorization', `Bearer ${TOKEN}`);
            xhr.setRequestHeader('Access-Control-Allow-Origin', BASIC_URL);
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        resolve(JSON.parse(xhr.responseText));
                    } else {
                        reject(new Error('Unable to receive data'));
                    }
                }
            };
            xhr.send();
        });
    }

    static getHiringWorkflow() {
        const url = BASIC_URL + 'workflows?type=HIRING';
        return new Promise((resolve, reject) => {
            const xhr = new gmxhr();
            xhr.open('GET', url, true);
            xhr.setRequestHeader('Authorization', `Bearer ${TOKEN}`);
            xhr.setRequestHeader('Access-Control-Allow-Origin', BASIC_URL);
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        const hiringWorkflowId = JSON.parse(xhr.responseText ?? 'Could not get workflow id');
                        resolve(hiringWorkflowId);
                    } else {
                        reject(new Error('Unable to receive data'));
                    }
                }
            };
            xhr.send();
        });
    }

    static getHiringWorkflowColumns(workflowId) {
        const url = BASIC_URL + `workflows/${workflowId}/statuses/optimization`;
        return new Promise((resolve, reject) => {
            const xhr = new gmxhr();
            xhr.open('GET', url, true);
            xhr.setRequestHeader('Authorization', `Bearer ${TOKEN}`);
            xhr.setRequestHeader('Access-Control-Allow-Origin', BASIC_URL);
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        const hiringColumns = JSON.parse(xhr.responseText ?? 'Could not find any columns');
                        resolve(hiringColumns);
                    } else {
                        reject(new Error('Unable to receive data'));
                    }
                }
            };
            xhr.send();
        });
    }

    static moveApplicantToHiringWorkflow(workflowId, statusId, request) {
        const url = BASIC_URL + `api/v2/applicants/${workflowId}/workflows`;
        return new Promise((resolve, reject) => {
            const xhr = new gmxhr();
            xhr.open('PATCH', url, true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Authorization', `Bearer ${TOKEN}`);
            xhr.setRequestHeader('Access-Control-Allow-Origin', BASIC_URL);
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        const moveApplicantRequest = JSON.parse(xhr.responseText ?? 'Could not get data about moving applicant');
                        resolve(moveApplicantRequest);
                    } else {
                        reject(new Error('Unable to receive data'));
                    }
                }
            };
            xhr.send(JSON.stringify(request));
        });
    }
}

const colors = {
    BRAND: {
        color: '#428EDA',
        hover: '#73ABE4'
    },
    ERROR: {
        color: '#E94D50',
        hover: '#EF7B7E'
    },
    SUCCESS: {
        color: '#46C51A',
        hover: '#67D042'
    },
    DISABLED: {
        color: '#AAAAAA',
        hover: '#BBBBBB'
    }
}

const selectors = {
    header: '.border-bottom h3',
    name: '[itemprop="name"]',
    salary: '[itemprop=salary]',
    location: '[itemprop=location]',
    socialsContainer: '.list-unstyled.thread-info-list.small.mb-3 > li',
    socials: '.list-unstyled.thread-info-list.js-analytics-event > li',
    experience:'[itemprop=experience]'
}

class Component {
    static createModalContainer() {
        const modalContainer = document.createElement('div');
        modalContainer.id = 'myModal';
        Object.assign(modalContainer.style, {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'fixed',
            zIndex: '1000',
            left: '0',
            top: '0',
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(1px)',
        });
        modalContainer.addEventListener('click', (event) => {
            if (event.target === modalContainer) {
                modalContainer.remove();
                document.body.style.overflowY = 'auto';
            }
        });
        return modalContainer;
    }

    static createContentContainer() {
        const contentContainer = document.createElement('div');
        Object.assign(contentContainer.style, {
            backgroundColor: '#fff',
            color: '#000',
            padding: '30px',
            borderRadius: '20px',
            maxHeight: '90vh',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            width: '90%',
            overflowY: 'scroll',
            maxWidth: '450px',
            boxSizing: 'border-box',
            fontFamily: 'Arial, sans-serif',
            transition: 'all 0.3s ease-in-out',
        });

        document.body.style.overflowY = 'hidden';

        if (IS_DARK_THEME) {
            contentContainer.style.setProperty('background-color', '#2b3036', 'important');
            contentContainer.style.setProperty('color', '#fff', 'important');
        }

        return contentContainer;
    }

    static createInput(labelText, type, inputValue) {
        const inputContainer = document.createElement('div');
        inputContainer.style.marginBottom = '20px';

        const label = document.createElement('label');
        label.textContent = labelText;
        label.style.display = 'block';
        label.style.marginBottom = '6px';
        label.style.fontSize = '14px';

        const input = document.createElement('input');
        input.type = type;
        Object.assign(input.style, {
            padding: '10px',
            width: '100%',
            fontSize: '14px',
            border: '1px solid #ccc !important',
            borderRadius: '6px',
            boxSizing: 'border-box'
        });
        input.style.setProperty('background-color', IS_DARK_THEME ? '#2b3036' : '#fff', 'important');
        input.style.setProperty('color', IS_DARK_THEME ? '#fff' : '#2b3036', 'important');
        input.style.setProperty('border', '1px solid #ccc', 'important');
        input.value = inputValue;

        inputContainer.appendChild(label);
        inputContainer.appendChild(input);

        inputContainer.inputElement = input;

        return inputContainer;
    }

    static createButton(text, onClick, color) {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = text;

        button.normalColor = color.color;
        button.hoverColor = color.hover;

        Object.assign(button.style, {
            padding: '10px 20px',
            width: 'fit-content',
            minWidth: '100px',
            backgroundColor: button.normalColor,
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'background-color 0.3s ease',
        });

        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = button.hoverColor;
        });
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = button.normalColor;
        });

        button.addEventListener('click', onClick);
        return button;
    }

    static createButtonContainer() {
        const buttonContainer = document.createElement('div');
        Object.assign(buttonContainer.style, {
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '20px'
        });

        return buttonContainer;
    }

    static createSocialsContainer() {
        const buttonContainer = document.createElement('div');
        Object.assign(buttonContainer.style, {
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0 20px',
            width: '100%',
        });

        return buttonContainer;
    }

    static createForm(formId) {
        let form = document.createElement('form');
        form.id = formId;
        return form;
    }

    static createProjectsDropdown() {
        let projectsDropdown = document.createElement("select");
        projectsDropdown.id = "projectsDropdown";
        projectsDropdown.className = "custom-dropdown";
        projectsDropdown.name = "projects";

        Object.assign(projectsDropdown.style, {
            width: "400px",
            padding: "10px 14px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            fontSize: "15px",
            cursor: "pointer",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
            transition: "border-color 0.3s, box-shadow 0.3s",
        });

        let defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.textContent = "Select a project";
        defaultOption.selected = true;
        defaultOption.disabled = true;

        projectsDropdown.appendChild(defaultOption);

        return projectsDropdown;
    }

    static createVacanciesDropdown() {
        let vacanciesDropdown = document.createElement("select");
        vacanciesDropdown.id = "vacanciesDropdown";
        vacanciesDropdown.className = "custom-dropdown";
        vacanciesDropdown.name = "vacancies";

        Object.assign(vacanciesDropdown.style, {
            width: "400px",
            padding: "10px 14px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            fontSize: "15px",
            cursor: "pointer",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
            transition: "border-color 0.3s, box-shadow 0.3s",
        });

        return vacanciesDropdown;
    }

    static createDropdownsContainer() {
        const dropdownsContainer = document.createElement("div");
        dropdownsContainer.style.display = "flex";
        dropdownsContainer.style.flexDirection = "column";
        dropdownsContainer.style.gap = "12px";

        return dropdownsContainer;
    }

    static createPersonaLogo() {
        const svgWrapper = document.createElement('div');
        Object.assign(svgWrapper.style, {
            position: 'absolute',
            left: '50%',
            transform: 'translate(-50%, -20%)',
        })
        svgWrapper.innerHTML = `
            <svg width="80" height="80" viewBox="0 0 41 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.2771 24.233L21.0435 26.9994L20.1214 23.772L18.2771 24.233Z" fill="#428EDA"/>
                <path d="M16.4324 22.849L14.5881 21.4658L16.4324 19.6216V22.849Z" fill="#428EDA"/>
                <path d="M23.8097 17.7759L19.6602 18.698L21.0434 21.0033L23.8097 17.7759Z" fill="#428EDA"/>
                <path d="M15.9712 10.8621V8.0957L21.0429 9.4789L15.9712 10.8621Z" fill="#428EDA"/>
                <path d="M21.9651 13.6255L19.1987 15.0087L23.8094 15.9308L21.9651 13.6255Z" fill="#428EDA"/>
                <path d="M10.439 21.4648L11.3611 18.2373L12.2832 19.6205L10.439 21.4648Z" fill="#428EDA"/>
                <path d="M17.3547 29.7648L16.4326 25.6152L19.6601 28.3816L17.3547 29.7648Z" fill="#428EDA"/>
                <path d="M10.8993 26.5381L9.51611 27.9213L11.3604 27.4602L10.8993 26.5381Z" fill="#428EDA"/>
                <path d="M7.67213 21.0033L6.75 18.698L8.59426 17.7759L7.67213 21.0033Z" fill="#428EDA"/>
                <path d="M14.5879 9.9368L12.7437 8.55361L14.5879 7.17041V9.9368Z" fill="#428EDA"/>
                <path d="M13.6665 33.4524L16.4329 30.686L15.9718 33.9135L13.6665 33.4524Z" fill="#428EDA"/>
                <path d="M7.67163 12.7054L8.59376 9.93896L9.05483 12.7054H7.67163Z" fill="#428EDA"/>
                <path d="M14.9724 16.7511L13.2899 14.3694L16.0649 15.2652L14.9724 16.7511Z" fill="#428EDA"/>
                <path d="M25.6535 34.375C24.1166 30.8402 21.0429 23.6783 21.0429 23.3094L25.6535 16.8545L22.426 13.166L24.2703 9.47746L20.5818 6.25L27.9588 6.71107C28.7273 7.17213 30.5408 8.3709 31.6474 9.47746C32.7539 10.584 33.3379 12.3975 33.4916 13.166V15.4713L34.8748 16.8545L33.9527 18.2377V18.6988L34.4138 19.1598L33.9527 19.6209V21.4652L33.4916 21.9262V25.1537C33.1228 25.8914 30.5715 26.6906 29.342 26.998L25.6535 34.375Z" fill="#428EDA"/>
                <path d="M29.3426 12.2437H27.4983L30.2647 14.0879V13.1658L29.3426 12.2437Z" fill="${IS_DARK_THEME ? '#2b3036' : '#fff'}"/>
                <path d="M18 11.875L16.75 12.5L17.375 13.125L18 11.875Z" fill="#428EDA"/>
                <path d="M8.625 15L9.25 13.75L9.875 14.375L8.625 15Z" fill="#428EDA"/>
                <path d="M13 26.25L12.375 25L13.625 24.375L13 26.25Z" fill="#428EDA"/>
            </svg>
        `;
        return svgWrapper;
    }
}

function handleButtonDisable(button) {
    button.disabled = true;
    button.style.cursor = 'not-allowed';
    button.normalColor = colors.DISABLED.color;
    button.hoverColor = colors.DISABLED.hover;
    button.style.backgroundColor = button.normalColor;
}

function extractSeniority(inputString) {
    const levels = [
        { keyword: 'trainee', value: 'TRAINEE' },
        { keyword: 'strong junior', value: 'STRONG_JUNIOR' },
        { keyword: 'junior', value: 'JUNIOR' },
        { keyword: 'strong middle', value: 'STRONG_MIDDLE' },
        { keyword: 'middle', value: 'MIDDLE' },
        { keyword: 'senior', value: 'SENIOR' },
        { keyword: 'architect', value: 'ARCHITECT' },
    ];

    const lowerCaseInput = inputString.toLowerCase();
    for (const { keyword, value } of levels) {
        if (lowerCaseInput.includes(keyword)) {
            return value;
        }
    }

    return null;
}

function toExistingTechnology(inputString) {
    const technologies = [
        'Full Stack', '.NET', 'React', 'Sales', 'Front end', 'Frontend', 'Front-end', 'Backend', 'Java', 'PHP', 'Angular', 'JavaScript', 'Blockchain', 'Cryptocurrency',
        'React Native', 'Web3', 'Laravel', 'iOS', 'Python', 'Django', 'Web Development', 'Web UI', 'Widget', 'WhatsApp', 'Wix',
        'Rust', 'Flutter', 'ASP.NET', 'C#', 'Ruby', 'C++', 'UX & UI Design', 'Landing Page', 'Kotlin', 'AI Bot', 'AI Chatbot', 'AI Content Creation',
        'AJAX', 'Android', 'Apache Kafka', 'C ', 'ChatGPT', 'CI/CD', 'Dart', 'DevOps', 'DNS', 'Docker', 'Dynamo DB', 'FinTech', 'Firebase', 'Game',
        'German', 'Git', 'GitHub', 'GitLab', 'Gradle', 'Healthcare', 'Hibernate', 'Heroku', 'HR', 'HTML', ' ', 'Jakarta EE', 'Jest', 'JUnit', 'Kubernetes', 'Web Design',
        'LeadGen', 'Linux', 'MariaDB', 'Microservice', 'mobile', 'MongoDB', 'MySQL', 'NFT', 'NFC', 'Node.js', 'Oracle', 'Vue.js', 'VueJs', 'TypeScript',
        'PayTech', 'Perl', 'PostgreSQL', 'Product Design', 'Project Analysis', 'Project Management', 'QA Testing', 'RabbitMQ', 'Redis', 'Redux', 'SaaS', 'Scala',
        'Scrum', 'Selenium', 'Shopify', 'Spring Boot', 'Spring Framework', 'Spring Security', 'SQL', 'Swing', 'Tailwind UI', 'Telegram', 'TensorFlow', 'Terraform',
        'Test Automation', 'Test Management', 'Thymeleaf', 'Unity', 'Unit Testing', 'User Experience Design', 'User Interface Design', 'UX & UI', 'Visual Basic', 'Virtual Reality'
    ];

    const lowerCaseInput = inputString.toLowerCase();
    const foundTechnologies = [];

    const customMappings = [
        { keywords: ['project manager'], tech: 'Project Management' },
        { keywords: ['product manager'], tech: 'Project Management' },
        { keywords: ['qa'], tech: 'QA Testing' },
        { keywords: ['product designer'], tech: 'Product Design' },
        { keywords: ['ui/ux', 'ui ux'], tech: 'UX & UI Design' },
        { keywords: ['web developer'], tech: 'Web Development' },
        { keywords: ['business analyst', 'business analytics'], tech: 'Business Analysis' },
        { keywords: ['node'], tech: 'Node.js' },
        { keywords: ['next'], tech: 'Next.js' },
        { keywords: ['nest'], tech: 'Nest.js' },
        { keywords: ['back end', 'back-end'], tech: 'Backend' }
    ];

    for (const mapping of customMappings) {
        for (const keyword of mapping.keywords) {
            if (lowerCaseInput.includes(keyword)) {
                foundTechnologies.push(mapping.tech);
                break;
            }
        }
    }

    for (const tech of technologies) {
        const techLower = tech.toLowerCase();

        const regex = new RegExp(`\\b${techLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        if (regex.test(inputString)) {
            foundTechnologies.push(tech);
        }
    }

    return [...new Set(foundTechnologies)];
}

function prepareApplicantData() {
    const name = document.querySelector(selectors.name)?.textContent.trim() || null;
    const listItemsInfo = document.querySelectorAll(selectors.socialsContainer);
    const listItems = document.querySelectorAll(selectors.socials);
    const smallText = document.querySelectorAll('a[href*="/home/inbox?job"]')[0].innerHTML;

    let salary = null;
    let country = null;
    // let experience = null;

    listItemsInfo.forEach(item => {
        const salaryElement = item.querySelector(selectors.salary);
        const locationElement = item.querySelector(selectors.location);
        // const experienceElement = item.querySelector(selectors.experience); 
        // console.log(experienceElement, 'batumba');

        if (salaryElement) {
            salary = salaryElement.textContent.trim().replace('$', '');
        }
        if (locationElement) {
            country = locationElement.textContent.trim();
        }
        // if(experienceElement) {
        //     const text = experienceElement.textContent.trim();
        //     const match = text.match(/\d+(\.\d+)?/);
        //     const experience = match ? parseFloat(match[0]) : 0;
        //     console.log(experience);
        // }
    });

    const contactLinks = {
        resume: null,
        linkedin: null,
        djinni: null,
        email: null,
        skype: null,
        telegram: null,
        github: null,
        phone: null
    };

    listItems.forEach(item => {
        const link = item.querySelector('a');
        if (!link) return;

        const href = link.href;
        if (href.includes('www.linkedin.com')) contactLinks.linkedin = href;
        if (href.includes('mailto:')) contactLinks.email = href.replace('mailto:', '');
        if (href.includes('tel:')) contactLinks.phone = href.replace('tel:', '');
        if (item.querySelector('[itemprop=profile]')) {
            contactLinks.djinni = item.querySelector('[itemprop=profile]').textContent.trim();
        }
        if (item.querySelector('[itemprop=telegram]')) {
            contactLinks.telegram = item.querySelector('[itemprop=telegram]').textContent.trim();
        }
        if (item.querySelector('[itemprop=github]')) {
            contactLinks.github = item.querySelector('[itemprop=github]').textContent.trim();
        }
        if (document.querySelector('[itemprop=CV]')) {
            contactLinks.resume = document.querySelector('[itemprop=CV]')?.href.trim();
        }
    });

    const technology = toExistingTechnology(smallText);
    const seniority = extractSeniority(smallText);

    return {
        name,
        ...contactLinks,
        country,
        salary,
        technology,
        seniority
        //experience
    };
}

async function clipToPersona(existingApplicant) {
    let newApplicant = prepareApplicantData();
    const firstName = newApplicant.name?.split(' ')[0];
    const lastName = newApplicant.name?.split(' ')[1];
    console.log(newApplicant.resume);
    const request = {
        firstName,
        lastName,
        email: newApplicant.email,
        phone: newApplicant.phone,
        country: newApplicant.country,
        applicationSource: 'DJINNI',
        projectId,
        vacancyId,
        technologies: newApplicant.technology,
        cvLink: newApplicant.resume,
        salaryTo: newApplicant.salary,
        djinniLink: newApplicant.djinni,
        portfolioLink: newApplicant.portfolioInput,
        linkedinLink: newApplicant.linkedin,
        skype: newApplicant.skype,
        telegram: newApplicant.telegram,
        seniority: newApplicant.seniority
        // experience: newApplicant.experience
    }
    console.log("Request", request);
    showApplicantClipModal(request, existingApplicant);
}

async function showApplicantClipModal(newApplicant, existingApplicant) {
    let modalContainer = Component.createModalContainer();
    let contentContainer = Component.createContentContainer();
    let socialsContainer = Component.createSocialsContainer();
    let buttonContainer = Component.createButtonContainer();
    let personaLogo = Component.createPersonaLogo();
    let form = Component.createForm();

    contentContainer.style.maxWidth = '1000px';

    let fullNameInput = Component.createInput('Full name', 'text', `${newApplicant.firstName ?? ''} ${newApplicant.lastName ?? ''}`);
    let phoneInput = Component.createInput('Phone', 'text', newApplicant.phone ?? '');
    let countryInput = Component.createInput('Country', 'text', newApplicant.country ?? '');
    let emailInput = Component.createInput('Email', 'text', newApplicant.email ?? '');
    let linkedinInput = Component.createInput('Linkedin', 'text', newApplicant.linkedinLink ?? '');
    let portfolioInput = Component.createInput('Portfolio', 'text', newApplicant.portfolioLink ?? '');
    let douInput = Component.createInput('Dou', 'text', newApplicant.douLink ?? '');
    let skypeInput = Component.createInput('Skype', 'text', newApplicant.skype ?? '');
    let telegramInput = Component.createInput('Telegram', 'text', newApplicant.telegram ?? '');
    let djinniInput = Component.createInput('Djinni', 'text', newApplicant.djinniLink ?? '');
    // let experienceInput = Component.createInput('Experience', 'text', newApplicant.experience ?? '');
    let salaryToInput = Component.createInput('Salary', 'text', newApplicant.salaryTo ?? '');
    let technologiesInput = Component.createInput('Technologies', 'text', newApplicant.technologies ?? '');
    let cvLinkInput = Component.createInput('CV', 'text', newApplicant.cvLink ?? '');

    const clipButtonLabel = existingApplicant ? 'Update' : 'Clip';
    let clipButton = Component.createButton(clipButtonLabel, async () => {
        try {
            const savedApplicant = {
                firstName: fullNameInput.inputElement.value?.split(' ')[0],
                lastName: fullNameInput.inputElement.value?.split(' ')[1],
                phone: phoneInput.inputElement.value,
                projectId: localStorage.getItem('selectedProjectId'),
                vacancyId: localStorage.getItem('selectedVacancyId'),
                country: countryInput.inputElement.value,
                applicationSource: 'DJINNI',
                email: emailInput.inputElement.value,
                cvLink: cvLinkInput.inputElement.value,
                linkedinLink: linkedinInput.inputElement.value,
                portfolioLink: portfolioInput.inputElement.value,
                douLink: douInput.inputElement.value,
                skype: skypeInput.inputElement.value,
                telegram: telegramInput.inputElement.value,
                djinniLink: djinniInput.inputElement.value,
                salaryTo: salaryToInput.inputElement.value,
                technologies: technologiesInput.inputElement.value.split(','),
                seniority: newApplicant.seniority
                // experience: experienceInput.inputElement.value
            };

            let response;
            if (existingApplicant) {
                response = await PersonaApp.updateExistingApplicant(savedApplicant);
            } else {
                response = await PersonaApp.clipApplicant(savedApplicant);
            }

            console.log("Response", response);
            if (response.id) {
                clipButton.textContent = 'Success';
                clipButton.normalColor = colors.SUCCESS.color;
                clipButton.hoverColor = colors.SUCCESS.hover;
                clipButton.style.backgroundColor = clipButton.normalColor;
                const workflows = await PersonaApp.getHiringWorkflow();
                const workflowId = workflows.filter(w => w.name.includes("Hiring"))[0].id;

                const statuses = await PersonaApp.getHiringWorkflowColumns(workflowId);
                const backlogStatusId = statuses.filter(c => c.title.includes("Backlog"))[0].id;

                const applicantIds = [];
                applicantIds.push(response.id);

                const request = {
                    applicantIds: applicantIds,
                    dueDate: null,
                    statusId: backlogStatusId,
                    userIds: []
                }

                await PersonaApp.moveApplicantToHiringWorkflow(workflowId, backlogStatusId, request);
                setTimeout(function () {
                    modalContainer.style.display = 'none';
                }, 2000);
            }
        } catch (e) {
            clipButton.textContent = 'Error';
            clipButton.normalColor = colors.ERROR.color;
            clipButton.hoverColor = colors.ERROR.hover;
            clipButton.style.backgroundColor = clipButton.normalColor;
            console.error(e);
        }
    }, colors.BRAND);

    console.log("1st button", clipButton);

    // Djinni removed cloudfront firewall, no need to validate
    function validateCVLink(value) {
        return (
            value === '' ||
            value.includes('https://cv.djinni.co/') ||
            value.includes('cloudfront.net')
        );
    }

    function updateClipButtonState() {
        const cvLinkValue = cvLinkInput.inputElement.value.trim();
        const isValid = validateCVLink(cvLinkValue);

        clipButton.disabled = !isValid;
        cvLinkInput.inputElement.style.setProperty(
            'border',
            `1px solid ${isValid ? '#ccc' : colors.ERROR.color}`,
            'important'
          );
    }

    // cvLinkInput.inputElement.addEventListener('input', updateClipButtonState);
    // updateClipButtonState();

    buttonContainer.style.justifyContent = 'flex-end';
    buttonContainer.appendChild(clipButton);
    buttonContainer.appendChild(personaLogo);

    socialsContainer.appendChild(phoneInput)
    socialsContainer.appendChild(emailInput)
    socialsContainer.appendChild(linkedinInput)
    socialsContainer.appendChild(douInput)
    socialsContainer.appendChild(skypeInput)
    socialsContainer.appendChild(portfolioInput)
    socialsContainer.appendChild(telegramInput)
    socialsContainer.appendChild(djinniInput)
    socialsContainer.appendChild(countryInput)

    form.appendChild(fullNameInput);
    form.appendChild(socialsContainer);
    form.appendChild(salaryToInput);
    form.appendChild(technologiesInput);
    form.appendChild(cvLinkInput);
    form.appendChild(buttonContainer)
    contentContainer.appendChild(form);
    modalContainer.appendChild(contentContainer);
    document.body.appendChild(modalContainer);

}

async function addClipButton() {
    const buttonContainer = Component.createButtonContainer();
    buttonContainer.style.margin = '16px 0';
    buttonContainer.id = 'persona-clip-container';

    const isAuthenticated = await PersonaApp.ping();

    const signButton = createSignButton(isAuthenticated);

    if (isAuthenticated) {
        const clipButton = await createClipButton();
        clipButton.id = 'persona-clip-btn';
        handleButtonDisable(clipButton);
        buttonContainer.appendChild(clipButton);
    }

    buttonContainer.appendChild(signButton);

    const header = document.querySelector(selectors.header);
    header.after(buttonContainer);
}

function createSignButton(isAuthenticated) {
    const label = isAuthenticated ? 'Logout' : 'Login';
    const color = isAuthenticated ? colors.ERROR : colors.BRAND;

    const signButton = Component.createButton(label, async () => {
        try {
            if (isAuthenticated) {
                localStorage.removeItem('persona-token');
                location.reload();
            } else {
                await showPersonaAuthenticationModal();
            }
        } catch (e) {
            alert("Something went wrong: " + e.message);
        }
    }, color);

    return signButton;
}

async function createClipButton() {
    const applicantData = prepareApplicantData();
    const request = buildApplicantRequest(applicantData);

    const existingApplicant = await PersonaApp.getExistingApplicant(request);
    const label = existingApplicant ? 'Update Applicant' : 'Clip Applicant';

    return Component.createButton(label, async () => {
        try {
            await clipToPersona(existingApplicant);
        } catch (e) {
            alert("Something went wrong: " + e.message);
        }
    }, colors.BRAND);
}

function buildApplicantRequest(data) {
    const [firstName, lastName = ''] = (data.name || '').split(' ');
    return {
        firstName,
        lastName,
        email: data.email,
        phone: data.phone,
        country: data.country,
        applicationSource: 'DJINNI',
        projectId: data.projectId,
        vacancyId: data.vacancyId,
        technologies: data.technology,
        cvLink: data.cvLink,
        salaryTo: data.salaryTo,
        djinniLink: data.djinniLink,
        portfolioLink: data.portfolioLink,
        linkedinLink: data.linkedinLink,
        skype: data.skype,
        telegram: data.telegram,
        seniority: data.seniority,
    };
}

async function getProjects() {
    const projectsResponse = await PersonaApp.getProjects();

    const projects = projectsResponse.projects.map(project => {
        return {
            ...project,
            vacancies: project.vacancies.filter(vacancy => vacancy.isActive)
        };
    });
    return projects;
}

async function addDropdownWithProjects() {
    const projects = await getProjects();

    let projectsDropdown = Component.createProjectsDropdown();
    let vacanciesDropdown = Component.createVacanciesDropdown();
    let container = Component.createDropdownsContainer();
    container.appendChild(projectsDropdown);
    container.appendChild(vacanciesDropdown);

    projectVacancyAction(projects, projectsDropdown, vacanciesDropdown);

    projectsDropdown.dispatchEvent(new Event('change'));

    document.querySelector('#persona-clip-container').after(container);
}

function projectVacancyAction(projects, projectsDropdown, vacanciesDropdown) {
    projects.forEach(project => {
        let option = document.createElement("option");
        option.value = project.id;
        option.textContent = project.title;
        projectsDropdown.appendChild(option);
    });

    projectsDropdown.addEventListener('change', async function () {
        projectId = projectsDropdown.value;
        localStorage.removeItem("selectedVacancyId");
        localStorage.setItem('selectedProjectId', projectId);

        vacanciesDropdown.innerHTML = "";
        let defaultVacancyOption = document.createElement("option");
        defaultVacancyOption.value = "";
        defaultVacancyOption.textContent = "Select a vacancy";
        vacanciesDropdown.appendChild(defaultVacancyOption);
        vacanciesDropdown.disabled = true;
        vacanciesDropdown.style.cursor = 'not-allowed';

        const selectedProject = projects.find(project => project.id.toString() === projectId);
        if (selectedProject && selectedProject.vacancies) {
            selectedProject.vacancies.forEach(vacancy => {
                let option = document.createElement("option");
                option.value = vacancy.id;
                option.textContent = vacancy.title;
                vacanciesDropdown.appendChild(option);
            });

            vacanciesDropdown.disabled = false;
            vacanciesDropdown.style.cursor = 'pointer';

            let savedVacancyId = localStorage.getItem('selectedVacancyId');
            if (savedVacancyId) {
                vacancyId = savedVacancyId;
                vacanciesDropdown.value = savedVacancyId;
            }
        }

        updateButtonState();
    });

    vacanciesDropdown.addEventListener('change', function () {
        vacancyId = vacanciesDropdown.value;
        localStorage.setItem('selectedVacancyId', vacancyId);
        updateButtonState();
    });

    function updateButtonState() {
        const clipBtn = document.getElementById('persona-clip-btn');

        console.log("2nd btn", clipBtn);

        const isVacancySelected = vacancyId != null && vacancyId !== '' && vacanciesDropdown.title !== 'Select a vacancy';
        if (isVacancySelected) {
            updateButton(clipBtn, isVacancySelected)
        }
    }

    function updateButton(button, isValid) {
        button.disabled = !isValid;
        button.style.cursor = isValid ? 'pointer' : 'not-allowed';
        button.normalColor = isValid ? colors.BRAND.color : colors.DISABLED.color;
        button.hoverColor = isValid ? colors.BRAND.hover : colors.DISABLED.hover;
        button.style.backgroundColor = button.normalColor;
    }
}

async function showPersonaAuthenticationModal() {
    function createSuccessMessage() {
        let successMessage = document.createElement('div');
        successMessage.textContent = 'You have successfully logged in!';
        successMessage.style.backgroundColor = '#8bc34a';
        successMessage.style.color = '#fff';
        successMessage.style.padding = '10px';
        successMessage.style.borderRadius = '4px';
        successMessage.style.marginTop = '70px';
        return successMessage;
    }

    function createBadCredentialsMessage() {
        let badCredentialsMessage = document.createElement('div');
        badCredentialsMessage.textContent = 'Wrong login or password';
        badCredentialsMessage.style.backgroundColor = '#9b0a0a';
        badCredentialsMessage.style.color = '#fff';
        badCredentialsMessage.style.padding = '10px';
        badCredentialsMessage.style.borderRadius = '4px';
        badCredentialsMessage.style.marginTop = '15px';
        return badCredentialsMessage;
    }

    let personaLogo = Component.createPersonaLogo();
    let modalContainer = Component.createModalContainer();
    let contentContainer = Component.createContentContainer();
    let buttonContainer = Component.createButtonContainer();
    let successMessage = createSuccessMessage();
    let badCredentialsMessage = createBadCredentialsMessage();

    let loginInput = Component.createInput('Login:', 'text', '');
    let passwordInput = Component.createInput('Password:', 'password', '');

    let loginButton = Component.createButton('Login', async function () {
        const response = await PersonaApp.login(loginInput.querySelector('input').value, passwordInput.querySelector('input').value)

        function showSuccessMessage() {
            loginInput.style.display = 'none';
            passwordInput.style.display = 'none';
            loginButton.style.display = 'none';
            cancelButton.style.display = 'none';
            badCredentialsMessage.style.display = 'none';
            contentContainer.appendChild(successMessage);
            successMessage.style.display = 'block';
            setTimeout(function () {
                successMessage.style.display = 'none';
                modalContainer.style.display = 'none';
                document.body.style.overflowY = 'auto';
            }, 2000);
        }

        function showBadCredentialsMessage() {
            contentContainer.appendChild(badCredentialsMessage);
            badCredentialsMessage.style.display = 'block';
        }

        if (!response || response.code === 404 || response.code === 400) {
            showBadCredentialsMessage();
        } else {
            localStorage.setItem('persona-token', response.accessToken);
            TOKEN = response.accessToken;
            showSuccessMessage();
        }
    }, colors.BRAND);

    let cancelButton = Component.createButton('Cancel', function () {
        modalContainer.style.display = 'none';
    }, colors.ERROR);

    contentContainer.appendChild(loginInput);
    contentContainer.appendChild(passwordInput);
    buttonContainer.appendChild(cancelButton);
    buttonContainer.appendChild(personaLogo);
    buttonContainer.appendChild(loginButton);
    contentContainer.appendChild(buttonContainer);

    modalContainer.appendChild(contentContainer);
    document.body.appendChild(modalContainer);
}

async function handleAuthentication() {
    let isAuthenticated = await PersonaApp.ping();
    if (!isAuthenticated) {
        if (localStorage.getItem('persona-token')) localStorage.removeItem('persona-token');
        await showPersonaAuthenticationModal();
    }
}

async function init() {
    const loadingText = Component.createButton('Loading...', null, colors.BRAND);
    document.querySelector(selectors.header).after(loadingText);

    try {
        await handleAuthentication();
        await addClipButton();
        await addDropdownWithProjects();
    } finally {
        loadingText.remove();
    }
}


(async () => {
    await init();
})();

// https://github.com/damoclark/gmxhr

/**
 * xmlHttpRequest API wrapper for GM_xmlhttpRequest
 *
 * @returns {gmxhr} An instance with a compatible API to xmlHttpRequest
 */
function gmxhr() {
    this.type = null;
    this.url = null;
    this.async = null;
    this.username = null;
    this.password = null;
    this.status = null;
    this.headers = {};
    this.readyState = null;
}

gmxhr.prototype.abort = function () {
    this.readyState = 0;
};

gmxhr.prototype.getAllResponseHeaders = function (name) {
    if (this.readyState != 4) return "";
    return this.responseHeaders;
};

gmxhr.prototype.getResponseHeader = function (header) {
    var value = null;
    if (this.responseHeaders) {
        var regex = new RegExp("^" + header + ": (.*)$", "igm");
        var match = regex.exec(this.responseHeaders);
        var result = [];
        while (match != null) {
            result.push(match[1]);
            match = regex.exec(this.responseHeaders);
        }
        if (result.length > 0) {
            value = result.join(", ");
        }
    }
    return value;
};

gmxhr.prototype.open = function (type, url, async, username, password) {
    this.type = type ? type : null;
    this.url = url ? url : null;
    this.async = async ? async : null;
    this.username = username ? username : null;
    this.password = password ? password : null;
    this.readyState = 1;
};

gmxhr.prototype.setRequestHeader = function (name, value) {
    this.headers[name] = value;
};

gmxhr.prototype.send = function (data) { // not change
    this.data = data;
    const that = this;

    // Use standard XMLHttpRequest if GM.xmlHttpRequest is not available
    const agent = typeof GM.xmlHttpRequest !== "undefined" ? GM.xmlHttpRequest : XMLHttpRequest;


    if (typeof agent !== "function") {
        console.error("XMLHttpRequest is not available. Unable to make the request.");
        return;
    }

    const xhr = new agent();

    xhr.open(this.type, this.url, true);

    // Set headers
    for (const header in this.headers) {
        if (this.headers.hasOwnProperty(header)) {
            xhr.setRequestHeader(header, this.headers[header]);
        }
    }

    xhr.onload = function () {
        that.readyState = xhr.readyState;
        that.responseHeaders = xhr.getAllResponseHeaders();
        that.finalUrl = xhr.responseURL;
        that.status = xhr.status;
        that.statusText = xhr.statusText;
        that.response = xhr.response;
        that.responseText = xhr.responseText;

        that.onreadystatechange();
        that.onload();
    };

    xhr.onerror = function () {
        that.readyState = xhr.readyState;
        that.responseHeaders = xhr.getAllResponseHeaders();
        that.finalUrl = xhr.responseURL;
        that.status = xhr.status;
        that.statusText = xhr.statusText;
        that.response = xhr.response;
        that.responseText = xhr.responseText;

        that.onreadystatechange();
    };

    xhr.send(this.data);
};
