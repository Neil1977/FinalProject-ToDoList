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
function DisplayTodos(isAscending = true) {
    const todoList = document.querySelector('#todo-list');
    todoList.innerHTML = '';
    const sortOrder = (isAscending) ? (a, b) => b.createdAt - a.createdAt : (a, b) => a.createdAt - b.createdAt

    /*PSEUDO LOGIC BELOW FOR REVERSAL OF ORDER LINKED TO TOGGLE SWITCH NOW
    //function DisplaytoDos(e){
    //onChange=(e)=>displayToDo(e.target.value)
    //return (
    //<input name="checkbox" onChange={isAscending} />
    //);
//}


/*JORDANS ADVICE:
Sliders are check-boxes so they have boolean logic so you just need a listener on it.
then you already have a function for your to-do list that takes a boolean
instead of sortOrder you can use the function you already have.
just need to put it inside of an anonymous function so that it doesn't get called immediately.  This will also allow you to pass a value.
onChange=(event)=>displayToDo(event.target.value)
PSEUDO LOGIC ABOVE FOR REVERSAL OF ORDER LINKED TO TOGGLE SWITCH NOW*/



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



