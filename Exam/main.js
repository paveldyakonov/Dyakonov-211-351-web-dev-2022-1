const url = "http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/";
const apiKey = "c67f2277-7aed-4821-a074-2fc510e2aae2";

// const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
// const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

console.log(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
function clickMainObject(event) {
    let mainObject = document.querySelector(".btn-main-object");
    mainObject.textContent = event.target.textContent;
}

function createTooltipTh(data) {                                               //create tooltip for th
    let desc = document.createElement("th");
    desc.setAttribute("data-bs-toggle", "tooltip");
    desc.setAttribute("data-bs-placement", "top");
    desc.setAttribute("data-bs-custom-class", "custom-tooltip");
    desc.setAttribute("data-bs-title", data);
    // console.log(data);
    // console.log(desc);
    return desc;
}

function createTooltip(data) {                                               //create tooltip for td
    let desc = document.createElement("td");
    desc.setAttribute("data-bs-toggle", "tooltip");
    desc.setAttribute("data-bs-placement", "top");
    desc.setAttribute("data-bs-custom-class", "custom-tooltip");
    desc.setAttribute("data-bs-title", data);
    // console.log(data);
    // console.log(desc);
    return desc;
}

function createRoute(data) {
    let table = document.querySelector(".table-routes");
    let row = document.createElement("tr");
    let th = createTooltipTh(data.name);               //create name
    th.setAttribute("scope", row);
    let numOfChars = 0;
    let name = "";
    for (let char of data.name) {
        if (numOfChars == 30) {
            name += "...";
            break;
        }
        name += char;
        numOfChars++
    }
    //th.classList.add("text-wrap");
    th.textContent = name;
    row.append(th);

    //let desc = document.createElement("td");             //create description
    numOfChars = 0;
    let descWords = "";
    for (let char of data.description) {
        if (numOfChars == 20) break;
        descWords += char;
        numOfChars++;
    }
    let desc = createTooltip(data.description);
    
    desc.textContent = descWords + "...";
    //console.log(desc);
    row.append(desc);

    //let mainObj = document.createElement("td");          //create main objects
    numOfChars = 0;
    let mainObjects = "";
    for (let char of data.mainObject) {
        
        if (numOfChars == 20) break;
        mainObjects += char;
        numOfChars++;
    }
    let mainObj = createTooltip(data.mainObject);
    mainObj.textContent = mainObjects + "...";
    row.append(mainObj);

    let btnTd = document.createElement("td");              //create button place
    let btn = document.createElement("button");
    btn.classList.add("btn");
    btn.classList.add("btn-light");
    btn.setAttribute("type", "button");
    btn.setAttribute("aria-expanded", "false");
    btn.textContent = "Да";
    btnTd.append(btn);
    row.append(btnTd);

    table.append(row);
}

function createTableRouteElements(allData) {
    //console.log(allData.length);
    //console.log(allData[0]);
    //let table = document.querySelector(".table-routes");
    for (let i = 0; i < allData.length; i++) {
        createRoute(allData[i]);
    }

    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
}

async function downloadData() {
    let nUrl = new URL(url + "routes");
    nUrl.searchParams.append("api_key", apiKey);
    try {
        let response = await fetch(nUrl);
        let data = await response.json();
        createTableRouteElements(data);
        console.log(data);
    } catch (error) {
        console.log(error.message);
    }
}

window.onload = function() {
    downloadData();
    document.querySelector(".main-objects-list").onclick = clickMainObject;
};