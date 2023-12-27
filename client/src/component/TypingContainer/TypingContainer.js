import React, {useState, useRef, useEffect } from 'react';
import Button from '../Button/Button';

function TypingContainer({ onSend, onThemeChange, theme }) {
    const [inputValue, setInputValue] = useState("");
    const textareaRef = useRef(null);
    const initialInputHeight = useRef(null);

    useEffect(() => {
        // Imposta l'altezza iniziale al montaggio del componente
        initialInputHeight.current = textareaRef.current.scrollHeight;
        console.log(`initialInputHeight.current, ${initialInputHeight.current}`);
    }, []);

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
        textareaRef.current.style.height = `${initialInputHeight.current}px`;
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    };

    const handleSendClick = () => {
        if (inputValue.trim()) {
            onSend(inputValue.trim());
            setInputValue("");  // Resetta il campo di input dopo l'invio
            textareaRef.current.style.height = `${initialInputHeight.current}px`;
        }
    };
    
    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
            e.preventDefault();
            handleSendClick();
        }
    };

    return (
        <div className="typing-container">
            <div className="typing-content">
                {/* Altri elementi del container di digitazione */}
                <div className="typing-controls margin-right">
                    <Button materialId="attach-btn" text="attach_file" onClick={() => {}} />
                </div>
                <div className="typing-textarea">
                    <textarea
                        ref={textareaRef}
                        id="chat-input" 
                        spellCheck="false" 
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown} 
                        placeholder="Enter a prompt here" required></textarea>
                    <Button materialId="send-btn" text="send" onClick={handleSendClick}/>
                </div>
                <div className="typing-controls">
                    <Button materialId="theme-btn" text="light_mode" onClick={onThemeChange} theme={theme} />
                    <Button materialId="delete-btn" text="delete" onClick={() => {}} />
                </div>
            </div>
        </div>
    );
}

export default TypingContainer;