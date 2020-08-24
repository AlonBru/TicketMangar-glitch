import React from 'react';

const ShowButton = (props) => {
    if(props.hidden===0){return <></>}
    return(
        <div className='showButton'>
            <p><span id='hideTicketsCounter'>{props.hidden}</span> Tickets are hidden <button id='restoreHideTickets' onClick={props.function}>Show All Hidden</button></p>
            
        </div>
    )
        
    }
export default ShowButton;