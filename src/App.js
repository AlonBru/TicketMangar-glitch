import React, { useEffect, useState } from 'react';
import axios from 'axios';
import icon from './favicon.ico';
import Ticket from './components/Ticket';
import Search from './components/Search';
import Sidebar from './components/Sidebar';
import ShowButton from './components/ShowButton';
import './App.css';

function App() {

  const [options, setOptions] = useState({
    ThemeColor:{color:'#00a4a4'},
    displayMenu: false,
    filterLabels: [],
    hideDone: { active: false },
    timeRange: { active: false, range: 'Always' },
  });
  const [ticketsToDisplay, setTicketsToDisplay] = useState(['loading']);
  const getAvailableLabels = (tickets) => {
    const labelsArray = [];
    tickets.forEach((ticket) => {
      if (!ticket.labels) { return; }
      ticket.labels.forEach((label) => {
        if (!labelsArray.includes(label))labelsArray.push(label);
      });
    });
    console.log('Available Labels', labelsArray);
    const availableLabels = labelsArray.map((label) => Object({ name: label, active: false }));
    const optionsWithLabels = { ...options };
    optionsWithLabels.filterLabels = availableLabels;
    setOptions(optionsWithLabels);
  };
  async function grabTickets() {
    const tickets = (await axios.get('/api/tickets')).data;
    console.log('brought', tickets);
    getAvailableLabels(tickets);
    setTicketsToDisplay(tickets);
  }
  useEffect(() => {
    grabTickets();
  }, []);
  const toggleMenu = () => {
    const changedOptions = { ...options };
    changedOptions.displayMenu = !changedOptions.displayMenu;
    setOptions(changedOptions);
  };
  function hideTicket (id) {
    const copyOfTickets = ticketsToDisplay.slice();
    const ticketToHide = copyOfTickets.find((ticket) => ticket.id === id);
    ticketToHide.hide = true;
    setTicketsToDisplay(copyOfTickets);
  }
  const labelClick= (e) => {
      
      if (e.target.className==='label'){
          let label= e.target.innerHTML;
          console.log(label)
          const newOptions= {...options};
          let labelToSet = newOptions.filterLabels.find(element=>element.name===label);
          labelToSet.active = true;
          setOptions(newOptions)
      }
  }
  function renderTickets() {
    const { hideDone, timeRange, filterLabels } = options;
    // filters hidden tickets
    let filteredTickets = ticketsToDisplay.filter((ticket) => (!ticket.hide));
    // filters by options (if they are active)
    if (hideDone.active) { // filter done tickets
      const filterByDone = (ticket) => (!ticket.done);
      filteredTickets = filteredTickets.filter(filterByDone);
    }
    if (timeRange.active) { // filter tickets by creation time
      const filterByTime = (ticket) => {
        const { creationTime } = ticket;
        const now = Date.now();
        const timeRangeValues = {
          'Last 24 Hours': now - 86400000,
          'Last Week': now - (7 * 86400000),
          'Last Month': now - (31 * 86400000),
          'Last Year': now - (345 * 86400000),
          'Last 2 Years': now - (345 * 86400000 * 2),
          'Last 5 Years': now - (345 * 86400000 * 5),
          Always: 0,
        };
        return (creationTime > timeRangeValues[timeRange.range]);
      };
      filteredTickets = filteredTickets.filter(filterByTime);
    }
    if (filterLabels.some((label) => label.active)) { // filter tickets by chosen labels
      const activeLabels = filterLabels.filter((label) => label.active);
      const filterByLabels = (ticket) => {
        if (!ticket.labels) return false;
        return activeLabels.every((label) => ticket.labels.includes(label.name));
      };
      filteredTickets = filteredTickets.filter(filterByLabels);
    }

    return filteredTickets.map((ticket) => (
      <Ticket
        key={ticket.id}
        data={ticket}
        onHide={hideTicket}
        update={grabTickets}
        options={options}
        labelClick={labelClick}
      />
    ));
  }
  function unHideTickets() {
    const newTickets = ticketsToDisplay.map((ticket) => {
      if (ticket.hide) { ticket.hide = false; }
      return ticket;
    });
    setTicketsToDisplay(newTickets);
  }
  async function searchTickets(e) {
    const query = e.target.value;
    const tickets = (await axios.get(`/api/tickets?searchText=${query}`)).data;
    setTicketsToDisplay(tickets);
    getAvailableLabels(tickets);
  }
  const activeLabelFilters = options.filterLabels.filter((label) => label.active);
  const ticketsHidden = ticketsToDisplay.filter((ticket) => ticket.hide);
function checkForLabels(str){
    console.log(ticketsToDisplay.filter(ticket=>{
        if (!ticket.labels) return false;
        return ticket.labels.includes(str)
    }).length,str)
    }
checkForLabels('Corvid')
  if (ticketsToDisplay[0] === 'loading') {
    return (
      <div>
        {/* <Search search={searchTickets}/> */}
        <h1>LOADING</h1>
      </div>
    );
  }
 
return (
    <>
    <header style={{background:options.ThemeColor.color}}>
    
    <img id='logo' src={icon} alt='icon'/>
    <h1> Ticket Master</h1>
    <Search
          search={searchTickets}
          id="searchInput"
          placeholder="search a title"
        /> 
    </header>
    <div id="optionsStatus">
    <span id='labelStatus' className='status'>
        filter by labels:
        {
            activeLabelFilters.length
            ? (
                <ul>
                {
                    activeLabelFilters
                    .map((label) => <li key={label.name}>{label.name}</li>)
                }
                </ul>
            )
            : 'none'
        }
    </span>
    <span  id='doneStatus' className='status'>
        closed tickets:
        {options.hideDone ? 'hidden' : 'shown'}
    </span>
    <span  id='timeStatus' className='status'>
        time range:
        {options.timeRange.active ? options.timeRange.range : 'all'}
    </span>
    </div>
    
    <div id='ticketCounterContainer'>
        <span id='ticketCounter'>
        {renderTickets().length}
        /
        {ticketsToDisplay.length}
        {' '}
        of available Tickets displayed
        {' '}
        </span>
        <ShowButton
            hiddenTickets={ticketsHidden.length}
            function={unHideTickets}
        />
    </div>
    <main id="main" >
        <button 
        id='menuButton'
        className={

            options.displayMenu
            ?"open is-active hamburger hamburger--arrow-r "
            :'hamburger hamburger--arrow-r '
        }
        type="button" 
        onClick={toggleMenu
        }>
            <span class="hamburger-box ">
                <span class="hamburger-inner"></span>
            </span>
        </button>
        <Sidebar
        options={{ ...options }}
        setOptions={setOptions}
        labels={options.filterLabels}
    />
        <div 
        id="shownTickets" 
        style={{
            marginRight:options.displayMenu 
            ?'25%' 
            : 0 }}>
          {renderTickets()}
        </div>
        
    </main>
    </>
  );
}

export default App;
