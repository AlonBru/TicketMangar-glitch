import React from 'react';
import Labels from './Label';
import axios from 'axios'

const Ticket = (props) => {
// 
    const {id, title, content, userEmail,creationTime, labels,hide,done} = props.data;
    const time = new Date(creationTime).toString().slice(0,24)
    async function markDone(){
        await axios.post(`/api/tickets/${id}/${done? 'undone' : 'done'}`)
        props.update()
    }
    if (hide)return <></>
    return(
        <div className={done? 'done ticket':'ticket'}>
            <button className='hideTicketButton' onClick={()=>props.hide(id)}>Hide Ticket</button>
            <h3>{title} </h3>
            <p>{content}</p>
            <p>By: {userEmail}| Created At : {time} <Labels data={labels}/></p>
            <button className='doneButton' onClick={markDone}> {done? 'Reopen issue':'Mark as Closed'}</button>
            
        </div>
        )
    }
export default Ticket;