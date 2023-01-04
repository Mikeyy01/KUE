import React from 'react';
import {useState, useEffect} from "react";
import axios from "axios";

const { REACT_APP_BACKEND_URL } = process.env;

const ACCESS_TOKEN = 'BQAXgo2kvvRbTMkni5DPv8EXobcSHIENNvTRwTq_9vJ7RKTrkYVa_vk3K22y9zYDaVwtP65u8hdYTo9zKeuSM3Q4ygqjYQNDqgWm6OuZpcq3d9VxTcHwDkJ3ZeMfnT2eL0VeWPbEyOJ-YKgOIlfNO4dMrFghFXIgSs5jvwzpJ72_9gQh5sRsTnZjc_uAVtDov-M0rZXiZW8AjYSwBBOu7ssizkHSHzRQ4_jS5pCY6haq0d8eOg3RTqiZ3Rq6DuPNd5iza5ErXwsYmwovweRGoI_L_ArjC4LK8lWfXyTa62hthMoDb6Do0B32ngkSYLLHdI_L';

const InputText = () => {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');
    const [editableTodo, setEditableTodo] = useState(null);
    const [suggestions, setSuggestions] = useState([]); // new state variable to store song suggestions

    const getTodos = () =>
        axios(`${REACT_APP_BACKEND_URL}/todos`)
            .then((resp) => setTodos(resp.data));

    useEffect(() => {
        getTodos();
    }, []);

    const searchSongs = (query) => {
        // make a request to the Spotify API's search endpoint with the query parameter and the access token as the authorization header
        axios.get(`https://api.spotify.com/v1/search?q=${query}&type=track`, {
            headers: {
                'Authorization': `Bearer ${ACCESS_TOKEN}`
            }
        })
            .then((response) => {
                setSuggestions(response.data.tracks.items); // update the suggestions state variable with the list of song suggestions
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const handleInputChange = (event) => {
        setNewTodo(event.target.value);
        setSuggestions([]); // clear the suggestions when the input textbox value changes

        searchSongs(event.target.value); // call the search function every time the input text changes
    }

    const handleNewTodo = (event) => {
        event.preventDefault();
        if (!newTodo) {
            return;
        }
        const data = {
            id: todos.length > 0 ? todos[todos.length - 1].id + 1 : 1,
            todo: newTodo,
            completed: false,
        };
        axios
            .post(`${REACT_APP_BACKEND_URL}/todos`, data)
            .then((resp) => setTodos([...todos, resp.data]));
        setNewTodo("");
    };

    return (
        <form onSubmit={handleNewTodo}>
            <input
                type="text"
                placeholder="Baby - Justin Bieber"
                value={newTodo}
                onChange={handleInputChange}
            />
            <button type="submit">🔍</button>
            {/* render the list of suggestions in a dropdown menu */}
            {suggestions.length > 0 && (
                <select onChange={(event) => {
                    setNewTodo(event.target.value); // set the input textbox value to the selected suggestion's name when the suggestion is clicked
                    setSuggestions([]); // clear the suggestions when a suggestion is selected
                }}>
                    {suggestions.map((suggestion) => (
                        <option key={suggestion.id} value={suggestion.name}>
                            {suggestion.name}
                        </option>
                    ))}
                </select>
            )}
        </form>
    );
};

export default InputText;
