const url = "http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/";
const apiKey = "c67f2277-7aed-4821-a074-2fc510e2aae2";
let allData;

function showAlert(error, color) {
    let alerts = document.querySelector(".alerts");
    let alert = document.createElement("div");
    alert.classList.add("alert", "alert-dismissible", color);
    alert.setAttribute("role", "alert");
    alert.append(error);
    let btn = document.createElement("button");
    btn.setAttribute("type", "button");
    btn.classList.add("btn-close");
    alert.classList.add("position-sticky");
    alert.classList.add("end-50");
    alert.classList.add("my-0");
    btn.setAttribute("data-bs-dismiss", "alert");
    btn.setAttribute("aria-label", "Close");
    alert.append(btn);
    alerts.append(alert);
    setTimeout(() => alert.remove(), 4000);
}

async function nameOfRoute(idRoute) {
    let nUrl = new URL(url + "routes/" + idRoute);
    nUrl.searchParams.append("api_key", apiKey);
    let nameRoute = "";
    try {
        let response = await fetch(nUrl);
        let route = await response.json();
        //console.log(route);
        nameRoute = route.name;
        //console.log(route.name);
    } catch (error) {
        console.log(error.message);
    }
    //console.log(nameRoute);
    return nameRoute;
}

function clickOnTrash(event) {
    if (!event.target.classList.contains("bi-trash-fill")) return;
    let idTask = event.target.parentNode.parentNode.id;
    document.querySelector(".delete").setAttribute("data-task-id", idTask);
}

function createRoute(data, number) {
    let table = document.querySelector(".table-routes");
    let row = document.createElement("tr");
    row.setAttribute("id", data.id);
    let th = document.createElement("th");
    th.setAttribute("scope", row);
    //th.classList.add("text-wrap");
    th.textContent = number;
    row.append(th);

    let name = document.createElement("td");
    nameOfRoute(data.route_id).then((response) => name.textContent = response);
    //console.log(name.textContent);
    row.append(name);

    let dateRoute = document.createElement("td");
    dateee = new Date(data.date);
    DayMonthYear = dateee.toJSON().slice(0, 10).split("-");
    dateRoute.textContent = DayMonthYear[2] + "." + DayMonthYear[1] + "." + DayMonthYear[0];
    //console.log(dateRoute);
    row.append(dateRoute);

    let priceRoute = document.createElement("td");
    priceRoute.textContent = data.price;
    row.append(priceRoute);

    let actions = document.createElement("td");
    actions.classList.add("d-flex");
    actions.classList.add("flex-wrap");
    let eye = document.createElement("i");
    eye.classList.add("bi");
    eye.classList.add("bi-eye-fill");
    eye.classList.add("mx-2");
    actions.append(eye);

    let pen = document.createElement("i");
    pen.classList.add("bi");
    pen.classList.add("bi-pencil-square");
    pen.classList.add("mx-2");
    actions.append(pen);

    let trash = document.createElement("i");
    trash.classList.add("bi");
    trash.classList.add("bi-trash-fill");
    trash.classList.add("ms-2");
    trash.setAttribute("data-bs-toggle", "modal");
    trash.setAttribute("data-bs-target", "#deleteTask");
    trash.onclick = clickOnTrash;
    actions.append(trash);
    row.append(actions);

    table.append(row);
}

function pageBtnHandler(event) {
    if (!event.target.classList.contains("page-link")) return;
    let oldBtn = document.querySelector(".active");
    oldBtn.classList.remove("active");
    event.target.classList.add("active");
    createElements(allData);
}

function createElements(data) {
    document.querySelector(".table-routes").innerHTML = "";
    let oldBtn = document.querySelector(".active");
    let pagination = document.querySelector(".pagination");
    pagination.innerHTML = "";
    for (let i = 1; i < Math.ceil(data.length / 5) + 1; i++) {
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
        a.onclick = pageBtnHandler;
        li.append(a);
        pagination.append(li);
    }

    let currentPage = document.querySelector(".active").textContent;
    let start = currentPage * 5 - 5;
    let end = (start + 5) > data.length ? (start + data.length % 5) : start + 5;
    for (let i = start; i < end; i++) {
        createRoute(data[i], i + 1);
    }
    //console.log(data);
}

async function downloadData() {
    let nUrl = new URL(url + "orders");
    nUrl.searchParams.append("api_key", apiKey);

    try {
        let response = await fetch(nUrl);
        let data = await response.json();
        allData = JSON.parse(JSON.stringify(data));
        createElements(data);
    } catch (error) {
        console.log(error.message);
    }
}

async function deleteTask(event) {
    if (!event.target.classList.contains("delete")) return;
    let idTask = event.target.getAttribute("data-task-id");
    let nUrl = new URL(url + "orders/" + idTask);
    nUrl.searchParams.append("api_key", apiKey);
    try {
        let response = await fetch(nUrl, {
            method: "DELETE",
        });
        let data = await response.json();
        document.querySelector(".page-link").classList.add("active");
        downloadData();
        console.log(data);
    } catch (error) {
        console.log(error.message);
    }
}

window.onload = function () {
    downloadData();
    document.querySelector(".delete").onclick = deleteTask;
};
