import React, {useEffect, useState} from 'react';
import axios from 'axios'
import logo from './logo.svg';
import Ticket from './components/Ticket'
import Search from './components/Search'
import ShowButton from './components/ShowButton'
import './App.css';

function App() {
    const [ticketsToDisplay,setTicketsToDisplay]= useState(['loading'])
    const [ticketsHidden,setTicketsHidden]= useState(0)
    
    useEffect( () => {
        grabTickets()   
    },[])
   async function grabTickets () {
       const tickets= (await axios.get('/api/tickets')).data;
       console.log('brought',tickets)
       setTicketsToDisplay(tickets)
    }
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
        console.log('searching', query)
        let tickets = (await axios.get(`/api/tickets?searchText=${query}`)).data;
        setTicketsToDisplay(tickets)
    }

    if (ticketsToDisplay[0]==='loading'){
        return <h1>LOADING</h1>
    }else 
    return (
    <main>
    <ShowButton hidden={ticketsHidden} function={unHideTickets} />
    <Search function={searchTickets}/>
    {ticketsToDisplay.map((ticket,index)=>{
        return <Ticket key={index} data={ticket} hide={hideTicket}/>
        })}
    </main>
  );
}

export default App;
