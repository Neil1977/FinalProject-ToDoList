window.addEventListener('load', () => {
    todos = JSON.parse(localStorage.getItem('todos')) || [];
    const nameInput = document.querySelector('#name');
    const newTodoForm = document.querySelector('#new-todo-form');

    const username = localStorage.getItem('username') || '';

    nameInput.value = username;

    nameInput.addEventListener('change', e => {
        localStorage.setItem('username', e.target.value);
    })

    newTodoForm.addEventListener('submit', e => {
        e.preventDefault();

        const todo = {
            content: e.target.elements.content.value,
            category: e.target.elements.category.value,
            done: false,
            createdAt: new Date().getTime(),
            timeCreated: new Date().toLocaleTimeString("en-GB", { timeZone: 'Europe/London' }),
        }

        todos.push(todo);
        localStorage.setItem('todos', JSON.stringify(todos));

        e.target.reset();

        DisplayTodos();
    })

    DisplayTodos();
})

const timeElement = document.querySelector(".time");
const dateElement = document.querySelector(".date");

function formatTime(date) {
    const hours12 = date.getHours() % 12 || 12;
    const minutes = date.getMinutes();
    const isAm = date.getHours() < 12;

    return `${hours12.toString()}:${minutes.toString().padStart(2, "0")} ${isAm ? "AM" : "PM"}`;
}

function formatDate(date) {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()} ${date.getFullYear()}`;
}

setInterval(() => {
    const now = new Date();

    timeElement.textContent = formatTime(now);
    dateElement.textContent = formatDate(now);
}, 200);






const toggleDatetime = document.getElementById("toggleDatetime")
toggleDatetime.addEventListener("change", (e) => DisplayTodos(e.target.checked));
function DisplayTodos(isAscending = false) {
    const todoList = document.querySelector('#todo-list');
    todoList.innerHTML = '';
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

            if (todo.category == 'personal') {
                span.classList.add('personal');
            } else {
                span.classList.add('business');
            }

            content.classList.add('todo-content');
            actions.classList.add('actions');
            edit.classList.add('edit');
            deleteButton.classList.add('delete');
            //This is the input - changed it to a textarea, which can handle multiple lines. - STILL TO RESOLVE - SEE README - EDGE BUG
            content.innerHTML = `<div type="textarea" class="input-text"  contenteditable="false">
                                    ${todo.content}
                                    ${todo.timeCreated}
                                    </div>`;
            edit.innerHTML = 'Edit';
            deleteButton.innerHTML = 'Delete';

            label.appendChild(input);
            label.appendChild(span);
            actions.appendChild(edit);
            actions.appendChild(deleteButton);
            todoItem.appendChild(label);
            todoItem.appendChild(content);
            todoItem.appendChild(actions);

            todoList.appendChild(todoItem);
            
            if (todo.done) {
                todoItem.classList.add('done');
            }

            //ADDITIONAL STRETCH - ADD ESTIMATED COMPLETION TIME ON INPUT SO ALERT BELOW DOESNT GENERICALLY TRIGGER @ 20:00
            const date = new Date();
            const time = date.getHours();
            if(time >= 20){
            isOverdue()
            }
            function isOverdue () {
                var mp3_url = 'https://media.geeksforgeeks.org/wp-content/uploads/20190531135120/beep.mp3';
            (new Audio(mp3_url)).play()
            for (i=0; i<10; i++) {
            setTimeout(function(){(new Audio(mp3_url)).play()}, i * 1000)
            }
        }   
            
            

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

            deleteButton.addEventListener('click', e => {
                todos = todos.filter(t => t != todo);
                localStorage.setItem('todos', JSON.stringify(todos));
                DisplayTodos();
            })
        })
}





