import Confirm from './Confirm';
import '../assets/css/list.css';
import {useState, useEffect} from "react";
import axios from "axios";
import acceptBtn from '../assets/images/accept.png'
import declineBtn from '../assets/images/decline.png'
import logoHeader from '../assets/images/logo.png'

const { REACT_APP_BACKEND_URL } = process.env



const TodoList = () => {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState({ artist: '', track: '', coverArtURL: '' });
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
        const interval = setInterval(() => {
            getTodos();
        }, 1000); // 1000 milliseconds = 1 second

        return () => clearInterval(interval);
    }, []);
    //setting an empty bracket, so that code does not rerender infinitely.

    const handleNewTodo = (event) => {
        event.preventDefault();
        //if nothing is typed into text box
        if (!newTodo.artist || !newTodo.track || !newTodo.coverArtURL) {
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
        setNewTodo({ artist: '', track: '', coverArtURL: '' });
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
        if (!editableTodo.todo.track) {
            return;
        }
        const data = {
            id: editableTodo.id,
            todo: {
                artist: editableTodo.todo.artist,
                track: editableTodo.todo.track,
                coverArtURL: editableTodo.todo.coverArtURL,
            },
            completed: editableTodo.completed,
        };
        axios
            .put(`${REACT_APP_BACKEND_URL}/todos/${editableTodo.id}`, data)
            .then((resp) => {
                const updatedTodos = todos.map((todo) =>
                    todo.id === editableTodo.id ? resp.data : todo
                );
                setTodos(updatedTodos);
                setEditableTodo(null);
            });
    };

// html part

    return <div>
        <div className='containerBody'>
    
            <div className='todoBody'>
                <header className='headerLogo'>
                <img className= "logoHdr" src={logoHeader} width ="30%" height="30%" />
                <h2>Welcome DJ&nbsp;</h2>
                <h2 id="djcode"></h2>
                
                 </header>

                <div className='dropDown'>
                     <select className='drpDwn'>
                         <option value = "0" selected >All</option>
                        <option value = "1" >Requested</option>
                        <option value = "2" >Rejected</option>
                        <option value = "3" >Accepted</option>
                     </select>
                
                 </div>

                    {todos.map((todo) =>
                        editableTodo && editableTodo.id === todo.id ? (
                                <div className="todo" key={todo.id} style={{ display: "flex", margin: "8px" }}>
                        <form onSubmit={handleEditTodo}>
                            <div className='selection-box'>
                                <input 
                                type="text"
                                value={editableTodo.todo}
                                onChange={(event) =>
                                setEditableTodo({
                                ...editableTodo,
                                todo: event.target.value,
                                })
                            }
                            /></div>
                            
                        </form>
                            <button onClick={() => setEditableTodo(null)}>X</button>
                                </div>
                            ) : (
                            <div key={todo.id} className="todo" style={{ display: "flex", margin: "20px" , justifyContent : 'center' , alignItems: 'center'}}>
                                <img className="albumCover"src={todo.todo.coverArtURL} alt="cover art" /> 
                                <h3 className="artistName" style={{ textDecoration: todo.completed ? "line-through" : "none" }}>
                                    {todo.todo.artist}
                                </h3>
                                <p className="songName"style={{ textDecoration: todo.completed ? "line-through" : "none" }}>
                                    {todo.todo.track}
                                </p>
                                <p className="timeStamp" style={{ textDecoration: todo.completed ? "line-through" : "none" }}>
                                    {todo.timestamp}
                                </p>
                                
                            <button onClick={() => toggleComplete(todo)} className="accept-button"> <img className= "aBtn" src={acceptBtn} mix-blend-mode ="multiply" width ="25%" height="25%" /></button>
                                <button onClick={() => handleDelete(todo)} className="delete-button"><img className= "dBtn" src={declineBtn} width ="25%" height="25%" /></button>
                            </div>
                    ))}
              
            </div>
        
       </div>
    
     </div>
    
    };

export default TodoList;

