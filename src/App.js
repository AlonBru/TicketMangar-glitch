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
    ThemeColor: { color: '#00a4a4' },
    displayMenu: false,
    filterLabels: [],
    hideDone: { active: false },
    timeRange: { active: false, range: 'Always' }
  });
  const [ticketsToDisplay, setTicketsToDisplay] = useState(['loading']);
  const [ query,setQuery]=useState('')
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
    searchTickets();
  }, []);
  const toggleMenu = () => {
    const changedOptions = { ...options };
    changedOptions.displayMenu = !changedOptions.displayMenu;
    setOptions(changedOptions);
  };
  function hideTicket(id) {
    const copyOfTickets = ticketsToDisplay.slice();
    const ticketToHide = copyOfTickets.find((ticket) => ticket.id === id);
    ticketToHide.hide = true;
    setTicketsToDisplay(copyOfTickets);
  }
  const labelClick = (e) => {
    if (e.target.className === 'label') {
      const label = e.target.innerHTML;
      const newOptions = { ...options };
      const labelToSet = newOptions.filterLabels.find((element) => element.name === label);
      labelToSet.active = true;
      setOptions(newOptions);
    }
  };
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
        data={ticket}
        onHide={hideTicket}
        update={searchTickets}
        options={options}
        labelClick={labelClick}
      />
    ));
  }
  const displayedTickets = renderTickets()
  let ticketCount = displayedTickets.length

  function unHideTickets() {
    const newTickets = ticketsToDisplay.map((ticket) => {
      if (ticket.hide) { ticket.hide = false; }
      return ticket;
    });
    setTicketsToDisplay(newTickets);
  }
  async function searchTickets(e={target:null}) {
      let searchQuery=e.target? e.target.value : query;
      if(searchQuery!==query){setQuery(searchQuery)}
    const tickets = (await axios.get(`/api/tickets?searchText=${searchQuery}`)).data;
    setTicketsToDisplay(tickets);
    getAvailableLabels(tickets);
  }
  const activeLabelFilters = options.filterLabels.filter((label) => label.active);
  const ticketsHidden = ticketsToDisplay.filter((ticket) => ticket.hide);
  const clearLabels = () =>{
      const newOptions={...options}
      newOptions.filterLabels= options.filterLabels.map(label=>{
          label.active=false;
          return label
      })
      setOptions(newOptions)
  }
  return (
    <>
      <header style={{ background: options.ThemeColor.color }}>

        <img id="logo" src={icon} alt="icon" />
        <h1> Ticket Master</h1>
        <Search
          search={searchTickets}
          id="searchInput"
          placeholder="search a title"
        />
      </header>
      <div id="optionsStatus">
        <span id="labelStatus" className="status">
          filter by labels:{' '}
          {
            activeLabelFilters.length
              ? (
                  <>
                <button className='restoreLabels' onClick={clearLabels}>clear</button>
                <ul>
                  {
                    activeLabelFilters
                      .map((label) => <li key={label.name}>{label.name}</li>)
                  }
                </ul>
                </>
              )
              :'none'
          }
        </span>
        <span id="doneStatus" className="status">
          closed tickets:{' '}
          {options.hideDone.active ? 'hidden' : 'shown'}
        </span>
        <span id="timeStatus" className="status">
          time range:{' '}
          {options.timeRange.active ? options.timeRange.range : 'all'}
        </span>
      </div>

      <div id="ticketCounterContainer">
        <span id="ticketCounter">
          {ticketCount}
          /
          {ticketsToDisplay.length}
          {' '}
          of available Tickets displayed
          {' '}
        </span>
        <ShowButton
          hiddenTickets={ticketsHidden.length}
          hideFunction={unHideTickets}
        />
      </div>
      <main id="main">
        <button
          id="menuButton"
          className={
            options.displayMenu
              ? 'open is-active hamburger hamburger--arrow-r '
              : 'hamburger hamburger--arrow-r '
          }
          type="button"
          onClick={toggleMenu}
        >
          <span className="hamburger-box ">
            <span className="hamburger-inner" />
          </span>
        </button>
        <Sidebar
          options={{ ...options }}
          setOptions={setOptions}
          labels={options.filterLabels}
          clearLabels={clearLabels}
        />
        <div
          id="shownTickets"
          style={{
            marginRight: options.displayMenu
              ? '25%'
              : 0,
          }}
        >
          {displayedTickets}
        </div>

      </main>
    </>
  );
}

export default App;
