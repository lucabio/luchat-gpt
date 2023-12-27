import React, { useRef, useEffect, useState } from 'react';
import masterImg from '../../assets/master.png';
import './ChatContainer.css';


function ChatContainer({ chatMessages, isTyping }) {
    const containerRef = useRef(null);

    const [copiedMessageIndices, setCopiedMessageIndices] = useState(new Set());

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTo(0, containerRef.current.scrollHeight);
        }
    }, [chatMessages, isTyping]);

    const copyResponse = (index, responseText) => {
        // Copy the text content of the response to the clipboard
        navigator.clipboard.writeText(responseText)
            .then(() => {
                setCopiedMessageIndices(new Set(copiedMessageIndices.add(index)));
                setTimeout(() => {
                    setCopiedMessageIndices((prevIndices) => {
                        const newIndices = new Set(prevIndices);
                        newIndices.delete(index);
                        return newIndices;
                    });
                }, 1000);
            })
            .catch(err => {
                console.error("Errore durante la copia del testo:", err);
            });
    }

    return (
        <div ref={containerRef} className="chat-container">
            {chatMessages.map((message, index) => (
            <div className={`chat ${message.type}`}>
                <div key={index} className="chat-content">
                    <div className="chat-details">
                        <img src={message.img} alt="user-img" />
                        <p>{message.text}</p>
                    </div>
                    {message.type === "incoming" && (
                        <div>
                            <span onClick={() => copyResponse(index, message.text)} className="material-symbols-rounded">content_copy</span>
                            {copiedMessageIndices.has(index) && <span className="copy-confirm">Copied!</span>}
                        </div>
                    )}
                </div>
            </div>
            ))}
            {isTyping && (
            <div className="chat incoming">
                <div className="chat-content">
                    <div className="chat-content">
                    <div className="chat-details">
                        <img src={masterImg} alt="chatbot-img" />
                        <div className="typing-animation">
                            <div className="typing-dot" style={{"--delay" : "0.2s"}}></div>
                            <div className="typing-dot" style={{"--delay" : "0.3s"}}></div>
                            <div className="typing-dot" style={{"--delay" : "0.4s"}}></div>
                        </div>
                    </div>
                </div>
                </div>
            </div>
            )}
        </div>
    );
}

export default ChatContainer;