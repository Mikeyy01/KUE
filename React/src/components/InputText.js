import React from 'react';
import {useState, useEffect} from "react";
import axios from "axios";
const { REACT_APP_BACKEND_URL } = process.env


const InputText = () => {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');
    const [editableTodo, setEditableTodo] = useState(null);

    const getTodos = () =>

        axios(`${REACT_APP_BACKEND_URL}/todos`)
            .then((resp) => setTodos(resp.data));


    useEffect(() => {
        getTodos();
    }, []);
    //setting an empty bracket, so that code does not rerender infinitely.

    const handleNewTodo = (event) => {
        event.preventDefault();
        //if nothing is typed into text box
        if (!newTodo) {
            return;
        }
        const data = {
            id: todos.length > 0 ? todos[todos.length - 1].id + 1 : 1,
            todo: newTodo,
            completed: false,
        };
        //POST new task
        axios
            .post(`${REACT_APP_BACKEND_URL}/todos`, data)
            .then((resp) => setTodos([...todos, resp.data]));
        setNewTodo("");
    };

        return (
            <form onSubmit={handleNewTodo}>
                <input
                    type="text"
                    placeholder="add a task"
                    value={newTodo}
                    onChange={event => setNewTodo(event.target.value)}
                />
            </form>
        );
};

export default InputText;