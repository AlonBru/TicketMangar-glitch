import React, { useEffect, useState } from 'react';
import axios from 'axios'
import Ticket from './components/Ticket'
import Search from './components/Search'
import Sidebar from './components/Sidebar'
import ShowButton from './components/ShowButton'
import './App.css';

function App() {
    const [ticketsToDisplay,setTicketsToDisplay]= useState(['loading'])
    const [options,setOptions]= useState({
        filterByLabel:[],
        hideClosed:false,
        timeRange:false
    })

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
        setTicketsToDisplay(newTickets)
    }
    function unHideTickets(){
        let newTickets = ticketsToDisplay.map(ticket=>{
            if(ticket.hide){ticket.hide = false}
            return ticket
        })
        setTicketsToDisplay(newTickets);
    }
    async function  searchTickets(e){
        let query = e.target.value;
        console.log('searching', query);
        let tickets = (await axios.get(`/api/tickets?searchText=${query}`)).data;
        setTicketsToDisplay(tickets)
    }
    
    const ticketsHidden = ticketsToDisplay.filter(ticket=>ticket.hide);
    if (ticketsToDisplay[0]==='loading'){
        
        return (<div>
        <Search search={searchTickets}/><h1>LOADING</h1>
        </div>
        )
    }else 
    return (
            <>
            <main id='name'>
                <Sidebar options={{ ...options }} setOptions={setOptions} />
                <div>
                    <p> filter by labels: {
                        options.filterByLabel.length?
                        options.filterByLabel
                        .filter(label=>label.active)
                        .map(label=><span key={label.name}>{label.name}</span>)
                        :'none'}
                    </p>
                    <p> closed tickets: {options.hideClosed? 'hidden':'shown'} </p>
                    <p> time range: {options.timeRange?options.timeRange:'all'} </p>
                </div>
                <Search search={searchTickets}/>
                <ShowButton 
                hiddenTickets={ticketsHidden.length} 
                function={unHideTickets}
                />
                {ticketsToDisplay.map((ticket)=>{
                return(
                     <Ticket key={ticket.id} data={ticket} onHide={hideTicket} update={grabTickets} />
                     )
                })}
            </main>
            
        </>
  );
}

export default App;
