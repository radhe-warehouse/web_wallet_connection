//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
contract TodoList {
    struct Task {
        uint256 id;
        string content;
        bool completed;
    } 
    mapping(uint256 => Task) public tasks;
    uint256 public taskCount;
    event TaskCreated(uint256 id, string content);
    event TaskCompleted(uint256 id, bool completed);
    function createTask(string memory _content) public {
        require(bytes(_content).length > 0, "Content cannot be empty");
        taskCount++;
        tasks[taskCount] = Task(taskCount, _content, false);
        emit TaskCreated(taskCount, _content);
    }
    function toggleTask(uint256 _id) public {
        require(_id > 0 && _id <= taskCount, "Task ID does not exist");
        Task memory _task = tasks[_id];
        _task.completed = !_task.completed;
        tasks[_id] = _task;
        emit TaskCompleted(_id, _task.completed);
    }
}