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
        filterByLabels:[],
        hideClosed:{active:false},
        timeRange:{active:false}
    })

    async function grabTickets () {
       const tickets= (await axios.get('/api/tickets')).data;
       console.log('brought',tickets)
       setTicketsToDisplay(tickets)
    }
    
    useEffect( () => {
        grabTickets()   
    },[])
    function renderTickets(){
        const filteredTickets= ticketsToDisplay.filter(ticket=>{
            const { filterByLabels, hideClosed, timeRange } = options;
            const {id, title, content, userEmail,creationTime, labels,hide,done} = ticket;
            const isOpen = hideClosed? !done : true;
            // const isWithLabels = filterByLabels.length===0? true : '';//TODO implement
            // const inTimeRange = timeRange? : true;
            return (!hide&&isOpen)
        })
        console.log( 'filtered',filteredTickets)
        return filteredTickets.map((ticket)=>{
            return(
                <Ticket 
                key={ticket.id}
                data={ticket}
                onHide={hideTicket}
                update={grabTickets} 
                options={options} />
            )
            })
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
                <div id='optionsDisplay'>
                    <p> filter by labels: {
                        options.filterByLabels.length?
                        options.filterByLabels
                        .filter(label=>label.active)
                        .map(label=><span key={label.name}>{label.name}</span>)
                        :'none'}
                    </p>
                    <p> closed tickets: {options.hideClosed? 'hidden':'shown'} </p>
                    <p> time range: {options.timeRange.active?options.timeRange.range:'all'} </p>
                </div>
                <Search search={searchTickets}/>
                <ShowButton 
                hiddenTickets={ticketsHidden.length} 
                function={unHideTickets}
                />
                {renderTickets()}
                {/* {ticketsToDisplay.map((ticket)=>{
                return(
                    <Ticket 
                    key={ticket.id}
                    data={ticket}
                    onHide={hideTicket}
                    update={grabTickets} 
                    options={options} />
                )
                })} */}
            </main>
            
        </>
  );
}

export default App;
