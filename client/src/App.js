import React, { useEffect, useState } from 'react';
import axios from 'axios'
import Ticket from './components/Ticket'
import Search from './components/Search'
import ShowButton from './components/ShowButton'
import './App.css';

function App() {
    const [ticketsToDisplay,setTicketsToDisplay]= useState(['loading'])
    const [ticketsHidden,setTicketsHidden]= useState(0)
    
    async function grabTickets () {
       const tickets= (await axios.get('/api/tickets')).data;
       console.log('brought',tickets)
       setTicketsToDisplay(tickets)
    }
    
    useEffect( () => {
        grabTickets()   
    },[])
   
    function hideTicket(id){
        let newTickets = ticketsToDisplay.slice();
        let ticketToHide= newTickets.find(ticket=>ticket.id===id)
        ticketToHide.hide=true;
        setTicketsHidden(ticketsHidden+1)
        setTicketsToDisplay(newTickets)
    }
    function unHideTickets(){
        let newTickets = ticketsToDisplay.map(ticket=>{
            if(ticket.hide){ticket.hide = false}
            return ticket
        })
        setTicketsToDisplay(newTickets);
        setTicketsHidden(0);
    }
    async function  searchTickets(e){
        let query = e.target.value;
        console.log('searching', query);
        let tickets = (await axios.get(`/api/tickets?searchText=${query}`)).data;
        setTicketsToDisplay(tickets)
    }
    function Mail(){
        window.open('mailto:test@example.com?subject=subject&body=body');
    }
    if (ticketsToDisplay[0]==='loading'){
        
        return (<div>
        <Search search={searchTickets}/><h1>LOADING</h1>
        </div>
        )
    }else 
    return (
    <main>
        <Search search={searchTickets}/>
        <ShowButton 
        hidden={ticketsHidden} 
        function={unHideTickets}
        />
        {ticketsToDisplay.map((ticket,index)=>{
        return <Ticket key={index} data={ticket} hide={hideTicket} update={grabTickets}/>
        })}
    </main>
  );
}

export default App;
