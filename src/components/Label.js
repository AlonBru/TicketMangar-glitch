import React from 'react';

const Labels = ({data = []}) => {
    return (
      <>
        {data.length?<strong>Labels: </strong>:''} {data.map((label) => <button key={label} value={label} className="label">{label}</button>)}
      </>
    );
  
};
export default Labels;
