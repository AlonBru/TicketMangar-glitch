import React from 'react';


const Sidebar = (props) => {
    const { options,setOptions } = props; 
    const { hideClosed, timeRange, filterByLabels} = options;
    
    function searchWithEnter(e){
        if(e.key!=='Enter'){
            return;
        }
        let {value} = e.target;
        filterByLabels.push({name: value, active:true})
        console.log(options.filterByLabels)
        value='';
        setOptions(options)
        
    }
    function changeLabelFilter(e){
        let { checked, id } = e.target
        let labelToChange = filterByLabels.find(label=>label.name===id);
        labelToChange.active = checked;
        setOptions(options)
    }
    function displayClosed(e){
        let { checked, id } = e.target
        hideClosed.active = !checked
        setOptions(options)
    }
    function changeTimeRange(e){
        let { checked, value, id } = e.target
        if(e.target.id==='timeRangeCheckbox'){
            timeRange.active = checked;
            setOptions(options)
        }else if(timeRange.active){
            const timeRanges =[
                "Today",
                "Last Week",
                "Last Month",
                "Last Year",
                "Last 2 Years",
                "Last 5 Years",
                "Forever",
            ]
            timeRange.range=timeRanges[value]
            setOptions(options)
        
        }
    }
    return(
        <div id='sidebar'>
            <input 
                id='showClosed' 
                name='showClosed' 
                type='checkbox' 
                checked={hideClosed.active} 
                onChange={displayClosed} 
            />
            <label htmlFor='showClosed'>Show Closed</label><br/>
            
            <input 
                id='timeRangeCheckbox' 
                name='showClosed' 
                type='checkbox' 
                checked={timeRange.active} 
                onChange={changeTimeRange} 
            />
            <label htmlFor='timeRangeCheckbox'>filter by time</label>
            <input 
                disabled={!timeRange.active}
                id='timeRange' 
                type='range' 
                min='0'
                max='6'
                onChange={changeTimeRange}
            />
            <label htmlFor='timeRange'> range: {timeRange.range}</label>
           
            
            <h2> Filter Tickets by label</h2>
            <input placeholder='enter ticket label' onKeyDown={searchWithEnter} />
           {filterByLabels.map(label=> 
           {return(
            <>
            <input 
                id={label.name} 
                type='checkbox' 
                checked={label.active} 
                onChange={changeLabelFilter} 
            />
            <label htmlFor={label.name}>{label.name}</label>
           </>
           )}
           )}
           
            
        </div>
        )
    }
export default Sidebar;