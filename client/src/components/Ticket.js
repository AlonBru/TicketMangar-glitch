import React from 'react';
import Labels from './Label.js';

const Ticket = (props) => {
//     "id": "36043e
// "title": "Wix
// "content": "H
// "userEmail": 
// "creationTime
// "labels": [
    const {id, title, content, userEmail,creationTime, labels,hide} = props.data;
    const time = new Date(creationTime).toString().slice(0,24)
    if (hide)return <></>
    return(
        <div className='ticket'>
            <button className='hideTicketButton' onClick={()=>props.hide(id)}>Hide Ticket</button>
            <h3>{title} </h3>
            <p>{content}</p>
            <p>By{userEmail}| Created {time}</p>
            <Labels data={labels}/>
        </div>
        )
    }
export default Ticket;