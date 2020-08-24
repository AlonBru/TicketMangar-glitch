import React from 'react';
import Labels from './Label.js';

const Search = (props) => {
    
    return(
        <div className='ticket'>
            <input className='searchBar' placeholder='search for a title or a part of one' onChange={props.function} />
        </div>
        )
    }
export default Search;