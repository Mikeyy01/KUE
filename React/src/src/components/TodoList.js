import {useState, useEffect} from "react";
import axios from "axios";
const { REACT_APP_BACKEND_URL } = process.env

const TodoList = () => {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');
    const [editableTodo, setEditableTodo] = useState(null);

const getTodos = () =>

    axios(`${REACT_APP_BACKEND_URL}/todos`)
        .then((resp) => setTodos(resp.data));

// OLD FETCH METHOD
    // fetch(`${REACT_APP_BACKEND_URL}/todos`)
    //     //convert data to json
    //     .then((data) => data.json())
    //     //place data into Todos
    //     .then((data) => setTodos(data));

    useEffect(() => {
         getTodos();
       },[]);
    //setting an empty bracket, so that code does not rerender infinitely.

    const handleNewTodo = (event) => {
        event.preventDefault();
        //if nothing is typed into text box
        if (!newTodo){
           return;
        }
        const data = {
            id: todos.length > 0 ? todos[todos.length - 1].id + 1 : 1,
            todo: newTodo,
            completed: false,
        };
        //POST new task
        axios
            .post(`${REACT_APP_BACKEND_URL}/todos`,data)
            .then((resp) => setTodos([...todos, resp.data]));
        setNewTodo("");
    };

const handleDelete = (todo)=>{
    axios.delete(`${REACT_APP_BACKEND_URL}/todos/${todo.id}`)
        .then((resp) => {
            //newTodos will filter the t0d0 tasks removing deleted id, and rerendering the list
           const newTodos = todos.filter(el => el.id !== todo.id)
            setTodos(newTodos);
        })
    .catch(err => console.log(err));
};


const toggleComplete = todo => {
    axios.put(`${REACT_APP_BACKEND_URL}/todos/${todo.id}`, {
        ...todo,
        completed: !todo.completed
    })
        .then((resp) =>{
            const newTodos = todos.map((el) => {
                if (el.id !== todo.id){
                    return el;
                }
                else {
                    return resp.data;
                }
            });
            setTodos(newTodos);
        });
};



const handleEditTodo = (event) => {
    event.preventDefault();
    if (!editableTodo || !editableTodo.todo){
        return;
    }
    axios.put(
        `${REACT_APP_BACKEND_URL}/todos/${editableTodo.id}`,
        editableTodo)
        .then(resp => {
            const newTodos = todos.map(el => {
                if (el.id !== editableTodo.id){
                    return el;
                }
                return  editableTodo;
            });
            setTodos(newTodos);
            setEditableTodo(null);
        });
}


    return <div>
        {/*<InputText*/}
        {/*    newTodo={newTodo}*/}
        {/*    setNewTodo={setNewTodo}*/}
        {/*    handleNewTodo={handleNewTodo}*/}
        {/*/>*/}
        {todos.map((todo) =>
            editableTodo && editableTodo.id === todo.id ? (
                    <div key={todo.id} style={{ display: "flex", margin: "8px" }}>
            <form onSubmit={handleEditTodo}>
                <input
                    type="text"
                    value={editableTodo.todo}
                    onChange={(event) =>
                    setEditableTodo({
                    ...editableTodo,
                    todo: event.target.value,
                })
                }
                />
            </form>
                <button onClick={() => setEditableTodo(null)}>X</button>
                    </div>
                ) : (
            <div key={todo.id} style={{ display: "flex", margin: "8px" }}>
            <p style={{ textDecoration: todo.completed ? "line-through" : "none"}}>{todo.todo}</p>
                <button onClick={() => setEditableTodo(todo)}>Edit</button>
                <button onClick={() => toggleComplete(todo)}>V</button>
                <button onClick={() => handleDelete(todo)}>X</button>

            </div>
        ))}
    </div>
};

export default TodoList;

