
let tasks = [];
let deletedTasks = [];
let filteredTaskList = [];
let viewFilter = "all";
var tasksCount = document.getElementById("task-count");
var inputText = document.getElementById("add-task");
var allTasks = document.getElementById("task-list");


function addTaskToDOM(task){
    const li = document.createElement('li');

    li.innerHTML=`<input type="checkbox" id="${task.id}" ${task.done ? 'checked':''} class="task-checkbox">
                  <label for="${task.id}">${task.text}</label>
                  <i class="far fa-trash-alt" data-class="delete" data-id=${task.id}></i>`;

    allTasks.appendChild(li);
}

function addTask(task){
    tasks.push(task);
    filterTasks();
    return;
}

function renderList(taskList){
    allTasks.innerHTML ='';

    for (let i in taskList){
        addTaskToDOM(taskList[i]);
    }

    tasksCount.innerHTML=taskList.length;
}

function filterTasks(){
    if (viewFilter === "all"){
        filteredTaskList = tasks;
    }
    else if(viewFilter === 'incomplete'){
        filteredTaskList = tasks.filter(task => task.done === false);
    }
    else{
        filteredTaskList = tasks.filter(task => task.done === true);
    }
    renderList(filteredTaskList);
}

function markTaskAsComplete(taskId){
    const index = tasks.findIndex(task => task.id === taskId);

    if(index >-1){
        tasks[index].done = !tasks[index].done;
        filterTasks();
        return;
    }
}

function deleteTask(taskId){
    const index =tasks.findIndex(task => task.id === taskId);
    if(index>-1){
        console.log(tasks[index]);
        if(deletedTasks.length === 5){
            for(let i=0;i<deletedTasks.length-1;i++){
                deletedTasks[i]=deletedTasks[i+1];
            }
            deletedTasks.pop();
        }
        deletedTasks.push(tasks[index]);
    }
    const newTasks = tasks.filter(task => task.id !== taskId);

    tasks= newTasks;
    filterTasks();
}



function completeAll(){
    for (let i in tasks){
        tasks[i].done = true;
    }

    filterTasks();
}

function clearCompleted(){
   const taskList = tasks;
   for(let i in taskList){
       if(taskList[i].done){
           deleteTask(taskList[i].id);
       }
   }
}

function addListeners(){
    document.addEventListener("click",handleClickListener);
    document.addEventListener("keyup",handleKeypressListener);
}

function handleClickListener (e){
    if(e.target.dataset.class === 'delete'){
        const taskId = e.target.dataset.id;
        deleteTask(taskId);
        return;
    }
    else if(e.target.className === 'task-checkbox'){
        const taskId = e.target.id;
        markTaskAsComplete(taskId);
        return;
    }
    else if (e.target.className === "complete-all"){
        completeAll();
    }
    else if (e.target.className === "undo-delete"){
        if(deletedTasks.length>0){
            const index = deletedTasks.length-1;
            addTask(deletedTasks[index]);
            deletedTasks.pop();
        }
    }
    else if (e.target.className === "clear-completed"){
        clearCompleted();
    }
    else if(e.target.className === "view-mode"){
        viewFilter = e.target.value;
        filterTasks();
    }
}

function handleKeypressListener (e){
    if(e.key === 'Enter'){
        const text = e.target.value;
        if(text.trim() === ""){
            return;
        }

        const task = {
            text,
            id:Date.now().toString(),
            done:false
        }

        e.target.value = '';
        addTask(task);
    }
}

addListeners();