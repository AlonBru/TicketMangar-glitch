import React, {useState} from 'react';
import ColorOption from './ColorOption';

const Sidebar = (props) => {
  const { options, setOptions, labels, clearLabels } = props;
  const {
    hideDone, timeRange, filterLabels, ThemeColor,
  } = options;
  const [favColor,setFavColor] = useState('red')
  const changeFavColor =(e) => {
      setFavColor(e.target.value)
  }
  function changeLabelFilter(e) {
    const { id } = e.target;
    const labelToChange = filterLabels.find((label) => label.name === id);
    labelToChange.active = !labelToChange.active;
    setOptions(options);
  }
  function ChangeDisplayClosed() {
    hideDone.active = !hideDone.active;
    setOptions(options);
  }
  function changeTimeRange(e) {
    const { checked, value } = e.target;
    if (e.target.id === 'timeRangeCheckbox') {
      timeRange.active = checked;
      setOptions(options);
    } else if (timeRange.active) {
      const timeRanges = [
        'Last 24 Hours',
        'Last Week',
        'Last Month',
        'Last Year',
        'Last 2 Years',
        'Last 5 Years',
        'Always',
      ];
      timeRange.range = timeRanges[value];
      setOptions(options);
    }
  }
  function changeColour(e) {
    const { target } = e;
    const value = target.type === 'color'
      ? target.value
      : target.style.background;
    ThemeColor.color = value;
    setOptions(options);
  }

  return (
    <div id="sidebar" className={options.displayMenu ? 'open' : 'closed'}>
      <div id="themeColorOptions" className="optionContainer">
        <strong>Pick a Colour preset</strong>
        <br />
        <ColorOption value="Sea Green" style={{ background: '#2e8b57', color: 'white' }} changeColour={changeColour} />
        <ColorOption value="Deep Blue" style={{ background: '#313fb8', color: 'white' }} changeColour={changeColour} />
        <ColorOption value="Calming Teal" style={{ background: '#00a4a4', color: 'white' }} changeColour={changeColour} />
        <ColorOption value="Cheerful Pink" style={{ background: '#ffb6c1', color: 'white' }} changeColour={changeColour} />
        <ColorOption value="Chilled Sangria" style={{ background: '#8b0000', color: 'white' }} changeColour={changeColour} />
        <ColorOption value="Lines" style={{ background:'repeating-linear-gradient(45deg, #555, white 50px)', color: 'white' }} changeColour={changeColour} />
        <label htmlFor="favcolor">Or select your favorite color:</label>
        <input type="color" id="favcolor" name="favcolor" value={favColor} onChange={changeFavColor} onBlur={changeColour} />
        <br />
      </div>
      <div id="showClosedOptions" className="optionContainer">
        <input
          id="showClosed"
          name="showClosed"
          type="checkbox"
          checked={!hideDone.active}
          onChange={ChangeDisplayClosed}
        />
        <label htmlFor="showClosed">Show Closed</label>
      </div>
      <div id="timeRangeOptions" className="optionContainer">
        <input
          id="timeRangeCheckbox"
          name="showClosed"
          type="checkbox"
          checked={timeRange.active}
          onChange={changeTimeRange}
        />
        <label htmlFor="timeRangeCheckbox">filter by time</label>
        <br />
        <input
          disabled={!timeRange.active}
          id="timeRange"
          type="range"
          min="0"
          max="6"
          onChange={changeTimeRange}
        />
        <label htmlFor="timeRange">
          {' '}
          range:
          {timeRange.range}
        </label>
      </div>
      <div id="filterLabelsOptions" className="optionContainer">
        <h4> Filter Tickets with labels</h4>
        { labels.some(label=>label.active)?<button className='restoreLabels' onClick={clearLabels}>clear</button>:<></>}
        {labels.map((label) => (
          <div key={label.name} className="labelCheckbox">
            <input
              id={label.name}
              type="checkbox"
              checked={label.active}
              onChange={changeLabelFilter}
            />
            <label htmlFor={label.name}>{label.name}</label>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Sidebar;
