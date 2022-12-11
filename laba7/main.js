let counterTasks = 0;
let titles = {
    "create": "Создание новой задачи",
    "edit": "Редактирование задачи",
    "show": "Просмотр задачи",
};
let actionBtn = {
    "create": "Создать",
    "edit": "Сохранить",
    "show": "Окей",
};
let url = "http://tasks-api.std-900.ist.mospolytech.ru";
let apiKey = "50d2199a-42dc-447d-81ed-d68a443b697e";
//url.searchParams.append("api_key", apiKey);

function showAlert(error, color) {
    let alerts = document.querySelector(".alerts");
    let alert = document.createElement("div");
    alert.classList.add("alert", "alert-dismissible", color);
    alert.setAttribute("role", "alert");
    alert.append(error);

    let btn = document.createElement("button");
    btn.setAttribute("type", "button");
    btn.classList.add("btn-close");
    btn.setAttribute("data-bs-dismiss", "alert");
    btn.setAttribute("aria-label", "Close");
    alert.append(btn);
    alerts.append(alert);
}

//изменение статуса задачи
async function toggleTask(event) {
    let target = event.target;
    let taskId = target.closest(".task").id;
    let nUrl = new URL(url + "/api/tasks/" + taskId);
    let task;
    nUrl.searchParams.append("api_key", apiKey);
    try {
        let response = await fetch(nUrl);
        task = await response.json();
        if (task.error) showAlert(task.error, "alert-warning");
    } catch (error) {
        showAlert(error.message, "alert-danger");
    }
    
    let newStatus;
    //let task = parseTask(taskId);
    if (task.status == "to-do") {
        newStatus = "done";
    } else if (task.status == "done") {
        newStatus = "to-do";
    }
    //console.log(task.status);
    let item = document.getElementById(taskId);
    let list = document.querySelector(`#${newStatus}-list ul`);
    list.append(item);

    let form = document.createElement('form');
    //console.log(form);
    let formm = new FormData(form);
    formm.append("status", newStatus);
    try {
        let res = await fetch(nUrl, {
            method: 'PUT',
            body: formm
        });
        console.log(formm.get("status"));
        let data = await res.json();
        if (data.error) showAlert(data.error, "alert-warning");
        else showAlert("Статус успешно изменён", "alert-success");
        console.log(data);
    } catch (error) {
        showAlert(error.message, "alert-danger");
    }
    
}

//создание новой задачи
function createNewTaskElem(task) {
    let templateTask = document.getElementById("taskTemplate");
    let newTask = templateTask.content.firstElementChild.cloneNode(true);
    let taskName = newTask.querySelector(".task-name");
    taskName.textContent = task.name;
    newTask.id = task.id;
    let arrows = newTask.querySelectorAll(".toggle-arrow");
    for(let arrow of arrows) {
        arrow.onclick = toggleTask;
    }
    return newTask;
}

//добавление задачи на сервер
async function createTask(name, desc, status) {
    let obj = {
        name: name,
        desc: desc,
        status: status,
        taskId: counterTasks++
    }
    let data;
    let form = new FormData(document.querySelector('form'));
    let nUrl = new URL(url + "/api/tasks");
    nUrl.searchParams.append("api_key", apiKey);
    try {
        let response = await fetch(nUrl, {
        method: 'POST',
        body: form,
        });
        data = await response.json();
        if (data.error) showAlert(data.error, "alert-warning");
        else showAlert("Задача успешно создана", "alert-success");
    } catch (error) {
        showAlert(error.message, "alert-danger");
    }
    console.log(data);
    return data;
}

//добавление задачи в HTML
function addTaskInHtml(task) {
    let list = document.querySelector("#" + task.status + "-list ul");
    list.append(createNewTaskElem(task));
}

//создание или изменение задачи
async function clickBtnHandler(event) {
    let modalWindow = event.target.closest(".modal");
    let form = modalWindow.querySelector("form");
    let formElements = form.elements;
    let name = formElements["name"].value;
    let desc = formElements["desc"].value;
    let status = formElements["status"].value;
    let action = formElements["action"].value;
    let taskId = formElements["taskId"].value;
    if (action == "create") {                                      //создание задачи
        let task = await createTask(name, desc, status);
        if (task.status) addTaskInHtml(task);
    } else if (action == "edit") {                                 //изменение задачи
        //let newTask = parseTask(taskId);
        let nUrl = new URL(url + "/api/tasks/" + taskId);
        nUrl.searchParams.append("api_key", apiKey);
        let formm = new FormData(form);
        try {
            let response = await fetch(nUrl, {
            method: 'PUT',
            body: formm
            });
            let newTask = await response.json();
            if (newTask.error) showAlert(newTask.error, "alert-warning");
            else {
                showAlert("Задача изменена", "alert-success");
                document.getElementById(taskId).querySelector(".task-name").textContent = name;
            } 
        } catch (error) {
            showAlert(error.message, "alert-danger");
        }
        //newTask.name = name;
        //console.log(newTask);
        //console.log(formm.get('name'));
        
    }
    form.reset();
}

//загрузка данных с сервера
async function dataLoad() {
    let maxId = 0;
    let nUrl = new URL(url + "/api/tasks");
    nUrl.searchParams.append("api_key", apiKey);
    try {
        let response = await fetch(nUrl);
        let data = await response.json();
        let tasks = data.tasks;
        showAlert("Данные успешно загружены", "alert-success");
        console.log(data);
        console.log(tasks);
        for (let task of tasks) {
            addTaskInHtml(task);
            if (maxId < task.id) maxId = task.id;
        }
    } catch(err) {
        showAlert(err.message, "alert-danger");
    }
    counterTasks = maxId + 1;
}

//изменение счетчика
function updateCounter(event) {
    let target = event.target;
    let taskCounter = target.closest('.card').querySelector('.task-counter');
    taskCounter.textContent = target.children.length;
}

function parseTask(taskId) {
    let value = localStorage.getItem('task-'+taskId);
    let task = JSON.parse(value);
    return task;
}

//подтверждение удаления данных
async function deleteEvent (event) {
    let taskId = event.relatedTarget.closest('.task').id;
    //let task = parseTask(taskId);
    let nUrl = new URL(url + "/api/tasks/" + taskId);
    nUrl.searchParams.append("api_key", apiKey);
    try {
        let response = await fetch(nUrl);
        let task = await response.json();
        if (task.error) showAlert(task.error, "alert-warning");
        else {
            event.target.querySelector('span.deleteTask').textContent = task.name;
            event.target.querySelector('form').elements['taskid'].value = task.id;
        }
    } catch (error) {
        showAlert(error.message, "alert-danger");
    }
}



//окно для просмотра или изменения данных
async function actionEvent(event) {
    let action = event.relatedTarget.dataset.action;
    let form = event.target.querySelector('form');
    let task;
    form.elements['action'].value = action;
    event.target.querySelector('.modal-title').textContent = titles[action];
    event.target.querySelector('.create-btn').textContent = actionBtn[action];
    if (action == 'edit') {
        let taskId = event.relatedTarget.closest('.task').id;
        let nUrl = new URL(url + "/api/tasks/" + taskId);
        nUrl.searchParams.append("api_key", apiKey);
        try {
            let response = await fetch(nUrl);
            task = await response.json();
            if (task.error) showAlert(task.error, "alert-warning");
            form.elements['name'].value = task.name;
            form.elements['desc'].value = task.desc;
            form.elements['taskId'].value = taskId;
            form.elements['status'].value = task.status;
            form.elements['status'].closest('.row').classList.add('d-none');
        } catch (error) {
            showAlert(error.message, "alert-danger");
            form.elements['status'].closest('.row').classList.add('d-none');
            //alert(error.message);
        }
        //task = parseTask(taskId);
    }
    else if (action == 'show') {
        let taskId = event.relatedTarget.closest('.task').id;
        //task = parseTask(taskId);
        let nUrl = new URL(url + "/api/tasks/" + taskId);
        nUrl.searchParams.append("api_key", apiKey);
        try {
            let response = await fetch(nUrl);
            task = await response.json();
            if (task.error) showAlert(task.error, "alert-warning");
            form.elements['name'].value = task.name;
            form.elements['desc'].value = task.desc;
            form.elements['taskId'].value = taskId;
            form.elements['status'].closest('.row').classList.add('d-none');
            event.target.querySelector('.back-btn').classList.add('d-none');
            let name = form.querySelector('#name');
            let desc = form.querySelector('#desc');
            name.setAttribute('readonly', '')
            name.classList.remove('form-control');
            name.classList.add('form-control-plaintext');
            desc.setAttribute('readonly', '');
            desc.classList.remove('form-control');
            desc.classList.add('form-control-plaintext');
        } catch (error) {
            showAlert(error.message, "alert-danger");
            form.elements['status'].closest('.row').classList.add('d-none');
            event.target.querySelector('.back-btn').classList.add('d-none');
            let name = form.querySelector('#name');
            let desc = form.querySelector('#desc');
            name.setAttribute('readonly', '')
            name.classList.remove('form-control');
            name.classList.add('form-control-plaintext');
            desc.setAttribute('readonly', '');
            desc.classList.remove('form-control');
            desc.classList.add('form-control-plaintext');
            //alert(error.message);
        }
        console.log(task);
        //console.log(task);
        
    }
}

//событие для закрытия модального окна
function closeModal(event) {
    let form = event.target.querySelector('form');
    event.target.querySelector('.back-btn').classList.remove('d-none');
    form.querySelector('#name').removeAttribute('readonly');
    form.querySelector('#desc').removeAttribute('readonly');
    form.elements['status'].closest('.row').classList.remove('d-none');
    let name = form.querySelector('#name');
    let desc = form.querySelector('#desc');
    name.classList.remove('form-control-plaintext');
    name.classList.add('form-control');
    desc.classList.remove('form-control-plaintext');
    desc.classList.add('form-control');
}

window.onload = function() {
    //создание задачи
    let createBtn = document.querySelector(".create-btn");
    createBtn.onclick = clickBtnHandler;

    //изменение счетчика заданий
    let lists = document.querySelectorAll('#to-do-list ul, #done-list ul');
    for (let list of lists) {
        list.addEventListener('DOMSubtreeModified', updateCounter);
    }

    //окно удаления
    let modal = document.querySelector('#deleteTask');
    modal.addEventListener('show.bs.modal', deleteEvent);

    //загрузка
    dataLoad();

    //удаление
    let buttonDel = document.querySelector('.delete');
    buttonDel.onclick = function (event) {
        let taskId = event.target.closest('.modal').querySelector('form').elements['taskid'].value;
        let nUrl = new URL(url + "/api/tasks/" + taskId);
        nUrl.searchParams.append("api_key", apiKey);
        let res = fetch(nUrl, {
            method: 'DELETE',
        }).then(response => {
            return response.json()
        }).then(data => {
            showAlert("Задача удалена", "alert-success");
        }).catch(reject => {showAlert(reject.message, "alert-danger")});   
        document.getElementById(taskId).remove();
    }

    //изменение задачи
    let modalAddTask = document.querySelector('#addTask');
    modalAddTask.addEventListener('show.bs.modal', actionEvent);

    //смена статуса задачи
    let arrows = document.querySelectorAll(".toggle-arrow");
    for(let arrow of arrows) {
        arrow.onclick = toggleTask;
    }

    //закрытие модального окна
    modalAddTask.addEventListener('hide.bs.modal', closeModal);
}