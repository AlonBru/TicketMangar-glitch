import React from 'react';


const Labels = (props) => {
    if(props.data){
         return(
        <>
            {props.data.map((label,index) => {
                return <button key={index} className='label'>{label}</button>
            })}
        </>
        )
    }else return <></>
}
export default Labels;