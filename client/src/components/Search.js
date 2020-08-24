import React from 'react';

const Search = (props) => {
    
    return(
        <input id='searchInput' placeholder='search for a title or a part of one' onChange={props.function} />
        )
    }
export default Search;