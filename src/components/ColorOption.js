import React from 'react';

const ColorOption = (props) => {
  const { value, style, changeColour } = props;
  return (
    <>
    <input 
        type="button" 
        value={value} 
        style={style} 
        onClick={changeColour} />
        <br/>
    </>
  );
};
export default ColorOption;
