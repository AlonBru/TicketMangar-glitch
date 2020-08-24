import React from 'react';

const Sidebar = (props) => {
    const { search } = props; 
    return(
        <input id='searchInput' placeholder='search for a title or a part of one' onChange={search} />
        )
    }
export default Sidebar;