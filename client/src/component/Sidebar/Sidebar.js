import React from 'react';
import UserBlock from '../UserBlock/UserBlock';

function Sidebar() {
    return (
        <div className="sidebar">
            {/* I link della sidebar possono essere inseriti qui */}
            <UserBlock />
            {/* Altri elementi della sidebar */}
        </div>
    );
}

export default Sidebar;