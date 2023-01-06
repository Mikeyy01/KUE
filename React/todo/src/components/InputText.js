import '../assets/css/search.css';
import React from 'react';
import {useState, useEffect} from "react";
import axios from "axios";
import deleteIcon from '../assets/images/delete-icon.png';
import searchIcon from '../assets/images/search-icon.png';
import kue2 from '../assets/images/logo2.png';
import { useNavigate } from 'react-router-dom';


const { REACT_APP_BACKEND_URL } = process.env;

const InputText = () => {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');
    const [editableTodo, setEditableTodo] = useState(null);
    const [tracks, setTracks] = useState([]);
    const [songDisplay, setSongDisplay] = useState('');
    const [inputValue, setInputValue] = useState('');
    const navigate = useNavigate();


    const spotifyAccess = (function() {
        const clientID = 'accae6b6c5604b8b9793c93ce82dcb73';
        const clientSecret = 'c131cb4ca8954077bfd42c7b87b0b8d4';

        const getToken = async () => {
            const response = await fetch('https://accounts.spotify.com/api/token', {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/x-www-form-urlencoded',
                    'Authorization' : 'Basic ' + btoa(clientID + ':' + clientSecret)
                },
                body: 'grant_type=client_credentials'
            });

            const data = await response.json();
            return data.access_token;
        }
        const search = async (query) => {
            const token = await getToken();
            const result = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track&access_token=${token}`);
            const data = await result.json();
            return data.tracks.items;
        }

        return {
            search
        }
    })();

    const handleSearch = (e) => {
        const query = e.target.value;
        spotifyAccess.search(query).then(setTracks);
    }

    const msToMinutesAndSeconds = (ms) => {
        let minutes = Math.floor(ms / 60000);
        let seconds = ((ms % 60000) / 1000).toFixed(0);
        return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
    }

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

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    }

    const handleClearInput = () => {
        setInputValue('');
    }

    const handleInput = (e) => {
        handleInputChange(e);
        handleSearch(e);
    }


    const handleTrackSelect = (artist, name, coverArtURL) => {
        navigate(`/confirm?artist=${artist}&track=${name}&coverArtURL=${coverArtURL}`);
    }

    const TrackRow = ({track}) => (
        <div className="track-row" onClick={() => handleTrackSelect(track)}>
            <div className="track-name">{track.name}</div>
            <div className="track-artist">{track.artist}</div>
            <div className="track-duration">{msToMinutesAndSeconds(track.duration)}</div>
        </div>
    );


    return (
                <section className="search">
            <div className="container">
                <header>
                    <a>
                        <img src={kue2} alt="logo" />
                    </a>
                </header>
                <div className="songDisplay">
                    <form id="searchForm" autoComplete="off" onSubmit={handleSearch}>
                        <button id="btnSearch">
                            <img src={searchIcon}  alt="search icon" />
                        </button>
                        <input
                            type="text"
                            name="searchInput"
                            id="input"
                            onChange={handleInput}
                            value={inputValue}
                            placeholder="What song would you like to request?"
                        />
                        {inputValue ? (
                            <img src={deleteIcon} style={{width: '15px'}} alt="Delete icon" onClick={handleClearInput}/>
                        ) : null}
                        <button
                            type="submit"
                            className="btnDelete"
                            >
                        </button>
                    </form>
                    {tracks.map((track) => (
                        <div onClick={() => handleTrackSelect(track.artists[0].name, track.name, track.album.images[2].url)}>
                        <div key={track.id} className="tracks">
                            <div id={track.id}>
                                <div className="track-row">
                                    <img src={track.album.images[2].url} alt="cover art" />
                                    <div className="track-info">
                                        <ul className="info" onClick={handleTrackSelect}>
                                            <li className="title" id="trackName">{track.name}</li>
                                            <li className="artist">{track.artists[0].name}</li>
                                        </ul>
                                    </div>
                                    <div className="track-time">
                                        <p className="time">{msToMinutesAndSeconds(track.duration_ms)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        </div>
                    ))}
                    <div className="songDisplay"></div>

                    <footer></footer>
                </div>
            </div>
        </section>
    );
}
export default InputText;