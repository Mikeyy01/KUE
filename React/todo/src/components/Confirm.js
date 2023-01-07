import React, { useState, useEffect } from 'react';
import axios from "axios";
import '../assets/css/payment.css';
import { useLocation } from 'react-router-dom';
import abn from '../assets/images/abn_amro.png';
import ing from '../assets/images/ing.png';
import rabo from '../assets/images/rabobank.png';
import revolut from '../assets/images/revolut.svg';
import kuelogo from '../assets/images/logo.png';
import arrow1 from '../assets/images/arrow.png';

const { REACT_APP_BACKEND_URL } = process.env;

function Confirm() {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState({ artist: '', track: '', coverArtURL: '' });
    const [editableTodo, setEditableTodo] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [selectListVisible, setSelectListVisible] = useState(false);
    const [submitVisible, setSubmitVisible] = useState(false);
    const location = useLocation();
    const artist = decodeURIComponent(location.search.split('artist=')[1].split('&')[0]);
    const track = decodeURIComponent(location.search.split('track=')[1].split('&')[0]);
    const coverArtURL = decodeURIComponent(location.search.split('coverArtURL=')[1].split('&')[0]);
    const timestamp = new Date().toISOString();
    const date = new Date(timestamp);
    const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();



    useEffect(() => {
        // code to update src attribute of searchedTrackImg element with coverArtURL value
        document.getElementById("searchedTrackImg").src = coverArtURL;
        //set the artist, track, and coverArtURL values for newTodo
        setNewTodo({ artist: artist, track: track, coverArtURL: coverArtURL });
    }, []);

    const getTodos = () =>
        axios(`${REACT_APP_BACKEND_URL}/todos`)
            .then((resp) => setTodos(resp.data));

    useEffect(() => {
        getTodos();
    }, []);

    const handleNewTodo = (event) => {
        event.preventDefault();
        //if artist, track, or coverArtURL is not set
        if (!newTodo.artist || !newTodo.track || !newTodo.coverArtURL) {
            return;
        }
        const data = {
            id: todos.length > 0 ? todos[todos.length - 1].id + 1 : 1,
            todo: newTodo,
            completed: false,
            status: 'requested',
            timestamp: formattedDate
        };
        //POST new task
        axios
            .post(`${REACT_APP_BACKEND_URL}/todos`, data)
            .then((resp) => setTodos([...todos, resp.data]));
        setNewTodo("");
    };


    const options = [
        { value: 'bank', label: 'ABN Amro', img: abn },
        { value: 'bank', label: 'ING', img: ing },
        { value: 'bank', label: 'Rabobank', img: rabo },
        { value: 'bank', label: 'Revolut', img: revolut },
    ];

    const toggleSelectList = () => {
        setSelectListVisible(!selectListVisible);
    };

    const handleOptionClick = (option) => {
        setSelectedOption(option);
        setSelectListVisible(false);
        setSubmitVisible(true);
    };



    const TrackConfirm = ({ artist, track }) => {
        return (
            <div className="info">
                <ul className="info">
                    <li className="artist">Artist: {artist}</li>
                    <li className="name">Track: {track}</li>
                </ul>
            </div>
        );
    };

    return (
        <section className="payment">
            <div className="container">
                <header>
                    <a href="index.html">
                        <img src={kuelogo} alt="logo" />
                    </a>
                </header>
                <div className="line" />

                <div className="confirmation">
                    <p className="confirm">Confirm Request</p>

                    <div className="track-row">
                        <img id="searchedTrackImg" />
                        <div className="track-info">
                            <ul className="info">
                                <TrackConfirm artist={artist} track={track} />
                            </ul>
                        </div>
                    </div>
                    <h2>€ 2,50</h2>

                    <form onSubmit={handleNewTodo}>
                        <div className="dropdown">
                            <div className="dropdownField" onClick={toggleSelectList}>
                                {selectedOption && (
                                    <img src={selectedOption.img} alt={selectedOption.label} className="selected_icon" />)}
                                <div id="selectText" style={{ paddingTop: '12px' }} className={`${selectedOption ? 'selected' : ''} choose-bank-text`}>
                                    {selectedOption ? selectedOption.label : 'Choose your bank'}
                                </div>
                                <img src={arrow1} id="arrow" />
                            </div>

                            <ul
                                id="select"
                                className={`${selectListVisible ? '' : 'hide'}`}
                                onChange={(event) => {
                                    setSelectedOption(event.target.value);
                                    setSelectListVisible(false);
                                }}
                            >
                                {options.map((option) => (
                                    <li
                                        key={option.label}
                                        className="options"
                                        value={option}
                                        onClick={() => handleOptionClick(option)}
                                    >
                                        <img src={option.img} alt={option.label} />
                                        <p>{option.label}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <input
                            type="submit"
                            onSubmit={handleNewTodo}
                            value="Confirm and Pay"
                            id="submit"
                            style={{ display: submitVisible ? 'block' : 'none' }}
                        />
                    </form>
                </div>

                <footer />
            </div>
        </section>
    );
}
export default Confirm;