import React from 'react';
import Sidebar from '../../component/Sidebar/Sidebar';
import ContentContainer from '../../component/ContentContainer/ContentContainer';

function Chat() {

    return (
        <div className="main-container">
            <Sidebar />
            <ContentContainer />
        </div>
    );
}

export default Chat;
