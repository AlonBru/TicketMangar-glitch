import React, { useEffect, useState } from 'react';
import axios from 'axios'
import Ticket from './components/Ticket'
import Search from './components/Search'
import Sidebar from './components/Sidebar'
import ShowButton from './components/ShowButton'
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import './App.css';

function App() {
    const [options,setOptions]= useState({
        displayMenu:true,
        filterLabels:[],
        hideDone:{active:false},
        timeRange:{active:false, range:'Always'}
    })
    const [ticketsToDisplay,setTicketsToDisplay]= useState(['loading'])
    const getAvailableLabels = (tickets)=>{
            const labelsArray=[]
            tickets.forEach(ticket=>{
                if(!ticket.labels){return}
                ticket.labels.forEach(label=>{
                    if(!labelsArray.includes(label))labelsArray.push(label)
                }) 
            })
            console.log('Available Labels',labelsArray)
            return labelsArray.map(label=> Object({name:label,active:false}));
        }
    async function grabTickets () {
        const tickets= (await axios.get('/api/tickets')).data;
        console.log('brought',tickets)
        setTicketsToDisplay(tickets)
        const optionsWithLabels={...options}
        optionsWithLabels.filterLabels=getAvailableLabels(tickets)
        setOptions(optionsWithLabels)
    }
    useEffect( () => {
        grabTickets();
    },[])
    const toggleMenu=()=>{
        const changedOptions= {...options};
        changedOptions.displayMenu= !changedOptions.displayMenu
        console.log(changedOptions)

        setOptions(changedOptions)

    }
    function hideTicket(id){
        const copyOfTickets = ticketsToDisplay.slice();
        let ticketToHide= copyOfTickets.find(ticket=>ticket.id===id)
        ticketToHide.hide=true;
        setTicketsToDisplay(copyOfTickets)
    }
    function renderTickets(){
        const { hideDone, timeRange, filterLabels  } = options;
        //filters hidden tickets
        let filteredTickets= ticketsToDisplay.filter(ticket=>{
            return (!ticket.hide)
        })
        //filters by options (if they are active)
        if(hideDone.active) {//filter done tickets
            const filterByDone = (ticket) => {
                return (!ticket.done)  
              }
            filteredTickets= filteredTickets.filter(filterByDone)
        }
        if(timeRange.active) {//filter tickets by creation time
            const filterByTime = (ticket)=>{
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
            }     
            filteredTickets= filteredTickets.filter(filterByTime)
        }
        if(filterLabels.some(label=>label.active)) {//filter tickets by chosen labels
            const activeLabels= filterLabels.filter(label=>label.active)
            const filterByLabels = (ticket)=>{
                if(!ticket.labels)return false;
                return activeLabels.every(label => {
                    return ticket.labels.includes(label.name)               
                });
            }              
            filteredTickets= filteredTickets.filter(filterByLabels)
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
        const optionsWithLabels=options.slice(0)
        optionsWithLabels.filterLabels=getAvailableLabels(tickets)
        setOptions(optionsWithLabels)
    }
    const activeLabelFilters = options.filterLabels.filter(label=>label.active);
    const ticketsHidden = ticketsToDisplay.filter(ticket=>ticket.hide);
    if (ticketsToDisplay[0]==='loading'){
        
        return (<div>
        {/* <Search search={searchTickets}/> */}
        <h1>LOADING</h1>
        </div>
        )
    }else 
    return (
        <>
            <Sidebar 
                    options={{ ...options }} 
                    setOptions={setOptions} 
                    labels={options.filterLabels}
                />
            <main id='name' style={{marginRight:options.displayMenu?'25%':0}}>
                
                <IconButton aria-label="menuButton" onClick={toggleMenu}>
                    <MenuIcon />
                </IconButton>
                <div id='optionsDisplay'>
                    <p>{renderTickets().length}/{ticketsToDisplay.length} of available Tickets displayed </p>
                    <p> filter by labels: {
                        activeLabelFilters.length?
                        <ul>
                            {
                        activeLabelFilters
                        .map(label=><li key={label.name}>{label.name}</li>)
                            }
                        </ul>
                        :'none'}
                    </p>
                    <p> closed tickets: {options.hideDone? 'hidden':'shown'} </p>
                    <p> time range: {options.timeRange.active?options.timeRange.range:'all'} </p>
                </div>
                <Search 
                    search={searchTickets}
                    id='searchInput'
                    placeholder='search a title'
                />
                <ShowButton 
                hiddenTickets={ticketsHidden.length} 
                function={unHideTickets}
                />
                <div id='shownTickets'>
                {renderTickets()}
                </div>
            
            </main>
            </>
  );
}

export default App;
