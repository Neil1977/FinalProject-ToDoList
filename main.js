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

        //WANT TO USE BLOCK BELOW TO ADD DATE TO APP SCREEN, BUT ALSO ORDER ENTRIES BY DATE AND ADD ALERT NOISE WHEN DUE POSSIBLY?

        //const dateElement = document.getElementById('date');
        //let options = { weekday:'long', month:'short', day:'numeric'};
        //let today = new Date();
        //dateElement.innerHTML = today.toLocaleDateString("en-UK", options);

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

function DisplayTodos() {
    const todoList = document.querySelector('#todo-list');

    todoList.innerHTML = '';
    //ORDER TODOS INTO DATE/TIME? - INSERT INTO EXISTING CODE HOW?

    //todos.sort(createdAt(a,b).forEach(todo => {
    //return new Date(b.date) - new Date(a.date);
    //});

    //OR...?

    //const sortedTodos = todos.slice().sort((a,b) => b.date - a.date)

    //OR...?

    //const todoList = todos.sort((a,b) => {
    //const aDate = new Date(a.date + ' ' + a.time)
    //const bDate = new Date(b.date + ' ' + b.time)
    //returnbDate.getTime() - aDate.getTime()
    //})

    todos.forEach(todo => {
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

//CODE SNIPETS TO ADD ALERT SOUND IF TODO OVERDUE? (SEE READ ME ALSO - AFTER DATE/TIME ADDED - ALERT WHEN 20:00 REACHED ON DAY ADDED AND NOT TICKED AS DONE OR LINK TO RED/DANGER IN CSS ln 244 - 266 MAYBE?)

//var mp3_url = 'https://media.geeksforgeeks.org/wp-content/uploads/20190531135120/beep.mp3';
//(new Audio(mp3_url)).play()
//for (i=0; i<10; i++) {
    //setTimeout(function(){(new Audio(mp3_url)).play()}, i * 1000)
  //}


