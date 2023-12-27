import React from 'react';

function Button({ text, onClick, materialId }) {
    return (
        <span id={materialId} onClick={onClick} className="material-symbols-rounded" >{text}</span>
    );
}

export default Button;