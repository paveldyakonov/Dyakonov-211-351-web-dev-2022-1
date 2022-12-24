const url = "http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/";
const apiKey = "c67f2277-7aed-4821-a074-2fc510e2aae2";
let allRoutes;
// const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
// const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

//console.log(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
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
    btn.setAttribute("id", data.id);
    btn.textContent = "Да";
    btnTd.append(btn);
    row.append(btnTd);

    table.append(row);
}

function createTableRouteElements(allData) {                      //Создание элементов
    //console.log(allData.length);
    console.log(allData);
    //let table = document.querySelector(".table-routes");
    document.querySelector(".table-routes").innerHTML = "";
    let oldBtn = document.querySelector(".active");
    let pagination = document.querySelector(".pagination");
    if (allData.length != allRoutes.length) {
        pagination.innerHTML = "";
        let li = document.createElement("li");
        li.classList.add("page-item");
        let a = document.createElement("a");
        a.classList.add("page-link");
        a.classList.add("bg-secondary");
        a.classList.add("text-warning");
        if (oldBtn.textContent == "1") a.classList.add("active");
        a.setAttribute("href", "#");
        a.textContent = 1
        li.append(a);
        pagination.append(li);
        // for (let child of pagination.children) {
        //     if (child.children[0].textContent != "1") {
        //         console.log(child.children[0].textContent);
        //         pagination.removeChild(child);
        //         //child.innerHTML = "";
        //     } else {
        //         child.children[0].classList.add("active");
        //         console.log(child.children[0].textContent);
        //     }
        console.log(pagination.children.length + "ssss");
    }
    // for (let child of pagination.children) {
    //     if (child.children[0].textContent != "1") child.innerHTML = "";
    //     console.log(child.children[0]);
    // }
    if (pagination.children.length == 1) {
        for (let i = 2; i < Math.ceil(allData.length / 10) + 1; i++) {
            let li = document.createElement("li");
            li.classList.add("page-item");
            let a = document.createElement("a");
            a.classList.add("page-link");
            a.classList.add("bg-secondary");
            a.classList.add("text-warning");
            if (oldBtn.textContent == i) a.classList.add("active");
            a.setAttribute("href", "#");
            a.textContent = i;
            li.append(a);
            pagination.append(li);
        }
    }

    let currentPage = document.querySelector(".active").textContent;
    let start = currentPage * 10 - 10;
    let end = (start + 10) > allData.length ? (start + allData.length % 10) : start + 10;
    for (let i = start; i < end; i++) {
        createRoute(allData[i]);
    }
    let childs = document.querySelector(".table-routes").children;
    for (let child of childs) {
        console.log(child.firstElementChild.getAttribute("data-bs-title"));
    }
    // for (let i = 0; i < allData.length; i++) {
    //     createRoute(allData[i]);
    // }

    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
}

function createTableElementsOnDownload(allData) {                       //Создание элементов при загрузке
    let oldBtn = document.querySelector(".active");
    document.querySelector(".table-routes").innerHTML = "";
    let pagination = document.querySelector(".pagination");
    pagination.innerHTML = "";
    for (let i = 1; i < Math.ceil(allData.length / 10) + 1; i++) {
        let li = document.createElement("li");
        li.classList.add("page-item");
        let a = document.createElement("a");
        //if (i == "1") a.classList.add("active");
        a.classList.add("page-link");
        a.classList.add("bg-secondary");
        a.classList.add("text-warning");
        if (oldBtn.textContent == i) a.classList.add("active");
        a.setAttribute("href", "#");
        a.textContent = i;
        li.append(a);
        pagination.append(li);
    }
    let currentPage = document.querySelector(".active").textContent;
    let start = currentPage * 10 - 10;
    let end = (start + 10) > allData.length ? (start + allData.length % 10) : start + 10;
    for (let i = start; i < end; i++) {
        createRoute(allData[i]);
    }
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

}

function downloadMainObjectsList(data) {
    let dropList = document.querySelector(".main-objects-list");
    let newList = [];
    for (let drop of data) {
        let l = drop.mainObject.split("-");
        for (let newObj of l) {
            let li = document.createElement("li");
            let a = document.createElement("a");
            a.classList.add("dropdown-item");
            a.setAttribute("href", "#");
            //a.textContent = newObj;
            if (!newList.includes(newObj)) {
                let numOfChars = 0;
                let shortString = "";
                for (let char of newObj) {
                    if (numOfChars == 13) {
                        break;
                    }
                    numOfChars++;
                    shortString += char;
                }
                a.textContent = shortString + "...";
                a.setAttribute("data-bs-toggle", "tooltip");
                a.setAttribute("data-bs-placement", "top");
                a.setAttribute("data-bs-custom-class", "custom-tooltip");
                a.setAttribute("data-bs-title", newObj);
                newList.push(newObj);
                li.append(a);
                dropList.append(li);
            }
        }
        //newList.push(drop.mainObject.split("-"));
    }
    console.log(newList);
    //let li = document.createElement("li");
    //let a = document.createElement("a");

}

async function downloadData() {                                 //Загрузка данных
    let nUrl = new URL(url + "routes");
    nUrl.searchParams.append("api_key", apiKey);
    try {
        let response = await fetch(nUrl);
        let data = await response.json();
        //allRoutes = Object.assign({}, data);
        allRoutes = JSON.parse(JSON.stringify(data));
        downloadMainObjectsList(data);
        createTableElementsOnDownload(data);
        //createTableRouteElements(data);
        //console.log(data);
    } catch (error) {
        console.log(error.message);
    }
}

async function searchBtnHandler() {                                    //Поиск записей
    let searchField = document.querySelector(".search-field").value;
    let nUrl = new URL(url + "routes");
    nUrl.searchParams.append("api_key", apiKey);
    let mainObj = document.querySelector(".btn-main-object");
    console.log("dd" + mainObj.textContent + "dd");
    let newRoutes = [];
    try {
        if (searchField == "" && mainObj.textContent == "Основной объект") downloadData();
        else {
            let response = await fetch(nUrl);
            let data = await response.json();
            let str = mainObj.textContent.slice(0, -4);
            //allRoutes = Object.assign({}, data);
            //allRoutes = JSON.parse(JSON.stringify(data));
            for (let route of data) {
                if (mainObj.textContent == "Основной объект") {
                    if (route.name.includes(searchField)) newRoutes.push(route);
                }
                /*else if (route.name.includes(searchField) && mainObj.textContent == "Основной объект") {
                    newRoutes.push(route);
                }*/
                else if (searchField == "" && mainObj.textContent != "Основной объект") {
                    if (route.mainObject.includes(str)) newRoutes.push(route);
                    console.log(route.mainObject);
                }
                else if (route.name.includes(searchField) && (route.mainObject.includes(str)) && mainObj.textContent != "Основной объект") {
                    //console.log(route.description);
                    //console.log(route.description);
                    newRoutes.push(route);
                }
            }
            console.log(newRoutes);
            // let pagination = document.querySelector(".pagination");
            // for (let child of pagination.children) {
            //     if (child.children[0].textContent != "1") child.innerHTML = "";
            //     else child.children[0].classList.add("active");
            //     console.log(child.children[0]);
            // }
            createTableRouteElements(newRoutes);
            //console.log(data);
        }
    } catch (error) {
        console.log(error.message);
    }
}

function pageBtnHandler(event) {                                     //Переход на другую страницу
    if (!event.target.classList.contains("page-link")) return;
    let searchField = document.querySelector(".search-field").value;
    let oldBtn = document.querySelector(".active");
    oldBtn.classList.remove("active");
    console.log(oldBtn.textContent);
    event.target.classList.add("active");
    console.log(allRoutes[0].description);
    
    searchBtnHandler();
    //createTableRouteElements(allRoutes);
    //downloadData();
}

function searchFieldInput() {                                            //При изменении поля 1-я страница становится активной
    let oldBtn = document.querySelector(".active");
    oldBtn.classList.remove("active");
    document.querySelector(".page-item").classList.add("active");
}

function btnMainOnjectClick() {
    let oldBtn = document.querySelector(".active");
    oldBtn.classList.remove("active");
    document.querySelector(".pagination").firstChild.firstChild.classList.add("active");
}

window.onload = function () {
    downloadData();
    document.querySelector(".main-objects-list").onclick = clickMainObject;
    document.querySelector(".pagination").onclick = pageBtnHandler;
    document.querySelector(".search-btn").onclick = searchBtnHandler;
    document.querySelector(".search-field").oninput = searchFieldInput;
    document.querySelector(".btn-main-object").onclick = btnMainOnjectClick;
    //document.querySelector(".main-objects-list").onclick = mainObjectsListClick;
};