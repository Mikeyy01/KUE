import React, { useState, useEffect   } from 'react';
import '../assets/css/payment.css';
import { useLocation } from 'react-router-dom';
import abn from '../assets/images/abn_amro.png';
import ing from '../assets/images/ing.png';
import rabo from '../assets/images/rabobank.png';
import revolut from '../assets/images/revolut.svg';
import kuelogo from '../assets/images/logo.png';
import arrow1 from '../assets/images/arrow.png';


function Confirm() {
    const [selectedOption, setSelectedOption] = useState(null);
    const [selectListVisible, setSelectListVisible] = useState(false);
    const [submitVisible, setSubmitVisible] = useState(false);
    const location = useLocation();
    const artist = decodeURIComponent(location.search.split('artist=')[1].split('&')[0]);
    const track = decodeURIComponent(location.search.split('track=')[1].split('&')[0]);
    const coverArtURL = decodeURIComponent(location.search.split('coverArtURL=')[1].split('&')[0]);

    useEffect(() => {
        // code to update src attribute of searchedTrackImg element with coverArtURL value
        document.getElementById("searchedTrackImg").src = coverArtURL;
    }, []);


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

                    <form action="pending.html">
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
                            value="Confirm and Pay"
                            id="submit"
                            style={{ display: submitVisible ? 'block' : 'none' }}
                            href="pending.html"
                        />
                    </form>
                </div>

                <footer />
            </div>
        </section>
    );
}
export default Confirm;