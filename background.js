// Event listener for receiving messages from popup
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "addTask") {
    addTask(request.task, sendResponse);
    return true;
  } else if (request.action === "getTasks") {
    getTasks(sendResponse);
    return true; // Required to use sendResponse asynchronously
  } else if (request.action === "updateTask") {
    updateTask(request.taskId, request.newTitle, sendResponse);
    return true; // Required to use sendResponse asynchronously
  } else if (request.action === "removeTask") {
    removeTask(request.taskId, sendResponse);
    return true; // Required to use sendResponse asynchronously
  }
});

// Function to add a task to storage
function addTask(task, sendResponse) {
  chrome.storage.sync.get({ tasks: [] }, function (result) {
    var tasks = result.tasks;
    tasks.push(task);
    chrome.storage.sync.set({ tasks: tasks }, function () {
      sendResponse({ message: "Task added successfully", tasks: tasks }); // Modified response object
    });
  });
}

// Function to get tasks from storage
function getTasks(callback) {
  chrome.storage.sync.get({ tasks: [] }, function (result) {
    callback(result.tasks);
  });
}

// Function to remove a task from storage
function removeTask(taskId, sendResponse) {
  chrome.storage.sync.get({ tasks: [] }, function (result) {
    var tasks = result.tasks;
    var updatedTasks = tasks.filter(function (task) {
      return task.id !== Number(taskId); // parse the task ID to a number
    });
    chrome.storage.sync.set({ tasks: updatedTasks }, function () {
      sendResponse({ message: "Task removed successfully", tasks: updatedTasks });
    });
  });
}

// Function to update a task
function updateTask(taskId, newTitle, sendResponse) {
  chrome.storage.sync.get({ tasks: [] }, function (result) {
    var tasks = result.tasks;
    var taskToUpdate = tasks.find(function (task) {
      return task.id === Number(taskId);
    });
    if (taskToUpdate) {
      taskToUpdate.title = newTitle;
      chrome.storage.sync.set({ tasks: tasks }, function () {
        sendResponse({ message: "Task updated successfully", tasks: tasks });
      });
    } else {
      sendResponse({ message: "Task not found" });
    }
  });
}



