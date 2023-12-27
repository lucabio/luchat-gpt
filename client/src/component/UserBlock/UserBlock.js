import React from 'react';
import User from '../../assets/user.png';

function UserBlock() {
    return (
        <div className="user-section">
            <a href="#" className="user-block">
                <img src={User} alt="Avatar" className="user-avatar" />
                <span className="user-link">Nome Utente</span>
            </a>
            <div className="dropdown-menu">
                {/* I link del menu vanno qui */}
            </div>
        </div>
    );
}

export default UserBlock;