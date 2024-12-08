// components/temptest.js
const addressData = require('../contracts/contract-address.json');
const TodoListArtifact = require('../contracts/TodoList.json');

export function getcredentials() {
    const contractAddress = addressData.TodoList;
    const todoListABI = TodoListArtifact.abi;
    
    return {
        contractAddress,
        todoListABI
    };
}