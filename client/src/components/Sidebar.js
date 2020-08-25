import React from 'react';
import Search from './Search';


const Sidebar = (props) => {
    const { options,setOptions,labels } = props; 
    const { hideDone, timeRange, filterLabels} = options;
    
    function changeLabelFilter(e){
        let { checked, id } = e.target
        let labelToChange = filterLabels.find(label=>label.name===id);
        labelToChange.active = !labelToChange.active;
        console.log(options)
        setOptions(options)
    }
    function displayClosed(e){
        let { checked, id } = e.target
        hideDone.active = !checked
        setOptions(options)
    }
    function changeTimeRange(e){

        let { checked, value, id } = e.target
        if(e.target.id==='timeRangeCheckbox'){
            timeRange.active = checked;
            setOptions(options)
        }else if(timeRange.active){
            const timeRanges =[
                "Last 24 Hours",
                "Last Week",
                "Last Month",
                "Last Year",
                "Last 2 Years",
                "Last 5 Years",
                "Always",
            ]
            timeRange.range=timeRanges[value]
            setOptions(options)
        
        }
    }
    return(
        <div id='sidebar'>
            <div className='optionContainer'>
                <input 
                    id='showClosed' 
                    name='showClosed' 
                    type='checkbox' 
                    checked={!hideDone.active} 
                    onChange={displayClosed} 
            />
            <label htmlFor='showClosed'>Show Closed</label><br/>
            </div>
            
            <div className='optionContainer'>
                <input 
                    id='timeRangeCheckbox' 
                    name='showClosed' 
                    type='checkbox' 
                    checked={timeRange.active} 
                    onChange={changeTimeRange} 
                />
                <label htmlFor='timeRangeCheckbox'>filter by time</label><br/>
                <input 
                    disabled={!timeRange.active}
                    id='timeRange' 
                    type='range' 
                    min='0'
                    max='6'
                    onChange={changeTimeRange}
                />
                <label htmlFor='timeRange'> range: {timeRange.range}</label>
            </div>

            <h2> Filter Tickets by label</h2>
            <Search Search id='labeFilterSearch' placeholder='enter ticket label' />{/*FIX */}
           {labels.map(label=> 
           {return(
            <div key={label.name} className='optionContainer'>
                <input 
                    id={label.name} 
                    type='checkbox' 
                    checked={label.active} 
                    onChange={changeLabelFilter} 
                />
                <label htmlFor={label.name}>{label.name}</label>
            </div>
           )}
           )}
           
            
        </div>
        )
    }
export default Sidebar;