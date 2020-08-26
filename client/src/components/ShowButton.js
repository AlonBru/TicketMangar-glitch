import React from 'react';

const ShowButton = (props) => {
  const { hiddenTickets } = props;
  if (hiddenTickets === 0) { return <></>; }
  return (
    <div className="showButton">
      <p>
        <span id="hideTicketsCounter">{hiddenTickets}</span>
        {' '}
        Tickets are hidden
        {' '}
        <button id="restoreHideTickets" onClick={props.function}>Show All Hidden</button>
      </p>

    </div>
  );
};
export default ShowButton;
