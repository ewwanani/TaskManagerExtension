// Function to create a new task element
function createTaskElement(task) {
    var li = document.createElement("li");
    li.textContent = task.title;
    li.setAttribute("data-id", task.id);
  
    var updateBtn = document.createElement("button"); // Adding the update button
    updateBtn.textContent = "Update";
    updateBtn.className = "update-btn";
    li.appendChild(updateBtn);
    
    var removeBtn = document.createElement("button"); //  Adding the remove button
    removeBtn.textContent = "Remove";
    removeBtn.className = "remove-btn";
    li.appendChild(removeBtn);
    
    return li;
  }
  
  // Function to render the task list
  function renderTaskList(tasks) {
    var taskList = document.getElementById("taskList");
    taskList.innerHTML = "";
    tasks.forEach(function (task) {
      var taskElement = createTaskElement(task);
      taskList.appendChild(taskElement);
    });
  }
  
  // Event listener for form submission
document.getElementById("taskForm").addEventListener("submit", function (e) {
  e.preventDefault();
  var taskInput = document.getElementById("taskInput");
  var taskTitle = taskInput.value.trim();
  if (taskTitle !== "") {
    var task = {
      id: Date.now(),
      title: taskTitle
    };
    chrome.runtime.sendMessage({ action: "addTask", task: task }, function(response) {
      if(chrome.runtime.lastError) {
        console.error("Error: ", chrome.runtime.lastError.message);
    } else {
        console.log(response);
    }
    
      if (response && response.message === "Task added successfully" && response.tasks) {
        renderTaskList(response.tasks);
      }
    });
    taskInput.value = "";
  }
});
  
  // Event listener for receiving tasks from background
  chrome.runtime.sendMessage({ action: "getTasks" }, function (tasks) {
    renderTaskList(tasks);
  });
  

// Event delegation for task updating
document.getElementById("taskList").addEventListener("click", function (e) {
  if (e.target.classList.contains("update-btn")) {
    var updateButton = e.target;
    var listItem = updateButton.parentNode;
    var taskId = listItem.getAttribute("data-id");
    var newTitle = prompt("Enter new task title:");
    if (newTitle) {
      chrome.runtime.sendMessage({ action: "updateTask", taskId: taskId, newTitle: newTitle }, function (response) {
        if (chrome.runtime.lastError) {
          console.error("Error: ", chrome.runtime.lastError);
          return;
        }
        if (response && response.message === "Task updated successfully" && response.tasks) {
          renderTaskList(response.tasks);
        }
      });
    }
  }
});

  
// Event delegation for task removal
document.getElementById("taskList").addEventListener("click", function (e) {
    if (e.target.classList.contains("remove-btn")) {
      var removeButton = e.target;
      var listItem = removeButton.parentNode;
      var taskId = listItem.getAttribute("data-id");
      chrome.runtime.sendMessage({ action: "removeTask", taskId: taskId }, function (response) {
        if (chrome.runtime.lastError) {
          console.error("Error: ", chrome.runtime.lastError);
          return;
        }
        if (response && response.message === "Task removed successfully" && response.tasks) {
          renderTaskList(response.tasks);
        }
      });
    }
  });
  
  
  
  
  
  