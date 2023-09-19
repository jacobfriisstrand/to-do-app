// Define empty array to push objects into
let toDoArray = [];

function displayStoredItems() {}
if (localStorage.getItem("toDoArray")) {
  toDoArray = JSON.parse(localStorage.getItem("toDoArray"));
  displayToDoList(); // Display the tasks from localStorage
}

displayStoredItems();

function setItem() {
  localStorage.setItem("toDoArray", JSON.stringify(toDoArray));
}

// Define the taskInput
const taskInput = document.querySelector("#task-input");

// Event listener that creates an object when enter key is pressed after entering a task in taskInput field
taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    // Defines the inputValue as the value of the text input field
    const inputValue = taskInput.value;

    // Adding functionality to make input field shake if no content is applied
    if (inputValue === "") {
      taskInput.classList.add("invalid");
      taskInput.setAttribute("placeholder", "Invalid input");

      // Changes the inputfield to normal after 2000ms
      setTimeout(() => {
        taskInput.classList.remove("invalid");
        taskInput.setAttribute("placeholder", "New task...");
      }, 1000);
      return;
      // If input field has content, execute the push of the object
    } else {
      taskInput.classList.remove("invalid");
      // Clears the input value after the inputValue is stored as a variable
      taskInput.value = "";

      // Object for the array is being created
      let task = {
        description: inputValue,
        // Generates a id for the object that will always be unique as it counts the number of objects in the array +1

        id: toDoArray.length + 1,

        // Due date is set empty, so that it can be enriched later
        dueDate: "",

        // Boolean values to define if the object is important or completed
        complete: false,
        important: false,
      };

      // Object is pushed to the array
      toDoArray.push(task);

      // Saves the content of the array in Local Storage
      setItem();

      console.log(toDoArray);

      // Function that handles the loop is called
      displayToDoList();
    }
  }
});

// Displays the To do list in a ul element
function displayToDoList() {
  const ul = document.querySelector("ul");
  const doneList = document.querySelector("#done-list");

  // Clears the ul content prior to appending objects to the array
  ul.innerHTML = "";
  doneList.innerHTML = "";

  // Loops each object in the array with forEach
  toDoArray.forEach(appendObject);
}

function appendObject(task) {
  // Clones the task description in the DOM
  const taskClone = document.querySelector("#task-object").content.cloneNode(true);

  // Defines where the task description will be shown
  let taskDescription = taskClone.querySelector("#task-description");
  let dueDateDescription = taskClone.querySelector("#due-date");
  const deleteButton = taskClone.querySelector("#delete-button");
  const dateInputField = taskClone.querySelector("#date-input");
  const doneButton = taskClone.querySelector("#done-button");
  const importantButton = taskClone.querySelector("#important-button");

  if (task.complete === true) {
    document.querySelector("#done-list").appendChild(taskClone);
    setItem();
  }
  // Sets the text content to be the object description property
  taskDescription.textContent = task.description;

  // Appends the clone to the unordered list
  document.querySelector("#to-do-list").appendChild(taskClone);

  // Set the current date as the starting date for setting a due date
  let currentFullDate = "";
  let currentDate = new Date();
  let currentDay = currentDate.getDate();
  let currentMonth = currentDate.getMonth() + 1;
  let currentYear = currentDate.getFullYear();

  // Adds a 0 before the month if the month is below 10 so it can be read by the input value
  if (currentMonth < 10) {
    currentMonth = "0" + currentMonth;
  }

  // Adds a 0 before the day if the day is below 10
  if (currentDay < 10) {
    currentDay = "0" + currentDay;
  }

  // Enriches the currentFullDate with current date data
  currentFullDate = `${currentYear}-${currentMonth}-${currentDay}`;

  // Sets the minimum date value and current date value as the currentFullDate
  dateInputField.setAttribute("min", currentFullDate);
  dateInputField.setAttribute("value", currentFullDate);

  dateInputField.addEventListener("change", () => {
    task.dueDate = dateInputField.value;

    if (task.dueDate === "") {
      dueDateDescription.textContent = "";
    } else if (task.dueDate !== "") {
      dueDateDescription.textContent = `Due date has been assigned to ${task.dueDate}`;
    }

    console.log(task.dueDate);
    console.log(toDoArray);

    setItem();
  });

  if (task.dueDate === "") {
    dueDateDescription.textContent = "";
  } else if (task.dueDate !== "") {
    dueDateDescription.textContent = `Due date has been assigned to ${task.dueDate}`;
    dateInputField.value = task.dueDate;
  }

  deleteButton.addEventListener("click", () => {
    const findIndex = toDoArray.findIndex((taskToBeFound) => task.id === taskToBeFound.id);
    const currentObject = toDoArray.find((object) => object.id === task.id);
    console.log(findIndex);
    console.log(currentObject);

    toDoArray.splice(findIndex, 1);
    displayToDoList();
    setItem();
  });

  doneButton.addEventListener("click", (e) => {
    // Find the index of the object that is clicked
    const findIndex = toDoArray.findIndex((taskToBeFound) => task.id === taskToBeFound.id);
    console.log(findIndex);

    // Find the object that is clicked
    const currentObject = toDoArray.find((object) => object.id === task.id);
    console.log(currentObject);

    task.complete = !task.complete;

    // Remove the done task from toDoArray using splice
    // toDoArray.splice(findIndex, 1);
    // document.querySelector("#done-list").appendChild(taskClone);

    appendObject(currentObject);
    displayToDoList();
    setItem();
  });

  importantButton.addEventListener("click", () => {
    const findIndex = toDoArray.findIndex((taskToBeFound) => task.id === taskToBeFound.id);
    console.log(findIndex);

    currentObject.important = !currentObject.important;
    setItem();
  });
}
