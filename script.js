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

// Event listener that creates an object when enter key is pressed or input button is clicked
document.querySelector(".input-button").addEventListener("click", addTask);

// Add a keydown event listener to the taskInput element
taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addTask();
  }
});

function addTask() {
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
      deleted: false,
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
  //Being able to find the object that is clicked
  const currentObject = toDoArray.find((object) => object.id === task.id);
  console.log(currentObject);

  // Clones the task description in the DOM
  const taskClone = document.querySelector("#task-object").content.cloneNode(true);

  // Defines where the task description will be shown
  let taskDescription = taskClone.querySelector("#task-description");
  let dueDateDescription = taskClone.querySelector("#due-date");
  const listItem = taskClone.querySelector("li");
  const deleteButton = taskClone.querySelector("#delete-button");
  const dateInputField = taskClone.querySelector("#date-input");
  const doneButton = taskClone.querySelector("#done-button");
  const importantButton = taskClone.querySelector("#important-button");
  const importantMarker = taskClone.querySelector("#important-marker");

  // Sets the text content to be the object description property
  taskDescription.textContent = task.description;

  // Displays important marker if the task is marked important
  if (task.important === true) {
    importantMarker.style.display = "flex";
  } else {
    importantMarker.style.display = "none";
  }

  // Adds yellow background to important tasks
  if (task.className === "important") {
    listItem.classList.add("important");

    // Handles problem with color clash when important icon is hovered
    importantButton.addEventListener("mouseenter", function () {
      importantButton.style.fill = "var(--dark-clr)";
    });

    // Reset the hover color when the mouse leaves the button
    importantButton.addEventListener("mouseleave", function () {
      importantButton.style.fill = ""; // Reset to default
    });
  }

  // If the object is done, append to the done list
  if (task.complete === true) {
    document.querySelector("#done-list").appendChild(taskClone);
    listItem.classList.add("low-opacity");
    listItem.classList.remove("important");
    importantButton.style.display = "none";
    doneButton.style.fill = "green";
  } else {
  }

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

  // Due date is set via input, and is displayed in the list again and also saved in localStorage
  dateInputField.addEventListener("change", () => {
    task.dueDate = dateInputField.value;

    if (task.dueDate === "") {
      dueDateDescription.textContent = "";
    } else if (task.dueDate !== "") {
      dueDateDescription.textContent = `Due date has been assigned to ${task.dueDate}`;
    }

    console.log(task.dueDate);
    console.log(toDoArray);
    toDoArray.sort(compareTasks);
    displayToDoList();

    setItem();
  });

  // If the dueDate has not been set, the field is empty
  if (task.dueDate === "") {
    dueDateDescription.textContent = "";
  } else if (task.dueDate !== "") {
    // If it has been set, following is shown in the DOM
    dueDateDescription.textContent = `Due date is ${task.dueDate}`;
    dateInputField.value = task.dueDate;
  }

  // Detects the object that is clicked and uses slice to remove it from the array
  deleteButton.addEventListener("click", async () => {
    const findIndex = toDoArray.findIndex((taskToBeFound) => task.id === taskToBeFound.id);
    const currentObject = toDoArray.find((object) => object.id === task.id);
    console.log(findIndex);
    console.log(currentObject);
    currentObject.deleted = true;

    if (currentObject.deleted === true) {
      task.className = "deleted";
    } else {
      task.className = "";
    }

    // Start animation with a delay
    await animateDeletedTask(currentObject);

    function animateDeletedTask() {
      if (task.className === "deleted") {
        listItem.classList.add("deleted");
      }
    }
    animateDeletedTask();

    // Delay before continuing with other code
    setTimeout(() => {
      toDoArray.splice(findIndex, 1);
      displayToDoList();
      setItem();
    }, 500);
  });

  doneButton.addEventListener("click", async (e) => {
    // Find the index of the object that is clicked
    const findIndex = toDoArray.findIndex((taskToBeFound) => task.id === taskToBeFound.id);
    console.log(findIndex);

    // Find the object that is clicked
    const currentObject = toDoArray.find((object) => object.id === task.id);
    console.log(currentObject);

    task.complete = !task.complete;

    if (currentObject.complete === true) {
      task.className = "done";
    } else {
      task.className = "";
    }

    // Start the animation with a delay
    await animateDoneTask(currentObject);

    function animateDoneTask() {
      if (task.className === "done") {
        listItem.classList.add("done");
      }
    }
    animateDoneTask();

    // Delay before continuing with other code
    setTimeout(() => {
      appendObject(currentObject);
      displayToDoList();
      setItem();
    }, 500);
  });

  importantButton.addEventListener("click", () => {
    const findIndex = toDoArray.findIndex((taskToBeFound) => task.id === taskToBeFound.id);
    console.log(findIndex);

    currentObject.important = !currentObject.important;

    if (currentObject.important === true) {
      // Append the clone to the taskClone element
      task.className = "important";
    } else {
      task.className = "";
    }

    toDoArray.sort(compareTasks);
    displayToDoList();
    setItem();
  });

  function compareTasks(a, b) {
    if (a.important && !b.important) {
      return -1; // Move tasks with important = true to the top
    } else if (!a.important && b.important) {
      return 1; // Move tasks with important = false to the bottom
    } else {
      // When both tasks have the same important status or both are unimportant,
      // consider their dueDate (if available)
      if (a.dueDate === "" && b.dueDate !== "") {
        return 1; // Move tasks with no dueDate to the bottom
      } else if (a.dueDate !== "" && b.dueDate === "") {
        return -1; // Move tasks with no dueDate to the bottom
      } else if (a.dueDate !== "" && b.dueDate !== "") {
        // Compare dueDate values as dates (assuming YYYY-MM-DD format)
        const dateA = new Date(a.dueDate);
        const dateB = new Date(b.dueDate);

        if (dateA < dateB) {
          return -1; // Sort by dueDate if both have dueDates defined and dateA is earlier
        } else if (dateA > dateB) {
          return 1; // Sort by dueDate if both have dueDates defined and dateA is later
        }
      }

      // When both tasks have the same important status and no dueDate or have equal dueDates,
      // consider their original order in the array
      return a.id - b.id;
    }
  }
}
