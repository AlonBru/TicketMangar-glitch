import React from 'react';

const Labels = (props) => {
  const { data } = props;
  if (data) {
    return (
      <>
        {data.map((label, index) => <button key={index} className="label">{label}</button>)}
      </>
    );
  } return <></>;
};
export default Labels;
