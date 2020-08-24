import React, {useEffect, useState} from 'react';
import axios from 'axios'
import logo from './logo.svg';
import Ticket from './components/Ticket'
import Search from './components/Search'
import './App.css';

function App() {
    const [ticketsToDisplay,setTicketsToDisplay]= useState(['loading'])
    const [ticketsHidden,setTicketsHidden]= useState(0)
    const [query,setQuery] = setState('');
    
    useEffect( () => {
        grabTickets()   
    },[])
   async function grabTickets () {
       const tickets= (await axios.get('/api/tickets')).data;
       console.log('brought',tickets)
       setTicketsHidden(ticketsHidden+1)
       setTicketsToDisplay(tickets)
    }
    function hideTicket(id){
        let newTickets = ticketsToDisplay.slice();
        let ticketToHide= newTickets.find(ticket=>ticket.id===id)
        ticketToHide.hide=true;

        setTicketsToDisplay(newTickets)
    }
    function unHideTickets(){
        let newTickets = ticketsToDisplay.map(ticket=>{
            if(ticket.hide){ticket.hide = false}
            ticketToHide.hide=true;
        }

        setTicketsToDisplay(newTickets)
    }
    function findLocal(e){
        let query = e.target.value;
        setQuery(query);
    }
    function searchTickets(e){
        let query = e.target.value;
        setQuery(query);
    }
    if (ticketsToDisplay[0]==='loading'){
        return <h1>LOADING</h1>
    }else 
    return (
    <main>
    <Search function={findLocal}/>
    {ticketsToDisplay.map((ticket,index)=>{
        return <Ticket key={index} data={ticket} hide={hideTicket}/>
        })}
    </main>
  );
}

export default App;
