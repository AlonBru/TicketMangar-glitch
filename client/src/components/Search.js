import React from 'react';

const Search = (props) => {
    const { search } = props; 
    return(
        <input 
        id='searchInput' 
        placeholder='search for a title or a part of one' 
        onChange={search} />
        )
    }
export default Search;