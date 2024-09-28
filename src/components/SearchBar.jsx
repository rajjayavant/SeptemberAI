import React, { useState } from "react";
import logoSearch from '../assets/logo-search.svg';
import logoSend from '../assets/logo-send.svg';
import './SearchBar.css'

const SearchBar = ({ onSendMessage }) => {
    const [inputText, setInputText] = useState("");

    const handleInputChange = (e) => {
        setInputText(e.target.value);
    };

    const handleSendMessage = () => {
        if (inputText.trim() !== "") {
            onSendMessage(inputText);
            setInputText("");
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <div className="search-bar-container">
            <div className="search-bar-wrapper">
                <img src={logoSearch} className="search-icon" alt="Search" />
                <input
                    type="text"
                    className="search-input"
                    placeholder="Chat with September ..."
                    value={inputText}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                />
                <button className="send-button" onClick={handleSendMessage}>
                    <img src={logoSend} className="send-icon" alt="Send" />
                </button>
            </div>
        </div>
    );
};

export default SearchBar;