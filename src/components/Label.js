import React from 'react';

const Labels = (props) => {
  const { data } = props;
  if (data) {
    return (
      <>
        {data.map((label, index) => <button key={index} value={label} className={"label"} >{label}</button>)}
      </>
    );
  } else return <></>;
};
export default Labels;
