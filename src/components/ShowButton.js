import React from 'react';

const ShowButton = (props) => {
  const { hiddenTickets, hideFunction } = props;
  if (hiddenTickets === 0) { return <></>; }
  return (
    <div className="showButton">
      <p>
        <span id="hideTicketsCounter">{hiddenTickets}</span>
        {' '}
        Tickets are hidden
        {' '}
        <button id="restoreHideTickets" onClick={hideFunction}>Show All Hidden</button>
      </p>

    </div>
  );
};
export default ShowButton;
