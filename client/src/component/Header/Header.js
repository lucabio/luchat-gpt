import React from 'react';
import chatImage from '../../assets/chat.png';

function Header() {
    return (
        <header className="main-header">
            <div className="logo-container">
                <img src={chatImage} alt="Logo Azienda" className="company-logo" />
            </div>
            <div className="logout-container">
                <button className="logout-button">Logout</button>
            </div>
        </header>
    );
}

export default Header;