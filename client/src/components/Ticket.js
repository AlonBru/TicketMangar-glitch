import React from 'react';
import Labels from './Label';
import axios from 'axios'

const Ticket = (props) => {
 
    const {id, title, content, userEmail,creationTime, labels,hide,done} = props.data;
    const time = new Date(creationTime).toString().slice(0,24)
    async function markDone(){
        await axios.post(`/api/tickets/${id}/${done? 'undone' : 'done'}`)
        props.update()
    }
    return(
        <div className={done? 'done ticket':'ticket'}>
            <button className='hideTicketButton' onClick={()=>props.onHide(id)}>Hide Ticket</button>
            <h3>{title} </h3>
            <p>{content}</p>
            <p>By: <a className='clickableMail' href={`mailto:${userEmail}
        ?subject=About your enquiry (ticket id ${id}...)
        &body=Hello,%0D%0AThis mail is regarding your ticket titled "${title}"%0D%0A`
        }>
        {userEmail}</a>| Created At : {time} <Labels data={labels}/></p>
            <button className='doneButton' onClick={markDone}> {done? 'Reopen issue':'Mark as Closed'}</button>
            
        </div>
        )
    }
export default Ticket;