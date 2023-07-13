const form = document.getElementById("todo-form");
const taskInput = document.getElementById("new-task-input");
const taskListEle = document.getElementById("task-list");

let todoArray = JSON.parse(localStorage.getItem("todos")) || [];
let editTodoId = -1;

//api call

// fetch("https://jsonplaceholder.typicode.com/todos")
//   .then((response) => {
//     if (!response.ok) {
//       throw new Error("Network response was not OK");
//     }

//     return response.json();
//   })

//   .then((data) => {
//     // Process the received data
//     data.forEach((dat) => {
//       let f = false;
//       f = todoArray.some((todo) => {
//         return todo.value.toUpperCase() === dat.title.toUpperCase();
//       });
//       if (!f) {
//         todoArray.push({
//           value: dat.title,
//           checked: false,
//         });
//       }
//     });
//     console.log(todoArray.length);
//   })

//   .catch((error) => {
//     // Handle any errors that occurred during the fetch request

//     console.log("Error:", error.message);
//   });

//1st render
renderTodos();
//Form submit
form.addEventListener("submit", function (e) {
  e.preventDefault(); //prevent refreshing the form

  addTask();
  renderTodos();
  localStorage.setItem("todos", JSON.stringify(todoArray));
});

//add task
function addTask() {
  const taskValue = taskInput.value;
  // check for duplicate value
  const isDuplicate = todoArray.some((todo) => {
    return todo.value.toUpperCase() === taskValue.toUpperCase();
  });

  // if task Value is empty
  if (taskValue === "") {
    alert("Please input a task value");
  } else if (isDuplicate) {
    alert("Task added is duplicate");
  } else {
    if (editTodoId >= 0) {
      //update the todo array
      todoArray = todoArray.map((todo, index) => {
        return {
          ...todo,
          value: index === editTodoId ? taskValue : todo.value,
        };
      });
      editTodoId = -1;
    } else {
      const todo = {
        value: taskValue,
        checked: false,
      };

      todoArray.push(todo);
    }

    taskInput.value = "";
  }
}

//Render todos
function renderTodos() {
  taskListEle.innerHTML = "";
  //   console.log(todoArray);
  todoArray.forEach((todo, index) => {
    // console.log(todo.value);
    taskListEle.innerHTML += `
          <div class="task" id=${index}>
         
          <i
           class="bi ${todo.checked ? "bi-check-circle-fill" : "bi-circle"}"
           data-action="check"
          ></i>
            <input
              type="text"
              class="${todo.checked && "checked"} text"
              value="${todo.value}"
              readonly
             />
            
           <button class="edit" data-action="edit">edit</button>
           <button class="delete" data-action="delete">delete</button>
          
      </div>
    `;
  });
}

//Click event listeners for all todos

taskListEle.addEventListener("click", (event) => {
  const target = event.target;
  const parentElement = target.parentNode;
  if (parentElement.className !== "task") return;

  const todo = parentElement;
  // get the task id
  const todoId = Number(todo.id);

  //target action custom attribute
  const action = target.dataset.action;
  action === "check" && checkedTodo(todoId);
  action === "edit" && editTodo(todoId);
  action === "delete" && deleteTodo(todoId);

  //   console.log(todoId, action);
});

//check a todo
function checkedTodo(todoId) {
  todoArray = todoArray.map((todo, index) => {
    return {
      ...todo,
      checked: index === todoId ? !todo.checked : todo.checked,
    };
  });
  renderTodos();
}
// edit a todo
function editTodo(todoId) {
  taskInput.value = todoArray[todoId].value;
  editTodoId = todoId;
}

//delete todo
function deleteTodo(todoId) {
  todoArray = todoArray.filter((todo, index) => index !== todoId);
  editTodoId = -1;
  renderTodos();
  localStorage.setItem("todos", JSON.stringify(todoArray));
}
