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



/*Want to add time added (not date) to be visible once todo item generated*/
//you've got all of the logic already, you just need to recreate it for this feature
//you can use javascript to get the date
//you'll have to store it in your todo objects
//timestamp will be set when you click
//so when you create a new todo, you can stamp it at the same time
//just have to add a new key to your object.
//ln39 - function formatTime(date) { returns time only........

//A BIT LIKE THIS???
/*function NewItem({ add, cancel }) {
    const [name, setName] = React.useState("");
    const [date, setDate] = React.useState(dateformat(new Date(), "yyyy-mm-dd"));
  
    function addItem() {
      const dueDate = new Date(date);
      add({ name, timestampDue: dueDate.getTime(), complete: false, id: 0 });
    }
  
    return (
      <div className="add-item-form">
        <div className="form-group">
          <label htmlFor="addItemInput">Item description</label>
          <input
            type="text"
            placeholder="Enter description..."
            className="form-control"
            id="addItemInput"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="addItemDueInput">Due date</label>
          <input
            type="date"
            className="form-control"
            id="addItemDueInput"
            onChange={e => setDate(e.target.value)}
            value={date}
          />
        </div>
        <button className="btn btn-success" disabled={name === ""} onClick={addItem}>
          Add item
        </button>
        <button className="btn btn-secondary" style={{ marginLeft: "20px" }} onClick={cancel}>
          Cancel
        </button>
      </div>);
  }
  const [adding, setAdding] = React.useState(false);
  {!adding && (
  <button type="button" className="btn btn-link" onClick={() => setAdding(true)}>
    Add new item
  </button>)}
  {adding && <NewItem cancel={() => setAdding(false)} add={addNewItem} />}
  */

//TOGGLE NOW WORKS BUT REORDERS ENTRIES IN CHRONOLOGICAL BUT ALSO TO TOP/BOTTOM OF LIST AND IDEALLY JUST ORDER NOT LIST POSITION

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
            //This is the input - changed it to a textarea, which can handle multiple lines. - STILL TO RESOLVE - SEE README
            content.innerHTML = `<div type="textarea" class="input-text"  contenteditable="false">
                                    ${todo.content}
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

            //CODE SNIPET TO ADD ALERT SOUND IF TODO OVERDUE? (SEE READ ME ALSO - AFTER TIME ADDED - ALERT WHEN 20:00 REACHED ON DAY ADDED AND NOT TICKED MARKED AS "DONE"/CROSSED OUT ON FRONT END)
            //function isOverdue(item) {
            //return !item.complete && item.timestampDue < new Date().getTime();
            //}
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





