import React from 'react';


const Labels = (props) => {
    const {data} =props
    if(data){
         return(
        <>
            {data.map((label,index) => {
                return <button key={index} className='label'>{label}</button>
            })}
        </>
        )
    }else return <></>
}
export default Labels;