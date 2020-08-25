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
        hideDone:{active:false},
        timeRange:{active:false, range:'Always'}
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
        
        const { hideDone, timeRange,filterByLabels  } = options;
        console.log(timeRange)
        // const {id, title, content, userEmail,creationTime, labels,hide,done} = ticket;
        let filteredTickets= ticketsToDisplay.filter(ticket=>{//filters hidden tickets
            return (!ticket.hide)
        })
        //next filters by options (if they are active )
        if(hideDone.active) {//filter done tickets
            filteredTickets= filteredTickets.filter(ticket=>{
              return (!ticket.done)  
            })
        }
        if(timeRange.active) {//filter tickets by creation time
            filteredTickets= filteredTickets.filter(ticket=>{
                const {creationTime} = ticket
                const now = Date.now()
                const timeRangeValues ={
                "Last 24 Hours":now-86400000,
                "Last Week":now-(7*86400000),
                "Last Month":now-(31*86400000),
                "Last Year":now-(345*86400000),
                "Last 2 Years":now-(345*86400000*2),
                "Last 5 Years":now-(345*86400000*5),
                "Always":0,
                }              
              return (creationTime>timeRangeValues[timeRange.range])  
            })
        }

        
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
                    <p> closed tickets: {options.hideDone? 'hidden':'shown'} </p>
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
