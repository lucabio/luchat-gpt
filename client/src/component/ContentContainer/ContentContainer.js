import React, {useState, useEffect} from 'react';
import Header from '../Header/Header';
import ChatContainer from '../ChatContainer/ChatContainer';
import TypingContainer from '../TypingContainer/TypingContainer';
import superHero from '../../assets/superhero.png';
import masterImg from '../../assets/master.png';
import openAIApi from '../../api/openAIApi';

function ContentContainer() {
    const [chatMessages, setChatMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [theme, setTheme] = useState(localStorage.getItem("themeColor") || "light_mode");

    useEffect(() => {
        document.body.classList.toggle("light-mode", theme === "dark_mode");
    }, [theme]);

    const changeTheme = () => {
        const newTheme = theme === "light_mode" ? "dark_mode" : "light_mode";
        setTheme(newTheme);
        localStorage.setItem("themeColor", newTheme);
    };

    const handleOutgoingChat = async (userText) => {
        if (!userText) return;

        const newMessage = {
            text: userText,
            type: 'outgoing',
            img: superHero
            // qui puoi aggiungere ulteriori dettagli come timestamp, avatar dell'utente, ecc.
        };
        setIsTyping(true);
        setChatMessages([...chatMessages, newMessage]);
        await getChatResponse(userText);
    };

    const getChatResponse = async (userText) => {
        
        try {
            const response = await openAIApi.getChatResponse(userText);
            const newMessage = {
                text: response.choices[0].text.trim(),
                type: 'incoming',
                img: masterImg
                // qui puoi aggiungere ulteriori dettagli come timestamp, avatar dell'utente, ecc.
            };
            setChatMessages((prevMessages) => [...prevMessages, newMessage]);
            setIsTyping(false);
        } catch (error) {
            const newMessage = {
                text: "Oops! Something went wrong while retrieving the response. Please try again.",
                type: 'incoming',
                img: masterImg
                // qui puoi aggiungere ulteriori dettagli come timestamp, avatar dell'utente, ecc.
            };
            setChatMessages((prevMessages) => [...prevMessages, newMessage]);
            setIsTyping(false);
        }
    }
    return (
        <div className="content-container">
            <Header />
            <ChatContainer chatMessages={chatMessages} isTyping={isTyping} setIsTyping={setIsTyping}/>
            <TypingContainer onSend={handleOutgoingChat} onThemeChange={changeTheme}/>
        </div>
    );
}

export default ContentContainer;