import React from 'react';
import axios from 'axios';
import Labels from './Label';

const Ticket = (props) => {
    const {data,labelClick} = props
    const {
        id, title, content, userEmail, creationTime, labels, hide, done,
    } = data;
  const time = new Date(creationTime).toString().slice(0, 24);
  async function markDone() {
    await axios.post(`/api/tickets/${id}/${done ? 'undone' : 'done'}`);
    props.update();
  }
  const formatText = (text) => {
    let splitText = text.split(/\. /)
    return splitText.join('.\n');
  };
  if(labels&&labels[1]==='Api'){
    }
  return (
    <div 
    className={done ? 'done ticket' : 'ticket'} 
    onClick={labelClick}
    style={{color:done ? '#ddd' : 'black'}}>
      <div className='ticketTitleSpace' >
        <div className='hideTicketButton' onClick={() => props.onHide(id)}>
            <div className='sliceContainer ' >
                <a className=" btn-slice" >
                    <div class="top"><span>Hide Ticket</span></div>
                    <div class="bottom"><span>Hide Ticket</span></div>
                </a>  
            </div>
        </div>
        <h3 className='ticketTitle'>
          {title}        
        </h3>  
      </div>
        
      <p className='ticketContent'>{formatText(content)}</p>

      <span className='ticketBy'>
        <strong>By: </strong>
        <a
          className="clickableMail"
          href={`mailto:${userEmail}
          ?subject=About your enquiry (ticket id ${id}...)
          &body=Hello,%0D%0AThis mail is regarding your ticket titled "${title}"%0D%0A`}
        >
          {userEmail}
        </a>
      </span>{' '}|{' '} 
      <span className='ticketTime'>
        <strong>Created: </strong>
        {time}
        {' '}
      </span><br/>
      <div className='ticketDetails'>
      <span className='ticketLabels'>
        <strong>Labels: </strong>
        <Labels data={labels} />
        <button class="doneButton btn btn-flip-down" onClick={markDone}>
          Flip Down
          <div 
              class="front" 
                  style={{
                      backgroundColor:done
                      ?'red'
                      :'#90ee90'                
                  }}
              >
              This Ticket is {done?'Closed':'Open'}
          </div>
          <div class="back" style={{backgroundColor:!done?'red':'#90ee90'}}> {done?'Reopen Ticket?':'Close Ticket?'}</div>
        </button>
      </span>
      </div>
      
    </div>
  );
};
export default Ticket;
