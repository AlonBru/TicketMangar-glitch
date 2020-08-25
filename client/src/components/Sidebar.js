import React from 'react';
import Labels from './Label';
// import FilterByLabel from './FilterByLabel';

const Sidebar = (props) => {
    const { options,setOptions } = props; 
    const { filterByLabel,hideClosed,timeRange } = options;
    
    function searchWithEnter(e){
        if(e.key!=='Enter'){
            return;
        }
        let {value} = e.target;
        filterByLabel.push({name: value, active:true})
        console.log(options.filterByLabel)
        value='';
        setOptions(options)
        
    }
    function changeLabelFilter(e){
        let { checked, id } = e.target
        let labelToChange = filterByLabel.find(label=>label.name===id);
        labelToChange.active = checked;
        console.log(11,options)
        setOptions(options)
    }
    return(
        <div id='sidebar'>
            <label><input type='checkbox' />Show Closed</label>
            <h2> Filter Tickets by label</h2>
            <input placeholder='enter ticket label' onKeyDown={searchWithEnter} />
           {filterByLabel.map(label=> 
           {return(
            <>
            <input id={label.name} type='checkbox' checked={label.active} onChange={changeLabelFilter} />
            <label htmlFor={label.name}>{label.name}</label>
           </>
           )}
           )}
           
            
        </div>
        )
    }
export default Sidebar;