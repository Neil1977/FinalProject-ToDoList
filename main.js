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



        //ADDING BUTTON TO TOGGLE ORDER OF DATED ENTRIES (ASCENDING/DESCENDING ETC) - see also index.html ln29 and main.css ln42
        //function ????? - TBC (ternary reversal of this linked to buton? - todos.sort((a, b) => b.createdAt - a.createdAt)??

        const todo = {
            content: e.target.elements.content.value,
            category: e.target.elements.category.value,
            done: false,
            createdAt: new Date().getTime()
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



/*Display more of todo in visible list (without having to use "edit" button and cursor across)*/
function DisplayTodos() {
    const todoList = document.querySelector('#todo-list');

    todoList.innerHTML = '';

    todos.sort((a, b) => b.createdAt - a.createdAt)
        .forEach(todo => {
            const todoItem = document.createElement('div');
            todoItem.classList.add('todo-item')
            //Add button to resort entries into ascending/descending too if needed? see main.js line 19 and index.html line 29
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

            content.innerHTML = ` <input type="text" value="${todo.content}" readonly>`;
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

            //CODE SNIPET TO ADD ALERT SOUND IF TODO OVERDUE? (SEE READ ME ALSO - AFTER DATE/TIME ADDED - ALERT WHEN 20:00 REACHED ON DAY ADDED AND NOT TICKED MARKED AS "DONE"/CROSSED OUT ON FRONT END)
            //var mp3_url = 'https://media.geeksforgeeks.org/wp-content/uploads/20190531135120/beep.mp3';
            //(new Audio(mp3_url)).play()
            //for (i=0; i<10; i++) {
            //setTimeout(function(){(new Audio(mp3_url)).play()}, i * 1000)
            //}

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
                const input = content.querySelector('input');
                input.removeAttribute('readonly');
                input.focus();
                input.addEventListener('blur', e => {
                    input.setAttribute('readonly', true);
                    todo.content = e.target.value;
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



