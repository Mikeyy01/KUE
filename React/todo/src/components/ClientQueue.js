import React from 'react';
import { useNavigate } from 'react-router-dom';
import KueLogo2 from '../assets/images/logo.png'
import XLogo from '../assets/images/X.svg'
import ClubLogo from '../assets/images/Club.svg'
import '../assets/css/list.css';
import {useState, useEffect} from "react";
import axios from "axios";
import logoHeader from "../assets/images/logo.png";
import acceptBtn from "../assets/images/accept.png";
import declineBtn from "../assets/images/decline.png";
const { REACT_APP_BACKEND_URL } = process.env

//Client Queue List functions
const ClientQueue = () => {
    const [todos, setTodos] = useState([]);
    const navigate = useNavigate();


//retrieve song requests from json server backend
    const getTodos = () =>
        axios(`${REACT_APP_BACKEND_URL}/todos`)
            .then((resp) => setTodos(resp.data));

    //retrieve requested songs from json server ever 1 second.
    useEffect(() => {
        const interval = setInterval(() => {
            getTodos();
        }, 1000); // 1000 milliseconds = 1 second

        return () => clearInterval(interval);
    }, []);
    //setting an empty array, so that code does not rerender infinitely.

    //redirect to homepage
    const returnHome = () => {
        navigate("/");
    }

    return <div>
        <div className='containerBody'>

            <div className='todoBody'>
                <header className='headerLogo'>
                    <img className= "logoHdr" src={logoHeader} width ="30%" height="30%" />
                    <a className='welcomeText'>
                        <h2>Queue List</h2>
                    </a>

                </header>

                {todos
                    .filter(todo => todo.status === "Approved")
                    .map((todo) =>
                    <div key={todo.id} className="todo">
                        <img className="albumCover" src={todo.todo.coverArtURL} alt="cover art"  />
                        <p className="songName">
                            {todo.todo.track}
                        </p>
                        <h3 className="artistName">
                            {todo.todo.artist}
                        </h3>
                        <p className="timeStamp">
                            {todo.timestamp}
                        </p>

                    </div>
                )}

            </div>

        </div>
    </div>
};

export default ClientQueue;