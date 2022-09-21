//Setting up local storage & retrieval below
window.addEventListener('load', () => {
    todos = JSON.parse(localStorage.getItem('todos')) || [];
    const nameInput = document.querySelector('#name');
    const newTodoForm = document.querySelector('#new-todo-form');
    const username = localStorage.getItem('username') || '';

    //setting item in local storage to save name (key)
    nameInput.value = username;
    nameInput.addEventListener('change', e => {
        localStorage.setItem('username', e.target.value);
    })
    //Prevent default page reload
    newTodoForm.addEventListener('submit', e => {
        e.preventDefault();

        //setting up categories and timestamp functionality
        const todo = {
            content: e.target.elements.content.value,
            category: e.target.elements.category.value,
            done: false,
            createdAt: new Date().getTime(),
            timeCreated: new Date().toLocaleTimeString("en-GB", { timeZone: 'Europe/London' }),
        }

        //Add to todos array elements and changing to JSON string to store (only way in local storage - primitive values - no REACT/Vanilla JS)
        todos.push(todo);
        localStorage.setItem('todos', JSON.stringify(todos));
        e.target.reset();

        //This function relocated below to incorporate more functionality.
        DisplayTodos();
    })

    DisplayTodos();
})

//Adding functionality of date and time on front of app
const timeElement = document.querySelector(".time");
const dateElement = document.querySelector(".date");

//Setting up function to convert timestamp into usable display
function formatTime(date) {
    const hours12 = date.getHours() % 12 || 12;
    const minutes = date.getMinutes();
    const isAm = date.getHours() < 12;
    return `${hours12.toString()}:${minutes.toString().padStart(2, "0")} ${isAm ? "AM" : "PM"}`;
}

//Setting up function to convert timestamp into usable display
function formatDate(date) {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()} ${date.getFullYear()}`;
}

//Allow real time update of calendar on front of app (will auto refresh every based on setting decrement below)
setInterval(() => {
    const now = new Date();
    timeElement.textContent = formatTime(now);
    dateElement.textContent = formatDate(now);
}, 200);

const toggleDatetime = document.getElementById("toggleDatetime")
toggleDatetime.addEventListener("change", (e) => DisplayTodos(e.target.checked));

//Setting up function and all elements/labels and inputs to link to HTML/CSS - Global variable
function DisplayTodos(isAscending = false) {
    const todoList = document.querySelector('#todo-list');
    todoList.innerHTML = '';

    //Added ability to sort items added into time order (linked to timestamp now displayed)
    //Also added toggleswitch to reorder events if needed.
    const sortOrder = (isAscending) ? (a, b) => b.createdAt - a.createdAt : (a, b) => a.createdAt - b.createdAt;
    todos.sort(sortOrder)
        .forEach(todo => {
            const todoItem = document.createElement('div');
            todoItem.classList.add('todo-item')
            const label = document.createElement('label');
            const input = document.createElement('input');
            const span = document.createElement('span');
            const content = document.createElement('div');
            const actions = document.createElement('div');
            const edit = document.createElement('button');
            const deleteButton = document.createElement('button');
            input.type = 'checkbox';
            input.checked = todo.done;
            span.classList.add('bubble');

            //Seperating todos into business & Personal (span)
            if (todo.category == 'personal') {
                span.classList.add('personal');
            } else {
                span.classList.add('business');
            }
            content.classList.add('todo-content');
            actions.classList.add('actions');
            edit.classList.add('edit');
            deleteButton.classList.add('delete');

            //This is the input - changed it to a textarea, which can handle multiple lines to ty and display more on multiple lines. - STILL TO RESOLVE - SEE README - EDGE BUG!
            //Also added timeCreated here to link to timestamp to add to to do item - time only
            content.innerHTML = `<div type="textarea" class="input-text"  contenteditable="false">
                                    ${todo.content}
                                    ${todo.timeCreated}
                                    </div>`;
            edit.innerHTML = 'Edit';
            deleteButton.innerHTML = 'Delete';

            //Appending elements below
            label.appendChild(input);
            label.appendChild(span);
            actions.appendChild(edit);
            actions.appendChild(deleteButton);
            todoItem.appendChild(label);
            todoItem.appendChild(content);
            todoItem.appendChild(actions);
            todoList.appendChild(todoItem);

            //Setting up functionality to mark todo as completed (see also comment below)
            if (todo.done) {
                todoItem.classList.add('done');
            }

            //ADDED ALERT LINKED TO TIMESTAMP TO SOUND ALERT IF 18:00 RECAHED AND TODO ITEM LEFT INCOMPLETED
            const date = new Date();
            const time = date.getHours();
            if (time >= 18) {
                isOverdue()
            }
            function isOverdue() {
                var mp3_url = 'https://media.geeksforgeeks.org/wp-content/uploads/20190531135120/beep.mp3';
                (new Audio(mp3_url)).play()
                for (i = 0; i < 10; i++) {
                    setTimeout(function () { (new Audio(mp3_url)).play() }, i * 1000)
                }
            }

            //Setting on click event listener for input and adding to local storage and redisplaying todos once done
            input.addEventListener('click', e => {
                todo.done = e.target.checked;
                localStorage.setItem('todos', JSON.stringify(todos));

                if (todo.done) {
                    todoItem.classList.add('done');
                } else {
                    todoItem.classList.remove('done');
                }

                DisplayTodos();
            })

            //Setting on click event listener to add and when moving away from entry saves to local storage and makes editable
            edit.addEventListener('click', e => {
                const input = content.querySelector('.input-text');
                input.setAttribute('contenteditable', true);
                input.focus();
                input.addEventListener('blur', e => {
                    input.setAttribute('contenteditable', false);
                    todo.content = input.innerText
                    localStorage.setItem('todos', JSON.stringify(todos));
                    DisplayTodos();
                })
            })

            //Setting on click event listener to delete when completed (filter)
            deleteButton.addEventListener('click', e => {
                todos = todos.filter(t => t != todo);
                localStorage.setItem('todos', JSON.stringify(todos));
                DisplayTodos();
            })
        })
}





